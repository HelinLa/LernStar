
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mz2 „Welchen Wert hat die 4?“
// (Kennung m5-stellenwert, Praefix _m5b, Bauplan KAPITEL1_PROFIL.md)
//
// Was man sieht: Oben eine Tafel mit sechs Spalten HT | ZT | T | H | Z | E
// (Kopfzeile grau), darunter die Ziffernkarten der Zahl, rechtsbuendig.
// Eine Karte ist orange markiert (Start: die 4 in 34). Unter der Tafel
// liegt der Wert der markierten Ziffer als Material, im Schraegbild und in
// Zehner-/Fuenferstruktur (Gitterlinien, jede fuenfte kraeftiger):
//   Einer = Wuerfelchen · Zehner = Stange aus 10 Wuerfelchen ·
//   Hunderter = Platte 10 × 10 · Tausender = Wuerfel 10 × 10 × 10 ·
//   Zehntausender = Riegel aus 10 Tausenderwuerfeln (schematisch) ·
//   Hunderttausender = Feld aus 10 Riegeln (schematisch).
// Eine orange Linie fuehrt von der markierten Karte zu einer Klammer ueber
// dem Material; darunter die Bildunterschrift „4 Hunderter = 400“ (Zahl in
// Orange) – Bild und Zeichen sind so sichtbar verbunden.
//
// Bewegung (0,8 s, weich): Beim Wechsel 34 → 340 rueckt jede Karte eine
// Spalte nach links, in der E-Spalte faellt eine 0 herein, und jedes Stueck
// Material zieht sich zur naechsten Form auseinander (Wuerfelchen → Stange
// → Platte → Wuerfel → Riegel), waehrend das Bild herauszoomt. Rueckwaerts
// laeuft dieselbe Bewegung umgekehrt. Sprung ueber mehrere Spalten und
// „andere Ziffer markieren“: altes Material blendet aus, neues ein; die
// Markierung wechselt die Karte weich. Beim Oeffnen fallen die Karten herein
// und das Material erscheint.
//
// Knoepfe (Bauplan, woertlich): „34“ · „340“ · „3 400“ · „34 000“ (Wahl-
// gruppe _m5bZahl('…'); die markierte Ziffer wandert mit) · „andere Ziffer
// markieren“ (zur naechsten von 0 verschiedenen Ziffer nach links, im Kreis)
// · „neu“ (34, die 4 markiert). Tausendertrenner als geschuetztes
// Leerzeichen (U+00A0).
//
// Statuszeilen (woertlich):
//   _m5b-zahl  „Zahl: 3 400“
//   _m5b-ort   „Die 4 steht bei den Hundertern.“ (Einern · Zehnern ·
//              Hundertern · Tausendern · Zehntausendern · Hunderttausendern)
//   _m5b-wert  „Wert der 4: 400“
// Sie stehen sofort nach dem Knopfdruck (im selben Augenblick, in dem die
// Bewegung beginnt); im Bild erscheint die Unterschrift mit dem Material.
//
// Werte (Bauplan, nachgerechnet mit simcheck/werte.js):
//   die 4: 34 → Einern, 4 · 340 → Zehnern, 40 · 3 400 → Hundertern, 400 ·
//          34 000 → Tausendern, 4 000
//   die 3: 34 → Zehnern, 30 · 340 → Hundertern, 300 · 3 400 → Tausendern,
//          3 000 · 34 000 → Zehntausendern, 30 000
//
// Aha (_bioFx, ruhig, OHNE Textstreifen): Jeder Schritt in Folge auf dem
// Weg 34 → 340 → 3 400 → 34 000, bei dem die markierte Ziffer mitwandert,
// endet mit einem Lichtring an der markierten Karte; ihr Rand glueht kurz nach.
// Ist der ganze Weg Schritt fuer Schritt gegangen, laeuft zum Schluss ein
// zweiter, groesserer Ring um die Bildunterschrift.
//
// NICHT am Bildschirm (sim_plan.nicht_am_bildschirm, Merksatz mz2):
// „Stelle“ (auch nicht als Wortteil, also kein „Stellenwert“ und keine
// „Stellenwerttafel“) und „zehnmal“ – kein „mal 10“, kein Faktor an den
// Pfeilen. Die Regel muss das Kind aus seiner Tabelle selbst finden.
// Deterministisch, ohne Zufall. Kein Urteil, keine Punkte, keine Zeit.
// ════════════════════════════════════════════════════════════════════════
let _m5b = null;
const _m5bREIHE = [34, 340, 3400, 34000];
const _m5bKURZ = ['E', 'Z', 'H', 'T', 'ZT', 'HT'];
const _m5bNAME = ['Einer', 'Zehner', 'Hunderter', 'Tausender', 'Zehntausender', 'Hunderttausender'];
const _m5bDATIV = ['Einern', 'Zehnern', 'Hundertern', 'Tausendern', 'Zehntausendern', 'Hunderttausendern'];
const _m5bK = {
  X0: 18, X1: 402,                 // Tafel links / rechts (6 Spalten zu 64 px)
  KY: 8, KH: 24, ZH: 52,           // Oberkante, Hoehe Kopfzeile, Hoehe Kartenzeile
  KW: 46, KHK: 40,                 // Karte: Breite, Hoehe
  AX0: 20, AX1: 400,               // Materialfeld links / rechts
  AY1: 212, AH: 110,               // Unterkante und Hoehe des Materialfelds
  BY: 96,                          // hoechste Lage der Klammer
  CY: 239,                         // Grundlinie der Bildunterschrift
  Q: 0.35,                         // Tiefe im Schraegbild
  GAP: 10,                         // Luft zwischen zwei Stuecken (px)
  DAUER: 0.8                       // s je Bewegung
};
// Formen in Wuerfelchen (Breite w, Hoehe h, Tiefe d). achse = Richtung, in
// die das Stueck der vorigen Form sich auseinanderzieht. uMax = groesster
// Massstab (px je Wuerfelchen), damit kleine Stuecke nicht riesig werden.
const _m5bFORM = [
  { w: 1,   h: 1,   d: 1,  uMax: 22 },                            // Einer
  { w: 1,   h: 10,  d: 1,  uMax: 10,  achse: 'h' },               // Zehner
  { w: 10,  h: 10,  d: 1,  uMax: 8,   achse: 'w' },               // Hunderter
  { w: 10,  h: 10,  d: 10, uMax: 6.4, achse: 'd' },               // Tausender
  { w: 100, h: 10,  d: 10, uMax: 2.0, achse: 'w', stapel: true }, // Zehntausender
  { w: 100, h: 100, d: 10, uMax: 0.9, achse: 'h' }                // Hunderttausender
];
const _m5bFARBE = {
  vorn: '#fed7aa', oben: '#ffedd5', seite: '#fdba74', kante: '#c2410c',
  gitter: '154,52,18', linie: '#ea580c', wert: '#c2410c'
};

// ── Zahlen ───────────────────────────────────────────────────────────────
function _m5bFmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); }
function _m5bZiffer(n, p) { return Math.floor(n / Math.pow(10, p)) % 10; }
function _m5bLaenge(n) { return String(n).length; }
function _m5bWert(n, p) { return _m5bZiffer(n, p) * Math.pow(10, p); }
function _m5bSpalteX(p) { const K = _m5bK, cw = (K.X1 - K.X0) / 6; return K.X0 + (5 - p + 0.5) * cw; }
function _m5bKarteY() { const K = _m5bK; return K.KY + K.KH + K.ZH / 2; }
function _m5bMisch(a, b, t) { return a + (b - a) * t; }
function _m5bFarbe(c1, c2, t) {
  const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const a = h(c1), b = h(c2);
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
}

// ── Zustand ──────────────────────────────────────────────────────────────
function _m5bInit() {
  _m5b = { zahl: 34, mark: 0, alt: null, t: 0, an: true, weg: 0, ring: false,
           glanz: 0, uhr: 0, fx: { teile: [] } };
}
// Neuen Zustand setzen und die Bewegung starten. Gibt false zurueck, wenn
// sich nichts aendert.
function _m5bSetze(zahl, mark) {
  const z = _m5b;
  if (zahl === z.zahl && mark === z.mark) return false;
  const k0 = _m5bREIHE.indexOf(z.zahl), k1 = _m5bREIHE.indexOf(zahl);
  const schritt = k1 === k0 + 1;
  // Weg 34 → 340 → 3 400 → 34 000 Schritt fuer Schritt (ohne Spruenge)
  if (zahl !== z.zahl) z.weg = schritt && z.weg === k0 ? k1 : (k1 === 0 ? 0 : -1);
  // Lichtring nur, wenn die markierte Ziffer einen Schritt mitgewandert ist
  z.ring = schritt && mark === z.mark + 1;
  z.alt = { zahl: z.zahl, mark: z.mark };
  z.zahl = zahl; z.mark = mark; z.t = 0; z.an = true;
  return true;
}

// ── Oberflaeche ──────────────────────────────────────────────────────────
function _m5bHTML() {
  const k = n => `<button class="sim-btn${n === 34 ? ' primary' : ''}" id="_m5b-b-${n}" onclick="_m5bZahl('${n}')">${_m5bFmt(n)}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welchen Wert hat die 4 in 34, 340, 3 400 und 34 000?</h3>
    <div class="fpm-note" style="margin-top:2px">Die orange Karte ist markiert. Das Material unten zeigt, wie viel sie wert ist.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5b-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5bREIHE.map(k).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_m5bAndere()">andere Ziffer markieren</button>
          <button class="sim-btn" onclick="_m5bNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Ablesen</div>
        <div class="lmp-status on" id="_m5b-zahl" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5b-ort" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5b-wert" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">HT Hunderttausender · ZT Zehntausender · T Tausender · H Hunderter · Z Zehner · E Einer</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 34, die 4 ist markiert</p>
  </div>`;
}
function _m5bStatus() {
  if (!_m5b) return;
  const z = _m5b, d = _m5bZiffer(z.zahl, z.mark);
  const setze = (id, s) => { const e = document.getElementById(id); if (e) e.textContent = s; };
  setze('_m5b-zahl', 'Zahl: ' + _m5bFmt(z.zahl));
  setze('_m5b-ort', 'Die ' + d + ' steht bei den ' + _m5bDATIV[z.mark] + '.');
  setze('_m5b-wert', 'Wert der ' + d + ': ' + _m5bFmt(_m5bWert(z.zahl, z.mark)));
  for (const n of _m5bREIHE) {
    const b = document.getElementById('_m5b-b-' + n);
    if (b && b.classList) b.classList.toggle('primary', n === z.zahl);
  }
}
// Sprungmarke: die markierte Ziffer wandert mit (die 4 bleibt die 4).
function _m5bZahl(s) {
  if (!_m5b) return;
  const zahl = Number(s), k1 = _m5bREIHE.indexOf(zahl);
  if (k1 < 0) return;
  const k0 = _m5bREIHE.indexOf(_m5b.zahl);
  if (_m5bSetze(zahl, _m5b.mark + (k1 - k0))) _m5bStatus();
}
// Markierung zur naechsten von 0 verschiedenen Ziffer nach links, im Kreis.
function _m5bAndere() {
  if (!_m5b) return;
  const z = _m5b, n = _m5bLaenge(z.zahl);
  for (let i = 1; i <= n; i++) {
    const p = (z.mark + i) % n;
    if (_m5bZiffer(z.zahl, p) !== 0) {
      if (_m5bSetze(z.zahl, p)) _m5bStatus();
      return;
    }
  }
}
function _m5bNeu() {
  if (!_m5b) return;
  _m5bSetze(34, 0);
  _m5b.weg = 0;
  _m5bStatus();
}

// ── Ablauf ───────────────────────────────────────────────────────────────
function _m5bAngekommen() {
  const z = _m5b, K = _m5bK;
  if (z.ring) {
    _bioFxWelle(z.fx.teile, _m5bSpalteX(z.mark), _m5bKarteY(), '#f59e0b', 42);
    z.glanz = 1.6;
    if (z.weg === 3) {
      // der ganze Weg ist gegangen: ein zweiter Ring um die Unterschrift
      _bioFxWelle(z.fx.teile, (K.AX0 + K.AX1) / 2, K.CY - 6, '#f59e0b', 56);
    }
  }
  z.ring = false;
}
function _m5bUpdate(dt) {
  if (!_m5b) return;
  dt = _bioFxDt(dt);
  const z = _m5b;
  z.uhr += dt;
  if (z.an) {
    z.t += dt;
    if (z.t >= _m5bK.DAUER) { z.t = _m5bK.DAUER; z.an = false; _m5bAngekommen(); }
  }
  z.glanz = Math.max(0, z.glanz - dt);
  _bioFxAlleUpdate(z.fx, dt);
}

// ── Material: Lage und Zeichnung ─────────────────────────────────────────
// Lage von n Stuecken der Form f im Materialfeld. x, y = linke untere Ecke
// der Vorderseite; alle Stuecke stehen auf der Unterkante des Feldes.
function _m5bLage(f, n) {
  const F = _m5bFORM[f], K = _m5bK;
  const bw = F.w + K.Q * F.d, bh = F.h + K.Q * F.d;
  const reihe = Math.min(n, 5), zwei = Math.max(1, Math.ceil(n / 5));
  const cols = F.stapel ? zwei : reihe, rows = F.stapel ? reihe : zwei;
  const u = Math.min(F.uMax,
                     (K.AX1 - K.AX0 - (cols - 1) * K.GAP) / (cols * bw),
                     (K.AH - (rows - 1) * K.GAP) / (rows * bh));
  const pw = bw * u, ph = bh * u;
  const TW = cols * pw + (cols - 1) * K.GAP, TH = rows * ph + (rows - 1) * K.GAP;
  const x0 = (K.AX0 + K.AX1) / 2 - TW / 2, y0 = K.AY1 - TH;
  const st = [];
  for (let i = 0; i < n; i++) {
    const r = F.stapel ? i % 5 : Math.floor(i / 5), c = F.stapel ? Math.floor(i / 5) : i % 5;
    st.push({ x: x0 + c * (pw + K.GAP), y: y0 + r * (ph + K.GAP) + ph });
  }
  return { u, pw, ph, st };
}
// Ausdehnung eines Stuecks (fuer die Klammer)
function _m5bMass(s) {
  const F = _m5bFORM[s.f], Q = _m5bK.Q;
  const W = F.w * s.u * s.sx, H = F.h * s.u * s.sy, D = F.d * s.u * s.sz * Q;
  return { x0: s.x, x1: s.x + W + D, y0: s.y - H - D, y1: s.y };
}
// Gitterlinien einer Achse: jedes Wuerfelchen (fein) und jeder Zehnerblock
// (grob). Zu enge Linien blenden weich aus; jede fuenfte ist kraeftiger.
function _m5bLinien(L, sp) {
  const a1 = _bioFxKlemme((sp - 2) / 3), a10 = _bioFxKlemme((sp * 10 - 2) / 3);
  const out = [];
  for (let i = 1; i < L; i++) {
    const grob = i % 10 === 0, a = grob ? a10 : a1;
    if (a <= 0.02) continue;
    out.push({ i, a, grob, dick: grob ? i % 50 === 0 : i % 5 === 0 });
  }
  return out;
}
function _m5bStrich(ctx, x1, y1, x2, y2, l) {
  ctx.strokeStyle = 'rgba(' + _m5bFARBE.gitter + ',' + (l.a * (l.dick ? 0.95 : l.grob ? 0.8 : 0.42)).toFixed(3) + ')';
  ctx.lineWidth = l.dick ? 1.6 : l.grob ? 1.2 : 0.8;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
// Ein Stueck im Schraegbild. s = {f, x, y, u, sx, sy, sz, a}
function _m5bKlotz(ctx, s) {
  const F = _m5bFORM[s.f], Q = _m5bK.Q, C = _m5bFARBE;
  const W = F.w * s.u * s.sx, H = F.h * s.u * s.sy, D = F.d * s.u * s.sz * Q;
  const x = s.x, y = s.y;
  if (s.a <= 0.01 || W < 0.3 || H < 0.3) return;
  ctx.save();
  ctx.globalAlpha = s.a;
  ctx.lineJoin = 'round';
  // Flaechen: vorn, oben, rechts
  ctx.fillStyle = C.vorn; ctx.fillRect(x, y - H, W, H);
  ctx.fillStyle = C.oben;
  ctx.beginPath(); ctx.moveTo(x, y - H); ctx.lineTo(x + W, y - H);
  ctx.lineTo(x + W + D, y - H - D); ctx.lineTo(x + D, y - H - D); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.seite;
  ctx.beginPath(); ctx.moveTo(x + W, y - H); ctx.lineTo(x + W, y);
  ctx.lineTo(x + W + D, y - D); ctx.lineTo(x + W + D, y - H - D); ctx.closePath(); ctx.fill();
  // Gitter
  const spx = s.u * s.sx, spy = s.u * s.sy, spz = s.u * s.sz * Q;
  for (const l of _m5bLinien(F.w, spx)) {
    const X = x + l.i * spx;
    _m5bStrich(ctx, X, y, X, y - H, l);
    _m5bStrich(ctx, X, y - H, X + D, y - H - D, l);
  }
  for (const l of _m5bLinien(F.h, spy)) {
    const Y = y - l.i * spy;
    _m5bStrich(ctx, x, Y, x + W, Y, l);
    _m5bStrich(ctx, x + W, Y, x + W + D, Y - D, l);
  }
  for (const l of _m5bLinien(F.d, spz * 1.6)) {
    const Z = l.i * spz;
    _m5bStrich(ctx, x + Z, y - H - Z, x + W + Z, y - H - Z, l);
    _m5bStrich(ctx, x + W + Z, y - Z, x + W + Z, y - H - Z, l);
  }
  // Kanten
  ctx.strokeStyle = C.kante; ctx.lineWidth = 1.2;
  ctx.strokeRect(x, y - H, W, H);
  ctx.beginPath();
  ctx.moveTo(x, y - H); ctx.lineTo(x + D, y - H - D); ctx.lineTo(x + W + D, y - H - D);
  ctx.lineTo(x + W + D, y - D); ctx.lineTo(x + W, y);
  ctx.moveTo(x + W, y - H); ctx.lineTo(x + W + D, y - H - D);
  ctx.stroke();
  ctx.restore();
}
// Stuecke eines ruhenden Zustands, mit Zoom k um die Mitte der Unterkante
function _m5bRuhend(f, n, a, k) {
  const L = _m5bLage(f, n), out = [];
  for (const p of L.st) {
    const cx = p.x + L.pw / 2;
    out.push({ f, x: cx - L.pw * k / 2, y: p.y, u: L.u * k, sx: 1, sy: 1, sz: 1, a });
  }
  return out;
}
// Alle Stuecke des aktuellen Bildes (mit Bewegung)
function _m5bStuecke(e) {
  const z = _m5b, A = z.an ? z.alt : null;
  const fB = z.mark, nB = _m5bZiffer(z.zahl, z.mark);
  if (!z.an) return _m5bRuhend(fB, nB, 1, 1);
  if (!A) return _m5bRuhend(fB, nB, _bioFxKlemme(e * 1.4), 0.8 + 0.2 * e);   // Start
  const fA = A.mark, nA = _m5bZiffer(A.zahl, A.mark);
  const kA = _m5bREIHE.indexOf(A.zahl), kB = _m5bREIHE.indexOf(z.zahl);
  const mit = nA === nB && fB - fA === kB - kA && Math.abs(fB - fA) === 1;
  if (mit) {
    // Jedes Stueck zieht sich zur naechsten Form auseinander (oder zurueck).
    // g = Weg von der kleinen zur grossen Form (0 klein, 1 gross).
    const auf = fB > fA, f = Math.max(fA, fB), F = _m5bFORM[f], ach = F.achse;
    const Lk = auf ? _m5bLage(fA, nA) : _m5bLage(fB, nB);    // kleine Form
    const Lg = auf ? _m5bLage(fB, nB) : _m5bLage(fA, nA);    // grosse Form
    const g = auf ? e : 1 - e, lang = ach === 'w' ? F.w : ach === 'h' ? F.h : F.d;
    let u, sa, gp;
    if (!!_m5bFORM[fA].stapel === !!_m5bFORM[fB].stapel) {
      // gleiche Anordnung: Massstab und gezeichnete Laenge wachsen gleichmaessig
      // (Laenge linear, sonst schiesst sie in der Mitte ueber das Ziel hinaus)
      u = _m5bMisch(Lk.u, Lg.u, g); gp = g;
      sa = _m5bMisch(lang / 10 * Lk.u, lang * Lg.u, g) / (lang * u);
    } else {
      // andere Anordnung (Wuerfel in der Reihe → Riegel uebereinander):
      // erst ruecken die Stuecke an ihren Platz, dann ziehen sie sich auseinander
      gp = _bioFxKlemme(g * 2);
      u = _m5bMisch(Lk.u, Lg.u, gp);
      sa = _m5bMisch(0.1, 1, _bioFxKlemme(g * 2 - 1));
    }
    return Lk.st.map((p, i) => ({ f, u, a: 1,
      x: _m5bMisch(p.x, Lg.st[i].x, gp), y: _m5bMisch(p.y, Lg.st[i].y, gp),
      sx: ach === 'w' ? sa : 1, sy: ach === 'h' ? sa : 1, sz: ach === 'd' ? sa : 1 }));
  }
  // Sonst: altes Material blendet aus, neues ein
  return _m5bRuhend(fA, nA, 1 - _bioFxKlemme(e * 1.7), 1 - 0.12 * e)
    .concat(_m5bRuhend(fB, nB, _bioFxKlemme((e - 0.35) * 1.6), 0.88 + 0.12 * e));
}

// ── Zeichnen ─────────────────────────────────────────────────────────────
function _m5bText(ctx, s, x, y, ausr, farbe, groesse, gewicht) {
  ctx.fillStyle = farbe || '#1e293b';
  ctx.font = (gewicht || '700') + ' ' + (groesse || 14) + 'px sans-serif';
  ctx.textAlign = ausr || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Pfad der Kopfzeile: oben rund, unten gerade
function _m5bKopfPfad(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x, y + h); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h); ctx.closePath();
}
function _m5bKarte(ctx, x, y, ziffer, o, a, glut) {
  const K = _m5bK, w = K.KW, h = K.KHK;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, x - w / 2 + 2, y - h / 2 + 3, w, h, 7); ctx.fill();
  if (glut > 0) {
    // ruhiger Glanz: ein heller Rand, kein Blinken
    ctx.strokeStyle = 'rgba(251,191,36,' + (0.55 * glut).toFixed(3) + ')'; ctx.lineWidth = 6;
    _bioFxRundRect(ctx, x - w / 2 - 4, y - h / 2 - 4, w + 8, h + 8, 10); ctx.stroke();
  }
  ctx.fillStyle = _m5bFarbe('#ffffff', '#fdba74', o);
  _bioFxRundRect(ctx, x - w / 2, y - h / 2, w, h, 7); ctx.fill();
  ctx.strokeStyle = _m5bFarbe('#94a3b8', '#ea580c', o); ctx.lineWidth = 1.5 + 1.5 * o;
  _bioFxRundRect(ctx, x - w / 2, y - h / 2, w, h, 7); ctx.stroke();
  _m5bText(ctx, String(ziffer), x, y + 10, 'center', _m5bFarbe('#1e293b', '#7c2d12', o), 28);
  ctx.restore();
}
function _m5bTafel(ctx, e) {
  const z = _m5b, K = _m5bK, cw = (K.X1 - K.X0) / 6;
  const yK = K.KY, yZ = K.KY + K.KH, yU = yZ + K.ZH, w = K.X1 - K.X0;
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.X0, yK, w, K.KH + K.ZH, 9); ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  _m5bKopfPfad(ctx, K.X0, yK, w, K.KH, 9); ctx.fill();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  for (let c = 1; c < 6; c++) {
    ctx.beginPath(); ctx.moveTo(K.X0 + c * cw, yK); ctx.lineTo(K.X0 + c * cw, yU); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(K.X0, yZ); ctx.lineTo(K.X1, yZ); ctx.stroke();
  for (let p = 0; p < 6; p++) _m5bText(ctx, _m5bKURZ[p], _m5bSpalteX(p), yK + 17, 'center', '#334155', 14);
  _bioFxRundRect(ctx, K.X0, yK, w, K.KH + K.ZH, 9); ctx.stroke();

  // Karten: Ziel B, Herkunft A (beim Wechsel ruecken alle um dieselbe Zahl Spalten)
  const yC = _m5bKarteY(), A = z.an ? z.alt : null;
  const karten = [];
  if (!A) {
    const a = z.an ? _bioFxKlemme(e * 1.6) : 1, dy = z.an ? -16 * (1 - e) : 0;
    for (let p = 0; p < _m5bLaenge(z.zahl); p++)
      karten.push({ x: _m5bSpalteX(p), y: yC + dy, d: _m5bZiffer(z.zahl, p), o: p === z.mark ? 1 : 0, a });
  } else {
    const s = _m5bREIHE.indexOf(z.zahl) - _m5bREIHE.indexOf(A.zahl);
    for (let p = 0; p < _m5bLaenge(A.zahl); p++) {
      const q = p + s;                                   // Platz in der neuen Zahl
      const o = (p === A.mark ? 1 - e : 0) + (q === z.mark ? e : 0);
      karten.push({ x: _m5bMisch(_m5bSpalteX(p), _m5bSpalteX(q), e), y: yC,
                    d: _m5bZiffer(A.zahl, p), o, a: q < 0 ? 1 - _bioFxKlemme(e * 2.5) : 1 });
    }
    // neue Nullen fallen herein, wenn die Karten davor fast weitergerueckt sind
    for (let q = 0; q < s; q++)
      karten.push({ x: _m5bSpalteX(q), y: yC - 16 * (1 - e), d: 0, o: 0, a: _bioFxKlemme((e - 0.55) * 2.6) });
  }
  karten.sort((a, b) => a.o - b.o);
  // nach einem Schritt in Folge glueht der Rand der markierten Karte kurz nach
  const g = _bioFxKlemme(z.glanz / 0.6);
  for (const k of karten) _m5bKarte(ctx, k.x, k.y, k.d, k.o, k.a, k.o > 0.5 ? g : 0);
}
// Orange Linie von der markierten Karte zur Klammer ueber dem Material
function _m5bKlammer(ctx, e, st) {
  const z = _m5b, K = _m5bK;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, a = 0;
  for (const s of st) {
    if (s.a < 0.05) continue;
    const m = _m5bMass(s);
    x0 = Math.min(x0, m.x0); x1 = Math.max(x1, m.x1); y0 = Math.min(y0, m.y0); a = Math.max(a, s.a);
  }
  if (!isFinite(x0)) return;
  const A = z.an ? z.alt : null;
  const xk = A ? _m5bMisch(_m5bSpalteX(A.mark), _m5bSpalteX(z.mark), e) : _m5bSpalteX(z.mark);
  const yk = _m5bKarteY() + K.KHK / 2 + 3, yb = Math.max(K.BY, y0 - 9), xm = (x0 + x1) / 2;
  ctx.save();
  ctx.globalAlpha = A ? 1 : (z.an ? _bioFxKlemme(e * 1.4) : 1) * Math.max(a, 0.4);
  ctx.strokeStyle = _m5bFARBE.linie; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(xk, yk);
  ctx.bezierCurveTo(xk, yk + (yb - yk) * 0.6, xm, yb - (yb - yk) * 0.5, xm, yb);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x0, yb + 5); ctx.lineTo(x0, yb); ctx.lineTo(x1, yb); ctx.lineTo(x1, yb + 5);
  ctx.stroke();
  ctx.fillStyle = _m5bFARBE.linie;
  ctx.beginPath(); ctx.arc(xk, yk, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// Bildunterschrift „4 Hunderter = 400“: am Gleichheitszeichen ausgerichtet
// (links die Stuecke, rechts der Wert in Orange) – so steht sie unabhaengig
// von der Schriftbreite ruhig in der Mitte.
function _m5bUnterschrift(ctx, zahl, mark, a) {
  if (a <= 0.01) return;
  const K = _m5bK, d = _m5bZiffer(zahl, mark), xm = (K.AX0 + K.AX1) / 2;
  ctx.save();
  ctx.globalAlpha = a;
  _m5bText(ctx, d + ' ' + _m5bNAME[mark], xm - 13, K.CY, 'right', '#334155', 17);
  _m5bText(ctx, '=', xm, K.CY, 'center', '#334155', 17);
  _m5bText(ctx, _m5bFmt(_m5bWert(zahl, mark)), xm + 13, K.CY, 'left', _m5bFARBE.wert, 20);
  ctx.restore();
}
function _m5bDraw(ctx, cv) {
  if (!_m5b) return;
  const z = _m5b, K = _m5bK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const e = z.an ? _bioFxEase.sanft(_bioFxKlemme(z.t / K.DAUER)) : 1;
  _m5bTafel(ctx, e);
  const st = _m5bStuecke(e);
  _m5bKlammer(ctx, e, st);
  for (const s of st) _m5bKlotz(ctx, s);
  // Unterschrift: die alte blendet aus, die neue ein
  const A = z.an ? z.alt : null;
  if (A) _m5bUnterschrift(ctx, A.zahl, A.mark, 1 - _bioFxKlemme(e * 2));
  _m5bUnterschrift(ctx, z.zahl, z.mark, A ? _bioFxKlemme(e * 2 - 1) : (z.an ? _bioFxKlemme(e * 1.4) : 1));
  _bioFxDraw(ctx, z.fx.teile);
}
