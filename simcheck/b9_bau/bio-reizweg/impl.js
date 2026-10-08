
// ════════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER – br2 „Kino im Kopf“  (Kennung bio-reizweg, Praefix _n9b)
// Bauplan: arbeitsheft_bio_foe9/einheiten/br2.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250, dunkler Kinosaal):
//   - links oben die Leinwand mit einer bunten Landschaft (Wolke zieht),
//     darunter an der Wand der Lautsprecher.
//   - Lina von der Seite, Blick nach links zur Leinwand. Ihr Kopf ist gross
//     und schematisch geoeffnet: das Gehirn von der Seite in Hellgrau, OHNE
//     Beschriftung (Furchen nur als feine Linien), darunter Kleinhirn und
//     Hirnstamm, der als Rueckenmark in den Hals laeuft.
//   - Auge (Augapfel offen gezeichnet, kleine Punkte in der Netzhaut), Ohr
//     (Ohrmuschel, dahinter die kleine Schnecke mit Punkten) und Linas Hand
//     auf der Armlehne (Punkte in der Haut). Die Punkte sind die
//     Sinneszellen – das Wort steht NICHT am Bildschirm.
//   - bei „Berührung“ schiebt sich Deniz' Arm von links ins Bild.
//   Beschriftet sind nur Leinwand, Lautsprecher, Auge, Ohr, Haut der Hand,
//   Lina und Deniz. Das Gehirn traegt keine Beschriftung.
//
// BEDIENUNG (woertlich):
//   Wahlgruppe „Reiz“: „Licht“ · „Ton“ · „Berührung“   (_n9bReiz('…'))
//   „▶ Reiz senden“ (_n9bSenden) · „neu“ (_n9bNeu)
//   Ein anderer Reiz stellt alles zurueck (Gehirn wieder grau).
//
// ABLAUF nach „▶ Reiz senden“ (verlangsamt, zusammen 3,3 s):
//   0,0–0,8 s  der Reiz: Lichtstrahlen von der Leinwand zum Auge · Schall-
//              boegen vom Lautsprecher zum Ohr · Deniz tippt auf Linas Hand
//   0,8–1,3 s  die Punkte im Auge / im Ohr / in der Haut der Hand leuchten
//              nacheinander gelb auf und bleiben hell
//   1,3–3,3 s  ein gelber Lichtpunkt laeuft den Nerv entlang ins Gehirn
//              (2,0 s, eine gelbe Spur bleibt stehen)
//   3,3 s      im Gehirn leuchtet EINE Stelle gelb auf und bleibt hell:
//                Licht      → ganz hinten im Kopf (Sehrinde)
//                Ton        → seitlich, direkt ueber dem Ohr (Hoerrinde)
//                Berührung  → Streifen oben in der Mitte (hinter der
//                             Zentralfurche)
//
// STATUSZEILEN (woertlich, _n9b-status):
//   vor dem Senden   „Noch ist nichts im Gehirn angekommen.“
//   0,0–1,3 s        „Der Reiz ist unterwegs …“
//   1,3–3,3 s        „Der gelbe Lichtpunkt läuft ins Gehirn …“
//   angekommen       „Lina sieht den Film.“ · „Lina hört die Musik.“ ·
//                    „Lina spürt die Hand.“
//   Hinweis (_n9b-hinweis): „Reiz: Licht. Drücke „▶ Reiz senden“.“ usw.
//
// WERTE (sim_plan.werte = lehrer.tabelle_erwartet, Spalten 2 und 3):
//   Licht      Auge leuchtet           · Stelle ganz hinten im Kopf leuchtet
//   Ton        Ohr leuchtet            · Stelle seitlich ueber dem Ohr leuchtet
//   Berührung  Haut der Hand leuchtet  · Streifen oben in der Mitte leuchtet
//   Spalte 3 ist BEOBACHTUNG (Lagewoerter stehen bewusst nicht am Schirm).
//
// AHA (_bioFx, ruhig, OHNE Textstreifen): bei jeder Ankunft ein Lichtring
//   und ein paar Funken an der Stelle. Beim Licht laeuft der Punkt am
//   vorderen Gehirn vorbei bis ganz nach hinten – sichtbar weit weg vom
//   Auge (widerlegt Vermutung C). Sind alle drei Reize angekommen, erscheinen
//   fuer 5 s auch die beiden anderen Stellen und Wege gestrichelt, jede mit
//   einem Lichtring: drei Reize, drei Stellen (widerlegt Vermutung B).
//   Kein Banner – ein Banner oben laege genau ueber dem Streifen.
//
// NICHT AM BILDSCHIRM (sim_plan.anzeigen, Merksatz und Aufgabe 2):
//   „Erregung“, „Sinneszellen“, „Nervenzelle“, „hinten“, „vorn“, „seitlich“,
//   „oben“, „verschiedenen“ – auch nicht als Wortteil. Keine Namen von
//   Hirnlappen. Bedienwort ist immer „Drücke“.
// ════════════════════════════════════════════════════════════════════════
let _n9b = null;
const _N9B_REIZE = {
  licht:      { name: 'Licht',     status: 'Lina sieht den Film.' },
  ton:        { name: 'Ton',       status: 'Lina hört die Musik.' },
  beruehrung: { name: 'Berührung', status: 'Lina spürt die Hand.' }
};
const _N9B_REIHE = ['licht', 'ton', 'beruehrung'];
const _N9B_T = { REIZ: 0.8, ZELLEN: 1.3, ANKUNFT: 3.3 };   // s nach dem Senden
const _N9B_UEBER = 5.0;                                    // s: alle drei Stellen
// Nervenwege: von den Punkten im Sinnesorgan bis zur Mitte der Stelle im Gehirn.
const _N9B_WEG = {
  licht:      [[205, 102], [222, 94], [250, 86], [285, 84], [318, 84], [342, 86]],
  ton:        [[278, 148], [292, 142], [297, 126], [287, 114], [267, 110]],
  beruehrung: [[186, 216], [205, 219], [288, 219], [300, 206], [301, 182], [297, 126],
               [289, 94], [283, 64], [280, 46]]
};
// Stellen im Gehirn (in der Zeichnung grau, erst bei Ankunft gelb).
const _N9B_STELLE = {
  licht:      { art: 'oval', x: 342, y: 86, rx: 10, ry: 18, w: 0.18 },
  ton:        { art: 'oval', x: 266, y: 110, rx: 18, ry: 8, w: -0.12 },
  beruehrung: { art: 'band', p: [[290, 24], [284, 40], [277, 56], [272, 68]], b: 11 }
};
// Punkte im Sinnesorgan
const _N9B_AUGE = { x: 195, y: 102, r: 9 };
const _N9B_SCHNECKE = { x: 278, y: 148, r: 7 };
const _N9B_PUNKTE = {
  licht: [-0.95, -0.48, 0, 0.48, 0.95].map(a => [_N9B_AUGE.x + 7 * Math.cos(a), _N9B_AUGE.y + 7 * Math.sin(a)]),
  ton: [[272, 145], [276, 152], [283, 150], [283, 144], [278, 146]],
  beruehrung: [[178, 216], [185, 214], [192, 213], [199, 214], [189, 218]]
};
const _N9B_TIPP = [190, 212];                      // dort tippt Deniz auf die Hand

function _n9bInit() {
  _n9b = { t: 0, reiz: 'licht', phase: 'ruhe', s: 0, da: 0, gesehen: {},
           ueber: null, ueberGezeigt: false, deniz: 0, letzt: '', letztH: '',
           fx: { teile: [] } };
}

// ── Bedienung ─────────────────────────────────────────────────────────────
function _n9bZurueck() {
  const z = _n9b;
  z.phase = 'ruhe'; z.s = 0; z.da = 0; z.ueber = null; z.fx = { teile: [] };
}
function _n9bReiz(r) {
  if (!_n9b || !_N9B_REIZE[r]) return;
  _n9b.reiz = r;
  _n9bZurueck();
  _n9bStatus();
}
function _n9bSenden() {
  const z = _n9b;
  if (!z || z.phase === 'laeuft') return;
  _n9bZurueck();
  z.phase = 'laeuft';
  _n9bStatus();
}
function _n9bNeu() {
  if (!_n9b) return;
  _n9b.reiz = 'licht';
  _n9b.gesehen = {}; _n9b.ueberGezeigt = false;
  _n9bZurueck();
  _n9bStatus();
}

// ── Anzeige ───────────────────────────────────────────────────────────────
function _n9bAlleGesehen() {
  return _N9B_REIHE.every(r => _n9b.gesehen[r]);
}
function _n9bZeile() {
  const z = _n9b;
  if (z.phase === 'ruhe') return 'Noch ist nichts im Gehirn angekommen.';
  if (z.phase === 'da') return _N9B_REIZE[z.reiz].status;
  return z.s < _N9B_T.ZELLEN ? 'Der Reiz ist unterwegs …' : 'Der gelbe Lichtpunkt läuft ins Gehirn …';
}
function _n9bHinweis() {
  const z = _n9b;
  if (z.phase === 'ruhe') return 'Reiz: ' + _N9B_REIZE[z.reiz].name + '. Drücke „▶ Reiz senden“.';
  if (z.phase === 'laeuft') return z.s < _N9B_T.ZELLEN ? 'Sieh genau hin: Was leuchtet zuerst auf?'
                                                       : 'Folge dem gelben Lichtpunkt mit den Augen.';
  if (_n9bAlleGesehen()) return 'Alle drei Reize sind angekommen. Vergleiche die Stellen im Gehirn.';
  return 'Wo leuchtet das Gehirn? Stelle danach einen anderen Reiz ein.';
}
function _n9bStatus() {
  if (!_n9b) return;
  const z = _n9b, s = _n9bZeile(), h = _n9bHinweis();
  const el = document.getElementById('_n9b-status');
  if (el) { el.textContent = s; el.className = 'lmp-status on'; }
  const hi = document.getElementById('_n9b-hinweis');
  if (hi) hi.textContent = h;
  z.letzt = s; z.letztH = h;
  try {
    document.querySelectorAll('[data-n9b]').forEach(b => {
      const r = b.getAttribute('data-n9b');
      if (b.classList) b.classList.toggle('primary', r === z.reiz);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9b-los');
  if (los && los.classList) los.classList.toggle('primary', z.phase !== 'laeuft');
}
function _n9bHTML() {
  const k = r => `<button class="sim-btn${r === 'licht' ? ' primary' : ''}" data-n9b="${r}" onclick="_n9bReiz('${r}')">${_N9B_REIZE[r].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie kommt ein Reiz ins Gehirn?</h3>
    <div class="fpm-note" style="margin-top:2px">Lina sitzt im Kino. Ihr Kopf ist offen gezeichnet. So siehst du ihr Gehirn (grau). Stelle einen Reiz ein und sende ihn los.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9b-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9b-los" onclick="_n9bSenden()">▶ Reiz senden</button>
          <button class="sim-btn" onclick="_n9bNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Reiz</span>
          <div class="sim-btn-row">${_N9B_REIHE.map(k).join('')}</div>
        </div>
        <div class="fpm-label" style="margin-top:10px">Was nimmt Lina wahr?</div>
        <div class="lmp-status on" id="_n9b-status" style="margin-top:6px"></div>
        <div class="fpm-note" id="_n9b-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Die kleinen Punkte in Auge, Ohr und Haut leuchten auf, wenn ein Reiz sie trifft.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Reiz „Licht“ &nbsp;|&nbsp; Der Lichtpunkt ist stark verlangsamt. In echt geht alles viel schneller.</p>
  </div>`;
}

// ── Ablauf ────────────────────────────────────────────────────────────────
function _n9bUpdate(dt) {
  if (!_n9b) return;
  dt = _bioFxDt(dt);
  const z = _n9b;
  z.t += dt;
  // Deniz' Arm gleitet bei „Berührung“ ins Bild, sonst hinaus
  const soll = z.reiz === 'beruehrung' ? 1 : 0;
  if (z.deniz < soll) z.deniz = Math.min(soll, z.deniz + dt / 0.5);
  else if (z.deniz > soll) z.deniz = Math.max(soll, z.deniz - dt / 0.4);
  if (z.phase === 'laeuft') {
    z.s += dt;
    if (z.s >= _N9B_T.ANKUNFT) _n9bAngekommen();
  } else if (z.phase === 'da') {
    z.da += dt;
  }
  if (z.ueber) {
    const u = z.ueber;
    u.alter += dt;
    if (u.alter >= 0 && !u.wellen) {
      u.wellen = true;
      _N9B_REIHE.filter(r => r !== z.reiz).forEach(r => {
        const m = _n9bStellenMitte(r);
        _bioFxWelle(z.fx.teile, m[0], m[1], '#fde68a', 30);
      });
    }
    if (u.alter >= _N9B_UEBER) z.ueber = null;
  }
  if (_n9bZeile() !== z.letzt || _n9bHinweis() !== z.letztH) _n9bStatus();
  _bioFxAlleUpdate(z.fx, dt);
}
function _n9bAngekommen() {
  const z = _n9b;
  z.phase = 'da'; z.s = _N9B_T.ANKUNFT; z.da = 0;
  z.gesehen[z.reiz] = true;
  const m = _n9bStellenMitte(z.reiz);
  _bioFxWelle(z.fx.teile, m[0], m[1], '#fde047', 36);
  _bioFxFunken(z.fx.teile, m[0], m[1], 7, ['#fde047', '#fff7c2', '#ffffff']);
  if (_n9bAlleGesehen() && !z.ueberGezeigt) {
    z.ueberGezeigt = true;
    z.ueber = { alter: -0.9, wellen: false };          // erst hinsehen, dann der Ueberblick
  }
  _n9bStatus();
}

// ── Geometrie ─────────────────────────────────────────────────────────────
function _n9bStellenMitte(r) {
  const st = _N9B_STELLE[r];
  if (st.art === 'oval') return [st.x, st.y];
  const p = st.p;
  return [(p[1][0] + p[2][0]) / 2, (p[1][1] + p[2][1]) / 2];
}
function _n9bLaenge(weg) {
  let L = 0;
  for (let i = 1; i < weg.length; i++) L += Math.hypot(weg[i][0] - weg[i - 1][0], weg[i][1] - weg[i - 1][1]);
  return L;
}
// Punkt bei Anteil u (0..1) der Weglaenge
function _n9bPunkt(weg, u) {
  let rest = _n9bLaenge(weg) * _bioFxKlemme(u);
  for (let i = 1; i < weg.length; i++) {
    const a = weg[i - 1], b = weg[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (rest <= l || i === weg.length - 1) {
      const k = l > 0 ? Math.min(1, rest / l) : 0;
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    }
    rest -= l;
  }
  return weg[weg.length - 1].slice();
}
// Weg bis zum Anteil u als Linie
function _n9bWegZeichnen(ctx, weg, u) {
  const L = _n9bLaenge(weg) * _bioFxKlemme(u);
  let rest = L;
  ctx.beginPath(); ctx.moveTo(weg[0][0], weg[0][1]);
  for (let i = 1; i < weg.length; i++) {
    const a = weg[i - 1], b = weg[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (rest >= l) { ctx.lineTo(b[0], b[1]); rest -= l; continue; }
    const k = l > 0 ? rest / l : 0;
    ctx.lineTo(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k);
    break;
  }
  ctx.stroke();
}

// ── Zeichnen: Saal, Leinwand, Lautsprecher ────────────────────────────────
function _n9bSaal(ctx, W, H, t, blitz) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#1e2340'); bg.addColorStop(1, '#10131f');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // Licht der Leinwand faellt weich in den Saal
  const g = ctx.createRadialGradient(64, 42, 10, 64, 42, 190);
  g.addColorStop(0, 'rgba(191,219,254,' + (0.16 + 0.22 * blitz).toFixed(3) + ')');
  g.addColorStop(1, 'rgba(191,219,254,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(64, 42, 190, 0, 2 * Math.PI); ctx.fill();
}
function _n9bLeinwand(ctx, t, blitz) {
  ctx.save();
  ctx.fillStyle = '#0b0d18'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, 8, 8, 112, 68, 3); ctx.fill(); ctx.stroke();
  const x0 = 12, y0 = 12, w = 104, h = 60;
  const himmel = ctx.createLinearGradient(0, y0, 0, y0 + h);
  himmel.addColorStop(0, '#7dd3fc'); himmel.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = himmel; ctx.fillRect(x0, y0, w, h);
  ctx.fillStyle = '#fde68a';
  ctx.beginPath(); ctx.arc(98, 24, 6.5, 0, 2 * Math.PI); ctx.fill();
  // Wolke zieht langsam ueber den Himmel (bleibt in der Leinwand)
  const wx = x0 + 14 + ((t * 5) % 72), wa = Math.min(1, (wx - x0 - 10) / 10, (x0 + w - 12 - wx) / 10);
  if (wa > 0) {
    ctx.globalAlpha = wa;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(wx, 25, 9, 4.5, 0, 0, 2 * Math.PI);
    ctx.ellipse(wx + 7, 22, 6, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // Huegel und ein Baum
  ctx.fillStyle = '#4ade80';
  ctx.beginPath(); ctx.moveTo(x0, y0 + 44);
  ctx.quadraticCurveTo(x0 + 30, y0 + 28, x0 + 60, y0 + 42);
  ctx.quadraticCurveTo(x0 + 84, y0 + 32, x0 + w, y0 + 40);
  ctx.lineTo(x0 + w, y0 + h); ctx.lineTo(x0, y0 + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#16a34a';
  ctx.beginPath(); ctx.moveTo(x0, y0 + 54);
  ctx.quadraticCurveTo(x0 + 50, y0 + 42, x0 + w, y0 + 56);
  ctx.lineTo(x0 + w, y0 + h); ctx.lineTo(x0, y0 + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#92400e'; ctx.fillRect(x0 + 26, y0 + 30, 3, 10);
  ctx.fillStyle = '#15803d';
  ctx.beginPath(); ctx.arc(x0 + 27.5, y0 + 28, 7, 0, 2 * Math.PI); ctx.fill();
  if (blitz > 0.01) {                                  // eine helle Szene
    ctx.fillStyle = 'rgba(255,255,255,' + (0.55 * blitz).toFixed(3) + ')';
    ctx.fillRect(x0, y0, w, h);
  }
  ctx.restore();
}
function _n9bLautsprecher(ctx, t, schwingt) {
  const x = 18, y = 100, w = 40, h = 46;
  const zit = schwingt > 0 ? Math.sin(t * 2 * Math.PI * 9) * 1.4 * schwingt : 0;
  ctx.save();
  ctx.fillStyle = '#334155'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, x, y, w, h, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#94a3b8';
  ctx.beginPath(); ctx.arc(x + w / 2, y + 15, 9 + zit, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + w / 2, y + 35, 5.5 + zit * 0.6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.beginPath(); ctx.arc(x + w / 2, y + 15, 3, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
// Schallboegen vom Lautsprecher Richtung Ohr. nahe = nur das Stueck am Ohr.
function _n9bSchall(ctx, s, nahe) {
  const qx = 58, qy = 115, zx = 252, zy = 147;
  const D = Math.hypot(zx - qx, zy - qy), rw = Math.atan2(zy - qy, zx - qx);
  ctx.save();
  ctx.lineCap = 'round';
  for (let j = 0; j < 3; j++) {
    const p = (s - j * 0.14) / 0.62;
    if (p <= 0 || p >= 1.08) continue;
    const r = Math.min(1, p) * D;
    const a = nahe ? (r > D - 26 ? 0.9 : 0) : Math.max(0, 0.85 - 0.35 * p);
    if (a <= 0.02) continue;
    const off = nahe ? 0.055 : 0.2;
    ctx.strokeStyle = 'rgba(147,197,253,' + a.toFixed(3) + ')';
    ctx.lineWidth = nahe ? 2.6 : 2.4;
    ctx.beginPath(); ctx.arc(qx, qy, Math.max(2, r), rw - off, rw + off); ctx.stroke();
  }
  ctx.restore();
}
// Lichtstrahlen von der Leinwand ins Auge
function _n9bLicht(ctx, s) {
  const zx = 187, zy = 102;
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const sx = 120, sy = 18 + i * 10;
    const p = _bioFxKlemme((s - i * 0.04) / 0.6);
    const ein = _bioFxKlemme(s / 0.15), aus = 1 - _bioFxKlemme((s - 0.7) / 0.25);
    ctx.strokeStyle = 'rgba(254,249,195,' + (0.28 * ein * aus).toFixed(3) + ')';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(zx, zy); ctx.stroke();
    if (p > 0 && p < 1) {
      const x = sx + (zx - sx) * p, y = sy + (zy - sy) * p;
      const dx = (zx - sx), dy = (zy - sy), l = Math.hypot(dx, dy);
      ctx.strokeStyle = 'rgba(255,251,214,0.95)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x - dx / l * 9, y - dy / l * 9); ctx.lineTo(x, y); ctx.stroke();
    }
  }
  ctx.restore();
}

// ── Zeichnen: Lina ────────────────────────────────────────────────────────
function _n9bKopfPfad(ctx) {
  ctx.beginPath();
  ctx.moveTo(268, 10);                                   // Scheitel
  ctx.bezierCurveTo(322, 10, 360, 50, 360, 100);         // Hinterkopf
  ctx.bezierCurveTo(360, 142, 340, 168, 316, 182);       // Nacken
  ctx.lineTo(314, 212);                                  // Hals, hinten
  ctx.lineTo(252, 212);
  ctx.lineTo(250, 194);                                  // Hals, vorn
  ctx.quadraticCurveTo(232, 180, 204, 177);              // unter dem Kinn
  ctx.quadraticCurveTo(186, 174, 182, 164);              // Kinn
  ctx.quadraticCurveTo(178, 157, 177, 151);
  ctx.quadraticCurveTo(171, 147, 175, 142);              // Unterlippe
  ctx.quadraticCurveTo(170, 138, 174, 134);              // Oberlippe
  ctx.lineTo(172, 127);
  ctx.quadraticCurveTo(162, 125, 159, 119);              // Nasenspitze
  ctx.quadraticCurveTo(170, 104, 180, 92);               // Nasenruecken
  ctx.quadraticCurveTo(176, 84, 178, 76);                // Braue
  ctx.bezierCurveTo(180, 38, 214, 10, 268, 10);          // Stirn
  ctx.closePath();
}
function _n9bGehirnPfad(ctx) {
  ctx.beginPath();
  ctx.moveTo(190, 84);
  ctx.bezierCurveTo(180, 60, 196, 26, 240, 21);
  ctx.bezierCurveTo(276, 14, 318, 22, 340, 46);
  ctx.bezierCurveTo(356, 62, 358, 84, 352, 100);
  ctx.bezierCurveTo(348, 110, 338, 114, 326, 112);
  ctx.bezierCurveTo(312, 118, 296, 126, 280, 128);
  ctx.bezierCurveTo(262, 130, 244, 128, 236, 120);
  ctx.bezierCurveTo(228, 112, 228, 100, 236, 94);
  ctx.bezierCurveTo(226, 90, 206, 92, 190, 84);
  ctx.closePath();
}
function _n9bKoerper(ctx) {
  ctx.save();
  // Kinosessel hinter Lina
  ctx.fillStyle = '#5b1720'; ctx.strokeStyle = '#7f1d2d'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, 334, 132, 80, 130, 18); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#6d1b28';
  _bioFxRundRect(ctx, 344, 142, 60, 110, 12); ctx.fill();
  // Oberkoerper
  ctx.fillStyle = '#0f766e'; ctx.strokeStyle = '#115e59'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(232, 252); ctx.lineTo(234, 222);
  ctx.quadraticCurveTo(238, 205, 260, 203);
  ctx.lineTo(318, 203);
  ctx.quadraticCurveTo(348, 205, 352, 226);
  ctx.lineTo(354, 252); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function _n9bHaare(ctx, t) {
  ctx.save();
  ctx.fillStyle = '#4a2c1d';
  // Pferdeschwanz, schwingt leicht
  const sw = Math.sin(t * 1.3) * 0.06;
  ctx.save(); ctx.translate(356, 58); ctx.rotate(-0.5 + sw);
  ctx.beginPath(); ctx.ellipse(0, 30, 9, 30, 0, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = '#f472b6';
  _bioFxRundRect(ctx, -7, 4, 14, 6, 3); ctx.fill();
  ctx.fillStyle = '#4a2c1d';
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(180, 74);
  ctx.bezierCurveTo(178, 30, 214, 4, 268, 4);
  ctx.bezierCurveTo(326, 4, 366, 46, 366, 100);
  ctx.bezierCurveTo(366, 140, 350, 160, 330, 172);
  ctx.lineTo(320, 150); ctx.lineTo(200, 60); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function _n9bKopf(ctx, t) {
  ctx.save();
  ctx.fillStyle = '#f2c9a0'; ctx.strokeStyle = '#b9825a'; ctx.lineWidth = 1.6;
  _n9bKopfPfad(ctx); ctx.fill(); ctx.stroke();
  // offen: Knochenrand um Gehirn, Kleinhirn und Hirnstamm
  ctx.strokeStyle = '#f6ead7'; ctx.lineWidth = 9; ctx.lineJoin = 'round';
  _n9bGehirnPfad(ctx); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(322, 122, 21, 11, 0.1, 0, 2 * Math.PI); ctx.stroke();
  ctx.lineWidth = 6;
  _bioFxRundRect(ctx, 291, 112, 12, 70, 6); ctx.stroke();
  // Rueckenmark im Hals (offen)
  ctx.fillStyle = '#f6ead7';
  _bioFxRundRect(ctx, 293, 176, 10, 36, 4); ctx.fill();
  ctx.fillStyle = '#e2e4e9';
  _bioFxRundRect(ctx, 295.5, 176, 5, 36, 2.5); ctx.fill();
  // Hirnstamm
  ctx.fillStyle = '#e2e4e9'; ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, 291, 112, 12, 70, 6); ctx.fill(); ctx.stroke();
  // Kleinhirn
  ctx.beginPath(); ctx.ellipse(322, 122, 21, 11, 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = '#dcdfe5'; ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#b6bbc4'; ctx.lineWidth = 1;
  for (const k of [-5, 0, 5]) {
    ctx.beginPath(); ctx.ellipse(322, 122 + k, 17 - Math.abs(k), 2.5, 0.1, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
  }
  // Grosshirn, hellgrau, ohne Beschriftung
  ctx.fillStyle = '#e5e7eb'; ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1.6;
  _n9bGehirnPfad(ctx); ctx.fill(); ctx.stroke();
  // Furchen als feine Linien
  ctx.strokeStyle = '#b3b8c2'; ctx.lineWidth = 1.3; ctx.lineCap = 'round';
  const linie = (pts) => {
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 4) ctx.quadraticCurveTo(pts[i], pts[i + 1], pts[i + 2], pts[i + 3]);
    ctx.stroke();
  };
  linie([236, 96, 270, 86, 306, 76]);                    // seitliche Furche
  linie([280, 20, 274, 38, 268, 54, 262, 70, 258, 80]);  // Zentralfurche
  linie([202, 50, 220, 42, 236, 52]);
  linie([204, 70, 226, 62, 246, 72]);
  linie([230, 30, 246, 40, 252, 60]);
  linie([302, 40, 316, 48, 330, 42]);
  linie([304, 62, 320, 70, 336, 62]);
  linie([316, 86, 326, 96, 340, 104]);
  linie([248, 122, 274, 116, 302, 118]);
  ctx.restore();
}
function _n9bGesicht(ctx, t) {
  ctx.save();
  // Augenbraue, Nasenloch, Mund
  ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(180, 88); ctx.quadraticCurveTo(188, 85, 196, 88); ctx.stroke();
  ctx.strokeStyle = '#b9825a'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(166, 123); ctx.quadraticCurveTo(170, 124, 172, 122); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(175, 142); ctx.lineTo(183, 142); ctx.stroke();
  // Auge, offen gezeichnet: Augapfel mit Linse vorn und Netzhaut hinten
  const a = _N9B_AUGE;
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#f9a8a8'; ctx.lineWidth = 2;                  // Netzhaut
  ctx.beginPath(); ctx.arc(a.x, a.y, a.r - 1.6, -1.15, 1.15); ctx.stroke();
  ctx.fillStyle = '#7c5a3a';                                       // Iris
  ctx.beginPath(); ctx.ellipse(a.x - a.r + 1.4, a.y, 1.8, 4.6, 0, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = 'rgba(186,230,253,0.9)'; ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(a.x - a.r + 4.2, a.y, 1.8, 3.6, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  // Lid und Wimpern auf dem Profil (blinzelt selten)
  const zu = (t % 5.2) > 5.05 ? 1 : 0;
  ctx.strokeStyle = '#4a2c1d'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(a.x, a.y, a.r + 1.5, Math.PI * 0.82, Math.PI * 1.22); ctx.stroke();
  if (zu) {
    ctx.fillStyle = '#f2c9a0';
    ctx.beginPath(); ctx.arc(a.x, a.y, a.r + 0.5, Math.PI * 0.7, Math.PI * 1.3); ctx.closePath(); ctx.fill();
  }
  ctx.beginPath(); ctx.moveTo(a.x - a.r, a.y - 4); ctx.lineTo(a.x - a.r - 4, a.y - 6); ctx.stroke();
  ctx.restore();
}
function _n9bOhr(ctx) {
  ctx.save();
  // Ohrmuschel
  ctx.fillStyle = '#e8b48c'; ctx.strokeStyle = '#b77b52'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(256, 146, 8, 14, 0.08, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(257, 145, 4.5, 9, 0.08, Math.PI * 1.2, Math.PI * 2.6); ctx.stroke();
  ctx.fillStyle = '#9a5b36';
  ctx.beginPath(); ctx.ellipse(258, 148, 1.8, 2.6, 0, 0, 2 * Math.PI); ctx.fill();
  // Gehoergang und Schnecke (offen)
  const s = _N9B_SCHNECKE;
  ctx.fillStyle = '#f6ead7';
  ctx.beginPath(); ctx.arc(s.x, s.y, s.r + 4, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = '#f6ead7'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(260, 148); ctx.lineTo(s.x - s.r, s.y); ctx.stroke();
  ctx.strokeStyle = '#d9a48a'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let th = 0; th <= 2.4 * Math.PI; th += 0.2) {
    const r = s.r * (1 - 0.7 * th / (2.4 * Math.PI)), x = s.x + r * Math.cos(th + Math.PI), y = s.y + r * Math.sin(th + Math.PI);
    if (th === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}
function _n9bArm(ctx) {
  ctx.save();
  // Armlehne
  ctx.fillStyle = '#4c1520'; ctx.strokeStyle = '#7f1d2d'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, 120, 226, 214, 9, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3b1018'; ctx.fillRect(318, 235, 10, 15);
  // Oberarm und Unterarm im Aermel
  ctx.lineCap = 'round'; ctx.strokeStyle = '#115e59'; ctx.lineWidth = 15;
  ctx.beginPath(); ctx.moveTo(302, 208); ctx.lineTo(290, 219); ctx.lineTo(210, 219); ctx.stroke();
  ctx.strokeStyle = '#0f766e'; ctx.lineWidth = 12.5;
  ctx.beginPath(); ctx.moveTo(302, 208); ctx.lineTo(290, 219); ctx.lineTo(210, 219); ctx.stroke();
  // Hand: Ruecken nach oben, Finger auf der Lehne
  ctx.fillStyle = '#f2c9a0'; ctx.strokeStyle = '#b9825a'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.ellipse(190, 219, 17, 7, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const y = 216 + i * 2.6;
    ctx.beginPath(); ctx.moveTo(176, y); ctx.lineTo(163 + i, y + 1.5);
    ctx.lineWidth = 3.4; ctx.strokeStyle = '#b9825a'; ctx.stroke();
    ctx.lineWidth = 2; ctx.strokeStyle = '#f2c9a0'; ctx.stroke();
  }
  ctx.fillStyle = '#f2c9a0'; ctx.strokeStyle = '#b9825a'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(198, 223, 6, 3, -0.2, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Deniz' Arm von links; Fingerspitze bei (tx, ty)
function _n9bDeniz(ctx, tx, ty, a) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(tx, ty); ctx.rotate(0.05);
  ctx.fillStyle = '#2563eb'; ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, -240, -18, 196, 17, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c98b5e'; ctx.strokeStyle = '#8a5a36';
  _bioFxRundRect(ctx, -48, -19, 30, 19, 8); ctx.fill(); ctx.stroke();
  _bioFxRundRect(ctx, -22, -8.5, 23, 7.5, 3.6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = '700 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Deniz', -96, -5.5);
  ctx.restore();
}

// ── Zeichnen: Leuchten ────────────────────────────────────────────────────
function _n9bGlut(ctx, x, y, r, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(253,224,71,' + (0.55 * a).toFixed(3) + ')');
  g.addColorStop(1, 'rgba(253,224,71,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
}
// Stelle im Gehirn: hell (a = Deckkraft) oder gestrichelt (Ueberblick)
function _n9bStelle(ctx, r, a, puls, strich) {
  const st = _N9B_STELLE[r];
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = a;
  if (st.art === 'oval') {
    if (!strich) _n9bGlut(ctx, st.x, st.y, Math.max(st.rx, st.ry) * (1.35 + 0.12 * puls), 0.8 + 0.2 * puls);
    ctx.beginPath(); ctx.ellipse(st.x, st.y, st.rx, st.ry, st.w, 0, 2 * Math.PI);
    ctx.fillStyle = strich ? 'rgba(253,224,71,0.28)' : '#fde047'; ctx.fill();
    ctx.strokeStyle = '#eab308'; ctx.lineWidth = strich ? 2 : 1.6;
    if (strich) ctx.setLineDash([4, 3]);
    ctx.stroke(); ctx.setLineDash([]);
  } else {
    const p = st.p;
    const band = (lw, farbe) => {
      ctx.strokeStyle = farbe; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
      ctx.stroke();
    };
    if (strich) {
      band(st.b, 'rgba(253,224,71,0.28)');
      ctx.setLineDash([4, 3]); band(2, '#eab308'); ctx.setLineDash([]);
    } else {
      band(st.b + 9 + 3 * puls, 'rgba(253,224,71,' + (0.22 + 0.1 * puls).toFixed(3) + ')');
      band(st.b + 2, '#eab308');
      band(st.b - 1, '#fde047');
    }
  }
  ctx.restore();
}
function _n9bPunkte(ctx, r, n, t) {
  const pts = _N9B_PUNKTE[r];
  ctx.save();
  for (let i = 0; i < pts.length; i++) {
    const an = i < n;
    if (an) _n9bGlut(ctx, pts[i][0], pts[i][1], 5.5, 0.9);
    ctx.fillStyle = an ? '#facc15' : (r === 'licht' ? '#e47d7d' : r === 'ton' ? '#b9785c' : '#c99474');
    ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], an ? 2.1 : 1.6, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}

// ── Draw ──────────────────────────────────────────────────────────────────
function _n9bDraw(ctx, cv) {
  if (!_n9b) return;
  const z = _n9b, W = cv.width, H = cv.height, t = z.t, r = z.reiz;
  const lauf = z.phase === 'laeuft', s = lauf ? z.s : (z.phase === 'da' ? _N9B_T.ANKUNFT : 0);
  const imReiz = lauf && s < _N9B_T.REIZ;
  const blitz = (r === 'licht' && imReiz) ? Math.sin(Math.PI * _bioFxKlemme(s / _N9B_T.REIZ)) : 0;
  ctx.clearRect(0, 0, W, H);
  _n9bSaal(ctx, W, H, t, blitz);
  _n9bLeinwand(ctx, t, blitz);
  _n9bLautsprecher(ctx, t, (r === 'ton' && imReiz) ? 1 : 0);
  if (r === 'ton' && imReiz) _n9bSchall(ctx, s, false);

  _n9bKoerper(ctx);
  _n9bHaare(ctx, t);
  _n9bKopf(ctx, t);
  _n9bGesicht(ctx, t);
  _n9bOhr(ctx);
  _n9bArm(ctx);

  // Wie viele Punkte im Sinnesorgan leuchten?
  const nPunkte = _N9B_PUNKTE[r].length;
  const n = s < _N9B_T.REIZ ? 0 : Math.min(nPunkte, 1 + Math.floor((s - _N9B_T.REIZ) / 0.09));
  const anOrgan = n > 0;

  // Ueberblick nach allen drei Reizen: die beiden anderen Wege und Stellen gestrichelt
  if (z.ueber && z.ueber.alter > 0) {
    const u = z.ueber.alter;
    const a = _bioFxKlemme(u / 0.4) * (1 - _bioFxKlemme((u - (_N9B_UEBER - 0.8)) / 0.8));
    for (const o of _N9B_REIHE) {
      if (o === r) continue;
      ctx.save(); ctx.globalAlpha = 0.75 * a;
      ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      _n9bWegZeichnen(ctx, _N9B_WEG[o], 1);
      ctx.restore();
      _n9bStelle(ctx, o, a, 0, true);
    }
  }

  // Nerv: erst sichtbar, wenn der Lichtpunkt losgeht; Spur bleibt gelb
  if (s >= _N9B_T.ZELLEN) {
    const weg = _N9B_WEG[r], u = (s - _N9B_T.ZELLEN) / (_N9B_T.ANKUNFT - _N9B_T.ZELLEN);
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(250,204,21,0.3)'; ctx.lineWidth = 2;
    _n9bWegZeichnen(ctx, weg, 1);
    ctx.strokeStyle = 'rgba(250,204,21,' + (lauf ? 0.95 : 0.7).toFixed(2) + ')'; ctx.lineWidth = 3;
    _n9bWegZeichnen(ctx, weg, u);
    ctx.restore();
    if (lauf) {
      const p = _n9bPunkt(weg, u);
      ctx.save();
      _n9bGlut(ctx, p[0], p[1], 13, 1);
      ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#fffbeb'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p[0], p[1], 4.6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }
  // Stelle im Gehirn: leuchtet auf und bleibt hell
  if (z.phase === 'da') {
    const puls = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 0.8);
    _n9bStelle(ctx, r, _bioFxKlemme(z.da / 0.35), puls, false);
  }
  // Sinnesorgan: Glanz und Punkte
  if (anOrgan) {
    ctx.save();
    const g = r === 'licht' ? [_N9B_AUGE.x, _N9B_AUGE.y, 15] : r === 'ton' ? [268, 147, 17] : [189, 217, 19];
    _n9bGlut(ctx, g[0], g[1], g[2], 0.7);
    ctx.restore();
  }
  _n9bPunkte(ctx, r, n, t);

  // Reiz, der gerade ankommt (vorn)
  if (r === 'licht' && imReiz) _n9bLicht(ctx, s);
  if (r === 'ton' && imReiz) _n9bSchall(ctx, s, true);
  if (z.deniz > 0.001) {
    const ein = _bioFxEase.sanft(z.deniz);
    let tx = _N9B_TIPP[0] - 14 + Math.sin(t * 1.6) * 1.5, ty = _N9B_TIPP[1] - 14 + Math.cos(t * 1.3) * 1.2;
    if (r === 'beruehrung' && lauf) {
      const hin = _bioFxEase.sanft(_bioFxKlemme(s / 0.4));
      const weg = _bioFxEase.sanft(_bioFxKlemme((s - _N9B_T.ZELLEN) / 0.5));
      const k = hin * (1 - weg);
      tx += (_N9B_TIPP[0] - tx) * k; ty += (_N9B_TIPP[1] - ty) * k;
      if (s > 0.4 && s < 0.75) {
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,' + (0.8 * (1 - (s - 0.4) / 0.35)).toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(_N9B_TIPP[0], _N9B_TIPP[1], 4 + (s - 0.4) * 30, 0, 2 * Math.PI); ctx.stroke();
        ctx.restore();
      }
    }
    _n9bDeniz(ctx, tx - (1 - ein) * 230, ty, Math.min(1, ein * 1.5));
  }

  // Beschriftung (das Gehirn bleibt ohne)
  ctx.save();
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center';
  ctx.fillStyle = '#cbd5e1'; ctx.font = '600 10px sans-serif';
  ctx.fillText('Leinwand', 64, 89);
  ctx.fillText('Lautsprecher', 38, 160);
  ctx.font = '700 11px sans-serif';
  ctx.fillText('Auge', 144, 108);
  ctx.strokeStyle = 'rgba(203,213,225,0.7)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(158, 105); ctx.lineTo(184, 103); ctx.stroke();
  ctx.fillText('Haut der Hand', 186, 247);
  ctx.fillStyle = '#7c4a2a';
  ctx.fillText('Ohr', 256, 177);
  ctx.fillStyle = '#ecfdf5';
  ctx.fillText('Lina', 282, 247);
  ctx.restore();

  _bioFxAlleDraw(ctx, z.fx);
}
