// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · KURZ GEMERKT ODER LANGE GEWUSST?   (Förderheft Bio 9 · br7)
// Kennung bio-merken, Präfix _n9g. Bauplan: arbeitsheft_bio_foe9/einheiten/
// br7.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 300) – ein Gedächtnismodell OHNE Beschriftung:
//   oben    Linas Wortkarten: englische Wörter mit kleinen Bildern
//           (sun, fish, tree, house, car | ball, star, apple, cup, moon).
//           5 Wörter: eine Reihe, 10 Wörter: zwei Reihen. Die Karten liegen
//           ausgebreitet, damit jedes Wort lesbar bleibt.
//   Mitte   ein kleiner Kasten mit 7 gestrichelten Plätzen.
//   unten   ein großer Kasten ohne Plätze (viel Raum).
//   rechts  ein Wandkalender: großes Blatt „Tag 1“ … „Tag 8“, darunter 8
//           Tageskästchen; ein Buch-Symbol an jedem Lesetag (Tag 1; bei
//           „an 3 Tagen lesen“ auch Tag 2 und Tag 3). Darunter die zwei Zähler
//           „sofort gewusst:“ und „nach 1 Woche gewusst:“ (oben / unten).
//
// BEDIENUNG (wörtlich wie im sim_plan):
//   „Lernen“: 5 Wörter, einmal lesen | 10 Wörter, einmal lesen |
//             10 Wörter, an 3 Tagen lesen         (_n9gArt('a'|'b'|'c'))
//   „▶ Lernen“ (_n9gLernen) · „▶ 1 Woche später“ (_n9gWoche) · „neu“ (_n9gNeu)
//   Eine andere Einstellung oder „neu“ räumt alles ab (Einstellung bleibt bei
//   „neu“ stehen). „▶ Lernen“ nach dem Lernen tut nichts (Hinweis), nach der
//   Woche beginnt es von vorn. „▶ 1 Woche später“ vor „▶ Lernen“ tut nichts
//   (Hinweis „Drücke zuerst „▶ Lernen“.“). Während etwas läuft, bewirken die
//   beiden ▶-Knöpfe nichts – mit EINER Ausnahme: „▶ 1 Woche später“ während
//   „▶ Lernen“ wird vorgemerkt (Knopf hervorgehoben, Hinweis) und startet,
//   sobald Lina fertig gelesen hat. Die Heftschritte sagen „Drücke „▶ Lernen“,
//   dann „▶ 1 Woche später““ in einem Atemzug; das Lesen dauert bis zu 6 s, und
//   ein verschluckter Druck sähe für das Kind aus wie „geht nicht“.
//
// ABLAUF
//   ▶ Lernen (Tag 1): Lina liest die Karten der Reihe nach (0,42 s je Karte).
//     Jede Karte fliegt als kleine Kopie auf den nächsten freien Platz im
//     kleinen Kasten. Sind alle 7 Plätze belegt, prallt die Kopie am Rand ab
//     und fällt seitlich über den Rand heraus (Aha: Zeitlupe, Rand leuchtet,
//     Banner „Kein Platz mehr frei!“ – einmal je Versuch). Danach rutschen einzelne
//     Karten durch den Durchgang in den großen Kasten (5 Wörter: 1, 10 Wörter:
//     2). Der Zähler „sofort gewusst“ zählt live jede gelandete Karte mit.
//   ▶ 1 Woche später: Der Kalender blättert Tag 2 … Tag 8. In der ersten Nacht
//     verblassen die Karten im kleinen Kasten und verschwinden; die Karten im
//     großen Kasten bleiben. An Lesetagen (nur „an 3 Tagen lesen“: Tag 2 und
//     Tag 3) leuchten zuerst die Karten auf, die schon im großen Kasten liegen;
//     die übrigen fliegen wieder in den kleinen Kasten (7 Plätze, der Rest
//     prallt ab). Jede Karte, die dort zum ZWEITEN Mal landet, rutscht in den
//     großen Kasten. Erst an Tag 8 erscheint der Zähler „nach 1 Woche gewusst“.
//
// MODELL (Modellwerte, Lehrerteil) – Tag 1 rutschen nur die Karten aus
//   _N9G_ART[x].erst; ab Tag 2 jede Karte, die zum zweiten Mal im kleinen
//   Kasten landet. Nachgerechnet:
//   a  5 einmal:   Tag 1: 0–4 rein, 1 rutscht            → sofort 5, Woche 1
//   b  10 einmal:  Tag 1: 0–6 rein, 7–9 prallen ab, 1 und 4 rutschen
//                                                        → sofort 7, Woche 2
//   c  10 an 3 Tagen: Tag 1 wie b (sofort 7). Tag 2: 0,2,3,5,6,7,8 rein,
//      9 prallt ab; 0,2,3,5,6 zum zweiten Mal → rutschen (groß: 7).
//      Tag 3: 7,8,9 rein; 7,8 zum zweiten Mal → rutschen (groß: 9).
//      Nacht zu Tag 4: 9 verblasst                       → Woche 9
//   WERTE (sim_plan): sofort gewusst: 5 von 5 · nach 1 Woche gewusst: 1 von 5
//                     sofort gewusst: 7 von 10 · nach 1 Woche gewusst: 2 von 10
//                     sofort gewusst: 7 von 10 · nach 1 Woche gewusst: 9 von 10
//
// STATUSZEILEN: _n9g-sofort „sofort gewusst: 7 von 10“ (vor ▶ Lernen „–“),
//   _n9g-woche „nach 1 Woche gewusst: 2 von 10“ (bis Tag 8 „–“), _n9g-tag
//   „Lernen: 10 Wörter, einmal lesen · Kalender: Tag 3“, _n9g-hinweis (was
//   gerade geschieht, wechselt je Karte, damit der Prüfstand nicht abbricht).
//
// ZEITEN: Die Woche bei „an 3 Tagen lesen“ dauert rund 6,6 s, ▶ Lernen mit
//   10 Wörtern rund 6 s (mit Zeitlupe) – beides bleibt unter den rund 7,9 s,
//   die simfakten.js ohne Schalter je Knopf abliest (8 Drücke zu je 62 Frames).
//   Keine Anzeige steht länger als 0,45 s still, solange etwas läuft (sonst
//   hört der Prüfstand nach 14 gleichen Ablesungen zu früh auf).
//
// Nicht am Bildschirm (Lückenwörter aus Merksatz, Aufgabe 2, Hilfe 3):
//   Kurzzeitgedächtnis, Langzeitgedächtnis, wiederholen, vergessen, wenige –
//   auch nicht als Wortteil („weniger“, „Gedächtnis“). Das Wort „alle“ steht
//   ebenfalls nicht da (Ablenker der Wortbank).
// Effekte nur aus _bioFx: kurz, ruhig, kein Blinken über 1 Hz, keine Wertung.
// ═══════════════════════════════════════════════════════════════════════
let _n9g = null;
const _N9G_WORT = ['sun', 'fish', 'tree', 'house', 'car', 'ball', 'star', 'apple', 'cup', 'moon'];
const _N9G_ART = {
  a: { name: '5 Wörter, einmal lesen',      n: 5,  tage: [1],       erst: [1] },
  b: { name: '10 Wörter, einmal lesen',     n: 10, tage: [1],       erst: [1, 4] },
  c: { name: '10 Wörter, an 3 Tagen lesen', n: 10, tage: [1, 2, 3], erst: [1, 4] }
};
const _N9G_START = 'a';
const _N9G_PLAETZE = 7;                      // Plätze im kleinen Kasten
const _N9G_TAGE = 8;                         // Tag 1 + 7 Tage = 1 Woche später
// Zeiten in s
const _N9G_T = {
  vor: 0.3, takt1: 0.42, flug1: 0.40,        // Tag 1 (▶ Lernen)
  glanz: 0.25, takt2: 0.2, flug2: 0.28,      // Tag 2 und Tag 3
  rutsch: 0.42, rtakt: 0.18, rnach: 0.26,    // vom kleinen in den großen Kasten
  nacht: 0.16, nachtRuhig: 0.28, nachtBlass: 0.32, blass: 0.32, raus: 0.5
};
// Geometrie (Leinwand 420 x 300; linke Spalte x 8–268, rechte x 282–414)
const _N9G_MX = 138;                         // Mitte der linken Spalte
const _N9G_KB = 46, _N9G_KH = 34;            // Wortkarte oben
const _N9G_MH = 15;                          // halbe Kantenlänge der kleinen Kopie
const _N9G_KLEIN = { x: 15, y: 100, w: 246, h: 46 };
const _N9G_GROSS = { x: 8, y: 172, w: 260, h: 120 };
const _N9G_KAL = { x: 284, y: 6, w: 126, h: 140 };

// ── Lagen ────────────────────────────────────────────────────────────
function _n9gObenPos(w) {
  const n = _N9G_ART[_n9g.art].n;
  return { x: 31 + (w % 5) * 53.5, y: n > 5 ? 23 + Math.floor(w / 5) * 40 : 43 };
}
function _n9gKleinPos(k) { return { x: 36 + k * 34, y: 123 }; }
function _n9gGrossPos(p) { return { x: 34 + (p % 5) * 52, y: 206 + Math.floor(p / 5) * 50 }; }

// ── Zustand ──────────────────────────────────────────────────────────
function _n9gInit() {
  _n9g = { art: _N9G_START, t: 0 };
  _n9gLeer();
}
// Räumt den Versuch ab; die Einstellung bleibt.
function _n9gLeer() {
  const n = _n9g;
  n.phase = 'bereit';                        // bereit · lernen · gelernt · woche · fertig
  n.tag = 1; n.flip = null;
  n.klein = new Array(_N9G_PLAETZE).fill(null);   // null | {w, da}
  n.gross = [];                              // {w, da}
  n.flieger = []; n.raus = []; n.blass = [];
  n.mal = new Array(10).fill(0);             // wie oft im kleinen Kasten gelandet
  n.oben = new Array(10).fill(0);            // Leuchten der Wortkarten (Restzeit)
  n.sofort = null; n.woche = null;
  n.plan = []; n.ps = 0; n.planEnde = null;
  n.rand = 0; n.grossGlanz = 0; n.puls = [0, 0];
  n.prallZahl = 0; n.voll = false; n.ersteNacht = false;
  n.hinweis = 'Drücke „▶ Lernen“.';
  n.fx = { teile: [] }; n.zeitlupe = null;
  n.wocheDanach = false;                     // „▶ 1 Woche später“ schon während des Lesens gedrückt
  n.letzt = '';
}

// ── Bedienung ────────────────────────────────────────────────────────
function _n9gArt(v) {
  if (!_n9g || !_N9G_ART[v]) return;
  _n9g.art = v;
  _n9gLeer();
  _n9gStatus();
}
function _n9gNeu() {
  if (!_n9g) return;
  _n9gLeer();
  _n9gStatus();
}
function _n9gLernen() {
  const n = _n9g;
  if (!n || n.phase === 'lernen' || n.phase === 'woche') return;
  if (n.phase === 'gelernt') {
    n.hinweis = 'Lina hat schon gelesen. Drücke „▶ 1 Woche später“.';
    _n9gStatus(); return;
  }
  if (n.phase === 'fertig') _n9gLeer();      // nach der Woche: von vorn
  const A = _N9G_ART[n.art];
  n.phase = 'lernen'; n.sofort = 0;
  n.plan = [{ dauer: _N9G_T.vor }];
  for (let w = 0; w < A.n; w++) n.plan.push({ dauer: _N9G_T.takt1, tu: () => _n9gLies(w, _N9G_T.flug1) });
  n.plan.push({ dauer: 0.2 });
  n.plan.push({ dauer: 0, tu: () => _n9gRutschPlan(A.erst.slice(), _N9G_T.rutsch - _N9G_T.rtakt + 0.25) });
  n.planEnde = _n9gGelernt;
  n.hinweis = 'Lina liest die Karten.';
  _n9gStatus();
}
function _n9gWoche() {
  const n = _n9g;
  if (!n || n.phase === 'woche') return;
  if (n.phase === 'lernen') {                // zu früh gedrückt: vormerken, startet nach dem Lesen
    n.wocheDanach = true;
    _n9gStatus(); return;
  }
  if (n.phase === 'bereit') { n.hinweis = 'Drücke zuerst „▶ Lernen“.'; _n9gStatus(); return; }
  if (n.phase === 'fertig') {
    n.hinweis = 'Die Woche ist vorbei. Wähle bei „Lernen“ eine andere Einstellung.';
    _n9gStatus(); return;
  }
  const A = _N9G_ART[n.art];
  n.phase = 'woche';
  n.plan = [];
  for (let d = 2; d <= _N9G_TAGE; d++) {
    n.plan.push({ dauer: _N9G_T.nacht, tu: st => _n9gNacht(d, st) });
    if (A.tage.indexOf(d) >= 0) n.plan.push({ dauer: _N9G_T.glanz, tu: () => _n9gLeseTag(d) });
  }
  n.plan.push({ dauer: 0.1 });
  n.planEnde = _n9gWocheEnde;
  _n9gStatus();
}

// ── Ablaufplan: Schritte {dauer, tu}; tu läuft zu Beginn des Schritts und
//    darf weitere Schritte direkt dahinter einfügen (splice an Stelle 1).
function _n9gPlanLauf(d) {
  const n = _n9g;
  let rest = d, sicher = 0;
  while (n.plan.length && sicher++ < 200) {
    const st = n.plan[0];
    if (!st.los) { st.los = true; n.ps = 0; if (st.tu) st.tu(st); }
    const bleibt = st.dauer - n.ps;
    if (rest < bleibt) { n.ps += rest; return; }
    rest -= Math.max(0, bleibt);
    n.plan.shift(); n.ps = 0;
  }
  if (!n.plan.length && n.planEnde) { const f = n.planEnde; n.planEnde = null; f(); }
}
// Lina liest Karte w: eine Kopie fliegt in den kleinen Kasten oder prallt ab.
function _n9gLies(w, dauer) {
  const n = _n9g;
  n.oben[w] = 0.45;
  n.hinweis = 'Lina liest die Karte „' + _N9G_WORT[w] + '“.';
  const von = _n9gObenPos(w);
  const k = n.klein.indexOf(null);
  if (k >= 0) {
    n.klein[k] = { w, da: false };
    const z = _n9gKleinPos(k);
    n.flieger.push({ w, art: 'rein', s: 0, dauer, x0: von.x, y0: von.y, x1: z.x, y1: z.y,
                     cx: (von.x + z.x) / 2, cy: Math.min(von.y, z.y) - 18, slot: k });
  } else {
    n.prallZahl++;
    const seite = n.prallZahl % 2 ? 1 : -1;
    const x1 = _N9G_MX + seite * 16, y1 = _N9G_KLEIN.y - 5;
    n.flieger.push({ w, art: 'prall', s: 0, dauer, x0: von.x, y0: von.y, x1, y1,
                     cx: (von.x + x1) / 2, cy: Math.min(von.y, y1) - 16, seite });
  }
  _n9gStatus();
}
// Karten aus dem kleinen in den großen Kasten, eine nach der anderen.
function _n9gRutschPlan(woerter, nach) {
  const n = _n9g;
  const steps = woerter.map(w => ({ dauer: _N9G_T.rtakt, tu: () => _n9gRutsch(w) }));
  if (steps.length) steps.push({ dauer: nach });
  n.plan.splice(1, 0, ...steps);
}
function _n9gRutsch(w) {
  const n = _n9g;
  const k = n.klein.findIndex(c => c && c.da && c.w === w);
  if (k < 0) return;
  const von = _n9gKleinPos(k);
  n.klein[k] = null;
  const platz = n.gross.length;
  n.gross.push({ w, da: false });
  const z = _n9gGrossPos(platz);
  n.flieger.push({ w, art: 'rutsch', s: 0, dauer: _N9G_T.rutsch, x0: von.x, y0: von.y, x1: z.x, y1: z.y,
                   cx: _N9G_MX, cy: 162, platz });
  n.hinweis = 'Die Karte „' + _N9G_WORT[w] + '“ rutscht nach unten.';
  _n9gStatus();
}
// Eine Nacht: Kalender blättert weiter, der kleine Kasten wird leer.
function _n9gNacht(d, st) {
  const n = _n9g, A = _N9G_ART[n.art];
  n.tag = d;
  let zahl = 0;
  n.klein.forEach((c, k) => {
    if (c && c.da) {
      const p = _n9gKleinPos(k);
      n.blass.push({ w: c.w, x: p.x, y: p.y, s: 0 });
      n.klein[k] = null; zahl++;
    }
  });
  st.dauer = zahl ? _N9G_T.nachtBlass : A.tage.length > 1 ? _N9G_T.nacht : _N9G_T.nachtRuhig;
  n.flip = { von: d - 1, s: 0, dauer: Math.min(0.24, st.dauer * 0.8) };
  if (zahl) {
    _bioFxWelle(n.fx.teile, _N9G_MX, 123, '#94a3b8', 70);
    if (!n.ersteNacht) {
      n.ersteNacht = true;
      if (A.tage.length === 1) _bioFxZeitlupe(n, 0.5, 0.5);
    }
  }
  n.hinweis = 'Tag ' + d + (A.tage.indexOf(d) >= 0 ? ' beginnt.' : ': Lina liest nicht.');
  _n9gStatus();
}
// Ein Lesetag in der Woche (Tag 2, Tag 3 bei „an 3 Tagen lesen“).
function _n9gLeseTag(d) {
  const n = _n9g, A = _N9G_ART[n.art];
  const bekannt = {};
  n.gross.forEach(g => { bekannt[g.w] = true; n.oben[g.w] = 0.4; });
  if (n.gross.length) n.grossGlanz = 0.5;
  n.hinweis = 'Tag ' + d + ': Lina liest die Karten noch einmal.';
  _n9gStatus();
  const steps = [];
  for (let w = 0; w < A.n; w++)
    if (!bekannt[w]) steps.push({ dauer: _N9G_T.takt2, tu: () => _n9gLies(w, _N9G_T.flug2) });
  steps.push({ dauer: _N9G_T.flug2 - _N9G_T.takt2 + 0.1 });
  steps.push({ dauer: 0, tu: () => _n9gRutschPlan(
    n.klein.filter(c => c && c.da && n.mal[c.w] >= 2).map(c => c.w), _N9G_T.rnach) });
  n.plan.splice(1, 0, ...steps);
}
function _n9gGelernt() {
  const n = _n9g;
  n.phase = 'gelernt';
  n.hinweis = 'Drücke „▶ 1 Woche später“.';
  _bioFxWelle(n.fx.teile, 348, 180, '#60a5fa', 46);
  _n9gStatus();
  if (n.wocheDanach) { n.wocheDanach = false; _n9gWoche(); }
}
function _n9gWocheEnde() {
  const n = _n9g;
  n.phase = 'fertig';
  n.woche = n.gross.length;
  n.grossGlanz = 1.2; n.puls[1] = 0.6;
  n.hinweis = 'Die Woche ist vorbei. Wähle bei „Lernen“ eine andere Einstellung.';
  _bioFxWelle(n.fx.teile, 348, 240, '#60a5fa', 50);
  _bioFxWelle(n.fx.teile, _N9G_MX, 232, '#93c5fd', 90);
  _n9gStatus();
}

// ── Anzeige ──────────────────────────────────────────────────────────
function _n9gZeilen() {
  const n = _n9g, A = _N9G_ART[n.art];
  return [
    'sofort gewusst: ' + (n.sofort === null ? '–' : n.sofort + ' von ' + A.n),
    'nach 1 Woche gewusst: ' + (n.woche === null ? '–' : n.woche + ' von ' + A.n),
    'Lernen: ' + A.name + ' · Kalender: Tag ' + n.tag,
    n.hinweis + (n.wocheDanach ? ' Danach folgt „▶ 1 Woche später“.' : '')
  ];
}
function _n9gStatus() {
  const n = _n9g;
  if (!n) return;
  const z = _n9gZeilen();
  n.letzt = z.join('|');
  ['_n9g-sofort', '_n9g-woche', '_n9g-tag', '_n9g-hinweis'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = z[i];
  });
  try {
    document.querySelectorAll('[data-n9g]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9g') === n.art);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9g-los');
  if (los && los.classList) los.classList.toggle('primary', n.phase === 'bereit');
  const sp = document.getElementById('_n9g-spaeter');
  if (sp && sp.classList) sp.classList.toggle('primary', n.phase === 'gelernt' || n.wocheDanach);
}
function _n9gHTML() {
  const k = v => `<button class="sim-btn" data-n9g="${v}" onclick="_n9gArt('${v}')">${_N9G_ART[v].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie merkt sich das Gehirn etwas?</h3>
    <div class="fpm-note" style="margin-top:2px">Oben liegen Linas Wortkarten: englische Wörter mit Bildern. Darunter sind zwei Kästen, ein kleiner und ein großer. Rechts hängt ein Kalender.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9g-cv" width="420" height="300" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9g-los" onclick="_n9gLernen()">▶ Lernen</button>
          <button class="sim-btn" id="_n9g-spaeter" onclick="_n9gWoche()">▶ 1 Woche später</button>
          <button class="sim-btn" onclick="_n9gNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Lernen</span>
          <div class="sim-btn-row" style="flex-direction:column;align-items:flex-start">${k('a')}${k('b')}${k('c')}</div>
        </div>
        <div class="lmp-status on" id="_n9g-sofort" style="margin-top:8px"></div>
        <div class="lmp-status on" id="_n9g-woche" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_n9g-tag" style="margin-top:6px"></div>
        <div class="fpm-note" id="_n9g-hinweis" style="margin-top:8px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: „5 Wörter, einmal lesen“ &nbsp;|&nbsp; Tag 1: Lina lernt die Wörter. Tag 8: 1 Woche später. Die Zahlen sind Modellwerte.</p>
  </div>`;
}

// ── Lauf ─────────────────────────────────────────────────────────────
function _n9gBez(f, u) {                     // Punkt auf der Flugbahn (quadratisch)
  const v = 1 - u;
  return { x: v * v * f.x0 + 2 * v * u * f.cx + u * u * f.x1,
           y: v * v * f.y0 + 2 * v * u * f.cy + u * u * f.y1 };
}
function _n9gUpdate(dt) {
  const n = _n9g;
  if (!n) return;
  dt = _bioFxDt(dt);
  n.t += dt;
  const d = dt * _bioFxZeitlupeFaktor(n, dt);
  if (n.plan.length || n.planEnde) _n9gPlanLauf(d);
  for (let i = n.flieger.length - 1; i >= 0; i--) {
    const f = n.flieger[i];
    f.s += d;
    if (f.s < f.dauer) continue;
    n.flieger.splice(i, 1);
    if (f.art === 'rein') {
      const c = n.klein[f.slot];
      if (c && c.w === f.w) c.da = true;
      n.mal[f.w]++;
      if (n.phase === 'lernen') { n.sofort++; n.puls[0] = 0.35; }
      _bioFxWelle(n.fx.teile, f.x1, f.y1, '#fcd34d', 20);
    } else if (f.art === 'prall') {
      n.raus.push({ w: f.w, x: f.x1, y: f.y1, vx: 240 * f.seite, vy: -40, s: 0, dreh: 0, dw: 7 * f.seite });
      n.rand = 0.5;
      _bioFxWelle(n.fx.teile, f.x1, _N9G_KLEIN.y, '#f97316', 34);
      if (!n.voll) {
        n.voll = true;
        _bioFxZeitlupe(n, 0.4, 0.8);
        _bioFxBanner(n.fx, 'Kein Platz mehr frei!', 2.4, '#f97316');
      }
    } else if (f.art === 'rutsch') {
      const g = n.gross[f.platz];
      if (g) g.da = true;
      _bioFxWelle(n.fx.teile, f.x1, f.y1, '#93c5fd', 24);
      if (!n.flieger.some(o => o.art === 'rutsch')) {
        n.hinweis = 'Tag ' + n.tag + ': Lina hat fertig gelesen.';
        _n9gStatus();
      }
    }
  }
  for (let i = n.raus.length - 1; i >= 0; i--) {
    const r = n.raus[i];
    r.s += d; r.vy += 520 * d; r.x += r.vx * d; r.y += r.vy * d; r.dreh += r.dw * d;
    if (r.s >= _N9G_T.raus) n.raus.splice(i, 1);
  }
  for (let i = n.blass.length - 1; i >= 0; i--) {
    n.blass[i].s += d;
    if (n.blass[i].s >= _N9G_T.blass) n.blass.splice(i, 1);
  }
  for (let w = 0; w < 10; w++) n.oben[w] = Math.max(0, n.oben[w] - d);
  n.grossGlanz = Math.max(0, n.grossGlanz - d);
  n.rand = Math.max(0, n.rand - d);
  n.puls[0] = Math.max(0, n.puls[0] - dt); n.puls[1] = Math.max(0, n.puls[1] - dt);
  if (n.flip) { n.flip.s += d; if (n.flip.s >= n.flip.dauer) n.flip = null; }
  _bioFxAlleUpdate(n.fx, dt);
  if (_n9gZeilen().join('|') !== n.letzt) _n9gStatus();
}

// ── Zeichnen ─────────────────────────────────────────────────────────
function _n9gRund(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - r); ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  ctx.lineTo(x + r, y + h); ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + r); ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  ctx.closePath();
}
// Kleines Bild zum Wort w, Mitte (x, y), Größe s; grund = Kartenfarbe
function _n9gBild(ctx, w, x, y, s, grund) {
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const lw = Math.max(0.8, s * 0.06);
  ctx.lineWidth = lw;
  if (w === 0) {                                        // sun
    const r = s * 0.24;
    ctx.strokeStyle = '#eab308'; ctx.lineWidth = Math.max(1, s * 0.08);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      ctx.moveTo(x + Math.cos(a) * r * 1.4, y + Math.sin(a) * r * 1.4);
      ctx.lineTo(x + Math.cos(a) * r * 1.95, y + Math.sin(a) * r * 1.95);
    }
    ctx.stroke();
    ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  } else if (w === 1) {                                 // fish
    ctx.fillStyle = '#0ea5e9'; ctx.strokeStyle = '#0369a1';
    ctx.beginPath(); ctx.moveTo(x + s * 0.16, y); ctx.lineTo(x + s * 0.44, y - s * 0.2);
    ctx.lineTo(x + s * 0.44, y + s * 0.2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.ellipse(x - s * 0.08, y, s * 0.3, s * 0.19, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(x - s * 0.24, y - s * 0.04, Math.max(0.8, s * 0.045), 0, 2 * Math.PI); ctx.fill();
  } else if (w === 2) {                                 // tree
    ctx.fillStyle = '#92400e'; ctx.fillRect(x - s * 0.06, y + s * 0.04, s * 0.12, s * 0.42);
    ctx.fillStyle = '#22c55e'; ctx.strokeStyle = '#15803d';
    ctx.beginPath(); ctx.arc(x, y - s * 0.1, s * 0.29, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  } else if (w === 3) {                                 // house
    ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#92400e';
    ctx.beginPath(); ctx.rect(x - s * 0.27, y - s * 0.04, s * 0.54, s * 0.48); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#7f1d1d';
    ctx.beginPath(); ctx.moveTo(x - s * 0.37, y - s * 0.02); ctx.lineTo(x, y - s * 0.44);
    ctx.lineTo(x + s * 0.37, y - s * 0.02); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#92400e'; ctx.fillRect(x - s * 0.07, y + s * 0.2, s * 0.14, s * 0.24);
  } else if (w === 4) {                                 // car
    ctx.fillStyle = '#fca5a5'; ctx.strokeStyle = '#991b1b';
    ctx.beginPath(); ctx.moveTo(x - s * 0.24, y - s * 0.02); ctx.lineTo(x - s * 0.14, y - s * 0.24);
    ctx.lineTo(x + s * 0.14, y - s * 0.24); ctx.lineTo(x + s * 0.24, y - s * 0.02); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.rect(x - s * 0.44, y - s * 0.02, s * 0.88, s * 0.24); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.arc(x - s * 0.24, y + s * 0.24, s * 0.1, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.24, y + s * 0.24, s * 0.1, 0, 2 * Math.PI); ctx.fill();
  } else if (w === 5) {                                 // ball
    const r = s * 0.33;
    ctx.fillStyle = '#fb923c'; ctx.strokeStyle = '#7c2d12';
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r); ctx.stroke();
  } else if (w === 6) {                                 // star
    ctx.fillStyle = '#fde047'; ctx.strokeStyle = '#a16207';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * 0.18 : s * 0.42;
      const px = x + Math.cos(a) * r, py = y + s * 0.03 + Math.sin(a) * r;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (w === 7) {                                 // apple
    ctx.fillStyle = '#ef4444'; ctx.strokeStyle = '#991b1b';
    ctx.beginPath(); ctx.arc(x, y + s * 0.06, s * 0.29, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#78350f'; ctx.lineWidth = Math.max(1, s * 0.07);
    ctx.beginPath(); ctx.moveTo(x, y - s * 0.2); ctx.lineTo(x + s * 0.05, y - s * 0.38); ctx.stroke();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.ellipse(x + s * 0.17, y - s * 0.32, s * 0.11, s * 0.055, -0.5, 0, 2 * Math.PI); ctx.fill();
  } else if (w === 8) {                                 // cup
    ctx.strokeStyle = '#5b21b6'; ctx.lineWidth = Math.max(1, s * 0.07);
    ctx.beginPath(); ctx.arc(x + s * 0.2, y + s * 0.02, s * 0.13, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.lineWidth = lw; ctx.fillStyle = '#a78bfa';
    ctx.beginPath(); ctx.moveTo(x - s * 0.3, y - s * 0.24); ctx.lineTo(x + s * 0.22, y - s * 0.24);
    ctx.lineTo(x + s * 0.15, y + s * 0.3); ctx.lineTo(x - s * 0.23, y + s * 0.3); ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else {                                              // moon
    ctx.fillStyle = '#fde047'; ctx.strokeStyle = '#a16207';
    ctx.beginPath(); ctx.arc(x - s * 0.03, y, s * 0.32, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = grund;
    ctx.beginPath(); ctx.arc(x + s * 0.13, y - s * 0.07, s * 0.27, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
// Wortkarte oben (46 x 34); glanz > 0: Lina liest sie gerade
function _n9gKarte(ctx, w, x, y, glanz) {
  const hoch = glanz > 0 ? 3 : 0, gx = x - _N9G_KB / 2, gy = y - _N9G_KH / 2 - hoch;
  ctx.fillStyle = 'rgba(15,23,42,0.12)';
  _n9gRund(ctx, gx + 2, y - _N9G_KH / 2 + 2, _N9G_KB, _N9G_KH, 5); ctx.fill();
  if (glanz > 0) {
    ctx.strokeStyle = 'rgba(250,204,21,0.85)'; ctx.lineWidth = 5;
    _n9gRund(ctx, gx - 2, gy - 2, _N9G_KB + 4, _N9G_KH + 4, 7); ctx.stroke();
  }
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.3;
  _n9gRund(ctx, gx, gy, _N9G_KB, _N9G_KH, 5); ctx.fill(); ctx.stroke();
  _n9gBild(ctx, w, x, gy + 12, 17, '#ffffff');
  ctx.fillStyle = '#0f172a'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_N9G_WORT[w], x, gy + 30);
}
// Kleine Kopie (30 x 30)
function _n9gMini(ctx, w, x, y, o) {
  o = o || {};
  const h = _N9G_MH, grau = !!o.grau, grund = grau ? '#e2e8f0' : '#ffffff';
  ctx.save();
  ctx.globalAlpha = o.a === undefined ? 1 : Math.max(0, Math.min(1, o.a));
  ctx.translate(x, y);
  if (o.dreh) ctx.rotate(o.dreh);
  if (o.glanz > 0) {
    ctx.strokeStyle = 'rgba(250,204,21,' + Math.min(0.9, o.glanz * 1.6).toFixed(3) + ')'; ctx.lineWidth = 4;
    _n9gRund(ctx, -h - 3, -h - 3, 2 * h + 6, 2 * h + 6, 6); ctx.stroke();
  }
  ctx.fillStyle = grund; ctx.strokeStyle = grau ? '#94a3b8' : '#475569'; ctx.lineWidth = 1.2;
  _n9gRund(ctx, -h, -h, 2 * h, 2 * h, 4); ctx.fill(); ctx.stroke();
  if (grau) ctx.globalAlpha *= 0.35;
  _n9gBild(ctx, w, 0, -4, 14, grund);
  ctx.fillStyle = grau ? '#64748b' : '#0f172a'; ctx.font = '700 8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(_N9G_WORT[w], 0, h - 3);
  ctx.restore();
}
// Offene Schale (U-Form): oben offen, damit die Karten hineinfallen
function _n9gSchale(ctx, B, fuell, rand, dicke) {
  ctx.fillStyle = fuell;
  _n9gRund(ctx, B.x, B.y, B.w, B.h, 8); ctx.fill();
  ctx.strokeStyle = rand; ctx.lineWidth = dicke; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(B.x, B.y); ctx.lineTo(B.x, B.y + B.h - 8); ctx.arc(B.x + 8, B.y + B.h - 8, 8, Math.PI, Math.PI / 2, true);
  ctx.lineTo(B.x + B.w - 8, B.y + B.h); ctx.arc(B.x + B.w - 8, B.y + B.h - 8, 8, Math.PI / 2, 0, true);
  ctx.lineTo(B.x + B.w, B.y);
  ctx.stroke();
  ctx.lineCap = 'butt';
}
function _n9gPfeil(ctx, x, y) {                         // zwei kleine Winkel nach unten
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath();
  for (const dy of [0, 7]) { ctx.moveTo(x - 6, y + dy); ctx.lineTo(x, y + dy + 5); ctx.lineTo(x + 6, y + dy); }
  ctx.stroke();
  ctx.lineCap = 'butt';
}
// Aufgeschlagenes Buch, Mitte (x, y), Breite b
function _n9gBuch(ctx, x, y, b) {
  const h = b * 0.6;
  ctx.fillStyle = '#dbeafe'; ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 1.2; ctx.lineJoin = 'round';
  for (const sg of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x, y - h / 2 + 1.5);
    ctx.quadraticCurveTo(x + sg * b * 0.25, y - h / 2 - 1.5, x + sg * b / 2, y - h / 2);
    ctx.lineTo(x + sg * b / 2, y + h / 2);
    ctx.quadraticCurveTo(x + sg * b * 0.25, y + h / 2 - 1.5, x, y + h / 2 + 1);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + sg * b * 0.12, y - h * 0.12); ctx.lineTo(x + sg * b * 0.38, y - h * 0.12);
    ctx.moveTo(x + sg * b * 0.12, y + h * 0.16); ctx.lineTo(x + sg * b * 0.38, y + h * 0.16);
    ctx.stroke();
  }
}
function _n9gKalender(ctx, n) {
  const K = _N9G_KAL, A = _N9G_ART[n.art];
  ctx.fillStyle = 'rgba(15,23,42,0.10)'; ctx.fillRect(K.x + 3, K.y + 3, K.w, K.h);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.3;
  ctx.fillRect(K.x, K.y, K.w, K.h); ctx.strokeRect(K.x, K.y, K.w, K.h);
  ctx.fillStyle = '#dc2626'; ctx.fillRect(K.x, K.y, K.w, 16);
  for (const rx of [K.x + 26, K.x + K.w - 26]) {      // Ringe
    ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(rx, K.y + 2, 4, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  }
  // großes Blatt
  const bx = K.x + 6, by = K.y + 19, bw = K.w - 12, bh = 42;
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.fillRect(bx, by, bw, bh); ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = '#0f172a'; ctx.font = '700 21px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Tag ' + n.tag, bx + bw / 2, by + 29);
  if (n.flip) {                                         // altes Blatt klappt nach oben weg
    const p = Math.min(1, n.flip.s / n.flip.dauer);
    ctx.save();
    ctx.translate(0, by); ctx.scale(1, Math.max(0.02, 1 - p)); ctx.translate(0, -by);
    ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#94a3b8';
    ctx.fillRect(bx, by, bw, bh); ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = '#334155'; ctx.font = '700 21px sans-serif';
    ctx.fillText('Tag ' + n.flip.von, bx + bw / 2, by + 29);
    ctx.restore();
  }
  // acht Tageskästchen
  for (let d = 1; d <= _N9G_TAGE; d++) {
    const j = (d - 1) % 4, r = Math.floor((d - 1) / 4);
    const x = K.x + 3 + j * 31, y = K.y + 66 + r * 37;
    const jetzt = d === n.tag, vorbei = d < n.tag;
    ctx.fillStyle = jetzt ? '#dbeafe' : vorbei ? '#f1f5f9' : '#ffffff';
    ctx.strokeStyle = jetzt ? '#2563eb' : '#cbd5e1'; ctx.lineWidth = jetzt ? 2 : 1;
    ctx.fillRect(x, y, 27, 33); ctx.strokeRect(x, y, 27, 33);
    ctx.fillStyle = vorbei ? '#94a3b8' : '#334155'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(String(d), x + 3, y + 10);
    if (A.tage.indexOf(d) >= 0) _n9gBuch(ctx, x + 14.5, y + 22, 17);
  }
}
function _n9gZaehler(ctx, y, text, wert, puls, an) {
  const x = 282, b = 132, h = 52;
  ctx.fillStyle = an ? '#ffffff' : '#f1f5f9';
  ctx.strokeStyle = puls > 0 ? '#2563eb' : '#94a3b8'; ctx.lineWidth = puls > 0 ? 2.2 : 1.2;
  _n9gRund(ctx, x, y, b, h, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#334155'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(text, x + b / 2, y + 16);
  ctx.fillStyle = an ? '#0f172a' : '#94a3b8'; ctx.font = '700 18px sans-serif';
  ctx.fillText(wert, x + b / 2, y + 41);
}
function _n9gDraw(ctx, cv) {
  const n = _n9g;
  if (!n) return;
  const W = cv.width, H = cv.height, t = n.t, A = _N9G_ART[n.art];
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  // Wortkarten oben
  for (let w = 0; w < A.n; w++) {
    const p = _n9gObenPos(w);
    _n9gKarte(ctx, w, p.x, p.y, n.oben[w]);
  }
  if (n.phase === 'bereit') {                           // ruhiger Hinweis: hier geht es los
    const p = _n9gObenPos(0), a = 0.35 + 0.3 * Math.sin(t * 2 * Math.PI * 0.6);
    ctx.strokeStyle = 'rgba(37,99,235,' + a.toFixed(3) + ')'; ctx.lineWidth = 2.5;
    _n9gRund(ctx, p.x - _N9G_KB / 2 - 4, p.y - _N9G_KH / 2 - 4, _N9G_KB + 8, _N9G_KH + 8, 8); ctx.stroke();
  }
  _n9gPfeil(ctx, _N9G_MX, 86);

  // kleiner Kasten mit 7 Plätzen
  const KL = _N9G_KLEIN;
  _n9gSchale(ctx, KL, '#fff7ed', '#f59e0b', 2.5);
  ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.2;
  for (let k = 0; k < _N9G_PLAETZE; k++) {
    const p = _n9gKleinPos(k);
    ctx.strokeRect(p.x - _N9G_MH, p.y - _N9G_MH, 2 * _N9G_MH, 2 * _N9G_MH);
  }
  ctx.restore();
  if (n.rand > 0) {                                     // Rand leuchtet: kein Platz mehr
    ctx.strokeStyle = 'rgba(249,115,22,' + Math.min(1, n.rand * 2.2).toFixed(3) + ')'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(KL.x, KL.y); ctx.lineTo(KL.x + KL.w, KL.y); ctx.stroke();
  }
  _n9gPfeil(ctx, _N9G_MX, 152);

  // großer Kasten
  const GR = _N9G_GROSS;
  _n9gSchale(ctx, GR, '#eff6ff', '#3b82f6', 3);

  // ruhende Karten
  n.klein.forEach((c, k) => { if (c && c.da) { const p = _n9gKleinPos(k); _n9gMini(ctx, c.w, p.x, p.y); } });
  const gl = n.grossGlanz > 0 ? n.grossGlanz : (n.phase === 'fertig' ? 0.12 + 0.1 * Math.sin(t * 2 * Math.PI * 0.5) : 0);
  n.gross.forEach((g, i) => {
    if (!g.da) return;
    const p = _n9gGrossPos(i);
    _n9gMini(ctx, g.w, p.x, p.y, { glanz: gl });
  });
  // verblassende Karten (Nacht)
  for (const b of n.blass) {
    const u = Math.min(1, b.s / _N9G_T.blass);
    _n9gMini(ctx, b.w, b.x, b.y - 8 * u, { a: 1 - u, grau: true });
  }
  // fliegende Karten
  for (const f of n.flieger) {
    const u0 = Math.min(1, f.s / f.dauer), u = u0 * u0 * (3 - 2 * u0);
    const p = _n9gBez(f, u);
    _n9gMini(ctx, f.w, p.x, p.y);
  }
  // abgeprallte Karten fallen seitlich heraus
  for (const r of n.raus) {
    const u = Math.min(1, r.s / _N9G_T.raus);
    _n9gMini(ctx, r.w, r.x, r.y, { a: 1 - u * u, dreh: r.dreh });
  }

  // Kalender und Zähler
  _n9gKalender(ctx, n);
  _n9gZaehler(ctx, 154, 'sofort gewusst:', n.sofort === null ? '–' : n.sofort + ' von ' + A.n, n.puls[0], n.sofort !== null);
  _n9gZaehler(ctx, 214, 'nach 1 Woche gewusst:', n.woche === null ? '–' : n.woche + ' von ' + A.n, n.puls[1], n.woche !== null);
  if (n.phase === 'gelernt') {                          // ruhiger Hinweis auf den nächsten Schritt
    const a = 0.3 + 0.3 * Math.sin(t * 2 * Math.PI * 0.6);
    ctx.strokeStyle = 'rgba(37,99,235,' + a.toFixed(3) + ')'; ctx.lineWidth = 2.5;
    ctx.strokeRect(_N9G_KAL.x - 3, _N9G_KAL.y - 3, _N9G_KAL.w + 6, _N9G_KAL.h + 6);
  }
  // Effekte; das Banner steht über der linken Spalte, nicht über dem Kalender
  _bioFxDraw(ctx, n.fx.teile);
  ctx.save(); ctx.translate(_N9G_MX - W / 2, 0); _bioFxBannerDraw(ctx, n.fx); ctx.restore();
}
