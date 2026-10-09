
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – md4 „Was ist der Durchschnitt?“ (Kennung m5-mittelwert,
// Praefix _m6u). Bauplan: arbeitsheft_mathe_foe5/KAPITEL8_PROFIL.md, Abschnitt
// m5-mittelwert (Einheit md4; Regeln N1–N3, Lehrkraft-Zeile V3).
// Ueberschrift = Frage der Einheit: „Wie viele Körbe sind es im Durchschnitt?“
//
// Was man sieht – Bild und Zeichen, durch die FARBE verbunden (Wuerfel und
// Summanden orange, Ausgleichshoehe petrol; in Bild und Statuszeilen gleich):
//   PLUSAUFGABE (Zettel oben im Bild, ueber den Tuermen): „3 + 6 + 4 + 8 + 4 = 25“.
//     Sie baut sich mit den Tuermen auf: Waechst Turm i, zaehlt sein Summand
//     mit, und Summand und Turm leuchten zusammen bernsteinfarben. „= 25“
//     erscheint, wenn alle Tuerme stehen, und bleibt beim Ausgleichen stehen.
//     (Der Bauplan sagt „ueber der Leinwand“; sie steht IM Bild ganz oben, damit
//     Summand und Turm im selben Bild aufleuchten koennen – MATHE_PROFIL § 10.2.)
//   KARO mit HOEHENSKALA links (0 bis 10, Zahl an jeder Linie, Kaestchen 16 px),
//     oben mit Pfeil, rechts neben der Pfeilspitze der Achsentitel „Körbe“
//     (Abdullah, 09.10.2026: Achsen richtig beschriften).
//     Je Runde ein Turm aus orangen Steckwuerfeln, 1 Wuerfel = 1 Kaestchen;
//     nach 5 Wuerfeln eine feine Fuenfermarke quer ueber den Turm. Unter jedem
//     Turm „Runde 1“ … und die Zahl der Wuerfel, die gerade im Turm stehen.
//   GESTRICHELTE LINIE (petrol) auf der Hoehe nach dem Ausgleichen; die Zahl
//     der Skala an dieser Linie steht dann in einem petrol Schild.
//
// Bewegung (spielt nach der Sprungmarke SELBST ab, N1: ein Schritt im Heft =
// eine Handlung; anhalten kann die Lehrkraft). Alles ist eine Funktion der
// Ablaufzeit L.at (_m6uPlan, _m6uVPlan): keine Zufallszahl, jede Zahl im Bild
// kommt aus derselben Rechnung wie die Statuszeilen (_m6uStandAus).
//   Aufbau: das alte Bild blendet aus (0,25 s). Die Tuerme wachsen nacheinander
//     Wuerfel fuer Wuerfel (0,1 s je Wuerfel, 0,15 s Luft zwischen zwei
//     Tuermen), jeder Wuerfel faellt kurz von oben auf seinen Platz.
//   Ausgleichen (0,7 s nach „= 25“): Immer der oberste Wuerfel des hoechsten
//     Turms gleitet im Bogen auf den niedrigsten (0,6 s, 0,1 s Luft; bei
//     Gleichstand jeweils der linke), bis alle gleich hoch sind. Dann leuchtet
//     die gestrichelte Linie auf dieser Hoehe auf.
//     Dauer, gemessen (Frames zu 16 ms): „2, 4, 6“ 4,9 s (304 Frames) ·
//     „3, 6, 4, 8, 4“ 7,9 s (492) · „5, 9, 7, 3“ 7,6 s (476).
//     Faktendump deshalb mit den Schaltern der Reihe ziehen (fakten_ziehen.py:
//     --voll --frames=25 --verlauf=4): Dann stehen alle Endwerte im Dump
//     (gemessen 09.10.2026, 58 Ablesungen). Mit der Voreinstellung (2 Frames
//     je Knopf) stehen die Endwerte NUR in den Ablesungen „… + zusammenlegen
//     und verteilen“ (der Knopf laesst das Ausgleichen sofort ankommen), und
//     es fehlen „Die Türme sind verschieden hoch.“ und alle Zeilen
//     „Auf jedem Platz liegen … Würfel.“
//   „zusammenlegen und verteilen“ (zweite Grundvorstellung, erst nach einer
//     Sprungmarke): die gleichen Tuerme blenden aus, die Tuerme der Zeile stehen
//     wieder in ihrer alten Hoehe; alle Wuerfel gleiten von oben her nacheinander
//     in EINE Reihe oben im Karo, in Fuenferstruktur (nach je 5 eine Luecke);
//     dann werden sie reihum auf die Plaetze der Runden gelegt, je Platz einer
//     (0,3 s je Durchgang, wie im Bauplan). Danach leuchtet die Linie wieder.
//     Dauer, gemessen: 3,8 s („2, 4, 6“, 239 Frames), 4,7 s („3, 6, 4, 8, 4“,
//     291), 4,9 s („5, 9, 7, 3“, 305).
// Wer waehrend einer Bewegung „zusammenlegen und verteilen“ drueckt, laesst die
// laufende Bewegung sofort ankommen; dann geschieht das Neue (Bauart m5-rest).
// Eine Sprungmarke, „noch einmal“ und „neu“ brechen ab und bauen neu auf.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m6uZeile('246') usw.):
//     „2, 4, 6“ · „3, 6, 4, 8, 4“ · „5, 9, 7, 3“
//   „zusammenlegen und verteilen“ (_m6uVerteilen()) · „noch einmal“
//     (_m6uNochmal(), spielt die gewaehlte Zeile neu ab) · „neu“ (_m6uNeu()).
//   Die beiden ersten sind blass, solange keine Zeile gewaehlt ist.
//
// Statuszeilen (woertlich aus dem Bauplan, alle mit Wert mehr als 18 Zeichen –
// simfakten.js). Eine Zahl steht erst in der Anzeige, wenn sie im Bild steht:
//   _m6u-runden     „Körbe je Runde: 3, 6, 4, 8, 4“ (sofort mit der Sprungmarke)
//   _m6u-summe      „Summe aller Würfel: 25“ (wenn „= 25“ im Bild erscheint)
//   _m6u-anzahl     „Anzahl der Türme (Runden): 5“ (ebenso)
//   _m6u-hoehe      vor dem Ausgleichen „Die Türme sind verschieden hoch.“,
//                   danach „Turmhöhe nach dem Ausgleichen: 5“
//   _m6u-gewandert  „Gewanderte Würfel: 4“ (zaehlt beim Ausgleichen mit)
//   _m6u-verteilt   nur nach „zusammenlegen und verteilen“:
//                   „Auf jedem Platz liegen 5 Würfel.“ (sonst ausgeblendet)
//   Start: alle Werte „…“. Beim Zusammenlegen und Verteilen bleiben
//   _m6u-hoehe und _m6u-gewandert beim Ergebnis des Ausgleichens stehen.
//
// Werte (nachgerechnet, simcheck/werte.js):
//   2, 4, 6       → Summe 12, 3 Tuerme, Turmhoehe 4, gewandert 2, verteilt 4
//   3, 6, 4, 8, 4 → Summe 25, 5 Tuerme, Turmhoehe 5, gewandert 4, verteilt 5
//   5, 9, 7, 3    → Summe 24, 4 Tuerme, Turmhoehe 6, gewandert 4, verteilt 6
//   Eine Rechnung mit Geteiltzeichen erscheint NICHT – sie ist die Entdeckung
//   der Tabelle.
// Start: keine Tuerme („Start: Noch keine Türme, wähle eine Zeile“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): am Ende des Ausgleichens bei
// „3, 6, 4, 8, 4“ stehen alle Tuerme auf der Linie 5, die Summe 25 steht
// unveraendert darueber – Lichtring um die Linie, die Linie leuchtet 2,6 s
// bernsteinfarben nach. Das widerlegt „25 Körbe“ und „4 Körbe“. Auch nach
// „noch einmal“; nicht, wenn die Bewegung durch einen Knopf sofort ankommt.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-rest, im Container
// <div class="fpm-lehrkraft">, damit simfakten.js die Zeile ueberspringen
// kann – Bauplan V3). Eigene Zeile UNTER den Heftknoepfen, davor klein
// „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6uAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links im Bild (Stelle wie in m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6uTempo()): ein Drittel so schnell.
//   „Halt vor dem Ausgleichen: aus“ ↔ „… an“ (_m6uHaltSchalter()): Der Ablauf
//     haelt von selbst an, wenn alle Tuerme stehen und „= …“ da ist, BEVOR der
//     erste Wuerfel wandert. Dann ist Pause; „weiter“ gleicht aus.
//   Nur das wechselnde Wort steht in einem eigenen <span> (_m6u-tempo-an,
//   _m6u-halt-an), damit die Aufschrift nicht als Statuszeile in den
//   Faktendump geraet.
// Hinweiszeile _m6u-lehrkraft (in der Pause „lmp-status off“, sonst „on“)
// nennt immer die Einstellung, so aendert JEDER Lehrkraft-Knopf eine Zeile:
//   sonst  „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal, Halt vor dem Ausgleichen: aus.“
//   Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. Tempo: …“
//   Halt   „Halt: Alle 5 Türme stehen. Jetzt kommt das Ausgleichen.“ (Wortlaut
//          wie m5-spannweite / m5-median)
// Die Hinweiszeile steht IM Container .fpm-lehrkraft (wie alle m5-Bausaetze).
// So ist es gebaut (wie m5-rest):
//   * EIN Zeitfaktor (_m6uZeitfaktor: 0 in der Pause, 1/3 langsam, 1 normal)
//     an der einen Stelle, an der dt in _m6uUpdate hineingeht. Ohne Zeit kein
//     Schritt im Ablauf (`dt > 0`). Voreinstellung: Faktor 1.
//   * Der Halt ist ein EREIGNIS im Ablauf (Zeitpunkt plan.halt wird
//     ueberschritten), keine Zeitmessung.
//   * In der Pause bewegt „zusammenlegen und verteilen“ nichts: Steht eine
//     Bewegung, entfaellt der Druck; steht keine, wird er VORGEMERKT und
//     beginnt mit „weiter“. Das Schild „Pause“ leuchtet dabei kurz auf.
//     Eine Sprungmarke, „noch einmal“ und „neu“ heben die Pause auf; Tempo
//     und Halt bleiben stehen.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Mittelwert“, „geteilt“,
// ein Geteiltzeichen, die Regel als Satz. „Durchschnitt“ (Ueberschrift) und
// „Summe“ sind erlaubt. Keine Namen, keine Punkte, keine Zeitmessung.
// ════════════════════════════════════════════════════════════════════════
let _m6u = null;
const _m6uREIHEN = { '246': [2, 4, 6], '36484': [3, 6, 4, 8, 4], '5973': [5, 9, 7, 3] };
const _m6uREIHE = ['246', '36484', '5973'];
const _m6uAHA = '36484';
const _m6uK = {
  // Karo: Kaestchen (= 1 Wuerfel), Achse der Hoehenskala, Spalten rechts davon,
  // Turmabstand (Kaestchen), Boden (Hoehe 0), oberste Skalenzahl
  KA: 16, XA: 38, SP: 23, ABST: 4, YB: 206, HMAX: 10,
  PX0: 4, PX1: 416, PY0: 28, PY1: 246,        // Papier (oben 28: Platz fuer Pfeil und Achsentitel)
  ZY0: 6, ZY1: 36, ZG: 27, ZGR: 18,           // Zettel mit der Plusaufgabe, Grundlinie, Schriftgrad
  YRUNDE: 222, YZAHL: 241,                    // Beschriftung unter den Tuermen
  YREIHE: 54, RK: 0.8, R5: 6,                 // Reihe beim Zusammenlegen: Mitte, Wuerfelgroesse, Fuenferluecke
  // Zeiten in s – Sprungmarke
  T_ALT: 0.25, T_START: 0.3, T_W: 0.1, T_POP: 0.16, T_TPAUSE: 0.15, T_SUMME: 0.2, T_VOR: 0.7,
  T_ZUG: 0.6, T_ZLUECKE: 0.1, T_LINIE: 0.2, T_ENDE: 0.6, T_GLUT: 0.35,
  // Zeiten in s – zusammenlegen und verteilen
  V_AUS: 0.2, V_EIN: 0.2, V_G0: 0.55, V_GSTAG: 0.035, V_GFLUG: 0.5,
  V_DPAUSE: 0.3, V_DURCH: 0.3, V_DSTAG: 0.04, V_DFLUG: 0.3,
  // Farben
  WUERFEL: '#fb923c', WRAND: '#c2410c', ORANGE: '#c2410c', LINIE: '#0f766e',
  TINTE: '#0f172a', GRAU: '#64748b', ACHSE: '#475569', KARO: '#d4e3f1', LICHT: '#f59e0b'
};

// ── Ablauf: alles aus der Ablaufzeit ─────────────────────────────────────
function _m6uWerte(key) { return _m6uREIHEN[key] || []; }
function _m6uSumme(w) { return w.reduce((s, v) => s + v, 0); }
// Linke Kante von Turm i (von n), auf eine Kaestchenspalte gesetzt, die Gruppe mittig.
function _m6uTurmX(n, i) {
  const K = _m6uK, breite = K.ABST * (n - 1) + 1, start = Math.floor((K.SP - breite) / 2);
  return K.XA + (start + i * K.ABST) * K.KA;
}
// Mitte des Wuerfels auf Ebene e (0 = unten) in Turm i.
function _m6uOrt(n, i, e) {
  const K = _m6uK;
  return { x: _m6uTurmX(n, i) + K.KA / 2, y: K.YB - e * K.KA - K.KA / 2 };
}
// Platz s in der Reihe beim Zusammenlegen (N Wuerfel, nach je 5 eine Luecke).
function _m6uReihenOrt(N, s) {
  const K = _m6uK, cw = K.KA * K.RK, breite = N * cw + (Math.ceil(N / 5) - 1) * K.R5;
  const x0 = K.XA + K.SP * K.KA / 2 - breite / 2;
  return { x: x0 + s * cw + Math.floor(s / 5) * K.R5 + cw / 2, y: K.YREIHE };
}
// Sprungmarke: Aufbau, dann Ausgleichen (immer oberster Wuerfel des hoechsten
// Turms auf den niedrigsten, bei Gleichstand jeweils der linke).
function _m6uPlan(key) {
  const K = _m6uK, w = _m6uWerte(key), n = w.length, summe = _m6uSumme(w);
  const bau = [];
  let t = K.T_START;
  for (let i = 0; i < n; i++) { bau.push(t); t += w[i] * K.T_W + K.T_TPAUSE; }
  const bauEnde = bau[n - 1] + (w[n - 1] - 1) * K.T_W + K.T_POP;
  const tSumme = bauEnde + K.T_SUMME, a0 = tSumme + K.T_VOR;
  const h = w.slice(), zuege = [];
  while (Math.max.apply(null, h) > Math.min.apply(null, h)) {
    let hi = 0, lo = 0;
    for (let i = 1; i < n; i++) { if (h[i] > h[hi]) hi = i; if (h[i] < h[lo]) lo = i; }
    const ab = a0 + zuege.length * (K.T_ZUG + K.T_ZLUECKE);
    zuege.push({ von: hi, nach: lo, vonEbene: h[hi] - 1, nachEbene: h[lo], ab, an: ab + K.T_ZUG });
    h[hi]--; h[lo]++;
  }
  const tLinie = (zuege.length ? zuege[zuege.length - 1].an : a0) + K.T_LINIE;
  return { key, w, n, summe, mittel: h[0], bau, bauEnde, tSumme, a0, zuege, tLinie,
           ende: tLinie + K.T_ENDE, halt: a0 - 0.005 };
}
// „zusammenlegen und verteilen“: Tuerme der Zeile stehen wieder, alle Wuerfel in
// eine Reihe (Turm fuer Turm, von oben), dann reihum je einer auf jeden Platz.
function _m6uVPlan(key) {
  const K = _m6uK, w = _m6uWerte(key), n = w.length, summe = _m6uSumme(w), mittel = summe / n;
  const sammeln = [];
  for (let i = 0; i < n; i++)
    for (let e = w[i] - 1; e >= 0; e--) {
      const ab = K.V_G0 + sammeln.length * K.V_GSTAG;
      sammeln.push({ i, e, ab, an: ab + K.V_GFLUG });
    }
  const gEnde = sammeln.length ? sammeln[sammeln.length - 1].an : K.V_G0;
  const d0 = gEnde + K.V_DPAUSE, legen = [];
  for (let p = 0; p < mittel; p++)
    for (let i = 0; i < n; i++) {
      const ab = d0 + p * K.V_DURCH + i * K.V_DSTAG;
      legen.push({ s: p * n + i, i, e: p, ab, an: ab + K.V_DFLUG });
    }
  const dEnde = legen.length ? legen[legen.length - 1].an : d0;
  const tLinie = dEnde + K.T_LINIE;
  return { key, w, n, summe, mittel, sammeln, legen, tLinie, ende: tLinie + K.T_ENDE };
}

// Was die Statuszeilen brauchen: Summe da? Tuerme gleich? Wie viele gewandert? Verteilt?
function _m6uStandAus(z) {
  const L = z.lauf;
  if (!L) return { summeDa: !!z.key, gleich: !!z.key && z.gespielt, gewandert: z.gewandert, verteilt: z.verteilt };
  const P = L.plan, at = L.at;
  if (L.art === 'spiel') {
    let gew = 0;
    for (const zg of P.zuege) if (at >= zg.an) gew++;
    return { summeDa: at >= P.tSumme, gleich: at >= P.tLinie, gewandert: gew, verteilt: false };
  }
  // Verteilen: die Ergebnisse des Ausgleichens bleiben stehen.
  return { summeDa: true, gleich: true, gewandert: z.gewandert, verteilt: at >= P.tLinie };
}

function _m6uInit() {
  _m6u = { t: 0, key: null, gespielt: false, gewandert: 0, verteilt: false, lauf: null,
           alt: null, linieT: 9, ahaGlanz: 0, blink: 0, vorgemerkt: false,
           pause: false, langsam: false, haltAn: false, halt: false,    // Lehrkraft-Einstellungen
           fx: { teile: [] } };
  _m6u.stand = _m6uStandAus(_m6u);
}
// Was gerade im Bild steht, blendet aus (0,25 s); Pause und Halt werden aufgehoben.
function _m6uAufraeumen() {
  const z = _m6u;
  if (z.key) {
    const S = _m6uSzene();
    z.alt = { key: z.key, hoehen: S.tuerme.map(tu => tu.wuerfel.length), linie: S.linie > 0.5, at: 0 };
  } else z.alt = null;
  z.linieT = 9; z.ahaGlanz = 0; z.fx.teile.length = 0;
  z.pause = false; z.halt = false; z.vorgemerkt = false;   // neu laden hebt die Pause auf
}
function _m6uSpielen(key) {
  const z = _m6u;
  _m6uAufraeumen();
  z.key = key; z.gespielt = false; z.verteilt = false; z.gewandert = 0;
  z.lauf = { art: 'spiel', plan: _m6uPlan(key), at: 0, angehalten: false };
  z.stand = _m6uStandAus(z);
}

function _m6uKnopf(key) {
  return _m6uWerte(key).join(',&nbsp;');
}
function _m6uHTML() {
  const marke = k => `<button class="sim-btn" id="_m6u-b-${k}" onclick="_m6uZeile('${k}')">${_m6uKnopf(k)}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Körbe sind es im Durchschnitt?</h3>
    <div class="fpm-note" style="margin-top:2px">Jeder Turm ist eine Runde. Wähle eine Zeile und sieh zu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6u-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6uREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6u-verteilen" onclick="_m6uVerteilen()">zusammenlegen und verteilen</button>
          <button class="sim-btn" id="_m6u-nochmal" onclick="_m6uNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m6uNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6u-pause" onclick="_m6uAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6u-tempo" onclick="_m6uTempo()">Tempo: <span id="_m6u-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6u-halt" onclick="_m6uHaltSchalter()">Halt vor dem Ausgleichen: <span id="_m6u-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6u-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6u-runden" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6u-summe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6u-anzahl" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6u-hoehe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6u-gewandert" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6u-verteilt" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Noch keine Türme, wähle eine Zeile</p>
  </div>`;
}
function _m6uSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6uStatus() {
  if (!_m6u) return;
  const z = _m6u, K = _m6uK, st = z.stand;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const w = _m6uWerte(z.key), n = w.length, summe = _m6uSumme(w), mittel = n ? summe / n : 0;
  _m6uSetze('_m6u-runden', 'Körbe je Runde: ' + (z.key ? f(w.join(', '), K.ORANGE) : '…'));
  _m6uSetze('_m6u-summe', 'Summe aller Würfel: ' + (st.summeDa ? f(summe, K.ORANGE) : '…'));
  _m6uSetze('_m6u-anzahl', 'Anzahl der Türme (Runden): ' + (st.summeDa ? f(n, K.TINTE) : '…'));
  _m6uSetze('_m6u-hoehe', st.gleich ? 'Turmhöhe nach dem Ausgleichen: ' + f(mittel, K.LINIE)
    : st.summeDa ? 'Die Türme sind verschieden hoch.' : 'Turmhöhe nach dem Ausgleichen: …');
  _m6uSetze('_m6u-gewandert', 'Gewanderte Würfel: ' + (st.summeDa ? f(st.gewandert, K.LINIE) : '…'));
  const v = _m6uSetze('_m6u-verteilt', st.verteilt ? 'Auf jedem Platz liegen ' + f(mittel, K.LINIE) + ' Würfel.' : '');
  if (v && v.style) v.style.display = st.verteilt ? '' : 'none';
  _m6uREIHE.forEach(k => {
    const b = document.getElementById('_m6u-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  const aktiv = !!z.key;
  for (const id of ['_m6u-verteilen', '_m6u-nochmal']) {
    const b = document.getElementById(id);
    if (b) { b.disabled = !aktiv; if (b.style) b.style.opacity = aktiv ? '' : '0.45'; }
  }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6uSetze('_m6u-pause', z.pause ? 'weiter' : 'Pause');
  _m6uSetze('_m6u-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6uSetze('_m6u-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _m6uSetze('_m6u-lehrkraft', _m6uHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6u-pause', z.pause], ['_m6u-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6uHinweis() {
  const z = _m6u;
  if (z.halt) return 'Halt: Alle ' + _m6uWerte(z.key).length + ' Türme stehen. Jetzt kommt das Ausgleichen.';
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt vor dem Ausgleichen: ' + (z.haltAn ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6uZeile(k) {
  if (!_m6u || !_m6uREIHEN[k]) return;
  _m6uSpielen(String(k));
  _m6uStatus();
}
function _m6uNochmal() {
  if (!_m6u || !_m6u.key) return;
  _m6uSpielen(_m6u.key);
  _m6uStatus();
}
function _m6uNeu() {
  if (!_m6u) return;
  const z = _m6u;
  _m6uAufraeumen();
  z.key = null; z.lauf = null; z.gespielt = false; z.verteilt = false; z.gewandert = 0;
  z.stand = _m6uStandAus(z);
  _m6uStatus();
}
// Die laufende Bewegung sofort ankommen lassen (Endstand setzen, ohne Lichtring).
function _m6uAnkommen() {
  const z = _m6u, L = z.lauf;
  if (!L) return;
  if (L.art === 'spiel') z.gewandert = L.plan.zuege.length;
  else z.verteilt = true;
  if (!(L.at >= L.plan.tLinie)) z.linieT = 9;        // sofort angekommen: die Linie steht ohne Leuchten
  z.gespielt = true; z.lauf = null; z.halt = false;
  z.stand = _m6uStandAus(z);
}
function _m6uVerteilen() {
  if (!_m6u) return;
  const z = _m6u;
  if (!z.key) return;                                // erst nach einer Zeile
  if (z.pause) {                                     // in der Pause: vormerken oder entfallen lassen
    z.blink = 0.6;
    if (!z.lauf) z.vorgemerkt = true;
    _m6uStatus();
    return;
  }
  if (z.lauf) _m6uAnkommen();
  z.verteilt = false; z.ahaGlanz = 0; z.linieT = 9; z.fx.teile.length = 0; z.alt = null;
  z.lauf = { art: 'verteilen', plan: _m6uVPlan(z.key), at: 0 };
  z.stand = _m6uStandAus(z);
  _m6uStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6uAnhalten() {
  if (!_m6u) return;
  const z = _m6u;
  if (z.pause) {
    z.pause = false; z.halt = false; z.blink = 0;
    if (z.vorgemerkt) { z.vorgemerkt = false; _m6uVerteilen(); return; }
  } else z.pause = true;
  _m6uStatus();
}
function _m6uTempo() {
  if (!_m6u) return;
  _m6u.langsam = !_m6u.langsam;
  _m6uStatus();
}
function _m6uHaltSchalter() {
  if (!_m6u) return;
  _m6u.haltAn = !_m6u.haltAn;
  _m6uStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6uZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6uUpdate(dt) {
  if (!_m6u) return;
  const z = _m6u, K = _m6uK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);              // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6uZeitfaktor(z);                      // ab hier Sim-Zeit
  z.t += dt;
  z.linieT += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  if (z.alt) { z.alt.at += dt; if (z.alt.at >= K.T_ALT) z.alt = null; }
  const L = z.lauf;
  if (L && dt > 0) {                                 // ohne Zeit kein Schritt im Ablauf
    const P = L.plan, vor = L.at;
    L.at += dt;
    let neu = false;
    if (L.art === 'spiel' && z.haltAn && !L.angehalten && vor < P.halt && L.at >= P.halt) {
      L.at = P.halt; L.angehalten = true;            // Halt: alle Tuerme stehen, noch nichts gewandert
      z.pause = true; z.halt = true; neu = true;
    }
    if (vor < P.tLinie && L.at >= P.tLinie) {         // die Linie leuchtet auf
      z.linieT = 0;
      if (L.art === 'spiel' && P.key === _m6uAHA) {  // Aha: Lichtring um die Linie
        z.ahaGlanz = 2.6;
        _bioFxWelle(z.fx.teile, K.XA + K.SP * K.KA / 2, K.YB - P.mittel * K.KA, K.LICHT, 90);
      }
    }
    const st = _m6uStandAus(z), alt = z.stand;
    if (st.summeDa !== alt.summeDa || st.gleich !== alt.gleich || st.gewandert !== alt.gewandert ||
        st.verteilt !== alt.verteilt) neu = true;
    z.stand = st;
    if (L.at >= P.ende) { _m6uAnkommen(); neu = true; }
    if (neu) _m6uStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Was gerade zu sehen ist ─────────────────────────────────────────────
// tuerme[i] = { wuerfel: [{e, dy, a}], zahl, a } · flug: fliegende Wuerfel {x, y, k, licht}
// reihe: Wuerfel in der Reihe {x, y} · summanden[i] = {wert, glut} oder null
// summe: „= …“ sichtbar · linie: 0 … 1 · glut[i]: Leuchten von Turm i
function _m6uBahn(a, b, u, bogen, k0, k1) {
  const e = _bioFxEase.sanft(_bioFxKlemme(u));
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e - bogen * Math.sin(Math.PI * e),
           k: k0 + (k1 - k0) * e };
}
function _m6uSzene() {
  const z = _m6u, K = _m6uK, L = z.lauf, E = _bioFxEase, kl = _bioFxKlemme;
  const S = { n: 0, tuerme: [], flug: [], reihe: [], summanden: [], summe: false, summePop: 1,
              linie: 0, glut: [], plaetze: 0 };
  if (!z.key) return S;
  const w = _m6uWerte(z.key), n = w.length, mittel = _m6uSumme(w) / n;
  const stapel = (h, a) => { const r = []; for (let e = 0; e < h; e++) r.push({ e, dy: 0, a: 1 }); return { wuerfel: r, zahl: h, a }; };
  S.n = n;
  if (!L) {                                          // fertiges Bild: alle Tuerme gleich hoch
    for (let i = 0; i < n; i++) S.tuerme.push(stapel(mittel, 1));
    S.summanden = w.map(v => ({ wert: v, glut: 0 }));
    S.summe = true; S.linie = 1; S.plaetze = 1; S.glut = w.map(() => 0);
    return S;
  }
  const P = L.plan, at = L.at;
  if (L.art === 'spiel') {
    S.plaetze = kl((at - K.T_START + 0.1) / 0.25);
    S.glut = w.map(() => 0);
    if (at < P.a0) {                                 // Aufbau: Wuerfel fuer Wuerfel
      for (let i = 0; i < n; i++) {
        const tu = { wuerfel: [], zahl: null, a: 1 };
        for (let j = 0; j < w[i]; j++) {
          const t0 = P.bau[i] + j * K.T_W;
          if (at < t0) break;
          const u = kl((at - t0) / K.T_POP);
          tu.wuerfel.push({ e: j, dy: -10 * (1 - E.raus(u)), a: kl(u * 2) });
        }
        if (at >= P.bau[i]) {
          tu.zahl = tu.wuerfel.length;
          S.summanden[i] = { wert: tu.wuerfel.length, glut: 0 };
          const fertig = P.bau[i] + w[i] * K.T_W;
          const g = at < fertig ? 1 : 1 - kl((at - fertig) / K.T_GLUT);
          S.glut[i] = g; S.summanden[i].glut = g;
        } else S.summanden[i] = null;
        S.tuerme.push(tu);
      }
    } else {                                         // Ausgleichen
      const h = w.slice();
      for (const zg of P.zuege) {
        if (at < zg.ab) break;
        h[zg.von]--;
        if (at >= zg.an) h[zg.nach]++;
        else S.flug.push(Object.assign(_m6uBahn(_m6uOrt(n, zg.von, zg.vonEbene), _m6uOrt(n, zg.nach, zg.nachEbene),
          (at - zg.ab) / K.T_ZUG, 30, 1, 1), { licht: true }));
      }
      for (let i = 0; i < n; i++) S.tuerme.push(stapel(h[i], 1));
      S.summanden = w.map(v => ({ wert: v, glut: 0 }));
    }
    S.summe = at >= P.tSumme; S.summePop = kl((at - P.tSumme) / 0.3);
    S.linie = at >= P.tLinie ? kl((at - P.tLinie) / 0.3) : 0;
    return S;
  }
  // zusammenlegen und verteilen
  S.plaetze = 1; S.summe = true; S.glut = w.map(() => 0);
  S.summanden = w.map(v => ({ wert: v, glut: 0 }));
  S.linie = at >= P.tLinie ? kl((at - P.tLinie) / 0.3) : 0;
  if (at < K.V_AUS) {                                // die gleichen Tuerme blenden aus, die Linie mit
    const a = 1 - kl(at / K.V_AUS);
    for (let i = 0; i < n; i++) S.tuerme.push(stapel(mittel, a));
    S.linie = a;
    return S;
  }
  const h = w.map(() => 0), wuerfel = w.map(() => []);
  const ein = kl((at - K.V_AUS) / K.V_EIN);
  for (const q of P.sammeln) {                       // die Tuerme der Zeile, von oben abgetragen
    if (at < q.ab) wuerfel[q.i].push({ e: q.e, dy: 0, a: 1 });
  }
  const N = P.sammeln.length;
  P.sammeln.forEach((q, s) => {
    if (at >= q.ab && at < q.an)
      S.flug.push(Object.assign(_m6uBahn(_m6uOrt(n, q.i, q.e), _m6uReihenOrt(N, s), (at - q.ab) / K.V_GFLUG, 18, 1, K.RK),
        { licht: false }));
  });
  const weg = new Set();
  for (const d of P.legen) {
    if (at < d.ab) continue;
    weg.add(d.s);
    if (at >= d.an) wuerfel[d.i].push({ e: d.e, dy: 0, a: 1 });
    else S.flug.push(Object.assign(_m6uBahn(_m6uReihenOrt(N, d.s), _m6uOrt(n, d.i, d.e), (at - d.ab) / K.V_DFLUG, 14, K.RK, 1),
      { licht: false }));
  }
  P.sammeln.forEach((q, s) => { if (at >= q.an && !weg.has(s)) S.reihe.push(_m6uReihenOrt(N, s)); });
  for (let i = 0; i < n; i++) {
    wuerfel[i].sort((a, b) => a.e - b.e);
    h[i] = wuerfel[i].length;
    S.tuerme.push({ wuerfel: wuerfel[i], zahl: h[i], a: ein });
  }
  return S;
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6uText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m6uK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Papier mit Karo, Hoehenskala links (0 bis 10, Zahl an jeder Linie, oben Pfeil
// und Achsentitel „Körbe“) und Boden.
function _m6uPapier(ctx) {
  const K = _m6uK, x1 = K.XA + K.SP * K.KA, yo = K.YB - K.HMAX * K.KA;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 2, K.PX1 - K.PX0, K.PY1 - K.PY0, 8); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 8); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 1;
  for (let c = 1; c <= K.SP; c++) {
    ctx.strokeStyle = K.KARO;
    ctx.beginPath(); ctx.moveTo(K.XA + c * K.KA, yo); ctx.lineTo(K.XA + c * K.KA, K.YB); ctx.stroke();
  }
  for (let k = 1; k <= K.HMAX; k++) {
    const y = K.YB - k * K.KA;
    ctx.strokeStyle = k % 5 ? K.KARO : '#b9cde3';
    ctx.beginPath(); ctx.moveTo(K.XA, y); ctx.lineTo(x1, y); ctx.stroke();
  }
  // Skala: Achse, Striche, Zahlen
  ctx.strokeStyle = K.ACHSE; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(K.XA, K.YB); ctx.lineTo(K.XA, yo - 6); ctx.stroke();
  ctx.fillStyle = K.ACHSE;                           // Pfeilspitze (unter dem Schild „Pause“, das bei y = 33 endet)
  ctx.beginPath(); ctx.moveTo(K.XA, yo - 12); ctx.lineTo(K.XA - 4.5, yo - 4); ctx.lineTo(K.XA + 4.5, yo - 4);
  ctx.closePath(); ctx.fill();
  // Achsentitel rechts neben der Pfeilspitze, ueber dem Karo; auch er bleibt
  // unter dem Schild „Pause“ frei.
  _m6uText(ctx, 'Körbe', K.XA + 9, yo - 3, 11, K.TINTE, 'left', '700');
  for (let k = 0; k <= K.HMAX; k++) {
    const y = K.YB - k * K.KA;
    ctx.beginPath(); ctx.moveTo(K.XA - 4, y); ctx.lineTo(K.XA, y); ctx.stroke();
    _m6uText(ctx, String(k), K.XA - 7, y + 4, 11, K.GRAU, 'right', '700');
  }
  // Boden
  ctx.strokeStyle = K.ACHSE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(K.XA, K.YB); ctx.lineTo(x1, K.YB); ctx.stroke();
  ctx.restore();
}
// Ein Steckwuerfel (Mitte x, y; k = Massstab; a = Deckkraft; licht = bernsteinfarbener Rand).
function _m6uWuerfel(ctx, x, y, k, a, licht) {
  if (a <= 0.01 || k <= 0.05) return;
  const K = _m6uK, s = K.KA * k, x0 = x - s / 2, y0 = y - s / 2;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (licht) {
    ctx.strokeStyle = K.LICHT; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, x0 - 2, y0 - 2, s + 4, s + 4, 4 * k); ctx.stroke();
  }
  ctx.fillStyle = K.WUERFEL; ctx.strokeStyle = K.WRAND; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x0 + 0.5, y0 + 0.5, s - 1, s - 1, 2.5 * k); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  _bioFxRundRect(ctx, x0 + 2.5 * k, y0 + 2.2 * k, s - 5 * k, s * 0.26, 1.5 * k); ctx.fill();
  ctx.fillStyle = 'rgba(154,52,18,0.30)';                // Steckknopf
  ctx.beginPath(); ctx.arc(x, y + 1.2 * k, 2.6 * k, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// Ein Turm: Wuerfel, Fuenfermarke, Leuchten (glut 0 … 1).
function _m6uTurm(ctx, n, i, tu, glut) {
  const K = _m6uK, x = _m6uTurmX(n, i), hoch = tu.wuerfel.length;
  if (glut > 0.01 && hoch) {
    ctx.save();
    ctx.globalAlpha = 0.45 * glut * tu.a;
    ctx.fillStyle = '#fde68a';
    _bioFxRundRect(ctx, x - 5, K.YB - hoch * K.KA - 5, K.KA + 10, hoch * K.KA + 5, 6); ctx.fill();
    ctx.restore();
  }
  for (const wu of tu.wuerfel) {
    const p = _m6uOrt(n, i, wu.e);
    _m6uWuerfel(ctx, p.x, p.y + wu.dy, 1, wu.a * tu.a, false);
  }
  if (hoch >= 5) {                                   // feine Fuenfermarke ueber dem 5. Wuerfel
    const y = K.YB - 5 * K.KA;
    ctx.save();
    ctx.globalAlpha = tu.a;
    ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.lineTo(x + K.KA + 3, y); ctx.stroke();
    ctx.restore();
  }
}
// Platz und Beschriftung unter einem Turm: „Runde i“ und die Zahl der Wuerfel.
function _m6uUnten(ctx, n, i, zahl, a) {
  const K = _m6uK, x = _m6uTurmX(n, i);
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = '#94a3b8';
  _bioFxRundRect(ctx, x - 3, K.YB + 1, K.KA + 6, 4, 2); ctx.fill();
  _m6uText(ctx, 'Runde ' + (i + 1), x + K.KA / 2, K.YRUNDE, 11, K.GRAU, 'center', '700');
  if (zahl !== null && zahl !== undefined) _m6uText(ctx, String(zahl), x + K.KA / 2, K.YZAHL, 15, K.TINTE, 'center', '700');
  ctx.restore();
}
// Zettel mit der Plusaufgabe (Lage fest aus der ganzen Aufgabe, damit nichts springt).
function _m6uGleichung(ctx, w, summanden, summe, summePop, a) {
  const K = _m6uK, gr = K.ZGR, mitte = K.XA + K.SP * K.KA / 2;
  if (a <= 0.01 || !w.length) return;
  const teile = [];
  w.forEach((v, i) => {
    if (i) teile.push({ t: '+', i, art: 'plus' });
    teile.push({ t: String(v), i, art: 'zahl' });
  });
  teile.push({ t: '=', art: 'gleich' }, { t: String(_m6uSumme(w)), art: 'summe' });
  ctx.save();
  ctx.globalAlpha = a;
  ctx.font = '700 ' + gr + 'px sans-serif';
  const br = teile.map(t => ctx.measureText(t.t).width), luft = gr * 0.32;
  const ges = br.reduce((s, b) => s + b, 0) + luft * (teile.length - 1);
  const x0 = mitte - ges / 2 - 14, x1 = mitte + ges / 2 + 14;
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, x0 + 2, K.ZY0 + 2, x1 - x0, K.ZY1 - K.ZY0, 7); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x0, K.ZY0, x1 - x0, K.ZY1 - K.ZY0, 7); ctx.fill(); ctx.stroke();
  let x = mitte - ges / 2;
  teile.forEach((t, j) => {
    const s = t.i !== undefined ? summanden[t.i] : null;
    if (t.art === 'zahl' && s) {
      if (s.glut > 0.01) {                           // Summand leuchtet mit seinem Turm
        ctx.save();
        ctx.globalAlpha = a * 0.55 * s.glut;
        ctx.fillStyle = '#fde68a';
        _bioFxRundRect(ctx, x - 4, K.ZY0 + 4, br[j] + 8, K.ZY1 - K.ZY0 - 8, 4); ctx.fill();
        ctx.restore();
      }
      _m6uText(ctx, String(s.wert), x + br[j] / 2, K.ZG, gr, K.ORANGE, 'center', '700');
    } else if (t.art === 'plus' && s) {
      _m6uText(ctx, '+', x + br[j] / 2, K.ZG, gr, K.TINTE, 'center', '700');
    } else if ((t.art === 'gleich' || t.art === 'summe') && summe) {
      const k = summePop < 1 ? Math.max(0.3, _bioFxEase.federn(summePop)) : 1;
      ctx.save();
      ctx.translate(x + br[j] / 2, K.ZG - gr * 0.35); ctx.scale(k, k);
      _m6uText(ctx, t.t, 0, gr * 0.35, gr, t.art === 'summe' ? K.ORANGE : K.TINTE, 'center', '700');
      ctx.restore();
    }
    x += br[j] + luft;
  });
  ctx.restore();
}
// Gestrichelte Linie auf der Ausgleichshoehe; die Skalenzahl dort im petrol Schild.
function _m6uLinie(ctx, mittel, a, glanz) {
  const K = _m6uK, y = K.YB - mittel * K.KA, x1 = K.XA + K.SP * K.KA;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = a;
  if (glanz > 0.01) {                                // kurzes Aufleuchten beim Erscheinen
    ctx.save();
    ctx.globalAlpha = a * 0.35 * glanz;
    ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(K.XA, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.restore();
  }
  ctx.strokeStyle = K.LINIE; ctx.lineWidth = 2.5;
  ctx.setLineDash([7, 5]);
  ctx.beginPath(); ctx.moveTo(K.XA, y); ctx.lineTo(x1, y); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = K.LINIE;
  _bioFxRundRect(ctx, K.XA - 24, y - 8, 22, 16, 5); ctx.fill();
  _m6uText(ctx, String(mittel), K.XA - 13, y + 4.5, 12, '#ffffff', 'center', '700');
  ctx.restore();
}
// Das alte Bild (beim Wechsel der Zeile) – blendet aus.
function _m6uAltesBild(ctx, alt, a) {
  const w = _m6uWerte(alt.key), n = w.length;
  if (a <= 0.01 || !n) return;
  _m6uGleichung(ctx, w, w.map(v => ({ wert: v, glut: 0 })), true, 1, a);
  for (let i = 0; i < n; i++) {
    const h = alt.hoehen[i] || 0, wu = [];
    for (let e = 0; e < h; e++) wu.push({ e, dy: 0, a: 1 });
    _m6uTurm(ctx, n, i, { wuerfel: wu, zahl: h, a }, 0);
    _m6uUnten(ctx, n, i, h, a);
  }
  if (alt.linie) _m6uLinie(ctx, _m6uSumme(w) / n, a, 0);
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m6uPauseSchild(ctx) {
  const z = _m6u, w = 64, h = 25, x = 8, y = 8;
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
  _m6uText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6uDraw(ctx, cv) {
  if (!_m6u) return;
  const z = _m6u, K = _m6uK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6uPapier(ctx);
  if (z.alt) _m6uAltesBild(ctx, z.alt, 1 - _bioFxKlemme(z.alt.at / K.T_ALT));
  const S = _m6uSzene();
  if (S.n) {
    const w = _m6uWerte(z.key), n = S.n, mittel = _m6uSumme(w) / n;
    if (S.plaetze > 0.01) _m6uGleichung(ctx, w, S.summanden, S.summe, S.summePop, S.plaetze);
    for (let i = 0; i < n; i++) {
      const tu = S.tuerme[i];
      if (tu) _m6uTurm(ctx, n, i, tu, S.glut[i] || 0);
      _m6uUnten(ctx, n, i, tu && tu.a > 0.5 ? tu.zahl : null, S.plaetze);
    }
    for (const r of S.reihe) _m6uWuerfel(ctx, r.x, r.y, K.RK, 1, false);
    if (S.linie > 0) {
      if (z.ahaGlanz > 0) {                          // Aha: die Linie leuchtet bernsteinfarben nach
        const y = K.YB - mittel * K.KA;
        ctx.save();
        ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.8) * (0.55 + 0.45 * Math.sin(z.t * Math.PI * 1.6));
        ctx.strokeStyle = K.LICHT; ctx.lineWidth = 3;
        _bioFxRundRect(ctx, K.XA - 28, y - 11, K.SP * K.KA + 32, 22, 9); ctx.stroke();
        ctx.restore();
      }
      _m6uLinie(ctx, mittel, S.linie, Math.max(0, 1 - z.linieT / 1.2));
    }
    for (const f of S.flug) _m6uWuerfel(ctx, f.x, f.y, f.k, 1, f.licht);
  }
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6uPauseSchild(ctx);
}
