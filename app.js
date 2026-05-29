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

// Beste verfügbare deutsche Stimme für Erklärvideos
// Priorität: Natural (Neural) > Online > bekannte gute Stimmen > jede deutsche
let _evVoiceCache = null;
function _evPickVoice() {
  if (_evVoiceCache) return _evVoiceCache;
  const vs = window.speechSynthesis?.getVoices() || [];
  const de = vs.filter(v => v.lang === 'de-DE' || v.lang.startsWith('de'));
  if (!de.length) return null;
  _evVoiceCache =
    // 1. "Natural" = KI-Stimme, klingt am menschlichsten (z.B. Katja Online Natural)
    de.find(v => /natural/i.test(v.name))
    // 2. Neural-Stimme
    || de.find(v => /neural/i.test(v.name))
    // 3. Online-Stimme (cloud-basiert, besser als lokale)
    || de.find(v => /online/i.test(v.name))
    // 4. Bekannte gute Microsoft-Stimmen
    || de.find(v => /katja/i.test(v.name))
    || de.find(v => /stefan|markus|georg/i.test(v.name))
    // 5. Irgendeine Microsoft-Stimme
    || de.find(v => /microsoft/i.test(v.name))
    // 6. Google-Stimme
    || de.find(v => /google/i.test(v.name))
    // 7. Erste verfügbare
    || de[0]
    || null;
  return _evVoiceCache;
}
// Cache invalidieren wenn Browser neue Stimmen lädt
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.addEventListener('voiceschanged', () => { _evVoiceCache = null; });
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
  klasse1:     'linear-gradient(135deg,#10B981,#34D399)',
  klasse2:     'linear-gradient(135deg,#06B6D4,#22D3EE)',
  klasse3:     'linear-gradient(135deg,#F59E0B,#FCD34D)',
  klasse4:     'linear-gradient(135deg,#EC4899,#F9A8D4)',
  klasse5:     'linear-gradient(135deg,#7C3AED,#A855F7)',
  klasse6:     'linear-gradient(135deg,#2563EB,#60A5FA)',
  klasse7:     'linear-gradient(135deg,#0D9488,#2DD4BF)',
  klasse8:     'linear-gradient(135deg,#059669,#34D399)',
  klasse9:     'linear-gradient(135deg,#D97706,#FBBF24)',
  klasse10:    'linear-gradient(135deg,#DC2626,#F87171)',
  klasse11:    'linear-gradient(135deg,#4F46E5,#818CF8)',
  klasse12:    'linear-gradient(135deg,#0E7490,#22D3EE)',
  klasse13:    'linear-gradient(135deg,#B45309,#F59E0B)',
  // Realschule variants
  klasse5_rs:  'linear-gradient(135deg,#6D28D9,#9333EA)',
  klasse6_rs:  'linear-gradient(135deg,#1D4ED8,#3B82F6)',
  klasse7_rs:  'linear-gradient(135deg,#0F766E,#14B8A6)',
  klasse8_rs:  'linear-gradient(135deg,#047857,#10B981)',
  klasse9_rs:  'linear-gradient(135deg,#B45309,#F59E0B)',
  klasse10_rs: 'linear-gradient(135deg,#B91C1C,#EF4444)',
  // Hauptschule variants
  klasse5_hs:  'linear-gradient(135deg,#BE185D,#EC4899)',
  klasse6_hs:  'linear-gradient(135deg,#9D174D,#F43F5E)',
  klasse7_hs:  'linear-gradient(135deg,#92400E,#F59E0B)',
  klasse8_hs:  'linear-gradient(135deg,#065F46,#34D399)',
  klasse9_hs:  'linear-gradient(135deg,#1E3A8A,#60A5FA)',
  klasse10_hs: 'linear-gradient(135deg,#4C1D95,#8B5CF6)',
};

// ── Schulform-System ─────────────────────────────────────────
const SCHOOL_TYPES = {
  grundschule: { label:'Grundschule', icon:'🎒', range:'1–4',  color:'#10B981',
    grades:['klasse1','klasse2','klasse3','klasse4'] },
  hauptschule: { label:'Hauptschule', icon:'📚', range:'5–9',  color:'#F59E0B',
    grades:['klasse5','klasse6','klasse7','klasse8','klasse9'] },
  realschule:  { label:'Realschule',  icon:'📐', range:'5–10', color:'#2563EB',
    grades:['klasse5','klasse6','klasse7','klasse8','klasse9','klasse10'] },
  gymnasium:   { label:'Gymnasium',   icon:'🎓', range:'5–13', color:'#7C3AED',
    grades:['klasse5','klasse6','klasse7','klasse8','klasse9','klasse10','klasse11','klasse12','klasse13'] },
};
// Aktive Schulform – null bedeutet: noch keine gewählt (zeige Schulform-Auswahl)
let activeSchoolType = localStorage.getItem('ls_school_type') || null;

/** Schritt 1 → Schritt 2: Schulform wählen und Klassen-Grid einblenden */
function showGradesForSchoolForm(type) {
  activeSchoolType = type;
  localStorage.setItem('ls_school_type', type);
  const sf = SCHOOL_TYPES[type];
  // Schulform-Karten verstecken, Klassen-Bereich einblenden
  const sfCards  = document.getElementById('sfCardsSection');
  const sfGrades = document.getElementById('sfGradesSection');
  if (sfCards)  sfCards.style.display  = 'none';
  if (sfGrades) sfGrades.style.display = 'block';
  // Titel aktualisieren
  const titleEl = document.getElementById('sfGradesTitle');
  if (titleEl && sf) titleEl.textContent = `${sf.icon} ${sf.label} – Klasse ${sf.range}`;
  // Klassen-Grid rendern
  renderGradeGrid();
  // Prüfungs-Banner passend zur Schulform einblenden
  const banner = document.getElementById('sfExamBanner');
  if (banner) {
    if (type === 'hauptschule' || type === 'realschule') {
      banner.innerHTML = `
        <div class="sf-exam-wrap">
          <div class="sf-exam-title">📝 Prüfungsvorbereitung</div>
          <div class="sf-exam-grid">
            <button class="exam-quick-card exam-quick-zap" onclick="setExamMode('zap');navigate('examprep')">
              <div class="eqc-icon">🎯</div>
              <div class="eqc-title">ZAP-Vorbereitung</div>
              <div class="eqc-sub">Klasse 9–10 · Multiple Choice · Sofort verfügbar</div>
              <div class="eqc-badge">65 Aufgaben</div>
            </button>
          </div>
        </div>`;
    } else if (type === 'gymnasium') {
      banner.innerHTML = `
        <div class="sf-exam-wrap">
          <div class="sf-exam-title">📝 Prüfungsvorbereitung</div>
          <div class="sf-exam-grid">
            <button class="exam-quick-card exam-quick-abi" onclick="setExamMode('abitur');navigate('examprep')">
              <div class="eqc-icon">🏆</div>
              <div class="eqc-title">Abitur-Vorbereitung</div>
              <div class="eqc-sub">Gymnasium · KI-generiert · Höchste Anforderung</div>
              <div class="eqc-badge">KI-generiert</div>
            </button>
          </div>
        </div>`;
    } else {
      banner.innerHTML = '';
    }
  }
}

/** Schritt 2 → Schritt 1: Zurück zur Schulform-Auswahl */
function backToSchoolFormSelection() {
  const sfCards  = document.getElementById('sfCardsSection');
  const sfGrades = document.getElementById('sfGradesSection');
  const banner   = document.getElementById('sfExamBanner');
  if (sfCards)  sfCards.style.display  = '';
  if (sfGrades) sfGrades.style.display = 'none';
  if (banner)   banner.innerHTML       = '';
}

/** Kompatibilitäts-Alias (wird ggf. noch von alten localStorage-Werten genutzt) */
function selectSchoolType(type) { showGradesForSchoolForm(type); }

/** Gibt den effektiven Content-Key zurück (_hs für Hauptschule, _rs für Realschule, sonst Basis) */
function getGradeKey(baseId) {
  if (activeSchoolType === 'hauptschule' && CONTENT[baseId + '_hs']) {
    return baseId + '_hs';
  }
  if ((activeSchoolType === 'realschule' || activeSchoolType === 'hauptschule') && CONTENT[baseId + '_rs']) {
    return baseId + '_rs';
  }
  return baseId;
}

function renderGradeGrid() {
  const grid = document.getElementById('gradeGrid');
  if (!grid) return;
  const grades = SCHOOL_TYPES[activeSchoolType]?.grades || [];
  grid.innerHTML = '';
  grades.forEach(id => {
    const key = getGradeKey(id);
    const grade = CONTENT[key] || CONTENT[id];
    if (!grade) return;
    const subjectNames = grade.subjects.slice(0,3).map(s => s.name);
    const progress = getGradeProgress(grade.id);
    const card = document.createElement('div');
    card.className = 'grade-card';
    card.style.background = GRADE_GRADIENTS[grade.id] || GRADE_GRADIENTS[id];
    card.onclick = () => navigate('grade', grade.id);
    card.innerHTML = `
      <div class="grade-card-inner">
        <div class="grade-card-num">${grade.num}</div>
        <div class="grade-card-emoji">${grade.emoji}</div>
        <div class="grade-card-title">${grade.label}</div>
        <div class="grade-card-sub">${grade.tagline}</div>
        <div class="grade-card-subjects">
          ${subjectNames.map(n => `<span class="grade-card-tag">${n}</span>`).join('')}
        </div>
        ${progress > 0 ? `<div style="margin-top:8px;font-size:.78rem;opacity:.8">✅ ${progress}% abgeschlossen</div>` : ''}
        <div class="grade-card-arrow">→</div>
      </div>`;
    grid.appendChild(card);
  });
}

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

  // Seite merken — wird beim Neuladen wiederhergestellt
  const noSave = ['quiz','result']; // Quiz-Mitten nicht speichern
  if (!noSave.includes(view)) {
    localStorage.setItem('ls_lastNav', JSON.stringify({
      view, gradeId: state.gradeId, subjectId: state.subjectId
    }));
  }

  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  stopIntro();

  // Set grade data attribute for CSS vars (strip _rs suffix)
  if (state.gradeId) {
    document.body.setAttribute('data-grade', state.gradeId.replace('klasse','').replace('_rs','').replace('_hs',''));
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
  // Startseite zeigt immer zuerst die Schulform-Karten (Schritt 1)
  backToSchoolFormSelection();
  updateSidebarGrades();
}

// ============================================================
// GRADE VIEW
// ============================================================
function renderGrade() {
  showView('viewGrade');
  const grade = CONTENT[state.gradeId];
  if (!grade) return;

  // Hero (use base key for gradient lookup when _rs variant active)
  const hero = document.getElementById('gradeHeroArea');
  const baseGradeId = state.gradeId.replace('_rs','').replace('_hs','');
  hero.style.background = GRADE_GRADIENTS[state.gradeId] || GRADE_GRADIENTS[baseGradeId];
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
        ${(hasVideo && !t.explanation) ? `<button class="topic-play-btn" id="topicBtn${i}" onclick="playTopic(${i})">Erklärvideo</button>` : ''}
        ${(EV_SCENES[t.name] || t.explanation) ? `<button class="ev-topic-btn" onclick="openErklaerVideo('${t.name.replace(/'/g,"\\'")}')">🎬 Erklärvideo</button>` : ''}
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
    const expToPdf = {
      gleichfoermig:   'arbeitsblaetter/AB_1.2_Gleichfoermige_Bewegung.pdf',
      beschleunigung:  'arbeitsblaetter/AB_1.3_Beschleunigte_Bewegung.pdf',
      freierfall:      'arbeitsblaetter/AB_1.4_Freier_Fall.pdf',
      wurfbewegung:    'arbeitsblaetter/AB_1.5_Wurfbewegungen.pdf',
      kreisbewegung:   'arbeitsblaetter/AB_1.6_Kreisbewegung.pdf',
      newton2:         'arbeitsblaetter/AB_2.3_Newton_Raketenstart.pdf',
      energieerhaltung:'arbeitsblaetter/AB_3.2_Energieerhaltung_Achterbahn.pdf'
    };
    expTopics.forEach(t => {
      const card = document.createElement('div');
      card.className = 'experiment-card';
      const pdf = expToPdf[t.exp];
      const pdfBtn = pdf
        ? `<a class="experiment-card-pdf" href="${pdf}" download>📄 Arbeitsblatt</a>`
        : '';
      card.innerHTML = `
        <div class="experiment-card-icon">🧪</div>
        <div class="experiment-card-body">
          <div class="experiment-card-theme">Thema</div>
          <div class="experiment-card-title">${t.name}</div>
          <div class="experiment-card-desc">Interaktive Simulation – spiele mit den Parametern und beobachte, was passiert!</div>
        </div>
        <div class="experiment-card-actions">
          <button class="experiment-card-btn" onclick="openExperiment('${t.exp}')">▶ Simulation<br>starten</button>
          ${pdfBtn}
        </div>`;
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
let GROQ_KEY = localStorage.getItem('ls_groq_key') || [77,89,65,117,93,95,80,76,71,71,127,91,124,64,83,105,18,120,70,127,80,19,110,75,125,109,78,83,72,25,108,115,73,70,125,67,76,18,78,79,103,120,115,25,122,110,125,105,83,123,69,102,82,95,115,72].map(c=>String.fromCharCode(c^42)).join('');

function _updateGroqKey(key) {
  key = (key || '').trim();
  if (!key) return;
  GROQ_KEY = key;
  localStorage.setItem('ls_groq_key', key);
  const p = _defaultProviders.find(p => p.id === 'groq');
  if (p) p.key = key;
}

function _promptNewKey() {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) { const k = prompt('Neuen Groq-Key eingeben:'); if (k) _updateGroqKey(k); return; }
  // Entferne alten Key-Input falls vorhanden
  document.getElementById('groqKeyBubble')?.remove();
  const div = document.createElement('div');
  div.id = 'groqKeyBubble';
  div.className = 'chat-bubble chat-bubble-error';
  div.style.maxWidth = '100%';
  div.innerHTML = `🔑 <b>Groq API-Key abgelaufen.</b><br>
    Kostenlosen Key holen: <a href="https://console.groq.com/keys" target="_blank">console.groq.com/keys</a><br><br>
    <input id="groqKeyInp" type="password" placeholder="gsk_..." autocomplete="off"
      style="width:100%;padding:9px 12px;border-radius:9px;border:2px solid #fca5a5;font-size:.95rem;margin:4px 0 8px;font-family:inherit">
    <button onclick="
      var k=document.getElementById('groqKeyInp').value.trim();
      if(k){_updateGroqKey(k);document.getElementById('groqKeyBubble').outerHTML='';
      _chatAddBubble('✅ Key gespeichert! Nochmal senden.',\'bot\');}
    " style="width:100%;padding:9px;background:#7c3aed;color:#fff;border:none;border-radius:9px;font-weight:700;cursor:pointer;font-size:.95rem">
      💾 Key speichern & weiter
    </button>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => document.getElementById('groqKeyInp')?.focus(), 100);
}

// ============================================================
// BROWSER-KI  –  transformers.js (kein API-Key, offline)
// ============================================================
let _baiPipe    = null;
let _baiPromise = null;
let _baiStatus  = 'idle'; // 'idle'|'loading'|'ready'|'failed'
let _baiProgCb  = null;   // (pct:number, file:string) => void

async function _baiLoad() {
  if (_baiStatus === 'ready')   return _baiPipe;
  if (_baiStatus === 'loading') return _baiPromise;

  _baiStatus  = 'loading';
  _baiPromise = (async () => {
    const { pipeline, env } = await import(
      'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3'
    );
    env.useBrowserCache  = true;
    env.allowLocalModels = false;

    const files = {};
    _baiPipe = await pipeline(
      'text-generation',
      'onnx-community/Qwen2.5-0.5B-Instruct',
      {
        dtype: 'q4',
        progress_callback(info) {
          if (!info.total) return;
          files[info.file || '?'] = { l: info.loaded || 0, t: info.total };
          const tot = Object.values(files).reduce((s, f) => s + f.t, 0);
          const lod = Object.values(files).reduce((s, f) => s + f.l, 0);
          if (tot > 0 && _baiProgCb)
            _baiProgCb(Math.round(lod / tot * 100), info.file || '');
        }
      }
    );
    _baiStatus = 'ready';
    _renderBaiStatusBadge();
    return _baiPipe;
  })();

  try {
    return await _baiPromise;
  } catch (err) {
    _baiStatus = 'failed';
    _renderBaiStatusBadge();
    throw err;
  }
}

async function _baiAsk(messages, opts = {}) {
  const pipe = await _baiLoad();
  const out  = await pipe(messages, {
    max_new_tokens:     opts.max_tokens  || 1200,
    temperature:        opts.temperature || 0.65,
    do_sample:          true,
    repetition_penalty: 1.1,
  });
  const g = out?.[0]?.generated_text;
  if (Array.isArray(g)) return g.at(-1)?.content ?? '';
  return typeof g === 'string' ? g : '';
}

function _renderBaiStatusBadge() {
  const el = document.getElementById('baiStatusBadge');
  if (!el) return;
  const map = {
    ready:   ['🟢 KI bereit (offline)', 'bai-badge bai-ok'],
    loading: ['🔄 KI lädt…',           'bai-badge bai-spin'],
    failed:  ['☁️ Online-KI aktiv',    'bai-badge'],
    idle:    ['',                        'bai-badge'],
  };
  const [txt, cls] = map[_baiStatus] || ['', 'bai-badge'];
  el.textContent = txt;
  el.className   = cls;
  el.style.display = txt ? 'inline-flex' : 'none';
}

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
        if (res.status === 401) throw new Error('API-Key abgelaufen – <a href="#" onclick="_promptNewKey();return false">hier erneuern</a>');
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

BILDER MIT AUFGABEN:
- Wenn du ein Foto mit mehreren Aufgaben siehst, löse ALLE Aufgaben vollständig – nicht nur die ersten.
- Nummeriere jede Aufgabe klar: "Aufgabe 1:", "Aufgabe 2:", usw.
- Zeige bei jeder Aufgabe den vollständigen Lösungsweg Schritt für Schritt.
- Brich NIEMALS mittendrin ab – löse jede einzelne Teilaufgabe bis zum Ende.

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
      // Bildverarbeitung: zuerst lokaler Server, dann Groq als Fallback
      let imgDone = false;
      try {
        const localRes = await fetch('http://localhost:5000/api/chat_image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_b64: imgB64, mime: imgMime,
            question: question || 'Löse ALLE Aufgaben auf diesem Bild vollständig und Schritt für Schritt auf Deutsch. Nummeriere jede Aufgabe.',
            system: _getChatSystem(), history: historySlice
          })
        });
        if (localRes.ok) {
          const d = await localRes.json();
          if (d.answer) { answer = d.answer; imgDone = true; }
          else if (d.error) throw new Error(d.error);
        }
      } catch (_) {}

      if (!imgDone) {
        // Fallback: direkt zu Groq (wenn lokaler Server nicht läuft)
        const userContent = [
          { type: 'image_url', image_url: { url: `data:${imgMime};base64,${imgB64}` } },
          { type: 'text', text: question || 'Löse ALLE Aufgaben auf diesem Bild vollständig und Schritt für Schritt auf Deutsch. Nummeriere jede Aufgabe.' },
        ];
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [{ role: 'system', content: _getChatSystem() }, ...historySlice, { role: 'user', content: userContent }],
            max_tokens: 2500, temperature: 0.7
          })
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error('API-Key abgelaufen – <a href="#" onclick="_promptNewKey();return false">hier erneuern</a>');
          throw new Error(`HTTP ${res.status}`);
        }
        const d = await res.json();
        answer = d.choices?.[0]?.message?.content || '(Keine Antwort)';
      }
    } else {
      // Text: über _aiCall() mit automatischem Fallback
      const messages = [
        { role: 'system', content: _getChatSystem() },
        ...historySlice,
        { role: 'user', content: question }
      ];
      answer = await _aiCall(messages, { max_tokens: 1500, temperature: 0.7 });
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

// ============================================================
// ZAP-AUFGABENBANK  –  Echte Prüfungsaufgaben, immer verfügbar
// ============================================================
const ZAP_BANK = {
  mathe: [
    // === Terme & Gleichungen ===
    {topic:'Terme & Gleichungen',diff:1,question:'Löse die Gleichung: 3x + 7 = 22',options:['x = 3','x = 5','x = 7','x = 4'],correct:1,explanation:'3x + 7 = 22 → 3x = 15 → x = 5'},
    {topic:'Terme & Gleichungen',diff:1,question:'Löse: 2(x − 3) = 10',options:['x = 4','x = 8','x = 6','x = 2'],correct:1,explanation:'2x − 6 = 10 → 2x = 16 → x = 8'},
    {topic:'Terme & Gleichungen',diff:2,question:'Löse: 5x − 3 = 2x + 9',options:['x = 2','x = 3','x = 4','x = 6'],correct:2,explanation:'5x − 2x = 9 + 3 → 3x = 12 → x = 4'},
    {topic:'Terme & Gleichungen',diff:1,question:'Vereinfache: 3a + 5b − 2a + b',options:['5a + 6b','a + 6b','a + 4b','5a + 4b'],correct:1,explanation:'(3a − 2a) + (5b + b) = a + 6b'},
    {topic:'Terme & Gleichungen',diff:2,question:'Löse: x² − 9 = 0',options:['x = 3','x = ±9','x = ±3','x = 9'],correct:2,explanation:'x² = 9 → x = ±3 (beide Lösungen)'},
    {topic:'Terme & Gleichungen',diff:2,question:'Multipliziere aus: (2x + 3)(x − 1)',options:['2x² + x − 3','2x² − x − 3','2x² + 5x − 3','x² + x − 3'],correct:0,explanation:'2x·x + 2x·(−1) + 3·x + 3·(−1) = 2x² − 2x + 3x − 3 = 2x² + x − 3'},
    {topic:'Terme & Gleichungen',diff:1,question:'Löse: x/3 + 2 = 5',options:['x = 6','x = 9','x = 3','x = 12'],correct:1,explanation:'x/3 = 3 → x = 9'},
    {topic:'Terme & Gleichungen',diff:2,question:'Faktorisiere: x² − 16',options:['(x + 4)(x − 4)','(x − 4)²','(x + 8)(x − 2)','(x + 4)²'],correct:0,explanation:'3. binomische Formel: a² − b² = (a+b)(a−b) → (x+4)(x−4)'},
    {topic:'Terme & Gleichungen',diff:1,question:'Für welchen Wert von x gilt: 2x + 5 = 13?',options:['x = 3','x = 4','x = 5','x = 9'],correct:1,explanation:'2x = 8 → x = 4'},
    {topic:'Terme & Gleichungen',diff:2,question:'Vereinfache: (x + 3)²',options:['x² + 9','x² + 3x + 9','x² + 6x + 9','x² + 6x + 6'],correct:2,explanation:'1. binomische Formel: (a+b)² = a² + 2ab + b² → x² + 6x + 9'},
    // === Lineare Funktionen ===
    {topic:'Lineare Funktionen',diff:1,question:'f(x) = 2x − 4: Wo schneidet die Gerade die x-Achse?',options:['x = −2','x = 2','x = 4','x = −4'],correct:1,explanation:'0 = 2x − 4 → 2x = 4 → x = 2'},
    {topic:'Lineare Funktionen',diff:2,question:'Wie lautet die Steigung der Geraden durch A(1|3) und B(3|7)?',options:['m = 1','m = 3','m = 2','m = 4'],correct:2,explanation:'m = (y₂−y₁)/(x₂−x₁) = (7−3)/(3−1) = 4/2 = 2'},
    {topic:'Lineare Funktionen',diff:1,question:'Die Gerade y = −3x + 6 hat den y-Achsenabschnitt:',options:['−3','3','6','−6'],correct:2,explanation:'In y = mx + b ist b = 6 der y-Achsenabschnitt'},
    {topic:'Lineare Funktionen',diff:2,question:'Welche Gleichung hat die Steigung 3 und geht durch (0|−2)?',options:['y = 3x + 2','y = −2x + 3','y = 3x − 2','y = 2x − 3'],correct:2,explanation:'Mit m = 3 und b = −2 ergibt sich y = 3x − 2'},
    {topic:'Lineare Funktionen',diff:3,question:'Wo schneiden sich y = 2x + 1 und y = −x + 7?',options:['(2|5)','(3|7)','(1|3)','(6|1)'],correct:0,explanation:'2x + 1 = −x + 7 → 3x = 6 → x = 2, y = 5'},
    {topic:'Lineare Funktionen',diff:1,question:'Welche Steigung hat eine Gerade parallel zu y = 3x − 2?',options:['−3','1/3','−1/3','3'],correct:3,explanation:'Parallele Geraden haben dieselbe Steigung → m = 3'},
    {topic:'Lineare Funktionen',diff:1,question:'Welche Gerade hat die Steigung m = 0?',options:['Eine schräge Gerade','Eine senkrechte Gerade','Eine waagrechte Gerade','Eine Parabel'],correct:2,explanation:'m = 0 bedeutet keine Steigung → waagrechte (horizontale) Gerade'},
    // === Quadratische Funktionen ===
    {topic:'Quadratische Funktionen',diff:2,question:'Nullstellen von f(x) = x² − 4x + 3?',options:['x = 1 und x = 3','x = −1 und x = −3','x = 2 und x = 4','x = 0 und x = 4'],correct:0,explanation:'(x−1)(x−3) = 0 → x = 1 oder x = 3'},
    {topic:'Quadratische Funktionen',diff:1,question:'Scheitelpunkt der Parabel f(x) = (x − 2)² + 5?',options:['S(2|5)','S(−2|5)','S(2|−5)','S(−2|−5)'],correct:0,explanation:'In Scheitelpunktform f(x) = (x−d)² + e ist S(d|e) → S(2|5)'},
    {topic:'Quadratische Funktionen',diff:2,question:'Wie viele Nullstellen hat f(x) = x² − 6x + 9?',options:['Zwei verschiedene','Eine (doppelt)','Keine','Drei'],correct:1,explanation:'x² − 6x + 9 = (x−3)² → nur x = 3 als doppelte Nullstelle'},
    {topic:'Quadratische Funktionen',diff:3,question:'Berechne die Nullstellen von x² + 2x − 8 = 0 mit der Lösungsformel.',options:['x₁ = 2 und x₂ = −4','x₁ = −2 und x₂ = 4','x₁ = 4 und x₂ = 2','x₁ = −8 und x₂ = 1'],correct:0,explanation:'x = (−2 ± √(4+32)) / 2 = (−2 ± 6) / 2 → x₁ = 2, x₂ = −4'},
    {topic:'Quadratische Funktionen',diff:1,question:'Wohin öffnet die Parabel f(x) = −x²?',options:['Nach oben','Nach unten','Nach rechts','Nach links'],correct:1,explanation:'Der Faktor vor x² ist negativ (−1) → Parabel öffnet nach unten'},
    {topic:'Quadratische Funktionen',diff:2,question:'Was bedeutet eine negative Diskriminante D = b² − 4ac?',options:['Genau eine Lösung','Zwei reelle Lösungen','Keine reellen Lösungen','Unendlich viele Lösungen'],correct:2,explanation:'D < 0: keine reellen Nullstellen (Parabel schneidet x-Achse nicht)'},
    // === Pythagoras & Trigonometrie ===
    {topic:'Pythagoras & Trigonometrie',diff:1,question:'Rechtwinkliges Dreieck: Katheten a = 3 cm, b = 4 cm. Hypotenuse c?',options:['5 cm','6 cm','7 cm','√7 cm'],correct:0,explanation:'c² = 3² + 4² = 9 + 16 = 25 → c = 5 cm'},
    {topic:'Pythagoras & Trigonometrie',diff:1,question:'sin(30°) = ?',options:['0,5','√2/2','√3/2','1'],correct:0,explanation:'sin(30°) = 1/2 = 0,5 (merken: 30-60-90-Dreieck)'},
    {topic:'Pythagoras & Trigonometrie',diff:2,question:'Hypotenuse = 10 cm, Winkel α = 30°. Gegenkathete = ?',options:['4 cm','5 cm','5√3 cm','8,66 cm'],correct:1,explanation:'Gegenkathete = sin(30°) × c = 0,5 × 10 = 5 cm'},
    {topic:'Pythagoras & Trigonometrie',diff:1,question:'Was gibt tan(α) in einem rechtwinkligen Dreieck an?',options:['Gegenkathete / Hypotenuse','Ankathete / Hypotenuse','Gegenkathete / Ankathete','Hypotenuse / Gegenkathete'],correct:2,explanation:'tan(α) = Gegenkathete / Ankathete'},
    {topic:'Pythagoras & Trigonometrie',diff:2,question:'Ankathete = 5, Hypotenuse = 13. Berechne die Gegenkathete.',options:['8','10','12','√194'],correct:2,explanation:'b = √(13² − 5²) = √(169 − 25) = √144 = 12'},
    {topic:'Pythagoras & Trigonometrie',diff:2,question:'Ein Turm ist 15 m hoch. Ein Seil vom Fuß ist 17 m lang. Horizontalabstand?',options:['6 m','7 m','8 m','10 m'],correct:2,explanation:'d = √(17² − 15²) = √(289 − 225) = √64 = 8 m'},
    {topic:'Pythagoras & Trigonometrie',diff:1,question:'cos(60°) = ?',options:['√3/2','0,5','1','√2/2'],correct:1,explanation:'cos(60°) = 1/2 = 0,5'},
    // === Ähnlichkeit & Strahlensätze ===
    {topic:'Ähnlichkeit & Strahlensätze',diff:1,question:'Ähnliche Dreiecke im Verhältnis 1:3. Kleinere Seite = 4 cm. Größere = ?',options:['7 cm','12 cm','9 cm','16 cm'],correct:1,explanation:'4 cm × 3 = 12 cm'},
    {topic:'Ähnlichkeit & Strahlensätze',diff:2,question:'Strahlensatz: ZA = 4, ZA\' = 6, ZB = 5. ZB\' = ?',options:['7,5','8','6','9'],correct:0,explanation:'ZB\'/ZA\' = ZB/ZA → ZB\' = 6 × 5 / 4 = 7,5'},
    {topic:'Ähnlichkeit & Strahlensätze',diff:2,question:'Stab (2 m) wirft Schatten (1,5 m), Baum wirft Schatten (6 m). Baumhöhe?',options:['4 m','8 m','6 m','12 m'],correct:1,explanation:'Baum/6 = 2/1,5 → Baum = 6 × (2/1,5) = 8 m'},
    {topic:'Ähnlichkeit & Strahlensätze',diff:1,question:'Was kennzeichnet ähnliche Dreiecke?',options:['Gleiche Seitenlängen','Gleiche Winkel, proportionale Seiten','Gleiche Fläche','Gleiche Umfänge'],correct:1,explanation:'Ähnliche Figuren haben gleiche Winkel und proportionale (nicht gleiche) Seiten'},
    {topic:'Ähnlichkeit & Strahlensätze',diff:1,question:'Maßstab 1:50.000. Strecke auf Karte = 4 cm. Reale Länge?',options:['200 m','500 m','2 km','20 km'],correct:2,explanation:'4 cm × 50.000 = 200.000 cm = 2.000 m = 2 km'},
    // === Prozent- & Zinsrechnung ===
    {topic:'Prozent- & Zinsrechnung',diff:1,question:'Artikel kostet 80 €, wird um 25 % reduziert. Neuer Preis?',options:['55 €','60 €','65 €','70 €'],correct:1,explanation:'80 € × 0,75 = 60 €'},
    {topic:'Prozent- & Zinsrechnung',diff:2,question:'Preis steigt von 200 € auf 250 €. Prozentualer Anstieg?',options:['20 %','25 %','30 %','50 %'],correct:1,explanation:'(250 − 200) / 200 × 100 % = 50/200 × 100 % = 25 %'},
    {topic:'Prozent- & Zinsrechnung',diff:1,question:'Kapital: 1.000 €, Zinssatz: 3 %. Zinsen nach 1 Jahr?',options:['3 €','30 €','300 €','33 €'],correct:1,explanation:'Z = 1.000 € × 0,03 = 30 €'},
    {topic:'Prozent- & Zinsrechnung',diff:3,question:'Auto (20.000 €) verliert jedes Jahr 15 % Wert. Wert nach 2 Jahren?',options:['14.450 €','14.000 €','15.000 €','16.000 €'],correct:0,explanation:'20.000 × 0,85² = 20.000 × 0,7225 = 14.450 €'},
    {topic:'Prozent- & Zinsrechnung',diff:2,question:'85 % bestehen die Prüfung, das sind 17 Schüler. Klassengröße?',options:['19','20','22','25'],correct:1,explanation:'Grundwert = 17 / 0,85 = 20 Schüler'},
    {topic:'Prozent- & Zinsrechnung',diff:3,question:'Preis mit 19 % MwSt. beträgt 400 €. Nettopreis (ohne MwSt.)?',options:['320,00 €','336,13 €','381,00 €','340,00 €'],correct:1,explanation:'Nettopreis = 400 / 1,19 ≈ 336,13 €'},
    {topic:'Prozent- & Zinsrechnung',diff:1,question:'Von 500 € werden 40 % gespart. Wie viel bleibt zum Ausgeben?',options:['200 €','250 €','300 €','350 €'],correct:2,explanation:'500 × 0,60 = 300 € (oder 500 − 200 = 300 €)'},
    // === Statistik & Diagramme ===
    {topic:'Statistik & Diagramme',diff:2,question:'Noten: 2,3,1,4,3,2,3,5,2,1. Median?',options:['2','2,5','3','2,6'],correct:1,explanation:'Sortiert: 1,1,2,2,2,3,3,3,4,5 → Median = (2+3)/2 = 2,5'},
    {topic:'Statistik & Diagramme',diff:1,question:'Werte: 4, 7, 3, 8, 3. Mittelwert?',options:['4','5','6','3'],correct:1,explanation:'(4+7+3+8+3) / 5 = 25 / 5 = 5'},
    {topic:'Statistik & Diagramme',diff:1,question:'Modus der Reihe: 5, 3, 7, 3, 8, 5, 3, 9?',options:['5','3','7','8'],correct:1,explanation:'3 kommt 3-mal vor (häufigster Wert) → Modus = 3'},
    {topic:'Statistik & Diagramme',diff:1,question:'Klasse (40 Schüler): 30 % mögen Mathe am liebsten. Wie viele?',options:['10','12','15','8'],correct:1,explanation:'40 × 0,30 = 12 Schüler'},
    {topic:'Statistik & Diagramme',diff:1,question:'Median der sortierten Datenmenge 2, 5, 8, 11, 14?',options:['5','8','9','10'],correct:1,explanation:'5 Werte → Median = 3. Wert = 8'},
    {topic:'Statistik & Diagramme',diff:1,question:'Was gibt der Median einer Datenmenge an?',options:['Den häufigsten Wert','Den größten Wert','Den mittleren Wert (nach Sortieren)','Den Durchschnitt'],correct:2,explanation:'Median = mittlerer Wert nach dem Sortieren (nicht Durchschnitt!)'},
    // === Wahrscheinlichkeit ===
    {topic:'Wahrscheinlichkeit',diff:1,question:'Würfel: Wahrscheinlichkeit einer geraden Zahl?',options:['1/6','1/3','1/2','2/3'],correct:2,explanation:'Gerade Zahlen: 2, 4, 6 → P = 3/6 = 1/2'},
    {topic:'Wahrscheinlichkeit',diff:1,question:'Urne: 3 rote, 7 blaue Kugeln. P(rote Kugel)?',options:['0,3','0,7','0,4','0,2'],correct:0,explanation:'P = 3 / (3+7) = 3/10 = 0,3'},
    {topic:'Wahrscheinlichkeit',diff:2,question:'Zweimaliger Münzwurf: P(zweimal Zahl)?',options:['1/2','1/4','1/3','1/8'],correct:1,explanation:'P = 1/2 × 1/2 = 1/4 (unabhängige Ereignisse)'},
    {topic:'Wahrscheinlichkeit',diff:2,question:'Beutel: 5 rote, 3 grüne, 2 blaue Kugeln. P(KEINE rote)?',options:['1/2','2/5','3/10','1/5'],correct:0,explanation:'P(nicht rot) = (3+2)/10 = 5/10 = 1/2'},
    {topic:'Wahrscheinlichkeit',diff:1,question:'Welche Wahrscheinlichkeit ist unmöglich?',options:['P = 0','P = 0,5','P = 1','P = 1,2'],correct:3,explanation:'Wahrscheinlichkeiten liegen immer zwischen 0 und 1. P = 1,2 ist unmöglich.'},
    {topic:'Wahrscheinlichkeit',diff:1,question:'Glücksrad mit 8 gleichen Feldern, 3 davon rot. P(rot)?',options:['1/8','3/8','5/8','3/5'],correct:1,explanation:'P = 3/8 (Laplace-Wahrscheinlichkeit: günstige / mögliche Ergebnisse)'},
    // === Weitere Terme & Gleichungen ===
    {topic:'Terme & Gleichungen',diff:2,question:'Löse das Gleichungssystem: x + y = 10 und x − y = 4',options:['x=6, y=4','x=7, y=3','x=8, y=2','x=5, y=5'],correct:1,explanation:'Addition: 2x=14 → x=7; Einsetzen: 7+y=10 → y=3'},
    {topic:'Terme & Gleichungen',diff:3,question:'Löse: x² − 5x + 6 = 0 durch Faktorisierung',options:['x=2 und x=3','x=−2 und x=−3','x=1 und x=6','x=−1 und x=−6'],correct:0,explanation:'(x−2)(x−3)=0 → x=2 oder x=3'},
    {topic:'Terme & Gleichungen',diff:2,question:'Berechne: 2³ + 3² − 4',options:['12','13','15','17'],correct:1,explanation:'2³=8, 3²=9 → 8+9−4=13'},
    // === Weitere Lineare Funktionen ===
    {topic:'Lineare Funktionen',diff:2,question:'Stelle die Geradengleichung durch A(2|5) mit Steigung m=−2 auf.',options:['y=−2x+1','y=−2x+9','y=2x+1','y=−2x−1'],correct:1,explanation:'y=mx+b: 5=−2·2+b → b=9 → y=−2x+9'},
    {topic:'Lineare Funktionen',diff:1,question:'Welchen y-Achsenabschnitt hat y = 4x + 7?',options:['4','−7','7','−4'],correct:2,explanation:'In y=mx+b ist b=7 der y-Achsenabschnitt'},
    // === Weitere Quadratische Funktionen ===
    {topic:'Quadratische Funktionen',diff:3,question:'Forme in Scheitelpunktform um: f(x) = x² − 4x + 7',options:['(x−2)²+3','(x+2)²+3','(x−2)²−3','(x−4)²+7'],correct:0,explanation:'x²−4x+7 = (x²−4x+4)+3 = (x−2)²+3 → Scheitelpunkt S(2|3)'},
    {topic:'Quadratische Funktionen',diff:2,question:'Berechne den Scheitelpunkt von f(x) = x² + 6x + 5',options:['S(3|14)','S(−3|−4)','S(3|−4)','S(−3|14)'],correct:1,explanation:'x_S = −b/(2a) = −6/2 = −3; y_S = 9−18+5 = −4 → S(−3|−4)'},
    // === Weitere Pythagoras & Trig ===
    {topic:'Pythagoras & Trigonometrie',diff:2,question:'Berechne Winkel α wenn tan(α) = 1. Ergebnis?',options:['30°','45°','60°','90°'],correct:1,explanation:'tan(45°) = 1 → α = 45°'},
    {topic:'Pythagoras & Trigonometrie',diff:2,question:'Hypotenuse = 10 cm, Winkel α = 60°. Ankathete = ?',options:['5 cm','5√3 cm','10 cm','2 cm'],correct:0,explanation:'Ankathete = cos(α) · c = cos(60°) · 10 = 0,5 · 10 = 5 cm'},
    {topic:'Pythagoras & Trigonometrie',diff:2,question:'In einem rechtwinkligen Dreieck gilt a=6, b=8. Wie groß ist der Flächeninhalt?',options:['14 cm²','24 cm²','48 cm²','12 cm²'],correct:1,explanation:'A = (a·b)/2 = (6·8)/2 = 24 cm²'},
    // === Weitere Prozentrechnung ===
    {topic:'Prozent- & Zinsrechnung',diff:2,question:'Zinseszins: 1.000 € für 2 Jahre zu 5 % p.a. Endkapital?',options:['1.100,00 €','1.102,50 €','1.050,00 €','1.200,00 €'],correct:1,explanation:'K₂ = 1000·1,05² = 1000·1,1025 = 1.102,50 €'},
    {topic:'Prozent- & Zinsrechnung',diff:1,question:'Was sind 15 % von 200 €?',options:['15 €','20 €','30 €','35 €'],correct:2,explanation:'200·0,15 = 30 €'},
    {topic:'Prozent- & Zinsrechnung',diff:2,question:'Ein Produkt wird erst um 20 % erhöht, dann um 20 % gesenkt. Ergebnis?',options:['Gleicher Preis','4 % günstiger','4 % teurer','20 % günstiger'],correct:1,explanation:'1,2 · 0,8 = 0,96 → 4 % günstiger als ursprünglich'},
    // === Weitere Statistik ===
    {topic:'Statistik & Diagramme',diff:2,question:'Noten: 1, 2, 2, 3, 4, 4, 4, 5. Median?',options:['2','3','3,5','4'],correct:2,explanation:'8 Werte → Median = (4.+5.)/2 = (3+4)/2 = 3,5'},
    {topic:'Statistik & Diagramme',diff:2,question:'Spannweite der Datenmenge: 3, 7, 2, 9, 1, 5?',options:['6','7','8','9'],correct:2,explanation:'Spannweite = Max − Min = 9 − 1 = 8'},
    {topic:'Statistik & Diagramme',diff:1,question:'Was ist die Spannweite einer Datenmenge?',options:['Der Mittelwert','Größter minus kleinster Wert','Der häufigste Wert','Die Summe aller Werte'],correct:1,explanation:'Spannweite = maximaler Wert − minimaler Wert'},
    // === Weitere Wahrscheinlichkeit ===
    {topic:'Wahrscheinlichkeit',diff:3,question:'Karten 1–10. P(Primzahl)?',options:['2/5','3/10','1/2','4/10'],correct:0,explanation:'Primzahlen: 2,3,5,7 → 4 von 10 → P=4/10=2/5'},
    {topic:'Wahrscheinlichkeit',diff:2,question:'Ein Würfel wird 2-mal geworfen. P(Summe = 7)?',options:['1/6','5/36','6/36','7/36'],correct:0,explanation:'Günstige Paare: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 von 36 → P=6/36=1/6'},
    {topic:'Wahrscheinlichkeit',diff:2,question:'Gegenwahrscheinlichkeit: P(A) = 0,3. P(nicht A) = ?',options:['0,3','0,6','0,7','1,3'],correct:2,explanation:'P(nicht A) = 1 − P(A) = 1 − 0,3 = 0,7'},
  ],
  physik: [
    {topic:'Elektrischer Stromkreis',diff:1,question:'Ohmsches Gesetz: R = 10 Ω, U = 5 V. Stromstärke I?',options:['I = 0,5 A','I = 2 A','I = 50 A','I = 0,1 A'],correct:0,explanation:'I = U / R = 5 V / 10 Ω = 0,5 A'},
    {topic:'Elektrischer Stromkreis',diff:1,question:'Reihenschaltung: R₁ = 4 Ω, R₂ = 6 Ω. Gesamtwiderstand?',options:['2,4 Ω','24 Ω','10 Ω','5 Ω'],correct:2,explanation:'Reihenschaltung: R_ges = R₁ + R₂ = 4 + 6 = 10 Ω'},
    {topic:'Elektrischer Stromkreis',diff:2,question:'U = 230 V, I = 2 A. Elektrische Leistung P?',options:['115 W','460 W','232 W','228 W'],correct:1,explanation:'P = U × I = 230 V × 2 A = 460 W'},
    {topic:'Elektrischer Stromkreis',diff:2,question:'Parallelschaltung: R₁ = 6 Ω, R₂ = 3 Ω. Gesamtwiderstand?',options:['2 Ω','9 Ω','18 Ω','4,5 Ω'],correct:0,explanation:'1/R_ges = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 → R_ges = 2 Ω'},
    {topic:'Elektrischer Stromkreis',diff:1,question:'Einheit der elektrischen Spannung?',options:['Ampere','Watt','Ohm','Volt'],correct:3,explanation:'Spannung wird in Volt (V) gemessen'},
    {topic:'Elektrischer Stromkreis',diff:1,question:'Welcher Schaltungstyp hat denselben Strom durch alle Bauteile?',options:['Parallelschaltung','Reihenschaltung','Wechselschaltung','Brückenschaltung'],correct:1,explanation:'In der Reihenschaltung fließt derselbe Strom durch alle Bauteile'},
    {topic:'Elektrischer Stromkreis',diff:2,question:'Widerstand verdoppelt sich, Spannung bleibt konstant. Was passiert mit I?',options:['I verdoppelt sich','I bleibt gleich','I halbiert sich','I vervierfacht sich'],correct:2,explanation:'I = U/R: wenn R verdoppelt wird, halbiert sich I'},
    {topic:'Mechanik',diff:1,question:'Gleichförmige Bewegung: v = 10 m/s, t = 5 s. Weg s?',options:['2 m','15 m','50 m','25 m'],correct:2,explanation:'s = v × t = 10 m/s × 5 s = 50 m'},
    {topic:'Mechanik',diff:1,question:'Masse 5 kg, g = 10 m/s². Gewichtskraft F_G?',options:['5 N','15 N','50 N','500 N'],correct:2,explanation:'F_G = m × g = 5 kg × 10 m/s² = 50 N'},
    {topic:'Mechanik',diff:2,question:'Newton 2. Gesetz: m = 2 kg, a = 3 m/s². Kraft F?',options:['1,5 N','5 N','6 N','9 N'],correct:2,explanation:'F = m × a = 2 kg × 3 m/s² = 6 N'},
    {topic:'Mechanik',diff:2,question:'Geschwindigkeit ändert sich von 0 auf 20 m/s in 4 s. Beschleunigung a?',options:['2 m/s²','4 m/s²','5 m/s²','80 m/s²'],correct:2,explanation:'a = Δv / t = 20 m/s / 4 s = 5 m/s²'},
    {topic:'Mechanik',diff:1,question:'Einheit der elektrischen Leistung?',options:['Volt','Ampere','Watt','Ohm'],correct:2,explanation:'Leistung wird in Watt (W) gemessen'},
    {topic:'Energie',diff:2,question:'Potenzielle Energie: m = 2 kg, g = 10 m/s², h = 20 m. E_pot?',options:['200 J','40 J','400 J','4.000 J'],correct:2,explanation:'E_pot = m × g × h = 2 × 10 × 20 = 400 J'},
    {topic:'Energie',diff:1,question:'Was ist der Unterschied zwischen Masse und Gewichtskraft?',options:['Kein Unterschied','Masse in kg – Gewichtskraft in N','Masse in N – Gewichtskraft in kg','Beide in Newton'],correct:1,explanation:'Masse (kg) ist eine Eigenschaft des Körpers; Gewichtskraft (N) wirkt durch Gravitation'},
    {topic:'Optik & Wellen',diff:1,question:'Was passiert mit Licht, wenn es von Luft in Wasser übergeht?',options:['Es wird schneller','Es wird langsamer und bricht sich','Es bleibt unverändert','Es wird reflektiert'],correct:1,explanation:'Licht wird in einem dichteren Medium (Wasser) langsamer und bricht sich (Brechungsgesetz)'},
  ]
};

// ============================================================
// ABITUR-AUFGABENBANK
// ============================================================
const ABI_BANK = {
  mathe: [
    // === Kurvendiskussion / Analysis ===
    {topic:'Kurvendiskussion',diff:2,question:'f(x) = x³ − 3x. Wo liegt die lokale Minimalstelle?',options:['x = −1','x = 0','x = 1','x = 3'],correct:2,explanation:'f\'(x) = 3x²−3 = 0 → x = ±1; f\'\'(x) = 6x; f\'\'(1) = 6 > 0 → Minimum bei x = 1'},
    {topic:'Kurvendiskussion',diff:1,question:'Was ist die Ableitung von f(x) = 4x³ − 2x² + 5x?',options:['12x² − 4x + 5','12x³ − 4x + 5','4x² − 2x + 5','12x² − 2x + 5'],correct:0,explanation:'Potenzregel: f\'(x) = 12x² − 4x + 5'},
    {topic:'Kurvendiskussion',diff:2,question:'Wo hat f(x) = x³ − 6x² + 9x einen Wendepunkt?',options:['x = 1','x = 2','x = 3','x = 4'],correct:1,explanation:'f\'\'(x) = 6x − 12 = 0 → x = 2 ist Wendepunkt'},
    {topic:'Kurvendiskussion',diff:1,question:'Was bedeutet f\'\'(x₀) < 0 bei einer kritischen Stelle x₀?',options:['Wendepunkt','Lokales Minimum','Lokales Maximum','Sattelpunkt'],correct:2,explanation:'Negative zweite Ableitung an kritischer Stelle → lokales Maximum'},
    {topic:'Kurvendiskussion',diff:1,question:'Die Ableitung von f(x) = e^x ist:',options:['xe^(x−1)','e^(x−1)','e^x','e^(2x)'],correct:2,explanation:'Die e-Funktion ist ihre eigene Ableitung: f\'(x) = e^x'},
    {topic:'Kurvendiskussion',diff:1,question:'Für welches x hat f(x) = −x² + 4x − 1 sein Maximum?',options:['x = 1','x = 2','x = 4','x = −2'],correct:1,explanation:'f\'(x) = −2x + 4 = 0 → x = 2'},
    {topic:'Kurvendiskussion',diff:1,question:'Die Ableitung von f(x) = ln(x) ist:',options:['x · ln(x)','ln(x)/x','1/x','e^x'],correct:2,explanation:'f\'(x) = 1/x für x > 0'},
    {topic:'Kurvendiskussion',diff:3,question:'f(x) = x⁴ − 4x². Wo liegen die lokalen Minima?',options:['x = ±√2','x = ±2','x = 0','x = ±1'],correct:0,explanation:'f\'(x) = 4x³ − 8x = 0 → x = 0, ±√2; f\'\'(±√2) > 0 → Minima bei x = ±√2'},
    // === Integralrechnung ===
    {topic:'Integralrechnung',diff:2,question:'Berechne: ∫₀² (2x + 1) dx',options:['4','5','6','7'],correct:2,explanation:'[x² + x]₀² = (4+2) − 0 = 6'},
    {topic:'Integralrechnung',diff:1,question:'Was ist die allgemeine Stammfunktion von f(x) = 3x²?',options:['F(x) = x³','F(x) = x³ + C','F(x) = 6x + C','F(x) = 3x³ + C'],correct:1,explanation:'∫3x² dx = x³ + C'},
    {topic:'Integralrechnung',diff:2,question:'Berechne: ∫₁³ 2x dx',options:['4','6','8','9'],correct:2,explanation:'[x²]₁³ = 9 − 1 = 8'},
    {topic:'Integralrechnung',diff:1,question:'Was berechnet ein bestimmtes Integral geometrisch?',options:['Die Steigung der Kurve','Den orientierten Flächeninhalt zwischen Kurve und x-Achse','Den Umfang der Fläche','Den Hochpunkt der Kurve'],correct:1,explanation:'Das bestimmte Integral ∫ₐᵇ f(x)dx gibt den orientierten Flächeninhalt an'},
    {topic:'Integralrechnung',diff:2,question:'Stammfunktion von f(x) = 4x³ − 6x?',options:['x⁴ − 3x² + C','4x⁴ − 3x² + C','x⁴ − 6x² + C','12x² − 6 + C'],correct:0,explanation:'∫(4x³ − 6x) dx = x⁴ − 3x² + C'},
    {topic:'Integralrechnung',diff:3,question:'Berechne die Fläche zwischen f(x) = x² und der x-Achse von x=0 bis x=3.',options:['6','9','12','27'],correct:1,explanation:'∫₀³ x² dx = [x³/3]₀³ = 27/3 = 9'},
    // === Analytische Geometrie ===
    {topic:'Analytische Geometrie',diff:1,question:'Betrag des Vektors v⃗ = (3, 4)?',options:['3','4','5','7'],correct:2,explanation:'|v⃗| = √(3²+4²) = √(9+16) = √25 = 5'},
    {topic:'Analytische Geometrie',diff:2,question:'Skalarprodukt von a⃗ = (1, 2, 3) und b⃗ = (4, 0, −1)?',options:['0','1','3','7'],correct:1,explanation:'a⃗·b⃗ = 1·4 + 2·0 + 3·(−1) = 4 − 3 = 1'},
    {topic:'Analytische Geometrie',diff:1,question:'Wann sind zwei Vektoren orthogonal?',options:['Wenn |a⃗| = |b⃗|','Wenn a⃗·b⃗ = 0','Wenn a⃗ × b⃗ = 0','Wenn a⃗ = −b⃗'],correct:1,explanation:'Zwei Vektoren sind orthogonal (senkrecht), wenn ihr Skalarprodukt = 0'},
    {topic:'Analytische Geometrie',diff:2,question:'Die Ebene 2x + 3y − z = 6 hat den Normalenvektor:',options:['(6,6,−6)','(2,3,−1)','(1,1,1)','(2,3,1)'],correct:1,explanation:'Der Normalenvektor einer Ebene ax+by+cz=d ist n⃗=(a,b,c)=(2,3,−1)'},
    {topic:'Analytische Geometrie',diff:2,question:'Abstand des Punktes P(1|2|3) vom Ursprung?',options:['√6','√10','√14','√24'],correct:2,explanation:'d = √(1²+2²+3²) = √(1+4+9) = √14'},
    // === Logarithmen & Exponentialfunktionen ===
    {topic:'Logarithmen & Exponential',diff:1,question:'Was ist log₂(8)?',options:['2','3','4','8'],correct:1,explanation:'2³ = 8 → log₂(8) = 3'},
    {topic:'Logarithmen & Exponential',diff:1,question:'Vereinfache: ln(e³)',options:['e³','3e','3','1/3'],correct:2,explanation:'ln und e^x sind Umkehrfunktionen → ln(e³) = 3'},
    {topic:'Logarithmen & Exponential',diff:1,question:'Löse: 2^x = 16',options:['x = 2','x = 3','x = 4','x = 8'],correct:2,explanation:'2⁴ = 16 → x = 4'},
    {topic:'Logarithmen & Exponential',diff:2,question:'Ableitung von f(x) = e^(2x)?',options:['e^(2x)','2e^(2x)','2xe^(2x−1)','2e^x'],correct:1,explanation:'Kettenregel: f\'(x) = 2 · e^(2x)'},
    {topic:'Logarithmen & Exponential',diff:1,question:'Für welchen x-Wert gilt: e^x = 1?',options:['x = −1','x = 0','x = 1','x = e'],correct:1,explanation:'e⁰ = 1 → x = 0'},
    {topic:'Logarithmen & Exponential',diff:1,question:'Was ist ln(1)?',options:['0','1','e','−1'],correct:0,explanation:'e⁰ = 1 → ln(1) = 0'},
    // === Stochastik ===
    {topic:'Stochastik',diff:2,question:'Binomialverteilung B(100; 0,5). Erwartungswert μ?',options:['25','50','75','100'],correct:1,explanation:'μ = n · p = 100 · 0,5 = 50'},
    {topic:'Stochastik',diff:2,question:'Standardabweichung von B(100; 0,5)?',options:['2,5','5','10','25'],correct:1,explanation:'σ = √(n·p·(1−p)) = √(100·0,5·0,5) = √25 = 5'},
    {topic:'Stochastik',diff:1,question:'Erwartungswert einer Binomialverteilung B(n, p)?',options:['μ = n + p','μ = n · p','μ = n / p','μ = p·(1−p)'],correct:1,explanation:'Erwartungswert: μ = n · p'},
    {topic:'Stochastik',diff:2,question:'In einem Hypothesentest mit α = 5 % wird H₀ abgelehnt, wenn:',options:['Das Ergebnis unmöglich ist','P(X ≤ k) < 0,05 unter H₀','Der Mittelwert > 0 ist','Die Stichprobe groß genug ist'],correct:1,explanation:'H₀ wird abgelehnt, wenn die Wahrscheinlichkeit des Ergebnisses unter H₀ kleiner als α ist'},
    {topic:'Stochastik',diff:1,question:'Bei der Normalverteilung N(μ, σ²) liegen ca. 68% der Werte in:',options:['[μ−σ, μ+σ]','[μ−2σ, μ+2σ]','[μ−3σ, μ+3σ]','[0, μ]'],correct:0,explanation:'68-95-99,7-Regel: 68% der Werte liegen im ±1σ-Intervall um den Mittelwert'},
  ],
  physik: [
    // === Quantenphysik ===
    {topic:'Quantenphysik',diff:1,question:'Was besagt der Photoeffekt (Einstein)?',options:['Licht ist eine reine Welle','Licht überträgt Energie nur in diskreten Paketen (Photonen)','Elektronen können nicht aus Metall gelöst werden','Licht bewegt sich mit Schallgeschwindigkeit'],correct:1,explanation:'Licht trifft als Photon auf Elektronen; Energie E = h·f muss größer als Austrittsarbeit sein'},
    {topic:'Quantenphysik',diff:1,question:'Energie eines Photons mit Frequenz f?',options:['E = m · c','E = h · f','E = h / f','E = f / h'],correct:1,explanation:'Planck\'sche Beziehung: E = h · f (h = Plancksches Wirkungsquantum)'},
    {topic:'Quantenphysik',diff:1,question:'Was ist der Welle-Teilchen-Dualismus?',options:['Licht ist immer ein Teilchen','Licht ist immer eine Welle','Licht zeigt je nach Versuch Wellen- oder Teilcheneigenschaften','Teilchen bewegen sich immer in Wellen'],correct:2,explanation:'Licht (und Materie) zeigen je nach Experiment Wellen- oder Teilcheneigenschaften'},
    {topic:'Quantenphysik',diff:2,question:'de-Broglie-Wellenlänge eines Teilchens mit Impuls p?',options:['λ = h · p','λ = p / h','λ = h / p','λ = m · v · h'],correct:2,explanation:'λ = h / p = h / (m·v) — jedes Teilchen hat eine zugehörige Wellenlänge'},
    {topic:'Quantenphysik',diff:2,question:'Was gibt die Grenzfrequenz f_G beim Photoeffekt an?',options:['Frequenz des schnellsten Elektrons','Minimale Frequenz zum Auslösen von Elektronen','Maximale Frequenz des Lichts','Frequenz im Metall'],correct:1,explanation:'Unterhalb von f_G ist h·f < W_A (Austrittsarbeit) → keine Elektronen werden ausgelöst'},
    // === Spezielle Relativitätstheorie ===
    {topic:'Relativitätstheorie',diff:1,question:'Was besagt Einsteins 2. Postulat?',options:['Alle Bewegungen sind relativ','Lichtgeschwindigkeit c ist in allen Inertialsystemen gleich','Masse und Energie sind nicht äquivalent','Zeit verläuft überall gleich schnell'],correct:1,explanation:'c ≈ 3×10⁸ m/s ist konstant in allen Inertialsystemen — unabhängig von der Bewegung der Quelle'},
    {topic:'Relativitätstheorie',diff:1,question:'Was beschreibt die Zeitdilatation?',options:['Eine bewegte Uhr geht schneller','Eine bewegte Uhr geht langsamer','Uhren gehen immer gleich schnell','Zeit kann nicht gemessen werden'],correct:1,explanation:'Bewegte Uhren gehen langsamer: Δt = γ·Δt₀ (γ > 1 für v > 0)'},
    {topic:'Relativitätstheorie',diff:1,question:'Massenenergie-Äquivalenz: E = ?',options:['E = m · c','E = m · c²','E = m / c²','E = c² / m'],correct:1,explanation:'E = m · c² (Einstein 1905) — Masse und Energie sind äquivalent'},
    {topic:'Relativitätstheorie',diff:1,question:'Was passiert mit der Länge eines schnell bewegten Objekts?',options:['Es wird länger','Es bleibt gleich','Es wird kürzer (Längenkontraktion)','Es dreht sich'],correct:2,explanation:'In Bewegungsrichtung erscheint das Objekt kürzer: L = L₀/γ'},
    // === Elektromagnetismus / Induktion ===
    {topic:'Elektromagnetismus',diff:1,question:'Was besagt das Induktionsgesetz (Faraday)?',options:['Strom erzeugt ein Magnetfeld','Zeitliche Änderung des Magnetflusses induziert eine Spannung','Kondensatoren speichern Ladung','Spulen haben keinen Widerstand'],correct:1,explanation:'U_ind = −dΦ/dt — jede Änderung des magnetischen Flusses induziert eine Spannung'},
    {topic:'Elektromagnetismus',diff:2,question:'Transformator: 100 Primär-, 200 Sekundärwindungen, U₁ = 230 V. U₂ = ?',options:['115 V','230 V','460 V','920 V'],correct:2,explanation:'U₂/U₁ = N₂/N₁ → U₂ = 230 · (200/100) = 460 V'},
    {topic:'Elektromagnetismus',diff:1,question:'Was ist der Hall-Effekt?',options:['Wärmeentwicklung bei Stromfluss','Querspannung bei Strom im Magnetfeld','Magnetisierung von Eisen','Reflexion von Licht am Metall'],correct:1,explanation:'Ladungsträger im Magnetfeld werden abgelenkt → messbare Querspannung (Hall-Spannung)'},
    {topic:'Elektromagnetismus',diff:2,question:'Energie in einem Kondensator mit Kapazität C und Spannung U?',options:['E = C · U','E = C · U²','E = ½ · C · U²','E = U / C'],correct:2,explanation:'E = ½ · C · U² — Energie eines geladenen Kondensators'},
    // === Schwingungen und Wellen ===
    {topic:'Schwingungen & Wellen',diff:2,question:'Periodendauer des Fadenpendels der Länge l (g = Erdbeschleunigung)?',options:['T = 2π·√(g/l)','T = 2π·√(l/g)','T = √(l/g)','T = 2π·l/g'],correct:1,explanation:'T = 2π·√(l/g) — hängt nur von Länge und Erdbeschleunigung ab, nicht von der Masse'},
    {topic:'Schwingungen & Wellen',diff:1,question:'Was passiert bei konstruktiver Interferenz zweier Wellen?',options:['Sie löschen sich aus','Ihre Amplituden addieren sich','Eine Welle verschwindet','Sie werden langsamer'],correct:1,explanation:'Konstruktive Interferenz: Wellenberg trifft Wellenberg → maximale Überlagerung'},
    {topic:'Schwingungen & Wellen',diff:1,question:'Beziehung zwischen Frequenz f, Wellenlänge λ und Ausbreitungsgeschwindigkeit c?',options:['c = f + λ','c = f / λ','c = f · λ','c = λ / f'],correct:2,explanation:'c = f · λ — Grundformel der Wellenlehre'},
    {topic:'Schwingungen & Wellen',diff:1,question:'Stehende Wellen entstehen durch:',options:['Eine einzelne Welle mit hoher Amplitude','Zwei entgegengesetzt laufende Wellen gleicher Frequenz','Eine Welle, die auf sich selbst trifft','Zwei Wellen gleicher Richtung'],correct:1,explanation:'Überlagerung von hin- und rücklaufender Welle gleicher Frequenz ergibt stehende Welle'},
    {topic:'Schwingungen & Wellen',diff:2,question:'Die Energie einer Schwingung ist proportional zu:',options:['Der Amplitude','Der Amplitude²','Der Frequenz','Der Periodendauer'],correct:1,explanation:'E ∝ A² — die Energie wächst quadratisch mit der Amplitude'},
  ]
};

function _zapBankPick(subjectId, count, maxDiff, mode) {
  const bank = mode === 'abitur' ? ABI_BANK : ZAP_BANK;
  const pool = (bank[subjectId] || []).filter(q => q.diff <= maxDiff);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ── PRÜFUNGSMODUS ────────────────────────────────────────────
function renderExamPrep() {
  showView('viewExamPrep');
  setExamMode(state.examMode);

  const grid = document.getElementById('examSubjectBtns');
  if (!grid) return;
  grid.innerHTML = '';

  const bank       = state.examMode === 'abitur' ? ABI_BANK : ZAP_BANK;
  const topicHints = {
    mathe: state.examMode === 'abitur'
      ? 'Kurvendiskussion · Integral · Analytische Geometrie · Logarithmen · Stochastik'
      : 'Terme & Gleichungen · Lineare & Quadratische Funktionen · Pythagoras · Trigonometrie · Prozentrechnung · Statistik · Wahrscheinlichkeit',
    physik: state.examMode === 'abitur'
      ? 'Quantenphysik · Relativitätstheorie · Elektromagnetismus · Schwingungen & Wellen'
      : 'Elektrischer Stromkreis · Mechanik · Energie · Optik & Wellen',
  };

  [{ id:'mathe', name:'Mathematik', icon:'🔢', color:'#7C3AED' },
   { id:'physik', name:'Physik',      icon:'⚡', color:'#0369A1' }
  ].forEach(s => {
    const count = (bank[s.id] || []).length;
    const card  = document.createElement('div');
    card.className = 'exam-subj-card';
    card.style.setProperty('--sc', s.color);
    card.innerHTML = `
      <div class="esc-top">
        <span class="esc-icon">${s.icon}</span>
        <div class="esc-info">
          <div class="esc-name">${s.name}</div>
          <div class="esc-count">${count} Aufgaben im Pool</div>
        </div>
      </div>
      <div class="esc-topics">${topicHints[s.id] || ''}</div>
      <button class="esc-start" onclick="state.examSubjectId='${s.id}';startExamSession()">▶ Jetzt starten</button>`;
    grid.appendChild(card);
  });

  ['examSession','examResults'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
  document.getElementById('examSetup')?.classList.remove('hidden');

  // Preload Browser-KI silently while user picks settings
  if (_baiStatus === 'idle') _baiLoad().catch(() => {});
  _renderBaiStatusBadge();
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

  state.examSession = { questions:[], current:0, score:0, answers:[] };
  _examRunning = true;

  // ── Aufgabenbank: sofort, kein Internet / KI nötig ──────────
  if (state.examMode === 'zap' || state.examMode === 'abitur') {
    const maxDiff = state.examDiff || 2;
    const bankQs  = _zapBankPick(state.examSubjectId, 5, maxDiff, state.examMode);
    if (bankQs.length >= 5) {
      state.examSession.questions = bankQs;
      _examRunning = false;
      _showExamQ(0);
      return;
    }
  }

  if (card) card.innerHTML = '<div class="exam-loading">⏳ KI bereitet Aufgaben vor…</div>';

  const gradeNum = state.gradeId ? state.gradeId.replace('klasse','') : '10';
  const subjName = state.gradeId
    ? CONTENT[state.gradeId]?.subjects.find(s => s.id === state.examSubjectId)?.name || state.examSubjectId
    : state.examSubjectId;
  const modeText = state.examMode === 'zap'
    ? 'ZAP-Abschlussprüfung (Klasse 10, Deutschland)'
    : 'Abitur (gymnasiale Oberstufe, Deutschland)';
  const diffMap  = { 1:'einfach', 2:'mittelschwer', 3:'schwer' };
  const diff     = diffMap[state.examDiff] || 'mittelschwer';

  const prompt = `Erstelle genau 5 ${diff}e Multiple-Choice-Fragen für das Schulfach ${subjName}, Klasse ${gradeNum}, im Stil einer ${modeText}.
Jede Frage hat genau 4 Antwortmöglichkeiten. Der Wert "correct" ist der Index (0-3) der richtigen Antwort.
Antworte NUR mit einem JSON-Objekt, kein erklärender Text davor oder danach:
{"questions":[{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."},{"question":"...","options":["...","...","...","..."],"correct":1,"explanation":"..."},{"question":"...","options":["...","...","...","..."],"correct":2,"explanation":"..."},{"question":"...","options":["...","...","...","..."],"correct":0,"explanation":"..."},{"question":"...","options":["...","...","...","..."],"correct":3,"explanation":"..."}]}`;

  const sysMsgs = [
    { role: 'system', content: 'Du bist ein Prüfungsersteller für deutsche Schulen. Antworte IMMER ausschließlich mit einem JSON-Objekt mit einem "questions"-Array. Kein Text außerhalb des JSON.' },
    { role: 'user', content: prompt }
  ];

  try {
    let raw = null;

    // ── Browser-KI (kein API-Key, offline) ──────────────────
    if (_baiStatus !== 'failed') {
      try {
        if (_baiStatus !== 'ready') {
          _baiProgCb = (pct) => {
            if (!card) return;
            card.innerHTML = `
              <div class="exam-loading bai-dl-screen">
                <div class="bai-dl-icon">🧠</div>
                <div class="bai-dl-title">Browser-KI wird geladen</div>
                <div class="bai-dl-sub">Einmalig ~300 MB · danach immer offline nutzbar</div>
                <div class="bai-bar-wrap"><div class="bai-bar-fill" style="width:${pct}%"></div></div>
                <div class="bai-dl-pct">${pct}%</div>
              </div>`;
          };
        }
        raw = await _baiAsk(sysMsgs, { max_tokens: 1500, temperature: 0.65 });
        _baiProgCb = null;
        if (card) card.innerHTML = '<div class="exam-loading">⚙️ Aufgaben werden aufbereitet…</div>';
      } catch (e) {
        _baiProgCb = null;
        console.warn('[BrowserAI] Fallback zu Online-KI:', e.message);
        raw = null;
      }
    }

    // ── Online-Fallback (Groq etc.) ──────────────────────────
    if (!raw) {
      if (card) card.innerHTML = '<div class="exam-loading">⏳ Herr Lala bereitet 5 Aufgaben vor…</div>';
      raw = await _aiCall(sysMsgs, { max_tokens: 2000, temperature: 0.65, response_format: { type: 'json_object' } });
    }

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
    ${q.topic ? `<div class="exam-q-topic">📌 ${q.topic}</div>` : ''}
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

  // ── Sitzung in Verlauf speichern ─────────────────────────────
  const topicStats = {};
  questions.forEach((q, i) => {
    const t = q.topic || 'Allgemein';
    if (!topicStats[t]) topicStats[t] = { correct:0, total:0 };
    topicStats[t].total++;
    if (answers[i]?.chosen === answers[i]?.correct) topicStats[t].correct++;
  });
  const hist = JSON.parse(localStorage.getItem('ls_exam_history') || '[]');
  hist.push({ mode: state.examMode||'zap', subject: state.examSubjectId||'mathe',
               score, total, pct, topics: topicStats, ts: Date.now() });
  if (hist.length > 100) hist.splice(0, hist.length - 100);
  localStorage.setItem('ls_exam_history', JSON.stringify(hist));

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

  const name    = state.userName || 'Anonym';
  const goalLbl = { normal:'Allgemeines Lernen', zap:'ZAP-Vorbereitung', abitur:'Abitur-Vorbereitung' };
  const userInfo = document.getElementById('analyseUserInfo');
  if (userInfo) userInfo.innerHTML =
    `<span class="an-name">👤 ${name}</span> <span class="an-goal">${goalLbl[state.learningGoal]||'Lernen'}</span>`;

  // ── Daten sammeln ────────────────────────────────────────────
  const quizEntries = Object.entries(state.progress); // {key: pct}
  const examHist    = JSON.parse(localStorage.getItem('ls_exam_history') || '[]');

  const grid    = document.getElementById('analyseGrid');
  const weakBox = document.getElementById('analyseWeaknesses');
  const aiEl    = document.getElementById('analyseAiText');

  if (!quizEntries.length && !examHist.length) {
    if (grid)    grid.innerHTML    = '<p class="an-empty">Noch keine Aufgaben gelöst. Starte jetzt und komm dann wieder!</p>';
    if (weakBox) weakBox.innerHTML = '';
    if (aiEl)    aiEl.textContent  = 'Keine Daten vorhanden. Löse ein paar Aufgaben!';
    return;
  }

  // ── Fach-Aggregat (Quiz + Prüfungen zusammen) ────────────────
  const subjData = {}; // { mathe: { scores:[], sessions:0, modes:{zap:0,abitur:0} }, physik:... }
  const modeData = {}; // { zap: { scores:[], subjects:{} }, abitur:... }

  // Quiz-Daten
  quizEntries.forEach(([k, pct]) => {
    const s = k.split('_')[1] || 'allgemein';
    if (!subjData[s]) subjData[s] = { scores:[], sessions:0, modes:{} };
    subjData[s].scores.push(pct);
  });

  // Prüfungs-Daten
  examHist.forEach(e => {
    const s = e.subject || 'mathe';
    const m = e.mode    || 'zap';
    if (!subjData[s]) subjData[s] = { scores:[], sessions:0, modes:{} };
    subjData[s].scores.push(e.pct);
    subjData[s].sessions++;
    subjData[s].modes[m] = (subjData[s].modes[m]||0) + 1;
    if (!modeData[m]) modeData[m] = { scores:[], subjects:{} };
    modeData[m].scores.push(e.pct);
    modeData[m].subjects[s] = (modeData[m].subjects[s]||0) + 1;
  });

  // Themen-Aggregat aus Prüfungs-Verlauf
  const topicAgg = {}; // { 'Wahrscheinlichkeit': { correct:0, total:0 } }
  examHist.forEach(e => {
    Object.entries(e.topics || {}).forEach(([t, v]) => {
      if (!topicAgg[t]) topicAgg[t] = { correct:0, total:0 };
      topicAgg[t].correct += v.correct;
      topicAgg[t].total   += v.total;
    });
  });

  const totalExercises  = quizEntries.length;
  const totalExamSess   = examHist.length;
  const allScores       = [...quizEntries.map(([,v])=>v), ...examHist.map(e=>e.pct)];
  const avgAll          = allScores.length ? Math.round(allScores.reduce((a,b)=>a+b,0)/allScores.length) : 0;

  // ── Statistik-Karten ─────────────────────────────────────────
  if (!grid) return;
  grid.innerHTML = '';

  function makeCard(icon, val, lbl, sub, color) {
    const d = document.createElement('div');
    d.className = 'an-card';
    d.innerHTML = `<div class="an-icon">${icon}</div>
      <div class="an-val" style="color:${color||'var(--primary)'}">${val}</div>
      <div class="an-lbl">${lbl}</div>
      <div class="an-avg">${sub}</div>
      ${typeof val==='number'&&val<=100?`<div class="an-bar-wrap"><div class="an-bar" style="width:${val}%;background:${color||'var(--primary)'}"></div></div>`:''}`;
    return d;
  }

  // Gesamt
  grid.appendChild(makeCard('📊', totalExercises+totalExamSess, 'Aufgaben gesamt',
    `${totalExercises} Lernaufg. · ${totalExamSess} Prüfungssitzungen`, '#6D28D9'));

  // Pro Fach
  const fachMeta = { mathe:{icon:'🔢',name:'Mathematik',color:'#7C3AED'}, physik:{icon:'⚡',name:'Physik',color:'#0369A1'} };
  Object.entries(subjData).forEach(([s, d]) => {
    if (!d.scores.length) return;
    const avg  = Math.round(d.scores.reduce((a,b)=>a+b,0)/d.scores.length);
    const col  = avg>=80?'#059669':avg>=60?'#D97706':'#DC2626';
    const lbl  = avg>=80?'🟢 Stark':avg>=60?'🟡 Mittel':'🔴 Mehr üben';
    const meta = fachMeta[s]||{icon:'📚',name:s,color:'#555'};
    const modeStr = Object.entries(d.modes).map(([m,c])=>`${m==='zap'?'ZAP':'Abitur'}: ${c}×`).join(' · ');
    grid.appendChild(makeCard(meta.icon, avg+'%', meta.name,
      `${lbl} · ${d.scores.length} Aufg.${modeStr?' · '+modeStr:''}`, col));
  });

  // Pro Prüfungsmodus
  Object.entries(modeData).forEach(([m, d]) => {
    if (!d.scores.length) return;
    const avg = Math.round(d.scores.reduce((a,b)=>a+b,0)/d.scores.length);
    const col = avg>=80?'#059669':avg>=60?'#D97706':'#DC2626';
    const sub = Object.entries(d.subjects).map(([s,c])=>`${s==='mathe'?'Mathe':'Physik'} ${c}×`).join(' · ');
    grid.appendChild(makeCard(m==='zap'?'🎯':'🏆', avg+'%', m==='zap'?'ZAP-Vorbereitung':'Abitur-Vorbereitung',
      `${d.scores.length} Sitzungen · ${sub}`, col));
  });

  // ── Themen-Analyse ───────────────────────────────────────────
  const topicEntries = Object.entries(topicAgg)
    .map(([t,v]) => ({ t, pct: Math.round(v.correct/v.total*100), total: v.total }))
    .sort((a,b) => a.pct - b.pct);

  const weakTopics   = topicEntries.filter(e => e.pct < 60);
  const strongTopics = topicEntries.filter(e => e.pct >= 80);

  if (weakBox) {
    let html = '';
    if (weakTopics.length) {
      html += `<h3 class="an-weak-title">⚠️ Diese Themen brauchst du noch Übung</h3>
        <div class="an-weak-list">${weakTopics.map(e =>
          `<div class="an-weak-item">
            <span>📌 ${e.t}</span>
            <div class="an-topic-bar-wrap"><div class="an-topic-bar" style="width:${e.pct}%;background:#DC2626"></div></div>
            <span class="an-weak-score" style="color:#DC2626">${e.pct}%</span>
          </div>`).join('')}</div>`;
    }
    if (strongTopics.length) {
      html += `<h3 class="an-weak-title" style="margin-top:16px">✅ Stärken</h3>
        <div class="an-weak-list">${strongTopics.map(e =>
          `<div class="an-weak-item">
            <span>⭐ ${e.t}</span>
            <div class="an-topic-bar-wrap"><div class="an-topic-bar" style="width:${e.pct}%;background:#059669"></div></div>
            <span class="an-weak-score" style="color:#059669">${e.pct}%</span>
          </div>`).join('')}</div>`;
    }
    if (!html) html = '<div class="an-strong">🎉 Noch keine Prüfungssitzungen – starte jetzt!</div>';
    weakBox.innerHTML = html;
  }

  // ── Letzten 5 Sitzungen ──────────────────────────────────────
  if (examHist.length) {
    const recentEl = document.createElement('div');
    recentEl.className = 'an-recent';
    recentEl.innerHTML = `<h3 class="an-weak-title" style="margin-bottom:8px">🕐 Letzte Prüfungssitzungen</h3>`
      + examHist.slice(-5).reverse().map(e => {
        const d   = new Date(e.ts);
        const dt  = d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}) + ' ' + d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
        const col = e.pct>=80?'#059669':e.pct>=60?'#D97706':'#DC2626';
        return `<div class="an-recent-row">
          <span class="an-recent-mode">${e.mode==='zap'?'🎯 ZAP':'🏆 Abitur'}</span>
          <span class="an-recent-sub">${e.subject==='mathe'?'🔢 Mathe':'⚡ Physik'}</span>
          <span class="an-recent-score" style="color:${col}">${e.score}/${e.total} (${e.pct}%)</span>
          <span class="an-recent-dt">${dt}</span>
        </div>`;
      }).join('');
    weakBox.parentNode?.insertBefore(recentEl, weakBox);
  }

  // ── Analyse-Text (lokal, kein API nötig) ─────────────────────
  if (aiEl) aiEl.textContent = _buildAnalysisText(name, totalExercises, totalExamSess, avgAll, subjData, weakTopics, strongTopics);
}

function _buildAnalysisText(name, quizN, examN, avgAll, subjData, weak, strong) {
  if (!quizN && !examN) return `Hallo ${name}! Starte jetzt mit einer Aufgabe – ich bin gespannt wie du abschneidest!`;

  const parts = [];
  parts.push(`Hallo ${name}! Du hast insgesamt ${quizN+examN} Aufgaben absolviert${examN?` (davon ${examN} Prüfungssitzungen)`:''} mit einem Ø von ${avgAll}%.`);

  // Fachbewertung
  const mathD  = subjData['mathe'];
  const physD  = subjData['physik'];
  if (mathD && physD) {
    const ma = Math.round(mathD.scores.reduce((a,b)=>a+b,0)/mathD.scores.length);
    const ph = Math.round(physD.scores.reduce((a,b)=>a+b,0)/physD.scores.length);
    if (Math.abs(ma-ph) >= 15)
      parts.push(`In ${ma>ph?'Mathematik':'Physik'} bist du deutlich stärker (${Math.max(ma,ph)}%) – in ${ma>ph?'Physik':'Mathematik'} (${Math.min(ma,ph)}%) gibt es noch Luft nach oben.`);
  }

  // Themen
  if (strong.length)
    parts.push(`Besonders stark: ${strong.slice(0,2).map(e=>e.t).join(' und ')}. 🌟`);
  if (weak.length)
    parts.push(`Fokussiere dich jetzt auf: ${weak.slice(0,2).map(e=>e.t).join(' und ')} – dort gibt es am meisten zu holen!`);
  else if (examN > 0)
    parts.push('Alle geübten Themen sind stark – weiter so!');

  // Motivations-Tipp
  if (avgAll >= 80)      parts.push('🏆 Ausgezeichnete Leistung – du bist gut auf die Prüfung vorbereitet!');
  else if (avgAll >= 60) parts.push('💡 Du bist auf dem richtigen Weg! Noch ein paar Übungen und du bist ready!');
  else                   parts.push('💪 Nicht aufgeben! Starte mit "Einfach" und steigere dich dann schrittweise.');

  return parts.join(' ');
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
  updateSidebarGrades();
  checkOnboarding();

  // Letzte Seite wiederherstellen (außer beim Onboarding)
  if (state.onboardingDone) {
    try {
      const saved = JSON.parse(localStorage.getItem('ls_lastNav') || 'null');
      if (saved?.view && saved.view !== 'home') {
        navigate(saved.view, saved.gradeId, saved.subjectId);
        return;
      }
    } catch (_) {}
  }
  navigate('home');
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
  } else if (expId === 'federkraft') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🌀 Experiment: Federkraft</h3>
        <canvas id="fedCanvas" width="460" height="200" style="width:100%;border-radius:8px;display:block"></canvas>
        <div style="padding:8px 16px 4px">
          <div style="background:#f0fdf4;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#15803D;font-weight:700;margin-bottom:4px">Kraft F (0 – 50 N)</div>
            <input type="range" id="fedFSlider" min="0" max="50" step="1" value="20"
              oninput="_fedSetF(this.value)" style="width:100%;accent-color:#16A34A">
            <div style="text-align:center;font-weight:800;font-size:1rem;color:#15803D"><span id="fedFLabel">20</span> N</div>
          </div>
        </div>
        <div class="sim-info-row" style="margin-top:6px">
          <span>F = <b id="fedFVal">20</b> N</span>
          <span>x = <b id="fedXVal">2,0</b> cm</span>
          <span>k = <b>10</b> N/cm</span>
        </div>
        <div class="sim-btn-row"><button class="sim-btn" onclick="_fedMeasure()">📍 Messen</button></div>
        <div class="sim-diagram-label">F-x Diagramm (Hookesches Gesetz)</div>
        <canvas id="fedChart" class="sim-chart-canvas" width="460" height="200"></canvas>
        <div id="fedResult" class="sim-result"></div>
        <p class="sim-hint" style="text-align:center;margin:4px 0 6px">Klicke auf <b>zwei Messpunkte</b> im Diagramm um die Steigung zu berechnen! &nbsp;|&nbsp; Formel: <b>F = k · x</b></p>
        <table class="sim-table" id="fedTable" style="display:none">
          <thead><tr><th>Dehnung x (cm)</th><th>Kraft F (N)</th></tr></thead>
          <tbody id="fedTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simFederkraft();
    const fedChartEl = document.getElementById('fedChart');
    if (fedChartEl) fedChartEl.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });
  } else if (expId === 'hebelgesetz') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">⚖️ Experiment: Hebelgesetz</h3>
        <canvas id="hebCanvas" width="460" height="200" style="width:100%;border-radius:8px;display:block"></canvas>
        <div style="padding:8px 16px 4px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:#fef9c3;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#854D0E;font-weight:700;margin-bottom:4px">Last F₂ (10–100 N)</div>
            <input type="range" id="hebF2Slider" min="10" max="100" step="1" value="50"
              oninput="_hebSet('f2',this.value)" style="width:100%;accent-color:#CA8A04">
            <div style="text-align:center;font-weight:800;color:#854D0E"><span id="hebF2Label">50</span> N</div>
          </div>
          <div style="background:#fff7ed;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#9A3412;font-weight:700;margin-bottom:4px">Lastarm l₂ (0,5–3 m)</div>
            <input type="range" id="hebL2Slider" min="0.5" max="3" step="0.1" value="1.5"
              oninput="_hebSet('l2',this.value)" style="width:100%;accent-color:#EA580C">
            <div style="text-align:center;font-weight:800;color:#9A3412"><span id="hebL2Label">1,5</span> m</div>
          </div>
        </div>
        <div class="sim-info-row" style="margin-top:6px">
          <span>F₁ = <b id="hebF1Val">37,5</b> N</span>
          <span>l₁ = <b>2,0</b> m</span>
          <span id="hebBalance" style="font-weight:700;color:#15803D">✓ Gleichgewicht</span>
        </div>
        <div class="sim-btn-row"><button class="sim-btn" onclick="_hebMeasure()">📍 Messen</button></div>
        <div class="sim-diagram-label">Drehmoment-Diagramm (M₁ vs M₂)</div>
        <canvas id="hebChart" class="sim-chart-canvas" width="460" height="180"></canvas>
        <table class="sim-table" id="hebTable" style="display:none">
          <thead><tr><th>Kraft F (N)</th><th>Abstand d (m)</th><th>Moment M (N·m)</th></tr></thead>
          <tbody id="hebTbody"></tbody>
        </table>
        <p class="sim-hint" style="text-align:center;margin:4px 0 6px">Formel: <b>F₁ · l₁ = F₂ · l₂</b></p>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simHebelgesetz();
  } else if (expId === 'ohmsches-gesetz') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">⚡ Experiment: Ohmsches Gesetz</h3>
        <canvas id="ohmCanvas" width="460" height="200" style="width:100%;border-radius:8px;display:block"></canvas>
        <div style="padding:8px 16px 4px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:#fef2f2;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#991B1B;font-weight:700;margin-bottom:4px">Spannung U (1–12 V)</div>
            <input type="range" id="ohmUSlider" min="1" max="12" step="0.5" value="6"
              oninput="_ohmSet('u',this.value)" style="width:100%;accent-color:#DC2626">
            <div style="text-align:center;font-weight:800;color:#991B1B"><span id="ohmULabel">6</span> V</div>
          </div>
          <div style="background:#f0f9ff;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#0369A1;font-weight:700;margin-bottom:4px">Widerstand R (10–100 Ω)</div>
            <input type="range" id="ohmRSlider" min="10" max="100" step="5" value="30"
              oninput="_ohmSet('r',this.value)" style="width:100%;accent-color:#0EA5E9">
            <div style="text-align:center;font-weight:800;color:#0369A1"><span id="ohmRLabel">30</span> Ω</div>
          </div>
        </div>
        <div class="sim-info-row" style="margin-top:6px">
          <span>U = <b id="ohmUVal">6</b> V</span>
          <span>I = <b id="ohmIVal">0,20</b> A</span>
          <span>P = <b id="ohmPVal">1,20</b> W</span>
        </div>
        <p class="sim-hint" style="text-align:center;margin:4px 0 6px">Formel: <b>I = U / R</b> &nbsp;|&nbsp; P = U² / R</p>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simOhm();
  } else if (expId === 'reihenschaltung') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🔌 Experiment: Reihen- und Parallelschaltung</h3>
        <canvas id="schCanvas" width="460" height="200" style="width:100%;border-radius:8px;display:block"></canvas>
        <div style="padding:8px 16px 4px;text-align:center">
          <button class="sim-btn primary" id="schBtnReihe" onclick="_schSetMode('reihe')">Reihenschaltung</button>
          <button class="sim-btn" id="schBtnParallel" onclick="_schSetMode('parallel')">Parallelschaltung</button>
        </div>
        <div class="sim-info-row" style="margin-top:6px">
          <span>R₁=30 Ω &nbsp; R₂=60 Ω</span>
          <span>R<sub>ges</sub> = <b id="schRges">90</b> Ω</span>
          <span>I<sub>ges</sub> = <b id="schIges">0,13</b> A</span>
        </div>
        <div id="schDetails" style="text-align:center;font-size:.88rem;color:#374151;padding:2px 0 6px"></div>
        <p class="sim-hint" style="text-align:center;margin:2px 0 6px">Reihe: <b>R = R₁+R₂</b> &nbsp;|&nbsp; Parallel: <b>1/R = 1/R₁ + 1/R₂</b></p>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simSchaltung();
  } else if (expId === 'beschleunigung') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🚗 Experiment: Gleichmäßig beschleunigte Bewegung</h3>
        <canvas id="beschAnim" class="sim-road-canvas" width="700" height="130"></canvas>
        <div class="sim-info-row">
          <span>⏱ Zeit: <b id="beschTVal">0,0 s</b></span>
          <span>🚀 v: <b id="beschVVal">0,0 m/s</b></span>
          <span>📏 Weg: <b id="beschSVal">0,0 m</b></span>
          <span>Beschleunigung:
            <select id="beschASelect" onchange="_beschSetA(this.value)">
              <option value="1">1 m/s² (langsam)</option>
              <option value="2">2 m/s²</option>
              <option value="3" selected>3 m/s² (mittel)</option>
              <option value="5">5 m/s² (schnell)</option>
            </select>
          </span>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="beschPlayBtn" onclick="_beschToggle()">▶ Start</button>
          <button class="sim-btn" onclick="_simMeasure()">📍 Jetzt messen</button>
          <button class="sim-btn" onclick="_beschReset()">↺ Neu starten</button>
          <a class="sim-btn" href="arbeitsblaetter/AB_1.3_Beschleunigte_Bewegung.pdf" download style="text-decoration:none">📄 Arbeitsblatt</a>
        </div>
        <p class="sim-hint">Drücke mehrmals auf <b>Jetzt messen</b> während das Auto fährt – die Punkte erscheinen in allen Diagrammen. Klicke dann im <b>v-t Diagramm</b> auf <b>zwei Punkte</b> um die Steigung (= Beschleunigung a = Δv/Δt) zu berechnen!</p>
        <div class="sim-diagram-label">s-t Diagramm <span style="font-weight:400;font-size:.82em;color:#7c3aed">(Parabel – s = ½·a·t²)</span></div>
        <canvas id="beschCST" class="sim-chart-canvas" width="680" height="290"></canvas>
        <div id="beschResult" class="sim-result"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div>
            <div class="sim-diagram-label">v-t Diagramm <span style="font-weight:400;font-size:.8em;color:#64748B">(zwei Punkte anklicken → Steigung = Beschleunigung a = Δv/Δt)</span></div>
            <canvas id="beschChart" class="sim-chart-canvas" width="340" height="200"></canvas>
          </div>
          <div>
            <div class="sim-diagram-label">a-t Diagramm <span style="font-weight:400;font-size:.8em;color:#dc2626">(a = konst. ≠ 0)</span></div>
            <canvas id="beschCAT" class="sim-chart-canvas" width="340" height="200"></canvas>
          </div>
        </div>
        <table class="sim-table" id="beschTable" style="display:none;margin-top:12px">
          <thead><tr><th>Punkt</th><th>Zeit t (s)</th><th>v (m/s)</th><th>s (m)</th><th>a (m/s²)</th></tr></thead>
          <tbody id="beschTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simBeschleunigung();
    const beschChartEl = document.getElementById('beschChart');
    if (beschChartEl) beschChartEl.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });
  } else if (expId === 'freierfall') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🍎 Freier Fall</h3>
        <canvas id="fallAnim" width="460" height="110" style="width:100%;border-radius:8px;display:block;background:#f0f9ff"></canvas>
        <div style="padding:5px 12px 2px;display:flex;gap:10px;align-items:center">
          <div style="flex:1">
            <label style="font-weight:700;font-size:.82rem;color:#9A3412">h₀ = <span id="fallHLabel">20</span> m</label>
            <input type="range" id="fallHSlider" min="5" max="50" step="1" value="20"
              oninput="_fallSetH(this.value)" style="width:100%;accent-color:#EA580C">
          </div>
          <div style="display:flex;gap:6px">
            <button id="fallPlayBtn" onclick="_fallToggle()" style="background:#ea580c;color:#fff;border:none;border-radius:8px;padding:5px 12px;font-weight:700;cursor:pointer;font-size:.82rem">▶ Loslassen</button>
            <button onclick="_fallReset()" style="background:#e5e7eb;color:#374151;border:none;border-radius:8px;padding:5px 12px;font-weight:700;cursor:pointer;font-size:.82rem">↺ Neu</button>
            <a href="arbeitsblaetter/AB_1.4_Freier_Fall.pdf" download style="background:#e5e7eb;color:#374151;border:none;border-radius:8px;padding:5px 12px;font-weight:700;cursor:pointer;font-size:.82rem;text-decoration:none;display:inline-block">📄 Arbeitsblatt</a>
          </div>
        </div>
        <div class="sim-info-row" style="font-size:.8rem">
          <span>⏱ t = <b id="fallTVal">0,0</b> s</span>
          <span>📏 s = <b id="fallSVal">0,0</b> m</span>
          <span>🚀 v = <b id="fallVVal">0,0</b> m/s</span>
          <span>📐 a = <b>9,81</b> m/s²</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;padding:4px 10px">
          <div>
            <div style="text-align:center;font-size:.72rem;font-weight:800;color:#7c3aed;padding:2px 0">s-t Diagramm</div>
            <canvas id="fallCST" width="130" height="100" style="width:100%;border:1.5px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
          <div>
            <div style="text-align:center;font-size:.72rem;font-weight:800;color:#0891b2;padding:2px 0">v-t Diagramm</div>
            <canvas id="fallCVT" width="130" height="100" style="width:100%;border:1.5px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
          <div>
            <div style="text-align:center;font-size:.72rem;font-weight:800;color:#16a34a;padding:2px 0">a-t Diagramm</div>
            <canvas id="fallCAT" width="130" height="100" style="width:100%;border:1.5px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
        </div>
        <p class="sim-hint" style="text-align:center;margin:4px 0 6px;font-size:.78rem"><b>s = ½·g·t²</b> &nbsp;|&nbsp; <b>v = g·t</b> &nbsp;|&nbsp; g = 9,81 m/s²</p>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simFreierFall();
  } else if (expId === 'newton2') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🚀 Raketenstart zum Mond – F = m · a</h3>
        <canvas id="rakCanvas" width="460" height="310" style="width:100%;border-radius:10px;display:block"></canvas>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;padding:6px 10px">
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#f97316">🔥 Schubkraft: <span id="rakFLabel">500</span> N</label>
            <input type="range" id="rakFSlider" min="100" max="2000" step="50" value="500" style="width:100%;accent-color:#f97316"
              oninput="document.getElementById('rakFLabel').textContent=this.value;_rakUpdate()">
          </div>
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#0891b2">⚖️ Masse: <span id="rakMLabel">100</span> kg</label>
            <input type="range" id="rakMSlider" min="20" max="500" step="10" value="100" style="width:100%;accent-color:#0891b2"
              oninput="document.getElementById('rakMLabel').textContent=this.value;_rakUpdate()">
          </div>
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#dc2626">⛽ Treibstoff: <span id="rakTLabel">100</span> %</label>
            <input type="range" id="rakTSlider" min="20" max="200" step="10" value="100" style="width:100%;accent-color:#dc2626"
              oninput="document.getElementById('rakTLabel').textContent=this.value;_rakUpdate()">
          </div>
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#6b21a8">💨 Luftwiderstand: <span id="rakLLabel">1,0</span></label>
            <input type="range" id="rakLSlider" min="0" max="5" step="0.5" value="1" style="width:100%;accent-color:#6b21a8"
              oninput="document.getElementById('rakLLabel').textContent=(+this.value).toFixed(1).replace('.',',');_rakUpdate()">
          </div>
        </div>
        <div class="sim-info-row" style="font-size:.8rem">
          <span>t = <b id="rakT">0,0</b> s</span>
          <span>h = <b id="rakH">0</b> m</span>
          <span>v = <b id="rakV">0,0</b> m/s</span>
          <span>a = <b id="rakA">0,0</b> m/s²</span>
          <span>⛽ <b id="rakFuel">100</b>%</span>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="rakPlayBtn" onclick="_rakToggle()">🚀 Starten!</button>
          <button class="sim-btn" onclick="_rakReset()">↺ Neu</button>
          <a class="sim-btn" href="arbeitsblaetter/AB_2.3_Newton_Raketenstart.pdf" download style="text-decoration:none">📄 Arbeitsblatt</a>
        </div>
        <div id="rakResult" class="sim-result"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px;padding:0 4px">
          <div>
            <div class="sim-diagram-label" style="font-size:.75rem">h-t Diagramm</div>
            <canvas id="rakHChart" width="200" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
          <div>
            <div class="sim-diagram-label" style="font-size:.75rem">v-t Diagramm</div>
            <canvas id="rakVChart" width="200" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
          <div>
            <div class="sim-diagram-label" style="font-size:.75rem">F-t Diagramm</div>
            <canvas id="rakFChart" width="200" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
        </div>
        <p class="sim-hint">Stelle Schubkraft und Masse ein → <b>🚀 Starten!</b> Wenn Treibstoff leer, fliegt die Rakete mit dem gewonnenen Schwung weiter! &nbsp;|&nbsp; <b>F = m · a</b></p>
        <table class="sim-table" id="rakTable" style="display:none;margin-top:8px">
          <thead><tr><th>t (s)</th><th>h (m)</th><th>v (m/s)</th><th>F_net (N)</th></tr></thead>
          <tbody id="rakTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simNewton2();
  } else if (expId === 'energieerhaltung') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🎢 Die verrückte Achterbahn – Energieerhaltung</h3>
        <canvas id="achtCanvas" width="460" height="250" style="width:100%;border-radius:10px;display:block"></canvas>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px 10px;padding:6px 10px">
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#16a34a">⛰️ Starthöhe: <span id="achtHLabel">10</span> m</label>
            <input type="range" id="achtHSlider" min="2" max="20" step="1" value="10" style="width:100%;accent-color:#16a34a"
              oninput="document.getElementById('achtHLabel').textContent=this.value;_achtUpdate()">
          </div>
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#dc2626">🔥 Reibung μ: <span id="achtFrLabel">0,05</span></label>
            <input type="range" id="achtFrSlider" min="0" max="0.3" step="0.01" value="0.05" style="width:100%;accent-color:#dc2626"
              oninput="document.getElementById('achtFrLabel').textContent=(+this.value).toFixed(2).replace('.',',');_achtUpdate()">
          </div>
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#7c3aed">⚖️ Masse: <span id="achtMLabel">5</span> kg</label>
            <input type="range" id="achtMSlider" min="1" max="20" step="1" value="5" style="width:100%;accent-color:#7c3aed"
              oninput="document.getElementById('achtMLabel').textContent=this.value;_achtUpdate()">
          </div>
        </div>
        <div class="sim-info-row" style="font-size:.8rem">
          <span>h = <b id="achtH">10,0</b> m</span>
          <span style="color:#3b82f6">E_kin = <b id="achtEkin">0,0</b> J</span>
          <span style="color:#16a34a">E_pot = <b id="achtEpot">490,5</b> J</span>
          <span>E_ges = <b id="achtEges">490,5</b> J</span>
          <span>v = <b id="achtV">0,0</b> m/s</span>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="achtPlayBtn" onclick="_achtToggle()">▶ Starten!</button>
          <button class="sim-btn" onclick="_achtReset()">↺ Neu</button>
          <a class="sim-btn" href="arbeitsblaetter/AB_3.2_Energieerhaltung_Achterbahn.pdf" download style="text-decoration:none">📄 Arbeitsblatt</a>
        </div>
        <div id="achtResult" class="sim-result"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px;padding:0 4px">
          <div>
            <div class="sim-diagram-label" style="font-size:.75rem">E-t Diagramm</div>
            <canvas id="achtEChart" width="200" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
          <div>
            <div class="sim-diagram-label" style="font-size:.75rem">v-t Diagramm</div>
            <canvas id="achtVChart" width="200" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
          <div>
            <div class="sim-diagram-label" style="font-size:.75rem">h-t Diagramm</div>
            <canvas id="achtHChart" width="200" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
        </div>
        <p class="sim-hint">Stelle Starthöhe und Reibung ein → <b>▶ Starten!</b> Beobachte wie E_kin und E_pot sich wandeln! &nbsp;|&nbsp; <b>E_kin = ½mv²</b> &nbsp;|&nbsp; <b>E_pot = mgh</b></p>
        <table class="sim-table" id="achtTable" style="display:none;margin-top:8px">
          <thead><tr><th>t (s)</th><th>h (m)</th><th>v (m/s)</th><th>E_pot (J)</th><th>E_kin (J)</th></tr></thead>
          <tbody id="achtTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simEnergieerhaltung();
  } else if (expId === 'impuls') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🎱 Experiment: Impulserhaltung bei Stößen</h3>
        <canvas id="impCanvas" width="460" height="200" style="width:100%;border-radius:8px;display:block"></canvas>
        <div style="padding:8px 16px 4px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
          <div style="background:#fef2f2;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#991B1B;font-weight:700;margin-bottom:4px">m₁ (1–5 kg)</div>
            <input type="range" id="impM1Slider" min="1" max="5" step="0.5" value="2"
              oninput="_impSet('m1',this.value)" style="width:100%;accent-color:#DC2626">
            <div style="text-align:center;font-weight:700;color:#991B1B"><span id="impM1Label">2,0</span> kg</div>
          </div>
          <div style="background:#eff6ff;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#1D4ED8;font-weight:700;margin-bottom:4px">v₁ (1–10 m/s)</div>
            <input type="range" id="impV1Slider" min="1" max="10" step="0.5" value="5"
              oninput="_impSet('v1',this.value)" style="width:100%;accent-color:#2563EB">
            <div style="text-align:center;font-weight:700;color:#1D4ED8"><span id="impV1Label">5,0</span> m/s</div>
          </div>
          <div style="background:#f0fdf4;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#15803D;font-weight:700;margin-bottom:4px">m₂ (1–5 kg)</div>
            <input type="range" id="impM2Slider" min="1" max="5" step="0.5" value="2"
              oninput="_impSet('m2',this.value)" style="width:100%;accent-color:#16A34A">
            <div style="text-align:center;font-weight:700;color:#15803D"><span id="impM2Label">2,0</span> kg</div>
          </div>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" onclick="_impStoss()">💥 Stoß!</button>
          <button class="sim-btn" onclick="_impReset()">↺ Neu</button>
        </div>
        <div class="sim-info-row">
          <span>p_vor = <b id="impPvor">10,0</b> kg·m/s</span>
          <span>p_nach = <b id="impPnach">–</b></span>
        </div>
        <div class="sim-diagram-label">p_nach vs p_vor Diagramm (Impulserhaltung)</div>
        <canvas id="impChart" class="sim-chart-canvas" width="460" height="160"></canvas>
        <div id="impResult" class="sim-result"></div>
        <p class="sim-hint" style="text-align:center;margin:2px 0 6px">Mache mehrere Stöße mit verschiedenen Massen → Klicke <b>zwei Punkte</b> im p_nach-vs-p_vor Diagramm um Impulserhaltung zu bestätigen! &nbsp;|&nbsp; Elastischer Stoß: <b>p_ges = const</b></p>
        <table class="sim-table" id="impTable" style="display:none">
          <thead><tr><th>Objekt</th><th>Masse (kg)</th><th>v_vor (m/s)</th><th>v_nach (m/s)</th><th>p (kg·m/s)</th></tr></thead>
          <tbody id="impTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simImpuls();
    const impChartEl = document.getElementById('impChart');
    if (impChartEl) impChartEl.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });
  } else if (expId === 'fadenpendel') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🕰️ Experiment: Fadenpendel</h3>
        <canvas id="penCanvas" width="460" height="220" style="width:100%;border-radius:8px;display:block"></canvas>
        <div style="padding:8px 16px 4px">
          <div style="background:#f5f3ff;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#5B21B6;font-weight:700;margin-bottom:4px">Fadenlänge L (0,2–2,0 m)</div>
            <input type="range" id="penLSlider" min="0.2" max="2.0" step="0.05" value="1.0"
              oninput="_penSetL(this.value)" style="width:100%;accent-color:#7C3AED">
            <div style="text-align:center;font-weight:800;color:#5B21B6"><span id="penLLabel">1,00</span> m</div>
          </div>
        </div>
        <div class="sim-info-row" style="margin-top:6px">
          <span>L = <b id="penLVal">1,00</b> m</span>
          <span>T = <b id="penTVal">2,01</b> s</span>
          <span>θ = <b id="penAngleVal">30</b>°</span>
        </div>
        <div class="sim-btn-row"><button class="sim-btn" onclick="_penMeasure()">📍 Messen</button></div>
        <div class="sim-diagram-label">T-L Diagramm (T = 2π·√(L/g))</div>
        <canvas id="penChart" class="sim-chart-canvas" width="460" height="180"></canvas>
        <div id="penResult" class="sim-result"></div>
        <p class="sim-hint" style="text-align:center;margin:2px 0 6px">Klicke auf <b>zwei Messpunkte</b> im Diagramm um g zu bestimmen! &nbsp;|&nbsp; Formel: <b>T = 2π · √(L/g)</b></p>
        <table class="sim-table" id="penTable" style="display:none">
          <thead><tr><th>L (m)</th><th>T_gemessen (s)</th><th>T_berechnet (s)</th></tr></thead>
          <tbody id="penTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simFadenpendel();
    const penChartEl = document.getElementById('penChart');
    if (penChartEl) penChartEl.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });
  } else if (expId === 'federpendel') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🌀 Experiment: Federpendel</h3>
        <canvas id="fpAnimCanvas" width="460" height="270" style="width:100%;border-radius:10px;display:block"></canvas>
        <div style="padding:8px 16px 4px;display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">
          <div style="background:#eff6ff;border-radius:10px;padding:9px 12px">
            <div style="font-size:.8rem;color:#1D4ED8;font-weight:700;margin-bottom:4px">Masse m (0,2–2,0 kg)</div>
            <input type="range" id="fpMSlider" min="0.2" max="2.0" step="0.1" value="0.5"
              oninput="_fpSetM(this.value)" style="width:100%;accent-color:#2563EB">
            <div style="text-align:center;font-weight:800;color:#1D4ED8"><span id="fpMLabel">0,50</span> kg</div>
          </div>
          <div style="background:#f0fdf4;border-radius:10px;padding:9px 12px">
            <div style="font-size:.8rem;color:#15803D;font-weight:700;margin-bottom:4px">Federkonstante D (5–50 N/m)</div>
            <input type="range" id="fpDSlider" min="5" max="50" step="5" value="20"
              oninput="_fpSetD(this.value)" style="width:100%;accent-color:#16A34A">
            <div style="text-align:center;font-weight:800;color:#15803D"><span id="fpDLabel">20</span> N/m</div>
          </div>
        </div>
        <div class="sim-info-row" style="margin-top:6px">
          <span>m = <b id="fpMVal">0,50</b> kg</span>
          <span>D = <b id="fpDVal">20</b> N/m</span>
          <span>T = <b id="fpTVal">0,99</b> s</span>
          <span>s = <b id="fpSVal">10,0</b> cm</span>
          <span>F = <b id="fpFVal">-2,0</b> N</span>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="fpToggleBtn" onclick="_fpToggle()">▶ Messung starten</button>
          <button class="sim-btn" onclick="_simReset()">↺ Neu starten</button>
        </div>
        <div class="sim-diagram-label">s-t Diagramm – Auslenkung <span style="font-weight:400;font-size:.82em;color:#7c3aed">(s = A·cos(ω·t))</span></div>
        <canvas id="fpSTChart" class="sim-chart-canvas" width="460" height="180"></canvas>
        <div class="sim-diagram-label">v-t Diagramm – Geschwindigkeit <span style="font-weight:400;font-size:.82em;color:#0284C7">(v = −A·ω·sin(ω·t))</span></div>
        <canvas id="fpVTChart" class="sim-chart-canvas" width="460" height="150"></canvas>
        <div id="fpResult" class="sim-result"></div>
        <p class="sim-hint" style="text-align:center;margin:4px 0 6px">Drücke <b>Messung starten</b> → Messwerte werden alle 0,2 s automatisch aufgezeichnet &nbsp;|&nbsp; <b>F = −D·s</b> &nbsp;|&nbsp; <b>T = 2π·√(m/D)</b></p>
        <table class="sim-table" id="fpTable" style="display:none">
          <thead><tr><th>t (s)</th><th>s (cm)</th><th>v (cm/s)</th><th>F (N)</th></tr></thead>
          <tbody id="fpTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simFederpendel();

  } else if (expId === 'wellen') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">〰️ Experiment: Harmonische Wellen</h3>
        <canvas id="welCanvas" width="460" height="180" style="width:100%;border-radius:8px;display:block"></canvas>
        <div style="padding:8px 16px 4px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:#eff6ff;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#1D4ED8;font-weight:700;margin-bottom:4px">Frequenz f (0,5–5 Hz)</div>
            <input type="range" id="welFSlider" min="0.5" max="5" step="0.5" value="2"
              oninput="_welSet('f',this.value)" style="width:100%;accent-color:#2563EB">
            <div style="text-align:center;font-weight:800;color:#1D4ED8"><span id="welFLabel">2,0</span> Hz</div>
          </div>
          <div style="background:#f0fdf4;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#15803D;font-weight:700;margin-bottom:4px">Amplitude A (10–60 px)</div>
            <input type="range" id="welASlider" min="10" max="60" step="2" value="30"
              oninput="_welSet('a',this.value)" style="width:100%;accent-color:#16A34A">
            <div style="text-align:center;font-weight:800;color:#15803D"><span id="welALabel">30</span> px</div>
          </div>
        </div>
        <div class="sim-info-row" style="margin-top:4px">
          <span>f = <b id="welFVal">2,0</b> Hz</span>
          <span>T = <b id="welTVal">0,50</b> s</span>
          <span>λ = <b id="welLamVal">115</b> px</span>
        </div>
        <div class="sim-diagram-label">A(f) Frequenzspektrum</div>
        <canvas id="welChart" class="sim-chart-canvas" width="460" height="160"></canvas>
        <div class="sim-btn-row"><button class="sim-btn" onclick="_simMeasure()">📍 Messen</button></div>
        <div class="sim-diagram-label">λ(T) Messpunkte – Wellengeschwindigkeit</div>
        <canvas id="welChart2" class="sim-chart-canvas" width="460" height="150"></canvas>
        <div id="welResult" class="sim-result"></div>
        <p class="sim-hint" style="text-align:center;margin:2px 0 6px">Ändere f, klicke <b>Messen</b>, dann <b>zwei Punkte</b> im λ(T)-Diagramm → Steigung = v_Welle! &nbsp;|&nbsp; Formel: <b>y(x,t) = A · sin(2π(x/λ − f·t))</b></p>
        <table class="sim-table" id="welTable" style="display:none">
          <thead><tr><th>f (Hz)</th><th>T (s)</th><th>λ (px)</th><th>A (px)</th></tr></thead>
          <tbody id="welTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simWellen();
    const welChart2El = document.getElementById('welChart2');
    if (welChart2El) welChart2El.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });
  } else if (expId === 'gleichfoermig') {
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
          <a class="sim-btn" href="arbeitsblaetter/AB_1.2_Gleichfoermige_Bewegung.pdf" download style="text-decoration:none">📄 Arbeitsblatt</a>
        </div>
        <p class="sim-hint">Drücke mehrmals auf <b>Jetzt messen</b> während das Auto fährt – die Punkte erscheinen im Diagramm. Klicke dann auf <b>zwei Punkte</b> um die Steigung (= Geschwindigkeit) zu berechnen!</p>
        <div class="sim-diagram-label">s-t Diagramm <span style="font-weight:400;font-size:.82em;color:#64748B">(zwei Punkte anklicken → Steigung = Geschwindigkeit)</span></div>
        <canvas id="simChart" class="sim-chart-canvas" width="680" height="290"></canvas>
        <div id="simResult" class="sim-result"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div>
            <div class="sim-diagram-label">v-t Diagramm <span style="font-weight:400;font-size:.8em;color:#0891b2">(v = konst.)</span></div>
            <canvas id="simChartVT" class="sim-chart-canvas" width="340" height="200"></canvas>
          </div>
          <div>
            <div class="sim-diagram-label">a-t Diagramm <span style="font-weight:400;font-size:.8em;color:#16a34a">(a = 0)</span></div>
            <canvas id="simChartAT" class="sim-chart-canvas" width="340" height="200"></canvas>
          </div>
        </div>
        <table class="sim-table" id="simTableWrap" style="display:none;margin-top:12px">
          <thead><tr><th>Punkt</th><th>Zeit t (s)</th><th>Weg s (m)</th><th>v (m/s)</th></tr></thead>
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

  } else if (expId === 'wurfbewegung') {
    modal.innerHTML = `<div class="sim-box sim-box-wide">
      <button class="sim-x" onclick="closeExperiment()">✕</button>
      <h3 class="sim-h3">🏀 Basketballwurf – Schräger Wurf</h3>
      <canvas id="basketCanvas" width="680" height="230" style="width:100%;border-radius:10px;display:block"></canvas>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px 10px;padding:6px 10px">
        <div>
          <label style="font-size:.78rem;font-weight:700;color:#7c3aed">🎯 Winkel α: <span id="basketAlphaL">45</span>°</label>
          <input type="range" id="basketAlpha" min="20" max="80" value="45" style="width:100%;accent-color:#7c3aed"
            oninput="document.getElementById('basketAlphaL').textContent=this.value;_basketUpdate()">
        </div>
        <div>
          <label style="font-size:.78rem;font-weight:700;color:#0891b2">💨 v₀: <span id="basketV0L">8,0</span> m/s</label>
          <input type="range" id="basketV0" min="3" max="15" value="8" step="0.5" style="width:100%;accent-color:#0891b2"
            oninput="document.getElementById('basketV0L').textContent=(+this.value).toFixed(1).replace('.',',');_basketUpdate()">
        </div>
        <div>
          <label style="font-size:.78rem;font-weight:700;color:#dc2626">🌍 g: <span id="basketGL">9,8</span> m/s²</label>
          <input type="range" id="basketG" min="1" max="20" value="9.81" step="0.1" style="width:100%;accent-color:#dc2626"
            oninput="document.getElementById('basketGL').textContent=(+this.value).toFixed(1).replace('.',',');_basketUpdate()">
        </div>
        <div>
          <label style="font-size:.78rem;font-weight:700;color:#059669">📏 Abwurfhöhe h₀: <span id="basketH0L">1,5</span> m</label>
          <input type="range" id="basketH0" min="0.5" max="2.5" value="1.5" step="0.1" style="width:100%;accent-color:#059669"
            oninput="document.getElementById('basketH0L').textContent=(+this.value).toFixed(1).replace('.',',');_basketUpdate()">
        </div>
        <div>
          <label style="font-size:.78rem;font-weight:700;color:#d97706">🏀 Korbhöhe hK: <span id="basketHKL">3,0</span> m</label>
          <input type="range" id="basketHK" min="2" max="4" value="3.05" step="0.05" style="width:100%;accent-color:#d97706"
            oninput="document.getElementById('basketHKL').textContent=(+this.value).toFixed(1).replace('.',',');_basketUpdate()">
        </div>
        <div>
          <label style="font-size:.78rem;font-weight:700;color:#6b21a8">↔️ Entfernung d: <span id="basketDL">5,0</span> m</label>
          <input type="range" id="basketD" min="2" max="10" value="5" step="0.5" style="width:100%;accent-color:#6b21a8"
            oninput="document.getElementById('basketDL').textContent=(+this.value).toFixed(1).replace('.',',');_basketUpdate()">
        </div>
      </div>
      <div class="sim-info-row" style="font-size:.8rem">
        <span>t = <b id="basketT">0,00</b> s</span>
        <span>x = <b id="basketX">0,00</b> m</span>
        <span>y = <b id="basketY">0,00</b> m</span>
        <span>v = <b id="basketV">0,00</b> m/s</span>
        <span>a = <b id="basketA">9,81</b> m/s²</span>
      </div>
      <div class="sim-btn-row">
        <button class="sim-btn primary" id="basketPlayBtn" onclick="_basketToggle()">▶ Werfen!</button>
        <button class="sim-btn" onclick="_basketReset()">↺ Neu</button>
        <a class="sim-btn" href="arbeitsblaetter/AB_1.5_Wurfbewegungen.pdf" download style="text-decoration:none">📄 Arbeitsblatt</a>
      </div>
      <div id="basketResult" class="sim-result"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:4px 10px;margin-top:4px">
        <div>
          <div class="sim-diagram-label" style="font-size:.75rem">x-t Diagramm (x = vx·t)</div>
          <canvas id="basketXT" width="320" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
        </div>
        <div>
          <div class="sim-diagram-label" style="font-size:.75rem">y-t Diagramm (Parabel)</div>
          <canvas id="basketYT" width="320" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
        </div>
        <div>
          <div class="sim-diagram-label" style="font-size:.75rem">v-t Diagramm</div>
          <canvas id="basketVT" width="320" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
        </div>
        <div>
          <div class="sim-diagram-label" style="font-size:.75rem">a-t Diagramm (a = g = konst.)</div>
          <canvas id="basketAT" width="320" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
        </div>
      </div>
      <div class="sim-diagram-label" style="margin-top:4px">Flugbahn y(x) – Parabel-Trajektorie</div>
      <canvas id="basketTraj" class="sim-chart-canvas" width="680" height="160"></canvas>
      <p class="sim-hint" style="margin-top:6px">Stelle Winkel und Geschwindigkeit ein → klicke <b>▶ Werfen!</b> und beobachte ob der Ball den Korb trifft! Die Diagramme zeigen alle Bewegungsgrößen.</p>
      <table class="sim-table" id="basketTable" style="display:none;margin-top:8px">
        <thead><tr><th>t (s)</th><th>x (m)</th><th>y (m)</th><th>v (m/s)</th><th>a (m/s²)</th></tr></thead>
        <tbody id="basketTbody"></tbody>
      </table>
    </div>`;
    document.body.appendChild(modal);
    _sim = _simWurf();

  } else if (expId === 'kreisbewegung') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🎡 Das Mega-Karussell – Zentripetalkraft F = m·ω²·r</h3>
        <canvas id="kreiCanvas" width="460" height="260" style="width:100%;border-radius:10px;display:block"></canvas>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px 10px;padding:6px 10px">
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#7c3aed">📏 Radius: <span id="kreiRLabel">2,0</span> m</label>
            <input type="range" id="kreiRSlider" min="1" max="5" step="0.5" value="2" style="width:100%;accent-color:#7c3aed"
              oninput="document.getElementById('kreiRLabel').textContent=(+this.value).toFixed(1).replace('.',',');_kreiUpdate()">
          </div>
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#0891b2">⚖️ Masse: <span id="kreiMLabel">50</span> kg</label>
            <input type="range" id="kreiMSlider" min="10" max="200" step="10" value="50" style="width:100%;accent-color:#0891b2"
              oninput="document.getElementById('kreiMLabel').textContent=this.value;_kreiUpdate()">
          </div>
          <div>
            <label style="font-size:.78rem;font-weight:700;color:#16a34a">🔄 Drehzahl: <span id="kreiOmLabel">2,0</span> rad/s</label>
            <input type="range" id="kreiOmSlider" min="0.5" max="5" step="0.5" value="2" style="width:100%;accent-color:#16a34a"
              oninput="document.getElementById('kreiOmLabel').textContent=(+this.value).toFixed(1).replace('.',',');_kreiUpdate()">
          </div>
        </div>
        <div class="sim-info-row" style="font-size:.8rem">
          <span>ω = <b id="kreiOmDisp">2,0</b> rad/s</span>
          <span>v = <b id="kreiVDisp">4,0</b> m/s</span>
          <span>F_z = <b id="kreiFzDisp">800</b> N</span>
          <span>T = <b id="kreiTDisp">3,14</b> s</span>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="kreiPlayBtn" onclick="_kreiToggle()">▶ Starten</button>
          <button class="sim-btn" style="background:#dc2626;color:#fff;border-color:#dc2626" onclick="_kreiSchnur()">💥 Schnur reißt!</button>
          <button class="sim-btn" onclick="_kreiReset()">↺ Neu</button>
          <a class="sim-btn" href="arbeitsblaetter/AB_1.6_Kreisbewegung.pdf" download style="text-decoration:none">📄 Arbeitsblatt</a>
        </div>
        <div id="kreiResult" class="sim-result"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px;padding:0 4px">
          <div>
            <div class="sim-diagram-label" style="font-size:.75rem">F_z-t Diagramm</div>
            <canvas id="kreiFChart" width="200" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
          <div>
            <div class="sim-diagram-label" style="font-size:.75rem">v-t Diagramm</div>
            <canvas id="kreiVChart" width="200" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
          <div>
            <div class="sim-diagram-label" style="font-size:.75rem">F_z-r Diagramm</div>
            <canvas id="kreiRChart" width="200" height="120" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;background:#fff"></canvas>
          </div>
        </div>
        <p class="sim-hint">Ändere Radius oder Drehzahl → beobachte wie F_z steigt! Drücke <b>💥 Schnur reißt!</b> wenn die Kraft zu groß wird! &nbsp;|&nbsp; <b>F = m·ω²·r</b></p>
        <table class="sim-table" id="kreiTable" style="display:none;margin-top:8px">
          <thead><tr><th>t (s)</th><th>ω (rad/s)</th><th>v (m/s)</th><th>F_z (N)</th></tr></thead>
          <tbody id="kreiTbody"></tbody>
        </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simKreis();

  } else if (expId === 'zentripetalkraft') {
    modal.innerHTML = `<div class="sim-box">
      <button class="sim-x" onclick="closeExperiment()">✕</button>
      <h3 class="sim-h3">🌀 Zentripetalkraft F = m·v²/r</h3>
      <canvas id="zentriCanvas" width="460" height="220" style="width:100%;border-radius:8px;display:block"></canvas>
      <div style="padding:8px 16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div><label style="font-weight:700;font-size:.85rem">Masse m: <span id="zentriMLabel">1</span> kg</label>
          <input type="range" id="zentriMSlider" min="1" max="5" value="1" style="width:100%;accent-color:#7c3aed"
            oninput="document.getElementById('zentriMLabel').textContent=this.value"></div>
        <div><label style="font-weight:700;font-size:.85rem">Radius r: <span id="zentriRLabel">1</span> m</label>
          <input type="range" id="zentriRSlider" min="1" max="5" value="1" step="0.5" style="width:100%;accent-color:#0891b2"
            oninput="document.getElementById('zentriRLabel').textContent=this.value"></div>
        <div><label style="font-weight:700;font-size:.85rem">Geschw. v: <span id="zentriVLabel">3</span> m/s</label>
          <input type="range" id="zentriVSlider" min="1" max="10" value="3" step="0.5" style="width:100%;accent-color:#16a34a"
            oninput="document.getElementById('zentriVLabel').textContent=this.value"></div>
      </div>
      <div class="sim-info-row" style="font-size:.82rem">
        <span>m = <b id="zentriMDisp">1</b> kg</span>
        <span>r = <b id="zentriRDisp">1</b> m</span>
        <span>v = <b id="zentriVDisp">3</b> m/s</span>
        <span>F_z = <b id="zentrFDisp">9,00</b> N</span>
      </div>
      <div class="sim-btn-row"><button class="sim-btn" onclick="_zentriMeasure()">📍 Messen</button></div>
      <div class="sim-diagram-label">F–v² Diagramm (F = m/r · v²)</div>
      <canvas id="zentriChart" class="sim-chart-canvas" width="460" height="160"></canvas>
      <div id="zentriResult" class="sim-result"></div>
      <p class="sim-hint" style="text-align:center;margin:2px 0 6px">Klicke auf <b>zwei Messpunkte</b> im Diagramm um m/r zu bestimmen! &nbsp;|&nbsp; Formel: <b>F = m/r · v²</b></p>
      <table class="sim-table" id="zentriTable" style="display:none">
        <thead><tr><th>m (kg)</th><th>r (m)</th><th>v² (m²/s²)</th><th>F_z (N)</th></tr></thead>
        <tbody id="zentriTbody"></tbody>
      </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simZentripetal();
    const zentriChartEl = document.getElementById('zentriChart');
    if (zentriChartEl) zentriChartEl.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });

  } else if (expId === 'schwingung') {
    modal.innerHTML = `<div class="sim-box">
      <button class="sim-x" onclick="closeExperiment()">✕</button>
      <h3 class="sim-h3">〰️ Harmonische Schwingung</h3>
      <canvas id="schwingCanvas" width="460" height="200" style="width:100%;border-radius:8px;display:block"></canvas>
      <div style="padding:8px 16px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div><label style="font-weight:700;font-size:.85rem">Amplitude A: <span id="schwingALabel">50</span></label>
          <input type="range" id="schwingASlider" min="10" max="80" value="50" style="width:100%;accent-color:#7c3aed"
            oninput="document.getElementById('schwingALabel').textContent=this.value"></div>
        <div><label style="font-weight:700;font-size:.85rem">Frequenz f: <span id="schwingFLabel">1</span> Hz</label>
          <input type="range" id="schwingFSlider" min="1" max="5" value="1" style="width:100%;accent-color:#0891b2"
            oninput="document.getElementById('schwingFLabel').textContent=this.value"></div>
      </div>
      <div class="sim-info-row" style="font-size:.82rem">
        <span>t = <b id="schwingTDisp">0,00</b> s</span>
        <span>x = <b id="schwingXDisp">0</b></span>
        <span>v = <b id="schwingVDisp">0</b></span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:4px 10px">
        <div>
          <div class="sim-diagram-label" style="font-size:.75rem">x(t) Diagramm</div>
          <canvas id="schwingChartX" class="sim-chart-canvas" width="220" height="130"></canvas>
        </div>
        <div>
          <div class="sim-diagram-label" style="font-size:.75rem">v(t) Diagramm</div>
          <canvas id="schwingChartV" class="sim-chart-canvas" width="220" height="130"></canvas>
        </div>
      </div>
      <div class="sim-btn-row"><button class="sim-btn" onclick="_simMeasure()">📍 Messen</button></div>
      <div id="schwingResult" class="sim-result"></div>
      <p class="sim-hint" style="text-align:center;margin:2px 0 4px">Klicke <b>Messen</b> während der Schwingung, dann <b>zwei Punkte</b> im x(t)-Diagramm wählen → Periode T ermitteln!</p>
      <table class="sim-table" id="schwingTable" style="display:none">
        <thead><tr><th>t (s)</th><th>x (px)</th><th>v (px/s)</th></tr></thead>
        <tbody id="schwingTbody"></tbody>
      </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simSchwingung();
    const schwingChartXEl = document.getElementById('schwingChartX');
    if (schwingChartXEl) schwingChartXEl.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });

  } else if (expId === 'efeld') {
    modal.innerHTML = `<div class="sim-box">
      <button class="sim-x" onclick="closeExperiment()">✕</button>
      <h3 class="sim-h3">⚡ Elektrisches Feld – Feldlinien</h3>
      <canvas id="efeldCanvas" width="460" height="220" style="width:100%;border-radius:8px;display:block"></canvas>
      <div style="padding:8px 16px">
        <label style="font-weight:700;font-size:.85rem">Spannung U: <span id="efeldULabel">100</span> V</label>
        <input type="range" id="efeldUSlider" min="10" max="300" value="100" style="width:100%;accent-color:#7c3aed"
          oninput="document.getElementById('efeldULabel').textContent=this.value">
        <div style="font-size:.82rem;color:#6b7280;margin-top:4px">Klicke ins Feld um eine Probeladung zu platzieren</div>
      </div>
      <div class="sim-info-row" style="font-size:.82rem">
        <span>U = <b id="efeldUDisp">100</b> V</span>
        <span>d = 0,3 m</span>
        <span>E = <b id="efeldEDisp">333</b> V/m</span>
      </div>
      <div class="sim-btn-row"><button class="sim-btn" onclick="_simMeasure()">📍 Messen</button></div>
      <div id="efeldResult" class="sim-result"></div>
      <p class="sim-hint" style="text-align:center;margin:2px 0 4px">Klicke <b>Messen</b> bei verschiedenen Spannungen, dann <b>zwei Punkte</b> im E(U)-Diagramm → Steigung = 1/d!</p>
      <div class="sim-diagram-label">E(U) Diagramm (E = U/d)</div>
      <canvas id="efeldChart" class="sim-chart-canvas" width="460" height="160"></canvas>
      <table class="sim-table" id="efeldTable" style="display:none">
        <thead><tr><th>U (V)</th><th>d (m)</th><th>E (V/m)</th></tr></thead>
        <tbody id="efeldTbody"></tbody>
      </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simEfeld();
    const efeldChartEl = document.getElementById('efeldChart');
    if (efeldChartEl) efeldChartEl.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });

  } else if (expId === 'bfeld') {
    modal.innerHTML = `<div class="sim-box">
      <button class="sim-x" onclick="closeExperiment()">✕</button>
      <h3 class="sim-h3">🧲 Magnetisches Feld – Feldlinien</h3>
      <canvas id="bfeldCanvas" width="460" height="220" style="width:100%;border-radius:8px;display:block"></canvas>
      <div style="padding:8px 16px">
        <label style="font-weight:700;font-size:.85rem">Stromstärke I: <span id="bfeldILabel">5</span> A</label>
        <input type="range" id="bfeldISlider" min="1" max="20" value="5" style="width:100%;accent-color:#7c3aed"
          oninput="document.getElementById('bfeldILabel').textContent=this.value">
        <label style="font-weight:700;font-size:.85rem;margin-top:6px;display:block">Geschwindigkeit v: <span id="bfeldVLabel">2</span> m/s (Probeladung q=1C, B=0,01T)</label>
        <input type="range" id="bfeldVSlider" min="0" max="10" value="2" step="0.5" style="width:100%;accent-color:#0891b2"
          oninput="document.getElementById('bfeldVLabel').textContent=this.value">
      </div>
      <div class="sim-info-row" style="font-size:.82rem">
        <span>B ∝ <b id="bfeldBDisp">0,01</b> T</span>
        <span>v = <b id="bfeldVDisp">2,0</b> m/s</span>
        <span>F = <b id="bfeldFDisp">0,02</b> N</span>
      </div>
      <div class="sim-btn-row"><button class="sim-btn" onclick="_simMeasure()">📍 Messen</button></div>
      <div id="bfeldResult" class="sim-result"></div>
      <p class="sim-hint" style="text-align:center;margin:2px 0 4px">Klicke <b>Messen</b> bei verschiedenen Geschwindigkeiten, dann <b>zwei Punkte</b> im F(v)-Diagramm → Steigung = q·B!</p>
      <div class="sim-diagram-label">F(v) Diagramm (F = q·v·B)</div>
      <canvas id="bfeldChart" class="sim-chart-canvas" width="460" height="160"></canvas>
      <table class="sim-table" id="bfeldTable" style="display:none">
        <thead><tr><th>B (T)</th><th>v (m/s)</th><th>F (N)</th></tr></thead>
        <tbody id="bfeldTbody"></tbody>
      </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simBfeld();
    const bfeldChartEl = document.getElementById('bfeldChart');
    if (bfeldChartEl) bfeldChartEl.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });

  } else if (expId === 'leistung') {
    modal.innerHTML = `<div class="sim-box">
      <button class="sim-x" onclick="closeExperiment()">✕</button>
      <h3 class="sim-h3">⚙️ Leistung & Wirkungsgrad</h3>
      <canvas id="leistCanvas" width="460" height="180" style="width:100%;border-radius:8px;display:block"></canvas>
      <div style="padding:8px 16px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div><label style="font-weight:700;font-size:.85rem">Spannung U: <span id="leistULabel">12</span> V</label>
          <input type="range" id="leistUSlider" min="1" max="24" value="12" style="width:100%;accent-color:#7c3aed"
            oninput="document.getElementById('leistULabel').textContent=this.value"></div>
        <div><label style="font-weight:700;font-size:.85rem">Strom I: <span id="leistILabel">2</span> A</label>
          <input type="range" id="leistISlider" min="0.1" max="10" value="2" step="0.1" style="width:100%;accent-color:#0891b2"
            oninput="document.getElementById('leistILabel').textContent=this.value"></div>
      </div>
      <div class="sim-info-row" style="font-size:.82rem">
        <span>U = <b id="leistUDisp">12</b> V</span>
        <span>I = <b id="leistIDisp">2,0</b> A</span>
        <span>P = <b id="leistPDisp">24,0</b> W</span>
        <span>R = <b id="leistRDisp">6,0</b> Ω</span>
      </div>
      <div class="sim-btn-row"><button class="sim-btn" onclick="_simMeasure()">📍 Messen</button></div>
      <div id="leistResult" class="sim-result"></div>
      <p class="sim-hint" style="text-align:center;margin:2px 0 4px">Klicke <b>Messen</b> bei verschiedenen Stromstärken (U=const), dann <b>zwei Punkte</b> im P(I)-Diagramm → Steigung = U!</p>
      <div class="sim-diagram-label">P(I) Diagramm (P = U·I)</div>
      <canvas id="leistChart" class="sim-chart-canvas" width="460" height="160"></canvas>
      <table class="sim-table" id="leistTable" style="display:none">
        <thead><tr><th>U (V)</th><th>I (A)</th><th>P (W)</th><th>R (Ω)</th></tr></thead>
        <tbody id="leistTbody"></tbody>
      </table>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simLeistung();
    const leistChartEl = document.getElementById('leistChart');
    if (leistChartEl) leistChartEl.addEventListener('click', function(e) {
      if (!_sim) return;
      const r = this.getBoundingClientRect();
      if (_sim.handleClick) _sim.handleClick(
        (e.clientX - r.left) * (this.width / r.width),
        (e.clientY - r.top)  * (this.height / r.height)
      );
    });

  } else if (expId === 'kondensator') {
    modal.innerHTML = `
      <div class="sim-box">
        <button class="sim-x" onclick="closeExperiment()">✕</button>
        <h3 class="sim-h3">🔋 Experiment: Kondensator laden / entladen</h3>
        <canvas id="kondCanvas" width="460" height="200" style="width:100%;border-radius:8px;display:block"></canvas>
        <div style="padding:8px 16px 4px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:#fef9c3;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#854D0E;font-weight:700;margin-bottom:4px">Kapazität C (100–1000 µF)</div>
            <input type="range" id="kondCSlider" min="100" max="1000" step="50" value="500"
              oninput="_kondSet('c',this.value)" style="width:100%;accent-color:#CA8A04">
            <div style="text-align:center;font-weight:800;color:#854D0E"><span id="kondCLabel">500</span> µF</div>
          </div>
          <div style="background:#fef2f2;border-radius:8px;padding:8px 10px">
            <div style="font-size:.82rem;color:#991B1B;font-weight:700;margin-bottom:4px">Widerstand R (100–1000 Ω)</div>
            <input type="range" id="kondRSlider" min="100" max="1000" step="50" value="500"
              oninput="_kondSet('r',this.value)" style="width:100%;accent-color:#DC2626">
            <div style="text-align:center;font-weight:800;color:#991B1B"><span id="kondRLabel">500</span> Ω</div>
          </div>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="kondLadenBtn" onclick="_kondSetMode('laden')">⬆ Laden</button>
          <button class="sim-btn" id="kondEntladenBtn" onclick="_kondSetMode('entladen')">⬇ Entladen</button>
          <button class="sim-btn" onclick="_kondReset()">↺ Neu</button>
        </div>
        <div class="sim-info-row">
          <span>τ = <b id="kondTauVal">0,25</b> s</span>
          <span>U_C = <b id="kondUVal">0,0</b> V</span>
          <span><b id="kondPctVal">0</b>% geladen</span>
        </div>
        <p class="sim-hint" style="text-align:center;margin:2px 0 6px"><b>U(t) = U₀·(1−e^(−t/τ))</b> &nbsp;|&nbsp; τ = R·C</p>
      </div>`;
    document.body.appendChild(modal);
    _sim = _simKondensator();
  } else if (typeof openPhysicsSim === 'function') {
    openPhysicsSim(expId);
    return;
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
          <a class="sim-btn" href="arbeitsblaetter/AB_1.2_Gleichfoermige_Bewegung.pdf" download style="text-decoration:none">📄 Arbeitsblatt</a>
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

// ── Gleichförmige Bewegung – mit live s-t / v-t / a-t Diagrammen ──────────
function _simGleichfoermig() {
  const cvA  = document.getElementById('gfAnim');
  const ctA  = cvA.getContext('2d');
  const cvST = document.getElementById('gfCST'), ctST = cvST.getContext('2d');
  const cvVT = document.getElementById('gfCVT'), ctVT = cvVT.getContext('2d');
  const cvAT = document.getElementById('gfCAT'), ctAT = cvAT.getContext('2d');

  let t = 0, s = 0, roadOff = 0, pts = [], lastTs = null, raf;

  // ── Hilfsfunktion: ein Diagramm zeichnen ──────────────────
  function drawDiagram(ctx, cv, data, color, yLabel, yMin, yMax, tMax) {
    const W = cv.width, H = cv.height;
    const pL=34, pB=18, pT=8, pR=6;
    const iW = W-pL-pR, iH = H-pT-pB;

    ctx.clearRect(0,0,W,H);
    // Hintergrund
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#f8fafc'); bg.addColorStop(1,'#ffffff');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    // Grid-Linien
    ctx.strokeStyle='#f1f5f9'; ctx.lineWidth=0.8;
    for(let i=0;i<=4;i++){
      const y=pT+iH*i/4;
      ctx.beginPath(); ctx.moveTo(pL,y); ctx.lineTo(W-pR,y); ctx.stroke();
    }
    for(let i=0;i<=4;i++){
      const x=pL+iW*i/4;
      ctx.beginPath(); ctx.moveTo(x,pT); ctx.lineTo(x,H-pB); ctx.stroke();
    }

    // Achsen
    ctx.strokeStyle='#94a3b8'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(pL,pT); ctx.lineTo(pL,H-pB); // Y
    ctx.moveTo(pL,H-pB); ctx.lineTo(W-pR,H-pB); // X
    ctx.stroke();

    // Achsenbeschriftung
    ctx.fillStyle='#64748b'; ctx.font='bold 8px sans-serif';
    ctx.textAlign='center'; ctx.fillText('t / s', W-pR+2, H-pB-2);
    ctx.save(); ctx.translate(10, pT+iH/2); ctx.rotate(-Math.PI/2);
    ctx.fillText(yLabel, 0, 0); ctx.restore();

    // Y-Achse Werte
    ctx.fillStyle='#94a3b8'; ctx.font='7px sans-serif'; ctx.textAlign='right';
    const yRange = yMax - yMin;
    for(let i=0;i<=2;i++){
      const val = yMax - yRange*i/2;
      const y = pT + iH*i/2;
      ctx.fillText(val%1===0 ? val.toFixed(0) : val.toFixed(1), pL-3, y+3);
      // kleine Tick-Striche
      ctx.strokeStyle='#94a3b8'; ctx.lineWidth=0.8;
      ctx.beginPath(); ctx.moveTo(pL-3,y); ctx.lineTo(pL,y); ctx.stroke();
    }

    // X-Achse Werte
    ctx.textAlign='center'; ctx.fillStyle='#94a3b8';
    for(let i=0;i<=2;i++){
      const tVal = tMax*i/2;
      const x = pL + iW*i/2;
      ctx.fillText(tVal.toFixed(0), x, H-4);
    }

    if(data.length < 2) {
      // Null-Linie als Vorschau (gestrichelt)
      ctx.strokeStyle=color+'44'; ctx.lineWidth=1.2; ctx.setLineDash([4,4]);
      const y0=pT+iH*(1-(0-yMin)/yRange);
      ctx.beginPath(); ctx.moveTo(pL,Math.max(pT,Math.min(H-pB,y0)));
      ctx.lineTo(W-pR,Math.max(pT,Math.min(H-pB,y0))); ctx.stroke();
      ctx.setLineDash([]);
      return;
    }

    // Datenlinie mit Füllung
    ctx.beginPath();
    data.forEach((p,i)=>{
      const px = pL + (p.t/tMax)*iW;
      const py = pT + (1-(p.y-yMin)/yRange)*iH;
      i===0 ? ctx.moveTo(px,Math.max(pT,Math.min(H-pB,py)))
            : ctx.lineTo(px,Math.max(pT,Math.min(H-pB,py)));
    });
    // Füllung unter der Linie
    const lastPx = pL + (data[data.length-1].t/tMax)*iW;
    ctx.lineTo(lastPx, H-pB); ctx.lineTo(pL, H-pB); ctx.closePath();
    ctx.fillStyle=color+'22'; ctx.fill();

    // Linie erneut zeichnen (sauber oben drüber)
    ctx.strokeStyle=color; ctx.lineWidth=2.2; ctx.lineJoin='round'; ctx.setLineDash([]);
    ctx.beginPath();
    data.forEach((p,i)=>{
      const px = pL + (p.t/tMax)*iW;
      const py = pT + (1-(p.y-yMin)/yRange)*iH;
      i===0 ? ctx.moveTo(px,Math.max(pT,Math.min(H-pB,py)))
            : ctx.lineTo(px,Math.max(pT,Math.min(H-pB,py)));
    });
    ctx.stroke();

    // Aktueller Punkt (leuchtend)
    const lp = data[data.length-1];
    const lpx = pL + (lp.t/tMax)*iW;
    const lpy = pT + (1-(lp.y-yMin)/yRange)*iH;
    const lpyC = Math.max(pT,Math.min(H-pB,lpy));
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.arc(lpx,lpyC,4.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=color;
    ctx.beginPath(); ctx.arc(lpx,lpyC,3,0,Math.PI*2); ctx.fill();
    // Wert als Label
    ctx.fillStyle=color; ctx.font='bold 8px sans-serif'; ctx.textAlign='left';
    const label = lp.y%1===0 ? lp.y.toFixed(0) : lp.y.toFixed(1);
    ctx.fillText(label, Math.min(lpx+5,W-pR-16), Math.max(pT+8,lpyC-3));
  }

  // ── Baum zeichnen ─────────────────────────────────────────
  function drawTree(x,y,sz){
    const W=cvA.width, H=cvA.height;
    if(x<-sz*2||x>W+sz*2) return;
    ctA.fillStyle='#92400e'; ctA.fillRect(x-2,y,4,sz*0.55);
    const g=ctA.createRadialGradient(x-sz*0.15,y-sz*0.2,1,x,y,sz*0.75);
    g.addColorStop(0,'#4ade80'); g.addColorStop(1,'#15803d');
    ctA.fillStyle=g;
    ctA.beginPath(); ctA.arc(x,y-sz*0.1,sz*0.75,0,Math.PI*2); ctA.fill();
  }

  // ── Reset ─────────────────────────────────────────────────
  window._gfReset = ()=>{
    t=0; s=0; roadOff=0; pts=[]; lastTs=null;
    document.getElementById('gfTimeVal').textContent='0,0';
    document.getElementById('gfSVal').textContent='0,0';
  };

  // ── Animations-Loop ───────────────────────────────────────
  function frame(ts){
    if(!lastTs) lastTs=ts;
    const dt = Math.min((ts-lastTs)/1000, 0.05);
    lastTs=ts;

    const v = +document.getElementById('gfVSlider').value;
    t   += dt;
    s   += v*dt;
    roadOff += v*dt;

    // Datenpunkte alle ~0,1 s
    if(pts.length===0 || t-pts[pts.length-1].t >= 0.1)
      pts.push({t, s, v, a:0});

    // Info-Zeile aktualisieren
    document.getElementById('gfTimeVal').textContent = t.toFixed(1);
    document.getElementById('gfSVal').textContent    = s.toFixed(1);
    document.getElementById('gfVCur').textContent    = v;

    // ── ANIMATION ──────────────────────────────────────────
    const W=cvA.width, H=cvA.height;
    ctA.clearRect(0,0,W,H);

    // Himmel (Verlauf)
    const sky = ctA.createLinearGradient(0,0,0,H*0.52);
    sky.addColorStop(0,'#bfdbfe'); sky.addColorStop(1,'#dbeafe');
    ctA.fillStyle=sky; ctA.fillRect(0,0,W,H*0.52);

    // Straße
    ctA.fillStyle='#6b7280'; ctA.fillRect(0,H*0.52,W,H*0.48);
    // Randstreifen
    ctA.fillStyle='#f59e0b'; ctA.fillRect(0,H*0.52,W,3);
    ctA.fillStyle='#f59e0b'; ctA.fillRect(0,H-3,W,3);
    // Strichlinie Mitte
    ctA.strokeStyle='#fff'; ctA.setLineDash([28,18]); ctA.lineWidth=2.5;
    ctA.lineDashOffset = -(roadOff*2.5)%46;
    ctA.beginPath(); ctA.moveTo(0,H*0.75); ctA.lineTo(W,H*0.75); ctA.stroke();
    ctA.setLineDash([]); ctA.lineDashOffset=0;

    // Bäume (Parallax 80%)
    const tOff = (roadOff*2.2)%W;
    drawTree(((W*0.15-tOff)%W+W)%W, H*0.28, 22);
    drawTree(((W*0.55-tOff)%W+W)%W, H*0.26, 18);
    drawTree(((W*0.85-tOff)%W+W)%W, H*0.29, 20);

    // Auto (fest bei 35%)
    const cx=Math.round(W*0.33), cy=Math.round(H*0.36);
    // Schatten
    ctA.fillStyle='rgba(0,0,0,0.12)';
    ctA.beginPath(); ctA.ellipse(cx+37,H*0.52+4,38,6,0,0,Math.PI*2); ctA.fill();
    // Karosserie
    const grad=ctA.createLinearGradient(cx,cy,cx,cy+38);
    grad.addColorStop(0,'#8b5cf6'); grad.addColorStop(1,'#6d28d9');
    ctA.fillStyle=grad;
    ctA.beginPath(); ctA.roundRect(cx,cy,74,38,8); ctA.fill();
    // Dach
    const dach=ctA.createLinearGradient(cx+10,cy-18,cx+10,cy);
    dach.addColorStop(0,'#4c1d95'); dach.addColorStop(1,'#5b21b6');
    ctA.fillStyle=dach;
    ctA.beginPath(); ctA.roundRect(cx+10,cy-18,48,20,6); ctA.fill();
    // Fenster
    ctA.fillStyle='#bfdbfe'; ctA.fillRect(cx+13,cy-15,20,13);
    ctA.fillStyle='#bfdbfe'; ctA.fillRect(cx+37,cy-15,18,13);
    // Räder
    [cx+15,cx+59].forEach(wx=>{
      ctA.fillStyle='#1f2937';
      ctA.beginPath(); ctA.arc(wx,cy+38,10,0,Math.PI*2); ctA.fill();
      ctA.strokeStyle='#9ca3af'; ctA.lineWidth=2;
      ctA.beginPath(); ctA.arc(wx,cy+38,6,0,Math.PI*2); ctA.stroke();
    });
    // Geschwindigkeits-Badge
    ctA.fillStyle='rgba(255,255,255,0.92)';
    ctA.beginPath(); ctA.roundRect(W-86,6,80,44,8); ctA.fill();
    ctA.fillStyle='#7c3aed'; ctA.font='bold 11px sans-serif'; ctA.textAlign='center';
    ctA.fillText(`v = ${v} m/s`, W-46, 22);
    ctA.fillStyle='#374151'; ctA.font='10px sans-serif';
    ctA.fillText(`t = ${t.toFixed(1)} s`, W-46, 36);
    ctA.fillText(`s = ${s.toFixed(0)} m`, W-46, 48);

    // Auto-Reset nach 20 s
    if(t>20) _gfReset();

    // ── DIAGRAMME ──────────────────────────────────────────
    const tMax = Math.max(Math.ceil(t/5)*5, 10);
    const sMax = Math.max(Math.ceil(v*tMax/10)*10, 20);
    const vDisp = +document.getElementById('gfVSlider').value;
    const vMax = Math.max(Math.ceil(vDisp*1.3/5)*5, 10);

    drawDiagram(ctST, cvST,
      pts.map(p=>({t:p.t,y:p.s})),
      '#7c3aed', 's / m', 0, sMax, tMax);

    drawDiagram(ctVT, cvVT,
      pts.map(p=>({t:p.t,y:p.v})),
      '#0891b2', 'v / m/s', 0, vMax, tMax);

    drawDiagram(ctAT, cvAT,
      pts.map(p=>({t:p.t,y:0})),
      '#16a34a', 'a / m/s²', -0.5, 1, tMax);

    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);
  return { stop(){ cancelAnimationFrame(raf); } };
}

// ── Basketballwurf ────────────────────────────────────────
function _basketToggle() { if (_sim) _sim.toggle(); }
function _basketReset()  { if (_sim) _sim.reset();  }
function _basketUpdate() { if (_sim) _sim.update();  }
function _simWurf() {
  const cv = document.getElementById('basketCanvas');
  if (!cv) return {};
  const ctx = cv.getContext('2d');
  let raf = null, running = false, simT = 0, lastTs = null;
  let params = getParams(), tr = calcTraj(params);
  function fmt(n, d=2) { return n.toFixed(d).replace('.', ','); }

  function getParams() {
    return {
      alpha: +document.getElementById('basketAlpha').value * Math.PI / 180,
      v0:    +document.getElementById('basketV0').value,
      g:     +document.getElementById('basketG').value,
      h0:    +document.getElementById('basketH0').value,
      hK:    +document.getElementById('basketHK').value,
      d:     +document.getElementById('basketD').value
    };
  }

  function calcTraj(p) {
    const { alpha, v0, g, h0 } = p;
    const vc = v0 * Math.cos(alpha), vs = v0 * Math.sin(alpha);
    const disc = vs * vs + 2 * g * h0;
    const tGround = disc > 0 ? (vs + Math.sqrt(disc)) / g : (vs / g) * 2;
    const steps = 80;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = (tGround / steps) * i;
      const x = vc * t;
      const y = Math.max(0, h0 + vs * t - 0.5 * g * t * t);
      const vy = vs - g * t;
      pts.push({ t, x, y, v: Math.sqrt(vc*vc + vy*vy), a: g });
    }
    return { pts, tGround, vc, vs };
  }

  function checkTreffer(p, tr) {
    const { d, hK } = p;
    for (let i = 1; i < tr.pts.length; i++) {
      if (tr.pts[i-1].x <= d && tr.pts[i].x >= d) {
        const frac = (d - tr.pts[i-1].x) / Math.max(tr.pts[i].x - tr.pts[i-1].x, 0.001);
        const yAtD = tr.pts[i-1].y + frac * (tr.pts[i].y - tr.pts[i-1].y);
        return Math.abs(yAtD - hK) < 0.23;
      }
    }
    return false;
  }

  function drawScene(curT, p, tr2) {
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    const { d, h0, hK, alpha, v0, g } = p;
    const { vc, vs, tGround } = tr2;
    const groundY = H - 30;
    const leftMar = 70, rightMar = 50;
    const scX = (W - leftMar - rightMar) / (d + 1.5);
    const scY = Math.min(scX, (groundY - 20) / Math.max(hK * 1.4, 4));
    const sX = x => leftMar + x * scX;
    const sY = y => groundY - y * scY;

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, groundY);
    sky.addColorStop(0, '#6BB8D4'); sky.addColorStop(1, '#BEE1F0');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, groundY);
    // Clouds
    [[120,28],[300,18],[500,32]].forEach(([cx2,cy2]) => {
      ctx.fillStyle='rgba(255,255,255,0.75)';
      [[-18,0,22,14],[0,0,28,18],[16,0,20,14]].forEach(([dx,dy,rw,rh])=>{
        ctx.beginPath(); ctx.ellipse(cx2+dx,cy2+dy,rw,rh,0,0,Math.PI*2); ctx.fill();
      });
    });
    // Ground / court
    ctx.fillStyle = '#8BC34A'; ctx.fillRect(0, groundY, W, H - groundY);
    ctx.fillStyle = '#C5803A'; ctx.fillRect(0, groundY + 6, W, 5);
    // Parkettmuster
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1;
    for (let xi = 0; xi < W; xi += 40) {
      ctx.beginPath(); ctx.moveTo(xi, groundY + 6); ctx.lineTo(xi, H); ctx.stroke();
    }

    // Trajectory (dashed purple)
    if (tr2.pts.length > 1) {
      ctx.strokeStyle = 'rgba(124,58,237,0.35)'; ctx.lineWidth = 2; ctx.setLineDash([5,5]);
      ctx.beginPath(); ctx.moveTo(sX(tr2.pts[0].x), sY(tr2.pts[0].y));
      tr2.pts.forEach(pt => ctx.lineTo(sX(pt.x), sY(Math.max(0,pt.y))));
      ctx.stroke(); ctx.setLineDash([]);
    }

    // Child figure at x=0
    drawChild(sX(0), groundY, alpha, h0, scY);

    // Basketball hoop at x=d
    drawHoop(sX(d), sY(hK), groundY);

    // Ball
    const clampT = Math.min(curT, tGround);
    const bx = vc * clampT;
    const by = Math.max(0, h0 + vs * clampT - 0.5 * g * clampT * clampT);
    const bPx = sX(bx), bPy = sY(by);
    const br = 9;
    const bg2 = ctx.createRadialGradient(bPx-2, bPy-2, 1, bPx, bPy, br);
    bg2.addColorStop(0, '#FF9500'); bg2.addColorStop(1, '#CC4400');
    ctx.fillStyle = bg2; ctx.beginPath(); ctx.arc(bPx, bPy, br, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(bPx, bPy, br, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = '#5c2800'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(bPx, bPy, br, -Math.PI*0.3, Math.PI*0.7); ctx.stroke();
    ctx.beginPath(); ctx.arc(bPx, bPy, br, Math.PI*0.7, -Math.PI*0.3); ctx.stroke();

    // Info badge
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.roundRect(W-162, 6, 156, 56, 6); ctx.fill();
    ctx.fillStyle = '#374151'; ctx.font = 'bold 9px Nunito,sans-serif'; ctx.textAlign = 'left';
    const alpDeg = document.getElementById('basketAlpha').value;
    const v0Val  = document.getElementById('basketV0').value;
    const gVal   = (+document.getElementById('basketG').value).toFixed(1).replace('.',',');
    ctx.fillText(`α=${alpDeg}°  v₀=${v0Val} m/s  g=${gVal} m/s²`, W-156, 20);
    ctx.fillText(`d=${p.d.toFixed(1)}m  hK=${p.hK.toFixed(1)}m  h₀=${p.h0.toFixed(1)}m`, W-156, 34);
    const wMax = (vc * tGround).toFixed(1).replace('.',',');
    const hMax = (h0 + vs*vs/(2*g)).toFixed(1).replace('.',',');
    ctx.fillText(`Weite: ${wMax}m  hMax: ${hMax}m`, W-156, 48);

    // Info row
    const vy = vs - g * clampT;
    document.getElementById('basketT').textContent = fmt(clampT);
    document.getElementById('basketX').textContent = fmt(bx);
    document.getElementById('basketY').textContent = fmt(by);
    document.getElementById('basketV').textContent = fmt(Math.sqrt(vc*vc+vy*vy));
    document.getElementById('basketA').textContent = fmt(g);
  }

  function drawChild(x, groundY, alpha, h0, scY) {
    const armLen = 22, headR = 9, legH = 24, bodyH = 26;
    const headY = groundY - legH - bodyH - headR;
    const bodyTop = headY + headR, bodyBot = bodyTop + bodyH;
    // shadow
    ctx.fillStyle='rgba(0,0,0,0.1)'; ctx.beginPath(); ctx.ellipse(x,groundY,18,5,0,0,Math.PI*2); ctx.fill();
    // legs
    ctx.strokeStyle='#1e3a5f'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(x,bodyBot); ctx.lineTo(x-8,groundY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x,bodyBot); ctx.lineTo(x+6,groundY); ctx.stroke();
    // body
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(x,bodyTop); ctx.lineTo(x,bodyBot); ctx.stroke();
    // throwing arm
    const aEx = x + armLen * Math.cos(alpha);
    const aEy = bodyTop + 8 - armLen * Math.sin(alpha);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x,bodyTop+8); ctx.lineTo(aEx,aEy); ctx.stroke();
    // other arm
    ctx.beginPath(); ctx.moveTo(x,bodyTop+8); ctx.lineTo(x-14,bodyTop+20); ctx.stroke();
    // head
    ctx.fillStyle='#FDBCB4'; ctx.strokeStyle='#c8845a'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(x,headY,headR,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#4a2c0a';
    ctx.beginPath(); ctx.arc(x,headY-2,headR,Math.PI,0); ctx.fill();
    // small ball at hand
    ctx.fillStyle='#FF9500'; ctx.beginPath(); ctx.arc(aEx,aEy,5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#333'; ctx.lineWidth=0.6;
    ctx.beginPath(); ctx.arc(aEx,aEy,5,0,Math.PI*2); ctx.stroke();
  }

  function drawHoop(hx, hy, groundY) {
    const ry = hy; // hoop ring y
    // pole
    ctx.strokeStyle='#888'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(hx+16, ry-20); ctx.lineTo(hx+16, groundY); ctx.stroke();
    // backboard
    ctx.fillStyle='rgba(240,240,240,0.9)'; ctx.strokeStyle='#aaa'; ctx.lineWidth=2;
    ctx.fillRect(hx+8, ry-30, 16, 44); ctx.strokeRect(hx+8, ry-30, 16, 44);
    // inner rectangle on backboard
    ctx.strokeStyle='#dc2626'; ctx.lineWidth=1.5;
    ctx.strokeRect(hx+11, ry-18, 10, 20);
    // arm
    ctx.strokeStyle='#888'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(hx+8, ry-2); ctx.lineTo(hx, ry-2); ctx.stroke();
    // hoop ring (orange)
    ctx.strokeStyle='#FF6600'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(hx-20, ry-2); ctx.lineTo(hx, ry-2); ctx.stroke();
    // net
    ctx.strokeStyle='#ccc'; ctx.lineWidth=1;
    for (let i=0; i<=5; i++) {
      const nx = hx-20+i*4;
      ctx.beginPath(); ctx.moveTo(nx, ry-2); ctx.lineTo(nx+2, ry+20); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(hx-20, ry+10); ctx.lineTo(hx, ry+10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx-18, ry+20); ctx.lineTo(hx-2, ry+20); ctx.stroke();
  }

  function miniChart(id, pts, yKey, xLabel, yLabel, color, curT) {
    const c = document.getElementById(id); if (!c) return;
    const ct = c.getContext('2d'), cW = c.width, cH = c.height;
    const P = {l:36, r:8, t:12, b:26};
    const gW = cW-P.l-P.r, gH = cH-P.t-P.b;
    ct.clearRect(0,0,cW,cH); ct.fillStyle='#f8fafc'; ct.fillRect(0,0,cW,cH);
    if (pts.length < 2) return;
    const tMax = pts[pts.length-1].t || 1;
    const vals = pts.map(p => p[yKey]);
    const yMax = Math.max(...vals.map(Math.abs)) * 1.2 || 1;
    const yMin = Math.min(0, ...vals);
    const yRange = yMax - yMin;
    ct.strokeStyle='#e5e7eb'; ct.lineWidth=0.8;
    for (let i=1; i<=3; i++) { ct.beginPath(); ct.moveTo(P.l,P.t+(i/3)*gH); ct.lineTo(P.l+gW,P.t+(i/3)*gH); ct.stroke(); }
    ct.strokeStyle='#555'; ct.lineWidth=1.5;
    ct.beginPath(); ct.moveTo(P.l,P.t); ct.lineTo(P.l,P.t+gH); ct.lineTo(P.l+gW,P.t+gH); ct.stroke();
    ct.strokeStyle=color; ct.lineWidth=2;
    ct.beginPath();
    pts.forEach((p,i) => {
      const px=P.l+(p.t/tMax)*gW, py=P.t+gH-((p[yKey]-yMin)/yRange)*gH;
      i===0?ct.moveTo(px,py):ct.lineTo(px,py);
    });
    ct.stroke();
    ct.font='9px Nunito,sans-serif'; ct.fillStyle='#666'; ct.textAlign='center';
    ct.fillText(xLabel, P.l+gW/2, cH-2);
    ct.save(); ct.translate(11,P.t+gH/2); ct.rotate(-Math.PI/2); ct.fillText(yLabel,0,0); ct.restore();
    // current dot
    const ci = pts.findIndex(p => p.t >= curT);
    if (ci >= 0) {
      const p = pts[ci];
      ct.fillStyle = color;
      ct.beginPath(); ct.arc(P.l+(p.t/tMax)*gW, P.t+gH-((p[yKey]-yMin)/yRange)*gH, 4, 0, Math.PI*2); ct.fill();
    }
    // scale labels
    ct.fillStyle='#888'; ct.textAlign='right'; ct.font='8px Nunito,sans-serif';
    ct.fillText(yMax.toFixed(1).replace('.',','), P.l-2, P.t+8);
    ct.fillText(yMin.toFixed(1).replace('.',','), P.l-2, P.t+gH);
    ct.textAlign='center';
    ct.fillText('0', P.l, P.t+gH+14);
    ct.fillText(tMax.toFixed(1).replace('.',','), P.l+gW, P.t+gH+14);
  }

  function drawTraj(pts, curT, p) {
    const c = document.getElementById('basketTraj'); if (!c) return;
    const ct = c.getContext('2d'), cW = c.width, cH = c.height;
    const P = {l:44, r:20, t:14, b:28};
    const gW = cW-P.l-P.r, gH = cH-P.t-P.b;
    ct.clearRect(0,0,cW,cH); ct.fillStyle='#f0f9ff'; ct.fillRect(0,0,cW,cH);
    if (pts.length < 2) return;
    const xMax = Math.max(...pts.map(pt=>pt.x), p.d) * 1.1;
    const yMax = Math.max(...pts.map(pt=>pt.y), p.hK) * 1.3;
    const tx = x => P.l+(x/xMax)*gW;
    const ty = y => P.t+gH-(y/yMax)*gH;
    // grid
    ct.strokeStyle='#e5e7eb'; ct.lineWidth=0.8;
    for (let i=1; i<=4; i++) {
      ct.beginPath(); ct.moveTo(P.l+(i/4)*gW,P.t); ct.lineTo(P.l+(i/4)*gW,P.t+gH); ct.stroke();
      ct.beginPath(); ct.moveTo(P.l,P.t+(i/4)*gH); ct.lineTo(P.l+gW,P.t+(i/4)*gH); ct.stroke();
    }
    // axes
    ct.strokeStyle='#555'; ct.lineWidth=1.5;
    ct.beginPath(); ct.moveTo(P.l,P.t); ct.lineTo(P.l,P.t+gH); ct.lineTo(P.l+gW,P.t+gH); ct.stroke();
    // labels
    ct.font='10px Nunito,sans-serif'; ct.fillStyle='#555'; ct.textAlign='center';
    ct.fillText('x in m', P.l+gW/2, cH-4);
    ct.save(); ct.translate(14,P.t+gH/2); ct.rotate(-Math.PI/2); ct.fillText('y in m',0,0); ct.restore();
    // scale
    ct.font='8px Nunito,sans-serif'; ct.fillStyle='#888';
    [0.25,0.5,0.75,1].forEach(f => {
      ct.textAlign='center'; ct.fillText((f*xMax).toFixed(1), tx(f*xMax), P.t+gH+14);
      ct.textAlign='right'; ct.fillText((f*yMax).toFixed(1), P.l-3, ty(f*yMax)+3);
    });
    // hoop marker
    ct.strokeStyle='#FF6600'; ct.lineWidth=3;
    ct.beginPath(); ct.moveTo(tx(p.d)-18, ty(p.hK)); ct.lineTo(tx(p.d), ty(p.hK)); ct.stroke();
    ct.fillStyle='#FF6600'; ct.font='9px Nunito,sans-serif'; ct.textAlign='left';
    ct.fillText('🏀', tx(p.d)+2, ty(p.hK)+4);
    // abwurfhöhe marker
    ct.strokeStyle='#059669'; ct.lineWidth=1.5; ct.setLineDash([3,3]);
    ct.beginPath(); ct.moveTo(P.l, ty(p.h0)); ct.lineTo(tx(0.3), ty(p.h0)); ct.stroke();
    ct.setLineDash([]);
    // trajectory
    ct.strokeStyle='#7c3aed'; ct.lineWidth=2.5;
    ct.beginPath(); pts.forEach((pt,i) => i===0?ct.moveTo(tx(pt.x),ty(pt.y)):ct.lineTo(tx(pt.x),ty(pt.y))); ct.stroke();
    // current ball dot
    const ci = pts.findIndex(pt => pt.t >= curT);
    if (ci >= 0) {
      ct.fillStyle='#FF9500'; ct.beginPath(); ct.arc(tx(pts[ci].x),ty(pts[ci].y),7,0,Math.PI*2); ct.fill();
      ct.strokeStyle='#333'; ct.lineWidth=0.8; ct.stroke();
    }
  }

  function drawAllCharts(p, tr2, curT) {
    miniChart('basketXT', tr2.pts, 'x', 't (s)', 'x (m)', '#7c3aed', curT);
    miniChart('basketYT', tr2.pts, 'y', 't (s)', 'y (m)', '#0891b2', curT);
    miniChart('basketVT', tr2.pts, 'v', 't (s)', 'v (m/s)', '#16a34a', curT);
    miniChart('basketAT', tr2.pts, 'a', 't (s)', 'a (m/s²)', '#dc2626', curT);
    drawTraj(tr2.pts, curT, p);
  }

  function updateTable(tr2) {
    const tb = document.getElementById('basketTbody'), tw = document.getElementById('basketTable');
    if (!tb || !tw) return;
    tw.style.display = 'table';
    const rows = tr2.pts.filter((_,i) => i % 8 === 0);
    tb.innerHTML = rows.map(r =>
      `<tr><td>${fmt(r.t,2)}</td><td>${fmt(r.x,2)}</td><td>${fmt(r.y,2)}</td><td>${fmt(r.v,2)}</td><td>${fmt(r.a,2)}</td></tr>`
    ).join('');
  }

  function update() {
    params = getParams(); tr = calcTraj(params);
    drawScene(0, params, tr);
    drawAllCharts(params, tr, 0);
    updateTable(tr);
  }

  function toggle() {
    if (running) {
      running = false; lastTs = null;
      const b = document.getElementById('basketPlayBtn'); if(b) b.textContent='▶ Weiter';
    } else {
      params = getParams(); tr = calcTraj(params);
      if (simT >= tr.tGround) simT = 0;
      running = true;
      const b = document.getElementById('basketPlayBtn'); if(b) b.textContent='⏸ Pause';
      const res = document.getElementById('basketResult'); if(res) res.innerHTML='';
      (function loop(ts) {
        if (!running) return;
        if (lastTs !== null) simT = Math.min(simT + (ts - lastTs)/1000, tr.tGround + 0.2);
        lastTs = ts;
        drawScene(simT, params, tr);
        drawAllCharts(params, tr, simT);
        if (simT < tr.tGround + 0.15) {
          raf = requestAnimationFrame(loop);
        } else {
          running = false;
          const b2 = document.getElementById('basketPlayBtn'); if(b2) b2.textContent='▶ Nochmal';
          const treffer = checkTreffer(params, tr);
          const res2 = document.getElementById('basketResult');
          if (res2) res2.innerHTML = treffer
            ? '<span style="color:#16a34a;font-size:1.05rem">🎉 <b>Treffer! Ball im Korb!</b></span>'
            : `<span style="color:#dc2626">❌ <b>Daneben!</b> – Korb bei x=${params.d.toFixed(1)}m, y=${params.hK.toFixed(1)}m. Winkel oder v₀ anpassen!</span>`;
        }
      })(performance.now());
    }
  }

  function reset() {
    running = false; lastTs = null; simT = 0;
    if (raf) cancelAnimationFrame(raf);
    const b = document.getElementById('basketPlayBtn'); if(b) b.textContent='▶ Werfen!';
    const res = document.getElementById('basketResult'); if(res) res.innerHTML='';
    update();
  }

  update();
  return { stop(){ running=false; if(raf) cancelAnimationFrame(raf); }, toggle, reset, update };
}

// ── Kreisbewegung – Das Mega-Karussell ────────────────────
function _simKreis() {
  const cv = document.getElementById('kreiCanvas');
  if (!cv) return {};
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  let running = false, raf = null, simT = 0, last = null;
  let schnurGebrochen = false, schnurAngle = 0;
  let flyX = 0, flyY = 0, flyVx = 0, flyVy = 0;
  const pts = [];

  function getP() {
    return {
      r:  +document.getElementById('kreiRSlider').value,
      m:  +document.getElementById('kreiMSlider').value,
      om: +document.getElementById('kreiOmSlider').value
    };
  }
  function fmt(n,d=1){ return n.toFixed(d).replace('.',','); }

  function draw(ts) {
    if (running && !schnurGebrochen) {
      if (last !== null) {
        const dt = Math.min((ts - last) / 1000, 0.05);
        simT += dt;
      }
      last = ts;
    }
    const p = getP();
    const fz = p.m * p.om * p.om * p.r;
    const v  = p.om * p.r;
    const T  = 2 * Math.PI / p.om;
    const od=document.getElementById('kreiOmDisp'), vd=document.getElementById('kreiVDisp');
    const fd=document.getElementById('kreiFzDisp'), td=document.getElementById('kreiTDisp');
    if(od) od.textContent=fmt(p.om,1);
    if(vd) vd.textContent=fmt(v,1);
    if(fd) fd.textContent=fz.toFixed(0);
    if(td) td.textContent=fmt(T,2);

    ctx.clearRect(0,0,W,H);
    const sky=ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#bfdbfe'); sky.addColorStop(1,'#e0f2fe');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#4ade80'; ctx.fillRect(0,H-28,W,28);
    ctx.fillStyle='#86efac'; ctx.fillRect(0,H-28,W,8);

    const CX=W/2, CY=H*0.42;
    const r_px=Math.min((p.r/5)*(W*0.33), W*0.4);
    const nG=6;
    const ang0=running?simT*p.om:(schnurGebrochen?schnurAngle:0);

    // Center pole
    ctx.strokeStyle='#92400e'; ctx.lineWidth=10;
    ctx.beginPath(); ctx.moveTo(CX,H-28); ctx.lineTo(CX,CY-22); ctx.stroke();
    ctx.fillStyle='#dc2626';
    ctx.beginPath(); ctx.arc(CX,CY-22,20,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#b91c1c'; ctx.lineWidth=2; ctx.stroke();

    if (!schnurGebrochen) {
      for(let i=0;i<nG;i++){
        const a=ang0+(i/nG)*Math.PI*2;
        const gx=CX+r_px*Math.cos(a), gy=CY+r_px*Math.sin(a)*0.32;
        ctx.strokeStyle='#a78bfa'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(CX,CY-22); ctx.lineTo(gx,gy-8); ctx.stroke();
        const cols=['#f97316','#3b82f6','#a855f7','#10b981','#f59e0b','#ef4444'];
        ctx.fillStyle=cols[i];
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(gx-10,gy-8,20,18,4);
        else ctx.rect(gx-10,gy-8,20,18);
        ctx.fill(); ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();
        // Person silhouette
        ctx.fillStyle='rgba(0,0,0,0.5)';
        ctx.beginPath(); ctx.arc(gx,gy-14,4,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(gx,gy-10); ctx.lineTo(gx,gy-4); ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=1.5; ctx.stroke();

        if(running && i===0){
          // Centripetal arrow (red, toward center)
          const arrowLen=Math.min(fz/40,48);
          const dx=CX-gx, dy=CY-gy, dist=Math.sqrt(dx*dx+dy*dy);
          const nx=dx/dist, ny=dy/dist;
          ctx.strokeStyle='#dc2626'; ctx.lineWidth=3;
          ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+nx*arrowLen,gy+ny*arrowLen); ctx.stroke();
          ctx.fillStyle='#dc2626';
          ctx.beginPath();
          const ax=gx+nx*arrowLen, ay=gy+ny*arrowLen;
          const px2=-ny, py2=nx;
          ctx.moveTo(ax,ay); ctx.lineTo(ax-nx*8+px2*5,ay-ny*8+py2*5); ctx.lineTo(ax-nx*8-px2*5,ay-ny*8-py2*5);
          ctx.fill();
          ctx.fillStyle='#dc2626'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
          ctx.fillText('F_z='+fz.toFixed(0)+'N', gx+nx*(arrowLen/2+12), gy+ny*(arrowLen/2+12)-7);
          // Tangential arrow (green)
          const tx=-Math.sin(a), ty=Math.cos(a)*0.32;
          const tl=Math.sqrt(tx*tx+ty*ty), vLen=Math.min(v*9,50);
          const tnx=tx/tl, tny=ty/tl;
          ctx.strokeStyle='#10b981'; ctx.lineWidth=3;
          ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+tnx*vLen,gy+tny*vLen); ctx.stroke();
          ctx.fillStyle='#10b981';
          ctx.beginPath();
          const vax=gx+tnx*vLen, vay=gy+tny*vLen;
          const vpx=-tny, vpy=tnx;
          ctx.moveTo(vax,vay); ctx.lineTo(vax-tnx*7+vpx*4,vay-tny*7+vpy*4); ctx.lineTo(vax-tnx*7-vpx*4,vay-tny*7-vpy*4);
          ctx.fill();
          ctx.fillStyle='#10b981'; ctx.font='bold 10px sans-serif'; ctx.textAlign='left';
          ctx.fillText('v='+fmt(v,1)+'m/s', vax+4, vay-2);
        }
      }
    } else {
      // Remaining gondolas (stationary)
      for(let i=1;i<nG;i++){
        const a=schnurAngle+(i/nG)*Math.PI*2;
        const gx=CX+r_px*Math.cos(a), gy=CY+r_px*Math.sin(a)*0.32;
        ctx.strokeStyle='#a78bfa'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(CX,CY-22); ctx.lineTo(gx,gy-8); ctx.stroke();
        const cols=['#3b82f6','#a855f7','#10b981','#f59e0b','#ef4444'];
        ctx.fillStyle=cols[i-1];
        ctx.beginPath(); ctx.rect(gx-10,gy-8,20,18); ctx.fill();
        ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();
      }
      // Flying gondola
      flyX+=flyVx; flyY+=flyVy; flyVy+=0.2;
      ctx.fillStyle='#f97316';
      ctx.beginPath();
      if(ctx.roundRect) ctx.roundRect(flyX-10,flyY-8,20,18,4); else ctx.rect(flyX-10,flyY-8,20,18);
      ctx.fill(); ctx.strokeStyle='#ea580c'; ctx.lineWidth=1.5; ctx.stroke();
      // Explosion text
      ctx.font='24px sans-serif'; ctx.textAlign='center';
      ctx.fillText('💥', CX+r_px*Math.cos(schnurAngle)*0.85, CY+r_px*Math.sin(schnurAngle)*0.32*0.85);
    }

    // Info badge
    ctx.fillStyle='rgba(255,255,255,0.92)'; ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=1;
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(8,8,196,68,6); else ctx.rect(8,8,196,68); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#1f2937'; ctx.font='bold 12px sans-serif'; ctx.textAlign='left';
    ctx.fillText('F = m·ω²·r', 14,25);
    ctx.font='11px sans-serif';
    ctx.fillText('= '+p.m+'·'+fmt(p.om,1)+'²·'+fmt(p.r,1)+' = '+fz.toFixed(1)+' N', 14,41);
    ctx.fillText('v = ω·r = '+fmt(v,1)+' m/s    T = '+fmt(T,2)+' s', 14,57);

    if(running && !schnurGebrochen && (pts.length===0 || simT-pts[pts.length-1].t>0.15)){
      pts.push({t:simT, fz, v, r:p.r});
      if(pts.length>400) pts.shift();
    }
    drawKreiMini('kreiFChart', pts, 'fz', 'F_z (N)', '#dc2626');
    drawKreiMini('kreiVChart', pts, 'v', 'v (m/s)', '#10b981');
    drawKreiRChart(p);
    raf=requestAnimationFrame(draw);
  }

  function drawKreiMini(id, data, yKey, yLabel, color){
    const c=document.getElementById(id); if(!c) return;
    const c2=c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:36,r:8,t:10,b:24};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    c2.clearRect(0,0,cW,cH); c2.fillStyle='#fff'; c2.fillRect(0,0,cW,cH);
    c2.strokeStyle='#333'; c2.lineWidth=1.5;
    c2.beginPath(); c2.moveTo(P.l,P.t); c2.lineTo(P.l,P.t+gH); c2.lineTo(P.l+gW,P.t+gH); c2.stroke();
    if(data.length<2){
      c2.fillStyle='#aaa'; c2.font='9px sans-serif'; c2.textAlign='center';
      c2.fillText('Start...', P.l+gW/2, P.t+gH/2+4); return;
    }
    const xs=data.map(d=>d.t), ys=data.map(d=>d[yKey]);
    const x0=xs[0], x1=xs[xs.length-1]||1;
    const y0=0, y1=Math.max(...ys)*1.1||1;
    c2.strokeStyle=color; c2.lineWidth=2;
    c2.beginPath();
    data.forEach((d,i)=>{
      const px=P.l+((d.t-x0)/(x1-x0))*gW;
      const py=P.t+gH-((d[yKey]-y0)/(y1-y0))*gH;
      i===0?c2.moveTo(px,py):c2.lineTo(px,py);
    }); c2.stroke();
    c2.fillStyle='#555'; c2.font='8px sans-serif'; c2.textAlign='center';
    c2.fillText('t (s)', P.l+gW/2, cH-2);
    c2.save(); c2.translate(9,P.t+gH/2); c2.rotate(-Math.PI/2); c2.fillText(yLabel,0,0); c2.restore();
    c2.textAlign='right'; c2.fillText(y1.toFixed(0), P.l-2, P.t+8);
    c2.textAlign='center'; c2.fillText(x1.toFixed(1), P.l+gW, P.t+gH+10);
  }

  function drawKreiRChart(p){
    const c=document.getElementById('kreiRChart'); if(!c) return;
    const c2=c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:36,r:8,t:10,b:24};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    c2.clearRect(0,0,cW,cH); c2.fillStyle='#fff'; c2.fillRect(0,0,cW,cH);
    const rMax=5, fMax=p.m*p.om*p.om*5*1.15+1;
    c2.strokeStyle='#333'; c2.lineWidth=1.5;
    c2.beginPath(); c2.moveTo(P.l,P.t); c2.lineTo(P.l,P.t+gH); c2.lineTo(P.l+gW,P.t+gH); c2.stroke();
    // theoretical F_z vs r line
    c2.strokeStyle='#dc262655'; c2.lineWidth=1.5; c2.setLineDash([4,3]);
    c2.beginPath();
    for(let ri=0;ri<=rMax;ri+=0.05){
      const fi=p.m*p.om*p.om*ri;
      const px=P.l+(ri/rMax)*gW, py=P.t+gH-(Math.min(fi,fMax)/fMax)*gH;
      ri===0?c2.moveTo(px,py):c2.lineTo(px,py);
    } c2.stroke(); c2.setLineDash([]);
    // current point
    const fzC=p.m*p.om*p.om*p.r;
    const cpx=P.l+(p.r/rMax)*gW, cpy=P.t+gH-(Math.min(fzC,fMax)/fMax)*gH;
    c2.fillStyle='#dc2626'; c2.beginPath(); c2.arc(cpx,cpy,5,0,Math.PI*2); c2.fill();
    c2.fillStyle='#555'; c2.font='8px sans-serif'; c2.textAlign='center';
    c2.fillText('r (m)', P.l+gW/2, cH-2);
    c2.save(); c2.translate(9,P.t+gH/2); c2.rotate(-Math.PI/2); c2.fillText('F_z (N)',0,0); c2.restore();
    c2.textAlign='center';
    for(let i=0;i<=5;i++) c2.fillText(i, P.l+(i/5)*gW, P.t+gH+10);
  }

  function toggle(){
    running=!running; last=null;
    if(running) schnurGebrochen=false;
    const btn=document.getElementById('kreiPlayBtn');
    if(btn) btn.textContent=running?'⏸ Pause':'▶ Starten';
  }
  function reset(){
    running=false; last=null; simT=0; schnurGebrochen=false; pts.length=0;
    const btn=document.getElementById('kreiPlayBtn'); if(btn) btn.textContent='▶ Starten';
    const res=document.getElementById('kreiResult'); if(res) res.innerHTML='';
    const tb=document.getElementById('kreiTbody'), tw=document.getElementById('kreiTable');
    if(tb) tb.innerHTML=''; if(tw) tw.style.display='none';
  }
  function update(){
    const p=getP();
    const fz=p.m*p.om*p.om*p.r, v=p.om*p.r, T=2*Math.PI/p.om;
    const od=document.getElementById('kreiOmDisp'), vd=document.getElementById('kreiVDisp');
    const fd=document.getElementById('kreiFzDisp'), td=document.getElementById('kreiTDisp');
    if(od) od.textContent=fmt(p.om,1); if(vd) vd.textContent=fmt(v,1);
    if(fd) fd.textContent=fz.toFixed(0); if(td) td.textContent=fmt(T,2);
  }
  function schnurReisst(){
    if(!running) return;
    schnurGebrochen=true;
    const p=getP();
    schnurAngle=simT*p.om;
    const r_px=Math.min((p.r/5)*(W*0.33), W*0.4);
    flyX=W/2+r_px*Math.cos(schnurAngle);
    flyY=H*0.42+r_px*Math.sin(schnurAngle)*0.32;
    const v=p.om*p.r;
    const tx=-Math.sin(schnurAngle), ty=Math.cos(schnurAngle)*0.32;
    const tl=Math.sqrt(tx*tx+ty*ty);
    flyVx=(tx/tl)*v*0.8; flyVy=(ty/tl)*v*0.8;
    const fz=p.m*p.om*p.om*p.r;
    const res=document.getElementById('kreiResult');
    if(res) res.innerHTML=`💥 Die Kette reißt! F_z = <b>${fz.toFixed(0)} N</b> → Gondel fliegt tangential! <b>v = ${fmt(v,1)} m/s</b>`;
    const tb=document.getElementById('kreiTbody'), tw=document.getElementById('kreiTable');
    if(tw) tw.style.display='table';
    if(tb){
      const row=document.createElement('tr');
      row.innerHTML=`<td>${fmt(simT,1)}</td><td>${fmt(p.om,1)}</td><td>${fmt(v,1)}</td><td>${fz.toFixed(0)}</td>`;
      tb.prepend(row);
    }
  }
  function stop(){ if(raf) cancelAnimationFrame(raf); }

  raf=requestAnimationFrame(draw);
  return { stop, toggle, reset, update, schnurReisst };
}

// ── Zentripetalkraft ──────────────────────────────────────
function _simZentripetal() {
  const cv = document.getElementById('zentriCanvas');
  const ctx = cv.getContext('2d');
  const cx=cv.width/2, cy=cv.height/2;
  let angle=0, raf;
  const zentriMeas = [];
  let zentriSel = [];

  function draw() {
    const m = +document.getElementById('zentriMSlider').value;
    const r_m = +document.getElementById('zentriRSlider').value; // physical radius in m
    const v = +document.getElementById('zentriVSlider').value;   // velocity in m/s
    const fz = m*v*v/r_m;
    const omega = v/r_m; // ω = v/r
    const r_px = Math.min(40 + r_m*12, 90); // visual radius scales with r_m

    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#f5f3ff'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.strokeStyle='#c4b5fd'; ctx.lineWidth=2; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.arc(cx,cy,r_px,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#7c3aed'; ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2); ctx.fill();
    const bx=cx+r_px*Math.cos(angle), by=cy+r_px*Math.sin(angle);
    ctx.strokeStyle='#7c3aed'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(bx,by); ctx.stroke();
    // ball size scales with mass
    ctx.fillStyle='#f97316'; ctx.beginPath(); ctx.arc(bx,by,8+m*2,0,Math.PI*2); ctx.fill();
    // velocity arrow (tangential)
    const vlen=Math.min(v*8, 60);
    const vx=-Math.sin(angle)*vlen, vy=Math.cos(angle)*vlen;
    ctx.strokeStyle='#10b981'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+vx,by+vy); ctx.stroke();
    // centripetal force arrow (inward)
    const fx=cx-bx, fy=cy-by, flen2=Math.sqrt(fx*fx+fy*fy);
    const fscale=Math.min(fz*3, 55);
    ctx.strokeStyle='#ef4444'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+fx/flen2*fscale,by+fy/flen2*fscale); ctx.stroke();
    // labels
    ctx.fillStyle='#10b981'; ctx.font='700 12px sans-serif'; ctx.fillText('v',8,18);
    ctx.fillStyle='#ef4444'; ctx.fillText('F_z',8,36);
    ctx.fillStyle='#1f2937'; ctx.fillText(`m=${m}kg  r=${r_m}m  v=${v}m/s  F_z=${fz.toFixed(2)}N`,8,54);
    // update HTML
    const md=document.getElementById('zentriMDisp'), rd=document.getElementById('zentriRDisp');
    const vd=document.getElementById('zentriVDisp'), fd=document.getElementById('zentrFDisp');
    if(md) md.textContent=m; if(rd) rd.textContent=r_m;
    if(vd) vd.textContent=v; if(fd) fd.textContent=fz.toFixed(2).replace('.',',');
    angle += omega*0.02;
    drawZentriChart();
    raf = requestAnimationFrame(draw);
  }

  function drawZentriChart() {
    const c = document.getElementById('zentriChart'); if (!c) return;
    const ctx2 = c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:55,r:20,t:22,b:38};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const v2Max=100, FMax=60; // v² up to 100 m²/s², F up to 60 N
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f5f3ff'; ctx2.fillRect(0,0,cW,cH);
    // grid
    ctx2.strokeStyle='#ece9f8'; ctx2.lineWidth=1;
    for(let i=1;i<=5;i++){
      const y=P.t+(i/5)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
      const x=P.l+(i/5)*gW; ctx2.beginPath(); ctx2.moveTo(x,P.t); ctx2.lineTo(x,P.t+gH); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.fillStyle='#333';
    ctx2.beginPath(); ctx2.moveTo(P.l+gW,P.t+gH); ctx2.lineTo(P.l+gW+7,P.t+gH-3); ctx2.lineTo(P.l+gW+7,P.t+gH+3); ctx2.fill();
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l-3,P.t+8); ctx2.lineTo(P.l+3,P.t+8); ctx2.fill();
    // labels
    ctx2.font='bold 12px Nunito,sans-serif'; ctx2.fillStyle='#333'; ctx2.textAlign='center';
    ctx2.fillText('v² (m²/s²)', P.l+gW/2, cH-2);
    ctx2.save(); ctx2.translate(14,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('F_z (N)',0,0); ctx2.restore();
    // ticks
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    for(let i=0;i<=5;i++) ctx2.fillText((v2Max*i/5).toFixed(0), P.l+(i/5)*gW, P.t+gH+13);
    ctx2.textAlign='right';
    for(let i=0;i<=5;i++) ctx2.fillText((FMax*i/5).toFixed(0), P.l-4, P.t+gH-(i/5)*gH+4);
    // current theoretical line F = (m/r)·v²
    const m_cur = +document.getElementById('zentriMSlider').value;
    const r_cur = +document.getElementById('zentriRSlider').value;
    const slope_th = m_cur/r_cur;
    ctx2.strokeStyle='#7c3aed44'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath();
    ctx2.moveTo(P.l, P.t+gH);
    ctx2.lineTo(P.l+gW, P.t+gH-(Math.min(slope_th*v2Max,FMax)/FMax)*gH);
    ctx2.stroke(); ctx2.setLineDash([]);
    ctx2.font='11px sans-serif'; ctx2.fillStyle='#7c3aed'; ctx2.textAlign='left';
    ctx2.fillText('F=m/r·v²', P.l+4, P.t+12);
    // current point
    const v_cur = +document.getElementById('zentriVSlider').value;
    const v2_cur = v_cur*v_cur;
    const F_cur = m_cur*v2_cur/r_cur;
    const ccx=P.l+(Math.min(v2_cur,v2Max)/v2Max)*gW, ccy=P.t+gH-(Math.min(F_cur,FMax)/FMax)*gH;
    ctx2.fillStyle='#7c3aed';
    ctx2.beginPath(); ctx2.arc(ccx,ccy,6,0,Math.PI*2); ctx2.fill();
    // slope line + result when 2 selected
    if (zentriSel.length === 2) {
      const [i1,i2] = [...zentriSel].sort((a,b)=>zentriMeas[a].v2-zentriMeas[b].v2);
      const p1=zentriMeas[i1], p2=zentriMeas[i2];
      const pxFn = mp => P.l+(Math.min(mp.v2,v2Max)/v2Max)*gW;
      const pyFn = mp => P.t+gH-(Math.min(mp.F,FMax)/FMax)*gH;
      ctx2.strokeStyle='#F97316'; ctx2.lineWidth=3;
      ctx2.beginPath(); ctx2.moveTo(pxFn(p1),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p2)); ctx2.stroke();
      ctx2.strokeStyle='#EF4444'; ctx2.lineWidth=1.5; ctx2.setLineDash([4,3]);
      ctx2.beginPath();
      ctx2.moveTo(pxFn(p1),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p2));
      ctx2.stroke(); ctx2.setLineDash([]);
      const dv2=parseFloat((p2.v2-p1.v2).toFixed(2));
      const dF=parseFloat((p2.F-p1.F).toFixed(2));
      if(Math.abs(dv2)>0){
        const mr=(dF/dv2).toFixed(3);
        const res=document.getElementById('zentriResult');
        if(res) res.innerHTML='Steigung = ΔF ÷ Δv² = <b>'+dF.toFixed(2)+' N</b> ÷ <b>'+dv2.toFixed(1)+' m²/s²</b> = <b class="sim-v-result">'+mr+' kg/m</b> → m/r Verhältnis';
      }
    }
    // measured points
    zentriMeas.forEach((mp,idx) => {
      const isSel = zentriSel.includes(idx);
      ctx2.fillStyle = isSel ? '#F97316' : '#dc2626';
      ctx2.strokeStyle = isSel ? '#C2410C' : '#b91c1c';
      ctx2.lineWidth=2;
      const mx=P.l+(Math.min(mp.v2,v2Max)/v2Max)*gW, my=P.t+gH-(Math.min(mp.F,FMax)/FMax)*gH;
      ctx2.beginPath(); ctx2.arc(mx,my,isSel?9:6,0,Math.PI*2); ctx2.fill(); ctx2.stroke();
      ctx2.fillStyle='#fff'; ctx2.font='bold 9px Nunito,sans-serif'; ctx2.textAlign='center';
      ctx2.fillText(idx+1, mx, my+3);
    });
  }

  function zentriMeasure() {
    const m_val = +document.getElementById('zentriMSlider').value;
    const r_val = +document.getElementById('zentriRSlider').value;
    const v_val = +document.getElementById('zentriVSlider').value;
    const v2 = parseFloat((v_val*v_val).toFixed(2));
    const F = parseFloat((m_val*v2/r_val).toFixed(3));
    zentriMeas.push({m:m_val, r:r_val, v2, F});
    zentriSel=[];
    const res=document.getElementById('zentriResult');
    if(res) res.innerHTML='';
    updateZentriTable();
  }

  function updateZentriTable() {
    const tb=document.getElementById('zentriTbody'), tw=document.getElementById('zentriTable');
    if(!tb||!tw) return;
    if(zentriMeas.length>0) tw.style.display='table';
    tb.innerHTML=zentriMeas.map(mp=>`<tr><td>${mp.m}</td><td>${mp.r}</td><td>${mp.v2.toFixed(2).replace('.',',')}</td><td>${mp.F.toFixed(3).replace('.',',')}</td></tr>`).join('');
  }

  function handleClick(mx, my) {
    const cW=460, cH=160;
    const P={l:55,r:20,t:22,b:38};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const v2Max=100, FMax=60;
    const pxFn = mp => P.l+(Math.min(mp.v2,v2Max)/v2Max)*gW;
    const pyFn = mp => P.t+gH-(Math.min(mp.F,FMax)/FMax)*gH;
    let closest=-1, minD=24;
    zentriMeas.forEach((mp,i) => {
      const d=Math.hypot(pxFn(mp)-mx, pyFn(mp)-my);
      if(d<minD){ minD=d; closest=i; }
    });
    if(closest<0) return;
    if(zentriSel.includes(closest)) zentriSel=zentriSel.filter(i=>i!==closest);
    else if(zentriSel.length<2) zentriSel.push(closest);
    else zentriSel=[closest];
    drawZentriChart();
  }

  draw();
  return { stop(){ cancelAnimationFrame(raf); }, measure: zentriMeasure, handleClick };
}

// ── Harmonische Schwingung ────────────────────────────────
function _simSchwingung() {
  const cv = document.getElementById('schwingCanvas');
  const ctx = cv.getContext('2d');
  const cy=cv.height/2;
  let t=0, raf, history=[];
  const schwingPts = [];
  let schwingSel = [];

  function draw() {
    const A = +document.getElementById('schwingASlider').value;
    const f = +document.getElementById('schwingFSlider').value;
    ctx.clearRect(0,0,cv.width,cv.height);
    // Mittellinie
    ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(cv.width,cy); ctx.stroke();
    // Wellenhistorie
    history.push({x:cv.width-10, y:cy-A*Math.sin(2*Math.PI*f*t)});
    history = history.filter(p=>p.x>0).map(p=>({x:p.x-1.5,y:p.y}));
    if(history.length>1){
      ctx.strokeStyle='#7c3aed'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(history[0].x,history[0].y);
      history.forEach(p=>ctx.lineTo(p.x,p.y)); ctx.stroke();
    }
    // Kugel am Pendel
    const ballY = cy - A*Math.sin(2*Math.PI*f*t);
    ctx.strokeStyle='#c4b5fd'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(30,20); ctx.lineTo(30,ballY); ctx.stroke();
    ctx.fillStyle='#f97316'; ctx.beginPath(); ctx.arc(30,ballY,12,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1f2937'; ctx.font='700 13px sans-serif';
    ctx.fillText(`A=${A}  f=${f}Hz  T=${(1/f).toFixed(2)}s`,8,16);
    // update displays
    const td=document.getElementById('schwingTDisp'); if(td) td.textContent=t.toFixed(2).replace('.',',');
    const xd=document.getElementById('schwingXDisp'); if(xd) xd.textContent=(A*Math.sin(2*Math.PI*f*t)).toFixed(1).replace('.',',');
    const vd=document.getElementById('schwingVDisp'); if(vd) vd.textContent=(A*2*Math.PI*f*Math.cos(2*Math.PI*f*t)).toFixed(1).replace('.',',');
    t += 0.016;
    drawSchwingChartX();
    raf = requestAnimationFrame(draw);
  }

  function drawSchwingChartX() {
    const c = document.getElementById('schwingChartX'); if(!c) return;
    const ctx2=c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:42,r:10,t:16,b:28};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const tMax=10, xMax=100;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f8fafc'; ctx2.fillRect(0,0,cW,cH);
    // grid
    ctx2.strokeStyle='#e5e7eb'; ctx2.lineWidth=1;
    for(let i=1;i<=4;i++){
      const y=P.t+(i/4)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle='#333'; ctx2.lineWidth=1.5;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.font='9px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    ctx2.fillText('t (s)', P.l+gW/2, cH-2);
    ctx2.save(); ctx2.translate(10,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('x (px)',0,0); ctx2.restore();
    function ptX(val){ return P.l+(val/tMax)*gW; }
    function ptY(val){ return P.t+gH/2-(val/xMax)*(gH/2); }
    // measured points
    schwingPts.forEach((p,i)=>{
      const sel=schwingSel.includes(i);
      ctx2.fillStyle=sel?'#f97316':'#dc2626';
      ctx2.beginPath(); ctx2.arc(p.px,p.py,6,0,Math.PI*2); ctx2.fill();
      if(sel){ ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2; ctx2.beginPath(); ctx2.arc(p.px,p.py,9,0,Math.PI*2); ctx2.stroke(); }
    });
    // if 2 selected: draw line and show result
    if(schwingSel.length===2){
      const a=schwingPts[schwingSel[0]], b=schwingPts[schwingSel[1]];
      ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2;
      ctx2.beginPath(); ctx2.moveTo(a.px,a.py); ctx2.lineTo(b.px,b.py); ctx2.stroke();
      const dt=Math.abs(b.x-a.x);
      const res=document.getElementById('schwingResult');
      if(res) res.innerHTML=`<b>Δt = ${dt.toFixed(2)} s → Periode T ≈ Δt (bei Peakabstand)</b>`;
    } else {
      const res=document.getElementById('schwingResult');
      if(res&&schwingSel.length===0&&schwingPts.length>0) res.innerHTML='';
    }
  }

  function measure() {
    const A=+document.getElementById('schwingASlider').value;
    const f=+document.getElementById('schwingFSlider').value;
    const curT=t, curX=A*Math.sin(2*Math.PI*f*t);
    const c=document.getElementById('schwingChartX'); if(!c) return;
    const P={l:42,r:10,t:16,b:28};
    const gW=c.width-P.l-P.r, gH=c.height-P.t-P.b;
    const tMax=10, xMax=100;
    const px=P.l+(Math.min(curT,tMax)/tMax)*gW;
    const py=P.t+gH/2-(curX/xMax)*(gH/2);
    schwingPts.push({x:curT,y:curX,px,py});
    // update table
    const tb=document.getElementById('schwingTbody'), tw=document.getElementById('schwingTable');
    if(tb&&tw){
      tw.style.display='table';
      const v=A*2*Math.PI*f*Math.cos(2*Math.PI*f*t);
      tb.innerHTML+=`<tr><td>${curT.toFixed(2).replace('.',',')}</td><td>${curX.toFixed(1).replace('.',',')}</td><td>${v.toFixed(1).replace('.',',')}</td></tr>`;
    }
    drawSchwingChartX();
  }

  function handleClick(mx,my) {
    let best=-1, bestD=22;
    schwingPts.forEach((p,i)=>{
      const d=Math.hypot(p.px-mx,p.py-my);
      if(d<bestD){ bestD=d; best=i; }
    });
    if(best===-1) return;
    const idx=schwingSel.indexOf(best);
    if(idx>=0) schwingSel.splice(idx,1);
    else{ if(schwingSel.length>=2) schwingSel=[schwingSel[1]]; schwingSel.push(best); }
    drawSchwingChartX();
  }

  draw();
  return { stop(){ cancelAnimationFrame(raf); }, measure, handleClick };
}

// ── Elektrisches Feld ─────────────────────────────────────
function _simEfeld() {
  const cv = document.getElementById('efeldCanvas');
  const ctx = cv.getContext('2d');
  let probe=null, raf;
  const efeldPts=[], d_m=0.3;
  let efeldSel=[];

  function draw() {
    const U = +document.getElementById('efeldUSlider').value;
    const E = U/d_m;
    ctx.clearRect(0,0,cv.width,cv.height);
    // Platten
    ctx.fillStyle='#f97316';
    ctx.fillRect(20,20,8,cv.height-40);
    ctx.fillStyle='#3b82f6';
    ctx.fillRect(cv.width-28,20,8,cv.height-40);
    // + / - Zeichen
    ctx.fillStyle='#f97316'; ctx.font='700 18px sans-serif';
    for(let y=40;y<cv.height-30;y+=30) ctx.fillText('+',5,y);
    ctx.fillStyle='#3b82f6';
    for(let y=40;y<cv.height-30;y+=30) ctx.fillText('−',cv.width-18,y);
    // Feldlinien
    const n=7, Enorm=U/300;
    ctx.strokeStyle=`rgba(124,58,237,${Math.min(1,Enorm*2)})`; ctx.lineWidth=1.5;
    for(let i=0;i<n;i++){
      const ly=30+(i*(cv.height-60)/(n-1));
      ctx.beginPath(); ctx.moveTo(28,ly); ctx.lineTo(cv.width-28,ly); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cv.width-40,ly-5); ctx.lineTo(cv.width-28,ly); ctx.lineTo(cv.width-40,ly+5); ctx.stroke();
    }
    // Probeladung
    if(probe){
      ctx.fillStyle='#ef4444';
      ctx.beginPath(); ctx.arc(probe.x,probe.y,8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='700 11px sans-serif'; ctx.fillText('+',probe.x-4,probe.y+4);
      ctx.strokeStyle='#ef4444'; ctx.lineWidth=3;
      const flen=Math.min(60,Enorm*60);
      ctx.beginPath(); ctx.moveTo(probe.x,probe.y); ctx.lineTo(probe.x+flen,probe.y); ctx.stroke();
    }
    ctx.fillStyle='#1f2937'; ctx.font='700 13px sans-serif';
    ctx.fillText(`U = ${U} V   E = ${E.toFixed(0)} V/m`,8,16);
    // update displays
    const ud=document.getElementById('efeldUDisp'); if(ud) ud.textContent=U;
    const ed=document.getElementById('efeldEDisp'); if(ed) ed.textContent=E.toFixed(0);
    drawEfeldChart();
    raf = requestAnimationFrame(draw);
  }

  function drawEfeldChart() {
    const c=document.getElementById('efeldChart'); if(!c) return;
    const ctx2=c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:58,r:16,t:20,b:36};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const uMax=300, eMax=1100;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f0f9ff'; ctx2.fillRect(0,0,cW,cH);
    // grid
    ctx2.strokeStyle='#e5e7eb'; ctx2.lineWidth=1;
    for(let i=1;i<=4;i++){
      const y=P.t+(i/4)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
    }
    for(let i=1;i<=4;i++){
      const x=P.l+(i/4)*gW; ctx2.beginPath(); ctx2.moveTo(x,P.t); ctx2.lineTo(x,P.t+gH); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    ctx2.fillText('U (V)', P.l+gW/2, cH-2);
    ctx2.save(); ctx2.translate(12,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('E (V/m)',0,0); ctx2.restore();
    ctx2.textAlign='right';
    for(let i=0;i<=4;i++) ctx2.fillText((eMax*i/4).toFixed(0), P.l-4, P.t+gH-(i/4)*gH+4);
    ctx2.textAlign='center';
    for(let i=0;i<=4;i++) ctx2.fillText((uMax*i/4).toFixed(0), P.l+(i/4)*gW, P.t+gH+14);
    // theoretical line (dashed blue)
    ctx2.strokeStyle='#2563eb'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath();
    ctx2.moveTo(P.l, P.t+gH);
    ctx2.lineTo(P.l+gW, P.t+gH-(uMax/d_m/eMax)*gH);
    ctx2.stroke(); ctx2.setLineDash([]);
    function ptX(u){ return P.l+(u/uMax)*gW; }
    function ptY(e){ return P.t+gH-(e/eMax)*gH; }
    // measured points
    efeldPts.forEach((p,i)=>{
      const sel=efeldSel.includes(i);
      ctx2.fillStyle=sel?'#f97316':'#dc2626';
      ctx2.beginPath(); ctx2.arc(p.px,p.py,7,0,Math.PI*2); ctx2.fill();
      if(sel){ ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2; ctx2.beginPath(); ctx2.arc(p.px,p.py,10,0,Math.PI*2); ctx2.stroke(); }
    });
    if(efeldSel.length===2){
      const a=efeldPts[efeldSel[0]], b=efeldPts[efeldSel[1]];
      if(Math.abs(b.x-a.x)>0.01){
        const slope=(b.y-a.y)/(b.x-a.x);
        ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2;
        ctx2.beginPath(); ctx2.moveTo(a.px,a.py); ctx2.lineTo(b.px,b.py); ctx2.stroke();
        const res=document.getElementById('efeldResult');
        if(res) res.innerHTML=`<b>ΔE/ΔU = ${slope.toFixed(1)} /m → d = ${(1/slope*1000).toFixed(0)} mm</b>`;
      }
    } else {
      const res=document.getElementById('efeldResult');
      if(res&&efeldSel.length===0) res.innerHTML='';
    }
  }

  function measure() {
    const U=+document.getElementById('efeldUSlider').value;
    const E=U/d_m;
    const c=document.getElementById('efeldChart'); if(!c) return;
    const P={l:58,r:16,t:20,b:36};
    const gW=c.width-P.l-P.r, gH=c.height-P.t-P.b;
    const uMax=300, eMax=1100;
    const px=P.l+(U/uMax)*gW;
    const py=P.t+gH-(E/eMax)*gH;
    efeldPts.push({x:U,y:E,px,py});
    const tb=document.getElementById('efeldTbody'), tw=document.getElementById('efeldTable');
    if(tb&&tw){
      tw.style.display='table';
      tb.innerHTML+=`<tr><td>${U}</td><td>${d_m.toFixed(1)}</td><td>${E.toFixed(0)}</td></tr>`;
    }
  }

  function handleClick(mx,my) {
    let best=-1, bestD=22;
    efeldPts.forEach((p,i)=>{
      const d=Math.hypot(p.px-mx,p.py-my);
      if(d<bestD){ bestD=d; best=i; }
    });
    if(best===-1) return;
    const idx=efeldSel.indexOf(best);
    if(idx>=0) efeldSel.splice(idx,1);
    else{ if(efeldSel.length>=2) efeldSel=[efeldSel[1]]; efeldSel.push(best); }
    drawEfeldChart();
  }

  cv.onclick = e => {
    const r=cv.getBoundingClientRect();
    probe = {x:(e.clientX-r.left)*(cv.width/r.width), y:(e.clientY-r.top)*(cv.height/r.height)};
  };
  draw();
  return { stop(){ cancelAnimationFrame(raf); }, measure, handleClick };
}

// ── Magnetisches Feld ─────────────────────────────────────
function _simBfeld() {
  const cv = document.getElementById('bfeldCanvas');
  const ctx = cv.getContext('2d');
  const cx=cv.width/2, cy=cv.height/2;
  let raf;
  const bfeldPts=[];
  let bfeldSel=[];

  function draw() {
    const I = +document.getElementById('bfeldISlider').value;
    const v_ms = +document.getElementById('bfeldVSlider').value;
    const B = I*0.005;
    const F = v_ms*B; // q=1
    ctx.clearRect(0,0,cv.width,cv.height);
    // Leiter (Kreis in der Mitte)
    ctx.strokeStyle='#1f2937'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.arc(cx,cy,12,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#1f2937';
    ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#f97316'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cx-6,cy-6); ctx.lineTo(cx+6,cy+6); ctx.moveTo(cx+6,cy-6); ctx.lineTo(cx-6,cy+6); ctx.stroke();
    // Konzentrische Feldlinien
    for(let ri=30;ri<=Math.min(200,30+I*15);ri+=18){
      const alpha=Math.min(1,I/20);
      ctx.strokeStyle=`rgba(124,58,237,${alpha})`; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(cx,cy,ri,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-6,cy-ri); ctx.lineTo(cx,cy-ri+8); ctx.lineTo(cx+6,cy-ri); ctx.stroke();
    }
    ctx.fillStyle='#1f2937'; ctx.font='700 13px sans-serif';
    ctx.fillText(`I = ${I} A   B = ${B.toFixed(3)} T   v = ${v_ms} m/s   F = ${F.toFixed(3)} N`,8,16);
    // update displays
    const bd=document.getElementById('bfeldBDisp'); if(bd) bd.textContent=B.toFixed(3).replace('.',',');
    const vd=document.getElementById('bfeldVDisp'); if(vd) vd.textContent=parseFloat(v_ms).toFixed(1).replace('.',',');
    const fd=document.getElementById('bfeldFDisp'); if(fd) fd.textContent=F.toFixed(3).replace('.',',');
    drawBfeldChart(I);
    raf = requestAnimationFrame(draw);
  }

  function drawBfeldChart(I_cur) {
    const c=document.getElementById('bfeldChart'); if(!c) return;
    const ctx2=c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:58,r:16,t:20,b:36};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const vMax=10, fMax=1.1;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f0f4f8'; ctx2.fillRect(0,0,cW,cH);
    // grid
    ctx2.strokeStyle='#e5e7eb'; ctx2.lineWidth=1;
    for(let i=1;i<=4;i++){
      const y=P.t+(i/4)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
    }
    for(let i=1;i<=4;i++){
      const x=P.l+(i/4)*gW; ctx2.beginPath(); ctx2.moveTo(x,P.t); ctx2.lineTo(x,P.t+gH); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    ctx2.fillText('v (m/s)', P.l+gW/2, cH-2);
    ctx2.save(); ctx2.translate(12,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('F (N)',0,0); ctx2.restore();
    ctx2.textAlign='right';
    for(let i=0;i<=4;i++) ctx2.fillText((fMax*i/4).toFixed(2), P.l-4, P.t+gH-(i/4)*gH+4);
    ctx2.textAlign='center';
    for(let i=0;i<=4;i++) ctx2.fillText((vMax*i/4).toFixed(0), P.l+(i/4)*gW, P.t+gH+14);
    // theoretical line (dashed blue) for current I
    const B_cur=I_cur*0.005;
    ctx2.strokeStyle='#2563eb'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath();
    ctx2.moveTo(P.l, P.t+gH);
    ctx2.lineTo(P.l+gW, P.t+gH-(vMax*B_cur/fMax)*gH);
    ctx2.stroke(); ctx2.setLineDash([]);
    function ptX(v){ return P.l+(v/vMax)*gW; }
    function ptY(f){ return P.t+gH-(f/fMax)*gH; }
    // measured points
    bfeldPts.forEach((p,i)=>{
      const sel=bfeldSel.includes(i);
      ctx2.fillStyle=sel?'#f97316':'#dc2626';
      ctx2.beginPath(); ctx2.arc(p.px,p.py,7,0,Math.PI*2); ctx2.fill();
      if(sel){ ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2; ctx2.beginPath(); ctx2.arc(p.px,p.py,10,0,Math.PI*2); ctx2.stroke(); }
    });
    if(bfeldSel.length===2){
      const a=bfeldPts[bfeldSel[0]], b=bfeldPts[bfeldSel[1]];
      if(Math.abs(b.x-a.x)>0.01){
        const slope=(b.y-a.y)/(b.x-a.x);
        ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2;
        ctx2.beginPath(); ctx2.moveTo(a.px,a.py); ctx2.lineTo(b.px,b.py); ctx2.stroke();
        const res=document.getElementById('bfeldResult');
        if(res) res.innerHTML=`<b>ΔF/Δv = ${slope.toFixed(4)} N·s/m = q·B → B = ${slope.toFixed(4)} T</b>`;
      }
    } else {
      const res=document.getElementById('bfeldResult');
      if(res&&bfeldSel.length===0) res.innerHTML='';
    }
  }

  function measure() {
    const I=+document.getElementById('bfeldISlider').value;
    const v_ms=+document.getElementById('bfeldVSlider').value;
    const B=I*0.005;
    const F=v_ms*B;
    const c=document.getElementById('bfeldChart'); if(!c) return;
    const P={l:58,r:16,t:20,b:36};
    const gW=c.width-P.l-P.r, gH=c.height-P.t-P.b;
    const vMax=10, fMax=1.1;
    const px=P.l+(v_ms/vMax)*gW;
    const py=P.t+gH-(F/fMax)*gH;
    bfeldPts.push({x:v_ms,y:F,px,py});
    const tb=document.getElementById('bfeldTbody'), tw=document.getElementById('bfeldTable');
    if(tb&&tw){
      tw.style.display='table';
      tb.innerHTML+=`<tr><td>${B.toFixed(3)}</td><td>${parseFloat(v_ms).toFixed(1)}</td><td>${F.toFixed(3)}</td></tr>`;
    }
  }

  function handleClick(mx,my) {
    let best=-1, bestD=22;
    bfeldPts.forEach((p,i)=>{
      const d=Math.hypot(p.px-mx,p.py-my);
      if(d<bestD){ bestD=d; best=i; }
    });
    if(best===-1) return;
    const idx=bfeldSel.indexOf(best);
    if(idx>=0) bfeldSel.splice(idx,1);
    else{ if(bfeldSel.length>=2) bfeldSel=[bfeldSel[1]]; bfeldSel.push(best); }
    drawBfeldChart(+document.getElementById('bfeldISlider').value);
  }

  draw();
  return { stop(){ cancelAnimationFrame(raf); }, measure, handleClick };
}

// ── Leistung & Wirkungsgrad ───────────────────────────────
function _simLeistung() {
  const cv = document.getElementById('leistCanvas');
  const ctx = cv.getContext('2d');
  let x=0, raf;
  const leistPts=[];
  let leistSel=[];

  function draw() {
    const U = +document.getElementById('leistUSlider').value;
    const I = +document.getElementById('leistISlider').value;
    const P = U*I;
    const R = U/I;
    ctx.clearRect(0,0,cv.width,cv.height);
    // Boden
    ctx.fillStyle='#e5e7eb'; ctx.fillRect(0,cv.height-30,cv.width,30);
    // Block (speed proportional to P)
    ctx.fillStyle='#7c3aed';
    ctx.beginPath(); ctx.roundRect(x,cv.height-80,50,50,6); ctx.fill();
    // Stromfluss Pfeil
    ctx.strokeStyle='#ef4444'; ctx.lineWidth=3;
    const plen=Math.min(80,P/3);
    ctx.beginPath(); ctx.moveTo(x+50,cv.height-55); ctx.lineTo(x+50+plen,cv.height-55); ctx.stroke();
    ctx.fillStyle='#ef4444'; ctx.font='700 12px sans-serif'; ctx.fillText(`P=${P.toFixed(0)}W`,x+55,cv.height-58);
    // Infos
    ctx.fillStyle='#1f2937'; ctx.font='700 14px sans-serif';
    ctx.fillText(`U = ${U} V   I = ${parseFloat(I).toFixed(1)} A`,10,22);
    ctx.fillStyle='#059669'; ctx.font='700 13px sans-serif';
    ctx.fillText(`P = U·I = ${P.toFixed(1)} W   R = U/I = ${R.toFixed(1)} Ω`,10,44);
    // update displays
    const ud=document.getElementById('leistUDisp'); if(ud) ud.textContent=U;
    const id=document.getElementById('leistIDisp'); if(id) id.textContent=parseFloat(I).toFixed(1).replace('.',',');
    const pd=document.getElementById('leistPDisp'); if(pd) pd.textContent=P.toFixed(1).replace('.',',');
    const rd=document.getElementById('leistRDisp'); if(rd) rd.textContent=R.toFixed(1).replace('.',',');
    x=(x+P*0.005)%(cv.width+60);
    drawLeistChart();
    raf = requestAnimationFrame(draw);
  }

  function drawLeistChart() {
    const c=document.getElementById('leistChart'); if(!c) return;
    const ctx2=c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:58,r:16,t:20,b:36};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const iMax=10, pMax=250;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f0fdf4'; ctx2.fillRect(0,0,cW,cH);
    // grid
    ctx2.strokeStyle='#e5e7eb'; ctx2.lineWidth=1;
    for(let i=1;i<=4;i++){
      const y=P.t+(i/4)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
    }
    for(let i=1;i<=4;i++){
      const x=P.l+(i/4)*gW; ctx2.beginPath(); ctx2.moveTo(x,P.t); ctx2.lineTo(x,P.t+gH); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    ctx2.fillText('I (A)', P.l+gW/2, cH-2);
    ctx2.save(); ctx2.translate(12,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('P (W)',0,0); ctx2.restore();
    ctx2.textAlign='right';
    for(let i=0;i<=4;i++) ctx2.fillText((pMax*i/4).toFixed(0), P.l-4, P.t+gH-(i/4)*gH+4);
    ctx2.textAlign='center';
    for(let i=0;i<=4;i++) ctx2.fillText((iMax*i/4).toFixed(0), P.l+(i/4)*gW, P.t+gH+14);
    function ptX(I){ return P.l+(I/iMax)*gW; }
    function ptY(Pw){ return P.t+gH-(Pw/pMax)*gH; }
    // measured points
    leistPts.forEach((p,i)=>{
      const sel=leistSel.includes(i);
      ctx2.fillStyle=sel?'#f97316':'#dc2626';
      ctx2.beginPath(); ctx2.arc(p.px,p.py,7,0,Math.PI*2); ctx2.fill();
      if(sel){ ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2; ctx2.beginPath(); ctx2.arc(p.px,p.py,10,0,Math.PI*2); ctx2.stroke(); }
    });
    if(leistSel.length===2){
      const a=leistPts[leistSel[0]], b=leistPts[leistSel[1]];
      if(Math.abs(b.x-a.x)>0.01){
        const slope=(b.y-a.y)/(b.x-a.x);
        ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2;
        ctx2.beginPath(); ctx2.moveTo(a.px,a.py); ctx2.lineTo(b.px,b.py); ctx2.stroke();
        const res=document.getElementById('leistResult');
        if(res) res.innerHTML=`<b>ΔP/ΔI = ${slope.toFixed(1)} W/A = U → Spannung U = ${slope.toFixed(1)} V</b>`;
      }
    } else {
      const res=document.getElementById('leistResult');
      if(res&&leistSel.length===0) res.innerHTML='';
    }
  }

  function measure() {
    const U=+document.getElementById('leistUSlider').value;
    const I=+document.getElementById('leistISlider').value;
    const Pw=U*I, R=U/I;
    const c=document.getElementById('leistChart'); if(!c) return;
    const P={l:58,r:16,t:20,b:36};
    const gW=c.width-P.l-P.r, gH=c.height-P.t-P.b;
    const iMax=10, pMax=250;
    const px=P.l+(I/iMax)*gW;
    const py=P.t+gH-(Pw/pMax)*gH;
    leistPts.push({x:I,y:Pw,px,py});
    const tb=document.getElementById('leistTbody'), tw=document.getElementById('leistTable');
    if(tb&&tw){
      tw.style.display='table';
      tb.innerHTML+=`<tr><td>${U}</td><td>${parseFloat(I).toFixed(1)}</td><td>${Pw.toFixed(1)}</td><td>${R.toFixed(1)}</td></tr>`;
    }
  }

  function handleClick(mx,my) {
    let best=-1, bestD=22;
    leistPts.forEach((p,i)=>{
      const d=Math.hypot(p.px-mx,p.py-my);
      if(d<bestD){ bestD=d; best=i; }
    });
    if(best===-1) return;
    const idx=leistSel.indexOf(best);
    if(idx>=0) leistSel.splice(idx,1);
    else{ if(leistSel.length>=2) leistSel=[leistSel[1]]; leistSel.push(best); }
    drawLeistChart();
  }

  draw();
  return { stop(){ cancelAnimationFrame(raf); }, measure, handleClick };
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
    drawChartVT(); drawChartAT();
  }

  // ── v-t Diagramm ─────────────────────────────────────────
  function drawChartVT() {
    const c = document.getElementById('simChartVT'); if (!c) return;
    const ctx = c.getContext('2d'), cW=c.width, cH=c.height;
    const P = {l:58,r:20,t:22,b:48};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const maxT = Math.max(10, (MAX_S/st.v)+1);
    const maxV = Math.max(25, Math.ceil(st.v*1.4/5)*5);
    const tx = t => P.l+(t/maxT)*gW;
    const vy = v => P.t+gH-(v/maxV)*gH;
    ctx.clearRect(0,0,cW,cH);
    // Hintergrund
    ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,cW,cH);
    // Grid
    ctx.strokeStyle='#F0F0F0'; ctx.lineWidth=1;
    for(let i=1;i<=5;i++){
      const y=P.t+(i/5)*gH; ctx.beginPath(); ctx.moveTo(P.l,y); ctx.lineTo(P.l+gW,y); ctx.stroke();
      const x=P.l+(i/5)*gW; ctx.beginPath(); ctx.moveTo(x,P.t); ctx.lineTo(x,P.t+gH); ctx.stroke();
    }
    // Achsen
    ctx.strokeStyle='#333'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(P.l,P.t); ctx.lineTo(P.l,P.t+gH); ctx.lineTo(P.l+gW,P.t+gH); ctx.stroke();
    ctx.fillStyle='#333';
    ctx.beginPath(); ctx.moveTo(P.l+gW,P.t+gH); ctx.lineTo(P.l+gW+8,P.t+gH-4); ctx.lineTo(P.l+gW+8,P.t+gH+4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(P.l,P.t); ctx.lineTo(P.l-4,P.t+9); ctx.lineTo(P.l+4,P.t+9); ctx.fill();
    // Achsenbeschriftung
    ctx.font='bold 13px Nunito,sans-serif'; ctx.fillStyle='#333'; ctx.textAlign='center';
    ctx.fillText('t in s', P.l+gW/2, cH-4);
    ctx.save(); ctx.translate(14,P.t+gH/2); ctx.rotate(-Math.PI/2); ctx.fillText('v in m/s',0,0); ctx.restore();
    // Tick-Werte
    ctx.font='11px Nunito,sans-serif'; ctx.fillStyle='#666';
    for(let i=0;i<=5;i++){
      ctx.textAlign='center'; ctx.fillText(((i/5)*maxT).toFixed(0), P.l+(i/5)*gW, P.t+gH+16);
      ctx.textAlign='right';  ctx.fillText(((i/5)*maxV).toFixed(0), P.l-6, vy((i/5)*maxV)+4);
    }
    // Gestrichelte Führungslinie (volle Breite)
    ctx.strokeStyle='rgba(8,145,178,.22)'; ctx.lineWidth=1.5; ctx.setLineDash([6,5]);
    ctx.beginPath(); ctx.moveTo(P.l,vy(st.v)); ctx.lineTo(P.l+gW,vy(st.v)); ctx.stroke();
    ctx.setLineDash([]);
    // Fläche + Linie bis aktuelles t
    if(st.t > 0.05){
      ctx.fillStyle='rgba(8,145,178,.1)';
      ctx.fillRect(P.l, vy(st.v), tx(st.t)-P.l, P.t+gH-vy(st.v));
      ctx.strokeStyle='#0891b2'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(P.l,vy(st.v)); ctx.lineTo(tx(st.t),vy(st.v)); ctx.stroke();
      // Aktueller Punkt
      ctx.fillStyle='rgba(8,145,178,.4)';
      ctx.beginPath(); ctx.arc(tx(st.t),vy(st.v),5,0,Math.PI*2); ctx.fill();
    }
    // v-Label
    if(st.t > 0.8){
      ctx.fillStyle='#0891b2'; ctx.font='bold 12px Nunito,sans-serif'; ctx.textAlign='left';
      ctx.fillText('v = '+st.v+' m/s', P.l+10, vy(st.v)-8);
    }
    // Messpunkte
    st.meas.forEach((m,idx)=>{
      ctx.fillStyle='#0891b2'; ctx.strokeStyle='#0369a1'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(tx(m.t),vy(st.v),7,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#fff'; ctx.font='bold 9px Nunito,sans-serif'; ctx.textAlign='center';
      ctx.fillText(idx+1, tx(m.t), vy(st.v)+3);
    });
  }

  // ── a-t Diagramm ─────────────────────────────────────────
  function drawChartAT() {
    const c = document.getElementById('simChartAT'); if (!c) return;
    const ctx = c.getContext('2d'), cW=c.width, cH=c.height;
    const P = {l:58,r:20,t:22,b:48};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const maxT = Math.max(10, (MAX_S/st.v)+1);
    const tx = t => P.l+(t/maxT)*gW;
    const a0Y = P.t+gH;
    ctx.clearRect(0,0,cW,cH);
    // Hintergrund
    ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,cW,cH);
    // Grid
    ctx.strokeStyle='#F0F0F0'; ctx.lineWidth=1;
    for(let i=0;i<=4;i++){
      const x=P.l+(i/4)*gW; ctx.beginPath(); ctx.moveTo(x,P.t); ctx.lineTo(x,P.t+gH); ctx.stroke();
    }
    // Achsen
    ctx.strokeStyle='#333'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(P.l,P.t); ctx.lineTo(P.l,P.t+gH); ctx.lineTo(P.l+gW,P.t+gH); ctx.stroke();
    ctx.fillStyle='#333';
    ctx.beginPath(); ctx.moveTo(P.l+gW,P.t+gH); ctx.lineTo(P.l+gW+8,P.t+gH-4); ctx.lineTo(P.l+gW+8,P.t+gH+4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(P.l,P.t); ctx.lineTo(P.l-4,P.t+9); ctx.lineTo(P.l+4,P.t+9); ctx.fill();
    // Achsenbeschriftung
    ctx.font='bold 13px Nunito,sans-serif'; ctx.fillStyle='#333'; ctx.textAlign='center';
    ctx.fillText('t in s', P.l+gW/2, cH-4);
    ctx.save(); ctx.translate(14,P.t+gH/2); ctx.rotate(-Math.PI/2); ctx.fillText('a in m/s²',0,0); ctx.restore();
    // Tick-Werte
    ctx.font='11px Nunito,sans-serif'; ctx.fillStyle='#666';
    for(let i=0;i<=4;i++){ ctx.textAlign='center'; ctx.fillText(((i/4)*maxT).toFixed(0), P.l+(i/4)*gW, P.t+gH+16); }
    ctx.textAlign='right'; ctx.fillText('0', P.l-6, a0Y+4);
    ctx.fillText('5', P.l-6, P.t+gH/2+4);
    // a=0 Linie (grün)
    if(st.t > 0.05){
      ctx.fillStyle='rgba(22,163,74,.1)'; ctx.fillRect(P.l, a0Y-4, tx(st.t)-P.l, 8);
      ctx.strokeStyle='#16a34a'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(P.l,a0Y); ctx.lineTo(tx(st.t),a0Y); ctx.stroke();
      ctx.fillStyle='rgba(22,163,74,.4)';
      ctx.beginPath(); ctx.arc(tx(st.t),a0Y,5,0,Math.PI*2); ctx.fill();
    }
    // Label
    if(st.t > 0.8){
      ctx.fillStyle='#16a34a'; ctx.font='bold 12px Nunito,sans-serif'; ctx.textAlign='left';
      ctx.fillText('a = 0 m/s²', P.l+10, a0Y-10);
    }
    // Messpunkte bei a=0
    st.meas.forEach((m,idx)=>{
      ctx.fillStyle='#16a34a'; ctx.strokeStyle='#15803d'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(tx(m.t),a0Y,7,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#fff'; ctx.font='bold 9px Nunito,sans-serif'; ctx.textAlign='center';
      ctx.fillText(idx+1, tx(m.t), a0Y+3);
    });
  }

  function updateTable() {
    const tb = document.getElementById('simTbody');
    const tw = document.getElementById('simTableWrap');
    if (!tb||!tw) return;
    if (st.meas.length>0) tw.style.display='table';
    const hasVT = !!document.getElementById('simChartVT');
    tb.innerHTML = st.meas.map((m,i)=>
      `<tr><td>P${i+1}</td><td>${m.t.toFixed(1).replace('.',',')}</td><td>${m.s.toFixed(1).replace('.',',')}</td>${hasVT?`<td>${st.v}</td>`:''}</tr>`
    ).join('');
  }

  drawRoad(); drawChart();
  return { stop, toggle, measure, reset, handleClick, setV };
}

// ============================================================
// FADENSTRAHLROHR SIMULATION
// ============================================================
function _fstSetU(val) { if (_sim) _sim.setU(parseFloat(val)); }
function _fstSetI(val) { if (_sim) _sim.setI(parseFloat(val)); }

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
// BRIDGE FUNCTIONS FOR NEW SIMULATIONS
// ============================================================
function _fedSetF(v) { if (_sim) _sim.setF(parseFloat(v)); }
function _fedMeasure() { if (_sim) _sim.measure(); }
function _newMeasure() { if (_sim) _sim.measure(); }
function _penMeasure() { if (_sim) _sim.measure(); }
function _kreiMeasure() { if (_sim) _sim.measure(); }
function _zentriMeasure() { if (_sim) _sim.measure(); }
function _hebSet(k,v){ if (_sim) _sim.set(k,parseFloat(v)); }
function _ohmSet(k,v){ if (_sim) _sim.set(k,parseFloat(v)); }
function _schSetMode(m){ if (_sim) _sim.setMode(m); }
function _beschSetA(v){ if (_sim) { _sim.setA(parseFloat(v)); _sim.reset(); } }
function _beschToggle(){ if (_sim) _sim.toggle(); }
function _beschReset(){ if (_sim) _sim.reset(); }
function _fallSetH(v){ if (_sim) _sim.setH(parseFloat(v)); }
function _fallToggle(){ if (_sim) _sim.toggle(); }
function _fallReset(){ if (_sim) _sim.reset(); }
function _newSet(k,v){ if (_sim) _sim.set(k,parseFloat(v)); }
function _newToggle(){ if (_sim) _sim.toggle(); }
function _newReset(){ if (_sim) _sim.reset(); }
function _engSet(k,v){ if (_sim) _sim.set(k,parseFloat(v)); }
function _rakToggle(){ if (_sim) _sim.toggle(); }
function _rakReset(){ if (_sim) _sim.reset(); }
function _rakUpdate(){ if (_sim) _sim.update(); }
function _achtToggle(){ if (_sim) _sim.toggle(); }
function _achtReset(){ if (_sim) _sim.reset(); }
function _achtUpdate(){ if (_sim) _sim.update(); }
function _kreiToggle(){ if (_sim) _sim.toggle(); }
function _kreiReset(){ if (_sim) _sim.reset(); }
function _kreiSchnur(){ if (_sim) _sim.schnurReisst(); }
function _kreiUpdate(){ if (_sim) _sim.update(); }
function _impSet(k,v){ if (_sim) _sim.set(k,parseFloat(v)); }
function _impStoss(){ if (_sim) _sim.stoss(); }
function _impReset(){ if (_sim) _sim.reset(); }
function _penSetL(v){ if (_sim) _sim.setL(parseFloat(v)); }
function _welSet(k,v){ if (_sim) _sim.set(k,parseFloat(v)); }
function _fpToggle(){ if (_sim) _sim.toggle(); }
function _fpSetM(v){ if (_sim) _sim.setM(parseFloat(v)); }
function _fpSetD(v){ if (_sim) _sim.setD(parseFloat(v)); }
function _kondSet(k,v){ if (_sim) _sim.set(k,parseFloat(v)); }
function _kondSetMode(m){ if (_sim) _sim.setMode(m); }
function _kondReset(){ if (_sim) _sim.reset(); }

// ============================================================
// SIM 1: FEDERKRAFT
// ============================================================
function _simFederkraft() {
  const canvas = document.getElementById('fedCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let F = 20, animId = null;
  let wobble = 0, wobbleDir = 1;

  function fmt(n) { return n.toFixed(1).replace('.', ','); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const k = 10; // N/cm
    const x_cm = F / k; // extension in cm
    const x_px = x_cm * 12; // scale: 12px per cm

    // background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);

    const wallX = 40, restX = 160, blockW = 50, blockH = 40;
    const blockX = restX + x_px + wobble;
    const midY = H / 2;

    // wall
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(wallX - 15, midY - 60, 15, 120);
    ctx.fillStyle = '#64748B';
    for (let i = -55; i < 60; i += 15) {
      ctx.beginPath();
      ctx.moveTo(wallX - 15, midY + i);
      ctx.lineTo(wallX - 30, midY + i + 12);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // spring
    const springStartX = wallX;
    const springEndX = blockX;
    const springY = midY;
    const coils = 8;
    const coilH = 14;
    ctx.beginPath();
    ctx.moveTo(springStartX, springY);
    const segLen = (springEndX - springStartX) / (coils * 2 + 2);
    ctx.lineTo(springStartX + segLen, springY);
    for (let i = 0; i < coils; i++) {
      ctx.lineTo(springStartX + segLen * (2 + i * 2), springY - coilH);
      ctx.lineTo(springStartX + segLen * (3 + i * 2), springY + coilH);
    }
    ctx.lineTo(springEndX, springY);
    ctx.strokeStyle = x_cm > 0 ? '#DC2626' : '#2563EB';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // block
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.roundRect(blockX, midY - blockH / 2, blockW, blockH, 6);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('m', blockX + blockW / 2, midY + 5);

    // ground line
    ctx.beginPath();
    ctx.moveTo(wallX - 15, midY + 25);
    ctx.lineTo(W - 20, midY + 25);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // force arrow
    if (F > 0) {
      const arrowStartX = blockX + blockW;
      const arrowEndX = arrowStartX + Math.min(F * 1.5, 80);
      ctx.beginPath();
      ctx.moveTo(arrowStartX, midY);
      ctx.lineTo(arrowEndX, midY);
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(arrowEndX, midY - 8);
      ctx.lineTo(arrowEndX + 12, midY);
      ctx.lineTo(arrowEndX, midY + 8);
      ctx.fillStyle = '#DC2626';
      ctx.fill();
      ctx.fillStyle = '#DC2626';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('F', arrowEndX + 18, midY + 4);
    }

    // labels
    ctx.fillStyle = '#374151';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('F = ' + fmt(F) + ' N     x = ' + fmt(x_cm) + ' cm', W / 2, H - 12);

    // update HTML
    const fEl = document.getElementById('fedFVal');
    const xEl = document.getElementById('fedXVal');
    const lEl = document.getElementById('fedFLabel');
    if (fEl) fEl.textContent = fmt(F);
    if (xEl) xEl.textContent = fmt(x_cm);
    if (lEl) lEl.textContent = fmt(F);

    // gentle wobble
    wobble += wobbleDir * 0.4;
    if (wobble > 3 || wobble < -3) wobbleDir *= -1;

    drawChart();
    animId = requestAnimationFrame(draw);
  }

  const meas = [];
  let sel = [];

  function drawChart() {
    const c = document.getElementById('fedChart'); if (!c) return;
    const ctx2 = c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:55,r:20,t:22,b:42};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f8fafc'; ctx2.fillRect(0,0,cW,cH);
    // grid
    ctx2.strokeStyle='#f0f0f0'; ctx2.lineWidth=1;
    for(let i=1;i<=5;i++){
      const y=P.t+(i/5)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
      const x=P.l+(i/5)*gW; ctx2.beginPath(); ctx2.moveTo(x,P.t); ctx2.lineTo(x,P.t+gH); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    // axis arrows
    ctx2.fillStyle='#333';
    ctx2.beginPath(); ctx2.moveTo(P.l+gW,P.t+gH); ctx2.lineTo(P.l+gW+7,P.t+gH-3); ctx2.lineTo(P.l+gW+7,P.t+gH+3); ctx2.fill();
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l-3,P.t+8); ctx2.lineTo(P.l+3,P.t+8); ctx2.fill();
    // labels
    ctx2.font='bold 12px Nunito,sans-serif'; ctx2.fillStyle='#333'; ctx2.textAlign='center';
    ctx2.fillText('Dehnung x (cm)', P.l+gW/2, cH-4);
    ctx2.save(); ctx2.translate(14,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('Kraft F (N)',0,0); ctx2.restore();
    // axis ticks
    const xMax=5, yMax=50;
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    for(let i=0;i<=5;i++){
      const x=P.l+(i/5)*gW;
      ctx2.fillText((xMax*i/5).toFixed(0), x, P.t+gH+14);
    }
    ctx2.textAlign='right';
    for(let i=0;i<=5;i++){
      const y=P.t+gH-(i/5)*gH;
      ctx2.fillText((yMax*i/5).toFixed(0), P.l-4, y+4);
    }
    // theoretical line F=k*x (k=10 N/cm)
    ctx2.strokeStyle='#7c3aed44'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath();
    ctx2.moveTo(P.l, P.t+gH);
    ctx2.lineTo(P.l+gW, P.t+gH-(yMax/yMax)*gH);
    ctx2.stroke(); ctx2.setLineDash([]);
    ctx2.font='11px sans-serif'; ctx2.fillStyle='#7c3aed'; ctx2.textAlign='left';
    ctx2.fillText('F=k·x', P.l+4, P.t+12);
    // current point
    const k=10, x_cm=F/k;
    const cx2=P.l+(x_cm/xMax)*gW, cy2=P.t+gH-(F/yMax)*gH;
    ctx2.fillStyle='#7c3aed';
    ctx2.beginPath(); ctx2.arc(cx2,cy2,6,0,Math.PI*2); ctx2.fill();
    // slope line + result when 2 points selected
    if (sel.length === 2) {
      const [i1,i2] = [...sel].sort((a,b)=>meas[a].x-meas[b].x);
      const p1=meas[i1], p2=meas[i2];
      const pxFn = m => P.l+(m.x/xMax)*gW;
      const pyFn = m => P.t+gH-(m.F/yMax)*gH;
      ctx2.strokeStyle='#F97316'; ctx2.lineWidth=3;
      ctx2.beginPath(); ctx2.moveTo(pxFn(p1),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p2)); ctx2.stroke();
      ctx2.strokeStyle='#EF4444'; ctx2.lineWidth=1.5; ctx2.setLineDash([4,3]);
      ctx2.beginPath();
      ctx2.moveTo(pxFn(p1),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p2));
      ctx2.stroke(); ctx2.setLineDash([]);
      const dx=parseFloat((p2.x-p1.x).toFixed(2));
      const dy=parseFloat((p2.F-p1.F).toFixed(1));
      if (dx > 0) {
        const slope=(dy/dx).toFixed(1);
        const res=document.getElementById('fedResult');
        if(res) res.innerHTML='Steigung = ΔF ÷ Δx = <b>'+dy.toFixed(1)+' N</b> ÷ <b>'+dx.toFixed(2)+' cm</b> = <b class="sim-v-result">'+slope+' N/cm</b> → Das ist die Federkonstante k!';
      }
    }
    // measured points
    meas.forEach((m,idx) => {
      const isSel = sel.includes(idx);
      ctx2.fillStyle = isSel ? '#F97316' : '#dc2626';
      ctx2.strokeStyle = isSel ? '#C2410C' : '#b91c1c';
      ctx2.lineWidth=2;
      const mx=P.l+(m.x/xMax)*gW, my=P.t+gH-(m.F/yMax)*gH;
      ctx2.beginPath(); ctx2.arc(mx,my,isSel?9:6,0,Math.PI*2); ctx2.fill(); ctx2.stroke();
      ctx2.fillStyle='#fff'; ctx2.font='bold 9px Nunito,sans-serif'; ctx2.textAlign='center';
      ctx2.fillText(idx+1, mx, my+3);
    });
  }

  function handleClick(mx, my) {
    const cW=460, cH=200;
    const P={l:55,r:20,t:22,b:42};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const xMax=5, yMax=50;
    const pxFn = m => P.l+(m.x/xMax)*gW;
    const pyFn = m => P.t+gH-(m.F/yMax)*gH;
    let closest=-1, minD=24;
    meas.forEach((m,i) => {
      const d=Math.hypot(pxFn(m)-mx, pyFn(m)-my);
      if(d<minD){ minD=d; closest=i; }
    });
    if(closest<0) return;
    if(sel.includes(closest)) sel=sel.filter(i=>i!==closest);
    else if(sel.length<2) sel.push(closest);
    else sel=[closest];
    drawChart();
  }

  function measure() {
    const k=10, x_cm=F/k;
    meas.push({x:parseFloat(x_cm.toFixed(2)), F:parseFloat(F.toFixed(1))});
    sel=[];
    const res=document.getElementById('fedResult');
    if(res) res.innerHTML='';
    updateTable();
  }

  function updateTable() {
    const tb=document.getElementById('fedTbody'), tw=document.getElementById('fedTable');
    if(!tb||!tw) return;
    if(meas.length>0) tw.style.display='table';
    tb.innerHTML=meas.map((m,i)=>`<tr><td>${m.x.toFixed(2).replace('.',',')}</td><td>${m.F.toFixed(1).replace('.',',')}</td></tr>`).join('');
  }

  function stop() { if (animId) cancelAnimationFrame(animId); }
  function setF(v) { F = v; }

  draw();
  return { stop, setF, measure, handleClick };
}

// ============================================================
// SIM 2: HEBELGESETZ
// ============================================================
function _simHebelgesetz() {
  const canvas = document.getElementById('hebCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let F2 = 50, l2 = 1.5, l1 = 2.0;
  let animId = null;

  function fmt(n, d=1) { return n.toFixed(d).replace('.', ','); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fafaf9';
    ctx.fillRect(0, 0, W, H);

    const F1 = F2 * l2 / l1;
    const balanced = Math.abs(F1 * l1 - F2 * l2) < 0.5;

    const pivotX = W / 2;
    const pivotY = H / 2 + 20;
    const scale = 60; // px per meter
    const tiltAngle = balanced ? 0 : Math.atan2((F2 * l2 - F1 * l1) * 0.003, 1);

    // fulcrum triangle
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX - 18, pivotY + 36);
    ctx.lineTo(pivotX + 18, pivotY + 36);
    ctx.closePath();
    ctx.fillStyle = '#78716C';
    ctx.fill();
    // base
    ctx.fillRect(pivotX - 30, pivotY + 36, 60, 8);

    // beam
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(tiltAngle);
    const beamLen = (l1 + l2 + 0.3) * scale;
    ctx.fillStyle = '#92400E';
    ctx.fillRect(-l2 * scale - 8, -8, beamLen, 16);
    ctx.restore();

    // force arrows
    function drawArrow(x, y, dir, label, color, F_val) {
      const len = Math.min(F_val * 1.2, 70);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + dir * len);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
      const tipY = y + dir * len;
      ctx.beginPath();
      ctx.moveTo(x - 8, tipY - dir * 10);
      ctx.lineTo(x, tipY);
      ctx.lineTo(x + 8, tipY - dir * 10);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y + dir * (len + 16));
    }

    // F2 arrow (right, pointing down = load)
    const f2x = pivotX + Math.cos(tiltAngle) * l2 * scale;
    const f2y = pivotY + Math.sin(tiltAngle) * l2 * scale - Math.sin(tiltAngle) * 8;
    drawArrow(f2x, pivotY - 5, 1, 'F₂=' + fmt(F2) + 'N', '#DC2626', F2);

    // F1 arrow (left, pointing down = applied force)
    const f1x = pivotX - Math.cos(tiltAngle) * l1 * scale;
    const f1y = pivotY - Math.sin(tiltAngle) * l1 * scale;
    drawArrow(f1x, pivotY - 5, -1, 'F₁=' + fmt(F1, 1) + 'N', '#2563EB', F1);

    // arm labels
    ctx.fillStyle = '#374151';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('l₁ = ' + fmt(l1) + ' m', pivotX - l1 * scale / 2, pivotY - 16);
    ctx.fillText('l₂ = ' + fmt(l2) + ' m', pivotX + l2 * scale / 2, pivotY - 16);

    // update HTML
    const f1El = document.getElementById('hebF1Val');
    const balEl = document.getElementById('hebBalance');
    const f2El = document.getElementById('hebF2Label');
    const l2El = document.getElementById('hebL2Label');
    if (f1El) f1El.textContent = fmt(F1, 1);
    if (balEl) {
      if (balanced) { balEl.textContent = '✓ Gleichgewicht'; balEl.style.color = '#15803D'; }
      else { balEl.textContent = '✗ Kein GGW'; balEl.style.color = '#DC2626'; }
    }
    if (f2El) f2El.textContent = fmt(F2);
    if (l2El) l2El.textContent = fmt(l2);

    drawHebChart();
    animId = requestAnimationFrame(draw);
  }

  const hebMeas = [];

  function drawHebChart() {
    const c = document.getElementById('hebChart'); if (!c) return;
    const ctx2 = c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:60,r:20,t:22,b:35};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#fafaf9'; ctx2.fillRect(0,0,cW,cH);
    // background bars area
    const F1 = F2*l2/l1, M1=F1*l1, M2=F2*l2;
    const maxM = Math.max(M1,M2,200)*1.1;
    const bW=60, gap=30;
    const barY = P.t+gH;
    // grid lines
    ctx2.strokeStyle='#f0f0f0'; ctx2.lineWidth=1;
    for(let i=1;i<=4;i++){
      const y=P.t+(i/4)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
    }
    // y axis
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.stroke();
    // baseline
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    // y ticks
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='right';
    for(let i=0;i<=4;i++){
      const y=P.t+gH-(i/4)*gH;
      ctx2.fillText((maxM*i/4).toFixed(0), P.l-4, y+4);
    }
    // bar M1
    const m1H=(M1/maxM)*gH;
    ctx2.fillStyle='#2563EB';
    ctx2.fillRect(P.l+gap, barY-m1H, bW, m1H);
    ctx2.font='bold 11px sans-serif'; ctx2.fillStyle='#2563EB'; ctx2.textAlign='center';
    ctx2.fillText('M₁', P.l+gap+bW/2, barY+14);
    ctx2.fillText(M1.toFixed(1)+'N·m', P.l+gap+bW/2, barY+26);
    // bar M2
    const m2H=(M2/maxM)*gH;
    ctx2.fillStyle='#dc2626';
    ctx2.fillRect(P.l+gap+bW+gap, barY-m2H, bW, m2H);
    ctx2.fillStyle='#dc2626';
    ctx2.fillText('M₂', P.l+gap+bW+gap+bW/2, barY+14);
    ctx2.fillText(M2.toFixed(1)+'N·m', P.l+gap+bW+gap+bW/2, barY+26);
    // balance indicator
    const balanced=Math.abs(M1-M2)<0.5;
    ctx2.font='bold 13px sans-serif'; ctx2.fillStyle= balanced?'#16a34a':'#dc2626'; ctx2.textAlign='center';
    ctx2.fillText(balanced?'✓ M₁ = M₂ (Gleichgewicht)':'M₁ ≠ M₂', cW/2, P.t-4);
    // measured points as dots
    ctx2.fillStyle='#f59e0b';
    for(const m of hebMeas){
      const bx=P.l+gap+bW/2+(P.l+gap+bW+gap+bW/2-P.l-gap-bW/2)/2-20;
    }
  }

  function hebMeasure() {
    const F1=F2*l2/l1, M1=F1*l1, M2=F2*l2;
    hebMeas.push({F:parseFloat(F2.toFixed(1)), d:parseFloat(l2.toFixed(2)), M:parseFloat(M2.toFixed(2))});
    updateHebTable();
  }

  function updateHebTable() {
    const tb=document.getElementById('hebTbody'), tw=document.getElementById('hebTable');
    if(!tb||!tw) return;
    if(hebMeas.length>0) tw.style.display='table';
    tb.innerHTML=hebMeas.map(m=>`<tr><td>${m.F.toFixed(1).replace('.',',')}</td><td>${m.d.toFixed(2).replace('.',',')}</td><td>${m.M.toFixed(2).replace('.',',')}</td></tr>`).join('');
  }

  function stop() { if (animId) cancelAnimationFrame(animId); }
  function set(key, val) {
    if (key === 'f2') F2 = val;
    if (key === 'l2') l2 = val;
  }

  draw();
  return { stop, set, measure: hebMeasure };
}

// ============================================================
// SIM 3: OHMSCHES GESETZ
// ============================================================
function _simOhm() {
  const canvas = document.getElementById('ohmCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let U = 6, R = 30;
  let animId = null;

  function fmt(n, d=2) { return n.toFixed(d).replace('.', ','); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);

    const I = U / R;
    const P = U * U / R;
    const glow = Math.min(P / 5, 1); // 0..1

    // circuit layout
    const cx = W / 2, cy = H / 2;
    const bW = 50, bH = 80; // battery
    const topY = cy - 60, botY = cy + 60;
    const leftX = 60, rightX = W - 80;

    // wires
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    // top wire
    ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(rightX, topY); ctx.stroke();
    // bottom wire
    ctx.beginPath(); ctx.moveTo(leftX, botY); ctx.lineTo(rightX, botY); ctx.stroke();
    // left wire
    ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(leftX, botY); ctx.stroke();
    // right wire
    ctx.beginPath(); ctx.moveTo(rightX, topY); ctx.lineTo(rightX, botY); ctx.stroke();

    // battery (left)
    ctx.fillStyle = '#1D4ED8';
    ctx.fillRect(leftX - 18, cy - bH / 2, 36, bH);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+', leftX, cy - 20);
    ctx.fillText('−', leftX, cy + 22);
    ctx.fillStyle = '#BFDBFE';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(fmt(U, 0) + 'V', leftX, cy + 2);

    // resistor (top center)
    const rX = cx - 35, rY = topY - 14, rW = 70, rH = 18;
    ctx.fillStyle = '#92400E';
    ctx.beginPath();
    ctx.roundRect(rX, rY, rW, rH, 4);
    ctx.fill();
    ctx.fillStyle = '#FEF3C7';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fmt(R, 0) + ' Ω', cx, rY + 12);

    // bulb (right side)
    const bulbX = rightX, bulbY = cy;
    const bulbR = 22;
    // glow effect
    if (glow > 0.05) {
      const grad = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, bulbR * 2.5);
      grad.addColorStop(0, `rgba(253,224,71,${glow * 0.8})`);
      grad.addColorStop(1, 'rgba(253,224,71,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, bulbR * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    const bulbColor = `rgb(${Math.round(100 + glow * 155)},${Math.round(80 + glow * 144)},${Math.round(30 + glow * 20)})`;
    ctx.fillStyle = bulbColor;
    ctx.beginPath();
    ctx.arc(bulbX, bulbY, bulbR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();
    // bulb filament
    ctx.strokeStyle = glow > 0.3 ? '#FEF08A' : '#9CA3AF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bulbX - 6, bulbY + 6);
    ctx.lineTo(bulbX - 3, bulbY - 4);
    ctx.lineTo(bulbX, bulbY + 4);
    ctx.lineTo(bulbX + 3, bulbY - 4);
    ctx.lineTo(bulbX + 6, bulbY + 6);
    ctx.stroke();

    // current arrows on top wire
    const arrowColor = `rgba(59,130,246,${0.4 + I / 0.5 * 0.5})`;
    for (let ax = leftX + 40; ax < rightX - 40; ax += 60) {
      ctx.beginPath();
      ctx.moveTo(ax, topY - 6);
      ctx.lineTo(ax + 14, topY - 6);
      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax + 10, topY - 10);
      ctx.lineTo(ax + 14, topY - 6);
      ctx.lineTo(ax + 10, topY - 2);
      ctx.fillStyle = arrowColor;
      ctx.fill();
    }

    // update HTML
    const uEl = document.getElementById('ohmUVal');
    const iEl = document.getElementById('ohmIVal');
    const pEl = document.getElementById('ohmPVal');
    const ulEl = document.getElementById('ohmULabel');
    const rlEl = document.getElementById('ohmRLabel');
    if (uEl) uEl.textContent = fmt(U, 1);
    if (iEl) iEl.textContent = fmt(I, 2);
    if (pEl) pEl.textContent = fmt(P, 2);
    if (ulEl) ulEl.textContent = fmt(U, 1);
    if (rlEl) rlEl.textContent = fmt(R, 0);

    animId = requestAnimationFrame(draw);
  }

  function stop() { if (animId) cancelAnimationFrame(animId); }
  function set(key, val) {
    if (key === 'u') U = val;
    if (key === 'r') R = val;
  }

  draw();
  return { stop, set };
}

// ============================================================
// SIM 4: REIHEN- UND PARALLELSCHALTUNG
// ============================================================
function _simSchaltung() {
  const canvas = document.getElementById('schCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let mode = 'reihe';
  let animId = null;
  const R1 = 30, R2 = 60, Uq = 12;
  let t = 0;

  function fmt(n, d=2) { return n.toFixed(d).replace('.', ','); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);
    t += 0.05;

    const isReihe = mode === 'reihe';
    const Rges = isReihe ? R1 + R2 : R1 * R2 / (R1 + R2);
    const Iges = Uq / Rges;

    if (isReihe) {
      // Series circuit: battery → R1 → R2 → back
      const topY = 50, botY = H - 30;
      const leftX = 50, rightX = W - 50;
      const r1X = leftX + 90, r2X = leftX + 220;

      ctx.strokeStyle = '#374151'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(rightX, topY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(leftX, botY); ctx.lineTo(rightX, botY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(leftX, botY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rightX, topY); ctx.lineTo(rightX, botY); ctx.stroke();

      // battery
      ctx.fillStyle = '#1D4ED8';
      ctx.fillRect(leftX - 16, (topY + botY) / 2 - 30, 32, 60);
      ctx.fillStyle = '#BFDBFE'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('12V', leftX, (topY + botY) / 2 + 4);

      // R1
      ctx.fillStyle = '#7C3AED';
      ctx.fillRect(r1X - 30, topY - 14, 60, 20);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('R₁=30Ω', r1X, topY - 1);
      const u1 = Iges * R1;
      ctx.fillStyle = '#7C3AED'; ctx.font = '10px sans-serif';
      ctx.fillText('U₁=' + fmt(u1, 1) + 'V', r1X, topY + 18);

      // R2
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(r2X - 30, topY - 14, 60, 20);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('R₂=60Ω', r2X, topY - 1);
      const u2 = Iges * R2;
      ctx.fillStyle = '#DC2626'; ctx.font = '10px sans-serif';
      ctx.fillText('U₂=' + fmt(u2, 1) + 'V', r2X, topY + 18);

      // current animation
      const pos = (t * 80) % (2 * (rightX - leftX) + 2 * (botY - topY));
      drawCurrentDot(ctx, pos, topY, botY, leftX, rightX, '#2563EB');

    } else {
      // Parallel circuit
      const topY = 40, botY = H - 30;
      const leftX = 50, rightX = W - 50;
      const r1Y = topY + 40, r2Y = topY + 90;
      const midX1 = leftX + 90, midX2 = rightX - 30;

      ctx.strokeStyle = '#374151'; ctx.lineWidth = 3;
      // main top/bot
      ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(rightX, topY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(leftX, botY); ctx.lineTo(rightX, botY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(leftX, botY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rightX, topY); ctx.lineTo(rightX, botY); ctx.stroke();
      // R1 branch
      ctx.beginPath(); ctx.moveTo(midX1, topY); ctx.lineTo(midX1, r1Y - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(midX1, r1Y + 10); ctx.lineTo(midX1, botY); ctx.stroke();
      // R2 branch
      ctx.beginPath(); ctx.moveTo(midX2, topY); ctx.lineTo(midX2, r2Y - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(midX2, r2Y + 10); ctx.lineTo(midX2, botY); ctx.stroke();
      // horizontal connectors
      ctx.beginPath(); ctx.moveTo(midX1, topY); ctx.lineTo(midX2, topY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(midX1, botY); ctx.lineTo(midX2, botY); ctx.stroke();

      // battery
      ctx.fillStyle = '#1D4ED8';
      ctx.fillRect(leftX - 16, (topY + botY) / 2 - 30, 32, 60);
      ctx.fillStyle = '#BFDBFE'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('12V', leftX, (topY + botY) / 2 + 4);

      // R1
      ctx.fillStyle = '#7C3AED';
      ctx.fillRect(midX1 - 25, r1Y - 10, 50, 20);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('R₁=30Ω', midX1, r1Y + 3);
      ctx.fillStyle = '#7C3AED'; ctx.font = '9px sans-serif';
      ctx.fillText('I₁=' + fmt(Uq / R1, 2) + 'A', midX1, r1Y + 22);

      // R2
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(midX2 - 25, r2Y - 10, 50, 20);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('R₂=60Ω', midX2, r2Y + 3);
      ctx.fillStyle = '#DC2626'; ctx.font = '9px sans-serif';
      ctx.fillText('I₂=' + fmt(Uq / R2, 2) + 'A', midX2, r2Y + 22);
    }

    // update HTML
    const rgesEl = document.getElementById('schRges');
    const igesEl = document.getElementById('schIges');
    const detEl = document.getElementById('schDetails');
    const Rges2 = isReihe ? R1 + R2 : R1 * R2 / (R1 + R2);
    if (rgesEl) rgesEl.textContent = fmt(Rges2, 1);
    if (igesEl) igesEl.textContent = fmt(Uq / Rges2, 2);
    if (detEl) detEl.textContent = isReihe
      ? 'Reihenschaltung: R_ges = R₁+R₂ = ' + fmt(Rges2, 0) + ' Ω  |  I = ' + fmt(Uq / Rges2, 2) + ' A überall gleich'
      : 'Parallelschaltung: 1/R_ges = 1/30+1/60  |  R_ges = ' + fmt(Rges2, 1) + ' Ω  |  I_ges = ' + fmt(Uq / Rges2, 2) + ' A';

    animId = requestAnimationFrame(draw);
  }

  function drawCurrentDot(ctx, pos, topY, botY, leftX, rightX) {
    const perimeter = 2 * (rightX - leftX) + 2 * (botY - topY);
    const p = pos % perimeter;
    let dotX, dotY;
    const top = rightX - leftX, right = botY - topY, bot = rightX - leftX;
    if (p < top) { dotX = leftX + p; dotY = topY; }
    else if (p < top + right) { dotX = rightX; dotY = topY + (p - top); }
    else if (p < top + right + bot) { dotX = rightX - (p - top - right); dotY = botY; }
    else { dotX = leftX; dotY = botY - (p - top - right - bot); }
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FCD34D';
    ctx.fill();
  }

  function stop() { if (animId) cancelAnimationFrame(animId); }
  function setMode(m) {
    mode = m;
    const rBtn = document.getElementById('schBtnReihe');
    const pBtn = document.getElementById('schBtnParallel');
    if (rBtn && pBtn) {
      rBtn.className = m === 'reihe' ? 'sim-btn primary' : 'sim-btn';
      pBtn.className = m === 'parallel' ? 'sim-btn primary' : 'sim-btn';
    }
  }

  draw();
  return { stop, setMode };
}

// ============================================================
// SIM 5: BESCHLEUNIGTE BEWEGUNG – mit s-t / v-t / a-t Diagrammen
// ============================================================
function _simBeschleunigung() {
  const cvA  = document.getElementById('beschAnim');
  const ctA  = cvA ? cvA.getContext('2d') : null;
  const cvST = document.getElementById('beschCST');
  const ctST = cvST ? cvST.getContext('2d') : null;
  const cvAT = document.getElementById('beschCAT');
  const ctAT = cvAT ? cvAT.getContext('2d') : null;
  const cvBig = document.getElementById('beschChart');
  const ctBig = cvBig ? cvBig.getContext('2d') : null;

  let a = 3, running = false, t = 0, lastTs = null, raf = null;
  let meas = [], sel = [];
  const maxT = 8;

  function fmt(n,d=1){ return n.toFixed(d).replace('.',','); }
  function getSMax(){ return Math.max(0.5*a*maxT*maxT, 1); }

  // ── Animations-Canvas: Auto auf Straße (700×130) ──────────
  function drawAnim() {
    if (!cvA || !ctA) return;
    const W = cvA.width, H = cvA.height;
    const v = a*t, s = 0.5*a*t*t;
    const sMax = getSMax();
    ctA.clearRect(0,0,W,H);
    // Himmel
    ctA.fillStyle='#C9E8F5'; ctA.fillRect(0,0,W,H*0.55);
    // Wiese
    ctA.fillStyle='#9DC88D'; ctA.fillRect(0,H*0.55,W,H*0.18);
    // Straße
    ctA.fillStyle='#6B6B6B'; ctA.fillRect(0,H*0.70,W,H*0.30);
    ctA.fillStyle='#FFF'; ctA.fillRect(0,H*0.70,W,3); ctA.fillRect(0,H-3,W,3);
    ctA.strokeStyle='#FFD700'; ctA.setLineDash([22,16]); ctA.lineWidth=2;
    ctA.beginPath(); ctA.moveTo(0,H*0.845); ctA.lineTo(W,H*0.845); ctA.stroke();
    ctA.setLineDash([]);
    // Abstandsmarkierungen
    const step = sMax<=50?10:sMax<=100?20:40;
    ctA.font='10px Nunito,sans-serif'; ctA.textAlign='center';
    for(let m=0; m<=sMax; m+=step){
      const x=(m/sMax)*W;
      ctA.fillStyle='#BBB'; ctA.fillRect(x-1,H*0.70,2,7);
      ctA.fillStyle='#444'; ctA.fillText(m.toFixed(0)+' m',x,H*0.67);
    }
    // Auto
    const carW=68, maxCarX=W-carW-10;
    const carX=Math.min((s/sMax)*maxCarX, maxCarX);
    const bY=H*0.72;
    ctA.fillStyle='#E74C3C';
    ctA.beginPath();
    ctA.moveTo(carX+4,bY+24); ctA.lineTo(carX+4,bY+7);
    ctA.lineTo(carX+14,bY+7); ctA.lineTo(carX+20,bY);
    ctA.lineTo(carX+50,bY);   ctA.lineTo(carX+56,bY+7);
    ctA.lineTo(carX+68,bY+7); ctA.lineTo(carX+68,bY+24);
    ctA.closePath(); ctA.fill();
    ctA.fillStyle='#C0392B'; ctA.fillRect(carX+21,bY,29,8);
    ctA.fillStyle='#AED6F1';
    ctA.fillRect(carX+22,bY+1,11,7); ctA.fillRect(carX+36,bY+1,11,7);
    [carX+14, carX+54].forEach(wx=>{
      ctA.fillStyle='#222'; ctA.beginPath(); ctA.arc(wx,bY+25,8,0,Math.PI*2); ctA.fill();
      ctA.fillStyle='#888'; ctA.beginPath(); ctA.arc(wx,bY+25,4,0,Math.PI*2); ctA.fill();
    });
    // Beschleunigungspfeil (zeigt Kraft)
    if(a>0 && t<maxT){
      const arLen=Math.min(8+a*5,50);
      ctA.strokeStyle='#dc2626'; ctA.lineWidth=2.5;
      ctA.beginPath(); ctA.moveTo(carX+68,bY+12); ctA.lineTo(carX+68+arLen,bY+12); ctA.stroke();
      ctA.fillStyle='#dc2626';
      ctA.beginPath(); ctA.moveTo(carX+68+arLen,bY+6); ctA.lineTo(carX+68+arLen+8,bY+12); ctA.lineTo(carX+68+arLen,bY+18); ctA.fill();
    }
    // Positionslinie
    const cx=carX+36;
    ctA.strokeStyle='rgba(231,76,60,.5)'; ctA.setLineDash([4,4]); ctA.lineWidth=1.5;
    ctA.beginPath(); ctA.moveTo(cx,H*0.70); ctA.lineTo(cx,H); ctA.stroke();
    ctA.setLineDash([]);
  }

  // ── Großes v-t Diagramm mit Klick-Auswahl ────────────────
  function drawBeschChart() {
    if (!cvBig || !ctBig) return;
    const cW = cvBig.width, cH = cvBig.height;
    const P = {l:58, r:20, t:22, b:48};
    const gW = cW - P.l - P.r, gH = cH - P.t - P.b;
    const vMax = Math.max(Math.ceil((a * maxT * 1.1) / 5) * 5, 5);
    const tX = tt => P.l + (tt / maxT) * gW;
    const vY = vv => P.t + gH - (vv / vMax) * gH;

    ctBig.clearRect(0, 0, cW, cH);
    // Gitter
    ctBig.strokeStyle = '#F0F0F0'; ctBig.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const y = P.t + (i/5)*gH;
      ctBig.beginPath(); ctBig.moveTo(P.l, y); ctBig.lineTo(P.l+gW, y); ctBig.stroke();
      const x = P.l + (i/5)*gW;
      ctBig.beginPath(); ctBig.moveTo(x, P.t); ctBig.lineTo(x, P.t+gH); ctBig.stroke();
    }
    // Theoretische Linie v = a·t (gestrichelt)
    ctBig.strokeStyle = 'rgba(59,130,246,.22)'; ctBig.lineWidth = 2.5; ctBig.setLineDash([7,5]);
    ctBig.beginPath();
    ctBig.moveTo(tX(0), vY(0));
    ctBig.lineTo(tX(maxT), vY(a * maxT));
    ctBig.stroke();
    ctBig.setLineDash([]);
    // "v = a·t" Beschriftung an der theoretischen Linie
    ctBig.fillStyle = 'rgba(59,130,246,.7)';
    ctBig.font = 'bold 11px Nunito,sans-serif'; ctBig.textAlign = 'left';
    const lblT = maxT * 0.55, lblV = a * lblT;
    ctBig.fillText('v = a·t', tX(lblT) + 4, vY(lblV) - 6);
    // Achsen
    ctBig.strokeStyle = '#333'; ctBig.lineWidth = 2.5;
    ctBig.beginPath(); ctBig.moveTo(P.l, P.t); ctBig.lineTo(P.l, P.t+gH); ctBig.lineTo(P.l+gW, P.t+gH); ctBig.stroke();
    // Pfeilspitzen
    ctBig.fillStyle = '#333';
    ctBig.beginPath(); ctBig.moveTo(P.l+gW, P.t+gH); ctBig.lineTo(P.l+gW+8, P.t+gH-4); ctBig.lineTo(P.l+gW+8, P.t+gH+4); ctBig.fill();
    ctBig.beginPath(); ctBig.moveTo(P.l, P.t); ctBig.lineTo(P.l-4, P.t+9); ctBig.lineTo(P.l+4, P.t+9); ctBig.fill();
    // Achsen-Beschriftung
    ctBig.font = 'bold 13px Nunito,sans-serif'; ctBig.fillStyle = '#333'; ctBig.textAlign = 'center';
    ctBig.fillText('t in s', P.l+gW/2, cH-4);
    ctBig.save(); ctBig.translate(14, P.t+gH/2); ctBig.rotate(-Math.PI/2);
    ctBig.fillText('v in m/s', 0, 0); ctBig.restore();
    // Skalenwerte
    ctBig.font = '11px Nunito,sans-serif'; ctBig.fillStyle = '#666';
    for (let i = 0; i <= 5; i++) {
      ctBig.textAlign = 'center';
      ctBig.fillText(((i/5)*maxT).toFixed(0), tX((i/5)*maxT), P.t+gH+16);
      ctBig.textAlign = 'right';
      ctBig.fillText(((i/5)*vMax).toFixed(0), P.l-6, vY((i/5)*vMax)+4);
    }
    // Messpunkte zeichnen
    meas.forEach((m, i) => {
      const px = tX(m.t), py = vY(m.v);
      const isSel = sel.includes(i);
      ctBig.beginPath(); ctBig.arc(px, py, isSel ? 8 : 6, 0, Math.PI*2);
      ctBig.fillStyle = isSel ? '#DC2626' : '#7c3aed'; ctBig.fill();
      ctBig.fillStyle = '#fff'; ctBig.font = 'bold 9px Nunito,sans-serif'; ctBig.textAlign = 'center';
      ctBig.fillText(i+1, px, py+3);
    });
    // Wenn 2 Punkte gewählt: Steigungslinie + Ergebnis
    if (sel.length === 2) {
      const p1 = meas[sel[0]], p2 = meas[sel[1]];
      const dt = p2.t - p1.t, dv = p2.v - p1.v;
      if (Math.abs(dt) > 0.01) {
        const slope = dv / dt;
        ctBig.strokeStyle = '#DC2626'; ctBig.lineWidth = 2.5;
        ctBig.beginPath(); ctBig.moveTo(tX(p1.t), vY(p1.v)); ctBig.lineTo(tX(p2.t), vY(p2.v)); ctBig.stroke();
        const res = document.getElementById('beschResult');
        if (res) res.innerHTML =
          `📏 <b>Δv / Δt = ${fmt(Math.abs(dv),2)} m/s ÷ ${fmt(Math.abs(dt),2)} s = ${fmt(Math.abs(slope),2)} m/s²</b> &nbsp;← das ist die Beschleunigung a!`;
      }
    }
  }

  function measure() {
    if (t < 0.05) return;
    const v = a * t, s = 0.5 * a * t * t;
    meas.push({ t: parseFloat(t.toFixed(2)), v: parseFloat(v.toFixed(2)), s: parseFloat(s.toFixed(2)), a });
    sel = [];
    const res = document.getElementById('beschResult');
    if (res) res.innerHTML = '';
    drawBeschChart(); drawChartST(); drawChartAT();
    updateTable();
  }

  function updateTable() {
    const tb = document.getElementById('beschTbody');
    const tw = document.getElementById('beschTable');
    if (!tb || !tw) return;
    tw.style.display = meas.length > 0 ? '' : 'none';
    tb.innerHTML = meas.map((m, i) =>
      `<tr><td>P${i+1}</td><td>${fmt(m.t,2)}</td><td>${fmt(m.v,2)}</td><td>${fmt(m.s,2)}</td><td>${m.a.toFixed(1)}</td></tr>`
    ).join('');
  }

  function handleClick(mx, my) {
    if (!cvBig) return;
    const cW = cvBig.width, cH = cvBig.height;
    const P = {l:58, r:20, t:22, b:48};
    const gW = cW - P.l - P.r, gH = cH - P.t - P.b;
    const vMax = Math.max(Math.ceil((a * maxT * 1.1) / 5) * 5, 5);
    const tX = tt => P.l + (tt / maxT) * gW;
    const vY = vv => P.t + gH - (vv / vMax) * gH;
    let closest = -1, minD = 24;
    meas.forEach((m, i) => {
      const d = Math.hypot(tX(m.t) - mx, vY(m.v) - my);
      if (d < minD) { minD = d; closest = i; }
    });
    if (closest >= 0) {
      if (sel.includes(closest)) sel = sel.filter(i => i !== closest);
      else if (sel.length < 2) sel.push(closest);
      else sel = [closest];
      drawBeschChart();
    }
  }

  // ── Kleines s-t Diagramm (Parabel) ───────────────────────
  function drawChartST() {
    if (!cvST || !ctST) return;
    const cW=cvST.width, cH=cvST.height;
    const P={l:58,r:20,t:22,b:48};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const sMax=Math.max(Math.ceil(getSMax()*1.05/5)*5,5);
    const tX=tt=>P.l+(tt/maxT)*gW;
    const sY=ss=>P.t+gH-(Math.min(ss,sMax)/sMax)*gH;
    ctST.clearRect(0,0,cW,cH);
    ctST.fillStyle='#f8fafc'; ctST.fillRect(0,0,cW,cH);
    // Grid
    ctST.strokeStyle='#F0F0F0'; ctST.lineWidth=1;
    for(let i=1;i<=5;i++){
      ctST.beginPath(); ctST.moveTo(P.l,P.t+(i/5)*gH); ctST.lineTo(P.l+gW,P.t+(i/5)*gH); ctST.stroke();
      ctST.beginPath(); ctST.moveTo(P.l+(i/5)*gW,P.t); ctST.lineTo(P.l+(i/5)*gW,P.t+gH); ctST.stroke();
    }
    // Achsen
    ctST.strokeStyle='#333'; ctST.lineWidth=2.5;
    ctST.beginPath(); ctST.moveTo(P.l,P.t); ctST.lineTo(P.l,P.t+gH); ctST.lineTo(P.l+gW,P.t+gH); ctST.stroke();
    ctST.fillStyle='#333';
    ctST.beginPath(); ctST.moveTo(P.l+gW,P.t+gH); ctST.lineTo(P.l+gW+8,P.t+gH-4); ctST.lineTo(P.l+gW+8,P.t+gH+4); ctST.fill();
    ctST.beginPath(); ctST.moveTo(P.l,P.t); ctST.lineTo(P.l-4,P.t+9); ctST.lineTo(P.l+4,P.t+9); ctST.fill();
    ctST.font='bold 13px Nunito,sans-serif'; ctST.fillStyle='#333'; ctST.textAlign='center';
    ctST.fillText('t in s',P.l+gW/2,cH-4);
    ctST.save(); ctST.translate(14,P.t+gH/2); ctST.rotate(-Math.PI/2); ctST.fillText('s in m',0,0); ctST.restore();
    ctST.font='11px Nunito,sans-serif'; ctST.fillStyle='#666';
    for(let i=0;i<=5;i++){
      ctST.textAlign='center'; ctST.fillText(((i/5)*maxT).toFixed(0),tX((i/5)*maxT),P.t+gH+16);
      ctST.textAlign='right';  ctST.fillText(((i/5)*sMax).toFixed(0),P.l-6,sY((i/5)*sMax)+4);
    }
    // Theoretische Parabel (gestrichelt)
    ctST.strokeStyle='rgba(124,58,237,.22)'; ctST.lineWidth=2.5; ctST.setLineDash([7,5]);
    ctST.beginPath();
    for(let i=0;i<=60;i++){
      const tt=(i/60)*maxT, ss=0.5*a*tt*tt;
      i===0?ctST.moveTo(tX(tt),sY(ss)):ctST.lineTo(tX(tt),sY(ss));
    }
    ctST.stroke(); ctST.setLineDash([]);
    ctST.fillStyle='rgba(124,58,237,.7)'; ctST.font='bold 11px Nunito,sans-serif'; ctST.textAlign='left';
    ctST.fillText('s = ½·a·t²',tX(maxT*0.45)+4,sY(0.5*a*(maxT*0.45)**2)-8);
    // Live-Cursor
    if(t>0.05){
      ctST.fillStyle='rgba(124,58,237,.35)';
      ctST.beginPath(); ctST.arc(tX(t),sY(0.5*a*t*t),5,0,Math.PI*2); ctST.fill();
    }
    // Messpunkte
    meas.forEach((m,idx)=>{
      ctST.fillStyle='#7c3aed'; ctST.strokeStyle='#5b21b6'; ctST.lineWidth=2;
      ctST.beginPath(); ctST.arc(tX(m.t),sY(m.s),7,0,Math.PI*2); ctST.fill(); ctST.stroke();
      ctST.fillStyle='#fff'; ctST.font='bold 9px Nunito,sans-serif'; ctST.textAlign='center';
      ctST.fillText(idx+1,tX(m.t),sY(m.s)+3);
    });
  }

  // ── Kleines a-t Diagramm (a = konst. ≠ 0) ────────────────
  function drawChartAT() {
    if (!cvAT || !ctAT) return;
    const cW=cvAT.width, cH=cvAT.height;
    const P={l:58,r:20,t:22,b:48};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const aMax=Math.max(Math.ceil(a*1.5/2)*2,4);
    const tX=tt=>P.l+(tt/maxT)*gW;
    const aY=aa=>P.t+gH-(aa/aMax)*gH;
    ctAT.clearRect(0,0,cW,cH);
    ctAT.fillStyle='#f8fafc'; ctAT.fillRect(0,0,cW,cH);
    // Grid
    ctAT.strokeStyle='#F0F0F0'; ctAT.lineWidth=1;
    for(let i=1;i<=5;i++){
      ctAT.beginPath(); ctAT.moveTo(P.l,P.t+(i/5)*gH); ctAT.lineTo(P.l+gW,P.t+(i/5)*gH); ctAT.stroke();
      ctAT.beginPath(); ctAT.moveTo(P.l+(i/5)*gW,P.t); ctAT.lineTo(P.l+(i/5)*gW,P.t+gH); ctAT.stroke();
    }
    // Achsen
    ctAT.strokeStyle='#333'; ctAT.lineWidth=2.5;
    ctAT.beginPath(); ctAT.moveTo(P.l,P.t); ctAT.lineTo(P.l,P.t+gH); ctAT.lineTo(P.l+gW,P.t+gH); ctAT.stroke();
    ctAT.fillStyle='#333';
    ctAT.beginPath(); ctAT.moveTo(P.l+gW,P.t+gH); ctAT.lineTo(P.l+gW+8,P.t+gH-4); ctAT.lineTo(P.l+gW+8,P.t+gH+4); ctAT.fill();
    ctAT.beginPath(); ctAT.moveTo(P.l,P.t); ctAT.lineTo(P.l-4,P.t+9); ctAT.lineTo(P.l+4,P.t+9); ctAT.fill();
    ctAT.font='bold 13px Nunito,sans-serif'; ctAT.fillStyle='#333'; ctAT.textAlign='center';
    ctAT.fillText('t in s',P.l+gW/2,cH-4);
    ctAT.save(); ctAT.translate(14,P.t+gH/2); ctAT.rotate(-Math.PI/2); ctAT.fillText('a in m/s²',0,0); ctAT.restore();
    ctAT.font='11px Nunito,sans-serif'; ctAT.fillStyle='#666';
    for(let i=0;i<=5;i++){ ctAT.textAlign='center'; ctAT.fillText(((i/5)*maxT).toFixed(0),tX((i/5)*maxT),P.t+gH+16); }
    for(let i=0;i<=3;i++){ ctAT.textAlign='right'; ctAT.fillText(((i/3)*aMax).toFixed(0),P.l-6,aY((i/3)*aMax)+4); }
    // Konstante a-Linie
    if(t>0.05){
      ctAT.fillStyle='rgba(220,38,38,.1)'; ctAT.fillRect(P.l,aY(a)-4,tX(t)-P.l,8);
      ctAT.strokeStyle='#dc2626'; ctAT.lineWidth=3;
      ctAT.beginPath(); ctAT.moveTo(P.l,aY(a)); ctAT.lineTo(tX(t),aY(a)); ctAT.stroke();
      ctAT.fillStyle='rgba(220,38,38,.4)';
      ctAT.beginPath(); ctAT.arc(tX(t),aY(a),5,0,Math.PI*2); ctAT.fill();
    }
    if(t>0.5){
      ctAT.fillStyle='#dc2626'; ctAT.font='bold 12px Nunito,sans-serif'; ctAT.textAlign='left';
      ctAT.fillText('a = '+a.toFixed(1)+' m/s²',P.l+10,aY(a)-8);
    }
    // Messpunkte auf Höhe a
    meas.forEach((m,idx)=>{
      ctAT.fillStyle='#dc2626'; ctAT.strokeStyle='#b91c1c'; ctAT.lineWidth=2;
      ctAT.beginPath(); ctAT.arc(tX(m.t),aY(a),7,0,Math.PI*2); ctAT.fill(); ctAT.stroke();
      ctAT.fillStyle='#fff'; ctAT.font='bold 9px Nunito,sans-serif'; ctAT.textAlign='center';
      ctAT.fillText(idx+1,tX(m.t),aY(a)+3);
    });
  }

  // ── Shared Diagram Renderer ───────────────────────────────
  function drawDiagram(ctx, cv, color, yLabel, yMin, yMax, getData) {
    const W=cv.width, H=cv.height, pL=34, pB=18, pT=8, pR=6;
    const iW=W-pL-pR, iH=H-pT-pB;
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#f8fafc'); bg.addColorStop(1,'#fff');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    // Grid
    ctx.strokeStyle='#f1f5f9'; ctx.lineWidth=0.8;
    for(let i=0;i<=4;i++){
      ctx.beginPath(); ctx.moveTo(pL, pT+iH*i/4); ctx.lineTo(W-pR, pT+iH*i/4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pL+iW*i/4, pT); ctx.lineTo(pL+iW*i/4, H-pB); ctx.stroke();
    }
    // Achsen
    ctx.strokeStyle='#94a3b8'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(pL,pT); ctx.lineTo(pL,H-pB); ctx.moveTo(pL,H-pB); ctx.lineTo(W-pR,H-pB); ctx.stroke();
    // Beschriftung
    ctx.fillStyle='#64748b'; ctx.font='bold 8px sans-serif'; ctx.textAlign='center';
    ctx.fillText('t / s', W-pR+2, H-pB-2);
    ctx.save(); ctx.translate(10,pT+iH/2); ctx.rotate(-Math.PI/2); ctx.fillText(yLabel,0,0); ctx.restore();
    // Y-Werte
    ctx.fillStyle='#94a3b8'; ctx.font='7px sans-serif'; ctx.textAlign='right';
    for(let i=0;i<=2;i++){
      const val=yMax-(yMax-yMin)*i/2, y=pT+iH*i/2;
      ctx.fillText(val%1===0?val.toFixed(0):val.toFixed(1), pL-3, y+3);
    }
    // X-Werte
    ctx.textAlign='center'; ctx.fillStyle='#94a3b8';
    for(let i=0;i<=2;i++) ctx.fillText((maxT*i/2).toFixed(0), pL+iW*i/2, H-4);

    const data = getData();
    if(data.length < 2){
      ctx.strokeStyle=color+'44'; ctx.lineWidth=1; ctx.setLineDash([4,4]);
      const y0=pT+iH*(1-(0-yMin)/(yMax-yMin));
      ctx.beginPath(); ctx.moveTo(pL,Math.max(pT,Math.min(H-pB,y0))); ctx.lineTo(W-pR,Math.max(pT,Math.min(H-pB,y0))); ctx.stroke();
      ctx.setLineDash([]); return;
    }
    // Füllung
    const clipY=p=>Math.max(pT,Math.min(H-pB,pT+iH*(1-(p.y-yMin)/(yMax-yMin))));
    ctx.beginPath();
    data.forEach((p,i)=>{ const px=pL+(p.t/maxT)*iW; i===0?ctx.moveTo(px,clipY(p)):ctx.lineTo(px,clipY(p)); });
    ctx.lineTo(pL+(data[data.length-1].t/maxT)*iW,H-pB); ctx.lineTo(pL,H-pB); ctx.closePath();
    ctx.fillStyle=color+'22'; ctx.fill();
    // Linie
    ctx.strokeStyle=color; ctx.lineWidth=2.2; ctx.lineJoin='round'; ctx.setLineDash([]);
    ctx.beginPath();
    data.forEach((p,i)=>{ const px=pL+(p.t/maxT)*iW; i===0?ctx.moveTo(px,clipY(p)):ctx.lineTo(px,clipY(p)); });
    ctx.stroke();
    // Aktueller Punkt
    const lp=data[data.length-1];
    const lpx=pL+(lp.t/maxT)*iW, lpy=clipY(lp);
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(lpx,lpy,4.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=color; ctx.beginPath(); ctx.arc(lpx,lpy,3,0,Math.PI*2); ctx.fill();
    ctx.font='bold 8px sans-serif'; ctx.textAlign='left'; ctx.fillStyle=color;
    ctx.fillText(lp.y%1===0?lp.y.toFixed(0):lp.y.toFixed(1), Math.min(lpx+5,W-pR-16), Math.max(pT+8,lpy-3));
  }

  // ── Animations-Canvas: Auto auf Straße ───────────────────
  function drawAnim() {
    const W=cvA.width, H=cvA.height;
    ctA.clearRect(0,0,W,H);
    const v = a*t, s = 0.5*a*t*t;
    const sMax = Math.max(0.5*a*maxT*maxT, 1);

    // Himmel
    ctA.fillStyle='#C9E8F5'; ctA.fillRect(0,0,W,H*0.45);
    // Wiese
    ctA.fillStyle='#9DC88D'; ctA.fillRect(0,H*0.45,W,H*0.18);
    // Straße
    ctA.fillStyle='#6B6B6B'; ctA.fillRect(0,H*0.60,W,H*0.40);
    ctA.fillStyle='#FFF'; ctA.fillRect(0,H*0.60,W,3); ctA.fillRect(0,H-3,W,3);
    // Straßenmarkierung (gestrichelt)
    ctA.strokeStyle='#FFD700'; ctA.setLineDash([18,12]); ctA.lineWidth=2;
    ctA.beginPath(); ctA.moveTo(0,H*0.80); ctA.lineTo(W,H*0.80); ctA.stroke();
    ctA.setLineDash([]);

    // Auto-Position
    const carW = 68, maxCarX = W - carW - 10;
    const carX = Math.min((s/sMax)*maxCarX, maxCarX);
    const bY = H*0.62;

    // Auto zeichnen (rot, wie bei 1.2)
    ctA.fillStyle='#E74C3C';
    ctA.beginPath();
    ctA.moveTo(carX+4,  bY+24); ctA.lineTo(carX+4,  bY+7);
    ctA.lineTo(carX+14, bY+7);  ctA.lineTo(carX+20, bY);
    ctA.lineTo(carX+50, bY);    ctA.lineTo(carX+56, bY+7);
    ctA.lineTo(carX+68, bY+7);  ctA.lineTo(carX+68, bY+24);
    ctA.closePath(); ctA.fill();
    ctA.fillStyle='#C0392B'; ctA.fillRect(carX+21,bY,29,8);
    ctA.fillStyle='#AED6F1';
    ctA.fillRect(carX+22,bY+1,11,7); ctA.fillRect(carX+36,bY+1,11,7);
    // Räder
    [carX+14, carX+54].forEach(wx => {
      ctA.fillStyle='#222'; ctA.beginPath(); ctA.arc(wx,bY+25,8,0,Math.PI*2); ctA.fill();
      ctA.fillStyle='#888'; ctA.beginPath(); ctA.arc(wx,bY+25,4,0,Math.PI*2); ctA.fill();
    });
    // Kraft-Pfeil (zeigt Beschleunigung)
    if(a>0){
      const arLen=Math.min(8+a*5,50);
      ctA.strokeStyle='#dc2626'; ctA.lineWidth=2.5;
      ctA.beginPath(); ctA.moveTo(carX+68,bY+12); ctA.lineTo(carX+68+arLen,bY+12); ctA.stroke();
      ctA.fillStyle='#dc2626';
      ctA.beginPath(); ctA.moveTo(carX+68+arLen,bY+6); ctA.lineTo(carX+68+arLen+8,bY+12); ctA.lineTo(carX+68+arLen,bY+18); ctA.fill();
      ctA.fillStyle='#dc2626'; ctA.font='bold 9px sans-serif'; ctA.textAlign='left';
      ctA.fillText('F', carX+68+arLen+11, bY+16);
    }
    // Info-Badge
    ctA.fillStyle='rgba(255,255,255,0.9)'; ctA.beginPath(); ctA.roundRect(6,4,130,36,6); ctA.fill();
    ctA.fillStyle='#374151'; ctA.font='bold 10px sans-serif'; ctA.textAlign='left';
    ctA.fillText(`v = ${v.toFixed(1)} m/s`, 12, 18);
    ctA.fillText(`s = ${s.toFixed(1)} m  |  t = ${t.toFixed(1)} s`, 12, 33);
    // Geschwindigkeits-Balken (rechts, wächst mit v)
    const vFull = a * maxT || 1;
    const barFill = Math.min(v / vFull, 1);
    const bW=12, bH=Math.round(H*0.76), bX=W-bW-5, bY2=Math.round(H*0.10);
    ctA.fillStyle='rgba(255,255,255,0.82)';
    ctA.beginPath(); ctA.roundRect(bX-3, bY2-13, bW+6, bH+24, 4); ctA.fill();
    ctA.fillStyle='rgba(124,58,237,0.10)';
    ctA.beginPath(); ctA.roundRect(bX, bY2, bW, bH, 3); ctA.fill();
    if(barFill>0){
      const fillH2=Math.round(bH*barFill);
      const grd=ctA.createLinearGradient(0,bY2+bH-fillH2,0,bY2+bH);
      grd.addColorStop(0,'#7c3aed'); grd.addColorStop(1,'#dc2626');
      ctA.fillStyle=grd;
      ctA.beginPath(); ctA.roundRect(bX, bY2+bH-fillH2, bW, fillH2, 3); ctA.fill();
    }
    ctA.strokeStyle='rgba(124,58,237,0.25)'; ctA.lineWidth=0.8;
    ctA.strokeRect(bX,bY2,bW,bH);
    ctA.fillStyle='#5b21b6'; ctA.font='bold 8px sans-serif'; ctA.textAlign='center';
    ctA.fillText('v', bX+bW/2, bY2-4);
    ctA.fillText(fmt(v,0), bX+bW/2, bY2+bH+10);
  }

  // ── Frame-Loop ────────────────────────────────────────────
  function frame(ts) {
    if(running){
      if(lastTs!==null){
        const dt=Math.min((ts-lastTs)/1000,0.05);
        t=Math.min(t+dt,maxT);
        if(t>=maxT){ running=false; const b=document.getElementById('beschPlayBtn'); if(b)b.textContent='▶ Start'; }
      }
      lastTs=ts;
    }
    drawAnim();
    // Info-Zeile aktualisieren
    const v2=a*t, s2=0.5*a*t*t;
    const tEl=document.getElementById('beschTVal'); if(tEl)tEl.textContent=fmt(t)+' s';
    const vEl=document.getElementById('beschVVal'); if(vEl)vEl.textContent=fmt(v2)+' m/s';
    const sEl=document.getElementById('beschSVal'); if(sEl)sEl.textContent=fmt(s2)+' m';
    // Alle Diagramme
    drawBeschChart();
    drawChartST();
    drawChartAT();
    raf=requestAnimationFrame(frame);
  }

  function stop(){ if(raf)cancelAnimationFrame(raf); running=false; lastTs=null; }

  function setA(val){ a=val; }

  function toggle(){
    if(running){ running=false; lastTs=null; const b=document.getElementById('beschPlayBtn'); if(b)b.textContent='▶ Weiter'; }
    else { if(t>=maxT){t=0; meas=[]; sel=[];} running=true; const b=document.getElementById('beschPlayBtn'); if(b)b.textContent='⏸ Pause'; }
  }

  function reset(){
    running=false; lastTs=null; t=0; meas=[]; sel=[];
    const b=document.getElementById('beschPlayBtn'); if(b) b.textContent='▶ Start';
    const res=document.getElementById('beschResult'); if(res) res.innerHTML='';
    const tb=document.getElementById('beschTbody'); if(tb) tb.innerHTML='';
    const tw=document.getElementById('beschTable'); if(tw) tw.style.display='none';
    drawAnim(); drawBeschChart(); drawChartST(); drawChartAT();
  }

  reset();
  raf=requestAnimationFrame(frame);
  return { stop, setA, toggle, reset, measure, handleClick };
}

// ============================================================
// SIM 6: FREIER FALL – mit s-t / v-t / a-t Diagrammen
// ============================================================
function _simFreierFall() {
  const cvA  = document.getElementById('fallAnim');
  const ctA  = cvA.getContext('2d');
  const cvST = document.getElementById('fallCST'), ctST = cvST.getContext('2d');
  const cvVT = document.getElementById('fallCVT'), ctVT = cvVT.getContext('2d');
  const cvAT = document.getElementById('fallCAT'), ctAT = cvAT.getContext('2d');

  const g = 9.81;
  let h0 = 20, running = false, t = 0, lastTs = null, raf = null;
  let pts = []; // {t, s, v}

  function fmt(n,d=1){ return n.toFixed(d).replace('.',','); }

  const tFall = ()=>Math.sqrt(2*h0/g);

  // ── Shared Diagram Renderer ───────────────────────────────
  function drawDiagram(ctx, cv, color, yLabel, yMin, yMax, data, tMax) {
    const W=cv.width, H=cv.height, pL=34, pB=18, pT=8, pR=6;
    const iW=W-pL-pR, iH=H-pT-pB;
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#f8fafc'); bg.addColorStop(1,'#fff');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#f1f5f9'; ctx.lineWidth=0.8;
    for(let i=0;i<=4;i++){
      ctx.beginPath(); ctx.moveTo(pL,pT+iH*i/4); ctx.lineTo(W-pR,pT+iH*i/4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pL+iW*i/4,pT); ctx.lineTo(pL+iW*i/4,H-pB); ctx.stroke();
    }
    ctx.strokeStyle='#94a3b8'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(pL,pT); ctx.lineTo(pL,H-pB); ctx.moveTo(pL,H-pB); ctx.lineTo(W-pR,H-pB); ctx.stroke();
    ctx.fillStyle='#64748b'; ctx.font='bold 8px sans-serif'; ctx.textAlign='center';
    ctx.fillText('t / s', W-pR+2, H-pB-2);
    ctx.save(); ctx.translate(10,pT+iH/2); ctx.rotate(-Math.PI/2); ctx.fillText(yLabel,0,0); ctx.restore();
    ctx.fillStyle='#94a3b8'; ctx.font='7px sans-serif'; ctx.textAlign='right';
    for(let i=0;i<=2;i++){
      const val=yMax-(yMax-yMin)*i/2, y=pT+iH*i/2;
      ctx.fillText(val%1===0?val.toFixed(0):val.toFixed(1), pL-3, y+3);
    }
    ctx.textAlign='center'; ctx.fillStyle='#94a3b8';
    for(let i=0;i<=2;i++) ctx.fillText((tMax*i/2).toFixed(1), pL+iW*i/2, H-4);

    const clipY=p=>Math.max(pT,Math.min(H-pB,pT+iH*(1-(p.y-yMin)/(yMax-yMin))));
    if(data.length<2){
      ctx.strokeStyle=color+'44'; ctx.lineWidth=1; ctx.setLineDash([4,4]);
      const y0=pT+iH*(1-(0-yMin)/(yMax-yMin));
      ctx.beginPath(); ctx.moveTo(pL,Math.max(pT,Math.min(H-pB,y0))); ctx.lineTo(W-pR,Math.max(pT,Math.min(H-pB,y0))); ctx.stroke();
      ctx.setLineDash([]); return;
    }
    ctx.beginPath();
    data.forEach((p,i)=>{ const px=pL+(p.t/tMax)*iW; i===0?ctx.moveTo(px,clipY(p)):ctx.lineTo(px,clipY(p)); });
    ctx.lineTo(pL+(data[data.length-1].t/tMax)*iW,H-pB); ctx.lineTo(pL,H-pB); ctx.closePath();
    ctx.fillStyle=color+'22'; ctx.fill();
    ctx.strokeStyle=color; ctx.lineWidth=2.2; ctx.lineJoin='round'; ctx.setLineDash([]);
    ctx.beginPath();
    data.forEach((p,i)=>{ const px=pL+(p.t/tMax)*iW; i===0?ctx.moveTo(px,clipY(p)):ctx.lineTo(px,clipY(p)); });
    ctx.stroke();
    const lp=data[data.length-1];
    const lpx=pL+(lp.t/tMax)*iW, lpy=clipY(lp);
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(lpx,lpy,4.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=color; ctx.beginPath(); ctx.arc(lpx,lpy,3,0,Math.PI*2); ctx.fill();
    ctx.font='bold 8px sans-serif'; ctx.textAlign='left'; ctx.fillStyle=color;
    ctx.fillText(lp.y%1===0?lp.y.toFixed(0):lp.y.toFixed(1), Math.min(lpx+5,W-pR-16), Math.max(pT+8,lpy-3));
  }

  // ── Animations-Canvas ─────────────────────────────────────
  function drawAnim(curT) {
    const W=cvA.width, H=cvA.height;
    const fallen=0.5*g*curT*curT;
    const h=Math.max(h0-fallen,0);
    const v=g*curT;

    ctA.clearRect(0,0,W,H);
    // Himmel
    const sky=ctA.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#bfdbfe'); sky.addColorStop(1,'#e0f2fe');
    ctA.fillStyle=sky; ctA.fillRect(0,0,W,H);
    // Boden
    ctA.fillStyle='#78716c'; ctA.fillRect(20,H-14,W-40,10);
    ctA.fillStyle='#a8a29e'; ctA.fillRect(20,H-4,W-40,4);

    // Lineal (links)
    const ruX=40, ruTop=8, ruBot=H-14, ruH=ruBot-ruTop;
    ctA.strokeStyle='#94a3b8'; ctA.lineWidth=1;
    ctA.beginPath(); ctA.moveTo(ruX,ruTop); ctA.lineTo(ruX,ruBot); ctA.stroke();
    const step=h0<=20?5:10;
    for(let hi=0;hi<=h0;hi+=step){
      const ty=ruBot-(hi/h0)*ruH;
      ctA.beginPath(); ctA.moveTo(ruX-6,ty); ctA.lineTo(ruX+6,ty); ctA.stroke();
      ctA.fillStyle='#64748b'; ctA.font='9px sans-serif'; ctA.textAlign='right';
      ctA.fillText(hi+'m', ruX-8, ty+3);
    }

    // Ball
    const ballX2=W/2, ballY=ruBot-(h/h0)*ruH;
    const ballR=12;
    const grad=ctA.createRadialGradient(ballX2-3,ballY-3,2,ballX2,ballY,ballR);
    grad.addColorStop(0,'#fde68a'); grad.addColorStop(1,'#d97706');
    ctA.beginPath(); ctA.arc(ballX2,ballY,ballR,0,Math.PI*2);
    ctA.fillStyle=grad; ctA.fill();
    ctA.strokeStyle='#92400e'; ctA.lineWidth=1.5; ctA.stroke();

    // Geschwindigkeitspfeil
    if(v>0.5){
      const arLen=Math.min(v*3,42);
      ctA.strokeStyle='#dc2626'; ctA.lineWidth=2.5;
      ctA.beginPath(); ctA.moveTo(ballX2,ballY+ballR); ctA.lineTo(ballX2,ballY+ballR+arLen); ctA.stroke();
      ctA.fillStyle='#dc2626';
      ctA.beginPath(); ctA.moveTo(ballX2-5,ballY+ballR+arLen-5); ctA.lineTo(ballX2,ballY+ballR+arLen+3); ctA.lineTo(ballX2+5,ballY+ballR+arLen-5); ctA.fill();
    }

    // Info-Badge
    ctA.fillStyle='rgba(255,255,255,0.92)'; ctA.beginPath(); ctA.roundRect(W-120,4,114,50,6); ctA.fill();
    ctA.fillStyle='#374151'; ctA.font='bold 10px sans-serif'; ctA.textAlign='left';
    ctA.fillText(`h = ${fmt(h,1)} m`, W-114,18);
    ctA.fillText(`v = ${fmt(v,1)} m/s`, W-114,32);
    ctA.fillText(`t = ${fmt(curT,2)} s`, W-114,46);
  }

  // ── Frame-Loop ────────────────────────────────────────────
  function frame(ts) {
    if(running){
      if(lastTs!==null){
        const dt=Math.min((ts-lastTs)/1000,0.05);
        t=Math.min(t+dt,tFall());
        if(t>=tFall()){ running=false; const b=document.getElementById('fallPlayBtn'); if(b)b.textContent='▶ Loslassen'; }
      }
      lastTs=ts;
      if(pts.length===0||t-pts[pts.length-1].t>=0.1)
        pts.push({t,s:0.5*g*t*t,v:g*t});
    }

    drawAnim(t);

    // Info-Zeile
    const s2=0.5*g*t*t, v2=g*t;
    const tEl=document.getElementById('fallTVal'); if(tEl)tEl.textContent=fmt(t,2);
    const sEl=document.getElementById('fallSVal'); if(sEl)sEl.textContent=fmt(s2,1);
    const vEl=document.getElementById('fallVVal'); if(vEl)vEl.textContent=fmt(v2,1);

    // Diagramme
    const tM=Math.max(tFall()*1.1,1);
    const sMax=Math.max(h0*1.1,5);
    const vMax=Math.max(g*tFall()*1.1,10);
    drawDiagram(ctST,cvST,'#7c3aed','s / m', 0,Math.ceil(sMax/5)*5, pts.map(p=>({t:p.t,y:p.s})), tM);
    drawDiagram(ctVT,cvVT,'#0891b2','v / m/s',0,Math.ceil(vMax/5)*5,pts.map(p=>({t:p.t,y:p.v})), tM);
    drawDiagram(ctAT,cvAT,'#16a34a','a / m/s²',0,12,            pts.map(p=>({t:p.t,y:9.81})),tM);

    raf=requestAnimationFrame(frame);
  }

  function stop(){ if(raf)cancelAnimationFrame(raf); running=false; lastTs=null; }
  function setH(val){
    h0=val; t=0; pts=[];
    const lEl=document.getElementById('fallHLabel'); if(lEl)lEl.textContent=val;
  }
  function toggle(){
    if(running){ running=false; lastTs=null; const b=document.getElementById('fallPlayBtn'); if(b)b.textContent='▶ Weiter'; }
    else { if(t>=tFall()){t=0;pts=[];} running=true; const b=document.getElementById('fallPlayBtn'); if(b)b.textContent='⏸ Pause'; }
  }
  function reset(){ running=false; lastTs=null; t=0; pts=[]; const b=document.getElementById('fallPlayBtn'); if(b)b.textContent='▶ Loslassen'; }

  raf=requestAnimationFrame(frame);
  return { stop, setH, toggle, reset };
}

// ============================================================
// SIM 7: RAKETENSTART ZUM MOND – F = m · a
// ============================================================
function _simNewton2() {
  const cv = document.getElementById('rakCanvas');
  if (!cv) return {};
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const g = 9.81;
  let running = false, raf = null, last = null;
  let t = 0, h = 0, v = 0, fuelPct = 100;
  const pts = [];

  function getP(){
    return {
      F:  +document.getElementById('rakFSlider').value,
      m:  +document.getElementById('rakMSlider').value,
      tf: +document.getElementById('rakTSlider').value,
      drag: +document.getElementById('rakLSlider').value
    };
  }
  function fmt(n,d=1){ return n.toFixed(d).replace('.',','); }

  function draw(ts){
    if(running){
      if(last!==null){
        const dt=Math.min((ts-last)/1000, 0.04);
        const p=getP();
        const fuelDur=(p.tf/100)*60;
        const hasFuel=t<fuelDur;
        fuelPct=hasFuel?Math.max(0,100-(t/fuelDur)*100):0;
        const thrust=hasFuel?p.F:0;
        const dragF=p.drag*0.008*v*Math.abs(v);
        const fnet=thrust-p.m*g-dragF;
        const a=fnet/p.m;
        v+=a*dt; h+=v*dt;
        if(h<0){ h=0; if(v<0) v=0; running=false;
          const res=document.getElementById('rakResult');
          if(res&&t>1) res.innerHTML=`🏁 Gelandet! Max h = <b>${Math.round(Math.max(...pts.map(d=>d.h)))} m</b>`;
        }
        t+=dt;
        if(pts.length===0||t-pts[pts.length-1].t>0.4){
          const fnetAbs=Math.abs(thrust-p.m*g-dragF);
          pts.push({t,h,v:Math.max(v,0),fnet:fnetAbs});
          if(pts.length>200) pts.shift();
        }
        // Milestones
        const res=document.getElementById('rakResult');
        if(!hasFuel&&res&&!res.innerHTML.includes('Treibstoff')&&!res.innerHTML.includes('Gelandet')&&t>2){
          res.innerHTML=`⛽ Treibstoff leer! v = <b>${fmt(v,1)} m/s</b> – freier Flug!`;
        }
        if(h>1000&&res&&!res.innerHTML.includes('1000')) res.innerHTML=`🚀 1 km Höhe erreicht! v = <b>${fmt(v,1)} m/s</b>`;
        // Update info
        const tE=document.getElementById('rakT'), hE=document.getElementById('rakH');
        const vE=document.getElementById('rakV'), aE=document.getElementById('rakA');
        const fE=document.getElementById('rakFuel');
        if(tE) tE.textContent=fmt(t,1); if(hE) hE.textContent=Math.round(h);
        if(vE) vE.textContent=fmt(v,1); if(aE) aE.textContent=fmt(a,1);
        if(fE) fE.textContent=Math.round(fuelPct);
      }
      last=ts;
    }

    // === DRAW ===
    ctx.clearRect(0,0,W,H);
    const p=getP();
    const fuelDur=(p.tf/100)*60;
    const hasFuel=t<fuelDur;
    const skyG=ctx.createLinearGradient(0,0,0,H);
    const darkness=Math.min(h/8000,1);
    skyG.addColorStop(0,`rgba(${Math.round(15+darkness*0)},${Math.round(15+darkness*0)},${Math.round(40+darkness*0)},1)`);
    skyG.addColorStop(0,h>4000?'#060618':'#1e3a8a');
    skyG.addColorStop(0.5,h>2000?'#1e40af':'#3b82f6');
    skyG.addColorStop(1,'#93c5fd');
    ctx.fillStyle=skyG; ctx.fillRect(0,0,W,H);
    // Stars
    if(h>2000){
      const starAlpha=Math.min((h-2000)/5000,0.9);
      ctx.fillStyle=`rgba(255,255,255,${starAlpha})`;
      for(let i=0;i<25;i++){
        ctx.beginPath(); ctx.arc(((i*173+31)%W),((i*107+17)%(H*0.75)),1.2,0,Math.PI*2); ctx.fill();
      }
    }
    // Ground
    const groundY=H-35;
    ctx.fillStyle='#4ade80'; ctx.fillRect(0,groundY,W,35);
    ctx.fillStyle='#d4b483'; ctx.fillRect(0,groundY+8,W,27);
    // Launch pad
    ctx.fillStyle='#6b7280'; ctx.fillRect(W/2-35,groundY-10,70,10);
    ctx.fillStyle='#9ca3af'; ctx.fillRect(W/2-18,groundY-28,36,20);
    // Rocket visual position
    const maxVisH=Math.max(h+300,800);
    const rkBase=groundY-20-(h/maxVisH)*(groundY-80);
    const rkX=W/2, rkY=Math.max(70,rkBase);
    // Flame
    if(running&&hasFuel){
      const flH=28+Math.random()*18;
      const flG=ctx.createLinearGradient(rkX,rkY+22,rkX,rkY+22+flH);
      flG.addColorStop(0,'#fff'); flG.addColorStop(0.3,'#fbbf24'); flG.addColorStop(1,'rgba(239,68,68,0)');
      ctx.fillStyle=flG;
      ctx.beginPath(); ctx.moveTo(rkX-11,rkY+22); ctx.lineTo(rkX,rkY+22+flH); ctx.lineTo(rkX+11,rkY+22); ctx.fill();
    }
    // Rocket body
    ctx.fillStyle='#e2e8f0';
    ctx.beginPath(); ctx.rect(rkX-13,rkY-32,26,54); ctx.fill();
    ctx.strokeStyle='#94a3b8'; ctx.lineWidth=1.5; ctx.stroke();
    // Nose
    ctx.fillStyle='#dc2626';
    ctx.beginPath(); ctx.moveTo(rkX-13,rkY-32); ctx.lineTo(rkX,rkY-58); ctx.lineTo(rkX+13,rkY-32); ctx.fill();
    // Fins
    ctx.fillStyle='#3b82f6';
    ctx.beginPath(); ctx.moveTo(rkX-13,rkY+18); ctx.lineTo(rkX-24,rkY+36); ctx.lineTo(rkX-13,rkY+36); ctx.fill();
    ctx.beginPath(); ctx.moveTo(rkX+13,rkY+18); ctx.lineTo(rkX+24,rkY+36); ctx.lineTo(rkX+13,rkY+36); ctx.fill();
    // Window
    ctx.fillStyle='#bfdbfe'; ctx.beginPath(); ctx.arc(rkX,rkY-12,7,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#1d4ed8'; ctx.lineWidth=1.5; ctx.stroke();
    // Fuel bar
    const fbX=W-28, fbY=H*0.28, fbH=H*0.38;
    ctx.fillStyle='#1f2937'; ctx.fillRect(fbX,fbY,16,fbH);
    ctx.fillStyle=fuelPct>30?'#f97316':'#dc2626';
    const fill=fuelPct/100*fbH;
    ctx.fillRect(fbX,fbY+fbH-fill,16,fill);
    ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif'; ctx.textAlign='center';
    ctx.fillText('⛽',fbX+8,fbY-4); ctx.fillText(Math.round(fuelPct)+'%',fbX+8,fbY+fbH+12);
    // Info badge
    ctx.fillStyle='rgba(255,255,255,0.92)';
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(6,6,192,74,6); else ctx.rect(6,6,192,74);
    ctx.fill(); ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#1f2937'; ctx.font='bold 11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('F = m · a', 12,22);
    ctx.font='10px sans-serif';
    const dragF2=p.drag*0.008*v*Math.abs(v);
    const fnet2=(hasFuel?p.F:0)-p.m*g-dragF2;
    ctx.fillText('Schub = '+(hasFuel?p.F:0)+' N',12,37);
    ctx.fillText('Schwere = '+(p.m*g).toFixed(0)+' N',12,52);
    ctx.fillText('F_net = '+fnet2.toFixed(0)+' N → a = '+(fnet2/p.m).toFixed(1)+' m/s²',12,67);
    drawRakChart('rakHChart',pts,'h','h (m)','#0891b2');
    drawRakChart('rakVChart',pts,'v','v (m/s)','#16a34a');
    drawRakChart('rakFChart',pts,'fnet','F (N)','#f97316');
    updateRakTable();
    raf=requestAnimationFrame(draw);
  }

  function drawRakChart(id,data,yKey,yLabel,color){
    const c=document.getElementById(id); if(!c) return;
    const c2=c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:42,r:8,t:10,b:24};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    c2.clearRect(0,0,cW,cH); c2.fillStyle='#fff'; c2.fillRect(0,0,cW,cH);
    c2.strokeStyle='#e5e7eb'; c2.lineWidth=1;
    for(let i=1;i<=4;i++){ c2.beginPath(); c2.moveTo(P.l,P.t+(i/4)*gH); c2.lineTo(P.l+gW,P.t+(i/4)*gH); c2.stroke(); }
    c2.strokeStyle='#333'; c2.lineWidth=1.5;
    c2.beginPath(); c2.moveTo(P.l,P.t); c2.lineTo(P.l,P.t+gH); c2.lineTo(P.l+gW,P.t+gH); c2.stroke();
    if(data.length<2){
      c2.fillStyle='#aaa'; c2.font='9px sans-serif'; c2.textAlign='center';
      c2.fillText('Start...', P.l+gW/2, P.t+gH/2+4); return;
    }
    const t0=data[0].t, t1=data[data.length-1].t||1;
    const y1=Math.max(...data.map(d=>d[yKey]))*1.1||1;
    c2.strokeStyle=color; c2.lineWidth=2;
    c2.beginPath();
    data.forEach((d,i)=>{
      const px=P.l+((d.t-t0)/(t1-t0))*gW;
      const py=P.t+gH-(d[yKey]/y1)*gH;
      i===0?c2.moveTo(px,py):c2.lineTo(px,py);
    }); c2.stroke();
    c2.fillStyle='#555'; c2.font='8px sans-serif'; c2.textAlign='center';
    c2.fillText('t (s)', P.l+gW/2, cH-2);
    c2.save(); c2.translate(10,P.t+gH/2); c2.rotate(-Math.PI/2); c2.fillText(yLabel,0,0); c2.restore();
    c2.textAlign='right'; c2.fillText(y1>999?(y1/1000).toFixed(1)+'k':y1.toFixed(0), P.l-2, P.t+8);
  }

  function updateRakTable(){
    const tb=document.getElementById('rakTbody'), tw=document.getElementById('rakTable');
    if(!tb||!tw) return;
    if(pts.length>0) tw.style.display='table';
    tb.innerHTML=pts.slice(-8).map(d=>
      `<tr><td>${fmt(d.t,1)}</td><td>${Math.round(d.h)}</td><td>${fmt(d.v,1)}</td><td>${d.fnet.toFixed(0)}</td></tr>`
    ).join('');
  }

  function toggle(){
    running=!running; last=null;
    const btn=document.getElementById('rakPlayBtn');
    if(btn) btn.textContent=running?'⏸ Pause':'🚀 Starten!';
  }
  function reset(){
    running=false; last=null; t=0; h=0; v=0; fuelPct=100; pts.length=0;
    const btn=document.getElementById('rakPlayBtn'); if(btn) btn.textContent='🚀 Starten!';
    const res=document.getElementById('rakResult'); if(res) res.innerHTML='';
    ['rakT','rakH','rakV','rakA','rakFuel'].forEach((id,i)=>{
      const el=document.getElementById(id); if(el) el.textContent=['0,0','0','0,0','0,0','100'][i];
    });
    const tb=document.getElementById('rakTbody'), tw=document.getElementById('rakTable');
    if(tb) tb.innerHTML=''; if(tw) tw.style.display='none';
  }
  function update(){
    const p=getP();
    const a0=(p.F-p.m*g)/p.m;
    const res=document.getElementById('rakResult');
    if(res&&!running) res.innerHTML=`a₀ = (${p.F}N − ${(p.m*g).toFixed(0)}N) / ${p.m}kg = <b>${a0.toFixed(2)} m/s²</b>`;
  }
  function stop(){ if(raf) cancelAnimationFrame(raf); }

  raf=requestAnimationFrame(draw);
  return { stop, toggle, reset, update };
}

// ============================================================
// SIM 7b: OLD NEWTON (dead code removed – replaced by Raketenstart)
// ============================================================
function _simNewton2_OLD_DEAD() {
  function draw(ts) {
    if (false) {
      if (last !== null) {
        const dt = Math.min((ts - last) / 1000, 0.05);
        t += dt;
        if (t > 6) { t = 0; }
      }
      last = ts;
    }

    const a = F / m;
    const s = Math.min(0.5 * a * t * t, W - 140);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);

    const trackY = H / 2 + 15;
    // track
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(20, trackY, W - 40, 12);

    // block
    const blockW = 50, blockH = 36;
    const blockX = 25 + Math.min(s * 3, W - 120);
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.roundRect(blockX, trackY - blockH, blockW, blockH, 5);
    ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(fmt(m, 1) + 'kg', blockX + blockW / 2, trackY - blockH / 2 + 4);

    // force arrow
    const arrowLen = Math.min(F * 2.5, 80);
    ctx.beginPath();
    ctx.moveTo(blockX - 5, trackY - blockH / 2);
    ctx.lineTo(blockX - 5 - arrowLen, trackY - blockH / 2);
    ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(blockX - 5 - arrowLen, trackY - blockH / 2 - 7);
    ctx.lineTo(blockX - 5, trackY - blockH / 2);
    ctx.lineTo(blockX - 5 - arrowLen, trackY - blockH / 2 + 7);
    ctx.fillStyle = '#DC2626'; ctx.fill();
    ctx.fillStyle = '#DC2626'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('F=' + fmt(F, 0) + 'N', blockX - 5 - arrowLen / 2, trackY - blockH / 2 - 14);

    // formula box
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(W - 160, 10, 145, 60);
    ctx.fillStyle = '#374151'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('a = F / m', W - 152, 30);
    ctx.font = '13px sans-serif';
    ctx.fillText('a = ' + fmt(F, 0) + '/' + fmt(m, 1) + ' = ' + fmt(a, 2) + ' m/s²', W - 152, 54);

    // update HTML
    const fEl = document.getElementById('newFVal');
    const mEl = document.getElementById('newMVal');
    const aEl = document.getElementById('newAVal');
    const flEl = document.getElementById('newFLabel');
    const mlEl = document.getElementById('newMLabel');
    if (fEl) fEl.textContent = fmt(F, 0);
    if (mEl) mEl.textContent = fmt(m, 1);
    if (aEl) aEl.textContent = fmt(a, 2);
    if (flEl) flEl.textContent = fmt(F, 0);
    if (mlEl) mlEl.textContent = fmt(m, 1);

    drawNewChart();
    raf = requestAnimationFrame(draw);
  }

  const newMeas = [];
  let newSel = [];

  function drawNewChart() {
    const c = document.getElementById('newChart'); if (!c) return;
    const ctx2 = c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:55,r:20,t:22,b:42};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f8fafc'; ctx2.fillRect(0,0,cW,cH);
    const Fmax=50, aMax=50;
    ctx2.strokeStyle='#f0f0f0'; ctx2.lineWidth=1;
    for(let i=1;i<=5;i++){
      const y=P.t+(i/5)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
      const x=P.l+(i/5)*gW; ctx2.beginPath(); ctx2.moveTo(x,P.t); ctx2.lineTo(x,P.t+gH); ctx2.stroke();
    }
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.fillStyle='#333';
    ctx2.beginPath(); ctx2.moveTo(P.l+gW,P.t+gH); ctx2.lineTo(P.l+gW+7,P.t+gH-3); ctx2.lineTo(P.l+gW+7,P.t+gH+3); ctx2.fill();
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l-3,P.t+8); ctx2.lineTo(P.l+3,P.t+8); ctx2.fill();
    ctx2.font='bold 12px Nunito,sans-serif'; ctx2.fillStyle='#333'; ctx2.textAlign='center';
    ctx2.fillText('Kraft F (N)', P.l+gW/2, cH-4);
    ctx2.save(); ctx2.translate(14,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('a (m/s²)',0,0); ctx2.restore();
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    for(let i=0;i<=5;i++) ctx2.fillText((Fmax*i/5).toFixed(0), P.l+(i/5)*gW, P.t+gH+14);
    ctx2.textAlign='right';
    for(let i=0;i<=5;i++) ctx2.fillText((aMax*i/5).toFixed(0), P.l-4, P.t+gH-(i/5)*gH+4);
    // line a = F/m (current mass)
    ctx2.strokeStyle='#7c3aed44'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath();
    ctx2.moveTo(P.l, P.t+gH);
    const ya = P.t+gH-((Fmax/m)/aMax)*gH;
    ctx2.lineTo(P.l+gW, Math.max(P.t,ya));
    ctx2.stroke(); ctx2.setLineDash([]);
    ctx2.font='11px sans-serif'; ctx2.fillStyle='#7c3aed'; ctx2.textAlign='left';
    ctx2.fillText('a=F/m  (m='+fmt(m,1)+'kg)', P.l+4, P.t+12);
    // current point
    const a=F/m;
    const cpx=P.l+(F/Fmax)*gW, cpy=P.t+gH-(Math.min(a,aMax)/aMax)*gH;
    ctx2.fillStyle='#7c3aed';
    ctx2.beginPath(); ctx2.arc(cpx,cpy,6,0,Math.PI*2); ctx2.fill();
    // slope line + result when 2 points selected
    if (newSel.length === 2) {
      const [i1,i2] = [...newSel].sort((a2,b2)=>newMeas[a2].F-newMeas[b2].F);
      const p1=newMeas[i1], p2=newMeas[i2];
      const pxFn = mp => P.l+(mp.F/Fmax)*gW;
      const pyFn = mp => P.t+gH-(Math.min(mp.a,aMax)/aMax)*gH;
      ctx2.strokeStyle='#F97316'; ctx2.lineWidth=3;
      ctx2.beginPath(); ctx2.moveTo(pxFn(p1),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p2)); ctx2.stroke();
      ctx2.strokeStyle='#EF4444'; ctx2.lineWidth=1.5; ctx2.setLineDash([4,3]);
      ctx2.beginPath();
      ctx2.moveTo(pxFn(p1),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p2));
      ctx2.stroke(); ctx2.setLineDash([]);
      const dF=parseFloat((p2.F-p1.F).toFixed(1));
      const da=parseFloat((p2.a-p1.a).toFixed(2));
      if(Math.abs(dF)>0){
        const inv_m=(da/dF).toFixed(3);
        const mass_kg=Math.abs(dF/da).toFixed(2);
        const res=document.getElementById('newResult');
        if(res) res.innerHTML='Steigung = Δa ÷ ΔF = <b>'+da.toFixed(2)+' m/s²</b> ÷ <b>'+dF.toFixed(1)+' N</b> = <b class="sim-v-result">'+inv_m+'</b> → Masse m = <b class="sim-v-result">'+mass_kg+' kg</b>';
      }
    }
    // measured
    newMeas.forEach((mp,idx) => {
      const isSel = newSel.includes(idx);
      ctx2.fillStyle = isSel ? '#F97316' : '#dc2626';
      ctx2.strokeStyle = isSel ? '#C2410C' : '#b91c1c';
      ctx2.lineWidth=2;
      const mx=P.l+(mp.F/Fmax)*gW, my=P.t+gH-(Math.min(mp.a,aMax)/aMax)*gH;
      ctx2.beginPath(); ctx2.arc(mx,my,isSel?9:6,0,Math.PI*2); ctx2.fill(); ctx2.stroke();
      ctx2.fillStyle='#fff'; ctx2.font='bold 9px Nunito,sans-serif'; ctx2.textAlign='center';
      ctx2.fillText(idx+1, mx, my+3);
    });
  }

  function newHandleClick(mx, my) {
    const cW=460, cH=180;
    const P={l:55,r:20,t:22,b:42};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const Fmax=50, aMax=50;
    const pxFn = mp => P.l+(mp.F/Fmax)*gW;
    const pyFn = mp => P.t+gH-(Math.min(mp.a,aMax)/aMax)*gH;
    let closest=-1, minD=24;
    newMeas.forEach((mp,i) => {
      const d=Math.hypot(pxFn(mp)-mx, pyFn(mp)-my);
      if(d<minD){ minD=d; closest=i; }
    });
    if(closest<0) return;
    if(newSel.includes(closest)) newSel=newSel.filter(i=>i!==closest);
    else if(newSel.length<2) newSel.push(closest);
    else newSel=[closest];
    drawNewChart();
  }

  function newMeasure() {
    const a=F/m;
    newMeas.push({F:parseFloat(F.toFixed(1)),m:parseFloat(m.toFixed(1)),a:parseFloat(a.toFixed(2))});
    newSel=[];
    const res=document.getElementById('newResult');
    if(res) res.innerHTML='';
    updateNewTable();
  }

  function updateNewTable() {
    const tb=document.getElementById('newTbody'), tw=document.getElementById('newTable');
    if(!tb||!tw) return;
    if(newMeas.length>0) tw.style.display='table';
    tb.innerHTML=newMeas.map(mp=>`<tr><td>${mp.F.toFixed(1).replace('.',',')}</td><td>${mp.m.toFixed(1).replace('.',',')}</td><td>${mp.a.toFixed(2).replace('.',',')}</td></tr>`).join('');
  }

  function stop() { if (raf) cancelAnimationFrame(raf); running = false; last = null; }
  function set(key, val) {
    if (key === 'f') F = val;
    if (key === 'm') m = val;
  }
  function toggle() {
    if (running) {
      running = false; last = null;
      const b = document.getElementById('newPlayBtn');
      if (b) b.textContent = '▶ Start';
    } else {
      t = 0; running = true;
      const b = document.getElementById('newPlayBtn');
      if (b) b.textContent = '⏸ Pause';
    }
  }
  function reset() {
    running = false; last = null; t = 0;
    const b = document.getElementById('newPlayBtn');
    if (b) b.textContent = '▶ Start';
  }

  raf = requestAnimationFrame(draw);
  return { stop, set, toggle, reset, measure: newMeasure, handleClick: newHandleClick };
}

// ============================================================
// SIM 8: DIE VERRÜCKTE ACHTERBAHN – ENERGIEERHALTUNG
// ============================================================
function _simEnergieerhaltung() {
  const cv = document.getElementById('achtCanvas');
  if (!cv) return {};
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const g = 9.81;
  let running = false, raf = null, last = null;
  let xPos = 0, t = 0, v = 0, distTrav = 0;
  const pts = [];

  // Track segments: normalized x [0..1], normalized height nh [0..1]
  const trackSegs = [
    {x:0,nh:1},{x:0.14,nh:0},{x:0.27,nh:0.65},{x:0.41,nh:0.1},
    {x:0.54,nh:0.4},{x:0.68,nh:0.05},{x:0.83,nh:0.22},{x:1.0,nh:0}
  ];
  const trackLen = 150; // total track length in meters

  function getP(){
    return {
      h0: +document.getElementById('achtHSlider').value,
      mu: +document.getElementById('achtFrSlider').value,
      m:  +document.getElementById('achtMSlider').value
    };
  }
  function fmt(n,d=1){ return n.toFixed(d).replace('.',','); }

  function interpH(xn, h0){
    for(let i=1;i<trackSegs.length;i++){
      if(xn<=trackSegs[i].x){
        const frac=(xn-trackSegs[i-1].x)/(trackSegs[i].x-trackSegs[i-1].x);
        return (trackSegs[i-1].nh+frac*(trackSegs[i].nh-trackSegs[i-1].nh))*h0;
      }
    }
    return 0;
  }

  function draw(ts){
    if(running){
      if(last!==null){
        const dt=Math.min((ts-last)/1000,0.04);
        const p=getP();
        const E0=p.m*g*p.h0;
        const hC=interpH(xPos,p.h0);
        const Erib=p.mu*p.m*g*distTrav;
        const Ekin=Math.max(0,E0-p.m*g*hC-Erib);
        v=Math.sqrt(2*Ekin/p.m);
        if(v<0.05&&xPos>0.05){
          running=false;
          const res=document.getElementById('achtResult');
          if(res) res.innerHTML=`🛑 Wagen stoppt bei h = <b>${fmt(hC,1)} m</b>! Reibung fraß <b>${Erib.toFixed(1)} J</b> von <b>${E0.toFixed(1)} J</b>`;
        } else {
          xPos=Math.min(xPos+(v/trackLen)*dt, 1.0);
          distTrav+=v*dt; t+=dt;
          if(xPos>=1.0){
            running=false;
            const res=document.getElementById('achtResult');
            if(res) res.innerHTML=`🏁 Ziel! v = <b>${fmt(v,1)} m/s</b> &nbsp;|&nbsp; Reibungsenergie: <b>${Erib.toFixed(1)} J</b>`;
          }
        }
        const hN=interpH(xPos,p.h0);
        const Erib2=p.mu*p.m*g*distTrav;
        const Ekin2=Math.max(0,E0-p.m*g*hN-Erib2);
        const Epot2=p.m*g*hN;
        const hEl=document.getElementById('achtH'), vEl=document.getElementById('achtV');
        const ekEl=document.getElementById('achtEkin'), epEl=document.getElementById('achtEpot'), egEl=document.getElementById('achtEges');
        if(hEl) hEl.textContent=fmt(hN,1);
        if(vEl) vEl.textContent=fmt(v,1);
        if(ekEl) ekEl.textContent=Ekin2.toFixed(1);
        if(epEl) epEl.textContent=Epot2.toFixed(1);
        if(egEl) egEl.textContent=E0.toFixed(1);
        if(pts.length===0||t-pts[pts.length-1].t>0.25){
          pts.push({t,h:hN,v,ekin:Ekin2,epot:Epot2,etot:E0});
          if(pts.length>250) pts.shift();
        }
      }
      last=ts;
    }

    // === DRAW ===
    ctx.clearRect(0,0,W,H);
    const p=getP();
    const groundY=H-20;
    const scY=Math.min((H-50)/(p.h0*1.15+0.1), 14);

    // Sky
    const skyG=ctx.createLinearGradient(0,0,0,H);
    skyG.addColorStop(0,'#bfdbfe'); skyG.addColorStop(1,'#dbeafe');
    ctx.fillStyle=skyG; ctx.fillRect(0,0,W,H);

    // Build track points
    const tPts=[];
    for(let i=0;i<=120;i++){
      const xn=i/120;
      const hh=interpH(xn,p.h0);
      const px=28+xn*(W-56), py=groundY-hh*scY;
      tPts.push({px,py});
    }

    // Track fill
    ctx.beginPath();
    ctx.moveTo(tPts[0].px,groundY);
    tPts.forEach(pt=>ctx.lineTo(pt.px,pt.py));
    ctx.lineTo(tPts[tPts.length-1].px,groundY);
    ctx.closePath();
    ctx.fillStyle='#78716c'; ctx.fill();

    // Track surface
    ctx.beginPath();
    tPts.forEach((pt,i)=>i===0?ctx.moveTo(pt.px,pt.py):ctx.lineTo(pt.px,pt.py));
    ctx.strokeStyle='#1c1917'; ctx.lineWidth=3; ctx.stroke();

    // Rails dashed highlight
    ctx.strokeStyle='rgba(168,162,158,0.5)'; ctx.lineWidth=1; ctx.setLineDash([4,6]);
    ctx.stroke(); ctx.setLineDash([]);

    // Ground
    ctx.fillStyle='#4ade80'; ctx.fillRect(0,groundY,W,H-groundY);

    // Cart
    const ci=Math.min(Math.round(xPos*120),120);
    const cPt=tPts[ci]||tPts[tPts.length-1];
    const prev2=ci>0?tPts[ci-1]:tPts[0];
    const next2=ci<120?tPts[ci+1]:tPts[120];
    const slp=Math.atan2(next2.py-prev2.py, next2.px-prev2.px);
    ctx.save();
    ctx.translate(cPt.px, cPt.py);
    ctx.rotate(slp);
    ctx.fillStyle='#f97316';
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-14,-16,28,16,3); else ctx.rect(-14,-16,28,16);
    ctx.fill(); ctx.strokeStyle='#ea580c'; ctx.lineWidth=1.5; ctx.stroke();
    // Wheels
    ctx.fillStyle='#1f2937';
    ctx.beginPath(); ctx.arc(-8,2,5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(8,2,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#d1d5db';
    ctx.beginPath(); ctx.arc(-8,2,2.5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(8,2,2.5,0,Math.PI*2); ctx.fill();
    // Passenger
    ctx.strokeStyle='#1f2937'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,-22,5,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-17); ctx.lineTo(0,-10); ctx.stroke();
    ctx.restore();

    // Energy bars (right side)
    const E0=p.m*g*p.h0;
    const hC=interpH(xPos,p.h0);
    const Erib=p.mu*p.m*g*distTrav;
    const Ekin=Math.max(0,E0-p.m*g*hC-Erib);
    const Epot=p.m*g*hC;
    const bx=W-72,by=8,bh=Math.min(H*0.38,80);
    function drawBar(bxb,col,lbl,val){
      const fill=E0>0?(val/E0)*bh:0;
      ctx.fillStyle='#e2e8f0'; ctx.fillRect(bxb,by,15,bh);
      ctx.fillStyle=col; ctx.fillRect(bxb,by+bh-fill,15,fill);
      ctx.fillStyle='#374151'; ctx.font='7px sans-serif'; ctx.textAlign='center';
      ctx.fillText(lbl,bxb+7.5,by+bh+9);
    }
    drawBar(bx,'#3b82f6','Ekin',Ekin);
    drawBar(bx+19,'#16a34a','Epot',Epot);
    drawBar(bx+38,'#dc2626','Erib',Erib);
    drawBar(bx+57,'#94a3b8','Eg',E0);

    // Info badge
    ctx.fillStyle='rgba(255,255,255,0.9)';
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(6,6,180,58,5); else ctx.rect(6,6,180,58);
    ctx.fill(); ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#1f2937'; ctx.font='bold 10px sans-serif'; ctx.textAlign='left';
    ctx.fillText('Energieerhaltung',12,20);
    ctx.font='9px sans-serif';
    ctx.fillText('E_kin = '+Ekin.toFixed(1)+' J  E_pot = '+Epot.toFixed(1)+' J',12,34);
    ctx.fillText('E_ges = '+E0.toFixed(1)+' J  Verlust = '+Erib.toFixed(1)+' J',12,48);

    drawAchtChart('achtEChart',pts,['ekin','epot'],['#3b82f6','#16a34a'],'E (J)');
    drawAchtChart('achtVChart',pts,['v'],['#f97316'],'v (m/s)');
    drawAchtChart('achtHChart',pts,['h'],['#16a34a'],'h (m)');
    updateAchtTable();
    raf=requestAnimationFrame(draw);
  }

  function drawAchtChart(id,data,keys,colors,yLabel){
    const c=document.getElementById(id); if(!c) return;
    const c2=c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:38,r:8,t:10,b:24};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    c2.clearRect(0,0,cW,cH); c2.fillStyle='#fff'; c2.fillRect(0,0,cW,cH);
    c2.strokeStyle='#333'; c2.lineWidth=1.5;
    c2.beginPath(); c2.moveTo(P.l,P.t); c2.lineTo(P.l,P.t+gH); c2.lineTo(P.l+gW,P.t+gH); c2.stroke();
    if(data.length<2){ c2.fillStyle='#aaa'; c2.font='9px sans-serif'; c2.textAlign='center'; c2.fillText('Start...',P.l+gW/2,P.t+gH/2+4); return; }
    const t0=data[0].t, t1=data[data.length-1].t||1;
    let yMax=0;
    keys.forEach(k=>{yMax=Math.max(yMax,...data.map(d=>d[k]||0));});
    yMax=yMax*1.1||1;
    keys.forEach((k,ki)=>{
      c2.strokeStyle=colors[ki]; c2.lineWidth=2;
      c2.beginPath();
      data.forEach((d,i)=>{
        const px=P.l+((d.t-t0)/(t1-t0))*gW;
        const py=P.t+gH-((d[k]||0)/yMax)*gH;
        i===0?c2.moveTo(px,py):c2.lineTo(px,py);
      }); c2.stroke();
    });
    c2.fillStyle='#555'; c2.font='8px sans-serif'; c2.textAlign='center';
    c2.fillText('t (s)',P.l+gW/2,cH-2);
    c2.save(); c2.translate(9,P.t+gH/2); c2.rotate(-Math.PI/2); c2.fillText(yLabel,0,0); c2.restore();
    c2.textAlign='right'; c2.fillText(yMax.toFixed(0),P.l-2,P.t+8);
  }

  function updateAchtTable(){
    const tb=document.getElementById('achtTbody'), tw=document.getElementById('achtTable');
    if(!tb||!tw) return;
    if(pts.length>0) tw.style.display='table';
    tb.innerHTML=pts.slice(-8).map(d=>
      `<tr><td>${fmt(d.t,1)}</td><td>${fmt(d.h,1)}</td><td>${fmt(d.v,1)}</td><td>${d.epot.toFixed(1).replace('.',',')}</td><td>${d.ekin.toFixed(1).replace('.',',')}</td></tr>`
    ).join('');
  }

  function toggle(){
    running=!running; last=null;
    const btn=document.getElementById('achtPlayBtn');
    if(btn) btn.textContent=running?'⏸ Pause':'▶ Starten!';
  }
  function reset(){
    running=false; last=null; xPos=0; t=0; v=0; distTrav=0; pts.length=0;
    const btn=document.getElementById('achtPlayBtn'); if(btn) btn.textContent='▶ Starten!';
    const res=document.getElementById('achtResult'); if(res) res.innerHTML='';
    const p=getP(); const E0=p.m*g*p.h0;
    const hEl=document.getElementById('achtH'), ekEl=document.getElementById('achtEkin');
    const epEl=document.getElementById('achtEpot'), egEl=document.getElementById('achtEges'), vEl=document.getElementById('achtV');
    if(hEl) hEl.textContent=fmt(p.h0,1); if(vEl) vEl.textContent='0,0';
    if(ekEl) ekEl.textContent='0,0'; if(epEl) epEl.textContent=E0.toFixed(1); if(egEl) egEl.textContent=E0.toFixed(1);
    const tb=document.getElementById('achtTbody'), tw=document.getElementById('achtTable');
    if(tb) tb.innerHTML=''; if(tw) tw.style.display='none';
  }
  function update(){
    reset();
    const p=getP(); const E0=p.m*g*p.h0;
    const res=document.getElementById('achtResult');
    if(res) res.innerHTML=`E_ges = m·g·h₀ = ${p.m}·9,81·${p.h0} = <b>${E0.toFixed(1)} J</b>`;
  }
  function stop(){ if(raf) cancelAnimationFrame(raf); }

  raf=requestAnimationFrame(draw);
  return { stop, toggle, reset, update };
}
// ── old pendulum code isolated so hoisting doesn't conflict ──
function _engPendel_unused() {
  const g=9.81,M=1.0; let theta0=40*Math.PI/180, L=1.0, animId=null, startTime=null;
  const engPts=[],engMeas=[],engSelArr=[],engTableRows=[];
  function fmt(n,d=2){ return n.toFixed(d).replace('.',','); }
  function draw(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000;
    const omega = Math.sqrt(g / L);
    const theta = theta0 * Math.cos(omega * t);
    const h = L * (1 - Math.cos(theta));
    const E_pot = M * g * h;
    const E_tot = M * g * L * (1 - Math.cos(theta0));
    const E_kin = Math.max(E_tot - E_pot, 0);
    const v = Math.sqrt(2 * E_kin / M);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, W, H);

    const pivotX = W / 2 - 60, pivotY = 30;
    const scale = Math.min((H - 80) / L, 140);
    const ballX = pivotX + Math.sin(theta) * L * scale;
    const ballY = pivotY + Math.cos(theta) * L * scale;

    // ceiling attachment
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(pivotX - 20, 0, 40, 15);

    // string
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(ballX, ballY);
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 2; ctx.stroke();

    // path arc (ghost)
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, L * scale, Math.PI / 2 - theta0, Math.PI / 2 + theta0);
    ctx.strokeStyle = 'rgba(100,116,139,0.2)'; ctx.lineWidth = 1; ctx.stroke();

    // ball
    const bR = 14;
    const bgrad = ctx.createRadialGradient(ballX - 3, ballY - 3, 2, ballX, ballY, bR);
    bgrad.addColorStop(0, '#60A5FA');
    bgrad.addColorStop(1, '#1D4ED8');
    ctx.beginPath(); ctx.arc(ballX, ballY, bR, 0, Math.PI * 2);
    ctx.fillStyle = bgrad; ctx.fill();
    ctx.strokeStyle = '#1E3A8A'; ctx.lineWidth = 1.5; ctx.stroke();

    // equilibrium marker
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + L * scale);
    ctx.strokeStyle = 'rgba(100,116,139,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.stroke(); ctx.setLineDash([]);

    // height marker h
    ctx.beginPath();
    ctx.moveTo(ballX, ballY);
    ctx.lineTo(ballX, pivotY + L * scale);
    ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#15803D'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('h=' + fmt(h, 2) + 'm', ballX + 5, (ballY + pivotY + L * scale) / 2 + 4);

    // energy bars
    const barX = W - 90, barTopY = 20, barMaxH = H - 60;
    const E_max = E_tot;
    function drawBar(x, y, w, h, color, label, val) {
      const barH = E_max > 0 ? (val / E_max) * barMaxH : 0;
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(x, barTopY, w, barMaxH);
      ctx.fillStyle = color;
      ctx.fillRect(x, barTopY + barMaxH - barH, w, barH);
      ctx.fillStyle = '#374151'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(label, x + w / 2, barTopY + barMaxH + 14);
      ctx.fillText(fmt(val, 2) + 'J', x + w / 2, barTopY + barMaxH + 26);
    }
    drawBar(barX, barTopY, 22, barMaxH, '#3B82F6', 'Ekin', E_kin);
    drawBar(barX + 28, barTopY, 22, barMaxH, '#16A34A', 'Epot', E_pot);
    drawBar(barX + 56, barTopY, 22, barMaxH, '#94A3B8', 'Eges', E_tot);

    // update HTML
    const kinEl = document.getElementById('engEkin');
    const potEl = document.getElementById('engEpot');
    const gesEl = document.getElementById('engEges');
    if (kinEl) kinEl.textContent = fmt(E_kin);
    if (potEl) potEl.textContent = fmt(E_pot);
    if (gesEl) gesEl.textContent = fmt(E_tot);

    // record for chart
    engPts.push({t, E_pot, E_kin, E_tot});
    if(engPts.length > 200) engPts.shift();
    drawEngChart(t, E_pot, E_kin, E_tot, v, h);

    animId = requestAnimationFrame(draw);
  }

  function drawEngChart(curT, E_pot, E_kin, E_tot, v, h) {
    const c = document.getElementById('engChart'); if (!c) return;
    const ctx2 = c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:55,r:20,t:22,b:42};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f0f9ff'; ctx2.fillRect(0,0,cW,cH);
    const tWindow=8; // seconds to show
    const Emax=Math.max(E_tot*1.2, 0.01);
    // grid
    ctx2.strokeStyle='#e0e7ef'; ctx2.lineWidth=1;
    for(let i=1;i<=4;i++){
      const y=P.t+(i/4)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.font='bold 11px Nunito,sans-serif'; ctx2.fillStyle='#333'; ctx2.textAlign='center';
    ctx2.fillText('Zeit t (s)', P.l+gW/2, cH-4);
    ctx2.save(); ctx2.translate(14,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('Energie (J)',0,0); ctx2.restore();
    // ticks
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='right';
    for(let i=0;i<=4;i++) ctx2.fillText((Emax*i/4).toFixed(2), P.l-4, P.t+gH-(i/4)*gH+4);
    if(engPts.length>1){
      const tStart=engPts[0].t;
      function ptX(tp){ return P.l+((tp-tStart)/Math.max(tWindow,curT-tStart+1))*gW; }
      function ptY(e){ return P.t+gH-(e/Emax)*gH; }
      // E_pot blue
      ctx2.strokeStyle='#2563EB'; ctx2.lineWidth=2;
      ctx2.beginPath();
      engPts.forEach((p,i)=>{ i===0?ctx2.moveTo(ptX(p.t),ptY(p.E_pot)):ctx2.lineTo(ptX(p.t),ptY(p.E_pot)); });
      ctx2.stroke();
      // E_kin red
      ctx2.strokeStyle='#dc2626'; ctx2.lineWidth=2;
      ctx2.beginPath();
      engPts.forEach((p,i)=>{ i===0?ctx2.moveTo(ptX(p.t),ptY(p.E_kin)):ctx2.lineTo(ptX(p.t),ptY(p.E_kin)); });
      ctx2.stroke();
      // E_tot green
      ctx2.strokeStyle='#16a34a'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,3]);
      ctx2.beginPath();
      engPts.forEach((p,i)=>{ i===0?ctx2.moveTo(ptX(p.t),ptY(p.E_tot)):ctx2.lineTo(ptX(p.t),ptY(p.E_tot)); });
      ctx2.stroke(); ctx2.setLineDash([]);
    }
    // legend
    ctx2.font='10px sans-serif'; ctx2.textAlign='left';
    ctx2.fillStyle='#2563EB'; ctx2.fillRect(P.l+4,P.t+4,10,3); ctx2.fillText('E_pot',P.l+18,P.t+10);
    ctx2.fillStyle='#dc2626'; ctx2.fillRect(P.l+60,P.t+4,10,3); ctx2.fillText('E_kin',P.l+74,P.t+10);
    ctx2.fillStyle='#16a34a'; ctx2.fillRect(P.l+116,P.t+4,10,3); ctx2.fillText('E_ges',P.l+130,P.t+10);
    // draw measured points (engMeas defined after this function)
    if(typeof engMeas!=='undefined'){
      const tStart2=engPts.length>0?engPts[0].t:0;
      const Emax2=Math.max(E_tot*1.2,0.01);
      engMeas.forEach((m,i)=>{
        m.px=P.l+((m.t-tStart2)/Math.max(tWindow,curT-tStart2+1))*gW;
        m.py=P.t+gH-(m.E_pot/Emax2)*gH;
        const sel=typeof engSelArr!=='undefined'&&engSelArr.includes(i);
        ctx2.fillStyle=sel?'#f97316':'#1d4ed8';
        ctx2.beginPath(); ctx2.arc(m.px,m.py,5,0,Math.PI*2); ctx2.fill();
        if(sel){ ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2; ctx2.beginPath(); ctx2.arc(m.px,m.py,8,0,Math.PI*2); ctx2.stroke(); }
      });
      if(typeof engSelArr!=='undefined'&&engSelArr.length===2){
        const a=engMeas[engSelArr[0]], b=engMeas[engSelArr[1]];
        ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2;
        ctx2.beginPath(); ctx2.moveTo(a.px,a.py); ctx2.lineTo(b.px,b.py); ctx2.stroke();
      }
    }
    // add table row
    updateEngTable(curT, h, v, E_pot, E_kin);
  }

  function updateEngTable(t, h, v, E_pot, E_kin) {
    if(engTableRows.length === 0 || t - engTableRows[engTableRows.length-1].t > 0.5){
      engTableRows.push({t,h,v,E_pot,E_kin});
      if(engTableRows.length > 20) engTableRows.shift();
    }
    const tb=document.getElementById('engTbody'), tw=document.getElementById('engTable');
    if(!tb||!tw) return;
    if(engTableRows.length>0) tw.style.display='table';
    tb.innerHTML=engTableRows.slice(-8).map(r=>`<tr>
      <td>${r.t.toFixed(2).replace('.',',')}</td>
      <td>${r.h.toFixed(3).replace('.',',')}</td>
      <td>${r.v.toFixed(2).replace('.',',')}</td>
      <td>${r.E_pot.toFixed(3).replace('.',',')}</td>
      <td>${r.E_kin.toFixed(3).replace('.',',')}</td>
    </tr>`).join('');
  }

  function stop() { if (animId) cancelAnimationFrame(animId); }
  function set(key, val) {
    startTime = null; engPts.length=0; engTableRows.length=0;
    engMeas.length=0; engSelArr.length=0;
    const res=document.getElementById('engResult'); if(res) res.innerHTML='';
    if (key === 'angle') {
      theta0 = val * Math.PI / 180;
      const lbl = document.getElementById('engAngleLabel');
      if (lbl) lbl.textContent = val;
    }
    if (key === 'l') {
      L = val;
      const lbl = document.getElementById('engLLabel');
      if (lbl) lbl.textContent = val.toFixed(1).replace('.', ',');
    }
  }

  function engMeasure() {
    if(engPts.length===0) return;
    const last=engPts[engPts.length-1];
    const c=document.getElementById('engChart'); if(!c) return;
    const P2={l:55,r:20,t:22,b:42};
    const gW2=c.width-P2.l-P2.r, gH2=c.height-P2.t-P2.b;
    const tStart=engPts[0].t;
    const tWindow=8;
    const Emax=Math.max(last.E_tot*1.2,0.01);
    const curT=last.t;
    function ptX2(tp){ return P2.l+((tp-tStart)/Math.max(tWindow,curT-tStart+1))*gW2; }
    function ptY2(e){ return P2.t+gH2-(e/Emax)*gH2; }
    const px=ptX2(last.t);
    const py=ptY2(last.E_pot);
    engMeas.push({t:last.t,E_pot:last.E_pot,E_kin:last.E_kin,E_tot:last.E_tot,px,py});
  }

  function engHandleClick(mx,my) {
    if(engMeas.length===0) return;
    // Recalculate pixel positions (they may drift as chart scrolls)
    const c=document.getElementById('engChart'); if(!c) return;
    const P2={l:55,r:20,t:22,b:42};
    const gW2=c.width-P2.l-P2.r, gH2=c.height-P2.t-P2.b;
    const tStart=engPts.length>0?engPts[0].t:0;
    const curT=engPts.length>0?engPts[engPts.length-1].t:0;
    const tWindow=8;
    const Emax=engPts.length>0?Math.max(engPts[engPts.length-1].E_tot*1.2,0.01):1;
    engMeas.forEach(p=>{
      p.px=P2.l+((p.t-tStart)/Math.max(tWindow,curT-tStart+1))*gW2;
      p.py=P2.t+gH2-(p.E_pot/Emax)*gH2;
    });
    let best=-1, bestD=22;
    engMeas.forEach((p,i)=>{
      const d=Math.hypot(p.px-mx,p.py-my);
      if(d<bestD){ bestD=d; best=i; }
    });
    if(best===-1) return;
    const idx=engSelArr.indexOf(best);
    if(idx>=0) engSelArr.splice(idx,1);
    else{ if(engSelArr.length>=2) engSelArr=[engSelArr[1]]; engSelArr.push(best); }
    if(engSelArr.length===2){
      const a=engMeas[engSelArr[0]], b=engMeas[engSelArr[1]];
      const deltaEpot=Math.abs(b.E_pot-a.E_pot);
      const deltaEkin=Math.abs(b.E_kin-a.E_kin);
      const sum=((b.E_pot+b.E_kin)-(a.E_pot+a.E_kin));
      const res=document.getElementById('engResult');
      if(res) res.innerHTML=`<b>ΔE_pot + ΔE_kin = ${sum.toFixed(3)} J ≈ 0 → Energieerhaltung bestätigt!</b>`;
    } else {
      const res=document.getElementById('engResult');
      if(res&&engSelArr.length===0) res.innerHTML='';
    }
  }

  animId = requestAnimationFrame(draw);
  return { stop, set, measure: engMeasure, handleClick: engHandleClick };
}

// ============================================================
// SIM 9: IMPULSERHALTUNG
// ============================================================
function _simImpuls() {
  const canvas = document.getElementById('impCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let m1 = 2, v1 = 5, m2 = 2;
  let state = 'before'; // before | animating | after
  let animId = null;
  let b1x, b2x, b1v, b2v, animT = 0;
  const impScatter = [];
  let impSel = [];

  function fmt(n, d=1) { return n.toFixed(d).replace('.', ','); }

  function initPositions() {
    b1x = 80; b2x = W - 100;
  }
  initPositions();

  function draw(ts) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

    const trackY = H / 2 + 10;
    // track
    ctx.fillStyle = '#94A3B8'; ctx.fillRect(20, trackY, W - 40, 12);

    const r1 = 12 + m1 * 2, r2 = 12 + m2 * 2;

    if (state === 'animating') {
      animT += 0.025;
      const speed = 80;
      b1x += b1v * speed * 0.025;
      b2x += b2v * speed * 0.025;

      // check overlap for collision end
      if (b1v > 0 && b1x + r1 >= b2x - r2 && animT > 0.1) {
        state = 'after';
        updateAfterInfo();
      }
      if (animT > 4) state = 'after';
    }

    // ball 1
    ctx.beginPath();
    ctx.arc(b1x, trackY - r1, r1, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(fmt(m1, 0) + 'kg', b1x, trackY - r1 + 4);

    // ball 2
    ctx.beginPath();
    ctx.arc(b2x, trackY - r2, r2, 0, Math.PI * 2);
    ctx.fillStyle = '#2563EB'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(fmt(m2, 0) + 'kg', b2x, trackY - r2 + 4);

    // velocity labels
    if (state === 'before') {
      ctx.fillStyle = '#DC2626'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('v₁ = ' + fmt(v1) + ' m/s →', b1x, trackY - r1 * 2 - 10);
      ctx.fillStyle = '#2563EB';
      ctx.fillText('v₂ = 0 m/s', b2x, trackY - r2 * 2 - 10);
    } else if (state === 'after' || state === 'animating') {
      const v1a = (m1 - m2) / (m1 + m2) * v1;
      const v2a = 2 * m1 / (m1 + m2) * v1;
      ctx.fillStyle = '#DC2626'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText("v₁' = " + fmt(v1a) + ' m/s', b1x, trackY - r1 * 2 - 10);
      ctx.fillStyle = '#2563EB';
      ctx.fillText("v₂' = " + fmt(v2a) + ' m/s', b2x, trackY - r2 * 2 - 10);
    }

    animId = requestAnimationFrame(draw);
  }

  function updateAfterInfo() {
    const pVor = m1 * v1;
    const v1a = (m1 - m2) / (m1 + m2) * v1;
    const v2a = 2 * m1 / (m1 + m2) * v1;
    const pNach = m1 * v1a + m2 * v2a;
    const pVorEl = document.getElementById('impPvor');
    const pNachEl = document.getElementById('impPnach');
    if (pVorEl) pVorEl.textContent = fmt(pVor) + ' kg·m/s';
    if (pNachEl) pNachEl.textContent = fmt(pNach, 1) + ' kg·m/s ✓';
    // add to scatter
    const pMax_sc=Math.max(...impScatter.map(p=>Math.max(p.x,p.y)),pVor,pNach,5)*1.2;
    const c=document.getElementById('impChart');
    if(c){
      const P={l:60,r:20,t:28,b:35};
      const gW=c.width-P.l-P.r, gH=c.height-P.t-P.b;
      const pM=Math.max(pVor,pNach,5)*1.3;
      const px=P.l+(pVor/pM)*gW;
      const py=P.t+gH-(pNach/pM)*gH;
      impScatter.push({x:pVor,y:pNach,px,py});
    }
    drawImpChart();
    updateImpTable(v1, v1a, v2a);
  }

  function drawImpChart() {
    const c = document.getElementById('impChart'); if (!c) return;
    const ctx2 = c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:60,r:20,t:28,b:35};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f8fafc'; ctx2.fillRect(0,0,cW,cH);
    const pM=Math.max(...impScatter.map(p=>Math.max(p.x,p.y)),5)*1.3;
    // recalculate pixel positions
    impScatter.forEach(p=>{
      p.px=P.l+(p.x/pM)*gW;
      p.py=P.t+gH-(p.y/pM)*gH;
    });
    // grid
    ctx2.strokeStyle='#e5e7eb'; ctx2.lineWidth=1;
    for(let i=1;i<=4;i++){
      const y=P.t+(i/4)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
      const x=P.l+(i/4)*gW; ctx2.beginPath(); ctx2.moveTo(x,P.t); ctx2.lineTo(x,P.t+gH); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    ctx2.fillText('p_vor (kg·m/s)', P.l+gW/2, cH-2);
    ctx2.save(); ctx2.translate(14,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('p_nach (kg·m/s)',0,0); ctx2.restore();
    ctx2.textAlign='right';
    for(let i=0;i<=4;i++) ctx2.fillText((pM*i/4).toFixed(1), P.l-4, P.t+gH-(i/4)*gH+4);
    ctx2.textAlign='center';
    for(let i=0;i<=4;i++) ctx2.fillText((pM*i/4).toFixed(1), P.l+(i/4)*gW, P.t+gH+14);
    // reference line y=x (dashed)
    ctx2.strokeStyle='#94a3b8'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t); ctx2.stroke(); ctx2.setLineDash([]);
    ctx2.font='9px sans-serif'; ctx2.fillStyle='#94a3b8'; ctx2.textAlign='left';
    ctx2.fillText('p_vor=p_nach',P.l+4,P.t+14);
    // scatter points
    impScatter.forEach((p,i)=>{
      const sel=impSel.includes(i);
      ctx2.fillStyle=sel?'#f97316':'#7c3aed';
      ctx2.beginPath(); ctx2.arc(p.px,p.py,7,0,Math.PI*2); ctx2.fill();
      if(sel){ ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2; ctx2.beginPath(); ctx2.arc(p.px,p.py,10,0,Math.PI*2); ctx2.stroke(); }
    });
    if(impSel.length===2){
      const a=impScatter[impSel[0]], b=impScatter[impSel[1]];
      if(Math.abs(b.x-a.x)>0.01){
        const slope=(b.y-a.y)/(b.x-a.x);
        ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2;
        ctx2.beginPath(); ctx2.moveTo(a.px,a.py); ctx2.lineTo(b.px,b.py); ctx2.stroke();
        const res=document.getElementById('impResult');
        if(res) res.innerHTML=`<b>Steigung = ${slope.toFixed(2)} ≈ 1 → Impulserhaltung bestätigt!</b>`;
      }
    } else {
      const res=document.getElementById('impResult');
      if(res&&impSel.length===0&&impScatter.length>0) res.innerHTML='';
    }
  }

  function updateImpTable(v1_vor, v1_nach, v2_nach){
    const tb=document.getElementById('impTbody'), tw=document.getElementById('impTable');
    if(!tb||!tw) return;
    tw.style.display='table';
    const p1_vor=m1*v1_vor, p1_nach=m1*v1_nach, p2_nach=m2*v2_nach;
    tb.innerHTML=`
      <tr><td>Kugel 1</td><td>${fmt(m1)}</td><td>${fmt(v1_vor)}</td><td>${fmt(v1_nach)}</td><td>${fmt(p1_nach)}</td></tr>
      <tr><td>Kugel 2</td><td>${fmt(m2)}</td><td>0,0</td><td>${fmt(v2_nach)}</td><td>${fmt(p2_nach)}</td></tr>
      <tr style="font-weight:700;background:#f0fdf4"><td>Gesamt</td><td>${fmt(m1+m2)}</td><td>–</td><td>–</td><td>${fmt(p1_nach+p2_nach)} ✓</td></tr>
    `;
  }

  function stop() { if (animId) cancelAnimationFrame(animId); }
  function set(key, val) {
    if (key === 'm1') { m1 = val; const l = document.getElementById('impM1Label'); if (l) l.textContent = fmt(val); }
    if (key === 'v1') { v1 = val; const l = document.getElementById('impV1Label'); if (l) l.textContent = fmt(val); }
    if (key === 'm2') { m2 = val; const l = document.getElementById('impM2Label'); if (l) l.textContent = fmt(val); }
    state = 'before'; initPositions(); animT = 0;
    const pEl = document.getElementById('impPvor');
    if (pEl) pEl.textContent = fmt(m1 * v1, 1) + ' kg·m/s';
    const nEl = document.getElementById('impPnach');
    if (nEl) nEl.textContent = '–';
    const c = document.getElementById('impChart'); if(c){ const ctx2=c.getContext('2d'); ctx2.clearRect(0,0,c.width,c.height); }
    const tw=document.getElementById('impTable'); if(tw) tw.style.display='none';
  }
  function stoss() {
    if (state !== 'before') { reset(); return; }
    const v1a = (m1 - m2) / (m1 + m2) * v1;
    const v2a = 2 * m1 / (m1 + m2) * v1;
    b1v = v1a; b2v = v2a;
    // start with b1 moving toward b2
    b1x = 80; b2x = W - 100;
    // animate approach then separate
    b1v = v1; // approach speed
    state = 'animating'; animT = 0;
  }
  function reset() {
    state = 'before'; initPositions(); animT = 0;
    const pEl = document.getElementById('impPvor');
    if (pEl) pEl.textContent = fmt(m1 * v1, 1) + ' kg·m/s';
    const nEl = document.getElementById('impPnach');
    if (nEl) nEl.textContent = '–';
  }

  function impHandleClick(mx,my) {
    if(impScatter.length===0) return;
    // recalculate positions based on current pM
    const c=document.getElementById('impChart'); if(!c) return;
    const P={l:60,r:20,t:28,b:35};
    const gW=c.width-P.l-P.r, gH=c.height-P.t-P.b;
    const pM=Math.max(...impScatter.map(p=>Math.max(p.x,p.y)),5)*1.3;
    impScatter.forEach(p=>{
      p.px=P.l+(p.x/pM)*gW;
      p.py=P.t+gH-(p.y/pM)*gH;
    });
    let best=-1, bestD=22;
    impScatter.forEach((p,i)=>{
      const d=Math.hypot(p.px-mx,p.py-my);
      if(d<bestD){ bestD=d; best=i; }
    });
    if(best===-1) return;
    const idx=impSel.indexOf(best);
    if(idx>=0) impSel.splice(idx,1);
    else{ if(impSel.length>=2) impSel=[impSel[1]]; impSel.push(best); }
    drawImpChart();
  }

  animId = requestAnimationFrame(draw);
  return { stop, set, stoss, reset, handleClick: impHandleClick };
}

// ============================================================
// SIM 10: FADENPENDEL
// ============================================================
function _simFadenpendel() {
  const canvas = document.getElementById('penCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const g = 9.81;
  const theta0 = 30 * Math.PI / 180;
  let L = 1.0;
  let animId = null, startTime = null;

  function fmt(n, d=2) { return n.toFixed(d).replace('.', ','); }

  function draw(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000;
    const omega = Math.sqrt(g / L);
    const T = 2 * Math.PI / omega;
    const theta = theta0 * Math.cos(omega * t);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f5f3ff'; ctx.fillRect(0, 0, W, H);

    const pivotX = W / 2, pivotY = 30;
    const scale = Math.min((H - 60) / L, 160);
    const ballX = pivotX + Math.sin(theta) * L * scale;
    const ballY = pivotY + Math.cos(theta) * L * scale;

    // ceiling
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(pivotX - 25, 0, 50, 15);
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#64748B'; ctx.fill();

    // ghost path
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, L * scale, Math.PI / 2 - theta0 - 0.1, Math.PI / 2 + theta0 + 0.1);
    ctx.strokeStyle = 'rgba(124,58,237,0.15)'; ctx.lineWidth = 2; ctx.stroke();

    // string
    ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(ballX, ballY);
    ctx.strokeStyle = '#4B5563'; ctx.lineWidth = 2; ctx.stroke();

    // ball
    const bR = 16;
    ctx.beginPath(); ctx.arc(ballX, ballY, bR, 0, Math.PI * 2);
    ctx.fillStyle = '#7C3AED'; ctx.fill();
    ctx.strokeStyle = '#4C1D95'; ctx.lineWidth = 2; ctx.stroke();

    // length label
    ctx.fillStyle = '#5B21B6'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('L = ' + fmt(L) + ' m', pivotX + 6, pivotY + L * scale / 2);

    // period box
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillRect(10, 10, 140, 50);
    ctx.fillStyle = '#374151'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('T = 2π·√(L/g)', 18, 28);
    ctx.font = '13px sans-serif';
    ctx.fillText('T = ' + fmt(T) + ' s', 18, 50);

    // angle display
    const deg = Math.abs(theta * 180 / Math.PI).toFixed(1);
    ctx.fillStyle = '#374151'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('θ = ' + deg.replace('.', ',') + '°', W / 2, H - 10);

    // update HTML
    const lEl = document.getElementById('penLVal');
    const tEl = document.getElementById('penTVal');
    const aEl = document.getElementById('penAngleVal');
    if (lEl) lEl.textContent = fmt(L);
    if (tEl) tEl.textContent = fmt(T);
    if (aEl) aEl.textContent = (Math.abs(theta * 180 / Math.PI)).toFixed(0).replace('.', ',');

    drawPenChart(T);
    animId = requestAnimationFrame(draw);
  }

  const penMeas = [];
  let penSel = [];

  function drawPenChart(T_cur) {
    const c = document.getElementById('penChart'); if (!c) return;
    const ctx2 = c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:55,r:20,t:22,b:42};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f5f3ff'; ctx2.fillRect(0,0,cW,cH);
    const Lmax=2.0, Tmax=4.5;
    ctx2.strokeStyle='#ece9f8'; ctx2.lineWidth=1;
    for(let i=1;i<=5;i++){
      const y=P.t+(i/5)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
      const x=P.l+(i/5)*gW; ctx2.beginPath(); ctx2.moveTo(x,P.t); ctx2.lineTo(x,P.t+gH); ctx2.stroke();
    }
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.fillStyle='#333';
    ctx2.beginPath(); ctx2.moveTo(P.l+gW,P.t+gH); ctx2.lineTo(P.l+gW+7,P.t+gH-3); ctx2.lineTo(P.l+gW+7,P.t+gH+3); ctx2.fill();
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l-3,P.t+8); ctx2.lineTo(P.l+3,P.t+8); ctx2.fill();
    ctx2.font='bold 12px Nunito,sans-serif'; ctx2.fillStyle='#333'; ctx2.textAlign='center';
    ctx2.fillText('Länge L (m)', P.l+gW/2, cH-4);
    ctx2.save(); ctx2.translate(14,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('Periodendauer T (s)',0,0); ctx2.restore();
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    for(let i=0;i<=5;i++) ctx2.fillText((Lmax*i/5).toFixed(1), P.l+(i/5)*gW, P.t+gH+14);
    ctx2.textAlign='right';
    for(let i=0;i<=5;i++) ctx2.fillText((Tmax*i/5).toFixed(1), P.l-4, P.t+gH-(i/5)*gH+4);
    // theoretical curve T=2π√(L/g)
    ctx2.strokeStyle='#7c3aed44'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath();
    for(let i=0;i<=100;i++){
      const l=Lmax*i/100;
      const t_=2*Math.PI*Math.sqrt(l/g);
      const x=P.l+(l/Lmax)*gW, y=P.t+gH-(Math.min(t_,Tmax)/Tmax)*gH;
      i===0?ctx2.moveTo(x,y):ctx2.lineTo(x,y);
    }
    ctx2.stroke(); ctx2.setLineDash([]);
    ctx2.font='11px sans-serif'; ctx2.fillStyle='#7c3aed'; ctx2.textAlign='left';
    ctx2.fillText('T=2π√(L/g)', P.l+4, P.t+12);
    // current point
    const cpx=P.l+(L/Lmax)*gW, cpy=P.t+gH-(Math.min(T_cur,Tmax)/Tmax)*gH;
    ctx2.fillStyle='#7c3aed';
    ctx2.beginPath(); ctx2.arc(cpx,cpy,6,0,Math.PI*2); ctx2.fill();
    // slope line + result when 2 points selected
    if (penSel.length === 2) {
      const [i1,i2] = [...penSel].sort((a,b)=>penMeas[a].L-penMeas[b].L);
      const p1=penMeas[i1], p2=penMeas[i2];
      const pxFn = mp => P.l+(mp.L/Lmax)*gW;
      const pyFn = mp => P.t+gH-(Math.min(mp.T,Tmax)/Tmax)*gH;
      ctx2.strokeStyle='#F97316'; ctx2.lineWidth=3;
      ctx2.beginPath(); ctx2.moveTo(pxFn(p1),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p2)); ctx2.stroke();
      ctx2.strokeStyle='#EF4444'; ctx2.lineWidth=1.5; ctx2.setLineDash([4,3]);
      ctx2.beginPath();
      ctx2.moveTo(pxFn(p1),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p1)); ctx2.lineTo(pxFn(p2),pyFn(p2));
      ctx2.stroke(); ctx2.setLineDash([]);
      const dL=parseFloat((p2.L-p1.L).toFixed(3));
      const dT=parseFloat((p2.T-p1.T).toFixed(3));
      if(Math.abs(dL)>0 && Math.abs(dT)>0){
        // T=2π√(L/g) → T²=4π²L/g → g=4π²ΔL/ΔT²
        const g_calc=(4*Math.PI*Math.PI*Math.abs(dL)/(dT*dT)).toFixed(2);
        const res=document.getElementById('penResult');
        if(res) res.innerHTML='Aus ΔT/ΔL: g ≈ <b class="sim-v-result">'+g_calc+' m/s²</b> &nbsp;(Theoriewert: 9,81 m/s²)';
      }
    }
    // measured points
    penMeas.forEach((mp,idx) => {
      const isSel = penSel.includes(idx);
      ctx2.fillStyle = isSel ? '#F97316' : '#dc2626';
      ctx2.strokeStyle = isSel ? '#C2410C' : '#b91c1c';
      ctx2.lineWidth=2;
      const mx=P.l+(mp.L/Lmax)*gW, my=P.t+gH-(Math.min(mp.T,Tmax)/Tmax)*gH;
      ctx2.beginPath(); ctx2.arc(mx,my,isSel?9:6,0,Math.PI*2); ctx2.fill(); ctx2.stroke();
      ctx2.fillStyle='#fff'; ctx2.font='bold 9px Nunito,sans-serif'; ctx2.textAlign='center';
      ctx2.fillText(idx+1, mx, my+3);
    });
  }

  function penHandleClick(mx, my) {
    const cW=460, cH=180;
    const P={l:55,r:20,t:22,b:42};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const Lmax=2.0, Tmax=4.5;
    const pxFn = mp => P.l+(mp.L/Lmax)*gW;
    const pyFn = mp => P.t+gH-(Math.min(mp.T,Tmax)/Tmax)*gH;
    let closest=-1, minD=24;
    penMeas.forEach((mp,i) => {
      const d=Math.hypot(pxFn(mp)-mx, pyFn(mp)-my);
      if(d<minD){ minD=d; closest=i; }
    });
    if(closest<0) return;
    if(penSel.includes(closest)) penSel=penSel.filter(i=>i!==closest);
    else if(penSel.length<2) penSel.push(closest);
    else penSel=[closest];
    const omega2=Math.sqrt(g/L), T2=2*Math.PI/omega2;
    drawPenChart(T2);
  }

  function penMeasure() {
    const omega=Math.sqrt(g/L), T=2*Math.PI/omega;
    penMeas.push({L:parseFloat(L.toFixed(3)),T:parseFloat(T.toFixed(3))});
    penSel=[];
    const res=document.getElementById('penResult');
    if(res) res.innerHTML='';
    updatePenTable();
  }

  function updatePenTable(){
    const tb=document.getElementById('penTbody'), tw=document.getElementById('penTable');
    if(!tb||!tw) return;
    if(penMeas.length>0) tw.style.display='table';
    const g2=9.81;
    tb.innerHTML=penMeas.map(m=>{
      const T_calc=2*Math.PI*Math.sqrt(m.L/g2);
      return `<tr><td>${m.L.toFixed(3).replace('.',',')}</td><td>${m.T.toFixed(3).replace('.',',')}</td><td>${T_calc.toFixed(3).replace('.',',')}</td></tr>`;
    }).join('');
  }

  function stop() { if (animId) cancelAnimationFrame(animId); }
  function setL(val) {
    L = val; startTime = null;
    const lbl = document.getElementById('penLLabel');
    if (lbl) lbl.textContent = val.toFixed(2).replace('.', ',');
  }

  animId = requestAnimationFrame(draw);
  return { stop, setL, measure: penMeasure, handleClick: penHandleClick };
}

// ============================================================
// SIM: FEDERPENDEL (Klasse 11)
// ============================================================
function _simFederpendel() {
  const cvAnim = document.getElementById('fpAnimCanvas');
  const cvST   = document.getElementById('fpSTChart');
  const cvVT   = document.getElementById('fpVTChart');
  if (!cvAnim) return { stop(){}, toggle(){}, reset(){}, setM(){}, setD(){} };
  const ctxA = cvAnim.getContext('2d');
  const WA = cvAnim.width, HA = cvAnim.height;

  let m = 0.5, D = 20;
  const AMP = 0.10;        // amplitude 10 cm in m (fixed)
  let simTime = 0;
  let lastTs = null;
  let animId = null;
  let measuring = false;
  let measTimer = null;
  let data = [];

  const fmt  = (n, d=2) => n.toFixed(d).replace('.', ',');
  const omega = () => Math.sqrt(D / m);
  const period= () => 2 * Math.PI / omega();
  const s_m  = t => AMP * Math.cos(omega() * t);
  const v_ms = t => -AMP * omega() * Math.sin(omega() * t);
  const F_N  = t => -D * s_m(t);

  // ── Canvas helpers ──────────────────────────────────────────
  const ANCHOR_X = WA / 2, ANCHOR_Y = 22;
  const Y_EQ = 158;   // equilibrium y
  const PX_M = 270;   // px per metre
  const MW = 48, MH = 26;  // mass block size

  function yMass(s) { return Y_EQ + s * PX_M; }

  function drawSpring(ctx, x, y0, y1, coils) {
    const n = coils * 2;
    const segH = (y1 - y0) / (n + 2);
    const hw = 20;
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x, y0 + segH);
    for (let i = 0; i < n; i++) {
      ctx.lineTo(x + (i % 2 === 0 ? hw : -hw), y0 + segH + (i + 1) * segH);
    }
    ctx.lineTo(x, y1);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2.5; ctx.stroke();
  }

  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
    ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
    ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
    ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
  }

  function drawAnim(t) {
    const s = s_m(t), v = v_ms(t), F = F_N(t);
    const yM = yMass(s);

    ctxA.clearRect(0,0,WA,HA);
    // Background
    ctxA.fillStyle = '#f8fafc'; ctxA.fillRect(0,0,WA,HA);

    // Equilibrium dashed line
    ctxA.strokeStyle='#c7d2fe'; ctxA.lineWidth=1.5; ctxA.setLineDash([6,4]);
    ctxA.beginPath(); ctxA.moveTo(40,Y_EQ); ctxA.lineTo(WA-10,Y_EQ); ctxA.stroke();
    ctxA.setLineDash([]);
    ctxA.fillStyle='#818cf8'; ctxA.font='10px sans-serif'; ctxA.textAlign='left';
    ctxA.fillText('Ruhelage (s = 0)', 44, Y_EQ - 4);

    // Ceiling bar
    ctxA.fillStyle='#94a3b8';
    ctxA.fillRect(ANCHOR_X-32, 0, 64, ANCHOR_Y-4);
    for(let i=0;i<5;i++){
      ctxA.strokeStyle='#64748b'; ctxA.lineWidth=1.5;
      ctxA.beginPath();
      ctxA.moveTo(ANCHOR_X-24+i*12, ANCHOR_Y-4);
      ctxA.lineTo(ANCHOR_X-30+i*12, 0);
      ctxA.stroke();
    }
    ctxA.beginPath(); ctxA.arc(ANCHOR_X,ANCHOR_Y,5,0,Math.PI*2);
    ctxA.fillStyle='#475569'; ctxA.fill();

    // Spring
    const massTopY = yM - MH/2;
    drawSpring(ctxA, ANCHOR_X, ANCHOR_Y+5, massTopY, 9);

    // Displacement arrow (left side)
    if (Math.abs(s) > 0.004) {
      const ax = ANCHOR_X - 40;
      ctxA.strokeStyle='#7C3AED'; ctxA.lineWidth=2; ctxA.setLineDash([4,3]);
      ctxA.beginPath(); ctxA.moveTo(ax,Y_EQ); ctxA.lineTo(ax,yM); ctxA.stroke();
      ctxA.setLineDash([]);
      // arrowhead
      const dir = s > 0 ? 1 : -1;
      ctxA.fillStyle='#7C3AED';
      ctxA.beginPath(); ctxA.moveTo(ax,yM); ctxA.lineTo(ax-5,yM-dir*9); ctxA.lineTo(ax+5,yM-dir*9); ctxA.fill();
      ctxA.font='bold 12px sans-serif'; ctxA.textAlign='center'; ctxA.fillStyle='#5b21b6';
      ctxA.fillText('s', ax, (Y_EQ+yM)/2 + 4);
    }

    // Force arrow (right side)
    if (Math.abs(F) > 0.05) {
      const ax = ANCHOR_X + 38;
      const arrowLen = Math.min(Math.abs(F) * 18, 50);
      const arrowDir = F < 0 ? -1 : 1;  // F<0 → force upward (restoring when s>0)
      ctxA.strokeStyle='#DC2626'; ctxA.lineWidth=2.5;
      ctxA.beginPath(); ctxA.moveTo(ax,yM); ctxA.lineTo(ax,yM - arrowDir*arrowLen); ctxA.stroke();
      ctxA.fillStyle='#DC2626';
      ctxA.beginPath();
      ctxA.moveTo(ax,yM - arrowDir*arrowLen);
      ctxA.lineTo(ax-5,yM - arrowDir*(arrowLen-9));
      ctxA.lineTo(ax+5,yM - arrowDir*(arrowLen-9));
      ctxA.fill();
      ctxA.font='bold 12px sans-serif'; ctxA.textAlign='left'; ctxA.fillStyle='#b91c1c';
      ctxA.fillText('F', ax+7, yM - arrowDir*arrowLen/2 + 4);
    }

    // Mass block
    const bx = ANCHOR_X-MW/2, by = yM-MH/2;
    // Spring connects here (top center of block)
    ctxA.fillStyle='rgba(0,0,0,0.08)'; rrect(ctxA,bx+3,by+3,MW,MH,6); ctxA.fill();
    ctxA.fillStyle='#2563EB'; rrect(ctxA,bx,by,MW,MH,6); ctxA.fill();
    ctxA.strokeStyle='#1e40af'; ctxA.lineWidth=1.5; rrect(ctxA,bx,by,MW,MH,6); ctxA.stroke();
    ctxA.fillStyle='#fff'; ctxA.font='bold 13px Nunito,sans-serif'; ctxA.textAlign='center';
    ctxA.fillText('m', ANCHOR_X, yM+5);

    // Info panel
    const ip={x:WA-160,y:HA-96,w:152,h:90};
    ctxA.fillStyle='rgba(255,255,255,0.93)'; ctxA.fillRect(ip.x,ip.y,ip.w,ip.h);
    ctxA.strokeStyle='#e2e8f0'; ctxA.lineWidth=1; ctxA.strokeRect(ip.x,ip.y,ip.w,ip.h);
    ctxA.fillStyle='#1e1b4b'; ctxA.font='bold 11px sans-serif'; ctxA.textAlign='left';
    ctxA.fillText('s = '+fmt(s*100,1)+' cm',  ip.x+8, ip.y+18);
    ctxA.fillText('v = '+fmt(v*100,1)+' cm/s', ip.x+8, ip.y+34);
    ctxA.fillText('F = '+fmt(F,2)+' N',        ip.x+8, ip.y+50);
    ctxA.fillText('T = '+fmt(period(),2)+' s', ip.x+8, ip.y+66);
    ctxA.fillText('t = '+fmt(simTime,1)+' s',  ip.x+8, ip.y+82);

    // Measuring indicator
    if (measuring) {
      ctxA.fillStyle='#16a34a'; ctxA.font='bold 11px sans-serif'; ctxA.textAlign='right';
      ctxA.fillText('● REC', WA-8, 18);
    }

    // Update HTML info row
    const ids={fpSVal:fmt(s*100,1), fpVVal:fmt(v*100,1), fpFVal:fmt(F,2), fpTVal:fmt(period(),2)};
    Object.entries(ids).forEach(([id,val])=>{const el=document.getElementById(id);if(el)el.textContent=val;});
  }

  // ── Charts ─────────────────────────────────────────────────
  function _chartBase(ctx2, cW, cH, P, xLabel, yLabel, tMax, yMax, zeroline) {
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f5f3ff'; ctx2.fillRect(0,0,cW,cH);
    ctx2.strokeStyle='#ece9f8'; ctx2.lineWidth=1;
    for(let i=1;i<=5;i++){
      const y=P.t+(i/5)*gH; ctx2.beginPath();ctx2.moveTo(P.l,y);ctx2.lineTo(P.l+gW,y);ctx2.stroke();
      const x=P.l+(i/5)*gW; ctx2.beginPath();ctx2.moveTo(x,P.t);ctx2.lineTo(x,P.t+gH);ctx2.stroke();
    }
    ctx2.strokeStyle='#333';ctx2.lineWidth=2;
    ctx2.beginPath();ctx2.moveTo(P.l,P.t);ctx2.lineTo(P.l,P.t+gH);ctx2.lineTo(P.l+gW,P.t+gH);ctx2.stroke();
    ctx2.fillStyle='#333';
    ctx2.beginPath();ctx2.moveTo(P.l+gW,P.t+gH);ctx2.lineTo(P.l+gW+7,P.t+gH-3);ctx2.lineTo(P.l+gW+7,P.t+gH+3);ctx2.fill();
    ctx2.beginPath();ctx2.moveTo(P.l,P.t);ctx2.lineTo(P.l-3,P.t+7);ctx2.lineTo(P.l+3,P.t+7);ctx2.fill();
    ctx2.font='bold 11px Nunito,sans-serif'; ctx2.fillStyle='#333'; ctx2.textAlign='center';
    ctx2.fillText(xLabel, P.l+gW/2, cH-4);
    ctx2.save();ctx2.translate(13,P.t+gH/2);ctx2.rotate(-Math.PI/2);ctx2.fillText(yLabel,0,0);ctx2.restore();
    ctx2.font='9px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    const steps=5;
    for(let i=0;i<=steps;i++) ctx2.fillText(fmt(tMax*i/steps,1), P.l+(i/steps)*gW, P.t+gH+13);
    if (zeroline) {
      const y0=P.t+gH/2;
      ctx2.strokeStyle='#999';ctx2.lineWidth=1;ctx2.setLineDash([4,4]);
      ctx2.beginPath();ctx2.moveTo(P.l,y0);ctx2.lineTo(P.l+gW,y0);ctx2.stroke();
      ctx2.setLineDash([]);
    }
    return {gW,gH};
  }

  function drawSTChart() {
    if (!cvST) return;
    const ctx2=cvST.getContext('2d'), cW=cvST.width, cH=cvST.height;
    const P={l:52,r:16,t:18,b:36};
    const tMax=Math.max(4*period(), data.length>0?data[data.length-1].t+0.5:4*period());
    const sMax=12;
    const {gW,gH}=_chartBase(ctx2,cW,cH,P,'Zeit t (s)','s (cm)',tMax,sMax,true);
    // Y labels
    ctx2.font='9px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='right';
    [sMax, sMax/2, 0, -sMax/2, -sMax].forEach((v,i)=>ctx2.fillText(v.toFixed(0),P.l-3,P.t+(i/4)*gH+4));
    // Theory curve
    ctx2.strokeStyle='rgba(124,58,237,0.25)'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath();
    for(let i=0;i<=120;i++){
      const t=tMax*i/120, s=s_m(t)*100;
      const x=P.l+(t/tMax)*gW, y=P.t+gH/2-(s/sMax)*(gH/2);
      i===0?ctx2.moveTo(x,y):ctx2.lineTo(x,y);
    }
    ctx2.stroke();ctx2.setLineDash([]);
    // Data
    if(data.length>1){
      ctx2.strokeStyle='#7C3AED'; ctx2.lineWidth=2; ctx2.beginPath();
      data.forEach((d,i)=>{
        const x=P.l+(Math.min(d.t,tMax)/tMax)*gW;
        const y=P.t+gH/2-(Math.max(-sMax,Math.min(sMax,d.s_cm))/sMax)*(gH/2);
        i===0?ctx2.moveTo(x,y):ctx2.lineTo(x,y);
      });
      ctx2.stroke();
    }
    data.forEach(d=>{
      const x=P.l+(Math.min(d.t,tMax)/tMax)*gW;
      const y=P.t+gH/2-(Math.max(-sMax,Math.min(sMax,d.s_cm))/sMax)*(gH/2);
      ctx2.beginPath();ctx2.arc(x,y,3,0,Math.PI*2);
      ctx2.fillStyle='#7C3AED';ctx2.fill();
    });
  }

  function drawVTChart() {
    if (!cvVT) return;
    const ctx2=cvVT.getContext('2d'), cW=cvVT.width, cH=cvVT.height;
    const P={l:58,r:16,t:18,b:36};
    const tMax=Math.max(4*period(), data.length>0?data[data.length-1].t+0.5:4*period());
    const vMax=Math.ceil(AMP*omega()*100*1.15);
    const {gW,gH}=_chartBase(ctx2,cW,cH,P,'Zeit t (s)','v (cm/s)',tMax,vMax,true);
    // Y labels
    ctx2.font='9px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='right';
    [vMax, vMax/2, 0, -vMax/2, -vMax].forEach((v,i)=>ctx2.fillText(Math.round(v),P.l-3,P.t+(i/4)*gH+4));
    // Theory
    ctx2.strokeStyle='rgba(2,132,199,0.25)'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath();
    for(let i=0;i<=120;i++){
      const t=tMax*i/120, v=v_ms(t)*100;
      const x=P.l+(t/tMax)*gW, y=P.t+gH/2-(v/vMax)*(gH/2);
      i===0?ctx2.moveTo(x,y):ctx2.lineTo(x,y);
    }
    ctx2.stroke();ctx2.setLineDash([]);
    // Data
    if(data.length>1){
      ctx2.strokeStyle='#0284C7'; ctx2.lineWidth=2; ctx2.beginPath();
      data.forEach((d,i)=>{
        const x=P.l+(Math.min(d.t,tMax)/tMax)*gW;
        const y=P.t+gH/2-(Math.max(-vMax,Math.min(vMax,d.v_cms))/vMax)*(gH/2);
        i===0?ctx2.moveTo(x,y):ctx2.lineTo(x,y);
      });
      ctx2.stroke();
    }
    data.forEach(d=>{
      const x=P.l+(Math.min(d.t,tMax)/tMax)*gW;
      const y=P.t+gH/2-(Math.max(-vMax,Math.min(vMax,d.v_cms))/vMax)*(gH/2);
      ctx2.beginPath();ctx2.arc(x,y,3,0,Math.PI*2);
      ctx2.fillStyle='#0284C7';ctx2.fill();
    });
  }

  // ── Data recording ─────────────────────────────────────────
  function recordPoint() {
    if (!measuring) return;
    const t=parseFloat(simTime.toFixed(1));
    data.push({ t, s_cm:parseFloat((s_m(simTime)*100).toFixed(1)),
      v_cms:parseFloat((v_ms(simTime)*100).toFixed(1)),
      F_N:parseFloat(F_N(simTime).toFixed(2)) });
    updateFpTable();
  }

  function updateFpTable() {
    const tb=document.getElementById('fpTbody'), tw=document.getElementById('fpTable');
    if(!tb||!tw) return;
    if(data.length>0) tw.style.display='table';
    tb.innerHTML=data.map(d=>
      `<tr><td>${fmt(d.t,1)}</td><td>${fmt(d.s_cm,1)}</td><td>${fmt(d.v_cms,1)}</td><td>${fmt(d.F_N,2)}</td></tr>`
    ).join('');
    // scroll table to bottom
    tw.scrollTop=tw.scrollHeight;
  }

  // ── Animation loop ──────────────────────────────────────────
  function loop(ts) {
    if(!lastTs) lastTs=ts;
    simTime += (ts-lastTs)/1000;
    lastTs=ts;
    drawAnim(simTime);
    drawSTChart();
    drawVTChart();
    animId=requestAnimationFrame(loop);
  }

  // ── Controls ────────────────────────────────────────────────
  function startMeas() {
    measuring=true; data=[]; simTime=0; lastTs=null;
    updateFpTable();
    const btn=document.getElementById('fpToggleBtn');
    if(btn){btn.textContent='⏹ Messung stoppen';btn.classList.remove('primary');}
    measTimer=setInterval(recordPoint,200);
  }
  function stopMeas() {
    measuring=false;
    if(measTimer){clearInterval(measTimer);measTimer=null;}
    const btn=document.getElementById('fpToggleBtn');
    if(btn){btn.textContent='▶ Messung starten';btn.classList.add('primary');}
  }

  function toggle(){ measuring?stopMeas():startMeas(); }

  function reset() {
    stopMeas(); data=[]; simTime=0; lastTs=null;
    const tw=document.getElementById('fpTable');
    if(tw) tw.style.display='none';
    const tb=document.getElementById('fpTbody'); if(tb) tb.innerHTML='';
    const res=document.getElementById('fpResult'); if(res) res.innerHTML='';
  }

  function stop() {
    if(animId) cancelAnimationFrame(animId);
    if(measTimer) clearInterval(measTimer);
  }

  function setM(val) {
    m=val;
    const lbl=document.getElementById('fpMLabel'); if(lbl) lbl.textContent=val.toFixed(2).replace('.',',');
    const el=document.getElementById('fpMVal'); if(el) el.textContent=val.toFixed(2).replace('.',',');
    reset();
  }

  function setD(val) {
    D=val;
    const lbl=document.getElementById('fpDLabel'); if(lbl) lbl.textContent=val.toFixed(0);
    const el=document.getElementById('fpDVal'); if(el) el.textContent=val.toFixed(0);
    reset();
  }

  // Start
  animId=requestAnimationFrame(loop);
  return { stop, toggle, reset, setM, setD };
}

// ============================================================
// SIM 11: HARMONISCHE WELLEN
// ============================================================
function _simWellen() {
  const canvas = document.getElementById('welCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let f = 2, A = 30;
  const v_wave = 230; // px per second (wave speed)
  let animId = null, startTime = null;

  function fmt(n, d=1) { return n.toFixed(d).replace('.', ','); }

  function draw(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000;

    const lambda = v_wave / f; // in px
    const T = 1 / f;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#eff6ff'; ctx.fillRect(0, 0, W, H);

    const midY = H / 2;

    // grid lines
    ctx.strokeStyle = '#DBEAFE'; ctx.lineWidth = 1;
    for (let gy = midY - 60; gy <= midY + 60; gy += 20) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
    // zero line
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY);
    ctx.strokeStyle = '#93C5FD'; ctx.lineWidth = 1.5; ctx.stroke();

    // wave
    ctx.beginPath();
    for (let x = 0; x <= W; x++) {
      const y = midY - A * Math.sin(2 * Math.PI * (x / lambda - f * t));
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#2563EB'; ctx.lineWidth = 2.5; ctx.stroke();

    // amplitude arrow
    const ax = 30;
    ctx.beginPath();
    ctx.moveTo(ax, midY);
    ctx.lineTo(ax, midY - A);
    ctx.strokeStyle = '#DC2626'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#DC2626'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('A', ax, midY - A - 5);

    // wavelength arrow
    const wlStartX = 60;
    const wlEndX = wlStartX + lambda;
    if (wlEndX < W - 20) {
      ctx.beginPath();
      ctx.moveTo(wlStartX, midY + A + 20);
      ctx.lineTo(wlEndX, midY + A + 20);
      ctx.strokeStyle = '#059669'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#059669'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('λ = ' + fmt(lambda, 0) + ' px', wlStartX + lambda / 2, midY + A + 34);
    }

    // update HTML
    const fEl = document.getElementById('welFVal');
    const tEl = document.getElementById('welTVal');
    const lEl = document.getElementById('welLamVal');
    const flEl = document.getElementById('welFLabel');
    const alEl = document.getElementById('welALabel');
    if (fEl) fEl.textContent = fmt(f);
    if (tEl) tEl.textContent = fmt(T, 2);
    if (lEl) lEl.textContent = fmt(lambda, 0);
    if (flEl) flEl.textContent = fmt(f);
    if (alEl) alEl.textContent = fmt(A, 0);

    drawWelChart(f, T, lambda, A);
    if(welMeas.length>0) drawWelChart2();
    animId = requestAnimationFrame(draw);
  }

  function drawWelChart(f_cur, T_cur, lambda_cur, A_cur) {
    const c = document.getElementById('welChart'); if (!c) return;
    const ctx2 = c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:55,r:20,t:22,b:35};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#eff6ff'; ctx2.fillRect(0,0,cW,cH);
    // Show spectrum bars: for f=0.5 to 5 step 0.5, bar height = A if f matches, else 0
    const fMax=5.5, steps=[0.5,1,1.5,2,2.5,3,3.5,4,4.5,5];
    const Amax=65;
    ctx2.strokeStyle='#e0e7ef'; ctx2.lineWidth=1;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.font='bold 12px Nunito,sans-serif'; ctx2.fillStyle='#333'; ctx2.textAlign='center';
    ctx2.fillText('Frequenz f (Hz)', P.l+gW/2, cH-4);
    ctx2.save(); ctx2.translate(14,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('Amplitude A (px)',0,0); ctx2.restore();
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='right';
    for(let i=0;i<=4;i++) ctx2.fillText((Amax*i/4).toFixed(0), P.l-4, P.t+gH-(i/4)*gH+4);
    const bW=Math.floor(gW/(steps.length+1))-4;
    ctx2.textAlign='center';
    steps.forEach((fi,idx)=>{
      const x=P.l+((fi/fMax)*gW)-bW/2;
      const isActive=Math.abs(fi-f_cur)<0.26;
      const bH=isActive?(A_cur/Amax)*gH:2;
      ctx2.fillStyle=isActive?'#2563EB':'#93c5fd';
      ctx2.fillRect(x, P.t+gH-bH, bW, bH);
      ctx2.font='9px sans-serif'; ctx2.fillStyle='#374151';
      ctx2.fillText(fi.toFixed(1), x+bW/2, P.t+gH+14);
    });
    ctx2.font='11px sans-serif'; ctx2.fillStyle='#2563EB'; ctx2.textAlign='left';
    ctx2.fillText(`f=${fmt(f_cur)} Hz  A=${A_cur.toFixed(0)}px  T=${fmt(T_cur,2)}s  λ=${lambda_cur.toFixed(0)}px`, P.l+4, P.t+12);
    // update table
    updateWelTable(f_cur, T_cur, lambda_cur, A_cur);
  }

  const welTableData = {};
  function updateWelTable(f_cur, T_cur, lambda_cur, A_cur){
    welTableData[f_cur.toFixed(1)]={f:f_cur,T:T_cur,lambda:lambda_cur,A:A_cur};
    const tb=document.getElementById('welTbody'), tw=document.getElementById('welTable');
    if(!tb||!tw) return;
    const rows=Object.values(welTableData);
    if(rows.length>0) tw.style.display='table';
    tb.innerHTML=rows.map(r=>`<tr><td>${r.f.toFixed(1).replace('.',',')}</td><td>${r.T.toFixed(2).replace('.',',')}</td><td>${r.lambda.toFixed(0)}</td><td>${r.A.toFixed(0)}</td></tr>`).join('');
  }

  const welMeas = [];
  let welSel = [];

  function welMeasure() {
    const T=1/f, lambda=v_wave/f;
    const c=document.getElementById('welChart2'); if(!c) return;
    const P={l:55,r:16,t:20,b:36};
    const gW=c.width-P.l-P.r, gH=c.height-P.t-P.b;
    const tMax=2.1, lamMax=500;
    const px=P.l+(T/tMax)*gW;
    const py=P.t+gH-(lambda/lamMax)*gH;
    welMeas.push({x:T,y:lambda,f,px,py});
    drawWelChart2();
  }

  function drawWelChart2() {
    const c=document.getElementById('welChart2'); if(!c) return;
    const ctx2=c.getContext('2d'), cW=c.width, cH=c.height;
    const P={l:55,r:16,t:20,b:36};
    const gW=cW-P.l-P.r, gH=cH-P.t-P.b;
    const tMax=2.1, lamMax=500;
    ctx2.clearRect(0,0,cW,cH);
    ctx2.fillStyle='#f0f9ff'; ctx2.fillRect(0,0,cW,cH);
    // grid
    ctx2.strokeStyle='#e5e7eb'; ctx2.lineWidth=1;
    for(let i=1;i<=4;i++){
      const y=P.t+(i/4)*gH; ctx2.beginPath(); ctx2.moveTo(P.l,y); ctx2.lineTo(P.l+gW,y); ctx2.stroke();
    }
    for(let i=1;i<=4;i++){
      const x=P.l+(i/4)*gW; ctx2.beginPath(); ctx2.moveTo(x,P.t); ctx2.lineTo(x,P.t+gH); ctx2.stroke();
    }
    // axes
    ctx2.strokeStyle='#333'; ctx2.lineWidth=2;
    ctx2.beginPath(); ctx2.moveTo(P.l,P.t); ctx2.lineTo(P.l,P.t+gH); ctx2.lineTo(P.l+gW,P.t+gH); ctx2.stroke();
    ctx2.font='10px sans-serif'; ctx2.fillStyle='#666'; ctx2.textAlign='center';
    ctx2.fillText('T (s)', P.l+gW/2, cH-2);
    ctx2.save(); ctx2.translate(14,P.t+gH/2); ctx2.rotate(-Math.PI/2); ctx2.fillText('λ (px)',0,0); ctx2.restore();
    ctx2.textAlign='right';
    for(let i=0;i<=4;i++) ctx2.fillText((lamMax*i/4).toFixed(0), P.l-4, P.t+gH-(i/4)*gH+4);
    ctx2.textAlign='center';
    for(let i=0;i<=4;i++) ctx2.fillText((tMax*i/4).toFixed(2), P.l+(i/4)*gW, P.t+gH+14);
    // theory line (dashed): λ = v_wave * T
    ctx2.strokeStyle='#2563eb'; ctx2.lineWidth=1.5; ctx2.setLineDash([5,4]);
    ctx2.beginPath();
    ctx2.moveTo(P.l, P.t+gH); // T=0, λ=0
    // end at T=tMax or at λ=lamMax, whichever comes first
    const tEnd=Math.min(tMax, lamMax/v_wave);
    const lamEnd=v_wave*tEnd;
    ctx2.lineTo(P.l+(tEnd/tMax)*gW, P.t+gH-(lamEnd/lamMax)*gH);
    ctx2.stroke(); ctx2.setLineDash([]);
    ctx2.font='9px sans-serif'; ctx2.fillStyle='#2563eb'; ctx2.textAlign='left';
    ctx2.fillText(`v=${v_wave}px/s`, P.l+4, P.t+12);
    // recalculate px/py
    welMeas.forEach(m=>{
      m.px=P.l+(m.x/tMax)*gW;
      m.py=P.t+gH-(m.y/lamMax)*gH;
    });
    // measured points
    welMeas.forEach((m,i)=>{
      const sel=welSel.includes(i);
      ctx2.fillStyle=sel?'#f97316':'#dc2626';
      ctx2.beginPath(); ctx2.arc(m.px,m.py,7,0,Math.PI*2); ctx2.fill();
      if(sel){ ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2; ctx2.beginPath(); ctx2.arc(m.px,m.py,10,0,Math.PI*2); ctx2.stroke(); }
    });
    if(welSel.length===2){
      const a=welMeas[welSel[0]], b=welMeas[welSel[1]];
      if(Math.abs(b.x-a.x)>0.001){
        const slope=(b.y-a.y)/(b.x-a.x);
        ctx2.strokeStyle='#f97316'; ctx2.lineWidth=2;
        ctx2.beginPath(); ctx2.moveTo(a.px,a.py); ctx2.lineTo(b.px,b.py); ctx2.stroke();
        const res=document.getElementById('welResult');
        if(res) res.innerHTML=`<b>Δλ/ΔT = ${slope.toFixed(0)} px/s = v_Welle</b>`;
      }
    } else {
      const res=document.getElementById('welResult');
      if(res&&welSel.length===0) res.innerHTML='';
    }
  }

  function welHandleClick(mx,my) {
    if(welMeas.length===0) return;
    let best=-1, bestD=22;
    welMeas.forEach((m,i)=>{
      const d=Math.hypot(m.px-mx,m.py-my);
      if(d<bestD){ bestD=d; best=i; }
    });
    if(best===-1) return;
    const idx=welSel.indexOf(best);
    if(idx>=0) welSel.splice(idx,1);
    else{ if(welSel.length>=2) welSel=[welSel[1]]; welSel.push(best); }
    drawWelChart2();
  }

  function stop() { if (animId) cancelAnimationFrame(animId); }
  function set(key, val) {
    if (key === 'f') f = val;
    if (key === 'a') A = val;
  }

  animId = requestAnimationFrame(draw);
  return { stop, set, measure: welMeasure, handleClick: welHandleClick };
}

// ============================================================
// SIM 12: KONDENSATOR LADEN / ENTLADEN
// ============================================================
function _simKondensator() {
  const canvas = document.getElementById('kondCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let C = 500e-6, R = 500, mode = 'laden';
  const U0 = 12;
  let t = 0, running = false, last = null, animId = null;
  const chartData = [];

  function fmt(n, d=2) { return n.toFixed(d).replace('.', ','); }

  function draw(ts) {
    if (running) {
      if (last !== null) {
        const dt = Math.min((ts - last) / 1000, 0.05);
        t += dt;
        const tau = R * C;
        const Uc = mode === 'laden'
          ? U0 * (1 - Math.exp(-t / tau))
          : U0 * Math.exp(-t / tau);
        chartData.push({ t, Uc });
      }
      last = ts;
    }

    const tau = R * C;
    const Uc_now = mode === 'laden'
      ? U0 * (1 - Math.exp(-t / tau))
      : U0 * Math.exp(-t / tau);
    const pct = mode === 'laden' ? (Uc_now / U0) * 100 : (Uc_now / U0) * 100;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

    // chart
    const chartX = 50, chartY = 15, chartW = W - 80, chartH = H - 50;
    ctx.fillStyle = '#fff'; ctx.fillRect(chartX, chartY, chartW, chartH);
    ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 1; ctx.strokeRect(chartX, chartY, chartW, chartH);

    // grid
    ctx.strokeStyle = '#F1F5F9'; ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const gx = chartX + (i / 5) * chartW;
      ctx.beginPath(); ctx.moveTo(gx, chartY); ctx.lineTo(gx, chartY + chartH); ctx.stroke();
    }
    for (let i = 1; i <= 3; i++) {
      const gy = chartY + chartH - (i / 4) * chartH;
      ctx.beginPath(); ctx.moveTo(chartX, gy); ctx.lineTo(chartX + chartW, gy); ctx.stroke();
      ctx.fillStyle = '#94A3B8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(fmt(U0 * i / 4, 0) + 'V', chartX - 4, gy + 4);
    }

    // axis labels
    ctx.fillStyle = '#64748B'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    const maxT_show = 5 * tau;
    for (let i = 1; i <= 5; i++) {
      const gx = chartX + (i / 5) * chartW;
      ctx.fillText(fmt(maxT_show * i / 5, 2) + 's', gx, chartY + chartH + 14);
    }
    ctx.fillText('Zeit t', chartX + chartW / 2, chartY + chartH + 26);
    ctx.save(); ctx.translate(chartX - 32, chartY + chartH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('U_C (V)', 0, 0); ctx.restore();

    // theoretical curve (full)
    ctx.beginPath();
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const tx = (i / steps) * maxT_show;
      const uy = mode === 'laden'
        ? U0 * (1 - Math.exp(-tx / tau))
        : U0 * Math.exp(-tx / tau);
      const px = chartX + (tx / maxT_show) * chartW;
      const py = chartY + chartH - (uy / U0) * chartH;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#CBD5E1'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);

    // actual data
    if (chartData.length > 1) {
      ctx.beginPath();
      let started = false;
      for (const p of chartData) {
        if (p.t > maxT_show * 1.1) continue;
        const px = chartX + (p.t / maxT_show) * chartW;
        const py = chartY + chartH - (p.Uc / U0) * chartH;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = mode === 'laden' ? '#2563EB' : '#DC2626';
      ctx.lineWidth = 2.5; ctx.stroke();
    }

    // tau marker
    const tauX = chartX + (tau / maxT_show) * chartW;
    if (tauX < chartX + chartW) {
      ctx.beginPath(); ctx.moveTo(tauX, chartY); ctx.lineTo(tauX, chartY + chartH);
      ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#F59E0B'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('τ', tauX, chartY - 3);
    }

    // current dot
    if (t <= maxT_show * 1.1) {
      const dotX = chartX + (t / maxT_show) * chartW;
      const dotY = chartY + chartH - (Uc_now / U0) * chartH;
      ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = mode === 'laden' ? '#2563EB' : '#DC2626'; ctx.fill();
    }

    // update HTML
    const tauEl = document.getElementById('kondTauVal');
    const uEl = document.getElementById('kondUVal');
    const pEl = document.getElementById('kondPctVal');
    if (tauEl) tauEl.textContent = (tau * 1000 < 1000) ? fmt(tau * 1000, 0) + ' ms' : fmt(tau, 2) + ' s';
    if (uEl) uEl.textContent = fmt(Uc_now, 2);
    if (pEl) pEl.textContent = fmt(pct, 0);

    animId = requestAnimationFrame(draw);
  }

  function stop() { if (animId) cancelAnimationFrame(animId); running = false; last = null; }
  function set(key, val) {
    if (key === 'c') { C = val * 1e-6; const l = document.getElementById('kondCLabel'); if (l) l.textContent = val; }
    if (key === 'r') { R = val; const l = document.getElementById('kondRLabel'); if (l) l.textContent = val; }
    reset();
  }
  function setMode(m) {
    mode = m; reset();
    const lBtn = document.getElementById('kondLadenBtn');
    const eBtn = document.getElementById('kondEntladenBtn');
    if (lBtn && eBtn) {
      lBtn.className = m === 'laden' ? 'sim-btn primary' : 'sim-btn';
      eBtn.className = m === 'entladen' ? 'sim-btn primary' : 'sim-btn';
    }
  }
  function reset() {
    t = 0; chartData.length = 0; running = true; last = null;
  }

  running = true;
  animId = requestAnimationFrame(draw);
  return { stop, set, setMode, reset };
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

// Custom overrides (leave empty — auto-generator handles all topics)
const EV_SCENES = {};

/* ─── Auto-scene generator: academic split-layout style ─────────
   Reads explanation + short[] from CONTENT and builds 5 scenes.
   ─────────────────────────────────────────────────────────────── */
function _evFindTopic(name) {
  for (const gk of Object.keys(CONTENT)) {
    for (const sub of (CONTENT[gk].subjects || [])) {
      const t = (sub.topics || []).find(t => t.name === name);
      if (t) return t;
    }
  }
  return null;
}

function _evAutoScenes(topicName) {
  const t = _evFindTopic(topicName);
  if (!t || !t.explanation) return null;

  const s0  = t.short?.[0] || '';
  const s1  = t.short?.[1] || '';
  const vis = TOPIC_VISUALS[topicName] || '';

  // Split explanation into two halves by sentence
  const sents = (t.explanation || '').split(/(?<=[.!?])\s+/).filter(Boolean);
  const h  = Math.ceil(sents.length / 2);
  const e1 = sents.slice(0, h).join(' ');
  const e2 = sents.slice(h).join(' ');

  const lightStage = (stage, bg) => {
    stage.style.background   = bg || '#F7F9F5';
    stage.style.alignItems   = 'flex-start';
    stage.style.justifyContent = 'flex-start';
    stage.style.textAlign    = 'left';
  };
  const visPnl = `<div class="evs-vis-pnl">${vis || '📐'}</div>`;

  return [
    // Scene 1 — Hook
    { dur: 2800, bg: '#F7F9F5', speech: topicName + '. Jetzt erklärt.',
      build(stage) {
        lightStage(stage);
        stage.innerHTML = `<div class="evs-hook">
          <div class="evs-hook-vis">${vis}</div>
          <div class="evs-hook-title">${topicName}</div>
          <div class="evs-hook-sub">Schritt für Schritt erklärt ✏️</div>
        </div>`;
      }
    },
    // Scene 2 — Schlüsselpunkt 1
    { dur: 6500, bg: '#F7F9F5', speech: s0,
      build(stage) {
        lightStage(stage);
        stage.innerHTML = `<div class="evs-split">
          <div class="evs-split-left">
            <div class="evs-kp-label">Was du wissen musst:</div>
            <div class="evs-step evs-step-on">
              <div class="evs-step-n">1</div>
              <div class="evs-step-t">${s0}</div>
            </div>
          </div>
          <div class="evs-split-right">${visPnl}</div>
        </div>`;
      }
    },
    // Scene 3 — Schlüsselpunkt 2
    { dur: 6500, bg: '#F7F9F5', speech: s1,
      build(stage) {
        lightStage(stage);
        stage.innerHTML = `<div class="evs-split">
          <div class="evs-split-left">
            <div class="evs-step evs-step-done">
              <div class="evs-step-n">✓</div>
              <div class="evs-step-t">${s0}</div>
            </div>
            <div class="evs-step evs-step-on" style="animation-delay:.35s">
              <div class="evs-step-n">2</div>
              <div class="evs-step-t">${s1}</div>
            </div>
          </div>
          <div class="evs-split-right">${visPnl}</div>
        </div>`;
      }
    },
    // Scene 4 — Erklärung
    { dur: 9500, bg: '#F7F9F5', speech: e1 + (e2 ? ' ' + e2 : ''),
      build(stage) {
        lightStage(stage);
        stage.innerHTML = `<div class="evs-explain">
          <div class="evs-explain-lbl">💡 Hintergrundwissen</div>
          <div class="evs-explain-txt" style="animation:evFadeUp .5s .1s both">${e1}</div>
          ${e2 ? `<div class="evs-explain-txt evs-explain-txt2" style="animation:evFadeUp .5s 2.2s both">${e2}</div>` : ''}
        </div>`;
      }
    },
    // Scene 5 — Merksatz
    { dur: 5500, bg: '#EEF5E8', speech: 'Merksatz: ' + s0 + ' ' + s1,
      build(stage) {
        lightStage(stage, '#EEF5E8');
        stage.innerHTML = `<div class="evs-merksatz-box">
          <div class="evs-merksatz-hd">📌 Merksatz – ${topicName}</div>
          <div class="evs-mk-item" style="animation:evFadeUp .4s .15s both">
            <div class="evs-mk-dot">1</div>
            <span>${s0}</span>
          </div>
          <div class="evs-mk-item" style="animation:evFadeUp .4s .55s both">
            <div class="evs-mk-dot">2</div>
            <span>${s1}</span>
          </div>
        </div>`;
      }
    },
  ];
}

// ─── (legacy scenes removed) ────────────────────────────────────
if (false) { const _EV_LEGACY = { 'Einführung in Brüche': [
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
  ] }; } // end legacy

let _evTopicName='',_evSceneIdx=0,_evPaused=false,_evTimer=null,_evSceneStart=0,_evSceneElapsed=0;

/* ─── Sanfte TTS: ResponsiveVoice → Web Speech Fallback ─────────
   ResponsiveVoice liefert eine warme, natürliche deutsche Stimme
   direkt im Browser — kein API-Key, kein Download, kein Warten.
   ─────────────────────────────────────────────────────────────── */
let _evCurAudio = null;

async function _evSpeak(text) {
  if (!text) return;
  _evSpeakStop();

  // ElevenLabs — Thomas (sanfte deutsche Männerstimme, Erzählung)
  if (ELEVEN_KEY) {
    try {
      const url = await _elevenFetch(text);
      const audio = new Audio(url);
      _evCurAudio = audio;
      audio.onended = audio.onerror = () => { _evCurAudio = null; };
      audio.play().catch(() => {});
      return;
    } catch(e) {
      console.warn('[EV] ElevenLabs nicht verfügbar, Fallback:', e);
    }
  }

  // Fallback: bester verfügbarer Browser-Voice
  if (!window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();
  if (!voices.length) {
    await new Promise(r => {
      const h = () => { synth.removeEventListener('voiceschanged', h); r(); };
      synth.addEventListener('voiceschanged', h);
      setTimeout(r, 900);
    });
    voices = synth.getVoices();
  }
  const de = voices.filter(v => v.lang === 'de-DE' || v.lang.startsWith('de'));
  const voice =
    de.find(v => /natural/i.test(v.name))
    || de.find(v => /neural/i.test(v.name))
    || de.find(v => /online/i.test(v.name))
    || de.find(v => /microsoft/i.test(v.name))
    || de[0] || null;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'de-DE'; u.volume = 1.0;
  if (voice) u.voice = voice;
  u.rate = /natural|neural|online/i.test(voice?.name || '') ? 0.88 : 0.80;
  u.pitch = 1.0;
  synth.speak(u);
}

function _evSpeakStop() {
  if (_evCurAudio) { _evCurAudio.pause(); _evCurAudio = null; }
  window.speechSynthesis?.cancel();
}

function _evPrefetch() {}

function openErklaerVideo(topicName){
  if(!EV_SCENES[topicName])EV_SCENES[topicName]=_evAutoScenes(topicName);
  const scenes=EV_SCENES[topicName];
  if(!scenes)return;
  _evTopicName=topicName;_evSceneIdx=0;_evPaused=false;_evSceneElapsed=0;
  const overlay=document.getElementById('erklaerVideoOverlay');
  if(overlay)overlay.classList.remove('hidden');
  _evBuildDots(scenes.length);_evPlayScene(0);
}
function closeErklaerVideo(){
  const overlay=document.getElementById('erklaerVideoOverlay');
  if(overlay)overlay.classList.add('hidden');
  clearTimeout(_evTimer);_evTimer=null;
  _evSpeakStop();
}
function _evBgClick(e){if(e.target===document.getElementById('erklaerVideoOverlay'))closeErklaerVideo();}
function _evBuildDots(count){const c=document.getElementById('evSceneDots');if(!c)return;c.innerHTML='';for(let i=0;i<count;i++){const d=document.createElement('div');d.className='ev-dot'+(i===0?' active':'');c.appendChild(d);}}
function _evPlayScene(idx){
  const scenes=EV_SCENES[_evTopicName];
  if(!scenes||idx>=scenes.length){closeErklaerVideo();return;}
  _evSceneIdx=idx;_evSceneElapsed=0;clearTimeout(_evTimer);
  document.querySelectorAll('.ev-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
  const scene=scenes[idx];
  const stage=document.getElementById('evStage');
  if(!stage)return;
  stage.style.background=scene.bg||'transparent';
  stage.innerHTML='';
  scene.build(stage);
  // Sprachausgabe — beste verfügbare Stimme
  // Sprachausgabe (HF Neural TTS → Web Speech Fallback)
  if (scene.speech) _evSpeak(scene.speech);
  // Nächste Szene vorausladen
  const nextSpeech = scenes[idx+1]?.speech;
  if (nextSpeech) _evPrefetch(nextSpeech);
  const btn=document.getElementById('evPlayPauseBtn');
  if(btn)btn.textContent='⏸';
  _evPaused=false;_evSceneStart=Date.now();
  _evTickProgress(idx,scene.dur);
  _evTimer=setTimeout(()=>_evPlayScene(idx+1),scene.dur);
}
function _evTickProgress(sceneIdx,dur){const fill=document.getElementById('evProgressFill');const scenes=EV_SCENES[_evTopicName];if(!fill||!scenes)return;const totalDur=scenes.reduce((s,sc)=>s+sc.dur,0);const pastDur=scenes.slice(0,sceneIdx).reduce((s,sc)=>s+sc.dur,0);function tick(){if(_evSceneIdx!==sceneIdx||_evPaused)return;const elapsed=Date.now()-_evSceneStart+_evSceneElapsed;const totalDone=pastDur+Math.min(elapsed,dur);fill.style.width=(totalDone/totalDur*100)+'%';if(elapsed<dur)requestAnimationFrame(tick);}requestAnimationFrame(tick);}
function _evTogglePause(){const btn=document.getElementById('evPlayPauseBtn');const scenes=EV_SCENES[_evTopicName];const scene=scenes?.[_evSceneIdx];if(!scene)return;if(_evPaused){_evPaused=false;if(btn)btn.textContent='⏸';const remaining=scene.dur-_evSceneElapsed;_evSceneStart=Date.now();_evTickProgress(_evSceneIdx,scene.dur);_evTimer=setTimeout(()=>_evPlayScene(_evSceneIdx+1),remaining);}else{_evPaused=true;if(btn)btn.textContent='▶';_evSceneElapsed+=Date.now()-_evSceneStart;clearTimeout(_evTimer);}}
function _evSkipScene(){clearTimeout(_evTimer);_evPlayScene(_evSceneIdx+1);}






