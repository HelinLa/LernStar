
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 6 FOERDER – mt3 „Ist 123 durch 3 teilbar?“
// (Kennung m6-durch-drei, Praefix _k6c)
// Bauplan: arbeitsheft_mathe_foe6/KAPITEL1_PROFIL.md, Abschnitt m6-durch-drei
// (Einheit mt3, Titel „Reicht die 3 am Ende?“); allgemeine Regeln dort unter
// „Die sechs Simulationen – Allgemein“ und MATHE_PROFIL § 10.
// Ueberschrift = Frage der Einheit: „Ist 123 durch 3 teilbar?“
//
// Was man sieht (Leinwand 420 x 250). Ein Wuerfel ist in der Tafel 6 px gross
// (Platte, Stange und Einer gleich – von der Platte bleibt derselbe Wuerfel
// uebrig wie ein Einer), in Fach und Kasten 8 px (dort wird gezaehlt), in der
// Ablage 4,4 px. Farbe der Stelle wie m5-buendeln und
// m5-teilen-schriftlich: H rot, Z blau, E gruen – jeder Wuerfel behaelt sie
// bis zum Schluss, man sieht also immer, woher er kommt.
//   STELLENWERTTAFEL (links oben): Spalten H | Z | E, oben der Buchstabe mit
//     dem Wort darunter („Hunderter“, „Zehner“, „Einer“), darunter die
//     Ziffernkarte, darunter das Material – die Platte aus 10 x 10 Wuerfeln
//     (Fuenferlinien), Stangen aus 10 Wuerfeln (Fuenfermarke), einzelne
//     Wuerfel in Fuenferreihen. Eine leere vordere Stelle (21) hat eine
//     leere, gestrichelte Karte.
//   DREI FAECHER (unten) genau unter H, Z und E, unten beschriftet „aus H“,
//     „aus Z“, „aus E“: dorthin kommen die einzelnen Wuerfel, die uebrig
//     bleiben (Fuenferreihen). Die Beschriftung steht UNTEN, damit kein
//     Wuerfel, der hinein- oder hinausfliegt, ueber die Schrift zieht.
//   ABLAGE (rechts oben), Ueberschrift „Dreier“ bzw. „Neuner“ mit einem
//     kleinen grauen Musterblock: die gebildeten Gruppen in Zehnerreihen mit
//     Fuenferluecke – ein Dreier als Streifen aus 3 Wuerfeln, ein Neuner als
//     Quadrat 3 x 3.
//   KASTEN „Rest am Ende“ (rechts unten, in der Reihe der Faecher, ebenfalls
//     unten beschriftet).
//
// Bewegung (jede Sprungmarke spielt ihre Zeile SELBST ab; das ganze Drehbuch
// entsteht in _k6cPlan EINMAL, _k6cOrt liest es zur Ablaufzeit ab – keine
// Zufallszahl, jede Zahl im Bild und in der Anzeige kommt aus _k6cRechne):
//   0  Das Material faellt gestaffelt von oben in die Tafel (0,4 s).
//   1  PLATTE: sie zerfaellt in 100 Wuerfel (rueckt in 0,25 s auseinander,
//      nach jedem dritten Wuerfel eine kleine Luecke: man sieht Bloecke 3 x 3,
//      die rechte Spalte, die untere Zeile und die Ecke fuer sich). Dann wird
//      je eine Gruppe umrahmt (0,22 s vorher) und fliegt in die Ablage,
//      schneller werdend: 33 Dreier in 1,35 s (zeilenweise von oben, zuletzt
//      die drei senkrechten Dreier der rechten Spalte), mit Neunern 11 in
//      1,05 s (neun Quadrate 3 x 3, die rechte Spalte, die untere Zeile).
//      Genau 1 Wuerfel bleibt – immer die Ecke unten rechts –, er leuchtet
//      gelb und gleitet ins Fach „aus H“. Die Rahmen kommen einzeln, nicht alle
//      auf einmal: 33 Rahmen gleichzeitig verschwammen am Bild zu einem Gitter.
//      Flugbahn: erst hinauf unter die Ziffernkarten (y = 76), waagerecht
//      hinueber, erst hinter der Tafel hinauf in die Ablage – kein Wuerfel
//      zieht ueber eine Ziffernkarte.
//   2  STANGEN, eine nach der anderen (0,6 s Takt): 3 Dreier fliegen (oder
//      1 Neuner), der unterste Wuerfel leuchtet und gleitet ins Fach „aus Z“.
//   3  EINER: sie gleiten gestaffelt ins Fach „aus E“ (je 0,4 s).
//      Waehrend 1–3 ist die Spalte, die gerade dran ist, gelb hinterlegt.
//   4  LETZTER SCHRITT: die einzelnen Wuerfel ruecken aus den drei Faechern in
//      den Kasten „Rest am Ende“ (in den Faechern bleibt ein gestrichelter
//      Umriss – woher sie kamen), legen sich zu Dreiern (Neunern) zusammen,
//      jede volle Gruppe wird umrahmt und fliegt in die Ablage. Was uebrig
//      bleibt, rueckt in die Mitte des Kastens und leuchtet orange. Bleibt
//      nichts, laeuft ein Lichtring durch den leeren Kasten.
//   Gemessen (Frames zu 16 ms): „21“ ist nach 3,9 s fertig, „123“ nach 6,5 s,
//   „124“ nach 6,7 s, „126 mit Neunern“ nach 6,25 s, der laengste Lauf
//   („129“, 12 einzelne Wuerfel) nach 7,55 s. Der Halt vor dem letzten
//   Schritt liegt bei 2,35 / 4,76 / 4,84 / 4,54 s.
//   Faktendump (simfakten.js --voll --frames=25 --verlauf=4): Der erste
//   Durchgang liest nur bis 125 Frames (2,0 s) und sieht die Endwerte nicht;
//   der zweite Durchgang (jeder Knopf ein zweites Mal gedrueckt, „… · 2. …“)
//   laesst jeden Lauf auslaufen – dort stehen die Endwerte aller vier
//   Sprungmarken. Nachgerechnet mit simcheck/werte.js
//   (Update in einer Schleife bis zum Ende).
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_k6cMarke('…')):
//     „21“ · „123“ · „124“ · „126 mit Neunern“ – jede setzt ihre Gruppengroesse
//     mit (die ersten drei Dreier, die letzte Neuner) und spielt ab.
//   Reihe 2: „+ 1 Würfel“ (_k6cPlus()): Einer + 1 bis 9, dann spielt die neue
//              Zahl ab; der neue Wuerfel faellt zuletzt und leuchtet kurz.
//              Bei 9 Einern wackelt die Ziffernkarte E, Statuszeile
//              „Die Einerstelle ist voll.“ (bis zur naechsten Handlung).
//            „Gruppen: Dreier“ ↔ „Gruppen: Neuner“ (_k6cGruppen()): wechselt
//              die Gruppengroesse und spielt die Zahl in der Tafel neu ab.
//            „noch einmal“ (_k6cNochmal()) · „neu“ (_k6cNeu(): Start 123,
//              Dreier, nichts gebildet).
//   Jeder dieser Knoepfe beginnt neu: was noch zu sehen ist, faellt weg, das
//   neue Material faellt ein. Wer waehrend einer Bewegung einen Knopf drueckt,
//   bricht sie damit sofort ab, und das Neue beginnt.
//   Der Knopf der Sprungmarke, deren Zahl UND Gruppengroesse gerade gelten,
//   ist hervorgehoben.
//
// Statuszeilen (woertlich, jede mit mehr als 18 Zeichen):
//   _k6c-zahl      „Zahl in der Tafel: 123“
//   _k6c-material  „Material: 1 Platte, 2 Stangen, 3 Würfel“ (Einzahl/Mehrzahl:
//                  „0 Platten“, „1 Stange“; je Stelle in ihrer Farbe)
//   _k6c-gruppe    „Gebildet werden: Dreier“ / „Gebildet werden: Neuner“
//   _k6c-faecher   „Einzeln aus H: 1, aus Z: 2, aus E: 3“ – zaehlt mit, wenn
//                  ein Wuerfel im Fach landet; „…“, solange die Stelle noch
//                  nicht dran war (Start: „Einzeln aus H: …, aus Z: …, aus E: …“)
//   _k6c-einzeln   „Übrige einzelne Würfel: 6“ – „…“, bis der letzte einzelne
//                  Wuerfel in seinem Fach liegt
//   _k6c-rest      „Rest am Ende: 0 Würfel“ (auch „1 Würfel“) – Start und
//                  waehrend des Laufs „Rest am Ende: noch offen“
//   _k6c-gruppen   „Gebildete Dreier zusammen: 41“ / „Gebildete Neuner
//                  zusammen: 14“ – zaehlt jede Gruppe, die in der Ablage landet
//   _k6c-grenze    nur bei Bedarf: „Die Einerstelle ist voll.“
//   _k6c-lehrkraft Hinweis fuer die Lehrkraft (siehe unten)
//
// Werte (nachgerechnet mit simcheck/werte.js; jede Zeile geht auf:
// Gruppen · Gruppengroesse + Rest = Zahl):
//   21              → 0 Platten, 2 Stangen, 1 Würfel · aus H 0, Z 2, E 1 · 3 ·
//                     Rest 0 · 7 Dreier (7 · 3 = 21)
//   123             → 1/2/3 · 1, 2, 3 · 6 · Rest 0 · 41 Dreier (41 · 3 = 123)
//   124             → 1/2/4 · 1, 2, 4 · 7 · Rest 1 · 41 Dreier (41 · 3 + 1 = 124)
//   126 mit Neunern → 1/2/6 · 1, 2, 6 · 9 · Rest 0 · 14 Neuner (14 · 9 = 126)
//   frei: 123 mit Neunern → 6 · Rest 6 · 13 Neuner (13 · 9 + 6 = 123)
//         „+ 1 Würfel“ ab 124 → 125: 8 · Rest 2 · 41 Dreier (41 · 3 + 2 = 125)
// Start: „Start: 123 in der Tafel, noch nichts gebildet“ (Dreier).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): bei „123“ der eine Wuerfel, der
// von der Platte uebrig bleibt – Lichtring um die Ecke (von 100 bleibt genau 1),
// und am Ende Rest 0, obwohl 123 „wie 13“ aussieht – Lichtring um den leeren
// Kasten „Rest am Ende“. Beide Ringe kommen bei JEDEM Lauf an derselben Stelle:
// Die Beobachtung „von der Platte bleibt genau 1“ traegt auch Zeile 4 (mit
// Neunern genauso), und „Rest 0“ ist bei 21 und 126 dieselbe Beobachtung.
//
// FUER DIE LEHRKRAFT (Container <div class="fpm-lehrkraft">, Bauart wie
// m5-teilen-schriftlich), eigene Zeile unter den Heftknoepfen:
//   „Pause“ ↔ „weiter“ (_k6cAnhalten()): friert jede Bewegung ein; im Bild
//     oben rechts in der Ablage das Schild „Pause“.
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_k6cTempo()): ein Drittel so schnell.
//   „Halt vor dem letzten Schritt: aus“ ↔ „… an“ (_k6cHaltSchalter()): haelt
//     VON SELBST an, wenn alle einzelnen Wuerfel in den Faechern liegen (vor
//     Schritt 4); die drei Faecher sind dann dick orange umrandet. Mit „weiter“
//     ruecken sie zusammen.
//   Eine Sprungmarke und jeder Knopf, der neu abspielt, heben die Pause auf;
//   Halt und Tempo bleiben stehen. EIN Zeitfaktor an der Stelle, an der dt in
//   _k6cUpdate hineingeht; der Halt ist ein Ereignis im Drehbuch (P.halt).
//   Hinweiszeile _k6c-lehrkraft (in der Pause bernsteinfarben „lmp-status off“)
//   nennt IMMER die Einstellung („… Halt: aus, Tempo: normal.“):
//     sonst  „Für die Lehrkraft: „Pause“ hält alles an. „Halt vor dem letzten
//            Schritt“ stoppt von selbst.“
//     Halt   „Halt: Die einzelnen Würfel liegen in den Fächern. Frage: Wie
//            viele? Woher? Dann „weiter“.“
//     Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
//
// Nicht am Bildschirm (Bauplan): „Quersumme“, „Summe der Ziffern“,
// „Gegenbeispiel“, die Regel als Satz, ein Urteil in einer Statuszeile
// („teilbar“, „geht auf“). „teilbar“ steht nur in der Ueberschrift (Frage).
// Keine Namen, keine Punkte, keine Zeitmessung, kein „falsch“.
//
// Abweichungen vom Bauplan, jede begruendet:
//   * Hinweis: der Bauplan sagt „… zerfallen in Dreier. …“. Mit Neunern
//     stuende dann „Dreier“ ueber einem Bild, in dem Neuner fliegen. Nur das
//     eine Wort wechselt mit der Gruppengroesse („… zerfallen in Neuner.“);
//     mit Dreiern steht der Satz woertlich wie im Bauplan.
//   * Wohin die Wuerfel in Schritt 4 „zusammenruecken“, sagt der Bauplan
//     nicht: in den Kasten „Rest am Ende“ neben den Faechern. So bleibt die
//     Ablage nur fuer fertige Gruppen, und der Rest liegt dort, wo die
//     Statuszeile „Rest am Ende“ ihn nennt.
//   * Die Faecher tragen „aus H“, „aus Z“, „aus E“ – dieselben Woerter wie die
//     Statuszeile _k6c-faecher, damit Bild und Zahl verbunden sind.
// Platz in der Tafel: hoechstens eine Platte (alle erreichbaren Zahlen liegen
// zwischen 21 und 129), bis 9 Stangen und 9 Einer.
// ════════════════════════════════════════════════════════════════════════
let _k6c = null;
const _k6cMARKEN = { '21': [21, 3], '123': [123, 3], '124': [124, 3], '126n': [126, 9] };   // [Zahl, Gruppengroesse]
const _k6cREIHE = ['21', '123', '124', '126n'];
const _k6cAUFSCHRIFT = { '21': '21', '123': '123', '124': '124', '126n': '126 mit Neunern' };
const _k6cSTART = [123, 3];
const _k6cSP = ['H', 'Z', 'E'];
const _k6cWORT = { H: 'Hunderter', Z: 'Zehner', E: 'Einer' };
const _k6cGNAME = { 3: 'Dreier', 9: 'Neuner' };
const _k6cFARBE = {
  H: { grund: '#fef2f2', fuell: '#fca5a5', linie: 'rgba(185,28,28,0.38)', rand: '#b91c1c' },
  Z: { grund: '#eff6ff', fuell: '#93c5fd', linie: 'rgba(29,78,216,0.42)', rand: '#1d4ed8' },
  E: { grund: '#f0fdf4', fuell: '#86efac', linie: 'rgba(21,128,61,0.42)', rand: '#15803d' }
};
const _k6cDUNKEL = '#1f2937';
const _k6cORANGE = '#ea580c';
const _k6cK = {
  // Stellenwerttafel: Rahmen, Spalten, Kopf, Ziffernkarten, Materialfeld (Mitte y = 119)
  TX0: 4, TX1: 246, TY0: 4, TY1: 170,
  SP: { H: [4, 92], Z: [92, 168], E: [168, 246] },
  KY0: 8, KY1: 36, ZY0: 41, ZY1: 67, MY0: 71, MY1: 166, MITTE: 119,
  // Faecher unter H, Z, E (Mitte der Wuerfel y = 203, Beschriftung unten)
  FY0: 176, FY1: 246, FACH: { H: [8, 88], Z: [96, 164], E: [172, 242] }, FMY: 203,
  // Ablage (oben) und Kasten „Rest am Ende“ (unten)
  AX0: 252, AX1: 416, AY0: 4, AY1: 170, RX0: 252, RX1: 416, RY0: 176, RY1: 246,
  AX: 258, AY: 36, AW: 4.4, AXP: 14.8, ALUECKE: 4, AYP3: 12, AYP9: 19,
  RMX: 334, RMY: 203,
  // Wuerfel: Kante, Abstand in Reihen (Tafel); gespreizt (Platte und Stange
  // zerfallen; nach jedem dritten Wuerfel eine Luecke); in Fach und Kasten groesser
  W: 6, P: 8, SPREIZ: 6.6, WS: 5.4, LUECKE: 2.4, FW: 8, FP: 10,
  // Flughoehen: ueber dem Material, ueber den Faechern, in der Ablage; ab XG steigt
  // ein Wuerfel aus der Tafel in die Ablage (vorher bleibt er unter den Ziffernkarten)
  BAHN_OBEN: 76, BAHN_FACH: 140, BAHN_ABLAGE: 100, XG: 250,
  // Zeiten in s
  T_FALL: 0.3, T_RUHE: 0.12,
  T_SPREIZ: 0.25, T_VOR: 0.22, T_STARTS: { 3: 0.95, 9: 0.65 }, T_FLUG: 0.4,
  T_LEUCHT: 0.25, T_GLEIT: 0.35,
  S_TAKT: 0.6, S_SPREIZ: 0.08, S_FLUG: 0.26, S_GLEIT: 0.28,
  E_TAKT: 0.05, E_GLEIT: 0.4,
  T_SAMMEL: 0.45, SAMMEL_TAKT: 0.03, T_ORDNEN: 0.22, T_GFLUG: 0.36, G_TAKT: 0.12,
  T_SCHLUSS: 0.12, T_WEG: 0.25, LANGSAM: 1 / 3
};

// ── Rechnen ─────────────────────────────────────────────────────────────
// Von jeder Platte bleibt 100 - 33 · 3 = 1 (bzw. 100 - 11 · 9 = 1), von jeder
// Stange 10 - 3 · 3 = 1 (bzw. 10 - 9 = 1) – so steht es auch im Drehbuch.
function _k6cRechne(zahl, g) {
  const H = Math.floor(zahl / 100), Z = Math.floor(zahl / 10) % 10, E = zahl % 10;
  const jePlatte = Math.floor(100 / g), jeStange = Math.floor(10 / g);
  const restPlatte = 100 - jePlatte * g, restStange = 10 - jeStange * g;
  const einzeln = H * restPlatte + Z * restStange + E;
  const amEnde = Math.floor(einzeln / g), rest = einzeln - amEnde * g;
  return { zahl, g, H, Z, E, jePlatte, jeStange, einzeln, amEnde, rest,
           gruppen: H * jePlatte + Z * jeStange + amEnde };
}
function _k6cAnz(n, ein, mehr) { return n + ' ' + (n === 1 ? ein : mehr); }

// ── Plaetze ─────────────────────────────────────────────────────────────
// n Wuerfel um die Mitte (cx, cy): bis 5 eine Reihe, sonst Fuenferreihen.
// w = Kante, p = Abstand (Tafel 6/8, Fach und Kasten 8/10).
function _k6cReihe(m, n, cx, cy, w, p) {
  const K = _k6cK;
  w = w || K.W; p = p || K.P;
  const reihen = Math.max(1, Math.ceil(n / 5)), breit = Math.min(Math.max(n, 1), 5) * p - (p - w);
  const x0 = cx - breit / 2, y0 = cy - (reihen * p - (p - w)) / 2;
  return { x: x0 + (m % 5) * p, y: y0 + Math.floor(m / 5) * p, s: w, a: 1 };
}
function _k6cFach(art, m, n) {
  const K = _k6cK;
  return _k6cReihe(m, n, (K.FACH[art][0] + K.FACH[art][1]) / 2, K.FMY, K.FW, K.FP);
}
// zerfallen: Abstand 6,6 und nach jedem dritten Wuerfel eine Luecke – man sieht
// die Dreier (und die Bloecke 3 x 3), die Ecke [9, 9] steht fuer sich
function _k6cSpreiz(i) {
  const K = _k6cK, halb = (9 * K.SPREIZ + K.WS + 3 * K.LUECKE) / 2;
  return -halb + K.SPREIZ * i + K.LUECKE * Math.floor(i / 3);
}
// Platte: Zelle (r, c), ganz (Abstand 6) oder zerfallen
function _k6cPlatte(r, c, gespreizt) {
  const K = _k6cK, cx = (K.SP.H[0] + K.SP.H[1]) / 2;
  if (!gespreizt) return { x: cx - 30 + K.W * c, y: K.MITTE - 30 + K.W * r, s: K.W, a: 1 };
  return { x: cx + _k6cSpreiz(c), y: K.MITTE + _k6cSpreiz(r), s: K.WS, a: 1 };
}
function _k6cStange(cx, i, gespreizt) {
  const K = _k6cK;
  if (!gespreizt) return { x: cx - K.W / 2, y: K.MITTE - 30 + K.W * i, s: K.W, a: 1 };
  return { x: cx - K.WS / 2, y: K.MITTE + _k6cSpreiz(i), s: K.WS, a: 1 };
}
// Ablage: Gruppe Nr. q, i-ter Wuerfel (Dreier als Streifen, Neuner als Quadrat)
function _k6cAblage(q, i, g) {
  const K = _k6cK, reihe = Math.floor(q / 10), sp = q % 10;
  const x = K.AX + sp * K.AXP + (sp >= 5 ? K.ALUECKE : 0);
  if (g === 3) return { x: x + i * K.AW, y: K.AY + reihe * K.AYP3, s: K.AW, a: 1 };
  return { x: x + (i % 3) * K.AW, y: K.AY + reihe * K.AYP9 + Math.floor(i / 3) * K.AW, s: K.AW, a: 1 };
}
function _k6cAblageBlock(q, g) {
  const o = _k6cAblage(q, 0, g), K = _k6cK;
  return { x: o.x, y: o.y, b: 3 * K.AW, h: (g === 3 ? 1 : 3) * K.AW };
}
// Kasten „Rest am Ende“: erst eine Reihe, dann in Gruppen zu g mit Luecke
function _k6cKastenReihe(m, n) {
  const K = _k6cK;
  return { x: K.RMX - (n * K.FP - (K.FP - K.FW)) / 2 + m * K.FP, y: K.RMY - K.FW / 2, s: K.FW, a: 1 };
}
function _k6cKastenGruppe(m, n, g) {
  const K = _k6cK, haufen = Math.ceil(n / g), breit = n * K.FP - (K.FP - K.FW) + (haufen - 1) * 7;
  return { x: K.RMX - breit / 2 + m * K.FP + Math.floor(m / g) * 7, y: K.RMY - K.FW / 2, s: K.FW, a: 1 };
}
// Welche Zellen der Platte bilden zusammen eine Gruppe? Uebrig bleibt [9, 9].
function _k6cPlattenGruppen(g) {
  const G = [];
  if (g === 3) {
    for (let r = 0; r < 10; r++) for (let q = 0; q < 3; q++) G.push([0, 1, 2].map(i => [r, 3 * q + i]));
    for (let q = 0; q < 3; q++) G.push([0, 1, 2].map(i => [3 * q + i, 9]));
  } else {
    for (let br = 0; br < 3; br++) for (let bc = 0; bc < 3; bc++) {
      const t = [];
      for (let i = 0; i < 9; i++) t.push([3 * br + Math.floor(i / 3), 3 * bc + i % 3]);
      G.push(t);
    }
    G.push([0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => [i, 9]));
    G.push([0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => [9, i]));
  }
  return G;
}

// ── Drehbuch ────────────────────────────────────────────────────────────
// modus 'start': nur das Material faellt ein. 'lauf': einfallen und abspielen.
// neuEiner: Nummer des Einers, der mit „+ 1 Würfel“ dazugekommen ist (sonst -1).
function _k6cEnde(w) { return w.segs[w.segs.length - 1].nach; }
function _k6cPlan(zahl, g, modus, neuEiner) {
  const K = _k6cK, R = _k6cRechne(zahl, g);
  const P = { zahl, g, modus, R, wuerfel: [], gruppen: [], teile: [], baender: [], ringe: [], einzelne: [],
              fach: { H: [], Z: [], E: [] }, fachFertig: { H: Infinity, Z: Infinity, E: Infinity },
              tEinzeln: Infinity, halt: Infinity, tEnde: Infinity, ende: 0 };
  const neu = (art, ort, t0) => {
    const w = { art, teil: null, halo: null, rest: false, fachOrt: null, tSammel: Infinity,
                segs: [{ t0, t1: t0 + K.T_FALL, ease: 'raus',
                         von: { x: ort.x, y: ort.y - 22, s: ort.s, a: 0 }, nach: ort }] };
    P.wuerfel.push(w);
    return w;
  };
  // bahn: null (gerade), { art: 'tafel', L } (aus der Tafel in die Ablage),
  // { art: 'bogen', L } (hinauf auf die Flughoehe L, hinueber, hinein)
  const weiter = (w, t0, t1, nach, bahn) => {
    w.segs.push({ t0, t1, von: _k6cEnde(w), nach, bahn: bahn || null });
  };
  // Material faellt ein: Platte, Stangen, Einer (der neue zuletzt)
  const platte = [];
  if (R.H > 0) {
    const teil = { art: 'H', w: [], tSpreiz: Infinity, dSpreiz: K.T_SPREIZ, b: 60, h: 60 };
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
      const w = neu('H', _k6cPlatte(r, c, false), 0.02);
      w.teil = teil; w.rc = [r, c]; teil.w.push(w); platte.push(w);
    }
    P.teile.push(teil);
  }
  const stangen = [];
  for (let j = 0; j < R.Z; j++) {
    const cx = (K.SP.Z[0] + K.SP.Z[1]) / 2 + (j - (R.Z - 1) / 2) * Math.min(16, 64 / R.Z);
    const teil = { art: 'Z', cx, w: [], tSpreiz: Infinity, dSpreiz: K.S_SPREIZ, b: K.W, h: 60 };
    for (let i = 0; i < 10; i++) {
      const w = neu('Z', _k6cStange(cx, i, false), 0.08 + 0.05 * j);
      w.teil = teil; teil.w.push(w);
    }
    P.teile.push(teil); stangen.push(teil);
  }
  const einer = [];
  for (let m = 0; m < R.E; m++) {
    const t0 = 0.18 + 0.03 * m + (m === neuEiner ? 0.15 : 0);
    const w = neu('E', _k6cReihe(m, R.E, (K.SP.E[0] + K.SP.E[1]) / 2, K.MITTE), t0);
    if (m === neuEiner) w.halo = [t0 + K.T_FALL, t0 + K.T_FALL + 0.8];
    einer.push(w);
  }
  let t = Math.max(...P.wuerfel.map(w => w.segs[0].t1));
  if (modus === 'start') { P.ende = t; return P; }
  t += K.T_RUHE;

  let slot = 0;
  const flug = (gr, tR, tS, dauer, bahn) => {
    const G = { w: gr, tRahmen: tR, tStart: tS, tLand: tS + dauer, slot: slot++ };
    gr.forEach((w, i) => weiter(w, tS, tS + dauer, _k6cAblage(G.slot, i, g), bahn));
    P.gruppen.push(G);
    return G;
  };
  // (1) Platte: zerfallen, je Gruppe umrahmen und fliegen, schneller werdend; die Ecke bleibt
  const tH0 = t, ausTafel = { art: 'tafel', L: K.BAHN_OBEN };
  if (platte.length) {
    const teil = P.teile[0];
    teil.tSpreiz = t;
    for (const w of platte) weiter(w, t, t + K.T_SPREIZ, _k6cPlatte(w.rc[0], w.rc[1], true));
    const ts = t + K.T_SPREIZ + K.T_VOR, G = _k6cPlattenGruppen(g), N = G.length, D = K.T_STARTS[g];
    let letzter = ts;
    G.forEach((zellen, k) => {
      const tS = ts + D * Math.sqrt(k / N);
      flug(zellen.map(([r, c]) => platte[r * 10 + c]), tS - K.T_VOR, tS, K.T_FLUG, ausTafel);
      letzter = tS;
    });
    const ecke = platte[99], tL = letzter + K.T_FLUG * 0.6, pos = _k6cEnde(ecke);
    ecke.halo = [tL, tL + K.T_LEUCHT + K.T_GLEIT];
    P.ringe.push({ t: tL, x: pos.x + pos.s / 2, y: pos.y + pos.s / 2, r: 24 });   // Aha: von 100 bleibt 1
    const ziel = _k6cFach('H', 0, R.H);
    weiter(ecke, tL + K.T_LEUCHT, tL + K.T_LEUCHT + K.T_GLEIT, ziel);
    ecke.fachOrt = ziel;
    P.fach.H.push(tL + K.T_LEUCHT + K.T_GLEIT);
    P.einzelne.push(ecke);
    t = tL + K.T_LEUCHT + K.T_GLEIT;
    P.baender.push({ art: 'H', t0: tH0, t1: t });
  }
  P.fachFertig.H = t;
  // (2) Stangen, eine nach der anderen
  const tZ0 = t;
  stangen.forEach((teil, j) => {
    const S = tZ0 + j * K.S_TAKT;
    teil.tSpreiz = S;
    teil.w.forEach((w, i) => weiter(w, S, S + K.S_SPREIZ, _k6cStange(teil.cx, i, true)));
    const gruppen = g === 3 ? [[0, 1, 2], [3, 4, 5], [6, 7, 8]] : [[0, 1, 2, 3, 4, 5, 6, 7, 8]];
    let letzter = S;
    gruppen.forEach((ii, q) => {
      const tS = S + K.S_SPREIZ + 0.12 + 0.07 * q;
      flug(ii.map(i => teil.w[i]), tS - 0.12, tS, K.S_FLUG, ausTafel);
      letzter = tS;
    });
    const unten = teil.w[9], tL = letzter + 0.1;
    unten.halo = [tL, tL + 0.1 + K.S_GLEIT];
    const ziel = _k6cFach('Z', j, R.Z);
    weiter(unten, tL + 0.1, tL + 0.1 + K.S_GLEIT, ziel);
    unten.fachOrt = ziel;
    P.fach.Z.push(tL + 0.1 + K.S_GLEIT);
    P.einzelne.push(unten);
    t = tL + 0.1 + K.S_GLEIT;
  });
  if (stangen.length) P.baender.push({ art: 'Z', t0: tZ0, t1: t });
  P.fachFertig.Z = t;
  // (3) Einer gleiten ins Fach (beginnen, waehrend der letzte Stangenwuerfel noch gleitet)
  const tE0 = stangen.length ? t - 0.15 : t;
  einer.forEach((w, m) => {
    const t0 = tE0 + K.E_TAKT * m, ziel = _k6cFach('E', m, R.E);
    weiter(w, t0, t0 + K.E_GLEIT, ziel);
    w.fachOrt = ziel;
    P.fach.E.push(t0 + K.E_GLEIT);
    P.einzelne.push(w);
  });
  if (einer.length) {
    t = Math.max(t, tE0 + K.E_TAKT * (einer.length - 1) + K.E_GLEIT);
    P.baender.push({ art: 'E', t0: tE0, t1: t });
  }
  P.fachFertig.E = t;
  P.tEinzeln = Math.max(...P.fach.H, ...P.fach.Z, ...P.fach.E, tE0);
  P.halt = P.tEinzeln + 0.08;                               // Halt vor dem letzten Schritt
  // (4) Letzter Schritt: zusammenruecken, Gruppen bilden, was uebrig ist, leuchtet orange
  const n = P.einzelne.length, G0 = P.halt + 0.02;
  P.einzelne.forEach((w, m) => {
    const t0 = G0 + K.SAMMEL_TAKT * m;
    w.tSammel = t0;
    weiter(w, t0, t0 + K.T_SAMMEL, _k6cKastenReihe(m, n), { art: 'bogen', L: K.BAHN_FACH });
  });
  const tG = G0 + K.SAMMEL_TAKT * (n - 1) + K.T_SAMMEL + 0.05;
  P.einzelne.forEach((w, m) => weiter(w, tG, tG + K.T_ORDNEN, _k6cKastenGruppe(m, n, g)));
  const tO = tG + K.T_ORDNEN;
  let letzte = tO + 0.25, abflug = tO;
  for (let j = 0; j < R.amEnde; j++) {
    const G = flug(P.einzelne.slice(j * g, (j + 1) * g), tO + 0.03 + 0.06 * j, tO + 0.25 + K.G_TAKT * j,
                   K.T_GFLUG, { art: 'bogen', L: K.BAHN_ABLAGE });
    letzte = Math.max(letzte, G.tLand);
    abflug = G.tStart;
  }
  // was uebrig bleibt, rueckt in die Mitte des Kastens
  const reste = P.einzelne.slice(R.amEnde * g);
  const tR0 = R.amEnde ? abflug + 0.15 : tO;
  reste.forEach((w, m) => {
    w.rest = true;
    weiter(w, tR0, tR0 + 0.3, _k6cReihe(m, reste.length, K.RMX, K.RMY, K.FW, K.FP));
  });
  if (reste.length) letzte = Math.max(letzte, tR0 + 0.3);
  P.tEnde = letzte + K.T_SCHLUSS;
  P.baender.push({ art: 'R', t0: G0, t1: P.tEnde });
  if (R.rest === 0) P.ringe.push({ t: P.tEnde, x: K.RMX, y: K.RMY, r: 26 });
  P.ende = P.tEnde;
  return P;
}

// Wo steht ein Wuerfel zur Ablaufzeit at? (null = noch nicht eingefallen)
function _k6cOrt(w, at) {
  let s = w.segs[0];
  if (at < s.t0) return null;
  for (const g of w.segs) { if (g.t0 <= at) s = g; else break; }
  const u = _bioFxKlemme(s.t1 > s.t0 ? (at - s.t0) / (s.t1 - s.t0) : 1);
  const e = s.ease === 'raus' ? _bioFxEase.raus(u) : _bioFxEase.sanft(u);
  const A = s.von, B = s.nach, b = s.bahn;
  let x, y;
  if (b && b.art === 'tafel' && u < 1) {
    // aus der Tafel: auf den ersten 36 px hinauf auf die Flughoehe (unter den
    // Ziffernkarten), waagerecht hinueber, erst hinter der Tafel (XG) hinauf in die Ablage
    const K = _k6cK, glatt = v => v * v * (3 - 2 * v);
    x = A.x + (B.x - A.x) * e;
    const hoch = _bioFxKlemme((x - A.x) / Math.max(1, Math.min(36, K.XG - A.x)));
    const rein = _bioFxKlemme((x - K.XG) / Math.max(1, B.x - K.XG));
    y = A.y + (b.L - A.y) * glatt(hoch) + (B.y - b.L) * glatt(rein);
  } else if (b && u < 1) {
    // erst hinauf auf die Flughoehe, hinueber, dann hinein (kubische Bahn)
    const L = b.L, v = 1 - e;
    x = A.x * (v * v * v + 3 * v * v * e) + B.x * (3 * v * e * e + e * e * e);
    y = v * v * v * A.y + 3 * v * v * e * L + 3 * v * e * e * L + e * e * e * B.y;
  } else {
    x = A.x + (B.x - A.x) * e; y = A.y + (B.y - A.y) * e;
  }
  return { x, y, s: A.s + (B.s - A.s) * e, a: A.a + (B.a - A.a) * e, fliegt: !!b && u > 0 && u < 1 };
}

// ── Zustand ─────────────────────────────────────────────────────────────
function _k6cInit() {
  _k6c = { t: 0, zahl: _k6cSTART[0], g: _k6cSTART[1], lauf: null, weg: [], fx: [], sig: '',
           wackel: 0, grenze: '',
           // fuer die Lehrkraft: angehalten? Halt erreicht? Schalter Halt / langsam
           steht: false, haltInfo: false, haltAn: false, langsam: false };
  _k6cStarte(_k6cSTART[0], _k6cSTART[1], 'start', -1);
}
// Einen Lauf beginnen. Was noch zu sehen ist, faellt weg; das neue Material faellt ein.
function _k6cStarte(zahl, g, modus, neuEiner) {
  const z = _k6c;
  if (z.lauf) {
    const at = z.lauf.at;
    for (const w of z.lauf.plan.wuerfel) {
      const o = _k6cOrt(w, at);
      if (o && o.a > 0.05) z.weg.push({ x: o.x, y: o.y, s: o.s, a: o.a, art: w.art });
    }
  }
  z.zahl = zahl; z.g = g;
  z.lauf = { plan: _k6cPlan(zahl, g, modus, neuEiner), at: 0 };
  z.steht = false; z.haltInfo = false; z.grenze = '';      // neu abspielen hebt die Pause auf
  z.fx.length = 0;
}

function _k6cHTML() {
  const marke = k => `<button class="sim-btn" id="_k6c-b-${k}" onclick="_k6cMarke('${k}')">${_k6cAUFSCHRIFT[k]}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Ist 123 durch 3 teilbar?</h3>
    <div class="fpm-note" style="margin-top:2px">Platten und Stangen zerfallen in <span id="_k6c-note-g">Dreier</span>. Einzelne Würfel kommen nach unten.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_k6c-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_k6cREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_k6c-plus" onclick="_k6cPlus()">+&nbsp;1 Würfel</button>
          <button class="sim-btn" id="_k6c-wechsel" onclick="_k6cGruppen()">Gruppen: <span id="_k6c-wechsel-an">Dreier</span></button>
          <button class="sim-btn" id="_k6c-nochmal" onclick="_k6cNochmal()">noch einmal</button>
          <button class="sim-btn" id="_k6c-neu" onclick="_k6cNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_k6c-pause" onclick="_k6cAnhalten()">Pause</button>
            <button class="sim-btn" id="_k6c-tempo" onclick="_k6cTempo()">Tempo: <span id="_k6c-tempo-an">normal</span></button>
            <button class="sim-btn" id="_k6c-halt" onclick="_k6cHaltSchalter()">Halt vor dem letzten Schritt: <span id="_k6c-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_k6c-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_k6c-zahl" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6c-material" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6c-gruppe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6c-faecher" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6c-einzeln" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6c-rest" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6c-gruppen" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_k6c-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 123 in der Tafel, noch nichts gebildet</p>
  </div>`;
}

// Was die Anzeige gerade sagt – sie folgt dem Bild (Zeitpunkte im Drehbuch).
function _k6cTexte() {
  const z = _k6c, P = z.lauf.plan, R = P.R, at = z.lauf.at, F = _k6cFARBE;
  const farbig = (art, s) => '<b style="color:' + F[art].rand + '">' + s + '</b>';
  const fach = art => {
    const n = P.fach[art].filter(t => t <= at).length;
    return (n === 0 && at < P.fachFertig[art]) ? '…' : String(n);
  };
  const lauf = P.modus === 'lauf';
  return {
    zahl: 'Zahl in der Tafel: ' + P.zahl,
    material: 'Material: ' + farbig('H', _k6cAnz(R.H, 'Platte', 'Platten')) + ', ' +
              farbig('Z', _k6cAnz(R.Z, 'Stange', 'Stangen')) + ', ' + farbig('E', R.E + ' Würfel'),
    gruppe: 'Gebildet werden: ' + _k6cGNAME[P.g],
    faecher: 'Einzeln aus ' + farbig('H', 'H: ' + fach('H')) + ', aus ' + farbig('Z', 'Z: ' + fach('Z')) +
             ', aus ' + farbig('E', 'E: ' + fach('E')),
    einzeln: 'Übrige einzelne Würfel: ' + (lauf && at >= P.tEinzeln ? R.einzeln : '…'),
    rest: 'Rest am Ende: ' + (lauf && at >= P.tEnde ? R.rest + ' Würfel' : 'noch offen'),
    gruppen: 'Gebildete ' + _k6cGNAME[P.g] + ' zusammen: ' + P.gruppen.filter(G => G.tLand <= at).length
  };
}
function _k6cHinweis() {
  const z = _k6c;
  const kopf = z.haltInfo ? 'Halt: Die einzelnen Würfel liegen in den Fächern. Frage: Wie viele? Woher? Dann „weiter“.'
    : z.steht ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : 'Für die Lehrkraft: „Pause“ hält alles an. „Halt vor dem letzten Schritt“ stoppt von selbst.';
  return kopf + ' Halt: ' + (z.haltAn ? 'an' : 'aus') + ', Tempo: ' + (z.langsam ? 'langsam' : 'normal') + '.';
}
function _k6cSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Schreibt die Anzeige, wenn sich etwas geaendert hat (immer = true: auf jeden Fall).
function _k6cStatus(immer) {
  if (!_k6c) return;
  const z = _k6c, T = _k6cTexte();
  const sig = JSON.stringify(T) + '|' + z.steht + '|' + z.haltInfo + '|' + z.haltAn + '|' + z.langsam + '|' + z.grenze;
  if (!immer && sig === z.sig) return;
  z.sig = sig;
  _k6cSetze('_k6c-zahl', T.zahl);
  _k6cSetze('_k6c-material', T.material);
  _k6cSetze('_k6c-gruppe', T.gruppe);
  _k6cSetze('_k6c-faecher', T.faecher);
  _k6cSetze('_k6c-einzeln', T.einzeln);
  _k6cSetze('_k6c-rest', T.rest);
  _k6cSetze('_k6c-gruppen', T.gruppen);
  const gz = _k6cSetze('_k6c-grenze', z.grenze);
  if (gz && gz.style) gz.style.display = z.grenze ? '' : 'none';
  _k6cSetze('_k6c-wechsel-an', _k6cGNAME[z.g]);
  _k6cSetze('_k6c-note-g', _k6cGNAME[z.g]);
  for (const k of _k6cREIHE) {
    const b = document.getElementById('_k6c-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', _k6cMARKEN[k][0] === z.zahl && _k6cMARKEN[k][1] === z.g);
  }
  // fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _k6cSetze('_k6c-pause', z.steht ? 'weiter' : 'Pause');
  _k6cSetze('_k6c-tempo-an', z.langsam ? 'langsam' : 'normal');
  _k6cSetze('_k6c-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _k6cSetze('_k6c-lehrkraft', _k6cHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.steht ? 'off' : 'on');
  for (const [id, an] of [['_k6c-pause', z.steht], ['_k6c-tempo', z.langsam], ['_k6c-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _k6cMarke(k) {
  if (!_k6c || !_k6cMARKEN[k]) return;
  _k6cStarte(_k6cMARKEN[k][0], _k6cMARKEN[k][1], 'lauf', -1);
  _k6cStatus(true);
}
function _k6cPlus() {
  if (!_k6c) return;
  const z = _k6c, e = z.zahl % 10;
  if (e >= 9) {                                            // Grenze: die Karte E wackelt
    z.grenze = 'Die Einerstelle ist voll.'; z.wackel = 0.45;
    _k6cStatus(true);
    return;
  }
  _k6cStarte(z.zahl + 1, z.g, 'lauf', e);
  _k6cStatus(true);
}
function _k6cGruppen() {
  if (!_k6c) return;
  _k6cStarte(_k6c.zahl, _k6c.g === 3 ? 9 : 3, 'lauf', -1);
  _k6cStatus(true);
}
function _k6cNochmal() {
  if (!_k6c) return;
  _k6cStarte(_k6c.zahl, _k6c.g, 'lauf', -1);
  _k6cStatus(true);
}
function _k6cNeu() {
  if (!_k6c) return;
  _k6cStarte(_k6cSTART[0], _k6cSTART[1], 'start', -1);
  _k6cStatus(true);
}
// ── Für die Lehrkraft ───────────────────────────────────────────────────
function _k6cAnhalten() {
  const z = _k6c;
  if (!z) return;
  z.steht = !z.steht;
  z.haltInfo = false;                      // „weiter“ nach dem Halt: die Wuerfel ruecken zusammen
  _k6cStatus(true);
}
function _k6cHaltSchalter() {
  const z = _k6c;
  if (!z) return;
  z.haltAn = !z.haltAn;                    // gilt fuer den naechsten letzten Schritt
  _k6cStatus(true);
}
function _k6cTempo() {
  const z = _k6c;
  if (!z) return;
  z.langsam = !z.langsam;
  _k6cStatus(true);
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _k6cUpdate(dt) {
  if (!_k6c) return;
  const z = _k6c, K = _k6cK;
  const roh = _bioFxDt(dt);
  z.wackel = Math.max(0, z.wackel - roh);                // Wackeln an der Grenze: echte Zeit
  for (let i = z.weg.length - 1; i >= 0; i--) {          // altes Material faellt weg
    const p = z.weg[i];
    p.a -= roh / K.T_WEG; p.y += 30 * roh;
    if (p.a <= 0) z.weg.splice(i, 1);
  }
  // EIN Zeitfaktor fuer jede Bewegung. Angehalten: nichts laeuft weiter.
  if (z.steht) return;
  dt = roh * (z.langsam ? K.LANGSAM : 1);
  if (!(dt > 0)) return;
  z.t += dt;
  const L = z.lauf, P = L.plan;
  let neu = L.at + dt, halt = false;
  if (z.haltAn && L.at < P.halt && neu >= P.halt) { neu = P.halt; halt = true; }
  for (const r of P.ringe) if (L.at < r.t && neu >= r.t) _bioFxWelle(z.fx, r.x, r.y, '#f59e0b', r.r);
  L.at = neu;
  if (halt) { z.steht = true; z.haltInfo = true; }
  _bioFxUpdate(z.fx, dt);
  _k6cStatus(halt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _k6cText(ctx, s, x, y, groesse, farbe, gew, ausr) {
  ctx.fillStyle = farbe || _k6cDUNKEL;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function _k6cAktiv(b, at) { return at >= b.t0 && at < b.t1; }
function _k6cPanel(ctx, x0, y0, x1, y1, fuell) {
  ctx.fillStyle = 'rgba(15,23,42,0.07)';
  _bioFxRundRect(ctx, x0 + 1.5, y0 + 2, x1 - x0, y1 - y0, 8); ctx.fill();
  ctx.fillStyle = fuell || '#ffffff';
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 8); ctx.fill();
}

function _k6cTafel(ctx) {
  const z = _k6c, K = _k6cK, P = z.lauf.plan, R = P.R, at = z.lauf.at;
  _k6cPanel(ctx, K.TX0, K.TY0, K.TX1, K.TY1);
  // die Spalte, die gerade dran ist: gelb
  for (const b of P.baender) {
    if (b.art === 'R' || !_k6cAktiv(b, at)) continue;
    const [a, e] = K.SP[b.art];
    ctx.save();
    ctx.globalAlpha = Math.min(1, (at - b.t0) / 0.2, (b.t1 - at) / 0.2);
    ctx.fillStyle = 'rgba(253,224,71,0.30)';
    _bioFxRundRect(ctx, a + 3, K.MY0, e - a - 6, K.MY1 - K.MY0, 6); ctx.fill();
    ctx.restore();
  }
  for (const art of _k6cSP) {
    const [a, b] = K.SP[art], cx = (a + b) / 2, F = _k6cFARBE[art];
    // Kopf wie die Stellenwerttafel: Buchstabe, darunter das Wort
    ctx.fillStyle = F.grund;
    _bioFxRundRect(ctx, a + 4, K.KY0, b - a - 8, K.KY1 - K.KY0, 6); ctx.fill();
    _k6cText(ctx, art, cx, K.KY0 + 14, 15, F.rand);
    _k6cText(ctx, _k6cWORT[art], cx, K.KY1 - 3, 11, '#334155', '600');
    // Ziffernkarte (eine leere vordere Stelle: leere, gestrichelte Karte)
    const dx = art === 'E' && z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0;
    const leer = art === 'H' && R.H === 0;
    ctx.save();
    ctx.fillStyle = leer ? '#f8fafc' : '#ffffff';
    ctx.strokeStyle = leer ? '#94a3b8' : F.rand; ctx.lineWidth = leer ? 1.2 : 1.6;
    if (leer) ctx.setLineDash([3, 3]);
    _bioFxRundRect(ctx, cx - 17 + dx, K.ZY0, 34, K.ZY1 - K.ZY0, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
    if (!leer) _k6cText(ctx, String(R[art]), cx + dx, K.ZY1 - 6, 20, F.rand);
  }
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.2;
  for (const art of ['Z', 'E']) {
    const x = K.SP[art][0];
    ctx.beginPath(); ctx.moveTo(x, K.TY0 + 3); ctx.lineTo(x, K.TY1 - 3); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.TX0, K.TY0, K.TX1 - K.TX0, K.TY1 - K.TY0, 8); ctx.stroke();
}

function _k6cFaecher(ctx) {
  const K = _k6cK;
  for (const art of _k6cSP) {
    const [a, b] = K.FACH[art], F = _k6cFARBE[art];
    ctx.fillStyle = 'rgba(15,23,42,0.06)';
    _bioFxRundRect(ctx, a + 1.5, K.FY0 + 2, b - a, K.FY1 - K.FY0, 7); ctx.fill();
    ctx.fillStyle = F.grund;
    _bioFxRundRect(ctx, a, K.FY0, b - a, K.FY1 - K.FY0, 7); ctx.fill();
    ctx.save(); ctx.globalAlpha = 0.6; ctx.strokeStyle = F.rand; ctx.lineWidth = 1.2;
    _bioFxRundRect(ctx, a, K.FY0, b - a, K.FY1 - K.FY0, 7); ctx.stroke(); ctx.restore();
    _k6cText(ctx, 'aus ' + art, a + 7, K.FY1 - 7, 11, F.rand, '700', 'left');
  }
}

function _k6cAblageBild(ctx) {
  const z = _k6c, K = _k6cK, P = z.lauf.plan, at = z.lauf.at;
  _k6cPanel(ctx, K.AX0, K.AY0, K.AX1, K.AY1);
  // Ueberschrift mit einem kleinen grauen Musterblock
  const titel = _k6cGNAME[P.g];
  _k6cText(ctx, titel, K.AX + 1, K.AY0 + 19, 14, _k6cDUNKEL, '700', 'left');
  ctx.font = '700 14px sans-serif';
  const mx = K.AX + 1 + ctx.measureText(titel).width + 9, ms = 4.6;
  ctx.save();
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 0.8;
  for (let i = 0; i < P.g; i++) {
    const x = mx + (P.g === 3 ? i : i % 3) * ms, y = (P.g === 3 ? K.AY0 + 12 : K.AY0 + 8) + (P.g === 3 ? 0 : Math.floor(i / 3) * ms);
    ctx.fillRect(x, y, ms, ms); ctx.strokeRect(x, y, ms, ms);
  }
  ctx.restore();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.AX0, K.AY0, K.AX1 - K.AX0, K.AY1 - K.AY0, 8); ctx.stroke();
  // Kasten „Rest am Ende“ (waehrend des letzten Schritts gelb hinterlegt)
  _k6cPanel(ctx, K.RX0, K.RY0, K.RX1, K.RY1);
  for (const b of P.baender) {
    if (b.art !== 'R' || !_k6cAktiv(b, at)) continue;
    ctx.save();
    ctx.globalAlpha = Math.min(1, (at - b.t0) / 0.2, (b.t1 - at) / 0.2);
    ctx.fillStyle = 'rgba(253,224,71,0.26)';
    _bioFxRundRect(ctx, K.RX0 + 3, K.RY0 + 3, K.RX1 - K.RX0 - 6, K.RY1 - K.RY0 - 6, 6); ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.RX0, K.RY0, K.RX1 - K.RX0, K.RY1 - K.RY0, 8); ctx.stroke();
  _k6cText(ctx, 'Rest am Ende', K.RX0 + 8, K.RY1 - 7, 11, '#9a3412', '700', 'left');
}

// Ein Wuerfel. heil = Teil einer ganzen Platte/Stange (feine Linien statt Rand).
function _k6cWuerfel(ctx, x, y, s, art, a, heil) {
  if (a <= 0.01 || s <= 0.3) return;
  const F = _k6cFARBE[art];
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = F.fuell; ctx.strokeStyle = heil ? F.linie : F.rand;
  ctx.lineWidth = s < 5 ? 0.55 : heil ? 0.6 : 0.8;
  if (heil) { ctx.fillRect(x, y, s, s); ctx.strokeRect(x, y, s, s); }
  else { _bioFxRundRect(ctx, x, y, s, s, Math.min(1.2, s / 4)); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
// Rahmen um eine Menge von Orten
function _k6cHuelle(orte, rand) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const o of orte) { x0 = Math.min(x0, o.x); y0 = Math.min(y0, o.y); x1 = Math.max(x1, o.x + o.s); y1 = Math.max(y1, o.y + o.s); }
  return { x: x0 - rand, y: y0 - rand, b: x1 - x0 + 2 * rand, h: y1 - y0 + 2 * rand };
}

function _k6cWuerfelBild(ctx) {
  const z = _k6c, K = _k6cK, P = z.lauf.plan, at = z.lauf.at;
  const orte = new Map(), liegt = [], fliegt = [];
  for (const w of P.wuerfel) {
    const o = _k6cOrt(w, at);
    if (!o) continue;
    o.w = w; orte.set(w, o);
    (o.fliegt ? fliegt : liegt).push(o);
  }
  const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 1.1);
  // in den Faechern bleibt ein gestrichelter Umriss: woher die Wuerfel kamen
  for (const w of P.wuerfel) {
    if (!w.fachOrt || at < w.tSammel + 0.12) continue;
    const o = w.fachOrt, F = _k6cFARBE[w.art];
    ctx.save();
    ctx.globalAlpha = 0.75 * Math.min(1, (at - w.tSammel - 0.12) / 0.3);
    ctx.strokeStyle = F.rand; ctx.lineWidth = 0.9; ctx.setLineDash([1.6, 1.4]);
    ctx.strokeRect(o.x + 0.5, o.y + 0.5, o.s - 1, o.s - 1);
    ctx.restore();
  }
  // gelbes Leuchten hinter dem Wuerfel, der uebrig bleibt (und dem neuen Einer)
  for (const o of liegt.concat(fliegt)) {
    const h = o.w.halo;
    if (!h || at < h[0] || at >= h[1]) continue;
    ctx.save();
    ctx.globalAlpha = Math.min(1, (at - h[0]) / 0.12, (h[1] - at) / 0.2) * (0.65 + 0.35 * puls);
    ctx.fillStyle = 'rgba(253,224,71,0.9)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, o.x - 3.5, o.y - 3.5, o.s + 7, o.s + 7, 3.5); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // Rest am Ende: was uebrig bleibt, leuchtet orange
  const restOrte = at >= P.tEnde ? P.wuerfel.filter(w => w.rest).map(w => orte.get(w)).filter(Boolean) : [];
  if (restOrte.length) {
    const h = _k6cHuelle(restOrte, 3.5);
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.35 * puls; ctx.fillStyle = '#fdba74';
    _bioFxRundRect(ctx, h.x, h.y, h.b, h.h, 4); ctx.fill();
    ctx.restore();
  }
  // was liegt
  for (const o of liegt) {
    const teil = o.w.teil;
    _k6cWuerfel(ctx, o.x, o.y, o.s, o.w.art, o.a, !!teil && at < teil.tSpreiz);
  }
  // ganze Platte / Stange: Rand und Fuenferlinien, solange sie heil ist
  for (const teil of P.teile) {
    const u = at < teil.tSpreiz ? 0 : (at - teil.tSpreiz) / teil.dSpreiz;
    if (u >= 1) continue;
    const o = orte.get(teil.w[0]);
    if (!o) continue;
    const F = _k6cFARBE[teil.art];
    ctx.save();
    ctx.globalAlpha = o.a * (1 - u);
    ctx.strokeStyle = F.rand;
    if (teil.art === 'H') {
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(o.x + 30, o.y); ctx.lineTo(o.x + 30, o.y + 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(o.x, o.y + 30); ctx.lineTo(o.x + 60, o.y + 30); ctx.stroke();
      ctx.lineWidth = 1.2; ctx.strokeRect(o.x, o.y, 60, 60);
    } else {
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(o.x, o.y + 30); ctx.lineTo(o.x + K.W, o.y + 30); ctx.stroke();
      ctx.lineWidth = 0.9; ctx.strokeRect(o.x, o.y, K.W, 60);
    }
    ctx.restore();
  }
  // fertige Gruppen in der Ablage: duenner dunkler Umriss je Block
  ctx.save();
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 0.8;
  for (const G of P.gruppen) {
    if (at < G.tLand) continue;
    const B = _k6cAblageBlock(G.slot, P.g);
    ctx.globalAlpha = Math.min(1, (at - G.tLand) / 0.15);
    _bioFxRundRect(ctx, B.x - 0.4, B.y - 0.4, B.b + 0.8, B.h + 0.8, 1.2); ctx.stroke();
  }
  ctx.restore();
  // Rest am Ende: oranger Rand (pulsiert)
  if (restOrte.length) {
    const h = _k6cHuelle(restOrte, 3.5);
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.45 * puls; ctx.strokeStyle = _k6cORANGE; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, h.x, h.y, h.b, h.h, 4); ctx.stroke();
    ctx.restore();
  }
  // was fliegt, liegt obenauf
  for (const o of fliegt) _k6cWuerfel(ctx, o.x, o.y, o.s, o.w.art, o.a, false);
  // Rahmen um jede Gruppe: vom Umrahmen bis kurz nach der Landung
  for (const G of P.gruppen) {
    if (at < G.tRahmen || at > G.tLand + 0.15) continue;
    const os = G.w.map(w => orte.get(w)).filter(Boolean);
    if (!os.length) continue;
    const h = _k6cHuelle(os, 0.8);
    ctx.save();
    ctx.globalAlpha = Math.min(1, (at - G.tRahmen) / 0.12, at > G.tLand ? 1 - (at - G.tLand) / 0.15 : 1);
    ctx.strokeStyle = '#c2410c'; ctx.lineWidth = 1.2;
    _bioFxRundRect(ctx, h.x, h.y, h.b, h.h, 2); ctx.stroke();
    ctx.restore();
  }
  // altes Material faellt weg
  for (const p of z.weg) _k6cWuerfel(ctx, p.x, p.y, p.s, p.art, p.a, false);
}

// Fuer die Lehrkraft: beim Halt die drei Faecher dick orange umrandet; waehrend
// jeder Pause das Schild „Pause“ oben rechts in der Ablage (dort steht nie etwas).
function _k6cLehrkraftBild(ctx) {
  const z = _k6c, K = _k6cK;
  if (z.haltInfo) {
    ctx.save();
    ctx.strokeStyle = _k6cORANGE; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, K.FACH.H[0] - 3, K.FY0 - 2, K.FACH.E[1] - K.FACH.H[0] + 6, K.FY1 - K.FY0 + 3, 9); ctx.stroke();
    ctx.restore();
  }
  if (z.steht) {
    const x = 354, y = 8, w = 56, h = 18;
    ctx.save();
    ctx.fillStyle = '#1e293b';
    _bioFxRundRect(ctx, x, y, w, h, 5); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 5, y + 4, 2.8, 10); ctx.fillRect(x + 10, y + 4, 2.8, 10);   // Pausezeichen
    _k6cText(ctx, 'Pause', x + 17, y + 13.5, 11, '#ffffff', '700', 'left');
    ctx.restore();
  }
}

function _k6cDraw(ctx, cv) {
  if (!_k6c) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _k6cTafel(ctx);
  _k6cFaecher(ctx);
  _k6cAblageBild(ctx);
  _k6cWuerfelBild(ctx);
  _bioFxDraw(ctx, _k6c.fx);
  _k6cLehrkraftBild(ctx);
}
