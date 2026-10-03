
// ════════════════════════════════════════════════════════════════════════
// MATHE 5 FOERDER – mz3 „Wo bleibt die Null?“  (Kennung m5-null, Praefix _m5c)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL1_PROFIL.md, Abschnitt m5-null.
//
// WAS MAN SIEHT (Leinwand 420 x 250, von oben nach unten):
//   - das Zahlwort gross. Nach der Wahl zerfaellt es in seine zwei Teile
//     („dreitausend“ · „fünfzig“), jeder Teil leuchtet auf, und seine
//     Ziffernkarte fliegt in ihre Spalte (Teil 1 blau, Teil 2 gruen - Wortteil
//     und Karte tragen dieselbe Farbe, das ist die Verbindung Wort <-> Karte).
//   - die Stellenwerttafel HT | ZT | T | H | Z | E (Kuerzel in der Kopfzeile,
//     dicker Strich zwischen T und H = Tausendergrenze). Leere Spalten INNERHALB
//     der Zahl bleiben leer und sind hellgrau gestrichelt umrandet; die Spalten
//     links der ersten Karte gehoeren nicht zur Zahl und sind nur blass getoent.
//   - die Zeile „Mit Ziffern“ unter der Tafel, Spalte fuer Spalte unter ihrer
//     Spalte, und darunter der Kasten „Zahl“ mit der geschriebenen Zahl
//     („3 050“, nach der Gegenprobe orange „35“).
//
// KNOEPFE (woertlich):
//   Reihe 1 (Sprungmarken = Tabellenzeilen im Heft):
//     „dreitausendfünfzig“ · „zweitausendsieben“ · „vierzigtausendzwanzig“ ·
//     „sechshunderttausendacht“                  (Wahlgruppe _m5cWahl('…'))
//   Reihe 2: „mit Ziffern schreiben“ (_m5cSchreiben) · „ohne leere Stellen
//     schreiben“ (_m5cOhne, Gegenprobe) · „neu“ (_m5cNeu)
//   „mit Ziffern schreiben“: Spalte fuer Spalte von links ab der ersten
//   belegten (1,0 s); eine belegte Spalte gibt ihre Ziffer (sie faellt aus der
//   Karte in die Zeile), eine leere eine 0, die orange aufleuchtet. Danach
//   steht die Zahl im Kasten.
//   „ohne leere Stellen schreiben“: Nur die Karten-Ziffern ruecken in der
//   Zeile nach rechts zusammen (die 0 verblassen, 0,8 s), gestrichelte Linien
//   zeigen, wohin jede Ziffer gewandert ist; die Tafel bleibt, wie sie ist.
//   „neu“: wie beim Oeffnen - dreitausendfünfzig wird neu gelegt.
//
// STATUSZEILEN (woertlich):
//   _m5c-wort     „Zahlwort: dreitausendfünfzig“
//   _m5c-tafel    „In der Tafel: 3 T, 5 Z“ (waechst mit jeder gelandeten Karte;
//                 vor der ersten „In der Tafel: …“)
//   _m5c-leer     „Leere Stellen: H und E“ (sobald beide Karten liegen, vorher
//                 „Leere Stellen: …“)
//   _m5c-ziffern  „Zahl mit Ziffern: …“ bis zum Schreiben, dann „Zahl mit
//                 Ziffern: 3 050“; nach der Gegenprobe „Ohne leere Stellen: 35 –
//                 so liest man das: fünfunddreißig“
//   Tausendertrenner ist das geschuetzte Leerzeichen U+00A0.
//
//   ABWEICHUNG vom Bauplan (Gegenpruefung 03.10.2026): Der Bauplan nennt
//   „Leer: H und E“ und „Mit Ziffern: 3 050“. simcheck/simfakten.js nimmt nur
//   Textfelder mit MEHR als 18 Zeichen in den Faktendump auf: „Leer: H und E“
//   hat 13, „Leer: T, H und E“ 16, „Mit Ziffern: 3 050“ genau 18. Vier der
//   acht Werte, die lehrer.tabelle_erwartet verlangt, fehlten damit im Dump
//   (gegen MATHE_PROFIL § 10.12) – derselbe Grund wie bei m5-grosse-zahlen.
//   „Leere Stellen:“ traegt zugleich das Wort der Heftspalte („Welche Stellen
//   sind leer?“), „Zahl mit Ziffern:“ das Wort des Kastens „Zahl“ im Bild.
//
// WERTE (Profil mz3, alle nachgerechnet mit simcheck/werte.js):
//   dreitausendfünfzig      3 T, 5 Z   · Leer: H und E          · 3 050   · ohne: 35, fünfunddreißig
//   zweitausendsieben       2 T, 7 E   · Leer: H und Z          · 2 007   · ohne: 27, siebenundzwanzig
//   vierzigtausendzwanzig   4 ZT, 2 Z  · Leer: T, H und E       · 40 020  · ohne: 42, zweiundvierzig
//   sechshunderttausendacht 6 HT, 8 E  · Leer: ZT, T, H und Z   · 600 008 · ohne: 68, achtundsechzig
//
// START: dreitausendfünfzig wird beim Oeffnen gelegt (die Karten fliegen),
//   noch nicht mit Ziffern geschrieben.
//
// AHA (_bioFx, ruhig, OHNE Textstreifen): bei der Gegenprobe faerbt sich das
//   Zahlwort oben orange um und heisst jetzt „fünfunddreißig“; je ein
//   Lichtring (_bioFxWelle) zeigt auf jede leere Spalte der Tafel - genau dort
//   fehlt jetzt etwas.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm, Merksatzwoerter mz3):
//   „Null“ (als Wort - die Ziffer 0 steht natuerlich da) und „Wert“, auch nicht
//   als Wortteil (deshalb auch keine Beschriftung „Stellenwerttafel“). Kein
//   „falsch“, keine Punkte, keine Zeit, keine Namen. Deterministisch, ohne Zufall.
// ════════════════════════════════════════════════════════════════════════
let _m5c = null;
// Spalten: 0 HT · 1 ZT · 2 T · 3 H · 4 Z · 5 E.
// teile: [Wortteil, Spalte, Ziffer]; ohne: so spricht man die zusammengerueckten Karten.
const _m5cWORTE = {
  dreitausendfuenfzig:     { wort: 'dreitausendfünfzig',
                             teile: [['dreitausend', 2, 3], ['fünfzig', 4, 5]], ohne: 'fünfunddreißig' },
  zweitausendsieben:       { wort: 'zweitausendsieben',
                             teile: [['zweitausend', 2, 2], ['sieben', 5, 7]], ohne: 'siebenundzwanzig' },
  vierzigtausendzwanzig:   { wort: 'vierzigtausendzwanzig',
                             teile: [['vierzigtausend', 1, 4], ['zwanzig', 4, 2]], ohne: 'zweiundvierzig' },
  sechshunderttausendacht: { wort: 'sechshunderttausendacht',
                             teile: [['sechshunderttausend', 0, 6], ['acht', 5, 8]], ohne: 'achtundsechzig' }
};
const _m5cREIHE = ['dreitausendfuenfzig', 'zweitausendsieben', 'vierzigtausendzwanzig', 'sechshunderttausendacht'];
const _m5cSPALTEN = ['HT', 'ZT', 'T', 'H', 'Z', 'E'];
const _m5cK = {
  W: 420, H: 250,
  X0: 98, CW: 52,               // Tafel: linker Rand, Spaltenbreite (6 Spalten bis 410)
  WY: 27, WH: 34,               // Zahlwortzeile: Mitte, Hoehe der Wortteile
  KY0: 58, KY1: 80,             // Kopfzeile der Tafel
  ZY0: 80, ZY1: 128,            // Kartenzeile
  RY0: 140, RY1: 182,           // Zeile „Mit Ziffern“
  BY0: 194, BY1: 242,           // Kasten mit der geschriebenen Zahl
  FLUG: 0.5,                    // s je Kartenflug
  START: [0.25, 0.6],           // s: Abflug der Karte 1 und 2
  SCHREIBEN: 1.0,               // s fuer alle Spalten zusammen
  FALL: 0.2,                    // s, bis eine Ziffer in der Zeile steht
  RUECKEN: 0.8,                 // s: Ende des Zusammenrueckens (Gegenprobe)
  OHNE: 1.4                     // s: Ende der Gegenprobe (Wort ist umgefaerbt)
};
// Farben je Wortteil: [Grund, Rand, Schrift]
const _m5cFARBE = [
  { grund: '#dbeafe', rand: '#2563eb', schrift: '#1e3a8a' },
  { grund: '#dcfce7', rand: '#16a34a', schrift: '#14532d' }
];
const _m5cORANGE = { grund: '#ffedd5', rand: '#ea580c', schrift: '#c2410c' };

// ── Rechnen: alles kommt aus derselben Tabelle wie die Zeichnung ──────────
function _m5cZahl(key) {
  let n = 0;
  for (const t of _m5cWORTE[key].teile) n += t[2] * Math.pow(10, 5 - t[1]);
  return n;
}
function _m5cFormat(n) {
  const s = String(n);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ' ';
    out += s[i];
  }
  return out;
}
function _m5cErste(key) { return Math.min.apply(null, _m5cWORTE[key].teile.map(t => t[1])); }
function _m5cBelegt(key, c) { return _m5cWORTE[key].teile.findIndex(t => t[1] === c); }
function _m5cLeer(key) {
  const out = [];
  for (let c = _m5cErste(key); c <= 5; c++) if (_m5cBelegt(key, c) < 0) out.push(c);
  return out;
}
function _m5cListe(a) {
  if (a.length <= 1) return a.join('');
  return a.slice(0, -1).join(', ') + ' und ' + a[a.length - 1];
}
// Ziffern der Karten ohne leere Stellen hintereinander: 3 und 5 -> 35
function _m5cOhneZahl(key) {
  return _m5cWORTE[key].teile.slice().sort((a, b) => a[1] - b[1]).map(t => t[2]).join('');
}
function _m5cMitte(c) { return _m5cK.X0 + c * _m5cK.CW + _m5cK.CW / 2; }
function _m5cSanft(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

// ── Zustand ───────────────────────────────────────────────────────────────
function _m5cInit() {
  _m5c = { key: 'dreitausendfuenfzig', t: 0, anim: null, at: 0, modus: 'gelegt',
           gelandet: 0, vonGeschrieben: false, ohneFertig: false, seit: 0, tafelSeit: 0,
           fx: { teile: [] } };
  _m5cLegen('dreitausendfuenfzig');
}
function _m5cLegen(key) {
  const z = _m5c;
  z.key = key; z.modus = 'gelegt'; z.anim = 'legen'; z.at = 0; z.gelandet = 0;
  z.ohneFertig = false; z.vonGeschrieben = false; z.fx.teile = [];
}
// Eine laufende Bewegung sofort zu Ende bringen (vor jeder neuen Handlung).
function _m5cAbschliessen() {
  const z = _m5c;
  if (z.anim === 'legen') { z.gelandet = 2; z.modus = 'gelegt'; z.seit = 1; z.tafelSeit = 1; }
  else if (z.anim === 'schreiben') { z.modus = 'geschrieben'; z.seit = 1; }
  else if (z.anim === 'ohne' && !z.ohneFertig) { z.ohneFertig = true; z.modus = 'ohne'; z.seit = 1; _m5cAha(); }
  z.anim = null; z.at = 0;
}

function _m5cHTML() {
  const k = (key) => `<button class="sim-btn${key === 'dreitausendfuenfzig' ? ' primary' : ''}" id="_m5c-b-${key}" onclick="_m5cWahl('${key}')">${_m5cWORTE[key].wort}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie schreibt man dreitausendfünfzig mit Ziffern?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle ein Zahlwort. Jeder Teil des Wortes legt seine Ziffernkarte in die passende Spalte.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5c-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5cREIHE.map(k).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_m5c-schreiben" onclick="_m5cSchreiben()">mit Ziffern schreiben</button>
          <button class="sim-btn" id="_m5c-ohne" onclick="_m5cOhne()">ohne leere Stellen schreiben</button>
          <button class="sim-btn" onclick="_m5cNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5c-wort" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5c-tafel" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5c-leer" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5c-ziffern" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">HT Hunderttausender · ZT Zehntausender · T Tausender · H Hunderter · Z Zehner · E Einer</div>
        <div class="fpm-note" style="margin-top:6px">Gestrichelt: In dieser Spalte liegt keine Karte.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: dreitausendfünfzig, noch nicht mit Ziffern geschrieben</p>
  </div>`;
}

function _m5cZiffernText() {
  const z = _m5c, d = _m5cWORTE[z.key];
  if (z.anim === 'legen' || z.anim === 'schreiben') return 'Zahl mit Ziffern: …';
  if (z.modus === 'geschrieben') return 'Zahl mit Ziffern: ' + _m5cFormat(_m5cZahl(z.key));
  if (z.modus === 'ohne') return 'Ohne leere Stellen: ' + _m5cOhneZahl(z.key) + ' – so liest man das: ' + d.ohne;
  return 'Zahl mit Ziffern: …';
}
function _m5cStatus() {
  if (!_m5c) return;
  const z = _m5c, d = _m5cWORTE[z.key];
  const setze = (id, s) => { const e = document.getElementById(id); if (e) e.textContent = s; };
  setze('_m5c-wort', 'Zahlwort: ' + d.wort);
  const gel = z.anim === 'legen' ? z.gelandet : 2;
  const liegt = d.teile.slice(0, gel).slice().sort((a, b) => a[1] - b[1]);
  setze('_m5c-tafel', 'In der Tafel: ' +
        (liegt.length ? liegt.map(t => t[2] + ' ' + _m5cSPALTEN[t[1]]).join(', ') : '…'));
  setze('_m5c-leer', 'Leere Stellen: ' + (gel < 2 ? '…' : _m5cListe(_m5cLeer(z.key).map(c => _m5cSPALTEN[c]))));
  setze('_m5c-ziffern', _m5cZiffernText());
  for (const key of _m5cREIHE) {
    const b = document.getElementById('_m5c-b-' + key);
    if (b && b.classList) b.classList.toggle('primary', key === z.key);
  }
}

// ── Knoepfe ───────────────────────────────────────────────────────────────
function _m5cWahl(key) {
  if (!_m5c || !_m5cWORTE[key]) return;
  _m5cLegen(key);
  _m5cStatus();
}
function _m5cSchreiben() {
  if (!_m5c) return;
  _m5cAbschliessen();
  const z = _m5c;
  z.fx.teile = [];
  z.modus = 'gelegt';                                 // auch nach der Gegenprobe: neu schreiben
  z.anim = 'schreiben'; z.at = 0; z.seit = 0;
  _m5cStatus();
}
function _m5cOhne() {
  if (!_m5c) return;
  _m5cAbschliessen();
  const z = _m5c;
  if (z.modus === 'ohne') z.modus = 'gelegt';        // noch einmal von vorn zeigen
  z.vonGeschrieben = z.modus === 'geschrieben';
  z.fx.teile = [];
  z.anim = 'ohne'; z.at = 0; z.ohneFertig = false; z.seit = 0;
  _m5cStatus();
}
function _m5cNeu() {
  if (!_m5c) return;
  _m5cLegen('dreitausendfuenfzig');
  _m5cStatus();
}
// Aha: ein ruhiger Lichtring auf jeder leeren Spalte der Tafel - ohne Text.
function _m5cAha() {
  const z = _m5c, K = _m5cK;
  for (const c of _m5cLeer(z.key))
    _bioFxWelle(z.fx.teile, _m5cMitte(c), (K.ZY0 + K.ZY1) / 2, '#f97316', 30);
}

function _m5cUpdate(dt) {
  if (!_m5c) return;
  dt = _bioFxDt(dt);
  const z = _m5c, K = _m5cK;
  z.t += dt;
  z.seit += dt;
  z.tafelSeit += dt;
  if (z.anim) {
    z.at += dt;
    if (z.anim === 'legen') {
      const n = (z.at >= K.START[0] + K.FLUG ? 1 : 0) + (z.at >= K.START[1] + K.FLUG ? 1 : 0);
      if (n !== z.gelandet) {
        z.gelandet = n;
        if (n >= 2) { z.anim = null; z.modus = 'gelegt'; z.seit = 0; z.tafelSeit = 0; }
        _m5cStatus();
      }
    } else if (z.anim === 'schreiben') {
      if (z.at >= K.SCHREIBEN + 0.05) { z.anim = null; z.modus = 'geschrieben'; z.seit = 0; _m5cStatus(); }
    } else if (z.anim === 'ohne') {
      if (!z.ohneFertig && z.at >= K.RUECKEN) {
        z.ohneFertig = true; z.modus = 'ohne'; z.seit = 0;
        _m5cAha();
        _m5cStatus();
      }
      if (z.at >= K.OHNE) z.anim = null;
    }
  }
  _bioFxAlleUpdate(z.fx, dt);
}

// ── Zeichnen ──────────────────────────────────────────────────────────────
function _m5cRund(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - r); ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  ctx.lineTo(x + r, y + h); ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + r); ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  ctx.closePath();
}
function _m5cText(ctx, s, x, y, groesse, farbe, ausr) {
  ctx.fillStyle = farbe || '#1f2937';
  ctx.font = '700 ' + (groesse || 13) + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}
function _m5cStrich(ctx, an) { if (ctx.setLineDash) ctx.setLineDash(an ? [4, 3] : []); }

// Lage der Wortteile oben: Schriftgroesse passt sich der laengsten Zeile an.
function _m5cWortLage(ctx, texte, spreiz) {
  const K = _m5cK, PAD = 10, LUECKE = 16;
  let fs = 22, ws = [];
  for (let v = 0; v < 6; v++) {
    ctx.font = '700 ' + fs + 'px sans-serif';
    ws = texte.map(t => ctx.measureText(t).width);
    const voll = ws.reduce((a, b) => a + b, 0) + texte.length * 2 * PAD + LUECKE * (texte.length - 1);
    if (voll <= K.W - 24 || fs <= 15) break;
    fs = Math.max(15, Math.floor(fs * (K.W - 24) / voll));
  }
  const pad = PAD * spreiz, luecke = LUECKE * spreiz;
  const breit = ws.reduce((a, b) => a + b, 0) + texte.length * 2 * pad + luecke * (texte.length - 1);
  let x = (K.W - breit) / 2;
  const lage = [];
  for (let i = 0; i < texte.length; i++) {
    lage.push({ x: x, w: ws[i] + 2 * pad, text: texte[i], mx: x + pad + ws[i] / 2 });
    x += ws[i] + 2 * pad + luecke;
  }
  return { fs: fs, lage: lage };
}
// Wo die Karte i beim Abflug sitzt: unter der Mitte ihres Wortteils.
function _m5cAbflug(ctx, i) {
  const d = _m5cWORTE[_m5c.key];
  const L = _m5cWortLage(ctx, d.teile.map(t => t[0]), 1);
  return { x: L.lage[i].mx, y: _m5cK.WY + 6 };
}

function _m5cZeichneWort(ctx) {
  const z = _m5c, K = _m5cK, d = _m5cWORTE[z.key];
  // Umfaerben bei der Gegenprobe: alte Teile blenden aus, das neue Wort ein.
  let m = 0;
  if (z.anim === 'ohne' && z.at >= K.RUECKEN) m = _m5cSanft((z.at - K.RUECKEN) / (K.OHNE - K.RUECKEN));
  else if (z.modus === 'ohne' && !z.anim) m = 1;
  // Nacheinander, nicht ueberblendet: erst verschwindet das alte Wort, dann
  // erscheint das neue - zwei Woerter liegen nie uebereinander.
  const alt = Math.max(0, 1 - 2 * m), neu = Math.max(0, 2 * m - 1);
  if (alt > 0) {
    const spreiz = z.anim === 'legen' ? _m5cSanft(z.at / K.START[0]) : 1;
    const L = _m5cWortLage(ctx, d.teile.map(t => t[0]), spreiz);
    for (let i = 0; i < L.lage.length; i++) {
      const p = L.lage[i], f = _m5cFARBE[i];
      // Aufleuchten, solange die Karte dieses Teils fliegt
      let glanz = 0;
      if (z.anim === 'legen') {
        const s = K.START[i];
        if (z.at >= s - 0.1 && z.at < s + K.FLUG + 0.15)
          glanz = Math.sin(Math.PI * _m5cSanft((z.at - s + 0.1) / (K.FLUG + 0.25)));
      }
      ctx.save();
      ctx.globalAlpha = alt;
      if (glanz > 0.02) {
        ctx.save(); ctx.globalAlpha = alt * 0.55 * glanz;
        ctx.fillStyle = '#fcd34d';
        _m5cRund(ctx, p.x - 5, K.WY - K.WH / 2 - 5, p.w + 10, K.WH + 10, 12); ctx.fill();
        ctx.restore();
      }
      if (spreiz > 0.02) {
        ctx.save(); ctx.globalAlpha = alt * spreiz;
        ctx.fillStyle = f.grund; ctx.strokeStyle = f.rand; ctx.lineWidth = glanz > 0.3 ? 2.5 : 1.5;
        _m5cRund(ctx, p.x, K.WY - K.WH / 2, p.w, K.WH, 8); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      _m5cText(ctx, p.text, p.mx, K.WY + 1, L.fs, spreiz > 0.5 ? f.schrift : '#1f2937');
      ctx.restore();
    }
  }
  if (neu > 0) {
    const L = _m5cWortLage(ctx, [d.ohne], 1), p = L.lage[0], o = _m5cORANGE;
    ctx.save();
    ctx.globalAlpha = neu;
    ctx.fillStyle = o.grund; ctx.strokeStyle = o.rand; ctx.lineWidth = 2;
    _m5cRund(ctx, p.x, K.WY - K.WH / 2, p.w, K.WH, 8); ctx.fill(); ctx.stroke();
    _m5cText(ctx, p.text, p.mx, K.WY + 1, L.fs, o.schrift);
    ctx.restore();
  }
}

function _m5cZeichneTafel(ctx) {
  const z = _m5c, K = _m5cK, key = z.key;
  const X1 = K.X0 + 6 * K.CW, erste = _m5cErste(key);
  // Spalten links der ersten Karte gehoeren nicht zur Zahl: nur blass getoent
  ctx.fillStyle = '#f1f5f9';
  for (let c = 0; c < erste; c++) ctx.fillRect(K.X0 + c * K.CW, K.ZY0, K.CW, K.ZY1 - K.ZY0);
  // Kopfzeile
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(K.X0, K.KY0, 6 * K.CW, K.KY1 - K.KY0);
  _m5cSpaltenLicht(ctx, K.KY0 + 1, K.ZY1 - 1);
  for (let c = 0; c < 6; c++)
    _m5cText(ctx, _m5cSPALTEN[c], _m5cMitte(c), (K.KY0 + K.KY1) / 2 + 1, 13, c < erste ? '#64748b' : '#1f2937');
  // Gitter
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; _m5cStrich(ctx, false);
  ctx.strokeRect(K.X0, K.KY0, 6 * K.CW, K.ZY1 - K.KY0);
  ctx.beginPath(); ctx.moveTo(K.X0, K.KY1); ctx.lineTo(X1, K.KY1); ctx.stroke();
  for (let c = 1; c < 6; c++) {
    if (c === 3) continue;
    ctx.beginPath(); ctx.moveTo(K.X0 + c * K.CW, K.KY0); ctx.lineTo(K.X0 + c * K.CW, K.ZY1); ctx.stroke();
  }
  // Tausendergrenze zwischen T und H
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(K.X0 + 3 * K.CW, K.KY0); ctx.lineTo(K.X0 + 3 * K.CW, K.ZY1); ctx.stroke();
  // Leere Spalten innerhalb der Zahl: hellgrau gestrichelt (erst wenn beide Karten liegen)
  const gel = z.anim === 'legen' ? z.gelandet : 2;
  if (gel >= 2) {
    ctx.save(); ctx.globalAlpha = Math.max(0.05, _m5cSanft(z.tafelSeit / 0.4));
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.6; _m5cStrich(ctx, true);
    for (const c of _m5cLeer(key)) {
      _m5cRund(ctx, K.X0 + c * K.CW + 7, K.ZY0 + 5, K.CW - 14, K.ZY1 - K.ZY0 - 10, 6);
      ctx.stroke();
    }
    _m5cStrich(ctx, false);
    ctx.restore();
  }
}

// Die Spalte, die gerade geschrieben wird, hell hinterlegen (Tafel und Zeile).
function _m5cSpaltenLicht(ctx, y0, y1) {
  const z = _m5c, K = _m5cK;
  if (z.anim !== 'schreiben') return;
  const erste = _m5cErste(z.key), n = 6 - erste, schritt = K.SCHREIBEN / n;
  const k = Math.min(n - 1, Math.floor(z.at / schritt));
  const a = 1 - 0.5 * _m5cSanft((z.at - k * schritt) / (schritt + 0.15));
  ctx.save(); ctx.globalAlpha = 0.6 * a;
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(K.X0 + (erste + k) * K.CW + 1, y0, K.CW - 2, y1 - y0);
  ctx.restore();
}

function _m5cKarte(ctx, x, y, ziffer, f, k, rand) {
  const w = (_m5cK.CW - 14) * k, h = (_m5cK.ZY1 - _m5cK.ZY0 - 10) * k;
  ctx.fillStyle = f.grund; ctx.strokeStyle = f.rand; ctx.lineWidth = rand || 2;
  _m5cRund(ctx, x - w / 2, y - h / 2, w, h, 6); ctx.fill(); ctx.stroke();
  _m5cText(ctx, String(ziffer), x, y + 1, Math.round(26 * k), f.schrift);
}

function _m5cZeichneKarten(ctx) {
  const z = _m5c, K = _m5cK, d = _m5cWORTE[z.key];
  const zy = (K.ZY0 + K.ZY1) / 2;
  for (let i = 0; i < d.teile.length; i++) {
    const t = d.teile[i], f = _m5cFARBE[i], ex = _m5cMitte(t[1]);
    if (z.anim === 'legen') {
      const s = K.START[i];
      if (z.at < s) continue;
      if (z.at < s + K.FLUG) {
        const a = _m5cAbflug(ctx, i);
        const p = _m5cSanft((z.at - s) / K.FLUG), q = 1 - p;
        const cx = ex, cy = a.y;                       // erst seitwaerts, dann hinab
        const x = q * q * a.x + 2 * q * p * cx + p * p * ex;
        const y = q * q * a.y + 2 * q * p * cy + p * p * zy;
        _m5cKarte(ctx, x, y, t[2], f, 0.6 + 0.4 * p);
        continue;
      }
      // gerade gelandet: kurzer Rand, der verblasst
      const nach = z.at - s - K.FLUG;
      if (nach < 0.35) {
        ctx.save(); ctx.globalAlpha = 1 - nach / 0.35;
        ctx.strokeStyle = f.rand; ctx.lineWidth = 2;
        _m5cRund(ctx, ex - (K.CW - 6) / 2, K.ZY0 + 1, K.CW - 6, K.ZY1 - K.ZY0 - 2, 8); ctx.stroke();
        ctx.restore();
      }
    }
    _m5cKarte(ctx, ex, zy, t[2], f, 1);
  }
}

// Ziffern in der Zeile „Mit Ziffern“: [{x, ziffer, f, alpha, glanz, quelle}]
function _m5cReihenZiffern() {
  const z = _m5c, K = _m5cK, key = z.key, d = _m5cWORTE[key];
  const ry = (K.RY0 + K.RY1) / 2, zy = (K.ZY0 + K.ZY1) / 2, erste = _m5cErste(key);
  const out = [];
  const voll = (alpha) => {
    for (let c = erste; c <= 5; c++) {
      const i = _m5cBelegt(key, c);
      out.push(i >= 0 ? { x: _m5cMitte(c), y: ry, ziffer: d.teile[i][2], f: _m5cFARBE[i], alpha: 1, quelle: c }
                      : { x: _m5cMitte(c), y: ry, ziffer: 0, f: _m5cORANGE, alpha: alpha, null0: true, quelle: c });
    }
  };
  if (z.anim === 'schreiben') {
    const n = 6 - erste, schritt = K.SCHREIBEN / n;
    for (let c = erste; c <= 5; c++) {
      const k = c - erste, q = (z.at - k * schritt) / K.FALL;
      if (q <= 0) continue;
      const p = _m5cSanft(q), i = _m5cBelegt(key, c);
      const glanz = Math.max(0, 1 - (z.at - k * schritt) / 0.9);
      if (i >= 0) out.push({ x: _m5cMitte(c), y: zy + (ry - zy) * p, ziffer: d.teile[i][2], f: _m5cFARBE[i],
                             alpha: p, quelle: c });
      else out.push({ x: _m5cMitte(c), y: ry, ziffer: 0, f: _m5cORANGE, alpha: p, glanz: glanz,
                      null0: true, quelle: c, k: 0.7 + 0.3 * p });
    }
    return out;
  }
  if (z.anim === 'ohne') {
    const A = 0.3;
    const karten = d.teile.slice().sort((a, b) => a[1] - b[1]);
    const ziel = karten.map((t, j) => 6 - karten.length + j);
    if (z.vonGeschrieben && z.at < A) {
      for (let c = erste; c <= 5; c++) if (_m5cBelegt(key, c) < 0)
        out.push({ x: _m5cMitte(c), y: ry, ziffer: 0, f: _m5cORANGE, alpha: 1 - z.at / A, null0: true, quelle: c });
    }
    for (let j = 0; j < karten.length; j++) {
      const t = karten[j], i = d.teile.indexOf(t);
      let y = ry, alpha = 1;
      if (!z.vonGeschrieben && z.at < A) { const p = _m5cSanft(z.at / A); y = zy + (ry - zy) * p; alpha = p; }
      const p2 = _m5cSanft((z.at - A) / (K.RUECKEN - A));
      const x = _m5cMitte(t[1]) + (_m5cMitte(ziel[j]) - _m5cMitte(t[1])) * p2;
      out.push({ x: x, y: y, ziffer: t[2], f: _m5cFARBE[i], alpha: alpha, quelle: t[1] });
    }
    return out;
  }
  if (z.modus === 'geschrieben') { voll(1); return out; }
  if (z.modus === 'ohne') {
    const karten = d.teile.slice().sort((a, b) => a[1] - b[1]);
    karten.forEach((t, j) => out.push({ x: _m5cMitte(6 - karten.length + j), y: ry, ziffer: t[2],
                                        f: _m5cFARBE[d.teile.indexOf(t)], alpha: 1, quelle: t[1] }));
  }
  return out;
}

function _m5cZeichneReihe(ctx) {
  const z = _m5c, K = _m5cK;
  const X1 = K.X0 + 6 * K.CW, ry = (K.RY0 + K.RY1) / 2, zy = (K.ZY0 + K.ZY1) / 2;
  _m5cText(ctx, 'Mit Ziffern', 8, ry, 13, '#334155', 'left');
  ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  _m5cRund(ctx, K.X0, K.RY0, 6 * K.CW, K.RY1 - K.RY0, 8); ctx.fill(); ctx.stroke();
  _m5cSpaltenLicht(ctx, K.RY0 + 1, K.RY1 - 1);
  // feine Tausendergrenze auch in der Zeile
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(K.X0 + 3 * K.CW, K.RY0 + 6); ctx.lineTo(K.X0 + 3 * K.CW, K.RY1 - 6); ctx.stroke();
  const liste = _m5cReihenZiffern();
  // Wohin ist jede Karten-Ziffer gewandert? (nur, wenn sie nicht mehr unter ihrer Spalte steht)
  ctx.save();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; _m5cStrich(ctx, true);
  for (const e of liste) {
    if (e.null0) continue;
    const qx = _m5cMitte(e.quelle);
    if (Math.abs(e.x - qx) < 2 || e.alpha < 0.99) continue;
    ctx.beginPath(); ctx.moveTo(qx, K.ZY1 - 4); ctx.lineTo(e.x, K.RY0 + 3); ctx.stroke();
  }
  _m5cStrich(ctx, false);
  ctx.restore();
  for (const e of liste) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, e.alpha));
    if (e.null0) {
      // die 0 einer leeren Spalte leuchtet beim Schreiben orange auf
      if (e.glanz > 0.02) {
        ctx.save(); ctx.globalAlpha = 0.6 * e.glanz;
        ctx.fillStyle = '#fdba74';
        _m5cRund(ctx, e.x - 21, K.RY0 + 1, 42, K.RY1 - K.RY0 - 2, 10); ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = _m5cORANGE.grund;
      _m5cRund(ctx, e.x - 15, ry - 16, 30, 32, 6); ctx.fill();
    }
    _m5cText(ctx, String(e.ziffer), e.x, e.y + 1, Math.round(26 * (e.k || 1)), e.f.schrift);
    ctx.restore();
  }
}

function _m5cZeichneKasten(ctx) {
  const z = _m5c, K = _m5cK, key = z.key;
  const X1 = K.X0 + 6 * K.CW, by = (K.BY0 + K.BY1) / 2;
  let text = '', farbe = '#1f2937', a = 0;
  if (!z.anim && z.modus === 'geschrieben') { text = _m5cFormat(_m5cZahl(key)); a = _m5cSanft(z.seit / 0.3); }
  else if (z.anim === 'ohne' && z.modus === 'geschrieben') {
    text = _m5cFormat(_m5cZahl(key)); a = 1 - _m5cSanft(z.at / 0.3);           // alte Zahl blendet aus
    if (a <= 0.02) text = '';
  }
  else if (z.modus === 'ohne') { text = _m5cOhneZahl(key); farbe = _m5cORANGE.schrift; a = _m5cSanft(z.seit / 0.3); }
  _m5cText(ctx, 'Zahl', 8, by, 13, '#334155', 'left');
  ctx.fillStyle = text ? '#f1f5f9' : '#ffffff';
  ctx.strokeStyle = text && z.modus === 'ohne' ? _m5cORANGE.rand : '#cbd5e1';
  ctx.lineWidth = text ? 1.5 : 1;
  _m5cRund(ctx, K.X0, K.BY0, 6 * K.CW, K.BY1 - K.BY0, 10); ctx.fill(); ctx.stroke();
  if (text) {
    ctx.save(); ctx.globalAlpha = Math.max(0.02, a);
    _m5cText(ctx, text, (K.X0 + X1) / 2, by + 1, 30, farbe);
    ctx.restore();
  }
}

function _m5cDraw(ctx, cv) {
  if (!_m5c) return;
  const K = _m5cK;
  ctx.clearRect(0, 0, K.W, K.H);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, K.W, K.H);
  _m5cZeichneWort(ctx);
  _m5cZeichneTafel(ctx);
  _m5cZeichneReihe(ctx);
  _m5cZeichneKasten(ctx);
  _m5cZeichneKarten(ctx);
  _bioFxAlleDraw(ctx, _m5c.fx);
}
