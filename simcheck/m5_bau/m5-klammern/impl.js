

// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mr2 „Wohin gehört die Klammer?“ (Kennung m5-klammern)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL5_PROFIL.md, Abschnitt m5-klammern
// (Einheit mr2; Regeln N1–N3, Lehrkraft-Zeile, V7 Abspieldauer).
// Ueberschrift: „Ändert die Klammer das Ergebnis?“ (die `frage` der Einheit
// nennt Leni – Regel 11: keine Namen am Bildschirm).
//
// Was man sieht (Leinwand 420 x 250, drei weisse Karten):
//   OBEN die Rechnung gross (22 px), die Klammer als zwei ORANGE Boegen
//   (gezeichnet, keine Schriftzeichen). Jede Zahl in ihrer Farbe.
//   LINKS der Rechenbaum mit der Ueberschrift „Rechenbaum“: drei Zahlkarten
//   oben, darunter zwei Rechenkreise mit ihrem Zeichen, unter jedem Kreis ein
//   Kasten fuer sein Ergebnis. Der Teil in der Klammer ist orange (gestrichelt)
//   umrandet und haengt hoeher (Kreis 1 bei y = 128, Kreis 2 bei y = 200).
//   RECHTS das Geld, 1-€-Muenzen in Zehnerreihen mit Fuenferluecke:
//     Plus  – drei Muenzhaufen in den Farben ihrer Zahl (Rand und Kern der
//             Muenze in der Zahlfarbe, Mitte gold), links daneben der Betrag;
//             darunter eine leere Ablage, in der die Haufen zusammenkommen.
//     Minus – eine offene Geldboerse mit 20 Muenzen (gold/silber), links ein
//             Schild mit dem Betrag in der Boerse; darunter zwei graue
//             Preis-Haufen aus Umrissmuenzen: Heft (Symbol) 8 €, Stift
//             (Symbol) 2 €.
// Farben (gelten auch fuer m5-reihenfolge, „gleiche Farben“ im Bauplan):
//   Klammer orange #ea580c · Plus-Zahlen blau #1d4ed8, gruen #15803d,
//   violett #7e22ce · Geld in der Boerse bernstein #b45309 · Preise schiefer
//   #475569 · Zwischen- und Endergebnis dunkel #0f172a · Leuchten bernstein.
//
// Bewegung (eine Sprungmarke spielt SELBST ab, N1; anhalten kann die
// Lehrkraft). Alles ist eine Funktion der Ablaufzeit L.at (_m6bZeiten,
// _m6bPlan): keine Zufallszahl, jede Zahl im Bild kommt aus _m6bRechne.
//   Vorlauf     das alte Bild blendet aus (0,15 s). Bei „Klammer verschieben“
//               springen statt dessen die Boegen in einem flachen Bogen UEBER
//               die Zahlen an die andere Stelle (0,6 s, dabei halb so gross –
//               sie kreuzen keine Ziffer), die Zahlen ruecken mit, das alte
//               Bild blendet in denselben 0,6 s aus.
//   Aufbau 0,4 s  Zahlkarten springen auf, Kreise, Kaesten, Aeste und die
//               orange Umrandung blenden ein; die Muenzen springen gestaffelt
//               auf (Haufen bzw. Boerse), Preis-Haufen und Schilder erscheinen
//   Schritt 1 0,8 s  Kreis 1 leuchtet, seine Aeste werden bernstein, seine
//               beiden Zahlen gleiten an IHREM Ast herunter und halten am
//               Kreisrand an (0,05–0,45 s; so stossen sie nie zusammen), das
//               Zwischenergebnis springt bei 0,7 s in Kasten 1. Gleichzeitig:
//                 Plus  – die beiden Haufen gleiten als Ganzes in die Ablage
//                         (0,45 s, angehoben mit Schatten; der untere faehrt
//                         0,1 s frueher los, in jedem Haufen fuehrt die untere
//                         Reihe) und legen sich in Zehnerreihen um – jede Muenze
//                         behaelt die Farbe ihrer Zahl. Bei „(27 € + 18 €) + 2 €“
//                         wird der 27er dabei UEBER den liegenden 2er getragen
//                         (im Hochformat nicht zu vermeiden, liest sich als
//                         „hinuebertragen“);
//                 „(20 € − 8 €) + 2 €“ – 8 Muenzen fliegen aus der Boerse auf
//                         den Heft-Haufen;
//                 „20 € − (8 € + 2 €)“ – der Stift-Haufen gleitet zum Heft-
//                         Haufen (der Stift legt sich auf das Heft), die
//                         Schilder werden EIN Schild „10 €“.
//   Pause 0,2 s
//   Schritt 2 0,8 s  Kreis 2 leuchtet, Kasten-1-Wert und dritte Zahl gleiten
//               herunter, das Ergebnis springt in Kasten 2. Gleichzeitig:
//                 Plus  – der dritte Haufen gleitet in die Ablage;
//                 „(20 € − 8 €) + 2 €“ – 2 Muenzen fliegen von rechts aussen IN
//                         die Boerse (der Stift-Haufen bleibt leer: unbezahlt);
//                 „20 € − (8 € + 2 €)“ – 10 Muenzen fliegen auf den vereinten
//                         Preis-Haufen.
//   Gemessen (Frames zu 16 ms, Tempo normal): Sprungmarke, „noch einmal“
//   2,35 s = 147 Frames (letzte Zahl steht nach 141); „Klammer verschieben“
//   2,80 s = 175 Frames (letzte Zahl nach 169). simfakten.js mit
//   --frames=45 --verlauf=4 liest bis Frame 180. Ziel ≤ 3 s je Sprungmarke.
// Wer waehrend eines Ablaufs einen Knopf drueckt, laesst ihn sofort ankommen
// (das alte Bild wird im Endstand ausgeblendet); dann beginnt das Neue. Jede
// Knopffolge ergibt so dieselben Zahlen.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6bMarke('k1') …):
//     „(27 € + 18 €) + 2 €“ · „27 € + (18 € + 2 €)“ ·
//     „(20 € − 8 €) + 2 €“ · „20 € − (8 € + 2 €)“
//   Reihe 2: „Klammer verschieben“ (_m6bSchieben(): dieselben drei Zahlen,
//     Klammer an der anderen Stelle, spielt ab: k1 ↔ k2, k3 ↔ k4) ·
//     „noch einmal“ (_m6bNochmal()) · „neu“ (_m6bNeu(): Start)
//   „Klammer verschieben“ und „noch einmal“ sind blass, solange keine
//   Rechnung gewaehlt ist (dann tun sie nichts).
//
// Statuszeilen (woertlich, alle ≥ 19 Zeichen – simfakten.js):
//   _m6b-rechnung   „Rechnung: 27 € + (18 € + 2 €)“ (Start „Rechnung: noch keine gewählt“)
//   _m6b-schritt1   „Erster Schritt: 18 € + 2 € = 20 €“ (vorher „Erster Schritt: noch nicht gerechnet“)
//   _m6b-schritt2   „Zweiter Schritt: 27 € + 20 € = 47 €“ (vorher „Zweiter Schritt: noch nicht gerechnet“)
//   _m6b-zwischen   „Zwischenergebnis: 20 €“ (vorher „Zwischenergebnis: noch keins“)
//   _m6b-ergebnis   „Ergebnis der Rechnung: 47 €“ (vorher „Ergebnis der Rechnung: noch keins“)
//   _m6b-geld       Plus „Münzen zusammen: 45 €“ (zaehlt die Muenzen in der
//                   Ablage mit; vorher „Münzen zusammen: noch keine“) · Minus
//                   „In der Geldbörse: 10 €“ (zaehlt mit) · Start „Die Geldbörse
//                   ist noch zu.“
//   Schritt- und Ergebniszeilen wechseln in dem Augenblick, in dem die Zahl in
//   ihren Kasten springt. Zwischen Zahl und € steht U+00A0.
//
// Werte (nachgerechnet, simcheck/werte.js):
//   (27 € + 18 €) + 2 €  → 27 € + 18 € = 45 €, 45 € + 2 € = 47 €; Zwischenergebnis 45 €, Münzen zusammen 47 €
//   27 € + (18 € + 2 €)  → 18 € + 2 € = 20 €, 27 € + 20 € = 47 €; 20 €, Münzen zusammen 47 €
//   (20 € − 8 €) + 2 €   → 20 € − 8 € = 12 €, 12 € + 2 € = 14 €; 12 €, In der Geldbörse 14 €
//   20 € − (8 € + 2 €)   → 8 € + 2 € = 10 €, 20 € − 10 € = 10 €; 10 €, In der Geldbörse 10 €
// Start: noch keine Rechnung gewaehlt, Baum leer (drei gestrichelte
// Zahlkarten), Geldboerse zu („Start: noch keine Rechnung gewählt“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): „20 € − (8 € + 2 €)“ direkt nach
// „(20 € − 8 €) + 2 €“ (mit „Klammer verschieben“ oder der Sprungmarke) – wenn
// die 10 Muenzen gelandet sind und die Boerse 10 € zeigt: Lichtring um die
// Boerse, ihr Rand leuchtet 2,4 s bernstein. Die 2 € gehen jetzt mit den 8 €
// hinaus statt zurueck in die Boerse. Einmal je Ablauf.
//
// FUER DIE LEHRKRAFT (Container <div class="fpm-lehrkraft">, simfakten.js
// ueberspringt ihn): eigene Zeile unter den Heftknoepfen, davor klein „Für die
// Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6bAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links (Stelle und Aussehen wie m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6bTempo()): ein Drittel so schnell.
//   „Zwischenergebnis verdecken: aus“ ↔ „… an“ (_m6bVerdecken()): verdeckt
//     Zwischenergebnis, Ergebnis und Geld-Zeile – in den Statuszeilen
//     „verdeckt“ (auch die beiden Schritt-Zeilen, sie enthalten die Ergebnisse),
//     im Bild graue Karten „?“ in den Kaesten, am Ablage- bzw. Boersenschild
//     und am vereinten Preisschild. Rechnung, Baum und Muenzen bleiben
//     sichtbar: zum Vermuten an der Tafel.
//   Eine Sprungmarke, „Klammer verschieben“, „noch einmal“ und „neu“ heben die
//   Pause auf; Tempo und Verdecken bleiben stehen. Das wechselnde Wort steht
//   in einem eigenen <span>. Hinweiszeile _m6b-lehrkraft (in der Pause
//   bernsteinfarben) nennt immer die Einstellung. Voreinstellung: Pause aus,
//   Tempo normal, Verdecken aus (die Hinweiszeile sagt „Verdecken: aus“ – nicht
//   „Zwischenergebnis: …“, das sah aus wie die Anzeige „Zwischenergebnis: 45 €“). EIN Zeitfaktor (_m6bZeitfaktor:
//   0 Pause, 1/3 langsam, 1 normal) am Anfang von _m6bUpdate.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „zuerst“, „zuletzt“,
// „Plus“ und „Minus“ als Woerter, „woanders“, „gleich“, die Regel als Satz
// („Klammer zuerst“). „Klammer“ und „Rechenbaum“ sind erlaubt (hier
// eingefuehrt). Keine Namen, keine Punkte, keine Zeitmessung, kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m6b = null;
const _m6bR = {
  k1: { z: [27, 18, 2], op: ['+', '+'], kl: 'vorn', art: 'plus', partner: 'k2' },
  k2: { z: [27, 18, 2], op: ['+', '+'], kl: 'hinten', art: 'plus', partner: 'k1' },
  k3: { z: [20, 8, 2], op: ['−', '+'], kl: 'vorn', art: 'minus', partner: 'k4' },
  k4: { z: [20, 8, 2], op: ['−', '+'], kl: 'hinten', art: 'minus', partner: 'k3' }
};
const _m6bREIHE = ['k1', 'k2', 'k3', 'k4'];
const _m6bK = {
  // Karten: Rechnung oben, Rechenbaum links, Geld rechts
  TX0: 6, TX1: 414, TY0: 4, TY1: 46,
  BX0: 6, BX1: 204, BY0: 50, BY1: 246,
  GX0: 210, GX1: 414, GY0: 50, GY1: 246,
  // Rechnung: Mitte, Grundlinie, Schriftgrad, Breite eines Klammerbogens, Luft
  RM: 210, RY: 36, RG: 22, KLB: 9, LUFT: 9, LUFTK: 3,
  // Rechenbaum: Titel, Zahlkarten (x, Mitte y, Hoehe, Schrift), Kreise, Kaesten
  TITELX: 16, TITELY: 68,
  BL: [40, 106, 172], LY: 90, LH: 22, LG: 14,
  C1Y: 128, C2Y: 200, KR: 12, KAB: 27, KB: 48, KH: 20, KG: 14,
  // Muenzen: Radius, Abstand in der Reihe, Fuenferluecke, Reihenabstand, erste Spalte
  MR: 4.8, MP: 11, M5: 4, MZ: 11, MX0: 282,
  // Plus: erste Haufenreihe, Abstand der Haufen, Betrag rechtsbuendig bei x
  HY0: 66, HABST: 10, LABX: 268,
  // Minus: Boerse, Muenzreihen in der Boerse, Schild, Heft- und Stift-Reihe
  PX0: 268, PX1: 400, PY0: 64, PY1: 110, PRY: [81, 95],
  TAGX0: 214, TAGX1: 262, TAGY0: 74, TAGY1: 100,
  HEFTY: 148, STIFTY: 190, STIFTZX: 221, STIFTZY: 151, ICONX: 222, PREISX: 250, AUSSEN: [432, 96],
  // Zeiten in s
  T_LEER: 0.15, T_SCHIEB: 0.6, T_AUF: 0.4, T_S: 0.8, T_P: 0.2, T_LOS: 0.05,
  T_GLEIT: 0.45, T_ERG: 0.7, T_FLUG: 0.4, T_STREU: 0.25, T_POP: 0.22, T_AHA: 2.4,
  T_HAUFEN: 0.45, T_WELLE: 0.1, T_REIHE: 0.03,
  LANGSAM: 1 / 3,
  // Farben
  F_KL: '#ea580c', F_TINTE: '#0f172a', F_GRAU: '#64748b', F_GELD: '#b45309', F_PREIS: '#475569',
  F_Z: [['#1d4ed8', '#bfdbfe'], ['#15803d', '#bbf7d0'], ['#7e22ce', '#e9d5ff']]
};

// ── Rechnen ─────────────────────────────────────────────────────────────
function _m6bE(n) { return n + ' €'; }                 // „20 €“ mit geschuetztem Leerzeichen
function _m6bOp(x, op, y) { return op === '+' ? x + y : x - y; }
// Beide Schritte: t1/t2 = [linke Zahl, Zeichen, rechte Zahl], i1/i2 = Nummer der
// Zahl im Term (0–2) oder -1 fuer das Zwischenergebnis.
function _m6bRechne(r) {
  const [a, b, c] = r.z, [o1, o2] = r.op;
  if (r.kl === 'vorn') {
    const s1 = _m6bOp(a, o1, b);
    return { s1, s2: _m6bOp(s1, o2, c), t1: [a, o1, b], i1: [0, 1], t2: [s1, o2, c], i2: [-1, 2] };
  }
  const s1 = _m6bOp(b, o2, c);
  return { s1, s2: _m6bOp(a, o1, s1), t1: [b, o2, c], i1: [1, 2], t2: [a, o1, s1], i2: [0, -1] };
}
// Farbe der i-ten Zahl (-1: Zwischenergebnis)
function _m6bFarbe(r, i) {
  const K = _m6bK;
  if (i < 0) return K.F_TINTE;
  if (r.art === 'plus') return K.F_Z[i][0];
  return i === 0 ? K.F_GELD : K.F_PREIS;
}
// Der Term als Text; f(i, s) faerbt die i-te Zahl (i = -1: Klammer)
function _m6bTerm(r, f) {
  f = f || ((i, s) => s);
  const A = f(0, _m6bE(r.z[0])), B = f(1, _m6bE(r.z[1])), C = f(2, _m6bE(r.z[2]));
  const auf = f(-1, '('), zu = f(-1, ')');
  return r.kl === 'vorn' ? auf + A + ' ' + r.op[0] + ' ' + B + zu + ' ' + r.op[1] + ' ' + C
                         : A + ' ' + r.op[0] + ' ' + auf + B + ' ' + r.op[1] + ' ' + C + zu;
}

// ── Ablauf: alles aus der Ablaufzeit ─────────────────────────────────────
function _m6bZeiten(vor) {
  const K = _m6bK, s1 = vor + K.T_AUF, s2 = s1 + K.T_S + K.T_P;
  return { auf: vor, s1, s2, ende: s2 + K.T_S };
}
// Muenzplatz j in Zehnerreihen mit Fuenferluecke, erste Reihe bei y0
function _m6bPos(y0, j) {
  const K = _m6bK, s = j % 10;
  return { x: K.MX0 + s * K.MP + (s >= 5 ? K.M5 : 0), y: y0 + Math.floor(j / 10) * K.MZ };
}
function _m6bBoersePlatz(j) {
  const p = _m6bPos(0, j % 10);
  return { x: p.x, y: _m6bK.PRY[Math.floor(j / 10)] };
}
// Plus: erste Reihe jedes Haufens und Oberkante der Ablage
function _m6bHaufenY(r) {
  const K = _m6bK, ys = [];
  let y = K.HY0;
  for (const n of r.z) { ys.push(y); y += Math.ceil(n / 10) * K.MZ + K.HABST; }
  return { ys, ablage: y };
}
// Der Plan eines Ablaufs: wo jede Muenze liegt, wann sie losfliegt, wohin.
// Muenze: { von, nach, d (Abflug), pop (erscheint), h (Haufen; -1 = gold/silber),
//           herkunft 'haufen'|'boerse'|'aussen', ziel 'ablage'|'heft'|'boerse' }
function _m6bPlan(key, vor) {
  const K = _m6bK, r = _m6bR[key], T = _m6bZeiten(vor);
  const P = { key, T, art: r.art, muenzen: [], umriss: [] };
  const streu = (tS, i, n) => tS + K.T_LOS + (n > 1 ? i * K.T_STREU / (n - 1) : 0);
  if (r.art === 'plus') {
    const HY = _m6bHaufenY(r);
    P.haufenY = HY.ys; P.ablageY = HY.ablage;
    const schritte = r.kl === 'vorn' ? [[0, 1], [2]] : [[1, 2], [0]];
    let platz = 0;
    // Jeder Haufen gleitet als Ganzes in die Ablage und legt sich dabei in
    // Zehnerreihen um. Der UNTERE Haufen faehrt zuerst los, und in jedem Haufen
    // fuehrt die untere Reihe – sonst schoebe sich Oberes durch Unteres.
    schritte.forEach((hs, si) => {
      const tS = si === 0 ? T.s1 : T.s2, welle = hs.slice().sort((x, y) => y - x);
      for (const h of hs) for (let k = 0; k < r.z[h]; k++) {
        const vorn = Math.ceil(r.z[h] / 10) - 1 - Math.floor(k / 10);   // 0 = unterste Reihe
        P.muenzen.push({ h, herkunft: 'haufen', ziel: 'ablage', von: _m6bPos(HY.ys[h], k),
                         nach: _m6bPos(HY.ablage + 8, platz), f: K.T_HAUFEN,
                         d: tS + K.T_LOS + welle.indexOf(h) * K.T_WELLE + vorn * K.T_REIHE,
                         pop: T.auf + h * 0.06 + k * 0.006, schritt: si + 1 });
        platz++;
      }
    });
    return P;
  }
  // Minus: 20 Muenzen in der Boerse; Heft-Preis z[1], Stift-Preis z[2]
  const G = r.z[0], heft = r.z[1], stift = r.z[2];
  const mz = [];
  for (let j = 0; j < G; j++)
    mz.push({ h: -1, herkunft: 'boerse', von: _m6bBoersePlatz(j), pop: T.auf + 0.05 + j * 0.009 });
  for (let j = 0; j < heft; j++) P.umriss.push({ von: _m6bPos(K.HEFTY, j) });
  for (let j = 0; j < stift; j++) P.umriss.push({ von: _m6bPos(K.STIFTY, j), stift: true });
  if (r.kl === 'vorn') {
    // (20 € − 8 €) + 2 €: 8 Muenzen auf den Heft-Haufen, dann 2 von aussen in die Boerse
    for (let i = 0; i < heft; i++) {
      const m = mz[G - 1 - i];
      m.ziel = 'heft'; m.nach = _m6bPos(K.HEFTY, i); m.d = streu(T.s1, i, heft); m.f = K.T_FLUG; m.schritt = 1;
    }
    for (let i = 0; i < stift; i++)
      mz.push({ h: -1, herkunft: 'aussen', ziel: 'boerse', von: { x: K.AUSSEN[0], y: K.AUSSEN[1] },
                nach: _m6bBoersePlatz(G - heft + i), d: streu(T.s2, i, stift), f: K.T_FLUG, pop: -1, schritt: 2 });
  } else {
    // 20 € − (8 € + 2 €): der Stift-Haufen gleitet zum Heft-Haufen, dann 10 Muenzen hinaus
    P.umriss.forEach((u, j) => { if (u.stift) u.nach = _m6bPos(K.HEFTY, heft + (j - heft)); });
    P.vereint = true;
    const n = heft + stift;
    for (let i = 0; i < n; i++) {
      const m = mz[G - 1 - i];
      m.ziel = 'heft'; m.nach = _m6bPos(K.HEFTY, i); m.d = streu(T.s2, i, n); m.f = K.T_FLUG; m.schritt = 2;
    }
  }
  P.muenzen = mz;
  return P;
}
// Gleitweg des Stift-Haufens (0..1) in Schritt 1 von „20 € − (8 € + 2 €)“
function _m6bVereint(P, at) {
  return _bioFxEase.sanft(_bioFxKlemme((at - P.T.s1 - _m6bK.T_LOS) / 0.55));
}
// Geld zur Ablaufzeit: Plus = Muenzen in der Ablage, Minus = Muenzen in der Boerse
function _m6bGeld(P, at) {
  const K = _m6bK;
  let n = 0;
  for (const m of P.muenzen) {
    if (P.art === 'plus') { if (at >= m.d + m.f) n++; continue; }
    if (m.herkunft === 'boerse' && !(at >= m.d)) n++;            // noch drin (ohne Flug: immer)
    if (m.ziel === 'boerse' && at >= m.d + m.f) n++;             // von aussen hineingeflogen
  }
  return n;
}
// Was die Anzeige gerade zeigt (aendert sich nur an festen Zeitpunkten)
function _m6bStand(z) {
  const L = z.lauf, K = _m6bK;
  if (!L.key) return { e1: false, e2: false, geld: null };
  const T = L.plan.T;
  return { e1: L.at >= T.s1 + K.T_ERG, e2: L.at >= T.s2 + K.T_ERG, geld: _m6bGeld(L.plan, L.at) };
}

// ── Oberflaeche ─────────────────────────────────────────────────────────
function _m6bInit() {
  _m6b = { t: 0, fx: { teile: [] }, stand: '', ahaGlanz: 0,
           lauf: { key: null, alt: undefined, vor: 0, schieb: false, at: 0, plan: null, aha: false },
           pause: false, langsam: false, verdeckt: false };   // Lehrkraft-Einstellungen
}
function _m6bHTML() {
  const marke = k => `<button class="sim-btn" id="_m6b-b-${k}" onclick="_m6bMarke('${k}')">${_m6bTerm(_m6bR[k]).replace(/[  ]/g, '&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Ändert die Klammer das Ergebnis?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle eine Rechnung. Der Rechenbaum zeigt die Reihenfolge.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6b-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6bREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6b-schieben" onclick="_m6bSchieben()">Klammer verschieben</button>
          <button class="sim-btn" id="_m6b-nochmal" onclick="_m6bNochmal()">noch einmal</button>
          <button class="sim-btn" id="_m6b-neu" onclick="_m6bNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6b-pause" onclick="_m6bAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6b-tempo" onclick="_m6bTempo()">Tempo: <span id="_m6b-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6b-verdeckt" onclick="_m6bVerdecken()">Zwischenergebnis verdecken: <span id="_m6b-verdeckt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6b-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6b-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6b-schritt1" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6b-schritt2" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6b-zwischen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6b-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6b-geld" style="margin-top:6px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: noch keine Rechnung gewählt</p>
  </div>`;
}
function _m6bSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6bStatus() {
  if (!_m6b) return;
  const z = _m6b, K = _m6bK, L = z.lauf, r = L.key ? _m6bR[L.key] : null, zu = z.verdeckt;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const st = _m6bStand(z);
  _m6bSetze('_m6b-rechnung', 'Rechnung: ' +
    (r ? _m6bTerm(r, (i, s) => f(s, i < 0 ? K.F_KL : _m6bFarbe(r, i))) : 'noch keine gewählt'));
  let s1 = 'Erster Schritt: noch nicht gerechnet', s2 = 'Zweiter Schritt: noch nicht gerechnet';
  let zw = 'Zwischenergebnis: noch keins', er = 'Ergebnis der Rechnung: noch keins';
  let geld = 'Die Geldbörse ist noch zu.';
  if (r) {
    const R = _m6bRechne(r);
    const zahl = (i, n) => f(_m6bE(n), _m6bFarbe(r, i));
    const schritt = (t, ii, s) => zahl(ii[0], t[0]) + ' ' + t[1] + ' ' + zahl(ii[1], t[2]) + ' = ' + f(_m6bE(s), K.F_TINTE);
    if (st.e1) {
      s1 = 'Erster Schritt: ' + (zu ? 'verdeckt' : schritt(R.t1, R.i1, R.s1));
      zw = 'Zwischenergebnis: ' + (zu ? 'verdeckt' : f(_m6bE(R.s1), K.F_TINTE));
    }
    if (st.e2) {
      s2 = 'Zweiter Schritt: ' + (zu ? 'verdeckt' : schritt(R.t2, R.i2, R.s2));
      er = 'Ergebnis der Rechnung: ' + (zu ? 'verdeckt' : f(_m6bE(R.s2), K.F_TINTE));
    }
    if (r.art === 'plus')
      geld = 'Münzen zusammen: ' + (!st.geld ? 'noch keine' : zu ? 'verdeckt' : f(_m6bE(st.geld), K.F_TINTE));
    else
      geld = 'In der Geldbörse: ' + (zu ? 'verdeckt' : f(_m6bE(st.geld), K.F_GELD));
  }
  _m6bSetze('_m6b-schritt1', s1);
  _m6bSetze('_m6b-schritt2', s2);
  _m6bSetze('_m6b-zwischen', zw);
  _m6bSetze('_m6b-ergebnis', er);
  _m6bSetze('_m6b-geld', geld);
  _m6bREIHE.forEach(k => {
    const b = document.getElementById('_m6b-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === L.key);
  });
  for (const id of ['_m6b-schieben', '_m6b-nochmal']) {
    const b = document.getElementById(id);
    if (b) { b.disabled = !r; if (b.style) b.style.opacity = r ? '' : '0.45'; }
  }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6bSetze('_m6b-pause', z.pause ? 'weiter' : 'Pause');
  _m6bSetze('_m6b-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6bSetze('_m6b-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6bSetze('_m6b-lehrkraft', _m6bHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6b-pause', z.pause], ['_m6b-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6bHinweis() {
  const z = _m6b;
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Verdecken: ' + (z.verdeckt ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Einen neuen Ablauf beginnen. Der alte kommt sofort an (er wird im Endstand
// ausgeblendet). Hebt die Pause auf; Tempo und Verdecken bleiben stehen.
function _m6bStarte(key, schieb) {
  const z = _m6b, K = _m6bK, alt = z.lauf.key;
  const vor = schieb ? K.T_SCHIEB : K.T_LEER;
  z.lauf = { key, alt, vor, schieb: !!schieb, at: 0, plan: key ? _m6bPlan(key, vor) : null, aha: false };
  z.pause = false; z.ahaGlanz = 0; z.fx.teile.length = 0;
  z.stand = '';
  _m6bStatus();
}
function _m6bMarke(key) {
  if (!_m6b || !_m6bR[key]) return;
  _m6bStarte(key, false);
}
function _m6bSchieben() {
  if (!_m6b || !_m6b.lauf.key) return;
  _m6bStarte(_m6bR[_m6b.lauf.key].partner, true);
}
function _m6bNochmal() {
  if (!_m6b || !_m6b.lauf.key) return;
  _m6bStarte(_m6b.lauf.key, false);
}
function _m6bNeu() {
  if (!_m6b) return;
  _m6bStarte(null, false);
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6bAnhalten() {
  if (!_m6b) return;
  _m6b.pause = !_m6b.pause;
  _m6bStatus();
}
function _m6bTempo() {
  if (!_m6b) return;
  _m6b.langsam = !_m6b.langsam;
  _m6bStatus();
}
function _m6bVerdecken() {
  if (!_m6b) return;
  _m6b.verdeckt = !_m6b.verdeckt;
  _m6bStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6bZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6bK.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6bUpdate(dt) {
  if (!_m6b) return;
  const z = _m6b, K = _m6bK, L = z.lauf;
  dt = _bioFxDt(dt) * _m6bZeitfaktor(z);              // ab hier Sim-Zeit
  z.t += dt; L.at += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  if (dt > 0 && L.key === 'k4' && L.alt === 'k3' && !L.aha && L.at >= L.plan.T.s2 + K.T_ERG) {
    // Aha: die 10 Muenzen sind auf dem vereinten Preis-Haufen, die Boerse zeigt 10 €
    L.aha = true; z.ahaGlanz = K.T_AHA;
    _bioFxWelle(z.fx.teile, (K.PX0 + K.PX1) / 2, (K.PY0 + K.PY1) / 2, '#f59e0b', 72);
  }
  const st = _m6bStand(z), s = st.e1 + '|' + st.e2 + '|' + st.geld;
  if (s !== z.stand) { z.stand = s; _m6bStatus(); }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen: Helfer ────────────────────────────────────────────────────
// Jeder Helfer setzt globalAlpha absolut (die Pruef-Leinwand liest nichts zurueck).
function _m6bText(ctx, s, x, y, gr, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m6bK.F_TINTE;
  ctx.font = (gew || '700') + ' ' + gr + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function _m6bKarte(ctx, x0, y0, x1, y1) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(15,23,42,0.07)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 3, x1 - x0, y1 - y0, 8); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 8); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// 1-€-Muenze. h = -1: gold mit silbernem Kern; h = 0..2: Rand und Flaeche in
// der Farbe der Zahl, goldene Mitte (so sieht man in der Ablage, woher sie kommt).
function _m6bMuenze(ctx, x, y, s, h, a) {
  const K = _m6bK, r = K.MR * s;
  if (a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (h < 0) {
    ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e5e7eb'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else {
    ctx.fillStyle = K.F_Z[h][1]; ctx.strokeStyle = K.F_Z[h][0]; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(x, y, r * 0.42, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Umrissmuenze (Preis, noch nicht bezahlt)
function _m6bUmriss(ctx, x, y, a) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.setLineDash([2.2, 1.8]);
  ctx.beginPath(); ctx.arc(x, y, _m6bK.MR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
// Graue Karte „?“ (Zwischenergebnis verdecken)
function _m6bFrage(ctx, x, y, w, h, a) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x - w / 2, y - h / 2, w, h, 5); ctx.fill(); ctx.stroke();
  _m6bText(ctx, '?', x, y + 5, 15, '#475569');
  ctx.restore();
}
// Wert, der beim Erscheinen aufspringt (federt); verdeckt: „?“-Karte
function _m6bWert(ctx, s, x, y, gr, farbe, alter, a, verdeckt, w, h) {
  if (a <= 0.01) return;
  const k = alter < 0.25 ? Math.max(0.3, _bioFxEase.federn(_bioFxKlemme(alter / 0.25))) : 1;
  ctx.save();
  ctx.translate(x, y); ctx.scale(k, k);
  if (verdeckt) { _m6bFrage(ctx, 0, 0, w || 34, h || 18, a); ctx.restore(); return; }
  ctx.globalAlpha = Math.min(1, a);
  _m6bText(ctx, s, 0, gr * 0.36, gr, farbe);
  ctx.restore();
}

// ── Rechnung oben ───────────────────────────────────────────────────────
// Lage aller Teile fuer eine Klammerstelle: Name -> Mitte x
function _m6bTermLage(ctx, r, kl) {
  const K = _m6bK;
  ctx.font = '700 ' + K.RG + 'px sans-serif';
  const txt = { a: _m6bE(r.z[0]), o1: r.op[0], b: _m6bE(r.z[1]), o2: r.op[1], c: _m6bE(r.z[2]) };
  const folge = kl === 'vorn' ? ['(', 'a', 'o1', 'b', ')', 'o2', 'c'] : ['a', 'o1', '(', 'b', 'o2', 'c', ')'];
  const br = folge.map(n => (n === '(' || n === ')') ? K.KLB : ctx.measureText(txt[n]).width);
  const luft = i => (folge[i - 1] === '(' || folge[i] === ')') ? K.LUFTK : K.LUFT;
  let ges = 0;
  folge.forEach((n, i) => { ges += br[i] + (i ? luft(i) : 0); });
  const lage = {};
  let x = K.RM - ges / 2;
  folge.forEach((n, i) => { if (i) x += luft(i); lage[n] = x + br[i] / 2; x += br[i]; });
  return { lage, txt };
}
// Ein Klammerbogen, Mitte x; auf = „(“; glanz 0..1 (Schritt 1 laeuft)
// dy: so weit ist der Bogen angehoben, k: Groesse (beides nur beim Verschieben)
function _m6bBogen(ctx, x, auf, a, glanz, dy, k) {
  k = k || 1;
  const K = _m6bK, ym = K.RY - 7.5 - (dy || 0), y0 = ym - 13.5 * k, y1 = ym + 13.5 * k, b = 3.2 * k, s = auf ? 1 : -1;
  ctx.save();
  ctx.lineCap = 'round';
  if (glanz > 0.01) {
    ctx.globalAlpha = Math.min(1, a) * glanz * 0.55;
    ctx.strokeStyle = '#fcd34d'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(x + s * b, y0); ctx.quadraticCurveTo(x - s * b * 2.2, ym, x + s * b, y1); ctx.stroke();
  }
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = K.F_KL; ctx.lineWidth = 2.8;
  ctx.beginPath(); ctx.moveTo(x + s * b, y0); ctx.quadraticCurveTo(x - s * b * 2.2, ym, x + s * b, y1); ctx.stroke();
  ctx.restore();
}
function _m6bTermZeichnen(ctx, r, lage, a, glanz, sprung) {
  if (a <= 0.01) return;
  const K = _m6bK, { txt } = _m6bTermLage(ctx, r, r.kl);
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  const farbe = { a: _m6bFarbe(r, 0), b: _m6bFarbe(r, 1), c: _m6bFarbe(r, 2), o1: K.F_TINTE, o2: K.F_TINTE };
  for (const n of ['a', 'o1', 'b', 'o2', 'c']) _m6bText(ctx, txt[n], lage[n], K.RY, K.RG, farbe[n]);
  ctx.restore();
  const dy = sprung ? 17 * sprung : 0, k = sprung ? 1 - 0.5 * sprung : 1;
  _m6bBogen(ctx, lage['('], true, a, glanz, dy, k);
  _m6bBogen(ctx, lage[')'], false, a, glanz, dy, k);
}
function _m6bRechnungOben(ctx) {
  const z = _m6b, K = _m6bK, L = z.lauf, at = L.at, kl = _bioFxKlemme;
  const r = L.key ? _m6bR[L.key] : null;
  const glanz = r ? _m6bHuelle(at - L.plan.T.s1) : 0;
  if (L.schieb && r) {
    // „Klammer verschieben“: die Boegen springen in einem flachen Bogen UEBER die
    // Zahlen an die neue Stelle (kleiner werdend), die Zahlen ruecken mit.
    const u = _bioFxEase.sanft(kl(at / K.T_SCHIEB));
    const alt = _m6bTermLage(ctx, _m6bR[L.alt], _m6bR[L.alt].kl).lage, neu = _m6bTermLage(ctx, r, r.kl).lage;
    const lage = {};
    for (const n in neu) lage[n] = alt[n] + (neu[n] - alt[n]) * u;
    _m6bTermZeichnen(ctx, r, lage, 1, glanz, Math.sin(Math.PI * u));
    return;
  }
  if (L.alt && at < L.vor) {
    const ra = _m6bR[L.alt];
    _m6bTermZeichnen(ctx, ra, _m6bTermLage(ctx, ra, ra.kl).lage, 1 - at / L.vor, 0);
  }
  if (r && at >= L.vor) _m6bTermZeichnen(ctx, r, _m6bTermLage(ctx, r, r.kl).lage, kl((at - L.vor) / 0.2), glanz);
}
// Leuchtkurve eines Schritts (u = Zeit seit Schrittbeginn): an 0–0,8 s, weich
function _m6bHuelle(u) {
  const K = _m6bK;
  if (u < 0 || u > K.T_S + 0.15) return 0;
  return Math.min(_bioFxKlemme(u / 0.12), _bioFxKlemme((K.T_S + 0.15 - u) / 0.3));
}

// ── Rechenbaum ──────────────────────────────────────────────────────────
function _m6bBaumOrte(r) {
  const K = _m6bK, [xa, xb, xc] = K.BL;
  if (r.kl === 'vorn') {
    const x1 = (xa + xb) / 2;
    return { c1: { x: x1, y: K.C1Y }, c2: { x: (x1 + xc) / 2, y: K.C2Y }, paar: [0, 1], allein: 2,
             op1: r.op[0], op2: r.op[1], rand: [xa - 26, xb + 26] };
  }
  const x1 = (xb + xc) / 2;
  return { c1: { x: x1, y: K.C1Y }, c2: { x: (xa + x1) / 2, y: K.C2Y }, paar: [1, 2], allein: 0,
           op1: r.op[1], op2: r.op[0], rand: [xb - 26, xc + 26] };
}
function _m6bZahlkarte(ctx, s, x, y, farbe, k, a, leer) {
  const K = _m6bK;
  if (a <= 0.01 || k <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.translate(x, y); ctx.scale(k, k);
  ctx.font = '700 ' + K.LG + 'px sans-serif';
  const w = leer ? 40 : ctx.measureText(s).width + 14;
  ctx.fillStyle = leer ? '#f8fafc' : '#ffffff'; ctx.strokeStyle = leer ? '#cbd5e1' : farbe; ctx.lineWidth = 1.6;
  if (leer) ctx.setLineDash([3, 3]);
  _bioFxRundRect(ctx, -w / 2, -K.LH / 2, w, K.LH, 6); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  if (!leer) _m6bText(ctx, s, 0, K.LG * 0.36, K.LG, farbe);
  ctx.restore();
}
function _m6bAst(ctx, p, q, a, aktiv) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.lineCap = 'round';
  if (aktiv > 0.01) {
    ctx.globalAlpha = Math.min(1, a) * aktiv;
    ctx.strokeStyle = '#fcd34d'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  }
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = aktiv > 0.5 ? '#d97706' : '#94a3b8'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  ctx.restore();
}
function _m6bKreis(ctx, c, op, a, glanz) {
  const z = _m6b, K = _m6bK;
  if (a <= 0.01) return;
  if (glanz > 0.01) {
    ctx.save(); ctx.globalAlpha = Math.min(1, a) * glanz;
    _bioFxLeuchten(ctx, c.x, c.y, K.KR + 3, z.t, '245,158,11');
    ctx.restore();
  }
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = glanz > 0.3 ? '#fef3c7' : '#ffffff';
  ctx.strokeStyle = glanz > 0.3 ? '#d97706' : '#334155'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(c.x, c.y, K.KR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  _m6bText(ctx, op, c.x, c.y + 6, 17, K.F_TINTE);
  ctx.restore();
}
function _m6bKasten(ctx, x, y, a) {
  const K = _m6bK;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, x - K.KB / 2, y - K.KH / 2, K.KB, K.KH, 4); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Der Rechenbaum eines Ablaufs zur Zeit at, Deckkraft a
function _m6bBaum(ctx, P, at, a) {
  const z = _m6b, K = _m6bK, r = _m6bR[P.key], T = P.T, O = _m6bBaumOrte(r), R = _m6bRechne(r);
  const E = _bioFxEase, kl = _bioFxKlemme, auf = at - T.auf;
  if (auf < 0 || a <= 0.01) return;
  const ein = a * kl(auf / 0.25);
  const u1 = at - T.s1, u2 = at - T.s2, g1 = _m6bHuelle(u1), g2 = _m6bHuelle(u2);
  const blatt = i => ({ x: K.BL[i], y: K.LY });
  const kasten1 = { x: O.c1.x, y: O.c1.y + K.KAB }, kasten2 = { x: O.c2.x, y: O.c2.y + K.KAB };
  // orange Umrandung: der Teil in der Klammer (zwei Zahlkarten, Kreis 1, Kasten 1)
  ctx.save();
  ctx.globalAlpha = ein;
  ctx.fillStyle = 'rgba(255,237,213,' + (0.35 + 0.35 * g1).toFixed(3) + ')';
  ctx.strokeStyle = K.F_KL; ctx.lineWidth = 1.6 + g1; ctx.setLineDash([5, 3]);
  _bioFxRundRect(ctx, O.rand[0], K.LY - 16, O.rand[1] - O.rand[0], kasten1.y + K.KH / 2 + 5 - (K.LY - 16), 10);
  ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  // Aeste (unter Karten, Kreisen und Kaesten)
  const gl = u => (u >= 0 && u <= K.T_GLEIT + 0.1) ? 1 : 0;
  _m6bAst(ctx, blatt(O.paar[0]), O.c1, ein, gl(u1) * g1);
  _m6bAst(ctx, blatt(O.paar[1]), O.c1, ein, gl(u1) * g1);
  _m6bAst(ctx, O.c1, kasten1, ein, 0);
  _m6bAst(ctx, kasten1, O.c2, ein, gl(u2) * g2);
  _m6bAst(ctx, blatt(O.allein), O.c2, ein, gl(u2) * g2);
  _m6bAst(ctx, O.c2, kasten2, ein, 0);
  // Kreise und Kaesten
  _m6bKreis(ctx, O.c1, O.op1, ein, g1);
  _m6bKreis(ctx, O.c2, O.op2, ein, g2);
  _m6bKasten(ctx, kasten1.x, kasten1.y, ein);
  _m6bKasten(ctx, kasten2.x, kasten2.y, ein);
  if (u1 >= K.T_ERG) _m6bWert(ctx, _m6bE(R.s1), kasten1.x, kasten1.y, K.KG, K.F_TINTE, u1 - K.T_ERG, a, z.verdeckt, 40, 16);
  if (u2 >= K.T_ERG) _m6bWert(ctx, _m6bE(R.s2), kasten2.x, kasten2.y, K.KG, K.F_TINTE, u2 - K.T_ERG, a, z.verdeckt, 40, 16);
  // Zahlkarten oben (springen gestaffelt auf)
  for (let i = 0; i < 3; i++) {
    const t = auf - i * 0.06;
    if (t <= 0) continue;
    _m6bZahlkarte(ctx, _m6bE(r.z[i]), K.BL[i], K.LY, _m6bFarbe(r, i), Math.max(0.3, E.federn(kl(t / K.T_POP))), a);
  }
  // gleitende Zahlen: Schritt 1 die beiden Klammerzahlen, Schritt 2 Kasten 1 und die dritte Zahl
  // Jede Zahl gleitet an IHREM Ast herunter und haelt am Kreisrand an (so
  // stossen die beiden Zahlen nie zusammen), dann blendet sie aus.
  const gleiten = (u, quellen, ziel) => {
    const v = (u - K.T_LOS) / (K.T_GLEIT - K.T_LOS);
    if (v < 0 || v > 1) return;
    const e = E.sanft(v), ga = a * (v < 0.8 ? 1 : 1 - (v - 0.8) / 0.2), k = 1 - 0.3 * e;
    for (const q of quellen) {
      const dx = q.p.x - ziel.x, dy = q.p.y - ziel.y, l = Math.hypot(dx, dy) || 1, rr = K.KR + 13;
      const zx = ziel.x + dx / l * rr, zy = ziel.y + dy / l * rr;
      const x = q.p.x + (zx - q.p.x) * e, y = q.p.y + (zy - q.p.y) * e;
      if (q.zu) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); _m6bFrage(ctx, 0, 0, 34, 16, ga); ctx.restore(); continue; }
      ctx.save();
      ctx.globalAlpha = Math.min(1, ga);
      ctx.translate(x, y); ctx.scale(k, k);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      _bioFxRundRect(ctx, -19, -10, 38, 20, 6); ctx.fill();
      _m6bText(ctx, q.s, 0, K.LG * 0.36, K.LG, q.f);
      ctx.restore();
    }
  };
  gleiten(u1, O.paar.map(i => ({ p: blatt(i), s: _m6bE(r.z[i]), f: _m6bFarbe(r, i) })), O.c1);
  const zw = { p: kasten1, s: _m6bE(R.s1), f: K.F_TINTE, zu: z.verdeckt };
  const dritte = { p: blatt(O.allein), s: _m6bE(r.z[O.allein]), f: _m6bFarbe(r, O.allein) };
  gleiten(u2, r.kl === 'vorn' ? [zw, dritte] : [dritte, zw], O.c2);
}
// Start: Baum leer – drei gestrichelte Zahlkarten
function _m6bBaumLeer(ctx, a) {
  const K = _m6bK;
  for (let i = 0; i < 3; i++) _m6bZahlkarte(ctx, '', K.BL[i], K.LY, '#cbd5e1', 1, a, true);
}

// ── Geld ────────────────────────────────────────────────────────────────
// Ort einer Muenze zur Zeit at (im Flug: Bogen nach oben)
// Ablage: gerader Weg, die Muenze ist angehoben (groesser, mit Schatten) –
// so gleitet ein ganzer Haufen sichtbar UEBER das, was schon liegt.
function _m6bMuenzOrt(m, at) {
  if (!(at >= m.d)) return { x: m.von.x, y: m.von.y, fliegt: false, heb: 0 };
  const u = _bioFxKlemme((at - m.d) / m.f);
  if (u >= 1) return { x: m.nach.x, y: m.nach.y, fliegt: false, heb: 0 };
  const e = _bioFxEase.sanft(u), heb = Math.sin(Math.PI * u);
  const hub = m.ziel === 'ablage' ? 0 : m.herkunft === 'aussen' ? 14 : 22;
  return { x: m.von.x + (m.nach.x - m.von.x) * e, y: m.von.y + (m.nach.y - m.von.y) * e - hub * heb,
           fliegt: true, heb };
}
function _m6bSchatten(ctx, o, a) {
  if (o.heb <= 0.01 || a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a) * 0.2 * o.heb;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(o.x + 2, o.y + 3, _m6bK.MR, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function _m6bGeldPlus(ctx, P, at, a) {
  const z = _m6b, K = _m6bK, r = _m6bR[P.key], kl = _bioFxKlemme, auf = at - P.T.auf;
  if (auf < 0 || a <= 0.01) return;
  const ein = a * kl(auf / 0.2);
  // Ablage
  const ay0 = P.ablageY, ay1 = ay0 + 5 * K.MZ + 6;
  ctx.save();
  ctx.globalAlpha = ein;
  ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, K.MX0 - 10, ay0, (K.MX0 + 9 * K.MP + K.M5 + 10) - (K.MX0 - 10), ay1 - ay0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
  // Betraege links der Haufen; ein Betrag blendet aus, wenn sein Haufen leer ist
  r.z.forEach((n, h) => {
    const meine = P.muenzen.filter(m => m.h === h);
    const letzte = Math.max(...meine.map(m => m.d));
    const la = ein * (1 - kl((at - letzte) / 0.25));
    if (la <= 0.01) return;
    const yMitte = P.haufenY[h] + (Math.ceil(n / 10) - 1) * K.MZ / 2;
    ctx.save(); ctx.globalAlpha = la;
    _m6bText(ctx, _m6bE(n), K.LABX, yMitte + 5, 15, K.F_Z[h][0], 'right');
    ctx.restore();
  });
  // Betrag der Ablage: zaehlt die angekommenen Muenzen mit
  const drin = _m6bGeld(P, at);
  if (drin > 0) {
    const letzte = P.muenzen.filter(m => at >= m.d + m.f).reduce((s, m) => Math.max(s, m.d + m.f), 0);
    _m6bWert(ctx, _m6bE(drin), K.LABX - 14, (ay0 + ay1) / 2, 15, K.F_TINTE, at - letzte, a, z.verdeckt, 34, 18);
  }
  // Muenzen: liegende zuerst, fliegende obenauf
  const flug = [];
  for (const m of P.muenzen) {
    if (at < m.pop) continue;
    const k = at - m.pop < K.T_POP ? Math.max(0.3, _bioFxEase.federn((at - m.pop) / K.T_POP)) : 1;
    const o = _m6bMuenzOrt(m, at);
    if (o.fliegt) { flug.push([o, m]); continue; }
    _m6bMuenze(ctx, o.x, o.y, k, m.h, a);
  }
  for (const [o] of flug) _m6bSchatten(ctx, o, a);
  for (const [o, m] of flug) _m6bMuenze(ctx, o.x, o.y, 1 + 0.15 * o.heb, m.h, a);
}
// Geldboerse: offen (Muenzen liegen sichtbar darin) oder zu (Start)
function _m6bBoerse(ctx, offen, a, glanz) {
  const K = _m6bK;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (offen) {
    const w = K.PX1 - K.PX0, h = K.PY1 - K.PY0, xm = (K.PX0 + K.PX1) / 2;
    ctx.fillStyle = 'rgba(15,23,42,0.12)';
    _bioFxRundRect(ctx, K.PX0 + 3, K.PY0 + 4, w, h, 11); ctx.fill();
    ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
    _bioFxRundRect(ctx, K.PX0, K.PY0, w, h, 11); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#7c2d12';
    _bioFxRundRect(ctx, K.PX0 + 5, K.PY0 + 6, w - 10, h - 11, 8); ctx.fill();
    ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;      // Buegel
    _bioFxRundRect(ctx, K.PX0 + 8, K.PY0 - 4, w - 16, 7, 3); ctx.fill(); ctx.stroke();
    for (const s of [-1, 1]) {                                                       // Verschluss offen
      ctx.beginPath(); ctx.arc(xm + s * 9, K.PY0 - 7, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    if (glanz > 0.01) {
      ctx.globalAlpha = Math.min(1, a) * Math.min(1, glanz);
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3.5;
      _bioFxRundRect(ctx, K.PX0 - 3, K.PY0 - 3, w + 6, h + 6, 13); ctx.stroke();
    }
  } else {
    const x0 = 296, y0 = 70, w = 76, h = 46, xm = x0 + w / 2;
    ctx.fillStyle = 'rgba(15,23,42,0.12)';
    _bioFxRundRect(ctx, x0 + 3, y0 + 4, w, h, 12); ctx.fill();
    ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
    _bioFxRundRect(ctx, x0, y0, w, h, 12); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.2;                                // Naht
    ctx.beginPath(); ctx.moveTo(x0 + 8, y0 + 14); ctx.lineTo(x0 + w - 8, y0 + 14); ctx.stroke();
    ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
    _bioFxRundRect(ctx, x0 + 8, y0 - 4, w - 16, 7, 3); ctx.fill(); ctx.stroke();
    for (const s of [-1, 1]) {                                                       // Verschluss zu
      ctx.beginPath(); ctx.arc(xm + s * 3.3, y0 - 7, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  }
  ctx.restore();
}
function _m6bSchild(ctx, x0, y0, x1, y1, a, rand) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = rand; ctx.lineWidth = 1.6;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function _m6bHeftBild(ctx, x, y, a) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = '#dbeafe'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x - 7, y - 9, 14, 18, 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  for (const dy of [-3, 1, 5]) { ctx.beginPath(); ctx.moveTo(x - 3, y + dy); ctx.lineTo(x + 5, y + dy); ctx.stroke(); }
  ctx.fillStyle = '#475569';
  for (const dy of [-6, -1, 4]) { ctx.beginPath(); ctx.arc(x - 7, y + dy, 1.3, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function _m6bStiftBild(ctx, x, y, a) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.translate(x, y); ctx.rotate(-0.6);
  ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.rect(-10, -2.8, 15, 5.6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fde68a';
  ctx.beginPath(); ctx.moveTo(5, -2.8); ctx.lineTo(11, 0); ctx.lineTo(5, 2.8); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.moveTo(9, -0.9); ctx.lineTo(11, 0); ctx.lineTo(9, 0.9); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f9a8d4';
  ctx.beginPath(); ctx.rect(-12.5, -2.8, 2.5, 5.6); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function _m6bGeldMinus(ctx, P, at, a) {
  const z = _m6b, K = _m6bK, r = _m6bR[P.key], kl = _bioFxKlemme, E = _bioFxEase, auf = at - P.T.auf;
  if (auf < 0 || a <= 0.01) return;
  const ein = a * kl(auf / 0.2);
  const glanz = P.key === 'k4' && z.lauf.plan === P ? z.ahaGlanz / K.T_AHA : 0;
  _m6bBoerse(ctx, true, ein, glanz > 0 ? Math.min(1, glanz * 1.5) * (0.65 + 0.35 * Math.sin(z.t * 5)) : 0);
  // Schild links der Boerse: zaehlt die Muenzen in der Boerse mit
  _m6bSchild(ctx, K.TAGX0, K.TAGY0, K.TAGX1, K.TAGY1, ein, K.F_GELD);
  const drin = _m6bGeld(P, at);
  let wechsel = -9;                                   // wann sich die Zahl zuletzt geaendert hat
  for (const m of P.muenzen) {
    if (m.herkunft === 'boerse' && at >= m.d) wechsel = Math.max(wechsel, m.d);
    if (m.ziel === 'boerse' && at >= m.d + m.f) wechsel = Math.max(wechsel, m.d + m.f);
  }
  _m6bWert(ctx, _m6bE(drin), (K.TAGX0 + K.TAGX1) / 2, (K.TAGY0 + K.TAGY1) / 2, 16, K.F_GELD,
           Math.max(0, at - wechsel) * 1.6, ein, z.verdeckt, 34, 18);
  // Preis-Haufen: Heft und Stift (Bild, Preis, Umrissmuenzen)
  const v = P.vereint ? _m6bVereint(P, at) : 0;
  const zusammen = P.vereint && at >= P.T.s1 + K.T_ERG;
  _m6bHeftBild(ctx, K.ICONX, K.HEFTY, ein);
  _m6bStiftBild(ctx, K.ICONX + (K.STIFTZX - K.ICONX) * v, K.STIFTY + (K.STIFTZY - K.STIFTY) * v, ein);
  _m6bSchild(ctx, K.PREISX - 17, K.HEFTY - 11, K.PREISX + 17, K.HEFTY + 11, ein, K.F_PREIS);
  if (zusammen) {
    _m6bWert(ctx, _m6bE(r.z[1] + r.z[2]), K.PREISX, K.HEFTY, 15, K.F_PREIS, at - P.T.s1 - K.T_ERG, ein, z.verdeckt, 30, 18);
  } else {
    _m6bWert(ctx, _m6bE(r.z[1]), K.PREISX, K.HEFTY, 15, K.F_PREIS, 9, ein, false);
    // Stift-Schild gleitet beim Vereinen zum Heft-Schild und blendet aus
    const sa = ein * (1 - kl((v - 0.6) / 0.4));
    const ty = K.STIFTY + (K.HEFTY - K.STIFTY) * v;
    if (sa > 0.01) {
      _m6bSchild(ctx, K.PREISX - 17, ty - 11, K.PREISX + 17, ty + 11, sa, K.F_PREIS);
      _m6bWert(ctx, _m6bE(r.z[2]), K.PREISX, ty, 15, K.F_PREIS, 9, sa, false);
    }
  }
  for (const u of P.umriss) {
    let p = u.von;
    if (u.nach) p = { x: u.von.x + (u.nach.x - u.von.x) * v, y: u.von.y + (u.nach.y - u.von.y) * v };
    _m6bUmriss(ctx, p.x, p.y, ein);
  }
  // Muenzen: liegende zuerst, fliegende obenauf; von aussen erst ab dem Abflug
  const flug = [];
  for (const m of P.muenzen) {
    if (m.herkunft === 'aussen' && !(at >= m.d)) continue;
    if (m.pop >= 0 && at < m.pop) continue;
    const k = m.pop >= 0 && at - m.pop < K.T_POP ? Math.max(0.3, E.federn((at - m.pop) / K.T_POP)) : 1;
    const o = _m6bMuenzOrt(m, at);
    if (o.fliegt) { flug.push(o); continue; }
    _m6bMuenze(ctx, o.x, o.y, k, -1, a);
  }
  for (const o of flug) _m6bSchatten(ctx, o, a);
  for (const o of flug) _m6bMuenze(ctx, o.x, o.y, 1 + 0.1 * o.heb, -1, a);
}
function _m6bGeldBild(ctx, P, at, a) {
  if (!P) { _m6bBoerse(ctx, false, a, 0); return; }
  if (P.art === 'plus') _m6bGeldPlus(ctx, P, at, a);
  else _m6bGeldMinus(ctx, P, at, a);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
// Endstand eines frueheren Ablaufs (zum Ausblenden); je Kennung einmal gebaut.
const _m6bEndPlan = {};
function _m6bEndstand(key) {
  if (!key) return null;
  if (!_m6bEndPlan[key]) _m6bEndPlan[key] = _m6bPlan(key, 0);
  return _m6bEndPlan[key];
}
function _m6bDraw(ctx, cv) {
  if (!_m6b) return;
  const z = _m6b, K = _m6bK, L = z.lauf, at = L.at, kl = _bioFxKlemme, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6bKarte(ctx, K.TX0, K.TY0, K.TX1, K.TY1);
  _m6bKarte(ctx, K.BX0, K.BY0, K.BX1, K.BY1);
  _m6bKarte(ctx, K.GX0, K.GY0, K.GX1, K.GY1);
  ctx.save(); ctx.globalAlpha = 1;
  _m6bText(ctx, 'Rechenbaum', K.TITELX, K.TITELY, 12, '#475569', 'left');
  ctx.restore();
  // das alte Bild blendet aus (im Endstand: „sofort ankommen“)
  if (L.alt !== undefined) {
    const dauer = L.schieb ? K.T_SCHIEB : K.T_LEER, aa = 1 - kl(at / dauer);
    if (aa > 0.01) {
      const PA = _m6bEndstand(L.alt);
      if (PA) { _m6bBaum(ctx, PA, 99, aa); _m6bGeldBild(ctx, PA, 99, aa); }
      else { _m6bBaumLeer(ctx, aa); _m6bGeldBild(ctx, null, 0, aa); }
    }
  }
  // das neue Bild
  if (at >= L.vor || L.alt === undefined) {
    if (L.plan) { _m6bBaum(ctx, L.plan, at, 1); _m6bGeldBild(ctx, L.plan, at, 1); }
    else {
      const a = L.alt === undefined ? kl(at / 0.3) : kl((at - L.vor) / 0.2);
      _m6bBaumLeer(ctx, a); _m6bGeldBild(ctx, null, 0, a);
    }
  }
  _m6bRechnungOben(ctx);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6bPauseSchild(ctx);
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m6bPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6bText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
