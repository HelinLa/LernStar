/* leinwand_bild.js - zeichnet die Leinwand einer Simulation als SVG nach.
 *
 *   node simcheck/leinwand_bild.js <physics-sim.js> <simId> <ausgabe.svg> [schritte-json] [frames]
 *
 *   schritte-json: [{"tue":"_m5aSet(1)", "frames":30}, ...]  (wie werte.js, frames optional)
 *   frames:        wie viele Frames nach dem letzten Schritt noch laufen (Voreinstellung 60)
 *
 * Danach als PNG ansehen:  qlmanage -t -s 1000 -o <ordner> <ausgabe.svg>
 *
 * Warum: In dieser Umgebung gibt es keinen Browser. Der Rauchtest sagt nur, OB sich
 * etwas bewegt; ob ein Bild lesbar ist, ob Texte sich ueberlappen oder ein Pfeil
 * ins Leere zeigt, sieht man nur am Bild. Der Nachzeichner nimmt die Zeichenbefehle
 * des LETZTEN Frames auf (Pfade, Rechtecke, Kreisboegen, Text, Transformationen) und
 * schreibt sie als SVG. Verlaeufe werden durch ihre erste Farbe ersetzt, Bilder
 * (drawImage) als graues Kaestchen angedeutet. Darunter stehen die Texte aller
 * Statuszeilen (Elemente mit id), damit Bild und Anzeige auf EINEM Blatt liegen.
 *
 * Grenzen, die man kennen muss: Schriftbreiten sind geschaetzt, clip() wird nicht
 * nachgebildet, globalCompositeOperation auch nicht. Was hier gut aussieht, ist im
 * Browser fast immer gut; das Umgekehrte gilt nicht ganz.
 */
const vm = require('vm');
const fs = require('fs');
const { baueContext } = require('./rauchtest.js');

const [datei, simId, ziel, schritteArg, framesArg] = process.argv.slice(2);
if (!datei || !simId || !ziel) {
  console.error('Aufruf: node leinwand_bild.js <physics-sim.js> <simId> <ausgabe.svg> [schritte] [frames]');
  process.exit(2);
}
const schritte = schritteArg ? JSON.parse(schritteArg) : [];
const NACHLAUF = framesArg ? +framesArg : 60;

let ops = [];                       // SVG-Elemente des laufenden Frames
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function recorder(cv) {
  const W = cv.width || 420, H = cv.height || 250;
  let m = [1, 0, 0, 1, 0, 0];         // a b c d e f
  const stapel = [];
  let pfad = [];                      // Liste von Teilpfaden, je Liste von [x,y] (schon transformiert)
  let lauf = null;
  const st = { fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, font: '10px sans-serif',
               textAlign: 'start', textBaseline: 'alphabetic', globalAlpha: 1, lineDash: [] };
  const P = (x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const farbe = f => (f && typeof f === 'object') ? (f._farbe || '#999') : (f || '#000');
  const skala = () => Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])) || 1;
  function neu(x, y) { lauf = [P(x, y)]; pfad.push(lauf); }
  function zu(x, y) { if (!lauf) neu(x, y); else lauf.push(P(x, y)); }
  function bogen(cx, cy, r, a0, a1, ccw, rx, ry, rot) {
    rx = rx == null ? r : rx; ry = ry == null ? r : ry; rot = rot || 0;
    let d = a1 - a0;
    if (!ccw && d < 0) d += Math.PI * 2 * Math.ceil(-d / (Math.PI * 2));
    if (ccw && d > 0) d -= Math.PI * 2 * Math.ceil(d / (Math.PI * 2));
    if (Math.abs(a1 - a0) >= Math.PI * 2) d = ccw ? -Math.PI * 2 : Math.PI * 2;
    const n = Math.max(8, Math.ceil(Math.abs(d) / 0.12));
    for (let i = 0; i <= n; i++) {
      const a = a0 + d * i / n;
      const ex = rx * Math.cos(a), ey = ry * Math.sin(a);
      const x = cx + ex * Math.cos(rot) - ey * Math.sin(rot);
      const y = cy + ex * Math.sin(rot) + ey * Math.cos(rot);
      if (i === 0 && !lauf) neu(x, y); else zu(x, y);
    }
  }
  function d() {
    return pfad.map(t => t.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')).join(' ');
  }
  const alpha = () => st.globalAlpha < 1 ? ` opacity="${st.globalAlpha.toFixed(2)}"` : '';
  const dash = () => st.lineDash && st.lineDash.length ? ` stroke-dasharray="${st.lineDash.join(' ')}"` : '';
  function fontPx() { const mm = /(\d+(?:\.\d+)?)px/.exec(st.font); return mm ? +mm[1] : 10; }
  function text(s, x, y, fuellen) {
    const [px, py] = P(x, y);
    const groesse = fontPx() * skala();
    const anker = { center: 'middle', right: 'end', end: 'end' }[st.textAlign] || 'start';
    const base = { middle: 'central', top: 'hanging', hanging: 'hanging', bottom: 'text-after-edge' }[st.textBaseline] || 'alphabetic';
    const winkel = Math.atan2(m[1], m[0]) * 180 / Math.PI;
    const fett = /bold|[6-9]00/.test(st.font) ? ' font-weight="bold"' : '';
    const f = fuellen ? farbe(st.fillStyle) : 'none';
    const s2 = fuellen ? '' : ` stroke="${farbe(st.strokeStyle)}" stroke-width="${st.lineWidth}"`;
    ops.push(`<text x="${px.toFixed(1)}" y="${py.toFixed(1)}" font-size="${groesse.toFixed(1)}" font-family="Helvetica, Arial, sans-serif"${fett} fill="${f}"${s2} text-anchor="${anker}" dominant-baseline="${base}"${alpha()}${winkel ? ` transform="rotate(${winkel.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"` : ''}>${esc(s)}</text>`);
  }
  const ctx = {
    canvas: cv,
    save() { stapel.push([m.slice(), Object.assign({}, st, { lineDash: st.lineDash.slice() })]); },
    restore() { const s = stapel.pop(); if (s) { m = s[0]; Object.assign(st, s[1]); } },
    translate(x, y) { m = [m[0], m[1], m[2], m[3], m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; },
    scale(x, y) { m = [m[0] * x, m[1] * x, m[2] * y, m[3] * y, m[4], m[5]]; },
    rotate(a) { const c = Math.cos(a), s = Math.sin(a);
      m = [m[0] * c + m[2] * s, m[1] * c + m[3] * s, -m[0] * s + m[2] * c, -m[1] * s + m[3] * c, m[4], m[5]]; },
    setTransform(a, b, c, dd, e, f) { if (typeof a === 'object') m = [a.a, a.b, a.c, a.d, a.e, a.f]; else m = [a, b, c, dd, e, f]; },
    resetTransform() { m = [1, 0, 0, 1, 0, 0]; },
    transform(a, b, c, dd, e, f) { m = [m[0] * a + m[2] * b, m[1] * a + m[3] * b, m[0] * c + m[2] * dd, m[1] * c + m[3] * dd, m[0] * e + m[2] * f + m[4], m[1] * e + m[3] * f + m[5]]; },
    beginPath() { pfad = []; lauf = null; },
    closePath() { if (lauf && lauf.length) lauf.push(lauf[0].slice()); lauf = null; },
    moveTo(x, y) { neu(x, y); },
    lineTo(x, y) { zu(x, y); },
    rect(x, y, w, h) { neu(x, y); zu(x + w, y); zu(x + w, y + h); zu(x, y + h); zu(x, y); lauf = null; },
    roundRect(x, y, w, h, r) {
      r = Array.isArray(r) ? (r[0] || 0) : (+r || 0); r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
      neu(x + r, y); zu(x + w - r, y); bogen(x + w - r, y + r, r, -Math.PI / 2, 0, false);
      zu(x + w, y + h - r); bogen(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
      zu(x + r, y + h); bogen(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
      zu(x, y + r); bogen(x + r, y + r, r, Math.PI, Math.PI * 1.5, false); lauf = null;
    },
    arc(cx, cy, r, a0, a1, ccw) { bogen(cx, cy, r, a0, a1, !!ccw); },
    ellipse(cx, cy, rx, ry, rot, a0, a1, ccw) { bogen(cx, cy, 0, a0, a1, !!ccw, rx, ry, rot); },
    arcTo(x1, y1, x2, y2) { zu(x1, y1); },
    quadraticCurveTo(cx, cy, x, y) {
      const p0 = lauf ? lauf[lauf.length - 1] : P(cx, cy);
      // p0 ist schon transformiert - zurueckrechnen waere teuer; Kurve in Geraetekoordinaten
      const c = P(cx, cy), e = P(x, y);
      for (let i = 1; i <= 12; i++) { const t = i / 12, u = 1 - t;
        const q = [u * u * p0[0] + 2 * u * t * c[0] + t * t * e[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * e[1]];
        if (!lauf) { lauf = [q]; pfad.push(lauf); } else lauf.push(q); }
    },
    bezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
      const p0 = lauf ? lauf[lauf.length - 1] : P(c1x, c1y);
      const a = P(c1x, c1y), b = P(c2x, c2y), e = P(x, y);
      for (let i = 1; i <= 16; i++) { const t = i / 16, u = 1 - t;
        const q = [u * u * u * p0[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t * t * t * e[0],
                   u * u * u * p0[1] + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t * t * t * e[1]];
        if (!lauf) { lauf = [q]; pfad.push(lauf); } else lauf.push(q); }
    },
    fill() { if (pfad.length) ops.push(`<path d="${d()}" fill="${farbe(st.fillStyle)}" fill-rule="evenodd"${alpha()}/>`); },
    stroke() { if (pfad.length) ops.push(`<path d="${d()}" fill="none" stroke="${farbe(st.strokeStyle)}" stroke-width="${(st.lineWidth * skala()).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"${dash()}${alpha()}/>`); },
    fillRect(x, y, w, h) {
      if (m[0] === 1 && m[3] === 1 && m[1] === 0 && m[2] === 0 && x <= 0 && y <= 0 && w >= W && h >= H) ops = [];
      const alt = pfad; pfad = []; lauf = null; ctx.rect(x, y, w, h); ctx.fill(); pfad = alt; lauf = null;
    },
    strokeRect(x, y, w, h) { const alt = pfad; pfad = []; lauf = null; ctx.rect(x, y, w, h); ctx.stroke(); pfad = alt; lauf = null; },
    clearRect(x, y, w, h) {
      if (x <= 0 && y <= 0 && w >= W && h >= H) ops = [];
      else { const f = st.fillStyle, a = st.globalAlpha; st.fillStyle = '#fff'; st.globalAlpha = 1; ctx.fillRect(x, y, w, h); st.fillStyle = f; st.globalAlpha = a; }
    },
    fillText(s, x, y) { text(s, x, y, true); },
    strokeText(s, x, y) { text(s, x, y, false); },
    measureText(s) { const w = String(s).length * fontPx() * 0.56; return { width: w, actualBoundingBoxAscent: fontPx() * 0.8, actualBoundingBoxDescent: fontPx() * 0.2 }; },
    setLineDash(a) { st.lineDash = (a || []).slice(); },
    getLineDash() { return st.lineDash.slice(); },
    createLinearGradient() { const g = { _farbe: null, addColorStop(o, c) { if (!g._farbe) g._farbe = c; } }; return g; },
    createRadialGradient() { const g = { _farbe: null, addColorStop(o, c) { if (!g._farbe) g._farbe = c; } }; return g; },
    createPattern() { return { _farbe: '#ccc' }; },
    drawImage(img, x, y, w, h) { if (typeof w === 'number') { const f = st.fillStyle; st.fillStyle = '#ddd'; ctx.fillRect(x, y, w, h); st.fillStyle = f; } },
    clip() {}, isPointInPath() { return false; },
    getImageData(a, b, w, h) { return { width: w || 1, height: h || 1, data: new Uint8ClampedArray(Math.max(4, (w || 1) * (h || 1) * 4)) }; },
    createImageData(w, h) { return { width: w, height: h, data: new Uint8ClampedArray(Math.max(4, w * h * 4)) }; },
    putImageData() {},
  };
  return new Proxy(ctx, {
    get(t, k) { if (k in t) return t[k]; if (k in st) return st[k]; return () => {}; },
    set(t, k, v) { if (k === 'lineDashOffset') return true; st[k] = v; return true; },
  });
}

const H = baueContext(datei);
const leinwaende = [];
const setzen = H.elemente.set.bind(H.elemente);
H.elemente.set = (k, el) => {
  if (el && el.tagName === 'CANVAS') {
    let rec = null;
    el.getContext = () => (rec || (rec = recorder(el)));
    leinwaende.push(el);
  }
  return setzen(k, el);
};
vm.runInContext(`var __m = document.createElement('div'); document.body.appendChild(__m);
                 _physSimDefs[${JSON.stringify(simId)}](__m);`, H.ctx);
const tick = n => { for (let i = 0; i < n; i++) { ops = []; H.frames(1); } };
tick(3);
for (const s of schritte) {
  if (s.tue) vm.runInContext(s.tue, H.ctx);
  tick(s.frames || 4);
}
tick(NACHLAUF);

// Statuszeilen: alle Elemente mit Text, ohne Leinwand, in der Reihenfolge des Anlegens
const zeilen = [];
for (const [id, el] of H.elemente) {
  if (el.tagName === 'CANVAS' || el.tagName === 'BUTTON' || el.tagName === 'INPUT') continue;
  const roh = (el.textContent || el.innerHTML || '').replace(/<br\s*\/?>/g, ' / ').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (roh && roh.length < 200 && el.style.display !== 'none') zeilen.push(id + ': ' + roh);
}
const cv = leinwaende[0] || { width: 420, height: 250 };
const W = cv.width || 420, Hh = cv.height || 250;
const zh = 15, unten = zeilen.length * zh + 12;
// Quadratisch: qlmanage rendert Vorschaubilder quadratisch und schneidet sonst rechts ab.
const Q = Math.max(W, Hh + unten);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Q * 2}" height="${Q * 2}" viewBox="0 0 ${Q} ${Q}">
<rect x="0" y="0" width="${Q}" height="${Q}" fill="#fff"/>
<g>${ops.join('\n')}</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${Hh - 1}" fill="none" stroke="#bbb" stroke-width="0.5"/>
${zeilen.map((z, i) => `<text x="4" y="${Hh + 14 + i * zh}" font-size="9.5" font-family="Helvetica, Arial, sans-serif" fill="#333">${esc(z)}</text>`).join('\n')}
</svg>`;
fs.writeFileSync(ziel, svg);
console.log(`${ziel}: ${ops.length} Zeichenbefehle, ${zeilen.length} Statuszeilen`);
