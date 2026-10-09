

// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mr4 „Wie zerlegt man geschickt?“
// (Kennung m5-zerlegen, Praefix _m6d)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL5_PROFIL.md, Abschnitte mr4 und
// m5-zerlegen; sim_plan in einheiten/mr4.json (Starttexte von dort).
// Ueberschrift (sim-h3): „Wie viele Punkte hat das Feld?“ (die `frage` der
// Einheit spricht von Plaetzen).
//
// WAS MAN SIEHT (Leinwand 420 x 250, Karopapier, Kaestchen 15 px):
//   - Ein Punktefeld als Sitzplan von oben: 6 Reihen gleich vieler Punkte,
//     ein Punkt je Kaestchen, nach dem 5. und 10. Punkt einer Reihe ein
//     Kaestchen frei (Fuenferstruktur), nach der 5. Reihe eine Kaestchenzeile
//     frei (wie das Punktefeld aus mm1). Rechts neben jeder Reihe eine Klammer
//     „]“ mit der Anzahl je Reihe („14“).
//   - Ueber dem ganzen Feld zuerst seine Malaufgabe („6 · 14“).
//   - Eine senkrechte gestrichelte Linie ist der Schnitt (der Gang). Nach dem
//     Schnitt ruecken die Teile ein Kaestchen auseinander, der linke Teil
//     bleibt blau, der rechte wird orange: Seine Punkte WENDEN sich wie
//     Wendeplaettchen (kurz hochkant, dann die andere Seite – keine
//     Mischfarbe), als Welle vom Schnitt nach rechts. Ueber jedem Teil seine Malaufgabe
//     („6 · 10“ blau, „6 · 4“ orange), unter jedem Teil ein Schild mit seiner
//     Punktzahl („60“, „24“) – so steht jede Zahl an dem Stueck Feld, das sie
//     zaehlt (Bild <-> Zeichen, MATHE_PROFIL § 10.2).
//   - Unter dem Feld die Rechnung in EINER Zeile, Teile in ihren Farben:
//     „6 · (10 + 4) = 6 · 10 + 6 · 4 = 60 + 24 = 84“. Sie waechst mit dem
//     Ablauf von links nach rechts, ihre Teile stehen von Anfang an an ihrem
//     festen Platz (nichts rutscht nach).
//
// BEWEGUNG (jede Sprungmarke spielt SELBST ab – N1: ein Heftschritt = eine
// Handlung; anhalten kann die Lehrkraft). Zeiten bei „Tempo: normal“:
//   0,00–0,12 s  ein altes Feld blendet aus
//   0,12–0,92 s  das Feld baut sich Reihe fuer Reihe auf (je Reihe 0,2 s,
//                Versatz 0,12 s), die Klammern kommen mit ihrer Reihe
//   0,92–1,37 s  der Schnitt faellt von oben durch alle Reihen; danach steht
//                „6 · (10 + 4)“ in der Rechnungszeile
//   1,37–1,82 s  die Teile ruecken ein Kaestchen auseinander, der rechte wendet
//                sich auf Orange; „6 · 14“ teilt sich in „6 · 10“ und „6 · 4“, die
//                Rechnung waechst um „= 6 · 10 + 6 · 4“
//   1,85–2,20 s  der linke Teil leuchtet Reihe fuer Reihe, das Schild „60“
//                springt auf
//   2,25–2,60 s  der rechte Teil leuchtet Reihe fuer Reihe, das Schild „24“
//                springt auf (Aha, siehe unten)
//   2,65–2,95 s  beide Zahlen gleiten aus ihren Schildern in die Rechnung
//                („= 60 + 24“), dann federt „= 84“ auf
//   GEMESSEN: fertig nach 3,0 s = 188 Frames zu 16 ms (Ziel V7: hoechstens
//   3 s). simfakten.js mit --frames=25 --verlauf=8 liest bis Frame 225.
//   „Schnitt nach links“ / „Schnitt nach rechts“ (frei): die Punktspalte am
//     Schnitt wechselt den Teil – sie gleitet ein Kaestchen hinueber und
//     wendet sich dabei auf die Farbe des neuen Teils, der Schnitt gleitet
//     mit (0,35 s);
//     dann leuchten beide Teile kurz auf, die Schilder und die Rechnung zeigen
//     die neuen Teile (federnd), die Summe leuchtet kurz bernsteinfarben – sie
//     bleibt. Fertig nach 0,5 s.
//   „Tareks Weg“: der linke Teil leuchtet blau (er ist richtig gezaehlt),
//     dann leuchtet im rechten Teil nur die oberste Reihe orange, die anderen
//     5 Reihen werden grau mit orangem Rand. Fertig nach 1,0 s; die Ansicht
//     bleibt stehen bis zur naechsten Handlung (Schnitt, Sprungmarke, „neu“).
//   „neu“: das Feld blendet aus (0,35 s), zurueck zum Start.
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort
// ankommen; dann geschieht das Neue. Jede Knopffolge ergibt so dieselben
// Zahlen. Grenze: Der Schnitt bleibt zwischen Spalte 1 und der vorletzten
// Spalte (1 ≤ k ≤ n − 1). Darueber hinaus wackelt das Feld kurz, und
// _m6d-grenze zeigt „Weiter geht der Schnitt nicht.“ (bis zur naechsten
// Handlung; sonst ist die Zeile ausgeblendet). Sonst aendert sich nichts.
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6dMarke('…'),
//     Wahlgruppe fuer simfakten.js):
//     „6 · (10 + 2)“ · „6 · (10 + 4)“ · „6 · (7 + 7)“ · „6 · (5 + 9)“
//   Reihe 2: „Schnitt nach links“ (_m6dLinks) · „Schnitt nach rechts“
//     (_m6dRechts) · „Tareks Weg“ (_m6dTarek) · „neu“ (_m6dNeu).
//     Die ersten drei sind blass, solange keine Aufgabe gewaehlt ist.
// Hervorgehoben ist die Sprungmarke, deren Feld und Schnitt gerade dastehen
// (auch, wenn man mit „Schnitt nach …“ dorthin gerueckt ist: 6 · (10 + 4),
// dreimal „Schnitt nach links“ -> „6 · (7 + 7)“ leuchtet).
// Ein Name steht nur im festen Knopf und in der Zeile „Tareks Weg“ (Bauplan,
// Offen 7, wie m5-laengen und m5-geld in Kapitel 6).
//
// STATUSZEILEN (woertlich aus dem sim_plan, jede mit mehr als 18 Zeichen).
// Sie folgen dem Bild: Eine Zahl steht erst in der Anzeige, wenn sie im Bild
// angekommen ist.
//   _m6d-aufgabe   „Malaufgabe: 6 · 14 (6 Reihen zu je 14)“
//                  (Start „Malaufgabe: noch keine gewählt“)
//   _m6d-schnitt   „Geschnitten: 14 = 10 + 4“ – sobald der Schnitt gefallen ist
//                  (vorher „Geschnitten: noch nicht“)
//   _m6d-teile     „Punkte in den Teilen: 60 und 24“ – erst, wenn beide Teile
//                  geleuchtet haben (vorher „Punkte in den Teilen: noch nicht gezählt“)
//   _m6d-rechnung  „Rechnung: 6 · 10 + 6 · 4 = 60 + 24“ – wenn die Zahlen in
//                  der Rechnung angekommen sind (vorher „Rechnung: noch nicht gerechnet“)
//   _m6d-ergebnis  „Ergebnis: 84 Punkte im ganzen Feld“ – erst am Ende
//                  (vorher „Ergebnis: noch nicht gezählt“)
//   _m6d-tarek     nur nach „Tareks Weg“ (sonst leer und versteckt):
//                  „Tareks Weg: 60 + 4 = 64, nicht gezählt: 20“
//   _m6d-grenze    nur an der Grenze (siehe oben)
//   _m6d-lehrkraft Hinweis fuer die Lehrkraft (siehe unten)
// Zahlen in Blau (linker Teil) und Orange (rechter Teil) wie im Bild.
// Zwischen Zahl und „·“ ein geschuetztes Leerzeichen (U+00A0).
//
// WERTE (jede Zahl aus _m6dWerte(n, k), nachgerechnet mit simcheck/werte.js):
//   6 · (10 + 2) -> 6 · 12, 12 = 10 + 2, Teile 60 und 12, Rechnung
//                   6 · 10 + 6 · 2 = 60 + 12, Feld 72 · Tarek 60 + 2 = 62,
//                   nicht gezaehlt 10
//   6 · (10 + 4) -> 6 · 14, 14 = 10 + 4, 60 und 24, 84 · Tarek 64, nicht
//                   gezaehlt 20
//   6 · (7 + 7)  -> 14 = 7 + 7, 42 und 42, 84
//   6 · (5 + 9)  -> 14 = 5 + 9, 30 und 54, 84
//   frei: 6 · (10 + 4), „Schnitt nach links“ -> 14 = 9 + 5, 54 und 30, 84;
//   jeder Schnitt nach k Spalten (1 ≤ k ≤ 13) -> 6 · k und 6 · (14 − k),
//   immer 84. 6 · (5 + 9), 4-mal „Schnitt nach links“ -> 14 = 1 + 13, 6 und
//   78; der 5. Druck -> „Weiter geht der Schnitt nicht.“
//   Tarek allgemein: 6 · k + (n − k) = …, nicht gezaehlt: 5 · (n − k).
// START: noch nichts gewaehlt, leeres Karopapier („Start: noch keine Aufgabe
// gewählt“).
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen): bei jedem „6 · (10 + 4)“, wenn
// der rechte Teil Reihe fuer Reihe geleuchtet hat (2,6 s) – ein orange
// Lichtring breitet sich um den rechten Teil aus, und ein ruhig pulsierender
// Rahmen liegt 2,2 s um ihn: 6 Reihen zu je 4, nicht eine. Das widerlegt „64“.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-punktefeld; Container
// <div class="fpm-lehrkraft">, den simfakten.js ueberspringt – V4). Eigene
// Zeile unter den Heftknoepfen, davor klein „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m6dAnhalten): friert jede Bewegung sofort ein;
//     „weiter“ macht genau dort weiter. Schild „Pause“ oben links im Bild
//     (Stelle und Aussehen wie in m5-plus-schriftlich / m5-punktefeld).
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m6dTempo): ein Drittel so schnell.
//   „Teile verdecken: aus“ <-> „… an“ (_m6dVerdecken): verdeckt die
//     Punktzahlen der Teile, die Zahlen der Rechnung und die Summe (im Bild
//     graue Karten mit „?“, in den Zeilen „verdeckt“, auch Tareks Zahlen).
//     Feld, Schnitt und die Malaufgaben „6 · 10“, „6 · 4“ bleiben sichtbar:
//     zum Vermuten an der Tafel.
//   Nur das wechselnde Wort steht in einem eigenen <span>.
//   Hinweiszeile _m6d-lehrkraft (in der Pause „lmp-status off“, sonst „on“):
//     sonst    „Für die Lehrkraft: „Pause“ hält alles an. „Teile verdecken“ lässt erst vermuten.“
//     verdeckt „Teile verdeckt. Erst vermuten lassen, dann wieder aufdecken.“
//     Pause    „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
//   So ist es gebaut: EIN Zeitfaktor (_m6dZeitfaktor: 0 Pause, 1/3 langsam,
//   1 normal) an der einen Stelle, an der dt in die Bewegung geht (Anfang von
//   _m6dUpdate). Ohne Zeit kein Schritt im Ablauf. Waehrend der Pause bewegt
//   kein Knopf etwas: „Schnitt nach …“ und „Tareks Weg“ werden VORGEMERKT,
//   wenn nichts unterwegs ist (sie beginnen mit „weiter“), und ENTFALLEN, wenn
//   eine Bewegung steht (sie liessen sie sofort ankommen); das Schild „Pause“
//   leuchtet dabei kurz auf (in echter Zeit). Eine Sprungmarke und „neu“ heben
//   die Pause auf; Tempo und Verdecken bleiben stehen.
//   Voreinstellung: Pause aus, Tempo normal, Verdecken aus – bildgleich mit
//   einer Simulation ohne Lehrkraft-Zeile.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): „mal 6“ als Regel
// (auch „beide Teile mal …“), „Verteilungsgesetz“, „Distributivgesetz“, die
// Regel als Satz (kein „Merke“, kein Satz, dass jeder Teil mal 6 gerechnet und
// dann zusammengezaehlt wird). Die Zahlen 4 und 6 der Merksatzluecken sind
// Daten und stehen natuerlich da. Keine Punktwertung, keine Zeit, kein
// „falsch“. Deterministisch, ohne Zufall: jede Zahl im Bild und in den Zeilen
// kommt aus z.n (Punkte je Reihe) und z.k (Punkte links vom Schnitt).
// ════════════════════════════════════════════════════════════════════════
let _m6d = null;
const _m6dMARKEN = { '10+2': [10, 2], '10+4': [10, 4], '7+7': [7, 7], '5+9': [5, 9] };   // [links, rechts]
const _m6dREIHE = ['10+2', '10+4', '7+7', '5+9'];
const _m6dZEILEN = 6;                        // Reihen des Feldes (der erste Faktor)
const _m6dNB = ' ';                     // geschuetztes Leerzeichen
const _m6dK = {
  KA: 15,                                    // Kaestchen (px): ein Punkt je Kaestchen
  GY: 52,                                    // Oberkante des Feldes
  MITTE: 210,                                // Mitte der Rechnungszeile
  RP: 5.2,                                   // Radius eines Punkts
  LAB_Y: 44, PILL_Y: 174, GL_Y: 222,         // Grundlinie Malaufgaben, Mitte Schilder, Grundlinie Rechnung
  GLAB: 14, GPILL: 14, GG: 17, GK: 12,       // Schriftgrade
  PX0: 4, PX1: 416, PY0: 4, PY1: 246,        // Papier
  BAND: 6.5,                                 // halbe Hoehe eines Leuchtbands
  // Ablauf einer Sprungmarke (s)
  A_LEER: 0.12, A_ROW0: 0.12, A_ROW_STEP: 0.12, A_ROW: 0.2,
  A_CUT0: 0.92, A_CUT: 0.45, A_SP0: 1.37, A_SP: 0.45, A_LAB0: 1.7,
  A_L0: 1.85, A_PL: 2.2, A_R0: 2.25, A_PR: 2.6, A_STAG: 0.06,
  A_GL0: 2.65, A_GL1: 2.95, A_END: 3.0,
  // frei
  T_SCHNITT: 0.5, T_GLEIT: 0.35, T_TAREK: 1.0, T_NEU: 0.35,
  T_GLANZ: 0.5, T_POP: 0.3, T_SUMME: 0.9, T_AHA: 2.2, LANGSAM: 1 / 3,
  // Farben
  B: { punkt: '#3b82f6', rand: '#1d4ed8', text: '#1d4ed8', band: 'rgba(59,130,246,0.20)', linie: '#3b82f6' },
  O: { punkt: '#fb923c', rand: '#c2410c', text: '#c2410c', band: 'rgba(251,146,60,0.24)', linie: '#ea580c' },
  GRAU: { punkt: '#e2e8f0', rand: '#ea580c' },
  F_TEXT: '#111827', F_KARO: '#d4e3f1', F_KLAMMER: '#64748b', F_KZAHL: '#334155',
  F_SCHNITT: '#475569', F_GLANZ: '#f59e0b'
};

// 1234 -> "1 234" mit geschuetztem Leerzeichen
function _m6dFmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, _m6dNB);
}
// „6 · 10“ mit geschuetzten Leerzeichen
function _m6dMal(a, b) { return a + _m6dNB + '·' + _m6dNB + b; }
// ALLE Zahlen einer Aufgabe 6 · n mit Schnitt nach k Punkten aus EINER Rechnung.
function _m6dWerte(n, k) {
  const r = _m6dZEILEN, b = n - k;
  return { n, a: k, b, teilL: r * k, teilR: r * b, erg: r * n,
           tarek: r * k + b, fehlt: r * b - b };
}
// Kaestchenspalte des j-ten Punkts einer Reihe (nach dem 5. und 10. ein Kaestchen frei)
function _m6dSpalte(j) { return j + Math.floor(j / 5); }
// Mitte der Reihe i (nach der 5. Reihe eine Kaestchenzeile frei)
function _m6dPY(i) { const K = _m6dK; return K.GY + (i + (i >= 5 ? 1 : 0)) * K.KA + K.KA / 2; }
// Linke Kante des Feldes: Punkte samt Gang mittig um x = 202,5 (Klammern rechts daneben)
function _m6dGX(n) {
  const K = _m6dK, breite = (_m6dSpalte(n - 1) + 2) * K.KA;
  return K.KA * Math.floor((K.MITTE - breite / 2) / K.KA);
}

function _m6dInit() {
  _m6d = { key: null, n: 0, k: 0, gx: 0, job: null, tarek: false, alt: null,
           t: 0, fx: [], wackel: 0, grenze: '', ahaGlanz: 0, glanzTeile: 0, popPill: 0,
           summeGlanz: 0, popGl: 0, stand: '',
           pause: false, langsam: false, verdeckt: false, blink: 0, vormerk: null };   // Lehrkraft
}
function _m6dHTML() {
  const marke = (k, i) => {
    const [a, b] = _m6dMARKEN[k];
    return `<button class="sim-btn" id="_m6d-b${i}" onclick="_m6dMarke('${k}')">6&nbsp;·&nbsp;(${a}&nbsp;+&nbsp;${b})</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Punkte hat das Feld?</h3>
    <div class="fpm-note" style="margin-top:2px">Der Schnitt teilt jede Reihe. Zähle links und rechts.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6d-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6dREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6d-links" onclick="_m6dLinks()">Schnitt nach links</button>
          <button class="sim-btn" id="_m6d-rechts" onclick="_m6dRechts()">Schnitt nach rechts</button>
          <button class="sim-btn" id="_m6d-tarekweg" onclick="_m6dTarek()">Tareks Weg</button>
          <button class="sim-btn" onclick="_m6dNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6d-pause" onclick="_m6dAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6d-tempo" onclick="_m6dTempo()">Tempo: <span id="_m6d-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6d-verdeckt" onclick="_m6dVerdecken()">Teile verdecken: <span id="_m6d-verdeckt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6d-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6d-aufgabe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6d-schnitt" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6d-teile" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6d-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6d-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6d-tarek" style="margin-top:6px;display:none"></div>
        <div class="lmp-status off" id="_m6d-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: noch keine Aufgabe gewählt</p>
  </div>`;
}
function _m6dSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Zeile setzen und nur zeigen, wenn sie etwas sagt.
function _m6dZeige(id, html) {
  const e = _m6dSetze(id, html);
  if (e && e.style) e.style.display = html ? '' : 'none';
}
// Was die Anzeige gerade sagen darf – sie folgt dem Bild, nicht dem Knopf.
function _m6dLage(z) {
  const K = _m6dK, J = z.job, m = !!(J && J.art === 'marke'), t = J ? J.t : 0, da = !!z.key;
  return {
    geschnitten: da && (!m || t >= K.A_CUT0 + K.A_CUT),
    gezaehlt: da && (!m || t >= K.A_PR),
    gerechnet: da && (!m || t >= K.A_GL1)
  };
}
function _m6dStand(z) {
  const L = _m6dLage(z);
  return [z.key, z.n, z.k, L.geschnitten, L.gezaehlt, L.gerechnet, z.tarek, z.grenze,
          z.verdeckt, z.pause, z.langsam, z.job ? z.job.art : ''].join('|');
}
function _m6dStatus() {
  if (!_m6d) return;
  const z = _m6d, K = _m6dK, L = _m6dLage(z), w = _m6dWerte(z.n, z.k), r = _m6dZEILEN;
  const blau = s => '<b style="color:' + K.B.text + '">' + s + '</b>';
  const orange = s => '<b style="color:' + K.O.text + '">' + s + '</b>';
  const da = !!z.key;
  _m6dSetze('_m6d-aufgabe', da
    ? 'Malaufgabe: ' + _m6dMal(r, w.n) + ' (' + r + ' Reihen zu je ' + w.n + ')'
    : 'Malaufgabe: noch keine gewählt');
  _m6dSetze('_m6d-schnitt', L.geschnitten
    ? 'Geschnitten: ' + w.n + ' = ' + blau(w.a) + ' + ' + orange(w.b)
    : 'Geschnitten: noch nicht');
  _m6dSetze('_m6d-teile', !L.gezaehlt ? 'Punkte in den Teilen: noch nicht gezählt'
    : z.verdeckt ? 'Punkte in den Teilen: verdeckt'
    : 'Punkte in den Teilen: ' + blau(_m6dFmt(w.teilL)) + ' und ' + orange(_m6dFmt(w.teilR)));
  _m6dSetze('_m6d-rechnung', !L.gerechnet ? 'Rechnung: noch nicht gerechnet'
    : 'Rechnung: ' + blau(_m6dMal(r, w.a)) + ' + ' + orange(_m6dMal(r, w.b)) + ' = ' +
      (z.verdeckt ? 'verdeckt' : blau(_m6dFmt(w.teilL)) + ' + ' + orange(_m6dFmt(w.teilR))));
  // Schluesselwort „Ergebnis“ wie in Spalte 3 der Heft-Tabelle und im Schritt
  // „Notiere das Ergebnis in Zeile 1.“ (Pruefung 09.10.2026: vorher stand am
  // Bildschirm nirgends „Ergebnis“, nur „Punkte im ganzen Feld: 72“).
  _m6dSetze('_m6d-ergebnis', !L.gerechnet ? 'Ergebnis: noch nicht gezählt'
    : z.verdeckt ? 'Ergebnis: verdeckt'
    : 'Ergebnis: ' + _m6dFmt(w.erg) + ' Punkte im ganzen Feld');
  _m6dZeige('_m6d-tarek', !z.tarek ? ''
    : z.verdeckt ? 'Tareks Weg: verdeckt'
    : 'Tareks Weg: ' + blau(_m6dFmt(w.teilL)) + ' + ' + orange(w.b) + ' = ' + _m6dFmt(w.tarek) +
      ', nicht gezählt: ' + _m6dFmt(w.fehlt));
  _m6dZeige('_m6d-grenze', z.grenze);
  // Sprungmarke hervorheben, deren Feld und Schnitt gerade dastehen (oder gebaut werden)
  _m6dREIHE.forEach((k, i) => {
    const b = document.getElementById('_m6d-b' + i), [a, c] = _m6dMARKEN[k];
    if (b && b.classList) b.classList.toggle('primary', da && a === z.k && a + c === z.n);
  });
  // Ohne Aufgabe gibt es nichts zu schneiden: die drei Knoepfe sind blass
  for (const id of ['_m6d-links', '_m6d-rechts', '_m6d-tarekweg']) {
    const b = document.getElementById(id);
    if (!b) continue;
    b.disabled = !da;
    if (b.style) b.style.opacity = da ? '' : '0.45';
  }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _m6dSetze('_m6d-pause', z.pause ? 'weiter' : 'Pause');
  _m6dSetze('_m6d-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6dSetze('_m6d-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6dSetze('_m6d-lehrkraft',
    z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : z.verdeckt ? 'Teile verdeckt. Erst vermuten lassen, dann wieder aufdecken.'
    : 'Für die Lehrkraft: „Pause“ hält alles an. „Teile verdecken“ lässt erst vermuten.');
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6d-pause', z.pause], ['_m6d-tempo', z.langsam], ['_m6d-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
  z.stand = _m6dStand(z);
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Das Bild, wie es gerade dasteht, blendet aus (Sprungmarke, „neu“).
function _m6dAltWeg(dauer) {
  const z = _m6d, V = _m6dSicht(z);
  z.alt = V ? { V, rest: dauer, dauer } : null;
}
// Sprungmarke: das Feld neu aufbauen und den Ablauf abspielen. Hebt die Pause auf.
function _m6dMarke(key) {
  if (!_m6d || !_m6dMARKEN[key]) return;
  const z = _m6d, K = _m6dK, [a, b] = _m6dMARKEN[key];
  _m6dFertig();
  _m6dAltWeg(K.A_LEER);
  z.pause = false; z.vormerk = null; z.blink = 0;
  z.key = key; z.n = a + b; z.k = a; z.gx = _m6dGX(z.n);
  z.tarek = false; z.grenze = ''; z.wackel = 0; z.ahaGlanz = 0; z.glanzTeile = 0;
  z.popPill = 0; z.summeGlanz = 0; z.popGl = 0; z.fx.length = 0;
  z.job = { art: 'marke', t: 0 };
  _m6dStatus();
}
// „neu“: zurueck zum Start (leeres Papier). Hebt die Pause auf.
function _m6dNeu() {
  if (!_m6d) return;
  const z = _m6d;
  _m6dFertig();
  _m6dAltWeg(_m6dK.T_NEU);
  z.job = null; z.pause = false; z.vormerk = null; z.blink = 0;
  z.key = null; z.n = 0; z.k = 0; z.tarek = false; z.grenze = ''; z.wackel = 0;
  z.ahaGlanz = 0; z.glanzTeile = 0; z.popPill = 0; z.summeGlanz = 0; z.popGl = 0; z.fx.length = 0;
  _m6dStatus();
}
// Waehrend der Pause: vormerken, wenn nichts unterwegs ist; sonst entfaellt der Druck.
function _m6dInDerPause(tat) {
  const z = _m6d;
  z.blink = 0.6;
  if (!z.job) z.vormerk = tat;
  _m6dStatus();
}
function _m6dLinks() { _m6dSchnitt(-1); }
function _m6dRechts() { _m6dSchnitt(1); }
// Den Schnitt um eine Spalte ruecken (d = −1 links, +1 rechts).
function _m6dSchnitt(d) {
  if (!_m6d || !_m6d.key || (d !== 1 && d !== -1)) return;
  const z = _m6d;
  if (z.pause) { _m6dInDerPause(() => _m6dSchnitt(d)); return; }
  _m6dFertig();
  z.grenze = '';
  const nach = z.k + d;
  if (nach < 1 || nach > z.n - 1) {
    z.wackel = 0.45; z.grenze = 'Weiter geht der Schnitt nicht.';
    _m6dStatus(); return;
  }
  z.tarek = false;
  z.job = { art: 'schnitt', t: 0, von: z.k, nach };
  _m6dStatus();
}
// „Tareks Weg“: nur die oberste Reihe des rechten Teils wird gezaehlt.
function _m6dTarek() {
  if (!_m6d || !_m6d.key) return;
  const z = _m6d;
  if (z.pause) { _m6dInDerPause(() => _m6dTarek()); return; }
  _m6dFertig();
  z.grenze = ''; z.tarek = false;
  z.job = { art: 'tarek', t: 0 };
  _m6dStatus();
}
// Die laufende Bewegung ist am Ziel (oder wird sofort dorthin gesetzt).
function _m6dAbschluss() {
  const z = _m6d, K = _m6dK, J = z.job;
  if (!J) return;
  z.job = null;
  if (J.art === 'schnitt') {
    z.k = J.nach;
    z.glanzTeile = K.T_GLANZ; z.popPill = K.T_POP; z.popGl = K.T_POP; z.summeGlanz = K.T_SUMME;
  } else if (J.art === 'tarek') z.tarek = true;
  _m6dStatus();
}
function _m6dFertig() { if (_m6d && _m6d.job) _m6dAbschluss(); }

// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
// „Pause“ <-> „weiter“. Beim Weitermachen laeuft die Bewegung genau dort weiter,
// wo sie stand; ein vorgemerkter Knopf wirkt jetzt.
function _m6dAnhalten() {
  if (!_m6d) return;
  const z = _m6d;
  if (z.pause) {
    z.pause = false; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v && !z.job) v();
  } else z.pause = true;
  _m6dStatus();
}
function _m6dTempo() {
  if (!_m6d) return;
  _m6d.langsam = !_m6d.langsam;
  _m6dStatus();
}
function _m6dVerdecken() {
  if (!_m6d) return;
  _m6d.verdeckt = !_m6d.verdeckt;
  _m6dStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6dZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6dK.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6dUpdate(dt) {
  if (!_m6d) return;
  const z = _m6d, K = _m6dK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);              // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6dZeitfaktor(z);                      // ab hier Sim-Zeit: 0 Pause, 1/3 langsam, 1 normal
  z.t += dt;
  z.wackel = Math.max(0, z.wackel - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.glanzTeile = Math.max(0, z.glanzTeile - dt);
  z.popPill = Math.max(0, z.popPill - dt);
  z.popGl = Math.max(0, z.popGl - dt);
  z.summeGlanz = Math.max(0, z.summeGlanz - dt);
  if (z.alt) { z.alt.rest -= dt; if (z.alt.rest <= 0) z.alt = null; }
  const J = z.job;
  if (J && dt > 0) {                                 // ohne Zeit kein Schritt im Ablauf
    const vor = J.t;
    J.t += dt;
    const ueber = s => vor < s && J.t >= s;
    if (J.art === 'marke') {
      if (ueber(K.A_PR) && z.key === '10+4') {
        // Aha: der rechte Teil hat Reihe fuer Reihe geleuchtet – 6 Reihen zu je 4
        z.ahaGlanz = K.T_AHA;
        const V = _m6dSicht(z), g = _m6dTeilKanten(V, false);
        _bioFxWelle(z.fx, (g.x0 + g.x1) / 2, (g.y0 + g.y1) / 2, '#fb923c', 62);
      }
      if (J.t >= K.A_END) _m6dAbschluss();
    } else if (J.art === 'schnitt') {
      if (J.t >= K.T_SCHNITT) _m6dAbschluss();
    } else if (J.art === 'tarek') {
      if (J.t >= K.T_TAREK) _m6dAbschluss();
    }
  }
  _bioFxUpdate(z.fx, dt);
  if (_m6dStand(z) !== z.stand) _m6dStatus();
}

// ── Was gerade wie weit zu sehen ist ────────────────────────────────────
// Leuchtband einer Reihe: in 0,08 s an, dann in 0,32 s aus.
function _m6dBandWert(t, s) {
  if (t < s) return 0;
  const d = t - s;
  return d < 0.08 ? d / 0.08 : Math.max(0, 1 - (d - 0.08) / 0.32);
}
// Die ganze Ansicht als Zahlen (auch fuer das Ausblenden des alten Bildes).
function _m6dSicht(z) {
  if (!z.key) return null;
  const K = _m6dK, kl = _bioFxKlemme, E = _bioFxEase.sanft;
  const J = z.job, art = J ? J.art : '', t = J ? J.t : 0, m = art === 'marke';
  const V = { n: z.n, k: z.k, kNeu: z.k, u: 0, gx: z.gx, verdeckt: z.verdeckt,
              wk: z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0,
              puls: 0.6 + 0.4 * Math.sin(z.t * 5) };
  V.reihe = []; V.bandL = []; V.bandR = [];
  for (let i = 0; i < _m6dZEILEN; i++) {
    V.reihe.push(m ? t - K.A_ROW0 - i * K.A_ROW_STEP : 9);   // Zeit seit dem Erscheinen der Reihe
    V.bandL.push(m ? _m6dBandWert(t, K.A_L0 + i * K.A_STAG) : art === 'tarek' ? _m6dBandWert(t, 0.04 * i) : 0);
    V.bandR.push(m ? _m6dBandWert(t, K.A_R0 + i * K.A_STAG) : 0);
  }
  V.schnitt = m ? kl((t - K.A_CUT0) / K.A_CUT) : 1;
  V.sp = m ? E(kl((t - K.A_SP0) / K.A_SP)) : 1;
  V.titelA = m ? kl((t - K.A_ROW0) / 0.2) * (1 - kl((t - K.A_LAB0) / 0.15)) : 0;
  V.labA = m ? kl((t - K.A_LAB0) / 0.15) : 1;
  V.pillL = m ? t - K.A_PL : 9;                       // Zeit seit dem Aufspringen des Schilds
  V.pillR = m ? t - K.A_PR : 9;
  V.glT = m ? t : 99;                                 // Zeit im Ablauf der Rechnungszeile
  if (art === 'schnitt') { V.kNeu = J.nach; V.u = E(kl(t / K.T_GLEIT)); }
  V.tarekOben = z.tarek ? 1 : art === 'tarek' ? kl((t - 0.35) / 0.15) : 0;
  V.tarekGrau = z.tarek ? 1 : art === 'tarek' ? E(kl((t - 0.55) / 0.4)) : 0;
  V.glanzTeile = z.glanzTeile / K.T_GLANZ;
  V.popPill = z.popPill > 0 ? K.T_POP - z.popPill : 9;
  V.popGl = z.popGl > 0 ? K.T_POP - z.popGl : 9;
  V.summe = z.summeGlanz / K.T_SUMME;
  V.aha = z.ahaGlanz > 0 ? Math.min(1, z.ahaGlanz / 0.6) : 0;
  return V;
}
// x eines Punkts in Spalte j (die Spalte am Schnitt gleitet beim Ruecken hinueber)
function _m6dX(V, j) {
  const K = _m6dK, alt = j >= V.k ? 1 : 0, neu = j >= V.kNeu ? 1 : 0;
  return V.gx + (_m6dSpalte(j) + V.sp * (alt + (neu - alt) * V.u)) * K.KA + K.KA / 2 + V.wk;
}
// Farbe eines Punkts: 0 = blau (links), 1 = orange (rechts), dazwischen wird er
// GEWENDET wie ein Wendeplaettchen (keine Mischfarbe). Beim Auseinanderruecken
// wenden die Punkte des rechten Teils als Welle vom Schnitt nach rechts; beim
// Ruecken des Schnitts wendet nur die Spalte, die den Teil wechselt.
function _m6dFarbe(V, j) {
  const alt = j >= V.k ? 1 : 0, neu = j >= V.kNeu ? 1 : 0;
  if (alt !== neu) return alt + (neu - alt) * V.u;
  if (!alt) return 0;
  const rel = (j - V.k) / Math.max(1, V.n - V.k - 1);
  return _bioFxKlemme(V.sp * 1.5 - 0.5 * rel);
}
// x eines Punkts bei festem Schnitt kk (ohne Gleiten)
function _m6dXfest(V, j, kk) {
  const K = _m6dK;
  return V.gx + (_m6dSpalte(j) + (j >= kk ? V.sp : 0)) * K.KA + K.KA / 2 + V.wk;
}
// Kanten des linken (links = true) oder rechten Teils, waehrend des Rueckens gleitend
function _m6dTeilKanten(V, links) {
  const K = _m6dK, R = K.RP + 4;
  const kanten = kk => links ? [_m6dXfest(V, 0, kk), _m6dXfest(V, kk - 1, kk)]
                             : [_m6dXfest(V, kk, kk), _m6dXfest(V, V.n - 1, kk)];
  const a = kanten(V.k), b = kanten(V.kNeu);
  return { x0: a[0] + (b[0] - a[0]) * V.u - R, x1: a[1] + (b[1] - a[1]) * V.u + R,
           y0: _m6dPY(0) - K.BAND - 2, y1: _m6dPY(_m6dZEILEN - 1) + K.BAND + 2 };
}
// x des Schnitts (Mitte des Gangs), waehrend des Rueckens gleitend
function _m6dSchnittX(V) {
  const mitte = kk => (_m6dXfest(V, kk - 1, kk) + _m6dXfest(V, kk, kk)) / 2;
  return mitte(V.k) + (mitte(V.kNeu) - mitte(V.k)) * V.u;
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6dMisch(h1, h2, u) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const a = p(h1), b = p(h2);
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * u)).join(',') + ')';
}
function _m6dText(ctx, s, x, y, gr, farbe, ausr) {
  ctx.fillStyle = farbe || _m6dK.F_TEXT;
  ctx.font = '700 ' + gr + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function _m6dBreite(ctx, s, gr) {
  ctx.font = '700 ' + gr + 'px sans-serif';
  return ctx.measureText(s).width;
}
// Zahl um ihre Mitte (x, ym), mit Deckkraft a und Federn (pop: s seit Erscheinen)
function _m6dZahl(ctx, s, x, ym, gr, farbe, a, pop) {
  if (!(a > 0.01)) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  const k = pop !== undefined && pop >= 0 && pop < 0.3 ? Math.max(0.3, _bioFxEase.federn(pop / 0.3)) : 1;
  ctx.translate(x, ym); ctx.scale(k, k);
  _m6dText(ctx, s, 0, gr * 0.36, gr, farbe);
  ctx.restore();
}
// Graue Karte mit „?“ (Teile verdecken)
function _m6dKarte(ctx, x, ym, w, h) {
  ctx.save();
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, x - w / 2, ym - h / 2, w, h, 6); ctx.fill(); ctx.stroke();
  const g = Math.round(Math.max(12, h * 0.75));
  _m6dText(ctx, '?', x, ym + g * 0.36, g, '#475569');
  ctx.restore();
}
function _m6dPapier(ctx) {
  const K = _m6dK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  let y0 = K.GY;                                      // Raster am Feld ausgerichtet (GX ist ein Vielfaches von 15)
  while (y0 - K.KA > K.PY0 + 1) y0 -= K.KA;
  for (let x = K.KA; x < K.PX1 - 1; x += K.KA) {
    ctx.beginPath(); ctx.moveTo(x, K.PY0 + 1); ctx.lineTo(x, K.PY1 - 1); ctx.stroke();
  }
  for (let y = y0; y < K.PY1 - 1; y += K.KA) {
    ctx.beginPath(); ctx.moveTo(K.PX0 + 1, y); ctx.lineTo(K.PX1 - 1, y); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.stroke();
  ctx.restore();
}
// Ein Punkt (Wendeplaettchen): s = Groesse, fill/rand = Farben, sx = Breite
// beim Wenden (1 flach, nahe 0 hochkant)
function _m6dPunkt(ctx, x, y, s, fill, rand, lw, sx) {
  const r = _m6dK.RP * s;
  if (r <= 0.3) return;
  ctx.save();
  ctx.translate(x, y);
  if (sx !== undefined && sx < 1) ctx.scale(Math.max(0.12, sx), 1);
  ctx.fillStyle = fill; ctx.strokeStyle = rand; ctx.lineWidth = lw || 1.2;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (r > 3) {                                        // Lichtpunkt: sieht aus wie ein Plaettchen
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.35, r * 0.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Leuchtband hinter einem Stueck Reihe
function _m6dBand(ctx, x0, x1, y, a, fuell, rand) {
  const B = _m6dK.BAND;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.fillStyle = fuell; ctx.strokeStyle = rand; ctx.lineWidth = 1.8;
  _bioFxRundRect(ctx, x0, y - B, x1 - x0, 2 * B, B); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Ruhig leuchtender Rahmen um einen Teil
function _m6dRahmen(ctx, g, fuell, rand, a, breite) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.fillStyle = fuell; ctx.strokeStyle = rand; ctx.lineWidth = breite || 2.5;
  _bioFxRundRect(ctx, g.x0 - 3, g.y0 - 2, g.x1 - g.x0 + 6, g.y1 - g.y0 + 4, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Schild mit der Punktzahl eines Teils (unter dem Teil)
function _m6dSchild(ctx, x, s, F, alter, verdeckt) {
  const K = _m6dK, kl = _bioFxKlemme;
  if (alter < 0) return;
  const gr = K.GPILL, w = Math.max(28, _m6dBreite(ctx, s, gr) + 14), h = 21, y = K.PILL_Y;
  const k = alter < 0.3 ? Math.max(0.3, _bioFxEase.federn(kl(alter / 0.3))) : 1;
  ctx.save();
  ctx.globalAlpha *= kl(alter / 0.1);
  ctx.translate(x, y); ctx.scale(k, k);
  if (verdeckt) _m6dKarte(ctx, 0, 0, w, h);
  else {
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = F.linie; ctx.lineWidth = 1.8;
    _bioFxRundRect(ctx, -w / 2, -h / 2, w, h, 7); ctx.fill(); ctx.stroke();
    _m6dText(ctx, s, 0, gr * 0.36, gr, F.text);
  }
  ctx.restore();
}
// Das Feld mit Schnitt, Malaufgaben und Schildern
function _m6dFeld(ctx, V) {
  const K = _m6dK, kl = _bioFxKlemme, E = _bioFxEase, w = _m6dWerte(V.n, V.k), n = V.n, r = _m6dZEILEN;
  const gL = _m6dTeilKanten(V, true), gR = _m6dTeilKanten(V, false);
  // Rahmen: Aha um den rechten Teil, kurzes Leuchten beider Teile nach dem Ruecken
  _m6dRahmen(ctx, gR, 'rgba(251,146,60,0.12)', K.O.linie, V.aha * V.puls, 3);
  _m6dRahmen(ctx, gL, 'rgba(59,130,246,0.10)', K.B.linie, V.glanzTeile);
  _m6dRahmen(ctx, gR, 'rgba(251,146,60,0.12)', K.O.linie, V.glanzTeile);
  // Leuchtbaender hinter den Reihen: links blau, rechts orange; Tareks oberste Reihe
  for (let i = 0; i < r; i++) {
    const y = _m6dPY(i);
    _m6dBand(ctx, gL.x0, gL.x1, y, V.bandL[i], K.B.band, K.B.linie);
    _m6dBand(ctx, gR.x0, gR.x1, y, V.bandR[i], K.O.band, K.O.linie);
    if (i === 0) _m6dBand(ctx, gR.x0, gR.x1, y, V.tarekOben, 'rgba(251,146,60,0.32)', '#c2410c');
  }
  // Punkte, Reihe fuer Reihe; rechts daneben die Klammer mit der Anzahl je Reihe
  for (let i = 0; i < r; i++) {
    const rt = V.reihe[i];
    if (rt < 0) continue;
    const y = _m6dPY(i);
    ctx.save();
    for (let j = 0; j < n; j++) {
      const s = Math.max(0, E.federn(kl((rt - j * 0.006) / 0.14)));
      const c = _m6dFarbe(V, j), F = c < 0.5 ? K.B : K.O;
      let fill = F.punkt, rand = F.rand, lw = 1.2;
      if (i > 0 && j >= V.k && V.tarekGrau > 0) {     // Tareks Weg: nicht gezaehlte Reihen grau, orange umrandet
        fill = _m6dMisch(K.O.punkt, K.GRAU.punkt, V.tarekGrau);
        rand = _m6dMisch(K.O.rand, K.GRAU.rand, V.tarekGrau);
        lw = 1.2 + 0.6 * V.tarekGrau;
      }
      _m6dPunkt(ctx, _m6dX(V, j), y, s, fill, rand, lw, Math.abs(Math.cos(Math.PI * c)));
    }
    ctx.globalAlpha *= kl((rt - 0.1) / 0.1);
    const kx = _m6dX(V, n - 1) + K.KA / 2 + 1;
    ctx.strokeStyle = K.F_KLAMMER; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(kx, y - 6); ctx.lineTo(kx + 3, y - 6); ctx.lineTo(kx + 3, y + 6); ctx.lineTo(kx, y + 6); ctx.stroke();
    _m6dText(ctx, String(n), kx + 7, y + K.GK * 0.36, K.GK, K.F_KZAHL, 'left');
    ctx.restore();
  }
  // Schnitt: faellt von oben durch alle Reihen
  if (V.schnitt > 0) {
    const xc = _m6dSchnittX(V), y0 = K.GY - 4, y1 = _m6dPY(r - 1) + K.KA / 2 + 4;
    ctx.save();
    ctx.strokeStyle = K.F_SCHNITT; ctx.lineWidth = 2;
    if (ctx.setLineDash) ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(xc, y0); ctx.lineTo(xc, y0 + (y1 - y0) * V.schnitt); ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
    ctx.restore();
  }
  // Ueber dem Feld: erst seine Malaufgabe, dann je Teil seine Malaufgabe
  const xm = (_m6dX(V, 0) + _m6dX(V, n - 1)) / 2;
  if (V.titelA > 0.01) {
    ctx.save(); ctx.globalAlpha *= V.titelA;
    _m6dText(ctx, _m6dMal(r, n), xm, K.LAB_Y, K.GLAB, K.F_TEXT);
    ctx.restore();
  }
  const cL = (gL.x0 + gL.x1) / 2, cR = (gR.x0 + gR.x1) / 2;
  if (V.labA > 0.01) {
    const ym = K.LAB_Y - K.GLAB * 0.36;
    _m6dZahl(ctx, _m6dMal(r, w.a), cL, ym, K.GLAB, K.B.text, V.labA, V.popPill);
    _m6dZahl(ctx, _m6dMal(r, w.b), cR, ym, K.GLAB, K.O.text, V.labA, V.popPill);
  }
  // Unter jedem Teil das Schild mit seiner Punktzahl
  const pop = s => (V.popPill < 0.3 ? V.popPill : s);
  _m6dSchild(ctx, cL, _m6dFmt(w.teilL), K.B, pop(V.pillL), V.verdeckt);
  _m6dSchild(ctx, cR, _m6dFmt(w.teilR), K.O, pop(V.pillR), V.verdeckt);
  _m6dGleichung(ctx, V, cL, cR);
}
// Die Rechnung als Folge von Teilen; ph = wann sie erscheinen, eng = ohne Luft davor
function _m6dGlTeile(V) {
  const K = _m6dK, w = _m6dWerte(V.n, V.k), B = K.B.text, O = K.O.text, D = K.F_TEXT, r = String(_m6dZEILEN);
  return [
    { s: r, f: D, ph: 'term' }, { s: '·', f: D, ph: 'term' }, { s: '(', f: D, ph: 'term' },
    { s: String(w.a), f: B, ph: 'term', eng: true, zahl: true }, { s: '+', f: D, ph: 'term' },
    { s: String(w.b), f: O, ph: 'term', zahl: true }, { s: ')', f: D, ph: 'term', eng: true },
    { s: '=', f: D, ph: 'mal' }, { s: r, f: B, ph: 'mal' }, { s: '·', f: B, ph: 'mal' },
    { s: String(w.a), f: B, ph: 'mal', zahl: true }, { s: '+', f: D, ph: 'mal' },
    { s: r, f: O, ph: 'mal' }, { s: '·', f: O, ph: 'mal' }, { s: String(w.b), f: O, ph: 'mal', zahl: true },
    { s: '=', f: D, ph: 'zahl' }, { s: _m6dFmt(w.teilL), f: B, ph: 'zahl', id: 'L', zahl: true, deck: true },
    { s: '+', f: D, ph: 'zahl' }, { s: _m6dFmt(w.teilR), f: O, ph: 'zahl', id: 'R', zahl: true, deck: true },
    { s: '=', f: D, ph: 'erg' }, { s: _m6dFmt(w.erg), f: D, ph: 'erg', id: 'E', deck: true }
  ];
}
// Feste Plaetze aller Teile (die ganze Zeile mittig, zu breit -> kleiner)
function _m6dGlLage(ctx, teile, verdeckt) {
  const K = _m6dK;
  let gr = K.GG, br = [], luft = 0, ges = 0;
  const karte = t => verdeckt && t.deck;
  const messen = () => {
    br = teile.map(t => karte(t) ? Math.max(gr * 1.4, _m6dBreite(ctx, t.s, gr) + gr * 0.6) : _m6dBreite(ctx, t.s, gr));
    luft = gr * 0.28; ges = 0;
    teile.forEach((t, i) => { ges += br[i] + (i && !t.eng ? luft : 0); });
  };
  messen();
  const platz = K.PX1 - K.PX0 - 20;
  if (ges > platz) { gr = Math.max(11, Math.floor(gr * platz / ges)); messen(); }
  const xm = [];
  let x = K.MITTE - ges / 2;
  teile.forEach((t, i) => {
    if (i && !t.eng) x += luft;
    xm.push(x + br[i] / 2);
    x += br[i];
  });
  return { gr, br, xm };
}
function _m6dGleichung(ctx, V, cL, cR) {
  const K = _m6dK, kl = _bioFxKlemme, E = _bioFxEase.sanft, T = V.glT;
  const teile = _m6dGlTeile(V), L = _m6dGlLage(ctx, teile, V.verdeckt), gr = L.gr;
  const ym = K.GL_Y - gr * 0.36;
  const phA = { term: kl((T - K.A_CUT0 - K.A_CUT) / 0.15), mal: kl((T - K.A_LAB0) / 0.15),
                zahl: kl((T - K.A_GL0) / 0.15), erg: kl((T - K.A_GL1) / 0.08) };
  const flug = T >= K.A_GL0 && T < K.A_GL1 ? E(kl((T - K.A_GL0) / (K.A_GL1 - K.A_GL0))) : null;
  // Die Summe leuchtet kurz, wenn der Schnitt gerueckt ist: sie bleibt
  const iE = teile.findIndex(t => t.id === 'E');
  if (V.summe > 0.01 && phA.erg > 0) {
    ctx.save();
    ctx.globalAlpha *= Math.min(1, V.summe * 1.5);
    ctx.fillStyle = 'rgba(252,211,77,0.5)'; ctx.strokeStyle = 'rgba(217,119,6,0.8)'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, L.xm[iE] - L.br[iE] / 2 - 4, ym - gr * 0.62, L.br[iE] + 8, gr * 1.24, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  teile.forEach((t, i) => {
    const a = phA[t.ph];
    if (a <= 0.01) return;
    if (flug !== null && (t.id === 'L' || t.id === 'R')) return;   // fliegt gerade aus dem Schild herein
    const pop = t.id === 'E' && T < 99 ? T - K.A_GL1 : t.zahl ? V.popGl : undefined;
    if (V.verdeckt && t.deck) {
      ctx.save(); ctx.globalAlpha *= a;
      _m6dKarte(ctx, L.xm[i], ym, L.br[i], gr * 1.15);
      ctx.restore();
    } else _m6dZahl(ctx, t.s, L.xm[i], ym, gr, t.f, a, pop);
  });
  // Die Punktzahlen gleiten aus ihren Schildern in die Rechnung
  if (flug !== null) {
    for (const [id, x0] of [['L', cL], ['R', cR]]) {
      const i = teile.findIndex(t => t.id === id), t = teile[i];
      const x = x0 + (L.xm[i] - x0) * flug, y = K.PILL_Y + (ym - K.PILL_Y) * flug;
      const g = K.GPILL + (gr - K.GPILL) * flug;
      if (V.verdeckt) _m6dKarte(ctx, x, y, Math.max(g * 1.4, _m6dBreite(ctx, t.s, g) + g * 0.6), g * 1.15);
      else _m6dZahl(ctx, t.s, x, y, g, t.f, 1);
    }
  }
}
function _m6dDraw(ctx, cv) {
  if (!_m6d) return;
  const z = _m6d, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6dPapier(ctx);
  _bioFxDraw(ctx, z.fx);                              // Lichtring hinter den Punkten
  if (z.alt) {                                        // das alte Bild blendet aus
    ctx.save();
    ctx.globalAlpha = Math.max(0, z.alt.rest / z.alt.dauer);
    _m6dFeld(ctx, z.alt.V);
    ctx.restore();
  }
  const V = _m6dSicht(z);
  if (V) _m6dFeld(ctx, V);
  if (z.pause) _m6dPauseSchild(ctx);
}
// Schild „Pause“ oben links – gleiche Stelle, Groesse und Farbe wie in
// m5-plus-schriftlich und m5-punktefeld, damit die Lehrkraft es ueberall am
// selben Ort findet. Leuchtet kurz auf, wenn waehrend der Pause ein Knopf
// gedrueckt wird. Endet ueber den Malaufgaben (y = 33, die beginnen bei y = 34).
function _m6dPauseSchild(ctx) {
  const z = _m6d, w = 64, h = 25, x = 8, y = 8;
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
