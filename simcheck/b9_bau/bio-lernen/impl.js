
// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · WIE LERNT DAS GEHIRN?   (Förderheft Bio 9 · br6)
// Kennung bio-lernen, Präfix _n9f. Bauplan: arbeitsheft_bio_foe9/einheiten/
// br6.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   links  Deniz von vorn (flach, schematisch, angezogen, nur zwei Punkte als
//          Augen). Er jongliert mit drei Bällen (rot, blau, grün): zwei in der
//          Luft, einer in der Hand. Oben der Zähler „heruntergefallen: 9 von 10“,
//          an der Wand ein Abreißkalender „Woche 0“ mit sieben Tageskästchen.
//          Heruntergefallene Bälle bleiben am Boden liegen (man kann sie auch
//          dort zählen).
//   rechts ein Ausschnitt aus seinem Gehirn (gestrichelter Lupenkeil vom Kopf
//          zum Kasten): 6 Nervenzellen als Kreise, dazwischen gelbe Linien.
//          KEINE Beschriftung, KEINE Zahl der Linien – das Kind zählt selbst.
//          Jede Linie ist EIN Strich (leicht gebogen, kreuzungsfrei: 5 Zellen
//          im Kranz, eine in der Mitte, höchstens 10 Linien = Rad mit 5
//          Speichen). Dicke Linien sind dick, dünne dünn; gezählt wird jede
//          einmal.
//
// BEDIENUNG (wörtlich; Reihenfolge = Schritte a–d der Heftseite):
//   „neu“ (_n9fNeu) · „▶ 1 Woche üben“ (_n9fUeben) · „▶ 1 Woche Pause“ (_n9fPause)
//   Sprungmarken: „2 Wochen geübt → 1 Woche Pause“ (_n9fMarke(1))
//                 „nach der Pause → 1 Woche üben“  (_n9fMarke(2))
//   Ein Druck auf „▶ …“, während noch etwas läuft, bewirkt nichts (der Knopf
//   ist dann nicht hervorgehoben). „neu“ und die Sprungmarken gehen immer.
//   Höchstens Woche 8.
//
// ABLAUF eines Wochen-Knopfs (Zeiten in s):
//   0–0,45  das alte Kalenderblatt klappt nach oben weg, darunter „Woche n“;
//           die Bälle vom Boden werden eingesammelt (verblassen)
//   0,45–2,55  die Woche im Zeitraffer, ein Kästchen je Tag:
//           üben  – Deniz jongliert schnell; jeden Tag läuft ein Lichtpaket
//                   durch das Netz; neue gelbe Linien wachsen von einer Zelle
//                   zur anderen und blitzen kurz auf (Funken), die schon
//                   vorhandenen werden dicker.
//           Pause – Deniz lässt die Arme hängen, die Bälle liegen in der Kiste;
//                   kein Lichtpaket; alle Linien werden dünner, die dünnsten
//                   werden grau, verblassen und verschwinden.
//   2,55–2,9   Deniz nimmt die Bälle
//   2,9–7,6    Test: Deniz wirft 10 Bälle (alle 0,32 s einer). Ein Ball, der
//           danebengeht, prallt von der Hand ab und rollt am Boden zur Seite;
//           der Zähler zählt beim Aufprall mit. Bei jedem zweiten Wurf läuft
//           ein Lichtpaket von der Zelle oben links durch alle Linien – wo es
//           ankommt, leuchtet die Zelle auf.
//   danach  Endbild steht: Zähler, Bälle am Boden, Linien. Alle 2,8 s ein
//           ruhiges Lichtpaket.
//   „neu“ und das Öffnen: Woche 0, sofort danach der Test (4,7 s).
//
// STATUSZEILEN (woertlich):
//   _n9f-status  während der Woche „Woche 1 · üben · Deniz übt jeden Tag …“ bzw.
//                „Woche 3 · Pause · Deniz übt in dieser Woche nicht …“,
//                im Test „Woche 1 · üben · Deniz wirft 10 Bälle …“,
//                danach „Woche 1 · üben · heruntergefallen: 6 von 10“;
//                am Start „Woche 0 · heruntergefallen: 9 von 10“.
//   Im Bild: Zähler „heruntergefallen: k von 10“ (zählt live, danach Endwert),
//   Kalender „Woche n“ mit „Start“ / „üben“ / „Pause“ darunter.
//
// MODELL (Modellwerte, Lehrerteil):
//   Übungsstand w (in Wochen): üben +1 (höchstens 4), Pause −0,5 (nie unter 0).
//   Linie i ist da, wenn w ≥ tau_i; ihre Dicke wächst mit w − tau_i. Eine Pause
//   nimmt also jeder Linie dasselbe Stück weg, und die jüngsten (dünnsten)
//   verschwinden. Wird danach wieder geübt, kommen sie zurück.
//   Zahl der heruntergefallenen Bälle je w: 0 → 9, 0,5 → 8, 1 → 6, 1,5 → 3,
//   2 → 1, ab 2,5 → 0.  Welche Würfe danebengehen: _N9F_REIHE (die ersten k).
//   Die Zahl der Nervenzellen ist immer 6.
//   WERTE (sim_plan, alle nachgerechnet, siehe _n9fErgebnis()):
//     neu (Start)                    Woche 0   9 von 10   2 Linien
//     ▶ 1 Woche üben                 Woche 1   6 von 10   5 Linien
//     ▶ 1 Woche üben (zweites Mal)   Woche 2   1 von 10   9 Linien
//     ▶ 1 Woche Pause                Woche 3   3 von 10   7 Linien
//     danach ▶ 1 Woche üben          Woche 4   0 von 10  10 Linien
//   Gegenprobe sofort mit Pause: Woche 1 · 9 von 10 · 2 Linien (wie Start).
//   _n9fErgebnis() zählt die Linien, die im LETZTEN Bild wirklich gezeichnet
//   wurden – nur für den Rechentest, nie am Bildschirm.
//
// Aha (nur _bioFx, nach der Beobachtung, kein Text): neue Linien blitzen mit
// Funken auf; je dichter das Netz, desto weiter kommt das Lichtpaket; nach einem
// Test mit weniger heruntergefallenen Bällen als vorher kurze Funken über
// Deniz, sonst nur ein ruhiger Ring um den Zähler. Keine Wertung, kein Blinken
// über 1 Hz, kein Ton. Neue Kreise erscheinen NIE.
// Nicht am Bildschirm: die Lückenwörter aus Merksatz, Aufgabe 2 und Hilfe 3
// (Liste im sim_plan) – auch nicht als Wortteil. Geprüft über den Faktendump.
// ═══════════════════════════════════════════════════════════════════════
let _n9f = null;
const _N9F_MAXWOCHE = 8;
const _N9F_WMAX = 4;                                   // höchster Übungsstand
const _N9F_FALL = [9, 8, 6, 3, 1, 0];                  // w = 0; 0,5; 1; 1,5; 2; ab 2,5
const _N9F_REIHE = [3, 6, 1, 8, 4, 9, 0, 5, 2, 7];     // diese Würfe gehen zuerst daneben
const _N9F_BLATT = 0.45, _N9F_WOCHE = 2.1, _N9F_LUFT = 0.35;   // Phasen in s
// Nervenzellen: Mitte (0) und Kranz (1–5) im Gehirnkasten x 210–414, y 6–244
const _N9F_ZELLE = [[312, 128], [254, 62], [368, 50], [390, 152], [330, 212], [242, 180]];
const _N9F_ZR = 15;                                    // Radius einer Nervenzelle
// Linien in der Reihenfolge, in der sie wachsen; tau = Übungsstand, ab dem es sie gibt
const _N9F_LINIE = [
  { a: 0, b: 1, tau: -1,   bogen: 0.09 },              // schon am Start da
  { a: 1, b: 5, tau: -1,   bogen: 0.10 },              // schon am Start da
  { a: 0, b: 2, tau: 0.3,  bogen: -0.08 },
  { a: 0, b: 5, tau: 0.6,  bogen: 0.08 },
  { a: 2, b: 3, tau: 0.9,  bogen: 0.10 },
  { a: 0, b: 3, tau: 1.2,  bogen: -0.08 },
  { a: 1, b: 2, tau: 1.45, bogen: 0.10 },
  { a: 0, b: 4, tau: 1.7,  bogen: 0.08 },
  { a: 4, b: 5, tau: 1.95, bogen: 0.10 },
  { a: 3, b: 4, tau: 2.3,  bogen: 0.10 }
];
const _N9F_KURVE = _N9F_LINIE.map((k, i) => _n9fKurveBauen(i));
// Jonglieren: innen wird geworfen, außen gefangen (Bildschirmseite L/R)
const _N9F_WURF = { L: 78, R: 122 };
const _N9F_FANG = { L: 62, R: 138 };
const _N9F_HY = 158;                                   // Höhe der Hände
const _N9F_BODEN = 225.5;                              // Ballmitte, wenn er liegt
const _N9F_BR = 6.5;                                   // Ballradius
const _N9F_PLATZ = { L: [44, 30, 58, 16, 72], R: [156, 170, 142, 184, 128] };
const _N9F_FARBE = ['#ef4444', '#3b82f6', '#22c55e'];
const _N9F_RAND = ['#991b1b', '#1e3a8a', '#166534'];

// ── Geometrie der Linien ─────────────────────────────────────────────
function _n9fKurveBauen(i) {
  const k = _N9F_LINIE[i], A = _N9F_ZELLE[k.a], B = _N9F_ZELLE[k.b];
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
  const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy);
  let nx = -dy / len, ny = dx / len, b = k.bogen;
  if (k.a !== 0 && k.b !== 0) {                        // Kranz: nach außen wölben
    const M = _N9F_ZELLE[0];
    if ((mx - M[0]) * nx + (my - M[1]) * ny < 0) { nx = -nx; ny = -ny; }
    b = Math.abs(b);
  }
  return { ax: A[0], ay: A[1], cx: mx + nx * b * len, cy: my + ny * b * len, bx: B[0], by: B[1], len };
}
function _n9fPunkt(i, s) {
  const K = _N9F_KURVE[i], u = 1 - s;
  return { x: u * u * K.ax + 2 * u * s * K.cx + s * s * K.bx,
           y: u * u * K.ay + 2 * u * s * K.cy + s * s * K.by };
}
function _n9fFall(w) {
  const i = Math.round(w * 2);
  return i < _N9F_FALL.length ? _N9F_FALL[i] : 0;
}

// ── Zustand ──────────────────────────────────────────────────────────
function _n9fInit() {
  _n9f = { t: 0, s: 0, phase: 'test', linie: _N9F_LINIE.map(() => ({ da: 0, modus: 'weg', blitz: 0 })),
           letzt: '', gezeichnet: 0 };
  _n9fGrund(0, 0, 'start');
  _n9fTestStart();
}
// Setzt alles ohne Übergang auf Übungsstand w in Woche „woche“.
function _n9fGrund(w, woche, art) {
  const n = _n9f;
  n.w = w; n.w0 = w; n.w1 = w; n.woche = woche; n.art = art;
  n.alteWoche = woche; n.alteArt = art;
  n.fall = _n9fFall(w); n.vorher = null; n.gefallen = 0; n.zuck = 0; n.zGlanz = 0; n.besser = false;
  n.test = null; n.raffer = null; n.ruhe = 0;
  n.puls = []; n.glanz = [0, 0, 0, 0, 0, 0];
  n.fx = { teile: [] };
  _N9F_LINIE.forEach((k, i) => {
    const da = w >= k.tau - 1e-9;
    n.linie[i] = { da: da ? 1 : 0, modus: da ? 'da' : 'weg', blitz: 0 };
  });
}
function _n9fPhase(p) {
  const n = _n9f;
  n.phase = p; n.s = 0;
  if (p === 'woche') n.raffer = n.art === 'ueben' ? _n9fPlan(false, 0) : null;
}
function _n9fTestStart() {
  const n = _n9f;
  _n9fPhase('test');
  n.test = _n9fPlan(true, n.fall);
  n.gefallen = 0;
}
function _n9fFertig() {
  const n = _n9f;
  n.phase = 'fertig'; n.s = 0; n.ruhe = 0;
  n.gefallen = n.fall;                                  // Endwert = Modellwert
  n.besser = n.vorher !== null && n.fall < n.vorher;
  n.zGlanz = 1;                                         // Rahmen des Zählers leuchtet kurz
  if (n.besser) for (const x of [_N9F_FANG.L, _N9F_FANG.R])
    _bioFxFunken(n.fx.teile, x, _N9F_HY - 10, 5, ['#ffd84d', '#fff3b0', '#bbf7d0']);
  n.vorher = n.fall;
  _n9fStatus();
}

// ── Bedienung ────────────────────────────────────────────────────────
function _n9fSchritt(art) {
  const n = _n9f;
  if (!n || n.phase !== 'fertig' || n.woche >= _N9F_MAXWOCHE) return;
  n.alteWoche = n.woche; n.alteArt = n.art;
  n.woche += 1; n.art = art;
  n.w0 = n.w;
  n.w1 = art === 'ueben' ? Math.min(_N9F_WMAX, n.w + 1) : Math.max(0, n.w - 0.5);
  n.fall = _n9fFall(n.w1);
  _n9fPhase('blatt');
  _n9fStatus();
}
function _n9fUeben() { _n9fSchritt('ueben'); }
function _n9fPause() { _n9fSchritt('pause'); }
function _n9fNeu() {
  if (!_n9f) return;
  _n9fGrund(0, 0, 'start');
  _n9fTestStart();
  _n9fStatus();
}
// Sprungmarken: 1 = nach 2 Wochen üben die Pause ansehen,
//               2 = nach der Pause wieder üben (Weiterforschen).
function _n9fMarke(m) {
  if (!_n9f || (m !== 1 && m !== 2)) return;
  const n = _n9f;
  if (m === 1) _n9fGrund(2, 2, 'ueben'); else _n9fGrund(1.5, 3, 'pause');
  n.test = _n9fPlan(true, n.fall); n.test.ts = 99;      // Ergebnis der Woche davor liegt schon da
  n.gefallen = n.fall; n.vorher = n.fall;
  n.phase = 'fertig'; n.s = 0;
  _n9fSchritt(m === 1 ? 'pause' : 'ueben');
}

// ── Anzeige ──────────────────────────────────────────────────────────
function _n9fArtWort(art) { return art === 'ueben' ? 'üben' : art === 'pause' ? 'Pause' : 'Start'; }
function _n9fZeile() {
  const n = _n9f;
  const kopf = 'Woche ' + n.woche + (n.art === 'start' ? '' : ' · ' + _n9fArtWort(n.art));
  if (n.phase === 'fertig') return kopf + ' · heruntergefallen: ' + n.fall + ' von 10';
  if (n.phase === 'test') return kopf + ' · Deniz wirft 10 Bälle …';
  return kopf + (n.art === 'pause' ? ' · Deniz übt in dieser Woche nicht …' : ' · Deniz übt jeden Tag …');
}
function _n9fHinweisText() {
  const n = _n9f;
  if (n.phase === 'test') return 'Sieh zu, wie viele Bälle herunterfallen.';
  if (n.phase !== 'fertig') return n.art === 'pause'
    ? 'Eine Woche vergeht im Zeitraffer. Deniz macht Pause. Sieh auf die gelben Linien.'
    : 'Eine Woche vergeht im Zeitraffer. Deniz übt jeden Tag. Sieh auf die gelben Linien.';
  if (n.woche >= _N9F_MAXWOCHE) return 'Woche 8 ist erreicht. Mit „neu“ beginnt alles von vorn.';
  if (n.woche === 0) return 'Zähle die gelben Linien. Jede Linie zählt einmal, ob dick oder dünn. Drücke dann „▶ 1 Woche üben“.';
  return 'Lies den Zähler ab. Zähle die gelben Linien: jede Linie einmal, ob dick oder dünn.';
}
function _n9fStatus() {
  if (!_n9f) return;
  const z = _n9fZeile();
  _n9f.letzt = z;
  const el = document.getElementById('_n9f-status');
  if (el) { el.textContent = z; el.className = 'lmp-status on'; }
  const h = document.getElementById('_n9f-hinweis');
  if (h) h.textContent = _n9fHinweisText();
  const frei = _n9f.phase === 'fertig' && _n9f.woche < _N9F_MAXWOCHE;
  const u = document.getElementById('_n9f-ueben');
  if (u && u.classList) u.classList.toggle('primary', frei);
}
// Nur für den Rechentest: was steht da, und wie viele Linien sind im letzten Bild?
function _n9fErgebnis() {
  const n = _n9f;
  let modell = 0;
  _N9F_LINIE.forEach((k, i) => { if (n.linie[i].modus === 'da') modell++; });
  return 'Woche ' + n.woche + ' · heruntergefallen: ' + n.gefallen + ' von 10 · Linien im Modell: ' + modell
       + ' · Linien im Bild: ' + n.gezeichnet + ' · Nervenzellen: ' + _N9F_ZELLE.length;
}
function _n9fHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie lernt das Gehirn?</h3>
    <div class="fpm-note" style="margin-top:2px">Links jongliert Deniz. Rechts siehst du einen Ausschnitt aus seinem Gehirn: Jeder Kreis ist eine Nervenzelle, jede gelbe Linie eine Verbindung.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9f-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_n9fNeu()">neu</button>
          <button class="sim-btn primary" id="_n9f-ueben" onclick="_n9fUeben()">▶ 1 Woche üben</button>
          <button class="sim-btn" id="_n9f-pause" onclick="_n9fPause()">▶ 1 Woche Pause</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Kalender und Zähler</div>
        <div class="lmp-status on" id="_n9f-status" style="margin-top:6px"></div>
        <div class="fpm-note" id="_n9f-hinweis" style="margin-top:8px"></div>
        <div class="fpm-label" style="margin-top:10px">Sprungmarken</div>
        <div class="sim-btn-row" style="margin-top:4px">
          <button class="sim-btn" onclick="_n9fMarke(1)">2 Wochen geübt → 1 Woche Pause</button>
          <button class="sim-btn" onclick="_n9fMarke(2)">nach der Pause → 1 Woche üben</button>
        </div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Woche 0 &nbsp;|&nbsp; Nach „neu“ und nach jeder Woche wirft Deniz 10 Bälle. Alle Zahlen sind Modellwerte.</p>
  </div>`;
}

// ── Jonglieren: ein Plan aus Würfen ──────────────────────────────────
// test = true: 10 Würfe, die ersten „fall“ aus _N9F_REIHE gehen daneben.
// test = false: schnelles Üben im Zeitraffer, 12 Würfe, alle gefangen.
function _n9fPlan(test, fall) {
  const n = test ? 10 : 12, faellt = [];
  for (let k = 0; k < n; k++) faellt.push(false);
  if (test) for (let j = 0; j < fall; j++) faellt[_N9F_REIHE[j]] = true;
  return { test, n, faellt, T: test ? 0.32 : 0.15, F: test ? 0.58 : 0.27,
           t0: test ? 0.3 : 0.05, hoch: test ? 46 : 50, ts: 0, gefeuert: -1, gelandet: 0 };
}
function _n9fA(L, k) { return L.t0 + k * L.T; }
function _n9fVon(k) { return k % 2 === 0 ? 'R' : 'L'; }
function _n9fNach(k) { return k % 2 === 0 ? 'L' : 'R'; }
function _n9fLandezeit() {                             // vom verpassten Fang bis zum Boden
  const g = 640, v = 40, h = _N9F_BODEN - _N9F_HY;
  return (-v + Math.sqrt(v * v + 2 * g * h)) / g;
}
function _n9fEnde(L) { return _n9fA(L, L.n - 1) + L.F + _n9fLandezeit() + 0.55; }
function _n9fPlatz(L, k) {
  const z = _n9fNach(k);
  let j = 0;
  for (let m = 0; m < k; m++) if (L.faellt[m] && _n9fNach(m) === z) j++;
  return _N9F_PLATZ[z][Math.min(j, 4)];
}
// Ein Ball, der danebengeht: prallt von der Hand ab, fällt, rollt zu seinem Platz.
function _n9fFallPos(L, k, s) {
  const d = s - (_n9fA(L, k) + L.F), z = _n9fNach(k);
  const x0 = _N9F_FANG[z], vx = z === 'L' ? -46 : 46, tl = _n9fLandezeit();
  if (d < tl) return { x: x0 + vx * d, y: _N9F_HY + 40 * d + 320 * d * d };
  const xl = x0 + vx * tl, ziel = _n9fPlatz(L, k);
  const u = _bioFxKlemme((d - tl) / 0.5);
  return { x: xl + (ziel - xl) * _bioFxEase.raus(u),
           y: _N9F_BODEN - 7 * Math.abs(Math.sin(u * Math.PI * 2)) * (1 - u) };
}
// Alle Bälle eines Plans zur Zeit s: in der Hand (hand), im Flug oder am Boden.
function _n9fBaelle(L, s) {
  const aus = [];
  for (let k = 0; k < L.n; k++) {
    const a = _n9fA(L, k), von = _n9fVon(k), nach = _n9fNach(k);
    if (s < a) {
      if (k < 3 || s >= _n9fA(L, k - 3) + L.F) aus.push({ k, hand: von });
      continue;
    }
    if (s < a + L.F) {
      const u = (s - a) / L.F, x0 = _N9F_WURF[von], x1 = _N9F_FANG[nach];
      aus.push({ k, x: x0 + (x1 - x0) * u, y: _N9F_HY - 4 * (_N9F_HY - L.hoch) * u * (1 - u) });
      continue;
    }
    if (L.faellt[k]) { const p = _n9fFallPos(L, k, s); aus.push({ k, x: p.x, y: p.y, boden: true }); continue; }
    if (k + 3 >= L.n) aus.push({ k, hand: nach });     // die letzten bleiben in der Hand
  }
  return aus;
}
// Wo ist die Hand h zur Zeit s? Zwischen Fang (außen) und Wurf (innen) holt sie
// unten aus, zwischen Wurf und Fang geht sie leicht nach oben.
function _n9fHandPos(L, s, h) {
  let vor = null, nach = null;
  for (let k = 0; k < L.n; k++) {
    const ev = [];
    if (_n9fVon(k) === h) ev.push({ t: _n9fA(L, k), x: _N9F_WURF[h], wurf: true });
    if (_n9fNach(k) === h) ev.push({ t: _n9fA(L, k) + L.F, x: _N9F_FANG[h], wurf: false });
    for (const e of ev) {
      if (e.t <= s && (!vor || e.t > vor.t)) vor = e;
      if (e.t > s && (!nach || e.t < nach.t)) nach = e;
    }
  }
  if (!vor && !nach) return { x: _N9F_WURF[h], y: _N9F_HY };
  if (!vor) return { x: nach.x, y: _N9F_HY };
  if (!nach) return { x: vor.x, y: _N9F_HY };
  const u = _bioFxEase.sanft(_bioFxKlemme((s - vor.t) / (nach.t - vor.t)));
  return { x: vor.x + (nach.x - vor.x) * u, y: _N9F_HY + (vor.wurf ? -4 : 7) * Math.sin(Math.PI * u) };
}

// ── Lichtpakete durch das Netz ───────────────────────────────────────
function _n9fWelle(start) {
  const n = _n9f, w = { erreicht: [false, false, false, false, false, false] };
  w.erreicht[start] = true;
  n.glanz[start] = 1;
  _n9fSenden(start, w);
}
function _n9fSenden(z, w) {
  const n = _n9f;
  _N9F_LINIE.forEach((k, i) => {
    if (n.linie[i].modus !== 'da' || n.puls.length >= 40) return;
    let ziel;
    if (k.a === z) ziel = k.b; else if (k.b === z) ziel = k.a; else return;
    if (w.erreicht[ziel]) return;
    n.puls.push({ i, rueck: k.b === z, s: 0, ziel, w });
  });
}
function _n9fPulsUpdate(dt) {
  const n = _n9f;
  for (let j = n.puls.length - 1; j >= 0; j--) {
    const p = n.puls[j];
    if (n.linie[p.i].modus !== 'da') { n.puls.splice(j, 1); continue; }
    p.s += dt * 150 / _N9F_KURVE[p.i].len;
    if (p.s >= 1) {
      n.puls.splice(j, 1);
      if (!p.w.erreicht[p.ziel]) {
        p.w.erreicht[p.ziel] = true;
        n.glanz[p.ziel] = 1;
        _n9fSenden(p.ziel, p.w);
      }
    }
  }
  for (let z = 0; z < 6; z++) n.glanz[z] = Math.max(0, n.glanz[z] - dt * 1.3);
}
// Lichtpaket bei jedem zweiten Wurf eines Plans
function _n9fFeuern(L, s) {
  while (L.gefeuert + 1 < L.n && s >= _n9fA(L, L.gefeuert + 1)) {
    L.gefeuert++;
    if (L.gefeuert % 2 === 0) _n9fWelle(1);
  }
}

// ── Ablauf ───────────────────────────────────────────────────────────
function _n9fLinienUpdate(dt) {
  const n = _n9f;
  _N9F_LINIE.forEach((k, i) => {
    const l = n.linie[i], soll = n.w >= k.tau - 1e-9;
    if (soll && l.da < 1) {
      if (l.modus !== 'wachsen') {
        if (l.da <= 0) {
          const p = _n9fPunkt(i, 0.5);
          _bioFxFunken(n.fx.teile, p.x, p.y, 7, ['#fef08a', '#ffffff', '#fde047']);
          l.blitz = 1;
        }
        l.modus = 'wachsen';
      }
      l.da = Math.min(1, l.da + dt / 0.4);
      if (l.da >= 1) l.modus = 'da';
    } else if (!soll && l.da > 0) {
      l.modus = 'welken';
      l.da = Math.max(0, l.da - dt / 0.7);
      if (l.da <= 0) l.modus = 'weg';
    }
    l.blitz = Math.max(0, l.blitz - dt * 0.9);
  });
}
function _n9fUpdate(dt) {
  if (!_n9f) return;
  dt = _bioFxDt(dt);
  const n = _n9f;
  n.t += dt; n.s += dt;
  if (n.phase === 'blatt') {
    if (n.s >= _N9F_BLATT) _n9fPhase('woche');
  } else if (n.phase === 'woche') {
    n.w = n.w0 + (n.w1 - n.w0) * _bioFxKlemme(n.s / _N9F_WOCHE);
    if (n.raffer) _n9fFeuern(n.raffer, n.s);
    if (n.s >= _N9F_WOCHE) { n.w = n.w1; _n9fPhase('luft'); }
  } else if (n.phase === 'luft') {
    if (n.s >= _N9F_LUFT) _n9fTestStart();
  } else if (n.phase === 'test') {
    const L = n.test;
    L.ts = n.s;
    _n9fFeuern(L, n.s);
    let g = 0;
    const tl = _n9fLandezeit();
    for (let k = 0; k < L.n; k++) {
      if (!L.faellt[k] || n.s < _n9fA(L, k) + L.F + tl) continue;
      g++;
      if (g > L.gelandet) {                             // gerade aufgekommen
        _bioFxWelle(n.fx.teile, _N9F_FANG[_n9fNach(k)] + (_n9fNach(k) === 'L' ? -19 : 19), _N9F_BODEN + 4, '#fcd34d', 16);
      }
    }
    if (g !== n.gefallen) { n.gefallen = g; n.zuck = 0.35; }
    L.gelandet = g;
    if (n.s >= _n9fEnde(L)) _n9fFertig();
  } else if (n.phase === 'fertig') {
    n.ruhe += dt;
    if (n.ruhe >= 2.8) { n.ruhe = 0; _n9fWelle(1); }
  }
  _n9fLinienUpdate(dt);
  _n9fPulsUpdate(dt);
  n.zuck = Math.max(0, n.zuck - dt);
  n.zGlanz = Math.max(0, n.zGlanz - dt * 0.8);
  _bioFxAlleUpdate(n.fx, dt);
  if (_n9fZeile() !== n.letzt) _n9fStatus();
}

// ── Zeichnen ─────────────────────────────────────────────────────────
function _n9fBall(ctx, x, y, k, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha == null ? 1 : alpha;
  ctx.fillStyle = _N9F_FARBE[k % 3]; ctx.strokeStyle = _N9F_RAND[k % 3]; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(x, y, _N9F_BR, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath(); ctx.arc(x - 2.2, y - 2.2, 1.8, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
function _n9fZimmer(ctx, H) {
  const wand = ctx.createLinearGradient(0, 0, 0, 232);
  wand.addColorStop(0, '#fbf4e6'); wand.addColorStop(1, '#f1e4cc');
  ctx.fillStyle = wand; ctx.fillRect(0, 0, 206, 232);
  ctx.fillStyle = '#d9bf93'; ctx.fillRect(0, 232, 206, H - 232);
  ctx.strokeStyle = 'rgba(120,85,40,0.22)'; ctx.lineWidth = 1;
  for (let x = 34; x < 206; x += 46) { ctx.beginPath(); ctx.moveTo(x, 233); ctx.lineTo(x - 7, H); ctx.stroke(); }
  ctx.strokeStyle = '#b8996a'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, 232); ctx.lineTo(206, 232); ctx.stroke();
}
// Lupenkeil: vom Kopf zum Gehirnkasten (zeigt: rechts ist ein Ausschnitt)
function _n9fLupeKeil(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(79,70,229,0.35)'; ctx.lineWidth = 1.3; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(115, 86); ctx.lineTo(210, 40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(115, 110); ctx.lineTo(210, 236); ctx.stroke();
  ctx.restore();
}
function _n9fLupeRing(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(79,70,229,0.55)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.arc(100, 98, 19, 0, 2 * Math.PI); ctx.stroke();
  ctx.restore();
}
function _n9fKalenderBlatt(ctx, woche, art, tage) {
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  ctx.fillRect(8, 51, 56, 49); ctx.strokeRect(8, 51, 56, 49);
  ctx.fillStyle = '#0f172a'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Woche ' + woche, 36, 66);
  for (let d = 0; d < 7; d++) {
    const x = 11 + d * 7.3, y = 72;
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 0.8; ctx.strokeRect(x, y, 6, 6);
    if (d < tage) {
      if (art === 'pause') { ctx.fillStyle = '#cbd5e1'; ctx.fillRect(x + 0.6, y + 0.6, 4.8, 4.8); }
      else { ctx.fillStyle = _N9F_FARBE[d % 3]; ctx.beginPath(); ctx.arc(x + 3, y + 3, 2.4, 0, 2 * Math.PI); ctx.fill(); }
    }
  }
  ctx.fillStyle = art === 'pause' ? '#475569' : art === 'ueben' ? '#a16207' : '#64748b';
  ctx.font = '700 10px sans-serif';
  ctx.fillText(_n9fArtWort(art), 36, 93);
}
function _n9fKalender(ctx) {
  const n = _n9f;
  ctx.save();
  // Nagel und Kopfleiste
  ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.arc(36, 36, 2, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = '#dc2626'; ctx.fillRect(8, 40, 56, 11);
  ctx.fillStyle = '#fee2e2';
  ctx.beginPath(); ctx.arc(24, 45.5, 2.2, 0, 2 * Math.PI); ctx.fill();
  ctx.beginPath(); ctx.arc(48, 45.5, 2.2, 0, 2 * Math.PI); ctx.fill();
  // Tage der laufenden Woche
  let tage = 7;
  if (n.art === 'start') tage = 0;
  else if (n.phase === 'blatt') tage = 0;
  else if (n.phase === 'woche') tage = Math.min(7, Math.floor(n.s / (_N9F_WOCHE / 7)) + 1);
  _n9fKalenderBlatt(ctx, n.woche, n.art, tage);
  // altes Blatt klappt nach oben weg
  if (n.phase === 'blatt') {
    const k = 1 - _bioFxEase.sanft(_bioFxKlemme(n.s / _N9F_BLATT));
    if (k > 0.02) {
      ctx.save();
      ctx.translate(0, 51); ctx.scale(1, k); ctx.translate(0, -51);
      _n9fKalenderBlatt(ctx, n.alteWoche, n.alteArt, n.alteArt === 'start' ? 0 : 7);
      ctx.restore();
    }
  }
  ctx.restore();
}
function _n9fKiste(ctx, alpha) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  [0, 1, 2].forEach(k => _n9fBall(ctx, 147 + k * 9, 211 - (k === 1 ? 3 : 0), k));
  ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.2;
  ctx.fillRect(138, 212, 36, 20); ctx.strokeRect(138, 212, 36, 20);
  ctx.strokeStyle = 'rgba(120,53,15,0.6)';
  ctx.beginPath(); ctx.moveTo(138, 222); ctx.lineTo(174, 222); ctx.stroke();
  ctx.restore();
}
function _n9fArm(ctx, sx, sy, hx, hy, aussen) {
  const ex = (sx + hx) / 2 + aussen * 9, ey = (sy + hy) / 2 + 5;
  ctx.strokeStyle = '#0f9d8a'; ctx.lineWidth = 8;                      // Ärmel
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + (ex - sx) * 0.45, sy + (ey - sy) * 0.45); ctx.stroke();
  ctx.strokeStyle = '#e0a877'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(sx + (ex - sx) * 0.4, sy + (ey - sy) * 0.4); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.fillStyle = '#e0a877'; ctx.beginPath(); ctx.arc(hx, hy, 3.6, 0, 2 * Math.PI); ctx.fill();
}
function _n9fDeniz(ctx, hl, hr) {
  const n = _n9f, atem = Math.sin(n.t * 1.7) * 0.7;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // Beine und Schuhe
  ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(94, 178); ctx.lineTo(91, 225); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(106, 178); ctx.lineTo(109, 225); ctx.stroke();
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.ellipse(90, 229, 7.5, 3.6, 0, 0, 2 * Math.PI); ctx.fill();
  ctx.beginPath(); ctx.ellipse(110, 229, 7.5, 3.6, 0, 0, 2 * Math.PI); ctx.fill();
  // Rumpf (T-Shirt)
  ctx.fillStyle = '#0f9d8a';
  _bioFxRundRect(ctx, 85, 118 + atem, 30, 64 - atem, 7); ctx.fill();
  // Hals und Kopf
  ctx.fillStyle = '#d99a6c'; ctx.fillRect(96, 107 + atem, 8, 13);
  ctx.fillStyle = '#e0a877'; ctx.strokeStyle = '#9a6a45'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(100, 98 + atem, 13, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2d1f14';
  ctx.beginPath(); ctx.arc(100, 96 + atem, 13.4, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(95.5, 100 + atem, 1.3, 0, 2 * Math.PI); ctx.fill();
  ctx.beginPath(); ctx.arc(104.5, 100 + atem, 1.3, 0, 2 * Math.PI); ctx.fill();
  // Arme
  _n9fArm(ctx, 88, 124 + atem, hl.x, hl.y, -1);
  _n9fArm(ctx, 112, 124 + atem, hr.x, hr.y, 1);
  ctx.restore();
}
// Deniz, seine Hände und alle Bälle (in der Hand, in der Luft, am Boden)
function _n9fSzene(ctx) {
  const n = _n9f;
  let L = null, s = 0, haende = 'halten', boden = null, bodenAlpha = 1;
  if (n.phase === 'test') { L = n.test; s = n.s; }
  else if (n.phase === 'fertig') { L = n.test; s = n.test ? Math.max(n.test.ts, _n9fEnde(n.test)) : 0; }
  else if (n.phase === 'woche' && n.raffer) { L = n.raffer; s = n.s; }
  else if (n.phase === 'woche' || (n.phase === 'blatt' && n.art === 'pause')) haende = 'unten';
  if (n.phase === 'blatt' && n.test) {                  // Bälle vom Boden einsammeln
    boden = n.test; bodenAlpha = 1 - _bioFxKlemme(n.s / (_N9F_BLATT * 0.9));
  }
  // Kiste in der Pause
  let kiste = 0;
  if (n.art === 'pause') {
    if (n.phase === 'blatt') kiste = _bioFxKlemme(n.s / _N9F_BLATT);
    else if (n.phase === 'woche') kiste = 1;
    else if (n.phase === 'luft') kiste = 1 - _bioFxKlemme(n.s / _N9F_LUFT);
  }
  _n9fKiste(ctx, kiste);
  let hl, hr;
  if (L) { hl = _n9fHandPos(L, s, 'L'); hr = _n9fHandPos(L, s, 'R'); }
  else if (haende === 'unten') { hl = { x: 82, y: 180 }; hr = { x: 118, y: 180 }; }
  else { hl = { x: _N9F_WURF.L, y: _N9F_HY }; hr = { x: _N9F_WURF.R, y: _N9F_HY }; }
  _n9fDeniz(ctx, hl, hr);
  if (boden) {
    for (const b of _n9fBaelle(boden, 99)) if (b.boden) _n9fBall(ctx, b.x, b.y, b.k, bodenAlpha);
  }
  if (L) {
    const inHand = { L: [], R: [] };
    for (const b of _n9fBaelle(L, s)) {
      if (b.hand) inHand[b.hand].push(b);
      else _n9fBall(ctx, b.x, b.y, b.k);
    }
    for (const h of ['L', 'R']) {
      const p = h === 'L' ? hl : hr, liste = inHand[h];
      liste.forEach((b, j) => _n9fBall(ctx, p.x + (liste.length > 1 ? (j - 0.5) * 9 : 0), p.y - 6, b.k));
    }
  } else if (haende === 'halten') {
    _n9fBall(ctx, hr.x - 4.5, hr.y - 6, 0); _n9fBall(ctx, hr.x + 4.5, hr.y - 6, 2);
    _n9fBall(ctx, hl.x, hl.y - 6, 1);
  }
  if (n.phase === 'woche') {
    ctx.fillStyle = 'rgba(15,23,42,0.65)'; ctx.font = '700 10px sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('▶▶ Zeitraffer', 6, 245);
  }
}
function _n9fZaehler(ctx) {
  const n = _n9f, laeuft = n.phase === 'test', fertig = n.phase === 'fertig';
  ctx.save();
  if (n.zGlanz > 0.02) {                                // ruhiges Leuchten nach dem Test
    ctx.save();
    ctx.globalAlpha = n.zGlanz;
    ctx.shadowColor = n.besser ? '#86efac' : '#fde68a'; ctx.shadowBlur = 14;
    ctx.strokeStyle = n.besser ? '#4ade80' : '#facc15'; ctx.lineWidth = 5;
    _bioFxRundRect(ctx, 6, 6, 194, 27, 8); ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = fertig ? '#ca8a04' : '#94a3b8'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, 6, 6, 194, 27, 8); ctx.fill(); ctx.stroke();
  const txt = laeuft || fertig ? 'heruntergefallen: ' + n.gefallen + ' von 10' : 'heruntergefallen: …';
  const k = 1 + 0.12 * Math.sin(Math.PI * _bioFxKlemme(n.zuck / 0.35));
  ctx.translate(103, 20); ctx.scale(k, k);
  ctx.fillStyle = laeuft || fertig ? '#0f172a' : '#94a3b8';
  ctx.font = '700 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(txt, 0, 1);
  ctx.restore();
}
function _n9fLinie(ctx, i, l) {
  const K = _N9F_KURVE[i], k = _N9F_LINIE[i];
  const h = Math.max(0, _n9f.w - k.tau);
  let breit = 2.2 + 1.45 * Math.min(h, 3), g = 1, alpha = 1, farbe = '#facc15';
  if (l.modus === 'wachsen') { g = _bioFxEase.raus(l.da); farbe = '#fef08a'; }
  else if (l.modus === 'welken') {
    alpha = l.da;
    const m = 1 - l.da, mix = (a, b) => Math.round(a + (b - a) * Math.min(1, m * 1.6));
    farbe = 'rgb(' + mix(250, 148) + ',' + mix(204, 163) + ',' + mix(21, 184) + ')';
  }
  const qx = K.ax + (K.cx - K.ax) * g, qy = K.ay + (K.cy - K.ay) * g, e = _n9fPunkt(i, g);
  const pfad = () => { ctx.beginPath(); ctx.moveTo(K.ax, K.ay); ctx.quadraticCurveTo(qx, qy, e.x, e.y); };
  ctx.save();
  ctx.lineCap = 'round';
  if (l.modus !== 'welken' && l.blitz > 0.02) {        // Schein nur beim Aufblitzen
    ctx.globalAlpha = 0.55 * l.blitz;
    ctx.strokeStyle = '#fde047'; ctx.lineWidth = breit + 5 + 6 * l.blitz;
    pfad(); ctx.stroke();
  }
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = farbe; ctx.lineWidth = breit;
  pfad(); ctx.stroke();
  ctx.restore();
  if (l.modus === 'da') _n9f.gezeichnet++;
}
function _n9fGehirn(ctx) {
  const n = _n9f;
  ctx.save();
  const bg = ctx.createLinearGradient(0, 6, 0, 244);
  bg.addColorStop(0, '#1e1b4b'); bg.addColorStop(1, '#0f172a');
  ctx.fillStyle = bg; _bioFxRundRect(ctx, 210, 6, 204, 238, 12); ctx.fill();
  // Nichts im Hintergrund, das wie eine blasse Linie aussehen könnte: Gezählt
  // wird nur, was gelb ist.
  n.gezeichnet = 0;
  _N9F_LINIE.forEach((k, i) => { if (n.linie[i].da > 0) _n9fLinie(ctx, i, n.linie[i]); });
  // Lichtpakete
  for (const p of n.puls) {
    const q = _n9fPunkt(p.i, p.rueck ? 1 - p.s : p.s);
    ctx.save();
    ctx.shadowColor = '#fde047'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath(); ctx.arc(q.x, q.y, 3.2, 0, 2 * Math.PI); ctx.fill();
    ctx.restore();
  }
  // Nervenzellen
  _N9F_ZELLE.forEach((z, j) => {
    const gl = n.glanz[j];
    if (gl > 0.02) {
      ctx.fillStyle = 'rgba(253,224,71,' + (0.32 * gl).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(z[0], z[1], _N9F_ZR + 7 * gl, 0, 2 * Math.PI); ctx.fill();
    }
    const zg = ctx.createRadialGradient(z[0] - 4, z[1] - 4, 2, z[0], z[1], _N9F_ZR);
    zg.addColorStop(0, '#c4b5fd'); zg.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = zg; ctx.strokeStyle = gl > 0.02 ? '#fde68a' : '#ede9fe'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(z[0], z[1], _N9F_ZR, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#5b21b6';
    ctx.beginPath(); ctx.arc(z[0] + 1.5, z[1] + 1.5, 5, 0, 2 * Math.PI); ctx.fill();
  });
  ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, 210, 6, 204, 238, 12); ctx.stroke();
  ctx.restore();
}
function _n9fDraw(ctx, cv) {
  if (!_n9f) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  _n9fZimmer(ctx, H);
  _n9fLupeKeil(ctx);
  _n9fKalender(ctx);
  _n9fSzene(ctx);
  _n9fLupeRing(ctx);
  _n9fZaehler(ctx);
  _n9fGehirn(ctx);
  _bioFxAlleDraw(ctx, _n9f.fx);
}
