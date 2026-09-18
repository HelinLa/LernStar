/* Prueft den ABLAUF von js/forschermodus.js an einer nachgebauten Oberflaeche:
 *   - schaltet er nur bei der richtigen Seite UND der richtigen Simulation ein?
 *   - werden Stellen verdeckt und Texte maskiert?
 *   - holt "Auswertung zeigen" alles zurueck (Klassen UND Originaltexte)?
 * Die Masken selbst prueft modus_test.js an den echten Texten der Simulationen.
 */
const vm = require('vm');
const fs = require('fs');
const LS = '/Users/lala/Desktop/Claude/LernStar';

function bauen() {
  const gemacht = { verdeckt: new Set(), maskiert: new Map(), leiste: null };

  function el(html, id) {
    return {
      id, _html: html, isConnected: true,
      get innerHTML() { return this._html; },
      set innerHTML(v) { this._html = v; if (id) gemacht.maskiert.set(id, v); },
      classList: {
        add: k => gemacht.verdeckt.add((id || '?') + ':' + k),
        remove: k => gemacht.verdeckt.delete((id || '?') + ':' + k),
      },
      querySelector: () => null, querySelectorAll: () => [],
      addEventListener() {}, remove() { gemacht.leiste = null; },
      insertBefore() {}, appendChild() {},
    };
  }

  // Die Elemente, die die Regeln fuer federgesetz ansprechen
  const status = el('Angehängt: <b>m = 200 g</b> → <b>F = m · g = 1,96 N</b> → Dehnung <b>s = 3,92 cm</b> · Ausgleichsgerade durch 2 Punkte: <b>Steigung D = 0,50 N/cm</b>.', 'fedStatus');
  const note = el(' Hänge Gewichte an die Feder. Ab zwei Punkten legt die Simulation die Ausgleichsgerade hindurch – ihre Steigung ist die Federhärte D.', 'note1');
  const lawNote = el('Die Messpunkte liegen auf einer Geraden …', 'note2');
  const hint = el('Doppelte Kraft → doppelte Dehnung.', 'hint');

  const treffer = {
    '.fed-sim .fpm-grid .fpm-note': [lawNote],
    '.fed-sim > .sim-hint': [hint],
    '.fed-sim > .fpm-note': [note],
    '#fedStatus': [status],
  };
  // Wie im echten DOM: die Suche nach bereits verdeckten Stellen findet genau die,
  // die eine Klasse bekommen haben.
  const alleEl = [status, note, lawNote, hint];
  Object.defineProperty(treffer, '.fm-verdeckt', {
    get: () => alleEl.filter(e => gemacht.verdeckt.has(e.id + ':fm-verdeckt')),
  });

  const box = {
    querySelector: sel => (sel === '.fm-leiste' ? gemacht.leiste : (sel === '.sim-h3' ? { nextSibling: {} } : null)),
    querySelectorAll: sel => treffer[sel] || [],
    insertBefore: (d) => { gemacht.leiste = d; },
    firstChild: null,
  };
  const modal = { querySelector: sel => (sel === '.sim-box' ? box : null) };

  const horcher = {};
  const ctx = {
    console,
    location: { hash: '#experiment=federgesetz&heft=kf3' },
    document: {
      addEventListener: (n, f) => { horcher[n] = f; },
      getElementById: id => (id === 'physModal' ? modal : (id === 'forschermodus-stil' ? {} : null)),
      querySelector: () => null,
      createElement: () => {
        const d = el('', 'leiste');
        d.querySelector = () => ({ addEventListener: (n, f) => { d._klick = f; } });
        return d;
      },
      head: { appendChild() {} },
    },
    MutationObserver: function (cb) { this.observe = () => {}; this.disconnect = () => {}; this.cb = cb; },
    setTimeout: (f) => f(),
  };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.window.addEventListener = (n, f) => { horcher['win:' + n] = f; };
  vm.createContext(ctx);
  // Erst die ERZEUGTE Regeldatei, dann das Programm - genau wie in index.html.
  vm.runInContext(fs.readFileSync(LS + '/js/forschermodus-regeln.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(LS + '/js/forschermodus.js', 'utf8'), ctx);
  return { ctx, horcher, gemacht, status, note };
}

const fehler = [];
{
  const { ctx, horcher, gemacht, status, note } = bauen();
  // 1. richtige Seite + richtige Simulation -> Modus an
  horcher['physsim:offen']({ detail: { simId: 'federgesetz' } });
  if (ctx.FELABS_FORSCHEN !== 'federgesetz') fehler.push('Modus schaltet bei kf3/federgesetz NICHT ein');
  if (!gemacht.leiste) fehler.push('Die Leiste mit „Auswertung zeigen“ fehlt');
  if (!gemacht.verdeckt.has('note2:fm-verdeckt')) fehler.push('Der Gesetzeskasten wurde nicht verdeckt');
  if (!gemacht.verdeckt.has('hint:fm-verdeckt')) fehler.push('Die Fußzeile mit F = D · s wurde nicht verdeckt');
  if (/Steigung D = /.test(status.innerHTML)) fehler.push('Die Steigung steht trotz Forschermodus noch in der Statuszeile');
  if (/Federhärte D/.test(note.innerHTML)) fehler.push('Der Hinweis nennt die Federhärte immer noch');

  // 2. Aufdecken holt alles zurueck
  gemacht.leiste._klick();
  if (ctx.FELABS_FORSCHEN) fehler.push('Nach „Auswertung zeigen“ ist der Modus noch an');
  if (gemacht.verdeckt.size) fehler.push('Nach dem Aufdecken bleiben Stellen verdeckt: ' + [...gemacht.verdeckt]);
  if (!/Steigung D = /.test(status.innerHTML)) fehler.push('Nach dem Aufdecken fehlt die Steigung in der Statuszeile');
  if (!/Federhärte D/.test(note.innerHTML)) fehler.push('Nach dem Aufdecken fehlt der Hinweis mit der Federhärte');
}
{
  // 3. Dieselbe Simulation aus einem ANDEREN Heft: Modus muss AUS bleiben
  const { ctx, horcher, gemacht } = bauen();
  ctx.location.hash = '#experiment=federgesetz&heft=kr4';   // Realschule 9, gedruckt
  horcher['physsim:offen']({ detail: { simId: 'federgesetz' } });
  if (ctx.FELABS_FORSCHEN) fehler.push('Modus schaltet auch bei einer FREMDEN Heftseite ein – gedruckte Seiten waeren betroffen');
  if (gemacht.leiste) fehler.push('Fremde Heftseite bekommt die Forscherleiste');
}
{
  // 4. Richtige Seite, aber andere Simulation (Notnagel im Banner): AUS
  const { ctx, horcher } = bauen();
  horcher['physsim:offen']({ detail: { simId: 'magnetfeld' } });
  if (ctx.FELABS_FORSCHEN) fehler.push('Modus schaltet bei der falschen Simulation ein');
}

console.log(fehler.length ? `✗ ${fehler.length} Befunde im Ablauf:` : '✓ Ablauf: einschalten, verdecken, maskieren, aufdecken – und AUS bei fremden Heftseiten');
fehler.forEach(f => console.log('   ' + f));
process.exit(fehler.length ? 1 : 0);
