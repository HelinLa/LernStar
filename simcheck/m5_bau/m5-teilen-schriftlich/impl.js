
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mm6 „Wie teilt man schriftlich?“
// (Kennung m5-teilen-schriftlich, Praefix _m5w)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL4_PROFIL.md, Abschnitt m5-teilen-schriftlich.
// Ueberschrift = Frage der Einheit: „Was ergibt 84 : 3 wirklich?“
//
// Was man sieht – drei Teile, durch die FARBE der Stelle verbunden (H rot,
// Z blau, E gruen wie in m5-buendeln / m5-minus-schriftlich):
//   RECHENBLATT (oben, Karopapier, Kaestchen 18 px) in der Schreibweise des
//     Hefts (build_pilot.py, _malgeteilt_zeichnen): Spalte 0 frei fuer das
//     Minuszeichen, dann die Ziffern der Startzahl, „:“, der Teiler, „=“, das
//     Ergebnis. Darunter je Stelle „− Produkt“, ein Strich und der Rest mit der
//     heruntergeholten naechsten Ziffer (84 : 3: − 6 / 24 / − 24 / 0). Ueber den
//     Ziffern der Startzahl klein H Z E; jede Spalte ist in ihrer Stellenfarbe
//     getoent. Die Zahl, die gerade geteilt wird, ist gelb hinterlegt; die
//     heruntergeholte Ziffer gleitet sichtbar nach unten und leuchtet dabei.
//   MATERIAL DER STARTZAHL (daneben): drei Felder H | Z | E wie die
//     Stellenwerttafel – Platten (Fuenfersaeule), Stangen (10 Wuerfel mit
//     Fuenfermarke, 5 + 5 je Reihe), Wuerfel (Zehnerreihen, Fuenferluecke).
//   TELLER (unten, ueber die ganze Breite): so viele wie der Teiler. Auf jedem
//     Teller liegen die Stuecke in der Reihenfolge H, Z, E – am Ende liest man
//     dort die Ziffern des Ergebnisses als Material (129: 1 Platte, 2 Stangen,
//     9 Wuerfel).
//
// Bewegung (eine Sprungmarke spielt die Aufgabe SELBST ab, N1 im Bauplan: ein
// Schritt im Heft = eine Handlung; anhalten kann die Lehrkraft). Stelle fuer
// Stelle von der groessten Stelle her:
//   zeigen     0,3 s  Feld und Zahl im Blatt gelb (die Zeile davor bleibt so lange stehen)
//   verteilen  Statuszeile „Zehner: 8 : 3 …“; je Runde ein Stueck auf jeden Teller,
//              0,5 s je Runde (die Stuecke
//              sinken aus dem Feld nach unten und gleiten auf ihren Teller)
//   schreiben  die Ergebnisziffer erscheint federnd hinter „=“
//   abziehen   „− 6“, der Strich und der Rest erscheinen im Blatt; was uebrig
//              ist, wird orange umrandet
//   entbuendeln (Rest > 0): jedes uebrige Stueck zerfaellt sichtbar in 10
//              kleinere (0,5 s), die ins naechste Feld gleiten und sich zu dessen
//              Stuecken legen (0,6 s); gleichzeitig gleitet im Blatt die naechste
//              Ziffer herunter (2 -> 24).
//   herunterholen (Rest 0): nur die Ziffer gleitet herunter (0 -> 09).
// Alles ist eine Funktion der Ablaufzeit (_m5wPlan baut das Drehbuch EINMAL,
// _m5wZustand liest es ab): keine Zufallszahl, jede Zahl im Bild und in den
// Statuszeilen kommt aus _m5wRechne.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5wAufgabe('…')):
//     „69 : 3“ · „84 : 3“ · „516 : 4“ – laden die Aufgabe und spielen sie ab.
//   „noch einmal“ (_m5wNochmal()): die geladene Aufgabe neu abspielen.
//   „jede Stelle einzeln“ (_m5wEinzeln()): der Weg aus dem Problem des Hefts
//     fuer die geladene Aufgabe – jede Stelle wird fuer sich verteilt, die
//     uebrigen Stuecke bleiben orange blinkend liegen, nichts wird entbuendelt.
//     (Der Bauplan nennt den Knopf „Tareks Weg“. Eine Simulation traegt keine
//     Figurennamen – MATHE_PROFIL § 10 Regel 11, und der Bauplan selbst sagt
//     unter „Die sechs Simulationen – Allgemein“: „keine Namen“. So schon in
//     m5-rechenstrich („nebeneinander schreiben“) und m5-malkreuz. Kein
//     Heftschritt von mm6 nennt den Knopf. Wer den Namen doch will:
//     _m5wKNOPF_EINZELN und _m5wZEILE_EINZELN aendern.)
//   „neu“ (_m5wNeu()): wieder 84 : 3 geladen, nicht gerechnet.
//   Jeder dieser Knoepfe beginnt neu: das alte Material faellt weg, das neue
//   faellt von oben in die Felder.
//
// Statuszeilen (woertlich; jede, deren Wert das Heft verlangt, hat mehr als
// 18 Zeichen, sonst fehlt sie im Faktendump):
//   _m5w-aufgabe      „Aufgabe: 84 : 3 (schriftlich)“
//   _m5w-schritt      Start „Noch keine Stelle gerechnet.“, dann waechst die
//                     Zeile mit dem Bild: „Zehner: 8 : 3 …“ -> „Zehner: 8 : 3 = 2 …“
//                     -> „Zehner: 8 : 3 = 2, Rest 2“ -> „Entbündeln: 2 Z sind 20 E …“
//                     -> „Entbündeln: 2 Z sind 20 E, mit 4 E: 24 E“ -> „Einer: 24 : 3 …“
//                     -> … -> „Einer: 24 : 3 = 8, Rest 0“
//                     bei „jede Stelle einzeln“: „Zehner einzeln: 8 : 3 = 2, 2 Z
//                     bleiben liegen“ -> „Einer einzeln: 4 : 3 = 1, 1 E bleibt liegen“
//   _m5w-entbuendelt  „Entbündelt wurde bei: …“, am Ende „… bei: Z“ /
//                     „… bei: nirgends“ / „… bei: H und Z“
//   _m5w-teller       „Auf jedem Teller: …“, am Ende „Auf jedem Teller: 2 Z, 8 E“
//   _m5w-ergebnis     „Ergebnis der Aufgabe: …“, am Ende „Ergebnis der Aufgabe: 28“
//   _m5w-probe        „Probe mit der Malaufgabe: …“, am Ende „… 28 · 3 = 84“
//   _m5w-tarek        nur nach „jede Stelle einzeln“ (sonst leer und versteckt):
//                     „Jede Stelle einzeln geteilt: 21, Probe 21 · 3 = 63“
//                     (Bauplan: „Tareks Weg: 21, Probe 21 · 3 = 63“ – ohne den
//                     Namen, siehe oben; die Kennung bleibt.)
//   _m5w-lehrkraft    Hinweis fuer die Lehrkraft (siehe unten)
//
// Werte (jede Zahl aus _m5wRechne, nachgerechnet mit simcheck/werte.js):
//   69 : 3  → „Zehner: 6 : 3 = 2, Rest 0“, „Einer: 9 : 3 = 3, Rest 0“ ·
//             bei: nirgends · Teller 2 Z, 3 E · 23 · Probe 23 · 3 = 69 ·
//             einzeln: 23, Probe 23 · 3 = 69
//   84 : 3  → „Zehner: 8 : 3 = 2, Rest 2“, „Entbündeln: 2 Z sind 20 E, mit 4 E:
//             24 E“, „Einer: 24 : 3 = 8, Rest 0“ · bei: Z · Teller 2 Z, 8 E ·
//             28 · Probe 28 · 3 = 84 · einzeln: 21, Probe 21 · 3 = 63
//   516 : 4 → „Hunderter: 5 : 4 = 1, Rest 1“, „Entbündeln: 1 H sind 10 Z, mit
//             1 Z: 11 Z“, „Zehner: 11 : 4 = 2, Rest 3“, „Entbündeln: 3 Z sind
//             30 E, mit 6 E: 36 E“, „Einer: 36 : 4 = 9, Rest 0“ · bei: H und Z ·
//             Teller 1 H, 2 Z, 9 E · 129 · Probe 129 · 4 = 516 ·
//             einzeln: 5 : 4 = 1, 1 : 4 = 0, 6 : 4 = 1 -> 101, Probe 101 · 4 = 404
// Start: 84 : 3 geladen, noch nicht gerechnet.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): in 84 : 3 zerfallen die 2
// uebrigen Stangen in 20 Wuerfel – Lichtring dort. Das widerlegt „21“ (die 2
// Stangen bleiben nicht liegen) und „8 : 3 geht nicht“ (es geht, mit Rest).
// Am Ende leuchten das Ergebnis im Blatt und die Teller kurz nach.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-minus-schriftlich, Container fpm-lehrkraft
// fuer simfakten.js, V3 im Bauplan). Eigene Zeile UNTER den Heftknoepfen,
// davor klein „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m5wAnhalten()): friert JEDE Bewegung sofort ein;
//     „weiter“ macht genau dort weiter. Schild „Pause“ im Blatt oben in der
//     freien Kopfzeile (dort steht bei keiner Aufgabe etwas).
//   „Halt beim Entbündeln: aus“ ↔ „… an“ (_m5wHaltSchalter()): haelt VON
//     SELBST an, bevor uebrige Stuecke zerfallen. Sie sind dick orange
//     umrandet, darunter das Schild „2 Zehner werden zu 20 Einern.“ (bzw.
//     „1 Hunderter wird zu 10 Zehnern.“, „3 Zehner werden zu 30 Einern.“).
//     Bei 516 : 4 zweimal. Mit „weiter“ zerfallen sie.
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m5wTempo()): ein Drittel so schnell.
//   Eine Sprungmarke, „noch einmal“, „jede Stelle einzeln“ oder „neu“ heben die
//   Pause auf; „Halt“ und „Tempo“ bleiben stehen (die Lehrkraft stellt sie
//   einmal fuer die Stunde ein).
// Bauart: EIN Zeitfaktor (0 angehalten, 1/3 langsam, 1 normal) an der einen
// Stelle, an der dt in _m5wUpdate hineingeht. Der Halt ist ein EREIGNIS im
// Drehbuch (P.halts), keine gemessene Zeit: Die Ablaufzeit bleibt genau davor
// stehen. Voreinstellung: Pause aus, Halt aus, Tempo normal -> Faktor 1.
// Hinweiszeile _m5w-lehrkraft (in der Pause bernsteinfarben „lmp-status off“)
// nennt IMMER die Einstellung („… Halt: aus, Tempo: normal.“) – so aendert
// jeder Lehrkraft-Knopf eine Zeile, und simfakten.js laesst einen Schalter
// nicht einmal umgelegt stehen (gleiche Loesung wie m5-verteilen).
// Nur das wechselnde Wort der Aufschrift steht in einem eigenen <span>.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „links“, „rechts“
// (auch „von links“, „nach rechts“, „rechts daneben“) – und keine Regel als
// Satz (kein „Merke“, kein Text, wo das Teilen beginnt oder wohin ein Rest
// wandert). Das zeigt nur das Bild. Keine Namen, keine Punkte, keine Zeit,
// kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m5w = null;
const _m5wAUFGABEN = { '69-3': ['69', 3], '84-3': ['84', 3], '516-4': ['516', 4] };
const _m5wREIHE = ['69-3', '84-3', '516-4'];
const _m5wSTART = '84-3';
const _m5wSP = ['H', 'Z', 'E'];
const _m5wWORT = { H: 'Hunderter', Z: 'Zehner', E: 'Einer' };
const _m5wDATIV = { H: 'Hundertern', Z: 'Zehnern', E: 'Einern' };
const _m5wKNOPF_EINZELN = 'jede Stelle einzeln';
const _m5wZEILE_EINZELN = 'Jede Stelle einzeln geteilt: ';
const _m5wK = {
  // Rechenblatt: Karo 18 px, Spalte 0 frei fuer das Minuszeichen, Zeile 0 = H Z E
  PX0: 4, PX1: 191, PY0: 4, PY1: 155, GX: 8, GY: 8, C: 18,
  // Material der Startzahl: Felder wie die Stellenwerttafel
  MX0: 196, MX1: 416, MY0: 4, MY1: 112,
  FELD: { H: [196, 248], Z: [248, 330], E: [330, 416] },
  // freier Streifen zwischen Material und Tellern (Schild beim Halt)
  SX0: 200, SX1: 412, SY0: 118, SY1: 152,
  // Teller ueber die ganze Breite; Bahn der Stuecke knapp ueber den Tellern
  TX0: 6, TX1: 414, TY: 204, TRY: 41, BAHN: 160,
  // Zeiten in s
  // Jede Schrittzeile steht mindestens rund 0,5 s (sonst kann sie niemand lesen,
  // und simfakten.js liest nur alle 0,4 s ab): „Rest r“ steht T_AB - 0,3 + T_LUECKE,
  // das fertige „Entbündeln: …“ T_WANDERN + T_ZWISCHEN + T_ZEIGEN.
  T_LADEN: 0.4, T_FALL: 0.3, T_ZEIGEN: 0.3, T_RUNDE: 0.5, T_FLUG: 0.42, T_STAG: 0.04,
  T_WACKEL: 0.5, T_SCHREIBEN: 0.25, T_AB: 0.4, T_LUECKE: 0.45, T_ZERFALL: 0.5,
  T_WANDERN: 0.6, T_HERAB: 0.45, T_ZWISCHEN: 0.05, T_SCHLUSS: 0.2,
  LANGSAM: 1 / 3                                        // Zeitfaktor bei „Tempo: langsam“
};
const _m5wFARBE = {
  H: { grund: '#fef2f2', fuell: '#fca5a5', linie: 'rgba(185,28,28,0.35)', rand: '#b91c1c' },
  Z: { grund: '#eff6ff', fuell: '#93c5fd', linie: 'rgba(29,78,216,0.45)', rand: '#1d4ed8' },
  E: { grund: '#f0fdf4', fuell: '#86efac', licht: '#dcfce7', rand: '#15803d' }
};
const _m5wDUNKEL = '#1f2937';
const _m5wORANGE = '#ea580c';
const _m5wEINZELN_FARBE = '#c2410c';      // Ergebnisziffern bei „jede Stelle einzeln“

// ── Rechnen ─────────────────────────────────────────────────────────────
function _m5wFmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
// Der ganze Rechenweg, Stelle fuer Stelle von der groessten Stelle her.
// modus 'richtig': der Rest wird entbuendelt und zur naechsten Ziffer genommen
// (Teildividend = Rest · 10 + Ziffer, genau wie build_pilot.rechnung_loesen).
// modus 'einzeln': jede Ziffer fuer sich, der Rest bleibt liegen.
function _m5wRechne(key, modus) {
  const [a, d] = _m5wAUFGABEN[key];
  const la = a.length, stellen = _m5wSP.slice(3 - la);
  const schritte = [];
  let rest = 0;
  for (let k = 0; k < la; k++) {
    const ziffer = Number(a[k]);
    const n = modus === 'einzeln' ? ziffer : rest * 10 + ziffer;
    const q = Math.floor(n / d), r = n - q * d;
    schritte.push({ k, art: stellen[k], ziffer, n, q, prod: q * d, r,
                    ent: modus !== 'einzeln' && r > 0 && k < la - 1 });
    rest = modus === 'einzeln' ? 0 : r;
  }
  const A = Number(a);
  const quot = Number(schritte.map(s => s.q).join(''));
  const ent = schritte.filter(s => s.ent).map(s => s.art);
  const bei = ent.length === 0 ? 'nirgends'
    : ent.length === 1 ? ent[0]
    : ent.slice(0, -1).join(', ') + ' und ' + ent[ent.length - 1];
  return { key, modus, a, A, d, la, lb: String(d).length, stellen, schritte, quot,
           probe: quot * d, bei };
}

// ── Plaetze ─────────────────────────────────────────────────────────────
// im Material: Platten als Fuenfersaeule, Stangen 5 + 5 je Reihe, Wuerfel in
// Zehnerreihen mit Fuenferluecke
function _m5wVorrat(art, i) {
  if (art === 'H') { const s = Math.floor(i / 5), r = i % 5; return { x: 215.5 + s * 16, y: 36 + r * 15, w: 13, h: 13, a: 1 }; }
  if (art === 'Z') { const r = Math.floor(i / 10), k = i % 10; return { x: 252 + k * 7 + (k >= 5 ? 3 : 0), y: 36 + r * 39, w: 5, h: 34, a: 1 }; }
  const r = Math.floor(i / 10), k = i % 10;
  return { x: 333 + k * 7.8 + (k >= 5 ? 2.5 : 0), y: 36 + r * 8.5, w: 6.5, h: 6.5, a: 1 };
}
function _m5wTellerMitte(j, n) {
  const K = _m5wK, s = (K.TX1 - K.TX0) / n;
  return K.TX0 + s * (j + 0.5);
}
// auf Teller j (von n): Platte, Stangen, Wuerfel nebeneinander – wie die Ziffern
function _m5wTeller(art, j, m, n) {
  const cx = _m5wTellerMitte(j, n);
  if (art === 'H') return { x: cx - 37, y: 197 - m * 15, w: 13, h: 13, a: 1 };
  if (art === 'Z') return { x: cx - 19 + m * 7, y: 187, w: 5, h: 34, a: 1 };
  return { x: cx + 1 + (m % 5) * 7.6, y: 196 + Math.floor(m / 5) * 8.5, w: 6.5, h: 6.5, a: 1 };
}
// Mitte einer Kaestchenzelle im Blatt
function _m5wZx(col) { return _m5wK.GX + (col + 0.5) * _m5wK.C; }
function _m5wZy(row) { return _m5wK.GY + row * _m5wK.C; }

// ── Drehbuch ────────────────────────────────────────────────────────────
// modus 'start': nur laden (das Material faellt ein). 'richtig' / 'einzeln':
// laden und abspielen. Ergebnis: Stuecke mit Wegabschnitten, Elemente des
// Blatts mit Zeitpunkten, Statuszeilen als Ereignisse, Halte, Aha, Baender.
function _m5wPlan(key, modus) {
  const K = _m5wK, R = _m5wRechne(key, modus === 'einzeln' ? 'einzeln' : 'richtig');
  const F = _m5wFARBE, d = R.d, la = R.la;
  const P = { key, modus, R, stuecke: [], blatt: [], st: {}, halts: [], aha: [], baender: [],
              ende: Infinity, teller: [] };
  const ev = (id, t, text) => { (P.st[id] = P.st[id] || []).push({ t, text }); };
  const pos = p => p.segs[p.segs.length - 1].nach;
  const farbeSpalte = col => (col >= 1 && col <= la) ? F[R.stellen[col - 1]].rand : _m5wDUNKEL;
  const pool = { H: [], Z: [], E: [] };
  for (let j = 0; j < d; j++) P.teller.push({ H: 0, Z: 0, E: 0 });
  // Material der Startzahl faellt ein (gestaffelt, von der groessten Stelle her)
  const gesamt = R.schritte.reduce((s, x) => s + x.ziffer, 0);
  const stag = Math.min(0.025, 0.15 / Math.max(1, gesamt));
  let nr = 0;
  for (const s of R.schritte) {
    for (let i = 0; i < s.ziffer; i++) {
      const ziel = _m5wVorrat(s.art, i), t0 = 0.02 + stag * nr++;
      const p = { art: s.art, geb: 0, tot: Infinity, mark: null, blink: null, wackel: null,
                  segs: [{ t0, t1: t0 + K.T_FALL, ease: 'raus', art: s.art,
                           von: { x: ziel.x, y: ziel.y - 22, w: ziel.w, h: ziel.h, a: 0 }, nach: ziel }] };
      P.stuecke.push(p); pool[s.art].push(p);
    }
  }
  // Blatt: Spaltenkopf, Startzahl, Teiler, „=“ (stehen ab dem Laden da)
  const qcol0 = 3 + la + R.lb;
  R.stellen.forEach((art, k) => P.blatt.push({ art: 'kopf', text: art, col: 1 + k, row: 0, farbe: F[art].rand, t: 0 }));
  for (let k = 0; k < la; k++) P.blatt.push({ art: 'ziffer', text: R.a[k], col: 1 + k, row: 1, farbe: farbeSpalte(1 + k), t: 0 });
  P.blatt.push({ art: 'ziffer', text: ':', col: 1 + la, row: 1, farbe: _m5wDUNKEL, t: 0 });
  String(d).split('').forEach((c, i) => P.blatt.push({ art: 'ziffer', text: c, col: 2 + la + i, row: 1, farbe: _m5wDUNKEL, t: 0 }));
  P.blatt.push({ art: 'ziffer', text: '=', col: 2 + la + R.lb, row: 1, farbe: _m5wDUNKEL, t: 0 });
  P.qcol0 = qcol0;
  if (modus === 'start') { P.ende = K.T_LADEN; return P; }

  const einzeln = modus === 'einzeln';
  let t = K.T_LADEN + 0.05;
  for (const s of R.schritte) {
    const k = s.k, art = s.art, end = 1 + k, nt = String(s.n);
    const kopf = _m5wWORT[art] + (einzeln ? ' einzeln: ' : ': ') + s.n + ' : ' + d;
    const t0 = t;
    // zeigen: Feld und Zahl werden gelb; die Zeile davor (z. B. das fertige
    // „Entbündeln: …“) bleibt noch stehen, die neue kommt mit dem Verteilen
    const feldBand = { ort: 'feld', art, farbe: 'gelb', t0, t1: Infinity };
    const blattBand = { ort: 'blatt', row: (k === 0 || einzeln) ? 1 : 1 + 2 * k,
                        c0: (k === 0 || einzeln) ? end : end - nt.length + 1, c1: end, t0, t1: Infinity };
    P.baender.push(feldBand, blattBand);
    t += K.T_ZEIGEN;
    // verteilen: je Runde ein Stueck auf jeden Teller
    const tv = t;
    ev('schritt', tv, kopf + ' …');
    if (s.q > 0) {
      for (let rd = 0; rd < s.q; rd++) {
        for (let j = 0; j < d; j++) {
          const p = pool[art].pop();
          const m = P.teller[j][art]++;
          const ta = tv + rd * K.T_RUNDE + j * K.T_STAG;
          p.segs.push({ t0: ta, t1: ta + K.T_FLUG, flug: true, art, von: pos(p), nach: _m5wTeller(art, j, m, d) });
        }
      }
      t = tv + (s.q - 1) * K.T_RUNDE + (d - 1) * K.T_STAG + K.T_FLUG;
    } else {
      for (const p of pool[art]) p.wackel = [tv, tv + K.T_WACKEL];   // kein Stueck fuer jeden Teller
      t = tv + K.T_WACKEL;
    }
    // schreiben: die Ergebnisziffer hinter „=“
    P.blatt.push({ art: 'ziffer', text: String(s.q), col: qcol0 + k, row: 1, t, feder: true,
                   farbe: einzeln ? _m5wEINZELN_FARBE : F[art].rand });
    ev('schritt', t, kopf + ' = ' + s.q + ' …');
    t += K.T_SCHREIBEN;
    // abziehen: „− Produkt“, Strich, Rest (Schreibweise des Hefts)
    const tab = t, trest = tab + 0.3;
    if (!einzeln) {
      const pt = String(s.prod), rp = 2 + 2 * k, rt = String(s.r);
      P.blatt.push({ art: 'ziffer', text: '−', col: end - pt.length, row: rp, farbe: _m5wDUNKEL, t: tab });
      pt.split('').forEach((c, i) => {
        const col = end - (pt.length - 1 - i);
        P.blatt.push({ art: 'ziffer', text: c, col, row: rp, farbe: farbeSpalte(col), t: tab });
      });
      P.blatt.push({ art: 'linie', row: rp + 1, c0: end - Math.max(pt.length, nt.length) + 1, c1: end, t: tab + 0.15 });
      rt.split('').forEach((c, i) => {
        const col = end - (rt.length - 1 - i);
        P.blatt.push({ art: 'ziffer', text: c, col, row: rp + 1, farbe: farbeSpalte(col), t: trest });
      });
      ev('schritt', trest, kopf + ' = ' + s.q + ', Rest ' + s.r);
      for (const p of pool[art]) p.mark = trest;                   // was uebrig ist: orange umrandet
    } else {
      const liegen = s.r === 0 ? 'nichts bleibt liegen'
        : s.r + ' ' + art + (s.r === 1 ? ' bleibt liegen' : ' bleiben liegen');
      ev('schritt', trest, kopf + ' = ' + s.q + ', ' + liegen);
      for (const p of pool[art]) p.blink = trest;                  // bleibt liegen: blinkt orange
    }
    t = tab + K.T_AB;
    feldBand.t1 = t;
    // weiter zur naechsten Stelle
    if (!einzeln && k < la - 1) {
      const next = R.stellen[k + 1], nz = Number(R.a[k + 1]);
      let w0, w1;
      if (s.r > 0) {
        t += K.T_LUECKE;
        const tz = t, ueber = pool[art].slice();
        const rects = ueber.map(p => Object.assign({}, pos(p)));
        P.halts.push({ t: tz - 0.0005, von: art, nach: next, n: s.r, rects });
        const basis = pool[next].length, gespreizt = [];
        ueber.forEach((p, pi) => {
          p.tot = tz;
          const q = pos(p);
          for (let c = 0; c < 10; c++) {
            let s0, s1;
            // Gespreizt bleibt alles unter dem Feldkopf (ab y = 34) und im Feld (bis 110).
            if (art === 'Z') {                                      // Stange -> zehn Wuerfelchen
              const y0 = Math.min(Math.max(34, q.y + q.h / 2 - 30), 110 - 60.4);
              s0 = { x: q.x, y: q.y + c * q.h / 10, w: q.w, h: q.h / 10, a: 1 };
              s1 = { x: q.x + 0.2, y: y0 + c * 6.2, w: 4.6, h: 4.6, a: 1 };
            } else {                                                // Platte -> zehn Streifen
              s0 = { x: q.x + c * q.w / 10, y: q.y, w: q.w / 10, h: q.h, a: 1 };
              s1 = { x: q.x + q.w / 2 - 18 + c * 3.7, y: Math.max(34, q.y - 4), w: 2.4, h: q.h + 8, a: 1 };
            }
            const s2 = _m5wVorrat(next, basis + pi * 10 + c);
            const kind = { art: next, geb: tz, tot: Infinity, mark: null, blink: null, wackel: null,
                           segs: [{ t0: tz, t1: tz + K.T_ZERFALL, art, teil: true, von: s0, nach: s1 },
                                  { t0: tz + K.T_ZERFALL, t1: tz + K.T_ZERFALL + K.T_WANDERN, art: next,
                                    blitz: true, von: s1, nach: s2 }] };
            P.stuecke.push(kind); pool[next].push(kind); gespreizt.push(s1);
          }
        });
        pool[art] = [];
        if (key === '84-3' && k === 0) {          // Aha: die 2 Stangen zerfallen – Ring um die 20 Wuerfel, im Feld
          const x0 = Math.min(...gespreizt.map(r => r.x)), x1 = Math.max(...gespreizt.map(r => r.x + r.w));
          const y0 = Math.min(...gespreizt.map(r => r.y)), y1 = Math.max(...gespreizt.map(r => r.y + r.h));
          P.aha.push({ t: tz + 0.02, x: (x0 + x1) / 2, y: (y0 + y1) / 2, r: 30 });
        }
        P.baender.push({ ort: 'feld', art, farbe: 'orange', t0: tz, t1: tz + K.T_ZERFALL });
        P.baender.push({ ort: 'feld', art: next, farbe: 'orange', t0: tz + K.T_ZERFALL, t1: tz + K.T_ZERFALL + K.T_WANDERN });
        const zehn = 10 * s.r;
        ev('schritt', tz, 'Entbündeln: ' + s.r + ' ' + art + ' sind ' + zehn + ' ' + next + ' …');
        w0 = tz + K.T_ZERFALL; w1 = w0 + K.T_WANDERN;
        ev('schritt', w0, 'Entbündeln: ' + s.r + ' ' + art + ' sind ' + zehn + ' ' + next +
                          ', mit ' + nz + ' ' + next + ': ' + (zehn + nz) + ' ' + next);
        t = w1;
      } else {
        w0 = t; w1 = t + K.T_HERAB; t = w1;
      }
      // die naechste Ziffer wird heruntergeholt
      P.blatt.push({ art: 'ziffer', text: R.a[k + 1], col: k + 2, row: 3 + 2 * k, vonRow: 1, gleit: [w0, w1],
                     farbe: farbeSpalte(k + 2), t: w0 });
    }
    // „jede Stelle einzeln“: kurz innehalten, die liegen gebliebenen Stuecke blinken
    if (einzeln && k < la - 1) t += 0.35;
    t += K.T_ZWISCHEN;
    blattBand.t1 = t;
  }
  // Ende
  P.ende = t + K.T_SCHLUSS;
  const zahl = (n, art) => '<b style="color:' + F[art].rand + '">' + n + ' ' + art + '</b>';
  ev('teller', P.ende, 'Auf jedem Teller: ' + R.stellen.map(art => zahl(P.teller[0][art], art)).join(', '));
  if (einzeln) {
    ev('tarek', P.ende, _m5wZEILE_EINZELN + _m5wFmt(R.quot) + ', Probe ' + _m5wFmt(R.quot) + ' · ' + d + ' = ' + _m5wFmt(R.probe));
  } else {
    ev('entbuendelt', P.ende, 'Entbündelt wurde bei: ' + R.bei);
    ev('ergebnis', P.ende, 'Ergebnis der Aufgabe: ' + _m5wFmt(R.quot));
    ev('probe', P.ende, 'Probe mit der Malaufgabe: ' + _m5wFmt(R.quot) + ' · ' + d + ' = ' + _m5wFmt(R.probe));
  }
  return P;
}

// Wo steht ein Stueck zur Ablaufzeit at? (null = nicht zu sehen)
function _m5wZustand(p, at) {
  if (at < p.geb || at >= p.tot) return null;
  let s = p.segs[0];
  for (const g of p.segs) { if (g.t0 <= at) s = g; else break; }
  let u = s.t1 > s.t0 ? (at - s.t0) / (s.t1 - s.t0) : 1;
  u = Math.max(0, Math.min(1, u));
  const e = s.ease === 'raus' ? _bioFxEase.raus(u) : _bioFxEase.sanft(u);
  const A = s.von, B = s.nach;
  let x, y;
  if (s.flug && u < 1) {
    // erst nach unten bis knapp ueber die Teller, dann hinueber, dann hinein
    const Y = _m5wK.BAHN, v = 1 - e;
    x = A.x * (v * v * v + 3 * v * v * e) + B.x * (3 * v * e * e + e * e * e);
    y = v * v * v * A.y + 3 * v * v * e * Y + 3 * v * e * e * Y + e * e * e * B.y;
  } else {
    x = A.x + (B.x - A.x) * e; y = A.y + (B.y - A.y) * e;
  }
  return { x, y, w: A.w + (B.w - A.w) * e, h: A.h + (B.h - A.h) * e,
           a: A.a + (B.a - A.a) * e, art: s.art, teil: !!s.teil,
           fliegt: !!s.flug && at < s.t1 && at >= s.t0,
           blitz: s.blitz && at >= s.t0 && at - s.t0 < 0.3 ? 1 - (at - s.t0) / 0.3 : 0 };
}

// ── Zustand ─────────────────────────────────────────────────────────────
function _m5wInit() {
  _m5w = { t: 0, key: _m5wSTART, lauf: null, weg: [], fx: [], sig: '',
           // fuer die Lehrkraft: angehalten? warum (Halt)? Schalter Halt / langsam
           steht: false, haltInfo: null, haltAn: false, langsam: false };
  _m5wStarte(_m5wSTART, 'start');
}
// Einen Lauf beginnen. Was noch zu sehen ist, faellt weg; das neue Material faellt ein.
function _m5wStarte(key, modus) {
  const z = _m5w;
  if (z.lauf) {
    const at = z.lauf.at;
    for (const p of z.lauf.plan.stuecke) {
      const s = _m5wZustand(p, at);
      if (s && s.a > 0.05) { s.fliegt = false; s.blitz = 0; z.weg.push(s); }
    }
  }
  z.key = key;
  z.lauf = { plan: _m5wPlan(key, modus), at: 0 };
  z.steht = false; z.haltInfo = null;                     // ein neuer Lauf hebt die Pause auf
  z.fx.length = 0;
}

function _m5wHTML() {
  const marke = k => {
    const [a, d] = _m5wAUFGABEN[k];
    return `<button class="sim-btn" id="_m5w-b-${k}" onclick="_m5wAufgabe('${k}')">${a}&nbsp;:&nbsp;${d}</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was ergibt 84&nbsp;:&nbsp;3 wirklich?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle eine Aufgabe. Erst kommt die größte Stelle dran. Sieh auf die Teller.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5w-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5wREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m5w-nochmal" onclick="_m5wNochmal()">noch einmal</button>
          <button class="sim-btn" id="_m5w-einzeln" onclick="_m5wEinzeln()">${_m5wKNOPF_EINZELN}</button>
          <button class="sim-btn" id="_m5w-neu" onclick="_m5wNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m5w-pause" onclick="_m5wAnhalten()">Pause</button>
            <button class="sim-btn" id="_m5w-halt" onclick="_m5wHaltSchalter()">Halt beim Entbündeln: <span id="_m5w-halt-an">aus</span></button>
            <button class="sim-btn" id="_m5w-tempo" onclick="_m5wTempo()">Tempo: <span id="_m5w-tempo-an">normal</span></button>
          </div>
          <div class="lmp-status on" id="_m5w-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5w-aufgabe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5w-schritt" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5w-entbuendelt" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5w-teller" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5w-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5w-probe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5w-tarek" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 84&nbsp;:&nbsp;3, noch nicht gerechnet</p>
  </div>`;
}

// Was die Anzeige gerade sagt – sie folgt dem Bild (Ereignisse im Drehbuch).
function _m5wTexte() {
  const z = _m5w, P = z.lauf.plan, R = P.R, at = z.lauf.at;
  const wert = (id, def) => {
    let v = def;
    for (const e of (P.st[id] || [])) if (e.t <= at) v = e.text;
    return v;
  };
  return {
    aufgabe: 'Aufgabe: ' + _m5wFmt(R.A) + ' : ' + R.d + ' (schriftlich)',
    schritt: wert('schritt', 'Noch keine Stelle gerechnet.'),
    entbuendelt: wert('entbuendelt', 'Entbündelt wurde bei: …'),
    teller: wert('teller', 'Auf jedem Teller: …'),
    ergebnis: wert('ergebnis', 'Ergebnis der Aufgabe: …'),
    probe: wert('probe', 'Probe mit der Malaufgabe: …'),
    tarek: wert('tarek', '')
  };
}
function _m5wSchildText(h) {
  return h.n + ' ' + _m5wWORT[h.von] + (h.n === 1 ? ' wird' : ' werden') + ' zu ' + (10 * h.n) + ' ' + _m5wDATIV[h.nach] + '.';
}
function _m5wHinweis() {
  const z = _m5w, h = z.haltInfo;
  const kopf = h ? 'Halt: ' + _m5wSchildText(h) + ' Das ist das Entbündeln.'
    : z.steht ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : 'Für die Lehrkraft: „Pause“ hält alles an. „Halt beim Entbündeln“ stoppt von selbst.';
  return kopf + ' Halt: ' + (z.haltAn ? 'an' : 'aus') + ', Tempo: ' + (z.langsam ? 'langsam' : 'normal') + '.';
}
function _m5wSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Schreibt die Anzeige, wenn sich etwas geaendert hat (immer = true: auf jeden Fall).
function _m5wStatus(immer) {
  if (!_m5w) return;
  const z = _m5w, T = _m5wTexte();
  const sig = JSON.stringify(T) + '|' + z.key + '|' + z.steht + '|' + !!z.haltInfo + '|' + z.haltAn + '|' + z.langsam;
  if (!immer && sig === z.sig) return;
  z.sig = sig;
  for (const id of ['aufgabe', 'schritt', 'entbuendelt', 'teller', 'ergebnis', 'probe']) _m5wSetze('_m5w-' + id, T[id]);
  const tz = _m5wSetze('_m5w-tarek', T.tarek);
  if (tz && tz.style) tz.style.display = T.tarek ? '' : 'none';
  for (const k of _m5wREIHE) {
    const b = document.getElementById('_m5w-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  }
  // fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m5wSetze('_m5w-pause', z.steht ? 'weiter' : 'Pause');
  _m5wSetze('_m5w-halt-an', z.haltAn ? 'an' : 'aus');
  _m5wSetze('_m5w-tempo-an', z.langsam ? 'langsam' : 'normal');
  const hz = _m5wSetze('_m5w-lehrkraft', _m5wHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.steht ? 'off' : 'on');
  for (const [id, an] of [['_m5w-pause', z.steht], ['_m5w-halt', z.haltAn], ['_m5w-tempo', z.langsam]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m5wAufgabe(key) {
  if (!_m5w || !_m5wAUFGABEN[key]) return;
  _m5wStarte(key, 'richtig');
  _m5wStatus(true);
}
function _m5wNochmal() {
  if (!_m5w) return;
  _m5wStarte(_m5w.key, 'richtig');
  _m5wStatus(true);
}
function _m5wEinzeln() {
  if (!_m5w) return;
  _m5wStarte(_m5w.key, 'einzeln');
  _m5wStatus(true);
}
function _m5wNeu() {
  if (!_m5w) return;
  _m5wStarte(_m5wSTART, 'start');
  _m5wStatus(true);
}
// ── Für die Lehrkraft ───────────────────────────────────────────────────
function _m5wAnhalten() {
  const z = _m5w;
  if (!z) return;
  z.steht = !z.steht;
  z.haltInfo = null;                       // „weiter“ nach einem Halt: die Stuecke zerfallen jetzt
  _m5wStatus(true);
}
function _m5wHaltSchalter() {
  const z = _m5w;
  if (!z) return;
  z.haltAn = !z.haltAn;                    // gilt fuer das NAECHSTE Entbuendeln
  _m5wStatus(true);
}
function _m5wTempo() {
  const z = _m5w;
  if (!z) return;
  z.langsam = !z.langsam;
  _m5wStatus(true);
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5wUpdate(dt) {
  if (!_m5w) return;
  const z = _m5w;
  // EIN Zeitfaktor fuer jede Bewegung. Angehalten: nichts laeuft weiter.
  if (z.steht) return;
  dt = _bioFxDt(dt) * (z.langsam ? _m5wK.LANGSAM : 1);
  if (!(dt > 0)) return;
  z.t += dt;
  const L = z.lauf, P = L.plan;
  let neu = L.at + dt, halt = null;
  if (z.haltAn) {
    for (const h of P.halts) if (L.at < h.t && neu >= h.t) { neu = h.t; halt = h; break; }
  }
  for (const a of P.aha) if (L.at < a.t && neu >= a.t) _bioFxWelle(z.fx, a.x, a.y, '#f59e0b', a.r);
  L.at = neu;
  if (halt) { z.steht = true; z.haltInfo = halt; }
  for (let i = z.weg.length - 1; i >= 0; i--) {         // altes Material faellt weg
    const p = z.weg[i];
    p.a -= dt / 0.25; p.y += 40 * dt;
    if (p.a <= 0) z.weg.splice(i, 1);
  }
  _bioFxUpdate(z.fx, dt);
  _m5wStatus(!!halt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5wText(ctx, s, x, y, groesse, farbe, gew, ausr) {
  ctx.fillStyle = farbe || _m5wDUNKEL;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function _m5wEin(t, d) { return t < 0 ? 0 : Math.min(1, t / (d || 0.25)); }
function _m5wAktiv(b, at) { return at >= b.t0 && at < b.t1; }

function _m5wBlatt(ctx) {
  const z = _m5w, K = _m5wK, C = K.C, P = z.lauf.plan, R = P.R, at = z.lauf.at;
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 8); ctx.fill();
  // Spalten der Startzahl in ihrer Stellenfarbe (durch alle Zeilen)
  R.stellen.forEach((art, k) => {
    ctx.fillStyle = _m5wFARBE[art].grund;
    ctx.fillRect(K.GX + (1 + k) * C + 1, K.GY + 1, C - 2, 8 * C - 2);
  });
  // Karos
  ctx.strokeStyle = '#d7e3f1'; ctx.lineWidth = 1;
  for (let x = K.GX; x <= K.PX1 - 2; x += C) { ctx.beginPath(); ctx.moveTo(x, K.PY0 + 2); ctx.lineTo(x, K.PY1 - 2); ctx.stroke(); }
  for (let y = K.GY; y <= K.PY1 - 2; y += C) { ctx.beginPath(); ctx.moveTo(K.PX0 + 2, y); ctx.lineTo(K.PX1 - 2, y); ctx.stroke(); }
  // die Zahl, die gerade geteilt wird: gelb
  for (const b of P.baender) {
    if (b.ort !== 'blatt' || !_m5wAktiv(b, at)) continue;
    ctx.save(); ctx.globalAlpha = 0.85 * _m5wEin(at - b.t0, 0.25);
    ctx.fillStyle = 'rgba(253,224,71,0.75)'; ctx.strokeStyle = '#eab308'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, K.GX + b.c0 * C + 1.5, _m5wZy(b.row) + 1.5, (b.c1 - b.c0 + 1) * C - 3, C - 3, 4);
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // am Ende leuchtet das Ergebnis kurz nach
  const nach = at - P.ende;
  if (P.modus === 'richtig' && nach >= 0 && nach < 1.8) {
    const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
    ctx.save(); ctx.globalAlpha = Math.min(1, (1.8 - nach) / 0.6) * (0.55 + 0.45 * puls);
    ctx.fillStyle = 'rgba(253,230,138,0.6)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.2;
    _bioFxRundRect(ctx, K.GX + P.qcol0 * C + 1, _m5wZy(1) + 1, R.la * C - 2, C - 2, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // Elemente
  for (const el of P.blatt) {
    if (at < el.t) continue;
    const cx = _m5wZx(el.col);
    if (el.art === 'linie') {
      const e = _m5wEin(at - el.t, 0.25), x0 = K.GX + el.c0 * C + 2, x1 = K.GX + (el.c1 + 1) * C - 2;
      ctx.strokeStyle = _m5wDUNKEL; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x0, _m5wZy(el.row) + 0.5); ctx.lineTo(x0 + (x1 - x0) * e, _m5wZy(el.row) + 0.5); ctx.stroke();
      continue;
    }
    if (el.art === 'kopf') {
      ctx.save(); ctx.globalAlpha = _m5wEin(at - el.t, 0.3);
      _m5wText(ctx, el.text, cx, _m5wZy(0) + 13, 11, el.farbe);
      ctx.restore();
      continue;
    }
    let y = _m5wZy(el.row), ein = 1;
    if (el.gleit) {                                         // heruntergeholte Ziffer gleitet
      // Die Kopie loest sich eine Dreiviertelzeile UNTER der Ziffer oben und blendet
      // dabei ein – so liegt sie zu keinem Zeitpunkt auf der Ziffer, die oben stehen bleibt.
      const u = Math.max(0, Math.min(1, (at - el.gleit[0]) / (el.gleit[1] - el.gleit[0])));
      const y0 = _m5wZy(el.vonRow) + 0.75 * C;
      y = y0 + (_m5wZy(el.row) - y0) * _bioFxEase.sanft(u);
      ein = Math.min(1, u / 0.3);
      // leuchtet beim Herunterholen; durchscheinend
      const gl = (at < el.gleit[1] + 0.1 ? 1 : Math.max(0, 1 - (at - el.gleit[1] - 0.1) / 0.3)) * ein;
      if (gl > 0.01) {
        ctx.save(); ctx.globalAlpha = 0.8 * gl;
        ctx.fillStyle = 'rgba(253,224,71,0.45)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
        _bioFxRundRect(ctx, cx - C / 2 + 1.5, y + 1.5, C - 3, C - 3, 4); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }
    const u = _m5wEin(at - el.t, 0.25);
    ctx.save(); ctx.globalAlpha = el.gleit ? ein : u;
    if (el.feder && at - el.t < 0.35) {                     // federt nur beim Erscheinen
      const sc = 0.6 + 0.4 * _bioFxEase.federn(_m5wEin(at - el.t, 0.35));
      ctx.translate(cx, y + C / 2); ctx.scale(sc, sc);
      _m5wText(ctx, el.text, 0, 5.5, 15, el.farbe);
    } else {
      _m5wText(ctx, el.text, cx, y + 14, 15, el.farbe);
    }
    ctx.restore();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 8); ctx.stroke();
}

function _m5wFelder(ctx) {
  const z = _m5w, K = _m5wK, P = z.lauf.plan, at = z.lauf.at;
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.MX0, K.MY0, K.MX1 - K.MX0, K.MY1 - K.MY0, 8); ctx.fill();
  for (const b of P.baender) {                              // Feld, das gerade dran ist
    if (b.ort !== 'feld' || !_m5wAktiv(b, at)) continue;
    const [a, e] = K.FELD[b.art];
    ctx.save(); ctx.globalAlpha = _m5wEin(at - b.t0, 0.25);
    ctx.fillStyle = b.farbe === 'gelb' ? 'rgba(253,224,71,0.38)' : 'rgba(251,146,60,0.26)';
    _bioFxRundRect(ctx, a + 2, 33, e - a - 4, K.MY1 - 35, 6); ctx.fill();
    ctx.restore();
  }
  for (const art of _m5wSP) {                               // Koepfe wie die Stellenwerttafel
    const [a, b] = K.FELD[art], cx = (a + b) / 2, F = _m5wFARBE[art];
    ctx.fillStyle = F.grund;
    _bioFxRundRect(ctx, a + 3, K.MY0 + 3, b - a - 6, 25, 6); ctx.fill();
    _m5wText(ctx, art, cx, 18, 13, F.rand);
    _m5wText(ctx, _m5wWORT[art], cx, 27, 8.5, '#334155', '600');
  }
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.2;
  for (const art of ['Z', 'E']) {
    const x = K.FELD[art][0];
    ctx.beginPath(); ctx.moveTo(x, K.MY0 + 2); ctx.lineTo(x, K.MY1 - 2); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.MX0, K.MY0, K.MX1 - K.MX0, K.MY1 - K.MY0, 8); ctx.stroke();
}

function _m5wTellerBild(ctx) {
  const z = _m5w, K = _m5wK, P = z.lauf.plan, n = P.R.d, at = z.lauf.at;
  const s = (K.TX1 - K.TX0) / n, rx = s / 2 - 5, ry = K.TRY;
  const nach = at - P.ende;
  // nur der richtige Weg leuchtet am Ende nach – „jede Stelle einzeln“ nicht
  const glanz = P.modus === 'richtig' && nach >= 0 && nach < 1.8 ? Math.min(1, (1.8 - nach) / 0.6) : 0;
  for (let j = 0; j < n; j++) {
    const cx = _m5wTellerMitte(j, n);
    ctx.save();
    ctx.fillStyle = 'rgba(15,23,42,0.07)';
    ctx.beginPath(); ctx.ellipse(cx, K.TY + 3, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(cx, K.TY, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, K.TY, rx - 3.5, ry - 4, 0, 0, Math.PI * 2); ctx.stroke();
    if (glanz > 0.01) {
      const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
      ctx.globalAlpha = glanz * (0.5 + 0.5 * puls);
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(cx, K.TY, rx + 1.5, ry + 1.5, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }
}

// ── Stuecke ─────────────────────────────────────────────────────────────
function _m5wEiner(ctx, x, y, w, h) {
  const F = _m5wFARBE.E;
  ctx.fillStyle = F.fuell; ctx.strokeStyle = F.rand; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x, y, w, h, Math.min(1.8, w / 4, h / 4)); ctx.fill(); ctx.stroke();
}
function _m5wStange(ctx, x, y, w, h) {
  const F = _m5wFARBE.Z;
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = F.linie; ctx.lineWidth = 0.7;
  for (let k = 1; k < 10; k++) {
    if (k === 5) continue;
    ctx.beginPath(); ctx.moveTo(x, y + h * k / 10); ctx.lineTo(x + w, y + h * k / 10); ctx.stroke();
  }
  ctx.strokeStyle = F.rand; ctx.lineWidth = 1.5;                     // Fuenfermarke
  ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
  ctx.lineWidth = 0.9; ctx.strokeRect(x, y, w, h);
}
function _m5wPlatte(ctx, x, y, w, h) {
  const F = _m5wFARBE.H;
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = F.linie; ctx.lineWidth = 0.5;
  for (const k of [2.5, 7.5]) {
    ctx.beginPath(); ctx.moveTo(x + w * k / 10, y); ctx.lineTo(x + w * k / 10, y + h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + h * k / 10); ctx.lineTo(x + w, y + h * k / 10); ctx.stroke();
  }
  ctx.strokeStyle = F.rand; ctx.lineWidth = 1;                       // Fuenferlinien
  ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
  ctx.strokeRect(x, y, w, h);
}
function _m5wZeichneStueck(ctx, s, dx) {
  const al = Math.max(0, Math.min(1, s.a));
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha = al;
  const x = s.x + (dx || 0);
  if (s.teil) {
    const F = _m5wFARBE[s.art];
    ctx.fillStyle = F.fuell; ctx.strokeStyle = F.rand; ctx.lineWidth = 0.8;
    ctx.fillRect(x, s.y, s.w, s.h); ctx.strokeRect(x, s.y, s.w, s.h);
  } else if (s.art === 'E') _m5wEiner(ctx, x, s.y, s.w, s.h);
  else if (s.art === 'Z') _m5wStange(ctx, x, s.y, s.w, s.h);
  else _m5wPlatte(ctx, x, s.y, s.w, s.h);
  if (s.blitz > 0) {                                         // kurzes Aufblitzen beim Losgleiten
    ctx.globalAlpha = 0.7 * s.blitz; ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 1, s.y - 1, s.w + 2, s.h + 2);
  }
  ctx.restore();
}
// Umrandung um eine Gruppe von Stuecken (eine je Feld, damit sich nichts ueberlappt)
function _m5wGruppe(g, s) {
  g.x0 = Math.min(g.x0, s.x); g.y0 = Math.min(g.y0, s.y);
  g.x1 = Math.max(g.x1, s.x + s.w); g.y1 = Math.max(g.y1, s.y + s.h);
}
function _m5wStuecke(ctx) {
  const z = _m5w, at = z.lauf.at, P = z.lauf.plan;
  const liste = [], oben = [], gruppen = {};
  const blink = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 1.1);
  for (const p of P.stuecke) {
    const s = _m5wZustand(p, at);
    if (!s) continue;
    if (s.fliegt) { oben.push(s); continue; }
    s.dx = 0;
    if (p.wackel && at >= p.wackel[0] && at < p.wackel[1]) {
      const u = (at - p.wackel[0]) / (p.wackel[1] - p.wackel[0]);
      s.dx = Math.sin((at - p.wackel[0]) * 40) * 2.5 * (1 - u);
    }
    liste.push(s);
    const bl = p.blink !== null && at >= p.blink;            // bleibt liegen: blinkt orange
    const mk = !bl && p.mark !== null && at >= p.mark;        // uebrig: orange umrandet
    if (bl || mk) {
      const g = gruppen[p.art] = gruppen[p.art] ||
        { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity, blink: bl, t: bl ? p.blink : p.mark };
      _m5wGruppe(g, s);
    }
  }
  const G = Object.values(gruppen);
  for (const g of G) {
    if (!g.blink) continue;
    ctx.save(); ctx.globalAlpha = 0.25 + 0.35 * blink; ctx.fillStyle = '#fdba74';
    _bioFxRundRect(ctx, g.x0 - 3, g.y0 - 3, g.x1 - g.x0 + 6, g.y1 - g.y0 + 6, 4); ctx.fill(); ctx.restore();
  }
  for (const s of liste) _m5wZeichneStueck(ctx, s, s.dx);
  for (const g of G) {
    ctx.save();
    ctx.globalAlpha = g.blink ? 0.45 + 0.55 * blink : _m5wEin(at - g.t, 0.25);
    ctx.strokeStyle = _m5wORANGE; ctx.lineWidth = g.blink ? 2 : 1.8;
    _bioFxRundRect(ctx, g.x0 - 3, g.y0 - 3, g.x1 - g.x0 + 6, g.y1 - g.y0 + 6, 4); ctx.stroke();
    ctx.restore();
  }
  for (const s of z.weg) _m5wZeichneStueck(ctx, s);
  for (const s of oben) _m5wZeichneStueck(ctx, s);           // was fliegt, liegt obenauf
}

// Fuer die Lehrkraft: beim Halt die Stuecke, die gleich zerfallen, dick orange
// umrandet und darunter das Schild; waehrend jeder Pause das Schild „Pause“.
function _m5wLehrkraftBild(ctx) {
  const z = _m5w, K = _m5wK, h = z.haltInfo;
  if (h) {
    const r = h.rects;
    const x0 = Math.min(...r.map(q => q.x)), x1 = Math.max(...r.map(q => q.x + q.w));
    const y0 = Math.min(...r.map(q => q.y)), y1 = Math.max(...r.map(q => q.y + q.h));
    ctx.save();
    ctx.strokeStyle = _m5wORANGE; ctx.lineWidth = 3; ctx.fillStyle = '#fff7ed';
    _bioFxRundRect(ctx, x0 - 4, y0 - 4, x1 - x0 + 8, y1 - y0 + 8, 5); ctx.fill(); ctx.stroke();
    for (const q of r) _m5wZeichneStueck(ctx, Object.assign({ art: h.von, teil: false, blitz: 0 }, q));
    const text = _m5wSchildText(h);
    let gr = 14;
    ctx.font = '700 ' + gr + 'px sans-serif';
    while (gr > 10 && ctx.measureText(text).width > K.SX1 - K.SX0 - 16) { gr -= 1; ctx.font = '700 ' + gr + 'px sans-serif'; }
    const bw = Math.min(K.SX1 - K.SX0, ctx.measureText(text).width + 22), bh = K.SY1 - K.SY0;
    const mx = Math.max(K.SX0 + bw / 2, Math.min(K.SX1 - bw / 2, (x0 + x1) / 2));
    ctx.strokeStyle = _m5wORANGE; ctx.lineWidth = 2.5; ctx.lineCap = 'round';  // Verbindung Stuecke -> Schild
    ctx.beginPath(); ctx.moveTo((x0 + x1) / 2, y1 + 4); ctx.lineTo((x0 + x1) / 2, K.SY0); ctx.stroke();
    ctx.fillStyle = '#fff7ed'; ctx.lineWidth = 2.5;
    _bioFxRundRect(ctx, mx - bw / 2, K.SY0, bw, bh, 8); ctx.fill(); ctx.stroke();
    _m5wText(ctx, text, mx, K.SY0 + bh / 2 + gr * 0.36, gr, '#9a3412');
    ctx.restore();
  }
  if (z.steht) {                                             // Schild „Pause“ in der freien Kopfzeile des Blatts
    ctx.save();
    ctx.fillStyle = '#1e293b';
    _bioFxRundRect(ctx, 128, 9, 58, 17, 5); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(133, 12.5, 2.8, 10); ctx.fillRect(138, 12.5, 2.8, 10);
    _m5wText(ctx, 'Pause', 144, 22, 11, '#ffffff', '700', 'left');
    ctx.restore();
  }
}

function _m5wDraw(ctx, cv) {
  if (!_m5w) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m5wBlatt(ctx);
  _m5wFelder(ctx);
  _m5wTellerBild(ctx);
  _m5wStuecke(ctx);
  _bioFxDraw(ctx, _m5w.fx);
  if (_m5w.steht || _m5w.haltInfo) _m5wLehrkraftBild(ctx);
}
