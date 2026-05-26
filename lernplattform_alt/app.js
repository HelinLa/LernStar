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
    if (badge) badge.textContent = ELEVEN_KEY ? '✨ ElevenLabs: Liam' : _voiceLabel(_cachedVoice);
  });
  if (speechSynthesis.getVoices().length) _cachedVoice = _pickMaleVoice();
}
// Badge sofort setzen falls ElevenLabs aktiv
document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('voiceBadge');
  if (badge && ELEVEN_KEY) badge.textContent = '✨ ElevenLabs: Liam';
});

// ── VRM LIP SYNC ─────────────────────────────────────────
function _startLipSync() { window._vrmTalking = true;  window._vrmTalkT = 0; }
function _stopLipSync()  { window._vrmTalking = false; }
// ─────────────────────────────────────────────────────────

// ── ELEVENLABS TTS ────────────────────────────────────────
const ELEVEN_KEY      = 'e24b6be67594419d8f50afdfb195995a';
const ELEVEN_VOICE    = 'TX3LPaxmHKxFdv7VOQHJ'; // Liam – natürlich, klar, modern
const ELEVEN_MODEL    = 'eleven_multilingual_v2';
const _audioCache     = new Map();
let   _currentAudio   = null;

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
        voice_settings: { stability: 0.30, similarity_boost: 0.82, style: 0.48, use_speaker_boost: true }
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
    case 'home':    renderHome();    break;
    case 'grade':   renderGrade();   break;
    case 'subject': renderSubject(); break;
    case 'quiz':    renderQuiz();    break;
    case 'result':  showView('viewResult'); break;
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
      <div class="subject-topics">${sub.topics.length} Themen · ${sub.exercises.length} Übungseinheiten</div>
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

  // Video-Bereich nur für Mathe und Physik anzeigen
  const videoSection = document.querySelector('.video-section');
  const hasVideo = subject.id === 'mathe' || subject.id === 'physik';
  videoSection.style.display = hasVideo ? '' : 'none';

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

  // Topics (mit Play-Button für Mathe/Physik)
  const topicsList = document.getElementById('topicsList');
  topicsList.innerHTML = '';
  subject.topics.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'topic-item';
    item.id = `topic-item-${i}`;
    item.innerHTML = `
      <div class="topic-num">${i + 1}</div>
      <div class="topic-name">${t.name}</div>
      <div class="topic-diff">${DIFF_STARS[t.diff]}</div>
      ${hasVideo ? `<button class="topic-play-btn" id="topicBtn${i}" onclick="playTopic(${i})">🔊 Erklären</button>` : ''}`;
    topicsList.appendChild(item);
  });

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
    _clearTopicHighlights();
    const li = document.getElementById(`topic-item-${idx}`);
    if (li) li.classList.add('topic-active');
    const tb = document.getElementById(`topicBtn${idx}`);
    if (tb) tb.classList.add('playing');
    showTopicVisual(topic);
    const speech = document.getElementById('avatarSpeech');
    if (speech) speech.textContent = topic.explanation.substring(0, 90) + '…';
    _speakSequential(`Thema ${idx + 1}: ${topic.name}. ${topic.explanation}`, () => {
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

  // Highlight aktives Topic
  const activeItem = document.getElementById(`topic-item-${idx}`);
  if (activeItem) activeItem.classList.add('topic-active');
  const activeBtn = document.getElementById(`topicBtn${idx}`);
  if (activeBtn) activeBtn.classList.add('playing');

  // Sprechblase + Grafik befüllen
  const speech = document.getElementById('avatarSpeech');
  if (speech) speech.textContent = topic.explanation;
  showTopicVisual(topic);

  _speakText(`${topic.name}. ${topic.explanation}`, null, () => {
    _clearTopicHighlights();
    hideTopicVisual();
  });
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
  if (ELEVEN_KEY && !_skipEleven) { _elevenSpeakSequential(text, onDone); return; }
  if (!('speechSynthesis' in window)) { if (onDone) setTimeout(onDone, 600); return; }
  const voice = _getVoice();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.90; utt.pitch = 0.72; utt.lang = 'de-DE';
  if (voice) utt.voice = voice;
  currentUtterance = utt;
  speechPaused = false;

  const words = text.trim().split(/\s+/).length;
  const totalSec = Math.max(4, Math.ceil((words / 130) * 60));
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
  utterance.rate   = 0.90;
  utterance.pitch  = 0.72;
  utterance.lang   = 'de-DE';
  if (voice) utterance.voice = voice;

  currentUtterance = utterance;
  speechPaused     = false;

  const words    = text.trim().split(/\s+/).length;
  const totalSec = Math.max(4, Math.ceil((words / 130) * 60));

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
// CHAT WIDGET  –  Herr Lala KI-Assistent
// ============================================================
const GROQ_KEY = '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';

const CHAT_SYSTEM = `Du bist Herr Lala, ein freundlicher und geduldiger Lernassistent auf der Schullernplattform LernStar. Du hilfst Schülerinnen und Schülern der Klassen 5–13 in Deutschland beim Verstehen von Schulstoffen. Antworte immer auf Deutsch. Erkläre in einfacher, kindgerechter Sprache mit kurzen Sätzen und konkreten Alltagsbeispielen. Halte deine Antworten kurz (maximal 4–5 Sätze). Bei Mathe- oder Physikaufgaben zeige den Lösungsweg klar Schritt für Schritt. Sei freundlich, ermutigend und positiv. Verwende gelegentlich passende Emojis.`;

let _chatOpen = false;

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

function _chatAddBubble(text, role) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = `chat-bubble chat-bubble-${role}`;
  div.innerHTML = text.replace(/\n/g, '<br>');
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

  if (!GROQ_KEY) {
    _chatHideTyping();
    _chatAddBubble('⚠️ Kein API-Key eingetragen. Bitte trage deinen Groq-Key bei GROQ_KEY ein.', 'error');
    sendBtn.disabled = false;
    return;
  }

  try {
    let userContent;
    if (hasImage) {
      userContent = [
        { type: 'image_url', image_url: { url: `data:${imgMime};base64,${imgB64}` } },
        { type: 'text', text: question || 'Bitte löse diese Aufgabe Schritt für Schritt und erkläre den Lösungsweg auf einfache Weise auf Deutsch.' },
      ];
    } else {
      userContent = question;
    }

    const model = hasImage ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.1-8b-instant';

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: CHAT_SYSTEM },
          { role: 'user',   content: userContent },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const data   = await res.json();
    const answer = data.choices?.[0]?.message?.content || '(Keine Antwort erhalten)';

    _chatHideTyping();
    _chatAddBubble(answer, 'bot');

    // Avatar spricht die Antwort vor
    if (ELEVEN_KEY) {
      _elevenSpeakText(answer, null);
    } else {
      _speakSequential(answer, null, false);
    }

  } catch (e) {
    _chatHideTyping();
    _chatAddBubble(`❌ Fehler: ${e.message}`, 'error');
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

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

// Keyboard: Escape closes sidebar and chat
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeSidebar(); _chatClose(); }
});

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateSidebarGrades();
  navigate('home');
});
