
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mf1 „Strecke oder Gerade?“ (Kennung m5-linien)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL3_PROFIL.md, Abschnitt m5-linien.
// Ueberschrift = Frage der Einheit: „Kann man die Länge einer Geraden messen?“
//
// Was man sieht: ein Blatt Karopapier auf einem Holztisch (der Tisch ist
// dunkler als das Blatt). Ein Kaestchen ist 0,5 cm (9 px), 1 cm sind 18 px.
// Auf dem Blatt liegen vier Punkte (dunkle Kreise mit Buchstaben): A und B
// waagerecht, 6 cm auseinander; C und D schraeg darunter, 4 cm auseinander.
// Das Blatt ist am Start 12 cm x 7,5 cm gross.
//   Strecke   Die Linie wird von P nach Q gezogen (P/Q = A/B bzw. C/D), mit
//             leuchtender Stiftspitze (0,6 s). Sie hoert sichtbar an beiden
//             Punkten auf: ein kleiner Querstrich und ein roter Ring an jedem
//             Ende – der erste Ring erscheint beim Losziehen, der zweite beim
//             Ankommen. Danach gleitet ein gelbes Lineal (0 bis 7 cm) an die
//             Linie (0,5 s), die 0 genau am ersten Punkt; ein gruener Streifen
//             waechst an der Kante von 0 bis zum zweiten Punkt (0,3 s), und die
//             Zahl dort (6 bzw. 4) steht weiss in einem gruenen Kreis.
//   Gerade    Die Linie waechst von der Mitte zwischen den beiden Punkten nach
//             beiden Seiten zugleich (0,75 s), laeuft durch die Punkte bis an
//             den Rand des Blatts und darueber hinaus 14 px in den Tisch; dort
//             verblasst sie und endet in zwei kleinen Pfeilen. Kein roter Ring.
//             Das Lineal legt sich an wie bei der Strecke (0 am ersten Punkt),
//             die Linie laeuft an beiden Enden ueber das Lineal hinaus; kein
//             gruener Streifen, keine Zahl im Kreis.
//   „Blatt vergrößern“  Das Blatt waechst in 0,9 s auf allen Seiten auf
//             19 cm x 11,5 cm; der Massstab bleibt (ein Kaestchen bleibt ein
//             Kaestchen, das Lineal bleibt liegen). Wo das Blatt vorher war,
//             bleibt ein gestrichelter Rand mit „Blatt vorher“. Eine Strecke
//             bleibt genau so, wie sie war (der gruene Streifen leuchtet kurz
//             nach). Eine Gerade waechst auf beiden Seiten mit dem Rand mit bis
//             an den neuen Rand und wieder in den Tisch; die neu dazugekommenen
//             Stuecke leuchten 2,5 s orange.
// Die Punkte der anderen Linie stehen blasser da, solange eine Linie gewaehlt
// ist. Ein Knopfdruck waehrend einer Bewegung laesst sie sofort fertig werden;
// dann geschieht das Neue. Jede Knopffolge endet so im selben Zustand.
//
// Texte neben der Leinwand (woertlich): oben „Auf dem Blatt liegen die Punkte
// A, B, C und D. Die ersten vier Knöpfe zeichnen eine Linie. Danach legt sich
// ein Lineal an die Linie.“ · rechts „„Blatt vergrößern“ macht das Blatt auf
// allen Seiten größer. Das Lineal bleibt liegen.“ · unten „Start: ein Blatt mit
// den Punkten A, B, C und D, noch keine Linie“. Im Bild stehen nur A, B, C, D,
// die Zahlen 0 bis 7 auf dem Lineal und „Blatt vorher“.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5mWahl('strecke-AB') usw.):
//     „Strecke AB“ · „Gerade AB“ · „Strecke CD“ · „Gerade CD“
//     Ist das Blatt gerade gross, schrumpft es zuerst zurueck (0,4 s), dann
//     wird gezeichnet. Der Knopf der gewaehlten Linie ist hervorgehoben.
//   „Blatt vergrößern“ (_m5mGross()) – ist das Blatt schon gross, wackelt es nur.
//   „neu“ (_m5mNeu()): keine Linie, kleines Blatt, alle Anzeigen auf „…“.
//
// Statuszeilen (woertlich):
//   _m5m-linie   „Gezeichnet: noch keine Linie“, nach einer Wahl sofort
//                „Gezeichnet: Strecke AB“ (bzw. Gerade AB, Strecke CD, Gerade CD)
//   _m5m-enden   „Anzahl der Endpunkte: …“, sobald die Linie fertig gezogen ist
//                „Anzahl der Endpunkte: 2“ bzw. „Anzahl der Endpunkte: 0“
//   _m5m-laenge  „Länge auf dem Lineal: …“, sobald das Lineal anliegt
//                „Länge auf dem Lineal: 6 cm“ (6 und cm mit U+00A0) bzw.
//                „Länge auf dem Lineal: keine“
//   _m5m-zoom    „Beim Vergrößern: …“, nach „Blatt vergrößern“
//                „Beim Vergrößern: Die Linie bleibt gleich lang.“ (Strecke) bzw.
//                „Beim Vergrößern: Die Linie wird auf beiden Seiten länger.“
//                (Gerade) bzw. „Beim Vergrößern: Es ist noch keine Linie
//                gezeichnet.“; eine neue Wahl setzt die Zeile auf „…“ zurueck.
// Alle Zeilen, deren Wert das Heft verlangt, haben mehr als 18 Zeichen
// (simfakten.js-Grenze). Farben: Endpunkte rot wie die Ringe, Laenge gruen
// wie der Streifen am Lineal, „länger“ orange wie die neuen Stuecke.
//
// Werte (Endpunkte · Laenge; jede Sprungmarke nachgerechnet mit
// simcheck/werte.js, die Animation ausgelaufen). Die Laenge kommt aus dem
// Abstand der Punkte im Bild (px : 18, gerundet):
//   Strecke AB  2 · 6 cm      Gerade AB  0 · keine
//   Strecke CD  2 · 4 cm      Gerade CD  0 · keine
//   „Blatt vergrößern“: Strecke -> „Die Linie bleibt gleich lang.“,
//                       Gerade  -> „Die Linie wird auf beiden Seiten länger.“
// Zeiten (Frames zu 16 ms): Strecke fertig nach 1,4 s (88 Frames), Gerade nach
// 1,25 s (79 Frames), bei grossem Blatt je 0,4 s mehr; „Blatt vergrößern“ nach
// 0,9 s (57 Frames). simfakten.js mit --frames=25 --verlauf=4 liest bis 125
// Frames – jeder Endwert steht also im Faktendump.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): „Blatt vergrößern“ bei einer
// Geraden – sobald das Blatt gross ist, laeuft an BEIDEN Pfeilen ein goldener
// Lichtring, und beide Pfeile leuchten 2,5 s nach. Das widerlegt die
// Vermutungen „Die Gerade ist 10 cm lang“ und „so lang wie das Blatt breit“:
// Das Blatt wird breiter, und die Gerade ist wieder bis an den Rand da.
//
// NICHT am Bildschirm (sim_plan.nicht_am_bildschirm): „weiter“, „hört auf“,
// „aufhören“, „unendlich“ – und keine Regel als Satz. Was eine Strecke und was
// eine Gerade ist, sagt kein Text; Ringe, Pfeile, Lineal und das grosse Blatt
// zeigen es. Keine Namen, keine Punkte, keine Zeit. Deterministisch, ohne
// Zufall: jede Zahl kommt aus den Punkten in _m5mPUNKT.
// ════════════════════════════════════════════════════════════════════════
let _m5m = null;
const _m5mK = {
  KAST: 9,                       // px je Kaestchen (0,5 cm im Modell)
  CM: 18,                        // px je cm
  NETZ_X: 102, NETZ_Y: 57,       // ein Gitterpunkt: alle Kaestchen haengen daran
  KLEIN: { x: 102, y: 57, w: 216, h: 135 },   // 24 x 15 Kaestchen = 12 cm x 7,5 cm
  GROSS: { x: 39, y: 21, w: 342, h: 207 },    // 38 x 23 Kaestchen = 19 cm x 11,5 cm
  TISCH: 14,                     // px: so weit sieht man eine Gerade auf dem Tisch
  L_VON: -9, L_BIS: 135,         // Lineal entlang der Linie: 0 bis 7 cm, je 0,5 cm Rand
  L_ABST: 7, L_BREIT: 24,        // Abstand des Lineals zur Linie, Breite des Lineals
  L_CM: 7,                       // groesste Zahl auf dem Lineal
  T_SCHRUMPF: 0.4, T_ZIEHEN_S: 0.6, T_ZIEHEN_G: 0.75, T_LINEAL: 0.5, T_BAND: 0.3,
  T_ZOOM: 0.9, T_POP: 0.25, T_LEUCHT: 2.5, T_GLANZ: 1.5, T_WACKEL: 0.45,
  F_LINIE: '#1d4ed8', F_ENDE: '#dc2626', F_LAENGE: '#047857', F_NEU: '#ea580c',
  F_PUNKT: '#334155', F_NETZ: '#d3e2f4', F_LINEAL: 'rgba(253,230,138,0.94)',
  F_LRAND: '#b45309', F_STRICH: '#713f12'
};
// Die vier Punkte. D liegt 4 cm von C entfernt, schraeg nach rechts oben
// (Steigung 0,375 je Laengeneinheit, also 1,5 cm hoeher auf 4 cm Weg).
const _m5mPUNKT = (() => {
  const C = { x: 129, y: 165 }, s = 0.375, c = Math.sqrt(1 - s * s), L = 4 * _m5mK.CM;
  return { A: { x: 156, y: 84 }, B: { x: 264, y: 84 }, C, D: { x: C.x + L * c, y: C.y - L * s } };
})();
// Buchstaben: A und B ueber dem Punkt, C und D darunter (dort liegt das Lineal nicht).
const _m5mSCHILD = { A: -15, B: -15, C: 25, D: 25 };
// seite: auf welcher Seite der Linie das Lineal liegt (+1 unter AB, -1 ueber CD)
const _m5mPAAR = { AB: { p: 'A', q: 'B', seite: 1 }, CD: { p: 'C', q: 'D', seite: -1 } };
const _m5mLINIEN = {
  'strecke-AB': { art: 'strecke', paar: 'AB', name: 'Strecke AB' },
  'gerade-AB':  { art: 'gerade',  paar: 'AB', name: 'Gerade AB' },
  'strecke-CD': { art: 'strecke', paar: 'CD', name: 'Strecke CD' },
  'gerade-CD':  { art: 'gerade',  paar: 'CD', name: 'Gerade CD' }
};
const _m5mREIHE = ['strecke-AB', 'gerade-AB', 'strecke-CD', 'gerade-CD'];

// ── Rechnung: Bild und Statuszeilen lesen nur hier ─────────────────────
function _m5mGeo(paarName) {
  const pa = _m5mPAAR[paarName], P = _m5mPUNKT[pa.p], Q = _m5mPUNKT[pa.q];
  const dx = Q.x - P.x, dy = Q.y - P.y, L = Math.hypot(dx, dy);
  return { P, Q, L, ux: dx / L, uy: dy / L, nx: -dy / L, ny: dx / L, seite: pa.seite };
}
// Laenge einer Strecke in cm, so wie das Lineal sie zeigt.
function _m5mCm(paarName) { return Math.round(_m5mGeo(paarName).L / _m5mK.CM); }
// Wo die Linie P + t*u das Rechteck r verlaesst: t von lo bis hi.
function _m5mSchnitt(g, r) {
  let lo = -Infinity, hi = Infinity;
  for (const [u, p, a, b] of [[g.ux, g.P.x, r.x, r.x + r.w], [g.uy, g.P.y, r.y, r.y + r.h]]) {
    if (Math.abs(u) < 1e-9) continue;
    const t1 = (a - p) / u, t2 = (b - p) / u;
    lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2));
  }
  return { lo, hi };
}
function _m5mPkt(g, t, w) { return { x: g.P.x + g.ux * t + g.nx * (w || 0), y: g.P.y + g.uy * t + g.ny * (w || 0) }; }
// Das Blatt, wie es gerade liegt (e = 0 klein, 1 gross).
function _m5mBlattRect(e) {
  const a = _m5mK.KLEIN, b = _m5mK.GROSS;
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, w: a.w + (b.w - a.w) * e, h: a.h + (b.h - a.h) * e };
}

function _m5mInit() {
  _m5m = { wahl: null, ablauf: [], blattE: 0, ziehen: 0, lineal: 0, band: 0,
           enden: null, laenge: null, zoomText: null,
           popQ: -1, glanzNeu: 0, glanzBand: 0, leucht: 0, wackel: 0,
           zeit: 0, fx: { teile: [] } };
}
function _m5mHTML() {
  const marke = k => `<button class="sim-btn" id="_m5m-b-${k}" onclick="_m5mWahl('${k}')">${_m5mLINIEN[k].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Kann man die Länge einer Geraden messen?</h3>
    <div class="fpm-note" style="margin-top:2px">Auf dem Blatt liegen die Punkte A, B, C und D. Die ersten vier Knöpfe zeichnen eine Linie. Danach legt sich ein Lineal an die Linie.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5m-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5mREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m5m-gross" onclick="_m5mGross()">Blatt vergrößern</button>
          <button class="sim-btn" onclick="_m5mNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5m-linie" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5m-enden" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5m-laenge" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5m-zoom" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">„Blatt vergrößern“ macht das Blatt auf allen Seiten größer. Das Lineal bleibt liegen.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: ein Blatt mit den Punkten A, B, C und D, noch keine Linie</p>
  </div>`;
}
function _m5mZeile(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}
function _m5mStatus() {
  if (!_m5m) return;
  const z = _m5m, K = _m5mK;
  const b = (s, f) => '<b style="color:' + f + '">' + s + '</b>';
  const L = z.wahl ? _m5mLINIEN[z.wahl] : null;
  _m5mZeile('_m5m-linie', 'Gezeichnet: ' + (L ? b(L.name, K.F_LINIE) : 'noch keine Linie'));
  _m5mZeile('_m5m-enden', 'Anzahl der Endpunkte: ' + (z.enden == null ? '…' : b(String(z.enden), K.F_ENDE)));
  _m5mZeile('_m5m-laenge', 'Länge auf dem Lineal: ' + (z.laenge == null ? '…' : b(z.laenge, K.F_LAENGE)));
  const zt = { strecke: b('Die Linie bleibt gleich lang.', K.F_LAENGE),
               gerade: b('Die Linie wird auf beiden Seiten länger.', K.F_NEU),
               leer: 'Es ist noch keine Linie gezeichnet.' }[z.zoomText];
  _m5mZeile('_m5m-zoom', 'Beim Vergrößern: ' + (zt || '…'));
  for (const k of _m5mREIHE) {
    const e = document.getElementById('_m5m-b-' + k);
    if (e && e.classList) e.classList.toggle('primary', k === z.wahl);
  }
}

// ── Ablauf: Schritte nacheinander, jeder mit Dauer ──────────────────────
// Ein Schritt setzt waehrend seiner Dauer einen Wert (0..1) und am Ende das,
// was die Statuszeilen zeigen. _m5mFertig() spult alles sofort ans Ende.
function _m5mSetze(ph, u) {
  const z = _m5m, e = _bioFxEase.sanft(u);
  if (ph.art === 'schrumpfen') z.blattE = ph.von * (1 - e);
  else if (ph.art === 'zoom') z.blattE = e;
  else if (ph.art === 'ziehen') z.ziehen = u;
  else if (ph.art === 'lineal') z.lineal = u;
  else if (ph.art === 'band') z.band = u;
}
function _m5mEnde(ph) {
  const z = _m5m, K = _m5mK;
  const L = z.wahl ? _m5mLINIEN[z.wahl] : null;
  if (ph.art === 'ziehen' && L) {
    z.enden = L.art === 'strecke' ? 2 : 0;
    if (L.art === 'strecke') z.popQ = 0;
  } else if (ph.art === 'lineal' && L && L.art === 'gerade') {
    z.laenge = 'keine';
  } else if (ph.art === 'band' && L) {
    z.laenge = _m5mCm(L.paar) + '\u00a0cm';
  } else if (ph.art === 'zoom') {
    z.zoomText = L ? L.art : 'leer';
    if (L && L.art === 'gerade') {
      // Aha: an beiden Pfeilen ein Lichtring, die neuen Stuecke leuchten.
      const g = _m5mGeo(L.paar), s = _m5mSchnitt(g, K.GROSS);
      for (const t of [s.lo - K.TISCH, s.hi + K.TISCH]) {
        const p = _m5mPkt(g, t);
        _bioFxWelle(z.fx.teile, p.x, p.y, '#f59e0b', 22);
      }
      z.leucht = K.T_LEUCHT; z.glanzNeu = K.T_LEUCHT;
    } else if (L) z.glanzBand = K.T_GLANZ;
  }
  _m5mStatus();
}
function _m5mFertig() {
  const z = _m5m;
  while (z.ablauf.length) { const ph = z.ablauf.shift(); _m5mSetze(ph, 1); _m5mEnde(ph); }
  if (z.popQ >= 0) z.popQ = _m5mK.T_POP;
}
// Alles zuruecksetzen, was zu einer Linie gehoert (Blatt bleibt, wie es ist).
function _m5mLeeren() {
  const z = _m5m;
  z.wahl = null; z.ziehen = 0; z.lineal = 0; z.band = 0;
  z.enden = null; z.laenge = null; z.zoomText = null;
  z.popQ = -1; z.glanzNeu = 0; z.glanzBand = 0; z.leucht = 0;
  z.fx.teile.length = 0;
}
function _m5mSchrumpfen() {
  const z = _m5m;
  if (z.blattE > 0) z.ablauf.push({ art: 'schrumpfen', dauer: _m5mK.T_SCHRUMPF, t: 0, von: z.blattE });
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m5mWahl(k) {
  if (!_m5m || !_m5mLINIEN[k]) return;
  _m5mFertig();
  const z = _m5m, K = _m5mK, strecke = _m5mLINIEN[k].art === 'strecke';
  _m5mLeeren();
  z.wahl = k;
  _m5mSchrumpfen();
  z.ablauf.push({ art: 'ziehen', dauer: strecke ? K.T_ZIEHEN_S : K.T_ZIEHEN_G, t: 0 });
  z.ablauf.push({ art: 'lineal', dauer: K.T_LINEAL, t: 0 });
  if (strecke) z.ablauf.push({ art: 'band', dauer: K.T_BAND, t: 0 });
  _m5mStatus();
}
function _m5mGross() {
  if (!_m5m) return;
  _m5mFertig();
  const z = _m5m;
  if (z.blattE >= 1 - 1e-9) { z.wackel = _m5mK.T_WACKEL; return; }
  z.glanzBand = 0;
  z.ablauf.push({ art: 'zoom', dauer: _m5mK.T_ZOOM, t: 0 });
  _m5mStatus();
}
function _m5mNeu() {
  if (!_m5m) return;
  _m5mFertig();
  _m5mLeeren();
  _m5mSchrumpfen();
  _m5mStatus();
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5mUpdate(dt) {
  if (!_m5m) return;
  dt = _bioFxDt(dt);
  const z = _m5m, K = _m5mK;
  z.zeit += dt;
  let rest = dt;
  while (z.ablauf.length && rest > 0) {
    const ph = z.ablauf[0];
    ph.t += rest; rest = 0;
    if (ph.t >= ph.dauer) {
      rest = ph.t - ph.dauer;
      z.ablauf.shift();
      _m5mSetze(ph, 1);
      _m5mEnde(ph);
    } else _m5mSetze(ph, ph.t / ph.dauer);
  }
  if (z.popQ >= 0) z.popQ = Math.min(K.T_POP, z.popQ + dt);
  z.glanzNeu = Math.max(0, z.glanzNeu - dt);
  z.glanzBand = Math.max(0, z.glanzBand - dt);
  z.leucht = Math.max(0, z.leucht - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5mTisch(ctx, W, H) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#cfb184'); bg.addColorStop(1, '#c2a170');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.strokeStyle = 'rgba(120,80,35,0.16)'; ctx.lineWidth = 1.5;   // Maserung
  for (const y of [18, 47, 83, 121, 152, 188, 226]) {
    ctx.beginPath(); ctx.moveTo(0, y);
    ctx.quadraticCurveTo(W * 0.35, y + 5, W * 0.6, y - 2);
    ctx.quadraticCurveTo(W * 0.8, y - 6, W, y + 3);
    ctx.stroke();
  }
  ctx.restore();
}
function _m5mBlatt(ctx, r) {
  const K = _m5mK;
  ctx.save();
  ctx.fillStyle = 'rgba(70,45,10,0.25)';                    // Schatten
  ctx.fillRect(r.x + 3, r.y + 4, r.w, r.h);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = K.F_NETZ; ctx.lineWidth = 1;            // Kaestchen
  const k0 = Math.ceil((r.x - K.NETZ_X) / K.KAST - 1e-6), k1 = Math.floor((r.x + r.w - K.NETZ_X) / K.KAST + 1e-6);
  for (let k = k0; k <= k1; k++) {
    const x = K.NETZ_X + k * K.KAST;
    ctx.beginPath(); ctx.moveTo(x, r.y); ctx.lineTo(x, r.y + r.h); ctx.stroke();
  }
  const j0 = Math.ceil((r.y - K.NETZ_Y) / K.KAST - 1e-6), j1 = Math.floor((r.y + r.h - K.NETZ_Y) / K.KAST + 1e-6);
  for (let j = j0; j <= j1; j++) {
    const y = K.NETZ_Y + j * K.KAST;
    ctx.beginPath(); ctx.moveTo(r.x, y); ctx.lineTo(r.x + r.w, y); ctx.stroke();
  }
  ctx.strokeStyle = '#a8b4c4'; ctx.lineWidth = 1.2;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.restore();
}
// Wo das Blatt vorher lag: gestrichelter Rand, sobald es waechst.
function _m5mVorher(ctx, e) {
  if (e <= 0.01) return;
  const K = _m5mK, r = K.KLEIN;
  ctx.save();
  ctx.globalAlpha = Math.min(1, e * 1.6);
  ctx.setLineDash([6, 4]); ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.setLineDash([]);
  ctx.fillStyle = '#475569'; ctx.font = '600 11px sans-serif';
  ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Blatt vorher', r.x + r.w - 5, r.y + r.h - 5);
  ctx.restore();
}
// Das Lineal, an die Linie gelegt: 0 am ersten Punkt. ein = 0..1 (gleitet an),
// band = 0..1 (gruener Streifen bis zum zweiten Punkt, nur bei der Strecke).
function _m5mLineal(ctx, g, ein, band, glanz) {
  const K = _m5mK, s = g.seite;
  if (ein <= 0) return;
  const e = _bioFxEase.sanft(Math.min(1, ein));
  ctx.save();
  ctx.translate(g.P.x, g.P.y);
  ctx.rotate(Math.atan2(g.uy, g.ux));
  ctx.translate(0, s * (1 - e) * 30);                       // gleitet von der Seite heran
  ctx.globalAlpha = e;
  const y0 = s * K.L_ABST, top = s > 0 ? K.L_ABST : -(K.L_ABST + K.L_BREIT);
  const w = K.L_BIS - K.L_VON;
  ctx.fillStyle = 'rgba(15,23,42,0.14)';
  _bioFxRundRect(ctx, K.L_VON + 2, top + 2.5, w, K.L_BREIT, 3); ctx.fill();
  ctx.fillStyle = K.F_LINEAL;
  _bioFxRundRect(ctx, K.L_VON, top, w, K.L_BREIT, 3); ctx.fill();
  ctx.strokeStyle = K.F_LRAND; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.L_VON, top, w, K.L_BREIT, 3); ctx.stroke();
  const lp = g.L * Math.max(0, Math.min(1, band));          // gruener Streifen an der Kante
  if (band > 0) {
    ctx.fillStyle = 'rgba(4,120,87,' + (0.55 + 0.35 * Math.min(1, glanz / 0.6)).toFixed(3) + ')';
    ctx.fillRect(0, s > 0 ? y0 : y0 - 5, lp, 5);
  }
  ctx.strokeStyle = K.F_STRICH; ctx.lineWidth = 1.2;        // Striche: cm lang, halbe cm kurz
  for (let k = 0; k <= 2 * K.L_CM; k++) {
    const x = k * K.CM / 2, len = k % 2 ? 5 : 9;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + s * len); ctx.stroke();
  }
  ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  const yz = s > 0 ? y0 + 20 : y0 - 11, ym = yz - 4;        // Grundlinie und Mitte der Zahlen
  const lesen = band >= 1 ? Math.round(g.L / K.CM) : -1;    // die abgelesene Zahl
  for (let n = 0; n <= K.L_CM; n++) {
    if (n === lesen) {
      ctx.fillStyle = K.F_LAENGE;
      ctx.beginPath(); ctx.arc(n * K.CM, ym, 8.5, 0, Math.PI * 2); ctx.fill();
      if (glanz > 0) {
        ctx.save(); ctx.globalAlpha = e * Math.min(1, glanz / 0.6);
        ctx.strokeStyle = '#34d399'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(n * K.CM, ym, 12, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#ffffff';
    } else ctx.fillStyle = K.F_STRICH;
    ctx.fillText(String(n), n * K.CM, yz);
  }
  ctx.restore();
}
function _m5mStrich(ctx, a, b, farbe, breite, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha == null ? 1 : alpha;
  ctx.strokeStyle = farbe; ctx.lineWidth = breite; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.restore();
}
function _m5mSpitze(ctx, p) {                                // leuchtende Stiftspitze
  ctx.save();
  ctx.fillStyle = 'rgba(29,78,216,0.18)';
  ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = _m5mK.F_LINIE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Querstrich am Ende einer Strecke.
function _m5mQuer(ctx, g, t) {
  _m5mStrich(ctx, _m5mPkt(g, t, -7), _m5mPkt(g, t, 7), _m5mK.F_LINIE, 3);
}
function _m5mStrecke(ctx, g, u) {
  if (u <= 0) return;
  const K = _m5mK, t = g.L * _bioFxEase.sanft(Math.min(1, u));
  _m5mStrich(ctx, g.P, _m5mPkt(g, t), K.F_LINIE, 3.2);
  _m5mQuer(ctx, g, 0);
  if (u >= 1) _m5mQuer(ctx, g, g.L);
  else _m5mSpitze(ctx, _m5mPkt(g, t));
}
// Ein Stueck, das in den Tisch hinein verblasst, mit Pfeil am Ende.
function _m5mAuslauf(ctx, g, t0, t1, pfeil) {
  const K = _m5mK, n = 5, d = t1 - t0;
  if (Math.abs(d) < 0.5) return;
  for (let i = 0; i < n; i++) {
    const a = _m5mPkt(g, t0 + d * i / n), b = _m5mPkt(g, t0 + d * (i + 1) / n);
    _m5mStrich(ctx, a, b, K.F_LINIE, 3, 0.85 - 0.5 * (i / (n - 1)));
  }
  if (pfeil) {
    const sg = Math.sign(d), p = _m5mPkt(g, t1), ux = g.ux * sg, uy = g.uy * sg;
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = K.F_LINIE;
    ctx.beginPath();
    ctx.moveTo(p.x + ux * 4, p.y + uy * 4);
    ctx.lineTo(p.x - ux * 6 - uy * 5, p.y - uy * 6 + ux * 5);
    ctx.lineTo(p.x - ux * 6 + uy * 5, p.y - uy * 6 - ux * 5);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}
function _m5mGerade(ctx, g, r, u) {
  if (u <= 0) return;
  const K = _m5mK, s = _m5mSchnitt(g, r), tm = g.L / 2, e = _bioFxEase.sanft(Math.min(1, u));
  const a = tm + (s.lo - K.TISCH - tm) * e, b = tm + (s.hi + K.TISCH - tm) * e;
  const z = _m5m;
  if (z.leucht > 0 && u >= 1) {                             // Aha: beide Pfeile leuchten nach
    ctx.save();                                             // (hinter der Linie, die Pfeile bleiben sichtbar)
    ctx.globalAlpha = Math.min(1, z.leucht / 0.8);
    for (const t of [a, b]) { const p = _m5mPkt(g, t); _bioFxLeuchten(ctx, p.x, p.y, 9, z.zeit, '252,211,77'); }
    ctx.restore();
  }
  if (z.glanzNeu > 0) {                                     // die neuen Stuecke leuchten orange
    const k = _m5mSchnitt(g, K.KLEIN), al = Math.min(1, z.glanzNeu / 0.8);
    _m5mStrich(ctx, _m5mPkt(g, s.lo), _m5mPkt(g, k.lo), K.F_NEU, 9, 0.45 * al);
    _m5mStrich(ctx, _m5mPkt(g, k.hi), _m5mPkt(g, s.hi), K.F_NEU, 9, 0.45 * al);
  }
  _m5mStrich(ctx, _m5mPkt(g, Math.max(a, s.lo)), _m5mPkt(g, Math.min(b, s.hi)), K.F_LINIE, 3.2);
  if (a < s.lo) _m5mAuslauf(ctx, g, s.lo, a, u >= 1);
  if (b > s.hi) _m5mAuslauf(ctx, g, s.hi, b, u >= 1);
  if (u < 1) { _m5mSpitze(ctx, _m5mPkt(g, a)); _m5mSpitze(ctx, _m5mPkt(g, b)); }
}
function _m5mRing(ctx, p, u) {                               // roter Ring um einen Endpunkt
  if (u <= 0) return;
  const k = Math.max(0.05, _bioFxEase.federn(Math.min(1, u)));
  ctx.save();
  ctx.strokeStyle = _m5mK.F_ENDE; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(p.x, p.y, 11 * k, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}
function _m5mPunkte(ctx, aktiv) {
  const K = _m5mK;
  ctx.save();
  ctx.font = '700 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  for (const n of ['A', 'B', 'C', 'D']) {
    const p = _m5mPUNKT[n];
    ctx.globalAlpha = (aktiv && aktiv.indexOf(n) < 0) ? 0.45 : 1;
    ctx.fillStyle = K.F_PUNKT; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(p.x, p.y, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillText(n, p.x, p.y + _m5mSCHILD[n]);
  }
  ctx.restore();
}
function _m5mDraw(ctx, cv) {
  if (!_m5m) return;
  const W = cv.width, H = cv.height, z = _m5m, K = _m5mK;
  ctx.clearRect(0, 0, W, H);
  _m5mTisch(ctx, W, H);
  ctx.save();
  if (z.wackel > 0) ctx.translate(Math.sin(z.wackel * 48) * 3 * (z.wackel / K.T_WACKEL), 0);
  const r = _m5mBlattRect(z.blattE);
  _m5mBlatt(ctx, r);
  _m5mVorher(ctx, z.blattE);
  const L = z.wahl ? _m5mLINIEN[z.wahl] : null;
  let g = null;
  if (L) {
    g = _m5mGeo(L.paar);
    _m5mLineal(ctx, g, z.lineal, L.art === 'strecke' ? z.band : 0, z.glanzBand);
    if (L.art === 'strecke') _m5mStrecke(ctx, g, z.ziehen);
    else _m5mGerade(ctx, g, r, z.ziehen);
  }
  _m5mPunkte(ctx, L ? L.paar : null);
  if (L && L.art === 'strecke' && z.ziehen > 0) {
    _m5mRing(ctx, g.P, z.ziehen * K.T_ZIEHEN_S / K.T_POP);
    if (z.popQ >= 0) _m5mRing(ctx, g.Q, z.popQ / K.T_POP);
  }
  _bioFxDraw(ctx, z.fx.teile);                              // Lichtring an den Pfeilen
  ctx.restore();
}
