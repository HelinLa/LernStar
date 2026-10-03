
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mf5 „Ist die Figur symmetrisch?“ (Kennung m5-spiegel)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL3_PROFIL.md, Abschnitt m5-spiegel.
// Ueberschrift: „Was passiert mit den Ecken beim Falten?“ – die Frage der
// Einheit („Ist die Diagonale eines Rechtecks eine Spiegelachse?“) traegt
// „Diagonale“ und „Spiegelachse“ (beide nicht am Bildschirm), deshalb eine
// neutrale Frage.
//
// Was man sieht: Karopapier (ein Kaestchen = 0,5 cm, 16 px; 1 cm = 32 px).
// Darauf liegt eine Figur aus hellblauem Papier, ihre Ecken auf den Linien:
// ein Rechteck 6 cm × 3 cm (12 × 6 Kaestchen) oder ein Quadrat 4 cm × 4 cm
// (8 × 8 Kaestchen). Die Unterkante liegt immer an derselben Stelle. Unter
// der Figur und links daneben stehen Masslinien mit „6 cm“ und „3 cm“ (bzw.
// „4 cm“, „4 cm“). Eine violette gestrichelte Linie ist die Achse, an ihrem
// oberen bzw. rechten Ende steht das Wort „Achse“ (dieselbe Farbe wie das
// Wort „Achse“ in der Statuszeile).
// „falten“: Die eine Haelfte klappt sichtbar ueber die Achse (0,9 s) – sie
// hebt sich, wird dabei schmaler, steht kurz hochkant, legt sich auf der
// anderen Seite ab und zeigt dann ihre Rueckseite (etwas dunkleres Blau);
// darunter wandert ihr Schatten mit. Welche Haelfte klappt:
//   senkrecht    die rechte Haelfte nach links
//   Ecke zu Ecke das untere rechte Dreieck nach oben links (Achse von der
//                Ecke unten links zur Ecke oben rechts)
//   waagerecht   die untere Haelfte nach oben
// Liegt sie, zeigt das Bild sofort das Ergebnis: Wo zwei Lagen Papier
// uebereinanderliegen, ist das Blau dunkler. Wo nur eine Lage liegt, obwohl
// gefaltet ist (ueberstehende Teile), ist das Papier orange getoent (ohne
// Ueberblenden – Blau und Orange gemischt saehen einen Augenblick grau aus).
// In 0,35 s springen die Ringe auf: An jeder Stelle, an der Ecken
// uebereinanderliegen, ein gruener Ring; jede ueberstehende Ecke leuchtet
// orange (ruhiger Puls, 0,8 Hz) und traegt eine orange Nummer 1, 2 – so
// laesst sich die Zahl der Statuszeile abzaehlen.
// Die Masslinien blenden beim Falten aus (gefaltet sind es nicht mehr 6 cm)
// und beim Aufklappen wieder ein.
// „aufklappen“ klappt die Haelfte in 0,9 s zurueck. Eine Sprungmarke legt
// die neue Figur hin: Das Blatt zieht sich in 0,6 s von der alten auf die
// neue Groesse, die Achse dreht und schiebt sich mit, die Masslinien der
// neuen Figur blenden im letzten Drittel ein; war gefaltet, liegt es sofort
// wieder offen. Ein Knopf waehrend einer Bewegung: Der Uebergang steht
// sofort am Ziel; „falten“ und „aufklappen“ kehren eine laufende Faltung an
// der Stelle um, an der sie gerade ist. Jede Knopffolge endet so im selben
// Zustand.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5qWahl('rs'|'rd'|'qd'|'qw')):
//     „Rechteck, senkrecht“ · „Rechteck, Ecke zu Ecke“ · „Quadrat, Ecke zu
//     Ecke“ · „Quadrat, waagerecht“ (die gewaehlte ist hervorgehoben)
//   „falten“ (_m5qFalten()) · „aufklappen“ (_m5qAuf()) ·
//   „neu“ (_m5qNeu(): Rechteck, senkrecht, offen)
//
// Statuszeilen (woertlich):
//   _m5q-wahl    „Figur: Rechteck · Achse: senkrecht durch die Mitte“
//                (bzw. „… · Achse: von Ecke zu Ecke“, „… · Achse: waagerecht
//                durch die Mitte“; „Figur: Quadrat · …“)
//   _m5q-falten  „Nach dem Falten: …“; sobald die Haelfte liegt,
//                „Nach dem Falten: Alle Ecken liegen übereinander.“ (gruen)
//                bzw. „Nach dem Falten: 2 Ecken stehen über.“ (orange);
//                bei „aufklappen“ und bei jeder Sprungmarke wieder „…“
// Texte neben der Leinwand (woertlich): darueber „Die Figur ist aus Papier.
// Die gestrichelte Linie ist die Achse. „falten“ klappt eine Hälfte über die
// Achse.“ · rechts „Grüner Ring: Hier liegen Ecken übereinander. Oranger Ring
// mit Nummer: Diese Ecke steht über.“ · darunter „Start: Rechteck, Achse
// senkrecht durch die Mitte, nicht gefaltet“. Im Bild: „Achse“, „6 cm“,
// „3 cm“, „4 cm“ und die Nummern „1“, „2“.
// Beide Zeilen, deren Wert das Heft verlangt, sind laenger als 18 Zeichen
// (simfakten.js-Grenze); der Platzhalter „Nach dem Falten: …“ (18) muss es
// nicht sein.
//
// Werte (gerechnet in _m5qRechne(): Ecken der Klappe an der Achse
// gespiegelt, mit den festen Ecken verglichen; jede Sprungmarke nachgerechnet
// mit simcheck/werte.js, die Faltung ausgelaufen):
//   Rechteck, senkrecht     -> Achse: senkrecht durch die Mitte
//                              Alle Ecken liegen übereinander. (2 gruene Ringe)
//   Rechteck, Ecke zu Ecke  -> Achse: von Ecke zu Ecke
//                              2 Ecken stehen über. Die Ecke unten rechts
//                              landet 1,8 cm ueber der Oberkante (bei 3,6 cm
//                              von links), die Ecke oben links bleibt frei.
//                              Doppelt liegt ein Dreieck von 5,625 cm², je
//                              3,375 cm² stehen ueber (2 gruene Ringe an den
//                              Achsenenden, 2 orange mit 1 und 2)
//   Quadrat, Ecke zu Ecke   -> Achse: von Ecke zu Ecke
//                              Alle Ecken liegen übereinander. (3 gruene Ringe)
//   Quadrat, waagerecht     -> Achse: waagerecht durch die Mitte
//                              Alle Ecken liegen übereinander. (2 gruene Ringe)
// Gemessen (Frames zu 16 ms): Faltung fertig nach 57 Frames (dann steht auch
// die Statuszeile), Ringe ganz aufgesprungen nach 78. simfakten.js mit
// --frames=25 liest also spaetestens beim dritten Ablesen (75 Frames) den
// Endwert; im Faktendump stehen alle vier Ergebnisse unter „… + falten“.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Liegt „Rechteck, Ecke zu
// Ecke“ gefaltet, laeuft je ein oranger Lichtring um die beiden
// ueberstehenden Ecken; sie leuchten danach weiter, solange gefaltet ist.
// Das widerlegt Vermutung 1 („Ja, die Hälften liegen genau aufeinander.“) und
// Vermutung 2 (es entsteht kein Quadrat, sondern eine Figur mit zwei Zipfeln).
// Jedes Mal, wenn diese Faltung fertig ist.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „aufeinander“,
// „Spiegelachse“, „Diagonale“, „keine“, „symmetrisch“ – und keine Regel als
// Satz. Ob die Achse eine Spiegelachse ist, sagt kein Text; das Kind
// entscheidet an „Alle Ecken liegen übereinander.“ / „2 Ecken stehen über.“
// Keine Namen, keine Punkte, keine Zeit. Deterministisch, ohne Zufall: Bild
// und Statuszeilen lesen dieselbe Rechnung (_m5qRechne).
// ════════════════════════════════════════════════════════════════════════
let _m5q = null;
const _m5qREIHE = ['rs', 'rd', 'qd', 'qw'];
const _m5qFIG = {
  rs: { knopf: 'Rechteck, senkrecht',    figur: 'Rechteck', w: 6, h: 3, achse: 'senkrecht',  wort: 'senkrecht durch die Mitte' },
  rd: { knopf: 'Rechteck, Ecke zu Ecke', figur: 'Rechteck', w: 6, h: 3, achse: 'ecke',       wort: 'von Ecke zu Ecke' },
  qd: { knopf: 'Quadrat, Ecke zu Ecke',  figur: 'Quadrat',  w: 4, h: 4, achse: 'ecke',       wort: 'von Ecke zu Ecke' },
  qw: { knopf: 'Quadrat, waagerecht',    figur: 'Quadrat',  w: 4, h: 4, achse: 'waagerecht', wort: 'waagerecht durch die Mitte' }
};
const _m5qK = {
  S: 32,                        // px je cm
  KAST: 16, GX: 2, GY: 4,       // Karopapier: Kaestchen 0,5 cm; Versatz, damit die Ecken auf Linien liegen
  MX: 210, BODEN: 196,          // Mitte der Figur, Unterkante (liegt immer gleich)
  T_FALT: 0.9,                  // s: eine Haelfte klappt
  T_FORM: 0.6,                  // s: das Blatt zieht sich auf die neue Figur
  T_NACH: 0.35,                 // s: Ringe und Nummern springen auf
  F_KARO: '#d6e4f5',
  F_VORN: '#bfdbfe',            // Papier, Vorderseite
  F_HINTEN: '#a3c4ec',          // Papier, Rueckseite
  F_DOPPELT: '#6c9fdb',         // zwei Lagen
  F_RAND: '#1e3a8a',
  F_UEBER: '#fdba74',           // eine Lage, steht ueber
  F_ORANGE: '#c2410c', F_GLUT: '249,115,22',
  F_GRUEN: '#15803d',
  F_ACHSE: '#7e22ce',
  F_MASS: '#475569'
};

// ── Rechnung ───────────────────────────────────────────────────────────
function _m5qP(x, y) { return { x: x, y: y }; }
// Die Figur in cm (x nach rechts, y nach unten, Ursprung oben links): Ecken,
// Achse a1 -> a2 (a2 ist das obere bzw. rechte Ende), der feste Teil und die
// Klappe (die Haelfte, die sich bewegt), n = Einheitsnormale zur Klappe hin.
function _m5qGeo(k) {
  const f = _m5qFIG[k], w = f.w, h = f.h, P = _m5qP;
  const OL = P(0, 0), OR = P(w, 0), UR = P(w, h), UL = P(0, h);
  let a1, a2, fest, klappe;
  if (f.achse === 'senkrecht') {
    a1 = P(w / 2, h); a2 = P(w / 2, 0);
    fest = [OL, P(w / 2, 0), P(w / 2, h), UL];
    klappe = [P(w / 2, 0), OR, UR, P(w / 2, h)];
  } else if (f.achse === 'ecke') {
    a1 = UL; a2 = OR;
    fest = [OL, OR, UL];
    klappe = [OR, UR, UL];
  } else {
    a1 = P(0, h / 2); a2 = P(w, h / 2);
    fest = [OL, OR, P(w, h / 2), P(0, h / 2)];
    klappe = [P(0, h / 2), P(w, h / 2), UR, UL];
  }
  const L = Math.hypot(a2.x - a1.x, a2.y - a1.y);
  let n = { x: -(a2.y - a1.y) / L, y: (a2.x - a1.x) / L };
  const sx = klappe.reduce((s, p) => s + p.x, 0) / klappe.length;
  const sy = klappe.reduce((s, p) => s + p.y, 0) / klappe.length;
  if ((sx - a1.x) * n.x + (sy - a1.y) * n.y < 0) n = { x: -n.x, y: -n.y };
  return { f: f, w: w, h: h, ecken: [OL, OR, UR, UL], a1: a1, a2: a2, n: n, fest: fest, klappe: klappe };
}
function _m5qAbstand(g, p) { return (p.x - g.a1.x) * g.n.x + (p.y - g.a1.y) * g.n.y; }
// Ein Punkt der Klappe beim Klappwinkel th (0 = offen, PI = umgeklappt), von oben gesehen.
function _m5qGeklappt(g, p, th) {
  const s = _m5qAbstand(g, p) * (1 - Math.cos(th));
  return { x: p.x - s * g.n.x, y: p.y - s * g.n.y };
}
function _m5qGleich(p, q) { return Math.abs(p.x - q.x) < 1e-6 && Math.abs(p.y - q.y) < 1e-6; }
// Schnitt zweier konvexer Vielecke (Sutherland-Hodgman): die Flaeche mit zwei Lagen.
function _m5qSchnitt(a, b) {
  let A = 0;
  for (let i = 0; i < b.length; i++) { const p = b[i], q = b[(i + 1) % b.length]; A += p.x * q.y - q.x * p.y; }
  const sg = A >= 0 ? 1 : -1;
  let aus = a.slice();
  for (let i = 0; i < b.length && aus.length; i++) {
    const p = b[i], q = b[(i + 1) % b.length], ex = q.x - p.x, ey = q.y - p.y;
    const innen = r => sg * (ex * (r.y - p.y) - ey * (r.x - p.x)) >= -1e-9;
    const treff = (c, d) => {
      const dx = d.x - c.x, dy = d.y - c.y;
      const t = (ey * (c.x - p.x) - ex * (c.y - p.y)) / (ex * dy - ey * dx);
      return { x: c.x + t * dx, y: c.y + t * dy };
    };
    const ein = aus; aus = [];
    for (let j = 0; j < ein.length; j++) {
      const c = ein[(j + ein.length - 1) % ein.length], d = ein[j];
      const ci = innen(c), di = innen(d);
      if (di) { if (!ci) aus.push(treff(c, d)); aus.push(d); }
      else if (ci) aus.push(treff(c, d));
    }
  }
  return aus;
}
function _m5qFlaeche(p) {
  let A = 0;
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; A += a.x * b.y - b.x * a.y; }
  return Math.abs(A) / 2;
}
// Was nach dem Falten uebereinanderliegt – Bild UND Statuszeile lesen nur hier.
//   gleich: Stellen, an denen Ecken uebereinanderliegen (oder die auf der Achse liegen)
//   ueber:  Ecken, die ueberstehen (von links nach rechts), anzahl = ihre Zahl
function _m5qRechne(k) {
  const g = _m5qGeo(k);
  const achse = [], fest = [], klapp = [];
  for (const e of g.ecken) {
    const d = _m5qAbstand(g, e);
    if (Math.abs(d) < 1e-6) achse.push(e);
    else if (d > 0) klapp.push(_m5qGeklappt(g, e, Math.PI));
    else fest.push(e);
  }
  const gleich = achse.slice(), ueber = [];
  for (const e of klapp) (fest.some(q => _m5qGleich(q, e)) ? gleich : ueber).push(e);
  for (const e of fest) if (!klapp.some(q => _m5qGleich(q, e))) ueber.push(e);
  ueber.sort((a, b) => (a.x - b.x) || (a.y - b.y));
  const klappeZu = g.klappe.map(p => _m5qGeklappt(g, p, Math.PI));
  const doppelt = _m5qSchnitt(klappeZu, g.fest);
  return { g: g, gleich: gleich, ueber: ueber, anzahl: ueber.length, klappeZu: klappeZu,
           doppelt: doppelt, flaecheDoppelt: _m5qFlaeche(doppelt) };
}
function _m5qUrsprung(g) { const K = _m5qK; return { x: K.MX - g.w * K.S / 2, y: K.BODEN - g.h * K.S }; }
function _m5qPx(o, p) { return { x: o.x + p.x * _m5qK.S, y: o.y + p.y * _m5qK.S }; }

// ── Oberflaeche ────────────────────────────────────────────────────────
function _m5qInit() {
  _m5q = { wahl: 'rs', u: 0, richtung: 0, fertig: false, nach: 0, form: null,
           t: 0, fx: { teile: [] } };
}
function _m5qHTML() {
  const marke = k => `<button class="sim-btn" id="_m5q-b-${k}" onclick="_m5qWahl('${k}')">${_m5qFIG[k].knopf}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was passiert mit den Ecken beim Falten?</h3>
    <div class="fpm-note" style="margin-top:2px">Die Figur ist aus Papier. Die gestrichelte Linie ist die Achse. „falten“ klappt eine Hälfte über die Achse.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5q-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5qREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" onclick="_m5qFalten()">falten</button>
          <button class="sim-btn" onclick="_m5qAuf()">aufklappen</button>
          <button class="sim-btn" onclick="_m5qNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5q-wahl" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5q-falten" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">Grüner Ring: Hier liegen Ecken übereinander. Oranger Ring mit Nummer: Diese Ecke steht über.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Rechteck, Achse senkrecht durch die Mitte, nicht gefaltet</p>
  </div>`;
}
function _m5qZeile(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}
function _m5qStatus() {
  if (!_m5q) return;
  const z = _m5q, K = _m5qK, f = _m5qFIG[z.wahl];
  const b = (s, c) => '<b style="color:' + c + '">' + s + '</b>';
  _m5qZeile('_m5q-wahl', 'Figur: ' + b(f.figur, K.F_RAND) + ' · Achse: ' + b(f.wort, K.F_ACHSE));
  let t = 'Nach dem Falten: …';
  if (z.fertig) {
    const n = _m5qRechne(z.wahl).anzahl;
    t = 'Nach dem Falten: ' + (n === 0 ? b('Alle Ecken liegen übereinander.', K.F_GRUEN)
      : b(n === 1 ? '1 Ecke steht über.' : n + ' Ecken stehen über.', K.F_ORANGE));
  }
  _m5qZeile('_m5q-falten', t);
  for (const k of _m5qREIHE) {
    const e = document.getElementById('_m5q-b-' + k);
    if (e && e.classList) e.classList.toggle('primary', k === z.wahl);
  }
}

// ── Bedienung ──────────────────────────────────────────────────────────
// Lage des offenen Blatts in px, so wie es gerade gezeichnet wird.
function _m5qLage() {
  const z = _m5q, g = _m5qGeo(z.wahl), o = _m5qUrsprung(g);
  const ziel = { ecken: g.ecken.map(p => _m5qPx(o, p)), a1: _m5qPx(o, g.a1), a2: _m5qPx(o, g.a2) };
  if (!z.form) return ziel;
  const e = _bioFxEase.sanft(Math.min(1, z.form.t / _m5qK.T_FORM)), v = z.form.von;
  const m = (p, q) => ({ x: p.x + (q.x - p.x) * e, y: p.y + (q.y - p.y) * e });
  return { ecken: v.ecken.map((p, i) => m(p, ziel.ecken[i])), a1: m(v.a1, ziel.a1), a2: m(v.a2, ziel.a2) };
}
function _m5qWahl(k) {
  if (!_m5q || !_m5qFIG[k]) return;
  const z = _m5q, von = _m5qLage();
  z.wahl = k; z.u = 0; z.richtung = 0; z.fertig = false; z.nach = 0;
  z.form = { von: von, t: 0 };
  _m5qStatus();
}
function _m5qFalten() {
  if (!_m5q) return;
  const z = _m5q;
  z.form = null;
  if (z.fertig) return;                       // liegt schon gefaltet da
  z.richtung = 1;
  _m5qStatus();
}
function _m5qAuf() {
  if (!_m5q) return;
  const z = _m5q;
  z.form = null;
  if (z.u <= 0) { z.richtung = 0; return; }   // ist schon offen
  z.richtung = -1; z.fertig = false; z.nach = 0;
  _m5qStatus();
}
function _m5qNeu() {
  if (!_m5q) return;
  _m5q.fx.teile = [];
  _m5qWahl('rs');
}
// Die Haelfte liegt: Statuszeile, und bei ueberstehenden Ecken der Lichtring.
function _m5qGefaltet() {
  const z = _m5q, r = _m5qRechne(z.wahl);
  if (r.anzahl > 0) {
    const o = _m5qUrsprung(r.g);
    for (const e of r.ueber) { const p = _m5qPx(o, e); _bioFxWelle(z.fx.teile, p.x, p.y, '#f97316', 46); }
  }
  _m5qStatus();
}
function _m5qUpdate(dt) {
  if (!_m5q) return;
  dt = _bioFxDt(dt);
  const z = _m5q, K = _m5qK;
  z.t += dt;
  if (z.form) { z.form.t += dt; if (z.form.t >= K.T_FORM) z.form = null; }
  if (z.richtung > 0) {
    z.u = Math.min(1, z.u + dt / K.T_FALT);
    if (z.u >= 1) { z.u = 1; z.richtung = 0; z.fertig = true; z.nach = 0; _m5qGefaltet(); }
  } else if (z.richtung < 0) {
    z.u = Math.max(0, z.u - dt / K.T_FALT);
    if (z.u <= 0) { z.u = 0; z.richtung = 0; }
  }
  if (z.fertig) z.nach += dt;
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ───────────────────────────────────────────────────────────
function _m5qVieleck(ctx, pts, fuell, rand, breite) {
  if (!pts || pts.length < 3) return;
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  if (fuell) { ctx.fillStyle = fuell; ctx.fill(); }
  if (rand) { ctx.strokeStyle = rand; ctx.lineWidth = breite || 2; ctx.lineJoin = 'round'; ctx.stroke(); }
}
function _m5qSchatten(ctx, pts, dx, dy, a) {
  ctx.save();
  ctx.globalAlpha = a;
  _m5qVieleck(ctx, pts.map(p => ({ x: p.x + dx, y: p.y + dy })), '#0f172a');
  ctx.restore();
}
function _m5qText(ctx, s, x, y, ausr, grund, farbe, groesse) {
  ctx.font = '700 ' + (groesse || 13) + 'px sans-serif';
  ctx.textAlign = ausr; ctx.textBaseline = grund; ctx.fillStyle = farbe;
  ctx.fillText(s, x, y);
}
// Die Achse: violett gestrichelt, 12 px ueber die Figur hinaus, am oberen bzw.
// rechten Ende das Wort „Achse“.
function _m5qAchse(ctx, a1, a2) {
  const K = _m5qK, dx = a2.x - a1.x, dy = a2.y - a1.y, L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L, ext = 12;
  ctx.save();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.globalAlpha = 0.7;   // heller Saum: lesbar auf jedem Blau
  ctx.beginPath(); ctx.moveTo(a1.x - ux * ext, a1.y - uy * ext); ctx.lineTo(a2.x + ux * ext, a2.y + uy * ext); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = K.F_ACHSE; ctx.lineWidth = 2.5; ctx.lineCap = 'butt';
  ctx.setLineDash([9, 6]);
  ctx.beginPath(); ctx.moveTo(a1.x - ux * ext, a1.y - uy * ext); ctx.lineTo(a2.x + ux * ext, a2.y + uy * ext); ctx.stroke();
  ctx.setLineDash([]);
  const lx = a2.x + ux * (ext + 6), ly = a2.y + uy * (ext + 6);
  _m5qText(ctx, 'Achse', lx, ly, ux > 0.5 ? 'left' : ux < -0.5 ? 'right' : 'center',
           uy < -0.5 ? 'bottom' : uy > 0.5 ? 'top' : 'middle', K.F_ACHSE, 13);
  ctx.restore();
}
// Masslinien unter und links neben dem offenen Blatt (ecken: OL, OR, UR, UL in px).
function _m5qMasse(ctx, ecken, w, h, alpha) {
  if (alpha <= 0.01) return;
  const K = _m5qK, OL = ecken[0], UR = ecken[2], UL = ecken[3];
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = K.F_MASS; ctx.lineWidth = 1.5;
  const yb = UL.y + 10, xl = OL.x - 10;
  ctx.beginPath();
  ctx.moveTo(UL.x, yb); ctx.lineTo(UR.x, yb);
  ctx.moveTo(UL.x, yb - 4); ctx.lineTo(UL.x, yb + 4);
  ctx.moveTo(UR.x, yb - 4); ctx.lineTo(UR.x, yb + 4);
  ctx.moveTo(xl, OL.y); ctx.lineTo(xl, UL.y);
  ctx.moveTo(xl - 4, OL.y); ctx.lineTo(xl + 4, OL.y);
  ctx.moveTo(xl - 4, UL.y); ctx.lineTo(xl + 4, UL.y);
  ctx.stroke();
  _m5qText(ctx, w + ' cm', (UL.x + UR.x) / 2, yb + 14, 'center', 'middle', K.F_MASS, 13);
  _m5qText(ctx, h + ' cm', xl - 7, (OL.y + UL.y) / 2, 'right', 'middle', K.F_MASS, 13);
  ctx.restore();
}
// Gruene Ringe (Ecken liegen uebereinander), orange leuchtende Ecken mit Nummer.
function _m5qMarken(ctx, r, o, e) {
  const K = _m5qK, z = _m5q;
  const pop = e < 1 ? _bioFxEase.federn(e) : 1;
  ctx.save();
  ctx.globalAlpha = Math.min(1, e * 1.5);
  for (const q of r.gleich) {
    const p = _m5qPx(o, q);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(p.x, p.y, 9 * pop, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = K.F_GRUEN; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(p.x, p.y, 9 * pop, 0, Math.PI * 2); ctx.stroke();
  }
  const mx = o.x + r.g.w * K.S / 2, my = o.y + r.g.h * K.S / 2;
  r.ueber.forEach((q, i) => {
    const p = _m5qPx(o, q);
    _bioFxLeuchten(ctx, p.x, p.y, 12, z.t, K.F_GLUT);
    ctx.strokeStyle = K.F_ORANGE; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(p.x, p.y, 9 * pop, 0, Math.PI * 2); ctx.stroke();
    const dx = p.x - mx, dy = p.y - my, L = Math.hypot(dx, dy) || 1;
    const bx = p.x + dx / L * 24, by = p.y + dy / L * 24;
    ctx.fillStyle = K.F_ORANGE;
    ctx.beginPath(); ctx.arc(bx, by, 11 * pop, 0, Math.PI * 2); ctx.fill();
    _m5qText(ctx, String(i + 1), bx, by + 0.5, 'center', 'middle', '#ffffff', 14);
  });
  ctx.restore();
}
function _m5qDraw(ctx, cv) {
  if (!_m5q) return;
  const W = cv.width, H = cv.height, z = _m5q, K = _m5qK;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;          // Karopapier
  ctx.beginPath();
  for (let x = K.GX; x <= W; x += K.KAST) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = K.GY; y <= H; y += K.KAST) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();

  const f = _m5qFIG[z.wahl];
  // Uebergang auf eine neue Figur: offenes Blatt, das sich zieht
  if (z.form) {
    const L = _m5qLage();
    _m5qSchatten(ctx, L.ecken, 2, 3, 0.12);
    _m5qVieleck(ctx, L.ecken, K.F_VORN, K.F_RAND, 2);
    _m5qAchse(ctx, L.a1, L.a2);
    // Die Masse der NEUEN Figur erst, wenn das Blatt fast so gross ist
    const e = Math.min(1, z.form.t / K.T_FORM);
    _m5qMasse(ctx, L.ecken, f.w, f.h, Math.max(0, (e - 0.6) / 0.4));
    _bioFxDraw(ctx, z.fx.teile);
    return;
  }
  const g = _m5qGeo(z.wahl), o = _m5qUrsprung(g), px = p => _m5qPx(o, p);
  const ecken = g.ecken.map(px), a1 = px(g.a1), a2 = px(g.a2);

  if (z.fertig) {
    // gefaltet: zwei Lagen dunkler, ueberstehende Teile orange
    const r = _m5qRechne(z.wahl), e = Math.min(1, z.nach / K.T_NACH);
    const fest = g.fest.map(px), zu = r.klappeZu.map(px), dop = r.doppelt.map(px);
    _m5qSchatten(ctx, fest, 2, 3, 0.12);
    _m5qSchatten(ctx, zu, 2, 3, 0.12);
    _m5qVieleck(ctx, fest, K.F_VORN);
    _m5qVieleck(ctx, zu, K.F_HINTEN);
    // Ohne Ueberblenden: Blau und Orange gemischt ergaeben einen Augenblick lang Grau.
    if (r.anzahl > 0) { _m5qVieleck(ctx, fest, K.F_UEBER); _m5qVieleck(ctx, zu, K.F_UEBER); }
    _m5qVieleck(ctx, dop, K.F_DOPPELT);
    _m5qVieleck(ctx, fest, null, K.F_RAND, 2);
    _m5qVieleck(ctx, zu, null, K.F_RAND, 2);
    _m5qAchse(ctx, a1, a2);
    _bioFxDraw(ctx, z.fx.teile);
    _m5qMarken(ctx, r, o, e);
    return;
  }

  if (z.u <= 0) {
    // offen
    _m5qSchatten(ctx, ecken, 2, 3, 0.12);
    _m5qVieleck(ctx, ecken, K.F_VORN, K.F_RAND, 2);
    _m5qAchse(ctx, a1, a2);
    _m5qMasse(ctx, ecken, f.w, f.h, 1);
    _bioFxDraw(ctx, z.fx.teile);
    return;
  }

  // die Haelfte klappt: hebt sich, steht hochkant, legt sich drueben ab
  const th = Math.PI * _bioFxEase.sanft(z.u), c = Math.cos(th), s = Math.sin(th);
  const fest = g.fest.map(px);
  const klappe = g.klappe.map(p => px(_m5qGeklappt(g, p, th)));
  const schatten = g.klappe.map(p => {
    const q = px(_m5qGeklappt(g, p, th)), hoch = Math.abs(_m5qAbstand(g, p)) * K.S * s * 0.22;
    return { x: q.x + hoch * 0.6, y: q.y + hoch * 0.9 };
  });
  _m5qSchatten(ctx, fest, 2, 3, 0.12);
  _m5qVieleck(ctx, fest, K.F_VORN, K.F_RAND, 2);
  _m5qSchatten(ctx, schatten, 0, 0, 0.10 + 0.12 * s);
  _m5qVieleck(ctx, klappe, c >= 0 ? K.F_VORN : K.F_HINTEN);
  ctx.save();                                           // Licht: hochkant ist die Klappe dunkler
  ctx.globalAlpha = 0.22 * s;
  _m5qVieleck(ctx, klappe, '#1e293b');
  ctx.restore();
  _m5qVieleck(ctx, klappe, null, K.F_RAND, 2);
  _m5qAchse(ctx, a1, a2);
  _m5qMasse(ctx, ecken, f.w, f.h, Math.max(0, 1 - 2 * z.u));
  _bioFxDraw(ctx, z.fx.teile);
}
