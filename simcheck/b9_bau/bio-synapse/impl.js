// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · DIE LÜCKE ZWISCHEN ZWEI ZELLEN   (Förderheft Bio 9 · br4)
// Kennung bio-synapse, Präfix _n9d. Bauplan: arbeitsheft_bio_foe9/einheiten/
// br4.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250, OHNE jede Beschriftung im Bild):
//   - links das verdickte Ende einer Nervenfaser (blassblau). Darin sechs runde
//     Bläschen mit zusammen 20 violetten Kügelchen (4 + 3 + 3 + 3 + 3 + 4).
//   - in der Mitte die schmale Lücke (30 Bildpunkte, überall gleich breit:
//     beide Zellränder sind Bögen um denselben Mittelpunkt).
//   - rechts der Dendrit der nächsten Nervenzelle (blassgrün), sein Rand trägt
//     20 violette Mulden (Andockstellen), in die ein Kügelchen genau passt
//     (Mulde 3,5, Kügelchen 3,0 Bildpunkte Radius, gleiche Farbe).
//   Die rechte Zelle hat KEINE Bläschen.
//
// BEDIENUNG (wörtlich):
//   Versuch: „normal“ · „Bläschen leer“ · „Erregung von rechts“
//            (Wahlgruppe _n9dVersuch('normal'|'leer'|'rechts'))
//   „▶ Erregung senden“ (_n9dSenden) · „neu“ (_n9dNeu → Versuch normal)
//
// ABLAUF NACH „▶ Erregung senden“ (alles stark verlangsamt, Zeiten in s):
//   normal        0–1,8  gelber Lichtpunkt läuft von links bis vorn in das
//                        verdickte Ende, seine Spur bleibt hell
//                 1,8    er erlischt dort, der vordere Rand leuchtet auf
//                 2,0–3,0 die Bläschen wandern an den Rand, 3,0–3,4 sie
//                        öffnen sich zur Lücke hin, 4,6–5,2 schließen sie
//                        sich wieder (leer) – der Rand ist danach wieder ganz
//                 3,3–5,35 die 20 Kügelchen fliegen einzeln hinüber und
//                        setzen sich in die Mulden (jede Mulde leuchtet kurz)
//                 5,6    der rechte Rand leuchtet auf
//                 5,8–7,4 ein NEUER gelber Lichtpunkt läuft rechts weiter
//                        und verlässt das Bild; Ende bei 7,7
//   Bläschen leer Bläschen grau und leer. Lichtpunkt, Rand, Wandern und
//                 Öffnen und Schließen wie bei normal (nur EINE Bedingung
//                 ist anders), aber nichts fliegt; 4,4 ruhiger grauer Ring in
//                 der Lücke; rechts bleibt alles dunkel. Ende bei 5,4
//   Erregung von  Lichtpunkt läuft von rechts bis an die Lücke (0–1,8) und
//   rechts        erlischt dort (grauer Ring); nichts fliegt; links bleibt
//                 alles dunkel. Ende bei 3,0
//   Das Endbild bleibt stehen, bis man umstellt oder neu sendet: Spur(en),
//   angedockte Kügelchen, Bläschen am Rand – so ist das Ergebnis am Ende noch
//   ablesbar. Gegengerechnet (Mini-DOM, alle drei Versuche, mit Gegenproben):
//   20 von 20 angedockt bei 5,36 s, also vor dem neuen Lichtpunkt (5,8 s);
//   leer und von rechts: 0 Kügelchen im Flug, die andere Seite bleibt dunkel.
//
// STATUSZEILE (_n9d-status) nennt NUR den Versuch, nie das Ergebnis:
//   „Versuch: normal“ · „Versuch: Bläschen leer“ · „Versuch: Erregung von rechts“
// HINWEIS (_n9d-hinweis), in allen drei Versuchen dieselben Sätze:
//   vorher   „Versuch „…“: Drücke „▶ Erregung senden“.“
//   unterwegs „Die Erregung ist unterwegs. Sieh genau auf die Lücke in der Mitte.“
//   danach   „Fertig. Trage „ja“ oder „nein“ in die Tabelle ein. Stelle dann
//            einen anderen Versuch ein.“
//   („Versuch: normal“ hat nur 15 Zeichen – simfakten.js nimmt erst Felder
//   über 18 Zeichen in den Dump. Der Hinweis trägt den Versuchsnamen deshalb
//   mit, die Statuszeile bleibt wörtlich wie im Bauplan.)
//
// WERTE (lehrer.tabelle_erwartet, am Bild abzulesen):
//   normal              Kügelchen fliegen hinüber: ja · neuer Lichtpunkt rechts: ja
//   Bläschen leer       keine Kügelchen: nein · rechts bleibt dunkel: nein
//   Erregung von rechts keine Kügelchen: nein · erlischt an der Lücke: nein
//
// AHA (_bioFx, ruhig, OHNE Textstreifen, OHNE Funken – „Funke“ ist die
//   Fehlvorstellung aus predict, deshalb nur Lichtringe): Die Kügelchen fliegen
//   langsam und einzeln über die Lücke, kein Blitz; jede Mulde leuchtet beim
//   Andocken auf, erst danach startet rechts der neue Lichtpunkt. Leer: ein
//   grauer Ring mitten in der Lücke. Von rechts: ein grauer Ring dort, wo der
//   Lichtpunkt erlischt.
//
// NICHT AM BILDSCHIRM: „Synapse“, „Botenstoff“, „Spalt“, „Endknöpfchen“,
//   „Einbahnstraße“, „nicht“, „Funke“; kein Blitz. Deterministisch, ohne Zufall.
// ═══════════════════════════════════════════════════════════════════════
let _n9d = null;
const _N9D_VERSUCH = { normal: 'normal', leer: 'Bläschen leer', rechts: 'Erregung von rechts' };
const _N9D_CX = -20, _N9D_CY = 125;     // gemeinsamer Mittelpunkt beider Randbögen
const _N9D_RB = 222;                    // vorderer Rand links  (vorn bei x = 202)
const _N9D_RR = 252;                    // vorderer Rand rechts (vorn bei x = 232)
const _N9D_AE = 0.40;                   // halber Öffnungswinkel der Randbögen
const _N9D_KR = 3.0;                    // Kügelchen
const _N9D_MR = 3.5;                    // Mulde
const _N9D_BR = 13;                     // Bläschen
const _N9D_N = 20;                      // Kügelchen = Mulden
const _N9D_HG = '#eef2f6';              // Flüssigkeit zwischen den Zellen
// Bläschen: Ruhelage, Zahl der Kügelchen, Höhe am Rand beim Öffnen
const _N9D_BL = [
  { x: 164, y: 56,  n: 4, zy: 54 },
  { x: 148, y: 84,  n: 3, zy: 79 },
  { x: 184, y: 100, n: 3, zy: 104 },
  { x: 184, y: 150, n: 3, zy: 146 },
  { x: 148, y: 166, n: 3, zy: 171 },
  { x: 164, y: 194, n: 4, zy: 196 }
];
const _N9D_LAGE = {
  3: [[-4.5, -3], [4.5, -3], [0, 4.5]],
  4: [[-4, -4], [4, -4], [-4, 4], [4, 4]]
};
// Zeitplan in s nach „▶ Erregung senden“
const _N9D_LAUF = 1.8;                  // Lichtpunkt bis an die Lücke
const _N9D_AUS = 0.5;                   // Erlöschen
const _N9D_HIN0 = 2.0, _N9D_HIN1 = 3.0; // Bläschen wandern an den Rand
const _N9D_AUF0 = 3.0, _N9D_AUF1 = 3.4; // Bläschen öffnen sich
const _N9D_ZU0 = 4.6, _N9D_ZU1 = 5.2;   // … und schließen sich wieder
const _N9D_AB = 3.3, _N9D_JS = 0.14, _N9D_VS = 0.025;   // Abflug der Kügelchen
const _N9D_FLUG = 1.5;                  // Flugzeit eines Kügelchens
const _N9D_FEUER = 5.6;                 // rechter Rand leuchtet auf
const _N9D_R0 = 5.8, _N9D_R1 = 7.4;     // neuer Lichtpunkt rechts
const _N9D_LEERRING = 4.4;
const _N9D_ENDE = { normal: 7.7, leer: 5.4, rechts: 3.0 };
const _N9D_XL0 = -6, _N9D_XL1 = 198;    // Weg des Lichtpunkts links
const _N9D_XR0 = 238, _N9D_XR1 = 432;   // Weg des Lichtpunkts rechts

function _n9dInit() {
  _n9d = { versuch: 'normal', t: 0, s: -1, laeuft: false, gestartet: false, fertig: false,
           ev: {}, fx: { teile: [] }, kugeln: [], mulden: _n9dMulden() };
  _n9dKugelnNeu();
}
// Mulden auf dem rechten Randbogen, von oben nach unten
function _n9dMulden() {
  const m = [];
  for (let i = 0; i < _N9D_N; i++) {
    const a = -0.33 + i * 0.66 / (_N9D_N - 1);
    m.push({ a, x: _N9D_CX + (_N9D_RR + 0.6) * Math.cos(a), y: _N9D_CY + (_N9D_RR + 0.6) * Math.sin(a) });
  }
  return m;
}
// Lage eines Bläschens am Rand (Mitte 12 Bildpunkte innerhalb des Randes)
function _n9dZiel(b) {
  const a = Math.asin((b.zy - _N9D_CY) / (_N9D_RB - 12));
  return { a, x: _N9D_CX + (_N9D_RB - 12) * Math.cos(a), y: _N9D_CY + (_N9D_RB - 12) * Math.sin(a) };
}
// 20 Kügelchen, jedes mit seiner Mulde: von oben nach unten der Reihe nach
function _n9dKugelnNeu() {
  const k = [];
  let nr = 0;
  _N9D_BL.forEach((b, v) => {
    const lage = _N9D_LAGE[b.n].slice().sort((p, q) => p[1] - q[1] || p[0] - q[0]);
    lage.forEach((o, j) => {
      k.push({ v, j, ox: o[0], oy: o[1], m: nr, ts: _N9D_AB + j * _N9D_JS + v * _N9D_VS,
               ph: (nr * 1.618) % (2 * Math.PI), fest: false });
      nr++;
    });
  });
  _n9d.kugeln = k;
}

// ── Bedienung ──────────────────────────────────────────
function _n9dRuhe() {
  _n9d.s = -1; _n9d.laeuft = false; _n9d.gestartet = false; _n9d.fertig = false;
  _n9d.ev = {}; _n9d.fx = { teile: [] };
  _n9dKugelnNeu();
}
function _n9dVersuch(v) {
  if (!_n9d || !_N9D_VERSUCH[v]) return;
  _n9d.versuch = v;
  _n9dRuhe();
  _n9dStatus();
}
function _n9dSenden() {
  if (!_n9d || _n9d.laeuft) return;
  _n9dRuhe();
  _n9d.s = 0; _n9d.laeuft = true; _n9d.gestartet = true;
  _n9dStatus();
}
function _n9dNeu() {
  if (!_n9d) return;
  _n9d.versuch = 'normal';
  _n9dRuhe();
  _n9dStatus();
}

// ── Anzeige ────────────────────────────────────────────
function _n9dHinweis() {
  if (_n9d.laeuft) return 'Die Erregung ist unterwegs. Sieh genau auf die Lücke in der Mitte.';
  if (_n9d.fertig) return 'Fertig. Trage „ja“ oder „nein“ in die Tabelle ein. Stelle dann einen anderen Versuch ein.';
  return 'Versuch „' + _N9D_VERSUCH[_n9d.versuch] + '“: Drücke „▶ Erregung senden“.';
}
function _n9dStatus() {
  if (!_n9d) return;
  const el = document.getElementById('_n9d-status');
  if (el) { el.textContent = 'Versuch: ' + _N9D_VERSUCH[_n9d.versuch]; el.className = 'lmp-status on'; }
  const h = document.getElementById('_n9d-hinweis');
  if (h) h.textContent = _n9dHinweis();
  try {
    document.querySelectorAll('[data-n9d]').forEach(b => {
      const v = b.getAttribute('data-n9d');
      if (b.classList) b.classList.toggle('primary', v === _n9d.versuch);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9d-los');
  if (los && los.classList) los.classList.toggle('primary', !_n9d.laeuft);
}
function _n9dHTML() {
  const k = v => `<button class="sim-btn" data-n9d="${v}" onclick="_n9dVersuch('${v}')">${_N9D_VERSUCH[v]}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie kommt die Erregung zur nächsten Zelle?</h3>
    <div class="fpm-note" style="margin-top:2px">Zwei Nervenzellen, stark vergrößert. Links endet eine Nervenfaser, rechts beginnt die nächste Nervenzelle. Der gelbe Lichtpunkt ist die Erregung.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9d-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9d-los" onclick="_n9dSenden()">▶ Erregung senden</button>
          <button class="sim-btn" onclick="_n9dNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Versuch</span>
          <div class="sim-btn-row">${k('normal')}${k('leer')}${k('rechts')}</div>
        </div>
        <div class="lmp-status on" id="_n9d-status" style="margin-top:8px"></div>
        <div class="fpm-note" id="_n9d-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">In der linken Zelle liegen runde Bläschen. Darin sind kleine Kügelchen.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Versuch „normal“ &nbsp;|&nbsp; Alles läuft stark verlangsamt.</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9dUpdate(dt) {
  if (!_n9d) return;
  dt = _bioFxDt(dt);
  _n9d.t += dt;
  if (_n9d.laeuft) {
    _n9d.s += dt;
    _n9dEreignisse();
    if (_n9d.s >= _N9D_ENDE[_n9d.versuch]) {
      _n9d.s = _N9D_ENDE[_n9d.versuch];
      _n9d.laeuft = false; _n9d.fertig = true;
      _n9dStatus();
    }
  }
  _bioFxAlleUpdate(_n9d.fx, dt);
}
// Einmalige Lichtringe im Ablauf – ruhig, nie Funken
function _n9dEreignisse() {
  const s = _n9d.s, v = _n9d.versuch, ev = _n9d.ev, fx = _n9d.fx;
  if (v !== 'rechts' && s >= _N9D_LAUF && !ev.an) {
    ev.an = true;
    _bioFxWelle(fx.teile, _N9D_XL1, _N9D_CY, '#fde047', 24);
  }
  if (v === 'normal') {
    for (const k of _n9d.kugeln) {
      if (!k.fest && s >= k.ts + _N9D_FLUG) {
        k.fest = true;
        const m = _n9d.mulden[k.m];
        _bioFxWelle(fx.teile, m.x, m.y, '#c4b5fd', 10);
      }
    }
    if (s >= _N9D_FEUER && !ev.feuer) {
      ev.feuer = true;
      _bioFxWelle(fx.teile, _N9D_CX + _N9D_RR + 4, _N9D_CY, '#fde047', 40);
    }
  }
  if (v === 'leer' && s >= _N9D_LEERRING && !ev.leer) {
    ev.leer = true;
    _bioFxWelle(fx.teile, _N9D_CX + (_N9D_RB + _N9D_RR) / 2, _N9D_CY, '#94a3b8', 30);
  }
  if (v === 'rechts' && s >= _N9D_LAUF + 0.2 && !ev.aus) {
    ev.aus = true;
    _bioFxWelle(fx.teile, _N9D_XR0, _N9D_CY, '#94a3b8', 26);
  }
}

// ── Zeitplan: was steht zur Zeit s wo? ─────────────────
function _n9dKl(x) { return _bioFxKlemme(x); }
// Wandern (0…1) und Öffnen (0…1) der Bläschen – links nur bei normal und leer
function _n9dWandern() {
  if (_n9d.versuch === 'rechts' || _n9d.s < 0) return 0;
  return _bioFxEase.sanft(_n9dKl((_n9d.s - _N9D_HIN0) / (_N9D_HIN1 - _N9D_HIN0)));
}
function _n9dOffen() {
  if (_n9d.versuch === 'rechts' || _n9d.s < 0) return 0;
  const auf = _bioFxEase.sanft(_n9dKl((_n9d.s - _N9D_AUF0) / (_N9D_AUF1 - _N9D_AUF0)));
  const zu = _bioFxEase.sanft(_n9dKl((_n9d.s - _N9D_ZU0) / (_N9D_ZU1 - _N9D_ZU0)));
  return auf * (1 - zu);
}
// Mitte eines Bläschens jetzt
function _n9dBlPos(i) {
  const b = _N9D_BL[i], z = _n9dZiel(b), w = _n9dWandern(), t = _n9d.t;
  const ruhe = 1 - w;
  return { x: b.x + (z.x - b.x) * w + Math.sin(t * 0.8 + i * 1.7) * 1.1 * ruhe,
           y: b.y + (z.y - b.y) * w + Math.cos(t * 0.7 + i * 2.3) * 1.1 * ruhe,
           a: z.a, r: _N9D_BR - 1 * w };
}
// Lage eines Kügelchens: im Bläschen, im Flug oder in seiner Mulde
function _n9dKugelPos(k) {
  const t = _n9d.t, s = _n9d.s, m = _n9d.mulden[k.m];
  const flug = _n9d.versuch === 'normal' && s >= k.ts;
  if (!flug) {
    const p = _n9dBlPos(k.v);
    return { x: p.x + k.ox + Math.sin(t * 3.1 + k.ph) * 0.8, y: p.y + k.oy + Math.cos(t * 2.7 + k.ph * 1.3) * 0.8, z: 'drin' };
  }
  const u = _n9dKl((s - k.ts) / _N9D_FLUG);
  if (u >= 1) return { x: m.x + Math.sin(t * 2 + k.ph) * 0.3, y: m.y + Math.cos(t * 2.2 + k.ph) * 0.3, z: 'fest' };
  const z = _n9dZiel(_N9D_BL[k.v]);
  const p0x = z.x + k.ox, p0y = z.y + k.oy;
  const p1x = p0x + 16 * Math.cos(z.a), p1y = p0y + 16 * Math.sin(z.a);
  const p2x = m.x - 12 * Math.cos(m.a), p2y = m.y - 12 * Math.sin(m.a);
  const e = _bioFxEase.sanft(u), f = 1 - e;
  let x = f * f * f * p0x + 3 * f * f * e * p1x + 3 * f * e * e * p2x + e * e * e * m.x;
  let y = f * f * f * p0y + 3 * f * f * e * p1y + 3 * f * e * e * p2y + e * e * e * m.y;
  // leichtes Schlingern quer zur Flugrichtung
  const dx = m.x - p0x, dy = m.y - p0y, d = Math.hypot(dx, dy) || 1;
  const w = 2.2 * Math.sin(Math.PI * u) * Math.sin(u * Math.PI * 4 + k.ph);
  x += -dy / d * w; y += dx / d * w;
  return { x, y, z: 'flug' };
}
function _n9dAngedockt() {
  if (_n9d.versuch !== 'normal' || _n9d.s < 0) return 0;
  let n = 0;
  for (const k of _n9d.kugeln) if (_n9d.s >= k.ts + _N9D_FLUG) n++;
  return n;
}
// Leuchten der beiden vorderen Ränder (0…1)
function _n9dGlutL() {
  const s = _n9d.s;
  if (_n9d.versuch === 'rechts' || s < 0) return 0;
  if (s < 1.6) return 0;
  if (s < 1.9) return (s - 1.6) / 0.3;
  if (s < 3.4) return 1;
  return 1 - _n9dKl((s - 3.4) / 1.2);
}
function _n9dGlutR() {
  const s = _n9d.s, v = _n9d.versuch;
  if (s < 0 || v === 'leer') return 0;
  if (v === 'rechts') {
    if (s < 1.6) return 0;
    if (s < 1.9) return 0.9 * (s - 1.6) / 0.3;
    return 0.9 * (1 - _n9dKl((s - 1.9) / 0.7));
  }
  if (s < _N9D_FEUER) return 0.45 * _n9dAngedockt() / _N9D_N;
  if (s < _N9D_FEUER + 0.2) return 0.45 + 0.55 * (s - _N9D_FEUER) / 0.2;
  if (s < 6.4) return 1;
  return 1 - _n9dKl((s - 6.4) / 1.2);
}

// ── Zeichnen ───────────────────────────────────────────
function _n9dPfadLinks(ctx) {
  const ft = { x: _N9D_CX + _N9D_RB * Math.cos(_N9D_AE), y: _N9D_CY - _N9D_RB * Math.sin(_N9D_AE) };
  const fb = { x: ft.x, y: 2 * _N9D_CY - ft.y };
  ctx.beginPath();
  ctx.moveTo(-6, 113); ctx.lineTo(44, 113);
  ctx.bezierCurveTo(70, 113, 74, 40, 126, 35);
  ctx.bezierCurveTo(150, 32, 172, 32, ft.x, ft.y);
  ctx.arc(_N9D_CX, _N9D_CY, _N9D_RB, -_N9D_AE, _N9D_AE, false);
  ctx.bezierCurveTo(172, 218, 150, 218, 126, 215);
  ctx.bezierCurveTo(74, 210, 70, 137, 44, 137);
  ctx.lineTo(-6, 137);
  ctx.closePath();
}
function _n9dPfadRechts(ctx) {
  const rt = { x: _N9D_CX + _N9D_RR * Math.cos(_N9D_AE), y: _N9D_CY - _N9D_RR * Math.sin(_N9D_AE) };
  const rb = { x: rt.x, y: 2 * _N9D_CY - rt.y };
  ctx.beginPath();
  ctx.moveTo(rt.x, rt.y);
  ctx.bezierCurveTo(240, 14, 300, 14, 330, 34);
  ctx.bezierCurveTo(352, 50, 356, 113, 384, 113);
  ctx.lineTo(426, 113); ctx.lineTo(426, 137); ctx.lineTo(384, 137);
  ctx.bezierCurveTo(356, 137, 352, 200, 330, 216);
  ctx.bezierCurveTo(300, 236, 240, 236, rb.x, rb.y);
  ctx.arc(_N9D_CX, _N9D_CY, _N9D_RR, _N9D_AE, -_N9D_AE, true);
  ctx.closePath();
}
// Spur eines Lichtpunkts entlang der Mittellinie
function _n9dSpur(ctx, x0, x1) {
  if (x1 <= x0) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(250,204,21,0.5)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, _N9D_CY); ctx.lineTo(x1, _N9D_CY); ctx.stroke();
  ctx.restore();
}
// Der gelbe Lichtpunkt: a = Deckkraft, k = Größe
function _n9dPunkt(ctx, x, y, a, k) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(x, y, 0, x, y, 16 * k);
  g.addColorStop(0, 'rgba(255,248,196,0.95)');
  g.addColorStop(0.4, 'rgba(253,224,71,0.75)');
  g.addColorStop(1, 'rgba(250,204,21,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 16 * k, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(x, y, 5.5 * k, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = '#fffbe6'; ctx.beginPath(); ctx.arc(x - 1.3 * k, y - 1.3 * k, 2.1 * k, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
function _n9dKugel(ctx, x, y) {
  ctx.fillStyle = '#8b5cf6'; ctx.strokeStyle = '#4c1d95'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(x, y, _N9D_KR, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath(); ctx.arc(x - 0.9, y - 0.9, 0.9, 0, 2 * Math.PI); ctx.fill();
}
// Glut entlang eines vorderen Randbogens
function _n9dGlut(ctx, r, g) {
  if (g <= 0.01) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(250,204,21,' + (0.8 * g).toFixed(3) + ')'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(_N9D_CX, _N9D_CY, r, -_N9D_AE + 0.02, _N9D_AE - 0.02, false); ctx.stroke();
  ctx.restore();
}
function _n9dDraw(ctx, cv) {
  if (!_n9d) return;
  const W = cv.width, H = cv.height, t = _n9d.t, s = _n9d.s, v = _n9d.versuch;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = _N9D_HG; ctx.fillRect(0, 0, W, H);

  // ── die beiden Zellen ──
  _n9dPfadRechts(ctx);
  let g = ctx.createLinearGradient(0, 20, 0, 230);
  g.addColorStop(0, '#dcfce7'); g.addColorStop(1, '#bbf0cf');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#15803d'; ctx.lineWidth = 2; ctx.stroke();
  _n9dPfadLinks(ctx);
  g = ctx.createLinearGradient(0, 30, 0, 220);
  g.addColorStop(0, '#dbeafe'); g.addColorStop(1, '#bfd8f7');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 2; ctx.stroke();

  // ── Spuren der Lichtpunkte (bleiben hell) ──
  if (s >= 0 && v !== 'rechts') {
    _n9dSpur(ctx, 0, Math.min(_N9D_XL1, _N9D_XL0 + (_N9D_XL1 - _N9D_XL0) * s / _N9D_LAUF));
  }
  if (s >= 0 && v === 'normal' && s >= _N9D_R0) {
    const xr = _N9D_XR0 + (_N9D_XR1 - _N9D_XR0) * _n9dKl((s - _N9D_R0) / (_N9D_R1 - _N9D_R0));
    _n9dSpur(ctx, _N9D_XR0, Math.min(420, xr));
  }
  if (s >= 0 && v === 'rechts') {
    const xr = _N9D_XR1 - (_N9D_XR1 - _N9D_XR0) * _n9dKl(s / _N9D_LAUF);
    _n9dSpur(ctx, Math.max(_N9D_XR0, xr), 420);
  }

  // ── Leuchten der vorderen Ränder ──
  _n9dGlut(ctx, _N9D_RB, _n9dGlutL());
  _n9dGlut(ctx, _N9D_RR, _n9dGlutR());

  // ── Mulden am rechten Rand (Kügelchen passen genau hinein) ──
  for (let i = 0; i < _N9D_N; i++) {
    const m = _n9d.mulden[i];
    ctx.fillStyle = _N9D_HG;
    ctx.beginPath(); ctx.arc(m.x, m.y, _N9D_MR + 0.6, 0, 2 * Math.PI); ctx.fill();
    const besetzt = _n9d.kugeln.some(k => k.m === i && v === 'normal' && s >= k.ts + _N9D_FLUG);
    ctx.strokeStyle = besetzt ? '#6d28d9' : '#a78bfa'; ctx.lineWidth = besetzt ? 2.4 : 2;
    ctx.beginPath(); ctx.arc(m.x, m.y, _N9D_MR, m.a - Math.PI / 2, m.a + Math.PI / 2, false); ctx.stroke();
  }

  // ── Bläschen ──
  const o = _n9dOffen(), leer = v === 'leer';
  for (let i = 0; i < _N9D_BL.length; i++) {
    const p = _n9dBlPos(i);
    ctx.save();
    // Inhalt: voll blassviolett, leer grau; beim Öffnen geht er in die Lücke über
    ctx.fillStyle = leer ? 'rgba(229,231,235,' + (1 - 0.7 * o).toFixed(3) + ')'
                         : 'rgba(237,233,254,' + (1 - 0.7 * o).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI); ctx.fill();
    ctx.strokeStyle = leer ? '#9ca3af' : '#7c3aed'; ctx.lineWidth = 1.6;
    const lu = o * 0.8;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, p.a + lu, p.a + 2 * Math.PI - lu, false); ctx.stroke();
    // Öffnung im Zellrand
    if (o > 0.02) {
      const h = Math.asin(7 / _N9D_RB) * o;          // Pore 14 Bildpunkte breit
      ctx.strokeStyle = _N9D_HG; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(_N9D_CX, _N9D_CY, _N9D_RB, p.a - h, p.a + h, false); ctx.stroke();
    }
    ctx.restore();
  }

  // ── Kügelchen: im Bläschen, im Flug, angedockt ──
  if (!leer) {
    for (const k of _n9d.kugeln) {
      const q = _n9dKugelPos(k);
      if (q.z === 'fest') {
        ctx.save();
        ctx.fillStyle = 'rgba(196,181,253,' + (0.35 + 0.15 * Math.sin(t * 2 + k.ph)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(q.x, q.y, _N9D_KR + 2.2, 0, 2 * Math.PI); ctx.fill();
        ctx.restore();
      }
      _n9dKugel(ctx, q.x, q.y);
    }
  }

  // ── Lichtpunkte ──
  if (s >= 0 && v !== 'rechts') {
    if (s < _N9D_LAUF) _n9dPunkt(ctx, _N9D_XL0 + (_N9D_XL1 - _N9D_XL0) * s / _N9D_LAUF, _N9D_CY, 1, 1);
    else if (s < _N9D_LAUF + _N9D_AUS) {
      const u = (s - _N9D_LAUF) / _N9D_AUS;
      _n9dPunkt(ctx, _N9D_XL1, _N9D_CY, 1 - u, 1 - 0.5 * u);
    }
  }
  if (s >= _N9D_R0 && v === 'normal' && s < _N9D_R1) {
    const u = (s - _N9D_R0) / (_N9D_R1 - _N9D_R0);
    _n9dPunkt(ctx, _N9D_XR0 + (_N9D_XR1 - _N9D_XR0) * u, _N9D_CY, 1, 1);
  }
  if (s >= 0 && v === 'rechts') {
    if (s < _N9D_LAUF) _n9dPunkt(ctx, _N9D_XR1 - (_N9D_XR1 - _N9D_XR0) * s / _N9D_LAUF, _N9D_CY, 1, 1);
    else if (s < _N9D_LAUF + _N9D_AUS) {
      const u = (s - _N9D_LAUF) / _N9D_AUS;
      _n9dPunkt(ctx, _N9D_XR0, _N9D_CY, 1 - u, 1 - 0.5 * u);
    }
  }

  // ── Blickführung vor dem Start: ruhiger Lichtkranz, wo die Erregung herkommt ──
  if (!_n9d.gestartet) {
    _bioFxLeuchten(ctx, v === 'rechts' ? 404 : 16, _N9D_CY, 11, t, '255,216,77');
  }

  _bioFxAlleDraw(ctx, _n9d.fx);
}
