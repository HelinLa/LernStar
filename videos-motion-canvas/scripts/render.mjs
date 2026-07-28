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
  await page.goto(url + '/', {waitUntil: 'networkidle2', timeout: 180000});
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
  log('Render angestoßen …');

  // Button-Status robust lesen; bei detachtem Frame -> null (unbekannt).
  const readButtonIdle = async () => {
    try {
      return await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button')];
        const b = btns.find(x => /_main_/.test(x.className));
        return b ? b.textContent?.trim() === 'Render' : true;
      });
    } catch {
      return null; // Frame detached
    }
  };
  const clickRender = async () => {
    try {
      return await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button')];
        const b = btns.find(x => x.textContent?.trim() === 'Render' && /_main_/.test(x.className))
          || btns.find(x => x.textContent?.trim() === 'Render');
        if (b) { b.click(); return true; }
        return false;
      });
    } catch { return null; }
  };
  const maxSize = () => Math.max(0, ...Object.values(listMp4s()), 0);

  // ── Render-Start verifizieren: Datei muss wachsen ODER Button auf "aktiv".
  // Der ffmpeg-Exporter schreibt inkrementell -> Wachstum ist das verlässlichste Signal.
  const startBase = maxSize();
  let started = false;
  for (let tries = 0; tries < 2 && !started; tries++) {
    const startDeadline = Date.now() + 45 * 1000;
    while (Date.now() < startDeadline) {
      await sleep(1500);
      if (maxSize() > startBase + 20000) { started = true; break; } // Datei wächst -> läuft
      if ((await readButtonIdle()) === false) { started = true; break; } // Button aktiv -> läuft
    }
    if (!started) { log(`Render-Start nicht erkannt – Klick #${tries + 2} …`); await clickRender(); }
  }
  if (started) log('Render läuft …');
  else log('Render-Start unklar – warte trotzdem auf die Datei.');

  // ── Fertig-Erkennung: gewachsene MP4 + danach stabil. Zwei Wege:
  //   a) Button wieder idle (schnell, wenn Frame lesbar), oder
  //   b) button-unabhängig: Datei groß genug + lange stabil (detachter Frame).
  // Validierung: MP4 ist erst fertig, wenn ffprobe eine plausible Dauer liest
  // (moov atom vorhanden). Ein gestockter Teil-Render hat KEIN moov -> nicht fertig.
  const FFPROBE = path.resolve('node_modules/@ffprobe-installer/darwin-arm64/ffprobe');
  const probeOk = (file) => {
    try {
      const r = spawnSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nk=1:nw=1', file], {encoding: 'utf8'});
      const d = parseFloat((r.stdout || '').trim());
      return Number.isFinite(d) && d > 1;
    } catch { return false; }
  };

  const deadline = Date.now() + 8 * 60 * 1000;
  let stable = 0;
  let prev = maxSize();
  let peak = prev;
  while (Date.now() < deadline) {
    await sleep(1500);
    const cur = maxSize();
    if (cur > peak) peak = cur;
    if (cur === prev) stable++;
    else stable = 0;
    prev = cur;

    const buttonIdle = await readButtonIdle();
    const grew = peak > startBase + 20000;
    // Kandidat für "fertig": Button idle ODER Datei lange stabil. Dann ffprobe-Gegencheck.
    const candidate = grew && ((buttonIdle === true && stable >= 2) || stable >= 8);
    if (candidate && Object.keys(listMp4s()).length) {
      const now = listMp4s();
      const files = Object.keys(now)
        .map(f => ({f, s: now[f], m: fs.statSync(path.join(OUTPUT_DIR, f)).mtimeMs}))
        .sort((a, b) => b.m - a.m);
      if (probeOk(path.join(OUTPUT_DIR, files[0].f))) {
        producedFile = files[0].f;
        ok = files[0].s > 10000;
        break;
      }
      // sonst: unfertig (kein moov) -> weiter warten
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
