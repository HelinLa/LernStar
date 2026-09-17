/* Prueft die Regeln von js/forschermodus.js gegen die WIRKLICHEN Texte der
 * Simulationen - und zwar in dem Zustand, in dem das Kind sie sieht: nach dem
 * Messen. Geprueft wird dreierlei:
 *   1. Greift jede Maske am echten Text?
 *   2. Gibt es jede verdeckte Stelle im HTML der Simulation?
 *   3. Verschwindet im Forschermodus die Antwort auch IM BILD (canvas)?
 *
 * Eigener Selbsttest: eine erfundene Maske darf NICHT greifen, und eine echte
 * MUSS greifen - sonst prueft das Werkzeug nichts ([[pruefwerkzeuge-eigene-fehler]]).
 */
const vm = require('vm');
const fs = require('fs');
const LS = '/Users/lala/Desktop/Claude/LernStar';
const { baueContext } = require(LS + '/simcheck/rauchtest.js');

function regelnLaden() {
  const quelle = fs.readFileSync(LS + '/js/forschermodus.js', 'utf8');
  const ctx = {
    document: {
      addEventListener: () => {}, getElementById: () => null, querySelector: () => null,
      createElement: () => ({ style: {}, classList: { add() {}, remove() {} }, appendChild() {} }),
      head: { appendChild() {} },
    },
    location: { hash: '' }, console,
    MutationObserver: function () { this.observe = () => {}; this.disconnect = () => {}; },
  };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.window.addEventListener = () => {};
  vm.createContext(ctx);
  vm.runInContext(quelle, ctx);
  return ctx.FELO_FORSCHERMODUS;
}

// Jede Simulation wird bedient wie ein Kind es tut - erst danach stehen die
// verraeterischen Zeilen ueberhaupt da.
const BEDIENUNG = {
  'federgesetz': `_fedSetFeder('weich'); _fedHaenge(100); _fedMessen(); _fedHaenge(100); _fedMessen();`,
  'ohm-kennlinie': `_ohgSetR('klein'); _ohgU_(1); _ohgMessen(); _ohgU_(1); _ohgMessen();`,
  // Messfahrt aufnehmen und die Auswertung t -> v oeffnen: erst dann stehen
  // "erwartet", "Literatur" und die Abweichung im Kasten.
  'beschleunigung-ef': `_befSetA(2); _befMessen(); _befSetPreset(0);`,
};

function lauf(simId, forschen) {
  const H = baueContext(LS + '/physics-sim.js');
  if (forschen) vm.runInContext(`window.FELO_FORSCHEN = ${JSON.stringify(simId)};`, H.ctx);
  vm.runInContext(`
    var __modal = document.createElement('div');
    document.body.appendChild(__modal);
    _physSimDefs[${JSON.stringify(simId)}](__modal);
  `, H.ctx);
  H.frames(4);
  try { vm.runInContext(BEDIENUNG[simId] || '', H.ctx); } catch (e) { /* gemeldet ueber leere Texte */ }
  H.frames(4);
  const voll = vm.runInContext('__modal.innerHTML', H.ctx) || '';
  const proId = new Map();
  for (const [id, el] of H.elemente) proId.set(id, el.innerHTML || el.textContent || '');
  return { voll, proId, bild: (H.texte || []).join('\n') };
}

const R = regelnLaden();
const fehler = [];
const gruen = [];

for (const [sim, regel] of Object.entries(R.REGELN)) {
  const z = lauf(sim, false);
  for (const m of regel.maske) {
    const id = m.sel.startsWith('#') ? m.sel.slice(1) : null;
    // Knopfbeschriftungen stehen in der Mini-DOM nicht als innerHTML, wohl aber
    // im gesetzten HTML - dann dort nachschlagen (id="x" ...>Text<).
    let text = id ? (z.proId.get(id) || '') : z.voll;
    if (id && !text) {
      const m = z.voll.match(new RegExp('id="' + id + '"[^>]*>([^<]*)<'));
      if (m) text = m[1];
    }
    const re = new RegExp(m.re.source, m.re.flags);
    if (!re.test(text)) fehler.push(`${sim}: Maske greift nicht – ${m.sel} ${m.re}\n        gefunden: ${JSON.stringify(text.slice(0, 160))}`);
    else gruen.push(`${sim} ${m.sel}`);
  }
  for (const sel of regel.weg) {
    const klasse = (sel.split(/\s+/).pop().match(/\.([a-z0-9-]+)/i) || [])[1];
    if (klasse && !z.voll.includes(klasse)) fehler.push(`${sim}: verdeckte Stelle nicht im HTML – ${sel}`);
    else gruen.push(`${sim} ${sel}`);
  }
}

const bildproben = [
  ['ohm-kennlinie', /R = \d+ Ω/, 'Widerstand im Diagramm'],
  ['beschleunigung-ef', /v = a · t/, 'Merkformel in der Meldezeile'],
];
for (const [sim, re, was] of bildproben) {
  const aus = lauf(sim, false).bild, an = lauf(sim, true).bild;
  if (!re.test(aus)) fehler.push(`${sim}: ${was} steht normal GAR NICHT im Bild – der Riegel prüft nichts`);
  else if (re.test(an)) fehler.push(`${sim}: ${was} steht im Forschermodus immer noch im Bild`);
  else gruen.push(`${sim} Bild: ${was} verdeckt`);
}

{ // Selbsttest
  const z = lauf('federgesetz', false);
  if (/Diese Zeichenkette steht nirgends 12345/.test(z.voll)) fehler.push('Selbsttest: erfundene Maske hat gegriffen');
  if (!/Ausgleichsgerade/.test(z.proId.get('fedStatus') || '')) fehler.push('Selbsttest: die Simulation wurde nicht wirklich bedient (keine Ausgleichsgerade im Status)');
}

console.log(fehler.length ? `✗ ${fehler.length} Befunde (${gruen.length} Proben bestanden):` : `✓ Forschermodus: ${gruen.length} Proben bestanden, alle Regeln greifen`);
fehler.forEach(f => console.log('   ' + f));
process.exit(fehler.length ? 1 : 0);
