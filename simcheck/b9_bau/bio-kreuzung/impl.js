// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · WARUM TAUCHT EIN MERKMAL WIEDER AUF?   (Förderheft Bio 9 · bt3)
// Kennung bio-kreuzung, Präfix _n9p. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bt3.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250, heller Grund, schematisch):
//   - ein Kreuzungsquadrat aus 2 x 2 weißen Feldern (x 204–412, y 102–244);
//   - LINKS eine Elternpflanze auf einer Karte (x 6–200, y 100–246), OBEN die
//     andere (x 204–412, y 4–98). Jede Pflanze: Stängel, zwei Blattpaare,
//     Ranke, weiße Blüte; davor liegt ein Samen in ihrer Farbe (der Samen,
//     aus dem sie wuchs); daneben ihr Name: „gelb“, „grün“ oder „Tochter“.
//   - neben jeder Pflanze GROSS ihre zwei Buchstaben, genau an den Zeilen
//     (links) bzw. Spalten (oben) des Quadrats: G auf gelbem, glattem Kreis,
//     g auf grünem Kreis mit Streifen (Farbe UND Muster UND Größe).
//   - oben links eine Ecke mit „Kreuzung“ und der Einstellung („gelb × grün“).
//   - in jedem leeren Feld gestrichelte Plätze für einen Samen und zwei
//     Buchstaben.
//
// BEDIENUNG (wörtlich): Knopfreihe „Kreuzung“ mit „gelb × grün“ · „gelb ×
//   gelb“ · „Tochter × Tochter“ (_n9pKreuzung) · „▶ 4 Samen bilden“
//   (_n9pBilden) · „neu“ (_n9pNeu, zurück auf den Start „gelb × grün“).
//   Eine andere Kreuzung leert die Felder. „▶ 4 Samen bilden“ ist grau,
//   solange die Samen entstehen; danach baut ein Druck dieselben 4 Samen
//   neu auf (das Modell ist fest, kein Zufall).
//
// ABLAUF JE DRUCK (5,3 s): Feld für Feld in Lesereihenfolge (oben links,
//   oben rechts, unten links, unten rechts), je 1,2 s ab 0,3 s:
//   0,0–0,8  der Buchstabe der LINKEN Pflanze aus dieser Zeile und der
//            Buchstabe der OBEREN Pflanze aus dieser Spalte leuchten kurz auf;
//            je eine Kopie wandert (mit feiner Spur) in das Feld – die linke
//            auf den linken Platz, die obere auf den rechten. Die Eltern
//            behalten ihre Buchstaben.
//   0,8–1,15 zwischen den beiden Buchstaben wächst ein Samen: gelb und glatt,
//            sobald ein G dabei ist, grün mit Streifen nur bei g und g.
//   Ein kurzer Lichtring markiert jeden fertigen Samen.
//
// STATUSZEILE (_n9p-status), immer, wörtlich aus dem Bauplan:
//   „Jede Elternpflanze gibt jedem Samen einen ihrer zwei Buchstaben.“
// HINWEIS (_n9p-hinweis) führt durch die Schritte a–d der Seite:
//   vorher   „Kreuzung: <Einstellung>. Drücke „▶ 4 Samen bilden“.“
//   Lauf     „Sieh genau hin: Welcher Buchstabe kommt von welcher Elternpflanze?“
//   fertig   Zeile 1: „Zähle die grünen Samen. Notiere die Zahl in Zeile 1 der
//            Tabelle.“ – Zeile 2/3: „Lies die Buchstaben neben den
//            Elternpflanzen ab. Zähle die grünen Samen. Notiere beides in
//            Zeile N der Tabelle.“ (Zeile 3 dazu: „Vergleiche dann Zeile 2 und 3.“)
//   KEIN Zähler: Die Zahl der grünen Samen steht nirgends – das Kind zählt.
//
// WERTE (lehrer.tabelle_erwartet, am Bild abzulesen; Modell, kein Zufall):
//   gelb × grün        Eltern G G und g g · Samen Gg Gg Gg Gg · 4 gelb, 0 grün
//   gelb × gelb        Eltern G G und G G · Samen GG GG GG GG · 4 gelb, 0 grün
//   Tochter × Tochter  Eltern G g und G g · Samen GG Gg gG gg · 3 gelb, 1 grün
//   Im Feld (Zeile r, Spalte c) steht links der Buchstabe r der linken
//   Pflanze, rechts der Buchstabe c der oberen.
//
// AHA (_bioFx, ruhig, OHNE Textstreifen, ohne Zahl): nach dem letzten Samen
//   (a) 0,4–1,9 s: jedes kleine g IN DEN FELDERN bekommt einen hellen Ring –
//       bei gelb × grün steckt in jedem gelben Samen ein g;
//   (b) nur Tochter × Tochter, 2,0–5,0 s (getrennt von (a), damit es ruhig
//       bleibt): die beiden g der gelben Tochterpflanzen leuchten, von jedem
//       läuft ein Lichtpunkt mit kurzer Spur in das Feld mit dem grünen Samen
//       (2,1–3,3 s; die Spur verschwindet mit der Ankunft); dort leuchten die
//       beiden g, bei 3,4 s Lichtring und Funken um den grünen Samen, danach
//       ein ruhiger Ring bis 5,0 s. Damit fallen „Grün ist verschwunden“ und
//       „die Hälfte“ sichtbar.
//   Vor dem ersten Druck pulsieren die vier Eltern-Buchstaben ruhig (0,8 Hz).
//
// NICHT AM BILDSCHIRM: die Lückenwörter aus Merksatz und Aufgabe 2 und die
//   Fachwörter, die sim_plan.anzeigen ausschließt. Keine Zahl grüner Samen.
// ═══════════════════════════════════════════════════════════════════════
let _n9p = null;
const _N9P_KREUZ = {
  'gelb-gruen': { name: 'gelb × grün', zeile: 1,
                  links: { name: 'gelb', b: ['G', 'G'] }, oben: { name: 'grün', b: ['g', 'g'] } },
  'gelb-gelb':  { name: 'gelb × gelb', zeile: 2,
                  links: { name: 'gelb', b: ['G', 'G'] }, oben: { name: 'gelb', b: ['G', 'G'] } },
  'tochter':    { name: 'Tochter × Tochter', zeile: 3,
                  links: { name: 'Tochter', b: ['G', 'g'] }, oben: { name: 'Tochter', b: ['G', 'g'] } }
};
const _N9P_REIHE = ['gelb-gruen', 'gelb-gelb', 'tochter'];
const _N9P_START = 'gelb-gruen';
// Kreuzungsquadrat: linke obere Ecke, Feldbreite, Feldhöhe
const _N9P_GX = 204, _N9P_GY = 102, _N9P_ZW = 104, _N9P_ZH = 71;
const _N9P_OY = 80;                                // Buchstaben der oberen Pflanze (y)
const _N9P_LX = 172;                               // Buchstaben der linken Pflanze (x)
const _N9P_RP = 15, _N9P_RF = 10, _N9P_RS = 14;    // Radien: Buchstabe an der Pflanze, im Feld; Samen
// Pflanzen: Fuß (x, y) und Höhe
const _N9P_PO = { x: 308, y: 56 }, _N9P_PL = { x: 62, y: 190 }, _N9P_PH = 44;
// Ablauf: Feld k beginnt bei VOR + k * FELD; die Buchstaben wandern WEG s, dann wächst der Samen
const _N9P_VOR = 0.3, _N9P_FELD = 1.2, _N9P_WEG = 0.8, _N9P_WACHS = 0.35;
const _N9P_ENDE = _N9P_VOR + 4 * _N9P_FELD + 0.2;  // 5,3 s
const _N9P_NACHENDE = 5.4;
const _N9P_HG = '#eef4ee';
// Buchstabenkreise: Fläche, Rand, Schrift (grün zusätzlich: Streifen)
const _N9P_GELB = ['#fde047', '#a16207', '#3b2604'];
const _N9P_GRUEN = ['#86efac', '#15803d', '#052e16', '#16a34a'];
const _N9P_RING = '#f59e0b';

function _n9pKl(x) { return _bioFxKlemme(x); }
function _n9pE(x) { return _bioFxEase.sanft(_bioFxKlemme(x)); }
function _n9pK() { return _N9P_KREUZ[_n9p.k]; }
function _n9pMitte(r, c) { return { x: _N9P_GX + (c + 0.5) * _N9P_ZW, y: _N9P_GY + (r + 0.5) * _N9P_ZH }; }
function _n9pOben(c) { return { x: _N9P_GX + (c + 0.5) * _N9P_ZW, y: _N9P_OY }; }
function _n9pLinks(r) { return { x: _N9P_LX, y: _N9P_GY + (r + 0.5) * _N9P_ZH }; }
// Feld k (0..3) in Lesereihenfolge: Zeile, Spalte, Buchstaben, Lage von Samen und Plätzen
function _n9pFeld(k) {
  const r = Math.floor(k / 2), c = k % 2, K = _n9pK(), m = _n9pMitte(r, c);
  const a = K.links.b[r], b = K.oben.b[c];
  return { r, c, m, a, b, gruen: a === 'g' && b === 'g',
           samen: { x: m.x, y: m.y - 11 },
           pa: { x: m.x - 16, y: m.y + 19 }, pb: { x: m.x + 16, y: m.y + 19 } };
}
function _n9pStartZeit(k) { return _N9P_VOR + k * _N9P_FELD; }

function _n9pInit() {
  _n9p = { t: 0, k: _N9P_START };
  _n9pAnfang();
}
// Leere Felder, nichts läuft
function _n9pAnfang() {
  _n9p.laeuft = false; _n9p.fertig = false; _n9p.s = 0; _n9p.nach = -1;
  _n9p.gesetzt = 0; _n9p.funken = false; _n9p.fx = { teile: [] };
}

// ── Bedienung ──────────────────────────────────────────
function _n9pKreuzung(k) {
  if (!_n9p || !_N9P_KREUZ[k]) return;
  _n9p.k = k;
  _n9pAnfang();
  _n9pStatus();
}
function _n9pBilden() {
  if (!_n9p || _n9p.laeuft) return;
  _n9pAnfang();
  _n9p.laeuft = true;
  _n9pStatus();
}
function _n9pNeu() {
  if (!_n9p) return;
  _n9p.k = _N9P_START;
  _n9pAnfang();
  _n9pStatus();
}

// ── Anzeige ────────────────────────────────────────────
function _n9pZeile() {
  return 'Jede Elternpflanze gibt jedem Samen einen ihrer zwei Buchstaben.';
}
function _n9pHinweis() {
  const K = _n9pK();
  if (_n9p.laeuft) return 'Sieh genau hin: Welcher Buchstabe kommt von welcher Elternpflanze?';
  if (!_n9p.fertig) return 'Kreuzung: ' + K.name + '. Drücke „▶ 4 Samen bilden“.';
  if (K.zeile === 1) return 'Zähle die grünen Samen. Notiere die Zahl in Zeile 1 der Tabelle.';
  let s = 'Lies die Buchstaben neben den Elternpflanzen ab. Zähle die grünen Samen. '
        + 'Notiere beides in Zeile ' + K.zeile + ' der Tabelle.';
  if (K.zeile === 3) s += ' Vergleiche dann Zeile 2 und 3.';
  return s;
}
function _n9pStatus() {
  if (!_n9p) return;
  const el = document.getElementById('_n9p-status');
  if (el) { el.textContent = _n9pZeile(); el.className = 'lmp-status on'; }
  const h = document.getElementById('_n9p-hinweis');
  if (h) h.textContent = _n9pHinweis();
  const los = document.getElementById('_n9p-los');
  if (los) {
    los.disabled = _n9p.laeuft;
    try { if (los.classList) los.classList.toggle('primary', !_n9p.laeuft); } catch (e) { /* Knopffarbe ist Beiwerk */ }
  }
  try {
    document.querySelectorAll('[data-n9p]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9p') === _n9p.k);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
}
function _n9pHTML() {
  const k = (v) => `<button class="sim-btn${v === _n9p.k ? ' primary' : ''}" data-n9p="${v}" onclick="_n9pKreuzung('${v}')">${_N9P_KREUZ[v].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Warum taucht ein Merkmal wieder auf?</h3>
    <div class="fpm-note" style="margin-top:2px">Ein Kreuzungsquadrat: links eine Elternpflanze, oben die andere. In den 4 Feldern entstehen 4 Samen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9p-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="phys-ctrl" style="margin-top:6px">
          <span class="phys-ctrl-label">Kreuzung</span>
          <div class="sim-btn-row">${_N9P_REIHE.map(k).join('')}</div>
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9p-los" onclick="_n9pBilden()">▶ 4 Samen bilden</button>
          <button class="sim-btn" onclick="_n9pNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="lmp-status on" id="_n9p-status"></div>
        <div class="fpm-note" id="_n9p-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Großes G: gelber, glatter Kreis. Kleines g: grüner Kreis mit Streifen.</div>
        <div class="fpm-note" style="margin-top:6px">Tochter: eine Pflanze aus einem gelben Samen von gelb × grün.</div>
        <div class="fpm-note" style="margin-top:6px">Das Quadrat ist ein Modell. Echte Erbsen bilden viel mehr Samen.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Kreuzung gelb × grün &nbsp;|&nbsp; 4 Samen entstehen in etwa 5 Sekunden.</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9pUpdate(dt) {
  if (!_n9p) return;
  dt = _bioFxDt(dt);
  _n9p.t += dt;
  if (_n9p.laeuft) {
    _n9p.s += dt;
    // ein Samen ist ausgewachsen: kurzer Lichtring
    while (_n9p.gesetzt < 4 && _n9p.s >= _n9pStartZeit(_n9p.gesetzt) + _N9P_WEG + _N9P_WACHS) {
      const f = _n9pFeld(_n9p.gesetzt);
      _bioFxWelle(_n9p.fx.teile, f.samen.x, f.samen.y, f.gruen ? '#86efac' : '#fde68a', 24);
      _n9p.gesetzt++;
    }
    if (_n9p.s >= _N9P_ENDE) {
      _n9p.laeuft = false; _n9p.fertig = true; _n9p.nach = 0;
      _n9pStatus();
    }
  } else if (_n9p.nach >= 0) {
    _n9p.nach += dt;
    _n9pNachher();
    if (_n9p.nach > _N9P_NACHENDE) _n9p.nach = -1;
  }
  _bioFxAlleUpdate(_n9p.fx, dt);
}
// Nach dem letzten Samen: Funken am grünen Samen (nur wo g und g zusammentreffen)
function _n9pNachher() {
  if (_n9p.funken || _n9p.nach < 3.4) return;
  _n9p.funken = true;
  for (let k = 0; k < 4; k++) {
    const f = _n9pFeld(k);
    if (!f.gruen) continue;
    _bioFxWelle(_n9p.fx.teile, f.samen.x, f.samen.y, '#4ade80', 28);
    _bioFxFunken(_n9p.fx.teile, f.samen.x, f.samen.y, 6, ['#bbf7d0', '#ffffff', '#fde68a']);
  }
}
// Stand eines Feldes: u = Weg der Buchstaben (0..1), g = Wachsen des Samens (0..1)
function _n9pStand(k) {
  if (_n9p.fertig) return { u: 1, g: 1, an: true };
  if (!_n9p.laeuft) return { u: 0, g: 0, an: false };
  const a = _n9pStartZeit(k), s = _n9p.s;
  return { u: _n9pKl((s - a) / _N9P_WEG), g: _n9pKl((s - a - _N9P_WEG) / _N9P_WACHS), an: s >= a };
}
// Leuchten eines Eltern-Buchstabens (seite 'links' Zeile i, 'oben' Spalte i)
function _n9pElternGlanz(seite, i) {
  if (!_n9p.laeuft && !_n9p.fertig) return 0.25 + 0.2 * Math.sin(_n9p.t * Math.PI * 2 * 0.8);
  let g = 0;
  if (_n9p.laeuft) {
    for (let k = 0; k < 4; k++) {
      if ((seite === 'links' ? Math.floor(k / 2) : k % 2) !== i) continue;
      const u = (_n9p.s - _n9pStartZeit(k) + 0.15) / 0.5;
      if (u > 0 && u < 1) g = Math.max(g, 0.9 * Math.sin(Math.PI * u));
    }
  }
  // Aha (b): die g der Eltern, deren Kopien sich im grünen Samen treffen
  const n = _n9p.nach;
  if (n > 2.0 && n < 5.0) {
    const K = _n9pK(), P = seite === 'links' ? K.links : K.oben;
    let traegt = false;
    for (let k = 0; k < 4; k++) {
      const f = _n9pFeld(k);
      if (f.gruen && (seite === 'links' ? f.r : f.c) === i) traegt = true;
    }
    if (traegt && P.b[i] === 'g') g = Math.max(g, 0.85 * _n9pKl((n - 2.0) / 0.3) * (1 - _n9pKl((n - 3.2) / 0.5)));
  }
  return g;
}

// ── Zeichnen ───────────────────────────────────────────
// Drei schräge Streifen als Sehnen – ohne clip(), bleibt im Kreis
function _n9pStreifen(ctx, x, y, r, farbe, lw) {
  const w = -Math.PI / 4, dx = Math.cos(w), dy = Math.sin(w), nx = -dy, ny = dx;
  ctx.save();
  ctx.strokeStyle = farbe; ctx.lineWidth = lw; ctx.lineCap = 'butt';
  for (const d of [-0.5, 0, 0.5]) {
    const o = d * r, h = Math.sqrt(Math.max(0, r * r * 0.9 - o * o));
    const cx = x + nx * o, cy = y + ny * o;
    ctx.beginPath(); ctx.moveTo(cx - dx * h, cy - dy * h); ctx.lineTo(cx + dx * h, cy + dy * h); ctx.stroke();
  }
  ctx.restore();
}
// Ein Buchstabe auf seinem Kreis: G gelb und glatt, g grün mit Streifen
function _n9pBuchstabe(ctx, x, y, r, z) {
  const gr = z === 'g', f = gr ? _N9P_GRUEN : _N9P_GELB;
  ctx.save();
  ctx.fillStyle = f[0];
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
  if (gr) _n9pStreifen(ctx, x, y, r, f[3], Math.max(1.2, r * 0.15));
  ctx.strokeStyle = f[1]; ctx.lineWidth = Math.max(1.5, r * 0.13);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();
  ctx.font = '700 ' + Math.round(r * 1.3) + 'px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const ty = y + (gr ? -r * 0.14 : r * 0.04);
  if (gr) {                                        // heller Saum, damit das g auf den Streifen lesbar bleibt
    ctx.strokeStyle = '#dcfce7'; ctx.lineWidth = Math.max(2, r * 0.22); ctx.lineJoin = 'round';
    ctx.strokeText(z, x, ty);
  }
  ctx.fillStyle = f[2];
  ctx.fillText(z, x, ty);
  ctx.restore();
}
// Ein Erbsensamen: gelb und glatt oder grün mit Streifen
function _n9pSamen(ctx, x, y, r, gruen) {
  if (r < 0.5) return;
  ctx.save();
  ctx.fillStyle = gruen ? '#4ade80' : '#facc15';
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
  if (gruen) _n9pStreifen(ctx, x, y, r, '#15803d', Math.max(1, r * 0.16));
  ctx.strokeStyle = gruen ? '#166534' : '#a16207'; ctx.lineWidth = Math.max(1.2, r * 0.11);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath(); ctx.ellipse(x - r * 0.36, y - r * 0.4, r * 0.28, r * 0.17, -0.6, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
// Gestrichelter Platz in einem leeren Feld
function _n9pPlatz(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.3; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();
  ctx.restore();
}
function _n9pRing(ctx, x, y, r, a) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = _N9P_RING; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();
  ctx.restore();
}
// Erbsenpflanze, schematisch; wiegt sich leicht
function _n9pPflanze(ctx, x, yb, h, t, ph) {
  const sw = 2.0 * Math.sin(t * 1.1 + ph);
  const at = (q) => ({ x: x + sw * q * q, y: yb - h * q });
  ctx.save();
  ctx.fillStyle = '#b08a63';
  ctx.beginPath(); ctx.ellipse(x, yb + 2, 17, 4, 0, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = '#3f7d3a'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, yb);
  for (let i = 1; i <= 10; i++) { const p = at(i / 10 * 0.86); ctx.lineTo(p.x, p.y); }
  ctx.stroke();
  for (const [q, s] of [[0.28, 1], [0.56, 0.82]]) {
    const p = at(q);
    for (const sd of [-1, 1]) {
      ctx.fillStyle = '#6aa95c'; ctx.strokeStyle = '#2f6b2b'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(p.x + sd * 8 * s, p.y - 3 * s, 8.5 * s, 4 * s, sd * -0.45, 0, 2 * Math.PI);
      ctx.fill(); ctx.stroke();
    }
  }
  const r0 = at(0.72);                              // Ranke
  ctx.strokeStyle = '#4d8f45'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(r0.x, r0.y);
  ctx.quadraticCurveTo(r0.x + 9, r0.y - 7, r0.x + 11, r0.y - 1);
  ctx.quadraticCurveTo(r0.x + 12, r0.y + 3, r0.x + 8, r0.y + 2);
  ctx.stroke();
  const b = at(0.92);                               // weiße Blüte
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(b.x, b.y - 2, 7, 6, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(b.x - 4, b.y + 3, 4.5, 3.2, -0.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(b.x + 4, b.y + 3, 4.5, 3.2, 0.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#6aa95c';
  ctx.beginPath(); ctx.ellipse(b.x, b.y + 6.5, 3, 2, 0, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
// Elternpflanze mit dem Samen, aus dem sie wuchs, und ihrem Namen
function _n9pElternpflanze(ctx, fuss, P, t, ph) {
  _n9pPflanze(ctx, fuss.x, fuss.y, _N9P_PH, t, ph);
  _n9pSamen(ctx, fuss.x + 15, fuss.y - 1, 7.5, P.b.indexOf('G') < 0);
  ctx.save();
  ctx.fillStyle = '#0f172a'; ctx.font = '700 13px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(P.name, fuss.x + 30, fuss.y - 18);
  ctx.restore();
}
function _n9pKarte(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.72)'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x, y, w, h, 10); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Ecke oben links: Name der Einstellung
function _n9pEcke(ctx, K) {
  _n9pKarte(ctx, 6, 4, 194, 92);
  ctx.save();
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#475569'; ctx.font = '600 12px sans-serif';
  ctx.fillText('Kreuzung', 103, 38);
  ctx.fillStyle = '#0f172a'; ctx.font = '700 16px sans-serif';
  ctx.fillText(K.name, 103, 64);
  ctx.restore();
}
function _n9pFeldZeichnen(ctx, k) {
  const f = _n9pFeld(k), st = _n9pStand(k), m = f.m;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, m.x - _N9P_ZW / 2 + 3, m.y - _N9P_ZH / 2 + 3, _N9P_ZW - 6, _N9P_ZH - 6, 8);
  ctx.fill(); ctx.stroke();
  ctx.restore();
  if (st.g <= 0) _n9pPlatz(ctx, f.samen.x, f.samen.y, _N9P_RS);
  if (st.u < 1) {
    _n9pPlatz(ctx, f.pa.x, f.pa.y, _N9P_RF);
    _n9pPlatz(ctx, f.pb.x, f.pb.y, _N9P_RF);
  } else {
    _n9pBuchstabe(ctx, f.pa.x, f.pa.y, _N9P_RF, f.a);
    _n9pBuchstabe(ctx, f.pb.x, f.pb.y, _N9P_RF, f.b);
  }
  if (st.g > 0) _n9pSamen(ctx, f.samen.x, f.samen.y, _N9P_RS * Math.max(0, _bioFxEase.federn(st.g)), f.gruen);
}
// Buchstaben, die gerade von den Eltern in ein Feld wandern (mit feiner Spur)
function _n9pWandern(ctx) {
  if (!_n9p.laeuft) return;
  for (let k = 0; k < 4; k++) {
    const st = _n9pStand(k);
    if (!st.an || st.u >= 1) continue;
    const f = _n9pFeld(k), e = _n9pE(st.u);
    const r = _N9P_RP + (_N9P_RF - _N9P_RP) * e;
    const wege = [[_n9pLinks(f.r), f.pa, f.a], [_n9pOben(f.c), f.pb, f.b]];
    for (const [von, nach, z] of wege) {
      const x = von.x + (nach.x - von.x) * e, y = von.y + (nach.y - von.y) * e;
      ctx.save();
      ctx.globalAlpha = 0.55; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.4; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(von.x, von.y); ctx.lineTo(x, y); ctx.stroke();
      ctx.restore();
      _n9pBuchstabe(ctx, x, y, r, z);
    }
  }
}
// Aha nach dem letzten Samen (siehe Kopf)
function _n9pAha(ctx) {
  const n = _n9p.nach;
  if (n < 0) return;
  // (a) jedes kleine g in den Feldern
  const a1 = n > 0.4 && n < 1.9 ? Math.sin(Math.PI * (n - 0.4) / 1.5) : 0;
  if (a1 > 0.01) {
    for (let k = 0; k < 4; k++) {
      const f = _n9pFeld(k);
      if (f.a === 'g') _n9pRing(ctx, f.pa.x, f.pa.y, _N9P_RF + 4, 0.9 * a1);
      if (f.b === 'g') _n9pRing(ctx, f.pb.x, f.pb.y, _N9P_RF + 4, 0.9 * a1);
    }
  }
  // (b) von den g der Eltern je ein Lichtpunkt zum grünen Samen
  if (n <= 2.0 || n >= 5.0) return;
  const u = _n9pE((n - 2.1) / 1.2);
  const aus = 1 - _n9pKl((n - 4.4) / 0.6);
  for (let k = 0; k < 4; k++) {
    const f = _n9pFeld(k);
    if (!f.gruen) continue;
    for (const [von, nach] of [[_n9pLinks(f.r), f.pa], [_n9pOben(f.c), f.pb]]) {
      if (u > 0 && u < 1) {
        const x = von.x + (nach.x - von.x) * u, y = von.y + (nach.y - von.y) * u;
        const ux = von.x + (nach.x - von.x) * Math.max(0, u - 0.3), uy = von.y + (nach.y - von.y) * Math.max(0, u - 0.3);
        ctx.save();
        ctx.globalAlpha = 0.6; ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(ux, uy); ctx.lineTo(x, y); ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.fillStyle = 'rgba(253,230,138,0.55)';
        ctx.beginPath(); ctx.arc(x, y, 9, 0, 2 * Math.PI); ctx.fill();
        ctx.fillStyle = '#fef9c3'; ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      // angekommen: die beiden g im Feld leuchten
      if (n > 3.2) _n9pRing(ctx, nach.x, nach.y, _N9P_RF + 4, 0.9 * _n9pKl((n - 3.2) / 0.3) * aus);
    }
    if (n > 3.4) _n9pRing(ctx, f.samen.x, f.samen.y, _N9P_RS + 5, aus * (0.6 + 0.3 * Math.sin((n - 3.4) * Math.PI * 2 * 0.8)));
  }
}
function _n9pDraw(ctx, cv) {
  if (!_n9p) return;
  const W = cv.width, H = cv.height, t = _n9p.t, K = _n9pK();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = _N9P_HG; ctx.fillRect(0, 0, W, H);
  _n9pEcke(ctx, K);
  _n9pKarte(ctx, 204, 4, 208, 94);
  _n9pKarte(ctx, 6, 100, 194, 146);
  _n9pElternpflanze(ctx, _N9P_PO, K.oben, t, 0);
  _n9pElternpflanze(ctx, _N9P_PL, K.links, t, 1.7);
  for (let k = 0; k < 4; k++) _n9pFeldZeichnen(ctx, k);
  for (let i = 0; i < 2; i++) {
    const L = _n9pLinks(i), O = _n9pOben(i);
    _n9pRing(ctx, L.x, L.y, _N9P_RP + 4, _n9pElternGlanz('links', i));
    _n9pRing(ctx, O.x, O.y, _N9P_RP + 4, _n9pElternGlanz('oben', i));
    _n9pBuchstabe(ctx, L.x, L.y, _N9P_RP, K.links.b[i]);
    _n9pBuchstabe(ctx, O.x, O.y, _N9P_RP, K.oben.b[i]);
  }
  _n9pWandern(ctx);
  _n9pAha(ctx);
  _bioFxAlleDraw(ctx, _n9p.fx);
}
