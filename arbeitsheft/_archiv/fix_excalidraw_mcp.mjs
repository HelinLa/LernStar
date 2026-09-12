// Repariert das npm-Paket @cmd8/excalidraw-mcp (1.2.0). Zwei Verpackungsfehler:
//   1. relative ESM-Importe ohne .js-Endung  -> Node kann sie nicht aufloesen
//   2. TypeScript-Aliase '@/...' wurden beim Build nie ersetzt
// Nach jedem `npm install` erneut ausfuehren:  node fix_excalidraw_mcp.mjs
import fs from 'fs';
import path from 'path';

const dist = path.join(process.cwd(), 'node_modules/@cmd8/excalidraw-mcp/dist');
if (!fs.existsSync(dist)) { console.error('Paket nicht installiert:', dist); process.exit(1); }

let ext = 0, alias = 0;

const resolve = (from, spec) => {                 // spec ohne Endung -> echte Datei
  const base = path.resolve(from, spec);
  if (fs.existsSync(base + '.js')) return base + '.js';
  const idx = path.join(base, 'index.js');
  return fs.existsSync(idx) ? idx : null;
};

const rel = (file, target) => {
  const r = path.relative(path.dirname(file), target).split(path.sep).join('/');
  return r.startsWith('.') ? r : './' + r;
};

function patch(file) {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  src = src.replace(/(['"])@\/([^'"]+)\1/g, (m, q, sub) => {   // Alias '@/x' -> relativ
    const t = resolve(dist, sub.replace(/\.js$/, ''));
    if (!t) { console.warn('  unaufloesbar:', file, '@/' + sub); return m; }
    alias++;
    return q + rel(file, t) + q;
  });

  src = src.replace(                                            // fehlende .js-Endung
    /((?:from|import|export\s+\*\s+from)\s*\(?\s*)(['"])(\.\.?\/[^'"]*)\2/g,
    (m, pre, q, spec) => {
      if (/\.(js|mjs|cjs|json|node)$/.test(spec)) return m;
      const t = resolve(path.dirname(file), spec);
      if (!t) { console.warn('  unaufloesbar:', file, spec); return m; }
      ext++;
      return pre + q + rel(file, t) + q;
    }
  );

  if (src !== before) fs.writeFileSync(file, src);
}

(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.js')) patch(p);
  }
})(dist);

console.log(`excalidraw-mcp gepatcht: ${alias} Alias-Importe, ${ext} fehlende .js-Endungen`);
