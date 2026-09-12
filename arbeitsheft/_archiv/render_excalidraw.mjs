// Excalidraw-Datei -> PNG, ohne Browser.
//   roughjs erzeugt die Pfade, resvg rastert sie.
// Aufruf:  node render_excalidraw.mjs physik.excalidraw --out img/kette.png
// Optionen: --scale 2.4  --roughness 1  --palette gold|excalidraw  --pad 28
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import rough from 'roughjs';
const require = createRequire(import.meta.url);
const { Resvg } = require('@resvg/resvg-js');

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf('--' + n); return i < 0 ? d : argv[i + 1]; };
const SRC   = argv.find(a => !a.startsWith('--') && !argv[argv.indexOf(a) - 1]?.startsWith('--')) || 'physik.excalidraw';
const OUT   = flag('out', 'img/diagramm.png');
const SCALE = parseFloat(flag('scale', 2.4));
const ROUGH = parseFloat(flag('roughness', 1));
const PAL   = flag('palette', 'excalidraw');
const PAD   = parseFloat(flag('pad', 28));

// Heft-Palette: Creme/Gold statt Excalidraw-Blau, damit das Diagramm zur Seite passt.
const GOLD = {
  '#dae8fc': '#FAF6EC', '#6c8ebf': '#C6A04A',   // light-blue  -> Creme auf Gold
  '#fff2cc': '#E2C880', '#d6b656': '#8C6C28',   // light-yellow-> Gold hervorgehoben
  '#1e1e1e': '#262C42',                          // Tinte -> Heft-Ink
};
const col = c => (PAL === 'gold' && GOLD[c]) ? GOLD[c] : c;

const doc = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const els = (doc.elements || []).filter(e => e && !e.isDeleted);
const byId = new Map(els.map(e => [e.id, e]));

// --- Ausdehnung bestimmen -------------------------------------------------
let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
for (const e of els) {
  x0 = Math.min(x0, e.x); y0 = Math.min(y0, e.y);
  x1 = Math.max(x1, e.x + (e.width || 0)); y1 = Math.max(y1, e.y + (e.height || 0));
}
const VW = x1 - x0 + 2 * PAD, VH = y1 - y0 + 2 * PAD;
const ox = PAD - x0, oy = PAD - y0;

const gen = rough.generator();
const parts = [];
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const emit = (drawable, seed) => {
  for (const p of gen.toPaths(drawable)) {
    parts.push(`<path d="${p.d}" fill="${p.fill || 'none'}" stroke="${p.stroke || 'none'}"`
      + ` stroke-width="${p.strokeWidth || 0}" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
};

// abgerundetes Rechteck wie Excalidraw (roundness type 3)
const roundRect = (x, y, w, h, r) => {
  r = Math.min(r, w / 2, h / 2);
  return `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r}`
       + ` L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h}`
       + ` L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r}`
       + ` L${x} ${y + r} Q${x} ${y} ${x + r} ${y} Z`;
};

const shapeOpts = e => ({
  seed: (e.seed || 1) % 2147483647,
  roughness: ROUGH,
  bowing: ROUGH ? 1 : 0,
  stroke: col(e.strokeColor || '#1e1e1e'),
  strokeWidth: (e.strokeWidth || 1) * (ROUGH ? 1.6 : 1.4),
  fill: e.backgroundColor && e.backgroundColor !== 'transparent' ? col(e.backgroundColor) : undefined,
  fillStyle: 'solid',
  disableMultiStroke: ROUGH === 0,
});

// --- Formen ---------------------------------------------------------------
for (const e of els) {
  const x = e.x + ox, y = e.y + oy, w = e.width, h = e.height;
  if (e.type === 'rectangle') {
    const r = e.roundness ? Math.min(32, Math.min(w, h) * 0.25) : 0;
    emit(r > 0 ? gen.path(roundRect(x, y, w, h, r), shapeOpts(e))
               : gen.rectangle(x, y, w, h, shapeOpts(e)));
  } else if (e.type === 'ellipse') {
    emit(gen.ellipse(x + w / 2, y + h / 2, w, h, shapeOpts(e)));
  } else if (e.type === 'diamond') {
    emit(gen.polygon([[x + w / 2, y], [x + w, y + h / 2], [x + w / 2, y + h], [x, y + h / 2]], shapeOpts(e)));
  } else if (e.type === 'arrow' || e.type === 'line') {
    const pts = (e.points || [[0, 0], [w, h]]).map(([px, py]) => [x + px, y + py]);
    const o = { ...shapeOpts(e), fill: undefined };
    emit(gen.linearPath(pts, o));
    if (e.type === 'arrow' && e.endArrowhead) {
      const [ax, ay] = pts[pts.length - 2], [bx, by] = pts[pts.length - 1];
      const a = Math.atan2(by - ay, bx - ax), L = 16, S = 0.45;
      emit(gen.linearPath([[bx - L * Math.cos(a - S), by - L * Math.sin(a - S)], [bx, by],
                           [bx - L * Math.cos(a + S), by - L * Math.sin(a + S)]], o));
    }
  }
}

// --- Beschriftungen (immer zuletzt, damit sie oben liegen) ----------------
for (const e of els) {
  if (e.type !== 'text') continue;
  const box = e.containerId ? byId.get(e.containerId) : null;
  const cx = (box ? box.x + box.width / 2 : e.x + e.width / 2) + ox;
  const cy = (box ? box.y + box.height / 2 : e.y + e.height / 2) + oy;
  const lines = String(e.text || '').split('\n');
  const fsz = e.fontSize || 16, lh = fsz * (e.lineHeight || 1.25);
  const top = cy - (lines.length - 1) * lh / 2;
  const tspans = lines.map((ln, i) =>
    `<tspan x="${cx.toFixed(2)}" y="${(top + i * lh).toFixed(2)}">${esc(ln)}</tspan>`).join('');
  parts.push(`<text text-anchor="middle" dominant-baseline="central"`
    + ` font-family="Source Sans 3" font-size="${fsz}" fill="${col(e.strokeColor || '#1e1e1e')}">${tspans}</text>`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" width="${VW}" height="${VH}">`
  + `<rect width="${VW}" height="${VH}" fill="${PAL === 'gold' ? '#FFFFFF' : '#FFFFFF'}"/>${parts.join('')}</svg>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const png = new Resvg(svg, {
  fitTo: { mode: 'width', value: Math.round(VW * SCALE) },
  font: { fontFiles: [path.join(process.cwd(), 'fonts/SourceSans3-Medium.ttf')],
          loadSystemFonts: false, defaultFontFamily: 'Source Sans 3' },
}).render().asPng();
fs.writeFileSync(OUT, png);
console.log(`${OUT}  ${Math.round(VW * SCALE)}x${Math.round(VH * SCALE)}px  `
  + `(${els.length} Elemente, roughness ${ROUGH}, Palette ${PAL})`);
