
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 6 FOERDER – mt5 „Wie lang können die Stücke höchstens sein?“
// (Kennung m6-gemeinsame-teiler, Praefix _k6e)
// Bauplan: arbeitsheft_mathe_foe6/KAPITEL1_PROFIL.md, Abschnitt
// m6-gemeinsame-teiler (Einheit mt5; Regeln N1–N3, Lehrkraft-Zeile, nur
// onclick-Knoepfe). Ueberschrift = Frage der Einheit:
// „Wie lang können die Stücke höchstens sein?“
//
// Was man sieht – ein Blatt Karopapier wie eine Schneidematte (1 Kaestchen =
// 16 px = 1 m, die senkrechten Karolinien stehen genau auf den Metern):
//   ZWEI BAENDER, links an einer dunklen Startlinie (0 m): oben das
//     12-m-Band (rot), darunter das 18-m-Band (blau). Ueber jedem Band sein
//     Name in seiner Farbe („12-m-Band“, „18-m-Band“ – woertlich wie die
//     Spalten der Heft-Tabelle). Geschnittene Stuecke wechseln leicht im
//     Farbton (dunkel/hell), zwischen zwei Stuecken klafft eine kleine
//     Luecke; auf jedem Stueck steht seine Laenge („4 m“, weiss), wenn sie
//     hineinpasst (bei 1-m-Stuecken nicht).
//   REST (wenn am Ende ein Stueck kuerzer als die Stuecklaenge bleibt): das
//     Stueck wird orange, darauf seine Laenge („2 m“, dunkel); rechts daran
//     ein gestrichelter oranger Umriss bis zur vollen Stuecklaenge – das, was
//     fehlt. Er darf ueber das Bandende und ueber 18 m hinausgehen (bei 12 m
//     und dem 18-m-Band bis 24 m); weiter als bis zum Papierrand wird er nicht
//     gezeichnet (nur freie Laengen 13–17 m beim 18-m-Band: dort laeuft er
//     offen aus dem Bild).
//   SCHERE (klein): beim Schneiden steht sie unter dem Band, Griffe nach
//     unten, die Klingen kreuzen das Band. Ist ein Band fertig, legt sie sich
//     darunter hin (Klingen nach rechts, geschlossen) – so verdeckt sie nie
//     ein Stueck, eine Laenge oder den Umriss. Am Start liegt sie unter dem
//     Anfang des 12-m-Bands.
//   MASSBAND (gelb) 0–18 m unter den Baendern, Strich und Zahl je Meter,
//     bei 0, 5, 10, 15 laengere Striche und fette Zahlen (Fuenferstruktur),
//     rechts hinter dem Ende auf Bandhoehe der Achsentitel „Länge in m“
//     (Nachtrag 09.10.: Achsen immer beschriftet).
//   ZETTEL „Kurz“ unten: je Band eine Zeile in Bandfarbe, z. B.
//     „12 m : 4 m = 3“ und „18 m : 4 m = 4 Rest 2 m“ (Rest orange wie das
//     Reststueck). Die Zeile erscheint, wenn das Band zu schneiden beginnt
//     („18 m : 4 m = …“), das Ergebnis federt herein, wenn das Band fertig ist.
//   Farbe verbindet Bild und Zeichen: rot = 12-m-Band, blau = 18-m-Band,
//   orange = Rest – im Bild, auf dem Zettel und in den Statuszeilen gleich.
//
// Bewegung (jede Sprungmarke spielt ihre Tabellenzeile SELBST ab, N1). Alles
// ist eine Funktion der Ablaufzeit L.at: _k6ePlan baut das Drehbuch EINMAL
// (Wege der Schere, Schnitte, Statuszeilen als Ereignisse, Halt, Aha),
// _k6eDraw liest es ab. Keine Zufallszahl; jede Zahl kommt aus _k6eRechne.
//   Zusammenlegen 0,35 s: die Luecken des alten Laufs schliessen sich, Rest
//     und Umriss blassen aus, die Baender liegen wieder ganz da; die Schere
//     gleitet zum Anfang des 12-m-Bands.
//   Schneiden: die Schere richtet sich auf und faehrt zum ersten Schnitt
//     (0,4 s), dann zum naechsten Vielfachen der Stuecklaenge (0,25 s) und
//     schneidet (0,15 s, die Klingen schliessen sich) – 0,4 s je Schnitt. Im Schnitt blitzt eine weisse Linie, die Luecke oeffnet sich,
//     das abgeschnittene Stueck hebt sich kurz (rueckt ab) und bekommt seine
//     Laenge aufgedruckt. Endet ein Stueck genau am Bandende, schneidet die
//     Schere dort ein letztes Mal.
//   Rest: die Schere faehrt ans Bandende (0,25 s) und legt sich hin (0,3 s);
//     gleichzeitig hebt sich das Reststueck, Orange schiebt sich von links
//     darueber (0,3 s), dann waechst der gestrichelte Umriss bis zur vollen
//     Stuecklaenge (0,4 s). Ohne Rest legt sie sich nach dem letzten Schnitt hin.
//   Dann erscheint die Zeile auf dem Zettel (0,35 s); die Schere wechselt
//     zum 18-m-Band, richtet sich dabei auf und faehrt gleich zum ersten
//     Schnitt (0,5 s), dann schneidet sie es genauso.
//   Dauer (gemessen, je mit Zusammenlegen): „3 m“ 5,7 s · „4 m“ 5,45 s ·
//   „6 m“ 3,7 s · „12 m“ 3,45 s; „1 m“ als laengster Fall 13,7 s (857 Frames).
//   „neu“: Zusammenlegen, dann der Start.
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort
// ankommen: Zusammengelegt wird vom ENDstand des laufenden Schnitts aus,
// dann beginnt das Neue. Jede Knopffolge ergibt so dieselben Zahlen.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_k6eMarke(3|4|6|12)):
//     „3 m“ · „4 m“ · „6 m“ · „12 m“. Der Knopf der Stuecklaenge, die gerade
//     geschnitten wird oder liegt, ist hervorgehoben.
//   Reihe 2: „− 1 m“ · „+ 1 m“ (_k6eSchritt(-1|1), Stuecklaenge 1–18 m,
//     schneidet neu) · „neu“ (_k6eNeu()).
//   Grenzen: unter 1 m bzw. ueber 18 m wackelt die Schere, und _k6e-grenze
//     sagt „Kürzer als 1 m schneidet die Schere nicht.“ bzw. „Mehr als 18 m
//     hat keines der Bänder.“ Am Start (noch keine Laenge) nimmt „+ 1 m“ die
//     Laenge 1 m; „− 1 m“ wackelt: „Noch keine Stücklänge gewählt.“ Die
//     Zeile bleibt bis zur naechsten Handlung, sonst ist sie ausgeblendet.
//
// Statuszeilen (woertlich aus dem Bauplan; jede Zeile mit einem Wert, den
// das Heft verlangt, hat mindestens 19 Zeichen). Sie folgen dem Bild:
//   _k6e-laenge  „Gewählte Stücklänge: 4 m“ (Start „Gewählte Stücklänge:
//                noch keine“); wechselt beim Druecken.
//   _k6e-band1   „12-m-Band: 3 Stücke, Rest 0 m“ (Einzahl „1 Stück“). Vorher
//                „12-m-Band: noch nicht geschnitten“, beim Schneiden zaehlt
//                sie mit („12-m-Band: 1 Stück …“, „… 2 Stücke …“).
//   _k6e-band2   „18-m-Band: 4 Stücke, Rest 2 m“ (ebenso)
//   _k6e-kurz1   „Kurz: 12 m : 4 m = 3“ (vorher „Kurz: …“, beim Schneiden
//                „Kurz: 12 m : 4 m = …“)
//   _k6e-kurz2   „Kurz: 18 m : 4 m = 4 Rest 2 m“ (N3: Groesse durch Groesse
//                ist eine Anzahl, der Rest ist eine Laenge)
//   _k6e-grenze  nur an der Grenze (siehe oben)
//   _k6e-lehrkraft  Hinweis fuer die Lehrkraft (siehe unten, im Container)
// Zahl und Einheit stehen in einem <span> mit white-space:nowrap – so bricht
// „2 m“ in der schmalen Anzeige nicht um, und der Text bleibt ein normales
// Leerzeichen (werte.js und simfakten.js lesen „Rest 2 m“).
//
// Werte (alle aus _k6eRechne: k = Stuecke, r = Rest; nachgerechnet mit
// simcheck/werte.js – Endwerte nach dem Ablauf):
//   3 m  → 12-m-Band 4 Stücke, Rest 0 m · 18-m-Band 6 Stücke, Rest 0 m
//          Kurz: 12 m : 3 m = 4 · Kurz: 18 m : 3 m = 6
//   4 m  → 3, Rest 0 m · 4, Rest 2 m
//          Kurz: 12 m : 4 m = 3 · Kurz: 18 m : 4 m = 4 Rest 2 m
//   6 m  → 2, Rest 0 m · 3, Rest 0 m
//          Kurz: 12 m : 6 m = 2 · Kurz: 18 m : 6 m = 3
//   12 m → 1 Stück, Rest 0 m · 1 Stück, Rest 6 m
//          Kurz: 12 m : 12 m = 1 · Kurz: 18 m : 12 m = 1 Rest 6 m
//   frei: 2 m → 6, 0 m · 9, 0 m · 5 m → 2, 2 m · 3, 3 m ·
//         9 m → 1, 3 m · 2, 0 m · 1 m → 12 · 18, je 0 m ·
//         13 m → 0 Stücke, Rest 12 m · 1 Stück, Rest 5 m
// Start: zwei Baender, nicht geschnitten, keine Laenge gewaehlt
// („Start: Zwei Bänder, noch nicht geschnitten“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen; gilt fuer die Stuecklaenge,
// gleich ob ueber die Sprungmarke oder ueber „± 1 m“ erreicht):
//   6 m  – im Augenblick des letzten Schnitts am 18-m-Band: je ein Lichtring
//          um die beiden letzten Schnitte (bei 12 m und bei 18 m, also an
//          beiden Bandenden), beide leuchten 1,4 s bernsteinfarben nach.
//          Beide Baender enden ohne Reststueck – laenger als Lenis 3 m.
//   12 m – das 6-m-Reststueck des 18-m-Bands wird orange: Lichtring darum
//          (Radius 50 px, bleibt ueber dem Massband), es leuchtet 1,4 s nach.
//          Das widerlegt „12 m“.
//
// FUER DIE LEHRKRAFT (Container <div class="fpm-lehrkraft">, davor klein
// „Für die Lehrkraft:“, Reihenfolge wie im Bauplan; Bauart wie
// m5-teilen-schriftlich):
//   „Pause“ ↔ „weiter“ (_k6eAnhalten()): friert jede Bewegung sofort ein;
//     Schild „Pause“ oben RECHTS im Bild (oben links steht der Bandname).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_k6eTempo()): ein Drittel so schnell.
//   „Halt nach dem ersten Band: aus“ ↔ „… an“ (_k6eHaltSchalter()): haelt VON
//     SELBST an, wenn das 12-m-Band fertig geschnitten ist und seine Zeile auf
//     dem Zettel steht – bevor die Schere zum 18-m-Band wechselt. Schild
//     „Halt“ an der Stelle des Pause-Schilds. Mit „weiter“ geht es weiter.
//   Hinweiszeile _k6e-lehrkraft (in der Pause bernsteinfarben, „lmp-status
//   off“) nennt IMMER die Einstellung („… Halt: aus, Tempo: normal.“), so
//   aendert jeder Lehrkraft-Knopf eine Zeile:
//     sonst  „Für die Lehrkraft: „Pause“ hält alles an. „Halt nach dem ersten
//            Band“ stoppt vor dem 18-m-Band. Halt: aus, Tempo: normal.“
//     Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. …“
//     Halt   „Halt: Das 12-m-Band ist geschnitten, das 18-m-Band noch nicht.
//            Erst vermuten lassen, dann „weiter“. …“
//   EIN Zeitfaktor (0 angehalten, 1/3 langsam, 1 normal) an der einen Stelle,
//   an der dt in _k6eUpdate hineingeht. Der Halt ist ein EREIGNIS im Drehbuch
//   (P.halts): die Ablaufzeit bleibt genau dort stehen. Eine Sprungmarke,
//   „± 1 m“ und „neu“ heben Pause und Halt auf; „Tempo“ und „Halt“ bleiben
//   stehen (die Lehrkraft stellt sie einmal fuer die Stunde ein).
//   ABWEICHUNG: Der Bauplan nennt als Pausen-Aufheber nur Sprungmarke und
//   „neu“. „± 1 m“ hebt hier ebenfalls auf, weil es wie eine Sprungmarke
//   NEU schneidet (Bauplan: „schneidet neu“) – vormerken (wie „± 1 Reihe“ in
//   m5-punktefeld, das nur eine Reihe dazulegt) hiesse: Die Lehrkraft drueckt
//   „+ 1 m“ und es passiert nichts.
//   Voreinstellung: Pause aus, Halt aus, Tempo normal.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Teiler“, „gemeinsamer
// Teiler“, „ggT“, „größte“, ein Urteil („passt“, „geht“), die Regel als Satz.
// „höchstens“ steht nur in der Ueberschrift (Frage). Keine Namen, keine
// Punkte, keine Zeit, kein „falsch“, keine Liste der Laengen ohne Rest.
//
// Was ueber den Bauplan hinaus dazukam (alles Bild, keine neue Aussage):
// Laengen auf den Stuecken, der Zettel „Kurz“ im Bild (wie in m5-rest), die
// Bandnamen ueber den Baendern, die Startlinie, die Karolinien als Meter-
// Hilfslinien bis zum Massband.
// ════════════════════════════════════════════════════════════════════════
let _k6e = null;
const _k6eMARKEN = [3, 4, 6, 12];                  // Sprungmarken: Stuecklaenge in m
const _k6eBAND = [12, 18];                         // Laenge der Baender in m
const _k6eNAME = ['12-m-Band', '18-m-Band'];
const _k6eK = {
  S: 16, X0: 24, KY: 12,                           // 1 m = 16 px = 1 Kaestchen; Startlinie; erste Karozeile
  BY: [28, 92], BH: 16, LY: [23, 87], LX: 30,      // Baender: Oberkante, Hoehe; Bandnamen (Grundlinie, x)
  SY: 4, KL: 22, LG: 13,                           // Schere: Drehpunkt 4 px unter dem Band (stehend) bzw.
                                                   // 13 px darunter (liegend); Klingen 22 px
  MY: 140, MH: 20,                                 // Massband
  ZX0: 24, ZX1: 312, ZY0: 168, ZY1: 241,           // Zettel „Kurz“
  PX0: 4, PX1: 416, PY0: 4, PY1: 246,              // Papier
  RAND: 411,                                       // weiter rechts wird nichts gezeichnet
  NMIN: 1, NMAX: 18, LUECKE: 2,                    // Grenzen der Stuecklaenge; halbe Luecke im Schnitt (px)
  // Zeiten in s
  T_ZU: 0.35, T_LOS: 0.05, T_AUF: 0.15, T_FAHRT: 0.25, T_SCHNITT: 0.15, T_OFFEN: 0.12, T_HUPF: 0.3,
  T_HIN: 0.3,
  T_REST: 0.3, T_UMRISS: 0.4, T_KURZ: 0.35, T_WECHSEL: 0.5, T_SCHLUSS: 0.2,
  T_AHA: 1.4, T_GLANZ: 0.9, T_POP: 0.35, T_WACKEL: 0.45, LANGSAM: 1 / 3,
  // Farben: s1/s2 = Stuecke im Wechsel (s2 auch das ungeschnittene Band)
  F: [{ s1: '#b91c1c', s2: '#dc2626', rand: '#7f1d1d', text: '#b91c1c' },
      { s1: '#1d4ed8', s2: '#2563eb', rand: '#1e3a8a', text: '#1d4ed8' }],
  F_REST: '#fb923c', F_REST_RAND: '#c2410c', F_REST_DUNKEL: '#431407',
  F_TEXT: '#1f2937', F_GRAU: '#64748b', F_KARO: '#d4e3f1', F_BERN: '#f59e0b',
  F_LINIE: '#334155', F_GELB: '#fde047', F_GELB_RAND: '#a16207'
};

// ── Rechnen (eine Quelle fuer Bild, Zettel und Anzeige) ─────────────────
function _k6eRechne(n) {
  return _k6eBAND.map((L, b) => { const k = Math.floor(L / n); return { b, L, n, k, r: L - k * n }; });
}
function _k6eX(m) { return _k6eK.X0 + m * _k6eK.S; }
function _k6eMitte(b) { return _k6eK.BY[b] + _k6eK.BH / 2; }
// Lage der Schere: Drehpunkt (x, y) und Drehung w (0 = steht, Klingen nach oben;
// pi/2 = liegt unter dem Band, Klingen nach rechts, geschlossen)
function _k6eSteht(m, b) { return { x: _k6eX(m), y: _k6eK.BY[b] + _k6eK.BH + _k6eK.SY, w: 0 }; }
function _k6eLiegt(x, b) { return { x, y: _k6eK.BY[b] + _k6eK.BH + _k6eK.LG, w: Math.PI / 2 }; }
function _k6eStuecke(k) { return k === 1 ? '1 Stück' : k + ' Stücke'; }
// Zahl mit Einheit (oder ein Name) am Stueck, auf Wunsch farbig und fett
function _k6eG(s, farbe) {
  return '<span style="white-space:nowrap' + (farbe ? ';color:' + farbe + ';font-weight:700' : '') + '">' + s + '</span>';
}
function _k6eMisch(a, b, u) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(',') + ')';
}

// ── Drehbuch ────────────────────────────────────────────────────────────
// n = Stuecklaenge (null: nur zusammenlegen = Start). alt = Endstand des
// vorigen Laufs (wird in T_ZU zusammengelegt) oder null (Oeffnen).
function _k6ePlan(n, alt) {
  const K = _k6eK, F = K.F;
  const P = { n, alt, st: {}, baender: [null, null], wege: [], schnitte: [], halts: [], aha: [],
              glanz: [], tZu: alt ? K.T_ZU : 0, ende: 0 };
  const ev = (id, t, text) => { (P.st[id] = P.st[id] || []).push({ t, text }); };
  const name = b => _k6eG(_k6eNAME[b], F[b].text);
  ev('laenge', 0, 'Gewählte Stücklänge: ' + (n ? _k6eG(n + ' m') : 'noch keine'));
  for (let b = 0; b < 2; b++) {
    ev('band' + (b + 1), 0, name(b) + ': noch nicht geschnitten');
    ev('kurz' + (b + 1), 0, 'Kurz: …');
  }
  const start = _k6eLiegt(K.X0 + 28, 0);                      // liegt unter dem Anfang des 12-m-Bands
  P.schere0 = alt ? alt.schere : start;
  if (alt) P.wege.push({ t0: 0, t1: K.T_ZU, von: P.schere0, nach: start });
  let pos = start, t = P.tZu + K.T_LOS;
  const fahre = (ziel, dauer) => { P.wege.push({ t0: t, t1: t + dauer, von: pos, nach: ziel }); pos = ziel; t += dauer; };
  if (!n) { P.ende = t; P.schere = pos; return P; }

  for (const R of _k6eRechne(n)) {
    const b = R.b, B = Object.assign({ t0: t, schnitte: [], restT: null, fertig: 0 }, R);
    P.baender[b] = B;
    const kopf = 'Kurz: ' + _k6eG(R.L + ' m', F[b].text) + ' : ' + _k6eG(n + ' m') + ' = ';
    ev('kurz' + (b + 1), t, kopf + '…');
    // die erste Fahrt: aufnehmen (12-m-Band) bzw. hinueber zum 18-m-Band
    let dauer = b === 0 ? K.T_FAHRT + K.T_AUF : K.T_WECHSEL;
    const liegend = _k6eLiegt(_k6eX(R.L) - 10, b);             // danach liegt sie unter dem Bandende
    for (let i = 1; i <= R.k; i++) {
      fahre(_k6eSteht(i * n, b), dauer); dauer = K.T_FAHRT;
      const ts = t, tc = ts + K.T_SCHNITT / 2;                 // Klingen ganz zu: der Schnitt sitzt
      P.schnitte.push({ t: ts, b });
      B.schnitte.push({ m: i * n, t: tc });
      ev('band' + (b + 1), tc, name(b) + ': ' + _k6eStuecke(i) + ' …');
      t = ts + K.T_SCHNITT;
    }
    if (R.r > 0) {                                            // es bleibt ein kuerzeres Stueck
      fahre(_k6eSteht(R.L, b), dauer);
      B.restT = t;
      P.wege.push({ t0: t, t1: t + K.T_HIN, von: pos, nach: liegend }); pos = liegend;   // legt sich hin
      t += K.T_REST + K.T_UMRISS;
    } else {
      P.wege.push({ t0: t, t1: t + K.T_HIN, von: pos, nach: liegend }); pos = liegend;
    }
    B.fertig = t;
    const rest = R.r > 0 ? _k6eG(R.r + ' m', K.F_REST_RAND) : _k6eG('0 m');
    ev('band' + (b + 1), t, name(b) + ': ' + _k6eStuecke(R.k) + ', Rest ' + rest);
    ev('kurz' + (b + 1), t, kopf + R.k + (R.r > 0 ? ' ' + _k6eG('Rest ' + R.r + ' m', K.F_REST_RAND) : ''));
    t += K.T_KURZ;
    if (b === 0) P.halts.push({ t, b });                      // Halt nach dem ersten Band
  }
  // Aha – an der Stuecklaenge festgemacht
  const B1 = P.baender[0], B2 = P.baender[1];
  if (n === 6) {
    const ta = B2.schnitte[B2.schnitte.length - 1].t;          // letzter Schnitt am 18-m-Band
    for (const B of [B1, B2]) {
      const m = B.schnitte[B.schnitte.length - 1].m;
      P.aha.push({ t: ta, x: _k6eX(m), y: _k6eMitte(B.b), r: 26 });
      P.glanz.push({ art: 'schnitt', b: B.b, m, t0: ta, t1: ta + K.T_AHA });
    }
  }
  if (n === 12) {
    const x0 = _k6eX(B2.k * n), x1 = _k6eX(B2.L);
    P.aha.push({ t: B2.restT, x: (x0 + x1) / 2, y: _k6eMitte(1), r: 50 });
    P.glanz.push({ art: 'rest', b: 1, t0: B2.restT, t1: B2.restT + K.T_AHA });
  }
  P.ende = t + K.T_SCHLUSS;
  P.schere = pos;
  return P;
}

// Wo ist die Schere zur Ablaufzeit at? (Drehpunkt x, y; Drehung w; offen 0..1)
function _k6eSchereOrt(P, at) {
  let ort = Object.assign({}, P.schere0);
  for (const g of P.wege) {
    if (at < g.t0) break;
    if (at >= g.t1) { ort = Object.assign({}, g.nach); continue; }
    const u = _bioFxEase.sanft((at - g.t0) / (g.t1 - g.t0)), A = g.von, B = g.nach;
    ort = { x: A.x + (B.x - A.x) * u, y: A.y + (B.y - A.y) * u, w: A.w + (B.w - A.w) * u };
    break;
  }
  ort.offen = 1 - ort.w / (Math.PI / 2);                      // liegend: geschlossen
  for (const s of P.schnitte) {
    const u = (at - s.t) / _k6eK.T_SCHNITT;
    if (u >= 0 && u <= 1) { ort.offen = Math.min(ort.offen, 1 - Math.sin(Math.PI * u)); break; }
  }
  return ort;
}

// ── Zustand ─────────────────────────────────────────────────────────────
function _k6eInit() {
  _k6e = { n: null, lauf: { plan: _k6ePlan(null, null), at: 0 }, fx: [], t: 0, sig: '',
           grenze: '', wackel: 0,
           // fuer die Lehrkraft: angehalten? warum (Halt)? Schalter Halt / langsam
           steht: false, haltInfo: null, haltAn: false, langsam: false };
}
// Einen Lauf beginnen: der laufende kommt sofort an (sein Endstand wird
// zusammengelegt), dann das Neue. Hebt Pause und Halt auf.
function _k6eStarte(n) {
  const z = _k6e, alt = z.lauf.plan;
  z.n = n;
  z.lauf = { plan: _k6ePlan(n, { baender: alt.baender, schere: alt.schere }), at: 0 };
  z.steht = false; z.haltInfo = null; z.grenze = '';
  z.fx.length = 0;
}

function _k6eHTML() {
  const marke = n => `<button class="sim-btn" id="_k6e-b-${n}" onclick="_k6eMarke(${n})">${n}&nbsp;m</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie lang können die Stücke höchstens sein?</h3>
    <div class="fpm-note" style="margin-top:2px">Die Schere schneidet beide Bänder in gleich lange Stücke. Wähle die Länge.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_k6e-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_k6eMARKEN.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_k6eSchritt(-1)">−&nbsp;1&nbsp;m</button>
          <button class="sim-btn" onclick="_k6eSchritt(1)">+&nbsp;1&nbsp;m</button>
          <button class="sim-btn" onclick="_k6eNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_k6e-pause" onclick="_k6eAnhalten()">Pause</button>
            <button class="sim-btn" id="_k6e-tempo" onclick="_k6eTempo()">Tempo: <span id="_k6e-tempo-an">normal</span></button>
            <button class="sim-btn" id="_k6e-halt" onclick="_k6eHaltSchalter()">Halt nach dem ersten Band: <span id="_k6e-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_k6e-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_k6e-laenge" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6e-band1" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6e-band2" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6e-kurz1" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6e-kurz2" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_k6e-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Zwei Bänder, noch nicht geschnitten</p>
  </div>`;
}

// Was die Anzeige gerade sagt – sie folgt dem Bild (Ereignisse im Drehbuch).
function _k6eTexte() {
  const P = _k6e.lauf.plan, at = _k6e.lauf.at;
  const wert = id => { let v = ''; for (const e of (P.st[id] || [])) if (e.t <= at) v = e.text; return v; };
  return { laenge: wert('laenge'), band1: wert('band1'), band2: wert('band2'),
           kurz1: wert('kurz1'), kurz2: wert('kurz2') };
}
function _k6eHinweis() {
  const z = _k6e;
  const kopf = z.haltInfo ? 'Halt: Das 12-m-Band ist geschnitten, das 18-m-Band noch nicht. Erst vermuten lassen, dann „weiter“.'
    : z.steht ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : 'Für die Lehrkraft: „Pause“ hält alles an. „Halt nach dem ersten Band“ stoppt vor dem 18-m-Band.';
  return kopf + ' Halt: ' + (z.haltAn ? 'an' : 'aus') + ', Tempo: ' + (z.langsam ? 'langsam' : 'normal') + '.';
}
function _k6eSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Schreibt die Anzeige, wenn sich etwas geaendert hat (immer = true: auf jeden Fall).
function _k6eStatus(immer) {
  if (!_k6e) return;
  const z = _k6e, T = _k6eTexte();
  const sig = JSON.stringify(T) + '|' + z.n + '|' + z.steht + '|' + !!z.haltInfo + '|' + z.haltAn + '|' +
              z.langsam + '|' + z.grenze;
  if (!immer && sig === z.sig) return;
  z.sig = sig;
  for (const id of ['laenge', 'band1', 'band2', 'kurz1', 'kurz2']) _k6eSetze('_k6e-' + id, T[id]);
  const g = _k6eSetze('_k6e-grenze', z.grenze);
  if (g && g.style) g.style.display = z.grenze ? '' : 'none';
  for (const n of _k6eMARKEN) {
    const b = document.getElementById('_k6e-b-' + n);
    if (b && b.classList) b.classList.toggle('primary', n === z.n);
  }
  // fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _k6eSetze('_k6e-pause', z.steht ? 'weiter' : 'Pause');
  _k6eSetze('_k6e-tempo-an', z.langsam ? 'langsam' : 'normal');
  _k6eSetze('_k6e-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _k6eSetze('_k6e-lehrkraft', _k6eHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.steht ? 'off' : 'on');
  for (const [id, an] of [['_k6e-pause', z.steht], ['_k6e-tempo', z.langsam], ['_k6e-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _k6eMarke(n) {
  if (!_k6e || _k6eMARKEN.indexOf(n) < 0) return;
  _k6eStarte(n);
  _k6eStatus(true);
}
// „− 1 m“ / „+ 1 m“: neue Stuecklaenge, schneidet neu
function _k6eSchritt(d) {
  if (!_k6e || (d !== 1 && d !== -1)) return;
  const z = _k6e, K = _k6eK;
  z.grenze = '';
  const wackeln = text => { z.wackel = K.T_WACKEL; z.grenze = text; _k6eStatus(true); };
  if (z.n === null) {
    if (d < 0) return wackeln('Noch keine Stücklänge gewählt.');
    _k6eStarte(K.NMIN);
  } else if (z.n + d < K.NMIN) {
    return wackeln('Kürzer als 1 m schneidet die Schere nicht.');
  } else if (z.n + d > K.NMAX) {
    return wackeln('Mehr als 18 m hat keines der Bänder.');
  } else {
    _k6eStarte(z.n + d);
  }
  _k6eStatus(true);
}
function _k6eNeu() {
  if (!_k6e) return;
  _k6eStarte(null);
  _k6eStatus(true);
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _k6eAnhalten() {
  const z = _k6e;
  if (!z) return;
  z.steht = !z.steht;
  z.haltInfo = null;                       // „weiter“ nach einem Halt: die Schere wechselt jetzt
  _k6eStatus(true);
}
function _k6eTempo() {
  const z = _k6e;
  if (!z) return;
  z.langsam = !z.langsam;
  _k6eStatus(true);
}
function _k6eHaltSchalter() {
  const z = _k6e;
  if (!z) return;
  z.haltAn = !z.haltAn;                    // gilt fuer den naechsten Wechsel zum 18-m-Band
  _k6eStatus(true);
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _k6eUpdate(dt) {
  if (!_k6e) return;
  const z = _k6e, K = _k6eK;
  const roh = _bioFxDt(dt);
  z.wackel = Math.max(0, z.wackel - roh);            // Wackeln an der Grenze: in echter Zeit
  if (z.steht) return;                               // angehalten: nichts laeuft weiter
  dt = roh * (z.langsam ? K.LANGSAM : 1);            // EIN Zeitfaktor: 1/3 langsam, sonst 1
  if (!(dt > 0)) return;
  z.t += dt;
  const L = z.lauf, P = L.plan;
  let neu = L.at + dt, halt = null;
  if (z.haltAn) {
    for (const h of P.halts) if (L.at < h.t && neu >= h.t) { neu = h.t; halt = h; break; }
  }
  for (const a of P.aha) if (L.at < a.t && neu >= a.t) _bioFxWelle(z.fx, a.x, a.y, K.F_BERN, a.r);
  L.at = neu;
  if (halt) { z.steht = true; z.haltInfo = halt; }
  _bioFxUpdate(z.fx, dt);
  _k6eStatus(!!halt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _k6eText(ctx, s, x, y, gr, farbe, gew, ausr) {
  ctx.fillStyle = farbe || _k6eK.F_TEXT;
  ctx.font = (gew || '700') + ' ' + gr + 'px sans-serif';
  ctx.textAlign = ausr || 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function _k6ePapier(ctx) {
  const K = _k6eK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  for (let x = K.X0 - K.S; x < K.PX1 - 1; x += K.S) {        // senkrechte Linien genau auf den Metern
    ctx.beginPath(); ctx.moveTo(x, K.PY0 + 1); ctx.lineTo(x, K.PY1 - 1); ctx.stroke();
  }
  for (let y = K.KY; y < K.PY1 - 1; y += K.S) {
    ctx.beginPath(); ctx.moveTo(K.PX0 + 1, y); ctx.lineTo(K.PX1 - 1, y); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.stroke();
  ctx.restore();
}
// Massband 0–18 m, Strich und Zahl je Meter, Achsentitel rechts hinter dem Ende
function _k6eMassband(ctx) {
  const K = _k6eK, y = K.MY, h = K.MH, x0 = K.X0 - 6, x1 = _k6eX(18) + 6;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, x0 + 1, y + 2, x1 - x0, h, 3); ctx.fill();
  ctx.fillStyle = K.F_GELB; ctx.strokeStyle = K.F_GELB_RAND; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x0, y, x1 - x0, h, 3); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = K.F_TEXT; ctx.lineCap = 'butt';
  for (let m = 0; m <= 18; m++) {
    const x = _k6eX(m), fuenf = m % 5 === 0;
    ctx.lineWidth = fuenf ? 1.6 : 1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + (fuenf ? 8 : 5)); ctx.stroke();
    _k6eText(ctx, String(m), x, y + h - 3, 11, K.F_TEXT, fuenf ? '700' : '400');
  }
  _k6eText(ctx, 'Länge in m', x1 + 7, y + 14, 12, K.F_LINIE, '700', 'left');
  ctx.restore();
}
// Startlinie bei 0 m (durch beide Baender bis zum Massband) und die Bandnamen
function _k6eRahmen(ctx) {
  const K = _k6eK;
  ctx.save();
  ctx.strokeStyle = K.F_LINIE; ctx.lineWidth = 2; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(K.X0, K.BY[0] - 3); ctx.lineTo(K.X0, K.MY); ctx.stroke();
  for (let b = 0; b < 2; b++) _k6eText(ctx, _k6eNAME[b], K.LX, K.LY[b], 12, K.F[b].text, '700', 'left');
  ctx.restore();
}
// Ein Band zur Ablaufzeit at. B = Band aus dem Plan (null: ganz),
// aus = 0..1: wie weit ein alter Lauf schon zusammengelegt ist.
function _k6eBandZeichnen(ctx, b, B, at, aus) {
  const K = _k6eK, F = K.F[b], L = _k6eBAND[b], y0 = K.BY[b], h = K.BH;
  const kl = _bioFxKlemme, E = _bioFxEase, bleibt = 1 - aus;
  const cuts = B ? B.schnitte.filter(s => s.t <= at) : [];
  const luecke = s => K.LUECKE * E.sanft(kl((at - s.t) / K.T_OFFEN)) * bleibt;
  const st = [];
  let a = 0, ga = 0;
  cuts.forEach((s, i) => {
    const g = luecke(s);
    st.push({ a, e: s.m, ga, ge: g, fertig: true, i, t: s.t });
    a = s.m; ga = g;
  });
  if (a < L) st.push({ a, e: L, ga, ge: 0, fertig: false, rest: !!(B && B.restT !== null && at >= B.restT) });
  ctx.save();
  // gestrichelter Umriss: was bis zur vollen Stuecklaenge fehlt
  if (B && B.restT !== null && at >= B.restT + K.T_REST) {
    const anteil = E.sanft(kl((at - B.restT - K.T_REST) / K.T_UMRISS));
    const xs = _k6eX(L) + 1, xz = _k6eX(B.k * B.n + B.n) - 1;
    const xe = Math.min(K.RAND, xs + (xz - xs) * anteil);
    if (xe > xs + 1 && bleibt > 0.01) {
      ctx.globalAlpha = bleibt;
      ctx.fillStyle = 'rgba(251,146,60,0.13)';
      ctx.fillRect(xs, y0, xe - xs, h);
      ctx.strokeStyle = K.F_REST_RAND; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(xs, y0 + 0.75); ctx.lineTo(xe, y0 + 0.75);
      if (xz <= K.RAND && anteil >= 1) ctx.lineTo(xe, y0 + h - 0.75);
      else ctx.moveTo(xe, y0 + h - 0.75);
      ctx.lineTo(xs, y0 + h - 0.75);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
  }
  for (const s of st) {
    const x0 = _k6eX(s.a) + s.ga, x1 = _k6eX(s.e) - s.ge;
    if (x1 - x0 < 1) continue;
    let dy = 0, fuell = F.s2, rand = F.rand, schrift = null, sa = 0, sf = '#ffffff', orange = 0;
    if (s.fertig) {
      fuell = _k6eMisch(s.i % 2 === 0 ? F.s1 : F.s2, F.s2, aus);
      if (aus === 0) dy = -3 * Math.sin(Math.PI * kl((at - s.t) / K.T_HUPF));   // rueckt ab
      schrift = B.n + ' m'; sa = E.raus(kl((at - s.t - 0.05) / 0.25)) * bleibt;
    } else if (s.rest) {
      orange = E.sanft(kl((at - B.restT) / K.T_REST)) * bleibt;   // Orange schiebt sich darueber
      if (aus === 0) dy = -3 * Math.sin(Math.PI * kl((at - B.restT) / K.T_HUPF));
      schrift = B.r + ' m'; sa = kl((at - B.restT - 0.1) / 0.25) * bleibt; sf = K.F_REST_DUNKEL;
    }
    const y = y0 + dy;
    ctx.fillStyle = fuell; ctx.strokeStyle = rand; ctx.lineWidth = 1;
    ctx.fillRect(x0, y, x1 - x0, h);
    ctx.strokeRect(x0 + 0.5, y + 0.5, x1 - x0 - 1, h - 1);
    if (orange > 0.01) {                                     // Rest: Orange von links nach rechts (zurueck: umgekehrt)
      const xo = x0 + (x1 - x0) * orange;
      ctx.fillStyle = K.F_REST; ctx.strokeStyle = K.F_REST_RAND;
      ctx.fillRect(x0, y, xo - x0, h);
      ctx.strokeRect(x0 + 0.5, y + 0.5, xo - x0 - 1, h - 1);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.22)';                // Glanzstreifen: Stoffband
    ctx.fillRect(x0 + 1, y + 3, x1 - x0 - 2, 2);
    if (schrift && sa > 0.01) {
      ctx.font = '700 11px sans-serif';
      if (ctx.measureText(schrift).width + 6 <= x1 - x0) {
        ctx.globalAlpha = sa;
        _k6eText(ctx, schrift, (x0 + x1) / 2, y + h / 2 + 4, 11, sf, '700');
        ctx.globalAlpha = 1;
      }
    }
  }
  // Blitz im Schnitt
  if (aus === 0) {
    for (const s of cuts) {
      const u = (at - s.t) / 0.25;
      if (u < 0 || u >= 1) continue;
      ctx.globalAlpha = 1 - u;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(_k6eX(s.m), y0 - 3); ctx.lineTo(_k6eX(s.m), y0 + h + 3); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}
function _k6eBaender(ctx, P, at) {
  if (P.alt && at < P.tZu) {
    const aus = _bioFxEase.sanft(_bioFxKlemme(at / P.tZu));
    for (let b = 0; b < 2; b++) _k6eBandZeichnen(ctx, b, P.alt.baender[b], Infinity, aus);
  } else {
    for (let b = 0; b < 2; b++) _k6eBandZeichnen(ctx, b, P.baender[b], at, 0);
  }
}
// Aha: bernsteinfarbenes Nachleuchten (ruhig pulsierend)
function _k6eGlanz(ctx, P, at) {
  const K = _k6eK;
  for (const g of P.glanz) {
    if (at < g.t0 || at >= g.t1) continue;
    const B = P.baender[g.b], y0 = K.BY[g.b], h = K.BH;
    const rest = at - g.t0, puls = 0.6 + 0.4 * Math.sin(rest * Math.PI * 2 * 1.2);
    const a = Math.min(1, rest / 0.15, (g.t1 - at) / 0.4) * puls;
    let x0, x1;
    if (g.art === 'schnitt') { x0 = _k6eX(g.m) - 8; x1 = _k6eX(g.m) + 8; }
    else { x0 = _k6eX(B.k * B.n) - 1; x1 = _k6eX(B.L) + 2; }
    ctx.save();
    ctx.globalAlpha = Math.max(0, a);
    ctx.fillStyle = 'rgba(252,211,77,0.30)'; ctx.strokeStyle = K.F_BERN; ctx.lineWidth = 2.5;
    _bioFxRundRect(ctx, x0, y0 - 6, x1 - x0, h + 10, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
}
// Teile einer Zeile auf dem Zettel
function _k6eKurzTeile(B, fertig) {
  const K = _k6eK, F = K.F[B.b];
  const t = [{ s: B.L + ' m', f: F.text }, { s: ':', f: K.F_TEXT }, { s: B.n + ' m', f: K.F_TEXT },
             { s: '=', f: K.F_TEXT }];
  if (!fertig) t.push({ s: '…', f: K.F_GRAU });
  else {
    t.push({ s: String(B.k), f: K.F_TEXT, pop: true });
    if (B.r > 0) t.push({ s: 'Rest ' + B.r + ' m', f: K.F_REST_RAND, pop: true });
  }
  return t;
}
function _k6eZeile(ctx, B, fertig, x, y, a, nachFertig) {
  const K = _k6eK, teile = _k6eKurzTeile(B, fertig), gr = 15, luft = 5;
  if (a <= 0.01) return;
  ctx.save();
  ctx.font = '700 ' + gr + 'px sans-serif';
  const br = teile.map(t => ctx.measureText(t.s).width);
  const ges = br.reduce((s, w) => s + w, 0) + luft * (teile.length - 1);
  // die Zeile leuchtet kurz, wenn ihr Ergebnis dazukommt
  if (fertig && nachFertig >= 0 && nachFertig < K.T_GLANZ) {
    ctx.globalAlpha = a * (1 - nachFertig / K.T_GLANZ);
    ctx.fillStyle = 'rgba(253,230,138,0.7)'; ctx.strokeStyle = K.F_BERN; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, x - 26, y - gr + 1, ges + 32, gr + 6, 5); ctx.fill(); ctx.stroke();
  }
  ctx.globalAlpha = a;
  // Farbmarke: ein kleines Stueck des Bands
  ctx.fillStyle = K.F[B.b].s2; ctx.strokeStyle = K.F[B.b].rand; ctx.lineWidth = 1;
  ctx.fillRect(x - 22, y - 10, 16, 9); ctx.strokeRect(x - 21.5, y - 9.5, 15, 8);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  teile.forEach((t, i) => {
    ctx.fillStyle = t.f;
    const pop = t.pop && nachFertig >= 0 && nachFertig < K.T_POP ? nachFertig / K.T_POP : 1;
    if (pop < 1) {
      const k = Math.max(0.6, _bioFxEase.federn(pop));
      ctx.save(); ctx.translate(x + br[i] / 2, y - gr * 0.36); ctx.scale(k, k);
      ctx.textAlign = 'center'; ctx.fillText(t.s, 0, gr * 0.36);
      ctx.restore();
    } else ctx.fillText(t.s, x, y);
    x += br[i] + luft;
  });
  ctx.restore();
}
function _k6eZettel(ctx, P, at) {
  const K = _k6eK, x = K.ZX0 + 34, ys = [K.ZY0 + 38, K.ZY0 + 64];
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.ZX0 + 2, K.ZY0 + 3, K.ZX1 - K.ZX0, K.ZY1 - K.ZY0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.ZX0, K.ZY0, K.ZX1 - K.ZX0, K.ZY1 - K.ZY0, 6); ctx.fill(); ctx.stroke();
  _k6eText(ctx, 'Kurz', K.ZX0 + 10, K.ZY0 + 15, 11, K.F_GRAU, '700', 'left');
  ctx.restore();
  if (P.alt && at < P.tZu) {                                  // alte Zeilen blassen aus
    const a = 1 - _bioFxKlemme(at / P.tZu);
    for (const B of P.alt.baender) if (B) _k6eZeile(ctx, B, true, x, ys[B.b], a, Infinity);
    return;
  }
  for (const B of P.baender) {
    if (!B || at < B.t0) continue;
    const fertig = at >= B.fertig;
    _k6eZeile(ctx, B, fertig, x, ys[B.b], _bioFxKlemme((at - B.t0) / 0.2), fertig ? at - B.fertig : -1);
  }
}
// Die Schere: Drehpunkt (x, y), Griffe nach unten, Klingen nach oben, um dreh gedreht; offen 0..1
function _k6eSchere(ctx, x, y, dreh, offen) {
  const K = _k6eK, w = 0.3 * offen;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(dreh);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const s of [-1, 1]) {                                  // Griffe
    ctx.save();
    ctx.rotate(s * w * 0.5);
    ctx.strokeStyle = K.F_LINIE; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(0, 1); ctx.lineTo(s * 4, 8); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(s * 6, 13.5, 4.2, 5.2, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  for (const s of [-1, 1]) {                                  // Klingen
    ctx.save();
    ctx.rotate(s * w);
    ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-2.2, 0); ctx.lineTo(0, -K.KL); ctx.lineTo(2.2, 0); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = K.F_LINIE;
  ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// Schild „Pause“ bzw. „Halt“ oben rechts (oben links steht der Bandname)
function _k6ePauseSchild(ctx, text) {
  const w = 64, h = 25, x = 344, y = 7;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 7, y + 6.5, 3.5, 12); ctx.fillRect(x + 13.5, y + 6.5, 3.5, 12);   // Pausezeichen
  ctx.font = '700 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, x + 22, y + 17.5);
  ctx.restore();
}
function _k6eDraw(ctx, cv) {
  if (!_k6e) return;
  const z = _k6e, W = cv.width, H = cv.height, P = z.lauf.plan, at = z.lauf.at;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _k6ePapier(ctx);
  _k6eMassband(ctx);
  _k6eRahmen(ctx);
  _k6eGlanz(ctx, P, at);
  _k6eBaender(ctx, P, at);
  _bioFxDraw(ctx, z.fx);                                      // Lichtring
  _k6eZettel(ctx, P, at);
  const o = _k6eSchereOrt(P, at);
  const wk = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / _k6eK.T_WACKEL) : 0;
  _k6eSchere(ctx, o.x + wk, o.y, o.w, o.offen);
  if (z.steht) _k6ePauseSchild(ctx, z.haltInfo ? 'Halt' : 'Pause');
}
