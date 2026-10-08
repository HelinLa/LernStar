// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · WIE TEILT SICH EINE ZELLE?   (Förderheft Bio 9 · bz1)
// Kennung bio-mitose, Präfix _n9l. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bz1.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250, heller Grund, KEINE Nachbarzellen – das
// Kind zählt die Zellen):
//   - eine runde Körperzelle, stark vergrößert (Mitte 210/140, Radius 86).
//   - darin ein heller Kreis OHNE Beschriftung, darin vier dicke Stäbchen:
//     ein langes rotes, ein kurzes rotes, ein langes blaues, ein kurzes blaues.
//   - am Start zeigt ein Pfeil mit der Aufschrift „Chromosomen“ auf die
//     Stäbchen; alle vier leuchten ruhig (0,8 Hz).
//   - Zähler oben links: „Zellen: 1“ (springt auf 2, dann auf 4).
//
// BEDIENUNG (wörtlich): „▶ Zelle teilen“ (_n9lTeilen) · „neu“ (_n9lNeu).
//   Keine Regler. Während der Teilung und nach der zweiten Teilung ist
//   „▶ Zelle teilen“ grau (disabled).
//
// ABLAUF JE DRUCK (langsam, 8,2 s; Zeiten in s nach dem Druck):
//   (1) 0,6–1,5  neben jedem Stäbchen erscheint ein zweites, gleich lang, in
//                derselben Farbe; 1,5–2,4 die beiden kreuzen sich zu einem X
//                (dunkler Punkt in der Kreuzung)
//   (2) 2,6–3,4  der helle Kreis zerfällt in Stücke und verblasst;
//                2,8–3,6 links und rechts erscheint je ein Pol;
//                3,0–4,4 die vier X wandern in die Mitte und stellen sich
//                senkrecht übereinander auf
//   (3) 4,4–4,8  Fäden von beiden Polen zu jedem X; 4,8–5,2 jedes X öffnet
//                sich; 4,9–6,4 die Fäden ziehen die Hälften auseinander, je
//                eine zu jeder Seite; die Zelle wird dabei länger
//   (4) 6,4–8,0  die Zelle schnürt sich in der Mitte ein (glatte Taille, kein
//                Steg), bis zwei Zellen da sind – getrennt bei 7,2 s (erste
//                Teilung) bzw. 7,6 s (zweite); Fäden und Pole verblassen;
//                6,4–7,6 die Hälften legen
//                sich in jeder neuen Zelle wieder als Stäbchen hin;
//                7,3–8,1 um sie erscheint ein neuer heller Kreis
//   8,2          erst jetzt springt der Zähler (kein Hochrollen).
//   Ein Band unten (vier Felder, ohne Schrift) zeigt, wo der Ablauf steht.
//   Beim zweiten Druck teilen sich beide Zellen gleichzeitig nach demselben
//   Plan. Die rechte Tochter behält die Lage der Stäbchen, die linke liegt
//   spiegelbildlich – so, wie die Hälften auseinandergezogen wurden.
//
// LAGE DER ZELLEN (Mitte x / Radius; y immer 140):
//   Start 210/86 · nach 1 Teilung 110/80 und 310/80 (Abstand 40) ·
//   nach 2 Teilungen 60, 160, 260, 360 / 46 (Abstand je 8).
//   Heller Kreis: Radius 14 + 0,32 · Zellradius (41,5 · 39,6 · 28,7).
//   Stäbchen: lang 0,78, kurz 0,46, dick 0,165 Kreisradien.
//   Gegengerechnet (Mini-DOM, Bild für Bild über beide Teilungen, mit fünf
//   absichtlich kaputten Gegenproben): Dauer 8,21 s (513 Bilder à 16 ms);
//   kein Stäbchen verlässt den Umriss seiner Zelle; zwei Zellen berühren sich
//   nie; in der Mitte 8 Hälften je Zelle (4 X); der Zähler springt erst am
//   Ende; jede ruhende Zelle zeigt genau rot lang, rot kurz, blau lang,
//   blau kurz; kleinste Lücke zwischen zwei Stäbchen 4,3 px (Farbkern zu
//   Farbkern, kleinste Zelle).
//
// STATUSZEILE (_n9l-status), Zähler vorn wie auf der Leinwand:
//   Start      „Zellen: 1 · Drücke „▶ Zelle teilen“.“
//   1. Lauf    „Zellen: 1 · Die Zelle teilt sich …“
//   nach 1     „Zellen: 2 · Drücke noch einmal „▶ Zelle teilen“.“
//   2. Lauf    „Zellen: 2 · Jetzt teilen sich beide Zellen …“
//   nach 2     „Zellen: 4 · Drücke neu, um von vorn zu beginnen.“
// HINWEIS (_n9l-hinweis) führt durch die Schritte a–d der Seite:
//   Start  „Zähle die Chromosomen in der Zelle. Notiere die Zahl in Zeile 1
//          der Tabelle.“
//   Lauf   „Sieh genau hin: Was passiert zuerst mit jedem Chromosom?“
//   nach 1 / nach 2  „Zähle die Chromosomen in jeder Zelle. Notiere Zellen
//          und Chromosomen in Zeile 2 (3) der Tabelle.“
//
// WERTE (lehrer.tabelle_erwartet, am Bild abzulesen; Modellwerte):
//   Start 1 Zelle, 4 Chromosomen · nach 1 Teilung 2 Zellen, je 4 ·
//   nach 2 Teilungen 4 Zellen, je 4. Die Zahl der Chromosomen steht NIRGENDS –
//   das Kind zählt die Stäbchen selbst.
//
// AHA (_bioFx, ruhig, OHNE Textstreifen, ohne Zufall): Nach jeder Teilung
//   leuchten in ALLEN Zellen gleichzeitig dieselben Stäbchen auf, eins nach
//   dem anderen (rot lang, rot kurz, blau lang, blau kurz; je 0,7 s, ab 0,8 s
//   nach dem Zählersprung). Jede Zelle hat jedes Stäbchen genau einmal –
//   „halb so viele“ (nur rote hier, nur blaue dort) und „doppelt so viele“
//   fallen sichtbar. Dazu je ein Lichtring am Zähler und um jeden neuen
//   hellen Kreis.
//
// NICHT AM BILDSCHIRM (Lückenwörter aus Merksatz und Aufgabe 2): „Mitose“,
//   „kopiert“, „gleichen“, „Zellkern“, „halbiert“ – auch keine Umschreibung
//   wie „Kopie“. Keine Phasennamen. Deterministisch, ohne Zufall.
// ═══════════════════════════════════════════════════════════════════════
let _n9l = null;
const _N9L_Y = 140;                     // alle Zellen liegen auf einer Linie
const _N9L_LAGE = [
  [{ x: 210, r: 86 }],
  [{ x: 110, r: 80 }, { x: 310, r: 80 }],
  [{ x: 60, r: 46 }, { x: 160, r: 46 }, { x: 260, r: 46 }, { x: 360, r: 46 }]
];
const _N9L_MAX = 2;                     // höchstens zwei Teilungen
// Die vier Chromosomen: Lage im hellen Kreis (in Kreisradien), Winkel (rad)
const _N9L_CHR = [
  { f: 'rot',  lang: true,  x: -0.40, y: -0.12, w: 1.25 },
  { f: 'rot',  lang: false, x:  0.18, y: -0.52, w: 0.15 },
  { f: 'blau', lang: true,  x:  0.45, y:  0.10, w: 1.95 },
  { f: 'blau', lang: false, x: -0.14, y:  0.56, w: -0.25 }
];
// (Kleinste Lücke zwischen zwei Stäbchen samt Zittern, Farbkern zu Farbkern:
// große Zelle 6,7 px, kleinste Zelle 4,3 px (blau lang / blau kurz); zwischen
// den dunklen Rändern bleiben dort 2,1 px. Bei 1:1 nachgesehen: vier getrennte
// Stäbchen je Zelle. Die erste Lage hatte nur 1,9 px Farbkern zu Farbkern.)
// Farbe, Rand, Glanzlicht
const _N9L_FARBE = { rot: ['#dc2626', '#7f1d1d', '#fca5a5'], blau: ['#2563eb', '#1e3a8a', '#93c5fd'] };
const _N9L_PLATTE = [1, 0, 2, 3];       // Reihenfolge in der Mitte, von oben nach unten
const _N9L_SPREIZ = 0.42;               // halber Öffnungswinkel des X
const _N9L_ENDE = 8.2;                  // Dauer einer Teilung in s
const _N9L_GLUEH0 = 0.8, _N9L_GLUEHT = 0.8, _N9L_GLUEHD = 0.7, _N9L_GLUEHENDE = 4.0;
const _N9L_HG = '#eef3f6', _N9L_PLASMA = '#fdebd7', _N9L_RAND = '#b45309';
const _N9L_KERN = '#fffbf2', _N9L_KERNRAND = '#b8956a';
const _N9L_ABSCHNITT = [[0.6, 2.4], [2.6, 4.4], [4.4, 6.4], [6.4, 8.2]];

function _n9lKl(x) { return _bioFxKlemme(x); }
function _n9lE(x) { return _bioFxEase.sanft(_bioFxKlemme(x)); }
function _n9lKernR(r) { return 14 + 0.32 * r; }
function _n9lLaenge(i, Rn) { return (_N9L_CHR[i].lang ? 0.78 : 0.46) * Rn; }
function _n9lDicke(Rn) { return 0.165 * Rn; }
function _n9lPh(x) { return x * 0.05; }

function _n9lInit() {
  _n9l = { t: 0 };
  _n9lAnfang();
}
// Eine Zelle, nichts läuft
function _n9lAnfang() {
  _n9l.teilungen = 0; _n9l.laeuft = false; _n9l.s = 0; _n9l.nach = -1;
  _n9l.zellen = [{ x: _N9L_LAGE[0][0].x, r: _N9L_LAGE[0][0].r, sp: false }];
  _n9l.jobs = []; _n9l.zahl = 1; _n9l.fx = { teile: [] };
}

// ── Bedienung ──────────────────────────────────────────
function _n9lTeilen() {
  if (!_n9l || _n9l.laeuft || _n9l.teilungen >= _N9L_MAX) return;
  const naechste = _N9L_LAGE[_n9l.teilungen + 1];
  _n9l.jobs = _n9l.zellen.map((z, k) => {
    const l = naechste[2 * k], r = naechste[2 * k + 1];
    return { x: z.x, R: z.r, sp: z.sp, D: (r.x - l.x) / 2, r2: l.r, xl: l.x, xr: r.x };
  });
  _n9l.laeuft = true; _n9l.s = 0; _n9l.nach = -1; _n9l.fx = { teile: [] };
  for (const z of _n9l.zellen) _bioFxWelle(_n9l.fx.teile, z.x, _N9L_Y, '#fde68a', _n9lKernR(z.r) + 16);
  _n9lStatus();
}
function _n9lNeu() {
  if (!_n9l) return;
  _n9lAnfang();
  _n9lStatus();
}
// Die Teilung ist zu Ende: aus jeder Zelle werden zwei
function _n9lFertig() {
  const neu = [];
  for (const j of _n9l.jobs) {
    neu.push({ x: j.xl, r: j.r2, sp: !j.sp });
    neu.push({ x: j.xr, r: j.r2, sp: j.sp });
  }
  _n9l.zellen = neu; _n9l.jobs = [];
  _n9l.teilungen++; _n9l.laeuft = false; _n9l.s = 0;
  _n9l.zahl = neu.length;                           // gezählt wird, was daliegt
  _n9l.nach = 0;
  _bioFxWelle(_n9l.fx.teile, 62, 22, '#fde047', 44);
  for (const z of neu) _bioFxWelle(_n9l.fx.teile, z.x, _N9L_Y, '#fde68a', _n9lKernR(z.r) + 12);
  _n9lStatus();
}

// ── Anzeige ────────────────────────────────────────────
function _n9lZeile() {
  const n = 'Zellen: ' + _n9l.zahl + ' · ';
  if (_n9l.laeuft) return n + (_n9l.teilungen === 0 ? 'Die Zelle teilt sich …' : 'Jetzt teilen sich beide Zellen …');
  if (_n9l.teilungen === 0) return n + 'Drücke „▶ Zelle teilen“.';
  if (_n9l.teilungen < _N9L_MAX) return n + 'Drücke noch einmal „▶ Zelle teilen“.';
  return n + 'Drücke neu, um von vorn zu beginnen.';
}
function _n9lHinweis() {
  if (_n9l.laeuft) return 'Sieh genau hin: Was passiert zuerst mit jedem Chromosom?';
  if (_n9l.teilungen === 0) return 'Zähle die Chromosomen in der Zelle. Notiere die Zahl in Zeile 1 der Tabelle.';
  return 'Zähle die Chromosomen in jeder Zelle. Notiere Zellen und Chromosomen in Zeile '
       + (_n9l.teilungen + 1) + ' der Tabelle.';
}
function _n9lStatus() {
  if (!_n9l) return;
  const el = document.getElementById('_n9l-status');
  if (el) { el.textContent = _n9lZeile(); el.className = 'lmp-status on'; }
  const h = document.getElementById('_n9l-hinweis');
  if (h) h.textContent = _n9lHinweis();
  const los = document.getElementById('_n9l-los');
  if (los) {
    const zu = _n9l.laeuft || _n9l.teilungen >= _N9L_MAX;
    los.disabled = zu;
    try { if (los.classList) los.classList.toggle('primary', !zu); } catch (e) { /* Knopffarbe ist Beiwerk */ }
  }
}
function _n9lHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie teilt sich eine Zelle?</h3>
    <div class="fpm-note" style="margin-top:2px">Modell einer Körperzelle aus der Haut, stark vergrößert. Die dicken Stäbchen in der Zelle sind die Chromosomen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9l-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9l-los" onclick="_n9lTeilen()">▶ Zelle teilen</button>
          <button class="sim-btn" onclick="_n9lNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="lmp-status on" id="_n9l-status"></div>
        <div class="fpm-note" id="_n9l-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Eine echte Hautzelle hat viel mehr Chromosomen als das Modell. Man sieht sie dort nur bei der Teilung so deutlich.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 1 Zelle &nbsp;|&nbsp; Eine Teilung dauert etwa 8 Sekunden.</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9lUpdate(dt) {
  if (!_n9l) return;
  dt = _bioFxDt(dt);
  _n9l.t += dt;
  if (_n9l.laeuft) {
    _n9l.s += dt;
    if (_n9l.s >= _N9L_ENDE) _n9lFertig();
  } else if (_n9l.nach >= 0) {
    _n9l.nach += dt;
    if (_n9l.nach > _N9L_GLUEHENDE) _n9l.nach = -1;
  }
  _bioFxAlleUpdate(_n9l.fx, dt);
}

// ── Geometrie: was steht zur Zeit s wo? ────────────────
// Leichtes Zittern der Stäbchen – das Bild lebt
function _n9lWackeln(i, t, ph) {
  return { x: 0.55 * Math.sin(t * 1.1 + i * 1.9 + ph), y: 0.55 * Math.cos(t * 0.9 + i * 2.7 + ph),
           w: 0.035 * Math.sin(t * 0.7 + i * 1.3 + ph) };
}
// Ruhelage eines Stäbchens im hellen Kreis um (cx, 140); sp = spiegelbildlich
function _n9lRuhe(cx, Rn, sp, i) {
  const c = _N9L_CHR[i], m = sp ? -1 : 1;
  return { x: cx + m * c.x * Rn, y: _N9L_Y + c.y * Rn, w: sp ? Math.PI - c.w : c.w };
}
// Höhe jedes X, wenn alle vier in der Mitte übereinanderstehen
function _n9lPlatteY(Rn) {
  const luft = 0.16 * Rn, y = [];
  let summe = 3 * luft;
  for (const i of _N9L_PLATTE) summe += _n9lLaenge(i, Rn);
  let c = -summe / 2;
  for (const i of _N9L_PLATTE) { const l = _n9lLaenge(i, Rn); y[i] = c + l / 2; c += l + luft; }
  return y;
}
// Drehen auf dem kürzesten Weg (ein Stäbchen sieht nach einer halben Drehung gleich aus)
function _n9lDrehe(w0, w1, u) {
  let d = w1 - w0;
  while (d > Math.PI / 2) d -= Math.PI;
  while (d <= -Math.PI / 2) d += Math.PI;
  return w0 + d * u;
}
// Umriss einer Zelle, die sich teilt: zwei Hälften (Mitte j.x ± a, Radius rho).
// Solange sie zusammenhängen, ist der Umriss das GLATTE Maximum der beiden
// Kreise, vom Mittelpunkt aus gemessen (Glättung k). k = kMax füllt die Mitte
// bis zur vollen Höhe (längliche Zelle ohne Taille), k = 0 ist die reine
// Vereinigung (Spitze in der Mitte). Beim Einschnüren geht k auf 0, genau
// wenn a = rho wird – dort berühren sich die beiden Kreise in einem Punkt,
// danach sind es zwei getrennte Zellen.
function _n9lForm(j, s) {
  const e = s < 4.9 ? 0 : s < 6.4 ? 0.6 * _n9lE((s - 4.9) / 1.5) : 0.6 + 0.4 * _n9lE((s - 6.4) / 1.6);
  const a = j.D * e, rho = j.R + (j.r2 - j.R) * e;
  const eTrenn = j.R / (j.D - j.r2 + j.R);         // hier wird a = rho
  const q = _n9lKl((e - 0.6) / (eTrenn - 0.6));
  const getrennt = a >= rho;
  const kMax = 4 * (rho - Math.sqrt(Math.max(0, rho * rho - a * a)));
  return { a, rho, k: getrennt ? 0 : kMax * (1 - q), getrennt };
}
// Abstand des Umrisses vom Mittelpunkt in Richtung th (nur solange zusammenhängend)
function _n9lRadius(a, rho, k, th) {
  const c = Math.cos(th), w = Math.sqrt(Math.max(0, rho * rho - a * a * Math.sin(th) * Math.sin(th)));
  const rR = a * c + w, rL = -a * c + w, m = Math.max(rL, rR);
  if (k < 1e-6) return m;
  const h = Math.max(k - Math.abs(rL - rR), 0) / k;
  return m + h * h * k * 0.25;
}
// Alle Stäbchen des Chromosoms i in einer Zelle, die sich gerade teilt.
// Je Stäbchen: x, y, w (Winkel), l (Länge), d (Dicke), i, a (Deckkraft), mitte (Punkt im X)
function _n9lTeilStaebe(j, s, i, t) {
  const RnP = _n9lKernR(j.R), RnD = _n9lKernR(j.r2);
  const lP = _n9lLaenge(i, RnP), dP = _n9lDicke(RnP);
  const wP = _n9lWackeln(i, t, _n9lPh(j.x));
  const r0 = _n9lRuhe(j.x, RnP, j.sp, i);
  const st = [];
  const S = (x, y, w, l, d, a, mitte, wk) => st.push({ x: x + wk.x, y: y + wk.y, w: w + wk.w, l, d, i, a, mitte });
  if (s < 2.4) {
    // (1) ein zweites Stäbchen erscheint daneben, dann kreuzen sich beide zum X
    const u1 = _n9lE((s - 0.6) / 0.9), u2 = _n9lE((s - 1.5) / 0.9);
    const off = 1.15 * dP * (s < 1.5 ? u1 : 1 - u2), sp = _N9L_SPREIZ * u2;
    const nx = -Math.sin(r0.w), ny = Math.cos(r0.w);
    S(r0.x + nx * off / 2, r0.y + ny * off / 2, r0.w + sp, lP, dP, 1, false, wP);
    const aB = _n9lKl((s - 0.6) / 0.4);
    if (aB > 0) S(r0.x - nx * off / 2, r0.y - ny * off / 2, r0.w - sp, lP, dP, aB, u2 > 0.35, wP);
    return st;
  }
  const pY = _n9lPlatteY(RnP)[i];
  if (s < 4.8) {
    // (2) die X wandern in die Mitte und stellen sich senkrecht auf
    const u = _n9lE((s - 3.0) / 1.4);
    const x = r0.x + (j.x - r0.x) * u, y = r0.y + (_N9L_Y + pY - r0.y) * u;
    const w = _n9lDrehe(r0.w, Math.PI / 2, u);
    S(x, y, w + _N9L_SPREIZ, lP, dP, 1, false, wP);
    S(x, y, w - _N9L_SPREIZ, lP, dP, 1, true, wP);
    return st;
  }
  const f3 = _n9lForm(j, 6.4);                     // Form am Ende von (3)
  const ax = f3.a + 0.22 * f3.rho;                 // so weit ziehen die Fäden
  if (s < 6.4) {
    // (3) das X öffnet sich, die Hälften werden auseinandergezogen
    const sp = _N9L_SPREIZ * (1 - _n9lE((s - 4.8) / 0.4));
    const u = _n9lE((s - 4.9) / 1.5);
    for (const sg of [1, -1]) {
      S(j.x + sg * ax * u, _N9L_Y + pY * (1 - 0.15 * u), Math.PI / 2 + sg * sp, lP, dP, 1, false, wP);
    }
    return st;
  }
  // (4) die Hälften legen sich in der neuen Zelle wieder hin
  const f = _n9lForm(j, s);
  const u = _n9lE((s - 6.4) / 1.2);
  const Rn = RnP + (RnD - RnP) * u;
  for (const sg of [1, -1]) {
    const ziel = _n9lRuhe(j.x + sg * f.a, RnD, sg < 0 ? !j.sp : j.sp, i);
    const x0 = j.x + sg * ax, y0 = _N9L_Y + pY * 0.85;
    const wD = _n9lWackeln(i, t, _n9lPh(sg < 0 ? j.xl : j.xr));
    const wk = { x: wP.x + (wD.x - wP.x) * u, y: wP.y + (wD.y - wP.y) * u, w: wP.w + (wD.w - wP.w) * u };
    S(x0 + (ziel.x - x0) * u, y0 + (ziel.y - y0) * u, _n9lDrehe(Math.PI / 2, ziel.w, u),
      _n9lLaenge(i, Rn), _n9lDicke(Rn), 1, false, wk);
  }
  return st;
}
// Stäbchen einer ruhenden Zelle
function _n9lRuheStaebe(z, t) {
  const Rn = _n9lKernR(z.r), ph = _n9lPh(z.x), st = [];
  for (let i = 0; i < 4; i++) {
    const r = _n9lRuhe(z.x, Rn, z.sp, i), wk = _n9lWackeln(i, t, ph);
    st.push({ x: r.x + wk.x, y: r.y + wk.y, w: r.w + wk.w, l: _n9lLaenge(i, Rn), d: _n9lDicke(Rn), i, a: 1, mitte: false });
  }
  return st;
}
// Pol (sg = -1 links, +1 rechts)
function _n9lPol(j, s, sg) {
  const f = _n9lForm(j, s);
  return { x: j.x + sg * (f.a + 0.62 * f.rho), y: _N9L_Y };
}
// Leuchten eines Stäbchens (ruhende Zellen): am Start ruhiger Puls auf allen
// vieren, nach einer Teilung der Reihe nach je eine Sorte in allen Zellen
function _n9lGlanz(i, t) {
  if (_n9l.laeuft) return 0;
  if (_n9l.nach >= 0) {
    const u = (_n9l.nach - _N9L_GLUEH0 - _N9L_GLUEHT * i) / _N9L_GLUEHD;
    return u > 0 && u < 1 ? 0.85 * Math.sin(Math.PI * u) : 0;
  }
  if (_n9l.teilungen === 0) return 0.28 + 0.18 * Math.sin(t * Math.PI * 2 * 0.8);
  return 0;
}

// ── Zeichnen ───────────────────────────────────────────
// Zellhaut und Zellinneres (f aus _n9lForm; eine ruhende Zelle hat a = 0)
function _n9lHaut(ctx, x, f, atem) {
  const y = _N9L_Y;
  ctx.save();
  ctx.fillStyle = _N9L_PLASMA; ctx.strokeStyle = _N9L_RAND; ctx.lineWidth = 2.6; ctx.lineJoin = 'round';
  if (f.getrennt || f.a < 0.01) {
    for (const sx of f.a < 0.01 ? [x] : [x - f.a, x + f.a]) {
      ctx.beginPath(); ctx.arc(sx, y, f.rho + atem, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }
  } else {
    ctx.beginPath();
    for (let n = 0; n <= 180; n++) {
      const th = n * Math.PI / 90, r = _n9lRadius(f.a, f.rho, f.k, th) + atem;
      if (n === 0) ctx.moveTo(x + r * Math.cos(th), y + r * Math.sin(th));
      else ctx.lineTo(x + r * Math.cos(th), y + r * Math.sin(th));
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
// Feine Körnchen im Zellinneren; seite 0 = alle, -1/+1 = nur die eine Hälfte
// voll, die andere mit Deckkraft rest (beim Teilen wachsen sie nach)
function _n9lKoerner(ctx, cx, R, t, seite, rest) {
  ctx.save();
  for (let k = 0; k < 10; k++) {
    const w0 = k * 2.39996 + 0.4;
    const auf = !seite || Math.sign(Math.cos(w0)) === seite ? 1 : rest;
    if (auf <= 0.02) continue;
    const w = w0 + 0.12 * Math.sin(t * 0.4 + k);
    const f = 0.72 + 0.16 * ((k * 0.618) % 1);
    ctx.globalAlpha = auf;
    ctx.fillStyle = 'rgba(180,110,60,0.35)';
    ctx.beginPath(); ctx.arc(cx + f * R * Math.cos(w), _N9L_Y + f * R * Math.sin(w), 1.6, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
// Heller Kreis (ohne Beschriftung); zerfall 0 = ganz, 1 = verschwunden
function _n9lKern(ctx, cx, Rn, deck, zerfall) {
  if (deck <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = deck * (1 - zerfall);
  ctx.fillStyle = _N9L_KERN;
  ctx.beginPath(); ctx.arc(cx, _N9L_Y, Rn + 4 * zerfall, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = _N9L_KERNRAND; ctx.lineWidth = 2;
  if (zerfall <= 0) {
    ctx.beginPath(); ctx.arc(cx, _N9L_Y, Rn, 0, 2 * Math.PI); ctx.stroke();
  } else {
    // in zwölf Stücke zerfallen, die kürzer werden
    const n = 12, stueck = 2 * Math.PI / n * (1 - 0.75 * zerfall);
    for (let k = 0; k < n; k++) {
      const m = k * 2 * Math.PI / n;
      ctx.beginPath(); ctx.arc(cx, _N9L_Y, Rn + 4 * zerfall, m - stueck / 2, m + stueck / 2, false); ctx.stroke();
    }
  }
  ctx.restore();
}
function _n9lLinie(ctx, x, y, hx, hy) {
  ctx.beginPath(); ctx.moveTo(x - hx, y - hy); ctx.lineTo(x + hx, y + hy); ctx.stroke();
}
// Ein Stäbchen (Chromosom bzw. eine Hälfte davon)
function _n9lStab(ctx, s, glanz) {
  const c = _N9L_FARBE[_N9L_CHR[s.i].f];
  const k = Math.max(0, s.l - s.d) / 2;            // runde Enden machen es um d länger
  const hx = Math.cos(s.w) * k, hy = Math.sin(s.w) * k;
  ctx.save();
  ctx.globalAlpha = s.a;
  ctx.lineCap = 'round';
  if (glanz > 0.01) {
    ctx.strokeStyle = 'rgba(250,204,21,' + glanz.toFixed(3) + ')'; ctx.lineWidth = s.d + 9;
    _n9lLinie(ctx, s.x, s.y, hx, hy);
  }
  ctx.strokeStyle = c[1]; ctx.lineWidth = s.d + 2.2;
  _n9lLinie(ctx, s.x, s.y, hx, hy);
  ctx.strokeStyle = c[0]; ctx.lineWidth = s.d;
  _n9lLinie(ctx, s.x, s.y, hx, hy);
  const nx = -Math.sin(s.w) * s.d * 0.2, ny = Math.cos(s.w) * s.d * 0.2;
  ctx.strokeStyle = c[2]; ctx.lineWidth = Math.max(1, s.d * 0.26);
  _n9lLinie(ctx, s.x - nx, s.y - ny, hx * 0.75, hy * 0.75);
  if (s.mitte) {
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.arc(s.x, s.y, Math.max(1.6, s.d * 0.42), 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
function _n9lZeichneZelle(ctx, z, t) {
  _n9lHaut(ctx, z.x, { a: 0, rho: z.r, k: 0, getrennt: false }, 0.7 * Math.sin(t * 1.3 + _n9lPh(z.x)));
  _n9lKoerner(ctx, z.x, z.r, t, 0, 1);
  _n9lKern(ctx, z.x, _n9lKernR(z.r), 1, 0);
  for (const s of _n9lRuheStaebe(z, t)) _n9lStab(ctx, s, _n9lGlanz(s.i, t));
}
function _n9lZeichneTeilung(ctx, j, s, t) {
  const f = _n9lForm(j, s);
  const atem = 0.7 * Math.sin(t * 1.3 + _n9lPh(j.x));
  _n9lHaut(ctx, j.x, f, atem);
  const e = j.D > 0 ? f.a / j.D : 0;
  if (f.a > 0.01) {
    _n9lKoerner(ctx, j.x - f.a, f.rho, t, -1, e);
    _n9lKoerner(ctx, j.x + f.a, f.rho, t, 1, e);
  } else {
    _n9lKoerner(ctx, j.x, f.rho, t, 0, 1);
  }
  const RnP = _n9lKernR(j.R), RnD = _n9lKernR(j.r2);
  // (2) der alte helle Kreis zerfällt, (4) neue erscheinen
  if (s < 3.4) _n9lKern(ctx, j.x, RnP, 1, _n9lKl((s - 2.6) / 0.8));
  const neu = _n9lKl((s - 7.3) / 0.8);
  if (neu > 0) { _n9lKern(ctx, j.x - f.a, RnD, neu, 0); _n9lKern(ctx, j.x + f.a, RnD, neu, 0); }
  // Stäbchen jetzt
  const alle = [];
  for (let i = 0; i < 4; i++) alle.push(_n9lTeilStaebe(j, s, i, t));
  // Pole und Fäden
  const aPol = _n9lKl((s - 2.8) / 0.8) * (1 - _n9lKl((s - 6.4) / 0.8));
  const aFad = _n9lKl((s - 4.4) / 0.4) * (1 - _n9lKl((s - 6.4) / 0.6));
  if (aPol > 0.01) {
    const pole = { '-1': _n9lPol(j, s, -1), '1': _n9lPol(j, s, 1) };
    ctx.save();
    if (aFad > 0.01) {
      ctx.globalAlpha = aFad;
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
      for (const st of alle) {
        for (const sg of [-1, 1]) {
          const ziel = s < 4.8 ? st[0] : st[sg > 0 ? 0 : 1];
          const p = pole[String(sg)];
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(ziel.x, ziel.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = aPol;
    ctx.strokeStyle = '#475569'; ctx.fillStyle = '#475569'; ctx.lineWidth = 1.4;
    for (const sg of [-1, 1]) {
      const p = pole[String(sg)];
      for (let k = 0; k < 8; k++) {
        const w = k * Math.PI / 4 + t * 0.3;
        ctx.beginPath(); ctx.moveTo(p.x + 4 * Math.cos(w), p.y + 4 * Math.sin(w));
        ctx.lineTo(p.x + 8 * Math.cos(w), p.y + 8 * Math.sin(w)); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI); ctx.fill();
    }
    ctx.restore();
  }
  for (const st of alle) for (const stab of st) _n9lStab(ctx, stab, 0);
}
// Zähler oben links
function _n9lZaehler(ctx) {
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, 10, 8, 104, 28, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0f172a'; ctx.font = '700 16px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Zellen: ' + _n9l.zahl, 62, 28);
  ctx.restore();
}
// Am Start: Pfeil mit der Aufschrift „Chromosomen“ auf ein Stäbchen
function _n9lPfeil(ctx, t) {
  const z = _n9l.zellen[0], st = _n9lRuheStaebe(z, t)[1];       // das kurze rote
  const k = st.l / 2;
  const ex = st.x + Math.cos(st.w) * k, ey = st.y + Math.sin(st.w) * k;
  const sx = 318, sy = 41;
  const dx = sx - ex, dy = sy - ey, d = Math.hypot(dx, dy) || 1;
  const px = ex + dx / d * 6, py = ey + dy / d * 6;              // Spitze knapp davor
  ctx.save();
  ctx.strokeStyle = '#334155'; ctx.fillStyle = '#334155'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  const a = Math.atan2(py - sy, px - sx);
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(px - 6 * Math.cos(a), py - 6 * Math.sin(a)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px, py);
  ctx.lineTo(px - 11 * Math.cos(a - 0.42), py - 11 * Math.sin(a - 0.42));
  ctx.lineTo(px - 11 * Math.cos(a + 0.42), py - 11 * Math.sin(a + 0.42));
  ctx.closePath(); ctx.fill();
  ctx.font = '700 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  const txt = 'Chromosomen', bw = Math.max(ctx.measureText(txt).width + 20, 110);   // 300 … 410
  ctx.fillStyle = '#ffffff'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, 300, 15, bw, 24, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0f172a'; ctx.textAlign = 'center'; ctx.fillText(txt, 300 + bw / 2, 32);
  ctx.restore();
}
// Band unten: vier Felder für die vier Abschnitte, ohne Schrift
function _n9lBand(ctx, s, W, H) {
  const bw = 36, luft = 6, x0 = W / 2 - (4 * bw + 3 * luft) / 2, y = H - 12;
  ctx.save();
  _N9L_ABSCHNITT.forEach((ab, k) => {
    const x = x0 + k * (bw + luft), u = _n9lKl((s - ab[0]) / (ab[1] - ab[0]));
    ctx.fillStyle = '#dbe4ea'; _bioFxRundRect(ctx, x, y, bw, 6, 3); ctx.fill();
    if (u > 0.01) { ctx.fillStyle = '#f59e0b'; _bioFxRundRect(ctx, x, y, Math.max(6, bw * u), 6, 3); ctx.fill(); }
  });
  ctx.restore();
}
function _n9lDraw(ctx, cv) {
  if (!_n9l) return;
  const W = cv.width, H = cv.height, t = _n9l.t;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = _N9L_HG; ctx.fillRect(0, 0, W, H);
  if (_n9l.laeuft) for (const j of _n9l.jobs) _n9lZeichneTeilung(ctx, j, _n9l.s, t);
  else for (const z of _n9l.zellen) _n9lZeichneZelle(ctx, z, t);
  _n9lZaehler(ctx);
  if (!_n9l.laeuft && _n9l.teilungen === 0) _n9lPfeil(ctx, t);
  if (_n9l.laeuft) _n9lBand(ctx, _n9l.s, W, H);
  _bioFxAlleDraw(ctx, _n9l.fx);
}
