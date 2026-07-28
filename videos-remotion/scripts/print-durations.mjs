// Rechnet aus einer Narration-timings.json die Segmentdauern (durOf) aus –
// damit der Motion-Canvas-Clip framegenau auf das gelieferte Audio getaktet werden kann,
// ohne von Hand zu rechnen. Gleiche Formel wie in den Composite-Videos.
//
// Aufruf:  node scripts/print-durations.mjs <base> [minFrames]
//   z. B.  node scripts/print-durations.mjs magnetpole-mc 150
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = process.argv[2];
const MIN = Number(process.argv[3] || 150);
if (!base) { console.error('Aufruf: node scripts/print-durations.mjs <base> [minFrames]'); process.exit(1); }

const FPS = 30, TAIL = 20;
const T = JSON.parse(
  readFileSync(join(__dirname, '..', 'src', 'narration', `${base}.timings.json`), 'utf8'),
);
const durOf = (t) => Math.max(MIN, Math.round((t ?? 0) * FPS) + TAIL);

let total = 0;
console.log(`base=${base}  min=${MIN}f  (FPS ${FPS}, TAIL ${TAIL})`);
console.log('id'.padEnd(18), 'audio_s'.padStart(9), 'DUR_f'.padStart(7), 'DUR_s'.padStart(9));
for (const [id, t] of Object.entries(T)) {
  const d = durOf(t);
  total += d;
  console.log(id.padEnd(18), t.toFixed(3).padStart(9), String(d).padStart(7), (d / FPS).toFixed(4).padStart(9));
}
console.log('—'.repeat(46));
console.log('TOTAL'.padEnd(18), ''.padStart(9), String(total).padStart(7), (total / FPS).toFixed(4).padStart(9));
