
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mr5 „Was steht für das x?“ (Kennung m5-terme)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL5_PROFIL.md, Abschnitt m5-terme
// (Einheit mr5; Regeln N1–N3, Lehrkraft-Zeile, V7 Abspieldauer) und
// einheiten/mr5.json, sim_plan. Ueberschrift = Name der Einheit „Was steht
// für das x?“ (die `frage` nennt das Schwimmbad; nach „anderer Term“ zeigt
// die Simulation auch andere Terme).
//
// Was man sieht (Leinwand 420 x 250):
//   LINKS eine Leiste mit elf Karten 0 bis 10 (nur Bild, keine Ueberschrift).
//     Eine Karte, die gerade auf dem x liegt, fehlt in der Leiste; ihr Platz
//     ist gestrichelt. Oben links bleibt der Platz fuer das Schild „Pause“.
//   OBEN ein Schild mit dem Term gross (30 px): „x · 3 €“, „x + 5“ oder
//     „2 · x + 1“. Das x steht in einem ORANGEN Kreis. Die eingesetzte Karte
//     (weiss, oranger Rand, Ziffer dunkelorange) liegt auf dem x und deckt es zu.
//   DARUNTER die Rechnung mit der eingesetzten Zahl („4 · 3 € = 12 €“), die
//     Zahl fuer x orange wie die Karte, „3 €“ in Geldbraun, „5“/„1“ blau.
//   RECHTS UNTEN der Tisch:
//     x · 3 €    – x Reihen zu je 3 Ein-Euro-Muenzen (Punktefeld-Logik aus mm1),
//                  nach der 5. Reihe ein groesserer Abstand. Rechts an jeder
//                  Reihe eine kleine Klammer „3 €“ (geldbraun), links eine
//                  Klammer ueber alle Reihen mit ihrer Anzahl (orange wie x).
//     x + 5      – oben x orange Plaettchen, darunter 5 blaue (Fuenferluecke);
//                  rechts an jeder Reihe ihre Anzahl in ihrer Farbe.
//     2 · x + 1  – 2 Reihen zu je x orangen Plaettchen (links Klammer „2“),
//                  darunter 1 blaues.
//   Orange ist ueberall „x“: Kreis, Karte, die Zahl in der Rechnung, die
//   Plaettchen bzw. die Reihenzahl. So sind Bild und Zeichen verbunden.
//
// Bewegung (eine Sprungmarke spielt SELBST ab, N1; anhalten kann die
// Lehrkraft). Jede Zahl im Bild und in der Anzeige kommt aus (Term, x) und der
// Ablaufzeit L.t – kein Zufall.
//   Sprungmarke „x = n“  Vorlauf: das alte Bild blendet aus (0,15 s; stand ein
//                anderer Term da, klappt statt dessen das Schild in 0,5 s auf
//                „x · 3 €“ um), die alte Karte kehrt in die Leiste zurueck →
//                die Karte n fliegt im Bogen aus der Leiste auf das x und legt
//                sich darueber (0,7 s) → die Rechnung blendet ein, ihre Zahlen
//                federn (0,3 s) → die Muenzreihen fallen Reihe fuer Reihe ein
//                (alle 0,2 s eine, je 0,3 s Fall mit kleinem Aufprall, jede
//                Reihe leuchtet kurz).
//   „x + 1“      die Karte gleitet vom x zurueck in die Leiste (0,28 s), die
//                naechste kommt auf das x (0,32 s); dann federn Zahl und Wert
//                der Rechnung, und eine Muenzreihe gleitet von rechts herein
//                (0,5 s) – bei den anderen Termen springt in jeder orangen
//                Reihe ein Plaettchen dazu.
//   „x − 1“      ebenso mit der Karte davor; die letzte Muenzreihe gleitet
//                nach rechts hinaus bzw. je ein oranges Plaettchen verschwindet.
//   „anderer Term“  das Schild klappt um (0,5 s), die eingesetzte Karte bleibt
//                (sie klappt mit); Rechnung und Material blenden aus, der neue
//                Term, seine Rechnung und sein Material kommen (bis 0,7 s).
//                Reihenfolge: „x · 3 €“ → „x + 5“ → „2 · x + 1“ → „x · 3 €“.
//   „neu“        sofort der Start; alles blendet ein (0,35 s).
//   Gemessen (Frames zu 16 ms, Tempo normal):
//     Sprungmarke vom Start oder vom Term x · 3 €:  „x = 1“ 1,45 s = 91 Frames,
//       „x = 4“ 2,05 s = 129 Frames (Muenzzeile steht ab Frame 129);
//     Sprungmarke von einem anderen Term (Schild klappt): „x = 4“ 2,40 s = 150;
//     „x + 1“ / „x − 1“ 1,10 s = 69 Frames; „anderer Term“ 0,70 s = 44 Frames.
//   simfakten.js mit --frames=40 --verlauf=4 liest bis Frame 200 (alles fertig).
//   Ziel ≤ 3 s je Sprungmarke: erfuellt.
// Wer waehrend eines Ablaufs einen Knopf drueckt, laesst ihn sofort ankommen
// (_m6eFertig); dann beginnt das Neue. Jede Knopffolge ergibt so dieselben Zahlen.
// Grenzen: x von 0 bis 10. „x + 1“ bei 10 bzw. „x − 1“ bei 0: die Karte auf dem
// x wackelt kurz, sonst aendert sich nichts, und _m6e-grenze zeigt „x geht hier
// nur von 0 bis 10.“ (bis zur naechsten Handlung; sonst ausgeblendet und leer).
// Solange nichts eingesetzt ist, sind „x + 1“ und „x − 1“ blass und tun nichts.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6eMarke(1) … (4)):
//     „x = 1“ · „x = 2“ · „x = 3“ · „x = 4“ – stellen IMMER den Term x · 3 € her.
//   Reihe 2: „x + 1“ · „x − 1“ (_m6eSchritt(1|-1)) · „anderer Term“
//     (_m6eAnderer()) · „neu“ (_m6eNeu())
//   Hervorgehoben ist die Sprungmarke, deren Karte gerade auf dem x von
//   „x · 3 €“ liegt (oder dorthin unterwegs ist).
//
// Statuszeilen (woertlich, alle mit mindestens 19 Zeichen – simfakten.js):
//   _m6e-term      „Der Term heißt: x · 3 €“ / „Der Term heißt: x + 5“ /
//                  „Der Term heißt: 2 · x + 1“
//   _m6e-x         „Für x eingesetzt: 4“ (Start „Für x eingesetzt: noch nichts“)
//   _m6e-rechnung  „Rechnung: 4 · 3 € = 12 €“ / „Rechnung: 3 + 5 = 8“ /
//                  „Rechnung: 2 · 4 + 1 = 9“ (Start „Rechnung: noch nichts eingesetzt“)
//   _m6e-wert      „Der Term hat den Wert: 12 €“ / „… : 8“ (Start „… : noch keinen“)
//   _m6e-muenzen   nur beim Term x · 3 €: „Münzen auf dem Tisch: 12 €“ (zaehlt
//                  beim Einfallen mit; Start „Münzen auf dem Tisch: 0 €“);
//                  bei den anderen Termen leer und ausgeblendet
//   _m6e-grenze    nur an der Grenze (siehe oben)
//   x, Rechnung und Wert wechseln in dem Augenblick, in dem die Karte auf dem
//   x landet; die Muenzzeile, wenn die Reihe liegt. Zwischen Zahl und € und um
//   die Rechenzeichen im Term steht ein geschuetztes Leerzeichen (U+00A0).
//
// Werte (nachgerechnet mit simcheck/werte.js):
//   x · 3 € mit x = 0 … 10 → 0 €, 3 €, 6 €, 9 €, 12 €, 15 €, 18 €, 21 €, 24 €,
//     27 €, 30 €; Rechnung „x · 3 € = …“ mit der eingesetzten Zahl
//     („Rechnung: 0 · 3 € = 0 €“). Muenzen auf dem Tisch = Wert.
//   x + 5:     x = 3 → „Rechnung: 3 + 5 = 8“, Wert 8; x = 7 → 7 + 5 = 12.
//   2 · x + 1: x = 4 → „Rechnung: 2 · 4 + 1 = 9“, Wert 9; x = 5 → 11; x = 10 → 21.
//   „x = 4“, dann 7-mal „x + 1“: beim 6. Druck „Für x eingesetzt: 10“,
//     „Rechnung: 10 · 3 € = 30 €“; beim 7. „x geht hier nur von 0 bis 10.“
// Start: Term x · 3 €, nichts eingesetzt, Tisch leer, alle Karten in der
// Leiste („Start: Term x · 3 €, noch nichts eingesetzt“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): „x + 1“ von x = 1 nach x = 2 beim
// Term x · 3 € – in dem Augenblick, in dem die Karte 2 auf dem x landet, breitet
// sich ein Lichtring um die Karte aus, ihr Rand leuchtet 1,4 s bernstein:
// dasselbe x, eine andere Zahl. Danach gleitet die zweite Muenzreihe herein.
//
// FUER DIE LEHRKRAFT (Container <div class="fpm-lehrkraft">, simfakten.js
// ueberspringt ihn): eigene Zeile unter den Heftknoepfen, davor klein „Für die
// Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6eAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links (Stelle und Aussehen wie m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6eTempo()): ein Drittel so schnell.
//   „Wert verdecken: aus“ ↔ „… an“ (_m6eVerdecken()): verdeckt Rechnung, Wert
//     und Muenzzeile – in den Statuszeilen „verdeckt“, im Bild eine graue Karte
//     „?“ statt des Werts der Rechnung. Term, Karte und Material bleiben
//     sichtbar: zum Vermuten an der Tafel.
//   Eine Sprungmarke und „neu“ heben die Pause auf; Tempo und Verdecken bleiben
//   stehen. „x ± 1“ und „anderer Term“ werden in der Pause VORGEMERKT, wenn
//   nichts unterwegs ist (sie beginnen mit „weiter“), und ENTFALLEN, wenn eine
//   Bewegung steht; das Schild „Pause“ leuchtet dabei kurz auf (echte Zeit).
//   Das wechselnde Wort steht in einem eigenen <span>. Hinweiszeile
//   _m6e-lehrkraft (in der Pause bernsteinfarben). Voreinstellung: Pause aus,
//   Tempo normal, Wert sichtbar. EIN Zeitfaktor (_m6eZeitfaktor: 0 Pause,
//   1/3 langsam, 1 normal) am Anfang von _m6eUpdate.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Zahl“ als Regelwort
// (kein „x steht für eine Zahl“, auch nicht im Hinweis), „Variable“, die Regel
// als Satz. „Term“ und „eingesetzt“ sind erlaubt. Keine Namen, keine Punkte,
// keine Zeitmessung, kein „falsch“. Malpunkt · (U+00B7), nie „×“, nie „3x“.
// ════════════════════════════════════════════════════════════════════════
let _m6e = null;
const _m6eNB = ' ';                         // geschuetztes Leerzeichen
const _m6eK = {
  // Leiste der Karten (links, unter dem Platz fuer das Schild „Pause“)
  LX0: 6, LX1: 56, LY0: 37, LY1: 246,
  KX: 31, KY0: 47, KP: 18.9, KW: 40, KH: 15, KG: 12,  // Karte in der Leiste: Mitte, Abstand, Groesse, Schrift
  MAXX: 10,
  // Schild mit dem Term
  SX0: 78, SX1: 414, SY0: 6, SY1: 60, SM: 246, SYM: 33, SG: 30,
  XR: 18, XW: 40,                                       // Kreis um das x, Platz des x im Term
  AW: 40, AH: 42, AG: 28,                               // Karte auf dem x
  // Rechnung unter dem Schild
  RY: 86, RG: 20,
  // Tisch
  TX0: 64, TX1: 414, TY0: 98, TY1: 246,
  // Muenzen (x Reihen zu je 3): Radius, Abstand, erste Muenze, Reihen, Klammern
  MR: 5.3, MP: 14, MX0: 232, MY0: 111, MRP: 12.6, MRG: 6, KLX: 270, KLAX: 222,
  // Plaettchen (x + 5, 2 · x + 1): Radius, Abstand, Fuenferluecke, erste Spalte, Reihen
  PR: 6.2, PP: 15, P5: 6, PX0: 186, P1Y: [138, 172], P2Y: [126, 150, 184],
  // Zeiten in s
  T_LEER: 0.15, T_KLAPP: 0.5, T_FLUG: 0.7, T_RECH: 0.3, T_REIHE: 0.2, T_FALL: 0.3,
  T_WEG: 0.28, T_HER: 0.32, T_W: 0.6, T_ZEILE: 0.5, T_NEUMAT: 0.2, T_KLAPPENDE: 0.7,
  T_POP: 0.3, T_GLANZ: 0.9, T_NEU: 0.35, T_AHA: 1.4, T_WACKEL: 0.45, LANGSAM: 1 / 3,
  // Farben
  F_TINTE: '#0f172a', F_X: '#ea580c', F_XD: '#c2410c', F_BLAU: '#1d4ed8',
  F_GELD: '#b45309', F_GRAU: '#64748b'
};

// ── Rechnen ─────────────────────────────────────────────────────────────
function _m6eE(n) { return n + _m6eNB + '€'; }          // „12 €“ mit geschuetztem Leerzeichen
function _m6eWertZahl(term, x) { return term === 0 ? 3 * x : term === 1 ? x + 5 : 2 * x + 1; }
function _m6eBetrag(term, x) {
  const w = _m6eWertZahl(term, x);
  return term === 0 ? _m6eE(w) : String(w);
}
// Term fuer die Statuszeile, das x orange
function _m6eTermHTML(term) {
  const N = _m6eNB, X = '<b style="color:' + _m6eK.F_X + '">x</b>';
  if (term === 0) return X + N + '·' + N + _m6eE(3);
  if (term === 1) return X + N + '+' + N + '5';
  return '2' + N + '·' + N + X + N + '+' + N + '1';
}
// Rechnung fuer die Statuszeile, die eingesetzte Zahl orange
function _m6eRechnungHTML(term, x) {
  const N = _m6eNB, X = '<b style="color:' + _m6eK.F_XD + '">' + x + '</b>';
  const w = '<b>' + _m6eBetrag(term, x) + '</b>';
  if (term === 0) return X + N + '·' + N + _m6eE(3) + ' = ' + w;
  if (term === 1) return X + N + '+' + N + '5 = ' + w;
  return '2' + N + '·' + N + X + N + '+' + N + '1 = ' + w;
}
// Teile eines Terms fuer das Bild. x === null: Schild (mit Kreis-x);
// sonst die Rechnung mit der eingesetzten Zahl und dem Wert.
function _m6eTeile(term, x) {
  const K = _m6eK, schild = x === null || x === undefined;
  const X = schild ? { x: true } : { s: String(x), f: K.F_XD, zahl: true };
  const t = term === 0 ? [X, { s: '·' }, { s: _m6eE(3), f: K.F_GELD }]
          : term === 1 ? [X, { s: '+' }, { s: '5', f: K.F_BLAU }]
          : [{ s: '2' }, { s: '·' }, X, { s: '+' }, { s: '1', f: K.F_BLAU }];
  if (!schild) t.push({ s: '=' }, { s: _m6eBetrag(term, x), wert: true });
  return t;
}
// Teile mittig setzen: Mitte und Breite jedes Teils
function _m6eLegen(ctx, teile, gr, mitte) {
  ctx.font = '700 ' + gr + 'px sans-serif';
  const br = teile.map(t => t.x ? _m6eK.XW : ctx.measureText(t.s).width);
  const luft = gr * 0.32;
  const ges = br.reduce((a, b) => a + b, 0) + luft * (teile.length - 1);
  const xm = [];
  let x = mitte - ges / 2;
  br.forEach(b => { xm.push(x + b / 2); x += b + luft; });
  return { xm, br };
}
// Mitte des x auf dem Schild fuer einen Term
function _m6eXMitte(ctx, term) {
  ctx.save();
  const teile = _m6eTeile(term, null), L = _m6eLegen(ctx, teile, _m6eK.SG, _m6eK.SM);
  ctx.restore();
  return L.xm[teile.findIndex(t => t.x)];
}
// Lage einer Karte: in der Leiste bzw. auf dem x
function _m6eSlot(i) { const K = _m6eK; return { x: K.KX, y: K.KY0 + i * K.KP, w: K.KW, h: K.KH, g: K.KG }; }
function _m6eAufX(xc) { const K = _m6eK; return { x: xc, y: K.SYM, w: K.AW, h: K.AH, g: K.AG }; }
// Muenzreihe i (nach der 5. Reihe ein groesserer Abstand), Plaettchen-Spalte j (Fuenferluecke)
function _m6eMY(i) { const K = _m6eK; return K.MY0 + i * K.MRP + (i >= 5 ? K.MRG : 0); }
function _m6ePX(j) { const K = _m6eK; return K.PX0 + j * K.PP + (j >= 5 ? K.P5 : 0); }
// Stelle der Klammer hinter n Plaettchen
function _m6eKlX(n) { const K = _m6eK; return n > 0 ? _m6ePX(n - 1) + K.PR + 4 : K.PX0 - K.PR - 2; }

// ── Was gerade gilt (fuer die Anzeige) ──────────────────────────────────
// term/x: was das Bild gerade zeigt; rech: die Rechnung steht da;
// reihen: so viel Material liegt fertig auf dem Tisch (bei x · 3 € = Muenzreihen).
function _m6eStand(z) {
  const L = z.lauf, K = _m6eK;
  if (!L) return { term: z.term, x: z.x, rech: z.x !== null, reihen: z.x === null ? 0 : z.x };
  const t = L.t, A = L.alt, N = L.neu;
  if (L.art === 'marke') {
    let reihen = 0;
    for (let k = 0; k < N.x; k++) if (t >= L.T.fall0 + k * K.T_REIHE + K.T_FALL) reihen++;
    return { term: t < L.vor / 2 ? A.term : N.term, x: t >= L.T.land ? N.x : null,
             rech: t >= L.T.land, reihen };
  }
  if (L.art === 'schritt')
    return { term: N.term, x: t >= K.T_W ? N.x : A.x, rech: true,
             reihen: t >= K.T_W + K.T_ZEILE ? N.x : A.x };
  // klapp
  if (t < K.T_KLAPP / 2) return { term: A.term, x: A.x, rech: A.x !== null, reihen: A.x === null ? 0 : A.x };
  return { term: N.term, x: N.x, rech: N.x !== null, reihen: t >= L.ende && N.x !== null ? N.x : 0 };
}
function _m6eSchl(s) { return s ? s.term + '|' + s.x + '|' + s.rech + '|' + s.reihen : ''; }

// ── Oberflaeche ─────────────────────────────────────────────────────────
function _m6eInit() {
  _m6e = { term: 0, x: null, lauf: null, t: 0, fx: { teile: [] }, st: null,
           glanz: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], popR: 0, wackel: 0, ein: 0, ahaGlanz: 0,
           grenze: '', xmitte: undefined,
           pause: false, langsam: false, verdeckt: false, blink: 0, vormerk: null };   // Lehrkraft
  _m6e.st = _m6eStand(_m6e);
}
function _m6eHTML() {
  const N = '&nbsp;';
  const marke = n => `<button class="sim-btn" id="_m6e-b-${n}" onclick="_m6eMarke(${n})">x${N}=${N}${n}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was steht für das x?</h3>
    <div class="fpm-note" style="margin-top:2px">Drücke einen Knopf „x${N}=${N}…“. Die Karte legt sich auf das x.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6e-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${[1, 2, 3, 4].map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6e-plus" onclick="_m6eSchritt(1)">x${N}+${N}1</button>
          <button class="sim-btn" id="_m6e-minus" onclick="_m6eSchritt(-1)">x${N}−${N}1</button>
          <button class="sim-btn" id="_m6e-anderer" onclick="_m6eAnderer()">anderer Term</button>
          <button class="sim-btn" id="_m6e-neu" onclick="_m6eNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6e-pause" onclick="_m6eAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6e-tempo" onclick="_m6eTempo()">Tempo: <span id="_m6e-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6e-verdeckt" onclick="_m6eVerdecken()">Wert verdecken: <span id="_m6e-verdeckt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6e-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6e-term" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6e-x" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6e-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6e-wert" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6e-muenzen" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_m6e-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Term x${N}·${N}3${N}€, noch nichts eingesetzt</p>
  </div>`;
}
function _m6eSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6eStatus() {
  if (!_m6e) return;
  const z = _m6e, K = _m6eK, st = _m6eStand(z), zu = z.verdeckt;
  z.st = st;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const da = st.rech && st.x !== null;
  _m6eSetze('_m6e-term', 'Der Term heißt: ' + _m6eTermHTML(st.term));
  _m6eSetze('_m6e-x', 'Für x eingesetzt: ' + (st.x === null ? 'noch nichts' : f(st.x, K.F_XD)));
  _m6eSetze('_m6e-rechnung', 'Rechnung: ' +
    (!da ? 'noch nichts eingesetzt' : zu ? 'verdeckt' : _m6eRechnungHTML(st.term, st.x)));
  _m6eSetze('_m6e-wert', 'Der Term hat den Wert: ' +
    (!da ? 'noch keinen' : zu ? 'verdeckt' : f(_m6eBetrag(st.term, st.x), K.F_TINTE)));
  // Muenzzeile nur beim Term x · 3 €; sonst leer und ausgeblendet
  const m = _m6eSetze('_m6e-muenzen', st.term !== 0 ? '' : 'Münzen auf dem Tisch: ' +
    (zu && st.x !== null ? 'verdeckt' : f(_m6eE(3 * st.reihen), K.F_GELD)));
  if (m && m.style) m.style.display = st.term === 0 ? '' : 'none';
  const g = _m6eSetze('_m6e-grenze', z.grenze);
  if (g && g.style) g.style.display = z.grenze ? '' : 'none';
  // Sprungmarke hervorheben, deren Karte auf dem x von „x · 3 €“ liegt (oder hinfliegt)
  for (let n = 1; n <= 4; n++) {
    const b = document.getElementById('_m6e-b-' + n);
    if (b && b.classList) b.classList.toggle('primary', z.term === 0 && z.x === n);
  }
  // „x + 1“ und „x − 1“ sind blass, solange nichts eingesetzt ist
  for (const id of ['_m6e-plus', '_m6e-minus']) {
    const b = document.getElementById(id);
    if (b) { b.disabled = z.x === null; if (b.style) b.style.opacity = z.x === null ? '0.45' : ''; }
  }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6eSetze('_m6e-pause', z.pause ? 'weiter' : 'Pause');
  _m6eSetze('_m6e-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6eSetze('_m6e-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6eSetze('_m6e-lehrkraft',
    z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : z.verdeckt ? 'Wert verdeckt. Erst vermuten lassen, dann wieder aufdecken.'
    : 'Für die Lehrkraft: „Pause“ hält alles an. „Wert verdecken“ lässt erst vermuten.');
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6e-pause', z.pause], ['_m6e-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
// z.term und z.x sind sofort der ZIELstand; z.lauf haelt fest, wie das Bild
// dorthin kommt (alt → neu). Ankommen lassen = den Ablauf beenden.
function _m6eFertig() { if (_m6e && _m6e.lauf) _m6e.lauf = null; }
// Sprungmarke „x = n“: immer der Term x · 3 €; spielt selbst ab. Hebt die Pause auf.
function _m6eMarke(n) {
  if (!_m6e || !(n >= 0 && n <= _m6eK.MAXX)) return;
  const z = _m6e, K = _m6eK;
  _m6eFertig();
  z.pause = false; z.vormerk = null; z.blink = 0;
  z.grenze = ''; z.wackel = 0; z.ein = 0; z.ahaGlanz = 0; z.fx.teile.length = 0;
  const alt = { term: z.term, x: z.x }, vor = z.term !== 0 ? K.T_KLAPP : K.T_LEER;
  const land = vor + K.T_FLUG, fall0 = land + K.T_RECH;
  z.term = 0; z.x = n;
  z.lauf = { art: 'marke', t: 0, alt, neu: { term: 0, x: n }, vor, T: { land, fall0 },
             ende: n > 0 ? fall0 + (n - 1) * K.T_REIHE + K.T_FALL : fall0 };
  _m6eStatus();
}
// „neu“: sofort der Start. Hebt die Pause auf.
function _m6eNeu() {
  if (!_m6e) return;
  const z = _m6e;
  z.lauf = null; z.pause = false; z.vormerk = null; z.blink = 0;
  z.term = 0; z.x = null; z.grenze = ''; z.wackel = 0; z.popR = 0; z.ahaGlanz = 0;
  z.glanz.fill(0); z.fx.teile.length = 0;
  z.ein = _m6eK.T_NEU;
  _m6eStatus();
}
// Waehrend der Pause: vormerken, wenn nichts unterwegs ist; sonst entfaellt der Druck.
function _m6eInDerPause(tat) {
  const z = _m6e;
  z.blink = 0.6;
  if (!z.lauf) z.vormerk = tat;
}
// „x + 1“ / „x − 1“
function _m6eSchritt(d) {
  if (!_m6e || (d !== 1 && d !== -1)) return;
  const z = _m6e, K = _m6eK;
  if (z.pause) { _m6eInDerPause(() => _m6eSchritt(d)); return; }
  _m6eFertig();
  z.grenze = '';
  if (z.x === null) { _m6eStatus(); return; }           // noch nichts eingesetzt: Knopf ist blass
  const nach = z.x + d;
  if (nach < 0 || nach > K.MAXX) {
    z.wackel = K.T_WACKEL; z.grenze = 'x geht hier nur von 0 bis 10.';
    _m6eStatus(); return;
  }
  const alt = { term: z.term, x: z.x };
  z.x = nach;
  z.lauf = { art: 'schritt', t: 0, alt, neu: { term: z.term, x: nach }, ende: K.T_W + K.T_ZEILE,
             aha: z.term === 0 && alt.x === 1 && nach === 2 };
  _m6eStatus();
}
// „anderer Term“: x · 3 € → x + 5 → 2 · x + 1 → x · 3 €; die Karte bleibt.
function _m6eAnderer() {
  if (!_m6e) return;
  const z = _m6e, K = _m6eK;
  if (z.pause) { _m6eInDerPause(() => _m6eAnderer()); return; }
  _m6eFertig();
  z.grenze = ''; z.wackel = 0;
  const alt = { term: z.term, x: z.x }, nach = (z.term + 1) % 3;
  z.term = nach;
  z.lauf = { art: 'klapp', t: 0, alt, neu: { term: nach, x: z.x },
             ende: z.x === null ? K.T_KLAPP : K.T_KLAPPENDE };
  _m6eStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
// „Pause“ ↔ „weiter“. Beim Weitermachen laeuft die Bewegung genau dort weiter,
// wo sie stand; ein vorgemerkter Knopf wirkt jetzt.
function _m6eAnhalten() {
  if (!_m6e) return;
  const z = _m6e;
  if (z.pause) {
    z.pause = false; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v && !z.lauf) v();
  } else z.pause = true;
  _m6eStatus();
}
function _m6eTempo() {
  if (!_m6e) return;
  _m6e.langsam = !_m6e.langsam;
  _m6eStatus();
}
function _m6eVerdecken() {
  if (!_m6e) return;
  _m6e.verdeckt = !_m6e.verdeckt;
  _m6eStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6eZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6eK.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6eUpdate(dt) {
  if (!_m6e) return;
  const z = _m6e, K = _m6eK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);               // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6eZeitfaktor(z);                       // ab hier Sim-Zeit
  z.t += dt;
  for (let i = 0; i < z.glanz.length; i++) z.glanz[i] = Math.max(0, z.glanz[i] - dt);
  z.popR = Math.max(0, z.popR - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  z.ein = Math.max(0, z.ein - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  const L = z.lauf;
  if (L && dt > 0) {                                  // ohne Zeit kein Schritt im Ablauf
    const vorher = L.t;
    L.t += dt;
    if (L.aha && vorher < K.T_W && L.t >= K.T_W) {
      // Aha: die Karte 2 liegt auf demselben x – Lichtring um die Karte
      z.ahaGlanz = K.T_AHA;
      _bioFxWelle(z.fx.teile, z.xmitte === undefined ? K.SM : z.xmitte, K.SYM, '#f59e0b', 58);
    }
    if (L.t >= L.ende) z.lauf = null;
  }
  // Hat sich die Anzeige geaendert? Dann leuchtet, was neu ist, und die Zeilen folgen.
  const st = _m6eStand(z), alt = z.st;
  if (_m6eSchl(st) !== _m6eSchl(alt)) {
    if (st.rech && (!alt || !alt.rech || alt.x !== st.x || alt.term !== st.term)) z.popR = K.T_POP;
    if (st.x !== null && alt && (st.reihen !== alt.reihen || st.term !== alt.term)) {
      if (st.term === 0) {
        const von = alt.term === 0 ? alt.reihen : 0;
        for (let i = von; i < st.reihen && i < 10; i++) z.glanz[i] = K.T_GLANZ;
      } else if (st.reihen > 0 || alt.reihen > 0) {
        z.glanz[0] = K.T_GLANZ;
        if (st.term === 2) z.glanz[1] = K.T_GLANZ;
      }
    }
    _m6eStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Was das Bild gerade zeigt ───────────────────────────────────────────
// schild: welcher Term, wie weit umgeklappt (flip 1 = flach) · aufX: Karte auf
// dem x · leiste[i]: Deckkraft der Karte i in der Leiste (0 = Platz leer) ·
// flug: fliegende Karten · rech: die Rechnung unter dem Schild
function _m6eSzene(ctx) {
  const z = _m6e, K = _m6eK, L = z.lauf, kl = _bioFxKlemme;
  const S = { schild: { term: z.term, flip: 1 }, aufX: null,
              leiste: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], flug: [], rech: null };
  if (!L) {
    if (z.x !== null) {
      S.aufX = { n: z.x, a: 1 }; S.leiste[z.x] = 0;
      S.rech = { term: z.term, x: z.x, a: 1, wertA: 1 };
    }
    return S;
  }
  const t = L.t, A = L.alt, N = L.neu;
  if (L.art === 'marke') {
    if (t < L.vor) {
      const u = kl(t / L.vor);
      if (A.term !== N.term) { S.schild.flip = Math.abs(Math.cos(Math.PI * u)); S.schild.term = u < 0.5 ? A.term : N.term; }
      if (A.x !== null) {                              // die alte Karte kehrt in die Leiste zurueck
        S.aufX = { n: A.x, a: 1 - u }; S.leiste[A.x] = u;
        S.rech = { term: A.term, x: A.x, a: 1 - u, wertA: 1 - u };
      }
    } else {
      S.leiste[N.x] = 0;
      if (t < L.T.land)
        S.flug.push({ n: N.x, von: _m6eSlot(N.x), nach: _m6eAufX(_m6eXMitte(ctx, N.term)), u: (t - L.vor) / K.T_FLUG });
      else {
        const a = kl((t - L.T.land) / K.T_RECH);
        S.aufX = { n: N.x, a: 1 };
        S.rech = { term: N.term, x: N.x, a, wertA: a };
      }
    }
    return S;
  }
  if (L.art === 'schritt') {
    const xc = _m6eXMitte(ctx, N.term);
    if (t < K.T_WEG) {                                 // die Karte gleitet zurueck in die Leiste
      S.leiste[A.x] = 0;
      S.flug.push({ n: A.x, von: _m6eAufX(xc), nach: _m6eSlot(A.x), u: t / K.T_WEG });
    } else if (t < K.T_W) {                            // die naechste kommt auf das x
      S.leiste[N.x] = 0;
      S.flug.push({ n: N.x, von: _m6eSlot(N.x), nach: _m6eAufX(xc), u: (t - K.T_WEG) / K.T_HER });
    } else { S.leiste[N.x] = 0; S.aufX = { n: N.x, a: 1 }; }
    S.rech = { term: N.term, x: t < K.T_W ? A.x : N.x, a: 1, wertA: 1 };
    return S;
  }
  // klapp: das Schild klappt um, die Karte klappt mit
  const m = K.T_KLAPP / 2;
  if (t < K.T_KLAPP) {
    const u = kl(t / K.T_KLAPP);
    S.schild.flip = Math.abs(Math.cos(Math.PI * u)); S.schild.term = u < 0.5 ? A.term : N.term;
  }
  if (z.x !== null) {
    S.aufX = { n: z.x, a: 1 }; S.leiste[z.x] = 0;
    const a = t < m ? 1 - kl(t / m) : kl((t - m) / m);
    S.rech = { term: t < m ? A.term : N.term, x: z.x, a, wertA: a };
  }
  return S;
}

// ── Zeichnen: Helfer ────────────────────────────────────────────────────
// Jeder Helfer setzt globalAlpha absolut (die Pruef-Leinwand liest nichts zurueck).
function _m6eFlaeche(ctx, x0, y0, x1, y1, r, fuell, rand) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(15,23,42,0.07)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 3, x1 - x0, y1 - y0, r); ctx.fill();
  ctx.fillStyle = fuell; ctx.strokeStyle = rand; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, r); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Karte mit Ziffer (G = Lage und Groesse), glanz > 0: bernsteinfarbener Rand (Aha)
function _m6eKarte(ctx, G, n, a, glanz) {
  if (a <= 0.01) return;
  const K = _m6eK, r = Math.min(6, G.h * 0.22), A = Math.min(1, a);
  ctx.save();
  ctx.globalAlpha = A;
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.F_X; ctx.lineWidth = G.h > 25 ? 2.5 : 1.5;
  _bioFxRundRect(ctx, G.x - G.w / 2, G.y - G.h / 2, G.w, G.h, r); ctx.fill(); ctx.stroke();
  if (glanz > 0) {
    ctx.globalAlpha = A * Math.min(1, glanz);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, G.x - G.w / 2 - 4, G.y - G.h / 2 - 4, G.w + 8, G.h + 8, r + 3); ctx.stroke();
    ctx.globalAlpha = A;
  }
  ctx.fillStyle = K.F_XD; ctx.font = '700 ' + G.g.toFixed(1) + 'px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(String(n), G.x, G.y + G.g * 0.36);
  ctx.restore();
}
// leerer Platz in der Leiste
function _m6eLeer(ctx, G) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 2.5]);
  _bioFxRundRect(ctx, G.x - G.w / 2, G.y - G.h / 2, G.w, G.h, 4); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
// fliegende Karte im Bogen, mit Schatten; Groesse geht von „von“ nach „nach“
function _m6eFlug(ctx, f) {
  const e = _bioFxEase.sanft(_bioFxKlemme(f.u)), V = f.von, N = f.nach;
  const lerp = (a, b) => a + (b - a) * e, bogen = Math.sin(Math.PI * e);
  const G = { x: lerp(V.x, N.x), y: lerp(V.y, N.y) - 26 * bogen, w: lerp(V.w, N.w), h: lerp(V.h, N.h), g: lerp(V.g, N.g) };
  ctx.save();
  ctx.globalAlpha = 0.16 * (0.4 + bogen); ctx.fillStyle = '#0f172a';
  _bioFxRundRect(ctx, G.x - G.w / 2 + 3, G.y - G.h / 2 + 4 + 6 * bogen, G.w, G.h, 5); ctx.fill();
  ctx.restore();
  _m6eKarte(ctx, G, f.n, 1, 0);
}
// 1-€-Muenze: goldener Ring, silberner Kern
function _m6eMuenze(ctx, x, y, s, a) {
  const K = _m6eK, r = K.MR * s;
  if (a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e5e7eb'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Wendeplaettchen: orange (x) oder blau (feste Zahl)
function _m6ePlaettchen(ctx, x, y, s, a, blau) {
  const K = _m6eK, r = K.PR * s;
  if (a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = blau ? '#60a5fa' : '#fb923c'; ctx.strokeStyle = blau ? K.F_BLAU : K.F_XD; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (r > 3) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Klammer „]“ rechts an einer Reihe, daneben ihr Text
function _m6eKlammerR(ctx, x, y, text, farbe, a, gr) {
  if (a <= 0.01) return;
  const h = gr > 11 ? 7 : 5;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = _m6eK.F_GRAU; ctx.lineWidth = 1.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + 3, y - h); ctx.lineTo(x + 3, y + h); ctx.lineTo(x, y + h); ctx.stroke();
  ctx.fillStyle = farbe; ctx.font = '700 ' + gr + 'px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, x + 7, y + gr * 0.36);
  ctx.restore();
}
// Klammer „[“ links ueber mehrere Reihen, davor ihre Anzahl
function _m6eKlammerL(ctx, x, y0, y1, text, farbe, a) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = _m6eK.F_GRAU; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x + 3, y0 - 6); ctx.lineTo(x, y0 - 6); ctx.lineTo(x, y1 + 6); ctx.lineTo(x + 3, y1 + 6); ctx.stroke();
  ctx.fillStyle = farbe; ctx.font = '700 13px sans-serif';
  ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, x - 5, (y0 + y1) / 2 + 13 * 0.36);
  ctx.restore();
}
// Leuchtband hinter einer Reihe
function _m6eBand(ctx, x0, x1, y, hh, a) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = 'rgba(252,211,77,0.35)'; ctx.strokeStyle = 'rgba(217,119,6,0.75)'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, x0, y - hh, x1 - x0, 2 * hh, hh); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Graue Karte „?“ (Wert verdecken)
function _m6eFrage(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x - w / 2, y - h / 2, w, h, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 16px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('?', x, y + 16 * 0.36);
  ctx.restore();
}

// ── Zeichnen: Teile des Bilds ───────────────────────────────────────────
function _m6eLeiste(ctx, S, ein) {
  const K = _m6eK;
  _m6eFlaeche(ctx, K.LX0, K.LY0, K.LX1, K.LY1, 8, '#ffffff', '#cbd5e1');
  for (let i = 0; i <= K.MAXX; i++) {
    const G = _m6eSlot(i), a = S.leiste[i];
    if (a < 1) _m6eLeer(ctx, G);
    if (a > 0) _m6eKarte(ctx, G, i, a * ein, 0);
  }
}
// Schild mit dem Term; die Karte auf dem x klappt mit. Gibt die Mitte des x zurueck.
function _m6eSchild(ctx, S, ein) {
  const z = _m6e, K = _m6eK;
  ctx.save();
  ctx.translate(0, K.SYM); ctx.scale(1, Math.max(0.02, S.schild.flip)); ctx.translate(0, -K.SYM);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, K.SX0 + 2, K.SY0 + 3, K.SX1 - K.SX0, K.SY1 - K.SY0, 9); ctx.fill();
  ctx.fillStyle = '#fffdf5'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, K.SX0, K.SY0, K.SX1 - K.SX0, K.SY1 - K.SY0, 9); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#94a3b8';                          // vier Schrauben
  for (const sx of [K.SX0 + 9, K.SX1 - 9]) for (const sy of [K.SY0 + 9, K.SY1 - 9]) {
    ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, Math.PI * 2); ctx.fill();
  }
  const teile = _m6eTeile(S.schild.term, null), L = _m6eLegen(ctx, teile, K.SG, K.SM);
  let xc = K.SM;
  ctx.globalAlpha = ein;
  teile.forEach((t, i) => {
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    if (t.x) {
      xc = L.xm[i];
      ctx.fillStyle = '#fff7ed'; ctx.strokeStyle = K.F_X; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(xc, K.SYM, K.XR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = K.F_X; ctx.font = '700 ' + K.SG + 'px sans-serif';
      ctx.fillText('x', xc, K.SYM + K.SG * 0.27);     // kleines x: mittig im Kreis
      return;
    }
    ctx.fillStyle = t.f || K.F_TINTE; ctx.font = '700 ' + K.SG + 'px sans-serif';
    ctx.fillText(t.s, L.xm[i], K.SYM + K.SG * 0.36);
  });
  if (S.aufX) {
    const wk = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / K.T_WACKEL) : 0;
    _m6eKarte(ctx, _m6eAufX(xc + wk), S.aufX.n, S.aufX.a * ein, z.ahaGlanz > 0 ? z.ahaGlanz / 0.5 : 0);
  }
  ctx.restore();
  return xc;
}
// Rechnung unter dem Schild; Zahl fuer x und Wert federn beim Erscheinen
function _m6eRechnung(ctx, R, ein) {
  if (!R || R.a <= 0.01) return;
  const z = _m6e, K = _m6eK;
  const teile = _m6eTeile(R.term, R.x), L = _m6eLegen(ctx, teile, K.RG, K.SM);
  const pop = z.popR > 0 ? Math.max(0.5, _bioFxEase.federn(_bioFxKlemme(1 - z.popR / K.T_POP))) : 1;
  teile.forEach((t, i) => {
    const a = Math.min(1, (t.wert ? R.wertA : R.a) * ein);
    if (a <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = a;
    if (t.wert && z.verdeckt) {
      _m6eFrage(ctx, L.xm[i], K.RY - K.RG * 0.36, Math.max(K.RG * 1.6, L.br[i] + 10), K.RG * 1.2);
      ctx.restore(); return;
    }
    ctx.fillStyle = t.f || K.F_TINTE; ctx.font = '700 ' + K.RG + 'px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    if ((t.wert || t.zahl) && pop !== 1) {
      ctx.translate(L.xm[i], K.RY - K.RG * 0.36); ctx.scale(pop, pop);
      ctx.fillText(t.s, 0, K.RG * 0.36);
    } else ctx.fillText(t.s, L.xm[i], K.RY);
    ctx.restore();
  });
}
// Der Tisch und was gerade darauf liegt
function _m6eTisch(ctx, ein) {
  const z = _m6e, K = _m6eK, L = z.lauf, kl = _bioFxKlemme;
  _m6eFlaeche(ctx, K.TX0, K.TY0, K.TX1, K.TY1, 8, '#fbf5ea', '#e2cfab');
  ctx.save();
  ctx.globalAlpha = 1; ctx.strokeStyle = '#f1e4cc'; ctx.lineWidth = 1;   // Maserung
  for (const y of [K.TY0 + 37, K.TY0 + 74, K.TY0 + 111]) {
    ctx.beginPath(); ctx.moveTo(K.TX0 + 8, y); ctx.lineTo(K.TX1 - 8, y); ctx.stroke();
  }
  ctx.restore();
  if (!L) { _m6eMaterial(ctx, z.term, z.x, { a: ein }); return; }
  const t = L.t, A = L.alt, N = L.neu;
  if (L.art === 'marke') {
    if (t < L.vor) _m6eMaterial(ctx, A.term, A.x, { a: 1 - kl(t / Math.min(L.vor, 0.3)) });
    if (t >= L.T.fall0) _m6eMaterial(ctx, N.term, N.x, { fall: t - L.T.fall0 });
  } else if (L.art === 'schritt') {
    _m6eMaterial(ctx, N.term, A.x, { nach: N.x, p: kl((t - K.T_W) / K.T_ZEILE) });
  } else {
    const m = K.T_KLAPP / 2;
    if (t < m) _m6eMaterial(ctx, A.term, A.x, { a: 1 - kl(t / m) });
    else _m6eMaterial(ctx, N.term, N.x, { pop: t - m });
  }
}
// Material zu (term, x). o.a: Deckkraft · o.fall: Zeit seit Beginn des Einfallens
// (Sprungmarke) · o.nach + o.p: „x ± 1“ (0..1) · o.pop: Zeit seit dem Umklappen
function _m6eMaterial(ctx, term, x, o) {
  if (x === null || x === undefined) return;
  const z = _m6e, K = _m6eK, E = _bioFxEase, kl = _bioFxKlemme;
  const A = o.a === undefined ? 1 : o.a;
  const n0 = x, n1 = o.nach === undefined ? x : o.nach;
  if (term === 0) {
    // x Reihen zu je 3 Muenzen
    const reihen = [];
    let liegt = 0;                                     // Reihen, die fertig liegen (Klammer links)
    for (let i = 0; i < Math.max(n0, n1); i++) {
      let dx = 0, dy = 0, a = A, s = 1;
      if (o.fall !== undefined) {
        const p = (o.fall - i * K.T_REIHE) / K.T_FALL;
        if (p <= 0) continue;
        dy = -30 * (1 - E.aufprall(kl(p))); a = A * kl(p / 0.25);
        if (p >= 1) liegt++;
      } else if (o.pop !== undefined) {
        const p = (o.pop - i * 0.025) / K.T_NEUMAT;
        if (p <= 0) continue;
        s = Math.max(0, E.federn(kl(p))); a = A * kl(p * 3);
        if (p >= 1) liegt++;
      } else if (i >= n0) {                            // kommt von rechts herein (x + 1)
        if (o.p <= 0) continue;
        dx = 150 * (1 - E.raus(o.p)); a = A * kl(o.p / 0.3);
      } else if (i >= n1) {                            // gleitet nach rechts hinaus (x − 1)
        dx = 150 * E.rein(o.p); a = A * (1 - kl((o.p - 0.6) / 0.4));
        liegt++;
      } else liegt++;
      reihen.push({ i, dx, dy, a, s });
    }
    for (const R of reihen)
      if (z.glanz[R.i] > 0 && R.dx === 0 && R.dy === 0)
        _m6eBand(ctx, K.KLAX + 6, K.KLX + 30, _m6eMY(R.i), 5.8, R.a * z.glanz[R.i] / K.T_GLANZ);
    for (const R of reihen) {
      const y = _m6eMY(R.i) + R.dy;
      for (let j = 0; j < 3; j++) _m6eMuenze(ctx, K.MX0 + j * K.MP + R.dx, y, R.s, R.a);
      _m6eKlammerR(ctx, K.KLX + R.dx, y, _m6eE(3), K.F_GELD, R.a, 10.5);
    }
    if (liegt > 0) _m6eKlammerL(ctx, K.KLAX, _m6eMY(0), _m6eMY(liegt - 1), String(liegt), K.F_XD, A);
    return;
  }
  // x + 5: oben x orange, darunter 5 blau · 2 · x + 1: zwei Reihen zu je x orange, darunter 1 blau
  const ys = term === 1 ? K.P1Y : K.P2Y;
  const rows = term === 1 ? [{ o: true }, { o: false, n: 5 }] : [{ o: true }, { o: true }, { o: false, n: 1 }];
  rows.forEach((R, ri) => {
    const y = ys[ri], nA = R.o ? n0 : R.n, nB = R.o ? n1 : R.n;
    const rowA = o.pop !== undefined ? A * kl((o.pop - ri * 0.05) / K.T_NEUMAT) : A;
    let nL = nA, txt = nA;                             // Klammer rueckt mit
    if (o.p !== undefined && nA !== nB) { nL = nA + (nB - nA) * E.sanft(o.p); txt = o.p >= 0.5 ? nB : nA; }
    const kx = _m6eKlX(Math.floor(nL)) + (_m6eKlX(Math.ceil(nL)) - _m6eKlX(Math.floor(nL))) * (nL - Math.floor(nL));
    if (z.glanz[ri] > 0 && R.o) _m6eBand(ctx, K.PX0 - K.PR - 4, kx + 26, y, 8, rowA * z.glanz[ri] / K.T_GLANZ);
    for (let j = 0; j < Math.max(nA, nB); j++) {
      let s = 1, a = A;
      if (o.pop !== undefined) {
        const p = (o.pop - ri * 0.05 - j * 0.012) / K.T_NEUMAT;
        if (p <= 0) continue;
        s = Math.max(0, E.federn(kl(p))); a = A * kl(p * 3);
      } else if (j >= nA) {                            // springt dazu (x + 1)
        if (o.p <= 0) continue;
        s = Math.max(0, E.federn(o.p));
      } else if (j >= nB) {                            // verschwindet (x − 1)
        s = 1 - E.sanft(o.p); a = A * (1 - o.p);
      }
      _m6ePlaettchen(ctx, _m6ePX(j), y, s, a, !R.o);
    }
    _m6eKlammerR(ctx, kx, y, String(txt), R.o ? K.F_XD : K.F_BLAU, rowA, 13);
  });
  if (term === 2) {
    const a = o.pop !== undefined ? A * kl(o.pop / K.T_NEUMAT) : A;
    _m6eKlammerL(ctx, K.PX0 - K.PR - 8, K.P2Y[0], K.P2Y[1], '2', K.F_TINTE, a);
  }
}
function _m6eDraw(ctx, cv) {
  if (!_m6e) return;
  const z = _m6e, K = _m6eK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const ein = z.ein > 0 ? 1 - z.ein / K.T_NEU : 1;   // nach „neu“ blendet alles ein
  const S = _m6eSzene(ctx);
  _m6eLeiste(ctx, S, ein);
  _m6eTisch(ctx, ein);
  z.xmitte = _m6eSchild(ctx, S, ein);
  _m6eRechnung(ctx, S.rech, ein);
  _bioFxDraw(ctx, z.fx.teile);                        // Lichtring um die Karte auf dem x
  for (const f of S.flug) _m6eFlug(ctx, f);
  if (z.pause) _m6ePauseSchild(ctx);
}
// Schild „Pause“ oben links – gleiche Stelle, Groesse und Farbe wie in
// m5-plus-schriftlich, damit die Lehrkraft es ueberall am selben Ort findet.
// Der Platz darunter ist frei: die Leiste beginnt bei y = 37, das Schild bei x = 78.
// Leuchtet kurz auf, wenn waehrend der Pause ein Knopf gedrueckt wird.
function _m6ePauseSchild(ctx) {
  const z = _m6e, w = 64, h = 25, x = 8, y = 8;
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
