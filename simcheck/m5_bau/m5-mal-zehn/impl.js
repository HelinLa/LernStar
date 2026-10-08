
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mm2 „Was passiert bei mal 10?“ (Kennung m5-mal-zehn, Praefix _m5s)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL4_PROFIL.md, Abschnitte mm2 und m5-mal-zehn.
// Ueberschrift = Frage der Einheit: „Wie viel ist 34 · 10?“
//
// WAS MAN SIEHT (Leinwand 420 x 250): eine Stellenwerttafel T | H | Z | E,
// rechts neben einer schmalen Beschriftungsspalte („Ziffern“, „Material“).
//   - Kopfzeile: Buchstabe gross, darunter das Wort (Tausender ... Einer),
//     jede Spalte in ihrer Farbe (wie m5-buendeln: T lila, H rot, Z blau,
//     E gruen).
//   - Kartenzeile: je Stelle eine Ziffernkarte in der Farbe ihrer Spalte.
//     Eine Stelle INNERHALB der Zahl ohne Material traegt die orange Karte 0,
//     und ihre Materialspalte ist grau gestrichelt umrandet (wie mz3).
//     Spalten links der ersten Ziffer gehoeren nicht zur Zahl: blass getoent.
//   - Materialzeile, alles untereinander: Einer = gruene Wuerfelchen in
//     Fuenfersaeulen, Zehner = liegende blaue Stangen (Fuenfermarke, Luecke
//     nach fuenf), Hunderter = rote Platten und Tausender = lila Wuerfel in
//     Fuenfersaeulen. So passt beim Gleiten jede Ordnung zur naechsten.
//   Karte und Material einer Spalte tragen dieselbe Farbe: das ist die
//   Verbindung Bild <-> Zeichen (MATHE_PROFIL § 10.2).
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m5sMarke('…'), Wahlgruppe):
//     „7 · 10“ · „34 · 10“ · „34 · 100“
//     Eine Sprungmarke legt die Startzahl neu (die Stuecke fallen gestaffelt in
//     ihre Plaetze, 0,7 s) und spielt danach mal 10 ab („34 · 100“ zweimal,
//     dazwischen 0,3 s Ruhe). So braucht der Heftschritt nur EINEN Knopf (N1).
//   Reihe 2: „mal 10“ (_m5sMal: mal 10 auf die Zahl, die gerade in der Tafel
//     steht) · „10 mehr“ (_m5sMehr, Gegenprobe) · „neu“ (_m5sNeu: wieder 34,
//     nichts gerechnet)
//   Ohne Knopf: _m5sLegen(n) legt eine freie Startzahl (1 bis 9 999). Nur fuer
//     den Rechentest mit werte.js (305 · 10 aus dem Bauplan) – am Bildschirm
//     ist 305 mit den Knoepfen nicht zu erreichen.
//
// BEWEGUNG:
//   „mal 10“: jedes Stueck waechst zur naechsten Form (Wuerfel -> Stange,
//     Stange -> Platte, Platte -> Tausenderwuerfel) und gleitet dabei eine
//     Spalte weiter (0,9 s, kleiner Bogen, kurzes Aufbluehen). Die Ziffern-
//     karten gleiten in ihrer Zeile mit und nehmen die Farbe der neuen Spalte
//     an. Danach faellt in die leer gewordene Einerspalte eine orange Karte
//     „0“ (0,35 s, von knapp oberhalb, waechst dabei auf volle Groesse) und
//     leuchtet kurz; die Einerspalte wird gestrichelt umrandet.
//     ERST BEI DER LANDUNG der Karte springen die Statuszeilen auf das Ergebnis.
//   „10 mehr“: eine Stange gleitet von unten in Z (0,7 s), sonst bleibt alles
//     stehen; die Karte Z zaehlt eins weiter. Werden es zehn Stangen, gleiten
//     sie zu einem Quadrat zusammen und wandern als Platte nach H (wie mz1).
//   Grenze: Steht schon etwas bei T, hat die Tafel fuer mal 10 keine Stelle
//     mehr (ebenso bei 10 mehr ueber 9 999): die Spalte T wackelt, und die
//     Zeile „Die Tafel hat keine Stelle mehr.“ erscheint. Sonst aendert sich nichts.
//   Wer waehrend einer Bewegung „mal 10“ oder „10 mehr“ drueckt, laesst alles
//   Laufende sofort landen (auch den Rest einer Sprungmarke); dann geschieht
//   das Neue. So ergibt jede Knopffolge denselben Zustand.
//
// STATUSZEILEN (woertlich, alle > 18 Zeichen; Tausendertrenner U+00A0):
//   _m5s-aufgabe   „Gerechnet wird: noch nichts“ · „Gerechnet wird: 34 · 10“ ·
//                  „Gerechnet wird: 34 · 100“ · nach „10 mehr“ „Gerechnet wird: 34 + 10“
//                  Kettet „mal 10“ an, zaehlt sie ab der Startzahl der Kette
//                  (34 · 100, nicht 340 · 10). Sie steht schon WAEHREND der Bewegung.
//   _m5s-vorher    „Vorher in der Tafel: 3 Z, 4 E“ (Startzahl der Kette; ohne
//                  Rechnung: was gerade in der Tafel steht)
//   _m5s-nachher   „Nachher in der Tafel: …“ -> „Nachher in der Tafel: 3 H, 4 Z, 0 E“
//   _m5s-stellen   „Jede Ziffer ist gerückt um: …“ -> „… um: 1 Stelle“ /
//                  „… um: 2 Stellen“; nach „10 mehr“ „… um: 0 Stellen“
//   _m5s-ergebnis  „Ergebnis der Aufgabe: …“ -> „Ergebnis der Aufgabe: 340“
//   _m5s-vergleich nur nach „10 mehr“: „Zum Vergleich: 34 + 10 = 44“. Sie bleibt
//                  stehen, solange die Tafel mit derselben Startzahl rechnet –
//                  „10 mehr“ und danach „34 · 10“ zeigt also 340 UND 44
//                  nebeneinander. Eine andere Startzahl oder „neu“ nimmt sie weg.
//   _m5s-meldung   nur an der Grenze: „Die Tafel hat keine Stelle mehr.“
//
// WERTE (jede Zeile nachgerechnet mit simcheck/werte.js):
//   7 · 10   -> vorher 7 E                  -> nachher 7 Z, 0 E           · 1 Stelle  · 70
//   34 · 10  -> vorher 3 Z, 4 E             -> nachher 3 H, 4 Z, 0 E      · 1 Stelle  · 340
//   34 · 100 -> vorher 3 Z, 4 E             -> nachher 3 T, 4 H, 0 Z, 0 E · 2 Stellen · 3 400
//               (ebenso „34 · 10“ + „mal 10“)
//   frei 305 · 10 -> vorher 3 H, 0 Z, 5 E   -> nachher 3 T, 0 H, 5 Z, 0 E · 1 Stelle  · 3 050
//   „10 mehr“ ab Start: 34 + 10 = 44 (vorher 3 Z, 4 E, nachher 4 Z, 4 E, 0 Stellen)
// START: 34 in der Tafel, nicht gerechnet („Start: 34 in der Tafel“).
//
// AHA (_bioFx, ruhig, OHNE Textstreifen): in 34 · 10 kommen die 3 Stangen als
// 3 Platten in der Hunderterspalte an – dort laeuft ein Lichtring, und die
// Platten leuchten 2,4 s nach. Dahin kommt „10 mehr“ nie. Einmal je Laden.
//
// FUER DIE LEHRKRAFT (Bauplan: eigene Zeile unter den Heftknoepfen, in
// <div class="fpm-lehrkraft">, davor klein „Für die Lehrkraft:“ – Bauart wie
// m5-plus-schriftlich / m5-minus-schriftlich):
//   „Pause“ <-> „weiter“ (_m5sAnhalten): friert JEDE Bewegung sofort ein (Gleiten,
//     fallende Karte, Lichtring); „weiter“ macht genau dort weiter. Im Bild
//     oben links das Schild „Pause“ (Stelle und Aussehen wie in m5-plus-schriftlich;
//     dort steht in diesem Bausatz nichts, die Tafel beginnt erst bei x = 74).
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m5sTempo): alles ein Drittel so schnell.
//   „Material: an“ <-> „Material: aus“ (_m5sMaterial): blendet das Material aus,
//     nur die Karten bleiben – der Weg vom Bild zum Zeichen. Wirkt sofort, auch
//     in der Pause (Blende in echter Zeit, 0,35 s).
//   Nur das wechselnde Wort steht in einem eigenen <span> (_m5s-tempo-an,
//   _m5s-material-an), wie in m5-plus-schriftlich.
//   Hinweiszeile _m5s-lehrkraft: sonst „Für die Lehrkraft: „Pause“ hält alles
//     an. „Material: aus“ zeigt nur die Karten.“ · in der Pause (bernstein)
//     „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
//   Waehrend der Pause bewegt KEIN Heftknopf etwas: „mal 10“ / „10 mehr“
//     entfallen, wenn gerade etwas laeuft, sonst werden sie VORGEMERKT und
//     beginnen mit „weiter“ (das Schild leuchtet kurz auf). Eine Sprungmarke
//     oder „neu“ laedt neu und HEBT DIE PAUSE AUF (Bauplan). Tempo und Material
//     bleiben ueber „neu“ und Sprungmarken stehen.
//   EIN Zeitfaktor (_m5sZeitfaktor: 0 Pause, 1/3 langsam, 1 normal) an der
//   einen Stelle, an der dt in die Bewegung geht. Voreinstellung (Pause aus,
//   Tempo normal, Material an): bildgleich, kein Text anders.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): „links“ (auch „nach
// links“), „Null“ als Wort (die Ziffer 0 steht natuerlich da), „anhängen“, die
// Regel als Satz. Kein „falsch“, keine Punkte, keine Zeit, keine Namen.
// Deterministisch, ohne Zufall: jede Zahl im Bild kommt aus _m5sZiffern().
// ════════════════════════════════════════════════════════════════════════
let _m5s = null;
const _m5sMARKEN = { '7x10': [7, 1], '34x10': [34, 1], '34x100': [34, 2] };   // [Startzahl, wie oft mal 10]
const _m5sREIHE = ['7x10', '34x10', '34x100'];
const _m5sAUFSCHRIFT = { '7x10': '7&nbsp;·&nbsp;10', '34x10': '34&nbsp;·&nbsp;10', '34x100': '34&nbsp;·&nbsp;100' };
const _m5sSTART = 34;
const _m5sKURZ = ['T', 'H', 'Z', 'E'];
const _m5sWORT = ['Tausender', 'Hunderter', 'Zehner', 'Einer'];
const _m5sK = {
  X0: 6, X1: 414, Y0: 6, Y1: 244,         // Brett
  LX: 74, CW: 85,                         // Tafel ab x = 74, vier Spalten zu 85 px (bis 414)
  YK: 40, YC: 94, KY: 67,                 // Kopfzeile bis 40, Kartenzeile bis 94 (Mitte 67), darunter Material
  KW: 40, KH: 46,                         // Ziffernkarte
  T_LADEN: 0.7, T_WARTEN: 0.3, T_GLEIT: 0.9, T_NULL: 0.35,
  T_STANGE: 0.7, T_SAMMEL: 0.5, T_BUENDEL: 0.6, T_GLANZ: 1.0, T_POP: 0.35,
  NULL: { grund: '#ffedd5', rand: '#ea580c', schrift: '#c2410c' }   // Karte 0 (wie mz3)
};
// Farben je Spalte 0 T · 1 H · 2 Z · 3 E (Material wie m5-buendeln)
const _m5sFARBE = [
  { grund: '#f5f3ff', karte: '#ede9fe', fuell: '#c4b5fd', oben: '#ede9fe', seite: '#a78bfa', rand: '#6d28d9' },
  { grund: '#fef2f2', karte: '#fee2e2', fuell: '#fca5a5', linie: 'rgba(185,28,28,0.35)', rand: '#b91c1c' },
  { grund: '#eff6ff', karte: '#dbeafe', fuell: '#93c5fd', linie: 'rgba(29,78,216,0.45)', rand: '#1d4ed8' },
  { grund: '#f0fdf4', karte: '#dcfce7', fuell: '#86efac', licht: '#dcfce7', rand: '#15803d' }
];

// ── Rechnen: alles kommt aus denselben Ziffern wie die Zeichnung ─────────
function _m5sFmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0'); }   // geschuetztes Leerzeichen
function _m5sZiffern(n) {
  return [Math.floor(n / 1000) % 10, Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10];
}
function _m5sErste(d) { for (let c = 0; c < 3; c++) if (d[c]) return c; return 3; }
// „3 H, 0 Z, 5 E“ – ab der ersten Ziffer, jede Stelle bis E
function _m5sTafelText(n) {
  const d = _m5sZiffern(n), t = [];
  for (let c = _m5sErste(d); c < 4; c++) t.push(d[c] + ' ' + _m5sKURZ[c]);
  return t.join(', ');
}
function _m5sStellenText(k) { return k + (k === 1 ? ' Stelle' : ' Stellen'); }
function _m5sMitte(c) { return _m5sK.LX + c * _m5sK.CW + _m5sK.CW / 2; }
// Platz des i-ten Stuecks in Spalte c (Kasten x, y, w, h)
function _m5sPlatz(c, i) {
  // ALLES liegt untereinander (Fuenfersaeulen, liegende Stangen): So passt beim
  // Gleiten jede Ordnung zur naechsten, und kein Stueck faehrt durch ein anderes.
  // (Mit stehenden Stangen nebeneinander ueberlagerten sich die Stuecke auf dem
  // Weg von Z nach H – am Bild gesehen.)
  const K = _m5sK, x0 = K.LX + c * K.CW;
  if (c === 3) {                                  // Einer: Fuenfersaeulen
    const s = Math.floor(i / 5), r = i % 5;
    return { x: x0 + 27 + s * 17, y: K.YC + 10 + r * 15, w: 13, h: 13 };
  }
  if (c === 2)                                    // Zehner: liegende Stangen untereinander, Luecke nach fuenf
    return { x: x0 + 7.5, y: K.YC + 10 + i * 9 + (i >= 5 ? 4 : 0), w: 70, h: 7 };
  const s = Math.floor(i / 5), r = i % 5;         // Hunderter, Tausender: Fuenfersaeulen
  return { x: x0 + 14.5 + s * 30, y: K.YC + 6 + r * 28, w: 26, h: 26 };
}

// ── Zustand ─────────────────────────────────────────────────────────────
function _m5sInit() {
  _m5s = { t: 0, zahl: _m5sSTART, start: _m5sSTART, mal: 0, letzte: null, plusVon: 0,
           vergleich: null, meldung: '', lauf: null, schlange: [],
           pause: false, langsam: false, material: true, matA: 1, blink: 0, vormerken: null,
           aha: false, ahaGlanz: 0, ahaX: 0, ahaY: 0, wackel: 0, nullGlanz: 0,
           pop: [9, 9, 9, 9], fx: { teile: [] } };
  _m5sLaden(_m5sSTART, 0, true);
}
// Startzahl n neu legen; danach `schritte`-mal mal 10 abspielen.
function _m5sLaden(n, schritte, erstes) {
  const z = _m5s;
  const alt = erstes ? null : _m5sZiffern(z.zahl);
  z.zahl = n; z.start = n; z.mal = 0; z.letzte = null; z.meldung = '';
  if (z.vergleich && z.vergleich.a !== n) z.vergleich = null;
  z.aha = false; z.ahaGlanz = 0; z.nullGlanz = 0; z.wackel = 0; z.pop = [9, 9, 9, 9];
  z.pause = false; z.vormerken = null; z.blink = 0;            // neu laden hebt die Pause auf
  z.fx.teile.length = 0;
  z.lauf = { art: 'laden', t: 0, dauer: _m5sK.T_LADEN, alt, neu: _m5sZiffern(n) };
  z.schlange = [];
  for (let k = 0; k < schritte; k++) z.schlange.push('warten', 'mal');
}
// Einen mal-10-Schritt beginnen. false an der Grenze.
function _m5sMalStart() {
  const z = _m5s, K = _m5sK;
  if (z.zahl >= 1000) {
    z.meldung = 'Die Tafel hat keine Stelle mehr.'; z.wackel = 0.45; z.schlange = [];
    return false;
  }
  if (z.vergleich && z.vergleich.a !== z.start) z.vergleich = null;
  z.meldung = '';
  // Der Aha-Schein gehoert zu den Platten in H; gleiten sie weiter, laeuft er rasch aus.
  z.ahaGlanz = Math.min(z.ahaGlanz, 0.25);
  z.lauf = { art: 'mal', t: 0, dauer: K.T_GLEIT + K.T_NULL, von: _m5sZiffern(z.zahl),
             nach: _m5sZiffern(z.zahl * 10), aha: z.start === _m5sSTART && z.mal === 0 && !z.aha,
             ahaFertig: false };
  return true;
}
// „10 mehr“ beginnen: eine Stange, bei zehn Stangen ein Buendel weiter nach H (und T).
function _m5sPlusStart() {
  const z = _m5s, K = _m5sK;
  if (z.zahl + 10 > 9999) {
    z.meldung = 'Die Tafel hat keine Stelle mehr.'; z.wackel = 0.45;
    return false;
  }
  const von = _m5sZiffern(z.zahl), w = von.slice();
  const phasen = [{ art: 'stange', dauer: K.T_STANGE }];
  w[2] += 1;
  for (let c = 2; c >= 1 && w[c] === 10; c--) {
    phasen.push({ art: 'buendel', c, dauer: K.T_SAMMEL + K.T_BUENDEL });
    w[c] = 0; w[c - 1] += 1;
  }
  z.meldung = '';
  z.lauf = { art: 'plus', t: 0, i: 0, pt: 0, phasen, vonZahl: z.zahl,
             zw: von.slice(), karten: von.slice() };
  return true;
}
// Laufende Bewegung beenden und ihren Zustand uebernehmen.
function _m5sLaufLanden(sofort) {
  const z = _m5s, L = z.lauf;
  if (!L) return;
  z.lauf = null;
  if (L.art === 'mal') {
    z.zahl *= 10; z.mal += 1; z.letzte = 'mal';
    if (L.aha) z.aha = true;                       // einmal je Laden, auch wenn sofort gelandet
    if (!sofort) z.nullGlanz = _m5sK.T_GLANZ;      // die Karte 0 ist beim Fallen schon gewachsen: kein zweites Einfedern
  } else if (L.art === 'plus') {
    const a = L.vonZahl, b = a + 10;
    z.zahl = b; z.letzte = 'plus'; z.plusVon = a; z.start = b; z.mal = 0;
    z.vergleich = { a, b };
  }
}
function _m5sNaechster() {
  const z = _m5s, s = z.schlange.shift();
  if (s === 'warten') z.lauf = { art: 'warten', t: 0, dauer: _m5sK.T_WARTEN };
  else if (s === 'mal') { _m5sMalStart(); _m5sStatus(); }
}
// Alles Laufende und Vorgemerkte sofort landen lassen (vor jeder neuen Rechnung).
function _m5sAllesLanden() {
  const z = _m5s;
  for (let schutz = 0; (z.lauf || z.schlange.length) && schutz < 24; schutz++) {
    if (z.lauf) { _m5sLaufLanden(true); continue; }
    if (z.schlange.shift() === 'mal') _m5sMalStart();
  }
}

// ── Oberflaeche ─────────────────────────────────────────────────────────
function _m5sHTML() {
  const marke = (k, i) =>
    `<button class="sim-btn" id="_m5s-b-${i}" onclick="_m5sMarke('${k}')">${_m5sAUFSCHRIFT[k]}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viel ist 34&nbsp;·&nbsp;10?</h3>
    <div class="fpm-note" style="margin-top:2px">„mal 10“ verändert jedes Stück. Sieh genau hin: Wohin gleiten die Karten?</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5s-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5sREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_m5s-mal" onclick="_m5sMal()">mal 10</button>
          <button class="sim-btn" id="_m5s-mehr" onclick="_m5sMehr()">10 mehr</button>
          <button class="sim-btn" onclick="_m5sNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m5s-pause" onclick="_m5sAnhalten()">Pause</button>
            <button class="sim-btn" id="_m5s-tempo" onclick="_m5sTempo()">Tempo: <span id="_m5s-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m5s-material" onclick="_m5sMaterial()">Material: <span id="_m5s-material-an">an</span></button>
          </div>
          <div class="lmp-status on" id="_m5s-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5s-aufgabe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5s-vorher" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5s-nachher" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5s-stellen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5s-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5s-vergleich" style="margin-top:6px;display:none"></div>
        <div class="lmp-status off" id="_m5s-meldung" style="margin-top:6px;display:none"></div>
        <div class="fpm-note" style="margin-top:10px">T Tausender · H Hunderter · Z Zehner · E Einer</div>
        <div class="fpm-note" style="margin-top:6px">Gestrichelt: In dieser Spalte liegt kein Stück.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 34 in der Tafel</p>
  </div>`;
}
function _m5sSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m5sZeige(id, html) {                     // Zeile nur zeigen, wenn sie etwas sagt
  const e = _m5sSetze(id, html || '');
  if (e && e.style) e.style.display = html ? '' : 'none';
}
// Was die Statuszeilen gerade beschreiben: eine laufende oder die letzte Rechnung.
function _m5sAnsicht() {
  const z = _m5s, L = z.lauf;
  if (L && L.art === 'mal') return { art: 'mal', start: z.start, mal: z.mal + 1, fertig: false };
  if (L && L.art === 'plus') return { art: 'plus', von: L.vonZahl, fertig: false };
  if (z.letzte === 'mal') return { art: 'mal', start: z.start, mal: z.mal, fertig: true };
  if (z.letzte === 'plus') return { art: 'plus', von: z.plusVon, fertig: true };
  return { art: 'nichts' };
}
function _m5sStatus() {
  if (!_m5s) return;
  const z = _m5s, a = _m5sAnsicht();
  let aufgabe = 'noch nichts', vorher = _m5sTafelText(z.zahl), nachher = '…', stellen = '…', erg = '…';
  if (a.art === 'mal') {
    aufgabe = _m5sFmt(a.start) + ' · ' + _m5sFmt(Math.pow(10, a.mal));
    vorher = _m5sTafelText(a.start);
    if (a.fertig) { nachher = _m5sTafelText(z.zahl); stellen = _m5sStellenText(a.mal); erg = '<b>' + _m5sFmt(z.zahl) + '</b>'; }
  } else if (a.art === 'plus') {
    aufgabe = _m5sFmt(a.von) + ' + 10';
    vorher = _m5sTafelText(a.von);
    if (a.fertig) { nachher = _m5sTafelText(z.zahl); stellen = _m5sStellenText(0); erg = '<b>' + _m5sFmt(z.zahl) + '</b>'; }
  }
  _m5sSetze('_m5s-aufgabe', 'Gerechnet wird: ' + aufgabe);
  _m5sSetze('_m5s-vorher', 'Vorher in der Tafel: ' + vorher);
  _m5sSetze('_m5s-nachher', 'Nachher in der Tafel: ' + nachher);
  _m5sSetze('_m5s-stellen', 'Jede Ziffer ist gerückt um: ' + stellen);
  _m5sSetze('_m5s-ergebnis', 'Ergebnis der Aufgabe: ' + erg);
  const v = z.vergleich && !(z.lauf && z.lauf.art === 'plus') ? z.vergleich : null;
  _m5sZeige('_m5s-vergleich', v ? 'Zum Vergleich: ' + _m5sFmt(v.a) + ' + 10 = ' + _m5sFmt(v.b) : '');
  _m5sZeige('_m5s-meldung', z.meldung);
  // Die Sprungmarke der Rechnung, die gerade gezeigt wird, ist hervorgehoben.
  const aktiv = a.art !== 'mal' ? null
              : a.start === 7 && a.mal === 1 ? '7x10'
              : a.start === 34 && a.mal === 1 ? '34x10'
              : a.start === 34 && a.mal === 2 ? '34x100' : null;
  _m5sREIHE.forEach((k, i) => {
    try { document.getElementById('_m5s-b-' + i).classList.toggle('primary', k === aktiv); } catch (e) { /* Mini-DOM */ }
  });
  // Fuer die Lehrkraft
  _m5sSetze('_m5s-pause', z.pause ? 'weiter' : 'Pause');
  _m5sSetze('_m5s-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m5sSetze('_m5s-material-an', z.material ? 'an' : 'aus');
  const hz = _m5sSetze('_m5s-lehrkraft', z.pause
    ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : 'Für die Lehrkraft: „Pause“ hält alles an. „Material: aus“ zeigt nur die Karten.');
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m5s-pause', z.pause], ['_m5s-material', !z.material]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m5sMarke(k) {
  if (!_m5s || !_m5sMARKEN[k]) return;
  const [n, schritte] = _m5sMARKEN[k];
  _m5sLaden(n, schritte, false);
  _m5sStatus();
}
function _m5sNeu() {
  if (!_m5s) return;
  _m5s.vergleich = null;
  _m5sLaden(_m5sSTART, 0, false);
  _m5sStatus();
}
// Kein Knopf: freie Startzahl fuer den Rechentest (werte.js), z. B. _m5sLegen(305).
function _m5sLegen(n) {
  if (!_m5s) return;
  n = Math.round(Number(n));
  if (!(n >= 1 && n <= 9999)) return;
  _m5sLaden(n, 0, false);
  _m5sStatus();
}
function _m5sMal() {
  if (!_m5s) return;
  const z = _m5s;
  if (z.pause) {                                   // in der Pause: vormerken oder entfallen lassen
    z.blink = 0.6;
    if (!z.lauf && !z.schlange.length) z.vormerken = 'mal';
    return;
  }
  _m5sAllesLanden();
  _m5sMalStart();
  _m5sStatus();
}
function _m5sMehr() {
  if (!_m5s) return;
  const z = _m5s;
  if (z.pause) {
    z.blink = 0.6;
    if (!z.lauf && !z.schlange.length) z.vormerken = 'plus';
    return;
  }
  _m5sAllesLanden();
  _m5sPlusStart();
  _m5sStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m5sAnhalten() {
  if (!_m5s) return;
  const z = _m5s;
  if (z.pause) {
    z.pause = false; z.blink = 0;
    const v = z.vormerken;
    z.vormerken = null;
    if (v === 'mal') _m5sMalStart();
    else if (v === 'plus') _m5sPlusStart();
  } else z.pause = true;
  _m5sStatus();
}
function _m5sTempo() {
  if (!_m5s) return;
  _m5s.langsam = !_m5s.langsam;
  _m5sStatus();
}
function _m5sMaterial() {
  if (!_m5s) return;
  _m5s.material = !_m5s.material;
  _m5sStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m5sZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5sUpdate(dt) {
  if (!_m5s) return;
  const z = _m5s, K = _m5sK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);            // Schild und Materialblende in echter Zeit
  const ziel = z.material ? 1 : 0, sch = roh / 0.35;
  z.matA = z.matA < ziel ? Math.min(ziel, z.matA + sch) : Math.max(ziel, z.matA - sch);
  dt = roh * _m5sZeitfaktor(z);                    // ab hier Sim-Zeit
  z.t += dt;
  for (let c = 0; c < 4; c++) z.pop[c] += dt;
  z.nullGlanz = Math.max(0, z.nullGlanz - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  if (dt > 0) {                                    // ohne Zeit kein Schritt im Ablauf
    if (!z.lauf && z.schlange.length) _m5sNaechster();
    const L = z.lauf;
    if (L) {
      L.t += dt;
      if (L.art === 'mal' && L.aha && !L.ahaFertig && L.t >= K.T_GLEIT) { L.ahaFertig = true; _m5sAha(L); }
      if (L.art === 'plus') _m5sPlusSchritt(L, dt);
      else if (L.t >= L.dauer) { _m5sLaufLanden(false); _m5sStatus(); }
    }
  }
  _bioFxUpdate(z.fx.teile, dt);
}
function _m5sPlusSchritt(L, dt) {
  L.pt += dt;
  while (L.i < L.phasen.length && L.pt >= L.phasen[L.i].dauer) {
    L.pt -= L.phasen[L.i].dauer;
    _m5sPhaseEnde(L, L.phasen[L.i]);
    L.i++;
  }
  if (L.i >= L.phasen.length) { _m5sLaufLanden(false); _m5sStatus(); }
}
// Ende einer Teilbewegung von „10 mehr“: Material zaehlen, Karte umspringen lassen.
// Eine Karte zeigt nie 10: Bei zehn Stangen bleibt sie stehen, bis das Buendel weg ist.
function _m5sPhaseEnde(L, ph) {
  const z = _m5s;
  if (ph.art === 'stange') {
    L.zw[2] += 1;
    if (L.zw[2] < 10) { L.karten[2] = L.zw[2]; z.pop[2] = 0; }
  } else {
    const c = ph.c;
    L.zw[c] = 0; L.zw[c - 1] += 1;
    L.karten[c] = 0; z.pop[c] = 0;
    if (L.zw[c - 1] < 10) { L.karten[c - 1] = L.zw[c - 1]; z.pop[c - 1] = 0; }
  }
}
// Aha: die drei Stangen sind als drei Platten bei den Hundertern angekommen.
function _m5sAha(L) {
  const z = _m5s, n = L.nach[1];
  if (!n) return;
  let sx = 0, sy = 0;
  for (let i = 0; i < n; i++) { const p = _m5sPlatz(1, i); sx += p.x + p.w / 2; sy += p.y + p.h / 2; }
  z.aha = true; z.ahaX = sx / n; z.ahaY = sy / n; z.ahaGlanz = 2.4;
  _bioFxWelle(z.fx.teile, z.ahaX, z.ahaY, '#f59e0b', 46);
}

// ── Zeichnen: Material ──────────────────────────────────────────────────
function _m5sEiner(ctx, x, y, w, h) {
  const F = _m5sFARBE[3];
  ctx.fillStyle = F.fuell; ctx.strokeStyle = F.rand; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x, y, w, h, Math.min(2.5, w / 4, h / 4)); ctx.fill(); ctx.stroke();
  if (w > 8 && h > 8) {
    ctx.strokeStyle = F.licht; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x + 2.5, y + h - 3); ctx.lineTo(x + 2.5, y + 2.5); ctx.lineTo(x + w - 3, y + 2.5); ctx.stroke();
  }
}
// Stange aus zehn Wuerfeln, liegend oder stehend (je nach laengerer Seite).
function _m5sStange(ctx, x, y, w, h) {
  const F = _m5sFARBE[2], liegt = w >= h;
  const fuge = (k, dick) => {
    ctx.beginPath();
    if (liegt) { ctx.moveTo(x + w * k / 10, y); ctx.lineTo(x + w * k / 10, y + h); }
    else { ctx.moveTo(x, y + h * k / 10); ctx.lineTo(x + w, y + h * k / 10); }
    ctx.lineWidth = dick; ctx.stroke();
  };
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = F.linie;
  for (let k = 1; k < 10; k++) if (k !== 5) fuge(k, 0.8);
  ctx.strokeStyle = F.rand; fuge(5, 1.8);                         // Fuenfermarke
  ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
}
function _m5sPlatte(ctx, x, y, w, h) {
  const F = _m5sFARBE[1];
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = F.linie; ctx.lineWidth = Math.max(0.4, w / 70);
  for (let k = 1; k < 10; k++) {
    if (k === 5) continue;
    ctx.beginPath(); ctx.moveTo(x + w * k / 10, y); ctx.lineTo(x + w * k / 10, y + h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + h * k / 10); ctx.lineTo(x + w, y + h * k / 10); ctx.stroke();
  }
  ctx.strokeStyle = F.rand; ctx.lineWidth = Math.max(0.9, w / 32); // Fuenferlinien
  ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
  ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
}
function _m5sWuerfel(ctx, x, y, w, h) {
  const F = _m5sFARBE[0], g = Math.min(w, h), d = g * 0.26, s = g - d;
  x += (w - g) / 2; y += (h - g) / 2;
  ctx.lineWidth = 1; ctx.strokeStyle = F.rand;
  ctx.fillStyle = F.oben;                                         // Deckel
  ctx.beginPath(); ctx.moveTo(x, y + d); ctx.lineTo(x + d, y); ctx.lineTo(x + d + s, y); ctx.lineTo(x + s, y + d); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = F.seite;                                        // Seite
  ctx.beginPath(); ctx.moveTo(x + s, y + d); ctx.lineTo(x + s + d, y); ctx.lineTo(x + s + d, y + s); ctx.lineTo(x + s, y + d + s); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y + d, s, s);          // Vorderseite
  ctx.strokeRect(x, y + d, s, s);
  ctx.strokeStyle = 'rgba(109,40,217,0.55)'; ctx.lineWidth = Math.max(0.8, g / 30);   // Fuenferlinien
  ctx.beginPath(); ctx.moveTo(x + s / 2, y + d); ctx.lineTo(x + s / 2, y + d + s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + d + s / 2); ctx.lineTo(x + s, y + d + s / 2); ctx.stroke();
}
// Ein Stueck der Art c (0 T, 1 H, 2 Z, 3 E) in den Kasten r, Deckkraft a.
function _m5sStueck(ctx, c, r, a) {
  if (a <= 0.01 || r.w < 0.5 || r.h < 0.5) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (c === 3) _m5sEiner(ctx, r.x, r.y, r.w, r.h);
  else if (c === 2) _m5sStange(ctx, r.x, r.y, r.w, r.h);
  else if (c === 1) _m5sPlatte(ctx, r.x, r.y, r.w, r.h);
  else _m5sWuerfel(ctx, r.x, r.y, r.w, r.h);
  ctx.restore();
}
function _m5sWackelDx(c) {
  const w = _m5s.wackel;
  return c === 0 && w > 0 ? Math.sin(w * 48) * 3 * (w / 0.45) : 0;
}
// Das ruhende Material: mat[c] Stuecke je Spalte; ohne[c] = so viele Plaetze ab
// `ab[c]` auslassen (die gerade unterwegs sind).
function _m5sMaterialStatisch(ctx, mat, ausser) {
  const z = _m5s;
  if (z.matA <= 0.01) return;
  for (let c = 0; c < 4; c++) {
    if (ausser === c) continue;
    const dx = _m5sWackelDx(c);
    for (let i = 0; i < Math.min(10, mat[c]); i++) {
      const p = _m5sPlatz(c, i);
      _m5sStueck(ctx, c, { x: p.x + dx, y: p.y, w: p.w, h: p.h }, z.matA);
    }
  }
}

// ── Zeichnen: Karten, Tafel ─────────────────────────────────────────────
function _m5sMisch(h1, h2, u) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const a = p(h1), b = p(h2);
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * u)).join(',') + ')';
}
function _m5sKartenFarbe(c, ziffer) {
  if (ziffer === 0) return _m5sK.NULL;
  const F = _m5sFARBE[c];
  return { grund: F.karte, rand: F.rand, schrift: F.rand };
}
function _m5sKartenFarbeMisch(c1, c2, u) {
  const A = _m5sFARBE[c1], B = _m5sFARBE[c2], r = _m5sMisch(A.rand, B.rand, u);
  return { grund: _m5sMisch(A.karte, B.karte, u), rand: r, schrift: r };
}
function _m5sText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || '#1f2937';
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Ziffernkarte, Mitte (x, y); k = Groesse, a = Deckkraft.
function _m5sKarte(ctx, x, y, ziffer, f, k, a) {
  if (a <= 0.01) return;
  const K = _m5sK, w = K.KW * k, h = K.KH * k;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = f.grund; ctx.strokeStyle = f.rand; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, x - w / 2, y - h / 2, w, h, 7); ctx.fill(); ctx.stroke();
  _m5sText(ctx, String(ziffer), x, y + 10 * k, Math.round(28 * k), f.schrift);
  ctx.restore();
}
function _m5sPopK(c) {
  const p = _m5s.pop[c], T = _m5sK.T_POP;
  return p < T ? Math.max(0.3, _bioFxEase.federn(p / T)) : 1;
}
// Ruhende Karten: ab der ersten Ziffer, die 0 orange.
function _m5sKartenStatisch(ctx, karten, ausser) {
  const K = _m5sK, e = _m5sErste(karten);
  for (let c = e; c < 4; c++) {
    if (c === ausser) continue;
    _m5sKarte(ctx, _m5sMitte(c) + _m5sWackelDx(c), K.KY, karten[c], _m5sKartenFarbe(c, karten[c]), _m5sPopK(c), 1);
  }
}
// Spalten links der ersten Ziffer gehoeren nicht zur Zahl: blass getoent.
function _m5sBlass(ctx, erste) {
  const K = _m5sK;
  ctx.fillStyle = '#f1f5f9';
  for (let c = 0; c < erste; c++) ctx.fillRect(K.LX + c * K.CW + 1, K.YK + 1, K.CW - 2, K.Y1 - K.YK - 2);
}
// Leere Materialspalte innerhalb der Zahl: grau gestrichelt umrandet.
function _m5sStrichel(ctx, c, a) {
  if (a <= 0.01) return;
  const K = _m5sK, x0 = K.LX + c * K.CW;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.6;
  if (ctx.setLineDash) ctx.setLineDash([4, 3]);
  _bioFxRundRect(ctx, x0 + 7, K.YC + 6, K.CW - 14, K.Y1 - K.YC - 13, 7); ctx.stroke();
  if (ctx.setLineDash) ctx.setLineDash([]);
  ctx.restore();
}
function _m5sStrichelStatisch(ctx, karten, mat) {
  const e = _m5sErste(karten);
  for (let c = e; c < 4; c++) if (karten[c] === 0 && mat[c] === 0) _m5sStrichel(ctx, c, _m5s.matA);
}
function _m5sGrund(ctx) {
  const z = _m5s, K = _m5sK;
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.X0, K.Y0, K.X1 - K.X0, K.Y1 - K.Y0, 10); ctx.fill();
  for (let c = 0; c < 4; c++) {                                  // Kopfzeile
    const x0 = K.LX + c * K.CW, cx = _m5sMitte(c), F = _m5sFARBE[c];
    ctx.fillStyle = F.grund;
    _bioFxRundRect(ctx, x0 + 4, K.Y0 + 4, K.CW - 8, K.YK - K.Y0 - 6, 7); ctx.fill();
    _m5sText(ctx, _m5sKURZ[c], cx, 25, 17, F.rand);
    _m5sText(ctx, _m5sWORT[c], cx, 36, 10, '#334155', 'center', '600');
  }
  const lab = Math.max(0.35, z.matA);
  _m5sText(ctx, 'Ziffern', 12, K.KY + 4, 12, '#475569', 'left');
  ctx.save(); ctx.globalAlpha = lab;
  _m5sText(ctx, 'Material', 12, (K.YC + K.Y1) / 2 + 4, 12, '#475569', 'left');
  ctx.restore();
}
function _m5sLinien(ctx) {
  const K = _m5sK;
  ctx.save();
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.2;
  for (let c = 1; c < 4; c++) {
    const x = K.LX + c * K.CW;
    ctx.beginPath(); ctx.moveTo(x, K.YK); ctx.lineTo(x, K.Y1); ctx.stroke();
  }
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(K.LX, K.Y0); ctx.lineTo(K.LX, K.Y1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(K.X0, K.YK); ctx.lineTo(K.X1, K.YK); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(K.X0, K.YC); ctx.lineTo(K.X1, K.YC); ctx.stroke();
  ctx.restore();
}

// ── Zeichnen: die einzelnen Ablaeufe ────────────────────────────────────
function _m5sRuheZeichnen(ctx, d) {
  _m5sBlass(ctx, _m5sErste(d));
  _m5sLinien(ctx);
  _m5sStrichelStatisch(ctx, d, d);
  _m5sMaterialStatisch(ctx, d, -1);
  _m5sNullGlanz(ctx, d);
  _m5sKartenStatisch(ctx, d, -1);
}
// Die Karte 0, die gerade in die Einerspalte gefallen ist, leuchtet kurz nach.
function _m5sNullGlanz(ctx, d) {
  const z = _m5s, K = _m5sK;
  if (z.nullGlanz <= 0 || d[3] !== 0) return;
  ctx.save();
  ctx.globalAlpha = 0.5 * z.nullGlanz / K.T_GLANZ;
  ctx.fillStyle = '#fdba74';
  _bioFxRundRect(ctx, _m5sMitte(3) - K.KW / 2 - 7, K.YK + 2, K.KW + 14, K.YC - K.YK - 4, 11); ctx.fill();   // bleibt in der Kartenzeile
  ctx.restore();
}
function _m5sLadenZeichnen(ctx, L) {
  const z = _m5s, K = _m5sK, u = L.t, neu = L.neu;
  _m5sBlass(ctx, _m5sErste(neu));
  _m5sLinien(ctx);
  // das Alte blendet an seinem Platz aus (0,18 s) – erst danach kommt das Neue,
  // sonst liegen alte und neue Karte uebereinander (am Bild gesehen)
  const A = 0.18;
  if (L.alt && u < A) {
    const a = 1 - u / A;
    for (let c = 0; c < 4; c++) for (let i = 0; i < L.alt[c]; i++) _m5sStueck(ctx, c, _m5sPlatz(c, i), z.matA * a);
    const ea = _m5sErste(L.alt);
    for (let c = ea; c < 4; c++) _m5sKarte(ctx, _m5sMitte(c), K.KY, L.alt[c], _m5sKartenFarbe(c, L.alt[c]), 1, a);
  }
  // das Neue faellt gestaffelt in seine Plaetze
  const e = _m5sErste(neu);
  for (let c = e; c < 4; c++) if (neu[c] === 0) _m5sStrichel(ctx, c, z.matA * _bioFxKlemme((u - 0.4) / 0.25));
  const n = neu.reduce((s, v) => s + v, 0), stag = n > 1 ? Math.min(0.025, 0.2 / (n - 1)) : 0;
  let j = 0;
  for (let c = 0; c < 4; c++) for (let i = 0; i < neu[c]; i++) {
    const p = _bioFxKlemme((u - A - stag * j++) / 0.3), ee = _bioFxEase.sanft(p), r = _m5sPlatz(c, i);
    _m5sStueck(ctx, c, { x: r.x, y: r.y - 6 * (1 - ee), w: r.w, h: r.h }, z.matA * p);
  }
  for (let c = e; c < 4; c++) {
    const p = _bioFxKlemme((u - A - 0.06 * (c - e)) / 0.3);
    const k = p < 1 ? Math.max(0.3, _bioFxEase.federn(p)) : 1;
    _m5sKarte(ctx, _m5sMitte(c), K.KY, neu[c], _m5sKartenFarbe(c, neu[c]), k, p);
  }
}
function _m5sMalZeichnen(ctx, L) {
  const z = _m5s, K = _m5sK, von = L.von, nach = L.nach, e0 = _m5sErste(von), e1 = e0 - 1;
  _m5sBlass(ctx, e1);
  _m5sLinien(ctx);
  if (L.t < K.T_GLEIT) {
    const u = _bioFxKlemme(L.t / K.T_GLEIT), e = _bioFxEase.sanft(u);
    // gestrichelte Spalten: die alten blenden aus, die neuen (ausser E) ein
    for (let c = e0; c < 4; c++) if (von[c] === 0) _m5sStrichel(ctx, c, z.matA * (1 - _bioFxKlemme(u / 0.3)));
    for (let c = e1; c < 3; c++) if (nach[c] === 0) _m5sStrichel(ctx, c, z.matA * _bioFxKlemme((u - 0.7) / 0.3));
    // jedes Stueck waechst zur naechsten Form und gleitet eine Spalte weiter
    // kleiner Bogen und kurzes Aufbluehen – so knapp, dass kein Stueck in die Kartenzeile ragt
    const puff = 1 + 0.06 * Math.sin(Math.PI * e), hub = 4 * Math.sin(Math.PI * e);
    const m = _bioFxKlemme((u - 0.2) / 0.6);
    for (let c = e0; c < 4; c++) for (let i = 0; i < von[c]; i++) {
      const a = _m5sPlatz(c, i), b = _m5sPlatz(c - 1, i);
      const w = (a.w + (b.w - a.w) * e) * puff, h = (a.h + (b.h - a.h) * e) * puff;
      const cx = a.x + a.w / 2 + (b.x + b.w / 2 - a.x - a.w / 2) * e;
      const cy = a.y + a.h / 2 + (b.y + b.h / 2 - a.y - a.h / 2) * e - hub;
      const r = { x: cx - w / 2, y: cy - h / 2, w, h };
      _m5sStueck(ctx, c, r, z.matA * (1 - m));
      _m5sStueck(ctx, c - 1, r, z.matA * m);
    }
    // die Karten gleiten mit (waagerecht, in ihrer Zeile) und nehmen die Farbe der neuen Spalte an
    for (let c = e0; c < 4; c++) {
      const x = _m5sMitte(c) + (_m5sMitte(c - 1) - _m5sMitte(c)) * e;
      _m5sKarte(ctx, x, K.KY, von[c], von[c] === 0 ? K.NULL : _m5sKartenFarbeMisch(c, c - 1, e), 1, 1);
    }
  } else {
    // alles steht in der neuen Spalte; in die Einerspalte faellt die Karte 0
    const u2 = _bioFxKlemme((L.t - K.T_GLEIT) / K.T_NULL), e2 = _bioFxEase.raus(u2);
    for (let c = e1; c < 3; c++) if (nach[c] === 0) _m5sStrichel(ctx, c, z.matA);
    _m5sStrichel(ctx, 3, z.matA * e2);
    _m5sMaterialStatisch(ctx, nach, -1);
    _m5sKartenStatisch(ctx, nach, 3);
    // faellt von knapp oberhalb und waechst dabei auf volle Groesse – bleibt in der Kartenzeile
    _m5sKarte(ctx, _m5sMitte(3), K.KY - 10 * (1 - e2), 0, K.NULL, 0.6 + 0.4 * e2, Math.min(1, u2 * 2.5));
  }
}
function _m5sPlusZeichnen(ctx, L) {
  const z = _m5s, K = _m5sK;
  const ph = L.phasen[Math.min(L.i, L.phasen.length - 1)];
  const u = _bioFxKlemme(L.pt / ph.dauer);
  _m5sBlass(ctx, _m5sErste(L.karten));
  _m5sLinien(ctx);
  _m5sStrichelStatisch(ctx, L.karten, L.zw);
  if (ph.art === 'stange') {
    // eine Stange gleitet von unten in die Zehnerspalte (unter ihrem Platz ist frei)
    _m5sMaterialStatisch(ctx, L.zw, -1);
    const e = _bioFxEase.sanft(u), r = _m5sPlatz(2, L.zw[2]);
    _m5sStueck(ctx, 2, { x: r.x, y: r.y + 40 * (1 - e), w: r.w, h: r.h }, z.matA * _bioFxKlemme(u * 3));
  } else {
    // zehn Stuecke gleiten zusammen und wandern als ein Stueck eine Spalte weiter
    const c = ph.c, cx = _m5sMitte(c);
    _m5sMaterialStatisch(ctx, L.zw, c);
    const tS = K.T_SAMMEL;
    if (L.pt < tS) {
      const e = _bioFxEase.sanft(_bioFxKlemme(L.pt / tS));
      for (let k = 0; k < 10; k++) {
        const a = _m5sPlatz(c, k);
        const b = c === 2 ? { x: cx - 30, y: K.YC + 10 + k * 6, w: 60, h: 6 }
                          : { x: cx - 13, y: K.YC + 50 - k * 2.2, w: 26, h: 26 };
        _m5sStueck(ctx, c, { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e,
                             w: a.w + (b.w - a.w) * e, h: a.h + (b.h - a.h) * e }, z.matA);
      }
    } else {
      const u2 = _bioFxKlemme((L.pt - tS) / K.T_BUENDEL), e = _bioFxEase.sanft(u2);
      const a = c === 2 ? { x: cx - 30, y: K.YC + 10, w: 60, h: 60 } : { x: cx - 15, y: K.YC + 30, w: 30, h: 30 };
      const b = _m5sPlatz(c - 1, L.zw[c - 1]);
      const r = { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e - 14 * Math.sin(Math.PI * e),
                  w: a.w + (b.w - a.w) * e, h: a.h + (b.h - a.h) * e };
      const m = _bioFxKlemme(u2 / 0.5);
      if (c === 2) {                                // zehn Stangen untereinander = ein Quadrat
        for (let k = 0; k < 10; k++)
          _m5sStueck(ctx, 2, { x: r.x, y: r.y + k * r.h / 10, w: r.w, h: r.h / 10 }, z.matA * (1 - m));
      } else _m5sStueck(ctx, 1, r, z.matA * (1 - m));
      _m5sStueck(ctx, c - 1, r, z.matA * m);
      if (u2 < 0.25 && z.matA > 0.01) {             // kurzes Aufhellen beim Verschmelzen
        ctx.save(); ctx.globalAlpha = 0.7 * (1 - u2 / 0.25) * z.matA; ctx.fillStyle = '#ffffff';
        ctx.fillRect(r.x - 2, r.y - 2, r.w + 4, r.h + 4); ctx.restore();
      }
    }
  }
  _m5sKartenStatisch(ctx, L.karten, -1);
}
function _m5sDraw(ctx, cv) {
  if (!_m5s) return;
  const z = _m5s, K = _m5sK, W = cv.width, H = cv.height, L = z.lauf;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m5sGrund(ctx);
  if (L && L.art === 'laden') _m5sLadenZeichnen(ctx, L);
  else if (L && L.art === 'mal') _m5sMalZeichnen(ctx, L);
  else if (L && L.art === 'plus') _m5sPlusZeichnen(ctx, L);
  else _m5sRuheZeichnen(ctx, _m5sZiffern(z.zahl));
  // Aha: die Platten in der Hunderterspalte leuchten nach (ohne Text)
  if (z.ahaGlanz > 0 && z.matA > 0.01) {
    ctx.save(); ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.8) * z.matA;
    _bioFxLeuchten(ctx, z.ahaX, z.ahaY, 26, z.t, '245,158,11');
    ctx.restore();
  }
  _bioFxDraw(ctx, z.fx.teile);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.X0, K.Y0, K.X1 - K.X0, K.Y1 - K.Y0, 10); ctx.stroke();
  if (z.pause) _m5sPauseSchild(ctx);
}
// Schild „Pause“ oben links – gleiche Stelle, Groesse und Farbe wie in
// m5-plus-schriftlich. Hier liegt es ueber der leeren Kopfzelle der
// Beschriftungsspalte (endet bei x = 72, die Tafel beginnt bei 74).
function _m5sPauseSchild(ctx) {
  const z = _m5s, w = 64, h = 25, x = 8, y = 8;
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
  _m5sText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
