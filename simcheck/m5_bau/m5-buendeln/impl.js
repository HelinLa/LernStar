
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mz1 „Zehn Einer sind ein Zehner“ (Kennung m5-buendeln)
// Ueberschrift = Frage der Einheit: „Welche Zahl liegt da wirklich?“
//
// Was man sieht: einen Legetisch, gebaut wie eine Stellenwerttafel. Vier
// Felder nebeneinander, links nach rechts T | H | Z | E; oben in jedem Feld
// der Buchstabe gross und darunter das Wort („Tausender“, „Hunderter“,
// „Zehner“, „Einer“). Das Material liegt in Zehner- und Fuenferstruktur,
// nie als Haufen:
//   Einer      gruene Wuerfelchen in Fuenferreihen; zwei Reihen = zehn,
//              danach eine Luecke
//   Zehner     blaue Stangen aus 10 Wuerfeln mit dunkler Fuenfermarke in der
//              Mitte, in Fuenfergruppen nebeneinander, zehn je Reihe
//   Hunderter  rote Platten 10 x 10 mit Fuenferlinien, in Fuenferreihen
//   Tausender  lila Wuerfel, in Fuenfersaeulen
// Unten im Bild, unter jedem Feld, steht die ANZAHL der Stuecke – das ist
// die Tafel T · H · Z · E. Eine Anzahl ab 10 ist orange hinterlegt und
// pulsiert leise. T bleibt leer, solange dort nichts liegt. (Die Tafel steht
// IM Bild statt als HTML unter der Leinwand: so fluchten ihre Zellen immer
// mit den Feldern darueber, auch im Vollbild, und sie leuchtet im selben
// Augenblick auf, in dem das Material landet.)
//
// Knoepfe (Bauplan mz1, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m5aMarke('…')):
//     „1 H, 9 Z, 10 E“ · „2 H, 9 Z, 12 E“ · „0 H, 15 Z, 7 E“ · „4 H, 10 Z, 0 E“
//   Reihe 2: „+ 1 Einer“ · „+ 1 Zehner“ · „+ 1 Hunderter“ (_m5aPlus(1|10|100))
//            · „bündeln“ (_m5aBuendeln()) · „neu“ (_m5aNeu())
// Eine Sprungmarke raeumt den Tisch ab und legt das Material neu: die Stuecke
// fallen gestaffelt von oben in ihre Plaetze (rund 0,7 s). „+ 1 …“ laesst
// ein Stueck in sein Feld fallen.
//
// „bündeln“ macht EINEN Tausch, von rechts her: die erste Stelle (E, dann Z,
// dann H) mit 10 oder mehr Stueck. Zehn Stueck gleiten zusammen (0,8 s:
// zehn Einer zu einer Saeule, zehn Stangen zu einem Quadrat, zehn Platten zu
// einem Stapel), verschmelzen mit kurzem Aufhellen zu einem Stueck der
// naechsten Stelle, und das gleitet ins linke Feld (0,6 s) – die Platte
// schrumpft dabei auf ihre Feldgroesse. ERST BEI DER LANDUNG springen Tafel
// und Statuszeilen um; die beiden beteiligten Zellen leuchten kurz. Wer
// waehrend der Bewegung einen Knopf drueckt, laesst den Tausch sofort landen
// und dann geschieht das Neue (so ergibt jede Knopffolge denselben Zustand).
// Nichts mehr zu tauschen -> Statuszeile „Es gibt nichts mehr zu bündeln.“
//
// Grenzen: „+ 1 …“ legt je Feld bis 19 Stueck, danach „Das Feld ist voll.“
// (das Feld wackelt kurz). Ein Buendel darf ein Feld auf 20 bringen – sonst
// saesse man bei 19 Einern und 19 Zehnern fest. Ist das Zielfeld voll, nimmt
// „bündeln“ die naechste Stelle weiter links; geht gar nichts, steht „Das
// Feld ist voll.“ da. T traegt hoechstens 9 Wuerfel: links davon gibt es
// kein Feld mehr (erreichbar nur mit rund hundert Mal „+ 1 Hunderter“).
//
// Statuszeilen (woertlich):
//   _m5a-tisch    „Auf dem Tisch: 1 H, 9 Z, 10 E“ (T nur, wenn > 0:
//                 „Auf dem Tisch: 1 T, 0 H, 0 Z, 0 E“)
//   _m5a-zahl     „Zahl: ?“, solange eine Stelle 10 oder mehr hat, sonst
//                 „Zahl: 200“ (Tausendertrenner U+00A0: „Zahl: 1 000“)
//   _m5a-menge    „Zusammen: 200 Einer“ – bleibt beim Buendeln gleich, das
//                 ist die Invariante
//   _m5a-meldung  nur bei Bedarf: „Es gibt nichts mehr zu bündeln.“ ·
//                 „Das Feld ist voll.“
//
// Werte (jeder Schritt nachgerechnet mit simcheck/werte.js):
//   1 H, 9 Z, 10 E -> 1 H, 10 Z, 0 E (Zahl: ?) -> 2 H, 0 Z, 0 E · Zahl: 200
//                     · Zusammen: 200 Einer (vorher, dazwischen, danach)
//   2 H, 9 Z, 12 E -> 2 H, 10 Z, 2 E (Zahl: ?) -> 3 H, 0 Z, 2 E · Zahl: 302
//   0 H, 15 Z, 7 E -> 1 H, 5 Z, 7 E · Zahl: 157
//   4 H, 10 Z, 0 E -> 5 H, 0 Z, 0 E · Zahl: 500
// Start: leerer Tisch, „Auf dem Tisch: 0 H, 0 Z, 0 E“, „Zahl: 0“,
// „Zusammen: 0 Einer“.
//
// Aha (_bioFx, ruhig, OHNE Textstreifen): die zweite Buendelung in Zeile 1 –
// zehn Zehner werden ein Hunderter, unmittelbar nachdem zehn Einer ein
// Zehner wurden (1 H, 10 Z, 0 E -> 2 H). Dann laeuft ein Lichtring ueber das
// Hunderterfeld (um die Platte, die gerade gelandet ist), und die Zelle H
// der Tafel leuchtet laenger nach. Dasselbe in Zeile 2 (2 H, 10 Z, 2 E ->
// 3 H). Wird eine Zahl lesbar (keine Stelle mehr ab 10), leuchten alle
// Zellen der Tafel kurz auf – ohne Wort.
//
// Faktendump: simfakten.js nimmt nur Textfelder ueber 18 Zeichen auf. „Zahl:
// 200“ ist kuerzer und fehlt deshalb im Dump; die Zahl steht dort in
// „Zusammen: 200 Einer“, die Zeile „Zahl: …“ belegt werte.js.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): das Merksatzwort
// „einem“, „höchstens“, „neun“ – und ueberhaupt keine Regel: Die Seite
// benennt sie erst im Merksatz. Keine Namen, keine Punkte, keine Zeit.
// Deterministisch, ohne Zufall.
// ════════════════════════════════════════════════════════════════════════
let _m5a = null;
const _m5aREIHE = ['T', 'H', 'Z', 'E'];                 // links nach rechts
const _m5aNACH = { E: 'Z', Z: 'H', H: 'T' };            // wohin ein Buendel gleitet
const _m5aWORT = { T: 'Tausender', H: 'Hunderter', Z: 'Zehner', E: 'Einer' };
const _m5aMARKEN = {                                      // [H, Z, E]
  '1-9-10': [1, 9, 10], '2-9-12': [2, 9, 12], '0-15-7': [0, 15, 7], '4-10-0': [4, 10, 0]
};
const _m5aK = {
  VOLL: 19,                    // „+ 1 …“ legt bis hierhin
  PLATZ: 20,                   // so viele Stuecke fasst ein Feld (19 + 1 aus einem Buendel)
  T_MAX: 9,                    // links von T gibt es kein Feld
  SAMMELN: 0.8, GLEITEN: 0.6, BLITZ: 0.3,   // s
  X0: 6, X1: 414,              // Tisch links/rechts
  Y0: 6, YK: 42, YT: 194, Y1: 244,          // oben, Kopf bis YK, Tafelzeile ab YT, unten
  SP: { T: [6, 74], H: [74, 228], Z: [228, 332], E: [332, 414] }   // Felder (x von, x bis)
};
const _m5aFARBE = {
  T: { grund: '#f5f3ff', fuell: '#c4b5fd', oben: '#ede9fe', seite: '#a78bfa', rand: '#6d28d9' },
  H: { grund: '#fef2f2', fuell: '#fca5a5', linie: 'rgba(185,28,28,0.35)', rand: '#b91c1c' },
  Z: { grund: '#eff6ff', fuell: '#93c5fd', linie: 'rgba(29,78,216,0.45)', rand: '#1d4ed8' },
  E: { grund: '#f0fdf4', fuell: '#86efac', licht: '#dcfce7', rand: '#15803d' }
};

// Platz des i-ten Stuecks (0 = erstes) in einem Feld: Kasten x, y, w, h.
function _m5aPlatz(st, i) {
  const S = _m5aK.SP[st][0];
  if (st === 'E') {                       // Fuenferreihen, nach zehn eine Luecke
    const c = i % 5, r = Math.floor(i / 5);
    return { x: S + 7.5 + c * 14, y: 52 + r * 14 + (r >= 2 ? 7 : 0), w: 11, h: 11 };
  }
  if (st === 'Z') {                       // zehn Stangen je Reihe, 5 + 5
    const k = i % 10, r = Math.floor(i / 10);
    return { x: S + 5.5 + k * 9 + (k >= 5 ? 5 : 0), y: 52 + r * 67, w: 7, h: 55 };
  }
  if (st === 'H') {                       // Fuenferreihen, nach zehn eine Luecke
    const c = i % 5, r = Math.floor(i / 5);
    return { x: S + 6 + c * 29, y: 52 + r * 29 + (r >= 2 ? 8 : 0), w: 26, h: 26 };
  }
  const c = Math.floor(i / 5), r = i % 5;  // T: Fuenfersaeulen
  return { x: S + 4 + c * 32, y: 47 + r * 29, w: 28, h: 28 };
}
// Wohin das k-te der zehn Stuecke beim Sammeln gleitet.
function _m5aSammelZiel(st, k) {
  if (st === 'E') return { x: 369.5, y: 128 + k * 5.5, w: 7, h: 5.5 };   // Saeule = Stange
  if (st === 'Z') return { x: 252.5 + k * 5.5, y: 52, w: 5.5, h: 55 };   // Quadrat = Platte
  return { x: 138, y: 78 - k * 2.2, w: 26, h: 26 };                      // Stapel = Wuerfel
}
// Wo das verschmolzene Stueck entsteht.
function _m5aBuendelStart(st) {
  if (st === 'E') return { x: 369.5, y: 128, w: 7, h: 55 };
  if (st === 'Z') return { x: 252.5, y: 52, w: 55, h: 55 };
  return { x: 134, y: 60, w: 34, h: 34 };
}
// Ein neues Stueck, das von oben in seinen Platz faellt.
function _m5aStueck(st, i, verz) {
  const p = _m5aPlatz(st, i);
  return { art: st, x: p.x, y: p.y - 26, w: p.w, h: p.h, tx: p.x, ty: p.y, tw: p.w, th: p.h,
           a: 0, verz: verz || 0 };
}

function _m5aInit() {
  _m5a = { n: { T: 0, H: 0, Z: 0, E: 0 }, feld: { T: [], H: [], Z: [], E: [] }, weg: [],
           anim: null, meldung: '', letzte: null, t: 0, alle: 0,
           glanz: { T: 0, H: 0, Z: 0, E: 0 }, wackel: { T: 0, H: 0, Z: 0, E: 0 },
           fx: { teile: [] } };
}
function _m5aHTML() {
  const m = (k, txt) => `<button class="sim-btn" onclick="_m5aMarke('${k}')">${txt}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welche Zahl liegt da wirklich?</h3>
    <div class="fpm-note" style="margin-top:2px">Lege mit den Knöpfen Stücke auf den Tisch. Drücke dann „bündeln“ und sieh genau hin.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5a-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${m('1-9-10', '1 H, 9 Z, 10 E')}
          ${m('2-9-12', '2 H, 9 Z, 12 E')}
          ${m('0-15-7', '0 H, 15 Z, 7 E')}
          ${m('4-10-0', '4 H, 10 Z, 0 E')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_m5aPlus(1)">+ 1 Einer</button>
          <button class="sim-btn" onclick="_m5aPlus(10)">+ 1 Zehner</button>
          <button class="sim-btn" onclick="_m5aPlus(100)">+ 1 Hunderter</button>
          <button class="sim-btn primary" onclick="_m5aBuendeln()">bündeln</button>
          <button class="sim-btn" onclick="_m5aNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Ablesen</div>
        <div class="lmp-status on" id="_m5a-tisch" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5a-zahl" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5a-menge" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5a-meldung" style="margin-top:6px;display:none"></div>
        <div class="fpm-note" style="margin-top:10px">Unten im Bild steht, wie viele Stücke in jedem Feld liegen.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: leerer Tisch</p>
  </div>`;
}

// ── Zahlen und Statuszeilen ─────────────────────────────────────────────
function _m5aFmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function _m5aMenge() { const n = _m5a.n; return n.T * 1000 + n.H * 100 + n.Z * 10 + n.E; }
function _m5aOffen() { const n = _m5a.n; return n.T >= 10 || n.H >= 10 || n.Z >= 10 || n.E >= 10; }
function _m5aTischText() {
  const n = _m5a.n;
  return (n.T > 0 ? n.T + ' T, ' : '') + n.H + ' H, ' + n.Z + ' Z, ' + n.E + ' E';
}
function _m5aStatus() {
  if (!_m5a) return;
  const z = _m5a;
  const setze = (id, s) => { const e = document.getElementById(id); if (e) e.textContent = s; return e; };
  setze('_m5a-tisch', 'Auf dem Tisch: ' + _m5aTischText());
  setze('_m5a-zahl', 'Zahl: ' + (_m5aOffen() ? '?' : _m5aFmt(_m5aMenge())));
  setze('_m5a-menge', 'Zusammen: ' + _m5aFmt(_m5aMenge()) + ' Einer');
  const m = setze('_m5a-meldung', z.meldung);
  if (m && m.style) m.style.display = z.meldung ? '' : 'none';
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Alles, was auf dem Tisch liegt (auch ein Buendel unterwegs), faellt weg.
function _m5aAbraeumen() {
  const z = _m5a;
  for (const st of _m5aREIHE) { for (const p of z.feld[st]) z.weg.push(p); z.feld[st] = []; }
  if (z.anim) {
    for (const p of z.anim.teile) z.weg.push(p);
    if (z.anim.stueck) z.weg.push(z.anim.stueck);
    z.anim = null;
  }
}
// Ein laufender Tausch landet sofort (vor jeder neuen Bedienung).
function _m5aFertig() { if (_m5a && _m5a.anim) _m5aLanden(); }

function _m5aMarke(k) {
  if (!_m5a || !_m5aMARKEN[k]) return;
  const z = _m5a, [h, zz, e] = _m5aMARKEN[k];
  _m5aAbraeumen();
  z.n = { T: 0, H: h, Z: zz, E: e };
  let j = 0;
  for (const st of _m5aREIHE)
    for (let i = 0; i < z.n[st]; i++) z.feld[st].push(_m5aStueck(st, i, 0.12 + 0.022 * j++));
  for (const st of _m5aREIHE) { z.glanz[st] = 0; z.wackel[st] = 0; }
  z.meldung = ''; z.letzte = null; z.alle = 0;
  _m5aStatus();
}
function _m5aPlus(w) {
  if (!_m5a) return;
  const st = w === 1 ? 'E' : w === 10 ? 'Z' : w === 100 ? 'H' : null;
  if (!st) return;
  const z = _m5a;
  _m5aFertig();
  if (z.n[st] >= _m5aK.VOLL) {
    z.meldung = 'Das Feld ist voll.'; z.wackel[st] = 0.45;
    _m5aStatus(); return;
  }
  z.feld[st].push(_m5aStueck(st, z.n[st], 0));
  z.n[st]++;
  z.glanz[st] = 0.7; z.meldung = ''; z.letzte = null;
  _m5aStatus();
}
function _m5aBuendeln() {
  if (!_m5a) return;
  const z = _m5a, K = _m5aK;
  _m5aFertig();
  let von = null, voll = null;
  for (const st of ['E', 'Z', 'H']) {
    if (z.n[st] < 10) continue;
    const nach = _m5aNACH[st], grenze = nach === 'T' ? K.T_MAX : K.PLATZ;
    if (z.n[nach] >= grenze) { if (!voll) voll = nach; continue; }
    von = st; break;
  }
  if (!von) {
    z.meldung = voll ? 'Das Feld ist voll.' : 'Es gibt nichts mehr zu bündeln.';
    if (voll) z.wackel[voll] = 0.45;
    _m5aStatus(); return;
  }
  const nach = _m5aNACH[von];
  // Die ersten zehn Stuecke (volle Reihe bzw. volles Zehnerfeld) gehen los.
  const teile = z.feld[von].splice(0, 10).map((p, k) => {
    const da = p.verz > 0 || p.a < 0.5;           // noch im Fallen: vom Platz aus
    const x = da ? p.tx : p.x, y = da ? p.ty : p.y, w = da ? p.tw : p.w, h = da ? p.th : p.h;
    const q = _m5aSammelZiel(von, k);
    return { art: von, a: 1, x, y, w, h, x0: x, y0: y, w0: w, h0: h, x1: q.x, y1: q.y, w1: q.w, h1: q.h };
  });
  z.anim = { von, nach, phase: 'sammeln', t: 0, teile, stueck: null, blitz: 0,
             s0: _m5aBuendelStart(von), s1: _m5aPlatz(nach, z.n[nach]),
             aha: von === 'Z' && z.letzte === 'E' };
  z.meldung = '';
  z.glanz[von] = 0.8;
  _m5aStatus();
}
function _m5aNeu() {
  if (!_m5a) return;
  const z = _m5a;
  _m5aAbraeumen();
  z.n = { T: 0, H: 0, Z: 0, E: 0 };
  for (const st of _m5aREIHE) { z.glanz[st] = 0; z.wackel[st] = 0; }
  z.meldung = ''; z.letzte = null; z.alle = 0;
  _m5aStatus();
}
// Die uebrigen Stuecke eines Feldes ruecken auf die ersten Plaetze nach.
function _m5aNachruecken(st, verz) {
  _m5a.feld[st].forEach((p, i) => {
    const q = _m5aPlatz(st, i);
    if (p.tx !== q.x || p.ty !== q.y) { p.tx = q.x; p.ty = q.y; p.tw = q.w; p.th = q.h; if (verz) p.verz = Math.max(p.verz, verz); }
  });
}
// Landung: erst JETZT aendern sich Anzahlen, Tafel und Statuszeilen.
function _m5aLanden() {
  const z = _m5a, a = z.anim;
  if (!a) return;
  z.anim = null;
  z.n[a.von] -= 10; z.n[a.nach] += 1;
  const p = _m5aPlatz(a.nach, z.n[a.nach] - 1);
  z.feld[a.nach].push({ art: a.nach, x: p.x, y: p.y, w: p.w, h: p.h, tx: p.x, ty: p.y, tw: p.w, th: p.h, a: 1, verz: 0 });
  _m5aNachruecken(a.von);
  z.glanz[a.von] = 0.9; z.glanz[a.nach] = 0.9;
  z.letzte = a.von;
  if (a.aha) {
    // Aha: zehn Zehner sind ein Hunderter geworden. Ruhiger Ring, kein Text.
    _bioFxWelle(z.fx.teile, p.x + p.w / 2, p.y + p.h / 2, '#f59e0b', 46);
    z.glanz.H = 2.4;
  }
  if (!_m5aOffen()) z.alle = 1.2;
  _m5aStatus();
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5aUpdate(dt) {
  if (!_m5a) return;
  dt = _bioFxDt(dt);
  const z = _m5a, K = _m5aK;
  z.t += dt;
  const k = 1 - Math.exp(-dt * 11);
  for (const st of _m5aREIHE) {
    for (const p of z.feld[st]) {
      if (p.verz > 0) { p.verz -= dt; continue; }
      p.x += (p.tx - p.x) * k; p.y += (p.ty - p.y) * k;
      p.w += (p.tw - p.w) * k; p.h += (p.th - p.h) * k;
      p.a += (1 - p.a) * k;
      if (Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) + Math.abs(p.tw - p.w) + Math.abs(p.th - p.h) < 0.05 && p.a > 0.995) {
        p.x = p.tx; p.y = p.ty; p.w = p.tw; p.h = p.th; p.a = 1;
      }
    }
    z.glanz[st] = Math.max(0, z.glanz[st] - dt);
    z.wackel[st] = Math.max(0, z.wackel[st] - dt);
  }
  z.alle = Math.max(0, z.alle - dt);
  for (let i = z.weg.length - 1; i >= 0; i--) {
    const p = z.weg[i];
    p.a -= dt / 0.25; p.y += 40 * dt;
    if (p.a <= 0) z.weg.splice(i, 1);
  }
  const a = z.anim;
  if (a) {
    a.t += dt;
    if (a.phase === 'sammeln') {
      const u = _bioFxEase.sanft(Math.min(1, a.t / K.SAMMELN));
      for (const p of a.teile) {
        p.x = p.x0 + (p.x1 - p.x0) * u; p.y = p.y0 + (p.y1 - p.y0) * u;
        p.w = p.w0 + (p.w1 - p.w0) * u; p.h = p.h0 + (p.h1 - p.h0) * u;
      }
      if (a.t >= K.SAMMELN) {
        // verschmelzen: aus zehn Stuecken wird eins der naechsten Stelle
        a.phase = 'gleiten'; a.t = 0; a.blitz = K.BLITZ; a.teile = [];
        a.stueck = { art: a.nach, a: 1, x: a.s0.x, y: a.s0.y, w: a.s0.w, h: a.s0.h };
        _m5aNachruecken(a.von, 0.2);
      }
    } else {
      a.blitz = Math.max(0, a.blitz - dt);
      const u = _bioFxEase.sanft(Math.min(1, a.t / K.GLEITEN)), s = a.stueck;
      s.x = a.s0.x + (a.s1.x - a.s0.x) * u; s.y = a.s0.y + (a.s1.y - a.s0.y) * u;
      s.w = a.s0.w + (a.s1.w - a.s0.w) * u; s.h = a.s0.h + (a.s1.h - a.s0.h) * u;
      if (a.t >= K.GLEITEN) _m5aLanden();
    }
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5aEiner(ctx, x, y, w, h) {
  const F = _m5aFARBE.E;
  ctx.fillStyle = F.fuell; ctx.strokeStyle = F.rand; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x, y, w, h, Math.min(2.5, w / 4, h / 4)); ctx.fill(); ctx.stroke();
  if (w > 8 && h > 8) {
    ctx.strokeStyle = F.licht; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x + 2.5, y + h - 3); ctx.lineTo(x + 2.5, y + 2.5); ctx.lineTo(x + w - 3, y + 2.5); ctx.stroke();
  }
}
function _m5aStange(ctx, x, y, w, h) {
  const F = _m5aFARBE.Z;
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = F.linie; ctx.lineWidth = 0.8;
  for (let k = 1; k < 10; k++) {
    if (k === 5) continue;
    const yy = y + h * k / 10;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke();
  }
  ctx.strokeStyle = F.rand; ctx.lineWidth = 1.8;           // Fuenfermarke
  ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
  ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
}
function _m5aPlatte(ctx, x, y, w, h) {
  const F = _m5aFARBE.H;
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = F.linie; ctx.lineWidth = Math.max(0.4, w / 70);
  for (let k = 1; k < 10; k++) {
    if (k === 5) continue;
    ctx.beginPath(); ctx.moveTo(x + w * k / 10, y); ctx.lineTo(x + w * k / 10, y + h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + h * k / 10); ctx.lineTo(x + w, y + h * k / 10); ctx.stroke();
  }
  ctx.strokeStyle = F.rand; ctx.lineWidth = Math.max(0.9, w / 32);   // Fuenferlinien
  ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
  ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
}
function _m5aWuerfel(ctx, x, y, w) {
  const F = _m5aFARBE.T, d = w * 0.26, s = w - d;
  ctx.lineWidth = 1; ctx.strokeStyle = F.rand;
  ctx.fillStyle = F.oben;                                   // Deckel
  ctx.beginPath(); ctx.moveTo(x, y + d); ctx.lineTo(x + d, y); ctx.lineTo(x + d + s, y); ctx.lineTo(x + s, y + d); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = F.seite;                                  // Seite
  ctx.beginPath(); ctx.moveTo(x + s, y + d); ctx.lineTo(x + s + d, y); ctx.lineTo(x + s + d, y + s); ctx.lineTo(x + s, y + d + s); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y + d, s, s);    // Vorderseite
  ctx.strokeRect(x, y + d, s, s);
  ctx.strokeStyle = 'rgba(109,40,217,0.55)'; ctx.lineWidth = Math.max(0.8, w / 30);   // Fuenferlinien
  ctx.beginPath(); ctx.moveTo(x + s / 2, y + d); ctx.lineTo(x + s / 2, y + d + s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + d + s / 2); ctx.lineTo(x + s, y + d + s / 2); ctx.stroke();
}
function _m5aZeichneStueck(ctx, p, dx) {
  const al = Math.max(0, Math.min(1, p.a));
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha = al;
  const x = p.x + (dx || 0);
  if (p.art === 'E') _m5aEiner(ctx, x, p.y, p.w, p.h);
  else if (p.art === 'Z') _m5aStange(ctx, x, p.y, p.w, p.h);
  else if (p.art === 'H') _m5aPlatte(ctx, x, p.y, p.w, p.h);
  else _m5aWuerfel(ctx, x, p.y, p.w);
  ctx.restore();
}
function _m5aText(ctx, s, x, y, groesse, farbe, fett) {
  ctx.fillStyle = farbe || '#1f2937';
  ctx.font = (fett === false ? '400 ' : '700 ') + groesse + 'px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function _m5aDraw(ctx, cv) {
  if (!_m5a) return;
  const z = _m5a, K = _m5aK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // Tisch
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.X0, K.Y0, K.X1 - K.X0, K.Y1 - K.Y0, 10); ctx.fill();
  // Kopf: Buchstabe und Wort je Feld
  for (const st of _m5aREIHE) {
    const [a, b] = K.SP[st], cx = (a + b) / 2, F = _m5aFARBE[st];
    ctx.fillStyle = F.grund;
    _bioFxRundRect(ctx, a + 4, K.Y0 + 4, b - a - 8, K.YK - K.Y0 - 6, 7); ctx.fill();
    _m5aText(ctx, st, cx, 25, 17, F.rand);
    _m5aText(ctx, _m5aWORT[st], cx, 38, 11, '#334155', false);
  }
  // Linien der Tafel
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.2;
  for (const st of ['H', 'Z', 'E']) {
    const x = K.SP[st][0];
    ctx.beginPath(); ctx.moveTo(x, K.YK); ctx.lineTo(x, K.Y1); ctx.stroke();
  }
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(K.X0, K.YK); ctx.lineTo(K.X1, K.YK); ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(K.X0, K.YT); ctx.lineTo(K.X1, K.YT); ctx.stroke();
  // Material
  for (const st of _m5aREIHE) {
    const wk = z.wackel[st], dx = wk > 0 ? Math.sin(wk * 48) * 3 * (wk / 0.45) : 0;
    for (const p of z.feld[st]) _m5aZeichneStueck(ctx, p, dx);
  }
  for (const p of z.weg) _m5aZeichneStueck(ctx, p);
  const an = z.anim;
  if (an) {
    for (const p of an.teile) _m5aZeichneStueck(ctx, p);
    if (an.stueck) {
      _m5aZeichneStueck(ctx, an.stueck);
      if (an.blitz > 0) {                                   // kurzes Aufhellen beim Verschmelzen
        const s = an.stueck;
        ctx.save(); ctx.globalAlpha = 0.75 * an.blitz / K.BLITZ; ctx.fillStyle = '#ffffff';
        ctx.fillRect(s.x - 2, s.y - 2, s.w + 4, s.h + 4); ctx.restore();
      }
    }
  }
  // Tafelzeile: die Anzahl je Feld, ab 10 orange
  const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
  for (const st of _m5aREIHE) {
    const [a, b] = K.SP[st], cx = (a + b) / 2, n = z.n[st];
    const x = a + 5, y = K.YT + 5, w = b - a - 10, h = K.Y1 - K.YT - 10;
    const viel = n >= 10;
    ctx.fillStyle = viel ? '#fed7aa' : '#f8fafc';
    ctx.strokeStyle = viel ? '#ea580c' : '#cbd5e1';
    ctx.lineWidth = viel ? 2 + puls : 1;
    _bioFxRundRect(ctx, x, y, w, h, 7); ctx.fill(); ctx.stroke();
    const gl = Math.max(Math.min(1, z.glanz[st] / 0.5), Math.min(1, z.alle / 0.6) * 0.8);
    if (gl > 0.01) {
      ctx.save(); ctx.globalAlpha = gl; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3.5;
      _bioFxRundRect(ctx, x - 2, y - 2, w + 4, h + 4, 9); ctx.stroke(); ctx.restore();
    }
    if (st !== 'T' || n > 0) _m5aText(ctx, String(n), cx, y + h / 2 + 9, 24, '#1f2937');
  }
  // Rahmen des Tisches
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.X0, K.Y0, K.X1 - K.X0, K.Y1 - K.Y0, 10); ctx.stroke();
  _bioFxDraw(ctx, z.fx.teile);
}
