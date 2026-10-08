// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · WAS STEHT IN DER DNA?   (Förderheft Bio 9 · bt4)
// Kennung bio-dna, Präfix _n9q. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bt4.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250, heller Grund, schematisch):
//   - oben links ein Schild mit Bild und Namen des Lebewesens
//     („Mensch“, „Erbse“, „Hund“).
//   - links ein runder Zellkern (Beschriftung „Zellkern“), darin EIN
//     Chromosom als einfaches Stäbchen (Beschriftung „Chromosom“). Vor dem
//     Aufdrehen leuchtet es ruhig (0,8 Hz).
//     KEIN X: Im Band ist das X die Form kurz vor der Teilung (bz1: „jedes
//     Stäbchen wird doppelt und sieht aus wie ein X“, danach löst sich die
//     Hülle des Zellkerns auf), und bt1 zeigt Chromosomen ausdrücklich als
//     Stäbchen ohne X-Form. Ein X in einem heilen Zellkern widerspräche beidem
//     (Prüfung 08.10.2026).
//   - nach „▶ aufdrehen“ rechts das vergrößerte Stück DNA: Ein heller Kegel
//     führt vom oberen Ende des Chromosoms (Ring) zur Leiter; darin
//     läuft der Faden als enge Schraube weiter (dreht sich langsam).
//   - Leiter mit 6 Sprossen (Mitte x = 146, 194, 242, 290, 338, 386).
//     Oben das Seil „Strang 1“ (y = 82), unten das Seil „Strang 2“ (y = 186);
//     die Beschriftungen stehen am rechten Ende über bzw. unter dem Seil.
//   - Jede Sprosse sind zwei Halbstücke (32 x 52), je mit großem Buchstaben
//     (22 px) und eigener Farbe: A grün, T rot, G gelb, C blau. Die Enden in
//     der Mitte sind Puzzle-Enden: A hat eine Spitze, T eine spitze Kerbe,
//     G eine runde Nase, C eine runde Kerbe. Strang 2 wird NICHT eingetragen,
//     sondern aus den Enden gerechnet (_n9qPartner): gesucht wird das Stück,
//     dessen Kerbe die Nase genau füllt.
//   - Am Ende: die ersten 3 Sprossen von links liegen in einem hellen Rahmen.
//
// BEDIENUNG (wörtlich): Lebewesen „Mensch“ · „Erbse“ · „Hund“ (Wahlgruppe
//   _n9qWahl) · „▶ aufdrehen“ (_n9qAufdrehen) · „neu“ (_n9qNeu → „Mensch“).
//   Start: „Mensch“. Umstellen bringt das Chromosom zurück in den Zellkern.
//   Während des Aufdrehens ist „▶ aufdrehen“ grau.
//
// ABLAUF NACH „▶ aufdrehen“ (5,8 s; Zeiten in s):
//   0,0–0,5  der Faden zieht sich aus dem Chromosom (Kegel blendet ein)
//   0,5–1,5  das Stück DNA wächst als gedrehte Leiter nach rechts heraus
//   1,5–3,7  es dreht sich zu einer geraden Leiter auf; die Buchstaben werden
//            lesbar, sobald eine Sprosse ganz zu sehen ist
//   3,8–4,4  Strang 2 rückt 16 px nach unten – die Enden liegen frei
//   4,4–4,8  Pause: Nase und Kerbe sind einzeln zu sehen
//   4,8–5,3  Strang 2 rastet wieder ein (federnd); bei 5,3 an jeder Sprosse
//            ein kleiner Lichtring
//   5,3–5,8  der helle Rahmen um die ersten 3 Sprossen blendet ein
//   ab 5,8   Endbild; ein Lichtpunkt wandert ruhig über beide Seile.
//
// STATUSZEILE (_n9q-status):
//   vorher   „Ein Chromosom vom Menschen.“ (von der Erbse / vom Hund)
//   Lauf     „Ein Stück DNA wird herausgezogen …“ · „Die DNA dreht sich auf …“
//            · „Die Stränge rücken kurz auseinander …“
//   danach   „Ein Stück DNA vom Menschen.“ · „Ein Stück DNA von der Erbse.“
//            · „Ein Stück DNA vom Hund.“            (wörtlich aus dem sim_plan)
// HINWEIS (_n9q-hinweis) führt durch die Schritte a–c der Seite und nennt
//   immer das nächste Ziel (Zeile der Tabelle, nächstes Lebewesen, Spalten).
//
// WERTE (sim_plan.werte; lehrer.tabelle_erwartet = die ersten 3 Sprossen):
//   Mensch  Strang 1 A T G C G A · Strang 2 T A C G C T   (A, T, G | T, A, C)
//   Erbse   Strang 1 G G A T C A · Strang 2 C C T A G T   (G, G, A | C, C, T)
//   Hund    Strang 1 C T A G G T · Strang 2 G A T C C A   (C, T, A | G, A, T)
//   Die Abschnitte sind ausgedachte Modellabschnitte, keine echten Gene.
//
// AHA (_bioFx, ruhig, OHNE Textstreifen, ohne Zufall): Strang 2 rückt kurz
//   ab und rastet wieder ein – man sieht, dass jede Nase genau in ihre Kerbe
//   fällt (gegen Vermutung 1 „gleiche Basen zusammen“ und Vermutung 3
//   „keine feste Regel“). Bei allen drei Lebewesen dieselben Formen.
//   Es leuchtet nichts gruppenweise auf: Zuordnen und Vergleichen bleibt
//   Aufgabe des Kindes (Schritt d).
//
// NICHT AM BILDSCHIRM (Lückenwörter aus Merksatz und Aufgabe 2 und die
//   Falschwahl der Wortbank): „gegenüber“, „Reihenfolge“, „vier“, „zwei“,
//   „T, C, A“; keine Regel wie „A passt zu T“, kein „Paar“. Keine Zahl der
//   Basenarten. Deterministisch, ohne Zufall.
// ═══════════════════════════════════════════════════════════════════════
let _n9q = null;
const _N9Q_ART = {
  mensch: { name: 'Mensch', von: 'vom Menschen',  zeile: 1, s1: 'ATGCGA' },
  erbse:  { name: 'Erbse',  von: 'von der Erbse', zeile: 2, s1: 'GGATCA' },
  hund:   { name: 'Hund',   von: 'vom Hund',      zeile: 3, s1: 'CTAGGT' }
};
const _N9Q_WAHL = ['mensch', 'erbse', 'hund'];
// Die Basen als Puzzlestücke: Form des Endes, Nase (true) oder Kerbe (false)
const _N9Q_BASE = {
  A: { form: 'spitz', nase: true,  farbe: '#16a34a', rand: '#14532d', schrift: '#ffffff' },
  T: { form: 'spitz', nase: false, farbe: '#dc2626', rand: '#7f1d1d', schrift: '#ffffff' },
  G: { form: 'rund',  nase: true,  farbe: '#f59e0b', rand: '#92400e', schrift: '#422006' },
  C: { form: 'rund',  nase: false, farbe: '#2563eb', rand: '#1e3a8a', schrift: '#ffffff' }
};
// Leiter
const _N9Q_YM = 134, _N9Q_H = 52;                 // Mitte, halbe Höhe: Seile bei 82 und 186
const _N9Q_N = 6, _N9Q_X0 = 146, _N9Q_DX = 48, _N9Q_B = 16;   // Sprossen, halbe Stückbreite
const _N9Q_XL = 118, _N9Q_XR = 410;               // Seile von … bis
const _N9Q_K = 2 * Math.PI / 120;                 // Windung der gedrehten Leiter
const _N9Q_SPALT = 16;                            // so weit rückt Strang 2 ab
// Zellkern und Chromosom
const _N9Q_KX = 60, _N9Q_KY = 142, _N9Q_KR = 44;
const _N9Q_OBEN = 20, _N9Q_UNTEN = 30, _N9Q_WO = 0.5, _N9Q_WU = 0.42;  // Stäbchen: Länge und Winkel oben/unten
const _N9Q_LX = _N9Q_KX + _N9Q_OBEN * Math.sin(_N9Q_WO);             // Ring am oberen Ende des Stäbchens
const _N9Q_LY = _N9Q_KY - _N9Q_OBEN * Math.cos(_N9Q_WO);
const _N9Q_XS = _N9Q_LX + 6;                      // hier beginnt der Faden
const _N9Q_KF = 2 * Math.PI / 14;                 // Windung im Faden
// Zeitplan in s nach „▶ aufdrehen“
const _N9Q_FADEN = 0.5, _N9Q_RAUS = 1.5, _N9Q_AUF = 3.7;
const _N9Q_AB = 3.8, _N9Q_ZU = 4.8, _N9Q_EIN = 5.3, _N9Q_ENDE = 5.8;
const _N9Q_ABSCHNITT = [[0, _N9Q_RAUS], [_N9Q_RAUS, _N9Q_AUF], [_N9Q_AB, _N9Q_ENDE]];
const _N9Q_HG = '#eef3f6';

function _n9qKl(x) { return _bioFxKlemme(x); }
function _n9qE(x) { return _bioFxEase.sanft(_bioFxKlemme(x)); }
function _n9qSprosse(i) { return _N9Q_X0 + _N9Q_DX * i; }

// Das Stück, dessen Ende das Ende von b genau füllt: gleiche Form, Nase ↔ Kerbe
function _n9qPartner(b) {
  const s = _N9Q_BASE[b];
  for (const k of Object.keys(_N9Q_BASE)) {
    const o = _N9Q_BASE[k];
    if (o.form === s.form && o.nase !== s.nase) return k;
  }
  return '?';
}
function _n9qStrang2(s1) { return s1.split('').map(_n9qPartner).join(''); }

// Profil der Enden: Tiefe p je Stelle u (von +16 bis -16). Nase und Kerbe
// derselben Form haben dasselbe Profil – das eine steht vor, das andere fehlt.
function _n9qProfil(form) {
  const pts = [];
  for (let u = _N9Q_B; u >= -_N9Q_B; u -= 1) {
    const p = form === 'spitz' ? Math.max(0, 9 * (1 - Math.abs(u) / 9))
                               : Math.sqrt(Math.max(0, 64 - u * u));
    pts.push([u, p]);
  }
  return pts;
}
const _N9Q_KANTE = { spitz: _n9qProfil('spitz'), rund: _n9qProfil('rund') };

function _n9qInit() {
  _n9q = { t: 0, art: 'mensch', phase: 'ruhe', s: 0, fx: { teile: [] }, letzt: '' };
}

// ── Bedienung ──────────────────────────────────────────
function _n9qRuhe() {
  _n9q.phase = 'ruhe'; _n9q.s = 0; _n9q.fx = { teile: [] };
}
function _n9qWahl(v) {
  if (!_n9q || !_N9Q_ART[v]) return;
  _n9q.art = v;
  _n9qRuhe();
  _n9qStatus();
}
function _n9qAufdrehen() {
  if (!_n9q || _n9q.phase === 'lauf') return;
  _n9qRuhe();
  _n9q.phase = 'lauf';
  _bioFxWelle(_n9q.fx.teile, _N9Q_LX, _N9Q_LY, '#fde68a', 16);
  _n9qStatus();
}
function _n9qNeu() {
  if (!_n9q) return;
  _n9q.art = 'mensch';
  _n9qRuhe();
  _n9qStatus();
}
// Strang 2 ist wieder eingerastet: an jeder Sprosse ein kleiner Lichtring
function _n9qEingerastet() {
  for (let i = 0; i < _N9Q_N; i++) _bioFxWelle(_n9q.fx.teile, _n9qSprosse(i), _N9Q_YM, '#fde68a', 20);
}

// ── Anzeige ────────────────────────────────────────────
function _n9qZeile() {
  const a = _N9Q_ART[_n9q.art];
  if (_n9q.phase === 'fertig') return 'Ein Stück DNA ' + a.von + '.';
  if (_n9q.phase === 'lauf') {
    if (_n9q.s < _N9Q_RAUS) return 'Ein Stück DNA wird herausgezogen …';
    if (_n9q.s < _N9Q_AB) return 'Die DNA dreht sich auf …';
    return 'Die Stränge rücken kurz auseinander …';
  }
  return 'Ein Chromosom ' + a.von + '.';
}
function _n9qHinweis() {
  if (_n9q.phase === 'lauf') return 'Sieh genau hin: Wie sehen die Enden der Basen aus?';
  if (_n9q.phase === 'ruhe') return 'Drücke „▶ aufdrehen“. Dann siehst du ein kurzes Stück DNA ganz nah.';
  if (_n9q.art === 'mensch') return 'Lies auf Strang 2 die ersten 3 Basen im hellen Rahmen ab. '
    + 'Notiere sie in Zeile 1 der Tabelle. Stelle danach „Erbse“ ein.';
  const a = _N9Q_ART[_n9q.art];
  return 'Lies die ersten 3 Basen im hellen Rahmen ab, auf Strang 1 und auf Strang 2. '
    + 'Notiere sie in Zeile ' + a.zeile + ' der Tabelle. '
    + (_n9q.art === 'erbse' ? 'Stelle danach „Hund“ ein.' : 'Vergleiche dann Spalte 2 und Spalte 3.');
}
function _n9qStatus() {
  if (!_n9q) return;
  const zl = _n9qZeile(), hw = _n9qHinweis();
  _n9q.letzt = zl + '|' + hw;
  const el = document.getElementById('_n9q-status');
  if (el) { el.textContent = zl; el.className = 'lmp-status on'; }
  const h = document.getElementById('_n9q-hinweis');
  if (h) h.textContent = hw;
  try {
    document.querySelectorAll('[data-n9q]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9q') === _n9q.art);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9q-los');
  if (los) {
    const zu = _n9q.phase === 'lauf';
    los.disabled = zu;
    try { if (los.classList) los.classList.toggle('primary', !zu); } catch (e) { /* Beiwerk */ }
  }
}
function _n9qHTML() {
  const k = v => `<button class="sim-btn" data-n9q="${v}" onclick="_n9qWahl('${v}')">${_N9Q_ART[v].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was steht in der DNA?</h3>
    <div class="fpm-note" style="margin-top:2px">Im Zellkern liegt ein Chromosom. Es ist ein langer, aufgewickelter Faden: die DNA. Nach „▶ aufdrehen“ siehst du rechts ein kurzes Stück davon, stark vergrößert.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9q-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9q-los" onclick="_n9qAufdrehen()">▶ aufdrehen</button>
          <button class="sim-btn" onclick="_n9qNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Lebewesen</span>
          <div class="sim-btn-row">${_N9Q_WAHL.map(k).join('')}</div>
        </div>
        <div class="lmp-status on" id="_n9q-status" style="margin-top:8px"></div>
        <div class="fpm-note" id="_n9q-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Im Modell ist jede Base ein Puzzlestück mit einem Buchstaben. Die Stücke von Mensch, Erbse und Hund sind ausgedacht. Echte DNA ist viel länger.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Lebewesen „Mensch“ &nbsp;|&nbsp; Das Aufdrehen dauert etwa 6 Sekunden.</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9qUpdate(dt) {
  if (!_n9q) return;
  dt = _bioFxDt(dt);
  const z = _n9q;
  z.t += dt;
  if (z.phase === 'lauf') {
    const vor = z.s;
    z.s += dt;
    if (vor < _N9Q_EIN && z.s >= _N9Q_EIN) _n9qEingerastet();
    if (z.s >= _N9Q_ENDE) { z.s = _N9Q_ENDE; z.phase = 'fertig'; }
  }
  if (_n9qZeile() + '|' + _n9qHinweis() !== z.letzt) _n9qStatus();
  _bioFxAlleUpdate(z.fx, dt);
}

// ── Geometrie: was steht zur Zeit s wo? ────────────────
// w = Windung (1 gedreht, 0 gerade), spalt = Abstand von Strang 2,
// xf = Ende des Fadens, xe = Ende der Leiter, dazu Deckkraft von Kegel,
// Rahmen und Strang-Beschriftungen. In Ruhe: null (nur der Zellkern).
function _n9qGeo() {
  const z = _n9q;
  if (z.phase === 'ruhe') return null;
  if (z.phase === 'fertig') return { w: 0, spalt: 0, xf: _N9Q_XL, xe: _N9Q_XR, kegel: 1, rahmen: 1, namen: 1 };
  const s = z.s;
  const w = 1 - _n9qE((s - _N9Q_RAUS) / (_N9Q_AUF - _N9Q_RAUS));
  let spalt = 0;
  if (s >= _N9Q_AB && s < _N9Q_ZU) spalt = _N9Q_SPALT * _n9qE((s - _N9Q_AB) / 0.6);
  else if (s >= _N9Q_ZU) spalt = _N9Q_SPALT * (1 - _bioFxEase.aufprall(_n9qKl((s - _N9Q_ZU) / (_N9Q_EIN - _N9Q_ZU))));
  return {
    w, spalt,
    xf: _N9Q_XS + (_N9Q_XL - _N9Q_XS) * _n9qE(s / _N9Q_FADEN),
    xe: _N9Q_XL + (_N9Q_XR - _N9Q_XL) * _n9qE((s - _N9Q_FADEN) / (_N9Q_RAUS - _N9Q_FADEN)),
    kegel: _n9qKl(s / 0.4),
    rahmen: _n9qKl((s - _N9Q_EIN) / (_N9Q_ENDE - _N9Q_EIN)),
    namen: _n9qKl((0.45 - w) / 0.35)
  };
}
// Punkt eines Seils an der Stelle x (strang 1 oben, 2 unten); z > 0 = vorn
function _n9qPunkt(x, strang, g, t) {
  const sg = strang === 1 ? -1 : 1;
  if (x >= _N9Q_XL) {
    const th = g.w * _N9Q_K * (x - _N9Q_XL);
    return { x, y: _N9Q_YM + sg * _N9Q_H * Math.cos(th) + (strang === 2 ? g.spalt : 0), z: -sg * Math.sin(th) };
  }
  // im Faden: enge Schraube, die zum Chromosom hin dünner wird und sich langsam dreht
  const f = _n9qKl((x - _N9Q_XS) / (_N9Q_XL - _N9Q_XS));
  const a = 3 + (_N9Q_H - 3) * Math.pow(f, 2.2);
  const ym = _N9Q_LY + (_N9Q_YM - _N9Q_LY) * f;
  const th = _N9Q_KF * (x - _N9Q_XL) + 0.7 * t * (1 - f);
  return { x, y: ym + sg * a * Math.cos(th) + (strang === 2 ? g.spalt * f * f : 0), z: -sg * Math.sin(th) };
}
// Seil in Stücke teilen: vorn liegende und hinten liegende
function _n9qLaeufe(strang, g, t) {
  const xa = _N9Q_XS, xb = g.xf < _N9Q_XL ? g.xf : g.xe;
  const out = { vorn: [], hinten: [] };
  if (xb - xa < 0.5) return out;
  const n = Math.max(2, Math.ceil((xb - xa) / 2.5));
  let lauf = null, v = null;
  for (let k = 0; k <= n; k++) {
    const p = _n9qPunkt(xa + (xb - xa) * k / n, strang, g, t), pv = p.z >= -0.02;
    if (lauf === null) { lauf = [p]; v = pv; continue; }
    lauf.push(p);
    if (pv !== v) { (v ? out.vorn : out.hinten).push(lauf); lauf = [p]; v = pv; }
  }
  (v ? out.vorn : out.hinten).push(lauf);
  return out;
}

// ── Zeichnen ───────────────────────────────────────────
function _n9qSeil(ctx, lauf, vorn) {
  if (!lauf || lauf.length < 2) return;
  const weg = () => { ctx.beginPath(); ctx.moveTo(lauf[0].x, lauf[0].y); for (let k = 1; k < lauf.length; k++) ctx.lineTo(lauf[k].x, lauf[k].y); };
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = vorn ? '#1e3a8a' : '#9aa8c4'; ctx.lineWidth = 7;
  weg(); ctx.stroke();
  if (vorn) {
    ctx.strokeStyle = '#5b7fd6'; ctx.lineWidth = 2;
    ctx.translate(0, -1.5); weg(); ctx.stroke();
  }
  ctx.restore();
}
// Ein Halbstück: Base b an der Sprosse x; c = Windungs-Faktor (1 = von vorn),
// unten = Strang 2. v läuft vom Seil (0) bis zur Mitte (H), das Ende ragt
// bei einer Nase um p über die Mitte hinaus, bei einer Kerbe um p zurück.
function _n9qStueck(ctx, b, x, c, unten, spalt, deck) {
  const B = _N9Q_BASE[b], H = _N9Q_H, hb = _N9Q_B;
  const ort = (u, v) => [x + u, unten ? _N9Q_YM + (H - v) * c + spalt : _N9Q_YM - (H - v) * c];
  const pts = [ort(-hb, 0), ort(hb, 0)];
  for (const [u, p] of _N9Q_KANTE[B.form]) pts.push(ort(u, H + (B.nase ? p : -p)));
  ctx.save();
  ctx.globalAlpha = deck * (0.55 + 0.45 * Math.abs(c));
  ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
  ctx.closePath();
  ctx.fillStyle = B.farbe; ctx.fill();
  ctx.strokeStyle = B.rand; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.restore();
}
function _n9qBuchstabe(ctx, b, x, y, c, deck) {
  if (deck <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = deck;
  ctx.fillStyle = _N9Q_BASE[b].schrift; ctx.font = '800 22px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (Math.abs(c - 1) < 1e-9) ctx.fillText(b, x, y);
  else { ctx.translate(x, y); ctx.scale(1, c); ctx.fillText(b, 0, 0); }
  ctx.restore();
}
// Rahmen um die ersten 3 Sprossen: Lage (auch für die Probe)
function _n9qRahmen() {
  const x = _n9qSprosse(0) - _N9Q_B - 8, x2 = _n9qSprosse(2) + _N9Q_B + 8;
  return { x, y: _N9Q_YM - _N9Q_H - 11, w: x2 - x, h: 2 * _N9Q_H + 22 };
}
function _n9qRahmenFlaeche(ctx, a) {
  const r = _n9qRahmen();
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = '#fffbe0';
  _bioFxRundRect(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
  ctx.restore();
}
function _n9qRahmenRand(ctx, a, t) {
  const r = _n9qRahmen();
  ctx.save();
  ctx.globalAlpha = a * (0.8 + 0.2 * Math.sin(t * Math.PI * 2 * 0.5));
  ctx.strokeStyle = '#facc15'; ctx.lineWidth = 3.5;
  _bioFxRundRect(ctx, r.x, r.y, r.w, r.h, 10); ctx.stroke();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, r.x + 2.5, r.y + 2.5, r.w - 5, r.h - 5, 8); ctx.stroke();
  ctx.restore();
}
function _n9qLeiter(ctx, g, t) {
  const a = _N9Q_ART[_n9q.art], s1 = a.s1, s2 = _n9qStrang2(s1);
  const l1 = _n9qLaeufe(1, g, t), l2 = _n9qLaeufe(2, g, t);
  for (const l of l1.hinten) _n9qSeil(ctx, l, false);
  for (const l of l2.hinten) _n9qSeil(ctx, l, false);
  for (let i = 0; i < _N9Q_N; i++) {
    const x = _n9qSprosse(i);
    const da = _n9qKl((g.xe - (x - _N9Q_B)) / (2 * _N9Q_B));
    if (da <= 0.01) continue;
    const c = Math.cos(g.w * _N9Q_K * (x - _N9Q_XL));
    _n9qStueck(ctx, s1[i], x, c, false, g.spalt, da);
    _n9qStueck(ctx, s2[i], x, c, true, g.spalt, da);
    const lesbar = da * _n9qKl((c - 0.6) / 0.35);
    _n9qBuchstabe(ctx, s1[i], x, _N9Q_YM - 0.58 * _N9Q_H * c, c, lesbar);
    _n9qBuchstabe(ctx, s2[i], x, _N9Q_YM + 0.58 * _N9Q_H * c + g.spalt, c, lesbar);
  }
  for (const l of l1.vorn) _n9qSeil(ctx, l, true);
  for (const l of l2.vorn) _n9qSeil(ctx, l, true);
  // Lichtpunkt auf beiden Seilen (nur im Endbild): das Bild lebt
  if (_n9q.phase === 'fertig') {
    const L = _N9Q_XR - _N9Q_XL + 80;
    for (const strang of [1, 2]) {
      const xg = _N9Q_XL - 40 + ((t * 55 + (strang === 2 ? L / 2 : 0)) % L);
      if (xg < _N9Q_XL + 4 || xg > _N9Q_XR - 4) continue;
      const p = _n9qPunkt(xg, strang, g, t);
      ctx.save();
      ctx.fillStyle = 'rgba(191,219,254,0.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, 2 * Math.PI); ctx.fill();
      ctx.restore();
    }
  }
}
function _n9qStrangNamen(ctx, g) {
  if (g.namen <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = g.namen;
  ctx.fillStyle = '#0f172a'; ctx.font = '700 13px sans-serif';
  ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Strang 1', _N9Q_XR + 4, _N9Q_YM - _N9Q_H - 11);
  ctx.fillText('Strang 2', _N9Q_XR + 4, _N9Q_YM + _N9Q_H + 22 + g.spalt);
  ctx.restore();
}
// Heller Kegel vom Ring am Chromosom zur Leiter (= stark vergrößert)
function _n9qKegel(ctx, g) {
  if (g.kegel <= 0.01) return;
  const xr = _N9Q_XL - 4, yo = _N9Q_YM - _N9Q_H - 14, yu = _N9Q_YM + _N9Q_H + 14 + g.spalt;
  ctx.save();
  ctx.globalAlpha = g.kegel;
  ctx.fillStyle = 'rgba(148,163,184,0.16)';
  ctx.beginPath(); ctx.moveTo(_N9Q_LX + 3, _N9Q_LY - 5); ctx.lineTo(xr, yo); ctx.lineTo(xr, yu);
  ctx.lineTo(_N9Q_LX + 3, _N9Q_LY + 5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(_N9Q_LX + 3, _N9Q_LY - 5); ctx.lineTo(xr, yo); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(_N9Q_LX + 3, _N9Q_LY + 5); ctx.lineTo(xr, yu); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
function _n9qRing(ctx, a) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(_N9Q_LX, _N9Q_LY, 6, 0, 2 * Math.PI); ctx.stroke();
  ctx.restore();
}
// Zellkern mit EINEM Chromosom als Stäbchen (leicht geknickt, wie bz1/bt1).
// Es läuft von unten links durch die Mitte zum Ring am oberen Ende, an dem
// der Faden herausgezogen wird.
function _n9qKern(ctx, t, ruhe) {
  const kx = _N9Q_KX, ky = _N9Q_KY;
  ctx.save();
  ctx.fillStyle = '#fdf6e9'; ctx.strokeStyle = '#b8956a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(kx, ky, _N9Q_KR + 0.6 * Math.sin(t * 1.2), 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  if (ruhe) _bioFxLeuchten(ctx, kx, ky + 3, 22, t, '250,204,21');
  const su = Math.sin(_N9Q_WU), cu = Math.cos(_N9Q_WU);
  const haelften = [
    [[kx - _N9Q_UNTEN * su, ky + _N9Q_UNTEN * cu], [kx, ky], [_N9Q_LX, _N9Q_LY]]
  ];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [farbe, breite] of [['#4c1d95', 13], ['#8b5cf6', 10]]) {
    ctx.strokeStyle = farbe; ctx.lineWidth = breite;
    for (const hf of haelften) {
      ctx.beginPath(); ctx.moveTo(hf[0][0], hf[0][1]); ctx.lineTo(hf[1][0], hf[1][1]); ctx.lineTo(hf[2][0], hf[2][1]); ctx.stroke();
    }
  }
  // aufgewickelter Faden: feine Querstriche
  ctx.strokeStyle = 'rgba(237,233,254,0.8)'; ctx.lineWidth = 1.2;
  for (const hf of haelften) {
    for (let k = 0; k < 2; k++) {
      const p = hf[k], q = hf[k + 1], d = Math.hypot(q[0] - p[0], q[1] - p[1]);
      const ux = (q[0] - p[0]) / d, uy = (q[1] - p[1]) / d;
      for (let m = 3; m < d - 2; m += 4.5) {
        const mx = p[0] + ux * m, my = p[1] + uy * m;
        const nx = -uy * Math.cos(0.5) - ux * Math.sin(0.5), ny = ux * Math.cos(0.5) - uy * Math.sin(0.5);
        ctx.beginPath(); ctx.moveTo(mx - nx * 4, my - ny * 4); ctx.lineTo(mx + nx * 4, my + ny * 4); ctx.stroke();
      }
    }
  }
  ctx.restore();
}
function _n9qBeschriftung(ctx) {
  ctx.save();
  ctx.fillStyle = '#334155'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
  ctx.font = '600 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Chromosom', 46, 86);
  // Zeiger endet auf dem Stäbchen (Strecke Mitte 60/142 → Ring 69,6/124,4)
  ctx.beginPath(); ctx.moveTo(49, 91); ctx.lineTo(62, 131); ctx.stroke();
  ctx.fillText('Zellkern', _N9Q_KX, _N9Q_KY + _N9Q_KR + 17);
  ctx.restore();
}
// Schild oben links: Bild und Name des Lebewesens
function _n9qSchild(ctx) {
  const v = _n9q.art, cx = 28, cy = 26;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, 8, 8, 118, 36, 8); ctx.fill(); ctx.stroke();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (v === 'mensch') {
    ctx.fillStyle = '#475569';
    ctx.beginPath(); ctx.arc(cx, cy - 8, 4.6, 0, 2 * Math.PI); ctx.fill();
    _bioFxRundRect(ctx, cx - 7.5, cy - 2, 15, 14, 5); ctx.fill();
  } else if (v === 'erbse') {
    ctx.strokeStyle = '#3f6212'; ctx.fillStyle = '#65a30d'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(cx, cy, 13, 6.5, -0.25, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#bef264';
    for (const k of [-1, 0, 1]) {
      ctx.beginPath(); ctx.arc(cx + 7 * k * Math.cos(0.25), cy - 7 * k * Math.sin(0.25), 3.3, 0, 2 * Math.PI); ctx.fill();
    }
    ctx.beginPath(); ctx.moveTo(cx - 12, cy + 3); ctx.lineTo(cx - 16, cy + 1); ctx.stroke();
  } else {
    ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#92400e';
    ctx.beginPath(); ctx.ellipse(cx - 2, cy + 2, 9, 5, 0, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 8, cy - 4, 4.6, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 12.5, cy - 2.6, 3.2, 2.2, 0, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 6, cy - 6.5, 2, 3.6, -0.5, 0, 2 * Math.PI); ctx.fill();
    ctx.lineWidth = 2.2;
    for (const lx of [-8, -5, 2, 5]) { ctx.beginPath(); ctx.moveTo(cx + lx, cy + 5); ctx.lineTo(cx + lx, cy + 11); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx - 10, cy); ctx.lineTo(cx - 14, cy - 6); ctx.stroke();
  }
  ctx.fillStyle = '#0f172a'; ctx.font = '700 15px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(_N9Q_ART[v].name, 50, 31);
  ctx.restore();
}
// Band unten: drei Felder für die drei Abschnitte, ohne Schrift
function _n9qBand(ctx, s, H) {
  const bw = 40, luft = 6, x0 = 264 - (3 * bw + 2 * luft) / 2, y = H - 14;
  ctx.save();
  _N9Q_ABSCHNITT.forEach((ab, k) => {
    const x = x0 + k * (bw + luft), u = _n9qKl((s - ab[0]) / (ab[1] - ab[0]));
    ctx.fillStyle = '#dbe4ea'; _bioFxRundRect(ctx, x, y, bw, 6, 3); ctx.fill();
    if (u > 0.01) { ctx.fillStyle = '#f59e0b'; _bioFxRundRect(ctx, x, y, Math.max(6, bw * u), 6, 3); ctx.fill(); }
  });
  ctx.restore();
}
function _n9qDraw(ctx, cv) {
  if (!_n9q) return;
  const W = cv.width, H = cv.height, t = _n9q.t, g = _n9qGeo();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = _N9Q_HG; ctx.fillRect(0, 0, W, H);
  _n9qKern(ctx, t, !g);
  _n9qBeschriftung(ctx);
  _n9qSchild(ctx);
  if (g) {
    _n9qKegel(ctx, g);
    if (g.rahmen > 0.01) _n9qRahmenFlaeche(ctx, g.rahmen);
    _n9qLeiter(ctx, g, t);
    if (g.rahmen > 0.01) _n9qRahmenRand(ctx, g.rahmen, t);
    _n9qRing(ctx, g.kegel);
    _n9qStrangNamen(ctx, g);
    if (_n9q.phase === 'lauf') _n9qBand(ctx, _n9q.s, H);
  }
  _bioFxAlleDraw(ctx, _n9q.fx);
}
