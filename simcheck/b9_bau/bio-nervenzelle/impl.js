// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · WIE IST DIE NERVENZELLE GEBAUT?   (Förderheft Bio 9 · br3)
// Kennung bio-nervenzelle, Präfix _n9c. Bauplan: arbeitsheft_bio_foe9/
// einheiten/br3.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 310):
//   links  Lina sitzt barfuß auf einer Matte, von der Seite, Blick nach links,
//          in echtem Maßstab (150 Bildpunkte je Meter): schematischer Umriss,
//          Sporthose, T-Shirt, keine Gesichtszüge. Durchscheinend gezeichnet
//          das Gehirn und das Rückenmark (cremefarben). Im Rückenmark ein
//          winziger gelber Punkt (der Zellkörper), von dort eine dünne gelbe
//          Linie (die Nervenfaser) den Rücken hinunter, unter dem Bein entlang
//          bis zu einem Muskel im Fuß (rot). Die Linie ist im Bild 164
//          Bildpunkte lang, also rund 1,1 m.
//          Um den Punkt ein kleiner Kreis, zwei gestrichelte Linien führen zur
//   rechts Lupe: dieselbe Nervenzelle stark vergrößert – Zellkörper mit
//          Zellkern, 6 deutlich getrennte, unverzweigte Dendriten, der Anfang
//          der EINEN Nervenfaser (dicker, glatt, läuft unten aus der Lupe).
//          Am oberen linken Dendriten endet in Grau die Faser einer anderen
//          Nervenzelle mit einem Knöpfchen (sie bringt den Befehl vom Gehirn).
//   unten  ein Maßband (Gehäuse) mit der großen Anzeige „Länge: …“ und die
//          Legende „Erregung“ (gelber Lichtpunkt).
//   Zellteile stehen NIRGENDS als Wort im Bild. Die Lupe ist schematisch,
//   nicht maßstäblich (Dendriten im Bild rund 2-mal so lang wie der
//   Zellkörper breit ist, in Wirklichkeit 10-mal) – deshalb trägt das
//   Maßband keine Teilstriche, nur Endmarken.
//
// BEDIENUNG (wörtlich wie im Bauplan):
//   Maßband an: „Zellkörper“ · „Dendriten“ · „Nervenfaser“
//               (Wahlgruppe _n9cMass('koerper'|'dendrit'|'faser'); Start: Zellkörper)
//   „▶ Erregung senden“ (_n9cSenden) · „neu“ (_n9cNeu → Maßband am Zellkörper)
//   Der gewählte Teil blinkt in BEIDEN Bildern: er färbt sich weich blau und
//   zurück, dazu ein blauer Schein (0,8 Hz, nie schneller, kein An/Aus).
//   Im Körperbild sind Zellkörper und Dendriten zusammen nur der Punkt – also
//   blinkt dort bei beiden der Punkt, bei „Nervenfaser“ die gelbe Linie.
//   Das Maßband legt sich in 0,6 s an den Teil an:
//     Zellkörper   quer über die untere Hälfte des Zellkörpers in der Lupe
//     Dendriten    neben EINEN Dendriten in der Lupe (rechts oben)
//     Nervenfaser  im Körperbild neben der gelben Linie vom Rückenmark bis
//                  zum Fuß
//   Die Anzahl der Teile wird NICHT angezeigt – das Kind zählt in der Lupe.
//   Hinweiskasten: „Grau in der Lupe: die Nervenzelle davor. … Zähle nur die
//   gelbe Zelle.“ (sonst zählt ein Kind die graue Faser als zweite Nervenfaser).
//
// STATUSZEILEN (wörtlich):
//   _n9c-mass    „Maßband am Zellkörper · Länge: 0,1 mm“
//                „Maßband am Dendriten · Länge: 1 mm“
//                „Maßband an der Nervenfaser · Länge: 1 m“
//                (im Bild unten groß: „Länge: 0,1 mm“ / „Länge: 1 mm“ / „Länge: 1 m“)
//   _n9c-status  vorher        „Lina sitzt ruhig auf der Matte.“
//                0–1,6 s       „Der Befehl kommt vom Gehirn.“
//                1,6–3,35 s    „Sieh in die Lupe: Wo läuft die Erregung hinein?“
//                3,35–4,45 s   „Sieh in die Lupe: Wo läuft die Erregung hinaus?“
//                4,45–6,65 s   „Die Erregung läuft das Bein hinunter.“
//                ab 6,65 s     „Lina wackelt mit den Zehen.“ (bleibt stehen)
//   _n9c-hinweis Bedienhinweis (vorher / unterwegs / danach)
//
// ABLAUF NACH „▶ Erregung senden“ (stark verlangsamt, Zeiten in s):
//   0–0,4    Lichtring im Gehirn, der gelbe Lichtpunkt liegt dort
//   0,4–1,6  Körperbild: Lichtpunkt läuft das Rückenmark hinunter bis zum Punkt
//   1,6–2,2  Lupe: er kommt auf der grauen Faser der anderen Nervenzelle an
//   2,2–2,35 er springt vom Knöpfchen auf die Spitze des Dendriten
//   2,35–3,35 er läuft den Dendriten entlang in den Zellkörper
//   3,35–4,45 er läuft die Nervenfaser entlang unten aus der Lupe
//   4,45–6,65 Körperbild: er läuft die gelbe Linie entlang bis zum Muskel
//   6,65     der Muskel zieht sich zusammen, Linas Zehen wackeln (1,1 Hz, bis
//            „neu“ oder bis zum nächsten Senden – so lange, wie die Statuszeile
//            „Lina wackelt mit den Zehen.“ sagt)
//   Jedes Stück, das der Lichtpunkt erreicht hat, bleibt hell (orange Spur):
//   EIN Dendrit, Zellkörper, Nervenfaser, Linie bis zum Fuß. Ende bei 9,0 s.
//   Während des Laufs bleibt der Knopf „▶ Erregung senden“ ohne Wirkung.
//
// WERTE (lehrer.tabelle_erwartet; Modellwerte, im Lehrerteil gekennzeichnet):
//   Zellkörper   zählen: 1   Maßband: 0,1 mm
//   Dendriten    zählen: 6   Maßband: 1 mm  (an einem Dendriten)
//   Nervenfaser  zählen: 1   Maßband: 1 m
//   ▶ Erregung senden: Weg Dendrit → Zellkörper → Nervenfaser → Muskel im Fuß,
//                      danach bewegen sich die Zehen (nur als Bild, nicht als Text)
//
// SIMFAKTEN: Der Lauf dauert 9 s (563 Frames). Mit den Bandschaltern
//   (--voll --frames=25 --verlauf=4, wie fakten_ziehen.py) stehen alle sechs
//   Statuszeilen im Dump; mit den Voreinstellungen (2 Frames) endet er bei
//   „Der Befehl kommt vom Gehirn.“.
//
// AHA (_bioFx, nach der Beobachtung): 0,95 s nach dem Ankommen am Fuß glüht
//   die GANZE Zelle einmal weich auf – im Körperbild Punkt und Linie bis zum
//   Fuß in einem Zug, in der Lupe die Zelle –, dazu das Banner
//   „Bis zum Fuß: dieselbe Zelle!“. Das widerlegt die Kette aus Hunderten
//   Zellen (Vermutung 1); dass die Dendriten nicht bis zum Fuß reichen
//   (Vermutung 3), zeigt das Maßband (1 mm gegen 1 m) und der Weg hinaus.
//
// NICHT AM BILDSCHIRM (sim_plan.anzeigen): „empfängt“, „Meter“, „eine“,
//   „viele“, „winzig“ – auch nicht als Wortteil (kein „Beine“, „keine“,
//   „einem“, „Zentimeter“). Die Überschrift heißt deshalb „Wie ist die
//   Nervenzelle gebaut?“ statt „… eine Nervenzelle …“.
// Keine Nacktheit (Hose, T-Shirt, nur die Füße bloß), keine Gesichtszüge.
// ═══════════════════════════════════════════════════════════════════════
let _n9c = null;
let _n9cG = null;                                    // Geometrie, einmal berechnet
const _n9cTEIL = { koerper: 'Zellkörper', dendrit: 'Dendriten', faser: 'Nervenfaser' };
const _n9cLAENGE = { koerper: '0,1 mm', dendrit: '1 mm', faser: '1 m' };
const _n9cAN = { koerper: 'Maßband am Zellkörper', dendrit: 'Maßband am Dendriten',
                 faser: 'Maßband an der Nervenfaser' };
const _n9cPXM = 150;                                 // Körperbild: Bildpunkte je Meter
// Zeitplan von „▶ Erregung senden“ (s ab dem Druck)
const _n9cZ = { hirn: 0.4, p1: 1.6, p2a: 2.2, sprung: 2.35, p2b: 3.35, p2c: 4.45,
                p3: 6.65, aha: 7.6, ende: 9.0 };
const _n9cSATZ = {
  ruhe:   'Lina sitzt ruhig auf der Matte.',
  hirn:   'Der Befehl kommt vom Gehirn.',
  hinein: 'Sieh in die Lupe: Wo läuft die Erregung hinein?',
  hinaus: 'Sieh in die Lupe: Wo läuft die Erregung hinaus?',
  bein:   'Die Erregung läuft das Bein hinunter.',
  zehen:  'Lina wackelt mit den Zehen.'
};

// ── Hilfen für Linienzüge ([x, y]-Listen) ──────────────────────────────
function _n9cMessen(p) {
  const c = [0];
  for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  p.cum = c; p.len = c[c.length - 1] || 1;
  return p;
}
// Glatter Zug durch Stützpunkte (Catmull-Rom), k Punkte je Abschnitt
function _n9cKurve(s, k) {
  const out = [];
  for (let i = 0; i < s.length - 1; i++) {
    const a = s[Math.max(0, i - 1)], b = s[i], c = s[i + 1], d = s[Math.min(s.length - 1, i + 2)];
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t;
      const f = q => 0.5 * (2 * b[q] + (-a[q] + c[q]) * t + (2 * a[q] - 5 * b[q] + 4 * c[q] - d[q]) * t2
                            + (-a[q] + 3 * b[q] - 3 * c[q] + d[q]) * t3);
      out.push([f(0), f(1)]);
    }
  }
  out.push(s[s.length - 1].slice());
  return _n9cMessen(out);
}
function _n9cBez(p0, p1, p2, p3, n) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, v = 1 - u;
    const f = q => v * v * v * p0[q] + 3 * v * v * u * p1[q] + 3 * v * u * u * p2[q] + u * u * u * p3[q];
    out.push([f(0), f(1)]);
  }
  return out;
}
// Punkt beim Anteil u (0 … 1) der Länge
function _n9cAuf(p, u) {
  if (!p.cum) _n9cMessen(p);
  const s = Math.max(0, Math.min(1, u)) * p.len, c = p.cum;
  let i = 1;
  while (i < c.length - 1 && c[i] < s) i++;
  const f = (s - c[i - 1]) / ((c[i] - c[i - 1]) || 1);
  return { x: p[i - 1][0] + (p[i][0] - p[i - 1][0]) * f, y: p[i - 1][1] + (p[i][1] - p[i - 1][1]) * f };
}
// Teilstück von u0 bis u1
function _n9cStueck(p, u0, u1) {
  if (!p.cum) _n9cMessen(p);
  const a = _n9cAuf(p, u0), b = _n9cAuf(p, u1), s0 = u0 * p.len, s1 = u1 * p.len;
  const out = [[a.x, a.y]];
  for (let i = 1; i < p.length - 1; i++) if (p.cum[i] > s0 && p.cum[i] < s1) out.push(p[i]);
  out.push([b.x, b.y]);
  return out;
}
// Parallele im Abstand d (rechts der Laufrichtung)
function _n9cVersatz(p, d) {
  const out = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    out.push([p[i][0] - dy * d, p[i][1] + dx * d]);
  }
  return _n9cMessen(out);
}
// Schlauch um einen Zug; Breite wf(u) mit u = Anteil der Länge
function _n9cSchlauch(p, wf) {
  if (!p.cum) _n9cMessen(p);
  const li = [], re = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = wf(p.cum[i] / p.len) / 2;
    li.push([p[i][0] + dy * w, p[i][1] - dx * w]);
    re.push([p[i][0] - dy * w, p[i][1] + dx * w]);
  }
  return li.concat(re.reverse());
}
// Farbe zwischen a und b mischen (#rrggbb), f = 0 … 1
function _n9cMisch(a, b, f) {
  const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
  const k = (sh) => Math.round(((x >> sh) & 255) + ((((y >> sh) & 255) - ((x >> sh) & 255)) * f));
  return 'rgb(' + k(16) + ',' + k(8) + ',' + k(0) + ')';
}
function _n9cZug(ctx, p) {
  ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
}
function _n9cFlaeche(ctx, p) { _n9cZug(ctx, p); ctx.closePath(); }

// Ein Dendrit: leicht geschwungen, unverzweigt, vom Zellkörper nach außen
function _n9cDendrit(C, a, rt, i) {
  const dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
  const b = (i % 2 ? 1 : -1) * 3.5, out = [];
  for (let k = 0; k <= 16; k++) {
    const u = k / 16, r = C.r * 0.75 + (rt - C.r * 0.75) * u, q = b * Math.sin(Math.PI * u);
    out.push([C.x + dx * r + nx * q, C.y + dy * r + ny * q]);
  }
  return _n9cMessen(out);
}

function _n9cGeo() {
  if (_n9cG) return _n9cG;
  const G = {};
  // ── Körperbild: Lina sitzt, Blick nach links (150 Bildpunkte je Meter) ──
  G.matte = 210;
  G.kopf = { x: 188, y: 94, r: 17 };
  G.hirn = { x: 191, y: 89, rx: 10.5, ry: 8 };
  G.punkt = { x: 198, y: 156 };                      // Zellkörper im Rückenmark
  G.mark = _n9cKurve([[192, 97], [195, 114], [197, 134], [198, 162]], 6);
  G.befehl = _n9cKurve([[191, 89], [192, 98], [195, 114], [197, 134], [198, 156]], 6);
  G.faser = _n9cKurve([[198, 156], [199, 176], [197, 193], [190, 202], [176, 205], [140, 205],
                       [100, 205], [90, 205], [84, 203], [80, 199], [80, 197]], 6);
  G.muskel = { x: 80, y: 191, rx: 3, ry: 6 };
  G.zehe = { x: 81, y: 183 };
  G.bein = [[176, 184], [150, 188], [120, 193], [96, 198], [90, 200], [88, 209], [206, 209], [207, 194]];
  G.fuss = _n9cKurve([[93, 199], [90, 190], [87, 183], [81, 181], [76, 183], [74, 192], [75, 202], [79, 208.5], [86, 210], [93, 209]], 4);
  // ── Lupe ──
  G.L = { x: 326, y: 122, r: 90 };
  G.C = { x: 326, y: 104, r: 12 };
  G.rt = 55;
  G.winkel = [148, 196, 238, 290, 338, 32];
  G.empf = 2;                                        // Dendrit, an dem die Erregung ankommt
  G.mess = 4;                                        // Dendrit, an dem das Maßband liegt
  G.dend = G.winkel.map((w, i) => _n9cDendrit(G.C, w * Math.PI / 180, G.rt, i));
  G.dendForm = G.dend.map(d => _n9cSchlauch(d, u => 6.2 - 4.6 * u));
  const ae = G.winkel[G.empf] * Math.PI / 180;
  const T = G.dend[G.empf][G.dend[G.empf].length - 1];
  G.spitze = { x: T[0], y: T[1] };
  G.knopf = { x: G.C.x + Math.cos(ae) * (G.rt + 7), y: G.C.y + Math.sin(ae) * (G.rt + 7), r: 4 };
  const ew = 205 * Math.PI / 180;
  const E = [G.L.x + Math.cos(ew) * (G.L.r - 1), G.L.y + Math.sin(ew) * (G.L.r - 1)];
  G.fremd = _n9cMessen(_n9cBez(E, [258, 70], [278, 54], [G.knopf.x, G.knopf.y], 24));
  G.spalt = _n9cMessen([[G.knopf.x, G.knopf.y], [T[0], T[1]]]);
  G.hinein = _n9cMessen(G.dend[G.empf].slice().reverse().concat([[G.C.x, G.C.y]]));
  // Nervenfaser in der Lupe: vom Zellkörper nach unten bis an den Rand der Lupe
  const roh = _n9cBez([G.C.x, G.C.y], [327, 140], [320, 172], [332, 218], 48), ax = [];
  for (const p of roh) {
    const d = Math.hypot(p[0] - G.L.x, p[1] - G.L.y);
    if (d > G.L.r - 1) {
      const q = ax[ax.length - 1], dq = Math.hypot(q[0] - G.L.x, q[1] - G.L.y);
      const f = (G.L.r - 1 - dq) / ((d - dq) || 1);
      ax.push([q[0] + (p[0] - q[0]) * f, q[1] + (p[1] - q[1]) * f]);
      break;
    }
    ax.push(p);
  }
  G.axon = _n9cMessen(ax);
  G.axonForm = _n9cSchlauch(G.axon, u => {
    const s = u * G.axon.len;
    return s < 24 ? 10 - 5.4 * (s / 24) : 4.6;
  });
  // Maßband-Lagen
  const am = G.winkel[G.mess] * Math.PI / 180, mx = Math.cos(am), my = Math.sin(am);
  G.band = {
    koerper: _n9cMessen([[G.C.x - G.C.r, G.C.y + 6.5], [G.C.x + G.C.r, G.C.y + 6.5]]),
    dendrit: _n9cMessen([[G.C.x + mx * G.C.r - my * 8, G.C.y + my * G.C.r + mx * 8],
                         [G.C.x + mx * G.rt - my * 8, G.C.y + my * G.rt + mx * 8]]),
    faser: _n9cVersatz(G.faser, -8)
  };
  // Lupenkreis im Körperbild und die beiden Verbindungslinien (äußere Tangenten)
  G.zoom = { x: G.punkt.x, y: G.punkt.y, r: 11 };
  const dz = Math.hypot(G.L.x - G.zoom.x, G.L.y - G.zoom.y);
  const th = Math.atan2(G.L.y - G.zoom.y, G.L.x - G.zoom.x), ph = Math.acos((G.zoom.r - G.L.r) / dz);
  G.zoomLinien = [th + ph, th - ph].map(a => [
    [G.zoom.x + G.zoom.r * Math.cos(a), G.zoom.y + G.zoom.r * Math.sin(a)],
    [G.L.x + G.L.r * Math.cos(a), G.L.y + G.L.r * Math.sin(a)]]);
  _n9cG = G;
  return G;
}

// ── Zustand und Bedienung ──────────────────────────────────────────────
function _n9cLeer() {
  const z = _n9c;
  z.laeuft = false; z.fertig = false; z.s = 0;
  z.hell = { empf: 0, soma: 0, axon: 0, faser: 0 };
  z.zieh = 0; z.wackel = 0; z.glanz = 0;
  z.fx = { teile: [] };
}
function _n9cInit() {
  _n9cGeo();
  _n9c = { t: 0, teil: 'koerper', band: 1, letzt: '' };
  _n9cLeer();
}
function _n9cMass(v) {
  if (!_n9c || !_n9cTEIL[v]) return;
  if (v !== _n9c.teil) _n9c.band = 0;                 // Maßband legt sich neu an
  _n9c.teil = v;
  _n9cStatus();
}
function _n9cSenden() {
  if (!_n9c || _n9c.laeuft) return;
  const G = _n9cGeo();
  _n9cLeer();
  _n9c.laeuft = true;
  _bioFxWelle(_n9c.fx.teile, G.hirn.x, G.hirn.y, '#fde047', 22);
  _n9cStatus();
}
function _n9cNeu() {
  if (!_n9c) return;
  _n9cLeer();
  if (_n9c.teil !== 'koerper') _n9c.band = 0;
  _n9c.teil = 'koerper';
  _n9cStatus();
}

// ── Anzeige ────────────────────────────────────────────────────────────
function _n9cSatz() {
  const z = _n9c, Z = _n9cZ, S = _n9cSATZ, s = z.s;
  if (!z.laeuft && !z.fertig) return S.ruhe;
  if (z.fertig || s >= Z.p3) return S.zehen;
  if (s < Z.p1) return S.hirn;
  if (s < Z.p2b) return S.hinein;
  if (s < Z.p2c) return S.hinaus;
  return S.bein;
}
function _n9cSchluessel() {
  return _n9c.teil + '|' + _n9cSatz() + '|' + _n9c.laeuft + '|' + _n9c.fertig;
}
function _n9cHTML() {
  const k = v => `<button class="sim-btn" data-n9c="${v}" onclick="_n9cMass('${v}')">${_n9cTEIL[v]}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie ist die Nervenzelle gebaut?</h3>
    <div class="fpm-note" style="margin-top:2px">Links sitzt Lina auf der Matte, von der Seite gesehen. Rechts in der Lupe: der gelbe Punkt aus ihrem Rückenmark, stark vergrößert.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9c-cv" width="420" height="310" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9c-los" onclick="_n9cSenden()">▶ Erregung senden</button>
          <button class="sim-btn" onclick="_n9cNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Maßband an</span>
          <div class="sim-btn-row">${k('koerper')}${k('dendrit')}${k('faser')}</div>
        </div>
        <div class="lmp-status on" id="_n9c-mass" style="margin-top:8px"></div>
        <div class="lmp-status on" id="_n9c-status" style="margin-top:6px"></div>
        <div class="fpm-note" id="_n9c-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:8px">Grau in der Lupe: die Nervenzelle davor. Sie bringt den Befehl vom Gehirn. Zähle nur die gelbe Zelle.</div>
        <div class="fpm-note" style="margin-top:8px">Bei den Dendriten misst das Maßband nur den Dendriten, an dem es liegt.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Maßband am Zellkörper &nbsp;|&nbsp; Alle Längen sind Modellwerte.</p>
  </div>`;
}
function _n9cStatus() {
  if (!_n9c) return;
  const z = _n9c;
  const m = document.getElementById('_n9c-mass');
  if (m) { m.textContent = _n9cAN[z.teil] + ' · Länge: ' + _n9cLAENGE[z.teil]; m.className = 'lmp-status on'; }
  const st = document.getElementById('_n9c-status');
  if (st) { st.textContent = _n9cSatz(); st.className = 'lmp-status on'; }
  const h = document.getElementById('_n9c-hinweis');
  if (h) h.textContent = z.laeuft ? 'Achte auf den gelben Lichtpunkt.'
    : z.fertig ? 'Der Weg der Erregung bleibt hell. Mit „neu“ beginnt alles von vorn.'
    : 'Stelle „Maßband an“ um und lies die Länge ab. Zähle die Teile in der Lupe selbst. Drücke dann „▶ Erregung senden“.';
  try {
    document.querySelectorAll('[data-n9c]').forEach(b => {
      const v = b.getAttribute('data-n9c');
      if (b.classList) b.classList.toggle('primary', v === z.teil);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9c-los');
  if (los && los.classList) los.classList.toggle('primary', !z.laeuft);
  z.letzt = _n9cSchluessel();
}

// ── Ablauf ─────────────────────────────────────────────────────────────
function _n9cUpdate(dt) {
  if (!_n9c) return;
  dt = _bioFxDt(dt);
  const z = _n9c, Z = _n9cZ, G = _n9cGeo();
  z.t += dt;
  z.band = Math.min(1, z.band + dt / 0.6);
  if (z.laeuft) {
    const s0 = z.s;
    z.s += dt;
    const s = z.s, ueber = x => s0 < x && s >= x, H = z.hell;
    if (s >= Z.sprung) H.empf = Math.min(1, (s - Z.sprung) / (Z.p2b - Z.sprung));
    if (s >= Z.p2b - 0.15) H.soma = Math.min(1, (s - Z.p2b + 0.15) / 0.4);
    if (s >= Z.p2b) H.axon = Math.min(1, (s - Z.p2b) / (Z.p2c - Z.p2b));
    if (s >= Z.p2c) H.faser = Math.min(1, (s - Z.p2c) / (Z.p3 - Z.p2c));
    const fx = z.fx.teile;
    if (ueber(Z.p1)) {                                // Blick in die Lupe lenken
      _bioFxWelle(fx, G.zoom.x, G.zoom.y, '#fde047', 20);
      _bioFxWelle(fx, G.fremd[0][0], G.fremd[0][1], '#fde047', 22);
    }
    if (ueber(Z.sprung)) _bioFxWelle(fx, G.spitze.x, G.spitze.y, '#fb923c', 16);
    if (ueber(Z.p2c)) _bioFxWelle(fx, G.punkt.x, G.punkt.y, '#fde047', 20);
    if (ueber(Z.p3)) {                                // am Muskel angekommen
      z.zieh = 1; z.wackel = 0.001;
      _bioFxWelle(fx, G.muskel.x, G.muskel.y, '#fca5a5', 22);
      _bioFxWelle(fx, G.zehe.x, G.zehe.y - 6, '#fde047', 18);
    }
    if (ueber(Z.aha)) {                               // die ganze Zelle glüht einmal auf
      z.glanz = 1;
      _bioFxBanner(z.fx, 'Bis zum Fuß: dieselbe Zelle!', 3.2, '#fde047');
    }
    if (s >= Z.ende) { z.laeuft = false; z.fertig = true; }
  }
  if (z.wackel > 0) z.wackel += dt;                   // Zehen wackeln bis „neu“ oder neues Senden
  z.zieh = Math.max(0, z.zieh - dt / 1.6);
  z.glanz = Math.max(0, z.glanz - dt / 1.8);
  if (_n9cSchluessel() !== z.letzt) _n9cStatus();
  _bioFxAlleUpdate(z.fx, dt);
}
// Wo ist der Lichtpunkt gerade? {wo, pfad, u} oder null
function _n9cLicht() {
  const z = _n9c, Z = _n9cZ, G = _n9cGeo(), s = z.s;
  if (!z.laeuft) return null;
  const u = (a, b) => (s - a) / (b - a);
  if (s < Z.hirn) return { wo: 'koerper', pfad: G.befehl, u: 0 };
  if (s < Z.p1) return { wo: 'koerper', pfad: G.befehl, u: u(Z.hirn, Z.p1) };
  if (s < Z.p2a) return { wo: 'lupe', pfad: G.fremd, u: u(Z.p1, Z.p2a) };
  if (s < Z.sprung) return { wo: 'lupe', pfad: G.spalt, u: u(Z.p2a, Z.sprung) };
  if (s < Z.p2b) return { wo: 'lupe', pfad: G.hinein, u: u(Z.sprung, Z.p2b) };
  if (s < Z.p2c) return { wo: 'lupe', pfad: G.axon, u: u(Z.p2b, Z.p2c) };
  if (s < Z.p3) return { wo: 'koerper', pfad: G.faser, u: u(Z.p2c, Z.p3) };
  return null;
}

// ── Zeichnen ───────────────────────────────────────────────────────────
// Zehen: leicht angehoben; nach dem Ankommen wackeln sie (1,1 Hz, Bewegung, kein Blinken)
function _n9cZehenWinkel(z) {
  return z.wackel > 0 ? 0.15 + 0.5 * Math.sin(z.wackel * Math.PI * 2 * 1.1) : 0.15;
}
function _n9cLichtpunkt(ctx, p, u) {
  ctx.save();
  for (let k = 5; k >= 1; k--) {                      // kurzer Schweif
    const q = _n9cAuf(p, u - k * 3 / p.len);
    ctx.fillStyle = 'rgba(253,224,71,' + (0.55 - k * 0.09).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(q.x, q.y, 4 - k * 0.45, 0, Math.PI * 2); ctx.fill();
  }
  const o = _n9cAuf(p, u);
  ctx.fillStyle = 'rgba(253,224,71,0.45)';
  ctx.beginPath(); ctx.arc(o.x, o.y, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fffbeb'; ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(o.x, o.y, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Maßband: weißes Band mit blauem Rand und zwei Endmarken, f = ausgerollter Anteil
function _n9cMassband(ctx, p, f) {
  if (f <= 0.01) return;
  const q = _n9cStueck(p, 0, f);
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'butt';
  ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 7.5; _n9cZug(ctx, q); ctx.stroke();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4.5; _n9cZug(ctx, q); ctx.stroke();
  const marke = (i, j) => {
    const a = q[i], b = q[j];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(a[0] - dy * 7, a[1] + dx * 7); ctx.lineTo(a[0] + dy * 7, a[1] - dx * 7); ctx.stroke();
  };
  marke(0, 1);
  if (f >= 0.999) marke(q.length - 1, q.length - 2);
  ctx.restore();
}
function _n9cKoerper(ctx, G, z, t, halo, blau) {
  const S = _n9cZ;
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // Matte
  ctx.fillStyle = '#c7d2fe'; ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, 14, G.matte, 222, 9, 4); ctx.fill(); ctx.stroke();
  // Bein in der Sporthose
  ctx.fillStyle = '#475569'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
  _n9cFlaeche(ctx, G.bein); ctx.fill(); ctx.stroke();
  // Fuß (barfuß) mit Zehen, die sich bewegen können
  const haut = '#f3c9a8', hautRand = '#9a6b4f';
  ctx.fillStyle = haut; ctx.strokeStyle = hautRand; ctx.lineWidth = 1.4;
  _n9cFlaeche(ctx, G.fuss); ctx.fill(); ctx.stroke();
  const w = _n9cZehenWinkel(z);
  ctx.save();
  ctx.translate(G.zehe.x, G.zehe.y); ctx.rotate(w);
  ctx.fillStyle = haut; ctx.strokeStyle = hautRand;
  ctx.beginPath(); ctx.moveTo(-5.4, 2); ctx.lineTo(-5.4, -8); ctx.arc(0, -8, 5.4, Math.PI, 0); ctx.lineTo(5.4, 2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
  // Rumpf im T-Shirt, Hals, Kopf
  ctx.fillStyle = '#8fc3ae'; ctx.strokeStyle = '#3f6f5e'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, 168, 122, 38, 87, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = haut; ctx.strokeStyle = hautRand;
  ctx.fillRect(182, 108, 12, 17); ctx.strokeRect(182, 108, 12, 17);
  const K = G.kopf;
  ctx.beginPath(); ctx.arc(K.x, K.y, K.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(K.x - K.r + 0.5, K.y + 3, 2.6, Math.PI * 0.5, Math.PI * 1.5); ctx.fill(); ctx.stroke();
  // Haare: Kappe über Scheitel und Hinterkopf, Zopf
  ctx.fillStyle = '#5b3a29';
  ctx.beginPath(); ctx.arc(K.x, K.y, K.r + 1.5, Math.PI * 1.08, Math.PI * 2.28);
  ctx.lineTo(K.x + 4, K.y + 2); ctx.lineTo(K.x - 8, K.y - 9); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(K.x + K.r + 3, K.y + 6, 4.5, 8, -0.35, 0, Math.PI * 2); ctx.fill();
  // Arm, Hand liegt auf dem Oberschenkel
  ctx.strokeStyle = '#3f6f5e'; ctx.lineWidth = 10.5;
  ctx.beginPath(); ctx.moveTo(190, 131); ctx.lineTo(186, 146); ctx.stroke();
  ctx.strokeStyle = '#8fc3ae'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(190, 131); ctx.lineTo(186, 146); ctx.stroke();
  ctx.strokeStyle = hautRand; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(186, 146); ctx.lineTo(182, 163); ctx.lineTo(159, 184); ctx.stroke();
  ctx.strokeStyle = haut; ctx.lineWidth = 5.5;
  ctx.beginPath(); ctx.moveTo(186, 146); ctx.lineTo(182, 163); ctx.lineTo(159, 184); ctx.stroke();
  // Gehirn und Rückenmark, durchscheinend gezeichnet
  ctx.fillStyle = 'rgba(254,249,195,0.95)'; ctx.strokeStyle = '#b8a35a'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(G.hirn.x, G.hirn.y, G.hirn.rx, G.hirn.ry, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#b8a35a'; ctx.lineWidth = 6.5; _n9cZug(ctx, G.mark); ctx.stroke();
  ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = 4; _n9cZug(ctx, G.mark); ctx.stroke();

  // Gewählter Teil leuchtet (Punkt bzw. Linie)
  if (z.teil === 'faser') {
    ctx.strokeStyle = halo; ctx.lineWidth = 10; _n9cZug(ctx, G.faser); ctx.stroke();
  } else {
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(G.punkt.x, G.punkt.y, 6.5, 0, Math.PI * 2); ctx.fill();
  }
  // Glühen der ganzen Zelle (Aha)
  const ga = z.glanz > 0 ? Math.sin(Math.PI * (1 - z.glanz)) : 0;
  if (ga > 0.01) {
    ctx.strokeStyle = 'rgba(253,224,71,' + (0.8 * ga).toFixed(3) + ')'; ctx.lineWidth = 11;
    _n9cZug(ctx, G.faser); ctx.stroke();
    ctx.fillStyle = 'rgba(253,224,71,' + (0.8 * ga).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(G.punkt.x, G.punkt.y, 8, 0, Math.PI * 2); ctx.fill();
  }
  // Muskel im Fuß; er zieht sich zusammen, wenn die Erregung ankommt
  const M = G.muskel, zz = Math.max(z.zieh, z.wackel > 0 ? 0.5 + 0.5 * Math.sin(z.wackel * Math.PI * 2 * 1.1) : 0);
  ctx.fillStyle = zz > 0.05 ? '#ef4444' : '#f87171'; ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(M.x, M.y, M.rx + 0.9 * zz, M.ry - 1.4 * zz, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Die Nervenzelle in echtem Maßstab: Punkt und dünne gelbe Linie
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 3.8; _n9cZug(ctx, G.faser); ctx.stroke();
  ctx.strokeStyle = z.teil === 'faser' ? _n9cMisch('#facc15', '#93c5fd', blau) : '#facc15';
  ctx.lineWidth = 2.2; _n9cZug(ctx, G.faser); ctx.stroke();
  if (z.hell.faser > 0.001) {                         // Spur bleibt hell
    const q = _n9cStueck(G.faser, 0, z.hell.faser);
    ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 5; _n9cZug(ctx, q); ctx.stroke();
    ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = 2.6; _n9cZug(ctx, q); ctx.stroke();
  }
  const aktiv = z.laeuft && z.s >= S.p1 && z.s < S.p2c;
  if (aktiv) _bioFxLeuchten(ctx, G.punkt.x, G.punkt.y, 5, t, '253,224,71');
  ctx.fillStyle = z.teil !== 'faser' ? _n9cMisch('#facc15', '#93c5fd', blau) : '#facc15';
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(G.punkt.x, G.punkt.y, 2.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Maßband an der Nervenfaser
  if (z.teil === 'faser') _n9cMassband(ctx, G.band.faser, z.band);
  // Lichtpunkt im Körperbild
  const L = _n9cLicht();
  if (L && L.wo === 'koerper') _n9cLichtpunkt(ctx, L.pfad, L.u);
  ctx.restore();
}
function _n9cZoom(ctx, G) {
  ctx.save();
  ctx.strokeStyle = 'rgba(51,65,85,0.5)'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
  for (const [a, b] of G.zoomLinien) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  ctx.setLineDash([]);
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(G.zoom.x, G.zoom.y, G.zoom.r, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}
function _n9cLupe(ctx, G, z, t, halo, blau) {
  const L = G.L, C = G.C;
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const bg = ctx.createRadialGradient(L.x - 25, L.y - 30, 8, L.x, L.y, L.r);
  bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.arc(L.x, L.y, L.r, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.arc(L.x, L.y, L.r - 1, 0, Math.PI * 2); ctx.clip();
  // Faser der anderen Nervenzelle mit Knöpfchen (grau)
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 5; _n9cZug(ctx, G.fremd); ctx.stroke();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.8; _n9cZug(ctx, G.fremd); ctx.stroke();
  ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(G.knopf.x, G.knopf.y, G.knopf.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Gewählter Teil leuchtet
  if (z.teil === 'koerper') {
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(C.x, C.y, C.r + 6, 0, Math.PI * 2); ctx.fill();
  } else if (z.teil === 'dendrit') {
    ctx.strokeStyle = halo; ctx.lineWidth = 12;
    for (const d of G.dend) { _n9cZug(ctx, d); ctx.stroke(); }
  } else {
    ctx.strokeStyle = halo; ctx.lineWidth = 14; _n9cZug(ctx, G.axon); ctx.stroke();
  }
  // Zelle: erst ein gemeinsamer Umriss, dann die Füllung darüber
  const formen = G.dendForm.concat([G.axonForm]);
  const ga = z.glanz > 0 ? Math.sin(Math.PI * (1 - z.glanz)) : 0;
  if (ga > 0.01) {
    ctx.strokeStyle = 'rgba(253,224,71,' + (0.85 * ga).toFixed(3) + ')'; ctx.lineWidth = 9;
    for (const f of formen) { _n9cFlaeche(ctx, f); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(C.x, C.y, C.r + 3, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2.6;
  for (const f of formen) { _n9cFlaeche(ctx, f); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(C.x, C.y, C.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const gelb = '#fde68a', an = _n9cMisch(gelb, '#93c5fd', blau);
  ctx.fillStyle = z.teil === 'dendrit' ? an : gelb;
  for (const f of G.dendForm) { _n9cFlaeche(ctx, f); ctx.fill(); }
  ctx.fillStyle = z.teil === 'faser' ? an : gelb;
  _n9cFlaeche(ctx, G.axonForm); ctx.fill();
  ctx.fillStyle = z.teil === 'koerper' ? an : gelb;
  ctx.beginPath(); ctx.arc(C.x, C.y, C.r, 0, Math.PI * 2); ctx.fill();
  // Spur der Erregung: ein Dendrit, Zellkörper, Nervenfaser
  const H = z.hell;
  if (H.soma > 0.01) {
    ctx.fillStyle = 'rgba(251,146,60,' + (0.4 * H.soma).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(C.x, C.y, C.r - 0.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 2.6;
  if (H.empf > 0.001) { _n9cZug(ctx, _n9cStueck(G.hinein, 0, Math.min(H.empf, 0.97))); ctx.stroke(); }
  if (H.axon > 0.001) { _n9cZug(ctx, _n9cStueck(G.axon, 0.08, Math.max(0.08, H.axon))); ctx.stroke(); }
  // Zellkern
  ctx.fillStyle = '#d97706'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(C.x, C.y, 4.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.arc(C.x + 1.2, C.y - 1, 1.4, 0, Math.PI * 2); ctx.fill();
  // Maßband in der Lupe
  if (z.teil === 'koerper' || z.teil === 'dendrit') _n9cMassband(ctx, G.band[z.teil], z.band);
  // Lichtpunkt in der Lupe
  const P = _n9cLicht();
  if (P && P.wo === 'lupe') _n9cLichtpunkt(ctx, P.pfad, P.u);
  ctx.restore();
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(L.x, L.y, L.r, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}
function _n9cUnten(ctx, z, W) {
  const y0 = 228, h = 74;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, 10, y0, W - 20, h, 10); ctx.fill(); ctx.stroke();
  // Gehäuse des Maßbands
  const gx = 22, gy = y0 + 16;
  ctx.fillStyle = '#1e40af';
  _bioFxRundRect(ctx, gx, gy, 40, 40, 9); ctx.fill();
  ctx.fillStyle = '#dbeafe';
  ctx.beginPath(); ctx.arc(gx + 20, gy + 20, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1e40af';
  ctx.beginPath(); ctx.arc(gx + 20, gy + 20, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1.5;
  ctx.fillRect(gx + 40, gy + 31, 14, 6); ctx.strokeRect(gx + 40, gy + 31, 14, 6);
  ctx.fillStyle = '#1e40af'; ctx.fillRect(gx + 53, gy + 27, 3, 12);
  // Anzeige
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#475569'; ctx.font = '700 12px sans-serif';
  ctx.fillText('Maßband', 86, y0 + 22);
  ctx.fillStyle = '#0f172a'; ctx.font = '700 24px sans-serif';
  ctx.fillText('Länge: ' + _n9cLAENGE[z.teil], 86, y0 + 53);
  // Legende: gelber Lichtpunkt = Erregung
  const lx = 306, ly = y0 + 37;
  ctx.fillStyle = 'rgba(253,224,71,0.45)';
  ctx.beginPath(); ctx.arc(lx, ly, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fffbeb'; ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(lx, ly, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#334155'; ctx.font = '700 13px sans-serif';
  ctx.fillText('Erregung', lx + 15, ly + 5);
  ctx.restore();
}
function _n9cDraw(ctx, cv) {
  if (!_n9c) return;
  const G = _n9cGeo(), z = _n9c, W = cv.width, H = cv.height, t = z.t;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  // Der gewählte Teil leuchtet weich auf und ab: 0,8 Hz, kein An/Aus
  const puls = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 0.8);
  const halo = 'rgba(59,130,246,' + ((z.laeuft ? 0.15 : 0.22) + (z.laeuft ? 0.2 : 0.43) * puls).toFixed(3) + ')';
  const blau = (z.laeuft ? 0.35 : 0.8) * puls;
  ctx.save();
  ctx.fillStyle = '#334155'; ctx.font = '700 12px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Lina, von der Seite', 14, 19);
  ctx.textAlign = 'center';
  ctx.fillText('Lupe: stark vergrößert', G.L.x, 19);
  ctx.restore();
  _n9cKoerper(ctx, G, z, t, halo, blau);
  _n9cZoom(ctx, G);
  _n9cLupe(ctx, G, z, t, halo, blau);
  _n9cUnten(ctx, z, W);
  _bioFxAlleDraw(ctx, z.fx);
}
