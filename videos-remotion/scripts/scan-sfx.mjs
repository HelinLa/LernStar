// Scannt public/sfx/ und schreibt src/sfx.map.json  { "<name>": "<datei>" }.
// So werden nur die Sound-Effekte genutzt, die tatsächlich vorhanden sind.
// Dateiname (ohne Endung, kleingeschrieben) = Effekt-Name im Video,
//   z. B.  public/sfx/pling.mp3  ->  Sfx sound="pling".
//
// Aufruf:  node scripts/scan-sfx.mjs   (bzw. npm run sfx)
import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sfxDir = join(root, 'public', 'sfx');
if (!existsSync(sfxDir)) mkdirSync(sfxDir, { recursive: true });

const exts = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg']);
const map = {};
for (const f of readdirSync(sfxDir)) {
  const e = extname(f).toLowerCase();
  if (exts.has(e)) map[basename(f, e).toLowerCase()] = f;
}
writeFileSync(join(root, 'src', 'sfx.map.json'), JSON.stringify(map, null, 2) + '\n');
const n = Object.keys(map).length;
console.log(n ? `✓ ${n} Sound-Effekt(e) erkannt: ${Object.keys(map).join(', ')}` : '(keine Dateien in public/sfx/ – lege welche ab und starte erneut)');
