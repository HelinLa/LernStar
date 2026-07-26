// Erzeugt deutsche Sprecher-Audios über die ElevenLabs Text-to-Speech-API.
// Ersatz für scripts/gen-audio.mjs (macOS `say`) – deutlich natürlichere Stimme.
//
// Liest jede src/narration/<base>.json ([{id,text}]), schreibt
// public/audio/<base>/<id>.wav (24 kHz, 16-bit, mono) und misst die Dauer
// direkt aus der PCM-Länge nach src/narration/<base>.timings.json ({id: sek}).
// Die WAV-Dateinamen bleiben identisch zur say-Pipeline → Videos unverändert.
//
// Voraussetzung: Umgebungsvariable ELEVENLABS_API_KEY.
// Optional:      ELEVENLABS_VOICE_ID   (Standard: ruhige männliche Stimme)
//                ELEVENLABS_MODEL_ID   (Standard: eleven_multilingual_v2)
//
// Aufruf:  ELEVENLABS_API_KEY=sk_xxx node scripts/gen-audio-elevenlabs.mjs [base ...]
//   ohne Argument: alle Narration-Dateien; sonst nur die genannten bases.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const narrDir = join(root, 'src', 'narration');
const pubAudio = join(root, 'public', 'audio');

// Key aus ENV, sonst aus einer lokalen Datei (außerhalb des Repos, nie committen).
function loadKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const candidates = [
    process.env.ELEVENLABS_KEY_FILE,
    join(homedir(), '.lernstar-eleven.key'),
    join(homedir(), '.config', 'lernstar', 'eleven.key'),
  ].filter(Boolean);
  for (const f of candidates) {
    if (existsSync(f)) return readFileSync(f, 'utf8').trim();
  }
  return null;
}
const KEY = loadKey();
if (!KEY) {
  console.error('FEHLER: Kein ElevenLabs-Key gefunden.');
  console.error('Setze ELEVENLABS_API_KEY oder lege den Key in ~/.lernstar-eleven.key ab.');
  process.exit(1);
}
// Standard: „George" – warme, ruhige, reife männliche Stimme (überschreibbar).
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const SR = 24000; // pcm_24000

// ruhige, gleichmäßige Erzählstimme
const VOICE_SETTINGS = { stability: 0.6, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true };

// 44-Byte-WAV-Header um rohe PCM-Daten (16-bit mono)
function pcmToWav(pcm, sampleRate = SR) {
  const header = Buffer.alloc(44);
  const dataLen = pcm.length;
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataLen, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); // byte rate (mono, 2 bytes)
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write('data', 36);
  header.writeUInt32LE(dataLen, 40);
  return Buffer.concat([header, pcm]);
}

async function tts(text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=pcm_${SR}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/basic' },
    body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} – ${msg.slice(0, 400)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

const only = process.argv.slice(2);
const files = readdirSync(narrDir)
  .filter((f) => f.endsWith('.json') && !f.endsWith('.timings.json'))
  .filter((f) => only.length === 0 || only.includes(f.replace(/\.json$/, '')));

if (files.length === 0) {
  console.error('Keine passenden Narration-Dateien gefunden.');
  process.exit(1);
}

console.log(`Stimme: ${VOICE_ID} · Modell: ${MODEL_ID}`);
for (const file of files) {
  const base = file.replace(/\.json$/, '');
  const lines = JSON.parse(readFileSync(join(narrDir, file), 'utf8'));
  const outDir = join(pubAudio, base);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const timings = {};
  for (const { id, text } of lines) {
    const pcm = await tts(text);
    writeFileSync(join(outDir, `${id}.wav`), pcmToWav(pcm));
    timings[id] = pcm.length / (SR * 2); // Sekunden = Samples / Samplerate
    console.log(`  ${base}/${id}: ${timings[id].toFixed(3)}s`);
  }
  writeFileSync(join(narrDir, `${base}.timings.json`), JSON.stringify(timings, null, 2) + '\n');
  console.log(`✓ ${base}: ${lines.length} Clips + timings.json`);
}
