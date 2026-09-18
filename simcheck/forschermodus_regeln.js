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
  // Seiten, Regeln und Bedienung stehen in der ERZEUGTEN Datei
  // js/forschermodus-regeln.js (simcheck/forschermodus_bauen.py schreibt sie).
  const ctx = { console };
  ctx.window = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(LS + '/js/forschermodus-regeln.js', 'utf8'), ctx);
  return {
    SEITEN: vm.runInContext('FELABS_FORSCHEN_SEITEN', ctx),
    REGELN: vm.runInContext('FELABS_FORSCHEN_REGELN', ctx),
    BEDIENUNG: vm.runInContext('FELABS_FORSCHEN_BEDIENUNG', ctx),
  };
}

// Jede Simulation wird bedient wie ein Kind es tut - erst danach stehen die
// verraeterischen Zeilen ueberhaupt da.


function lauf(simId, forschen) {
  const H = baueContext(LS + '/physics-sim.js');
  if (forschen) vm.runInContext(`window.FELABS_FORSCHEN = ${JSON.stringify(simId)};`, H.ctx);
  vm.runInContext(`
    var __modal = document.createElement('div');
    document.body.appendChild(__modal);
    _physSimDefs[${JSON.stringify(simId)}](__modal);
  `, H.ctx);
  H.frames(4);
  try { vm.runInContext(R.BEDIENUNG[simId] || '', H.ctx); } catch (e) { /* gemeldet ueber leere Texte */ }
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

// Stellen IM BILD (canvas): Sie muessen normal dastehen und im Forschermodus
// verschwinden. Welche das sind, steht als "bild" in der Regelquelle.
const quelle = JSON.parse(fs.readFileSync(LS + '/js/forschermodus-regeln.quelle.json', 'utf8'));
for (const [sim, r] of Object.entries(quelle.regeln)) {
  for (const muster of (r.bild || [])) {
    const re = new RegExp(muster);
    const aus = lauf(sim, false).bild, an = lauf(sim, true).bild;
    if (!re.test(aus)) fehler.push(`${sim}: „${muster}" steht normal GAR NICHT im Bild – die Probe prüft nichts`);
    else if (re.test(an)) fehler.push(`${sim}: „${muster}" steht im Forschermodus immer noch im Bild`);
    else gruen.push(`${sim} Bild: ${muster}`);
  }
}

{ // Selbsttest
  const z = lauf('federgesetz', false);
  if (/Diese Zeichenkette steht nirgends 12345/.test(z.voll)) fehler.push('Selbsttest: erfundene Maske hat gegriffen');
  if (!/Ausgleichsgerade/.test(z.proId.get('fedStatus') || '')) fehler.push('Selbsttest: die Simulation wurde nicht wirklich bedient (keine Ausgleichsgerade im Status)');
}

console.log(fehler.length ? `✗ ${fehler.length} Befunde (${gruen.length} Proben bestanden):` : `✓ Forschermodus: ${gruen.length} Proben bestanden, alle Regeln greifen`);
fehler.forEach(f => console.log('   ' + f));
process.exit(fehler.length ? 1 : 0);
