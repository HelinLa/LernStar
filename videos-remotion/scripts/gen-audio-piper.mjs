// Erzeugt deutsche Sprecher-Audios mit **Piper** (kostenlos, offline, neuronale Stimme).
// Drop-in-Ersatz für scripts/gen-audio.mjs (macOS `say`): gleiche Ein-/Ausgabe.
// Liest jede src/narration/<base>.json ([{id,text}]), schreibt
// public/audio/<base>/<id>.wav (16-bit mono) und misst die Dauer aus dem
// WAV-Header nach src/narration/<base>.timings.json ({id: sekunden}).
// Dateinamen identisch zur say-Pipeline → Composites unverändert einsetzbar.
//
// Standardstimme: Eva (de_DE-eva_k) – weiblich, gewählte LernStar-Stimme.
// Überschreibbar per ENV:
//   PIPER_BIN    (Standard: ~/.local/piper/venv/bin/piper)
//   PIPER_MODEL  (Standard: ~/.local/piper/voices/de_DE-eva_k-x_low.onnx)
//   PIPER_LENGTH (Sprechtempo, Standard 1.0 – größer = langsamer)
//
// Aufruf:  node scripts/gen-audio-piper.mjs [base ...]
//   ohne Argument: alle Narration-Dateien; sonst nur die genannten bases.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { execFileSync } from 'child_process';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const narrDir = join(root, 'src', 'narration');
const pubAudio = join(root, 'public', 'audio');

const PIPER = process.env.PIPER_BIN || join(homedir(), '.local/piper/venv/bin/piper');
const MODEL =
  process.env.PIPER_MODEL || join(homedir(), '.local/piper/voices/de_DE-eva_k-x_low.onnx');
const LENGTH = process.env.PIPER_LENGTH || '1.0';

// Dauer robust aus dem WAV-Header lesen (Chunks durchgehen bis 'data').
function wavDuration(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') return 0;
  let off = 12;
  let byteRate = 0;
  let dataLen = 0;
  while (off + 8 <= buf.length) {
    const id = buf.toString('ascii', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === 'fmt ') byteRate = buf.readUInt32LE(off + 8 + 8); // byteRate liegt 8 Byte im fmt-Chunk
    else if (id === 'data') { dataLen = size; break; }
    off += 8 + size + (size % 2); // Chunks sind auf gerade Länge gepaddet
  }
  return byteRate > 0 ? dataLen / byteRate : 0;
}

const only = process.argv.slice(2);
const files = readdirSync(narrDir)
  .filter((f) => f.endsWith('.json') && !f.endsWith('.timings.json'))
  .filter((f) => only.length === 0 || only.includes(f.replace(/\.json$/, '')));

if (files.length === 0) {
  console.error('Keine passenden Narration-Dateien gefunden.');
  process.exit(1);
}

console.log(`Piper-Stimme: ${MODEL.split('/').pop()} · length_scale ${LENGTH}`);
for (const file of files) {
  const base = file.replace(/\.json$/, '');
  const lines = JSON.parse(readFileSync(join(narrDir, file), 'utf8'));
  const outDir = join(pubAudio, base);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const timings = {};
  for (const { id, text } of lines) {
    const wav = join(outDir, `${id}.wav`);
    execFileSync(PIPER, ['-m', MODEL, '--length_scale', LENGTH, '-f', wav], { input: text });
    timings[id] = wavDuration(readFileSync(wav));
    console.log(`  ${base}/${id}: ${timings[id].toFixed(3)}s`);
  }
  writeFileSync(join(narrDir, `${base}.timings.json`), JSON.stringify(timings, null, 2) + '\n');
  console.log(`✓ ${base}: ${lines.length} Clips + timings.json`);
}
