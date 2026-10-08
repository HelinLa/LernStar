// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · EIN LITER ODER DREI LITER   (Förderheft Bio 9 · bd2)
// Kennung bio-wasserhaushalt, Präfix _n9i. Bauplan: arbeitsheft_bio_foe9/
// einheiten/bd2.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 300, schematisch, ohne Gesicht):
//   - Mitte: hellblauer Körper-Umriss (Kopf, Hals, Rumpf, Arme). Darin zwei
//     dunkelrote Nieren (Bohnen), von jeder ein dünner Schlauch nach unten
//     zu einer rundlichen Blase im unteren Bauch. Weiße Pünktchen treiben
//     langsam im Körper (das Wasser im Körper) – das Bild lebt auch im Stand.
//   - links: Kasten „Wasser rein“ („Getränke: 2 l“, „Essen: 0,5 l“), darunter
//     ein Glas Wasser und ein Teller mit Obst. Blaue Tropfen fliegen vom Glas
//     und vom Teller zum Mund und sinken in den Bauch.
//   - rechts: Kasten „Wasser raus“ („Haut und Atem: 1 l“, „Harn: ?“ bis zum
//     Tagesende, dann „Harn: 1,5 l“). Tropfen auf der Haut, Atemwolken am Kopf.
//   - unten: Messbecher mit Liter-Skala (1 l, 2 l, 3 l, Striche alle 0,5 l).
//     Von den Nieren rinnen Harntropfen in die Blase; hat sie 0,5 l gesammelt,
//     leert sie sich in den Becher. Der Becher sammelt den Harn eines Tages.
//   - unten rechts: Anzeige „Wasser im Körper: 30 l“ (immer 30 l).
//   - oben Mitte: Uhr „6 Uhr“ bis „22 Uhr“ (Zeitraffer, 10 s für 16 Stunden).
//
// BEDIENUNG (wörtlich):
//   Regler „Getränke am Tag“: 1 l · 2 l · 3 l (Start 1 l). Umstellen = neuer
//   Tag (Uhr 6 Uhr, Becher leer, „Harn: ?“).
//   „▶ 1 Tag abspielen“ (_n9iTag) · „neu“ (_n9iNeu → 1 l, 6 Uhr)
//
// MODELLWERTE (Lehrerteil): Essen 0,5 l, Haut und Atem 1 l, Wasser im Körper
//   30 l. Harn = Getränke + 0,5 l − 1 l. Ein Tropfen im Bild = 0,1 l:
//       Getränke   1 l / 2 l / 3 l   → 10 / 20 / 30 Tropfen vom Glas
//       Essen      0,5 l             →  5 Tropfen vom Teller
//       Haut, Atem 1 l               →  5 Tropfen auf der Haut + 5 Atemwolken
//       Harn       0,5 / 1,5 / 2,5 l →  5 / 15 / 25 Harntropfen
//   Rein = raus (15/25/35 gegen 15/25/35) – darum bleibt „Wasser im Körper“
//   bei 30 l. Die Blase leert sich je 0,5 l, also 1-, 3- oder 5-mal am Tag.
//   Der Becher endet genau bei 0,5 l / 1,5 l / 2,5 l (18 Bildpunkte je Liter).
//
// WERTE (lehrer.tabelle_erwartet, am Bildschirm abzulesen):
//   1 l   Harn: 0,5 l · Becher dunkelgelb    · Wasser im Körper: 30 l
//   2 l   Harn: 1,5 l · Becher hellgelb      · Wasser im Körper: 30 l
//   3 l   Harn: 2,5 l · Becher fast farblos  · Wasser im Körper: 30 l
//   Die Farbe steht NUR im Bild (Becher, Blase, Harntropfen), nie als Wort.
//
// STATUSZEILE (_n9i-status), mit der Uhr mitlaufend:
//   „Uhr: 6 Uhr · Getränke am Tag: 1 l · Harn: ? · Wasser im Körper: 30 l“
//   am Tagesende „Uhr: 22 Uhr · Getränke am Tag: 1 l · Harn: 0,5 l · Wasser im
//   Körper: 30 l“. Die Uhr läuft in der Zeile mit – so bleibt die Anzeige
//   während des Tages nicht stehen, und simfakten (--frames=25) läuft bis zum
//   Tagesende durch, statt nach vierzehn gleichen Ablesungen abzubrechen.
//
// AHA (_bioFx, ruhig, ohne Textstreifen): Je Leeren der Blase ein kleiner
//   Lichtring – bei 3 l fünfmal, bei 1 l einmal. Am Tagesende ein Ring am
//   Becher und ein Rahmen um „Harn“, kurz danach ein blauer Rahmen um „Wasser
//   im Körper: 30 l“: Die Zahl dort hat sich nicht bewegt, obwohl viel Wasser
//   durchlief. Jeder Effekt einmal, 0,9–1,2 s, nichts blinkt.
//
// NICHT AM BILDSCHIRM: „mehr“, „dunkelgelb“, „hellgelb“, „gleich“ (auch nicht
//   in „vergleiche“), „Wasserhaushalt“, „Harnblase“, „Blase“, „farblos“,
//   „weniger“. Keine Toilette, keine Genitalien, kein Gesicht.
//   Deterministisch, ohne Zufall.
// ═══════════════════════════════════════════════════════════════════════
let _n9i = null;
const _N9I_DAUER = 10;                    // 6 bis 22 Uhr, in s
const _N9I_STUNDE = _N9I_DAUER / 16;      // 0,625 s je Stunde
const _N9I_TLAUF = 1.4;                   // Flug eines Trink-/Esstropfens bis in den Bauch
const _N9I_HLAUF = 0.6;                   // Harntropfen Niere → Blase
const _N9I_LEER = 0.7;                    // Blase leert sich in den Becher
const _N9I_AUS = 1.2;                     // Hauttropfen, Atemwolke
const _N9I_PXL = 18;                      // Bildpunkte je Liter im Becher
// Harnfarbe je Einstellung: Füllung und Rand (Rand macht den fast farblosen
// Harn als Flüssigkeit sichtbar). Bewusst ohne Farbnamen im Quelltext-Schlüssel.
const _N9I_HARN = {
  1: { f: '#d6a20e', r: '#9a7409' },
  2: { f: '#f7e570', r: '#c2a82e' },
  3: { f: '#fcfbea', r: '#9fb0c2' }
};
// feste Abläufe (s nach dem Start): Essen zu den Mahlzeiten, Haut und Atem
const _N9I_ESSEN = [0.65, 4.3, 4.6, 7.95, 8.25];          // 5 × 0,1 l
const _N9I_HAUT = [0.9, 2.8, 4.7, 6.6, 8.5];               // 5 × 0,1 l
const _N9I_HAUT_Y = [112, 150, 128, 168, 140];
const _N9I_ATEM = [1.75, 3.6, 5.45, 7.3, 8.7];            // 5 × 0,1 l (alles vor 22 Uhr vorbei)
// Lage im Bild
const _N9I_KOPF = { x: 210, y: 56, r: 19 };
const _N9I_RUMPF = { l: 152, r: 268, o: 86, u: 220 };
const _N9I_MUND = { x: 210, y: 70 };
const _N9I_BAUCH = { x: 210, y: 112 };
const _N9I_NIERE = [{ x: 188, y: 140, s: 1 }, { x: 232, y: 140, s: -1 }];
const _N9I_BL = { x: 210, y: 194, rx: 18, ry: 14 };
const _N9I_BECHER = { l: 182, r: 238, o: 232, u: 294 };
const _N9I_GLAS = { x: 61, o: 120, u: 168, bo: 32, bu: 24 };
const _N9I_TELLER = { x: 72, y: 224 };
const _N9I_KW = { x: 258, y: 266, w: 156, h: 27 };          // Kasten „Wasser im Körper“

function _n9iInit() {
  _n9i = { g: 1, t: 0 };
  _n9iRuhe();
}
// Ein neuer Tag in der eingestellten Menge: Uhr 6 Uhr, Becher leer.
function _n9iRuhe() {
  _n9i.s = -1; _n9i.laeuft = false; _n9i.fertig = false;
  _n9i.nach = -1; _n9i.schritt = 0; _n9i.welleNr = 0; _n9i.letzt = '';
  _n9i.plan = _n9iPlan(_n9i.g);
  _n9i.fx = { teile: [] }; _n9i.puls = [];
}
// Alle Tropfen eines Tages als feste Zeiten – das Bild ist eine Funktion der
// Tageszeit s, nichts hängt am Zufall oder an der Bildrate.
function _n9iPlan(g) {
  const nT = g * 10;                       // Getränke in Tropfen zu 0,1 l
  const nH = g * 10 - 5;                   // Harn = Getränke + 0,5 l − 1 l
  const trink = [], harn = [], leeren = [];
  for (let k = 0; k < nT; k++) trink.push(0.15 + (k + 0.5 + 0.3 * Math.sin(k * 2.7)) * 8.4 / nT);
  for (let k = 0; k < nH; k++) harn.push({ t0: 0.4 + (k + 0.5) * 8.9 / nH, seite: k % 2 });
  // Nach jedem fünften Harntropfen (0,5 l) leert sich die Blase in den Becher.
  for (let j = 1; j * 5 <= nH; j++) leeren.push(harn[j * 5 - 1].t0 + _N9I_HLAUF);
  const ende = Math.max(_N9I_DAUER, leeren[leeren.length - 1] + _N9I_LEER) + 0.15;
  return { trink, harn, leeren, ende, nH };
}

// ── Zahlen ─────────────────────────────────────────────
// Zehntelliter als Text mit Komma: 5 → „0,5 l“, 30 → „3 l“.
function _n9iL(z) {
  return (z % 10 === 0 ? String(z / 10) : Math.floor(z / 10) + ',' + (z % 10)) + ' l';
}
function _n9iUhr() {
  if (_n9i.s < 0) return 6;
  return Math.min(22, 6 + Math.floor(_n9i.s / _N9I_STUNDE + 1e-6));
}
// Harn im Becher (in l) zur Tageszeit s
function _n9iBecherL(s) {
  let v = 0;
  for (const f of _n9i.plan.leeren) {
    if (s >= f + _N9I_LEER) v += 0.5;
    else if (s > f) v += 0.5 * _bioFxEase.sanft((s - f) / _N9I_LEER);
  }
  return v;
}
// Füllung der Blase (0..1, voll = 0,5 l = 5 Tropfen) zur Tageszeit s
function _n9iBlaseVoll(s) {
  let n = 0;
  for (const h of _n9i.plan.harn) if (s >= h.t0 + _N9I_HLAUF) n++;
  for (const f of _n9i.plan.leeren) if (s > f) n -= 5 * _bioFxKlemme((s - f) / _N9I_LEER);
  return Math.max(0, Math.min(1, n / 5));
}

// ── Bedienung ──────────────────────────────────────────
function _n9iGetraenke(v) {
  if (!_n9i) return;
  const g = Math.max(1, Math.min(3, Math.round(Number(v) || 1)));
  _n9i.g = g;
  _n9iRuhe();                                         // anderer Wert = neuer Tag
  _n9iStatus();
}
function _n9iTag() {
  if (!_n9i || _n9i.laeuft) return;
  _n9iRuhe();
  _n9i.s = 0; _n9i.laeuft = true;
  _n9iStatus();
}
function _n9iNeu() {
  if (!_n9i) return;
  _n9i.g = 1;
  _n9iRuhe();
  _n9iStatus();
}

// ── Anzeige ────────────────────────────────────────────
function _n9iZeile() {
  const harn = _n9i.fertig ? _n9iL(_n9i.plan.nH) : '?';
  return 'Uhr: ' + _n9iUhr() + ' Uhr · Getränke am Tag: ' + _n9i.g + ' l · Harn: ' + harn
       + ' · Wasser im Körper: 30 l';
}
function _n9iHinweis() {
  if (_n9i.laeuft) return 'Der Tag läuft im Zeitraffer. Sieh genau hin: Wohin fließt das Wasser?';
  if (_n9i.fertig) return 'Es ist 22 Uhr. Lies „Harn“ ab und sieh dir die Farbe im Messbecher an. '
                        + 'Trage beides in die Tabelle ein. Stelle dann „Getränke am Tag“ auf einen anderen Wert.';
  return 'Getränke am Tag: ' + _n9i.g + ' l. Drücke „▶ 1 Tag abspielen“.';
}
function _n9iStatus() {
  if (!_n9i) return;
  const z = _n9iZeile();
  const el = document.getElementById('_n9i-status');
  if (el) { el.textContent = z; el.className = 'lmp-status on'; }
  _n9i.letzt = z;
  const h = document.getElementById('_n9i-hinweis');
  if (h) h.textContent = _n9iHinweis();
  const lb = document.getElementById('_n9i-getLbl');
  if (lb) lb.textContent = _n9i.g + ' l';
  const r = document.getElementById('_n9i-get');
  if (r && String(r.value) !== String(_n9i.g)) r.value = String(_n9i.g);
  const los = document.getElementById('_n9i-los');
  if (los && los.classList) los.classList.toggle('primary', !_n9i.laeuft);
}
function _n9iHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viel Harn bildet der Körper an einem Tag?</h3>
    <div class="fpm-note" style="margin-top:2px">Ein Körper, ganz einfach gezeichnet. Links kommt Wasser hinein: aus dem Glas und aus dem Essen. Rechts geht Wasser hinaus: über die Haut und mit dem Atem. Unten sammelt ein Messbecher den Harn von einem Tag.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9i-cv" width="420" height="300" class="phys-anim-cv"></canvas>
        <div class="phys-ctrl" style="margin-top:8px">
          <label class="phys-ctrl-label" for="_n9i-get">Getränke am Tag: <b id="_n9i-getLbl">1 l</b></label>
          <input type="range" id="_n9i-get" min="1" max="3" step="1" value="1" oninput="_n9iGetraenke(this.value)" style="width:100%;accent-color:#2563eb">
          <div style="display:flex;justify-content:space-between;font-size:.74rem;font-weight:700;color:#64748b"><span>1 l</span><span>2 l</span><span>3 l</span></div>
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9i-los" onclick="_n9iTag()">▶ 1 Tag abspielen</button>
          <button class="sim-btn" onclick="_n9iNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeigen</div>
        <div class="lmp-status on" id="_n9i-status" style="margin-top:6px"></div>
        <div class="fpm-note" id="_n9i-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Die zwei roten Bohnen im Bauch sind die Nieren. Sie bilden den Harn.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Getränke am Tag: 1 l · Uhr: 6 Uhr</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9iUpdate(dt) {
  if (!_n9i) return;
  dt = _bioFxDt(dt);
  _n9i.t += dt;
  if (_n9i.laeuft) {
    _n9i.s += dt;
    // kleiner Lichtring an der Blase, sobald sie sich leert
    const L = _n9i.plan.leeren;
    while (_n9i.welleNr < L.length && _n9i.s >= L[_n9i.welleNr]) {
      _bioFxWelle(_n9i.fx.teile, _N9I_BL.x, _N9I_BL.y, '#fde68a', 26);
      _n9i.welleNr++;
    }
    if (_n9i.s >= _n9i.plan.ende) _n9iFertig();
    else if (_n9iZeile() !== _n9i.letzt) _n9iStatus();
  } else if (_n9i.nach >= 0) {
    _n9i.nach += dt;
    _n9iNachher();
  }
  _bioFxAlleUpdate(_n9i.fx, dt);
}
function _n9iFertig() {
  _n9i.laeuft = false; _n9i.fertig = true;
  _n9i.s = _n9i.plan.ende;
  _n9i.nach = 0; _n9i.schritt = 0;
  _n9iStatus();
}
// Nach dem Tag: erst der Becher und „Harn“, dann „Wasser im Körper“.
function _n9iNachher() {
  const fx = _n9i.fx;
  if (_n9i.schritt === 0) {
    _n9i.schritt = 1;
    const B = _N9I_BECHER, yl = B.u - 2 - _n9iBecherL(_n9i.s) * _N9I_PXL;
    _bioFxWelle(fx.teile, (B.l + B.r) / 2, yl, '#fde68a', 40);
    _n9i.puls.push({ x: 294, y: 45, w: 116, h: 16, t0: _n9i.t, farbe: '245,158,11' });
  }
  if (_n9i.schritt === 1 && _n9i.nach >= 0.9) {
    _n9i.schritt = 2;
    const K = _N9I_KW;
    _n9i.puls.push({ x: K.x, y: K.y, w: K.w, h: K.h, t0: _n9i.t, farbe: '59,130,246' });
    _n9i.nach = -1;
  }
}
// Ruhiger Rahmen, der sich einmal um einen Kasten ausbreitet und verblasst (1,2 s)
function _n9iPulse(ctx) {
  _n9i.puls = _n9i.puls.filter(p => _n9i.t - p.t0 < 1.2);
  for (const p of _n9i.puls) {
    const e = _bioFxEase.raus(_bioFxKlemme((_n9i.t - p.t0) / 1.2)), d = 2 + 4 * e;   // bleibt im Bild
    ctx.save();
    ctx.strokeStyle = 'rgba(' + p.farbe + ',' + (0.85 * (1 - e)).toFixed(3) + ')';
    ctx.lineWidth = 3;
    _n9iRund(ctx, p.x - d, p.y - d, p.w + 2 * d, p.h + 2 * d, 6 + d); ctx.stroke();
    ctx.restore();
  }
}

// ── Zeichnen: Hilfen ───────────────────────────────────
function _n9iRund(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
// Tropfen mit Spitze nach oben, Mitte des runden Teils bei (x, y)
function _n9iTropfen(ctx, x, y, r, fuell, rand) {
  ctx.beginPath();
  ctx.moveTo(x, y - r * 1.9);
  ctx.bezierCurveTo(x + r * 0.55, y - r * 1.0, x + r, y - r * 0.45, x + r, y);
  ctx.arc(x, y, r, 0, Math.PI);
  ctx.bezierCurveTo(x - r, y - r * 0.45, x - r * 0.55, y - r * 1.0, x, y - r * 1.9);
  ctx.closePath();
  ctx.fillStyle = fuell; ctx.fill();
  if (rand) { ctx.strokeStyle = rand; ctx.lineWidth = 1; ctx.stroke(); }
}
function _n9iQ(p0, c, p1, u) {
  const v = 1 - u;
  return { x: v * v * p0.x + 2 * v * u * c.x + u * u * p1.x,
           y: v * v * p0.y + 2 * v * u * c.y + u * u * p1.y };
}

// ── Zeichnen ───────────────────────────────────────────
function _n9iDraw(ctx, cv) {
  if (!_n9i) return;
  const W = cv.width, H = cv.height, t = _n9i.t;
  const s = _n9i.s < 0 ? -1 : _n9i.s;
  const F = _N9I_HARN[_n9i.g];
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fbff'); bg.addColorStop(1, '#e9f0f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  _n9iUhrBild(ctx);
  _n9iKaesten(ctx);
  _n9iGlas(ctx, t);
  _n9iTeller(ctx);
  _n9iKoerper(ctx, t);
  _n9iOrgane(ctx, s, F);
  _n9iFluss(ctx, s, F);
  _n9iBecher(ctx, s, F);
  _n9iKoerperWasser(ctx);
  _n9iPulse(ctx);
  _bioFxAlleDraw(ctx, _n9i.fx);
}
// Uhr oben in der Mitte: Zifferblatt mit Stundenzeiger und „14 Uhr“
function _n9iUhrBild(ctx) {
  const ux = 178, uy = 17, ur = 10;
  const st = _n9i.s < 0 ? 0 : Math.min(_N9I_DAUER, _n9i.s);
  const std = 6 + st / _N9I_STUNDE;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(ux, uy, ur, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    ctx.beginPath(); ctx.moveTo(ux + Math.cos(a) * (ur - 3), uy + Math.sin(a) * (ur - 3));
    ctx.lineTo(ux + Math.cos(a) * ur, uy + Math.sin(a) * ur); ctx.stroke();
  }
  const a = -Math.PI / 2 + (std % 12) / 12 * 2 * Math.PI;
  ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(ux, uy); ctx.lineTo(ux + Math.cos(a) * (ur - 3.5), uy + Math.sin(a) * (ur - 3.5)); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#0f172a'; ctx.font = '700 15px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  const txt = _n9iUhr() + ' Uhr';
  ctx.fillText(txt, ux + 16, uy + 6);
  if (_n9i.laeuft) {
    ctx.fillStyle = 'rgba(15,23,42,0.55)'; ctx.font = '700 10px sans-serif';
    ctx.font = '700 15px sans-serif';
    const x = ux + 22 + ctx.measureText(txt).width;
    ctx.font = '700 10px sans-serif';
    ctx.fillText('▶▶', x, uy + 5);
  }
  ctx.restore();
}
function _n9iKasten(ctx, x, y, titel, zeilen, farbe) {
  const w = 124, h = 60;
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.strokeStyle = farbe; ctx.lineWidth = 2;
  _n9iRund(ctx, x, y, w, h, 8); ctx.fill(); ctx.stroke();
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = farbe; ctx.font = '700 12px sans-serif';
  ctx.fillText(titel, x + 8, y + 16);
  zeilen.forEach((z, i) => {
    if (z.hell) {
      ctx.fillStyle = '#fef3c7';
      _n9iRund(ctx, x + 4, y + 22 + i * 17, w - 8, 16, 5); ctx.fill();
    }
    ctx.fillStyle = z.grau ? '#64748b' : '#0f172a';
    ctx.font = (z.fett ? '700 ' : '600 ') + '12px sans-serif';
    ctx.fillText(z.text, x + 8, y + 34 + i * 17);
  });
  ctx.restore();
}
function _n9iKaesten(ctx) {
  _n9iKasten(ctx, 6, 6, 'Wasser rein', [
    { text: 'Getränke: ' + _n9i.g + ' l' },
    { text: 'Essen: 0,5 l' }
  ], '#2563eb');
  const ende = _n9i.fertig;
  _n9iKasten(ctx, 290, 6, 'Wasser raus', [
    { text: 'Haut und Atem: 1 l' },
    ende ? { text: 'Harn: ' + _n9iL(_n9i.plan.nH), fett: true, hell: true } : { text: 'Harn: ?', grau: true }
  ], '#0d9488');
}
// Glas Wasser links, die Oberfläche schwappt leicht
function _n9iGlas(ctx, t) {
  const G = _N9I_GLAS;
  const xl = y => G.x - (G.bo / 2 - (G.bo - G.bu) / 2 * (y - G.o) / (G.u - G.o));
  const xr = y => 2 * G.x - xl(y);
  const lv = G.o + 12, wob = Math.sin(t * 2.1) * 1.6;
  ctx.save();
  ctx.fillStyle = 'rgba(147,197,253,0.75)';
  ctx.beginPath();
  ctx.moveTo(xl(lv) + 1.5, lv + wob);
  ctx.quadraticCurveTo(G.x, lv - wob * 0.5, xr(lv) - 1.5, lv - wob);
  ctx.lineTo(xr(G.u) - 1.5, G.u - 2); ctx.lineTo(xl(G.u) + 1.5, G.u - 2);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(37,99,235,0.6)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(xl(lv) + 1.5, lv + wob);
  ctx.quadraticCurveTo(G.x, lv - wob * 0.5, xr(lv) - 1.5, lv - wob); ctx.stroke();
  // Glaswand
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(xl(G.o), G.o); ctx.lineTo(xl(G.u), G.u);
  ctx.lineTo(xr(G.u), G.u); ctx.lineTo(xr(G.o), G.o); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(xl(G.o) + 5, G.o + 16); ctx.lineTo(xl(G.u) + 5, G.u - 8); ctx.stroke();
  ctx.restore();
}
// Teller mit Apfel und Birne
function _n9iTeller(ctx) {
  const T = _N9I_TELLER;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.ellipse(T.x, T.y, 36, 8, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(T.x, T.y - 1, 25, 5, 0, 0, 2 * Math.PI); ctx.stroke();
  // Apfel
  ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#991b1b'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(T.x - 11, T.y - 10, 9, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(T.x - 11, T.y - 18); ctx.lineTo(T.x - 10, T.y - 23); ctx.stroke();
  ctx.fillStyle = '#16a34a';
  ctx.beginPath(); ctx.ellipse(T.x - 6, T.y - 22, 4, 2, -0.5, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.arc(T.x - 14, T.y - 13, 2.2, 0, 2 * Math.PI); ctx.fill();
  // Birne
  ctx.fillStyle = '#a3c93a'; ctx.strokeStyle = '#4d7c0f'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(T.x + 13, T.y - 8, 8, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(T.x + 13, T.y - 17, 5.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(T.x + 13, T.y - 8, 6.8, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(T.x + 13, T.y - 22); ctx.lineTo(T.x + 15, T.y - 26); ctx.stroke();
  ctx.restore();
}
// Körper-Umriss: Arme, Hals, Rumpf, Kopf – hellblau, ohne Gesicht.
// Arme als Kapseln von der Schulter leicht schräg nach außen.
const _N9I_DRIFT = [4, -3, 5, -4, 3, -5, 2.5, -2.5, 4.5, -3.5, 3.5, -4.5];   // Bildpunkte je s
const _N9I_ARM = [{ x0: 157, y0: 102, x1: 141, y1: 192 }, { x0: 263, y0: 102, x1: 279, y1: 192 }];
// Außenkante des rechten Arms auf Höhe y (dort entstehen die Hauttropfen)
function _n9iArmRand(y) {
  const A = _N9I_ARM[1];
  return A.x0 + (A.x1 - A.x0) * (y - A.y0) / (A.y1 - A.y0) + 10;
}
function _n9iKoerper(ctx, t) {
  const R = _N9I_RUMPF, K = _N9I_KOPF;
  const fuell = '#dbe9f8', rand = '#7f97b2';
  ctx.save();
  ctx.lineCap = 'round';
  for (const A of _N9I_ARM) {
    ctx.strokeStyle = rand; ctx.lineWidth = 21;
    ctx.beginPath(); ctx.moveTo(A.x0, A.y0); ctx.lineTo(A.x1, A.y1); ctx.stroke();
    ctx.strokeStyle = fuell; ctx.lineWidth = 17;
    ctx.beginPath(); ctx.moveTo(A.x0, A.y0); ctx.lineTo(A.x1, A.y1); ctx.stroke();
  }
  ctx.lineCap = 'butt';
  ctx.fillStyle = fuell; ctx.strokeStyle = rand; ctx.lineWidth = 2;
  ctx.fillRect(K.x - 9, K.y + 12, 18, R.o - K.y - 6);
  ctx.beginPath(); ctx.moveTo(K.x - 9, K.y + 14); ctx.lineTo(K.x - 9, R.o);
  ctx.moveTo(K.x + 9, K.y + 14); ctx.lineTo(K.x + 9, R.o); ctx.stroke();
  // Rumpf: Schultern, schmalere Taille, Hüfte
  ctx.beginPath();
  ctx.moveTo(K.x - 11, R.o - 2);
  ctx.quadraticCurveTo(172, R.o, 160, R.o + 9);
  ctx.quadraticCurveTo(150, R.o + 16, 151, R.o + 30);
  ctx.quadraticCurveTo(153, R.o + 60, 160, R.o + 80);
  ctx.quadraticCurveTo(163, R.o + 93, 158, R.o + 110);
  ctx.quadraticCurveTo(156, R.u, 182, R.u);
  ctx.lineTo(238, R.u);
  ctx.quadraticCurveTo(264, R.u, 262, R.o + 110);
  ctx.quadraticCurveTo(257, R.o + 93, 260, R.o + 80);
  ctx.quadraticCurveTo(267, R.o + 60, 269, R.o + 30);
  ctx.quadraticCurveTo(270, R.o + 16, 260, R.o + 9);
  ctx.quadraticCurveTo(248, R.o, K.x + 11, R.o - 2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(K.x, K.y, K.r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  // Wasser im Körper: weiße Pünktchen treiben langsam
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 12; i++) {
    const px = 168 + ((i * 37 + t * _N9I_DRIFT[i]) % 84 + 84) % 84;
    const py = R.o + 14 + ((i * 59 + Math.sin(t * 0.6 + i) * 9 + t * 3) % 104 + 104) % 104;
    ctx.beginPath(); ctx.arc(px, py, 1.9, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
// Nieren, Schläuche, Blase und der Ausgang nach unten
function _n9iOrgane(ctx, s, F) {
  const B = _N9I_BL;
  ctx.save();
  // Schläuche von den Nieren zur Blase
  ctx.strokeStyle = '#d29aa8'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (const N of _N9I_NIERE) {
    const p = _n9iSchlauch(N);
    ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y); ctx.quadraticCurveTo(p[1].x, p[1].y, p[2].x, p[2].y); ctx.stroke();
  }
  // Ausgang unten aus dem Körper
  ctx.beginPath(); ctx.moveTo(B.x, B.y + B.ry); ctx.lineTo(B.x, _N9I_RUMPF.u); ctx.stroke();
  ctx.lineCap = 'butt';
  for (const N of _N9I_NIERE) _n9iNiere(ctx, N.x, N.y, N.s);
  // Blase mit Harn
  ctx.fillStyle = '#fdf2f4'; ctx.strokeStyle = '#b5778a'; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.ellipse(B.x, B.y, B.rx, B.ry, 0, 0, 2 * Math.PI); ctx.fill();
  const voll = s < 0 ? 0 : _n9iBlaseVoll(s);
  if (voll > 0.02) {
    const rx = B.rx - 1.5, ry = B.ry - 1.5;
    const yl = B.y + ry - 2 * ry * voll;
    const a0 = Math.asin(Math.max(-1, Math.min(1, (yl - B.y) / ry)));
    ctx.fillStyle = F.f;
    ctx.beginPath(); ctx.ellipse(B.x, B.y, rx, ry, 0, a0, Math.PI - a0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = F.r; ctx.lineWidth = 1.2;
    const hw = rx * Math.cos(a0);
    ctx.beginPath(); ctx.moveTo(B.x - hw, yl); ctx.lineTo(B.x + hw, yl); ctx.stroke();
  }
  ctx.strokeStyle = '#b5778a'; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.ellipse(B.x, B.y, B.rx, B.ry, 0, 0, 2 * Math.PI); ctx.stroke();
  // gestrichelte Leitung vom Körper zum Becher
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(B.x, _N9I_RUMPF.u + 2); ctx.lineTo(B.x, _N9I_BECHER.o - 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
// Schlauch einer Niere: Anfang an der Einbuchtung, Kontrollpunkt, Ende an der Blase
function _n9iSchlauch(N) {
  return [{ x: N.x + 5 * N.s, y: N.y + 4 },
          { x: N.x + 11 * N.s, y: N.y + 30 },
          { x: _N9I_BL.x - 7 * N.s, y: _N9I_BL.y - _N9I_BL.ry + 2 }];
}
// Bohnenform; seite +1: Einbuchtung zeigt nach rechts (linke Niere im Bild)
function _n9iNiere(ctx, x, y, seite) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(seite, 1);
  ctx.beginPath();
  ctx.moveTo(1, -17);
  ctx.bezierCurveTo(-15, -17, -15, 17, 1, 17);
  ctx.bezierCurveTo(10, 17, 11, 9, 6, 4);
  ctx.quadraticCurveTo(2, 0, 6, -4);
  ctx.bezierCurveTo(11, -9, 10, -17, 1, -17);
  ctx.closePath();
  const g = ctx.createLinearGradient(-12, -17, 8, 17);
  g.addColorStop(0, '#b4232f'); g.addColorStop(1, '#7a1820');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#5a1117'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.beginPath(); ctx.ellipse(-5, -7, 3, 6, 0.2, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
// Alles, was fließt: Trink- und Esstropfen, Haut, Atem, Harn, Leeren
function _n9iFluss(ctx, s, F) {
  if (s < 0) return;
  const P = _n9i.plan, M = _N9I_MUND, BA = _N9I_BAUCH, G = _N9I_GLAS, T = _N9I_TELLER;
  ctx.save();
  // rein: Glas und Teller → Mund → Bauch
  const rein = (t0, start, kurve, hell) => {
    const u = (s - t0) / _N9I_TLAUF;
    if (u < 0 || u >= 1) return;
    let p, a = 1;
    if (u < 0.55) p = _n9iQ(start, kurve, M, u / 0.55);          // gleichmäßig, kein Stau am Mund
    else {
      const v = (u - 0.55) / 0.45;
      p = { x: M.x, y: M.y + (BA.y - M.y) * v };
      a = 1 - _bioFxKlemme((v - 0.55) / 0.45);
    }
    ctx.globalAlpha = a;
    _n9iTropfen(ctx, p.x, p.y, 3.6, hell ? '#60a5fa' : '#2563eb', '#1e3a8a');
    ctx.globalAlpha = 1;
  };
  for (const t0 of P.trink) rein(t0, { x: G.x, y: G.o + 8 }, { x: 132, y: 58 }, false);
  for (const t0 of _N9I_ESSEN) rein(t0, { x: T.x + 13, y: T.y - 25 }, { x: 130, y: 70 }, true);
  // raus: Tropfen auf der Haut (rechter Arm)
  _N9I_HAUT.forEach((t0, i) => {
    const u = (s - t0) / _N9I_AUS;
    if (u < 0 || u >= 1) return;
    const y0 = _N9I_HAUT_Y[i];
    ctx.globalAlpha = _bioFxKlemme(u / 0.15) * (1 - _bioFxKlemme((u - 0.55) / 0.45));
    _n9iTropfen(ctx, _n9iArmRand(y0) + 4 + 18 * u, y0 + 12 * u * u, 3.2, '#3b82f6', '#1e3a8a');
    ctx.globalAlpha = 1;
  });
  // raus: Atemwolke am Kopf
  for (const t0 of _N9I_ATEM) {
    const u = (s - t0) / _N9I_AUS;
    if (u < 0 || u >= 1) continue;
    const x = _N9I_KOPF.x + 22 + 34 * u, y = _N9I_KOPF.y + 6 - 8 * u, r = 3.5 + 5 * u;
    ctx.globalAlpha = 0.9 * _bioFxKlemme(u / 0.12) * (1 - u);
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x - r * 0.8, y + r * 0.2, r * 0.75, 0, 2 * Math.PI);
    ctx.arc(x, y - r * 0.25, r, 0, 2 * Math.PI);
    ctx.arc(x + r * 0.85, y + r * 0.2, r * 0.7, 0, 2 * Math.PI);
    ctx.fill(); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // Harn: Niere → Schlauch → Blase
  for (const h of P.harn) {
    const u = (s - h.t0) / _N9I_HLAUF;
    if (u < 0 || u >= 1) continue;
    const p = _n9iSchlauch(_N9I_NIERE[h.seite]);
    const q = _n9iQ(p[0], p[1], p[2], u);
    ctx.fillStyle = F.f; ctx.strokeStyle = F.r; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(q.x, q.y, 2.8, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  }
  // Leeren: Harn rinnt aus der Blase nach unten in den Becher
  const yl = _N9I_BECHER.u - 2 - _n9iBecherL(s) * _N9I_PXL;
  for (const f of P.leeren) {
    const u = (s - f) / _N9I_LEER;
    if (u < 0 || u >= 1) continue;
    const y0 = _N9I_BL.y + _N9I_BL.ry;
    ctx.strokeStyle = F.r; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.globalAlpha = 0.35;
    ctx.beginPath(); ctx.moveTo(_N9I_BL.x, y0); ctx.lineTo(_N9I_BL.x, yl); ctx.stroke();
    ctx.globalAlpha = 1; ctx.lineCap = 'butt';
    for (let i = 0; i < 4; i++) {
      const v = (u * 2.2 + i * 0.27) % 1;
      const y = y0 + (yl - y0) * v;
      ctx.fillStyle = F.f; ctx.strokeStyle = F.r; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(_N9I_BL.x, y, 2.8, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }
  }
  ctx.restore();
}
// Messbecher mit Liter-Skala; füllt sich bis zur Harnmenge des Tages
function _n9iBecher(ctx, s, F) {
  const B = _N9I_BECHER, boden = B.u - 2, w = B.r - B.l;
  const vol = s < 0 ? 0 : _n9iBecherL(s);
  ctx.save();
  ctx.fillStyle = 'rgba(226,234,244,0.9)';
  ctx.fillRect(B.l, B.o, w, B.u - B.o);
  if (vol > 0.001) {
    const yl = boden - vol * _N9I_PXL;
    ctx.fillStyle = F.f; ctx.fillRect(B.l + 2, yl, w - 4, boden - yl);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(B.r - 11, yl + 1, 4, boden - yl - 1);
    ctx.strokeStyle = F.r; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(B.l + 2, yl); ctx.lineTo(B.r - 2, yl); ctx.stroke();
  }
  // Skala: Striche alle 0,5 l, Zahlen bei 1 l, 2 l, 3 l
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2;
  ctx.fillStyle = '#334155'; ctx.font = '700 10px sans-serif';
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (let k = 1; k <= 6; k++) {
    const y = boden - k * 0.5 * _N9I_PXL, lang = k % 2 === 0;
    ctx.beginPath(); ctx.moveTo(B.l, y); ctx.lineTo(B.l + (lang ? 11 : 6), y); ctx.stroke();
    if (lang) ctx.fillText((k / 2) + ' l', B.l - 4, y);
  }
  // Glaswand mit Ausguss
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2.2; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(B.l - 4, B.o - 3); ctx.lineTo(B.l, B.o + 2);
  ctx.lineTo(B.l, B.u); ctx.lineTo(B.r, B.u); ctx.lineTo(B.r, B.o);
  ctx.stroke();
  ctx.restore();
}
// Anzeige „Wasser im Körper: 30 l“ unten rechts
function _n9iKoerperWasser(ctx) {
  const K = _N9I_KW;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
  _n9iRund(ctx, K.x, K.y, K.w, K.h, 8); ctx.fill(); ctx.stroke();
  _n9iTropfen(ctx, K.x + 12, K.y + 16, 4.2, '#bfdbfe', '#2563eb');
  ctx.fillStyle = '#0f172a'; ctx.font = '700 12px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Wasser im Körper: 30 l', K.x + 22, K.y + 18);
  ctx.restore();
}
