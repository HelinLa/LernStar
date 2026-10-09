
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mr1 „Darf man die Zahlen tauschen?“
// (Kennung m5-tauschen, Praefix _m6a)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL5_PROFIL.md, Abschnitt m5-tauschen
// (Einheit mr1; Regeln N1–N3, Lehrkraft-Zeile). Ueberschrift „Was passiert
// beim Tauschen?“ – die Frage der Einheit nennt Personen (Regel 11).
//
// Was man sieht: ein heller Tisch mit Karo. Darauf, je nach Aufgabe:
//   PLUS   zwei Gruppen Plaettchen nebeneinander, dazwischen ein „+“. Die
//          erste Zahl blau, die zweite orange. Jede Gruppe liegt in
//          Zehnerstreifen (ein heller Streifen mit 10 Plaetzen, nach dem 5.
//          Platz ein Kaestchen frei): 6 + 25 = links ein Streifen „5 und 1“
//          blau, rechts drei Streifen „10, 10, 5“ orange. Die Gruppen liegen
//          oben buendig, das „+“ steht auf Hoehe der ersten Streifen.
//   MAL    ein Punktefeld aus blauen Plaettchen: Reihen gleich vieler
//          Plaettchen, nach dem 5. Plaettchen ein Kaestchen frei, nach der 5.
//          Reihe eine Kaestchenzeile frei; rechts je Reihe eine Klammer „]“
//          mit der Anzahl je Reihe (blau).
//   MINUS  die erste Zahl als blaue Plaettchen in Zehnerstreifen; was
//          weggenommen wird, bekommt einen orangen Ring und fliegt hinaus.
//          Was fehlt, steht als gestrichelter oranger Platz da.
// Darunter zwei Rechenzeilen mit kleiner grauer Beschriftung links:
//   „Aufgabe“        6 + 25 = 31
//   „Tauschaufgabe“  25 + 6 = 31   (erst, wenn getauscht wurde)
// und ganz unten, immer sichtbar, der Zaehler „Plättchen auf dem Tisch: 31“
// (bei Minus mit Luecke: „Plättchen auf dem Tisch: 0, es fehlen noch 5“,
// der zweite Teil orange). Die Zeile, die zum Bild passt, ist kraeftig, die
// andere blass.
// Farben verbinden Bild und Zeichen: Plus – die Farbe gehoert zur Zahl (6 ist
// immer blau, 25 immer orange, auch nach dem Tauschen); Mal – „je Reihe“ ist
// blau (Klammerzahl und zweiter Faktor); Minus – was liegt, ist blau, was
// weggenommen wird oder fehlt, orange.
//
// Bewegung (jede Handlung bewegt sich; Statuszeilen und Rechenzeilen wechseln
// erst, wenn die Bewegung angekommen ist; der Zaehler zaehlt, was gerade
// wirklich auf dem Tisch liegt):
//   „tauschen“ bei Plus: die beiden Gruppen tauschen im Bogen die Plaetze
//          (0,8 s): wer nach rechts geht, geht oben herum, wer nach links geht,
//          unten herum; das „+“ blendet aus, solange sie darueber hinweggehen.
//          Alle Plaettchen bleiben. Beim ersten Tauschen blendet im selben
//          Takt die Zeile „Tauschaufgabe“ ein (Zahlen in den Farben des
//          Bildes); „=“ und Ergebnis springen auf, wenn das Bild angekommen ist.
//   „tauschen“ bei Mal: das ganze Feld dreht sich um 90° um seine Mitte
//          (0,9 s, die Klammern blenden aus; ein grosses Feld wie 10 · 10
//          wird dabei kurz kleiner, damit seine Ecken im Bild und ueber den
//          Rechenzeilen bleiben), dann gleiten die Plaettchen in
//          die neue Reihenordnung mit Fuenferluecke (0,4 s), die Klammern
//          kommen mit der neuen Anzahl je Reihe wieder. Zurueck dreht es sich
//          andersherum. Der Zaehler aendert sich nicht.
//   „tauschen“ bei Minus: was liegt, blendet aus; die erste Zahl der
//          Tauschaufgabe faellt als Plaettchen ein (4), dann bekommen sie den
//          orangen Ring und fliegen hinaus; reicht es nicht, erscheinen die
//          fehlenden (5) als gestrichelte Plaetze und blinken zweimal orange.
//          Die gestrichelten Plaetze sind die Plaetze 5 bis 9 des Streifens:
//          9 Plaetze werden gebraucht, 4 waren da.
//   Sprungmarke (spielt selbst ab, N1): das alte Bild blendet aus (0,15 s),
//          die Aufgabe baut sich auf – Plaettchen fallen gruppenweise ein
//          (Plus: erst die blaue Gruppe, dann die orange; Mal: Reihe fuer
//          Reihe; Minus: Fuenfer fuer Fuenfer) –, bei Minus wird weggenommen,
//          das Ergebnis springt in die Zeile „Aufgabe“; 1 s Pause; dann wird
//          getauscht wie oben, und das Ergebnis der Tauschaufgabe springt auf.
//          Gemessen (Frames zu 16 ms, Tempo normal):
//            „6 + 25“ 155 Frames (2,48 s) · „3 · 8“ 174 Frames (2,78 s) ·
//            „9 · 2“ 185 Frames (2,96 s) · „9 − 4“ 177 Frames (2,83 s);
//            „tauschen“ allein: Plus 50, Mal 82, Minus hin (4 − 9) 60,
//            zurueck (9 − 4) 46 Frames.
//          Das Ergebnis der Aufgabe steht nach Frame 42 / 30 / 41 / 55, der
//          Halt (wenn an) greift nach 105 / 92 / 104 / 117 Frames.
//          simfakten.js mit --frames=25 --verlauf=8 liest bis Frame 225.
//   „erste Zahl + 1“ / „zweite Zahl + 1“ (frei probieren): ist getauscht,
//          tauscht es zuerst zurueck (wie oben), dann kommt EINS dazu: Plus –
//          ein Plaettchen faellt in seine Gruppe (ein neuer Streifen blendet
//          ein, wenn einer voll ist); Mal – eine Reihe gleitet von rechts
//          herein bzw. in jede Reihe springt ein Plaettchen (die Klammern
//          ruecken vorher zur Seite); Minus – ein Plaettchen faellt dazu bzw.
//          eins mehr fliegt hinaus (reicht es nicht: ein Platz mehr fehlt).
//          Danach ist es eine NEUE Aufgabe, noch nicht getauscht.
//   „neu“  sofort der Start 6 + 25, das Bild blendet ein (0,35 s).
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort ankommen;
// dann geschieht das Neue. Ausnahme, damit niemand doppelt tauscht: „tauschen“
// waehrend eine Sprungmarke noch VOR dem Tauschen ist, laesst den Aufbau
// ankommen und tauscht sofort (das Tauschen der Sprungmarke entfaellt dann).
// Jede Knopffolge endet so in denselben Zahlen.
// Grenzen: Plus je Zahl bis 40, Mal bis 10 Reihen zu je 10, Minus je Zahl bis
// 20. Darueber wackelt das Bild, und _m6a-grenze sagt „Mehr passt nicht auf
// den Tisch.“ (bis zur naechsten Handlung; sonst ausgeblendet).
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6aMarke('6p25') …):
//     „6 + 25“ · „3 · 8“ · „9 · 2“ · „9 − 4“ – der Knopf der geladenen Aufgabe
//     ist hervorgehoben.
//   Reihe 2: „tauschen“ (_m6aTauschen(); noch einmal = zurueck) ·
//     „erste Zahl + 1“ (_m6aPlusEins('a')) · „zweite Zahl + 1“
//     (_m6aPlusEins('b')) · „neu“ (_m6aNeu()).
//
// Statuszeilen (woertlich aus dem Bauplan, jede mit mehr als 18 Zeichen):
//   _m6a-aufgabe          „Aufgabe: 6 + 25 (6 Plättchen und 25 Plättchen)“ /
//                         „Aufgabe: 3 · 8 (3 Reihen zu je 8)“ /
//                         „Aufgabe: 9 − 4 (von 9 Plättchen 4 weg)“
//   _m6a-ergebnis         „Ergebnis der Aufgabe: 31“ (waehrend des Aufbaus
//                         „Ergebnis der Aufgabe: noch keins“; reicht es bei
//                         Minus nicht: „… reicht nicht“)
//   _m6a-tausch           vor dem Tauschen „Tauschaufgabe: noch nicht
//                         getauscht“, danach „Tauschaufgabe: 25 + 6 (25
//                         Plättchen und 6 Plättchen)“ / „Tauschaufgabe: 8 · 3
//                         (8 Reihen zu je 3)“ / „Tauschaufgabe: 4 − 9 (von 4
//                         Plättchen 9 weg)“. Zurueckgetauscht bleibt sie
//                         stehen; eine neue Aufgabe setzt sie zurueck.
//   _m6a-tausch-ergebnis  „Ergebnis der Tauschaufgabe: 31“ bzw. „… reicht
//                         nicht“ (vorher „… noch keins“)
//   _m6a-tisch            „Plättchen auf dem Tisch: 31“; Minus nach der
//                         Aufgabe „… 5“, nach dem Tauschen „Plättchen auf dem
//                         Tisch: 0, es fehlen noch 5“
//   _m6a-grenze           nur an der Grenze (siehe oben)
//   _m6a-lehrkraft        Hinweis fuer die Lehrkraft (siehe unten)
// Zwischen Zahl und Rechenzeichen steht ein geschuetztes Leerzeichen (U+00A0).
//
// Werte (nachgerechnet mit simcheck/werte.js):
//   6 + 25 → 31 / 25 + 6 → 31, Tisch 31 · 3 · 8 → 24 / 8 · 3 → 24, Tisch 24 ·
//   9 · 2 → 18 / 2 · 9 → 18, Tisch 18 · 9 − 4 → 5 / 4 − 9 → reicht nicht,
//   Tisch 0, es fehlen noch 5 · frei: „3 · 8“, dann „erste Zahl + 1“ →
//   4 · 8 = 32, „tauschen“ → 8 · 4 = 32.
// Start: 6 + 25 geladen und gerechnet, nicht getauscht („Start: 6 + 25, noch
// nicht getauscht“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): wenn sich das Feld 3 · 8 in
// 8 · 3 gedreht hat (Sprungmarke „3 · 8“ oder „tauschen“) – ein Lichtring
// breitet sich ueber das gedrehte Feld aus, ein ruhig pulsierender Rahmen
// liegt 2,6 s darum, und der Zaehler unten ist so lange hell hinterlegt: Er
// steht weiter bei 24. Das widerlegt „mehr Reihen sind mehr“.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-rest; Container <div class="fpm-lehrkraft">,
// den simfakten.js ueberspringt). Eigene Zeile unter den Heftknoepfen, davor
// klein „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6aAnhalten()): friert jede Bewegung sofort ein;
//     Schild „Pause“ oben links im Bild (Stelle wie in m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6aTempo()): ein Drittel so schnell.
//   „Halt vor dem Tauschen: aus“ ↔ „… an“ (_m6aHaltSchalter()): eine
//     Sprungmarke haelt von selbst an, wenn die Aufgabe gerechnet ist und
//     BEVOR getauscht wird – zum Vermuten an der Tafel. Um das Bild liegt ein
//     gestrichelter bernsteinfarbener Rahmen; „weiter“ tauscht.
//   Nur das wechselnde Wort steht in einem eigenen <span>.
// Hinweiszeile _m6a-lehrkraft (in der Pause „lmp-status off“, sonst „on“):
//   sonst  „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal, Halt vor dem Tauschen: aus.“
//   Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. Tempo: …“
//   Halt   „Halt vor dem Tauschen. Erst vermuten lassen. Dann „weiter“.“
// So ist es gebaut: EIN Zeitfaktor (_m6aZeitfaktor: 0 Pause, 1/3 langsam,
// 1 normal) an der einen Stelle, an der dt in _m6aUpdate hineingeht; ohne Zeit
// kein Schritt im Ablauf. Der Halt ist ein EREIGNIS im Ablauf (Ende der
// Wartezeit), keine Zeitmessung. In der Pause bewegt kein Knopf etwas: Steht
// eine Bewegung, entfaellt der Druck; steht keine, wird er VORGEMERKT und
// beginnt mit „weiter“ (das Schild „Pause“ leuchtet kurz auf). Sprungmarke und
// „neu“ heben die Pause auf; Tempo und Halt bleiben stehen.
//
// Alles ist eine Funktion des Ablaufs: Ein Lauf ist eine Liste von Phasen
// (alt, bau, weg, warte, tplus/tdreh/tgleit/tlegen/tweg, dazu…) mit festen
// Dauern; _m6aSzene() baut daraus das Bild, _m6aStand() zaehlt aus genau
// diesem Bild die Plaettchen – Bild und Zaehler koennen nicht auseinanderlaufen.
// Keine Zufallszahl.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Summand“, „Summanden“,
// „Minus“ als Wort (das Zeichen − steht da), „gleich“, „dasselbe“, „nicht
// erlaubt“, „ändert nicht“, die Regel als Satz. Keine Namen, keine Punkte,
// keine Zeit, kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m6a = null;
const _m6aMARKEN = { '6p25': ['plus', 6, 25], '3m8': ['mal', 3, 8], '9m2': ['mal', 9, 2], '9d4': ['minus', 9, 4] };
const _m6aREIHE = ['6p25', '3m8', '9m2', '9d4'];
const _m6aZEICHEN = { plus: '+', mal: '·', minus: '−' };
const _m6aNB = ' ';
const _m6aK = {
  KA: 14, RP: 5.5, CY: 88,          // Kaestchen (px), Radius eines Plaettchens, Mitte des Bildfelds
  SB: 160, SH: 16, SP: 18,          // Zehnerstreifen: Breite, Hoehe, Abstand von Streifen zu Streifen
  XL: 28, XR: 232, YP: 58, ZX: 210, // Plus: linker/rechter Platz, oberer Rand, Plus-Zeichen
  BO: 40, BU: 34,                   // Plus: Bogen oben / unten beim Tauschen
  XM: 130, YM: 76,                  // Minus: Streifen
  CXM: 197,                         // Mal: Mitte des Felds (die Klammern stehen rechts daneben)
  DREH_H: 160, DREH_B: 370,         // Mal: so hoch/breit darf das Feld beim Drehen hoechstens werden
  L1: 193, L2: 219, LZ: 241,        // Grundlinien: Aufgabe, Tauschaufgabe, Zaehler
  EX: 228, LX: 14,                  // Mitte der Rechenzeilen, Beschriftung links
  GL: 20, GR: 15, GZ: 12, GB: 11,   // Schriftgrade: Rechnung, „reicht nicht“, Zaehler, Beschriftung
  PX0: 4, PX1: 416, PY0: 4, PY1: 246,
  MAX: { plus: 40, mal: 10, minus: 20 },
  T_ALT: 0.15, T_EIN: 0.35, T_FALL: 0.2, BAU_B: 0.22, BAU_S: 0.05, BAU_F: 0.07,
  T_WARTE: 1.0, T_TPLUS: 0.8, T_DREH: 0.9, T_GLEIT: 0.4, T_LEGEN: 0.25,
  T_WEG: 0.45, T_FEHL: 0.25, T_POP: 0.3, T_BLINK: 0.8, T_AHA: 2.6, LANGSAM: 1 / 3,
  // Farben: Plaettchen (Fuellung, Rand), Schrift
  P_BLAU: '#3b82f6', R_BLAU: '#1d4ed8', P_ORANGE: '#fb923c', R_ORANGE: '#c2410c',
  T_BLAU: '#1d4ed8', T_ORANGE: '#c2410c', F_TEXT: '#111827', F_GRAU: '#64748b',
  F_KARO: '#d4e3f1', F_KLAMMER: '#64748b', F_AMBER: '#f59e0b'
};

// ── Rechnen und Texte ───────────────────────────────────────────────────
function _m6aRechne(op, x, y) { return op === 'plus' ? x + y : op === 'mal' ? x * y : x - y; }
function _m6aReicht(op, x, y) { return op !== 'minus' || x >= y; }
function _m6aErg(op, x, y) { return _m6aReicht(op, x, y) ? String(_m6aRechne(op, x, y)) : 'reicht nicht'; }
function _m6aLang(op, x, y) {
  if (op === 'plus') return '(' + x + ' Plättchen und ' + y + ' Plättchen)';
  if (op === 'mal') return '(' + x + ' Reihen zu je ' + y + ')';
  return '(von ' + x + ' Plättchen ' + y + ' weg)';
}
// Farbe einer Zahl in der Rechnung: Plus nach der Zahl, Mal und Minus nach der Stelle.
function _m6aZahlFarbe(op, stelle, istA) {
  const K = _m6aK;
  if (op === 'plus') return istA ? K.T_BLAU : K.T_ORANGE;
  if (op === 'mal') return stelle === 0 ? K.F_TEXT : K.T_BLAU;
  return stelle === 0 ? K.T_BLAU : K.T_ORANGE;
}
// „6 + 25 (6 Plättchen und 25 Plättchen)“, Zahlen farbig; zuerstA: steht a vorn?
function _m6aAufgabeHTML(op, x, y, zuerstA) {
  const f = (n, stelle, istA) => '<b style="color:' + _m6aZahlFarbe(op, stelle, istA) + '">' + n + '</b>';
  return f(x, 0, zuerstA) + _m6aNB + _m6aZEICHEN[op] + _m6aNB + f(y, 1, !zuerstA) + ' ' + _m6aLang(op, x, y);
}

function _m6aInit() {
  _m6a = { op: 'plus', a: 6, b: 25, g: false, gesehen: false, lauf: null, t: 0,
           ein: _m6aK.T_EIN, pop1: 0, pop2: 0, wackel: 0, aha: 0, blinkFehl: 0, grenze: '',
           fx: { teile: [] }, cache: {},
           pause: false, langsam: false, haltAn: false, halt: false, blink: 0, vormerk: null };   // Lehrkraft
}
function _m6aHTML() {
  const marke = k => {
    const [op, a, b] = _m6aMARKEN[k];
    return `<button class="sim-btn" id="_m6a-b-${k}" onclick="_m6aMarke('${k}')">${a}&nbsp;${_m6aZEICHEN[op]}&nbsp;${b}</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was passiert beim Tauschen?</h3>
    <div class="fpm-note" style="margin-top:2px">„tauschen“ tauscht die beiden Zahlen. Bei Mal dreht sich das Feld.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6a-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6aREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_m6aTauschen()">tauschen</button>
          <button class="sim-btn" onclick="_m6aPlusEins('a')">erste Zahl +&nbsp;1</button>
          <button class="sim-btn" onclick="_m6aPlusEins('b')">zweite Zahl +&nbsp;1</button>
          <button class="sim-btn" onclick="_m6aNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6a-pause" onclick="_m6aAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6a-tempo" onclick="_m6aTempo()">Tempo: <span id="_m6a-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6a-halt" onclick="_m6aHaltSchalter()">Halt vor dem Tauschen: <span id="_m6a-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6a-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6a-aufgabe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6a-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6a-tausch" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6a-tausch-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6a-tisch" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_m6a-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 6 + 25, noch nicht getauscht</p>
  </div>`;
}
// Setzt nur, was sich geaendert hat (_m6aStatus laeuft in jedem Bild).
function _m6aSetze(id, html) {
  const e = document.getElementById(id), c = _m6a && _m6a.cache;
  if (e && (!c || c[id] !== html)) { e.innerHTML = html; if (c) c[id] = html; }
  return e;
}
function _m6aStatus() {
  if (!_m6a) return;
  const z = _m6a, K = _m6aK, st = _m6aStand();
  const op = st.op, a = st.a, b = st.b;
  _m6aSetze('_m6a-aufgabe', 'Aufgabe: ' + _m6aAufgabeHTML(op, a, b, true));
  _m6aSetze('_m6a-ergebnis', 'Ergebnis der Aufgabe: ' + (st.erg1 ? _m6aErg(op, a, b) : 'noch keins'));
  _m6aSetze('_m6a-tausch', 'Tauschaufgabe: ' + (st.gesehen ? _m6aAufgabeHTML(op, b, a, false) : 'noch nicht getauscht'));
  _m6aSetze('_m6a-tausch-ergebnis', 'Ergebnis der Tauschaufgabe: ' + (st.gesehen ? _m6aErg(op, b, a) : 'noch keins'));
  _m6aSetze('_m6a-tisch', 'Plättchen auf dem Tisch: ' + st.tisch +
            (st.fehlen ? ', <b style="color:' + K.T_ORANGE + '">es fehlen noch ' + st.fehlen + '</b>' : ''));
  const g = _m6aSetze('_m6a-grenze', z.grenze);
  if (g && g.style) g.style.display = z.grenze ? '' : 'none';
  for (const k of _m6aREIHE) {
    const m = _m6aMARKEN[k], bt = document.getElementById('_m6a-b-' + k);
    if (bt && bt.classList) bt.classList.toggle('primary', m[0] === op && m[1] === a && m[2] === b);
  }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6aSetze('_m6a-pause', z.pause ? 'weiter' : 'Pause');
  _m6aSetze('_m6a-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6aSetze('_m6a-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _m6aSetze('_m6a-lehrkraft', _m6aHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6a-pause', z.pause], ['_m6a-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6aHinweis() {
  const z = _m6a;
  if (z.halt) return 'Halt vor dem Tauschen. Erst vermuten lassen. Dann „weiter“.';
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt vor dem Tauschen: ' + (z.haltAn ? 'an' : 'aus') + '.';
}

// ── Ablauf: Phasen mit festen Dauern ────────────────────────────────────
function _m6aLauf(art, phasen, ziel) {
  let t = 0;
  for (const P of phasen) { P.t0 = t; t += P.dur; P.t1 = t; }
  return { art, phasen, ziel, at: 0, done: 0, ende: t, haltVorbei: false, erg1Bei: 0, tauschAb: t };
}
function _m6aStreifen(n) { return Math.max(1, Math.ceil(n / 10)); }
// Dauer des Aufbaus einer Aufgabe
function _m6aBauDauer(op, a, b) {
  const K = _m6aK;
  if (op === 'plus') return Math.max(K.BAU_S * (_m6aStreifen(a) - 1), K.BAU_B + K.BAU_S * (_m6aStreifen(b) - 1)) + K.T_FALL;
  if (op === 'mal') return (a - 1) * _m6aReihenTakt(a) + K.T_FALL;
  return (Math.max(1, Math.ceil(a / 5)) - 1) * K.BAU_F + K.T_FALL;
}
function _m6aReihenTakt(R) { return R > 1 ? Math.min(0.06, 0.3 / (R - 1)) : 0; }
function _m6aLegenDauer(x) { return Math.max(_m6aK.T_LEGEN, 0.08 + (Math.max(1, Math.ceil(x / 5)) - 1) * 0.05 + 0.15); }
function _m6aWegDauer(x, y) { return _m6aK.T_WEG + (y > x ? _m6aK.T_FEHL : 0); }
// Die Phasen eines Tauschs der Aufgabe (op, a, b): nachG true = hin zur Tauschaufgabe
function _m6aTauschPhasen(op, a, b, nachG) {
  const K = _m6aK, v = nachG ? 0 : 1, n = nachG ? 1 : 0, sp = (p, q) => ({ sp0: v + (n - v) * p, sp1: v + (n - v) * q });
  let ph;
  if (op === 'plus') ph = [Object.assign({ typ: 'tplus', a, b, nachG, dur: K.T_TPLUS }, sp(0, 1))];
  else if (op === 'mal') {
    const R = nachG ? a : b, C = nachG ? b : a, dir = nachG ? 1 : -1;
    ph = [Object.assign({ typ: 'tdreh', R, C, dir, dur: K.T_DREH }, sp(0, 0.7)),
          Object.assign({ typ: 'tgleit', R, C, dir, dur: K.T_GLEIT }, sp(0.7, 1))];
  } else {
    const xo = nachG ? a : b, yo = nachG ? b : a, x = nachG ? b : a, y = nachG ? a : b;
    ph = [Object.assign({ typ: 'tlegen', xo, yo, x, y, dur: _m6aLegenDauer(x) }, sp(0, 0.4)),
          Object.assign({ typ: 'tweg', x, y, dur: _m6aWegDauer(x, y) }, sp(0.4, 1))];
  }
  ph[ph.length - 1].tauschEnde = true;
  ph[ph.length - 1].nachG = nachG;
  return ph;
}
// Sprungmarke: alt → bau → (weg) → warte → tauschen
function _m6aSpielLauf(op, a, b) {
  const z = _m6a, K = _m6aK, ruhe = { sp0: 0, sp1: 0 };
  const ph = [Object.assign({ typ: 'alt', op: z.op, a: z.a, b: z.b, g: z.g, dur: K.T_ALT }, ruhe),
              Object.assign({ typ: 'bau', op, a, b, dur: _m6aBauDauer(op, a, b) }, ruhe)];
  if (op === 'minus') ph.push(Object.assign({ typ: 'weg', x: a, y: b, dur: _m6aWegDauer(a, b) }, ruhe));
  ph[ph.length - 1].erg1 = true;
  ph.push(Object.assign({ typ: 'warte', op, a, b, dur: K.T_WARTE, haltPunkt: true }, ruhe));
  const tp = _m6aTauschPhasen(op, a, b, true);
  const L = _m6aLauf('spiel', ph.concat(tp), { op, a, b, g: true, gesehen: true });
  L.erg1Bei = ph[ph.length - 2].t1;
  L.tauschAb = tp[0].t0;
  return L;
}
// Die Phase, die gerade laeuft (am Ende: die letzte)
function _m6aPhase(L) {
  for (const P of L.phasen) if (L.at < P.t1 - 1e-9) return P;
  return L.phasen[L.phasen.length - 1];
}
// Ereignisse am Ende einer Phase
function _m6aPhaseEnde(P, sofort) {
  const z = _m6a, K = _m6aK;
  if (P.erg1) z.pop1 = K.T_POP;
  if (P.tauschEnde && P.nachG) z.pop2 = K.T_POP;
  if ((P.typ === 'weg' || P.typ === 'tweg') && P.y > P.x) z.blinkFehl = K.T_BLINK;
  if (P.typ === 'dazuMinB' && P.a <= P.b) z.blinkFehl = K.T_BLINK;
  if (!sofort && P.typ === 'tgleit' && P.dir === 1 && P.R === 3 && P.C === 8) {
    // Aha: das Feld hat sich gedreht, der Zaehler steht weiter bei 24
    z.aha = K.T_AHA;
    _bioFxWelle(z.fx.teile, K.CXM, K.CY, K.F_AMBER, 110);
  }
}
// Alle faelligen Phasenenden abarbeiten; am Ende landen. Der Halt steht am Ende von „warte“.
function _m6aEreignisse(L, sofort) {
  const z = _m6a;
  while (z.lauf === L && L.done < L.phasen.length && L.at >= L.phasen[L.done].t1 - 1e-9) {
    const P = L.phasen[L.done];
    L.done++;
    _m6aPhaseEnde(P, sofort);
    if (P.haltPunkt && z.haltAn && !L.haltVorbei && !sofort) {
      L.haltVorbei = true; L.at = P.t1;
      z.pause = true; z.halt = true;
      return;
    }
  }
  if (z.lauf === L && L.done >= L.phasen.length) _m6aLanden(L);
}
function _m6aLanden(L) {
  const z = _m6a, Z = L.ziel;
  z.op = Z.op; z.a = Z.a; z.b = Z.b; z.g = Z.g; z.gesehen = Z.gesehen;
  z.lauf = null;
  if (L.art === 'dazu') z.pop1 = _m6aK.T_POP;
}
// Die laufende Bewegung sofort ankommen lassen (ohne Halt, ohne Lichtring)
function _m6aFertig() {
  const z = _m6a, L = z && z.lauf;
  if (!L) return;
  L.haltVorbei = true; L.at = L.ende;
  z.halt = false;
  _m6aEreignisse(L, true);
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6aMarke(k) {
  if (!_m6a || !_m6aMARKEN[k]) return;
  const z = _m6a;
  _m6aFertig();
  z.pause = false; z.halt = false; z.vormerk = null; z.blink = 0;
  z.grenze = ''; z.wackel = 0; z.ein = 0; z.aha = 0; z.blinkFehl = 0; z.pop1 = 0; z.pop2 = 0;
  z.fx.teile.length = 0;
  const [op, a, b] = _m6aMARKEN[k];
  z.lauf = _m6aSpielLauf(op, a, b);
  _m6aStatus();
}
function _m6aNeu() {
  if (!_m6a) return;
  const z = _m6a;
  z.lauf = null; z.pause = false; z.halt = false; z.vormerk = null; z.blink = 0;
  z.op = 'plus'; z.a = 6; z.b = 25; z.g = false; z.gesehen = false;
  z.grenze = ''; z.wackel = 0; z.aha = 0; z.blinkFehl = 0; z.pop1 = 0; z.pop2 = 0;
  z.ein = _m6aK.T_EIN; z.fx.teile.length = 0;
  _m6aStatus();
}
// Waehrend der Pause: vormerken, wenn nichts unterwegs ist; sonst entfaellt der Druck.
function _m6aInDerPause(tat) {
  const z = _m6a;
  z.blink = 0.6;
  if (!z.lauf) z.vormerk = tat;
}
function _m6aTauschen() {
  if (!_m6a) return;
  const z = _m6a;
  if (z.pause) { _m6aInDerPause(() => _m6aTauschen()); return; }
  z.grenze = ''; z.ein = 0;
  const L = z.lauf;
  if (L && L.art === 'spiel' && L.at < L.tauschAb - 1e-9) {
    // Die Sprungmarke ist noch vor dem Tauschen: Aufbau ankommen lassen, jetzt tauschen.
    L.haltVorbei = true; L.at = L.tauschAb;
    _m6aEreignisse(L, true);
    _m6aStatus();
    return;
  }
  _m6aFertig();
  z.aha = 0;
  z.lauf = _m6aLauf('tausch', _m6aTauschPhasen(z.op, z.a, z.b, !z.g),
                    { op: z.op, a: z.a, b: z.b, g: !z.g, gesehen: true });
  _m6aStatus();
}
// „erste Zahl + 1“ (wer 'a') / „zweite Zahl + 1“ (wer 'b')
function _m6aPlusEins(wer) {
  if (!_m6a || (wer !== 'a' && wer !== 'b')) return;
  const z = _m6a, K = _m6aK;
  if (z.pause) { _m6aInDerPause(() => _m6aPlusEins(wer)); return; }
  _m6aFertig();
  z.grenze = ''; z.ein = 0; z.aha = 0;
  const n = wer === 'a' ? z.a : z.b;
  if (n >= K.MAX[z.op]) {
    z.wackel = 0.45; z.grenze = 'Mehr passt nicht auf den Tisch.';
    _m6aStatus(); return;
  }
  const op = z.op, a = z.a, b = z.b;
  const ph = z.g ? _m6aTauschPhasen(op, a, b, false) : [];
  let P;
  if (op === 'plus') P = { typ: 'dazuPlus', a, b, wer, dur: 0.5 };
  else if (op === 'mal') P = wer === 'a' ? { typ: 'dazuReihe', R: a, C: b, dur: 0.6 }
                                         : { typ: 'dazuJe', R: a, C: b, dur: 0.5 + 0.02 * (a - 1) };
  else P = wer === 'a' ? { typ: 'dazuMinA', a, b, dur: a >= b ? 0.45 : 0.6 }
                       : { typ: 'dazuMinB', a, b, dur: a > b ? 0.45 : 0.3 };
  P.sp0 = 0; P.sp1 = 0;
  ph.push(P);
  z.lauf = _m6aLauf('dazu', ph, { op, a: a + (wer === 'a' ? 1 : 0), b: b + (wer === 'b' ? 1 : 0), g: false, gesehen: false });
  _m6aStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
// „Pause“ ↔ „weiter“: Beim Weitermachen laeuft alles genau dort weiter, wo es
// stand (nach einem Halt: das Tauschen); ein vorgemerkter Knopf wirkt jetzt.
function _m6aAnhalten() {
  if (!_m6a) return;
  const z = _m6a;
  if (z.pause) {
    z.pause = false; z.halt = false; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v && !z.lauf) { v(); return; }
  } else z.pause = true;
  _m6aStatus();
}
function _m6aTempo() {
  if (!_m6a) return;
  _m6a.langsam = !_m6a.langsam;
  _m6aStatus();
}
function _m6aHaltSchalter() {
  if (!_m6a) return;
  _m6a.haltAn = !_m6a.haltAn;
  _m6aStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6aZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6aK.LANGSAM : 1; }

function _m6aUpdate(dt) {
  if (!_m6a) return;
  const z = _m6a;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);               // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6aZeitfaktor(z);                       // ab hier Sim-Zeit
  z.t += dt;
  for (const k of ['ein', 'pop1', 'pop2', 'wackel', 'aha', 'blinkFehl']) z[k] = Math.max(0, z[k] - dt);
  const L = z.lauf;
  if (L && dt > 0) {                                  // ohne Zeit kein Schritt im Ablauf
    L.at = Math.min(L.ende, L.at + dt);
    _m6aEreignisse(L, false);
  }
  _bioFxUpdate(z.fx.teile, dt);
  _m6aStatus();                                       // setzt nur, was sich geaendert hat
}

// ── Das Bild als Liste: Streifen, Plaettchen, fehlende Plaetze, Klammern ─
// Ein Plaettchen: {x, y, f ('b'|'o'), a (Deckkraft), s (Groesse), ring (orange), z (liegt auf dem Tisch)}
function _m6aLeer() { return { streifen: [], pl: [], fehlt: [], klammern: [], plus: null }; }
// Platz k (0 …) in Zehnerstreifen ab (x0, y0): nach dem 5. Platz ein Kaestchen frei
function _m6aOrt(x0, y0, k) {
  const K = _m6aK, r = Math.floor(k / 10), j = k % 10;
  return { x: x0 + 3 + (j + (j >= 5 ? 1 : 0) + 0.5) * K.KA, y: y0 + r * K.SP + K.SH / 2 };
}
function _m6aPl(S, o, f, a, z, extra) {
  S.pl.push(Object.assign({ x: o.x, y: o.y, f, a, s: 1, ring: 0, z }, extra || {}));
}
// Eine Plus-Gruppe: n Plaettchen der Farbe f in Streifen ab x0, verschoben um (dx, dy)
function _m6aGruppe(S, n, f, x0, dx, dy, a, z) {
  const K = _m6aK;
  for (let r = 0; r < _m6aStreifen(n); r++) S.streifen.push({ x: x0 + dx, y: K.YP + r * K.SP + dy, f, a });
  for (let k = 0; k < n; k++) {
    const o = _m6aOrt(x0, K.YP, k);
    _m6aPl(S, { x: o.x + dx, y: o.y + dy }, f, a, z);
  }
}
// Mal: Feld aus R Reihen zu je C, Mitte (CXM, CY); nach 5 Plaettchen bzw. 5 Reihen ein Kaestchen frei
function _m6aFeld(R, C) {
  const K = _m6aK, W = (C + (C > 5 ? 1 : 0)) * K.KA, H = (R + (R > 5 ? 1 : 0)) * K.KA;
  return { X0: K.CXM - W / 2, Y0: K.CY - H / 2, W, H, R, C };
}
function _m6aFeldOrt(F, i, j) {
  const K = _m6aK;
  return { x: F.X0 + (j + (j >= 5 ? 1 : 0) + 0.5) * K.KA, y: F.Y0 + (i + (i >= 5 ? 1 : 0) + 0.5) * K.KA };
}
function _m6aKlammerX(F) { return F.X0 + F.W + 3; }
function _m6aFeldSzene(S, R, C, a, z) {
  const F = _m6aFeld(R, C);
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) _m6aPl(S, _m6aFeldOrt(F, i, j), 'b', a, z);
    S.klammern.push({ x: _m6aKlammerX(F), y: _m6aFeldOrt(F, i, 0).y, n: C, a });
  }
}
// Minus: gezeigt wird „x − y“ nach dem Wegnehmen
function _m6aMinusStreifen(S, n, a) {
  const K = _m6aK;
  for (let r = 0; r < _m6aStreifen(n); r++) S.streifen.push({ x: K.XM, y: K.YM + r * K.SP, f: 'b', a: Array.isArray(a) ? a[r] : a });
}
function _m6aMinusSzene(S, x, y, a, z, ohneStreifen) {
  const K = _m6aK;
  if (!ohneStreifen) _m6aMinusStreifen(S, Math.max(x, y), a);
  for (let k = 0; k < Math.max(0, x - y); k++) _m6aPl(S, _m6aOrt(K.XM, K.YM, k), 'b', a, z);
  for (let k = x; k < y; k++) { const o = _m6aOrt(K.XM, K.YM, k); S.fehlt.push({ x: o.x, y: o.y, a, z }); }
}
function _m6aRuhe(S, op, a, b, g, alpha, z) {
  const K = _m6aK;
  if (z === undefined) z = alpha >= 0.5;
  if (op === 'plus') {
    _m6aGruppe(S, a, 'b', g ? K.XR : K.XL, 0, 0, alpha, z);
    _m6aGruppe(S, b, 'o', g ? K.XL : K.XR, 0, 0, alpha, z);
    S.plus = { x: K.ZX, y: K.YP + K.SH / 2, a: alpha };
  } else if (op === 'mal') _m6aFeldSzene(S, g ? b : a, g ? a : b, alpha, z);
  else _m6aMinusSzene(S, g ? b : a, g ? a : b, alpha, z);
  return S;
}
// Wegnehmen: x Plaettchen liegen auf den Plaetzen 0 … x−1, y werden genommen.
// Die letzten min(x, y) bekommen einen orangen Ring und fliegen hinaus (das
// letzte zuerst); reicht es nicht, erscheinen die Plaetze x … y−1 gestrichelt.
function _m6aWegSzene(S, x, y, tau) {
  const K = _m6aK, E = _bioFxEase, kl = _bioFxKlemme;
  const k = Math.min(x, y), stag = k > 1 ? Math.min(0.03, 0.06 / (k - 1)) : 0;
  const nsx = _m6aStreifen(x), af = kl((tau - K.T_WEG) / K.T_FEHL);
  const al = [];
  for (let r = 0; r < _m6aStreifen(Math.max(x, y)); r++) al.push(r < nsx ? 1 : af);
  _m6aMinusStreifen(S, Math.max(x, y), al);
  for (let p = 0; p < x; p++) {
    const o = _m6aOrt(K.XM, K.YM, p), m = x - 1 - p;
    if (m >= k) { _m6aPl(S, o, 'b', 1, true); continue; }
    const e = E.sanft(kl((tau - 0.12 - m * stag) / 0.25));
    _m6aPl(S, { x: o.x + 70 * e, y: o.y - 46 * e }, 'b', 1 - e, e < 0.5, { s: 1 - 0.3 * e, ring: kl(tau / 0.12) });
  }
  for (let p = x; p < y; p++) { const o = _m6aOrt(K.XM, K.YM, p); S.fehlt.push({ x: o.x, y: o.y, a: af, z: af >= 0.5 }); }
}
// Ein Plaettchen faellt auf seinen Platz: p 0..1
function _m6aFall(S, o, f, p, extra) {
  const E = _bioFxEase, kl = _bioFxKlemme;
  _m6aPl(S, { x: o.x, y: o.y - 14 * (1 - E.raus(p)) }, f, kl(p / 0.4), p >= 0.6, extra);
}

function _m6aPhaseSzene(S, P, tau) {
  const K = _m6aK, E = _bioFxEase, kl = _bioFxKlemme, u = P.dur > 0 ? kl(tau / P.dur) : 1;
  switch (P.typ) {
    case 'alt': return _m6aRuhe(S, P.op, P.a, P.b, P.g, 1 - u);
    case 'warte': return _m6aRuhe(S, P.op, P.a, P.b, false, 1);
    case 'bau': {
      if (P.op === 'plus') {
        const gruppe = (n, f, x0, start) => {
          for (let r = 0; r < _m6aStreifen(n); r++) {
            const p = kl((tau - start - r * K.BAU_S) / K.T_FALL), dy = -14 * (1 - E.raus(p));
            S.streifen.push({ x: x0, y: K.YP + r * K.SP + dy, f, a: kl(p / 0.4) });
            for (let q = 10 * r; q < Math.min(n, 10 * r + 10); q++) _m6aFall(S, _m6aOrt(x0, K.YP, q), f, p);
          }
        };
        gruppe(P.a, 'b', K.XL, 0);
        gruppe(P.b, 'o', K.XR, K.BAU_B);
        S.plus = { x: K.ZX, y: K.YP + K.SH / 2, a: kl(tau / 0.2) };
      } else if (P.op === 'mal') {
        const F = _m6aFeld(P.a, P.b), d = _m6aReihenTakt(P.a);
        for (let i = 0; i < P.a; i++) {
          const p = kl((tau - i * d) / K.T_FALL);
          for (let j = 0; j < P.b; j++) _m6aFall(S, _m6aFeldOrt(F, i, j), 'b', p);
          const o = _m6aFeldOrt(F, i, 0);
          S.klammern.push({ x: _m6aKlammerX(F), y: o.y - 14 * (1 - E.raus(p)), n: P.b, a: kl(p / 0.4) });
        }
      } else {
        _m6aMinusStreifen(S, Math.max(P.a, P.b), kl(tau / 0.15));
        for (let q = 0; q < P.a; q++) _m6aFall(S, _m6aOrt(K.XM, K.YM, q), 'b', kl((tau - Math.floor(q / 5) * K.BAU_F) / K.T_FALL));
      }
      return S;
    }
    case 'weg': case 'tweg': _m6aWegSzene(S, P.x, P.y, tau); return S;
    case 'tplus': {
      // wer nach rechts geht, geht oben herum; wer nach links geht, unten herum
      const e = E.sanft(u), bo = Math.sin(Math.PI * u);
      const vonA = P.nachG ? K.XL : K.XR, nachA = P.nachG ? K.XR : K.XL;
      _m6aGruppe(S, P.a, 'b', vonA, (nachA - vonA) * e, P.nachG ? -K.BO * bo : K.BU * bo, 1, true);
      _m6aGruppe(S, P.b, 'o', nachA, (vonA - nachA) * e, P.nachG ? K.BU * bo : -K.BO * bo, 1, true);
      S.plus = { x: K.ZX, y: K.YP + K.SH / 2, a: 1 - bo };   // die Gruppen gehen darueber hinweg
      return S;
    }
    case 'tdreh': {
      // Grosse Felder (bis 10 · 10) werden beim Drehen kurz kleiner, damit ihre
      // Ecken nicht aus dem Bild und nicht in die Rechenzeilen ragen.
      const F = _m6aFeld(P.R, P.C), th = P.dir * Math.PI / 2 * E.sanft(u), c = Math.cos(th), s = Math.sin(th);
      const bw = F.W * Math.abs(c) + F.H * Math.abs(s), bh = F.W * Math.abs(s) + F.H * Math.abs(c);
      const k = Math.min(1, K.DREH_H / bh, K.DREH_B / bw);
      for (let i = 0; i < P.R; i++) {
        for (let j = 0; j < P.C; j++) {
          const o = _m6aFeldOrt(F, i, j), dx = o.x - K.CXM, dy = o.y - K.CY;
          _m6aPl(S, { x: K.CXM + k * (dx * c - dy * s), y: K.CY + k * (dx * s + dy * c) }, 'b', 1, true, { s: k });
        }
        S.klammern.push({ x: _m6aKlammerX(F), y: _m6aFeldOrt(F, i, 0).y, n: P.C, a: 1 - kl(tau / 0.27) });
      }
      return S;
    }
    case 'tgleit': {
      const F = _m6aFeld(P.R, P.C), F2 = _m6aFeld(P.C, P.R), e = E.sanft(u);
      for (let i = 0; i < P.R; i++) {
        for (let j = 0; j < P.C; j++) {
          const o = _m6aFeldOrt(F, i, j), dx = o.x - K.CXM, dy = o.y - K.CY;
          const rot = P.dir === 1 ? { x: K.CXM - dy, y: K.CY + dx } : { x: K.CXM + dy, y: K.CY - dx };
          const q = P.dir === 1 ? _m6aFeldOrt(F2, j, P.R - 1 - i) : _m6aFeldOrt(F2, P.C - 1 - j, i);
          _m6aPl(S, { x: rot.x + (q.x - rot.x) * e, y: rot.y + (q.y - rot.y) * e }, 'b', 1, true);
        }
      }
      for (let i = 0; i < P.C; i++)
        S.klammern.push({ x: _m6aKlammerX(F2), y: _m6aFeldOrt(F2, i, 0).y, n: P.R, a: kl((u - 0.4) / 0.6) });
      return S;
    }
    case 'tlegen': {
      // was liegt, blendet aus; die erste Zahl der neuen Aufgabe faellt ein
      const aAlt = 1 - kl(tau / 0.12), ns = _m6aStreifen(Math.max(P.x, P.y)), nso = _m6aStreifen(Math.max(P.xo, P.yo));
      const al = [];
      for (let r = 0; r < Math.max(ns, nso); r++) al.push(r < ns ? 1 : aAlt);
      _m6aMinusStreifen(S, 10 * al.length, al);
      _m6aMinusSzene(S, P.xo, P.yo, aAlt, aAlt >= 0.5, true);
      for (let q = 0; q < P.x; q++) {
        const p = kl((tau - 0.08 - Math.floor(q / 5) * 0.05) / 0.15);
        _m6aFall(S, _m6aOrt(K.XM, K.YM, q), 'b', p);
      }
      return S;
    }
    case 'dazuPlus': {
      const istA = P.wer === 'a', n = istA ? P.a : P.b, f = istA ? 'b' : 'o', x0 = istA ? K.XL : K.XR;
      _m6aGruppe(S, istA ? P.b : P.a, istA ? 'o' : 'b', istA ? K.XR : K.XL, 0, 0, 1, true);
      for (let r = 0; r < _m6aStreifen(n + 1); r++)
        S.streifen.push({ x: x0, y: K.YP + r * K.SP, f, a: r < _m6aStreifen(n) ? 1 : kl(tau / 0.2) });
      for (let q = 0; q < n; q++) _m6aPl(S, _m6aOrt(x0, K.YP, q), f, 1, true);
      const p = kl((tau - 0.1) / 0.3);
      _m6aFall(S, _m6aOrt(x0, K.YP, n), f, p, { s: Math.max(0.2, E.federn(p)) });
      S.plus = { x: K.ZX, y: K.YP + K.SH / 2, a: 1 };
      return S;
    }
    case 'dazuReihe': {
      // die neue Reihe gleitet von rechts herein, das Feld rueckt dabei in die Mitte
      const F1 = _m6aFeld(P.R, P.C), F2 = _m6aFeld(P.R + 1, P.C), e = E.sanft(kl(tau / 0.35));
      const lerp = (o1, o2) => ({ x: o1.x + (o2.x - o1.x) * e, y: o1.y + (o2.y - o1.y) * e });
      for (let i = 0; i < P.R; i++) {
        for (let j = 0; j < P.C; j++) _m6aPl(S, lerp(_m6aFeldOrt(F1, i, j), _m6aFeldOrt(F2, i, j)), 'b', 1, true);
        S.klammern.push({ x: _m6aKlammerX(F2), y: lerp(_m6aFeldOrt(F1, i, 0), _m6aFeldOrt(F2, i, 0)).y, n: P.C, a: 1 });
      }
      const p = kl((tau - 0.1) / 0.45), dx = 160 * (1 - E.raus(p)), a = kl(p / 0.3);
      for (let j = 0; j < P.C; j++) {
        const o = _m6aFeldOrt(F2, P.R, j);
        _m6aPl(S, { x: o.x + dx, y: o.y }, 'b', a, p >= 0.7);
      }
      S.klammern.push({ x: _m6aKlammerX(F2) + dx, y: _m6aFeldOrt(F2, P.R, 0).y, n: P.C, a });
      return S;
    }
    case 'dazuJe': {
      // erst ruecken die Klammern zur Seite, dann springt in jede Reihe ein Plaettchen
      const F1 = _m6aFeld(P.R, P.C), F2 = _m6aFeld(P.R, P.C + 1), e = E.sanft(kl(tau / 0.3));
      const lerp = (o1, o2) => ({ x: o1.x + (o2.x - o1.x) * e, y: o1.y + (o2.y - o1.y) * e });
      const kx = _m6aKlammerX(F1) + (_m6aKlammerX(F2) - _m6aKlammerX(F1)) * e;
      for (let i = 0; i < P.R; i++) {
        for (let j = 0; j < P.C; j++) _m6aPl(S, lerp(_m6aFeldOrt(F1, i, j), _m6aFeldOrt(F2, i, j)), 'b', 1, true);
        const p = kl((tau - 0.25 - i * 0.02) / 0.25);
        _m6aPl(S, _m6aFeldOrt(F2, i, P.C), 'b', kl(p / 0.3), p >= 0.6, { s: Math.max(0, E.federn(p)) });
        S.klammern.push({ x: kx, y: _m6aFeldOrt(F2, i, 0).y, n: p >= 0.5 ? P.C + 1 : P.C, a: 1 });
      }
      return S;
    }
    case 'dazuMinA': {
      const ns1 = _m6aStreifen(Math.max(P.a, P.b)), al = [];
      for (let r = 0; r < _m6aStreifen(Math.max(P.a + 1, P.b)); r++) al.push(r < ns1 ? 1 : kl(tau / 0.2));
      _m6aMinusStreifen(S, 10 * al.length, al);
      if (P.a >= P.b) {
        const rest = P.a - P.b;
        for (let q = 0; q < rest; q++) _m6aPl(S, _m6aOrt(K.XM, K.YM, q), 'b', 1, true);
        _m6aFall(S, _m6aOrt(K.XM, K.YM, rest), 'b', kl((tau - 0.05) / 0.3));
      } else {
        // es fehlt etwas: das neue Plaettchen faellt auf seinen Platz und wird gleich mit genommen
        for (let q = P.a + 1; q < P.b; q++) { const o = _m6aOrt(K.XM, K.YM, q); S.fehlt.push({ x: o.x, y: o.y, a: 1, z: true }); }
        const o = _m6aOrt(K.XM, K.YM, P.a), af = 1 - kl(tau / 0.2);
        S.fehlt.push({ x: o.x, y: o.y, a: af, z: af >= 0.5 });
        const p = kl((tau - 0.05) / 0.25), e = E.sanft(kl((tau - 0.32) / 0.25));
        _m6aPl(S, { x: o.x + 70 * e, y: o.y - 14 * (1 - E.raus(p)) - 46 * e }, 'b', kl(p / 0.4) * (1 - e),
               p >= 0.6 && e < 0.5, { s: 1 - 0.3 * e, ring: kl((tau - 0.25) / 0.07) });
      }
      return S;
    }
    case 'dazuMinB': {
      const ns1 = _m6aStreifen(Math.max(P.a, P.b)), al = [];
      for (let r = 0; r < _m6aStreifen(Math.max(P.a, P.b + 1)); r++) al.push(r < ns1 ? 1 : kl(tau / 0.2));
      _m6aMinusStreifen(S, 10 * al.length, al);
      if (P.a > P.b) {
        const rest = P.a - P.b;
        for (let q = 0; q < rest - 1; q++) _m6aPl(S, _m6aOrt(K.XM, K.YM, q), 'b', 1, true);
        const o = _m6aOrt(K.XM, K.YM, rest - 1), e = E.sanft(kl((tau - 0.12) / 0.28));
        _m6aPl(S, { x: o.x + 70 * e, y: o.y - 46 * e }, 'b', 1 - e, e < 0.5, { s: 1 - 0.3 * e, ring: kl(tau / 0.12) });
      } else {
        for (let q = P.a; q < P.b; q++) { const o = _m6aOrt(K.XM, K.YM, q); S.fehlt.push({ x: o.x, y: o.y, a: 1, z: true }); }
        const o = _m6aOrt(K.XM, K.YM, P.b), af = kl(tau / 0.25);
        S.fehlt.push({ x: o.x, y: o.y, a: af, z: af >= 0.5 });
      }
      return S;
    }
  }
  return S;
}
function _m6aSzene() {
  const z = _m6a, S = _m6aLeer(), L = z.lauf;
  if (!L) return _m6aRuhe(S, z.op, z.a, z.b, z.g, z.ein > 0 ? 1 - z.ein / _m6aK.T_EIN : 1, true);
  const P = _m6aPhase(L);
  return _m6aPhaseSzene(S, P, Math.min(P.dur, Math.max(0, L.at - P.t0)));
}
// Wie weit ist getauscht? 0 = Aufgabe, 1 = Tauschaufgabe (fuer die Rechenzeilen)
function _m6aSp() {
  const z = _m6a, L = z.lauf;
  if (!L) return z.g ? 1 : 0;
  const P = _m6aPhase(L), u = P.dur > 0 ? _bioFxKlemme((L.at - P.t0) / P.dur) : 1;
  return P.sp0 + (P.sp1 - P.sp0) * u;
}
// Was die Anzeige gerade sagt – der Zaehler zaehlt aus dem Bild selbst
function _m6aStand() {
  const z = _m6a, L = z.lauf, S = _m6aSzene();
  const st = { op: z.op, a: z.a, b: z.b, erg1: true, gesehen: z.gesehen, tisch: 0, fehlen: 0, S };
  if (L && L.art === 'spiel') {
    st.op = L.ziel.op; st.a = L.ziel.a; st.b = L.ziel.b;
    st.erg1 = L.at >= L.erg1Bei - 1e-9; st.gesehen = false;
  }
  for (const p of S.pl) if (p.z) st.tisch++;
  for (const d of S.fehlt) if (d.z) st.fehlen++;
  return st;
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6aPapier(ctx) {
  const K = _m6aK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  for (let x = K.PX0 + K.KA; x < K.PX1 - 1; x += K.KA) {
    ctx.beginPath(); ctx.moveTo(x, K.PY0 + 1); ctx.lineTo(x, K.PY1 - 1); ctx.stroke();
  }
  for (let y = K.PY0 + K.KA; y < K.PY1 - 1; y += K.KA) {
    ctx.beginPath(); ctx.moveTo(K.PX0 + 1, y); ctx.lineTo(K.PX1 - 1, y); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.stroke();
  ctx.restore();
}
// Zehnerstreifen: heller Streifen mit 10 Plaetzen (leere Ringe), Fuenferluecke
function _m6aStreifenZeichnen(ctx, s) {
  const K = _m6aK;
  if (s.a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, s.a);
  ctx.fillStyle = s.f === 'o' ? 'rgba(251,146,60,0.12)' : 'rgba(59,130,246,0.10)';
  ctx.strokeStyle = s.f === 'o' ? 'rgba(194,65,12,0.40)' : 'rgba(29,78,216,0.35)';
  ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, s.x, s.y, K.SB, K.SH, 5); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(100,116,139,0.35)'; ctx.lineWidth = 1;
  for (let j = 0; j < 10; j++) {
    const x = s.x + 3 + (j + (j >= 5 ? 1 : 0) + 0.5) * K.KA;
    ctx.beginPath(); ctx.arc(x, s.y + K.SH / 2, K.RP - 1.3, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}
function _m6aPlaettchen(ctx, p) {
  const K = _m6aK, r = K.RP * p.s;
  if (p.a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, p.a);
  if (p.ring > 0.01) {                                // genommen: oranger Ring
    ctx.save(); ctx.globalAlpha = Math.min(1, p.a) * Math.min(1, p.ring);
    ctx.strokeStyle = K.R_ORANGE; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(p.x, p.y, r + 2.3, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = p.f === 'o' ? K.P_ORANGE : K.P_BLAU;
  ctx.strokeStyle = p.f === 'o' ? K.R_ORANGE : K.R_BLAU; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (r > 3) {                                        // Lichtpunkt: sieht aus wie ein Plaettchen
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(p.x - r * 0.35, p.y - r * 0.35, r * 0.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Fehlender Platz: gestrichelter oranger Ring; blinkt zweimal, wenn er erscheint
function _m6aFehltZeichnen(ctx, d) {
  const z = _m6a, K = _m6aK;
  if (d.a <= 0.01) return;
  const ph = z.blinkFehl > 0 ? 1 - z.blinkFehl / K.T_BLINK : 1;
  const v = z.blinkFehl > 0 ? Math.max(0, Math.sin(ph * Math.PI * 4)) : 0;   // zwei Mal hell
  const r = K.RP * (1 + 0.18 * v);
  ctx.save();
  ctx.globalAlpha = Math.min(1, d.a);
  ctx.fillStyle = 'rgba(251,146,60,' + (0.10 + 0.55 * v).toFixed(3) + ')';
  ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = K.R_ORANGE; ctx.lineWidth = 1.6;
  ctx.setLineDash([2.5, 2]);
  ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
// Klammer „]“ rechts neben einer Reihe, daneben die Anzahl je Reihe (blau)
function _m6aKlammer(ctx, k) {
  const K = _m6aK;
  if (k.a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, k.a);
  ctx.strokeStyle = K.F_KLAMMER; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(k.x, k.y - 5.5); ctx.lineTo(k.x + 3, k.y - 5.5); ctx.lineTo(k.x + 3, k.y + 5.5); ctx.lineTo(k.x, k.y + 5.5); ctx.stroke();
  ctx.fillStyle = K.T_BLAU; ctx.font = '700 12px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(String(k.n), k.x + 7, k.y + 4.3);
  ctx.restore();
}
// Umriss aller Plaettchen, Plaetze und Streifen (fuer Lichtrahmen und Halt)
function _m6aUmriss(S) {
  const K = _m6aK;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const nimm = (xa, ya, xb, yb) => { x0 = Math.min(x0, xa); y0 = Math.min(y0, ya); x1 = Math.max(x1, xb); y1 = Math.max(y1, yb); };
  for (const p of S.pl) if (p.a > 0.3) nimm(p.x - K.RP, p.y - K.RP, p.x + K.RP, p.y + K.RP);
  for (const d of S.fehlt) if (d.a > 0.3) nimm(d.x - K.RP, d.y - K.RP, d.x + K.RP, d.y + K.RP);
  for (const s of S.streifen) if (s.a > 0.3) nimm(s.x, s.y, s.x + K.SB, s.y + K.SH);
  for (const k of S.klammern) if (k.a > 0.3) nimm(k.x, k.y - 6, k.x + 24, k.y + 6);
  return x0 < x1 ? { x0, y0, x1, y1 } : null;
}
function _m6aBild(ctx, S) {
  const z = _m6a, K = _m6aK;
  const wk = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0;
  ctx.save();
  if (wk) ctx.translate(wk, 0);
  for (const s of S.streifen) _m6aStreifenZeichnen(ctx, s);
  // erst was liegt, dann was fliegt (das Fliegende liegt obenauf)
  for (const p of S.pl) if (p.z || p.ring <= 0) _m6aPlaettchen(ctx, p);
  for (const p of S.pl) if (!p.z && p.ring > 0) _m6aPlaettchen(ctx, p);
  for (const d of S.fehlt) _m6aFehltZeichnen(ctx, d);
  for (const k of S.klammern) _m6aKlammer(ctx, k);
  if (S.plus && S.plus.a > 0.01) {
    ctx.globalAlpha = Math.min(1, S.plus.a);
    ctx.fillStyle = '#334155'; ctx.font = '700 22px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('+', S.plus.x, S.plus.y + 8);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
// Ruhiger Lichtrahmen um das gedrehte Feld (Aha) und gestrichelter Rahmen im Halt
function _m6aRahmen(ctx, S) {
  const z = _m6a, K = _m6aK, U = _m6aUmriss(S);
  if (!U) return;
  if (z.aha > 0) {
    const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.aha / 0.5) * (0.55 + 0.35 * puls);
    ctx.strokeStyle = K.F_AMBER; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, U.x0 - 7, U.y0 - 7, U.x1 - U.x0 + 14, U.y1 - U.y0 + 14, 9); ctx.stroke();
    ctx.restore();
  }
  if (z.halt) {
    ctx.save();
    ctx.strokeStyle = K.F_AMBER; ctx.lineWidth = 2.2; ctx.setLineDash([6, 4]);
    _bioFxRundRect(ctx, U.x0 - 10, U.y0 - 10, U.x1 - U.x0 + 20, U.y1 - U.y0 + 20, 10); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}
// Teile einer Rechenzeile „x op y = e“ (bzw. „x − y  reicht nicht“)
function _m6aTeile(op, x, y, zuerstA) {
  const K = _m6aK, T = [
    { s: String(x), f: _m6aZahlFarbe(op, 0, zuerstA), r: 'x' },
    { s: _m6aZEICHEN[op], f: K.F_TEXT, r: 'op' },
    { s: String(y), f: _m6aZahlFarbe(op, 1, !zuerstA), r: 'y' }];
  if (!_m6aReicht(op, x, y)) T.push({ s: 'reicht nicht', f: K.T_ORANGE, r: 'erg', gr: K.GR, luft: 12 });
  else T.push({ s: '=', f: K.F_TEXT, r: 'gl' }, { s: String(_m6aRechne(op, x, y)), f: K.F_TEXT, r: 'erg' });
  return T;
}
// Mitte jedes Teils, die ganze Zeile mittig um EX
function _m6aSetzen(ctx, T) {
  const K = _m6aK, br = [];
  ctx.save();
  for (const t of T) { ctx.font = '700 ' + (t.gr || K.GL) + 'px sans-serif'; br.push(ctx.measureText(t.s).width); }
  ctx.restore();
  const luft = K.GL * 0.3;
  let ges = 0;
  T.forEach((t, i) => { ges += br[i] + (i ? (t.luft || luft) : 0); });
  let x = K.EX - ges / 2;
  return T.map((t, i) => { if (i) x += t.luft || luft; const m = x + br[i] / 2; x += br[i]; return m; });
}
function _m6aText(ctx, t, x, y, a, f, pop) {
  const K = _m6aK;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = f || t.f; ctx.font = '700 ' + (t.gr || K.GL) + 'px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  if (pop > 0) {                                      // das Ergebnis springt und federt
    const k = Math.max(0.6, _bioFxEase.federn(1 - pop / K.T_POP)), gr = t.gr || K.GL;
    ctx.translate(x, y - gr * 0.36); ctx.scale(k, k);
    ctx.fillText(t.s, 0, gr * 0.36);
  } else ctx.fillText(t.s, x, y);
  ctx.restore();
}
// Farbe zwischen zwei #rrggbb-Farben
function _m6aMisch(f1, f2, u) {
  const h = (f, i) => parseInt(f.slice(1 + 2 * i, 3 + 2 * i), 16);
  const c = [0, 1, 2].map(i => Math.round(h(f1, i) + (h(f2, i) - h(f1, i)) * u));
  return 'rgb(' + c.join(',') + ')';
}
function _m6aZeilen(ctx, st) {
  const z = _m6a, K = _m6aK, L = z.lauf, sp = _m6aSp(), E = _bioFxEase;
  const op = st.op, a = st.a, b = st.b;
  const fliegt = !st.gesehen && !!L && sp > 0.001;
  const zwei = st.gesehen || fliegt;
  const a1 = zwei ? 1 - 0.5 * sp : 1, a2 = 0.5 + 0.5 * sp;
  const T1 = _m6aTeile(op, a, b, true), T2 = _m6aTeile(op, b, a, false);
  const X1 = _m6aSetzen(ctx, T1), X2 = _m6aSetzen(ctx, T2);
  ctx.save();
  ctx.fillStyle = K.F_GRAU; ctx.font = '600 ' + K.GB + 'px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = a1; ctx.fillText('Aufgabe', K.LX, K.L1 - 3);
  if (zwei) { ctx.globalAlpha = st.gesehen ? a2 : a2 * Math.min(1, sp * 2); ctx.fillText('Tauschaufgabe', K.LX, K.L2 - 3); }
  ctx.restore();
  T1.forEach((t, i) => {
    if ((t.r === 'gl' || t.r === 'erg') && !st.erg1) return;
    _m6aText(ctx, t, X1[i], K.L1, a1, null, t.r === 'erg' ? z.pop1 : 0);
  });
  if (st.gesehen) {
    T2.forEach((t, i) => _m6aText(ctx, t, X2[i], K.L2, a2, null, t.r === 'erg' ? z.pop2 : 0));
  } else if (fliegt) {
    // Die Zeile „Tauschaufgabe“ entsteht im Takt des Bildes: Zahlen und
    // Zeichen blenden an ihren Plaetzen ein und sinken dabei ein Stueck herab
    // (Farben wie im Bild). „=“ und Ergebnis springen erst danach auf.
    // (Wandernde Zahlen haetten sich in der Mitte der Zeile ueberdeckt.)
    const ein = E.sanft(_bioFxKlemme((sp - 0.3) / 0.7));
    for (let i = 0; i < 3; i++) _m6aText(ctx, T2[i], X2[i], K.L2 - 6 * (1 - ein), ein, null, 0);
  }
}
// Zaehler unten: „Plättchen auf dem Tisch: 31“ (fehlt etwas, der Rest orange)
function _m6aZaehler(ctx, st) {
  const z = _m6a, K = _m6aK;
  const t1 = 'Plättchen auf dem Tisch: ' + st.tisch, t2 = st.fehlen ? ', es fehlen noch ' + st.fehlen : '';
  ctx.save();
  ctx.font = '700 ' + K.GZ + 'px sans-serif';
  const w1 = ctx.measureText(t1).width, w2 = t2 ? ctx.measureText(t2).width : 0, x = K.ZX - (w1 + w2) / 2;
  if (z.aha > 0) {                                    // Aha: der Zaehler steht weiter da – hell hinterlegt
    ctx.globalAlpha = Math.min(1, z.aha / 0.5) * 0.9;
    ctx.fillStyle = 'rgba(252,211,77,0.45)'; ctx.strokeStyle = 'rgba(217,119,6,0.75)'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, x - 6, K.LZ - K.GZ - 2, w1 + w2 + 12, K.GZ + 7, 5); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#334155'; ctx.fillText(t1, x, K.LZ);
  if (t2) { ctx.fillStyle = K.T_ORANGE; ctx.fillText(t2, x + w1, K.LZ); }
  ctx.restore();
}
function _m6aDraw(ctx, cv) {
  if (!_m6a) return;
  const z = _m6a, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6aPapier(ctx);
  const st = _m6aStand();
  _bioFxDraw(ctx, z.fx.teile);                        // Lichtring hinter den Plaettchen
  _m6aBild(ctx, st.S);
  _m6aRahmen(ctx, st.S);
  _m6aZeilen(ctx, st);
  _m6aZaehler(ctx, st);
  if (z.pause) _m6aPauseSchild(ctx);
}
// Schild „Pause“ oben links – gleiche Stelle, Groesse und Farbe wie in
// m5-plus-schriftlich. Leuchtet kurz auf, wenn waehrend der Pause ein Knopf
// gedrueckt wird.
function _m6aPauseSchild(ctx) {
  const z = _m6a, w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  if (z.blink > 0) {
    ctx.globalAlpha = Math.min(1, z.blink / 0.3);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, x - 3, y - 3, w + 6, h + 6, 9); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  ctx.font = '700 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Pause', x + 20, y + 17.5);
  ctx.restore();
}
