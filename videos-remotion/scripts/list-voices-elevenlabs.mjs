// Listet die im ElevenLabs-Konto verfügbaren Stimmen (Name, ID, Sprache,
// Geschlecht, Beschreibung) – zum Auswählen einer ruhigen deutschen
// männlichen Sprecherstimme.
//
// Aufruf:  ELEVENLABS_API_KEY=sk_xxx node scripts/list-voices-elevenlabs.mjs
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
function loadKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  for (const f of [process.env.ELEVENLABS_KEY_FILE, join(homedir(), '.lernstar-eleven.key'), join(homedir(), '.config', 'lernstar', 'eleven.key')].filter(Boolean)) {
    if (existsSync(f)) return readFileSync(f, 'utf8').trim();
  }
  return null;
}
const KEY = loadKey();
if (!KEY) {
  console.error('FEHLER: Kein ElevenLabs-Key gefunden (ELEVENLABS_API_KEY oder ~/.lernstar-eleven.key).');
  process.exit(1);
}

const res = await fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': KEY } });
if (!res.ok) {
  console.error(`HTTP ${res.status} – ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
const { voices } = await res.json();
for (const v of voices) {
  const l = v.labels || {};
  console.log(
    [
      v.voice_id,
      v.name,
      l.language || l.accent || '?',
      l.gender || '?',
      l.age || '',
      l.description || l.use_case || '',
    ].join('  |  ')
  );
}
console.log(`\n${voices.length} Stimmen. Für Deutsch + männlich + ruhig auswählen und als ELEVENLABS_VOICE_ID setzen.`);
