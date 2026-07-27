/**
 * Headless-Render für Motion Canvas – MP4 direkt aus dem Terminal (wie Remotion).
 *
 * Startet den Vite-Editor, steuert ihn per chrome-headless-shell (aus dem
 * Remotion-Ordner wiederverwendet), klickt "Render" und wartet auf die fertige
 * MP4 in output/. Optionales Ziel kopiert das Ergebnis nach ../videos/<ziel>.mp4.
 *
 * Aufruf:
 *   export PATH="$HOME/.local/node/bin:$PATH"
 *   node scripts/render.mjs                # rendert -> output/LernStar.mp4
 *   node scripts/render.mjs geschwindigkeit # + kopiert nach ../videos/geschwindigkeit.mp4
 *
 * Chrome per CHROME=/pfad/zu/chrome überschreibbar.
 */
import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const TARGET = process.argv[2] || null; // optionaler Basisname für ../videos/
const PORT = 9124;
const OUTPUT_DIR = path.resolve('output');
const CHROME =
  process.env.CHROME ||
  path.resolve(
    '../videos-remotion/node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell',
  );

if (!fs.existsSync(CHROME)) {
  console.error(`✖ Kein Chrome gefunden unter:\n  ${CHROME}\nSetze CHROME=/pfad/zu/chrome.`);
  process.exit(1);
}

const log = (...a) => console.log('[render]', ...a);

function startVite() {
  return new Promise((resolve, reject) => {
    const proc = spawn('node_modules/.bin/vite', ['--port', String(PORT), '--strictPort'], {
      cwd: process.cwd(),
      env: process.env,
    });
    let out = '';
    const onData = d => {
      out += d.toString();
      const m = out.match(new RegExp(`http://localhost:${PORT}`));
      if (m) resolve({proc, url: `http://localhost:${PORT}`});
    };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
    proc.on('error', reject);
    setTimeout(() => reject(new Error('Vite-Start-Timeout:\n' + out)), 30000);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function listMp4s() {
  if (!fs.existsSync(OUTPUT_DIR)) return {};
  const res = {};
  for (const f of fs.readdirSync(OUTPUT_DIR)) {
    if (f.toLowerCase().endsWith('.mp4')) {
      res[f] = fs.statSync(path.join(OUTPUT_DIR, f)).size;
    }
  }
  return res;
}

const {proc, url} = await startVite();
log('Vite läuft:', url);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--disable-dev-shm-usage',
  ],
});

let ok = false;
let producedFile = null;
try {
  const page = await browser.newPage();
  await page.setViewport({width: 1600, height: 900});
  page.on('console', m => {
    const t = m.text();
    if (/error|fail|exception/i.test(t)) log('page-console:', t);
  });
  page.on('pageerror', e => log('PAGEERROR:', e.message));

  const before = listMp4s();
  await page.goto(url + '/', {waitUntil: 'networkidle2', timeout: 60000});
  await sleep(3500); // Editor + erste Szene laden lassen

  // Render-Button (Text "Render", Klasse _main_) finden und klicken
  const clicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const b = btns.find(
      x => x.textContent?.trim() === 'Render' && /_main_/.test(x.className),
    ) || btns.find(x => x.textContent?.trim() === 'Render');
    if (b) {
      b.click();
      return true;
    }
    return false;
  });
  if (!clicked) throw new Error('Render-Button nicht gefunden.');
  log('Render gestartet …');

  // Fertig-Erkennung: neue/gewachsene MP4 + Größe stabil + Button wieder "Render"
  const deadline = Date.now() + 8 * 60 * 1000; // 8 Min Hard-Timeout
  let stable = 0;
  let lastSizes = JSON.stringify(before);
  let sawGrowth = false;
  while (Date.now() < deadline) {
    await sleep(1500);
    const now = listMp4s();
    const nowStr = JSON.stringify(now);

    // gibt es eine neue oder gewachsene Datei ggü. Start?
    for (const [f, size] of Object.entries(now)) {
      if (before[f] === undefined || size !== before[f]) sawGrowth = true;
    }

    const buttonIdle = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const b = btns.find(x => /_main_/.test(x.className));
      // während des Renderns zeigt der Button Fortschritt/Prozent statt "Render"
      return b ? b.textContent?.trim() === 'Render' : true;
    });

    if (nowStr === lastSizes) stable++;
    else stable = 0;
    lastSizes = nowStr;

    if (sawGrowth && buttonIdle && stable >= 2 && Object.keys(now).length) {
      // fertige Datei = die neueste mp4
      const files = Object.keys(now)
        .map(f => ({f, m: fs.statSync(path.join(OUTPUT_DIR, f)).mtimeMs, s: now[f]}))
        .sort((a, b) => b.m - a.m);
      producedFile = files[0].f;
      ok = files[0].s > 10000; // > 10 KB = plausibel
      break;
    }
  }
} finally {
  await browser.close();
  proc.kill('SIGTERM');
}

if (!ok || !producedFile) {
  console.error('✖ Render nicht erfolgreich abgeschlossen (kein plausibles MP4 in output/).');
  process.exit(2);
}

const outPath = path.join(OUTPUT_DIR, producedFile);
log('MP4 fertig:', outPath, `(${(fs.statSync(outPath).size / 1e6).toFixed(1)} MB)`);

// Verifikation mit dem mitgelieferten ffprobe
const ffprobe = path.resolve(
  'node_modules/@ffprobe-installer/darwin-arm64/ffprobe',
);
if (fs.existsSync(ffprobe)) {
  const r = spawnSync(
    ffprobe,
    ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,nb_frames', '-of', 'default=noprint_wrappers=1', outPath],
    {encoding: 'utf8'},
  );
  log('ffprobe:\n' + (r.stdout || r.stderr).trim());
}

// optional nach ../videos kopieren
if (TARGET) {
  const dest = path.resolve('../videos', `${TARGET}.mp4`);
  fs.copyFileSync(outPath, dest);
  log('kopiert nach', dest);
}

log('✓ fertig');
