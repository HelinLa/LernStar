// Rendert EIN Szenen-SVG nach img/  ->  node render_one.js svg/einstieg_l1.svg
// Danach das PNG anschauen und nachbessern. Breite 900 px wie render_einstieg.js.
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs'), path = require('path');
const f = process.argv[2];
if (!f) { console.log('Aufruf: node render_one.js svg/einstieg_<id>.svg'); process.exit(1); }
const svg = fs.readFileSync(f, 'utf8');
const ziel = path.join(__dirname, 'img', path.basename(f).replace(/\.svg$/, '.png'));
try {
  fs.writeFileSync(ziel, new Resvg(svg, { fitTo: { mode: 'width', value: 900 } }).render().asPng());
  console.log('OK ->', ziel);
} catch (e) {
  console.log('FEHLER:', e.message.split('\n')[0]); process.exit(2);
}
