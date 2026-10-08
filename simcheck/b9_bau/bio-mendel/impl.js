// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · WELCHE FARBE HABEN MENDELS ERBSEN?   (Förderheft Bio 9 · bt2)
// Kennung bio-mendel, Präfix _n9o. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bt2.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 300, flach gezeichnet, ohne Personen):
//   - Mendels Klostergarten: Himmel mit zwei langsam ziehenden Wolken, eine
//     helle Klostermauer mit zwei Bogenfenstern, davor Rasen.
//   - links und rechts je eine Erbsenpflanze an einem Stab, in einem Beet,
//     mit Blättern, Ranken und oben einer weißen Blüte. Die Blüten zeigen zur
//     Mitte. Die Pflanzen wiegen sich leicht – das Bild lebt auch im Stand.
//   - vor jeder Elternpflanze liegt ein Samen in ihrer Farbe, daneben (zum
//     Rand hin) ein Schild „gelb“ oder „grün“. Doppelt kodiert: gelb = glatt,
//     grün = mit drei Streifen (auch ohne Farbsehen zu unterscheiden).
//   - in der Mitte steht ein feiner Pinsel in einem Tontopf.
//   - unten in der Mitte ein leeres Erntebrett.
//
// BEDIENUNG (wörtlich):
//   Wahlgruppe „Eltern“: „gelb × gelb“ · „grün × grün“ · „gelb × grün“
//   (_n9oEltern('gelb-gelb' | 'gruen-gruen' | 'gelb-gruen'); Start gelb × gelb).
//   Umstellen = neuer Anfang: Blüte wieder da, keine Schote.
//   „▶ kreuzen und ernten“ (_n9oKreuzen) · „neu“ (_n9oNeu → gelb × gelb).
//   Während eines Durchgangs ist „▶ kreuzen und ernten“ grau.
//   Links steht immer die erste Farbe (sie gibt den Pollen), rechts die zweite
//   (an ihr wächst die Schote).
//
// ABLAUF JE DRUCK (10,0 s; Zeiten in s nach dem Druck):
//   0,0–1,3  der Pinsel hebt sich aus dem Topf und fliegt zur linken Blüte
//   1,3–2,3  er tupft die Blüte ab; orange Pollenkörner haften an der Spitze
//   2,3–3,9  er fliegt im Bogen zur rechten Blüte
//   3,9–4,9  er tupft; die Pollenkörner gehen auf die rechte Blüte über
//   4,9–6,0  er kehrt in den Topf zurück
//   5,0–5,8  die rechte Blüte welkt; 5,4–7,4 dort wächst eine Schote
//   7,4–7,8  die Schote reift (etwas heller)
//   7,8–8,8  sie wird geerntet: gleitet klein auf das Brett (ihr Weg führt
//            rechts am Topf vorbei, unter keinem Schild und keinem Samen durch)
//   8,8–9,3  auf dem Brett wird sie groß (Mitte bleibt bei x = 210)
//   9,3–9,9  sie öffnet sich: 8 Samen nebeneinander, gut zählbar. Die Samen
//            sind sofort ganz deckend da (kein Überblenden – sonst sähe ein
//            Samen beim Aufgehen kurz gelbgrün aus); die obere Hälfte klappt
//            nach oben weg und gibt sie frei.
//   10,0     Statuszeile „Die Schote ist reif. Zähle die Samen.“
//
// ERGEBNIS WIRD GERECHNET, NICHT EINGETRAGEN: gelbe Elternpflanzen tragen die
//   Anlagen G G, grüne g g (Mendels reinerbige Ausgangspflanzen; die
//   Buchstaben stehen NICHT am Bildschirm, sie kommen erst in bt3). Jeder Samen
//   bekommt eine Anlage vom Pollen (links) und eine von der Blüte (rechts) und
//   ist gelb, sobald ein G dabei ist.
//
// WERTE (lehrer.tabelle_erwartet, im Bild zu zählen – KEIN Zähler):
//   gelb × gelb  → 8 gelbe Samen, 0 grüne
//   grün × grün  → 0 gelbe Samen, 8 grüne
//   gelb × grün  → 8 gelbe Samen, 0 grüne (an der Pflanze mit grünen Samen!)
//   8 Samen je Schote sind ein glatter Modellwert.
//
// STATUSZEILEN:
//   _n9o-eltern  „Eltern: gelb × grün“ (immer die aktuelle Einstellung)
//   _n9o-status  vorher „Drücke „▶ kreuzen und ernten“.“ · im Lauf
//                „Der Pinsel holt Pollen aus der linken Blüte …“ ·
//                „Der Pinsel bringt den Pollen auf die rechte Blüte …“ ·
//                „An der rechten Pflanze wächst eine Schote …“ ·
//                „Die Schote wird geerntet …“ · danach WÖRTLICH
//                „Die Schote ist reif. Zähle die Samen.“
//   _n9o-hinweis führt durch die Schritte a–d der Seite (Zeile 1 wie Schritt a
//                nur die grünen Samen – die gelbe Zahl steht im Heft schon in
//                der Beispielzeile; Zeile 2/3 beide Zahlen; danach
//                nennt er das nächste Ziel).
//
// AHA (_bioFx, ruhig, ohne Textstreifen, ohne Zufall): Sobald die Schote
//   offen ist, läuft um jeden der 8 Samen gleichzeitig ein kleiner blauer
//   Lichtring (blau, nicht gelb – ein gelber Schein um einen grünen Samen
//   läse sich als Farbe),
//   dazu je einer um die beiden Samen vor den Eltern – der Blick geht von den
//   Eltern zu den neuen Samen. Bei gelb × grün liegen dann neben dem
//   gestreiften grünen Elternsamen nur glatte gelbe Samen, obwohl die Schote
//   an der grünen Pflanze gewachsen ist. Keine Mischfarbe, nirgends.
//
// NICHT AM BILDSCHIRM (Lückenwörter aus Merksatz und Aufgabe 2, Wortbank):
//   „dominant“, „gleich“ (auch nicht in „vergleiche“), „Kreuzung“, „keiner“,
//   „gemischt“, „Hälfte“. Keine Allel-Buchstaben. Deterministisch.
// ═══════════════════════════════════════════════════════════════════════
let _n9o = null;
const _N9O_W = 420, _N9O_H = 300;
const _N9O_ELTERN = {
  'gelb-gelb':   { name: 'gelb × gelb', l: 'gelb',  r: 'gelb',  zeile: 1 },
  'gruen-gruen': { name: 'grün × grün', l: 'gruen', r: 'gruen', zeile: 2 },
  'gelb-gruen':  { name: 'gelb × grün', l: 'gelb',  r: 'gruen', zeile: 3 }
};
const _N9O_REIHE = ['gelb-gelb', 'gruen-gruen', 'gelb-gruen'];
const _N9O_WORT = { gelb: 'gelb', gruen: 'grün' };
const _N9O_ANLAGE = { gelb: ['G', 'G'], gruen: ['g', 'g'] };   // nur intern
const _N9O_ZAHL = 8;                                         // Samen je Schote
// Farben: Samen (Füllung, Rand, Glanz bzw. Streifen)
const _N9O_SAMEN = {
  gelb:  { f: '#fcd34d', r: '#a16207', g: '#fff7d1' },
  gruen: { f: '#4caf50', r: '#14532d', g: '#d9f2d0', s: '#1b5e20' }
};
const _N9O_POLLEN = '#ea7a1a', _N9O_POLLENRAND = '#9a4a0c';
// Lichtringe blau: ein gelber Schein um einen grünen Samen läse sich als Farbe
const _N9O_RING = '#60a5fa';
// Lage im Bild
const _N9O_BODEN = 196;                         // Fuß der Pflanzen
const _N9O_PFL = [{ x: 80, dir: 1, ph: 0.0 }, { x: 340, dir: -1, ph: 1.7 }];
const _N9O_ELTERNSAMEN_Y = 218;                 // Schild steht außen neben dem Samen
const _N9O_TOPF = { x: 210, o: 184, u: 204 };
const _N9O_RUHE = { x: 210, y: 138, w: Math.PI / 2 };       // Pinselspitze im Topf
const _N9O_BRETT = { l: 90, r: 330, o: 254, u: 295 };
const _N9O_SCH = { a: 114, h: 17, cy: 272, ab: 25, rs: 10 };  // offene Schote (Endlage)
const _N9O_KLEIN = 0.18;                         // Größe der Schote an der Pflanze
const _N9O_BL = 1.35;                            // Blüte größer als gezeichnet
// Zeitplan eines Durchgangs (s)
const _N9O_P = {
  hin: [0, 1.3], tupfL: [1.3, 2.3], rueber: [2.3, 3.9], tupfR: [3.9, 4.9],
  zurueck: [4.9, 6.0], welk: [5.0, 5.8], wachs: [5.4, 7.4], reif: [7.4, 7.8],
  ernte: [7.8, 8.8], gross: [8.8, 9.3], auf: [9.3, 9.9]
};
const _N9O_ENDE = 10.0;

function _n9oKl(x) { return _bioFxKlemme(x); }
function _n9oE(x) { return _bioFxEase.sanft(_bioFxKlemme(x)); }
function _n9oU(ab, s) { return _n9oKl((s - ab[0]) / (ab[1] - ab[0])); }

function _n9oInit() {
  _n9o = { t: 0, el: 'gelb-gelb' };
  _n9oAnfang();
}
// Anfang mit der eingestellten Elternwahl: Blüten offen, keine Schote
function _n9oAnfang() {
  _n9o.laeuft = false; _n9o.fertig = false; _n9o.s = 0; _n9o.letzt = '';
  _n9o.samen = [];
  _n9o.fx = { teile: [] };
}

// ── Vererbung: das Ergebnis wird gerechnet ─────────────
// Linke Pflanze gibt den Pollen, rechte trägt die Schote. Jeder Samen erhält
// je eine Anlage von beiden; ein G macht ihn gelb.
function _n9oErnte(el) {
  const e = _N9O_ELTERN[el], pollen = _N9O_ANLAGE[e.l], bluete = _N9O_ANLAGE[e.r];
  const samen = [];
  for (let k = 0; k < _N9O_ZAHL; k++) {
    const a = pollen[k % 2], b = bluete[(k >> 1) % 2];
    samen.push(a === 'G' || b === 'G' ? 'gelb' : 'gruen');
  }
  return samen;
}

// ── Bedienung ──────────────────────────────────────────
function _n9oEltern(v) {
  if (!_n9o || !_N9O_ELTERN[v]) return;
  _n9o.el = v;
  _n9oAnfang();
  _bioFxWelle(_n9o.fx.teile, _N9O_PFL[0].x, _N9O_ELTERNSAMEN_Y, _N9O_RING, 16);
  _bioFxWelle(_n9o.fx.teile, _N9O_PFL[1].x, _N9O_ELTERNSAMEN_Y, _N9O_RING, 16);
  _n9oStatus();
}
function _n9oKreuzen() {
  if (!_n9o || _n9o.laeuft) return;
  _n9oAnfang();
  _n9o.samen = _n9oErnte(_n9o.el);
  _n9o.laeuft = true; _n9o.s = 0;
  _n9oStatus();
}
function _n9oNeu() {
  if (!_n9o) return;
  _n9o.el = 'gelb-gelb';
  _n9oAnfang();
  _n9oStatus();
}
function _n9oFertig() {
  _n9o.laeuft = false; _n9o.fertig = true; _n9o.s = _N9O_ENDE;
  for (let k = 0; k < _N9O_ZAHL; k++) _bioFxWelle(_n9o.fx.teile, _n9oSamenX(k), _N9O_SCH.cy, _N9O_RING, 14);
  for (const p of _N9O_PFL) _bioFxWelle(_n9o.fx.teile, p.x, _N9O_ELTERNSAMEN_Y, _N9O_RING, 16);
  _n9oStatus();
}

// ── Anzeige ────────────────────────────────────────────
function _n9oZeile() {
  if (_n9o.fertig) return 'Die Schote ist reif. Zähle die Samen.';
  if (!_n9o.laeuft) return 'Drücke „▶ kreuzen und ernten“.';
  const s = _n9o.s;
  if (s < _N9O_P.rueber[0]) return 'Der Pinsel holt Pollen aus der linken Blüte …';
  if (s < _N9O_P.zurueck[0]) return 'Der Pinsel bringt den Pollen auf die rechte Blüte …';
  if (s < _N9O_P.ernte[0]) return 'An der rechten Pflanze wächst eine Schote …';
  return 'Die Schote wird geerntet …';
}
function _n9oHinweis() {
  if (_n9o.laeuft) return 'Sieh genau hin: Woher kommt der Pollen? Wo wächst die Schote?';
  if (!_n9o.fertig) return 'Der Samen vor jeder Pflanze zeigt, welche Samenfarbe sie hat.';
  const e = _N9O_ELTERN[_n9o.el];
  // Zeile 1 steht im Heft schon als Beispiel da (8 gelbe Samen); offen ist
  // nur die letzte Zelle. Deshalb dort wie Schritt a nur die grünen Samen.
  if (e.zeile === 1) return 'Zähle die grünen Samen in der Schote. Notiere die Zahl in Zeile 1 der Tabelle.'
                          + ' Stelle dann „grün × grün“ ein.';
  const weiter = e.zeile === 2 ? ' Stelle dann „gelb × grün“ ein.'
               : ' Lies dann noch einmal deine Vermutung. Passt sie zu Zeile 3?';
  return 'Zähle die gelben und die grünen Samen in der Schote. Notiere beide Zahlen in Zeile '
       + e.zeile + ' der Tabelle.' + weiter;
}
function _n9oStatus() {
  if (!_n9o) return;
  _n9o.letzt = _n9oZeile();
  const el = document.getElementById('_n9o-status');
  if (el) { el.textContent = _n9o.letzt; el.className = 'lmp-status on'; }
  const ze = document.getElementById('_n9o-eltern');
  if (ze) ze.textContent = 'Eltern: ' + _N9O_ELTERN[_n9o.el].name;
  const h = document.getElementById('_n9o-hinweis');
  if (h) h.textContent = _n9oHinweis();
  const los = document.getElementById('_n9o-los');
  if (los) {
    los.disabled = _n9o.laeuft;
    try { if (los.classList) los.classList.toggle('primary', !_n9o.laeuft); } catch (e) { /* Knopffarbe ist Beiwerk */ }
  }
  try {
    document.querySelectorAll('[data-n9o]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9o') === _n9o.el);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
}
function _n9oHTML() {
  const k = v => `<button class="sim-btn" data-n9o="${v}" onclick="_n9oEltern('${v}')">${_N9O_ELTERN[v].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welche Farbe haben Mendels Erbsen?</h3>
    <div class="fpm-note" style="margin-top:2px">Mendels Klostergarten mit zwei Erbsenpflanzen. Ein feiner Pinsel bringt Pollen von der linken Blüte auf die rechte Blüte. An der rechten Pflanze wächst danach eine Schote.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9o-cv" width="420" height="300" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9o-los" onclick="_n9oKreuzen()">▶ kreuzen und ernten</button>
          <button class="sim-btn" onclick="_n9oNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Eltern</span>
          <div class="sim-btn-row">${_N9O_REIHE.map(k).join('')}</div>
        </div>
        <div class="lmp-status on" id="_n9o-eltern" style="margin-top:8px"></div>
        <div class="lmp-status on" id="_n9o-status" style="margin-top:6px"></div>
        <div class="fpm-note" id="_n9o-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Im Bild sind gelbe Samen glatt. Grüne Samen haben Streifen.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Eltern „gelb × gelb“ &nbsp;|&nbsp; Im Zeitraffer: Ein Durchgang dauert etwa 10 Sekunden.</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9oUpdate(dt) {
  if (!_n9o) return;
  dt = _bioFxDt(dt);
  _n9o.t += dt;
  if (_n9o.laeuft) {
    _n9o.s += dt;
    if (_n9o.s >= _N9O_ENDE) _n9oFertig();
    else if (_n9oZeile() !== _n9o.letzt) _n9oStatus();
  }
  _bioFxAlleUpdate(_n9o.fx, dt);
}

// ── Geometrie ──────────────────────────────────────────
// Wiegen im Wind: oben stärker als unten
function _n9oWiegen(p, y, t) {
  const f = (_N9O_BODEN - y) / 110;
  return 2.2 * Math.sin(t * 1.15 + p.ph) * f;
}
// x des Stängels in der Höhe y (windet sich leicht um die Mitte)
function _n9oStengelX(p, y, t) {
  return p.x + 3 * Math.sin((_N9O_BODEN - y) / 15 + p.ph) + _n9oWiegen(p, y, t);
}
// Mitte der Blüte und ihre Spitze (dort wird getupft)
function _n9oBluete(p, t) {
  const x = _n9oStengelX(p, 100, t) + p.dir * 16, y = 86 + 0.6 * Math.sin(t * 1.3 + p.ph);
  return { x, y, sx: x + p.dir * 11 * _N9O_BL, sy: y + 5 * _N9O_BL };
}
function _n9oSamenX(k) { return 210 + (k - (_N9O_ZAHL - 1) / 2) * _N9O_SCH.ab; }
function _n9oBez(a, c, b, u) {
  const v = 1 - u;
  return { x: v * v * a.x + 2 * v * u * c.x + u * u * b.x, y: v * v * a.y + 2 * v * u * c.y + u * u * b.y };
}
// Pinselspitze und Richtung (Winkel von der Spitze zum Stielende)
function _n9oPinsel(s, t) {
  const R = _N9O_RUHE;
  if (!_n9o.laeuft) return { x: R.x, y: R.y, w: R.w };
  const bl = _n9oBluete(_N9O_PFL[0], t), br = _n9oBluete(_N9O_PFL[1], t);
  const L = { x: bl.sx, y: bl.sy, w: Math.PI / 3 }, Rt = { x: br.sx, y: br.sy, w: 2 * Math.PI / 3 };
  const P = _N9O_P;
  const tupf = (z, u) => {
    const a = Math.sin(Math.PI * u) * 2.6, ph = 4 * Math.PI * u;
    return { x: z.x + a * Math.cos(ph), y: z.y + a * Math.sin(ph), w: z.w };
  };
  if (s < P.hin[1]) {
    const u = _n9oE(_n9oU(P.hin, s)), q = _n9oBez(R, { x: 170, y: 70 }, L, u);
    return { x: q.x, y: q.y, w: R.w + (L.w - R.w) * u };
  }
  if (s < P.tupfL[1]) return tupf(L, _n9oU(P.tupfL, s));
  if (s < P.rueber[1]) {
    const u = _n9oE(_n9oU(P.rueber, s)), q = _n9oBez(L, { x: 210, y: 18 }, Rt, u);
    return { x: q.x, y: q.y, w: L.w + (Rt.w - L.w) * u };
  }
  if (s < P.tupfR[1]) return tupf(Rt, _n9oU(P.tupfR, s));
  const u = _n9oE(_n9oU(P.zurueck, s)), q = _n9oBez(Rt, { x: 250, y: 70 }, R, u);
  return { x: q.x, y: q.y, w: Rt.w + (R.w - Rt.w) * u };
}
// Pollenkörner an der Pinselspitze und auf der rechten Blüte (je 0 … 5)
function _n9oPollenPinsel(s) {
  if (!_n9o.laeuft) return 0;
  if (s < _N9O_P.tupfL[0]) return 0;
  if (s < _N9O_P.tupfR[0]) return 5 * _n9oU(_N9O_P.tupfL, s);
  return 5 * (1 - _n9oU(_N9O_P.tupfR, s));
}
function _n9oPollenBluete(s) {
  if (!_n9o.laeuft && !_n9o.fertig) return 0;
  return 5 * _n9oU(_N9O_P.tupfR, s);
}
// Lage der Schote: Drehpunkt (Stielende), Winkel, Größe, offen (0 … 1)
function _n9oSchoteLage(s, t) {
  const br = _n9oBluete(_N9O_PFL[1], t);
  const A = { x: br.x, y: br.y + 5 }, w0 = 1.95;
  if (s < _N9O_P.ernte[0]) {
    const g = _n9oE(_n9oU(_N9O_P.wachs, s));
    return { x: A.x, y: A.y, w: w0 + 0.05 * Math.sin(t * 1.15 + 1.7), k: 0.03 + (_N9O_KLEIN - 0.03) * g, auf: 0 };
  }
  // erst klein hinüber (Mitte der kleinen Schote landet bei x = 210) …
  const u = _n9oE(_n9oU(_N9O_P.ernte, s));
  const ZK = { x: 210 - _N9O_SCH.a * _N9O_KLEIN, y: _N9O_SCH.cy };
  const q = _n9oBez(A, { x: 262, y: 236 }, ZK, u);
  const w = w0 * (1 - _n9oE(u / 0.7));
  // … dann auf dem Brett groß werden, die Mitte bleibt stehen
  const g = _n9oE(_n9oU(_N9O_P.gross, s));
  const k = _N9O_KLEIN + (1 - _N9O_KLEIN) * g;
  const x = g > 0 ? 210 - _N9O_SCH.a * k : q.x;
  return { x, y: q.y, w, k, auf: _n9oE(_n9oU(_N9O_P.auf, s)) };
}

// ── Zeichnen: Garten ───────────────────────────────────
function _n9oWolke(ctx, x, y, k) {
  ctx.fillStyle = '#ffffff';
  for (const [dx, dy, r] of [[0, 0, 9], [11, -4, 11], [23, 0, 9], [12, 3, 9]]) {
    ctx.beginPath(); ctx.arc(x + dx * k, y + dy * k, r * k, 0, 2 * Math.PI); ctx.fill();
  }
}
function _n9oGarten(ctx, t) {
  const W = _N9O_W, H = _N9O_H;
  ctx.fillStyle = '#e3eff7'; ctx.fillRect(0, 0, W, H);
  // zwei Wolken ziehen langsam
  _n9oWolke(ctx, ((t * 5 + 60) % 500) - 40, 16, 1);
  _n9oWolke(ctx, ((t * 3.5 + 300) % 500) - 40, 24, 0.8);
  // Klostermauer mit Abdeckung
  ctx.fillStyle = '#ebe1cf'; ctx.fillRect(0, 42, W, 138);
  ctx.strokeStyle = '#d5c6ab'; ctx.lineWidth = 1;
  for (let r = 0; r < 8; r++) {
    const y = 42 + r * 17.25;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    for (let x = (r % 2) * 22; x < W; x += 44) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 17.25); ctx.stroke();
    }
  }
  ctx.fillStyle = '#a5684a'; ctx.fillRect(0, 34, W, 9);
  ctx.fillStyle = '#8a5238'; ctx.fillRect(0, 42, W, 2);
  // zwei Bogenfenster
  for (const fx of [150, 270]) {
    ctx.fillStyle = '#c9b796';
    ctx.beginPath(); ctx.moveTo(fx - 18, 134); ctx.lineTo(fx - 18, 86);
    ctx.arc(fx, 86, 18, Math.PI, 0, false); ctx.lineTo(fx + 18, 134); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8fa3b6';
    ctx.beginPath(); ctx.moveTo(fx - 14, 130); ctx.lineTo(fx - 14, 86);
    ctx.arc(fx, 86, 14, Math.PI, 0, false); ctx.lineTo(fx + 14, 130); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#c9b796'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(fx, 72); ctx.lineTo(fx, 130); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx - 14, 100); ctx.lineTo(fx + 14, 100); ctx.stroke();
  }
  // Rasen
  ctx.fillStyle = '#d3e7bd'; ctx.fillRect(0, 180, W, H - 180);
  ctx.fillStyle = '#c3dca8'; ctx.fillRect(0, 180, W, 3);
  // Beete
  ctx.fillStyle = '#8b6b4a';
  for (const p of _N9O_PFL) { _bioFxRundRect(ctx, p.x - 32, 188, 64, 15, 7); ctx.fill(); }
  // Erntebrett
  const B = _N9O_BRETT;
  ctx.fillStyle = '#ecd8b2'; ctx.strokeStyle = '#b48c5a'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, B.l, B.o, B.r - B.l, B.u - B.o, 7); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#dcc293'; ctx.lineWidth = 1;
  for (const y of [B.o + 13, B.o + 27]) { ctx.beginPath(); ctx.moveTo(B.l + 8, y); ctx.lineTo(B.r - 8, y); ctx.stroke(); }
}

// ── Zeichnen: Pflanze ──────────────────────────────────
function _n9oBlatt(ctx, x, y, rx, ry, w) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(w);
  ctx.fillStyle = '#5aa63f'; ctx.strokeStyle = '#2f6b24'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#3d8a2e'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(-rx * 0.8, 0); ctx.lineTo(rx * 0.8, 0); ctx.stroke();
  ctx.restore();
}
// Ranke: kleine Spirale, die zum Stab greift
function _n9oRanke(ctx, x, y, zx, t) {
  ctx.save();
  ctx.strokeStyle = '#4f9a36'; ctx.lineWidth = 1.2;
  const mx = zx + 1.5 * Math.sin(t * 1.4 + y);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + mx) / 2, y - 9, mx, y - 6);
  ctx.arc(mx, y - 3, 3, -Math.PI / 2, 1.2 * Math.PI, false);
  ctx.stroke();
  ctx.restore();
}
// Weiße Erbsenblüte von der Seite; deck 0 … 1 (welkt), pollen = Körner an der Spitze
function _n9oBlueteZeichnen(ctx, p, b, deck, pollen) {
  const d = p.dir;
  ctx.save();
  if (deck > 0.01) {
    ctx.globalAlpha = deck;
    const k = (0.55 + 0.45 * deck) * _N9O_BL;
    ctx.translate(b.x, b.y); ctx.scale(k, k); ctx.translate(-b.x, -b.y);
    // Kelch
    ctx.fillStyle = '#5aa63f';
    ctx.beginPath(); ctx.moveTo(b.x - d * 9, b.y + 6); ctx.lineTo(b.x - d * 2, b.y + 1); ctx.lineTo(b.x - d * 2, b.y + 9); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
    // Fahne (großes Blütenblatt hinten)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(b.x - d * 3, b.y - 3, 8, 10.5, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    // Flügel
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.ellipse(b.x + d * 4, b.y + 3, 7.5, 5, d * 0.25, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    // Schiffchen
    ctx.fillStyle = '#e4f2d8';
    ctx.beginPath(); ctx.ellipse(b.x + d * 8, b.y + 5, 4, 2.6, d * 0.2, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
  // Pollenkörner an der Spitze
  const n = Math.floor(pollen + 1e-6), rest = pollen - n;
  for (let i = 0; i < 5; i++) {
    const a = i < n ? 1 : i === n ? rest : 0;
    if (a <= 0.02) continue;
    const w = i * 1.3 + 0.4, z = 0.55 + 0.45 * deck;        // welkt die Blüte, rücken die Körner mit
    _n9oKorn(ctx, b.x + (b.sx - b.x) * z + 3 * Math.cos(w), b.y + (b.sy - b.y) * z + 2.4 * Math.sin(w), a * deck);
  }
}
function _n9oKorn(ctx, x, y, a) {
  if (a <= 0.02) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = _N9O_POLLEN; ctx.strokeStyle = _N9O_POLLENRAND; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(x, y, 1.9, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function _n9oPflanze(ctx, p, t, deck, pollen, stiel) {
  // Stab
  ctx.save();
  ctx.strokeStyle = '#a07a50'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(p.x - p.dir * 9, 200); ctx.lineTo(p.x - p.dir * 9, 62); ctx.stroke();
  ctx.restore();
  // Stängel
  ctx.save();
  ctx.strokeStyle = '#3f8a2c'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let y = _N9O_BODEN; y >= 100; y -= 4) {
    const x = _n9oStengelX(p, y, t);
    if (y === _N9O_BODEN) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
  // Blätter (Fiederpaare) und Ranken
  // Knoten abwechselnd zur Mitte und nach außen; der oberste zeigt nach
  // außen, damit die Schote an der Blütenseite frei hängt
  const knoten = [180, 161, 143, 124];
  knoten.forEach((y, i) => {
    const x = _n9oStengelX(p, y, t), s = (i % 2 ? -1 : 1) * p.dir;
    const zit = 0.05 * Math.sin(t * 1.6 + i + p.ph);
    ctx.save();
    ctx.strokeStyle = '#3f8a2c'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s * 22, y - 9); ctx.stroke();
    ctx.restore();
    _n9oBlatt(ctx, x + s * 10, y - 7, 7.5, 4.3, -s * 0.5 + zit);
    _n9oBlatt(ctx, x + s * 13, y + 1, 7.5, 4.3, s * 0.35 + zit);
    _n9oBlatt(ctx, x + s * 23, y - 6, 7, 4, s * 0.05 + zit);
    if (i >= 2) _n9oRanke(ctx, x, y - 2, p.x - p.dir * 9, t);
  });
  // Blütenstiel und Blüte
  const b = _n9oBluete(p, t), xs = _n9oStengelX(p, 100, t);
  ctx.save();
  ctx.strokeStyle = '#3f8a2c'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(xs, 100); ctx.quadraticCurveTo(xs + p.dir * 4, 90, b.x, b.y + 4); ctx.stroke();
  ctx.restore();
  if (stiel) {
    ctx.save();
    ctx.fillStyle = '#5aa63f'; ctx.strokeStyle = '#2f6b24'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(b.x, b.y + 4, 2.8, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.restore();
    return;
  }
  _n9oBlueteZeichnen(ctx, p, b, deck, pollen);
}

// ── Zeichnen: Samen ────────────────────────────────────
// Ein Samen: gelb = glatt mit Glanzpunkt, grün = mit drei Streifen.
// Die Streifen sind Sehnen des Kreises (gerechnet, ohne clip()).
function _n9oSamen(ctx, x, y, r, farbe, a) {
  const c = _N9O_SAMEN[farbe];
  ctx.save();
  ctx.globalAlpha = a == null ? 1 : a;
  ctx.fillStyle = c.f; ctx.strokeStyle = c.r; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  if (farbe === 'gruen') {
    ctx.strokeStyle = c.s; ctx.lineWidth = Math.max(1.4, r * 0.18); ctx.lineCap = 'round';
    const w = -0.7, nx = Math.cos(w + Math.PI / 2), ny = Math.sin(w + Math.PI / 2);
    for (const o of [-0.45, 0, 0.45]) {
      const d = o * r, hl = Math.sqrt(Math.max(0, (0.78 * r) ** 2 - d * d));
      const mx = x + nx * d, my = y + ny * d;
      ctx.beginPath(); ctx.moveTo(mx - Math.cos(w) * hl, my - Math.sin(w) * hl);
      ctx.lineTo(mx + Math.cos(w) * hl, my + Math.sin(w) * hl); ctx.stroke();
    }
  } else {
    ctx.fillStyle = c.g;
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
// Samen vor den Eltern mit Schild „gelb“ / „grün“
function _n9oElternSamen(ctx) {
  const e = _N9O_ELTERN[_n9o.el];
  [e.l, e.r].forEach((f, i) => {
    const x = _N9O_PFL[i].x;
    _n9oSamen(ctx, x, _N9O_ELTERNSAMEN_Y, 11, f, 1);
    ctx.save();
    ctx.font = '700 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    const txt = _N9O_WORT[f], bw = ctx.measureText(txt).width + 14;
    const d = _N9O_PFL[i].dir, mx = x - d * (17 + bw / 2), y0 = _N9O_ELTERNSAMEN_Y - 9;
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
    _bioFxRundRect(ctx, mx - bw / 2, y0, bw, 18, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#0f172a'; ctx.fillText(txt, mx, y0 + 13.5);
    ctx.restore();
  });
}

// ── Zeichnen: Pinsel und Topf ──────────────────────────
function _n9oPinselZeichnen(ctx, P, pollen) {
  ctx.save();
  ctx.translate(P.x, P.y); ctx.rotate(P.w);
  // Stiel
  ctx.fillStyle = '#c0843d'; ctx.strokeStyle = '#7c4a1a'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(20, -2.6); ctx.lineTo(58, -2); ctx.arc(58, 0, 2, -Math.PI / 2, Math.PI / 2, false);
  ctx.lineTo(20, 2.6); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Zwinge
  ctx.fillStyle = '#b6bec8'; ctx.strokeStyle = '#64748b';
  ctx.beginPath(); ctx.rect(13, -3, 7, 6); ctx.fill(); ctx.stroke();
  // Haare
  ctx.fillStyle = '#5b3a1e';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(4, -3.4, 13, -2.8); ctx.lineTo(13, 2.8);
  ctx.quadraticCurveTo(4, 3.4, 0, 0); ctx.closePath(); ctx.fill();
  ctx.restore();
  const n = Math.floor(pollen + 1e-6), rest = pollen - n;
  for (let i = 0; i < 5; i++) {
    const a = i < n ? 1 : i === n ? rest : 0;
    const d = 1.5 + i * 1.7, q = (i % 2 ? 1 : -1) * 2.2;
    _n9oKorn(ctx, P.x + Math.cos(P.w) * d - Math.sin(P.w) * q, P.y + Math.sin(P.w) * d + Math.cos(P.w) * q, a);
  }
}
function _n9oTopf(ctx) {
  const T = _N9O_TOPF;
  ctx.save();
  ctx.fillStyle = '#c2703d'; ctx.strokeStyle = '#7c3f1d'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(T.x - 13, T.o + 4); ctx.lineTo(T.x + 13, T.o + 4);
  ctx.lineTo(T.x + 10, T.u); ctx.lineTo(T.x - 10, T.u); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d4834e';
  _bioFxRundRect(ctx, T.x - 15, T.o, 30, 6, 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// ── Zeichnen: Schote ───────────────────────────────────
// Umriss einer Hälfte (oben sg = -1, unten sg = 1) in Schotenkoordinaten:
// Stielende bei x = 0, Spitze bei x = 2a, Naht auf y = 0.
function _n9oHaelfte(ctx, a, h, sg) {
  const L = 2 * a;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(2, sg * h, 20, sg * h);
  ctx.lineTo(L - 24, sg * h);
  ctx.quadraticCurveTo(L - 2, sg * h, L, sg > 0 ? 0 : -3);
  ctx.closePath();
}
function _n9oSchote(ctx, s, t) {
  const g = _n9oSchoteLage(s, t);
  const S = _N9O_SCH, a = S.a, h = S.h, k = g.k;
  const reif = _n9oU(_N9O_P.reif, s);
  const haut = reif > 0.5 ? '#86b84a' : '#6fae45', rand = '#2f6b24';
  ctx.save();
  ctx.translate(g.x, g.y); ctx.rotate(g.w); ctx.scale(k, k);
  const lw = 1.6 / k;
  // untere Hälfte
  ctx.fillStyle = haut; ctx.strokeStyle = rand; ctx.lineWidth = lw;
  _n9oHaelfte(ctx, a, h, 1); ctx.fill(); ctx.stroke();
  if (g.auf <= 0.01) {
    // geschlossen: obere Hälfte, Samen nur als Wölbungen, Naht
    _n9oHaelfte(ctx, a, h, -1); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(47,107,36,0.45)'; ctx.lineWidth = 1.2 / k;
    for (let j = 0; j < _N9O_ZAHL; j++) {
      const x = a + (j - (_N9O_ZAHL - 1) / 2) * S.ab;
      ctx.beginPath(); ctx.arc(x, 0, S.rs * 0.9, -2.4, -0.7, false); ctx.stroke();
    }
    ctx.strokeStyle = rand; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(2 * a - 4, -1); ctx.stroke();
    ctx.restore();
    return;
  }
  // offen: helles Inneres und die Samen sind sofort ganz deckend da – nichts
  // wird überblendet, sonst sähe ein Samen beim Aufgehen kurz gelbgrün aus.
  // Die obere Hälfte liegt zuerst darüber und klappt nach oben weg.
  const hoch = 12 * g.auf;
  ctx.fillStyle = '#f1f8e4'; ctx.strokeStyle = '#a3c47c'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(6, -hoch * 0.5);
  ctx.quadraticCurveTo(8, -h + 3 - hoch * 0.5, 24, -h + 3 - hoch * 0.4);
  ctx.lineTo(2 * a - 26, -h + 3 - hoch * 0.4);
  ctx.quadraticCurveTo(2 * a - 6, -h + 3 - hoch * 0.5, 2 * a - 6, -hoch * 0.5);
  ctx.quadraticCurveTo(2 * a - 6, h - 3, 2 * a - 26, h - 3);
  ctx.lineTo(24, h - 3);
  ctx.quadraticCurveTo(8, h - 3, 6, -hoch * 0.5);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  _n9o.samen.forEach((f, j) => _n9oSamen(ctx, a + (j - (_N9O_ZAHL - 1) / 2) * S.ab, 0, S.rs, f, 1));
  ctx.translate(0, -hoch);
  ctx.fillStyle = '#9fcc6a'; ctx.strokeStyle = rand; ctx.lineWidth = lw;
  _n9oHaelfte(ctx, a, h, -1); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function _n9oDraw(ctx, cv) {
  if (!_n9o) return;
  const t = _n9o.t, s = _n9o.laeuft || _n9o.fertig ? _n9o.s : 0;
  const lauf = _n9o.laeuft || _n9o.fertig;
  ctx.clearRect(0, 0, cv.width, cv.height);
  _n9oGarten(ctx, t);
  // linke Pflanze: Blüte bleibt
  _n9oPflanze(ctx, _N9O_PFL[0], t, 1, 4, false);
  // rechte Pflanze: Blüte bekommt Pollen, welkt, dann bleibt der Stiel
  const welk = lauf ? _n9oU(_N9O_P.welk, s) : 0;
  const rechtsStiel = lauf && s >= _N9O_P.welk[1];
  _n9oPflanze(ctx, _N9O_PFL[1], t, 1 - welk, _n9oPollenBluete(s), rechtsStiel);
  _n9oElternSamen(ctx);
  _n9oPinselZeichnen(ctx, _n9oPinsel(s, t), _n9oPollenPinsel(s));
  _n9oTopf(ctx);
  if (lauf && s >= _N9O_P.wachs[0]) _n9oSchote(ctx, s, t);
  _bioFxAlleDraw(ctx, _n9o.fx);
}
