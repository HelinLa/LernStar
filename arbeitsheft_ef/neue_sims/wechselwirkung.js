
// ═══════════════════════════════════════════════════════
// EF.x  WECHSELWIRKUNG - DAS DRITTE NEWTON'SCHE GESETZ
// Gymnasiale Oberstufe (EF) - Inhaltsfeld "Dynamik: Newton'sche Gesetze"
//
// Zwei Wagen auf einer reibungsfreien Bahn, dazwischen eine gespannte Feder.
// Beim Loesen drueckt die Feder beide Wagen auseinander. Gemessen wird
// quantitativ: F1, F2, a1, a2, v1, v2, p1, p2 und p1 + p2.
//
// Die Aussage, auf die alles hinauslaeuft:
//   |F1| = |F2| zu JEDEM Zeitpunkt - auch wenn ein Wagen zehnmal so schwer ist,
//   waehrend sich a1 : a2 = m2 : m1 verhaelt und p1 + p2 = 0 bleibt.
//
// ── ACHTUNG BEIM EINBAU ────────────────────────────────────────────────
// Das Praefix _wwk und der Registry-Schluessel 'wechselwirkung' sind in
// physics-sim.js SCHON VERGEBEN (qualitative Realschul-Simulation Klasse 9,
// Eislaeufer/Boot/Rakete, ab Zeile ~66585). Diese Datei benutzt deshalb das
// freie Praefix _wwkf; alle DOM-Kennungen beginnen weiterhin mit "wwk".
// Registry-Eintrag fuer simcheck/einbau.py:
//
//     'wechselwirkung-ef': modal => {
//       _wwkfInit();
//       modal.innerHTML = _wwkfHTML();
//       _wwkfStatus();
//       _pSim = new PhysicsSimEngine('wwkfAnim', 'wwkfAnim');
//       _pSim.start(dt => _wwkfUpdate(dt), (ctx, cv) => _wwkfDraw(ctx, cv), []);
//     },
// ═══════════════════════════════════════════════════════

let _wwkf = null;

// ── Der Versuchsaufbau in Zahlen ───────────────────────
// Die Feder ist bewusst FEST vorgegeben: nur die beiden Massen sind Regler.
// Dadurch ist die Hoechstkraft F = D * s0 = 20,00 N von den Massen voellig
// unabhaengig - genau das ist die Aussage, die die Heftseite braucht.
const _WWKF_D    = 250;      // Federhaerte in N/m
const _WWKF_S0   = 0.08;     // Vorspannung (Zusammendrueckung) in m
const _WWKF_FMAX = 20;       // = _WWKF_D * _WWKF_S0, Hoechstkraft in N
const _WWKF_EF   = 0.8;      // = 0,5 * D * s0^2, gespeicherte Energie in J
const _WWKF_L0   = 0.30;     // entspannte Federlaenge in m
const _WWKF_BAHN = 3.2;      // Laenge der Fahrbahn in m
const _WWKF_RAND = 0.05;     // Puffer an beiden Bahnenden in m
// Zeitlupe in zwei Stufen. Das Abstossen dauert in Wirklichkeit nur rund
// 0,12 s - bei einem einzigen Faktor waeren die Kraftpfeile fuer den Bruchteil
// einer Sekunde zu sehen und danach nie wieder. Deshalb wird die Stossphase
// stark gedehnt (auf rund 2 s) und die freie Fahrt danach schneller abgespielt.
const _WWKF_LUPE_D = 0.06;   // waehrend des Abstossens: 1 s Bildschirm = 0,06 s
const _WWKF_LUPE_F = 0.30;   // danach:                  1 s Bildschirm = 0,30 s
const _WWKF_X0   = 34;       // linker Bildrand der Bahn in Pixeln
const _WWKF_XB   = 404;      // Bahnbreite in Pixeln
const _WWKF_YB   = 176;      // Hoehe der Schiene im Bild

// ── Abgeleitete Groessen ───────────────────────────────
// Relativbewegung der beiden Wagen: mu * r'' = -D * r  mit der reduzierten
// Masse mu. Also eine harmonische Schwingung, abgebrochen nach einer
// Viertelperiode - dann ist die Feder entspannt und die Wagen trennen sich.
function _wwkfMu()    { return _wwkf.m1 * _wwkf.m2 / (_wwkf.m1 + _wwkf.m2); }
function _wwkfOmega() { return Math.sqrt(_WWKF_D / _wwkfMu()); }
function _wwkfTc()    { return Math.PI / 2 / _wwkfOmega(); }          // Stossdauer in s
function _wwkfPend()  { return _wwkfMu() * _WWKF_S0 * _wwkfOmega(); } // Impulsbetrag danach
function _wwkfBreite(m) { return 0.20 + 0.02 * m; }                   // Wagenlaenge in m
function _wwkfPx(x)   { return _WWKF_X0 + x * (_WWKF_XB / _WWKF_BAHN); }

// Zahl mit Vorzeichen und Dezimalkomma. Eine gerundete Null bekommt KEIN
// Vorzeichen - sonst stuende in der Statuszeile "+0,000" neben "-0,000".
function _wwkfSig(x, n) {
  const g = Math.abs(x) < 5 * Math.pow(10, -(n + 1)) ? 0 : x;
  return (g > 0 ? '+' : '') + _fpmNum(g, n);
}

// Verhaeltnis m2 : m1 gekuerzt, damit "5 : 2" dasteht und nicht "10 : 4".
function _wwkfKuerze(a, b) {
  let x = a, y = b;
  while (y) { const h = x % y; x = y; y = h; }
  return [a / x, b / x];
}

// ── Zustand ────────────────────────────────────────────
function _wwkfInit() {
  _wwkf = {
    m1: 2, m2: 5,
    phase: 'gespannt',      // gespannt | druck | frei | ende
    t: 0, tAnim: 0,
    F: _WWKF_FMAX,          // Betrag der Federkraft in N
    s: _WWKF_L0 - _WWKF_S0, // aktuelle Federlaenge in m
    v1: 0, v2: 0, x1: 0, x2: 0,
  };
  _wwkfAufstellen();
}

// Die Wagen so hinstellen, dass beide gleichzeitig am Puffer ankommen: der
// leichte Wagen wird schneller, also braucht er mehr Bahn. Die freie Strecke
// wird im Verhaeltnis der Endgeschwindigkeiten aufgeteilt, also wie m2 : m1.
function _wwkfAufstellen() {
  _wwkf.phase = 'gespannt';
  _wwkf.t = 0;
  _wwkf.F = _WWKF_FMAX;
  _wwkf.s = _WWKF_L0 - _WWKF_S0;
  _wwkf.v1 = 0; _wwkf.v2 = 0;
  const b1 = _wwkfBreite(_wwkf.m1), b2 = _wwkfBreite(_wwkf.m2);
  const block = b1 + _wwkf.s + b2;
  const frei = _WWKF_BAHN - 2 * _WWKF_RAND - block;
  const weg1 = frei * _wwkf.m2 / (_wwkf.m1 + _wwkf.m2);
  _wwkf.x1 = _WWKF_RAND + weg1 + b1 / 2;
  _wwkf.x2 = _wwkf.x1 + b1 / 2 + _wwkf.s + b2 / 2;
}

// Aus der Federlaenge die beiden Wagenmitten berechnen. Der Schwerpunkt bleibt
// dabei stehen - das ist die Impulserhaltung im Bild.
function _wwkfGeometrie(xs) {
  const b1 = _wwkfBreite(_wwkf.m1), b2 = _wwkfBreite(_wwkf.m2);
  const d = b1 / 2 + _wwkf.s + b2 / 2;
  const M = _wwkf.m1 + _wwkf.m2;
  _wwkf.x1 = xs - _wwkf.m2 / M * d;
  _wwkf.x2 = xs + _wwkf.m1 / M * d;
  if (_wwkf.x1 - b1 / 2 <= _WWKF_RAND || _wwkf.x2 + b2 / 2 >= _WWKF_BAHN - _WWKF_RAND) {
    _wwkf.phase = 'ende';
  }
}

// ── Bedienung ──────────────────────────────────────────
function _wwkfSetM1(v) {
  if (!_wwkf) return;
  _wwkf.m1 = Math.max(1, Math.min(10, Math.round(+v)));
  const el = document.getElementById('wwkfM1Lbl');
  if (el) el.textContent = _wwkf.m1 + ' kg';
  _wwkfAufstellen(); _wwkfStatus();
}
function _wwkfSetM2(v) {
  if (!_wwkf) return;
  _wwkf.m2 = Math.max(1, Math.min(10, Math.round(+v)));
  const el = document.getElementById('wwkfM2Lbl');
  if (el) el.textContent = _wwkf.m2 + ' kg';
  _wwkfAufstellen(); _wwkfStatus();
}
function _wwkfLoesen() {
  if (!_wwkf) return;
  if (_wwkf.phase !== 'gespannt') _wwkfAufstellen();
  _wwkf.phase = 'druck';
  _wwkf.t = 0;
  _wwkfStatus();
}
function _wwkfNeu() {
  if (!_wwkf) return;
  _wwkfAufstellen(); _wwkfStatus();
}

// ── Zeit fortschreiben ─────────────────────────────────
function _wwkfUpdate(dt) {
  if (!_wwkf) return;
  _wwkf.tAnim += dt;
  if (_wwkf.phase === 'gespannt' || _wwkf.phase === 'ende') return;

  // Schwerpunkt merken: er darf sich nicht verschieben.
  const M = _wwkf.m1 + _wwkf.m2;
  const xs = (_wwkf.m1 * _wwkf.x1 + _wwkf.m2 * _wwkf.x2) / M;

  const tc = _wwkfTc(), w = _wwkfOmega();
  _wwkf.t += dt * (_wwkf.t < tc ? _WWKF_LUPE_D : _WWKF_LUPE_F);
  if (_wwkf.t < tc) {
    // Feder drueckt: Zusammendrueckung r(t) = s0 * cos(w t), F = D * r
    const r = _WWKF_S0 * Math.cos(w * _wwkf.t);
    _wwkf.phase = 'druck';
    _wwkf.F = _WWKF_D * r;
    _wwkf.s = _WWKF_L0 - r;
    const p = _wwkfMu() * _WWKF_S0 * w * Math.sin(w * _wwkf.t);
    _wwkf.v1 = -p / _wwkf.m1;
    _wwkf.v2 = p / _wwkf.m2;
  } else {
    // Feder entspannt, die Wagen beruehren sich nicht mehr: keine Kraft mehr.
    const p = _wwkfPend();
    _wwkf.phase = 'frei';
    _wwkf.F = 0;
    _wwkf.v1 = -p / _wwkf.m1;
    _wwkf.v2 = p / _wwkf.m2;
    _wwkf.s = _WWKF_L0 + (_wwkf.v2 - _wwkf.v1) * (_wwkf.t - tc);
  }
  _wwkfGeometrie(xs);
  _wwkfStatus();
}

// ── Statuszeile: die wichtigste Ausgabe ────────────────
function _wwkfStatus() {
  const el = document.getElementById('wwkfStatus');
  if (!el || !_wwkf) return;
  const m1 = _wwkf.m1, m2 = _wwkf.m2;

  // Im gespannten Zustand werden die Werte im AUGENBLICK DES LOESENS gezeigt -
  // sonst stuenden dort lauter Nullen und die Heftseite haette nichts zu zitieren.
  const F = (_wwkf.phase === 'gespannt') ? _WWKF_FMAX : _wwkf.F;
  const F1 = -F, F2 = F;
  const a1 = F1 / m1, a2 = F2 / m2;
  const v1 = _wwkf.v1, v2 = _wwkf.v2;
  const p1 = m1 * v1, p2 = m2 * v2;

  const pE = _wwkfPend(), vE1 = -pE / m1, vE2 = pE / m2;
  const eK1 = 0.5 * m1 * vE1 * vE1, eK2 = 0.5 * m2 * vE2 * vE2;
  const vh = _wwkfKuerze(m2, m1);

  const zust = { gespannt: 'Feder gespannt – angezeigt sind die Werte im Augenblick des Lösens',
                 druck:    'Feder drückt – beide Wagen werden gerade beschleunigt',
                 frei:     'Feder entspannt, Wagen getrennt – ab jetzt wirkt keine Kraft mehr',
                 ende:     'Wagen am Bahnende – die Messfahrt ist beendet' }[_wwkf.phase];

  el.innerHTML =
    `<b>Zustand:</b> ${zust}. t = ${_fpmNum(_wwkf.t, 3)} s<br>` +
    `Feder: D = 250 N/m · Vorspannung s0 = 8,0 cm · gespeicherte Energie E = 0,800 J<br>` +
    `Wagen 1: m1 = ${m1} kg (nach links, negativ) · Wagen 2: m2 = ${m2} kg (nach rechts, positiv)<br>` +
    `<b>F1 = ${_wwkfSig(F1, 2)} N · F2 = ${_wwkfSig(F2, 2)} N</b><br>` +
    `a1 = ${_wwkfSig(a1, 2)} m/s² · a2 = ${_wwkfSig(a2, 2)} m/s²<br>` +
    `v1 = ${_wwkfSig(v1, 3)} m/s · v2 = ${_wwkfSig(v2, 3)} m/s<br>` +
    `p1 = ${_wwkfSig(p1, 3)} kg·m/s · p2 = ${_wwkfSig(p2, 3)} kg·m/s · <b>p1 + p2 = ${_wwkfSig(p1 + p2, 3)} kg·m/s</b><br>` +
    `<b>|F1| = |F2|</b> zu jedem Zeitpunkt, Höchstwert 20,00 N – gleich groß, egal wie verschieden die Massen sind. ` +
    `Dagegen <b>a1 : a2 = ${vh[0]} : ${vh[1]} = m2 : m1</b> (= ${_fpmNum(m2 / m1, 2)}): die Beschleunigungen verhalten sich umgekehrt wie die Massen.<br>` +
    `Beim Lösen: F1 = ${_wwkfSig(-_WWKF_FMAX, 2)} N, F2 = ${_wwkfSig(_WWKF_FMAX, 2)} N, ` +
    `a1 = ${_wwkfSig(-_WWKF_FMAX / m1, 2)} m/s², a2 = ${_wwkfSig(_WWKF_FMAX / m2, 2)} m/s² · ` +
    `Stoßdauer Δt = ${_fpmNum(_wwkfTc(), 3)} s, für beide Wagen dieselbe<br>` +
    `Endwerte: v1 = ${_wwkfSig(vE1, 3)} m/s, v2 = ${_wwkfSig(vE2, 3)} m/s, ` +
    `p1 = ${_wwkfSig(-pE, 3)} kg·m/s, p2 = ${_wwkfSig(pE, 3)} kg·m/s, Summe 0,000 kg·m/s<br>` +
    `Energie: E(Feder) = 0,800 J = ${_fpmNum(eK1, 3)} J + ${_fpmNum(eK2, 3)} J = E(kin,1) + E(kin,2)`;
  el.className = 'lmp-status on';
}

// ── Zeichnen ───────────────────────────────────────────
function _wwkfPfeil(ctx, xa, ya, xb, yb, farbe, dick) {
  ctx.strokeStyle = farbe; ctx.fillStyle = farbe; ctx.lineWidth = dick || 3;
  ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke();
  const win = Math.atan2(yb - ya, xb - xa), k = 8;
  ctx.beginPath();
  ctx.moveTo(xb, yb);
  ctx.lineTo(xb - k * Math.cos(win - 0.42), yb - k * Math.sin(win - 0.42));
  ctx.lineTo(xb - k * Math.cos(win + 0.42), yb - k * Math.sin(win + 0.42));
  ctx.closePath(); ctx.fill();
}

// Mittig gesetzte Beschriftungen am Bildrand festhalten - am Bahnende steht ein
// Wagen sonst so weit aussen, dass sein Zahlenwert halb abgeschnitten waere.
function _wwkfHalt(x) { return Math.max(52, Math.min(418, x)); }

function _wwkfFeder(ctx, xa, xb, y) {
  ctx.strokeStyle = '#0f766e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(xa, y);
  const n = 9, br = (xb - xa) / n;
  for (let i = 0; i < n; i++) ctx.lineTo(xa + br * (i + 0.5), y + (i % 2 ? 8 : -8));
  ctx.lineTo(xb, y); ctx.stroke();
}

function _wwkfWagen(ctx, xm, m, farbe, name) {
  const br = _wwkfBreite(m) * (_WWKF_XB / _WWKF_BAHN);
  const ho = 20 + 1.8 * m;
  const cx = _wwkfPx(xm), oben = _WWKF_YB - 7 - ho;
  ctx.fillStyle = farbe;
  if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(cx - br / 2, oben, br, ho, 4); ctx.fill(); }
  else ctx.fillRect(cx - br / 2, oben, br, ho);
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cx - br * 0.28, _WWKF_YB - 3, 4, 0, 2 * Math.PI);
  ctx.arc(cx + br * 0.28, _WWKF_YB - 3, 4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(name, cx, oben + ho / 2 + 4);
  return { cx: cx, oben: oben, br: br };
}

function _wwkfDraw(ctx, cv) {
  if (!_wwkf) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const m1 = _wwkf.m1, m2 = _wwkf.m2;
  const F = (_wwkf.phase === 'gespannt') ? _WWKF_FMAX : _wwkf.F;
  const a1 = -F / m1, a2 = F / m2;
  const pE = _wwkfPend();

  // Kopfzeile
  ctx.fillStyle = '#0f172a'; ctx.font = '700 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Zwei Wagen, eine Feder – reibungsfreie Bahn', W / 2, 18);
  ctx.font = '11px sans-serif'; ctx.fillStyle = '#475569';
  const zk = { gespannt: 'Feder gespannt – Werte gelten für den Augenblick des Lösens',
               druck: 'Feder drückt – beide Wagen werden beschleunigt',
               frei: 'getrennt – keine Kraft mehr, beide fahren gleichförmig',
               ende: 'Bahnende erreicht – Messfahrt beendet' }[_wwkf.phase];
  ctx.fillText(zk + '   t = ' + _fpmNum(_wwkf.t, 3) + ' s', W / 2, 34);

  const skx = _WWKF_XB / _WWKF_BAHN;
  const b1 = _wwkfBreite(m1) * skx, b2 = _wwkfBreite(m2) * skx;
  const c1 = _wwkfPx(_wwkf.x1), c2 = _wwkfPx(_wwkf.x2);
  const kontakt = (c1 + b1 / 2 + c2 - b2 / 2) / 2;

  // ── Beschleunigungspfeile (verschieden lang) ─────────
  const aMax = _WWKF_FMAX / Math.min(m1, m2);
  ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#b45309';
  ctx.fillText('Beschleunigung a – ungleich lang', 12, 52);
  if (F > 0.01) {
    const l1 = 58 * Math.abs(a1) / aMax, l2 = 58 * Math.abs(a2) / aMax;
    _wwkfPfeil(ctx, c1, 68, c1 - l1, 68, '#f59e0b', 3);
    _wwkfPfeil(ctx, c2, 68, c2 + l2, 68, '#f59e0b', 3);
    ctx.fillStyle = '#b45309'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('a1 = ' + _wwkfSig(a1, 2) + ' m/s²', _wwkfHalt(c1 - l1 / 2), 60);
    ctx.fillText('a2 = ' + _wwkfSig(a2, 2) + ' m/s²', _wwkfHalt(c2 + l2 / 2), 60);
  } else {
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('a1 = 0,00 m/s²   a2 = 0,00 m/s²  (keine Kraft mehr)', W / 2, 68);
  }

  // ── Kraftpfeile: IMMER gleich lang, entgegengesetzt ──
  ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#334155';
  ctx.fillText('Kraft F an der Berührstelle – immer gleich lang', 12, 92);
  if (F > 0.01) {
    const lf = 26 + 44 * (F / _WWKF_FMAX);
    _wwkfPfeil(ctx, kontakt, 110, kontakt - lf, 110, '#dc2626', 4);
    _wwkfPfeil(ctx, kontakt, 110, kontakt + lf, 110, '#2563eb', 4);
    ctx.textAlign = 'right'; ctx.fillStyle = '#dc2626'; ctx.font = '700 11px sans-serif';
    ctx.fillText('F1 = ' + _wwkfSig(-F, 2) + ' N', kontakt - 8, 102);
    ctx.textAlign = 'left'; ctx.fillStyle = '#2563eb';
    ctx.fillText('F2 = ' + _wwkfSig(F, 2) + ' N', kontakt + 8, 102);
    ctx.fillStyle = '#334155'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('gleicher Betrag ' + _fpmNum(F, 2) + ' N, entgegengesetzte Richtung', kontakt, 128);
  } else {
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('F1 = 0,00 N   F2 = 0,00 N  –  die Wagen berühren sich nicht mehr', W / 2, 110);
  }

  // ── Bahn ─────────────────────────────────────────────
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(_WWKF_X0, _WWKF_YB, _WWKF_XB, 6);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(_wwkfPx(_WWKF_RAND) - 6, _WWKF_YB - 22, 6, 22);
  ctx.fillRect(_wwkfPx(_WWKF_BAHN - _WWKF_RAND), _WWKF_YB - 22, 6, 22);

  // Feder zwischen den Wagen (nach der Trennung entspannt am linken Wagen)
  const federL = (_wwkf.phase === 'druck' || _wwkf.phase === 'gespannt')
    ? _wwkf.s * skx : _WWKF_L0 * skx;
  _wwkfFeder(ctx, c1 + b1 / 2, c1 + b1 / 2 + federL, _WWKF_YB - 24);

  _wwkfWagen(ctx, _wwkf.x1, m1, '#dc2626', 'm1 = ' + m1 + ' kg');
  _wwkfWagen(ctx, _wwkf.x2, m2, '#2563eb', 'm2 = ' + m2 + ' kg');

  // Schwerpunkt: er steht still - das sieht man nur, wenn er markiert ist.
  const xs = (m1 * _wwkf.x1 + m2 * _wwkf.x2) / (m1 + m2);
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(_wwkfPx(xs), _WWKF_YB - 60); ctx.lineTo(_wwkfPx(xs), _WWKF_YB + 12); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#16a34a'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Schwerpunkt steht still', _wwkfPx(xs), _WWKF_YB - 64);

  // Massstab
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  for (let x = 0; x <= _WWKF_BAHN + 0.001; x += 0.4) {
    ctx.beginPath(); ctx.moveTo(_wwkfPx(x), _WWKF_YB + 6); ctx.lineTo(_wwkfPx(x), _WWKF_YB + 12); ctx.stroke();
    ctx.fillText(_fpmNum(x, 1), _wwkfPx(x), _WWKF_YB + 23);
  }
  ctx.textAlign = 'left'; ctx.fillText('Ort in m', _WWKF_X0, _WWKF_YB + 36);

  // ── Geschwindigkeitspfeile ───────────────────────────
  const vMax = pE / Math.min(m1, m2);
  ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#0f766e';
  ctx.fillText('Geschwindigkeit v', 12, 232);
  if (Math.abs(_wwkf.v1) > 0.001) {
    const g1 = 60 * Math.abs(_wwkf.v1) / vMax, g2 = 60 * Math.abs(_wwkf.v2) / vMax;
    _wwkfPfeil(ctx, c1, 246, c1 - g1, 246, '#0d9488', 3);
    _wwkfPfeil(ctx, c2, 246, c2 + g2, 246, '#0d9488', 3);
    ctx.fillStyle = '#0f766e'; ctx.textAlign = 'center';
    ctx.fillText('v1 = ' + _wwkfSig(_wwkf.v1, 3) + ' m/s', _wwkfHalt(c1 - g1 / 2), 260);
    ctx.fillText('v2 = ' + _wwkfSig(_wwkf.v2, 3) + ' m/s', _wwkfHalt(c2 + g2 / 2), 260);
  } else {
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('v1 = 0,000 m/s   v2 = 0,000 m/s  (noch in Ruhe)', W / 2, 248);
  }

  // ── Impulsbalken ─────────────────────────────────────
  const p1 = m1 * _wwkf.v1, p2 = m2 * _wwkf.v2, mitte = W / 2, yB = 292;
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(mitte, yB - 12); ctx.lineTo(mitte, yB + 12); ctx.stroke();
  const sp = 150 / Math.max(pE, 0.001);
  ctx.fillStyle = '#dc2626'; ctx.fillRect(mitte + p1 * sp, yB - 8, -p1 * sp, 9);
  ctx.fillStyle = '#2563eb'; ctx.fillRect(mitte, yB - 8, p2 * sp, 9);
  ctx.fillStyle = '#334155'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Impuls: p1 = ' + _wwkfSig(p1, 3) + ' kg·m/s   p2 = ' + _wwkfSig(p2, 3) + ' kg·m/s', 12, yB + 22);
  // leicht pulsierende Marke - sie zeigt, dass die Summe null BLEIBT
  const puls = 3 + 1.5 * Math.sin(_wwkf.tAnim * 3);
  ctx.fillStyle = '#16a34a';
  ctx.beginPath(); ctx.arc(mitte, yB - 3.5, puls, 0, 2 * Math.PI); ctx.fill();
  ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('p1 + p2 = ' + _wwkfSig(p1 + p2, 3) + ' kg·m/s', mitte, yB + 36);

  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('rot = Wagen 1 (nach links, negativ)   ·   blau = Wagen 2 (nach rechts, positiv)', W / 2, 334);
}

// ── Oberflaeche ────────────────────────────────────────
function _wwkfHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim wwkf-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wechselwirkung – zwei Wagen, eine Feder, zwei Kräfte</h3>
    <div class="fpm-note" style="margin-top:2px">Zwischen den beiden Wagen sitzt eine gespannte Feder. Löse sie und lies ab, was an <b>beiden</b> Wagen gleichzeitig passiert. Stelle danach sehr verschiedene Massen ein und wiederhole die Messung.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="wwkfAnim" width="470" height="340" class="phys-anim-cv"></canvas>
        <div class="phys-ctrl" style="margin-top:8px">
          <label class="phys-ctrl-label" for="wwkfM1">Masse m1 (linker Wagen): <b id="wwkfM1Lbl">2 kg</b></label>
          <input type="range" id="wwkfM1" min="1" max="10" step="1" value="2"
            oninput="_wwkfSetM1(this.value)" style="width:100%;accent-color:#dc2626">
        </div>
        <div class="phys-ctrl" style="margin-top:6px">
          <label class="phys-ctrl-label" for="wwkfM2">Masse m2 (rechter Wagen): <b id="wwkfM2Lbl">5 kg</b></label>
          <input type="range" id="wwkfM2" min="1" max="10" step="1" value="5"
            oninput="_wwkfSetM2(this.value)" style="width:100%;accent-color:#2563eb">
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" onclick="_wwkfLoesen()">Feder lösen</button>
          <button class="sim-btn" onclick="_wwkfNeu()">Neu aufstellen</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Messwerte</div>
        <div class="lmp-status" id="wwkfStatus" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px"><b>Drittes Newton'sches Gesetz (Wechselwirkungsprinzip):</b> Übt Körper 1 auf Körper 2 die Kraft F2 aus, so übt Körper 2 auf Körper 1 die Kraft F1 = −F2 aus. Die beiden Kräfte sind <b>gleich groß und entgegengesetzt gerichtet</b>, greifen aber an <b>verschiedenen</b> Körpern an – deshalb heben sie sich nicht auf. Aus F = m·a folgt sofort a1 : a2 = m2 : m1 und aus F1 = −F2 über die ganze Stoßdauer p1 + p2 = 0.</div>
        <div class="fpm-note" style="margin-top:8px"><b>Modellgrenzen:</b> Die Bahn ist reibungsfrei und die Feder ideal (masselos, F = D·s). Die Bewegung läuft in <b>Zeitlupe</b>, und zwar in zwei Stufen: Das Abstoßen dauert in Wirklichkeit nur rund 0,12 s und ist auf etwa 2 Sekunden gedehnt (1 s am Bildschirm = 0,06 s), die freie Fahrt danach läuft schneller ab (1 s am Bildschirm = 0,30 s). Angezeigt wird immer die <b>wirkliche</b> Zeit t. Am Bahnende stoppt die Messfahrt – der Puffer ist nur eine Anzeigegrenze und gehört nicht zum Versuch. Die Stoßdauer Δt hängt von den Massen ab (Δt = (π/2)·√(μ/D) mit der reduzierten Masse μ = m1·m2/(m1+m2)), die Höchstkraft dagegen nicht.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>|F1| = |F2|</b> immer &nbsp;·&nbsp; <b>a1 : a2 = m2 : m1</b> &nbsp;·&nbsp; <b>p1 + p2 = 0</b>
    </p>
  </div>`;
}
