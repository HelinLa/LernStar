
// ═══════════════════════════════════════════════════════
// EF · WAAGERECHTER WURF – zwei Bewegungen zur selben Zeit
// Gymnasiale Oberstufe, Einfuehrungsphase, Inhaltsfeld 1 (Mechanik).
// Konkretisierte Kompetenzerwartung: "unterscheiden gleichfoermige und
// gleichmaessig beschleunigte Bewegungen und erklaeren zugrunde liegende
// Ursachen auch am waagerechten Wurf." Basiskonzept "Superposition und
// Komponenten".
//
// Warum eine eigene Simulation: 'wurfbewegung' kann den waagerechten Wurf
// NICHT - ihr Winkelregler wfAlpha hat min="10", 0 Grad ist unerreichbar.
//
// Der Kern der Einheit steht im Bild: NEBEN dem geworfenen Koerper faellt ein
// zweiter senkrecht aus derselben Hoehe. In gleichen Zeitabstaenden (0,25 s)
// gesetzte Marken auf beiden Bahnen werden durch waagerechte Verbindungslinien
// zusammengehalten - beide Koerper sind zu JEDER Zeit auf gleicher Hoehe und
// kommen gleichzeitig unten an. Die Fallzeit t = wurzel(2h/g) enthaelt v0
// nicht; genau das ist die Aussage.
//
// Registry-Eintrag fuer simcheck/einbau.py:
//   'wurf-waagerecht': modal => {
//     _wwfInit();
//     modal.innerHTML = _wwfHTML();
//     _wwfStatus();
//     _pSim = new PhysicsSimEngine('wwfAnim', 'wwfAnim');
//     _pSim.start(dt => _wwfUpdate(dt), (ctx, cv) => _wwfDraw(ctx, cv), []);
//   },
// ═══════════════════════════════════════════════════════

const _WWF_G      = 9.81;    // Ortsfaktor in m/s²
const _WWF_DTM    = 0.25;    // Zeitabstand der Marken in s
const _WWF_LUPE   = 0.55;    // Zeitlupe: 1 s Bildschirmzeit = 0,55 s Wurfzeit
const _WWF_FARBEN = ['#7c3aed', '#0891b2', '#ea580c', '#16a34a'];

let _wwf = null;

function _wwfInit() {
  _wwf = {
    h: 20,          // Abwurfhoehe in m
    v0: 8,          // Abwurfgeschwindigkeit in m/s
    t: 0,           // Wurfzeit in s
    laeuft: true,
    gelandet: false,
    bahnen: [],     // aufgezeichnete Bahnkurven
    acc: 0,         // Sammler fuer die Statuszeile (nicht 60-mal je Sekunde)
    puls: 0,        // laeuft immer weiter, haelt das Bild lebendig
  };
}

// ── Physik ─────────────────────────────────────────────
function _wwfFallzeit() { return Math.sqrt(2 * _wwf.h / _WWF_G); }
function _wwfWeite()    { return _wwf.v0 * _wwfFallzeit(); }
function _wwfHoehe(t)   { return Math.max(0, _wwf.h - 0.5 * _WWF_G * t * t); }

// ── Bedienung ──────────────────────────────────────────
function _wwfSetH(v) {
  if (!_wwf) return;
  _wwf.h = +v;
  const el = document.getElementById('wwfHLbl');
  if (el) el.textContent = _fpmNum(_wwf.h, 0) + ' m';
  _wwfNeu();
}

function _wwfSetV0(v) {
  if (!_wwf) return;
  _wwf.v0 = +v;
  const el = document.getElementById('wwfV0Lbl');
  if (el) el.textContent = _fpmNum(_wwf.v0, 0) + ' m/s';
  _wwfNeu();
}

function _wwfNeu() {
  if (!_wwf) return;
  _wwf.t = 0; _wwf.laeuft = true; _wwf.gelandet = false;
  _wwfStatus();
}

/* Sprungmarke: anteil = 0 (Abwurf), 0,5 (halbe Fallzeit), 1 (Aufprall).
   Die Bewegung haelt an, damit sich der Wert in Ruhe ablesen laesst. */
function _wwfSprung(anteil) {
  if (!_wwf) return;
  _wwf.t = _wwfFallzeit() * anteil;
  _wwf.laeuft = false;
  _wwf.gelandet = anteil >= 1;
  _wwfStatus();
}

function _wwfAufzeichnen() {
  if (!_wwf) return;
  const tF = _wwfFallzeit(), pkt = [];
  for (let i = 0; i <= 60; i++) {
    const t = tF * i / 60;
    pkt.push({ x: _wwf.v0 * t, y: _wwf.h - 0.5 * _WWF_G * t * t });
  }
  _wwf.bahnen.push({
    h: _wwf.h, v0: _wwf.v0, tF: tF, weite: _wwf.v0 * tF, punkte: pkt,
    farbe: _WWF_FARBEN[_wwf.bahnen.length % _WWF_FARBEN.length],
  });
  if (_wwf.bahnen.length > 4) _wwf.bahnen.shift();
  _wwfListe();
}

function _wwfLoeschen() {
  if (!_wwf) return;
  _wwf.bahnen = [];
  _wwfListe();
}

/* Die aufgezeichneten Bahnen stehen in einem EIGENEN Feld - so bleibt die
   Statuszeile kurz genug, dass simfakten.js sie nicht abschneidet. */
function _wwfListe() {
  const el = document.getElementById('wwfBahnen');
  if (!el || !_wwf) return;
  if (!_wwf.bahnen.length) {
    el.innerHTML = 'Noch keine Bahn aufgezeichnet.';
    return;
  }
  el.innerHTML = _wwf.bahnen.map(b =>
    `<span class="fpm-dot" style="background:${b.farbe}"></span>` +
    `h = <b>${_fpmNum(b.h, 0)} m</b> · v₀ = <b>${_fpmNum(b.v0, 0)} m/s</b> ` +
    `→ Fallzeit <b>${_fpmNum(b.tF, 2)} s</b>, Wurfweite <b>${_fpmNum(b.weite, 2)} m</b>`
  ).join('<br>');
}

// ── Zeit ───────────────────────────────────────────────
function _wwfUpdate(dt) {
  if (!_wwf) return;
  _wwf.puls += dt;
  if (_wwf.laeuft) {
    const tF = _wwfFallzeit();
    _wwf.t += dt * _WWF_LUPE;
    if (_wwf.t >= tF) { _wwf.t = tF; _wwf.laeuft = false; _wwf.gelandet = true; _wwf.acc = 1; }
    _wwf.acc += dt;
    if (_wwf.acc >= 0.05) { _wwf.acc = 0; _wwfStatus(); }
  }
}

// ── Statuszeile: die wichtigste Ausgabe ────────────────
function _wwfStatus() {
  const el = document.getElementById('wwfStatus');
  if (!el || !_wwf) return;
  const h = _wwf.h, v0 = _wwf.v0, g = _WWF_G;
  const tF = Math.sqrt(2 * h / g);
  const t  = Math.min(_wwf.t, tF);
  const x  = v0 * t;
  const y  = Math.max(0, h - 0.5 * g * t * t);
  const vy = g * t;
  const v  = Math.sqrt(v0 * v0 + vy * vy);
  const weite = v0 * tF;

  let s = `Abwurfhöhe h = <b>${_fpmNum(h, 0)} m</b> · ` +
          `Abwurfgeschwindigkeit v₀ = <b>${_fpmNum(v0, 0)} m/s</b> · ` +
          `g = <b>9,81 m/s²</b><br><br>`;

  s += `t = <b>${_fpmNum(t, 2)} s</b><br>`;
  s += `x = <b>${_fpmNum(x, 2)} m</b><br>`;
  s += `y = <b>${_fpmNum(y, 2)} m</b><br>`;
  s += `v<sub>x</sub> = <b>${_fpmNum(v0, 2)} m/s</b> (konstant)<br>`;
  s += `v<sub>y</sub> = <b>${_fpmNum(vy, 2)} m/s</b><br>`;
  s += `v = <b>${_fpmNum(v, 2)} m/s</b><br><br>`;

  s += `Der senkrecht fallende Vergleichskörper ist zur selben Zeit bei ` +
       `y = <b>${_fpmNum(y, 2)} m</b> – auf gleicher Höhe.<br><br>`;

  s += `x = v₀ · t = ${_fpmNum(v0, 2)} m/s · ${_fpmNum(t, 2)} s = <b>${_fpmNum(x, 2)} m</b> (gleichförmig)<br>`;
  s += `y = h − 0,5 · g · t² = ${_fpmNum(h, 0)} m − 0,5 · 9,81 m/s² · (${_fpmNum(t, 2)} s)² = <b>${_fpmNum(y, 2)} m</b> (gleichmäßig beschleunigt)<br>`;
  s += `v = √(v₀² + v<sub>y</sub>²) = <b>${_fpmNum(v, 2)} m/s</b><br><br>`;

  s += `Fallzeit t = √(2h/g) = √(2 · ${_fpmNum(h, 0)} m / 9,81 m/s²) = <b>${_fpmNum(tF, 2)} s</b>. ` +
       `In dieser Formel kommt v₀ <b>nicht</b> vor – die Abwurfgeschwindigkeit ändert die Fallzeit nicht.<br>`;
  s += `Wurfweite x<sub>W</sub> = v₀ · t = ${_fpmNum(v0, 2)} m/s · ${_fpmNum(tF, 2)} s = <b>${_fpmNum(weite, 2)} m</b><br>`;

  s += _wwf.gelandet
    ? `<b>Beide sind unten – gleichzeitig, nach ${_fpmNum(tF, 2)} s.</b>`
    : `Noch <b>${_fpmNum(tF - t, 2)} s</b> bis zum Aufprall.`;

  el.innerHTML = s;
}

// ── Bild ───────────────────────────────────────────────
/* Runde Achsenschrittweite zu einer Spanne. */
function _wwfSchritt(spanne) {
  const roh = Math.max(spanne, 0.001) / 5;
  const p = Math.pow(10, Math.floor(Math.log10(roh)));
  const n = roh / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function _wwfPfeil(ctx, x1, y1, x2, y2, farbe) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  if (L < 3) return;
  ctx.strokeStyle = farbe; ctx.fillStyle = farbe; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const ux = dx / L, uy = dy / L, s = 6;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - s * ux + s * 0.55 * uy, y2 - s * uy - s * 0.55 * ux);
  ctx.lineTo(x2 - s * ux - s * 0.55 * uy, y2 - s * uy + s * 0.55 * ux);
  ctx.closePath(); ctx.fill();
}

/* Beschriftung mit hellem Grund - sonst liegt sie auf der Bahnkurve. */
function _wwfSchild(ctx, txt, x, y, farbe) {
  ctx.font = '700 10px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  const b = ctx.measureText(txt).width;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillRect(x - b / 2 - 4, y - 12, b + 8, 14);
  ctx.fillStyle = farbe;
  ctx.fillText(txt, x, y);
}

function _wwfDraw(ctx, cv) {
  if (!_wwf) return;
  const W = cv.width, H = cv.height;
  const h = _wwf.h, v0 = _wwf.v0;
  const tF = _wwfFallzeit(), weite = _wwfWeite();
  const t  = Math.min(_wwf.t, tF);
  const x  = v0 * t, y = _wwfHoehe(t);
  const vy = _WWF_G * t, v = Math.sqrt(v0 * v0 + vy * vy);

  // Weltausschnitt: aufgezeichnete Bahnen zaehlen mit, sonst laufen sie hinaus
  let wmax = weite, hmax = h;
  _wwf.bahnen.forEach(b => { if (b.weite > wmax) wmax = b.weite; if (b.h > hmax) hmax = b.h; });
  const wW = Math.max(wmax * 1.10, 2.5), wH = Math.max(hmax * 1.08, 5);

  // xLab liegt links der Abwurfplattform - sonst deckt die Plattform die
  // oberste Hoehenmarke zu (im gemalten Bild nachgesehen)
  const topY = 48, gY = 298, x0 = 88, xR = W - 12, xF = 60, xLab = 40;
  // gleicher Massstab in beide Richtungen - sonst waere die Parabel verzerrt
  const sc = Math.min((xR - x0) / wW, (gY - topY) / wH);
  const PX = m => x0 + m * sc;
  const PY = m => gY - m * sc;

  // Himmel und Boden
  ctx.fillStyle = '#eff6ff'; ctx.fillRect(0, 0, W, gY);
  ctx.fillStyle = '#dcfce7'; ctx.fillRect(0, gY, W, H - gY);
  ctx.strokeStyle = '#86efac'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, gY); ctx.lineTo(W, gY); ctx.stroke();

  // Gitter und Achsenbeschriftung
  ctx.font = '9px system-ui, sans-serif';
  ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  // Schrittweite so waehlen, dass die Marken auch auf dem Schirm auseinander
  // liegen: bei h = 5 m standen sonst sechs Zahlen auf 77 Pixeln
  const sy = _wwfSchritt(Math.max(hmax, 140 / sc));
  for (let m = 0; m <= hmax + sy * 0.05; m += sy) {
    const gy = PY(m);
    if (gy < topY - 2) break;
    ctx.strokeStyle = '#dbeafe'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(xF - 6, gy); ctx.lineTo(xR, gy); ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(_fpmNum(m, sy < 1 ? 1 : 0), xLab, gy);
  }
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  const sx = _wwfSchritt(Math.max(wmax, 170 / sc));
  for (let m = 0; m <= wmax + sx * 0.6; m += sx) {
    const gx = PX(m);
    if (gx > xR) break;
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(gx, gY); ctx.lineTo(gx, topY); ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(_fpmNum(m, sx < 1 ? 1 : 0), gx, gY + 6);
  }
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'right'; ctx.fillText('x in m', xR, gY + 20);

  // Achsen
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, gY); ctx.lineTo(x0, topY); ctx.stroke();
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('y in m', x0 + 5, topY + 6);
  ctx.textBaseline = 'top';

  // Kasten fuer das Geschwindigkeitsdreieck (oben rechts, immer frei:
  // die Parabel faellt von links oben nach rechts unten)
  const bx = xR - 160, by = topY + 6, bw = 160, bh = 82;

  // Abwurfplattform - beide Koerper starten aus derselben Hoehe
  const pyH = PY(h);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(xF - 14, pyH, x0 - (xF - 14), 5);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(x0, pyH);
  ctx.lineTo(pyH > by - 6 && pyH < by + bh + 6 ? bx - 6 : xR, pyH);
  ctx.stroke();
  ctx.setLineDash([]);

  // aufgezeichnete Bahnen
  _wwf.bahnen.forEach(b => {
    ctx.strokeStyle = b.farbe; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.65;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    b.punkte.forEach((p, i) => i ? ctx.lineTo(PX(p.x), PY(p.y)) : ctx.moveTo(PX(p.x), PY(p.y)));
    ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;
  });

  // Fallinie des Vergleichskoerpers
  ctx.strokeStyle = '#fca5a5'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
  ctx.beginPath(); ctx.moveTo(xF, pyH); ctx.lineTo(xF, gY); ctx.stroke();
  ctx.setLineDash([]);

  // Wurfparabel bis zur aktuellen Zeit
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) {
    const tt = t * i / 48, bxx = PX(v0 * tt), byy = PY(_wwfHoehe(tt));
    i ? ctx.lineTo(bxx, byy) : ctx.moveTo(bxx, byy);
  }
  ctx.stroke();

  // schon gefallene Strecke des Vergleichskoerpers
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(xF, pyH); ctx.lineTo(xF, PY(y)); ctx.stroke();

  // Marken in GLEICHEN Zeitabstaenden auf beiden Bahnen
  for (let k = 0; k * _WWF_DTM <= t + 1e-9; k++) {
    const tk = k * _WWF_DTM, yk = _wwfHoehe(tk), pyk = PY(yk), pxk = PX(v0 * tk);
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(xF, pyk); ctx.lineTo(pxk, pyk); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(xF, pyk, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath(); ctx.arc(pxk, pyk, 3, 0, Math.PI * 2); ctx.fill();
  }

  // Verbindung der beiden Koerper im JETZT - gleiche Hoehe zur selben Zeit
  const px = PX(x), py = PY(y);
  ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.2;
  ctx.setLineDash([5, 4]); ctx.lineDashOffset = -(_wwf.puls * 14) % 9;
  ctx.beginPath(); ctx.moveTo(xF, py); ctx.lineTo(px, py); ctx.stroke();
  ctx.setLineDash([]); ctx.lineDashOffset = 0;
  if (px - xF > 118 && !_wwf.gelandet) {
    _wwfSchild(ctx, 'gleiche Höhe: y = ' + _fpmNum(y, 2) + ' m', (xF + px) / 2, py - 5, '#0f172a');
  }

  // Geschwindigkeitsdreieck im festen Kasten. Am Koerper selbst wuerde der
  // v_y-Pfeil beim Aufprall unter den Boden und aus dem Bild laufen.
  const kI = 58 / Math.max(1, Math.sqrt(v0 * v0 + 2 * _WWF_G * h));
  ctx.fillStyle = 'rgba(255,255,255,0.93)'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
  const ox = bx + 12, oy = by + 14;
  _wwfPfeil(ctx, ox, oy, ox + v0 * kI, oy, '#0891b2');
  if (vy > 0.2) {
    _wwfPfeil(ctx, ox, oy, ox, oy + vy * kI, '#ef4444');
    _wwfPfeil(ctx, ox, oy, ox + v0 * kI, oy + vy * kI, '#1e293b');
  }
  ctx.font = '700 9px system-ui, sans-serif';
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#0891b2'; ctx.fillText('vx = ' + _fpmNum(v0, 2) + ' m/s', bx + bw - 7, by + 20);
  ctx.fillStyle = '#ef4444'; ctx.fillText('vy = ' + _fpmNum(vy, 2) + ' m/s', bx + bw - 7, by + 36);
  ctx.fillStyle = '#1e293b'; ctx.fillText('v = ' + _fpmNum(v, 2) + ' m/s', bx + bw - 7, by + 52);
  ctx.fillStyle = '#64748b'; ctx.font = '9px system-ui, sans-serif';
  ctx.fillText('vx bleibt gleich, vy wächst', bx + bw - 7, by + 74);

  // die beiden Koerper
  ctx.fillStyle = '#ef4444'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(xF, py, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Aufprall: Wurfweite und die gemeinsame Ankunft
  if (_wwf.gelandet) {
    const r = 10 + 5 * Math.abs(Math.sin(_wwf.puls * 2.2));
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(xF, gY, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#7c3aed';
    ctx.beginPath(); ctx.arc(PX(weite), gY, r, 0, Math.PI * 2); ctx.stroke();

    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x0, gY - 12); ctx.lineTo(PX(weite), gY - 12); ctx.stroke();
    ctx.setLineDash([]);
    _wwfSchild(ctx, 'Wurfweite ' + _fpmNum(weite, 2) + ' m', (x0 + PX(weite)) / 2, gY - 15, '#475569');
  }

  // Kopfzeilen
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#0f172a'; ctx.font = '700 12px system-ui, sans-serif';
  ctx.fillText('h = ' + _fpmNum(h, 0) + ' m   ·   v₀ = ' + _fpmNum(v0, 0) +
               ' m/s   ·   g = 9,81 m/s²', 10, 17);
  ctx.fillStyle = '#7c3aed'; ctx.font = '700 11px system-ui, sans-serif';
  ctx.fillText('t = ' + _fpmNum(t, 2) + ' s   ·   x = ' + _fpmNum(x, 2) +
               ' m   ·   y = ' + _fpmNum(y, 2) + ' m   ·   v = ' + _fpmNum(v, 2) + ' m/s', 10, 33);
  ctx.fillStyle = '#475569'; ctx.font = '10px system-ui, sans-serif';
  ctx.fillText(_wwf.gelandet
    ? 'beide gleichzeitig unten nach t = ' + _fpmNum(tF, 2) + ' s'
    : 'Fallzeit t = √(2h/g) = ' + _fpmNum(tF, 2) + ' s – ohne v₀', 10, 45);

  // Legende
  ctx.font = '9px system-ui, sans-serif'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath(); ctx.arc(14, gY + 40, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#475569'; ctx.fillText('waagerecht geworfen', 22, gY + 40);
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.arc(154, gY + 40, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#475569'; ctx.fillText('senkrecht fallend (Vergleich)', 162, gY + 40);
  ctx.fillText('Marken: 0,25 s', 336, gY + 40);
  ctx.textBaseline = 'alphabetic';
}

// ── Oberflaeche ────────────────────────────────────────
function _wwfHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">🏹 Waagerechter Wurf – zwei Bewegungen zur selben Zeit</h3>
    <div class="fpm-note" style="margin-top:2px">Ein Körper wird waagerecht abgeworfen. Im selben Augenblick fällt ein zweiter Körper aus <b>derselben Höhe</b> senkrecht nach unten. Waagerecht wirkt keine Kraft – dort bleibt die Geschwindigkeit gleich. Senkrecht zieht die Gewichtskraft – dort wird der Körper gleichmäßig schneller. Die Wurfbahn ist die <b>Überlagerung</b> beider Bewegungen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="wwfAnim" width="440" height="350" class="phys-anim-cv"></canvas>
        <div class="phys-ctrl" style="margin-top:8px">
          <label class="phys-ctrl-label" for="wwfH">Abwurfhöhe h: <b id="wwfHLbl">${_fpmNum(_wwf.h, 0)} m</b></label>
          <input type="range" id="wwfH" min="5" max="45" step="5" value="${_wwf.h}"
            oninput="_wwfSetH(this.value)" style="width:100%;accent-color:#ef4444">
        </div>
        <div class="phys-ctrl" style="margin-top:6px">
          <label class="phys-ctrl-label" for="wwfV0">Abwurfgeschwindigkeit v₀: <b id="wwfV0Lbl">${_fpmNum(_wwf.v0, 0)} m/s</b></label>
          <input type="range" id="wwfV0" min="2" max="20" step="1" value="${_wwf.v0}"
            oninput="_wwfSetV0(this.value)" style="width:100%;accent-color:#0891b2">
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" onclick="_wwfAufzeichnen()">Bahn aufzeichnen</button>
          <button class="sim-btn" onclick="_wwfNeu()">Neu starten</button>
          <button class="sim-btn" onclick="_wwfLoeschen()">Aufzeichnungen löschen</button>
        </div>
        <div class="fpm-label" style="margin-top:4px">Zeitmarken – hier hält die Bewegung an</div>
        <div class="sim-btn-row">
          <button class="sim-btn" onclick="_wwfSprung(0)">Abwurf</button>
          <button class="sim-btn" onclick="_wwfSprung(0.5)">halbe Fallzeit</button>
          <button class="sim-btn" onclick="_wwfSprung(1)">Aufprall</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Messwerte</div>
        <div class="lmp-status" id="wwfStatus"></div>
        <div class="fpm-label" style="margin-top:10px">Aufgezeichnete Bahnen</div>
        <div class="fpm-note" id="wwfBahnen">Noch keine Bahn aufgezeichnet.</div>
        <div class="fpm-note" style="margin-top:10px"><b>Modellgrenze:</b> Gerechnet wird ohne Luftwiderstand und mit g = 9,81 m/s². Der senkrecht fallende Vergleichskörper ist im Bild nach <b>links versetzt</b> gezeichnet, damit beide Körper zu sehen sind – in Wirklichkeit startet er am selben Punkt wie der geworfene. Die Marken auf beiden Bahnen liegen 0,25 s auseinander.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>x = v₀ · t</b> (gleichförmig) &nbsp;|&nbsp; <b>y = h − 0,5 · g · t²</b> (gleichmäßig beschleunigt) &nbsp;|&nbsp; die Fallzeit <b>t = √(2h/g)</b> hängt nicht von v₀ ab
    </p>
  </div>`;
}
