
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – md5 „Welcher Wert liegt in der Mitte?“
// (Kennung m5-median, Praefix _m6v)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL8_PROFIL.md, Abschnitte „md5“ und
// „m5-median (md5) · _m6v“ (Regeln N1–N3, Lehrkraft-Zeile wie Kapitel 4).
// Ueberschrift = Frage der Einheit: „Welche Zeit liegt wirklich in der Mitte?“
//
// Was man sieht – Bild und Zeichen sind durch die FARBE verbunden: Jedes Kind
// hat eine Farbe, und in ihr stehen sein Zettel-Kaertchen, die feine Linie,
// sein Punkt am Zahlenstrahl und seine Zahl in den Statuszeilen
// (Kind 1 violett, 2 gruen, 3 pink, 4 petrol, 5 rot, 6 senf, 7 indigo,
// 8 braun). Blau und Orange sind frei – sie gehoeren der Gegenprobe;
// Grau gehoert dem Abdecken, Dunkelblau-Schwarz der Markierung.
//   KAERTCHEN (oben, auf Karopapier): je Kind ein Zettel mit der Zeit, gross
//     die Zahl, klein darunter „min“. Erst in Listenreihenfolge, nach dem
//     Ordnen der Groesse nach. Ueber jedem Platz klein „Platz 1“, „Platz 2“ …
//   ZAHLENSTRAHL (unten): 0 bis 30 min, ein Strich je Minute, eine Zahl alle
//     5 min, am Pfeil „min“. Ein Punkt je Wert, mit seinem Kaertchen durch
//     eine feine Linie in derselben Farbe verbunden.
//   WERT UNTER DEM STRAHL: Steht die Mitte fest, haengt unter ihrem Punkt ein
//     Schild mit dem Wert („12 min“); bei gerader Anzahl unter dem dritten
//     Punkt („14 min“).
//
// Bewegung (spielt nach der Sprungmarke SELBST ab – N1: jede Sprungmarke
// spielt ihre Zeile ab; anhalten kann die Lehrkraft). Alles ist eine Funktion
// der Ablaufzeit szene.s (_m6vZeiten, _m6vPose): keine Zufallszahl, jede Zahl
// im Bild kommt aus derselben Rechnung wie die Statuszeilen (_m6vStand).
//   0,00–0,20 s  eine alte Szene blendet aus.
//   je Kind 0,35 s (ab 0,3 s): das Kaertchen springt auf seinem Platz auf
//                (0,25 s), sein Punkt faellt an der Linie entlang auf den
//                Strahl und federt dort (0,45 s).
//   +0,3 s       Pause, dann ORDNEN (0,8 s): Alle Kaertchen tauschen
//                gleichzeitig die Plaetze (nach rechts im Bogen nach oben,
//                nach links im Bogen nach unten). Die Linien entwirren sich,
//                die Punkte am Strahl bleiben stehen.
//   +0,25 s      ABDECKEN von aussen nach innen: je Paar (links und rechts
//                zugleich) schiebt sich ein grauer Zettel ueber die Kaertchen
//                (0,4 s), Linie und Punkt werden grau; 0,6 s je Paar.
//   +0,05 s      Das uebrige Kaertchen hebt sich und leuchtet (0,4 s), sein
//                Punkt am Strahl leuchtet mit, sein Platz („Platz 3“) wird
//                bernsteinfarben, unter dem Punkt erscheint sein Wert.
//                Gerade Anzahl („+ 1 Kind“): zwei bleiben, beide leuchten,
//                dann erscheint zwischen ihren Punkten ein dritter Punkt
//                (0,35 s) mit dem Wert darunter.
//   Gesamtdauer bei „Tempo: normal“, gemessen in Frames zu 16 ms:
//     3 Kinder 4,07 s = 255 · 5 Kinder 5,37 s = 336 · 7 Kinder 6,67 s = 417 ·
//     „+ 1 Kind“ 3,97 / 4,57 / 5,17 s · „ohne Ordnen“ 2,2 s
//     (bei „Tempo: langsam“ dreimal so lang).
//   simfakten.js deshalb mit --frames=110 --verlauf=4 fahren (liest bis
//   Frame 550); mit --frames=25 steht im Dump nur die Liste, nicht die Mitte.
//   „+ 1 Kind“ (nur nach einer Gruppe, einmal): graue Zettel heben sich ab,
//     die Reihe rueckt fuer ein Kaertchen mehr zusammen (0,4 s), das neue
//     Kaertchen springt rechts auf, sein Punkt faellt – dann Ordnen und
//     Abdecken wie oben.
//   „ohne Ordnen“ (Gegenprobe, nur bei ungerader Anzahl): graue Zettel heben
//     sich ab (0,3 s), die Kaertchen gleiten zurueck in die Listenreihenfolge
//     (0,8 s, die Linien verheddern sich wieder), das mittlere Kaertchen der
//     LISTE bekommt einen dunklen Rahmen, sein Punkt einen dunklen Ring
//     (0,3 s); dann werden die Punkte links davon blau, rechts davon orange
//     (0,4 s).
//   „neu“: die Szene blendet aus (0,5 s), der Strahl ist leer.
// Wer waehrend einer Bewegung „ohne Ordnen“ oder „+ 1 Kind“ drueckt, laesst
// sie sofort ankommen (ohne Lichtring); dann geschieht das Neue. Eine
// Sprungmarke und „neu“ brechen ab und bauen neu auf. Jede Knopffolge ergibt
// so dieselben Zahlen.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6vGruppe('3') …):
//     „3 Kinder“ · „5 Kinder“ · „7 Kinder“ (die gezeigte ist hervorgehoben)
//   Reihe 2: „ohne Ordnen“ (_m6vGegen()) · „+ 1 Kind“ (_m6vDazu()) – beide
//     blass, bis eine Gruppe gewaehlt ist, und blass, sobald das zusaetzliche
//     Kind da ist · „neu“ (_m6vNeu())
//
// Statuszeilen (woertlich aus dem Bauplan, alle mit mehr als 18 Zeichen –
// simfakten.js). Sie folgen dem Bild: Eine Zahl steht erst in der Anzeige,
// wenn sie im Bild angekommen ist. Zwischen Zahl und „min“ steht ein
// geschuetztes Leerzeichen (U+00A0, im Dump ein normales).
//   _m6v-liste   „Zeiten: 12 min, 5 min, 20 min, 8 min, 25 min“ (waechst mit
//                jedem Kaertchen; ohne Gruppe „Zeiten: noch keine Gruppe gewählt“)
//   _m6v-rang    „Der Größe nach: 5 min, 8 min, 12 min, 20 min, 25 min“
//                (vor dem Ordnen „Der Größe nach: noch nicht geordnet“)
//   _m6v-platz   „In der Mitte steht Platz 3 von 5.“ · gerade Anzahl „In der
//                Mitte stehen Platz 3 und 4 von 6.“ (vorher „… Platz …“)
//   _m6v-wert    „Wert in der Mitte: 12 min“ · gerade Anzahl „Wert in der
//                Mitte: zwischen 12 min und 16 min, also 14 min“
//   _m6v-seiten  „Links davon: 2 Werte, rechts davon: 2 Werte“ (Einzahl „1 Wert“)
//   _m6v-ohne    nur nach „ohne Ordnen“: „Ohne Ordnen in der Mitte: 20 min“
//   _m6v-ohne2   ebenso: „Kleiner als 20 min: 3 Werte, größer: 1 Wert“
//                („3 Werte“ blau, „1 Wert“ orange – die Farben der Punkte)
//   _m6v-lehrkraft  Hinweis fuer die Lehrkraft (siehe unten)
//
// Werte (nachgerechnet, simcheck/werte.js):
//   3 Kinder: 4, 10, 6 min → 4, 6, 10 → Platz 2 von 3 → 6 min, links 1, rechts 1
//     · ohne Ordnen 10 min, kleiner 2, groesser 0
//     · + 1 Kind (8 min) → 4, 6, 8, 10 → Platz 2 und 3 von 4 → 7 min
//   5 Kinder: 12, 5, 20, 8, 25 min → 5, 8, 12, 20, 25 → Platz 3 von 5 → 12 min,
//     2 / 2 · ohne Ordnen 20 min, kleiner 3, groesser 1
//     · + 1 Kind (16 min) → 5, 8, 12, 16, 20, 25 → Platz 3 und 4 von 6 → 14 min
//   7 Kinder: 9, 14, 3, 30, 11, 7, 16 min → 3, 7, 9, 11, 14, 16, 30 → Platz 4
//     von 7 → 11 min, 3 / 3 · ohne Ordnen 30 min, kleiner 6, groesser 0
//     · + 1 Kind (13 min) → 3, 7, 9, 11, 13, 14, 16, 30 → Platz 4 und 5 von 8
//     → 12 min
// Start: keine Kaertchen („Start: Noch keine Zeiten, wähle eine Gruppe“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): „5 Kinder“ – wenn nach dem
// Abdecken das 12-min-Kaertchen uebrig ist und sich hebt, breitet sich ein
// Lichtring um das Kaertchen aus, und es bleibt 2,2 s bernsteinfarben
// umrandet. Das widerlegt „20 min“ (Mitte der ungeordneten Liste) und
// „15 min“ (Mitte zwischen kleinstem und groesstem Wert). Bei „ohne Ordnen“
// zeigt der Strahl 3 blaue gegen 1 orangen Punkt.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-spannweite / m5-punktefeld; Container
// <div class="fpm-lehrkraft">, damit simfakten.js die Zeile ueberspringen
// kann – V3). Eigene Zeile unter den Heftknoepfen, davor klein „Für die
// Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6vAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links im Bild (Stelle und Aussehen wie m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6vTempo()): ein Drittel so schnell.
//   „Halt vor dem Ordnen: aus“ ↔ „… an“ (_m6vHaltSchalter()): Der Ablauf haelt
//     von selbst an, wenn alle Punkte auf dem Strahl liegen und BEVOR sich die
//     Kaertchen ordnen – die Klasse vermutet die Mitte der Liste. Dann ist
//     Pause; „weiter“ ordnet. Gilt auch fuer „+ 1 Kind“.
//   Nur das wechselnde Wort steht in einem eigenen <span> (_m6v-tempo-an,
//   _m6v-halt-an).
// Hinweiszeile _m6v-lehrkraft (in der Pause „lmp-status off“, sonst „on“)
// nennt immer die Einstellung, so aendert JEDER Lehrkraft-Knopf eine Zeile:
//   sonst  „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal, Halt vor dem Ordnen: aus.“
//   Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. Tempo: …“
//   Halt   „Halt: Alle 5 Zeiten liegen am Strahl. Jetzt kommt das Ordnen.“
// So ist es gebaut:
//   * EIN Zeitfaktor (_m6vZeitfaktor: 0 in der Pause, 1/3 langsam, 1 normal)
//     an der einen Stelle, an der dt in _m6vUpdate hineingeht. Ohne Zeit kein
//     Schritt im Ablauf (`dt > 0`).
//   * Der Halt ist ein EREIGNIS im Ablauf (T.halt wird ueberschritten).
//   * In der Pause bewegen „ohne Ordnen“ und „+ 1 Kind“ nichts: Steht eine
//     Bewegung, entfaellt der Druck; steht keine, wird er VORGEMERKT und
//     beginnt mit „weiter“. Das Schild „Pause“ leuchtet dabei kurz auf (in
//     echter Zeit). Eine Sprungmarke und „neu“ heben die Pause auf; Tempo und
//     Halt bleiben stehen (die Lehrkraft stellt sie einmal ein).
//   Voreinstellung: Pause aus, Tempo normal, Halt aus.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Median“, „Rangliste“
// (am Bildschirm heisst es „Der Größe nach“), die Regel als Satz. Keine Namen,
// keine Punkte, keine Zeit, kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m6v = null;
const _m6vDATEN = { '3': [4, 10, 6], '5': [12, 5, 20, 8, 25], '7': [9, 14, 3, 30, 11, 7, 16] };  // min, Listenreihenfolge
const _m6vDAZU = { '3': 8, '5': 16, '7': 13 };      // „+ 1 Kind“: ein Kaertchen mehr (min)
const _m6vREIHE = ['3', '5', '7'];
const _m6vFARBE = ['#7c3aed', '#15803d', '#db2777', '#0e7490', '#b91c1c', '#a16207', '#4338ca', '#92400e'];  // Kind 1 … 8
const _m6vK = {
  PX0: 4, PX1: 416, PY0: 4, PY1: 246,       // Papier
  KA: 15,                                   // Karo
  KW: 40, KH: 38, KG: 8, KMX: 210, KY: 54,  // Kaertchen: Breite, Hoehe, Luecke, Mitte der Reihe, Oberkante
  LY: 41,                                   // Grundlinie der Aufschrift „Platz n“
  HEB: 6,                                   // so weit hebt sich das Kaertchen in der Mitte (px)
  X0: 20, M: 12, MMAX: 30, XE: 406,         // Zahlenstrahl: 0 min, Pixel je Minute, bis 30 min, Pfeilspitze
  SY: 192,                                  // Hoehe des Zahlenstrahls
  RP: 5.5,                                  // Radius eines Punkts
  SCHILD: 216,                              // Oberkante des Wertschilds unter dem Strahl
  // Zeiten in s – Abspielen einer Gruppe
  T_ALT: 0.2, T0: 0.3, T_JE: 0.35, T_POP: 0.25, T_FALL0: 0.12, T_FALL: 0.45,
  T_VOR: 0.3, T_ORD: 0.8, T_NACH: 0.25, T_PAAR: 0.6, T_DECK: 0.4, T_HEB: 0.4, T_DRITT: 0.35,
  // „+ 1 Kind“ / „ohne Ordnen“: der vorige Zustand klingt ab
  T_AUF: 0.4, T_AUFG: 0.3, T_MARK: 0.3, T_FARB: 0.4,
  T_AHA: 2.2, LANGSAM: 1 / 3, T_NEU: 0.5,       // „neu“: die Szene blendet sichtbar aus (0,5 s)
  F_TINTE: '#0f172a', F_GRAU: '#94a3b8', F_DECK: '#cbd5e1', F_LEUCHT: '#d97706', F_PLATZ: '#b45309',
  F_MARK: '#1e293b', F_BLAU: '#2563eb', F_ORANGE: '#ea580c', F_KARO: '#dbe7f3'
};

// ── Daten und Ablauf: alles aus der Ablaufzeit ──────────────────────────
// Werte einer Szene in Listenreihenfolge (mit dem zusaetzlichen Kind hinten)
function _m6vWerte(sc) {
  const v = _m6vDATEN[sc.g].slice();
  if (sc.plus) v.push(_m6vDAZU[sc.g]);
  return v;
}
// Ordnung: idx = Kaertchen der Groesse nach (0 = kleinste Zeit), r[i] = Platz von Kaertchen i.
function _m6vRang(v) {
  const idx = v.map((_, i) => i).sort((a, b) => v[a] - v[b] || a - b);
  const r = [];
  idx.forEach((i, p) => { r[i] = p; });
  return { idx, r };
}
// Mitte des Kaertchens auf Platz p bei n Kaertchen
function _m6vPlatzX(p, n) {
  const K = _m6vK;
  return K.KMX - (n * K.KW + (n - 1) * K.KG) / 2 + p * (K.KW + K.KG) + K.KW / 2;
}
// Stelle von w Minuten am Zahlenstrahl
function _m6vSX(w) { return _m6vK.X0 + w * _m6vK.M; }
function _m6vMin(w) { return w + ' min'; }    // Zahl und Einheit, geschuetztes Leerzeichen (U+00A0)
function _m6vWerteWort(k) { return k + (k === 1 ? ' Wert' : ' Werte'); }
// Plaetze VOR dem Ordnen (a) und DANACH (z)
function _m6vSlots(sc) {
  const v = _m6vWerte(sc), n = v.length;
  let a, z;
  if (sc.art === 'spiel') a = v.map((_, i) => i);
  else a = v.map((_, i) => (sc.von && i < sc.von.n ? sc.von.slot[i] : i));
  if (sc.art === 'gegen') z = v.map((_, i) => i);
  else z = _m6vRang(v).r;
  return { a, z, n };
}
// Die Zeitmarken einer Szene
function _m6vZeiten(sc) {
  const K = _m6vK, v = _m6vWerte(sc), n = v.length, ungerade = n % 2 === 1;
  const T = { n, ungerade };
  if (sc.art === 'spiel') {
    T.pre = 0; T.auf = i => K.T0 + i * K.T_JE;
    T.da = T.auf(n - 1) + K.T_FALL0 + K.T_FALL; T.Ord0 = T.da + K.T_VOR;
  } else if (sc.art === 'plus') {
    T.pre = K.T_AUF; T.auf = i => (i === n - 1 ? K.T_AUF + 0.05 : -Infinity);
    T.da = T.auf(n - 1) + K.T_FALL0 + K.T_FALL; T.Ord0 = T.da + K.T_VOR;
  } else {
    T.pre = K.T_AUFG; T.auf = () => -Infinity;
    T.da = K.T_AUFG; T.Ord0 = T.da + 0.05;
  }
  const S = _m6vSlots(sc);
  T.ordDauer = S.a.some((p, i) => p !== S.z[i]) ? K.T_ORD : 0;
  T.Ord1 = T.Ord0 + T.ordDauer;
  if (sc.art !== 'gegen') {
    T.paare = ungerade ? (n - 1) / 2 : n / 2 - 1;
    T.halt = T.Ord0 - 0.005;                        // Halt vor dem Ordnen: alle Punkte liegen
    T.Ab0 = T.Ord1 + K.T_NACH; T.Ab1 = T.Ab0 + T.paare * K.T_PAAR;
    T.Hb0 = T.Ab1 + 0.05; T.Hb1 = T.Hb0 + K.T_HEB;
    T.D0 = T.Hb1 + 0.1; T.D1 = T.D0 + K.T_DRITT;
    T.wert = ungerade ? T.Hb1 : T.D1;
    T.Ende = T.wert + 0.1;
  } else {
    T.halt = null;
    T.Mk0 = T.Ord1 + 0.15; T.Mk1 = T.Mk0 + K.T_MARK;
    T.Fa0 = T.Mk1 + 0.15; T.Fa1 = T.Fa0 + K.T_FARB;
    T.Ende = T.Fa1 + 0.05;
  }
  return T;
}
// Wie steht jedes Kaertchen zur Zeit s da? (Grundlage des Bildes und des Folgezustands)
function _m6vPose(sc, s) {
  const K = _m6vK, E = _bioFxEase, kl = _bioFxKlemme;
  const v = _m6vWerte(sc), T = _m6vZeiten(sc), S = _m6vSlots(sc), n = S.n;
  const von = sc.von, nv = von ? von.n : 0;
  const pre = sc.art === 'spiel' ? 1 : E.sanft(kl(s / T.pre));     // Reihe rueckt zusammen
  const ab = von ? 1 - kl(s / T.pre) : 0;                          // der vorige Zustand klingt ab
  const eO = T.ordDauer > 0 ? E.sanft(kl((s - T.Ord0) / T.ordDauer)) : (s >= T.Ord0 ? 1 : 0);
  const basis = _m6vDATEN[sc.g], mitteL = (basis.length - 1) / 2, wMitteL = basis[mitteL];
  const karten = [];
  for (let i = 0; i < n; i++) {
    const xa = _m6vPlatzX(S.a[i], n), xz = _m6vPlatzX(S.z[i], n);
    const x0 = von && i < nv ? von.x[i] : xa;
    const d = S.z[i] - S.a[i], amp = 8 + 5 * Math.abs(d), b = Math.sin(Math.PI * eO);
    const au = T.auf(i);
    const k = {
      i, w: v[i], d,
      x: x0 + (xa - x0) * pre + (xz - xa) * eO,
      dy: d > 0 ? -amp * b : d < 0 ? 0.8 * amp * b : 0,
      zieht: d !== 0 && eO > 0 && eO < 1,
      pop: au === -Infinity ? 1 : kl((s - au) / K.T_POP),
      fall: au === -Infinity ? 1 : kl((s - au - K.T_FALL0) / K.T_FALL),
      deck: von && i < nv ? von.deck[i] * ab : 0,
      hebVon: von && i < nv ? von.heb[i] * ab : 0, hebNeu: 0,
      mark: von && i < nv ? von.mark[i] * ab : 0, markNeu: 0,
      farb: von && i < nv ? von.farb[i] * ab : 0,
      seite: Math.sign(v[i] - wMitteL)              // −1 kleiner, +1 groesser als die Mitte der Liste
    };
    if (sc.art !== 'gegen') {
      const kk = Math.min(S.z[i], n - 1 - S.z[i]);   // Paar von aussen: 0, 1, 2 …
      if (kk < T.paare) k.deck += kl((s - (T.Ab0 + kk * K.T_PAAR)) / K.T_DECK);
      else k.hebNeu = E.sanft(kl((s - T.Hb0) / K.T_HEB));
    } else if (i === mitteL) { k.markNeu = kl((s - T.Mk0) / K.T_MARK); k.mark += k.markNeu; }
    else k.farb += kl((s - T.Fa0) / K.T_FARB);
    k.deck = Math.min(1, k.deck); k.heb = Math.min(1, k.hebVon + k.hebNeu);
    k.mark = Math.min(1, k.mark); k.farb = Math.min(1, k.farb);
    karten.push(k);
  }
  const dritt = sc.art !== 'gegen' && !T.ungerade ? kl((s - T.D0) / K.T_DRITT) : 0;
  return { v, n, S, T, pre, ab, eO, karten, dritt, ungerade: T.ungerade, vonN: nv,
           vonUngerade: von ? von.n % 2 === 1 : false };
}
// Endzustand einer Szene – der Anfang von „+ 1 Kind“ und „ohne Ordnen“
function _m6vEndPose(sc) {
  const P = _m6vPose(sc, Infinity);
  return { n: P.n, slot: P.S.z.slice(), x: P.karten.map(k => k.x), deck: P.karten.map(k => k.deck),
           heb: P.karten.map(k => k.heb), mark: P.karten.map(k => k.mark), farb: P.karten.map(k => k.farb) };
}

// Was zeigt eine Szene gerade? (Grundlage der Statuszeilen)
function _m6vStand(sc) {
  if (!sc || !sc.g) return { g: null };
  const K = _m6vK, T = _m6vZeiten(sc), n = T.n, s = sc.s, gg = sc.art === 'gegen';
  let gezeigt = n;
  if (sc.art === 'spiel') { gezeigt = 0; for (let i = 0; i < n; i++) if (s >= T.auf(i) + K.T_POP) gezeigt++; }
  else if (sc.art === 'plus') gezeigt = n - 1 + (s >= T.auf(n - 1) + K.T_POP ? 1 : 0);
  return { g: sc.g, plus: !!sc.plus, art: sc.art, gezeigt,
           geordnet: gg || s >= T.Ord1, mitte: gg || s >= T.Ab1, wert: gg || s >= T.wert,
           gegen: !gg ? -1 : s >= T.Fa1 ? 2 : s >= T.Mk1 ? 1 : 0 };
}
function _m6vSchluessel() {
  const z = _m6v;
  return JSON.stringify(_m6vStand(z.szene)) + (z.pause ? 'P' : '') + (z.halt ? 'H' : '') +
         (z.lauf || '') + (z.vormerk || '') + (z.langsam ? 'L' : '') + (z.haltAn ? 'A' : '');
}

function _m6vInit() {
  _m6v = { t: 0, szene: { g: null, plus: false, art: null, s: 0, von: null }, lauf: null, alt: null,
           angehalten: false, ahaGlanz: 0, blink: 0, vormerk: null,
           pause: false, langsam: false, haltAn: false, halt: null,   // Lehrkraft-Einstellungen
           schluessel: '', fx: { teile: [] } };
}
function _m6vHTML() {
  const marke = g => `<button class="sim-btn" id="_m6v-b-${g}" onclick="_m6vGruppe('${g}')">${g}&nbsp;Kinder</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welche Zeit liegt wirklich in der Mitte?</h3>
    <div class="fpm-note" style="margin-top:2px">Jede Karte ist ein Kind. Wähle eine Gruppe und sieh zu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6v-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6vREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6v-gknopf" onclick="_m6vGegen()">ohne Ordnen</button>
          <button class="sim-btn" id="_m6v-dknopf" onclick="_m6vDazu()">+&nbsp;1 Kind</button>
          <button class="sim-btn" onclick="_m6vNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6v-pause" onclick="_m6vAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6v-tempo" onclick="_m6vTempo()">Tempo: <span id="_m6v-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6v-halt" onclick="_m6vHaltSchalter()">Halt vor dem Ordnen: <span id="_m6v-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6v-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6v-liste" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6v-rang" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6v-platz" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6v-wert" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6v-seiten" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6v-ohne" style="margin-top:6px;display:none"></div>
        <div class="lmp-status on" id="_m6v-ohne2" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Noch keine Zeiten, wähle eine Gruppe</p>
  </div>`;
}
function _m6vSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6vZeige(e, an) { if (e && e.style) e.style.display = an ? '' : 'none'; }
function _m6vKnopf(id, an) {
  const b = document.getElementById(id);
  if (b) { b.disabled = !an; if (b.style) b.style.opacity = an ? '' : '0.45'; }
}
function _m6vStatus() {
  if (!_m6v) return;
  const z = _m6v, K = _m6vK, sc = z.szene, st = _m6vStand(sc);
  z.schluessel = _m6vSchluessel();
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  if (!sc.g) {
    _m6vSetze('_m6v-liste', 'Zeiten: noch keine Gruppe gewählt');
    _m6vSetze('_m6v-rang', 'Der Größe nach: noch nicht geordnet');
    _m6vSetze('_m6v-platz', 'In der Mitte steht Platz …');
    _m6vSetze('_m6v-wert', 'Wert in der Mitte: …');
    _m6vSetze('_m6v-seiten', 'Links davon: …, rechts davon: …');
  } else {
    // Die Fakten der Mitte gehoeren zur Gruppe (bei „ohne Ordnen“ zur ungeordneten Grundliste)
    const v = _m6vWerte(sc), n = v.length, R = _m6vRang(v), ung = n % 2 === 1;
    const w = i => f(_m6vMin(v[i]), _m6vFARBE[i]);
    const liste = v.slice(0, st.gezeigt).map((_, i) => w(i));
    _m6vSetze('_m6v-liste', 'Zeiten: ' + (liste.length ? liste.join(', ') : '…'));
    _m6vSetze('_m6v-rang', 'Der Größe nach: ' + (st.geordnet ? R.idx.map(w).join(', ') : 'noch nicht geordnet'));
    const m = (n - 1) / 2, m1 = n / 2 - 1, m2 = n / 2;
    _m6vSetze('_m6v-platz', !st.mitte ? (ung ? 'In der Mitte steht Platz …' : 'In der Mitte stehen Platz …')
      : ung ? 'In der Mitte steht ' + f('Platz ' + (m + 1), K.F_PLATZ) + ' von ' + n + '.'
            : 'In der Mitte stehen ' + f('Platz ' + (m1 + 1) + ' und ' + (m2 + 1), K.F_PLATZ) + ' von ' + n + '.');
    _m6vSetze('_m6v-wert', !st.wert ? 'Wert in der Mitte: …'
      : ung ? 'Wert in der Mitte: ' + w(R.idx[m])
            : 'Wert in der Mitte: zwischen ' + w(R.idx[m1]) + ' und ' + w(R.idx[m2]) + ', also ' +
              f(_m6vMin((v[R.idx[m1]] + v[R.idx[m2]]) / 2), K.F_MARK));
    const seite = ung ? m : m1;
    _m6vSetze('_m6v-seiten', st.mitte ? 'Links davon: ' + f(_m6vWerteWort(seite), '#475569') +
                                        ', rechts davon: ' + f(_m6vWerteWort(seite), '#475569')
                                      : 'Links davon: …, rechts davon: …');
  }
  // Gegenprobe: nur nach „ohne Ordnen“
  const gAn = !!sc.g && st.gegen >= 0;
  let oTxt = '', o2Txt = '';
  if (gAn) {
    const v = _m6vWerte(sc), n = v.length, mi = (n - 1) / 2, wm = v[mi];
    const kl = v.filter(x => x < wm).length, gr = v.filter(x => x > wm).length;
    oTxt = 'Ohne Ordnen in der Mitte: ' + (st.gegen >= 1 ? f(_m6vMin(wm), _m6vFARBE[mi]) : '…');
    o2Txt = st.gegen >= 2
      ? 'Kleiner als ' + _m6vMin(wm) + ': ' + f(_m6vWerteWort(kl), K.F_BLAU) + ', größer: ' + f(_m6vWerteWort(gr), K.F_ORANGE)
      : 'Kleiner als ' + (st.gegen >= 1 ? _m6vMin(wm) : '…') + ': …';
  }
  _m6vZeige(_m6vSetze('_m6v-ohne', oTxt), gAn);
  _m6vZeige(_m6vSetze('_m6v-ohne2', o2Txt), gAn);
  // Sprungmarke der gezeigten Gruppe hervorheben; Reihe 2 erst mit einer Gruppe
  for (const g of _m6vREIHE) {
    const b = document.getElementById('_m6v-b-' + g);
    if (b && b.classList) b.classList.toggle('primary', sc.g === g);
  }
  _m6vKnopf('_m6v-gknopf', !!sc.g && !sc.plus);
  _m6vKnopf('_m6v-dknopf', !!sc.g && !sc.plus);
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6vSetze('_m6v-pause', z.pause ? 'weiter' : 'Pause');
  _m6vSetze('_m6v-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6vSetze('_m6v-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _m6vSetze('_m6v-lehrkraft', _m6vHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6v-pause', z.pause], ['_m6v-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6vHinweis() {
  const z = _m6v;
  if (z.halt) return 'Halt: Alle ' + z.halt.n + ' Zeiten liegen am Strahl. Jetzt kommt das Ordnen.';
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt vor dem Ordnen: ' + (z.haltAn ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Die gezeigte Szene blendet aus; Pause, Halt und Lichtring fallen weg.
function _m6vAufraeumen() {
  const z = _m6v, sc = z.szene;
  z.alt = sc.g ? { szene: { g: sc.g, plus: sc.plus, art: sc.art, s: sc.s, von: sc.von }, at: 0, dauer: _m6vK.T_ALT } : null;
  z.lauf = null; z.pause = false; z.halt = null; z.vormerk = null; z.blink = 0;
  z.angehalten = false; z.ahaGlanz = 0; z.fx.teile.length = 0;
}
function _m6vGruppe(g) {
  if (!_m6v || !_m6vDATEN[g]) return;
  const z = _m6v;
  _m6vAufraeumen();
  z.szene = { g, plus: false, art: 'spiel', s: 0, von: null };
  z.lauf = 'spiel';
  _m6vStatus();
}
function _m6vNeu() {
  if (!_m6v) return;
  const z = _m6v;
  _m6vAufraeumen();
  if (z.alt) z.alt.dauer = _m6vK.T_NEU;             // nichts Neues baut sich auf: langsamer ausblenden
  z.szene = { g: null, plus: false, art: null, s: 0, von: null };
  _m6vStatus();
}
// Die laufende Bewegung sofort ankommen lassen (Endstand, ohne Lichtring).
function _m6vAnkommen() {
  const z = _m6v;
  if (z.lauf) z.szene.s = Infinity;
  z.lauf = null; z.halt = null;
}
// In der Pause: vormerken (nichts unterwegs) oder entfallen lassen (Bewegung steht).
function _m6vInDerPause(tat) {
  const z = _m6v;
  z.blink = 0.6;
  if (!z.lauf) z.vormerk = tat;
  _m6vStatus();
}
// Neue Szene, die am Endstand der gezeigten anfaengt
function _m6vWeiterbauen(art, plus) {
  const z = _m6v, sc = z.szene;
  _m6vAnkommen();
  z.szene = { g: sc.g, plus, art, s: 0, von: _m6vEndPose(sc) };
  z.lauf = art; z.angehalten = false; z.ahaGlanz = 0;
  _m6vStatus();
}
// „ohne Ordnen“ – die Gegenprobe (nur bei ungerader Anzahl)
function _m6vGegen() {
  if (!_m6v || !_m6v.szene.g || _m6v.szene.plus) return;
  if (_m6v.pause) { _m6vInDerPause('gegen'); return; }
  _m6vWeiterbauen('gegen', false);
}
// „+ 1 Kind“ – ein Kaertchen mehr (einmal je Gruppe)
function _m6vDazu() {
  if (!_m6v || !_m6v.szene.g || _m6v.szene.plus) return;
  if (_m6v.pause) { _m6vInDerPause('dazu'); return; }
  _m6vWeiterbauen('plus', true);
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6vAnhalten() {
  if (!_m6v) return;
  const z = _m6v;
  if (z.pause) {
    z.pause = false; z.halt = null; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v === 'gegen' && !z.lauf) { _m6vGegen(); return; }
    if (v === 'dazu' && !z.lauf) { _m6vDazu(); return; }
  } else z.pause = true;
  _m6vStatus();
}
function _m6vTempo() {
  if (!_m6v) return;
  _m6v.langsam = !_m6v.langsam;
  _m6vStatus();
}
function _m6vHaltSchalter() {
  if (!_m6v) return;
  _m6v.haltAn = !_m6v.haltAn;
  _m6vStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6vZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6vK.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6vUpdate(dt) {
  if (!_m6v) return;
  const z = _m6v, K = _m6vK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);             // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6vZeitfaktor(z);                     // ab hier Sim-Zeit
  z.t += dt;
  if (z.alt) { z.alt.at += dt; if (z.alt.at >= z.alt.dauer) z.alt = null; }
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  const sc = z.szene;
  if (z.lauf && dt > 0) {                           // ohne Zeit kein Schritt im Ablauf
    const T = _m6vZeiten(sc), vor = sc.s;
    sc.s += dt;
    if (z.haltAn && !z.angehalten && T.halt !== null && vor < T.halt && sc.s >= T.halt) {
      sc.s = T.halt; z.angehalten = true;           // Halt: alle Punkte liegen, noch nicht geordnet
      z.pause = true; z.halt = { n: T.n };
    }
    if (sc.art === 'spiel' && sc.g === '5' && vor < T.Hb0 && sc.s >= T.Hb0) {
      // Aha: uebrig bleibt das 12-min-Kaertchen
      const P = _m6vPose(sc, T.Hb0), mi = P.S.z.indexOf((T.n - 1) / 2);
      z.ahaGlanz = K.T_AHA;
      _bioFxWelle(z.fx.teile, P.karten[mi].x, K.KY + K.KH / 2 - K.HEB, '#f59e0b', 64);
    }
    if (sc.s >= T.Ende) { sc.s = Infinity; z.lauf = null; }
  }
  if (_m6vSchluessel() !== z.schluessel) _m6vStatus();
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6vRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function _m6vRgba(hex, a) {
  const c = _m6vRgb(hex);
  return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')';
}
// Farbe von a nach b mischen (u = 0..1)
function _m6vMisch(a, b, u) {
  const p = _m6vRgb(a), q = _m6vRgb(b), t = Math.max(0, Math.min(1, u));
  const h = x => Math.round(x).toString(16).padStart(2, '0');
  return '#' + h(p[0] + (q[0] - p[0]) * t) + h(p[1] + (q[1] - p[1]) * t) + h(p[2] + (q[2] - p[2]) * t);
}
function _m6vText(ctx, s, x, y, gr, farbe, ausr, gew) {
  ctx.font = (gew || '700') + ' ' + gr + 'px sans-serif';
  ctx.fillStyle = farbe; ctx.textAlign = ausr || 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Karopapier – steht immer.
function _m6vPapier(ctx) {
  const K = _m6vK;
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
// Zahlenstrahl 0 bis 30 min – steht immer.
function _m6vStrahl(ctx) {
  const K = _m6vK;
  ctx.save();
  ctx.strokeStyle = '#1f2937'; ctx.fillStyle = '#1f2937'; ctx.lineWidth = 2; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(K.X0 - 6, K.SY); ctx.lineTo(K.XE - 6, K.SY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(K.XE, K.SY); ctx.lineTo(K.XE - 9, K.SY - 4.5); ctx.lineTo(K.XE - 9, K.SY + 4.5); ctx.closePath(); ctx.fill();
  for (let m = 0; m <= K.MMAX; m++) {
    const x = _m6vSX(m), h = m % 5 === 0 ? 6 : 3;
    ctx.lineWidth = m % 5 === 0 ? 1.6 : 1;
    ctx.beginPath(); ctx.moveTo(x, K.SY - h); ctx.lineTo(x, K.SY + h); ctx.stroke();
    if (m % 5 === 0) _m6vText(ctx, String(m), x, K.SY + 18, 11, '#1f2937', 'center', '700');
  }
  _m6vText(ctx, 'min', _m6vSX(K.MMAX) + 9, K.SY + 18, 11, '#1f2937', 'left', '700');
  ctx.restore();
}
// Ein Zettel-Kaertchen, Mitte (x, y); k = Groesse. ohneText: ganz abgedeckt –
// dann ist es grau und ohne Schrift (sonst schiene es beim Ausblenden farbig durch).
function _m6vKarte(ctx, x, y, w, farbe, k, a, ohneText) {
  const K = _m6vK;
  if (a <= 0.01 || k <= 0.02) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = 'rgba(15,23,42,0.13)';
  _bioFxRundRect(ctx, -K.KW / 2 + 1.5, -K.KH / 2 + 2.5, K.KW, K.KH, 6); ctx.fill();
  ctx.fillStyle = farbe;
  _bioFxRundRect(ctx, -K.KW / 2, -K.KH / 2, K.KW, K.KH, 6); ctx.fill();
  if (!ohneText) {
    _m6vText(ctx, String(w), 0, 5, 18, '#ffffff', 'center', '700');
    _m6vText(ctx, 'min', 0, 16, 10, 'rgba(255,255,255,0.92)', 'center', '600');
  }
  ctx.restore();
}
// Grauer Zettel, der sich von oben ueber das Kaertchen schiebt (u = 0..1)
function _m6vDecke(ctx, x, y, w, u, a) {
  const K = _m6vK;
  if (u <= 0.01 || a <= 0.01) return;
  const h = K.KH * _bioFxEase.sanft(u), x0 = x - K.KW / 2 - 1.5, y0 = y - K.KH / 2 - 1.5;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a) * 0.92;
  ctx.fillStyle = K.F_DECK; ctx.strokeStyle = K.F_GRAU; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x0, y0, K.KW + 3, h + 3, 6); ctx.fill(); ctx.stroke();
  ctx.restore();
  if (u >= 0.98) {                                  // abgedeckt, aber noch da: die Zahl schimmert durch
    ctx.save();
    ctx.globalAlpha = Math.min(1, a) * 0.5;
    _m6vText(ctx, String(w), x, y + 5, 18, '#64748b', 'center', '700');
    ctx.restore();
  }
}
// Wertschild unter dem Strahl mit gestricheltem Lot vom Punkt
function _m6vSchild(ctx, x, text, rand, a) {
  const K = _m6vK;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = rand; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(x, K.SY + 7); ctx.lineTo(x, K.SCHILD); ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = '700 12px sans-serif';
  const bw = ctx.measureText(text).width + 12, bh = 17;
  const k = Math.max(0.3, _bioFxEase.federn(_bioFxKlemme(a)));
  ctx.translate(x, K.SCHILD + bh / 2); ctx.scale(k, k);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = rand; ctx.lineWidth = 1.8;
  _bioFxRundRect(ctx, -bw / 2, -bh / 2, bw, bh, 5); ctx.fill(); ctx.stroke();
  _m6vText(ctx, text, 0, 4.3, 12, K.F_MARK, 'center', '700');
  ctx.restore();
}
// Eine Szene mit Deckkraft a
function _m6vSzene(ctx, sc, a) {
  if (!sc || !sc.g || a <= 0.01) return;
  const z = _m6v, K = _m6vK, E = _bioFxEase, kl = _bioFxKlemme;
  const P = _m6vPose(sc, sc.s), n = P.n, v = P.v, T = P.T;
  const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);   // ruhig, unter 1 Hz
  const aktuell = z.szene === sc;
  // Lage jedes Kaertchens und seines Punkts
  const lage = P.karten.map(k => {
    const cy = K.KY + K.KH / 2 + k.dy - K.HEB * k.heb;
    const unten = [k.x, cy + K.KH / 2], ziel = [_m6vSX(k.w), K.SY];
    const u = E.aufprall(k.fall);
    return { cy, unten, px: unten[0] + (ziel[0] - unten[0]) * u, py: unten[1] + 4 + (ziel[1] - unten[1] - 4) * u };
  });
  const farbeKarte = i => _m6vFARBE[i];
  const farbeLinie = k => _m6vMisch(farbeKarte(k.i), K.F_GRAU, k.deck);
  const farbePunkt = k => {
    let f = farbeLinie(k);
    if (k.farb > 0) f = _m6vMisch(f, k.seite < 0 ? K.F_BLAU : K.F_ORANGE, k.farb);
    return f;
  };
  // 1. „Platz 1“ … ueber den Plaetzen (die Reihe rueckt bei „+ 1 Kind“ mit)
  // Hervorgehoben: Platz in der Mitte (bernstein) bzw. Mitte der Liste (dunkel);
  // was der vorige Zustand hervorhob, klingt an SEINEM Platz ab.
  const hl = new Array(n).fill(0), hlFarbe = new Array(n).fill(K.F_PLATZ);
  const setze = (p, u, farbe) => { if (p < n && u > hl[p]) { hl[p] = u; hlFarbe[p] = farbe; } };
  for (const k of P.karten) {
    if (k.hebNeu > 0) setze(P.S.z[k.i], k.hebNeu, K.F_PLATZ);
    if (k.markNeu > 0) setze(P.S.z[k.i], k.markNeu, K.F_MARK);
  }
  if (sc.von) for (let i = 0; i < sc.von.n; i++) {
    if (sc.von.heb[i] > 0) setze(sc.von.slot[i], sc.von.heb[i] * P.ab, K.F_PLATZ);
    if (sc.von.mark[i] > 0) setze(sc.von.slot[i], sc.von.mark[i] * P.ab, K.F_MARK);
  }
  for (let p = 0; p < n; p++) {
    let x = _m6vPlatzX(p, n), al = 1;
    if (sc.art === 'plus') {
      if (p < n - 1) x = _m6vPlatzX(p, n - 1) + (_m6vPlatzX(p, n) - _m6vPlatzX(p, n - 1)) * P.pre;
      else al = P.pre;
    } else if (sc.art === 'spiel') al = kl((sc.s - T.auf(p)) / K.T_POP);
    const farbe = _m6vMisch('#64748b', hlFarbe[p], hl[p]);
    ctx.save();
    ctx.globalAlpha = a * al;
    _m6vText(ctx, 'Platz ' + (p + 1), x, K.LY, 10, farbe, 'center', hl[p] > 0.5 ? '700' : '600');
    ctx.restore();
  }
  // 2. Linien vom Kaertchen zum Punkt (hinter allem)
  for (const k of P.karten) {
    if (k.fall <= 0) continue;
    const L = lage[k.i];
    ctx.save();
    ctx.globalAlpha = a * (k.zieht ? 0.85 : 0.7);
    ctx.strokeStyle = farbeLinie(k); ctx.lineWidth = k.zieht ? 1.8 : 1.4;
    ctx.beginPath(); ctx.moveTo(L.unten[0], L.unten[1]); ctx.lineTo(L.px, L.py); ctx.stroke();
    ctx.restore();
  }
  // 3. Leuchten am Strahl: Punkt in der Mitte (bernstein), Mitte der Liste (dunkler Ring)
  for (const k of P.karten) {
    if (k.fall < 1) continue;
    const L = lage[k.i];
    if (k.heb > 0.01) {
      ctx.save();
      ctx.globalAlpha = a * k.heb;
      ctx.fillStyle = _m6vRgba('#fcd34d', 0.45 + 0.2 * puls); ctx.strokeStyle = K.F_LEUCHT; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(L.px, L.py, K.RP + 2.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    if (k.mark > 0.01) {
      ctx.save();
      ctx.globalAlpha = a * k.mark;
      ctx.strokeStyle = K.F_MARK; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(L.px, L.py, K.RP + 3.2, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  }
  // 4. Punkte
  for (const k of P.karten) {
    if (k.fall <= 0) continue;
    const L = lage[k.i];
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = farbePunkt(k); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(L.px, L.py, K.RP, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // 5. Gerade Anzahl: der dritte Punkt zwischen den beiden mittleren
  if (P.dritt > 0) {
    const R = _m6vRang(v), wa = v[R.idx[n / 2 - 1]], wb = v[R.idx[n / 2]], wm = (wa + wb) / 2, x = _m6vSX(wm);
    const kk = Math.max(0.3, E.federn(P.dritt));
    ctx.save();
    ctx.globalAlpha = a * Math.min(1, P.dritt * 2);
    ctx.translate(x, K.SY); ctx.scale(kk, kk);
    ctx.fillStyle = K.F_MARK; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, 4.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    _m6vSchild(ctx, x, _m6vMin(wm), K.F_MARK, a * P.dritt);
  }
  // Wertschild unter dem Punkt in der Mitte (ungerade Anzahl; klingt bei „+ 1 Kind“ ab)
  for (const k of P.karten) {
    const al = (P.ungerade ? k.hebNeu : 0) + (P.vonUngerade ? k.hebVon : 0);
    if (al > 0.01 && k.fall >= 1) _m6vSchild(ctx, lage[k.i].px, _m6vMin(k.w), K.F_LEUCHT, a * Math.min(1, al));
  }
  // 6. Kaertchen: stehende zuerst, gleitende darueber (die weiteste ganz oben)
  const reihe = P.karten.slice().sort((p, q) => (p.zieht - q.zieht) || (Math.abs(p.d) - Math.abs(q.d)) || (p.i - q.i));
  for (const k of reihe) {
    if (k.pop <= 0) continue;
    const L = lage[k.i], kk = Math.max(0.3, E.federn(k.pop));
    if (k.zieht) {                                  // gleitendes Kaertchen hebt sich: Schatten darunter
      ctx.save();
      ctx.globalAlpha = a * 0.16; ctx.fillStyle = '#0f172a';
      _bioFxRundRect(ctx, k.x - K.KW / 2 + 3, L.cy - K.KH / 2 + 5, K.KW, K.KH, 6); ctx.fill();
      ctx.restore();
    }
    if (k.heb > 0.01) {                             // Leuchten hinter dem Kaertchen in der Mitte
      const aha = aktuell && z.ahaGlanz > 0 && k.hebNeu > 0 ? Math.min(1, z.ahaGlanz / 0.6) : 0;
      ctx.save();
      ctx.globalAlpha = a * k.heb;
      ctx.fillStyle = _m6vRgba('#fcd34d', 0.4 + 0.18 * puls);
      ctx.strokeStyle = aha > 0 ? '#f59e0b' : K.F_LEUCHT; ctx.lineWidth = 2 + 1.5 * aha;
      _bioFxRundRect(ctx, k.x - K.KW / 2 - 3, L.cy - K.KH / 2 - 3, K.KW + 6, K.KH + 6, 8); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    const zu = k.deck >= 0.98;                       // ganz abgedeckt (Schwelle wie in _m6vDecke)
    _m6vKarte(ctx, k.x, L.cy, k.w, zu ? K.F_DECK : farbeKarte(k.i), kk, a, zu);
    _m6vDecke(ctx, k.x, L.cy, k.w, k.deck, a);
    if (k.mark > 0.01) {                            // Mitte der ungeordneten Liste: dunkler Rahmen
      ctx.save();
      ctx.globalAlpha = a * k.mark;
      ctx.strokeStyle = K.F_MARK; ctx.lineWidth = 3;
      _bioFxRundRect(ctx, k.x - K.KW / 2 - 3, L.cy - K.KH / 2 - 3, K.KW + 6, K.KH + 6, 8); ctx.stroke();
      ctx.restore();
    }
  }
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
// Es endet ueber der Zeile „Platz 1 …“ (Grundlinie y = 41, Oberkante der Schrift 33,5).
function _m6vPauseSchild(ctx) {
  const z = _m6v, w = 64, h = 25, x = 8, y = 8;
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
  _m6vText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6vDraw(ctx, cv) {
  if (!_m6v) return;
  const z = _m6v, K = _m6vK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6vPapier(ctx);
  _m6vStrahl(ctx);
  if (z.alt) _m6vSzene(ctx, z.alt.szene, 1 - _bioFxKlemme(z.alt.at / z.alt.dauer));
  _m6vSzene(ctx, z.szene, 1);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6vPauseSchild(ctx);
}
