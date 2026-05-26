/* ============================================================
   LernStar – App Logic
   ============================================================ */

// ---- State ----
const state = {
  view: 'home',
  gradeId: null,
  subjectId: null,
  exerciseId: null,
  quiz: { questions: [], index: 0, score: 0, answered: false },
  progress: JSON.parse(localStorage.getItem('ls_progress') || '{}'),
  introTimer: null,
  introInterval: null,
  // KI-Personalisierung
  userName: localStorage.getItem('ls_userName') || null,
  learningGoal: localStorage.getItem('ls_learningGoal') || 'normal', // 'normal','zap','abitur'
  onboardingDone: localStorage.getItem('ls_onboardingDone') === '1',
  currentTopicName: null,
  // Prüfungsmodus
  examMode: 'zap',
  examDiff: 2,
  examSubjectId: null,
  examSession: { questions: [], current: 0, score: 0, answers: [] },
};

// ============================================================
// SPEECH SYNTHESIS
// ============================================================
let currentUtterance = null;
let speechPaused     = false;
let _cachedVoice     = null;

function _pickMaleVoice() {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Log alle verfügbaren Stimmen (hilfreich zur Diagnose)
  console.log('[LernStar] Verfügbare Stimmen:', voices.map(v => `${v.name} (${v.lang})`));
  const de = voices.filter(v => v.lang === 'de-DE' || v.lang.startsWith('de'));
  const female = /anna|hedda|petra|sabine|marie|klara|julia|katja|female/i;
  const male   = /stefan|conrad|markus|yannick|hans|karl|georg|male/i;
  const result =
      // 1. Männliche Neural-/Online-Stimme (beste Qualität)
      de.find(v => male.test(v.name) && /(online|natural|neural)/i.test(v.name))
      // 2. Irgendeine männliche Stimme
      || de.find(v => male.test(v.name))
      // 3. Nicht-weibliche Neural-/Online-Stimme
      || de.find(v => /(online|natural|neural)/i.test(v.name) && !female.test(v.name))
      // 4. Nicht-weibliche Microsoft-Stimme
      || de.find(v => /microsoft/i.test(v.name) && !female.test(v.name))
      // 5. Erste nicht-weibliche Stimme
      || de.find(v => !female.test(v.name))
      || null;
  console.log('[LernStar] Gewählte Stimme:', result ? result.name : 'keine gefunden');
  return result;
}

function _getVoice() {
  if (!_cachedVoice) _cachedVoice = _pickMaleVoice();
  return _cachedVoice;
}

function _voiceLabel(v) {
  if (!v) return '🎤 Keine Stimme';
  if (/(natural|neural)/i.test(v.name)) return `✨ ${v.name}`;
  if (/online/i.test(v.name))           return `🔊 ${v.name}`;
  return `🎤 ${v.name}`;
}

// Voices-Cache sobald Browser sie geladen hat (Chrome async)
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.addEventListener('voiceschanged', () => {
    _cachedVoice = _pickMaleVoice();
    const badge = document.getElementById('voiceBadge');
    if (badge) badge.textContent = ELEVEN_KEY ? '✨ ElevenLabs: Thomas' : _voiceLabel(_cachedVoice);
  });
  if (speechSynthesis.getVoices().length) _cachedVoice = _pickMaleVoice();
}
// Badge sofort setzen falls ElevenLabs aktiv
document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('voiceBadge');
  if (badge && ELEVEN_KEY) badge.textContent = '✨ ElevenLabs: Thomas';
});

// ── VRM LIP SYNC ─────────────────────────────────────────
function _startLipSync() { window._vrmTalking = true;  window._vrmTalkT = 0; }
function _stopLipSync()  { window._vrmTalking = false; }
// ─────────────────────────────────────────────────────────


// ── ELEVENLABS TTS ────────────────────────────────────────
const ELEVEN_KEY      = 'e24b6be67594419d8f50afdfb195995a';
const ELEVEN_VOICE    = 'Fghah4fztZORbiKfIGAs'; // Thomas – Deutsch, Erzählung
const ELEVEN_MODEL    = 'eleven_multilingual_v2';
const _audioCache     = new Map();
let   _currentAudio   = null;

function _fracSpoken(z, n) {
  const LOOKUP = {
    '1/2':'einhalb',      '2/2':'ein Ganzes',
    '1/3':'eindrittel',   '2/3':'zweidrittel',   '3/3':'ein Ganzes',
    '1/4':'einviertel',   '2/4':'zweiviertel',   '3/4':'dreiviertel',   '4/4':'ein Ganzes',
    '1/5':'einfünftel',   '2/5':'zweifünftel',   '3/5':'dreifünftel',   '4/5':'vierfünftel',
    '1/6':'einsechstel',  '2/6':'zweisechstel',  '3/6':'dreisechstel',  '4/6':'viersechstel',  '5/6':'fünfsechstel',
    '1/7':'einsiebtel',   '2/7':'zweisiebtel',   '3/7':'dreisiebtel',
    '1/8':'einachtel',    '2/8':'zweiachtel',    '3/8':'dreiachtel',    '4/8':'vierachteln',
                          '5/8':'fünfachtel',    '6/8':'sechsachtel',   '7/8':'siebenachtel',
    '1/9':'einneuntel',   '2/9':'zweineuntel',
    '1/10':'einzehntel',  '2/10':'zweizehntel',  '3/10':'dreizehntel',
    '1/12':'einzwölftel', '5/12':'fünfzwölftel',
    '1/100':'ein Hundertstel', '1/1000':'ein Tausendstel',
  };
  const key = `${z}/${n}`;
  if (LOOKUP[key]) return LOOKUP[key];
  // Fallback: Zähler ausschreiben + Nenner-Endung
  const NUMS = ['null','ein','zwei','drei','vier','fünf','sechs','sieben',
                'acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn'];
  const DENS = {2:'halb',3:'drittel',4:'viertel',5:'fünftel',6:'sechstel',
                7:'siebtel',8:'achtel',9:'neuntel',10:'zehntel',12:'zwölftel'};
  const zi = parseInt(z), ni = parseInt(n);
  if (isNaN(zi) || isNaN(ni) || ni === 0) return `${z} durch ${n}`;
  const zStr = (zi >= 0 && zi < NUMS.length) ? NUMS[zi] : z;
  const nStr = DENS[ni] || `${n}-tel`;
  return `${zStr}${nStr}`;
}

function _mathToSpoken(t) {
  // 0. Physikalische Einheiten (vor Bruch-Erkennung!)
  t = t.replace(/\bm\/s²/g,  'Meter pro Sekunde Quadrat');
  t = t.replace(/\bm\/s\b/g, 'Meter pro Sekunde');
  t = t.replace(/\bkm\/h\b/g,'Kilometer pro Stunde');
  t = t.replace(/\bN\/m\b/g, 'Newton pro Meter');
  t = t.replace(/\bJ\/kg\b/g,'Joule pro Kilogramm');
  t = t.replace(/\bW\/m\b/g, 'Watt pro Meter');
  t = t.replace(/\bm\/s\b/g, 'Meter pro Sekunde');
  // Griechische Buchstaben
  t = t.replace(/\bα\b/g,'Alpha'); t = t.replace(/\bβ\b/g,'Beta');
  t = t.replace(/\bγ\b/g,'Gamma'); t = t.replace(/\bδ\b/g,'Delta');
  t = t.replace(/\bλ\b/g,'Lambda'); t = t.replace(/\bμ\b/g,'My');
  t = t.replace(/\bπ\b/g,'Pi'); t = t.replace(/\bσ\b/g,'Sigma');
  t = t.replace(/\bω\b/g,'Omega'); t = t.replace(/\bΩ\b/g,'Ohm');
  t = t.replace(/\bρ\b/g,'Rho'); t = t.replace(/\bΔ\b/g,'Delta');
  // Physik-Symbole
  t = t.replace(/\bFG\b/g,'Gewichtskraft'); t = t.replace(/\bFR\b/g,'Reibungskraft');
  t = t.replace(/\bF_G\b/g,'Gewichtskraft'); t = t.replace(/\bF_R\b/g,'Reibungskraft');
  // 1. LaTeX-Brüche: \frac{a}{b}
  t = t.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, (_, z, n) => _fracSpoken(z, n));
  // 2. Brüche im Text: 1/4, 2/4, 3/8 usw. (ALLE digit/slash/digit)
  t = t.replace(/(\d+)\/(\d+)/g, (_, z, n) => _fracSpoken(z, n));
  // 3. $-Dollarzeichen entfernen
  t = t.replace(/\$\$?([^$\n]+)\$\$?/g, '$1');
  // 4. Potenzen
  t = t.replace(/\^(\d+)/g, (_, e) => ` hoch ${e}`);
  t = t.replace(/²/g, ' Quadrat');
  t = t.replace(/³/g, ' Kubik');
  // 5. Wurzel
  t = t.replace(/\\sqrt\{([^}]+)\}/g, (_, x) => `Wurzel aus ${x}`);
  // 6. Operatoren zwischen Zahlen – kein Lookbehind (Safari-kompatibel!)
  //    (\d) nimmt letzte Ziffer vor Operator mit und gibt sie per $1 zurück
  //    (?=\d) schaut auf erste Ziffer nach Operator ohne sie zu verbrauchen
  t = t.replace(/(\d)\s*\+\s*(?=\d)/g,         '$1 plus ');
  t = t.replace(/(\d)\s*[−–]\s*(?=\d)/g,       '$1 minus ');  // Unicode-Minus & En-Dash
  t = t.replace(/(\d)\s*-\s*(?=\d)/g,           '$1 minus ');  // normaler Bindestrich
  t = t.replace(/(\d)\s*×\s*(?=\d)/g,           '$1 mal ');
  t = t.replace(/(\d)\s*·\s*(?=\d)/g,           '$1 mal ');
  t = t.replace(/(\d)\s*÷\s*(?=\d)/g,           '$1 geteilt durch ');
  t = t.replace(/(\d)\s*=\s*(?=\d)/g,           '$1 ist gleich ');
  t = t.replace(/(\d)\s*≤\s*(?=\d)/g,           '$1 kleiner gleich ');
  t = t.replace(/(\d)\s*≥\s*(?=\d)/g,           '$1 größer gleich ');
  t = t.replace(/(\d)\s*<\s*(?=\d)/g,           '$1 kleiner als ');
  t = t.replace(/(\d)\s*>\s*(?=\d)/g,           '$1 größer als ');
  // 7. Freistehende Sonderzeichen
  t = t.replace(/×/g, ' mal ');
  t = t.replace(/÷/g, ' geteilt durch ');
  t = t.replace(/\\cdot/g, ' mal ');
  t = t.replace(/\\times/g, ' mal ');
  t = t.replace(/\\div/g, ' geteilt durch ');
  // 8. Restliche LaTeX-Befehle
  t = t.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1');
  t = t.replace(/\\[a-zA-Z]+/g, '');
  // 9. Markdown bereinigen
  t = t.replace(/#{1,6}\s*/g, '');
  t = t.replace(/\*\*(.+?)\*\*/g, '$1');
  t = t.replace(/\*(.+?)\*/g, '$1');
  t = t.replace(/`[^`]+`/g, '');
  t = t.replace(/^[\-*]\s+/gm, '');
  t = t.replace(/\n{2,}/g, '. ').replace(/\n/g, ' ');
  t = t.replace(/\s{2,}/g, ' ').trim();
  return t;
}

async function _elevenFetch(text) {
  const key = text.slice(0, 140);
  if (_audioCache.has(key)) return _audioCache.get(key);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE}`,
    {
      method: 'POST',
      headers: { 'xi-api-key': ELEVEN_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: ELEVEN_MODEL,
        voice_settings: { stability: 0.42, similarity_boost: 0.72, style: 0.72, use_speaker_boost: true }
      })
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
  const url = URL.createObjectURL(await res.blob());
  if (_audioCache.size > 12) {
    const old = _audioCache.keys().next().value;
    URL.revokeObjectURL(_audioCache.get(old));
    _audioCache.delete(old);
  }
  _audioCache.set(key, url);
  return url;
}

function _elevenSpeakText(text, onDone) {
  const btn      = document.getElementById('playIntroBtn');
  const pauseBtn = document.getElementById('pauseIntroBtn');
  const stopBtn  = document.getElementById('stopIntroBtn');
  const avatar   = document.getElementById('avatarAnim');
  const fill     = document.getElementById('videoProgressFill');
  const timeEl   = document.getElementById('videoTime');

  if (btn) { btn.disabled = true; btn.textContent = '⏳ Lade Stimme…'; }
  if (pauseBtn) pauseBtn.classList.remove('hidden');
  if (stopBtn)  stopBtn.classList.remove('hidden');

  _elevenFetch(text).then(url => {
    const audio = new Audio(url);
    _currentAudio   = audio;
    currentUtterance = audio;

    audio.onplay = () => {
      if (btn) btn.textContent = '🔊 Spricht…';
      avatar.classList.add('talking');
      fill.style.transition = 'none'; fill.style.width = '0%';
      _startLipSync();
      state.introInterval = setInterval(() => {
        if (!audio.paused && audio.duration) {
          fill.style.width = Math.min(audio.currentTime / audio.duration, 0.98) * 100 + '%';
          timeEl.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
        }
      }, 120);
    };

    audio.onended = () => {
      clearInterval(state.introInterval);
      _stopLipSync();
      avatar.classList.remove('talking');
      fill.style.transition = 'width .4s'; fill.style.width = '100%';
      if (pauseBtn) pauseBtn.classList.add('hidden');
      if (stopBtn)  stopBtn.classList.add('hidden');
      if (btn) { btn.disabled = false; btn.textContent = '▶ Themen anhören'; }
      currentUtterance = null; _currentAudio = null;
      if (onDone) onDone();
    };
    audio.onerror = audio.onended;
    audio.play().catch(e => console.error('[LernStar] Audio-Fehler:', e));
  }).catch(err => {
    console.warn('[LernStar] ElevenLabs nicht verfügbar, Browser-Stimme wird verwendet:', err);
    currentUtterance = null; _currentAudio = null;
    _speakText(text, null, onDone, true);
  });
}

function _elevenSpeakSequential(text, onDone) {
  const avatar = document.getElementById('avatarAnim');
  const fill   = document.getElementById('videoProgressFill');
  const timeEl = document.getElementById('videoTime');
  if (avatar) avatar.classList.add('talking');

  _elevenFetch(text).then(url => {
    const audio = new Audio(url);
    _currentAudio   = audio;
    currentUtterance = audio;

    audio.onplay = () => {
      _startLipSync();
      if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
      state.introInterval = setInterval(() => {
        if (!audio.paused && audio.duration) {
          if (fill) fill.style.width = Math.min(audio.currentTime / audio.duration, 0.98) * 100 + '%';
          if (timeEl) timeEl.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
        }
      }, 120);
    };

    const finish = () => {
      clearInterval(state.introInterval);
      _stopLipSync();
      if (avatar) avatar.classList.remove('talking');
      currentUtterance = null; _currentAudio = null;
      if (onDone) onDone();
    };
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(finish);
  }).catch(err => {
    console.warn('[LernStar] ElevenLabs Sequential-Fehler, Fallback:', err);
    currentUtterance = null; _currentAudio = null;
    _speakSequential(text, onDone, true);
  });
}
// ─────────────────────────────────────────────────────────

// ---- Grade colors for card backgrounds ----
const GRADE_GRADIENTS = {
  klasse5:  'linear-gradient(135deg,#7C3AED,#A855F7)',
  klasse6:  'linear-gradient(135deg,#2563EB,#60A5FA)',
  klasse7:  'linear-gradient(135deg,#0D9488,#2DD4BF)',
  klasse8:  'linear-gradient(135deg,#059669,#34D399)',
  klasse9:  'linear-gradient(135deg,#D97706,#FBBF24)',
  klasse10: 'linear-gradient(135deg,#DC2626,#F87171)',
  klasse11: 'linear-gradient(135deg,#4F46E5,#818CF8)',
  klasse12: 'linear-gradient(135deg,#0E7490,#22D3EE)',
  klasse13: 'linear-gradient(135deg,#B45309,#F59E0B)',
};

const DIFF_STARS = { 1:'⭐', 2:'⭐⭐', 3:'⭐⭐⭐' };
const DIFF_LABEL = { 1:'Einfach', 2:'Mittel', 3:'Schwer' };

// ---- Topic Visual Illustrations (shown in video panel while narrating) ----
const TOPIC_VISUALS = {

  /* ===== KLASSE 5 MATHE ===== */
  'Natürliche Zahlen & Stellenwerte': `
    <svg viewBox="0 0 240 96" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:240px">
      <rect x="2" y="18" width="56" height="54" rx="6" fill="rgba(124,58,237,.45)" stroke="#7C3AED" stroke-width="1.5"/>
      <rect x="62" y="18" width="56" height="54" rx="6" fill="rgba(124,58,237,.25)" stroke="#7C3AED" stroke-width="1.5"/>
      <rect x="122" y="18" width="50" height="54" rx="6" fill="rgba(124,58,237,.15)" stroke="#7C3AED" stroke-width="1.5"/>
      <rect x="176" y="18" width="50" height="54" rx="6" fill="rgba(124,58,237,.08)" stroke="#7C3AED" stroke-width="1.5"/>
      <text x="30" y="52" fill="#FBBF24" font-size="22" font-weight="900" text-anchor="middle" font-family="sans-serif">4</text>
      <text x="90" y="52" fill="white" font-size="22" font-weight="900" text-anchor="middle" font-family="sans-serif">7</text>
      <text x="147" y="52" fill="white" font-size="22" font-weight="900" text-anchor="middle" font-family="sans-serif">2</text>
      <text x="201" y="52" fill="white" font-size="22" font-weight="900" text-anchor="middle" font-family="sans-serif">3</text>
      <text x="30" y="82" fill="rgba(255,255,255,.55)" font-size="9" text-anchor="middle" font-family="sans-serif">Tausend</text>
      <text x="90" y="82" fill="rgba(255,255,255,.55)" font-size="9" text-anchor="middle" font-family="sans-serif">Hundert</text>
      <text x="147" y="82" fill="rgba(255,255,255,.55)" font-size="9" text-anchor="middle" font-family="sans-serif">Zehn</text>
      <text x="201" y="82" fill="rgba(255,255,255,.55)" font-size="9" text-anchor="middle" font-family="sans-serif">Einer</text>
      <text x="120" y="12" fill="rgba(255,255,255,.4)" font-size="9" text-anchor="middle" font-family="sans-serif">Die Zahl 4.723</text>
    </svg>`,

  'Addition und Subtraktion': `
    <svg viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <text x="170" y="28" fill="rgba(255,255,255,.7)" font-size="17" font-family="monospace" text-anchor="end">1.247</text>
      <text x="170" y="56" fill="rgba(255,255,255,.7)" font-size="17" font-family="monospace" text-anchor="end">+  856</text>
      <line x1="50" y1="64" x2="170" y2="64" stroke="#FBBF24" stroke-width="2"/>
      <text x="170" y="88" fill="#FBBF24" font-size="19" font-family="monospace" text-anchor="end" font-weight="bold">2.103</text>
      <text x="14" y="60" fill="rgba(255,255,255,.4)" font-size="9" font-family="sans-serif">1</text>
      <text x="14" y="72" fill="rgba(255,255,255,.4)" font-size="8" font-family="sans-serif">Übertrag</text>
      <text x="100" y="106" fill="rgba(255,255,255,.4)" font-size="9" text-anchor="middle" font-family="sans-serif">Von rechts → links addieren</text>
    </svg>`,

  'Multiplikation und Division': `
    <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <text x="100" y="28" fill="white" font-size="18" font-weight="bold" text-anchor="middle" font-family="sans-serif">6 × 14 = <tspan fill="#FBBF24">84</tspan></text>
      <g opacity=".75">
        <rect x="10" y="38" width="22" height="18" rx="3" fill="#7C3AED"/><rect x="36" y="38" width="22" height="18" rx="3" fill="#7C3AED"/>
        <rect x="62" y="38" width="22" height="18" rx="3" fill="#7C3AED"/><rect x="88" y="38" width="22" height="18" rx="3" fill="#7C3AED"/>
        <rect x="114" y="38" width="22" height="18" rx="3" fill="#7C3AED"/><rect x="140" y="38" width="22" height="18" rx="3" fill="#7C3AED"/>
        <rect x="10" y="60" width="22" height="18" rx="3" fill="#5B21B6" opacity=".7"/><rect x="36" y="60" width="22" height="18" rx="3" fill="#5B21B6" opacity=".7"/>
        <rect x="62" y="60" width="22" height="18" rx="3" fill="#5B21B6" opacity=".7"/><rect x="88" y="60" width="22" height="18" rx="3" fill="#5B21B6" opacity=".7"/>
        <rect x="114" y="60" width="22" height="18" rx="3" fill="#5B21B6" opacity=".7"/><rect x="140" y="60" width="22" height="18" rx="3" fill="#5B21B6" opacity=".7"/>
      </g>
      <text x="170" y="72" fill="rgba(255,255,255,.4)" font-size="9" font-family="sans-serif">6 Reihen × 14</text>
    </svg>`,

  'Runden und Schätzen': `
    <svg viewBox="0 0 230 85" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:230px">
      <line x1="15" y1="44" x2="215" y2="44" stroke="rgba(255,255,255,.4)" stroke-width="2"/>
      <line x1="15" y1="37" x2="15" y2="51" stroke="rgba(255,255,255,.5)" stroke-width="2"/>
      <line x1="115" y1="35" x2="115" y2="53" stroke="rgba(255,255,255,.5)" stroke-width="2"/>
      <line x1="215" y1="37" x2="215" y2="51" stroke="#34D399" stroke-width="2.5"/>
      <text x="15" y="66" fill="rgba(255,255,255,.55)" font-size="11" text-anchor="middle" font-family="sans-serif">2.700</text>
      <text x="115" y="66" fill="rgba(255,255,255,.55)" font-size="11" text-anchor="middle" font-family="sans-serif">2.750</text>
      <text x="215" y="66" fill="#34D399" font-size="11" text-anchor="middle" font-family="sans-serif">2.800</text>
      <circle cx="165" cy="44" r="7" fill="#FBBF24"/>
      <text x="165" y="30" fill="#FBBF24" font-size="11" text-anchor="middle" font-family="sans-serif">2.764</text>
      <path d="M165,38 L165,24" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="120" y="82" fill="rgba(255,255,255,.4)" font-size="9" text-anchor="middle" font-family="sans-serif">Ziffer 6 ≥ 5 → aufrunden auf 2.800</text>
    </svg>`,

  'Einführung in Brüche': `
    <svg viewBox="0 0 190 110" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:190px">
      <circle cx="60" cy="58" r="44" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
      <path d="M60,58 L60,14 A44,44 0 1,1 16.1,79.1 Z" fill="#7C3AED" opacity=".85"/>
      <text x="50" y="52" fill="white" font-size="15" font-weight="bold" font-family="sans-serif">3</text>
      <line x1="42" y1="58" x2="68" y2="58" stroke="white" stroke-width="2"/>
      <text x="50" y="74" fill="white" font-size="15" font-weight="bold" font-family="sans-serif">4</text>
      <text x="60" y="108" fill="rgba(255,255,255,.5)" font-size="9" text-anchor="middle" font-family="sans-serif">3 von 4 Teilen</text>
      <rect x="120" y="20" width="60" height="28" rx="5" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
      <text x="150" y="39" fill="#FBBF24" font-size="12" text-anchor="middle" font-family="sans-serif">Zähler ↑</text>
      <rect x="120" y="60" width="60" height="28" rx="5" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
      <text x="150" y="79" fill="rgba(255,255,255,.6)" font-size="12" text-anchor="middle" font-family="sans-serif">Nenner ↓</text>
    </svg>`,

  'Geometrie: Flächen und Umfang': `
    <svg viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <rect x="30" y="22" width="115" height="60" rx="3" fill="rgba(124,58,237,.25)" stroke="#7C3AED" stroke-width="2"/>
      <line x1="30" y1="10" x2="145" y2="10" stroke="#FBBF24" stroke-width="1.5"/>
      <line x1="30" y1="7" x2="30" y2="13" stroke="#FBBF24" stroke-width="1.5"/>
      <line x1="145" y1="7" x2="145" y2="13" stroke="#FBBF24" stroke-width="1.5"/>
      <text x="87" y="8" fill="#FBBF24" font-size="11" text-anchor="middle" font-family="sans-serif">l</text>
      <line x1="158" y1="22" x2="158" y2="82" stroke="#34D399" stroke-width="1.5"/>
      <line x1="155" y1="22" x2="161" y2="22" stroke="#34D399" stroke-width="1.5"/>
      <line x1="155" y1="82" x2="161" y2="82" stroke="#34D399" stroke-width="1.5"/>
      <text x="168" y="56" fill="#34D399" font-size="11" font-family="sans-serif">b</text>
      <text x="87" y="56" fill="white" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">A = l × b</text>
      <text x="87" y="102" fill="rgba(255,255,255,.55)" font-size="10" text-anchor="middle" font-family="sans-serif">U = 2 × (l + b)</text>
    </svg>`,

  'Brüche addieren und subtrahieren': `
    <svg viewBox="0 0 210 82" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:210px">
      <rect x="8" y="8" width="60" height="18" rx="3" fill="#7C3AED" opacity=".85"/>
      <rect x="72" y="8" width="30" height="18" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <rect x="104" y="8" width="30" height="18" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <text x="5" y="5" fill="rgba(255,255,255,.45)" font-size="8" font-family="sans-serif">⅓</text>
      <rect x="8" y="32" width="30" height="18" rx="3" fill="#34D399" opacity=".8"/>
      <rect x="41" y="32" width="30" height="18" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <rect x="74" y="32" width="30" height="18" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <rect x="107" y="32" width="30" height="18" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <rect x="140" y="32" width="30" height="18" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <rect x="173" y="32" width="30" height="18" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <text x="5" y="29" fill="rgba(255,255,255,.45)" font-size="8" font-family="sans-serif">⅙</text>
      <rect x="8" y="56" width="90" height="18" rx="3" fill="#FBBF24" opacity=".9"/>
      <rect x="101" y="56" width="90" height="18" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <text x="5" y="53" fill="rgba(255,255,255,.45)" font-size="8" font-family="sans-serif">½</text>
      <text x="200" y="68" fill="#FBBF24" font-size="10" font-family="sans-serif">= ½</text>
    </svg>`,

  'Brüche multiplizieren und dividieren': `
    <svg viewBox="0 0 200 95" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <text x="100" y="18" fill="white" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">½ × ¾ = <tspan fill="#FBBF24">3/8</tspan></text>
      <rect x="10" y="28" width="50" height="35" rx="3" fill="#7C3AED" opacity=".75"/>
      <rect x="62" y="28" width="50" height="35" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <rect x="10" y="66" width="50" height="25" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <rect x="62" y="66" width="50" height="25" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <text x="35" y="49" fill="white" font-size="10" text-anchor="middle" font-family="sans-serif">1×3</text>
      <text x="35" y="62" fill="rgba(255,255,255,.45)" font-size="9" text-anchor="middle" font-family="sans-serif">2×4</text>
      <text x="140" y="44" fill="#FBBF24" font-size="20" font-weight="bold" text-anchor="middle" font-family="sans-serif">3</text>
      <line x1="122" y1="52" x2="158" y2="52" stroke="#FBBF24" stroke-width="2"/>
      <text x="140" y="68" fill="#FBBF24" font-size="20" font-weight="bold" text-anchor="middle" font-family="sans-serif">8</text>
      <text x="100" y="94" fill="rgba(255,255,255,.4)" font-size="9" text-anchor="middle" font-family="sans-serif">Zähler×Zähler ÷ Nenner×Nenner</text>
    </svg>`,

  'Dezimalzahlen': `
    <svg viewBox="0 0 220 88" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:220px">
      <rect x="4" y="16" width="46" height="50" rx="5" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
      <rect x="54" y="16" width="46" height="50" rx="5" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
      <circle cx="112" cy="64" r="5" fill="#FBBF24"/>
      <rect x="123" y="16" width="40" height="50" rx="5" fill="rgba(124,58,237,.5)" stroke="#7C3AED" stroke-width="1.5"/>
      <rect x="168" y="16" width="40" height="50" rx="5" fill="rgba(52,211,153,.3)" stroke="#34D399" stroke-width="1.5"/>
      <text x="27" y="48" fill="white" font-size="22" font-weight="bold" text-anchor="middle" font-family="monospace">3</text>
      <text x="77" y="48" fill="white" font-size="22" font-weight="bold" text-anchor="middle" font-family="monospace">7</text>
      <text x="143" y="48" fill="#FBBF24" font-size="22" font-weight="bold" text-anchor="middle" font-family="monospace">4</text>
      <text x="188" y="48" fill="#34D399" font-size="22" font-weight="bold" text-anchor="middle" font-family="monospace">5</text>
      <text x="27" y="76" fill="rgba(255,255,255,.5)" font-size="8" text-anchor="middle" font-family="sans-serif">Zehn.</text>
      <text x="77" y="76" fill="rgba(255,255,255,.5)" font-size="8" text-anchor="middle" font-family="sans-serif">Einer</text>
      <text x="143" y="76" fill="#FBBF24" font-size="8" text-anchor="middle" font-family="sans-serif">Zehnt.</text>
      <text x="188" y="76" fill="#34D399" font-size="8" text-anchor="middle" font-family="sans-serif">Hund.</text>
      <text x="110" y="10" fill="rgba(255,255,255,.4)" font-size="8" text-anchor="middle" font-family="sans-serif">37,45</text>
    </svg>`,

  'Proportionale Zuordnungen': `
    <svg viewBox="0 0 200 88" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <rect x="8" y="8" width="184" height="72" rx="5" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.2)" stroke-width="1.5"/>
      <line x1="8" y1="34" x2="192" y2="34" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
      <line x1="100" y1="8" x2="100" y2="80" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
      <text x="54" y="26" fill="rgba(255,255,255,.55)" font-size="11" text-anchor="middle" font-family="sans-serif">Stifte</text>
      <text x="146" y="26" fill="rgba(255,255,255,.55)" font-size="11" text-anchor="middle" font-family="sans-serif">Preis</text>
      <text x="54" y="52" fill="white" font-size="13" text-anchor="middle" font-family="sans-serif">3</text>
      <text x="146" y="52" fill="white" font-size="13" text-anchor="middle" font-family="sans-serif">1,50 €</text>
      <text x="54" y="70" fill="#FBBF24" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">7</text>
      <text x="146" y="70" fill="#FBBF24" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">3,50 €</text>
    </svg>`,

  'Symmetrie und Spiegelung': `
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <line x1="100" y1="4" x2="100" y2="96" stroke="#FBBF24" stroke-width="2" stroke-dasharray="5,4"/>
      <path d="M94,18 Q60,8 38,34 Q18,58 56,72 Q76,78 94,66 Z" fill="#7C3AED" opacity=".75"/>
      <path d="M106,18 Q140,8 162,34 Q182,58 144,72 Q124,78 106,66 Z" fill="#7C3AED" opacity=".75"/>
      <ellipse cx="100" cy="44" rx="5" ry="26" fill="#FDDCB5" opacity=".75"/>
      <text x="100" y="96" fill="rgba(255,255,255,.45)" font-size="8" text-anchor="middle" font-family="sans-serif">Achsensymmetrie</text>
    </svg>`,

  /* ===== KLASSE 6/7 MATHE ===== */
  'Negative Zahlen und rationale Zahlen': `
    <svg viewBox="0 0 230 68" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:230px">
      <line x1="10" y1="34" x2="220" y2="34" stroke="rgba(255,255,255,.45)" stroke-width="2"/>
      <polygon points="218,30 228,34 218,38" fill="rgba(255,255,255,.45)"/>
      <line x1="28" y1="27" x2="28" y2="41" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <text x="28" y="54" fill="rgba(255,255,255,.55)" font-size="11" text-anchor="middle" font-family="sans-serif">−7</text>
      <line x1="68" y1="27" x2="68" y2="41" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <text x="68" y="54" fill="rgba(255,255,255,.55)" font-size="11" text-anchor="middle" font-family="sans-serif">−3</text>
      <line x1="118" y1="24" x2="118" y2="44" stroke="white" stroke-width="2.5"/>
      <text x="118" y="58" fill="white" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">0</text>
      <line x1="168" y1="27" x2="168" y2="41" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <text x="168" y="54" fill="rgba(255,255,255,.55)" font-size="11" text-anchor="middle" font-family="sans-serif">+3</text>
      <circle cx="205" cy="34" r="8" fill="#FBBF24"/>
      <text x="205" y="54" fill="#FBBF24" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">+5</text>
      <text x="118" y="18" fill="rgba(255,255,255,.4)" font-size="9" text-anchor="middle" font-family="sans-serif">(−)×(−) = (+)</text>
    </svg>`,

  'Lineare Gleichungen lösen': `
    <svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:220px">
      <rect x="18" y="10" width="88" height="48" rx="5" fill="rgba(124,58,237,.35)" stroke="#7C3AED" stroke-width="1.5"/>
      <rect x="114" y="10" width="88" height="48" rx="5" fill="rgba(52,211,153,.25)" stroke="#34D399" stroke-width="1.5"/>
      <text x="62" y="38" fill="white" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">2x + 4</text>
      <text x="158" y="38" fill="white" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">14</text>
      <line x1="18" y1="58" x2="202" y2="58" stroke="rgba(255,255,255,.3)" stroke-width="2"/>
      <line x1="110" y1="58" x2="110" y2="76" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
      <polygon points="102,74 110,84 118,74" fill="rgba(255,255,255,.35)"/>
      <text x="110" y="98" fill="#FBBF24" font-size="11" text-anchor="middle" font-family="sans-serif">−4 → 2x=10 → ÷2 → x = 5</text>
    </svg>`,

  'Dreiecke: Arten und Winkelsumme': `
    <svg viewBox="0 0 200 112" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <polygon points="100,8 18,98 182,98" fill="rgba(124,58,237,.22)" stroke="#7C3AED" stroke-width="2"/>
      <path d="M100,8 m14,16 a20,20 0 0,1 -28,0" fill="none" stroke="#FBBF24" stroke-width="1.5"/>
      <path d="M18,98 m20,-5 a18,18 0 0,1 5,-16" fill="none" stroke="#34D399" stroke-width="1.5"/>
      <path d="M182,98 m-20,-5 a18,18 0 0,0 -5,-16" fill="none" stroke="white" stroke-width="1.5"/>
      <text x="100" y="40" fill="#FBBF24" font-size="13" text-anchor="middle" font-family="sans-serif">α</text>
      <text x="37" y="85" fill="#34D399" font-size="13" font-family="sans-serif">β</text>
      <text x="158" y="85" fill="white" font-size="13" font-family="sans-serif">γ</text>
      <text x="100" y="110" fill="rgba(255,255,255,.7)" font-size="11" text-anchor="middle" font-family="sans-serif">α + β + γ = <tspan fill="#FBBF24" font-weight="bold">180°</tspan></text>
    </svg>`,

  'Terme und Variablen': `
    <svg viewBox="0 0 200 70" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <text x="100" y="18" fill="white" font-size="15" font-weight="bold" text-anchor="middle" font-family="sans-serif">3x + 2x = <tspan fill="#FBBF24">5x</tspan></text>
      <rect x="5" y="26" width="32" height="32" rx="4" fill="#7C3AED" opacity=".75"/><text x="21" y="47" fill="white" font-size="13" text-anchor="middle" font-family="sans-serif">x</text>
      <rect x="40" y="26" width="32" height="32" rx="4" fill="#7C3AED" opacity=".75"/><text x="56" y="47" fill="white" font-size="13" text-anchor="middle" font-family="sans-serif">x</text>
      <rect x="75" y="26" width="32" height="32" rx="4" fill="#7C3AED" opacity=".75"/><text x="91" y="47" fill="white" font-size="13" text-anchor="middle" font-family="sans-serif">x</text>
      <text x="116" y="47" fill="rgba(255,255,255,.55)" font-size="18" text-anchor="middle" font-family="sans-serif">+</text>
      <rect x="128" y="26" width="30" height="32" rx="4" fill="#34D399" opacity=".6"/><text x="143" y="47" fill="white" font-size="13" text-anchor="middle" font-family="sans-serif">x</text>
      <rect x="162" y="26" width="30" height="32" rx="4" fill="#34D399" opacity=".6"/><text x="177" y="47" fill="white" font-size="13" text-anchor="middle" font-family="sans-serif">x</text>
    </svg>`,

  'Prozentrechnungen': `
    <svg viewBox="0 0 200 108" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <circle cx="75" cy="56" r="42" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.2)" stroke-width="8"/>
      <circle cx="75" cy="56" r="42" fill="none" stroke="#FBBF24" stroke-width="8"
        stroke-dasharray="264" stroke-dashoffset="198" stroke-linecap="round" transform="rotate(-90 75 56)"/>
      <text x="75" y="52" fill="white" font-size="16" font-weight="bold" text-anchor="middle" font-family="sans-serif">25%</text>
      <text x="75" y="68" fill="rgba(255,255,255,.5)" font-size="10" text-anchor="middle" font-family="sans-serif">= 20 €</text>
      <text x="152" y="44" fill="rgba(255,255,255,.65)" font-size="12" text-anchor="middle" font-family="sans-serif">80 €</text>
      <text x="152" y="58" fill="rgba(255,255,255,.45)" font-size="10" text-anchor="middle" font-family="sans-serif">× 0,25</text>
      <line x1="128" y1="63" x2="176" y2="63" stroke="#FBBF24" stroke-width="1.5"/>
      <text x="152" y="78" fill="#FBBF24" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">20 €</text>
    </svg>`,

  /* ===== KLASSE 7/8 MATHE ===== */
  'Lineare Funktionen und Graphen': `
    <svg viewBox="0 0 175 138" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:175px">
      <line x1="28" y1="118" x2="165" y2="118" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
      <line x1="28" y1="10" x2="28" y2="118" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
      <polygon points="163,114 171,118 163,122" fill="rgba(255,255,255,.45)"/>
      <polygon points="24,10 28,2 32,10" fill="rgba(255,255,255,.45)"/>
      <text x="166" y="121" fill="rgba(255,255,255,.45)" font-size="9" font-family="sans-serif">x</text>
      <text x="22" y="9" fill="rgba(255,255,255,.45)" font-size="9" font-family="sans-serif">y</text>
      <line x1="28" y1="78" x2="160" y2="78" stroke="rgba(255,255,255,.1)" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="28" y1="38" x2="160" y2="38" stroke="rgba(255,255,255,.1)" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="68" y1="10" x2="68" y2="118" stroke="rgba(255,255,255,.1)" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="108" y1="10" x2="108" y2="118" stroke="rgba(255,255,255,.1)" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="28" y1="98" x2="158" y2="24" stroke="#FBBF24" stroke-width="2.5"/>
      <circle cx="28" cy="98" r="4" fill="#34D399"/>
      <text x="34" y="97" fill="#34D399" font-size="10" font-family="sans-serif">b</text>
      <line x1="68" y1="74" x2="108" y2="74" stroke="#A78BFA" stroke-width="1.5" stroke-dasharray="3,2"/>
      <line x1="108" y1="74" x2="108" y2="50" stroke="#A78BFA" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="114" y="65" fill="#A78BFA" font-size="10" font-family="sans-serif">m</text>
      <text x="87" y="133" fill="rgba(255,255,255,.55)" font-size="10" text-anchor="middle" font-family="sans-serif">y = mx + b</text>
    </svg>`,

  'Satz des Pythagoras': `
    <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <rect x="36" y="118" width="60" height="32" rx="2" fill="rgba(124,58,237,.3)" stroke="#7C3AED" stroke-width="1.5"/>
      <text x="66" y="138" fill="#7C3AED" font-size="12" text-anchor="middle" font-family="sans-serif">a²</text>
      <rect x="96" y="38" width="46" height="80" rx="2" fill="rgba(52,211,153,.25)" stroke="#34D399" stroke-width="1.5"/>
      <text x="119" y="82" fill="#34D399" font-size="12" text-anchor="middle" font-family="sans-serif">b²</text>
      <polygon points="36,118 96,118 96,38" fill="rgba(255,255,255,.14)" stroke="white" stroke-width="2"/>
      <path d="M86,118 L86,108 L96,108" fill="none" stroke="white" stroke-width="1.5"/>
      <text x="64" y="113" fill="#FBBF24" font-size="12" text-anchor="middle" font-family="sans-serif">a</text>
      <text x="102" y="82" fill="#34D399" font-size="11" font-family="sans-serif">b</text>
      <text x="60" y="76" fill="white" font-size="12" text-anchor="middle" font-family="sans-serif">c</text>
      <text x="100" y="16" fill="rgba(255,255,255,.8)" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">a² + b² = <tspan fill="#FBBF24">c²</tspan></text>
    </svg>`,

  'Statistik: Mittelwert, Median, Modus': `
    <svg viewBox="0 0 200 108" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <line x1="18" y1="88" x2="190" y2="88" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
      <rect x="26" y="66" width="22" height="22" rx="2" fill="rgba(124,58,237,.65)"/>
      <rect x="60" y="44" width="22" height="44" rx="2" fill="#FBBF24" opacity=".88"/>
      <rect x="94" y="44" width="22" height="44" rx="2" fill="#FBBF24" opacity=".88"/>
      <rect x="128" y="22" width="22" height="66" rx="2" fill="rgba(124,58,237,.5)"/>
      <rect x="162" y="10" width="22" height="78" rx="2" fill="rgba(124,58,237,.38)"/>
      <text x="37" y="102" fill="rgba(255,255,255,.55)" font-size="9" text-anchor="middle" font-family="sans-serif">3</text>
      <text x="71" y="102" fill="#FBBF24" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">5</text>
      <text x="105" y="102" fill="#FBBF24" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">5</text>
      <text x="139" y="102" fill="rgba(255,255,255,.55)" font-size="9" text-anchor="middle" font-family="sans-serif">7</text>
      <text x="173" y="102" fill="rgba(255,255,255,.55)" font-size="9" text-anchor="middle" font-family="sans-serif">9</text>
      <line x1="105" y1="6" x2="105" y2="88" stroke="#34D399" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="105" y="5" fill="#34D399" font-size="8" text-anchor="middle" font-family="sans-serif">Median=5</text>
    </svg>`,

  'Terme vereinfachen und ausmultiplizieren': `
    <svg viewBox="0 0 210 85" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:210px">
      <text x="105" y="16" fill="white" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">2 × (x + 3) = <tspan fill="#FBBF24">2x + 6</tspan></text>
      <text x="22" y="54" fill="#FBBF24" font-size="18" font-weight="bold" font-family="sans-serif">2</text>
      <text x="36" y="54" fill="rgba(255,255,255,.4)" font-size="16" font-family="sans-serif">×</text>
      <rect x="48" y="30" width="36" height="32" rx="4" fill="rgba(124,58,237,.55)" stroke="#7C3AED" stroke-width="1.5"/>
      <text x="66" y="51" fill="white" font-size="14" text-anchor="middle" font-family="sans-serif">x</text>
      <text x="90" y="51" fill="rgba(255,255,255,.4)" font-size="16" font-family="sans-serif">+</text>
      <rect x="102" y="30" width="36" height="32" rx="4" fill="rgba(52,211,153,.45)" stroke="#34D399" stroke-width="1.5"/>
      <text x="120" y="51" fill="white" font-size="14" text-anchor="middle" font-family="sans-serif">3</text>
      <path d="M30,38 Q44,24 56,34" fill="none" stroke="#FBBF24" stroke-width="1.5" marker-end="url(#tv1)"/>
      <path d="M30,46 Q66,68 106,52" fill="none" stroke="#FBBF24" stroke-width="1.5" marker-end="url(#tv2)"/>
      <defs>
        <marker id="tv1" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#FBBF24"/></marker>
        <marker id="tv2" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#FBBF24"/></marker>
      </defs>
      <text x="152" y="50" fill="rgba(255,255,255,.55)" font-size="12" font-family="sans-serif">= 2x+6</text>
    </svg>`,

  /* ===== KLASSE 9/10 MATHE ===== */
  'Quadratische Funktionen (Parabeln)': `
    <svg viewBox="0 0 175 138" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:175px">
      <line x1="87" y1="8" x2="87" y2="128" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <line x1="8" y1="108" x2="168" y2="108" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <polygon points="83,8 87,0 91,8" fill="rgba(255,255,255,.4)"/>
      <polygon points="164,104 172,108 164,112" fill="rgba(255,255,255,.4)"/>
      <path d="M16,122 Q87,12 158,122" fill="none" stroke="#FBBF24" stroke-width="2.5"/>
      <circle cx="87" cy="52" r="5" fill="#34D399"/>
      <text x="96" y="50" fill="#34D399" font-size="10" font-family="sans-serif">Scheitel</text>
      <text x="166" y="112" fill="rgba(255,255,255,.45)" font-size="9" font-family="sans-serif">x</text>
      <text x="82" y="7" fill="rgba(255,255,255,.45)" font-size="9" font-family="sans-serif">y</text>
      <text x="87" y="135" fill="rgba(255,255,255,.5)" font-size="9" text-anchor="middle" font-family="sans-serif">y = ax² + bx + c</text>
    </svg>`,

  'Quadratische Gleichungen – Lösungsformel': `
    <svg viewBox="0 0 210 105" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:210px">
      <text x="105" y="22" fill="#FBBF24" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">x = −b ± √(b²−4ac) / 2a</text>
      <rect x="5" y="34" width="60" height="40" rx="5" fill="rgba(52,211,153,.25)" stroke="#34D399" stroke-width="1.5"/>
      <text x="35" y="50" fill="#34D399" font-size="10" text-anchor="middle" font-family="sans-serif">D &gt; 0</text>
      <text x="35" y="66" fill="rgba(255,255,255,.65)" font-size="9" text-anchor="middle" font-family="sans-serif">2 Lösungen</text>
      <rect x="75" y="34" width="60" height="40" rx="5" fill="rgba(251,191,36,.2)" stroke="#FBBF24" stroke-width="1.5"/>
      <text x="105" y="50" fill="#FBBF24" font-size="10" text-anchor="middle" font-family="sans-serif">D = 0</text>
      <text x="105" y="66" fill="rgba(255,255,255,.65)" font-size="9" text-anchor="middle" font-family="sans-serif">1 Lösung</text>
      <rect x="145" y="34" width="60" height="40" rx="5" fill="rgba(239,68,68,.2)" stroke="#F87171" stroke-width="1.5"/>
      <text x="175" y="50" fill="#F87171" font-size="10" text-anchor="middle" font-family="sans-serif">D &lt; 0</text>
      <text x="175" y="66" fill="rgba(255,255,255,.65)" font-size="9" text-anchor="middle" font-family="sans-serif">0 Lösungen</text>
      <text x="105" y="98" fill="rgba(255,255,255,.4)" font-size="9" text-anchor="middle" font-family="sans-serif">Diskriminante D = b²−4ac</text>
    </svg>`,

  'Ähnlichkeit und Strahlensätze': `
    <svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <polygon points="100,8 38,112 162,112" fill="rgba(124,58,237,.18)" stroke="#7C3AED" stroke-width="2"/>
      <polygon points="100,8 70,60 130,60" fill="rgba(124,58,237,.45)" stroke="#FBBF24" stroke-width="1.5"/>
      <line x1="100" y1="8" x2="38" y2="112" stroke="rgba(255,255,255,.2)" stroke-width="1" stroke-dasharray="4,3"/>
      <line x1="100" y1="8" x2="162" y2="112" stroke="rgba(255,255,255,.2)" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="84" y="44" fill="#FBBF24" font-size="11" font-family="sans-serif">a</text>
      <text x="116" y="44" fill="#FBBF24" font-size="11" font-family="sans-serif">b</text>
      <text x="60" y="92" fill="rgba(255,255,255,.55)" font-size="11" font-family="sans-serif">c</text>
      <text x="130" y="92" fill="rgba(255,255,255,.55)" font-size="11" font-family="sans-serif">d</text>
      <text x="100" y="126" fill="rgba(255,255,255,.7)" font-size="11" text-anchor="middle" font-family="sans-serif">a/c = <tspan fill="#FBBF24">b/d</tspan></text>
    </svg>`,

  'Trigonometrie: Sinus, Kosinus, Tangens': `
    <svg viewBox="0 0 200 128" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <polygon points="28,112 152,112 152,20" fill="rgba(124,58,237,.2)" stroke="#7C3AED" stroke-width="2"/>
      <path d="M142,112 L142,102 L152,102" fill="none" stroke="white" stroke-width="1.5"/>
      <path d="M28,112 m26,0 a26,26 0 0,1 14,-25" fill="none" stroke="#FBBF24" stroke-width="1.5"/>
      <text x="62" y="106" fill="#FBBF24" font-size="13" font-family="sans-serif">α</text>
      <text x="86" y="126" fill="#34D399" font-size="9" text-anchor="middle" font-family="sans-serif">Ankathete</text>
      <text x="158" y="70" fill="white" font-size="8" font-family="sans-serif">Gegen-</text>
      <text x="158" y="80" fill="white" font-size="8" font-family="sans-serif">kathete</text>
      <text x="78" y="60" fill="#FBBF24" font-size="8" text-anchor="middle" font-family="sans-serif" transform="rotate(-35 78 60)">Hypotenuse</text>
      <text x="100" y="12" fill="rgba(255,255,255,.65)" font-size="9" text-anchor="middle" font-family="sans-serif">sin=Geg/Hyp · cos=Ank/Hyp · tan=Geg/Ank</text>
    </svg>`,

  'Wahrscheinlichkeitsrechnung': `
    <svg viewBox="0 0 200 108" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <rect x="18" y="18" width="68" height="68" rx="10" fill="rgba(255,255,255,.09)" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
      <circle cx="36" cy="36" r="5" fill="white"/><circle cx="52" cy="52" r="5" fill="white"/><circle cx="68" cy="68" r="5" fill="white"/>
      <text x="96" y="58" fill="rgba(255,255,255,.45)" font-size="20" font-family="sans-serif">→</text>
      <text x="135" y="46" fill="white" font-size="20" font-weight="bold" text-anchor="middle" font-family="sans-serif">1</text>
      <line x1="116" y1="54" x2="154" y2="54" stroke="#FBBF24" stroke-width="2"/>
      <text x="135" y="74" fill="white" font-size="20" font-weight="bold" text-anchor="middle" font-family="sans-serif">6</text>
      <text x="100" y="100" fill="rgba(255,255,255,.45)" font-size="9" text-anchor="middle" font-family="sans-serif">P = günstige ÷ mögliche Ergebnisse</text>
    </svg>`,

  'Exponentialfunktionen': `
    <svg viewBox="0 0 175 138" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:175px">
      <line x1="28" y1="8" x2="28" y2="120" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <line x1="18" y1="108" x2="168" y2="108" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <polygon points="24,8 28,0 32,8" fill="rgba(255,255,255,.4)"/>
      <polygon points="164,104 172,108 164,112" fill="rgba(255,255,255,.4)"/>
      <path d="M28,106 Q55,104 75,94 Q105,72 135,34 Q148,16 160,8" fill="none" stroke="#FBBF24" stroke-width="2.5"/>
      <path d="M28,18 Q50,38 70,62 Q100,88 152,104" fill="none" stroke="#34D399" stroke-width="2" stroke-dasharray="5,3"/>
      <text x="158" y="14" fill="#FBBF24" font-size="9" font-family="sans-serif">b&gt;1</text>
      <text x="155" y="99" fill="#34D399" font-size="9" font-family="sans-serif">b&lt;1</text>
      <text x="87" y="133" fill="rgba(255,255,255,.5)" font-size="9" text-anchor="middle" font-family="sans-serif">f(x) = a · bˣ</text>
    </svg>`,

  'Ableitung und Analysis': `
    <svg viewBox="0 0 175 138" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:175px">
      <line x1="18" y1="8" x2="18" y2="125" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <line x1="8" y1="115" x2="168" y2="115" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <path d="M18,110 Q55,108 85,72 Q110,42 148,20" fill="none" stroke="#7C3AED" stroke-width="2.5"/>
      <line x1="36" y1="112" x2="136" y2="32" stroke="#FBBF24" stroke-width="2" stroke-dasharray="5,3"/>
      <circle cx="88" cy="70" r="5" fill="#FBBF24"/>
      <text x="96" y="68" fill="#FBBF24" font-size="9" font-family="sans-serif">P(x₀)</text>
      <text x="87" y="133" fill="rgba(255,255,255,.5)" font-size="9" text-anchor="middle" font-family="sans-serif">f'(x₀) = Steigung der Tangente</text>
      <text x="87" y="10" fill="rgba(255,255,255,.55)" font-size="9" text-anchor="middle" font-family="sans-serif">xⁿ → n·xⁿ⁻¹ (Potenzregel)</text>
    </svg>`,

  'Analytische Geometrie – Vektoren': `
    <svg viewBox="0 0 200 128" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <line x1="88" y1="98" x2="160" y2="98" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <line x1="88" y1="98" x2="88" y2="18" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <line x1="88" y1="98" x2="38" y2="122" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <text x="164" y="101" fill="rgba(255,255,255,.45)" font-size="10" font-family="sans-serif">x</text>
      <text x="83" y="15" fill="rgba(255,255,255,.45)" font-size="10" font-family="sans-serif">y</text>
      <text x="30" y="125" fill="rgba(255,255,255,.45)" font-size="10" font-family="sans-serif">z</text>
      <line x1="88" y1="98" x2="148" y2="46" stroke="#FBBF24" stroke-width="2.5"/>
      <polygon points="148,46 140,54 152,54" fill="#FBBF24"/>
      <line x1="148" y1="46" x2="148" y2="98" stroke="rgba(255,255,255,.2)" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="148" y1="98" x2="88" y2="98" stroke="rgba(255,255,255,.2)" stroke-width="1" stroke-dasharray="3,3"/>
      <text x="154" y="44" fill="#FBBF24" font-size="11" font-family="sans-serif">v⃗</text>
      <text x="100" y="122" fill="rgba(255,255,255,.6)" font-size="10" font-family="sans-serif">v⃗ = <tspan fill="#FBBF24">(x, y, z)</tspan></text>
    </svg>`,

  /* ===== PHYSIK KLASSE 5/6 ===== */
  'Kraft und Kraftmessung': `
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <rect x="78" y="36" width="44" height="40" rx="5" fill="rgba(124,58,237,.42)" stroke="#7C3AED" stroke-width="2"/>
      <text x="100" y="61" fill="white" font-size="11" text-anchor="middle" font-family="sans-serif">Masse m</text>
      <line x1="100" y1="76" x2="100" y2="100" stroke="#FBBF24" stroke-width="2.5"/>
      <polygon points="96,98 100,106 104,98" fill="#FBBF24"/>
      <text x="112" y="94" fill="#FBBF24" font-size="10" font-family="sans-serif">F_G</text>
      <line x1="122" y1="56" x2="158" y2="56" stroke="#34D399" stroke-width="2.5"/>
      <polygon points="156,52 166,56 156,60" fill="#34D399"/>
      <text x="170" y="59" fill="#34D399" font-size="11" font-family="sans-serif">F</text>
      <text x="100" y="16" fill="rgba(255,255,255,.6)" font-size="10" text-anchor="middle" font-family="sans-serif">F in Newton (N)</text>
      <text x="100" y="28" fill="rgba(255,255,255,.45)" font-size="9" text-anchor="middle" font-family="sans-serif">F_G = m × g    g ≈ 9,81 m/s²</text>
    </svg>`,

  'Geschwindigkeit und Bewegung': `
    <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <line x1="5" y1="62" x2="195" y2="62" stroke="rgba(255,255,255,.2)" stroke-width="2"/>
      <rect x="18" y="40" width="52" height="24" rx="4" fill="rgba(124,58,237,.6)" stroke="#7C3AED" stroke-width="1.5"/>
      <rect x="26" y="30" width="32" height="14" rx="4" fill="rgba(124,58,237,.38)"/>
      <circle cx="28" cy="64" r="7" fill="#1a1a2e" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <circle cx="58" cy="64" r="7" fill="#1a1a2e" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <line x1="72" y1="52" x2="130" y2="52" stroke="#FBBF24" stroke-width="2.5"/>
      <polygon points="128,48 138,52 128,56" fill="#FBBF24"/>
      <polygon points="148,28 132,75 164,75" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
      <text x="148" y="48" fill="#FBBF24" font-size="12" text-anchor="middle" font-family="sans-serif">s</text>
      <line x1="138" y1="58" x2="158" y2="58" stroke="rgba(255,255,255,.3)" stroke-width="1"/>
      <text x="142" y="70" fill="white" font-size="10" text-anchor="middle" font-family="sans-serif">v</text>
      <text x="155" y="70" fill="white" font-size="10" text-anchor="middle" font-family="sans-serif">t</text>
    </svg>`,

  'Reibungskräfte': `
    <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <rect x="8" y="58" width="184" height="18" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>
      <rect x="60" y="33" width="60" height="26" rx="4" fill="rgba(124,58,237,.52)" stroke="#7C3AED" stroke-width="2"/>
      <line x1="14" y1="46" x2="55" y2="46" stroke="#34D399" stroke-width="2.5"/>
      <polygon points="53,42 63,46 53,50" fill="#34D399"/>
      <text x="14" y="40" fill="#34D399" font-size="9" font-family="sans-serif">Schub</text>
      <line x1="125" y1="46" x2="170" y2="46" stroke="#FBBF24" stroke-width="2"/>
      <polygon points="127,42 117,46 127,50" fill="#FBBF24"/>
      <text x="142" y="40" fill="#FBBF24" font-size="9" font-family="sans-serif">Reibung</text>
      <text x="100" y="86" fill="rgba(255,255,255,.5)" font-size="9" text-anchor="middle" font-family="sans-serif">Haftreibung &gt; Gleitreibung &gt; Rollreibung</text>
    </svg>`,

  'Hebel und einfache Maschinen': `
    <svg viewBox="0 0 200 108" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <line x1="18" y1="62" x2="182" y2="62" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round"/>
      <polygon points="100,62 88,88 112,88" fill="rgba(255,255,255,.28)" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <line x1="82" y1="88" x2="118" y2="88" stroke="rgba(255,255,255,.3)" stroke-width="2"/>
      <line x1="38" y1="62" x2="38" y2="90" stroke="#34D399" stroke-width="2.5"/>
      <polygon points="34,88 38,98 42,88" fill="#34D399"/>
      <text x="20" y="58" fill="#34D399" font-size="11" font-family="sans-serif">F</text>
      <line x1="38" y1="52" x2="100" y2="52" stroke="rgba(255,255,255,.22)" stroke-width="1" stroke-dasharray="3,3"/>
      <text x="68" y="49" fill="rgba(255,255,255,.4)" font-size="9" text-anchor="middle" font-family="sans-serif">l₁</text>
      <line x1="158" y1="62" x2="158" y2="86" stroke="#FBBF24" stroke-width="2.5"/>
      <polygon points="154,84 158,94 162,84" fill="#FBBF24"/>
      <text x="164" y="58" fill="#FBBF24" font-size="11" font-family="sans-serif">L</text>
      <line x1="100" y1="52" x2="158" y2="52" stroke="rgba(255,255,255,.22)" stroke-width="1" stroke-dasharray="3,3"/>
      <text x="130" y="49" fill="rgba(255,255,255,.4)" font-size="9" text-anchor="middle" font-family="sans-serif">l₂</text>
      <text x="100" y="106" fill="rgba(255,255,255,.7)" font-size="11" text-anchor="middle" font-family="sans-serif">F × l₁ = <tspan fill="#FBBF24">L × l₂</tspan></text>
    </svg>`,

  'Masse und Gewichtskraft': `
    <svg viewBox="0 0 200 98" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <rect x="5" y="14" width="88" height="68" rx="6" fill="rgba(124,58,237,.2)" stroke="#7C3AED" stroke-width="1.5"/>
      <rect x="107" y="14" width="88" height="68" rx="6" fill="rgba(52,211,153,.15)" stroke="#34D399" stroke-width="1.5"/>
      <text x="49" y="30" fill="#7C3AED" font-size="11" text-anchor="middle" font-family="sans-serif">🌍 Erde</text>
      <text x="49" y="50" fill="white" font-size="11" text-anchor="middle" font-family="sans-serif">m = 10 kg</text>
      <text x="49" y="68" fill="#FBBF24" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">≈ 98 N</text>
      <text x="151" y="30" fill="#34D399" font-size="11" text-anchor="middle" font-family="sans-serif">🌕 Mond</text>
      <text x="151" y="50" fill="white" font-size="11" text-anchor="middle" font-family="sans-serif">m = 10 kg</text>
      <text x="151" y="68" fill="#34D399" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">≈ 16 N</text>
    </svg>`,

  /* ===== PHYSIK ELEKTRIK ===== */
  'Elektrische Stromkreise': `
    <svg viewBox="0 0 200 108" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <rect x="28" y="18" width="144" height="70" rx="8" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2"/>
      <line x1="28" y1="40" x2="28" y2="36" stroke="white" stroke-width="3"/>
      <line x1="20" y1="36" x2="36" y2="36" stroke="white" stroke-width="1.5"/>
      <line x1="23" y1="31" x2="33" y2="31" stroke="white" stroke-width="3"/>
      <line x1="20" y1="31" x2="36" y2="31" stroke="white" stroke-width="1.5"/>
      <text x="28" y="68" fill="#FBBF24" font-size="11" text-anchor="middle" font-family="sans-serif">U</text>
      <circle cx="172" cy="53" r="13" fill="rgba(251,191,36,.18)" stroke="#FBBF24" stroke-width="2"/>
      <path d="M165,47 L179,59 M179,47 L165,59" stroke="#FBBF24" stroke-width="1.5"/>
      <polygon points="100,16 106,22 94,22" fill="#34D399"/>
      <text x="100" y="14" fill="#34D399" font-size="8" text-anchor="middle" font-family="sans-serif">I →</text>
      <text x="100" y="100" fill="rgba(255,255,255,.45)" font-size="9" text-anchor="middle" font-family="sans-serif">Spannung U · Strom I · Widerstand R</text>
    </svg>`,

  'Ohmsches Gesetz': `
    <svg viewBox="0 0 200 118" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <polygon points="100,12 28,108 172,108" fill="rgba(124,58,237,.18)" stroke="#7C3AED" stroke-width="2"/>
      <line x1="28" y1="108" x2="172" y2="108" stroke="#7C3AED" stroke-width="2"/>
      <line x1="100" y1="60" x2="172" y2="60" stroke="rgba(255,255,255,.28)" stroke-width="1.5"/>
      <text x="100" y="50" fill="#FBBF24" font-size="20" font-weight="bold" text-anchor="middle" font-family="sans-serif">U</text>
      <text x="66" y="94" fill="#34D399" font-size="20" font-weight="bold" text-anchor="middle" font-family="sans-serif">I</text>
      <text x="134" y="94" fill="white" font-size="20" font-weight="bold" text-anchor="middle" font-family="sans-serif">R</text>
      <text x="100" y="115" fill="rgba(255,255,255,.55)" font-size="9" text-anchor="middle" font-family="sans-serif">U=I·R  ·  I=U/R  ·  R=U/I</text>
    </svg>`,

  'Elektrische Energie und Leistung': `
    <svg viewBox="0 0 210 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:210px">
      <text x="105" y="16" fill="white" font-size="16" font-weight="bold" text-anchor="middle" font-family="sans-serif">P = <tspan fill="#FBBF24">U × I</tspan>   [Watt]</text>
      <rect x="5" y="26" width="62" height="38" rx="5" fill="rgba(124,58,237,.35)" stroke="#7C3AED" stroke-width="1.5"/>
      <text x="36" y="42" fill="rgba(255,255,255,.6)" font-size="9" text-anchor="middle" font-family="sans-serif">60W Lampe</text>
      <text x="36" y="56" fill="#FBBF24" font-size="10" text-anchor="middle" font-family="sans-serif">P = 60 W</text>
      <rect x="75" y="26" width="62" height="38" rx="5" fill="rgba(52,211,153,.25)" stroke="#34D399" stroke-width="1.5"/>
      <text x="106" y="42" fill="rgba(255,255,255,.6)" font-size="9" text-anchor="middle" font-family="sans-serif">1 h = 3600 s</text>
      <text x="106" y="56" fill="#34D399" font-size="10" text-anchor="middle" font-family="sans-serif">E = P × t</text>
      <rect x="145" y="26" width="60" height="38" rx="5" fill="rgba(251,191,36,.2)" stroke="#FBBF24" stroke-width="1.5"/>
      <text x="175" y="42" fill="rgba(255,255,255,.6)" font-size="9" text-anchor="middle" font-family="sans-serif">60 × 3600</text>
      <text x="175" y="56" fill="#FBBF24" font-size="10" text-anchor="middle" font-family="sans-serif">216 000 J</text>
    </svg>`,

  'Reihen- und Parallelschaltung': `
    <svg viewBox="0 0 200 108" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <text x="8" y="13" fill="rgba(255,255,255,.55)" font-size="9" font-family="sans-serif">Reihenschaltung – gleicher Strom I</text>
      <line x1="8" y1="28" x2="40" y2="28" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/>
      <rect x="40" y="20" width="32" height="16" rx="3" fill="rgba(124,58,237,.65)" stroke="#7C3AED" stroke-width="1.5"/>
      <text x="56" y="32" fill="white" font-size="9" text-anchor="middle" font-family="sans-serif">R₁</text>
      <line x1="72" y1="28" x2="104" y2="28" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/>
      <rect x="104" y="20" width="32" height="16" rx="3" fill="rgba(124,58,237,.65)" stroke="#7C3AED" stroke-width="1.5"/>
      <text x="120" y="32" fill="white" font-size="9" text-anchor="middle" font-family="sans-serif">R₂</text>
      <line x1="136" y1="28" x2="192" y2="28" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/>
      <text x="168" y="22" fill="#FBBF24" font-size="9" font-family="sans-serif">R=R₁+R₂</text>
      <text x="8" y="60" fill="rgba(255,255,255,.55)" font-size="9" font-family="sans-serif">Parallelschaltung – gleiche Spannung U</text>
      <line x1="8" y1="76" x2="40" y2="76" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/>
      <line x1="40" y1="68" x2="40" y2="96" stroke="rgba(255,255,255,.38)" stroke-width="1.5"/>
      <rect x="44" y="68" width="32" height="14" rx="3" fill="rgba(52,211,153,.5)" stroke="#34D399" stroke-width="1.5"/>
      <text x="60" y="79" fill="white" font-size="9" text-anchor="middle" font-family="sans-serif">R₁</text>
      <rect x="44" y="86" width="32" height="14" rx="3" fill="rgba(52,211,153,.5)" stroke="#34D399" stroke-width="1.5"/>
      <text x="60" y="97" fill="white" font-size="9" text-anchor="middle" font-family="sans-serif">R₂</text>
      <line x1="76" y1="68" x2="76" y2="96" stroke="rgba(255,255,255,.38)" stroke-width="1.5"/>
      <line x1="76" y1="76" x2="192" y2="76" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/>
      <text x="120" y="97" fill="#34D399" font-size="9" font-family="sans-serif">1/R=1/R₁+1/R₂</text>
    </svg>`,

  /* ===== PHYSIK WELLEN / OPTIK ===== */
  'Wellen und Wellengrößen': `
    <svg viewBox="0 0 220 98" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:220px">
      <path d="M8,50 Q28,10 52,50 Q76,90 100,50 Q124,10 148,50 Q172,90 212,50" fill="none" stroke="#7C3AED" stroke-width="2.5"/>
      <line x1="8" y1="74" x2="100" y2="74" stroke="#FBBF24" stroke-width="1.5"/>
      <line x1="8" y1="70" x2="8" y2="78" stroke="#FBBF24" stroke-width="1.5"/>
      <line x1="100" y1="70" x2="100" y2="78" stroke="#FBBF24" stroke-width="1.5"/>
      <text x="54" y="88" fill="#FBBF24" font-size="10" text-anchor="middle" font-family="sans-serif">λ Wellenlänge</text>
      <line x1="200" y1="50" x2="200" y2="10" stroke="#34D399" stroke-width="1.5"/>
      <line x1="196" y1="10" x2="204" y2="10" stroke="#34D399" stroke-width="1.5"/>
      <line x1="196" y1="50" x2="204" y2="50" stroke="#34D399" stroke-width="1.5"/>
      <text x="210" y="34" fill="#34D399" font-size="10" font-family="sans-serif">A</text>
      <text x="108" y="14" fill="rgba(255,255,255,.6)" font-size="10" font-family="sans-serif">v = f × λ</text>
    </svg>`,

  'Schall und Schallgeschwindigkeit': `
    <svg viewBox="0 0 200 88" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <rect x="8" y="28" width="22" height="30" rx="3" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <polygon points="30,28 52,14 52,72 30,58" fill="rgba(255,255,255,.22)" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <path d="M58,43 a14,18 0 0,1 0,-18" fill="none" stroke="#FBBF24" stroke-width="2" opacity=".9"/>
      <path d="M68,48 a22,28 0 0,1 0,-28" fill="none" stroke="#FBBF24" stroke-width="1.8" opacity=".7"/>
      <path d="M80,52 a32,38 0 0,1 0,-38" fill="none" stroke="#FBBF24" stroke-width="1.5" opacity=".5"/>
      <path d="M94,56 a46,52 0 0,1 0,-52" fill="none" stroke="#FBBF24" stroke-width="1.2" opacity=".32"/>
      <text x="132" y="36" fill="white" font-size="15" font-weight="bold" text-anchor="middle" font-family="sans-serif">343</text>
      <text x="132" y="50" fill="rgba(255,255,255,.55)" font-size="10" text-anchor="middle" font-family="sans-serif">m/s</text>
      <text x="132" y="64" fill="rgba(255,255,255,.38)" font-size="8" text-anchor="middle" font-family="sans-serif">bei 20°C</text>
      <text x="100" y="84" fill="rgba(255,255,255,.38)" font-size="9" text-anchor="middle" font-family="sans-serif">Donner: t[s] × 340 m = Entfernung</text>
    </svg>`,

  'Licht: Spektrum und Farben': `
    <svg viewBox="0 0 220 78" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:220px">
      <polygon points="28,68 66,8 104,68" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <line x1="4" y1="38" x2="46" y2="38" stroke="white" stroke-width="2.5"/>
      <polygon points="44,35 52,38 44,41" fill="white"/>
      <line x1="88" y1="54" x2="210" y2="74" stroke="#8B5CF6" stroke-width="2"/>
      <line x1="88" y1="50" x2="210" y2="64" stroke="#3B82F6" stroke-width="2"/>
      <line x1="88" y1="46" x2="210" y2="54" stroke="#10B981" stroke-width="2"/>
      <line x1="88" y1="42" x2="210" y2="44" stroke="#EAB308" stroke-width="2"/>
      <line x1="88" y1="38" x2="210" y2="34" stroke="#EF4444" stroke-width="2"/>
      <text x="214" y="77" fill="#8B5CF6" font-size="8" font-family="sans-serif">V</text>
      <text x="214" y="37" fill="#EF4444" font-size="8" font-family="sans-serif">R</text>
      <text x="4" y="24" fill="rgba(255,255,255,.45)" font-size="8" font-family="sans-serif">weißes Licht</text>
    </svg>`,

  'Radioaktivität – Grundlagen': `
    <svg viewBox="0 0 200 98" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <circle cx="28" cy="49" r="14" fill="rgba(239,68,68,.42)" stroke="#EF4444" stroke-width="2"/>
      <text x="28" y="54" fill="white" font-size="10" text-anchor="middle" font-family="sans-serif">☢</text>
      <line x1="42" y1="49" x2="74" y2="28" stroke="#FBBF24" stroke-width="2"/>
      <polygon points="72,24 82,28 74,36" fill="#FBBF24"/>
      <text x="86" y="25" fill="#FBBF24" font-size="13" font-weight="bold" font-family="sans-serif">α</text>
      <rect x="104" y="18" width="32" height="16" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)" stroke-width="1"/>
      <text x="120" y="30" fill="rgba(255,255,255,.55)" font-size="8" text-anchor="middle" font-family="sans-serif">Papier</text>
      <line x1="42" y1="49" x2="74" y2="49" stroke="#34D399" stroke-width="2"/>
      <polygon points="72,45 82,49 72,53" fill="#34D399"/>
      <text x="86" y="54" fill="#34D399" font-size="13" font-weight="bold" font-family="sans-serif">β</text>
      <rect x="104" y="42" width="32" height="16" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)" stroke-width="1"/>
      <text x="120" y="54" fill="rgba(255,255,255,.55)" font-size="8" text-anchor="middle" font-family="sans-serif">Aluminium</text>
      <line x1="42" y1="49" x2="74" y2="70" stroke="#A78BFA" stroke-width="2"/>
      <polygon points="72,66 82,70 74,78" fill="#A78BFA"/>
      <text x="86" y="74" fill="#A78BFA" font-size="13" font-weight="bold" font-family="sans-serif">γ</text>
      <rect x="104" y="64" width="32" height="16" rx="3" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)" stroke-width="1"/>
      <text x="120" y="76" fill="rgba(255,255,255,.55)" font-size="8" text-anchor="middle" font-family="sans-serif">Beton/Blei</text>
    </svg>`,

  /* ===== PHYSIK KLASSE 9/10 ===== */
  'Impuls und Impulserhaltung': `
    <svg viewBox="0 0 200 88" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <circle cx="38" cy="44" r="18" fill="rgba(124,58,237,.6)" stroke="#7C3AED" stroke-width="2"/>
      <text x="38" y="49" fill="white" font-size="10" text-anchor="middle" font-family="sans-serif">m₁</text>
      <line x1="56" y1="44" x2="82" y2="44" stroke="#FBBF24" stroke-width="2.5"/>
      <polygon points="80,40 90,44 80,48" fill="#FBBF24"/>
      <text x="70" y="38" fill="#FBBF24" font-size="9" font-family="sans-serif">v₁</text>
      <circle cx="142" cy="44" r="18" fill="rgba(52,211,153,.45)" stroke="#34D399" stroke-width="2"/>
      <text x="142" y="49" fill="white" font-size="10" text-anchor="middle" font-family="sans-serif">m₂</text>
      <text x="117" y="40" fill="rgba(255,255,255,.4)" font-size="9" font-family="sans-serif">v₂=0</text>
      <text x="100" y="80" fill="rgba(255,255,255,.6)" font-size="10" text-anchor="middle" font-family="sans-serif">p = <tspan fill="#FBBF24">m × v</tspan>  –  erhalten!</text>
    </svg>`,

  'Optik: Reflexion und Brechung': `
    <svg viewBox="0 0 200 118" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <line x1="18" y1="68" x2="182" y2="68" stroke="rgba(255,255,255,.5)" stroke-width="2.5"/>
      <line x1="24" y1="68" x2="17" y2="78" stroke="rgba(255,255,255,.22)" stroke-width="1"/>
      <line x1="38" y1="68" x2="31" y2="78" stroke="rgba(255,255,255,.22)" stroke-width="1"/>
      <line x1="52" y1="68" x2="45" y2="78" stroke="rgba(255,255,255,.22)" stroke-width="1"/>
      <line x1="66" y1="68" x2="59" y2="78" stroke="rgba(255,255,255,.22)" stroke-width="1"/>
      <line x1="80" y1="68" x2="73" y2="78" stroke="rgba(255,255,255,.22)" stroke-width="1"/>
      <line x1="94" y1="68" x2="87" y2="78" stroke="rgba(255,255,255,.22)" stroke-width="1"/>
      <line x1="100" y1="8" x2="100" y2="113" stroke="rgba(255,255,255,.28)" stroke-width="1.5" stroke-dasharray="5,4"/>
      <line x1="28" y1="14" x2="100" y2="68" stroke="#FBBF24" stroke-width="2"/>
      <polygon points="96,64 104,68 98,76" fill="#FBBF24"/>
      <line x1="100" y1="68" x2="172" y2="14" stroke="#34D399" stroke-width="2"/>
      <polygon points="170,18 176,10 164,13" fill="#34D399"/>
      <path d="M100,68 m-20,0 a20,20 0 0,1 12,-18" fill="none" stroke="#FBBF24" stroke-width="1.5"/>
      <path d="M100,68 m6,-18 a20,20 0 0,1 15,12" fill="none" stroke="#34D399" stroke-width="1.5"/>
      <text x="70" y="58" fill="#FBBF24" font-size="12" font-family="sans-serif">α</text>
      <text x="122" y="54" fill="#34D399" font-size="12" font-family="sans-serif">α</text>
      <text x="100" y="114" fill="rgba(255,255,255,.6)" font-size="9" text-anchor="middle" font-family="sans-serif">Einfallswinkel = Reflexionswinkel</text>
    </svg>`,

  'Magnetismus und Elektromagnetismus': `
    <svg viewBox="0 0 200 98" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <path d="M18,28 L18,68 Q18,84 38,84 Q58,84 58,68 L58,53 L48,53 L48,68 Q48,74 38,74 Q28,74 28,68 L28,28 Z" fill="rgba(239,68,68,.5)" stroke="#EF4444" stroke-width="1.5"/>
      <path d="M68,28 L68,68 Q68,84 88,84 Q108,84 108,68 L108,53 L98,53 L98,68 Q98,74 88,74 Q78,74 78,68 L78,28 Z" fill="rgba(52,211,153,.4)" stroke="#34D399" stroke-width="1.5"/>
      <text x="38" y="44" fill="white" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">N</text>
      <text x="88" y="44" fill="white" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">S</text>
      <path d="M38,24 Q63,4 88,24" fill="none" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="4,3"/>
      <path d="M38,18 Q63,-2 88,18" fill="none" stroke="#FBBF24" stroke-width="1" stroke-dasharray="4,3" opacity=".45"/>
      <line x1="128" y1="48" x2="174" y2="48" stroke="#A78BFA" stroke-width="2.5"/>
      <polygon points="172,44 182,48 172,52" fill="#A78BFA"/>
      <text x="153" y="40" fill="#A78BFA" font-size="9" text-anchor="middle" font-family="sans-serif">Induktion</text>
      <text x="153" y="66" fill="rgba(255,255,255,.45)" font-size="8" text-anchor="middle" font-family="sans-serif">⚡ Induktionsstrom</text>
      <text x="100" y="96" fill="rgba(255,255,255,.38)" font-size="8" text-anchor="middle" font-family="sans-serif">Faraday: ΔB-Feld → Strom</text>
    </svg>`,

  'Einführung Quantenphysik': `
    <svg viewBox="0 0 200 98" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px">
      <path d="M8,50 Q20,20 33,50 Q46,80 59,50 Q72,20 85,50" fill="none" stroke="#7C3AED" stroke-width="2.5"/>
      <text x="46" y="90" fill="#7C3AED" font-size="10" text-anchor="middle" font-family="sans-serif">Welle</text>
      <text x="100" y="56" fill="rgba(255,255,255,.55)" font-size="22" text-anchor="middle" font-family="sans-serif">?</text>
      <circle cx="158" cy="48" r="16" fill="rgba(251,191,36,.38)" stroke="#FBBF24" stroke-width="2"/>
      <circle cx="158" cy="48" r="7" fill="#FBBF24" opacity=".7"/>
      <text x="158" y="83" fill="#FBBF24" font-size="10" text-anchor="middle" font-family="sans-serif">Teilchen</text>
      <text x="100" y="12" fill="rgba(255,255,255,.5)" font-size="9" text-anchor="middle" font-family="sans-serif">Welle-Teilchen-Dualismus</text>
      <text x="100" y="24" fill="rgba(255,255,255,.38)" font-size="8" text-anchor="middle" font-family="sans-serif">Photoeffekt: Licht als Quanten (Photonen)</text>
    </svg>`,
};

// ============================================================
// NAVIGATION
// ============================================================
function navigate(view, gradeId, subjectId, exerciseId) {
  state.view = view;
  if (gradeId)    state.gradeId    = gradeId;
  if (subjectId)  state.subjectId  = subjectId;
  if (exerciseId) state.exerciseId = exerciseId;

  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  stopIntro();

  // Set grade data attribute for CSS vars
  if (state.gradeId) {
    document.body.setAttribute('data-grade', state.gradeId.replace('klasse',''));
  } else {
    document.body.removeAttribute('data-grade');
  }

  // Update sidebar active state
  updateSidebarActive();
  updateGlobalProgress();

  switch (view) {
    case 'home':     renderHome();     break;
    case 'grade':    renderGrade();    break;
    case 'subject':  renderSubject();  break;
    case 'quiz':     renderQuiz();     break;
    case 'result':   showView('viewResult'); break;
    case 'examprep': renderExamPrep(); break;
    case 'analyse':  renderAnalyse();  break;
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// HOME VIEW
// ============================================================
function renderHome() {
  showView('viewHome');
  const grid = document.getElementById('gradeGrid');
  grid.innerHTML = '';
  Object.values(CONTENT).forEach(grade => {
    const subjectNames = grade.subjects.slice(0,3).map(s => s.name);
    const progress = getGradeProgress(grade.id);
    const card = document.createElement('div');
    card.className = 'grade-card';
    card.style.background = GRADE_GRADIENTS[grade.id];
    card.onclick = () => navigate('grade', grade.id);
    card.innerHTML = `
      <div class="grade-card-inner">
        <div class="grade-card-num">${grade.num}</div>
        <div class="grade-card-emoji">${grade.emoji}</div>
        <div class="grade-card-title">${grade.label}</div>
        <div class="grade-card-sub">${grade.tagline}</div>
        <div class="grade-card-subjects">
          ${subjectNames.map(n => `<span class="grade-card-tag">${n}</span>`).join('')}
          <span class="grade-card-tag">+${grade.subjects.length - 3 > 0 ? grade.subjects.length - 3 + ' mehr' : grade.subjects.length + ' Fächer'}</span>
        </div>
        ${progress > 0 ? `<div style="margin-top:8px;font-size:.78rem;opacity:.8">✅ ${progress}% abgeschlossen</div>` : ''}
        <div class="grade-card-arrow">→</div>
      </div>`;
    grid.appendChild(card);
  });
  updateSidebarGrades();
}

// ============================================================
// GRADE VIEW
// ============================================================
function renderGrade() {
  showView('viewGrade');
  const grade = CONTENT[state.gradeId];
  if (!grade) return;

  // Hero
  const hero = document.getElementById('gradeHeroArea');
  hero.style.background = GRADE_GRADIENTS[state.gradeId];
  hero.innerHTML = `
    <div class="hero-breadcrumb" onclick="navigate('home')">🏠 Startseite</div>
    <h1>${grade.emoji} ${grade.label}</h1>
    <p>${grade.tagline}</p>`;

  // Subject grid
  const grid = document.getElementById('subjectGrid');
  grid.innerHTML = '';
  grade.subjects.forEach(sub => {
    const done = getSubjectProgress(state.gradeId, sub.id);
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.setProperty('--sc', sub.color);
    card.onclick = () => navigate('subject', state.gradeId, sub.id);
    card.innerHTML = `
      <div class="subject-icon">${sub.icon}</div>
      <div class="subject-name">${sub.name}</div>
      <div class="subject-desc">${sub.desc}</div>
      <div class="subject-topics">${sub.topics.filter(t=>!t.isChapter).length} Themen · ${sub.exercises.length} Übungseinheiten</div>
      ${done > 0 ? `<div style="font-size:.78rem;color:#10B981;font-weight:700;margin-top:6px">✅ ${done}% geschafft</div>` : ''}
      <div class="subject-arrow">→</div>`;
    grid.appendChild(card);
  });

  updateSidebarSubjects(grade);
}

// ============================================================
// SUBJECT VIEW
// ============================================================
function renderSubject() {
  showView('viewSubject');
  const grade = CONTENT[state.gradeId];
  const subject = grade?.subjects.find(s => s.id === state.subjectId);
  if (!subject) return;

  // Hero
  const hero = document.getElementById('subjectHeroArea');
  hero.style.background = GRADE_GRADIENTS[state.gradeId];
  hero.innerHTML = `
    <div class="hero-breadcrumb" onclick="navigate('grade', '${state.gradeId}')">← ${grade.label}</div>
    <h1>${subject.icon} ${subject.name}</h1>
    <p>${subject.desc}</p>`;

  const hasVideo = subject.id === 'mathe' || subject.id === 'physik';
  document.querySelector('.video-section').style.display = 'none';

  if (hasVideo) {
    document.getElementById('avatarSpeech').textContent = subject.intro.substring(0, 90) + '…';
    const playBtn = document.getElementById('playIntroBtn');
    playBtn.disabled = false;
    playBtn.textContent = '▶ Alle Themen anhören';
    playBtn.onclick = () => playAllTopics(subject);
    document.getElementById('videoProgressFill').style.width = '0%';
    document.getElementById('videoTime').textContent = 'bereit';
    document.getElementById('avatarAnim').classList.remove('talking');
    document.getElementById('pauseIntroBtn').classList.add('hidden');
    document.getElementById('stopIntroBtn').classList.add('hidden');
  }

  // Gesprächsverlauf beim Fachwechsel zurücksetzen
  _chatHistory = [];

  // Topics (mit Play-Button für Mathe/Physik)
  const topicsList = document.getElementById('topicsList');
  topicsList.innerHTML = '';
  let topicNum = 0;
  subject.topics.forEach((t, i) => {
    if (t.isChapter) {
      const hdr = document.createElement('div');
      hdr.className = 'topic-chapter-header';
      hdr.id = `topic-item-${i}`;
      hdr.textContent = t.name;
      topicsList.appendChild(hdr);
      return;
    }
    topicNum++;
    const item = document.createElement('div');
    item.className = 'topic-item';
    item.id = `topic-item-${i}`;
    item.innerHTML = `
      <div class="topic-thumb">
        <div class="topic-num">${topicNum}</div>
        <div class="topic-play-icon">▶</div>
      </div>
      <div class="topic-body">
        <div class="topic-item-head">
          <div class="topic-name">${t.name}</div>
          <div class="topic-diff">${DIFF_STARS[t.diff]}</div>
        </div>
        ${hasVideo ? `<button class="topic-play-btn" id="topicBtn${i}" onclick="playTopic(${i})">Erklärvideo</button>` : ''}
        ${EV_SCENES[t.name] ? `<button class="ev-topic-btn" onclick="openErklaerVideo('${t.name.replace(/'/g,"\\'")}')">🎬 Erklärvideo</button>` : ''}
      </div>`;
    topicsList.appendChild(item);
  });

  // Experiments section
  const expSection = document.getElementById('experimentsSection');
  const expList = document.getElementById('experimentsList');
  const expTopics = subject.topics.filter(t => !t.isChapter && t.exp);
  expList.innerHTML = '';
  if (expTopics.length > 0) {
    expSection.style.display = '';
    expTopics.forEach(t => {
      const card = document.createElement('div');
      card.className = 'experiment-card';
      card.innerHTML = `
        <div class="experiment-card-icon">🧪</div>
        <div class="experiment-card-body">
          <div class="experiment-card-theme">Thema</div>
          <div class="experiment-card-title">${t.name}</div>
          <div class="experiment-card-desc">Interaktive Simulation – spiele mit den Parametern und beobachte, was passiert!</div>
        </div>
        <button class="experiment-card-btn" onclick="openExperiment('${t.exp}')">▶ Simulation<br>starten</button>`;
      expList.appendChild(card);
    });
  } else {
    expSection.style.display = 'none';
  }

  // Exercises
  renderExercises(subject, 'all');

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderExercises(subject, btn.dataset.diff);
    };
  });
}

function renderExercises(subject, diffFilter) {
  const list = document.getElementById('exercisesList');
  list.innerHTML = '';
  const exercises = subject.exercises.filter(e =>
    diffFilter === 'all' || String(e.diff) === String(diffFilter)
  );
  if (exercises.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:32px">Keine Aufgaben für diese Schwierigkeitsstufe.</p>';
    return;
  }
  exercises.forEach(ex => {
    const doneKey = `${state.gradeId}_${state.subjectId}_${ex.id}`;
    const isDone = state.progress[doneKey];
    const item = document.createElement('div');
    item.className = `exercise-item${isDone ? ' done' : ''}`;
    item.innerHTML = `
      <div class="exercise-top">
        <span class="exercise-type">${ex.type}</span>
        <span class="exercise-diff-stars">${DIFF_STARS[ex.diff]}</span>
        <span style="font-size:.75rem;color:var(--text-muted)">${DIFF_LABEL[ex.diff]}</span>
        ${isDone ? `<span class="exercise-done-badge">✅ ${isDone}% korrekt</span>` : ''}
      </div>
      <div class="exercise-title">${ex.title}</div>
      <div class="exercise-desc">${ex.desc}</div>
      <button class="btn-start-exercise" onclick="startExercise('${ex.id}')">
        ${isDone ? '🔄 Nochmal üben' : '▶ Aufgabe starten'}
      </button>`;
    list.appendChild(item);
  });
}

// ============================================================
// INTRO VIDEO – Themen erklären mit Microsoft Hedda
// ============================================================

// Spiele alle Themen nacheinander (mit Grafik-Wechsel pro Thema)
function playAllTopics(subject) {
  stopIntro();
  let idx = 0;
  const btn = document.getElementById('playIntroBtn');
  const pauseBtn = document.getElementById('pauseIntroBtn');
  const stopBtn = document.getElementById('stopIntroBtn');
  if (btn) { btn.disabled = true; btn.textContent = '🔊 Spielt alle Themen…'; }
  if (pauseBtn) pauseBtn.classList.remove('hidden');
  if (stopBtn)  stopBtn.classList.remove('hidden');

  function playNext() {
    if (idx >= subject.topics.length) {
      _clearTopicHighlights();
      hideTopicVisual();
      if (btn) { btn.disabled = false; btn.textContent = '🔄 Nochmal anhören'; btn.onclick = () => playAllTopics(subject); }
      if (pauseBtn) pauseBtn.classList.add('hidden');
      if (stopBtn)  stopBtn.classList.add('hidden');
      const timeEl = document.getElementById('videoTime');
      if (timeEl) timeEl.textContent = 'fertig';
      return;
    }
    const topic = subject.topics[idx];
    if (topic.isChapter) { idx++; playNext(); return; }
    _clearTopicHighlights();
    const li = document.getElementById(`topic-item-${idx}`);
    if (li) li.classList.add('topic-active');
    const tb = document.getElementById(`topicBtn${idx}`);
    if (tb) tb.classList.add('playing');
    showTopicVisual(topic);
    const speech = document.getElementById('avatarSpeech');
    if (speech) speech.textContent = topic.explanation.substring(0, 90) + '…';
    _speakSequential(`${topic.name}. ${topic.explanation}`, () => {
      idx++;
      playNext();
    });
  }
  playNext();
}

// Spiele ein einzelnes Thema
function playTopic(idx) {
  const grade   = CONTENT[state.gradeId];
  const subject = grade?.subjects.find(s => s.id === state.subjectId);
  if (!subject) return;
  const topic = subject.topics[idx];
  if (!topic?.explanation) return;

  stopIntro();
  _clearTopicHighlights();
  state.currentTopicName = topic.name;

  // KI-Aufgabe automatisch neu generieren
  const _aiBox = document.getElementById('aiExerciseBox');
  if (_aiBox) { _aiBox.classList.add('hidden'); _aiBox.innerHTML = ''; }
  generateAIExercise();

  // Highlight aktives Topic
  const activeItem = document.getElementById(`topic-item-${idx}`);
  if (activeItem) activeItem.classList.add('topic-active');
  const activeBtn = document.getElementById(`topicBtn${idx}`);
  if (activeBtn) activeBtn.classList.add('playing');

  // Sprechblase + Grafik befüllen (Hintergrund, bleibt sichtbar hinter Modal)
  const speech = document.getElementById('avatarSpeech');
  if (speech) speech.textContent = (topic.short ? topic.short[0] : topic.explanation.substring(0, 90)) + '…';
  showTopicVisual(topic);

  // Animated explainer modal — rein visuell, keine Stimme
  const grade2   = CONTENT[state.gradeId];
  const subject2 = grade2?.subjects.find(s => s.id === state.subjectId);
  showExplainer(topic, subject2?.icon, subject2?.color);
}

function _clearTopicHighlights() {
  document.querySelectorAll('.topic-item').forEach(el => el.classList.remove('topic-active'));
  document.querySelectorAll('.topic-play-btn').forEach(el => el.classList.remove('playing'));
}

function showTopicVisual(topic) {
  const el = document.getElementById('videoIllustration');
  if (!el) return;
  el.innerHTML = TOPIC_VISUALS[topic.name] || `<div class="vis-main">${topic.name}</div>`;
  el.classList.remove('hidden');
}

function hideTopicVisual() {
  const el = document.getElementById('videoIllustration');
  if (el) el.classList.add('hidden');
}

// Lightweight TTS for sequential playback (does not manage play/pause buttons)
function _speakSequential(text, onDone, _skipEleven) {
  text = _mathToSpoken(text);
  if (ELEVEN_KEY && !_skipEleven) { _elevenSpeakSequential(text, onDone); return; }
  if (!('speechSynthesis' in window)) { if (onDone) setTimeout(onDone, 600); return; }
  const voice = _getVoice();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 1.02; utt.pitch = 0.92; utt.lang = 'de-DE';
  if (voice) utt.voice = voice;
  currentUtterance = utt;
  speechPaused = false;

  const words = text.trim().split(/\s+/).length;
  const totalSec = Math.max(4, Math.ceil((words / 135) * 60));
  const fill = document.getElementById('videoProgressFill');
  const timeEl = document.getElementById('videoTime');
  const avatar = document.getElementById('avatarAnim');
  if (avatar) avatar.classList.add('talking');
  if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
  const t0 = Date.now();
  state.introInterval = setInterval(() => {
    if (speechPaused) return;
    const elapsed = (Date.now() - t0) / 1000;
    if (fill) fill.style.width = Math.min(elapsed / totalSec, 0.98) * 100 + '%';
    if (timeEl) timeEl.textContent = `${fmt(elapsed)} / ${fmt(totalSec)}`;
  }, 120);

  utt.onstart = () => _startLipSync();
  utt.onboundary = e => {
    if (e.name !== 'word') return;
    _lipIdx = 3 + Math.floor(Math.random() * 4);
  };
  const finish = () => {
    clearInterval(state.introInterval);
    _stopLipSync();
    if (avatar) avatar.classList.remove('talking');
    currentUtterance = null;
    if (onDone) onDone();
  };
  utt.onend = finish;
  utt.onerror = finish;
  _startLipSync();
  speechSynthesis.speak(utt);
}

// Kern-Sprech-Funktion (Hedda fest)
function _speakText(text, topicIdx, onDone, _skipEleven) {
  text = _mathToSpoken(text);
  if (ELEVEN_KEY && !_skipEleven) { _elevenSpeakText(text, onDone); return; }
  const btn      = document.getElementById('playIntroBtn');
  const pauseBtn = document.getElementById('pauseIntroBtn');
  const stopBtn  = document.getElementById('stopIntroBtn');
  const avatar   = document.getElementById('avatarAnim');
  const fill     = document.getElementById('videoProgressFill');
  const timeEl   = document.getElementById('videoTime');

  if (!('speechSynthesis' in window)) {
    _runTextAnimation(text, btn, pauseBtn, stopBtn, avatar, fill, timeEl);
    return;
  }

  const voice = _getVoice();
  const utterance  = new SpeechSynthesisUtterance(text);
  utterance.rate   = 1.02;
  utterance.pitch  = 0.92;
  utterance.lang   = 'de-DE';
  if (voice) utterance.voice = voice;

  currentUtterance = utterance;
  speechPaused     = false;

  const words    = text.trim().split(/\s+/).length;
  const totalSec = Math.max(4, Math.ceil((words / 135) * 60));

  if (btn) { btn.disabled = true; btn.textContent = '🔊 Spricht…'; }
  if (pauseBtn) pauseBtn.classList.remove('hidden');
  if (stopBtn)  stopBtn.classList.remove('hidden');
  avatar.classList.add('talking');
  fill.style.transition = 'none';
  fill.style.width = '0%';

  const startTime = Date.now();
  state.introInterval = setInterval(() => {
    if (speechPaused) return;
    const elapsed = (Date.now() - startTime) / 1000;
    const pct = Math.min(elapsed / totalSec, 0.98);
    fill.style.width = (pct * 100) + '%';
    timeEl.textContent = `${fmt(elapsed)} / ${fmt(totalSec)}`;
  }, 120);

  utterance.onstart = () => _startLipSync();
  utterance.onboundary = e => {
    if (e.name !== 'word') return;
    _lipIdx = 3 + Math.floor(Math.random() * 4);
  };

  utterance.onend = () => {
    clearInterval(state.introInterval);
    _stopLipSync();
    avatar.classList.remove('talking');
    fill.style.transition = 'width .4s';
    fill.style.width = '100%';
    timeEl.textContent = `${fmt(totalSec)} / ${fmt(totalSec)}`;
    if (pauseBtn) pauseBtn.classList.add('hidden');
    if (stopBtn)  stopBtn.classList.add('hidden');
    currentUtterance = null;
    if (onDone) onDone();
  };
  utterance.onerror = () => {
    clearInterval(state.introInterval);
    avatar.classList.remove('talking');
    if (btn) { btn.disabled = false; btn.textContent = '▶ Alle Themen anhören'; }
    if (pauseBtn) pauseBtn.classList.add('hidden');
    if (stopBtn)  stopBtn.classList.add('hidden');
    _clearTopicHighlights();
  };

  speechSynthesis.speak(utterance);
}

// Alias für Abwärtskompatibilität (stopIntro ruft das auf)
function startIntro(text) { _speakText(text, null, null); }

function _onIntroEnd(btn, pauseBtn, stopBtn, avatar, fill, timeEl, totalSec, text) {
  clearInterval(state.introInterval);
  avatar.classList.remove('talking');
  fill.style.transition = 'width .4s';
  fill.style.width = '100%';
  timeEl.textContent = `${fmt(totalSec)} / ${fmt(totalSec)}`;
  btn.disabled = false;
  btn.textContent = '🔄 Nochmal abspielen';
  btn.onclick = () => startIntro(text);
  pauseBtn.classList.add('hidden');
  stopBtn.classList.add('hidden');
  currentUtterance = null;
}

// Reines Text-Animations-Fallback (ohne Stimme)
function _runTextAnimation(text, btn, pauseBtn, stopBtn, avatar, fill, timeEl) {
  const totalChars = text.length;
  const total = Math.ceil(totalChars * 32 / 1000);
  const speech = document.getElementById('avatarSpeech');
  speech.textContent = '';
  btn.disabled = true;
  btn.textContent = '⏸ Wird abgespielt…';
  avatar.classList.add('talking');
  const start = Date.now();

  function tick() {
    const elapsed = (Date.now() - start) / 1000;
    const pct = Math.min(elapsed / total, 1);
    fill.style.width = (pct * 100) + '%';
    timeEl.textContent = `${fmt(elapsed)} / ${fmt(total)}`;
    speech.textContent = text.substring(0, Math.floor(pct * totalChars));
    if (pct < 1) {
      state.introTimer = setTimeout(tick, 80);
    } else {
      avatar.classList.remove('talking');
      btn.disabled = false;
      btn.textContent = '🔄 Nochmal abspielen';
      btn.onclick = () => startIntro(text);
      pauseBtn?.classList.add('hidden');
      stopBtn?.classList.add('hidden');
    }
  }
  tick();
}

function toggleHint() {
  const hintEl  = document.getElementById('quizHint');
  const hintBtn = document.getElementById('hintToggleBtn');
  const hidden  = hintEl.classList.toggle('hidden');
  hintBtn.textContent = hidden ? '💡 Tipp anzeigen' : '💡 Tipp verbergen';
  hintBtn.classList.toggle('shown', !hidden);
}

function togglePause() {
  if (!currentUtterance) return;
  const pauseBtn = document.getElementById('pauseIntroBtn');
  const avatar   = document.getElementById('avatarAnim');

  if (_currentAudio) {
    // ElevenLabs HTML5-Audio
    if (_currentAudio.paused) {
      _currentAudio.play();
      speechPaused = false;
      if (pauseBtn) pauseBtn.textContent = '⏸ Pause';
      avatar.classList.add('talking');
      _startLipSync();
    } else {
      _currentAudio.pause();
      speechPaused = true;
      if (pauseBtn) pauseBtn.textContent = '▶ Weiter';
      avatar.classList.remove('talking');
      _stopLipSync();
    }
    return;
  }

  if (!('speechSynthesis' in window)) return;
  if (speechPaused) {
    speechSynthesis.resume();
    speechPaused = false;
    if (pauseBtn) pauseBtn.textContent = '⏸ Pause';
    avatar.classList.add('talking');
  } else {
    speechSynthesis.pause();
    speechPaused = true;
    if (pauseBtn) pauseBtn.textContent = '▶ Weiter';
    avatar.classList.remove('talking');
  }
}

function stopIntro() {
  clearInterval(state.introInterval);
  clearTimeout(state.introTimer);
  if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  _stopLipSync();
  currentUtterance = null;
  speechPaused     = false;
  _clearTopicHighlights();
  hideTopicVisual();
  const avatar   = document.getElementById('avatarAnim');
  const pauseBtn = document.getElementById('pauseIntroBtn');
  const stopBtn  = document.getElementById('stopIntroBtn');
  if (avatar)   avatar.classList.remove('talking');
  if (pauseBtn) { pauseBtn.classList.add('hidden'); pauseBtn.textContent = '⏸ Pause'; }
  if (stopBtn)  stopBtn.classList.add('hidden');
}

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

// ============================================================
// QUIZ
// ============================================================
function startExercise(exerciseId) {
  state.exerciseId = exerciseId;
  navigate('quiz');
}

function renderQuiz() {
  showView('viewQuiz');
  const grade = CONTENT[state.gradeId];
  const subject = grade?.subjects.find(s => s.id === state.subjectId);
  const exercise = subject?.exercises.find(e => e.id === state.exerciseId);
  if (!exercise) return;

  state.quiz = {
    questions: exercise.questions,
    index: 0,
    score: 0,
    answered: false,
    exerciseTitle: exercise.title,
    subjectName: subject.name,
    wrongAnswers: [],
  };

  document.getElementById('quizMeta').textContent = `${grade.label} · ${subject.name} · ${exercise.title}`;
  document.getElementById('backToSubjectBtn').onclick = () => navigate('subject');
  renderQuestion();
}

function renderQuestion() {
  const { questions, index } = state.quiz;
  const q = questions[index];
  state.quiz.answered = false;

  const total = questions.length;
  const pct = ((index) / total) * 100;
  document.getElementById('quizProgressFill').style.width = pct + '%';
  document.getElementById('quizCounter').textContent = `Frage ${index + 1} von ${total}`;

  document.getElementById('quizQuestion').textContent = q.q;
  const hintEl = document.getElementById('quizHint');
  hintEl.textContent = `💡 ${q.hint}`;
  hintEl.classList.add('hidden');
  const hintBtn = document.getElementById('hintToggleBtn');
  if (hintBtn) { hintBtn.textContent = '💡 Tipp anzeigen'; hintBtn.classList.remove('shown'); }
  document.getElementById('quizFeedback').className = 'quiz-feedback hidden';
  document.getElementById('nextQuestionBtn').classList.add('hidden');

  const optContainer = document.getElementById('quizOptions');
  optContainer.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i, q.correct, q.explanation, btn);
    optContainer.appendChild(btn);
  });
}

function selectAnswer(chosen, correct, explanation, clickedBtn) {
  if (state.quiz.answered) return;
  state.quiz.answered = true;

  const allBtns = document.querySelectorAll('.quiz-option');
  allBtns.forEach(b => b.disabled = true);

  const isCorrect = chosen === correct;
  if (isCorrect) {
    state.quiz.score++;
  } else {
    const curQ = state.quiz.questions[state.quiz.index];
    state.quiz.wrongAnswers.push({
      num: state.quiz.index + 1,
      question: curQ.q,
      yourAnswer: curQ.options[chosen],
      correctAnswer: curQ.options[correct],
      explanation,
    });
  }

  clickedBtn.classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) allBtns[correct].classList.add('correct');

  const fb = document.getElementById('quizFeedback');
  fb.className = `quiz-feedback ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
  fb.innerHTML = `${isCorrect ? '✅ Richtig!' : '❌ Leider falsch.'} <br><strong>Erklärung:</strong> ${explanation}`;

  const nextBtn = document.getElementById('nextQuestionBtn');
  nextBtn.classList.remove('hidden');

  const isLast = state.quiz.index >= state.quiz.questions.length - 1;
  nextBtn.textContent = isLast ? '🏁 Auswertung anzeigen' : 'Weiter →';
}

function nextQuestion() {
  if (state.quiz.index >= state.quiz.questions.length - 1) {
    finishQuiz();
    return;
  }
  state.quiz.index++;
  renderQuestion();
}

function finishQuiz() {
  const { score, questions, exerciseTitle, subjectName } = state.quiz;
  const pct = Math.round((score / questions.length) * 100);

  // Save progress
  const key = `${state.gradeId}_${state.subjectId}_${state.exerciseId}`;
  const old = state.progress[key] || 0;
  state.progress[key] = Math.max(old, pct);
  localStorage.setItem('ls_progress', JSON.stringify(state.progress));

  navigate('result');
  renderResultView(score, questions.length, pct, exerciseTitle);
}

function renderResultView(score, total, pct, exerciseTitle) {
  showView('viewResult');

  let emoji, title, sub;
  if (pct >= 90) { emoji='🏆'; title='Ausgezeichnet!'; sub='Du bist ein echter Lernstar! Weiter so!'; }
  else if (pct >= 70) { emoji='🎉'; title='Sehr gut gemacht!'; sub='Du hast die meisten Aufgaben richtig. Mit etwas Übung wirst du noch besser!'; }
  else if (pct >= 50) { emoji='👍'; title='Gut versucht!'; sub='Du bist auf dem richtigen Weg! Versuch es nochmal, um dein Ergebnis zu verbessern.'; }
  else { emoji='💪'; title='Nicht aufgeben!'; sub='Auch das gehört zum Lernen dazu. Schau dir die Erklärungen an und versuch es erneut!'; }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultSub').textContent = `${sub} Du hast ${score} von ${total} Aufgaben richtig.`;
  document.getElementById('scoreText').innerHTML = `<span class="score-big">${pct}%</span><span class="score-small">${score}/${total}</span>`;

  // Animate ring
  const circle = document.getElementById('scoreCircle');
  const circumference = 314;
  const offset = circumference - (pct / 100) * circumference;
  setTimeout(() => { circle.style.strokeDashoffset = offset; circle.style.transition = 'stroke-dashoffset 1.2s ease'; }, 100);

  // Badges
  const badges = document.getElementById('resultBadges');
  badges.innerHTML = '';
  const bs = [];
  if (pct === 100) bs.push({ cls:'gold', icon:'🥇', text:'Perfekt – 100%!' });
  if (pct >= 80)  bs.push({ cls:'gold', icon:'⭐', text:'Lernstar-Badge' });
  if (pct >= 60)  bs.push({ cls:'silver', icon:'🎓', text:'Fleißige Biene' });
  bs.push({ cls:'bronze', icon:'💪', text:'Nie aufgegeben!' });
  bs.forEach((b, i) => {
    const el = document.createElement('div');
    el.className = `result-badge ${b.cls}`;
    el.style.animationDelay = (i * .15) + 's';
    el.innerHTML = `${b.icon} ${b.text}`;
    badges.appendChild(el);
  });

  document.getElementById('retryBtn').onclick = retryQuiz;

  // Wrong answer review
  const reviewEl = document.getElementById('resultReview');
  if (reviewEl) {
    const wrong = state.quiz.wrongAnswers || [];
    if (wrong.length === 0) {
      reviewEl.innerHTML = `<div class="review-perfect">🎯 Perfekt! Alle ${total} Antworten richtig!</div>`;
    } else {
      reviewEl.innerHTML = `
        <div class="review-title">📋 Deine Auswertung</div>
        <div class="review-summary">
          <div class="review-stat correct-stat">
            <span class="review-stat-icon">✅</span>
            <span class="review-stat-val">${score}</span>
            <span class="review-stat-lbl">Richtig</span>
          </div>
          <div class="review-stat wrong-stat">
            <span class="review-stat-icon">❌</span>
            <span class="review-stat-val">${total - score}</span>
            <span class="review-stat-lbl">Falsch</span>
          </div>
        </div>
        <div class="review-mistakes-title">Was du verbessern kannst</div>
        ${wrong.map(w => `
          <div class="review-item">
            <div class="review-q-num">Aufgabe ${w.num}</div>
            <div class="review-question">${w.question}</div>
            <div class="review-answers">
              <div class="review-your">Deine Antwort: <span>${w.yourAnswer}</span></div>
              <div class="review-correct">Richtige Antwort: <span>${w.correctAnswer}</span></div>
            </div>
            <div class="review-explanation">💡 ${w.explanation}</div>
          </div>`).join('')}`;
    }
  }
}

function retryQuiz() {
  navigate('quiz');
}

// ============================================================
// SIDEBAR
// ============================================================
function updateSidebarGrades() {
  const list = document.getElementById('gradeNavList');
  list.innerHTML = '';
  Object.values(CONTENT).forEach(grade => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#" onclick="navigate('grade','${grade.id}');closeSidebar();return false;" class="${state.gradeId===grade.id?'active':''}">
      ${grade.emoji} ${grade.label}
    </a>`;
    list.appendChild(li);
  });
}

function updateSidebarSubjects(grade) {
  const section = document.getElementById('subjectNavSection');
  const list = document.getElementById('subjectNavList');
  if (!grade) { section.style.display='none'; return; }
  section.style.display='block';
  list.innerHTML = '';
  grade.subjects.forEach(sub => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#" onclick="navigate('subject','${grade.id}','${sub.id}');closeSidebar();return false;" class="${state.subjectId===sub.id?'active':''}">
      ${sub.icon} ${sub.name}
    </a>`;
    list.appendChild(li);
  });
}

function updateSidebarActive() {
  updateSidebarGrades();
  if (state.gradeId && CONTENT[state.gradeId]) {
    updateSidebarSubjects(CONTENT[state.gradeId]);
  } else {
    document.getElementById('subjectNavSection').style.display='none';
  }
}

// ============================================================
// PROGRESS
// ============================================================
function getGradeProgress(gradeId) {
  const grade = CONTENT[gradeId];
  if (!grade) return 0;
  let total = 0, done = 0;
  grade.subjects.forEach(sub => {
    sub.exercises.forEach(ex => {
      total++;
      if (state.progress[`${gradeId}_${sub.id}_${ex.id}`]) done++;
    });
  });
  return total === 0 ? 0 : Math.round((done/total)*100);
}

function getSubjectProgress(gradeId, subjectId) {
  const subject = CONTENT[gradeId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return 0;
  let done = 0;
  subject.exercises.forEach(ex => {
    if (state.progress[`${gradeId}_${subjectId}_${ex.id}`]) done++;
  });
  return subject.exercises.length === 0 ? 0 : Math.round((done/subject.exercises.length)*100);
}

function updateGlobalProgress() {
  let total = 0, done = 0;
  Object.keys(CONTENT).forEach(gradeId => {
    CONTENT[gradeId].subjects.forEach(sub => {
      sub.exercises.forEach(ex => {
        total++;
        if (state.progress[`${gradeId}_${sub.id}_${ex.id}`]) done++;
      });
    });
  });
  const pct = total === 0 ? 0 : Math.round((done/total)*100);
  document.getElementById('globalProgress').style.width = pct + '%';
  document.getElementById('globalProgressText').textContent = pct + '%';
}

// ============================================================
// HELPERS
// ============================================================
function showView(id) {
  const el = document.getElementById(id);
  el.classList.remove('hidden');
  el.classList.add('view-enter');
  setTimeout(() => el.classList.remove('view-enter'), 400);
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

// ============================================================
// KI-PROVIDER ABSTRACTION – unabhängig von einem einzigen Anbieter
// ============================================================
const GROQ_KEY = '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';

// Standard-Anbieter – eigene KI zuerst, Groq als Online-Fallback
const _defaultProviders = [
  {
    id:      'local',
    name:    'Eigene KI (LernStar)',
    url:     'http://localhost:5000/v1/chat/completions',
    key:     'local',
    model:   'lernstar-finetuned',
    builtin: true,
    active:  true
  },
  {
    id:      'groq',
    name:    'Groq (Online-Fallback)',
    url:     'https://api.groq.com/openai/v1/chat/completions',
    key:     GROQ_KEY,
    model:   'llama-3.3-70b-versatile',
    builtin: true,
    active:  true
  }
];

// Lädt benutzerdefinierte Anbieter aus localStorage
function _getProviders() {
  const custom = JSON.parse(localStorage.getItem('ls_ai_providers') || '[]');
  return [..._defaultProviders, ...custom];
}

// Universelle KI-Aufruf-Funktion – probiert alle aktiven Anbieter der Reihe nach
async function _aiCall(messages, opts = {}) {
  const providers = _getProviders().filter(p => p.active && p.url && p.key);
  let lastErr = new Error('Kein KI-Anbieter konfiguriert.');

  for (const p of providers) {
    try {
      const body = {
        model:       opts.model || p.model,
        messages,
        max_tokens:  opts.max_tokens  ?? 700,
        temperature: opts.temperature ?? 0.7
      };
      if (opts.response_format) body.response_format = opts.response_format;

      const res = await fetch(p.url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${p.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error?.message || `HTTP ${res.status}`);
      }

      const data    = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
      throw new Error('Leere Antwort.');
    } catch (e) {
      lastErr = e;
      console.warn(`[LernStar] Anbieter "${p.name}" fehlgeschlagen: ${e.message}`);
    }
  }
  throw lastErr;
}

// ============================================================
// CHAT WIDGET  –  Herr Lala KI-Assistent
// ============================================================

// ── Lernstoff-Kontext: aktuelle Themen-Inhalte aus content.js ──
function _buildCurriculumContext() {
  const g = state.gradeId, s = state.subjectId;
  if (!g || !s) return '';
  const subject = CONTENT[g]?.subjects.find(x => x.id === s);
  if (!subject) return '';

  let ctx = `\n\n📚 LERNSTOFF (LernStar-Curriculum – ${subject.name}):\n`;

  // Aktuelle Themen-Erklärung einbinden
  if (state.currentTopicName) {
    const t = subject.topics.find(x => x.name === state.currentTopicName);
    if (t?.explanation) {
      ctx += `Aktuelles Thema „${t.name}":\n${t.explanation}\n`;
    }
  }

  // Alle Themen des Fachs auflisten (Überblick für Herr Lala)
  const names = subject.topics.filter(t => !t.isChapter).map(t => t.name);
  if (names.length) ctx += `Alle Themen: ${names.slice(0, 20).join(' · ')}`;
  return ctx;
}

// ── Langzeit-Gedächtnis: Lernhistorie aus localStorage ──────
function _buildMemoryContext() {
  const entries = Object.entries(state.progress);
  if (!entries.length) return '';
  const avg    = Math.round(entries.reduce((s,[,v]) => s+v, 0) / entries.length);
  const weak   = [...new Set(entries.filter(([,v]) => v<60).map(([k]) => k.split('_')[1]))].slice(0,4);
  const strong = [...new Set(entries.filter(([,v]) => v>=80).map(([k]) => k.split('_')[1]))].slice(0,4);
  let mem = `\n\n🧠 GEDÄCHTNIS – Lernhistorie von ${state.userName||'dem Schüler'}:\n`;
  mem += `${entries.length} Aufgaben gelöst · Ø ${avg}% Erfolg\n`;
  if (strong.length) mem += `Stärken: ${strong.join(', ')}\n`;
  if (weak.length)   mem += `Schwachstellen: ${weak.join(', ')}\n`;
  return mem;
}

function _getChatSystem() {
  const name     = state.userName;
  const gradeRaw = state.gradeId;
  const grade    = gradeRaw ? `Klasse ${gradeRaw.replace('klasse','')}` : null;
  const subj     = gradeRaw && state.subjectId
    ? CONTENT[gradeRaw]?.subjects.find(s => s.id === state.subjectId)?.name || null
    : null;
  const topic    = state.currentTopicName;
  const goalMap  = { normal:'allgemeines Lernen', zap:'ZAP-Prüfung', abitur:'Abitur-Vorbereitung' };
  const goal     = goalMap[state.learningGoal] || 'Lernen';

  let wer = 'Du hilfst';
  if (name)  wer += ` ${name}`;
  if (grade) wer += ` aus ${grade}`;
  if (subj)  wer += ` im Fach ${subj}`;
  if (topic) wer += ` beim Thema „${topic}"`;
  wer += ` (Ziel: ${goal}).`;

  return `Du bist Herr Lala – der persönliche KI-Tutor der Lernplattform LernStar.
Du bist kein allgemeiner Chatbot. Du kennst jeden Inhalt von LernStar auswendig und arbeitest ausschließlich für diese Plattform.
${wer}

PERSÖNLICHKEIT:
- Du unterrichtest seit 15 Jahren Mathematik und Physik und liebst Aha-Momente.
- Du erinnerst dich an alles was in diesem Gespräch besprochen wurde.
- Du bist geduldig: wenn jemand es nicht versteht, versuchst du eine andere Erklärung.
- Du fragst nach dem Gespräch immer: „Hast du noch Fragen dazu?"
- Du kennst den Schüler persönlich und gehst auf seine Stärken und Schwächen ein.
${state.learningGoal === 'zap' ? '- Du bereitest gezielt auf die ZAP-Prüfung vor und kennst typische Aufgabenformate.' : ''}
${state.learningGoal === 'abitur' ? '- Du erklärst auf Abiturniveau mit vollständigen Herleitungen und Fachbegriffen.' : ''}${_buildMemoryContext()}${_buildCurriculumContext()}

ANTWORTREGELN:
- Antworte IMMER auf Deutsch.
- Niveau anpassen an${grade ? ` ${grade}` : ' Schüler'}.
- ${name ? `Sprich ${name} mit Namen an.` : 'Sprich den Schüler direkt an.'}
- Alltagsbeispiele nutzen (Pizza, Geld, Sport, Smartphones).
- Bei Fehlern: erst Mut machen, dann Erklärung.

MATHEMATIK: Jeden Ausdruck in $...$: $\\frac{3}{4}$ · $v = s \\cdot t$ · $\\sqrt{9}=3$. Niemals $$.`;
}

let _chatOpen = false;
let _chatHistory = []; // Gesprächsverlauf für Multi-Turn-Kontext (max. 12 Nachrichten)

function _chatToggle() {
  _chatOpen = !_chatOpen;
  const panel   = document.getElementById('chatPanel');
  const overlay = document.getElementById('chatOverlay');
  panel.classList.toggle('open', _chatOpen);
  panel.setAttribute('aria-hidden', String(!_chatOpen));
  overlay.classList.toggle('visible', _chatOpen);
  if (_chatOpen) {
    setTimeout(() => document.getElementById('chatInput')?.focus(), 250);
    document.getElementById('chatFabBadge').style.display = 'none';
  }
}

function _chatClose() {
  _chatOpen = false;
  document.getElementById('chatPanel').classList.remove('open');
  document.getElementById('chatPanel').setAttribute('aria-hidden', 'true');
  document.getElementById('chatOverlay').classList.remove('visible');
}

function _fixMath(t) {
  // Entferne \text{...} – nur den Inhalt behalten
  t = t.replace(/\\text\{([^}]*)\}/g, '$1');
  // Alle $ entfernen (KaTeX-Delimiter) – wir ersetzen Brüche direkt durch HTML
  t = t.replace(/\$/g, '');
  // \frac{a}{b} → HTML-Bruch
  t = t.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g,
    '<span class="chat-frac"><sup>$1</sup><span>⁄</span><sub>$2</sub></span>');
  // \sqrt{x} → √x
  t = t.replace(/\\sqrt\{([^}]*)\}/g, '√$1');
  // ^2 → ²
  t = t.replace(/\^(\d)/g, '<sup>$1</sup>');
  // Übrige LaTeX-Befehle: Inhalt behalten
  t = t.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1');
  t = t.replace(/\\[a-zA-Z]+/g, '');
  // Einfache Brüche im Text: 1/4 → HTML
  t = t.replace(/\b(\d+)\/(\d+)\b/g,
    '<span class="chat-frac"><sup>$1</sup><span>⁄</span><sub>$2</sub></span>');
  return t;
}

function _chatAddBubble(text, role) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = `chat-bubble chat-bubble-${role}`;
  if (role === 'bot' && typeof marked !== 'undefined') {
    div.innerHTML = marked.parse(_fixMath(text));
  } else {
    div.innerHTML = text.replace(/\n/g, '<br>');
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function _chatShowTyping() {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-typing';
  div.id = 'chatTyping';
  div.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function _chatHideTyping() {
  document.getElementById('chatTyping')?.remove();
}

let _chatImageB64  = null;   // base64-String des hochgeladenen Bildes
let _chatImageMime = null;   // z.B. "image/jpeg"

function _chatSetImage(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    _chatImageMime = file.type || 'image/jpeg';
    _chatImageB64  = dataUrl.split(',')[1];
    const preview  = document.getElementById('chatImgPreview');
    const thumb    = document.getElementById('chatImgThumb');
    const imgBtn   = document.querySelector('.chat-img-btn');
    thumb.src      = dataUrl;
    preview.style.display = 'block';
    imgBtn?.classList.add('has-img');
    document.getElementById('chatInput').placeholder = 'Zusatzfrage zum Bild (optional)…';
  };
  reader.readAsDataURL(file);
}

function _chatClearImage() {
  _chatImageB64  = null;
  _chatImageMime = null;
  document.getElementById('chatImgPreview').style.display = 'none';
  document.getElementById('chatImgThumb').src = '';
  document.getElementById('chatImgInput').value = '';
  document.querySelector('.chat-img-btn')?.classList.remove('has-img');
  document.getElementById('chatInput').placeholder = 'Frage schreiben, sprechen oder Bild hochladen…';
}

async function _chatAsk(question) {
  const sendBtn  = document.getElementById('chatSend');
  const input    = document.getElementById('chatInput');
  const hasImage = !!_chatImageB64;
  const imgB64   = _chatImageB64;
  const imgMime  = _chatImageMime;

  // Bubble anzeigen
  if (hasImage) {
    const thumb = document.getElementById('chatImgThumb').src;
    const label = question ? `📷 ${question}` : '📷 Bitte diese Aufgabe lösen und erklären';
    _chatAddBubble(`<img src="${thumb}" style="max-width:180px;border-radius:8px;display:block;margin-bottom:6px">${label}`, 'user');
  } else {
    _chatAddBubble(question, 'user');
  }

  input.value = '';
  _chatClearImage();
  sendBtn.disabled = true;
  _chatShowTyping();

  try {
    // Gesprächsverlauf aufbauen (System + Verlauf + neue Nachricht)
    const historySlice = _chatHistory.slice(-12);
    let answer;

    if (hasImage) {
      // Bildverarbeitung: direkt über Groq (braucht Vision-Modell)
      const userContent = [
        { type: 'image_url', image_url: { url: `data:${imgMime};base64,${imgB64}` } },
        { type: 'text', text: question || 'Bitte löse diese Aufgabe Schritt für Schritt auf Deutsch.' },
      ];
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{ role: 'system', content: _getChatSystem() }, ...historySlice, { role: 'user', content: userContent }],
          max_tokens: 700, temperature: 0.7
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      answer = d.choices?.[0]?.message?.content || '(Keine Antwort)';
    } else {
      // Text: über _aiCall() mit automatischem Fallback
      const messages = [
        { role: 'system', content: _getChatSystem() },
        ...historySlice,
        { role: 'user', content: question }
      ];
      answer = await _aiCall(messages, { max_tokens: 700, temperature: 0.7 });
    }

    // Verlauf aktualisieren (nur Text, kein Bild-Blob speichern)
    _chatHistory.push({ role: 'user',      content: hasImage ? '[Bild] ' + (question || '') : question });
    _chatHistory.push({ role: 'assistant', content: answer });

    _chatHideTyping();
    _chatAddBubble(answer, 'bot');


  } catch (e) {
    _chatHideTyping();
    _chatAddBubble(`❌ Fehler: ${e.message}`, 'error');
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

// ============================================================
// KI FEATURES – Onboarding, Prüfungsmodus, Lernanalyse
// ============================================================

// ── ONBOARDING ───────────────────────────────────────────────
function checkOnboarding() {
  const overlay = document.getElementById('onboardingOverlay');
  if (!overlay) return;
  if (!state.onboardingDone) {
    overlay.classList.remove('hidden');
    setTimeout(() => document.getElementById('obNameInput')?.focus(), 200);
  }
  _updateKIBadges();
}

function obSetName() {
  const input = document.getElementById('obNameInput');
  const name  = input?.value.trim();
  if (!name) { input?.focus(); return; }
  state.userName = name;
  localStorage.setItem('ls_userName', name);
  const greetEl = document.getElementById('obGreetName');
  if (greetEl) greetEl.textContent = name;
  document.getElementById('obStep1').classList.add('hidden');
  document.getElementById('obStep2').classList.remove('hidden');
}

function obSetGoal(goal) {
  state.learningGoal  = goal;
  state.onboardingDone = true;
  localStorage.setItem('ls_learningGoal', goal);
  localStorage.setItem('ls_onboardingDone', '1');
  const overlay = document.getElementById('onboardingOverlay');
  if (overlay) overlay.classList.add('hidden');
  _updateKIBadges();
}

function resetOnboarding() {
  state.onboardingDone = false;
  state.userName = null;
  state.learningGoal = 'normal';
  ['ls_onboardingDone','ls_userName','ls_learningGoal'].forEach(k => localStorage.removeItem(k));
  closeSidebar();
  checkOnboarding();
}

function _updateKIBadges() {
  const nameBadge = document.getElementById('userNameBadge');
  const goalBadge = document.getElementById('goalBadge');
  if (nameBadge) {
    if (state.userName) {
      nameBadge.textContent = `👤 ${state.userName}`;
      nameBadge.style.display = '';
    } else {
      nameBadge.style.display = 'none';
    }
  }
  if (goalBadge) {
    const icons   = { normal:'📚', zap:'🎯', abitur:'🏆' };
    const labels  = { normal:'Lernen', zap:'ZAP', abitur:'Abitur' };
    goalBadge.textContent = `${icons[state.learningGoal]||'📚'} ${labels[state.learningGoal]||'Lernen'}`;
    goalBadge.style.display = '';
  }
}

// ── KI-AUFGABE GENERIEREN ────────────────────────────────────
let _aiExPending = false;

async function generateAIExercise() {
  if (_aiExPending) return;
  const gradeId   = state.gradeId;
  const subjectId = state.subjectId;
  if (!gradeId || !subjectId) return;

  const gradeNum    = gradeId.replace('klasse', '');
  const subjectName = CONTENT[gradeId]?.subjects.find(s => s.id === subjectId)?.name || subjectId;
  const topic       = state.currentTopicName || null;
  const diffNum     = state.examDiff || 2;

  const btn = document.getElementById('aiExerciseBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ KI generiert…'; }
  _aiExPending = true;

  try {
    // 1. Eigene KI (lokale Aufgaben in localStorage)
    if (typeof LernStarAI !== 'undefined' && LernStarAI.count() > 0) {
      const ex = LernStarAI.generateMC(subjectName, gradeNum, topic, diffNum);
      if (ex) { _renderAIExBox(ex); return; }
    }

    // 2. Groq / externer Anbieter als Fallback
    const diffMap = { 1:'einfach', 2:'mittelschwer', 3:'schwer' };
    const diff    = diffMap[diffNum] || 'mittelschwer';
    const prompt  = `Erstelle eine ${diff}e Multiple-Choice-Aufgabe für Klasse ${gradeNum} ${subjectName}`
      + (topic ? ` zum Thema „${topic}"` : '') + '.\n'
      + 'Das JSON muss enthalten: title, question, options (4 Strings), correct (0-3), explanation, hint.';

    const raw    = await _aiCall([
      { role: 'system', content: 'Du bist Schullehrer. Antworte nur mit JSON: title, question, options, correct, explanation, hint.' },
      { role: 'user',   content: prompt }
    ], { max_tokens: 600, temperature: 0.8 });

    const parsed = _parseAIJSON(raw);
    if (parsed) {
      parsed.title       = parsed.title       || 'KI-Aufgabe';
      parsed.options     = parsed.options      || ['A','B','C','D'];
      parsed.correct     = parsed.correct      ?? 0;
      parsed.explanation = parsed.explanation  || '';
      parsed.hint        = parsed.hint         || '';
      _renderAIExBox(parsed);
    } else {
      _renderAIExBox(null, '');
    }
  } catch {
    _renderAIExBox(null, '');
  } finally {
    _aiExPending = false;
    if (btn) { btn.disabled = false; btn.textContent = '🔄 Neue KI-Aufgabe'; }
  }
}

function _escQ(s) { return String(s).replace(/'/g,"\\'").replace(/"/g,'&quot;'); }

function _renderAIExBox(ex, err) {
  const box = document.getElementById('aiExerciseBox');
  if (!box) return;
  box.classList.remove('hidden');
  if (err) { box.classList.add('hidden'); return; }
  box.innerHTML = `
    <div class="ai-ex-badge">🤖 KI-generiert</div>
    <div class="ai-ex-title">${ex.title}</div>
    <div class="ai-ex-question">${ex.question}</div>
    <div class="ai-ex-options">
      ${ex.options.map((opt,i) => `
        <button class="ai-ex-opt" onclick="_checkAIEx(${i},${ex.correct},this,'${_escQ(ex.explanation)}')">
          <span class="ai-ex-opt-letter">${'ABCD'[i]}</span>${opt}
        </button>`).join('')}
    </div>
    <button class="hint-toggle-btn" style="margin-top:10px" onclick="this.nextElementSibling.classList.toggle('hidden')">💡 Tipp</button>
    <div class="quiz-hint hidden">${ex.hint}</div>
    <div class="ai-ex-expl hidden" id="aiExExpl"></div>`;
}

function _checkAIEx(chosen, correct, btn, explanation) {
  document.querySelectorAll('.ai-ex-opt').forEach(b => b.disabled = true);
  const isRight = chosen === correct;
  document.querySelectorAll('.ai-ex-opt')[correct].classList.add('ai-ex-correct');
  if (!isRight) btn.classList.add('ai-ex-wrong');
  const expl = document.getElementById('aiExExpl');
  if (expl) { expl.textContent = explanation; expl.classList.remove('hidden'); }
}

// ── PRÜFUNGSMODUS ────────────────────────────────────────────
function renderExamPrep() {
  showView('viewExamPrep');
  setExamMode(state.examMode);

  const gradeId = state.gradeId;
  const btns    = document.getElementById('examSubjectBtns');
  if (!btns) return;
  btns.innerHTML = '';

  let subjects = [];
  if (gradeId && CONTENT[gradeId]) {
    subjects = CONTENT[gradeId].subjects;
  } else {
    const seen = new Set();
    Object.values(CONTENT).forEach(g => g.subjects.forEach(s => {
      if (!seen.has(s.id)) { seen.add(s.id); subjects.push(s); }
    }));
  }

  subjects.forEach(s => {
    const b = document.createElement('button');
    b.className = 'exam-subject-btn' + (state.examSubjectId === s.id ? ' active' : '');
    b.innerHTML = `${s.icon||''} ${s.name}`;
    b.onclick = () => { state.examSubjectId = s.id; document.querySelectorAll('.exam-subject-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); };
    btns.appendChild(b);
  });

  if (!state.examSubjectId && subjects.length) {
    state.examSubjectId = subjects[0].id;
    btns.firstChild?.classList.add('active');
  }

  ['examSession','examResults'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
  document.getElementById('examSetup')?.classList.remove('hidden');
}

function setExamMode(mode) {
  state.examMode = mode;
  document.getElementById('tabZAP')?.classList.toggle('active', mode === 'zap');
  document.getElementById('tabAbi')?.classList.toggle('active', mode === 'abitur');
  const title = document.getElementById('examPrepTitle');
  const sub   = document.getElementById('examPrepSub');
  if (title) title.textContent = mode === 'zap' ? '🎯 ZAP-Vorbereitung' : '🏆 Abitur-Vorbereitung';
  if (sub)   sub.textContent   = mode === 'zap'
    ? 'KI-generierte Aufgaben im ZAP-Stil · Klasse 9–10'
    : 'KI-generierte Aufgaben auf Abiturniveau · Gymnasium';
}

function setExamDiff(diff) {
  state.examDiff = diff;
  document.querySelectorAll('.exam-diff-btn').forEach(b => b.classList.toggle('active', +b.dataset.diff === diff));
}

// Robuste JSON-Extraktion: funktioniert auch mit Markdown-Codeblöcken
function _parseAIJSON(text) {
  let t = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  try { const p = JSON.parse(t); if (p) return p; } catch {}
  const arrM = t.match(/\[[\s\S]*\]/);
  if (arrM) { try { const p = JSON.parse(arrM[0]); if (p) return p; } catch {} }
  const objM = t.match(/\{[\s\S]*\}/);
  if (objM) { try { const p = JSON.parse(objM[0]); if (p) return p; } catch {} }
  return null;
}

// Fragen aus beliebigem Struktur extrahieren (key-unabhängig)
function _extractQuestions(parsed) {
  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed.filter(q => q.question || q.frage || q.Frage);
  // Beliebigen Array-Wert im Objekt suchen (erster Array mit Fragenstruktur)
  for (const val of Object.values(parsed)) {
    if (Array.isArray(val) && val.length > 0) {
      const first = val[0];
      if (first && (first.question || first.frage || first.Frage || first.options || first.Antworten)) {
        // Normalisieren: unterschiedliche Feldnamen vereinheitlichen
        return val.map(q => ({
          question:    q.question || q.frage || q.Frage || q.text || '?',
          options:     q.options  || q.Antworten || q.antworten || ['A','B','C','D'],
          correct:     typeof q.correct !== 'undefined' ? q.correct : (q.richtig ?? 0),
          explanation: q.explanation || q.Erklärung || q.erklaerung || ''
        }));
      }
    }
  }
  return [];
}

let _examRunning = false;

async function startExamSession() {
  if (_examRunning) return;
  if (!state.examSubjectId) { alert('Bitte erst ein Fach auswählen.'); return; }

  document.getElementById('examSetup')?.classList.add('hidden');
  document.getElementById('examResults')?.classList.add('hidden');
  document.getElementById('examSession')?.classList.remove('hidden');

  const card = document.getElementById('examQuestionCard');
  if (card) card.innerHTML = '<div class="exam-loading">⏳ Herr Lala bereitet 5 Aufgaben vor…</div>';

  state.examSession = { questions:[], current:0, score:0, answers:[] };
  _examRunning = true;

  const gradeNum = state.gradeId ? state.gradeId.replace('klasse','') : '10';
  const subjName = state.gradeId
    ? CONTENT[state.gradeId]?.subjects.find(s => s.id === state.examSubjectId)?.name || state.examSubjectId
    : state.examSubjectId;
  const modeText = state.examMode === 'zap'
    ? 'ZAP-Abschlussprüfung (Klasse 10, Deutschland)'
    : 'Abitur (gymnasiale Oberstufe, Deutschland)';
  const diffMap  = { 1:'einfach', 2:'mittelschwer', 3:'schwer' };
  const diff     = diffMap[state.examDiff] || 'mittelschwer';

  try {
    const prompt = `Erstelle genau 5 ${diff}e Multiple-Choice-Fragen für das Schulfach ${subjName}, Klasse ${gradeNum}, im Stil einer ${modeText}.
Jede Frage hat genau 4 Antwortmöglichkeiten. Der Wert "correct" ist der Index (0-3) der richtigen Antwort.
Antworte mit einem JSON-Objekt in diesem Format:
{"questions":[{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."},{"question":"...","options":["...","...","...","..."],"correct":1,"explanation":"..."},{"question":"...","options":["...","...","...","..."],"correct":2,"explanation":"..."},{"question":"...","options":["...","...","...","..."],"correct":0,"explanation":"..."},{"question":"...","options":["...","...","...","..."],"correct":3,"explanation":"..."}]}`;

    const raw = await _aiCall([
      { role: 'system', content: 'Du bist ein Prüfungsersteller für deutsche Schulen. Antworte immer mit einem JSON-Objekt mit einem "questions"-Array.' },
      { role: 'user', content: prompt }
    ], { max_tokens: 2000, temperature: 0.65, response_format: { type: 'json_object' } });
    const parsed = _parseAIJSON(raw);
    const questions = _extractQuestions(parsed);
    if (!questions.length) throw new Error('Keine Fragen erhalten – bitte nochmal versuchen.');
    state.examSession.questions = questions.slice(0,5);
    _showExamQ(0);
  } catch (e) {
    if (card) card.innerHTML = `<div class="ai-ex-error">❌ ${e.message}<br><br><button class="btn-secondary" onclick="startExamSession()">🔄 Nochmal</button> <button class="btn-secondary" onclick="renderExamPrep()">← Zurück</button></div>`;
  } finally {
    _examRunning = false;
  }
}

function _showExamQ(idx) {
  const q     = state.examSession.questions[idx];
  if (!q) return;
  const total = state.examSession.questions.length;
  const fill  = document.getElementById('examProgressFill');
  const ctr   = document.getElementById('examQCounter');
  if (fill) fill.style.width = `${(idx/total)*100}%`;
  if (ctr)  ctr.textContent  = `Frage ${idx+1} / ${total}`;

  const card = document.getElementById('examQuestionCard');
  if (!card) return;
  card.innerHTML = `
    <div class="exam-q-text">${q.question}</div>
    <div class="exam-q-opts">
      ${q.options.map((opt,i) => `
        <button class="exam-q-opt" onclick="_answerExamQ(${i})">
          <span class="exam-opt-letter">${'ABCD'[i]}</span>${opt}
        </button>`).join('')}
    </div>
    <div class="exam-q-fb hidden" id="examFB"></div>
    <div class="hidden" id="examNext">
      <button class="btn-primary" style="margin-top:16px" onclick="_nextExamQ()">
        ${idx+1 < total ? 'Nächste Frage →' : '📊 Auswertung anzeigen'}
      </button>
    </div>`;
}

function _answerExamQ(chosen) {
  const q = state.examSession.questions[state.examSession.current];
  const ok = chosen === q.correct;
  if (ok) state.examSession.score++;
  state.examSession.answers.push({ chosen, correct: q.correct });

  document.querySelectorAll('.exam-q-opt').forEach(b => b.disabled = true);
  document.querySelectorAll('.exam-q-opt')[q.correct].classList.add('exam-correct');
  if (!ok) document.querySelectorAll('.exam-q-opt')[chosen].classList.add('exam-wrong');

  const fb = document.getElementById('examFB');
  if (fb) {
    fb.textContent = (ok ? '✅ Richtig! ' : '❌ Falsch. ') + q.explanation;
    fb.className   = `exam-q-fb ${ok ? 'exam-fb-ok' : 'exam-fb-err'}`;
  }
  document.getElementById('examNext')?.classList.remove('hidden');
}

function _nextExamQ() {
  const next = ++state.examSession.current;
  if (next < state.examSession.questions.length) _showExamQ(next);
  else _showExamResults();
}

function _showExamResults() {
  const { score, questions, answers } = state.examSession;
  const total = questions.length;
  const pct   = Math.round((score/total)*100);
  document.getElementById('examSession')?.classList.add('hidden');

  const res = document.getElementById('examResults');
  if (!res) return;
  res.classList.remove('hidden');

  const emoji  = pct>=80?'🏆':pct>=60?'😊':'💪';
  const msg    = pct>=80?'Ausgezeichnet!':pct>=60?'Gut gemacht!':'Weiter üben!';
  const status = pct>=80?'🟢 Bestanden':pct>=60?'🟡 Knapp bestanden':'🔴 Mehr Übung nötig';

  res.innerHTML = `
    <div class="exam-res-header">
      <div class="exam-res-emoji">${emoji}</div>
      <div class="exam-res-title">${msg}</div>
      <div class="exam-res-score">${score} / ${total} richtig (${pct}%)</div>
      <div class="exam-res-status">${status}</div>
    </div>
    <div class="exam-res-review">
      ${questions.map((q,i) => {
        const ans = answers[i]; const ok = ans?.chosen===ans?.correct;
        return `<div class="exam-rev-item ${ok?'exam-rev-ok':'exam-rev-fail'}">
          <span class="exam-rev-n">${i+1}</span>
          <span class="exam-rev-q">${q.question}</span>
          <span>${ok?'✅':'❌'}</span>
        </div>`;
      }).join('')}
    </div>
    <div class="exam-res-actions">
      <button class="btn-primary" onclick="startExamSession()">🔄 Nochmal</button>
      <button class="btn-secondary" onclick="renderExamPrep()">← Neue Sitzung</button>
      <button class="btn-secondary" onclick="navigate('home')">🏠 Startseite</button>
    </div>`;
}

// ── LERNANALYSE ──────────────────────────────────────────────
function renderAnalyse() {
  showView('viewAnalyse');

  const userInfo = document.getElementById('analyseUserInfo');
  if (userInfo) {
    const name = state.userName || 'Anonym';
    const goalLbl = { normal:'Allgemeines Lernen', zap:'ZAP-Vorbereitung', abitur:'Abitur-Vorbereitung' };
    userInfo.innerHTML = `<span class="an-name">👤 ${name}</span> <span class="an-goal">${goalLbl[state.learningGoal]||'Lernen'}</span>`;
  }

  const entries = Object.entries(state.progress);
  const grid = document.getElementById('analyseGrid');
  if (!grid) return;

  if (!entries.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 20px">Noch keine Aufgaben gelöst. Starte jetzt und komm dann wieder!</p>';
    const aiEl = document.getElementById('analyseAiText');
    if (aiEl) aiEl.textContent = 'Keine Daten vorhanden. Löse ein paar Aufgaben!';
    return;
  }

  // Gesamtstatistik
  const allScores = entries.map(([,v]) => v);
  const avgAll    = Math.round(allScores.reduce((a,b) => a+b, 0) / allScores.length);

  // Pro Fach
  const bySub = {};
  entries.forEach(([k, score]) => {
    const parts = k.split('_');
    if (parts.length < 3) return;
    const s = parts[1];
    if (!bySub[s]) bySub[s] = [];
    bySub[s].push(score);
  });

  grid.innerHTML = '';
  const totalCard = document.createElement('div');
  totalCard.className = 'an-card an-card-total';
  totalCard.innerHTML = `
    <div class="an-icon">📊</div>
    <div class="an-val">${entries.length}</div>
    <div class="an-lbl">Aufgaben gelöst</div>
    <div class="an-avg">${avgAll}% Ø Erfolg</div>`;
  grid.appendChild(totalCard);

  Object.entries(bySub).forEach(([subj, scores]) => {
    const avg  = Math.round(scores.reduce((a,b) => a+b, 0) / scores.length);
    const col  = avg>=80?'#059669':avg>=60?'#D97706':'#DC2626';
    const lbl  = avg>=80?'🟢 Stark':avg>=60?'🟡 Mittel':'🔴 Üben';
    const icon = subj==='mathe'?'📐':subj==='physik'?'⚛️':'📚';
    const card = document.createElement('div');
    card.className = 'an-card';
    card.innerHTML = `
      <div class="an-icon">${icon}</div>
      <div class="an-val" style="color:${col}">${avg}%</div>
      <div class="an-lbl">${subj[0].toUpperCase()+subj.slice(1)}</div>
      <div class="an-avg">${lbl} · ${scores.length} Aufgaben</div>
      <div class="an-bar-wrap"><div class="an-bar" style="width:${avg}%;background:${col}"></div></div>`;
    grid.appendChild(card);
  });

  // Schwachstellen
  const weak = entries.filter(([,v]) => v < 60);
  const weakBox = document.getElementById('analyseWeaknesses');
  if (weakBox) {
    weakBox.innerHTML = weak.length === 0
      ? '<div class="an-strong">🎉 Keine Schwachstellen – weiter so!</div>'
      : `<h3 class="an-weak-title">⚠️ Verbesserungspotenzial (${weak.length} Aufgaben unter 60%)</h3>
         <div class="an-weak-list">${weak.slice(0,6).map(([k,v]) => {
           const p = k.split('_');
           return `<div class="an-weak-item"><span>📌 ${p[1]||'?'} · ${p[2]||'?'}</span><span class="an-weak-score">${v}%</span></div>`;
         }).join('')}</div>`;
  }

  _loadAnalyseAI(entries, bySub, avgAll);
}

async function _loadAnalyseAI(entries, bySub, avgAll) {
  const el = document.getElementById('analyseAiText');
  if (!el) return;
  el.textContent = '⏳ Analyse läuft…';

  const name    = state.userName || 'du';
  const subjSum = Object.entries(bySub).map(([s,sc]) => {
    const avg = Math.round(sc.reduce((a,b) => a+b, 0) / sc.length);
    return `${s} ${avg}% (${sc.length} Aufg.)`;
  }).join(', ');

  try {
    const content = await _aiCall([
      { role: 'system', content: 'Du bist Herr Lala, ein ermutigender Schultutor. Antworte auf Deutsch, 3–4 Sätze, persönlich und motivierend.' },
      { role: 'user',   content: `Ich heiße ${name}. Ergebnisse: ${entries.length} Aufgaben, Ø ${avgAll}%. Fächer: ${subjSum}. Gib mir eine persönliche Rückmeldung und einen konkreten nächsten Schritt.` }
    ], { max_tokens: 180 });
    el.textContent = content;
  } catch {
    el.textContent = `Toll, ${name}! Du hast bereits ${entries.length} Aufgaben gelöst. Schau dir die Schwachstellen an und übe gezielt weiter!`;
  }
}

// ── AI SETTINGS ──────────────────────────────────────────────
function openAISettings() {
  const modal = document.getElementById('aiSettingsModal');
  if (!modal) return;
  _renderProviderList();
  modal.classList.remove('hidden');
}

function closeAISettings() {
  document.getElementById('aiSettingsModal')?.classList.add('hidden');
}

function _renderProviderList() {
  const list = document.getElementById('aiProviderList');
  if (!list) return;
  const custom = JSON.parse(localStorage.getItem('ls_ai_providers') || '[]');
  const all = [..._defaultProviders, ...custom];
  list.innerHTML = all.map((p, i) => `
    <div class="ai-provider-item ${p.active ? 'active' : 'inactive'}">
      <div class="ai-provider-info">
        <strong>${p.name}</strong>
        <span class="ai-provider-url">${p.url}</span>
        <span class="ai-provider-model">${p.model}</span>
      </div>
      <div class="ai-provider-actions">
        ${p.builtin
          ? `<span class="ai-provider-builtin">Standard</span>`
          : `<button class="btn-ai-remove" onclick="removeProvider(${i - _defaultProviders.length})">✕ Entfernen</button>`
        }
      </div>
    </div>
  `).join('');
}

function saveOllamaProvider() {
  const url = (document.getElementById('ollamaUrl')?.value || '').trim() || 'http://localhost:11434/v1/chat/completions';
  const model = (document.getElementById('ollamaModel')?.value || '').trim() || 'llama3';
  _addCustomProvider({ id: 'ollama_' + Date.now(), name: 'Ollama (Lokal)', url, key: 'ollama', model });
}

function saveCustomProvider() {
  const name  = (document.getElementById('customName')?.value  || '').trim();
  const url   = (document.getElementById('customUrl')?.value   || '').trim();
  const key   = (document.getElementById('customKey')?.value   || '').trim();
  const model = (document.getElementById('customModel')?.value || '').trim();
  if (!url || !key || !model) { alert('Bitte URL, API-Key und Modell angeben.'); return; }
  _addCustomProvider({ id: 'custom_' + Date.now(), name: name || 'Eigene API', url, key, model });
}

function _addCustomProvider(p) {
  const custom = JSON.parse(localStorage.getItem('ls_ai_providers') || '[]');
  custom.push({ ...p, active: true });
  localStorage.setItem('ls_ai_providers', JSON.stringify(custom));
  _renderProviderList();
  // clear inputs
  ['ollamaUrl','ollamaModel','customName','customUrl','customKey','customModel'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

function removeProvider(customIndex) {
  const custom = JSON.parse(localStorage.getItem('ls_ai_providers') || '[]');
  custom.splice(customIndex, 1);
  localStorage.setItem('ls_ai_providers', JSON.stringify(custom));
  _renderProviderList();
}

async function testAIProvider(url, key, model) {
  const btn = document.getElementById('testProviderBtn');
  const out = document.getElementById('testProviderResult');
  if (btn) btn.disabled = true;
  if (out) out.textContent = '⏳ Teste…';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: [{ role:'user', content:'Hallo' }], max_tokens: 10 })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;
    if (out) out.textContent = reply ? `✅ Verbunden! Antwort: "${reply}"` : '✅ Verbunden (leere Antwort)';
  } catch(e) {
    if (out) out.textContent = `❌ Fehler: ${e.message}`;
  } finally {
    if (btn) btn.disabled = false;
  }
}

function testCustomProvider() {
  const url   = (document.getElementById('customUrl')?.value  || '').trim();
  const key   = (document.getElementById('customKey')?.value  || '').trim();
  const model = (document.getElementById('customModel')?.value|| '').trim();
  if (!url || !key || !model) { alert('Bitte URL, API-Key und Modell für den Test ausfüllen.'); return; }
  testAIProvider(url, key, model);
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkOnboarding();
});

// ============================================================
// EVENT LISTENERS
// ============================================================
document.getElementById('chatFab')?.addEventListener('click', _chatToggle);
document.getElementById('chatClose')?.addEventListener('click', _chatClose);
document.getElementById('chatOverlay')?.addEventListener('click', _chatClose);
document.getElementById('chatForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const q = document.getElementById('chatInput').value.trim();
  if (q || _chatImageB64) _chatAsk(q);
});
document.getElementById('chatImgInput')?.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (file) _chatSetImage(file);
});
document.getElementById('chatImgRemove')?.addEventListener('click', _chatClearImage);

// Drag & Drop Bild in Chat
document.getElementById('chatMessages')?.addEventListener('dragover', e => e.preventDefault());
document.getElementById('chatMessages')?.addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer.files?.[0];
  if (file?.type.startsWith('image/')) _chatSetImage(file);
});

// ---- Spracheingabe ----
(function () {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn    = document.getElementById('chatMic');
  if (!micBtn) return;

  if (!SpeechRec) {
    micBtn.title   = 'Spracheingabe wird von diesem Browser nicht unterstützt';
    micBtn.style.opacity = '0.35';
    micBtn.style.cursor  = 'not-allowed';
    return;
  }

  const rec = new SpeechRec();
  rec.lang             = 'de-DE';
  rec.continuous       = false;
  rec.interimResults   = true;
  let _listening = false;

  rec.onstart = () => {
    _listening = true;
    micBtn.classList.add('recording');
    micBtn.title = 'Aufnahme läuft… (nochmal klicken zum Stoppen)';
    document.getElementById('chatInput').placeholder = '🎤 Sprich jetzt…';
  };

  rec.onresult = e => {
    const transcript = Array.from(e.results)
      .map(r => r[0].transcript).join('');
    document.getElementById('chatInput').value = transcript;
    if (e.results[e.results.length - 1].isFinal) {
      _listening = false;
      micBtn.classList.remove('recording');
      micBtn.title = 'Sprechen';
      document.getElementById('chatInput').placeholder = 'Schreibe oder sprich deine Frage…';
      const q = transcript.trim();
      if (q) _chatAsk(q);
    }
  };

  rec.onerror = () => {
    _listening = false;
    micBtn.classList.remove('recording');
    document.getElementById('chatInput').placeholder = 'Schreibe oder sprich deine Frage…';
  };

  rec.onend = () => {
    _listening = false;
    micBtn.classList.remove('recording');
    document.getElementById('chatInput').placeholder = 'Schreibe oder sprich deine Frage…';
  };

  micBtn.addEventListener('click', () => {
    if (_listening) { rec.stop(); return; }
    document.getElementById('chatInput').value = '';
    try { rec.start(); } catch(e) {}
  });
})();

document.getElementById('sidebarToggle').addEventListener('click', openSidebar);
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

// Keyboard: Escape closes sidebar, chat and settings
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeSidebar(); _chatClose(); closeAISettings(); }
});

// ============================================================
// EXPERIMENT
// ============================================================

let _sim = null;

function openExperiment(expId) {
  const ex = document.getElementById('expModal');
  if (ex) { ex.remove(); if (_sim) _sim.stop(); }

  const modal = document.createElement('div');
  modal.id = 'expModal';
  modal.className = 'sim-overlay';

  if (expId === 'fadenstrahlrohr') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">⚛️ Elektronenstrahl im Magnetfeld</h3>
        <canvas id="fstCanvas" width="460" height="260" style="width:100%;border-radius:8px;display:block"></canvas>
        <div style="padding:10px 16px 4px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="background:#f3f0ff;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#6D28D9;font-weight:700;margin-bottom:4px">⚡ Spannung U<sub>B</sub> — mehr → Kreis GRÖSSER</div>
            <input type="range" id="fstUSlider" min="100" max="400" step="25" value="200"
              oninput="_fstSetU(this.value)" style="width:100%;accent-color:#7C3AED">
            <div style="text-align:center;font-weight:800;font-size:1rem;color:#5B21B6"><span id="fstULabel">200</span> V</div>
          </div>
          <div style="background:#f0f9ff;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#0369A1;font-weight:700;margin-bottom:4px">🔌 Strom I<sub>S</sub> — mehr → Kreis KLEINER</div>
            <input type="range" id="fstISlider" min="5" max="20" step="1" value="15"
              oninput="_fstSetI(this.value)" style="width:100%;accent-color:#0EA5E9">
            <div style="text-align:center;font-weight:800;font-size:1rem;color:#0369A1"><span id="fstILabel">1,5</span> A</div>
          </div>
        </div>
        <div class="sim-info-row" style="margin-top:8px">
          <span>r = <b id="fstRVal">4,1</b> cm</span>
          <span>2r = <b id="fst2RVal">8,2</b> cm</span>
          <span>e/m ≈ <b id="fstEmVal">1,76</b> × 10¹¹ C/kg</span>
        </div>
        <div id="fstResult" class="sim-result" style="margin:6px 14px 8px;display:none"></div>
        <p class="sim-hint" id="fstUVal" style="text-align:center;margin:2px 0 6px">Formel: <b>e/m = 2U / (B² · r²)</b> · Literaturwert: <b>1,76 × 10¹¹ C/kg</b></p>
      </div>`;
    document.body.appendChild(modal);
    _sim = _fstCreate();
  } else {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🧪 Experiment: Gleichförmige Bewegung</h3>
        <canvas id="simRoad" class="sim-road-canvas" width="700" height="130"></canvas>
        <div class="sim-info-row">
          <span>⏱ Zeit: <b id="simT">0,0 s</b></span>
          <span>📏 Weg: <b id="simS">0 m</b></span>
          <span>Tempo:
            <select id="simV" onchange="_simSetV(this.value)">
              <option value="5">5 m/s (langsam)</option>
              <option value="10" selected>10 m/s (mittel)</option>
              <option value="20">20 m/s (schnell)</option>
            </select>
          </span>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="simPlayBtn" onclick="_simToggle()">▶ Start</button>
          <button class="sim-btn" onclick="_simMeasure()">📍 Jetzt messen</button>
          <button class="sim-btn" onclick="_simReset()">↺ Neu starten</button>
        </div>
        <p class="sim-hint">Drücke mehrmals auf <b>Jetzt messen</b> während das Auto fährt – die Punkte erscheinen im Diagramm. Klicke dann auf <b>zwei Punkte</b> um die Steigung (= Geschwindigkeit) zu berechnen!</p>
        <div class="sim-diagram-label">s-t Diagramm <span style="font-weight:400;font-size:.82em;color:#64748B">(zwei Punkte anklicken → Steigung = Geschwindigkeit)</span></div>
        <canvas id="simChart" class="sim-chart-canvas" width="680" height="290"></canvas>
        <div id="simResult" class="sim-result"></div>
        <table class="sim-table" id="simTableWrap" style="display:none">
          <thead><tr><th>Punkt</th><th>Zeit t (s)</th><th>Weg s (m)</th></tr></thead>
          <tbody id="simTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simCreate();
    document.getElementById('simChart').addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });
  }
}

function closeExperiment() {
  if (_sim) { _sim.stop(); _sim = null; }
  const m = document.getElementById('expModal');
  if (m) m.remove();
}

function _simSetV(v) { if (_sim) _sim.setV(parseFloat(v)); }
function _simToggle()  { if (_sim) _sim.toggle(); }
function _simMeasure() { if (_sim) _sim.measure(); }
function _simReset()   { if (_sim) _sim.reset(); }

function _simCreate() {
  const MAX_S = 100;
  let st = { running:false, t:0, s:0, v:10, meas:[], sel:[], raf:null, last:null };

  function stop() {
    if (st.raf) cancelAnimationFrame(st.raf);
    st.running = false; st.last = null;
  }

  function setV(v) { st.v = v; }

  function toggle() {
    if (st.running) {
      stop();
      const b = document.getElementById('simPlayBtn');
      if (b) b.textContent = '▶ Weiter';
    } else if (st.s < MAX_S) {
      st.running = true;
      const b = document.getElementById('simPlayBtn');
      if (b) b.textContent = '⏸ Pause';
      function loop(ts) {
        if (!st.running) return;
        if (st.last !== null) {
          st.t += Math.min((ts - st.last) / 1000, 0.05);
          st.s = Math.min(st.v * st.t, MAX_S);
        }
        st.last = ts;
        const tEl = document.getElementById('simT');
        const sEl = document.getElementById('simS');
        if (tEl) tEl.textContent = st.t.toFixed(1).replace('.',',') + ' s';
        if (sEl) sEl.textContent = st.s.toFixed(1).replace('.',',') + ' m';
        drawRoad(); drawChart();
        if (st.s < MAX_S) st.raf = requestAnimationFrame(loop);
        else { stop(); if (b) b.textContent = '✅ Am Ziel'; }
      }
      st.raf = requestAnimationFrame(loop);
    }
  }

  function measure() {
    st.meas.push({ t: parseFloat(st.t.toFixed(1)), s: parseFloat(st.s.toFixed(1)) });
    st.sel = [];
    const res = document.getElementById('simResult');
    if (res) res.innerHTML = '';
    drawChart(); updateTable();
  }

  function reset() {
    stop();
    const v = parseFloat((document.getElementById('simV') || {value:'10'}).value);
    st = { running:false, t:0, s:0, v, meas:[], sel:[], raf:null, last:null };
    const b = document.getElementById('simPlayBtn');
    if (b) { b.textContent = '▶ Start'; b.disabled = false; }
    const tEl = document.getElementById('simT'); if (tEl) tEl.textContent = '0,0 s';
    const sEl = document.getElementById('simS'); if (sEl) sEl.textContent = '0 m';
    const res = document.getElementById('simResult'); if (res) res.innerHTML = '';
    const tb = document.getElementById('simTbody'); if (tb) tb.innerHTML = '';
    const tw = document.getElementById('simTableWrap'); if (tw) tw.style.display = 'none';
    drawRoad(); drawChart();
  }

  function handleClick(mx, my) {
    const PAD = {l:58,r:20,t:22,b:48}, cW=680, cH=290;
    const gW = cW-PAD.l-PAD.r, gH = cH-PAD.t-PAD.b;
    const maxT = Math.max(10, (MAX_S/st.v)+1);
    const tx = t => PAD.l + (t/maxT)*gW;
    const sy = s => PAD.t + gH - (s/MAX_S)*gH;
    let closest = -1, minD = 22;
    st.meas.forEach((m,i) => {
      const d = Math.hypot(tx(m.t)-mx, sy(m.s)-my);
      if (d < minD) { minD = d; closest = i; }
    });
    if (closest >= 0) {
      if (st.sel.includes(closest)) st.sel = st.sel.filter(i=>i!==closest);
      else if (st.sel.length < 2) st.sel.push(closest);
      else st.sel = [closest];
      drawChart();
    }
  }

  function drawRoad() {
    const c = document.getElementById('simRoad'); if (!c) return;
    const ctx = c.getContext('2d'), W = c.width, H = c.height;
    ctx.fillStyle='#C9E8F5'; ctx.fillRect(0,0,W,H*0.55);
    ctx.fillStyle='#9DC88D'; ctx.fillRect(0,H*0.55,W,H*0.18);
    ctx.fillStyle='#6B6B6B'; ctx.fillRect(0,H*0.70,W,H*0.30);
    ctx.fillStyle='#FFF'; ctx.fillRect(0,H*0.70,W,3); ctx.fillRect(0,H-3,W,3);
    ctx.strokeStyle='#FFD700'; ctx.setLineDash([22,16]); ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(0,H*0.845); ctx.lineTo(W,H*0.845); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font='10px Nunito,sans-serif'; ctx.textAlign='center';
    for (let m=0; m<=MAX_S; m+=20) {
      const x=(m/MAX_S)*W;
      ctx.fillStyle='#BBB'; ctx.fillRect(x-1,H*0.70,2,7);
      ctx.fillStyle='#444'; ctx.fillText(m+' m',x,H*0.67);
    }
    const carX = Math.min((st.s/MAX_S)*(W-72), W-72);
    const bY = H*0.72;
    ctx.fillStyle='#E74C3C';
    ctx.beginPath();
    ctx.moveTo(carX+4,bY+24); ctx.lineTo(carX+4,bY+7);
    ctx.lineTo(carX+14,bY+7); ctx.lineTo(carX+20,bY);
    ctx.lineTo(carX+50,bY); ctx.lineTo(carX+56,bY+7);
    ctx.lineTo(carX+68,bY+7); ctx.lineTo(carX+68,bY+24);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='#C0392B'; ctx.fillRect(carX+21,bY,29,8);
    ctx.fillStyle='#AED6F1';
    ctx.fillRect(carX+22,bY+1,11,7); ctx.fillRect(carX+36,bY+1,11,7);
    [carX+14, carX+54].forEach(wx => {
      ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(wx,bY+25,8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#888'; ctx.beginPath(); ctx.arc(wx,bY+25,4,0,Math.PI*2); ctx.fill();
    });
    const cx = carX+36;
    ctx.strokeStyle='rgba(231,76,60,.5)'; ctx.setLineDash([4,4]); ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(cx,H*0.70); ctx.lineTo(cx,H); ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawChart() {
    const c = document.getElementById('simChart'); if (!c) return;
    const ctx = c.getContext('2d'), cW=c.width, cH=c.height;
    const P = {l:58,r:20,t:22,b:48};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const maxT = Math.max(10, (MAX_S/st.v)+1);
    const tx = t => P.l+(t/maxT)*gW;
    const sy = s => P.t+gH-(s/MAX_S)*gH;
    ctx.clearRect(0,0,cW,cH);
    ctx.strokeStyle='#F0F0F0'; ctx.lineWidth=1;
    for (let i=1;i<=5;i++) {
      const y=P.t+(i/5)*gH; ctx.beginPath(); ctx.moveTo(P.l,y); ctx.lineTo(P.l+gW,y); ctx.stroke();
      const x=P.l+(i/5)*gW; ctx.beginPath(); ctx.moveTo(x,P.t); ctx.lineTo(x,P.t+gH); ctx.stroke();
    }
    ctx.strokeStyle='rgba(59,130,246,.18)'; ctx.lineWidth=2; ctx.setLineDash([7,5]);
    ctx.beginPath(); ctx.moveTo(tx(0),sy(0)); ctx.lineTo(tx(MAX_S/st.v),sy(MAX_S)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle='#333'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(P.l,P.t); ctx.lineTo(P.l,P.t+gH); ctx.lineTo(P.l+gW,P.t+gH); ctx.stroke();
    ctx.fillStyle='#333';
    ctx.beginPath(); ctx.moveTo(P.l+gW,P.t+gH); ctx.lineTo(P.l+gW+8,P.t+gH-4); ctx.lineTo(P.l+gW+8,P.t+gH+4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(P.l,P.t); ctx.lineTo(P.l-4,P.t+9); ctx.lineTo(P.l+4,P.t+9); ctx.fill();
    ctx.font='bold 13px Nunito,sans-serif'; ctx.fillStyle='#333'; ctx.textAlign='center';
    ctx.fillText('t in s', P.l+gW/2, cH-4);
    ctx.save(); ctx.translate(14,P.t+gH/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('s in m',0,0); ctx.restore();
    ctx.font='11px Nunito,sans-serif'; ctx.fillStyle='#666';
    for (let i=0;i<=5;i++) {
      ctx.textAlign='center'; ctx.fillText(((i/5)*maxT).toFixed(0), P.l+(i/5)*gW, P.t+gH+16);
      ctx.textAlign='right';  ctx.fillText(((i/5)*MAX_S).toFixed(0), P.l-6, sy((i/5)*MAX_S)+4);
    }
    if (st.t > 0.05) {
      ctx.fillStyle='rgba(231,76,60,.2)';
      ctx.beginPath(); ctx.arc(tx(st.t),sy(st.s),5,0,Math.PI*2); ctx.fill();
    }
    if (st.sel.length === 2) {
      const [i1,i2] = [...st.sel].sort((a,b)=>st.meas[a].t-st.meas[b].t);
      const p1=st.meas[i1], p2=st.meas[i2];
      const dt=parseFloat((p2.t-p1.t).toFixed(1));
      const ds=parseFloat((p2.s-p1.s).toFixed(1));
      const v = dt>0 ? (ds/dt).toFixed(1) : '–';
      ctx.strokeStyle='#F97316'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(tx(p1.t),sy(p1.s)); ctx.lineTo(tx(p2.t),sy(p2.s)); ctx.stroke();
      ctx.strokeStyle='#EF4444'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
      ctx.beginPath();
      ctx.moveTo(tx(p1.t),sy(p1.s)); ctx.lineTo(tx(p2.t),sy(p1.s)); ctx.lineTo(tx(p2.t),sy(p2.s));
      ctx.stroke(); ctx.setLineDash([]);
      ctx.font='bold 11px Nunito,sans-serif'; ctx.fillStyle='#DC2626';
      ctx.textAlign='center'; ctx.fillText('Δt = '+dt.toFixed(1)+' s', tx((p1.t+p2.t)/2), sy(p1.s)+18);
      ctx.textAlign='right';  ctx.fillText('Δs = '+ds.toFixed(0)+' m', tx(p2.t)-4, sy((p1.s+p2.s)/2)-6);
      const res = document.getElementById('simResult');
      if (res) res.innerHTML = 'Steigung = Δs ÷ Δt = <b>'+ds.toFixed(0)+' m</b> ÷ <b>'+dt.toFixed(1)+' s</b> = <b class="sim-v-result">'+v+' m/s</b> &nbsp;→&nbsp; Das ist die Geschwindigkeit <b>v</b>!';
    }
    st.meas.forEach((m,idx) => {
      const sel = st.sel.includes(idx);
      ctx.fillStyle = sel ? '#F97316' : '#16A34A';
      ctx.strokeStyle = sel ? '#C2410C' : '#15803D';
      ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(tx(m.t),sy(m.s),sel?9:7,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#fff'; ctx.font='bold 9px Nunito,sans-serif'; ctx.textAlign='center';
      ctx.fillText(idx+1, tx(m.t), sy(m.s)+3);
    });
  }

  function updateTable() {
    const tb = document.getElementById('simTbody');
    const tw = document.getElementById('simTableWrap');
    if (!tb||!tw) return;
    if (st.meas.length>0) tw.style.display='table';
    tb.innerHTML = st.meas.map((m,i)=>
      `<tr><td>P${i+1}</td><td>${m.t.toFixed(1).replace('.',',')}</td><td>${m.s.toFixed(1).replace('.',',')}</td></tr>`
    ).join('');
  }

  drawRoad(); drawChart();
  return { stop, toggle, measure, reset, handleClick, setV };
}

// ============================================================
// FADENSTRAHLROHR SIMULATION
// ============================================================
function _fstSetU(val) { if (_sim) _sim.setU(parseFloat(val)); }
function _fstSetI(val) { if (_sim) _sim.setI(parseFloat(val) / 10); }

function _fstCreate() {
  const canvas = document.getElementById('fstCanvas');
  if (!canvas) return { stop:()=>{} };
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height; // 460 × 260

  const e_c = 1.6e-19, me = 9.11e-31;
  const kB  = 7.8e-4;
  const kr  = Math.sqrt(2 * me / e_c);
  const SCALE = 2500;

  let U = 200, I = 1.5;
  let animId = null, dotAngle = 0;

  // Beam circle sits in upper area; ruler in bottom strip
  const CX = Math.round(W * 0.50);
  const CY = Math.round(H * 0.43);
  const MAX_R = Math.round(H * 0.38); // max beam radius in px

  function calcPhysics() {
    const B      = kB * I;
    const r_real = kr * Math.sqrt(U) / B;
    const r_px   = Math.min(r_real * SCALE, MAX_R);
    const em     = 2 * U / (B * B * r_real * r_real);
    return { r_real, r_px, em };
  }

  function draw() {
    const { r_real, r_px, em } = calcPhysics();
    ctx.clearRect(0, 0, W, H);

    // ── clean white background ───────────────────────────────────
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // ── light grid (graph-paper feel) ───────────────────────────
    ctx.strokeStyle = 'rgba(200,220,255,0.5)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // ── electron gun (left side, pointing right) ─────────────────
    const GX = 28, GY = CY;
    ctx.fillStyle = '#555';
    ctx.fillRect(GX - 18, GY - 8, 18, 16);
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(GX - 9, GY, 4, 0, 2 * Math.PI);
    ctx.fill();
    // arrow from gun
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(GX, GY);
    ctx.lineTo(GX + 12, GY);
    ctx.stroke();
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(GX + 14, GY);
    ctx.lineTo(GX + 8, GY - 4);
    ctx.lineTo(GX + 8, GY + 4);
    ctx.fill();
    // gun label
    ctx.fillStyle = '#555';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Kanone', GX - 9, GY + 18);

    // ── glowing beam circle ──────────────────────────────────────
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, r_px, 0, 2 * Math.PI);
    ctx.strokeStyle = '#00bb55';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#00ee77';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    // ── center cross ─────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(CX - r_px - 10, CY); ctx.lineTo(CX + r_px + 10, CY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX, CY - r_px - 10); ctx.lineTo(CX, CY + r_px + 10); ctx.stroke();
    ctx.setLineDash([]);

    // ── radius arrow ─────────────────────────────────────────────
    ctx.strokeStyle = '#e06000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.lineTo(CX + r_px, CY);
    ctx.stroke();
    ctx.fillStyle = '#e06000';
    ctx.beginPath();
    ctx.moveTo(CX + r_px + 1, CY);
    ctx.lineTo(CX + r_px - 7, CY - 4);
    ctx.lineTo(CX + r_px - 7, CY + 4);
    ctx.fill();
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('r = ' + (r_real * 100).toFixed(1).replace('.', ',') + ' cm',
      CX + r_px / 2, CY - 8);

    // ── moving electron (white dot with glow) ────────────────────
    dotAngle = (dotAngle + 0.04) % (2 * Math.PI);
    const ex = CX + r_px * Math.cos(dotAngle);
    const ey = CY + r_px * Math.sin(dotAngle);
    ctx.save();
    ctx.beginPath();
    ctx.arc(ex, ey, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#2255ff';
    ctx.shadowColor = '#88aaff';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('e⁻', ex, ey + 3);

    // ── ruler strip (bottom) ─────────────────────────────────────
    const RY = H - 30;
    const PX_CM = SCALE * 0.01; // 25 px = 1 cm
    const RL = CX - MAX_R, RW = MAX_R * 2;

    ctx.fillStyle = '#f8f8f8';
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.fillRect(RL, RY, RW, 22);
    ctx.strokeRect(RL, RY, RW, 22);

    ctx.strokeStyle = '#444';
    ctx.fillStyle = '#444';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    const cmMax = Math.floor(RW / PX_CM);
    for (let cm = 0; cm <= cmMax; cm++) {
      const x = RL + cm * PX_CM;
      const tk = (cm % 5 === 0) ? 11 : (cm % 2 === 0 ? 6 : 3);
      ctx.beginPath(); ctx.moveTo(x, RY); ctx.lineTo(x, RY + tk); ctx.stroke();
      if (cm % 2 === 0 && cm > 0) ctx.fillText(cm, x, RY + 19);
    }
    // highlight 2r on ruler
    const twoR_px = r_real * 200 * PX_CM;
    ctx.fillStyle = 'rgba(0,160,80,0.20)';
    ctx.fillRect(RL, RY + 1, Math.min(twoR_px, RW - 2), 10);
    ctx.strokeStyle = '#00994d';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(RL, RY + 6); ctx.lineTo(RL + twoR_px, RY + 6); ctx.stroke();
    ctx.fillStyle = '#007a3d';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('← 2r = ' + (r_real * 200).toFixed(1).replace('.', ',') + ' cm', RL + 2, RY - 3);

    // ── update HTML ──────────────────────────────────────────────
    const rD  = (r_real * 100).toFixed(1).replace('.', ',');
    const r2D = (r_real * 200).toFixed(1).replace('.', ',');
    const emD = (em / 1e11).toFixed(2).replace('.', ',');
    document.getElementById('fstRVal').textContent  = rD;
    document.getElementById('fst2RVal').textContent = r2D;
    document.getElementById('fstEmVal').textContent = emD;

    animId = requestAnimationFrame(draw);
  }

  function stop()    { if (animId) cancelAnimationFrame(animId); }
  function setU(val) {
    U = parseFloat(val);
    document.getElementById('fstULabel').textContent = U;
  }
  function setI(val) {
    I = parseFloat(val) / 10;
    document.getElementById('fstILabel').textContent = I.toFixed(1).replace('.', ',');
  }

  draw();
  return { stop, setU, setI };
}

// ============================================================
// ANIMATED EXPLAINER PLAYER  (visual, no TTS)
// ============================================================
let _xTimeout1  = null;
let _xTimeout2  = null;
let _xAutoTimer = null;
let _xPaused    = false;

// Visual animations per topic category
const _X_VISUALS = {
  // Numbers / arithmetic
  'Natürliche Zahlen & Stellenwerte': '<div class="xv-digits"><span class="xv-d" style="--d:0">4</span><span class="xv-d xv-hl" style="--d:1">7</span><span class="xv-d" style="--d:2">2</span><span class="xv-d" style="--d:3">3</span><div class="xv-label">T H Z E</div></div>',
  'Addition und Subtraktion':         '<div class="xv-ops"><span class="xv-op" style="--d:0">1247</span><span class="xv-op xv-sm" style="--d:1">+</span><span class="xv-op" style="--d:2">856</span><span class="xv-op xv-sm" style="--d:3">=</span><span class="xv-op xv-res" style="--d:4">2103</span></div>',
  'Multiplikation und Division':      '<div class="xv-ops"><span class="xv-op" style="--d:0">6</span><span class="xv-op xv-sm" style="--d:1">×</span><span class="xv-op" style="--d:2">14</span><span class="xv-op xv-sm" style="--d:3">=</span><span class="xv-op xv-res" style="--d:4">84</span></div>',
  'Runden und Schätzen':              '<div class="xv-ops"><span class="xv-op" style="--d:0">2764</span><span class="xv-op xv-sm" style="--d:1">≈</span><span class="xv-op xv-res" style="--d:2">2800</span></div>',
  'Große Zahlen und Runden':          '<div class="xv-bignum"><span class="xv-bn" style="--d:0">1.000.000</span><span class="xv-bnl" style="--d:1">1 Million</span></div>',
  'Grundrechenarten – Fachbegriffe':  '<div class="xv-ops"><span class="xv-op xv-sm" style="--d:0">+</span><span class="xv-op xv-sm" style="--d:1">−</span><span class="xv-op xv-sm" style="--d:2">×</span><span class="xv-op xv-sm" style="--d:3">÷</span></div>',
  'Terme':                            '<div class="xv-formula-vis"><span class="xvf" style="--d:0">4 + 3·5</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf xvf-res" style="--d:2">19</span></div>',
  'Rechenvorteile':                   '<div class="xv-ops"><span class="xv-op" style="--d:0">37</span><span class="xv-op xv-sm" style="--d:1">+</span><span class="xv-op" style="--d:2">63</span><span class="xv-op xv-sm" style="--d:3">=</span><span class="xv-op xv-res" style="--d:4">100</span></div>',
  'Distributivgesetz':                '<div class="xv-formula-vis"><span class="xvf" style="--d:0">8·99</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf" style="--d:2">8·(100−1)</span><span class="xvf xvf-eq" style="--d:3">=</span><span class="xvf xvf-res" style="--d:4">792</span></div>',
  'Potenzieren':                      '<div class="xv-formula-vis"><span class="xvf" style="--d:0">3⁴</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf" style="--d:2">3·3·3·3</span><span class="xvf xvf-eq" style="--d:3">=</span><span class="xvf xvf-res" style="--d:4">81</span></div>',
  'Teilbarkeit':                      '<div class="xv-formula-vis"><span class="xvf" style="--d:0">4+5+7+8</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf xvf-res" style="--d:2">24 ÷ 3 ✓</span></div>',
  'Primzahlen':                       '<div class="xv-primes"><span class="xv-pr" style="--d:0">2</span><span class="xv-pr" style="--d:1">3</span><span class="xv-pr" style="--d:2">5</span><span class="xv-pr" style="--d:3">7</span><span class="xv-pr" style="--d:4">11</span><span class="xv-pr" style="--d:5">13</span></div>',
  'Schriftliches Rechnen':            '<div class="xv-written"><div class="xv-wr" style="--d:0"> 3 4 8 2</div><div class="xv-wr" style="--d:1">+1 7 5 9</div><div class="xv-wr-line" style="--d:2"></div><div class="xv-wr xv-res" style="--d:3"> 5 2 4 1</div></div>',
  // Money / units
  'Rechnen mit Geld':                 '<div class="xv-money"><span class="xv-coin" style="--d:0">€</span><span class="xv-moneyval" style="--d:1">5,75 €</span></div>',
  'Rechnen mit Längenangaben':        '<div class="xv-units"><span class="xv-u" style="--d:0">km</span><span class="xv-ua" style="--d:1">→</span><span class="xv-u" style="--d:2">m</span><span class="xv-ua" style="--d:3">→</span><span class="xv-u" style="--d:4">cm</span><span class="xv-ua" style="--d:5">→</span><span class="xv-u" style="--d:6">mm</span></div>',
  'Rechnen mit Gewichtsangaben':      '<div class="xv-units"><span class="xv-u" style="--d:0">t</span><span class="xv-ua" style="--d:1">→</span><span class="xv-u" style="--d:2">kg</span><span class="xv-ua" style="--d:3">→</span><span class="xv-u" style="--d:4">g</span><span class="xv-ua" style="--d:5">→</span><span class="xv-u" style="--d:6">mg</span></div>',
  'Rechnen mit Zeitangaben':          '<div class="xv-clock"><div class="xv-clockface"><div class="xv-hand xv-hand-h"></div><div class="xv-hand xv-hand-m"></div></div></div>',
  'Zahlen ordnen':                    '<div class="xv-numline"><div class="xv-nl-bar"></div><span class="xv-nl-n" style="--d:0">1</span><span class="xv-nl-n" style="--d:1">5</span><span class="xv-nl-n" style="--d:2">9</span><span class="xv-nl-n xv-hl" style="--d:3">12</span><span class="xv-nl-n" style="--d:4">20</span></div>',
  'Zählen und Darstellen':            '<div class="xv-bars"><div class="xv-bar" style="--h:60%;--d:0"></div><div class="xv-bar" style="--h:85%;--d:1"></div><div class="xv-bar" style="--h:40%;--d:2"></div><div class="xv-bar" style="--h:70%;--d:3"></div></div>',
  'Einführung in Brüche':             '<div class="xv-fraction"><div class="xv-fnum" style="--d:0">3</div><div class="xv-fbar" style="--d:1"></div><div class="xv-fden" style="--d:2">8</div></div>',
  // Geometry
  'Geometrie: Flächen und Umfang':    '<div class="xv-rect"><div class="xv-rect-inner"></div><span class="xv-rl" style="--d:0">a</span><span class="xv-rw" style="--d:1">b</span></div>',
  'Senkrechte und parallele Geraden': '<div class="xv-lines"><div class="xv-line-v" style="--d:0"></div><div class="xv-line-h" style="--d:1"></div><div class="xv-line-par1" style="--d:2"></div><div class="xv-line-par2" style="--d:3"></div></div>',
  'Koordinatensystem':                '<div class="xv-coord"><div class="xv-cx"></div><div class="xv-cy"></div><div class="xv-cpt" style="--d:0">P(3|4)</div></div>',
  'Achsensymmetrie':                  '<svg class="xv-svg" viewBox="0 0 120 80"><line x1="60" y1="5" x2="60" y2="75" stroke="#A855F7" stroke-width="2" stroke-dasharray="4 3"/><polygon points="20,20 60,60 100,20" fill="none" stroke="#7C3AED" stroke-width="2" class="xv-svgpoly"/><polygon points="20,20 60,60 100,20" fill="rgba(124,58,237,0.15)" class="xv-svgfill"/></svg>',
  'Punktsymmetrie':                   '<svg class="xv-svg" viewBox="0 0 120 80"><circle cx="60" cy="40" r="5" fill="#A855F7" class="xv-svgpulse"/><polygon points="20,15 50,15 50,40" fill="rgba(124,58,237,0.3)" stroke="#7C3AED" stroke-width="2"/><polygon points="100,65 70,65 70,40" fill="rgba(59,130,246,0.3)" stroke="#3B82F6" stroke-width="2"/></svg>',
  'Eigenschaften von Vielecken':      '<svg class="xv-svg" viewBox="0 0 120 80"><rect x="5" y="20" width="50" height="40" fill="rgba(124,58,237,0.2)" stroke="#7C3AED" stroke-width="2" class="xv-svgpoly"/><polygon points="75,60 110,60 92,15" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" stroke-width="2" class="xv-svgpoly"/></svg>',
  // Area / scale
  'Flächeninhalte vergleichen':       '<div class="xv-grid"><div class="xv-gc xv-gc-fill" style="--d:0.1s"></div><div class="xv-gc xv-gc-fill" style="--d:0.2s"></div><div class="xv-gc xv-gc-fill" style="--d:0.3s"></div><div class="xv-gc xv-gc-fill" style="--d:0.4s"></div><div class="xv-gc xv-gc-fill" style="--d:0.5s"></div><div class="xv-gc xv-gc-fill" style="--d:0.6s"></div><div class="xv-gc" style="--d:0.7s"></div><div class="xv-gc" style="--d:0.8s"></div><div class="xv-gc" style="--d:0.9s"></div></div>',
  'Flächeneinheiten':                 '<div class="xv-units"><span class="xv-u xv-sm2" style="--d:0">mm²</span><span class="xv-ua" style="--d:1">×100</span><span class="xv-u" style="--d:2">cm²</span><span class="xv-ua" style="--d:3">×100</span><span class="xv-u" style="--d:4">dm²</span><span class="xv-ua" style="--d:5">×100</span><span class="xv-u" style="--d:6">m²</span></div>',
  'Flächeninhalt eines Rechtecks':    '<div class="xv-formula-vis"><span class="xvf" style="--d:0">A</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf" style="--d:2">a · b</span><span class="xvf xvf-eq" style="--d:3">=</span><span class="xvf xvf-res" style="--d:4">cm²</span></div>',
  'Flächeninhalt eines Dreiecks':     '<div class="xv-formula-vis"><span class="xvf" style="--d:0">A</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf xvf-res" style="--d:2">(a·b)÷2</span></div>',
  'Umfang von Figuren':               '<div class="xv-formula-vis"><span class="xvf" style="--d:0">U</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf xvf-res" style="--d:2">2·(a+b)</span></div>',
  'Maßstäbe':                         '<div class="xv-formula-vis"><span class="xvf" style="--d:0">1 cm</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf xvf-res" style="--d:2">250 m</span></div>',
  // 3D
  'Körper und Netze':                 '<svg class="xv-svg" viewBox="0 0 120 80"><polygon points="20,60 60,60 80,40 40,40" fill="rgba(124,58,237,0.25)" stroke="#7C3AED" stroke-width="2" class="xv-svgpoly"/><polygon points="60,60 60,20 80,0 80,40" fill="rgba(124,58,237,0.15)" stroke="#7C3AED" stroke-width="2" class="xv-svgpoly"/><polygon points="20,60 60,20 80,0 40,0 20,20" fill="rgba(167,139,250,0.25)" stroke="#A855F7" stroke-width="2" class="xv-svgpoly"/></svg>',
  'Quader und Würfel':                '<div class="xv-cube3d"><div class="xv-face xv-face-f"></div><div class="xv-face xv-face-t"></div><div class="xv-face xv-face-r"></div></div>',
  'Schrägbilder':                     '<div class="xv-schraeg"><div class="xv-sch-front"></div><div class="xv-sch-top"></div><div class="xv-sch-right"></div></div>',
  'Rauminhalte vergleichen':          '<div class="xv-unitcubes"><div class="xv-uc" style="--d:0"></div><div class="xv-uc" style="--d:1"></div><div class="xv-uc" style="--d:2"></div><div class="xv-uc" style="--d:3"></div><div class="xv-uc" style="--d:4"></div><div class="xv-uc" style="--d:5"></div></div>',
  'Volumeneinheiten':                 '<div class="xv-units"><span class="xv-u xv-sm2" style="--d:0">cm³</span><span class="xv-ua" style="--d:1">÷1000</span><span class="xv-u" style="--d:2">dm³</span><span class="xv-ua" style="--d:3">=1L</span><span class="xv-u" style="--d:4">💧</span></div>',
  'Volumen eines Quaders':            '<div class="xv-formula-vis"><span class="xvf" style="--d:0">V</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf xvf-res" style="--d:2">a · b · c</span></div>',
  'Oberflächeninhalt':                '<div class="xv-formula-vis"><span class="xvf" style="--d:0">O</span><span class="xvf xvf-eq" style="--d:1">=</span><span class="xvf xvf-res" style="--d:2">6 · a²</span></div>',
};

/* ── Teacher avatar talking ─────────────────── */
function _xpTalkStart() {
  const svg = document.getElementById('xptSvg');
  if (svg) svg.classList.add('talking');
}
function _xpTalkStop() {
  const svg = document.getElementById('xptSvg');
  if (svg) svg.classList.remove('talking');
}

/* ── TTS (German) ───────────────────────────── */
function _xpSpeak(text, onEnd) {
  if (!window.speechSynthesis || !text) { if (onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'de-DE'; utt.rate = 0.92; utt.pitch = 1.05; utt.volume = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const dv = voices.find(v => v.lang === 'de-DE' && v.localService)
          || voices.find(v => v.lang.startsWith('de'));
  if (dv) utt.voice = dv;
  utt.onend = utt.onerror = () => { if (onEnd) onEnd(); };
  window.speechSynthesis.speak(utt);
}
function _xpSpeakStop() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

/* ── Web Audio UI sounds ─────────────────────── */
function _xpUISound(type) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const g = ctx.createGain();
    g.connect(ctx.destination);
    const o = ctx.createOscillator();
    o.connect(g);
    if (type === 'hook') {
      o.type = 'sine';
      o.frequency.setValueAtTime(320, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.28);
      g.gain.setValueAtTime(0.11, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      o.start(); o.stop(ctx.currentTime + 0.32);
    } else if (type === 'appear') {
      o.type = 'sine';
      o.frequency.setValueAtTime(900, ctx.currentTime);
      g.gain.setValueAtTime(0.055, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      o.start(); o.stop(ctx.currentTime + 0.09);
    }
    setTimeout(() => ctx.close(), 600);
  } catch(e) {}
}

/* ── Keyword detection ───────────────────────── */
const _xKW = new Set([
  'Term','Terme','Bruch','Brüche','Zahl','Zahlen','Ziffer','Ziffern',
  'Gleichung','Gleichungen','Variable','Variablen','Koeffizient',
  'Quadrat','Dreieck','Kreis','Winkel','Fläche','Flächeninhalt','Volumen','Umfang',
  'Seite','Basis','Höhe','Länge','Breite','Tiefe','Radius','Durchmesser',
  'Quader','Würfel','Zylinder','Kegel','Pyramide','Kugel','Körper','Netz','Netze',
  'Potenz','Wurzel','Faktor','Produkt','Quotient','Summe','Differenz','Betrag',
  'Formel','Regel','Gesetz','Definition','Rechenweg','Beweis',
  'Primzahl','Primzahlen','Teiler','Vielfache','Kgv','Ggт',
  'Prozent','Verhältnis','Anteil','Steigung','Achse','Koordinate',
  'Energie','Kraft','Arbeit','Leistung','Strom','Spannung','Widerstand',
  'Atom','Molekül','Element','Reaktion','Säure','Photosynthese','Sauerstoff',
  'Klammer','Vorzeichen','Dezimal','Bruchstrich','Nenner','Zähler',
  'Oberflächeninhalt','Schrägbild','Rauminhalte','Volumeneinheiten',
]);
function _xIsKw(word) {
  const c = word.replace(/[.,!?;:()\-–]/g, '');
  return /^\d+([,./]\d+)?$/.test(c) || _xKW.has(c)
      || (c.length >= 8 && /^[A-ZÄÖÜ]/.test(c));
}
function _xAnimWords(el, text) {
  if (!el || !text) return;
  el.innerHTML = text.split(' ').map((w, i) =>
    `<span class="${_xIsKw(w) ? 'xp-w xp-kw' : 'xp-w'}" style="--wi:${i}">${w}</span>`
  ).join(' ');
}

/* ── Hook generator ──────────────────────────── */
const _xHooks = [
  n => `Was ist eigentlich ${n}?`,
  n => `So funktioniert ${n}!`,
  n => `${n} – einfach erklärt`,
  n => `Warum brauchen wir ${n}?`,
];
function _xGenHook(name) {
  return _xHooks[(name.charCodeAt(0) + name.length) % _xHooks.length](name);
}

/* ── Main showExplainer ──────────────────────── */
function showExplainer(topic, subjectIcon, subjectColor) {
  const modal = document.getElementById('explainerModal');
  if (!modal) return;
  _xPaused = false;
  clearTimeout(_xTimeout1); clearTimeout(_xTimeout2); clearInterval(_xAutoTimer);
  _xpSpeakStop(); _xpTalkStop();

  const sentences = Array.isArray(topic.short) ? topic.short : _xExtract2(topic.explanation);
  const s1el = document.getElementById('explainerS1');
  const s2el = document.getElementById('explainerS2');
  const hookEl = document.getElementById('xpHook');

  // Header
  document.getElementById('explainerEmoji').textContent = subjectIcon || '📚';
  document.getElementById('explainerBadge').textContent = 'Erklärung';
  document.getElementById('explainerTitle').textContent = topic.name;
  if (subjectColor) {
    const b = document.getElementById('explainerBadge');
    if (b) b.style.cssText = `border-color:${subjectColor}66;background:${subjectColor}22;color:${subjectColor}`;
  }

  // Prepare word-animated sentences (invisible)
  if (s1el) { _xAnimWords(s1el, sentences[0] || ''); s1el.classList.remove('xs-visible'); }
  if (s2el) { _xAnimWords(s2el, sentences[1] || ''); s2el.classList.remove('xs-visible'); }

  // Prepare hook
  if (hookEl) { hookEl.textContent = _xGenHook(topic.name); hookEl.className = 'xp-hook'; }

  // Progress reset
  const fill = document.getElementById('explainerProgFill');
  if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
  const timerEl = document.getElementById('xpTimer');
  if (timerEl) timerEl.textContent = '0:00';

  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';

  // Show hook immediately after paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (hookEl) hookEl.classList.add('xhvis');
    _xpUISound('hook');
  }));

  // At 1.8s: hook fades, s1 appears with word animation + TTS
  _xTimeout1 = setTimeout(() => {
    if (_xPaused) return;
    if (hookEl) hookEl.classList.replace('xhvis', 'xhout');
    setTimeout(() => {
      if (_xPaused) return;
      if (s1el) s1el.classList.add('xs-visible');
      _xpTalkStart();
      _xpUISound('appear');
      _xpSpeak(sentences[0] || '', () => {
        if (!_xPaused) setTimeout(() => {
          if (s2el && !s2el.classList.contains('xs-visible')) {
            s2el.classList.add('xs-visible');
            _xpUISound('appear');
          }
          _xpSpeak(sentences[1] || '', () => _xpTalkStop());
        }, 480);
      });
    }, 280);
  }, 1800);

  // Visual fallback: s2 shows at 6s even if TTS doesn't fire
  _xTimeout2 = setTimeout(() => {
    if (!_xPaused && s2el && !s2el.classList.contains('xs-visible')) {
      s2el.classList.add('xs-visible');
      _xpUISound('appear');
    }
  }, 6000);

  _xRunProgress(13);
}

function _xExtract2(text) {
  const sents = (text || '').match(/[^.!?]+[.!?]+/g) || [text];
  return [sents[0] || '', sents[1] || ''];
}

function _xDefaultVisual(emoji) {
  return `<div style="font-size:64px;animation:xEmoji .65s cubic-bezier(.34,1.56,.64,1) both">${emoji}</div>`;
}

function _xRunProgress(totalSec) {
  clearInterval(_xAutoTimer);
  const fill = document.getElementById('explainerProgFill');
  const timerEl = document.getElementById('xpTimer');
  if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
  const t0 = Date.now();
  _xAutoTimer = setInterval(() => {
    if (_xPaused) return;
    const elapsed = (Date.now() - t0) / 1000;
    const pct = Math.min(elapsed / totalSec, 1);
    if (fill) fill.style.width = (pct * 100) + '%';
    if (timerEl) {
      const s = Math.floor(elapsed);
      timerEl.textContent = `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
    }
    if (pct >= 1) { clearInterval(_xAutoTimer); if (fill) fill.style.width = '100%'; }
  }, 80);
}

function _xTogglePause() {
  _xPaused = !_xPaused;
  const btn = document.getElementById('explainerPauseBtn');
  if (btn) btn.textContent = _xPaused ? '▶' : '⏸';
  if (window.speechSynthesis) {
    if (_xPaused) { window.speechSynthesis.pause(); _xpTalkStop(); }
    else          { window.speechSynthesis.resume(); _xpTalkStart(); }
  }
}

function _xReplay() {
  const modal = document.getElementById('explainerModal');
  if (!modal.classList.contains('visible')) return;
  const s1el = document.getElementById('explainerS1');
  const s2el = document.getElementById('explainerS2');
  const hookEl = document.getElementById('xpHook');
  if (s1el) s1el.classList.remove('xs-visible');
  if (s2el) s2el.classList.remove('xs-visible');
  _xPaused = false;
  _xpSpeakStop(); _xpTalkStop();
  // Reset hook
  if (hookEl) hookEl.className = 'xp-hook';
  const fill = document.getElementById('explainerProgFill');
  if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
  const timerEl = document.getElementById('xpTimer');
  if (timerEl) timerEl.textContent = '0:00';
  clearTimeout(_xTimeout1); clearTimeout(_xTimeout2); clearInterval(_xAutoTimer);

  // Re-show hook
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (hookEl) hookEl.classList.add('xhvis');
    _xpUISound('hook');
  }));

  const s1txt = s1el ? s1el.textContent : '';
  const s2txt = s2el ? s2el.textContent : '';

  _xTimeout1 = setTimeout(() => {
    if (_xPaused) return;
    if (hookEl) hookEl.classList.replace('xhvis', 'xhout');
    setTimeout(() => {
      if (_xPaused) return;
      if (s1el) s1el.classList.add('xs-visible');
      _xpTalkStart();
      _xpUISound('appear');
      _xpSpeak(s1txt, () => {
        if (!_xPaused) setTimeout(() => {
          if (s2el && !s2el.classList.contains('xs-visible')) {
            s2el.classList.add('xs-visible');
            _xpUISound('appear');
          }
          _xpSpeak(s2txt, () => _xpTalkStop());
        }, 480);
      });
    }, 280);
  }, 1800);

  _xTimeout2 = setTimeout(() => {
    if (!_xPaused && s2el && !s2el.classList.contains('xs-visible')) {
      s2el.classList.add('xs-visible');
      _xpUISound('appear');
    }
  }, 6000);

  _xRunProgress(13);
}

function closeExplainer() {
  const modal = document.getElementById('explainerModal');
  if (modal) modal.classList.remove('visible');
  document.body.style.overflow = '';
  clearTimeout(_xTimeout1); clearTimeout(_xTimeout2); clearInterval(_xAutoTimer);
  _xPaused = false;
  _xpSpeakStop(); _xpTalkStop();
  const hookEl = document.getElementById('xpHook');
  if (hookEl) hookEl.className = 'xp-hook';
  const fill = document.getElementById('explainerProgFill');
  if (fill) fill.style.width = '0%';
  stopIntro();
  _clearTopicHighlights();
}

function _cycleExplainerSpeed() {}

/* ── Video recording (screen capture → .webm download) ── */
let _xpRecorder = null;
let _xpRecChunks = [];

async function _xpRecord() {
  const btn = document.getElementById('xpRecBtn');
  if (_xpRecorder && _xpRecorder.state === 'recording') {
    _xpRecorder.stop();
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30, displaySurface: 'browser' },
      audio: { echoCancellation: false, noiseSuppression: false },
      preferCurrentTab: true,
    });
    _xpRecChunks = [];
    const mime = ['video/webm;codecs=vp9,opus','video/webm;codecs=vp9','video/webm']
      .find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';
    _xpRecorder = new MediaRecorder(stream, { mimeType: mime });
    _xpRecorder.ondataavailable = e => { if (e.data.size > 0) _xpRecChunks.push(e.data); };
    _xpRecorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(_xpRecChunks, { type: 'video/webm' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = `LernStar_Erklaerung_${Date.now()}.webm`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      if (btn) { btn.textContent = '🎬'; btn.classList.remove('recording'); }
      _xpRecorder = null;
    };
    _xpRecorder.start(1000);
    if (btn) { btn.textContent = '⏹'; btn.classList.add('recording'); }
    // Auto-replay so the recording captures the full explainer
    setTimeout(() => _xReplay(), 400);
  } catch(e) {
    if (btn) { btn.textContent = '🎬'; btn.classList.remove('recording'); }
  }
}

// ============================================================
// AUTO-LOADER: JSON-Aufgaben automatisch laden
// ============================================================
const _DATA_FILES = [
  'data/mathe5_zaehlen_darstellen.json',
  'data/mathe5_zahlen_ordnen.json',
  'data/mathe5_grosse_zahlen_runden.json',
  'data/mathe5_grundrechenarten.json',
  'data/mathe5_rechnen_mit_geld.json',
  'data/mathe5_laengenangaben.json',
  'data/mathe5_gewichtsangaben.json',
  'data/mathe5_zeitangaben.json',
  'data/mathe5_symmetrie.json',
  'data/mathe5_rechnen.json',
  'data/mathe5_flaechen.json',
  'data/mathe5_koerper.json'
];

async function _autoLoadDataFiles() {
  if (typeof LernStarAI === 'undefined') return;
  const loaded = new Set(JSON.parse(localStorage.getItem('ls_loaded_files') || '[]'));
  let added = 0;
  for (const file of _DATA_FILES) {
    if (loaded.has(file)) continue;
    try {
      const resp = await fetch(file);
      if (!resp.ok) continue;
      const exercises = await resp.json();
      if (!Array.isArray(exercises)) continue;
      for (const ex of exercises) {
        if (!ex.question || !ex.answer) continue;
        LernStarAI.save({
          subject:     ex.subject     || 'Allgemein',
          grade:       String(ex.grade || '5'),
          topic:       ex.topic       || 'Allgemein',
          question:    ex.question,
          answer:      ex.answer,
          explanation: ex.explanation || '',
          difficulty:  parseInt(ex.difficulty) || 1
        });
        added++;
      }
      loaded.add(file);
    } catch(e) { /* Datei nicht gefunden – überspringen */ }
  }
  if (added > 0) localStorage.setItem('ls_loaded_files', JSON.stringify([...loaded]));
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateSidebarGrades();
  navigate('home');
  _autoLoadDataFiles();
});

// ============================================================
// ERKLÄRVIDEO PLAYER  –  Moderner 3D-Tutor Mr. Lala
// ============================================================

function _evCharHTML(mode) {
  const cls = 'ev-char-wrap'
    + (mode === 'talking'     ? ' ev-char-talking'     : '')
    + (mode === 'pointing'    ? ' ev-char-pointing'    : '')
    + (mode === 'celebrating' ? ' ev-char-celebrating' : '');
  return `<div class="${cls}"><svg class="ev-char-svg" viewBox="0 0 180 295" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="evSk" cx="38%" cy="32%" r="68%"><stop offset="0%" stop-color="#FFD5A8"/><stop offset="68%" stop-color="#EAAA70"/><stop offset="100%" stop-color="#C07040"/></radialGradient>
    <linearGradient id="evHd" x1="0%" y1="0%" x2="75%" y2="100%"><stop offset="0%" stop-color="#9333EA"/><stop offset="100%" stop-color="#5B21B6"/></linearGradient>
    <linearGradient id="evPt" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1E1B4B"/><stop offset="100%" stop-color="#312E81"/></linearGradient>
    <radialGradient id="evHr" cx="50%" cy="20%" r="70%"><stop offset="0%" stop-color="#3D2400"/><stop offset="100%" stop-color="#150800"/></radialGradient>
    <filter id="evSdw" x="-25%" y="-15%" width="150%" height="140%"><feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,.4)"/></filter>
  </defs>
  <ellipse cx="90" cy="291" rx="42" ry="6" fill="rgba(0,0,0,.2)"/>
  <path d="M75,232 Q72,260 70,282" stroke="url(#evPt)" stroke-width="23" fill="none" stroke-linecap="round"/>
  <path d="M105,232 Q108,260 110,282" stroke="url(#evPt)" stroke-width="23" fill="none" stroke-linecap="round"/>
  <path d="M58,279 Q70,287 83,282 Q76,292 57,288 Z" fill="#111827"/>
  <path d="M97,282 Q110,287 122,279 Q122,288 102,292 Z" fill="#111827"/>
  <path d="M44,148 C37,172 36,212 38,234 L142,234 C144,212 143,172 136,148 C130,133 116,126 107,124 L90,130 L73,124 C64,126 50,133 44,148Z" fill="url(#evHd)" filter="url(#evSdw)"/>
  <path d="M44,148 C37,172 36,212 38,234 L55,234 C53,212 54,172 56,150 Z" fill="rgba(0,0,0,.18)"/>
  <rect x="66" y="190" width="48" height="26" rx="6" fill="rgba(0,0,0,.15)" stroke="rgba(255,255,255,.07)" stroke-width="1"/>
  <text x="90" y="172" font-size="15" text-anchor="middle" fill="rgba(255,255,255,.22)">⭐</text>
  <rect x="63" y="145" width="54" height="16" rx="8" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.18)" stroke-width="1"/>
  <text x="90" y="157" font-family="Nunito,sans-serif" font-size="7" font-weight="700" fill="rgba(255,255,255,.7)" text-anchor="middle">Mr. Lala ⭐</text>
  <g class="ev-arm-default">
    <path d="M44,150 C32,169 24,197 26,222" stroke="#7C3AED" stroke-width="21" fill="none" stroke-linecap="round"/>
    <ellipse cx="28" cy="225" rx="13" ry="10" fill="url(#evSk)"/>
    <path d="M136,150 C150,166 160,184 162,207" stroke="#7C3AED" stroke-width="21" fill="none" stroke-linecap="round"/>
    <ellipse cx="163" cy="211" rx="13" ry="10" fill="url(#evSk)"/>
  </g>
  <g class="ev-arm-pointing" style="display:none">
    <path d="M44,150 C32,169 24,197 26,222" stroke="#7C3AED" stroke-width="21" fill="none" stroke-linecap="round"/>
    <ellipse cx="28" cy="225" rx="13" ry="10" fill="url(#evSk)"/>
    <path d="M136,150 C147,132 158,114 166,96" stroke="#7C3AED" stroke-width="21" fill="none" stroke-linecap="round"/>
    <ellipse cx="167" cy="93" rx="13" ry="10" fill="url(#evSk)"/>
    <line x1="168" y1="87" x2="178" y2="72" stroke="url(#evSk)" stroke-width="8" stroke-linecap="round"/>
  </g>
  <g class="ev-arm-celebrate" style="display:none">
    <path d="M44,150 C30,130 18,112 20,90" stroke="#7C3AED" stroke-width="21" fill="none" stroke-linecap="round"/>
    <ellipse cx="21" cy="87" rx="13" ry="10" fill="url(#evSk)"/>
    <path d="M136,150 C150,130 162,112 160,90" stroke="#7C3AED" stroke-width="21" fill="none" stroke-linecap="round"/>
    <ellipse cx="159" cy="87" rx="13" ry="10" fill="url(#evSk)"/>
  </g>
  <rect x="83" y="122" width="14" height="20" rx="5" fill="url(#evSk)"/>
  <ellipse cx="90" cy="79" rx="49" ry="52" fill="url(#evSk)" filter="url(#evSdw)"/>
  <path d="M41,69 C43,28 64,12 90,12 C116,12 137,28 139,69 C133,40 114,32 90,32 C66,32 47,40 41,69Z" fill="url(#evHr)"/>
  <path d="M66,24 C74,14 82,12 90,14 C98,12 106,14 112,22" stroke="#3A2200" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="41" cy="82" rx="8" ry="11" fill="url(#evSk)"/><ellipse cx="41" cy="82" rx="4" ry="7" fill="#D08050" opacity=".45"/>
  <ellipse cx="139" cy="82" rx="8" ry="11" fill="url(#evSk)"/><ellipse cx="139" cy="82" rx="4" ry="7" fill="#D08050" opacity=".45"/>
  <path d="M57,60 Q69,55 79,58" stroke="#3A2000" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M101,58 Q111,55 123,60" stroke="#3A2000" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="68" cy="76" rx="12" ry="13" fill="white"/>
  <ellipse cx="68" cy="76" rx="8" ry="8.5" fill="#1D4ED8"/>
  <ellipse cx="68" cy="76" rx="4.5" ry="4.5" fill="#0F172A"/>
  <ellipse cx="65" cy="73" rx="2.5" ry="2.5" fill="white"/>
  <ellipse class="ev-lid-l" cx="68" cy="76" rx="13" ry="1" fill="url(#evSk)"/>
  <ellipse cx="112" cy="76" rx="12" ry="13" fill="white"/>
  <ellipse cx="112" cy="76" rx="8" ry="8.5" fill="#1D4ED8"/>
  <ellipse cx="112" cy="76" rx="4.5" ry="4.5" fill="#0F172A"/>
  <ellipse cx="109" cy="73" rx="2.5" ry="2.5" fill="white"/>
  <ellipse class="ev-lid-r" cx="112" cy="76" rx="13" ry="1" fill="url(#evSk)"/>
  <rect x="53" y="64" width="30" height="24" rx="8" fill="rgba(100,140,255,.04)" stroke="rgba(180,200,255,.68)" stroke-width="1.8"/>
  <rect x="87" y="64" width="30" height="24" rx="8" fill="rgba(100,140,255,.04)" stroke="rgba(180,200,255,.68)" stroke-width="1.8"/>
  <line x1="83" y1="76" x2="87" y2="76" stroke="rgba(180,200,255,.68)" stroke-width="1.8"/>
  <line x1="53" y1="76" x2="44" y2="74" stroke="rgba(180,200,255,.68)" stroke-width="1.8"/>
  <line x1="117" y1="76" x2="126" y2="74" stroke="rgba(180,200,255,.68)" stroke-width="1.8"/>
  <path d="M58,68 Q65,66 69,70" stroke="rgba(255,255,255,.35)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M92,68 Q99,66 103,70" stroke="rgba(255,255,255,.35)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M86,92 Q90,102 94,92" stroke="#C07040" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="85" cy="96" r="2" fill="#D08050" opacity=".3"/><circle cx="95" cy="96" r="2" fill="#D08050" opacity=".3"/>
  <ellipse cx="54" cy="95" rx="11" ry="6" fill="#FF8B94" opacity=".15"/>
  <ellipse cx="126" cy="95" rx="11" ry="6" fill="#FF8B94" opacity=".15"/>
  <g class="ev-char-mouth">
    <path class="ev-mouth-smile" d="M74,112 Q90,124 106,112" stroke="#C06848" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <g class="ev-mouth-talk"><path d="M74,112 Q90,128 106,112 L103,120 Q90,133 77,120 Z" fill="#8B1F00"/><rect x="78" y="112" width="24" height="5" rx="2.5" fill="white" opacity=".9"/></g>
  </g>
</svg></div>`;
}

const EV_SCENES = {
  'Einführung in Brüche': [
    { dur:3500, bg:'linear-gradient(160deg,#1a0035 0%,#0e0820 100%)',
      build(stage) {
        stage.innerHTML = `
          <div class="ev-bg-label" style="top:-10%;left:-5%">½</div>
          <div style="margin-bottom:14px;animation:evBounceIn .4s cubic-bezier(.36,.07,.19,.97)">
            <svg viewBox="0 0 140 140" width="120" height="120">
              <circle cx="70" cy="70" r="60" fill="#c0392b" stroke="#922b21" stroke-width="3"/>
              <path d="M70,70 L70,10 A60,60 0 0,1 130,70 Z" fill="#e74c3c"/>
              <path d="M70,70 L130,70 A60,60 0 0,1 70,130 Z" fill="#c0392b" opacity=".8"/>
              <line x1="70" y1="10" x2="70" y2="130" stroke="#7B241C" stroke-width="2.5" stroke-dasharray="4,3"/>
              <line x1="10" y1="70" x2="130" y2="70" stroke="#7B241C" stroke-width="2.5" stroke-dasharray="4,3"/>
            </svg>
          </div>
          <div class="ev-hook-title">BRÜCHE</div>
          <div class="ev-hook-sub">Wie kann eine halbe Pizza eine Zahl sein?</div>`;
      }
    },
    { dur:4000, bg:'linear-gradient(160deg,#1a0035 0%,#0e0820 100%)',
      build(stage) {
        stage.style.justifyContent = 'flex-start';
        stage.innerHTML = `<div class="ev-scene-split">
          <div class="ev-split-char">${_evCharHTML('talking')}<div class="ev-char-name-lbl">Mr. Lala</div></div>
          <div class="ev-split-content">
            <div class="ev-speech-bubble">Hallo! Ich bin Mr. Lala – heute erkläre ich dir, was Brüche sind! 🍕</div>
            <div style="margin-top:14px;animation:evGlowPulse 1s infinite">
              <svg viewBox="0 0 100 100" width="70" height="70">
                <circle cx="50" cy="50" r="44" fill="#c0392b" stroke="#922b21" stroke-width="2.5"/>
                <path d="M50,50 L50,6 A44,44 0 0,1 94,50 Z" fill="#e74c3c"/>
                <path d="M50,50 L94,50 A44,44 0 0,1 50,94 Z" fill="#c0392b" opacity=".8"/>
                <line x1="50" y1="6" x2="50" y2="94" stroke="#7B241C" stroke-width="2"/>
                <line x1="6" y1="50" x2="94" y2="50" stroke="#7B241C" stroke-width="2"/>
              </svg>
            </div>
          </div>
        </div>`;
      }
    },
    { dur:5000, bg:'linear-gradient(160deg,#1a0035 0%,#0e0820 100%)',
      build(stage) {
        stage.style.justifyContent = 'flex-start';
        stage.innerHTML = `<div class="ev-scene-split">
          <div class="ev-split-char">${_evCharHTML('talking')}<div class="ev-char-name-lbl">Mr. Lala</div></div>
          <div class="ev-split-content">
            <div class="ev-speech-bubble">Brüche zeigen, wie viele Teile von etwas Ganzem gemeint sind.</div>
            <div style="display:flex;align-items:center;gap:10px;margin-top:14px;animation:evScaleIn .5s .3s both">
              <svg viewBox="0 0 100 100" width="65" height="65">
                <circle cx="50" cy="50" r="44" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" stroke-width="2"/>
                <path d="M50,50 L50,6 A44,44 0 0,1 94,50 Z" fill="#7C3AED" style="filter:drop-shadow(0 0 8px #7C3AED)"/>
                <line x1="50" y1="6" x2="50" y2="94" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
                <line x1="6" y1="50" x2="94" y2="50" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
              </svg>
              <div style="display:flex;flex-direction:column;align-items:center;font-family:Poppins,sans-serif;font-size:38px;font-weight:900;gap:2px">
                <span style="color:#FBBF24">1</span>
                <div style="width:40px;height:4px;background:linear-gradient(90deg,#FBBF24,#F472B6);border-radius:2px"></div>
                <span style="color:rgba(255,255,255,.85)">2</span>
              </div>
            </div>
            <span class="ev-label-badge" style="animation-delay:.5s;margin-top:10px">½ = ein halbes Stück</span>
          </div>
        </div>`;
      }
    },
    { dur:10000, bg:'linear-gradient(160deg,#1a0035 0%,#0e0820 100%)',
      build(stage) {
        stage.style.justifyContent = 'flex-start';
        stage.innerHTML = `<div class="ev-scene-split">
          <div class="ev-split-char">${_evCharHTML('pointing')}<div class="ev-char-name-lbl">Mr. Lala</div></div>
          <div class="ev-split-content">
            <div class="ev-speech-bubble" style="font-size:12px">Die <strong style="color:#FBBF24">obere Zahl</strong> = deine Stücke.<br>Die <strong style="color:#A78BFA">untere Zahl</strong> = alle Teile.</div>
            <div style="margin-top:16px;display:inline-flex;flex-direction:column;align-items:center;animation:evScaleIn .5s .3s both">
              <span style="font-family:Poppins,sans-serif;font-size:52px;font-weight:900;color:#FBBF24;animation:evGlowPulse 1.4s infinite;text-shadow:0 0 20px #FBBF24">3</span>
              <div style="width:54px;height:5px;background:linear-gradient(90deg,#FBBF24,#F472B6);border-radius:3px;margin:3px 0"></div>
              <span style="font-family:Poppins,sans-serif;font-size:52px;font-weight:900;color:#A78BFA;animation:evGlowPulse 1.4s .7s infinite;text-shadow:0 0 20px #A78BFA">4</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:5px;margin-top:10px;animation:evFadeUp .5s .6s both">
              <span class="ev-label-badge" style="border-color:#FBBF24;color:#FBBF24">↑ Zähler</span>
              <span class="ev-label-badge">↓ Nenner</span>
            </div>
          </div>
        </div>`;
      }
    },
    { dur:10000, bg:'linear-gradient(160deg,#1a0035 0%,#0e0820 100%)',
      build(stage) {
        stage.style.justifyContent = 'flex-start';
        stage.innerHTML = `<div class="ev-scene-split">
          <div class="ev-split-char">${_evCharHTML('pointing')}<div class="ev-char-name-lbl">Mr. Lala</div></div>
          <div class="ev-split-content">
            <div class="ev-speech-bubble" style="font-size:12px">3 von 4 Teilen — so schreibt man das!</div>
            <div class="ev-choco" id="evChoco" style="margin-top:14px;grid-template-columns:repeat(2,1fr)">
              <div class="ev-choco-piece"></div><div class="ev-choco-piece"></div>
              <div class="ev-choco-piece"></div><div class="ev-choco-piece"></div>
            </div>
            <div style="margin-top:12px;display:flex;flex-direction:column;align-items:center;font-family:Poppins,sans-serif;font-size:36px;font-weight:900;gap:2px;animation:evScaleIn .5s .8s both">
              <span style="color:#FBBF24">3</span>
              <div style="width:40px;height:4px;background:linear-gradient(90deg,#FBBF24,#F472B6);border-radius:2px"></div>
              <span style="color:rgba(255,255,255,.85)">4</span>
            </div>
            <div class="ev-particles" id="evParts"></div>
          </div>
        </div>`;
        setTimeout(() => {
          const pieces = document.querySelectorAll('.ev-choco-piece');
          [0,1,2].forEach((pi,i) => setTimeout(() => pieces[pi]?.classList.add('marked'), i*220));
          const container = document.getElementById('evParts');
          if (!container) return;
          const colors = ['#FBBF24','#F472B6','#A78BFA','#34D399'];
          for (let n=0;n<12;n++){const p=document.createElement('div');p.className='ev-particle';const angle=(n/12)*360,dist=50+Math.random()*40;p.style.cssText=`left:${40+Math.random()*20}%;top:${40+Math.random()*20}%;background:${colors[n%colors.length]};--dx:${Math.cos(angle*Math.PI/180)*dist}px;--dy:${Math.sin(angle*Math.PI/180)*dist}px;animation-delay:${.6+n*.05}s`;container.appendChild(p);}
        }, 400);
      }
    },
    { dur:7000, bg:'linear-gradient(160deg,#1a0035 0%,#0e0820 100%)',
      build(stage) {
        stage.style.justifyContent = 'flex-start';
        stage.innerHTML = `<div class="ev-scene-split">
          <div class="ev-split-char">${_evCharHTML('talking')}<div class="ev-char-name-lbl">Mr. Lala</div></div>
          <div class="ev-split-content">
            <div class="ev-speech-bubble" style="font-size:12px">Brüche begegnen dir überall im Alltag!</div>
            <div class="ev-food-row" style="margin-top:14px;gap:10px">
              ${['🍕','🍰','🍫','🥤'].map((e,i)=>`<div class="ev-food-icon" style="font-size:36px;animation-delay:${i*.15}s">${e}</div>`).join('')}
            </div>
            <div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap;animation:evFadeUp .5s .7s both">
              <span class="ev-label-badge" style="font-size:11px">Essen teilen</span>
              <span class="ev-label-badge" style="font-size:11px">Rezepte</span>
            </div>
          </div>
        </div>`;
      }
    },
    { dur:7000, bg:'linear-gradient(160deg,#0d001a 0%,#0e0820 100%)',
      build(stage) {
        stage.style.justifyContent = 'flex-start';
        stage.innerHTML = `<div class="ev-scene-split">
          <div class="ev-split-char">${_evCharHTML('talking')}<div class="ev-char-name-lbl">Mr. Lala</div></div>
          <div class="ev-split-content">
            <div class="ev-merksatz" style="padding:14px 12px">
              <h3 style="font-size:11px">📌 Merksatz</h3>
              <p style="font-size:13px">Der <span class="ev-word-hl">Zähler</span> sagt, wie viele Teile du hast.</p>
              <p style="font-size:13px">Der <span class="ev-word-hl">Nenner</span> zeigt, in wie viele Teile alles geteilt wurde.</p>
            </div>
            <div style="display:flex;gap:10px;margin-top:12px;justify-content:center;animation:evFadeUp .5s .4s both">
              <div style="text-align:center"><div style="font-family:Poppins,sans-serif;font-size:22px;font-weight:900;color:#FBBF24;text-shadow:0 0 14px #FBBF24">Zähler</div><div style="font-size:10px;color:rgba(255,255,255,.5)">oben</div></div>
              <div style="font-size:26px;color:rgba(255,255,255,.2);padding-top:2px">·</div>
              <div style="text-align:center"><div style="font-family:Poppins,sans-serif;font-size:22px;font-weight:900;color:#A78BFA;text-shadow:0 0 14px #A78BFA">Nenner</div><div style="font-size:10px;color:rgba(255,255,255,.5)">unten</div></div>
            </div>
          </div>
        </div>`;
      }
    },
    { dur:5000, bg:'linear-gradient(160deg,#1a0035 0%,#0e0820 100%)',
      build(stage) {
        stage.style.justifyContent = 'center';
        stage.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:16px">
          <div style="animation:evBounceIn .5s cubic-bezier(.36,.07,.19,.97)">${_evCharHTML('celebrating')}</div>
          <div class="ev-outro-text" style="font-size:clamp(20px,5vw,28px)">Brüche verstanden! 🎉</div>
          <div class="ev-outro-next">➡ Nächstes Thema: Brüche addieren</div>
        </div>`;
      }
    }
  ]
};

let _evTopicName='',_evSceneIdx=0,_evPaused=false,_evTimer=null,_evSceneStart=0,_evSceneElapsed=0;

function openErklaerVideo(topicName){const scenes=EV_SCENES[topicName];if(!scenes)return;_evTopicName=topicName;_evSceneIdx=0;_evPaused=false;_evSceneElapsed=0;const overlay=document.getElementById('erklaerVideoOverlay');if(overlay)overlay.classList.remove('hidden');_evBuildDots(scenes.length);_evPlayScene(0);}
function closeErklaerVideo(){const overlay=document.getElementById('erklaerVideoOverlay');if(overlay)overlay.classList.add('hidden');clearTimeout(_evTimer);_evTimer=null;}
function _evBgClick(e){if(e.target===document.getElementById('erklaerVideoOverlay'))closeErklaerVideo();}
function _evBuildDots(count){const c=document.getElementById('evSceneDots');if(!c)return;c.innerHTML='';for(let i=0;i<count;i++){const d=document.createElement('div');d.className='ev-dot'+(i===0?' active':'');c.appendChild(d);}}
function _evPlayScene(idx){const scenes=EV_SCENES[_evTopicName];if(!scenes||idx>=scenes.length){closeErklaerVideo();return;}_evSceneIdx=idx;_evSceneElapsed=0;clearTimeout(_evTimer);document.querySelectorAll('.ev-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));const scene=scenes[idx];const stage=document.getElementById('evStage');if(!stage)return;stage.style.background=scene.bg||'transparent';stage.innerHTML='';scene.build(stage);const btn=document.getElementById('evPlayPauseBtn');if(btn)btn.textContent='⏸';_evPaused=false;_evSceneStart=Date.now();_evTickProgress(idx,scene.dur);_evTimer=setTimeout(()=>_evPlayScene(idx+1),scene.dur);}
function _evTickProgress(sceneIdx,dur){const fill=document.getElementById('evProgressFill');const scenes=EV_SCENES[_evTopicName];if(!fill||!scenes)return;const totalDur=scenes.reduce((s,sc)=>s+sc.dur,0);const pastDur=scenes.slice(0,sceneIdx).reduce((s,sc)=>s+sc.dur,0);function tick(){if(_evSceneIdx!==sceneIdx||_evPaused)return;const elapsed=Date.now()-_evSceneStart+_evSceneElapsed;const totalDone=pastDur+Math.min(elapsed,dur);fill.style.width=(totalDone/totalDur*100)+'%';if(elapsed<dur)requestAnimationFrame(tick);}requestAnimationFrame(tick);}
function _evTogglePause(){const btn=document.getElementById('evPlayPauseBtn');const scenes=EV_SCENES[_evTopicName];const scene=scenes?.[_evSceneIdx];if(!scene)return;if(_evPaused){_evPaused=false;if(btn)btn.textContent='⏸';const remaining=scene.dur-_evSceneElapsed;_evSceneStart=Date.now();_evTickProgress(_evSceneIdx,scene.dur);_evTimer=setTimeout(()=>_evPlayScene(_evSceneIdx+1),remaining);}else{_evPaused=true;if(btn)btn.textContent='▶';_evSceneElapsed+=Date.now()-_evSceneStart;clearTimeout(_evTimer);}}
function _evSkipScene(){clearTimeout(_evTimer);_evPlayScene(_evSceneIdx+1);}
