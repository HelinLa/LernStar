
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 6 FOERDER – mt2 „Ist bei 50 Schluss?“ (Kennung m6-hundertertafel,
// Praefix _k6b). Bauplan: arbeitsheft_mathe_foe6/KAPITEL1_PROFIL.md, Abschnitte
// mt2 und m6-hundertertafel (N1–N3, Lehrkraft-Zeile wie Heft 5).
// Ueberschrift = frage der Einheit: „Ist 85 in der 5er-Reihe?“
//
// Was man sieht (Leinwand 420 x 250), zwei Darstellungen, durch FARBE und
// gleichzeitige Bewegung verbunden:
//   HUNDERTERTAFEL rechts oben: 10 x 10 Felder zu 30 x 19 px, Zahlen 1 bis 100
//     in 12 px fett (ABWEICHUNG vom Bauplan, dort 11 px: bei 1 x ist „85“ mit
//     11 px lesbar, am Handy wird die Leinwand aber auf etwa 0,8 x verkleinert,
//     dann waeren es unter 9 px; „100“ passt mit 12 px noch mit Luft zwischen
//     die Rahmen), die Zehnerzeilen durch eine feine Linie getrennt. Darueber
//     die Kopfzeile „letzte Ziffer:  1 2 3 4 5 6 7 8 9 0“ – je Spalte die
//     letzte Ziffer ihrer Zahlen. Links neben der 1 ein gestricheltes
//     Startfeld „0“ mit der Aufschrift „Start“: dort beginnt jede Reihe.
//   ZAHLENSTRAHL unten ueber die volle Breite: 0 bis 100, Strich je 1 (laenger
//     je 5 und je 10), Zahl je 10, Pfeil nach rechts.
//   Links ein Schild in der Farbe der gewaehlten Reihe („5er-Reihe“), darunter
//     ein Bogen mit „+ 5“: so weit springt jeder Bogen auf dem Zahlenstrahl.
//   Jede Reihe hat EINE Farbe (10er blau, 5er gruen, 2er violett, 4er rosa,
//     3er tuerkis, 6er orange): Felder, Marken und Boegen am Strahl, das
//     Kaertchen der Kopfzeile, Schild und die Werte in der Anzeige.
//
// Bewegung (jede Sprungmarke spielt ihre Tabellenzeile SELBST ab, N1; alles
// ist eine Funktion der Ablaufzeit z.at, Konstanten in _k6bK – keine Zufallszahl):
//   0 – 0,3 s  die Tafel leert sich: Felder, Rahmen, Marken und Boegen der
//              alten Reihe blenden aus; der Punkt steht am Strahl bei 0, auf
//              der Tafel ist das Startfeld „0“ dunkel umrandet.
//   dann       der Punkt springt um n, gleichzeitig auf der Tafel und am
//              Strahl (im Bogen, mit Schatten). Ein Sprung dauert 0,06 s · n
//              (10er 0,6 s … 2er 0,12 s, ein Durchlauf rund 6 s), davon 80 %
//              Flug. Beim Landen waechst das Feld in der Reihenfarbe auf und
//              blitzt hell, am Strahl springt eine Marke auf, der Bogen bleibt
//              stehen. Zwischen zwei Spruengen sitzt der Punkt im Feld: es ist
//              dunkel umrandet (so steht im Halt keine Zahl unter dem Punkt).
//              Das Kaertchen der Kopfzeile ueber einer Spalte wird bunt, sobald
//              in ihr eine Zahl bunt ist.
//   Ende       ist eine Spalte ganz bunt (das entscheidet sich immer in der
//              letzten Zeile), bekommt sie einen dicken Rahmen in der dunklen
//              Reihenfarbe, ihr Kaertchen in der Kopfzeile einen Rand. Der
//              Rahmen des letzten Feldes blendet aus (0,6 s), der Punkt bleibt
//              am Strahl auf der letzten bunten Zahl.
//   GEMESSEN (Frames zu 16 ms, Tempo normal) bis zur Ruhe: 10er 6,78 s (424
//   Frames), 5er 6,85 s (428), 2er 6,88 s (430), 4er 6,86 s (429), 3er 6,82 s
//   (426), 6er 6,59 s (412). simfakten.js mit --frames=25 --verlauf=4 liest die
//   Endwerte im zweiten Knopfdurchgang ab (er laeuft bis zu 625 Frames aus).
//   „neu“      sofort der Start: die alte Reihe blendet aus (0,3 s).
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort ankommen
// (die alte Reihe steht dann ganz da und blendet aus, ohne Lichtring); dann
// geschieht das Neue. Jede Knopffolge endet so in denselben Zahlen.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_k6bMarke(10|5|2|4)):
//     „10er-Reihe“ · „5er-Reihe“ · „2er-Reihe“ · „4er-Reihe“
//   Reihe 2: „3er-Reihe“ · „6er-Reihe“ (frei, _k6bMarke(3|6)) · „neu“ (_k6bNeu())
//   Der Knopf der Reihe, die gerade dasteht oder springt, ist hervorgehoben.
//
// Statuszeilen (woertlich, jede mit mindestens 19 Zeichen). Sie folgen dem
// Bild: jede Zahl aendert sich in dem Augenblick, in dem der Punkt landet bzw.
// ein Rahmen erscheint.
//   _k6b-reihe     „Gewählte Reihe: 5er-Reihe“ (Start „Gewählte Reihe: noch keine“)
//   _k6b-spruenge  „Sprünge von 0 bis 100: 20“ (zaehlt mit, Start 0)
//   _k6b-spalten   „Ganz bunte Spalten: 2“ (zaehlt die Rahmen, Start 0)
//   _k6b-ziffern   „Letzte Ziffern der bunten Zahlen: 0, 5“ (waechst mit,
//                  der Groesse nach; Start „…: keine“)
//   _k6b-letzte    „Letzte bunte Zahl: 100“ (Start „Letzte bunte Zahl: keine“)
//
// Werte (jede Zeile nachgerechnet mit simcheck/werte.js, Endwerte):
//   10er-Reihe → 10 Spruenge, 1 Spalte, „0“, 100
//   5er-Reihe  → 20, 2, „0, 5“, 100
//   2er-Reihe  → 50, 5, „0, 2, 4, 6, 8“, 100
//   4er-Reihe  → 25, 0, „0, 2, 4, 6, 8“, 100
//   frei: 3er-Reihe → 33, 0, „0, 1, 2, 3, 4, 5, 6, 7, 8, 9“, 99
//         6er-Reihe → 16, 0, „0, 2, 4, 6, 8“, 96
// Start: leere Hundertertafel („Start: Hundertertafel, noch keine Reihe“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen), nur wenn die Reihe von selbst
// dorthin springt:
//   „5er-Reihe“: der Punkt landet auf 85 – Lichtring um das Feld 85 und ein
//     bernsteinfarbener Rahmen, der 2,2 s pulsiert (Tareks Grenze 50 ist
//     ueberschritten). Widerlegt „Die 5er-Reihe hört bei 50 auf.“
//   „4er-Reihe“: der Punkt landet auf 24 – Lichtring und Rahmen um das WEISSE
//     Feld 14 (es bleibt weiss, nur der Rand leuchtet). Die letzte Ziffer 4
//     reicht hier nicht.
//
// FUER DIE LEHRKRAFT (Container <div class="fpm-lehrkraft">, eigene Zeile unter
// den Heftknoepfen, davor klein „Für die Lehrkraft:“):
//   „Pause“ ↔ „weiter“ (_k6bAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ links (unter dem Schild der Reihe; oben links stehen „Start“ und
//     das Startfeld).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_k6bTempo()): ein Drittel so schnell.
//   „Halt nach jedem Sprung: aus“ ↔ „… an“ (_k6bHalt()): haelt nach JEDER
//     Landung an (Pause); das Feld ist dann schon bunt, die Anzeige gilt.
//     Hinweiszeile: „Halt: Der Punkt ist auf 35. Wohin springt er als
//     Nächstes? Dann „weiter“.“ Der Schalter auf „aus“ laesst weiterspringen.
//   Eine Sprungmarke und „neu“ heben die Pause auf; Tempo und Halt bleiben
//   stehen. EIN Zeitfaktor (_k6bZeitfaktor: 0 Pause, 1/3 langsam, 1 normal) an
//   der einen Stelle, an der dt in _k6bUpdate hineingeht. Das wechselnde Wort
//   steht in einem eigenen <span>. Hinweiszeile _k6b-lehrkraft (in der Pause
//   bernsteinfarben, „lmp-status off“) nennt immer die Einstellungen:
//     sonst „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal, Halt nach jedem Sprung: aus.“
//     Pause „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. Tempo: …“
//   Voreinstellung Pause aus, Tempo normal, Halt aus.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Vielfaches“,
// „Vielfache“, „Endziffer“, „teilbar“, die Regel als Satz. „letzte Ziffer“
// steht nur als Beschriftung der Kopfzeile und der Anzeige. Keine Namen,
// keine Punkte, keine Zeit, kein Urteil.
// ════════════════════════════════════════════════════════════════════════
let _k6b = null;
const _k6bREIHEN = {
  10: { name: '10er-Reihe', fuell: '#60a5fa', dunkel: '#1d4ed8' },
  5:  { name: '5er-Reihe',  fuell: '#4ade80', dunkel: '#15803d' },
  2:  { name: '2er-Reihe',  fuell: '#c084fc', dunkel: '#7e22ce' },
  4:  { name: '4er-Reihe',  fuell: '#fb7185', dunkel: '#be123c' },
  3:  { name: '3er-Reihe',  fuell: '#2dd4bf', dunkel: '#0f766e' },
  6:  { name: '6er-Reihe',  fuell: '#fb923c', dunkel: '#c2410c' }
};
const _k6bMARKEN = [10, 5, 2, 4];       // Reihe 1: die vier Tabellenzeilen
const _k6bFREI = [3, 6];                // Reihe 2: frei
// Aha: Landet der Punkt auf „bei“, leuchtet das Feld „zelle“.
const _k6bAHA = { 5: { bei: 85, zelle: 85 }, 4: { bei: 24, zelle: 14 } };
const _k6bK = {
  BX: 110, BY: 22, CW: 30, CH: 19,       // Hundertertafel: linke obere Ecke, Feldgroesse
  KOPF: 15.5,                             // Grundlinie der Kopfzeile
  SX: 96,                                 // Mitte des Startfelds „0“ (links neben der 1)
  LX0: 16, LX1: 404, LY: 229,             // Zahlenstrahl: 0 bei LX0, 100 bei LX1
  ZAHL: 11, ZAHL_TAFEL: 12,               // Schriftgrad: Beschriftungen und Strahl, Zahlen der Tafel
  RP: 4.5,                                // Radius des Punkts
  SCHILD_Y: 64, BOGEN_Y: 120,             // Schild der Reihe, Bogen „+ n“
  T_LEER: 0.3, T_JE: 0.06, FLUG: 0.8,     // s: Tafel leert sich; Sprung = T_JE · n, davon FLUG fliegen
  T_POP: 0.25, T_MARKE: 0.18, T_RAHMEN: 0.4, T_AUS: 0.6, T_AHA: 2.2, LANGSAM: 1 / 3,
  F_TEXT: '#1e293b', F_GITTER: '#cbd5e1', F_ZEILE: '#94a3b8', F_RAND: '#64748b',
  F_PUNKT: '#1e293b', F_AHA: '#f59e0b', F_GRAU: '#475569', F_STRAHL: '#334155'
};

// ── Rechnungen (eine Quelle fuer Bild und Anzeige) ──────────────────────
// Ablauf einer Reihe n: N Spruenge, Landung j (1 … N) zur Ablaufzeit landung(j).
// Spalte p (0 … 9; ihre Zahlen 10·r + p + 1, letzte Ziffer (p + 1) % 10) ist
// ganz bunt, wenn alle zehn Zahlen in der Reihe liegen – fertig mit der Zahl
// der letzten Zeile, also mit Sprung j = (91 + p) / n.
function _k6bPlan(n) {
  const K = _k6bK, N = Math.floor(100 / n), TS = K.T_JE * n;
  const landung = j => K.T_LEER + (j - 1) * TS + K.FLUG * TS;
  const spalten = [];
  for (let p = 0; p < 10; p++) {
    let ganz = true;
    for (let r = 0; r < 10; r++) if ((10 * r + p + 1) % n) { ganz = false; break; }
    if (ganz) spalten.push({ p, j: (91 + p) / n });
  }
  return { n, N, TS, landung, spalten, ende: landung(N) + K.T_AUS };
}
// Stand zur Ablaufzeit: wie viele Spruenge gelandet, wie viele Rahmen da?
function _k6bStand(z) {
  const st = { gelandet: 0, spalten: 0 };
  if (!z.n) return st;
  const K = _k6bK, P = _k6bPlan(z.n), at = z.at + 1e-9;
  st.gelandet = Math.max(0, Math.min(P.N, Math.floor((at - K.T_LEER - K.FLUG * P.TS) / P.TS) + 1));
  st.spalten = P.spalten.filter(s => s.j <= st.gelandet).length;
  return st;
}
// Letzte Ziffern der bunten Zahlen, der Groesse nach
function _k6bZiffern(n, gelandet) {
  const da = new Set();
  for (let j = 1; j <= gelandet; j++) da.add((j * n) % 10);
  return [...da].sort((a, b) => a - b);
}
// Fliegt der Punkt gerade? Dann Sprung j und Flugfortschritt u (0 … 1).
function _k6bFlug(z) {
  if (!z.n) return null;
  const K = _k6bK, P = _k6bPlan(z.n), s = z.at - K.T_LEER;
  if (s < 0) return null;
  const j = Math.floor(s / P.TS + 1e-9) + 1;
  if (j > P.N) return null;
  const u = (s - (j - 1) * P.TS) / (K.FLUG * P.TS);
  return u < 1 - 1e-9 ? { j, u } : null;
}
// Feld der Zahl k (1 … 100); k = 0 ist das Startfeld links neben der 1.
function _k6bFeld(k) {
  const K = _k6bK;
  if (k <= 0) return { x: K.SX - 10, y: K.BY + 1, w: 20, h: K.CH - 2, cx: K.SX, cy: K.BY + K.CH / 2 };
  const r = Math.floor((k - 1) / 10), p = (k - 1) % 10, x = K.BX + p * K.CW, y = K.BY + r * K.CH;
  return { x, y, w: K.CW, h: K.CH, cx: x + K.CW / 2, cy: y + K.CH / 2 };
}
// x-Wert der Zahl k am Zahlenstrahl
function _k6bLX(k) { const K = _k6bK; return K.LX0 + (K.LX1 - K.LX0) * k / 100; }
// Hoehe der Boegen am Strahl (je weiter der Sprung, desto hoeher, hoechstens 13 px)
function _k6bBogenH(n) { return Math.min(13, 2 + 0.28 * (_k6bLX(n) - _k6bLX(0))); }

function _k6bInit() {
  _k6b = { t: 0, at: 0, n: null, alt: null, sofort: false, fx: { teile: [] },
           stand: { gelandet: 0, spalten: 0 }, ahaGlanz: 0, ahaZelle: 0,
           pause: false, langsam: false, halt: false, haltJetzt: false };   // Lehrkraft
}
function _k6bHTML() {
  const knopf = n => `<button class="sim-btn" id="_k6b-b-${n}" onclick="_k6bMarke(${n})">${_k6bREIHEN[n].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Ist 85 in der 5er-Reihe?</h3>
    <div class="fpm-note" style="margin-top:2px">Die Reihe springt von 0 aus. Wo sie landet, wird das Feld bunt.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_k6b-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_k6bMARKEN.map(knopf).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_k6bFREI.map(knopf).join('\n          ')}
          <button class="sim-btn" onclick="_k6bNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_k6b-pause" onclick="_k6bAnhalten()">Pause</button>
            <button class="sim-btn" id="_k6b-tempo" onclick="_k6bTempo()">Tempo: <span id="_k6b-tempo-an">normal</span></button>
            <button class="sim-btn" id="_k6b-halt" onclick="_k6bHalt()">Halt nach jedem Sprung: <span id="_k6b-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_k6b-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_k6b-reihe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6b-spruenge" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6b-spalten" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6b-ziffern" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6b-letzte" style="margin-top:6px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Hundertertafel, noch keine Reihe</p>
  </div>`;
}
function _k6bSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _k6bStatus() {
  if (!_k6b) return;
  const z = _k6b, R = z.n ? _k6bREIHEN[z.n] : null, st = z.stand;
  const f = s => R ? '<b style="color:' + R.dunkel + '">' + s + '</b>' : String(s);
  _k6bSetze('_k6b-reihe', 'Gewählte Reihe: ' + (R ? f(R.name) : 'noch keine'));
  _k6bSetze('_k6b-spruenge', 'Sprünge von 0 bis 100: ' + f(st.gelandet));
  _k6bSetze('_k6b-spalten', 'Ganz bunte Spalten: ' + f(st.spalten));
  const zf = R ? _k6bZiffern(z.n, st.gelandet) : [];
  _k6bSetze('_k6b-ziffern', 'Letzte Ziffern der bunten Zahlen: ' + (zf.length ? f(zf.join(', ')) : 'keine'));
  _k6bSetze('_k6b-letzte', 'Letzte bunte Zahl: ' + (st.gelandet ? f(st.gelandet * z.n) : 'keine'));
  for (const n of _k6bMARKEN.concat(_k6bFREI)) {
    const b = document.getElementById('_k6b-b-' + n);
    if (b && b.classList) b.classList.toggle('primary', n === z.n);
  }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _k6bSetze('_k6b-pause', z.pause ? 'weiter' : 'Pause');
  _k6bSetze('_k6b-tempo-an', z.langsam ? 'langsam' : 'normal');
  _k6bSetze('_k6b-halt-an', z.halt ? 'an' : 'aus');
  const hz = _k6bSetze('_k6b-lehrkraft', _k6bHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_k6b-pause', z.pause], ['_k6b-halt', z.halt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _k6bHinweis() {
  const z = _k6b;
  let a;
  if (z.pause && z.haltJetzt && z.n)
    a = 'Halt: Der Punkt ist auf ' + z.stand.gelandet * z.n + '. Wohin springt er als Nächstes? Dann „weiter“.';
  else if (z.pause) a = 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  else a = 'Für die Lehrkraft: „Pause“ hält alles an.';
  return a + ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt nach jedem Sprung: ' + (z.halt ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Sprungmarke: die alte Reihe kommt sofort ganz an und blendet aus, dann
// springt die neue von 0 aus. Hebt die Pause auf.
function _k6bMarke(n) {
  if (!_k6b || !_k6bREIHEN[n]) return;
  const z = _k6b;
  z.alt = z.n ? { n: z.n } : null;
  z.n = n; z.at = 0; z.sofort = false;
  z.pause = false; z.haltJetzt = false;
  z.ahaGlanz = 0; z.ahaZelle = 0; z.fx.teile.length = 0;
  z.stand = _k6bStand(z);
  _k6bStatus();
}
// „neu“: sofort der Start; die alte Reihe blendet aus. Hebt die Pause auf.
function _k6bNeu() {
  if (!_k6b) return;
  const z = _k6b;
  z.alt = z.n ? { n: z.n } : null;
  z.n = null; z.at = 0; z.sofort = false;
  z.pause = false; z.haltJetzt = false;
  z.ahaGlanz = 0; z.ahaZelle = 0; z.fx.teile.length = 0;
  z.stand = _k6bStand(z);
  _k6bStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _k6bAnhalten() {
  if (!_k6b) return;
  const z = _k6b;
  z.pause = !z.pause;
  if (!z.pause) z.haltJetzt = false;
  _k6bStatus();
}
function _k6bTempo() {
  if (!_k6b) return;
  _k6b.langsam = !_k6b.langsam;
  _k6bStatus();
}
function _k6bHalt() {
  if (!_k6b) return;
  const z = _k6b;
  z.halt = !z.halt;
  if (!z.halt && z.haltJetzt) { z.pause = false; z.haltJetzt = false; }   // aus: weiterspringen
  _k6bStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _k6bZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _k6bK.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _k6bUpdate(dt) {
  if (!_k6b) return;
  const z = _k6b, K = _k6bK;
  dt = _bioFxDt(dt) * _k6bZeitfaktor(z);              // ab hier Sim-Zeit
  z.t += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  if (dt > 0 && (z.n || z.alt)) {                     // ohne Zeit kein Schritt im Ablauf
    const P = z.n ? _k6bPlan(z.n) : null, ende = P ? P.ende : K.T_LEER;
    let neuAt = Math.min(z.at + dt, ende), neu = false;
    // Halt nach jedem Sprung: genau auf der naechsten Landung anhalten
    const j = z.stand.gelandet + 1;
    if (P && z.halt && j <= P.N) {
      const L = P.landung(j);
      if (z.at < L - 1e-9 && neuAt >= L - 1e-9) { neuAt = L; z.pause = true; z.haltJetzt = true; neu = true; }
    }
    z.at = neuAt;
    if (z.at >= K.T_LEER) z.alt = null;               // die alte Reihe ist ausgeblendet
    const st = _k6bStand(z), alt = z.stand;
    if (st.gelandet !== alt.gelandet || st.spalten !== alt.spalten) neu = true;
    const A = z.n ? _k6bAHA[z.n] : null;
    if (A && !z.sofort && alt.gelandet * z.n < A.bei && st.gelandet * z.n >= A.bei) {
      const F = _k6bFeld(A.zelle);
      z.ahaZelle = A.zelle; z.ahaGlanz = K.T_AHA;
      _bioFxWelle(z.fx.teile, F.cx, F.cy, K.F_AHA, 26);
    }
    z.stand = st;
    if (neu) _k6bStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _k6bText(ctx, s, x, y, gr, farbe, ausr, gew, grund) {
  ctx.fillStyle = farbe || _k6bK.F_TEXT;
  ctx.font = (gew || '700') + ' ' + gr + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = grund || 'alphabetic';
  ctx.fillText(s, x, y);
}
// Was ist gerade bunt? Felder, Rahmen, Kopfzeile, Marken und Boegen – fuer die
// alte Reihe (blendet aus, ganz angekommen) und die laufende.
function _k6bBild(z) {
  const K = _k6bK, B = { felder: [], kopf: [], rahmen: [], marken: [], boegen: [] };
  const ruhig = z.pause && z.haltJetzt;                // im Halt ist jede Landung fertig gezeichnet
  const reihe = (n, bis, a, alter) => {
    const R = _k6bREIHEN[n], P = _k6bPlan(n);
    for (let j = 1; j <= bis; j++) {
      const k = j * n, al = alter(j), p = (k - 1) % 10;
      B.felder.push({ k, R, a, al });
      B.marken.push({ k, R, a, al, n });
      B.boegen.push({ von: k - n, bis: k, R, a });
      B.kopf[p] = { R, a, ganz: 0 };
    }
    for (const s of P.spalten) if (s.j <= bis) {
      const al = alter(s.j);
      B.rahmen.push({ p: s.p, R, a, al });
      B.kopf[s.p].ganz = _bioFxKlemme(al / K.T_RAHMEN);
    }
  };
  if (z.alt && z.at < K.T_LEER) {
    const a = 1 - _bioFxEase.sanft(_bioFxKlemme(z.at / K.T_LEER));
    reihe(z.alt.n, Math.floor(100 / z.alt.n), a, () => 99);
  }
  if (z.n) {
    const P = _k6bPlan(z.n);
    reihe(z.n, z.stand.gelandet, 1, j => ruhig ? 99 : z.at - P.landung(j));
  }
  return B;
}
// Kopfzeile: „letzte Ziffer:“ und die Ziffern 1 … 9, 0 ueber den Spalten.
function _k6bKopf(ctx, B) {
  const K = _k6bK;
  _k6bText(ctx, 'letzte Ziffer:', K.BX - 6, K.KOPF, K.ZAHL, K.F_GRAU, 'right', '700');
  for (let p = 0; p < 10; p++) {
    const cx = K.BX + p * K.CW + K.CW / 2, c = B.kopf[p];
    if (c) {                                           // in dieser Spalte ist eine Zahl bunt
      ctx.save();
      ctx.globalAlpha = c.a;
      ctx.fillStyle = c.R.fuell;
      _bioFxRundRect(ctx, cx - 9, 3, 18, 16, 4); ctx.fill();
      if (c.ganz > 0) {                                // die Spalte ist ganz bunt
        ctx.globalAlpha = c.a * c.ganz;
        ctx.strokeStyle = c.R.dunkel; ctx.lineWidth = 2;
        _bioFxRundRect(ctx, cx - 9, 3, 18, 16, 4); ctx.stroke();
      }
      ctx.restore();
    }
    _k6bText(ctx, String((p + 1) % 10), cx, K.KOPF, 12, K.F_TEXT, 'center', '700');
  }
}
// Die Hundertertafel mit bunten Feldern, Gitter, Zahlen und Rahmen.
function _k6bTafel(ctx, B) {
  const z = _k6b, K = _k6bK, E = _bioFxEase, kl = _bioFxKlemme;
  const breit = 10 * K.CW, hoch = 10 * K.CH;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  ctx.fillRect(K.BX + 2, K.BY + 3, breit, hoch);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(K.BX, K.BY, breit, hoch);
  // bunte Felder: wachsen beim Landen aus der Mitte und blitzen hell
  for (const f of B.felder) {
    const F = _k6bFeld(f.k), e = kl(f.al / K.T_POP), s = 0.35 + 0.65 * E.raus(e);
    ctx.globalAlpha = f.a;
    ctx.fillStyle = f.R.fuell;
    ctx.fillRect(F.cx - F.w * s / 2, F.cy - F.h * s / 2, F.w * s, F.h * s);
    if (e < 1) {
      ctx.globalAlpha = f.a * 0.6 * (1 - e);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(F.x, F.y, F.w, F.h);
    }
  }
  ctx.globalAlpha = 1;
  // Gitter: Spalten fein, Zehnerzeilen etwas kraeftiger, aussen ein Rand
  ctx.lineWidth = 1;
  ctx.strokeStyle = K.F_GITTER;
  ctx.beginPath();
  for (let p = 1; p < 10; p++) { const x = K.BX + p * K.CW + 0.5; ctx.moveTo(x, K.BY); ctx.lineTo(x, K.BY + hoch); }
  ctx.stroke();
  ctx.strokeStyle = K.F_ZEILE;
  ctx.beginPath();
  for (let r = 1; r < 10; r++) { const y = K.BY + r * K.CH + 0.5; ctx.moveTo(K.BX, y); ctx.lineTo(K.BX + breit, y); }
  ctx.stroke();
  ctx.strokeStyle = K.F_RAND; ctx.lineWidth = 1.5;
  ctx.strokeRect(K.BX, K.BY, breit, hoch);
  ctx.restore();
  // Zahlen 1 … 100
  for (let k = 1; k <= 100; k++) {
    const F = _k6bFeld(k);
    _k6bText(ctx, String(k), F.cx, F.cy + 0.5, K.ZAHL_TAFEL, K.F_TEXT, 'center', '700', 'middle');
  }
  // dicke Rahmen um ganz bunte Spalten (ziehen sich beim Erscheinen zusammen)
  for (const r of B.rahmen) {
    const e = kl(r.al / K.T_RAHMEN), d = 5 * (1 - E.raus(e)), x = K.BX + r.p * K.CW;
    ctx.save();
    ctx.globalAlpha = r.a * (0.25 + 0.75 * e);
    ctx.strokeStyle = r.R.dunkel; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, x + 1.5 - d, K.BY + 1.5 - d, K.CW - 3 + 2 * d, hoch - 3 + 2 * d, 4); ctx.stroke();
    ctx.restore();
  }
}
// Wo sitzt der Punkt zwischen zwei Spruengen? Dieses Feld ist dunkel umrandet.
function _k6bAktuell(z) {
  const K = _k6bK, kl = _bioFxKlemme;
  if (!z.n) return { k: 0, a: z.alt ? kl(z.at / K.T_LEER) : 1 };
  if (_k6bFlug(z)) return null;
  const P = _k6bPlan(z.n), g = z.stand.gelandet;
  if (g < P.N || (z.pause && z.haltJetzt)) return { k: g * z.n, a: 1 };
  return { k: g * z.n, a: 1 - kl((z.at - P.landung(P.N)) / K.T_AUS) };
}
// Startfeld „0“ links neben der 1, davor „Start“; Rahmen des aktuellen Feldes; Aha.
function _k6bMarkierung(ctx) {
  const z = _k6b, K = _k6bK, S = _k6bFeld(0);
  _k6bText(ctx, 'Start', S.x - 5, S.cy + 0.5, K.ZAHL, K.F_GRAU, 'right', '700', 'middle');
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.F_RAND; ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 2]);
  _bioFxRundRect(ctx, S.x, S.y, S.w, S.h, 3); ctx.fill(); ctx.stroke();
  ctx.restore();
  _k6bText(ctx, '0', S.cx, S.cy + 0.5, K.ZAHL, K.F_TEXT, 'center', '700', 'middle');
  const akt = _k6bAktuell(z);
  if (akt && akt.a > 0.01) {
    const F = _k6bFeld(akt.k);
    ctx.save();
    ctx.globalAlpha = akt.a;
    ctx.strokeStyle = K.F_PUNKT; ctx.lineWidth = 2.2;
    _bioFxRundRect(ctx, F.x + 1.2, F.y + 1.2, F.w - 2.4, F.h - 2.4, 3); ctx.stroke();
    ctx.restore();
  }
  if (z.ahaGlanz > 0 && z.ahaZelle) {                  // ruhiger Rahmen, ohne Fuellung
    const F = _k6bFeld(z.ahaZelle);
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.6) * (0.65 + 0.35 * Math.sin(z.t * 6));
    ctx.strokeStyle = K.F_AHA; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, F.x - 2, F.y - 2, F.w + 4, F.h + 4, 5); ctx.stroke();
    ctx.restore();
  }
}
// Links: Schild der gewaehlten Reihe und ein Bogen „+ n“ wie am Zahlenstrahl.
function _k6bSchild(ctx) {
  const z = _k6b, K = _k6bK;
  if (!z.n) return;
  const R = _k6bREIHEN[z.n], k = Math.max(0.3, _bioFxEase.federn(_bioFxKlemme(z.at / 0.3)));
  ctx.save();
  ctx.translate(53, K.SCHILD_Y); ctx.scale(k, k);
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, -42, -10, 88, 24, 7); ctx.fill();
  ctx.fillStyle = R.fuell; ctx.strokeStyle = R.dunkel; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, -44, -12, 88, 24, 7); ctx.fill(); ctx.stroke();
  _k6bText(ctx, R.name, 0, 0.5, 13, K.F_TEXT, 'center', '700', 'middle');
  ctx.restore();
  // Bogen mit „+ n“: so weit springt jeder Bogen am Strahl
  const x0 = 24, x1 = 82, y = K.BOGEN_Y, h = 16;
  ctx.save();
  ctx.globalAlpha = _bioFxKlemme(z.at / 0.3);
  ctx.strokeStyle = R.dunkel; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 20; i++) {
    const e = i / 20, x = x0 + (x1 - x0) * e, yy = y - 4 * h * e * (1 - e);
    if (i) ctx.lineTo(x, yy); else ctx.moveTo(x, yy);
  }
  ctx.stroke();
  ctx.fillStyle = R.dunkel;
  for (const x of [x0, x1]) { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = K.F_STRAHL; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(x0 - 8, y); ctx.lineTo(x1 + 8, y); ctx.stroke();
  _k6bText(ctx, '+ ' + z.n, (x0 + x1) / 2, y - h - 5, 13, R.dunkel, 'center', '700');
  ctx.restore();
}
// Ein Bogen am Strahl von a nach b, gezeichnet bis zum Anteil bis (0 … 1).
function _k6bBogen(ctx, a, b, h, bis) {
  const K = _k6bK, xa = _k6bLX(a), xb = _k6bLX(b), m = 16;
  ctx.beginPath();
  for (let i = 0; i <= m; i++) {
    const e = bis * i / m, x = xa + (xb - xa) * e, y = K.LY - 4 * h * e * (1 - e);
    if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
  }
  ctx.stroke();
}
function _k6bPunkt(ctx, x, y, r, a) {
  const K = _k6bK;
  if (a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = K.F_PUNKT; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (r > 3) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Zahlenstrahl 0 – 100 mit Boegen, Marken und dem Punkt.
function _k6bStrahl(ctx, B) {
  const z = _k6b, K = _k6bK, kl = _bioFxKlemme, E = _bioFxEase;
  ctx.save();
  ctx.strokeStyle = K.F_STRAHL; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(K.LX0 - 5, K.LY); ctx.lineTo(K.LX1 + 9, K.LY); ctx.stroke();
  ctx.fillStyle = K.F_STRAHL;                          // Pfeil
  ctx.beginPath(); ctx.moveTo(K.LX1 + 15, K.LY); ctx.lineTo(K.LX1 + 7, K.LY - 4.5);
  ctx.lineTo(K.LX1 + 7, K.LY + 4.5); ctx.closePath(); ctx.fill();
  for (let k = 0; k <= 100; k++) {                     // Strich je 1, laenger je 5 und je 10
    const x = _k6bLX(k), l = k % 10 === 0 ? 6 : k % 5 === 0 ? 4 : 2.5;
    ctx.strokeStyle = k % 10 === 0 ? K.F_STRAHL : '#64748b';
    ctx.lineWidth = k % 10 === 0 ? 1.4 : 0.9;
    ctx.beginPath(); ctx.moveTo(x, K.LY - l); ctx.lineTo(x, K.LY + l); ctx.stroke();
  }
  ctx.restore();
  for (let k = 0; k <= 100; k += 10)
    _k6bText(ctx, String(k), _k6bLX(k), K.LY + 17, K.ZAHL, K.F_STRAHL, 'center', '700');
  // Boegen der gelandeten Spruenge und der Bogen, der gerade waechst
  ctx.save();
  ctx.lineWidth = 1.5;
  for (const b of B.boegen) {
    ctx.globalAlpha = 0.8 * b.a; ctx.strokeStyle = b.R.dunkel;
    _k6bBogen(ctx, b.von, b.bis, _k6bBogenH(b.bis - b.von), 1);
  }
  const fl = _k6bFlug(z);
  if (fl) {
    const R = _k6bREIHEN[z.n];
    ctx.globalAlpha = 0.8; ctx.strokeStyle = R.dunkel;
    _k6bBogen(ctx, (fl.j - 1) * z.n, fl.j * z.n, _k6bBogenH(z.n), E.sanft(fl.u));
  }
  ctx.restore();
  // Marken an den Landestellen (springen auf); bei kurzen Spruengen kleiner,
  // damit zwischen zwei Marken der Strahl sichtbar bleibt (2er: 2,5 px)
  for (const m of B.marken) {
    const rm = Math.min(3.2, 0.32 * (_k6bLX(m.n) - _k6bLX(0)));
    const s = Math.max(0, Math.min(1.25, E.federn(kl(m.al / K.T_MARKE))));
    if (s <= 0.05) continue;
    ctx.save();
    ctx.globalAlpha = m.a;
    ctx.fillStyle = m.R.fuell; ctx.strokeStyle = m.R.dunkel; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(_k6bLX(m.k), K.LY, rm * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // der Punkt am Strahl: fliegt im Bogen mit, sonst sitzt er auf der letzten Zahl
  if (z.alt && z.at < K.T_LEER) {
    const u = kl(z.at / K.T_LEER);
    _k6bPunkt(ctx, _k6bLX(Math.floor(100 / z.alt.n) * z.alt.n), K.LY, K.RP, 1 - u);
    _k6bPunkt(ctx, _k6bLX(0), K.LY, K.RP, u);
    return;
  }
  if (fl) {
    const e = E.sanft(fl.u), xa = _k6bLX((fl.j - 1) * z.n), xb = _k6bLX(fl.j * z.n), h = _k6bBogenH(z.n);
    _k6bPunkt(ctx, xa + (xb - xa) * e, K.LY - 4 * h * e * (1 - e), K.RP, 1);
  } else _k6bPunkt(ctx, _k6bLX(z.n ? z.stand.gelandet * z.n : 0), K.LY, K.RP, 1);
}
// Der Punkt auf der Tafel – nur waehrend des Flugs; landet er, wird das Feld bunt.
function _k6bTafelPunkt(ctx) {
  const z = _k6b, fl = _k6bFlug(z);
  if (!fl) return;
  const K = _k6bK, A = _k6bFeld((fl.j - 1) * z.n), B = _k6bFeld(fl.j * z.n), e = _bioFxEase.sanft(fl.u);
  const h = Math.min(10, 3 + 0.05 * Math.hypot(B.cx - A.cx, B.cy - A.cy));
  const gx = A.cx + (B.cx - A.cx) * e, gy = A.cy + (B.cy - A.cy) * e, hub = 4 * h * e * (1 - e);
  const s = e < 0.15 ? 0.5 + 0.5 * e / 0.15 : e > 0.85 ? 0.5 + 0.5 * (1 - e) / 0.15 : 1;
  ctx.save();                                          // Schatten auf der Tafel
  ctx.globalAlpha = 0.18; ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.ellipse(gx, gy + 2, K.RP * s, K.RP * s * 0.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  _k6bPunkt(ctx, gx, gy - hub, K.RP * s, 1);
}
// Schild „Pause“ links (unter dem Schild der Reihe) – Groesse und Farbe wie in
// den Heft-5-Simulationen.
function _k6bPauseSchild(ctx) {
  const w = 64, h = 25, x = 21, y = 150;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _k6bText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _k6bDraw(ctx, cv) {
  if (!_k6b) return;
  const z = _k6b, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const B = _k6bBild(z);
  _k6bKopf(ctx, B);
  _k6bTafel(ctx, B);
  _k6bMarkierung(ctx);
  _k6bSchild(ctx);
  _k6bStrahl(ctx, B);
  _bioFxDraw(ctx, z.fx.teile);                        // Lichtring
  _k6bTafelPunkt(ctx);
  if (z.pause) _k6bPauseSchild(ctx);
}
