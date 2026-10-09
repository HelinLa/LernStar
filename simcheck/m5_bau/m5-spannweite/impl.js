
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – md3 „Wie weit liegen die Werte auseinander?“
// (Kennung m5-spannweite, Praefix _m6t)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL8_PROFIL.md, Abschnitte „md3“ und
// „m5-spannweite (md3) · _m6t“ (Regeln N1–N3, Lehrkraft-Zeile wie Kapitel 4).
// Ueberschrift = Frage der Einheit: „Wie weit liegen die Flüge auseinander?“
//
// Was man sieht – Bild und Zeichen sind durch die FARBE verbunden: Jeder Flug
// hat eine Farbe, und in ihr stehen sein Flieger, seine Bahn, sein Kaertchen
// „Flug n“, sein Wertkaertchen unten, seine Marke am Massband und seine Zahl in
// den Statuszeilen (Flug 1 blau, 2 violett, 3 gruen, 4 pink, 5 petrol).
// Kontrast gemessen (WCAG, Statusgrund #dcfce7 / Pause #fef3c7, Weiss auf
// Kaertchen): alle Flugfarben ≥ 4,5:1. Pink ist deshalb #be185d (5,5:1; das
// hellere #db2777 hatte 4,19:1), Orange-TEXT #c2410c (4,72:1) – das helle
// Orange #ea580c (3,24:1) traegt nur Linien, Ringe und Raender.
//   HALLE: ein heller Hallenboden. Unten ein gelbes Massband von 0 bis 15 m,
//     ein Strich je Meter, an jedem Meter seine Zahl, hinter der 15 die
//     Einheit „m“ (N3: Groessen mit Einheit, wie „min“ am Strahl von
//     m5-median). Links die Startlinie; sie steht genau ueber der 0.
//   BAHNEN: je Flug eine Bahn (zartes Band in seiner Farbe), links davor das
//     Kaertchen „Flug 1“ … in Wurfreihenfolge. Die Bahnen liegen unten am
//     Massband (3, 4 oder 5 Bahnen), der Flieger wartet an der Startlinie.
//   Nach der Landung: eine Spur von der Startlinie bis zur Spitze des Fliegers,
//     ein Querstrich an der Landestelle, ein kleines Dreieck an derselben
//     Stelle auf dem Massband.
//   WERTKAERTCHEN (unter der Halle): „4 m“ … in der Farbe ihres Flugs, erst in
//     Wurfreihenfolge, nach dem Ordnen der Groesse nach.
//   KLAMMER (unter dem Massband, dunkel): vom kuerzesten zum weitesten Flug,
//     darueber ihre Laenge („6 m“). Gestrichelte Lote verbinden die beiden
//     Flieger mit ihren Enden (das Lot spart das Massband aus, damit seine
//     Zahl lesbar bleibt).
//   KLAMMER DER GEGENPROBE (darunter, orange): vom ersten zum letzten Flug der
//     Wurfreihenfolge, darueber ihre Laenge; die Bahnen von Flug 1 und dem
//     letzten Flug sind orange umrandet, Flieger AUSSERHALB der orangen
//     Klammer leuchten orange (ihre Wertkaertchen auch).
//
// Bewegung (spielt nach der Sprungmarke SELBST ab – N1: jede Sprungmarke
// spielt ihre Zeile ab; anhalten kann die Lehrkraft). Alles ist eine Funktion
// der Ablaufzeit szene.s bzw. szene.q (_m6tStart, _m6tLandung, _m6tOrd0 …):
// keine Zufallszahl, jede Zahl im Bild kommt aus derselben Rechnung wie die
// Statuszeilen (_m6tStand).
//   0,00–0,20 s  eine alte Szene blendet aus; ab 0,15 s blenden die neuen
//                Bahnen mit ihren wartenden Fliegern ein.
//   je Flug 0,6 s (ab 0,35 s): der Flieger fliegt von der Startlinie im Bogen
//                zu seiner Weite (0,5 s; er steigt, wird groesser, sein
//                Schatten bleibt am Boden), landet, sein Wertkaertchen springt
//                unten auf.
//   +0,25 s      Pause, dann ORDNEN (0,8 s): Alle Bahnen gleiten gleichzeitig
//                senkrecht auf ihren neuen Platz, bis der kuerzeste Flug oben
//                und der weiteste unten liegt; die Wertkaertchen sortieren sich
//                gleichzeitig (nach rechts im Bogen nach oben, nach links nach
//                unten; zwei Kaertchen kreuzen sich so nie auf derselben Hoehe).
//   +0,1 s       erste und letzte Bahn leuchten (gelber Schein, dunkler Rand wie
//                die Klammer; 0,3 s), die Lote wachsen.
//   +0,15 s      die Klammer spannt sich vom kuerzesten zum weitesten Flug
//                (0,6 s), dann springt ihre Laenge auf (0,25 s).
//   Gesamtdauer bei „Tempo: normal“, gemessen in Frames zu 16 ms (V7):
//     Gruppe A 4,2 s = 263 Frames · Gruppe B 5,4 s = 338 Frames ·
//     Gruppe C 4,8 s = 300 Frames · Gegenprobe 1,15 s = 72 Frames
//     (bei „Tempo: langsam“ dreimal so lang, Gruppe B 1013 Frames).
//   simfakten.js, GEMESSEN am 09.10.2026 (Kopie mit eingebautem Bausatz):
//     --frames=25 --verlauf=4 (Schalter von fakten_ziehen.py): im einfachen
//       Knopfdurchgang („Gruppe B · nach 125 Frames“) stehen nur die ersten
//       zwei Fluege. ALLE Tabellenwerte stehen trotzdem im Dump – im
//       Kombinationsdurchgang „Gruppe B + letzter minus erster“, weil die
//       Gegenprobe die laufende Bewegung sofort ankommen laesst.
//     --frames=70 --verlauf=4 (bis Frame 350): auch der einfache Durchgang
//       endet bei „Unterschied: …“ mit Zahlen.
//   Die Laenge folgt aus dem Bauplan (0,6 s je Flug, 0,8 s Ordnen) und liegt
//   ueber dem Ziel „≤ 3 s“ aus V7 (KAPITEL5_PROFIL) – fuenf Fluege allein
//   dauern schon 3,0 s.
//   „letzter minus erster“ (Gegenprobe, 1,15 s): die Bahnen von Flug 1 und
//     dem letzten Flug werden orange umrandet, ihre Lote wachsen (0,3 s), die
//     orange Klammer spannt sich (0,25–0,85 s), ihre Laenge springt auf; dann
//     leuchten die Flieger ausserhalb orange.
//   „neu“: die Szene blendet aus (0,2 s), die Halle ist leer.
// Wer waehrend einer Bewegung „letzter minus erster“ drueckt, laesst sie
// sofort ankommen (ohne Lichtring); dann geschieht das Neue. Eine Sprungmarke
// und „neu“ brechen ab und bauen neu auf. Jede Knopffolge ergibt so dieselben
// Zahlen.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6tGruppe('A') …):
//     „Gruppe A“ · „Gruppe B“ · „Gruppe C“ (die gezeigte ist hervorgehoben)
//   Reihe 2: „letzter minus erster“ (_m6tGegen(), blass, bis eine Gruppe
//     gewaehlt ist) · „neu“ (_m6tNeu())
//
// Statuszeilen (woertlich aus dem Bauplan, alle mit mehr als 18 Zeichen –
// simfakten.js). Sie folgen dem Bild: Eine Zahl steht erst in der Anzeige,
// wenn sie im Bild angekommen ist. Zwischen Zahl und „m“ steht ein
// geschuetztes Leerzeichen (U+00A0, im Dump ein normales).
//   _m6t-gruppe       „Flüge von Gruppe B: 4 m, 9 m, 6 m, 3 m, 7 m“ (waechst mit
//                     jeder Landung; vor der ersten „Flüge von Gruppe B: …“;
//                     ohne Gruppe „Flüge: noch keine Gruppe gewählt“)
//   _m6t-rang         „Der Größe nach: 3 m, 4 m, 6 m, 7 m, 9 m“ (vor dem Ordnen
//                     „Der Größe nach: noch nicht geordnet“)
//   _m6t-enden        „Kürzester Flug: 3 m, weitester Flug: 9 m“ (vorher „…“)
//   _m6t-unterschied  „Unterschied: 9 m − 3 m = 6 m“ (vorher „Unterschied: …“)
//   _m6t-gegen        nur nach „letzter minus erster“:
//                     „Letzter minus erster: 7 m − 4 m = 3 m“
//   _m6t-aussen       ebenso: „Außerhalb davon: 2 Flüge“ (Einzahl „1 Flug“)
//   _m6t-lehrkraft    Hinweis fuer die Lehrkraft (siehe unten)
//
// Werte (nachgerechnet, simcheck/werte.js):
//   A 5 m, 8 m, 6 m → 5 m, 6 m, 8 m → kuerzester 5 m, weitester 8 m →
//     8 m − 5 m = 3 m · Gegenprobe 6 m − 5 m = 1 m, ausserhalb 1 Flug
//   B 4 m, 9 m, 6 m, 3 m, 7 m → 3 m, 4 m, 6 m, 7 m, 9 m → 9 m − 3 m = 6 m ·
//     Gegenprobe 7 m − 4 m = 3 m, ausserhalb 2 Fluege
//   C 10 m, 13 m, 8 m, 12 m → 8 m, 10 m, 12 m, 13 m → 13 m − 8 m = 5 m ·
//     Gegenprobe 12 m − 10 m = 2 m, ausserhalb 2 Fluege
// Start: leere Halle („Start: Noch kein Flug, wähle eine Gruppe“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Gruppe B – beim Ordnen gleitet
// der 3-m-Flug (Flug 4) nach oben und der 9-m-Flug (Flug 2) nach unten; wenn
// die Klammer 6 m spannt, breitet sich ein Lichtring um die Klammer aus, und
// sie bleibt 2,2 s bernsteinfarben umrandet. Das widerlegt „3 m“ (letzter
// minus erster) und „9 m“ (der weiteste Flug selbst).
//
// FUER DIE LEHRKRAFT (Bauart wie m5-rest / m5-punktefeld; Container
// <div class="fpm-lehrkraft">, damit simfakten.js die Zeile ueberspringen
// kann – V3). Eigene Zeile unter den Heftknoepfen, davor klein „Für die
// Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6tAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links im Bild (Stelle und Aussehen wie m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6tTempo()): ein Drittel so schnell.
//   „Halt vor dem Ordnen: aus“ ↔ „… an“ (_m6tHaltSchalter()): Der Ablauf haelt
//     von selbst an, wenn alle Flieger gelandet sind und BEVOR sich die Bahnen
//     ordnen – das Gespraech „Wie weit liegen die Flüge auseinander?“ vor dem
//     Ordnen. Dann ist Pause; „weiter“ ordnet.
//   Nur das wechselnde Wort steht in einem eigenen <span> (_m6t-tempo-an,
//   _m6t-halt-an), damit die Aufschrift nicht als Statuszeile in den
//   Faktendump geraet.
// Hinweiszeile _m6t-lehrkraft (in der Pause „lmp-status off“, sonst „on“)
// nennt immer die Einstellung, so aendert JEDER Lehrkraft-Knopf eine Zeile:
//   sonst  „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal, Halt vor dem Ordnen: aus.“
//   Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. Tempo: …“
//   Halt   „Halt: Alle 5 Flüge sind gelandet. Jetzt kommt das Ordnen.“
// So ist es gebaut:
//   * EIN Zeitfaktor (_m6tZeitfaktor: 0 in der Pause, 1/3 langsam, 1 normal)
//     an der einen Stelle, an der dt in _m6tUpdate hineingeht. Ohne Zeit kein
//     Schritt im Ablauf (`dt > 0`).
//   * Der Halt ist ein EREIGNIS im Ablauf (_m6tHaltZeit wird ueberschritten).
//   * In der Pause bewegt „letzter minus erster“ nichts: Steht eine Bewegung,
//     entfaellt der Druck; steht keine, wird er VORGEMERKT und beginnt mit
//     „weiter“. Das Schild „Pause“ leuchtet dabei kurz auf (in echter Zeit).
//     Eine Sprungmarke und „neu“ heben die Pause auf; Tempo und Halt bleiben
//     stehen (die Lehrkraft stellt sie einmal ein).
//   Voreinstellung: Pause aus, Tempo normal, Halt aus.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Spannweite“,
// „Rangliste“, die Regel als Satz. Keine Namen, keine Punkte, keine Zeit,
// kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m6t = null;
const _m6tDATEN = { A: [5, 8, 6], B: [4, 9, 6, 3, 7], C: [10, 13, 8, 12] };   // Weiten in m, Wurfreihenfolge
const _m6tREIHE = ['A', 'B', 'C'];
const _m6tFARBE = ['#2563eb', '#7c3aed', '#15803d', '#be185d', '#0e7490'];  // Flug 1 … 5
const _m6tK = {
  PX0: 4, PX1: 416, PY0: 4, PY1: 210,       // Hallenboden
  X0: 82, M: 20.5, MMAX: 15,                // Startlinie = 0 m, Pixel je Meter, Massband bis 15 m
  ME: 14, MENDE: 22,                        // Einheit „m“ hinter der 15, Bandende hinter der 15
  BYU: 134, BP: 22, BH: 18,                 // Mitte der untersten Bahn, Bahnabstand, Bahnhoehe
  BX1: 411,                                 // rechtes Ende der Bahnen
  KX0: 8, KW: 48, KH: 16,                   // Kaertchen „Flug n“
  SY0: 32,                                  // Startlinie beginnt hier (darueber das Schild „Pause“)
  MY0: 150, MY1: 166,                       // Massband
  KLY: 184, GKY: 205, ZACKE: 8,             // Klammer, Klammer der Gegenprobe, Hoehe der Enden
  WY: 216, WH: 26, WW: 44, WG: 10, WMX: 210,// Wertkaertchen: oben, Hoehe, Breite, Luecke, Mitte der Reihe
  // Zeiten in s – Abspielen einer Gruppe
  T_ALT: 0.2, T_EIN0: 0.15, T_EIN: 0.2, T0: 0.35, T_JE: 0.6, T_FL: 0.5, T_KPOP: 0.25,
  T_VOR: 0.25, T_ORD: 0.8, T_NACH: 0.1, T_LEUCHT: 0.3, T_KL_AB: 0.15, T_KL: 0.6, T_ZPOP: 0.25,
  // Zeiten in s – Gegenprobe
  G_LEUCHT: 0.3, G_KL0: 0.25, G_KL1: 0.85, G_ZPOP: 0.3, G_ENDE: 1.15,
  T_AHA: 2.2, LANGSAM: 1 / 3,
  F_KLAMMER: '#1e293b', F_GEGEN: '#ea580c', F_GEGEN_TEXT: '#c2410c', F_TINTE: '#0f172a', F_GRAU: '#64748b',
  F_BODEN: '#f7f1e6', F_BAND: '#fde68a', F_BANDRAND: '#b45309'
};

// ── Ablauf: alles aus der Ablaufzeit ─────────────────────────────────────
function _m6tStart(i) { return _m6tK.T0 + i * _m6tK.T_JE; }
function _m6tLandung(i) { return _m6tStart(i) + _m6tK.T_FL; }
function _m6tOrd0(n) { return _m6tLandung(n - 1) + _m6tK.T_VOR; }
function _m6tOrd1(n) { return _m6tOrd0(n) + _m6tK.T_ORD; }
function _m6tLeucht(n) { return _m6tOrd1(n) + _m6tK.T_NACH; }
function _m6tKl0(n) { return _m6tLeucht(n) + _m6tK.T_KL_AB; }
function _m6tKl1(n) { return _m6tKl0(n) + _m6tK.T_KL; }
function _m6tEnde(n) { return _m6tKl1(n) + _m6tK.T_ZPOP; }
// Halt vor dem Ordnen: alle gelandet, die Bahnen stehen noch in Wurfreihenfolge.
function _m6tHaltZeit(n) { return _m6tOrd0(n) - 0.005; }

// Ordnung: idx = Fluege der Groesse nach (0 = kuerzester), r[i] = Platz von Flug i.
function _m6tRang(v) {
  const idx = v.map((_, i) => i).sort((a, b) => v[a] - v[b] || a - b);
  const r = [];
  idx.forEach((i, p) => { r[i] = p; });
  return { idx, r };
}
// Mitte der Bahn auf Platz p (0 = oben) bei n Bahnen; die unterste liegt am Massband.
function _m6tBahnY(p, n) { const K = _m6tK; return K.BYU - (n - 1 - p) * K.BP; }
// Landestelle (Spitze des Fliegers) fuer w Meter
function _m6tX(w) { return _m6tK.X0 + w * _m6tK.M; }
// Mitte des Wertkaertchens auf Platz p
function _m6tWertX(p, n) {
  const K = _m6tK;
  return K.WMX - (n * K.WW + (n - 1) * K.WG) / 2 + p * (K.WW + K.WG) + K.WW / 2;
}
function _m6tM(w) { return w + ' m'; }                // Zahl und Einheit, geschuetztes Leerzeichen

// Was zeigt eine Szene gerade? (Grundlage der Statuszeilen)
function _m6tStand(sc) {
  if (!sc || !sc.g) return { g: null };
  const n = _m6tDATEN[sc.g].length, s = sc.s;
  let gel = 0;
  for (let i = 0; i < n; i++) if (s >= _m6tLandung(i)) gel++;
  return { g: sc.g, gel, geordnet: s >= _m6tOrd1(n), enden: s >= _m6tLeucht(n), unter: s >= _m6tKl1(n),
           gegen: sc.q === null ? 0 : sc.q >= _m6tK.G_KL1 ? 2 : 1 };
}
function _m6tSchluessel() {
  const z = _m6t;
  return JSON.stringify(_m6tStand(z.szene)) + (z.pause ? 'P' : '') + (z.halt ? 'H' : '') + (z.lauf || '');
}

function _m6tInit() {
  _m6t = { t: 0, szene: { g: null, s: 0, q: null }, lauf: null, alt: null,
           angehalten: false, ahaGlanz: 0, blink: 0, vorgemerkt: false,
           pause: false, langsam: false, haltAn: false, halt: null,   // Lehrkraft-Einstellungen
           schluessel: '', fx: { teile: [] } };
}
function _m6tHTML() {
  const marke = g => `<button class="sim-btn" id="_m6t-b-${g}" onclick="_m6tGruppe('${g}')">Gruppe&nbsp;${g}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie weit liegen die Flüge auseinander?</h3>
    <div class="fpm-note" style="margin-top:2px">Jeder Flieger fliegt einmal. Wähle eine Gruppe und sieh zu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6t-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6tREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6t-gknopf" onclick="_m6tGegen()">letzter minus erster</button>
          <button class="sim-btn" onclick="_m6tNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6t-pause" onclick="_m6tAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6t-tempo" onclick="_m6tTempo()">Tempo: <span id="_m6t-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6t-halt" onclick="_m6tHaltSchalter()">Halt vor dem Ordnen: <span id="_m6t-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6t-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6t-gruppe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6t-rang" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6t-enden" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6t-unterschied" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6t-gegen" style="margin-top:6px;display:none"></div>
        <div class="lmp-status on" id="_m6t-aussen" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Noch kein Flug, wähle eine Gruppe</p>
  </div>`;
}
function _m6tSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6tZeige(e, an) { if (e && e.style) e.style.display = an ? '' : 'none'; }
function _m6tStatus() {
  if (!_m6t) return;
  const z = _m6t, K = _m6tK, sc = z.szene, st = _m6tStand(sc);
  z.schluessel = _m6tSchluessel();
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  if (!sc.g) {
    _m6tSetze('_m6t-gruppe', 'Flüge: noch keine Gruppe gewählt');
    _m6tSetze('_m6t-rang', 'Der Größe nach: noch nicht geordnet');
    _m6tSetze('_m6t-enden', 'Kürzester Flug: …, weitester Flug: …');
    _m6tSetze('_m6t-unterschied', 'Unterschied: …');
  } else {
    const v = _m6tDATEN[sc.g], n = v.length, R = _m6tRang(v), lo = R.idx[0], hi = R.idx[n - 1];
    const w = i => f(_m6tM(v[i]), _m6tFARBE[i]);
    const gel = [];
    for (let i = 0; i < st.gel; i++) gel.push(w(i));
    _m6tSetze('_m6t-gruppe', 'Flüge von Gruppe ' + sc.g + ': ' + (gel.length ? gel.join(', ') : '…'));
    _m6tSetze('_m6t-rang', 'Der Größe nach: ' + (st.geordnet ? R.idx.map(w).join(', ') : 'noch nicht geordnet'));
    _m6tSetze('_m6t-enden', st.enden ? 'Kürzester Flug: ' + w(lo) + ', weitester Flug: ' + w(hi)
                                     : 'Kürzester Flug: …, weitester Flug: …');
    _m6tSetze('_m6t-unterschied', st.unter
      ? 'Unterschied: ' + w(hi) + ' − ' + w(lo) + ' = ' + f(_m6tM(v[hi] - v[lo]), K.F_KLAMMER)
      : 'Unterschied: …');
  }
  // Gegenprobe: nur nach „letzter minus erster“
  const gAn = !!sc.g && st.gegen > 0;
  let gTxt = '', aTxt = '';
  if (gAn) {
    const v = _m6tDATEN[sc.g], n = v.length, w = i => f(_m6tM(v[i]), _m6tFARBE[i]);
    const lo = Math.min(v[0], v[n - 1]), hi = Math.max(v[0], v[n - 1]);
    const aussen = v.filter(x => x < lo || x > hi).length;
    gTxt = 'Letzter minus erster: ' + (st.gegen === 2
      ? w(n - 1) + ' − ' + w(0) + ' = ' + f(_m6tM(v[n - 1] - v[0]), K.F_GEGEN_TEXT) : '…');
    aTxt = 'Außerhalb davon: ' + (st.gegen === 2 ? f(aussen + (aussen === 1 ? ' Flug' : ' Flüge'), K.F_GEGEN_TEXT) : '…');
  }
  _m6tZeige(_m6tSetze('_m6t-gegen', gTxt), gAn);
  _m6tZeige(_m6tSetze('_m6t-aussen', aTxt), gAn);
  // Sprungmarke der gezeigten Gruppe hervorheben; Gegenprobe erst mit einer Gruppe
  for (const g of _m6tREIHE) {
    const b = document.getElementById('_m6t-b-' + g);
    if (b && b.classList) b.classList.toggle('primary', sc.g === g);
  }
  const gk = document.getElementById('_m6t-gknopf');
  if (gk) { gk.disabled = !sc.g; if (gk.style) gk.style.opacity = sc.g ? '' : '0.45'; }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6tSetze('_m6t-pause', z.pause ? 'weiter' : 'Pause');
  _m6tSetze('_m6t-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6tSetze('_m6t-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _m6tSetze('_m6t-lehrkraft', _m6tHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6t-pause', z.pause], ['_m6t-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6tHinweis() {
  const z = _m6t;
  if (z.halt) return 'Halt: Alle ' + z.halt.n + ' Flüge sind gelandet. Jetzt kommt das Ordnen.';
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt vor dem Ordnen: ' + (z.haltAn ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Die gezeigte Szene blendet aus; Pause, Halt und Lichtring fallen weg.
function _m6tAufraeumen() {
  const z = _m6t;
  z.alt = z.szene.g ? { szene: { g: z.szene.g, s: z.szene.s, q: z.szene.q }, at: 0 } : null;
  z.lauf = null; z.pause = false; z.halt = null; z.vorgemerkt = false; z.blink = 0;
  z.angehalten = false; z.ahaGlanz = 0; z.fx.teile.length = 0;
}
function _m6tGruppe(g) {
  if (!_m6t || !_m6tDATEN[g]) return;
  const z = _m6t;
  _m6tAufraeumen();
  z.szene = { g, s: 0, q: null };
  z.lauf = 'spiel';
  _m6tStatus();
}
function _m6tNeu() {
  if (!_m6t) return;
  const z = _m6t;
  _m6tAufraeumen();
  z.szene = { g: null, s: 0, q: null };
  _m6tStatus();
}
// Die laufende Bewegung sofort ankommen lassen (Endstand, ohne Lichtring).
function _m6tAnkommen() {
  const z = _m6t;
  if (z.lauf === 'spiel') z.szene.s = Infinity;
  else if (z.lauf === 'gegen') z.szene.q = Infinity;
  z.lauf = null; z.halt = null;
}
// „letzter minus erster“ – die Gegenprobe
function _m6tGegen() {
  if (!_m6t || !_m6t.szene.g) return;
  const z = _m6t;
  if (z.pause) {                                    // in der Pause: vormerken oder entfallen lassen
    z.blink = 0.6;
    if (!z.lauf) z.vorgemerkt = true;
    _m6tStatus();
    return;
  }
  _m6tAnkommen();
  z.szene.q = 0;
  z.lauf = 'gegen';
  _m6tStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6tAnhalten() {
  if (!_m6t) return;
  const z = _m6t;
  if (z.pause) {
    z.pause = false; z.halt = null; z.blink = 0;
    if (z.vorgemerkt) { z.vorgemerkt = false; _m6tGegen(); return; }
  } else z.pause = true;
  _m6tStatus();
}
function _m6tTempo() {
  if (!_m6t) return;
  _m6t.langsam = !_m6t.langsam;
  _m6tStatus();
}
function _m6tHaltSchalter() {
  if (!_m6t) return;
  _m6t.haltAn = !_m6t.haltAn;
  _m6tStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6tZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6tK.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6tUpdate(dt) {
  if (!_m6t) return;
  const z = _m6t, K = _m6tK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);             // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6tZeitfaktor(z);                     // ab hier Sim-Zeit
  z.t += dt;
  if (z.alt) { z.alt.at += dt; if (z.alt.at >= K.T_ALT) z.alt = null; }
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  const sc = z.szene;
  if (z.lauf && dt > 0) {                           // ohne Zeit kein Schritt im Ablauf
    if (z.lauf === 'spiel') {
      const v = _m6tDATEN[sc.g], n = v.length, vor = sc.s;
      sc.s += dt;
      const th = _m6tHaltZeit(n);
      if (z.haltAn && !z.angehalten && vor < th && sc.s >= th) {   // Halt: alle gelandet, noch nicht geordnet
        sc.s = th; z.angehalten = true;
        z.pause = true; z.halt = { n };
      }
      const k1 = _m6tKl1(n);
      if (sc.g === 'B' && vor < k1 && sc.s >= k1) { // Aha: die Klammer spannt 6 m
        const R = _m6tRang(v);
        z.ahaGlanz = K.T_AHA;
        _bioFxWelle(z.fx.teile, (_m6tX(v[R.idx[0]]) + _m6tX(v[R.idx[n - 1]])) / 2, K.KLY - 6, '#f59e0b', 64);
      }
      if (sc.s >= _m6tEnde(n)) { sc.s = Infinity; z.lauf = null; }
    } else if (z.lauf === 'gegen') {
      sc.q += dt;
      if (sc.q >= K.G_ENDE) { sc.q = Infinity; z.lauf = null; }
    }
  }
  if (_m6tSchluessel() !== z.schluessel) _m6tStatus();
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6tRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')';
}
function _m6tText(ctx, s, x, y, gr, farbe, ausr, gew) {
  ctx.font = (gew || '700') + ' ' + gr + 'px sans-serif';
  ctx.fillStyle = farbe; ctx.textAlign = ausr || 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Hallenboden, Startlinie, Massband – stehen immer.
function _m6tHalle(ctx) {
  const K = _m6tK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.fillStyle = K.F_BODEN;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.strokeStyle = '#cbbfa6'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.stroke();
  // Startlinie, genau ueber der 0 des Massbands
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 3; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(K.X0, K.SY0); ctx.lineTo(K.X0, K.MY0); ctx.stroke();
  // Massband
  const x0 = K.X0 - 6, x1 = _m6tX(K.MMAX) + K.MENDE;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  ctx.fillRect(x0 + 1.5, K.MY0 + 2, x1 - x0, K.MY1 - K.MY0);
  ctx.fillStyle = K.F_BAND; ctx.strokeStyle = K.F_BANDRAND; ctx.lineWidth = 1;
  ctx.fillRect(x0, K.MY0, x1 - x0, K.MY1 - K.MY0);
  ctx.strokeRect(x0, K.MY0, x1 - x0, K.MY1 - K.MY0);
  ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 1.2;
  for (let m = 0; m <= K.MMAX; m++) {
    const x = _m6tX(m);
    ctx.beginPath(); ctx.moveTo(x, K.MY0); ctx.lineTo(x, K.MY0 + 5); ctx.stroke();
    _m6tText(ctx, String(m), x, K.MY1 - 2.5, 10, '#1f2937', 'center', '700');
  }
  _m6tText(ctx, 'm', _m6tX(K.MMAX) + K.ME, K.MY1 - 2.5, 10, '#1f2937', 'center', '700');   // Einheit
  ctx.restore();
}
// Ein Papierflieger, Spitze bei (x, y), nach rechts; k = Groesse, rot = Neigung.
function _m6tFlieger(ctx, x, y, farbe, k, rot, a) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  ctx.lineJoin = 'round';
  ctx.fillStyle = _m6tRgba(farbe, 0.5);              // oberer Fluegel heller
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-18, -7); ctx.lineTo(-13, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = farbe;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-13, 0); ctx.lineTo(-18, 7); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = farbe; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-18, -7); ctx.lineTo(-13, 0); ctx.lineTo(-18, 7); ctx.closePath(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-1.5, 0); ctx.lineTo(-12.5, 0); ctx.stroke();
  ctx.restore();
}
// Lot von (x, y0) nach unten bis y1, gestrichelt; spart das Massband aus. w = gewachsen 0..1
function _m6tLot(ctx, x, y0, y1, farbe, w, a, versatz) {
  const K = _m6tK;
  if (w <= 0 || a <= 0.01) return;
  const t1 = [y0, K.MY0 - 1], t2 = [K.MY1 + 1, y1];
  const l1 = Math.max(0, t1[1] - t1[0]), l2 = Math.max(0, t2[1] - t2[0]);
  let rest = w * (l1 + l2);
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = farbe; ctx.lineWidth = 1.6;
  ctx.setLineDash([4, 4]);
  if (versatz) ctx.lineDashOffset = versatz;
  for (const [ya, l] of [[t1[0], l1], [t2[0], l2]]) {
    if (rest <= 0 || l <= 0) continue;
    const d = Math.min(l, rest);
    ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x, ya + d); ctx.stroke();
    rest -= d;
  }
  ctx.setLineDash([]);
  ctx.restore();
}
// Aha: bernsteinfarbener Schein hinter der Klammer (aha = 0..1); liegt UNTER Loten und Klammer.
function _m6tKlammerGlanz(ctx, xa, xb, y, a, aha) {
  const K = _m6tK;
  if (aha <= 0 || a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a) * aha;
  ctx.fillStyle = 'rgba(252,211,77,0.35)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
  _bioFxRundRect(ctx, xa - 7, y - K.ZACKE - 11, xb - xa + 14, K.ZACKE + 16, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Klammer von xa nach xb bei y (Enden zeigen nach oben); spann = 0..1 gespannt.
function _m6tKlammer(ctx, xa, xb, y, farbe, spann, a) {
  const K = _m6tK;
  if (spann <= 0 || a <= 0.01) return;
  const xe = xa + (xb - xa) * spann;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = farbe; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(xa, y - K.ZACKE); ctx.lineTo(xa, y); ctx.lineTo(xe, y); ctx.lineTo(xe, y - K.ZACKE);
  ctx.stroke();
  ctx.restore();
}
// Laenge ueber der Klammer (zahl = 0..1 aufgesprungen), auf weissem Schild – zuletzt
// gezeichnet, damit kein Lot durch die Zahl laeuft. Passt sie nicht zwischen die
// Enden, steht sie rechts daneben.
function _m6tKlammerZahl(ctx, xa, xb, y, farbe, zahl, text, a) {
  if (zahl <= 0 || a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.font = '700 13px sans-serif';
  const bw = ctx.measureText(text).width + 10, bh = 15;
  const innen = xb - xa >= bw + 8;
  const cx = innen ? (xa + xb) / 2 : xb + 6 + bw / 2, cy = innen ? y - 9 : y - 7;
  const k = Math.max(0.3, _bioFxEase.federn(_bioFxKlemme(zahl)));
  ctx.translate(cx, cy); ctx.scale(k, k);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = farbe; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, -bw / 2, -bh / 2, bw, bh, 5); ctx.fill(); ctx.stroke();
  _m6tText(ctx, text, 0, 4.6, 13, farbe, 'center', '700');
  ctx.restore();
}
// Eine Szene (Gruppe g, Ablaufzeit s, Gegenprobe q) mit Deckkraft a
function _m6tSzene(ctx, sc, a) {
  if (!sc || !sc.g || a <= 0.01) return;
  const z = _m6t, K = _m6tK, E = _bioFxEase, kl = _bioFxKlemme;
  const v = _m6tDATEN[sc.g], n = v.length, R = _m6tRang(v), s = sc.s, q = sc.q;
  const ein = a * kl((s - K.T_EIN0) / K.T_EIN);
  if (ein <= 0.01) return;
  const uO = E.sanft(kl((s - _m6tOrd0(n)) / K.T_ORD));            // Ordnen 0..1
  const yB = i => { const y0 = _m6tBahnY(i, n), y1 = _m6tBahnY(R.r[i], n); return y0 + (y1 - y0) * uO; };
  const lo = R.idx[0], hi = R.idx[n - 1];                         // kuerzester, weitester Flug
  const leucht = kl((s - _m6tLeucht(n)) / K.T_LEUCHT);
  const spann = E.sanft(kl((s - _m6tKl0(n)) / K.T_KL));
  const zahl = kl((s - _m6tKl1(n)) / K.T_ZPOP);
  const gq = q === null || q === undefined ? null : q;
  const gL = gq === null ? 0 : kl(gq / K.G_LEUCHT);
  const gSpann = gq === null ? 0 : E.sanft(kl((gq - K.G_KL0) / (K.G_KL1 - K.G_KL0)));
  const gZahl = gq === null ? 0 : kl((gq - K.G_KL1) / K.G_ZPOP);
  const gLo = Math.min(v[0], v[n - 1]), gHi = Math.max(v[0], v[n - 1]);
  const aussen = i => v[i] < gLo || v[i] > gHi;
  const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);   // ruhig, unter 1 Hz
  // Bahnen, die sich weiter bewegen, liegen oben
  const reihe = v.map((_, i) => i).sort((p, r) => Math.abs(R.r[p] - p) - Math.abs(R.r[r] - r) || p - r);
  const hebt = uO > 0 && uO < 1;
  // 1. Leuchtbaender hinter erster und letzter Bahn (nach dem Ordnen): gelber Schein,
  //    Rand in der Farbe der Klammer – Orange gehoert allein der Gegenprobe.
  if (leucht > 0) for (const i of [lo, hi]) {
    const y = yB(i);
    ctx.save();
    ctx.globalAlpha = ein * leucht;
    ctx.fillStyle = 'rgba(252,211,77,0.42)'; ctx.strokeStyle = K.F_KLAMMER; ctx.lineWidth = 1.8;
    _bioFxRundRect(ctx, K.KX0 - 3, y - K.BH / 2 - 2.5, K.BX1 - K.KX0 + 5, K.BH + 5, 8); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // 2. Bahnen mit Kaertchen „Flug n“, Spur, Landestrich und Flieger
  for (const i of reihe) {
    const y = yB(i), farbe = _m6tFARBE[i], xL = _m6tX(v[i]);
    const zieht = hebt && R.r[i] !== i;
    ctx.save();
    if (zieht) {                                     // gleitende Bahn hebt sich: Schatten darunter
      ctx.globalAlpha = ein * 0.14; ctx.fillStyle = '#0f172a';
      _bioFxRundRect(ctx, K.KX0 + 2, y - K.KH / 2 + 3, K.KW, K.KH, 4); ctx.fill();
      _bioFxRundRect(ctx, K.X0, y - K.BH / 2 + 3, K.BX1 - K.X0 + 2, K.BH, 6); ctx.fill();
    }
    ctx.globalAlpha = ein;
    ctx.fillStyle = _m6tRgba(farbe, zieht ? 0.16 : 0.10); ctx.strokeStyle = _m6tRgba(farbe, 0.45); ctx.lineWidth = 1;
    _bioFxRundRect(ctx, K.X0 - 2, y - K.BH / 2, K.BX1 - K.X0 + 2, K.BH, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = farbe;
    _bioFxRundRect(ctx, K.KX0, y - K.KH / 2, K.KW, K.KH, 4); ctx.fill();
    _m6tText(ctx, 'Flug ' + (i + 1), K.KX0 + K.KW / 2, y + 4, 11, '#ffffff', 'center', '700');
    ctx.restore();
    // Gegenprobe: Bahn von Flug 1 und vom letzten Flug orange umrandet
    if (gL > 0 && (i === 0 || i === n - 1)) {
      ctx.save();
      ctx.globalAlpha = ein * gL;
      ctx.strokeStyle = K.F_GEGEN; ctx.lineWidth = 2.2;
      _bioFxRundRect(ctx, K.KX0 - 2, y - K.BH / 2 - 1.5, K.BX1 - K.KX0 + 3, K.BH + 3, 7); ctx.stroke();
      ctx.restore();
    }
    // Flug: wartet, fliegt im Bogen, ist gelandet
    const u = (s - _m6tStart(i)) / K.T_FL;
    let nx = K.X0 - 3, h = 0, k = 1, rot = 0, fliegt = false;
    if (u >= 1) nx = xL;
    else if (u > 0) {
      const b = Math.sin(Math.PI * u);
      nx = K.X0 - 3 + (xL - K.X0 + 3) * E.raus(u);
      h = 13 * b; k = 1 + 0.3 * b; rot = -0.32 * Math.cos(Math.PI * u); fliegt = true;
    }
    ctx.save();
    ctx.globalAlpha = ein;
    if (u > 0) {                                     // Spur am Boden
      ctx.strokeStyle = _m6tRgba(farbe, fliegt ? 0.5 : 0.6); ctx.lineWidth = 2; ctx.lineCap = 'butt';
      if (fliegt) ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(K.X0 + 2, y); ctx.lineTo(Math.max(K.X0 + 2, nx - 14), y); ctx.stroke();
      ctx.setLineDash([]);
    }
    if (u >= 1) {                                    // Landestrich
      ctx.strokeStyle = farbe; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(xL, y - K.BH / 2 + 1.5); ctx.lineTo(xL, y + K.BH / 2 - 1.5); ctx.stroke();
    }
    // Schatten am Boden (bleibt unten, wenn der Flieger steigt)
    ctx.globalAlpha = ein * (fliegt ? 0.16 * (1 - 0.4 * Math.sin(Math.PI * u)) : 0.13);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.ellipse(nx - 9, y + 3, 8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // Gegenprobe: Flieger ausserhalb der orangen Klammer leuchten orange
    if (gZahl > 0 && aussen(i)) {
      ctx.save();
      ctx.globalAlpha = ein * gZahl;
      ctx.fillStyle = _m6tRgba(K.F_GEGEN, 0.22 + 0.16 * puls); ctx.strokeStyle = K.F_GEGEN; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(nx - 8, y, 12.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    _m6tFlieger(ctx, nx, y - h, farbe, k, rot, ein);
    // Marke am Massband
    const mp = kl((s - _m6tLandung(i)) / K.T_KPOP);
    if (mp > 0) {
      const mk = Math.max(0.3, E.federn(mp));
      ctx.save();
      ctx.globalAlpha = ein;
      ctx.translate(xL, K.MY0); ctx.scale(mk, mk);
      ctx.fillStyle = farbe;
      ctx.beginPath(); ctx.moveTo(-4.5, -6); ctx.lineTo(4.5, -6); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }
  // 3. Schein (Aha), Lote, Klammern, zuletzt die Zahlen – so laeuft kein Lot durch eine Zahl
  const xa = _m6tX(v[lo]), xb = _m6tX(v[hi]), ga = _m6tX(v[0]), gb = _m6tX(v[n - 1]);
  _m6tKlammerGlanz(ctx, xa, xb, K.KLY, ein, z.szene === sc && z.ahaGlanz > 0 ? Math.min(1, z.ahaGlanz / 0.6) : 0);
  _m6tLot(ctx, xa, yB(lo) + 5, K.KLY, _m6tFARBE[lo], leucht, ein, 0);
  _m6tLot(ctx, xb, yB(hi) + 5, K.KLY, _m6tFARBE[hi], leucht, ein, 0);
  if (gq !== null) {
    _m6tLot(ctx, ga, yB(0) + 5, K.GKY, K.F_GEGEN, gL, ein, 4);
    _m6tLot(ctx, gb, yB(n - 1) + 5, K.GKY, K.F_GEGEN, gL, ein, 4);
  }
  _m6tKlammer(ctx, xa, xb, K.KLY, K.F_KLAMMER, spann, ein);
  if (gq !== null) _m6tKlammer(ctx, ga, gb, K.GKY, K.F_GEGEN, gSpann, ein);
  _m6tKlammerZahl(ctx, xa, xb, K.KLY, K.F_KLAMMER, zahl, _m6tM(v[hi] - v[lo]), ein);
  if (gq !== null) _m6tKlammerZahl(ctx, ga, gb, K.GKY, K.F_GEGEN_TEXT, gZahl, _m6tM(v[n - 1] - v[0]), ein);
  // 4. Wertkaertchen unter der Halle: springen bei der Landung auf, sortieren sich beim Ordnen
  for (const i of reihe) {
    const pop = kl((s - _m6tLandung(i)) / K.T_KPOP);
    if (pop <= 0) continue;
    const p0 = i, p1 = R.r[i], x = _m6tWertX(p0, n) + (_m6tWertX(p1, n) - _m6tWertX(p0, n)) * uO;
    // nach rechts im Bogen 20 px nach oben, nach links 6 px nach unten: zusammen eine
    // Kaertchenhoehe (26 px), so gehen zwei, die sich kreuzen, aneinander vorbei
    const b = Math.sin(Math.PI * uO), dy = p1 > p0 ? -20 * b : p1 < p0 ? 6 * b : 0;
    const k = Math.max(0.3, E.federn(pop)), farbe = _m6tFARBE[i];
    ctx.save();
    ctx.globalAlpha = ein;
    ctx.translate(x, K.WY + K.WH / 2 + dy); ctx.scale(k, k);
    if (gZahl > 0 && aussen(i)) {
      ctx.save();
      ctx.globalAlpha = ein * gZahl;
      ctx.strokeStyle = K.F_GEGEN; ctx.lineWidth = 3;
      _bioFxRundRect(ctx, -K.WW / 2 - 3, -K.WH / 2 - 3, K.WW + 6, K.WH + 6, 7); ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = 'rgba(15,23,42,0.12)';
    _bioFxRundRect(ctx, -K.WW / 2 + 1.5, -K.WH / 2 + 2, K.WW, K.WH, 5); ctx.fill();
    ctx.fillStyle = farbe;
    _bioFxRundRect(ctx, -K.WW / 2, -K.WH / 2, K.WW, K.WH, 5); ctx.fill();
    _m6tText(ctx, _m6tM(v[i]), 0, 5, 14, '#ffffff', 'center', '700');
    ctx.restore();
  }
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
// Es endet ueber der obersten Bahn (y = 37 bei fuenf Bahnen).
function _m6tPauseSchild(ctx) {
  const z = _m6t, w = 64, h = 25, x = 8, y = 8;
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
  _m6tText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6tDraw(ctx, cv) {
  if (!_m6t) return;
  const z = _m6t, K = _m6tK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6tHalle(ctx);
  if (z.alt) _m6tSzene(ctx, z.alt.szene, 1 - _bioFxKlemme(z.alt.at / K.T_ALT));
  _m6tSzene(ctx, z.szene, 1);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6tPauseSchild(ctx);
}
