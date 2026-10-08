// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · DER WEG VOM GLAS ZUR BLASE   (Förderheft Bio 9 · bd1)
// Kennung bio-niere, Präfix _n9h. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bd1.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250, schematisch, ohne Körper):
//   - eine Niere im Schnitt als Bohnenform (blass rosa)
//   - senkrecht hindurch ein Blutgefäß: oben fließt Blut hinein, unten fließt
//     es weiter (rote Wände, Fließ-Winkel zeigen nach unten)
//   - in der Mitte der rechten Gefäßwand ein feines Sieb (grau, sechs Löcher
//     zu 7 Bildpunkten)
//   - rechts davon ein gelber Kanal; er führt aus der Niere hinaus und als
//     dünner Schlauch nach unten zu einer rundlichen Blase
//   - zwei Zähler im Bild: „im Blut: …“ unten rechts neben dem Ausgang des Gefäßes,
//     „im Harn: …“ über der Blase. Oben rechts steht, welche Teilchen fließen.
//
// BEDIENUNG (wörtlich):
//   Teilchen im Blut: „Blutzellen“ · „Zucker“ · „Abfallstoffe“ · „Wasser“
//                     (Wahlgruppe _n9hTeilchen('zellen'|'zucker'|'abfall'|'wasser'))
//   „▶ 10 Teilchen losschicken“ (_n9hLos) · „neu“ (_n9hNeu → Blutzellen)
//   Umstellen setzt beide Zähler auf 0 und leert das Bild. Jeder weitere Druck
//   auf „▶“ (nach dem Ende eines Durchgangs) schickt 10 neue Teilchen, die
//   Zähler zählen weiter. Während ein Durchgang läuft, wartet der Knopf.
//
// WEGE DER TEILCHEN (alle 0,3 s eines, Blutzellen alle 0,36 s; fest vorgegeben, ohne Zufall):
//   Blutzellen   (rote Scheiben, 15 Bildpunkte) gleiten am Sieb entlang, drücken
//                an jedes Loch, passen nicht hindurch und fließen unten weiter.
//   Zucker       (weiße Würfel) gehen durch ein Loch in den gelben Kanal, sinken
//                ein Stück ab und wandern dann in 2,0 s sichtbar durch die Wand
//                zurück ins Blut (die Wand öffnet sich dort kurz, grüner Ring).
//   Abfallstoffe (gelbe Punkte) gehen durch ein Loch und fließen durch den
//                Kanal und den Schlauch in die Blase; dort liegen sie sichtbar.
//   Wasser       (blaue Tropfen) alle 10 gehen durch das Sieb; 9 wandern zurück
//                wie der Zucker, der sechste fließt zur Blase.
//   Gezählt wird beim Ankommen: „im Blut“ am unteren Rand der Niere,
//   „im Harn“ beim Eintritt in die Blase. Die Zähler stehen also erst fest,
//   wenn das letzte Teilchen angekommen ist (Wasser: die Stolperstelle aus dem
//   Lehrerteil – erst laufen alle 10 durch das Sieb).
//
// WERTE (lehrer.tabelle_erwartet; gegengerechnet im Mini-DOM, je 10 Teilchen):
//   Blutzellen   im Blut: 10 · im Harn: 0
//   Zucker       im Blut: 10 · im Harn: 0
//   Abfallstoffe im Blut: 0  · im Harn: 10
//   Wasser       im Blut: 9  · im Harn: 1
//   Zusatz: Wasser dreimal → im Blut: 27 · im Harn: 3
//   Ein Durchgang dauert je nach Teilchen 7 bis 9 s (gemessen im Mini-DOM).
//
// STATUSZEILE (_n9h-status): „im Blut: N · im Harn: N“, läuft live mit.
// HINWEIS (_n9h-hinweis):
//   vorher    „Teilchen im Blut: … Drücke „▶ 10 Teilchen losschicken“.“
//   unterwegs „Die Teilchen sind unterwegs. Sieh genau auf das Sieb. Warte,
//              bis alle angekommen sind.“
//   danach    „Teilchen im Blut: … Alle Teilchen sind angekommen. Lies beide
//              Zähler ab. Stelle dann andere Teilchen ein.“ (der Name steht mit
//              da, damit Bild, Zähler und Einstellung auf einem Blick und im
//              Dump zusammengehören – sonst fällt „Zucker“ als Doppel von
//              „Blutzellen“ aus dem Dump)
//
// AHA (_bioFx, ruhig, ohne Textstreifen): grauer Ring, wo eine Blutzelle am Sieb
//   anstößt; grüner Ring und offene Wand, wo Zucker oder Wasser zurück ins Blut
//   wandert; gelber Ring am Eingang der Blase; der passende Zähler pocht beim
//   Zählen. Am Ende leuchten beide Zähler ruhig: jetzt ablesen.
//
// NICHT AM BILDSCHIRM (Lückenwörter): „filtern“, „Filter“, „bleiben“, „Magen“.
//   „Zucker“ steht nur als Knopf- und Teilchenname da (so verlangt es der
//   Bauplan), nie in einem Satz über den Harn.
// ═══════════════════════════════════════════════════════════════════════
let _n9h = null;
const _N9H_NAME = { zellen: 'Blutzellen', zucker: 'Zucker', abfall: 'Abfallstoffe', wasser: 'Wasser' };
const _N9H_REIHE = ['zellen', 'zucker', 'abfall', 'wasser'];
const _N9H_N = 10;                      // Teilchen je Druck
const _N9H_TAKT = 0.3;                  // Abstand zweier Teilchen in s
const _N9H_TAKT_Z = 0.36;               // Blutzellen sind größer: etwas mehr Abstand
const _N9H_V = 80;                      // Fließen im Gefäß (Bildpunkte je s)
const _N9H_VS = 56;                     // Anlauf an das Sieb
const _N9H_VH = 64;                     // Fließen im gelben Kanal und Schlauch
const _N9H_WASSER_HARN = 5;             // der sechste Wassertropfen fließt zur Blase
// Gefäß: Innenraum x 95 … 137, Wände links bei 93,5, rechts (gemeinsam mit dem
// gelben Kanal) bei 139
const _N9H_GL = 95, _N9H_GR = 137, _N9H_GM = 116, _N9H_WAND = 139;
// Sieb: von y 34 bis 104, sechs Löcher zu 7 Bildpunkten, Stege zu 4
const _N9H_SIEB0 = 34, _N9H_SIEB1 = 104;
const _N9H_LOCH = [41.5, 52.5, 63.5, 74.5, 85.5, 96.5];
// Darunter (y 106 … 136) das Wandstück, durch das Zucker und Wasser zurückwandern.
// gelber Kanal: Innenraum x 141 … 173, Bogen nach rechts bei y 137 … 163
const _N9H_KM = 157;
const _N9H_UNTEN = 220;                 // hier verlässt das Blut die Niere: Zählstelle
// Blase
const _N9H_BX = 358, _N9H_BY = 208, _N9H_BRX = 46, _N9H_BRY = 32;
// Schlauch zur Blase (Bézier vom Nierenausgang bis in die Blase)
const _N9H_SCHLAUCH = [[214, 150], [252, 150], [284, 194], [319, 196]];
// seitliche Lage der Teilchen im Gefäß und im Kanal
const _N9H_OFF = [-10, 6, -3, 11, -12, 2, 9, -6, 13, -1];
const _N9H_OFF2 = [4, -9, 10, -4, 7, -11, 1, 12, -7, 5];
const _N9H_KO = [-7, 5, -2, 8, -9, 1, 6, -4, 9, -6];
const _N9H_LOCHWAHL = [1, 4, 2, 5, 0, 3, 1, 4, 2, 5];
// Höhe des Rückwegs über y 108: zeitlich benachbarte Teilchen weit auseinander
const _N9H_RUECKHOEHE = [0, 14, 28, 7, 21, 0, 14, 28, 7, 21];

function _n9hInit() {
  _n9h = { art: 'zellen', t: 0 };
  _n9hLeeren();
  _n9h.plaetze = _n9hPlaetze();
}
// Alles auf Anfang für die eingestellte Teilchenart
function _n9hLeeren() {
  _n9h.blut = 0; _n9h.harn = 0;
  _n9h.teile = []; _n9h.platz = 0;
  _n9h.laeuft = false; _n9h.gestartet = false; _n9h.fertig = false;
  _n9h.durchgang = 0; _n9h.glanz = 0;
  _n9h.pochB = 0; _n9h.pochH = 0;
  _n9h.fx = { teile: [] };
}
// Liegeplätze in der Blase: Reihen von unten nach oben, je Reihe von der Mitte aus
function _n9hPlaetze() {
  const p = [];
  const reihen = [231, 223, 215, 207, 199];
  reihen.forEach((y, r) => {
    const dy = (y - _N9H_BY) / _N9H_BRY;
    const hw = _N9H_BRX * Math.sqrt(Math.max(0, 1 - dy * dy)) - 8;
    const versatz = r % 2 ? 4 : 0;
    const reihe = [];
    for (let dx = -40 + versatz; dx <= 40; dx += 8) if (Math.abs(dx) <= hw) reihe.push(dx);
    reihe.sort((a, b) => Math.abs(a) - Math.abs(b) || a - b);
    for (const dx of reihe) {
      // nicht in die Mündung des Schlauchs legen
      const e = _N9H_SCHLAUCH[3];
      if (Math.hypot(_N9H_BX + dx - e[0], y - e[1]) >= 13) p.push({ x: _N9H_BX + dx, y });
    }
  });
  return p;
}

// ── Bedienung ──────────────────────────────────────────
function _n9hTeilchen(a) {
  if (!_n9h || !_N9H_NAME[a]) return;
  _n9h.art = a;
  _n9hLeeren();
  _n9hStatus();
}
function _n9hLos() {
  if (!_n9h || _n9h.laeuft) return;
  _n9h.durchgang++;
  for (let i = 0; i < _N9H_N; i++) {
    const p = _n9hBahn(_n9h.art, i);
    p.u = -i * (_n9h.art === 'zellen' ? _N9H_TAKT_Z : _N9H_TAKT); p.ei = 1; p.d = _n9h.durchgang;
    _n9h.teile.push(p);
  }
  _n9h.laeuft = true; _n9h.gestartet = true; _n9h.fertig = false; _n9h.glanz = 0;
  _n9hStatus();
}
function _n9hNeu() {
  if (!_n9h) return;
  _n9h.art = 'zellen';
  _n9hLeeren();
  _n9hStatus();
}

// ── Anzeige ────────────────────────────────────────────
function _n9hZeile() { return 'im Blut: ' + _n9h.blut + ' · im Harn: ' + _n9h.harn; }
function _n9hHinweis() {
  if (_n9h.laeuft) return 'Die Teilchen sind unterwegs. Sieh genau auf das Sieb. Warte, bis alle angekommen sind.';
  if (_n9h.fertig) return 'Teilchen im Blut: ' + _N9H_NAME[_n9h.art] + '. Alle Teilchen sind angekommen. Lies beide Zähler ab. Stelle dann andere Teilchen ein.';
  return 'Teilchen im Blut: ' + _N9H_NAME[_n9h.art] + '. Drücke „▶ 10 Teilchen losschicken“.';
}
function _n9hStatus() {
  if (!_n9h) return;
  const el = document.getElementById('_n9h-status');
  if (el) { el.textContent = _n9hZeile(); el.className = 'lmp-status on'; }
  const h = document.getElementById('_n9h-hinweis');
  if (h) h.textContent = _n9hHinweis();
  try {
    document.querySelectorAll('[data-n9h]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9h') === _n9h.art);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9h-los');
  if (los && los.classList) los.classList.toggle('primary', !_n9h.laeuft);
}
function _n9hHTML() {
  const k = a => `<button class="sim-btn" data-n9h="${a}" onclick="_n9hTeilchen('${a}')">${_N9H_NAME[a]}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was holt die Niere aus dem Blut heraus?</h3>
    <div class="fpm-note" style="margin-top:2px">Eine Niere im Schnitt, ganz einfach gezeichnet. Oben fließt Blut hinein, unten fließt es weiter. In der Mitte liegt ein feines Sieb (grau). Ein zweiter Weg führt zur Blase.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9h-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9h-los" onclick="_n9hLos()">▶ 10 Teilchen losschicken</button>
          <button class="sim-btn" onclick="_n9hNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Teilchen im Blut</span>
          <div class="sim-btn-row">${_N9H_REIHE.map(k).join('')}</div>
        </div>
        <div class="lmp-status on" id="_n9h-status" style="margin-top:8px"></div>
        <div class="fpm-note" id="_n9h-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Rote Scheiben sind Blutzellen. Weiße Würfel sind Zucker. Gelbe Punkte sind Abfallstoffe. Blaue Tropfen sind Wasser.</div>
        <div class="fpm-note" style="margin-top:6px">Der Zähler „im Blut“ zählt die Teilchen, die unten mit dem Blut weiterfließen. Der Zähler „im Harn“ zählt die Teilchen, die in der Blase ankommen.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: „Blutzellen“ · im Blut: 0 · im Harn: 0 &nbsp;|&nbsp; Ein Durchgang dauert höchstens 10 Sekunden.</p>
  </div>`;
}

// ── Wege der Teilchen ──────────────────────────────────
// Ein Weg ist eine Liste von Wegmarken {t, x, y}; t zählt ab dem Start des
// Teilchens. ev: Ereignis beim Erreichen der Marke. e: 's' = weich ankommen.
// g: am Sieb entlanggleiten (Blutzelle drückt an jedes Loch). r: Rückweg.
function _n9hZu(b, x, y, v, o) {
  const l = b.k[b.k.length - 1];
  b.k.push(Object.assign({ t: l.t + Math.hypot(x - l.x, y - l.y) / v, x, y }, o || {}));
}
function _n9hIn(b, x, y, dauer, o) {
  const l = b.k[b.k.length - 1];
  b.k.push(Object.assign({ t: l.t + dauer, x, y }, o || {}));
}
function _n9hBezier(q, s) {
  const f = 1 - s;
  return [f * f * f * q[0][0] + 3 * f * f * s * q[1][0] + 3 * f * s * s * q[2][0] + s * s * s * q[3][0],
          f * f * f * q[0][1] + 3 * f * f * s * q[1][1] + 3 * f * s * s * q[2][1] + s * s * s * q[3][1]];
}
function _n9hBahn(art, i) {
  const x0 = _N9H_GM + _N9H_OFF[i];
  const b = { art, i, k: [{ t: 0, x: x0, y: -12 }], wohin: 'blut' };
  if (art === 'zellen') {
    // an das Sieb heran, daran entlang, nicht hindurch – dann weiter mit dem Blut
    _n9hZu(b, x0, 22, _N9H_V);
    _n9hIn(b, 128, 40, 0.5, { ev: 'stoss', e: 's' });
    _n9hIn(b, 128, 99, 0.85, { g: true });
    const x1 = _N9H_GM + _N9H_OFF2[i];
    _n9hIn(b, x1, 124, 0.5, { e: 's' });
    _n9hZu(b, x1, _N9H_UNTEN, _N9H_V, { ev: 'blut' });
    _n9hZu(b, x1, 262, _N9H_V);
    return b;
  }
  // kleine Teilchen: durch ein Loch des Siebs in den gelben Kanal
  const ly = _N9H_LOCH[_N9H_LOCHWAHL[i]];
  const xk = _N9H_KM + _N9H_KO[i];
  _n9hZu(b, x0, ly - 24, _N9H_V);
  _n9hZu(b, 129, ly, _N9H_VS);
  _n9hIn(b, 149, ly, 0.45);
  _n9hZu(b, xk, ly + 12, _N9H_VS);
  const zurHarn = art === 'abfall' || (art === 'wasser' && i === _N9H_WASSER_HARN);
  if (!zurHarn) {
    // Rückweg: 2,0 s von der Kanalmitte durch die Wand zurück ins Blut
    const yd = 108 + _N9H_RUECKHOEHE[i];
    const x1 = _N9H_GM + _N9H_OFF2[i];
    _n9hZu(b, xk, yd, _N9H_VH);
    _n9hIn(b, 147, yd + 3, 0.8, { e: 's', r: true });
    _n9hIn(b, 131, yd + 8, 0.6, { ev: 'tuer', r: true });
    _n9hIn(b, x1, yd + 18, 0.6, { e: 's', r: true });
    _n9hZu(b, x1, _N9H_UNTEN, _N9H_V, { ev: 'blut' });
    _n9hZu(b, x1, 262, _N9H_V);
    return b;
  }
  // weiter durch den Kanal, aus der Niere hinaus und durch den Schlauch zur Blase
  b.wohin = 'harn';
  const d = _N9H_KO[i] * 0.6;
  _n9hZu(b, _N9H_KM + _N9H_KO[i] * 0.6, 136, _N9H_VH);
  _n9hZu(b, 166, 147 + d, _N9H_VH);
  _n9hZu(b, 192, 150 + d * 0.8, _N9H_VH);
  _n9hZu(b, 214, 150, _N9H_VH);
  for (let s = 1; s <= 8; s++) {
    const q = _n9hBezier(_N9H_SCHLAUCH, s / 8);
    _n9hZu(b, q[0], q[1], _N9H_VH, s === 8 ? { ev: 'harn' } : null);
  }
  b.platz = true;                        // der Liegeplatz kommt beim Ankommen dazu
  return b;
}
// Lage eines Teilchens zur Zeit u (seit seinem Start)
function _n9hOrt(p, u) {
  const k = p.k;
  if (u <= 0) return { x: k[0].x, y: k[0].y, j: 0, f: 0 };
  for (let j = 1; j < k.length; j++) {
    if (u < k[j].t) {
      let f = (u - k[j - 1].t) / ((k[j].t - k[j - 1].t) || 1);
      if (k[j].e === 's') f = _bioFxEase.sanft(f);
      let x = k[j - 1].x + (k[j].x - k[j - 1].x) * f;
      const y = k[j - 1].y + (k[j].y - k[j - 1].y) * f;
      if (k[j].g) x += 1.6 * _n9hDelle(y);
      return { x, y, j, f };
    }
  }
  const z = k[k.length - 1];
  return { x: z.x, y: z.y, j: k.length, f: 1 };
}
// 1 genau vor einem Loch, 0 vor einem Steg
function _n9hDelle(y) {
  let m = 0;
  for (const ly of _N9H_LOCH) m = Math.max(m, Math.exp(-Math.pow((y - ly) / 3.2, 2)));
  return m;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9hUpdate(dt) {
  if (!_n9h) return;
  dt = _bioFxDt(dt);
  _n9h.t += dt;
  _n9h.pochB = Math.max(0, _n9h.pochB - dt);
  _n9h.pochH = Math.max(0, _n9h.pochH - dt);
  if (_n9h.glanz > 0) _n9h.glanz = Math.max(0, _n9h.glanz - dt);
  let neu = false;
  for (const p of _n9h.teile) {
    p.u += dt;
    while (p.ei < p.k.length && p.u >= p.k[p.ei].t) {
      const ev = p.k[p.ei].ev;
      if (ev) { _n9hEreignis(p, ev, p.k[p.ei]); if (ev === 'blut' || ev === 'harn') neu = true; }
      p.ei++;
    }
  }
  // Wer das Bild unten verlassen hat, ist weg; wer in der Blase liegt, ruht dort.
  _n9h.teile = _n9h.teile.filter(p => !(p.wohin === 'blut' && p.u >= p.k[p.k.length - 1].t));
  if (_n9h.laeuft && _n9h.teile.every(p => p.d !== _n9h.durchgang || p.u >= p.k[p.k.length - 1].t)) {
    _n9h.laeuft = false; _n9h.fertig = true; _n9h.glanz = 2.0;
    neu = true;
  }
  if (neu) _n9hStatus();
  _bioFxAlleUpdate(_n9h.fx, dt);
}
function _n9hEreignis(p, ev, m) {
  const fx = _n9h.fx;
  if (ev === 'stoss') _bioFxWelle(fx.teile, _N9H_WAND - 1, m.y, '#94a3b8', 13);
  if (ev === 'tuer') _bioFxWelle(fx.teile, _N9H_WAND, m.y - 3, '#4ade80', 15);
  if (ev === 'blut') {
    _n9h.blut++; _n9h.pochB = 0.45;
    _bioFxWelle(fx.teile, m.x, _N9H_UNTEN, '#f87171', 14);
  }
  if (ev === 'harn') {
    _n9h.harn++; _n9h.pochH = 0.45;
    _bioFxWelle(fx.teile, m.x, m.y, '#facc15', 16);
    // Liegeplatz in der Blase anhängen: in 0,5 s dorthin sinken
    const pl = _n9h.plaetze[_n9h.platz % _n9h.plaetze.length];
    const lage = Math.floor(_n9h.platz / _n9h.plaetze.length);
    _n9h.platz++;
    p.k.push({ t: m.t + 0.5, x: pl.x + (lage % 2 ? 4 : 0), y: pl.y - (lage % 2 ? 4 : 0), e: 's' });
    p.ph = (_n9h.platz * 1.618) % (2 * Math.PI);
  }
}

// ── Zeichnen ───────────────────────────────────────────
function _n9hNierePfad(ctx) {
  ctx.beginPath();
  ctx.moveTo(150, 12);
  ctx.bezierCurveTo(210, 12, 252, 52, 252, 102);
  ctx.bezierCurveTo(252, 118, 246, 124, 238, 128);     // obere Lippe
  ctx.bezierCurveTo(231, 134, 229, 142, 229, 150);     // Einbuchtung: hier
  ctx.bezierCurveTo(229, 158, 231, 166, 238, 172);     // verlässt der Schlauch die Niere
  ctx.bezierCurveTo(250, 182, 248, 206, 218, 212);
  ctx.bezierCurveTo(188, 220, 140, 222, 110, 219);
  ctx.bezierCurveTo(70, 214, 54, 176, 54, 120);
  ctx.bezierCurveTo(54, 56, 92, 12, 150, 12);
  ctx.closePath();
}
// Innenraum des gelben Kanals (oben rund, unten Bogen nach rechts, Trichter)
function _n9hKanalPfad(ctx) {
  ctx.beginPath();
  ctx.moveTo(141, 32);
  ctx.arc(_N9H_KM, 32, 16, Math.PI, 0, false);
  ctx.lineTo(173, 137);
  ctx.lineTo(214, 137);
  ctx.quadraticCurveTo(224, 137, 232, 144);
  ctx.lineTo(232, 156);
  ctx.quadraticCurveTo(224, 163, 214, 163);
  ctx.lineTo(161, 163);
  ctx.quadraticCurveTo(141, 163, 141, 143);
  ctx.closePath();
}
function _n9hKanalRand(ctx) {
  ctx.beginPath();
  ctx.moveTo(141, 143);
  ctx.lineTo(141, 32);
  ctx.arc(_N9H_KM, 32, 16, Math.PI, 0, false);
  ctx.lineTo(173, 137);
  ctx.lineTo(214, 137);
  ctx.quadraticCurveTo(224, 137, 232, 144);
  ctx.moveTo(232, 156);
  ctx.quadraticCurveTo(224, 163, 214, 163);
  ctx.lineTo(161, 163);
  ctx.quadraticCurveTo(141, 163, 141, 143);
  ctx.stroke();
}
function _n9hSchlauch(ctx, breite, farbe) {
  const q = _N9H_SCHLAUCH;
  ctx.strokeStyle = farbe; ctx.lineWidth = breite;
  ctx.beginPath(); ctx.moveTo(q[0][0] + 14, q[0][1]);
  ctx.bezierCurveTo(q[1][0], q[1][1], q[2][0], q[2][1], q[3][0], q[3][1]);
  ctx.stroke();
}
// Teilchen
function _n9hZelle(ctx, x, y, sx, sy) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(sx, sy);
  ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(0, 0, 7.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f87171';
  ctx.beginPath(); ctx.arc(0, 0, 3.6, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
function _n9hWuerfel(ctx, x, y) {
  const a = 3.2, h = 2.2;
  ctx.save();
  ctx.lineWidth = 0.9; ctx.strokeStyle = '#475569';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - a, y - a + 1, 2 * a, 2 * a); ctx.strokeRect(x - a, y - a + 1, 2 * a, 2 * a);
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(x - a, y - a + 1); ctx.lineTo(x - a + h, y - a + 1 - h);
  ctx.lineTo(x + a + h, y - a + 1 - h); ctx.lineTo(x + a, y - a + 1); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(x + a, y - a + 1); ctx.lineTo(x + a + h, y - a + 1 - h);
  ctx.lineTo(x + a + h, y + a + 1 - h); ctx.lineTo(x + a, y + a + 1); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
}
function _n9hPunkt(ctx, x, y) {
  ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#854d0e'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(x, y, 3.3, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
}
function _n9hTropfen(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#3b82f6'; ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(x, y - 5.5);
  ctx.quadraticCurveTo(x + 4.2, y - 0.5, x + 3.6, y + 1.6);
  ctx.arc(x, y + 1.4, 3.6, 0, Math.PI, false);
  ctx.quadraticCurveTo(x - 4.2, y - 0.5, x, y - 5.5);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath(); ctx.arc(x - 1.3, y + 0.6, 1, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
function _n9hTeil(ctx, art, x, y, sx, sy) {
  if (art === 'zellen') _n9hZelle(ctx, x, y, sx || 1, sy || 1);
  else if (art === 'zucker') _n9hWuerfel(ctx, x, y);
  else if (art === 'abfall') _n9hPunkt(ctx, x, y);
  else _n9hTropfen(ctx, x, y);
}
// Zählerkasten; a = 'l' (x ist linker Rand) oder 'r' (x ist rechter Rand)
function _n9hKasten(ctx, text, x, y, a, rand, schrift, poch, glanz, t) {
  ctx.save();
  ctx.font = '700 12px sans-serif';
  const w = ctx.measureText(text).width + 16, h = 20;
  const x0 = a === 'r' ? x - w : x;
  if (glanz > 0) {
    // ruhiger gelber Rand: jetzt ablesen (0,8 Hz, blendet in 2 s aus)
    const puls = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 0.8);
    ctx.strokeStyle = 'rgba(250,204,21,' + ((0.45 + 0.4 * puls) * Math.min(1, glanz)).toFixed(3) + ')';
    ctx.lineWidth = 4;
    _bioFxRundRect(ctx, x0 - 4, y - 4, w + 8, h + 8, 10); ctx.stroke();
  }
  const k = 1 + 0.12 * Math.sin(Math.PI * _bioFxKlemme(poch / 0.45));
  ctx.translate(x0 + w / 2, y + h / 2); ctx.scale(k, k);
  ctx.fillStyle = '#ffffff'; _bioFxRundRect(ctx, -w / 2, -h / 2, w, h, 7); ctx.fill();
  ctx.strokeStyle = rand; ctx.lineWidth = 2; _bioFxRundRect(ctx, -w / 2, -h / 2, w, h, 7); ctx.stroke();
  ctx.fillStyle = schrift; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 1);
  ctx.restore();
}
function _n9hDraw(ctx, cv) {
  if (!_n9h) return;
  const W = cv.width, H = cv.height, t = _n9h.t;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f7f1ea'; ctx.fillRect(0, 0, W, H);

  // ── Niere ──
  _n9hNierePfad(ctx);
  let g = ctx.createLinearGradient(0, 12, 0, 220);
  g.addColorStop(0, '#efd3cb'); g.addColorStop(1, '#e8c5bb');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#9b3b35'; ctx.lineWidth = 2.5; ctx.stroke();

  // ── Blase und Schlauch ──
  ctx.fillStyle = '#fdf3c4'; ctx.strokeStyle = '#b7791f'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(_N9H_BX, _N9H_BY, _N9H_BRX, _N9H_BRY, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  _n9hSchlauch(ctx, 16, '#b7791f');
  _n9hSchlauch(ctx, 11, '#fdf3c4');

  // ── gelber Kanal in der Niere ──
  _n9hKanalPfad(ctx);
  ctx.fillStyle = '#fdf3c4'; ctx.fill();
  ctx.strokeStyle = '#b7791f'; ctx.lineWidth = 2.5;
  _n9hKanalRand(ctx);
  // langsame Fließ-Winkel im Kanal (nach unten)
  ctx.save();
  ctx.strokeStyle = 'rgba(183,121,31,0.28)'; ctx.lineWidth = 1.5;
  for (let n = 0; n < 5; n++) {
    const y = 38 + ((t * 18 + n * 20) % 96);
    ctx.beginPath(); ctx.moveTo(_N9H_KM - 4, y - 3); ctx.lineTo(_N9H_KM, y); ctx.lineTo(_N9H_KM + 4, y - 3); ctx.stroke();
  }
  ctx.restore();

  // ── Blutgefäß ──
  g = ctx.createLinearGradient(_N9H_GL, 0, _N9H_GR, 0);
  g.addColorStop(0, '#fbcaca'); g.addColorStop(1, '#fcdcdc');
  ctx.fillStyle = g; ctx.fillRect(_N9H_GL, -2, _N9H_GR - _N9H_GL, H + 4);
  // Fließ-Winkel nach unten
  ctx.save();
  ctx.strokeStyle = 'rgba(185,28,28,0.25)'; ctx.lineWidth = 1.6;
  for (let n = 0; n < 10; n++) {
    const y = ((t * 45 + n * 27) % 270) - 10;
    ctx.beginPath(); ctx.moveTo(_N9H_GM - 5, y - 4); ctx.lineTo(_N9H_GM, y); ctx.lineTo(_N9H_GM + 5, y - 4); ctx.stroke();
  }
  ctx.restore();
  // linke Wand
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(_N9H_GL - 3, -2, 3, H + 4);
  // rechte Wand: oben fest, Sieb, Wandstück mit Durchgängen, unten fest
  const spalt = _n9hSpalte();
  ctx.fillRect(_N9H_GR, -2, 4, _N9H_SIEB0 + 2);
  _n9hWandMitSpalten(ctx, _N9H_SIEB1, H + 2, spalt);
  // Sieb: heller Grund, graue Stege, offene Löcher
  ctx.fillStyle = 'rgba(100,116,139,0.18)'; ctx.fillRect(_N9H_GR - 3, _N9H_SIEB0, 10, _N9H_SIEB1 - _N9H_SIEB0);
  ctx.fillStyle = '#ffffff';
  for (const ly of _N9H_LOCH) ctx.fillRect(_N9H_GR - 1, ly - 3.5, 6, 7);
  ctx.fillStyle = '#64748b';
  for (let y = _N9H_SIEB0; y < _N9H_SIEB1; y += 11) ctx.fillRect(_N9H_GR - 2, y, 8, 4);

  // ── Teilchen ──
  for (const p of _n9h.teile) {
    if (p.u < 0) continue;
    const o = _n9hOrt(p, p.u);
    let x = o.x, y = o.y;
    const ruht = p.wohin === 'harn' && o.j >= p.k.length && p.k[p.k.length - 1].e === 's';
    if (ruht) { x += Math.sin(t * 1.3 + p.ph) * 0.5; y += Math.cos(t * 1.1 + p.ph) * 0.4; }
    else if (p.art !== 'zellen') x += Math.sin(t * 7 + p.i * 1.9) * 0.4;
    // Blutzelle drückt am Sieb: etwas schmaler und höher
    let sx = 1, sy = 1;
    if (p.art === 'zellen' && o.j > 0 && o.j < p.k.length && p.k[o.j].g) {
      const d = _n9hDelle(o.y);
      sx = 1 - 0.1 * d; sy = 1 + 0.08 * d;
    }
    _n9hTeil(ctx, p.art, x, y, sx, sy);
  }

  // ── Beschriftung und Zähler ──
  ctx.save();
  ctx.font = '700 12px sans-serif'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#8b2f2a'; ctx.textAlign = 'left';
  ctx.fillText('Niere', 184, 74);
  ctx.fillText('Blut', 58, 13);
  ctx.fillStyle = '#92600e'; ctx.textAlign = 'right';
  ctx.fillText('Blase', 322, 244);
  ctx.restore();
  // Welche Teilchen fließen gerade? (oben rechts)
  ctx.save();
  ctx.font = '700 12px sans-serif';
  const name = _N9H_NAME[_n9h.art];
  const cw = ctx.measureText(name).width + 34;
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; _bioFxRundRect(ctx, W - 8 - cw, 6, cw, 22, 8); ctx.fill();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; _bioFxRundRect(ctx, W - 8 - cw, 6, cw, 22, 8); ctx.stroke();
  ctx.restore();
  _n9hTeil(ctx, _n9h.art, W - 8 - cw + 13, 17, 0.9, 0.9);
  ctx.save();
  ctx.font = '700 12px sans-serif'; ctx.fillStyle = '#1e293b'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(name, W - 8 - cw + 25, 18);
  ctx.restore();

  _n9hKasten(ctx, 'im Blut: ' + _n9h.blut, 148, 227, 'l', '#b91c1c', '#7f1d1d', _n9h.pochB, _n9h.glanz, t);
  _n9hKasten(ctx, 'im Harn: ' + _n9h.harn, 410, 148, 'r', '#b7791f', '#78350f', _n9h.pochH, _n9h.glanz, t);

  // Blickführung vor dem ersten Start: hier kommen die Teilchen herein
  if (!_n9h.gestartet) _bioFxLeuchten(ctx, _N9H_GM, 10, 10, t, '255,216,77');

  _bioFxAlleDraw(ctx, _n9h.fx);
}
// Wo öffnet sich die Wand gerade? Für jedes Teilchen auf dem Rückweg, das in
// der Wand steckt, ein Spalt von 12 Bildpunkten um seine Höhe.
function _n9hSpalte() {
  const s = [];
  for (const p of _n9h.teile) {
    if (p.u < 0) continue;
    const o = _n9hOrt(p, p.u);
    if (o.j > 0 && o.j < p.k.length && p.k[o.j].r && o.x > 128 && o.x < 150) s.push(o.y);
  }
  return s.sort((a, b) => a - b);
}
function _n9hWandMitSpalten(ctx, y0, y1, spalt) {
  let y = y0;
  for (const m of spalt) {
    const a = Math.max(y, m - 6), b = m + 6;
    if (a > y) { ctx.fillStyle = '#b91c1c'; ctx.fillRect(_N9H_GR, y, 4, a - y); }
    ctx.fillStyle = 'rgba(134,239,172,0.9)'; ctx.fillRect(_N9H_GR, a, 4, Math.max(0, b - a));
    y = Math.max(y, b);
  }
  if (y < y1) { ctx.fillStyle = '#b91c1c'; ctx.fillRect(_N9H_GR, y, 4, y1 - y); }
}
