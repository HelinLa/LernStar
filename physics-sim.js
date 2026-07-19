/**
 * LernStar – PhysicsSim Framework
 * Interaktive Physik-Simulationen mit Live-Diagrammen
 */

'use strict';

// ═══════════════════════════════════════════════════════
// KERN-ENGINE
// ═══════════════════════════════════════════════════════

class PhysicsSimEngine {
  constructor(animId, chartId) {
    this.animCanvas  = document.getElementById(animId);
    this.chartCanvas = document.getElementById(chartId);
    this.actx = this.animCanvas?.getContext('2d');
    this.cctx = this.chartCanvas?.getContext('2d');
    this.data    = {};   // { seriesName: [{t, v}] }
    this.t       = 0;
    this.running = false;
    this.raf     = null;
    this.maxDataPts = 300;
    this.clickT  = null; // für Tangenten-Anzeige
    this._setupChartClick();
  }

  addSeries(name) { this.data[name] = []; }

  record(name, value) {
    if (!this.data[name]) this.data[name] = [];
    this.data[name].push({ t: this.t, v: value });
    if (this.data[name].length > this.maxDataPts)
      this.data[name].shift();
  }

  start(updateFn, animFn, chartCfg, dtMs = 16) {
    this.running = true;
    this.chartCfg = chartCfg;
    const loop = () => {
      if (!this.running) return;
      const dt = dtMs / 1000;
      updateFn(dt);
      this.t += dt;
      if (this.actx) animFn(this.actx, this.animCanvas);
      if (this.cctx) this._drawCharts();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  reset() { this.data = {}; this.t = 0; this.clickT = null; }

  // ── Diagramm-Rendering ────────────────────────────────
  _drawCharts() {
    const cv = this.chartCanvas;
    const ctx = this.cctx;
    const cfg = this.chartCfg; // [{series, label, unit, color, yMin, yMax}]
    if (!cfg || !cfg.length) return;

    ctx.clearRect(0, 0, cv.width, cv.height);

    const n    = cfg.length;
    const h    = cv.height / n;
    const padL = 54, padR = 12, padT = 24, padB = 18;

    cfg.forEach((c, i) => {
      const y0 = i * h;
      const series = this.data[c.series] || [];

      // Hintergrund
      ctx.fillStyle = i % 2 === 0 ? '#fafafa' : '#f3f4f6';
      ctx.fillRect(0, y0, cv.width, h);

      const gx = padL, gy = y0 + padT;
      const gw = cv.width - padL - padR;
      const gh = h - padT - padB;

      // Gitternetz
      ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
      for (let li = 0; li <= 4; li++) {
        const ly = gy + (li / 4) * gh;
        ctx.beginPath(); ctx.moveTo(gx, ly); ctx.lineTo(gx + gw, ly); ctx.stroke();
      }
      for (let li = 0; li <= 5; li++) {
        const lx = gx + (li / 5) * gw;
        ctx.beginPath(); ctx.moveTo(lx, gy); ctx.lineTo(lx, gy + gh); ctx.stroke();
      }

      // Achsen
      ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh);
      ctx.stroke();

      // Datenkurve
      if (series.length > 1) {
        const tMin = series[0].t;
        const tMax = Math.max(series[series.length - 1].t, tMin + 1);
        const vMin = c.yMin ?? Math.min(...series.map(p => p.v));
        const vMax = c.yMax ?? Math.max(...series.map(p => p.v));
        const vRange = vMax - vMin || 1;

        const tx = t => gx + ((t - tMin) / (tMax - tMin)) * gw;
        const ty = v => gy + gh - ((v - vMin) / vRange) * gh;

        ctx.strokeStyle = c.color || '#7c3aed';
        ctx.lineWidth   = 2;
        ctx.beginPath();
        series.forEach((p, j) => j === 0 ? ctx.moveTo(tx(p.t), ty(p.v)) : ctx.lineTo(tx(p.t), ty(p.v)));
        ctx.stroke();

        // Tangente bei Klick
        if (this.clickT !== null && series.length > 4) {
          const ci = series.findIndex(p => p.t >= this.clickT);
          if (ci > 1 && ci < series.length - 1) {
            const slope = (series[ci + 1].v - series[ci - 1].v) /
                          (series[ci + 1].t - series[ci - 1].t);
            const px = tx(series[ci].t), py = ty(series[ci].v);
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]);
            ctx.beginPath();
            ctx.moveTo(px - 40, py - slope * 40 / gw * gh * (tMax - tMin) / vRange);
            ctx.lineTo(px + 40, py + slope * 40 / gw * gh * (tMax - tMin) / vRange);
            ctx.stroke(); ctx.setLineDash([]);
            // Steigungswert
            ctx.fillStyle = '#ef4444'; ctx.font = '700 11px sans-serif';
            ctx.fillText(`Δ${c.label}/Δt ≈ ${slope.toFixed(2)} ${c.unit}/s`, gx + 2, gy + gh - 4);
          }
        }

        // Achsenbeschriftungen
        ctx.fillStyle = '#374151'; ctx.font = '700 11px sans-serif';
        ctx.fillText(c.label + (c.unit ? ` [${c.unit}]` : ''), gx + 2, gy + 14);
        ctx.fillStyle = '#6b7280'; ctx.font = '10px sans-serif';
        ctx.fillText(vMax.toFixed(1), gx - 4, gy + 12); ctx.textAlign = 'right';
        ctx.fillText(vMin.toFixed(1), gx - 4, gy + gh); ctx.textAlign = 'left';
        ctx.fillText('t [s]', gx + gw - 16, gy + gh + 14);
      }

      // Titel
      ctx.fillStyle = c.color || '#7c3aed'; ctx.font = '700 11px sans-serif';
      ctx.fillText(c.title || (c.label + '-t-Diagramm'), gx + gw / 2 - 40, y0 + 14);
    });
  }

  _setupChartClick() {
    if (!this.chartCanvas) return;
    this.chartCanvas.addEventListener('click', e => {
      const r   = this.chartCanvas.getBoundingClientRect();
      const cx  = (e.clientX - r.left) * (this.chartCanvas.width / r.width);
      const cfg = this.chartCfg?.[0];
      if (!cfg) return;
      const series = this.data[cfg.series] || [];
      if (!series.length) return;
      const tMin = series[0].t, tMax = series[series.length - 1].t;
      const padL = 54, gw = this.chartCanvas.width - padL - 12;
      this.clickT = tMin + ((cx - padL) / gw) * (tMax - tMin);
    });
  }
}

// ═══════════════════════════════════════════════════════
// HILFSFUNKTIONEN
// ═══════════════════════════════════════════════════════

function _slider(id) { return +(document.getElementById(id)?.value ?? 0); }
function _label(id, val, unit = '') {
  const el = document.getElementById(id);
  if (el) el.textContent = typeof val === 'number' ? val.toFixed(unit === 'm/s²' || unit === 'm/s' ? 2 : 1) + (unit ? ' ' + unit : '') : val;
}

function _simModalHTML(id, title, controls, wide = false) {
  return `<div class="sim-box ${wide ? 'sim-box-wide' : ''}">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">${title}</h3>
    <div class="phys-layout">
      <canvas id="physAnim" width="420" height="240" class="phys-anim-cv"></canvas>
      <canvas id="physChart" width="420" height="240" class="phys-chart-cv"></canvas>
    </div>
    <div class="phys-controls">${controls}</div>
    <div class="phys-hint">💡 Klicke auf das Diagramm um die Steigung (Tangente) anzuzeigen</div>
  </div>`;
}

function _slider_html(id, label, min, max, val, step = 1, unit = '') {
  return `<div class="phys-ctrl">
    <span class="phys-ctrl-label">${label}: <b id="${id}Lbl">${val}${unit ? ' ' + unit : ''}</b></span>
    <input type="range" id="${id}" min="${min}" max="${max}" value="${val}" step="${step}"
      oninput="document.getElementById('${id}Lbl').textContent=this.value+'${unit ? ' ' + unit : ''}'"
      style="width:100%;accent-color:#7c3aed">
  </div>`;
}

// ═══════════════════════════════════════════════════════
// GLOBALE VARIABLE & MODAL-VERWALTUNG
// ═══════════════════════════════════════════════════════

let _pSim = null;

function closePhysicsSim() {
  if (_pSim) { _pSim.stop(); _pSim = null; }
  document.getElementById('physModal')?.remove();
}

function openPhysicsSim(simId) {
  closePhysicsSim();
  const modal = document.createElement('div');
  modal.id = 'physModal';
  modal.className = 'sim-overlay';
  document.body.appendChild(modal);

  const fn = _physSimDefs[simId];
  if (fn) fn(modal);
  else modal.innerHTML = `<div class="sim-box"><button class="sim-x" onclick="closePhysicsSim()">✕</button><p>Simulation "${simId}" wird vorbereitet…</p></div>`;
}

// ═══════════════════════════════════════════════════════
// SIMULATIONS-DEFINITIONEN
// ═══════════════════════════════════════════════════════

const _physSimDefs = {

  // ── 1. GLEICHFÖRMIGE BEWEGUNG ──────────────────────────
  'gleichfoermig': modal => {
    modal.innerHTML = _simModalHTML('gleichfoermig', '🚗 Gleichförmige Bewegung – s = v · t',
      _slider_html('gfV', 'Geschwindigkeit v', 5, 40, 20, 1, 'm/s'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('s'); _pSim.addSeries('v');
    let s = 0;
    _pSim.start(
      dt => { const v = _slider('gfV'); s += v * dt; _pSim.record('s', s); _pSim.record('v', v); },
      (ctx, cv) => {
        const v = _slider('gfV');
        ctx.clearRect(0, 0, cv.width, cv.height);
        _drawRoad(ctx, cv);
        const x = (s * 5) % (cv.width + 80) - 40;
        _drawCar(ctx, x, cv.height - 70, '#7c3aed');
        _infoBox(ctx, cv, [`s = ${s.toFixed(1)} m`, `v = ${v} m/s`, `t = ${_pSim.t.toFixed(1)} s`]);
      },
      [
        { series: 's', title: 's-t-Diagramm', label: 's', unit: 'm', color: '#7c3aed', yMin: 0 },
        { series: 'v', title: 'v-t-Diagramm', label: 'v', unit: 'm/s', color: '#f97316', yMin: 0, yMax: 45 }
      ]
    );
  },

  // ── 2. BESCHLEUNIGTE BEWEGUNG ──────────────────────────
  'beschleunigung': modal => {
    modal.innerHTML = _simModalHTML('beschleunigung', '🚀 Beschleunigte Bewegung – v = v₀ + a·t',
      _slider_html('baA', 'Beschleunigung a', 0, 10, 3, 0.5, 'm/s²') +
      _slider_html('baV0', 'Anfangsgeschwindigkeit v₀', 0, 20, 0, 1, 'm/s'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('s'); _pSim.addSeries('v'); _pSim.addSeries('a');
    let s = 0, v = 0;
    _pSim.start(
      dt => {
        const a = _slider('baA'), v0 = _slider('baV0');
        if (_pSim.t < 0.05) { s = 0; v = v0; }
        v += a * dt; s += v * dt;
        _pSim.record('s', s); _pSim.record('v', v); _pSim.record('a', a);
      },
      (ctx, cv) => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        _drawRoad(ctx, cv);
        const x = (s * 3) % (cv.width + 80) - 40;
        _drawCar(ctx, x, cv.height - 70, '#7c3aed');
        _infoBox(ctx, cv, [`s = ${s.toFixed(1)} m`, `v = ${v.toFixed(1)} m/s`, `a = ${_slider('baA')} m/s²`]);
      },
      [
        { series: 's', title: 's-t-Diagramm', label: 's', unit: 'm', color: '#7c3aed', yMin: 0 },
        { series: 'v', title: 'v-t-Diagramm', label: 'v', unit: 'm/s', color: '#f97316', yMin: 0 }
      ]
    );
  },

  // ── 3. FREIER FALL ─────────────────────────────────────
  'freierfall': modal => {
    modal.innerHTML = _simModalHTML('freierfall', '🎯 Freier Fall – s = ½·g·t²',
      _slider_html('ffH', 'Fallhöhe', 10, 100, 50, 5, 'm') +
      `<button onclick="_ffReset()" class="phys-btn">🔄 Neu starten</button>`, true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('s'); _pSim.addSeries('v');
    let y = 0, vy = 0, falling = true;
    window._ffReset = () => { y = 0; vy = 0; falling = true; _pSim.reset(); _pSim.addSeries('s'); _pSim.addSeries('v'); };
    _pSim.start(
      dt => {
        const H = _slider('ffH');
        if (falling && y < H) {
          vy += 9.81 * dt; y += vy * dt;
          if (y >= H) { y = H; falling = false; }
        }
        _pSim.record('s', y); _pSim.record('v', vy);
      },
      (ctx, cv) => {
        const H = _slider('ffH');
        ctx.clearRect(0, 0, cv.width, cv.height);
        // Himmel & Boden
        ctx.fillStyle = '#e0f2fe'; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#86efac'; ctx.fillRect(0, cv.height - 30, cv.width, 30);
        // Ball
        const by = 30 + (y / H) * (cv.height - 60);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(cv.width / 2, by, 14, 0, Math.PI * 2); ctx.fill();
        // Höhenmarkierung
        ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cv.width / 2 + 20, 30); ctx.lineTo(cv.width / 2 + 20, by); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#1f2937'; ctx.font = '12px sans-serif';
        ctx.fillText(`${(H - y).toFixed(1)} m`, cv.width / 2 + 24, (30 + by) / 2);
        _infoBox(ctx, cv, [`s = ${y.toFixed(2)} m`, `v = ${vy.toFixed(2)} m/s`, `t = ${_pSim.t.toFixed(2)} s`]);
      },
      [
        { series: 's', title: 's-t-Diagramm', label: 's', unit: 'm', color: '#7c3aed', yMin: 0 },
        { series: 'v', title: 'v-t-Diagramm', label: 'v', unit: 'm/s', color: '#ef4444', yMin: 0 }
      ]
    );
  },

  // ── 4. WURFBEWEGUNG ────────────────────────────────────
  'wurfbewegung': modal => {
    modal.innerHTML = _simModalHTML('wurfbewegung', '🏹 Schräger Wurf',
      _slider_html('wfAlpha', 'Winkel α', 10, 80, 45, 1, '°') +
      _slider_html('wfV0', 'v₀', 10, 60, 30, 1, 'm/s') +
      `<button onclick="_wfReset()" class="phys-btn">🔄 Neu</button>`, true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('sx'); _pSim.addSeries('sy'); _pSim.addSeries('v');
    const sc = 3; let bx = 0, by = 0, vx = 0, vy = 0, active = true, path = [];
    window._wfReset = () => {
      const a = _slider('wfAlpha') * Math.PI / 180, v0 = _slider('wfV0');
      bx = 20; by = 0; vx = v0 * Math.cos(a); vy = v0 * Math.sin(a); active = true; path = [];
      _pSim.reset(); _pSim.addSeries('sx'); _pSim.addSeries('sy'); _pSim.addSeries('v');
    };
    window._wfReset();
    _pSim.start(
      dt => {
        if (!active) return;
        vy -= 9.81 * dt; bx += vx * dt; by += vy * dt;
        if (by < 0) { by = 0; active = false; }
        _pSim.record('sx', bx); _pSim.record('sy', by);
        _pSim.record('v', Math.sqrt(vx * vx + vy * vy));
        path.push({ x: 20 + bx * sc, y: 200 - by * sc });
      },
      (ctx, cv) => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#e0f2fe'; ctx.fillRect(0, 0, cv.width, cv.height - 20);
        ctx.fillStyle = '#86efac'; ctx.fillRect(0, cv.height - 20, cv.width, 20);
        // Trajektorie
        if (path.length > 1) {
          ctx.strokeStyle = 'rgba(124,58,237,0.4)'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
          ctx.beginPath(); path.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
          ctx.stroke(); ctx.setLineDash([]);
        }
        const px = 20 + bx * sc, py = cv.height - 20 - by * sc;
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill();
        _infoBox(ctx, cv, [`x=${bx.toFixed(1)}m`, `y=${by.toFixed(1)}m`, `v=${Math.sqrt(vx*vx+vy*vy).toFixed(1)}m/s`]);
      },
      [
        { series: 'sy', title: 'Höhe y über Zeit', label: 'y', unit: 'm', color: '#7c3aed', yMin: 0 },
        { series: 'v',  title: 'Geschwindigkeit', label: 'v', unit: 'm/s', color: '#ef4444', yMin: 0 }
      ]
    );
  },

  // ── 5. NEWTON 2: F = m·a ───────────────────────────────
  'newton2': modal => {
    modal.innerHTML = _simModalHTML('newton2', '⚡ Newtons 2. Gesetz: F = m · a',
      _slider_html('n2F', 'Kraft F', 10, 200, 50, 5, 'N') +
      _slider_html('n2M', 'Masse m', 1, 20, 5, 1, 'kg'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('v'); _pSim.addSeries('a');
    let v = 0, x = 0;
    _pSim.start(
      dt => {
        const F = _slider('n2F'), m = _slider('n2M'), a = F / m;
        v += a * dt; x += v * dt;
        _pSim.record('v', v); _pSim.record('a', a);
      },
      (ctx, cv) => {
        const F = _slider('n2F'), m = _slider('n2M'), a = (F / m).toFixed(1);
        ctx.clearRect(0, 0, cv.width, cv.height);
        _drawRoad(ctx, cv);
        const px = (x * 2) % (cv.width + 80) - 40;
        _drawCar(ctx, px, cv.height - 70, '#f97316');
        // Kraftpfeil
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
        const flen = Math.min(100, F / 2);
        ctx.beginPath(); ctx.moveTo(px + 65, cv.height - 45);
        ctx.lineTo(px + 65 + flen, cv.height - 45); ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.font = '700 12px sans-serif';
        ctx.fillText(`F=${F}N`, px + 65, cv.height - 50);
        _infoBox(ctx, cv, [`F=${F}N`, `m=${m}kg`, `a=${a}m/s²`, `v=${v.toFixed(1)}m/s`]);
      },
      [
        { series: 'v', title: 'v-t-Diagramm (Steigung = a)', label: 'v', unit: 'm/s', color: '#f97316', yMin: 0 },
        { series: 'a', title: 'a-t-Diagramm', label: 'a', unit: 'm/s²', color: '#7c3aed', yMin: 0 }
      ]
    );
  },

  // ── 6. REIBUNG ─────────────────────────────────────────
  'reibung': modal => {
    modal.innerHTML = _simModalHTML('reibung', '🧱 Reibungskräfte',
      _slider_html('rbMu', 'Reibungskoeffizient μ', 0, 100, 30, 5, '×0.01') +
      _slider_html('rbF', 'Antriebskraft F', 0, 200, 80, 5, 'N') +
      _slider_html('rbM', 'Masse m', 1, 20, 5, 1, 'kg'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('v'); _pSim.addSeries('fr');
    let v = 0, x = 0;
    _pSim.start(
      dt => {
        const mu = _slider('rbMu') / 100, F = _slider('rbF'), m = _slider('rbM');
        const fr = mu * m * 9.81;
        const a  = (F - fr) / m;
        v = Math.max(0, v + a * dt); x += v * dt;
        _pSim.record('v', v); _pSim.record('fr', fr);
      },
      (ctx, cv) => {
        const mu = _slider('rbMu') / 100, F = _slider('rbF'), m = _slider('rbM');
        const fr = (mu * m * 9.81).toFixed(1);
        ctx.clearRect(0, 0, cv.width, cv.height);
        _drawRoad(ctx, cv);
        const px = (x * 2) % (cv.width + 80) - 40;
        _drawCar(ctx, px, cv.height - 70, '#7c3aed');
        // Kraftpfeile
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(px + 60, cv.height - 45); ctx.lineTo(px + 60 + Math.min(80, F/2), cv.height - 45); ctx.stroke();
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath(); ctx.moveTo(px + 10, cv.height - 45); ctx.lineTo(Math.max(px - 20, px + 10 - +fr), cv.height - 45); ctx.stroke();
        _infoBox(ctx, cv, [`F=${F}N`, `F_R=${fr}N`, `μ=${mu.toFixed(2)}`, `v=${v.toFixed(1)}m/s`]);
      },
      [
        { series: 'v',  title: 'v-t-Diagramm', label: 'v', unit: 'm/s', color: '#7c3aed', yMin: 0 },
        { series: 'fr', title: 'Reibungskraft F_R', label: 'F_R', unit: 'N', color: '#ef4444', yMin: 0 }
      ]
    );
  },

  // ── 7. ENERGIEERHALTUNG ────────────────────────────────
  'energieerhaltung': modal => {
    modal.innerHTML = _simModalHTML('energieerhaltung', '⚡ Energieerhaltung – Rampe',
      _slider_html('eeH', 'Höhe h', 5, 40, 20, 1, 'm') +
      _slider_html('eeM', 'Masse m', 1, 10, 2, 1, 'kg'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('Epot'); _pSim.addSeries('Ekin');
    let y = 0, vy = 0, phase = 'fall'; // fall → bounce
    _pSim.start(
      dt => {
        const H = _slider('eeH'), m = _slider('eeM');
        if (phase === 'fall') {
          vy += 9.81 * dt; y += vy * dt;
          if (y >= H) { y = H; vy = -vy * 0.85; phase = 'rise'; }
        } else {
          vy += 9.81 * dt; y += vy * dt;
          if (y <= 0) { y = 0; vy = -Math.abs(vy) * 0.85; if (Math.abs(vy) < 0.5) phase = 'fall'; }
          if (y >= H) { y = H; vy = -Math.abs(vy) * 0.85; }
        }
        const Epot = m * 9.81 * (H - y);
        const Ekin = 0.5 * m * vy * vy;
        _pSim.record('Epot', Epot); _pSim.record('Ekin', Ekin);
      },
      (ctx, cv) => {
        const H = _slider('eeH'), m = _slider('eeM');
        const Epot = (m * 9.81 * (H - y)).toFixed(1);
        const Ekin = (0.5 * m * vy * vy).toFixed(1);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#e0f2fe'; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#86efac'; ctx.fillRect(0, cv.height - 20, cv.width, 20);
        // Rampe
        ctx.fillStyle = '#d1fae5'; ctx.strokeStyle = '#059669'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(50, cv.height - 20); ctx.lineTo(50, 30); ctx.lineTo(150, cv.height - 20); ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Ball auf Rampe
        const px = 50, py = 30 + (y / H) * (cv.height - 50);
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(100, py, 12, 0, Math.PI * 2); ctx.fill();
        // Energiebalken
        const barW = 80, barH = cv.height - 60;
        const maxE = m * 9.81 * H;
        ctx.fillStyle = '#e5e7eb'; ctx.fillRect(cv.width - 180, 20, barW, barH);
        ctx.fillStyle = '#7c3aed'; ctx.fillRect(cv.width - 180, 20 + barH * (1 - +Epot / maxE), barW, barH * +Epot / maxE);
        ctx.fillStyle = '#e5e7eb'; ctx.fillRect(cv.width - 90, 20, barW, barH);
        ctx.fillStyle = '#f97316'; ctx.fillRect(cv.width - 90, 20 + barH * (1 - +Ekin / maxE), barW, barH * +Ekin / maxE);
        ctx.fillStyle = '#1f2937'; ctx.font = '700 11px sans-serif';
        ctx.fillText('E_pot', cv.width - 178, barH + 35);
        ctx.fillText('E_kin', cv.width - 88, barH + 35);
        _infoBox(ctx, cv, [`E_pot=${Epot}J`, `E_kin=${Ekin}J`]);
      },
      [
        { series: 'Epot', title: 'Potentielle Energie', label: 'E_pot', unit: 'J', color: '#7c3aed', yMin: 0 },
        { series: 'Ekin', title: 'Kinetische Energie',  label: 'E_kin', unit: 'J', color: '#f97316', yMin: 0 }
      ]
    );
  },

  // ── 8. IMPULS ──────────────────────────────────────────
  'impuls': modal => {
    modal.innerHTML = _simModalHTML('impuls', '💥 Impuls & Stoß – p = m · v',
      _slider_html('impM1', 'Masse 1 (kg)', 1, 10, 3, 1, 'kg') +
      _slider_html('impM2', 'Masse 2 (kg)', 1, 10, 5, 1, 'kg') +
      `<button onclick="_impReset()" class="phys-btn">🔄 Stoß auslösen</button>`, true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('p1'); _pSim.addSeries('p2'); _pSim.addSeries('pges');
    let x1 = 80, x2 = 300, v1 = 60, v2 = 0, collided = false;
    window._impReset = () => { x1 = 80; x2 = 300; v1 = 60; v2 = 0; collided = false; _pSim.reset(); _pSim.addSeries('p1'); _pSim.addSeries('p2'); _pSim.addSeries('pges'); };
    _pSim.start(
      dt => {
        const m1 = _slider('impM1'), m2 = _slider('impM2');
        x1 += v1 * dt; x2 += v2 * dt;
        if (!collided && x1 + 20 >= x2 - 20) {
          collided = true;
          const nv1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
          const nv2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
          v1 = nv1; v2 = nv2;
        }
        _pSim.record('p1', m1 * Math.abs(v1));
        _pSim.record('p2', m2 * Math.abs(v2));
        _pSim.record('pges', m1 * v1 + m2 * v2);
      },
      (ctx, cv) => {
        const m1 = _slider('impM1'), m2 = _slider('impM2');
        ctx.clearRect(0, 0, cv.width, cv.height);
        _drawRoad(ctx, cv);
        const r1 = 12 + m1 * 2, r2 = 12 + m2 * 2;
        ctx.fillStyle = '#7c3aed'; ctx.beginPath(); ctx.arc(x1, cv.height / 2, r1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(x2, cv.height / 2, r2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(`m${m1}`, x1, cv.height / 2 + 4); ctx.fillText(`m${m2}`, x2, cv.height / 2 + 4);
        ctx.textAlign = 'left';
        _infoBox(ctx, cv, [`p₁=${(m1*v1).toFixed(1)}`, `p₂=${(m2*v2).toFixed(1)}`, `p_ges=${(m1*v1+m2*v2).toFixed(1)}`]);
      },
      [
        { series: 'p1',   title: 'Impuls Ball 1',   label: 'p₁',   unit: 'kg·m/s', color: '#7c3aed' },
        { series: 'pges', title: 'Gesamtimpuls',     label: 'p_ges', unit: 'kg·m/s', color: '#059669' }
      ]
    );
  },

  // ── 9. FADENPENDEL ─────────────────────────────────────
  'fadenpendel': modal => {
    modal.innerHTML = _simModalHTML('fadenpendel', '🕰️ Fadenpendel – T = 2π√(L/g)',
      _slider_html('fpL', 'Fadenlänge L', 20, 150, 80, 5, 'cm') +
      _slider_html('fpA0', 'Amplitude', 5, 45, 20, 1, '°'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('phi'); _pSim.addSeries('omega');
    let phi = 0, omega = 0, init = true;
    _pSim.start(
      dt => {
        const L = _slider('fpL') / 100, A0 = _slider('fpA0') * Math.PI / 180;
        if (init) { phi = A0; omega = 0; init = false; }
        const alpha = -(9.81 / L) * Math.sin(phi);
        omega += alpha * dt; phi += omega * dt;
        _pSim.record('phi', phi * 180 / Math.PI);
        _pSim.record('omega', omega);
      },
      (ctx, cv) => {
        const L = _slider('fpL') / 100;
        const T = (2 * Math.PI * Math.sqrt(L / 9.81)).toFixed(2);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#e0f2fe'; ctx.fillRect(0, 0, cv.width, cv.height);
        const px0 = cv.width / 2, py0 = 20;
        const scale = 140 / L;
        const bx = px0 + Math.sin(phi) * L * scale;
        const by = py0 + Math.cos(phi) * L * scale;
        // Faden
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(bx, by); ctx.stroke();
        // Befestigung
        ctx.fillStyle = '#475569'; ctx.fillRect(px0 - 15, py0 - 8, 30, 8);
        // Ball
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1f2937'; ctx.font = '700 12px sans-serif';
        ctx.fillText(`L=${(L*100).toFixed(0)}cm  T=${T}s`, 10, cv.height - 10);
        _infoBox(ctx, cv, [`φ = ${(phi*180/Math.PI).toFixed(1)}°`, `T = ${T} s`]);
      },
      [
        { series: 'phi',   title: 'Auslenkung φ(t)',     label: 'φ', unit: '°',     color: '#7c3aed' },
        { series: 'omega', title: 'Winkelgeschwindigkeit', label: 'ω', unit: 'rad/s', color: '#f97316' }
      ]
    );
  },

  // ── 10. HARMONISCHE WELLEN ─────────────────────────────
  'wellen': modal => {
    modal.innerHTML = _simModalHTML('wellen', '〰️ Harmonische Wellen',
      _slider_html('wlF', 'Frequenz f', 1, 8, 2, 0.5, 'Hz') +
      _slider_html('wlA', 'Amplitude A', 10, 60, 40, 5, 'px') +
      _slider_html('wlC', 'Wellengeschwindigkeit c', 50, 300, 150, 10, 'px/s'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('y0'); _pSim.addSeries('y1');
    _pSim.start(
      dt => {
        const f = _slider('wlF'), A = _slider('wlA');
        _pSim.record('y0', A * Math.sin(2 * Math.PI * f * _pSim.t));
        _pSim.record('y1', A * Math.sin(2 * Math.PI * f * _pSim.t - Math.PI / 2));
      },
      (ctx, cv) => {
        const f = _slider('wlF'), A = _slider('wlA'), c = _slider('wlC');
        const lambda = c / f;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#e0f2fe'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cy = cv.height / 2;
        // Mittellinie
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy); ctx.stroke();
        // Welle
        ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x <= cv.width; x += 2) {
          const y = cy - A * Math.sin(2 * Math.PI * (x / lambda - f * _pSim.t));
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        // Einzelner Punkt
        const py = cy - A * Math.sin(2 * Math.PI * f * _pSim.t);
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(cv.width / 2, py, 8, 0, Math.PI * 2); ctx.fill();
        _infoBox(ctx, cv, [`f=${f}Hz`, `λ=${lambda.toFixed(0)}px`, `A=${A}px`]);
      },
      [
        { series: 'y0', title: 'Auslenkung Punkt (x=0)', label: 'y', unit: 'px', color: '#7c3aed' },
        { series: 'y1', title: 'Auslenkung Punkt (x=λ/4)', label: 'y', unit: 'px', color: '#f97316' }
      ]
    );
  },

  // ── 11. OHMSCHES GESETZ ────────────────────────────────
  'ohmsches-gesetz': modal => {
    modal.innerHTML = _simModalHTML('ohmsches-gesetz', '🔌 Ohmsches Gesetz – U = R · I',
      _slider_html('ohR', 'Widerstand R', 10, 500, 100, 10, 'Ω') +
      _slider_html('ohU', 'Spannung U', 1, 50, 12, 1, 'V'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('I'); _pSim.addSeries('P');
    _pSim.start(
      dt => {
        const R = _slider('ohR'), U = _slider('ohU');
        _pSim.record('I', U / R);
        _pSim.record('P', U * U / R);
      },
      (ctx, cv) => {
        const R = _slider('ohR'), U = _slider('ohU');
        const I = (U / R * 1000).toFixed(1), P = (U * U / R).toFixed(2);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#fefce8'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Schaltkreis
        const mx = cv.width / 2, my = cv.height / 2;
        ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(mx - 120, my - 60); ctx.lineTo(mx + 120, my - 60);
        ctx.lineTo(mx + 120, my + 60); ctx.lineTo(mx - 120, my + 60);
        ctx.lineTo(mx - 120, my - 60); ctx.stroke();
        // Batterie
        ctx.strokeStyle = '#f97316'; ctx.lineWidth = 4;
        for (let d of [-8, 0, 8]) { ctx.beginPath(); ctx.moveTo(mx - 120, my + d); ctx.lineTo(mx - 100, my + d); ctx.stroke(); }
        ctx.fillStyle = '#f97316'; ctx.font = '700 14px sans-serif'; ctx.fillText(`${U}V`, mx - 115, my - 10);
        // Widerstand
        ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 3;
        ctx.strokeRect(mx - 30, my - 70, 60, 20);
        ctx.fillStyle = '#7c3aed'; ctx.font = '700 13px sans-serif'; ctx.fillText(`${R}Ω`, mx - 20, my - 56);
        // Strompfeile
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
        for (let ax of [mx - 60, mx + 30]) {
          ctx.beginPath(); ctx.moveTo(ax, my - 60); ctx.lineTo(ax + 20, my - 60); ctx.stroke();
        }
        _infoBox(ctx, cv, [`U=${U}V`, `R=${R}Ω`, `I=${I}mA`, `P=${P}W`]);
      },
      [
        { series: 'I', title: 'Stromstärke I (bei var. R)', label: 'I', unit: 'A', color: '#10b981', yMin: 0 },
        { series: 'P', title: 'Leistung P = U²/R', label: 'P', unit: 'W', color: '#f97316', yMin: 0 }
      ]
    );
  },

  // ── 12. KONDENSATOR ────────────────────────────────────
  'kondensator': modal => {
    modal.innerHTML = _simModalHTML('kondensator', '🔋 Kondensator laden & entladen',
      _slider_html('kcC', 'Kapazität C', 100, 1000, 500, 50, 'µF') +
      _slider_html('kcR', 'Widerstand R', 100, 2000, 500, 100, 'Ω') +
      `<button onclick="_kcToggle()" class="phys-btn" id="kcBtn">▶ Laden starten</button>`, true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('Uc'); _pSim.addSeries('Ic');
    let Uc = 0, charging = false, U0 = 12;
    window._kcToggle = () => { charging = !charging; document.getElementById('kcBtn').textContent = charging ? '⏸ Pause' : '▶ Weiter'; };
    _pSim.start(
      dt => {
        if (!charging) return;
        const C = _slider('kcC') / 1e6, R = _slider('kcR');
        const tau = R * C;
        const Ic = (U0 - Uc) / R;
        Uc += Ic / C * dt;
        if (Uc >= U0 - 0.01) Uc = U0;
        _pSim.record('Uc', Uc);
        _pSim.record('Ic', Math.abs((U0 - Uc) / R) * 1000);
      },
      (ctx, cv) => {
        const tau = (_slider('kcR') * _slider('kcC') / 1e6).toFixed(2);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#fefce8'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Kondensator-Symbol
        const mx = cv.width / 2;
        ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(mx - 20, 40); ctx.lineTo(mx - 20, 120); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx + 20, 40); ctx.lineTo(mx + 20, 120); ctx.stroke();
        // Ladezustand
        const h = 80 * (Uc / U0);
        ctx.fillStyle = 'rgba(124,58,237,0.3)';
        ctx.fillRect(mx - 18, 120 - h, 38, h);
        ctx.fillStyle = '#1f2937'; ctx.font = '700 13px sans-serif';
        ctx.fillText(`U_C = ${Uc.toFixed(2)} V`, mx - 50, 145);
        ctx.fillText(`τ = ${tau} s`, mx - 30, 165);
        _infoBox(ctx, cv, [`U₀=${U0}V`, `U_C=${Uc.toFixed(2)}V`, `τ=${tau}s`]);
      },
      [
        { series: 'Uc', title: 'Kondensatorspannung U_C(t)', label: 'U_C', unit: 'V', color: '#7c3aed', yMin: 0, yMax: 13 },
        { series: 'Ic', title: 'Ladestrom I_C(t)',           label: 'I_C', unit: 'mA', color: '#f97316', yMin: 0 }
      ]
    );
  },

  // ── 13. SCHWINGUNG ─────────────────────────────────────
  'schwingung': modal => {
    modal.innerHTML = _simModalHTML('schwingung', '〰️ Harmonische Schwingung',
      _slider_html('shA', 'Amplitude A', 10, 80, 50, 5, 'px') +
      _slider_html('shF', 'Frequenz f', 1, 6, 2, 0.5, 'Hz'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('y'); _pSim.addSeries('vy');
    _pSim.start(
      dt => {
        const A = _slider('shA'), f = _slider('shF');
        const y  =  A * Math.sin(2 * Math.PI * f * _pSim.t);
        const vy = A * 2 * Math.PI * f * Math.cos(2 * Math.PI * f * _pSim.t);
        _pSim.record('y', y); _pSim.record('vy', vy);
      },
      (ctx, cv) => {
        const A = _slider('shA'), f = _slider('shF');
        const y = A * Math.sin(2 * Math.PI * f * _pSim.t);
        const T = (1 / f).toFixed(2);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#e0f2fe'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cy = cv.height / 2;
        // Gleichgewichtslinie
        ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy); ctx.stroke(); ctx.setLineDash([]);
        // Pendelaufhängung & Faden
        const bx = cv.width / 2 + y, by = cy;
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cv.width / 2, 20); ctx.lineTo(bx, by); ctx.stroke();
        ctx.fillStyle = '#475569'; ctx.fillRect(cv.width / 2 - 20, 10, 40, 10);
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.fill();
        // Amplitudenmarkierungen
        ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(cv.width / 2 + A, cy - 30); ctx.lineTo(cv.width / 2 + A, cy + 30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cv.width / 2 - A, cy - 30); ctx.lineTo(cv.width / 2 - A, cy + 30); ctx.stroke();
        ctx.setLineDash([]);
        _infoBox(ctx, cv, [`y = ${y.toFixed(1)} px`, `f = ${f} Hz`, `T = ${T} s`]);
      },
      [
        { series: 'y',  title: 'Auslenkung y(t)',        label: 'y',  unit: 'px',    color: '#7c3aed' },
        { series: 'vy', title: 'Geschwindigkeit vy(t)', label: 'vy', unit: 'px/s',  color: '#f97316' }
      ]
    );
  },

  // ── 14. ELEKTRISCHES FELD ──────────────────────────────
  'efeld': modal => {
    modal.innerHTML = _simModalHTML('efeld', '⚡ Elektrisches Feld – Feldlinien & Probeladung',
      _slider_html('efU', 'Spannung U', 10, 300, 100, 10, 'V') +
      _slider_html('efD', 'Plattenabstand d', 5, 30, 15, 1, 'cm') +
      `<div class="phys-hint">Klicke auf die Animation um eine Probeladung (+) zu platzieren</div>`, true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('F'); _pSim.addSeries('E');
    let probe = null, probeY = 0, probeVY = 0;
    _pSim.start(
      dt => {
        const U = _slider('efU'), d = _slider('efD') / 100;
        const E = U / d;
        if (probe) {
          probeVY += (E * 1.6e-19 / 9.11e-31) * dt * 1e-12;
          probeY  += probeVY * dt * 1e6;
        }
        _pSim.record('E', E); _pSim.record('F', E * 1e-10);
      },
      (ctx, cv) => {
        const U = _slider('efU'), d = _slider('efD');
        const E = (U / (d / 100)).toFixed(0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#fefce8'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Platten
        ctx.fillStyle = '#f97316'; ctx.fillRect(30, 20, 10, cv.height - 40);
        ctx.fillStyle = '#3b82f6'; ctx.fillRect(cv.width - 40, 20, 10, cv.height - 40);
        // +/- Symbole
        ctx.fillStyle = '#f97316'; ctx.font = '700 16px sans-serif';
        for (let y = 40; y < cv.height - 30; y += 30) ctx.fillText('+', 10, y);
        ctx.fillStyle = '#3b82f6';
        for (let y = 40; y < cv.height - 30; y += 30) ctx.fillText('−', cv.width - 20, y);
        // Feldlinien
        const n = 6;
        ctx.strokeStyle = `rgba(124,58,237,${Math.min(1, U / 150)})`;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < n; i++) {
          const ly = 30 + i * (cv.height - 60) / (n - 1);
          ctx.beginPath(); ctx.moveTo(40, ly); ctx.lineTo(cv.width - 40, ly); ctx.stroke();
          // Pfeilspitze
          ctx.beginPath(); ctx.moveTo(cv.width - 60, ly - 6); ctx.lineTo(cv.width - 40, ly); ctx.lineTo(cv.width - 60, ly + 6); ctx.stroke();
        }
        // Probeladung
        if (probe) {
          const py = Math.max(20, Math.min(cv.height - 20, probe.y + probeY));
          ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(probe.x, py, 10, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('+', probe.x, py + 4); ctx.textAlign = 'left';
          // Kraft-Pfeil
          ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(probe.x, py); ctx.lineTo(Math.min(cv.width - 45, probe.x + U / 5), py); ctx.stroke();
        }
        _infoBox(ctx, cv, [`U=${U}V`, `E=${E}V/m`, `d=${d}cm`]);
      },
      [
        { series: 'E', title: 'Elektrische Feldstärke E', label: 'E', unit: 'V/m', color: '#7c3aed', yMin: 0 },
        { series: 'F', title: 'Kraft auf Probeladung', label: 'F×10¹⁰', unit: 'N', color: '#f97316', yMin: 0 }
      ]
    );
    document.getElementById('physAnim').addEventListener('click', e => {
      const r = document.getElementById('physAnim').getBoundingClientRect();
      probe = { x: (e.clientX - r.left) * (420 / r.width), y: (e.clientY - r.top) * (240 / r.height) };
      probeY = 0; probeVY = 0;
    });
  },

  // ── 15. MAGNETISCHES FELD ──────────────────────────────
  'bfeld': modal => {
    modal.innerHTML = _simModalHTML('bfeld', '🧲 Magnetisches Feld – stromdurchflossener Leiter',
      _slider_html('bfI', 'Stromstärke I', 1, 30, 10, 1, 'A'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('B');
    _pSim.start(
      dt => { _pSim.record('B', 4e-7 * Math.PI * _slider('bfI') / (2 * Math.PI * 0.05) * 1e6); },
      (ctx, cv) => {
        const I = _slider('bfI');
        const mu0 = 4e-7 * Math.PI;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#f0fdf4'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cx = cv.width / 2, cy = cv.height / 2;
        // Leiter
        ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
        // Feldlinien (konzentrische Kreise)
        for (let r = 25; r <= 110; r += 20) {
          const B = (mu0 * I / (2 * Math.PI * r / 1000) * 1e6).toFixed(1);
          const alpha = Math.min(0.9, I / 30 * 0.8 + 0.1);
          ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
          // Pfeilspitze oben
          ctx.beginPath(); ctx.moveTo(cx - 8, cy - r); ctx.lineTo(cx, cy - r + 10); ctx.lineTo(cx + 8, cy - r); ctx.stroke();
          ctx.fillStyle = '#374151'; ctx.font = '10px sans-serif';
          ctx.fillText(`${B}µT`, cx + r + 2, cy);
        }
        ctx.fillStyle = '#1f2937'; ctx.font = '700 12px sans-serif';
        ctx.fillText(`I = ${I} A`, 10, 20);
        ctx.fillText('B = µ₀·I / (2π·r)', 10, 38);
      },
      [{ series: 'B', title: 'B-Feld bei r=5cm', label: 'B', unit: 'µT', color: '#7c3aed', yMin: 0 }]
    );
  },

  // ── 16. KREISBEWEGUNG ──────────────────────────────────
  'kreisbewegung': modal => {
    modal.innerHTML = _simModalHTML('kreisbewegung', '⭕ Kreisbewegung',
      _slider_html('krOmega', 'ω (Winkelgeschwindigkeit)', 1, 10, 3, 0.5, 'rad/s') +
      _slider_html('krR', 'Radius r', 40, 100, 70, 5, 'px'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('phi'); _pSim.addSeries('v');
    let angle = 0;
    _pSim.start(
      dt => {
        const omega = _slider('krOmega'), r = _slider('krR');
        angle += omega * dt;
        _pSim.record('phi', angle % (2 * Math.PI) * 180 / Math.PI);
        _pSim.record('v', omega * r);
      },
      (ctx, cv) => {
        const omega = _slider('krOmega'), r = _slider('krR');
        const v = (omega * r / 10).toFixed(1);
        const fz = (5 * omega * omega * r / 10).toFixed(1); // m=5kg
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#f0fdf4'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cx = 180, cy = cv.height / 2;
        // Kreis
        ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#7c3aed'; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
        // Ball & Faden
        const bx = cx + r * Math.cos(angle), by = cy + r * Math.sin(angle);
        ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.fill();
        // Geschwindigkeitspfeil (tangential)
        const tvx = -Math.sin(angle) * 40, tvy = Math.cos(angle) * 40;
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + tvx, by + tvy); ctx.stroke();
        // Zentripetalpfeil
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
        const len = 35, dx = cx - bx, dy = cy - by, dl = Math.sqrt(dx * dx + dy * dy);
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + dx / dl * len, by + dy / dl * len); ctx.stroke();
        // Legende
        ctx.fillStyle = '#10b981'; ctx.font = '700 11px sans-serif'; ctx.fillText('v (tangential)', cv.width - 130, 20);
        ctx.fillStyle = '#ef4444'; ctx.fillText('F_z (Zentripetal)', cv.width - 130, 36);
        _infoBox(ctx, cv, [`ω=${omega}rad/s`, `v≈${v}`, `F_z≈${fz}N`]);
      },
      [
        { series: 'phi', title: 'Winkel φ(t)', label: 'φ', unit: '°',    color: '#7c3aed' },
        { series: 'v',   title: 'Bahngeschwindigkeit v', label: 'v', unit: 'px/s', color: '#f97316', yMin: 0 }
      ]
    );
  },

  // ── 17. KEPLER / PLANETENBEWEGUNG ──────────────────────
  'kepler': modal => {
    modal.innerHTML = _simModalHTML('kepler', '🪐 Keplersche Gesetze – Planetenbewegung',
      _slider_html('kpA', 'Große Halbachse a', 50, 150, 100, 5, 'px') +
      _slider_html('kpE', 'Exzentrizität e', 0, 80, 40, 5, '×0.01'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('r'); _pSim.addSeries('v');
    let theta = 0;
    _pSim.start(
      dt => {
        const a = _slider('kpA'), e = _slider('kpE') / 100;
        const b = a * Math.sqrt(1 - e * e);
        // Vereinfachte Ellipsenbewegung
        const r = a * (1 - e * e) / (1 + e * Math.cos(theta));
        theta += 0.4 * dt * (a * a * Math.sqrt(1 - e * e)) / (r * r);
        const v = 50 / r; // vereinfacht: v ∝ 1/r (Flächensatz)
        _pSim.record('r', r); _pSim.record('v', v);
      },
      (ctx, cv) => {
        const a = _slider('kpA'), e = _slider('kpE') / 100;
        const b = a * Math.sqrt(1 - e * e);
        const cx = cv.width / 2 + a * e, cy = cv.height / 2;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Sterne im Hintergrund
        for (let i = 0; i < 40; i++) {
          ctx.fillStyle = `rgba(255,255,255,${Math.random() > 0.98 ? 0.9 : 0.3})`;
          ctx.fillRect((i * 47 + 13) % cv.width, (i * 31 + 7) % cv.height, 1.5, 1.5);
        }
        // Ellipse
        ctx.strokeStyle = 'rgba(148,163,184,0.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(cv.width / 2, cy, a, b, 0, 0, Math.PI * 2); ctx.stroke();
        // Sonne (Brennpunkt)
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 20; ctx.shadowColor = '#fbbf24'; ctx.fill(); ctx.shadowBlur = 0;
        // Planet
        const r = a * (1 - e * e) / (1 + e * Math.cos(theta));
        const px = cv.width / 2 + r * Math.cos(theta) * (a / 100);
        const py = cy - r * Math.sin(theta) * (b / 100);
        ctx.fillStyle = '#60a5fa'; ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill();
        // Verbindungslinie
        ctx.strokeStyle = 'rgba(96,165,250,0.3)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
      },
      [
        { series: 'r', title: 'Abstand r (2. Keplersches Gesetz)', label: 'r', unit: 'px', color: '#60a5fa', yMin: 0 },
        { series: 'v', title: 'Bahngeschwindigkeit v',              label: 'v', unit: '',   color: '#fbbf24', yMin: 0 }
      ]
    );
  },

  // ── 19. TRÄGHEIT – NEWTON 1. GESETZ ────────────────────
  'traegheit': modal => {
    modal.innerHTML = _simModalHTML('traegheit', '🏎️ Trägheitsgesetz – Newton 1. Gesetz',
      _slider_html('tgV', 'Anfangsgeschwindigkeit v₀', 5, 40, 20, 1, 'm/s') +
      _slider_html('tgF', 'Externe Kraft F', -10, 20, 0, 1, 'N'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('v'); _pSim.addSeries('s');
    let x = 0;
    _pSim.start(
      dt => {
        const v0 = _slider('tgV'), F = _slider('tgF'), m = 5;
        const v = Math.max(0, v0 + (F / m) * _pSim.t);
        x += v * dt;
        _pSim.record('v', v); _pSim.record('s', x);
      },
      (ctx, cv) => {
        const v0 = _slider('tgV'), F = _slider('tgF'), m = 5;
        const v = Math.max(0, v0 + (F / m) * _pSim.t);
        ctx.clearRect(0, 0, cv.width, cv.height);
        _drawRoad(ctx, cv);
        const carX = (x * 2) % (cv.width + 80) - 40;
        const col = F === 0 ? '#10b981' : (F > 0 ? '#7c3aed' : '#ef4444');
        _drawCar(ctx, carX, cv.height - 70, col);
        const lbl = F === 0 ? 'F = 0 → v bleibt konstant! (Trägheit)' : (F > 0 ? 'F > 0 → Beschleunigung!' : 'F < 0 → Verzögerung!');
        ctx.fillStyle = col; ctx.font = '700 12px sans-serif'; ctx.fillText(lbl, 10, 22);
        _infoBox(ctx, cv, [`v₀=${v0}m/s`, `F=${F}N`, `v=${v.toFixed(1)}m/s`]);
      },
      [
        { series: 'v', title: 'v(t) – ohne Kraft: konstant!', label: 'v', unit: 'm/s', color: '#10b981', yMin: 0 },
        { series: 's', title: 's(t) – Weg', label: 's', unit: 'm', color: '#7c3aed', yMin: 0 }
      ]
    );
  },

  // ── 20. ROTATION & DREHIMPULS ───────────────────────────
  'rotation': modal => {
    modal.innerHTML = _simModalHTML('rotation', '🌀 Rotation & Drehimpuls L = J · ω',
      _slider_html('rotR', 'Armradius r', 20, 100, 80, 5, 'px') +
      _slider_html('rotM', 'Masse m', 1, 10, 5, 1, 'kg'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('omega'); _pSim.addSeries('L');
    let angle = 0;
    _pSim.start(
      dt => {
        const r = _slider('rotR'), m = _slider('rotM');
        const J = m * r * r / 1000; // Trägheitsmoment
        const L0 = 5 * 80 * 80 / 1000 * 2; // Konstantwert L₀
        const omega = L0 / J; // Drehimpulserhaltung
        angle += omega * dt;
        _pSim.record('omega', omega); _pSim.record('L', L0);
      },
      (ctx, cv) => {
        const r = _slider('rotR'), m = _slider('rotM');
        const J = m * r * r / 1000;
        const L0 = 5 * 80 * 80 / 1000 * 2;
        const omega = L0 / J;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cx = cv.width / 2, cy = cv.height / 2;
        // Körper
        ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.stroke();
        // Arm
        const bx = cx + r * Math.cos(angle), by = cy + r * Math.sin(angle);
        ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
        // Masse
        ctx.fillStyle = '#7c3aed'; ctx.beginPath(); ctx.arc(bx, by, 12, 0, Math.PI * 2); ctx.fill();
        // Labels
        ctx.fillStyle = '#1f2937'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`J = m·r² = ${J.toFixed(2)} kg·m²`, 10, 20);
        ctx.fillText(`L = const = ${L0.toFixed(2)} kg·m²/s`, 10, 36);
        _infoBox(ctx, cv, [`r=${r}px`, `ω=${omega.toFixed(2)}rad/s`, `J=${J.toFixed(2)}`]);
      },
      [
        { series: 'omega', title: 'ω(t) – kleines r → großes ω!', label: 'ω', unit: 'rad/s', color: '#7c3aed', yMin: 0 },
        { series: 'L',     title: 'L(t) – Drehimpuls = const', label: 'L', unit: 'kg·m²/s', color: '#10b981', yMin: 0 }
      ]
    );
  },

  // ── 21. RELATIVITÄTSTHEORIE ─────────────────────────────
  'relativitaet': modal => {
    modal.innerHTML = _simModalHTML('relativitaet', '🚀 Spezielle Relativitätstheorie – γ, Δt, L',
      _slider_html('relV', 'Geschwindigkeit v (% von c)', 1, 99, 50, 1, '% c'), false);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('gamma'); _pSim.addSeries('td');
    _pSim.start(
      dt => {
        const vc = _slider('relV') / 100;
        const gamma = 1 / Math.sqrt(1 - vc * vc);
        _pSim.record('gamma', gamma); _pSim.record('td', gamma);
      },
      (ctx, cv) => {
        const vc = _slider('relV') / 100;
        const gamma = 1 / Math.sqrt(1 - vc * vc);
        const L = Math.sqrt(1 - vc * vc); // Längenkontraktion
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Sterne
        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.fillRect((i * 53 + 11) % cv.width, (i * 37 + 5) % cv.height, 2, 2);
        }
        // Raumschiff (längenkontraktion)
        const sw = 120 * L, sh = 30;
        const sx = (cv.width - sw) / 2, sy = cv.height / 2 - sh / 2;
        ctx.fillStyle = '#6366f1'; ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(sx, sy, sw, sh, 5); else ctx.rect(sx, sy, sw, sh);
        ctx.fill();
        // Fensterlinie
        ctx.fillStyle = '#93c5fd';
        for (let i = 0; i < 3; i++) ctx.fillRect(sx + 15 + i * 25 * L, sy + 8, 12 * L, 14);
        // Infos
        ctx.fillStyle = '#fbbf24'; ctx.font = '700 12px sans-serif';
        ctx.fillText(`v = ${(_slider('relV'))}% c`, 10, 20);
        ctx.fillStyle = '#f87171'; ctx.fillText(`γ = ${gamma.toFixed(3)}  (Lorentz-Faktor)`, 10, 36);
        ctx.fillStyle = '#86efac'; ctx.fillText(`Δt = γ·Δt₀ → Zeit läuft ${gamma.toFixed(2)}× langsamer`, 10, 52);
        ctx.fillStyle = '#93c5fd'; ctx.fillText(`L = L₀/γ → Länge auf ${(L * 100).toFixed(1)}% verkürzt`, 10, 68);
      },
      [
        { series: 'gamma', title: 'γ vs. v (%) — explodiert bei v→c!', label: 'γ', unit: '', color: '#f87171', yMin: 1 },
        { series: 'td',    title: 'Zeitdilatation-Faktor (= γ)', label: 'Δt/Δt₀', unit: '', color: '#fbbf24', yMin: 1 }
      ]
    );
  },

  // ── 22. SCHALL & SCHALLWELLEN ───────────────────────────
  'schall': modal => {
    modal.innerHTML = _simModalHTML('schall', '🔊 Schallwellen – Longitudinalwellen',
      _slider_html('schF', 'Frequenz f', 100, 2000, 440, 50, 'Hz') +
      _slider_html('schA', 'Amplitude', 5, 40, 20, 1, 'px'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('druck'); _pSim.addSeries('v');
    _pSim.start(
      dt => {
        const f = _slider('schF');
        const p = Math.sin(2 * Math.PI * f * _pSim.t) * _slider('schA');
        _pSim.record('druck', p); _pSim.record('v', f * 0.343);
      },
      (ctx, cv) => {
        const f = _slider('schF'), A = _slider('schA');
        const c = 343; const lambda = c / f;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#f0f9ff'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Longitudinalwelle als Druckverdichtungen
        const cy = cv.height / 2;
        ctx.font = '11px sans-serif'; ctx.fillStyle = '#64748b';
        ctx.fillText('Verdichtung →                ← Verdünnung', 10, 18);
        for (let x = 0; x < cv.width; x += 3) {
          const phase = (x / cv.width) * 6 - _pSim.t * f * 0.3;
          const density = Math.sin(2 * Math.PI * phase) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(59,130,246,${density * 0.7 + 0.1})`;
          ctx.fillRect(x, cy - A, 3, A * 2);
        }
        // Sinuskurve als Druckverlauf
        ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < cv.width; x++) {
          const phase = (x / cv.width) * 6 - _pSim.t * f * 0.3;
          const y = cy + Math.sin(2 * Math.PI * phase) * A;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        _infoBox(ctx, cv, [`f=${f}Hz`, `λ=${lambda.toFixed(2)}m`, `c=343m/s`]);
      },
      [
        { series: 'druck', title: 'Schalldruck p(t)', label: 'p', unit: 'Pa', color: '#1d4ed8' },
        { series: 'v',     title: 'Schallgeschwindigkeit c=λ·f', label: 'c', unit: 'm/s', color: '#10b981', yMin: 0 }
      ]
    );
  },

  // ── 23. LICHT & SPEKTRUM ────────────────────────────────
  'licht': modal => {
    modal.innerHTML = _simModalHTML('licht', '🌈 Lichtspektrum & Brechung am Prisma',
      _slider_html('lichtA', 'Einfallswinkel α', 10, 60, 30, 1, '°'), false);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('rot'); _pSim.addSeries('blau');
    _pSim.start(
      dt => {
        const a = _slider('lichtA') * Math.PI / 180;
        const nRot = 1.51, nBlau = 1.53;
        const bRot  = Math.asin(Math.sin(a) / nRot)  * 180 / Math.PI;
        const bBlau = Math.asin(Math.sin(a) / nBlau) * 180 / Math.PI;
        _pSim.record('rot', bRot); _pSim.record('blau', bBlau);
      },
      (ctx, cv) => {
        const a = _slider('lichtA');
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Prisma
        const px = cv.width / 2 - 60, py = cv.height - 20;
        ctx.fillStyle = 'rgba(148,163,184,0.25)'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 120, py); ctx.lineTo(px + 60, py - 140); ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Einfallendes weißes Licht
        const aRad = a * Math.PI / 180;
        const hit = { x: px + 60, y: py - 50 };
        const lx = hit.x - Math.cos(aRad - Math.PI / 2) * 80;
        const ly = hit.y - Math.sin(aRad - Math.PI / 2) * 80;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(hit.x, hit.y); ctx.stroke();
        // Spektrum austretend
        const colors = ['#ff0000','#ff7700','#ffee00','#00cc00','#0066ff','#6600cc','#9900ff'];
        colors.forEach((c, i) => {
          const nC = 1.51 + i * 0.003;
          const bRad = Math.asin(Math.sin(aRad) / nC);
          const ex = hit.x + Math.cos(bRad + Math.PI / 6) * 90;
          const ey = hit.y + Math.sin(bRad + Math.PI / 6) * 90;
          ctx.strokeStyle = c; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(hit.x, hit.y); ctx.lineTo(ex, ey); ctx.stroke();
        });
        ctx.fillStyle = '#94a3b8'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`Einfallswinkel α = ${a}°`, 8, 18);
        ctx.fillText('n_blau > n_rot → stärkere Brechung', 8, 34);
        const nR = 1.51, bR = (Math.asin(Math.sin(aRad)/nR)*180/Math.PI).toFixed(1);
        ctx.fillText(`β_rot ≈ ${bR}°`, 8, 50);
      },
      [
        { series: 'rot',  title: 'Brechungswinkel Rot (n=1.51)', label: 'β_rot', unit: '°', color: '#f87171', yMin: 0 },
        { series: 'blau', title: 'Brechungswinkel Blau (n=1.53)', label: 'β_blau', unit: '°', color: '#60a5fa', yMin: 0 }
      ]
    );
  },

  // ── 24. OPTIK: REFLEXION & BRECHUNG ─────────────────────
  'optik': modal => {
    modal.innerHTML = _simModalHTML('optik', '🔍 Optik: Reflexion & Brechung (Snellius)',
      _slider_html('optA', 'Einfallswinkel α', 0, 89, 40, 1, '°') +
      _slider_html('optN', 'Brechungsindex n₂ (×10)', 10, 25, 15, 1, '×0.1'), false);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('beta'); _pSim.addSeries('reflex');
    _pSim.start(
      dt => {
        const a = _slider('optA') * Math.PI / 180, n2 = _slider('optN') / 10;
        const sinB = Math.sin(a) / n2;
        const beta = sinB <= 1 ? Math.asin(sinB) * 180 / Math.PI : null;
        _pSim.record('beta', beta || 0);
        _pSim.record('reflex', _slider('optA'));
      },
      (ctx, cv) => {
        const aDeg = _slider('optA'), n2 = _slider('optN') / 10;
        const a = aDeg * Math.PI / 180;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#eff6ff'; ctx.fillRect(0, 0, cv.width, cv.height / 2);
        ctx.fillStyle = '#dbeafe'; ctx.fillRect(0, cv.height / 2, cv.width, cv.height / 2);
        ctx.fillStyle = '#1d4ed8'; ctx.font = '700 11px sans-serif';
        ctx.fillText('Luft (n₁=1.0)', 6, cv.height/2 - 6);
        ctx.fillText(`Glas (n₂=${n2})`, 6, cv.height/2 + 14);
        // Grenzlinie
        ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([6, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, cv.height/2); ctx.lineTo(cv.width, cv.height/2); ctx.stroke();
        // Normale
        ctx.strokeStyle = '#9ca3af'; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(cv.width/2, 10); ctx.lineTo(cv.width/2, cv.height - 10); ctx.stroke();
        ctx.setLineDash([]);
        const O = { x: cv.width/2, y: cv.height/2 };
        // Einfallstrahl
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(O.x - Math.sin(a)*90, O.y - Math.cos(a)*90); ctx.lineTo(O.x, O.y); ctx.stroke();
        // Reflexion
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(O.x + Math.sin(a)*80, O.y - Math.cos(a)*80); ctx.stroke();
        // Brechung
        const sinB = Math.sin(a) / n2;
        if (sinB <= 1) {
          const b = Math.asin(sinB);
          ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(O.x + Math.sin(b)*90, O.y + Math.cos(b)*90); ctx.stroke();
          ctx.fillStyle = '#059669'; ctx.fillText(`β = ${(b*180/Math.PI).toFixed(1)}°`, O.x + 8, O.y + 24);
        } else {
          ctx.fillStyle = '#ef4444'; ctx.fillText('Totalreflexion!', O.x + 8, O.y + 24);
        }
        ctx.fillStyle = '#d97706'; ctx.fillText(`α = ${aDeg}°`, O.x + 8, O.y - 18);
        _infoBox(ctx, cv, [`n₁=1.0`, `n₂=${n2}`, `n₁sinα=n₂sinβ`]);
      },
      [
        { series: 'beta',   title: 'Brechungswinkel β(α)', label: 'β', unit: '°', color: '#10b981', yMin: 0, yMax: 90 },
        { series: 'reflex', title: 'Reflexionswinkel = α', label: 'α', unit: '°', color: '#f59e0b', yMin: 0, yMax: 90 }
      ]
    );
  },

  // ── 25. RADIOAKTIVITÄT ──────────────────────────────────
  'radioaktivitaet': modal => {
    modal.innerHTML = _simModalHTML('radioaktivitaet', '☢️ Radioaktiver Zerfall – Zerfallskurve',
      _slider_html('radHL', 'Halbwertszeit T½', 1, 20, 5, 1, 's') +
      _slider_html('radN0', 'Anfangskerne N₀ ×100', 10, 100, 80, 5, '×100'), false);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('N'); _pSim.addSeries('A');
    _pSim.start(
      dt => {
        const T = _slider('radHL'), N0 = _slider('radN0') * 100;
        const lam = Math.log(2) / T;
        const N = N0 * Math.exp(-lam * _pSim.t);
        const A = lam * N;
        _pSim.record('N', N); _pSim.record('A', A);
      },
      (ctx, cv) => {
        const T = _slider('radHL'), N0 = _slider('radN0') * 100;
        const lam = Math.log(2) / T;
        const N = N0 * Math.exp(-lam * _pSim.t);
        const A = lam * N;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#fef2f2'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Atome als Punkte visualisieren
        const total = 200, alive = Math.round(N / N0 * total);
        for (let i = 0; i < total; i++) {
          const gx = (i % 20) * (cv.width / 22) + 10, gy = Math.floor(i / 20) * 14 + 10;
          ctx.fillStyle = i < alive ? '#ef4444' : '#d1d5db';
          ctx.beginPath(); ctx.arc(gx, gy, 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#1f2937'; ctx.font = '700 12px sans-serif';
        ctx.fillText(`N(t) = N₀·e^(−λt)  N=${N.toFixed(0)}`, 8, cv.height - 30);
        ctx.fillText(`A = ${A.toFixed(1)} Zerfälle/s`, 8, cv.height - 14);
        _infoBox(ctx, cv, [`T½=${T}s`, `λ=${lam.toFixed(3)}/s`, `N=${N.toFixed(0)}`]);
      },
      [
        { series: 'N', title: 'Kernanzahl N(t) – Exponentialabfall', label: 'N', unit: '', color: '#ef4444', yMin: 0 },
        { series: 'A', title: 'Aktivität A(t) = λ·N', label: 'A', unit: '/s', color: '#f97316', yMin: 0 }
      ]
    );
  },

  // ── 26. QUANTENPHYSIK – PHOTOEFFEKT ────────────────────
  'quantenphysik': modal => {
    modal.innerHTML = _simModalHTML('quantenphysik', '⚛️ Photoeffekt – Licht als Teilchen',
      _slider_html('qpF', 'Lichtfrequenz f', 400, 900, 600, 10, 'THz') +
      _slider_html('qpI', 'Lichtintensität I', 10, 100, 50, 5, '%'), false);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('Ekin'); _pSim.addSeries('Strom');
    const PHI = 2.3; // Austrittsarbeit in eV (Natrium)
    const h = 4.136e-15; // eV·s
    _pSim.start(
      dt => {
        const f = _slider('qpF') * 1e12;
        const E = h * f;
        const Ekin = Math.max(0, E - PHI);
        const Strom = Ekin > 0 ? _slider('qpI') / 10 : 0;
        _pSim.record('Ekin', E); _pSim.record('Strom', Strom);
      },
      (ctx, cv) => {
        const f = _slider('qpF'), I = _slider('qpI');
        const E = h * f * 1e12;
        const Ekin = Math.max(0, E - PHI);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#1e1b4b'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Metallplatte
        ctx.fillStyle = '#6b7280'; ctx.fillRect(0, cv.height - 40, cv.width / 3, 40);
        ctx.fillStyle = '#9ca3af'; ctx.font = '700 11px sans-serif';
        ctx.fillText('Metall', 10, cv.height - 48);
        // Photonen
        const col = f < 500 ? '#f87171' : f < 650 ? '#fbbf24' : '#60a5fa';
        for (let i = 0; i < 5; i++) {
          const px = ((i * 37 + _pSim.t * 80) % (cv.width * 0.8)), py = 20 + i * 18;
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px sans-serif';
          ctx.fillText('hf', px - 7, py + 4);
        }
        // Elektronen
        if (Ekin > 0) {
          for (let i = 0; i < Math.min(8, I / 10); i++) {
            const ex = cv.width / 3 + ((i * 41 + _pSim.t * 120) % (cv.width * 0.6));
            const ey = cv.height - 15 - i * 5;
            ctx.fillStyle = '#34d399'; ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = '#34d399'; ctx.fillText('← e⁻', cv.width / 2, cv.height - 48);
        } else {
          ctx.fillStyle = '#f87171'; ctx.fillText('Keine Elektronen!  f < f_min', cv.width / 3 + 10, cv.height - 48);
        }
        ctx.fillStyle = '#e2e8f0'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`E_Photon = hf = ${E.toFixed(2)} eV`, cv.width / 2, 18);
        ctx.fillText(`Φ = ${PHI} eV  |  E_kin = ${Ekin.toFixed(2)} eV`, cv.width / 2, 34);
      },
      [
        { series: 'Ekin',  title: 'Photonenenergie E = hf (eV)', label: 'E', unit: 'eV', color: '#fbbf24', yMin: 0 },
        { series: 'Strom', title: 'Photostrom (prop. Intensität)', label: 'I', unit: 'mA', color: '#34d399', yMin: 0 }
      ]
    );
  },

  // ── 27. STEHENDE WELLEN ─────────────────────────────────
  'stehende-wellen': modal => {
    modal.innerHTML = _simModalHTML('stehende-wellen', '🎸 Stehende Wellen – Gitarrensaite',
      _slider_html('swN', 'Oberton n (1=Grundton)', 1, 6, 1, 1, '') +
      _slider_html('swL', 'Saitenlänge L', 20, 100, 60, 5, 'cm'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('amp'); _pSim.addSeries('f');
    _pSim.start(
      dt => {
        const n = _slider('swN'), L = _slider('swL') / 100;
        const c = 200; // Wellengeschwindigkeit
        const f = n * c / (2 * L);
        const amp = Math.sin(2 * Math.PI * f * _pSim.t * 0.01) * 40;
        _pSim.record('amp', Math.abs(amp)); _pSim.record('f', f);
      },
      (ctx, cv) => {
        const n = _slider('swN'), L = _slider('swL') / 100;
        const c = 200, f = n * c / (2 * L);
        const t = _pSim.t;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cy = cv.height / 2, len = cv.width - 40;
        // Saite ruhend
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(20 + len, cy); ctx.stroke();
        // Befestigung
        ctx.fillStyle = '#374151';
        ctx.fillRect(14, cy - 18, 8, 36); ctx.fillRect(20 + len - 2, cy - 18, 8, 36);
        // Stehende Welle
        ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 3;
        const A = 35;
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const x = 20 + (i / 200) * len;
          const xi = i / 200;
          const y = cy + A * Math.sin(n * Math.PI * xi) * Math.cos(2 * Math.PI * f * t * 0.006);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        // Gegenphasige Welle (helfer)
        ctx.strokeStyle = 'rgba(124,58,237,0.2)'; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const x = 20 + (i / 200) * len, xi = i / 200;
          const y = cy - A * Math.sin(n * Math.PI * xi) * Math.cos(2 * Math.PI * f * t * 0.006);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        // Knoten markieren
        ctx.fillStyle = '#ef4444';
        for (let k = 0; k <= n; k++) {
          const kx = 20 + (k / n) * len;
          ctx.beginPath(); ctx.arc(kx, cy, 5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#1f2937'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`n=${n}  f=${f.toFixed(1)}Hz  λ=${(2*L/n*100).toFixed(1)}cm`, 10, 18);
        ctx.fillStyle = '#ef4444'; ctx.fillText(`${n+1} Knoten, ${n} Bäuche`, 10, 34);
        _infoBox(ctx, cv, [`n=${n}`, `f=${f.toFixed(0)}Hz`, `λ=${(2*L*100/n).toFixed(1)}cm`]);
      },
      [
        { series: 'amp', title: 'Amplitude (schwingt mit cos(ωt))', label: 'A', unit: 'px', color: '#7c3aed', yMin: 0 },
        { series: 'f',   title: 'Eigenfrequenz f_n = n·c/(2L)', label: 'f', unit: 'Hz', color: '#f97316', yMin: 0 }
      ]
    );
  },

  // ── 28. COULOMBSCHES GESETZ ─────────────────────────────
  'coulomb': modal => {
    modal.innerHTML = _simModalHTML('coulomb', '⚡ Coulombsches Gesetz – F = k·q₁·q₂/r²',
      _slider_html('colQ1', 'Ladung q₁', -5, 5, 2, 1, 'µC') +
      _slider_html('colQ2', 'Ladung q₂', -5, 5, -2, 1, 'µC'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('F'); _pSim.addSeries('r');
    let r = 150;
    _pSim.start(
      dt => {
        const q1 = _slider('colQ1') * 1e-6, q2 = _slider('colQ2') * 1e-6;
        const k = 8.99e9;
        const F = k * Math.abs(q1 * q2) / (r / 100) ** 2; // r in Metern
        const attractive = (q1 * q2 < 0);
        if (attractive) r = Math.max(80, r - 20 * dt);
        else r = Math.min(220, r + 20 * dt);
        _pSim.record('F', F / 1000); // in kN
        _pSim.record('r', r / 100);
      },
      (ctx, cv) => {
        const q1 = _slider('colQ1'), q2 = _slider('colQ2');
        const k = 8.99e9;
        const Fm = k * Math.abs(q1 * q2) * 1e-12 / (r / 100) ** 2;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cy = cv.height / 2;
        const x1 = cv.width / 2 - r / 2, x2 = cv.width / 2 + r / 2;
        // Ladung 1
        const c1 = q1 > 0 ? '#ef4444' : (q1 < 0 ? '#3b82f6' : '#94a3b8');
        ctx.fillStyle = c1; ctx.beginPath(); ctx.arc(x1, cy, 20, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '700 14px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(q1 > 0 ? '+' : q1 < 0 ? '−' : '0', x1, cy + 5);
        // Ladung 2
        const c2 = q2 > 0 ? '#ef4444' : (q2 < 0 ? '#3b82f6' : '#94a3b8');
        ctx.fillStyle = c2; ctx.beginPath(); ctx.arc(x2, cy, 20, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillText(q2 > 0 ? '+' : q2 < 0 ? '−' : '0', x2, cy + 5);
        // Kraftpfeil
        ctx.textAlign = 'left';
        const attractive = (q1 * q2 < 0);
        const arrowLen = Math.min(50, Fm * 1e-4);
        ctx.strokeStyle = attractive ? '#10b981' : '#f59e0b'; ctx.lineWidth = 3;
        if (attractive) {
          ctx.beginPath(); ctx.moveTo(x1 + 22, cy); ctx.lineTo(x1 + 22 + arrowLen, cy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x2 - 22, cy); ctx.lineTo(x2 - 22 - arrowLen, cy); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.moveTo(x1 - 22, cy); ctx.lineTo(x1 - 22 - arrowLen, cy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x2 + 22, cy); ctx.lineTo(x2 + 22 + arrowLen, cy); ctx.stroke();
        }
        // Abstand
        ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([4,4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x1, cy + 30); ctx.lineTo(x2, cy + 30); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#374151'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`r = ${(r/100).toFixed(2)} m`, cv.width/2 - 20, cy + 44);
        const type = attractive ? '🔵 Anziehung' : '🔴 Abstoßung';
        ctx.fillText(type, 10, 20);
        _infoBox(ctx, cv, [`q₁=${q1}µC`, `q₂=${q2}µC`, `F=${Fm.toFixed(2)}N`]);
      },
      [
        { series: 'F', title: 'Coulomb-Kraft F (kN)', label: 'F', unit: 'kN', color: '#ef4444', yMin: 0 },
        { series: 'r', title: 'Abstand r (m)', label: 'r', unit: 'm', color: '#6366f1', yMin: 0 }
      ]
    );
  },

  // ── 29. HALL-EFFEKT ─────────────────────────────────────
  'hall-effekt': modal => {
    modal.innerHTML = _simModalHTML('hall-effekt', '🔬 Hall-Effekt – Magnetfeld & Strom',
      _slider_html('hallI', 'Strom I', 1, 10, 5, 1, 'A') +
      _slider_html('hallB', 'Magnetfeld B', 10, 100, 50, 5, 'mT'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('UH'); _pSim.addSeries('Fq');
    _pSim.start(
      dt => {
        const I = _slider('hallI'), B = _slider('hallB') * 1e-3;
        const n = 8.5e28, e = 1.6e-19, d = 0.001;
        const UH = (I * B) / (n * e * d);
        _pSim.record('UH', UH * 1e6); // µV
        _pSim.record('Fq', I * B * 1e12);
      },
      (ctx, cv) => {
        const I = _slider('hallI'), B = _slider('hallB');
        const UH = (I * B * 1e-3) / (8.5e28 * 1.6e-19 * 0.001) * 1e6;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#f0fdf4'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Leiterplatte
        const lw = 200, lh = 60, lx = (cv.width - lw) / 2, ly = (cv.height - lh) / 2;
        ctx.fillStyle = '#a7f3d0'; ctx.fillRect(lx, ly, lw, lh);
        ctx.strokeStyle = '#059669'; ctx.lineWidth = 2;
        ctx.strokeRect(lx, ly, lw, lh);
        // Stromrichtung
        ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(lx - 40, ly + lh/2); ctx.lineTo(lx, ly + lh/2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx + lw, ly + lh/2); ctx.lineTo(lx + lw + 40, ly + lh/2); ctx.stroke();
        ctx.fillStyle = '#1d4ed8'; ctx.font = '700 12px sans-serif';
        ctx.fillText('I→', lx - 38, ly + lh/2 - 4);
        // Elektronen (gegenläufig zu I)
        for (let i = 0; i < 6; i++) {
          const ex = lx + lw - ((i * 30 + _pSim.t * 50) % lw);
          ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(ex, ly + lh/2, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fef2f2'; ctx.font = '8px sans-serif';
          ctx.fillText('e⁻', ex - 7, ly + lh/2 + 3);
        }
        // Hall-Spannung (oben/unten)
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cv.width/2, ly - 20); ctx.lineTo(cv.width/2, ly); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cv.width/2, ly + lh); ctx.lineTo(cv.width/2, ly + lh + 20); ctx.stroke();
        ctx.fillStyle = '#d97706'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`U_H = ${UH.toFixed(2)} µV`, cv.width/2 - 40, ly - 26);
        ctx.fillText(`B = ${B} mT  ↑`, lx - 50, ly - 10);
        ctx.fillText('F_L = q·v×B → Ladungstrennung', lx, ly + lh + 34);
        _infoBox(ctx, cv, [`I=${I}A`, `B=${B}mT`, `U_H=${UH.toFixed(2)}µV`]);
      },
      [
        { series: 'UH', title: 'Hall-Spannung U_H (µV)', label: 'U_H', unit: 'µV', color: '#d97706', yMin: 0 },
        { series: 'Fq', title: 'Lorentz-Kraft F_L (rel.)',  label: 'F_L', unit: '', color: '#7c3aed', yMin: 0 }
      ]
    );
  },

  // ── 30. INDUKTION ───────────────────────────────────────
  'induktion': modal => {
    modal.innerHTML = _simModalHTML('induktion', '🧲 Elektromagnetische Induktion – Faraday',
      _slider_html('indV', 'Magnet-Geschwindigkeit v', 1, 10, 5, 1, 'm/s') +
      _slider_html('indN', 'Windungszahl N', 1, 20, 10, 1, ''), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('Uind'); _pSim.addSeries('Phi');
    let magX = 50;
    _pSim.start(
      dt => {
        const v = _slider('indV'), N = _slider('indN');
        magX += v * dt * 40;
        if (magX > cv_w() + 60) magX = -60;
        const coilX = cv_w() / 2;
        const dist = Math.abs(magX - coilX);
        const Phi = Math.max(0, 1 - dist / 150);
        const dPhiDt = v * 40 * (magX < coilX ? 1 : -1) * (Math.max(0, 1 - dist/150)) / 150;
        const Uind = -N * dPhiDt * 200;
        _pSim.record('Uind', Uind); _pSim.record('Phi', Phi * N);
      },
      (ctx, cv) => {
        const v = _slider('indV'), N = _slider('indN');
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cy = cv.height / 2;
        // Spule
        ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 3;
        const cx = cv.width / 2;
        for (let i = 0; i < Math.min(N, 12); i++) {
          const wx = cx - 20 + (i - N / 2) * 4;
          ctx.beginPath();
          ctx.ellipse(wx, cy, 14, 28, Math.PI / 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Magnet
        const mh = 40, mw = 30;
        const my = cy - mh / 2;
        ctx.fillStyle = '#ef4444'; ctx.fillRect(magX - mw, my, mw, mh);
        ctx.fillStyle = '#3b82f6'; ctx.fillRect(magX, my, mw, mh);
        ctx.fillStyle = '#fff'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('N', magX - mw / 2, cy + 5);
        ctx.fillText('S', magX + mw / 2, cy + 5);
        ctx.textAlign = 'left';
        // Pfeil
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
        const dir = v > 0 ? 1 : -1;
        ctx.beginPath(); ctx.moveTo(magX + mw, cy); ctx.lineTo(magX + mw + dir * 25, cy); ctx.stroke();
        const dist = Math.abs(magX - cx);
        const Uind = -N * v * 40 * (magX < cx ? 1 : -1) * (Math.max(0, 1 - dist/150)) / 150 * 200;
        ctx.fillStyle = '#1f2937'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`U_ind = ${Uind.toFixed(1)} V  (N=${N})`, 10, 20);
        _infoBox(ctx, cv, [`v=${v}m/s`, `N=${N}`, `U_ind=${Uind.toFixed(1)}V`]);
      },
      [
        { series: 'Uind', title: 'Induzierte Spannung U_ind = −N·dΦ/dt', label: 'U', unit: 'V', color: '#7c3aed' },
        { series: 'Phi',  title: 'Magnetischer Fluss N·Φ', label: 'N·Φ', unit: '', color: '#10b981', yMin: 0 }
      ]
    );
    function cv_w() { return document.getElementById('physAnim')?.width || 400; }
  },

  // ── 31. WECHSELSTROM ────────────────────────────────────
  'wechselstrom': modal => {
    modal.innerHTML = _simModalHTML('wechselstrom', '🔌 Wechselstrom – U(t) = U_max·sin(ωt)',
      _slider_html('acF', 'Frequenz f', 1, 60, 50, 1, 'Hz') +
      _slider_html('acU', 'U_max', 100, 400, 325, 25, 'V'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('U'); _pSim.addSeries('Ueff');
    _pSim.start(
      dt => {
        const f = _slider('acF'), Umax = _slider('acU');
        const U = Umax * Math.sin(2 * Math.PI * f * _pSim.t);
        const Ueff = Umax / Math.sqrt(2);
        _pSim.record('U', U); _pSim.record('Ueff', Ueff);
      },
      (ctx, cv) => {
        const f = _slider('acF'), Umax = _slider('acU');
        const Ueff = Umax / Math.sqrt(2);
        const U = Umax * Math.sin(2 * Math.PI * f * _pSim.t);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#f0f9ff'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cy = cv.height / 2;
        // Nulllinie
        ctx.strokeStyle = '#cbd5e1'; ctx.setLineDash([6,4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy); ctx.stroke();
        // Effektivwert-Linien
        ctx.strokeStyle = '#f97316'; ctx.setLineDash([4,4]);
        const effy = cy - (Ueff / Umax) * (cy - 10);
        ctx.beginPath(); ctx.moveTo(0, effy); ctx.lineTo(cv.width, effy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, cy*2 - effy); ctx.lineTo(cv.width, cy*2 - effy); ctx.stroke();
        ctx.setLineDash([]);
        // Sinuskurve
        ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < cv.width; x++) {
          const t = (x / cv.width) * 2 / f + _pSim.t - 1 / f;
          const y = cy - (Umax * Math.sin(2 * Math.PI * f * t)) / Umax * (cy - 10);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        // Zeiger (aktuell)
        const curY = cy - (U / Umax) * (cy - 10);
        ctx.fillStyle = '#1d4ed8'; ctx.beginPath(); ctx.arc(cv.width - 20, curY, 6, 0, Math.PI * 2); ctx.fill();
        // Labels
        ctx.fillStyle = '#1f2937'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`U(t) = ${U.toFixed(1)} V  |  f = ${f} Hz`, 8, 18);
        ctx.fillStyle = '#f97316'; ctx.fillText(`U_eff = U_max/√2 = ${Ueff.toFixed(1)} V`, 8, 34);
        _infoBox(ctx, cv, [`f=${f}Hz`, `U_max=${Umax}V`, `U_eff=${Ueff.toFixed(1)}V`]);
      },
      [
        { series: 'U',    title: 'Wechselspannung U(t)', label: 'U', unit: 'V', color: '#1d4ed8' },
        { series: 'Ueff', title: 'Effektivwert U_eff = U_max/√2', label: 'U_eff', unit: 'V', color: '#f97316', yMin: 0 }
      ]
    );
  },

  // ── 32. LC-SCHWINGKREIS ─────────────────────────────────
  'lc-schwingkreis': modal => {
    modal.innerHTML = _simModalHTML('lc-schwingkreis', '📡 LC-Schwingkreis – f₀ = 1/(2π√LC)',
      _slider_html('lcL', 'Induktivität L', 10, 200, 50, 10, 'µH') +
      _slider_html('lcC', 'Kapazität C', 10, 500, 100, 10, 'pF'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('Uc'); _pSim.addSeries('IL');
    let Q0 = 1;
    _pSim.start(
      dt => {
        const L = _slider('lcL') * 1e-6, C = _slider('lcC') * 1e-12;
        const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
        const Uc = Q0 * Math.cos(2 * Math.PI * f0 * _pSim.t);
        const IL = -Q0 * Math.sin(2 * Math.PI * f0 * _pSim.t);
        _pSim.record('Uc', Uc * 100); // skaliert
        _pSim.record('IL', IL * 100);
      },
      (ctx, cv) => {
        const L = _slider('lcL'), C = _slider('lcC');
        const f0 = 1 / (2 * Math.PI * Math.sqrt(L * 1e-6 * C * 1e-12));
        const t = _pSim.t;
        const Uc = Math.cos(2 * Math.PI * f0 * t);
        const IL = -Math.sin(2 * Math.PI * f0 * t);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cy = cv.height / 2;
        // Kondensator-Ladung visualisieren
        const cx = 80, cw = 12, ch = 60;
        ctx.fillStyle = Uc > 0 ? '#ef4444' : '#3b82f6';
        ctx.fillRect(cx - cw/2, cy - ch/2, cw, ch * Math.abs(Uc));
        ctx.strokeStyle = '#374151'; ctx.lineWidth = 2;
        ctx.strokeRect(cx - cw/2 - 10, cy - ch/2, cw + 20, ch);
        ctx.fillStyle = '#374151'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('C', cx, cy + ch/2 + 16);
        // Spule visualisieren
        const lx = cv.width - 80;
        for (let i = 0; i < 6; i++) {
          const wx = lx - 20 + i * 7;
          ctx.strokeStyle = `rgba(124,58,237,${0.4 + Math.abs(IL) * 0.6})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(wx, cy, 6, 20, Math.PI / 2, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = '#374151'; ctx.textAlign = 'center'; ctx.fillText('L', lx, cy + 40);
        // Verbindungslinien
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx, cy - ch/2); ctx.lineTo(cx, 20); ctx.lineTo(lx, 20); ctx.lineTo(lx, cy - 30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy + ch/2); ctx.lineTo(cx, cv.height - 20); ctx.lineTo(lx, cv.height - 20); ctx.lineTo(lx, cy + 30); ctx.stroke();
        ctx.textAlign = 'left';
        // Infos
        ctx.fillStyle = '#1f2937'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`f₀ = ${f0 > 1e6 ? (f0/1e6).toFixed(1)+'MHz' : f0 > 1000 ? (f0/1000).toFixed(1)+'kHz' : f0.toFixed(0)+'Hz'}`, cv.width/2 - 40, 18);
        ctx.fillStyle = '#ef4444'; ctx.fillText(`U_C: ${(Uc*100).toFixed(0)}%`, cv.width/2 - 40, 34);
        ctx.fillStyle = '#7c3aed'; ctx.fillText(`I_L: ${(IL*100).toFixed(0)}%`, cv.width/2 + 30, 34);
        _infoBox(ctx, cv, [`L=${L}µH`, `C=${C}pF`, `f₀=…`]);
      },
      [
        { series: 'Uc', title: 'Kondensatorspannung U_C(t)', label: 'U_C', unit: '', color: '#ef4444' },
        { series: 'IL', title: 'Spulenstrom I_L(t) – 90° versetzt!', label: 'I_L', unit: '', color: '#7c3aed' }
      ]
    );
  },

  // ── 33. TRANSFORMATOR ───────────────────────────────────
  'transformator': modal => {
    modal.innerHTML = _simModalHTML('transformator', '🔄 Transformator – U₁/U₂ = N₁/N₂',
      _slider_html('traU1', 'Primärspannung U₁', 10, 400, 230, 10, 'V') +
      _slider_html('traN', 'Windungsverhältnis N₁/N₂ (×10)', 1, 50, 10, 1, '×0.1'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('U2'); _pSim.addSeries('I2');
    _pSim.start(
      dt => {
        const U1 = _slider('traU1'), ratio = _slider('traN') / 10;
        const U2 = U1 / ratio;
        const I2 = 100 / U2; // P = 100W = const
        _pSim.record('U2', U2); _pSim.record('I2', I2);
      },
      (ctx, cv) => {
        const U1 = _slider('traU1'), ratio = _slider('traN') / 10;
        const U2 = U1 / ratio;
        const t = _pSim.t;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, cv.width, cv.height);
        const cy = cv.height / 2;
        // Kern
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(cv.width/2 - 15, 20, 30, cv.height - 40);
        // Primärspule
        ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 2;
        const N1 = Math.min(12, Math.round(ratio * 6));
        for (let i = 0; i < N1; i++) {
          ctx.beginPath(); ctx.ellipse(cv.width/2 - 40, 30 + i * (cv.height-60)/Math.max(N1,1), 22, 10, 0, 0, Math.PI * 2); ctx.stroke();
        }
        // Sekundärspule
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        const N2 = 6;
        for (let i = 0; i < N2; i++) {
          ctx.beginPath(); ctx.ellipse(cv.width/2 + 40, 30 + i * (cv.height-60)/N2, 22, 10, 0, 0, Math.PI * 2); ctx.stroke();
        }
        // Spannung als Sinuskurve anzeigen
        const sinU1 = U1 * Math.sin(2 * Math.PI * 50 * t) / 400 * 30;
        const sinU2 = U2 * Math.sin(2 * Math.PI * 50 * t) / 400 * 30;
        ctx.fillStyle = '#1d4ed8'; ctx.font = '700 12px sans-serif';
        ctx.fillText(`U₁ = ${U1} V`, 10, 20);
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`U₂ = ${U2.toFixed(1)} V`, cv.width - 100, 20);
        ctx.fillStyle = '#1f2937'; ctx.font = '11px sans-serif';
        ctx.fillText(`N₁/N₂ = ${ratio.toFixed(1)}  |  ηideal = 100%`, cv.width/2 - 70, cv.height - 8);
        // Lebende Welle
        [{ u: sinU1, x: cv.width/2-80, c:'#1d4ed8' },
         { u: sinU2, x: cv.width/2+80, c:'#ef4444' }].forEach(({ u, x, c }) => {
          ctx.strokeStyle = c; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x - 25, cy - u * 0.5); ctx.lineTo(x, cy + u * 0.5); ctx.stroke();
        });
        _infoBox(ctx, cv, [`N₁/N₂=${ratio.toFixed(1)}`, `U₁=${U1}V`, `U₂=${U2.toFixed(1)}V`]);
      },
      [
        { series: 'U2', title: 'Sekundärspannung U₂ = U₁/(N₁/N₂)', label: 'U₂', unit: 'V', color: '#ef4444', yMin: 0 },
        { series: 'I2', title: 'Sekundärstrom I₂ (P=const=100W)', label: 'I₂', unit: 'A', color: '#10b981', yMin: 0 }
      ]
    );
  },

  // ── 34. BOHRSCHES ATOMMODELL ────────────────────────────
  'atomphysik': modal => {
    modal.innerHTML = _simModalHTML('atomphysik', '⚛️ Bohrsches Atommodell – Energieniveaus',
      _slider_html('atomN', 'Hauptquantenzahl n', 1, 5, 1, 1, '') +
      _slider_html('atomZ', 'Kernladung Z', 1, 10, 1, 1, ''), false);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('En'); _pSim.addSeries('r');
    let angles = [0, 0, 0, 0, 0];
    _pSim.start(
      dt => {
        const n = _slider('atomN'), Z = _slider('atomZ');
        const En = -13.6 * Z * Z / (n * n);
        const r = 0.053 * n * n / Z;
        _pSim.record('En', -En); // positiv für Diagramm
        _pSim.record('r', r * 100); // pm
        for (let i = 0; i < 5; i++) angles[i] += dt * (3 / (i + 1));
      },
      (ctx, cv) => {
        const nMax = _slider('atomN'), Z = _slider('atomZ');
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, cv.width, cv.height);
        // Sterne
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fillRect((i * 71) % cv.width, (i * 43) % cv.height, 1.5, 1.5);
        }
        const cx = cv.width / 2, cy = cv.height / 2;
        // Kern
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(cx, cy, 10 + Z, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#020617'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(Z, cx, cy + 4);
        ctx.textAlign = 'left';
        // Bahnen & Elektronen
        const colors = ['#60a5fa','#34d399','#f97316','#f472b6','#a78bfa'];
        for (let n = 1; n <= nMax; n++) {
          const r = 20 + n * 28;
          ctx.strokeStyle = colors[n-1] + '55'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
          // Elektron
          const ex = cx + r * Math.cos(angles[n-1]);
          const ey = cy + r * Math.sin(angles[n-1]);
          ctx.fillStyle = colors[n-1]; ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();
        }
        // Energieniveaus rechts
        const En = -13.6 * Z * Z / (nMax * nMax);
        ctx.fillStyle = '#94a3b8'; ctx.font = '700 10px sans-serif';
        for (let n = 1; n <= 5; n++) {
          const E = -13.6 * Z * Z / (n * n);
          const ey = 20 + (n-1) * 22;
          ctx.strokeStyle = n <= nMax ? colors[n-1] : '#334155';
          ctx.lineWidth = n <= nMax ? 2 : 1;
          ctx.beginPath(); ctx.moveTo(cv.width - 80, ey); ctx.lineTo(cv.width - 10, ey); ctx.stroke();
          ctx.fillStyle = n <= nMax ? colors[n-1] : '#475569';
          ctx.fillText(`n=${n}: ${E.toFixed(1)}eV`, cv.width - 78, ey - 2);
        }
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`E_n = ${En.toFixed(2)} eV`, 8, 20);
        _infoBox(ctx, cv, [`n=${nMax}`, `Z=${Z}`, `E=${En.toFixed(2)}eV`]);
      },
      [
        { series: 'En', title: 'Bindungsenergie |E_n| = 13.6·Z²/n² (eV)', label: '|E_n|', unit: 'eV', color: '#fbbf24', yMin: 0 },
        { series: 'r',  title: 'Bahnradius r_n (pm)',                       label: 'r_n',   unit: 'pm', color: '#60a5fa', yMin: 0 }
      ]
    );
  },

  // ── 18. LEISTUNG & WIRKUNGSGRAD ────────────────────────
  'leistung': modal => {
    modal.innerHTML = _simModalHTML('leistung', '⚙️ Leistung P = F · v & Wirkungsgrad η',
      _slider_html('lwF', 'Kraft F', 10, 500, 100, 10, 'N') +
      _slider_html('lwEta', 'Wirkungsgrad η', 10, 99, 80, 1, '%'), true);
    _pSim = new PhysicsSimEngine('physAnim', 'physChart');
    _pSim.addSeries('P'); _pSim.addSeries('Pnutz');
    let x = 0, v = 0;
    _pSim.start(
      dt => {
        const F = _slider('lwF'), eta = _slider('lwEta') / 100, m = 5;
        const a = F / m; v += a * dt * 0.1; x += v * dt;
        const P = F * v, Pnutz = P * eta;
        _pSim.record('P', P); _pSim.record('Pnutz', Pnutz);
      },
      (ctx, cv) => {
        const F = _slider('lwF'), eta = _slider('lwEta') / 100;
        ctx.clearRect(0, 0, cv.width, cv.height);
        _drawRoad(ctx, cv);
        const px = (x * 5) % (cv.width + 80) - 40;
        _drawCar(ctx, px, cv.height - 70, '#7c3aed');
        // Kraftpfeil
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
        const fl = Math.min(90, F / 3);
        ctx.beginPath(); ctx.moveTo(px + 65, cv.height - 44); ctx.lineTo(px + 65 + fl, cv.height - 44); ctx.stroke();
        // Wirkungsgradbalken
        const bw = 160;
        ctx.fillStyle = '#e5e7eb'; ctx.fillRect(10, 10, bw, 18);
        ctx.fillStyle = '#059669'; ctx.fillRect(10, 10, bw * eta, 18);
        ctx.fillStyle = '#1f2937'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`η = ${(eta * 100).toFixed(0)}%  P_nutz = ${(F * v * eta).toFixed(0)}W`, 10, 44);
        _infoBox(ctx, cv, [`F=${F}N`, `P=${(F*v).toFixed(1)}W`, `η=${(eta*100).toFixed(0)}%`]);
      },
      [
        { series: 'P',     title: 'Gesamtleistung P(t)',  label: 'P',     unit: 'W', color: '#7c3aed', yMin: 0 },
        { series: 'Pnutz', title: 'Nutzleistung P_nutz', label: 'P_nutz', unit: 'W', color: '#059669', yMin: 0 }
      ]
    );
  },

  // ── 30. FEDERPENDEL – MESSREIHE & LINEARISIERUNG ───────
  // Schlüsselexperiment: T in Abhängigkeit von m und D selbst ausmessen,
  // Messwerte auftragen, linearisieren und k ≈ 4π² bestimmen.
  // ── 31. WELLENWANNE ────────────────────────────────────
  // Schluesselexperiment 01 des KLP: alle Wellenphaenomene in einer Wanne
  'wellenwanne': modal => {
    _wwInit();
    modal.innerHTML = _wwHTML();
    const ex = document.getElementById('wwExtra'); if (ex) ex.innerHTML = _wwExtraHTML();
    _wwErkl(); _wwInfo();
    _pSim = new PhysicsSimEngine('wwCanvas', 'wwKeinChart');
    _pSim.start(() => _wwUpdate(), (ctx, cv) => _wwRender(ctx, cv), []);
  },

  'federpendel-messreihe': modal => {
    _fpmInit();
    modal.innerHTML = _fpmHTML();
    _fpmRenderTable();
    _pSim = new PhysicsSimEngine('fpmAnim', 'fpmPlot');
    _pSim.start(dt => _fpmUpdate(dt), (ctx, cv) => _fpmDrawApparatus(ctx, cv), []);
    _fpmRenderTheorie(false);
    _fpmDrawPlot();
  },

  // ── 32. DOPPELSPALT ────────────────────────────────────
  // Schluesselexperiment 02 des KLP: Wellenlaenge von Licht selbst messen
  'doppelspalt': modal => {
    _dspInit();
    modal.innerHTML = _dspHTML();
    const erkl = document.getElementById('dspErkl');
    if (erkl) erkl.innerHTML = _dspErklHTML();
    _dspBind();
    _dspRenderTable();
    _dspUpdateRead();
    _dspRenderTheorie(false);
    _dspDrawPlot();
    _pSim = new PhysicsSimEngine('dspBank', 'dspKeinChart');
    _pSim.start(() => {}, (ctx, cv) => { _dspRenderBank(ctx, cv); _dspRenderScreen(); }, []);
  },

  // ── 33. OPTISCHES GITTER ───────────────────────────────
  // Schluesselexperiment 03 des KLP: vom Doppelspalt ueber den
  // Vierfachspalt zum Gitter, mit Zeigerdiagramm und CD als Gitter
  'gitter': modal => {
    _gitInit();
    modal.innerHTML = _gitHTML();
    const erkl = document.getElementById('gitErkl');
    if (erkl) erkl.innerHTML = _gitErklHTML();
    _gitBind();
    _gitSetGitter(_git.gi);
    _gitSetModus('lam');
    _gitRenderTable();
    _gitUpdateRead();
    _gitRenderTheorie(false);
    _gitDrawPlot();
    _pSim = new PhysicsSimEngine('gitBank', 'gitKeinChart');
    _pSim.start(() => {}, (ctx, cv) => {
      _gitRenderBank(ctx, cv); _gitRenderScreen(); _gitRenderZeiger();
    }, []);
  },

  // ── 34. PHOTOEFFEKT ────────────────────────────────────
  // Schluesselexperiment 04 des KLP: Hallwachsversuch, Widerspruch zum
  // Wellenmodell und Vakuumphotozelle mit Einsteingerade
  'photoeffekt': modal => {
    _phoInit();
    modal.innerHTML = _phoHTML();
    const erkl = document.getElementById('phoErkl');
    if (erkl) erkl.innerHTML = _phoErklHTML();
    _phoSetStation(0);
    _phoSetFilter(0);
    _phoSetHwMat(_pho.hwMat);
    _phoSetLicht(_pho.li);
    _phoSetZMat(_pho.mi);
    _phoRenderProt();
    _phoRenderTable();
    _phoRenderTheorie(false);
    _phoUpdate();
    _phoDrawPlot();
    _pSim = new PhysicsSimEngine('phoTakt', 'phoKeinChart');
    _pSim.start(dt => _phoTakt(dt), () => _phoRender(), []);
  },

  // ── 35. MILLIKANVERSUCH ────────────────────────────────
  // Schluesselexperiment 05 des KLP: Wattebausch-Modellversuch,
  // vereinfachter Millikanversuch und Auswertung zur Elementarladung
  'millikan': modal => {
    _milInit();
    modal.innerHTML = _milHTML();
    const erkl = document.getElementById('milErkl');
    if (erkl) erkl.innerHTML = _milErklHTML();
    _milSetStation(0);
    _milWbLaden();
    _milWbRenderTable();
    _milRenderTable();
    _milRenderTheorie(false);
    _milUpdate();
    _milDrawPlot();
    _pSim = new PhysicsSimEngine('milTakt', 'milKeinChart');
    _pSim.start(dt => _milTakt(dt), () => _milRender(), []);
  },

  // ── 36. FADENSTRAHLROHR ────────────────────────────────
  // Schluesselexperiment 06 des KLP: Kreisbahn im Helmholtzfeld,
  // Auswertung zur Elektronenmasse und Schraubenbahn
  'fadenstrahlrohr-messreihe': modal => {
    _fsrInit();
    modal.innerHTML = _fsrHTML();
    const erkl = document.getElementById('fsrErkl');
    if (erkl) erkl.innerHTML = _fsrErklHTML();
    _fsrSetStation(0);
    _fsrSetQuelle('formel');
    _fsrRenderTable();
    _fsrRenderTheorie(false);
    _fsrUpdate();
    _fsrDrawPlot();
    _pSim = new PhysicsSimEngine('fsrTakt', 'fsrKeinChart');
    _pSim.start(dt => _fsrTakt(dt), () => _fsrRender(), []);
  },

  // Schluesselexperiment 07 des KLP: Beugungsringe polykristalliner Graphitfolie,
  // de-Broglie-Wellenlaenge und daraus das Plancksche Wirkungsquantum
  'elektronenbeugung': modal => {
    _ebrInit();
    modal.innerHTML = _ebrHTML();
    const erkl = document.getElementById('ebrErkl');
    if (erkl) erkl.innerHTML = _ebrErklHTML();
    _ebrSetStation(0);
    _ebrSetObjekt(_ebr.objekt);
    _ebrRenderTable();
    _ebrRenderTheorie(false);
    _ebrUpdate();
    _ebrDrawPlot();
    _pSim = new PhysicsSimEngine('ebrTakt', 'ebrKeinChart');
    _pSim.start(dt => _ebrTakt(dt), () => _ebrRender(), []);
  },

  // Schluesselexperiment 08 des KLP: kein eigener Versuch, sondern die
  // Messmethode. Geuebt wird das Auswerten nach Zeiten, Frequenzen und Spannungen.
  'oszilloskop': modal => {
    _oszInit();
    modal.innerHTML = _oszHTML();
    const erkl = document.getElementById('oszErkl');
    if (erkl) erkl.innerHTML = _oszErklHTML();
    _oszSetStation(0);
    _oszSetSensor(_osz.sensor);
    _oszUpdate();
    _pSim = new PhysicsSimEngine('oszTakt', 'oszKeinChart');
    _pSim.start(dt => _oszTakt(dt), () => _oszRender(), []);
  },

  // Schluesselexperiment 09 des KLP: Induktion aus der Lorentzkraft,
  // U = L·v·B, Hypothesenpruefung, Ringversuch und inhomogenes Feld
  'leiterschaukel': modal => {
    _lskInit();
    modal.innerHTML = _lskHTML();
    const erkl = document.getElementById('lskErkl');
    if (erkl) erkl.innerHTML = _lskErklHTML();
    _lskSetStation(0);
    _lskSetKoerper(_lsk.objekt);
    _lskSetUrsache(_lsk.ursache);
    _lskRenderTable();
    _lskRenderTheorie(false);
    _lskUpdate();
    _lskDrawPlot();
    _pSim = new PhysicsSimEngine('lskTakt', 'lskKeinChart');
    _pSim.start(dt => _lskTakt(dt), () => _lskRender(), []);
  },

  // Schluesselexperiment 10 des KLP: der Schluessel zum Minuszeichen im
  // Induktionsgesetz. Sieben Teilphasen, Lenzsche Regel, Wirbelstroeme.
  'thomson-ring': modal => {
    _thrInit();
    modal.innerHTML = _thrHTML();
    const erkl = document.getElementById('thrErkl');
    if (erkl) erkl.innerHTML = _thrErklHTML();
    _thrSetStation(0);
    _thrSetZeitlupe(4);
    _thrSetVorzeichen('ein');
    _thrSetAufbau('einzel');
    _thrSetAnw(0);
    _thrUpdate();
    _pSim = new PhysicsSimEngine('thrTakt', 'thrKeinChart');
    _pSim.start(dt => _thrTakt(dt), () => _thrRender(), []);
  },

  // Schluesselexperiment 11 des KLP: die beiden Ursachen der Induktion,
  // dazu die Abituraufgabe 2013 und Faradays Ringkern von 1831
  'leiterschleife': modal => {
    _lsfInit();
    modal.innerHTML = _lsfHTML();
    const erkl = document.getElementById('lsfErkl');
    if (erkl) erkl.innerHTML = _lsfErklHTML();
    _lsfSetStation(0);
    _lsfSetTeil('feld');
    _lsfRenderTable();
    _lsfRenderTheorie(false);
    _lsfUpdate();
    _lsfDrawPlot();
    _pSim = new PhysicsSimEngine('lsfTakt', 'lsfKeinChart');
    _pSim.start(dt => _lsfTakt(dt), () => _lsfRender(), []);
  },

  // Schluesselexperiment 12 des KLP: das Entstehen sinusfoermiger
  // Wechselspannungen, dazu der Erdinduktor von Gauss und Weber
  'generator': modal => {
    _genInit();
    modal.innerHTML = _genHTML();
    const erkl = document.getElementById('genErkl');
    if (erkl) erkl.innerHTML = _genErklHTML();
    _genSetStation(0);
    _genSetZeitlupe(4);
    _genSetEpoche(0);
    _genRenderTable();
    _genRenderTheorie(false);
    _genUpdate();
    _genDrawPlot();
    _pSim = new PhysicsSimEngine('genTakt', 'genKeinChart');
    _pSim.start(dt => _genTakt(dt), () => _genRender(), []);
  },
};

// ═══════════════════════════════════════════════════════
// ZEICHEN-HILFSFUNKTIONEN
// ═══════════════════════════════════════════════════════

function _drawRoad(ctx, cv) {
  ctx.fillStyle = '#f1f5f9'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(0, cv.height - 55, cv.width, 55);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.setLineDash([30, 20]);
  ctx.beginPath(); ctx.moveTo(0, cv.height - 27); ctx.lineTo(cv.width, cv.height - 27); ctx.stroke();
  ctx.setLineDash([]);
}

function _drawCar(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, 70, 30, 6); else ctx.rect(x, y, 70, 30);
  ctx.fill();
  ctx.fillStyle = '#93c5fd';
  ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x + 10, y - 16, 42, 18, 4); else ctx.rect(x + 10, y - 16, 42, 18);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(x + 14, y + 30, 9, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 54, y + 30, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(x + 14, y + 30, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 54, y + 30, 4, 0, Math.PI * 2); ctx.fill();
}

function _infoBox(ctx, cv, lines) {
  const x = cv.width - 8, y = 8, lh = 16;
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x - 130, y, 128, lines.length * lh + 6, 6);
  else ctx.rect(x - 130, y, 128, lines.length * lh + 6);
  ctx.fill();
  ctx.fillStyle = '#1f2937'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'right';
  lines.forEach((l, i) => ctx.fillText(l, x - 4, y + 12 + i * lh));
  ctx.textAlign = 'left';
}

// ═══════════════════════════════════════════════════════
// CSS-STYLES INLINE EINFÜGEN
// ═══════════════════════════════════════════════════════

(function injectCSS() {
  const s = document.createElement('style');
  s.textContent = `
    .sim-box-wide { max-width: 900px !important; }
    .phys-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 10px 0;
    }
    @media (max-width: 640px) {
      .phys-layout { grid-template-columns: 1fr; }
    }
    .phys-anim-cv, .phys-chart-cv {
      width: 100%;
      border-radius: 10px;
      display: block;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      cursor: crosshair;
    }
    .phys-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 8px 0;
    }
    .phys-ctrl {
      flex: 1;
      min-width: 160px;
      background: #f9fafb;
      border-radius: 10px;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
    }
    .phys-ctrl-label {
      font-size: .82rem;
      font-weight: 700;
      color: #374151;
      display: block;
      margin-bottom: 4px;
    }
    .phys-hint {
      font-size: .78rem;
      color: #6b7280;
      margin: 4px 0 8px;
      text-align: center;
    }
    .phys-btn {
      padding: 8px 18px;
      background: var(--gc, #7c3aed);
      color: #fff;
      border: none;
      border-radius: 20px;
      font-weight: 700;
      cursor: pointer;
      font-size: .88rem;
      align-self: center;
    }
    .phys-btn:hover { opacity: .88; }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════
// FEDERPENDEL – MESSREIHE & LINEARISIERUNG
// Grundlage: Handreichung "Schlüsselexperiment Federpendel" (NRW, 2023)
// T = 2π·√(m/D)  →  T² = 4π²·m/D  →  Linearisierung T²~m bzw. T²~1/D
// ═══════════════════════════════════════════════════════

const _FPM_SPRINGS = [
  { n: 'A', D: 3.4,  coils: 22, r: 17, w: 2.0, col: '#7c3aed' },
  { n: 'B', D: 10.1, coils: 16, r: 14, w: 2.8, col: '#f97316' },
  { n: 'C', D: 17.4, coils: 13, r: 11, w: 3.6, col: '#0284c7' },
  { n: 'D', D: 25.0, coils: 11, r: 9,  w: 4.4, col: '#16a34a' }
];
const _FPM_MF = 0.006;          // Federmasse in kg
const _FPM_K  = 4 * Math.PI * Math.PI;   // 39,478…

let _fpm = null;

function _fpmInit() {
  _fpm = {
    D: 10.1, m: 0.250, amp: 0.05,
    t: 0, phase: 0, speed: 1, topFlash: 0,
    springMass: false, showTheory: false, origin: true, reveal: false,
    trace: [], rows: [], nextId: 1, preset: 1, fn: null, fnAuto: false,
    sw: { state: 'idle', t0: 0, n: 0, elapsed: 0, result: null }
  };
}

function _fpmNum(v, d) { return isFinite(v) ? v.toFixed(d).replace('.', ',') : '—'; }
function _fpmMeff() { return _fpm.m + (_fpm.springMass ? _FPM_MF / 3 : 0); }
function _fpmOmega() { return Math.sqrt(_fpm.D / _fpmMeff()); }
function _fpmTtheo() { return 2 * Math.PI / _fpmOmega(); }
function _fpmSpring() { return _FPM_SPRINGS.find(s => s.D === _fpm.D) || _FPM_SPRINGS[1]; }

// ── Aufbau der Oberfläche ──────────────────────────────
function _fpmHTML() {
  const springBtns = _FPM_SPRINGS.map(s =>
    `<button class="fpm-spring${s.D === _fpm.D ? ' on' : ''}" id="fpmSp${s.n}" onclick="_fpmSetSpring(${s.D})">
       <span class="fpm-spring-n">Feder ${s.n}</span>
       <span class="fpm-spring-d">D = ${_fpmNum(s.D, 1)}</span>
       <span class="fpm-spring-u">N/m</span>
     </button>`).join('');

  const presets = ['m → T', 'm → T²', '1/D → T²', 'm/D → T²'].map((p, i) =>
    `<button class="fpm-tab${i === _fpm.preset ? ' on' : ''}" id="fpmTab${i}" onclick="_fpmSetPreset(${i})">${p}</button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">🌀 Federpendel: das Schlüsselexperiment</h3>

    <div class="fpm-grid">
      <div>
        <canvas id="fpmAnim" width="420" height="300" class="phys-anim-cv"></canvas>
        <div class="fpm-label">Feder austauschen</div>
        <div class="fpm-springs">${springBtns}</div>
        <div class="phys-ctrl" style="margin-top:8px">
          <span class="phys-ctrl-label">Masse m: <b id="fpmMLbl">250 g</b></span>
          <input type="range" id="fpmM" min="10" max="500" step="5" value="250"
            oninput="_fpmSetM(this.value)" style="width:100%;accent-color:#7c3aed">
        </div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Amplitude ŝ: <b id="fpmALbl">5,0 cm</b></span>
          <input type="range" id="fpmA" min="1" max="10" step="0.5" value="5"
            oninput="_fpmSetAmp(this.value)" style="width:100%;accent-color:#7c3aed">
        </div>
        <label class="fpm-check"><input type="checkbox" onchange="_fpmSet('springMass',this.checked)">
          Federmasse m<sub>F</sub> = 6 g mitrechnen</label>
        <label class="fpm-check"><input type="checkbox" onchange="_fpmSet('reveal',this.checked)">
          theoretische Periodendauer anzeigen</label>
      </div>

      <div>
        <div class="fpm-label">Periodendauer messen</div>
        <div class="fpm-readout">
          <div class="fpm-ro"><span class="fpm-ro-k">Stoppuhr t</span><span class="fpm-ro-v" id="fpmT">0,00</span><span class="fpm-ro-u">s</span></div>
          <div class="fpm-ro"><span class="fpm-ro-k">Perioden n</span><span class="fpm-ro-v" id="fpmN">0</span><span class="fpm-ro-u">gezählt</span></div>
          <div class="fpm-ro"><span class="fpm-ro-k">T = t / n</span><span class="fpm-ro-v" id="fpmTT">—</span><span class="fpm-ro-u">s</span></div>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="fpmStartBtn" onclick="_fpmStart()">▶ Start</button>
          <button class="sim-btn" id="fpmStopBtn" onclick="_fpmStop()" disabled>■ Stopp</button>
          <button class="sim-btn" id="fpmTakeBtn" onclick="_fpmTake()" disabled>✓ Messwert übernehmen</button>
        </div>
        <label class="fpm-check"><input type="checkbox" id="fpmTrig">
          Genauer messen: Uhr erst am oberen Umkehrpunkt starten</label>
        <div class="sim-btn-row">
          <button class="sim-btn" onclick="_fpmAuto()">⏱ Lichtschranke: 10 Perioden</button>
          <button class="sim-btn" onclick="_fpmDemo()">📋 Beispielmessreihe</button>
          <button class="sim-btn" onclick="_fpmClear()">🗑 Tabelle leeren</button>
        </div>
        <div class="fpm-tablewrap">
          <table class="sim-table">
            <thead><tr><th>m (kg)</th><th>D (N/m)</th><th>n</th><th>t (s)</th><th>T (s)</th><th>T² (s²)</th><th></th></tr></thead>
            <tbody id="fpmTbody"></tbody>
          </table>
          <div class="fpm-empty" id="fpmEmpty">Noch keine Messwerte.<br>Start → Perioden zählen → Stopp → übernehmen.</div>
        </div>
      </div>
    </div>

    <div class="fpm-label" style="margin-top:12px">Auswertung – Achsen wechseln, bis die Punkte auf einer Ursprungsgeraden liegen</div>
    <div class="fpm-tabs">${presets}</div>
    <div class="fpm-grid2">
      <canvas id="fpmPlot" width="470" height="330" class="phys-chart-cv"></canvas>
      <div>
        <div class="fpm-fit" id="fpmFit"></div>
        <div class="fpm-label" style="margin-top:10px">Funktion plotten</div>
        <input type="text" id="fpmFn" class="fpm-input" placeholder="z. B. 39.478*x" spellcheck="false"
          oninput="_fpmSetFn(this.value)">
        <div class="fpm-err" id="fpmFnErr"></div>
        <div class="sim-btn-row" style="padding:2px 0 4px">
          <button class="sim-btn primary" onclick="_fpmTheorieFn()">ƒ Theoriefunktion</button>
          <button class="sim-btn" onclick="_fpmClearFn()">Feld leeren</button>
        </div>
        <div class="fpm-theo" id="fpmTheo"></div>
        <div class="fpm-note">Erlaubt: x, pi, + − * / ^, sqrt(), sin(), cos(), abs(), exp(), ln(). Malpunkt immer schreiben.</div>
        <label class="fpm-check"><input type="checkbox" checked onchange="_fpmSet('origin',this.checked)">
          Ausgleichsgerade durch den Ursprung</label>
        <label class="fpm-check"><input type="checkbox" onchange="_fpmSet('showTheory',this.checked)">
          Theoriekurve einblenden</label>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>T = 2π·√(m/D)</b> &nbsp;⇒&nbsp; <b>T² = 4π² · m/D</b> &nbsp;|&nbsp; Variablen-Kontroll-Strategie: immer nur <i>eine</i> Größe verändern
    </p>
  </div>`;
}

// ── Bedienung ──────────────────────────────────────────
function _fpmSet(key, val) { _fpm[key] = val; if (key === 'springMass') _fpmResetSW(); _fpmDrawPlot(); }
function _fpmSetSpring(D) {
  _fpm.D = D; _fpm.trace = []; _fpmResetSW();
  _FPM_SPRINGS.forEach(s => document.getElementById('fpmSp' + s.n)?.classList.toggle('on', s.D === D));
  _fpmRefreshTheorie();
}
function _fpmSetM(v) {
  _fpm.m = +v / 1000; _fpm.trace = []; _fpmResetSW();
  const el = document.getElementById('fpmMLbl'); if (el) el.textContent = Math.round(+v) + ' g';
  _fpmRefreshTheorie();
}
function _fpmSetAmp(v) {
  _fpm.amp = +v / 100;
  const el = document.getElementById('fpmALbl'); if (el) el.textContent = _fpmNum(+v, 1) + ' cm';
}
function _fpmSetPreset(i) {
  _fpm.preset = i;
  for (let k = 0; k < 4; k++) document.getElementById('fpmTab' + k)?.classList.toggle('on', k === i);
  _fpmRefreshTheorie();
  _fpmDrawPlot();
}

// ── Stoppuhr ───────────────────────────────────────────
function _fpmResetSW() {
  if (!_fpm) return;
  _fpm.sw = { state: 'idle', t0: 0, n: 0, elapsed: 0, result: null };
  _fpmUpdateSW();
}
function _fpmStart() {
  // Scharf gestellte Uhr laesst sich mit demselben Knopf wieder abbrechen
  if (_fpm.sw.state === 'armed') { _fpmResetSW(); return; }
  if (document.getElementById('fpmTrig')?.checked) {
    _fpm.sw = { state: 'armed', t0: 0, n: 0, elapsed: 0, result: null };
  } else {
    _fpm.sw = { state: 'running', t0: _fpm.t, n: 0, elapsed: 0, result: null };
  }
  _fpmUpdateSW();
}
function _fpmStop() {
  const sw = _fpm.sw;
  if (sw.state === 'armed') { _fpmResetSW(); return; }   // Stopp bricht das Warten ab
  if (sw.state !== 'running') return;
  sw.state = 'stopped';
  sw.elapsed = _fpm.t - sw.t0;
  sw.result = sw.n > 0 ? sw.elapsed / sw.n : null;
  _fpmUpdateSW();
}
function _fpmUpdateSW() {
  const sw = _fpm.sw;
  const armed = sw.state === 'armed', running = sw.state === 'running';
  const tEl = document.getElementById('fpmT');
  if (tEl) {
    tEl.textContent = armed ? 'wartet…' : _fpmNum(sw.elapsed, 2);
    tEl.style.color = armed ? '#f97316' : '#7c3aed';
  }
  const nEl = document.getElementById('fpmN'); if (nEl) nEl.textContent = sw.n;
  const ttEl = document.getElementById('fpmTT'); if (ttEl) ttEl.textContent = sw.result ? _fpmNum(sw.result, 3) : '—';
  // Stopp bleibt auch im Wartezustand bedienbar – ein toter Knopf verwirrt nur
  const stop = document.getElementById('fpmStopBtn'); if (stop) stop.disabled = !(running || armed);
  const take = document.getElementById('fpmTakeBtn'); if (take) take.disabled = !(sw.state === 'stopped' && sw.result);
  const st = document.getElementById('fpmStartBtn');
  if (st) {
    st.textContent = armed ? '✕ Abbrechen' : running ? '↻ Neu starten' : '▶ Start';
    st.classList.toggle('fpm-waiting', armed);
  }
}
function _fpmTake() {
  if (!_fpm.sw.result) return;
  _fpmAddRow(_fpm.m, _fpm.D, _fpm.sw.n, _fpm.sw.elapsed, _fpm.sw.result);
  _fpmResetSW();
}
function _fpmAuto() {
  const n = 10, t = n * _fpmTtheo() * (1 + (Math.random() - 0.5) * 0.006);
  _fpmAddRow(_fpm.m, _fpm.D, n, t, t / n);
}

// ── Messwerttabelle ────────────────────────────────────
function _fpmAddRow(m, D, n, t, T) {
  _fpm.rows.push({ id: _fpm.nextId++, m, D, n, t, T });
  _fpmRenderTable(); _fpmDrawPlot();
}
function _fpmDelRow(id) {
  _fpm.rows = _fpm.rows.filter(r => r.id !== id);
  _fpmRenderTable(); _fpmDrawPlot();
}
function _fpmClear() {
  if (_fpm.rows.length && !confirm('Alle ' + _fpm.rows.length + ' Messwerte löschen?')) return;
  _fpm.rows = []; _fpmRenderTable(); _fpmDrawPlot();
}
function _fpmDemo() {
  [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40].forEach(m => {
    const T = 2 * Math.PI * Math.sqrt((m + _FPM_MF / 3) / 10.1) * (1 + (Math.random() - 0.5) * 0.012);
    _fpm.rows.push({ id: _fpm.nextId++, m, D: 10.1, n: 10, t: T * 10, T });
  });
  [3.4, 17.4, 25.0].forEach(D => {
    const T = 2 * Math.PI * Math.sqrt((0.25 + _FPM_MF / 3) / D) * (1 + (Math.random() - 0.5) * 0.012);
    _fpm.rows.push({ id: _fpm.nextId++, m: 0.25, D, n: 10, t: T * 10, T });
  });
  _fpmRenderTable(); _fpmDrawPlot();
}
function _fpmColD(D) { return (_FPM_SPRINGS.find(s => s.D === D) || {}).col || '#64748b'; }
function _fpmRenderTable() {
  const tb = document.getElementById('fpmTbody'); if (!tb) return;
  const empty = document.getElementById('fpmEmpty');
  if (empty) empty.style.display = _fpm.rows.length ? 'none' : 'block';
  tb.innerHTML = _fpm.rows.map(r =>
    `<tr>
       <td><span class="fpm-dot" style="background:${_fpmColD(r.D)}"></span>${_fpmNum(r.m, 3)}</td>
       <td>${_fpmNum(r.D, 1)}</td><td>${r.n}</td><td>${_fpmNum(r.t, 2)}</td>
       <td><b>${_fpmNum(r.T, 3)}</b></td><td>${_fpmNum(r.T * r.T, 4)}</td>
       <td class="fpm-del" onclick="_fpmDelRow(${r.id})" title="löschen">✕</td>
     </tr>`).join('');
}

// ── Simulation & Zeichnung der Apparatur ───────────────
function _fpmElong(t) {
  return _fpm.amp * Math.cos(_fpmOmega() * t);
}
function _fpmUpdate(dt) {
  if (!_fpm) return;
  const step = dt * _fpm.speed;
  const prev = _fpm.phase;
  _fpm.t += step;
  _fpm.phase += _fpmOmega() * step;
  // oberer Umkehrpunkt = Phase passiert ein Vielfaches von 2π
  if (Math.floor(_fpm.phase / (2 * Math.PI)) > Math.floor(prev / (2 * Math.PI))) {
    _fpm.topFlash = 1;
    if (_fpm.sw.state === 'armed') { _fpm.sw.state = 'running'; _fpm.sw.t0 = _fpm.t; _fpm.sw.n = 0; }
    else if (_fpm.sw.state === 'running') _fpm.sw.n++;
  }
  if (_fpm.sw.state === 'running') _fpm.sw.elapsed = _fpm.t - _fpm.sw.t0;
  _fpm.topFlash = Math.max(0, _fpm.topFlash - step * 3);
  _fpm.trace.push({ t: _fpm.t, s: _fpmElong(_fpm.t) });
  while (_fpm.trace.length && _fpm.t - _fpm.trace[0].t > 6) _fpm.trace.shift();
  _fpmUpdateSW();
}

function _fpmDrawApparatus(ctx, cv) {
  if (!_fpm) return;
  const W = cv.width, H = cv.height, sp = _fpmSpring();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f0f9ff'; ctx.fillRect(0, 0, W, H);

  const scopeH = 74, aH = H - scopeH;
  const cx = W * 0.42, topY = 24, PX = 620;
  let restLen = 70 + (_fpm.m * 9.81 / _fpm.D) * PX * 0.5;
  restLen = Math.min(restLen, aH - 96);
  const zero = topY + restLen;
  const s = _fpmElong(_fpm.t);
  const massY = zero + s * PX;

  // Stativ
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 95, aH - 8); ctx.lineTo(cx - 95, topY - 8); ctx.lineTo(cx + 12, topY - 8); ctx.stroke();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx - 130, aH - 6); ctx.lineTo(cx - 55, aH - 6); ctx.stroke();

  // Skala
  ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  for (let k = -10; k <= 10; k++) {
    const y = zero + k * 0.01 * PX;
    if (y < topY + 6 || y > aH - 12) continue;
    const big = k % 5 === 0;
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx + 62, y); ctx.lineTo(cx + 62 + (big ? 11 : 5), y); ctx.stroke();
    if (big) { ctx.fillStyle = '#94a3b8'; ctx.fillText((-k) + ' cm', cx + 77, y + 3); }
  }
  // Ruhelage
  ctx.strokeStyle = '#7c3aed'; ctx.setLineDash([5, 4]); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx - 46, zero); ctx.lineTo(cx + 62, zero); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#7c3aed'; ctx.font = '700 9px sans-serif';
  ctx.fillText('Ruhelage', cx - 46, zero - 4);

  // oberer Umkehrpunkt (blinkt beim Durchgang → Zählhilfe)
  const rev = zero - _fpm.amp * PX;
  ctx.strokeStyle = _fpm.topFlash > 0 ? '#f97316' : '#e2e8f0';
  ctx.lineWidth = _fpm.topFlash > 0 ? 2.5 : 1;
  ctx.beginPath(); ctx.moveTo(cx - 46, rev); ctx.lineTo(cx + 62, rev); ctx.stroke();
  ctx.fillStyle = _fpm.topFlash > 0 ? '#f97316' : '#94a3b8';
  ctx.fillText(_fpm.sw.state === 'armed' ? 'Uhr startet hier ⏳' : 'oberer Umkehrpunkt', cx - 46, rev - 4);

  // Feder
  ctx.strokeStyle = sp.col; ctx.lineWidth = sp.w; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(cx, topY);
  const len = massY - topY, N = 220;
  for (let i = 1; i <= N; i++) {
    const u = i / N, env = Math.min(1, Math.min(u, 1 - u) * 8);
    ctx.lineTo(cx + Math.sin(u * sp.coils * 2 * Math.PI) * sp.r * env, topY + u * len);
  }
  ctx.stroke();

  // Masse
  const bw = 54, bh = 26 + Math.min(22, _fpm.m * 40);
  ctx.fillStyle = '#475569';
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - bw / 2, massY, bw, bh, 4) : ctx.rect(cx - bw / 2, massY, bw, bh);
  ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(Math.round(_fpm.m * 1000) + ' g', cx, massY + bh / 2 + 4);
  ctx.textAlign = 'left';

  // Infozeile
  ctx.fillStyle = '#1e293b'; ctx.font = '700 11px sans-serif';
  ctx.fillText('Feder ' + sp.n + ' · D = ' + _fpmNum(sp.D, 1) + ' N/m', 8, 15);
  ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif';
  ctx.fillText('s = ' + _fpmNum(-s * 100, 1) + ' cm', 8, 30);
  if (_fpm.reveal) {
    ctx.fillStyle = '#16a34a'; ctx.font = '700 10px sans-serif';
    ctx.fillText('T_theorie = ' + _fpmNum(_fpmTtheo(), 3) + ' s', 8, 45);
  }

  // t-s-Streifen (Oszillogramm)
  const sy = aH;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, sy, W, scopeH);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, sy + scopeH / 2); ctx.lineTo(W, sy + scopeH / 2); ctx.stroke();
  if (_fpm.trace.length > 1) {
    const t1 = _fpm.trace[_fpm.trace.length - 1].t, sc = (scopeH / 2 - 7) / Math.max(0.01, _fpm.amp);
    ctx.strokeStyle = sp.col; ctx.lineWidth = 1.8; ctx.beginPath();
    _fpm.trace.forEach((p, i) => {
      const x = W - (t1 - p.t) / 6 * W, y = sy + scopeH / 2 - p.s * sc;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif';
  ctx.fillText('t-s-Diagramm (letzte 6 s)', 8, sy + 12);
}

// ── Ausgleichsrechnung ─────────────────────────────────
function _fpmFitOrigin(pts) {
  let sxy = 0, sxx = 0;
  pts.forEach(p => { sxy += p.x * p.y; sxx += p.x * p.x; });
  if (!sxx) return null;
  const k = sxy / sxx;
  let ssr = 0, sst = 0;
  pts.forEach(p => { ssr += (p.y - k * p.x) ** 2; sst += p.y * p.y; });
  return { k, b: 0, r2: sst > 0 ? 1 - ssr / sst : 1 };
}
function _fpmFitLinear(pts) {
  const n = pts.length;
  let sx = 0, sy = 0, sxy = 0, sxx = 0;
  pts.forEach(p => { sx += p.x; sy += p.y; sxy += p.x * p.y; sxx += p.x * p.x; });
  const den = n * sxx - sx * sx;
  if (!den) return null;
  const k = (n * sxy - sx * sy) / den, b = (sy - k * sx) / n, my = sy / n;
  let ssr = 0, sst = 0;
  pts.forEach(p => { ssr += (p.y - (k * p.x + b)) ** 2; sst += (p.y - my) ** 2; });
  return { k, b, r2: sst > 0 ? 1 - ssr / sst : 1 };
}

// ── Formelparser (Shunting-Yard, ohne eval) ────────────
const _FPM_FN = {
  sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan,
  abs: Math.abs, exp: Math.exp, ln: Math.log, log: v => Math.log(v) / Math.LN10
};
const _FPM_OP = { '+': [1, 'L'], '-': [1, 'L'], '*': [2, 'L'], '/': [2, 'L'], '^': [4, 'R'], 'u-': [3, 'R'] };

function _fpmTokenize(src) {
  const s = src.replace(/,/g, '.').replace(/·/g, '*').replace(/−/g, '-').replace(/\s+/g, '');
  const out = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++;
      out.push({ t: 'num', v: parseFloat(s.slice(i, j)) }); i = j;
    } else if (/[a-z]/i.test(c)) {
      let j = i; while (j < s.length && /[a-z0-9]/i.test(s[j])) j++;
      const w = s.slice(i, j).toLowerCase(); i = j;
      if (_FPM_FN[w]) out.push({ t: 'fn', v: w });
      else if (w === 'x') out.push({ t: 'var' });
      else if (w === 'pi') out.push({ t: 'num', v: Math.PI });
      else if (w === 'e') out.push({ t: 'num', v: Math.E });
      else throw new Error('unbekannt: ' + w);
    } else if ('+-*/^'.includes(c)) { out.push({ t: 'op', v: c }); i++; }
    else if (c === '(' || c === ')') { out.push({ t: c }); i++; }
    else throw new Error('ungültiges Zeichen: ' + c);
  }
  return out;
}
function _fpmRPN(tokens) {
  const out = [], st = [];
  let prev = null;
  tokens.forEach(tk => {
    if (tk.t === 'num' || tk.t === 'var') out.push(tk);
    else if (tk.t === 'fn') st.push(tk);
    else if (tk.t === 'op') {
      const name = (tk.v === '-' && (!prev || prev.t === 'op' || prev.t === '(')) ? 'u-' : tk.v;
      while (st.length) {
        const top = st[st.length - 1];
        if (top.t === 'fn' || (top.t === 'op' &&
          (_FPM_OP[top.v][0] > _FPM_OP[name][0] ||
           (_FPM_OP[top.v][0] === _FPM_OP[name][0] && _FPM_OP[name][1] === 'L')))) out.push(st.pop());
        else break;
      }
      st.push({ t: 'op', v: name });
    }
    else if (tk.t === '(') st.push(tk);
    else if (tk.t === ')') {
      while (st.length && st[st.length - 1].t !== '(') out.push(st.pop());
      if (!st.length) throw new Error('Klammer fehlt');
      st.pop();
      if (st.length && st[st.length - 1].t === 'fn') out.push(st.pop());
    }
    prev = tk;
  });
  while (st.length) { const s2 = st.pop(); if (s2.t === '(') throw new Error('Klammer fehlt'); out.push(s2); }
  return out;
}
function _fpmMakeFn(src) {
  const rpn = _fpmRPN(_fpmTokenize(src));
  return x => {
    const st = [];
    for (const tk of rpn) {
      if (tk.t === 'num') st.push(tk.v);
      else if (tk.t === 'var') st.push(x);
      else if (tk.t === 'fn') { if (!st.length) throw new Error('Argument fehlt'); st.push(_FPM_FN[tk.v](st.pop())); }
      else if (tk.v === 'u-') { if (!st.length) throw new Error('Operand fehlt'); st.push(-st.pop()); }
      else {
        if (st.length < 2) throw new Error('Operand fehlt');
        const b = st.pop(), a = st.pop();
        st.push(tk.v === '+' ? a + b : tk.v === '-' ? a - b : tk.v === '*' ? a * b : tk.v === '/' ? a / b : Math.pow(a, b));
      }
    }
    if (st.length !== 1) throw new Error('Term unvollständig');
    return st[0];
  };
}
// Setzt den theoretisch erwarteten Term ein und benennt den Funktionstyp
function _fpmTheorieFn() {
  const P = _FPM_PRESETS[_fpm.preset];
  const term = P.term();
  const inp = document.getElementById('fpmFn');
  if (inp) inp.value = term;
  _fpmSetFn(term);
  _fpm.fnAuto = true;
  _fpmRenderTheorie(true);
}
function _fpmClearFn() {
  const inp = document.getElementById('fpmFn');
  if (inp) inp.value = '';
  _fpmSetFn('');
  _fpmRenderTheorie(false);
}
// Haelt einen eingesetzten Theorieterm aktuell, wenn Feder, Masse oder Auftragung wechseln
function _fpmRefreshTheorie() {
  if (_fpm.fnAuto) {
    const term = _FPM_PRESETS[_fpm.preset].term();
    const inp = document.getElementById('fpmFn');
    if (inp) inp.value = term;
    _fpmSetFn(term);
    _fpm.fnAuto = true;
  }
  _fpmRenderTheorie(_fpm.fnAuto);
}
// Zeigt an, WELCHE Art von Funktion in der aktuellen Auftragung zu erwarten ist
function _fpmRenderTheorie(eingesetzt) {
  const el = document.getElementById('fpmTheo');
  if (!el) return;
  const P = _FPM_PRESETS[_fpm.preset];
  el.innerHTML =
    `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
     <div class="fpm-theo-typ">${P.typ}</div>
     <div class="fpm-theo-form">${P.form}</div>
     <div class="fpm-theo-par">${P.param()}</div>
     ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${P.term()}</div>` : ''}
     <div class="fpm-theo-deutung">${P.deutung}</div>`;
}

function _fpmSetFn(str) {
  _fpm.fnAuto = false;
  const err = document.getElementById('fpmFnErr');
  const v = (str || '').trim();
  if (!v) { _fpm.fn = null; if (err) err.textContent = ''; _fpmDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _fpm.fn = f; if (err) err.textContent = '';
  } catch (e) { _fpm.fn = null; if (err) err.textContent = e.message; }
  _fpmDrawPlot();
}

// ── Auswertungsdiagramm ────────────────────────────────
const _FPM_PRESETS = [
  { xl: 'm in kg', yl: 'T in s', x: r => r.m, y: r => r.T, grp: r => r.D,
    gl: k => 'D = ' + _fpmNum(+k, 1) + ' N/m', curve: true,
    note: 'Die Punkte liegen auf einer Kurve – kein linearer Zusammenhang. Quadriere T und wechsle zur Auftragung m → T².',
    typ: 'Wurzelfunktion', form: 'T(m) = 2π · √( m / D )',
    term: () => '2*pi*sqrt(x/' + _fpm.D + ')',
    param: () => 'D = ' + _fpmNum(_fpm.D, 1) + ' N/m (gewählte Feder)',
    deutung: 'Keine Gerade, sondern eine Wurzelkurve: vervierfachst du die Masse, verdoppelt sich T. Aus einer Kurve lässt sich schlecht etwas ablesen – deshalb linearisiert man.' },
  { xl: 'm in kg', yl: 'T² in s²', x: r => r.m, y: r => r.T * r.T, grp: r => r.D,
    gl: k => 'D = ' + _fpmNum(+k, 1) + ' N/m', slope: k => _FPM_K / +k,
    note: 'Ursprungsgerade ⇒ T² ~ m. Erwartete Steigung: 4π²/D.',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'T²(m) = (4π² / D) · m',
    term: () => '4*pi^2/' + _fpm.D + '*x',
    param: () => 'Steigung 4π²/D = ' + _fpmNum(_FPM_K / _fpm.D, 3) + ' s²/kg',
    deutung: 'Durch das Quadrieren wird aus der Wurzelkurve eine Gerade durch den Ursprung: T² ist proportional zu m.' },
  { xl: '1/D in m/N', yl: 'T² in s²', x: r => 1 / r.D, y: r => r.T * r.T, grp: r => r.m,
    gl: k => 'm = ' + _fpmNum(+k, 3) + ' kg', slope: k => _FPM_K * +k,
    note: 'Ursprungsgerade ⇒ T² ~ 1/D. Erwartete Steigung: 4π²·m.',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'T²(1/D) = 4π² · m · (1/D)',
    term: () => '4*pi^2*' + _fpm.m + '*x',
    param: () => 'Steigung 4π²·m = ' + _fpmNum(_FPM_K * _fpm.m, 3) + ' s²·N/(kg·m) bei m = ' + _fpmNum(_fpm.m, 3) + ' kg',
    deutung: 'Nicht D selbst, sondern der Kehrwert 1/D liefert die Gerade: T² ist umgekehrt proportional zu D. Steifere Feder, kürzere Periode.' },
  { xl: 'm/D in kg·m/N', yl: 'T² in s²', x: r => r.m / r.D, y: r => r.T * r.T, grp: null,
    slope: () => _FPM_K,
    note: 'Alle Messwerte zusammen. Die Steigung ist der gesuchte Proportionalitätsfaktor k ≈ 4π².',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'T²(m/D) = 4π² · (m/D)',
    term: () => '4*pi^2*x',
    param: () => 'Steigung 4π² = 39,478 – unabhängig von Feder und Masse',
    deutung: 'Beide Abhängigkeiten in einem Diagramm. Die Steigung ist eine reine Zahl: 4π². Nach T aufgelöst steht da T = 2π·√(m/D).' }
];

function _fpmTicks(max, count) {
  let step = Math.pow(10, Math.floor(Math.log10(max / count)));
  const err = max / count / step;
  if (err >= 7.5) step *= 10; else if (err >= 3.5) step *= 5; else if (err >= 1.5) step *= 2;
  const out = [];
  for (let v = 0; v <= max * 1.0001; v += step) out.push(v);
  return { ticks: out, step };
}
function _fpmTickLbl(v, step) {
  const d = step < 0.001 ? 4 : step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0;
  return _fpmNum(v, d);
}

function _fpmDrawPlot() {
  const cv = document.getElementById('fpmPlot');
  if (!cv || !_fpm) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _FPM_PRESETS[_fpm.preset];
  const padL = 62, padR = 14, padT = 14, padB = 40;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const pts = _fpm.rows.map(r => ({ x: P.x(r), y: P.y(r) })).filter(p => isFinite(p.x) && isFinite(p.y));
  let xmax = pts.length ? Math.max(...pts.map(p => p.x)) * 1.15 : 1;
  let ymax = pts.length ? Math.max(...pts.map(p => p.y)) * 1.15 : 1;
  if (_fpm.fn) for (let i = 0; i <= 20; i++) {
    let v; try { v = _fpm.fn(xmax * i / 20); } catch (e) { v = NaN; }
    if (isFinite(v) && v > ymax) ymax = v * 1.05;
  }
  if (!(xmax > 0) || !isFinite(xmax)) xmax = 1;
  if (!(ymax > 0) || !isFinite(ymax)) ymax = 1;

  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - v / ymax * (y0 - y1);

  // Gitter & Achsen
  const xt = _fpmTicks(xmax, 6), yt = _fpmTicks(ymax, 5);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 14);
  });
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 6, Y(v) + 3);
  });
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 28);
  ctx.save(); ctx.translate(13, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'right'; ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (!pts.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte aufgenommen', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('fpmFit');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    return;
  }

  // Nutzerfunktion
  if (_fpm.fn) {
    ctx.strokeStyle = '#db2777'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let started = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _fpm.fn((px - x0) / (x1 - x0) * xmax); } catch (e) { yv = NaN; }
      if (!isFinite(yv)) { started = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { started = false; continue; }
      started ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), started = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  // Gruppen (je Feder bzw. je Masse)
  const groups = [];
  if (P.grp) {
    const map = new Map();
    _fpm.rows.forEach(r => {
      const k = P.grp(r);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(r);
    });
    [...map.keys()].sort((a, b) => a - b).forEach(k => groups.push({ key: k, rows: map.get(k) }));
  } else groups.push({ key: null, rows: _fpm.rows });

  const palette = ['#7c3aed', '#f97316', '#0284c7', '#16a34a', '#db2777'];
  const info = [];

  groups.forEach((g, gi) => {
    const col = _fpm.preset <= 1 ? _fpmColD(g.key) : (_fpm.preset === 3 ? '#7c3aed' : palette[gi % 5]);
    const gp = g.rows.map(r => ({ x: P.x(r), y: P.y(r) })).filter(p => isFinite(p.x) && isFinite(p.y));

    // Theoriekurve
    if (_fpm.showTheory) {
      ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
      ctx.beginPath();
      let first = true;
      for (let px = x0; px <= x1; px += 3) {
        const xv = (px - x0) / (x1 - x0) * xmax;
        const yv = P.curve ? 2 * Math.PI * Math.sqrt(Math.max(0, xv) / (g.key || _fpm.D)) : P.slope(g.key) * xv;
        const py = Y(yv);
        if (py < y1 - 20) { first = true; continue; }
        first ? (ctx.moveTo(px, py), first = false) : ctx.lineTo(px, py);
      }
      ctx.stroke(); ctx.setLineDash([]);
    }

    // Ausgleichsgerade
    let fit = null;
    if (!P.curve && gp.length >= 2) {
      fit = _fpm.origin ? _fpmFitOrigin(gp) : _fpmFitLinear(gp);
      if (fit) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(0), Y(fit.b)); ctx.lineTo(X(xmax), Y(fit.k * xmax + fit.b)); ctx.stroke();
      }
    }

    // Messpunkte
    gp.forEach(p => {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 4, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke();
    });

    info.push({ key: g.key, col, fit, n: gp.length });
  });

  _fpmRenderFit(info, P);
}

function _fpmRenderFit(groups, P) {
  const el = document.getElementById('fpmFit');
  if (!el) return;
  if (P.curve) { el.innerHTML = '<div class="fpm-note">' + P.note + '</div>'; return; }

  let html = '';
  groups.forEach(g => {
    if (!g.fit) return;
    const name = g.key === null ? 'alle Messwerte' : P.gl(g.key);
    const eq = 'y = ' + _fpmNum(g.fit.k, g.fit.k < 1 ? 4 : 3) + '·x' +
      (_fpm.origin ? '' : (g.fit.b >= 0 ? ' + ' : ' − ') + _fpmNum(Math.abs(g.fit.b), 4));
    html += `<div class="fpm-fitline">
       <span class="fpm-fitmeta"><span class="fpm-dot" style="background:${g.col}"></span>${name} · ${g.n} Messwerte</span>
       <span class="fpm-fiteq">${eq}</span>
       <span class="fpm-fitmeta">R² = ${_fpmNum(g.fit.r2, 4)}${P.slope ? ' · erwartet: ' + _fpmNum(P.slope(g.key), P.slope(g.key) < 1 ? 4 : 3) : ''}</span>
     </div>`;
  });

  if (!html) {
    el.innerHTML = '<div class="fpm-note">Mindestens zwei Messwerte je Messreihe nötig.<br>' + P.note + '</div>';
    return;
  }
  // Abschluss: Vergleich mit 4π² bei der Auftragung m/D → T²
  if (_fpm.preset === 3 && groups[0] && groups[0].fit) {
    const k = groups[0].fit.k, dev = Math.abs(k - _FPM_K) / _FPM_K * 100;
    const cls = dev < 1 ? 'ok' : dev < 5 ? 'mid' : 'no';
    html += `<div class="fpm-fitline" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">
        <span class="fpm-fitmeta">k<sub>exp</sub> = ${_fpmNum(k, 3)} &nbsp;·&nbsp; 4π² = 39,478</span>
        <span class="fpm-badge ${cls}">Abweichung ${_fpmNum(dev, 2)} %</span>
        <span class="fpm-fitmeta" style="margin-top:3px">T² = k·m/D &nbsp;⇒&nbsp; T = 2π·√(m/D)</span>
      </div>`;
  }
  el.innerHTML = html + '<div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">' + P.note + '</div>';
}

// ── Zusätzliche Styles für diese Simulation ────────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .fpm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
    .fpm-grid2 { display: grid; grid-template-columns: 1fr 300px; gap: 14px; align-items: start; }
    @media (max-width: 780px) {
      .fpm-grid, .fpm-grid2 { grid-template-columns: 1fr; }
    }
    .fpm-label { font-size: .74rem; font-weight: 800; color: #64748b; text-transform: uppercase;
      letter-spacing: .06em; margin: 10px 0 5px; }
    .fpm-springs { display: flex; gap: 6px; flex-wrap: wrap; }
    .fpm-spring { flex: 1 1 68px; display: flex; flex-direction: column; gap: 1px; align-items: flex-start;
      padding: 6px 8px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 9px; cursor: pointer; }
    .fpm-spring:hover { border-color: #cbd5e1; }
    .fpm-spring.on { border-color: #7c3aed; background: #f5f3ff; }
    .fpm-spring-n { font-size: .68rem; font-weight: 800; color: #64748b; }
    .fpm-spring.on .fpm-spring-n { color: #7c3aed; }
    .fpm-spring-d { font-size: .84rem; font-weight: 800; color: #1e293b; }
    .fpm-spring-u { font-size: .62rem; color: #94a3b8; }
    .fpm-check { display: flex; align-items: center; gap: 7px; font-size: .78rem; color: #475569;
      margin-top: 6px; cursor: pointer; }
    .fpm-check input { accent-color: #7c3aed; width: 15px; height: 15px; }
    .fpm-readout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .fpm-ro { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 7px 9px;
      display: flex; flex-direction: column; gap: 1px; }
    .fpm-ro-k { font-size: .64rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
    .fpm-ro-v { font-size: 1.15rem; font-weight: 800; color: #7c3aed; font-variant-numeric: tabular-nums; }
    .fpm-ro-u { font-size: .64rem; color: #94a3b8; }
    .fpm-tablewrap { max-height: 210px; overflow: auto; border: 1px solid #e2e8f0; border-radius: 9px; margin-top: 8px; }
    .fpm-tablewrap .sim-table { margin-top: 0; font-variant-numeric: tabular-nums; }
    .fpm-tablewrap .sim-table th { position: sticky; top: 0; z-index: 1; font-size: .7rem; }
    .fpm-empty { padding: 16px 12px; text-align: center; color: #94a3b8; font-size: .78rem; }
    .fpm-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; }
    .fpm-del { color: #cbd5e1; cursor: pointer; text-align: center; }
    .fpm-del:hover { color: #dc2626; }
    .fpm-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
    .fpm-tab { padding: 6px 12px; border: 1px solid #e2e8f0; background: #fff; border-radius: 18px;
      font-size: .8rem; font-weight: 700; color: #64748b; cursor: pointer; }
    .fpm-tab:hover { border-color: #cbd5e1; }
    .fpm-tab.on { background: #7c3aed; border-color: #7c3aed; color: #fff; }
    .fpm-fit { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 9px 11px; }
    .fpm-fitline { display: flex; flex-direction: column; gap: 1px; margin-bottom: 7px; }
    .fpm-fiteq { font-size: .86rem; font-weight: 800; color: #1e293b; font-variant-numeric: tabular-nums; }
    .fpm-fitmeta { font-size: .7rem; color: #64748b; }
    .fpm-badge { display: inline-block; align-self: flex-start; font-size: .7rem; font-weight: 800;
      padding: 2px 7px; border-radius: 6px; margin-top: 3px; }
    .fpm-badge.ok { background: #dcfce7; color: #15803d; }
    .fpm-badge.mid { background: #fef3c7; color: #b45309; }
    .fpm-badge.no { background: #fee2e2; color: #b91c1c; }
    .fpm-input { width: 100%; padding: 7px 9px; border: 1px solid #e2e8f0; border-radius: 8px;
      font-family: ui-monospace, monospace; font-size: .82rem; color: #1e293b; }
    .fpm-input:focus { outline: 2px solid #7c3aed; outline-offset: 1px; border-color: #7c3aed; }
    .fpm-err { color: #dc2626; font-size: .7rem; min-height: 13px; margin-top: 2px; }
    .fpm-note { font-size: .72rem; color: #64748b; line-height: 1.45; }
    .fpm-theo { background: #f5f3ff; border: 1px solid #ddd6fe; border-left: 3px solid #7c3aed;
      border-radius: 8px; padding: 8px 10px; margin: 2px 0 6px; }
    .fpm-theo-kopf { font-size: .62rem; font-weight: 800; color: #7c3aed; text-transform: uppercase;
      letter-spacing: .06em; margin-bottom: 3px; }
    .fpm-theo-typ { font-size: .82rem; font-weight: 800; color: #1e293b; }
    .fpm-theo-form { font-family: ui-monospace, monospace; font-size: .82rem; color: #5b21b6; margin-top: 2px; }
    .fpm-theo-par { font-size: .7rem; color: #64748b; margin-top: 2px; font-variant-numeric: tabular-nums; }
    .fpm-theo-term { font-family: ui-monospace, monospace; font-size: .7rem; color: #db2777; margin-top: 3px; }
    .fpm-theo-deutung { font-size: .71rem; color: #475569; line-height: 1.45; margin-top: 4px; }
    /* Gesperrte Knoepfe muessen gesperrt AUSSEHEN – sonst klickt man ins Leere */
    .fpm-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
    .fpm-sim .sim-btn:disabled:hover { background: #f1f5f9; color: #475569; }
    .fpm-sim .sim-btn.fpm-waiting { background: #f97316; border-color: #f97316; color: #fff; }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════
// WELLENWANNE – Schluesselexperiment 01 des KLP (Qualifikationsphase)
// Loest die Wellengleichung u_tt = c²·∇²u auf einem Gitter (FDTD).
// Kreiswellen, ebene Wellen, Beugung, Interferenz, Reflexion und
// Brechung entstehen dadurch alle aus derselben Physik – so wie in
// der echten Wanne, in der ebenfalls nur Wasser schwingt.
// ═══════════════════════════════════════════════════════

const _WW_NX = 280, _WW_NY = 180;   // Gitterzellen, 1 Zelle = 1 mm
const _WW_C  = 250;                 // Ausbreitungsgeschwindigkeit in mm/s
const _WW_DT = 0.002;               // Zeitschritt in s  → C = c·dt/dx = 0,5
const _WW_RAND = 18;                // Breite des daempfenden Randes

let _ww = null;

const _WW_VERSUCHE = {
  kreis: {
    name: 'Kreiswellen', icon: '⊙',
    kurz: 'Ein punktfoermiger Erreger tippt auf die Wasseroberflaeche.',
    text: 'Von einem einzigen Punkt laufen kreisfoermige Wellenberge und -taeler nach allen Seiten. Der Abstand zweier benachbarter Berge ist die Wellenlaenge λ. Der Erreger schwingt f-mal pro Sekunde, also entsteht pro Sekunde f-mal eine neue Kreiswelle.'
  },
  zwei: {
    name: 'Zwei Erreger – Interferenz', icon: '◎',
    kurz: 'Zwei gleich schwingende Erreger, ihre Wellen ueberlagern sich.',
    text: 'Wo zwei Wellenberge zusammentreffen, entsteht ein besonders hoher Berg (konstruktive Interferenz). Wo Berg auf Tal trifft, bleibt das Wasser ruhig (destruktive Interferenz). Die ruhigen Stellen liegen auf Kurven, die vom Erregerpaar wegfuehren: den Interferenzhyperbeln. Genau das ist die Vorbereitung auf den Doppelspalt.'
  },
  eben: {
    name: 'Ebene Wellen aus Punkterregern', icon: '≡',
    kurz: 'Viele Punkterreger nebeneinander erzeugen gerade Wellenfronten.',
    text: 'Stelle den Regler zuerst auf 1 Erreger: Du siehst Kreiswellen. Erhoehe die Zahl Schritt fuer Schritt. Je mehr Punkterreger nebeneinander schwingen, desto gerader werden die Wellenfronten in der Mitte – aus vielen Elementarwellen entsteht eine ebene Welle. Das ist der zweite Teil des Huygensschen Prinzips zum Anfassen.'
  },
  spalt: {
    name: 'Beugung am Spalt', icon: '⌷',
    kurz: 'Eine ebene Welle trifft auf eine Wand mit einem Spalt.',
    text: 'Mache den Spalt schmal: Hinter dem Spalt laufen Kreiswellen weiter, obwohl vorne eine gerade Welle ankam. Der Spalt wirkt wie ein einzelner Punkterreger – das ist der erste Teil des Huygensschen Prinzips: Jeder Punkt einer Wellenfront ist Ausgangspunkt einer Elementarwelle. Mache den Spalt breit: Die Welle laeuft ueberwiegend gerade weiter und beugt sich nur an den Raendern.'
  },
  doppelspalt: {
    name: 'Doppelspalt', icon: '⑈',
    kurz: 'Zwei Spalte machen aus einer ebenen Welle zwei Erreger.',
    text: 'Hinter jedem Spalt entsteht eine Elementarwelle. Beide ueberlagern sich und erzeugen dasselbe Muster wie zwei Punkterreger: Richtungen mit starker Welle wechseln sich ab mit Richtungen, in denen das Wasser ruhig bleibt. Verändere den Spaltabstand und beobachte, wie sich die Abstaende der Streifen aendern.'
  },
  reflexion: {
    name: 'Reflexion', icon: '◺',
    kurz: 'Eine ebene Welle trifft schraeg auf eine Wand.',
    text: 'Die Welle wird zurueckgeworfen. Miss den Winkel zwischen einfallender Welle und dem Lot auf die Wand und vergleiche ihn mit dem Winkel der zurueckgeworfenen Welle: Einfallswinkel = Reflexionswinkel. Stelle den Wandwinkel auf 45°, dann laeuft die reflektierte Welle senkrecht zur einfallenden.'
  },
  brechung: {
    name: 'Brechung', icon: '◣',
    kurz: 'Im flacheren Wasser ist die Welle langsamer.',
    text: 'Rechts ist das Wasser flacher, dort laeuft die Welle langsamer. Die Frequenz bleibt gleich (der Erreger schwingt ja unveraendert), also muss die Wellenlaenge kleiner werden: λ = c/f. Weil die Grenze schraeg liegt, kommt eine Seite der Wellenfront frueher an als die andere – die Welle knickt ab. Genau das ist Brechung.'
  }
};

function _wwInit() {
  const N = _WW_NX * _WW_NY;
  _ww = {
    u: new Float32Array(N), up: new Float32Array(N), un: new Float32Array(N),
    cc: new Float32Array(N), wall: new Uint8Array(N), damp: new Float32Array(N),
    t: 0, f: 12, versuch: 'kreis', laufen: true, tempo: 1, huygens: false,
    nErr: 6, spalt: 14, abstand: 60, winkel: 45, nBrech: 1.6, erregerAbstand: 60,
    sources: [], off: null, offctx: null, img: null
  };
  // Daempfender Rand: verhindert Reflexionen am Wannenrand
  for (let y = 0; y < _WW_NY; y++) {
    for (let x = 0; x < _WW_NX; x++) {
      const rand = Math.min(x, y, _WW_NX - 1 - x, _WW_NY - 1 - y);
      _ww.damp[y * _WW_NX + x] = rand < _WW_RAND ? 0.14 * Math.pow((_WW_RAND - rand) / _WW_RAND, 2) : 0;
    }
  }
  _wwBaue();
}

// Setzt Wellenfeld, Hindernisse, Wassertiefe und Erreger fuer den gewaehlten Versuch
function _wwBaue() {
  const w = _ww, NX = _WW_NX, NY = _WW_NY, C2 = 0.25;
  w.u.fill(0); w.up.fill(0); w.un.fill(0); w.wall.fill(0);
  w.cc.fill(C2);
  w.sources = [];
  w.t = 0;

  const linie = (n) => {           // n Punkterreger senkrecht untereinander
    const y0 = 22, y1 = NY - 22, x = 20;
    if (n <= 1) { w.sources.push({ x, y: (y0 + y1) >> 1 }); return; }
    for (let i = 0; i < n; i++) w.sources.push({ x, y: Math.round(y0 + (y1 - y0) * i / (n - 1)) });
  };
  const ebeneWelle = () => { for (let y = 20; y < NY - 20; y++) w.sources.push({ x: 20, y }); };

  switch (w.versuch) {
    case 'kreis':
      w.sources.push({ x: 55, y: NY >> 1 });
      break;

    case 'zwei': {
      const d = w.erregerAbstand;
      w.sources.push({ x: 55, y: (NY >> 1) - (d >> 1) });
      w.sources.push({ x: 55, y: (NY >> 1) + (d >> 1) });
      break;
    }

    case 'eben':
      linie(w.nErr);
      break;

    case 'spalt': {
      ebeneWelle();
      const xw = 140, halb = w.spalt >> 1, mid = NY >> 1;
      for (let y = 0; y < NY; y++)
        if (Math.abs(y - mid) > halb)
          for (let x = xw; x < xw + 3; x++) w.wall[y * NX + x] = 1;
      break;
    }

    case 'doppelspalt': {
      ebeneWelle();
      const xw = 140, halb = 6, mid = NY >> 1, a = w.abstand >> 1;
      for (let y = 0; y < NY; y++) {
        const offen = Math.abs(y - (mid - a)) <= halb || Math.abs(y - (mid + a)) <= halb;
        if (!offen) for (let x = xw; x < xw + 3; x++) w.wall[y * NX + x] = 1;
      }
      break;
    }

    case 'reflexion': {
      ebeneWelle();
      const rad = w.winkel * Math.PI / 180;
      const px = 200, py = NY / 2;
      const dx = Math.sin(rad), dy = -Math.cos(rad);   // Richtungsvektor der Wand
      for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
        const rx = x - px, ry = y - py;
        const laengs = rx * dx + ry * dy;              // Position entlang der Wand
        const quer = Math.abs(rx * dy - ry * dx);      // Abstand zur Wand
        if (quer < 2 && Math.abs(laengs) < 130) w.wall[y * NX + x] = 1;
      }
      break;
    }

    case 'brechung': {
      ebeneWelle();
      const rad = 28 * Math.PI / 180;
      const px = 145, py = NY / 2;
      const dx = Math.sin(rad), dy = -Math.cos(rad);
      const langsamer = C2 / (w.nBrech * w.nBrech);
      for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
        // seite < 0 liegt rechts der Grenze – dort ist das Wasser flacher
        const seite = (x - px) * dy - (y - py) * dx;
        if (seite < 0) w.cc[y * NX + x] = langsamer;
      }
      break;
    }
  }
}

// Ein Zeitschritt der Wellengleichung
function _wwSchritt() {
  const w = _ww, NX = _WW_NX, NY = _WW_NY;
  const u = w.u, up = w.up, un = w.un, cc = w.cc, wall = w.wall, damp = w.damp;
  for (let y = 1; y < NY - 1; y++) {
    const zeile = y * NX;
    for (let x = 1; x < NX - 1; x++) {
      const i = zeile + x;
      if (wall[i]) { un[i] = 0; continue; }
      const lap = u[i + 1] + u[i - 1] + u[i + NX] + u[i - NX] - 4 * u[i];
      const d = damp[i];
      un[i] = (2 * u[i] - (1 - d) * up[i] + cc[i] * lap) / (1 + d);
    }
  }
  w.t += _WW_DT;
  // Erreger aufpraegen
  const a = Math.sin(2 * Math.PI * w.f * w.t);
  for (const s of w.sources) un[s.y * NX + s.x] = a;
  // Felder durchtauschen
  w.up.set(u); w.u.set(un);
}

function _wwUpdate() {
  if (!_ww || !_ww.laufen) return;
  const schritte = _ww.tempo === 0.5 ? 2 : _ww.tempo === 2 ? 8 : 4;
  for (let i = 0; i < schritte; i++) _wwSchritt();
}

function _wwLambda(n) { return _WW_C / _ww.f / (n || 1); }   // in mm

// ── Darstellung ────────────────────────────────────────
function _wwRender(ctx, cv) {
  if (!_ww) return;
  const w = _ww, NX = _WW_NX, NY = _WW_NY;

  if (!w.off) {
    w.off = document.createElement('canvas');
    w.off.width = NX; w.off.height = NY;
    w.offctx = w.off.getContext('2d');
    w.img = w.offctx.createImageData(NX, NY);
  }
  const px = w.img.data, u = w.u, wall = w.wall, cc = w.cc;
  const skala = 2.6;
  for (let i = 0, p = 0; i < NX * NY; i++, p += 4) {
    if (wall[i]) { px[p] = 51; px[p + 1] = 65; px[p + 2] = 85; px[p + 3] = 255; continue; }
    let v = u[i] * skala;
    v = v > 1 ? 1 : v < -1 ? -1 : v;
    // dunkelblau (Tal) → mittelblau (Ruhe) → weiss (Berg)
    let r, g, b;
    if (v < 0) { const k = v + 1; r = 8 + 21 * k; g = 28 + 50 * k; b = 62 + 75 * k; }
    else { r = 29 + 194 * v; g = 78 + 168 * v; b = 137 + 118 * v; }
    if (cc[i] < 0.249) { r *= 0.86; g *= 0.92; b *= 1.0; }   // flacheres Wasser leicht abgesetzt
    px[p] = r; px[p + 1] = g; px[p + 2] = b; px[p + 3] = 255;
  }
  w.offctx.putImageData(w.img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(w.off, 0, 0, cv.width, cv.height);

  const sx = cv.width / NX, sy = cv.height / NY;

  // Erreger markieren
  ctx.fillStyle = '#fbbf24';
  const zeigen = w.sources.length <= 26 ? w.sources : [];
  zeigen.forEach(s => {
    ctx.beginPath(); ctx.arc(s.x * sx, s.y * sy, 3, 0, 2 * Math.PI); ctx.fill();
  });
  if (w.sources.length > 26) {
    ctx.fillRect(18 * sx, 20 * sy, 4, (NY - 40) * sy);
  }

  // Huygenssche Elementarwellen einzeichnen
  if (w.huygens) {
    ctx.strokeStyle = 'rgba(251,191,36,.75)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    let zentren = [];
    if (w.versuch === 'spalt') {
      const mid = NY >> 1, halb = w.spalt >> 1;
      for (let k = -2; k <= 2; k++) zentren.push({ x: 143, y: mid + Math.round(k * halb / 2.2) });
    } else if (w.versuch === 'doppelspalt') {
      const mid = NY >> 1, a = w.abstand >> 1;
      zentren = [{ x: 143, y: mid - a }, { x: 143, y: mid + a }];
    } else zentren = zeigen;
    const lam = _wwLambda(1);
    zentren.forEach(z => {
      for (let k = 1; k <= 3; k++) {
        ctx.beginPath();
        ctx.arc(z.x * sx, z.y * sy, k * lam * sx, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
    ctx.setLineDash([]);
  }

  // Grenze bei der Brechung beschriften
  if (w.versuch === 'brechung') {
    const rad = 28 * Math.PI / 180, px0 = 145, py0 = NY / 2;
    const dx = Math.sin(rad), dy = -Math.cos(rad);
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo((px0 - dx * 200) * sx, (py0 - dy * 200) * sy);
    ctx.lineTo((px0 + dx * 200) * sx, (py0 + dy * 200) * sy);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '600 11px sans-serif';
    ctx.fillText('tiefes Wasser · c = ' + _WW_C + ' mm/s', 26, cv.height - 12);
    ctx.textAlign = 'right';
    ctx.fillText('flach · c = ' + Math.round(_WW_C / w.nBrech) + ' mm/s', cv.width - 12, 20);
    ctx.textAlign = 'left';
  }

  // Lot und Winkel bei der Reflexion
  if (w.versuch === 'reflexion') {
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
    const rad = w.winkel * Math.PI / 180;
    const cxp = 200 * sx, cyp = (NY / 2) * sy;
    ctx.beginPath();
    ctx.moveTo(cxp, cyp);
    ctx.lineTo(cxp - Math.cos(rad) * 55, cyp - Math.sin(rad) * 55);   // Lot
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '600 11px sans-serif';
    ctx.fillText('Lot', cxp - Math.cos(rad) * 66, cyp - Math.sin(rad) * 60);
  }

  // Massstab fuer die Wellenlaenge
  const lamPx = _wwLambda(1) * sx;
  const bx = 26, by = 16;
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(bx, by + 5); ctx.lineTo(bx, by); ctx.lineTo(bx + lamPx, by); ctx.lineTo(bx + lamPx, by + 5);
  ctx.stroke();
  ctx.fillStyle = '#fbbf24'; ctx.font = '700 11px sans-serif';
  ctx.fillText('λ = ' + _fpmNum(_wwLambda(1), 1) + ' mm', bx + lamPx + 8, by + 4);
}

// ── Oberflaeche ────────────────────────────────────────
function _wwHTML() {
  const v = _ww.versuch;
  const tabs = Object.keys(_WW_VERSUCHE).map(k =>
    `<button class="ww-tab${k === v ? ' on' : ''}" id="wwTab_${k}" onclick="_wwSetVersuch('${k}')">
       <span class="ww-tab-i">${_WW_VERSUCHE[k].icon}</span>${_WW_VERSUCHE[k].name}</button>`).join('');

  return `<div class="sim-box sim-box-wide ww-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">🌊 Wellenwanne – Kreiswellen, Beugung, Interferenz, Reflexion, Brechung <span class="sim-schluessel">Schlüsselexperiment</span></h3>

    <div class="ww-tabs">${tabs}</div>

    <div class="ww-grid">
      <div>
        <canvas id="wwCanvas" width="560" height="360" class="ww-canvas"></canvas>
        <div class="ww-info" id="wwInfo"></div>
      </div>
      <div class="ww-side">
        <div class="ww-erkl" id="wwErkl"></div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Erregerfrequenz f: <b id="wwFLbl">12 Hz</b></span>
          <input type="range" id="wwF" min="6" max="26" step="1" value="12"
            oninput="_wwSetF(this.value)" style="width:100%;accent-color:#0284c7">
        </div>
        <div id="wwExtra"></div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="wwPlayBtn" onclick="_wwToggle()">⏸ Stroboskop</button>
          <button class="sim-btn" onclick="_wwReset()">↺ Neu</button>
          <button class="sim-btn" id="wwSpeedBtn" onclick="_wwSpeed()">Tempo 1×</button>
        </div>
        <label class="fpm-check"><input type="checkbox" id="wwHuy" onchange="_wwSetHuygens(this.checked)">
          Huygenssche Elementarwellen einzeichnen</label>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>c = λ · f</b> &nbsp;|&nbsp; Die Wanne rechnet die Wellengleichung – Beugung, Interferenz,
      Reflexion und Brechung entstehen von selbst, nichts davon ist eingezeichnet.
    </p>
  </div>`;
}

// Zusatzregler je nach Versuch
function _wwExtraHTML() {
  const w = _ww;
  const r = (id, label, min, max, val, step, unit, fn) =>
    `<div class="phys-ctrl">
       <span class="phys-ctrl-label">${label}: <b id="${id}Lbl">${val}${unit}</b></span>
       <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"
         oninput="${fn}(this.value)" style="width:100%;accent-color:#0284c7">
     </div>`;
  switch (w.versuch) {
    case 'zwei':        return r('wwD', 'Abstand der Erreger', 24, 110, w.erregerAbstand, 2, ' mm', '_wwSetD');
    case 'eben':        return r('wwN', 'Anzahl der Punkterreger', 1, 24, w.nErr, 1, '', '_wwSetN');
    case 'spalt':       return r('wwS', 'Spaltbreite', 4, 70, w.spalt, 2, ' mm', '_wwSetSpalt');
    case 'doppelspalt': return r('wwA', 'Spaltabstand', 30, 110, w.abstand, 2, ' mm', '_wwSetAbstand');
    case 'reflexion':   return r('wwW', 'Wandwinkel gegen die Senkrechte', 0, 70, w.winkel, 5, '°', '_wwSetWinkel');
    case 'brechung':    return r('wwB', 'Verhaeltnis c₁/c₂', 1.2, 2.4, w.nBrech, 0.1, '', '_wwSetBrech');
    default:            return '';
  }
}

function _wwSetVersuch(k) {
  _ww.versuch = k;
  Object.keys(_WW_VERSUCHE).forEach(n =>
    document.getElementById('wwTab_' + n)?.classList.toggle('on', n === k));
  _wwBaue();
  const ex = document.getElementById('wwExtra'); if (ex) ex.innerHTML = _wwExtraHTML();
  _wwErkl(); _wwInfo();
}
function _wwSetF(v) {
  _ww.f = +v;
  const el = document.getElementById('wwFLbl'); if (el) el.textContent = v + ' Hz';
  _wwInfo();
}
function _wwSetD(v)       { _ww.erregerAbstand = +v; _wwLbl('wwDLbl', v + ' mm'); _wwBaue(); }
function _wwSetN(v)       { _ww.nErr = +v;           _wwLbl('wwNLbl', v);         _wwBaue(); _wwInfo(); }
function _wwSetSpalt(v)   { _ww.spalt = +v;          _wwLbl('wwSLbl', v + ' mm'); _wwBaue(); _wwInfo(); }
function _wwSetAbstand(v) { _ww.abstand = +v;        _wwLbl('wwALbl', v + ' mm'); _wwBaue(); }
function _wwSetWinkel(v)  { _ww.winkel = +v;         _wwLbl('wwWLbl', v + '°');   _wwBaue(); }
function _wwSetBrech(v)   { _ww.nBrech = +v;         _wwLbl('wwBLbl', (+v).toFixed(1).replace('.', ',')); _wwBaue(); _wwInfo(); }
function _wwLbl(id, txt)  { const el = document.getElementById(id); if (el) el.textContent = txt; }
function _wwSetHuygens(b) { _ww.huygens = b; }
function _wwReset()       { _wwBaue(); }
function _wwToggle() {
  _ww.laufen = !_ww.laufen;
  const b = document.getElementById('wwPlayBtn');
  if (b) b.textContent = _ww.laufen ? '⏸ Stroboskop' : '▶ weiter';
}
function _wwSpeed() {
  _ww.tempo = _ww.tempo === 1 ? 2 : _ww.tempo === 2 ? 0.5 : 1;
  const b = document.getElementById('wwSpeedBtn');
  if (b) b.textContent = 'Tempo ' + (_ww.tempo === 0.5 ? '½' : _ww.tempo) + '×';
}
function _wwErkl() {
  const el = document.getElementById('wwErkl'); if (!el) return;
  const V = _WW_VERSUCHE[_ww.versuch];
  el.innerHTML = `<div class="ww-erkl-kopf">${V.icon} ${V.name}</div>
    <div class="ww-erkl-kurz">${V.kurz}</div><div class="ww-erkl-text">${V.text}</div>`;
}
function _wwInfo() {
  const el = document.getElementById('wwInfo'); if (!el) return;
  const w = _ww, lam = _wwLambda(1);
  let z = `<span>f = <b>${w.f} Hz</b></span><span>c = <b>${_WW_C} mm/s</b></span>` +
          `<span>λ = c/f = <b>${_fpmNum(lam, 1)} mm</b></span>`;
  if (w.versuch === 'brechung') {
    const c2 = _WW_C / w.nBrech;
    z += `<span class="ww-info-2">flach: c₂ = <b>${_fpmNum(c2, 0)} mm/s</b></span>` +
         `<span class="ww-info-2">λ₂ = <b>${_fpmNum(c2 / w.f, 1)} mm</b></span>`;
  }
  if (w.versuch === 'spalt') {
    const v = w.spalt < lam ? 'Spalt schmaler als λ → fast reine Kreiswelle'
            : w.spalt < 2.5 * lam ? 'Spalt ≈ λ → deutliche Beugung'
            : 'Spalt ≫ λ → Beugung nur an den Raendern';
    z += `<span class="ww-info-2">Spalt/λ = <b>${_fpmNum(w.spalt / lam, 2)}</b></span><span class="ww-info-2">${v}</span>`;
  }
  el.innerHTML = z;
}

// ── Formatierung ───────────────────────────────────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .ww-tabs { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }
    .ww-tab { display: flex; align-items: center; gap: 5px; padding: 6px 10px; border: 1px solid #e2e8f0;
      background: #fff; border-radius: 18px; font-size: .76rem; font-weight: 700; color: #64748b; cursor: pointer; }
    .ww-tab:hover { border-color: #cbd5e1; }
    .ww-tab.on { background: #0284c7; border-color: #0284c7; color: #fff; }
    .ww-tab-i { font-size: .95rem; }
    .ww-grid { display: grid; grid-template-columns: minmax(0,1fr) 290px; gap: 14px; align-items: start; }
    @media (max-width: 820px) { .ww-grid { grid-template-columns: 1fr; } }
    .ww-canvas { width: 100%; display: block; border-radius: 10px; background: #1d4e89; }
    .ww-side { display: flex; flex-direction: column; gap: 10px; }
    .ww-info { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 7px; font-size: .78rem; color: #475569; }
    .ww-info b { color: #0c4a6e; font-variant-numeric: tabular-nums; }
    .ww-info-2 { color: #64748b; }
    .ww-erkl { background: #f0f9ff; border: 1px solid #bae6fd; border-left: 3px solid #0284c7;
      border-radius: 8px; padding: 9px 11px; }
    .ww-erkl-kopf { font-size: .84rem; font-weight: 800; color: #0c4a6e; }
    .ww-erkl-kurz { font-size: .76rem; color: #0369a1; margin-top: 2px; font-weight: 600; }
    .ww-erkl-text { font-size: .74rem; color: #475569; line-height: 1.5; margin-top: 5px; }
    .ww-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
    .sim-schluessel { display: inline-block; vertical-align: 2px; margin-left: 6px;
      background: #fef3c7; color: #92400e; border: 1px solid #fde68a; border-radius: 999px;
      padding: 2px 9px; font-size: .62rem; font-weight: 800; letter-spacing: .04em;
      text-transform: uppercase; white-space: nowrap; }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════
// DOPPELSPALT – Schluesselexperiment 02 des KLP
// Grundlage: Handreichung "Versuch 02: Doppelspaltversuch" (NRW)
//
// Die Schueler messen selbst: Marken auf das Schirmbild setzen,
// Streifenabstand ueber MEHRERE Ordnungen bestimmen und teilen
// (so empfiehlt es die Handreichung), daraus die Wellenlaenge
// berechnen und den Zusammenhang linearisieren.
//
//   Maxima:  sin α_k = k · λ/d          Minima: sin α_k = (2k+1)/2 · λ/d
//   tan α_k = a_k / e,  fuer kleine α:  Δa = e · λ / d   ⇒   λ = Δa · d / e
//
// Das Schirmbild entsteht aus der vollen Intensitaetsformel
//   I ~ cos²(π·d·sinα/λ) · sinc²(π·b·sinα/λ)
// also inklusive Einzelspalt-Einhuellender – deshalb sind die
// aeusseren Maxima schwaecher, genau wie im echten Versuch.
// sin α wird exakt aus x und e berechnet, nicht genaehert; wer weit
// aussen misst, sieht die Kleinwinkelnaeherung tatsaechlich abweichen.
// ═══════════════════════════════════════════════════════

const _DSP_W = 860;                       // Breite des Schirm-Canvas in px
const _DSP_LASER = [
  { n: 'He-Ne',   lam: 632.8, col: '#e11d48', kurz: 'He-Ne-Laser (Schulversuch)' },
  { n: 'rot',     lam: 650,   col: '#ef4444', kurz: 'Laserpointer rot' },
  { n: 'grün',    lam: 532,   col: '#16a34a', kurz: 'Laserpointer grün' },
  { n: 'violett', lam: 405,   col: '#7c3aed', kurz: 'Laserpointer violett' }
];
const _DSP_SPALTE = [0.10, 0.15, 0.20, 0.25, 0.30];   // Spaltabstaende d des Dias in mm
const _DSP_VIEWS  = [2, 5, 10, 20, 50, 100];          // Ausschnitt ± in mm

let _dsp = null;

function _dspInit() {
  _dsp = {
    li: 0, d: 0.20, e: 2.00, b: 0.02,
    weiss: false, profil: true, reveal: false, view: 20,
    m1: -6, m2: 6, aktiv: 2, n: 1, drag: false,
    rows: [], nextId: 1,
    preset: 1, fn: null, fnAuto: false, origin: true,
    key: '', off: null, prof: null
  };
}

// ── Physik ─────────────────────────────────────────────
function _dspLam()   { return _DSP_LASER[_dsp.li].lam; }        // in nm
function _dspLamMm(lam) { return (lam || _dspLam()) * 1e-6; }   // 1 nm = 1e-6 mm
function _dspEmm()   { return _dsp.e * 1000; }                  // Schirmabstand in mm

// Intensitaet an der Stelle x (in mm, von der Mitte aus)
function _dspI(x, lam) {
  const e = _dspEmm();
  const s = x / Math.sqrt(x * x + e * e);          // sin α, exakt
  const l = _dspLamMm(lam);
  const bet = Math.PI * _dsp.b * s / l;
  const gam = Math.PI * _dsp.d * s / l;
  const si = Math.abs(bet) < 1e-9 ? 1 : Math.sin(bet) / bet;
  const co = Math.cos(gam);
  return si * si * co * co;
}

// Lage des k-ten Maximums in mm – exakt, ohne Kleinwinkelnaeherung
function _dspXk(k) {
  const q = k * _dspLamMm() / _dsp.d;
  if (Math.abs(q) >= 1) return NaN;
  return _dspEmm() * Math.tan(Math.asin(q));
}
// theoretischer Streifenabstand in Schirmmitte (Kleinwinkelnaeherung)
function _dspDaTheo() { return _dspEmm() * _dspLamMm() / _dsp.d; }

// gemessene Groessen aus den beiden Marken
function _dspDx() { return Math.abs(_dsp.m2 - _dsp.m1); }
function _dspDa() { return _dsp.n > 0 ? _dspDx() / _dsp.n : NaN; }
// λ in nm aus  λ = Δa · d / e   (Δa, d in mm, e in m)
function _dspLamAus(da, d, e) { return 1000 * da * d / e; }

// Spektralfarbe einer Wellenlaenge (Naeherung nach Bruton)
function _dspSpektralRGB(lam) {
  let r = 0, g = 0, b = 0;
  if (lam >= 380 && lam < 440)      { r = -(lam - 440) / 60; b = 1; }
  else if (lam < 490)               { g = (lam - 440) / 50;  b = 1; }
  else if (lam < 510)               { g = 1; b = -(lam - 510) / 20; }
  else if (lam < 580)               { r = (lam - 510) / 70;  g = 1; }
  else if (lam < 645)               { r = 1; g = -(lam - 645) / 65; }
  else if (lam <= 780)              { r = 1; }
  let f = 1;
  if (lam >= 380 && lam < 420)      f = 0.3 + 0.7 * (lam - 380) / 40;
  else if (lam > 700 && lam <= 780) f = 0.3 + 0.7 * (780 - lam) / 80;
  return [r * f, g * f, b * f];
}
function _dspWeissLams() {
  const out = [];
  for (let lam = 400; lam <= 700; lam += 20) out.push({ lam, rgb: _dspSpektralRGB(lam) });
  // Die drei Farbkurven decken unterschiedlich breite Bereiche ab (Rot reicht
  // von 580 bis 700 nm, Blau nur von 400 bis 490 nm). Ohne Ausgleich waere das
  // nullte Maximum rotstichig statt weiss. Kanalweise so normieren, dass ein
  // flaches Spektrum tatsaechlich Weiss ergibt.
  const s = [0, 0, 0];
  out.forEach(L => { for (let c = 0; c < 3; c++) s[c] += L.rgb[c]; });
  const mx = Math.max(s[0], s[1], s[2]);
  out.forEach(L => { for (let c = 0; c < 3; c++) if (s[c] > 0) L.rgb[c] *= mx / s[c]; });
  return out;
}

// ── Schirmbild vorberechnen ────────────────────────────
// Das Bild aendert sich nur, wenn ein Parameter wechselt – also einmal
// rechnen und puffern, statt 60-mal pro Sekunde dieselbe Summe zu bilden.
function _dspScale() { return (_DSP_W / 2 - 10) / _dsp.view; }   // px pro mm
function _dspMmToPx(x) { return _DSP_W / 2 + x * _dspScale(); }
function _dspPxToMm(px) {
  const v = (px - _DSP_W / 2) / _dspScale();
  return Math.max(-_dsp.view, Math.min(_dsp.view, v));
}
function _dspKey() {
  return [_dsp.li, _dsp.d, _dsp.e, _dsp.b, _dsp.weiss ? 1 : 0, _dsp.view].join('|');
}

function _dspBuild() {
  const W = _DSP_W, cx = W / 2, sc = _dspScale();
  const lams = _dsp.weiss ? _dspWeissLams()
                          : [{ lam: _dspLam(), rgb: _dspSpektralRGB(_dspLam()) }];
  const SUB = _dsp.weiss ? 2 : 4;          // Unterabtastung gegen Aliasing
  const tmp = new Float64Array(W * 3);
  const prof = new Float64Array(W);
  let maxC = 0, maxI = 0;

  for (let px = 0; px < W; px++) {
    let r = 0, g = 0, b = 0, ii = 0;
    for (let s = 0; s < SUB; s++) {
      const x = (px + (s + 0.5) / SUB - cx) / sc;
      for (const L of lams) {
        const I = _dspI(x, L.lam);
        r += I * L.rgb[0]; g += I * L.rgb[1]; b += I * L.rgb[2]; ii += I;
      }
    }
    const nl = SUB * lams.length;
    r /= SUB; g /= SUB; b /= SUB; ii /= nl;
    tmp[px * 3] = r; tmp[px * 3 + 1] = g; tmp[px * 3 + 2] = b;
    prof[px] = ii;
    if (r > maxC) maxC = r; if (g > maxC) maxC = g; if (b > maxC) maxC = b;
    if (ii > maxI) maxI = ii;
  }
  if (!(maxC > 0)) maxC = 1;
  if (!(maxI > 0)) maxI = 1;
  for (let px = 0; px < W; px++) prof[px] /= maxI;

  const off = document.createElement('canvas');
  off.width = W; off.height = 1;
  const octx = off.getContext('2d');
  const img = octx.createImageData(W, 1);
  for (let px = 0; px < W; px++) {
    // leichte Gamma-Korrektur: sonst verschwinden die schwachen aeusseren
    // Maxima, die man auf dem echten Schirm sehr wohl noch erkennt
    img.data[px * 4]     = 255 * Math.pow(Math.min(1, tmp[px * 3]     / maxC), 0.45);
    img.data[px * 4 + 1] = 255 * Math.pow(Math.min(1, tmp[px * 3 + 1] / maxC), 0.45);
    img.data[px * 4 + 2] = 255 * Math.pow(Math.min(1, tmp[px * 3 + 2] / maxC), 0.45);
    img.data[px * 4 + 3] = 255;
  }
  octx.putImageData(img, 0, 0);

  _dsp.off = off; _dsp.prof = prof; _dsp.key = _dspKey();
}

// ── Schirm zeichnen ────────────────────────────────────
function _dspRenderScreen() {
  const cv = document.getElementById('dspScreen');
  if (!cv || !_dsp) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  if (_dsp.key !== _dspKey() || !_dsp.off) _dspBuild();

  const sy = 6, sh = _dsp.profil ? 66 : 130;          // Schirmbild
  const py = sy + sh + 10, ph = 76;                   // Intensitaetsprofil
  const ay = _dsp.profil ? py + ph + 6 : sy + sh + 6; // Achse

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);

  // Schirmbild
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(_dsp.off, 0, 0, W, 1, 0, sy, W, sh);
  ctx.restore();
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  ctx.strokeRect(0.5, sy + 0.5, W - 1, sh - 1);
  ctx.fillStyle = 'rgba(226,232,240,.75)'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('SCHIRMBILD', 8, sy + 13);

  // Intensitaetsprofil (entspricht der Messung mit einer Fotodiode)
  if (_dsp.profil) {
    ctx.fillStyle = '#111c30'; ctx.fillRect(0, py, W, ph);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const gy = py + ph * i / 4;
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let px = 0; px < W; px++) {
      const gy = py + ph - _dsp.prof[px] * (ph - 6);
      px === 0 ? ctx.moveTo(px, gy) : ctx.lineTo(px, gy);
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(226,232,240,.75)'; ctx.font = '700 10px sans-serif';
    ctx.fillText('INTENSITÄT I(x)', 8, py + 13);
  }

  // Achse mit mm-Skala
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.stroke();
  const t = _fpmTicks(_dsp.view, 5);
  ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  t.ticks.forEach(v => {
    [v, -v].forEach(vv => {
      if (Math.abs(vv) > _dsp.view) return;
      const px = _dspMmToPx(vv);
      ctx.strokeStyle = '#64748b';
      ctx.beginPath(); ctx.moveTo(px, ay); ctx.lineTo(px, ay + 5); ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(_fpmTickLbl(vv, t.step), px, ay + 16);
    });
  });
  ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
  ctx.fillText('x in mm', W - 6, ay + 16);

  // Marken
  [[_dsp.m1, 1, '#fbbf24'], [_dsp.m2, 2, '#f472b6']].forEach(([mm, nr, col]) => {
    const px = _dspMmToPx(mm);
    ctx.strokeStyle = col; ctx.lineWidth = _dsp.aktiv === nr ? 2 : 1.2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(px, sy); ctx.lineTo(px, ay); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(px, ay - 9); ctx.lineTo(px - 6, ay - 20); ctx.lineTo(px + 6, ay - 20);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0f172a'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(String(nr), px, ay - 11);
  });

  // Messstrecke zwischen den Marken
  const p1 = _dspMmToPx(_dsp.m1), p2 = _dspMmToPx(_dsp.m2);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(p1, ay + 24); ctx.lineTo(p2, ay + 24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p1, ay + 20); ctx.lineTo(p1, ay + 28); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p2, ay + 20); ctx.lineTo(p2, ay + 28); ctx.stroke();
  ctx.fillStyle = '#e2e8f0'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Δx = ' + _fpmNum(_dspDx(), 2) + ' mm', (p1 + p2) / 2, ay + 40);
}

// ── Aufbau auf der optischen Bank ──────────────────────
function _dspRenderBank(ctx, cv) {
  if (!_dsp) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  const col = _DSP_LASER[_dsp.li].col;
  const yM = H / 2 + 6;
  const xL = 34, xS = 150, xSch = W - 42;

  // optische Bank
  ctx.fillStyle = '#cbd5e1'; ctx.fillRect(20, H - 34, W - 40, 8);
  [xL, xS, xSch].forEach(x => { ctx.fillStyle = '#94a3b8'; ctx.fillRect(x - 3, H - 34, 6, 12); });

  // Laser
  ctx.fillStyle = '#334155';
  ctx.fillRect(xL - 30, yM - 11, 44, 22);
  ctx.fillStyle = col; ctx.fillRect(xL + 12, yM - 3, 5, 6);
  ctx.fillStyle = '#fff'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('LASER', xL - 8, yM + 3);

  // Buendel bis zum Spalt
  ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.globalAlpha = 0.85;
  ctx.beginPath(); ctx.moveTo(xL + 17, yM); ctx.lineTo(xS - 2, yM); ctx.stroke();
  ctx.globalAlpha = 1;

  // Doppelspalt
  const gap = 7;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(xS - 3, yM - 52, 6, 52 - gap - 3);
  ctx.fillRect(xS - 3, yM - gap + 2, 6, (gap - 2) * 2 - 4);
  ctx.fillRect(xS - 3, yM + gap + 3, 6, 52 - gap - 3);

  // Schirm
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(xSch, yM - 62, 10, 124);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.strokeRect(xSch + 0.5, yM - 62.5, 10, 124);

  // Strahlenfaecher der Ordnungen 0, ±1, ±2 – schematisch aufgefaechert
  const spread = 22;
  for (let k = -2; k <= 2; k++) {
    const yT = yM + k * spread;
    [-1, 1].forEach(sgn => {
      ctx.strokeStyle = col; ctx.globalAlpha = k === 0 ? 0.85 : 0.4 - Math.abs(k) * 0.08;
      ctx.lineWidth = k === 0 ? 2 : 1.3;
      ctx.beginPath(); ctx.moveTo(xS, yM + sgn * gap); ctx.lineTo(xSch, yT); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    // Leuchtfleck auf dem Schirm
    const helligkeit = k === 0 ? 1 : Math.max(0.25, 1 - Math.abs(k) * 0.3);
    ctx.globalAlpha = helligkeit;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(xSch + 5, yT, 3.5, 6, 0, 0, 2 * Math.PI); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#475569'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('k = ' + (k > 0 ? '+' + k : k), xSch + 13, yT + 3);
  }

  // Winkel α am Spalt
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(xS, yM); ctx.lineTo(xSch, yM); ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(xS, yM, 40, -Math.atan2(spread, xSch - xS), 0); ctx.stroke();
  ctx.fillStyle = '#7c3aed'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('α', xS + 45, yM - 6);

  // Bemassung e
  const yE = H - 46;
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(xS, yE); ctx.lineTo(xSch, yE); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xS, yE - 4); ctx.lineTo(xS, yE + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xSch, yE - 4); ctx.lineTo(xSch, yE + 4); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('e = ' + _fpmNum(_dsp.e, 2) + ' m', (xS + xSch) / 2, yE - 7);

  // Lupe auf den Doppelspalt
  const lx = 62, ly = 40, lr = 26;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(lx, ly, lr, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(lx - 4, ly - lr + 4, 8, lr - 12);
  ctx.fillRect(lx - 4, ly - 4, 8, 8);
  ctx.fillRect(lx - 4, ly + 8, 8, lr - 12);
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(lx + 8, ly - 8); ctx.lineTo(lx + 8, ly + 4); ctx.stroke();
  ctx.fillStyle = '#7c3aed'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('d', lx + 11, ly - 1);
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif';
  ctx.fillText('d = ' + _fpmNum(_dsp.d, 2) + ' mm', lx + lr + 4, ly - 3);
  ctx.fillText('b = ' + _fpmNum(_dsp.b, 2) + ' mm', lx + lr + 4, ly + 8);

  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('schematisch, nicht maßstäblich', W - 8, H - 8);
  ctx.textAlign = 'left';
}

// ── Oberflaeche ────────────────────────────────────────
function _dspHTML() {
  const laser = _DSP_LASER.map((L, i) =>
    `<button class="dsp-laser${i === _dsp.li ? ' on' : ''}" id="dspL${i}" onclick="_dspSetLaser(${i})">
       <span class="dsp-laser-p" style="background:${L.col}"></span>
       <span class="dsp-laser-n">${L.n}</span>
     </button>`).join('');

  const spalte = _DSP_SPALTE.map((d, i) =>
    `<button class="dsp-slit${d === _dsp.d ? ' on' : ''}" id="dspD${i}"
       onclick="_dspSetD(${i})">${_fpmNum(d, 2)}</button>`).join('');

  const views = _DSP_VIEWS.map(v =>
    `<option value="${v}"${v === _dsp.view ? ' selected' : ''}>± ${v} mm</option>`).join('');

  const presets = ['n → Δx', 'e → Δa', '1/d → Δa'].map((p, i) =>
    `<button class="fpm-tab${i === _dsp.preset ? ' on' : ''}" id="dspTab${i}" onclick="_dspSetPreset(${i})">${p}</button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim dsp-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">🔦 Doppelspalt: das Schlüsselexperiment</h3>

    <canvas id="dspScreen" width="${_DSP_W}" height="236" class="dsp-screen"></canvas>
    <div class="dsp-screen-bar">
      <span class="dsp-hint">Tippe oder ziehe im Bild – die nähere Marke springt an die Stelle.</span>
      <label class="dsp-sel">Ausschnitt
        <select onchange="_dspSetView(this.value)">${views}</select>
      </label>
      <label class="fpm-check" style="margin:0"><input type="checkbox" checked onchange="_dspSet('profil',this.checked)">
        Intensitätsprofil</label>
    </div>

    <div class="fpm-grid" style="margin-top:10px">
      <div>
        <canvas id="dspBank" width="420" height="260" class="phys-anim-cv"></canvas>
        <div class="fpm-label">Lichtquelle wählen</div>
        <div class="dsp-lasers">${laser}</div>
        <div class="dsp-lam" id="dspLam"></div>
        <div class="fpm-label">Doppelspalt einsetzen – Spaltabstand d in mm</div>
        <div class="dsp-slits">${spalte}</div>
        <div class="phys-ctrl" style="margin-top:8px">
          <span class="phys-ctrl-label">Schirmabstand e: <b id="dspELbl">2,00 m</b></span>
          <input type="range" id="dspE" min="0.5" max="4" step="0.1" value="2"
            oninput="_dspSetE(this.value)" style="width:100%;accent-color:#7c3aed">
        </div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Spaltbreite b: <b id="dspBLbl">0,02 mm</b></span>
          <input type="range" id="dspB" min="0.01" max="0.08" step="0.01" value="0.02"
            oninput="_dspSetB(this.value)" style="width:100%;accent-color:#7c3aed">
        </div>
        <div class="fpm-note" id="dspBNote"></div>
        <label class="fpm-check"><input type="checkbox" onchange="_dspSet('weiss',this.checked)">
          Glühlicht statt Laser (Weißlicht)</label>
        <label class="fpm-check"><input type="checkbox" onchange="_dspSet('reveal',this.checked)">
          Sollwert der Wellenlänge anzeigen</label>
      </div>

      <div>
        <div class="fpm-label">Ausmessen</div>
        <div class="dsp-marks">
          <button class="dsp-mk" id="dspMk1" onclick="_dspSetAktiv(1)"><span class="dsp-mk-p" style="background:#fbbf24"></span>Marke 1</button>
          <button class="dsp-mk on" id="dspMk2" onclick="_dspSetAktiv(2)"><span class="dsp-mk-p" style="background:#f472b6"></span>Marke 2</button>
          <button class="sim-btn" onclick="_dspNudge(-1)" title="aktive Marke nach links">◀</button>
          <button class="sim-btn" onclick="_dspNudge(1)" title="aktive Marke nach rechts">▶</button>
        </div>
        <div class="dsp-nrow">
          <label class="phys-ctrl-label" for="dspN">Streifenabstände zwischen den Marken n:</label>
          <input type="number" id="dspN" class="dsp-num" min="1" max="40" step="1" value="1"
            oninput="_dspSetN(this.value)">
        </div>
        <div class="fpm-readout">
          <div class="fpm-ro"><span class="fpm-ro-k">Strecke Δx</span><span class="fpm-ro-v" id="dspDx">—</span><span class="fpm-ro-u">mm</span></div>
          <div class="fpm-ro"><span class="fpm-ro-k">Δa = Δx / n</span><span class="fpm-ro-v" id="dspDa">—</span><span class="fpm-ro-u">mm</span></div>
          <div class="fpm-ro"><span class="fpm-ro-k">λ = Δa·d / e</span><span class="fpm-ro-v" id="dspLamMess">—</span><span class="fpm-ro-u">nm</span></div>
        </div>
        <div id="dspSoll" class="dsp-soll"></div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="dspTakeBtn" onclick="_dspTake()">✓ Messwert übernehmen</button>
          <button class="sim-btn" onclick="_dspFit()">🔍 Ausschnitt passend</button>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn" onclick="_dspAuto()">📏 Fotodiode: 10 Abstände</button>
          <button class="sim-btn" onclick="_dspDemo()">📋 Beispielmessreihe</button>
          <button class="sim-btn" onclick="_dspClear()">🗑 Tabelle leeren</button>
        </div>
        <div class="fpm-tablewrap">
          <table class="sim-table">
            <thead><tr><th>λ-Quelle</th><th>d (mm)</th><th>e (m)</th><th>n</th><th>Δx (mm)</th><th>Δa (mm)</th><th>λ (nm)</th><th></th></tr></thead>
            <tbody id="dspTbody"></tbody>
          </table>
          <div class="fpm-empty" id="dspEmpty">Noch keine Messwerte.<br>Marken setzen → n eintragen → übernehmen.</div>
        </div>
      </div>
    </div>

    <div class="fpm-label" style="margin-top:12px">Auswertung – jede Auftragung muss eine Ursprungsgerade ergeben</div>
    <div class="fpm-tabs">${presets}</div>
    <div class="fpm-grid2">
      <canvas id="dspPlot" width="470" height="330" class="phys-chart-cv"></canvas>
      <div>
        <div class="fpm-fit" id="dspFitBox"></div>
        <div class="fpm-label" style="margin-top:10px">Funktion plotten</div>
        <input type="text" id="dspFn" class="fpm-input" placeholder="z. B. 6.328*x" spellcheck="false"
          oninput="_dspSetFn(this.value)">
        <div class="fpm-err" id="dspFnErr"></div>
        <div class="sim-btn-row" style="padding:2px 0 4px">
          <button class="sim-btn primary" onclick="_dspTheorieFn()">ƒ Theoriefunktion</button>
          <button class="sim-btn" onclick="_dspClearFn()">Feld leeren</button>
        </div>
        <div class="fpm-theo" id="dspTheo"></div>
        <div class="fpm-note">Erlaubt: x, pi, + − * / ^, sqrt(), sin(), cos(), abs(), exp(), ln(). Malpunkt immer schreiben.</div>
        <label class="fpm-check"><input type="checkbox" checked onchange="_dspSet('origin',this.checked)">
          Ausgleichsgerade durch den Ursprung</label>
      </div>
    </div>

    <div id="dspErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      Maxima: <b>sin α<sub>k</sub> = k · λ/d</b> &nbsp;|&nbsp; Minima: <b>sin α<sub>k</sub> = (2k+1)/2 · λ/d</b>
      &nbsp;|&nbsp; kleine Winkel: <b>Δa = e·λ/d</b> ⇒ <b>λ = Δa·d/e</b>
    </p>
  </div>`;
}

function _dspErklHTML() {
  return `<div class="dsp-erkl-kopf">Warum entstehen die Streifen?</div>
    <div class="dsp-erkl-text">
      Nach dem <b>Huygensschen Prinzip</b> wirkt jede der beiden Spaltöffnungen als Ausgangspunkt einer
      neuen Kreiswelle – genau wie der enge Spalt in der Wellenwanne. Beide Wellen sind kohärent, weil sie
      aus derselben Lichtquelle stammen. Sie überlagern sich auf dem Schirm: Wo der <b>Gangunterschied</b>
      Δs = d·sin α ein ganzzahliges Vielfaches von λ ist, verstärken sie sich (Maximum), wo er ein
      ungeradzahliges Vielfaches von λ/2 ist, löschen sie sich aus (Minimum).
      Thomas Young hat damit 1802 gezeigt, dass Licht Welleneigenschaften hat.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Messtipp aus der Handreichung</div>
    <div class="dsp-erkl-text">
      Das nullte Maximum ist oft schwer genau zu treffen. Miss deshalb <b>nicht</b> vom Zentrum aus, sondern
      über <b>mehrere</b> Streifen hinweg von Maximum zu Maximum – oder besser von Minimum zu Minimum, die
      sind schärfer – und teile die Strecke durch die Anzahl n der Abstände. Der Fehler beim Anlegen der
      Marken verteilt sich dann auf n Abstände und wird n-mal kleiner.
    </div>
    <div class="dsp-erkl-warn">⚠ Im echten Versuch: niemals in den Laserstrahl blicken, Warnschild aufstellen,
      Raum abdunkeln. Nur Laser der zugelassenen Leistungsklasse verwenden.</div>`;
}

// ── Bedienung ──────────────────────────────────────────
function _dspSet(key, val) {
  _dsp[key] = val;
  if (key === 'weiss') { _dspRefreshTheorie(); _dspUpdateRead(); }
  _dspDrawPlot();
}
function _dspSetLaser(i) {
  _dsp.li = i;
  _DSP_LASER.forEach((L, k) => document.getElementById('dspL' + k)?.classList.toggle('on', k === i));
  _dspLamInfo(); _dspUpdateRead(); _dspRefreshTheorie();
}
function _dspSetD(i) {
  _dsp.d = _DSP_SPALTE[i];
  _DSP_SPALTE.forEach((v, k) => document.getElementById('dspD' + k)?.classList.toggle('on', k === i));
  _dspSetB(_dsp.b);          // b nachziehen, falls es jetzt zu breit waere
  _dspUpdateRead(); _dspRefreshTheorie();
}
function _dspSetE(v) {
  _dsp.e = +v;
  const el = document.getElementById('dspELbl'); if (el) el.textContent = _fpmNum(+v, 2) + ' m';
  _dspUpdateRead(); _dspRefreshTheorie();
}
// Zwei Spalte der Breite b im Abstand d koennen sich nicht ueberlappen –
// b wird deshalb auf 0,6·d begrenzt, so wie es das echte Dia vorgibt.
function _dspBMax() { return Math.round(_dsp.d * 0.6 * 100) / 100; }
function _dspSetB(v) {
  _dsp.b = Math.min(+v, _dspBMax());
  const el = document.getElementById('dspBLbl'); if (el) el.textContent = _fpmNum(_dsp.b, 2) + ' mm';
  const sl = document.getElementById('dspB'); if (sl) sl.value = String(_dsp.b);
  _dspBNote();
}
// Bei ganzzahligem d/b faellt jedes d/b-te Maximum in ein Minimum der
// Einhuellenden und fehlt – das ist echte Physik und lohnt einen Hinweis.
function _dspBNote() {
  const el = document.getElementById('dspBNote'); if (!el) return;
  const q = _dsp.d / _dsp.b;
  const ganz = Math.abs(q - Math.round(q)) < 0.02 && Math.round(q) >= 2;
  el.innerHTML = 'd / b = ' + _fpmNum(q, 1) +
    (ganz ? ' – jedes ' + Math.round(q) + '. Maximum fehlt, es liegt im Minimum der Einzelspalt-Einhüllenden.'
          : ' – die Einhüllende des Einzelspalts macht die äußeren Maxima schwächer.');
}
function _dspSetView(v) { _dsp.view = +v; _dspUpdateRead(); }
function _dspSetAktiv(nr) {
  _dsp.aktiv = nr;
  document.getElementById('dspMk1')?.classList.toggle('on', nr === 1);
  document.getElementById('dspMk2')?.classList.toggle('on', nr === 2);
}
function _dspNudge(dir) {
  const schritt = _dsp.view / 200;          // feine Korrektur, unabhaengig vom Zoom
  const k = _dsp.aktiv === 1 ? 'm1' : 'm2';
  _dsp[k] = Math.max(-_dsp.view, Math.min(_dsp.view, _dsp[k] + dir * schritt));
  _dspUpdateRead();
}
function _dspSetN(v) {
  const n = Math.max(1, Math.min(40, Math.round(+v || 1)));
  _dsp.n = n;
  _dspUpdateRead();
}
// Waehlt den kleinsten Ausschnitt, in dem noch mehrere Streifen Platz haben
function _dspFit() {
  const da = _dspDaTheo();
  const ziel = da * 4;
  const v = _DSP_VIEWS.find(x => x >= ziel) || _DSP_VIEWS[_DSP_VIEWS.length - 1];
  _dsp.view = v;
  const sel = document.querySelector('.dsp-screen-bar select');
  if (sel) sel.value = String(v);
  _dsp.m1 = Math.max(-v, Math.min(v, _dsp.m1));
  _dsp.m2 = Math.max(-v, Math.min(v, _dsp.m2));
  _dspUpdateRead();
}
function _dspSetPreset(i) {
  _dsp.preset = i;
  for (let k = 0; k < 3; k++) document.getElementById('dspTab' + k)?.classList.toggle('on', k === i);
  _dspRefreshTheorie();
  _dspDrawPlot();
}

function _dspLamInfo() {
  const el = document.getElementById('dspLam'); if (!el) return;
  const L = _DSP_LASER[_dsp.li];
  el.innerHTML = _dsp.weiss
    ? '<b>Glühlicht</b> – alle Wellenlängen von 400 nm bis 700 nm gleichzeitig'
    : L.kurz + (_dsp.reveal ? ' · <b>λ = ' + _fpmNum(L.lam, 1) + ' nm</b>' : '');
}

function _dspUpdateRead() {
  if (!_dsp) return;
  const dx = _dspDx(), da = _dspDa();
  const lam = _dspLamAus(da, _dsp.d, _dsp.e);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('dspDx', _fpmNum(dx, 2));
  set('dspDa', _fpmNum(da, 3));
  set('dspLamMess', dx > 0 ? _fpmNum(lam, 1) : '—');
  _dspLamInfo(); _dspBNote();

  const soll = document.getElementById('dspSoll');
  if (soll) {
    if (_dsp.weiss) {
      soll.innerHTML = '<span class="fpm-note">Glühlicht enthält viele Wellenlängen gleichzeitig – ' +
        'eine einzelne Wellenlänge lässt sich so nicht bestimmen. Für die Messung einen Laser wählen.</span>';
    } else if (_dsp.reveal && dx > 0) {
      const w = _dspLam();
      const abw = Math.abs(lam - w) / w * 100;
      const cls = abw < 1 ? 'ok' : abw < 5 ? 'mid' : 'no';
      soll.innerHTML = `<span class="fpm-fitmeta">gemessen ${_fpmNum(lam, 1)} nm · Sollwert ${_fpmNum(w, 1)} nm</span>
        <span class="fpm-badge ${cls}">Abweichung ${_fpmNum(abw, 2)} %</span>`;
    } else soll.innerHTML = '';
  }
  const take = document.getElementById('dspTakeBtn');
  if (take) take.disabled = !(dx > 0) || _dsp.weiss;
}

// ── Messwerttabelle ────────────────────────────────────
function _dspAddRow(lam, li, d, e, n, dx) {
  _dsp.rows.push({ id: _dsp.nextId++, lam, li, d, e, n, dx, da: dx / n });
  _dspRenderTable(); _dspDrawPlot();
}
function _dspTake() {
  const dx = _dspDx();
  if (!(dx > 0) || _dsp.weiss) return;
  _dspAddRow(_dspLam(), _dsp.li, _dsp.d, _dsp.e, _dsp.n, dx);
}
// Fotodiode: faehrt das Muster ab und findet 10 Streifenabstaende
function _dspAuto() {
  if (_dsp.weiss) return;
  const n = 10;
  const x = _dspXk(n);
  if (!isFinite(x)) return;
  const dx = Math.abs(x) * (1 + (Math.random() - 0.5) * 0.008);
  _dspAddRow(_dspLam(), _dsp.li, _dsp.d, _dsp.e, n, dx);
}
function _dspDelRow(id) {
  _dsp.rows = _dsp.rows.filter(r => r.id !== id);
  _dspRenderTable(); _dspDrawPlot();
}
function _dspClear() {
  if (_dsp.rows.length && !confirm('Alle ' + _dsp.rows.length + ' Messwerte löschen?')) return;
  _dsp.rows = []; _dspRenderTable(); _dspDrawPlot();
}
// Eine vollstaendige Messreihe, wie sie im Unterricht entstehen wuerde
function _dspDemo() {
  const alt = { li: _dsp.li, d: _dsp.d, e: _dsp.e };
  const mess = (li, d, e, n) => {
    _dsp.li = li; _dsp.d = d; _dsp.e = e;
    const x = _dspXk(n);
    if (!isFinite(x)) return;
    _dsp.rows.push({ id: _dsp.nextId++, lam: _DSP_LASER[li].lam, li, d, e, n,
      dx: Math.abs(x) * (1 + (Math.random() - 0.5) * 0.01), da: 0 });
    const r = _dsp.rows[_dsp.rows.length - 1]; r.da = r.dx / r.n;
  };
  [2, 4, 6, 8, 10].forEach(n => mess(0, 0.20, 2.0, n));           // Ordnung variieren
  [0.5, 1.0, 1.5, 2.5, 3.0, 3.5, 4.0].forEach(e => mess(0, 0.20, e, 10));  // Schirmabstand
  [0.10, 0.15, 0.25, 0.30].forEach(d => mess(0, d, 2.0, 10));     // Spaltabstand
  _dsp.li = alt.li; _dsp.d = alt.d; _dsp.e = alt.e;
  _dspRenderTable(); _dspDrawPlot();
}
function _dspRenderTable() {
  const tb = document.getElementById('dspTbody'); if (!tb) return;
  const empty = document.getElementById('dspEmpty');
  if (empty) empty.style.display = _dsp.rows.length ? 'none' : 'block';
  tb.innerHTML = _dsp.rows.map(r =>
    `<tr>
       <td><span class="fpm-dot" style="background:${_DSP_LASER[r.li].col}"></span>${_DSP_LASER[r.li].n}</td>
       <td>${_fpmNum(r.d, 2)}</td><td>${_fpmNum(r.e, 2)}</td><td>${r.n}</td>
       <td>${_fpmNum(r.dx, 2)}</td><td><b>${_fpmNum(r.da, 3)}</b></td>
       <td>${_fpmNum(_dspLamAus(r.da, r.d, r.e), 1)}</td>
       <td class="fpm-del" onclick="_dspDelRow(${r.id})" title="löschen">✕</td>
     </tr>`).join('');
}

// ── Auswertungsdiagramm ────────────────────────────────
// Jede Auftragung isoliert eine Abhaengigkeit; die Steigung liefert λ.
const _DSP_PRESETS = [
  { xl: 'n (Anzahl der Streifenabstände)', yl: 'Δx in mm',
    x: r => r.n, y: r => r.dx,
    grp: r => r.li + '|' + r.d + '|' + r.e,
    gl: r => _DSP_LASER[r.li].n + ', d = ' + _fpmNum(r.d, 2) + ' mm, e = ' + _fpmNum(r.e, 2) + ' m',
    slope: r => r.e * r.lam / (1000 * r.d),
    lamAus: (k, r) => 1000 * k * r.d / r.e,
    note: 'Ursprungsgerade ⇒ die Streifen liegen gleich weit auseinander. Die Steigung ist genau ein Streifenabstand Δa.',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'Δx(n) = n · e·λ/d',
    term: () => _dspZahl(_dsp.e * _dspLam() / (1000 * _dsp.d)) + '*x',
    param: () => 'Steigung e·λ/d = ' + _fpmNum(_dspDaTheo(), 3) + ' mm',
    deutung: 'Misst du über n Streifen statt über einen, wird die Strecke n-mal so lang – der Ablesefehler aber nicht. Genau deshalb misst man über viele Ordnungen und teilt.' },

  { xl: 'e in m', yl: 'Δa in mm',
    x: r => r.e, y: r => r.da,
    grp: r => r.li + '|' + r.d,
    gl: r => _DSP_LASER[r.li].n + ', d = ' + _fpmNum(r.d, 2) + ' mm',
    slope: r => r.lam / (1000 * r.d),
    lamAus: (k, r) => 1000 * k * r.d,
    note: 'Ursprungsgerade ⇒ Δa ~ e. Doppelter Schirmabstand, doppelter Streifenabstand.',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'Δa(e) = (λ/d) · e',
    term: () => _dspZahl(_dspLam() / (1000 * _dsp.d)) + '*x',
    param: () => 'Steigung λ/d = ' + _fpmNum(_dspLam() / (1000 * _dsp.d), 4) + ' mm/m',
    deutung: 'Das Streifenmuster wird einfach mitvergrößert: Die Winkel α bleiben gleich, nur der Weg bis zum Schirm wird länger. Aus der Steigung folgt λ = Steigung · d.' },

  { xl: '1/d in 1/mm', yl: 'Δa in mm',
    x: r => 1 / r.d, y: r => r.da,
    grp: r => r.li + '|' + r.e,
    gl: r => _DSP_LASER[r.li].n + ', e = ' + _fpmNum(r.e, 2) + ' m',
    slope: r => r.e * r.lam / 1000,
    lamAus: (k, r) => 1000 * k / r.e,
    note: 'Ursprungsgerade über 1/d ⇒ Δa ~ 1/d. Enger Doppelspalt, breiteres Muster.',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'Δa(1/d) = (e·λ) · (1/d)',
    term: () => _dspZahl(_dsp.e * _dspLam() / 1000) + '*x',
    param: () => 'Steigung e·λ = ' + _fpmNum(_dsp.e * _dspLam() / 1000, 4) + ' mm²',
    deutung: 'Nicht d selbst, sondern der Kehrwert 1/d liefert die Gerade: Δa ist umgekehrt proportional zu d. Aus der Steigung folgt λ = Steigung / e.' }
];

function _dspZahl(v) { return String(Math.round(v * 1e6) / 1e6); }

function _dspDrawPlot() {
  const cv = document.getElementById('dspPlot');
  if (!cv || !_dsp) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _DSP_PRESETS[_dsp.preset];
  const padL = 62, padR = 14, padT = 14, padB = 42;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const pts = _dsp.rows.map(r => ({ x: P.x(r), y: P.y(r) })).filter(p => isFinite(p.x) && isFinite(p.y));
  let xmax = pts.length ? Math.max(...pts.map(p => p.x)) * 1.15 : 1;
  let ymax = pts.length ? Math.max(...pts.map(p => p.y)) * 1.15 : 1;
  if (_dsp.fn) for (let i = 0; i <= 20; i++) {
    let v; try { v = _dsp.fn(xmax * i / 20); } catch (err) { v = NaN; }
    if (isFinite(v) && v > ymax) ymax = v * 1.05;
  }
  if (!(xmax > 0) || !isFinite(xmax)) xmax = 1;
  if (!(ymax > 0) || !isFinite(ymax)) ymax = 1;

  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - v / ymax * (y0 - y1);

  const xt = _fpmTicks(xmax, 6), yt = _fpmTicks(ymax, 5);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 14);
  });
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 6, Y(v) + 3);
  });
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 30);
  ctx.save(); ctx.translate(13, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'right'; ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (!pts.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte aufgenommen', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('dspFitBox');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    return;
  }

  // eingegebene Funktion
  if (_dsp.fn) {
    ctx.strokeStyle = '#db2777'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let started = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _dsp.fn((px - x0) / (x1 - x0) * xmax); } catch (err) { yv = NaN; }
      if (!isFinite(yv)) { started = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { started = false; continue; }
      started ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), started = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  // Messreihen gruppieren
  const map = new Map();
  _dsp.rows.forEach(r => {
    const k = P.grp(r);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  });
  const palette = ['#7c3aed', '#f97316', '#0284c7', '#16a34a', '#db2777', '#0f766e'];
  const info = [];

  [...map.keys()].sort().forEach((k, gi) => {
    const rows = map.get(k);
    const col = rows.length === 1 ? _DSP_LASER[rows[0].li].col : palette[gi % palette.length];
    const gp = rows.map(r => ({ x: P.x(r), y: P.y(r) })).filter(p => isFinite(p.x) && isFinite(p.y));

    let fit = null;
    if (gp.length >= 2) {
      fit = _dsp.origin ? _fpmFitOrigin(gp) : _fpmFitLinear(gp);
      if (fit) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(0), Y(fit.b)); ctx.lineTo(X(xmax), Y(fit.k * xmax + fit.b)); ctx.stroke();
      }
    }
    gp.forEach(p => {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 4, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke();
    });
    info.push({ ref: rows[0], col, fit, n: gp.length });
  });

  _dspRenderFit(info, P);
}

function _dspRenderFit(groups, P) {
  const el = document.getElementById('dspFitBox');
  if (!el) return;
  let html = '';
  groups.forEach(g => {
    if (!g.fit) return;
    const lam = P.lamAus(g.fit.k, g.ref);
    const soll = g.ref.lam;
    const abw = Math.abs(lam - soll) / soll * 100;
    const cls = abw < 1 ? 'ok' : abw < 5 ? 'mid' : 'no';
    const eq = 'y = ' + _fpmNum(g.fit.k, g.fit.k < 1 ? 4 : 3) + '·x' +
      (_dsp.origin ? '' : (g.fit.b >= 0 ? ' + ' : ' − ') + _fpmNum(Math.abs(g.fit.b), 4));
    html += `<div class="fpm-fitline">
       <span class="fpm-fitmeta"><span class="fpm-dot" style="background:${g.col}"></span>${P.gl(g.ref)} · ${g.n} Messwerte</span>
       <span class="fpm-fiteq">${eq}</span>
       <span class="fpm-fitmeta">R² = ${_fpmNum(g.fit.r2, 4)} · erwartete Steigung ${_fpmNum(P.slope(g.ref), P.slope(g.ref) < 1 ? 4 : 3)}</span>
       <span class="fpm-fiteq" style="color:#5b21b6">λ = ${_fpmNum(lam, 1)} nm</span>
       ${_dsp.reveal ? `<span class="fpm-badge ${cls}">Sollwert ${_fpmNum(soll, 1)} nm · Abweichung ${_fpmNum(abw, 2)} %</span>` : ''}
     </div>`;
  });
  if (!html) {
    el.innerHTML = '<div class="fpm-note">Mindestens zwei Messwerte je Messreihe nötig – und dabei jeweils nur <i>eine</i> Größe verändern.<br>' + P.note + '</div>';
    return;
  }
  el.innerHTML = html + '<div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">' + P.note + '</div>';
}

// ── Theoriefunktion ────────────────────────────────────
function _dspTheorieFn() {
  const term = _DSP_PRESETS[_dsp.preset].term();
  const inp = document.getElementById('dspFn');
  if (inp) inp.value = term;
  _dspSetFn(term);
  _dsp.fnAuto = true;
  _dspRenderTheorie(true);
}
function _dspClearFn() {
  const inp = document.getElementById('dspFn');
  if (inp) inp.value = '';
  _dspSetFn('');
  _dspRenderTheorie(false);
}
function _dspRefreshTheorie() {
  if (_dsp.fnAuto) {
    const term = _DSP_PRESETS[_dsp.preset].term();
    const inp = document.getElementById('dspFn');
    if (inp) inp.value = term;
    _dspSetFn(term);
    _dsp.fnAuto = true;
  }
  _dspRenderTheorie(_dsp.fnAuto);
}
function _dspRenderTheorie(eingesetzt) {
  const el = document.getElementById('dspTheo');
  if (!el) return;
  const P = _DSP_PRESETS[_dsp.preset];
  el.innerHTML =
    `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
     <div class="fpm-theo-typ">${P.typ}</div>
     <div class="fpm-theo-form">${P.form}</div>
     <div class="fpm-theo-par">${P.param()}</div>
     ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${P.term()}</div>` : ''}
     <div class="fpm-theo-deutung">${P.deutung}</div>`;
}
function _dspSetFn(str) {
  _dsp.fnAuto = false;
  const err = document.getElementById('dspFnErr');
  const v = (str || '').trim();
  if (!v) { _dsp.fn = null; if (err) err.textContent = ''; _dspDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _dsp.fn = f; if (err) err.textContent = '';
  } catch (e) { _dsp.fn = null; if (err) err.textContent = e.message; }
  _dspDrawPlot();
}

// ── Marken per Finger oder Maus setzen ─────────────────
function _dspBind() {
  const cv = document.getElementById('dspScreen');
  if (!cv || !cv.addEventListener) return;
  const mmAus = ev => {
    const r = cv.getBoundingClientRect();
    return _dspPxToMm((ev.clientX - r.left) * (cv.width / r.width));
  };
  const setze = ev => {
    const mm = mmAus(ev);
    if (_dsp.aktiv === 1) _dsp.m1 = mm; else _dsp.m2 = mm;
    _dspUpdateRead();
  };
  cv.addEventListener('pointerdown', ev => {
    ev.preventDefault();
    const mm = mmAus(ev);
    // die naeher liegende Marke anfassen – so wie man im Labor greift
    _dspSetAktiv(Math.abs(mm - _dsp.m1) <= Math.abs(mm - _dsp.m2) ? 1 : 2);
    _dsp.drag = true;
    if (cv.setPointerCapture) cv.setPointerCapture(ev.pointerId);
    setze(ev);
  });
  cv.addEventListener('pointermove', ev => { if (_dsp.drag) { ev.preventDefault(); setze(ev); } });
  cv.addEventListener('pointerup',     () => { _dsp.drag = false; });
  cv.addEventListener('pointercancel', () => { _dsp.drag = false; });
  cv.addEventListener('pointerleave',  () => { _dsp.drag = false; });
}

// ── Zusaetzliche Styles ────────────────────────────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .dsp-screen { width: 100%; display: block; border-radius: 10px; background: #0f172a;
      touch-action: none; cursor: crosshair; }
    .dsp-screen-bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 7px; }
    .dsp-hint { font-size: .74rem; color: #64748b; flex: 1 1 200px; }
    .dsp-sel { font-size: .74rem; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 5px; }
    .dsp-sel select { padding: 4px 7px; border: 1px solid #e2e8f0; border-radius: 7px;
      font-size: .76rem; color: #1e293b; background: #fff; }
    .dsp-lasers { display: flex; gap: 6px; flex-wrap: wrap; }
    .dsp-laser { flex: 1 1 70px; display: flex; align-items: center; gap: 6px; padding: 6px 9px;
      background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 9px; cursor: pointer;
      font-size: .76rem; font-weight: 700; color: #475569; }
    .dsp-laser:hover { border-color: #cbd5e1; }
    .dsp-laser.on { border-color: #7c3aed; background: #f5f3ff; color: #5b21b6; }
    .dsp-laser-p { width: 11px; height: 11px; border-radius: 50%; flex: 0 0 auto; }
    .dsp-lam { font-size: .73rem; color: #64748b; margin-top: 5px; }
    .dsp-lam b { color: #5b21b6; font-variant-numeric: tabular-nums; }
    .dsp-slits { display: flex; gap: 6px; flex-wrap: wrap; }
    .dsp-slit { flex: 1 1 46px; padding: 6px 4px; background: #f8fafc; border: 2px solid #e2e8f0;
      border-radius: 9px; cursor: pointer; font-size: .8rem; font-weight: 800; color: #1e293b;
      font-variant-numeric: tabular-nums; }
    .dsp-slit:hover { border-color: #cbd5e1; }
    .dsp-slit.on { border-color: #7c3aed; background: #f5f3ff; color: #5b21b6; }
    .dsp-marks { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .dsp-mk { display: flex; align-items: center; gap: 6px; padding: 7px 11px; background: #f8fafc;
      border: 2px solid #e2e8f0; border-radius: 9px; cursor: pointer; font-size: .78rem;
      font-weight: 700; color: #475569; }
    .dsp-mk:hover { border-color: #cbd5e1; }
    .dsp-mk.on { border-color: #7c3aed; background: #f5f3ff; color: #5b21b6; }
    .dsp-mk-p { width: 10px; height: 10px; border-radius: 2px; }
    .dsp-nrow { display: flex; align-items: center; gap: 8px; margin: 8px 0 7px; flex-wrap: wrap; }
    .dsp-num { width: 68px; padding: 5px 8px; border: 1px solid #e2e8f0; border-radius: 8px;
      font-size: .84rem; font-weight: 800; color: #1e293b; font-variant-numeric: tabular-nums; }
    .dsp-num:focus { outline: 2px solid #7c3aed; outline-offset: 1px; border-color: #7c3aed; }
    .dsp-soll { display: flex; flex-direction: column; gap: 2px; min-height: 16px; margin-top: 6px; }
    .dsp-erkl { background: #f5f3ff; border: 1px solid #ddd6fe; border-left: 3px solid #7c3aed;
      border-radius: 9px; padding: 10px 12px; margin-top: 12px; }
    .dsp-erkl-kopf { font-size: .8rem; font-weight: 800; color: #5b21b6; }
    .dsp-erkl-text { font-size: .76rem; color: #475569; line-height: 1.55; margin-top: 4px; }
    .dsp-erkl-warn { font-size: .73rem; color: #b45309; background: #fffbeb; border: 1px solid #fde68a;
      border-radius: 7px; padding: 6px 9px; margin-top: 8px; }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════
// OPTISCHES GITTER – Schluesselexperiment 03 des KLP
// Grundlage: Handreichung "Versuch 03: Optisches Gitter" (NRW)
//
// Der Weg der Handreichung: Doppelspalt -> Vierfachspalt -> Gitter.
// Mit wachsender Spaltzahl N werden die Hauptmaxima heller und schaerfer,
// dazwischen liegen N-1 Nullstellen und N-2 schwaechere Nebenmaxima.
//
//   Hauptmaxima:  sin α_k = k · λ/g          g = Gitterkonstante
//   Erstes Minimum nach dem k-ten Maximum bei Δs = k·λ + λ/N
//
// Intensitaet nach der Zeigeraddition der Handreichung:
//   I(α) = I₀ · sin²(N·δ/2) / (N²·sin²(δ/2))     mit δ = 2π/λ · g·sin α
// erweitert um die Einhuellende der Einzelspaltbeugung:
//   · [sin(φ/2)/(φ/2)]²                          mit φ = 2π/λ · b·sin α
// An den Stellen δ = 2πk wird der Nenner Null; der Grenzwert ist 1,
// deshalb sind alle Hauptmaxima gleich hell (Handreichung, Seite 9).
//
// Wichtig und anders als beim Doppelspalt: Die Winkel sind hier NICHT
// mehr klein. sin α wird deshalb nirgends durch tan α ersetzt – weder
// in der Simulation noch in der Auswertung.
// ═══════════════════════════════════════════════════════

const _GIT_W = 860;
const _GIT_VIEWS = [10, 25, 50, 100, 200, 400, 800];   // Ausschnitt ± in mm

// g in mm; bei den Gittern aus der Strichzahl pro mm berechnet
const _GIT_GITTER = [
  { n: 'Doppelspalt',   fest: 2, g: 0.200,        b: 0.020, kurz: '2 Spalte im Abstand 0,20 mm' },
  { n: 'Vierfachspalt', fest: 4, g: 0.200,        b: 0.020, kurz: '4 Spalte im Abstand 0,20 mm' },
  { n: '100/mm',   striche: 100,                            kurz: 'Gitter mit 100 Strichen pro mm' },
  { n: '300/mm',   striche: 300,                            kurz: 'Gitter mit 300 Strichen pro mm' },
  { n: '500/mm',   striche: 500,                            kurz: 'Gitter mit 500 Strichen pro mm' },
  { n: '1000/mm',  striche: 1000,                           kurz: 'Gitter mit 1000 Strichen pro mm' },
  { n: 'CD',       striche: 625,  spur: true,               kurz: 'CD als Reflexionsgitter – Spurabstand 1,60 µm' },
  { n: 'DVD',      striche: 1351, spur: true,               kurz: 'DVD als Reflexionsgitter – Spurabstand 0,74 µm' }
];

let _git = null;

function _gitInit() {
  _git = {
    li: 0, gi: 3, e: 1.00, strahl: 1.0,
    weiss: false, profil: true, einzel: true, reveal: false, view: 400,
    modus: 'lam',                       // 'lam' = λ bestimmen, 'g' = Gitterkonstante bestimmen
    m1: -100, m2: 100, aktiv: 2, k: 1, drag: false,
    rows: [], nextId: 1,
    preset: 0, fn: null, fnAuto: false, origin: true,
    key: '', off: null, prof: null
  };
}

// ── Kenngroessen ───────────────────────────────────────
function _gitDef()  { return _GIT_GITTER[_git.gi]; }
function _gitG()    { const G = _gitDef(); return G.fest ? G.g : 1 / G.striche; }   // in mm
// Spaltbreite. Bei g/2 (halb offen, halb zu) faellt JEDE geradzahlige Ordnung
// in eine Nullstelle der Einhuellenden und verschwindet – ein reales Gitter
// verhaelt sich nicht so. Mit b = g/5 daempft die Einhuellende die aeusseren
// Ordnungen nur allmaehlich, so wie man es im Versuch sieht.
function _gitB()    { const G = _gitDef(); return G.fest ? G.b : _gitG() / 5; }     // in mm
function _gitN()    {
  const G = _gitDef();
  if (G.fest) return G.fest;
  return Math.max(2, Math.min(5000, Math.round(_git.strahl * G.striche)));
}
function _gitLam()  { return _DSP_LASER[_git.li].lam; }        // in nm
function _gitLamMm(lam) { return (lam || _gitLam()) * 1e-6; }
function _gitEmm()  { return _git.e * 1000; }

// Hoechste ueberhaupt mogliche Ordnung: sin α darf 1 nicht ueberschreiten
function _gitKmax() { return Math.floor(_gitG() / _gitLamMm()); }

// Lage des k-ten Hauptmaximums in mm – exakt, ohne Kleinwinkelnaeherung
function _gitXk(k) {
  const q = k * _gitLamMm() / _gitG();
  if (Math.abs(q) >= 1) return NaN;
  return _gitEmm() * Math.tan(Math.asin(q));
}
// Halbe Breite des k-ten Hauptmaximums: bis zum ersten Minimum bei Δs = kλ + λ/N
function _gitBreite(k) {
  const N = _gitN(), q = (k + 1 / N) * _gitLamMm() / _gitG();
  if (Math.abs(q) >= 1) return NaN;
  return _gitEmm() * Math.tan(Math.asin(q)) - _gitXk(k);
}

// Intensitaet an der Stelle x (mm von der Mitte)
function _gitI(x, lam) {
  const e = _gitEmm();
  const s = x / Math.sqrt(x * x + e * e);          // sin α, exakt
  const l = _gitLamMm(lam);
  const N = _gitN();
  const delta = 2 * Math.PI * _gitG() * s / l;
  const sd = Math.sin(delta / 2);
  // Grenzwert 1 an den Hauptmaxima (Nenner wird dort Null) – Handreichung S. 9
  const gitter = Math.abs(sd) < 1e-9 ? 1 : Math.pow(Math.sin(N * delta / 2) / (N * sd), 2);
  if (!_git.einzel) return gitter;
  const phi = 2 * Math.PI * _gitB() * s / l;
  const si = Math.abs(phi) < 1e-9 ? 1 : Math.sin(phi / 2) / (phi / 2);
  return si * si * gitter;
}

// ── Messgroessen ───────────────────────────────────────
// Ueber beide Marken gemessen: von der Ordnung -k bis +k, also durch 2 teilen.
function _gitAk()    { return Math.abs(_git.m2 - _git.m1) / 2; }
function _gitSinA()  { const a = _gitAk(), e = _gitEmm(); return a / Math.sqrt(a * a + e * e); }
function _gitAlpha() { return Math.atan2(_gitAk(), _gitEmm()) * 180 / Math.PI; }
// λ = g · sin α / k   (Ergebnis in nm)
function _gitLamAus(sinA, g, k) { return g * sinA / k * 1e6; }
// g = k · λ / sin α   (Ergebnis in mm)
function _gitGAus(sinA, lam, k) { return sinA > 0 ? k * lam * 1e-6 / sinA : NaN; }

// ── Schirmbild vorberechnen ────────────────────────────
function _gitScale() { return (_GIT_W / 2 - 10) / _git.view; }
function _gitMmToPx(x) { return _GIT_W / 2 + x * _gitScale(); }
function _gitPxToMm(px) {
  const v = (px - _GIT_W / 2) / _gitScale();
  return Math.max(-_git.view, Math.min(_git.view, v));
}
function _gitKey() {
  return [_git.li, _git.gi, _git.e, _git.strahl, _git.weiss ? 1 : 0,
          _git.einzel ? 1 : 0, _git.view].join('|');
}

function _gitBuild() {
  const W = _GIT_W, cx = W / 2, sc = _gitScale();
  const lams = _git.weiss ? _dspWeissLams()
                          : [{ lam: _gitLam(), rgb: _dspSpektralRGB(_gitLam()) }];
  // Zwischen den Hauptmaxima draengen sich N-1 Nullstellen. Ohne kraeftige
  // Unterabtastung entstuende dort ein Flimmermuster statt Dunkelheit.
  const SUB = _gitN() > 8 ? 8 : 4;
  const tmp = new Float64Array(W * 3);
  const prof = new Float64Array(W);
  let maxC = 0, maxI = 0;

  for (let px = 0; px < W; px++) {
    let r = 0, g = 0, b = 0, ii = 0;
    for (let s = 0; s < SUB; s++) {
      const x = (px + (s + 0.5) / SUB - cx) / sc;
      for (const L of lams) {
        const I = _gitI(x, L.lam);
        r += I * L.rgb[0]; g += I * L.rgb[1]; b += I * L.rgb[2]; ii += I;
      }
    }
    const nl = SUB * lams.length;
    r /= SUB; g /= SUB; b /= SUB; ii /= nl;
    tmp[px * 3] = r; tmp[px * 3 + 1] = g; tmp[px * 3 + 2] = b;
    prof[px] = ii;
    if (r > maxC) maxC = r; if (g > maxC) maxC = g; if (b > maxC) maxC = b;
    if (ii > maxI) maxI = ii;
  }
  if (!(maxC > 0)) maxC = 1;
  if (!(maxI > 0)) maxI = 1;
  for (let px = 0; px < W; px++) prof[px] /= maxI;

  const off = document.createElement('canvas');
  off.width = W; off.height = 1;
  const octx = off.getContext('2d');
  const img = octx.createImageData(W, 1);
  for (let px = 0; px < W; px++) {
    img.data[px * 4]     = 255 * Math.pow(Math.min(1, tmp[px * 3]     / maxC), 0.45);
    img.data[px * 4 + 1] = 255 * Math.pow(Math.min(1, tmp[px * 3 + 1] / maxC), 0.45);
    img.data[px * 4 + 2] = 255 * Math.pow(Math.min(1, tmp[px * 3 + 2] / maxC), 0.45);
    img.data[px * 4 + 3] = 255;
  }
  octx.putImageData(img, 0, 0);

  _git.off = off; _git.prof = prof; _git.key = _gitKey();
}

// ── Schirm zeichnen ────────────────────────────────────
function _gitRenderScreen() {
  const cv = document.getElementById('gitScreen');
  if (!cv || !_git) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  if (_git.key !== _gitKey() || !_git.off) _gitBuild();

  const sy = 6, sh = _git.profil ? 66 : 130;
  const py = sy + sh + 10, ph = 76;
  const ay = _git.profil ? py + ph + 6 : sy + sh + 6;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(_git.off, 0, 0, W, 1, 0, sy, W, sh);
  ctx.restore();
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  ctx.strokeRect(0.5, sy + 0.5, W - 1, sh - 1);
  ctx.fillStyle = 'rgba(226,232,240,.75)'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('SCHIRMBILD', 8, sy + 13);

  // Ordnungen beschriften
  if (!_git.weiss) {
    const kmax = _gitKmax();
    ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
    for (let k = -kmax; k <= kmax; k++) {
      const x = _gitXk(Math.abs(k)) * Math.sign(k || 1) * (k === 0 ? 0 : 1);
      if (!isFinite(x) || Math.abs(x) > _git.view) continue;
      ctx.fillStyle = 'rgba(148,163,184,.9)';
      ctx.fillText('k = ' + k, _gitMmToPx(k === 0 ? 0 : x), sy + sh - 6);
    }
  }

  if (_git.profil) {
    ctx.fillStyle = '#111c30'; ctx.fillRect(0, py, W, ph);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const gy = py + ph * i / 4;
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let px = 0; px < W; px++) {
      const gy = py + ph - _git.prof[px] * (ph - 6);
      px === 0 ? ctx.moveTo(px, gy) : ctx.lineTo(px, gy);
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(226,232,240,.75)'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('INTENSITÄT I(α)', 8, py + 13);
  }

  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.stroke();
  const t = _fpmTicks(_git.view, 5);
  ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  t.ticks.forEach(v => {
    [v, -v].forEach(vv => {
      if (Math.abs(vv) > _git.view) return;
      const px = _gitMmToPx(vv);
      ctx.strokeStyle = '#64748b';
      ctx.beginPath(); ctx.moveTo(px, ay); ctx.lineTo(px, ay + 5); ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(_fpmTickLbl(vv, t.step), px, ay + 16);
    });
  });
  ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
  ctx.fillText('x in mm', W - 6, ay + 16);

  [[_git.m1, 1, '#fbbf24'], [_git.m2, 2, '#f472b6']].forEach(([mm, nr, col]) => {
    const px = _gitMmToPx(mm);
    ctx.strokeStyle = col; ctx.lineWidth = _git.aktiv === nr ? 2 : 1.2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(px, sy); ctx.lineTo(px, ay); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(px, ay - 9); ctx.lineTo(px - 6, ay - 20); ctx.lineTo(px + 6, ay - 20);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0f172a'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(String(nr), px, ay - 11);
  });

  const p1 = _gitMmToPx(_git.m1), p2 = _gitMmToPx(_git.m2);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(p1, ay + 24); ctx.lineTo(p2, ay + 24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p1, ay + 20); ctx.lineTo(p1, ay + 28); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p2, ay + 20); ctx.lineTo(p2, ay + 28); ctx.stroke();
  ctx.fillStyle = '#e2e8f0'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('2·a = ' + _fpmNum(Math.abs(_git.m2 - _git.m1), 1) + ' mm', (p1 + p2) / 2, ay + 40);
}

// ── Zeigerdiagramm ─────────────────────────────────────
// Setzt die Herleitung der Handreichung ins Bild: N Zeiger der Laenge Â₀/N,
// jeder gegenueber dem vorigen um δ gedreht. Liegen alle parallel, ist
// Hauptmaximum; schliesst sich das Polygon, ist Ausloeschung.
function _gitRenderZeiger() {
  const cv = document.getElementById('gitZeiger');
  if (!cv || !_git) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  const x = _git.aktiv === 1 ? _git.m1 : _git.m2;
  const e = _gitEmm();
  const s = x / Math.sqrt(x * x + e * e);
  const l = _gitLamMm();
  const N = _gitN();
  const delta = 2 * Math.PI * _gitG() * s / l;
  const sd = Math.sin(delta / 2);
  const amp = Math.abs(sd) < 1e-9 ? 1 : Math.abs(Math.sin(N * delta / 2) / (N * sd));

  const R = 74, cx = W / 2 - 18, cy = H / 2 + 6;
  const gezeichnet = Math.min(N, 24);
  const len = R / gezeichnet;

  // Zeigerkette
  let px = cx - R / 2, py = cy + 40, ang = 0;
  const startX = px, startY = py;
  ctx.lineWidth = 2;
  for (let i = 0; i < gezeichnet; i++) {
    const nx = px + len * Math.cos(ang), ny = py - len * Math.sin(ang);
    ctx.strokeStyle = '#7c3aed';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath(); ctx.arc(nx, ny, 1.8, 0, 2 * Math.PI); ctx.fill();
    px = nx; py = ny; ang += delta;
  }
  // Resultierender Zeiger
  ctx.strokeStyle = '#db2777'; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(px, py); ctx.stroke();
  const dx = px - startX, dy = py - startY, dl = Math.sqrt(dx * dx + dy * dy) || 1;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(px - 9 * dx / dl - 5 * dy / dl, py - 9 * dy / dl + 5 * dx / dl);
  ctx.lineTo(px - 9 * dx / dl + 5 * dy / dl, py - 9 * dy / dl - 5 * dx / dl);
  ctx.closePath(); ctx.fillStyle = '#db2777'; ctx.fill();

  // Beschriftung
  ctx.fillStyle = '#1e293b'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Zeigerdiagramm', 10, 18);
  ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif';
  ctx.fillText('N = ' + N + (N > gezeichnet ? ' (gezeichnet: ' + gezeichnet + ')' : ''), 10, 33);
  ctx.fillText('δ = ' + _fpmNum(((delta * 180 / Math.PI) % 360 + 360) % 360, 1) + '°', 10, 47);
  ctx.fillStyle = '#db2777'; ctx.font = '700 11px sans-serif';
  ctx.fillText('Â/Â₀ = ' + _fpmNum(amp, 3), 10, 63);
  ctx.fillStyle = '#7c3aed'; ctx.font = '10px sans-serif';
  const lage = amp > 0.98 ? 'alle Zeiger parallel → Hauptmaximum'
             : amp < 0.02 ? 'Polygon geschlossen → Auslöschung'
             : 'teilweise Auslöschung';
  ctx.fillText(lage, 10, H - 10);
}

// ── Aufbau auf der optischen Bank ──────────────────────
function _gitRenderBank(ctx, cv) {
  if (!_git) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  const col = _DSP_LASER[_git.li].col;
  const yM = H / 2 + 4;
  const xL = 34, xG = 132, xSch = W - 46;

  ctx.fillStyle = '#cbd5e1'; ctx.fillRect(20, H - 30, W - 40, 8);
  [xL, xG, xSch].forEach(x => { ctx.fillStyle = '#94a3b8'; ctx.fillRect(x - 3, H - 30, 6, 12); });

  ctx.fillStyle = '#334155'; ctx.fillRect(xL - 30, yM - 11, 44, 22);
  ctx.fillStyle = col; ctx.fillRect(xL + 12, yM - 3, 5, 6);
  ctx.fillStyle = '#fff'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('LASER', xL - 8, yM + 3);

  ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.globalAlpha = 0.85;
  ctx.beginPath(); ctx.moveTo(xL + 17, yM); ctx.lineTo(xG - 2, yM); ctx.stroke();
  ctx.globalAlpha = 1;

  // Gitter als Strichraster
  ctx.fillStyle = '#1e293b'; ctx.fillRect(xG - 3, yM - 46, 6, 92);
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
  for (let y = -44; y <= 44; y += 4) {
    ctx.beginPath(); ctx.moveTo(xG - 3, yM + y); ctx.lineTo(xG + 3, yM + y); ctx.stroke();
  }

  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(xSch, 16, 10, H - 56);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.strokeRect(xSch + 0.5, 16.5, 10, H - 57);

  // Strahlen unter den echten Beugungswinkeln – hier stimmt die Geometrie
  const kmax = Math.min(_gitKmax(), 4);
  const skala = (H / 2 - 26) / Math.max(1, Math.abs(_gitXk(Math.min(kmax, 1)) || 1) * 1.1);
  for (let k = -kmax; k <= kmax; k++) {
    const xk = k === 0 ? 0 : _gitXk(Math.abs(k)) * Math.sign(k);
    if (!isFinite(xk)) continue;
    const q = Math.abs(k) * _gitLamMm() / _gitG();
    const winkel = Math.asin(Math.min(1, q)) * Math.sign(k || 1);
    const yT = yM - Math.tan(winkel) * (xSch - xG);
    const yEnd = Math.max(20, Math.min(H - 44, yT));
    ctx.strokeStyle = col;
    ctx.globalAlpha = k === 0 ? 0.85 : 0.55;
    ctx.lineWidth = k === 0 ? 2 : 1.4;
    ctx.beginPath(); ctx.moveTo(xG, yM); ctx.lineTo(xSch, yEnd); ctx.stroke();
    ctx.globalAlpha = 1;
    if (Math.abs(yT - yEnd) < 1) {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(xSch + 5, yEnd, 3, 5, 0, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = '#475569'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('k=' + k, xSch + 13, yEnd + 3);
    }
  }

  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(xG, yM); ctx.lineTo(xSch, yM); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#7c3aed'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('α', xG + 34, yM - 8);

  const yE = H - 42;
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(xG, yE); ctx.lineTo(xSch, yE); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xG, yE - 4); ctx.lineTo(xG, yE + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xSch, yE - 4); ctx.lineTo(xSch, yE + 4); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('e = ' + _fpmNum(_git.e, 2) + ' m', (xG + xSch) / 2, yE - 7);

  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('g = ' + _fpmNum(_gitG() * 1000, 3) + ' µm', xG - 20, 20);
  ctx.fillText('N = ' + _gitN() + ' beleuchtete Spalte', xG - 20, 32);
  ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
  ctx.fillText('Winkel maßstäblich, Längen schematisch', W - 8, H - 8);
  ctx.textAlign = 'left';
}

// ── Oberflaeche ────────────────────────────────────────
function _gitHTML() {
  const laser = _DSP_LASER.map((L, i) =>
    `<button class="dsp-laser${i === _git.li ? ' on' : ''}" id="gitL${i}" onclick="_gitSetLaser(${i})">
       <span class="dsp-laser-p" style="background:${L.col}"></span>
       <span class="dsp-laser-n">${L.n}</span>
     </button>`).join('');

  const gitter = _GIT_GITTER.map((G, i) =>
    `<button class="git-obj${i === _git.gi ? ' on' : ''}" id="gitG${i}" onclick="_gitSetGitter(${i})">${G.n}</button>`).join('');

  const views = _GIT_VIEWS.map(v =>
    `<option value="${v}"${v === _git.view ? ' selected' : ''}>± ${v} mm</option>`).join('');

  const presets = ['k → sin α', 'k → a(k)', 'k/g → sin α'].map((p, i) =>
    `<button class="fpm-tab${i === _git.preset ? ' on' : ''}" id="gitTab${i}" onclick="_gitSetPreset(${i})">${p}</button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim git-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">🌈 Optisches Gitter: das Schlüsselexperiment</h3>

    <canvas id="gitScreen" width="${_GIT_W}" height="236" class="dsp-screen"></canvas>
    <div class="dsp-screen-bar">
      <span class="dsp-hint">Tippe oder ziehe im Bild – die nähere Marke springt an die Stelle.</span>
      <label class="dsp-sel">Ausschnitt
        <select onchange="_gitSetView(this.value)">${views}</select>
      </label>
      <label class="fpm-check" style="margin:0"><input type="checkbox" checked onchange="_gitSet('profil',this.checked)">
        Intensitätsprofil</label>
    </div>

    <div class="fpm-grid" style="margin-top:10px">
      <div>
        <canvas id="gitBank" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="fpm-label">Beugungsobjekt einsetzen</div>
        <div class="git-objs">${gitter}</div>
        <div class="git-kurz" id="gitKurz"></div>
        <div class="fpm-label">Lichtquelle</div>
        <div class="dsp-lasers">${laser}</div>
        <div class="phys-ctrl" style="margin-top:8px">
          <span class="phys-ctrl-label">Schirmabstand e: <b id="gitELbl">1,00 m</b></span>
          <input type="range" id="gitE" min="0.2" max="3" step="0.05" value="1"
            oninput="_gitSetE(this.value)" style="width:100%;accent-color:#7c3aed">
        </div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Breite des Lichtbündels: <b id="gitSLbl">1,0 mm</b></span>
          <input type="range" id="gitS" min="0.2" max="3" step="0.1" value="1"
            oninput="_gitSetStrahl(this.value)" style="width:100%;accent-color:#7c3aed">
        </div>
        <label class="fpm-check"><input type="checkbox" checked onchange="_gitSet('einzel',this.checked)">
          Einhüllende der Einzelspaltbeugung berücksichtigen</label>
        <label class="fpm-check"><input type="checkbox" onchange="_gitSet('weiss',this.checked)">
          Glühlicht statt Laser (Weißlicht)</label>
        <label class="fpm-check"><input type="checkbox" onchange="_gitSet('reveal',this.checked)">
          Sollwerte anzeigen</label>
      </div>

      <div>
        <div class="fpm-label">Was soll bestimmt werden?</div>
        <div class="git-modus">
          <button class="git-mb on" id="gitMlam" onclick="_gitSetModus('lam')">λ aus bekanntem g</button>
          <button class="git-mb" id="gitMg" onclick="_gitSetModus('g')">g aus bekanntem λ</button>
        </div>
        <div class="fpm-label">Ausmessen – Marken auf die Ordnungen −k und +k</div>
        <div class="dsp-marks">
          <button class="dsp-mk" id="gitMk1" onclick="_gitSetAktiv(1)"><span class="dsp-mk-p" style="background:#fbbf24"></span>Marke 1</button>
          <button class="dsp-mk on" id="gitMk2" onclick="_gitSetAktiv(2)"><span class="dsp-mk-p" style="background:#f472b6"></span>Marke 2</button>
          <button class="sim-btn" onclick="_gitNudge(-1)" title="aktive Marke nach links">◀</button>
          <button class="sim-btn" onclick="_gitNudge(1)" title="aktive Marke nach rechts">▶</button>
        </div>
        <div class="dsp-nrow">
          <label class="phys-ctrl-label" for="gitK">Ordnung k:</label>
          <input type="number" id="gitK" class="dsp-num" min="1" max="20" step="1" value="1"
            oninput="_gitSetK(this.value)">
          <span class="fpm-note" id="gitKmax"></span>
        </div>
        <div class="git-warn" id="gitWarn" style="display:none"></div>
        <div class="git-readout">
          <div class="fpm-ro"><span class="fpm-ro-k">a = 2a/2</span><span class="fpm-ro-v" id="gitAk">—</span><span class="fpm-ro-u">mm</span></div>
          <div class="fpm-ro"><span class="fpm-ro-k">Winkel α</span><span class="fpm-ro-v" id="gitAl">—</span><span class="fpm-ro-u">Grad</span></div>
          <div class="fpm-ro"><span class="fpm-ro-k">sin α</span><span class="fpm-ro-v" id="gitSin">—</span><span class="fpm-ro-u">—</span></div>
          <div class="fpm-ro git-ergebnis"><span class="fpm-ro-k" id="gitErgK">λ = g·sin α / k</span><span class="fpm-ro-v" id="gitErg">—</span><span class="fpm-ro-u" id="gitErgU">nm</span></div>
        </div>
        <div id="gitSoll" class="dsp-soll"></div>
        <div class="sim-btn-row">
          <button class="sim-btn primary" id="gitTakeBtn" onclick="_gitTake()">✓ Messwert übernehmen</button>
          <button class="sim-btn" onclick="_gitFit()">🔍 Ausschnitt passend</button>
        </div>
        <div class="sim-btn-row">
          <button class="sim-btn" onclick="_gitAuto()">📏 Fotodiode: Ordnung k anfahren</button>
          <button class="sim-btn" onclick="_gitDemo()">📋 Beispielmessreihe</button>
          <button class="sim-btn" onclick="_gitClear()">🗑 Tabelle leeren</button>
        </div>
        <div class="fpm-tablewrap">
          <table class="sim-table">
            <thead><tr><th>Objekt</th><th>g (µm)</th><th>e (m)</th><th>k</th><th>a (mm)</th><th>sin α</th><th id="gitThErg">λ (nm)</th><th></th></tr></thead>
            <tbody id="gitTbody"></tbody>
          </table>
          <div class="fpm-empty" id="gitEmpty">Noch keine Messwerte.<br>Marken auf −k und +k setzen → k eintragen → übernehmen.</div>
        </div>
      </div>
    </div>

    <div class="git-zeig-grid">
      <canvas id="gitZeiger" width="360" height="230" class="git-zeiger"></canvas>
      <div class="git-schaerfe" id="gitSchaerfe"></div>
    </div>

    <div class="fpm-label" style="margin-top:12px">Auswertung – nur die Auftragung über sin α ergibt eine Gerade</div>
    <div class="fpm-tabs">${presets}</div>
    <div class="fpm-grid2">
      <canvas id="gitPlot" width="470" height="330" class="phys-chart-cv"></canvas>
      <div>
        <div class="fpm-fit" id="gitFitBox"></div>
        <div class="fpm-label" style="margin-top:10px">Funktion plotten</div>
        <input type="text" id="gitFn" class="fpm-input" placeholder="z. B. 0.19*x" spellcheck="false"
          oninput="_gitSetFn(this.value)">
        <div class="fpm-err" id="gitFnErr"></div>
        <div class="sim-btn-row" style="padding:2px 0 4px">
          <button class="sim-btn primary" onclick="_gitTheorieFn()">ƒ Theoriefunktion</button>
          <button class="sim-btn" onclick="_gitClearFn()">Feld leeren</button>
        </div>
        <div class="fpm-theo" id="gitTheo"></div>
        <div class="fpm-note">Erlaubt: x, pi, + − * / ^, sqrt(), sin(), cos(), abs(), exp(), ln(). Malpunkt immer schreiben.</div>
        <label class="fpm-check"><input type="checkbox" checked onchange="_gitSet('origin',this.checked)">
          Ausgleichsgerade durch den Ursprung</label>
      </div>
    </div>

    <div id="gitErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      Hauptmaxima: <b>sin α<sub>k</sub> = k · λ / g</b> &nbsp;|&nbsp; erstes Minimum danach bei <b>Δs = k·λ + λ/N</b>
      &nbsp;|&nbsp; <b>tan α = a / e</b> – hier ohne Kleinwinkelnäherung
    </p>
  </div>`;
}

function _gitErklHTML() {
  return `<div class="dsp-erkl-kopf">Vom Doppelspalt zum Gitter</div>
    <div class="dsp-erkl-text">
      Durch einen Doppelspalt geht wenig Licht, und seine Maxima sind breit und verwaschen – genau
      messen lässt sich damit schlecht. Ein Gitter behebt beides. Nach Huygens entsteht hinter jedem
      der N Spalte eine Elementarwelle. Weil der Spaltabstand g viel kleiner ist als der Schirmabstand e,
      laufen benachbarte Strahlen praktisch parallel zum Punkt P<sub>k</sub>. Ein Hauptmaximum entsteht,
      wenn der Gangunterschied benachbarter Strahlen Δs = g·sin α ein ganzzahliges Vielfaches von λ ist:
      <b>sin α<sub>k</sub> = k · λ/g</b>.
      Vergleiche selbst: Schalte von Doppelspalt auf Vierfachspalt und dann auf ein Gitter – die Maxima
      werden bei gleichem Abstand deutlich schärfer.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum werden die Maxima schärfer?</div>
    <div class="dsp-erkl-text">
      Weicht man ein wenig von der Maximumsrichtung ab, sodass der Gangunterschied k·λ + λ/N beträgt,
      dann löschen sich beim Gitter mit N Spalten der 1. und der (N/2+1)-te Strahl, der 2. und der
      (N/2+2)-te und so weiter paarweise aus – es ist bereits dunkel. Bei nur zwei Spalten bräuchte es
      dafür einen Gangunterschied von λ/2. Je größer N, desto dichter rückt das erste Minimum an das
      Hauptmaximum heran. Zwischen zwei Hauptmaxima liegen <b>N−1 Nullstellen</b> und
      <b>N−2 schwächere Nebenmaxima</b>, deren Intensität mit wachsendem N abnimmt.
      Das Zeigerdiagramm zeigt den Grund: Bei Auslöschung schließt sich das Vieleck aus den N Zeigern
      zu einem Kreis, im Hauptmaximum liegen alle Zeiger parallel.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Achtung: keine Kleinwinkelnäherung</div>
    <div class="dsp-erkl-text">
      Beim Doppelspalt waren die Winkel klein und man durfte sin α ≈ tan α setzen. Beim Gitter ist α oft
      20° und mehr – dann ist das falsch. Miss deshalb a und e, bilde tan α = a/e, bestimme daraus den
      Winkel α und erst dann sin α. Die Auftragung <i>k → a(k)</i> zeigt es unmittelbar: Sie ist
      <b>keine</b> Gerade. Erst <i>k → sin α</i> wird eine Ursprungsgerade.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Schülerversuch: Speicherdichte von CD und DVD</div>
    <div class="dsp-erkl-text">
      Eine CD ist ein Reflexionsgitter: Ihre Datenspuren liegen in gleichmäßigem Abstand. Wähle oben
      <b>CD</b> oder <b>DVD</b>, stelle auf „g aus bekanntem λ“ um und miss den Spurabstand. Aus ihm
      folgt die Speicherdichte – einer der wenigen Versuche der Oberstufe, den man mit einem
      Laserpointer und einem Lineal zu Hause nachbauen kann.
    </div>
    <div class="dsp-erkl-warn">⚠ Im echten Versuch: niemals in den Laserstrahl blicken, Warnschild aufstellen,
      Raum abdunkeln. Nur Laser der zugelassenen Leistungsklasse verwenden.</div>`;
}

// ── Bedienung ──────────────────────────────────────────
function _gitSet(key, val) {
  _git[key] = val;
  if (key === 'weiss') _gitRefreshTheorie();
  _gitUpdateRead(); _gitDrawPlot();
}
function _gitSetLaser(i) {
  _git.li = i;
  _DSP_LASER.forEach((L, k) => document.getElementById('gitL' + k)?.classList.toggle('on', k === i));
  _gitUpdateRead(); _gitRefreshTheorie();
}
function _gitSetGitter(i) {
  _git.gi = i;
  _GIT_GITTER.forEach((G, k) => document.getElementById('gitG' + k)?.classList.toggle('on', k === i));
  const kz = document.getElementById('gitKurz');
  if (kz) kz.textContent = _GIT_GITTER[i].kurz;
  _gitSetK(_git.k);            // Ordnung ggf. auf das Mogliche begrenzen
  _gitUpdateRead(); _gitRefreshTheorie();
}
function _gitSetE(v) {
  _git.e = +v;
  const el = document.getElementById('gitELbl'); if (el) el.textContent = _fpmNum(+v, 2) + ' m';
  _gitUpdateRead(); _gitRefreshTheorie();
}
function _gitSetStrahl(v) {
  _git.strahl = +v;
  const el = document.getElementById('gitSLbl'); if (el) el.textContent = _fpmNum(+v, 1) + ' mm';
  _gitUpdateRead();
}
function _gitSetView(v) { _git.view = +v; _gitUpdateRead(); }
function _gitSetAktiv(nr) {
  _git.aktiv = nr;
  document.getElementById('gitMk1')?.classList.toggle('on', nr === 1);
  document.getElementById('gitMk2')?.classList.toggle('on', nr === 2);
}
function _gitNudge(dir) {
  const schritt = _git.view / 200;
  const k = _git.aktiv === 1 ? 'm1' : 'm2';
  _git[k] = Math.max(-_git.view, Math.min(_git.view, _git[k] + dir * schritt));
  _gitUpdateRead();
}
// Der breiteste angebotene Ausschnitt entspricht einem 1,6 m breiten Schirm.
// Was weiter draussen liegt, kaeme im echten Versuch gar nicht auf den Schirm.
function _GIT_MAXVIEW() { return _GIT_VIEWS[_GIT_VIEWS.length - 1]; }
function _gitErreichbar(k) {
  const x = _gitXk(k);
  return isFinite(x) && Math.abs(x) <= _GIT_MAXVIEW();
}
function _gitSetK(v) {
  const kmax = Math.max(1, _gitKmax());
  _git.k = Math.max(1, Math.min(kmax, Math.round(+v || 1)));
  const el = document.getElementById('gitK'); if (el) el.value = String(_git.k);
  const hin = document.getElementById('gitKmax');
  if (hin) hin.textContent = 'rechnerisch möglich bis k = ' + kmax;
  _gitUpdateRead();
}
// Warnt, wenn die gewaehlte Ordnung neben dem Schirm laege – im echten
// Versuch merkt man das sofort, in einer Simulation muss man es sagen.
function _gitWarnung() {
  const el = document.getElementById('gitWarn'); if (!el) return;
  const x = _gitXk(_git.k);
  if (!isFinite(x)) {
    el.innerHTML = '<b>Die ' + _git.k + '. Ordnung gibt es nicht:</b> dafür müsste sin α größer als 1 werden.';
    el.style.display = 'block';
  } else if (Math.abs(x) > _GIT_MAXVIEW()) {
    el.innerHTML = '<b>Die ' + _git.k + '. Ordnung liegt bei ' + _fpmNum(Math.abs(x), 0) +
      ' mm</b> – weiter, als der Schirm reicht. Verringere den Schirmabstand e oder wähle eine kleinere Ordnung.';
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}
function _gitSetModus(m) {
  _git.modus = m;
  document.getElementById('gitMlam')?.classList.toggle('on', m === 'lam');
  document.getElementById('gitMg')?.classList.toggle('on', m === 'g');
  const kopf = document.getElementById('gitErgK'), einh = document.getElementById('gitErgU');
  if (kopf) kopf.textContent = m === 'lam' ? 'λ = g·sin α / k' : 'g = k·λ / sin α';
  if (einh) einh.textContent = m === 'lam' ? 'nm' : 'µm';
  const th = document.getElementById('gitThErg');
  if (th) th.innerHTML = m === 'lam' ? 'λ (nm)' : 'g (µm)';
  _gitUpdateRead(); _gitRenderTable(); _gitDrawPlot();
}
function _gitFit() {
  const x = _gitXk(Math.min(_git.k, _gitKmax()));
  const ziel = (isFinite(x) ? Math.abs(x) : 10) * 1.3;
  const v = _GIT_VIEWS.find(a => a >= ziel) || _GIT_VIEWS[_GIT_VIEWS.length - 1];
  _git.view = v;
  const sel = document.querySelector('.git-sim .dsp-screen-bar select');
  if (sel) sel.value = String(v);
  _git.m1 = Math.max(-v, Math.min(v, _git.m1));
  _git.m2 = Math.max(-v, Math.min(v, _git.m2));
  _gitUpdateRead();
}
function _gitSetPreset(i) {
  _git.preset = i;
  for (let k = 0; k < 3; k++) document.getElementById('gitTab' + k)?.classList.toggle('on', k === i);
  _gitRefreshTheorie();
  _gitDrawPlot();
}

function _gitUpdateRead() {
  if (!_git) return;
  const a = _gitAk(), sinA = _gitSinA();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('gitAk', _fpmNum(a, 1));
  set('gitAl', _fpmNum(_gitAlpha(), 2));
  set('gitSin', _fpmNum(sinA, 4));

  const lam = _gitLamAus(sinA, _gitG(), _git.k);
  const gMess = _gitGAus(sinA, _gitLam(), _git.k) * 1000;     // in µm
  set('gitErg', a > 0 ? (_git.modus === 'lam' ? _fpmNum(lam, 1) : _fpmNum(gMess, 3)) : '—');

  const kz = document.getElementById('gitKurz');
  if (kz) kz.textContent = _git.weiss ? 'Glühlicht – alle Wellenlängen von 400 nm bis 700 nm' : _gitDef().kurz;

  _gitSchaerfe();
  _gitWarnung();

  const soll = document.getElementById('gitSoll');
  if (soll) {
    if (_git.weiss) {
      soll.innerHTML = '<span class="fpm-note">Glühlicht enthält viele Wellenlängen gleichzeitig – ' +
        'jede wird unter einem anderen Winkel gebeugt, deshalb entsteht ein Spektrum. ' +
        'Für eine Messung einen Laser wählen.</span>';
    } else if (_git.reveal && a > 0) {
      const ist  = _git.modus === 'lam' ? lam : gMess;
      const wahr = _git.modus === 'lam' ? _gitLam() : _gitG() * 1000;
      const abw = Math.abs(ist - wahr) / wahr * 100;
      const cls = abw < 1 ? 'ok' : abw < 5 ? 'mid' : 'no';
      const eh = _git.modus === 'lam' ? ' nm' : ' µm';
      soll.innerHTML = `<span class="fpm-fitmeta">gemessen ${_fpmNum(ist, 3)}${eh} · Sollwert ${_fpmNum(wahr, 3)}${eh}</span>
        <span class="fpm-badge ${cls}">Abweichung ${_fpmNum(abw, 2)} %</span>`;
    } else soll.innerHTML = '';
  }
  const take = document.getElementById('gitTakeBtn');
  if (take) take.disabled = !(a > 0) || _git.weiss;
}

// Kennzahlen zur Schaerfe – der zentrale Punkt der Handreichung
function _gitSchaerfe() {
  const el = document.getElementById('gitSchaerfe');
  if (!el) return;
  const N = _gitN(), br = _gitBreite(_git.k);
  const G = _gitDef();
  el.innerHTML =
    `<div class="git-sch-kopf">Schärfe der Hauptmaxima</div>
     <div class="git-sch-zeile"><span>beleuchtete Spalte N</span><b>${N}</b></div>
     <div class="git-sch-zeile"><span>Nullstellen zwischen zwei Hauptmaxima</span><b>N − 1 = ${N - 1}</b></div>
     <div class="git-sch-zeile"><span>Nebenmaxima dazwischen</span><b>N − 2 = ${N - 2}</b></div>
     <div class="git-sch-zeile"><span>Halbe Breite des ${_git.k}. Maximums auf dem Schirm</span><b>${isFinite(br) ? _fpmNum(br, 3) + ' mm' : '—'}</b></div>
     <div class="git-sch-zeile"><span>Einhüllende: b / g</span><b>1 : ${_fpmNum(_gitG() / _gitB(), 0)}</b></div>
     <div class="git-sch-text">
       Die Beugung am einzelnen Spalt legt sich als Einhüllende über das Muster: Jede
       ${_fpmNum(_gitG() / _gitB(), 0)}. Ordnung fällt in eine ihrer Nullstellen und fehlt deshalb.
       Zum Vergleich lässt sie sich links abschalten.
     </div>
     <div class="git-sch-text">
       Das erste Minimum nach dem k-ten Hauptmaximum liegt bei Δs = k·λ + λ/N. Je größer N, desto näher
       rückt es heran und desto schärfer wird das Maximum. Verbreitere das Lichtbündel und beobachte,
       wie N und damit die Schärfe wachsen.
       ${G.fest ? '<br><b>Hinweis:</b> Beim ' + G.n + ' ist N fest auf ' + G.fest + ' – das Bündel ändert daran nichts.' : ''}
     </div>`;
}

// ── Messwerttabelle ────────────────────────────────────
function _gitAddRow(gi, g, e, k, a, sinA, lam) {
  _git.rows.push({ id: _git.nextId++, gi, g, e, k, a, sinA, lam });
  _gitRenderTable(); _gitDrawPlot();
}
function _gitTake() {
  const a = _gitAk();
  if (!(a > 0) || _git.weiss) return;
  _gitAddRow(_git.gi, _gitG(), _git.e, _git.k, a, _gitSinA(), _gitLam());
}
function _gitAuto() {
  if (_git.weiss) return;
  const x = _gitXk(_git.k);
  // Nicht heimlich einen falschen Wert aufnehmen, wenn die Ordnung
  // ausserhalb des Schirms liegt – die Marken wuerden sonst beschnitten.
  if (!_gitErreichbar(_git.k)) { _gitWarnung(); return; }
  const rausch = () => (Math.random() - 0.5) * 0.006;
  _gitFit();                                   // erst Ausschnitt, dann Marken setzen
  _git.m1 = -x * (1 + rausch());
  _git.m2 =  x * (1 + rausch());
  _gitUpdateRead();
  _gitAddRow(_git.gi, _gitG(), _git.e, _git.k, _gitAk(), _gitSinA(), _gitLam());
}
function _gitDelRow(id) {
  _git.rows = _git.rows.filter(r => r.id !== id);
  _gitRenderTable(); _gitDrawPlot();
}
function _gitClear() {
  if (_git.rows.length && !confirm('Alle ' + _git.rows.length + ' Messwerte löschen?')) return;
  _git.rows = []; _gitRenderTable(); _gitDrawPlot();
}
function _gitDemo() {
  const alt = { gi: _git.gi, e: _git.e, k: _git.k };
  const mess = (gi, e, k) => {
    _git.gi = gi; _git.e = e;
    if (k > _gitKmax() || !_gitErreichbar(k)) return;
    const x = _gitXk(k);
    if (!isFinite(x)) return;
    const a = Math.abs(x) * (1 + (Math.random() - 0.5) * 0.006);
    const sinA = a / Math.sqrt(a * a + e * e * 1e6);
    _git.rows.push({ id: _git.nextId++, gi, g: _gitG(), e, k, a, sinA, lam: _gitLam() });
  };
  // e = 0,50 m, damit alle Ordnungen tatsaechlich auf den Schirm passen
  [1, 2, 3, 4].forEach(k => mess(3, 0.5, k));        // 300/mm, Ordnungen durchmessen
  [1, 2].forEach(k => mess(4, 0.5, k));              // 500/mm
  mess(5, 0.5, 1);                                   // 1000/mm
  [1, 2, 3, 4, 5, 6].forEach(k => mess(2, 0.5, k));  // 100/mm
  _git.gi = alt.gi; _git.e = alt.e; _git.k = alt.k;
  _gitRenderTable(); _gitDrawPlot();
}
function _gitRenderTable() {
  const tb = document.getElementById('gitTbody'); if (!tb) return;
  const empty = document.getElementById('gitEmpty');
  if (empty) empty.style.display = _git.rows.length ? 'none' : 'block';
  tb.innerHTML = _git.rows.map(r => {
    const erg = _git.modus === 'lam'
      ? _fpmNum(_gitLamAus(r.sinA, r.g, r.k), 1)
      : _fpmNum(_gitGAus(r.sinA, r.lam, r.k) * 1000, 3);
    return `<tr>
       <td><span class="fpm-dot" style="background:${_DSP_LASER[0].col}"></span>${_GIT_GITTER[r.gi].n}</td>
       <td>${_fpmNum(r.g * 1000, 3)}</td><td>${_fpmNum(r.e, 2)}</td><td>${r.k}</td>
       <td>${_fpmNum(r.a, 1)}</td><td><b>${_fpmNum(r.sinA, 4)}</b></td>
       <td>${erg}</td>
       <td class="fpm-del" onclick="_gitDelRow(${r.id})" title="löschen">✕</td>
     </tr>`;
  }).join('');
}

// ── Auswertungsdiagramm ────────────────────────────────
const _GIT_PRESETS = [
  { xl: 'Ordnung k', yl: 'sin α',
    x: r => r.k, y: r => r.sinA,
    grp: r => r.gi + '|' + r.e,
    gl: r => _GIT_GITTER[r.gi].n + ', e = ' + _fpmNum(r.e, 2) + ' m',
    slope: r => r.lam * 1e-6 / r.g,
    lamAus: (k, r) => k * r.g * 1e6,
    gAus:   (k, r) => r.lam * 1e-6 / k * 1000,
    gerade: true,
    note: 'Ursprungsgerade ⇒ sin α ~ k. Die Steigung ist λ/g.',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'sin α(k) = (λ/g) · k',
    term: () => _dspZahl(_gitLamMm() / _gitG()) + '*x',
    param: () => 'Steigung λ/g = ' + _fpmNum(_gitLamMm() / _gitG(), 4),
    deutung: 'Genau die Interferenzbedingung sin α = k·λ/g. Aus der Steigung folgt λ = Steigung · g – oder umgekehrt g = λ / Steigung.' },

  { xl: 'Ordnung k', yl: 'a(k) in mm',
    x: r => r.k, y: r => r.a,
    grp: r => r.gi + '|' + r.e,
    gl: r => _GIT_GITTER[r.gi].n + ', e = ' + _fpmNum(r.e, 2) + ' m',
    slope: r => r.e * 1000 * r.lam * 1e-6 / r.g,
    gerade: false,
    note: 'Keine Gerade! Die Punkte biegen nach oben ab, weil a = e·tan α ist und tan α bei großen Winkeln schneller wächst als sin α.',
    typ: 'keine Gerade – Wurzelausdruck im Nenner',
    form: 'a(k) = e · tan α = e · (kλ/g) / √(1 − (kλ/g)²)',
    term: () => {
      const q = _gitLamMm() / _gitG(), E = _gitEmm();
      return _dspZahl(E) + '*' + _dspZahl(q) + '*x/sqrt(1-(' + _dspZahl(q) + '*x)^2)';
    },
    param: () => 'e = ' + _fpmNum(_gitEmm(), 0) + ' mm, λ/g = ' + _fpmNum(_gitLamMm() / _gitG(), 4),
    deutung: 'Beim Doppelspalt war diese Auftragung noch eine Gerade, weil die Winkel klein waren. Beim Gitter nicht mehr – wer hier eine Gerade hindurchlegt, misst λ systematisch falsch.' },

  { xl: 'k/g in 1/mm', yl: 'sin α',
    x: r => r.k / r.g, y: r => r.sinA,
    grp: () => 'alle',
    gl: () => 'alle Messwerte zusammen',
    slope: r => r.lam * 1e-6,
    lamAus: k => k * 1e6,
    gAus: null,
    gerade: true,
    note: 'Alle Gitter und alle Ordnungen in einem Diagramm. Die Steigung ist unmittelbar die Wellenlänge.',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'sin α(k/g) = λ · (k/g)',
    term: () => _dspZahl(_gitLamMm()) + '*x',
    param: () => 'Steigung λ = ' + _fpmNum(_gitLamMm(), 7) + ' mm = ' + _fpmNum(_gitLam(), 1) + ' nm',
    deutung: 'Fasst beide Abhängigkeiten zusammen: Ordnung und Gitterkonstante wirken nur als Quotient k/g. Die Steigung ist die gesuchte Wellenlänge selbst. Diese Auftragung setzt voraus, dass g bekannt ist.' }
];

function _gitDrawPlot() {
  const cv = document.getElementById('gitPlot');
  if (!cv || !_git) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _GIT_PRESETS[_git.preset];
  const padL = 62, padR = 14, padT = 14, padB = 42;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const pts = _git.rows.map(r => ({ x: P.x(r), y: P.y(r) })).filter(p => isFinite(p.x) && isFinite(p.y));
  let xmax = pts.length ? Math.max(...pts.map(p => p.x)) * 1.15 : 1;
  let ymax = pts.length ? Math.max(...pts.map(p => p.y)) * 1.15 : 1;
  if (_git.fn) for (let i = 0; i <= 20; i++) {
    let v; try { v = _git.fn(xmax * i / 20); } catch (err) { v = NaN; }
    if (isFinite(v) && v > ymax) ymax = v * 1.05;
  }
  if (!(xmax > 0) || !isFinite(xmax)) xmax = 1;
  if (!(ymax > 0) || !isFinite(ymax)) ymax = 1;

  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - v / ymax * (y0 - y1);

  const xt = _fpmTicks(xmax, 6), yt = _fpmTicks(ymax, 5);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 14);
  });
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 6, Y(v) + 3);
  });
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 30);
  ctx.save(); ctx.translate(13, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'right'; ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (!pts.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte aufgenommen', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('gitFitBox');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    return;
  }

  if (_git.fn) {
    ctx.strokeStyle = '#db2777'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let started = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _git.fn((px - x0) / (x1 - x0) * xmax); } catch (err) { yv = NaN; }
      if (!isFinite(yv)) { started = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { started = false; continue; }
      started ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), started = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  const map = new Map();
  _git.rows.forEach(r => {
    const k = P.grp(r);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  });
  const palette = ['#7c3aed', '#f97316', '#0284c7', '#16a34a', '#db2777', '#0f766e', '#b45309'];
  const info = [];

  [...map.keys()].sort().forEach((k, gi) => {
    const rows = map.get(k);
    const col = palette[gi % palette.length];
    const gp = rows.map(r => ({ x: P.x(r), y: P.y(r) })).filter(p => isFinite(p.x) && isFinite(p.y));

    let fit = null;
    if (gp.length >= 2 && P.gerade) {
      fit = _git.origin ? _fpmFitOrigin(gp) : _fpmFitLinear(gp);
      if (fit) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(0), Y(fit.b)); ctx.lineTo(X(xmax), Y(fit.k * xmax + fit.b)); ctx.stroke();
      }
    } else if (gp.length >= 2) {
      // Bei der gekruemmten Auftragung nur eine Hilfsgerade durch die
      // ersten beiden Punkte – sie macht die Abweichung sichtbar.
      const s = _fpmFitOrigin(gp.slice(0, 2));
      if (s) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(xmax), Y(s.k * xmax)); ctx.stroke();
        ctx.setLineDash([]);
      }
      fit = null;
    }
    gp.forEach(p => {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 4, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke();
    });
    info.push({ ref: rows[0], col, fit, n: gp.length });
  });

  _gitRenderFit(info, P);
}

function _gitRenderFit(groups, P) {
  const el = document.getElementById('gitFitBox');
  if (!el) return;
  if (!P.gerade) {
    el.innerHTML = '<div class="fpm-note"><b>Diese Auftragung ergibt bewusst keine Gerade.</b><br>' +
      'Die gestrichelte Linie geht durch die ersten beiden Punkte. Je höher die Ordnung, desto weiter ' +
      'liegen die Messpunkte darüber – genau das ist der Fehler, den die Kleinwinkelnäherung hier machen würde.' +
      '<br><br>' + P.note + '</div>';
    return;
  }
  let html = '';
  groups.forEach(g => {
    if (!g.fit) return;
    const eq = 'y = ' + _fpmNum(g.fit.k, g.fit.k < 1 ? 5 : 3) + '·x' +
      (_git.origin ? '' : (g.fit.b >= 0 ? ' + ' : ' − ') + _fpmNum(Math.abs(g.fit.b), 4));
    let erg = '', soll = 0, ist = 0, eh = '';
    if (_git.modus === 'lam' && P.lamAus) {
      ist = P.lamAus(g.fit.k, g.ref); soll = g.ref.lam; eh = ' nm';
      erg = 'λ = ' + _fpmNum(ist, 1) + ' nm';
    } else if (_git.modus === 'g' && P.gAus) {
      ist = P.gAus(g.fit.k, g.ref); soll = g.ref.g * 1000; eh = ' µm';
      erg = 'g = ' + _fpmNum(ist, 3) + ' µm';
      if (_GIT_GITTER[g.ref.gi].spur) erg += ' → ' + _fpmNum(1000 / ist, 0) + ' Spuren pro mm';
    } else {
      erg = _git.modus === 'g' ? 'für g wird eine andere Auftragung gebraucht' : '';
    }
    const abw = soll ? Math.abs(ist - soll) / soll * 100 : 0;
    const cls = abw < 1 ? 'ok' : abw < 5 ? 'mid' : 'no';
    html += `<div class="fpm-fitline">
       <span class="fpm-fitmeta"><span class="fpm-dot" style="background:${g.col}"></span>${P.gl(g.ref)} · ${g.n} Messwerte</span>
       <span class="fpm-fiteq">${eq}</span>
       <span class="fpm-fitmeta">R² = ${_fpmNum(g.fit.r2, 5)} · erwartete Steigung ${_fpmNum(P.slope(g.ref), 5)}</span>
       ${erg ? `<span class="fpm-fiteq" style="color:#5b21b6">${erg}</span>` : ''}
       ${_git.reveal && soll ? `<span class="fpm-badge ${cls}">Sollwert ${_fpmNum(soll, 3)}${eh} · Abweichung ${_fpmNum(abw, 2)} %</span>` : ''}
     </div>`;
  });
  if (!html) {
    el.innerHTML = '<div class="fpm-note">Mindestens zwei Messwerte je Messreihe nötig – dabei jeweils nur <i>eine</i> Größe verändern.<br>' + P.note + '</div>';
    return;
  }
  el.innerHTML = html + '<div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">' + P.note + '</div>';
}

// ── Theoriefunktion ────────────────────────────────────
function _gitTheorieFn() {
  const term = _GIT_PRESETS[_git.preset].term();
  const inp = document.getElementById('gitFn');
  if (inp) inp.value = term;
  _gitSetFn(term);
  _git.fnAuto = true;
  _gitRenderTheorie(true);
}
function _gitClearFn() {
  const inp = document.getElementById('gitFn');
  if (inp) inp.value = '';
  _gitSetFn('');
  _gitRenderTheorie(false);
}
function _gitRefreshTheorie() {
  if (_git.fnAuto) {
    const term = _GIT_PRESETS[_git.preset].term();
    const inp = document.getElementById('gitFn');
    if (inp) inp.value = term;
    _gitSetFn(term);
    _git.fnAuto = true;
  }
  _gitRenderTheorie(_git.fnAuto);
}
function _gitRenderTheorie(eingesetzt) {
  const el = document.getElementById('gitTheo');
  if (!el) return;
  const P = _GIT_PRESETS[_git.preset];
  el.innerHTML =
    `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
     <div class="fpm-theo-typ">${P.typ}</div>
     <div class="fpm-theo-form">${P.form}</div>
     <div class="fpm-theo-par">${P.param()}</div>
     ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${P.term()}</div>` : ''}
     <div class="fpm-theo-deutung">${P.deutung}</div>`;
}
function _gitSetFn(str) {
  _git.fnAuto = false;
  const err = document.getElementById('gitFnErr');
  const v = (str || '').trim();
  if (!v) { _git.fn = null; if (err) err.textContent = ''; _gitDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _git.fn = f; if (err) err.textContent = '';
  } catch (e) { _git.fn = null; if (err) err.textContent = e.message; }
  _gitDrawPlot();
}

// ── Marken per Finger oder Maus setzen ─────────────────
function _gitBind() {
  const cv = document.getElementById('gitScreen');
  if (!cv || !cv.addEventListener) return;
  const mmAus = ev => {
    const r = cv.getBoundingClientRect();
    return _gitPxToMm((ev.clientX - r.left) * (cv.width / r.width));
  };
  const setze = ev => {
    const mm = mmAus(ev);
    if (_git.aktiv === 1) _git.m1 = mm; else _git.m2 = mm;
    _gitUpdateRead();
  };
  cv.addEventListener('pointerdown', ev => {
    ev.preventDefault();
    const mm = mmAus(ev);
    _gitSetAktiv(Math.abs(mm - _git.m1) <= Math.abs(mm - _git.m2) ? 1 : 2);
    _git.drag = true;
    if (cv.setPointerCapture) cv.setPointerCapture(ev.pointerId);
    setze(ev);
  });
  cv.addEventListener('pointermove', ev => { if (_git.drag) { ev.preventDefault(); setze(ev); } });
  cv.addEventListener('pointerup',     () => { _git.drag = false; });
  cv.addEventListener('pointercancel', () => { _git.drag = false; });
  cv.addEventListener('pointerleave',  () => { _git.drag = false; });
}

// ── Zusaetzliche Styles ────────────────────────────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .git-objs { display: flex; gap: 5px; flex-wrap: wrap; }
    .git-obj { flex: 1 1 62px; padding: 6px 5px; background: #f8fafc; border: 2px solid #e2e8f0;
      border-radius: 9px; cursor: pointer; font-size: .74rem; font-weight: 800; color: #1e293b; }
    .git-obj:hover { border-color: #cbd5e1; }
    .git-obj.on { border-color: #7c3aed; background: #f5f3ff; color: #5b21b6; }
    .git-kurz { font-size: .73rem; color: #64748b; margin-top: 5px; min-height: 15px; }
    .git-modus { display: flex; gap: 6px; flex-wrap: wrap; }
    .git-mb { flex: 1 1 130px; padding: 7px 10px; background: #f8fafc; border: 2px solid #e2e8f0;
      border-radius: 9px; cursor: pointer; font-size: .77rem; font-weight: 700; color: #475569; }
    .git-mb:hover { border-color: #cbd5e1; }
    .git-mb.on { border-color: #7c3aed; background: #f5f3ff; color: #5b21b6; }
    .git-readout { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top: 4px; }
    .git-ergebnis { border-color: #ddd6fe; background: #f5f3ff; }
    .git-zeig-grid { display: grid; grid-template-columns: 360px minmax(0,1fr); gap: 14px;
      align-items: start; margin-top: 12px; }
    @media (max-width: 780px) { .git-zeig-grid { grid-template-columns: 1fr; } }
    .git-zeiger { width: 100%; display: block; border-radius: 10px; background: #f8fafc;
      border: 1px solid #e2e8f0; }
    .git-schaerfe { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 10px 12px; }
    .git-sch-kopf { font-size: .74rem; font-weight: 800; color: #64748b; text-transform: uppercase;
      letter-spacing: .06em; margin-bottom: 6px; }
    .git-sch-zeile { display: flex; justify-content: space-between; gap: 10px; font-size: .77rem;
      color: #475569; padding: 3px 0; border-bottom: 1px solid #eef2f7; }
    .git-sch-zeile b { color: #1e293b; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .git-sch-text { font-size: .73rem; color: #64748b; line-height: 1.5; margin-top: 7px; }
    .git-warn { font-size: .73rem; color: #b45309; background: #fffbeb; border: 1px solid #fde68a;
      border-radius: 7px; padding: 6px 9px; margin: 6px 0; line-height: 1.45; }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════
// PHOTOEFFEKT – Schluesselexperiment 04 des KLP
// Grundlage: Handreichung "Versuch 4: Photoeffekt" (NRW)
//
// Drei Stationen entlang des Unterrichtsgangs der Handreichung:
//   1. Hallwachsversuch – der kognitive Konflikt
//   2. Abschaetzung der Ausloesezeit nach dem Wellenmodell
//   3. Vakuumphotozelle – Einsteingerade, h und W_A messen
//
//   E_Photon = h·f = h·c/λ        W_kin(max) = h·f − W_A        W_kin = e·U_g
//
// Nichts davon ist mit Wenn-Dann-Regeln nachgebaut: Der Hallwachsversuch
// rechnet das Linienspektrum der Hg-Lampe gegen die Austrittsarbeit des
// Plattenmaterials. Dass die Glasplatte den Strom abschaltet, folgt daraus,
// dass Zink erst unterhalb von 286 nm ausloest und Glas die 254-nm-Linie
// zurueckhaelt – nicht daraus, dass es so einprogrammiert waere.
// ═══════════════════════════════════════════════════════

const _PHO_H = 6.626e-34;      // Planck'sches Wirkungsquantum in J·s
const _PHO_E = 1.602e-19;      // Elementarladung in C
const _PHO_C = 2.998e8;        // Lichtgeschwindigkeit in m/s

// Linienspektrum einer Quecksilberhochdruckdampflampe (relative Anteile)
const _PHO_HG = [
  { lam: 254, p: 0.30, art: 'UV-C' },
  { lam: 313, p: 0.12, art: 'UV-B' },
  { lam: 365, p: 0.20, art: 'UV-A' },
  { lam: 405, p: 0.10, art: 'violett' },
  { lam: 436, p: 0.12, art: 'blau' },
  { lam: 546, p: 0.10, art: 'grün' },
  { lam: 578, p: 0.06, art: 'gelb' }
];

const _PHO_FILTER = [
  { n: 'ohne Filter', durch: () => true,        kurz: 'volles Spektrum der Hg-Lampe, sichtbar und unsichtbar' },
  { n: 'Glasplatte',  durch: l => l >= 330,     kurz: 'Glas ist für UV unterhalb 330 nm undurchlässig' },
  { n: 'UV-Filter',   durch: l => l <= 400,     kurz: 'lässt nur UV durch und blockt das sichtbare Licht' },
  { n: 'Rotfilter',   durch: l => l >= 570,     kurz: 'lässt nur langwelliges Licht durch' }
];

// Austrittsarbeiten in eV
const _PHO_MAT = [
  { n: 'Photozelle (K-Schicht)', WA: 2.00, col: '#7c3aed' },
  { n: 'Cäsium',                 WA: 2.14, col: '#f97316' },
  { n: 'Kalium',                 WA: 2.30, col: '#0284c7' },
  { n: 'Natrium',                WA: 2.36, col: '#16a34a' },
  { n: 'Zink',                   WA: 4.34, col: '#db2777' },
  { n: 'Platin',                 WA: 5.65, col: '#0f766e' }
];

// Monochromatische Buendel fuer die Photozelle. Die fuenf mittleren sind
// genau die Interferenzfilter aus der Messtabelle der Handreichung.
const _PHO_LICHT = [
  { n: 'UV 365',   lam: 365, col: '#8b5cf6' },
  { n: 'violett',  lam: 405, col: '#7c3aed' },
  { n: 'blau',     lam: 472, col: '#3b82f6' },
  { n: 'türkis',   lam: 505, col: '#06b6d4' },
  { n: 'grün',     lam: 525, col: '#22c55e' },
  { n: 'gelb',     lam: 588, col: '#eab308' },
  { n: 'orange',   lam: 611, col: '#f97316' },
  { n: 'rot',      lam: 700, col: '#ef4444' }
];

let _pho = null;

function _phoInit() {
  _pho = {
    station: 0, t: 0, teilchen: [],
    // Station 1 – Hallwachs
    hwMat: 4, hwLampe: true, hwInt: 100, hwFilter: 0, hwPol: 'neg',
    gesehen: { mitUV: false, mitGlas: false, umgepolt: false, schwach: false },
    prot: [], protId: 1,
    // Station 2 – Wellenmodell
    wmP: 20, wmRefl: 80, wmR: 1.0, wmD: 1.0,
    // Station 3 – Photozelle
    li: 4, mi: 0, int: 60, U: 0,
    rows: [], nextId: 1,
    preset: 0, fn: null, fnAuto: false, origin: false, reveal: false
  };
}

// ── Physik ─────────────────────────────────────────────
function _phoF(lam)       { return _PHO_C / (lam * 1e-9); }              // Hz
function _phoEPhoton(lam) { return _PHO_H * _phoF(lam); }                // J
function _phoLamGrenz(WA) { return _PHO_H * _PHO_C / (WA * _PHO_E) * 1e9; }   // nm
function _phoFGrenz(WA)   { return WA * _PHO_E / _PHO_H; }              // Hz
// W_kin(max) = h·f − W_A, negativ bedeutet: kein Elektron tritt aus
function _phoWkin(lam, WA) { return _phoEPhoton(lam) - WA * _PHO_E; }
function _phoUg(lam, WA)   { return _phoWkin(lam, WA) / _PHO_E; }

// ── Station 1: Hallwachsversuch ────────────────────────
function _phoFilterDurch(lam) { return _PHO_FILTER[_pho.hwFilter].durch(lam); }

// Photostrom aus dem Linienspektrum: es zaehlt nur, was den Filter passiert
// UND energiereich genug ist, die Austrittsarbeit zu ueberwinden.
function _phoHWLinien() {
  const WA = _PHO_MAT[_pho.hwMat].WA;
  return _PHO_HG.map(L => ({
    lam: L.lam, p: L.p, art: L.art,
    durch: _phoFilterDurch(L.lam),
    loest: _phoEPhoton(L.lam) > WA * _PHO_E
  }));
}
function _phoHWStrom() {
  if (!_pho.hwLampe) return 0;
  // Positiv geladene Platte: ausgeloeste Elektronen werden zurueckgezogen
  if (_pho.hwPol === 'pos') return 0;
  let p = 0;
  _phoHWLinien().forEach(L => { if (L.durch && L.loest) p += L.p; });
  return p * (_pho.hwInt / 100) * 400;      // in pA
}
function _phoHWMerken() {
  const I = _phoHWStrom(), g = _pho.gesehen;
  if (I > 0) {
    g.mitUV = true;
    if (_pho.hwInt <= 20) g.schwach = true;
  }
  if (_pho.hwLampe && _pho.hwPol === 'neg' && _pho.hwFilter === 1 && I === 0) g.mitGlas = true;
  if (_pho.hwLampe && _pho.hwPol === 'pos') g.umgepolt = true;
}

// ── Station 2: Abschaetzung nach dem Wellenmodell ──────
// Genau die Annahmen der Handreichung, Seite 7.
function _phoWM() {
  const P = _pho.wmP;                       // abgestrahlte UV-Leistung in W
  const d = _pho.wmD;                       // Abstand in m
  const r = _pho.wmR * 1e-10;               // Atomradius in m
  const WA = _PHO_MAT[_pho.hwMat].WA * _PHO_E;
  const I = P / (4 * Math.PI * d * d);      // Bestrahlungsstärke in W/m²
  const Inr = I * (1 - _pho.wmRefl / 100);  // nicht reflektierter Anteil
  const A = Math.PI * r * r;                // Querschnitt eines Atoms
  const Pat = Inr * A;                      // Leistung auf ein Atom
  return { I, Inr, A, Pat, WA, t: Pat > 0 ? WA / Pat : Infinity };
}

// ── Station 3: Vakuumphotozelle ────────────────────────
function _phoZelleUg() { return _phoUg(_PHO_LICHT[_pho.li].lam, _PHO_MAT[_pho.mi].WA); }
// Kennlinie: Bei Gegenspannung U erreichen nur noch die Elektronen die
// Ringelektrode, deren kinetische Energie groesser als e·U ist.
function _phoZelleI(U) {
  const Ug = _phoZelleUg();
  if (Ug <= 0) return 0;                    // unterhalb der Grenzfrequenz
  const Isat = _pho.int / 100 * 12;         // Saettigungsstrom in nA
  if (U <= 0) return Isat;
  if (U >= Ug) return 0;
  return Isat * Math.pow(1 - U / Ug, 2);
}
function _phoAnzeige(I) { return I < 0.005 ? 0 : I; }   // Auflösung des Messgeräts

// ── Formatierung ───────────────────────────────────────
const _PHO_HOCH = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function _phoExp(v, d) {
  if (!isFinite(v)) return '∞';
  if (v === 0) return '0';
  const ex = Math.floor(Math.log10(Math.abs(v)));
  const m = v / Math.pow(10, ex);
  const hoch = String(ex).split('').map(c => _PHO_HOCH[c] || c).join('');
  return _fpmNum(m, d) + ' · 10' + hoch;
}
function _phoZeit(t) {
  if (!isFinite(t)) return 'nie';
  if (t < 1) return _fpmNum(t, 2) + ' s';
  if (t < 90) return _fpmNum(t, 1) + ' s';
  return _fpmNum(t / 60, 1) + ' min';
}

// ── Oberflaeche ────────────────────────────────────────
function _phoHTML() {
  const stationen = ['1 · Hallwachsversuch', '2 · Widerspruch zum Wellenmodell', '3 · Vakuumphotozelle']
    .map((s, i) => `<button class="fpm-tab${i === _pho.station ? ' on' : ''}" id="phoSt${i}" onclick="_phoSetStation(${i})">${s}</button>`).join('');

  const matBtn = (prefix, aktiv, fn) => _PHO_MAT.map((M, i) =>
    `<button class="pho-mat${i === aktiv ? ' on' : ''}" id="${prefix}${i}" onclick="${fn}(${i})">
       <span class="pho-mat-n">${M.n}</span><span class="pho-mat-w">${_fpmNum(M.WA, 2)} eV</span>
     </button>`).join('');

  const filter = _PHO_FILTER.map((F, i) =>
    `<button class="pho-fil${i === _pho.hwFilter ? ' on' : ''}" id="phoF${i}" onclick="_phoSetFilter(${i})">${F.n}</button>`).join('');

  const licht = _PHO_LICHT.map((L, i) =>
    `<button class="pho-licht${i === _pho.li ? ' on' : ''}" id="phoL${i}" onclick="_phoSetLicht(${i})">
       <span class="pho-licht-p" style="background:${L.col}"></span>
       <span class="pho-licht-n">${L.n}</span><span class="pho-licht-l">${L.lam} nm</span>
     </button>`).join('');

  const presets = ['f → W_kin (Einsteingerade)', 'f → U_g', '1/λ → U_g'].map((p, i) =>
    `<button class="fpm-tab${i === _pho.preset ? ' on' : ''}" id="phoTab${i}" onclick="_phoSetPreset(${i})">${p}</button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim pho-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">💡 Photoeffekt: das Schlüsselexperiment</h3>
    <canvas id="phoTakt" width="1" height="1" style="display:none"></canvas>
    <div class="fpm-tabs">${stationen}</div>

    <!-- ══ Station 1 ══ -->
    <div id="phoS0">
      <div class="fpm-grid">
        <div>
          <canvas id="phoHW" width="420" height="270" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Platte aus</div>
          <div class="pho-mats">${matBtn('phoM', _pho.hwMat, '_phoSetHwMat')}</div>
          <div class="pho-grenz" id="phoGrenz"></div>
        </div>
        <div>
          <div class="fpm-label">Versuchsvariationen</div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="phoLampeBtn" onclick="_phoToggleLampe()">Lampe ausschalten</button>
            <button class="sim-btn" id="phoPolBtn" onclick="_phoTogglePol()">Polung tauschen</button>
          </div>
          <div class="pho-fils">${filter}</div>
          <div class="pho-filkurz" id="phoFilKurz"></div>
          <div class="phys-ctrl" style="margin-top:8px">
            <span class="phys-ctrl-label">Intensität der Lampe: <b id="phoIntLbl">100 %</b></span>
            <input type="range" id="phoInt" min="2" max="100" step="1" value="100"
              oninput="_phoSetInt(this.value)" style="width:100%;accent-color:#7c3aed">
          </div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Photostrom</span><span class="fpm-ro-v" id="phoIA">—</span><span class="fpm-ro-u">pA</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Ladung der Platte</span><span class="fpm-ro-v" id="phoPolA" style="font-size:.95rem">negativ</span><span class="fpm-ro-u">gegenüber der Elektrode</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Zeit bis zum Strom</span><span class="fpm-ro-v" id="phoSofort" style="font-size:.95rem">—</span><span class="fpm-ro-u">nach Beginn</span></div>
          </div>
          <div class="fpm-label">Spektrum der Hg-Lampe</div>
          <div class="pho-spektrum" id="phoSpek"></div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_phoProt()">📝 Beobachtung notieren</button>
            <button class="sim-btn" onclick="_phoProtClear()">🗑 Protokoll leeren</button>
          </div>
          <div class="pho-protwrap">
            <table class="sim-table">
              <thead><tr><th>Platte</th><th>Filter</th><th>Polung</th><th>Int.</th><th>Strom</th><th></th></tr></thead>
              <tbody id="phoProtBody"></tbody>
            </table>
            <div class="fpm-empty" id="phoProtEmpty">Noch nichts notiert.</div>
          </div>
        </div>
      </div>
      <div class="pho-befunde" id="phoBefunde"></div>
    </div>

    <!-- ══ Station 2 ══ -->
    <div id="phoS1" style="display:none">
      <div class="fpm-grid">
        <div>
          <div class="dsp-erkl" style="margin-top:0">
            <div class="dsp-erkl-kopf">Die Frage</div>
            <div class="dsp-erkl-text">
              Nach dem Wellenmodell verteilt sich die Energie des Lichts gleichmäßig über die
              Wellenfront. Ein einzelnes Elektron müsste also erst nach und nach genug Energie
              aufsammeln, um die Austrittsarbeit zu überwinden. <b>Wie lange dauert das?</b>
              Rechne es mit den Annahmen der Handreichung selbst nach.
            </div>
          </div>
          <div class="fpm-label">Annahmen</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">abgestrahlte UV-Leistung P: <b id="phoWmPLbl">20 W</b></span>
            <input type="range" id="phoWmP" min="1" max="60" step="1" value="20"
              oninput="_phoSetWm('wmP',this.value)" style="width:100%;accent-color:#7c3aed">
          </div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">reflektierter Anteil: <b id="phoWmRLbl">80 %</b></span>
            <input type="range" id="phoWmR" min="0" max="99" step="1" value="80"
              oninput="_phoSetWm('wmRefl',this.value)" style="width:100%;accent-color:#7c3aed">
          </div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Abstand Lampe – Platte d: <b id="phoWmDLbl">1,00 m</b></span>
            <input type="range" id="phoWmD" min="0.1" max="3" step="0.05" value="1"
              oninput="_phoSetWm('wmD',this.value)" style="width:100%;accent-color:#7c3aed">
          </div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Atomradius r: <b id="phoWmRadLbl">1,0 · 10⁻¹⁰ m</b></span>
            <input type="range" id="phoWmRad" min="0.5" max="3" step="0.1" value="1"
              oninput="_phoSetWm('wmR',this.value)" style="width:100%;accent-color:#7c3aed">
          </div>
          <div class="fpm-note" style="margin-top:8px">Die Austrittsarbeit stammt aus dem Plattenmaterial,
            das in Station 1 gewählt ist.</div>
        </div>
        <div>
          <div class="fpm-label">Rechnung Schritt für Schritt</div>
          <div class="pho-rechnung" id="phoRechnung"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 3 ══ -->
    <div id="phoS2" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="phoZelle" width="420" height="250" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Monochromatisches Lichtbündel</div>
          <div class="pho-lichter">${licht}</div>
          <div class="fpm-label">Photokathode</div>
          <div class="pho-mats">${matBtn('phoZM', _pho.mi, '_phoSetZMat')}</div>
          <div class="phys-ctrl" style="margin-top:8px">
            <span class="phys-ctrl-label">Intensität: <b id="phoZIntLbl">60 %</b></span>
            <input type="range" id="phoZInt" min="5" max="100" step="1" value="60"
              oninput="_phoSetZInt(this.value)" style="width:100%;accent-color:#7c3aed">
          </div>
        </div>
        <div>
          <div class="fpm-label">Gegenspannung regeln, bis der Strom gerade verschwindet</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Gegenspannung U: <b id="phoULbl">0,00 V</b></span>
            <input type="range" id="phoU" min="-0.5" max="2.5" step="0.01" value="0"
              oninput="_phoSetU(this.value)" style="width:100%;accent-color:#7c3aed">
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_phoUStep(-0.01)">◀ 0,01 V</button>
            <button class="sim-btn" onclick="_phoUStep(0.01)">0,01 V ▶</button>
            <button class="sim-btn" onclick="_phoSetU(0)">U = 0</button>
          </div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Photostrom</span><span class="fpm-ro-v" id="phoZI">—</span><span class="fpm-ro-u">nA</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Frequenz f</span><span class="fpm-ro-v" id="phoZF">—</span><span class="fpm-ro-u">10¹⁴ Hz</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">W = e·U</span><span class="fpm-ro-v" id="phoZW">—</span><span class="fpm-ro-u">10⁻²⁰ J</span></div>
          </div>
          <canvas id="phoKennlinie" width="420" height="180" class="phys-chart-cv" style="margin-top:8px"></canvas>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="phoTakeBtn" onclick="_phoTake()">✓ U als Gegenspannung übernehmen</button>
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_phoKond()">⚡ Kondensatormethode</button>
            <button class="sim-btn" onclick="_phoDemo()">📋 Beispielmessreihe</button>
            <button class="sim-btn" onclick="_phoClear()">🗑 Tabelle leeren</button>
          </div>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>Kathode</th><th>Farbe</th><th>λ (nm)</th><th>f (10¹⁴ Hz)</th><th>U_g (V)</th><th>W (10⁻²⁰ J)</th><th></th></tr></thead>
              <tbody id="phoTbody"></tbody>
            </table>
            <div class="fpm-empty" id="phoEmpty">Noch keine Messwerte.<br>Gegenspannung erhöhen, bis der Strom null ist → übernehmen.</div>
          </div>
        </div>
      </div>

      <div class="fpm-label" style="margin-top:12px">Auswertung – die Einsteingerade</div>
      <div class="fpm-tabs">${presets}</div>
      <div class="fpm-grid2">
        <canvas id="phoPlot" width="470" height="330" class="phys-chart-cv"></canvas>
        <div>
          <div class="fpm-fit" id="phoFitBox"></div>
          <div class="fpm-label" style="margin-top:10px">Funktion plotten</div>
          <input type="text" id="phoFn" class="fpm-input" placeholder="z. B. 6.626*x-32.04" spellcheck="false"
            oninput="_phoSetFn(this.value)">
          <div class="fpm-err" id="phoFnErr"></div>
          <div class="sim-btn-row" style="padding:2px 0 4px">
            <button class="sim-btn primary" onclick="_phoTheorieFn()">ƒ Theoriefunktion</button>
            <button class="sim-btn" onclick="_phoClearFn()">Feld leeren</button>
          </div>
          <div class="fpm-theo" id="phoTheo"></div>
          <label class="fpm-check"><input type="checkbox" onchange="_phoSet('origin',this.checked)">
            Ausgleichsgerade durch den Ursprung zwingen (hier bewusst falsch)</label>
          <label class="fpm-check"><input type="checkbox" onchange="_phoSet('reveal',this.checked)">
            Sollwerte anzeigen</label>
        </div>
      </div>
    </div>

    <div id="phoErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>E = h · f</b> &nbsp;|&nbsp; <b>W<sub>kin</sub>(max) = h · f − W<sub>A</sub></b>
      &nbsp;|&nbsp; <b>W<sub>kin</sub>(max) = e · U<sub>g</sub></b>
    </p>
  </div>`;
}

function _phoErklHTML() {
  return `<div class="dsp-erkl-kopf">Der Widerspruch und seine Auflösung</div>
    <div class="dsp-erkl-text">
      Der Hallwachsversuch liefert drei Befunde, die dem Wellenmodell widersprechen:
      Es treten <b>nur Elektronen</b> aus, es wirkt <b>nur kurzwelliges Licht</b> – sichtbares Licht
      versagt selbst bei größter Intensität – und die Elektronen kommen <b>sofort</b>, auch bei
      winziger Intensität. Nach dem Wellenmodell müsste man dagegen mit heller Beleuchtung immer
      zum Ziel kommen, nur eben langsamer. Station 2 zeigt, wie langsam: über eine Minute.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Einsteins Lichtquantenhypothese (1905, Nobelpreis 1921)</div>
    <div class="dsp-erkl-text">
      Licht besteht aus Photonen, jedes trägt die Energie <b>E = h·f</b>. Ein Photon gibt seine Energie
      <b>vollständig an ein einziges Elektron</b> ab und verschwindet dabei. Ein Teil dieser Energie wird
      als Austrittsarbeit W<sub>A</sub> gebraucht, der Rest bleibt als kinetische Energie:
      <b>W<sub>kin</sub> ≤ h·f − W<sub>A</sub></b>.
      Damit erklärt sich alles auf einen Schlag. Mehr Intensität heißt <i>mehr</i> Photonen, nicht
      <i>energiereichere</i> – also fließt mehr Strom, aber die Elektronen werden nicht schneller.
      Und unterhalb der Grenzfrequenz reicht die Energie eines einzelnen Photons nicht aus, egal wie
      viele davon ankommen.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum die Gegenspannung die Energie misst</div>
    <div class="dsp-erkl-text">
      Die austretenden Elektronen fliegen gegen ein elektrisches Feld an. Ein Elektron, das die
      Gegenspannung U durchläuft, verliert die Energie e·U. Erhöht man U so weit, dass selbst die
      schnellsten Elektronen die Ringelektrode nicht mehr erreichen und der Strom gerade auf null geht,
      dann gilt <b>W<sub>kin</sub>(max) = e·U<sub>g</sub></b>. Trägt man W<sub>kin</sub> gegen f auf,
      ergibt sich eine Gerade: Ihre <b>Steigung ist h</b>, ihr <b>Achsenabschnitt −W<sub>A</sub></b>
      und ihre Nullstelle die Grenzfrequenz. Wechsle das Kathodenmaterial – die Geraden verschieben
      sich, bleiben aber <b>parallel</b>. h ist eine Naturkonstante, W<sub>A</sub> eine Materialeigenschaft.
    </div>
    <div class="dsp-erkl-warn">⚠ Im echten Versuch: Hochspannung und UV-Strahlung. Warnschilder aufstellen,
      nicht in die Hg-Lampe blicken, Bestimmungen der RiSU einhalten.</div>`;
}

// ── Bedienung: Stationen ───────────────────────────────
function _phoSetStation(i) {
  _pho.station = i;
  for (let k = 0; k < 3; k++) {
    document.getElementById('phoSt' + k)?.classList.toggle('on', k === i);
    const d = document.getElementById('phoS' + k);
    if (d) d.style.display = k === i ? 'block' : 'none';
  }
  _phoUpdate();
}
function _phoSet(key, val) { _pho[key] = val; _phoDrawPlot(); }

// ── Bedienung: Station 1 ───────────────────────────────
function _phoSetHwMat(i) {
  _pho.hwMat = i;
  _PHO_MAT.forEach((M, k) => document.getElementById('phoM' + k)?.classList.toggle('on', k === i));
  _phoUpdate();
}
function _phoSetFilter(i) {
  _pho.hwFilter = i;
  _PHO_FILTER.forEach((F, k) => document.getElementById('phoF' + k)?.classList.toggle('on', k === i));
  const el = document.getElementById('phoFilKurz'); if (el) el.textContent = _PHO_FILTER[i].kurz;
  _phoUpdate();
}
function _phoSetInt(v) {
  _pho.hwInt = +v;
  const el = document.getElementById('phoIntLbl'); if (el) el.textContent = Math.round(+v) + ' %';
  _phoUpdate();
}
function _phoToggleLampe() {
  _pho.hwLampe = !_pho.hwLampe;
  const b = document.getElementById('phoLampeBtn');
  if (b) { b.textContent = _pho.hwLampe ? 'Lampe ausschalten' : 'Lampe einschalten'; b.classList.toggle('primary', _pho.hwLampe); }
  _phoUpdate();
}
function _phoTogglePol() {
  _pho.hwPol = _pho.hwPol === 'neg' ? 'pos' : 'neg';
  _phoUpdate();
}
function _phoProt() {
  const I = _phoHWStrom();
  _pho.prot.push({
    id: _pho.protId++, mat: _PHO_MAT[_pho.hwMat].n, fil: _PHO_FILTER[_pho.hwFilter].n,
    pol: _pho.hwLampe ? (_pho.hwPol === 'neg' ? 'negativ' : 'positiv') : 'Lampe aus',
    int: _pho.hwLampe ? _pho.hwInt + ' %' : '—', I
  });
  _phoRenderProt();
}
function _phoProtDel(id) { _pho.prot = _pho.prot.filter(p => p.id !== id); _phoRenderProt(); }
function _phoProtClear() {
  if (_pho.prot.length && !confirm('Protokoll mit ' + _pho.prot.length + ' Einträgen löschen?')) return;
  _pho.prot = []; _phoRenderProt();
}
function _phoRenderProt() {
  const tb = document.getElementById('phoProtBody'); if (!tb) return;
  const empty = document.getElementById('phoProtEmpty');
  if (empty) empty.style.display = _pho.prot.length ? 'none' : 'block';
  tb.innerHTML = _pho.prot.map(p =>
    `<tr>
       <td>${p.mat}</td><td>${p.fil}</td><td>${p.pol}</td><td>${p.int}</td>
       <td><b style="color:${p.I > 0 ? '#16a34a' : '#dc2626'}">${p.I > 0 ? _fpmNum(p.I, 1) + ' pA' : 'kein Strom'}</b></td>
       <td class="fpm-del" onclick="_phoProtDel(${p.id})" title="löschen">✕</td>
     </tr>`).join('');
}

// ── Bedienung: Station 2 ───────────────────────────────
function _phoSetWm(key, v) {
  _pho[key] = +v;
  const lbl = { wmP: ['phoWmPLbl', v => Math.round(v) + ' W'],
                wmRefl: ['phoWmRLbl', v => Math.round(v) + ' %'],
                wmD: ['phoWmDLbl', v => _fpmNum(+v, 2) + ' m'],
                wmR: ['phoWmRadLbl', v => _fpmNum(+v, 1) + ' · 10⁻¹⁰ m'] }[key];
  if (lbl) { const el = document.getElementById(lbl[0]); if (el) el.textContent = lbl[1](v); }
  _phoRenderWM();
}
function _phoRenderWM() {
  const el = document.getElementById('phoRechnung'); if (!el) return;
  const w = _phoWM(), M = _PHO_MAT[_pho.hwMat];
  el.innerHTML = `
    <div class="pho-rz"><span class="pho-rz-t">Bestrahlungsstärke im Abstand d</span>
      <span class="pho-rz-f">I = P / (4π·d²)</span>
      <span class="pho-rz-v">${_phoExp(w.I, 3)} W/m²</span></div>
    <div class="pho-rz"><span class="pho-rz-t">davon nicht reflektiert</span>
      <span class="pho-rz-f">I' = I · (1 − ${_fpmNum(_pho.wmRefl, 0)} %)</span>
      <span class="pho-rz-v">${_phoExp(w.Inr, 3)} W/m²</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Querschnitt eines Atoms</span>
      <span class="pho-rz-f">A = π·r²</span>
      <span class="pho-rz-v">${_phoExp(w.A, 3)} m²</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Leistung auf ein Atom</span>
      <span class="pho-rz-f">P<sub>Atom</sub> = I' · A</span>
      <span class="pho-rz-v">${_phoExp(w.Pat, 3)} W</span></div>
    <div class="pho-rz"><span class="pho-rz-t">nötige Energie (${M.n})</span>
      <span class="pho-rz-f">W<sub>A</sub> = ${_fpmNum(M.WA, 2)} eV</span>
      <span class="pho-rz-v">${_phoExp(w.WA, 3)} J</span></div>
    <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Wartezeit nach dem Wellenmodell</span>
      <span class="pho-rz-f">t = W<sub>A</sub> / P<sub>Atom</sub></span>
      <span class="pho-rz-v">${_phoZeit(w.t)}</span></div>
    <div class="pho-vergleich">
      <div class="pho-vs"><span>Wellenmodell sagt</span><b>${_phoZeit(w.t)}</b></div>
      <div class="pho-vs-op">gegen</div>
      <div class="pho-vs pho-vs-mess"><span>Experiment zeigt</span><b>sofort</b></div>
    </div>
    <div class="fpm-note" style="margin-top:8px">
      Das sind ${isFinite(w.t) ? _phoExp(w.t / 1e-9, 0) : '∞'} Nanosekunden Unterschied zur Beobachtung.
      Auch mit sehr wohlwollenden Annahmen – schiebe die Regler ruhig in die günstigste Stellung –
      lässt sich diese Lücke nicht schließen. Das Wellenmodell ist hier am Ende.
    </div>`;
}

// ── Bedienung: Station 3 ───────────────────────────────
function _phoSetLicht(i) {
  _pho.li = i;
  _PHO_LICHT.forEach((L, k) => document.getElementById('phoL' + k)?.classList.toggle('on', k === i));
  _phoUpdate(); _phoRefreshTheorie();
}
function _phoSetZMat(i) {
  _pho.mi = i;
  _PHO_MAT.forEach((M, k) => document.getElementById('phoZM' + k)?.classList.toggle('on', k === i));
  _phoUpdate(); _phoRefreshTheorie();
}
function _phoSetZInt(v) {
  _pho.int = +v;
  const el = document.getElementById('phoZIntLbl'); if (el) el.textContent = Math.round(+v) + ' %';
  _phoUpdate();
}
function _phoSetU(v) {
  _pho.U = Math.max(-0.5, Math.min(2.5, +v));
  const sl = document.getElementById('phoU'); if (sl) sl.value = String(_pho.U);
  const el = document.getElementById('phoULbl'); if (el) el.textContent = _fpmNum(_pho.U, 2) + ' V';
  _phoUpdate();
}
function _phoUStep(d) { _phoSetU(Math.round((_pho.U + d) * 100) / 100); }
function _phoTake() {
  const Ug = _pho.U;
  if (Ug <= 0) return;
  const L = _PHO_LICHT[_pho.li];
  _pho.rows.push({ id: _pho.nextId++, li: _pho.li, mi: _pho.mi, lam: L.lam,
                   f: _phoF(L.lam), Ug, W: Ug * _PHO_E });
  _phoRenderTable(); _phoDrawPlot();
}
// Kondensatormethode der Handreichung: der Photostrom laedt den Kondensator,
// bis die Gegenspannung selbst die schnellsten Elektronen aufhaelt.
function _phoKond() {
  const Ug = _phoZelleUg();
  if (Ug <= 0) return;
  _phoSetU(Math.round(Ug * (1 + (Math.random() - 0.5) * 0.02) * 100) / 100);
  _phoTake();
}
function _phoDelRow(id) { _pho.rows = _pho.rows.filter(r => r.id !== id); _phoRenderTable(); _phoDrawPlot(); }
function _phoClear() {
  if (_pho.rows.length && !confirm('Alle ' + _pho.rows.length + ' Messwerte löschen?')) return;
  _pho.rows = []; _phoRenderTable(); _phoDrawPlot();
}
// Erzeugt genau die Messreihe der Handreichung plus eine zweite Kathode
function _phoDemo() {
  const nimm = (mi, li) => {
    const L = _PHO_LICHT[li], Ug = _phoUg(L.lam, _PHO_MAT[mi].WA);
    if (Ug <= 0.005) return;
    const g = Math.round(Ug * 100) / 100;          // Ablesegenauigkeit 0,01 V
    _pho.rows.push({ id: _pho.nextId++, li, mi, lam: L.lam, f: _phoF(L.lam), Ug: g, W: g * _PHO_E });
  };
  [0, 1, 2, 3, 4, 5, 6].forEach(li => nimm(0, li));   // K-Schicht
  [0, 1, 2, 3, 4].forEach(li => nimm(1, li));         // Cäsium
  _phoRenderTable(); _phoDrawPlot();
}
function _phoRenderTable() {
  const tb = document.getElementById('phoTbody'); if (!tb) return;
  const empty = document.getElementById('phoEmpty');
  if (empty) empty.style.display = _pho.rows.length ? 'none' : 'block';
  tb.innerHTML = _pho.rows.map(r =>
    `<tr>
       <td><span class="fpm-dot" style="background:${_PHO_MAT[r.mi].col}"></span>${_PHO_MAT[r.mi].n}</td>
       <td><span class="fpm-dot" style="background:${_PHO_LICHT[r.li].col}"></span>${_PHO_LICHT[r.li].n}</td>
       <td>${r.lam}</td><td>${_fpmNum(r.f / 1e14, 2)}</td>
       <td><b>${_fpmNum(r.Ug, 2)}</b></td><td>${_fpmNum(r.W / 1e-20, 2)}</td>
       <td class="fpm-del" onclick="_phoDelRow(${r.id})" title="löschen">✕</td>
     </tr>`).join('');
}

// ── Gemeinsame Aktualisierung ──────────────────────────
function _phoUpdate() {
  if (!_pho) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  // Station 1
  _phoHWMerken();
  const I = _phoHWStrom();
  set('phoIA', _pho.hwLampe ? _fpmNum(I, 1) : '0,0');
  set('phoPolA', _pho.hwPol === 'neg' ? 'negativ' : 'positiv');
  set('phoSofort', I > 0 ? 'sofort (< 1 ns)' : '—');
  const pb = document.getElementById('phoPolBtn');
  if (pb) pb.textContent = _pho.hwPol === 'neg' ? 'Platte positiv laden' : 'Platte negativ laden';
  const gz = document.getElementById('phoGrenz');
  if (gz) {
    const M = _PHO_MAT[_pho.hwMat];
    gz.innerHTML = 'W<sub>A</sub> = ' + _fpmNum(M.WA, 2) + ' eV &nbsp;⇒&nbsp; Grenzwellenlänge ' +
      _fpmNum(_phoLamGrenz(M.WA), 0) + ' nm, Grenzfrequenz ' + _fpmNum(_phoFGrenz(M.WA) / 1e14, 2) + ' · 10¹⁴ Hz';
  }
  _phoSpektrum();
  _phoBefunde();
  _phoRenderWM();

  // Station 3
  const L = _PHO_LICHT[_pho.li], M2 = _PHO_MAT[_pho.mi];
  const Istrom = _phoAnzeige(_phoZelleI(_pho.U));
  set('phoZI', _fpmNum(Istrom, 2));
  set('phoZF', _fpmNum(_phoF(L.lam) / 1e14, 2));
  set('phoZW', _pho.U > 0 ? _fpmNum(_pho.U * _PHO_E / 1e-20, 2) : '—');
  const tb = document.getElementById('phoTakeBtn');
  if (tb) tb.disabled = !(_pho.U > 0);
}

function _phoSpektrum() {
  const el = document.getElementById('phoSpek'); if (!el) return;
  const M = _PHO_MAT[_pho.hwMat];
  el.innerHTML = _phoHWLinien().map(L => {
    const cls = !L.durch ? 'aus' : (L.loest ? 'loest' : 'zuschwach');
    const titel = !L.durch ? 'vom Filter zurückgehalten'
                : L.loest ? 'löst Elektronen aus'
                : 'kommt durch, aber die Energie reicht nicht';
    return `<div class="pho-lin ${cls}" title="${titel}">
       <span class="pho-lin-l">${L.lam}</span><span class="pho-lin-a">${L.art}</span></div>`;
  }).join('') +
  `<div class="fpm-note" style="flex-basis:100%;margin-top:5px">
     Grün = löst aus, grau = kommt durch, reicht aber nicht (E &lt; W<sub>A</sub> = ${_fpmNum(M.WA, 2)} eV),
     durchgestrichen = vom Filter geblockt.</div>`;
}

function _phoBefunde() {
  const el = document.getElementById('phoBefunde'); if (!el) return;
  const g = _pho.gesehen;
  const z = (ok, txt, wie) =>
    `<div class="pho-bef ${ok ? 'ok' : ''}"><span class="pho-bef-h">${ok ? '✓' : '○'}</span>
       <span><b>${txt}</b>${ok ? '' : '<br><span class="pho-bef-wie">' + wie + '</span>'}</span></div>`;
  el.innerHTML =
    `<div class="git-sch-kopf">Experimentelle Befunde – finde sie durch Versuchsvariationen</div>` +
    z(g.umgepolt, 'Nur negative Ladungsträger werden herausgelöst.',
      'Tausche die Polung: Ist die Platte positiv, fließt kein Strom – die Elektronen werden zurückgezogen.') +
    z(g.mitUV && g.mitGlas, 'Nur kurzwelliges UV-Licht löst Elektronen aus.',
      'Halte die Glasplatte davor, bis der Strom versiegt – und finde die Kombination, bei der er wieder fließt.') +
    z(g.schwach, 'Auch bei kleiner Intensität fließt der Strom sofort.',
      'Verringere die Intensität auf 20 % oder weniger, während Strom fließt.') +
    (g.umgepolt && g.mitUV && g.mitGlas && g.schwach
      ? `<div class="pho-bef-fertig">Alle drei Befunde gefunden. Zwei davon widersprechen dem Wellenmodell:
         Nach ihm müsste helles sichtbares Licht ebenso wirken wie schwaches UV, und die Elektronen
         müssten erst nach einiger Zeit kommen. Weiter zu Station 2.</div>` : '');
}

// ── Zeichnungen ────────────────────────────────────────
function _phoTeilchen(dt, aktiv, x0, y0, x1, y1) {
  const T = _pho.teilchen;
  if (aktiv && T.length < 26 && Math.random() < 0.5) {
    T.push({ p: 0, y: y0 + (Math.random() - 0.5) * 60, v: 0.5 + Math.random() * 0.5 });
  }
  for (let i = T.length - 1; i >= 0; i--) {
    T[i].p += T[i].v * dt * 1.6;
    if (T[i].p > 1) T.splice(i, 1);
  }
}
function _phoDrawTeilchen(ctx, x0, x1, ziel) {
  _pho.teilchen.forEach(t => {
    const x = x0 + (x1 - x0) * t.p;
    const y = t.y + (ziel - t.y) * t.p;
    ctx.fillStyle = '#0284c7';
    ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 7px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('−', x, y + 2.5);
  });
  ctx.textAlign = 'left';
}

function _phoRenderHW(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  const I = _phoHWStrom();
  const yM = 118;
  const xL = 44, xF = 128, xE = 196, xP = 286;

  // Hg-Lampe
  ctx.fillStyle = '#334155'; ctx.fillRect(xL - 24, yM - 26, 30, 52);
  if (_pho.hwLampe) {
    const a = 0.25 + 0.75 * _pho.hwInt / 100;
    ctx.globalAlpha = a;
    ctx.fillStyle = '#a5b4fc';
    ctx.beginPath(); ctx.moveTo(xL + 6, yM - 24); ctx.lineTo(xP, yM - 46);
    ctx.lineTo(xP, yM + 46); ctx.lineTo(xL + 6, yM + 24); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#e0e7ff'; ctx.fillRect(xL + 2, yM - 12, 6, 24);
  }
  ctx.fillStyle = '#fff'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Hg', xL - 9, yM - 2); ctx.fillText('Lampe', xL - 9, yM + 8);

  // Filter
  if (_pho.hwFilter > 0) {
    ctx.fillStyle = _pho.hwFilter === 1 ? 'rgba(148,197,255,.55)'
                  : _pho.hwFilter === 2 ? 'rgba(139,92,246,.45)' : 'rgba(239,68,68,.4)';
    ctx.fillRect(xF - 5, yM - 44, 10, 88);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.strokeRect(xF - 5.5, yM - 44.5, 11, 89);
    ctx.fillStyle = '#475569'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'center';
    ctx.save(); ctx.translate(xF, yM + 60); ctx.rotate(-Math.PI / 2);
    ctx.fillText(_PHO_FILTER[_pho.hwFilter].n, 0, 0); ctx.restore();
  }

  // Spiralelektrode
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath(); ctx.arc(xE, yM, 6 + i * 5.5, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(xE, yM - 40); ctx.lineTo(xE, yM - 62); ctx.stroke();

  // Zinkplatte
  const platteNeg = _pho.hwPol === 'neg';
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(xP, yM - 46, 11, 92);
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.2; ctx.strokeRect(xP + 0.5, yM - 46.5, 11, 92);
  ctx.fillStyle = platteNeg ? '#0284c7' : '#dc2626';
  ctx.font = '700 13px sans-serif'; ctx.textAlign = 'center';
  for (let i = -1; i <= 1; i++) ctx.fillText(platteNeg ? '−' : '+', xP + 22, yM + i * 22 + 4);
  ctx.fillStyle = '#334155'; ctx.font = '700 9px sans-serif';
  ctx.fillText(_PHO_MAT[_pho.hwMat].n, xP + 6, yM + 62);

  // Elektronen
  _phoDrawTeilchen(ctx, xP - 2, xE, yM);

  // Stromkreis
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(xP + 6, yM - 46); ctx.lineTo(xP + 6, 28); ctx.lineTo(W - 46, 28);
  ctx.lineTo(W - 46, H - 34); ctx.lineTo(xE, H - 34); ctx.lineTo(xE, yM + 40);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xE, yM - 62); ctx.lineTo(xE, 28); ctx.stroke();

  // Piko-Amperemeter
  const mx = W - 46, my = 74;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(mx, my, 24, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  const voll = 130, zeig = Math.min(1, I / voll);
  const wk = -Math.PI * 0.75 + zeig * Math.PI * 1.5;
  ctx.strokeStyle = I > 0 ? '#dc2626' : '#94a3b8'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + 17 * Math.cos(wk - Math.PI / 2), my + 17 * Math.sin(wk - Math.PI / 2)); ctx.stroke();
  ctx.fillStyle = '#334155'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('pA', mx, my + 18);
  ctx.fillStyle = I > 0 ? '#16a34a' : '#94a3b8'; ctx.font = '700 10px sans-serif';
  ctx.fillText(_fpmNum(I, 1) + ' pA', mx, my + 38);

  // Hochspannungsquelle
  const hx = W - 46, hy = H - 34;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(hx, hy, 15, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#334155'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('HV', hx, hy + 3);

  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Spiralelektrode', xE - 34, H - 12);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(_pho.hwLampe ? 'Lampe an · ' + Math.round(_pho.hwInt) + ' %' : 'Lampe aus', W - 8, 14);
  ctx.textAlign = 'left';
}

function _phoRenderZelle(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  const L = _PHO_LICHT[_pho.li], M = _PHO_MAT[_pho.mi];
  const Ug = _phoZelleUg(), I = _phoAnzeige(_phoZelleI(_pho.U));
  const yM = 104, kx = 236, ax = 168;

  // Gehaeuse
  ctx.fillStyle = '#1e293b'; ctx.fillRect(96, 26, 200, 156);
  ctx.fillStyle = '#0f172a'; ctx.fillRect(100, 30, 192, 148);
  ctx.fillStyle = '#94a3b8'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('lichtdichtes Gehäuse', 102, 40);

  // Glaskolben
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(196, yM, 78, 54, 0, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = 'rgba(148,163,184,.10)'; ctx.fill();

  // Lichtbuendel
  ctx.globalAlpha = 0.28 + 0.5 * _pho.int / 100;
  ctx.fillStyle = L.col;
  ctx.beginPath(); ctx.moveTo(8, yM - 9); ctx.lineTo(kx, yM - 16);
  ctx.lineTo(kx, yM + 16); ctx.lineTo(8, yM + 9); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#334155'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(L.n + ' · ' + L.lam + ' nm', 10, yM - 20);

  // Photokathode
  ctx.fillStyle = M.col; ctx.fillRect(kx, yM - 34, 8, 68);
  ctx.fillStyle = '#334155'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'center';
  ctx.save(); ctx.translate(kx + 20, yM); ctx.rotate(-Math.PI / 2);
  ctx.fillText('Photokathode', 0, 0); ctx.restore();

  // Ringelektrode
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(ax, yM, 7, 30, 0, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#334155'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Ring', ax, yM + 46);

  // Elektronen fliegen von der Kathode zum Ring – nur wenn welche ankommen
  if (I > 0) _phoDrawTeilchen(ctx, kx, ax, yM);

  // Ergebnisanzeige
  ctx.textAlign = 'left';
  ctx.font = '700 10px sans-serif';
  if (Ug <= 0) {
    ctx.fillStyle = '#dc2626';
    ctx.fillText('kein Photoeffekt: E = ' + _fpmNum(_phoEPhoton(L.lam) / _PHO_E, 2) +
                 ' eV < W_A = ' + _fpmNum(M.WA, 2) + ' eV', 10, H - 26);
    ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif';
    ctx.fillText('Auch mehr Intensität hilft nicht – es fehlt Energie pro Photon.', 10, H - 12);
  } else {
    ctx.fillStyle = '#334155';
    ctx.fillText('E = ' + _fpmNum(_phoEPhoton(L.lam) / _PHO_E, 2) + ' eV', 10, H - 26);
    ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif';
    ctx.fillText('W_A = ' + _fpmNum(M.WA, 2) + ' eV  →  W_kin(max) = ' +
                 _fpmNum(_phoWkin(L.lam, M.WA) / _PHO_E, 3) + ' eV', 10, H - 12);
  }
  ctx.textAlign = 'right';
  ctx.fillStyle = I > 0 ? '#16a34a' : '#94a3b8'; ctx.font = '700 11px sans-serif';
  ctx.fillText(_fpmNum(I, 2) + ' nA', W - 10, H - 26);
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif';
  ctx.fillText('U = ' + _fpmNum(_pho.U, 2) + ' V', W - 10, H - 12);
  ctx.textAlign = 'left';
}

// Live-Kennlinie I(U) – das, was man am Messplatz tatsaechlich aufnimmt
function _phoRenderKennlinie() {
  const cv = document.getElementById('phoKennlinie');
  if (!cv || !_pho) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const padL = 46, padR = 12, padT = 16, padB = 30;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const Ug = _phoZelleUg();
  const uMin = -0.5, uMax = Math.max(0.8, Ug * 1.35);
  const iMax = Math.max(1, _pho.int / 100 * 12) * 1.15;
  const X = u => x0 + (u - uMin) / (uMax - uMin) * (x1 - x0);
  const Y = i => y0 - i / iMax * (y0 - y1);

  ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const gy = y1 + (y0 - y1) * i / 4;
    ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x1, gy); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  // Nulllinie der Spannung
  ctx.strokeStyle = '#cbd5e1'; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(X(0), y0); ctx.lineTo(X(0), y1); ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  [-0.5, 0, 0.5, 1, 1.5, 2].forEach(u => {
    if (u < uMin || u > uMax) return;
    ctx.fillText(_fpmNum(u, 1), X(u), y0 + 12);
  });
  ctx.textAlign = 'right';
  ctx.fillText(_fpmNum(iMax, 0), x0 - 4, y1 + 8);
  ctx.fillText('0', x0 - 4, y0 + 3);
  ctx.fillStyle = '#475569'; ctx.font = '700 9px sans-serif';
  ctx.fillText('U in V', x1, y0 + 24);
  ctx.save(); ctx.translate(11, y1 + 4); ctx.rotate(-Math.PI / 2);
  ctx.fillText('I in nA', 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (Ug <= 0) {
    ctx.fillStyle = '#dc2626'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('kein Photostrom – unterhalb der Grenzfrequenz', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    return;
  }

  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = x0; px <= x1; px++) {
    const u = uMin + (px - x0) / (x1 - x0) * (uMax - uMin);
    const py = Y(_phoZelleI(u));
    px === x0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Gegenspannung markieren
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1.3; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(X(Ug), y0); ctx.lineTo(X(Ug), y1); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#16a34a'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('U_g', X(Ug), y1 + 8);

  // Arbeitspunkt
  const py = Y(_phoZelleI(_pho.U));
  ctx.fillStyle = '#db2777';
  ctx.beginPath(); ctx.arc(X(_pho.U), py, 4.5, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.textAlign = 'left';
}

// ── Auswertungsdiagramm ────────────────────────────────
const _PHO_PRESETS = [
  { xl: 'f in 10¹⁴ Hz', yl: 'W_kin in 10⁻²⁰ J',
    x: r => r.f / 1e14, y: r => r.W / 1e-20,
    hAus: k => k * 1e-34,
    wAus: b => -b * 1e-20 / _PHO_E,
    slope: () => _PHO_H / 1e-34,
    achse: mi => -_PHO_MAT[mi].WA * _PHO_E / 1e-20,
    note: 'Die Einsteingerade. Steigung = h, Achsenabschnitt = −W_A, Nullstelle = Grenzfrequenz.',
    typ: 'lineare Funktion mit negativem Achsenabschnitt',
    form: 'W_kin(f) = h · f − W_A',
    term: () => _dspZahl(_PHO_H / 1e-34) + '*x-' + _dspZahl(_PHO_MAT[_pho.mi].WA * _PHO_E / 1e-20),
    param: () => 'h = 6,626 · 10⁻³⁴ J·s, W_A = ' + _fpmNum(_PHO_MAT[_pho.mi].WA, 2) + ' eV',
    deutung: 'Keine Ursprungsgerade – und genau darin steckt die Austrittsarbeit. Die Steigung ist für jedes Material dieselbe: h ist eine Naturkonstante, W_A eine Materialeigenschaft.' },

  { xl: 'f in 10¹⁴ Hz', yl: 'U_g in V',
    x: r => r.f / 1e14, y: r => r.Ug,
    hAus: k => k * _PHO_E * 1e-14,
    wAus: b => -b,
    slope: () => _PHO_H / _PHO_E * 1e14,
    achse: mi => -_PHO_MAT[mi].WA,
    note: 'Dieselbe Gerade, nur durch e geteilt. Steigung = h/e, Achsenabschnitt = −W_A/e.',
    typ: 'lineare Funktion mit negativem Achsenabschnitt',
    form: 'U_g(f) = (h/e) · f − W_A/e',
    term: () => _dspZahl(_PHO_H / _PHO_E * 1e14) + '*x-' + _dspZahl(_PHO_MAT[_pho.mi].WA),
    param: () => 'h/e = ' + _fpmNum(_PHO_H / _PHO_E * 1e14, 5) + ' V pro 10¹⁴ Hz',
    deutung: 'Man kann direkt die gemessene Gegenspannung auftragen, ohne vorher in Joule umzurechnen. Aus der Steigung folgt h = Steigung · e.' },

  { xl: '1/λ in 1/µm', yl: 'U_g in V',
    x: r => 1000 / r.lam, y: r => r.Ug,
    hAus: k => k * 1e-6 * _PHO_E / _PHO_C,
    wAus: b => -b,
    slope: () => _PHO_H * _PHO_C / _PHO_E * 1e6,
    achse: mi => -_PHO_MAT[mi].WA,
    note: 'Auch über den Kehrwert der Wellenlänge wird es linear, denn f = c/λ.',
    typ: 'lineare Funktion mit negativem Achsenabschnitt',
    form: 'U_g(1/λ) = (h·c/e) · (1/λ) − W_A/e',
    term: () => _dspZahl(_PHO_H * _PHO_C / _PHO_E * 1e6) + '*x-' + _dspZahl(_PHO_MAT[_pho.mi].WA),
    param: () => 'h·c/e = ' + _fpmNum(_PHO_H * _PHO_C / _PHO_E * 1e6, 4) + ' V·µm',
    deutung: 'Wer die Wellenlänge misst statt der Frequenz, trägt 1/λ auf. Aus der Steigung folgt h = Steigung · e / c.' }
];

function _phoDrawPlot() {
  const cv = document.getElementById('phoPlot');
  if (!cv || !_pho) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _PHO_PRESETS[_pho.preset];
  const padL = 66, padR = 14, padT = 14, padB = 42;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const pts = _pho.rows.map(r => ({ x: P.x(r), y: P.y(r) })).filter(p => isFinite(p.x) && isFinite(p.y));
  const xmax = pts.length ? Math.max(...pts.map(p => p.x)) * 1.12 : 10;
  const ymax = pts.length ? Math.max(...pts.map(p => p.y)) * 1.25 : 1;
  // Die Gerade schneidet die y-Achse unterhalb von null – der Bereich muss sichtbar sein
  let ymin = 0;
  const map = new Map();
  _pho.rows.forEach(r => { if (!map.has(r.mi)) map.set(r.mi, []); map.get(r.mi).push(r); });
  map.forEach((rows, mi) => {
    const gp = rows.map(r => ({ x: P.x(r), y: P.y(r) }));
    if (gp.length >= 2) {
      const f = _fpmFitLinear(gp);
      if (f && f.b < ymin) ymin = f.b * 1.15;
    }
  });
  if (ymin === 0 && pts.length) ymin = -ymax * 0.35;
  if (!pts.length) ymin = -1;

  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - (v - ymin) / (ymax - ymin) * (y0 - y1);

  const xt = _fpmTicks(xmax, 6);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 14);
  });
  // y-Teilung symmetrisch um null
  const yspan = ymax - ymin;
  const yt = _fpmTicks(Math.max(Math.abs(ymin), ymax), 4);
  ctx.strokeStyle = '#eef2f7';
  yt.ticks.forEach(v => {
    [v, -v].forEach(vv => {
      if (vv < ymin || vv > ymax) return;
      ctx.beginPath(); ctx.moveTo(x0, Y(vv)); ctx.lineTo(x1, Y(vv)); ctx.stroke();
      ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
      ctx.fillText(_fpmTickLbl(vv, yt.step), x0 - 6, Y(vv) + 3);
    });
  });

  // Achsen; die x-Achse liegt bei y = 0, nicht am unteren Rand
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 30);
  ctx.save(); ctx.translate(15, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'right'; ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (!pts.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte aufgenommen', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('phoFitBox');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    return;
  }

  if (_pho.fn) {
    ctx.strokeStyle = '#db2777'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let started = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _pho.fn((px - x0) / (x1 - x0) * xmax); } catch (err) { yv = NaN; }
      if (!isFinite(yv)) { started = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { started = false; continue; }
      started ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), started = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  const info = [];
  [...map.keys()].sort((a, b) => a - b).forEach(mi => {
    const rows = map.get(mi);
    const col = _PHO_MAT[mi].col;
    const gp = rows.map(r => ({ x: P.x(r), y: P.y(r) })).filter(p => isFinite(p.x) && isFinite(p.y));
    let fit = null;
    if (gp.length >= 2) {
      fit = _pho.origin ? _fpmFitOrigin(gp) : _fpmFitLinear(gp);
      if (fit) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.7;
        ctx.beginPath(); ctx.moveTo(X(0), Y(fit.b)); ctx.lineTo(X(xmax), Y(fit.k * xmax + fit.b)); ctx.stroke();
        // Grenzfrequenz markieren
        if (!_pho.origin && fit.k > 0) {
          const xg = -fit.b / fit.k;
          if (xg > 0 && xg < xmax) {
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(X(xg), Y(0), 3.5, 0, 2 * Math.PI); ctx.fill();
          }
        }
      }
    }
    gp.forEach(p => {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 4, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke();
    });
    info.push({ mi, col, fit, n: gp.length });
  });

  _phoRenderFit(info, P);
}

function _phoRenderFit(groups, P) {
  const el = document.getElementById('phoFitBox');
  if (!el) return;
  let html = '';
  groups.forEach(g => {
    if (!g.fit) return;
    const M = _PHO_MAT[g.mi];
    const h = P.hAus(g.fit.k);
    const WA = _pho.origin ? NaN : P.wAus(g.fit.b);
    const fG = _pho.origin ? NaN : -g.fit.b / g.fit.k;
    const abwH = Math.abs(h - _PHO_H) / _PHO_H * 100;
    const clsH = abwH < 1 ? 'ok' : abwH < 5 ? 'mid' : 'no';
    html += `<div class="fpm-fitline">
       <span class="fpm-fitmeta"><span class="fpm-dot" style="background:${g.col}"></span>${M.n} · ${g.n} Messwerte</span>
       <span class="fpm-fiteq">y = ${_fpmNum(g.fit.k, 4)}·x ${g.fit.b >= 0 ? '+' : '−'} ${_fpmNum(Math.abs(g.fit.b), 3)}</span>
       <span class="fpm-fitmeta">R² = ${_fpmNum(g.fit.r2, 5)}</span>
       <span class="fpm-fiteq" style="color:#5b21b6">h = ${_phoExp(h, 3)} J·s</span>
       ${isFinite(WA) ? `<span class="fpm-fiteq" style="color:#5b21b6">W<sub>A</sub> = ${_fpmNum(WA, 3)} eV</span>` : ''}
       ${isFinite(fG) ? `<span class="fpm-fitmeta">Grenzfrequenz ${_fpmNum(P.xl.indexOf('λ') >= 0 ? fG : fG, 3)} ${P.xl.indexOf('λ') >= 0 ? '1/µm (λ = ' + _fpmNum(1000 / fG, 0) + ' nm)' : '· 10¹⁴ Hz'}</span>` : ''}
       ${_pho.reveal ? `<span class="fpm-badge ${clsH}">h-Sollwert 6,626 · 10⁻³⁴ · Abweichung ${_fpmNum(abwH, 2)} %${isFinite(WA) ? ' · W_A soll ' + _fpmNum(M.WA, 2) + ' eV' : ''}</span>` : ''}
     </div>`;
  });
  if (!html) {
    el.innerHTML = '<div class="fpm-note">Mindestens zwei Messwerte je Kathodenmaterial nötig.<br>' + P.note + '</div>';
    return;
  }
  if (_pho.origin) {
    html += `<div class="fpm-note" style="color:#b45309;border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">
      <b>Die Ursprungsgerade ist erzwungen.</b> Sieh dir R² an: Sie passt nicht zu den Messwerten.
      Genau der Achsenabschnitt, den sie unterdrückt, ist die Austrittsarbeit.</div>`;
  }
  if (groups.filter(g => g.fit).length >= 2) {
    const ks = groups.filter(g => g.fit).map(g => g.fit.k);
    const spanne = (Math.max(...ks) - Math.min(...ks)) / Math.max(...ks) * 100;
    html += `<div class="fpm-fitline" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">
       <span class="fpm-fitmeta">Die Geraden verschiedener Materialien sind <b>parallel</b>:
         die Steigungen unterscheiden sich um ${_fpmNum(spanne, 2)} %.</span>
       <span class="fpm-fitmeta">h ist eine Naturkonstante, W<sub>A</sub> hängt vom Material ab.</span>
     </div>`;
  }
  el.innerHTML = html + '<div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">' + P.note + '</div>';
}

function _phoSetPreset(i) {
  _pho.preset = i;
  for (let k = 0; k < 3; k++) document.getElementById('phoTab' + k)?.classList.toggle('on', k === i);
  _phoRefreshTheorie();
  _phoDrawPlot();
}
function _phoTheorieFn() {
  const term = _PHO_PRESETS[_pho.preset].term();
  const inp = document.getElementById('phoFn');
  if (inp) inp.value = term;
  _phoSetFn(term);
  _pho.fnAuto = true;
  _phoRenderTheorie(true);
}
function _phoClearFn() {
  const inp = document.getElementById('phoFn');
  if (inp) inp.value = '';
  _phoSetFn('');
  _phoRenderTheorie(false);
}
function _phoRefreshTheorie() {
  if (_pho.fnAuto) {
    const term = _PHO_PRESETS[_pho.preset].term();
    const inp = document.getElementById('phoFn');
    if (inp) inp.value = term;
    _phoSetFn(term);
    _pho.fnAuto = true;
  }
  _phoRenderTheorie(_pho.fnAuto);
}
function _phoRenderTheorie(eingesetzt) {
  const el = document.getElementById('phoTheo');
  if (!el) return;
  const P = _PHO_PRESETS[_pho.preset];
  el.innerHTML =
    `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
     <div class="fpm-theo-typ">${P.typ}</div>
     <div class="fpm-theo-form">${P.form}</div>
     <div class="fpm-theo-par">${P.param()}</div>
     ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${P.term()}</div>` : ''}
     <div class="fpm-theo-deutung">${P.deutung}</div>`;
}
function _phoSetFn(str) {
  _pho.fnAuto = false;
  const err = document.getElementById('phoFnErr');
  const v = (str || '').trim();
  if (!v) { _pho.fn = null; if (err) err.textContent = ''; _phoDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _pho.fn = f; if (err) err.textContent = '';
  } catch (e) { _pho.fn = null; if (err) err.textContent = e.message; }
  _phoDrawPlot();
}

// ── Takt ───────────────────────────────────────────────
function _phoTakt(dt) {
  if (!_pho) return;
  _pho.t += dt;
  if (_pho.station === 0) {
    _phoTeilchen(dt, _phoHWStrom() > 0, 286, 118, 196, 118);
  } else if (_pho.station === 2) {
    _phoTeilchen(dt, _phoAnzeige(_phoZelleI(_pho.U)) > 0, 236, 104, 168, 104);
  } else {
    _pho.teilchen.length = 0;
  }
}
function _phoRender() {
  if (!_pho) return;
  if (_pho.station === 0) {
    const cv = document.getElementById('phoHW');
    if (cv) _phoRenderHW(cv.getContext('2d'), cv);
  } else if (_pho.station === 2) {
    const cv = document.getElementById('phoZelle');
    if (cv) _phoRenderZelle(cv.getContext('2d'), cv);
    _phoRenderKennlinie();
  }
}

// ── Zusaetzliche Styles ────────────────────────────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .pho-mats { display: flex; gap: 5px; flex-wrap: wrap; }
    .pho-mat { flex: 1 1 84px; display: flex; flex-direction: column; gap: 1px; align-items: flex-start;
      padding: 5px 7px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 9px; cursor: pointer; }
    .pho-mat:hover { border-color: #cbd5e1; }
    .pho-mat.on { border-color: #7c3aed; background: #f5f3ff; }
    .pho-mat-n { font-size: .7rem; font-weight: 800; color: #475569; }
    .pho-mat.on .pho-mat-n { color: #5b21b6; }
    .pho-mat-w { font-size: .66rem; color: #94a3b8; font-variant-numeric: tabular-nums; }
    .pho-grenz { font-size: .72rem; color: #64748b; margin-top: 6px; line-height: 1.5; }
    .pho-fils { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px; }
    .pho-fil { flex: 1 1 76px; padding: 6px 6px; background: #f8fafc; border: 2px solid #e2e8f0;
      border-radius: 9px; cursor: pointer; font-size: .74rem; font-weight: 700; color: #475569; }
    .pho-fil:hover { border-color: #cbd5e1; }
    .pho-fil.on { border-color: #7c3aed; background: #f5f3ff; color: #5b21b6; }
    .pho-filkurz { font-size: .72rem; color: #64748b; margin-top: 5px; min-height: 15px; }
    .pho-spektrum { display: flex; gap: 4px; flex-wrap: wrap; }
    .pho-lin { display: flex; flex-direction: column; align-items: center; padding: 4px 6px;
      border-radius: 7px; border: 1px solid #e2e8f0; background: #f8fafc; min-width: 44px; }
    .pho-lin-l { font-size: .72rem; font-weight: 800; color: #475569; font-variant-numeric: tabular-nums; }
    .pho-lin-a { font-size: .6rem; color: #94a3b8; }
    .pho-lin.loest { border-color: #86efac; background: #f0fdf4; }
    .pho-lin.loest .pho-lin-l { color: #15803d; }
    .pho-lin.aus { opacity: .45; text-decoration: line-through; }
    .pho-protwrap { max-height: 150px; overflow: auto; border: 1px solid #e2e8f0;
      border-radius: 9px; margin-top: 6px; }
    .pho-protwrap .sim-table { margin-top: 0; font-size: .74rem; }
    .pho-protwrap .sim-table th { position: sticky; top: 0; z-index: 1; font-size: .68rem; }
    .pho-befunde { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 12px; margin-top: 12px; }
    .pho-bef { display: flex; gap: 8px; align-items: flex-start; font-size: .78rem; color: #64748b;
      padding: 5px 0; border-bottom: 1px solid #eef2f7; }
    .pho-bef b { color: #94a3b8; font-weight: 700; }
    .pho-bef.ok b { color: #15803d; }
    .pho-bef-h { font-weight: 800; color: #cbd5e1; }
    .pho-bef.ok .pho-bef-h { color: #16a34a; }
    .pho-bef-wie { font-size: .72rem; color: #94a3b8; }
    .pho-bef-fertig { font-size: .76rem; color: #15803d; background: #f0fdf4; border: 1px solid #bbf7d0;
      border-radius: 8px; padding: 8px 10px; margin-top: 8px; line-height: 1.5; }
    .pho-rechnung { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 4px 11px; }
    .pho-rz { display: grid; grid-template-columns: 1fr auto; gap: 2px 10px; padding: 7px 0;
      border-bottom: 1px solid #eef2f7; }
    .pho-rz-t { font-size: .76rem; color: #475569; }
    .pho-rz-f { font-size: .72rem; color: #94a3b8; font-family: ui-monospace, monospace; grid-column: 1; }
    .pho-rz-v { font-size: .84rem; font-weight: 800; color: #1e293b; grid-column: 2; grid-row: 1 / span 2;
      align-self: center; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .pho-rz-erg .pho-rz-v { color: #7c3aed; font-size: 1rem; }
    .pho-vergleich { display: flex; align-items: stretch; gap: 8px; margin: 10px 0 4px; }
    .pho-vs { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 8px 10px;
      background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px; }
    .pho-vs span { font-size: .68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; font-weight: 800; }
    .pho-vs b { font-size: 1.05rem; color: #b91c1c; font-variant-numeric: tabular-nums; }
    .pho-vs-mess { background: #f0fdf4; border-color: #bbf7d0; }
    .pho-vs-mess b { color: #15803d; }
    .pho-vs-op { align-self: center; font-size: .74rem; font-weight: 800; color: #94a3b8; }
    .pho-lichter { display: flex; gap: 5px; flex-wrap: wrap; }
    .pho-licht { flex: 1 1 74px; display: flex; align-items: center; gap: 5px; padding: 5px 7px;
      background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 9px; cursor: pointer; }
    .pho-licht:hover { border-color: #cbd5e1; }
    .pho-licht.on { border-color: #7c3aed; background: #f5f3ff; }
    .pho-licht-p { width: 10px; height: 10px; border-radius: 50%; flex: 0 0 auto; }
    .pho-licht-n { font-size: .72rem; font-weight: 800; color: #475569; }
    .pho-licht-l { font-size: .64rem; color: #94a3b8; margin-left: auto; font-variant-numeric: tabular-nums; }
    .pho-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════════
//  MILLIKANVERSUCH – das Schlüsselexperiment
//  Nach der Handreichung "Versuch 5: Der Millikanversuch" (NRW).
//  Drei Stationen: Wattebausch-Modellversuch → vereinfachter
//  Millikanversuch → Auswertung im Hinblick auf die Elementarladung.
// ═══════════════════════════════════════════════════════════════

const _MIL_G   = 9.81;        // m/s²
const _MIL_RHO = 886;         // Dichte des Öls in kg/m³
const _MIL_ETA = 1.81e-5;     // dynamische Zähigkeit der Luft in Pa·s
const _MIL_E   = 1.602e-19;   // Elementarladung in C (Sollwert)

// Auflösung der Mikrometerskala im Okular: 0,01 mm sind gerade noch schätzbar
const _MIL_ABLESUNG = 0.01;

let _mil = null;

function _milInit() {
  _mil = {
    station: 0, t: 0,
    // ── Station 1: Wattebauschversuch ──
    wbM: 20, wbD: 8, wbU: 0, wbQ: 1e-8, wbY: 0, wbV: 0,
    wbRows: [], wbNextId: 1, hilfe: 0,
    // ── Station 2: Millikanversuch ──
    d: 6.0,                       // Plattenabstand in mm
    U: 0, feld: false,
    tropfen: null, y: 0.2, phase: 'leer',
    uhrLauf: false, uhrT: 0, uhrY0: 0, uhrS: 0, uhrFertig: false,
    rGem: null, vGem: null, uSchweb: null,
    rVorgeben: false, rVor: 1.0, rausch: false,
    rows: [], nextId: 1,
    // ── Station 3: Auswertung ──
    eProbe: 1.60, preset: 0, fn: null, fnAuto: false, reveal: false
  };
}

// ── Physik ─────────────────────────────────────────────
// Kugelvolumen mal Dichte – der Auftrieb in Luft bleibt bewusst
// unberücksichtigt (didaktische Reduktion der Handreichung, S. 6).
function _milMasse(r) { return 4 / 3 * Math.PI * r * r * r * _MIL_RHO; }

// Schwebebedingung: F_elektrisch = F_Gravitation  ⇒  q·U/d = m·g
function _milLadung(m, d, U) { return U > 0 ? m * _MIL_G * d / U : NaN; }
function _milUSchweb(m, d, q) { return q > 0 ? m * _MIL_G * d / q : NaN; }

// Stokes: bei U = 0 hält die Reibungskraft 6πηrv der Gewichtskraft
// die Waage  ⇒  v = 2·r²·ρ·g / (9·η)
function _milSinkV(r) { return 2 * r * r * _MIL_RHO * _MIL_G / (9 * _MIL_ETA); }
function _milRausV(v) { return Math.sqrt(9 * _MIL_ETA * v / (2 * _MIL_RHO * _MIL_G)); }

// Bewegung im Feld: die Endgeschwindigkeit stellt sich praktisch sofort ein,
// weil die Reibung bei diesen Größen alles in Sekundenbruchteilen abbremst.
// v > 0 bedeutet Steigen.
function _milVFeld(r, q, U, d) {
  const F = q * U / d - _milMasse(r) * _MIL_G;
  return F / (6 * Math.PI * _MIL_ETA * r);
}

function _milDm() { return _mil.d / 1000; }      // Plattenabstand in m

// ── Station 1 ──────────────────────────────────────────
function _milWbMasse() { return _mil.wbM * 1e-6; }        // mg → kg
function _milWbD() { return _mil.wbD / 100; }             // cm → m
function _milWbUSchweb() { return _milUSchweb(_milWbMasse(), _milWbD(), _mil.wbQ); }
// Beschleunigung des Wattebauschs: die Luftreibung ist hier so klein,
// dass sie nur als schwache Dämpfung der Anzeige dient.
function _milWbA() {
  return (_mil.wbQ * _mil.wbU / _milWbD() - _milWbMasse() * _MIL_G) / _milWbMasse();
}
function _milWbSchwebt() { return Math.abs(_milWbA()) < 0.10; }

// Erzeugt eine Ladung, deren Schwebespannung im Bereich des
// Hochspannungsnetzgeräts liegt.
function _milWbLaden() {
  const m = _milWbMasse(), d = _milWbD();
  const Uziel = 900 + Math.random() * 3400;
  _mil.wbQ = m * _MIL_G * d / Uziel;
  _mil.wbY = 0; _mil.wbV = 0;
  _milWbUpdate();
}

// ── Station 2 ──────────────────────────────────────────
// Zerstäuber: erzeugt ein Tröpfchen, dessen Schwebespannung mit dem
// vorhandenen Netzgerät (bis 600 V) tatsächlich erreichbar ist.
function _milZerstaeuber() {
  const d = _milDm();
  for (let i = 0; i < 500; i++) {
    const r = (0.50 + Math.random() * 0.60) * 1e-6;
    const n = 1 + Math.floor(Math.random() * 8);
    const q = n * _MIL_E;
    const U = _milUSchweb(_milMasse(r), d, q);
    if (U >= 120 && U <= 520) {
      _mil.tropfen = { r, n, q, U };
      _mil.y = 0.10; _mil.phase = 'fall'; _mil.U = 0; _mil.feld = false;
      _mil.uhrLauf = false; _mil.uhrT = 0; _mil.uhrS = 0; _mil.uhrFertig = false;
      _mil.rGem = null; _mil.vGem = null; _mil.uSchweb = null;
      _milSetU(0);
      _milUpdate();
      return;
    }
  }
}

// Schwebespannung des aktuellen Troepfchens beim aktuellen Plattenabstand.
// Nicht den beim Zerstaeuben gespeicherten Wert verwenden: d ist verstellbar.
function _milUTropfen() {
  const T = _mil.tropfen;
  return T ? _milUSchweb(_milMasse(T.r), _milDm(), T.q) : NaN;
}
function _milErreichbar() {
  const U = _milUTropfen();
  return isFinite(U) && U <= 600;
}

function _milTropfenV() {
  const T = _mil.tropfen;
  if (!T) return 0;
  if (!_mil.feld) return -_milSinkV(T.r);            // negativ = sinkt
  return _milVFeld(T.r, T.q, _mil.U, _milDm());
}
// Schwebt: die Restdrift ist im Mikroskop nicht mehr auszumachen
function _milSchwebt() {
  return _mil.feld && Math.abs(_milTropfenV()) < 6e-7;
}

function _milRadius() {
  if (_mil.rVorgeben) return _mil.rVor * 1e-6;
  return _mil.rGem;
}

// ── Formatierung ───────────────────────────────────────
const _MIL_HOCH = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function _milExp(v, d) {
  if (!isFinite(v)) return '—';
  if (v === 0) return '0';
  const ex = Math.floor(Math.log10(Math.abs(v)));
  const m = v / Math.pow(10, ex);
  const hoch = String(ex).split('').map(c => _MIL_HOCH[c] || c).join('');
  return _fpmNum(m, d) + ' · 10' + hoch;
}

// ── Oberfläche ─────────────────────────────────────────
function _milHTML() {
  const stationen = ['1 · Wattebausch-Modellversuch', '2 · Millikanversuch', '3 · Die Elementarladung']
    .map((s, i) => `<button class="fpm-tab${i === _mil.station ? ' on' : ''}" id="milSt${i}" onclick="_milSetStation(${i})">${s}</button>`).join('');

  const presets = ['Nr. → q', 'n → q (Ursprungsgerade)', 'r³ → q'].map((p, i) =>
    `<button class="fpm-tab${i === _mil.preset ? ' on' : ''}" id="milTab${i}" onclick="_milSetPreset(${i})">${p}</button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim mil-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">🔬 Millikanversuch: das Schlüsselexperiment</h3>
    <canvas id="milTakt" width="1" height="1" style="display:none"></canvas>
    <div class="fpm-tabs">${stationen}</div>

    <!-- ══ Station 1 – Wattebauschversuch ══ -->
    <div id="milS0">
      <div class="fpm-grid">
        <div>
          <canvas id="milWB" width="420" height="300" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Aufbau</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Masse des Wattebauschs m: <b id="milWbMLbl">20 mg</b></span>
            <input type="range" id="milWbM" min="8" max="40" step="1" value="20"
              oninput="_milSetWbM(this.value)" style="width:100%;accent-color:#0f766e">
          </div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Plattenabstand d: <b id="milWbDLbl">8,0 cm</b></span>
            <input type="range" id="milWbD" min="5" max="12" step="0.5" value="8"
              oninput="_milSetWbD(this.value)" style="width:100%;accent-color:#0f766e">
          </div>
          <div class="fpm-note">Die Masse wird vorher mit einer Feinwaage bestimmt,
            der Plattenabstand mit dem Lineal.</div>
        </div>
        <div>
          <div class="fpm-label">Hochspannung regeln, bis der Wattebausch schwebt</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Spannung U: <b id="milWbULbl">0 V</b></span>
            <input type="range" id="milWbU" min="0" max="5000" step="5" value="0"
              oninput="_milSetWbU(this.value)" style="width:100%;accent-color:#0f766e">
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_milWbStep(-100)">◀ 100 V</button>
            <button class="sim-btn" onclick="_milWbStep(100)">100 V ▶</button>
            <button class="sim-btn" onclick="_milWbStep(-5)">◀ 5 V</button>
            <button class="sim-btn" onclick="_milWbStep(5)">5 V ▶</button>
            <button class="sim-btn" onclick="_milWbAuto()">einregeln</button>
          </div>
          <div class="mil-zustand" id="milWbZustand"></div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Spannung U</span><span class="fpm-ro-v" id="milWbUA">0</span><span class="fpm-ro-u">V</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Hubarbeit m·g·d</span><span class="fpm-ro-v" id="milWbWA">—</span><span class="fpm-ro-u">10⁻⁵ J</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Ladung q = m·g·d/U</span><span class="fpm-ro-v" id="milWbQA">—</span><span class="fpm-ro-u">nC</span></div>
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" onclick="_milWbTake()" id="milWbTakeBtn">✓ Messung übernehmen</button>
            <button class="sim-btn" onclick="_milWbLaden()">🧽 Neu aufladen</button>
            <button class="sim-btn" onclick="_milWbClear()">🗑 Leeren</button>
          </div>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>m (mg)</th><th>d (cm)</th><th>U (V)</th><th>q (nC)</th><th></th></tr></thead>
              <tbody id="milWbTbody"></tbody>
            </table>
            <div class="fpm-empty" id="milWbEmpty">Noch keine Messung.<br>Spannung erhöhen, bis der Bausch schwebt.</div>
          </div>
        </div>
      </div>
      <div class="fpm-label" style="margin-top:12px">Wie kommt man auf q = m·g·d/U? – abgestufte Hilfen</div>
      <div class="sim-btn-row">
        <button class="sim-btn" onclick="_milHilfe(1)">Hilfe 1</button>
        <button class="sim-btn" onclick="_milHilfe(2)">Hilfe 2</button>
        <button class="sim-btn" onclick="_milHilfe(3)">Hilfe 3</button>
        <button class="sim-btn" onclick="_milHilfe(4)">Lösung</button>
        <button class="sim-btn" onclick="_milHilfe(0)">zuklappen</button>
      </div>
      <div class="mil-hilfe" id="milHilfeBox"></div>
    </div>

    <!-- ══ Station 2 – Millikanversuch ══ -->
    <div id="milS1" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="milMik" width="420" height="300" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Blick durch das Beobachtungsmikroskop</div>
          <canvas id="milAuf" width="420" height="132" class="phys-anim-cv"></canvas>
          <div class="phys-ctrl" style="margin-top:8px">
            <span class="phys-ctrl-label">Plattenabstand d: <b id="milDLbl">6,00 mm</b></span>
            <input type="range" id="milD" min="4" max="8" step="0.25" value="6"
              oninput="_milSetD(this.value)" style="width:100%;accent-color:#0f766e">
          </div>
        </div>
        <div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" onclick="_milZerstaeuber()">💨 Zerstäuber betätigen</button>
            <button class="sim-btn" onclick="_milFeldAus()">Feld aus (Tröpfchen sinkt)</button>
          </div>

          <div class="mil-schritt"><span class="mil-schritt-n">1</span>
            <b>Radius bestimmen</b> – bei U = 0 sinkt das Tröpfchen gleichförmig.
            Miss die Fallzeit über eine Strecke der Mikrometerskala.</div>
          <label class="fpm-check"><input type="checkbox" id="milRVorCb" onchange="_milSetRVorgeben(this.checked)">
            Radius vorgeben statt messen (ohne Stokes'sches Gesetz)</label>
          <div class="phys-ctrl" id="milRVorWrap" style="display:none">
            <span class="phys-ctrl-label">vorgegebener Radius r: <b id="milRVorLbl">1,00 µm</b></span>
            <input type="range" id="milRVor" min="0.3" max="1.5" step="0.01" value="1"
              oninput="_milSetRVor(this.value)" style="width:100%;accent-color:#0f766e">
          </div>
          <div class="sim-btn-row" id="milUhrRow">
            <button class="sim-btn primary" id="milUhrBtn" onclick="_milUhr()">⏱ Stoppuhr starten</button>
            <button class="sim-btn" onclick="_milAutoFall()">automatisch messen</button>
          </div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Stoppuhr</span><span class="fpm-ro-v" id="milUhrA">0,00</span><span class="fpm-ro-u">s</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Fallstrecke s</span><span class="fpm-ro-v" id="milSA">—</span><span class="fpm-ro-u">mm</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Sinkgeschw. v = s/t</span><span class="fpm-ro-v" id="milVA">—</span><span class="fpm-ro-u">mm/s</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Radius r</span><span class="fpm-ro-v" id="milRA">—</span><span class="fpm-ro-u">µm</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Masse m</span><span class="fpm-ro-v" id="milMA">—</span><span class="fpm-ro-u">10⁻¹⁵ kg</span></div>
          </div>

          <div class="mil-schritt"><span class="mil-schritt-n">2</span>
            <b>Schwebespannung suchen</b> – Feld einschalten und U so regeln,
            dass das Tröpfchen stehen bleibt.</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Spannung U: <b id="milULbl">0 V</b></span>
            <input type="range" id="milU" min="0" max="600" step="1" value="0"
              oninput="_milSetU(this.value)" style="width:100%;accent-color:#0f766e">
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_milUStep(-10)">◀ 10 V</button>
            <button class="sim-btn" onclick="_milUStep(10)">10 V ▶</button>
            <button class="sim-btn" onclick="_milUStep(-1)">◀ 1 V</button>
            <button class="sim-btn" onclick="_milUStep(1)">1 V ▶</button>
            <button class="sim-btn" onclick="_milAutoSchweb()">einregeln</button>
          </div>
          <div class="mil-zustand" id="milZustand"></div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Ladung q = 4/3·π·r³·ρ·g·d/U</span><span class="fpm-ro-v" id="milQA">—</span><span class="fpm-ro-u">10⁻¹⁹ C</span></div>
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="milTakeBtn" onclick="_milTake()">✓ Tröpfchen übernehmen</button>
            <button class="sim-btn" onclick="_milDemo()">📋 Beispielmessreihe (20 Tröpfchen)</button>
            <button class="sim-btn" onclick="_milClear()">🗑 Tabelle leeren</button>
          </div>
          <label class="fpm-check"><input type="checkbox" onchange="_milSetRausch(this.checked)">
            Ablesefehler simulieren (so streuen echte Messwerte)</label>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>Nr.</th><th>r (µm)</th><th>m (10⁻¹⁵ kg)</th><th>U (V)</th><th>q (10⁻¹⁹ C)</th><th></th></tr></thead>
              <tbody id="milTbody"></tbody>
            </table>
            <div class="fpm-empty" id="milEmpty">Noch keine Tröpfchen vermessen.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Station 3 – Auswertung ══ -->
    <div id="milS2" style="display:none">
      <div class="fpm-label">Alle gemessenen Ladungen zusammen betrachten</div>
      <div class="fpm-tabs">${presets}</div>
      <div class="fpm-grid2">
        <canvas id="milPlot" width="470" height="340" class="phys-chart-cv"></canvas>
        <div>
          <div class="fpm-label" style="margin-top:0">Probierwert für die kleinste Ladung</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">e<sub>Probe</sub>: <b id="milEProbeLbl">1,600 · 10⁻¹⁹ C</b></span>
            <input type="range" id="milEProbe" min="1" max="3" step="0.001" value="1.6"
              oninput="_milSetEProbe(this.value)" style="width:100%;accent-color:#0f766e">
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" onclick="_milSuche()">🔍 besten Wert suchen</button>
          </div>
          <div class="mil-teiler" id="milTeiler"></div>
          <div class="fpm-fit" id="milFitBox"></div>
          <div class="fpm-label" style="margin-top:10px">Funktion plotten</div>
          <input type="text" id="milFn" class="fpm-input" placeholder="z. B. 1.602*x" spellcheck="false"
            oninput="_milSetFn(this.value)">
          <div class="fpm-err" id="milFnErr"></div>
          <div class="sim-btn-row" style="padding:2px 0 4px">
            <button class="sim-btn primary" onclick="_milTheorieFn()">ƒ Theoriefunktion</button>
            <button class="sim-btn" onclick="_milClearFn()">Feld leeren</button>
          </div>
          <div class="fpm-theo" id="milTheo"></div>
          <label class="fpm-check"><input type="checkbox" onchange="_milSet('reveal',this.checked)">
            Sollwert anzeigen</label>
        </div>
      </div>
      <div class="mil-fazit" id="milFazit"></div>
    </div>

    <div id="milErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>m · g · d = q · U</b> &nbsp;|&nbsp; <b>q = 4/3 · π · r³ · ρ · g · d / U</b>
      &nbsp;|&nbsp; <b>v = 2 · r² · ρ · g / (9 · η)</b>
    </p>
  </div>`;
}

function _milErklHTML() {
  return `<div class="dsp-erkl-kopf">Die Versuchsidee</div>
    <div class="dsp-erkl-text">
      Ein Elektron ist unvorstellbar winzig – wie soll man seine Ladung messen? Der Trick besteht darin,
      die Ladung <b>nicht direkt</b> zu messen, sondern über eine Kraft, die man sehr genau einstellen kann.
      Zwischen zwei waagerechten Platten wirkt auf einen geladenen Körper außer der Gewichtskraft noch eine
      elektrische Kraft. Regelt man die Spannung so, dass der Körper gerade <b>schwebt</b>, sind beide Kräfte
      gleich groß – und aus Masse, Plattenabstand und Spannung folgt die Ladung.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Vom Wattebausch zum Öltröpfchen</div>
    <div class="dsp-erkl-text">
      Am Wattebausch lässt sich das Verfahren gut sehen: Er ist groß genug, um ihn zu beobachten, und trägt
      eine Ladung im Nanocoulomb-Bereich – das sind noch Milliarden von Elementarladungen. Erst wenn man auf
      <b>winzige Öltröpfchen</b> übergeht, sinkt die Ladung so weit, dass nur noch <i>einige wenige</i>
      Elementarladungen auf dem Tröpfchen sitzen. Genau dann wird sichtbar, dass die Ladung nicht beliebige
      Werte annimmt.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum der Radius das Problem ist</div>
    <div class="dsp-erkl-text">
      Masse, Plattenabstand und Spannung sind leicht messbar – der Tröpfchenradius nicht. Im Mikroskop sieht
      man nämlich <b>nicht das Tröpfchen selbst</b>, sondern nur ein „Streuscheibchen“ seines Lichts; eine
      Mikrometerskala nützt hier nichts. Der Ausweg: Schaltet man das Feld ab, fällt das Tröpfchen und wird
      dabei sofort so stark von der Luft gebremst, dass es <b>gleichförmig</b> sinkt. Aus dieser Sinkgeschwindigkeit
      folgt mit dem Stokes'schen Reibungsgesetz F<sub>R</sub> = 6·π·η·r·v der Radius:
      <b>v = 2·r²·ρ·g / (9·η)</b>. Wer das Stokes'sche Gesetz nicht voraussetzen will, kann den Radius auch
      vorgeben lassen – der Kernlehrplan verlangt es nicht.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Das Ergebnis</div>
    <div class="dsp-erkl-text">
      Vermisst man viele Tröpfchen, liegen die Ladungen nicht regellos verstreut, sondern <b>auf Stufen</b>.
      Jede gemessene Ladung ist ein ganzzahliges Vielfaches ein und desselben kleinsten Betrages
      <b>e ≈ 1,602 · 10⁻¹⁹ C</b>. Elektrische Ladung ist also <b>gequantelt</b>. Robert A. Millikan erhielt
      dafür 1923 den Nobelpreis. Beachte: Der Auftrieb des Tröpfchens in der Luft bleibt hier bewusst
      unberücksichtigt – das ist eine zulässige Vereinfachung, weil Öl rund 700-mal dichter als Luft ist.
    </div>
    <div class="dsp-erkl-warn">⚠ Im echten Versuch: Hochspannung. Warnschild aufstellen, Platten nur bei
      abgeschalteter Spannung berühren, Bestimmungen der RiSU einhalten.</div>`;
}

// ── Stationen ──────────────────────────────────────────
function _milSetStation(i) {
  _mil.station = i;
  for (let k = 0; k < 3; k++) {
    document.getElementById('milSt' + k)?.classList.toggle('on', k === i);
    const d = document.getElementById('milS' + k);
    if (d) d.style.display = k === i ? 'block' : 'none';
  }
  _milUpdate();
  if (i === 2) _milDrawPlot();
}
function _milSet(key, val) { _mil[key] = val; _milDrawPlot(); }

// ── Bedienung Station 1 ────────────────────────────────
function _milSetWbM(v) {
  _mil.wbM = +v;
  const el = document.getElementById('milWbMLbl'); if (el) el.textContent = Math.round(+v) + ' mg';
  _milWbUpdate();
}
function _milSetWbD(v) {
  _mil.wbD = +v;
  const el = document.getElementById('milWbDLbl'); if (el) el.textContent = _fpmNum(+v, 1) + ' cm';
  _milWbUpdate();
}
function _milSetWbU(v) {
  _mil.wbU = Math.max(0, Math.min(5000, +v));
  const sl = document.getElementById('milWbU'); if (sl) sl.value = String(_mil.wbU);
  const el = document.getElementById('milWbULbl'); if (el) el.textContent = Math.round(_mil.wbU) + ' V';
  _milWbUpdate();
}
function _milWbStep(dv) { _milSetWbU(Math.round(_mil.wbU + dv)); }
// Regelt die Hochspannung so ein, wie es ein geduldiger Experimentator taete
function _milWbAuto() { _milSetWbU(Math.round(_milWbUSchweb() / 5) * 5); }

function _milWbUpdate() {
  if (!_mil) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const m = _milWbMasse(), d = _milWbD(), U = _mil.wbU;
  const W = m * _MIL_G * d;
  set('milWbUA', String(Math.round(U)));
  set('milWbWA', _fpmNum(W / 1e-5, 3));
  set('milWbQA', U > 0 ? _fpmNum(_milLadung(m, d, U) / 1e-9, 2) : '—');

  const z = document.getElementById('milWbZustand');
  const schwebt = _milWbSchwebt();
  if (z) {
    const a = _milWbA();
    z.className = 'mil-zustand ' + (U === 0 ? '' : schwebt ? 'ok' : 'aus');
    z.innerHTML = U === 0
      ? 'Ohne Feld liegt der Wattebausch unten auf der Platte.'
      : schwebt
        ? '<b>Der Wattebausch schwebt.</b> Jetzt ist die elektrische Kraft genauso groß wie die Gewichtskraft.'
        : a > 0
          ? 'Der Wattebausch <b>steigt</b> – die elektrische Kraft ist zu groß. Spannung verringern.'
          : 'Der Wattebausch <b>sinkt</b> – die elektrische Kraft ist zu klein. Spannung erhöhen.';
  }
  const tb = document.getElementById('milWbTakeBtn');
  if (tb) tb.disabled = !schwebt;
}

function _milWbTake() {
  if (!_milWbSchwebt()) return;
  const m = _milWbMasse(), d = _milWbD();
  _mil.wbRows.push({ id: _mil.wbNextId++, m: _mil.wbM, d: _mil.wbD, U: Math.round(_mil.wbU),
                     q: _milLadung(m, d, _mil.wbU) });
  _milWbRenderTable();
}
function _milWbDelRow(id) { _mil.wbRows = _mil.wbRows.filter(r => r.id !== id); _milWbRenderTable(); }
function _milWbClear() {
  if (_mil.wbRows.length && !confirm('Alle ' + _mil.wbRows.length + ' Messungen löschen?')) return;
  _mil.wbRows = []; _milWbRenderTable();
}
function _milWbRenderTable() {
  const tb = document.getElementById('milWbTbody'); if (!tb) return;
  const empty = document.getElementById('milWbEmpty');
  if (empty) empty.style.display = _mil.wbRows.length ? 'none' : 'block';
  tb.innerHTML = _mil.wbRows.map(r =>
    `<tr><td>${r.m}</td><td>${_fpmNum(r.d, 1)}</td><td>${r.U}</td>
       <td><b>${_fpmNum(r.q / 1e-9, 2)}</b></td>
       <td class="fpm-del" onclick="_milWbDelRow(${r.id})" title="löschen">✕</td></tr>`).join('');
}

// Die abgestuften Hilfen der Handreichung (Seite 6)
function _milHilfe(n) {
  _mil.hilfe = n;
  const el = document.getElementById('milHilfeBox'); if (!el) return;
  const texte = {
    0: '',
    1: `<b>Hilfe 1:</b> Im Schwebezustand heben sich die beiden Kräfte auf:
        F<sub>elektrisch</sub> = F<sub>Gravitation</sub>. Du kennst die Gewichtskraft
        F<sub>G</sub> = m·g. Über die elektrische Kraft weißt du zunächst nur, dass sie von
        der Ladung q und von der Spannung U abhängt. Versuche deshalb, nicht mit Kräften,
        sondern mit <b>Energien</b> weiterzukommen.`,
    2: `<b>Hilfe 2:</b> Der Term <b>m · g · d</b> entspricht der Hubarbeit, die nötig wäre,
        um den Wattebausch der Masse m (ohne ihn zu beschleunigen) um die Höhe d – also von der
        unteren zur oberen Platte – anzuheben.`,
    3: `<b>Hilfe 3:</b> Überlege, wer oder was in diesem Versuch diese Hubarbeit aufbringen könnte,
        ohne den Wattebausch mit der eigenen Muskelkraft anzuheben. Erinnere dich daran, wie die
        elektrische Spannung definiert ist: als Energie pro Ladung, U = W/q.`,
    4: `<b>Lösung:</b> Die Spannungsquelle verrichtet die Arbeit. Läuft die Ladung q durch die
        Spannung U, wird dabei die Energie <b>W = q · U</b> umgesetzt. Genau diese Energie wird
        gebraucht, um den Bausch von der unteren zur oberen Platte zu heben – also
        <b>m · g · d = q · U</b> und damit <b>q = m · g · d / U</b>.
        Beachte: Wir sind ohne die Feldstärke E und ohne die Beziehung E = U/d ausgekommen.`
  };
  el.innerHTML = texte[n] || '';
  el.style.display = n ? 'block' : 'none';
}

// ── Bedienung Station 2 ────────────────────────────────
function _milSetD(v) {
  _mil.d = +v;
  const el = document.getElementById('milDLbl'); if (el) el.textContent = _fpmNum(+v, 2) + ' mm';
  _milUpdate();
}
function _milSetU(v) {
  _mil.U = Math.max(0, Math.min(600, +v));
  _mil.feld = _mil.U > 0;
  const sl = document.getElementById('milU'); if (sl) sl.value = String(_mil.U);
  const el = document.getElementById('milULbl'); if (el) el.textContent = Math.round(_mil.U) + ' V';
  _milUpdate();
}
function _milUStep(dv) { _milSetU(Math.round(_mil.U + dv)); }
function _milFeldAus() { _milSetU(0); }
function _milSetRausch(b) { _mil.rausch = b; }
function _milSetRVorgeben(b) {
  _mil.rVorgeben = b;
  const w = document.getElementById('milRVorWrap'); if (w) w.style.display = b ? 'block' : 'none';
  const u = document.getElementById('milUhrRow'); if (u) u.style.display = b ? 'none' : 'flex';
  _milUpdate();
}
function _milSetRVor(v) {
  _mil.rVor = +v;
  const el = document.getElementById('milRVorLbl'); if (el) el.textContent = _fpmNum(+v, 2) + ' µm';
  _milUpdate();
}

// Stoppuhr: misst die Zeit zwischen zwei selbst gewählten Marken.
// Die Fallstrecke ist das, was auf der Mikrometerskala tatsächlich abzulesen ist.
function _milUhr() {
  if (!_mil.tropfen || _mil.feld) return;
  if (!_mil.uhrLauf) {
    _mil.uhrLauf = true; _mil.uhrT = 0; _mil.uhrY0 = _mil.y; _mil.uhrFertig = false;
  } else {
    _mil.uhrLauf = false;
    const s = Math.abs(_mil.y - _mil.uhrY0);
    _milAusFall(Math.round(s / _MIL_ABLESUNG) * _MIL_ABLESUNG, _mil.uhrT);
  }
  const b = document.getElementById('milUhrBtn');
  if (b) b.textContent = _mil.uhrLauf ? '⏱ Stoppuhr anhalten' : '⏱ Stoppuhr starten';
  _milUpdate();
}
// Saubere Messung über eine feste Strecke – ohne Reaktionszeit des Beobachters
function _milAutoFall() {
  const T = _mil.tropfen; if (!T) return;
  _milSetU(0);
  const s = 0.60;                                   // mm
  let t = s / (_milSinkV(T.r) * 1000);
  if (_mil.rausch) t *= 1 + (Math.random() - 0.5) * 0.05;
  _mil.uhrLauf = false;
  const b = document.getElementById('milUhrBtn'); if (b) b.textContent = '⏱ Stoppuhr starten';
  _milAusFall(s, Math.round(t * 100) / 100);
  _mil.y = 0.10;
  _milUpdate();
}
function _milAusFall(s, t) {
  if (!(s > 0) || !(t > 0)) return;
  _mil.uhrS = s; _mil.uhrT = t; _mil.uhrFertig = true;
  const v = s / 1000 / t;                            // m/s
  _mil.vGem = v;
  _mil.rGem = _milRausV(v);
}

// Regelt die Spannung so ein, wie es ein geduldiger Experimentator täte
function _milAutoSchweb() {
  if (!_mil.tropfen) return;
  // Nicht heimlich auf 600 V begrenzen und so eine falsche Ladung aufnehmen
  if (!_milErreichbar()) { _milUpdate(); return; }
  let U = _milUTropfen();
  if (_mil.rausch) U *= 1 + (Math.random() - 0.5) * 0.02;
  _milSetU(Math.round(U));
}

function _milQGemessen() {
  const r = _milRadius();
  if (!r || !(_mil.U > 0) || !_milSchwebt()) return NaN;
  return _milMasse(r) * _MIL_G * _milDm() / _mil.U;
}

function _milTake() {
  const q = _milQGemessen();
  if (!isFinite(q)) return;
  const r = _milRadius();
  _mil.rows.push({ id: _mil.nextId++, r, m: _milMasse(r), U: _mil.U, q, d: _mil.d });
  _milRenderTable();
  _milDrawPlot();
  _mil.tropfen = null; _mil.phase = 'leer';
  _milSetU(0);
}
function _milDelRow(id) { _mil.rows = _mil.rows.filter(r => r.id !== id); _milRenderTable(); _milDrawPlot(); }
function _milClear() {
  if (_mil.rows.length && !confirm('Alle ' + _mil.rows.length + ' Messwerte löschen?')) return;
  _mil.rows = []; _milRenderTable(); _milDrawPlot();
}
// Arbeitsteilige Messreihe, wie sie eine ganze Lerngruppe zusammenträgt
function _milDemo() {
  const d = _milDm();
  let versuche = 0;
  while (_mil.rows.length < 20 && versuche < 4000) {
    versuche++;
    const r = (0.50 + Math.random() * 0.60) * 1e-6;
    const n = 1 + Math.floor(Math.random() * 8);
    const q = n * _MIL_E;
    const U = _milUSchweb(_milMasse(r), d, q);
    if (U < 120 || U > 520) continue;
    // So, wie es eine Gruppe wirklich abliest: Spannung ganzzahlig, Fallzeit auf 1/100 s
    const Ug = Math.round(_mil.rausch ? U * (1 + (Math.random() - 0.5) * 0.02) : U);
    const s = 0.60;
    let t = s / (_milSinkV(r) * 1000);
    if (_mil.rausch) t *= 1 + (Math.random() - 0.5) * 0.05;
    t = Math.round(t * 100) / 100;
    const rg = _milRausV(s / 1000 / t);
    _mil.rows.push({ id: _mil.nextId++, r: rg, m: _milMasse(rg), U: Ug,
                     q: _milMasse(rg) * _MIL_G * d / Ug, d: _mil.d });
  }
  _milRenderTable();
  _milDrawPlot();
}
function _milRenderTable() {
  const tb = document.getElementById('milTbody'); if (!tb) return;
  const empty = document.getElementById('milEmpty');
  if (empty) empty.style.display = _mil.rows.length ? 'none' : 'block';
  tb.innerHTML = _mil.rows.map((r, i) =>
    `<tr><td>${i + 1}</td><td>${_fpmNum(r.r * 1e6, 3)}</td><td>${_fpmNum(r.m / 1e-15, 3)}</td>
       <td>${r.U}</td><td><b>${_fpmNum(r.q / 1e-19, 3)}</b></td>
       <td class="fpm-del" onclick="_milDelRow(${r.id})" title="löschen">✕</td></tr>`).join('');
}

// ── Gemeinsame Aktualisierung ──────────────────────────
function _milUpdate() {
  if (!_mil) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  _milWbUpdate();

  set('milUhrA', _fpmNum(_mil.uhrT, 2));
  set('milSA', _mil.uhrFertig ? _fpmNum(_mil.uhrS, 2) : '—');
  set('milVA', _mil.vGem ? _fpmNum(_mil.vGem * 1000, 4) : '—');
  const r = _milRadius();
  set('milRA', r ? _fpmNum(r * 1e6, 3) : '—');
  set('milMA', r ? _fpmNum(_milMasse(r) / 1e-15, 3) : '—');

  const q = _milQGemessen();
  set('milQA', isFinite(q) ? _fpmNum(q / 1e-19, 3) : '—');

  const z = document.getElementById('milZustand');
  if (z) {
    const T = _mil.tropfen;
    if (!T) {
      z.className = 'mil-zustand';
      z.innerHTML = 'Kein Tröpfchen im Blickfeld. Betätige den Zerstäuber.';
    } else if (!_milErreichbar()) {
      z.className = 'mil-zustand aus';
      z.innerHTML = 'Dieses Tröpfchen ist zu schwer für die verfügbare Spannung: Zum Schweben wären '
        + Math.round(_milUTropfen()) + ' V nötig, das Netzgerät liefert nur 600 V. '
        + '<b>Verkleinere den Plattenabstand</b> oder nimm ein anderes Tröpfchen.';
    } else if (!_mil.feld) {
      z.className = 'mil-zustand';
      z.innerHTML = 'Ohne Feld sinkt das Tröpfchen gleichförmig – der Radius lässt sich messen.';
    } else if (_milSchwebt()) {
      z.className = 'mil-zustand ok';
      z.innerHTML = r
        ? '<b>Das Tröpfchen schwebt.</b> Jetzt kannst du die Ladung berechnen und übernehmen.'
        : '<b>Das Tröpfchen schwebt</b> – aber der Radius fehlt noch. Schalte das Feld ab und miss die Fallzeit.';
    } else {
      z.className = 'mil-zustand aus';
      z.innerHTML = _milTropfenV() > 0
        ? 'Das Tröpfchen <b>steigt</b> – Spannung verringern.'
        : 'Das Tröpfchen <b>sinkt</b> – Spannung erhöhen.';
    }
  }
  const tb = document.getElementById('milTakeBtn');
  if (tb) tb.disabled = !isFinite(q);
}

// ── Zeichnung Station 1 ────────────────────────────────
function _milRenderWB(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  const xL = 62, xR = 300;                  // Plattenränder
  const yO = 54, yU = 244;                  // obere/untere Platte

  // Platten
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(xL, yO - 8, xR - xL, 8);
  ctx.fillRect(xL, yU, xR - xL, 8);
  ctx.fillStyle = '#dc2626'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
  for (let i = 0; i < 5; i++) ctx.fillText('+', xL + 24 + i * 48, yO - 12);
  ctx.fillStyle = '#0284c7';
  for (let i = 0; i < 5; i++) ctx.fillText('−', xL + 24 + i * 48, yU + 20);

  // Feldlinien nur, wenn Spannung anliegt
  if (_mil.wbU > 0) {
    ctx.strokeStyle = 'rgba(15,118,110,.28)'; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const x = xL + 20 + i * 43;
      ctx.beginPath(); ctx.moveTo(x, yO); ctx.lineTo(x, yU); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 4, yU - 16); ctx.lineTo(x, yU - 8); ctx.lineTo(x + 4, yU - 16); ctx.stroke();
    }
  }

  // Wattebausch: wbY ist die Auslenkung nach oben in Anteilen des Plattenabstands
  const yB = yU - 18 - _mil.wbY * (yU - yO - 36);
  const xB = (xL + xR) / 2;
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath(); ctx.arc(xB, yB, 15, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  for (let i = 0; i < 5; i++) {
    const a = i * 1.257;
    ctx.beginPath(); ctx.arc(xB + 8 * Math.cos(a), yB + 8 * Math.sin(a), 6, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.fillStyle = '#0284c7'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('−q', xB, yB + 3);

  // Haltefaden
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(xB, yB - 15); ctx.lineTo(xB, yO); ctx.stroke();

  // Kräftepfeile
  const pfeil = (x, y, len, col, txt) => {
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + len); ctx.stroke();
    const s = Math.sign(len);
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x - 4, y + len - s * 6); ctx.lineTo(x + 4, y + len - s * 6);
    ctx.closePath(); ctx.fill();
    ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(txt, x + 7, y + len / 2 + 3);
  };
  const m = _milWbMasse(), d = _milWbD();
  const FG = m * _MIL_G, FE = _mil.wbQ * _mil.wbU / d;
  const skala = 46 / Math.max(FG, 1e-12);
  pfeil(xB + 22, yB, Math.min(60, FG * skala), '#dc2626', 'F_G');
  if (_mil.wbU > 0) pfeil(xB - 22, yB, -Math.min(60, FE * skala), '#0f766e', 'F_el');

  // Plattenabstand bemaßen
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(xL - 16, yO); ctx.lineTo(xL - 16, yU); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.save(); ctx.translate(xL - 26, (yO + yU) / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('d = ' + _fpmNum(_mil.wbD, 1) + ' cm', 0, 0); ctx.restore();

  // Hochspannungsquelle und Voltmeter
  const hx = 356;
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(xR, yO - 4); ctx.lineTo(hx, yO - 4); ctx.lineTo(hx, 108); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xR, yU + 4); ctx.lineTo(hx, yU + 4); ctx.lineTo(hx, 152); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(hx, 130, 22, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#334155'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('HV', hx, 126);
  ctx.fillStyle = '#0f766e'; ctx.font = '700 11px sans-serif';
  ctx.fillText(Math.round(_mil.wbU) + ' V', hx, 140);

  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Wattebausch, m = ' + Math.round(_mil.wbM) + ' mg', 10, H - 10);
  ctx.textAlign = 'right';
  const s = _milWbSchwebt() && _mil.wbU > 0;
  ctx.fillStyle = s ? '#16a34a' : '#94a3b8'; ctx.font = '700 10px sans-serif';
  ctx.fillText(s ? 'schwebt' : (_mil.wbU === 0 ? 'liegt unten' : (_milWbA() > 0 ? 'steigt' : 'sinkt')), W - 10, H - 10);
  ctx.textAlign = 'left';
}

// ── Zeichnung Station 2 ────────────────────────────────
const _MIL_SKALA = 1.40;      // sichtbarer Bereich der Mikrometerskala in mm

function _milRenderMik(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);

  // Dunkelfeld – im Mikroskop sieht man nur die Streuscheibchen
  ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 6;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.clip();
  ctx.fillStyle = '#111c30'; ctx.fillRect(0, 0, W, H);

  const yTop = 24, yBot = H - 24;
  const Y = mm => yTop + mm / _MIL_SKALA * (yBot - yTop);

  // Mikrometerskala im Okular
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(120, yTop); ctx.lineTo(120, yBot); ctx.stroke();
  ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
  for (let k = 0; k <= 14; k++) {
    const mm = k * 0.1, y = Y(mm);
    const lang = k % 5 === 0;
    ctx.strokeStyle = lang ? '#94a3b8' : '#475569';
    ctx.lineWidth = lang ? 1.4 : 1;
    ctx.beginPath(); ctx.moveTo(120, y); ctx.lineTo(120 + (lang ? 16 : 9), y); ctx.stroke();
    if (lang) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(_fpmNum(mm, 1), 116, y + 3);
    }
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif';
  ctx.fillText('Mikrometerskala in mm', 128, yTop - 8);

  // Startmarke der Stoppuhr
  if (_mil.uhrLauf) {
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(120, Y(_mil.uhrY0)); ctx.lineTo(W - 20, Y(_mil.uhrY0)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#22c55e'; ctx.font = '700 8px sans-serif';
    ctx.fillText('Start', W - 46, Y(_mil.uhrY0) - 4);
  }

  // Das Tröpfchen – ein helles Streuscheibchen, nicht das Tröpfchen selbst
  const T = _mil.tropfen;
  if (T) {
    const y = Y(_mil.y), x = 236;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 13);
    g.addColorStop(0, 'rgba(255,255,255,.95)');
    g.addColorStop(0.35, 'rgba(186,230,253,.55)');
    g.addColorStop(1, 'rgba(186,230,253,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, 13, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 2 * Math.PI); ctx.fill();

    // Bewegungsrichtung andeuten
    const v = _milTropfenV();
    if (Math.abs(v) > 6e-7) {
      const auf = v > 0;
      ctx.strokeStyle = auf ? '#38bdf8' : '#fbbf24'; ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x + 26, y); ctx.lineTo(x + 26, y + (auf ? -16 : 16)); ctx.stroke();
      ctx.fillStyle = auf ? '#38bdf8' : '#fbbf24';
      ctx.beginPath();
      const ye = y + (auf ? -16 : 16), s = auf ? -1 : 1;
      ctx.moveTo(x + 26, ye); ctx.lineTo(x + 22, ye - s * 5); ctx.lineTo(x + 30, ye - s * 5);
      ctx.closePath(); ctx.fill();
    }
  } else {
    ctx.fillStyle = '#475569'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Blickfeld leer – Zerstäuber betätigen', cx, cy);
    ctx.textAlign = 'left';
  }
  ctx.restore();

  // Okularrand
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(cx, cy, R + 3, 0, 2 * Math.PI); ctx.stroke();

  // Stoppuhr
  ctx.fillStyle = _mil.uhrLauf ? '#22c55e' : '#94a3b8';
  ctx.font = '700 15px ui-monospace, monospace'; ctx.textAlign = 'left';
  ctx.fillText(_fpmNum(_mil.uhrT, 2) + ' s', 12, 22);
  ctx.font = '700 10px sans-serif'; ctx.fillStyle = '#64748b';
  ctx.textAlign = 'right';
  ctx.fillText(_mil.feld ? 'Feld an · ' + Math.round(_mil.U) + ' V' : 'Feld aus', W - 12, 22);
  ctx.textAlign = 'left';
}

function _milRenderAuf(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  const xL = 108, xR = 262, yO = 44, yU = 92;

  // Platten mit Bohrung in der oberen
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(xL, yO - 6, 62, 6);
  ctx.fillRect(xL + 80, yO - 6, xR - xL - 80, 6);
  ctx.fillRect(xL, yU, xR - xL, 6);
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Bohrung', xL + 71, yO - 10);

  // Zerstäuber
  ctx.fillStyle = '#475569';
  ctx.fillRect(xL + 56, 12, 30, 14);
  ctx.beginPath(); ctx.moveTo(xL + 66, 26); ctx.lineTo(xL + 76, 26); ctx.lineTo(xL + 73, yO - 8);
  ctx.lineTo(xL + 69, yO - 8); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('Zerstäuber', xL + 52, 22);

  // Tröpfchen zwischen den Platten
  ctx.fillStyle = '#e0f2fe';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(xL + 30 + i * 28, yO + 14 + (i % 3) * 12, 1.8, 0, 2 * Math.PI); ctx.fill();
  }

  // Lampe links
  ctx.fillStyle = '#334155'; ctx.fillRect(18, yO + 8, 22, 30);
  ctx.fillStyle = '#fde68a'; ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.moveTo(40, yO + 12); ctx.lineTo(xL, yO + 2);
  ctx.lineTo(xL, yU - 2); ctx.lineTo(40, yO + 34); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Lampe', 29, yU + 18);

  // Mikroskop rechts
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(xR + 12, yO + 10); ctx.lineTo(W - 30, yO + 2);
  ctx.lineTo(W - 30, yU + 6); ctx.lineTo(xR + 12, yU - 2); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Beobachtungs-', W - 55, yU + 18);
  ctx.fillText('mikroskop', W - 55, yU + 28);

  // Bemaßung des Plattenabstands
  ctx.strokeStyle = '#0f766e'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(xL - 14, yO); ctx.lineTo(xL - 14, yU); ctx.stroke();
  ctx.fillStyle = '#0f766e'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('d = ' + _fpmNum(_mil.d, 2) + ' mm', xL + 44, yU + 20);

  // Polung
  ctx.fillStyle = '#dc2626'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('+', xR + 4, yO - 1);
  ctx.fillStyle = '#0284c7';
  ctx.fillText('−', xR + 4, yU + 12);
  ctx.fillStyle = '#94a3b8'; ctx.font = '8px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Die Tröpfchen sind negativ geladen und werden nach oben gezogen.', 10, H - 8);
}

// ── Auswertungsdiagramm ────────────────────────────────
const _MIL_PRESETS = [
  { xl: 'Nummer der Messung', yl: 'q in 10⁻¹⁹ C',
    x: (r, i) => i + 1, y: r => r.q / 1e-19,
    keinFit: true, stufen: true,
    note: 'Die Ladungen liegen nicht regellos verstreut, sondern auf waagerechten Stufen. Der Abstand zwischen zwei Stufen ist die gesuchte Elementarladung.',
    typ: 'keine Funktion – ein Streudiagramm',
    form: 'q = n · e   mit n = 1, 2, 3, …',
    param: () => 'Stufenabstand e_Probe = ' + _fpmNum(_mil.eProbe, 3) + ' · 10⁻¹⁹ C',
    term: () => _dspZahl(_mil.eProbe),
    deutung: 'Die Reihenfolge der Messungen ist physikalisch bedeutungslos – wichtig ist allein, welche Werte überhaupt vorkommen und welche nicht. Zwischen den Stufen liegt nichts.' },

  { xl: 'n (Ladungszahl)', yl: 'q in 10⁻¹⁹ C',
    x: r => Math.round(r.q / (_mil.eProbe * 1e-19)), y: r => r.q / 1e-19,
    origin: true,
    note: 'Trägt man jede Ladung über ihrer Ladungszahl n auf, liegen alle Punkte auf einer Ursprungsgeraden. Ihre Steigung ist die Elementarladung.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)',
    form: 'q(n) = e · n',
    param: () => 'gesucht: die Steigung e',
    term: () => _dspZahl(_mil.eProbe) + '*x',
    deutung: 'Das n bekommst du nicht geschenkt – es folgt aus dem Probierwert e_Probe. Ist der falsch gewählt, werden die n falsch zugeordnet und die Punkte liegen nicht mehr auf einer Geraden. Genau daran erkennst du den richtigen Wert.' },

  { xl: 'r³ in 10⁻¹⁸ m³', yl: 'q in 10⁻¹⁹ C',
    x: r => r.r * r.r * r.r / 1e-18, y: r => r.q / 1e-19,
    gegenprobe: true,
    note: 'Gegenprobe: Hängt die Ladung von der Größe des Tröpfchens ab? Die Punkte streuen breit – und liegen bei jedem Radius auf denselben Stufen.',
    typ: 'allenfalls ein schwacher Trend, kein Gesetz',
    form: 'q = n · e   – unabhängig von r',
    param: () => 'r³ ist proportional zur Masse des Tröpfchens',
    term: () => _dspZahl(_mil.eProbe) + '*x',
    deutung: 'Ein schwacher Trend nach oben ist zu sehen, aber er ist kein Naturgesetz, sondern eine Folge der Auswahl: Ein großes Tröpfchen mit nur einer Elementarladung ließe sich mit 600 V gar nicht zum Schweben bringen, es taucht in der Messreihe deshalb nie auf. Entscheidend ist etwas anderes: Bei jedem Radius kommen immer nur dieselben gestuften Ladungswerte vor. Die Ladung ist also keine Eigenschaft der Tröpfchengröße.' }
];

function _milDrawPlot() {
  const cv = document.getElementById('milPlot');
  if (!cv || !_mil) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _MIL_PRESETS[_mil.preset];
  const padL = 58, padR = 16, padT = 14, padB = 42;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const pts = _mil.rows.map((r, i) => ({ x: P.x(r, i), y: P.y(r, i), r }))
    .filter(p => isFinite(p.x) && isFinite(p.y));
  const xmax = Math.max(1e-9, pts.length ? Math.max(...pts.map(p => p.x)) * 1.12 : 10);
  const ymax = Math.max(1e-9, pts.length ? Math.max(...pts.map(p => p.y)) * 1.15 : 14);

  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - v / ymax * (y0 - y1);

  const xt = _fpmTicks(xmax, 6);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 14);
  });
  const yt = _fpmTicks(ymax, 5);
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 6, Y(v) + 3);
  });

  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 30);
  ctx.save(); ctx.translate(14, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'right'; ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  // Vielfachenlinien des Probierwerts
  if (P.stufen) {
    for (let n = 1; n * _mil.eProbe <= ymax; n++) {
      const yv = n * _mil.eProbe;
      ctx.strokeStyle = 'rgba(15,118,110,.35)'; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x0, Y(yv)); ctx.lineTo(x1, Y(yv)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#0f766e'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(n + '·e', x1 - 22, Y(yv) - 3);
    }
  }

  if (!pts.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte – vermiss zuerst Tröpfchen in Station 2', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('milFitBox');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    _milRenderTeiler(); _milRenderFazit();
    return;
  }

  if (_mil.fn) {
    ctx.strokeStyle = '#db2777'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let started = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _mil.fn((px - x0) / (x1 - x0) * xmax); } catch (err) { yv = NaN; }
      if (!isFinite(yv)) { started = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { started = false; continue; }
      started ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), started = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  let fit = null;
  if (!P.keinFit && pts.length >= 2) {
    fit = P.origin ? _fpmFitOrigin(pts) : _fpmFitLinear(pts);
    if (fit) {
      ctx.strokeStyle = P.gegenprobe ? '#db2777' : '#0f766e'; ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(X(0), Y(fit.b || 0));
      ctx.lineTo(X(xmax), Y(fit.k * xmax + (fit.b || 0)));
      ctx.stroke();
    }
  }

  // Messpunkte – Farbe nach Abstand vom nächsten Vielfachen des Probierwerts
  pts.forEach(p => {
    const nn = p.r.q / (_mil.eProbe * 1e-19);
    const ab = Math.abs(nn - Math.round(nn));
    ctx.fillStyle = ab < 0.12 ? '#0f766e' : ab < 0.25 ? '#f59e0b' : '#db2777';
    ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 4, 0, 2 * Math.PI); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke();
  });

  _milRenderFit(fit, P, pts.length);
  _milRenderTeiler();
  _milRenderFazit();
}

function _milRenderFit(fit, P, n) {
  const el = document.getElementById('milFitBox'); if (!el) return;
  if (P.keinFit) {
    el.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    return;
  }
  if (!fit) {
    el.innerHTML = '<div class="fpm-note">Mindestens zwei Messwerte nötig.<br>' + P.note + '</div>';
    return;
  }
  const e = fit.k * 1e-19;
  const abw = Math.abs(e - _MIL_E) / _MIL_E * 100;
  const cls = abw < 1 ? 'ok' : abw < 5 ? 'mid' : 'no';
  let html = `<div class="fpm-fitline">
     <span class="fpm-fitmeta">${n} Messwerte</span>
     <span class="fpm-fiteq">y = ${_fpmNum(fit.k, 4)}·x${P.origin ? '' : (fit.b >= 0 ? ' + ' : ' − ') + _fpmNum(Math.abs(fit.b), 3)}</span>
     <span class="fpm-fitmeta">R² = ${_fpmNum(fit.r2, 5)}</span>`;
  if (!P.gegenprobe) {
    html += `<span class="fpm-fiteq" style="color:#0f766e">e = ${_milExp(e, 4)} C</span>`;
    if (_mil.reveal) html += `<span class="fpm-badge ${cls}">Sollwert 1,602 · 10⁻¹⁹ C · Abweichung ${_fpmNum(abw, 2)} %</span>`;
  }
  html += '</div>';
  if (P.gegenprobe) {
    html += `<div class="fpm-note" style="color:#b45309;border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">
      <b>Vorsicht mit dieser Geraden.</b> R² liegt meist um 0,5 – die Punkte streuen viel zu breit für einen
      echten Zusammenhang. Der schwache Anstieg entsteht dadurch, dass sich große Tröpfchen mit sehr
      kleiner Ladung überhaupt nicht zum Schweben bringen lassen und deshalb in keiner Messreihe auftauchen.
      Ein schöner Anlass, über Auswahleffekte in Messreihen zu sprechen.</div>`;
  }
  el.innerHTML = html + '<div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">' + P.note + '</div>';
}

// ── Probierwert und Teilbarkeit ────────────────────────
function _milSetEProbe(v) {
  _mil.eProbe = +v;
  const el = document.getElementById('milEProbeLbl');
  if (el) el.innerHTML = _fpmNum(+v, 3) + ' · 10⁻¹⁹ C';
  _milRefreshTheorie();
  _milDrawPlot();
}
// Mittlerer quadratischer Abstand der Quotienten q/e von ganzen Zahlen
function _milGuete(e19) {
  if (!_mil.rows.length) return NaN;
  let s = 0;
  _mil.rows.forEach(r => {
    const x = r.q / (e19 * 1e-19);
    const d = x - Math.round(x);
    s += d * d;
  });
  return Math.sqrt(s / _mil.rows.length);
}
// Sucht den Probierwert mit der besten Teilbarkeit. Die Suche startet erst
// bei 1,0 · 10⁻¹⁹ C: jeder genuegend kleine Wert teilt trivialerweise alles.
function _milSuche() {
  if (_mil.rows.length < 5) {
    const t = document.getElementById('milTeiler');
    if (t) t.innerHTML = '<div class="mil-teiler-warn">Für eine sinnvolle Suche brauchst du mindestens 5 vermessene Tröpfchen. Nimm weitere auf oder lade die Beispielmessreihe.</div>';
    return;
  }
  let best = null;
  for (let e = 1.000; e <= 3.000; e += 0.0005) {
    const g = _milGuete(e);
    if (best === null || g < best.g) best = { e, g };
  }
  const sl = document.getElementById('milEProbe');
  if (sl) sl.value = String(Math.round(best.e * 1000) / 1000);
  _milSetEProbe(Math.round(best.e * 1000) / 1000);
}
function _milRenderTeiler() {
  const el = document.getElementById('milTeiler'); if (!el) return;
  if (!_mil.rows.length) {
    el.innerHTML = '<div class="fpm-note">Noch keine Messwerte zum Teilen.</div>';
    return;
  }
  const g = _milGuete(_mil.eProbe);
  const cls = g < 0.05 ? 'ok' : g < 0.15 ? 'mid' : 'no';
  const chips = _mil.rows.slice(0, 24).map(r => {
    const x = r.q / (_mil.eProbe * 1e-19);
    const ab = Math.abs(x - Math.round(x));
    return `<span class="mil-chip ${ab < 0.12 ? 'ok' : ab < 0.25 ? 'mid' : 'no'}"
       title="q = ${_fpmNum(r.q / 1e-19, 3)} · 10⁻¹⁹ C">${_fpmNum(x, 2)}</span>`;
  }).join('');
  const kleinste = Math.min(..._mil.rows.map(r => r.q));
  el.innerHTML =
    `<div class="git-sch-kopf">q geteilt durch e<sub>Probe</sub> – wie nah an ganzen Zahlen?</div>
     <div class="mil-chips">${chips}${_mil.rows.length > 24 ? '<span class="mil-chip">…</span>' : ''}</div>
     <div class="mil-guete ${cls}">mittlere Abweichung von ganzen Zahlen: <b>${_fpmNum(g, 4)}</b>
       ${g < 0.05 ? ' – das passt sehr gut' : g < 0.15 ? ' – geht in die richtige Richtung' : ' – so geht es nicht auf'}</div>
     <div class="fpm-note">Die kleinste gemessene Ladung beträgt ${_fpmNum(kleinste / 1e-19, 3)} · 10⁻¹⁹ C.
       Größer als dieser Wert kann e nicht sein. Nach unten hilft die Rechnung allein nicht weiter:
       Auch die Hälfte oder ein Drittel des richtigen Wertes teilt alle Messwerte glatt.
       Deshalb sucht man den <b>größten</b> Wert, der noch aufgeht.</div>`;
}

function _milRenderFazit() {
  const el = document.getElementById('milFazit'); if (!el) return;
  if (_mil.rows.length < 5) { el.innerHTML = ''; return; }
  const pts = _mil.rows.map(r => ({ x: Math.round(r.q / (_mil.eProbe * 1e-19)), y: r.q / 1e-19 }))
    .filter(p => p.x > 0);
  const fit = pts.length >= 2 ? _fpmFitOrigin(pts) : null;
  if (!fit) { el.innerHTML = ''; return; }
  const nmax = Math.max(...pts.map(p => p.x));
  el.innerHTML =
    `<div class="git-sch-kopf">Was die Messreihe zeigt</div>
     <div class="mil-fazit-text">
       Aus ${_mil.rows.length} vermessenen Tröpfchen ergibt sich mit dem eingestellten Probierwert eine
       Elementarladung von <b>${_milExp(fit.k * 1e-19, 4)} C</b> (R² = ${_fpmNum(fit.r2, 5)}).
       Die größte vorkommende Ladungszahl ist n = ${nmax}; auf keinem Tröpfchen sitzt also mehr als eine
       Handvoll Elektronen. Entscheidend ist nicht der Zahlenwert allein, sondern dass sich <b>überhaupt</b>
       ein gemeinsamer Teiler finden lässt: Elektrische Ladung tritt nur in ganzzahligen Vielfachen einer
       kleinsten Portion auf.
     </div>`;
}

// ── Theoriefunktion ────────────────────────────────────
function _milSetPreset(i) {
  _mil.preset = i;
  for (let k = 0; k < 3; k++) document.getElementById('milTab' + k)?.classList.toggle('on', k === i);
  _milRefreshTheorie();
  _milDrawPlot();
}
function _milTheorieFn() {
  const term = _MIL_PRESETS[_mil.preset].term();
  const inp = document.getElementById('milFn');
  if (inp) inp.value = term;
  _milSetFn(term);
  _mil.fnAuto = true;
  _milRenderTheorie(true);
}
function _milClearFn() {
  const inp = document.getElementById('milFn');
  if (inp) inp.value = '';
  _milSetFn('');
  _milRenderTheorie(false);
}
function _milRefreshTheorie() {
  if (_mil.fnAuto) {
    const term = _MIL_PRESETS[_mil.preset].term();
    const inp = document.getElementById('milFn');
    if (inp) inp.value = term;
    _milSetFn(term);
    _mil.fnAuto = true;
  }
  _milRenderTheorie(_mil.fnAuto);
}
function _milRenderTheorie(eingesetzt) {
  const el = document.getElementById('milTheo'); if (!el) return;
  const P = _MIL_PRESETS[_mil.preset];
  el.innerHTML =
    `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
     <div class="fpm-theo-typ">${P.typ}</div>
     <div class="fpm-theo-form">${P.form}</div>
     <div class="fpm-theo-par">${P.param()}</div>
     ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${P.term()}</div>` : ''}
     <div class="fpm-theo-deutung">${P.deutung}</div>`;
}
function _milSetFn(str) {
  _mil.fnAuto = false;
  const err = document.getElementById('milFnErr');
  const v = (str || '').trim();
  if (!v) { _mil.fn = null; if (err) err.textContent = ''; _milDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _mil.fn = f; if (err) err.textContent = '';
  } catch (e) { _mil.fn = null; if (err) err.textContent = e.message; }
  _milDrawPlot();
}

// ── Takt ───────────────────────────────────────────────
function _milTakt(dt) {
  if (!_mil) return;
  _mil.t += dt;

  // Station 1: der Wattebausch reagiert traege auf die Kraftdifferenz
  if (_mil.station === 0) {
    const a = _milWbA() / _MIL_G;          // normiert: 0 heisst Schweben
    _mil.wbV = (_mil.wbV + a * dt * 1.2) * 0.90;
    _mil.wbY = Math.max(0, Math.min(1, _mil.wbY + _mil.wbV * dt));
    if (_mil.wbY <= 0 && _mil.wbV < 0) _mil.wbV = 0;
    if (_mil.wbY >= 1 && _mil.wbV > 0) _mil.wbV = 0;
  }

  // Station 2: das Troepfchen bewegt sich mit seiner Endgeschwindigkeit
  if (_mil.station === 1 && _mil.tropfen) {
    const v = _milTropfenV() * 1000;                 // mm/s
    _mil.y = _mil.y - v * dt;                        // y waechst nach unten
    if (_mil.y > _MIL_SKALA) { _mil.y = _MIL_SKALA; }
    if (_mil.y < 0) { _mil.y = 0; }
    if (_mil.uhrLauf) {
      _mil.uhrT += dt;
      // Am Rand des Blickfelds endet die Messung von selbst
      if (_mil.y >= _MIL_SKALA || _mil.y <= 0) _milUhr();
    }
  }
}

function _milRender() {
  if (!_mil) return;
  if (_mil.station === 0) {
    const cv = document.getElementById('milWB');
    if (cv) _milRenderWB(cv.getContext('2d'), cv);
  } else if (_mil.station === 1) {
    const a = document.getElementById('milMik');
    if (a) _milRenderMik(a.getContext('2d'), a);
    const b = document.getElementById('milAuf');
    if (b) _milRenderAuf(b.getContext('2d'), b);
    const u = document.getElementById('milUhrA');
    if (u) u.textContent = _fpmNum(_mil.uhrT, 2);
  }
}

// ── Zusätzliche Styles ─────────────────────────────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .mil-zustand { font-size: .78rem; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 9px; padding: 8px 11px; margin: 8px 0; line-height: 1.5; }
    .mil-zustand.ok { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
    .mil-zustand.aus { background: #fffbeb; border-color: #fde68a; color: #b45309; }
    .mil-schritt { display: flex; gap: 8px; align-items: flex-start; font-size: .78rem; color: #475569;
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px 11px;
      margin: 10px 0 6px; line-height: 1.5; }
    .mil-schritt-n { flex: 0 0 20px; height: 20px; border-radius: 50%; background: #0f766e; color: #fff;
      font-size: .72rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
    .mil-hilfe { display: none; font-size: .8rem; color: #475569; line-height: 1.6;
      background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 9px; padding: 10px 13px; margin-top: 8px; }
    .mil-hilfe b { color: #0f766e; }
    .mil-teiler { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 9px 11px; margin-top: 10px; }
    .mil-teiler-warn { font-size: .78rem; color: #b45309; }
    .mil-chips { display: flex; flex-wrap: wrap; gap: 4px; margin: 7px 0; }
    .mil-chip { font-size: .7rem; font-weight: 700; padding: 2px 6px; border-radius: 6px;
      background: #f1f5f9; color: #64748b; font-variant-numeric: tabular-nums; }
    .mil-chip.ok { background: #f0fdf4; color: #15803d; }
    .mil-chip.mid { background: #fffbeb; color: #b45309; }
    .mil-chip.no { background: #fef2f2; color: #b91c1c; }
    .mil-guete { font-size: .78rem; color: #64748b; margin: 6px 0; }
    .mil-guete b { font-variant-numeric: tabular-nums; }
    .mil-guete.ok b { color: #15803d; }
    .mil-guete.mid b { color: #b45309; }
    .mil-guete.no b { color: #b91c1c; }
    .mil-fazit { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 9px;
      padding: 10px 13px; margin-top: 12px; }
    .mil-fazit-text { font-size: .8rem; color: #475569; line-height: 1.65; margin-top: 4px; }
    .mil-fazit-text b { color: #0f766e; }
    .mil-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════════
//  FADENSTRAHLROHR – das Schlüsselexperiment
//  Nach dem Handbuch "Schlüsselexperiment 6: Fadenstrahlrohr" (NRW).
//  Drei Stationen: Messung im Fadenstrahlrohr → Auswertung zur
//  Elektronenmasse → Schraubenbahn und Polarlichter.
// ═══════════════════════════════════════════════════════════════

const _FSR_E   = 1.602e-19;      // Elementarladung in C (aus dem Millikanversuch)
const _FSR_ME  = 9.109e-31;      // Literaturwert der Elektronenmasse in kg
const _FSR_MU0 = 4e-7 * Math.PI; // magnetische Feldkonstante in Vs/(Am)
const _FSR_R   = 0.150;          // Radius der Helmholtzspulen in m
const _FSR_N   = 130;            // Windungen je Spule

// Der Glaskolben begrenzt die Kreisbahn nach oben, die Ablesbarkeit nach unten
const _FSR_RMAX = 0.050;
const _FSR_RMIN = 0.010;
// Auf der Skala im Rohr ist der Durchmesser auf einen Millimeter genau ablesbar
const _FSR_ABLESUNG = 0.001;
// Auflösung eines gebräuchlichen Teslameters
const _FSR_HALL = 0.01e-3;

let _fsr = null;

function _fsrInit() {
  _fsr = {
    station: 0, t: 0,
    U: 200, I: 1.5, bQuelle: 'formel', richtung: 1, strahl: true,
    elektronen: [], rows: [], nextId: 1,
    preset: 0, fn: null, fnAuto: false, reveal: false,
    alpha: 30, schraube: []
  };
}

// ── Physik ─────────────────────────────────────────────
// Helmholtzbedingung: zwei gleiche Spulen im Abstand ihres Radius,
// gleichsinnig vom selben Strom durchflossen.
const _FSR_K = 8 / (5 * Math.sqrt(5));            // ≈ 0,7155
function _fsrBFormel(I) { return _FSR_K * _FSR_MU0 * _FSR_N * I / _FSR_R; }
// Die Hallsonde misst dasselbe Feld, aber nur mit der Auflösung des Geräts
function _fsrBHall(I) { return Math.round(_fsrBFormel(I) / _FSR_HALL) * _FSR_HALL; }
function _fsrB() { return _fsr.bQuelle === 'hall' ? _fsrBHall(_fsr.I) : _fsrBFormel(_fsr.I); }

// e·U = ½·m·v²  ⇒  v = √(2·e·U/m)
function _fsrV(U) { return Math.sqrt(2 * _FSR_E * U / _FSR_ME); }
// F_L = F_z:  e·v·B = m·v²/r  ⇒  r = m·v/(e·B)
function _fsrRadius(U, B) { return _FSR_ME * _fsrV(U) / (_FSR_E * B); }
// Nach m aufgelöst – die Größe, um die es im Versuch geht
function _fsrMasse(U, B, r) { return _FSR_E * B * B * r * r / (2 * U); }
function _fsrSpez(U, B, r) { return 2 * U / (B * B * r * r); }
// Die Umlaufdauer hängt nicht von der Geschwindigkeit ab
function _fsrUmlauf(B) { return 2 * Math.PI * _FSR_ME / (_FSR_E * B); }

// Der wahre Bahnradius bei der eingestellten Apparatur
function _fsrRWahr() { return _fsrRadius(_fsr.U, _fsrBFormel(_fsr.I)); }
// Das, was auf der Skala im Rohr tatsächlich abzulesen ist: der Durchmesser,
// auf einen Millimeter genau.
function _fsrDAblesung() {
  return Math.round(2 * _fsrRWahr() / _FSR_ABLESUNG) * _FSR_ABLESUNG;
}
function _fsrRAblesung() { return _fsrDAblesung() / 2; }

function _fsrPasst() {
  return _fsrProblem() === null;
}
function _fsrProblem() {
  // Bei umgekehrter Feldrichtung biegt die Lorentzkraft den Strahl nach unten;
  // er trifft sofort die Glaswand. Genau das passiert auch in der echten Roehre,
  // wenn die Spulen falsch herum angeschlossen sind.
  if (_fsr.richtung < 0) return 'verpolt';
  const r = _fsrRWahr();
  if (r > _FSR_RMAX) return 'zu gross';
  if (r < _FSR_RMIN) return 'zu klein';
  return null;
}

// ── Station 3: Schraubenbahn ───────────────────────────
function _fsrAlphaRad() { return _fsr.alpha * Math.PI / 180; }
function _fsrVPar()  { return _fsrV(_fsr.U) * Math.cos(_fsrAlphaRad()); }
function _fsrVSenk() { return _fsrV(_fsr.U) * Math.sin(_fsrAlphaRad()); }
function _fsrRSchraube() {
  const B = _fsrB();
  return B > 0 ? _FSR_ME * _fsrVSenk() / (_FSR_E * B) : Infinity;
}
// Ganghöhe = Strecke längs des Feldes während eines vollen Umlaufs
function _fsrGanghoehe() { return _fsrVPar() * _fsrUmlauf(_fsrB()); }

// ── Formatierung ───────────────────────────────────────
const _FSR_HOCH = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function _fsrExp(v, d) {
  if (!isFinite(v)) return '—';
  if (v === 0) return '0';
  const ex = Math.floor(Math.log10(Math.abs(v)));
  const m = v / Math.pow(10, ex);
  const hoch = String(ex).split('').map(c => _FSR_HOCH[c] || c).join('');
  return _fpmNum(m, d) + ' · 10' + hoch;
}

// ── Oberfläche ─────────────────────────────────────────
function _fsrHTML() {
  const stationen = ['1 · Fadenstrahlrohr', '2 · Die Elektronenmasse', '3 · Schraubenbahn & Polarlicht']
    .map((s, i) => `<button class="fpm-tab${i === _fsr.station ? ' on' : ''}" id="fsrSt${i}" onclick="_fsrSetStation(${i})">${s}</button>`).join('');

  const presets = ['U → B²·r²', '1/B → r', '√U → r'].map((p, i) =>
    `<button class="fpm-tab${i === _fsr.preset ? ' on' : ''}" id="fsrTab${i}" onclick="_fsrSetPreset(${i})">${p}</button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim fsr-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">🌀 Fadenstrahlrohr: das Schlüsselexperiment</h3>
    <canvas id="fsrTakt" width="1" height="1" style="display:none"></canvas>
    <div class="fpm-tabs">${stationen}</div>

    <!-- ══ Station 1 ══ -->
    <div id="fsrS0">
      <div class="fpm-grid">
        <div>
          <canvas id="fsrRohr" width="420" height="340" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Blick längs der Spulenachse in den Glaskolben</div>
          <canvas id="fsrSchalt" width="420" height="128" class="phys-anim-cv"></canvas>
          <div class="fpm-note">Elektronenkanone: Glühkathode (1), Wehneltzylinder (2), Anode (3).
            Das Restgas im Kolben – Wasserstoff oder Argon bei 0,1 bis 1 Pa – leuchtet dort,
            wo die Elektronen es ionisieren. Erst dadurch wird die Bahn sichtbar.</div>
        </div>
        <div>
          <div class="fpm-label">Elektronenkanone</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Beschleunigungsspannung U: <b id="fsrULbl">200 V</b></span>
            <input type="range" id="fsrU" min="100" max="300" step="5" value="200"
              oninput="_fsrSetU(this.value)" style="width:100%;accent-color:#0369a1">
          </div>
          <div class="fpm-label">Helmholtzspulen</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Spulenstrom I: <b id="fsrILbl">1,50 A</b></span>
            <input type="range" id="fsrI" min="1" max="3" step="0.01" value="1.5"
              oninput="_fsrSetI(this.value)" style="width:100%;accent-color:#0369a1">
          </div>
          <div class="fpm-label">Woher kommt die Magnetfeldstärke?</div>
          <div class="fsr-quellen">
            <button class="fsr-quelle on" id="fsrQ0" onclick="_fsrSetQuelle('formel')">
              <span class="fsr-quelle-n">aus der Formel</span>
              <span class="fsr-quelle-k">B = 0,7155 · µ₀ · n · I / R</span></button>
            <button class="fsr-quelle" id="fsrQ1" onclick="_fsrSetQuelle('hall')">
              <span class="fsr-quelle-n">mit der Hallsonde</span>
              <span class="fsr-quelle-k">gemessen, Auflösung 0,01 mT</span></button>
          </div>
          <div class="fsr-bvergleich" id="fsrBVergleich"></div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_fsrUmpolen()">🔄 Feldrichtung umkehren</button>
            <button class="sim-btn" id="fsrStrahlBtn" onclick="_fsrToggleStrahl()">Magnetfeld aus</button>
          </div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Geschwindigkeit v</span><span class="fpm-ro-v" id="fsrVA">—</span><span class="fpm-ro-u">10⁶ m/s</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Magnetfeld B</span><span class="fpm-ro-v" id="fsrBA">—</span><span class="fpm-ro-u">mT</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">abgelesener Durchmesser d</span><span class="fpm-ro-v" id="fsrDA">—</span><span class="fpm-ro-u">cm</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Bahnradius r = d/2</span><span class="fpm-ro-v" id="fsrRA">—</span><span class="fpm-ro-u">cm</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Umlaufdauer T</span><span class="fpm-ro-v" id="fsrTA">—</span><span class="fpm-ro-u">ns</span></div>
          </div>
          <div class="fsr-zustand" id="fsrZustand"></div>
          <div class="fsr-rechnung" id="fsrRechnung"></div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="fsrTakeBtn" onclick="_fsrTake()">✓ Messwert übernehmen</button>
            <button class="sim-btn" onclick="_fsrDemo()">📋 Beispielmessreihe</button>
            <button class="sim-btn" onclick="_fsrClear()">🗑 Tabelle leeren</button>
          </div>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>Nr.</th><th>U (V)</th><th>I (A)</th><th>B (mT)</th><th>d (cm)</th><th>m<sub>e</sub> (10⁻³¹ kg)</th><th></th></tr></thead>
              <tbody id="fsrTbody"></tbody>
            </table>
            <div class="fpm-empty" id="fsrEmpty">Noch keine Messwerte.<br>Spannung und Spulenstrom einstellen, Durchmesser ablesen, übernehmen.</div>
          </div>
        </div>
      </div>
      <div class="fsr-drei" id="fsrDrei"></div>
    </div>

    <!-- ══ Station 2 ══ -->
    <div id="fsrS1" style="display:none">
      <div class="fpm-label">Mittelwert und Spannweite – so wertet eine Lerngruppe aus</div>
      <div class="fsr-stat" id="fsrStat"></div>
      <div class="fpm-label" style="margin-top:12px">Grafische Auswertung nach Linearisierung</div>
      <div class="fpm-tabs">${presets}</div>
      <div class="fpm-grid2">
        <canvas id="fsrPlot" width="470" height="340" class="phys-chart-cv"></canvas>
        <div>
          <div class="fpm-fit" id="fsrFitBox"></div>
          <div class="fpm-label" style="margin-top:10px">Funktion plotten</div>
          <input type="text" id="fsrFn" class="fpm-input" placeholder="z. B. 1.137e-11*x" spellcheck="false"
            oninput="_fsrSetFn(this.value)">
          <div class="fpm-err" id="fsrFnErr"></div>
          <div class="sim-btn-row" style="padding:2px 0 4px">
            <button class="sim-btn primary" onclick="_fsrTheorieFn()">ƒ Theoriefunktion</button>
            <button class="sim-btn" onclick="_fsrClearFn()">Feld leeren</button>
          </div>
          <div class="fpm-theo" id="fsrTheo"></div>
          <label class="fpm-check"><input type="checkbox" onchange="_fsrSet('reveal',this.checked)">
            Literaturwert anzeigen</label>
        </div>
      </div>
    </div>

    <!-- ══ Station 3 ══ -->
    <div id="fsrS2" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="fsrSchraube" width="420" height="300" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Das Rohr gegen das Feld verdreht</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Winkel α zwischen v und der Feldrichtung: <b id="fsrAlphaLbl">30°</b></span>
            <input type="range" id="fsrAlpha" min="0" max="90" step="1" value="30"
              oninput="_fsrSetAlpha(this.value)" style="width:100%;accent-color:#0369a1">
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_fsrSetAlpha(0)">α = 0° (Gerade)</button>
            <button class="sim-btn" onclick="_fsrSetAlpha(45)">α = 45°</button>
            <button class="sim-btn" onclick="_fsrSetAlpha(90)">α = 90° (Kreis)</button>
          </div>
          <div class="fpm-note">Spannung und Spulenstrom werden aus Station 1 übernommen.</div>
        </div>
        <div>
          <div class="fpm-label">Zerlegung der Geschwindigkeit</div>
          <div class="fsr-rechnung" id="fsrSchraubeRechnung"></div>
          <div class="dsp-erkl" style="margin-top:10px">
            <div class="dsp-erkl-kopf">Polarlicht und magnetische Flasche</div>
            <div class="dsp-erkl-text">
              Genau diese Schraubenbahn beschreiben geladene Teilchen des Sonnenwindes im Erdmagnetfeld.
              Sie werden im <b>van-Allen-Strahlungsgürtel</b> gefangen und laufen dabei längs der Feldlinien
              zu den Polen. Dort rücken die Feldlinien enger zusammen, das Feld wird stärker – die Teilchen
              werden abgebremst und schließlich zurückgeworfen. Dieses Prinzip heißt
              <b>magnetische Flasche</b>. Wo die Teilchen tief genug in die Atmosphäre eindringen, regen
              sie Luftmoleküle zum Leuchten an: Das ist das <b>Polarlicht</b> – dasselbe Leuchten durch
              Stoßanregung, das im Fadenstrahlrohr die Bahn sichtbar macht.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="fsrErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>e · U = ½ · m<sub>e</sub> · v²</b> &nbsp;|&nbsp; <b>e · v · B = m<sub>e</sub> · v² / r</b>
      &nbsp;|&nbsp; <b>m<sub>e</sub> = e · B² · r² / (2 · U)</b>
    </p>
  </div>`;
}

function _fsrErklHTML() {
  return `<div class="dsp-erkl-kopf">Warum man ein Elektron nicht wiegen kann</div>
    <div class="dsp-erkl-text">
      Der Millikanversuch hat die <b>Ladung</b> des Elektrons geliefert. Die zweite Eigenschaft, seine
      <b>Masse</b>, lässt sich auf keiner Waage bestimmen. Man kommt aber indirekt heran: Zwingt man
      Elektronen im Magnetfeld auf eine Kreisbahn, dann verrät der Radius dieser Bahn ihre Masse.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Die beiden Ansätze</div>
    <div class="dsp-erkl-text">
      <b>Erstens</b> die Elektronenkanone: Beim Durchlaufen der Beschleunigungsspannung U erhält jedes
      Elektron die Energie e·U, und diese steckt danach vollständig in der Bewegung. Aus
      e·U = ½·m<sub>e</sub>·v² folgt v = √(2·e·U/m<sub>e</sub>).
      <b>Zweitens</b> die Kreisbahn: Die Lorentzkraft steht immer senkrecht auf der Bewegungsrichtung und
      wirkt deshalb als Zentripetalkraft. Aus e·v·B = m<sub>e</sub>·v²/r folgt m<sub>e</sub>·v = e·B·r.
      Setzt man die Geschwindigkeit ein und löst nach der Masse auf, bleibt nur noch Messbares übrig:
      <b>m<sub>e</sub> = e · B² · r² / (2 · U)</b> ≈ 9,109 · 10⁻³¹ kg. Gleichwertig lässt sich die
      spezifische Ladung angeben: e/m<sub>e</sub> = 2·U/(B²·r²) ≈ 1,759 · 10¹¹ C/kg.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum der Strahl ein Faden ist</div>
    <div class="dsp-erkl-text">
      Der Kolben ist nicht leer, sondern enthält Wasserstoff oder Argon bei 0,1 bis 1 Pa. So wenig Gas,
      dass die Elektronen kaum Energie verlieren – aber genug, dass sie beim Stoß Gasmoleküle ionisieren.
      Bei der anschließenden Rekombination leuchtet das Gas, und die Bahn wird sichtbar. Die dabei
      herausgeschlagenen Sekundärelektronen verlassen den Strahlbereich, die viel schwereren Gasionen
      bleiben zurück. Ihre positive Ladung hält den Strahl zusammen – ohne sie würde er durch die
      gegenseitige Abstoßung der Elektronen auseinanderlaufen. Daher der Name <b>Fadenstrahl</b>.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Die Energie bleibt konstant</div>
    <div class="dsp-erkl-text">
      Auf der Kreisbahn werden die Elektronen ständig beschleunigt – trotzdem ändert sich der
      <b>Betrag</b> ihrer Geschwindigkeit nicht, denn die Beschleunigung steht immer senkrecht auf der
      Geschwindigkeit. Sie ändert nur die Richtung. Streng genommen strahlen die kreisenden Elektronen
      elektromagnetische Wellen ab, deren Frequenz gerade ihre Umlauffrequenz ist; dieser Energieverlust
      ist hier aber vernachlässigbar. Bemerkenswert nebenbei: Die Umlaufdauer T = 2π·m<sub>e</sub>/(e·B)
      hängt gar nicht von der Geschwindigkeit ab – schnellere Elektronen laufen auf größeren Kreisen und
      brauchen genauso lange.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Verwandte Aufbauten</div>
    <div class="dsp-erkl-text">
      Im <b>Wienschen Geschwindigkeitsfilter</b> wirken ein elektrisches und ein magnetisches Feld
      gekreuzt und damit entgegengesetzt auf die Teilchen. Nur wer die Geschwindigkeit v = E/B hat,
      fliegt geradeaus durch die Lochblende – alle anderen werden abgefangen. Setzt man dahinter ein
      reines Magnetfeld, entsteht das <b>Bainbridge-Massenspektrometer</b>: Der Halbkreisradius hängt
      dann nur noch von der spezifischen Ladung ab, sodass sich Teilchen nach Masse trennen lassen.
      So werden Isotope getrennt, Proteine charakterisiert und Funde in der Archäologie datiert.
      Historisch bestimmte übrigens J. J. Thomson die spezifische Ladung 1897 nicht am Fadenstrahlrohr,
      sondern am Parabelspektrographen.
    </div>
    <div class="dsp-erkl-warn">⚠ Im echten Versuch: Hochspannung an der Elektronenkanone, heiße Glühkathode,
      Glaskolben unter Unterdruck. Bestimmungen der RiSU einhalten.</div>`;
}

// ── Stationen ──────────────────────────────────────────
function _fsrSetStation(i) {
  _fsr.station = i;
  for (let k = 0; k < 3; k++) {
    document.getElementById('fsrSt' + k)?.classList.toggle('on', k === i);
    const d = document.getElementById('fsrS' + k);
    if (d) d.style.display = k === i ? 'block' : 'none';
  }
  _fsrUpdate();
  if (i === 1) _fsrDrawPlot();
}
function _fsrSet(key, val) { _fsr[key] = val; _fsrDrawPlot(); }

// ── Bedienung Station 1 ────────────────────────────────
function _fsrSetU(v) {
  _fsr.U = Math.max(100, Math.min(300, +v));
  const sl = document.getElementById('fsrU'); if (sl) sl.value = String(_fsr.U);
  const el = document.getElementById('fsrULbl'); if (el) el.textContent = Math.round(_fsr.U) + ' V';
  _fsrUpdate();
}
function _fsrSetI(v) {
  _fsr.I = Math.max(1, Math.min(3, +v));
  const sl = document.getElementById('fsrI'); if (sl) sl.value = String(_fsr.I);
  const el = document.getElementById('fsrILbl'); if (el) el.textContent = _fpmNum(_fsr.I, 2) + ' A';
  _fsrUpdate();
}
function _fsrSetQuelle(q) {
  _fsr.bQuelle = q;
  document.getElementById('fsrQ0')?.classList.toggle('on', q === 'formel');
  document.getElementById('fsrQ1')?.classList.toggle('on', q === 'hall');
  _fsrUpdate();
}
function _fsrUmpolen() { _fsr.richtung = -_fsr.richtung; _fsrUpdate(); }
function _fsrToggleStrahl() {
  _fsr.strahl = !_fsr.strahl;
  const b = document.getElementById('fsrStrahlBtn');
  if (b) b.textContent = _fsr.strahl ? 'Magnetfeld aus' : 'Magnetfeld an';
  _fsrUpdate();
}

function _fsrTake() {
  if (!_fsrPasst() || !_fsr.strahl) return;
  const B = _fsrB(), d = _fsrDAblesung(), r = d / 2;
  _fsr.rows.push({ id: _fsr.nextId++, U: _fsr.U, I: _fsr.I, B, d, r,
                   quelle: _fsr.bQuelle, m: _fsrMasse(_fsr.U, B, r) });
  _fsrRenderTable();
  _fsrDrawPlot();
}
function _fsrDelRow(id) { _fsr.rows = _fsr.rows.filter(r => r.id !== id); _fsrRenderTable(); _fsrDrawPlot(); }
function _fsrClear() {
  if (_fsr.rows.length && !confirm('Alle ' + _fsr.rows.length + ' Messwerte löschen?')) return;
  _fsr.rows = []; _fsrRenderTable(); _fsrDrawPlot();
}
// Eine Messreihe, wie sie eine Lerngruppe arbeitsteilig aufnimmt:
// verschiedene Spulenströme bei fester Spannung und umgekehrt.
function _fsrDemo() {
  const nimm = (U, I) => {
    const B = _fsrBFormel(I);
    const rw = _fsrRadius(U, B);
    if (rw > _FSR_RMAX || rw < _FSR_RMIN) return;
    const d = Math.round(2 * rw / _FSR_ABLESUNG) * _FSR_ABLESUNG;
    _fsr.rows.push({ id: _fsr.nextId++, U, I, B, d, r: d / 2,
                     quelle: 'formel', m: _fsrMasse(U, B, d / 2) });
  };
  [1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0].forEach(I => nimm(200, I));
  [120, 160, 200, 240, 280].forEach(U => nimm(U, 2.0));
  _fsrRenderTable();
  _fsrDrawPlot();
}
function _fsrRenderTable() {
  // Die Statistik haengt an denselben Daten – sonst bleibt nach dem Leeren
  // der Tabelle der alte Mittelwert stehen.
  _fsrRenderStat();
  const tb = document.getElementById('fsrTbody'); if (!tb) return;
  const empty = document.getElementById('fsrEmpty');
  if (empty) empty.style.display = _fsr.rows.length ? 'none' : 'block';
  tb.innerHTML = _fsr.rows.map((r, i) =>
    `<tr><td>${i + 1}</td><td>${Math.round(r.U)}</td><td>${_fpmNum(r.I, 2)}</td>
       <td>${_fpmNum(r.B * 1000, 3)}${r.quelle === 'hall' ? ' <span class="fsr-hall">H</span>' : ''}</td>
       <td>${_fpmNum(r.d * 100, 1)}</td>
       <td><b>${_fpmNum(r.m / 1e-31, 3)}</b></td>
       <td class="fpm-del" onclick="_fsrDelRow(${r.id})" title="löschen">✕</td></tr>`).join('');
}

// ── Bedienung Station 3 ────────────────────────────────
function _fsrSetAlpha(v) {
  _fsr.alpha = Math.max(0, Math.min(90, +v));
  const sl = document.getElementById('fsrAlpha'); if (sl) sl.value = String(_fsr.alpha);
  const el = document.getElementById('fsrAlphaLbl'); if (el) el.textContent = Math.round(_fsr.alpha) + '°';
  _fsrRenderSchraube();
}
function _fsrRenderSchraube() {
  const el = document.getElementById('fsrSchraubeRechnung'); if (!el) return;
  const v = _fsrV(_fsr.U), B = _fsrB();
  const vp = _fsrVPar(), vs = _fsrVSenk();
  const rs = _fsrRSchraube(), T = _fsrUmlauf(B), h = _fsrGanghoehe();
  el.innerHTML = `
    <div class="pho-rz"><span class="pho-rz-t">Gesamtgeschwindigkeit aus U = ${Math.round(_fsr.U)} V</span>
      <span class="pho-rz-f">v = √(2·e·U/m<sub>e</sub>)</span>
      <span class="pho-rz-v">${_fpmNum(v / 1e6, 3)} · 10⁶ m/s</span></div>
    <div class="pho-rz"><span class="pho-rz-t">längs des Feldes – bleibt unbeeinflusst</span>
      <span class="pho-rz-f">v<sub>∥</sub> = v · cos α</span>
      <span class="pho-rz-v">${_fpmNum(vp / 1e6, 3)} · 10⁶ m/s</span></div>
    <div class="pho-rz"><span class="pho-rz-t">quer zum Feld – erzeugt die Kreisbewegung</span>
      <span class="pho-rz-f">v<sub>⊥</sub> = v · sin α</span>
      <span class="pho-rz-v">${_fpmNum(vs / 1e6, 3)} · 10⁶ m/s</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Radius der Schraube</span>
      <span class="pho-rz-f">r = m<sub>e</sub>·v<sub>⊥</sub>/(e·B)</span>
      <span class="pho-rz-v">${_fpmNum(rs * 100, 2)} cm</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Umlaufdauer – unabhängig von α und v</span>
      <span class="pho-rz-f">T = 2π·m<sub>e</sub>/(e·B)</span>
      <span class="pho-rz-v">${_fpmNum(T / 1e-9, 2)} ns</span></div>
    <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Ganghöhe</span>
      <span class="pho-rz-f">h = v<sub>∥</sub> · T</span>
      <span class="pho-rz-v">${_fpmNum(h * 100, 2)} cm</span></div>
    <div class="fpm-note" style="margin-top:8px">
      ${_fsr.alpha === 0
        ? 'Bei α = 0° gibt es keine Geschwindigkeitskomponente quer zum Feld – die Lorentzkraft verschwindet und der Strahl läuft geradeaus.'
        : _fsr.alpha === 90
          ? 'Bei α = 90° gibt es keine Komponente längs des Feldes – die Ganghöhe ist null und aus der Schraube wird der geschlossene Kreis aus Station 1.'
          : 'Die Bewegung setzt sich aus einer gleichförmigen Bewegung längs des Feldes und einer Kreisbewegung quer dazu zusammen. Nur die Querkomponente spürt die Lorentzkraft.'}
    </div>`;
}

// ── Gemeinsame Aktualisierung ──────────────────────────
function _fsrUpdate() {
  if (!_fsr) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const B = _fsrB(), v = _fsrV(_fsr.U);
  const rw = _fsrRWahr(), d = _fsrDAblesung();
  const an = _fsr.strahl;

  set('fsrVA', _fpmNum(v / 1e6, 3));
  set('fsrBA', an ? _fpmNum(B * 1000, 3) : '0,000');
  set('fsrDA', an && _fsrPasst() ? _fpmNum(d * 100, 1) : '—');
  set('fsrRA', an && _fsrPasst() ? _fpmNum(d * 50, 2) : '—');
  set('fsrTA', an ? _fpmNum(_fsrUmlauf(B) / 1e-9, 2) : '—');

  // Formel und Messung nebeneinander – die Handreichung empfiehlt den Vergleich
  const bv = document.getElementById('fsrBVergleich');
  if (bv) {
    const bf = _fsrBFormel(_fsr.I), bh = _fsrBHall(_fsr.I);
    const abw = Math.abs(bh - bf) / bf * 100;
    bv.innerHTML = `<span class="fsr-bv"><span>berechnet</span><b>${_fpmNum(bf * 1000, 4)} mT</b></span>
      <span class="fsr-bv"><span>Hallsonde</span><b>${_fpmNum(bh * 1000, 4)} mT</b></span>
      <span class="fsr-bv-ab">Unterschied ${_fpmNum(abw, 2)} %</span>`;
  }

  const z = document.getElementById('fsrZustand');
  if (z) {
    const p = _fsrProblem();
    if (!an) {
      z.className = 'fsr-zustand';
      z.innerHTML = 'Ohne Magnetfeld fliegen die Elektronen <b>geradeaus</b> – der Faden ist eine gerade Linie. '
        + 'Erst die Lorentzkraft biegt ihn zum Kreis.';
    } else if (p === 'verpolt') {
      z.className = 'fsr-zustand aus';
      z.innerHTML = 'Die Lorentzkraft biegt den Strahl <b>nach unten</b> – er trifft nach wenigen '
        + 'Zentimetern die Glaswand. Genau das passiert, wenn die Spulen falsch herum angeschlossen '
        + 'sind. Kehre die Feldrichtung um.';
    } else if (p === 'zu gross') {
      z.className = 'fsr-zustand aus';
      z.innerHTML = 'Der Kreis wäre mit ' + _fpmNum(rw * 100, 1) + ' cm Radius größer als der Glaskolben – '
        + 'der Strahl trifft die Wand. <b>Spulenstrom erhöhen</b> oder Spannung verringern.';
    } else if (p === 'zu klein') {
      z.className = 'fsr-zustand aus';
      z.innerHTML = 'Der Kreis ist mit ' + _fpmNum(rw * 100, 2) + ' cm Radius zu klein, um den Durchmesser '
        + 'noch sinnvoll abzulesen. <b>Spulenstrom verringern</b> oder Spannung erhöhen.';
    } else {
      z.className = 'fsr-zustand ok';
      z.innerHTML = '<b>Die Kreisbahn liegt vollständig im Kolben.</b> Durchmesser an der Skala ablesen '
        + 'und übernehmen.';
    }
  }

  // Die Rechnung Schritt für Schritt mitlaufen lassen
  const rch = document.getElementById('fsrRechnung');
  if (rch) {
    if (an && _fsrPasst()) {
      const r = d / 2, m = _fsrMasse(_fsr.U, B, r), sp = _fsrSpez(_fsr.U, B, r);
      const abw = (m - _FSR_ME) / _FSR_ME * 100;
      rch.innerHTML = `
        <div class="pho-rz"><span class="pho-rz-t">Elektronenmasse aus diesem Messwert</span>
          <span class="pho-rz-f">m<sub>e</sub> = e·B²·r²/(2·U)</span>
          <span class="pho-rz-v">${_fsrExp(m, 3)} kg</span></div>
        <div class="pho-rz"><span class="pho-rz-t">gleichwertig: die spezifische Ladung</span>
          <span class="pho-rz-f">e/m<sub>e</sub> = 2·U/(B²·r²)</span>
          <span class="pho-rz-v">${_fsrExp(sp, 4)} C/kg</span></div>
        <div class="fpm-note">Abweichung vom Literaturwert 9,109 · 10⁻³¹ kg: ${_fpmNum(abw, 1)} %.
          Sie stammt fast vollständig vom Ablesen des Durchmessers: r geht quadratisch ein, ein
          Millimeter Lesefehler wirkt sich also doppelt aus – bei kleinen Kreisen besonders stark.</div>`;
    } else {
      rch.innerHTML = '<div class="fpm-note">Stelle eine Kreisbahn ein, die in den Kolben passt.</div>';
    }
  }

  const tb = document.getElementById('fsrTakeBtn');
  if (tb) tb.disabled = !(an && _fsrPasst());

  _fsrRenderDrei();
  _fsrRenderStat();
  _fsrRenderSchraube();
}

function _fsrRenderDrei() {
  const el = document.getElementById('fsrDrei'); if (!el) return;
  const raus = _fsr.richtung > 0;
  el.innerHTML =
    `<div class="git-sch-kopf">Drei-Finger-Regel – in welche Richtung wird der Strahl gebogen?</div>
     <div class="fsr-drei-text">
       Nimm die <b>rechte Hand</b>. Der <b>Daumen</b> zeigt in die technische Stromrichtung – das ist
       <i>entgegen</i> der Bewegungsrichtung der Elektronen, denn sie sind negativ geladen. Der
       <b>Zeigefinger</b> zeigt in Richtung des Magnetfeldes, der <b>Mittelfinger</b> dann in Richtung
       der Lorentzkraft. Diese Kraft steht immer senkrecht auf der Bewegung; sie ändert deshalb nur die
       Richtung, nie den Betrag der Geschwindigkeit – und taugt gerade deshalb als Zentripetalkraft.
     </div>
     <div class="fsr-drei-jetzt">Im Moment zeigt das Magnetfeld <b>${raus ? 'aus dem Bildschirm heraus' : 'in den Bildschirm hinein'}</b>.
       Die Elektronen verlassen die Kanone waagerecht nach rechts, also zeigt der Daumen nach links.
       Die Lorentzkraft weist damit nach <b>${raus ? 'oben' : 'unten'}</b> – ${raus
         ? 'dorthin liegt der Mittelpunkt, und der Kreis steht auf der Kanone.'
         : 'der Strahl wird nach unten gebogen und trifft sofort die Glaswand.'}</div>`;
}

// ── Auswertung: Mittelwert und Spannweite ──────────────
function _fsrStatistik() {
  if (!_fsr.rows.length) return null;
  const ms = _fsr.rows.map(r => r.m);
  const mit = ms.reduce((a, b) => a + b, 0) / ms.length;
  const min = Math.min(...ms), max = Math.max(...ms);
  return { n: ms.length, mit, min, max, spanne: max - min,
           abw: (mit - _FSR_ME) / _FSR_ME * 100 };
}
function _fsrRenderStat() {
  const el = document.getElementById('fsrStat'); if (!el) return;
  const s = _fsrStatistik();
  if (!s) {
    el.innerHTML = '<div class="fpm-note">Noch keine Messwerte. Nimm in Station 1 mehrere Kreisbahnen bei verschiedenen Spulenströmen und Spannungen auf.</div>';
    return;
  }
  const cls = Math.abs(s.abw) < 3 ? 'ok' : Math.abs(s.abw) < 8 ? 'mid' : 'no';
  el.innerHTML =
    `<div class="fsr-stat-reihe">
       <div class="fsr-kachel"><span>Messwerte</span><b>${s.n}</b></div>
       <div class="fsr-kachel gross"><span>Mittelwert m<sub>e</sub></span><b>${_fsrExp(s.mit, 3)} kg</b></div>
       <div class="fsr-kachel"><span>kleinster Wert</span><b>${_fpmNum(s.min / 1e-31, 3)}</b></div>
       <div class="fsr-kachel"><span>größter Wert</span><b>${_fpmNum(s.max / 1e-31, 3)}</b></div>
       <div class="fsr-kachel"><span>Spannweite</span><b>${_fpmNum(s.spanne / 1e-31, 3)}</b></div>
       <div class="fsr-kachel ${cls}"><span>gegen 9,109 · 10⁻³¹ kg</span><b>${_fpmNum(s.abw, 1)} %</b></div>
     </div>
     <div class="fpm-note">Die Handreichung schlägt genau dieses Vorgehen vor: mitteln, die
       <b>Spannweite</b> als Fehlerabschätzung angeben und mit dem Literaturwert vergleichen. Alle
       Messwerte in 10⁻³¹ kg. Die Streuung kommt fast ausschließlich vom abgelesenen Durchmesser –
       große Kreise liefern deshalb die genaueren Werte.</div>`;
}

// ── Auswertungsdiagramm ────────────────────────────────
// Alle drei Auftragungen sind Linearisierungen von m_e = e·B²·r²/(2U).
const _FSR_PRESETS = [
  { xl: 'U in V', yl: 'B²·r² in 10⁻⁹ T²m²',
    x: r => r.U, y: r => r.B * r.B * r.r * r.r / 1e-9,
    origin: true,
    mAus: k => k * 1e-9 * _FSR_E / 2,
    note: 'Die Auftragung, die jeden Messwert brauchen kann – ganz gleich, bei welchem Strom und welcher Spannung er aufgenommen wurde.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)',
    form: 'B²·r² = (2·m_e/e) · U',
    param: () => 'gesucht: die Steigung 2·m_e/e',
    term: () => _dspZahl(2 * _FSR_ME / _FSR_E / 1e-9) + '*x',
    deutung: 'Aus m_e = e·B²·r²/(2·U) folgt B²·r² = (2·m_e/e)·U. Die Steigung ist also 2·m_e/e, und daraus ergibt sich m_e = Steigung · e/2. Weil hier Spannung und Spulenstrom frei gemischt werden dürfen, ist das die belastbarste Auswertung.' },

  { xl: '1/B in 1/mT', yl: 'r in cm',
    x: r => 1 / (r.B * 1000), y: r => r.r * 100,
    origin: true, gruppe: r => Math.round(r.U), gruppeName: U => U + ' V',
    mAus: (k, U) => _FSR_E * k * k / (2 * U * 1e10),
    note: 'Bei fester Beschleunigungsspannung wächst der Bahnradius proportional zu 1/B. Für jede Spannung entsteht eine eigene Ursprungsgerade.',
    typ: 'Ursprungsgerade je Beschleunigungsspannung',
    form: 'r = √(2·U·m_e/e) · (1/B)',
    param: () => 'Steigung = √(2·U·m_e/e), hier für U = ' + Math.round(_fsr.U) + ' V',
    term: () => _dspZahl(Math.sqrt(2 * _fsr.U * _FSR_ME / _FSR_E) * 1e5) + '*x',
    deutung: 'Aus m_e·v = e·B·r und v = √(2·e·U/m_e) folgt r = √(2·U·m_e/e)/B. Bei fester Spannung ist das eine Ursprungsgerade in 1/B. Aus ihrer Steigung k folgt m_e = e·k²/(2·U). Jede Spannung liefert eine eigene Gerade – die steilere gehört zur höheren Spannung.' },

  { xl: '√U in √V', yl: 'r in cm',
    x: r => Math.sqrt(r.U), y: r => r.r * 100,
    origin: true, gruppe: r => Math.round(r.I * 100) / 100, gruppeName: I => _fpmNum(I, 2) + ' A',
    mAus: (k, I) => _FSR_E * k * k * 1e-4 * _fsrBFormel(I) * _fsrBFormel(I) / 2,
    note: 'Bei festem Spulenstrom wächst der Bahnradius proportional zur Wurzel aus der Spannung. Für jeden Strom entsteht eine eigene Ursprungsgerade.',
    typ: 'Ursprungsgerade je Spulenstrom',
    form: 'r = (1/B)·√(2·m_e/e) · √U',
    param: () => 'Steigung = √(2·m_e/e)/B, hier für I = ' + _fpmNum(_fsr.I, 2) + ' A',
    term: () => _dspZahl(Math.sqrt(2 * _FSR_ME / _FSR_E) / _fsrBFormel(_fsr.I) * 100) + '*x',
    deutung: 'Dieselbe Beziehung, nur nach der Spannung sortiert: r = √(2·m_e/e)·√U/B. Dass hier die Wurzel aus U steht und nicht U selbst, ist eine gute Probe auf die Herleitung – wer sich beim Quadrieren vertut, bekommt hier eine gekrümmte Kurve statt einer Geraden.' }
];

const _FSR_FARBEN = ['#0369a1', '#db2777', '#16a34a', '#f97316', '#7c3aed', '#0f766e', '#b45309'];

function _fsrDrawPlot() {
  const cv = document.getElementById('fsrPlot');
  if (!cv || !_fsr) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _FSR_PRESETS[_fsr.preset];
  const padL = 62, padR = 16, padT = 14, padB = 42;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const pts = _fsr.rows.map(r => ({ x: P.x(r), y: P.y(r), r }))
    .filter(p => isFinite(p.x) && isFinite(p.y));
  const xmax = Math.max(1e-9, pts.length ? Math.max(...pts.map(p => p.x)) * 1.12 : 10);
  const ymax = Math.max(1e-9, pts.length ? Math.max(...pts.map(p => p.y)) * 1.15 : 10);

  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - v / ymax * (y0 - y1);

  const xt = _fpmTicks(xmax, 6);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 14);
  });
  const yt = _fpmTicks(ymax, 5);
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 6, Y(v) + 3);
  });

  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 30);
  ctx.save(); ctx.translate(15, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'right'; ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (!pts.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte – nimm zuerst Kreisbahnen in Station 1 auf', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('fsrFitBox');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    return;
  }

  if (_fsr.fn) {
    ctx.strokeStyle = '#db2777'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let started = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _fsr.fn((px - x0) / (x1 - x0) * xmax); } catch (err) { yv = NaN; }
      if (!isFinite(yv)) { started = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { started = false; continue; }
      started ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), started = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  // Ohne Gruppierung ein einziger Fit, sonst einer je Spannung bzw. Strom
  const gruppen = new Map();
  pts.forEach(p => {
    const g = P.gruppe ? P.gruppe(p.r) : 0;
    if (!gruppen.has(g)) gruppen.set(g, []);
    gruppen.get(g).push(p);
  });

  const info = [];
  [...gruppen.keys()].sort((a, b) => a - b).forEach((g, gi) => {
    const gp = gruppen.get(g);
    const col = P.gruppe ? _FSR_FARBEN[gi % _FSR_FARBEN.length] : '#0369a1';
    let fit = null;
    if (gp.length >= 2) {
      fit = P.origin ? _fpmFitOrigin(gp) : _fpmFitLinear(gp);
      if (fit) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(X(0), Y(fit.b || 0));
        ctx.lineTo(X(xmax), Y(fit.k * xmax + (fit.b || 0)));
        ctx.stroke();
      }
    }
    gp.forEach(p => {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 4, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke();
    });
    info.push({ g, col, fit, n: gp.length });
  });

  _fsrRenderFit(info, P);
}

function _fsrRenderFit(gruppen, P) {
  const el = document.getElementById('fsrFitBox'); if (!el) return;
  let html = '';
  gruppen.forEach(g => {
    if (!g.fit) return;
    const m = P.mAus(g.fit.k, g.g);
    const abw = Math.abs(m - _FSR_ME) / _FSR_ME * 100;
    const cls = abw < 3 ? 'ok' : abw < 8 ? 'mid' : 'no';
    html += `<div class="fpm-fitline">
       <span class="fpm-fitmeta">${P.gruppe ? '<span class="fpm-dot" style="background:' + g.col + '"></span>' + P.gruppeName(g.g) + ' · ' : ''}${g.n} Messwerte</span>
       <span class="fpm-fiteq">y = ${_fpmNum(g.fit.k, 5)}·x</span>
       <span class="fpm-fitmeta">R² = ${_fpmNum(g.fit.r2, 5)}</span>
       <span class="fpm-fiteq" style="color:#075985">m<sub>e</sub> = ${_fsrExp(m, 4)} kg</span>
       ${_fsr.reveal ? `<span class="fpm-badge ${cls}">Literaturwert 9,109 · 10⁻³¹ kg · Abweichung ${_fpmNum(abw, 2)} %</span>` : ''}
     </div>`;
  });
  if (!html) {
    const noetig = P.gruppe
      ? 'Mindestens zwei Messwerte bei <b>derselben</b> ' + (_fsr.preset === 1 ? 'Beschleunigungsspannung' : 'Stromstärke') + ' nötig.'
      : 'Mindestens zwei Messwerte nötig.';
    el.innerHTML = '<div class="fpm-note">' + noetig + '<br>' + P.note + '</div>';
    return;
  }
  if (gruppen.filter(g => g.fit).length >= 2 && P.gruppe) {
    html += `<div class="fpm-fitline" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">
       <span class="fpm-fitmeta">Jede Gerade liefert für sich einen Wert für die Elektronenmasse.
         Dass alle auf denselben Wert führen, obwohl die Geraden verschieden steil sind, ist die
         eigentliche Bestätigung der Herleitung.</span></div>`;
  }
  el.innerHTML = html + '<div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">' + P.note + '</div>';
}

// ── Theoriefunktion ────────────────────────────────────
function _fsrSetPreset(i) {
  _fsr.preset = i;
  for (let k = 0; k < 3; k++) document.getElementById('fsrTab' + k)?.classList.toggle('on', k === i);
  _fsrRefreshTheorie();
  _fsrDrawPlot();
}
function _fsrTheorieFn() {
  const term = _FSR_PRESETS[_fsr.preset].term();
  const inp = document.getElementById('fsrFn');
  if (inp) inp.value = term;
  _fsrSetFn(term);
  _fsr.fnAuto = true;
  _fsrRenderTheorie(true);
}
function _fsrClearFn() {
  const inp = document.getElementById('fsrFn');
  if (inp) inp.value = '';
  _fsrSetFn('');
  _fsrRenderTheorie(false);
}
function _fsrRefreshTheorie() {
  if (_fsr.fnAuto) {
    const term = _FSR_PRESETS[_fsr.preset].term();
    const inp = document.getElementById('fsrFn');
    if (inp) inp.value = term;
    _fsrSetFn(term);
    _fsr.fnAuto = true;
  }
  _fsrRenderTheorie(_fsr.fnAuto);
}
function _fsrRenderTheorie(eingesetzt) {
  const el = document.getElementById('fsrTheo'); if (!el) return;
  const P = _FSR_PRESETS[_fsr.preset];
  el.innerHTML =
    `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
     <div class="fpm-theo-typ">${P.typ}</div>
     <div class="fpm-theo-form">${P.form}</div>
     <div class="fpm-theo-par">${P.param()}</div>
     ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${P.term()}</div>` : ''}
     <div class="fpm-theo-deutung">${P.deutung}</div>`;
}
function _fsrSetFn(str) {
  _fsr.fnAuto = false;
  const err = document.getElementById('fsrFnErr');
  const v = (str || '').trim();
  if (!v) { _fsr.fn = null; if (err) err.textContent = ''; _fsrDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _fsr.fn = f; if (err) err.textContent = '';
  } catch (e) { _fsr.fn = null; if (err) err.textContent = e.message; }
  _fsrDrawPlot();
}

// ── Zeichnung Station 1 ────────────────────────────────
// Der Blick geht längs der Spulenachse: Die Spulen erscheinen als Kreise,
// die Kreisbahn der Elektronen liegt in der Bildebene.
function _fsrRenderRohr(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H);

  const SKALA = 1600;                       // Pixel je Meter
  const rKolben = 0.080 * SKALA;            // Glaskolben, Radius 8 cm
  const cx = W / 2, cy = 22 + rKolben;
  const gx = cx, gy = cy + rKolben - 2;     // Kanonenmuendung am Kolbenboden

  // Helmholtzspulen, leicht versetzt fuer die Tiefenwirkung
  [[-10, 'rgba(148,163,184,.26)'], [10, 'rgba(148,163,184,.42)']].forEach(v => {
    ctx.strokeStyle = v[1]; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.ellipse(cx + v[0], cy, rKolben + 26, rKolben + 22, 0, 0, 2 * Math.PI); ctx.stroke();
  });

  // Glaskolben
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, rKolben, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(30,41,59,.45)'; ctx.fill(); ctx.stroke();

  const an = _fsr.strahl;
  const raus = _fsr.richtung > 0;
  const rw = _fsrRWahr();
  const rpx = rw * SKALA;
  const problem = _fsrProblem();

  // Feldrichtung: Punkte heraus, Kreuze hinein
  if (an) {
    ctx.strokeStyle = 'rgba(56,189,248,.45)'; ctx.lineWidth = 1.1;
    ctx.fillStyle = '#38bdf8';
    for (let i = 0; i < 4; i++) {
      const fx = 24 + i * 13, fy = 30;
      ctx.beginPath(); ctx.arc(fx, fy, 4.5, 0, 2 * Math.PI); ctx.stroke();
      if (raus) { ctx.beginPath(); ctx.arc(fx, fy, 1.7, 0, 2 * Math.PI); ctx.fill(); }
      else {
        ctx.beginPath();
        ctx.moveTo(fx - 3.2, fy - 3.2); ctx.lineTo(fx + 3.2, fy + 3.2);
        ctx.moveTo(fx + 3.2, fy - 3.2); ctx.lineTo(fx - 3.2, fy + 3.2); ctx.stroke();
      }
    }
    ctx.fillStyle = '#38bdf8'; ctx.font = '8px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(raus ? 'B zeigt aus der Ebene heraus' : 'B zeigt in die Ebene hinein', 82, 33);
  }

  // Der leuchtende Faden
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, rKolben - 1, 0, 2 * Math.PI); ctx.clip();
  const faden = (pfad) => {
    [[9, 'rgba(125,211,252,.20)'], [4.5, 'rgba(186,230,253,.5)'], [1.8, '#e0f2fe']]
      .forEach(v => { ctx.strokeStyle = v[1]; ctx.lineWidth = v[0]; ctx.beginPath(); pfad(); ctx.stroke(); });
  };
  if (!an) {
    // Ohne Feld laeuft der Strahl geradeaus quer durch den Kolben
    faden(() => { ctx.moveTo(gx, gy); ctx.lineTo(gx + rKolben + 10, gy); });
  } else if (problem === 'verpolt') {
    // Nach unten gebogen: der Strahl trifft nach kurzer Strecke die Wand
    faden(() => ctx.arc(gx, gy + rpx, rpx, -Math.PI / 2, -Math.PI / 2 + 0.9));
  } else {
    // Mittelpunkt senkrecht ueber der Muendung, der Kreis steht auf der Kanone
    const my = gy - rpx;
    faden(() => ctx.arc(gx, my, rpx, 0, 2 * Math.PI));
    // Einzelne Elektronen als helle Punkte auf der Bahn
    _fsr.elektronen.forEach(p => {
      const w = Math.PI / 2 - 2 * Math.PI * p;
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.beginPath();
      ctx.arc(gx + rpx * Math.cos(w), my + rpx * Math.sin(w), 2.2, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
  ctx.restore();

  // Elektronenkanone unter dem Kolben, sie schiesst waagerecht nach rechts
  ctx.fillStyle = '#475569'; ctx.fillRect(gx - 44, gy - 9, 40, 20);
  ctx.fillStyle = '#f59e0b'; ctx.fillRect(gx - 41, gy - 5, 4, 12);
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(gx - 30, gy - 7, 4, 16);
  ctx.fillStyle = '#cbd5e1'; ctx.fillRect(gx - 18, gy - 6, 3, 14);
  ctx.fillStyle = '#94a3b8'; ctx.font = '7px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('1', gx - 39, gy + 19); ctx.fillText('2', gx - 28, gy + 19); ctx.fillText('3', gx - 16, gy + 19);
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Elektronenkanone', gx - 46, gy + 30);

  // Durchmesser bemassen und die Skala danebenstellen
  if (an && problem === null) {
    const sx = gx + rpx + 16;
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.2; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(sx + 4, gy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx, gy - 2 * rpx); ctx.lineTo(sx + 4, gy - 2 * rpx); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(sx, gy); ctx.lineTo(sx, gy - 2 * rpx); ctx.stroke();
    [gy, gy - 2 * rpx].forEach(py => {
      ctx.beginPath(); ctx.moveTo(sx - 4, py); ctx.lineTo(sx + 4, py); ctx.stroke();
    });
    ctx.fillStyle = '#fbbf24'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
    ctx.save(); ctx.translate(sx + 8, gy - rpx); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('d = ' + _fpmNum(_fsrDAblesung() * 100, 1) + ' cm', 0, 0);
    ctx.restore();
  }

  // Millimeterskala im Rohr, an der der Durchmesser abgelesen wird
  const mx = gx - 14;
  ctx.strokeStyle = 'rgba(148,163,184,.5)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(mx, gy); ctx.lineTo(mx, gy - 0.11 * SKALA); ctx.stroke();
  ctx.font = '8px sans-serif'; ctx.textAlign = 'right';
  for (let mm = 0; mm <= 110; mm += 5) {
    const py = gy - mm / 1000 * SKALA;
    const lang = mm % 10 === 0, sehr = mm % 20 === 0;
    ctx.strokeStyle = lang ? 'rgba(148,163,184,.75)' : 'rgba(100,116,139,.6)';
    ctx.beginPath(); ctx.moveTo(mx, py); ctx.lineTo(mx - (sehr ? 9 : lang ? 6 : 3.5), py); ctx.stroke();
    if (sehr) { ctx.fillStyle = '#94a3b8'; ctx.fillText(String(mm / 10), mx - 11, py + 3); }
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif';
  ctx.fillText('Skala in cm', 10, H - 22);

  // Hinweise am Rand
  ctx.fillStyle = '#64748b'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Helmholtzspulen: n = ' + _FSR_N + ', R = 15,0 cm', 10, H - 8);
  ctx.textAlign = 'right';
  if (an && problem === 'verpolt') {
    ctx.fillStyle = '#f87171';
    ctx.fillText('Strahl nach unten – Spulen verpolt', W - 10, H - 8);
  } else if (an && problem) {
    ctx.fillStyle = '#f87171';
    ctx.fillText(problem === 'zu gross' ? 'Strahl trifft die Glaswand' : 'Kreis zu klein zum Ablesen', W - 10, H - 8);
  } else {
    ctx.fillStyle = an ? '#38bdf8' : '#64748b';
    ctx.fillText(an ? 'B = ' + _fpmNum(_fsrB() * 1000, 3) + ' mT' : 'Magnetfeld aus', W - 10, H - 8);
  }
  ctx.textAlign = 'left';
}

function _fsrRenderSchalt(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  const kasten = (x, y, w, h, txt, wert, col) => {
    ctx.fillStyle = '#fff'; ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#475569'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(txt, x + w / 2, y + 14);
    ctx.fillStyle = col; ctx.font = '700 11px sans-serif';
    ctx.fillText(wert, x + w / 2, y + 30);
  };

  kasten(14, 22, 108, 40, 'Beschleunigung', Math.round(_fsr.U) + ' V', '#0369a1');
  kasten(14, 74, 108, 40, 'Heizung Kathode', '6,3 V', '#f59e0b');
  kasten(W - 122, 48, 108, 40, 'Spulenstrom', _fpmNum(_fsr.I, 2) + ' A', '#16a34a');

  // Rohr in der Mitte
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(W / 2, 68, 46, 40, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Fadenstrahl-', W / 2, 64); ctx.fillText('rohr', W / 2, 76);

  // Leitungen
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(122, 42); ctx.lineTo(W / 2 - 46, 55);
  ctx.moveTo(122, 94); ctx.lineTo(W / 2 - 46, 82);
  ctx.moveTo(W - 122, 68); ctx.lineTo(W / 2 + 46, 68);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Die beiden Spulen liegen in Reihe, damit sie derselbe Strom gleichsinnig durchfließt.', W / 2, H - 8);
}

// ── Zeichnung Station 3 ────────────────────────────────
function _fsrRenderSchraubeCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H);

  const cy = H / 2, x0 = 46, x1 = W - 24;

  // Feldlinien längs der Achse
  ctx.strokeStyle = 'rgba(56,189,248,.28)'; ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    const y = cy + i * 32;
    ctx.beginPath(); ctx.moveTo(x0 - 24, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1 - 8, y - 3.5); ctx.lineTo(x1, y); ctx.lineTo(x1 - 8, y + 3.5); ctx.stroke();
  }
  ctx.fillStyle = '#38bdf8'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Magnetfeld B', 10, 18);

  const a = _fsrAlphaRad();
  const rs = _fsrRSchraube(), h = _fsrGanghoehe();
  const SK = 1500;
  let rpx = Math.min(58, rs * SK);
  let hpx = h * SK * 0.35;
  if (!isFinite(hpx)) hpx = 0;

  // Die Schraubenbahn: gleichförmig längs des Feldes, Kreis quer dazu
  ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 2;
  ctx.beginPath();
  let gezeichnet = false;
  for (let s = 0; s <= 900; s++) {
    const u = s / 100;                                   // Umläufe
    const px = x0 + u * hpx;
    if (px > x1) break;
    const py = cy - rpx * Math.cos(2 * Math.PI * u);
    gezeichnet ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), gezeichnet = true);
  }
  ctx.stroke();

  // Bei α = 0 bleibt nur die Gerade
  if (_fsr.alpha === 0) {
    ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x1, cy); ctx.stroke();
  }

  // Laufendes Elektron
  const u = (_fsr.t * 0.5) % 9;
  const epx = x0 + u * hpx, epy = cy - rpx * Math.cos(2 * Math.PI * u);
  if (epx <= x1) {
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(epx, epy, 3.4, 0, 2 * Math.PI); ctx.fill();
  }

  // Geschwindigkeitszerlegung an der Kanone
  const vlen = 54;
  const pfeil = (dx, dy, col, txt) => {
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x0 + dx, cy + dy); ctx.stroke();
    const L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    ctx.beginPath();
    ctx.moveTo(x0 + dx, cy + dy);
    ctx.lineTo(x0 + dx - 6 * ux + 3.5 * uy, cy + dy - 6 * uy - 3.5 * ux);
    ctx.lineTo(x0 + dx - 6 * ux - 3.5 * uy, cy + dy - 6 * uy + 3.5 * ux);
    ctx.closePath(); ctx.fill();
    ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(txt, x0 + dx + 5, cy + dy + 3);
  };
  pfeil(vlen * Math.cos(a), -vlen * Math.sin(a), '#fbbf24', 'v');
  if (_fsr.alpha > 2 && _fsr.alpha < 88) {
    pfeil(vlen * Math.cos(a), 0, '#4ade80', 'v∥');
    ctx.strokeStyle = 'rgba(248,113,113,.9)'; ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x0 + vlen * Math.cos(a), cy);
    ctx.lineTo(x0 + vlen * Math.cos(a), cy - vlen * Math.sin(a));
    ctx.stroke();
    ctx.fillStyle = '#f87171'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('v⊥', x0 + vlen * Math.cos(a) + 4, cy - vlen * Math.sin(a) / 2);
  }

  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('α = ' + Math.round(_fsr.alpha) + '°', 10, H - 10);
  ctx.textAlign = 'right';
  ctx.fillText(_fsr.alpha === 0 ? 'keine Ablenkung'
             : _fsr.alpha === 90 ? 'geschlossener Kreis'
             : 'Ganghöhe ' + _fpmNum(h * 100, 1) + ' cm', W - 10, H - 10);
  ctx.textAlign = 'left';
}

// ── Takt ───────────────────────────────────────────────
function _fsrTakt(dt) {
  if (!_fsr) return;
  _fsr.t += dt;
  if (_fsr.station === 0) {
    if (_fsr.elektronen.length < 14) _fsr.elektronen.push(Math.random());
    // Nicht die echte Umlauffrequenz von 33 MHz – die waere unsichtbar.
    // Die Anzeige laeuft langsamer, aber im richtigen Verhaeltnis: schnellere
    // Elektronen auf groesseren Kreisen brauchen gleich lang.
    for (let i = 0; i < _fsr.elektronen.length; i++) {
      _fsr.elektronen[i] = (_fsr.elektronen[i] + dt * 0.45) % 1;
    }
  }
}

function _fsrRender() {
  if (!_fsr) return;
  if (_fsr.station === 0) {
    const a = document.getElementById('fsrRohr');
    if (a) _fsrRenderRohr(a.getContext('2d'), a);
    const b = document.getElementById('fsrSchalt');
    if (b) _fsrRenderSchalt(b.getContext('2d'), b);
  } else if (_fsr.station === 2) {
    const c = document.getElementById('fsrSchraube');
    if (c) _fsrRenderSchraubeCv(c.getContext('2d'), c);
  }
}

// ── Zusätzliche Styles ─────────────────────────────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .fsr-quellen { display: flex; gap: 5px; }
    .fsr-quelle { flex: 1 1 0; display: flex; flex-direction: column; gap: 2px; align-items: flex-start;
      padding: 6px 8px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 9px; cursor: pointer; }
    .fsr-quelle:hover { border-color: #cbd5e1; }
    .fsr-quelle.on { border-color: #0369a1; background: #f0f9ff; }
    .fsr-quelle-n { font-size: .74rem; font-weight: 800; color: #475569; }
    .fsr-quelle.on .fsr-quelle-n { color: #075985; }
    .fsr-quelle-k { font-size: .64rem; color: #94a3b8; }
    .fsr-bvergleich { display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
      font-size: .72rem; color: #64748b; margin: 7px 0; }
    .fsr-bv { display: flex; flex-direction: column; }
    .fsr-bv span { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em;
      font-weight: 800; color: #94a3b8; }
    .fsr-bv b { font-size: .82rem; color: #0369a1; font-variant-numeric: tabular-nums; }
    .fsr-bv-ab { margin-left: auto; font-size: .7rem; color: #94a3b8; }
    .fsr-hall { font-size: .58rem; font-weight: 800; color: #fff; background: #0369a1;
      border-radius: 4px; padding: 0 3px; }
    .fsr-zustand { font-size: .78rem; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 9px; padding: 8px 11px; margin: 8px 0; line-height: 1.5; }
    .fsr-zustand.ok { background: #f0f9ff; border-color: #bae6fd; color: #075985; }
    .fsr-zustand.aus { background: #fffbeb; border-color: #fde68a; color: #b45309; }
    .fsr-rechnung { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 4px 11px; }
    .fsr-drei { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-top: 12px; }
    .fsr-drei-text { font-size: .79rem; color: #475569; line-height: 1.65; margin-top: 4px; }
    .fsr-drei-jetzt { font-size: .78rem; color: #075985; background: #f0f9ff; border: 1px solid #bae6fd;
      border-radius: 8px; padding: 8px 10px; margin-top: 8px; line-height: 1.55; }
    .fsr-stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 10px 12px; }
    .fsr-stat-reihe { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 8px; }
    .fsr-kachel { flex: 1 1 92px; display: flex; flex-direction: column; gap: 2px;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 7px 9px; }
    .fsr-kachel span { font-size: .62rem; text-transform: uppercase; letter-spacing: .04em;
      font-weight: 800; color: #94a3b8; }
    .fsr-kachel b { font-size: .92rem; color: #1e293b; font-variant-numeric: tabular-nums; }
    .fsr-kachel.gross { flex: 2 1 180px; }
    .fsr-kachel.gross b { color: #0369a1; }
    .fsr-kachel.ok b { color: #15803d; }
    .fsr-kachel.mid b { color: #b45309; }
    .fsr-kachel.no b { color: #b91c1c; }
    .fsr-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();
// ═══════════════════════════════════════════════════════
// ELEKTRONENBEUGUNGSROEHRE
// Schluesselexperiment 07 der NRW-Handreichung.
// Gemessen wird der Durchmesser der beiden Beugungsringe auf dem
// Leuchtschirm; daraus folgt die de-Broglie-Wellenlaenge der Elektronen
// und – als eigentliches Ergebnis – das Plancksche Wirkungsquantum.
// ═══════════════════════════════════════════════════════

const _EBR_H   = 6.626e-34;   // Plancksches Wirkungsquantum in Js (Sollwert)
const _EBR_ME  = 9.109e-31;   // Elektronenmasse in kg (aus dem Fadenstrahlrohr)
const _EBR_E   = 1.602e-19;   // Elementarladung in C (aus dem Millikanversuch)
const _EBR_C   = 2.998e8;     // Lichtgeschwindigkeit in m/s

// Geraetedaten aus der Handreichung
const _EBR_L   = 0.135;       // Abstand Graphitfolie – Leuchtschirm in m
const _EBR_D1  = 123e-12;     // kleinerer Netzebenenabstand des Graphits in m
const _EBR_D2  = 213e-12;     // groesserer Netzebenenabstand des Graphits in m
const _EBR_RS  = 0.045;       // Radius des Leuchtschirms in m
const _EBR_ABL = 0.001;       // Ableseschaerfe auf der Schirmskala: 1 mm

// Der kleinere Netzebenenabstand erzeugt den groesseren Ring.
// Ring 0 = innen (gehoert zu d2), Ring 1 = aussen (gehoert zu d1).
const _EBR_RINGE = [
  { name: 'innerer Ring', d: _EBR_D2, kurz: 'd₂ = 213 pm', farbe: '#0369a1' },
  { name: 'äußerer Ring', d: _EBR_D1, kurz: 'd₁ = 123 pm', farbe: '#db2777' }
];

const _EBR_HEIZ_MIN = 150;    // darunter emittiert die Kathode nicht
const _EBR_WARM_S   = 6;      // Anheizdauer in s (real etwa eine halbe Minute)

let _ebr = null;

function _ebrInit() {
  _ebr = {
    station: 0,
    U: 4000,            // Beschleunigungsspannung in V
    heiz: 0,            // Heizstrom in mA
    warm: 0,            // Aufheizgrad 0..1
    dunkel: false,      // Raum verdunkelt?
    abgeklebt: false,   // zentrales Maximum abgeklebt?
    rows: [], nextId: 1,
    preset: 0, fn: null, fnAuto: false, reveal: false,
    ringFn: 0,          // fuer welchen Ring die Theoriefunktion gilt
    drehzahl: 0,        // Kreuzgitter in Station 3, Umdrehungen pro Sekunde
    gitterPhase: 0,
    objekt: 2,
    t: 0
  };
}

// ── Physik ─────────────────────────────────────────────
// de-Broglie-Wellenlaenge nach dem Durchlaufen der Spannung U:
// e·U = ½·m_e·v²  und  λ = h/(m_e·v)  ⇒  λ = h/√(2·m_e·e·U)
function _ebrLambda(U) { return _EBR_H / Math.sqrt(2 * _EBR_ME * _EBR_E * U); }
function _ebrV(U) { return Math.sqrt(2 * _EBR_E * U / _EBR_ME); }

// Bragg-Bedingung k·λ = 2·d·sin ϑ mit k = 1, Ablenkung um 2ϑ, tan 2ϑ = R/L
function _ebrTheta(U, d) {
  const s = _ebrLambda(U) / (2 * d);
  return s >= 1 ? NaN : Math.asin(s);
}
function _ebrDurchmesser(U, d) {
  const th = _ebrTheta(U, d);
  return isFinite(th) ? 2 * _EBR_L * Math.tan(2 * th) : NaN;
}
// Was der Schueler auf der Millimeterskala abliest
function _ebrDAbles(U, d) {
  const D = _ebrDurchmesser(U, d);
  return isFinite(D) ? Math.round(D / _EBR_ABL) * _EBR_ABL : NaN;
}
// Rueckweg: aus dem abgelesenen Durchmesser die Wellenlaenge
function _ebrLamAus(D, d) { return 2 * d * Math.sin(0.5 * Math.atan(D / 2 / _EBR_L)); }
// Naeherung fuer kleine Winkel: λ ≈ d·R/L = d·D/(2·L)
function _ebrLamNaeh(D, d) { return d * D / (2 * _EBR_L); }
// Aus einer einzelnen Ringmessung folgt das Wirkungsquantum
function _ebrHAus(lam, U) { return lam * Math.sqrt(2 * _EBR_ME * _EBR_E * U); }

// ── Zustand der Roehre ─────────────────────────────────
// Unterhalb des Mindestheizstroms loest die Kathode keine Elektronen aus;
// darueber braucht die Emission Zeit, bis sie stabil ist.
function _ebrEmission() {
  if (!_ebr || _ebr.heiz < _EBR_HEIZ_MIN) return 0;
  const anteil = Math.min(1, (_ebr.heiz - _EBR_HEIZ_MIN) / 100);
  return anteil * _ebr.warm;
}
function _ebrHellig() {
  // Der Strahlstrom waechst mit der Beschleunigungsspannung
  return _ebrEmission() * Math.min(1, _ebr.U / 3500);
}
function _ebrProblem() {
  if (_ebr.heiz < _EBR_HEIZ_MIN) return 'kalt';
  if (_ebr.warm < 0.98) return 'heizt';
  if (!_ebr.dunkel) return 'hell';
  if (_ebrRingPasst(1) === false) return 'zu gross';
  return null;
}
function _ebrRingPasst(ring) {
  const D = _ebrDurchmesser(_ebr.U, _EBR_RINGE[ring].d);
  return isFinite(D) && D / 2 <= _EBR_RS;
}
function _ebrBereit() { return _ebrProblem() === null; }

// ── Zehnerpotenzen ─────────────────────────────────────
const _EBR_HOCH = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function _ebrExp(v, d) {
  if (!isFinite(v)) return '—';
  if (v === 0) return '0';
  const ex = Math.floor(Math.log10(Math.abs(v)));
  const m = v / Math.pow(10, ex);
  const hoch = String(ex).split('').map(c => _EBR_HOCH[c] || c).join('');
  return _fpmNum(m, d) + ' · 10' + hoch;
}

// ── Oberfläche ─────────────────────────────────────────
function _ebrHTML() {
  const stationen = ['1 · Beugungsröhre', '2 · Das Wirkungsquantum',
                     '3 · Optisches Analogon', '4 · Materie als Welle']
    .map((s, i) => `<button class="fpm-tab${i === _ebr.station ? ' on' : ''}" id="ebrSt${i}" onclick="_ebrSetStation(${i})">${s}</button>`).join('');

  const presets = ['1/√U → D', 'U → 1/λ²', 'λ<sub>Theorie</sub> → λ<sub>Messung</sub>'].map((p, i) =>
    `<button class="fpm-tab${i === _ebr.preset ? ' on' : ''}" id="ebrTab${i}" onclick="_ebrSetPreset(${i})">${p}</button>`).join('');

  const objekte = _EBR_OBJEKTE.map((o, i) =>
    `<button class="ebr-obj${i === _ebr.objekt ? ' on' : ''}" id="ebrObj${i}" onclick="_ebrSetObjekt(${i})">
       <span class="ebr-obj-n">${o.n}</span><span class="ebr-obj-k">${o.k}</span></button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim ebr-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">💫 Elektronenbeugung: das Schlüsselexperiment</h3>
    <canvas id="ebrTakt" width="1" height="1" style="display:none"></canvas>
    <div class="fpm-tabs">${stationen}</div>

    <!-- ══ Station 1 ══ -->
    <div id="ebrS0">
      <div class="fpm-grid">
        <div>
          <canvas id="ebrSchirm" width="420" height="340" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Blick auf den Leuchtschirm – die Skala misst in Millimetern</div>
          <canvas id="ebrRohr" width="420" height="152" class="phys-anim-cv"></canvas>
          <div class="fpm-note">Die Elektronen verlassen die Glühkathode K, werden durch die
            Anodenspannung beschleunigt und durchsetzen in der durchbohrten Anode A eine dünne
            Schicht aus <b>polykristallinem Graphit</b>. Die Zylinder Z₁, Z₂, Z₃ bilden eine
            elektrostatische Linse, die den Strahl bündelt.</div>
        </div>
        <div>
          <div class="fpm-label">Kathodenheizung</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Heizstrom: <b id="ebrHeizLbl">0 mA</b></span>
            <input type="range" id="ebrHeiz" min="0" max="300" step="5" value="0"
              oninput="_ebrSetHeiz(this.value)" style="width:100%;accent-color:#b45309">
          </div>
          <div class="ebr-heizbar"><div class="ebr-heizbar-f" id="ebrHeizBar"></div></div>
          <div class="fpm-label">Beschleunigungsspannung</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">U<sub>A</sub>: <b id="ebrULbl">4,00 kV</b></span>
            <input type="range" id="ebrU" min="2000" max="5000" step="50" value="4000"
              oninput="_ebrSetU(this.value)" style="width:100%;accent-color:#7c3aed">
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" id="ebrDunkelBtn" onclick="_ebrToggleDunkel()">🌑 Raum verdunkeln</button>
            <button class="sim-btn" id="ebrKlebBtn" onclick="_ebrToggleKleb()">⬤ Zentrum abkleben</button>
          </div>
          <div class="ebr-zustand" id="ebrZustand"></div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Geschwindigkeit v</span><span class="fpm-ro-v" id="ebrVA">—</span><span class="fpm-ro-u">10⁷ m/s</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">innerer Ring D₁</span><span class="fpm-ro-v" id="ebrD1A">—</span><span class="fpm-ro-u">mm</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">äußerer Ring D₂</span><span class="fpm-ro-v" id="ebrD2A">—</span><span class="fpm-ro-u">mm</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">λ aus dem inneren Ring</span><span class="fpm-ro-v" id="ebrL1A">—</span><span class="fpm-ro-u">pm</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">λ aus dem äußeren Ring</span><span class="fpm-ro-v" id="ebrL2A">—</span><span class="fpm-ro-u">pm</span></div>
          </div>
          <div class="ebr-rechnung" id="ebrRechnung"></div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="ebrTakeBtn" onclick="_ebrTake()">✓ Messwert übernehmen</button>
            <button class="sim-btn" onclick="_ebrDemo()">📋 Beispielmessreihe</button>
            <button class="sim-btn" onclick="_ebrClear()">🗑 Tabelle leeren</button>
          </div>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>Nr.</th><th>U<sub>A</sub> (kV)</th><th>D₁ (mm)</th><th>D₂ (mm)</th><th>λ₁ (pm)</th><th>λ₂ (pm)</th><th></th></tr></thead>
              <tbody id="ebrTbody"></tbody>
            </table>
            <div class="fpm-empty" id="ebrEmpty">Noch keine Messwerte.<br>Kathode heizen, Raum verdunkeln, Ringdurchmesser ablesen.</div>
          </div>
        </div>
      </div>
      <div class="ebr-bragg" id="ebrBragg"></div>
    </div>

    <!-- ══ Station 2 ══ -->
    <div id="ebrS1" style="display:none">
      <div class="fpm-label">Jede einzelne Ringmessung liefert einen Wert für h</div>
      <div class="fsr-stat" id="ebrStat"></div>
      <div class="fpm-label" style="margin-top:12px">Grafische Auswertung nach Linearisierung</div>
      <div class="fpm-tabs">${presets}</div>
      <div class="fpm-grid2">
        <canvas id="ebrPlot" width="470" height="340" class="phys-chart-cv"></canvas>
        <div>
          <div class="fpm-fit" id="ebrFitBox"></div>
          <div class="fpm-label" style="margin-top:10px">Funktion plotten</div>
          <input type="text" id="ebrFn" class="fpm-input" placeholder="z. B. 1560*x" spellcheck="false"
            oninput="_ebrSetFn(this.value)">
          <div class="fpm-err" id="ebrFnErr"></div>
          <div class="sim-btn-row" style="padding:2px 0 4px" id="ebrFnBtns"></div>
          <div class="fpm-theo" id="ebrTheo"></div>
          <label class="fpm-check"><input type="checkbox" onchange="_ebrSet('reveal',this.checked)">
            Literaturwert anzeigen</label>
        </div>
      </div>
    </div>

    <!-- ══ Station 3 ══ -->
    <div id="ebrS2" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="ebrGitter" width="420" height="316" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Laserlicht durch ein Kreuzgitter – das Gitter lässt sich drehen</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Drehzahl des Gitters: <b id="ebrDrehLbl">0,0 /s</b></span>
            <input type="range" id="ebrDreh" min="0" max="20" step="0.1" value="0"
              oninput="_ebrSetDreh(this.value)" style="width:100%;accent-color:#dc2626">
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_ebrSetDreh(0)">still</button>
            <button class="sim-btn" onclick="_ebrSetDreh(1.5)">langsam</button>
            <button class="sim-btn" onclick="_ebrSetDreh(20)">schnell</button>
          </div>
        </div>
        <div>
          <div class="ebr-analog" id="ebrAnalog"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 4 ══ -->
    <div id="ebrS3" style="display:none">
      <div class="fpm-grid">
        <div>
          <div class="fpm-label">Wähle ein Objekt</div>
          <div class="ebr-objs">${objekte}</div>
          <div class="fpm-note">Alle Werte nach λ = h/(m·v). Die Zahlen für Tischtennisball und
            Elektron stehen so in der Handreichung.</div>
        </div>
        <div>
          <div class="fpm-label">Materiewellenlänge</div>
          <div class="ebr-rechnung" id="ebrObjRechnung"></div>
          <canvas id="ebrSkala" width="420" height="132" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Größenvergleich auf logarithmischer Achse</div>
        </div>
      </div>
    </div>

    <div id="ebrErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>λ = h / (m<sub>e</sub> · v)</b> &nbsp;|&nbsp; <b>λ = h / √(2·m<sub>e</sub>·e·U<sub>A</sub>)</b>
      &nbsp;|&nbsp; <b>λ = 2·d·sin(½·arctan(R/L))</b>
    </p>
  </div>`;
}

function _ebrErklHTML() {
  return `<div class="dsp-erkl-kopf">Der kognitive Konflikt</div>
    <div class="dsp-erkl-text">
      Im Fadenstrahlrohr haben sich Elektronen wie kleine Kugeln verhalten: Sie tragen Ladung und
      Masse, sie werden von Kräften abgelenkt, sie fliegen auf berechenbaren Bahnen. Schickt man
      dieselben Elektronen aber durch eine dünne Graphitfolie, dann erwartet man auf dem Schirm
      einen hellen Fleck, der von innen nach außen gleichmäßig dunkler wird – die Elektronen werden
      ja an den Atomen in alle Richtungen gestreut. Man sieht stattdessen <b>konzentrische Ringe</b>.
      Ringe sind ein Interferenzmuster, und Interferenz ist etwas, das nur Wellen zeigen.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">De Broglies Hypothese</div>
    <div class="dsp-erkl-text">
      1924 stellte der Doktorand <b>Louis de Broglie</b> eine sehr kühne Vermutung auf. Vom Licht
      wusste man damals schon, dass es sich in manchen Versuchen als Welle und in anderen als
      Teilchenstrom zeigt. Für Photonen folgt aus E = h·f zusammen mit E = c·p sofort λ = h/p.
      De Broglie schlug vor, diese Beziehung <b>auf alle Materie</b> zu übertragen:
      <b>λ = h/p = h/(m·v)</b>. Es gab dafür keinerlei Beleg – es war eine Aussage über die
      Symmetrie der Natur: Das Universum besteht aus Materie und Strahlung, also soll für beide
      dasselbe gelten. Wichtig dabei: Weder Welle noch Korpuskel <i>ist</i> das Elektron. Beides
      sind <b>Modelle</b>, also Werkzeuge unseres Denkens, mit denen wir jeweils einen Teil der
      Beobachtungen beschreiben können. Dass zwei Modelle nebeneinander nötig sind, nennt man
      <b>Welle-Teilchen-Dualismus</b>.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum man das nie vorher bemerkt hat</div>
    <div class="dsp-erkl-text">
      Beugung zeigt sich erst, wenn die Öffnungen etwa so klein sind wie die Wellenlänge. Weil h so
      winzig ist, hat ein Tischtennisball die Wellenlänge 6,6 · 10⁻³² m – dafür gibt es kein Gitter
      im Universum. Erst bei sehr kleinen Massen wird λ messbar: Ein Elektron mit v = 0,01·c kommt
      auf etwa 2,4 · 10⁻¹⁰ m, und das liegt im Bereich der Röntgenwellenlängen. Und ein Gitter
      dieser Feinheit gibt es tatsächlich – nämlich <b>Kristalle</b>. Genau diesen Weg hatten Vater
      und Sohn Bragg 1913 schon für Röntgenstrahlen beschritten.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Wie die Ringe entstehen</div>
    <div class="dsp-erkl-text">
      Die Graphitschicht besteht aus vielen winzigen Kristallen, die ungeordnet nebeneinander
      liegen – sie ist <b>polykristallin</b>. Ihre Netzebenen bilden mit dem einfallenden Strahl alle möglichen Winkel – darunter
      immer auch solche, die die <b>Bragg-Bedingung k·λ = 2·d·sin ϑ</b> erfüllen. Diese Kristalle
      lenken den Strahl um 2ϑ ab. Weil um die Strahlachse herum Kristalle in jeder Drehlage
      vorkommen, verlassen die abgelenkten Elektronen die Folie auf dem <b>Mantel eines Kegels</b>,
      und der Schirm schneidet daraus einen Kreis. Graphit hat zwei verschiedene Netzebenenabstände,
      d₁ = 123 pm und d₂ = 213 pm – deshalb zwei Ringe. Beide sind Maxima <b>erster</b> Ordnung;
      das erkennt man daran, dass der größere Radius nicht das Doppelte des kleineren ist.
      Und weil sin ϑ mit kleinerem d wächst, gehört der <b>größere Ring zum kleineren
      Netzebenenabstand</b> – eine Vertauschung, die beim Auswerten gern passiert.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Davisson und Germer – ein Zufall</div>
    <div class="dsp-erkl-text">
      Den ersten Nachweis lieferten am 6. Januar 1927 <b>Clinton Davisson</b> und <b>Lester Germer</b>
      in den Laboratorien der Bell Telephone Company in New York – ohne de Broglies Arbeit zu kennen.
      Sie untersuchten die Reflexion von Elektronen an Nickel. Nachdem ein Leck im Vakuumsystem eine
      Oxidschicht hatte entstehen lassen, erhitzten sie die Probe, um sie zu säubern. Beim Abkühlen
      kristallisierte das Nickel – und plötzlich zeigte die Streuintensität Maxima und Minima. Die
      beiden erkannten die Tragweite ihrer Zufallsentdeckung und gingen der Sache gezielt nach.
      Schon 1925 hatte übrigens Walter Elsasser in den <i>Naturwissenschaften</i> genau diesen
      Versuch vorgeschlagen; auch davon wussten sie nichts.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Was die Wellen bedeuten</div>
    <div class="dsp-erkl-text">
      De Broglie deutete mit seiner Hypothese auch die Bohrsche Quantenbedingung: Aus
      m·v·r = n·ħ folgt 2π·r = n·h/(m·v) = n·λ. Der Bahnumfang enthält also genau ganzzahlig viele
      Wellenlängen – die erlaubten Bahnen sind die, auf denen eine <b>stehende Welle</b> passt.
      Ende 1925 griff <b>Erwin Schrödinger</b> diese Idee auf und baute sie zu einer vollständigen
      Theorie aus.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Simulation und echte Röhre</div>
    <div class="dsp-erkl-text">
      Diese Simulation berechnet die Ringdurchmesser aus der ebenen Geometrie
      D = 2·L·tan(2ϑ) – also genau so, wie die Handreichung auswertet. Der Leuchtschirm einer
      echten Röhre ist aber gewölbt, und der Abstand L lässt sich nicht sauber messen. Deshalb
      liegen die im Handbuch protokollierten Messwerte (22,8 pm und 22,5 pm bei U = 3,6 kV) rund
      10 % über dem theoretischen Wert von 20,4 pm. Hier stimmt beides zusammen; die Abweichungen,
      die du siehst, kommen allein vom Ablesen auf Millimeter genau.
    </div>
    <div class="dsp-erkl-warn">⚠ Im echten Versuch: Die Beschleunigungsspannung von bis zu 4 kV ist
      berührungsgefährlich. Warnschild aufstellen, Erdung anschließen, einen Widerstand zur
      Strombegrenzung einbauen (die Kathode ist empfindlich) und die Vorgaben der RiSU einhalten.</div>`;
}

// ── Stationen ──────────────────────────────────────────
function _ebrSetStation(i) {
  _ebr.station = i;
  for (let k = 0; k < 4; k++) {
    document.getElementById('ebrSt' + k)?.classList.toggle('on', k === i);
    const d = document.getElementById('ebrS' + k);
    if (d) d.style.display = k === i ? 'block' : 'none';
  }
  _ebrUpdate();
  if (i === 1) _ebrDrawPlot();
}
function _ebrSet(key, val) { _ebr[key] = val; _ebrDrawPlot(); }

// ── Bedienung Station 1 ────────────────────────────────
function _ebrSetU(v) {
  _ebr.U = Math.max(2000, Math.min(5000, +v));
  const sl = document.getElementById('ebrU'); if (sl) sl.value = String(_ebr.U);
  const el = document.getElementById('ebrULbl'); if (el) el.textContent = _fpmNum(_ebr.U / 1000, 2) + ' kV';
  _ebrUpdate();
}
function _ebrSetHeiz(v) {
  const alt = _ebr.heiz;
  _ebr.heiz = Math.max(0, Math.min(300, +v));
  // Faellt der Strom unter die Schwelle, kuehlt die Kathode aus und muss neu anheizen
  if (_ebr.heiz < _EBR_HEIZ_MIN) _ebr.warm = 0;
  else if (alt < _EBR_HEIZ_MIN) _ebr.warm = 0;
  const sl = document.getElementById('ebrHeiz'); if (sl) sl.value = String(_ebr.heiz);
  const el = document.getElementById('ebrHeizLbl'); if (el) el.textContent = Math.round(_ebr.heiz) + ' mA';
  _ebrUpdate();
}
function _ebrToggleDunkel() {
  _ebr.dunkel = !_ebr.dunkel;
  const b = document.getElementById('ebrDunkelBtn');
  if (b) b.textContent = _ebr.dunkel ? '☀ Licht anschalten' : '🌑 Raum verdunkeln';
  _ebrUpdate();
}
function _ebrToggleKleb() {
  _ebr.abgeklebt = !_ebr.abgeklebt;
  const b = document.getElementById('ebrKlebBtn');
  if (b) b.textContent = _ebr.abgeklebt ? '○ Abklebung entfernen' : '⬤ Zentrum abkleben';
  _ebrUpdate();
}

function _ebrTake() {
  if (!_ebrBereit()) return;
  const D1 = _ebrDAbles(_ebr.U, _EBR_D2);   // innerer Ring
  const D2 = _ebrDAbles(_ebr.U, _EBR_D1);   // aeusserer Ring
  const l1 = _ebrLamAus(D1, _EBR_D2), l2 = _ebrLamAus(D2, _EBR_D1);
  _ebr.rows.push({ id: _ebr.nextId++, U: _ebr.U,
                   D: [D1, D2], lam: [l1, l2],
                   h: [_ebrHAus(l1, _ebr.U), _ebrHAus(l2, _ebr.U)] });
  _ebrRenderTable();
  _ebrDrawPlot();
}
function _ebrDelRow(id) { _ebr.rows = _ebr.rows.filter(r => r.id !== id); _ebrRenderTable(); _ebrDrawPlot(); }
function _ebrClear() {
  if (_ebr.rows.length && !confirm('Alle ' + _ebr.rows.length + ' Messwerte löschen?')) return;
  _ebr.rows = []; _ebrRenderTable(); _ebrDrawPlot();
}
// Eine Messreihe ueber den ganzen einstellbaren Spannungsbereich
function _ebrDemo() {
  [2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000].forEach(U => {
    const D1 = _ebrDAbles(U, _EBR_D2), D2 = _ebrDAbles(U, _EBR_D1);
    if (!isFinite(D1) || !isFinite(D2) || D2 / 2 > _EBR_RS) return;
    const l1 = _ebrLamAus(D1, _EBR_D2), l2 = _ebrLamAus(D2, _EBR_D1);
    _ebr.rows.push({ id: _ebr.nextId++, U, D: [D1, D2], lam: [l1, l2],
                     h: [_ebrHAus(l1, U), _ebrHAus(l2, U)] });
  });
  _ebrRenderTable();
  _ebrDrawPlot();
}
function _ebrRenderTable() {
  // Die Statistik haengt an denselben Daten – sonst bleibt nach dem Leeren
  // der Tabelle der alte Mittelwert stehen.
  _ebrRenderStat();
  const tb = document.getElementById('ebrTbody'); if (!tb) return;
  const empty = document.getElementById('ebrEmpty');
  if (empty) empty.style.display = _ebr.rows.length ? 'none' : 'block';
  tb.innerHTML = _ebr.rows.map((r, i) =>
    `<tr><td>${i + 1}</td><td>${_fpmNum(r.U / 1000, 2)}</td>
       <td>${_fpmNum(r.D[0] * 1000, 0)}</td><td>${_fpmNum(r.D[1] * 1000, 0)}</td>
       <td><b>${_fpmNum(r.lam[0] * 1e12, 2)}</b></td><td><b>${_fpmNum(r.lam[1] * 1e12, 2)}</b></td>
       <td class="fpm-del" onclick="_ebrDelRow(${r.id})" title="löschen">✕</td></tr>`).join('');
}

// ── Anzeige Station 1 ──────────────────────────────────
function _ebrUpdate() {
  if (!_ebr) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const sicht = _ebrBereit();
  const D1 = _ebrDAbles(_ebr.U, _EBR_D2), D2 = _ebrDAbles(_ebr.U, _EBR_D1);

  set('ebrVA', _fpmNum(_ebrV(_ebr.U) / 1e7, 3));
  set('ebrD1A', sicht ? _fpmNum(D1 * 1000, 0) : '—');
  set('ebrD2A', sicht ? _fpmNum(D2 * 1000, 0) : '—');
  set('ebrL1A', sicht ? _fpmNum(_ebrLamAus(D1, _EBR_D2) * 1e12, 2) : '—');
  set('ebrL2A', sicht ? _fpmNum(_ebrLamAus(D2, _EBR_D1) * 1e12, 2) : '—');

  const bar = document.getElementById('ebrHeizBar');
  if (bar) bar.style.width = Math.round(_ebr.warm * 100) + '%';

  const z = document.getElementById('ebrZustand');
  if (z) {
    const p = _ebrProblem();
    if (p === 'kalt') {
      z.className = 'ebr-zustand aus';
      z.innerHTML = 'Die Kathode ist kalt und gibt keine Elektronen ab. <b>Heizstrom langsam '
        + 'hochregeln</b> – ab etwa ' + _EBR_HEIZ_MIN + ' mA setzt die Emission ein.';
    } else if (p === 'heizt') {
      z.className = 'ebr-zustand';
      z.innerHTML = 'Die Kathode heizt auf. Bis die Emission stabil ist, dauert es einen Moment – '
        + 'in der echten Röhre etwa eine halbe Minute.';
    } else if (p === 'hell') {
      z.className = 'ebr-zustand aus';
      z.innerHTML = 'Das Leuchten des Zinksulfidschirms ist viel zu schwach für den hellen Raum. '
        + '<b>Erst im verdunkelten Raum</b> lassen sich die Beugungsringe erkennen.';
    } else if (p === 'zu gross') {
      z.className = 'ebr-zustand aus';
      z.innerHTML = 'Der äußere Ring ist größer als der Leuchtschirm und läuft an dessen Rand '
        + 'hinaus. <b>Spannung erhöhen</b> – dann werden die Elektronen schneller, ihre '
        + 'Wellenlänge kleiner und die Ringe enger.';
    } else {
      z.className = 'ebr-zustand ok';
      z.innerHTML = '<b>Beide Ringe liegen vollständig auf dem Schirm.</b> Durchmesser an der '
        + 'Millimeterskala ablesen und übernehmen.';
    }
  }

  const rch = document.getElementById('ebrRechnung');
  if (rch) {
    if (sicht) {
      const lt = _ebrLambda(_ebr.U);
      const l1 = _ebrLamAus(D1, _EBR_D2), l2 = _ebrLamAus(D2, _EBR_D1);
      const h1 = _ebrHAus(l1, _ebr.U), h2 = _ebrHAus(l2, _ebr.U);
      const n1 = _ebrLamNaeh(D1, _EBR_D2);
      rch.innerHTML = `
        <div class="pho-rz"><span class="pho-rz-t">aus der Spannung – de-Broglie-Hypothese</span>
          <span class="pho-rz-f">λ = h/√(2·m<sub>e</sub>·e·U<sub>A</sub>)</span>
          <span class="pho-rz-v">${_fpmNum(lt * 1e12, 2)} pm</span></div>
        <div class="pho-rz"><span class="pho-rz-t">aus dem inneren Ring, d₂ = 213 pm</span>
          <span class="pho-rz-f">λ = 2·d₂·sin(½·arctan(R₁/L))</span>
          <span class="pho-rz-v">${_fpmNum(l1 * 1e12, 2)} pm</span></div>
        <div class="pho-rz"><span class="pho-rz-t">aus dem äußeren Ring, d₁ = 123 pm</span>
          <span class="pho-rz-f">λ = 2·d₁·sin(½·arctan(R₂/L))</span>
          <span class="pho-rz-v">${_fpmNum(l2 * 1e12, 2)} pm</span></div>
        <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">daraus das Wirkungsquantum</span>
          <span class="pho-rz-f">h = λ · √(2·m<sub>e</sub>·e·U<sub>A</sub>)</span>
          <span class="pho-rz-v">${_ebrExp((h1 + h2) / 2, 4)} Js</span></div>
        <div class="fpm-note">Zum Vergleich die Näherung für kleine Winkel, λ ≈ d·D/(2·L):
          ${_fpmNum(n1 * 1e12, 2)} pm für den inneren Ring – hier noch dicht am exakten Wert.
          Beim äußeren Ring ist der Winkel größer und die Näherung schlechter.</div>`;
    } else {
      rch.innerHTML = '<div class="fpm-note">Sobald die Ringe sichtbar sind, läuft die Auswertung hier mit.</div>';
    }
  }

  const tb = document.getElementById('ebrTakeBtn');
  if (tb) tb.disabled = !sicht;

  _ebrRenderBragg();
  _ebrRenderStat();
  _ebrRenderAnalog();
  _ebrRenderObjekt();
}

function _ebrRenderBragg() {
  const el = document.getElementById('ebrBragg'); if (!el) return;
  const th1 = _ebrTheta(_ebr.U, _EBR_D2), th2 = _ebrTheta(_ebr.U, _EBR_D1);
  const g = v => _fpmNum(v * 180 / Math.PI, 2);
  el.innerHTML =
    `<div class="git-sch-kopf">Die Bragg-Bedingung – warum überhaupt Ringe entstehen</div>
     <div class="ebr-bragg-text">
       Jeder einzelne Mikrokristall der Graphitfolie wirkt wie ein winziges Gitter. Trifft der
       Elektronenstrahl seine Netzebenen unter dem Winkel ϑ, so verstärken sich die an
       benachbarten Ebenen gestreuten Wellen genau dann, wenn der Gangunterschied ein Vielfaches
       der Wellenlänge ist: <b>k·λ = 2·d·sin ϑ</b>, hier mit k = 1. Der Strahl wird dann um
       <b>2ϑ</b> abgelenkt. Die Folie enthält Kristalle in <i>jeder</i> Drehlage um die
       Strahlachse – die abgelenkten Elektronen bilden deshalb einen Kegelmantel, und der ebene
       Schirm schneidet daraus einen Kreis. Aus tan 2ϑ = R/L folgt umgekehrt
       <b>λ = 2·d·sin(½·arctan(R/L))</b>.
     </div>
     <div class="ebr-bragg-jetzt">
       Bei U<sub>A</sub> = ${_fpmNum(_ebr.U / 1000, 2)} kV ist λ = ${_fpmNum(_ebrLambda(_ebr.U) * 1e12, 2)} pm.
       Daraus folgt für den <b>inneren</b> Ring (d₂ = 213 pm) ein Glanzwinkel ϑ = ${g(th1)}° und
       eine Ablenkung um ${g(2 * th1)}°, für den <b>äußeren</b> Ring (d₁ = 123 pm)
       ϑ = ${g(th2)}° und eine Ablenkung um ${g(2 * th2)}°. Der kleinere Netzebenenabstand
       verlangt den größeren Winkel – deshalb gehört der <b>größere Ring zum kleineren d</b>.
     </div>`;
}

// ── Auswertung: das Wirkungsquantum ────────────────────
// Jede einzelne Ringmessung liefert einen eigenen Wert fuer h.
function _ebrStatistik() {
  if (!_ebr.rows.length) return null;
  const hs = [];
  _ebr.rows.forEach(r => { hs.push(r.h[0], r.h[1]); });
  const mit = hs.reduce((a, b) => a + b, 0) / hs.length;
  const min = Math.min(...hs), max = Math.max(...hs);
  return { n: hs.length, mit, min, max, spanne: max - min,
           abw: (mit - _EBR_H) / _EBR_H * 100 };
}
function _ebrRenderStat() {
  const el = document.getElementById('ebrStat'); if (!el) return;
  const s = _ebrStatistik();
  if (!s) {
    el.innerHTML = '<div class="fpm-note">Noch keine Messwerte. Nimm in Station 1 die Ringdurchmesser bei verschiedenen Beschleunigungsspannungen auf.</div>';
    return;
  }
  const cls = Math.abs(s.abw) < 2 ? 'ok' : Math.abs(s.abw) < 6 ? 'mid' : 'no';
  el.innerHTML =
    `<div class="fsr-stat-reihe">
       <div class="fsr-kachel"><span>Einzelwerte</span><b>${s.n}</b></div>
       <div class="fsr-kachel gross"><span>Mittelwert h</span><b>${_ebrExp(s.mit, 4)} Js</b></div>
       <div class="fsr-kachel"><span>kleinster Wert</span><b>${_fpmNum(s.min / 1e-34, 3)}</b></div>
       <div class="fsr-kachel"><span>größter Wert</span><b>${_fpmNum(s.max / 1e-34, 3)}</b></div>
       <div class="fsr-kachel"><span>Spannweite</span><b>${_fpmNum(s.spanne / 1e-34, 3)}</b></div>
       <div class="fsr-kachel ${cls}"><span>gegen 6,626 · 10⁻³⁴ Js</span><b>${_fpmNum(s.abw, 1)} %</b></div>
     </div>
     <div class="fpm-note">Aus jeder Ringmessung folgt h = λ · √(2·m<sub>e</sub>·e·U<sub>A</sub>),
       wobei λ aus dem Durchmesser stammt. Alle Werte in 10⁻³⁴ Js. Mitteln, die <b>Spannweite</b>
       als Fehlerabschätzung angeben und mit dem Literaturwert vergleichen – so wertet eine
       Lerngruppe aus. Bemerkenswert ist, was hier eigentlich passiert: Aus einem Ring auf einem
       Leuchtschirm wird die Naturkonstante bestimmt, die die gesamte Quantenphysik trägt.</div>`;
}

// ── Auswertungsdiagramm ────────────────────────────────
// Alle drei Auftragungen pruefen dieselbe Aussage λ = h/√(2·m_e·e·U).
const _EBR_PRESETS = [
  { xl: '1/√U in 1/√V', yl: 'Ringdurchmesser D in mm',
    x: (r) => 1 / Math.sqrt(r.U), y: (r, g) => r.D[g] * 1000,
    origin: true, ringe: true,
    // D ≈ 2·L·λ/d = (2·L·h/(d·√(2·m_e·e))) · 1/√U   (Naeherung kleiner Winkel)
    aus: (k, g) => {
      const hh = k / 1000 * _EBR_RINGE[g].d * Math.sqrt(2 * _EBR_ME * _EBR_E) / (2 * _EBR_L);
      return { txt: 'h = ' + _ebrExp(hh, 4) + ' Js', abw: Math.abs(hh - _EBR_H) / _EBR_H * 100 };
    },
    term: g => _dspZahl(2 * _EBR_L * _EBR_H / (_EBR_RINGE[g].d * Math.sqrt(2 * _EBR_ME * _EBR_E)) * 1000) + '*x',
    note: 'Die direkteste Auftragung: Der abgelesene Durchmesser gegen 1/√U. Weil hier die Näherung für kleine Winkel steckt, ist der äußere Ring leicht gekrümmt.',
    typ: 'Ursprungsgerade je Ring',
    form: 'D = (2·L·h / (d·√(2·m_e·e))) · 1/√U',
    param: () => 'gesucht: die Steigung, denn sie enthält h',
    deutung: 'Für kleine Winkel gilt λ ≈ d·R/L, also D ≈ 2·L·λ/d. Mit λ = h/√(2·m_e·e·U) wird daraus eine Ursprungsgerade in 1/√U. Aus ihrer Steigung k folgt h = k·d·√(2·m_e·e)/(2·L). Beide Ringe müssen auf denselben Wert führen, obwohl ihre Geraden sehr verschieden steil sind – das ist die eigentliche Probe. Der äußere Ring liefert dabei den etwas schlechteren Wert, weil sein Ablenkwinkel für die Näherung schon zu groß ist.' },

  { xl: 'U in V', yl: '1/λ² in 10⁻³ pm⁻²',
    x: (r) => r.U, y: (r, g) => 1 / Math.pow(r.lam[g] * 1e12, 2) / 1e-3,
    origin: true, ringe: false,
    // 1/λ² = (2·m_e·e/h²)·U
    aus: (k) => {
      const hh = Math.sqrt(2 * _EBR_ME * _EBR_E / (k * 1e21));
      return { txt: 'h = ' + _ebrExp(hh, 4) + ' Js', abw: Math.abs(hh - _EBR_H) / _EBR_H * 100 };
    },
    term: () => _dspZahl(2 * _EBR_ME * _EBR_E / (_EBR_H * _EBR_H) / 1e21) + '*x',
    note: 'Hier wird die exakte Formel λ = 2·d·sin(½·arctan(R/L)) verwendet – deshalb liegen beide Ringe auf derselben Geraden und die Näherungsfehler fallen weg.',
    typ: 'eine Ursprungsgerade für beide Ringe',
    form: '1/λ² = (2·m_e·e / h²) · U',
    param: () => 'gesucht: die Steigung 2·m_e·e/h²',
    deutung: 'Quadriert man λ = h/√(2·m_e·e·U) und stürzt um, so steht dort 1/λ² = (2·m_e·e/h²)·U – eine Ursprungsgerade. Aus der Steigung k folgt h = √(2·m_e·e/k). Dass hier die Punkte beider Ringe auf einer einzigen Geraden liegen, ist der schärfste Test des Experiments: Zwei völlig verschiedene Netzebenenabstände liefern dieselbe Wellenlänge.' },

  { xl: 'λ aus der Spannung in pm', yl: 'λ aus dem Ringmuster in pm',
    x: (r) => _ebrLambda(r.U) * 1e12, y: (r, g) => r.lam[g] * 1e12,
    origin: true, ringe: false,
    aus: (k) => ({ txt: 'Steigung = ' + _fpmNum(k, 4), abw: Math.abs(k - 1) * 100 }),
    term: () => '1*x',
    note: 'Die Nagelprobe auf de Broglie: Wellenlänge aus der Teilchengröße Spannung gegen Wellenlänge aus dem Wellenphänomen Interferenz.',
    typ: 'Ursprungsgerade mit der Steigung 1',
    form: 'λ_Messung = 1 · λ_Theorie',
    param: () => 'erwartet: Steigung 1,000',
    deutung: 'Auf der x-Achse steht die Wellenlänge, die de Broglie aus einer reinen Teilchengröße vorhersagt – der Beschleunigungsspannung. Auf der y-Achse steht die Wellenlänge, die das Interferenzmuster liefert, also eine reine Welleneigenschaft. Beide haben zunächst nichts miteinander zu tun. Dass die Punkte trotzdem auf der Winkelhalbierenden liegen, ist der Inhalt der de-Broglie-Hypothese. Abweichungen entstehen nur durch das Ablesen auf Millimeter genau.' }
];

function _ebrDrawPlot() {
  const cv = document.getElementById('ebrPlot');
  if (!cv || !_ebr) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _EBR_PRESETS[_ebr.preset];
  const padL = 62, padR = 16, padT = 14, padB = 42;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const pts = [];
  _ebr.rows.forEach(r => {
    for (let g = 0; g < 2; g++) {
      const x = P.x(r, g), y = P.y(r, g);
      if (isFinite(x) && isFinite(y)) pts.push({ x, y, g });
    }
  });
  const xmax = Math.max(1e-12, pts.length ? Math.max(...pts.map(p => p.x)) * 1.12 : 10);
  const ymax = Math.max(1e-12, pts.length ? Math.max(...pts.map(p => p.y)) * 1.15 : 10);

  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - v / ymax * (y0 - y1);

  const xt = _fpmTicks(xmax, 6);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 14);
  });
  const yt = _fpmTicks(ymax, 5);
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 6, Y(v) + 3);
  });

  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 30);
  ctx.save(); ctx.translate(15, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'right'; ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (!pts.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte – lies zuerst in Station 1 die Ringe ab', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('ebrFitBox');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    _ebrRenderFnBtns();
    return;
  }

  if (_ebr.fn) {
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let started = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _ebr.fn((px - x0) / (x1 - x0) * xmax); } catch (err) { yv = NaN; }
      if (!isFinite(yv)) { started = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { started = false; continue; }
      started ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), started = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  // Bei P.ringe bekommt jeder Ring eine eigene Gerade, sonst eine gemeinsame
  const info = [];
  const zeichneFit = (gp, col, g) => {
    let fit = null;
    if (gp.length >= 2) {
      fit = P.origin ? _fpmFitOrigin(gp) : _fpmFitLinear(gp);
      if (fit) {
        ctx.strokeStyle = col; ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(X(0), Y(fit.b || 0));
        ctx.lineTo(X(xmax), Y(fit.k * xmax + (fit.b || 0)));
        ctx.stroke();
      }
    }
    info.push({ g, col, fit, n: gp.length });
  };
  if (P.ringe) {
    for (let g = 0; g < 2; g++) zeichneFit(pts.filter(p => p.g === g), _EBR_RINGE[g].farbe, g);
  } else {
    zeichneFit(pts, '#7c3aed', null);
  }
  // Punkte immer in ihrer Ringfarbe – auch beim gemeinsamen Fit bleibt so
  // sichtbar, welcher Punkt von welchem Ring stammt.
  pts.forEach(p => {
    ctx.fillStyle = _EBR_RINGE[p.g].farbe;
    ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 4, 0, 2 * Math.PI); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke();
  });

  _ebrRenderFit(info, P);
  _ebrRenderFnBtns();
}

function _ebrRenderFit(gruppen, P) {
  const el = document.getElementById('ebrFitBox'); if (!el) return;
  let html = '';
  gruppen.forEach(gr => {
    if (!gr.fit) return;
    const e = P.aus(gr.fit.k, gr.g);
    const cls = e.abw < 2 ? 'ok' : e.abw < 6 ? 'mid' : 'no';
    const kopf = gr.g === null
      ? gr.n + ' Messpunkte aus beiden Ringen'
      : '<span class="fpm-dot" style="background:' + gr.col + '"></span>'
        + _EBR_RINGE[gr.g].name + ' · ' + _EBR_RINGE[gr.g].kurz + ' · ' + gr.n + ' Werte';
    html += `<div class="fpm-fitline">
       <span class="fpm-fitmeta">${kopf}</span>
       <span class="fpm-fiteq">y = ${_fpmNum(gr.fit.k, 5)}·x</span>
       <span class="fpm-fitmeta">R² = ${_fpmNum(gr.fit.r2, 5)}</span>
       <span class="fpm-fiteq" style="color:#5b21b6">${e.txt}</span>
       ${_ebr.reveal ? `<span class="fpm-badge ${cls}">${_ebr.preset === 2
         ? 'erwartet 1,000 · Abweichung ' + _fpmNum(e.abw, 2) + ' %'
         : 'Literaturwert 6,626 · 10⁻³⁴ Js · Abweichung ' + _fpmNum(e.abw, 2) + ' %'}</span>` : ''}
     </div>`;
  });
  if (!html) {
    el.innerHTML = '<div class="fpm-note">Mindestens zwei Messwerte nötig.<br>' + P.note + '</div>';
    return;
  }
  if (P.ringe && gruppen.filter(g => g.fit).length === 2) {
    html += `<div class="fpm-fitline" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">
       <span class="fpm-fitmeta">Die beiden Geraden sind unterschiedlich steil, weil die
         Netzebenenabstände verschieden sind. Dass sie trotzdem auf denselben Wert für h führen,
         ist die eigentliche Bestätigung.</span></div>`;
  }
  el.innerHTML = html + '<div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">' + P.note + '</div>';
}

// ── Theoriefunktion ────────────────────────────────────
function _ebrSetPreset(i) {
  _ebr.preset = i;
  for (let k = 0; k < 3; k++) document.getElementById('ebrTab' + k)?.classList.toggle('on', k === i);
  if (!_EBR_PRESETS[i].ringe) _ebr.ringFn = 0;
  _ebrRefreshTheorie();
  _ebrDrawPlot();
}
// Bei der Auftragung 1/√U → D gehoert zu jedem Ring eine eigene Theoriegerade.
function _ebrRenderFnBtns() {
  const el = document.getElementById('ebrFnBtns'); if (!el) return;
  const P = _EBR_PRESETS[_ebr.preset];
  const btn = P.ringe
    ? [0, 1].map(g => `<button class="sim-btn${_ebr.ringFn === g && _ebr.fnAuto ? ' primary' : ''}"
         onclick="_ebrTheorieFn(${g})">ƒ ${_EBR_RINGE[g].name}</button>`).join('')
    : `<button class="sim-btn primary" onclick="_ebrTheorieFn(0)">ƒ Theoriefunktion</button>`;
  el.innerHTML = btn + '<button class="sim-btn" onclick="_ebrClearFn()">Feld leeren</button>';
}
function _ebrTheorieFn(g) {
  _ebr.ringFn = g || 0;
  const term = _EBR_PRESETS[_ebr.preset].term(_ebr.ringFn);
  const inp = document.getElementById('ebrFn');
  if (inp) inp.value = term;
  _ebrSetFn(term);
  _ebr.fnAuto = true;
  _ebrRenderTheorie(true);
  _ebrRenderFnBtns();
}
function _ebrClearFn() {
  const inp = document.getElementById('ebrFn');
  if (inp) inp.value = '';
  _ebrSetFn('');
  _ebrRenderTheorie(false);
  _ebrRenderFnBtns();
}
function _ebrRefreshTheorie() {
  if (_ebr.fnAuto) {
    const term = _EBR_PRESETS[_ebr.preset].term(_ebr.ringFn);
    const inp = document.getElementById('ebrFn');
    if (inp) inp.value = term;
    _ebrSetFn(term);
    _ebr.fnAuto = true;
  }
  _ebrRenderTheorie(_ebr.fnAuto);
  _ebrRenderFnBtns();
}
function _ebrRenderTheorie(eingesetzt) {
  const el = document.getElementById('ebrTheo'); if (!el) return;
  const P = _EBR_PRESETS[_ebr.preset];
  el.innerHTML =
    `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
     <div class="fpm-theo-typ">${P.typ}</div>
     <div class="fpm-theo-form">${P.form}</div>
     <div class="fpm-theo-par">${P.param()}${P.ringe ? ' – hier für den ' + _EBR_RINGE[_ebr.ringFn].name : ''}</div>
     ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${P.term(_ebr.ringFn)}</div>` : ''}
     <div class="fpm-theo-deutung">${P.deutung}</div>`;
}
function _ebrSetFn(str) {
  _ebr.fnAuto = false;
  const err = document.getElementById('ebrFnErr');
  const v = (str || '').trim();
  if (!v) { _ebr.fn = null; if (err) err.textContent = ''; _ebrDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _ebr.fn = f; if (err) err.textContent = '';
  } catch (e) { _ebr.fn = null; if (err) err.textContent = e.message; }
  _ebrDrawPlot();
}

// ── Station 3: optisches Analogon ──────────────────────
function _ebrSetDreh(v) {
  _ebr.drehzahl = Math.max(0, Math.min(20, +v));
  const sl = document.getElementById('ebrDreh'); if (sl) sl.value = String(_ebr.drehzahl);
  const el = document.getElementById('ebrDrehLbl'); if (el) el.textContent = _fpmNum(_ebr.drehzahl, 1) + ' /s';
  _ebrRenderAnalog();
}
// Das Auge mittelt ueber etwa 60 ms. Daraus folgt, wie weit ein Beugungsfleck
// waehrend dieser Zeit auf seinem Kreis wandert – und damit, ob man noch
// Punkte, schon Bogen oder nur noch Ringe sieht.
const _EBR_NACHBILD = 0.06;
function _ebrSchmierWinkel() {
  return Math.min(2 * Math.PI, 2 * Math.PI * _ebr.drehzahl * _EBR_NACHBILD);
}
function _ebrRenderAnalog() {
  const el = document.getElementById('ebrAnalog'); if (!el) return;
  const w = _ebrSchmierWinkel();
  const grad = w * 180 / Math.PI;
  let stand;
  if (_ebr.drehzahl < 0.05) {
    stand = 'Das Gitter steht still. Man sieht <b>einzelne Beugungsflecke</b> in einem regelmäßigen '
      + 'Muster – genau das, was ein Kreuzgitter erzeugt: In beiden Gitterrichtungen entsteht je '
      + 'eine Maximumfolge, zusammen ergibt das ein Punktraster.';
  } else if (grad < 120) {
    stand = 'Das Gitter dreht sich langsam. Die Flecke ziehen zu <b>kurzen Bögen</b> auseinander '
      + '(etwa ' + Math.round(grad) + '° pro Bogen), lassen sich aber noch einzeln verfolgen.';
  } else if (grad < 359) {
    stand = 'Die Bögen sind schon <b>' + Math.round(grad) + '° lang</b> und wachsen zusammen. '
      + 'Gleich sind die einzelnen Maxima nicht mehr auseinanderzuhalten.';
  } else {
    stand = 'Die Drehung ist so schnell, dass das Auge die einzelnen Maxima nicht mehr auflöst. '
      + 'Übrig bleiben <b>durchgehende Ringe</b> – dasselbe Bild wie in der Elektronenbeugungsröhre.';
  }
  el.innerHTML =
    `<div class="ebr-analog-stand">${stand}</div>
     <div class="dsp-erkl" style="margin-top:10px">
       <div class="dsp-erkl-kopf">Warum das genau die Beugungsringe erklärt</div>
       <div class="dsp-erkl-text">
         Ein einzelner Graphitkristall wäre wie das stillstehende Kreuzgitter: Er erzeugt einzelne
         Flecke. Die Graphitfolie ist aber <b>polykristallin</b> – sie besteht aus unzähligen
         Mikrokristallen, die alle in einer anderen Richtung liegen. Jeder von ihnen liefert sein
         eigenes Punktmuster, um einen anderen Winkel verdreht. Alle diese Muster zusammen ergeben
         geschlossene Ringe. Das schnelle Drehen des Kreuzgitters macht mit einem einzigen Gitter
         zeitlich dasselbe, was die Folie räumlich mit vielen Kristallen gleichzeitig tut.
       </div>
       <div class="dsp-erkl-text" style="margin-top:6px">
         Der Versuch ist auch aus einem zweiten Grund lehrreich: Hier <b>weiß</b> man, dass Licht
         eine Welle ist, und sieht Ringe. Dort sieht man dieselben Ringe – und muss daraus
         schließen, dass auch Elektronen sich wie Wellen verhalten können. Der Aufbau braucht nur
         einen Laser und ein Kreuzgitter auf einer drehbaren Scheibe.
       </div>
     </div>`;
}

// ── Station 4: Materiewellen im Alltag ─────────────────
const _EBR_OBJEKTE = [
  { n: 'Elektron, 0,01 · c', k: 'm = 9,1 · 10⁻³¹ kg, v = 3,0 · 10⁶ m/s', m: 9.109e-31, v: 3.0e6,
    txt: 'Das Beispiel aus der Handreichung. Die Wellenlänge liegt im Bereich der Röntgenstrahlung – und Gitter dieser Feinheit gibt es: Kristalle.' },
  { n: 'Elektron nach 4 kV', k: 'wie in dieser Röhre', m: 9.109e-31, v: null, U: 4000,
    txt: 'Die Elektronen in der Beugungsröhre. Ihre Wellenlänge ist noch einmal deutlich kleiner als die der Netzebenenabstände – deshalb sind die Beugungswinkel klein und die Ringe passen auf den Schirm.' },
  { n: 'Tischtennisball', k: 'm = 2,0 g, v = 5,0 m/s', m: 2.0e-3, v: 5.0,
    txt: 'Das Gegenbeispiel aus der Handreichung. Diese Wellenlänge ist nicht messbar – sie ist milliardenfach kleiner als ein Atomkern. Zum Vergleich: Röntgenstrahlen liegen zwischen 10⁻⁸ m und 10⁻¹³ m. Genau deshalb ist an Alltagsgegenständen nie ein Wellenverhalten aufgefallen.' },
  { n: 'C₆₀-Fulleren', k: 'm = 1,2 · 10⁻²⁴ kg, v = 200 m/s', m: 1.196e-24, v: 200,
    txt: 'Ein Molekül aus 60 Kohlenstoffatomen. 1999 gelang es einer Wiener Arbeitsgruppe um Anton Zeilinger, damit Interferenz zu erzeugen – de Broglies Hypothese gilt also nicht nur für Elementarteilchen, sondern auch für ganze Moleküle.' },
  { n: 'thermisches Neutron', k: 'm = 1,675 · 10⁻²⁷ kg, v = 2200 m/s', m: 1.675e-27, v: 2200,
    txt: 'Neutronen aus einem Reaktor haben Wellenlängen in der Größenordnung von Atomabständen. Die Neutronenbeugung ist heute ein Standardverfahren der Materialforschung.' },
  { n: 'Mensch beim Gehen', k: 'm = 70 kg, v = 1,4 m/s', m: 70, v: 1.4,
    txt: 'Auch für einen Menschen gilt λ = h/(m·v). Der Wert ist so unvorstellbar klein, dass die Frage nach Beugung sinnlos wird – aber die Formel gilt trotzdem. Das ist der Punkt der de-Broglie-Hypothese: Sie macht keine Ausnahmen.' }
];
// Vergleichsmarken auf der logarithmischen Achse
const _EBR_MARKEN = [
  { v: 1e-15, n: 'Atomkern' },
  { v: 123e-12, n: 'Graphit d₁' },
  { v: 1e-10, n: 'Atom' },
  { v: 5e-7, n: 'grünes Licht' },
  { v: 1e-3, n: 'Millimeter' }
];
function _ebrSetObjekt(i) {
  _ebr.objekt = Math.max(0, Math.min(_EBR_OBJEKTE.length - 1, i));
  for (let k = 0; k < _EBR_OBJEKTE.length; k++)
    document.getElementById('ebrObj' + k)?.classList.toggle('on', k === _ebr.objekt);
  _ebrRenderObjekt();
}
function _ebrObjV(o) { return o.v !== null && o.v !== undefined ? o.v : _ebrV(o.U); }
function _ebrObjLambda(o) { return _EBR_H / (o.m * _ebrObjV(o)); }
function _ebrRenderObjekt() {
  const el = document.getElementById('ebrObjRechnung'); if (!el) return;
  const o = _EBR_OBJEKTE[_ebr.objekt];
  const v = _ebrObjV(o), lam = _ebrObjLambda(o), p = o.m * v;
  el.innerHTML = `
    <div class="pho-rz"><span class="pho-rz-t">Masse</span>
      <span class="pho-rz-f">m</span>
      <span class="pho-rz-v">${_ebrExp(o.m, 3)} kg</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Geschwindigkeit${o.U ? ' aus U = ' + (o.U / 1000) + ' kV' : ''}</span>
      <span class="pho-rz-f">v</span>
      <span class="pho-rz-v">${_ebrExp(v, 3)} m/s</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Impuls</span>
      <span class="pho-rz-f">p = m · v</span>
      <span class="pho-rz-v">${_ebrExp(p, 3)} kg·m/s</span></div>
    <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Materiewellenlänge</span>
      <span class="pho-rz-f">λ = h / p</span>
      <span class="pho-rz-v">${_ebrExp(lam, 3)} m</span></div>
    <div class="fpm-note">${o.txt}</div>`;
  _ebrRenderSkala();
}
function _ebrRenderSkala() {
  const cv = document.getElementById('ebrSkala'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const lo = -36, hi = 0;             // Zehnerpotenzen von 10⁻³⁶ m bis 1 m
  const x0 = 22, x1 = W - 22, ya = 84;
  const X = e => x0 + (e - lo) / (hi - lo) * (x1 - x0);

  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, ya); ctx.lineTo(x1, ya); ctx.stroke();
  ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  for (let e = lo; e <= hi; e += 6) {
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(X(e), ya - 5); ctx.lineTo(X(e), ya + 5); ctx.stroke();
    const hoch = String(e).split('').map(c => _EBR_HOCH[c] || c).join('');
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(e === 0 ? '1 m' : '10' + hoch, X(e), ya + 17);
  }
  _EBR_MARKEN.forEach((mk, i) => {
    const e = Math.log10(mk.v);
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(X(e), ya); ctx.lineTo(X(e), ya + 26 + (i % 2) * 13); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(mk.n, X(e), ya + 36 + (i % 2) * 13);
  });

  const lam = _ebrObjLambda(_EBR_OBJEKTE[_ebr.objekt]);
  const e = Math.max(lo, Math.min(hi, Math.log10(lam)));
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(X(e), ya - 34); ctx.lineTo(X(e), ya); ctx.stroke();
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath(); ctx.arc(X(e), ya, 5, 0, 2 * Math.PI); ctx.fill();
  ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  const lbl = _ebrExp(lam, 2) + ' m';
  const lx = Math.max(x0 + 34, Math.min(x1 - 34, X(e)));
  ctx.fillText(lbl, lx, ya - 40);
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif';
  ctx.fillText(_EBR_OBJEKTE[_ebr.objekt].n, lx, ya - 52);
  ctx.textAlign = 'left';
}

// ── Zeichnung: Leuchtschirm ────────────────────────────
// Aufsicht auf den Zinksulfidschirm. Der Massstab bildet den Schirmradius
// von 4,5 cm auf 144 px ab, also 3,2 px je Millimeter.
const _EBR_PXMM = 3.2;
function _ebrRenderSchirm(ctx, cv) {
  const W = cv.width, H = cv.height;
  const cx = W / 2, cy = 158;
  const rs = _EBR_RS * 1000 * _EBR_PXMM;
  const dunkel = _ebr.dunkel;

  ctx.fillStyle = dunkel ? '#0b1020' : '#e8edf5';
  ctx.fillRect(0, 0, W, H);

  // Glaskolben mit Leuchtschirm
  ctx.fillStyle = dunkel ? '#111a2e' : '#f8fafc';
  ctx.beginPath(); ctx.arc(cx, cy, rs + 12, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = dunkel ? '#1e293b' : '#cbd5e1'; ctx.lineWidth = 2;
  ctx.stroke();

  const hell = _ebrHellig();
  if (hell > 0.01 && dunkel) {
    // Untergrund: gestreute Elektronen, nach aussen abnehmend
    const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, rs);
    gr.addColorStop(0, 'rgba(120,255,170,' + (0.20 * hell) + ')');
    gr.addColorStop(0.5, 'rgba(120,255,170,' + (0.07 * hell) + ')');
    gr.addColorStop(1, 'rgba(120,255,170,0)');
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.arc(cx, cy, rs, 0, 2 * Math.PI); ctx.fill();

    // Die beiden Beugungsringe erster Ordnung
    for (let g = 0; g < 2; g++) {
      const D = _ebrDurchmesser(_ebr.U, _EBR_RINGE[g].d);
      if (!isFinite(D)) continue;
      const rp = D / 2 * 1000 * _EBR_PXMM;
      if (rp > rs) continue;
      const staerke = (g === 0 ? 0.85 : 0.7) * hell;
      for (let s = 3; s >= 1; s--) {
        ctx.strokeStyle = 'rgba(150,255,190,' + (staerke * 0.30 / s) + ')';
        ctx.lineWidth = s * 4.5;
        ctx.beginPath(); ctx.arc(cx, cy, rp, 0, 2 * Math.PI); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(215,255,230,' + staerke + ')';
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(cx, cy, rp, 0, 2 * Math.PI); ctx.stroke();
    }

    // Zentrales Maximum – der ungebeugte Strahl, sehr viel heller
    if (_ebr.abgeklebt) {
      ctx.fillStyle = '#0b1020';
      ctx.beginPath(); ctx.arc(cx, cy, 13, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 13, 0, 2 * Math.PI); ctx.stroke();
    } else {
      const gz = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
      gz.addColorStop(0, 'rgba(255,255,255,' + hell + ')');
      gz.addColorStop(0.35, 'rgba(190,255,215,' + (0.8 * hell) + ')');
      gz.addColorStop(1, 'rgba(150,255,190,0)');
      ctx.fillStyle = gz;
      ctx.beginPath(); ctx.arc(cx, cy, 26, 0, 2 * Math.PI); ctx.fill();
    }
  } else if (!dunkel) {
    ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Im hellen Raum ist auf dem Schirm nichts zu erkennen.', cx, cy - 6);
    ctx.font = '11px sans-serif';
    ctx.fillText('Der Zinksulfidschirm leuchtet viel zu schwach.', cx, cy + 12);
    ctx.textAlign = 'left';
  } else {
    ctx.fillStyle = '#334155'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Der Schirm bleibt dunkel – es kommen keine Elektronen an.', cx, cy);
    ctx.textAlign = 'left';
  }

  // Millimeterskala quer über den Schirm
  const sy = cy + rs + 26;
  ctx.strokeStyle = dunkel ? '#475569' : '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(cx - rs, sy); ctx.lineTo(cx + rs, sy); ctx.stroke();
  ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  for (let mm = -45; mm <= 45; mm += 5) {
    const x = cx + mm * _EBR_PXMM;
    const gross = mm % 10 === 0;
    ctx.strokeStyle = dunkel ? '#475569' : '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, sy); ctx.lineTo(x, sy - (gross ? 7 : 4)); ctx.stroke();
    if (gross) {
      ctx.fillStyle = dunkel ? '#64748b' : '#94a3b8';
      ctx.fillText(String(Math.abs(mm)), x, sy + 12);
    }
  }

  // Bemassung der beiden Durchmesser
  if (hell > 0.01 && dunkel && _ebrBereit()) {
    for (let g = 0; g < 2; g++) {
      const D = _ebrDAbles(_ebr.U, _EBR_RINGE[g].d);
      const rp = D / 2 * 1000 * _EBR_PXMM;
      if (rp > rs) continue;
      const y = cy + (g === 0 ? -rs - 14 : rs + 12);
      ctx.strokeStyle = _EBR_RINGE[g].farbe; ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx - rp, y); ctx.lineTo(cx + rp, y);
      ctx.moveTo(cx - rp, y - 4); ctx.lineTo(cx - rp, y + 4);
      ctx.moveTo(cx + rp, y - 4); ctx.lineTo(cx + rp, y + 4);
      ctx.stroke();
      ctx.fillStyle = _EBR_RINGE[g].farbe; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('D' + (g === 0 ? '₁' : '₂') + ' = ' + _fpmNum(D * 1000, 0) + ' mm', cx, y - 7);
    }
  }
  ctx.textAlign = 'left';
}

// ── Zeichnung: Röhrenschema ────────────────────────────
// Laengsschnitt nach Abb. 7 der Handreichung.
function _ebrRenderRohr(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const my = 66;
  const kx = 34, ax = 148, sx = W - 40;

  // Glaskolben
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(kx - 12, my - 22);
  ctx.lineTo(ax + 40, my - 22);
  ctx.bezierCurveTo(sx - 20, my - 52, sx - 20, my + 52, ax + 40, my + 22);
  ctx.lineTo(kx - 12, my + 22);
  ctx.closePath(); ctx.stroke();

  // Kathodenwendel
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let i = 0; i <= 12; i++) {
    const y = my - 9 + i * 1.5;
    i === 0 ? ctx.moveTo(kx + (i % 2 ? 5 : -5), y) : ctx.lineTo(kx + (i % 2 ? 5 : -5), y);
  }
  ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('K', kx, my + 30);
  ctx.font = '9px sans-serif'; ctx.fillStyle = '#94a3b8';
  ctx.fillText('6 V', kx, my + 42);

  // Elektrostatische Linse Z1 Z2 Z3
  ['Z₁', 'Z₂', 'Z₃'].forEach((z, i) => {
    const x = kx + 30 + i * 30;
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x, my - 17); ctx.lineTo(x, my - 6);
    ctx.moveTo(x, my + 6); ctx.lineTo(x, my + 17);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '8px sans-serif';
    ctx.fillText(z, x, my - 22);
  });

  // Anode mit Graphitfolie
  ctx.strokeStyle = '#0f766e'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ax, my - 20); ctx.lineTo(ax, my - 4);
  ctx.moveTo(ax, my + 4); ctx.lineTo(ax, my + 20);
  ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif';
  ctx.fillText('A', ax, my + 33);
  ctx.fillStyle = '#0f766e'; ctx.font = '8px sans-serif';
  ctx.fillText('Graphitfolie', ax + 4, my - 26);

  // Strahlengang: ungebeugt und die beiden Beugungskegel
  const hell = _ebrHellig();
  const alpha = _ebr.dunkel && hell > 0.01 ? 0.9 : 0.28;
  ctx.strokeStyle = 'rgba(124,58,237,' + alpha + ')'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(kx + 8, my); ctx.lineTo(sx, my); ctx.stroke();

  for (let g = 0; g < 2; g++) {
    const D = _ebrDurchmesser(_ebr.U, _EBR_RINGE[g].d);
    if (!isFinite(D)) continue;
    // Der Schirm liegt L hinter der Folie; hier auf die Bildbreite umgerechnet
    const dy = (D / 2) / _EBR_L * (sx - ax);
    ctx.strokeStyle = _EBR_RINGE[g].farbe;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ax, my); ctx.lineTo(sx, my - dy);
    ctx.moveTo(ax, my); ctx.lineTo(sx, my + dy);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Leuchtschirm
  ctx.strokeStyle = _ebr.dunkel && hell > 0.01 ? '#4ade80' : '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(sx, my - 40); ctx.lineTo(sx, my + 40); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('Leuchtschirm', sx - 4, my + 52);

  // Bemassung L
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  const ly = my + 62;
  ctx.beginPath();
  ctx.moveTo(ax, ly); ctx.lineTo(sx, ly);
  ctx.moveTo(ax, ly - 4); ctx.lineTo(ax, ly + 4);
  ctx.moveTo(sx, ly - 4); ctx.lineTo(sx, ly + 4);
  ctx.stroke();
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('L = 13,5 cm', (ax + sx) / 2, ly - 5);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif';
  ctx.fillText('U_A bis 5 kV', kx + 26, H - 8);
}

// ── Zeichnung: Kreuzgitter ─────────────────────────────
// Ein Kreuzgitter erzeugt ein quadratisches Raster von Maxima. Beim Drehen
// wandert jedes Maximum auf einem Kreis um die Mitte; ist die Drehung schnell
// genug, verschmieren die Maxima zu geschlossenen Ringen.
function _ebrRenderGitter(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#0b1020'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = 152, a = 34;

  const w = _ebrSchmierWinkel();
  const kopien = w < 0.02 ? 1 : Math.max(2, Math.min(60, Math.round(w / 0.06)));

  for (let m = -3; m <= 3; m++) {
    for (let n = -3; n <= 3; n++) {
      const rr = Math.hypot(m, n) * a;
      if (rr > 142) continue;
      // Intensitaet nimmt mit der Ordnung ab; das nullte Maximum ist sehr hell
      const ord = Math.max(Math.abs(m), Math.abs(n));
      const int = ord === 0 ? 1 : 0.55 / (1 + 0.7 * (m * m + n * n));
      const grund = Math.atan2(n, m) + _ebr.gitterPhase;
      for (let c = 0; c < kopien; c++) {
        const ph = grund + (kopien === 1 ? 0 : (c / (kopien - 1) - 0.5) * w);
        const x = cx + rr * Math.cos(ph), y = cy + rr * Math.sin(ph);
        const al = int / (kopien === 1 ? 1 : Math.sqrt(kopien)) * 2.2;
        const rad = ord === 0 ? 9 : 4.5;
        const gr = ctx.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, 'rgba(255,120,120,' + Math.min(1, al) + ')');
        gr.addColorStop(0.4, 'rgba(230,40,40,' + Math.min(1, al * 0.6) + ')');
        gr.addColorStop(1, 'rgba(200,0,0,0)');
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, 2 * Math.PI); ctx.fill();
      }
    }
  }

  // Der Aufbau als kleine Skizze am oberen Rand
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.rect(14, 12, 30, 12); ctx.stroke();
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('HeNe-Laser', 14, 34);
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(44, 18); ctx.lineTo(96, 18); ctx.stroke();
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(104, 18, 9, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#64748b';
  ctx.fillText('drehbares Kreuzgitter', 96, 40);
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(113, 18); ctx.lineTo(W - 60, 18); ctx.stroke();
  ctx.fillStyle = '#64748b';
  ctx.fillText('Schirm', W - 58, 21);

  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(kopien === 1 ? 'Gitter steht still – einzelne Beugungsflecke'
    : (w >= 2 * Math.PI - 0.01 ? 'schnelle Drehung – geschlossene Ringe'
      : 'Drehung: die Flecke ziehen zu Bögen auseinander'), cx, H - 10);
  ctx.textAlign = 'left';
}

// ── Takt und Zeichnung ─────────────────────────────────
function _ebrTakt(dt) {
  if (!_ebr) return;
  const d = Math.min(0.05, dt);
  _ebr.t += d;
  if (_ebr.heiz >= _EBR_HEIZ_MIN) _ebr.warm = Math.min(1, _ebr.warm + d / _EBR_WARM_S);
  else _ebr.warm = Math.max(0, _ebr.warm - d / 2);
  _ebr.gitterPhase += 2 * Math.PI * _ebr.drehzahl * d * 0.15;
  if (_ebr.gitterPhase > 1e6) _ebr.gitterPhase = 0;
}
function _ebrRender() {
  if (!_ebr) return;
  if (_ebr.station === 0) {
    const cs = document.getElementById('ebrSchirm');
    if (cs) _ebrRenderSchirm(cs.getContext('2d'), cs);
    const cr = document.getElementById('ebrRohr');
    if (cr) _ebrRenderRohr(cr.getContext('2d'), cr);
    // Die Anzeige haengt am Aufheizgrad und muss deshalb mitlaufen
    if (_ebr.warm > 0 && _ebr.warm < 1) _ebrUpdate();
  } else if (_ebr.station === 2) {
    const cg = document.getElementById('ebrGitter');
    if (cg) _ebrRenderGitter(cg.getContext('2d'), cg);
  }
}

// ── Zusätzliche Styles für die Elektronenbeugung ───────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .ebr-heizbar { height: 5px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin: 3px 0 9px; }
    .ebr-heizbar-f { height: 100%; width: 0%; border-radius: 3px;
      background: linear-gradient(90deg, #fbbf24, #dc2626); transition: width .12s linear; }
    .ebr-zustand { font-size: .78rem; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 9px; padding: 8px 11px; margin: 8px 0; line-height: 1.5; }
    .ebr-zustand.ok { background: #f5f3ff; border-color: #ddd6fe; color: #5b21b6; }
    .ebr-zustand.aus { background: #fffbeb; border-color: #fde68a; color: #b45309; }
    .ebr-rechnung { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 4px 11px; }
    .ebr-bragg { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-top: 12px; }
    .ebr-bragg-text { font-size: .79rem; color: #475569; line-height: 1.65; margin-top: 4px; }
    .ebr-bragg-jetzt { font-size: .78rem; color: #5b21b6; background: #f5f3ff; border: 1px solid #ddd6fe;
      border-radius: 8px; padding: 8px 10px; margin-top: 8px; line-height: 1.55; }
    .ebr-analog-stand { font-size: .79rem; color: #5b21b6; background: #f5f3ff; border: 1px solid #ddd6fe;
      border-radius: 9px; padding: 9px 11px; line-height: 1.55; }
    .ebr-objs { display: flex; flex-direction: column; gap: 5px; }
    .ebr-obj { display: flex; flex-direction: column; gap: 1px; align-items: flex-start; text-align: left;
      padding: 7px 10px; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 9px; cursor: pointer; }
    .ebr-obj:hover { border-color: #cbd5e1; }
    .ebr-obj.on { border-color: #7c3aed; background: #f5f3ff; }
    .ebr-obj-n { font-size: .78rem; font-weight: 800; color: #475569; }
    .ebr-obj.on .ebr-obj-n { color: #5b21b6; }
    .ebr-obj-k { font-size: .66rem; color: #94a3b8; font-variant-numeric: tabular-nums; }
    .ebr-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();
// ═══════════════════════════════════════════════════════
// MESSWERTERFASSUNG UND OSZILLOSKOP
// Schluesselexperiment 08 der NRW-Handreichung.
// Anders als die uebrigen sieben ist dies kein eigenstaendiger Versuch,
// sondern eine Messmethode. Der KLP nennt dazu genau eine Kompetenz:
// Messdaten aus Oszilloskop bzw. Messwerterfassungssystem im Hinblick auf
// Zeiten, Frequenzen und Spannungen auswerten. Genau das wird hier geuebt –
// der Lernende liest am Raster ab, die Simulation prueft.
// ═══════════════════════════════════════════════════════

// Bildschirm: 10 Kaestchen waagerecht, 8 senkrecht – wie beim echten Geraet
const _OSZ_XDIV = 10;
const _OSZ_YDIV = 8;
const _OSZ_PX   = 40;               // Bildpunkte je Kaestchen

// Einstellknoepfe rasten in der 1-2-5-Folge ein, wie an echten Geraeten
const _OSZ_TDIV = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50];   // ms je Kaestchen
const _OSZ_VDIV = [0.1, 0.2, 0.5, 1, 2, 5];                     // V je Kaestchen

const _OSZ_FORMEN = [
  { id: 'sinus',    n: 'Sinus',     eff: 1 / Math.SQRT2 },
  { id: 'rechteck', n: 'Rechteck',  eff: 1 },
  { id: 'dreieck',  n: 'Dreieck',   eff: 1 / Math.sqrt(3) },
  { id: 'saege',    n: 'Sägezahn',  eff: 1 / Math.sqrt(3) }
];

let _osz = null;

function _oszInit() {
  _osz = {
    station: 0,
    tdivI: 5,               // 2 ms/DIV
    betrieb: 'ty',
    kanal: [
      { an: true,  vdivI: 3, pos:  0, kopp: 'DC', form: 'sinus', f: 250, amp: 3, off: 0, ph: 0 },
      { an: false, vdivI: 3, pos: -2, kopp: 'DC', form: 'rechteck', f: 250, amp: 2, off: 0, ph: 90 }
    ],
    trigQ: 0, trigLvl: 0, trigFlanke: 1, trigAuto: true,
    // Aufgabenmodus: die Generatoreinstellung von Kanal 1 wird verdeckt
    aufgabe: null, geprueft: null, protokoll: [],
    leseT: '', leseU: '',
    // Station 2
    lisA: 1, lisB: 2, lisPhi: 30, lisAufg: null,
    // Station 3
    sensor: 0, rate: 200, sigF: 40, dauer: 0.25,
    // Station 4
    stiftU: 0, laeuft: false, spur: [],
    t: 0
  };
}

// ── Signalerzeugung ────────────────────────────────────
// x ist die Phase in Perioden. Alle Kurven laufen zwischen -1 und +1.
function _oszWelle(form, x) {
  const p = x - Math.floor(x);
  switch (form) {
    case 'rechteck': return p < 0.5 ? 1 : -1;
    case 'dreieck':  return p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4;
    case 'saege':    return 2 * p - 1;
    default:         return Math.sin(2 * Math.PI * p);
  }
}
function _oszEffFaktor(form) {
  const f = _OSZ_FORMEN.filter(o => o.id === form)[0];
  return f ? f.eff : 1 / Math.SQRT2;
}
function _oszFormName(form) {
  const f = _OSZ_FORMEN.filter(o => o.id === form)[0];
  return f ? f.n : form;
}
// Spannung an Kanal k zur Zeit t (in Sekunden)
function _oszSpannung(k, t) {
  const c = _osz.kanal[k];
  if (c.kopp === 'GND') return 0;
  const roh = c.amp * _oszWelle(c.form, c.f * t + c.ph / 360);
  return c.kopp === 'AC' ? roh : roh + c.off;
}
function _oszTdiv() { return _OSZ_TDIV[_osz.tdivI] / 1000; }   // in Sekunden
function _oszVdiv(k) { return _OSZ_VDIV[_osz.kanal[k].vdivI]; }

// Was das Gerät tatsächlich anzeigt – daraus rechnet der Lernende zurück
function _oszPeriodeDiv(k) { return 1 / _osz.kanal[k].f / _oszTdiv(); }
function _oszSsDiv(k) {
  const c = _osz.kanal[k];
  if (c.kopp === 'GND') return 0;
  // Spitze-Spitze ist bei allen vier Formen die doppelte Amplitude
  return 2 * c.amp / _oszVdiv(k);
}

// ── Triggerung ─────────────────────────────────────────
// Gesucht ist der Zeitpunkt innerhalb einer Periode, an dem das Signal den
// Triggerpegel in der gewaehlten Flankenrichtung schneidet. Findet sich keiner,
// verhaelt sich das Geraet wie ein echtes: im Automatikbetrieb laeuft das Bild
// frei durch, im Normalbetrieb bleibt der Schirm leer.
function _oszTriggerZeit() {
  const k = _osz.trigQ;
  const c = _osz.kanal[k];
  if (c.kopp === 'GND') return null;
  const T = 1 / c.f;
  const N = 2000;
  let prev = _oszSpannung(k, 0);
  for (let i = 1; i <= N; i++) {
    const t = i / N * T;
    const v = _oszSpannung(k, t);
    const steigend = prev < _osz.trigLvl && v >= _osz.trigLvl;
    const fallend  = prev > _osz.trigLvl && v <= _osz.trigLvl;
    if ((_osz.trigFlanke > 0 && steigend) || (_osz.trigFlanke < 0 && fallend)) {
      // linear zwischen den beiden Stuetzstellen interpolieren
      const t0 = (i - 1) / N * T;
      const a = (_osz.trigLvl - prev) / (v - prev);
      return t0 + a * (t - t0);
    }
    prev = v;
  }
  return null;
}
function _oszTriggert() { return _oszTriggerZeit() !== null; }
// Zeitpunkt am linken Bildrand
function _oszStartZeit() {
  const tt = _oszTriggerZeit();
  if (tt !== null) return tt;
  return _osz.trigAuto ? _osz.t : null;
}

// ── Aufgabenmodus ──────────────────────────────────────
// Die Generatoreinstellung von Kanal 1 wird verdeckt; der Lernende muss
// Frequenz und Effektivwert allein vom Bildschirm ablesen.
function _oszNeueAufgabe() {
  const formen = ['sinus', 'sinus', 'rechteck', 'dreieck'];
  const form = formen[Math.floor(Math.random() * formen.length)];
  // Frequenz so waehlen, dass sie mit einer der Zeitbasen gut ablesbar ist
  const tdivI = 3 + Math.floor(Math.random() * 5);
  const perDiv = 1 + Math.floor(Math.random() * 3);      // 1 bis 3 Kaestchen je Periode
  const f = 1 / (perDiv * _OSZ_TDIV[tdivI] / 1000);
  const vdivI = 1 + Math.floor(Math.random() * 4);
  const ssDiv = 2 + Math.floor(Math.random() * 5);        // 2 bis 6 Kaestchen Spitze-Spitze
  const amp = ssDiv * _OSZ_VDIV[vdivI] / 2;

  const c = _osz.kanal[0];
  c.an = true; c.form = form; c.f = f; c.amp = amp; c.off = 0; c.ph = 0;
  c.kopp = 'DC'; c.vdivI = vdivI; c.pos = 0;
  _osz.kanal[1].an = false;
  _osz.tdivI = tdivI;
  _osz.trigQ = 0; _osz.trigLvl = 0; _osz.trigFlanke = 1; _osz.trigAuto = true;
  _osz.aufgabe = { form, f, amp, ueff: amp * _oszEffFaktor(form) };
  _osz.geprueft = null;
  _osz.leseT = ''; _osz.leseU = '';
  _oszUpdate();
}
function _oszAufgabeEnde() {
  _osz.aufgabe = null; _osz.geprueft = null;
  _oszUpdate();
}
function _oszSetLese(feld, v) { _osz[feld] = v; _oszRenderAuswertung(); }

// Aus den abgelesenen Kaestchen die physikalischen Groessen bestimmen
function _oszAusLesung() {
  const dT = parseFloat(String(_osz.leseT).replace(',', '.'));
  const dU = parseFloat(String(_osz.leseU).replace(',', '.'));
  const r = {};
  if (isFinite(dT) && dT > 0) {
    r.T = dT * _oszTdiv();
    r.f = 1 / r.T;
  }
  if (isFinite(dU) && dU > 0) {
    r.uss = dU * _oszVdiv(0);
    r.us = r.uss / 2;
    r.ueff = r.us * _oszEffFaktor(_osz.kanal[0].form);
  }
  return r;
}
function _oszPruefen() {
  const r = _oszAusLesung();
  const soll = _osz.aufgabe;
  if (!soll) return;
  const gT = r.f !== undefined ? Math.abs(r.f - soll.f) / soll.f * 100 : null;
  const gU = r.ueff !== undefined ? Math.abs(r.ueff - soll.ueff) / soll.ueff * 100 : null;
  _osz.geprueft = { gT, gU, r };
  if (gT !== null && gU !== null && gT < 5 && gU < 5) {
    _osz.protokoll.push({ form: soll.form, f: soll.f, ueff: soll.ueff, gT, gU });
  }
  _oszUpdate();
}

// ── Lissajous ──────────────────────────────────────────
// Bei x = sin(a·ωt + φ) und y = sin(b·ωt) beruehrt die Kurve den oberen Rand
// b-mal und den rechten Rand a-mal. Das Verhaeltnis der Beruehrpunkte ist
// also f_y : f_x – so bestimmt man am Oszilloskop eine unbekannte Frequenz.
const _OSZ_LIS = [[1, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 2], [1, 3], [5, 4]];
function _oszLisPunkte(a, b, phiGrad, n) {
  const pts = [];
  const phi = phiGrad * Math.PI / 180;
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    pts.push({ x: Math.sin(2 * Math.PI * a * s + phi), y: Math.sin(2 * Math.PI * b * s) });
  }
  return pts;
}
function _oszSetLis(a, b) { _osz.lisA = a; _osz.lisB = b; _osz.lisAufg = null; _oszRenderLis(); }
function _oszSetLisPhi(v) {
  _osz.lisPhi = Math.max(0, Math.min(180, +v));
  const sl = document.getElementById('oszLisPhi'); if (sl) sl.value = String(_osz.lisPhi);
  const el = document.getElementById('oszLisPhiLbl'); if (el) el.textContent = Math.round(_osz.lisPhi) + '°';
  _oszRenderLis();
}
function _oszLisAufgabe() {
  const p = _OSZ_LIS[Math.floor(Math.random() * _OSZ_LIS.length)];
  _osz.lisA = p[0]; _osz.lisB = p[1];
  _osz.lisPhi = Math.floor(Math.random() * 7) * 15 + 15;
  _osz.lisAufg = { fx: 500, loesung: 500 * p[1] / p[0] };
  const sl = document.getElementById('oszLisPhi'); if (sl) sl.value = String(_osz.lisPhi);
  _oszRenderLis();
}

// ── Messwerterfassung: die Messwandler ─────────────────
// Kern der Handreichung: Fast jede Messgroesse laesst sich ueber einen
// Messwandler in eine Spannung umsetzen, die in einem definierten
// Zusammenhang zur Messgroesse steht. Erst diese Spannung wird registriert.
const _OSZ_SENSOREN = [
  { n: 'Kraftsensor', gr: 'Kraft F', eh: 'N', max: 50, prinzip: 'Piezoelektrizität',
    kennlinie: 'U = 0,08 V/N · F', u: F => 0.08 * F, art: 'proportional',
    txt: 'Ein Piezokristall gibt bei Verformung eine Spannung ab, die proportional zur einwirkenden Kraft ist. Damit lassen sich Kraftstöße erfassen, die für eine Federwaage viel zu kurz sind.' },
  { n: 'Temperaturfühler', gr: 'Temperatur ϑ', eh: '°C', max: 100, prinzip: 'temperaturabhängiger Widerstand',
    kennlinie: 'U = 0,5 V + 0,02 V/°C · ϑ', u: T => 0.5 + 0.02 * T, art: 'linear, mit Achsenabschnitt',
    txt: 'Der Widerstand eines Halbleiterfühlers hängt von der Temperatur ab. In einer Brückenschaltung wird daraus eine Spannung. Sie ist hier linear, aber nicht proportional – bei 0 °C liegen bereits 0,5 V an.' },
  { n: 'Hallsonde', gr: 'Magnetfeld B', eh: 'mT', max: 20, prinzip: 'Lorentzkraft',
    kennlinie: 'U = 0,15 V/mT · B', u: B => 0.15 * B, art: 'proportional',
    txt: 'In einem stromdurchflossenen Plättchen lenkt die Lorentzkraft die Ladungsträger quer ab. Die entstehende Hallspannung ist der Flussdichte proportional – dieselbe Sonde steckt im Fadenstrahlrohr-Versuch.' },
  { n: 'Lichtsensor', gr: 'Beleuchtungsstärke E', eh: 'lx', max: 1000, prinzip: 'innerer Photoeffekt',
    kennlinie: 'U = 2,5 V · √(E / 1000 lx)', u: E => 2.5 * Math.sqrt(E / 1000), art: 'nicht proportional',
    txt: 'Eine Photodiode liefert hier keine proportionale, sondern eine gekrümmte Kennlinie. Auch das ist zulässig – die Handreichung verlangt nur einen definierten funktionalen Zusammenhang. Man muss ihn dann aber kennen und beim Auswerten umkehren.' }
];
function _oszSetSensor(i) {
  _osz.sensor = Math.max(0, Math.min(_OSZ_SENSOREN.length - 1, i));
  for (let k = 0; k < _OSZ_SENSOREN.length; k++)
    document.getElementById('oszSen' + k)?.classList.toggle('on', k === _osz.sensor);
  _oszRenderSensor();
}
function _oszSetRate(v) {
  _osz.rate = Math.max(5, Math.min(500, +v));
  const sl = document.getElementById('oszRate'); if (sl) sl.value = String(_osz.rate);
  const el = document.getElementById('oszRateLbl'); if (el) el.textContent = Math.round(_osz.rate) + ' Hz';
  _oszRenderSensor();
}
function _oszSetSigF(v) {
  _osz.sigF = Math.max(1, Math.min(120, +v));
  const sl = document.getElementById('oszSigF'); if (sl) sl.value = String(_osz.sigF);
  const el = document.getElementById('oszSigFLbl'); if (el) el.textContent = Math.round(_osz.sigF) + ' Hz';
  _oszRenderSensor();
}
// Welche Frequenz taeuscht die zu langsame Abtastung vor?
function _oszScheinF() {
  const k = Math.round(_osz.sigF / _osz.rate);
  return Math.abs(_osz.sigF - k * _osz.rate);
}
function _oszNyquistOk() { return _osz.rate >= 2 * _osz.sigF; }

// ── Station 4: Franck-Hertz am x-y-Schreiber ───────────
// Die Handreichung nennt genau diese Anwendung zweimal. Die Kurve ist
// nachgebildet; ihr physikalischer Gehalt ist der Abstand der Maxima von
// 4,9 V – die Anregungsenergie des Quecksilberatoms.
const _OSZ_FH_DU = 4.9;
const _OSZ_FH_UMAX = 30;
function _oszFHStrom(U) {
  if (U <= 0) return 0;
  // Grundanstieg wie bei einer Raumladungskennlinie
  let I = Math.pow(U, 1.5) * 0.055;
  // Jedes Vielfache der Anregungsenergie erzeugt einen Einbruch
  let d = 0;
  for (let n = 1; n * _OSZ_FH_DU <= _OSZ_FH_UMAX + _OSZ_FH_DU; n++) {
    const x = (U - (n * _OSZ_FH_DU + 0.7)) / 1.15;
    d += Math.exp(-x * x) * (0.42 + 0.05 * n);
  }
  return Math.max(0, I * (1 - Math.min(0.85, d)));
}
function _oszSchreiberStart() {
  _osz.laeuft = true; _osz.stiftU = 0; _osz.spur = [];
  const b = document.getElementById('oszSchrBtn');
  if (b) b.textContent = '⏸ Anhalten';
}
function _oszSchreiberToggle() {
  if (_osz.laeuft) {
    _osz.laeuft = false;
    const b = document.getElementById('oszSchrBtn');
    if (b) b.textContent = '▶ Schreiber starten';
  } else _oszSchreiberStart();
}
function _oszSchreiberReset() {
  _osz.laeuft = false; _osz.stiftU = 0; _osz.spur = [];
  const b = document.getElementById('oszSchrBtn');
  if (b) b.textContent = '▶ Schreiber starten';
  _oszRenderSchreiber();
}

// ── Zahlformat ─────────────────────────────────────────
function _oszZeit(s) {
  if (!isFinite(s)) return '—';
  if (s >= 1) return _fpmNum(s, 3) + ' s';
  if (s >= 1e-3) return _fpmNum(s * 1e3, 3) + ' ms';
  return _fpmNum(s * 1e6, 3) + ' µs';
}
function _oszFreq(f) {
  if (!isFinite(f)) return '—';
  return f >= 1000 ? _fpmNum(f / 1000, 3) + ' kHz' : _fpmNum(f, 3) + ' Hz';
}

// ── Oberfläche ─────────────────────────────────────────
function _oszHTML() {
  const stationen = ['1 · Oszilloskop', '2 · x-y-Betrieb & Lissajous',
                     '3 · Messwerterfassung', '4 · x-y-Schreiber']
    .map((s, i) => `<button class="fpm-tab${i === _osz.station ? ' on' : ''}" id="oszSt${i}" onclick="_oszSetStation(${i})">${s}</button>`).join('');

  const kanal = k => `
    <div class="osz-gruppe">
      <div class="osz-gruppe-k">Instrumentengruppe · Eingang Kanal ${k + 1}</div>
      <label class="fpm-check"><input type="checkbox" id="oszAn${k}" ${_osz.kanal[k].an ? 'checked' : ''}
        onchange="_oszSetAn(${k},this.checked)"> Kanal ${k + 1} anzeigen</label>
      <div class="osz-zeile"><span>VOLTS/DIV</span>
        <button class="osz-knopf" onclick="_oszStepV(${k},-1)">◀</button>
        <b id="oszVdiv${k}">1 V</b>
        <button class="osz-knopf" onclick="_oszStepV(${k},1)">▶</button></div>
      <div class="osz-zeile"><span>Y-Position</span>
        <input type="range" id="oszPos${k}" min="-3" max="3" step="0.5" value="${_osz.kanal[k].pos}"
          oninput="_oszSetPos(${k},this.value)"></div>
      <div class="osz-zeile"><span>Kopplung</span>
        <span class="osz-seg">
          ${['DC', 'AC', 'GND'].map(m => `<button class="osz-segb" id="oszK${k}${m}" onclick="_oszSetKopp(${k},'${m}')">${m}</button>`).join('')}
        </span></div>
      <div class="osz-gen-k">Funktionsgenerator ${k + 1}</div>
      <div class="osz-zeile"><span>Kurvenform</span>
        <select class="osz-sel" id="oszForm${k}" onchange="_oszSetForm(${k},this.value)">
          ${_OSZ_FORMEN.map(f => `<option value="${f.id}">${f.n}</option>`).join('')}
        </select></div>
      <div class="osz-zeile"><span>Frequenz</span>
        <input type="range" id="oszF${k}" min="10" max="5000" step="10" value="${_osz.kanal[k].f}"
          oninput="_oszSetF(${k},this.value)"><b id="oszFLbl${k}">250 Hz</b></div>
      <div class="osz-zeile"><span>Amplitude</span>
        <input type="range" id="oszAmp${k}" min="0.1" max="10" step="0.1" value="${_osz.kanal[k].amp}"
          oninput="_oszSetAmp(${k},this.value)"><b id="oszAmpLbl${k}">3,0 V</b></div>
      <div class="osz-zeile"><span>Gleichanteil</span>
        <input type="range" id="oszOff${k}" min="-5" max="5" step="0.1" value="${_osz.kanal[k].off}"
          oninput="_oszSetOff(${k},this.value)"><b id="oszOffLbl${k}">0,0 V</b></div>
      ${k === 1 ? `<div class="osz-zeile"><span>Phase</span>
        <input type="range" id="oszPh1" min="0" max="360" step="5" value="${_osz.kanal[1].ph}"
          oninput="_oszSetPh(1,this.value)"><b id="oszPhLbl1">90°</b></div>` : ''}
    </div>`;

  const sensoren = _OSZ_SENSOREN.map((s, i) =>
    `<button class="ebr-obj${i === _osz.sensor ? ' on' : ''}" id="oszSen${i}" onclick="_oszSetSensor(${i})">
       <span class="ebr-obj-n">${s.n}</span><span class="ebr-obj-k">${s.prinzip} · ${s.kennlinie}</span></button>`).join('');

  const lisKnoepfe = _OSZ_LIS.map(p =>
    `<button class="sim-btn" onclick="_oszSetLis(${p[0]},${p[1]})">${p[0]} : ${p[1]}</button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim osz-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">📟 Messwerterfassung und Oszilloskop</h3>
    <canvas id="oszTakt" width="1" height="1" style="display:none"></canvas>
    <div class="fpm-tabs">${stationen}</div>

    <!-- ══ Station 1 ══ -->
    <div id="oszS0">
      <div class="fpm-grid">
        <div>
          <canvas id="oszSchirm" width="440" height="384" class="phys-anim-cv"></canvas>
          <div class="osz-status" id="oszStatus"></div>
          <div class="osz-gruppe">
            <div class="osz-gruppe-k">Instrumentengruppe · Zeitablenkung</div>
            <div class="osz-zeile"><span>TIME/DIV</span>
              <button class="osz-knopf" onclick="_oszStepT(-1)">◀</button>
              <b id="oszTdiv">2 ms</b>
              <button class="osz-knopf" onclick="_oszStepT(1)">▶</button></div>
          </div>
          <div class="osz-gruppe">
            <div class="osz-gruppe-k">Instrumentengruppe · Triggerung</div>
            <div class="osz-zeile"><span>Quelle</span>
              <span class="osz-seg">
                <button class="osz-segb" id="oszTQ0" onclick="_oszSetTrigQ(0)">Kanal 1</button>
                <button class="osz-segb" id="oszTQ1" onclick="_oszSetTrigQ(1)">Kanal 2</button>
              </span></div>
            <div class="osz-zeile"><span>Pegel</span>
              <input type="range" id="oszTrigLvl" min="-5" max="5" step="0.1" value="0"
                oninput="_oszSetTrigLvl(this.value)"><b id="oszTrigLvlLbl">0,0 V</b></div>
            <div class="osz-zeile"><span>Flanke</span>
              <span class="osz-seg">
                <button class="osz-segb" id="oszFl1" onclick="_oszSetFlanke(1)">↗ steigend</button>
                <button class="osz-segb" id="oszFl0" onclick="_oszSetFlanke(-1)">↘ fallend</button>
              </span></div>
            <div class="osz-zeile"><span>Betriebsart</span>
              <span class="osz-seg">
                <button class="osz-segb" id="oszTA1" onclick="_oszSetTrigAuto(true)">Auto</button>
                <button class="osz-segb" id="oszTA0" onclick="_oszSetTrigAuto(false)">Normal</button>
              </span></div>
          </div>
        </div>
        <div>
          <div class="osz-aufgabe" id="oszAufgabe"></div>
          <div class="fpm-label">Ablesen am Raster</div>
          <div class="osz-lese">
            <div class="osz-lese-z"><span>Eine Periode überstreicht</span>
              <input type="text" class="fpm-input osz-inp" id="oszLeseT" placeholder="?"
                spellcheck="false" oninput="_oszSetLese('leseT',this.value)"><span>Kästchen</span></div>
            <div class="osz-lese-z"><span>Spitze&#8209;Spitze misst</span>
              <input type="text" class="fpm-input osz-inp" id="oszLeseU" placeholder="?"
                spellcheck="false" oninput="_oszSetLese('leseU',this.value)"><span>Kästchen</span></div>
          </div>
          <div class="ebr-rechnung" id="oszAuswertung"></div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" onclick="_oszNeueAufgabe()">🎲 Unbekanntes Signal</button>
            <button class="sim-btn" id="oszPruefBtn" onclick="_oszPruefen()">✓ Ablesung prüfen</button>
            <button class="sim-btn" onclick="_oszAufgabeEnde()">Generator zeigen</button>
          </div>
          <div id="oszKanaele">${kanal(0)}${kanal(1)}</div>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>Nr.</th><th>Form</th><th>f (soll)</th><th>U<sub>eff</sub> (soll)</th><th>Fehler f</th><th>Fehler U</th></tr></thead>
              <tbody id="oszProtokoll"></tbody>
            </table>
            <div class="fpm-empty" id="oszProtLeer">Noch keine gelöste Aufgabe.<br>Unbekanntes Signal erzeugen, ablesen, prüfen.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Station 2 ══ -->
    <div id="oszS1" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="oszLis" width="440" height="384" class="phys-anim-cv"></canvas>
          <div class="fpm-label">x-y-Betrieb: Kanal 1 lenkt waagerecht ab, Kanal 2 senkrecht</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Phasenverschiebung φ: <b id="oszLisPhiLbl">30°</b></span>
            <input type="range" id="oszLisPhi" min="0" max="180" step="1" value="30"
              oninput="_oszSetLisPhi(this.value)" style="width:100%;accent-color:#16a34a">
          </div>
          <div class="fpm-label">Frequenzverhältnis f<sub>x</sub> : f<sub>y</sub></div>
          <div class="sim-btn-row">${lisKnoepfe}</div>
        </div>
        <div>
          <div class="osz-lisinfo" id="oszLisInfo"></div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" onclick="_oszLisAufgabe()">🎲 Unbekannte Frequenz</button>
          </div>
          <div class="dsp-erkl" style="margin-top:10px">
            <div class="dsp-erkl-kopf">Wozu das gut ist</div>
            <div class="dsp-erkl-text">
              Legt man zwei Wechselspannungen gleichzeitig an die waagerechte und die senkrechte
              Ablenkung, so zeichnet der Elektronenstrahl eine <b>Lissajous-Figur</b>. Ihre Form
              hängt allein vom Frequenzverhältnis und von der Phasenverschiebung ab. Damit lässt
              sich eine <b>unbekannte Frequenz bestimmen</b>: Man legt eine bekannte Frequenz an
              den einen Eingang und verändert sie, bis eine stehende, einfache Figur erscheint.
              Dann zählt man die Berührpunkte an den Rändern ab.
            </div>
            <div class="dsp-erkl-text" style="margin-top:6px">
              Genau nach diesem Prinzip arbeiten <b>Lasershows</b>: Zwei senkrecht zueinander
              schwingende Spiegel lenken den Strahl ab, und aus dem Zusammenspiel ihrer Frequenzen
              entstehen die Figuren an der Wand.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Station 3 ══ -->
    <div id="oszS2" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="oszWandler" width="440" height="200" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Kennlinie des Messwandlers</div>
          <canvas id="oszAbtast" width="440" height="230" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Was das System tatsächlich speichert</div>
        </div>
        <div>
          <div class="fpm-label">Messwandler wählen</div>
          <div class="ebr-objs">${sensoren}</div>
          <div class="ebr-rechnung" id="oszSensorInfo"></div>
          <div class="fpm-label" style="margin-top:10px">Abtastung</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Messrate: <b id="oszRateLbl">200 Hz</b></span>
            <input type="range" id="oszRate" min="5" max="500" step="5" value="200"
              oninput="_oszSetRate(this.value)" style="width:100%;accent-color:#0369a1">
          </div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Frequenz des Vorgangs: <b id="oszSigFLbl">40 Hz</b></span>
            <input type="range" id="oszSigF" min="1" max="120" step="1" value="40"
              oninput="_oszSetSigF(this.value)" style="width:100%;accent-color:#dc2626">
          </div>
          <div class="osz-nyquist" id="oszNyquist"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 4 ══ -->
    <div id="oszS3" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="oszSchreiber" width="440" height="330" class="phys-anim-cv"></canvas>
          <div class="fpm-label">x-y-Schreiber: die Kurve entsteht direkt auf dem Papier</div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="oszSchrBtn" onclick="_oszSchreiberToggle()">▶ Schreiber starten</button>
            <button class="sim-btn" onclick="_oszSchreiberReset()">↺ Neues Blatt</button>
          </div>
        </div>
        <div>
          <div class="ebr-rechnung" id="oszSchreiberInfo"></div>
          <div class="dsp-erkl" style="margin-top:10px">
            <div class="dsp-erkl-kopf">Ein mechanisches Oszilloskop</div>
            <div class="dsp-erkl-text">
              Der x-y-Schreiber führt einen Stift über ein Blatt Papier: Die eine Spannung steuert
              die Bewegung nach rechts, die andere die nach oben. Er leistet damit im Grunde
              dasselbe wie ein Oszilloskop im x-y-Betrieb – nur langsam, mechanisch und mit dem
              Ergebnis sofort auf Papier. Vollständig ersetzbar ist er längst; die Handreichung
              nennt ihn trotzdem, weil das sichtbare Entstehen der Kurve viele Lernende fasziniert.
              Seine klassische Anwendung ist die Aufnahme der <b>Franck-Hertz-Kurve</b>.
            </div>
            <div class="dsp-erkl-text" style="margin-top:6px">
              Der physikalische Gehalt der Kurve steckt im <b>Abstand der Einbrüche</b>: Er beträgt
              stets 4,9 V. So viel Energie braucht ein Quecksilberatom, um in seinen ersten
              angeregten Zustand zu gelangen. Hat ein Elektron diese Energie erreicht, gibt es sie
              bei einem Stoß vollständig ab und kann die Gegenspannung nicht mehr überwinden – der
              Strom bricht ein. Bei doppelter Energie passiert dasselbe zweimal hintereinander.
              Dass Atome Energie nur in festen Portionen aufnehmen, wird hier unmittelbar sichtbar.
            </div>
            <div class="fpm-note" style="margin-top:6px">Die hier gezeichnete Kurve ist
              nachgebildet, nicht gemessen. Ihr Aussagegehalt ist der Abstand der Maxima von
              4,9 V – nicht die genaue Höhe der einzelnen Spitzen.</div>
          </div>
        </div>
      </div>
    </div>

    <div id="oszErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>T = Kästchen · TIME/DIV</b> &nbsp;|&nbsp; <b>f = 1 / T</b>
      &nbsp;|&nbsp; <b>U<sub>SS</sub> = Kästchen · VOLTS/DIV</b>
      &nbsp;|&nbsp; <b>U<sub>eff</sub> = Û / √2</b> (nur beim Sinus)
    </p>
  </div>`;
}

function _oszErklHTML() {
  return `<div class="dsp-erkl-kopf">Warum das ein Schlüsselexperiment ist – und warum es keines ist</div>
    <div class="dsp-erkl-text">
      Die Handreichung stellt das gleich zu Beginn klar: Messwerterfassungssystem und Oszilloskop
      sind <b>keine eigenständigen Experimente</b> wie der Franck-Hertz-Versuch oder die
      Elektronenbeugung. Es sind <b>Methoden der Messwertaufnahme</b>, die quer durch alle
      Jahrgangsstufen gebraucht werden. Der Kernlehrplan nennt dazu genau eine Kompetenz: Man soll
      Messdaten, die mit einem Oszilloskop oder einem Messwerterfassungssystem gewonnen wurden,
      <b>im Hinblick auf Zeiten, Frequenzen und Spannungen auswerten</b> können. Genau das wird
      hier geübt.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Wie man ein Oszilloskop liest</div>
    <div class="dsp-erkl-text">
      Der Bildschirm ist ein Raster aus 10 mal 8 Kästchen. Zwei Knöpfe legen fest, was ein Kästchen
      bedeutet: <b>TIME/DIV</b> die Zeit in waagerechter Richtung, <b>VOLTS/DIV</b> die Spannung in
      senkrechter. Alles Weitere ist Zählen. Man zählt ab, über wie viele Kästchen sich eine volle
      Periode erstreckt, und rechnet T = Kästchen · TIME/DIV; daraus folgt f = 1/T. Ebenso zählt
      man die Kästchen von der tiefsten bis zur höchsten Stelle der Kurve und erhält
      U<sub>SS</sub> = Kästchen · VOLTS/DIV, den <b>Spitze-Spitze-Wert</b>. Die Hälfte davon ist der
      Scheitelwert Û.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Scheitelwert und Effektivwert</div>
    <div class="dsp-erkl-text">
      Das Oszilloskop zeigt immer den <b>Momentanwert</b>, ein Vielfachmessgerät dagegen den
      <b>Effektivwert</b> – also diejenige Gleichspannung, die an einem Widerstand dieselbe
      Leistung umsetzen würde. Bei einer Sinusspannung gilt U<sub>eff</sub> = Û/√2 ≈ 0,71 · Û.
      Das ist die Umrechnung hinter den 230 V aus der Steckdose: Ihr Scheitelwert beträgt
      etwa 325 V. Wichtig ist, dass dieser Faktor <b>nur für den Sinus</b> gilt. Bei einer
      Rechteckspannung ist U<sub>eff</sub> = Û, beim Dreieck Û/√3. Wer blind durch √2 teilt, rechnet
      bei jeder anderen Kurvenform falsch.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Wozu die Triggerung</div>
    <div class="dsp-erkl-text">
      Ohne Triggerung beginnt jeder Bilddurchlauf an einer anderen Stelle des Signals, und das Bild
      läuft davon. Die Triggerung sorgt dafür, dass jeder Durchlauf an <i>derselben</i> Stelle
      startet: bei einem einstellbaren <b>Pegel</b> und in einer bestimmten <b>Flankenrichtung</b>.
      Dann liegen alle Durchläufe deckungsgleich übereinander und das Bild steht still. Setzt man
      den Pegel höher als die Amplitude, findet das Gerät keinen Schnittpunkt mehr – im
      Automatikbetrieb läuft das Bild dann frei durch, im Normalbetrieb bleibt der Schirm leer.
      Das ist keine Störung, sondern die häufigste Ursache dafür, dass ein Oszilloskop scheinbar
      nichts anzeigt.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Das Messwerterfassungssystem</div>
    <div class="dsp-erkl-text">
      Der Grundgedanke ist einfach und weitreichend: Fast jede physikalische Größe lässt sich über
      einen geeigneten <b>Messwandler</b> in eine elektrische Spannung umsetzen – über
      Piezoelektrizität, über temperaturabhängige Widerstände, über die Lorentzkraft. Diese
      Spannung steht in einem <b>definierten funktionalen Zusammenhang</b> zur Messgröße, meistens
      sogar proportional. Registriert wird dann nur noch die Spannung. Weil das für nahezu jede
      Größe funktioniert, sind solche Systeme universell einsetzbar und ersetzen Speicheroszilloskop,
      x-y-Schreiber und Digitalzähler zugleich.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Was daran gefährlich ist</div>
    <div class="dsp-erkl-text">
      Die Handreichung ist an dieser Stelle bemerkenswert selbstkritisch. Sie nennt die Vorteile –
      viele Messwerte, schnelle Vorgänge, Messungen über eine Schulstunde hinaus, mehr Zeit für die
      Deutung statt fürs Zeichnen – benennt aber ebenso deutlich die Gefahren: Die Datenmenge kann
      den Überblick kosten. Die Messung läuft schnell und <b>verdeckt</b> ab, sodass die Transparenz
      verloren geht. Und die Fülle der Darstellungsmöglichkeiten verführt dazu, unreflektiert
      irgendeine auszuwählen. Ihre Forderung: Man muss jederzeit Auskunft über die eigene Messung
      geben können, begründen, warum man ein Verfahren gewählt hat – und die Darstellung
      grundsätzlich auch <b>von Hand</b> erzeugen können. Wörtlich: Man muss nicht mit Kanonen auf
      Spatzen schießen.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum das Oszilloskop trotzdem bleibt</div>
    <div class="dsp-erkl-text">
      In der Schule ist das Oszilloskop weitgehend durch Messwerterfassungssysteme ersetzt worden.
      Die Handreichung hält trotzdem daran fest – mit dem Argument, dass es in der modernen Technik
      und besonders im <b>medizinischen Bereich</b> sehr häufig anzutreffen ist. Wer einmal ein
      EKG gesehen hat, hat ein Oszilloskop gesehen. Und anders als beim Messwerterfassungssystem,
      das man als black box benutzen darf, lohnt beim Oszilloskop der Blick ins Innere: Sein
      Funktionsprinzip ist die Ablenkung von Elektronen durch elektrische Felder – dieselbe Physik
      wie im Fadenstrahlrohr und in der Elektronenbeugungsröhre.
    </div>
    <div class="dsp-erkl-warn">💡 Die Handreichung empfiehlt ausdrücklich, den Umgang mit einem
      virtuellen Oszilloskop auch zu Hause zu üben – Zusehen allein reicht bei diesem Gerät nicht.
      Genau dafür ist diese Station gedacht.</div>`;
}

// ── Stationen ──────────────────────────────────────────
function _oszSetStation(i) {
  _osz.station = i;
  for (let k = 0; k < 4; k++) {
    document.getElementById('oszSt' + k)?.classList.toggle('on', k === i);
    const d = document.getElementById('osz' + 'S' + k);
    if (d) d.style.display = k === i ? 'block' : 'none';
  }
  _oszUpdate();
}

// ── Bedienung Station 1 ────────────────────────────────
function _oszStepT(d) {
  _osz.tdivI = Math.max(0, Math.min(_OSZ_TDIV.length - 1, _osz.tdivI + d));
  _oszUpdate();
}
function _oszStepV(k, d) {
  _osz.kanal[k].vdivI = Math.max(0, Math.min(_OSZ_VDIV.length - 1, _osz.kanal[k].vdivI + d));
  _oszUpdate();
}
function _oszSetAn(k, v) { _osz.kanal[k].an = !!v; _oszUpdate(); }
function _oszSetPos(k, v) { _osz.kanal[k].pos = +v; _oszUpdate(); }
function _oszSetKopp(k, m) { _osz.kanal[k].kopp = m; _oszUpdate(); }
function _oszSetForm(k, v) { _osz.kanal[k].form = v; _oszUpdate(); }
function _oszSetF(k, v) { _osz.kanal[k].f = Math.max(10, Math.min(5000, +v)); _oszUpdate(); }
function _oszSetAmp(k, v) { _osz.kanal[k].amp = Math.max(0.1, Math.min(10, +v)); _oszUpdate(); }
function _oszSetOff(k, v) { _osz.kanal[k].off = Math.max(-5, Math.min(5, +v)); _oszUpdate(); }
function _oszSetPh(k, v) { _osz.kanal[k].ph = Math.max(0, Math.min(360, +v)); _oszUpdate(); }
function _oszSetTrigQ(k) { _osz.trigQ = k; _oszUpdate(); }
function _oszSetTrigLvl(v) { _osz.trigLvl = Math.max(-5, Math.min(5, +v)); _oszUpdate(); }
function _oszSetFlanke(f) { _osz.trigFlanke = f; _oszUpdate(); }
function _oszSetTrigAuto(a) { _osz.trigAuto = !!a; _oszUpdate(); }

function _oszUpdate() {
  if (!_osz) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const td = _OSZ_TDIV[_osz.tdivI];
  set('oszTdiv', td >= 1 ? _fpmNum(td, 0) + ' ms' : _fpmNum(td * 1000, 0) + ' µs');
  for (let k = 0; k < 2; k++) {
    const c = _osz.kanal[k];
    const vd = _OSZ_VDIV[c.vdivI];
    set('oszVdiv' + k, vd >= 1 ? _fpmNum(vd, 0) + ' V' : _fpmNum(vd * 1000, 0) + ' mV');
    set('oszFLbl' + k, _oszFreq(c.f));
    set('oszAmpLbl' + k, _fpmNum(c.amp, 1) + ' V');
    set('oszOffLbl' + k, _fpmNum(c.off, 1) + ' V');
    if (k === 1) set('oszPhLbl1', Math.round(c.ph) + '°');
    const sel = document.getElementById('oszForm' + k); if (sel) sel.value = c.form;
    const an = document.getElementById('oszAn' + k); if (an) an.checked = c.an;
    ['DC', 'AC', 'GND'].forEach(m =>
      document.getElementById('oszK' + k + m)?.classList.toggle('on', c.kopp === m));
  }
  set('oszTrigLvlLbl', _fpmNum(_osz.trigLvl, 1) + ' V');
  document.getElementById('oszTQ0')?.classList.toggle('on', _osz.trigQ === 0);
  document.getElementById('oszTQ1')?.classList.toggle('on', _osz.trigQ === 1);
  document.getElementById('oszFl1')?.classList.toggle('on', _osz.trigFlanke > 0);
  document.getElementById('oszFl0')?.classList.toggle('on', _osz.trigFlanke < 0);
  document.getElementById('oszTA1')?.classList.toggle('on', _osz.trigAuto);
  document.getElementById('oszTA0')?.classList.toggle('on', !_osz.trigAuto);

  // Im Aufgabenmodus bleibt der Generator verdeckt
  const kan = document.getElementById('oszKanaele');
  if (kan) kan.style.display = _osz.aufgabe ? 'none' : 'block';

  _oszRenderStatus();
  _oszRenderAufgabe();
  _oszRenderAuswertung();
  _oszRenderProtokoll();
  _oszRenderLis();
  _oszRenderSensor();
  _oszRenderSchreiber();
}

function _oszRenderStatus() {
  const el = document.getElementById('oszStatus'); if (!el) return;
  const td = _OSZ_TDIV[_osz.tdivI];
  const trig = _oszTriggert();
  let s = `<span class="osz-st-k">TIME/DIV</span><b>${td >= 1 ? _fpmNum(td, 0) + ' ms' : _fpmNum(td * 1000, 0) + ' µs'}</b>`;
  for (let k = 0; k < 2; k++) {
    if (!_osz.kanal[k].an) continue;
    const vd = _OSZ_VDIV[_osz.kanal[k].vdivI];
    s += `<span class="osz-st-k">CH${k + 1}</span><b style="color:${k === 0 ? '#facc15' : '#38bdf8'}">${
      vd >= 1 ? _fpmNum(vd, 0) + ' V' : _fpmNum(vd * 1000, 0) + ' mV'}/DIV · ${_osz.kanal[k].kopp}</b>`;
  }
  s += `<span class="osz-st-k">Trigger</span><b style="color:${trig ? '#4ade80' : '#f87171'}">${
    trig ? 'CH' + (_osz.trigQ + 1) + ' ' + (_osz.trigFlanke > 0 ? '↗' : '↘')
         : (_osz.trigAuto ? 'AUTO – kein Trigger' : 'kein Trigger')}</b>`;
  el.innerHTML = s;
}

function _oszRenderAufgabe() {
  const el = document.getElementById('oszAufgabe'); if (!el) return;
  const pb = document.getElementById('oszPruefBtn');
  if (pb) pb.disabled = !_osz.aufgabe;
  if (!_osz.aufgabe) {
    el.className = 'osz-aufgabe';
    el.innerHTML = 'Stelle den Generator unten selbst ein und übe das Ablesen – oder lass dir ein '
      + '<b>unbekanntes Signal</b> geben. Dann wird die Generatoreinstellung verdeckt und du musst '
      + 'Frequenz und Effektivwert allein vom Bildschirm bestimmen.';
    return;
  }
  const a = _osz.aufgabe;
  const g = _osz.geprueft;
  if (!g) {
    el.className = 'osz-aufgabe an';
    el.innerHTML = '<b>Aufgabe.</b> Am Kanal 1 liegt ein unbekanntes Signal der Kurvenform <b>'
      + _oszFormName(a.form) + '</b>. Bestimme seine Frequenz und seinen Effektivwert. '
      + 'Zeitbasis und Empfindlichkeit darfst du dabei verstellen.';
    return;
  }
  const gut = g.gT !== null && g.gU !== null && g.gT < 5 && g.gU < 5;
  el.className = 'osz-aufgabe ' + (gut ? 'ok' : 'no');
  el.innerHTML = (gut ? '<b>Richtig abgelesen.</b> ' : '<b>Noch nicht.</b> ')
    + 'Der Generator stand auf <b>' + _oszFreq(a.f) + '</b> und <b>' + _fpmNum(a.ueff, 2)
    + ' V</b> Effektivwert (Scheitelwert ' + _fpmNum(a.amp, 2) + ' V).'
    + (g.gT !== null ? ' Deine Frequenz weicht um ' + _fpmNum(g.gT, 1) + ' % ab.' : ' Du hast keine Zeit abgelesen.')
    + (g.gU !== null ? ' Dein Effektivwert um ' + _fpmNum(g.gU, 1) + ' %.' : ' Du hast keine Spannung abgelesen.')
    + (gut ? '' : ' Zähle die Kästchen noch einmal nach – und prüfe, ob du beim Effektivwert den '
      + 'richtigen Faktor für die Kurvenform benutzt hast.');
}

function _oszRenderAuswertung() {
  const el = document.getElementById('oszAuswertung'); if (!el) return;
  const r = _oszAusLesung();
  const form = _osz.kanal[0].form;
  const fak = _oszEffFaktor(form);
  const fakTxt = form === 'sinus' ? 'Û/√2' : form === 'rechteck' ? 'Û' : 'Û/√3';
  let html = '';
  if (r.T !== undefined) {
    html += `<div class="pho-rz"><span class="pho-rz-t">aus den Kästchen die Zeit</span>
      <span class="pho-rz-f">T = n · TIME/DIV</span>
      <span class="pho-rz-v">${_oszZeit(r.T)}</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">daraus die Frequenz</span>
      <span class="pho-rz-f">f = 1 / T</span>
      <span class="pho-rz-v">${_oszFreq(r.f)}</span></div>`;
  }
  if (r.uss !== undefined) {
    html += `<div class="pho-rz"><span class="pho-rz-t">Spitze-Spitze-Wert</span>
      <span class="pho-rz-f">U<sub>SS</sub> = n · VOLTS/DIV</span>
      <span class="pho-rz-v">${_fpmNum(r.uss, 2)} V</span></div>
      <div class="pho-rz"><span class="pho-rz-t">Scheitelwert</span>
      <span class="pho-rz-f">Û = U<sub>SS</sub> / 2</span>
      <span class="pho-rz-v">${_fpmNum(r.us, 2)} V</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Effektivwert bei ${_oszFormName(form)}</span>
      <span class="pho-rz-f">U<sub>eff</sub> = ${fakTxt}</span>
      <span class="pho-rz-v">${_fpmNum(r.us * fak, 2)} V</span></div>`;
  }
  if (!html) {
    html = '<div class="fpm-note">Zähle am Raster ab, über wie viele Kästchen sich eine volle '
      + 'Periode erstreckt und wie viele Kästchen zwischen tiefstem und höchstem Punkt der Kurve '
      + 'liegen. Trage beides oben ein – Zwischenwerte wie 2,5 sind erlaubt.</div>';
  } else if (r.uss !== undefined) {
    html += `<div class="fpm-note">Der Faktor für den Effektivwert hängt von der Kurvenform ab:
      Sinus Û/√2 ≈ 0,71·Û, Rechteck Û, Dreieck und Sägezahn Û/√3 ≈ 0,58·Û.</div>`;
  }
  el.innerHTML = html;
}

function _oszRenderProtokoll() {
  const tb = document.getElementById('oszProtokoll'); if (!tb) return;
  const leer = document.getElementById('oszProtLeer');
  if (leer) leer.style.display = _osz.protokoll.length ? 'none' : 'block';
  tb.innerHTML = _osz.protokoll.map((p, i) =>
    `<tr><td>${i + 1}</td><td>${_oszFormName(p.form)}</td><td>${_oszFreq(p.f)}</td>
       <td>${_fpmNum(p.ueff, 2)} V</td>
       <td>${_fpmNum(p.gT, 1)} %</td><td>${_fpmNum(p.gU, 1)} %</td></tr>`).join('');
}

// ── Station 2 ──────────────────────────────────────────
function _oszRenderLis() {
  const el = document.getElementById('oszLisInfo'); if (!el) return;
  const a = _osz.lisA, b = _osz.lisB;
  const g = (x, y) => y ? g(y, x % y) : x;
  const t = g(a, b);
  if (_osz.lisAufg) {
    el.className = 'osz-lisinfo an';
    el.innerHTML = `<div class="osz-lis-kopf">Aufgabe</div>
      <div class="osz-lis-txt">An der waagerechten Ablenkung liegt eine bekannte Frequenz von
        <b>500 Hz</b>. Zähle die Berührpunkte der Figur am <b>oberen</b> und am <b>rechten</b> Rand
        und bestimme daraus die unbekannte Frequenz am senkrechten Eingang.</div>
      <div class="osz-lis-txt" style="margin-top:6px">Es gilt
        <b>Berührpunkte oben : Berührpunkte rechts = f<sub>y</sub> : f<sub>x</sub></b>.</div>
      <button class="sim-btn" style="margin-top:8px" onclick="_oszLisLoesung()">Lösung zeigen</button>
      <div id="oszLisLsg"></div>`;
    return;
  }
  el.className = 'osz-lisinfo';
  el.innerHTML = `<div class="osz-lis-kopf">Die Figur ablesen</div>
    <div class="osz-lis-txt">
      Eingestellt ist f<sub>x</sub> : f<sub>y</sub> = <b>${a} : ${b}</b> bei einer
      Phasenverschiebung von <b>${Math.round(_osz.lisPhi)}°</b>.
      Die Kurve berührt den <b>oberen</b> Rand ${b}-mal und den <b>rechten</b> Rand ${a}-mal.
      Das Verhältnis dieser Berührpunkte ist gerade f<sub>y</sub> : f<sub>x</sub> = ${b} : ${a}.
      ${t > 1 ? 'Beide Zahlen haben den gemeinsamen Teiler ' + t
        + ' – gekürzt ergibt das ' + (b / t) + ' : ' + (a / t) + '.' : ''}
    </div>
    <div class="osz-lis-txt" style="margin-top:6px">
      Läge f<sub>x</sub> bei 500 Hz, so wäre f<sub>y</sub> = 500 Hz · ${b}/${a} =
      <b>${_oszFreq(500 * b / a)}</b>.
    </div>
    <div class="fpm-note" style="margin-top:6px">Die Phasenverschiebung verändert nur die
      <i>Form</i> der Figur, nicht die Zahl der Berührpunkte. Bei 1 : 1 wandelt sie den Kreis über
      Ellipsen bis zur Geraden – daran erkennt man am Oszilloskop, ob zwei Spannungen in Phase sind.</div>`;
}
function _oszLisLoesung() {
  const el = document.getElementById('oszLisLsg'); if (!el || !_osz.lisAufg) return;
  el.innerHTML = `<div class="osz-lis-txt" style="margin-top:8px">Die Figur berührt oben
    <b>${_osz.lisB}-mal</b> und rechts <b>${_osz.lisA}-mal</b>. Also ist
    f<sub>y</sub> = 500 Hz · ${_osz.lisB}/${_osz.lisA} =
    <b>${_oszFreq(_osz.lisAufg.loesung)}</b>.</div>`;
}

// ── Station 3 ──────────────────────────────────────────
function _oszRenderSensor() {
  const el = document.getElementById('oszSensorInfo');
  const s = _OSZ_SENSOREN[_osz.sensor];
  if (el) {
    const halb = s.max / 2;
    el.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">Messgröße</span>
        <span class="pho-rz-f">${s.gr}</span><span class="pho-rz-v">0 … ${s.max} ${s.eh}</span></div>
      <div class="pho-rz"><span class="pho-rz-t">genutztes Phänomen</span>
        <span class="pho-rz-f">Messwandler</span><span class="pho-rz-v">${s.prinzip}</span></div>
      <div class="pho-rz"><span class="pho-rz-t">Zusammenhang</span>
        <span class="pho-rz-f">${s.kennlinie}</span><span class="pho-rz-v">${s.art}</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">bei ${_fpmNum(halb, 0)} ${s.eh}</span>
        <span class="pho-rz-f">registrierte Spannung</span>
        <span class="pho-rz-v">${_fpmNum(s.u(halb), 3)} V</span></div>
      <div class="fpm-note">${s.txt}</div>`;
  }
  const ny = document.getElementById('oszNyquist');
  if (ny) {
    const ok = _oszNyquistOk();
    ny.className = 'osz-nyquist ' + (ok ? 'ok' : 'no');
    ny.innerHTML = ok
      ? `<b>Die Messrate reicht.</b> Mit ${Math.round(_osz.rate)} Messungen je Sekunde werden von
         jeder Schwingung des ${Math.round(_osz.sigF)}-Hz-Vorgangs etwa
         ${_fpmNum(_osz.rate / _osz.sigF, 1)} Punkte aufgenommen. Der Verlauf bleibt erkennbar.`
      : `<b>Die Messrate ist zu klein.</b> Bei ${Math.round(_osz.rate)} Hz Messrate und
         ${Math.round(_osz.sigF)} Hz Signal fällt auf jede Schwingung weniger als ein halber
         Messpunkt. Das System speichert brav Zahlen – aber sie zeigen einen Vorgang mit
         scheinbar <b>${_fpmNum(_oszScheinF(), 1)} Hz</b>, den es gar nicht gibt.
         Genau davor warnt die Handreichung: Die Messung läuft schnell und verdeckt ab, und wer
         nicht weiß, was er misst, merkt den Fehler nicht. Als Faustregel muss die Messrate
         <b>mindestens doppelt so groß</b> sein wie die höchste vorkommende Frequenz –
         hier also über ${Math.round(2 * _osz.sigF)} Hz.`;
  }
}

// ── Station 4 ──────────────────────────────────────────
function _oszRenderSchreiber() {
  const el = document.getElementById('oszSchreiberInfo'); if (!el) return;
  const U = _osz.stiftU;
  const maxima = [];
  for (let n = 1; n * _OSZ_FH_DU <= _OSZ_FH_UMAX; n++) maxima.push(_fpmNum(n * _OSZ_FH_DU, 1));
  el.innerHTML = `
    <div class="pho-rz"><span class="pho-rz-t">Stellung des Stiftes – x-Richtung</span>
      <span class="pho-rz-f">Beschleunigungsspannung U</span>
      <span class="pho-rz-v">${_fpmNum(U, 1)} V</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Stellung des Stiftes – y-Richtung</span>
      <span class="pho-rz-f">Auffängerstrom I</span>
      <span class="pho-rz-v">${_fpmNum(_oszFHStrom(U), 2)} nA</span></div>
    <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Abstand der Einbrüche</span>
      <span class="pho-rz-f">ΔU = E<sub>Anregung</sub> / e</span>
      <span class="pho-rz-v">${_fpmNum(_OSZ_FH_DU, 1)} V</span></div>
    <div class="fpm-note">Die Einbrüche liegen bei ${maxima.join(' V, ')} V. Ihr gleichmäßiger
      Abstand von ${_fpmNum(_OSZ_FH_DU, 1)} V ist die Anregungsenergie des Quecksilberatoms in
      Elektronenvolt – gemessen mit nichts als einem Voltmeter und einem Stift auf Papier.</div>`;
}

// ── Zeichnung: Oszilloskopschirm ───────────────────────
function _oszSchirmGeo(cv) {
  const gw = _OSZ_XDIV * _OSZ_PX, gh = _OSZ_YDIV * _OSZ_PX;
  return { gx: (cv.width - gw) / 2, gy: 14, gw, gh };
}
function _oszRenderSchirm(ctx, cv) {
  const W = cv.width, H = cv.height;
  const G = _oszSchirmGeo(cv);
  ctx.fillStyle = '#0a0f0a'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#0d1a12'; ctx.fillRect(G.gx, G.gy, G.gw, G.gh);

  // Raster
  ctx.strokeStyle = '#1c3a29'; ctx.lineWidth = 1;
  for (let i = 0; i <= _OSZ_XDIV; i++) {
    ctx.beginPath(); ctx.moveTo(G.gx + i * _OSZ_PX, G.gy); ctx.lineTo(G.gx + i * _OSZ_PX, G.gy + G.gh); ctx.stroke();
  }
  for (let j = 0; j <= _OSZ_YDIV; j++) {
    ctx.beginPath(); ctx.moveTo(G.gx, G.gy + j * _OSZ_PX); ctx.lineTo(G.gx + G.gw, G.gy + j * _OSZ_PX); ctx.stroke();
  }
  // Mittelachsen mit Feinteilung, wie am echten Geraet
  const mx = G.gx + G.gw / 2, my = G.gy + G.gh / 2;
  ctx.strokeStyle = '#2d5c42'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(mx, G.gy); ctx.lineTo(mx, G.gy + G.gh);
  ctx.moveTo(G.gx, my); ctx.lineTo(G.gx + G.gw, my); ctx.stroke();
  ctx.strokeStyle = '#2d5c42'; ctx.lineWidth = 1;
  for (let i = 0; i <= _OSZ_XDIV * 5; i++) {
    const x = G.gx + i * _OSZ_PX / 5;
    ctx.beginPath(); ctx.moveTo(x, my - 3); ctx.lineTo(x, my + 3); ctx.stroke();
  }
  for (let j = 0; j <= _OSZ_YDIV * 5; j++) {
    const y = G.gy + j * _OSZ_PX / 5;
    ctx.beginPath(); ctx.moveTo(mx - 3, y); ctx.lineTo(mx + 3, y); ctx.stroke();
  }

  const start = _oszStartZeit();
  const kein = start === null;

  if (kein) {
    ctx.fillStyle = '#f87171'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Kein Triggersignal – der Schirm bleibt leer.', mx, my - 8);
    ctx.font = '11px sans-serif'; ctx.fillStyle = '#94a3b8';
    ctx.fillText('Der Triggerpegel liegt außerhalb des Signals. Pegel verkleinern oder auf Auto stellen.', mx, my + 12);
    ctx.textAlign = 'left';
  } else {
    const farben = ['#facc15', '#38bdf8'];
    for (let k = 0; k < 2; k++) {
      const c = _osz.kanal[k];
      if (!c.an) continue;
      const vd = _oszVdiv(k);
      ctx.strokeStyle = farben[k]; ctx.lineWidth = 1.8;
      ctx.beginPath();
      let begonnen = false;
      for (let px = 0; px <= G.gw; px++) {
        const t = start + px / _OSZ_PX * _oszTdiv();
        const u = _oszSpannung(k, t);
        const y = my - (u / vd + c.pos) * _OSZ_PX;
        if (y < G.gy - 60 || y > G.gy + G.gh + 60) { begonnen = false; continue; }
        const yy = Math.max(G.gy, Math.min(G.gy + G.gh, y));
        const xx = G.gx + px;
        begonnen ? ctx.lineTo(xx, yy) : (ctx.moveTo(xx, yy), begonnen = true);
      }
      ctx.stroke();
      // Nullmarke am linken Rand
      ctx.fillStyle = farben[k]; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
      const y0 = my - c.pos * _OSZ_PX;
      if (y0 > G.gy && y0 < G.gy + G.gh) {
        ctx.fillText(String(k + 1) + '▸', G.gx + 3, y0 - 3);
      }
    }
    // Triggermarke
    const tq = _osz.kanal[_osz.trigQ];
    if (tq.an && _oszTriggert()) {
      const yt = my - (_osz.trigLvl / _oszVdiv(_osz.trigQ) + tq.pos) * _OSZ_PX;
      if (yt > G.gy && yt < G.gy + G.gh) {
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(G.gx, yt); ctx.lineTo(G.gx + G.gw, yt); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#4ade80'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('Trigger', G.gx + G.gw - 3, yt - 4);
      }
    }
  }

  // Randbeschriftung
  ctx.fillStyle = '#4b7a63'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('10 Kästchen  ·  TIME/DIV', mx, G.gy + G.gh + 13);
  ctx.save(); ctx.translate(G.gx - 5, my); ctx.rotate(-Math.PI / 2);
  ctx.fillText('8 Kästchen · VOLTS/DIV', 0, 0); ctx.restore();
  ctx.textAlign = 'left';
}

// ── Zeichnung: Lissajous ───────────────────────────────
function _oszRenderLisCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  const G = _oszSchirmGeo(cv);
  ctx.fillStyle = '#0a0f0a'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#0d1a12'; ctx.fillRect(G.gx, G.gy, G.gw, G.gh);
  ctx.strokeStyle = '#1c3a29'; ctx.lineWidth = 1;
  for (let i = 0; i <= _OSZ_XDIV; i++) {
    ctx.beginPath(); ctx.moveTo(G.gx + i * _OSZ_PX, G.gy); ctx.lineTo(G.gx + i * _OSZ_PX, G.gy + G.gh); ctx.stroke();
  }
  for (let j = 0; j <= _OSZ_YDIV; j++) {
    ctx.beginPath(); ctx.moveTo(G.gx, G.gy + j * _OSZ_PX); ctx.lineTo(G.gx + G.gw, G.gy + j * _OSZ_PX); ctx.stroke();
  }
  const mx = G.gx + G.gw / 2, my = G.gy + G.gh / 2;
  const rx = 3.2 * _OSZ_PX, ry = 3.2 * _OSZ_PX;

  const pts = _oszLisPunkte(_osz.lisA, _osz.lisB, _osz.lisPhi, 1400);
  ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach((p, i) => {
    const x = mx + p.x * rx, y = my - p.y * ry;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();

  // Beruehrpunkte hervorheben – sie sind das Messinstrument
  ctx.fillStyle = '#fbbf24';
  for (let i = 0; i < _osz.lisB; i++) {
    const s = (0.25 + i) / _osz.lisB;
    const x = mx + Math.sin(2 * Math.PI * _osz.lisA * s + _osz.lisPhi * Math.PI / 180) * rx;
    ctx.beginPath(); ctx.arc(x, my - ry, 4, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.fillStyle = '#f472b6';
  for (let i = 0; i < _osz.lisA; i++) {
    const s = (0.25 - _osz.lisPhi / 360 + i) / _osz.lisA;
    const y = my - Math.sin(2 * Math.PI * _osz.lisB * s) * ry;
    ctx.beginPath(); ctx.arc(mx + rx, y, 4, 0, 2 * Math.PI); ctx.fill();
  }

  ctx.fillStyle = '#fbbf24'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_osz.lisB + ' Berührpunkte oben', mx, G.gy + 12);
  ctx.fillStyle = '#f472b6'; ctx.textAlign = 'right';
  ctx.fillText(_osz.lisA + ' rechts', G.gx + G.gw - 6, my + 40);
  ctx.fillStyle = '#4b7a63'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_osz.lisAufg ? 'unbekanntes Verhältnis'
    : 'f_x : f_y = ' + _osz.lisA + ' : ' + _osz.lisB + '   ·   φ = ' + Math.round(_osz.lisPhi) + '°',
    mx, G.gy + G.gh + 13);
  ctx.textAlign = 'left';
}

// ── Zeichnung: Wandlerkennlinie ────────────────────────
function _oszRenderWandler(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const s = _OSZ_SENSOREN[_osz.sensor];
  const padL = 52, padR = 14, padT = 30, padB = 34;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;
  const umax = Math.max(s.u(s.max) * 1.15, 0.1);

  const X = v => x0 + v / s.max * (x1 - x0);
  const Y = v => y0 - v / umax * (y0 - y1);

  ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  const xt = _fpmTicks(s.max, 5);
  ctx.font = '9px sans-serif';
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 13);
  });
  const yt = _fpmTicks(umax, 4);
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 5, Y(v) + 3);
  });
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();

  ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 200; i++) {
    const g = i / 200 * s.max;
    const x = X(g), y = Y(s.u(g));
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(s.gr + ' in ' + s.eh, x1, y0 + 27);
  ctx.save(); ctx.translate(13, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('registrierte Spannung in V', 0, 0); ctx.restore();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0369a1'; ctx.font = '700 10px sans-serif';
  ctx.fillText(s.n + ': ' + s.kennlinie, x0, 16);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif';
  ctx.fillText(s.art, x0, 26);
}

// ── Zeichnung: Abtastung ───────────────────────────────
function _oszRenderAbtast(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const padL = 52, padR = 14, padT = 26, padB = 32;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;
  const my = (y0 + y1) / 2, amp = (y0 - y1) / 2 * 0.82;
  const T = _osz.dauer;

  const X = t => x0 + t / T * (x1 - x0);

  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0, my); ctx.lineTo(x1, my); ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();

  // Der wahre Verlauf
  ctx.strokeStyle = '#fca5a5'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let px = 0; px <= x1 - x0; px++) {
    const t = px / (x1 - x0) * T;
    const y = my - Math.sin(2 * Math.PI * _osz.sigF * t) * amp;
    px ? ctx.lineTo(x0 + px, y) : ctx.moveTo(x0 + px, y);
  }
  ctx.stroke();

  // Die tatsaechlich aufgenommenen Punkte
  const n = Math.min(400, Math.floor(T * _osz.rate));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / _osz.rate;
    if (t > T) break;
    pts.push({ x: X(t), y: my - Math.sin(2 * Math.PI * _osz.sigF * t) * amp });
  }
  ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach((p, i) => { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
  ctx.stroke();
  ctx.fillStyle = '#0369a1';
  if (pts.length <= 120) pts.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, 2 * Math.PI); ctx.fill();
  });

  ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText('■ wahrer Verlauf: ' + Math.round(_osz.sigF) + ' Hz', x0, 12);
  ctx.fillStyle = '#0369a1';
  ctx.fillText('■ aufgenommen: ' + pts.length + ' Messpunkte bei ' + Math.round(_osz.rate) + ' Hz', x0, 22);
  ctx.fillStyle = '#475569'; ctx.textAlign = 'right';
  ctx.fillText('Zeit in s', x1, y0 + 22);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('0', x0, y0 + 22);
  ctx.fillText(_fpmNum(T, 2), x1 - 24, y0 + 22);
  ctx.textAlign = 'left';
}

// ── Zeichnung: x-y-Schreiber ───────────────────────────
function _oszRenderSchreiberCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f1f5f9'; ctx.fillRect(0, 0, W, H);
  // Papier
  const px0 = 46, py0 = H - 44, px1 = W - 20, py1 = 26;
  ctx.fillStyle = '#fffdf7'; ctx.fillRect(px0, py1, px1 - px0, py0 - py1);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  ctx.strokeRect(px0, py1, px1 - px0, py0 - py1);

  // Millimeterartiges Papierraster
  const imax = 3.6;
  ctx.strokeStyle = '#f0e9d8';
  for (let u = 0; u <= _OSZ_FH_UMAX; u += 2) {
    const x = px0 + u / _OSZ_FH_UMAX * (px1 - px0);
    ctx.beginPath(); ctx.moveTo(x, py1); ctx.lineTo(x, py0); ctx.stroke();
  }
  for (let i = 0; i <= imax; i += 0.5) {
    const y = py0 - i / imax * (py0 - py1);
    ctx.beginPath(); ctx.moveTo(px0, y); ctx.lineTo(px1, y); ctx.stroke();
  }

  const X = u => px0 + u / _OSZ_FH_UMAX * (px1 - px0);
  const Y = i => py0 - Math.min(i, imax) / imax * (py0 - py1);

  // Achsen
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(px0, py1); ctx.lineTo(px0, py0); ctx.lineTo(px1, py0); ctx.stroke();
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  for (let u = 0; u <= _OSZ_FH_UMAX; u += 5) {
    ctx.beginPath(); ctx.moveTo(X(u), py0); ctx.lineTo(X(u), py0 + 4); ctx.stroke();
    ctx.fillText(String(u), X(u), py0 + 14);
  }
  ctx.fillText('Beschleunigungsspannung U in V', (px0 + px1) / 2, py0 + 28);
  ctx.save(); ctx.translate(14, (py0 + py1) / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('Auffängerstrom I', 0, 0); ctx.restore();

  // Die bereits gezogene Spur
  if (_osz.spur.length > 1) {
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.8;
    ctx.beginPath();
    _osz.spur.forEach((p, i) => {
      const x = X(p.u), y = Y(p.i);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  }

  // Abstandsmarken zwischen den Einbruechen
  if (_osz.stiftU >= _OSZ_FH_DU * 2) {
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let n = 1; n * _OSZ_FH_DU + 0.7 <= Math.min(_osz.stiftU, _OSZ_FH_UMAX); n++) {
      const u = n * _OSZ_FH_DU + 0.7;
      ctx.beginPath(); ctx.moveTo(X(u), py1); ctx.lineTo(X(u), py0); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = '#dc2626'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Abstand 4,9 V', X(_OSZ_FH_DU * 1.5 + 0.7), py1 + 10);
  }

  // Der Stift
  const sx = X(Math.min(_osz.stiftU, _OSZ_FH_UMAX));
  const sy = Y(_oszFHStrom(_osz.stiftU));
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(sx, py1 - 12); ctx.lineTo(sx, sy); ctx.stroke();
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.arc(sx, sy, 3.5, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Stift', sx, py1 - 16);
  ctx.textAlign = 'left';
}

// ── Takt und Zeichnung ─────────────────────────────────
function _oszTakt(dt) {
  if (!_osz) return;
  const d = Math.min(0.05, dt);
  _osz.t += d;
  if (_osz.laeuft) {
    _osz.stiftU += d * 6;
    if (_osz.stiftU >= _OSZ_FH_UMAX) {
      _osz.stiftU = _OSZ_FH_UMAX;
      _osz.laeuft = false;
      const b = document.getElementById('oszSchrBtn');
      if (b) b.textContent = '▶ Schreiber starten';
    }
    _osz.spur.push({ u: _osz.stiftU, i: _oszFHStrom(_osz.stiftU) });
  }
}
function _oszRender() {
  if (!_osz) return;
  if (_osz.station === 0) {
    const cv = document.getElementById('oszSchirm');
    if (cv) _oszRenderSchirm(cv.getContext('2d'), cv);
  } else if (_osz.station === 1) {
    const cv = document.getElementById('oszLis');
    if (cv) _oszRenderLisCv(cv.getContext('2d'), cv);
  } else if (_osz.station === 2) {
    const cw = document.getElementById('oszWandler');
    if (cw) _oszRenderWandler(cw.getContext('2d'), cw);
    const ca = document.getElementById('oszAbtast');
    if (ca) _oszRenderAbtast(ca.getContext('2d'), ca);
  } else if (_osz.station === 3) {
    const cs = document.getElementById('oszSchreiber');
    if (cs) _oszRenderSchreiberCv(cs.getContext('2d'), cs);
    if (_osz.laeuft) _oszRenderSchreiber();
  }
}

// ── Zusätzliche Styles für Oszilloskop und Messwerterfassung ──
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .osz-gruppe { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 8px 11px; margin: 8px 0; }
    .osz-gruppe-k { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em;
      font-weight: 800; color: #94a3b8; margin-bottom: 5px; }
    .osz-gen-k { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em;
      font-weight: 800; color: #94a3b8; margin: 8px 0 4px;
      border-top: 1px solid #e2e8f0; padding-top: 7px; }
    .osz-zeile { display: flex; align-items: center; gap: 6px; margin: 4px 0; font-size: .74rem; }
    .osz-zeile > span:first-child { color: #64748b; font-weight: 700; flex: 0 0 84px; }
    .osz-zeile > b { color: #1e293b; font-variant-numeric: tabular-nums; min-width: 54px; }
    .osz-zeile input[type=range] { flex: 1 1 auto; min-width: 60px; accent-color: #475569; }
    .osz-knopf { background: #fff; border: 1px solid #cbd5e1; border-radius: 6px;
      padding: 1px 7px; cursor: pointer; color: #475569; font-size: .74rem; }
    .osz-knopf:hover { background: #f1f5f9; }
    .osz-seg { display: flex; gap: 3px; }
    .osz-segb { background: #fff; border: 1px solid #cbd5e1; border-radius: 6px;
      padding: 2px 7px; cursor: pointer; color: #64748b; font-size: .68rem; font-weight: 700; }
    .osz-segb.on { background: #1e293b; border-color: #1e293b; color: #fff; }
    .osz-sel { flex: 1 1 auto; border: 1px solid #cbd5e1; border-radius: 6px;
      padding: 2px 5px; font-size: .72rem; color: #475569; background: #fff; }
    .osz-status { display: flex; gap: 5px; align-items: baseline; flex-wrap: wrap;
      background: #0a0f0a; border-radius: 0 0 9px 9px; margin-top: -4px;
      padding: 5px 10px 7px; font-size: .7rem; }
    .osz-st-k { font-size: .58rem; text-transform: uppercase; letter-spacing: .05em;
      font-weight: 800; color: #4b7a63; }
    .osz-status b { color: #e2e8f0; font-variant-numeric: tabular-nums; margin-right: 6px; }
    .osz-aufgabe { font-size: .78rem; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 9px; padding: 9px 11px; margin-bottom: 8px; line-height: 1.55; }
    .osz-aufgabe.an { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
    .osz-aufgabe.ok { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
    .osz-aufgabe.no { background: #fffbeb; border-color: #fde68a; color: #b45309; }
    .osz-lese { display: flex; flex-direction: column; gap: 5px; margin-bottom: 8px; }
    .osz-lese-z { display: flex; align-items: center; gap: 7px; font-size: .76rem; color: #475569; }
    .osz-inp { width: 64px; text-align: center; font-variant-numeric: tabular-nums; }
    .osz-lisinfo { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 10px 12px; }
    .osz-lisinfo.an { background: #eff6ff; border-color: #bfdbfe; }
    .osz-lis-kopf { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em;
      font-weight: 800; color: #94a3b8; margin-bottom: 4px; }
    .osz-lis-txt { font-size: .79rem; color: #475569; line-height: 1.6; }
    .osz-nyquist { font-size: .78rem; border-radius: 9px; padding: 9px 11px;
      margin-top: 8px; line-height: 1.55; }
    .osz-nyquist.ok { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
    .osz-nyquist.no { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
    .osz-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();
// ═══════════════════════════════════════════════════════
// SCHWINGENDE LEITERSCHAUKEL IM MAGNETFELD
// Schluesselexperiment 09 der NRW-Handreichung.
// Deckt die sechs Kompetenzen des KLP ab:
//   1 Induktionsspannung aus der Lorentzkraft erklaeren       -> Station 2
//   2 Spannung als Energie je Ladung definieren               -> Station 2
//   3 Drei-Finger-Regel anwenden                              -> Station 2
//   4 Oszillogramme nach Zeiten, Frequenzen, Spannungen lesen -> Station 1
//   5 Aufbau und Ergebnis adressatenbezogen erlaeutern        -> Station 1
//   6 die beiden Induktionsursachen unterscheiden             -> Station 5
// ═══════════════════════════════════════════════════════

const _LSK_G = 9.81;
const _LSK_MU0 = 4e-7 * Math.PI;
const _LSK_K = 8 / (5 * Math.sqrt(5));   // Helmholtz-Vorfaktor ≈ 0,7155

// Helmholtzspulen des Bestaetigungsversuchs. Aus der Messtabelle der
// Handreichung zurueckgerechnet: es sind dieselben Spulen wie beim
// Fadenstrahlrohr, n = 130 Windungen bei R = 0,15 m.
const _LSK_HN = 130;
const _LSK_HR = 0.150;
const _LSK_SCHLEIFEN = 15;      // flache Spule des Bestaetigungsversuchs
const _LSK_SCHLEIFE_L = 0.10;   // Breite einer Schleife in m

// Messverstaerker und Oszilloskop nach den Angaben der Handreichung
const _LSK_VORV = 10000;        // Vorverstaerkung des Mikrovoltverstaerkers
const _LSK_VDIV = 2;            // Volt je Kaestchen am Oszilloskop
const _LSK_ZEITEN = [0.2, 0.5, 1, 2, 5];   // Sekunden je Kaestchen
const _LSK_XDIV = 10, _LSK_YDIV = 8;

// Hufeisenmagnet: nur der Teil des Stabes zwischen den Polschuhen liegt im
// Feld. Deshalb zaehlt hier die Polschuhbreite als wirksame Leiterlaenge.
const _LSK_POL = 0.04;

let _lsk = null;

function _lskInit() {
  _lsk = {
    station: 0,
    // Pendel
    pl: 0.75,          // Laenge der Aufhaengung in m (2 x 75 cm Kabel)
    phi0: 0.20,        // Anfangsauslenkung in rad
    stabL: 0.12,       // Laenge des Metallstabes in m
    B: 0.025,          // Feld zwischen den Polschuhen in T
    fahnen: false,     // Papierfahnen zur Verstaerkung der Daempfung
    laeuft: false, t: 0, spur: [],
    zeitI: 0,          // Index in _LSK_ZEITEN
    leseA: '', leseT: '', geprueft: null,
    // Station 2
    vRichtung: 1, bRichtung: 1, schritt: 0,
    // Station 3
    hv: 0.40, hB: 0.0020, hL: 1.50, halpha: 90,
    rows: [], nextId: 1, preset: 0, fn: null, fnAuto: false, reveal: false,
    // Station 4
    hI: 2.00, hallAn: true, versatz: 0,
    // Station 5
    objekt: 'ring',    // 'ring' | 'stab-offen' | 'stab-kurz'
    magnetAn: true, magnetUm: false,
    rlaeuft: false, rphi0: 0.30, rt: 0,
    ursache: 'flaeche',
    // Station 6
    ruhelage: 0.0,     // Verschiebung der Ruhelage aus der Feldmitte in m
    ilaeuft: false, it: 0, ispur: []
  };
}

// ── Pendelbewegung ─────────────────────────────────────
// Gedaempfte harmonische Schwingung. Die Handreichung zeigt genau das:
// bei kurzer Messzeit nahezu sinusfoermig, ueber 20 bis 30 Perioden wird
// die exponentielle Abnahme der Amplituden sichtbar.
function _lskOmega0(l) { return Math.sqrt(_LSK_G / l); }
function _lskDelta() {
  // Luftwiderstand und Lager; die Papierfahnen erhoehen die Daempfung deutlich
  return _lsk.fahnen ? 0.15 : 0.02;
}
function _lskPeriode(l) {
  const w0 = _lskOmega0(l), d = _lskDelta();
  const w = Math.sqrt(Math.max(1e-9, w0 * w0 - d * d));
  return 2 * Math.PI / w;
}
function _lskPhi(t) {
  const w0 = _lskOmega0(_lsk.pl), d = _lskDelta();
  const w = Math.sqrt(Math.max(1e-9, w0 * w0 - d * d));
  return _lsk.phi0 * Math.exp(-d * t) * Math.cos(w * t);
}
// Geschwindigkeit des Stabes: v = l · dφ/dt
function _lskV(t) {
  const w0 = _lskOmega0(_lsk.pl), d = _lskDelta();
  const w = Math.sqrt(Math.max(1e-9, w0 * w0 - d * d));
  const e = Math.exp(-d * t);
  return _lsk.pl * _lsk.phi0 * e * (-d * Math.cos(w * t) - w * Math.sin(w * t));
}
function _lskVMax() { return _lsk.pl * _lsk.phi0 * _lskOmega0(_lsk.pl); }

// ── Die Grundbeziehung ─────────────────────────────────
// U = L · v · B, hergeleitet aus dem Kraftansatz mit der Lorentzkraft.
function _lskU(L, v, B, alphaGrad) {
  const a = alphaGrad === undefined ? 90 : alphaGrad;
  return L * v * B * Math.sin(a * Math.PI / 180);
}
// Wirksame Leiterlaenge am Hufeisenmagneten: nur der Teil zwischen den
// Polschuhen liegt im Feld.
function _lskLWirk() { return Math.min(_lsk.stabL, _LSK_POL); }
function _lskUt(t) { return _lskU(_lskLWirk(), _lskV(t), _lsk.B); }

// Was das Oszilloskop nach dem Verstaerker anzeigt
function _lskAnzeige(u) { return u * _LSK_VORV; }
function _lskKaestchen(u) { return _lskAnzeige(u) / _LSK_VDIV; }
function _lskZeit() { return _LSK_ZEITEN[_lsk.zeitI]; }

// ── Spannung als Energie je Ladung (Kompetenz UF2) ─────
// Die Lorentzkraft schiebt eine Ladung e ueber die Leiterlaenge L.
// Die dabei verrichtete Arbeit je Ladung ist gerade die Spannung.
const _LSK_E = 1.602e-19;
function _lskArbeit(L, v, B) { return _LSK_E * v * B * L; }
function _lskUAusArbeit(L, v, B) { return _lskArbeit(L, v, B) / _LSK_E; }

// ── Helmholtzfeld des Bestaetigungsversuchs ────────────
function _lskBHelm(I) { return _LSK_K * _LSK_MU0 * _LSK_HN * I / _LSK_HR; }
// Die Hallsonde zeigt auf 0,1 mT gerundet an – wie in der Messtabelle
function _lskBHall(I) { return Math.round(_lskBHelm(I) / 1e-4) * 1e-4; }
function _lskBMess() { return _lsk.hallAn ? _lskBHall(_lsk.hI) : _lskBHelm(_lsk.hI); }
function _lskLEff() { return _LSK_SCHLEIFEN * _LSK_SCHLEIFE_L; }

// Die fuenf Messungen aus Abbildung 10 der Handreichung
const _LSK_ORIGINAL = [
  { I: 2.57, Bg: 2.1,   v: 0.34, Ug: 1.04, Ub: 1.07 },
  { I: 2.00, Bg: 1.6,   v: 0.41, Ug: 0.95, Ub: 0.98 },
  { I: 1.00, Bg: 0.796, v: 0.40, Ug: 0.46, Ub: 0.48 },
  { I: 1.50, Bg: 1.2,   v: 0.46, Ug: 0.78, Ub: 0.83 },
  { I: 2.50, Bg: 2.0,   v: 0.34, Ug: 0.97, Ub: 1.02 }
];

// ── Ringversuch: die bremsende Kraft ───────────────────
// Fliesst der induzierte Strom wirklich, wird der Leiter selbst zum
// stromdurchflossenen Leiter im Magnetfeld: F = I·L·B = L²·B²·v / R.
const _LSK_KOERPER = {
  'ring':       { n: 'Aluminiumring', m: 0.0254, R: 6.24e-4, L: _LSK_POL,
                  txt: 'Ein geschlossener Aluminiumring hat einen sehr kleinen Widerstand. Der induzierte Strom wird dadurch groß – und mit ihm die bremsende Kraft.' },
  'stab-kurz':  { n: 'Leiterschaukel, kurzgeschlossen', m: 0.0041, R: 0.05, L: _LSK_POL,
                  txt: 'Verbindet man die beiden Aufhängungsdrähte mit einem Kabel, kann ein Strom fließen. Der Widerstand ist aber viel größer und die Masse kleiner als beim Ring – die Bremswirkung bleibt gering.' },
  'stab-offen': { n: 'Leiterschaukel am Voltmeter', m: 0.0041, R: 1e7, L: _LSK_POL,
                  txt: 'Ein Spannungsmessgerät hat einen sehr hohen Eingangswiderstand. Es fließt praktisch kein Strom, also wirkt auch keine bremsende Kraft. Die Schaukel schwingt so lange wie ohne Magnet.' }
};
function _lskKoerper() { return _LSK_KOERPER[_lsk.objekt]; }
// F = L²B²v/R  ⇒  m·dv/dt = -L²B²/R · v  ⇒  Abklingkonstante L²B²/(2mR)
function _lskDeltaEM(B) {
  const k = _lskKoerper();
  if (!_lsk.magnetAn) return 0;
  return k.L * k.L * B * B / (2 * k.m * k.R);
}
function _lskBremsKraft(B, v) {
  const k = _lskKoerper();
  return _lsk.magnetAn ? k.L * k.L * B * B * v / k.R : 0;
}
const _LSK_RING_B = 0.15;      // Feld dicht am Polschuh
const _LSK_RING_L = 0.20;      // Pendellaenge des Ringversuchs
function _lskRingDelta() { return 0.05 + _lskDeltaEM(_LSK_RING_B); }
function _lskRingPhi(t) {
  const w0 = Math.sqrt(_LSK_G / _LSK_RING_L), d = _lskRingDelta();
  const w = Math.sqrt(Math.max(1e-9, w0 * w0 - d * d));
  return _lsk.rphi0 * Math.exp(-d * t) * Math.cos(w * t);
}

// ── Inhomogenes Feld ───────────────────────────────────
// Zwischen den Schenkeln ist das Feld nahezu konstant, ausserhalb faellt es
// schnell ab. Genau daher stammt die Verzerrung im zweiten Oszillogramm der
// Handreichung.
const _LSK_HALBBREITE = 0.045;   // halbe Breite des homogenen Bereichs in m
function _lskBOrt(x) {
  const a = Math.abs(x);
  if (a <= _LSK_HALBBREITE) return _lsk.B;
  // ausserhalb faellt das Streufeld naeherungsweise exponentiell ab
  return _lsk.B * Math.exp(-(a - _LSK_HALBBREITE) / 0.022);
}
function _lskInhomX(t) {
  const w0 = _lskOmega0(_lsk.pl), d = _lskDelta();
  const w = Math.sqrt(Math.max(1e-9, w0 * w0 - d * d));
  return _lsk.ruhelage + _lsk.pl * _lsk.phi0 * Math.exp(-d * t) * Math.cos(w * t);
}
function _lskInhomU(t) {
  return _lskLWirk() * _lskV(t) * _lskBOrt(_lskInhomX(t));
}

// ── Zahlformat ─────────────────────────────────────────
function _lskMV(u) { return _fpmNum(u * 1000, 3); }

// ── Oberfläche ─────────────────────────────────────────
function _lskHTML() {
  const stationen = ['1 · Versuch & Oszillogramm', '2 · Warum entsteht U?',
                     '3 · Hypothesen prüfen', '4 · Bestätigungsversuch',
                     '5 · Ringversuch & Dämpfung', '6 · Inhomogenes Feld']
    .map((s, i) => `<button class="fpm-tab${i === _lsk.station ? ' on' : ''}" id="lskSt${i}" onclick="_lskSetStation(${i})">${s}</button>`).join('');

  const presets = ['v → U', 'B → U', 'L → U', 'sin α → U'].map((p, i) =>
    `<button class="fpm-tab${i === _lsk.preset ? ' on' : ''}" id="lskTab${i}" onclick="_lskSetPreset(${i})">${p}</button>`).join('');

  const koerper = Object.keys(_LSK_KOERPER).map(k =>
    `<button class="ebr-obj${k === _lsk.objekt ? ' on' : ''}" id="lskK_${k}" onclick="_lskSetKoerper('${k}')">
       <span class="ebr-obj-n">${_LSK_KOERPER[k].n}</span>
       <span class="ebr-obj-k">R = ${_LSK_KOERPER[k].R >= 1000 ? '10 MΩ' : _fpmNum(_LSK_KOERPER[k].R * 1000, 2) + ' mΩ'} · m = ${_fpmNum(_LSK_KOERPER[k].m * 1000, 1)} g</span></button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim lsk-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">🧲 Leiterschaukel: das Schlüsselexperiment</h3>
    <canvas id="lskTakt" width="1" height="1" style="display:none"></canvas>
    <div class="fpm-tabs">${stationen}</div>

    <!-- ══ Station 1 ══ -->
    <div id="lskS0">
      <div class="fpm-grid">
        <div>
          <canvas id="lskAufbau" width="440" height="264" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Der Stab schwingt zwischen den Polschuhen des Hufeisenmagneten</div>
          <canvas id="lskOszi" width="440" height="300" class="phys-anim-cv"></canvas>
          <div class="osz-status" id="lskOsziStatus"></div>
          <div class="fpm-note">Einstellungen wie in der Handreichung: Verstärkung
            ${_LSK_VDIV} V je Kästchen, Vorverstärkung ${_LSK_VORV}. Ein Kästchen entspricht
            am Eingang also nur ${_fpmNum(_LSK_VDIV / _LSK_VORV * 1000, 2)} mV.</div>
        </div>
        <div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="lskStartBtn" onclick="_lskToggle()">▶ Auslenken und loslassen</button>
            <button class="sim-btn" onclick="_lskReset()">↺ Zurücksetzen</button>
          </div>
          <div class="osz-gruppe">
            <div class="osz-gruppe-k">Zeitablenkung des Speicheroszilloskops</div>
            <div class="osz-zeile"><span>s je Kästchen</span>
              <button class="osz-knopf" onclick="_lskStepZeit(-1)">◀</button>
              <b id="lskZeitLbl">0,2 s</b>
              <button class="osz-knopf" onclick="_lskStepZeit(1)">▶</button></div>
            <div class="fpm-note" style="margin-top:4px">Die Handreichung zeigt genau zwei
              Einstellungen: 0,2 s je Kästchen für den Verlauf einer einzelnen Schwingung und
              5 s je Kästchen, um die Abnahme der Amplituden über 20 bis 30 Perioden zu sehen.</div>
          </div>
          <div class="osz-gruppe">
            <div class="osz-gruppe-k">Versuchsaufbau</div>
            <div class="osz-zeile"><span>Aufhängung l</span>
              <input type="range" id="lskPl" min="0.4" max="1" step="0.05" value="0.75"
                oninput="_lskSetPl(this.value)"><b id="lskPlLbl">75 cm</b></div>
            <div class="osz-zeile"><span>Stablänge</span>
              <input type="range" id="lskStabL" min="0.10" max="0.15" step="0.005" value="0.12"
                oninput="_lskSetStabL(this.value)"><b id="lskStabLLbl">12 cm</b></div>
            <div class="osz-zeile"><span>Auslenkung</span>
              <input type="range" id="lskPhi0" min="0.05" max="0.30" step="0.01" value="0.20"
                oninput="_lskSetPhi0(this.value)"><b id="lskPhi0Lbl">11°</b></div>
            <div class="osz-zeile"><span>Magnetfeld B</span>
              <input type="range" id="lskB" min="0.005" max="0.05" step="0.001" value="0.025"
                oninput="_lskSetB(this.value)"><b id="lskBLbl">25 mT</b></div>
            <label class="fpm-check"><input type="checkbox" id="lskFahnen"
              onchange="_lskSetFahnen(this.checked)"> Papierfahnen an den Leiterenden
              (verstärken die Dämpfung)</label>
          </div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Geschwindigkeit v</span><span class="fpm-ro-v" id="lskVA">—</span><span class="fpm-ro-u">m/s</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Induktionsspannung U</span><span class="fpm-ro-v" id="lskUA">—</span><span class="fpm-ro-u">mV</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Periodendauer T</span><span class="fpm-ro-v" id="lskTA">—</span><span class="fpm-ro-u">s</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Frequenz f</span><span class="fpm-ro-v" id="lskFA">—</span><span class="fpm-ro-u">Hz</span></div>
          </div>
          <div class="fpm-label">Ablesen am Oszillogramm</div>
          <div class="osz-lese">
            <div class="osz-lese-z"><span>Größter Ausschlag</span>
              <input type="text" class="fpm-input osz-inp" id="lskLeseA" placeholder="?"
                spellcheck="false" oninput="_lskSetLese('leseA',this.value)"><span>Kästchen</span></div>
            <div class="osz-lese-z"><span>Eine Periode</span>
              <input type="text" class="fpm-input osz-inp" id="lskLeseT" placeholder="?"
                spellcheck="false" oninput="_lskSetLese('leseT',this.value)"><span>Kästchen</span></div>
          </div>
          <div class="ebr-rechnung" id="lskLeseAus"></div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_lskPruefen()">✓ Ablesung prüfen</button>
          </div>
          <div class="lsk-zustand" id="lskLesePruef"></div>
        </div>
      </div>
      <div class="lsk-k3" id="lskK3"></div>
    </div>

    <!-- ══ Station 2 ══ -->
    <div id="lskS1" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="lskHerleitung" width="440" height="330" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Aufsicht auf den bewegten Leiter – wie in Abbildung 7</div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_lskUmkehr('vRichtung')">🔄 Bewegungsrichtung umkehren</button>
            <button class="sim-btn" onclick="_lskUmkehr('bRichtung')">🔄 Feldrichtung umkehren</button>
          </div>
          <div class="lsk-drei" id="lskDrei"></div>
        </div>
        <div>
          <div class="fpm-label">Die Herleitung Schritt für Schritt</div>
          <div class="lsk-schritte" id="lskSchritte"></div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_lskSchritt(-1)">◀ zurück</button>
            <button class="sim-btn primary" onclick="_lskSchritt(1)">weiter ▶</button>
            <button class="sim-btn" onclick="_lskSchritt(99)">alle zeigen</button>
          </div>
          <div class="fpm-label" style="margin-top:10px">Zweiter Weg: Spannung als Energie je Ladung</div>
          <div class="ebr-rechnung" id="lskEnergie"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 3 ══ -->
    <div id="lskS2" style="display:none">
      <div class="lsk-hypo" id="lskHypo"></div>
      <div class="fpm-grid">
        <div>
          <div class="fpm-label">Im homogenen Feld messen – ein Parameter nach dem anderen</div>
          <div class="osz-gruppe">
            <div class="osz-zeile"><span>Geschwindigkeit v</span>
              <input type="range" id="lskHv" min="0.05" max="0.8" step="0.01" value="0.4"
                oninput="_lskSetH('hv',this.value)"><b id="lskHvLbl">0,40 m/s</b></div>
            <div class="osz-zeile"><span>Magnetfeld B</span>
              <input type="range" id="lskHB" min="0.0002" max="0.004" step="0.0001" value="0.002"
                oninput="_lskSetH('hB',this.value)"><b id="lskHBLbl">2,00 mT</b></div>
            <div class="osz-zeile"><span>Leiterlänge L</span>
              <input type="range" id="lskHL" min="0.1" max="3" step="0.1" value="1.5"
                oninput="_lskSetH('hL',this.value)"><b id="lskHLLbl">1,50 m</b></div>
            <div class="osz-zeile"><span>Winkel α (v, B)</span>
              <input type="range" id="lskHalpha" min="0" max="90" step="1" value="90"
                oninput="_lskSetH('halpha',this.value)"><b id="lskHalphaLbl">90°</b></div>
          </div>
          <div class="ebr-rechnung" id="lskHRechnung"></div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" onclick="_lskTake()">✓ Messwert übernehmen</button>
            <button class="sim-btn" onclick="_lskDemo()">📋 Beispielmessreihe</button>
            <button class="sim-btn" onclick="_lskClear()">🗑 Tabelle leeren</button>
          </div>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>Nr.</th><th>v (m/s)</th><th>B (mT)</th><th>L (m)</th><th>α</th><th>U (mV)</th><th></th></tr></thead>
              <tbody id="lskTbody"></tbody>
            </table>
            <div class="fpm-empty" id="lskEmpty">Noch keine Messwerte.<br>Immer nur eine Größe verändern – so prüft man eine Hypothese.</div>
          </div>
        </div>
        <div>
          <div class="fpm-tabs">${presets}</div>
          <canvas id="lskPlot" width="440" height="320" class="phys-chart-cv"></canvas>
          <div class="fpm-fit" id="lskFitBox"></div>
          <div class="fpm-label" style="margin-top:10px">Funktion plotten</div>
          <input type="text" id="lskFn" class="fpm-input" placeholder="z. B. 3*x" spellcheck="false"
            oninput="_lskSetFn(this.value)">
          <div class="fpm-err" id="lskFnErr"></div>
          <div class="sim-btn-row" style="padding:2px 0 4px">
            <button class="sim-btn primary" onclick="_lskTheorieFn()">ƒ Theoriefunktion</button>
            <button class="sim-btn" onclick="_lskClearFn()">Feld leeren</button>
          </div>
          <div class="fpm-theo" id="lskTheo"></div>
          <label class="fpm-check"><input type="checkbox" onchange="_lskSet('reveal',this.checked)">
            Sollwert anzeigen</label>
        </div>
      </div>
    </div>

    <!-- ══ Station 4 ══ -->
    <div id="lskS3" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="lskHelm" width="440" height="290" class="phys-anim-cv"></canvas>
          <div class="fpm-label">15 Leiterschleifen im Helmholtzfeld – Aufbau nach Abbildung 8</div>
          <div class="osz-gruppe">
            <div class="osz-zeile"><span>Spulenstrom I</span>
              <input type="range" id="lskHI" min="0.5" max="3" step="0.01" value="2"
                oninput="_lskSetHI(this.value)"><b id="lskHILbl">2,00 A</b></div>
            <label class="fpm-check"><input type="checkbox" id="lskHall" checked
              onchange="_lskSetHall(this.checked)"> B mit der Hallsonde messen statt berechnen</label>
            <div class="osz-zeile"><span>Zeitversatz</span>
              <input type="range" id="lskVersatz" min="-0.4" max="0.4" step="0.01" value="0"
                oninput="_lskSetVersatz(this.value)"><b id="lskVersatzLbl">0,00 s</b></div>
          </div>
          <div class="lsk-zustand" id="lskSync"></div>
        </div>
        <div>
          <div class="ebr-rechnung" id="lskHelmRechnung"></div>
          <div class="fpm-label" style="margin-top:10px">Die Messwerte der Handreichung (Abbildung 10)</div>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>I (A)</th><th>B gem. (mT)</th><th>B ber. (mT)</th><th>v (m/s)</th><th>U gem. (mV)</th><th>U ber. (mV)</th></tr></thead>
              <tbody id="lskOrigTbody"></tbody>
            </table>
          </div>
          <div class="fpm-note" id="lskOrigNote"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 5 ══ -->
    <div id="lskS4" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="lskRing" width="440" height="300" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Was pendelt am Magneten vorbei?</div>
          <div class="ebr-objs">${koerper}</div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="lskRingBtn" onclick="_lskRingToggle()">▶ Anstoßen</button>
            <button class="sim-btn" id="lskMagnetBtn" onclick="_lskMagnetToggle()">Magnet entfernen</button>
            <button class="sim-btn" onclick="_lskMagnetUm()">🔄 Magnet umdrehen</button>
          </div>
        </div>
        <div>
          <div class="ebr-rechnung" id="lskRingRechnung"></div>
          <div class="lsk-zustand" id="lskRingDeutung"></div>
          <div class="fpm-label" style="margin-top:10px">Die beiden Ursachen der Induktion</div>
          <div class="fsr-quellen">
            <button class="fsr-quelle on" id="lskUr0" onclick="_lskSetUrsache('flaeche')">
              <span class="fsr-quelle-n">veränderliche Fläche</span>
              <span class="fsr-quelle-k">Leiter bewegt sich, B bleibt</span></button>
            <button class="fsr-quelle" id="lskUr1" onclick="_lskSetUrsache('feld')">
              <span class="fsr-quelle-n">veränderliches Feld</span>
              <span class="fsr-quelle-k">Leiter ruht, B ändert sich</span></button>
          </div>
          <div class="lsk-ursache" id="lskUrsache"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 6 ══ -->
    <div id="lskS5" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="lskInhomAufbau" width="440" height="240" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Ruhelage verschieben – der Stab schwingt teils aus dem Feld heraus</div>
          <canvas id="lskInhomOszi" width="440" height="280" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Zeit-Spannungs-Diagramm</div>
        </div>
        <div>
          <div class="osz-gruppe">
            <div class="osz-zeile"><span>Ruhelage</span>
              <input type="range" id="lskRuhelage" min="-0.10" max="0.10" step="0.005" value="0"
                oninput="_lskSetRuhelage(this.value)"><b id="lskRuhelageLbl">0,0 cm</b></div>
            <div class="fpm-note" style="margin-top:4px">Bei 0 cm liegt die Ruhelage in der Mitte
              zwischen den Schenkeln – wie in Abbildung 13. Verschiebt man sie, schwingt der Stab
              zeitweise aus dem Feld heraus, wie in Abbildung 14.</div>
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="lskInhomBtn" onclick="_lskInhomToggle()">▶ Auslenken und loslassen</button>
            <button class="sim-btn" onclick="_lskInhomReset()">↺ Zurücksetzen</button>
          </div>
          <div class="lsk-zustand" id="lskInhomDeutung"></div>
          <div class="ebr-rechnung" id="lskInhomRechnung"></div>
        </div>
      </div>
    </div>

    <div id="lskErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>F<sub>L</sub> = e · v · B</b> &nbsp;|&nbsp; <b>U = W / Q</b>
      &nbsp;|&nbsp; <b>U = L · v · B</b> &nbsp;|&nbsp; <b>F<sub>magn</sub> = L²·B²·v / R</b>
    </p>
  </div>`;
}

function _lskErklHTML() {
  return `<div class="dsp-erkl-kopf">Der Versuch in einem Satz</div>
    <div class="dsp-erkl-text">
      Ein Metallstab hängt an zwei dünnen Drähten und schwingt wie eine Schaukel zwischen den
      Schenkeln eines Hufeisenmagneten. An seinen Enden misst man eine Spannung, die dem
      Augenschein nach sinusförmig verläuft und deren Amplitude über viele Perioden hinweg
      abnimmt. Weil die Spannung nur einige Zehntel Millivolt beträgt, braucht man einen
      Mikrovoltverstärker mit etwa 10 000-facher Vorverstärkung, bevor ein Speicheroszilloskop
      oder ein Messwerterfassungssystem etwas anzeigen kann.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum überhaupt eine Spannung entsteht</div>
    <div class="dsp-erkl-text">
      Der entscheidende Gedanke: Bewegt sich der Stab, dann bewegen sich <b>seine Leitungselektronen
      mit</b>. Auf eine bewegte Ladung im Magnetfeld wirkt die <b>Lorentzkraft</b>
      F<sub>L</sub> = e · v × B. Sie steht senkrecht auf v und auf B, zeigt hier also
      <i>längs des Stabes</i> und schiebt die Elektronen zu einem Ende. Dort sammelt sich negative
      Ladung, am anderen Ende bleibt positive zurück – im Stab entsteht ein <b>elektrisches Feld</b>,
      das die Elektronen zurücktreibt. Die Ladungstrennung wächst so lange, bis sich beide Kräfte
      aufheben: F<sub>el</sub> = F<sub>L</sub>, also e · E = e · v · B, und mit E = U/L folgt
      unmittelbar <b>U = L · v · B</b>. Das ist keine neue Naturkonstante und kein neues Gesetz –
      es folgt allein aus der Lorentzkraft.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Spannung ist Energie je Ladung</div>
    <div class="dsp-erkl-text">
      Dasselbe Ergebnis erhält man über die Energie, und dieser Weg macht deutlich, was eine
      Spannung überhaupt ist. Die Lorentzkraft schiebt eine Ladung Q über die Länge L des Stabes
      und verrichtet dabei die Arbeit W = F<sub>L</sub> · L = Q · v · B · L. Definiert man die
      Spannung als <b>Arbeit je Ladung</b>, U = W/Q, so kürzt sich die Ladung heraus und es bleibt
      wieder U = L · v · B. Die Spannung sagt also, wie viel Energie eine Ladung beim Durchlaufen
      des Leiters gewinnt – unabhängig davon, wie groß diese Ladung ist. Genau deshalb misst man
      Spannungen in Volt = Joule je Coulomb.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Die Drei-Finger-Regel</div>
    <div class="dsp-erkl-text">
      Die Richtungen bekommt man mit der <b>rechten Hand</b>: Der <b>Daumen</b> zeigt in die
      technische Stromrichtung, also <i>entgegen</i> der Bewegungsrichtung der Elektronen, weil
      diese negativ geladen sind. Der <b>Zeigefinger</b> zeigt in Richtung des Magnetfeldes, der
      <b>Mittelfinger</b> dann in Richtung der Kraft. Kehrt man die Bewegungsrichtung um, kehrt
      sich die Polung der Spannung um; kehrt man zusätzlich die Feldrichtung um, ist man wieder
      beim Ausgangszustand. Deshalb wechselt die Induktionsspannung bei jeder Halbschwingung ihr
      Vorzeichen – und deshalb ist das Oszillogramm eine Wechselspannung.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Was die Kurve verrät</div>
    <div class="dsp-erkl-text">
      Die Spannung ist der Geschwindigkeit proportional, nicht der Auslenkung. Deshalb ist sie
      <b>null in den Umkehrpunkten</b>, wo das Pendel steht, und <b>am größten beim Durchgang durch
      die Ruhelage</b>, wo es am schnellsten ist. Das Oszillogramm ist also gegenüber der
      Ortskurve um eine Viertelperiode verschoben. Die Abnahme der Amplituden über viele Perioden
      zeigt die Dämpfung durch Luftwiderstand und Aufhängung; kleine Papierfahnen an den
      Leiterenden verstärken sie deutlich.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Die beiden Ursachen der Induktion</div>
    <div class="dsp-erkl-text">
      Alle Induktionserscheinungen lassen sich auf zwei Ursachen zurückführen: ein <b>zeitlich
      veränderliches Magnetfeld</b> oder eine <b>zeitlich veränderliche wirksame Fläche</b>. Die
      Leiterschaukel ist der Musterfall der zweiten Ursache: Schließt man den Stromkreis, so
      umschließt die Leiterschleife eine Fläche, die sich beim Schwingen ändert. Beide Fälle fasst
      dasselbe Gesetz zusammen, U = −dΦ/dt mit Φ = B · A. Rechnet man es für den bewegten Stab
      aus, so ist Φ = B · L · x und damit U = B · L · dx/dt = <b>B · L · v</b> – exakt dasselbe
      Ergebnis wie aus dem Kraftansatz. Zwei völlig verschiedene Überlegungen, ein Ergebnis.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Der Ringversuch</div>
    <div class="dsp-erkl-text">
      Lässt man statt des Stabes einen geschlossenen Aluminiumring am Magneten vorbeipendeln, wird
      die Schwingung auffällig stark gebremst – und zwar <b>unabhängig davon, wie herum</b> der
      Magnet steht. Der Grund: Im Ring fließt jetzt wirklich ein Strom I = U/R. Damit ist der Ring
      ein <b>stromdurchflossener Leiter im Magnetfeld</b>, auf den die Kraft F = I · L × B wirkt.
      Setzt man I = U/R und U = L·v·B ein, folgt <b>F = L²·B²·v / R</b>. Diese Kraft ist der
      Geschwindigkeit proportional und ihr stets entgegengerichtet – sie wirkt wie eine Reibung.
      Dass B quadratisch eingeht, erklärt die Unabhängigkeit von der Feldrichtung: Beim Umdrehen
      des Magneten wechseln Strom und Kraftrichtung gemeinsam das Vorzeichen. Am Voltmeter, das
      einen sehr hohen Eingangswiderstand hat, fließt dagegen fast kein Strom – dort bleibt die
      Bremswirkung aus.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Wenn das Feld nicht homogen ist</div>
    <div class="dsp-erkl-text">
      Bleibt der Stab immer zwischen den Schenkeln, ist B nahezu konstant und die Kurve nahezu
      sinusförmig. Verschiebt man die Ruhelage so, dass er zeitweise aus dem Feld herausschwingt,
      wird das Oszillogramm sichtbar <b>verzerrt</b>: Dort, wo der Stab im schwachen Streufeld
      läuft, ist die Spannung kleiner, als seine Geschwindigkeit erwarten ließe. Genauer hinsehen
      lohnt sich hier. Verzerrt wird die <b>Form</b> der Halbwellen – sie werden schief, steigen
      steil an und fallen flach ab. Ihr <b>Größtwert bleibt gleich</b>, denn Hin- und Rückweg
      überstreichen dieselben Orte und damit dieselben Feldstärken. Was wandert, ist die
      <b>Lage</b> des Größtwerts: Er liegt nicht mehr in der Ruhelage, sondern dort, wo das
      Produkt aus Geschwindigkeit und Feldstärke am größten wird. Die Handreichung formuliert das
      genau so vorsichtig – sie schreibt, das Maximum werde <i>in der Nähe</i> der Ruhelage
      erreicht. Die Nulldurchgänge dagegen bleiben, wo sie waren: Sie liegen immer in den
      <b>Umkehrpunkten</b>, wo v = 0 ist, ganz gleich wie stark das Feld dort ist.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Wozu die Vorverstärkung</div>
    <div class="dsp-erkl-text">
      Beim Ablesen darf man den Verstärker nicht vergessen. Steht das Oszilloskop auf
      2 V je Kästchen und beträgt die Vorverstärkung 10 000, dann entspricht ein Kästchen am
      <i>Eingang</i> nur 2 V / 10 000 = <b>0,2 mV</b>. Wer das übersieht, liest Spannungen um den
      Faktor 10 000 zu groß ab. Für die Zeitachse gilt das nicht – der Verstärker ändert nur die
      Höhe der Kurve, nicht ihren zeitlichen Verlauf. Periodendauer und Frequenz liest man also
      direkt ab.
    </div>
    <div class="dsp-erkl-warn">⚠ Im echten Versuch: Der Aufbau ist ungefährlich, die Bestimmungen
      der RiSU sind dennoch einzuhalten. Der Metallstab muss <b>nicht ferromagnetisch</b> sein –
      sonst würde er vom Magneten angezogen statt frei zu schwingen.</div>`;
}

// ── Stationen ──────────────────────────────────────────
function _lskSetStation(i) {
  _lsk.station = i;
  for (let k = 0; k < 6; k++) {
    document.getElementById('lskSt' + k)?.classList.toggle('on', k === i);
    const d = document.getElementById('lskS' + k);
    if (d) d.style.display = k === i ? 'block' : 'none';
  }
  _lskUpdate();
  if (i === 2) _lskDrawPlot();
}
function _lskSet(key, val) { _lsk[key] = val; _lskDrawPlot(); }

// ── Station 1 ──────────────────────────────────────────
function _lskToggle() {
  _lsk.laeuft = !_lsk.laeuft;
  if (_lsk.laeuft && _lsk.t === 0) _lsk.spur = [];
  const b = document.getElementById('lskStartBtn');
  if (b) b.textContent = _lsk.laeuft ? '⏸ Anhalten' : '▶ Auslenken und loslassen';
  _lskUpdate();
}
function _lskReset() {
  _lsk.laeuft = false; _lsk.t = 0; _lsk.spur = []; _lsk.geprueft = null;
  const b = document.getElementById('lskStartBtn');
  if (b) b.textContent = '▶ Auslenken und loslassen';
  _lskUpdate();
}
function _lskStepZeit(d) {
  _lsk.zeitI = Math.max(0, Math.min(_LSK_ZEITEN.length - 1, _lsk.zeitI + d));
  _lskUpdate();
}
function _lskSetPl(v) { _lsk.pl = Math.max(0.4, Math.min(1, +v)); _lskReset(); }
function _lskSetStabL(v) { _lsk.stabL = Math.max(0.10, Math.min(0.15, +v)); _lskUpdate(); }
function _lskSetPhi0(v) { _lsk.phi0 = Math.max(0.05, Math.min(0.30, +v)); _lskUpdate(); }
function _lskSetB(v) { _lsk.B = Math.max(0.005, Math.min(0.05, +v)); _lskUpdate(); }
function _lskSetFahnen(v) { _lsk.fahnen = !!v; _lskReset(); }
function _lskSetLese(f, v) { _lsk[f] = v; _lskRenderLese(); }

function _lskLeseAus() {
  const a = parseFloat(String(_lsk.leseA).replace(',', '.'));
  const t = parseFloat(String(_lsk.leseT).replace(',', '.'));
  const r = {};
  if (isFinite(a) && a > 0) {
    r.anzeige = a * _LSK_VDIV;             // Volt am Oszilloskop
    r.U = r.anzeige / _LSK_VORV;           // echte Induktionsspannung
  }
  if (isFinite(t) && t > 0) {
    r.T = t * _lskZeit();
    r.f = 1 / r.T;
  }
  return r;
}
function _lskPruefen() {
  const r = _lskLeseAus();
  const sollU = _lskU(_lskLWirk(), _lskVMax(), _lsk.B);
  const sollT = _lskPeriode(_lsk.pl);
  _lsk.geprueft = {
    gU: r.U !== undefined ? Math.abs(r.U - sollU) / sollU * 100 : null,
    gT: r.T !== undefined ? Math.abs(r.T - sollT) / sollT * 100 : null,
    sollU, sollT
  };
  _lskUpdate();
}

function _lskUpdate() {
  if (!_lsk) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('lskZeitLbl', _fpmNum(_lskZeit(), 1) + ' s');
  set('lskPlLbl', Math.round(_lsk.pl * 100) + ' cm');
  set('lskStabLLbl', _fpmNum(_lsk.stabL * 100, 1) + ' cm');
  set('lskPhi0Lbl', Math.round(_lsk.phi0 * 180 / Math.PI) + '°');
  set('lskBLbl', Math.round(_lsk.B * 1000) + ' mT');
  set('lskVA', _fpmNum(_lskV(_lsk.t), 3));
  set('lskUA', _lskMV(_lskUt(_lsk.t)));
  set('lskTA', _fpmNum(_lskPeriode(_lsk.pl), 3));
  set('lskFA', _fpmNum(1 / _lskPeriode(_lsk.pl), 3));

  const st = document.getElementById('lskOsziStatus');
  if (st) {
    st.innerHTML = `<span class="osz-st-k">Zeit</span><b>${_fpmNum(_lskZeit(), 1)} s/Kästchen</b>
      <span class="osz-st-k">Verstärkung</span><b>${_LSK_VDIV} V/Kästchen</b>
      <span class="osz-st-k">Vorverstärkung</span><b>${_LSK_VORV}</b>
      <span class="osz-st-k">Aufzeichnung</span><b style="color:${_lsk.laeuft ? '#4ade80' : '#94a3b8'}">${
        _fpmNum(_lsk.t, 1)} s</b>`;
  }

  _lskRenderLese();
  _lskRenderK3();
  _lskRenderHerleitung();
  _lskRenderHypo();
  _lskRenderHelm();
  _lskRenderRing();
  _lskRenderInhom();
}

function _lskRenderLese() {
  const el = document.getElementById('lskLeseAus'); if (!el) return;
  const r = _lskLeseAus();
  let html = '';
  if (r.U !== undefined) {
    html += `<div class="pho-rz"><span class="pho-rz-t">am Oszilloskop abgelesen</span>
      <span class="pho-rz-f">n · ${_LSK_VDIV} V/Kästchen</span>
      <span class="pho-rz-v">${_fpmNum(r.anzeige, 2)} V</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">geteilt durch die Vorverstärkung</span>
      <span class="pho-rz-f">U = Anzeige / ${_LSK_VORV}</span>
      <span class="pho-rz-v">${_lskMV(r.U)} mV</span></div>`;
  }
  if (r.T !== undefined) {
    html += `<div class="pho-rz"><span class="pho-rz-t">Periodendauer</span>
      <span class="pho-rz-f">T = n · ${_fpmNum(_lskZeit(), 1)} s/Kästchen</span>
      <span class="pho-rz-v">${_fpmNum(r.T, 3)} s</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Frequenz</span>
      <span class="pho-rz-f">f = 1 / T</span>
      <span class="pho-rz-v">${_fpmNum(r.f, 3)} Hz</span></div>`;
  }
  if (!html) {
    html = `<div class="fpm-note">Zähle am Oszillogramm ab, wie viele Kästchen der größte
      Ausschlag hoch ist und über wie viele Kästchen sich eine volle Periode erstreckt.
      <b>Denk an die Vorverstärkung</b> – sonst liest du die Spannung um den Faktor
      ${_LSK_VORV} zu groß ab.</div>`;
  }
  el.innerHTML = html;

  const pr = document.getElementById('lskLesePruef');
  if (pr) {
    const g = _lsk.geprueft;
    if (!g) { pr.className = 'lsk-zustand'; pr.innerHTML = 'Trage deine Ablesung ein und prüfe sie.'; return; }
    const gut = (g.gU === null || g.gU < 8) && (g.gT === null || g.gT < 8) && (g.gU !== null || g.gT !== null);
    pr.className = 'lsk-zustand ' + (gut ? 'ok' : 'no');
    pr.innerHTML = (gut ? '<b>Gut abgelesen.</b> ' : '<b>Da stimmt etwas nicht.</b> ')
      + 'Der Sollwert ist U<sub>max</sub> = ' + _lskMV(g.sollU) + ' mV bei T = '
      + _fpmNum(g.sollT, 3) + ' s.'
      + (g.gU !== null ? ' Deine Spannung weicht um ' + _fpmNum(g.gU, 1) + ' % ab.' : ' Keine Spannung abgelesen.')
      + (g.gT !== null ? ' Deine Periodendauer um ' + _fpmNum(g.gT, 1) + ' %.' : ' Keine Zeit abgelesen.')
      + (gut ? '' : ' Prüfe, ob du durch die Vorverstärkung geteilt hast.');
  }
}

// Kompetenz K3: den Versuch adressatenbezogen erlaeutern
function _lskRenderK3() {
  const el = document.getElementById('lskK3'); if (!el) return;
  const U = _lskU(_lskLWirk(), _lskVMax(), _lsk.B);
  el.innerHTML = `
    <div class="git-sch-kopf">So erklärst du diesen Versuch jemandem anderen</div>
    <div class="lsk-k3-grid">
      <div class="lsk-k3-teil"><span>Zielsetzung</span>
        Wir wollen zeigen, dass allein die <b>Bewegung</b> eines Leiters im Magnetfeld eine
        Spannung erzeugt – ohne Batterie, ohne Stromquelle. Und wir wollen herausfinden, wovon
        diese Spannung abhängt.</div>
      <div class="lsk-k3-teil"><span>Aufbau</span>
        Ein Metallstab von ${_fpmNum(_lsk.stabL * 100, 1)} cm Länge hängt an zwei dünnen,
        sehr flexiblen Kabeln von ${Math.round(_lsk.pl * 100)} cm Länge und schwingt zwischen den
        Schenkeln eines Hufeisenmagneten. Seine Enden führen über einen Mikrovoltverstärker
        (Vorverstärkung ${_LSK_VORV}) an ein Speicheroszilloskop.</div>
      <div class="lsk-k3-teil"><span>Durchführung</span>
        Der Stab wird von Hand ausgelenkt und losgelassen. Das Oszilloskop zeichnet die Spannung
        über der Zeit auf.</div>
      <div class="lsk-k3-teil"><span>Ergebnis</span>
        Es entsteht eine <b>Wechselspannung</b> von hier höchstens ${_lskMV(U)} mV mit der
        Periodendauer ${_fpmNum(_lskPeriode(_lsk.pl), 2)} s. Sie ist null, wenn das Pendel in den
        Umkehrpunkten steht, und am größten beim Durchgang durch die Ruhelage – sie folgt also der
        <b>Geschwindigkeit</b>, nicht der Auslenkung. Über viele Perioden nimmt ihre Amplitude ab,
        weil die Schwingung gedämpft ist.</div>
      <div class="lsk-k3-teil"><span>Deutung</span>
        Mit dem Stab bewegen sich seine Leitungselektronen. Auf sie wirkt die Lorentzkraft und
        schiebt sie zu einem Ende – zwischen den Enden entsteht dadurch die Spannung
        <b>U = L · v · B</b>.</div>
    </div>`;
}

// ── Station 2: Herleitung ──────────────────────────────
function _lskUmkehr(feld) { _lsk[feld] = -_lsk[feld]; _lskRenderHerleitung(); }
function _lskSchritt(d) {
  _lsk.schritt = d === 99 ? 5 : Math.max(0, Math.min(5, _lsk.schritt + d));
  _lskRenderHerleitung();
}
const _LSK_SCHRITTE = [
  { k: 'Ausgangslage',
    t: 'Der Stab bewegt sich mit der Geschwindigkeit v durch das Magnetfeld B. Beide stehen senkrecht aufeinander, und die Stabachse steht senkrecht auf beiden. Wichtig: Mit dem Stab bewegen sich auch <b>seine Leitungselektronen</b>.',
    f: '' },
  { k: 'Die Lorentzkraft wirkt',
    t: 'Auf jedes mitbewegte Elektron wirkt die Lorentzkraft. Sie steht senkrecht auf v und auf B – zeigt also <b>längs des Stabes</b>. Mit v ⊥ B ist sin 90° = 1, der Betrag also einfach e·v·B.',
    f: 'F<sub>L</sub> = e · v × B = e · v · B · sin 90° = e · v · B' },
  { k: 'Ladungen werden getrennt',
    t: 'Die Elektronen werden zu einem Ende des Stabes verschoben. Dort herrscht Elektronenüberschuss, am anderen Ende Elektronenmangel. Zwischen den Enden entsteht dadurch ein <b>elektrisches Feld</b> im Stab.',
    f: '' },
  { k: 'Das Gegenfeld bremst',
    t: 'Dieses elektrische Feld übt selbst eine Kraft auf die Elektronen aus – und zwar <b>entgegen</b> der Lorentzkraft. Je mehr Ladung getrennt ist, desto stärker wirkt es zurück.',
    f: 'F<sub>el</sub> = e · E' },
  { k: 'Gleichgewicht',
    t: 'Die Ladungstrennung wächst so lange, bis sich beide Kräfte genau aufheben. Ab da fließt keine Ladung mehr, der Zustand ist stationär.',
    f: 'F<sub>el</sub> = F<sub>L</sub>  ⇒  e · E = e · v · B  ⇒  E = v · B' },
  { k: 'Das Ergebnis',
    t: 'Für ein homogenes Feld im Stab gilt E = U/L. Einsetzen liefert unmittelbar die gesuchte Beziehung. Sie enthält nur Messbares: Leiterlänge, Geschwindigkeit und Feldstärke.',
    f: 'E = U / L  ⇒  <b>U = L · v · B</b>' }
];
function _lskRenderHerleitung() {
  const el = document.getElementById('lskSchritte');
  if (el) {
    el.innerHTML = _LSK_SCHRITTE.map((s, i) => {
      const aktiv = i <= _lsk.schritt;
      return `<div class="lsk-schritt${aktiv ? ' an' : ''}${i === _lsk.schritt ? ' jetzt' : ''}">
        <span class="lsk-schritt-n">${i + 1}</span>
        <div><div class="lsk-schritt-k">${s.k}</div>
        ${aktiv ? '<div class="lsk-schritt-t">' + s.t + '</div>' : ''}
        ${aktiv && s.f ? '<div class="lsk-schritt-f">' + s.f + '</div>' : ''}</div></div>`;
    }).join('');
  }

  // Kompetenz UF2: Spannung als Energie je Ladung
  const en = document.getElementById('lskEnergie');
  if (en) {
    const L = 0.12, v = 0.5, B = 0.02;
    const F = _LSK_E * v * B, W = _lskArbeit(L, v, B), U = _lskUAusArbeit(L, v, B);
    en.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">Kraft auf ein Elektron</span>
        <span class="pho-rz-f">F<sub>L</sub> = e · v · B</span>
        <span class="pho-rz-v">${_ebrExp(F, 3)} N</span></div>
      <div class="pho-rz"><span class="pho-rz-t">Arbeit längs des Stabes</span>
        <span class="pho-rz-f">W = F<sub>L</sub> · L</span>
        <span class="pho-rz-v">${_ebrExp(W, 3)} J</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Spannung ist Arbeit je Ladung</span>
        <span class="pho-rz-f">U = W / Q</span>
        <span class="pho-rz-v">${_lskMV(U)} mV</span></div>
      <div class="fpm-note">Beispiel mit L = 12 cm, v = 0,5 m/s und B = 20 mT. Die Ladung kürzt
        sich heraus: W/Q = (Q·v·B·L)/Q = L·v·B. Deshalb ist die Spannung <b>unabhängig davon,
        wie groß die bewegte Ladung ist</b> – sie sagt nur, wie viel Energie <i>je</i> Coulomb
        umgesetzt wird. 1 Volt ist genau 1 Joule je Coulomb. Beide Wege, der Kraftansatz und der
        Energieansatz, führen auf dasselbe Ergebnis.</div>`;
  }

  const dr = document.getElementById('lskDrei');
  if (dr) {
    const v = _lsk.vRichtung > 0, b = _lsk.bRichtung > 0;
    // Elektronen werden bei v>0, B>0 nach der einen Seite geschoben; jede
    // Umkehr dreht die Polung, zwei Umkehrungen heben sich auf.
    const oben = (_lsk.vRichtung * _lsk.bRichtung) > 0;
    dr.innerHTML = `<div class="git-sch-kopf">Drei-Finger-Regel – welches Ende wird negativ?</div>
      <div class="lsk-drei-text">
        Nimm die <b>rechte Hand</b>. Der <b>Daumen</b> zeigt in die technische Stromrichtung, also
        <i>entgegen</i> der Bewegungsrichtung der Elektronen, denn sie sind negativ geladen. Der
        <b>Zeigefinger</b> zeigt in Richtung des Magnetfeldes, der <b>Mittelfinger</b> dann in
        Richtung der Lorentzkraft auf die Ladungsträger.
      </div>
      <div class="lsk-drei-jetzt">
        Der Stab bewegt sich gerade nach <b>${v ? 'rechts' : 'links'}</b>, das Feld zeigt
        <b>${b ? 'in die Zeichenebene hinein' : 'aus der Zeichenebene heraus'}</b>.
        Die Lorentzkraft schiebt die Elektronen damit nach <b>${oben ? 'oben' : 'unten'}</b> –
        das <b>${oben ? 'obere' : 'untere'}</b> Ende wird negativ, das
        ${oben ? 'untere' : 'obere'} positiv.
        Kehrt man <i>eine</i> der beiden Richtungen um, dreht sich die Polung. Kehrt man
        <i>beide</i> um, bleibt sie gleich – das ist die Probe auf die Regel.
      </div>`;
  }
}

// ── Station 3: Hypothesen ──────────────────────────────
function _lskSetH(feld, v) {
  const gr = { hv: [0.05, 0.8], hB: [0.0002, 0.004], hL: [0.1, 3], halpha: [0, 90] };
  _lsk[feld] = Math.max(gr[feld][0], Math.min(gr[feld][1], +v));
  _lskRenderHypo();
}
function _lskHU() { return _lskU(_lsk.hL, _lsk.hv, _lsk.hB, _lsk.halpha); }
function _lskTake() {
  _lsk.rows.push({ id: _lsk.nextId++, v: _lsk.hv, B: _lsk.hB, L: _lsk.hL,
                   alpha: _lsk.halpha, U: _lskHU() });
  _lskRenderTable(); _lskDrawPlot();
}
function _lskDelRow(id) { _lsk.rows = _lsk.rows.filter(r => r.id !== id); _lskRenderTable(); _lskDrawPlot(); }
function _lskClear() {
  if (_lsk.rows.length && !confirm('Alle ' + _lsk.rows.length + ' Messwerte löschen?')) return;
  _lsk.rows = []; _lskRenderTable(); _lskDrawPlot();
}
// Eine Messreihe, wie sie eine Lerngruppe arbeitsteilig aufnimmt: immer nur
// eine Groesse veraendern, die uebrigen festhalten.
function _lskDemo() {
  const nimm = (v, B, L, a) => _lsk.rows.push({ id: _lsk.nextId++, v, B, L, alpha: a, U: _lskU(L, v, B, a) });
  [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].forEach(v => nimm(v, 0.002, 1.5, 90));
  [0.0005, 0.001, 0.0015, 0.002, 0.003, 0.0035].forEach(B => nimm(0.4, B, 1.5, 90));
  [0.3, 0.6, 0.9, 1.5, 2.1, 2.7].forEach(L => nimm(0.4, 0.002, L, 90));
  [0, 15, 30, 45, 60, 75, 90].forEach(a => nimm(0.4, 0.002, 1.5, a));
  _lskRenderTable(); _lskDrawPlot();
}
function _lskRenderTable() {
  const tb = document.getElementById('lskTbody'); if (!tb) return;
  const leer = document.getElementById('lskEmpty');
  if (leer) leer.style.display = _lsk.rows.length ? 'none' : 'block';
  tb.innerHTML = _lsk.rows.map((r, i) =>
    `<tr><td>${i + 1}</td><td>${_fpmNum(r.v, 2)}</td><td>${_fpmNum(r.B * 1000, 2)}</td>
       <td>${_fpmNum(r.L, 2)}</td><td>${Math.round(r.alpha)}°</td>
       <td><b>${_lskMV(r.U)}</b></td>
       <td class="fpm-del" onclick="_lskDelRow(${r.id})" title="löschen">✕</td></tr>`).join('');
}
// Die sechs Hypothesen der Handreichung, Seite 5
function _lskRenderHypo() {
  const el = document.getElementById('lskHypo'); if (!el) return;
  const U = _lskHU();
  const bewegt = _lsk.hv > 0.001;
  const H = [
    { t: 'Eine Induktionsspannung tritt nur auf, wenn sich der Leiter bewegt und v <b>nicht parallel</b> zu B verläuft.',
      ok: bewegt && _lsk.halpha > 0,
      jetzt: !bewegt ? 'v ist null – keine Spannung' : _lsk.halpha === 0 ? 'α = 0°, v ∥ B – keine Spannung' : 'erfüllt' },
    { t: 'Die Induktionsspannung nimmt mit dem <b>Betrag der Geschwindigkeit</b> zu.', ok: true,
      jetzt: 'U ∝ v, geprüft im Diagramm v → U' },
    { t: 'Sie ist bei gleicher Geschwindigkeit <b>größer, wenn das Magnetfeld stärker</b> ist.', ok: true,
      jetzt: 'U ∝ B, geprüft im Diagramm B → U' },
    { t: 'Sie wächst mit dem <b>Winkel zwischen v und B</b> von 0° bis 90°.', ok: true,
      jetzt: 'U ∝ sin α, bei α = ' + Math.round(_lsk.halpha) + '° ist sin α = ' + _fpmNum(Math.sin(_lsk.halpha * Math.PI / 180), 3) },
    { t: 'Die <b>Polung</b> lässt sich mit einer Drei-Finger-Regel vorhersagen.', ok: true,
      jetzt: 'siehe Station 2' },
    { t: 'Sie wächst mit der <b>Länge des bewegten Leiters</b>.', ok: true,
      jetzt: 'U ∝ L, geprüft im Diagramm L → U' }
  ];
  el.innerHTML = `<div class="git-sch-kopf">Die sechs Hypothesen aus den Freihandversuchen</div>
    <div class="lsk-hypo-liste">${H.map((h, i) =>
      `<div class="lsk-hypo-z"><span class="lsk-hypo-n">${i + 1}</span>
         <div><div class="lsk-hypo-t">${h.t}</div>
         <div class="lsk-hypo-j">${h.jetzt}</div></div></div>`).join('')}</div>
    <div class="fpm-note">Alle sechs stecken in der einen Beziehung
      <b>U = L · v · B · sin α</b>. Prüfe sie, indem du <b>immer nur eine Größe veränderst</b> und
      die anderen festhältst – anders lässt sich kein Zusammenhang belegen.</div>`;

  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('lskHvLbl', _fpmNum(_lsk.hv, 2) + ' m/s');
  set('lskHBLbl', _fpmNum(_lsk.hB * 1000, 2) + ' mT');
  set('lskHLLbl', _fpmNum(_lsk.hL, 2) + ' m');
  set('lskHalphaLbl', Math.round(_lsk.halpha) + '°');

  const r = document.getElementById('lskHRechnung');
  if (r) {
    r.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">wirksame Geschwindigkeit quer zum Feld</span>
        <span class="pho-rz-f">v<sub>⊥</sub> = v · sin α</span>
        <span class="pho-rz-v">${_fpmNum(_lsk.hv * Math.sin(_lsk.halpha * Math.PI / 180), 3)} m/s</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Induktionsspannung</span>
        <span class="pho-rz-f">U = L · v · B · sin α</span>
        <span class="pho-rz-v">${_lskMV(U)} mV</span></div>
      ${_lsk.halpha === 0 ? '<div class="fpm-note">Bei α = 0° bewegt sich der Leiter <b>längs</b> der Feldlinien. Die Lorentzkraft verschwindet, es wird keine Spannung induziert – genau die erste Hypothese.</div>' : ''}`;
  }
}

const _LSK_PRESETS = [
  { xl: 'Geschwindigkeit v in m/s', yl: 'Induktionsspannung U in mV',
    x: r => r.v, y: r => r.U * 1000,
    fest: r => Math.abs(r.B - _lsk.hB) < 1e-9 && Math.abs(r.L - _lsk.hL) < 1e-9 && r.alpha === _lsk.halpha,
    k: () => _lsk.hL * _lsk.hB * Math.sin(_lsk.halpha * Math.PI / 180) * 1000,
    ktxt: 'L · B · sin α',
    note: 'Nur Messwerte mit denselben Werten für B, L und α gehören auf diese Gerade – sonst vergleicht man Verschiedenes.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)',
    form: 'U = (L · B · sin α) · v',
    deutung: 'Die zweite Hypothese: Die Induktionsspannung nimmt mit der Geschwindigkeit zu – und zwar proportional. Das ist der Kern des Bestätigungsversuchs der Handreichung, bei dem Geschwindigkeit und Spannung gleichzeitig aufgezeichnet und einander zugeordnet werden.' },

  { xl: 'Magnetfeld B in mT', yl: 'Induktionsspannung U in mV',
    x: r => r.B * 1000, y: r => r.U * 1000,
    fest: r => Math.abs(r.v - _lsk.hv) < 1e-9 && Math.abs(r.L - _lsk.hL) < 1e-9 && r.alpha === _lsk.halpha,
    k: () => _lsk.hL * _lsk.hv * Math.sin(_lsk.halpha * Math.PI / 180),
    ktxt: 'L · v · sin α',
    note: 'Nur Messwerte mit derselben Geschwindigkeit, Länge und demselben Winkel gehören auf diese Gerade.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)',
    form: 'U = (L · v · sin α) · B',
    deutung: 'Die dritte Hypothese: Bei gleicher Geschwindigkeit ist die Spannung größer, wenn das Feld stärker ist. Im Bestätigungsversuch verändert man dazu den Strom durch die Helmholtzspulen und misst B mit einer Hallsonde mit.' },

  { xl: 'Leiterlänge L in m', yl: 'Induktionsspannung U in mV',
    x: r => r.L, y: r => r.U * 1000,
    fest: r => Math.abs(r.v - _lsk.hv) < 1e-9 && Math.abs(r.B - _lsk.hB) < 1e-9 && r.alpha === _lsk.halpha,
    k: () => _lsk.hv * _lsk.hB * Math.sin(_lsk.halpha * Math.PI / 180) * 1000,
    ktxt: 'v · B · sin α',
    note: 'Nur Messwerte mit derselben Geschwindigkeit, demselben Feld und Winkel gehören auf diese Gerade.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)',
    form: 'U = (v · B · sin α) · L',
    deutung: 'Die sechste Hypothese: Die Spannung wächst mit der Länge des bewegten Leiters. Genau deshalb verwendet die Handreichung im Bestätigungsversuch nicht einen einzelnen Stab, sondern 15 Leiterschleifen von je 10 cm – so wird aus 0,1 m wirksamer Länge 1,5 m, und die Spannung ist trotz des schwachen Helmholtzfeldes noch gut messbar.' },

  { xl: 'sin α', yl: 'Induktionsspannung U in mV',
    x: r => Math.sin(r.alpha * Math.PI / 180), y: r => r.U * 1000,
    fest: r => Math.abs(r.v - _lsk.hv) < 1e-9 && Math.abs(r.B - _lsk.hB) < 1e-9 && Math.abs(r.L - _lsk.hL) < 1e-9,
    k: () => _lsk.hL * _lsk.hv * _lsk.hB * 1000,
    ktxt: 'L · v · B',
    note: 'Nicht der Winkel selbst, sondern sein Sinus ist die richtige Auftragung – nur so wird eine Gerade daraus.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)',
    form: 'U = (L · v · B) · sin α',
    deutung: 'Die vierte Hypothese sagt nur, dass die Spannung von 0° bis 90° wächst. Wie genau, verrät erst diese Auftragung: proportional zu sin α, nicht zum Winkel. Trägt man U über α selbst auf, bekommt man eine gekrümmte Kurve – ein gutes Beispiel dafür, dass die Wahl der Achsen über die Aussagekraft entscheidet.' }
];

function _lskSetPreset(i) {
  _lsk.preset = i;
  for (let k = 0; k < 4; k++) document.getElementById('lskTab' + k)?.classList.toggle('on', k === i);
  if (_lsk.fnAuto) _lskTheorieFn(); else _lskRenderTheorie(false);
  _lskDrawPlot();
}
function _lskTheorieFn() {
  const term = _dspZahl(_LSK_PRESETS[_lsk.preset].k()) + '*x';
  const inp = document.getElementById('lskFn');
  if (inp) inp.value = term;
  _lskSetFn(term);
  _lsk.fnAuto = true;
  _lskRenderTheorie(true);
}
function _lskClearFn() {
  const inp = document.getElementById('lskFn');
  if (inp) inp.value = '';
  _lskSetFn(''); _lskRenderTheorie(false);
}
function _lskRenderTheorie(eingesetzt) {
  const el = document.getElementById('lskTheo'); if (!el) return;
  const P = _LSK_PRESETS[_lsk.preset];
  el.innerHTML =
    `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
     <div class="fpm-theo-typ">${P.typ}</div>
     <div class="fpm-theo-form">${P.form}</div>
     <div class="fpm-theo-par">gesucht: die Steigung ${P.ktxt}</div>
     ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${_dspZahl(P.k())}*x</div>` : ''}
     <div class="fpm-theo-deutung">${P.deutung}</div>`;
}
function _lskSetFn(str) {
  _lsk.fnAuto = false;
  const err = document.getElementById('lskFnErr');
  const v = (str || '').trim();
  if (!v) { _lsk.fn = null; if (err) err.textContent = ''; _lskDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _lsk.fn = f; if (err) err.textContent = '';
  } catch (e) { _lsk.fn = null; if (err) err.textContent = e.message; }
  _lskDrawPlot();
}

function _lskDrawPlot() {
  const cv = document.getElementById('lskPlot');
  if (!cv || !_lsk) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _LSK_PRESETS[_lsk.preset];
  const padL = 58, padR = 14, padT = 14, padB = 40;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  // Nur die Messwerte, bei denen die uebrigen Groessen festgehalten wurden
  const alle = _lsk.rows.map(r => ({ x: P.x(r), y: P.y(r), passt: P.fest(r) }))
    .filter(p => isFinite(p.x) && isFinite(p.y));
  const pts = alle.filter(p => p.passt);
  const xmax = Math.max(1e-9, alle.length ? Math.max(...alle.map(p => p.x)) * 1.12 : 1);
  const ymax = Math.max(1e-9, alle.length ? Math.max(...alle.map(p => p.y)) * 1.15 : 1);
  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - v / ymax * (y0 - y1);

  const xt = _fpmTicks(xmax, 6);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 14);
  });
  const yt = _fpmTicks(ymax, 5);
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 6, Y(v) + 3);
  });
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 29);
  ctx.save(); ctx.translate(14, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'right'; ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (!alle.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('lskFitBox');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    return;
  }

  if (_lsk.fn) {
    ctx.strokeStyle = '#db2777'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let begonnen = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _lsk.fn((px - x0) / (x1 - x0) * xmax); } catch (e) { yv = NaN; }
      if (!isFinite(yv)) { begonnen = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { begonnen = false; continue; }
      begonnen ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), begonnen = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  let fit = null;
  if (pts.length >= 2) {
    fit = _fpmFitOrigin(pts);
    if (fit) {
      ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 1.7;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(xmax), Y(fit.k * xmax)); ctx.stroke();
    }
  }
  // Nicht passende Messwerte blass – sie gehoeren zu anderen Einstellungen
  alle.forEach(p => {
    ctx.fillStyle = p.passt ? '#0369a1' : '#e2e8f0';
    ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), p.passt ? 4 : 3, 0, 2 * Math.PI); ctx.fill();
    if (p.passt) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke(); }
  });

  const fo = document.getElementById('lskFitBox');
  if (fo) {
    const soll = P.k();
    if (!fit) {
      fo.innerHTML = '<div class="fpm-note">Mindestens zwei Messwerte nötig, bei denen die '
        + 'übrigen Größen <b>gleich</b> sind.<br>' + P.note + '</div>';
    } else {
      const abw = Math.abs(fit.k - soll) / Math.abs(soll) * 100;
      const cls = abw < 1 ? 'ok' : abw < 5 ? 'mid' : 'no';
      fo.innerHTML = `<div class="fpm-fitline">
          <span class="fpm-fitmeta">${pts.length} passende Messwerte${
            alle.length > pts.length ? ', ' + (alle.length - pts.length) + ' andere blass dargestellt' : ''}</span>
          <span class="fpm-fiteq">y = ${_fpmNum(fit.k, 5)}·x</span>
          <span class="fpm-fitmeta">R² = ${_fpmNum(fit.r2, 5)}</span>
          <span class="fpm-fiteq" style="color:#075985">Steigung = ${P.ktxt} = ${_fpmNum(soll, 5)}</span>
          ${_lsk.reveal ? `<span class="fpm-badge ${cls}">Abweichung ${_fpmNum(abw, 2)} %</span>` : ''}
        </div><div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">${P.note}</div>`;
    }
  }
}

// ── Station 4: Bestätigungsversuch ─────────────────────
function _lskSetHI(v) { _lsk.hI = Math.max(0.5, Math.min(3, +v)); _lskRenderHelm(); }
function _lskSetHall(v) { _lsk.hallAn = !!v; _lskRenderHelm(); }
function _lskSetVersatz(v) { _lsk.versatz = Math.max(-0.4, Math.min(0.4, +v)); _lskRenderHelm(); }
function _lskRenderHelm() {
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('lskHILbl', _fpmNum(_lsk.hI, 2) + ' A');
  set('lskVersatzLbl', _fpmNum(_lsk.versatz, 2) + ' s');

  const el = document.getElementById('lskHelmRechnung');
  if (el) {
    const B = _lskBMess(), L = _lskLEff();
    const v = 0.40;
    const U = _lskU(L, v, B);
    el.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">Feld der Helmholtzspulen, n = ${_LSK_HN}, R = ${_fpmNum(_LSK_HR * 100, 0)} cm</span>
        <span class="pho-rz-f">B = 0,7155 · µ₀ · n · I / R</span>
        <span class="pho-rz-v">${_fpmNum(_lskBHelm(_lsk.hI) * 1000, 3)} mT</span></div>
      <div class="pho-rz"><span class="pho-rz-t">${_lsk.hallAn ? 'mit der Hallsonde gemessen' : 'Hallsonde ausgeschaltet'}</span>
        <span class="pho-rz-f">Anzeige auf 0,1 mT</span>
        <span class="pho-rz-v">${_lsk.hallAn ? _fpmNum(_lskBHall(_lsk.hI) * 1000, 3) + ' mT' : '—'}</span></div>
      <div class="pho-rz"><span class="pho-rz-t">wirksame Leiterlänge, ${_LSK_SCHLEIFEN} Schleifen à ${_fpmNum(_LSK_SCHLEIFE_L * 100, 0)} cm</span>
        <span class="pho-rz-f">L = ${_LSK_SCHLEIFEN} · ${_fpmNum(_LSK_SCHLEIFE_L, 2)} m</span>
        <span class="pho-rz-v">${_fpmNum(L, 2)} m</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">erwartete Spannung bei v = ${_fpmNum(v, 2)} m/s</span>
        <span class="pho-rz-f">U = L · v · B</span>
        <span class="pho-rz-v">${_lskMV(U)} mV</span></div>
      <div class="fpm-note">Ein einzelner Stab von 10 cm Länge käme im Helmholtzfeld nur auf
        ${_lskMV(_lskU(_LSK_SCHLEIFE_L, v, B))} mV – zu wenig für die schulüblichen Messverstärker.
        Deshalb verwendet die Handreichung eine flache Spule mit ${_LSK_SCHLEIFEN} Schleifen:
        Nach der sechsten Hypothese wächst U mit der Leiterlänge, also wird die Spannung
        ${_LSK_SCHLEIFEN}-mal so groß.</div>`;
  }

  const tb = document.getElementById('lskOrigTbody');
  if (tb) {
    tb.innerHTML = _LSK_ORIGINAL.map(o => {
      const eigen = _lskU(_lskLEff(), o.v, o.Bg * 1e-3) * 1000;
      const Bber = _lskBHelm(o.I) * 1000;
      return `<tr><td>${_fpmNum(o.I, 2)}</td><td>${_fpmNum(o.Bg, 3)}</td>
        <td>${_fpmNum(Bber, 2)}</td><td>${_fpmNum(o.v, 2)}</td>
        <td>${_fpmNum(o.Ug, 2)}</td><td><b>${_fpmNum(eigen, 2)}</b></td></tr>`;
    }).join('');
  }
  const nt = document.getElementById('lskOrigNote');
  if (nt) {
    let maxAbw = 0;
    _LSK_ORIGINAL.forEach(o => {
      const eigen = _lskU(_lskLEff(), o.v, o.Bg * 1e-3) * 1000;
      maxAbw = Math.max(maxAbw, Math.abs(eigen - o.Ub));
    });
    nt.innerHTML = `Die Spalte <b>U ber.</b> ist hier nicht abgeschrieben, sondern aus
      U = L · v · B mit L = ${_fpmNum(_lskLEff(), 2)} m und dem <i>gemessenen</i> B neu gerechnet.
      Sie trifft die Werte der Handreichung auf ${_fpmNum(maxAbw, 3)} mV genau. Auch die Spalte
      <b>B ber.</b> stammt aus der Helmholtzformel – daraus lässt sich zurückrechnen, dass es
      dieselben Spulen sind wie beim Fadenstrahlrohr: ${_LSK_HN} Windungen bei
      ${_fpmNum(_LSK_HR * 100, 0)} cm Radius. Gemessene und berechnete Spannungen weichen um
      wenige Prozent voneinander ab – für einen Schulversuch mit Spannungen unter einem Millivolt
      ist das eine sehr gute Übereinstimmung.`;
  }

  const sy = document.getElementById('lskSync');
  if (sy) {
    const v = Math.abs(_lsk.versatz);
    if (v < 0.02) {
      sy.className = 'lsk-zustand ok';
      sy.innerHTML = '<b>Beide Kurven sind synchron.</b> Jeder Geschwindigkeit lässt sich die '
        + 'zugehörige Spannung eindeutig zuordnen – so entsteht das v-U-Diagramm.';
    } else {
      sy.className = 'lsk-zustand no';
      sy.innerHTML = '<b>Die Kurven sind um ' + _fpmNum(_lsk.versatz, 2) + ' s gegeneinander '
        + 'verschoben.</b> Das ist kein Rechenfehler, sondern ein Geräteproblem: Preisgünstige '
        + 'Messwerterfassungssysteme haben oft nur <b>einen einzigen Analog-Digital-Wandler</b> '
        + 'für mehrere Kanäle und müssen die Signale nacheinander verarbeiten. Der '
        + 'Ultraschall-Bewegungsmesswandler hängt zudem an einer digitalen Schnittstelle mit '
        + 'eigener Wandlungszeit. Man darf die Kurven dann softwareseitig gegeneinander '
        + 'verschieben – muss das aber offenlegen und begründen.';
    }
  }
}

// ── Station 5: Ringversuch ─────────────────────────────
function _lskSetKoerper(k) {
  _lsk.objekt = k;
  Object.keys(_LSK_KOERPER).forEach(j =>
    document.getElementById('lskK_' + j)?.classList.toggle('on', j === k));
  _lsk.rt = 0; _lskRenderRing();
}
function _lskRingToggle() {
  _lsk.rlaeuft = !_lsk.rlaeuft;
  if (_lsk.rlaeuft && _lsk.rt === 0) _lsk.rt = 0;
  const b = document.getElementById('lskRingBtn');
  if (b) b.textContent = _lsk.rlaeuft ? '⏸ Anhalten' : '▶ Anstoßen';
  _lskRenderRing();
}
function _lskMagnetToggle() {
  _lsk.magnetAn = !_lsk.magnetAn;
  const b = document.getElementById('lskMagnetBtn');
  if (b) b.textContent = _lsk.magnetAn ? 'Magnet entfernen' : 'Magnet aufstellen';
  _lsk.rt = 0; _lskRenderRing();
}
function _lskMagnetUm() { _lsk.magnetUm = !_lsk.magnetUm; _lsk.rt = 0; _lskRenderRing(); }
function _lskSetUrsache(u) {
  _lsk.ursache = u;
  document.getElementById('lskUr0')?.classList.toggle('on', u === 'flaeche');
  document.getElementById('lskUr1')?.classList.toggle('on', u === 'feld');
  _lskRenderRing();
}
function _lskRenderRing() {
  const k = _lskKoerper();
  const el = document.getElementById('lskRingRechnung');
  if (el) {
    const B = _lsk.magnetAn ? _LSK_RING_B : 0;
    const v = 0.5;
    const U = _lskU(k.L, v, B), I = U / k.R, F = _lskBremsKraft(B, v);
    const d = _lskDeltaEM(B);
    el.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">induzierte Spannung bei v = ${_fpmNum(v, 1)} m/s</span>
        <span class="pho-rz-f">U = L · v · B</span>
        <span class="pho-rz-v">${_lskMV(U)} mV</span></div>
      <div class="pho-rz"><span class="pho-rz-t">Strom im Leiter</span>
        <span class="pho-rz-f">I = U / R</span>
        <span class="pho-rz-v">${I < 0.001 ? _ebrExp(I, 2) + ' A' : _fpmNum(I, 3) + ' A'}</span></div>
      <div class="pho-rz"><span class="pho-rz-t">Kraft auf den stromdurchflossenen Leiter</span>
        <span class="pho-rz-f">F = I · L · B = L²·B²·v / R</span>
        <span class="pho-rz-v">${F < 0.001 ? _ebrExp(F, 2) + ' N' : _fpmNum(F, 4) + ' N'}</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">daraus die Abklingkonstante</span>
        <span class="pho-rz-f">δ = L²·B² / (2·m·R)</span>
        <span class="pho-rz-v">${_fpmNum(d, 3)} 1/s</span></div>
      <div class="fpm-note">${k.txt}</div>`;
  }

  const dt = document.getElementById('lskRingDeutung');
  if (dt) {
    const d = _lskDeltaEM(_LSK_RING_B);
    if (!_lsk.magnetAn) {
      dt.className = 'lsk-zustand';
      dt.innerHTML = '<b>Ohne Magnet</b> schwingt der Körper lange nach – gebremst nur durch '
        + 'Luftwiderstand und Aufhängung.';
    } else if (d > 0.3) {
      dt.className = 'lsk-zustand ok';
      dt.innerHTML = '<b>Sehr deutliche Dämpfung.</b> Der induzierte Strom ist groß, also auch '
        + 'die bremsende Kraft. Die Amplitude sinkt in einer Sekunde auf '
        + Math.round(Math.exp(-d) * 100) + ' %. '
        + 'Und das <b>unabhängig davon, wie herum der Magnet steht</b>: In F = L²·B²·v/R geht B '
        + 'quadratisch ein. Dreht man den Magneten um, wechseln Strom <i>und</i> Kraftrichtung '
        + 'gemeinsam das Vorzeichen – die Bremswirkung bleibt dieselbe. Sie ist immer der '
        + 'Bewegung entgegengerichtet, wirkt also wie eine Reibung.';
    } else if (d > 0.01) {
      dt.className = 'lsk-zustand mid';
      dt.innerHTML = '<b>Spürbare, aber schwächere Dämpfung.</b> Auch hier fließt ein Strom und '
        + 'wirkt eine bremsende Kraft – die Abklingkonstante steigt von 0,05 auf '
        + _fpmNum(0.05 + d, 3) + ' 1/s, die Schwingung klingt also rund '
        + _fpmNum((0.05 + d) / 0.05, 1) + '-mal so schnell ab wie ohne Magnet. Gegenüber dem '
        + 'Aluminiumring bleibt der Effekt aber klein: Dessen Widerstand ist rund achtzigmal '
        + 'kleiner, und in δ = L²·B²/(2·m·R) steht R im Nenner. Dass der Ring dafür schwerer ist, '
        + 'gleicht das nur teilweise aus – unterm Strich wird er etwa dreizehnmal stärker gebremst.';
    } else {
      dt.className = 'lsk-zustand no';
      dt.innerHTML = '<b>Praktisch keine zusätzliche Dämpfung.</b> Das Spannungsmessgerät hat '
        + 'einen sehr hohen Eingangswiderstand, es fließt also so gut wie kein Strom – und ohne '
        + 'Strom keine Kraft. Genau deshalb stört das Messen den Versuch nicht: Man kann die '
        + 'Induktionsspannung beobachten, ohne die Schwingung merklich zu beeinflussen.';
    }
  }

  const ur = document.getElementById('lskUrsache');
  if (ur) {
    if (_lsk.ursache === 'flaeche') {
      ur.innerHTML = `<div class="lsk-ur-t">
        Schließt man den Stromkreis, so umschließt die Leiterschleife eine Fläche A. Bewegt sich
        der Stab, so <b>ändert sich diese Fläche</b>, während B konstant bleibt. Das ist die
        erste der beiden Induktionsursachen – und die Leiterschaukel ist ihr Musterfall.
      </div>
      <div class="pho-rz"><span class="pho-rz-t">magnetischer Fluss</span>
        <span class="pho-rz-f">Φ = B · A = B · L · x</span><span class="pho-rz-v">B, L fest</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Induktionsgesetz</span>
        <span class="pho-rz-f">U = −dΦ/dt = B · L · dx/dt</span>
        <span class="pho-rz-v">= B · L · v</span></div>
      <div class="fpm-note">Bemerkenswert: Das ist <b>exakt dasselbe Ergebnis</b> wie aus dem
        Kraftansatz mit der Lorentzkraft in Station 2. Zwei völlig verschiedene Überlegungen –
        die eine über Kräfte auf einzelne Elektronen, die andere über den Fluss durch eine
        Fläche – führen auf dieselbe Formel. Das ist ein starkes Argument dafür, dass beide
        richtig sind.</div>`;
    } else {
      ur.innerHTML = `<div class="lsk-ur-t">
        Die zweite Ursache: Die Leiterschleife <b>ruht</b>, aber das Magnetfeld ändert sich mit
        der Zeit – etwa weil der Strom durch eine benachbarte Spule verändert wird. Auch dann
        wird eine Spannung induziert, obwohl sich kein Leiter bewegt und deshalb auch keine
        Lorentzkraft auf mitbewegte Elektronen wirken kann.
      </div>
      <div class="pho-rz"><span class="pho-rz-t">magnetischer Fluss</span>
        <span class="pho-rz-f">Φ = B(t) · A</span><span class="pho-rz-v">A fest</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Induktionsgesetz</span>
        <span class="pho-rz-f">U = −dΦ/dt = −A · dB/dt</span>
        <span class="pho-rz-v">A · Änderungsrate</span></div>
      <div class="fpm-note">Beide Ursachen fasst dasselbe Gesetz zusammen: <b>U = −dΦ/dt</b> mit
        Φ = B · A. Ändert sich A, hat man den Fall der Leiterschaukel; ändert sich B, den Fall
        des Transformators. Das ist der Sinn der KLP-Forderung, alle Induktionserscheinungen auf
        diese <b>zwei</b> Ursachen zurückzuführen – man muss sich nicht für jeden Aufbau ein
        neues Gesetz merken.</div>`;
    }
  }
}

// ── Station 6: inhomogenes Feld ────────────────────────
function _lskSetRuhelage(v) {
  _lsk.ruhelage = Math.max(-0.10, Math.min(0.10, +v));
  const e = document.getElementById('lskRuhelageLbl');
  if (e) e.textContent = _fpmNum(_lsk.ruhelage * 100, 1) + ' cm';
  _lskInhomReset();
}
function _lskInhomToggle() {
  _lsk.ilaeuft = !_lsk.ilaeuft;
  if (_lsk.ilaeuft && _lsk.it === 0) _lsk.ispur = [];
  const b = document.getElementById('lskInhomBtn');
  if (b) b.textContent = _lsk.ilaeuft ? '⏸ Anhalten' : '▶ Auslenken und loslassen';
  _lskRenderInhom();
}
function _lskInhomReset() {
  _lsk.ilaeuft = false; _lsk.it = 0; _lsk.ispur = [];
  const b = document.getElementById('lskInhomBtn');
  if (b) b.textContent = '▶ Auslenken und loslassen';
  _lskRenderInhom();
}
// Verlaesst der Stab den homogenen Bereich?
function _lskVerlaesstFeld() {
  const a = _lsk.pl * _lsk.phi0;
  return Math.abs(_lsk.ruhelage) + a > _LSK_HALBBREITE;
}
function _lskRenderInhom() {
  const el = document.getElementById('lskInhomDeutung'); if (!el) return;
  if (!_lskVerlaesstFeld()) {
    el.className = 'lsk-zustand ok';
    el.innerHTML = '<b>Der Stab bleibt immer zwischen den Schenkeln.</b> Dort ist das Feld nahezu '
      + 'konstant, die Spannung folgt deshalb sauber der Geschwindigkeit und die Kurve ist nahezu '
      + 'sinusförmig – das ist der Fall aus Abbildung 13 der Handreichung.';
  } else {
    el.className = 'lsk-zustand no';
    el.innerHTML = '<b>Der Stab schwingt zeitweise aus dem Feld heraus.</b> Im Streufeld außerhalb '
      + 'der Schenkel ist B viel kleiner, die Spannung dort also kleiner, als die Geschwindigkeit '
      + 'erwarten ließe. Die Halbwellen werden dadurch <b>schief</b>: Sie steigen steil an und '
      + 'fallen flach ab, statt symmetrisch zu verlaufen – das ist die Verzerrung aus Abbildung 14. '
      + 'Ihr <b>Größtwert bleibt aber gleich</b>, denn hin- und Rückweg überstreichen dieselben '
      + 'Orte und damit dieselben Feldstärken. Was sich verschiebt, ist die <b>Lage</b> des '
      + 'Größtwerts: Er liegt nicht mehr in der Ruhelage, sondern dort, wo das Produkt aus '
      + 'Geschwindigkeit und Feldstärke am größten wird – hier am Rand des homogenen Bereichs.';
  }
  const r = document.getElementById('lskInhomRechnung');
  if (r) {
    const x = _lskInhomX(_lsk.it);
    const umkehr = _lsk.ruhelage + _lsk.pl * _lsk.phi0;
    r.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">Ort des Stabes</span>
        <span class="pho-rz-f">x(t)</span><span class="pho-rz-v">${_fpmNum(x * 100, 2)} cm</span></div>
      <div class="pho-rz"><span class="pho-rz-t">Feld an diesem Ort</span>
        <span class="pho-rz-f">B(x)</span><span class="pho-rz-v">${_fpmNum(_lskBOrt(x) * 1000, 2)} mT</span></div>
      <div class="pho-rz"><span class="pho-rz-t">Geschwindigkeit</span>
        <span class="pho-rz-f">v(t)</span><span class="pho-rz-v">${_fpmNum(_lskV(_lsk.it), 3)} m/s</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Induktionsspannung</span>
        <span class="pho-rz-f">U = L · v · B(x)</span>
        <span class="pho-rz-v">${_lskMV(_lskInhomU(_lsk.it))} mV</span></div>
      <div class="fpm-note"><b>Die Aufgaben der Handreichung dazu.</b>
        Die <b>Nulldurchgänge</b> der Spannung liegen dort, wo v = 0 ist – also in den
        <b>Umkehrpunkten</b> der Bewegung, hier bei ${_fpmNum(umkehr * 100, 1)} cm und
        ${_fpmNum((_lsk.ruhelage - _lsk.pl * _lsk.phi0) * 100, 1)} cm. Das gilt unabhängig davon,
        wie stark das Feld dort ist: Ohne Bewegung keine Lorentzkraft, ohne Lorentzkraft keine
        Spannung. Ein <b>verzerrter</b> Kurvenabschnitt gehört zu einer Halbschwingung im
        Streufeld außerhalb der Schenkel, ein <b>unverzerrter</b> zu einer Halbschwingung
        zwischen ihnen.</div>`;
  }
}

// ── Zeichnung: Aufbau Station 1 ────────────────────────
function _lskRenderAufbau(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const ax = W / 2, ay = 26;                 // Aufhaengepunkt
  const SK = 150;                            // Bildpunkte je Meter
  const lpx = Math.min(_lsk.pl * SK, H - ay - 60);
  const phi = _lskPhi(_lsk.t);
  const sx = ax + Math.sin(phi) * lpx, sy = ay + Math.cos(phi) * lpx;

  // Stativ
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(ax - 70, ay - 8); ctx.lineTo(ax + 70, ay - 8); ctx.stroke();

  // Polschuhe des Hufeisenmagneten, von der Seite gesehen
  const pw = _LSK_POL * SK;
  ctx.fillStyle = _lsk.magnetUm ? '#38bdf8' : '#f87171';
  ctx.fillRect(ax - pw / 2 - 26, sy - 34, 26, 68);
  ctx.fillStyle = _lsk.magnetUm ? '#f87171' : '#38bdf8';
  ctx.fillRect(ax + pw / 2, sy - 34, 26, 68);
  ctx.fillStyle = '#fff'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_lsk.magnetUm ? 'S' : 'N', ax - pw / 2 - 13, sy + 5);
  ctx.fillText(_lsk.magnetUm ? 'N' : 'S', ax + pw / 2 + 13, sy + 5);
  // Feldlinien zwischen den Polen
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    const y = sy + i * 13;
    ctx.beginPath(); ctx.moveTo(ax - pw / 2, y); ctx.lineTo(ax + pw / 2, y); ctx.stroke();
  }

  // Aufhaengedraehte und Stab
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(ax - 26, ay); ctx.lineTo(sx - 12, sy);
  ctx.moveTo(ax + 26, ay); ctx.lineTo(sx + 12, sy); ctx.stroke();
  const stabPx = _lsk.stabL * SK;
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(sx - stabPx / 2, sy); ctx.lineTo(sx + stabPx / 2, sy); ctx.stroke();
  ctx.lineCap = 'butt';

  // Papierfahnen
  if (_lsk.fahnen) {
    ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1;
    [-1, 1].forEach(s => {
      const x = sx + s * stabPx / 2;
      ctx.fillRect(x - 7, sy + 3, 14, 12); ctx.strokeRect(x - 7, sy + 3, 14, 12);
    });
  }

  // Geschwindigkeitspfeil
  const v = _lskV(_lsk.t);
  if (Math.abs(v) > 0.01) {
    const len = Math.max(-60, Math.min(60, v * 90));
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sx, sy - 22); ctx.lineTo(sx + len, sy - 22); ctx.stroke();
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    const s = Math.sign(len);
    ctx.moveTo(sx + len + s * 7, sy - 22);
    ctx.lineTo(sx + len, sy - 27); ctx.lineTo(sx + len, sy - 17);
    ctx.closePath(); ctx.fill();
    ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('v', sx + len / 2, sy - 26);
  }

  // Anschluss an den Verstaerker
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ax - 26, ay); ctx.lineTo(24, ay); ctx.lineTo(24, H - 26);
  ctx.moveTo(ax + 26, ay); ctx.lineTo(W - 24, ay); ctx.lineTo(W - 24, H - 26);
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(W / 2 - 62, H - 34, 124, 22);
  ctx.strokeStyle = '#94a3b8'; ctx.strokeRect(W / 2 - 62, H - 34, 124, 22);
  ctx.beginPath(); ctx.moveTo(24, H - 26); ctx.lineTo(W / 2 - 62, H - 26);
  ctx.moveTo(W - 24, H - 26); ctx.lineTo(W / 2 + 62, H - 26); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('µV-Verstärker  ×' + _LSK_VORV, W / 2, H - 20);

  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('wirksame Länge = Polschuhbreite ' + _fpmNum(_LSK_POL * 100, 0) + ' cm', 8, 14);
}

// ── Zeichnung: Oszilloskop Station 1 ───────────────────
function _lskOsziGeo(cv) {
  const gw = _LSK_XDIV * 40, gh = _LSK_YDIV * 30;
  return { gx: (cv.width - gw) / 2, gy: 12, gw, gh, dx: 40, dy: 30 };
}
function _lskRenderOszi(ctx, cv, spur, tJetzt) {
  const W = cv.width, H = cv.height;
  const G = _lskOsziGeo(cv);
  ctx.fillStyle = '#0a0f0a'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#0d1a12'; ctx.fillRect(G.gx, G.gy, G.gw, G.gh);
  ctx.strokeStyle = '#1c3a29'; ctx.lineWidth = 1;
  for (let i = 0; i <= _LSK_XDIV; i++) {
    ctx.beginPath(); ctx.moveTo(G.gx + i * G.dx, G.gy); ctx.lineTo(G.gx + i * G.dx, G.gy + G.gh); ctx.stroke();
  }
  for (let j = 0; j <= _LSK_YDIV; j++) {
    ctx.beginPath(); ctx.moveTo(G.gx, G.gy + j * G.dy); ctx.lineTo(G.gx + G.gw, G.gy + j * G.dy); ctx.stroke();
  }
  const my = G.gy + G.gh / 2;
  ctx.strokeStyle = '#2d5c42'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(G.gx, my); ctx.lineTo(G.gx + G.gw, my);
  ctx.moveTo(G.gx + G.gw / 2, G.gy); ctx.lineTo(G.gx + G.gw / 2, G.gy + G.gh); ctx.stroke();

  const spanne = _lskZeit() * _LSK_XDIV;
  // Der Schirm laeuft mit, sobald die Aufzeichnung ueber den Rand hinausgeht
  const t0 = Math.max(0, tJetzt - spanne);
  ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  let begonnen = false;
  spur.forEach(p => {
    if (p.t < t0) { begonnen = false; return; }
    const x = G.gx + (p.t - t0) / spanne * G.gw;
    const y = my - _lskKaestchen(p.u) * G.dy;
    if (y < G.gy || y > G.gy + G.gh) { begonnen = false; return; }
    begonnen ? ctx.lineTo(x, y) : (ctx.moveTo(x, y), begonnen = true);
  });
  ctx.stroke();

  if (!spur.length) {
    ctx.fillStyle = '#4b7a63'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Auslenken und loslassen – dann zeichnet das Speicheroszilloskop auf.',
      G.gx + G.gw / 2, my);
    ctx.textAlign = 'left';
  }
  ctx.fillStyle = '#4b7a63'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_fpmNum(_lskZeit(), 1) + ' s je Kästchen  ·  ' + _LSK_VDIV
    + ' V je Kästchen nach ' + _LSK_VORV + '-facher Verstärkung', G.gx + G.gw / 2, G.gy + G.gh + 14);
  ctx.textAlign = 'left';
}

// ── Zeichnung: Herleitung Station 2 ────────────────────
function _lskRenderHerleitungCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2 - 10;
  const halb = 92;

  // Feldsymbole: Kreuze (hinein) oder Punkte (heraus)
  ctx.strokeStyle = '#94a3b8'; ctx.fillStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  for (let ix = -3; ix <= 3; ix++) {
    for (let iy = -2; iy <= 2; iy++) {
      const x = cx + ix * 56, y = cy + iy * 46;
      if (Math.abs(x - cx) < 26 && Math.abs(y - cy) < halb) continue;
      if (_lsk.bRichtung > 0) {
        ctx.beginPath();
        ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4);
        ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 2 * Math.PI); ctx.fill();
      }
    }
  }
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(_lsk.bRichtung > 0 ? 'B in die Zeichenebene hinein' : 'B aus der Zeichenebene heraus', 8, 14);

  // Der Leiter
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, cy - halb); ctx.lineTo(cx, cy + halb); ctx.stroke();
  ctx.lineCap = 'butt';

  const oben = (_lsk.vRichtung * _lsk.bRichtung) > 0;

  // Ladungstrennung ab Schritt 3
  if (_lsk.schritt >= 2) {
    const negY = oben ? cy - halb + 18 : cy + halb - 18;
    const posY = oben ? cy + halb - 18 : cy - halb + 18;
    ctx.fillStyle = '#2563eb';
    ctx.beginPath(); ctx.arc(cx, negY, 13, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('−', cx, negY + 5);
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(cx, posY, 13, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillText('+', cx, posY + 5);
  }

  // Elektronen im Leiter
  ctx.fillStyle = '#60a5fa';
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.arc(cx, cy + i * 26, 4.5, 0, 2 * Math.PI); ctx.fill();
  }

  // Bewegungspfeil
  const vr = _lsk.vRichtung > 0 ? 1 : -1;
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(cx, cy + halb + 26); ctx.lineTo(cx + vr * 62, cy + halb + 26); ctx.stroke();
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.moveTo(cx + vr * 72, cy + halb + 26);
  ctx.lineTo(cx + vr * 62, cy + halb + 21); ctx.lineTo(cx + vr * 62, cy + halb + 31);
  ctx.closePath(); ctx.fill();
  ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('v', cx + vr * 40, cy + halb + 20);

  // Lorentzkraft ab Schritt 2
  if (_lsk.schritt >= 1) {
    const fr = oben ? -1 : 1;
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(cx + 40, cy); ctx.lineTo(cx + 40, cy + fr * 54); ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(cx + 40, cy + fr * 64);
    ctx.lineTo(cx + 35, cy + fr * 54); ctx.lineTo(cx + 45, cy + fr * 54);
    ctx.closePath(); ctx.fill();
    ctx.font = '700 11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('F_L', cx + 48, cy + fr * 34);
  }

  // Elektrische Gegenkraft ab Schritt 4
  if (_lsk.schritt >= 3) {
    const fr = oben ? 1 : -1;
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(cx - 40, cy); ctx.lineTo(cx - 40, cy + fr * 54); ctx.stroke();
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy + fr * 64);
    ctx.lineTo(cx - 45, cy + fr * 54); ctx.lineTo(cx - 35, cy + fr * 54);
    ctx.closePath(); ctx.fill();
    ctx.font = '700 11px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('F_el', cx - 48, cy + fr * 34);
  }

  // Spannung ab Schritt 6
  if (_lsk.schritt >= 5) {
    ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(cx + 100, cy - halb); ctx.lineTo(cx + 100, cy + halb);
    ctx.moveTo(cx + 95, cy - halb); ctx.lineTo(cx + 105, cy - halb);
    ctx.moveTo(cx + 95, cy + halb); ctx.lineTo(cx + 105, cy + halb);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#0369a1'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('U = L·v·B', cx + 108, cy + 4);
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#64748b';
    ctx.fillText('L', cx + 108, cy - 12);
  }
}

// ── Zeichnung: Helmholtz Station 4 ─────────────────────
function _lskRenderHelmCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = 118;

  // Helmholtzspulen von der Seite
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 7;
  [-58, 58].forEach(dx => {
    ctx.beginPath(); ctx.moveTo(cx + dx, cy - 74); ctx.lineTo(cx + dx, cy + 74); ctx.stroke();
  });
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Helmholtzspulen  n = ' + _LSK_HN + ', R = ' + _fpmNum(_LSK_HR * 100, 0) + ' cm', cx, 16);
  // Feldlinien
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  for (let i = -3; i <= 3; i++) {
    const y = cy + i * 20;
    ctx.beginPath(); ctx.moveTo(cx - 54, y); ctx.lineTo(cx + 54, y); ctx.stroke();
  }

  // Die flache Spule mit 15 Schleifen als Pendel
  const phi = _lskPhi(_lsk.t) * 0.6;
  const ax = cx, ay = 34, lpx = 118;
  const sx = ax + Math.sin(phi) * lpx, sy = ay + Math.cos(phi) * lpx;
  ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const o = (i - 2.5) * 2.2;
    ctx.beginPath();
    ctx.moveTo(ax - 30 + o, ay); ctx.lineTo(sx - 30 + o, sy);
    ctx.lineTo(sx + 30 + o, sy); ctx.lineTo(ax + 30 + o, ay);
    ctx.stroke();
  }
  ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(sx - 30, sy); ctx.lineTo(sx + 30, sy); ctx.stroke();
  ctx.fillStyle = '#0369a1'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_LSK_SCHLEIFEN + ' Schleifen à ' + _fpmNum(_LSK_SCHLEIFE_L * 100, 0) + ' cm', sx, sy + 16);

  // Schneidlager
  ctx.fillStyle = '#64748b';
  ctx.beginPath(); ctx.moveTo(ax - 8, ay - 10); ctx.lineTo(ax + 8, ay - 10); ctx.lineTo(ax, ay); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Schneidlager', 8, 30);

  // Sensoren
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  ctx.fillRect(8, H - 56, 96, 20); ctx.strokeRect(8, H - 56, 96, 20);
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Ultraschallsensor', 56, H - 42);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(W - 104, H - 56, 96, 20); ctx.strokeRect(W - 104, H - 56, 96, 20);
  ctx.fillStyle = '#475569';
  ctx.fillText('Hallsonde', W - 56, H - 42);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(cx - 52, H - 28, 104, 20); ctx.strokeRect(cx - 52, H - 28, 104, 20);
  ctx.fillStyle = '#475569';
  ctx.fillText('µV-Verstärker + Interface', cx, H - 14);

  // v(t) und U(t) mit dem einstellbaren Zeitversatz
  ctx.fillStyle = '#16a34a'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('v(t)', 8, H - 62);
  ctx.fillStyle = '#0369a1';
  ctx.fillText('U(t)', 40, H - 62);
}

// ── Zeichnung: Ringversuch Station 5 ───────────────────
function _lskRenderRingCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const ax = W / 2, ay = 24, lpx = 150;
  const phi = _lskRingPhi(_lsk.rt);
  const sx = ax + Math.sin(phi) * lpx, sy = ay + Math.cos(phi) * lpx;

  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(ax - 70, ay - 6); ctx.lineTo(ax + 70, ay - 6); ctx.stroke();

  if (_lsk.magnetAn) {
    ctx.fillStyle = _lsk.magnetUm ? '#38bdf8' : '#f87171';
    ctx.fillRect(ax - 46, sy - 30, 24, 60);
    ctx.fillStyle = _lsk.magnetUm ? '#f87171' : '#38bdf8';
    ctx.fillRect(ax + 22, sy - 30, 24, 60);
    ctx.fillStyle = '#fff'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(_lsk.magnetUm ? 'S' : 'N', ax - 34, sy + 5);
    ctx.fillText(_lsk.magnetUm ? 'N' : 'S', ax + 34, sy + 5);
  }

  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(sx, sy - 26); ctx.stroke();

  if (_lsk.objekt === 'ring') {
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(sx, sy, 34, 26, 0, 0, 2 * Math.PI); ctx.stroke();
  } else {
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sx - 30, sy); ctx.lineTo(sx + 30, sy); ctx.stroke();
    ctx.lineCap = 'butt';
    // Anschluss: kurzgeschlossen oder am Voltmeter
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx - 30, sy); ctx.lineTo(sx - 30, sy + 34); ctx.lineTo(sx + 30, sy + 34);
    ctx.lineTo(sx + 30, sy); ctx.stroke();
    ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#94a3b8';
    ctx.fillRect(sx - 18, sy + 26, 36, 16); ctx.strokeRect(sx - 18, sy + 26, 36, 16);
    ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(_lsk.objekt === 'stab-kurz' ? 'Kabel' : 'V', sx, sy + 38);
  }

  // Bremskraft
  const v = Math.abs(_lsk.rt > 0 ? 0.5 : 0);
  if (_lsk.magnetAn && _lskDeltaEM(_LSK_RING_B) > 0.05 && _lsk.rlaeuft) {
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
    const r = Math.sign(-Math.sin(phi)) || 1;
    ctx.beginPath(); ctx.moveTo(sx, sy - 44); ctx.lineTo(sx + r * 40, sy - 44); ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(sx + r * 48, sy - 44);
    ctx.lineTo(sx + r * 40, sy - 48); ctx.lineTo(sx + r * 40, sy - 40);
    ctx.closePath(); ctx.fill();
    ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('F', sx + r * 24, sy - 48);
  }

  // Amplitudenverlauf als kleine Kurve
  const gx = 12, gy = H - 46, gw = W - 24, gh = 34;
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  ctx.strokeRect(gx, gy, gw, gh);
  ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let i = 0; i <= gw; i++) {
    const t = i / gw * 8;
    const y = gy + gh / 2 - _lskRingPhi(t) / Math.max(0.01, _lsk.rphi0) * (gh / 2 - 2);
    i ? ctx.lineTo(gx + i, y) : ctx.moveTo(gx + i, y);
  }
  ctx.stroke();
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Auslenkung über 8 s', gx + 3, gy - 3);
  // Marke fuer den aktuellen Zeitpunkt
  if (_lsk.rt <= 8) {
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1;
    const mx = gx + _lsk.rt / 8 * gw;
    ctx.beginPath(); ctx.moveTo(mx, gy); ctx.lineTo(mx, gy + gh); ctx.stroke();
  }
}

// ── Zeichnung: inhomogenes Feld Station 6 ──────────────
function _lskRenderInhomAufbau(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2 + 20;
  const SK = 900;   // Bildpunkte je Meter

  // Feldstaerkeprofil als Hintergrund
  for (let px = 0; px < W; px++) {
    const x = (px - cx) / SK;
    const b = _lskBOrt(x) / Math.max(1e-9, _lsk.B);
    if (b < 0.02) continue;
    ctx.fillStyle = 'rgba(56,189,248,' + (0.30 * b) + ')';
    ctx.fillRect(px, cy - 46, 1, 92);
  }
  // Polschuhe
  const pw = _LSK_HALBBREITE * SK;
  ctx.fillStyle = '#f87171'; ctx.fillRect(cx - pw - 22, cy - 46, 22, 92);
  ctx.fillStyle = '#38bdf8'; ctx.fillRect(cx + pw, cy - 46, 22, 92);
  ctx.fillStyle = '#fff'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('N', cx - pw - 11, cy + 5);
  ctx.fillText('S', cx + pw + 11, cy + 5);

  // Bahn und Umkehrpunkte
  const amp = _lsk.pl * _lsk.phi0;
  const x1 = _lsk.ruhelage - amp, x2 = _lsk.ruhelage + amp;
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(cx + x1 * SK, cy - 60); ctx.lineTo(cx + x1 * SK, cy + 60);
  ctx.moveTo(cx + x2 * SK, cy - 60); ctx.lineTo(cx + x2 * SK, cy + 60);
  ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Umkehrpunkt', cx + x1 * SK, cy + 72);
  ctx.fillText('Umkehrpunkt', cx + x2 * SK, cy + 72);

  // Ruhelage
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + _lsk.ruhelage * SK, cy - 62); ctx.lineTo(cx + _lsk.ruhelage * SK, cy - 50); ctx.stroke();
  ctx.fillStyle = '#16a34a';
  ctx.fillText('Ruhelage', cx + _lsk.ruhelage * SK, cy - 66);

  // Der Stab
  const x = _lskInhomX(_lsk.it);
  const sx = cx + x * SK;
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.arc(sx, cy, 7, 0, 2 * Math.PI); ctx.fill();

  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Feldstärke als Helligkeit – außerhalb der Schenkel fällt B rasch ab', 8, 14);
}
function _lskRenderInhomOszi(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#0a0f0a'; ctx.fillRect(0, 0, W, H);
  const gx = 30, gy = 14, gw = W - 44, gh = H - 44;
  ctx.fillStyle = '#0d1a12'; ctx.fillRect(gx, gy, gw, gh);
  ctx.strokeStyle = '#1c3a29'; ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    ctx.beginPath(); ctx.moveTo(gx + i * gw / 10, gy); ctx.lineTo(gx + i * gw / 10, gy + gh); ctx.stroke();
  }
  for (let j = 0; j <= 8; j++) {
    ctx.beginPath(); ctx.moveTo(gx, gy + j * gh / 8); ctx.lineTo(gx + gw, gy + j * gh / 8); ctx.stroke();
  }
  const my = gy + gh / 2;
  ctx.strokeStyle = '#2d5c42'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(gx, my); ctx.lineTo(gx + gw, my); ctx.stroke();

  // Massstab so waehlen, dass die ungestoerte Kurve gut passt
  const umax = Math.max(1e-9, _lskLWirk() * _lskVMax() * _lsk.B);
  const spanne = 8;
  ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  let begonnen = false;
  _lsk.ispur.forEach(p => {
    if (p.t > spanne) return;
    const x = gx + p.t / spanne * gw;
    const y = my - p.u / umax * (gh / 2 - 6);
    if (y < gy || y > gy + gh) { begonnen = false; return; }
    begonnen ? ctx.lineTo(x, y) : (ctx.moveTo(x, y), begonnen = true);
  });
  ctx.stroke();

  if (!_lsk.ispur.length) {
    ctx.fillStyle = '#4b7a63'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Auslenken und loslassen', gx + gw / 2, my);
    ctx.textAlign = 'left';
  }
  ctx.fillStyle = '#4b7a63'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('8 s', gx + gw / 2, gy + gh + 14);
  ctx.save(); ctx.translate(14, my); ctx.rotate(-Math.PI / 2);
  ctx.fillText('U', 0, 0); ctx.restore();
  ctx.textAlign = 'left';
}

// ── Takt und Zeichnung ─────────────────────────────────
function _lskTakt(dt) {
  if (!_lsk) return;
  const d = Math.min(0.05, dt);
  if (_lsk.laeuft) {
    _lsk.t += d;
    _lsk.spur.push({ t: _lsk.t, u: _lskUt(_lsk.t) });
    if (_lsk.spur.length > 6000) _lsk.spur.shift();
    if (_lsk.t > 120) _lsk.laeuft = false;
  }
  if (_lsk.rlaeuft) {
    _lsk.rt += d;
    if (_lsk.rt > 8) { _lsk.rt = 0; }
  }
  if (_lsk.ilaeuft) {
    _lsk.it += d;
    _lsk.ispur.push({ t: _lsk.it, u: _lskInhomU(_lsk.it) });
    if (_lsk.it > 8) { _lsk.ilaeuft = false;
      const b = document.getElementById('lskInhomBtn');
      if (b) b.textContent = '▶ Auslenken und loslassen'; }
  }
}
function _lskRender() {
  if (!_lsk) return;
  const s = _lsk.station;
  if (s === 0) {
    const ca = document.getElementById('lskAufbau');
    if (ca) _lskRenderAufbau(ca.getContext('2d'), ca);
    const co = document.getElementById('lskOszi');
    if (co) _lskRenderOszi(co.getContext('2d'), co, _lsk.spur, _lsk.t);
    if (_lsk.laeuft) _lskUpdate();
  } else if (s === 1) {
    const ch = document.getElementById('lskHerleitung');
    if (ch) _lskRenderHerleitungCv(ch.getContext('2d'), ch);
  } else if (s === 3) {
    const chm = document.getElementById('lskHelm');
    if (chm) _lskRenderHelmCv(chm.getContext('2d'), chm);
  } else if (s === 4) {
    const cr = document.getElementById('lskRing');
    if (cr) _lskRenderRingCv(cr.getContext('2d'), cr);
  } else if (s === 5) {
    const cia = document.getElementById('lskInhomAufbau');
    if (cia) _lskRenderInhomAufbau(cia.getContext('2d'), cia);
    const cio = document.getElementById('lskInhomOszi');
    if (cio) _lskRenderInhomOszi(cio.getContext('2d'), cio);
    if (_lsk.ilaeuft) _lskRenderInhom();
  }
}

// ── Zusätzliche Styles für die Leiterschaukel ──────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .lsk-zustand { font-size: .78rem; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 9px; padding: 9px 11px; margin: 8px 0; line-height: 1.55; }
    .lsk-zustand.ok { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
    .lsk-zustand.mid { background: #fffbeb; border-color: #fde68a; color: #b45309; }
    .lsk-zustand.no { background: #fef2f2; border-color: #fecaca; color: #b91c1c; }
    .lsk-k3 { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-top: 12px; }
    .lsk-k3-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
    .lsk-k3-teil { flex: 1 1 190px; background: #fff; border: 1px solid #e2e8f0;
      border-radius: 8px; padding: 8px 10px; font-size: .77rem; color: #475569; line-height: 1.55; }
    .lsk-k3-teil span { display: block; font-size: .6rem; text-transform: uppercase;
      letter-spacing: .05em; font-weight: 800; color: #94a3b8; margin-bottom: 3px; }
    .lsk-schritte { display: flex; flex-direction: column; gap: 5px; }
    .lsk-schritt { display: flex; gap: 8px; align-items: flex-start; padding: 7px 9px;
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; opacity: .45; }
    .lsk-schritt.an { opacity: 1; }
    .lsk-schritt.jetzt { border-color: #0369a1; background: #f0f9ff; }
    .lsk-schritt-n { flex: 0 0 20px; height: 20px; border-radius: 50%; background: #cbd5e1;
      color: #fff; font-size: .68rem; font-weight: 800; text-align: center; line-height: 20px; }
    .lsk-schritt.an .lsk-schritt-n { background: #0369a1; }
    .lsk-schritt-k { font-size: .76rem; font-weight: 800; color: #334155; }
    .lsk-schritt-t { font-size: .76rem; color: #475569; line-height: 1.6; margin-top: 3px; }
    .lsk-schritt-f { font-size: .8rem; color: #075985; background: #fff; border: 1px solid #bae6fd;
      border-radius: 6px; padding: 4px 8px; margin-top: 5px; font-variant-numeric: tabular-nums; }
    .lsk-drei { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-top: 10px; }
    .lsk-drei-text { font-size: .78rem; color: #475569; line-height: 1.65; margin-top: 4px; }
    .lsk-drei-jetzt { font-size: .78rem; color: #075985; background: #f0f9ff; border: 1px solid #bae6fd;
      border-radius: 8px; padding: 8px 10px; margin-top: 8px; line-height: 1.55; }
    .lsk-hypo { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-bottom: 12px; }
    .lsk-hypo-liste { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0; }
    .lsk-hypo-z { flex: 1 1 250px; display: flex; gap: 7px; align-items: flex-start;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 7px 9px; }
    .lsk-hypo-n { flex: 0 0 18px; height: 18px; border-radius: 50%; background: #0369a1;
      color: #fff; font-size: .64rem; font-weight: 800; text-align: center; line-height: 18px; }
    .lsk-hypo-t { font-size: .75rem; color: #475569; line-height: 1.5; }
    .lsk-hypo-j { font-size: .68rem; color: #94a3b8; margin-top: 2px; }
    .lsk-ursache { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 8px 11px; margin-top: 8px; }
    .lsk-ur-t { font-size: .78rem; color: #475569; line-height: 1.6; margin-bottom: 6px; }
    .lsk-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();
// ═══════════════════════════════════════════════════════
// THOMSON'SCHER RINGVERSUCH
// Schluesselexperiment 10 der NRW-Handreichung.
// Er ist der experimentell gesicherte Schluessel zum Minuszeichen im
// Induktionsgesetz. Der KLP nennt dazu genau eine Kompetenz:
// anhand des Versuchs die Lenz'sche Regel erlaeutern (E5, UF4).
// Dazu kommt K3 – Aufbau und Ergebnis adressatenbezogen erlaeutern.
// ═══════════════════════════════════════════════════════

const _THR_G = 9.81;

// Feldspule mit Eisenkern, Daten aus Abschnitt 3b der Handreichung
const _THR_R_SPULE = 5.0;        // Ohm'scher Widerstand der Feldspule
const _THR_L_EISEN = 0.108;      // Induktivitaet mit Eisenkern in H
const _THR_L_LEER  = 0.0144;     // ohne Eisenkern, rund ein Achtel davon
// Beim Ausschalten reisst der Strom viel schneller ab als er aufgebaut wird –
// die Handreichung spricht von einer "sehr schnellen" Aenderung.
const _THR_TAU_AUS = 0.004;

// Aluminiumring, bifilar aufgehaengt
const _THR_RING_R  = 0.030;      // Ringradius in m
const _THR_A       = Math.PI * _THR_RING_R * _THR_RING_R;
const _THR_QUER    = 3e-3 * 3e-3;
const _THR_RHO_AL  = 2.65e-8;    // spezifischer Widerstand von Aluminium
const _THR_DICHTE  = 2700;
const _THR_UMFANG  = 2 * Math.PI * _THR_RING_R;
const _THR_R_RING  = _THR_RHO_AL * _THR_UMFANG / _THR_QUER;
const _THR_M_RING  = _THR_UMFANG * _THR_QUER * _THR_DICHTE;
const _THR_PENDEL  = 0.35;       // Laenge der bifilaren Aufhaengung in m

// Feld am Ort des Rings. Es ist ausgepraegt inhomogen – genau darauf beruht
// die Bremswirkung in Phase 1, Teil 2.
const _THR_BMAX = 0.12;          // Feld am Ruheort des Rings bei vollem Strom
const _THR_LAMBDA = 0.06;        // Abklinglaenge laengs des Eisenkerns

const _THR_LUFT = 0.5;           // Luftwiderstand und Aufhaengung

let _thr = null;

function _thrInit() {
  _thr = {
    station: 0,
    // Grundversuch
    an: false, jeAn: false, f: 0, df: 0, tSchalt: 0,
    x: 0, v: 0, t: 0, spur: [],
    zeitlupe: 1, eisen: true, geschlitzt: false, laeuft: true,
    aufbau: 'einzel',         // 'einzel' | 'nn' | 'ns' | 'quer'
    // Station 2
    schritt: 0, vorzeichen: 'ein',
    // Station 3
    leseT: '', geprueft: null, kernAn: true,
    // Station 4
    prognose: null, drehWinkel: 30, drehLaeuft: false, drehT: 0, drehPhi: 0, drehW: 6,
    // Station 5
    uAc: 0, hRing: 0, gedrueckt: false, waerme: 20, kanone: false, kanoneT: 0
  };
}

// ── Feldaufbau in der Spule ────────────────────────────
// Einschalten: I(t) = I_max·(1 − e^(−t/τ)) mit τ = L/R
// Die Halbwertszeit T_1/2 = ln2 · L/R erlaubt es, L aus der Messkurve zu
// bestimmen – genau das rechnet die Handreichung vor.
function _thrL() { return _thr.eisen ? _THR_L_EISEN : _THR_L_LEER; }
function _thrTau() { return _thrL() / _THR_R_SPULE; }
function _thrTauFuer(L) { return L / _THR_R_SPULE; }
function _thrHalbwert(L) { return Math.LN2 * L / _THR_R_SPULE; }
function _thrLAusHalbwert(T12) { return T12 * _THR_R_SPULE / Math.LN2; }
// Anteil des Endwerts nach der Zeit t
function _thrAnteil(t, L) { return 1 - Math.exp(-t / _thrTauFuer(L)); }
// Wann sind p Prozent erreicht?
function _thrZeitFuer(p, L) { return -_thrTauFuer(L) * Math.log(1 - p); }

// ── Magnetfeld am Ort des Rings ────────────────────────
// Der Aufbau bestimmt, wie stark der Ring vom Fluss durchsetzt wird.
function _thrAufbauFaktor() {
  switch (_thr.aufbau) {
    // Zwei Spulen, gleiche Pole einander zugewandt: die Fluesse treiben von
    // beiden Seiten zur Mitte und heben sich dort in Achsenrichtung auf.
    case 'nn': return 0.04;
    // Ungleiche Pole einander zugewandt: der Fluss laeuft durch – er addiert sich.
    case 'ns': return 1.95;
    // Homogenes Querfeld: der Ring wird gar nicht axial durchsetzt.
    case 'quer': return 0;
    default: return 1;
  }
}
function _thrB(x, f) {
  return _THR_BMAX * _thrAufbauFaktor() * Math.exp(-x / _THR_LAMBDA) * f;
}
function _thrdBdx(x, f) { return -_thrB(x, f) / _THR_LAMBDA; }

// ── Induktion im Ring ──────────────────────────────────
// U_i = −dΦ/dt, und dΦ/dt zerfaellt in zwei Beitraege:
//   A · ∂B/∂t  – das Feld aendert sich mit der Zeit (Phasen 1.1 und 3)
//   A · ∂B/∂x · v – der Ring faehrt durch das inhomogene Feld (Phasen 1.2, 2.2)
// Diese Trennung ist der Kern der Handreichung.
function _thrUiZeit(x, df) {
  return -_THR_A * _THR_BMAX * _thrAufbauFaktor() * Math.exp(-x / _THR_LAMBDA) * df;
}
function _thrUiOrt(x, v, f) {
  return -_THR_A * _thrdBdx(x, f) * v;
}
function _thrUi(x, v, f, df) { return _thrUiZeit(x, df) + _thrUiOrt(x, v, f); }
function _thrRRing() { return _thr.geschlitzt ? 1e9 : _THR_R_RING; }
function _thrIRing(x, v, f, df) { return _thrUi(x, v, f, df) / _thrRRing(); }
// Kraft auf den stromdurchflossenen Ring im inhomogenen Feld: F = m·dB/dx
// mit dem magnetischen Moment m = A·I.
function _thrKraft(x, v, f, df) {
  return _THR_A * _thrIRing(x, v, f, df) * _thrdBdx(x, f);
}

// ── Bewegung des Rings ─────────────────────────────────
function _thrOmega0() { return Math.sqrt(_THR_G / _THR_PENDEL); }
function _thrSchrittRechnen(dt) {
  const s = _thr;
  const F = _thrKraft(s.x, s.v, s.f, s.df);
  const w0 = _thrOmega0();
  const a = F / _THR_M_RING - w0 * w0 * s.x - _THR_LUFT * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
}
function _thrFeldSchritt(dt) {
  const s = _thr;
  if (s.an) {
    const tau = _thrTau();
    s.df = (1 - s.f) / tau;
    s.f += s.df * dt;
    if (s.f > 1) s.f = 1;
  } else {
    s.df = -s.f / _THR_TAU_AUS;
    s.f += s.df * dt;
    if (s.f < 1e-6) { s.f = 0; s.df = 0; }
  }
}

// ── Die Phasen, wie die Handreichung sie unterscheidet ─
// Erkannt wird am physikalischen Zustand, nicht an der Uhr.
function _thrPhase() {
  const s = _thr;
  if (!s.jeAn) return 'bereit';
  if (s.an) {
    if (s.f < 0.95) return '1.1';
    if (s.v > 0.002) return '1.2';
    if (s.v < -0.002) return '2.2';
    return s.x > 0.004 ? '2.1' : '2.3';
  }
  return s.f > 0.02 ? '3' : '4';
}
const _THR_PHASEN = {
  'bereit': { n: 'Bereit', t: 'Der Ring hängt in Ruhe. Drücke den Taster.',
    beob: 'Der Ring hängt still neben der Spule.',
    deut: 'Ohne Strom kein Magnetfeld, ohne Feldänderung keine Induktion.' },
  '1.1': { n: 'Phase 1, Teil 1', t: 'Einschalten – der Ring wird abgestoßen',
    beob: 'Der Ring wird <b>abgestoßen</b>.',
    deut: 'Durch das Einschalten entsteht ein schnell wachsendes Magnetfeld der Spule. Dadurch wird im Ring ein Strom induziert und dieser erzeugt ein eigenes Magnetfeld. Dass der Ring abgestoßen wird, zeigt: Das Ringfeld ist dem Spulenfeld <b>entgegengerichtet</b>.' },
  '1.2': { n: 'Phase 1, Teil 2', t: 'Die Abstoßung wird gebremst',
    beob: 'Die Abstoßung des Rings wird <b>gebremst</b>.',
    deut: 'Das Spulenfeld ist inzwischen fast vollständig aufgebaut, ändert sich zeitlich also kaum noch. Weil es aber <b>inhomogen</b> ist, nimmt es für den wegfliegenden Ring trotzdem ab. Auch das ist eine Flussänderung – und der jetzt induzierte Strom fließt <b>umgekehrt</b>. Sein Feld ist dem Spulenfeld gleichgerichtet, die Bewegung wird gebremst.' },
  '2.1': { n: 'Phase 2, Teil 1', t: 'Umkehrpunkt – kurzer Stillstand',
    beob: 'Der Ring steht für einen Augenblick in maximaler Auslenkung <b>still</b>.',
    deut: 'Er ruht, das Feld ist zeitlich konstant – es ändert sich also gar nichts am Fluss. Deshalb wird kein Strom induziert und der Ring hat kein eigenes Magnetfeld.' },
  '2.2': { n: 'Phase 2, Teil 2', t: 'Der Ring kriecht zurück',
    beob: 'Der Ring <b>kriecht</b> in seine Ruhelage zurück – er schwingt nicht.',
    deut: 'Wie ein ausgelenktes Pendel wird er zur Ruhelage zurückgezogen. Dabei durchfährt er wieder das inhomogene Feld, es wird wieder ein Strom induziert, und wieder wirkt die Kraft der Bewegung entgegen. Genau deshalb <i>kriecht</i> er, statt zu schwingen.' },
  '2.3': { n: 'Phase 2, Teil 3', t: 'Der Ring ruht',
    beob: 'Der Ring <b>ruht</b> in seiner Ausgangslage, obwohl der Strom weiter fließt.',
    deut: 'Er bewegt sich nicht, das Feld ändert sich nicht – also keine Flussänderung, kein Strom, kein Ringfeld. Ein konstantes Magnetfeld allein bewirkt nichts.' },
  '3': { n: 'Phase 3', t: 'Ausschalten – der Ring wird angezogen',
    beob: 'Der Ring wird <b>angezogen</b> und läuft aus Trägheit noch etwas weiter.',
    deut: 'Beim Ausschalten verschwindet das Spulenfeld sehr schnell. Diese Änderung induziert wieder einen Strom – nun aber in umgekehrter Richtung als beim Einschalten. Das Ringfeld ist dem Spulenfeld jetzt <b>gleichgerichtet</b>, der Ring wird zur Spule hingezogen.' },
  '4': { n: 'Phase 4', t: 'Freies Pendeln',
    beob: 'Der Ring <b>pendelt</b> wie ein gewöhnliches Fadenpendel aus.',
    deut: 'Das Spulenfeld existiert nicht mehr. Ohne äußeres Feld wird kein Strom mehr induziert – es bleibt reine Mechanik.' }
};

// ── Station 4: Ring am verdrillten Faden ───────────────
// Φ = B·A·cos θ. Die Flussaenderung ist am groessten, wenn die Ringebene
// PARALLEL zum Feld steht – nicht, wenn der Ring quer dazu steht.
// Genau das erkennen Lernende laut Handreichung meist nicht sofort.
const _THR_B_HUF = 0.25;
function _thrDrehFluss(phi) { return _THR_B_HUF * _THR_A * Math.cos(phi); }
function _thrDrehUi(phi, w) { return _THR_B_HUF * _THR_A * Math.sin(phi) * w; }
function _thrDrehBrems(phi, w) {
  if (_thr.geschlitzt) return 0;
  const I = _thrDrehUi(phi, w) / _THR_R_RING;
  return I * _THR_A * _THR_B_HUF * Math.sin(phi);
}
// Das Traegheitsmoment eines duennen Rings um einen Durchmesser
function _thrTraegheit() { return 0.5 * _THR_M_RING * _THR_RING_R * _THR_RING_R; }

// ── Station 5: Schweben im Wechselfeld ─────────────────
// Die ausfuehrliche Begruendung ist laut Handreichung sehr anspruchsvoll –
// sie braucht die Selbstinduktion des Rings, die den Strom phasenverschiebt.
// Hier wird nur das Ergebnis modelliert: eine zeitlich gemittelte Kraft,
// die mit dem Quadrat der Spannung waechst und mit der Hoehe abfaellt.
const _THR_AC_K = 4.5e-4;      // Kraftbeiwert in N/V²; so hebt der Ring
                               // ab etwa 10 V ab, wie in einem Schulaufbau
const _THR_AC_LAMBDA = 0.045;  // Abklinglaenge der Kraft in m
function _thrACKraft(U, h) { return _THR_AC_K * U * U * Math.exp(-2 * h / _THR_AC_LAMBDA); }
function _thrGewicht() { return _THR_M_RING * _THR_G; }
// Schwebehoehe: dort ist die Kraft gerade so gross wie die Gewichtskraft
function _thrSchwebeHoehe(U) {
  const q = _THR_AC_K * U * U / _thrGewicht();
  return q <= 1 ? 0 : _THR_AC_LAMBDA / 2 * Math.log(q);
}
function _thrSchwebtBei(U) { return _thrSchwebeHoehe(U) > 0.001; }
// Die Verlustleistung waechst mit demselben Ausdruck wie die Kraft. Deshalb
// ist sie in der freien Schwebelage IMMER gleich – dort haelt die Kraft ja
// gerade das Gewicht. Drueckt man den Ring hinunter, steigt sie.
function _thrACLeistung(U, h) { return 80 * _thrACKraft(U, h); }

// ── Wirbelstromanwendungen ─────────────────────────────
const _THR_ANWENDUNGEN = [
  { n: 'Wirbelstrombremse', k: 'Achterbahn, Fallturm, Bahn',
    t: 'Am bewegten Wagen sitzen Metallfinnen, die zwischen starken Magneten hindurchlaufen. Im Metall entstehen Wirbelströme, deren Felder der Bewegung entgegenwirken. Die Bremse ist <b>verschleißfrei und berührungslos</b> – sie bremst aber nur, solange etwas in Bewegung ist, und kann deshalb nicht festhalten. Genau das ist Phase 2, Teil 3 des Ringversuchs: keine Bewegung, keine Flussänderung, keine Kraft.' },
  { n: 'Waltenhofensches Pendel', k: 'Vollplatte gegen Kammplatte',
    t: 'Eine Metallplatte pendelt zwischen den Polen eines Magneten und wird stark abgebremst. Schlitzt man dieselbe Platte kammartig ein, so pendelt sie fast ungehindert weiter: Die Schlitze unterbrechen die Wirbelströme. Das ist derselbe Nachweis wie beim <b>geschlitzten Ring</b> – ohne geschlossenen Stromweg keine Kraft.' },
  { n: 'Magnet im Aluminiumrohr', k: 'Heimversuch mit Alufolienrolle',
    t: 'Lässt man einen starken Magneten durch ein Aluminiumrohr gleiten, sinkt er auffällig langsam. Im Rohr entstehen ringförmige Wirbelströme, deren Felder ihn abstoßen. Aluminium ist nicht magnetisch – der Magnet wird nicht angezogen, sondern von seinen eigenen Induktionswirkungen getragen. <b>Vorsicht mit Neodym-Magneten, die Quetschgefahr ist erheblich.</b>' },
  { n: 'Aluminiumfolie auf Wasser', k: 'Neodym-Magnet kreisend darüber',
    t: 'Bewegt man einen starken Magneten dicht über einer auf Wasser schwimmenden Aluminiumfolie im Kreis, so wird die Folie mitgezogen. Die Wirbelströme in der Folie versuchen, der Flussänderung entgegenzuwirken – und das gelingt am besten, indem die Folie dem Magneten folgt. Nach demselben Prinzip arbeitet der Asynchronmotor.' },
  { n: 'Gauß-Kanone', k: 'Coilgun',
    t: 'Schaltet man den Spulenstrom schlagartig ein statt langsam, so ist die Feldänderung so heftig, dass der Ring regelrecht fortgeschleudert wird. Das ist der Grundversuch zur <b>Gauß-Kanone</b>. Größere selbstgebaute Geräte dieser Art sind ernsthaft gefährlich – der Reiz der Bastelvideos im Netz sollte nicht darüber hinwegtäuschen.' },
  { n: 'Induktionskochfeld', k: 'Wirbelströme als Heizung',
    t: 'Hier ist die Verlustwärme nicht Nebenwirkung, sondern Zweck: Ein hochfrequentes Wechselfeld erzeugt Wirbelströme im Topfboden, die ihn direkt erwärmen. Das Kochfeld selbst bleibt kalt. Dasselbe Erwärmen macht sich auch beim schwebenden Ring bemerkbar – er wird spürbar heiß.' }
];

// ── Oberfläche ─────────────────────────────────────────
function _thrHTML() {
  const stationen = ['1 · Der Grundversuch', '2 · Das Minuszeichen',
                     '3 · Wie schnell wächst das Feld?', '4 · Varianten & Gegenproben',
                     '5 · Wechselfeld & Wirbelströme']
    .map((s, i) => `<button class="fpm-tab${i === _thr.station ? ' on' : ''}" id="thrSt${i}" onclick="_thrSetStation(${i})">${s}</button>`).join('');

  const anwendungen = _THR_ANWENDUNGEN.map((a, i) =>
    `<button class="ebr-obj" id="thrAnw${i}" onclick="_thrSetAnw(${i})">
       <span class="ebr-obj-n">${a.n}</span><span class="ebr-obj-k">${a.k}</span></button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim thr-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">💍 Thomsonscher Ringversuch: das Schlüsselexperiment</h3>
    <canvas id="thrTakt" width="1" height="1" style="display:none"></canvas>
    <div class="fpm-tabs">${stationen}</div>

    <!-- ══ Station 1 ══ -->
    <div id="thrS0">
      <div class="fpm-grid">
        <div>
          <canvas id="thrAufbau" width="440" height="270" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Feldspule mit Eisenkern, daneben der bifilar aufgehängte Aluminiumring</div>
          <canvas id="thrSpur" width="440" height="230" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Auslenkung des Rings und Ringstrom über der Zeit</div>
        </div>
        <div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="thrTasterBtn" onclick="_thrTaster()">⏻ Strom einschalten</button>
            <button class="sim-btn" onclick="_thrReset()">↺ Zurücksetzen</button>
          </div>
          <div class="osz-gruppe">
            <div class="osz-gruppe-k">Ablauf</div>
            <div class="osz-zeile"><span>Zeitlupe</span>
              <span class="osz-seg">
                <button class="osz-segb" id="thrZl1" onclick="_thrSetZeitlupe(1)">1 : 1</button>
                <button class="osz-segb" id="thrZl4" onclick="_thrSetZeitlupe(4)">1 : 4</button>
                <button class="osz-segb" id="thrZl20" onclick="_thrSetZeitlupe(20)">1 : 20</button>
              </span></div>
            <label class="fpm-check"><input type="checkbox" id="thrGeschlitzt"
              onchange="_thrSetGeschlitzt(this.checked)"> geschlitzten Ring verwenden (Gegenprobe)</label>
          </div>
          <div class="thr-phase" id="thrPhase"></div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Spulenstrom</span><span class="fpm-ro-v" id="thrIA">—</span><span class="fpm-ro-u">% vom Endwert</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Feld am Ring B</span><span class="fpm-ro-v" id="thrBA">—</span><span class="fpm-ro-u">mT</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Auslenkung x</span><span class="fpm-ro-v" id="thrXA">—</span><span class="fpm-ro-u">cm</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Geschwindigkeit v</span><span class="fpm-ro-v" id="thrVA">—</span><span class="fpm-ro-u">m/s</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Ringstrom I</span><span class="fpm-ro-v" id="thrIRA">—</span><span class="fpm-ro-u">A</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Kraft auf den Ring</span><span class="fpm-ro-v" id="thrFA">—</span><span class="fpm-ro-u">mN</span></div>
          </div>
          <div class="fpm-label">Woher kommt die Flussänderung gerade?</div>
          <div class="thr-anteile" id="thrAnteile"></div>
          <div class="ebr-rechnung" id="thrRechnung"></div>
        </div>
      </div>
      <div class="thr-k3" id="thrK3"></div>
    </div>

    <!-- ══ Station 2 ══ -->
    <div id="thrS1" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="thrVorz" width="440" height="300" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Feldrichtungen von Spule und Ring</div>
          <div class="sim-btn-row">
            <button class="sim-btn" id="thrVzEin" onclick="_thrSetVorzeichen('ein')">Einschalten (Ḃ &gt; 0)</button>
            <button class="sim-btn" id="thrVzAus" onclick="_thrSetVorzeichen('aus')">Ausschalten (Ḃ &lt; 0)</button>
          </div>
          <div class="thr-vorztab" id="thrVorzTab"></div>
        </div>
        <div>
          <div class="fpm-label">Die Argumentation Schritt für Schritt</div>
          <div class="lsk-schritte" id="thrSchritte"></div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_thrSchritt(-1)">◀ zurück</button>
            <button class="sim-btn primary" onclick="_thrSchritt(1)">weiter ▶</button>
            <button class="sim-btn" onclick="_thrSchritt(99)">alle zeigen</button>
          </div>
          <div class="thr-lenz" id="thrLenz"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 3 ══ -->
    <div id="thrS2" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="thrStrom" width="440" height="300" class="phys-chart-cv"></canvas>
          <div class="fpm-label">Spulenstrom nach dem Einschalten – Messkurve wie in Abbildung 3</div>
          <label class="fpm-check"><input type="checkbox" id="thrKern" checked
            onchange="_thrSetKern(this.checked)"> Eisenkern eingesetzt</label>
          <div class="fpm-note">Die Handreichung zeigt beide Kurven: mit Eisenkern (Abbildung 3a)
            und ohne (Abbildung 3b). Die eisengefüllte Spule hat rund die 7- bis 8-fache
            Induktivität.</div>
        </div>
        <div>
          <div class="thr-warum" id="thrWarum"></div>
          <div class="fpm-label" style="margin-top:10px">Halbwertszeit ablesen</div>
          <div class="osz-lese">
            <div class="osz-lese-z"><span>T<sub>1/2</sub> =</span>
              <input type="text" class="fpm-input osz-inp" id="thrLeseT" placeholder="?"
                spellcheck="false" oninput="_thrSetLese(this.value)"><span>ms</span></div>
          </div>
          <div class="ebr-rechnung" id="thrLeseAus"></div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_thrPruefen()">✓ Ablesung prüfen</button>
          </div>
          <div class="lsk-zustand" id="thrLesePruef"></div>
        </div>
      </div>
      <div class="thr-zeitachse" id="thrZeitachse"></div>
    </div>

    <!-- ══ Station 4 ══ -->
    <div id="thrS3" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="thrVariante" width="440" height="280" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Aufbau wählen</div>
          <div class="fsr-quellen" style="flex-wrap:wrap">
            <button class="fsr-quelle on" id="thrAu0" onclick="_thrSetAufbau('einzel')">
              <span class="fsr-quelle-n">eine Spule</span><span class="fsr-quelle-k">Grundversuch</span></button>
            <button class="fsr-quelle" id="thrAu1" onclick="_thrSetAufbau('nn')">
              <span class="fsr-quelle-n">gleiche Pole</span><span class="fsr-quelle-k">Abb. 5a · N gegenüber N</span></button>
            <button class="fsr-quelle" id="thrAu2" onclick="_thrSetAufbau('ns')">
              <span class="fsr-quelle-n">ungleiche Pole</span><span class="fsr-quelle-k">Abb. 5b · N gegenüber S</span></button>
            <button class="fsr-quelle" id="thrAu3" onclick="_thrSetAufbau('quer')">
              <span class="fsr-quelle-n">homogenes Querfeld</span><span class="fsr-quelle-k">Gegenprobe</span></button>
          </div>
          <div class="thr-prognose" id="thrPrognose"></div>
        </div>
        <div>
          <div class="fpm-label">Ring am verdrillten Faden im Hufeisenfeld (Abbildung 7)</div>
          <canvas id="thrDreh" width="440" height="220" class="phys-anim-cv"></canvas>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="thrDrehBtn" onclick="_thrDrehToggle()">▶ Faden entdrillen lassen</button>
            <button class="sim-btn" onclick="_thrDrehReset()">↺ neu verdrillen</button>
          </div>
          <div class="ebr-rechnung" id="thrDrehRechnung"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 5 ══ -->
    <div id="thrS4" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="thrSchweb" width="440" height="320" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Senkrechter Aufbau, Feldspule mit Wechselstrom (Abbildung 6)</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Wechselspannung: <b id="thrUacLbl">0 V</b></span>
            <input type="range" id="thrUac" min="0" max="30" step="0.5" value="0"
              oninput="_thrSetUac(this.value)" style="width:100%;accent-color:#dc2626">
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" id="thrDrueckBtn" onclick="_thrDruecken()">👇 Ring hinunterdrücken</button>
            <button class="sim-btn" onclick="_thrKanone()">💥 schlagartig einschalten</button>
          </div>
        </div>
        <div>
          <div class="ebr-rechnung" id="thrSchwebRechnung"></div>
          <div class="lsk-zustand" id="thrWaerme"></div>
          <div class="fpm-label" style="margin-top:10px">Wirbelströme in Natur und Technik</div>
          <div class="ebr-objs">${anwendungen}</div>
          <div class="thr-anw" id="thrAnwText"></div>
        </div>
      </div>
    </div>

    <div id="thrErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>U<sub>i</sub> = −dΦ/dt</b> &nbsp;|&nbsp; <b>Ḃ &gt; 0 ⇒ U<sub>i</sub> = −U</b>
      &nbsp;|&nbsp; <b>Ḃ &lt; 0 ⇒ U<sub>i</sub> = +U</b>
      &nbsp;|&nbsp; <b>T<sub>1/2</sub> = ln 2 · L / R</b>
    </p>
  </div>`;
}

function _thrErklHTML() {
  return `<div class="dsp-erkl-kopf">Wozu dieser Versuch der Schlüssel ist</div>
    <div class="dsp-erkl-text">
      Dass eine Flussänderung eine Spannung induziert, weiß man schon. Offen ist nur eine Frage:
      <b>in welche Richtung?</b> Genau darauf antwortet der Thomsonsche Ringversuch – er ist der
      experimentell gesicherte Schlüssel zum <b>Minuszeichen</b> in U<sub>i</sub> = −dΦ/dt. Und er
      verlangt dabei etwas, das man in der Physik selten so unmittelbar üben kann: <b>sehr genaues
      Hinsehen</b>. Der Versuch dauert keine zwei Sekunden, enthält aber sieben klar unterscheidbare
      Teilphasen. Wer nur „der Ring springt weg" beobachtet, hat das Wesentliche verpasst.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Der Aufbau</div>
    <div class="dsp-erkl-text">
      Eine Feldspule mit 500 bis 600 Windungen, durch ihren Hohlraum ein langer Eisenkern, der auch
      den daneben hängenden Aluminiumring durchsetzt. Der Kern verstärkt das Feld erheblich. Der
      Ring hängt <b>bifilar</b>, also an zwei Fäden – so kann er beim Wegfliegen nicht seitlich
      ausweichen. Geschaltet wird mit einem Taster. Als Quelle empfiehlt sich ein Akku: Bei
      Netzteilen mit Restwelligkeit sieht man den Ring in seiner Ruhelage leicht zittern.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Das Entscheidende: Die Feldrichtung ändert sich nie</div>
    <div class="dsp-erkl-text">
      Ein Punkt, an dem viele Erklärungen scheitern: Das Magnetfeld der Spule wird während des
      ganzen Versuchs <b>nur auf- und wieder abgebaut</b> – seine Richtung bleibt immer dieselbe.
      Der Nordpol bleibt, wo er ist. Was sich umkehrt, ist allein die Richtung des <b>Ringstroms</b>,
      und zwar je nachdem, ob der Fluss durch den Ring gerade zu- oder abnimmt.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Zwei Ursachen, eine Formel</div>
    <div class="dsp-erkl-text">
      Der Fluss durch den Ring, Φ = B · A, kann sich aus zwei Gründen ändern: weil <b>B sich mit der
      Zeit ändert</b> (Ein- und Ausschalten) oder weil der Ring sich <b>durch ein inhomogenes
      Feld bewegt</b> und dabei in Bereiche anderer Feldstärke gerät. Beim Ringversuch treten
      nacheinander beide auf – und genau das macht den Ablauf so lehrreich. In Phase 1, Teil 1
      wirkt die erste Ursache, in Phase 1, Teil 2 und in Phase 2, Teil 2 die zweite.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum das Feld schon fertig ist, wenn der Ring noch fliegt</div>
    <div class="dsp-erkl-text">
      Die Deutung von Phase 1, Teil 2 steht und fällt damit, dass das Spulenfeld längst vollständig
      aufgebaut ist, während der Ring noch unterwegs ist. Die Handreichung belegt das mit einer
      Messung: Der Spulenstrom erreicht nach etwa <b>60 bis 70 ms</b> rund 95 % seines Endwerts,
      der Ring braucht aber etwa <b>250 ms</b> bis zum Umkehrpunkt. In den letzten rund 180 ms
      bewegt er sich also durch ein Feld, das sich zeitlich nicht mehr ändert – die Bremsung kann
      dann nur von der <b>Inhomogenität</b> herrühren. Aus der Halbwertszeit der Stromkurve lässt
      sich über T<sub>1/2</sub> = ln 2 · L/R sogar die Induktivität bestimmen: Mit R = 5 Ω ergibt
      sich L ≈ 108 mH.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Die Lenzsche Regel</div>
    <div class="dsp-erkl-text">
      Fasst man die Beobachtungen zusammen, ergibt sich: Beim Einschalten (Ḃ &gt; 0) sind die
      Felder von Spule und Ring <b>entgegengesetzt</b>, induzierte und angelegte Spannung also
      auch – U<sub>i</sub> = −U. Beim Ausschalten (Ḃ &lt; 0) sind sie <b>gleichgerichtet</b> –
      U<sub>i</sub> = +U. Ḃ und U<sub>i</sub> haben also stets <b>entgegengesetztes Vorzeichen</b>.
      Sprachlich: <i>Die induzierte Spannung, der dadurch fließende Strom und dessen Magnetfeld
      sind stets so gerichtet, dass sie der Änderung entgegenwirken, die sie hervorruft.</i>
      Das ist die Lenzsche Regel – und sie ist nichts anderes als der Energieerhaltungssatz in
      Verkleidung: Würde das Ringfeld die Änderung <i>verstärken</i>, entstünde eine
      Selbstverstärkung, die aus dem Nichts Energie liefern würde.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Ein Hinweis zur Argumentation</div>
    <div class="dsp-erkl-text">
      Die Handreichung rät ausdrücklich davon ab, im Grundkurs mit dem <b>Umlaufsinn einer
      Fläche</b> zu argumentieren – das hilft erfahrungsgemäß wenig. Einfacher ist der Vergleich
      der <b>Vorzeichen</b> von B und U<sub>i</sub>: Eine negative Induktionsspannung bedeutet,
      dass sie einer vorgegebenen Spannung entgegengesetzt ist, eine positive, dass sie ihr
      gleichgerichtet ist.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Wozu das alles gut ist</div>
    <div class="dsp-erkl-text">
      Der Ringversuch ist die Grundlage aller <b>Wirbelstromanwendungen</b>: der berührungslosen
      Bremsen an Achterbahnen, Falltürmen und Zügen, des Waltenhofenschen Pendels, des langsam
      fallenden Magneten im Aluminiumrohr, des Induktionskochfelds. Ihnen allen ist gemeinsam,
      dass sie nur wirken, <b>solange sich etwas ändert</b> – eine Wirbelstrombremse kann deshalb
      abbremsen, aber niemals festhalten.
    </div>
    <div class="dsp-erkl-warn">⚠ Beim schwebenden Ring im Wechselfeld: Der Ring wird <b>heiß</b>.
      Drückt man ihn unter seine Schwebehöhe, erwärmt er sich noch deutlich schneller. Bei
      Ergänzungsversuchen mit Neodym-Magneten ist die Quetschgefahr nicht zu unterschätzen.</div>`;
}

// ── Stationen ──────────────────────────────────────────
function _thrSetStation(i) {
  _thr.station = i;
  for (let k = 0; k < 5; k++) {
    document.getElementById('thrSt' + k)?.classList.toggle('on', k === i);
    const d = document.getElementById('thrS' + k);
    if (d) d.style.display = k === i ? 'block' : 'none';
  }
  _thrUpdate();
}

// ── Station 1 ──────────────────────────────────────────
function _thrTaster() {
  _thr.an = !_thr.an;
  if (_thr.an) { _thr.jeAn = true; }
  const b = document.getElementById('thrTasterBtn');
  if (b) b.textContent = _thr.an ? '⏻ Strom ausschalten' : '⏻ Strom einschalten';
  _thrUpdate();
}
function _thrReset() {
  _thr.an = false; _thr.jeAn = false; _thr.f = 0; _thr.df = 0;
  _thr.x = 0; _thr.v = 0; _thr.t = 0; _thr.spur = [];
  const b = document.getElementById('thrTasterBtn');
  if (b) b.textContent = '⏻ Strom einschalten';
  _thrUpdate();
}
function _thrSetZeitlupe(z) {
  _thr.zeitlupe = z;
  [1, 4, 20].forEach(k => document.getElementById('thrZl' + k)?.classList.toggle('on', k === z));
  _thrUpdate();
}
function _thrSetGeschlitzt(v) { _thr.geschlitzt = !!v; _thrReset(); }

function _thrUpdate() {
  if (!_thr) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const s = _thr;
  const B = _thrB(s.x, s.f), I = _thrIRing(s.x, s.v, s.f, s.df);
  const F = _thrKraft(s.x, s.v, s.f, s.df);
  set('thrIA', _fpmNum(s.f * 100, 1));
  set('thrBA', _fpmNum(B * 1000, 2));
  set('thrXA', _fpmNum(s.x * 100, 2));
  set('thrVA', _fpmNum(s.v, 3));
  set('thrIRA', _fpmNum(I, 1));
  set('thrFA', _fpmNum(F * 1000, 2));
  [1, 4, 20].forEach(k => document.getElementById('thrZl' + k)?.classList.toggle('on', k === s.zeitlupe));

  const ph = _thrPhase();
  const P = _THR_PHASEN[ph];
  const el = document.getElementById('thrPhase');
  if (el) {
    el.className = 'thr-phase ' + (ph === 'bereit' ? '' : ph === '4' ? 'fertig' : 'an');
    el.innerHTML = `<div class="thr-phase-k">${P.n}<span>${P.t}</span></div>
      <div class="thr-phase-b"><b>Beobachtung</b> ${P.beob}</div>
      <div class="thr-phase-d"><b>Deutung</b> ${P.deut}</div>`;
  }

  // Die beiden Beitraege zur Flussaenderung getrennt ausweisen
  const an = document.getElementById('thrAnteile');
  if (an) {
    const uz = _thrUiZeit(s.x, s.df), uo = _thrUiOrt(s.x, s.v, s.f);
    const ges = Math.abs(uz) + Math.abs(uo);
    const pz = ges > 1e-12 ? Math.abs(uz) / ges * 100 : 0;
    an.innerHTML = `
      <div class="thr-balken">
        <div class="thr-balken-z" style="width:${_fpmNum(pz, 1)}%"></div>
        <div class="thr-balken-o" style="width:${_fpmNum(100 - pz, 1)}%"></div>
      </div>
      <div class="thr-balken-lbl">
        <span><i class="thr-pkt z"></i>Feld ändert sich mit der Zeit · ${_fpmNum(pz, 0)} %</span>
        <span><i class="thr-pkt o"></i>Ring fährt durchs inhomogene Feld · ${_fpmNum(100 - pz, 0)} %</span>
      </div>`;
  }

  const r = document.getElementById('thrRechnung');
  if (r) {
    const uz = _thrUiZeit(s.x, s.df), uo = _thrUiOrt(s.x, s.v, s.f);
    r.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">weil das Feld zeitlich wächst oder fällt</span>
        <span class="pho-rz-f">−A · ∂B/∂t</span>
        <span class="pho-rz-v">${_fpmNum(uz * 1000, 2)} mV</span></div>
      <div class="pho-rz"><span class="pho-rz-t">weil der Ring durchs inhomogene Feld fährt</span>
        <span class="pho-rz-f">−A · ∂B/∂x · v</span>
        <span class="pho-rz-v">${_fpmNum(uo * 1000, 2)} mV</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Induktionsspannung insgesamt</span>
        <span class="pho-rz-f">U<sub>i</sub> = −dΦ/dt</span>
        <span class="pho-rz-v">${_fpmNum((uz + uo) * 1000, 2)} mV</span></div>
      ${s.geschlitzt ? '<div class="fpm-note">Der Ring ist <b>geschlitzt</b>. Die Spannung wird '
        + 'nach wie vor induziert – aber der Stromweg ist unterbrochen, es fließt kein Strom, es '
        + 'entsteht kein Ringfeld und damit keine Kraft. Der Ring hängt einfach da. Das ist die '
        + 'sauberste Gegenprobe zum ganzen Versuch.</div>' : ''}`;
  }

  _thrRenderK3();
  _thrRenderVorz();
  _thrRenderStrom();
  _thrRenderPrognose();
  _thrRenderDreh();
  _thrRenderSchweb();
}

function _thrRenderK3() {
  const el = document.getElementById('thrK3'); if (!el) return;
  el.innerHTML = `
    <div class="git-sch-kopf">So erklärst du diesen Versuch jemandem anderen</div>
    <div class="lsk-k3-grid">
      <div class="lsk-k3-teil"><span>Zielsetzung</span>
        Wir wollen herausfinden, in <b>welche Richtung</b> eine Induktionsspannung wirkt – also
        warum im Induktionsgesetz ein Minuszeichen steht.</div>
      <div class="lsk-k3-teil"><span>Aufbau</span>
        Eine Feldspule mit langem Eisenkern; der Kern durchsetzt einen daneben bifilar
        aufgehängten Aluminiumring. Der Spulenstrom lässt sich mit einem Taster ein- und
        ausschalten.</div>
      <div class="lsk-k3-teil"><span>Durchführung</span>
        Strom einschalten, warten, wieder ausschalten – und dabei sehr genau hinsehen.</div>
      <div class="lsk-k3-teil"><span>Ergebnis</span>
        Beim <b>Einschalten</b> wird der Ring abgestoßen, beim <b>Ausschalten</b> angezogen.
        Dazwischen kriecht er langsam zurück, danach pendelt er frei aus.</div>
      <div class="lsk-k3-teil"><span>Deutung</span>
        Das Ringfeld wirkt der Änderung immer entgegen: Wächst der Fluss, stellt es sich dagegen
        (Abstoßung); schwindet der Fluss, versucht es ihn zu halten (Anziehung). Das ist die
        <b>Lenzsche Regel</b> – und der Grund für das Minuszeichen.</div>
    </div>`;
}

// ── Station 2: das Minuszeichen ────────────────────────
function _thrSetVorzeichen(v) {
  _thr.vorzeichen = v;
  document.getElementById('thrVzEin')?.classList.toggle('primary', v === 'ein');
  document.getElementById('thrVzAus')?.classList.toggle('primary', v === 'aus');
  _thrRenderVorz();
}
function _thrSchritt(d) {
  _thr.schritt = d === 99 ? 4 : Math.max(0, Math.min(4, _thr.schritt + d));
  _thrRenderVorz();
}
const _THR_SCHRITTE = [
  { k: 'Was fest bleibt',
    t: 'Die Feldspule behält während des ganzen Versuchs ihre <b>Polung</b>. Ihr Nordpol wandert nicht. Das Spulenfeld wird nur auf- und wieder abgebaut.',
    f: '' },
  { k: 'Einschalten: Der Fluss wächst',
    t: 'Beim Einschalten wächst das Spulenfeld schnell an, der Fluss durch den Ring nimmt also zu.',
    f: 'Ḃ &gt; 0' },
  { k: 'Was man sieht, verrät die Feldrichtung',
    t: 'Der Ring wird <b>abgestoßen</b>. Zwei Magnetfelder stoßen einander genau dann ab, wenn sie <b>entgegengesetzt</b> gerichtet sind. Also muss das Ringfeld dem Spulenfeld entgegenstehen – das ist keine Annahme, sondern eine Ablesung aus der Beobachtung.',
    f: 'B<sub>Ring</sub> ↑↓ B<sub>Spule</sub>  ⇒  U<sub>i</sub> = −U' },
  { k: 'Ausschalten: Der Fluss schwindet',
    t: 'Beim Ausschalten bricht das Spulenfeld zusammen. Jetzt wird der Ring <b>angezogen</b> – und anziehen tun sich Felder, die <b>gleich</b> gerichtet sind.',
    f: 'Ḃ &lt; 0  ⇒  B<sub>Ring</sub> ↑↑ B<sub>Spule</sub>  ⇒  U<sub>i</sub> = +U' },
  { k: 'Das Minuszeichen',
    t: 'Beide Fälle zusammengenommen: Wächst B, ist U<sub>i</sub> negativ; fällt B, ist U<sub>i</sub> positiv. Ḃ und U<sub>i</sub> haben also <b>immer entgegengesetztes Vorzeichen</b>. Genau das drückt das Minuszeichen im Induktionsgesetz aus.',
    f: 'U<sub>i</sub> = −dΦ/dt' }
];
function _thrRenderVorz() {
  const el = document.getElementById('thrSchritte');
  if (el) {
    el.innerHTML = _THR_SCHRITTE.map((sc, i) => {
      const aktiv = i <= _thr.schritt;
      return `<div class="lsk-schritt${aktiv ? ' an' : ''}${i === _thr.schritt ? ' jetzt' : ''}">
        <span class="lsk-schritt-n">${i + 1}</span>
        <div><div class="lsk-schritt-k">${sc.k}</div>
        ${aktiv ? '<div class="lsk-schritt-t">' + sc.t + '</div>' : ''}
        ${aktiv && sc.f ? '<div class="lsk-schritt-f">' + sc.f + '</div>' : ''}</div></div>`;
    }).join('');
  }
  const tab = document.getElementById('thrVorzTab');
  if (tab) {
    const ein = _thr.vorzeichen === 'ein';
    tab.innerHTML = `
      <table class="sim-table thr-tab">
        <thead><tr><th></th><th>Einschalten</th><th>Ausschalten</th></tr></thead>
        <tbody>
          <tr><td>Fluss durch den Ring</td><td class="${ein ? 'hell' : ''}">nimmt zu</td><td class="${ein ? '' : 'hell'}">nimmt ab</td></tr>
          <tr><td>Ḃ</td><td class="${ein ? 'hell' : ''}">&gt; 0</td><td class="${ein ? '' : 'hell'}">&lt; 0</td></tr>
          <tr><td>Beobachtung</td><td class="${ein ? 'hell' : ''}"><b>abgestoßen</b></td><td class="${ein ? '' : 'hell'}"><b>angezogen</b></td></tr>
          <tr><td>Felder von Ring und Spule</td><td class="${ein ? 'hell' : ''}">entgegengesetzt</td><td class="${ein ? '' : 'hell'}">gleichgerichtet</td></tr>
          <tr><td>Induktionsspannung</td><td class="${ein ? 'hell' : ''}">U<sub>i</sub> = −U</td><td class="${ein ? '' : 'hell'}">U<sub>i</sub> = +U</td></tr>
          <tr><td>Vorzeichen von Ḃ und U<sub>i</sub></td><td class="${ein ? 'hell' : ''}">entgegengesetzt</td><td class="${ein ? '' : 'hell'}">entgegengesetzt</td></tr>
        </tbody>
      </table>`;
  }
  const lz = document.getElementById('thrLenz');
  if (lz) {
    lz.innerHTML = `<div class="git-sch-kopf">Die Lenzsche Regel</div>
      <div class="thr-lenz-satz">Die induzierte Spannung, der dadurch fließende Strom und dessen
        Magnetfeld sind stets so gerichtet, dass sie <b>der Änderung entgegenwirken, die sie
        hervorruft</b>.</div>
      <div class="thr-lenz-t">Man kann die Regel auch aus der <b>Energieerhaltung</b> begründen:
        Würde das Ringfeld die Änderung nicht hemmen, sondern verstärken, so würde die dadurch
        erzeugte Bewegung ihrerseits die Induktion vergrößern und so fort – ein sich selbst
        aufschaukelnder Vorgang, der aus dem Nichts Energie liefern würde. Die Lenzsche Regel ist
        also kein zusätzliches Naturgesetz, sondern eine Folge eines bekannten.</div>
      <div class="fpm-note">Die Handreichung rät davon ab, im Grundkurs mit dem <b>Umlaufsinn
        einer Fläche</b> zu argumentieren – das hilft erfahrungsgemäß wenig. Der Vergleich der
        Vorzeichen von B und U<sub>i</sub> ist der leichter zugängliche Weg.</div>`;
  }
}

// ── Station 3: der Feldaufbau ──────────────────────────
function _thrSetKern(v) { _thr.kernAn = !!v; _thr.geprueft = null; _thrRenderStrom(); }
function _thrSetLese(v) { _thr.leseT = v; _thrRenderStrom(); }
function _thrLeseL() {
  const t = parseFloat(String(_thr.leseT).replace(',', '.'));
  return isFinite(t) && t > 0 ? _thrLAusHalbwert(t / 1000) : NaN;
}
function _thrPruefen() {
  const L = _thrLeseL();
  const soll = _thr.kernAn ? _THR_L_EISEN : _THR_L_LEER;
  _thr.geprueft = isFinite(L) ? { L, soll, abw: Math.abs(L - soll) / soll * 100 } : { L: NaN, soll };
  _thrRenderStrom();
}
function _thrRenderStrom() {
  const L = _thr.kernAn ? _THR_L_EISEN : _THR_L_LEER;
  const w = document.getElementById('thrWarum');
  if (w) {
    const t95 = _thrZeitFuer(0.95, _THR_L_EISEN);
    w.innerHTML = `<div class="git-sch-kopf">Warum diese Messung gebraucht wird</div>
      <div class="thr-warum-t">
        Die Deutung von Phase 1, Teil 2 – die Bremsung stammt allein von der <b>Inhomogenität</b>
        des Feldes – gilt nur, wenn das Feld zu diesem Zeitpunkt schon <b>fertig aufgebaut</b> ist.
        Das lässt sich nicht behaupten, das muss man messen. Der Spulenstrom folgt
        I(t) = I<sub>max</sub> · (1 − e<sup>−t/τ</sup>) mit τ = L/R und erreicht 95 % seines
        Endwerts nach <b>${_fpmNum(t95 * 1000, 0)} ms</b>. Der Ring braucht aber rund
        <b>250 ms</b> bis zum Umkehrpunkt. In den letzten etwa <b>180 ms</b> bewegt er sich also
        durch ein Feld, das sich zeitlich nicht mehr ändert.
      </div>
      <div class="fpm-note">Im Grundkurs muss man diese Rechnung nicht durchführen – es genügt der
        Hinweis, dass das Feld sehr viel schneller aufgebaut ist, als der Ring fliegt. Die
        Lehrkraft sollte die Zeiten aber kennen. Der Zusammenhang war 2014 Gegenstand einer
        Zentralabituraufgabe.</div>`;
  }
  const el = document.getElementById('thrLeseAus');
  if (el) {
    const Lg = _thrLeseL();
    if (!isFinite(Lg)) {
      el.innerHTML = '<div class="fpm-note">Lies in der Kurve ab, nach welcher Zeit der Strom die '
        + '<b>Hälfte</b> seines Endwerts erreicht hat, und trage sie oben ein. Daraus folgt die '
        + 'Induktivität der Spule.</div>';
    } else {
      el.innerHTML = `
        <div class="pho-rz"><span class="pho-rz-t">abgelesene Halbwertszeit</span>
          <span class="pho-rz-f">T<sub>1/2</sub></span>
          <span class="pho-rz-v">${_fpmNum(parseFloat(String(_thr.leseT).replace(',', '.')), 2)} ms</span></div>
        <div class="pho-rz"><span class="pho-rz-t">Widerstand der Feldspule</span>
          <span class="pho-rz-f">R</span><span class="pho-rz-v">${_fpmNum(_THR_R_SPULE, 1)} Ω</span></div>
        <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">daraus die Induktivität</span>
          <span class="pho-rz-f">L = T<sub>1/2</sub> · R / ln 2</span>
          <span class="pho-rz-v">${_fpmNum(Lg * 1000, 2)} mH</span></div>
        <div class="fpm-note">Aus T<sub>1/2</sub> = ln 2 · L/R folgt umgestellt
          L = T<sub>1/2</sub> · R / ln 2. Die Halbwertszeit ist bei einem Exponentialverlauf
          immer dieselbe – egal, von welchem Punkt aus man sie misst.</div>`;
    }
  }
  const pr = document.getElementById('thrLesePruef');
  if (pr) {
    const g = _thr.geprueft;
    if (!g) { pr.className = 'lsk-zustand'; pr.innerHTML = 'Trage deine Ablesung ein und prüfe sie.'; return; }
    if (!isFinite(g.L)) {
      pr.className = 'lsk-zustand no';
      pr.innerHTML = 'Keine Zahl eingetragen.';
      return;
    }
    const gut = g.abw < 12;
    pr.className = 'lsk-zustand ' + (gut ? 'ok' : 'no');
    pr.innerHTML = (gut ? '<b>Gut abgelesen.</b> ' : '<b>Da stimmt etwas nicht.</b> ')
      + 'Der Sollwert ist L = ' + _fpmNum(g.soll * 1000, 1) + ' mH, deine Ablesung ergibt '
      + _fpmNum(g.L * 1000, 1) + ' mH – ' + _fpmNum(g.abw, 1) + ' % daneben.'
      + (_thr.kernAn
        ? ' Das Handbuch nennt für die eisengefüllte Spule 108 mH.'
        : ' Ohne Eisenkern ist die Induktivität rund sieben- bis achtmal kleiner.');
  }
  const za = document.getElementById('thrZeitachse');
  if (za) {
    const t95 = _thrZeitFuer(0.95, _THR_L_EISEN) * 1000;
    za.innerHTML = `<div class="git-sch-kopf">Die beiden Zeitskalen nebeneinander</div>
      <div class="thr-zeit-bar">
        <div class="thr-zeit-feld" style="width:${_fpmNum(t95 / 250 * 100, 1)}%">Feld aufgebaut · ${_fpmNum(t95, 0)} ms</div>
        <div class="thr-zeit-ring">Ring fliegt weiter, Feld schon konstant · ${_fpmNum(250 - t95, 0)} ms</div>
      </div>
      <div class="thr-warum-t">Bis zum Umkehrpunkt vergehen rund 250 ms. Nur im ersten kleinen
        Abschnitt wächst das Feld noch merklich. Die Bremsung, die man in Phase 1, Teil 2
        beobachtet, fällt vollständig in den zweiten Abschnitt – sie kann also unmöglich von einer
        zeitlichen Feldänderung stammen, sondern nur davon, dass der Ring in Bereiche
        <b>schwächeren</b> Feldes gerät.</div>`;
  }
}

// ── Station 4: Varianten ───────────────────────────────
function _thrSetAufbau(a) {
  _thr.aufbau = a;
  ['einzel', 'nn', 'ns', 'quer'].forEach((k, i) =>
    document.getElementById('thrAu' + i)?.classList.toggle('on', k === a));
  _thr.prognose = null;
  _thrReset();
}
function _thrSetAnw(i) {
  const el = document.getElementById('thrAnwText');
  const a = _THR_ANWENDUNGEN[i];
  _THR_ANWENDUNGEN.forEach((x, k) =>
    document.getElementById('thrAnw' + k)?.classList.toggle('on', k === i));
  if (el) el.innerHTML = `<div class="thr-anw-k">${a.n}</div><div class="thr-anw-t">${a.t}</div>`;
}
function _thrRenderPrognose() {
  const el = document.getElementById('thrPrognose'); if (!el) return;
  const a = _thr.aufbau;
  const staerke = _thrAufbauFaktor();
  const texte = {
    'einzel': ['Der Grundversuch', 'Eine Spule, ein Eisenkern, ein Ring. Beim Einschalten Abstoßung, beim Ausschalten Anziehung.'],
    'nn': ['Gleiche Pole einander zugewandt (Abbildung 5a)',
      'Zwei in Reihe geschaltete Feldspulen auf demselben Kern, mit <b>gleichen Polen</b> zueinander. '
      + 'Beide treiben den Fluss von ihrer Seite zur Mitte – dort heben sich die Beiträge längs der '
      + 'Achse weitgehend auf. Durch den Ring geht deshalb <b>fast kein Fluss</b>, und er reagiert '
      + 'kaum. Diese Prognose können Lernende sicher stellen, sofern sie die Polung richtig erkannt '
      + 'haben.'],
    'ns': ['Ungleiche Pole einander zugewandt (Abbildung 5b)',
      'Jetzt liegt ein Nordpol dem Südpol der anderen Spule gegenüber. Der Fluss läuft glatt durch '
      + 'den Kern hindurch, die Beiträge <b>addieren</b> sich. Durch den Ring geht damit rund der '
      + 'doppelte Fluss wie beim Grundversuch, und die Wirkung ist entsprechend heftiger. Die '
      + 'Handreichung schlägt vor, hier eine Prognose <i>vor</i> der Durchführung zu verlangen – '
      + 'und bei Fehlprognosen auch darüber zu sprechen, warum man seine Meinung geändert hat.'],
    'quer': ['Homogenes Querfeld – die Gegenprobe',
      'Ein <b>homogenes</b> Feld, das von vorn nach hinten zeigt, durchsetzt den Ring gar nicht in '
      + 'Achsenrichtung. Und selbst wenn: In einem homogenen Feld ändert sich der Fluss durch eine '
      + 'starre Leiterschleife nicht, solange man sie nur <b>verschiebt</b> und nicht dreht. Es wird '
      + 'also nichts induziert und der Ring wird in den Phasen 1 und 2 auch nicht gebremst. Genau '
      + 'darauf weist die Handreichung hin – die Bremswirkung im Grundversuch stammt <i>allein</i> '
      + 'von der Inhomogenität.']
  };
  const t = texte[a];
  el.innerHTML = `<div class="thr-prog-k">${t[0]}</div>
    <div class="thr-prog-t">${t[1]}</div>
    <div class="thr-prog-w">Fluss durch den Ring gegenüber dem Grundversuch:
      <b>${staerke === 0 ? 'null' : _fpmNum(staerke * 100, 0) + ' %'}</b></div>`;
}

function _thrDrehToggle() {
  _thr.drehLaeuft = !_thr.drehLaeuft;
  const b = document.getElementById('thrDrehBtn');
  if (b) b.textContent = _thr.drehLaeuft ? '⏸ Anhalten' : '▶ Faden entdrillen lassen';
  _thrRenderDreh();
}
function _thrDrehReset() {
  _thr.drehLaeuft = false; _thr.drehPhi = 0; _thr.drehW = 6; _thr.drehT = 0;
  const b = document.getElementById('thrDrehBtn');
  if (b) b.textContent = '▶ Faden entdrillen lassen';
  _thrRenderDreh();
}
function _thrRenderDreh() {
  const el = document.getElementById('thrDrehRechnung'); if (!el) return;
  const phi = _thr.drehPhi, w = _thr.drehW;
  const s = Math.abs(Math.sin(phi));
  const parallel = s > 0.9;
  el.innerHTML = `
    <div class="pho-rz"><span class="pho-rz-t">Fluss durch den Ring</span>
      <span class="pho-rz-f">Φ = B · A · cos θ</span>
      <span class="pho-rz-v">${_ebrExp(_thrDrehFluss(phi), 2)} Wb</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Winkelgeschwindigkeit</span>
      <span class="pho-rz-f">θ̇</span>
      <span class="pho-rz-v">${_fpmNum(w, 2)} 1/s</span></div>
    <div class="pho-rz"><span class="pho-rz-t">induzierte Spannung</span>
      <span class="pho-rz-f">U<sub>i</sub> = B·A·sin θ · θ̇</span>
      <span class="pho-rz-v">${_fpmNum(_thrDrehUi(phi, w) * 1000, 3)} mV</span></div>
    <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">bremsendes Drehmoment ∝ sin²θ</span>
      <span class="pho-rz-f">M = A²·B²·sin²θ · θ̇ / R</span>
      <span class="pho-rz-v">${_ebrExp(Math.abs(_thrDrehBrems(phi, w)), 2)} N·m</span></div>
    <div class="fpm-note">${_thr.geschlitzt
      ? 'Der Ring ist geschlitzt – kein Stromweg, kein Bremsmoment. Er dreht ungehindert weiter.'
      : parallel
        ? '<b>Die Ringebene steht gerade parallel zum Feld.</b> Hier ist die Änderung der wirksamen '
          + 'Fläche am größten – und damit die Bremsung. Das erkennen Lernende laut Handreichung '
          + 'meist nicht sofort; viele vermuten die stärkste Bremsung dort, wo der Ring quer zum '
          + 'Feld steht und der Fluss am größten ist. Entscheidend ist aber nicht der Fluss, '
          + 'sondern seine <b>Änderungsrate</b>.'
        : 'Steht die Ringebene <b>quer</b> zum Feld, ist der Fluss zwar maximal, ändert sich aber '
          + 'gerade kaum – die Bremsung ist dort am kleinsten. Der Ring nimmt wieder Fahrt auf.'}
      Und zur naheliegenden Frage, ob ein sehr starker Magnet den Ring ganz zum Stillstand bringen
      könnte: nein. Das Bremsmoment ist der Drehgeschwindigkeit proportional und verschwindet mit
      ihr. Der Ring kommt beliebig nah an den Stillstand heran, erreicht ihn aber nie.</div>`;
}

// ── Station 5: Wechselfeld ─────────────────────────────
function _thrSetUac(v) {
  _thr.uAc = Math.max(0, Math.min(30, +v));
  const sl = document.getElementById('thrUac'); if (sl) sl.value = String(_thr.uAc);
  const el = document.getElementById('thrUacLbl'); if (el) el.textContent = _fpmNum(_thr.uAc, 1) + ' V';
  _thrRenderSchweb();
}
function _thrDruecken() {
  _thr.gedrueckt = !_thr.gedrueckt;
  const b = document.getElementById('thrDrueckBtn');
  if (b) b.textContent = _thr.gedrueckt ? '☝ Ring loslassen' : '👇 Ring hinunterdrücken';
  _thrRenderSchweb();
}
function _thrKanone() {
  _thr.kanone = true; _thr.kanoneT = 0;
  if (_thr.uAc < 12) _thrSetUac(20);
  _thrRenderSchweb();
}
// Hoehe, in der sich der Ring gerade befindet
function _thrHoehe() {
  const frei = _thrSchwebeHoehe(_thr.uAc);
  return _thr.gedrueckt ? Math.min(frei, 0.01) : frei;
}
function _thrRenderSchweb() {
  const el = document.getElementById('thrSchwebRechnung'); if (!el) return;
  const U = _thr.uAc, h = _thrHoehe();
  const F = _thrACKraft(U, h), G = _thrGewicht(), P = _thrACLeistung(U, h);
  const schwebt = _thrSchwebtBei(U);
  el.innerHTML = `
    <div class="pho-rz"><span class="pho-rz-t">Gewichtskraft des Rings</span>
      <span class="pho-rz-f">F<sub>G</sub> = m · g</span>
      <span class="pho-rz-v">${_fpmNum(G * 1000, 1)} mN</span></div>
    <div class="pho-rz"><span class="pho-rz-t">mittlere Kraft nach oben</span>
      <span class="pho-rz-f">F ∝ U² · e<sup>−2h/λ</sup></span>
      <span class="pho-rz-v">${_fpmNum(F * 1000, 1)} mN</span></div>
    <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">${schwebt ? 'Schwebehöhe' : 'Der Ring bleibt liegen'}</span>
      <span class="pho-rz-f">dort ist F = F<sub>G</sub></span>
      <span class="pho-rz-v">${schwebt ? _fpmNum(h * 100, 1) + ' cm' : '—'}</span></div>
    <div class="pho-rz"><span class="pho-rz-t">im Ring umgesetzte Leistung</span>
      <span class="pho-rz-f">P = I² · R</span>
      <span class="pho-rz-v">${_fpmNum(P, 2)} W</span></div>
    <div class="fpm-note">Die ausführliche Begründung des Schwebens ist – wie die Handreichung
      ausdrücklich anmerkt – <b>sehr anspruchsvoll</b>. Sie braucht die Selbstinduktion des Rings:
      Erst dadurch eilt der Ringstrom dem Feld nicht um genau eine Viertelperiode nach, und erst
      dann bleibt im zeitlichen Mittel überhaupt eine Kraft übrig. Hier ist nur das Ergebnis
      nachgebildet, nicht die Herleitung.</div>`;

  const w = document.getElementById('thrWaerme');
  if (w) {
    if (!schwebt) {
      w.className = 'lsk-zustand';
      w.innerHTML = 'Die Spannung reicht noch nicht aus, um das Gewicht des Rings zu tragen. '
        + 'Erhöhe sie behutsam.';
    } else if (_thr.gedrueckt) {
      const Pf = _thrACLeistung(U, _thrSchwebeHoehe(U));
      w.className = 'lsk-zustand no';
      w.innerHTML = '<b>Vorsicht, der Ring wird schnell heiß.</b> Hinuntergedrückt sitzt er im '
        + 'stärkeren Feld: Der Ringstrom steigt, und mit ihm die Verlustleistung – hier auf '
        + _fpmNum(P / Math.max(1e-9, Pf), 1) + '-fache gegenüber der freien Schwebelage. '
        + '<b>Bemerkenswert ist die Kehrseite:</b> In der <i>freien</i> Schwebelage ist die '
        + 'Leistung immer dieselbe, ganz gleich wie hoch der Ring schwebt. Denn dort hält die '
        + 'Kraft gerade das Gewicht – und Kraft und Verlustleistung hängen von derselben Größe ab. '
        + 'Nur das Hinunterdrücken bricht dieses Gleichgewicht auf.';
    } else {
      w.className = 'lsk-zustand ok';
      w.innerHTML = '<b>Der Ring schwebt bei ' + _fpmNum(h * 100, 1) + ' cm.</b> '
        + 'Erhöht man die Spannung, steigt er höher, bis Kraft und Gewicht wieder im Gleichgewicht '
        + 'sind. Er wird dabei warm – die im Ring umgesetzte Leistung von '
        + _fpmNum(P, 2) + ' W wird vollständig in Wärme verwandelt. Drücke ihn einmal hinunter '
        + 'und beobachte, was mit der Leistung passiert.';
    }
  }
}

// ── Zeichnung: Grundaufbau ─────────────────────────────
function _thrRenderAufbau(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const my = 128, SK = 700;      // Bildpunkte je Meter
  const spuleX = 96, spuleB = 74;
  const ringX = 196 + _thr.x * SK;

  // Eisenkern
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(40, my - 9, W - 76, 18);
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Eisenkern', W - 78, my + 24);

  // Feldspule
  const f = _thr.f;
  ctx.fillStyle = '#b45309';
  for (let i = 0; i < 10; i++) {
    ctx.fillRect(spuleX - spuleB / 2 + i * (spuleB / 10), my - 26, spuleB / 10 - 2, 52);
  }
  ctx.fillStyle = '#475569'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Feldspule', spuleX, my - 34);
  // Polkennzeichnung – sie aendert sich waehrend des Versuchs NIE
  if (f > 0.02) {
    ctx.fillStyle = '#dc2626'; ctx.font = '700 13px sans-serif';
    ctx.fillText('N', spuleX - spuleB / 2 - 14, my + 5);
    ctx.fillStyle = '#2563eb';
    ctx.fillText('S', spuleX + spuleB / 2 + 14, my + 5);
  }

  // Feldstaerke als Helligkeit laengs des Kerns
  if (f > 0.01) {
    for (let px = spuleX; px < W - 36; px++) {
      const x = (px - 196) / SK;
      const b = Math.exp(-Math.max(0, x) / _THR_LAMBDA) * f * Math.abs(_thrAufbauFaktor());
      if (b < 0.02) continue;
      ctx.fillStyle = 'rgba(37,99,235,' + Math.min(0.35, 0.35 * b) + ')';
      ctx.fillRect(px, my - 30, 1, 60);
    }
  }

  // Aufhaengung
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(196 - 14, 16); ctx.lineTo(ringX - 14, my - 30);
  ctx.moveTo(196 + 14, 16); ctx.lineTo(ringX + 14, my - 30);
  ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(140, 14); ctx.lineTo(260, 14); ctx.stroke();
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('bifilar aufgehängt', 264, 17);

  // Der Ring, in der Aufsicht als schmale Ellipse
  ctx.strokeStyle = _thr.geschlitzt ? '#f59e0b' : '#64748b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (_thr.geschlitzt) ctx.ellipse(ringX, my, 9, 30, 0, 0.35, 2 * Math.PI - 0.35);
  else ctx.ellipse(ringX, my, 9, 30, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = _thr.geschlitzt ? '#b45309' : '#475569';
  ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_thr.geschlitzt ? 'geschlitzter Ring' : 'Al-Ring', ringX, my + 46);

  // Ringstrom und sein Feld
  const I = _thrIRing(_thr.x, _thr.v, _thr.f, _thr.df);
  if (Math.abs(I) > 0.3) {
    ctx.fillStyle = I < 0 ? '#dc2626' : '#2563eb';
    ctx.font = '700 9px sans-serif';
    ctx.fillText(I < 0 ? 'Ringfeld ⟵ entgegen' : 'Ringfeld ⟶ gleich', ringX, my - 42);
  }

  // Kraftpfeil
  const F = _thrKraft(_thr.x, _thr.v, _thr.f, _thr.df);
  if (Math.abs(F) > 2e-4) {
    const len = Math.max(-70, Math.min(70, F * 260));
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(ringX, my); ctx.lineTo(ringX + len, my); ctx.stroke();
    ctx.fillStyle = '#16a34a';
    const sg = Math.sign(len);
    ctx.beginPath();
    ctx.moveTo(ringX + len + sg * 8, my);
    ctx.lineTo(ringX + len, my - 5); ctx.lineTo(ringX + len, my + 5);
    ctx.closePath(); ctx.fill();
    ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(F > 0 ? 'abgestoßen' : 'angezogen', ringX + len / 2, my - 10);
  }

  // Taster und Quelle
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(spuleX - spuleB / 2, my + 30); ctx.lineTo(spuleX - spuleB / 2, H - 20);
  ctx.lineTo(spuleX + spuleB / 2, H - 20); ctx.lineTo(spuleX + spuleB / 2, my + 30);
  ctx.stroke();
  ctx.fillStyle = _thr.an ? '#16a34a' : '#cbd5e1';
  ctx.fillRect(spuleX - 12, H - 27, 24, 14);
  ctx.fillStyle = '#fff'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_thr.an ? 'EIN' : 'AUS', spuleX, H - 17);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Taster · Akku', spuleX + 22, H - 16);

  // Stromanzeige
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('Spulenstrom ' + _fpmNum(f * 100, 0) + ' %', W - 10, 16);
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(W - 96, 22, 86, 7);
  ctx.fillStyle = '#b45309'; ctx.fillRect(W - 96, 22, 86 * f, 7);
  ctx.textAlign = 'left';
}

// ── Zeichnung: Spur ────────────────────────────────────
function _thrRenderSpur(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const x0 = 44, x1 = W - 12, yo = 22, yu = H - 26;
  const mitte = (yo + yu) / 2;
  const spanne = 3.0;    // dargestellte Zeitspanne in s

  ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i++) {
    const x = x0 + i / 6 * (x1 - x0);
    ctx.beginPath(); ctx.moveTo(x, yo); ctx.lineTo(x, yu); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(_fpmNum(i / 6 * spanne, 1), x, yu + 12);
  }
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0, mitte); ctx.lineTo(x1, mitte); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x0, yo); ctx.lineTo(x0, yu); ctx.stroke();

  if (!_thr.spur.length) {
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Drücke den Taster – dann wird hier aufgezeichnet.', (x0 + x1) / 2, mitte);
    ctx.textAlign = 'left';
    return;
  }
  const xmax = 0.05;      // Auslenkung in m fuer die volle Halbhoehe
  const imax = 90;        // Ringstrom in A fuer die volle Halbhoehe
  const X = t => x0 + Math.min(1, t / spanne) * (x1 - x0);

  // Ringstrom blass im Hintergrund
  ctx.strokeStyle = '#f9a8d4'; ctx.lineWidth = 1.3;
  ctx.beginPath();
  _thr.spur.forEach((p, i) => {
    const y = mitte - Math.max(-1, Math.min(1, p.i / imax)) * (mitte - yo);
    i ? ctx.lineTo(X(p.t), y) : ctx.moveTo(X(p.t), y);
  });
  ctx.stroke();
  // Auslenkung
  ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 1.8;
  ctx.beginPath();
  _thr.spur.forEach((p, i) => {
    const y = mitte - Math.max(-1, Math.min(1, p.x / xmax)) * (mitte - yo);
    i ? ctx.lineTo(X(p.t), y) : ctx.moveTo(X(p.t), y);
  });
  ctx.stroke();

  // Schaltzeitpunkte markieren
  ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
  _thr.spur.forEach((p, i) => {
    if (i && p.an !== _thr.spur[i - 1].an) {
      ctx.beginPath(); ctx.moveTo(X(p.t), yo); ctx.lineTo(X(p.t), yu); ctx.stroke();
      ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(p.an ? 'ein' : 'aus', X(p.t), yo - 4);
    }
  });
  ctx.setLineDash([]);

  ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillStyle = '#0369a1'; ctx.fillText('■ Auslenkung', x0 + 3, yo - 6);
  ctx.fillStyle = '#db2777'; ctx.fillText('■ Ringstrom', x0 + 78, yo - 6);
  ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
  ctx.fillText('t in s', x1, yu + 22);
  ctx.textAlign = 'left';
}

// ── Zeichnung: Feldrichtungen Station 2 ────────────────
function _thrRenderVorzCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const ein = _thr.vorzeichen === 'ein';
  const my = 118;

  ctx.fillStyle = '#334155'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(ein ? 'Einschalten:  Ḃ > 0,  der Fluss wächst'
                   : 'Ausschalten:  Ḃ < 0,  der Fluss schwindet', W / 2, 20);

  // Spule
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(30, my - 8, W - 60, 16);
  ctx.fillStyle = '#b45309';
  for (let i = 0; i < 8; i++) ctx.fillRect(70 + i * 9, my - 24, 6, 48);
  ctx.fillStyle = '#dc2626'; ctx.font = '700 13px sans-serif';
  ctx.fillText('N', 58, my + 5);
  ctx.fillStyle = '#2563eb'; ctx.fillText('S', 154, my + 5);
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif';
  ctx.fillText('Spule – Polung bleibt immer gleich', 106, my - 32);

  // Spulenfeld als Pfeil
  ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(200, my - 44); ctx.lineTo(300, my - 44); ctx.stroke();
  ctx.fillStyle = '#2563eb';
  ctx.beginPath(); ctx.moveTo(310, my - 44); ctx.lineTo(300, my - 49); ctx.lineTo(300, my - 39);
  ctx.closePath(); ctx.fill();
  ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('B der Spule', 200, my - 50);

  // Ring
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(300, my, 9, 30, 0, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Al-Ring', 300, my + 46);

  // Ringfeld – beim Einschalten entgegengesetzt, beim Ausschalten gleich
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2.4;
  const rx = 340, ry = my + 62;
  if (ein) {
    ctx.beginPath(); ctx.moveTo(rx + 60, ry); ctx.lineTo(rx - 30, ry); ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.moveTo(rx - 40, ry); ctx.lineTo(rx - 30, ry - 5); ctx.lineTo(rx - 30, ry + 5);
    ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath(); ctx.moveTo(rx - 30, ry); ctx.lineTo(rx + 50, ry); ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.moveTo(rx + 60, ry); ctx.lineTo(rx + 50, ry - 5); ctx.lineTo(rx + 50, ry + 5);
    ctx.closePath(); ctx.fill();
  }
  ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('B des Rings', rx + 12, ry - 10);

  // Ergebnis
  ctx.fillStyle = ein ? '#b91c1c' : '#15803d';
  ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(ein ? 'entgegengesetzt  →  Abstoßung  →  U_i = −U'
                   : 'gleichgerichtet  →  Anziehung  →  U_i = +U', W / 2, H - 22);
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif';
  ctx.fillText('In beiden Fällen: Ḃ und U_i haben entgegengesetztes Vorzeichen.', W / 2, H - 8);
  ctx.textAlign = 'left';
}

// ── Zeichnung: Stromkurve Station 3 ────────────────────
function _thrRenderStromCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const x0 = 50, x1 = W - 14, y0 = H - 36, y1 = 18;
  const L = _thr.kernAn ? _THR_L_EISEN : _THR_L_LEER;
  const spanne = _thr.kernAn ? 0.25 : 0.04;   // dargestellte Zeit in s

  ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  ctx.font = '9px sans-serif';
  for (let i = 0; i <= 5; i++) {
    const x = x0 + i / 5 * (x1 - x0);
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmNum(i / 5 * spanne * 1000, 0), x, y0 + 13);
  }
  for (let j = 0; j <= 4; j++) {
    const y = y0 - j / 4 * (y0 - y1);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(String(j * 25) + ' %', x0 - 5, y + 3);
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();

  // Die Stromkurve
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = 0; px <= x1 - x0; px++) {
    const t = px / (x1 - x0) * spanne;
    const y = y0 - _thrAnteil(t, L) * (y0 - y1);
    px ? ctx.lineTo(x0 + px, y) : ctx.moveTo(x0 + px, y);
  }
  ctx.stroke();

  // Halbwertszeit einzeichnen
  const T12 = _thrHalbwert(L);
  const xT = x0 + T12 / spanne * (x1 - x0), yT = y0 - 0.5 * (y0 - y1);
  ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(x0, yT); ctx.lineTo(xT, yT); ctx.lineTo(xT, y0);
  ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#0369a1'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('T₁ᐟ₂', xT + 4, yT - 4);

  // 95-Prozent-Marke
  const t95 = _thrZeitFuer(0.95, L);
  if (t95 < spanne) {
    const x95 = x0 + t95 / spanne * (x1 - x0), y95 = y0 - 0.95 * (y0 - y1);
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(x95, y0); ctx.lineTo(x95, y95); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#16a34a'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('95 % nach ' + _fpmNum(t95 * 1000, 0) + ' ms', x95, y95 - 6);
  }

  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('t in ms', x1, y0 + 26);
  ctx.save(); ctx.translate(14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center'; ctx.fillText('Spulenstrom', 0, 0); ctx.restore();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#b45309'; ctx.font = '9px sans-serif';
  ctx.fillText(_thr.kernAn ? 'mit Eisenkern (Abb. 3a)' : 'ohne Eisenkern (Abb. 3b)', x0 + 4, y1 + 10);
}

// ── Zeichnung: Varianten ───────────────────────────────
function _thrRenderVariante(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const my = 110;
  const a = _thr.aufbau;

  if (a === 'quer') {
    // Homogenes Querfeld: Kreuze in der Zeichenebene
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
    for (let ix = 0; ix < 10; ix++) {
      for (let iy = 0; iy < 4; iy++) {
        const x = 40 + ix * 40, y = my - 50 + iy * 34;
        if (Math.abs(x - W / 2) < 22 && Math.abs(y - my) < 40) continue;
        ctx.beginPath();
        ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4);
        ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke();
      }
    }
    ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('homogenes Feld, in die Zeichenebene hinein', 12, 16);
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(W / 2, my, 9, 32, 0, 0, 2 * Math.PI); ctx.stroke();
    ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Al-Ring', W / 2, my + 48);
    ctx.fillStyle = '#b45309'; ctx.font = '700 10px sans-serif';
    ctx.fillText('Verschieben ändert den Fluss nicht → keine Induktion, keine Bremsung', W / 2, H - 16);
    ctx.textAlign = 'left';
    return;
  }

  // Eisenkern
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(20, my - 9, W - 40, 18);

  const einzel = a === 'einzel';
  const spulen = einzel ? [{ x: 96, n: -1 }] : [{ x: 78, n: -1 }, { x: W - 78, n: (a === 'nn' ? 1 : -1) }];
  spulen.forEach(sp => {
    ctx.fillStyle = '#b45309';
    for (let i = 0; i < 8; i++) ctx.fillRect(sp.x - 36 + i * 9, my - 25, 6, 50);
    // Pole: n = -1 heisst Nordpol links
    ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('N', sp.x + sp.n * 46, my + 5);
    ctx.fillStyle = '#2563eb';
    ctx.fillText('S', sp.x - sp.n * 46, my + 5);
  });

  // Fluss laengs des Kerns andeuten
  const fak = _thrAufbauFaktor();
  ctx.strokeStyle = fak > 0.5 ? '#2563eb' : '#cbd5e1';
  ctx.lineWidth = fak > 0.5 ? 2.4 : 1.2;
  const ringX = einzel ? 200 : W / 2;
  if (a === 'nn') {
    // Fluesse treiben von beiden Seiten zur Mitte und heben sich dort auf
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(130, my - 34); ctx.lineTo(ringX - 30, my - 34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 130, my - 34); ctx.lineTo(ringX + 30, my - 34); ctx.stroke();
    ctx.fillStyle = '#dc2626'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('die Beiträge heben sich hier auf', ringX, my - 44);
  } else {
    ctx.beginPath(); ctx.moveTo(einzel ? 130 : 120, my - 34);
    ctx.lineTo(W - (einzel ? 30 : 120), my - 34); ctx.stroke();
    ctx.fillStyle = fak > 0.5 ? '#2563eb' : '#94a3b8'; ctx.font = '700 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(a === 'ns' ? 'die Beiträge addieren sich' : 'Fluss durch den Ring',
      (W) / 2, my - 44);
  }

  // Ring
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(ringX, my, 9, 30, 0, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Al-Ring', ringX, my + 46);

  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif';
  ctx.fillText('Fluss durch den Ring: ' + (fak === 0 ? 'null' : _fpmNum(fak * 100, 0) + ' % des Grundversuchs'),
    W / 2, H - 16);
  ctx.textAlign = 'left';
}

// ── Zeichnung: Ring am verdrillten Faden ───────────────
function _thrRenderDrehCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = 108;

  // Hufeisenfeld von links nach rechts
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  for (let i = -3; i <= 3; i++) {
    const y = cy + i * 16;
    ctx.beginPath(); ctx.moveTo(52, y); ctx.lineTo(W - 52, y); ctx.stroke();
  }
  ctx.fillStyle = '#dc2626'; ctx.fillRect(24, cy - 54, 24, 108);
  ctx.fillStyle = '#2563eb'; ctx.fillRect(W - 48, cy - 54, 24, 108);
  ctx.fillStyle = '#fff'; ctx.font = '700 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('N', 36, cy + 5);
  ctx.fillText('S', W - 36, cy + 5);

  // Der Ring, um die senkrechte Achse gedreht
  const phi = _thr.drehPhi;
  const breite = Math.abs(Math.cos(phi)) * 34 + 3;
  ctx.strokeStyle = _thr.geschlitzt ? '#f59e0b' : '#64748b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (_thr.geschlitzt) ctx.ellipse(cx, cy, breite, 34, 0, 0.35, 2 * Math.PI - 0.35);
  else ctx.ellipse(cx, cy, breite, 34, 0, 0, 2 * Math.PI);
  ctx.stroke();
  // Faden
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx, 12); ctx.lineTo(cx, cy - 34); ctx.stroke();

  // Bremsung anzeigen
  const s = Math.abs(Math.sin(phi));
  const brems = Math.abs(_thrDrehBrems(phi, _thr.drehW));
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(s > 0.9 ? 'Ringebene parallel zum Feld – Fläche ändert sich am schnellsten'
    : s < 0.2 ? 'Ringebene quer zum Feld – Fluss maximal, Änderung fast null'
    : 'dazwischen', cx, H - 32);

  // Bremsbalken
  const bmax = _THR_A * _THR_A * _THR_B_HUF * _THR_B_HUF * 6 / _THR_R_RING;
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(60, H - 24, W - 120, 8);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(60, H - 24, (W - 120) * Math.min(1, brems / Math.max(1e-12, bmax)), 8);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Bremsmoment', 60, H - 28);
  ctx.textAlign = 'left';
}

// ── Zeichnung: Schweben ────────────────────────────────
function _thrRenderSchwebCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, boden = H - 30, SK = 900;

  // Eisenkern senkrecht
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(cx - 9, 24, 18, boden - 24);
  // Spule unten
  ctx.fillStyle = '#b45309';
  for (let i = 0; i < 7; i++) ctx.fillRect(cx - 34, boden - 62 + i * 9, 68, 6);
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Feldspule ~', cx, boden + 14);

  const U = _thr.uAc;
  const h = _thrHoehe();
  const kanone = _thr.kanone ? Math.max(0, 0.16 - 0.6 * _thr.kanoneT * _thr.kanoneT) : 0;
  const hh = Math.max(h, kanone);
  const ry = boden - 72 - hh * SK;

  // Wechselfeld andeuten
  if (U > 0.5) {
    for (let i = 0; i < 8; i++) {
      const y = boden - 70 - i * 22;
      if (y < 24) break;
      const st = Math.exp(-(boden - 70 - y) / SK / _THR_AC_LAMBDA) * Math.min(1, U / 20);
      ctx.strokeStyle = 'rgba(220,38,38,' + Math.min(0.5, 0.5 * st) + ')';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.ellipse(cx, y, 30 + i * 3, 7, 0, 0, 2 * Math.PI); ctx.stroke();
    }
  }

  // Der Ring
  const heiss = U > 0.5 && _thrSchwebtBei(U);
  ctx.strokeStyle = _thr.gedrueckt && heiss ? '#dc2626' : heiss ? '#f59e0b' : '#64748b';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(cx, Math.min(ry, boden - 68), 32, 9, 0, 0, 2 * Math.PI); ctx.stroke();

  if (_thr.gedrueckt && heiss) {
    ctx.fillStyle = '#dc2626'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('heiß!', cx + 62, Math.min(ry, boden - 68) + 4);
  }

  // Hoehenskala
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W - 34, 24); ctx.lineTo(W - 34, boden - 68); ctx.stroke();
  ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
  for (let c = 0; c <= 14; c += 2) {
    const y = boden - 68 - c * 0.01 * SK;
    if (y < 24) break;
    ctx.beginPath(); ctx.moveTo(W - 38, y); ctx.lineTo(W - 30, y); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.fillText(c + ' cm', W - 42, y + 3);
  }

  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(U < 0.5 ? 'Wechselspannung behutsam erhöhen'
    : _thrSchwebtBei(U) ? 'Schwebehöhe ' + _fpmNum(h * 100, 1) + ' cm'
    : 'Spannung reicht noch nicht', 12, 18);
}

// ── Takt und Zeichnung ─────────────────────────────────
function _thrTakt(dt) {
  if (!_thr) return;
  const s = _thr;
  const d = Math.min(0.05, dt) / s.zeitlupe;
  // Der Ablauf wird in kleinen Schritten gerechnet, damit der schnelle
  // Feldaufbau sauber aufgeloest wird.
  const n = 40;
  for (let i = 0; i < n; i++) {
    _thrFeldSchritt(d / n);
    _thrSchrittRechnen(d / n);
  }
  if (s.jeAn || s.f > 0) {
    s.t += d;
    s.spur.push({ t: s.t, x: s.x, i: _thrIRing(s.x, s.v, s.f, s.df), an: s.an });
    if (s.spur.length > 4000) s.spur.shift();
  }
  if (s.drehLaeuft) {
    const J = _thrTraegheit();
    for (let i = 0; i < 20; i++) {
      const M = -_thrDrehBrems(s.drehPhi, s.drehW);
      s.drehW += M / J * (d / 20);
      s.drehPhi += s.drehW * (d / 20);
    }
    s.drehT += d;
  }
  if (s.kanone) { s.kanoneT += d; if (s.kanoneT > 0.55) { s.kanone = false; s.kanoneT = 0; } }
}
function _thrRender() {
  if (!_thr) return;
  const st = _thr.station;
  if (st === 0) {
    const ca = document.getElementById('thrAufbau');
    if (ca) _thrRenderAufbau(ca.getContext('2d'), ca);
    const cs = document.getElementById('thrSpur');
    if (cs) _thrRenderSpur(cs.getContext('2d'), cs);
    if (_thr.jeAn) _thrUpdate();
  } else if (st === 1) {
    const cv = document.getElementById('thrVorz');
    if (cv) _thrRenderVorzCv(cv.getContext('2d'), cv);
  } else if (st === 2) {
    const cc = document.getElementById('thrStrom');
    if (cc) _thrRenderStromCv(cc.getContext('2d'), cc);
  } else if (st === 3) {
    const cv2 = document.getElementById('thrVariante');
    if (cv2) _thrRenderVariante(cv2.getContext('2d'), cv2);
    const cd = document.getElementById('thrDreh');
    if (cd) _thrRenderDrehCv(cd.getContext('2d'), cd);
    if (_thr.drehLaeuft) _thrRenderDreh();
  } else if (st === 4) {
    const cw = document.getElementById('thrSchweb');
    if (cw) _thrRenderSchwebCv(cw.getContext('2d'), cw);
  }
}

// ── Zusätzliche Styles für den Thomsonschen Ringversuch ──
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .thr-phase { border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 9px;
      padding: 9px 11px; margin: 8px 0; }
    .thr-phase.an { border-color: #bfdbfe; background: #eff6ff; }
    .thr-phase.fertig { border-color: #bbf7d0; background: #f0fdf4; }
    .thr-phase-k { font-size: .8rem; font-weight: 800; color: #1e293b; margin-bottom: 5px; }
    .thr-phase-k span { display: block; font-size: .68rem; font-weight: 600; color: #94a3b8; }
    .thr-phase-b, .thr-phase-d { font-size: .77rem; color: #475569; line-height: 1.55; margin-top: 5px; }
    .thr-phase-b b, .thr-phase-d b:first-child { display: inline-block; font-size: .6rem;
      text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; margin-right: 5px; }
    .thr-anteile { margin: 6px 0 8px; }
    .thr-balken { display: flex; height: 9px; border-radius: 5px; overflow: hidden; background: #f1f5f9; }
    .thr-balken-z { background: #2563eb; }
    .thr-balken-o { background: #f59e0b; }
    .thr-balken-lbl { display: flex; justify-content: space-between; gap: 8px;
      font-size: .66rem; color: #64748b; margin-top: 4px; }
    .thr-pkt { display: inline-block; width: 7px; height: 7px; border-radius: 50%;
      margin-right: 4px; }
    .thr-pkt.z { background: #2563eb; }
    .thr-pkt.o { background: #f59e0b; }
    .thr-k3 { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-top: 12px; }
    .thr-vorztab { margin-top: 10px; }
    .thr-tab td.hell { background: #eff6ff; color: #1e40af; font-weight: 700; }
    .thr-lenz { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-top: 10px; }
    .thr-lenz-satz { font-size: .82rem; color: #075985; background: #f0f9ff;
      border: 1px solid #bae6fd; border-radius: 8px; padding: 9px 11px; margin: 6px 0;
      line-height: 1.6; }
    .thr-lenz-t { font-size: .78rem; color: #475569; line-height: 1.65; margin-bottom: 6px; }
    .thr-warum { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 10px 12px; }
    .thr-warum-t { font-size: .78rem; color: #475569; line-height: 1.65; margin-top: 4px; }
    .thr-zeitachse { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-top: 12px; }
    .thr-zeit-bar { display: flex; height: 26px; border-radius: 7px; overflow: hidden;
      margin: 8px 0; font-size: .64rem; font-weight: 700; }
    .thr-zeit-feld { background: #2563eb; color: #fff; display: flex; align-items: center;
      justify-content: center; white-space: nowrap; overflow: hidden; }
    .thr-zeit-ring { flex: 1 1 auto; background: #fbbf24; color: #78350f; display: flex;
      align-items: center; justify-content: center; }
    .thr-prognose { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 12px; margin-top: 8px; }
    .thr-prog-k { font-size: .62rem; text-transform: uppercase; letter-spacing: .05em;
      font-weight: 800; color: #94a3b8; margin-bottom: 4px; }
    .thr-prog-t { font-size: .78rem; color: #475569; line-height: 1.65; }
    .thr-prog-w { font-size: .76rem; color: #075985; background: #f0f9ff; border: 1px solid #bae6fd;
      border-radius: 7px; padding: 6px 9px; margin-top: 7px; }
    .thr-anw { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 12px; margin-top: 8px; min-height: 40px; }
    .thr-anw-k { font-size: .78rem; font-weight: 800; color: #334155; margin-bottom: 4px; }
    .thr-anw-t { font-size: .77rem; color: #475569; line-height: 1.65; }
    .thr-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();
// ═══════════════════════════════════════════════════════
// DIE LEITERSCHLEIFE
// Schluesselexperiment 11 der NRW-Handreichung.
// Kernkompetenz des KLP: Induktionserscheinungen an einer Leiterschleife auf
// die beiden grundlegenden Ursachen zurueckfuehren – "zeitlich veraenderliches
// Magnetfeld" und "zeitlich veraenderliche (effektive) Flaeche" (UF3, UF4).
// Dazu E2/E5 (Oszillogramme auswerten), K2 (historische Recherche) und K3.
// ═══════════════════════════════════════════════════════

const _LSF_MU0 = 4e-7 * Math.PI;

// Grundversuch: Leiterschleife auf der Rastersteckplatte, Neodym-Magnet daueber
const _LSF_M_DIPOL = 1.0;        // magnetisches Moment des Neodym-Magneten in A·m²
const _LSF_VERST   = 1e4;        // Verstaerkung des Messverstaerkers

// Quantitative Vertiefung nach der Abituraufgabe GK NRW 2013
const _LSF_N_IND   = 10;         // Windungen der kleinen Induktionsspule
const _LSF_A0      = 0.0050;     // ihre Querschnittsflaeche in m² (7 cm x 7 cm)
const _LSF_N_FELD  = 240;        // Windungen der langen Feldspule
const _LSF_B0      = 0.001;      // Scheitelwert der Feldstaerke in T
const _LSF_T       = 2.4;        // Periodendauer in s
// Oszilloskopeinstellungen aus der Handreichung
const _LSF_TDIV    = 0.5;        // s je Kaestchen
const _LSF_BDIV    = 0.5e-3;     // T je Kaestchen auf Kanal 1
const _LSF_UDIV    = 0.4;        // V je Kaestchen auf Kanal 2 (nach der Verstaerkung)
const _LSF_XDIV = 10, _LSF_YDIV = 8;

// Induktionsschlitten
const _LSF_FELDLAENGE = 0.30;    // Laenge des Feldbereichs in m
// Ausdehnung der Schleife LAENGS der Fahrtrichtung. Sie bestimmt nur, wie lange
// das Ein- und Ausfahren dauert. Fuer die Spannung zaehlt allein die Breite b
// QUER zur Fahrt – das ist die Leiterlaenge, die Feldlinien schneidet.
const _LSF_SCHLEIFE_L = 0.10;

let _lsf = null;

function _lsfInit() {
  _lsf = {
    station: 0,
    // Station 1
    teil: 'feld',            // 'feld' | 'flaeche'
    h: 0.06, hZiel: 0.06, vHand: 0,
    pendel: false, pt: 0,
    rSchleife: 0.05, rZiel: 0.05,
    umgepolt: false, laeuft: true, t: 0, zeiger: 0, spur1: [],
    // Station 2
    nWdg: 10, flA: 0.005, flAp: 0, feB: 0.001, feBp: 0,
    // Station 3
    form: 'dreieck', leseT: '', leseB: '', geprueft: null, tOszi: 0,
    // Station 4
    sB: 0.10, sb: 0.04, sv: 0.30, sx: -0.10, sLaeuft: false,
    rows: [], nextId: 1, preset: 0, fn: null, fnAuto: false, reveal: false, spurS: [],
    // Station 5
    fSchalter: false, fT: 0, fZeiger: 0, fSpur: []
  };
}

// ── Grundversuch: Fluss eines Magneten durch die Schleife ──
// Fuer einen punktfoermigen Dipol auf der Achse einer Leiterschleife vom
// Radius R gilt exakt: Φ(h) = µ₀·m·R² / (2·(R²+h²)^(3/2)).
function _lsfFluss(h, R) {
  return _LSF_MU0 * _LSF_M_DIPOL * R * R / (2 * Math.pow(R * R + h * h, 1.5));
}
// Ableitung nach der Hoehe – daraus folgt die Spannung beim Bewegen
function _lsfdFdh(h, R) {
  return -3 * _LSF_MU0 * _LSF_M_DIPOL * R * R * h / (2 * Math.pow(R * R + h * h, 2.5));
}
// Ableitung nach dem Schleifenradius – daraus folgt die Spannung beim
// Veraendern der Flaeche. Bemerkenswert ist das Vorzeichen: Der Ausdruck
// (2h² − R²) wird fuer R > h·√2 negativ. Eine Schleife, die im Vergleich zur
// Magnethoehe sehr gross ist, faengt naemlich auch schon einen Teil des
// zurueckfliessenden Feldes ein – dann nimmt der Fluss beim Vergroessern
// wieder ab. Das ist keine Modellschwaeche, sondern echte Dipolphysik.
function _lsfdFdR(h, R) {
  const s = R * R + h * h;
  return _LSF_MU0 * _LSF_M_DIPOL * R * (2 * h * h - R * R) / (2 * Math.pow(s, 2.5));
}
// Bei diesem Radius ist der Fluss am groessten
function _lsfRMax(h) { return h * Math.SQRT2; }
// Die Induktionsspannung im Grundversuch. Beide Ursachen koennen auftreten:
// der Magnet bewegt sich (dh/dt) oder die Schleife wird groesser (dR/dt).
function _lsfUGrund(h, R, dh, dR) {
  const u = -(_lsfdFdh(h, R) * dh + _lsfdFdR(h, R) * dR);
  return _lsf.umgepolt ? -u : u;
}

// ── Station 2: das Induktionsgesetz in zwei Summanden ──
// U = −n · d(A·B)/dt = −n · (Ȧ·B + A·Ḃ)
function _lsfTermFlaeche(n, Ap, B) { return -n * Ap * B; }
function _lsfTermFeld(n, A, Bp) { return -n * A * Bp; }
function _lsfUGesamt(n, A, Ap, B, Bp) {
  return _lsfTermFlaeche(n, Ap, B) + _lsfTermFeld(n, A, Bp);
}

// ── Station 3: die Abituraufgabe ───────────────────────
// B(t) nach der gewaehlten Kurvenform, Scheitelwert B0, Periodendauer T.
function _lsfBt(t) {
  const p = (t / _LSF_T) % 1;
  switch (_lsf.form) {
    case 'sinus':    return _LSF_B0 * Math.sin(2 * Math.PI * p);
    // Dreieck: die "lineare Aenderung" des ersten Versuchsteils
    case 'dreieck':  return _LSF_B0 * (p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4);
    case 'rechteck': return _LSF_B0 * (p < 0.5 ? 1 : -1);
    default:         return 0;
  }
}
// Ḃ(t) – beim Dreieck stueckweise konstant, beim Sinus wieder ein Kosinus
function _lsfBpunkt(t) {
  const p = (t / _LSF_T) % 1;
  const w = 2 * Math.PI / _LSF_T;
  switch (_lsf.form) {
    case 'sinus':   return _LSF_B0 * w * Math.cos(2 * Math.PI * p);
    case 'dreieck': return _LSF_B0 * 4 / _LSF_T * (p < 0.25 ? 1 : p < 0.75 ? -1 : 1);
    // Beim Rechteck springt B – die Aenderungsrate waere unendlich. Real
    // entstehen kurze, hohe Spitzen; hier auf einen Anzeigewert begrenzt.
    case 'rechteck': return 0;
    default: return 0;
  }
}
function _lsfUind(t) { return -_LSF_N_IND * _LSF_A0 * _lsfBpunkt(t); }
// Die Steigung der fallenden Dreiecksflanke – so rechnet die Handreichung
function _lsfFlankeSteigung() { return -2 * _LSF_B0 / (_LSF_T / 2); }
// Der Scheitelwert der Induktionsspannung beim Sinus
function _lsfUSinusScheitel() {
  return _LSF_N_IND * _LSF_A0 * _LSF_B0 * 2 * Math.PI / _LSF_T;
}
// Was auf dem Oszilloskop in Kaestchen erscheint
function _lsfBKaestchen(B) { return B / _LSF_BDIV; }
function _lsfUKaestchen(U) { return U * _LSF_VERST / _LSF_UDIV; }

// ── Station 4: Induktionsschlitten ─────────────────────
// Solange die Schleife in das Feld einfaehrt, waechst die wirksame Flaeche mit
// Ȧ = b·v; ist sie ganz drin, aendert sich nichts mehr; beim Ausfahren
// schrumpft sie wieder. Daraus U = −B·b·v, 0, +B·b·v.
function _lsfSchlittenU(x, b, v, B) {
  // x ist die Lage der VORDEREN Leiterseite, gemessen ab dem Feldanfang
  const hinten = x - _LSF_SCHLEIFE_L;
  const vornDrin = x > 0 && x < _LSF_FELDLAENGE;
  const hintenDrin = hinten > 0 && hinten < _LSF_FELDLAENGE;
  let Ap = 0;
  if (vornDrin && !hintenDrin) Ap = b * v;        // faehrt ein
  else if (!vornDrin && hintenDrin) Ap = -b * v;  // faehrt aus
  // Beide drin oder beide draussen: die wirksame Flaeche aendert sich nicht
  return -B * Ap;
}
function _lsfSchlittenUMax(b, v, B) { return B * b * v; }

// ── Station 5: Faradays Ringkern von 1831 ──────────────
// Faraday sah nur beim Ein- und Ausschalten einen Ausschlag – nie waehrend
// der Strom konstant floss. Genau das ist die Entdeckung.
const _LSF_F_TAU = 0.12;
function _lsfFaradayAusschlag(t, an, tSchalt) {
  const dt = t - tSchalt;
  if (dt < 0) return 0;
  const v = Math.exp(-dt / _LSF_F_TAU) * (1 - Math.exp(-dt / (_LSF_F_TAU / 6)));
  return (an ? 1 : -1) * v * 3.2;
}

// ── Oberfläche ─────────────────────────────────────────
function _lsfHTML() {
  const stationen = ['1 · Der Grundversuch', '2 · Die beiden Ursachen',
                     '3 · Feld ändern – gemessen', '4 · Fläche ändern – gemessen',
                     '5 · Faraday 1831']
    .map((s, i) => `<button class="fpm-tab${i === _lsf.station ? ' on' : ''}" id="lsfSt${i}" onclick="_lsfSetStation(${i})">${s}</button>`).join('');

  const presets = ['v → U', 'B → U', 'b → U'].map((p, i) =>
    `<button class="fpm-tab${i === _lsf.preset ? ' on' : ''}" id="lsfTab${i}" onclick="_lsfSetPreset(${i})">${p}</button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim lsf-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">🔁 Die Leiterschleife: das Schlüsselexperiment</h3>
    <canvas id="lsfTakt" width="1" height="1" style="display:none"></canvas>
    <div class="fpm-tabs">${stationen}</div>

    <!-- ══ Station 1 ══ -->
    <div id="lsfS0">
      <div class="fpm-grid">
        <div>
          <canvas id="lsfGrund" width="440" height="270" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Leiterschleife auf der Rastersteckplatte, darüber der Neodym-Magnet</div>
          <canvas id="lsfZeiger" width="440" height="150" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Messverstärker (×${_LSF_VERST}) und Drehspulinstrument</div>
        </div>
        <div>
          <div class="fpm-tabs">
            <button class="fpm-tab on" id="lsfTeil0" onclick="_lsfSetTeil('feld')">Versuchsteil 1 · Magnet bewegen</button>
            <button class="fpm-tab" id="lsfTeil1" onclick="_lsfSetTeil('flaeche')">Versuchsteil 2 · Fläche ändern</button>
          </div>
          <div id="lsfSteuerFeld">
            <div class="phys-ctrl">
              <span class="phys-ctrl-label">Höhe des Magneten: <b id="lsfHLbl">6,0 cm</b></span>
              <input type="range" id="lsfH" min="2" max="16" step="0.1" value="6"
                oninput="_lsfSetH(this.value)" style="width:100%;accent-color:#dc2626">
            </div>
            <div class="sim-btn-row">
              <button class="sim-btn" onclick="_lsfStoss(-1)">↓ schnell annähern</button>
              <button class="sim-btn" onclick="_lsfStoss(1)">↑ schnell entfernen</button>
              <button class="sim-btn" id="lsfPendelBtn" onclick="_lsfPendel()">🪀 Federpendel</button>
            </div>
          </div>
          <div id="lsfSteuerFlaeche" style="display:none">
            <div class="phys-ctrl">
              <span class="phys-ctrl-label">Radius der Leiterschleife: <b id="lsfRLbl">5,0 cm</b></span>
              <input type="range" id="lsfR" min="1.5" max="9" step="0.1" value="5"
                oninput="_lsfSetR(this.value)" style="width:100%;accent-color:#0369a1">
            </div>
            <div class="sim-btn-row">
              <button class="sim-btn" onclick="_lsfZieh(1)">⤢ schnell vergrößern</button>
              <button class="sim-btn" onclick="_lsfZieh(-1)">⤡ schnell verkleinern</button>
            </div>
            <div class="fpm-note">Das lange Experimentierkabel wird durch die Brückenstecker der
              Rastersteckplatte geführt – so lässt sich die von der Schleife umschlossene Fläche
              leicht verändern. Der Magnet bleibt dabei in Ruhe.</div>
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_lsfUmpolen()">🔄 Magnet umdrehen</button>
          </div>
          <div class="lsf-beob" id="lsfBeob"></div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Fluss durch die Schleife</span><span class="fpm-ro-v" id="lsfPhiA">—</span><span class="fpm-ro-u">µWb</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Änderungsrate</span><span class="fpm-ro-v" id="lsfPhipA">—</span><span class="fpm-ro-u">µWb/s</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Induktionsspannung</span><span class="fpm-ro-v" id="lsfUA">—</span><span class="fpm-ro-u">µV</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Zeigerausschlag</span><span class="fpm-ro-v" id="lsfZA">—</span><span class="fpm-ro-u">Skalenteile</span></div>
          </div>
          <div class="ebr-rechnung" id="lsfGrundRechnung"></div>
        </div>
      </div>
      <div class="lsf-k3" id="lsfK3"></div>
    </div>

    <!-- ══ Station 2 ══ -->
    <div id="lsfS1" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="lsfZerlegung" width="440" height="240" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Die beiden Summanden im Vergleich</div>
          <div class="osz-gruppe">
            <div class="osz-gruppe-k">Die vier Größen frei einstellen</div>
            <div class="osz-zeile"><span>Windungen n</span>
              <input type="range" id="lsfN" min="1" max="500" step="1" value="10"
                oninput="_lsfSetZ('nWdg',this.value)"><b id="lsfNLbl">10</b></div>
            <div class="osz-zeile"><span>Fläche A</span>
              <input type="range" id="lsfA" min="0.001" max="0.02" step="0.0005" value="0.005"
                oninput="_lsfSetZ('flA',this.value)"><b id="lsfALbl">50 cm²</b></div>
            <div class="osz-zeile"><span>Ȧ</span>
              <input type="range" id="lsfAp" min="-0.02" max="0.02" step="0.0005" value="0"
                oninput="_lsfSetZ('flAp',this.value)"><b id="lsfApLbl">0</b></div>
            <div class="osz-zeile"><span>Feld B</span>
              <input type="range" id="lsfB" min="0" max="0.005" step="0.0001" value="0.001"
                oninput="_lsfSetZ('feB',this.value)"><b id="lsfBLbl">1,0 mT</b></div>
            <div class="osz-zeile"><span>Ḃ</span>
              <input type="range" id="lsfBp" min="-0.005" max="0.005" step="0.0001" value="0"
                oninput="_lsfSetZ('feBp',this.value)"><b id="lsfBpLbl">0</b></div>
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_lsfFall(1)">1. Spezialfall: A konstant</button>
            <button class="sim-btn" onclick="_lsfFall(2)">2. Spezialfall: B konstant</button>
            <button class="sim-btn" onclick="_lsfFall(0)">beides ändern</button>
          </div>
        </div>
        <div>
          <div class="lsf-gesetz" id="lsfGesetz"></div>
          <div class="ebr-rechnung" id="lsfZerlRechnung"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 3 ══ -->
    <div id="lsfS2" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="lsfOszi" width="440" height="330" class="phys-anim-cv"></canvas>
          <div class="osz-status" id="lsfOsziStatus"></div>
          <div class="fpm-label">Kanal 1: B(t) über die Hallsonde · Kanal 2: U<sub>ind</sub>(t)</div>
          <div class="fpm-tabs">
            <button class="fpm-tab on" id="lsfForm0" onclick="_lsfSetForm('dreieck')">Dreieck – lineare Änderung</button>
            <button class="fpm-tab" id="lsfForm1" onclick="_lsfSetForm('sinus')">Sinus</button>
            <button class="fpm-tab" id="lsfForm2" onclick="_lsfSetForm('rechteck')">Rechteck</button>
          </div>
          <div class="fpm-note">Aufbau nach Abbildung 3: Eine kleine Induktionsspule mit
            ${_LSF_N_IND} Windungen und ${_fpmNum(_LSF_A0 * 1e4, 0)} cm² Querschnitt ruht in einer
            langen Feldspule mit ${_LSF_N_FELD} Windungen. Diese Aufgabe stand so im
            <b>Zentralabitur 2013</b>, Grundkurs NRW.</div>
        </div>
        <div>
          <div class="fpm-label">Am Oszillogramm ablesen</div>
          <div class="osz-lese">
            <div class="osz-lese-z"><span>Periodendauer T =</span>
              <input type="text" class="fpm-input osz-inp" id="lsfLeseT" placeholder="?"
                spellcheck="false" oninput="_lsfSetLese('leseT',this.value)"><span>Kästchen</span></div>
            <div class="osz-lese-z"><span>Scheitelwert B₀ =</span>
              <input type="text" class="fpm-input osz-inp" id="lsfLeseB" placeholder="?"
                spellcheck="false" oninput="_lsfSetLese('leseB',this.value)"><span>Kästchen</span></div>
          </div>
          <div class="ebr-rechnung" id="lsfOsziRechnung"></div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_lsfPruefen()">✓ Ablesung prüfen</button>
          </div>
          <div class="lsk-zustand" id="lsfOsziPruef"></div>
          <div class="lsf-vergleich" id="lsfVergleich"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 4 ══ -->
    <div id="lsfS3" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="lsfSchlitten" width="440" height="210" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Induktionsschlitten: die Schleife wird durch das Feld gezogen</div>
          <canvas id="lsfSchlittenU" width="440" height="180" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Induktionsspannung über der Zeit</div>
          <div class="osz-gruppe">
            <div class="osz-zeile"><span>Geschwindigkeit v</span>
              <input type="range" id="lsfSv" min="0.05" max="0.8" step="0.01" value="0.3"
                oninput="_lsfSetS('sv',this.value)"><b id="lsfSvLbl">0,30 m/s</b></div>
            <div class="osz-zeile"><span>Feld B</span>
              <input type="range" id="lsfSB" min="0.02" max="0.25" step="0.005" value="0.1"
                oninput="_lsfSetS('sB',this.value)"><b id="lsfSBLbl">100 mT</b></div>
            <div class="osz-zeile"><span>Breite b</span>
              <input type="range" id="lsfSb" min="0.01" max="0.08" step="0.005" value="0.04"
                oninput="_lsfSetS('sb',this.value)"><b id="lsfSbLbl">4,0 cm</b></div>
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="lsfSchlittenBtn" onclick="_lsfSchlittenStart()">▶ Schlitten fahren lassen</button>
            <button class="sim-btn" onclick="_lsfTakeS()">✓ Messwert übernehmen</button>
            <button class="sim-btn" onclick="_lsfDemoS()">📋 Beispielmessreihe</button>
            <button class="sim-btn" onclick="_lsfClearS()">🗑 leeren</button>
          </div>
        </div>
        <div>
          <div class="ebr-rechnung" id="lsfSchlittenRechnung"></div>
          <div class="fpm-tabs" style="margin-top:8px">${presets}</div>
          <canvas id="lsfPlot" width="440" height="270" class="phys-chart-cv"></canvas>
          <div class="fpm-fit" id="lsfFitBox"></div>
          <input type="text" id="lsfFn" class="fpm-input" placeholder="z. B. 4*x" spellcheck="false"
            oninput="_lsfSetFn(this.value)" style="margin-top:8px">
          <div class="fpm-err" id="lsfFnErr"></div>
          <div class="sim-btn-row" style="padding:2px 0 4px">
            <button class="sim-btn primary" onclick="_lsfTheorieFn()">ƒ Theoriefunktion</button>
            <button class="sim-btn" onclick="_lsfClearFn()">Feld leeren</button>
          </div>
          <div class="fpm-theo" id="lsfTheo"></div>
          <label class="fpm-check"><input type="checkbox" onchange="_lsfSet('reveal',this.checked)">
            Sollwert anzeigen</label>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>Nr.</th><th>v (m/s)</th><th>B (mT)</th><th>b (cm)</th><th>U (mV)</th><th></th></tr></thead>
              <tbody id="lsfTbody"></tbody>
            </table>
            <div class="fpm-empty" id="lsfEmpty">Noch keine Messwerte.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Station 5 ══ -->
    <div id="lsfS4" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="lsfFaraday" width="440" height="290" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Faradays Ringkernanordnung von 1831</div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="lsfFSchalterBtn" onclick="_lsfFSchalter()">⏻ Strom einschalten</button>
          </div>
          <div class="lsf-beob" id="lsfFBeob"></div>
        </div>
        <div>
          <div class="lsf-hist" id="lsfHist"></div>
        </div>
      </div>
    </div>

    <div id="lsfErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>Φ = A · B</b> &nbsp;|&nbsp; <b>U<sub>ind</sub> = −n · Φ̇ = −n · (Ȧ·B + A·Ḃ)</b>
      &nbsp;|&nbsp; A konstant: <b>U = −n·A·Ḃ</b> &nbsp;|&nbsp; B konstant: <b>U = −n·Ȧ·B</b>
    </p>
  </div>`;
}

function _lsfErklHTML() {
  return `<div class="dsp-erkl-kopf">Zwei Ursachen – mehr gibt es nicht</div>
    <div class="dsp-erkl-text">
      Der ganze Sinn dieses Versuchs steckt in einem einzigen Satz des Kernlehrplans: Man soll
      Induktionserscheinungen an einer Leiterschleife auf die <b>beiden grundlegenden Ursachen</b>
      zurückführen können – ein <b>zeitlich veränderliches Magnetfeld</b> oder eine <b>zeitlich
      veränderliche wirksame Fläche</b>. Alles, was danach kommt – Transformator, Generator,
      Wirbelströme –, ist eine dieser beiden Ursachen oder eine Kombination aus beiden. Wer hier
      sauber unterscheiden kann, muss sich später kein einziges neues Gesetz merken.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum genau zwei</div>
    <div class="dsp-erkl-text">
      Der magnetische Fluss ist das Produkt Φ = A · B. Ein Produkt kann sich nur ändern, wenn sich
      einer seiner beiden Faktoren ändert – oder beide. Genau das steht in der Produktregel:
      U<sub>ind</sub> = −n · Φ̇ = −n · (Ȧ·B + A·Ḃ). Der erste Summand ist die Flächenänderung, der
      zweite die Feldänderung. Setzt man einen von beiden null, bleiben die zwei Spezialfälle
      übrig, um die es in diesem Versuch geht. Der Kernlehrplan verlangt den Begriff des
      magnetischen Flusses im Grundkurs übrigens gar nicht mehr – die beiden Spezialfälle genügen.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Was man im Grundversuch sieht</div>
    <div class="dsp-erkl-text">
      Im <b>ersten Teil</b> liegt die Leiterschleife still, ein starker Magnet wird darüber bewegt.
      Ergebnis: Eine Spannung entsteht <i>nur während der Bewegung</i>. Hält man den Magneten an –
      egal ob nah oder fern –, zeigt das Instrument null, obwohl ein kräftiges Feld vorhanden ist.
      Und die Polung kehrt sich um, je nachdem ob man sich nähert oder entfernt.
      Im <b>zweiten Teil</b> bleibt der Magnet in Ruhe, und stattdessen wird die von der Schleife
      umschlossene Fläche verändert. Auch hier: Spannung nur während der Änderung, und die Polung
      hängt davon ab, ob die Fläche wächst oder schrumpft. Beide Male gilt dieselbe Aussage –
      <b>nicht der Zustand zählt, sondern seine Änderung</b>.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Die wirksame Fläche</div>
    <div class="dsp-erkl-text">
      Wichtig ist das Wort <b>wirksam</b>. Gemeint ist nicht die Fläche der Schleife schlechthin,
      sondern derjenige Anteil, der vom Feld auch tatsächlich senkrecht durchsetzt wird. Kippt man
      eine Schleife im Feld, ohne ihre Größe zu ändern, so ändert sich trotzdem die wirksame Fläche
      – und es wird induziert. Genau darauf beruht der Generator.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Faraday, 1831</b></div>
    <div class="dsp-erkl-text">
      Entdeckt hat das <b>Michael Faraday</b> im Jahr 1831 mit einer Ringkernanordnung: zwei
      Spulen auf demselben Eisenring, die eine an einer Batterie, die andere an einem
      Galvanometer. Faraday erwartete, dass ein <i>fließender</i> Strom in der ersten Spule auch in
      der zweiten einen Strom hervorruft – und war zunächst enttäuscht, denn nichts geschah.
      Der Zeiger schlug nur im <b>Augenblick des Ein- und Ausschaltens</b> aus, und zwar in
      entgegengesetzte Richtungen. Diese scheinbare Fehlanzeige war die Entdeckung. Bemerkenswert:
      Faraday hat bei all seinen Untersuchungen zur Induktion <b>keine einzige Formel</b>
      hergeleitet oder aufgeschrieben. Die mathematische Fassung kam erst später durch Maxwell.
      Ohne diese Entdeckung gäbe es weder Generatoren noch Transformatoren – und damit keine
      elektrische Energieversorgung.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Vom Versuch zur Maxwell-Gleichung</div>
    <div class="dsp-erkl-text">
      In ihrer allgemeinsten Form steht die Aussage dieses Versuchs als <b>zweite
      Maxwell-Gleichung</b> da: ∇ × E = −∂B/∂t. Sie besagt, dass ein sich zeitlich änderndes
      Magnetfeld ein elektrisches Wirbelfeld erzeugt – ganz ohne Leiterschleife, die Schleife macht
      es nur sichtbar. Der Formalismus übersteigt das Schulniveau deutlich, aber es lohnt zu
      wissen, dass die schlichte Beobachtung „Zeiger schlägt nur beim Bewegen aus" und eine der
      berühmtesten Gleichungen der Physik dieselbe Sache sind.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Größenordnungen</div>
    <div class="dsp-erkl-text">
      Die Spannungen sind klein. Bewegt man einen Neodym-Magneten von Hand über eine Leiterschleife,
      entstehen einige <b>Mikrovolt bis Millivolt</b> – deshalb braucht der Grundversuch einen
      Messverstärker vor dem Drehspulinstrument. Auch in der quantitativen Vertiefung liegen die
      Werte bei etwa 0,1 mV und werden zehntausendfach verstärkt, bevor sie ans Oszilloskop gehen.
      Wer eine abgelesene Spannung nicht durch die Verstärkung teilt, liegt um vier Zehnerpotenzen
      daneben.
    </div>
    <div class="dsp-erkl-warn">⚠ Neodym-Magnete haben eine sehr starke Anziehungskraft. Finger oder
      Haut können zwischen zwei Magneten oder zwischen Magnet und Massestück eingeklemmt werden –
      das führt zu Quetschungen und Blutergüssen.</div>`;
}

// ── Stationen ──────────────────────────────────────────
function _lsfSetStation(i) {
  _lsf.station = i;
  for (let k = 0; k < 5; k++) {
    document.getElementById('lsfSt' + k)?.classList.toggle('on', k === i);
    const d = document.getElementById('lsfS' + k);
    if (d) d.style.display = k === i ? 'block' : 'none';
  }
  _lsfUpdate();
  if (i === 3) _lsfDrawPlot();
}
function _lsfSet(key, val) { _lsf[key] = val; _lsfDrawPlot(); }

// ── Station 1 ──────────────────────────────────────────
function _lsfSetTeil(t) {
  _lsf.teil = t;
  document.getElementById('lsfTeil0')?.classList.toggle('on', t === 'feld');
  document.getElementById('lsfTeil1')?.classList.toggle('on', t === 'flaeche');
  const a = document.getElementById('lsfSteuerFeld');
  const b = document.getElementById('lsfSteuerFlaeche');
  if (a) a.style.display = t === 'feld' ? 'block' : 'none';
  if (b) b.style.display = t === 'flaeche' ? 'block' : 'none';
  _lsf.pendel = false;
  const pb = document.getElementById('lsfPendelBtn');
  if (pb) pb.textContent = '🪀 Federpendel';
  _lsfUpdate();
}
function _lsfSetH(v) {
  _lsf.hZiel = Math.max(0.02, Math.min(0.16, +v / 100));
  _lsf.pendel = false;
  const el = document.getElementById('lsfHLbl');
  if (el) el.textContent = _fpmNum(_lsf.hZiel * 100, 1) + ' cm';
  _lsfUpdate();
}
function _lsfSetR(v) {
  _lsf.rZiel = Math.max(0.015, Math.min(0.09, +v / 100));
  const el = document.getElementById('lsfRLbl');
  if (el) el.textContent = _fpmNum(_lsf.rZiel * 100, 1) + ' cm';
  _lsfUpdate();
}
// Eine rasche Handbewegung – so wie es die Handreichung im Schuelerversuch vorsieht
function _lsfStoss(richtung) {
  _lsf.pendel = false;
  _lsf.hZiel = richtung > 0 ? 0.16 : 0.025;
  const sl = document.getElementById('lsfH'); if (sl) sl.value = String(_lsf.hZiel * 100);
  const el = document.getElementById('lsfHLbl');
  if (el) el.textContent = _fpmNum(_lsf.hZiel * 100, 1) + ' cm';
}
function _lsfZieh(richtung) {
  _lsf.rZiel = richtung > 0 ? 0.09 : 0.015;
  const sl = document.getElementById('lsfR'); if (sl) sl.value = String(_lsf.rZiel * 100);
  const el = document.getElementById('lsfRLbl');
  if (el) el.textContent = _fpmNum(_lsf.rZiel * 100, 1) + ' cm';
}
function _lsfPendel() {
  _lsf.pendel = !_lsf.pendel;
  if (_lsf.pendel) _lsf.pt = 0;
  const b = document.getElementById('lsfPendelBtn');
  if (b) b.textContent = _lsf.pendel ? '⏸ Pendel anhalten' : '🪀 Federpendel';
}
function _lsfUmpolen() { _lsf.umgepolt = !_lsf.umgepolt; _lsfUpdate(); }

function _lsfUpdate() {
  if (!_lsf) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const s = _lsf;
  const dh = s.vHand, dR = s.dR || 0;
  const phi = _lsfFluss(s.h, s.rSchleife);
  const phip = _lsfdFdh(s.h, s.rSchleife) * dh + _lsfdFdR(s.h, s.rSchleife) * dR;
  const U = _lsfUGrund(s.h, s.rSchleife, dh, dR);
  set('lsfPhiA', _fpmNum(phi * 1e6, 3));
  set('lsfPhipA', _fpmNum(phip * 1e6, 2));
  set('lsfUA', _fpmNum(U * 1e6, 1));
  set('lsfZA', _fpmNum(s.zeiger, 2));
  set('lsfHLbl', _fpmNum(s.hZiel * 100, 1) + ' cm');
  set('lsfRLbl', _fpmNum(s.rZiel * 100, 1) + ' cm');

  const b = document.getElementById('lsfBeob');
  if (b) {
    const bewegt = Math.abs(dh) > 1e-4 || Math.abs(dR) > 1e-4;
    if (!bewegt) {
      b.className = 'lsf-beob still';
      b.innerHTML = '<b>Nichts bewegt sich – der Zeiger steht auf null.</b> '
        + (s.teil === 'feld'
          ? 'Und zwar unabhängig davon, wie nah der Magnet ist. Das Feld allein bewirkt nichts, '
            + 'auch ein sehr starkes nicht. Nur seine <b>Änderung</b> zählt.'
          : 'Auch eine große Schleife im Feld erzeugt für sich genommen keine Spannung. Nur die '
            + '<b>Änderung</b> der wirksamen Fläche zählt.');
    } else {
      // Nicht annehmen, sondern an der tatsaechlichen Aenderungsrate ablesen
      const rein = phip > 0;
      b.className = 'lsf-beob ' + (U > 0 ? 'plus' : 'minus');
      b.innerHTML = '<b>' + (s.teil === 'feld'
        ? (dh < 0 ? 'Der Magnet nähert sich' : 'Der Magnet entfernt sich')
        : (dR > 0 ? 'Die Fläche wird größer' : 'Die Fläche wird kleiner'))
        + '.</b> Der Fluss ' + (rein ? 'nimmt zu' : 'nimmt ab')
        + ', der Zeiger schlägt nach <b>' + (U > 0 ? 'rechts' : 'links') + '</b> aus. '
        + 'Kehrt man die Bewegungsrichtung um, kehrt sich auch der Ausschlag um.'
        + (s.teil === 'flaeche' && s.rSchleife > _lsfRMax(s.h)
          ? '<div class="lsf-fein">Achtung, hier wird es fein: Die Schleife ist mit '
            + _fpmNum(s.rSchleife * 100, 1) + ' cm bereits <b>größer</b> als der Radius '
            + _fpmNum(_lsfRMax(s.h) * 100, 1) + ' cm, bei dem der Fluss am größten ist. '
            + 'Vergrößert man sie noch weiter, nimmt der Fluss wieder <b>ab</b> – eine so große '
            + 'Schleife fängt nämlich auch schon einen Teil des zurücklaufenden Feldes ein, das '
            + 'in die Gegenrichtung zeigt. Der Ausschlag kehrt sich deshalb um. Für den '
            + 'Grundversuch hält man die Schleife am besten kleiner als '
            + _fpmNum(_lsfRMax(s.h) * 100, 1) + ' cm.</div>'
          : '');
    }
  }

  const r = document.getElementById('lsfGrundRechnung');
  if (r) {
    r.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">Fluss des Magneten durch die Schleife</span>
        <span class="pho-rz-f">Φ = µ₀·m·R² / (2·(R²+h²)<sup>3/2</sup>)</span>
        <span class="pho-rz-v">${_fpmNum(phi * 1e6, 3)} µWb</span></div>
      <div class="pho-rz"><span class="pho-rz-t">${s.teil === 'feld'
        ? 'Änderung durch die Bewegung des Magneten' : 'Änderung durch die Flächenänderung'}</span>
        <span class="pho-rz-f">Φ̇</span>
        <span class="pho-rz-v">${_fpmNum(phip * 1e6, 2)} µWb/s</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Induktionsspannung</span>
        <span class="pho-rz-f">U<sub>ind</sub> = −Φ̇</span>
        <span class="pho-rz-v">${_fpmNum(U * 1e6, 1)} µV</span></div>
      <div class="fpm-note">Die Spannung liegt im Bereich von Mikrovolt – ohne den
        Messverstärker mit dem Faktor ${_LSF_VERST} würde das Drehspulinstrument nichts anzeigen.
        Der Magnet ist hier als punktförmiger Dipol mit dem Moment
        ${_fpmNum(_LSF_M_DIPOL, 1)} A·m² gerechnet.</div>`;
  }

  _lsfRenderK3();
  _lsfRenderZerlegung();
  _lsfRenderOszi();
  _lsfRenderSchlitten();
  _lsfRenderHist();
}

function _lsfRenderK3() {
  const el = document.getElementById('lsfK3'); if (!el) return;
  el.innerHTML = `
    <div class="git-sch-kopf">So erklärst du diesen Versuch jemandem anderen</div>
    <div class="lsk-k3-grid">
      <div class="lsk-k3-teil"><span>Zielsetzung</span>
        Wir wollen zeigen, dass es genau <b>zwei</b> Wege gibt, eine Spannung zu induzieren – und
        dass beide dasselbe gemeinsam haben.</div>
      <div class="lsk-k3-teil"><span>Aufbau</span>
        Eine Leiterschleife aus Experimentierkabel auf einer Rastersteckplatte, darüber ein
        Neodym-Magnet an einer Feder. Die Schleife führt über einen Messverstärker an ein
        Drehspulinstrument.</div>
      <div class="lsk-k3-teil"><span>Durchführung</span>
        Erst den Magneten bei fester Schleife bewegen, dann bei ruhendem Magneten die Schleife
        vergrößern und verkleinern.</div>
      <div class="lsk-k3-teil"><span>Ergebnis</span>
        Beide Male schlägt der Zeiger nur <b>während</b> der Änderung aus, und die Richtung des
        Ausschlags kehrt sich um, wenn man die Änderung umkehrt. Steht alles still, zeigt das
        Instrument null – auch bei starkem Feld und großer Fläche.</div>
      <div class="lsk-k3-teil"><span>Deutung</span>
        Der Fluss Φ = A·B kann sich nur ändern, wenn sich A oder B ändert. Deshalb gibt es genau
        zwei Ursachen – und in beiden Fällen gilt <b>U = −n·Φ̇</b>.</div>
    </div>`;
}

// ── Station 2 ──────────────────────────────────────────
function _lsfSetZ(feld, v) {
  const gr = { nWdg: [1, 500], flA: [0.001, 0.02], flAp: [-0.02, 0.02],
               feB: [0, 0.005], feBp: [-0.005, 0.005] };
  _lsf[feld] = Math.max(gr[feld][0], Math.min(gr[feld][1], +v));
  _lsfRenderZerlegung();
}
function _lsfFall(nr) {
  if (nr === 1) { _lsf.flAp = 0; _lsf.feBp = 0.002; }
  else if (nr === 2) { _lsf.feBp = 0; _lsf.flAp = 0.008; }
  else { _lsf.flAp = 0.008; _lsf.feBp = 0.002; }
  ['flAp', 'feBp'].forEach(function (f) {
    const sl = document.getElementById(f === 'flAp' ? 'lsfAp' : 'lsfBp');
    if (sl) sl.value = String(_lsf[f]);
  });
  _lsfRenderZerlegung();
}
function _lsfRenderZerlegung() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const s = _lsf;
  set('lsfNLbl', String(Math.round(s.nWdg)));
  set('lsfALbl', _fpmNum(s.flA * 1e4, 0) + ' cm²');
  set('lsfApLbl', _fpmNum(s.flAp * 1e4, 0) + ' cm²/s');
  set('lsfBLbl', _fpmNum(s.feB * 1000, 2) + ' mT');
  set('lsfBpLbl', _fpmNum(s.feBp * 1000, 2) + ' mT/s');

  const tA = _lsfTermFlaeche(s.nWdg, s.flAp, s.feB);
  const tB = _lsfTermFeld(s.nWdg, s.flA, s.feBp);
  const g = document.getElementById('lsfGesetz');
  if (g) {
    const nurA = Math.abs(s.feBp) < 1e-9, nurB = Math.abs(s.flAp) < 1e-9;
    g.innerHTML = `<div class="git-sch-kopf">Das Induktionsgesetz und seine zwei Spezialfälle</div>
      <div class="lsf-formel">U<sub>ind</sub> = −n · Φ̇ = −n · (A·B)˙ = −n · ( Ȧ·B + A·Ḃ )</div>
      <div class="lsf-faelle">
        <div class="lsf-fall${nurB && !nurA ? ' an' : ''}">
          <span>1. Spezialfall</span>
          <b>A konstant ⇒ Ȧ = 0</b>
          <div>U<sub>ind</sub> = −n · A · Ḃ</div>
          Durch eine zeitliche Veränderung der <b>Feldstärke</b> wird eine Spannung induziert.
          Das ist der erste Versuchsteil: Der Magnet bewegt sich, die Schleife bleibt.
        </div>
        <div class="lsf-fall${nurA && !nurB ? ' an' : ''}">
          <span>2. Spezialfall</span>
          <b>B konstant ⇒ Ḃ = 0</b>
          <div>U<sub>ind</sub> = −n · Ȧ · B</div>
          Durch eine zeitliche Veränderung der <b>wirksamen Fläche</b> wird eine Spannung
          induziert. Das ist der zweite Versuchsteil: Der Magnet ruht, die Schleife ändert sich.
        </div>
      </div>
      <div class="fpm-note">Beide Fälle folgen aus der Produktregel. Ein Produkt ändert sich genau
        dann, wenn sich einer seiner Faktoren ändert – deshalb gibt es <b>genau zwei</b> Ursachen
        und keine dritte. Ändern sich beide gleichzeitig, addieren sich die Beiträge; sie können
        sich dabei sogar gegenseitig aufheben.</div>`;
  }
  const r = document.getElementById('lsfZerlRechnung');
  if (r) {
    const ges = tA + tB;
    r.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">Beitrag der Flächenänderung</span>
        <span class="pho-rz-f">−n · Ȧ · B</span>
        <span class="pho-rz-v">${_fpmNum(tA * 1e6, 2)} µV</span></div>
      <div class="pho-rz"><span class="pho-rz-t">Beitrag der Feldänderung</span>
        <span class="pho-rz-f">−n · A · Ḃ</span>
        <span class="pho-rz-v">${_fpmNum(tB * 1e6, 2)} µV</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Induktionsspannung insgesamt</span>
        <span class="pho-rz-f">U<sub>ind</sub></span>
        <span class="pho-rz-v">${_fpmNum(ges * 1e6, 2)} µV</span></div>
      ${Math.abs(ges) < 1e-9 && (Math.abs(tA) > 1e-9)
        ? '<div class="fpm-note">Beide Beiträge sind gerade entgegengesetzt gleich groß und heben '
          + 'sich auf. Der Fluss bleibt konstant, obwohl sich sowohl Fläche als auch Feld ändern – '
          + 'und deshalb wird <b>nichts</b> induziert. Ein schönes Beispiel dafür, dass es wirklich '
          + 'nur auf Φ̇ ankommt.</div>' : ''}`;
  }
}

// ── Station 3: die Abituraufgabe ───────────────────────
function _lsfSetForm(f) {
  _lsf.form = f;
  ['dreieck', 'sinus', 'rechteck'].forEach((k, i) =>
    document.getElementById('lsfForm' + i)?.classList.toggle('on', k === f));
  _lsf.geprueft = null;
  _lsfRenderOszi();
}
function _lsfSetLese(feld, v) { _lsf[feld] = v; _lsfRenderOszi(); }
function _lsfLeseAus() {
  const dt = parseFloat(String(_lsf.leseT).replace(',', '.'));
  const db = parseFloat(String(_lsf.leseB).replace(',', '.'));
  const r = {};
  if (isFinite(dt) && dt > 0) r.T = dt * _LSF_TDIV;
  if (isFinite(db) && db > 0) r.B0 = db * _LSF_BDIV;
  if (r.T !== undefined && r.B0 !== undefined) {
    // Die Steigung der fallenden Dreiecksflanke
    r.Bp = -2 * r.B0 / (r.T / 2);
    r.U = -_LSF_N_IND * _LSF_A0 * r.Bp;
    r.USinus = _LSF_N_IND * _LSF_A0 * r.B0 * 2 * Math.PI / r.T;
  }
  return r;
}
function _lsfPruefen() {
  const r = _lsfLeseAus();
  _lsf.geprueft = {
    gT: r.T !== undefined ? Math.abs(r.T - _LSF_T) / _LSF_T * 100 : null,
    gB: r.B0 !== undefined ? Math.abs(r.B0 - _LSF_B0) / _LSF_B0 * 100 : null
  };
  _lsfRenderOszi();
}
function _lsfRenderOszi() {
  const st = document.getElementById('lsfOsziStatus');
  if (st) {
    st.innerHTML = `<span class="osz-st-k">Zeit</span><b>${_fpmNum(_LSF_TDIV, 1)} s/Kästchen</b>
      <span class="osz-st-k">CH1</span><b style="color:#facc15">${_fpmNum(_LSF_BDIV * 1000, 1)} mT/Kästchen</b>
      <span class="osz-st-k">CH2</span><b style="color:#38bdf8">${_fpmNum(_LSF_UDIV, 1)} V/Kästchen · ×${_LSF_VERST}</b>`;
  }
  const el = document.getElementById('lsfOsziRechnung');
  if (el) {
    const r = _lsfLeseAus();
    if (r.T === undefined && r.B0 === undefined) {
      el.innerHTML = '<div class="fpm-note">Lies am Oszillogramm ab, über wie viele Kästchen sich '
        + 'eine <b>volle Periode</b> erstreckt und wie viele Kästchen der <b>Scheitelwert</b> von '
        + 'B beträgt. Daraus lässt sich die Induktionsspannung vorhersagen – und mit der '
        + 'gemessenen Kurve auf Kanal 2 vergleichen.</div>';
    } else {
      let h = '';
      if (r.T !== undefined) h += `<div class="pho-rz"><span class="pho-rz-t">Periodendauer</span>
        <span class="pho-rz-f">T = n · ${_fpmNum(_LSF_TDIV, 1)} s/Kästchen</span>
        <span class="pho-rz-v">${_fpmNum(r.T, 2)} s</span></div>`;
      if (r.B0 !== undefined) h += `<div class="pho-rz"><span class="pho-rz-t">Scheitelwert des Feldes</span>
        <span class="pho-rz-f">B₀ = n · ${_fpmNum(_LSF_BDIV * 1000, 1)} mT/Kästchen</span>
        <span class="pho-rz-v">${_ebrExp(r.B0, 2)} T</span></div>`;
      if (r.Bp !== undefined) {
        if (_lsf.form === 'dreieck') {
          h += `<div class="pho-rz"><span class="pho-rz-t">Steigung der fallenden Flanke</span>
            <span class="pho-rz-f">Ḃ = −2·B₀ / (T/2)</span>
            <span class="pho-rz-v">${_fpmNum(r.Bp, 5)} T/s</span></div>
            <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">daraus die Induktionsspannung</span>
            <span class="pho-rz-f">U = −n · A₀ · Ḃ</span>
            <span class="pho-rz-v">${_ebrExp(r.U, 3)} V</span></div>`;
        } else if (_lsf.form === 'sinus') {
          h += `<div class="pho-rz"><span class="pho-rz-t">Ansatz</span>
            <span class="pho-rz-f">B(t) = B₀ · sin(2π/T · t)</span><span class="pho-rz-v">—</span></div>
            <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Scheitelwert der Induktionsspannung</span>
            <span class="pho-rz-f">U₀ = n·A₀·B₀·2π/T</span>
            <span class="pho-rz-v">${_ebrExp(r.USinus, 3)} V</span></div>`;
        }
      }
      h += `<div class="fpm-note">Mit n = ${_LSF_N_IND} Windungen und
        A₀ = ${_fpmNum(_LSF_A0, 4)} m². ${_lsf.form === 'sinus'
        ? 'Aus B(t) = B₀·sin(2π/T·t) folgt Ḃ(t) = B₀·(2π/T)·cos(2π/T·t) und damit '
          + 'U(t) = −n·A₀·B₀·(2π/T)·cos(2π/T·t).'
        : _lsf.form === 'rechteck'
        ? 'Beim Rechteck springt B in praktisch null Zeit – die Änderungsrate wäre unendlich. '
          + 'Real entstehen sehr kurze, sehr hohe Spannungsspitzen. Für eine quantitative '
          + 'Auswertung taugt diese Kurvenform deshalb nicht.'
        : 'Beim Dreieck ist Ḃ abschnittsweise konstant – und damit auch die Induktionsspannung. '
          + 'Genau deshalb wählt die Handreichung diese Kurvenform für den ersten Versuchsteil.'}</div>`;
      el.innerHTML = h;
    }
  }

  const pr = document.getElementById('lsfOsziPruef');
  if (pr) {
    const g = _lsf.geprueft;
    if (!g) { pr.className = 'lsk-zustand'; pr.innerHTML = 'Trage deine Ablesung ein und prüfe sie.'; }
    else {
      const gut = (g.gT === null || g.gT < 6) && (g.gB === null || g.gB < 6) && (g.gT !== null || g.gB !== null);
      pr.className = 'lsk-zustand ' + (gut ? 'ok' : 'no');
      pr.innerHTML = (gut ? '<b>Gut abgelesen.</b> ' : '<b>Da stimmt etwas nicht.</b> ')
        + 'Sollwerte: T = ' + _fpmNum(_LSF_T, 1) + ' s (das sind '
        + _fpmNum(_LSF_T / _LSF_TDIV, 1) + ' Kästchen) und B₀ = ' + _ebrExp(_LSF_B0, 1)
        + ' T (' + _fpmNum(_LSF_B0 / _LSF_BDIV, 1) + ' Kästchen).'
        + (g.gT !== null ? ' Deine Periodendauer weicht um ' + _fpmNum(g.gT, 1) + ' % ab.' : '')
        + (g.gB !== null ? ' Dein Scheitelwert um ' + _fpmNum(g.gB, 1) + ' %.' : '');
    }
  }

  // Der Vergleich Rechnung / Messung, wie ihn die Abituraufgabe verlangt
  const v = document.getElementById('lsfVergleich');
  if (v) {
    if (_lsf.form === 'dreieck') {
      const Ber = -_LSF_N_IND * _LSF_A0 * _lsfFlankeSteigung();
      const Gem = 0.5 * 4.2 * _LSF_UDIV / _LSF_VERST;
      v.innerHTML = `<div class="git-sch-kopf">Rechnung und Messung vergleichen</div>
        <div class="lsf-verg-z"><span>berechnet</span><b>${_ebrExp(Ber, 3)} V</b>
          <i>U = −n·A₀·Ḃ mit Ḃ = ${_fpmNum(_lsfFlankeSteigung(), 5)} T/s</i></div>
        <div class="lsf-verg-z"><span>am Oszilloskop gemessen</span><b>${_ebrExp(Gem, 3)} V</b>
          <i>½ · 4,2 Kästchen · ${_fpmNum(_LSF_UDIV, 1)} V/Kästchen ÷ ${_LSF_VERST}</i></div>
        <div class="lsf-verg-z ok"><span>Unterschied</span>
          <b>${_fpmNum(Math.abs(Ber - Gem) / Gem * 100, 1)} %</b>
          <i>im Rahmen der Messgenauigkeit</i></div>
        <div class="fpm-note">Ein Hinweis zur Sorgfalt: Die Handreichung gibt den berechneten Wert
          mit 8,5 · 10⁻⁵ V an. Rechnet man exakt nach, kommt
          ${_ebrExp(Ber, 3)} V heraus – dort ist beim Runden etwas verrutscht. Die
          Übereinstimmung mit der Messung ist also sogar noch etwas <b>besser</b>, als das Handbuch
          selbst angibt.</div>`;
    } else if (_lsf.form === 'sinus') {
      const U0 = _lsfUSinusScheitel();
      v.innerHTML = `<div class="git-sch-kopf">Werte zu bestimmten Zeitpunkten</div>
        <div class="lsf-verg-z"><span>t = 0 s</span>
          <b>${_ebrExp(-U0 * Math.cos(0), 3)} V</b><i>cos(0) = 1</i></div>
        <div class="lsf-verg-z"><span>t = 1,5 s</span>
          <b>${_ebrExp(-U0 * Math.cos(2 * Math.PI / _LSF_T * 1.5), 3)} V</b>
          <i>cos(2π·1,5/2,4) = ${_fpmNum(Math.cos(2 * Math.PI / _LSF_T * 1.5), 4)}</i></div>
        <div class="fpm-note">Genau diese beiden Zeitpunkte fragt die Abituraufgabe ab. Beachte:
          Beim Sinus ist die Induktionsspannung ein <b>Kosinus</b> – sie ist am größten, wenn B
          gerade null ist und am schnellsten wächst, und null in den Scheitelpunkten von B.</div>`;
    } else {
      v.innerHTML = `<div class="git-sch-kopf">Warum das Rechteck hier nicht taugt</div>
        <div class="fpm-note">Ein Rechtecksignal springt in praktisch null Zeit. Ḃ wäre dabei
          unendlich groß, real entstehen sehr kurze und sehr hohe Spannungsspitzen, die sich weder
          sauber ablesen noch sinnvoll berechnen lassen. Für den quantitativen Teil wählt man
          deshalb Dreieck oder Sinus. Zum Zeigen des <i>Prinzips</i> ist das Rechteck aber
          durchaus eindrucksvoll – man sieht sofort, dass nur die Sprünge etwas bewirken und die
          konstanten Abschnitte gar nichts.</div>`;
    }
  }
}

// ── Station 4: Induktionsschlitten ─────────────────────
function _lsfSetS(feld, v) {
  const gr = { sv: [0.05, 0.8], sB: [0.02, 0.25], sb: [0.01, 0.08] };
  _lsf[feld] = Math.max(gr[feld][0], Math.min(gr[feld][1], +v));
  _lsfRenderSchlitten();
}
function _lsfSchlittenStart() {
  _lsf.sLaeuft = true; _lsf.sx = -_LSF_SCHLEIFE_L - 0.05; _lsf.spurS = [];
  const b = document.getElementById('lsfSchlittenBtn');
  if (b) b.textContent = '▶ noch einmal';
  _lsfRenderSchlitten();
}
function _lsfTakeS() {
  _lsf.rows.push({ id: _lsf.nextId++, v: _lsf.sv, B: _lsf.sB, b: _lsf.sb,
                   U: _lsfSchlittenUMax(_lsf.sb, _lsf.sv, _lsf.sB) });
  _lsfRenderTable(); _lsfDrawPlot();
}
function _lsfDelRowS(id) { _lsf.rows = _lsf.rows.filter(r => r.id !== id); _lsfRenderTable(); _lsfDrawPlot(); }
function _lsfClearS() {
  if (_lsf.rows.length && !confirm('Alle ' + _lsf.rows.length + ' Messwerte löschen?')) return;
  _lsf.rows = []; _lsfRenderTable(); _lsfDrawPlot();
}
function _lsfDemoS() {
  const nimm = (v, B, b) => _lsf.rows.push({ id: _lsf.nextId++, v, B, b, U: _lsfSchlittenUMax(b, v, B) });
  [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].forEach(v => nimm(v, 0.10, 0.04));
  [0.03, 0.06, 0.10, 0.15, 0.20, 0.25].forEach(B => nimm(0.30, B, 0.04));
  [0.01, 0.02, 0.03, 0.05, 0.07, 0.08].forEach(b => nimm(0.30, 0.10, b));
  _lsfRenderTable(); _lsfDrawPlot();
}
function _lsfRenderTable() {
  const tb = document.getElementById('lsfTbody'); if (!tb) return;
  const leer = document.getElementById('lsfEmpty');
  if (leer) leer.style.display = _lsf.rows.length ? 'none' : 'block';
  tb.innerHTML = _lsf.rows.map((r, i) =>
    `<tr><td>${i + 1}</td><td>${_fpmNum(r.v, 2)}</td><td>${_fpmNum(r.B * 1000, 0)}</td>
       <td>${_fpmNum(r.b * 100, 1)}</td><td><b>${_fpmNum(r.U * 1000, 3)}</b></td>
       <td class="fpm-del" onclick="_lsfDelRowS(${r.id})" title="löschen">✕</td></tr>`).join('');
}
function _lsfRenderSchlitten() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('lsfSvLbl', _fpmNum(_lsf.sv, 2) + ' m/s');
  set('lsfSBLbl', _fpmNum(_lsf.sB * 1000, 0) + ' mT');
  set('lsfSbLbl', _fpmNum(_lsf.sb * 100, 1) + ' cm');
  const el = document.getElementById('lsfSchlittenRechnung'); if (!el) return;
  const U = _lsfSchlittenUMax(_lsf.sb, _lsf.sv, _lsf.sB);
  const tEin = _LSF_SCHLEIFE_L / _lsf.sv;
  const tDrin = Math.max(0, (_LSF_FELDLAENGE - _LSF_SCHLEIFE_L) / _lsf.sv);
  el.innerHTML = `
    <div class="pho-rz"><span class="pho-rz-t">Änderung der wirksamen Fläche beim Einfahren</span>
      <span class="pho-rz-f">Ȧ = b · v</span>
      <span class="pho-rz-v">${_fpmNum(_lsf.sb * _lsf.sv * 1e4, 1)} cm²/s</span></div>
    <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Induktionsspannung</span>
      <span class="pho-rz-f">|U| = B · b · v</span>
      <span class="pho-rz-v">${_fpmNum(U * 1000, 3)} mV</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Dauer des Einfahrens</span>
      <span class="pho-rz-f">ℓ / v</span>
      <span class="pho-rz-v">${_fpmNum(tEin, 3)} s</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Dauer ganz im Feld – hier U = 0</span>
      <span class="pho-rz-f">(L − ℓ) / v</span>
      <span class="pho-rz-v">${_fpmNum(tDrin, 3)} s</span></div>
    <div class="fpm-note">Die Kurve hat drei Abschnitte: Beim <b>Einfahren</b> wächst die wirksame
      Fläche, es wird induziert. Ist die Schleife <b>ganz im Feld</b>, ändert sich nichts mehr –
      obwohl sie sich bewegt und obwohl ein starkes Feld da ist, ist U = 0. Beim <b>Ausfahren</b>
      schrumpft die Fläche wieder, die Spannung hat das umgekehrte Vorzeichen. Der mittlere
      Abschnitt ist der lehrreichste: Bewegung allein genügt nicht.</div>`;
}

const _LSF_PRESETS = [
  { xl: 'Geschwindigkeit v in m/s', yl: 'Induktionsspannung U in mV',
    x: r => r.v, y: r => r.U * 1000,
    fest: r => Math.abs(r.B - _lsf.sB) < 1e-9 && Math.abs(r.b - _lsf.sb) < 1e-9,
    k: () => _lsf.sB * _lsf.sb * 1000, ktxt: 'B · b',
    note: 'Nur Messwerte mit demselben Feld und derselben Breite gehören auf diese Gerade.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)', form: 'U = (B · b) · v',
    deutung: 'Je schneller die Schleife durch das Feld gezogen wird, desto schneller ändert sich die wirksame Fläche – und desto größer ist die Spannung. Am Induktionsschlitten stellt man die Geschwindigkeit über den Experimentiermotor ein.' },
  { xl: 'Magnetfeld B in mT', yl: 'Induktionsspannung U in mV',
    x: r => r.B * 1000, y: r => r.U * 1000,
    fest: r => Math.abs(r.v - _lsf.sv) < 1e-9 && Math.abs(r.b - _lsf.sb) < 1e-9,
    k: () => _lsf.sv * _lsf.sb, ktxt: 'b · v',
    note: 'Nur Messwerte mit derselben Geschwindigkeit und Breite gehören auf diese Gerade.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)', form: 'U = (b · v) · B',
    deutung: 'Am Induktionsschlitten lässt sich die Feldstärke über die Anzahl der eingesetzten Permanentmagnete verändern. Die Polschuhe zwischen den beiden Eisenplatten sorgen dafür, dass das Feld dabei hinreichend homogen bleibt.' },
  { xl: 'Breite der Schleife b in cm', yl: 'Induktionsspannung U in mV',
    x: r => r.b * 100, y: r => r.U * 1000,
    fest: r => Math.abs(r.v - _lsf.sv) < 1e-9 && Math.abs(r.B - _lsf.sB) < 1e-9,
    k: () => _lsf.sB * _lsf.sv * 10, ktxt: 'B · v',
    note: 'Nur Messwerte mit derselben Geschwindigkeit und demselben Feld gehören auf diese Gerade.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)', form: 'U = (B · v) · b',
    deutung: 'Auf dem Schlitten sitzen Leiterschleifen unterschiedlicher Breite – genau dafür. Wichtig ist die Breite quer zur Fahrtrichtung, denn sie bestimmt zusammen mit v, wie schnell die wirksame Fläche wächst: Ȧ = b · v.' }
];
function _lsfSetPreset(i) {
  _lsf.preset = i;
  for (let k = 0; k < 3; k++) document.getElementById('lsfTab' + k)?.classList.toggle('on', k === i);
  if (_lsf.fnAuto) _lsfTheorieFn(); else _lsfRenderTheorie(false);
  _lsfDrawPlot();
}
function _lsfTheorieFn() {
  const term = _dspZahl(_LSF_PRESETS[_lsf.preset].k()) + '*x';
  const inp = document.getElementById('lsfFn'); if (inp) inp.value = term;
  _lsfSetFn(term); _lsf.fnAuto = true; _lsfRenderTheorie(true);
}
function _lsfClearFn() {
  const inp = document.getElementById('lsfFn'); if (inp) inp.value = '';
  _lsfSetFn(''); _lsfRenderTheorie(false);
}
function _lsfRenderTheorie(eingesetzt) {
  const el = document.getElementById('lsfTheo'); if (!el) return;
  const P = _LSF_PRESETS[_lsf.preset];
  el.innerHTML = `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
    <div class="fpm-theo-typ">${P.typ}</div>
    <div class="fpm-theo-form">${P.form}</div>
    <div class="fpm-theo-par">gesucht: die Steigung ${P.ktxt}</div>
    ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${_dspZahl(P.k())}*x</div>` : ''}
    <div class="fpm-theo-deutung">${P.deutung}</div>`;
}
function _lsfSetFn(str) {
  _lsf.fnAuto = false;
  const err = document.getElementById('lsfFnErr');
  const v = (str || '').trim();
  if (!v) { _lsf.fn = null; if (err) err.textContent = ''; _lsfDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _lsf.fn = f; if (err) err.textContent = '';
  } catch (e) { _lsf.fn = null; if (err) err.textContent = e.message; }
  _lsfDrawPlot();
}
function _lsfDrawPlot() {
  const cv = document.getElementById('lsfPlot');
  if (!cv || !_lsf) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _LSF_PRESETS[_lsf.preset];
  const padL = 56, padR = 12, padT = 12, padB = 38;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const alle = _lsf.rows.map(r => ({ x: P.x(r), y: P.y(r), passt: P.fest(r) }))
    .filter(p => isFinite(p.x) && isFinite(p.y));
  const pts = alle.filter(p => p.passt);
  const xmax = Math.max(1e-9, alle.length ? Math.max(...alle.map(p => p.x)) * 1.12 : 1);
  const ymax = Math.max(1e-9, alle.length ? Math.max(...alle.map(p => p.y)) * 1.15 : 1);
  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - v / ymax * (y0 - y1);

  const xt = _fpmTicks(xmax, 5);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 13);
  });
  const yt = _fpmTicks(ymax, 4);
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 5, Y(v) + 3);
  });
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 27);
  ctx.save(); ctx.translate(13, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (!alle.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('lsfFitBox');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    return;
  }
  if (_lsf.fn) {
    ctx.strokeStyle = '#db2777'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let beg = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _lsf.fn((px - x0) / (x1 - x0) * xmax); } catch (e) { yv = NaN; }
      if (!isFinite(yv)) { beg = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { beg = false; continue; }
      beg ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), beg = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }
  let fit = null;
  if (pts.length >= 2) {
    fit = _fpmFitOrigin(pts);
    if (fit) {
      ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 1.7;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(xmax), Y(fit.k * xmax)); ctx.stroke();
    }
  }
  alle.forEach(p => {
    ctx.fillStyle = p.passt ? '#0369a1' : '#e2e8f0';
    ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), p.passt ? 4 : 3, 0, 2 * Math.PI); ctx.fill();
    if (p.passt) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke(); }
  });

  const fo = document.getElementById('lsfFitBox');
  if (fo) {
    const soll = P.k();
    if (!fit) {
      fo.innerHTML = '<div class="fpm-note">Mindestens zwei Messwerte nötig, bei denen die '
        + 'übrigen Größen <b>gleich</b> sind.<br>' + P.note + '</div>';
    } else {
      const abw = Math.abs(fit.k - soll) / Math.abs(soll) * 100;
      const cls = abw < 1 ? 'ok' : abw < 5 ? 'mid' : 'no';
      fo.innerHTML = `<div class="fpm-fitline">
        <span class="fpm-fitmeta">${pts.length} passende Messwerte${
          alle.length > pts.length ? ', ' + (alle.length - pts.length) + ' andere blass' : ''}</span>
        <span class="fpm-fiteq">y = ${_fpmNum(fit.k, 5)}·x</span>
        <span class="fpm-fitmeta">R² = ${_fpmNum(fit.r2, 5)}</span>
        <span class="fpm-fiteq" style="color:#075985">Steigung = ${P.ktxt} = ${_fpmNum(soll, 5)}</span>
        ${_lsf.reveal ? `<span class="fpm-badge ${cls}">Abweichung ${_fpmNum(abw, 2)} %</span>` : ''}
      </div><div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">${P.note}</div>`;
    }
  }
}

// ── Station 5: Faraday ─────────────────────────────────
function _lsfFSchalter() {
  _lsf.fSchalter = !_lsf.fSchalter;
  _lsf.fT = 0;
  const b = document.getElementById('lsfFSchalterBtn');
  if (b) b.textContent = _lsf.fSchalter ? '⏻ Strom ausschalten' : '⏻ Strom einschalten';
  _lsfRenderHist();
}
function _lsfRenderHist() {
  const b = document.getElementById('lsfFBeob');
  if (b) {
    const z = Math.abs(_lsf.fZeiger);
    if (z > 0.3) {
      b.className = 'lsf-beob ' + (_lsf.fZeiger > 0 ? 'plus' : 'minus');
      b.innerHTML = '<b>Der Zeiger schlägt aus – aber nur einen Augenblick lang.</b> '
        + (_lsf.fSchatterTxt || (_lsf.fSchalter
          ? 'Beim <b>Einschalten</b> wächst das Feld im Eisenring, der Fluss durch die zweite Spule nimmt zu.'
          : 'Beim <b>Ausschalten</b> bricht das Feld zusammen, der Fluss nimmt ab – der Ausschlag geht in die andere Richtung.'));
    } else if (_lsf.fSchalter) {
      b.className = 'lsf-beob still';
      b.innerHTML = '<b>Der Strom fließt, der Zeiger steht auf null.</b> Genau das hat Faraday '
        + 'zunächst enttäuscht: Ein kräftiges, aber <i>konstantes</i> Feld bewirkt in der zweiten '
        + 'Spule gar nichts. Schalte den Strom wieder aus.';
    } else {
      b.className = 'lsf-beob still';
      b.innerHTML = 'Kein Strom, kein Feld, kein Ausschlag. Schalte ein und achte genau auf den '
        + 'Zeiger – der Ausschlag dauert nur den Bruchteil einer Sekunde.';
    }
  }
  const h = document.getElementById('lsfHist');
  if (h) {
    h.innerHTML = `<div class="git-sch-kopf">Die Entdeckung vom 29. August 1831</div>
      <div class="lsf-hist-t">
        <b>Michael Faraday</b> wickelte zwei voneinander getrennte Drahtspulen auf einen
        Eisenring. Die eine verband er mit einer Batterie, die andere mit einem Galvanometer.
        Seine Erwartung: Ein Strom in der ersten Spule müsse auch in der zweiten einen Strom
        hervorrufen. Das Ergebnis war zunächst eine Enttäuschung – solange der Strom floss,
        rührte sich der Zeiger nicht.
      </div>
      <div class="lsf-hist-t" style="margin-top:6px">
        Der Zeiger schlug nur im <b>Augenblick des Einschaltens</b> aus – und beim Ausschalten
        noch einmal, in die <b>andere Richtung</b>. Was wie eine Fehlanzeige aussah, war die
        Entdeckung: Nicht das Feld erzeugt eine Spannung, sondern <b>seine Änderung</b>.
      </div>
      <div class="lsf-hist-t" style="margin-top:6px">
        Bemerkenswert ist, wie Faraday gearbeitet hat: In seinen gesamten Untersuchungen zur
        Induktion hat er <b>keine einzige Formel</b> hergeleitet oder aufgeschrieben. Er dachte in
        Bildern – die Vorstellung von <b>Feldlinien</b> geht auf ihn zurück. Die mathematische
        Fassung lieferte erst James Clerk Maxwell rund dreißig Jahre später.
      </div>
      <div class="lsf-hist-t" style="margin-top:6px">
        Die Tragweite ist schwer zu überschätzen: Ohne diese Entdeckung gäbe es keine Generatoren
        und keine Transformatoren – und damit keine elektrische Energieversorgung. Faradays
        Ringkern war zugleich der erste <b>Transformator</b> der Geschichte, auch wenn er ihn nicht
        so nannte.
      </div>
      <div class="lsf-hist-frage">
        <b>Zum Weiterdenken.</b> Faraday suchte nach einem Dauerstrom und fand einen Stromstoß.
        Wie viele Entdeckungen mögen daran gescheitert sein, dass jemand nur nach dem gesucht hat,
        was er erwartete? Der Kernlehrplan sieht hier ausdrücklich eine <b>Recherche zu
        historischen Vorstellungen und Experimenten</b> vor – Faradays Tagebücher sind dafür eine
        ergiebige Quelle, er hat sie über Jahrzehnte lückenlos geführt.
      </div>`;
  }
}

// ── Zeichnungen ────────────────────────────────────────
function _lsfRenderGrund(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f1f5f9'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, tischY = H - 54, SK = 900;

  // Rastersteckplatte mit weissem Papier
  ctx.fillStyle = '#cbd5e1'; ctx.fillRect(40, tischY, W - 80, 30);
  ctx.fillStyle = '#fff'; ctx.fillRect(48, tischY + 3, W - 96, 24);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath(); ctx.arc(60 + i * 30, tischY + 15, 2, 0, 2 * Math.PI); ctx.stroke();
  }
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Rastersteckplatte mit weißem Papier', 44, H - 8);

  // Die Leiterschleife in perspektivischer Aufsicht
  const rpx = _lsf.rSchleife * SK;
  ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(cx, tischY + 15, rpx, rpx * 0.28, 0, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#0369a1'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Leiterschleife  r = ' + _fpmNum(_lsf.rSchleife * 100, 1) + ' cm', cx, tischY - 6);

  // Der Magnet
  const my = tischY + 15 - _lsf.h * SK;
  ctx.fillStyle = _lsf.umgepolt ? '#2563eb' : '#dc2626';
  ctx.fillRect(cx - 13, my - 16, 26, 16);
  ctx.fillStyle = _lsf.umgepolt ? '#dc2626' : '#2563eb';
  ctx.fillRect(cx - 13, my, 26, 16);
  ctx.fillStyle = '#fff'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_lsf.umgepolt ? 'S' : 'N', cx, my - 4);
  ctx.fillText(_lsf.umgepolt ? 'N' : 'S', cx, my + 12);
  // Feder oder Kordel
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i <= 16; i++) {
    const y = 10 + i * (my - 26) / 16;
    i === 0 ? ctx.moveTo(cx, y) : ctx.lineTo(cx + (i % 2 ? 5 : -5), y);
  }
  ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - 40, 10); ctx.lineTo(cx + 40, 10); ctx.stroke();

  // Hoehenmass
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(cx + 40, my + 16); ctx.lineTo(W - 30, my + 16);
  ctx.moveTo(cx + rpx, tischY + 15); ctx.lineTo(W - 30, tischY + 15);
  ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = '#64748b';
  ctx.beginPath(); ctx.moveTo(W - 34, my + 16); ctx.lineTo(W - 34, tischY + 15); ctx.stroke();
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('h = ' + _fpmNum(_lsf.h * 100, 1) + ' cm', W - 38, (my + tischY) / 2);

  // Feldlinien andeuten
  ctx.strokeStyle = 'rgba(220,38,38,0.30)'; ctx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.ellipse(cx, my + 8, i * 18, i * 14, 0, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // Bewegungspfeil
  const dh = _lsf.vHand;
  if (Math.abs(dh) > 1e-4) {
    const len = Math.max(-46, Math.min(46, -dh * 130));
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(cx - 34, my); ctx.lineTo(cx - 34, my - len); ctx.stroke();
    ctx.fillStyle = '#16a34a';
    const sg = Math.sign(len);
    ctx.beginPath();
    ctx.moveTo(cx - 34, my - len - sg * 8);
    ctx.lineTo(cx - 39, my - len); ctx.lineTo(cx - 29, my - len);
    ctx.closePath(); ctx.fill();
  }
  ctx.textAlign = 'left';
}

function _lsfRenderZeigerCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  // Messverstaerker
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  ctx.fillRect(16, 44, 96, 40); ctx.strokeRect(16, 44, 96, 40);
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Messverstärker', 64, 62);
  ctx.font = '700 11px sans-serif';
  ctx.fillText('× ' + _LSF_VERST, 64, 76);
  ctx.strokeStyle = '#64748b';
  ctx.beginPath(); ctx.moveTo(112, 64); ctx.lineTo(150, 64); ctx.stroke();

  // Drehspulinstrument
  const mx = 290, my = 116, R = 76;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(mx, my, R, Math.PI, 2 * Math.PI); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  for (let i = -5; i <= 5; i++) {
    const a = Math.PI + (i / 5 + 1) / 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(mx + Math.cos(a) * (R - 4), my + Math.sin(a) * (R - 4));
    ctx.lineTo(mx + Math.cos(a) * (R - (i % 5 === 0 ? 14 : 9)), my + Math.sin(a) * (R - (i % 5 === 0 ? 14 : 9)));
    ctx.stroke();
  }
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('−', mx - R + 12, my - 8);
  ctx.fillText('0', mx, my - R + 14);
  ctx.fillText('+', mx + R - 12, my - 8);

  // Zeiger
  const z = Math.max(-1, Math.min(1, _lsf.zeiger / 5));
  const a = Math.PI + (z + 1) / 2 * Math.PI;
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(mx, my);
  ctx.lineTo(mx + Math.cos(a) * (R - 12), my + Math.sin(a) * (R - 12));
  ctx.stroke();
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.arc(mx, my, 4, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Drehspulinstrument', mx, my + 18);
  ctx.font = '700 12px sans-serif';
  ctx.fillStyle = Math.abs(_lsf.zeiger) < 0.05 ? '#94a3b8' : '#dc2626';
  ctx.fillText(_fpmNum(_lsf.zeiger, 2), mx, my + 34);
  ctx.textAlign = 'left';
}

function _lsfRenderZerlegungCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const s = _lsf;
  const tA = _lsfTermFlaeche(s.nWdg, s.flAp, s.feB) * 1e6;
  const tB = _lsfTermFeld(s.nWdg, s.flA, s.feBp) * 1e6;
  const ges = tA + tB;
  const m = Math.max(1e-9, Math.abs(tA), Math.abs(tB), Math.abs(ges)) * 1.2;
  const x0 = 90, x1 = W - 20, mitte = (x0 + x1) / 2;
  const skal = (x1 - x0) / 2 / m;

  const zeile = (y, wert, farbe, name, formel) => {
    ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(name, x0 - 8, y + 4);
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#94a3b8';
    ctx.fillText(formel, x0 - 8, y + 15);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.fillStyle = farbe;
    const w = wert * skal;
    ctx.fillRect(Math.min(mitte, mitte + w), y - 9, Math.abs(w), 18);
    ctx.fillStyle = '#334155'; ctx.font = '700 10px sans-serif';
    ctx.textAlign = w >= 0 ? 'left' : 'right';
    ctx.fillText(_fpmNum(wert, 2) + ' µV', mitte + w + (w >= 0 ? 5 : -5), y + 4);
  };
  zeile(46, tA, '#f59e0b', 'Fläche', '−n·Ȧ·B');
  zeile(110, tB, '#2563eb', 'Feld', '−n·A·Ḃ');
  zeile(180, ges, '#16a34a', 'Summe', 'U_ind');

  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(mitte, 22); ctx.lineTo(mitte, H - 14); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('0', mitte, H - 4);
  ctx.textAlign = 'left';
}

function _lsfRenderOsziCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#0a0f0a'; ctx.fillRect(0, 0, W, H);
  const gw = _LSF_XDIV * 40, gh = _LSF_YDIV * 34;
  const gx = (W - gw) / 2, gy = 12;
  ctx.fillStyle = '#0d1a12'; ctx.fillRect(gx, gy, gw, gh);
  ctx.strokeStyle = '#1c3a29'; ctx.lineWidth = 1;
  for (let i = 0; i <= _LSF_XDIV; i++) {
    ctx.beginPath(); ctx.moveTo(gx + i * 40, gy); ctx.lineTo(gx + i * 40, gy + gh); ctx.stroke();
  }
  for (let j = 0; j <= _LSF_YDIV; j++) {
    ctx.beginPath(); ctx.moveTo(gx, gy + j * 34); ctx.lineTo(gx + gw, gy + j * 34); ctx.stroke();
  }
  const my = gy + gh / 2;
  ctx.strokeStyle = '#2d5c42'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(gx, my); ctx.lineTo(gx + gw, my);
  ctx.moveTo(gx + gw / 2, gy); ctx.lineTo(gx + gw / 2, gy + gh); ctx.stroke();

  const spanne = _LSF_TDIV * _LSF_XDIV;
  // Kanal 1: B(t)
  ctx.strokeStyle = '#facc15'; ctx.lineWidth = 1.8;
  ctx.setLineDash([5, 3]);
  ctx.beginPath();
  for (let px = 0; px <= gw; px++) {
    const t = px / gw * spanne;
    const y = my - _lsfBKaestchen(_lsfBt(t)) * 34;
    px ? ctx.lineTo(gx + px, y) : ctx.moveTo(gx + px, y);
  }
  ctx.stroke(); ctx.setLineDash([]);
  // Kanal 2: U_ind(t)
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.8;
  ctx.beginPath();
  let beg = false;
  for (let px = 0; px <= gw; px++) {
    const t = px / gw * spanne;
    const y = my - _lsfUKaestchen(_lsfUind(t)) * 34;
    if (y < gy || y > gy + gh) { beg = false; continue; }
    beg ? ctx.lineTo(gx + px, y) : (ctx.moveTo(gx + px, y), beg = true);
  }
  ctx.stroke();
  if (_lsf.form === 'rechteck') {
    ctx.fillStyle = '#f87171'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Beim Rechteck springt B – die Spitzen sind zu kurz und zu hoch zum Ablesen.',
      gx + gw / 2, my + 28);
    ctx.textAlign = 'left';
  }
  ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillStyle = '#facc15'; ctx.fillText('▬ CH1  B(t)', gx + 4, gy + 12);
  ctx.fillStyle = '#38bdf8'; ctx.fillText('▬ CH2  U_ind(t)', gx + 84, gy + 12);
  ctx.fillStyle = '#4b7a63'; ctx.textAlign = 'center';
  ctx.fillText(_fpmNum(_LSF_TDIV, 1) + ' s je Kästchen', gx + gw / 2, gy + gh + 14);
  ctx.textAlign = 'left';
}

function _lsfRenderSchlittenCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const my = 100, SK = (W - 80) / (_LSF_FELDLAENGE + 0.26);
  const fx0 = 40 + 0.13 * SK, fx1 = fx0 + _LSF_FELDLAENGE * SK;

  // Feldbereich zwischen den Polschuhen
  ctx.fillStyle = 'rgba(56,189,248,0.22)';
  ctx.fillRect(fx0, my - 42, fx1 - fx0, 84);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(fx0, my - 54, fx1 - fx0, 12);
  ctx.fillRect(fx0, my + 42, fx1 - fx0, 12);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Permanentmagnete zwischen Eisenplatten, Polschuhe für ein homogenes Feld',
    (fx0 + fx1) / 2, my - 60);
  // Feldsymbole
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1;
  for (let x = fx0 + 14; x < fx1; x += 26) {
    for (let y = my - 28; y <= my + 28; y += 28) {
      ctx.beginPath();
      ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4);
      ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke();
    }
  }

  // Die Leiterschleife auf dem Schlitten
  const vorn = 40 + (0.13 + _lsf.sx) * SK;
  const hinten = vorn - _LSF_SCHLEIFE_L * SK;
  const halb = Math.max(8, _lsf.sb * SK * 0.8);
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3;
  ctx.strokeRect(hinten, my - halb, Math.max(2, vorn - hinten), 2 * halb);
  ctx.fillStyle = '#dc2626'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('b = ' + _fpmNum(_lsf.sb * 100, 1) + ' cm quer', (vorn + hinten) / 2, my + halb + 12);
  // Schnur zum Motor
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(vorn, my); ctx.lineTo(W - 16, my); ctx.stroke();
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(W - 34, my - 12, 24, 24);
  ctx.strokeStyle = '#94a3b8'; ctx.strokeRect(W - 34, my - 12, 24, 24);
  ctx.fillStyle = '#475569'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('M', W - 22, my + 3);

  const U = _lsfSchlittenU(_lsf.sx, _lsf.sb, _lsf.sv, _lsf.sB);
  ctx.fillStyle = Math.abs(U) > 1e-9 ? '#dc2626' : '#94a3b8';
  ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(Math.abs(U) > 1e-9
    ? 'U = ' + _fpmNum(U * 1000, 3) + ' mV – die wirksame Fläche ändert sich'
    : 'U = 0 – die wirksame Fläche ändert sich nicht', 12, H - 10);
}

function _lsfRenderSchlittenU(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const x0 = 46, x1 = W - 12, yo = 16, yu = H - 26;
  const mitte = (yo + yu) / 2;
  const gesamt = (_LSF_FELDLAENGE + 2 * _LSF_SCHLEIFE_L + 0.10) / _lsf.sv;
  const umax = Math.max(1e-9, _lsfSchlittenUMax(_lsf.sb, _lsf.sv, _lsf.sB));

  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0, mitte); ctx.lineTo(x1, mitte); ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(x0, yo); ctx.lineTo(x0, yu); ctx.stroke();

  // Der theoretische Verlauf
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let px = 0; px <= x1 - x0; px++) {
    const t = px / (x1 - x0) * gesamt;
    const x = -_LSF_SCHLEIFE_L - 0.05 + _lsf.sv * t;
    const u = _lsfSchlittenU(x, _lsf.sb, _lsf.sv, _lsf.sB);
    const y = mitte - u / umax * (mitte - yo - 4);
    px ? ctx.lineTo(x0 + px, y) : ctx.moveTo(x0 + px, y);
  }
  ctx.stroke();
  // Die tatsaechlich gefahrene Spur
  if (_lsf.spurS.length > 1) {
    ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 2;
    ctx.beginPath();
    _lsf.spurS.forEach((p, i) => {
      const x = x0 + Math.min(1, p.t / gesamt) * (x1 - x0);
      const y = mitte - p.u / umax * (mitte - yo - 4);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  }
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('+' + _fpmNum(umax * 1000, 2) + ' mV', x0 - 4, yo + 12);
  ctx.fillText('0', x0 - 4, mitte + 3);
  ctx.fillText('−' + _fpmNum(umax * 1000, 2), x0 - 4, yu - 4);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.fillText('einfahren', x0 + (x1 - x0) * 0.13, yu + 14);
  ctx.fillText('ganz im Feld – U = 0', (x0 + x1) / 2, yu + 14);
  ctx.fillText('ausfahren', x0 + (x1 - x0) * 0.87, yu + 14);
  ctx.textAlign = 'left';
}

function _lsfRenderFaraday(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#faf8f3'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = 116, R = 66;

  // Eisenring
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 16;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Eisenring', cx, cy + 4);

  // Zwei Wicklungen
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2.6;
  for (let i = -3; i <= 3; i++) {
    const a = Math.PI + i * 0.16;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 12, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.strokeStyle = '#0369a1';
  for (let i = -3; i <= 3; i++) {
    const a = i * 0.16;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 12, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.fillStyle = '#b45309'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('Spule 1 · Batterie', cx - R - 18, cy - 26);
  ctx.fillStyle = '#0369a1'; ctx.textAlign = 'left';
  ctx.fillText('Spule 2 · Galvanometer', cx + R + 18, cy - 26);

  // Batterie und Schalter
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - R - 14, cy); ctx.lineTo(24, cy); ctx.lineTo(24, H - 26);
  ctx.lineTo(90, H - 26); ctx.stroke();
  ctx.fillStyle = _lsf.fSchalter ? '#16a34a' : '#cbd5e1';
  ctx.fillRect(56, H - 34, 26, 16);
  ctx.fillStyle = '#fff'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_lsf.fSchalter ? 'EIN' : 'AUS', 69, H - 23);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Batterie und Schalter', 92, H - 22);

  // Galvanometer
  const gx = W - 66, gy = H - 48;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(gx, gy, 30, Math.PI, 2 * Math.PI); ctx.closePath();
  ctx.fill(); ctx.stroke();
  const z = Math.max(-1, Math.min(1, _lsf.fZeiger / 3.2));
  const a = Math.PI + (z + 1) / 2 * Math.PI;
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(gx, gy);
  ctx.lineTo(gx + Math.cos(a) * 24, gy + Math.sin(a) * 24); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Galvanometer', gx, gy + 14);
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + R + 14, cy); ctx.lineTo(W - 24, cy); ctx.lineTo(W - 24, gy - 32); ctx.stroke();

  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Faraday, 29. August 1831', cx, 16);
  ctx.textAlign = 'left';
}

// ── Takt und Zeichnung ─────────────────────────────────
function _lsfTakt(dt) {
  if (!_lsf) return;
  const s = _lsf;
  const d = Math.min(0.05, dt);
  s.t += d;

  // Station 1: der Magnet folgt dem Regler bzw. dem Pendel
  const hAlt = s.h, rAlt = s.rSchleife;
  if (s.pendel) {
    s.pt += d;
    s.h = 0.075 + 0.045 * Math.cos(2 * Math.PI * s.pt / 1.1);
  } else {
    s.h += (s.hZiel - s.h) * Math.min(1, d * 7);
  }
  s.rSchleife += (s.rZiel - s.rSchleife) * Math.min(1, d * 7);
  s.vHand = d > 0 ? (s.h - hAlt) / d : 0;
  s.dR = d > 0 ? (s.rSchleife - rAlt) / d : 0;
  // Der Zeiger eines Drehspulinstruments folgt traege
  const U = _lsfUGrund(s.h, s.rSchleife, s.vHand, s.dR);
  const ziel = Math.max(-5, Math.min(5, U * 1e6 / 14));
  s.zeiger += (ziel - s.zeiger) * Math.min(1, d * 9);

  // Station 4: der Schlitten faehrt
  if (s.sLaeuft) {
    s.sx += s.sv * d;
    s.spurS.push({ t: s.spurS.length ? s.spurS[s.spurS.length - 1].t + d : 0,
                   u: _lsfSchlittenU(s.sx, s.sb, s.sv, s.sB) });
    if (s.sx > _LSF_FELDLAENGE + _LSF_SCHLEIFE_L + 0.05) s.sLaeuft = false;
  }

  // Station 5: Faradays Galvanometer
  s.fT += d;
  const ausschlag = _lsfFaradayAusschlag(s.fT, s.fSchalter, 0);
  s.fZeiger += (ausschlag - s.fZeiger) * Math.min(1, d * 12);
}
function _lsfRender() {
  if (!_lsf) return;
  const st = _lsf.station;
  if (st === 0) {
    const cg = document.getElementById('lsfGrund');
    if (cg) _lsfRenderGrund(cg.getContext('2d'), cg);
    const cz = document.getElementById('lsfZeiger');
    if (cz) _lsfRenderZeigerCv(cz.getContext('2d'), cz);
    _lsfUpdate();
  } else if (st === 1) {
    const cv = document.getElementById('lsfZerlegung');
    if (cv) _lsfRenderZerlegungCv(cv.getContext('2d'), cv);
  } else if (st === 2) {
    const co = document.getElementById('lsfOszi');
    if (co) _lsfRenderOsziCv(co.getContext('2d'), co);
  } else if (st === 3) {
    const cs = document.getElementById('lsfSchlitten');
    if (cs) _lsfRenderSchlittenCv(cs.getContext('2d'), cs);
    const cu = document.getElementById('lsfSchlittenU');
    if (cu) _lsfRenderSchlittenU(cu.getContext('2d'), cu);
  } else if (st === 4) {
    const cf = document.getElementById('lsfFaraday');
    if (cf) _lsfRenderFaraday(cf.getContext('2d'), cf);
    _lsfRenderHist();
  }
}

// ── Zusätzliche Styles für die Leiterschleife ──────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .lsf-beob { font-size: .78rem; border-radius: 9px; padding: 9px 11px; margin: 8px 0;
      line-height: 1.55; border: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; }
    .lsf-beob.still { background: #f8fafc; border-color: #e2e8f0; color: #64748b; }
    .lsf-beob.plus { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
    .lsf-beob.minus { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
    .lsf-fein { margin-top: 7px; padding-top: 7px; border-top: 1px solid rgba(0,0,0,.08);
      font-size: .74rem; }
    .lsf-k3 { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-top: 12px; }
    .lsf-gesetz { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 12px; }
    .lsf-formel { font-size: .88rem; color: #075985; background: #f0f9ff; border: 1px solid #bae6fd;
      border-radius: 8px; padding: 10px 12px; margin: 7px 0; text-align: center;
      font-variant-numeric: tabular-nums; }
    .lsf-faelle { display: flex; gap: 8px; flex-wrap: wrap; }
    .lsf-fall { flex: 1 1 190px; background: #fff; border: 2px solid #e2e8f0; border-radius: 8px;
      padding: 9px 11px; font-size: .76rem; color: #475569; line-height: 1.55; }
    .lsf-fall.an { border-color: #0369a1; background: #f0f9ff; }
    .lsf-fall span { display: block; font-size: .6rem; text-transform: uppercase;
      letter-spacing: .05em; font-weight: 800; color: #94a3b8; margin-bottom: 3px; }
    .lsf-fall b { display: block; color: #334155; margin-bottom: 3px; }
    .lsf-fall div { font-size: .84rem; color: #075985; font-weight: 700; margin: 4px 0 6px;
      font-variant-numeric: tabular-nums; }
    .lsf-vergleich { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 12px; margin-top: 10px; }
    .lsf-verg-z { display: flex; align-items: baseline; gap: 8px; font-size: .77rem;
      color: #475569; padding: 4px 0; border-bottom: 1px solid #eef2f7; }
    .lsf-verg-z:last-of-type { border-bottom: none; }
    .lsf-verg-z span { flex: 0 0 130px; font-size: .68rem; text-transform: uppercase;
      letter-spacing: .04em; font-weight: 800; color: #94a3b8; }
    .lsf-verg-z b { color: #075985; font-variant-numeric: tabular-nums; }
    .lsf-verg-z i { color: #94a3b8; font-size: .7rem; font-style: normal; margin-left: auto; }
    .lsf-verg-z.ok b { color: #15803d; }
    .lsf-hist { background: #faf8f3; border: 1px solid #e7e2d6; border-radius: 9px;
      padding: 11px 13px; }
    .lsf-hist-t { font-size: .79rem; color: #4b4438; line-height: 1.7; }
    .lsf-hist-frage { font-size: .77rem; color: #6b5b3e; background: #fdf9ee;
      border: 1px solid #e7dcc0; border-radius: 8px; padding: 9px 11px; margin-top: 9px;
      line-height: 1.6; }
    .lsf-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();
// ═══════════════════════════════════════════════════════
// DER GENERATOR
// Schluesselexperiment 12 der NRW-Handreichung.
// Kernkompetenz des KLP: das Entstehen sinusfoermiger Wechselspannungen in
// Generatoren erlaeutern (E2, E6). Dazu UF3/UF4 (die beiden Induktions-
// ursachen), E2/E5 (Oszillogramme auswerten), K2 (Recherche) und K3.
// ═══════════════════════════════════════════════════════

const _GEN_MU0 = 4e-7 * Math.PI;
const _GEN_K   = 8 / (5 * Math.sqrt(5));   // Helmholtz-Vorfaktor ≈ 0,7155
const _GEN_HN  = 130;                      // Windungen je Feldspule
const _GEN_HR  = 0.150;                    // Spulenradius in m

// Die drehbare Spule des Grundversuchs. Die Handreichung nennt ausdruecklich
// n = 8000 Windungen und – beim Erdinduktor – A = 42 cm².
const _GEN_N0 = 8000;
const _GEN_A0 = 42e-4;

// Erdinduktor nach Gauss und Weber
const _GEN_BH = 20.3e-6;      // Horizontalkomponente des Erdfeldes in T
const _GEN_BV = 43.5e-6;      // Vertikalkomponente
const _GEN_VERST = 10;        // Verstaerkungsfaktor des Messverstaerkers

let _gen = null;

function _genInit() {
  _gen = {
    station: 0,
    // Station 1
    f: 2.0, hI: 2.0, n: _GEN_N0, A: _GEN_A0,
    laeuft: true, t: 0, zeitlupe: 1, schatten: true, spur: [],
    // Station 2
    schritt: 0, phiGrad: 0,
    // Station 3
    rows: [], nextId: 1, preset: 0, fn: null, fnAuto: false, reveal: false,
    // Station 4
    eT: 0.5, eLaeuft: true, et: 0, eSpur: [], eLeseU: '', eLeseT: '', eGeprueft: null,
    eVerstaerkt: true,
    // Station 5
    epoche: 0
  };
}

// ── Feld und Spule ─────────────────────────────────────
function _genB(I) { return _GEN_K * _GEN_MU0 * _GEN_HN * I / _GEN_HR; }
function _genOmega(f) { return 2 * Math.PI * f; }

// Der Drehwinkel zwischen Flaechennormale und Feldrichtung
function _genPhi(t, f) { return _genOmega(f) * t; }
// Die effektiv vom Feld durchsetzte Flaeche – die Projektion der Spulenflaeche.
// Genau diese macht die Beleuchtung laengs der Feldlinien als Schatten sichtbar.
function _genAeff(t, f, A) { return A * Math.cos(_genPhi(t, f)); }
// Magnetischer Fluss durch eine Windung
function _genFluss(t, f, A, B) { return B * _genAeff(t, f, A); }
// Scheitelwert: Û = n · B · A · ω
function _genUmax(n, B, A, f) { return n * B * A * _genOmega(f); }
// Und der zeitliche Verlauf. Aus U = −n·dΦ/dt mit Φ = B·A·cos(ωt) folgt
// U = n·B·A·ω·sin(ωt) – der Sinus entsteht durch das Ableiten des Kosinus.
function _genU(t, n, B, A, f) { return _genUmax(n, B, A, f) * Math.sin(_genPhi(t, f)); }
// Effektivwert einer sinusfoermigen Wechselspannung
function _genUeff(Umax) { return Umax / Math.SQRT2; }

// ── Erdinduktor ────────────────────────────────────────
// Die Spule dreht sich um eine senkrechte Achse. Dann steht ihre Normale
// immer waagerecht – und nur die WAAGERECHTE Feldkomponente kann den
// Fluss ueberhaupt beeinflussen. Die senkrechte steht dauerhaft in der
// Spulenebene und traegt nichts bei.
function _genErdUmax(T) { return _GEN_N0 * _GEN_BH * _GEN_A0 * (2 * Math.PI / T); }
function _genErdU(t, T) { return _genErdUmax(T) * Math.sin(2 * Math.PI / T * t); }
function _genErdAnzeige(t, T) {
  return _genErdU(t, T) * (_gen.eVerstaerkt ? _GEN_VERST : 1);
}
// Rueckweg: aus der abgelesenen Amplitude und Periodendauer auf B_H schliessen
function _genBHAus(UanzeigeV, T, verstaerkt) {
  const U = UanzeigeV / (verstaerkt ? _GEN_VERST : 1);
  return U / (_GEN_N0 * _GEN_A0 * (2 * Math.PI / T));
}
// Inklination aus beiden Komponenten
function _genInklination() { return Math.atan2(_GEN_BV, _GEN_BH) * 180 / Math.PI; }
function _genBGesamt() { return Math.sqrt(_GEN_BH * _GEN_BH + _GEN_BV * _GEN_BV); }

// ── Historische Marken ─────────────────────────────────
const _GEN_EPOCHEN = [
  { j: '1831', n: 'Faraday entdeckt die Induktion',
    t: 'Michael Faraday zeigt mit seiner Ringkernanordnung, dass eine <b>Änderung</b> des magnetischen Flusses eine Spannung erzeugt. Er formuliert dabei keine einzige Gleichung – er denkt in Feldlinien. Damit ist die Grundlage für jeden Generator gelegt, aber noch keiner gebaut.' },
  { j: '1832', n: 'Pixii baut die erste Maschine',
    t: 'Hippolyte Pixii dreht mit einer Handkurbel einen Hufeisenmagneten vor zwei feststehenden Spulen. Das Ergebnis ist eine <b>Wechselspannung</b> – die damals als Nachteil galt, weil man mit Gleichstrom umzugehen wusste. Pixii baute deshalb einen Kommutator ein, um sie gleichzurichten.' },
  { j: '1866', n: 'Siemens und das dynamoelektrische Prinzip',
    t: 'Werner von Siemens erkennt, dass man auf Dauermagnete ganz verzichten kann: Der <b>Restmagnetismus</b> des Eisens genügt, um einen ersten schwachen Strom zu erzeugen, mit dem sich das Feld selbst verstärkt. Erst dadurch werden Generatoren groß und leistungsfähig – der Beginn der Elektrotechnik als Industrie.' },
  { j: 'heute', n: 'Drehstrom im Kraftwerk',
    t: 'Praktisch die gesamte elektrische Energie wird heute in Generatoren erzeugt, die mechanische in elektrische Energie umwandeln – mit einem <b>Wirkungsgrad von häufig über 90 %</b>. Ob Dampf, Wind oder Wasser die Turbine antreibt, ändert daran nichts. Einphasige Wechselstromgeneratoren wie im Schulversuch spielen dabei kaum noch eine Rolle; im Kraftwerk arbeitet man mit <b>Drehstrom</b>, also drei um je 120° versetzten Wicklungen.' }
];

// ── Zahlformat für die Theoriefunktion ─────────────────
// Die gemeinsame Hilfsfunktion _dspZahl rundet auf sechs NACHKOMMAstellen.
// Die Steigungen sind hier teilweise sehr klein – bei n → Û etwa 8·10⁻⁵ –,
// da bleiben davon kaum gültige Ziffern übrig, im Extremfall gar keine.
// Deshalb hier ein Formatierer mit sechs GÜLTIGEN Ziffern. Er darf nicht in
// die Exponentialschreibweise rutschen, die der Termparser nicht versteht.
function _genZahl(v) {
  if (!isFinite(v) || v === 0) return '0';
  const ex = Math.floor(Math.log10(Math.abs(v)));
  const dez = Math.max(0, Math.min(20, 5 - ex));
  const s = v.toFixed(dez);
  return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}

// ── Oberfläche ─────────────────────────────────────────
function _genHTML() {
  const stationen = ['1 · Der Grundversuch', '2 · Warum ein Sinus?',
                     '3 · Wovon hängt Û ab?', '4 · Erdinduktor',
                     '5 · Vom Modell zum Kraftwerk']
    .map((s, i) => `<button class="fpm-tab${i === _gen.station ? ' on' : ''}" id="genSt${i}" onclick="_genSetStation(${i})">${s}</button>`).join('');

  const presets = ['f → Û', 'B → Û', 'A → Û', 'n → Û'].map((p, i) =>
    `<button class="fpm-tab${i === _gen.preset ? ' on' : ''}" id="genTab${i}" onclick="_genSetPreset(${i})">${p}</button>`).join('');

  return `<div class="sim-box sim-box-wide fpm-sim gen-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">⚡ Der Generator: das Schlüsselexperiment</h3>
    <canvas id="genTakt" width="1" height="1" style="display:none"></canvas>
    <div class="fpm-tabs">${stationen}</div>

    <!-- ══ Station 1 ══ -->
    <div id="genS0">
      <div class="fpm-grid">
        <div>
          <canvas id="genAufbau" width="440" height="280" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Drehbare Spule im Helmholtzfeld, beleuchtet längs der Feldlinien</div>
          <canvas id="genOszi" width="440" height="250" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Oben die Projektionsfläche, unten die Induktionsspannung</div>
        </div>
        <div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" id="genLaufBtn" onclick="_genToggle()">⏸ Anhalten</button>
            <button class="sim-btn" onclick="_genReset()">↺ Zurücksetzen</button>
          </div>
          <div class="osz-gruppe">
            <div class="osz-gruppe-k">Ablauf</div>
            <div class="osz-zeile"><span>Zeitlupe</span>
              <span class="osz-seg">
                <button class="osz-segb" id="genZl1" onclick="_genSetZeitlupe(1)">1 : 1</button>
                <button class="osz-segb" id="genZl4" onclick="_genSetZeitlupe(4)">1 : 4</button>
                <button class="osz-segb" id="genZl12" onclick="_genSetZeitlupe(12)">1 : 12</button>
              </span></div>
            <label class="fpm-check"><input type="checkbox" id="genSchatten" checked
              onchange="_genSetSchatten(this.checked)"> Projektionsfläche als Schatten zeigen</label>
          </div>
          <div class="osz-gruppe">
            <div class="osz-gruppe-k">Generator einstellen</div>
            <div class="osz-zeile"><span>Drehfrequenz f</span>
              <input type="range" id="genF" min="0.2" max="8" step="0.1" value="2"
                oninput="_genSetF(this.value)"><b id="genFLbl">2,0 Hz</b></div>
            <div class="osz-zeile"><span>Spulenstrom I</span>
              <input type="range" id="genI" min="0.2" max="3" step="0.05" value="2"
                oninput="_genSetI(this.value)"><b id="genILbl">2,00 A</b></div>
            <div class="osz-zeile"><span>Windungen n</span>
              <input type="range" id="genN" min="500" max="12000" step="100" value="8000"
                oninput="_genSetN(this.value)"><b id="genNLbl">8000</b></div>
            <div class="osz-zeile"><span>Fläche A</span>
              <input type="range" id="genA" min="10" max="80" step="1" value="42"
                oninput="_genSetA(this.value)"><b id="genALbl">42 cm²</b></div>
          </div>
          <div class="fpm-readout">
            <div class="fpm-ro"><span class="fpm-ro-k">Drehwinkel φ</span><span class="fpm-ro-v" id="genPhiA">—</span><span class="fpm-ro-u">°</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Magnetfeld B</span><span class="fpm-ro-v" id="genBA">—</span><span class="fpm-ro-u">mT</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">wirksame Fläche A′</span><span class="fpm-ro-v" id="genAeffA">—</span><span class="fpm-ro-u">cm²</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Spannung U</span><span class="fpm-ro-v" id="genUA">—</span><span class="fpm-ro-u">V</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Scheitelwert Û</span><span class="fpm-ro-v" id="genUmaxA">—</span><span class="fpm-ro-u">V</span></div>
            <div class="fpm-ro"><span class="fpm-ro-k">Effektivwert</span><span class="fpm-ro-v" id="genUeffA">—</span><span class="fpm-ro-u">V</span></div>
          </div>
          <div class="gen-lage" id="genLage"></div>
          <div class="ebr-rechnung" id="genRechnung"></div>
        </div>
      </div>
      <div class="gen-k3" id="genK3"></div>
    </div>

    <!-- ══ Station 2 ══ -->
    <div id="genS1" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="genNormale" width="440" height="250" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Die Flächennormale und ihr Winkel zum Feld</div>
          <div class="phys-ctrl">
            <span class="phys-ctrl-label">Drehwinkel φ: <b id="genPhiLbl">0°</b></span>
            <input type="range" id="genPhiSl" min="0" max="360" step="1" value="0"
              oninput="_genSetPhiGrad(this.value)" style="width:100%;accent-color:#7c3aed">
          </div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_genSetPhiGrad(0)">φ = 0°</button>
            <button class="sim-btn" onclick="_genSetPhiGrad(90)">φ = 90°</button>
            <button class="sim-btn" onclick="_genSetPhiGrad(180)">φ = 180°</button>
            <button class="sim-btn" onclick="_genSetPhiGrad(270)">φ = 270°</button>
          </div>
          <div class="gen-phase" id="genPhase"></div>
        </div>
        <div>
          <div class="fpm-label">Die Herleitung Schritt für Schritt</div>
          <div class="lsk-schritte" id="genSchritte"></div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_genSchritt(-1)">◀ zurück</button>
            <button class="sim-btn primary" onclick="_genSchritt(1)">weiter ▶</button>
            <button class="sim-btn" onclick="_genSchritt(99)">alle zeigen</button>
          </div>
          <div class="gen-tabelle" id="genTabelle"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 3 ══ -->
    <div id="genS2" style="display:none">
      <div class="fpm-grid">
        <div>
          <div class="fpm-label">Einstellen und Messwert übernehmen</div>
          <div class="osz-gruppe">
            <div class="osz-zeile"><span>Drehfrequenz f</span>
              <input type="range" id="genF2" min="0.2" max="8" step="0.1" value="2"
                oninput="_genSetF(this.value)"><b id="genFLbl2">2,0 Hz</b></div>
            <div class="osz-zeile"><span>Spulenstrom I</span>
              <input type="range" id="genI2" min="0.2" max="3" step="0.05" value="2"
                oninput="_genSetI(this.value)"><b id="genILbl2">2,00 A</b></div>
            <div class="osz-zeile"><span>Windungen n</span>
              <input type="range" id="genN2" min="500" max="12000" step="100" value="8000"
                oninput="_genSetN(this.value)"><b id="genNLbl2">8000</b></div>
            <div class="osz-zeile"><span>Fläche A</span>
              <input type="range" id="genA2" min="10" max="80" step="1" value="42"
                oninput="_genSetA(this.value)"><b id="genALbl2">42 cm²</b></div>
          </div>
          <div class="ebr-rechnung" id="genMessRechnung"></div>
          <div class="sim-btn-row">
            <button class="sim-btn primary" onclick="_genTake()">✓ Messwert übernehmen</button>
            <button class="sim-btn" onclick="_genDemo()">📋 Beispielmessreihe</button>
            <button class="sim-btn" onclick="_genClear()">🗑 leeren</button>
          </div>
          <div class="fpm-tablewrap">
            <table class="sim-table">
              <thead><tr><th>Nr.</th><th>f (Hz)</th><th>B (mT)</th><th>A (cm²)</th><th>n</th><th>Û (V)</th><th></th></tr></thead>
              <tbody id="genTbody"></tbody>
            </table>
            <div class="fpm-empty" id="genEmpty">Noch keine Messwerte.<br>Immer nur eine Größe verändern.</div>
          </div>
        </div>
        <div>
          <div class="fpm-tabs">${presets}</div>
          <canvas id="genPlot" width="440" height="300" class="phys-chart-cv"></canvas>
          <div class="fpm-fit" id="genFitBox"></div>
          <input type="text" id="genFn" class="fpm-input" placeholder="z. B. 0,33*x" spellcheck="false"
            oninput="_genSetFn(this.value)" style="margin-top:8px">
          <div class="fpm-err" id="genFnErr"></div>
          <div class="sim-btn-row" style="padding:2px 0 4px">
            <button class="sim-btn primary" onclick="_genTheorieFn()">ƒ Theoriefunktion</button>
            <button class="sim-btn" onclick="_genClearFn()">Feld leeren</button>
          </div>
          <div class="fpm-theo" id="genTheo"></div>
          <label class="fpm-check"><input type="checkbox" onchange="_genSet('reveal',this.checked)">
            Sollwert anzeigen</label>
        </div>
      </div>
    </div>

    <!-- ══ Station 4 ══ -->
    <div id="genS3" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="genErde" width="440" height="250" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Die Spule dreht sich um eine senkrechte Achse im Erdfeld</div>
          <canvas id="genErdOszi" width="440" height="230" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Gemessene Spannung über der Zeit</div>
          <div class="osz-gruppe">
            <div class="osz-zeile"><span>Umlaufdauer T</span>
              <input type="range" id="genET" min="0.25" max="1.2" step="0.01" value="0.5"
                oninput="_genSetET(this.value)"><b id="genETLbl">0,50 s</b></div>
            <label class="fpm-check"><input type="checkbox" id="genVerst" checked
              onchange="_genSetVerst(this.checked)"> Messverstärker × ${_GEN_VERST} eingeschaltet</label>
          </div>
        </div>
        <div>
          <div class="gen-erd-auf" id="genErdAufgabe"></div>
          <div class="fpm-label">Am Diagramm ablesen</div>
          <div class="osz-lese">
            <div class="osz-lese-z"><span>Scheitelwert Û =</span>
              <input type="text" class="fpm-input osz-inp" id="genLeseU" placeholder="?"
                spellcheck="false" oninput="_genSetLese('eLeseU',this.value)"><span>mV</span></div>
            <div class="osz-lese-z"><span>Periodendauer T =</span>
              <input type="text" class="fpm-input osz-inp" id="genLeseT" placeholder="?"
                spellcheck="false" oninput="_genSetLese('eLeseT',this.value)"><span>s</span></div>
          </div>
          <div class="ebr-rechnung" id="genErdRechnung"></div>
          <div class="sim-btn-row">
            <button class="sim-btn" onclick="_genErdPruefen()">✓ Ergebnis prüfen</button>
          </div>
          <div class="lsk-zustand" id="genErdPruef"></div>
          <div class="gen-erd-vert" id="genErdVertikal"></div>
        </div>
      </div>
    </div>

    <!-- ══ Station 5 ══ -->
    <div id="genS4" style="display:none">
      <div class="fpm-grid">
        <div>
          <canvas id="genKraftwerk" width="440" height="260" class="phys-anim-cv"></canvas>
          <div class="fpm-label">Von der Turbine zur Steckdose</div>
          <div class="gen-zeit" id="genZeitleiste"></div>
        </div>
        <div>
          <div class="gen-hist" id="genHist"></div>
          <div class="fpm-label" style="margin-top:10px">Wohin es von hier aus weitergeht</div>
          <div class="gen-aus" id="genAusblick"></div>
        </div>
      </div>
    </div>

    <div id="genErkl" class="dsp-erkl"></div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>A′ = A · cos(ω·t)</b> &nbsp;|&nbsp; <b>U = −n · Φ̇ = −n · B · Ȧ′</b>
      &nbsp;|&nbsp; <b>U(t) = Û · sin(ω·t)</b> &nbsp;|&nbsp; <b>Û = n · B · A · ω</b>
    </p>
  </div>`;
}

function _genErklHTML() {
  return `<div class="dsp-erkl-kopf">Warum ausgerechnet ein Sinus?</div>
    <div class="dsp-erkl-text">
      Dreht sich eine Spule gleichmäßig in einem homogenen Magnetfeld, so entsteht an ihren Enden
      eine <b>sinusförmige Wechselspannung</b>. Das ist keine Willkür der Natur, sondern folgt in
      drei Schritten aus dem Induktionsgesetz. <b>Erstens</b>: Das Feld bleibt konstant, es wird ja
      nicht verändert – also ist Ḃ = 0, und von den beiden Induktionsursachen bleibt nur die
      <b>zeitlich veränderliche wirksame Fläche</b> übrig. <b>Zweitens</b>: Die wirksame Fläche ist
      die <i>Projektion</i> der Spulenfläche auf die Ebene senkrecht zum Feld, also
      A′ = A · cos φ. <b>Drittens</b>: Bei gleichmäßiger Drehung ist φ = ω·t, und beim Ableiten des
      Kosinus nach der Zeit entsteht – Kettenregel – ein Sinus, multipliziert mit ω. Damit ist
      U(t) = n·B·A·ω·sin(ω·t). Der Sinus stammt also nicht aus der Geometrie, sondern <b>aus dem
      Ableiten</b>.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Der Schattenwurf</div>
    <div class="dsp-erkl-text">
      Der Aufbau der Handreichung hat einen schönen Kunstgriff: Die drehbare Spule wird <b>längs
      der Feldlinien beleuchtet</b>. Ihr Schatten ist dann genau die Projektionsfläche A′ – man
      sieht die Größe, um die es geht, unmittelbar. Und weil daneben das Oszilloskop mitläuft,
      lässt sich beides direkt vergleichen. Das Ergebnis überrascht viele: Die Spannung ist
      <b>null</b>, wenn der Schatten am <b>größten</b> ist, und <b>größt</b>, wenn der Schatten zu
      einem Strich zusammengeschrumpft ist. Denn nicht die Fläche selbst erzeugt die Spannung,
      sondern ihre <b>Änderungsrate</b> – und die ist gerade dort am größten, wo die Fläche durch
      null geht.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Die Phasenlage</div>
    <div class="dsp-erkl-text">
      Mathematisch steckt dahinter die Beziehung sin φ = cos(φ + π/2): Spannung und Fläche sind um
      eine <b>Viertelperiode</b> gegeneinander verschoben. Wer den Versuch in Zeitlupe betrachtet,
      kann das an den Extrem- und Nullstellen direkt ablesen – und hat damit einen experimentellen
      Beleg dafür, dass die Ableitung eines Kosinus ein Sinus ist.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Wovon der Scheitelwert abhängt</div>
    <div class="dsp-erkl-text">
      In Û = n · B · A · ω stecken vier Größen, und alle gehen <b>proportional</b> ein: doppelte
      Windungszahl, doppelte Spannung; doppeltes Feld, doppelte Spannung; und so fort. Besonders
      wichtig ist die Kreisfrequenz ω = 2π·f: Ein Generator liefert nicht nur eine höhere
      <i>Frequenz</i>, wenn man ihn schneller dreht, sondern auch eine höhere <b>Spannung</b>.
      Deshalb müssen Kraftwerksgeneratoren sehr genau auf ihrer Drehzahl gehalten werden – die
      Netzfrequenz von 50 Hz ist keine Einstellung, sondern eine <b>Drehzahl</b>.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Aufbauhinweise aus der Handreichung</div>
    <div class="dsp-erkl-text">
      Für das Helmholtzfeld sollte ein <b>stabilisiertes Netzteil</b> verwendet werden – schwankt
      der Spulenstrom, so ändert sich auch B, und man misst eine unerwünschte Induktionsspannung
      aus der falschen Ursache. Auf die zulässige Höchststromstärke der Feldspulen ist zu achten.
      Das Kabel zum Abgreifen der Induktionsspannung sollte <b>geschirmt</b> sein, sonst fängt man
      sich Störungen ein. Und wenn die drehbare Spule zu wenige Windungen hat, braucht es einen
      Messverstärker; die Handreichung verwendet eine Spule mit n = 8000.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Der Erdinduktor von Gauß und Weber</div>
    <div class="dsp-erkl-text">
      Dasselbe Prinzip lässt sich benutzen, um das <b>Erdmagnetfeld</b> zu vermessen – so haben es
      Carl Friedrich Gauß und Wilhelm Weber vor über 150 Jahren getan. Webers Erdinduktor war eine
      große Spule, die im Erdfeld um 180° gedreht wurde. Dreht man eine Spule mit n = 8000 und
      A = 42 cm² um eine <b>senkrechte</b> Achse, so steht ihre Flächennormale immer waagerecht.
      Dann kann nur die <b>waagerechte</b> Komponente B<sub>H</sub> des Erdfeldes den Fluss
      beeinflussen – die senkrechte liegt dauerhaft in der Spulenebene und trägt gar nichts bei.
      Aus dem gemessenen Scheitelwert und der Umlaufdauer folgt B<sub>H</sub> = Û/(n·A·ω). Wer
      dabei den Verstärkungsfaktor vergisst, landet um genau diesen Faktor daneben.
    </div>
    <div class="dsp-erkl-kopf" style="margin-top:8px">Warum das technisch zählt</div>
    <div class="dsp-erkl-text">
      Praktisch die gesamte elektrische Energie unserer Gesellschaft entsteht in Generatoren –
      gleich, ob eine Turbine von Dampf, Wind oder Wasser angetrieben wird. Die Umwandlung von
      mechanischer in elektrische Energie gelingt dabei mit einem <b>Wirkungsgrad von häufig über
      90 %</b>, was für eine Energiewandlung außergewöhnlich gut ist. Der einphasige
      Wechselstromgenerator des Schulversuchs ist dafür heute allerdings nur noch ein Modell: Im
      Kraftwerk arbeitet man mit <b>Drehstrom</b>, also drei um je 120° versetzten Wicklungen.
      Am Modell lassen sich die Grundlagen aber ohne großen mathematischen Aufwand verstehen.
    </div>
    <div class="dsp-erkl-warn">⚠ Beim Aufbau auf die zulässige Stromstärke der Feldspulen achten
      und ein stabilisiertes Netzteil verwenden.</div>`;
}

// ── Stationen ──────────────────────────────────────────
function _genSetStation(i) {
  _gen.station = i;
  for (let k = 0; k < 5; k++) {
    document.getElementById('genSt' + k)?.classList.toggle('on', k === i);
    const d = document.getElementById('genS' + k);
    if (d) d.style.display = k === i ? 'block' : 'none';
  }
  _genUpdate();
  if (i === 2) _genDrawPlot();
}
function _genSet(key, val) { _gen[key] = val; _genDrawPlot(); }

// ── Station 1 ──────────────────────────────────────────
function _genToggle() {
  _gen.laeuft = !_gen.laeuft;
  const b = document.getElementById('genLaufBtn');
  if (b) b.textContent = _gen.laeuft ? '⏸ Anhalten' : '▶ Weiterdrehen';
  _genUpdate();
}
function _genReset() {
  _gen.t = 0; _gen.spur = [];
  _genUpdate();
}
function _genSetZeitlupe(z) {
  _gen.zeitlupe = z;
  [1, 4, 12].forEach(k => document.getElementById('genZl' + k)?.classList.toggle('on', k === z));
  _genUpdate();
}
function _genSetSchatten(v) { _gen.schatten = !!v; }
function _genSetF(v) { _gen.f = Math.max(0.2, Math.min(8, +v)); _genUpdate(); }
function _genSetI(v) { _gen.hI = Math.max(0.2, Math.min(3, +v)); _genUpdate(); }
function _genSetN(v) { _gen.n = Math.max(500, Math.min(12000, +v)); _genUpdate(); }
function _genSetA(v) { _gen.A = Math.max(10, Math.min(80, +v)) * 1e-4; _genUpdate(); }

function _genUpdate() {
  if (!_gen) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const s = _gen;
  const B = _genB(s.hI);
  const phi = _genPhi(s.t, s.f);
  const grad = ((phi * 180 / Math.PI) % 360 + 360) % 360;
  const Aeff = _genAeff(s.t, s.f, s.A);
  const U = _genU(s.t, s.n, B, s.A, s.f);
  const Um = _genUmax(s.n, B, s.A, s.f);

  ['', '2'].forEach(function (suf) {
    set('genFLbl' + suf, _fpmNum(s.f, 1) + ' Hz');
    set('genILbl' + suf, _fpmNum(s.hI, 2) + ' A');
    set('genNLbl' + suf, String(Math.round(s.n)));
    set('genALbl' + suf, _fpmNum(s.A * 1e4, 0) + ' cm²');
  });
  set('genPhiA', _fpmNum(grad, 0));
  set('genBA', _fpmNum(B * 1000, 3));
  set('genAeffA', _fpmNum(Aeff * 1e4, 1));
  set('genUA', _fpmNum(U, 3));
  set('genUmaxA', _fpmNum(Um, 3));
  set('genUeffA', _fpmNum(_genUeff(Um), 3));
  [1, 4, 12].forEach(k => document.getElementById('genZl' + k)?.classList.toggle('on', k === s.zeitlupe));

  // Die Phasenlage in Worten – das ist die Kernbeobachtung
  const el = document.getElementById('genLage');
  if (el) {
    const c = Math.abs(Math.cos(phi)), si = Math.abs(Math.sin(phi));
    if (c > 0.94) {
      el.className = 'gen-lage flach';
      el.innerHTML = '<b>Die Spulenfläche steht senkrecht zum Feld.</b> Der Schatten ist jetzt am '
        + '<b>größten</b>, der Fluss maximal – und die Spannung ist gerade <b>null</b>. '
        + 'Denn hier ändert sich die Projektionsfläche für einen Augenblick gar nicht.';
    } else if (si > 0.94) {
      el.className = 'gen-lage kant';
      el.innerHTML = '<b>Die Spule steht auf der Kante, parallel zum Feld.</b> Der Schatten ist zu '
        + 'einem <b>Strich</b> geschrumpft, der Fluss ist null – und die Spannung ist gerade am '
        + '<b>größten</b>. Hier ändert sich die Projektionsfläche am schnellsten.';
    } else {
      el.className = 'gen-lage';
      el.innerHTML = 'Dazwischen: Der Schatten schrumpft oder wächst gerade, und die Spannung '
        + 'liegt zwischen null und ihrem Scheitelwert. Achte auf die beiden Extremlagen – dort '
        + 'wird der Zusammenhang am deutlichsten.';
    }
  }

  const r = document.getElementById('genRechnung');
  if (r) {
    r.innerHTML = `
      <div class="pho-rz"><span class="pho-rz-t">Feld der Helmholtzspulen</span>
        <span class="pho-rz-f">B = 0,7155·µ₀·n<sub>H</sub>·I/R</span>
        <span class="pho-rz-v">${_fpmNum(B * 1000, 3)} mT</span></div>
      <div class="pho-rz"><span class="pho-rz-t">Kreisfrequenz</span>
        <span class="pho-rz-f">ω = 2π·f</span>
        <span class="pho-rz-v">${_fpmNum(_genOmega(s.f), 2)} 1/s</span></div>
      <div class="pho-rz"><span class="pho-rz-t">wirksame Fläche gerade jetzt</span>
        <span class="pho-rz-f">A′ = A · cos(ω·t)</span>
        <span class="pho-rz-v">${_fpmNum(Aeff * 1e4, 1)} cm²</span></div>
      <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Scheitelwert der Spannung</span>
        <span class="pho-rz-f">Û = n · B · A · ω</span>
        <span class="pho-rz-v">${_fpmNum(Um, 3)} V</span></div>
      <div class="fpm-note">Der Effektivwert einer Sinusspannung ist Û/√2 =
        ${_fpmNum(_genUeff(Um), 3)} V – das ist die Spannung, die ein Vielfachmessgerät anzeigen
        würde und die an einem Widerstand dieselbe Leistung umsetzt wie eine Gleichspannung
        gleicher Höhe.</div>`;
  }

  _genRenderK3();
  _genRenderHerleitung();
  _genRenderMess();
  _genRenderErde();
  _genRenderHist();
}

function _genRenderK3() {
  const el = document.getElementById('genK3'); if (!el) return;
  const B = _genB(_gen.hI);
  el.innerHTML = `
    <div class="git-sch-kopf">So erklärst du diesen Versuch jemandem anderen</div>
    <div class="lsk-k3-grid">
      <div class="lsk-k3-teil"><span>Zielsetzung</span>
        Wir wollen verstehen, warum ein Generator ausgerechnet eine <b>sinusförmige</b>
        Wechselspannung liefert – und wovon deren Höhe abhängt.</div>
      <div class="lsk-k3-teil"><span>Aufbau</span>
        Eine Spule mit ${Math.round(_gen.n)} Windungen und ${_fpmNum(_gen.A * 1e4, 0)} cm² Fläche
        dreht sich im homogenen Feld eines Helmholtzspulenpaars. Schleifkontakte greifen die
        Spannung ab, ein Messwerterfassungssystem zeichnet sie auf. Eine Lampe beleuchtet die
        Spule längs der Feldlinien.</div>
      <div class="lsk-k3-teil"><span>Durchführung</span>
        Die Spule gleichmäßig drehen und gleichzeitig den Schatten und die aufgezeichnete Spannung
        beobachten.</div>
      <div class="lsk-k3-teil"><span>Ergebnis</span>
        Es entsteht eine Wechselspannung mit dem Scheitelwert ${_fpmNum(_genUmax(_gen.n, B, _gen.A, _gen.f), 3)} V.
        Sie ist <b>null</b>, wenn der Schatten am größten ist, und am größten, wenn der Schatten
        zum Strich geschrumpft ist.</div>
      <div class="lsk-k3-teil"><span>Deutung</span>
        Das Feld ist konstant, also zählt allein die Änderung der <b>wirksamen Fläche</b>
        A′ = A·cos(ω·t). Ihre Ableitung ist ein Sinus – daher die Kurvenform.</div>
    </div>`;
}

// ── Station 2 ──────────────────────────────────────────
function _genSetPhiGrad(v) {
  _gen.phiGrad = ((+v % 360) + 360) % 360;
  const sl = document.getElementById('genPhiSl'); if (sl) sl.value = String(_gen.phiGrad);
  _genRenderHerleitung();
}
function _genSchritt(d) {
  _gen.schritt = d === 99 ? 4 : Math.max(0, Math.min(4, _gen.schritt + d));
  _genRenderHerleitung();
}
const _GEN_SCHRITTE = [
  { k: 'Was sich hier ändert – und was nicht',
    t: 'Das Magnetfeld der Helmholtzspulen wird während des Versuchs <b>nicht verändert</b>. Also ist Ḃ = 0. Von den beiden Induktionsursachen bleibt damit nur eine übrig: die zeitlich veränderliche wirksame Fläche.',
    f: 'U<sub>ind</sub> = −n · (Ȧ′·B + A′·Ḃ) = −n · B · Ȧ′' },
  { k: 'Die wirksame Fläche ist eine Projektion',
    t: 'Wirksam ist nur der Anteil der Spulenfläche, der vom Feld <b>senkrecht</b> durchsetzt wird. Kippt man die Spule um den Winkel φ, so erscheint eine ihrer Seiten verkürzt: b′ = b·cos φ. Genau diese Projektion macht der Schattenwurf sichtbar.',
    f: 'A′ = a · b · cos φ = A · cos φ' },
  { k: 'Gleichmäßige Drehung',
    t: 'Die Spule wird mit konstanter Winkelgeschwindigkeit gedreht. Dann wächst der Drehwinkel gleichmäßig mit der Zeit.',
    f: 'φ = ω · t   mit   ω = 2π · f' },
  { k: 'Einsetzen und ableiten',
    t: 'Jetzt steht alles beisammen. Beim Ableiten des Kosinus nach der Zeit entsteht nach der <b>Kettenregel</b> ein Sinus – und der Faktor ω fällt dabei mit heraus. Das ist der eigentliche Grund für die Kurvenform.',
    f: 'U = −n · B · d(A·cos(ω·t))/dt = n · B · A · ω · sin(ω·t)' },
  { k: 'Das Ergebnis',
    t: 'Die induzierte Spannung ist sinusförmig, ihr Scheitelwert ist das Produkt der vier Größen Windungszahl, Feldstärke, Fläche und Kreisfrequenz. Alle vier gehen <b>proportional</b> ein.',
    f: 'U(t) = Û · sin(ω·t)   mit   <b>Û = n · B · A · ω</b>' }
];
function _genRenderHerleitung() {
  const el = document.getElementById('genSchritte');
  if (el) {
    el.innerHTML = _GEN_SCHRITTE.map((sc, i) => {
      const aktiv = i <= _gen.schritt;
      return `<div class="lsk-schritt${aktiv ? ' an' : ''}${i === _gen.schritt ? ' jetzt' : ''}">
        <span class="lsk-schritt-n">${i + 1}</span>
        <div><div class="lsk-schritt-k">${sc.k}</div>
        ${aktiv ? '<div class="lsk-schritt-t">' + sc.t + '</div>' : ''}
        ${aktiv ? '<div class="lsk-schritt-f">' + sc.f + '</div>' : ''}</div></div>`;
    }).join('');
  }
  const lbl = document.getElementById('genPhiLbl');
  if (lbl) lbl.textContent = Math.round(_gen.phiGrad) + '°';

  const ph = _gen.phiGrad * Math.PI / 180;
  const p = document.getElementById('genPhase');
  if (p) {
    const c = Math.cos(ph), si = Math.sin(ph);
    p.innerHTML = `<div class="git-sch-kopf">Fläche und Spannung an dieser Stelle</div>
      <div class="gen-phase-z"><span>Projektionsfläche</span>
        <b>A′ / A = cos φ = ${_fpmNum(c, 3)}</b></div>
      <div class="gen-phase-z"><span>Spannung</span>
        <b>U / Û = sin φ = ${_fpmNum(si, 3)}</b></div>
      <div class="gen-phase-h">${Math.abs(c) > 0.99
        ? 'Fläche <b>maximal</b>, Spannung <b>null</b>.'
        : Math.abs(si) > 0.99
        ? 'Fläche <b>null</b>, Spannung <b>maximal</b>.'
        : 'Beide Größen liegen dazwischen.'}</div>
      <div class="fpm-note">Die beiden Kurven sind um eine <b>Viertelperiode</b> gegeneinander
        verschoben: sin φ = cos(φ + 90°). Genau das kann man im Zeitlupenvideo des Versuchs
        beobachten, indem man die Extrem- und Nullstellen von Schatten und Spannungskurve
        miteinander vergleicht.</div>`;
  }
  const t = document.getElementById('genTabelle');
  if (t) {
    const zeilen = [0, 90, 180, 270, 360].map(function (g) {
      const r = g * Math.PI / 180;
      const jetzt = Math.abs(((_gen.phiGrad - g) % 360 + 360) % 360) < 8;
      return `<tr class="${jetzt ? 'hell' : ''}"><td>${g}°</td>
        <td>${_fpmNum(Math.cos(r), 2)}</td>
        <td>${Math.abs(Math.cos(r)) > 0.99 ? '<b>maximal</b>' : Math.abs(Math.cos(r)) < 0.01 ? 'null' : '—'}</td>
        <td>${_fpmNum(Math.sin(r), 2)}</td>
        <td>${Math.abs(Math.sin(r)) > 0.99 ? '<b>maximal</b>' : Math.abs(Math.sin(r)) < 0.01 ? 'null' : '—'}</td></tr>`;
    }).join('');
    t.innerHTML = `<div class="git-sch-kopf">Die vier ausgezeichneten Lagen</div>
      <table class="sim-table thr-tab">
        <thead><tr><th>φ</th><th>cos φ</th><th>Fläche A′</th><th>sin φ</th><th>Spannung U</th></tr></thead>
        <tbody>${zeilen}</tbody></table>
      <div class="fpm-note">Wo die eine Größe einen Extremwert hat, hat die andere eine
        Nullstelle – und umgekehrt. Das ist der experimentelle Beleg dafür, dass die Ableitung
        eines Kosinus ein Sinus ist.</div>`;
  }
}

// ── Station 3: Messreihe ───────────────────────────────
function _genTake() {
  const B = _genB(_gen.hI);
  _gen.rows.push({ id: _gen.nextId++, f: _gen.f, I: _gen.hI, B, A: _gen.A, n: _gen.n,
                   U: _genUmax(_gen.n, B, _gen.A, _gen.f) });
  _genRenderTable(); _genDrawPlot();
}
function _genDelRow(id) { _gen.rows = _gen.rows.filter(r => r.id !== id); _genRenderTable(); _genDrawPlot(); }
function _genClear() {
  if (_gen.rows.length && !confirm('Alle ' + _gen.rows.length + ' Messwerte löschen?')) return;
  _gen.rows = []; _genRenderTable(); _genDrawPlot();
}
function _genDemo() {
  const nimm = (f, I, A, n) => {
    const B = _genB(I);
    _gen.rows.push({ id: _gen.nextId++, f, I, B, A, n, U: _genUmax(n, B, A, f) });
  };
  [0.5, 1, 2, 3, 4, 5, 6].forEach(f => nimm(f, 2.0, _GEN_A0, _GEN_N0));
  [0.5, 1.0, 1.5, 2.0, 2.5, 3.0].forEach(I => nimm(2.0, I, _GEN_A0, _GEN_N0));
  [15, 25, 42, 55, 70, 80].forEach(a => nimm(2.0, 2.0, a * 1e-4, _GEN_N0));
  [1000, 2500, 4000, 8000, 10000, 12000].forEach(n => nimm(2.0, 2.0, _GEN_A0, n));
  _genRenderTable(); _genDrawPlot();
}
function _genRenderTable() {
  const tb = document.getElementById('genTbody'); if (!tb) return;
  const leer = document.getElementById('genEmpty');
  if (leer) leer.style.display = _gen.rows.length ? 'none' : 'block';
  tb.innerHTML = _gen.rows.map((r, i) =>
    `<tr><td>${i + 1}</td><td>${_fpmNum(r.f, 1)}</td><td>${_fpmNum(r.B * 1000, 3)}</td>
       <td>${_fpmNum(r.A * 1e4, 0)}</td><td>${Math.round(r.n)}</td>
       <td><b>${_fpmNum(r.U, 3)}</b></td>
       <td class="fpm-del" onclick="_genDelRow(${r.id})" title="löschen">✕</td></tr>`).join('');
}
function _genRenderMess() {
  const el = document.getElementById('genMessRechnung'); if (!el) return;
  const B = _genB(_gen.hI);
  const Um = _genUmax(_gen.n, B, _gen.A, _gen.f);
  el.innerHTML = `
    <div class="pho-rz"><span class="pho-rz-t">Kreisfrequenz</span>
      <span class="pho-rz-f">ω = 2π·f</span><span class="pho-rz-v">${_fpmNum(_genOmega(_gen.f), 2)} 1/s</span></div>
    <div class="pho-rz"><span class="pho-rz-t">Magnetfeld</span>
      <span class="pho-rz-f">B</span><span class="pho-rz-v">${_fpmNum(B * 1000, 3)} mT</span></div>
    <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">Scheitelwert</span>
      <span class="pho-rz-f">Û = n · B · A · ω</span><span class="pho-rz-v">${_fpmNum(Um, 3)} V</span></div>
    <div class="fpm-note">Verändere <b>immer nur eine</b> der vier Größen und halte die anderen
      fest – anders lässt sich keine der vier Proportionalitäten belegen.</div>`;
}

const _GEN_PRESETS = [
  { xl: 'Drehfrequenz f in Hz', yl: 'Scheitelwert Û in V',
    x: r => r.f, y: r => r.U,
    fest: r => Math.abs(r.I - _gen.hI) < 1e-9 && Math.abs(r.A - _gen.A) < 1e-12 && r.n === _gen.n,
    k: () => _gen.n * _genB(_gen.hI) * _gen.A * 2 * Math.PI, ktxt: 'n · B · A · 2π',
    note: 'Nur Messwerte mit demselben Feld, derselben Fläche und Windungszahl gehören auf diese Gerade.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)', form: 'Û = (n·B·A·2π) · f',
    deutung: 'Wegen ω = 2π·f wächst der Scheitelwert proportional zur Drehfrequenz. Das ist der praktisch wichtigste Zusammenhang: Ein Generator liefert beim schnelleren Drehen nicht nur eine höhere Frequenz, sondern auch eine höhere Spannung. Deshalb muss die Drehzahl im Kraftwerk sehr genau gehalten werden.' },
  { xl: 'Magnetfeld B in mT', yl: 'Scheitelwert Û in V',
    x: r => r.B * 1000, y: r => r.U,
    fest: r => Math.abs(r.f - _gen.f) < 1e-9 && Math.abs(r.A - _gen.A) < 1e-12 && r.n === _gen.n,
    k: () => _gen.n * _gen.A * _genOmega(_gen.f) / 1000, ktxt: 'n · A · ω',
    note: 'Nur Messwerte mit derselben Drehfrequenz, Fläche und Windungszahl gehören auf diese Gerade.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)', form: 'Û = (n·A·ω) · B',
    deutung: 'Das Feld verändert man über den Strom durch die Helmholtzspulen. Wichtig ist dabei ein stabilisiertes Netzteil: Schwankt der Strom, so ändert sich B mit der Zeit – und man misst eine zusätzliche Induktionsspannung aus der falschen Ursache.' },
  { xl: 'Spulenfläche A in cm²', yl: 'Scheitelwert Û in V',
    x: r => r.A * 1e4, y: r => r.U,
    fest: r => Math.abs(r.f - _gen.f) < 1e-9 && Math.abs(r.I - _gen.hI) < 1e-9 && r.n === _gen.n,
    k: () => _gen.n * _genB(_gen.hI) * _genOmega(_gen.f) * 1e-4, ktxt: 'n · B · ω',
    note: 'Nur Messwerte mit derselben Drehfrequenz, demselben Feld und derselben Windungszahl gehören auf diese Gerade.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)', form: 'Û = (n·B·ω) · A',
    deutung: 'Je größer die Spulenfläche, desto mehr Fluss wird umgeschlossen und desto größer ist seine Änderungsrate. Diese Proportionalität lässt sich nur prüfen, wenn man Spulen verschiedener Geometrie zur Verfügung hat – die Handreichung nennt das ausdrücklich als Möglichkeit.' },
  { xl: 'Windungszahl n', yl: 'Scheitelwert Û in V',
    x: r => r.n, y: r => r.U,
    fest: r => Math.abs(r.f - _gen.f) < 1e-9 && Math.abs(r.I - _gen.hI) < 1e-9 && Math.abs(r.A - _gen.A) < 1e-12,
    k: () => _genB(_gen.hI) * _gen.A * _genOmega(_gen.f), ktxt: 'B · A · ω',
    note: 'Nur Messwerte mit derselben Drehfrequenz, demselben Feld und derselben Fläche gehören auf diese Gerade.',
    typ: 'Ursprungsgerade (proportionale Zuordnung)', form: 'Û = (B·A·ω) · n',
    deutung: 'Jede Windung liefert denselben Beitrag, und alle liegen in Reihe – deshalb addieren sich ihre Spannungen. Genau darum verwendet die Handreichung eine Spule mit 8000 Windungen: So wird die Spannung ohne Messverstärker gut messbar.' }
];
function _genSetPreset(i) {
  _gen.preset = i;
  for (let k = 0; k < 4; k++) document.getElementById('genTab' + k)?.classList.toggle('on', k === i);
  if (_gen.fnAuto) _genTheorieFn(); else _genRenderTheorie(false);
  _genDrawPlot();
}
function _genTheorieFn() {
  const term = _genZahl(_GEN_PRESETS[_gen.preset].k()) + '*x';
  const inp = document.getElementById('genFn'); if (inp) inp.value = term;
  _genSetFn(term); _gen.fnAuto = true; _genRenderTheorie(true);
}
function _genClearFn() {
  const inp = document.getElementById('genFn'); if (inp) inp.value = '';
  _genSetFn(''); _genRenderTheorie(false);
}
function _genRenderTheorie(eingesetzt) {
  const el = document.getElementById('genTheo'); if (!el) return;
  const P = _GEN_PRESETS[_gen.preset];
  el.innerHTML = `<div class="fpm-theo-kopf">Erwarteter Funktionstyp</div>
    <div class="fpm-theo-typ">${P.typ}</div>
    <div class="fpm-theo-form">${P.form}</div>
    <div class="fpm-theo-par">gesucht: die Steigung ${P.ktxt}</div>
    ${eingesetzt ? `<div class="fpm-theo-term">eingesetzt: f(x) = ${_genZahl(P.k())}*x</div>` : ''}
    <div class="fpm-theo-deutung">${P.deutung}</div>`;
}
function _genSetFn(str) {
  _gen.fnAuto = false;
  const err = document.getElementById('genFnErr');
  const v = (str || '').trim();
  if (!v) { _gen.fn = null; if (err) err.textContent = ''; _genDrawPlot(); return; }
  try {
    const f = _fpmMakeFn(v);
    if (typeof f(1) !== 'number') throw new Error('kein Zahlenwert');
    _gen.fn = f; if (err) err.textContent = '';
  } catch (e) { _gen.fn = null; if (err) err.textContent = e.message; }
  _genDrawPlot();
}
function _genDrawPlot() {
  const cv = document.getElementById('genPlot');
  if (!cv || !_gen) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const P = _GEN_PRESETS[_gen.preset];
  const padL = 58, padR = 12, padT = 12, padB = 38;
  const x0 = padL, y0 = H - padB, x1 = W - padR, y1 = padT;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  const alle = _gen.rows.map(r => ({ x: P.x(r), y: P.y(r), passt: P.fest(r) }))
    .filter(p => isFinite(p.x) && isFinite(p.y));
  const pts = alle.filter(p => p.passt);
  const xmax = Math.max(1e-9, alle.length ? Math.max(...alle.map(p => p.x)) * 1.12 : 1);
  const ymax = Math.max(1e-9, alle.length ? Math.max(...alle.map(p => p.y)) * 1.15 : 1);
  const X = v => x0 + v / xmax * (x1 - x0);
  const Y = v => y0 - v / ymax * (y0 - y1);

  const xt = _fpmTicks(xmax, 5);
  ctx.font = '10px sans-serif'; ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  xt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
    ctx.fillText(_fpmTickLbl(v, xt.step), X(v), y0 + 13);
  });
  const yt = _fpmTicks(ymax, 4);
  yt.ticks.forEach(v => {
    ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
    ctx.fillText(_fpmTickLbl(v, yt.step), x0 - 5, Y(v) + 3);
  });
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(P.xl, x1, y0 + 27);
  ctx.save(); ctx.translate(13, y1 + 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText(P.yl, 0, 0); ctx.restore();
  ctx.textAlign = 'left';

  if (!alle.length) {
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.font = '11px sans-serif';
    ctx.fillText('Noch keine Messwerte', (x0 + x1) / 2, (y0 + y1) / 2);
    ctx.textAlign = 'left';
    const fo = document.getElementById('genFitBox');
    if (fo) fo.innerHTML = '<div class="fpm-note">' + P.note + '</div>';
    return;
  }
  if (_gen.fn) {
    ctx.strokeStyle = '#db2777'; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let beg = false;
    for (let px = x0; px <= x1; px += 2) {
      let yv; try { yv = _gen.fn((px - x0) / (x1 - x0) * xmax); } catch (e) { yv = NaN; }
      if (!isFinite(yv)) { beg = false; continue; }
      const py = Y(yv);
      if (py < y1 - 30 || py > y0 + 30) { beg = false; continue; }
      beg ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), beg = true);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }
  let fit = null;
  if (pts.length >= 2) {
    fit = _fpmFitOrigin(pts);
    if (fit) {
      ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.7;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(xmax), Y(fit.k * xmax)); ctx.stroke();
    }
  }
  alle.forEach(p => {
    ctx.fillStyle = p.passt ? '#7c3aed' : '#e2e8f0';
    ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), p.passt ? 4 : 3, 0, 2 * Math.PI); ctx.fill();
    if (p.passt) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke(); }
  });

  const fo = document.getElementById('genFitBox');
  if (fo) {
    const soll = P.k();
    if (!fit) {
      fo.innerHTML = '<div class="fpm-note">Mindestens zwei Messwerte nötig, bei denen die '
        + 'übrigen Größen <b>gleich</b> sind.<br>' + P.note + '</div>';
    } else {
      const abw = Math.abs(fit.k - soll) / Math.abs(soll) * 100;
      const cls = abw < 1 ? 'ok' : abw < 5 ? 'mid' : 'no';
      fo.innerHTML = `<div class="fpm-fitline">
        <span class="fpm-fitmeta">${pts.length} passende Messwerte${
          alle.length > pts.length ? ', ' + (alle.length - pts.length) + ' andere blass' : ''}</span>
        <span class="fpm-fiteq">y = ${_fpmNum(fit.k, 5)}·x</span>
        <span class="fpm-fitmeta">R² = ${_fpmNum(fit.r2, 5)}</span>
        <span class="fpm-fiteq" style="color:#5b21b6">Steigung = ${P.ktxt} = ${_fpmNum(soll, 5)}</span>
        ${_gen.reveal ? `<span class="fpm-badge ${cls}">Abweichung ${_fpmNum(abw, 2)} %</span>` : ''}
      </div><div class="fpm-note" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">${P.note}</div>`;
    }
  }
}

// ── Station 4: Erdinduktor ─────────────────────────────
function _genSetET(v) {
  _gen.eT = Math.max(0.25, Math.min(1.2, +v));
  const el = document.getElementById('genETLbl');
  if (el) el.textContent = _fpmNum(_gen.eT, 2) + ' s';
  _gen.eSpur = []; _gen.et = 0; _gen.eGeprueft = null;
  _genRenderErde();
}
function _genSetVerst(v) { _gen.eVerstaerkt = !!v; _gen.eSpur = []; _gen.et = 0; _genRenderErde(); }
function _genSetLese(feld, v) { _gen[feld] = v; _genRenderErde(); }
function _genErdLeseAus() {
  const u = parseFloat(String(_gen.eLeseU).replace(',', '.'));
  const t = parseFloat(String(_gen.eLeseT).replace(',', '.'));
  const r = {};
  if (isFinite(u) && u > 0) r.Uanzeige = u / 1000;
  if (isFinite(t) && t > 0) { r.T = t; r.omega = 2 * Math.PI / t; }
  if (r.Uanzeige !== undefined && r.T !== undefined) {
    r.U = r.Uanzeige / (_gen.eVerstaerkt ? _GEN_VERST : 1);
    r.BH = _genBHAus(r.Uanzeige, r.T, _gen.eVerstaerkt);
  }
  return r;
}
function _genErdPruefen() {
  const r = _genErdLeseAus();
  _gen.eGeprueft = r.BH !== undefined
    ? { BH: r.BH, abw: Math.abs(r.BH - _GEN_BH) / _GEN_BH * 100 } : { BH: NaN };
  _genRenderErde();
}
function _genRenderErde() {
  const a = document.getElementById('genErdAufgabe');
  if (a) {
    a.innerHTML = `<div class="git-sch-kopf">Das Erdmagnetfeld messen – nach Gauß und Weber</div>
      <div class="gen-erd-t">
        Eine Spule mit n = ${_GEN_N0} Windungen und A = ${_fpmNum(_GEN_A0 * 1e4, 0)} cm² wird von
        einem Motor um eine <b>senkrechte</b> Achse gedreht. Ihre Flächennormale bleibt dabei
        immer waagerecht – deshalb kann nur die <b>waagerechte</b> Komponente
        B<sub>H</sub> des Erdfeldes den Fluss beeinflussen. Die senkrechte Komponente liegt
        dauerhaft in der Spulenebene und trägt gar nichts bei.
      </div>
      <div class="gen-erd-t" style="margin-top:6px">
        Lies aus dem Diagramm den Scheitelwert und die Periodendauer ab und berechne daraus
        B<sub>H</sub>. <b>Achte auf den Messverstärker</b> – die angezeigte Spannung ist um den
        Faktor ${_GEN_VERST} zu groß.
      </div>`;
  }
  const el = document.getElementById('genErdRechnung');
  if (el) {
    const r = _genErdLeseAus();
    if (r.BH === undefined) {
      el.innerHTML = '<div class="fpm-note">Trage Scheitelwert und Periodendauer ein. Aus '
        + 'Û = n·B<sub>H</sub>·A·ω folgt umgestellt B<sub>H</sub> = Û/(n·A·ω).</div>';
    } else {
      el.innerHTML = `
        <div class="pho-rz"><span class="pho-rz-t">abgelesener Scheitelwert</span>
          <span class="pho-rz-f">Anzeige</span>
          <span class="pho-rz-v">${_fpmNum(r.Uanzeige * 1000, 2)} mV</span></div>
        <div class="pho-rz"><span class="pho-rz-t">${_gen.eVerstaerkt
          ? 'geteilt durch die Verstärkung' : 'ohne Verstärker – unverändert'}</span>
          <span class="pho-rz-f">Û = Anzeige / ${_gen.eVerstaerkt ? _GEN_VERST : 1}</span>
          <span class="pho-rz-v">${_fpmNum(r.U * 1000, 3)} mV</span></div>
        <div class="pho-rz"><span class="pho-rz-t">Kreisfrequenz</span>
          <span class="pho-rz-f">ω = 2π/T</span>
          <span class="pho-rz-v">${_fpmNum(r.omega, 2)} 1/s</span></div>
        <div class="pho-rz pho-rz-erg"><span class="pho-rz-t">waagerechte Feldkomponente</span>
          <span class="pho-rz-f">B<sub>H</sub> = Û / (n·A·ω)</span>
          <span class="pho-rz-v">${_fpmNum(r.BH * 1e6, 2)} µT</span></div>`;
    }
  }
  const pr = document.getElementById('genErdPruef');
  if (pr) {
    const g = _gen.eGeprueft;
    if (!g) { pr.className = 'lsk-zustand'; pr.innerHTML = 'Trage deine Ablesung ein und prüfe sie.'; }
    else if (!isFinite(g.BH)) { pr.className = 'lsk-zustand no'; pr.innerHTML = 'Es fehlt noch eine Angabe.'; }
    else {
      const gut = g.abw < 10;
      const faktor10 = g.abw > 700;
      pr.className = 'lsk-zustand ' + (gut ? 'ok' : 'no');
      pr.innerHTML = (gut ? '<b>Das passt.</b> ' : '<b>Da stimmt etwas nicht.</b> ')
        + 'Der Sollwert ist B<sub>H</sub> = ' + _fpmNum(_GEN_BH * 1e6, 1)
        + ' µT, du erhältst ' + _fpmNum(g.BH * 1e6, 1) + ' µT – '
        + _fpmNum(g.abw, 1) + ' % daneben.'
        + (faktor10 ? ' Das sieht nach dem <b>Verstärkungsfaktor ' + _GEN_VERST
          + '</b> aus: Die angezeigte Spannung muss erst durch ihn geteilt werden.' : '')
        + (gut ? ' Zum Vergleich: Das gesamte Erdfeld beträgt hier rund '
          + _fpmNum(_genBGesamt() * 1e6, 0) + ' µT.' : '');
    }
  }
  const v = document.getElementById('genErdVertikal');
  if (v) {
    v.innerHTML = `<div class="git-sch-kopf">Und die senkrechte Komponente?</div>
      <div class="gen-erd-t">
        Die Handreichung stellt genau diese Anschlussfrage. Die Antwort ist naheliegend: Man
        <b>kippt die Drehachse um 90°</b>, sodass sie waagerecht liegt. Dann steht die
        Flächennormale immer senkrecht, und nur noch die <b>Vertikalkomponente</b>
        B<sub>V</sub> beeinflusst den Fluss. Aus beiden Messungen zusammen erhält man das
        gesamte Erdfeld und seine Richtung:
      </div>
      <div class="gen-erd-z"><span>Betrag</span>
        <b>B = √(B<sub>H</sub>² + B<sub>V</sub>²) = ${_fpmNum(_genBGesamt() * 1e6, 1)} µT</b></div>
      <div class="gen-erd-z"><span>Inklination</span>
        <b>tan α = B<sub>V</sub>/B<sub>H</sub> → α = ${_fpmNum(_genInklination(), 1)}°</b></div>
      <div class="fpm-note">Der Inklinationswinkel gibt an, wie steil die Feldlinien in den Boden
        eintauchen – in Mitteleuropa recht steil. Deshalb ist die senkrechte Komponente hier
        deutlich größer als die waagerechte, obwohl eine Kompassnadel nur die waagerechte anzeigt.</div>`;
  }
}

// ── Station 5 ──────────────────────────────────────────
function _genSetEpoche(i) {
  _gen.epoche = Math.max(0, Math.min(_GEN_EPOCHEN.length - 1, i));
  _genRenderHist();
}
function _genRenderHist() {
  const z = document.getElementById('genZeitleiste');
  if (z) {
    z.innerHTML = `<div class="git-sch-kopf">Vier Schritte bis zur Steckdose</div>
      <div class="gen-zeit-reihe">${_GEN_EPOCHEN.map((e, i) =>
        `<button class="gen-zeit-p${i === _gen.epoche ? ' on' : ''}" onclick="_genSetEpoche(${i})">
           <span>${e.j}</span>${e.n}</button>`).join('')}</div>`;
  }
  const h = document.getElementById('genHist');
  if (h) {
    const e = _GEN_EPOCHEN[_gen.epoche];
    h.innerHTML = `<div class="gen-hist-j">${e.j}</div>
      <div class="gen-hist-n">${e.n}</div>
      <div class="gen-hist-t">${e.t}</div>
      <div class="fpm-note">Die Handreichung schlägt die „Historische Entwicklung der
        Generatortechnik" ausdrücklich als Rechercheaufgabe vor – die Sammlung des Deutschen
        Museums zur Dynamomaschine ist dafür ein guter Ausgangspunkt.</div>`;
  }
  const a = document.getElementById('genAusblick');
  if (a) {
    a.innerHTML = `<div class="gen-aus-z"><b>Gleichstromgenerator</b> Ein <i>Kommutator</i>
        – ein geteilter Schleifring – polt die Spule bei jedem Nulldurchgang um. Aus der
        Wechselspannung wird dadurch eine pulsierende Gleichspannung.</div>
      <div class="gen-aus-z"><b>Drehstrom</b> Drei um je 120° versetzte Wicklungen liefern drei
        Wechselspannungen mit derselben Verschiebung. So arbeitet jedes Kraftwerk – und so
        entsteht ein Drehfeld, mit dem sich Motoren antreiben lassen.</div>
      <div class="gen-aus-z"><b>Phasenlage und Wechselstromwiderstände</b> Spulen und
        Kondensatoren verschieben Strom und Spannung gegeneinander. Daraus folgt der Begriff der
        <i>Blindleistung</i> – und die Frage, welche Leistung im Wechselstromkreis tatsächlich
        umgesetzt wird.</div>
      <div class="fpm-note">Alle drei stehen in der Handreichung als fakultative Vertiefungen –
        sie gehören nicht zur Obligatorik des Grundkurses, eignen sich aber gut für Facharbeiten.</div>`;
  }
}

// ── Zeichnungen ────────────────────────────────────────
function _genRenderAufbau(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const cx = 210, cy = 118;
  const phi = _genPhi(_gen.t, _gen.f);

  // Helmholtzspulen von der Seite
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 8;
  [-96, 96].forEach(dx => {
    ctx.beginPath(); ctx.moveTo(cx + dx, cy - 76); ctx.lineTo(cx + dx, cy + 76); ctx.stroke();
  });
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Helmholtzspulen', cx, 16);
  // Feldlinien
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  for (let i = -3; i <= 3; i++) {
    const y = cy + i * 22;
    ctx.beginPath(); ctx.moveTo(cx - 90, y); ctx.lineTo(cx + 90, y); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 84, y - 3); ctx.lineTo(cx + 90, y); ctx.lineTo(cx + 84, y + 3); ctx.stroke();
  }
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('B', cx + 94, cy - 62);

  // Die drehbare Spule, in Aufsicht als Ellipse mit der Breite A·|cos φ|
  const halbBreit = Math.abs(Math.cos(phi)) * 46 + 2;
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(cx, cy, halbBreit, 44, 0, 0, 2 * Math.PI); ctx.stroke();
  // Drehachse
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy - 62); ctx.lineTo(cx, cy + 62); ctx.stroke();
  // Flaechennormale
  const nx = Math.cos(phi), nl = 40;
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + nx * nl, cy); ctx.stroke();
  ctx.fillStyle = '#16a34a';
  const sg = nx >= 0 ? 1 : -1;
  ctx.beginPath();
  ctx.moveTo(cx + nx * nl + sg * 7, cy);
  ctx.lineTo(cx + nx * nl, cy - 4); ctx.lineTo(cx + nx * nl, cy + 4);
  ctx.closePath(); ctx.fill();
  ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('n⃗', cx + nx * nl / 2, cy - 7);

  // Lampe und Schattenwurf
  if (_gen.schatten) {
    ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(20, cy, 11, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Lampe', 20, cy + 24);
    // Der Schatten auf einem Schirm rechts
    const sx = W - 26;
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(sx - 4, cy - 62, 8, 124);
    const sh = Math.abs(Math.cos(phi)) * 44;
    ctx.fillStyle = 'rgba(88,28,135,0.55)';
    ctx.fillRect(sx - 3, cy - sh, 6, 2 * sh);
    ctx.fillStyle = '#5b21b6'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('Schatten = A′', sx - 10, cy - 66);
    ctx.fillText(_fpmNum(_genAeff(_gen.t, _gen.f, _gen.A) * 1e4, 1) + ' cm²', sx - 10, cy + 76);
  }

  // Schleifkontakte
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy + 62); ctx.lineTo(cx - 6, H - 20); ctx.lineTo(cx - 60, H - 20);
  ctx.moveTo(cx + 6, cy + 62); ctx.lineTo(cx + 6, H - 12); ctx.lineTo(cx - 60, H - 12);
  ctx.stroke();
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Schleifkontakte', cx + 12, H - 14);
  ctx.textAlign = 'left';
}

function _genRenderOszi(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const x0 = 46, x1 = W - 12;
  const spanne = 3 / Math.max(0.2, _gen.f);   // etwa drei Perioden
  const B = _genB(_gen.hI);
  const Um = Math.max(1e-12, _genUmax(_gen.n, B, _gen.A, _gen.f));

  const band = (yo, yu, farbe, fn, name, einheit, max) => {
    const my = (yo + yu) / 2;
    ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, my); ctx.lineTo(x1, my); ctx.stroke();
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath(); ctx.moveTo(x0, yo); ctx.lineTo(x0, yu); ctx.stroke();
    ctx.strokeStyle = farbe; ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let px = 0; px <= x1 - x0; px++) {
      const t = _gen.t - spanne + px / (x1 - x0) * spanne;
      const y = my - fn(t) / max * (my - yo - 3);
      px ? ctx.lineTo(x0 + px, y) : ctx.moveTo(x0 + px, y);
    }
    ctx.stroke();
    // Marke fuer den aktuellen Wert
    ctx.fillStyle = farbe;
    const yj = my - fn(_gen.t) / max * (my - yo - 3);
    ctx.beginPath(); ctx.arc(x1, yj, 3.5, 0, 2 * Math.PI); ctx.fill();
    ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(name, x0 + 3, yo + 10);
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(_fpmNum(max, 2) + ' ' + einheit, x0 - 4, yo + 10);
    ctx.fillText('0', x0 - 4, my + 3);
    ctx.fillText('−' + _fpmNum(max, 2), x0 - 4, yu - 2);
  };
  band(14, 108, '#5b21b6', t => _genAeff(t, _gen.f, _gen.A) * 1e4,
       'Projektionsfläche A′ = A·cos(ω·t)', 'cm²', _gen.A * 1e4);
  band(128, 222, '#0369a1', t => _genU(t, _gen.n, B, _gen.A, _gen.f),
       'Induktionsspannung U = Û·sin(ω·t)', 'V', Um);

  // Die Viertelperiode zwischen den Kurven markieren
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(x1, 14); ctx.lineTo(x1, 222); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('um eine Viertelperiode gegeneinander verschoben', (x0 + x1) / 2, 120);
  ctx.textAlign = 'left';
}

function _genRenderNormale(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const cx = 150, cy = 120;
  const phi = _gen.phiGrad * Math.PI / 180;

  // Feld
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  for (let i = -3; i <= 3; i++) {
    const y = cy + i * 24;
    ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(280, y); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(274, y - 3); ctx.lineTo(280, y); ctx.lineTo(274, y + 3); ctx.stroke();
  }
  ctx.fillStyle = '#64748b'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('B', 284, cy - 66);

  // Die Spulenflaeche als Ellipse
  const halb = Math.abs(Math.cos(phi)) * 52 + 2;
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(cx, cy, halb, 50, 0, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = 'rgba(124,58,237,0.12)'; ctx.fill();

  // Normale
  const nl = 62, nx = Math.cos(phi), ny = -Math.sin(phi) * 0.35;
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + nx * nl, cy + ny * nl); ctx.stroke();
  ctx.fillStyle = '#16a34a';
  const ex = cx + nx * nl, ey = cy + ny * nl;
  const l = Math.hypot(nx, ny) || 1;
  ctx.beginPath();
  ctx.moveTo(ex + nx / l * 8, ey + ny / l * 8);
  ctx.lineTo(ex - ny / l * 4 - nx / l * 2, ey + nx / l * 4 - ny / l * 2);
  ctx.lineTo(ex + ny / l * 4 - nx / l * 2, ey - nx / l * 4 - ny / l * 2);
  ctx.closePath(); ctx.fill();
  ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Normale n⃗', ex + 22, ey - 8);

  // Winkel
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(cx, cy, 26, 0, -phi, phi > 0);
  ctx.stroke();
  ctx.fillStyle = '#7c3aed'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('φ = ' + Math.round(_gen.phiGrad) + '°', cx + 30, cy - 12);

  // Balken fuer cos und sin
  const bx = 320, bw = 96;
  ['cos φ  →  A′', 'sin φ  →  U'].forEach(function (name, i) {
    const by = 60 + i * 76;
    const wert = i === 0 ? Math.cos(phi) : Math.sin(phi);
    ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(name, bx, by - 8);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, 16);
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath(); ctx.moveTo(bx + bw / 2, by - 3); ctx.lineTo(bx + bw / 2, by + 19); ctx.stroke();
    ctx.fillStyle = i === 0 ? '#7c3aed' : '#0369a1';
    const w = wert * bw / 2;
    ctx.fillRect(Math.min(bx + bw / 2, bx + bw / 2 + w), by + 1, Math.abs(w), 14);
    ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(_fpmNum(wert, 3), bx + bw / 2, by + 32);
  });
  ctx.textAlign = 'left';
}

function _genRenderErdeCv(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const cx = 150, cy = 122;
  const phi = 2 * Math.PI / _gen.eT * _gen.et;

  // Erdfeld: von Sued nach Nord, geneigt
  const ink = _genInklination() * Math.PI / 180;
  ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 1.4;
  for (let i = -2; i <= 2; i++) {
    const y0 = cy + i * 30 - 60;
    ctx.beginPath();
    ctx.moveTo(20, y0);
    ctx.lineTo(280, y0 + Math.tan(ink) * 100);
    ctx.stroke();
  }
  ctx.fillStyle = '#3b82f6'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Erdfeld, Inklination ' + _fpmNum(_genInklination(), 0) + '°', 20, 16);
  ctx.fillText('Süden', 20, H - 8);
  ctx.textAlign = 'right';
  ctx.fillText('Norden', 280, H - 8);
  ctx.textAlign = 'left';

  // Senkrechte Drehachse
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy - 70); ctx.lineTo(cx, cy + 70); ctx.stroke();
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('senkrechte Drehachse', cx, cy + 84);

  // Die Spule
  const halb = Math.abs(Math.cos(phi)) * 44 + 2;
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(cx, cy, halb, 46, 0, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#5b21b6'; ctx.font = '9px sans-serif';
  ctx.fillText('n = ' + _GEN_N0 + ', A = ' + _fpmNum(_GEN_A0 * 1e4, 0) + ' cm²', cx, cy - 82);

  // Die beiden Komponenten
  const kx = 330, ky = 90;
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx + 60, ky); ctx.stroke();
  ctx.fillStyle = '#16a34a'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('B_H  ' + _fpmNum(_GEN_BH * 1e6, 1) + ' µT', kx, ky - 6);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx, ky + 66); ctx.stroke();
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('B_V  ' + _fpmNum(_GEN_BV * 1e6, 1) + ' µT', kx + 4, ky + 60);
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx + 60, ky + 66); ctx.stroke();
  ctx.fillStyle = '#3b82f6'; ctx.font = '700 9px sans-serif';
  ctx.fillText('B = ' + _fpmNum(_genBGesamt() * 1e6, 0) + ' µT', kx + 22, ky + 40);
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif';
  ctx.fillText('nur B_H wirkt hier', kx, ky + 84);
  ctx.textAlign = 'left';
}

function _genRenderErdOszi(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const x0 = 50, x1 = W - 12, yo = 16, yu = H - 30;
  const my = (yo + yu) / 2;
  const spanne = 2.5;
  const Umax = _genErdUmax(_gen.eT) * (_gen.eVerstaerkt ? _GEN_VERST : 1);
  const skal = Math.max(1e-9, Umax * 1.25);

  ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const x = x0 + i / 5 * (x1 - x0);
    ctx.beginPath(); ctx.moveTo(x, yo); ctx.lineTo(x, yu); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(_fpmNum(i / 5 * spanne, 1), x, yu + 13);
  }
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0, my); ctx.lineTo(x1, my); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x0, yo); ctx.lineTo(x0, yu); ctx.stroke();

  ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let px = 0; px <= x1 - x0; px++) {
    const t = px / (x1 - x0) * spanne;
    const y = my - _genErdAnzeige(t, _gen.eT) / skal * (my - yo - 3);
    px ? ctx.lineTo(x0 + px, y) : ctx.moveTo(x0 + px, y);
  }
  ctx.stroke();

  // Hilfslinien fuer Scheitelwert und Periodendauer
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
  const yS = my - Umax / skal * (my - yo - 3);
  ctx.beginPath(); ctx.moveTo(x0, yS); ctx.lineTo(x1, yS); ctx.stroke();
  const xT = x0 + _gen.eT / spanne * (x1 - x0);
  ctx.beginPath(); ctx.moveTo(xT, yo); ctx.lineTo(xT, yu); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#b45309'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Û', x0 + 3, yS - 4);
  ctx.fillText('T', xT + 3, yo + 10);

  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(_fpmNum(skal * 1000, 0) + ' mV', x0 - 4, yo + 10);
  ctx.fillText('0', x0 - 4, my + 3);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.fillText('t in s', (x0 + x1) / 2, yu + 25);
  ctx.textAlign = 'left';
  ctx.fillStyle = _gen.eVerstaerkt ? '#dc2626' : '#16a34a'; ctx.font = '700 9px sans-serif';
  ctx.fillText(_gen.eVerstaerkt ? 'Anzeige nach dem Verstärker ×' + _GEN_VERST
    : 'ohne Verstärker – Anzeige gleich der Induktionsspannung', x0 + 3, yu - 4);
}

function _genRenderKraftwerk(ctx, cv) {
  const W = cv.width, H = cv.height;
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  const my = 108;
  const stufen = [
    { x: 46, n: 'Turbine', u: 'Dampf · Wind · Wasser', f: '#0ea5e9' },
    { x: 158, n: 'Generator', u: 'η oft über 90 %', f: '#7c3aed' },
    { x: 274, n: 'Transformator', u: 'hochspannen', f: '#f59e0b' },
    { x: 390, n: 'Netz', u: '50 Hz', f: '#16a34a' }
  ];
  stufen.forEach((s, i) => {
    ctx.fillStyle = s.f;
    ctx.beginPath(); ctx.arc(s.x, my, 26, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), s.x, my + 4);
    ctx.fillStyle = '#334155'; ctx.font = '700 10px sans-serif';
    ctx.fillText(s.n, s.x, my + 44);
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif';
    ctx.fillText(s.u, s.x, my + 57);
    if (i < stufen.length - 1) {
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s.x + 28, my); ctx.lineTo(stufen[i + 1].x - 34, my); ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(stufen[i + 1].x - 26, my);
      ctx.lineTo(stufen[i + 1].x - 34, my - 5); ctx.lineTo(stufen[i + 1].x - 34, my + 5);
      ctx.closePath(); ctx.fill();
    }
  });
  ctx.fillStyle = '#64748b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('mechanische Energie', 102, my - 40);
  ctx.fillText('elektrische Energie', 332, my - 40);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif';
  ctx.fillText('Der Generator ist der Wandler – überall dasselbe Prinzip, gleich womit die Turbine angetrieben wird.',
    W / 2, H - 14);
  ctx.textAlign = 'left';
}

// ── Takt und Zeichnung ─────────────────────────────────
function _genTakt(dt) {
  if (!_gen) return;
  const d = Math.min(0.05, dt) / _gen.zeitlupe;
  if (_gen.laeuft) _gen.t += d;
  if (_gen.eLaeuft) _gen.et += Math.min(0.05, dt);
  if (_gen.et > 100) _gen.et = 0;
}
function _genRender() {
  if (!_gen) return;
  const st = _gen.station;
  if (st === 0) {
    const ca = document.getElementById('genAufbau');
    if (ca) _genRenderAufbau(ca.getContext('2d'), ca);
    const co = document.getElementById('genOszi');
    if (co) _genRenderOszi(co.getContext('2d'), co);
    if (_gen.laeuft) _genUpdate();
  } else if (st === 1) {
    const cn = document.getElementById('genNormale');
    if (cn) _genRenderNormale(cn.getContext('2d'), cn);
  } else if (st === 3) {
    const ce = document.getElementById('genErde');
    if (ce) _genRenderErdeCv(ce.getContext('2d'), ce);
    const cz = document.getElementById('genErdOszi');
    if (cz) _genRenderErdOszi(cz.getContext('2d'), cz);
  } else if (st === 4) {
    const ck = document.getElementById('genKraftwerk');
    if (ck) _genRenderKraftwerk(ck.getContext('2d'), ck);
  }
}

// ── Zusätzliche Styles für den Generator ───────────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .gen-lage { font-size: .78rem; border-radius: 9px; padding: 9px 11px; margin: 8px 0;
      line-height: 1.55; border: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; }
    .gen-lage.flach { background: #f5f3ff; border-color: #ddd6fe; color: #5b21b6; }
    .gen-lage.kant { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
    .gen-k3 { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; margin-top: 12px; }
    .gen-phase { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 12px; margin-top: 10px; }
    .gen-phase-z { display: flex; align-items: baseline; gap: 8px; font-size: .78rem;
      color: #475569; padding: 3px 0; }
    .gen-phase-z span { flex: 0 0 132px; font-size: .66rem; text-transform: uppercase;
      letter-spacing: .04em; font-weight: 800; color: #94a3b8; }
    .gen-phase-z b { color: #5b21b6; font-variant-numeric: tabular-nums; }
    .gen-phase-h { font-size: .78rem; color: #075985; background: #f0f9ff;
      border: 1px solid #bae6fd; border-radius: 7px; padding: 6px 9px; margin: 6px 0; }
    .gen-tabelle { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 12px; margin-top: 10px; }
    .gen-erd-auf { background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 9px;
      padding: 10px 12px; margin-bottom: 8px; }
    .gen-erd-t { font-size: .78rem; color: #475569; line-height: 1.65; }
    .gen-erd-vert { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 12px; margin-top: 10px; }
    .gen-erd-z { display: flex; align-items: baseline; gap: 8px; font-size: .78rem;
      color: #475569; padding: 4px 0; }
    .gen-erd-z span { flex: 0 0 92px; font-size: .66rem; text-transform: uppercase;
      letter-spacing: .04em; font-weight: 800; color: #94a3b8; }
    .gen-erd-z b { color: #075985; font-variant-numeric: tabular-nums; }
    .gen-zeit { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 10px 12px; margin-top: 10px; }
    .gen-zeit-reihe { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
    .gen-zeit-p { flex: 1 1 92px; display: flex; flex-direction: column; gap: 2px;
      align-items: flex-start; text-align: left; padding: 7px 9px; background: #fff;
      border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer;
      font-size: .7rem; color: #475569; line-height: 1.35; }
    .gen-zeit-p:hover { border-color: #cbd5e1; }
    .gen-zeit-p.on { border-color: #7c3aed; background: #f5f3ff; color: #5b21b6; }
    .gen-zeit-p span { font-size: .8rem; font-weight: 800; color: #94a3b8; }
    .gen-zeit-p.on span { color: #7c3aed; }
    .gen-hist { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px;
      padding: 11px 13px; }
    .gen-hist-j { font-size: 1.3rem; font-weight: 800; color: #7c3aed; line-height: 1; }
    .gen-hist-n { font-size: .86rem; font-weight: 800; color: #334155; margin: 3px 0 6px; }
    .gen-hist-t { font-size: .79rem; color: #475569; line-height: 1.7; }
    .gen-aus { display: flex; flex-direction: column; gap: 6px; }
    .gen-aus-z { font-size: .77rem; color: #475569; line-height: 1.6; background: #f8fafc;
      border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; }
    .gen-aus-z b { color: #334155; }
    .gen-sim .sim-btn:disabled { opacity: .4; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();
