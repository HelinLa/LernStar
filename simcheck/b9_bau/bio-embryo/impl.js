// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · DER WEG DES EMBRYOS IN DEN ERSTEN TAGEN   (Förderheft Bio 9 · bz2)
// Kennung bio-embryo, Präfix _n9m. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bz2.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 300, schematischer Schnitt, OHNE Körperumriss):
//   - links ein Eierstock (Oval mit Bläschen), darüber öffnet sich ein Trichter
//     mit fünf wehenden Fransen; daraus führt ein gebogener Gang (OHNE
//     Beschriftung) nach rechts oben in die Gebärmutter. Im Gang schlagen feine
//     Härchen in einer Welle (das Bild lebt auch im Stand).
//   - rechts die Gebärmutter als Birne im Schnitt: Muskelwand, weiche Wand
//     innen mit kleinen Adern, heller Hohlraum. Beschriftet sind NUR
//     „Eierstock“ und „Gebärmutter“.
//   - ein kleiner oranger Kreis mit Lupenring: der Embryo.
//   - unten links eine Lupe, die den Embryo groß zeigt; darunter der Zähler
//     „Zellen: …“. Gestrichelte Linie von der Lupe zum Embryo.
//   - unten rechts der Tagesstreifen 1 bis 7 und darüber „Tag 3“; darunter
//     eine Legende „Embryo“.
//
// BEDIENUNG (wörtlich):
//   Regler „Tag“: 1 · 3 · 5 · 7 (Start 1)   (_n9mTag(wert))
//   „neu“ (_n9mNeu → Tag 1, Spur gelöscht)
//
// ABLAUF: Die Zeit D läuft beim Umstellen weich vom alten zum neuen Tag
//   (vorwärts 1,5 s je Tag, also 3 s je Reglerschritt; rückwärts schneller).
//   Ort, Lupe, Zähler und Tagesstreifen hängen NUR an D:
//     Ort   D 1 → 10 % des Gangs (nahe dem Eierstock) · D 3 → 50 % (halber Weg)
//           D 4,6 → Eingang der Gebärmutter · D 5 → Mitte des Hohlraums (frei)
//           D 6,2 → berührt die rechte Wand · D 6,9 → halb in der Wand
//     Lupe  1 → 2 (D 1,25–1,75) · 2 → 4 (2,0–2,4) · 4 → 8 (2,55–2,95)
//           8 → 16 (3,15–3,55) · 16 → 32 (3,65–4,05) · 32 → hohles Bläschen
//           (4,15–4,8) · Bläschen wächst, die Hülle öffnet sich (5,2–6,0)
//           · von rechts schiebt sich die Wand heran (5,8–6,3) · das Bläschen
//           sinkt hinein (6,3–6,95)
//   Jede neue Zelle entsteht sichtbar aus einer alten: Sie startet genau auf
//   ihrer Mutterzelle (dieselbe Größe) und rückt dann an ihren Platz.
//
// WERTE (sim_plan.werte = lehrer.tabelle_erwartet, am Bild abzulesen):
//   Tag 1  Zähler „Zellen: 1“            Embryo im Gang nahe dem Eierstock
//   Tag 3  Zähler „Zellen: 8“            Embryo im Gang, etwa auf halbem Weg
//   Tag 5  Zähler „Zellen: etwa 100“     Embryo frei im Hohlraum der Gebärmutter;
//                                        Lupe: hohles Bläschen aus kleinen Zellen
//   Tag 7  Zähler „Zellen: mehr als 100“ Embryo halb in der Wand der Gebärmutter;
//                                        Lupe: Bläschen sinkt in die Wand
//   Unterwegs zählt der Zähler 2, 4, 16, 32 mit (Verdopplung sichtbar).
//
// STATUSZEILE (_n9m-status), nennt den Ort NIE mit Namen:
//   unterwegs  „Die Zeit läuft bis Tag 5.“ / „Die Zeit läuft zurück bis Tag 1.“
//   Tag 1, 3   „Der Embryo ist unterwegs.“
//   Tag 5      „Der Embryo schwimmt frei.“
//   Tag 7      „Der Embryo sitzt jetzt fest in der Wand.“   (wörtlich, Bauplan)
//
// AHA (_bioFx, ruhig, ohne Textstreifen, ohne Zufall): Eine violette Punktspur
//   bleibt hinter dem Embryo liegen, mit Tagesmarken 1, 3, 5, 7 an den
//   besuchten Orten. Erreicht der Embryo die Gebärmutter, läuft ein Licht die
//   ganze Spur vom Eierstock bis zum Eingang entlang, und am Eingang breitet
//   sich ein Lichtring aus – der Weg war lang, am Anfang war er NICHT in der
//   Gebärmutter. Am Tag 7 je ein Lichtring an der Wand und in der Lupe.
//   Jeder neue Zählerwert springt kurz an; am Ziel ein Rahmen um den Zähler.
//
// NICHT AM BILDSCHIRM: die Lückenwörter aus Merksatz und Aufgabe 2 und die
//   Fachwörter der Seite (siehe bz2.json, sim_plan.anzeigen, letzte Zeile).
//   Der Gang trägt keine Beschriftung. Keine Körper, keine Personen.
//   Kein clip(): Alles in der Lupe bleibt aus eigener Geometrie im Kreis
//   (der Nachzeichner leinwand_bild.js bildet clip nicht nach).
// ═══════════════════════════════════════════════════════════════════════
let _n9m = null;
const _N9M_STATUS = {
  1: 'Der Embryo ist unterwegs.',
  3: 'Der Embryo ist unterwegs.',
  5: 'Der Embryo schwimmt frei.',
  7: 'Der Embryo sitzt jetzt fest in der Wand.'
};
const _N9M_L = { x: 112, y: 218, r: 54 };        // Lupe
const _N9M_ZONA = 32;                             // Hülle um die ersten Zellen
const _N9M_EIER = { x: 56, y: 116, rx: 32, ry: 20 };
// Gang: zwei kubische Bögen vom Trichter bis in die Gebärmutter
const _N9M_GANG = [
  [[96, 92], [120, 58], [160, 24], [214, 28]],
  [[214, 28], [252, 31], [274, 42], [292, 54]]
];
const _N9M_MUND = [84, 106];                      // Öffnung des Trichters
const _N9M_EINGANG = [306, 60];                   // Ende des Gangs im Hohlraum
const _N9M_MITTE = [340, 84];                     // Tag 5: frei im Hohlraum
const _N9M_WAND = [365, 80];                      // berührt die Wand
const _N9M_TIEF = [373, 80];                      // halb in der Wand
// Zeitplan der Lupe: [von Lage, zu Lage, D-Anfang, D-Ende]
const _N9M_PLAN = [
  [0, 1, 1.25, 1.75], [1, 2, 2.0, 2.4], [2, 3, 2.55, 2.95],
  [3, 4, 3.15, 3.55], [4, 5, 3.65, 4.05], [5, 6, 4.15, 4.8], [6, 7, 5.2, 6.0]
];
const _N9M_FARBE = { zelle: '#fed7aa', rand: '#c2410c', kern: '#9a3412',
                     spur: '124,58,237', wand: '#f4b9b9', wandRand: '#c97a7a' };

// ── Geometrie ──────────────────────────────────────────
function _n9mBez(a, b, c, d, u) {
  const v = 1 - u;
  return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0],
          v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]];
}
// Weg des Embryos als Polygonzug mit Bogenlängen; Marken je Ort
function _n9mWeg() {
  const p = [];
  for (const b of _N9M_GANG) {
    for (let i = p.length ? 1 : 0; i <= 40; i++) p.push(_n9mBez(b[0], b[1], b[2], b[3], i / 40));
  }
  p.push(_N9M_EINGANG);
  const iGang = p.length - 1;
  // in den Hohlraum hinein, leicht gebogen
  const e = _N9M_EINGANG, m = _N9M_MITTE, k = [326, 60];
  for (let i = 1; i <= 12; i++) {
    const u = i / 12, v = 1 - u;
    p.push([v * v * e[0] + 2 * v * u * k[0] + u * u * m[0], v * v * e[1] + 2 * v * u * k[1] + u * u * m[1]]);
  }
  const iMitte = p.length - 1;
  for (let i = 1; i <= 8; i++) {
    const u = i / 8;
    p.push([m[0] + (_N9M_WAND[0] - m[0]) * u, m[1] + (_N9M_WAND[1] - m[1]) * u]);
  }
  const iWand = p.length - 1;
  for (let i = 1; i <= 4; i++) {
    const u = i / 4;
    p.push([_N9M_WAND[0] + (_N9M_TIEF[0] - _N9M_WAND[0]) * u, _N9M_WAND[1] + (_N9M_TIEF[1] - _N9M_WAND[1]) * u]);
  }
  const s = [0];
  for (let i = 1; i < p.length; i++) s.push(s[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  const lg = s[iGang];
  return { p, s, iGang, sGang: lg, sMitte: s[iMitte], sWand: s[iWand], sTief: s[p.length - 1],
           s1: 0.10 * lg, s3: 0.50 * lg };
}
// Bogenlänge auf dem Weg für die Zeit D (stückweise linear)
function _n9mS(D) {
  const W = _n9m.weg;
  const K = [[1, W.s1], [3, W.s3], [4.6, W.sGang], [5, W.sMitte], [6.2, W.sWand], [6.9, W.sTief], [7, W.sTief]];
  if (D <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) {
    if (D <= K[i][0]) {
      const u = (D - K[i - 1][0]) / (K[i][0] - K[i - 1][0]);
      return K[i - 1][1] + (K[i][1] - K[i - 1][1]) * u;
    }
  }
  return K[K.length - 1][1];
}
function _n9mPunkt(s) {
  const W = _n9m.weg;
  if (s <= 0) return { x: W.p[0][0], y: W.p[0][1], i: 0 };
  for (let i = 1; i < W.p.length; i++) {
    if (s <= W.s[i]) {
      const u = (s - W.s[i - 1]) / Math.max(1e-6, W.s[i] - W.s[i - 1]);
      return { x: W.p[i - 1][0] + (W.p[i][0] - W.p[i - 1][0]) * u,
               y: W.p[i - 1][1] + (W.p[i][1] - W.p[i - 1][1]) * u, i };
    }
  }
  const q = W.p[W.p.length - 1];
  return { x: q[0], y: q[1], i: W.p.length - 1 };
}
function _n9mOrt(D) { return _n9mPunkt(_n9mS(D)); }

// ── Lagen der Zellen in der Lupe (relativ zur Lupenmitte) ──
function _n9mZ(x, y, r, hinten) { return { x, y, rx: r, ry: r, rot: 0, hinten: !!hinten, ring: false }; }
function _n9mSonne(n, R) {
  const a = [];
  for (let i = 0; i < n; i++) {
    const rr = R * Math.sqrt((i + 0.5) / n), w = i * 2.399963;
    a.push([rr * Math.cos(w), rr * Math.sin(w)]);
  }
  return a;
}
// hohles Bläschen: Ring flacher Zellen und innen rechts ein Zellhaufen
function _n9mBlase(R, nRing, nInnen) {
  const a = [], halb = Math.PI * R / nRing * 1.1;
  for (let i = 0; i < nRing; i++) {
    const w = (i + 0.5) / nRing * 2 * Math.PI;
    a.push({ x: R * Math.cos(w), y: R * Math.sin(w), rx: halb, ry: 2.1, rot: w + Math.PI / 2, hinten: false, ring: true });
  }
  const hx = 6.2, hy = R * 0.46, cx = R - 2.1 - hx - 0.6;
  const rz = Math.sqrt(hx * hy / nInnen) * 1.12;
  for (const q of _n9mSonne(nInnen, 1)) a.push(_n9mZ(cx + q[0] * (hx - rz * 0.4), q[1] * (hy - rz * 0.4), rz));
  return a;
}
function _n9mLagen() {
  const Z = _n9mZ, L = [];
  L.push([Z(0, 0, 26)]);
  L.push([Z(-13.5, 0, 14), Z(13.5, 0, 14)]);
  L.push([Z(-11.5, -11.5, 11.5), Z(-11.5, 11.5, 11.5), Z(11.5, -11.5, 11.5), Z(11.5, 11.5, 11.5)]);
  L.push([Z(-9, -9, 9.5), Z(-16, 0, 9.5, true), Z(-9, 9, 9.5), Z(0, 16, 9.5, true),
          Z(9, -9, 9.5), Z(0, -16, 9.5, true), Z(9, 9, 9.5), Z(16, 0, 9.5, true)]);
  L.push(_n9mSonne(16, 20).map(q => Z(q[0], q[1], 6.4)));
  L.push(_n9mSonne(32, 21.5).map(q => Z(q[0], q[1], 4.9)));
  L.push(_n9mBlase(24, 32, 18));            // Tag 5
  L.push(_n9mBlase(28, 38, 24));            // Tag 7
  return L;
}
// Mutterzelle je Tochterzelle: erst bekommt jede alte Zelle ihre nächste neue
// (keine verschwindet), dann die übrigen neuen ihre nächste alte (höchstens zwei).
function _n9mEltern(A, B) {
  const paare = [];
  B.forEach((b, j) => A.forEach((a, i) => paare.push([(a.x - b.x) ** 2 + (a.y - b.y) ** 2, i, j])));
  paare.sort((p, q) => p[0] - q[0] || p[1] - q[1] || p[2] - q[2]);
  const n = A.map(() => 0), el = B.map(() => -1);
  for (const [, i, j] of paare) if (el[j] < 0 && n[i] === 0) { el[j] = i; n[i] = 1; }
  for (const [, i, j] of paare) if (el[j] < 0 && n[i] < 2) { el[j] = i; n[i]++; }
  return el;
}

function _n9mInit() {
  const lagen = _n9mLagen();
  const eltern = [null, [0, 0], [0, 0, 1, 1], [0, 0, 1, 1, 2, 2, 3, 3]];
  for (let k = 4; k < lagen.length; k++) eltern.push(_n9mEltern(lagen[k - 1], lagen[k]));
  _n9m = { t: 0, tag: 1, D: 1, von: 1, nach: 1, p: 1, dauer: 3, dmax: 1,
           besucht: { 1: true }, fx: { teile: [] }, zahl: '1', pop: 0, puls: [],
           spur: -1, lagen, eltern, weg: null };
  _n9m.weg = _n9mWeg();
}

// ── Bedienung ──────────────────────────────────────────
function _n9mTag(v) {
  if (!_n9m) return;
  let w = Math.round(Number(v));
  if (!isFinite(w)) w = 1;
  w = Math.max(1, Math.min(7, 1 + 2 * Math.round((w - 1) / 2)));
  _n9m.tag = w;
  const d = w - _n9m.D;
  if (Math.abs(d) < 1e-6) {
    _n9m.p = 1; _n9m.D = w; _n9m.von = w; _n9m.nach = w;
  } else {
    _n9m.von = _n9m.D; _n9m.nach = w; _n9m.p = 0;
    _n9m.dauer = d > 0 ? Math.min(6, 1.5 * d) : Math.max(0.8, 0.5 * -d);
  }
  _n9mStatus();
}
function _n9mNeu() {
  if (!_n9m) return;
  _n9m.tag = 1; _n9m.D = 1; _n9m.von = 1; _n9m.nach = 1; _n9m.p = 1; _n9m.dmax = 1;
  _n9m.besucht = { 1: true }; _n9m.fx = { teile: [] }; _n9m.puls = []; _n9m.spur = -1;
  _n9m.zahl = '1'; _n9m.pop = 0;
  _n9mStatus();
}

// ── Anzeige ────────────────────────────────────────────
function _n9mZeile() {
  if (_n9m.p < 1) {
    return _n9m.nach > _n9m.von ? 'Die Zeit läuft bis Tag ' + _n9m.nach + '.'
                                : 'Die Zeit läuft zurück bis Tag ' + _n9m.nach + '.';
  }
  return _N9M_STATUS[_n9m.tag];
}
function _n9mStatus() {
  if (!_n9m) return;
  const el = document.getElementById('_n9m-status');
  if (el) { el.textContent = _n9mZeile(); el.className = 'lmp-status on'; }
  const lb = document.getElementById('_n9m-tagLbl');
  if (lb) lb.textContent = String(_n9m.tag);
  const r = document.getElementById('_n9m-tag');
  if (r && String(r.value) !== String(_n9m.tag)) r.value = String(_n9m.tag);
}
function _n9mHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wo ist der Embryo in den ersten Tagen?</h3>
    <div class="fpm-note" style="margin-top:2px">Ein Schnitt, ganz einfach gezeichnet: links ein Eierstock, rechts die Gebärmutter. Der kleine Kreis ist der Embryo. Die Lupe unten zeigt ihn groß.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9m-cv" width="420" height="300" class="phys-anim-cv"></canvas>
        <div class="phys-ctrl" style="margin-top:8px">
          <label class="phys-ctrl-label" for="_n9m-tag">Tag: <b id="_n9m-tagLbl">1</b></label>
          <input type="range" id="_n9m-tag" min="1" max="7" step="2" value="1" oninput="_n9mTag(this.value)" style="width:100%;accent-color:#ea580c">
          <div style="display:flex;justify-content:space-between;font-size:.74rem;font-weight:700;color:#64748b"><span>1</span><span>3</span><span>5</span><span>7</span></div>
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_n9mNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Was passiert?</div>
        <div class="lmp-status on" id="_n9m-status" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">Stelle „Tag“ um. Die Zeit läuft dann bis zu diesem Tag. Lies erst danach ab.</div>
        <div class="fpm-note" style="margin-top:8px">Unter der Lupe steht, wie viele Zellen der Embryo hat.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Tag 1 &nbsp;|&nbsp; Alle Zahlen sind Modellwerte.</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9mZahl(D) {
  if (D >= 5.6) return 'mehr als 100';
  if (D >= 4.8) return 'etwa 100';
  if (D >= 4.05) return '32';
  if (D >= 3.55) return '16';
  if (D >= 2.95) return '8';
  if (D >= 2.4) return '4';
  if (D >= 1.75) return '2';
  return '1';
}
function _n9mUpdate(dt) {
  if (!_n9m) return;
  dt = _bioFxDt(dt);
  _n9m.t += dt;
  if (_n9m.p < 1) {
    const D0 = _n9m.D;
    _n9m.p = Math.min(1, _n9m.p + dt / _n9m.dauer);
    _n9m.D = _n9m.p >= 1 ? _n9m.nach
                         : _n9m.von + (_n9m.nach - _n9m.von) * _bioFxEase.sanft(_n9m.p);
    if (_n9m.D > _n9m.dmax) _n9m.dmax = _n9m.D;
    // vorwärts in die Gebärmutter: Licht läuft die Spur entlang, Ring am Eingang
    if (D0 < 4.6 && _n9m.D >= 4.6) {
      _bioFxWelle(_n9m.fx.teile, _N9M_EINGANG[0], _N9M_EINGANG[1], '#c4b5fd', 30);
      _n9m.spur = 0;
    }
    // vorwärts in die Wand: Ring an der Wand und in der Lupe
    if (D0 < 6.9 && _n9m.D >= 6.9) {
      _bioFxWelle(_n9m.fx.teile, _N9M_TIEF[0], _N9M_TIEF[1], '#fde047', 26);
      _bioFxWelle(_n9m.fx.teile, _N9M_L.x + 32, _N9M_L.y, '#fde047', 30);
    }
    if (_n9m.p >= 1) {
      _n9m.besucht[_n9m.nach] = true;
      _n9m.puls.push({ t0: _n9m.t });
      _n9mStatus();
    }
  }
  const z = _n9mZahl(_n9m.D);
  if (z !== _n9m.zahl) { _n9m.zahl = z; _n9m.pop = 0.35; }
  if (_n9m.pop > 0) _n9m.pop = Math.max(0, _n9m.pop - dt);
  if (_n9m.spur >= 0) { _n9m.spur += dt; if (_n9m.spur > 1.8) _n9m.spur = -1; }
  _bioFxAlleUpdate(_n9m.fx, dt);
}

// ── Zeichnen: Hilfen ───────────────────────────────────
function _n9mK(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
function _n9mMisch(a, b, u) { return a + (b - a) * u; }
function _n9mFarbe(a, b, u) {
  const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return 'rgb(' + x.map((v, i) => Math.round(v + (y[i] - v) * u)).join(',') + ')';
}
function _n9mRund(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Zeichnen ───────────────────────────────────────────
function _n9mDraw(ctx, cv) {
  if (!_n9m) return;
  const W = cv.width, H = cv.height, t = _n9m.t, D = _n9m.D;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fbf8f3'; ctx.fillRect(0, 0, W, H);
  _n9mEierstock(ctx);
  _n9mTrichter(ctx, t);
  _n9mGangBild(ctx, t);
  _n9mGebaermutter(ctx);
  _n9mSpur(ctx);
  const P = _n9mOrt(D);
  const fest = D >= 6.2;
  const E = { x: P.x, y: P.y + (fest ? 0 : 0.7 * Math.sin(t * 1.3)) };
  _n9mVerbindung(ctx, E);
  _n9mEmbryoKlein(ctx, E, D, t);
  _n9mSchilder(ctx);
  _n9mLupe(ctx, D, t);
  _n9mZaehler(ctx);
  _n9mTage(ctx, D);
  _n9mLegende(ctx);
  _bioFxAlleDraw(ctx, _n9m.fx);
}
function _n9mEierstock(ctx) {
  const O = _N9M_EIER;
  ctx.save();
  ctx.fillStyle = '#f8dcc0'; ctx.strokeStyle = '#c0835a'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.ellipse(O.x, O.y, O.rx, O.ry, -0.12, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff4e4'; ctx.strokeStyle = '#d9a679'; ctx.lineWidth = 1;
  for (const [dx, dy, r] of [[-15, -4, 5], [-2, 7, 6.5], [12, -6, 4.5], [-18, 9, 3.5], [16, 8, 3.5], [3, -10, 3]]) {
    ctx.beginPath(); ctx.arc(O.x + dx, O.y + dy, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
// Trichter am Anfang des Gangs mit fünf wehenden Fransen
function _n9mTrichter(ctx, t) {
  const a = _N9M_GANG[0][0], m = _N9M_MUND;
  const ax = m[0] - a[0], ay = m[1] - a[1], L = Math.hypot(ax, ay);
  const ux = ax / L, uy = ay / L, nx = -uy, ny = ux;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // Fransen: viele dünne, leicht gebogene Fäden am Rand, die langsam wehen
  for (let i = 0; i < 9; i++) {
    const q = (i - 4) / 4;                                   // -1 … 1
    const bx = m[0] + nx * q * 13 - ux * 1.5, by = m[1] + ny * q * 13 - uy * 1.5;
    const w = q * 0.95 + 0.2 * Math.sin(t * 1.3 + i * 0.9);
    const dx = ux * Math.cos(w) - uy * Math.sin(w), dy = ux * Math.sin(w) + uy * Math.cos(w);
    const len = 7 + 2.5 * Math.cos(i * 2.3) ** 2;
    const kx = bx + dx * len * 0.55 + nx * 1.8 * Math.sin(t * 1.1 + i), ky = by + dy * len * 0.55 + ny * 1.8 * Math.sin(t * 1.1 + i);
    for (const [farbe, br] of [['#c98a82', 3.6], ['#f4c4bc', 2]]) {
      ctx.strokeStyle = farbe; ctx.lineWidth = br;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(kx, ky, bx + dx * len, by + dy * len); ctx.stroke();
    }
  }
  // Trichter
  ctx.fillStyle = '#f4c4bc'; ctx.strokeStyle = '#c98a82'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(a[0] + nx * 8.5, a[1] + ny * 8.5);
  ctx.quadraticCurveTo(a[0] + ux * 6 + nx * 10, a[1] + uy * 6 + ny * 10, m[0] + nx * 15, m[1] + ny * 15);
  ctx.quadraticCurveTo(m[0] + ux * 4, m[1] + uy * 4, m[0] - nx * 15, m[1] - ny * 15);
  ctx.quadraticCurveTo(a[0] + ux * 6 - nx * 10, a[1] + uy * 6 - ny * 10, a[0] - nx * 8.5, a[1] - ny * 8.5);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff8f5';
  ctx.beginPath();
  ctx.moveTo(a[0] + nx * 3.6, a[1] + ny * 3.6);
  ctx.quadraticCurveTo(a[0] + ux * 6 + nx * 5, a[1] + uy * 6 + ny * 5, m[0] + nx * 10, m[1] + ny * 10);
  ctx.quadraticCurveTo(m[0] + ux * 1, m[1] + uy * 1, m[0] - nx * 10, m[1] - ny * 10);
  ctx.quadraticCurveTo(a[0] + ux * 6 - nx * 5, a[1] + uy * 6 - ny * 5, a[0] - nx * 3.6, a[1] - ny * 3.6);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
function _n9mGangPfad(ctx, bis) {
  const p = _n9m.weg.p;
  ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i <= bis; i++) ctx.lineTo(p[i][0], p[i][1]);
}
function _n9mGangBild(ctx, t) {
  const W = _n9m.weg, p = W.p;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  _n9mGangPfad(ctx, W.iGang);
  ctx.strokeStyle = '#c98a82'; ctx.lineWidth = 19; ctx.stroke();
  ctx.strokeStyle = '#f4c4bc'; ctx.lineWidth = 16; ctx.stroke();
  ctx.strokeStyle = '#fff8f5'; ctx.lineWidth = 8; ctx.stroke();
  // feine Härchen an beiden Innenrändern, sie schlagen in einer Welle
  ctx.strokeStyle = '#e2a097'; ctx.lineWidth = 0.9;
  for (let i = 1; i < W.iGang - 1; i++) {
    const tx = p[i + 1][0] - p[i - 1][0], ty = p[i + 1][1] - p[i - 1][1], tl = Math.hypot(tx, ty) || 1;
    const ux = tx / tl, uy = ty / tl, nx = -uy, ny = ux;
    const sw = 0.75 * Math.sin(t * 2 * Math.PI * 0.9 - W.s[i] * 0.22);
    for (const sg of [1, -1]) {
      const bx = p[i][0] + nx * 4 * sg, by = p[i][1] + ny * 4 * sg;
      const ix = -nx * sg, iy = -ny * sg;             // nach innen
      const kx = ix * Math.cos(sw) + ux * Math.sin(sw), ky = iy * Math.cos(sw) + uy * Math.sin(sw);
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + kx * 2.6, by + ky * 2.6); ctx.stroke();
    }
  }
  ctx.restore();
}
function _n9mGebaermutter(ctx) {
  ctx.save();
  // Muskelwand
  ctx.fillStyle = '#e9a3a3'; ctx.strokeStyle = '#b45f5f'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(282, 52);
  ctx.bezierCurveTo(286, 14, 398, 14, 402, 52);
  ctx.bezierCurveTo(404, 92, 376, 122, 360, 140);
  ctx.lineTo(358, 162);
  ctx.quadraticCurveTo(342, 169, 326, 162);
  ctx.lineTo(324, 140);
  ctx.bezierCurveTo(308, 122, 280, 92, 282, 52);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // weiche Wand innen
  ctx.fillStyle = _N9M_FARBE.wand;
  ctx.beginPath();
  ctx.moveTo(293, 55);
  ctx.bezierCurveTo(297, 27, 387, 27, 391, 55);
  ctx.bezierCurveTo(392, 88, 368, 114, 352, 131);
  ctx.lineTo(351, 157);
  ctx.quadraticCurveTo(342, 161, 333, 157);
  ctx.lineTo(332, 131);
  ctx.bezierCurveTo(316, 114, 292, 88, 293, 55);
  ctx.closePath(); ctx.fill();
  // kleine Adern in der Wand
  ctx.strokeStyle = '#e08c8c'; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
  for (const [x, y, w] of [[300, 82, 1.2], [318, 112, 0.9], [384, 70, 1.9], [367, 112, 2.3], [330, 38, 0.1], [356, 37, 0.2]]) {
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let i = 1; i <= 4; i++) ctx.lineTo(x + Math.cos(w) * i * 3 + Math.sin(i * 2.1) * 1.4, y + Math.sin(w) * i * 3 + Math.cos(i * 2.1) * 1.4);
    ctx.stroke();
  }
  // der Gang führt durch die Wand
  ctx.lineCap = 'butt';
  ctx.strokeStyle = '#d99a92'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(289, 53.6); ctx.lineTo(_N9M_EINGANG[0], _N9M_EINGANG[1]); ctx.stroke();
  ctx.strokeStyle = '#fff3f0'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(287, 52.9); ctx.lineTo(_N9M_EINGANG[0], _N9M_EINGANG[1]); ctx.stroke();
  // Hohlraum
  ctx.fillStyle = '#fff4f3'; ctx.strokeStyle = '#e7a9a9'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(304, 57);
  ctx.bezierCurveTo(320, 47, 364, 47, 380, 57);
  ctx.bezierCurveTo(378, 82, 356, 106, 346, 124);
  ctx.lineTo(345, 151);
  ctx.lineTo(339, 151);
  ctx.lineTo(338, 124);
  ctx.bezierCurveTo(328, 106, 306, 82, 304, 57);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// violette Punktspur bis zum weitesten erreichten Ort, Tagesmarken an den Orten
function _n9mSpur(ctx) {
  const W = _n9m.weg, smax = _n9mS(_n9m.dmax), s0 = W.s1;
  if (smax > s0 + 2) {
    ctx.save();
    ctx.fillStyle = 'rgba(' + _N9M_FARBE.spur + ',0.55)';
    for (let s = s0; s <= smax; s += 6) {
      const q = _n9mPunkt(s);
      ctx.beginPath(); ctx.arc(q.x, q.y, 1.4, 0, 2 * Math.PI); ctx.fill();
    }
    // Licht läuft die Spur entlang (beim Ankommen in der Gebärmutter)
    if (_n9m.spur >= 0) {
      const u = _bioFxEase.sanft(_n9mK(_n9m.spur / 1.3));
      const a = 1 - _n9mK((_n9m.spur - 1.3) / 0.5);
      const sk = s0 + (W.sGang - s0) * u;
      for (let s = s0; s <= sk; s += 6) {
        const q = _n9mPunkt(s), nah = _n9mK(1 - (sk - s) / 60);
        ctx.fillStyle = 'rgba(' + _N9M_FARBE.spur + ',' + (a * (0.35 + 0.6 * nah)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(q.x, q.y, 1.8 + 1.4 * nah, 0, 2 * Math.PI); ctx.fill();
      }
      const q = _n9mPunkt(sk);
      const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 11);
      g.addColorStop(0, 'rgba(237,233,254,' + (0.95 * a).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(196,181,253,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x, q.y, 11, 0, 2 * Math.PI); ctx.fill();
    }
    ctx.restore();
  }
  // Tagesmarken (nur besuchte Tage)
  // Marke 1 lag bei (104, 58) und berührte am Tag 1 den Lupenring des Embryos
  // (Abstand 16,6 bei 7 + 9,5); jetzt bleiben rund 5 px Luft, auch zum Gang.
  const M = { 1: [98, 54], 3: [200, 50], 5: [354, 62], 7: [378, 104] };
  const A = { 1: _n9mOrt(1), 3: _n9mOrt(3), 5: _n9mOrt(5), 7: _n9mOrt(7) };
  ctx.save();
  for (const d of [1, 3, 5, 7]) {
    if (!_n9m.besucht[d]) continue;
    const m = M[d], a = A[d];
    ctx.strokeStyle = 'rgba(' + _N9M_FARBE.spur + ',0.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(m[0], m[1]); ctx.lineTo(a.x, a.y); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(m[0], m[1], 7, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#5b21b6'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(String(d), m[0], m[1] + 3.2);
  }
  ctx.restore();
}
function _n9mVerbindung(ctx, E) {
  const L = _N9M_L, dx = E.x - L.x, dy = E.y - L.y, d = Math.hypot(dx, dy) || 1;
  ctx.save();
  ctx.strokeStyle = 'rgba(51,65,85,0.45)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(L.x + dx / d * (L.r + 3), L.y + dy / d * (L.r + 3));
  ctx.lineTo(E.x - dx / d * 11, E.y - dy / d * 11);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
// der kleine Kreis im Schnitt: erst voll, ab dem Bläschen hohl
function _n9mEmbryoKlein(ctx, E, D, t) {
  const r = 5 + 0.8 * _n9mK((D - 5.2) / 0.8);
  const hohl = _n9mK((D - 4.15) / 0.65);
  ctx.save();
  const g = ctx.createRadialGradient(E.x, E.y, r * 0.5, E.x, E.y, r * 2.4);
  g.addColorStop(0, 'rgba(251,146,60,0.30)'); g.addColorStop(1, 'rgba(251,146,60,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(E.x, E.y, r * 2.4, 0, 2 * Math.PI); ctx.fill();
  if (hohl < 1) {
    ctx.globalAlpha = 1 - hohl;
    ctx.fillStyle = '#fb923c'; ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.arc(E.x, E.y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  }
  if (hohl > 0) {
    ctx.globalAlpha = hohl;
    ctx.fillStyle = '#fff7ed'; ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(E.x, E.y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ea580c';
    ctx.beginPath(); ctx.arc(E.x + r * 0.45, E.y, r * 0.38, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // halb in der Wand: die Wand legt sich über die rechte Hälfte
  const tief = _n9mK((D - 6.2) / 0.7);
  if (tief > 0) {
    ctx.fillStyle = 'rgba(244,185,185,' + (0.8 * tief).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(E.x, E.y, r + 1.2, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(217,140,140,' + (0.9 * tief).toFixed(3) + ')'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(E.x + 0.5, E.y, r + 1.2, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  }
  // Lupenring
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(E.x, E.y, r + 4.5, 0, 2 * Math.PI); ctx.stroke();
  ctx.restore();
}
function _n9mSchilder(ctx) {
  ctx.save();
  ctx.fillStyle = '#334155'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Eierstock', _N9M_EIER.x, _N9M_EIER.y + _N9M_EIER.ry + 17);
  ctx.fillText('Gebärmutter', 342, 186);
  ctx.restore();
}
// Zellen in der Lupe für die Zeit D (Teilung: Tochter startet auf der Mutter)
function _n9mZellen(D) {
  let tr = null;
  for (const s of _N9M_PLAN) if (D >= s[2]) tr = s;
  const lg = _n9m.lagen;
  if (!tr) return { z: lg[0], hohl: 0 };
  const e0 = _n9mK((D - tr[2]) / (tr[3] - tr[2]));
  const hohl = tr[1] >= 6 ? (tr[1] === 6 ? e0 : 1) : 0;
  if (e0 >= 1) return { z: lg[tr[1]], hohl };
  const e = _bioFxEase.sanft(e0), A = lg[tr[0]], B = lg[tr[1]], el = _n9m.eltern[tr[1]];
  const z = B.map((b, j) => {
    const a = A[el[j]];
    let dr = (b.rot - a.rot) % Math.PI;
    if (dr > Math.PI / 2) dr -= Math.PI; else if (dr < -Math.PI / 2) dr += Math.PI;
    return { x: _n9mMisch(a.x, b.x, e), y: _n9mMisch(a.y, b.y, e), rx: _n9mMisch(a.rx, b.rx, e),
             ry: _n9mMisch(a.ry, b.ry, e), rot: a.rot + dr * e, hinten: b.hinten, ring: b.ring };
  });
  return { z, hohl };
}
// Kreisabschnitt der Lupe rechts von xb (wellig: Rand der Wand bewegt sich leicht)
function _n9mAbschnitt(ctx, xb, t, wellig) {
  const L = _N9M_L, r = L.r - 2, h = xb - L.x;
  if (h >= r - 0.5) return false;
  const yy = Math.sqrt(r * r - h * h), a0 = Math.atan2(-yy, h), a1 = Math.atan2(yy, h);
  ctx.beginPath();
  ctx.moveTo(xb, L.y - yy);
  for (let i = 1; i <= 18; i++) {
    const y = L.y - yy + 2 * yy * i / 18;
    const rand = wellig && i < 18 ? 1.6 * Math.sin(y * 0.3 + t * 0.7) : 0;
    ctx.lineTo(xb + rand, y);
  }
  ctx.arc(L.x, L.y, r, a1, a0, true);
  ctx.closePath();
  return true;
}
// Wand in der Lupe: weiche Wand mit Adern, ganz außen die Muskelwand
function _n9mLupeWand(ctx, xb, t, deck) {
  const L = _N9M_L, r = L.r - 2;
  if (!_n9mAbschnitt(ctx, xb, t, true)) return;
  if (deck > 0) {
    ctx.fillStyle = 'rgba(244,185,185,' + deck.toFixed(3) + ')'; ctx.fill();
    return;
  }
  ctx.fillStyle = _N9M_FARBE.wand; ctx.fill();
  ctx.strokeStyle = _N9M_FARBE.wandRand; ctx.lineWidth = 1.5; ctx.stroke();
  if (_n9mAbschnitt(ctx, Math.max(xb + 8, L.x + r - 9), t, false)) {
    ctx.fillStyle = '#e9a3a3'; ctx.fill();
  }
  // Adern
  ctx.strokeStyle = '#d97777'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
  const mx = xb + 6;
  for (const [y0, w] of [[-26, 0.6], [-4, -0.4], [18, 0.5]]) {
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
      const x = mx + i * 2.2, y = L.y + y0 + i * 2.6 * w + Math.sin(i * 1.9) * 1.6;
      if (Math.hypot(x - L.x, y - L.y) > r - 10) break;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
function _n9mLupe(ctx, D, t) {
  const L = _N9M_L;
  ctx.save();
  // Hintergrund: Flüssigkeit im Gang, dann im Hohlraum
  ctx.fillStyle = _n9mFarbe('#e8f3fa', '#fff5f4', _n9mK((D - 4.4) / 0.5));
  ctx.beginPath(); ctx.arc(L.x, L.y, L.r, 0, 2 * Math.PI); ctx.fill();
  // Wand schiebt sich heran (Tag 6 bis 7)
  const wE = _bioFxEase.sanft(_n9mK((D - 5.8) / 0.5));
  const xb = L.x + L.r - (L.r - 30.5) * wE;
  if (wE > 0) _n9mLupeWand(ctx, xb, t, 0);
  // Zellen
  const sink = _bioFxEase.sanft(_n9mK((D - 6.3) / 0.65));
  const ox = L.x + 11 * sink, oy = L.y;
  const atem = 1 + 0.012 * Math.sin(t * 1.1);
  const Z = _n9mZellen(D);
  // Hohlraum des Bläschens
  if (Z.hohl > 0) {
    const R = _n9mMisch(24, 28, _n9mK((D - 5.2) / 0.8)) * atem - 1.5;
    ctx.globalAlpha = Z.hohl;
    ctx.fillStyle = '#fffaf2';
    ctx.beginPath(); ctx.arc(ox, oy, R, 0, 2 * Math.PI); ctx.fill();
    ctx.globalAlpha = 1;
  }
  const zeichne = (c, j) => {
    const x = ox + c.x * atem + 0.35 * Math.sin(t * 1.7 + j * 0.9);
    const y = oy + c.y * atem + 0.35 * Math.cos(t * 1.5 + j * 1.3);
    ctx.fillStyle = c.hinten ? '#fbc595' : _N9M_FARBE.zelle;
    ctx.strokeStyle = _N9M_FARBE.rand;
    ctx.lineWidth = Math.min(c.rx, c.ry) > 4 ? 1.1 : 0.7;
    ctx.beginPath(); ctx.ellipse(x, y, c.rx, c.ry, c.rot, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = _N9M_FARBE.kern;
    ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, Math.min(c.rx, c.ry) * 0.3), 0, 2 * Math.PI); ctx.fill();
  };
  Z.z.forEach((c, j) => { if (c.hinten) zeichne(c, j); });
  Z.z.forEach((c, j) => { if (!c.hinten) zeichne(c, j); });
  // Hülle: bleibt bis Tag 5, öffnet sich dann rechts und verschwindet
  const auf = _n9mK((D - 5.3) / 0.6);
  if (auf < 1) {
    const g = auf * 1.7 * Math.PI;
    ctx.globalAlpha = 1 - auf * 0.7;
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(ox, oy, _N9M_ZONA, g / 2, 2 * Math.PI - g / 2); ctx.stroke();
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 3.6;
    ctx.beginPath(); ctx.arc(ox, oy, _N9M_ZONA, g / 2, 2 * Math.PI - g / 2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // die Wand legt sich halb über das Bläschen
  if (sink > 0) _n9mLupeWand(ctx, xb, t, 0.5 * sink);
  // Rahmen und Griff
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(L.x, L.y, L.r, 0, 2 * Math.PI); ctx.stroke();
  ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(L.x + L.r * 0.74, L.y + L.r * 0.74);
  ctx.lineTo(L.x + L.r * 0.98, L.y + L.r * 0.98);
  ctx.stroke();
  ctx.restore();
}
// Zähler unter der Lupe
function _n9mZaehler(ctx) {
  const L = _N9M_L, txt = 'Zellen: ' + _n9m.zahl;
  ctx.save();
  ctx.font = '700 13px sans-serif';
  const w = ctx.measureText(txt).width + 22, h = 21, x = L.x - w / 2, y = 277;
  const k = _n9m.pop > 0 ? 1 + 0.12 * Math.sin(Math.PI * (0.35 - _n9m.pop) / 0.35) : 1;
  ctx.translate(L.x, y + h / 2); ctx.scale(k, k); ctx.translate(-L.x, -(y + h / 2));
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = _N9M_FARBE.rand; ctx.lineWidth = 2;
  _n9mRund(ctx, x, y, w, h, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0f172a'; ctx.textAlign = 'center';
  ctx.fillText(txt, L.x, y + 15);
  ctx.restore();
  // Rahmen, der sich beim Ankommen einmal ausbreitet
  _n9m.puls = _n9m.puls.filter(p => _n9m.t - p.t0 < 1.2);
  for (const p of _n9m.puls) {
    const e = _bioFxEase.raus(_n9mK((_n9m.t - p.t0) / 1.2)), d = 2 + 8 * e;
    ctx.save();
    ctx.strokeStyle = 'rgba(234,88,12,' + (0.8 * (1 - e)).toFixed(3) + ')'; ctx.lineWidth = 2.5;
    _n9mRund(ctx, x - d, y - d, w + 2 * d, h + 2 * d, 7 + d); ctx.stroke();
    ctx.restore();
  }
}
// Tagesstreifen 1 bis 7
function _n9mTage(ctx, D) {
  const x0 = 236, y0 = 226, b = 22, g = 3;
  ctx.save();
  ctx.fillStyle = '#0f172a'; ctx.font = '700 17px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Tag ' + Math.floor(D + 1e-6), x0, y0 - 9);
  for (let d = 1; d <= 7; d++) {
    const x = x0 + (d - 1) * (b + g);
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
    _n9mRund(ctx, x, y0, b, b, 4); ctx.fill(); ctx.stroke();
    const f = _n9mK(D - (d - 1));
    if (f > 0) {
      ctx.fillStyle = '#fed7aa';
      _n9mRund(ctx, x + 1, y0 + 1, (b - 2) * f, b - 2, 3); ctx.fill();
    }
    const jetzt = d === Math.floor(D + 1e-6);
    if (jetzt) { ctx.strokeStyle = _N9M_FARBE.rand; ctx.lineWidth = 2.2; _n9mRund(ctx, x, y0, b, b, 4); ctx.stroke(); }
    ctx.fillStyle = jetzt ? '#9a3412' : '#475569'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(String(d), x + b / 2, y0 + 15);
  }
  ctx.restore();
}
function _n9mLegende(ctx) {
  ctx.save();
  const x = 244, y = 280;
  ctx.fillStyle = '#fb923c'; ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#334155';
  ctx.beginPath(); ctx.arc(x, y, 9.5, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#334155'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('= Embryo', x + 15, y + 4);
  ctx.restore();
}
