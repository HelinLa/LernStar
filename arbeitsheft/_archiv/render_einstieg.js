// SVG-Einstiegsbilder -> img/einstieg_<tid>.png
// Aufruf: node render_einstieg.js
//
// Warum 900 px breit: build_final.pastefit skaliert die Datei auf 587 x 352 Pixel
// (306 pt Box x S=2). Die alten PIL-Bilder waren nur 300 x 180 gross und wurden
// dabei auf das Doppelte hochgerechnet - daher waren sie weich. Ab 587 px Breite
// wird nur noch verkleinert, und das Bild bleibt scharf.
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, 'svg'), OUT = path.join(__dirname, 'img'), BREITE = 900;

const dateien = fs.readdirSync(SRC).filter(f => /^einstieg_.*\.svg$/.test(f));
if (!dateien.length) { console.log('keine svg/einstieg_*.svg gefunden'); process.exit(0); }
for (const f of dateien) {
  const svg = fs.readFileSync(path.join(SRC, f), 'utf8');
  try {
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: BREITE } }).render().asPng();
    const ziel = path.join(OUT, f.replace(/\.svg$/, '.png'));
    fs.writeFileSync(ziel, png);
    console.log('  ', path.basename(ziel), BREITE + 'px');
  } catch (e) {
    console.log('   FEHLER', f, '->', e.message.split('\n')[0].slice(0, 140));
  }
}
