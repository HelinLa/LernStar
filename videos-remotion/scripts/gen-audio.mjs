// Erzeugt deutsche Sprecher-Audios (macOS `say`) für die Lernvideos.
// Liest jede src/narration/<base>.json ([{id,text}]), schreibt
// public/audio/<base>/<id>.wav und misst die Dauer (afinfo) nach
// src/narration/<base>.timings.json ({id: sekunden}).
//
// Aufruf:  node scripts/gen-audio.mjs [base ...]
//   ohne Argument: alle Narration-Dateien; sonst nur die genannten bases.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { execFileSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const narrDir = join(root, 'src', 'narration');
const pubAudio = join(root, 'public', 'audio');

const VOICE = process.env.SAY_VOICE || 'Anna'; // z. B. SAY_VOICE=Reed (männlich)
const RATE = process.env.SAY_RATE || '178'; // Wörter pro Minute – ruhig & verständlich

const only = process.argv.slice(2);
const files = readdirSync(narrDir)
  .filter((f) => f.endsWith('.json') && !f.endsWith('.timings.json'))
  .filter((f) => only.length === 0 || only.includes(f.replace(/\.json$/, '')));

for (const file of files) {
  const base = file.replace(/\.json$/, '');
  const lines = JSON.parse(readFileSync(join(narrDir, file), 'utf8'));
  const outDir = join(pubAudio, base);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const timings = {};
  for (const { id, text } of lines) {
    const wav = join(outDir, `${id}.wav`);
    execFileSync('say', [
      '-v', VOICE,
      '-r', RATE,
      '--file-format=WAVE',
      '--data-format=LEI16@24000',
      '-o', wav,
      text,
    ]);
    const info = execFileSync('afinfo', [wav]).toString();
    const m = info.match(/estimated duration:\s*([\d.]+)/i);
    timings[id] = m ? parseFloat(m[1]) : 0;
    console.log(`  ${base}/${id}: ${timings[id]}s`);
  }
  writeFileSync(join(narrDir, `${base}.timings.json`), JSON.stringify(timings, null, 2) + '\n');
  console.log(`✓ ${base}: ${lines.length} Clips + timings.json`);
}
