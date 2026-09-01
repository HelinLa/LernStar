/* rauchtest.js - bedient Simulationen aus physics-sim.js in einer Mini-DOM-Umgebung.
 *
 * Prueft je Simulation drei Dinge:
 *   1. Laeuft sie ohne Laufzeitfehler an?
 *   2. Bewegt sich etwas? (Frame 5 gegen Frame 45 vergleichen -> "STEHT STILL")
 *   3. Reagiert sie auf ihre eigenen Bedienelemente? (jeden Regler/Knopf betaetigen)
 *
 * Fallen, die hier beruecksichtigt sind:
 *   - top-level `let`/`class` legen im vm-Context KEINE Eigenschaft am Context-Objekt
 *     an. Alles laeuft deshalb ueber vm.runInContext, nie ueber ctx.<name>.
 *   - Text steht teils nur im Canvas (ctx.fillText) - der wird mitgeschnitten.
 *   - Manche Sims schreiben mit textContent statt innerHTML - beides wird gelesen.
 */
const fs = require('fs'), vm = require('vm'), path = require('path');

const QUELLE = path.join(__dirname, '..', '..', '..', '..');   // ungenutzt, Pfad kommt per Argument

function baueContext(datei) {
  const elemente = new Map();
  const zeichnung = [];      // Signatur aller Zeichenbefehle des laufenden Frames
  const texte = [];          // alles, was per fillText ins Bild geschrieben wird
  let rafQueue = [];

  const attrRe = /<(\w+)([^>]*)>/g;
  const handler = [];          // auch Knoepfe OHNE id - die Sprungmarken haben keine
  function parseIds(html, besitzer) {
    let m;
    attrRe.lastIndex = 0;
    while ((m = attrRe.exec(html))) {
      const tag = m[1], attrs = m[2];
      const idM = /\bid="([^"]+)"/.exec(attrs);
      const ocA = /\bonclick="([^"]*)"/.exec(attrs);
      const oiA = /\boninput="([^"]*)"/.exec(attrs);
      if (!idM && (ocA || oiA)) handler.push({ id: null, code: (ocA || oiA)[1] });
      if (!idM) continue;
      const el = neuesElement(tag);
      el.id = idM[1];
      const vM = /\bvalue="([^"]*)"/.exec(attrs);   if (vM) el.value = vM[1];
      const mnM = /\bmin="([^"]*)"/.exec(attrs);    if (mnM) el.min = mnM[1];
      const mxM = /\bmax="([^"]*)"/.exec(attrs);    if (mxM) el.max = mxM[1];
      const clM = /\bclass="([^"]*)"/.exec(attrs);  if (clM) el.className = clM[1];
      const wM = /\bwidth="([^"]*)"/.exec(attrs);   if (wM) el.width = +wM[1];
      const hM = /\bheight="([^"]*)"/.exec(attrs);  if (hM) el.height = +hM[1];
      // Bedienbefehle mitschneiden, damit der Treiber sie spaeter ausloesen kann
      const oi = /\boninput="([^"]*)"/.exec(attrs); if (oi) el._oninput = oi[1];
      const oc = /\bonclick="([^"]*)"/.exec(attrs); if (oc) el._onclick = oc[1];
      elemente.set(el.id, el);
    }
  }

  function neuesElement(tag) {
    const el = {
      tagName: (tag || 'div').toUpperCase(), id: '', className: '', value: '',
      style: {}, dataset: {}, children: [], textContent: '', checked: false,
      width: 440, height: 330,
      appendChild(c) { this.children.push(c); return c; },
      removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); },
      setAttribute(k, v) { this[k] = v; },
      getAttribute(k) { return this[k]; },
      addEventListener() {}, removeEventListener() {}, focus() {}, blur() {}, click() {},
      querySelector() { return null; },
      querySelectorAll() { return []; },
      getBoundingClientRect() { return { left: 0, top: 0, width: this.width, height: this.height }; },
      closest() { return null; },
      insertAdjacentHTML() {},
      getContext() { return zeichenContext(); },
      toDataURL() { return 'data:,'; },
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    };
    let html = '';
    Object.defineProperty(el, 'innerHTML', {
      get() { return html; },
      set(v) { html = String(v); parseIds(html, el); },
    });
    return el;
  }

  function zeichenContext() {
    const eigen = { canvas: { width: 440, height: 330 } };
    return new Proxy(eigen, {
      get(t, k) {
        if (k in t) return t[k];
        if (k === 'measureText') return s => ({ width: String(s).length * 6 });
        if (k === 'createLinearGradient' || k === 'createRadialGradient')
          return () => ({ addColorStop() {} });
        if (k === 'createPattern') return () => ({});
        if (k === 'getImageData' || k === 'createImageData')
          // Echte Browser-Schnittstelle: liefert ein ImageData-Objekt MIT data-Feld.
          // Ohne das brach sternspektrum mit "Cannot read properties of undefined
          // (reading 'data')" ab - ein Fehler des Pruefers, nicht der Simulation.
          return (a, b) => {
            const w = typeof a === 'number' ? a : (a && a.width) || 1;
            const h = typeof b === 'number' ? b : (a && a.height) || 1;
            return { width: w, height: h, data: new Uint8ClampedArray(Math.max(4, w * h * 4)) };
          };
        if (k === 'fillText' || k === 'strokeText')
          return (s, x, y) => { merken(texte, String(s)); merken(zeichnung, k + '|' + s + '|' + r(x) + '|' + r(y)); };
        return (...a) => { merken(zeichnung, String(k) + '|' + a.map(r).join(',')); };
      },
      set(t, k, v) { t[k] = v; merken(zeichnung, 'set:' + String(k) + '=' + String(v)); return true; },
    });
  }
  const r = v => (typeof v === 'number' ? v.toFixed(2) : String(v));

  /* Gedeckelt sammeln. Ohne Deckel wuchs die Liste bei einem Durchlauf ueber alle
     214 Simulationen so weit, dass node mit "Abort trap: 6" ausstieg. Fuer den
     Vergleich Bild gegen Bild reicht ein Frame - der ist nie so lang. */
  const DECKEL = 40000;
  function merken(liste, wert) {
    if (liste.length >= DECKEL) liste.splice(0, DECKEL / 2);
    liste.push(wert);
  }

  const document = {
    body: neuesElement('body'),
    head: neuesElement('head'),
    documentElement: neuesElement('html'),
    createElement: neuesElement,
    createElementNS: neuesElement,
    createTextNode: t => ({ textContent: t }),
    getElementById: id => elemente.get(id) || null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {},
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
  };
  Object.defineProperty(document.body, 'appendChild', {
    value(c) { this.children.push(c); return c; }, writable: true,
  });

  const store = {};
  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; },
  };

  const ctx = {
    document, localStorage, sessionStorage: localStorage,
    console, Math, Date, JSON, parseInt, parseFloat, isFinite, isNaN,
    Number, String, Boolean, Array, Object, Error, RegExp, Map, Set, Promise,
    Uint8ClampedArray, Float32Array, Symbol,
    setTimeout: (f) => { return 0; }, clearTimeout() {},
    setInterval: () => 0, clearInterval() {},
    requestAnimationFrame: f => { rafQueue.push(f); return rafQueue.length; },
    cancelAnimationFrame: () => { rafQueue = []; },
    navigator: { userAgent: 'node', language: 'de-DE', clipboard: { writeText: () => Promise.resolve() } },
    location: { href: 'http://x/', hash: '' },
    performance: { now: () => Date.now() },
    alert() {}, confirm: () => true, prompt: () => '',
    // Browser-Handler greifen auf das globale `event` zu - ohne das brach
    // sternspektrum beim Bedienen ab ("event is not defined").
    event: {
      clientX: 120, clientY: 90, offsetX: 120, offsetY: 90, pageX: 120, pageY: 90,
      key: 'Enter', keyCode: 13, button: 0, type: 'click',
      preventDefault() {}, stopPropagation() {},
      target: { value: '1', dataset: {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 440, height: 330 }) },
      touches: [{ clientX: 120, clientY: 90 }],
    },
    speechSynthesis: { speak() {}, cancel() {}, getVoices: () => [] },
    SpeechSynthesisUtterance: function () {},
    fetch: () => Promise.reject(new Error('kein Netz im Test')),
    AudioContext: function () { return { createOscillator: () => ({ connect() {}, start() {}, stop() {}, frequency: { value: 0 } }), createGain: () => ({ connect() {}, gain: { value: 0 } }), destination: {}, currentTime: 0 }; },
  };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(datei, 'utf8'), ctx, { filename: 'physics-sim.js' });

  return {
    ctx, elemente, zeichnung, texte, handler,
    frames(n) {
      for (let i = 0; i < n; i++) {
        const q = rafQueue; rafQueue = [];
        for (const f of q) f(performance.now());
      }
    },
    hatRaf: () => rafQueue.length > 0,
  };
}

/* ── Treiber ─────────────────────────────────────────── */
function pruefe(datei, simId) {
  const befund = { sim: simId, fehler: [], texte: [], bewegt: null, bedient: 0 };
  let H;
  try { H = baueContext(datei); } catch (e) { befund.fehler.push('Laden: ' + e.message); return befund; }

  try {
    vm.runInContext(`
      var __modal = document.createElement('div');
      document.body.appendChild(__modal);
      _physSimDefs[${JSON.stringify(simId)}](__modal);
    `, H.ctx);
  } catch (e) { befund.fehler.push('Start: ' + e.message); return befund; }

  // Bewegung pruefen: GENAU EIN Frame gegen GENAU EIN Frame, sonst vergleicht man
  // nur unterschiedlich lange Listen und haelt jede stehende Sim fuer lebendig.
  try { H.frames(4); } catch (e) { befund.fehler.push('Frame: ' + e.message); return befund; }
  H.zeichnung.length = 0;
  try { H.frames(1); } catch (e) { befund.fehler.push('Frame: ' + e.message); return befund; }
  const sig1 = H.zeichnung.join(';');
  try { H.frames(40); } catch (e) { befund.fehler.push('Frame: ' + e.message); return befund; }
  H.zeichnung.length = 0;
  try { H.frames(1); } catch (e) { befund.fehler.push('Frame: ' + e.message); return befund; }
  const sig2 = H.zeichnung.join(';');
  befund.bewegt = sig1 !== sig2;
  befund.frameGroesse = H.zeichnung.length;

  // Reagiert die Simulation auf Bedienung? Das ist der eigentliche Massstab.
  // "STEHT STILL" allein ist KEIN Mangel: Die meisten Simulationen dieses Projekts
  // sind Messgeraete, keine Filme - sie aendern sich, wenn man etwas verstellt,
  // und stehen sonst zu Recht still. Tot ist eine Simulation erst, wenn sich auch
  // nach dem Betaetigen aller Bedienelemente nichts aendert.
  H.zeichnung.length = 0; H.frames(1);
  const sigVor = H.zeichnung.join(';');

  // jedes Bedienelement einmal betaetigen - ebenfalls ueber eine Kopie, aus
  // demselben Grund wie unten bei den Knoepfen ohne id.
  for (const [id, el] of [...H.elemente]) {
    const code = el._oninput || el._onclick;
    if (!code) continue;
    try {
      if (el._oninput && el.min !== undefined && el.max !== undefined) {
        const mid = String(Math.round((+el.min + +el.max) / 2));
        vm.runInContext(
          `(function(){var this_=document.getElementById(${JSON.stringify(id)});this_.value=${JSON.stringify(mid)};` +
          `event.currentTarget=this_;event.target=this_;` +
          `var f=function(){${code.replace(/\bthis\b/g, 'this_')}};f();})()`, H.ctx);
      } else {
        vm.runInContext(`(function(){var this_=document.getElementById(${JSON.stringify(id)});` +
          `event.currentTarget=this_;event.target=this_;` +
          `var f=function(){${code.replace(/\bthis\b/g, 'this_')}};f();})()`, H.ctx);
      }
      befund.bedient++;
      H.frames(2);
    } catch (e) {
      befund.fehler.push(`Bedienen ${id}: ${e.message}`);
    }
  }

  // Sprungmarken und andere Knoepfe ohne id.
  // WICHTIG: erst eine Kopie ziehen und doppelte Aufrufe entfernen. Jedes Setzen
  // von innerHTML haengt neue Eintraege an H.handler an - wer direkt ueber die
  // Liste laeuft, betaetigt endlos immer dieselben Knoepfe und der Speicher
  // laeuft voll. Genau daran sind sechs Simulationen mit Messreihen-Tabelle
  // gescheitert (freileitungen, generator, transformator-schluessel,
  // geiger-mueller, kraft-wirkungen, stromwirkungen).
  const schonBedient = new Set();
  const handlerListe = H.handler.slice().filter(h => {
    if (schonBedient.has(h.code)) return false;
    schonBedient.add(h.code); return true;
  });
  for (const h of handlerListe) {
    try {
      vm.runInContext(`(function(){var f=function(){${h.code}};f();})()`, H.ctx);
      befund.bedient++;
      H.frames(2);
    } catch (e) { befund.fehler.push(`Bedienen (ohne id) "${h.code.slice(0, 40)}": ${e.message}`); }
  }

  H.zeichnung.length = 0; H.frames(1);
  befund.reagiert = H.zeichnung.join(';') !== sigVor;

  // ablesbare Texte einsammeln: innerHTML, textContent und Canvas
  const gesehen = new Set(H.texte);
  for (const [, el] of H.elemente) {
    if (el.innerHTML) gesehen.add(el.innerHTML.replace(/<[^>]+>/g, ' '));
    if (el.textContent) gesehen.add(el.textContent);
  }
  befund.texte = [...gesehen];
  return befund;
}

if (require.main === module) {
  const datei = process.argv[2];
  const sims = process.argv.slice(3);
  let schlecht = 0;
  for (const s of sims) {
    const b = pruefe(datei, s);
    const stand = b.fehler.length ? '✗ FEHLER'
                : b.bewegt ? '✓ animiert'
                : b.reagiert ? '✓ reagiert'
                : '⚠ TOT';
    if (b.fehler.length || (!b.bewegt && !b.reagiert)) schlecht++;
    console.log(`${stand.padEnd(14)} ${s.padEnd(24)} ${b.bedient} Bedienelemente`);
    for (const f of b.fehler) console.log('      ! ' + f);
  }
  process.exit(schlecht ? 1 : 0);
}
module.exports = { pruefe, baueContext };
