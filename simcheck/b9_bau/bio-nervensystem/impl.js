// ════════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER – br1 „Ein Netz durch den ganzen Körper“
// Kennung bio-nervensystem, Präfix _n9a.
// Bauplan: arbeitsheft_bio_foe9/einheiten/br1.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250): Lina von hinten als heller Umriss
// (Shirt, kurze Hose, barfuß) vor dunklem Grund, unten ein Kiesweg. In ihr
// gedämpft gelb: im Kopf ein Organ, ein Strang in der Wirbelsäule (die Wirbel
// als kleine helle Plättchen), dünne Nerven in Arme und Beine, kurze Seitenäste
// am Rumpf. KEINES der Teile ist beschriftet – die Kinder ordnen die Teile mit den
// Sätzen aus dem Problem selbst zu.
// Am gewählten Ort liegt der Reiz: ein spitzer Stein unter dem rechten Fuß
// („Fuß“, „Fuß, betäubt“) oder ein Kaktus an der rechten Hand („Hand“).
// Von hinten gesehen ist rechts im Bild auch Linas rechte Seite.
// Bei „Fuß, betäubt“ liegt am rechten Knie eine grau markierte Stelle über dem
// Nerv.
//
// BEDIENUNG (wörtlich):
//   „Reiz an“: „Fuß“ · „Hand“ · „Fuß, betäubt“    _n9aReiz('fuss'|'hand'|'betaeubt')
//   „▶ Reiz auslösen“ (_n9aLos) · „neu“ (_n9aNeu: zurück auf „Fuß“, kein Weg leuchtet)
//   Sprungmarken „Fuß: Ergebnis“ · „Hand: Ergebnis“ · „Fuß, betäubt: Ergebnis“
//   (_n9aMarke) zeigen sofort das Endbild – genau den Zustand nach dem Lauf.
//
// ABLAUF nach „▶ Reiz auslösen“: 0,4 s Berührung (heller Ring am Reizort,
// der Lichtpunkt wächst dort heran), dann läuft er mit 68 Bildpunkten je
// Sekunde den Weg entlang; jedes Stück, das er erreicht hat, bleibt hell.
//   Fuß:   Nerv im Bein hinauf, am unteren Rücken in den Strang, darin von
//          unten nach oben, dann in den Kopf (3,1 s Lauf).
//   Hand:  Nerv im Arm hinauf, oben am Hals in den Strang, dann in den Kopf
//          (2,4 s Lauf). Der Strang unterhalb des Halses bleibt dunkel.
//   Erst wenn der Punkt im Kopf ankommt: Lichtring, das Organ im Kopf leuchtet,
//   Sprechblase „Au!“.
//   Fuß, betäubt: der Punkt läuft nur bis zur grauen Stelle am Knie, bleibt
//   stehen und verblasst. Strang und Kopf bleiben dunkel, keine Sprechblase.
//
// STATUSZEILEN (wörtlich):
//   _n9a-status   „Reiz an: Fuß · noch nicht ausgelöst“
//                 „Reiz an: Fuß · Der Lichtpunkt läuft …“
//                 „Reiz an: Fuß · Der Weg leuchtet. Lina ruft „Au!““
//                 „Reiz an: Hand · Der Weg leuchtet. Lina ruft „Au!““
//                 „Reiz an: Fuß, betäubt · Der Weg leuchtet nur bis zur grauen
//                  Stelle. Lina ruft nicht „Au!“.“
//   _n9a-info     nur bei „Fuß, betäubt“: „Eine Ärztin hat den Nerv am Knie betäubt.“
//   _n9a-hinweis  Bedienhinweis je Phase (ohne Lückenwörter).
//
// HEFT ↔ BILDSCHIRM (lehrer.tabelle_erwartet):
//   Zeile 1 Fuß           ja   – heller Weg Bein → Strang → Kopf, Sprechblase
//   Zeile 2 Hand          ja   – heller Weg Arm → Strang (ab Hals) → Kopf, Sprechblase
//   Zeile 3 Fuß, betäubt  nein – heller Weg nur bis zur grauen Stelle; die
//                                Infozeile nennt das Knie; keine Sprechblase
//
// AHA (_bioFx, ruhig): Lichtring, wenn der Punkt in den Strang tritt, die
//   Wirbel um den Punkt leuchten mit (er läuft IN der Wirbelsäule, nicht am
//   Rücken vorbei); „Au!“ erst bei Ankunft im Kopf, nicht bei der Berührung;
//   bei Betäubung grauer Ring an der Stelle, der Kopf bleibt dunkel.
//
// NICHT AM BILDSCHIRM: Beschriftungen der Körperteile und die Lückenwörter aus
//   Merksatz und Aufgabe 2 (siehe sim_plan.anzeigen, letzter Eintrag). Keine
//   Wertung, kein Gesicht (Lina ist von hinten zu sehen).
// ════════════════════════════════════════════════════════════════════════
let _n9a = null;
let _n9aWege = null;                                   // einmal ausgerechnet
const _N9A_NAME = { fuss: 'Fuß', hand: 'Hand', betaeubt: 'Fuß, betäubt' };
const _N9A_V = 68;                                     // Lichtpunkt: Bildpunkte je Sekunde
const _N9A_REIZ = 0.4;                                 // s Berührung, bevor er losläuft
const _N9A_INFO = 'Eine Ärztin hat den Nerv am Knie betäubt.';
// Wege vom Reizort bis in die Mitte des Kopfes (rechte Körperseite).
// Index 7 ist jeweils der Eintritt in den Strang, ab Index 8 geht es in den Kopf.
const _N9A_BEIN = [[220, 236], [219, 227], [219, 212], [218, 196], [216, 178], [213, 162], [207, 152], [200, 146]];
const _N9A_ARM  = [[265, 161], [262, 150], [256, 131], [250, 112], [240, 92], [228, 74], [212, 68], [200, 68]];
const _N9A_KOPF = [[200, 50], [200, 44], [200, 29]];
const _N9A_KNIE = 3;                                   // Index des Knies in _N9A_BEIN
const _N9A_VOR_KNIE = 8;                               // so weit vor dem Knie bleibt der Punkt stehen
// Farben
const _N9A_F = {
  grund0: '#22304d', grund1: '#162036', weg: '#4a4339',
  haut: '#5d6e8f', rand: '#e2e8f0', shirt: '#4a69a3', hose: '#36435e',
  dim: '#e2c656', hell: '#ffe14d', schein: 'rgba(255,225,77,0.30)'
};

// ── Wege ──────────────────────────────────────────────────────────────────
function _n9aBau(pk) {
  const L = [0];
  for (let i = 1; i < pk.length; i++)
    L.push(L[i - 1] + Math.hypot(pk[i][0] - pk[i - 1][0], pk[i][1] - pk[i - 1][1]));
  return { p: pk, L, len: L[L.length - 1], ein: L[7], kopf: L[9], block: L[_N9A_KNIE] - _N9A_VOR_KNIE };
}
function _n9aWeg() {
  if (!_n9aWege) _n9aWege = { bein: _n9aBau(_N9A_BEIN.concat(_N9A_KOPF)),
                              arm: _n9aBau(_N9A_ARM.concat(_N9A_KOPF)) };
  return _n9a && _n9a.reiz === 'hand' ? _n9aWege.arm : _n9aWege.bein;
}
// Punkt auf dem Weg nach s Bildpunkten
function _n9aPunkt(w, s) {
  const p = w.p, L = w.L;
  if (s <= 0) return p[0].slice();
  for (let i = 1; i < p.length; i++) {
    if (s <= L[i]) {
      const u = (s - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
      return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * u, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * u];
    }
  }
  return p[p.length - 1].slice();
}
// Berührungsstelle des Reizes
function _n9aKontakt() { return _n9a.reiz === 'hand' ? [271, 160] : [221, 237]; }
function _n9aSp(p) { return [400 - p[0], p[1]]; }       // an der Körpermitte spiegeln

// ── Zustand und Bedienung ─────────────────────────────────────────────────
function _n9aInit() {
  _n9a = { reiz: 'fuss', phase: 'bereit', s: 0, p: 0, t: 0, nach: -1, au: -1,
           ein: false, stopp: false, ring2: false, fx: { teile: [] }, letzt: '' };
}
// Gleiche Einstellung, Bild wieder dunkel
function _n9aZurueck() {
  const z = _n9a;
  z.phase = 'bereit'; z.s = 0; z.p = 0; z.nach = -1; z.au = -1;
  z.ein = false; z.stopp = false; z.ring2 = false; z.fx = { teile: [] };
}
function _n9aReiz(v) {
  if (!_n9a || !_N9A_NAME[v]) return;
  _n9a.reiz = v;
  _n9aZurueck();
  _n9aStatus();
}
function _n9aLos() {
  if (!_n9a || _n9a.phase === 'reiz' || _n9a.phase === 'lauf') return;
  _n9aZurueck();
  _n9a.phase = 'reiz';
  const k = _n9aKontakt();
  _bioFxWelle(_n9a.fx.teile, k[0], k[1], '#f8fafc', 16);       // Berührung: ruhiger Ring
  _n9aStatus();
}
function _n9aNeu() {
  if (!_n9a) return;
  _n9a.reiz = 'fuss';
  _n9aZurueck();
  _n9aStatus();
}
// Sprungmarke: Reiz wählen und gleich das Endbild zeigen
function _n9aMarke(v) {
  if (!_n9a || !_N9A_NAME[v]) return;
  _n9a.reiz = v;
  _n9aZurueck();
  const w = _n9aWeg();
  _n9a.ein = v !== 'betaeubt';
  _n9a.s = v === 'betaeubt' ? w.block : w.len;
  _n9aAnkommen();
}
// Der Punkt ist am Ende seines Weges (Kopf) oder an der betäubten Stelle.
function _n9aAnkommen() {
  const z = _n9a, w = _n9aWeg();
  z.phase = 'fertig'; z.nach = 0;
  if (z.reiz === 'betaeubt') {
    z.stopp = true;
    const k = _n9aPunkt(w, w.block);
    _bioFxWelle(z.fx.teile, k[0], k[1], '#cbd5e1', 22);
  } else {
    z.au = 0;
    const k = w.p[w.p.length - 1];
    _bioFxWelle(z.fx.teile, k[0], k[1], '#ffe066', 34);
    _bioFxWelle(z.fx.teile, k[0], k[1], '#fff3b0', 22);
  }
  _n9aStatus();
}

// ── Anzeige ───────────────────────────────────────────────────────────────
function _n9aZeile() {
  const z = _n9a, s = 'Reiz an: ' + _N9A_NAME[z.reiz] + ' · ';
  if (z.phase === 'bereit') return s + 'noch nicht ausgelöst';
  if (z.phase !== 'fertig') return s + 'Der Lichtpunkt läuft …';
  if (z.reiz === 'betaeubt') return s + 'Der Weg leuchtet nur bis zur grauen Stelle. Lina ruft nicht „Au!“.';
  return s + 'Der Weg leuchtet. Lina ruft „Au!“';
}
function _n9aStatus() {
  if (!_n9a) return;
  const z = _n9a, zeile = _n9aZeile();
  z.letzt = zeile;
  const el = document.getElementById('_n9a-status');
  if (el) { el.textContent = zeile; el.className = 'lmp-status on'; }
  const inf = document.getElementById('_n9a-info');
  if (inf) {
    const txt = z.reiz === 'betaeubt' ? _N9A_INFO : '';
    inf.textContent = txt;
    if (inf.style) inf.style.display = txt ? '' : 'none';
  }
  const h = document.getElementById('_n9a-hinweis');
  if (h) {
    if (z.phase === 'bereit') h.textContent = 'Drücke „▶ Reiz auslösen“. Sieh dann genau auf den gelben Lichtpunkt.';
    else if (z.phase !== 'fertig') h.textContent = 'Fahre den Weg des Lichtpunkts mit dem Finger nach.';
    else h.textContent = 'Sieh dir den hellen Weg genau an. Stelle dann bei „Reiz an“ etwas anderes ein.';
  }
  try {
    document.querySelectorAll('[data-n9a]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9a') === z.reiz);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9a-los');
  if (los && los.classList) los.classList.toggle('primary', z.phase === 'bereit' || z.phase === 'fertig');
}
function _n9aHTML() {
  const k = v => `<button class="sim-btn${v === 'fuss' ? ' primary' : ''}" data-n9a="${v}" onclick="_n9aReiz('${v}')">${_N9A_NAME[v]}</button>`;
  const m = v => `<button class="sim-btn" onclick="_n9aMarke('${v}')">${_N9A_NAME[v]}: Ergebnis</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welchen Weg nimmt das Signal?</h3>
    <div class="fpm-note" style="margin-top:2px">Lina von hinten. Gelb gezeichnet ist das Netz, in dem Signale laufen. Der gelbe Lichtpunkt zeigt, wo das Signal gerade ist.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9a-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9a-los" onclick="_n9aLos()">▶ Reiz auslösen</button>
          <button class="sim-btn" onclick="_n9aNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Reiz an</span>
          <div class="sim-btn-row">${k('fuss')}${k('hand')}${k('betaeubt')}</div>
        </div>
        <div class="lmp-status on" id="_n9a-status" style="margin-top:8px"></div>
        <div class="lmp-status on" id="_n9a-info" style="margin-top:6px;display:none"></div>
        <div class="fpm-note" id="_n9a-hinweis" style="margin-top:8px"></div>
        <div class="fpm-label" style="margin-top:10px">Sprungmarken</div>
        <div class="sim-btn-row" style="margin-top:4px">${m('fuss')}${m('hand')}${m('betaeubt')}</div>
        <div class="fpm-note" style="margin-top:8px">Der Lichtpunkt läuft hier stark verlangsamt. In Wirklichkeit ist das Signal viel schneller.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Reiz an „Fuß“</p>
  </div>`;
}

// ── Ablauf ────────────────────────────────────────────────────────────────
function _n9aUpdate(dt) {
  if (!_n9a) return;
  const z = _n9a;
  dt = _bioFxDt(dt);
  z.t += dt;
  if (z.phase === 'reiz') {
    z.p += dt;
    if (z.p >= _N9A_REIZ) { z.phase = 'lauf'; z.s = 0; }
  } else if (z.phase === 'lauf') {
    const w = _n9aWeg();
    z.s += _N9A_V * dt;
    if (z.reiz === 'betaeubt' && z.s >= w.block) {
      z.s = w.block;
      _n9aAnkommen();
    } else {
      if (!z.ein && z.s >= w.ein) {
        z.ein = true;
        const k = _n9aPunkt(w, w.ein);
        _bioFxWelle(z.fx.teile, k[0], k[1], '#ffe066', 20);
      }
      if (z.s >= w.len) { z.s = w.len; _n9aAnkommen(); }
    }
  } else if (z.phase === 'fertig') {
    z.nach += dt;
    if (z.au >= 0) z.au += dt;
    if (z.stopp && !z.ring2 && z.nach >= 0.6) {
      z.ring2 = true;
      const k = _n9aPunkt(_n9aWeg(), _n9aWeg().block);
      _bioFxWelle(z.fx.teile, k[0], k[1], '#94a3b8', 18);
    }
  }
  if (_n9aZeile() !== z.letzt) _n9aStatus();
  _bioFxAlleUpdate(z.fx, dt);
}

// ── Zeichnen ──────────────────────────────────────────────────────────────
function _n9aDraw(ctx, cv) {
  if (!_n9a) return;
  const z = _n9a, W = cv.width, H = cv.height, t = z.t;
  ctx.clearRect(0, 0, W, H);
  _n9aGrund(ctx, W, H);
  if (z.reiz === 'hand') _n9aKaktus(ctx);
  _n9aKoerper(ctx);
  _n9aNetz(ctx);
  if (z.phase === 'bereit') {                          // hier geht es los – unter dem Stein
    const k = _n9aWeg().p[0];
    _bioFxLeuchten(ctx, k[0], k[1], 6, t, '255,216,77');
  }
  if (z.reiz !== 'hand') _n9aStein(ctx);
  _n9aSpur(ctx);
  if (z.reiz === 'betaeubt') _n9aGrau(ctx, t);
  _n9aKopfLeuchten(ctx, t);
  _n9aLichtpunkt(ctx, t);
  _n9aBlase(ctx);
  if (z.phase === 'reiz' || z.phase === 'lauf') {
    ctx.save();
    ctx.fillStyle = 'rgba(241,245,249,0.8)'; ctx.font = '700 10px sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('▶ stark verlangsamt', W - 8, 16);
    ctx.restore();
  }
  _bioFxAlleDraw(ctx, z.fx);
}
function _n9aGrund(ctx, W, H) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, _N9A_F.grund0); g.addColorStop(1, _N9A_F.grund1);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // Kiesweg
  ctx.fillStyle = _N9A_F.weg; ctx.fillRect(0, 240, W, H - 240);
  ctx.save();
  ctx.fillStyle = 'rgba(214,204,186,0.35)';
  for (let i = 0; i < 48; i++) {
    const x = (i * 37.3 + 11) % W, y = 243 + (i * 5.3) % 6;
    ctx.beginPath(); ctx.ellipse(x, y, 1.6 + (i % 3) * 0.5, 1.2, 0, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 240); ctx.lineTo(W, 240); ctx.stroke();
  ctx.restore();
}
// Eine Gliedmaße als dicker Strich mit runden Enden
function _n9aGlied(ctx, a, b, w) {
  ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
}
// Alle Körperteile; rand > 0: Umriss-Durchgang (alles etwas breiter), sonst Füllung.
// Erst der breitere Umriss, darüber die Füllung: so entsteht EIN Umriss um alles.
function _n9aForm(ctx, rand) {
  const flaeche = () => { if (rand > 0) ctx.stroke(); else ctx.fill(); };
  ctx.lineWidth = rand;
  ctx.beginPath(); ctx.ellipse(200, 31, 16, 19, 0, 0, 2 * Math.PI); flaeche();          // Kopf
  for (const x of [184, 216]) { ctx.beginPath(); ctx.ellipse(x, 32, 3.2, 5.5, 0, 0, 2 * Math.PI); flaeche(); }
  _bioFxRundRect(ctx, 192, 44, 16, 22, 4); flaeche();                                   // Hals
  ctx.beginPath();                                                                      // Rumpf
  ctx.moveTo(166, 80); ctx.quadraticCurveTo(168, 64, 186, 62); ctx.lineTo(214, 62);
  ctx.quadraticCurveTo(232, 64, 234, 80); ctx.lineTo(229, 126); ctx.quadraticCurveTo(235, 140, 233, 158);
  ctx.lineTo(167, 158); ctx.quadraticCurveTo(165, 140, 171, 126); ctx.closePath(); flaeche();
  for (const sp of [false, true]) {
    const P = p => sp ? _n9aSp(p) : p;
    _n9aGlied(ctx, P([228, 72]), P([250, 112]), 14 + rand);                              // Oberarm
    _n9aGlied(ctx, P([250, 112]), P([262, 150]), 11 + rand);                             // Unterarm
    _n9aGlied(ctx, P([213, 150]), P([218, 196]), 22 + rand);                             // Oberschenkel
    _n9aGlied(ctx, P([218, 196]), P([219, 227]), 15 + rand);                             // Unterschenkel
    ctx.lineWidth = rand;
    const hd = P([265, 161]);
    ctx.beginPath(); ctx.ellipse(hd[0], hd[1], 6.5, 10, sp ? 0.25 : -0.25, 0, 2 * Math.PI); flaeche();
    const fu = P([221, 233]);
    ctx.beginPath(); ctx.ellipse(fu[0], fu[1], 9, 5, 0, 0, 2 * Math.PI); flaeche();
  }
}
function _n9aKoerper(ctx) {
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = _N9A_F.rand; ctx.fillStyle = _N9A_F.rand;
  _n9aForm(ctx, 3);
  ctx.strokeStyle = _N9A_F.haut; ctx.fillStyle = _N9A_F.haut;
  _n9aForm(ctx, 0);
  // Haarknoten (Lina von hinten)
  ctx.fillStyle = '#3d3247'; ctx.strokeStyle = _N9A_F.rand; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(200, 10, 6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  // Shirt
  ctx.fillStyle = _N9A_F.shirt;
  ctx.beginPath();
  ctx.moveTo(166, 80); ctx.quadraticCurveTo(168, 64, 186, 62); ctx.lineTo(214, 62);
  ctx.quadraticCurveTo(232, 64, 234, 80); ctx.lineTo(229.6, 130); ctx.lineTo(170.4, 130); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = _N9A_F.shirt;
  for (const sp of [false, true]) {
    const a = sp ? _n9aSp([228, 72]) : [228, 72], b = sp ? _n9aSp([238, 90]) : [238, 90];
    _n9aGlied(ctx, a, b, 16);
  }
  // kurze Hose
  ctx.fillStyle = _N9A_F.hose;
  ctx.beginPath();
  ctx.moveTo(170.4, 130); ctx.lineTo(229.6, 130); ctx.lineTo(233, 158); ctx.lineTo(228, 182);
  ctx.lineTo(205, 182); ctx.lineTo(200, 164); ctx.lineTo(195, 182); ctx.lineTo(172, 182);
  ctx.lineTo(167, 158); ctx.closePath(); ctx.fill();
  // Säume
  ctx.strokeStyle = 'rgba(226,232,240,0.55)'; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.moveTo(190, 63); ctx.quadraticCurveTo(200, 67, 210, 63); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(170.4, 130); ctx.lineTo(229.6, 130); ctx.stroke();
  for (const sp of [false, true]) {
    const P = p => sp ? _n9aSp(p) : p;
    let a = P([231, 93.8]), b = P([245, 86.2]);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    a = P([205, 182]); b = P([228, 182]);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  ctx.restore();
}
// Linienzug zeichnen (Punkte als [x,y])
function _n9aZug(ctx, pk) {
  ctx.beginPath();
  ctx.moveTo(pk[0][0], pk[0][1]);
  for (let i = 1; i < pk.length; i++) ctx.lineTo(pk[i][0], pk[i][1]);
  ctx.stroke();
}
// Das ganze Netz, gedämpft und ohne Beschriftung
function _n9aNetz(ctx) {
  ctx.save();
  // Wirbel
  ctx.fillStyle = 'rgba(203,213,225,0.32)';
  for (let y = 54; y <= 152; y += 6.5) { _bioFxRundRect(ctx, 194, y - 2.2, 12, 4.4, 2); ctx.fill(); }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = _N9A_F.dim; ctx.globalAlpha = 0.5;
  ctx.lineWidth = 3.6;
  ctx.beginPath(); ctx.moveTo(200, 46); ctx.lineTo(200, 150); ctx.stroke();               // Strang
  for (const sp of [false, true]) {
    const P = p => sp ? _n9aSp(p) : p;
    ctx.lineWidth = 2;
    _n9aZug(ctx, _N9A_BEIN.map(P));
    _n9aZug(ctx, _N9A_ARM.map(P));
    ctx.lineWidth = 1.1;
    const aeste = [
      [[216, 178], [224, 187]], [[219, 212], [224, 221]], [[219, 227], [226, 234]], [[219, 227], [214, 234]],
      [[240, 92], [234, 103]], [[256, 131], [261, 126]],
      [[265, 161], [261, 170]], [[265, 161], [266, 172]], [[265, 161], [270, 169]]
    ];
    for (const a of aeste) _n9aZug(ctx, a.map(P));
    for (const y of [86, 98, 110, 122, 134]) {                                          // Seitenäste am Rumpf
      const a = P([200, y]), c = P([213, y + 1]), b = P([225, y + 7]);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(c[0], c[1], b[0], b[1]); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  _n9aOrgan(ctx, 0);
  ctx.restore();
}
// Das Organ im Kopf; glanz 0 = dunkel, 1 = leuchtet
function _n9aOrgan(ctx, glanz) {
  ctx.save();
  const lagen = glanz > 0 ? [[glanz, '#ffd84d', '#fff3b0', 'rgba(146,104,10,0.75)']]
                          : [[1, '#5f5532', '#a8924a', 'rgba(20,20,30,0.45)']];
  // Von hinten: zwei Hälften mit welligen Windungen, darunter zwei kleine
  // gestreifte Lappen und der Stiel zum Strang. KEINE gepaarten Bögen auf
  // Augenhöhe – die lasen sich in der ersten Fassung als Gesicht.
  for (const [a, fuell, rand, falte] of lagen) {
    ctx.globalAlpha = a;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = fuell; ctx.strokeStyle = rand; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(200, 26.5, 12.6, 11.5, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(200, 15.5); ctx.lineTo(200, 37.5); ctx.stroke();       // Mittelspalt
    for (const sx of [-1, 1]) {
      ctx.beginPath(); ctx.ellipse(200 + sx * 4.6, 40.6, 5.2, 3.3, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(200, 43.5); ctx.lineTo(200, 50); ctx.stroke();
    ctx.strokeStyle = falte; ctx.lineWidth = 0.9;
    for (const sx of [-1, 1]) {
      for (const [y0, x0, x1] of [[19.5, 2, 8.5], [25, 1.8, 10.5], [30.5, 1.8, 10.5], [35, 2.5, 7.5]]) {
        ctx.beginPath();
        for (let k = 0; k <= 12; k++) {
          const x = 200 + sx * (x0 + (x1 - x0) * k / 12);
          const y = y0 + Math.sin(k * 1.6 + y0 + (sx > 0 ? 1.3 : 0)) * 1.1;
          if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      for (const dy of [-1.1, 0.9]) {
        ctx.beginPath(); ctx.moveTo(200 + sx * 1.6, 40.6 + dy); ctx.lineTo(200 + sx * 8.4, 40.6 + dy); ctx.stroke();
      }
    }
  }
  ctx.restore();
}
// Wie weit leuchtet das Organ im Kopf?
function _n9aGlanz() {
  const z = _n9a;
  if (z.reiz === 'betaeubt' || z.phase === 'bereit' || z.phase === 'reiz') return 0;
  if (z.phase === 'fertig') return 1;
  const w = _n9aWeg();
  return _bioFxKlemme((z.s - w.kopf) / (w.len - w.kopf));
}
function _n9aKopfLeuchten(ctx, t) {
  const g = _n9aGlanz();
  if (g <= 0) return;
  if (_n9a.phase === 'fertig') _bioFxLeuchten(ctx, 200, 29, 11, t, '255,216,77');
  _n9aOrgan(ctx, g);
}
// Der helle Weg: jedes erreichte Stück bleibt hell
function _n9aSpur(ctx) {
  const z = _n9a;
  if (z.phase === 'bereit' || z.phase === 'reiz') return;
  const w = _n9aWeg(), s = z.s, pk = [w.p[0]];
  for (let i = 1; i < w.p.length && w.L[i] < s; i++) pk.push(w.p[i]);
  pk.push(_n9aPunkt(w, s));
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // Wirbel, durch die der Punkt schon gelaufen ist, leuchten mit
  const y7 = w.p[7][1];
  const dot = _n9aPunkt(w, s);
  for (let y = 54; y <= 152; y += 6.5) {
    if (y > y7 + 2 || y < 50) continue;
    if (s < w.ein + (y7 - y)) continue;
    const nah = (z.phase === 'lauf' && Math.abs(dot[0] - 200) < 0.5) ? _bioFxKlemme(1 - Math.abs(dot[1] - y) / 14) : 0;
    ctx.fillStyle = 'rgba(255,225,77,' + (0.22 + 0.5 * nah).toFixed(3) + ')';
    _bioFxRundRect(ctx, 194, y - 2.2, 12, 4.4, 2); ctx.fill();
    if (nah > 0) {
      ctx.strokeStyle = 'rgba(255,241,170,' + (0.9 * nah).toFixed(3) + ')'; ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
  ctx.strokeStyle = _N9A_F.schein; ctx.lineWidth = 8;
  _n9aZug(ctx, pk);
  ctx.strokeStyle = _N9A_F.hell; ctx.lineWidth = 3.2;
  ctx.shadowColor = '#ffd84d'; ctx.shadowBlur = 8;
  _n9aZug(ctx, pk);
  ctx.restore();
}
// Grau markierte Stelle am Knie (nur bei „Fuß, betäubt“)
function _n9aGrau(ctx, t) {
  const z = _n9a;
  ctx.save();
  ctx.fillStyle = 'rgba(148,163,184,0.95)'; ctx.strokeStyle = _N9A_F.rand; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, 206, 190, 24, 12, 5); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(71,85,105,0.7)'; ctx.lineWidth = 1;
  for (let x = 209; x <= 225; x += 5) { ctx.beginPath(); ctx.moveTo(x, 200.5); ctx.lineTo(x + 4, 191.5); ctx.stroke(); }
  if (z.stopp) {
    const puls = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 0.6);                         // 0,6 Hz, ruhig
    ctx.strokeStyle = 'rgba(226,232,240,' + (0.25 + 0.45 * puls).toFixed(3) + ')'; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, 202.5, 186.5, 31, 19, 8); ctx.stroke();
  }
  ctx.restore();
}
// Der Lichtpunkt selbst
function _n9aLichtpunkt(ctx, t) {
  const z = _n9a, w = _n9aWeg();
  let a = 0, r = 4.2, s = z.s, grau = false;
  if (z.phase === 'bereit') return;                    // Schein am Start zeichnet _n9aDraw
  if (z.phase === 'reiz') { a = _bioFxKlemme(z.p / _N9A_REIZ); r = 4.2 * a; s = 0; }
  else if (z.phase === 'lauf') a = 1;
  else if (z.stopp) { a = 1 - _bioFxKlemme(z.nach / 1.4); grau = true; }
  if (a <= 0.01) return;
  const k = _n9aPunkt(w, s);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = grau ? 'rgba(203,213,225,0.35)' : 'rgba(255,225,77,0.38)';
  ctx.beginPath(); ctx.arc(k[0], k[1], r * 2.3, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = grau ? '#e5e7eb' : '#fffbe6'; ctx.strokeStyle = grau ? '#94a3b8' : '#ffd84d'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(k[0], k[1], Math.max(0.5, r), 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Spitzer Stein unter dem rechten Fuß
function _n9aStein(ctx) {
  ctx.save();
  ctx.fillStyle = '#9aa1ab'; ctx.strokeStyle = _N9A_F.rand; ctx.lineWidth = 1.2; ctx.lineJoin = 'miter';
  ctx.beginPath();
  ctx.moveTo(204, 250); ctx.lineTo(208, 244); ctx.lineTo(212, 245); ctx.lineTo(216, 239.5);
  ctx.lineTo(221, 234.5); ctx.lineTo(224.5, 240); ctx.lineTo(228, 241.5); ctx.lineTo(231.5, 238);
  ctx.lineTo(234, 243); ctx.lineTo(238, 250);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Licht- und Schattenseite der Zacken
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.beginPath(); ctx.moveTo(221, 234.5); ctx.lineTo(216, 239.5); ctx.lineTo(219, 249); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(30,41,59,0.35)';
  ctx.beginPath(); ctx.moveTo(231.5, 238); ctx.lineTo(234, 243); ctx.lineTo(236.5, 250); ctx.lineTo(230, 250); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Kaktus im Topf an der rechten Hand
function _n9aKaktus(ctx) {
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.fillStyle = '#b45f3c'; ctx.strokeStyle = '#f1c7a8'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(285, 222); ctx.lineTo(315, 222); ctx.lineTo(311, 240); ctx.lineTo(289, 240); ctx.closePath();
  ctx.fill(); ctx.stroke();
  _bioFxRundRect(ctx, 282, 216, 36, 7, 2); ctx.fill(); ctx.stroke();
  for (const [farbe, extra] of [['#d9f99d', 3], ['#4d8f46', 0]]) {
    ctx.strokeStyle = farbe;
    _n9aGlied(ctx, [300, 214], [300, 132], 18 + extra);
    ctx.lineWidth = 10 + extra;
    ctx.beginPath(); ctx.moveTo(300, 178); ctx.lineTo(281, 178); ctx.lineTo(281, 150); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(47,95,44,0.8)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(300, 136); ctx.lineTo(300, 212); ctx.stroke();
  ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 1;
  for (let y = 138; y <= 210; y += 9) {
    ctx.beginPath(); ctx.moveTo(309.5, y); ctx.lineTo(313.5, y - 2); ctx.stroke();
    if (y < 168 || y > 186) { ctx.beginPath(); ctx.moveTo(290.5, y); ctx.lineTo(286.5, y - 2); ctx.stroke(); }
  }
  for (let y = 151; y <= 176; y += 6) { ctx.beginPath(); ctx.moveTo(276, y); ctx.lineTo(272, y - 1); ctx.stroke(); }
  ctx.restore();
}
// Sprechblase „Au!“ – erst wenn der Punkt im Kopf angekommen ist
function _n9aBlase(ctx) {
  const z = _n9a;
  if (z.au < 0) return;
  const k = 0.4 + 0.6 * _bioFxEase.federn(_bioFxKlemme(z.au / 0.4));
  ctx.save();
  ctx.globalAlpha = _bioFxKlemme(z.au / 0.15);
  ctx.translate(132, 30); ctx.scale(k, k);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, -32, -17, 64, 34, 12); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(29, -2); ctx.lineTo(47, 6); ctx.lineTo(29, 8); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(31, -2); ctx.lineTo(47, 6); ctx.lineTo(31, 8); ctx.stroke();
  ctx.fillStyle = '#b91c1c'; ctx.font = '700 22px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Au!', 0, 1);
  ctx.restore();
}
