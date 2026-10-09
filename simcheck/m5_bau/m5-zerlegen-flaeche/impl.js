
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mu6 „Zerlegen und ergänzen“ (Kennung m5-zerlegen-flaeche,
// Praefix _m6q). Bauplan: arbeitsheft_mathe_foe5/KAPITEL7_PROFIL.md, Abschnitte
// mu6 und „m5-zerlegen-flaeche (mu6)“.
// Ueberschrift laut Bauplan (ohne Namen): „Wie viele m² hat das L?“
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   - Ein helles Blatt mit 1-m-Raster (1 Rasterquadrat = 1 m x 1 m = 34 px).
//     Das Raster liegt auch UEBER den Boeden – jedes Quadrat bleibt zaehlbar.
//   - Die Figur ist ein Grundriss von oben: Boden beige, Waende als dunkle
//     Linie. Jede Figur steht mit ihren Ecken auf Gitterpunkten, kleine Figuren
//     klein, grosse gross (fester Massstab, man kann sie vergleichen).
//   - Nach dem Zerlegen: Teil 1 blau, Teil 2 orange. Die Zahl eines Teils steht
//     in seiner Farbe IM Teil („12 m²“) und in derselben Farbe in der Anzeige
//     („Teil 1: 2 · 6 m² = 12 m²“) – Bild und Zeichen verbunden.
//   - Schnittlinie rot gestrichelt; sie wandert mit ihren Teilen mit.
//   - Unter der Figur am Ende eine Rechenkarte („12 m² + 4 m² = 16 m²“, die
//     Zahlen in der Farbe ihres Teils).
//   - Legende oben rechts: ein Rasterquadrat mit „1 m²“.
//
// FIGUREN (Ecken in m, Bauplan woertlich):
//   kleines L  (0|0) (3|0) (3|1) (1|1) (1|2) (0|2)
//   großes L   (0|0) (6|0) (6|2) (2|2) (2|4) (0|4)
//   Rechteck mit Diagonale (0|0) (4|0) (4|3) (0|3), Diagonale (0|0) -> (4|3)
//   Dreieck (frei) (0|0) (4|0) (0|3)
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6qWahl('…'), Wahlgruppe):
//     „kleines L“ · „großes L“ · „Rechteck mit Diagonale“ · „Dreieck“ (frei)
//   Reihe 2: „anders zerlegen“ (_m6qAnders(), nur bei den L: die andere
//     Schnittrichtung – senkrecht statt waagerecht; noch einmal gedrueckt
//     wieder waagerecht; blass bei Rechteck und Dreieck) · „ergänzen“
//     (_m6qErgaenzen(), L: zum umgebenden Rechteck; Dreieck: das zweite
//     Dreieck dazu; blass beim Rechteck) · „neu“ (_m6qNeu(): leeres Raster).
//   Jede Handlung bricht eine laufende ab und spielt ihre eigene von vorn.
//
// BEWEGUNG (jede Sprungmarke spielt SELBST ab – N1: ein Schritt im Heft =
// eine Handlung; anhalten kann die Lehrkraft). Alles ist eine Funktion der
// Ablaufzeit z.at (_m6qPlan): keine Zufallszahl, jede Zahl im Bild kommt aus
// derselben Rechnung wie die Anzeige (_m6qRech).
//   L („kleines L“, „großes L“, „anders zerlegen“):
//     Figur erscheint 0,5 s (Boden blendet auf, die Waende ziehen sich rundum).
//     Schnittlinie von der inneren Ecke aus gezogen, 0,6 s (waagerecht; bei
//     „anders zerlegen“ senkrecht).                       <- „Halt nach dem Schnitt“
//     Teile ruecken 0,35 m auseinander und faerben sich (0,6 s).
//     Teil 1: seine Reihen leuchten nacheinander auf (0,25 s je Reihe), dann
//     springt seine Zahl auf; dasselbe fuer Teil 2.
//     Die Teile gleiten wieder zusammen (0,6 s), die Summe erscheint.
//     Dauer: kleines L 3,15 s (anders 3,4 s) · großes L 3,9 s (anders 4,4 s).
//   „Rechteck mit Diagonale“:
//     Figur erscheint 0,5 s; die 3 Reihen leuchten (0,75 s) -> „Vor dem
//     Zerlegen: 3 · 4 m² = 12 m²“; Diagonale 0,6 s       <- „Halt nach dem Schnitt“
//     Dreiecke ruecken auseinander (0,6 s); Dreieck 2 dreht sich um eine
//     halbe Drehung, hebt sich dabei leicht ab und legt sich auf Dreieck 1
//     (1,0 s) – genau deckungsgleich –, bleibt 0,6 s liegen und gleitet zurueck
//     (0,8 s). Erst DANN springen die Zahlen der Teile auf („6 m²“, „6 m²“), die
//     Dreiecke gleiten zusammen (0,6 s), die Summe erscheint. Dauer 7,05 s.
//   „Dreieck“ (frei): nur die Figur erscheint (0,5 s).
//   „ergänzen“ beim L: das fehlende Stueck zieht sich orange gestrichelt von
//     der inneren Ecke aus (0,6 s), fuellt sich blass (0,4 s); die Reihen des
//     ganzen Rechtecks leuchten, dann die des Stuecks; dann gleitet das Stueck
//     nach rechts oben weg und verblasst (0,6 s), der gestrichelte Umriss
//     bleibt. Dauer: großes L 4,1 s, kleines L 3,1 s.
//   „ergänzen“ beim Dreieck: das Dreieck wird blau, eine orange Kopie blendet
//     GENAU auf ihm ein (0,3 s, der blaue Rand liegt gestrichelt obenauf) –
//     jetzt erst „Die Dreiecke passen genau aufeinander.“ –, bleibt 0,6 s liegen,
//     hebt sich ab (0,4 s), dreht sich eine halbe Drehung um die Mitte der
//     langen Seite und legt sich an (1,0 s) – das Rechteck ist voll; seine 3
//     Reihen leuchten, dann springt im blauen Dreieck „6 m²“ auf. Dauer 4,25 s.
//     (Bis 09.10.2026 erschien der Satz erst nach dem Abheben und stand damit
//     neben einer Kopie, die sichtbar NICHT auflag.)
//
// STATUSZEILEN (woertlich aus dem Bauplan, alle mit Wert mehr als 18 Zeichen;
// was zur laufenden Handlung nicht gehoert, ist leer und versteckt; vor dem
// Ende zeigen sie „…“ an der Stelle des Ergebnisses):
//   _m6q-figur     „Gewählt ist: großes L“ (Start „Gewählt ist: noch keine Figur“)
//   _m6q-vorher    nur Rechteck: „Vor dem Zerlegen: 3 · 4 m² = 12 m²“
//   _m6q-ergaenzt  nur nach „ergänzen“: „Ergänzt zum Rechteck: 4 · 6 m² = 24 m²“
//   _m6q-teil1     „Teil 1: 2 · 6 m² = 12 m²“ · Dreiecke „Teil 1: Dreieck, 6 m²“
//   _m6q-teil2     „Teil 2: 2 · 2 m² = 4 m²“  · Dreiecke „Teil 2: Dreieck, 6 m²“
//   _m6q-decken    nur Dreiecke: „Die Dreiecke passen genau aufeinander.“
//   _m6q-zusammen  „Zusammen: 12 m² + 4 m² = 16 m²“
//   _m6q-stueck    nur L nach „ergänzen“: „Ergänztes Stück: 2 · 4 m² = 8 m²“
//   _m6q-ohne      nur L nach „ergänzen“: „Ohne das Stück: 24 m² − 8 m² = 16 m²“
// Flaecheninhalt eines Rechtecks immer als Reihen · m² je Reihe (E2 im
// Bauplan), jede Flaeche mit Einheit (N3), zwischen Zahl und Einheit U+00A0,
// „m²“ mit U+00B2, Rechenzeichen · (U+00B7) und − (U+2212).
//
// WERTE (jede Zeile nachgerechnet mit simcheck/werte.js):
//   kleines L  -> Teil 1: 1 · 3 m² = 3 m², Teil 2: 1 · 1 m² = 1 m², Zusammen: 3 m² + 1 m² = 4 m²
//     anders   -> Teil 1: 2 · 1 m² = 2 m², Teil 2: 1 · 2 m² = 2 m², Zusammen: 2 m² + 2 m² = 4 m²
//     ergänzen -> Ergänzt zum Rechteck: 2 · 3 m² = 6 m², Ergänztes Stück: 1 · 2 m² = 2 m²,
//                 Ohne das Stück: 6 m² − 2 m² = 4 m²
//   großes L   -> Teil 1: 2 · 6 m² = 12 m², Teil 2: 2 · 2 m² = 4 m², Zusammen: 12 m² + 4 m² = 16 m²
//     anders   -> Teil 1: 4 · 2 m² = 8 m², Teil 2: 2 · 4 m² = 8 m², Zusammen: 8 m² + 8 m² = 16 m²
//     ergänzen -> 4 · 6 m² = 24 m², 2 · 4 m² = 8 m², 24 m² − 8 m² = 16 m²
//   Rechteck mit Diagonale -> Vor dem Zerlegen: 3 · 4 m² = 12 m², Teil 1: Dreieck, 6 m²,
//     Teil 2: Dreieck, 6 m², Die Dreiecke passen genau aufeinander., Zusammen: 6 m² + 6 m² = 12 m²
//   Dreieck (frei) -> Gewählt ist: Dreieck; nach „ergänzen“ Ergänzt zum Rechteck:
//     3 · 4 m² = 12 m², Die Dreiecke passen genau aufeinander., Teil 1: Dreieck, 6 m²
// START: leeres Raster, noch keine Figur („Start: leeres Raster, noch keine Figur“).
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen, einmal je Ablauf):
//   großes L (beide Schnittrichtungen) – die Summe „… = 16 m²“ erscheint:
//     Lichtring um das L, der Umriss des L leuchtet 2,6 s bernstein (nicht 24).
//   Rechteck mit Diagonale – das gedrehte Dreieck liegt genau auf dem anderen:
//     Lichtring um beide, ihr gemeinsamer Umriss leuchtet 2,6 s.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-umfang/m5-verteilen, Container
// fpm-lehrkraft fuer simfakten.js): eigene Knopfzeile UNTER den Heftknoepfen,
// davor klein „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m6qAnhalten): friert jede Bewegung ein; Schild
//     „Pause“ oben links.
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m6qTempo): ein Drittel so schnell.
//   „Halt nach dem Schnitt: aus“ <-> „… an“ (_m6qHalt): haelt beim L und beim
//     Rechteck genau dann an, wenn die Schnittlinie fertig gezogen ist (vor dem
//     Auseinanderruecken). Hinweiszeile: „Halt: Die Figur ist zerschnitten.
//     Dann „weiter“.“ „weiter“ oder der Schalter auf „aus“ spielen weiter.
//   Jede Handlung (Sprungmarke, „anders zerlegen“, „ergänzen“, „neu“) hebt die
//   Pause auf; Tempo und Halt bleiben stehen. Das wechselnde Wort steht in einem
//   eigenen <span>. Hinweiszeile _m6q-lehrkraft nennt immer die Einstellung (in
//   der Pause bernsteinfarben). Voreinstellung: Zeitfaktor 1.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): „Hälfte“, „halb“,
// „halbe“, „zusammengezählt“, „addiert“, „rechtwinklig“, die Regel als Satz.
// Die Dreiecksflaeche wird intern als Rechteck : 2 gerechnet, am Bildschirm
// steht nur „Dreieck, 6 m²“. Keine Namen, keine Punkte, keine Zeitmessung,
// kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m6q = null;
const _m6qK = {
  S: 34,                                   // px je m (Raster und Figuren)
  PX0: 6, PX1: 414, PY0: 6, PY1: 244,      // Blatt mit Raster
  RX: 108, RY: 196,                        // ein Gitterpunkt, an dem das Raster haengt
  LX0: 330, LX1: 412, LY0: 8, LY1: 50,     // Legende oben rechts
  // Zeiten in s
  T_FIG: 0.5, T_SCHNITT: 0.6, T_AUS: 0.6, T_REIHE: 0.25, T_ZU: 0.6,
  T_DREH: 1.0, T_LIEGT: 0.6, T_ZURUECK: 0.8, T_HEB: 0.4,
  T_STRICH: 0.6, T_FUELL: 0.4, T_WEG: 0.6, T_POP: 0.3,
  WEG: 0.35,                               // so weit ruecken die Teile auseinander (m)
  // Farben
  PAPIER: '#fbfaf7', PAPIERRAND: '#cbd5e1', RASTER: 'rgba(51,65,85,0.17)',
  BODEN: '#f3e6cc', WAND: '#3f3f46',
  B_FUELL: '#bfdbfe', B_RAND: '#1d4ed8', B_TEXT: '#1d4ed8', B_REIHE: '#3b82f6',
  O_FUELL: '#fed7aa', O_RAND: '#c2410c', O_TEXT: '#c2410c', O_REIHE: '#f97316',
  N_REIHE: '#facc15',                      // Reihen einer ungeteilten Flaeche leuchten gelb
  SCHNITT: '#dc2626', AHA: '#f59e0b', TINTE: '#0f172a', GRAU: '#64748b'
};
// art: L (zerlegen und ergaenzen), R (Rechteck mit Diagonale), D (Dreieck).
// ox/oy: Leinwandpunkt der Ecke (0|0) – immer ein Gitterpunkt des Rasters.
// b/h: umgebendes Rechteck in m. Teile als Rechtecke [x0, y0, x1, y1] in m.
// weg: Richtung, in die ein Teil beim Auseinanderruecken geht.
const _m6qFIG = {
  kl: { text: 'kleines L', art: 'L', ox: 176, oy: 162, b: 3, h: 2,
        ecken: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]],
        zerl: [{ schnitt: [[1, 1], [0, 1]], teile: [[0, 0, 3, 1], [0, 1, 1, 2]], weg: [[0, -1], [0, 1]] },
               { schnitt: [[1, 1], [1, 0]], teile: [[0, 0, 1, 2], [1, 0, 3, 1]], weg: [[-1, 0], [1, 0]] }],
        erg: { rect: [0, 0, 3, 2], stueck: [1, 1, 3, 2] } },
  gl: { text: 'großes L', art: 'L', ox: 108, oy: 196, b: 6, h: 4,
        ecken: [[0, 0], [6, 0], [6, 2], [2, 2], [2, 4], [0, 4]],
        zerl: [{ schnitt: [[2, 2], [0, 2]], teile: [[0, 0, 6, 2], [0, 2, 2, 4]], weg: [[0, -1], [0, 1]] },
               { schnitt: [[2, 2], [2, 0]], teile: [[0, 0, 2, 4], [2, 0, 6, 2]], weg: [[-1, 0], [1, 0]] }],
        erg: { rect: [0, 0, 6, 4], stueck: [2, 2, 6, 4] } },
  rd: { text: 'Rechteck mit Diagonale', art: 'R', ox: 142, oy: 196, b: 4, h: 3,
        ecken: [[0, 0], [4, 0], [4, 3], [0, 3]],
        // Dreieck 1 unten rechts (blau), Dreieck 2 oben links (orange); je die
        // ersten zwei Ecken von 2 und Ecke 0/2 von 1 liegen auf der Diagonale.
        dreiecke: [[[0, 0], [4, 0], [4, 3]], [[0, 0], [4, 3], [0, 3]]],
        weg: [[0.6, -0.8], [-0.6, 0.8]] },
  dr: { text: 'Dreieck', art: 'D', ox: 142, oy: 196, b: 4, h: 3,
        ecken: [[0, 0], [4, 0], [0, 3]],
        mitte: [2, 1.5] }                    // Mitte der langen Seite: hier dreht die Kopie
};
const _m6qREIHE = ['kl', 'gl', 'rd', 'dr'];
// Reihenfolge der Anzeige rechts (versteckte Zeilen fallen weg).
const _m6qZEILEN = ['figur', 'vorher', 'ergaenzt', 'teil1', 'teil2', 'decken', 'zusammen', 'stueck', 'ohne'];

// ── Hilfen ───────────────────────────────────────────────────────────────
// Flaeche mit Einheit, geschuetztes Leerzeichen zwischen Zahl und Einheit.
function _m6qQ(n) { return n + ' m²'; }
// Rechteck [x0,y0,x1,y1]: Reihen · m² je Reihe = Flaeche (E2 im Bauplan).
function _m6qRech(r) {
  const reihen = r[3] - r[1], je = r[2] - r[0];
  return { reihen, je, A: reihen * je, rech: reihen + ' · ' + _m6qQ(je) };
}
function _m6qEcken(r) { return [[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]]; }
function _m6qVers(p, d) { return [p[0] + d[0], p[1] + d[1]]; }
function _m6qSchwer(pts) {
  let x = 0, y = 0;
  for (const p of pts) { x += p[0]; y += p[1]; }
  return [x / pts.length, y / pts.length];
}
// Drehung um c (in m, mathematisch positiv), w im Bogenmass.
function _m6qDreh(p, c, w) {
  const dx = p[0] - c[0], dy = p[1] - c[1], co = Math.cos(w), si = Math.sin(w);
  return [c[0] + dx * co - dy * si, c[1] + dx * si + dy * co];
}
function _m6qStreck(pts, k) {
  const g = _m6qSchwer(pts);
  return pts.map(p => [g[0] + (p[0] - g[0]) * k, g[1] + (p[1] - g[1]) * k]);
}
function _m6qPx(F, p) { return [F.ox + p[0] * _m6qK.S, F.oy - p[1] * _m6qK.S]; }
// Fortschritt in einem Zeitfenster [a, b] (0 … 1).
function _m6qE(at, iv) {
  if (!iv) return 0;
  if (iv[1] <= iv[0]) return at >= iv[0] ? 1 : 0;
  return _bioFxKlemme((at - iv[0]) / (iv[1] - iv[0]));
}
function _m6qMisch(a, b, t) {
  const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return 'rgb(' + x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',') + ')';
}

// ── Zeitplan einer Handlung (Ablaufzeit in s) ───────────────────────────
// Jedes Feld ist ein Zeitfenster [Beginn, Ende]; ende = alles steht.
function _m6qPlan(z) {
  const K = _m6qK, F = z.fig ? _m6qFIG[z.fig] : null, P = { ende: 0 };
  if (!F || !z.modus) return P;
  const fenster = (a, d) => [a, a + d];
  if (z.modus === 'zer') {
    const Z = F.zerl[z.dir], R = Z.teile.map(_m6qRech);
    P.fig = fenster(0, K.T_FIG);
    P.schnitt = fenster(P.fig[1], K.T_SCHNITT);
    P.aus = fenster(P.schnitt[1], K.T_AUS);
    P.t1 = fenster(P.aus[1] + 0.1, R[0].reihen * K.T_REIHE);
    P.t2 = fenster(P.t1[1] + 0.2, R[1].reihen * K.T_REIHE);
    P.zu = fenster(P.t2[1] + 0.3, K.T_ZU);
    P.halt = P.schnitt[1];
    P.ende = P.zu[1];
  } else if (z.modus === 'rd') {
    P.fig = fenster(0, K.T_FIG);
    P.vorher = fenster(P.fig[1] + 0.1, F.h * K.T_REIHE);
    P.schnitt = fenster(P.vorher[1] + 0.4, K.T_SCHNITT);
    P.aus = fenster(P.schnitt[1], K.T_AUS);
    P.dreh = fenster(P.aus[1] + 0.2, K.T_DREH);
    P.zurueck = fenster(P.dreh[1] + K.T_LIEGT, K.T_ZURUECK);
    P.t1 = fenster(P.zurueck[1] + 0.2, 0);
    P.t2 = fenster(P.t1[1] + 0.4, 0);
    P.zu = fenster(P.t2[1] + 0.3, K.T_ZU);
    P.halt = P.schnitt[1];
    P.ende = P.zu[1];
  } else if (z.modus === 'dr0') {
    P.fig = fenster(0, K.T_FIG);
    P.ende = P.fig[1];
  } else if (z.modus === 'erg') {
    const R = _m6qRech(F.erg.rect), S = _m6qRech(F.erg.stueck);
    P.strich = fenster(0.2, K.T_STRICH);
    P.fuell = fenster(P.strich[1], K.T_FUELL);
    P.erg = fenster(P.fuell[1] + 0.2, R.reihen * K.T_REIHE);
    P.stueck = fenster(P.erg[1] + 0.3, S.reihen * K.T_REIHE);
    P.weg = fenster(P.stueck[1] + 0.3, K.T_WEG);
    P.ende = P.weg[1];
  } else if (z.modus === 'dre') {
    P.blau = fenster(0, 0.3);
    P.kopie = fenster(P.blau[1], 0.3);              // Kopie erscheint genau auf dem Dreieck
    P.heb = fenster(P.kopie[1] + K.T_LIEGT, K.T_HEB); // liegt, dann hebt sie sich ab
    P.dreh = fenster(P.heb[1] + 0.3, K.T_DREH);
    P.erg = fenster(P.dreh[1] + 0.2, F.h * K.T_REIHE);
    P.t1 = fenster(P.erg[1] + 0.4, 0);
    P.ende = P.t1[1];
  }
  return P;
}

// ── Anzeige: alle Zeilen aus der Ablaufzeit ─────────────────────────────
// Ergebnis: { zeile: html }; eine fehlende Zeile wird versteckt.
function _m6qTexte(z) {
  const K = _m6qK, F = z.fig ? _m6qFIG[z.fig] : null, T = {}, Q = _m6qQ;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const B = s => f(s, K.B_TEXT), O = s => f(s, K.O_TEXT), I = s => f(s, K.TINTE);
  T.figur = 'Gewählt ist: ' + (F ? F.text : 'noch keine Figur');
  if (!F || !z.modus) {
    T.teil1 = 'Teil 1: …'; T.teil2 = 'Teil 2: …'; T.zusammen = 'Zusammen: …';
    return T;
  }
  const P = _m6qPlan(z), at = z.at + 1e-9;
  const fertig = iv => at >= iv[1], los = iv => at >= iv[0];
  // „2 · 6 m² = …“ waehrend die Reihen leuchten, danach mit Ergebnis
  const rechnung = (iv, r, farbe) => fertig(iv) ? farbe(r.rech + ' = ' + Q(r.A))
                                   : los(iv) ? farbe(r.rech) + ' = …' : '…';
  if (z.modus === 'zer') {
    const R = F.zerl[z.dir].teile.map(_m6qRech);
    T.teil1 = 'Teil 1: ' + rechnung(P.t1, R[0], B);
    T.teil2 = 'Teil 2: ' + rechnung(P.t2, R[1], O);
    T.zusammen = 'Zusammen: ' + (los(P.zu) ? B(Q(R[0].A)) + ' + ' + O(Q(R[1].A)) + ' = ' +
                 (fertig(P.zu) ? I(Q(R[0].A + R[1].A)) : '…') : '…');
  } else if (z.modus === 'rd') {
    const V = _m6qRech([0, 0, F.b, F.h]), D = V.A / 2;
    T.vorher = 'Vor dem Zerlegen: ' + rechnung(P.vorher, V, I);
    T.teil1 = 'Teil 1: ' + (fertig(P.t1) ? 'Dreieck, ' + B(Q(D)) : los(P.aus) ? 'Dreieck, …' : '…');
    T.teil2 = 'Teil 2: ' + (fertig(P.t2) ? 'Dreieck, ' + O(Q(D)) : los(P.aus) ? 'Dreieck, …' : '…');
    if (fertig(P.dreh)) T.decken = 'Die Dreiecke passen genau aufeinander.';
    T.zusammen = 'Zusammen: ' + (los(P.zu) ? B(Q(D)) + ' + ' + O(Q(D)) + ' = ' +
                 (fertig(P.zu) ? I(Q(2 * D)) : '…') : '…');
  } else if (z.modus === 'erg') {
    const R = _m6qRech(F.erg.rect), S = _m6qRech(F.erg.stueck);
    T.ergaenzt = 'Ergänzt zum Rechteck: ' + rechnung(P.erg, R, I);
    T.stueck = 'Ergänztes Stück: ' + rechnung(P.stueck, S, O);
    T.ohne = 'Ohne das Stück: ' + (los(P.weg) ? I(Q(R.A)) + ' − ' + O(Q(S.A)) + ' = ' +
             (fertig(P.weg) ? I(Q(R.A - S.A)) : '…') : '…');
  } else if (z.modus === 'dre') {
    const R = _m6qRech([0, 0, F.b, F.h]);
    T.ergaenzt = 'Ergänzt zum Rechteck: ' + rechnung(P.erg, R, I);
    T.teil1 = 'Teil 1: ' + (fertig(P.t1) ? 'Dreieck, ' + B(Q(R.A / 2)) : 'Dreieck, …');
    // genau dann, wenn die Kopie deckungsgleich auf dem Dreieck liegt
    if (fertig(P.kopie)) T.decken = 'Die Dreiecke passen genau aufeinander.';
  }
  // modus 'dr0' (Dreieck gewaehlt, noch nicht ergaenzt): nur „Gewählt ist: Dreieck“
  return T;
}

function _m6qInit() {
  _m6q = { t: 0, at: 0, fig: null, modus: null, dir: 0, fx: [], sig: '',
           pause: false, langsam: false, halt: false };   // Lehrkraft-Einstellungen
  _m6qLaden(null);
}
// Eine Handlung laden (modus null: leeres Raster). Hebt die Pause auf.
function _m6qLaden(modus) {
  const z = _m6q;
  z.modus = modus; z.at = 0;
  z.aha = false; z.ahaGlanz = 0; z.ahaArt = null;
  z.gehalten = false; z.haltJetzt = false;
  z.fx.length = 0;
  z.pause = false;
}
function _m6qHTML() {
  const marke = k => `<button class="sim-btn" id="_m6q-b-${k}" onclick="_m6qWahl('${k}')">${_m6qFIG[k].text}</button>`;
  const zeile = k => `<div class="lmp-status on" id="_m6q-${k}" style="margin-top:6px"></div>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele m² hat das L?</h3>
    <div class="fpm-note" style="margin-top:2px">Jedes Rasterquadrat ist 1&nbsp;m lang und 1&nbsp;m breit. Wähle eine Figur und sieh zu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6q-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6qREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6q-anders" onclick="_m6qAnders()">anders zerlegen</button>
          <button class="sim-btn" id="_m6q-erg" onclick="_m6qErgaenzen()">ergänzen</button>
          <button class="sim-btn" onclick="_m6qNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6q-pause" onclick="_m6qAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6q-tempo" onclick="_m6qTempo()">Tempo: <span id="_m6q-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6q-halt" onclick="_m6qHalt()">Halt nach dem Schnitt: <span id="_m6q-halt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6q-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        ${_m6qZEILEN.map(zeile).join('\n        ')}
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: leeres Raster, noch keine Figur</p>
  </div>`;
}
function _m6qSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Fingerabdruck der Anzeige – Update schreibt nur, wenn er sich aendert.
function _m6qSig(z) { return JSON.stringify(_m6qTexte(z)) + '|' + z.pause + '|' + z.haltJetzt; }
function _m6qStatus() {
  if (!_m6q) return;
  const z = _m6q, F = z.fig ? _m6qFIG[z.fig] : null, T = _m6qTexte(z);
  for (const k of _m6qZEILEN) {
    const e = _m6qSetze('_m6q-' + k, T[k] || '');
    if (e && e.style) e.style.display = T[k] ? '' : 'none';
  }
  _m6qREIHE.forEach(k => {
    const b = document.getElementById('_m6q-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.fig);
  });
  // „anders zerlegen“ nur beim L, „ergänzen“ beim L und beim Dreieck – sonst blass
  const knopf = (id, an, aktiv) => {
    const b = document.getElementById(id);
    if (!b) return;
    b.disabled = !an;
    if (b.style) b.style.opacity = an ? '' : '0.45';
    if (b.classList) b.classList.toggle('primary', !!aktiv);
  };
  knopf('_m6q-anders', !!F && F.art === 'L', z.modus === 'zer' && z.dir === 1);
  knopf('_m6q-erg', !!F && F.art !== 'R', z.modus === 'erg' || z.modus === 'dre');
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6qSetze('_m6q-pause', z.pause ? 'weiter' : 'Pause');
  _m6qSetze('_m6q-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6qSetze('_m6q-halt-an', z.halt ? 'an' : 'aus');
  const hz = _m6qSetze('_m6q-lehrkraft', _m6qHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6q-pause', z.pause], ['_m6q-halt', z.halt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
  z.sig = _m6qSig(z);
}
function _m6qHinweis() {
  const z = _m6q;
  let a;
  if (z.pause && z.haltJetzt) a = 'Halt: Die Figur ist zerschnitten. Dann „weiter“.';
  else if (z.pause) a = 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  else a = 'Für die Lehrkraft: „Pause“ hält alles an.';
  return a + ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt nach dem Schnitt: ' + (z.halt ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6qWahl(key) {
  if (!_m6q || !_m6qFIG[key]) return;
  const z = _m6q, art = _m6qFIG[key].art;
  z.fig = key; z.dir = 0;
  _m6qLaden(art === 'R' ? 'rd' : art === 'D' ? 'dr0' : 'zer');
  _m6qStatus();
}
// Die andere Schnittrichtung als die zuletzt gezeigte (nur beim L).
function _m6qAnders() {
  const z = _m6q;
  if (!z || !z.fig || _m6qFIG[z.fig].art !== 'L') return;
  z.dir = 1 - z.dir;
  _m6qLaden('zer');
  _m6qStatus();
}
function _m6qErgaenzen() {
  const z = _m6q;
  if (!z || !z.fig) return;
  const art = _m6qFIG[z.fig].art;
  if (art === 'R') return;                 // das Rechteck ist schon eins
  _m6qLaden(art === 'D' ? 'dre' : 'erg');
  _m6qStatus();
}
function _m6qNeu() {
  if (!_m6q) return;
  _m6q.fig = null; _m6q.dir = 0;
  _m6qLaden(null);
  _m6qStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6qAnhalten() {
  if (!_m6q) return;
  _m6q.pause = !_m6q.pause;
  if (!_m6q.pause) _m6q.haltJetzt = false;
  _m6qStatus();
}
function _m6qTempo() {
  if (!_m6q) return;
  _m6q.langsam = !_m6q.langsam;
  _m6qStatus();
}
function _m6qHalt() {
  if (!_m6q) return;
  const z = _m6q;
  z.halt = !z.halt;
  if (!z.halt && z.haltJetzt) { z.pause = false; z.haltJetzt = false; }   // aus: weiterspielen
  _m6qStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6qZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6qUpdate(dt) {
  if (!_m6q) return;
  const z = _m6q, K = _m6qK;
  dt = _bioFxDt(dt) * _m6qZeitfaktor(z);            // ab hier Sim-Zeit
  z.t += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  const F = z.fig ? _m6qFIG[z.fig] : null;
  if (F && z.modus && dt > 0) {                     // ohne Zeit kein Schritt im Ablauf
    const P = _m6qPlan(z);
    let neuAt = z.at + dt;
    // Halt nach dem Schnitt: genau dort anhalten, wo die Schnittlinie fertig ist
    if (z.halt && !z.gehalten && P.halt != null && z.at < P.halt - 1e-9 && neuAt >= P.halt - 1e-9) {
      neuAt = P.halt; z.gehalten = true; z.pause = true; z.haltJetzt = true;
    }
    z.at = Math.min(neuAt, P.ende + 30);
    if (z.modus === 'zer' && z.fig === 'gl' && !z.aha && z.at >= P.zu[1] - 1e-9) {
      // Aha 1: großes L – die Summe 16 m² erscheint (nicht 24)
      z.aha = true; z.ahaGlanz = 2.6; z.ahaArt = 'L';
      const c = _m6qPx(F, [F.b / 2, F.h / 2]);
      _bioFxWelle(z.fx, c[0], c[1], K.AHA, 128);
    }
    if (z.modus === 'rd' && !z.aha && z.at >= P.dreh[1] - 1e-9) {
      // Aha 2: das gedrehte Dreieck liegt genau auf dem anderen
      z.aha = true; z.ahaGlanz = 2.6; z.ahaArt = 'D';
      const t1 = F.dreiecke[0].map(p => _m6qVers(p, [F.weg[0][0] * K.WEG, F.weg[0][1] * K.WEG]));
      const c = _m6qPx(F, _m6qSchwer(t1));
      _bioFxWelle(z.fx, c[0], c[1], K.AHA, 92);
    }
  }
  if (_m6qSig(z) !== z.sig) _m6qStatus();
  _bioFxUpdate(z.fx, dt);
}

// ── Zeichnen: Grundbausteine ────────────────────────────────────────────
function _m6qText(ctx, s, x, y, groesse, farbe, ausr, gew, grund) {
  ctx.fillStyle = farbe || _m6qK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = grund || 'alphabetic';
  ctx.fillText(s, x, y);
}
function _m6qPfad(ctx, F, pts) {
  ctx.beginPath();
  pts.forEach((p, i) => {
    const q = _m6qPx(F, p);
    if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
  });
  ctx.closePath();
}
function _m6qFlaeche(ctx, F, pts, farbe, alpha) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.fillStyle = farbe;
  _m6qPfad(ctx, F, pts); ctx.fill();
  ctx.restore();
}
function _m6qRand(ctx, F, pts, farbe, breite, alpha, strich) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.strokeStyle = farbe; ctx.lineWidth = breite; ctx.lineJoin = 'round';
  if (strich) ctx.setLineDash(strich);
  _m6qPfad(ctx, F, pts); ctx.stroke();
  ctx.restore();
}
// Umriss nur bis zum Anteil frac seiner Laenge (Waende ziehen sich, Stueck zeichnet sich).
function _m6qTeilweg(ctx, F, pts, frac, farbe, breite, strich) {
  if (frac <= 0) return;
  const P = pts.concat([pts[0]]).map(p => _m6qPx(F, p));
  let ges = 0;
  for (let i = 1; i < P.length; i++) ges += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
  let rest = ges * Math.min(1, frac);
  ctx.save();
  ctx.strokeStyle = farbe; ctx.lineWidth = breite; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (strich) ctx.setLineDash(strich);
  ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length; i++) {
    const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
    if (rest >= d - 1e-6) { ctx.lineTo(P[i][0], P[i][1]); rest -= d; continue; }
    const u = rest / d;
    ctx.lineTo(P[i - 1][0] + (P[i][0] - P[i - 1][0]) * u, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * u);
    break;
  }
  if (frac >= 1) ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
// Reihen eines Rechtecks leuchten nacheinander auf (von unten), bleiben bis
// kurz nach dem Ende des Fensters stehen und verblassen dann.
function _m6qReihen(ctx, F, r, d, iv, farbe, at) {
  if (!iv || at < iv[0]) return;
  const K = _m6qK, n = r[3] - r[1];
  const aus = 1 - _bioFxKlemme((at - iv[1] - 0.35) / 0.4);
  if (aus <= 0) return;
  for (let k = 0; k < n; k++) {
    const a = _bioFxKlemme((at - iv[0] - k * K.T_REIHE) / 0.12) * aus;
    _m6qFlaeche(ctx, F, _m6qEcken([r[0] + d[0], r[1] + k + d[1], r[2] + d[0], r[1] + k + 1 + d[1]]),
                farbe, 0.42 * a);
  }
}
// Schnittlinie rot gestrichelt von a nach b, gezogen bis zum Anteil e.
function _m6qSchnitt(ctx, F, a, b, e) {
  if (e <= 0) return;
  const K = _m6qK, p = _m6qPx(F, a), q = _m6qPx(F, b);
  const x = p[0] + (q[0] - p[0]) * e, y = p[1] + (q[1] - p[1]) * e;
  ctx.save();
  ctx.strokeStyle = K.SCHNITT; ctx.lineWidth = 2.8; ctx.setLineDash([7, 5]); ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(x, y); ctx.stroke();
  ctx.setLineDash([]);
  if (e < 1) {                                      // die Spitze, die gerade schneidet
    ctx.fillStyle = K.SCHNITT;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Zahl in einem Teil: weisses Schildchen, springt beim Erscheinen kurz auf.
function _m6qEtikett(ctx, t, x, y, farbe, alter, gr, alpha) {
  if (alter < 0 || (alpha != null && alpha <= 0.01)) return;
  const K = _m6qK, k = alter < K.T_POP ? Math.max(0.3, _bioFxEase.federn(alter / K.T_POP)) : 1;
  gr = gr || 14;
  ctx.save();
  if (alpha != null) ctx.globalAlpha = alpha;
  ctx.translate(x, y); ctx.scale(k, k);
  ctx.font = '700 ' + gr + 'px sans-serif';
  const w = ctx.measureText(t).width + 6, h = gr + 5;
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  _bioFxRundRect(ctx, -w / 2, -h / 2, w, h, 4); ctx.fill();
  _m6qText(ctx, t, 0, 0.5, gr, farbe, 'center', '700', 'middle');
  ctx.restore();
}
// Rechenkarte unter der Figur; teile = [[text, farbe], …].
function _m6qKarte(ctx, F, teile, alter, alpha) {
  if (!teile || alter < 0) return;
  const K = _m6qK, x = F.ox + F.b * K.S / 2, y = F.oy + 23;
  const a = _bioFxKlemme(alter / 0.25) * (alpha == null ? 1 : alpha);
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.font = '700 14px sans-serif';
  const ws = teile.map(s => ctx.measureText(s[0]).width);
  const w = ws.reduce((s, v) => s + v, 0) + 18;
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.PAPIERRAND; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x - w / 2, y - 12, w, 24, 7); ctx.fill(); ctx.stroke();
  let xx = x - w / 2 + 9;
  teile.forEach((s, i) => { _m6qText(ctx, s[0], xx, y + 0.5, 14, s[1], 'left', '700', 'middle'); xx += ws[i]; });
  ctx.restore();
}
// Bernsteinfarbener Glanz um einen Umriss (Aha), ruhig pulsierend.
function _m6qGlanz(ctx, F, pts) {
  const z = _m6q;
  if (z.ahaGlanz <= 0) return;
  const a = Math.min(1, z.ahaGlanz / 0.8) * (0.6 + 0.4 * Math.sin(z.t * 5));
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineWidth = 12;
  ctx.strokeStyle = 'rgba(245,158,11,' + (0.42 * a).toFixed(3) + ')';
  _m6qPfad(ctx, F, pts); ctx.stroke();
  ctx.restore();
}
function _m6qPapier(ctx) {
  const K = _m6qK;
  ctx.save();
  ctx.fillStyle = K.PAPIER; ctx.strokeStyle = K.PAPIERRAND; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 10); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// 1-m-Raster, an einem festen Gitterpunkt ausgerichtet (Linien naeher als
// 4 px am Blattrand fallen weg – sie wirkten wie ein doppelter Rand).
function _m6qRaster(ctx) {
  const K = _m6qK;
  ctx.save();
  ctx.strokeStyle = K.RASTER; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = K.RX - Math.floor((K.RX - K.PX0) / K.S) * K.S; x < K.PX1 - 4; x += K.S) {
    if (x <= K.PX0 + 4) continue;
    ctx.moveTo(x, K.PY0 + 2); ctx.lineTo(x, K.PY1 - 2);
  }
  for (let y = K.RY + Math.floor((K.PY1 - K.RY) / K.S) * K.S; y > K.PY0 + 4; y -= K.S) {
    if (y >= K.PY1 - 4) continue;
    ctx.moveTo(K.PX0 + 2, y); ctx.lineTo(K.PX1 - 2, y);
  }
  ctx.stroke();
  ctx.restore();
}
// Legende oben rechts: ein Rasterquadrat (Boden), daneben „1 m²“.
function _m6qLegende(ctx) {
  const K = _m6qK;
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.strokeStyle = K.PAPIERRAND; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, K.LX0, K.LY0, K.LX1 - K.LX0, K.LY1 - K.LY0, 6); ctx.fill(); ctx.stroke();
  const x = K.LX0 + 5, y = K.LY0 + 4;
  ctx.fillStyle = K.BODEN; ctx.fillRect(x, y, K.S, K.S);
  ctx.strokeStyle = K.WAND; ctx.lineWidth = 1.4; ctx.strokeRect(x, y, K.S, K.S);
  ctx.restore();
  _m6qText(ctx, _m6qQ(1), x + K.S + 6, y + K.S / 2 + 0.5, 13, K.TINTE, 'left', '700', 'middle');
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-umfang.
function _m6qPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6qText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}

// ── Zeichnen: je Handlung ───────────────────────────────────────────────
// Ganze Figur: Boden blendet auf, Waende ziehen sich rundum (Anteil eF).
function _m6qGanz(ctx, F, eF, unten) {
  const K = _m6qK;
  if (unten) _m6qFlaeche(ctx, F, F.ecken, K.BODEN, eF);
  else _m6qTeilweg(ctx, F, F.ecken, eF, K.WAND, 3);
}
// L zerlegen (beide Schnittrichtungen).
function _m6qZerZeichnen(ctx, F, P, at) {
  const K = _m6qK, E = _bioFxEase, kl = _bioFxKlemme, z = _m6q, Z = F.zerl[z.dir];
  const farb = [[K.B_FUELL, K.B_RAND, K.B_TEXT, K.B_REIHE], [K.O_FUELL, K.O_RAND, K.O_TEXT, K.O_REIHE]];
  const eF = kl(at / K.T_FIG), ganz = at < P.aus[0];
  const c = _m6qE(at, P.aus);
  const eA = E.sanft(c) * (1 - E.sanft(_m6qE(at, P.zu)));
  const d = Z.weg.map(w => [w[0] * K.WEG * eA, w[1] * K.WEG * eA]);
  const iv = [P.t1, P.t2];
  const lage = i => _m6qEcken(Z.teile[i]).map(p => _m6qVers(p, d[i]));
  // Boeden und leuchtende Reihen (unter dem Raster)
  if (ganz) _m6qGanz(ctx, F, eF, true);
  else Z.teile.forEach((r, i) => {
    _m6qFlaeche(ctx, F, lage(i), _m6qMisch(K.BODEN, farb[i][0], c), 1);
    _m6qReihen(ctx, F, r, d[i], iv[i], farb[i][3], at);
  });
  _m6qRaster(ctx);
  if (z.ahaArt === 'L') _m6qGlanz(ctx, F, F.ecken);
  // Waende bzw. Raender der Teile
  if (ganz) _m6qGanz(ctx, F, eF, false);
  else Z.teile.forEach((r, i) => _m6qRand(ctx, F, lage(i), _m6qMisch(K.WAND, farb[i][1], c), 2.6, 1));
  // Schnittlinie: erst gezogen, danach wandert sie mit beiden Teilen
  if (at >= P.schnitt[0]) {
    const s = Z.schnitt;
    if (ganz) _m6qSchnitt(ctx, F, s[0], s[1], _m6qE(at, P.schnitt));
    else d.forEach(dd => _m6qSchnitt(ctx, F, _m6qVers(s[0], dd), _m6qVers(s[1], dd), 1));
  }
  // Zahlen in den Teilen
  Z.teile.forEach((r, i) => {
    const R = _m6qRech(r), q = _m6qPx(F, [(r[0] + r[2]) / 2 + d[i][0], (r[1] + r[3]) / 2 + d[i][1]]);
    _m6qEtikett(ctx, _m6qQ(R.A), q[0], q[1], farb[i][2], at - iv[i][1], r[2] - r[0] < 2 ? 12 : 14);
  });
  if (at >= P.zu[1]) {
    const A = Z.teile.map(r => _m6qRech(r).A);
    _m6qKarte(ctx, F, [[_m6qQ(A[0]), K.B_TEXT], [' + ', K.TINTE], [_m6qQ(A[1]), K.O_TEXT],
                       [' = ', K.TINTE], [_m6qQ(A[0] + A[1]), K.TINTE]], at - P.zu[1]);
  }
}
// Rechteck mit Diagonale: zerlegen, Dreieck 2 auf Dreieck 1 drehen, zurueck, zusammen.
function _m6qRdZeichnen(ctx, F, P, at) {
  const K = _m6qK, E = _bioFxEase, kl = _bioFxKlemme, z = _m6q;
  const eF = kl(at / K.T_FIG), ganz = at < P.aus[0];
  const c = _m6qE(at, P.aus);
  const eA = E.sanft(c) * (1 - E.sanft(_m6qE(at, P.zu)));
  const eD = E.sanft(_m6qE(at, P.dreh)) - E.sanft(_m6qE(at, P.zurueck));
  const V = _m6qRech([0, 0, F.b, F.h]), D = V.A / 2;
  const d1 = [F.weg[0][0] * K.WEG * eA, F.weg[0][1] * K.WEG * eA];
  const d2 = [F.weg[1][0] * K.WEG * eA, F.weg[1][1] * K.WEG * eA];
  const t1 = F.dreiecke[0].map(p => _m6qVers(p, d1));
  const t2a = F.dreiecke[1].map(p => _m6qVers(p, d2));
  const G1 = _m6qSchwer(t1), G2 = _m6qSchwer(t2a);
  // Dreieck 2: dreht sich um seinen Schwerpunkt, der Schwerpunkt wandert zu dem
  // von Dreieck 1; bei eD = 1 liegt es genau auf Dreieck 1. Dabei hebt es sich
  // leicht (etwas groesser, Schatten) – bei eD = 0 und 1 nicht.
  const hebe = Math.sin(Math.PI * eD), hub = 1 + 0.05 * hebe;
  const g = [G2[0] + (G1[0] - G2[0]) * eD, G2[1] + (G1[1] - G2[1]) * eD];
  const lage2 = p => {
    const r = _m6qDreh(p, G2, Math.PI * eD);
    return [g[0] + (r[0] - G2[0]) * hub, g[1] + (r[1] - G2[1]) * hub];
  };
  const t2 = t2a.map(lage2);
  // Boeden
  if (ganz) {
    _m6qGanz(ctx, F, eF, true);
    _m6qReihen(ctx, F, [0, 0, F.b, F.h], [0, 0], P.vorher, K.N_REIHE, at);
  } else {
    _m6qFlaeche(ctx, F, t1, _m6qMisch(K.BODEN, K.B_FUELL, c), 1);
    if (hebe > 0.01) {                              // Schatten des gehobenen Dreiecks
      ctx.save(); ctx.translate(3, 5);
      _m6qFlaeche(ctx, F, t2, 'rgba(15,23,42,1)', 0.16 * hebe);
      ctx.restore();
    }
    _m6qFlaeche(ctx, F, t2, _m6qMisch(K.BODEN, K.O_FUELL, c), eD > 0.001 ? 0.82 : 1);
  }
  _m6qRaster(ctx);
  if (z.ahaArt === 'D') _m6qGlanz(ctx, F, t1);
  // Waende bzw. Raender
  if (ganz) _m6qGanz(ctx, F, eF, false);
  else {
    _m6qRand(ctx, F, t1, _m6qMisch(K.WAND, K.B_RAND, c), 2.6, 1);
    _m6qRand(ctx, F, t2, _m6qMisch(K.WAND, K.O_RAND, c), 2.6, 1);
    // Liegt Dreieck 2 auf Dreieck 1, verschwaende der blaue Rand darunter. Blau
    // gestrichelt obenauf zeigt: die Raender fallen genau zusammen.
    if (eD > 0.01) _m6qRand(ctx, F, t1, K.B_RAND, 2, eD, [5, 4]);
  }
  // Diagonale: erst gezogen, danach an der langen Seite beider Dreiecke
  if (at >= P.schnitt[0]) {
    if (ganz) _m6qSchnitt(ctx, F, [0, 0], [F.b, F.h], _m6qE(at, P.schnitt));
    else {
      _m6qSchnitt(ctx, F, t1[0], t1[2], 1);
      _m6qSchnitt(ctx, F, t2[0], t2[1], 1);
    }
  }
  // Zahlen: erst die ganze Flaeche, nach dem Zurueckgleiten die der Dreiecke
  const mitte = _m6qPx(F, [F.b / 2, F.h / 2]);
  const weg = 1 - kl((at - P.schnitt[0]) / 0.3);
  _m6qEtikett(ctx, _m6qQ(V.A), mitte[0], mitte[1], K.TINTE, at - P.vorher[1], 14, weg);
  _m6qKarte(ctx, F, [[V.rech + ' = ' + _m6qQ(V.A), K.TINTE]], at - P.vorher[1], weg);
  const q1 = _m6qPx(F, G1), q2 = _m6qPx(F, _m6qSchwer(t2));
  _m6qEtikett(ctx, _m6qQ(D), q1[0], q1[1], K.B_TEXT, at - P.t1[1], 14);
  _m6qEtikett(ctx, _m6qQ(D), q2[0], q2[1], K.O_TEXT, at - P.t2[1], 14);
  if (at >= P.zu[1]) {
    _m6qKarte(ctx, F, [[_m6qQ(D), K.B_TEXT], [' + ', K.TINTE], [_m6qQ(D), K.O_TEXT],
                       [' = ', K.TINTE], [_m6qQ(2 * D), K.TINTE]], at - P.zu[1]);
  }
}
// L ergaenzen: Stueck zeichnet sich, fuellt sich, Reihen leuchten, Stueck geht weg.
function _m6qErgZeichnen(ctx, F, P, at) {
  const K = _m6qK, E = _bioFxEase;
  const G = F.erg, R = _m6qRech(G.rect), S = _m6qRech(G.stueck);
  const st = _m6qEcken(G.stueck);                 // beginnt an der inneren Ecke
  const eS = _m6qE(at, P.strich), eFu = _m6qE(at, P.fuell), eW = E.sanft(_m6qE(at, P.weg));
  const dW = [0.5 * eW, 0.5 * eW], sicht = 1 - eW;
  const stW = st.map(p => _m6qVers(p, dW));
  // Boeden
  _m6qFlaeche(ctx, F, F.ecken, K.BODEN, 1);
  _m6qFlaeche(ctx, F, stW, K.O_FUELL, 0.8 * eFu * sicht);
  _m6qReihen(ctx, F, G.rect, [0, 0], P.erg, K.N_REIHE, at);
  if (sicht > 0.01) _m6qReihen(ctx, F, G.stueck, dW, P.stueck, K.O_REIHE, at);
  _m6qRaster(ctx);
  // Waende, gestrichelter Umriss des Stuecks (bleibt stehen), das wandernde Stueck
  _m6qRand(ctx, F, F.ecken, K.WAND, 3, 1);
  _m6qTeilweg(ctx, F, st, eS, K.O_RAND, 2.4, [6, 4]);
  if (eW > 0) _m6qRand(ctx, F, stW, K.O_RAND, 2, sicht);
  // Zahl im Stueck, Rechenkarte
  const qs = _m6qPx(F, [(G.stueck[0] + G.stueck[2]) / 2 + dW[0], (G.stueck[1] + G.stueck[3]) / 2 + dW[1]]);
  _m6qEtikett(ctx, _m6qQ(S.A), qs[0], qs[1], K.O_TEXT, at - P.stueck[1], 14, sicht);
  if (at >= P.weg[0]) {
    _m6qKarte(ctx, F, [[_m6qQ(R.A), K.TINTE], [' − ', K.TINTE], [_m6qQ(S.A), K.O_TEXT], [' = ', K.TINTE],
                       [at >= P.weg[1] ? _m6qQ(R.A - S.A) : '…', K.TINTE]], at - P.weg[0]);
  } else if (at >= P.erg[1]) {
    _m6qKarte(ctx, F, [[R.rech + ' = ' + _m6qQ(R.A), K.TINTE]], at - P.erg[1]);
  }
}
// Dreieck ergaenzen: Kopie liegt genau auf dem Dreieck, hebt sich ab, dreht
// sich an die lange Seite.
function _m6qDreZeichnen(ctx, F, P, at) {
  const K = _m6qK, E = _bioFxEase, kl = _bioFxKlemme;
  const R = _m6qRech([0, 0, F.b, F.h]);
  const cB = _m6qE(at, P.blau);
  const eH = E.sanft(_m6qE(at, P.heb)), eD = E.sanft(_m6qE(at, P.dreh));
  const setz = E.sanft(kl((at - (P.dreh[1] - 0.25)) / 0.25));
  const hebe = eH * (1 - setz), sicht = _m6qE(at, P.kopie);
  const kopie = _m6qStreck(F.ecken.map(p => _m6qDreh(p, F.mitte, Math.PI * eD)), 1 + 0.05 * hebe);
  // Boeden
  _m6qFlaeche(ctx, F, F.ecken, _m6qMisch(K.BODEN, K.B_FUELL, cB), 1);
  if (hebe > 0.01) {
    ctx.save(); ctx.translate(3, 5);
    _m6qFlaeche(ctx, F, kopie, 'rgba(15,23,42,1)', 0.16 * hebe * sicht);
    ctx.restore();
  }
  _m6qFlaeche(ctx, F, kopie, K.O_FUELL, (0.82 + 0.18 * setz) * sicht);
  _m6qReihen(ctx, F, [0, 0, F.b, F.h], [0, 0], P.erg, K.N_REIHE, at);
  _m6qRaster(ctx);
  _m6qRand(ctx, F, F.ecken, _m6qMisch(K.WAND, K.B_RAND, cB), 2.6, 1);
  _m6qRand(ctx, F, kopie, K.O_RAND, 2.6, sicht);
  // Solange die Kopie aufliegt: blauer Rand gestrichelt obenauf – die Raender
  // fallen genau zusammen (wie beim Rechteck mit Diagonale).
  if (eH < 0.99) _m6qRand(ctx, F, F.ecken, K.B_RAND, 2, sicht * (1 - eH), [5, 4]);
  const q = _m6qPx(F, _m6qSchwer(F.ecken));
  _m6qEtikett(ctx, _m6qQ(R.A / 2), q[0], q[1], K.B_TEXT, at - P.t1[1], 14);
  if (at >= P.erg[1]) _m6qKarte(ctx, F, [[R.rech + ' = ' + _m6qQ(R.A), K.TINTE]], at - P.erg[1]);
}
function _m6qDraw(ctx, cv) {
  if (!_m6q) return;
  const z = _m6q, W = cv.width, H = cv.height, F = z.fig ? _m6qFIG[z.fig] : null;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6qPapier(ctx);
  if (!F || !z.modus) _m6qRaster(ctx);
  else {
    const P = _m6qPlan(z), at = z.at;
    if (z.modus === 'zer') _m6qZerZeichnen(ctx, F, P, at);
    else if (z.modus === 'rd') _m6qRdZeichnen(ctx, F, P, at);
    else if (z.modus === 'erg') _m6qErgZeichnen(ctx, F, P, at);
    else if (z.modus === 'dre') _m6qDreZeichnen(ctx, F, P, at);
    else {                                          // 'dr0': Dreieck erscheint
      const eF = _bioFxKlemme(at / _m6qK.T_FIG);
      _m6qGanz(ctx, F, eF, true);
      _m6qRaster(ctx);
      _m6qGanz(ctx, F, eF, false);
    }
  }
  _m6qLegende(ctx);
  _bioFxDraw(ctx, z.fx);
  if (z.pause) _m6qPauseSchild(ctx);
}
