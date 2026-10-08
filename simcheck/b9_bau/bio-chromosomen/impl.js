// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · WIE VIELE CHROMOSOMEN HAT EINE ZELLE?   (Förderheft Bio 9 · bt1)
// Kennung bio-chromosomen, Präfix _n9n. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bt1.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 440 x 280, heller Grund):
//   Eine Zelle, stark vergrößert. Im hellen lila Oval in ihrer Mitte liegen die
//   Chromosomen als einfache Stäbchen (Modell, KEINE X-Form) durcheinander wie
//   Wollfäden und bewegen sich leicht. Jedes Stäbchen hat ein Bandmuster aus
//   dunklen Querstreifen; die 23 Sorten sind verschieden lang (Modell:
//   116, 112, … 28 Bildpunkte, je 4 kürzer) und haben je ein eigenes Muster.
//   Die vier Zellen sind schematisch und ohne Schrift im Bild:
//     Hautzelle der Mutter  runde Vieleck-Zelle zwischen Nachbarzellen
//     Eizelle               große runde Zelle mit heller Hülle und kleinen
//                           Hüllzellen außen
//     Spermium              großer ovaler Kopf, Mittelstück, schlagender Schwanz
//     befruchtete Eizelle   wie die Eizelle
//   Zähler oben links im Bild (weißes Kästchen): „Chromosomen: 46“ – er zählt
//   die Stäbchen, die im Oval liegen.
//
// BEDIENUNG (wörtlich):
//   Zelle: „Hautzelle der Mutter“ · „Eizelle“ · „Spermium“ · „befruchtete
//          Eizelle“ (Wahlgruppe _n9nZelle('haut'|'ei'|'sp'|'bef'); jede Wahl
//          legt die Stäbchen neu durcheinander)
//   „▶ ordnen“ (_n9nOrdnen) · „neu“ (_n9nNeu → Hautzelle der Mutter, neu gemischt)
//   Start: Hautzelle der Mutter.
//
// ABLAUF NACH „▶ ordnen“ (Zeiten in s):
//   0–1,0   die Ansicht fährt in das Oval hinein (Vergrößerung 1 → 2,9); in den
//           Ecken bleibt der Rand des Ovals und das Zellinnere sichtbar. Die
//           ruhenden Stäbchen fahren mit (Lage und Länge x 2,9), danach haben
//           sie fast schon ihre Endlänge (0,36 x 2,9 = 1,04)
//   0,3–2,8 die Stäbchen fliegen der Größe nach (das längste zuerst, je Sorte
//           0,07 s später) auf eine Linie und stehen dort senkrecht, das längste
//           links: Hautzelle und befruchtete Eizelle zwei gleiche Stäbchen dicht
//           nebeneinander (Lücke 1,4 Bildpunkte, zur nächsten Sorte 4,9),
//           Eizelle und Spermium jedes Stäbchen allein (Abstand 18,3).
//           Linie bei y = 212, das längste Stäbchen reicht bis y = 96.
//           Befruchtete Eizelle: links immer das rote gepunktete, rechts das
//           blaue glatte Stäbchen.
//   3,0     fertig; das Bild bleibt stehen, bis man umstellt oder „neu“ drückt.
//   Wird „▶ ordnen“ noch während des Spermium-Eintritts gedrückt (siehe unten),
//   ist der Druck vorgemerkt: Das Ordnen beginnt, sobald der Eintritt fertig ist.
//
// BEFRUCHTETE EIZELLE – EINTRITT (startet beim Umstellen, 3,7 s):
//   Am Anfang liegen nur die 23 roten gepunkteten Stäbchen im Oval, der Zähler
//   zeigt „Chromosomen: 23“. 0–1,4 ein kleines Spermium (im Kopf drei blaue
//   Striche) schwimmt von rechts oben zwischen den Hüllzellen heran,
//   1,4–1,9 sein Kopf dringt ein (heller Ring), der Schwanz verblasst.
//   1,8–3,5 die 23 blauen glatten Stäbchen kommen nacheinander aus dem Kopf und
//   legen sich ins Oval; der Zähler zählt jedes angekommene Stäbchen mit
//   (24 … 46). 3,7 ruhiger Lichtring um das Oval und um den Zähler.
//   Legende unten im Bild (nur bei befruchteter Eizelle): rotes gepunktetes
//   Stäbchen „gepunktet: aus der Eizelle“, blaues glattes Stäbchen „glatt: aus
//   dem Spermium“. Farbe UND Muster – auch ohne Farbsehen lesbar.
//
// STATUSZEILE (_n9n-status, Zähler vorn wie auf der Leinwand):
//   „Chromosomen: 46 · Zelle: Hautzelle der Mutter“
//   („Chromosomen: 46“ allein hat 15 Zeichen – simfakten.js nimmt erst Felder
//   über 18 Zeichen in den Dump. Die Zelle steht deshalb mit in der Zeile.)
// HINWEIS (_n9n-hinweis), in allen Zellen dieselben Sätze:
//   vorher    „Die Stäbchen liegen durcheinander. Drücke „▶ ordnen“.“
//   Eintritt  „Ein Spermium kommt zur Eizelle. Sieh auf den Zähler.“
//             (vorgemerkt: + „ Danach ordnen sich die Stäbchen.“)
//   ordnen    „Die Stäbchen stellen sich der Größe nach in eine Reihe.“
//   fertig    „Lies den Zähler ab. Stehen immer zwei gleich große Stäbchen dicht
//             nebeneinander? Notiere die Zahl und „ja“ oder „nein“ in Zeile N
//             der Tabelle.“ – bei Zeile 1 (Hautzelle) ohne Zähler, nur „ja“ oder
//             „nein“: Die 46 steht im Heft schon in der Beispielzeile. + WEITER:
//             „ Stelle dann „Eizelle“ ein.“ (Spermium, befruchtete Eizelle);
//             zuletzt „ Sieh auch auf die Muster. Dann geht es im Heft weiter.“
//   Die Simulation sagt nie, ob es Paare gibt – das entscheidet das Kind am Bild.
//
// WERTE (lehrer.tabelle_erwartet, Modellwerte; Zahl am Zähler, Rest am Bild):
//   Hautzelle der Mutter  Chromosomen: 46 · je zwei gleiche nebeneinander
//   Eizelle               Chromosomen: 23 · jedes allein
//   Spermium              Chromosomen: 23 · jedes allein
//   befruchtete Eizelle   Chromosomen: 46 · je zwei gleiche nebeneinander,
//                         immer ein rotes gepunktetes und ein blaues glattes
//   Eizelle und Spermium tragen von jeder der 23 Sorten genau ein Stäbchen.
//   Im Modell trägt das Spermium ein X: Alle 23 Sorten sind in der befruchteten
//   Eizelle gleich lang gepaart (Lehrerteil: Mädchen).
//
// AHA (_bioFx, ruhig, ohne Textstreifen): Der Eintritt zeigt 23 + 23 = 46 am
//   Zähler (gegen „alle 46 von der Mutter“ und gegen „92“); nach dem Ordnen hat
//   jede Sorte der befruchteten Eizelle ein rotes UND ein blaues Stäbchen. Beim
//   Landen jeder Sorte ein kleiner Lichtring unter der Linie.
//
// NICHT AM BILDSCHIRM (Lückenwörter aus Merksatz und Aufgabe 2, Wortbank):
//   „Gen“, „Hälfte“, „Paar“, „Vater“, „Zellkern“, „doppelt“ – auch nicht
//   „Kern“ oder „halb“. Keine Zahl der Sorten im Bild (nur der Zähler).
//   Deterministisch: eigener Zufallsgenerator mit festem Startwert.
// ═══════════════════════════════════════════════════════════════════════
let _n9n = null;
const _N9N_ZELLEN = {
  haut: { name: 'Hautzelle der Mutter', paare: true,  nx: 222, ny: 144 },
  ei:   { name: 'Eizelle',              paare: false, nx: 222, ny: 144 },
  sp:   { name: 'Spermium',             paare: false, nx: 180, ny: 144 },
  bef:  { name: 'befruchtete Eizelle',  paare: true,  nx: 222, ny: 144 }
};
const _N9N_REIHE = ['haut', 'ei', 'sp', 'bef'];   // Reihenfolge wie in der Tabelle
const _N9N_SORTEN = 23;
const _N9N_KRX = 82, _N9N_KRY = 56;              // Oval in der Gesamtansicht
const _N9N_ZOOM = 2.9;                           // Vergrößerung beim Ordnen
const _N9N_MX = 220, _N9N_MY = 140;              // Mitte der vergrößerten Ansicht
const _N9N_X0 = 10, _N9N_X1 = 430;               // Linie, auf der die Stäbchen stehen
const _N9N_BASIS = 212;
const _N9N_DICK = 6.0, _N9N_SPALT = 1.4;         // geordnet: Dicke, Lücke im Zweier
const _N9N_KLEIN = 0.36, _N9N_DUENN = 3.2;       // durcheinander: Länge x 0,36, Dicke
const _N9N_ZOOMT = 1.0;
const _N9N_START0 = 0.3, _N9N_STAFFEL = 0.07, _N9N_ZWEITER = 0.035, _N9N_FLUG = 0.95;
const _N9N_ENDE = 3.0;
// Eintritt des Spermiums (befruchtete Eizelle)
const _N9N_E_SCHWIMM = 1.4, _N9N_E_REIN = 1.9, _N9N_E_AUS0 = 1.8;
const _N9N_E_STAFFEL = 0.05, _N9N_E_FLUG = 0.6, _N9N_E_ENDE = 3.7;
const _N9N_E_WINKEL = -35 * Math.PI / 180;       // zwischen zwei Hüllzellen hindurch
const _N9N_E_START = { x: 222 + 300 * Math.cos(_N9N_E_WINKEL), y: 144 + 300 * Math.sin(_N9N_E_WINKEL) };
const _N9N_E_RAND = { x: 222 + 106 * Math.cos(_N9N_E_WINKEL), y: 144 + 106 * Math.sin(_N9N_E_WINKEL) };
const _N9N_E_INNEN = { x: 222 + 84 * Math.cos(_N9N_E_WINKEL), y: 144 + 84 * Math.sin(_N9N_E_WINKEL) };
const _N9N_FARBE = {
  grau: { f: '#9aa3af', b: '#4b5563', r: '#374151' },
  ei:   { f: '#dc4a4a', b: '#7f1d1d', r: '#7f1d1d' },
  sp:   { f: '#4f8fe6', b: '#1e3a8a', r: '#1e3a8a' }
};
const _N9N_HG = '#eef3f6';
const _N9N_KERN = '#f3eefc', _N9N_KERNRAND = '#7c6aa8';
// Hautzelle: Ecken des Vielecks (wird rund geglättet) und Nachbarzellwände
const _N9N_HAUT = [[70, 64], [200, 42], [352, 54], [414, 140], [380, 232], [228, 252], [76, 236], [30, 146]];
const _N9N_WAND = [[34, -10], [214, -10], [392, -10], [452, 112], [452, 270], [214, 292], [-10, 272], [-10, 118]];
// Hüllzellen der Eizelle: Winkel (Grad), Abstand, Radius
const _N9N_KRANZ = [[-45, 118, 11], [-25, 118, 10], [-5, 118, 11], [15, 119, 10], [35, 118, 11],
                    [135, 118, 11], [155, 119, 10], [175, 118, 11], [195, 119, 10], [215, 118, 11],
                    [-50, 136, 9], [-20, 137, 9], [0, 136, 9], [25, 137, 9],
                    [145, 136, 9], [165, 137, 9], [185, 136, 9], [205, 137, 9]];

// Eigener Zufall (mulberry32): gleiche Bedienung → gleiches Bild
function _n9nZufall(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Bandmuster je Sorte: Lage p (Anteil der Länge) und Breite h (Anteil)
const _N9N_BANDEN = (function () {
  const alle = [];
  for (let k = 0; k < 23; k++) {
    const r = _n9nZufall(7 + k * 131);
    const n = (k < 8 ? 4 : k < 16 ? 3 : 2) + (r() < 0.4 ? 1 : 0);
    const b = [];
    for (let v = 0; v < 300 && b.length < n; v++) {
      const p = 0.16 + r() * 0.68;
      if (b.every(q => Math.abs(q.p - p) > 0.17)) b.push({ p, h: 0.05 + r() * 0.05 });
    }
    b.sort((x, y) => x.p - y.p);
    alle.push(b);
  }
  return alle;
})();

function _n9nKl(x) { return _bioFxKlemme(x); }
function _n9nE(x) { return _bioFxEase.sanft(_bioFxKlemme(x)); }
function _n9nLaenge(k) { return 116 - 4 * k; }
function _n9nSlotX(k) { return _N9N_X0 + (k + 0.5) * (_N9N_X1 - _N9N_X0) / _N9N_SORTEN; }

function _n9nInit() {
  _n9n = { zelle: 'haut', t: 0, s: 0, ein: 0, wurf: 0, phase: 'ruhe', vorgemerkt: false,
           zahl: 46, staebe: [], ev: {}, fx: { teile: [] } };
  _n9nAufbau();
}

// ── Stäbchen anlegen und durcheinander legen ───────────
function _n9nAufbau() {
  const zn = _n9n.zelle, z = _N9N_ZELLEN[zn];
  const r = _n9nZufall(101 + 37 * _n9n.wurf + 7 * _N9N_REIHE.indexOf(zn));
  const st = [];
  for (let k = 0; k < _N9N_SORTEN; k++) {
    if (zn === 'haut') { st.push({ k, m: 0, her: 'grau' }); st.push({ k, m: 1, her: 'grau' }); }
    else if (zn === 'bef') { st.push({ k, m: 0, her: 'ei' }); st.push({ k, m: 1, her: 'sp' }); }
    else st.push({ k, m: 0, her: 'grau' });
  }
  // Lange zuerst legen, dann die kurzen in die Lücken: so liegt alles locker verteilt
  const lege = st.map(s => ({ s, w: r() })).sort((p, q) => p.s.k - q.s.k || p.w - q.w).map(o => o.s);
  const fertig = [];
  for (const s of lege) {
    const l = _n9nLaenge(s.k) * _N9N_KLEIN;
    let best = null, bestWert = -1;
    for (let v = 0; v < 400 && (best === null || v < 30); v++) {
      const u = r() * 2 * Math.PI, q = Math.sqrt(r());
      const cx = z.nx + Math.cos(u) * q * (_N9N_KRX - 8), cy = z.ny + Math.sin(u) * q * (_N9N_KRY - 7);
      const a = r() * Math.PI;
      const hx = Math.cos(a) * l / 2, hy = Math.sin(a) * l / 2;
      const drin = p => Math.pow((p[0] - z.nx) / (_N9N_KRX - 6), 2) + Math.pow((p[1] - z.ny) / (_N9N_KRY - 6), 2) <= 1;
      if (!drin([cx - hx, cy - hy]) || !drin([cx + hx, cy + hy])) continue;
      let w = 1e9;
      for (const f of fertig) w = Math.min(w, _n9nAbstand(cx - hx, cy - hy, cx + hx, cy + hy, f.x - f.hx, f.y - f.hy, f.x + f.hx, f.y + f.hy));
      if (w > bestWert) { bestWert = w; best = { x: cx, y: cy, a, hx, hy }; }
    }
    if (!best) best = { x: z.nx, y: z.ny, a: 0, hx: l / 2, hy: 0 };        // kommt nie vor, sicher ist sicher
    s.x0 = best.x; s.y0 = best.y; s.a0 = best.a; s.l0 = l;
    s.ph = r() * 2 * Math.PI;
    fertig.push({ x: best.x, y: best.y, hx: best.hx, hy: best.hy });
  }
  // Platz auf der Linie und Abflugzeit beim Ordnen
  for (const s of st) {
    const L = _n9nLaenge(s.k), xk = _n9nSlotX(s.k);
    s.L = L;
    s.x1 = z.paare ? xk + (s.m === 0 ? -1 : 1) * (_N9N_DICK + _N9N_SPALT) / 2 : xk;
    s.y1 = _N9N_BASIS - L / 2;
    s.start = _N9N_START0 + _N9N_STAFFEL * s.k + (s.m ? _N9N_ZWEITER : 0);
  }
  // Befruchtete Eizelle: Reihenfolge, in der die blauen aus dem Spermium kommen
  if (zn === 'bef') {
    const blau = st.filter(s => s.her === 'sp');
    const folge = blau.map((s, i) => ({ s, w: r() })).sort((p, q) => p.w - q.w);
    folge.forEach((o, j) => { o.s.kommt = _N9N_E_AUS0 + j * _N9N_E_STAFFEL; });
  }
  _n9n.staebe = st;
  _n9n.ein = 0;
  _n9n.ev = {};
  _n9n.zahl = _n9nGezaehlt();
}
// Kleinster Abstand zweier Strecken (0, wenn sie sich kreuzen)
function _n9nAbstand(ax, ay, bx, by, cx, cy, dx, dy) {
  const o = (px, py, qx, qy, rx, ry) => (qx - px) * (ry - py) - (qy - py) * (rx - px);
  const d1 = o(ax, ay, bx, by, cx, cy), d2 = o(ax, ay, bx, by, dx, dy);
  const d3 = o(cx, cy, dx, dy, ax, ay), d4 = o(cx, cy, dx, dy, bx, by);
  if (((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0))) return 0;
  const ps = (px, py, sx, sy, ex, ey) => {
    const vx = ex - sx, vy = ey - sy, ll = vx * vx + vy * vy || 1;
    const u = _n9nKl(((px - sx) * vx + (py - sy) * vy) / ll);
    return Math.hypot(px - sx - u * vx, py - sy - u * vy);
  };
  return Math.min(ps(ax, ay, cx, cy, dx, dy), ps(bx, by, cx, cy, dx, dy),
                  ps(cx, cy, ax, ay, bx, by), ps(dx, dy, ax, ay, bx, by));
}
// Gezählt wird, was im Oval liegt
function _n9nGezaehlt() {
  if (_n9n.zelle === 'bef' && _n9n.phase === 'eintritt') {
    let n = 0;
    for (const s of _n9n.staebe) if (s.her === 'ei' || _n9n.s >= s.kommt + _N9N_E_FLUG) n++;
    return n;
  }
  return _n9n.staebe.length;
}

// ── Bedienung ──────────────────────────────────────────
function _n9nNeuLegen(zn) {
  _n9n.zelle = zn;
  _n9n.wurf++;
  _n9n.s = 0; _n9n.vorgemerkt = false; _n9n.fx = { teile: [] };
  _n9n.phase = zn === 'bef' ? 'eintritt' : 'ruhe';
  _n9nAufbau();
}
function _n9nZelle(zn) {
  if (!_n9n || !_N9N_ZELLEN[zn]) return;
  _n9nNeuLegen(zn);
  _n9nStatus();
}
function _n9nOrdnen() {
  if (!_n9n) return;
  if (_n9n.phase === 'eintritt') { _n9n.vorgemerkt = true; _n9nStatus(); return; }
  if (_n9n.phase !== 'ruhe') return;
  _n9nOrdnenLos();
}
function _n9nOrdnenLos() {
  _n9n.phase = 'ordnen'; _n9n.s = 0; _n9n.vorgemerkt = false; _n9n.ev = {};
  _n9nStatus();
}
function _n9nNeu() {
  if (!_n9n) return;
  _n9nNeuLegen('haut');
  _n9nStatus();
}

// ── Anzeige ────────────────────────────────────────────
function _n9nZeile() {
  return 'Chromosomen: ' + _n9n.zahl + ' · Zelle: ' + _N9N_ZELLEN[_n9n.zelle].name;
}
function _n9nHinweis() {
  const p = _n9n.phase;
  if (p === 'eintritt') return 'Ein Spermium kommt zur Eizelle. Sieh auf den Zähler.'
                             + (_n9n.vorgemerkt ? ' Danach ordnen sich die Stäbchen.' : '');
  if (p === 'ordnen') return 'Die Stäbchen stellen sich der Größe nach in eine Reihe.';
  if (p === 'fertig') {
    const i = _N9N_REIHE.indexOf(_n9n.zelle);
    const weiter = i < _N9N_REIHE.length - 1
      ? ' Stelle dann „' + _N9N_ZELLEN[_N9N_REIHE[i + 1]].name + '“ ein.'
      : ' Sieh auch auf die Muster. Dann geht es im Heft weiter.';
    // Zeile 1 steht im Heft schon als Beispiel da (Zähler 46); offen ist nur
    // „ja“ oder „nein“ – genau wie Schritt a der Seite.
    if (i === 0) return 'Stehen immer zwei gleich große Stäbchen dicht nebeneinander? '
                      + 'Notiere „ja“ oder „nein“ in Zeile 1 der Tabelle.' + weiter;
    return 'Lies den Zähler ab. Stehen immer zwei gleich große Stäbchen dicht nebeneinander? '
         + 'Notiere die Zahl und „ja“ oder „nein“ in Zeile ' + (i + 1) + ' der Tabelle.' + weiter;
  }
  return 'Die Stäbchen liegen durcheinander. Drücke „▶ ordnen“.';
}
function _n9nStatus() {
  if (!_n9n) return;
  _n9n.zahl = _n9nGezaehlt();
  const el = document.getElementById('_n9n-status');
  if (el) { el.textContent = _n9nZeile(); el.className = 'lmp-status on'; }
  const h = document.getElementById('_n9n-hinweis');
  if (h) h.textContent = _n9nHinweis();
  try {
    document.querySelectorAll('[data-n9n]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9n') === _n9n.zelle);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9n-los');
  if (los && los.classList) los.classList.toggle('primary', _n9n.phase === 'ruhe' || _n9n.phase === 'eintritt');
}
function _n9nHTML() {
  const k = zn => `<button class="sim-btn" data-n9n="${zn}" onclick="_n9nZelle('${zn}')">${_N9N_ZELLEN[zn].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Chromosomen hat eine Zelle?</h3>
    <div class="fpm-note" style="margin-top:2px">Eine Zelle, stark vergrößert. Innen liegen die Chromosomen als Stäbchen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9n-cv" width="440" height="280" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9n-los" onclick="_n9nOrdnen()">▶ ordnen</button>
          <button class="sim-btn" onclick="_n9nNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label" style="margin-top:0">Zähler</div>
        <div class="lmp-status on" id="_n9n-status"></div>
        <div class="phys-ctrl" style="margin-top:10px">
          <span class="phys-ctrl-label">Zelle</span>
          <div class="sim-btn-row">${_N9N_REIHE.map(k).join('')}</div>
        </div>
        <div class="fpm-note" id="_n9n-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Jedes Stäbchen ist ein Chromosom. Der Zähler zählt alle Stäbchen in der Zelle.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Hautzelle der Mutter &nbsp;|&nbsp; Modell: Die Chromosomen sind als einfache Stäbchen gezeichnet.</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9nUpdate(dt) {
  if (!_n9n) return;
  dt = _bioFxDt(dt);
  const z = _n9n, fx = z.fx;
  z.t += dt; z.ein += dt;
  if (z.phase === 'eintritt') {
    z.s += dt;
    if (!z.ev.kontakt && z.s >= _N9N_E_SCHWIMM) {
      z.ev.kontakt = true;
      _bioFxWelle(fx.teile, _N9N_E_RAND.x, _N9N_E_RAND.y, '#93c5fd', 20);
    }
    const n = _n9nGezaehlt();
    if (n !== z.zahl) _n9nStatus();
    if (z.s >= _N9N_E_ENDE) {
      z.phase = 'ruhe'; z.s = 0;
      _bioFxWelle(fx.teile, 222, 144, '#a78bfa', 78);
      _bioFxWelle(fx.teile, 84, 22, '#fde047', 46);
      if (z.vorgemerkt) _n9nOrdnenLos(); else _n9nStatus();
    }
  } else if (z.phase === 'ordnen') {
    z.s += dt;
    const paare = _N9N_ZELLEN[z.zelle].paare;
    for (let k = 0; k < _N9N_SORTEN; k++) {
      const da = _N9N_START0 + _N9N_STAFFEL * k + (paare ? _N9N_ZWEITER : 0) + _N9N_FLUG;
      if (!z.ev['k' + k] && z.s >= da) {
        z.ev['k' + k] = true;
        _bioFxWelle(fx.teile, _n9nSlotX(k), _N9N_BASIS + 9, '#a78bfa', 9);
      }
    }
    if (z.s >= _N9N_ENDE) { z.s = _N9N_ENDE; z.phase = 'fertig'; _n9nStatus(); }
  }
  _bioFxAlleUpdate(fx, dt);
}

// ── Wo steht ein Stäbchen jetzt? ───────────────────────
// Ruhende Stäbchen fahren mit der Kamera mit (Lage und Länge x k, Dicke
// gedämpft): Beim Hineinfahren wächst alles gemeinsam, erst dann wird sortiert.
function _n9nLage(st, kam) {
  const t = _n9n.t, p = _n9n.phase, s = _n9n.s;
  kam = kam || _n9nKamera();
  const wx = 0.8 * Math.sin(t * 0.7 + st.ph * 1.3), wy = 0.8 * Math.cos(t * 0.8 + st.ph);
  const wa = 0.06 * Math.sin(t * 0.9 + st.ph);
  const ruhe = { x: kam.cx + (st.x0 + wx - kam.nx) * kam.k, y: kam.cy + (st.y0 + wy - kam.ny) * kam.k,
                 a: st.a0 + wa, l: st.l0 * kam.k,
                 d: _N9N_DUENN + (_N9N_DICK - _N9N_DUENN) * kam.e, al: 1 };
  if (p === 'fertig') return { x: st.x1, y: st.y1, a: Math.PI / 2, l: st.L, d: _N9N_DICK, al: 1 };
  if (p === 'ordnen') {
    const u = _n9nKl((s - st.start) / _N9N_FLUG), e = _bioFxEase.sanft(u);
    if (u <= 0) return ruhe;
    const bx = (ruhe.x + st.x1) / 2, by = Math.min(ruhe.y, st.y1) - 30;
    const f = 1 - e;
    return { x: f * f * ruhe.x + 2 * f * e * bx + e * e * st.x1,
             y: f * f * ruhe.y + 2 * f * e * by + e * e * st.y1,
             a: ruhe.a + (Math.PI / 2 - ruhe.a) * e, l: ruhe.l + (st.L - ruhe.l) * e,
             d: ruhe.d + (_N9N_DICK - ruhe.d) * e, al: 1 };
  }
  if (p === 'eintritt' && st.her === 'sp') {
    if (s < st.kommt) return null;                          // noch im Kopf des Spermiums
    const u = _n9nKl((s - st.kommt) / _N9N_E_FLUG), e = _bioFxEase.sanft(u);
    if (u >= 1) return ruhe;
    return { x: _N9N_E_INNEN.x + (ruhe.x - _N9N_E_INNEN.x) * e, y: _N9N_E_INNEN.y + (ruhe.y - _N9N_E_INNEN.y) * e,
             a: ruhe.a, l: 3 + (st.l0 - 3) * e, d: _N9N_DUENN, al: 0.5 + 0.5 * e };
  }
  return ruhe;
}
function _n9nKamera() {
  let e = 0;
  if (_n9n.phase === 'ordnen') e = _n9nE(_n9n.s / _N9N_ZOOMT);
  else if (_n9n.phase === 'fertig') e = 1;
  const z = _N9N_ZELLEN[_n9n.zelle];
  return { e, k: 1 + (_N9N_ZOOM - 1) * e, cx: z.nx + (_N9N_MX - z.nx) * e, cy: z.ny + (_N9N_MY - z.ny) * e,
           nx: z.nx, ny: z.ny };
}

// ── Zeichnen ───────────────────────────────────────────
// Stäbchen mit runden Enden, Längsachse senkrecht (vor dem Drehen)
function _n9nKapsel(ctx, d, l) {
  const r = d / 2, h = Math.max(0, l / 2 - r);
  ctx.beginPath();
  ctx.moveTo(-r, -h);
  ctx.arc(0, -h, r, Math.PI, 0, false);
  ctx.lineTo(r, h);
  ctx.arc(0, h, r, 0, Math.PI, false);
  ctx.closePath();
}
function _n9nStab(ctx, x, y, a, l, d, k, her, al) {
  if (al <= 0.01 || l < 1) return;
  const c = _N9N_FARBE[her];
  ctx.save();
  ctx.globalAlpha = al;
  ctx.translate(x, y);
  ctx.rotate(a - Math.PI / 2);
  _n9nKapsel(ctx, d, l);
  ctx.fillStyle = c.f; ctx.fill();
  const r = d / 2, oben = -l / 2 + r * 0.9, unten = l / 2 - r * 0.9;
  ctx.fillStyle = c.b;
  for (const b of _N9N_BANDEN[k]) {
    const h = Math.max(d >= 5 ? 2 : 1, b.h * l);
    const y0 = Math.max(oben, -l / 2 + b.p * l - h / 2), y1 = Math.min(unten, -l / 2 + b.p * l + h / 2);
    if (y1 > y0) ctx.fillRect(-r, y0, d, y1 - y0);
  }
  if (her === 'ei') {                                          // gepunktet
    const abst = Math.max(2.4, d * 0.72), rr = Math.max(0.6, d * 0.2);
    const n = Math.max(0, Math.floor((l - d) / abst));
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.arc(0, -n * abst / 2 + i * abst, rr, 0, 2 * Math.PI); ctx.fill();
    }
  }
  _n9nKapsel(ctx, d, l);
  ctx.strokeStyle = c.r; ctx.lineWidth = Math.max(0.7, d * 0.15); ctx.stroke();
  ctx.restore();
}
// Glatte Zellwand durch die Ecken eines Vielecks
function _n9nRund(ctx, ecken) {
  const n = ecken.length, mid = i => {
    const a = ecken[(i + n) % n], b = ecken[(i + 1 + n) % n];
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  };
  ctx.beginPath();
  const m0 = mid(-1);
  ctx.moveTo(m0[0], m0[1]);
  for (let i = 0; i < n; i++) { const m = mid(i); ctx.quadraticCurveTo(ecken[i][0], ecken[i][1], m[0], m[1]); }
  ctx.closePath();
}
function _n9nHautzelle(ctx, t) {
  ctx.fillStyle = '#f6dcc6'; ctx.fillRect(-40, -40, 520, 360);            // Nachbarzellen
  const n = _N9N_HAUT.length;
  ctx.strokeStyle = '#c98b5a'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const v = _N9N_HAUT[i], a = _N9N_HAUT[(i + n - 1) % n], b = _N9N_HAUT[(i + 1) % n];
    // Punkt der geglätteten Wand nahe der Ecke
    const px = 0.125 * (a[0] + v[0]) + 0.5 * v[0] + 0.125 * (v[0] + b[0]);
    const py = 0.125 * (a[1] + v[1]) + 0.5 * v[1] + 0.125 * (v[1] + b[1]);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(_N9N_WAND[i][0], _N9N_WAND[i][1]); ctx.stroke();
  }
  _n9nRund(ctx, _N9N_HAUT);
  ctx.fillStyle = '#fdebd7'; ctx.fill();
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.stroke();
  _n9nKoerner(ctx, 222, 144, 116, 84, t, 'rgba(180,110,60,0.35)');
}
function _n9nKoerner(ctx, cx, cy, ax, ay, t, farbe) {
  ctx.fillStyle = farbe;
  for (let i = 0; i < 16; i++) {
    const w = i * 2.39996 + 0.3 + 0.1 * Math.sin(t * 0.35 + i);
    const f = 0.9 + 0.08 * ((i * 0.618) % 1);
    ctx.beginPath(); ctx.arc(cx + ax * f * Math.cos(w), cy + ay * f * Math.sin(w), 1.7, 0, 2 * Math.PI); ctx.fill();
  }
}
function _n9nEizelle(ctx, t) {
  ctx.fillStyle = _N9N_HG; ctx.fillRect(-40, -40, 520, 360);
  for (let i = 0; i < _N9N_KRANZ.length; i++) {                         // Hüllzellen
    const c = _N9N_KRANZ[i], w = c[0] * Math.PI / 180;
    const x = 222 + c[1] * Math.cos(w) + 0.6 * Math.sin(t * 0.6 + i), y = 144 + c[1] * Math.sin(w) + 0.6 * Math.cos(t * 0.5 + i);
    ctx.beginPath(); ctx.arc(x, y, c[2], 0, 2 * Math.PI);
    ctx.fillStyle = '#fde3c4'; ctx.fill(); ctx.strokeStyle = '#c9894a'; ctx.lineWidth = 1.3; ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 1, y - 1, c[2] * 0.32, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(201,137,74,0.45)'; ctx.fill();
  }
  ctx.beginPath(); ctx.arc(222, 144, 106, 0, 2 * Math.PI);              // helle Hülle
  ctx.fillStyle = '#dbe8f5'; ctx.fill(); ctx.strokeStyle = '#8aa4c4'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(222, 144, 96, 0, 2 * Math.PI);               // Zellinneres
  ctx.fillStyle = '#fff3d6'; ctx.fill(); ctx.strokeStyle = '#c08a2e'; ctx.lineWidth = 2; ctx.stroke();
  _n9nKoerner(ctx, 222, 144, 89, 75, t, 'rgba(192,138,46,0.4)');
}
function _n9nSpermium(ctx, t) {
  ctx.fillStyle = _N9N_HG; ctx.fillRect(-40, -40, 520, 360);
  // Schwanz: wandernde Welle, nach hinten dünner
  ctx.strokeStyle = '#64748b'; ctx.lineCap = 'round';
  let px = 336, py = 144;
  for (let i = 1; i <= 44; i++) {
    const u = i / 44, x = 336 + 136 * u;
    const y = 144 + (1.5 + 14 * u) * Math.sin(u * 2 * Math.PI * 1.5 - t * 4.5);
    ctx.lineWidth = 6.5 - 4.5 * u;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
    px = x; py = y;
  }
  // Mittelstück
  ctx.beginPath();
  ctx.moveTo(272, 132); ctx.lineTo(340, 137); ctx.lineTo(340, 151); ctx.lineTo(272, 156); ctx.closePath();
  ctx.fillStyle = '#d5dde8'; ctx.fill(); ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.6; ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  for (let x = 282; x <= 332; x += 7) { ctx.beginPath(); ctx.moveTo(x, 135); ctx.lineTo(x + 5, 153); ctx.stroke(); }
  // Kopf mit heller Kappe vorn
  ctx.beginPath(); ctx.ellipse(172, 144, 112, 76, 0, 0, 2 * Math.PI);
  ctx.fillStyle = '#e3ecf7'; ctx.fill();
  ctx.beginPath();
  for (let i = 0; i <= 28; i++) {
    const w = (110 + 140 * i / 28) * Math.PI / 180;
    const x = 172 + 112 * Math.cos(w), y = 144 + 76 * Math.sin(w);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  for (let i = 28; i >= 0; i--) {
    const w = (110 + 140 * i / 28) * Math.PI / 180;
    ctx.lineTo(172 + 96 * Math.cos(w), 144 + 64 * Math.sin(w));
  }
  ctx.closePath(); ctx.fillStyle = '#c9dcf2'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(172, 144, 112, 76, 0, 0, 2 * Math.PI);
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2.2; ctx.stroke();
}
// Das helle Oval (ohne Beschriftung)
function _n9nOval(ctx, nx, ny, k) {
  ctx.beginPath(); ctx.ellipse(nx, ny, _N9N_KRX, _N9N_KRY, 0, 0, 2 * Math.PI);
  ctx.fillStyle = _N9N_KERN; ctx.fill();
  ctx.strokeStyle = _N9N_KERNRAND; ctx.lineWidth = 2 / k; ctx.stroke();
}
// Kleines Spermium beim Eintritt: Kopf bei (hx, hy), Blickrichtung (dx, dy)
function _n9nGast(ctx, hx, hy, dx, dy, t, aKopf, aSchwanz) {
  const nx = -dy, ny = dx;
  if (aSchwanz > 0.01) {
    ctx.save();
    ctx.globalAlpha = aSchwanz;
    ctx.strokeStyle = '#475569'; ctx.lineCap = 'round'; ctx.lineWidth = 1.7;
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const u = i / 24, s = 15 + u * 38, w = (0.4 + 4.6 * u) * Math.sin(u * 2 * Math.PI * 1.3 - t * 9);
      const x = hx - dx * s + nx * w, y = hy - dy * s + ny * w;
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
  if (aKopf > 0.01) {
    ctx.save();
    ctx.globalAlpha = aKopf;
    ctx.translate(hx, hy); ctx.rotate(Math.atan2(dy, dx));
    ctx.fillStyle = '#d5dde8'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(-8, -2.4); ctx.lineTo(-16, -1.6); ctx.lineTo(-16, 1.6); ctx.lineTo(-8, 2.4); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, 8.5, 6, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#e3ecf7'; ctx.fill(); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.strokeStyle = _N9N_FARBE.sp.f; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    for (const [x0, y0, x1, y1] of [[-4, -2.5, 1, -1.5], [-3, 0.6, 3, 0.2], [-4, 2.6, 0, 3]]) {
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.restore();
  }
}
function _n9nGastZeichnen(ctx) {
  const s = _n9n.s, t = _n9n.t;
  const dx0 = _N9N_E_RAND.x - _N9N_E_START.x, dy0 = _N9N_E_RAND.y - _N9N_E_START.y;
  const dl = Math.hypot(dx0, dy0), dx = dx0 / dl, dy = dy0 / dl;
  let hx, hy;
  if (s < _N9N_E_SCHWIMM) {
    const u = s / _N9N_E_SCHWIMM, q = 1.2 * Math.sin(t * 9);
    hx = _N9N_E_START.x + dx0 * u - dy * q; hy = _N9N_E_START.y + dy0 * u + dx * q;
  } else {
    const u = _n9nE((s - _N9N_E_SCHWIMM) / (_N9N_E_REIN - _N9N_E_SCHWIMM));
    hx = _N9N_E_RAND.x + (_N9N_E_INNEN.x - _N9N_E_RAND.x) * u; hy = _N9N_E_RAND.y + (_N9N_E_INNEN.y - _N9N_E_RAND.y) * u;
  }
  const aSchwanz = 1 - _n9nKl((s - _N9N_E_SCHWIMM) / 0.6);
  const aKopf = 1 - _n9nKl((s - 2.6) / 0.6);
  _n9nGast(ctx, hx, hy, dx, dy, t, aKopf, aSchwanz);
}
function _n9nZaehler(ctx) {
  ctx.save();
  ctx.font = '700 16px sans-serif';
  const txt = 'Chromosomen: ' + _n9n.zahl, w = Math.max(150, ctx.measureText(txt).width + 22);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, 8, 8, w, 28, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0f172a'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(txt, 8 + w / 2, 28);
  ctx.restore();
}
function _n9nLegende(ctx, W, H) {
  ctx.save();
  const t1 = 'gepunktet: aus der Eizelle', t2 = 'glatt: aus dem Spermium';
  const st = 22, luft = 7, mitte = 26;
  let px = 12, w1 = 0, w2 = 0;
  for (; px >= 9; px--) {
    ctx.font = '600 ' + px + 'px sans-serif';
    w1 = ctx.measureText(t1).width; w2 = ctx.measureText(t2).width;
    if (2 * (st + luft) + w1 + w2 + mitte <= W - 36) break;
  }
  const breit = 2 * (st + luft) + w1 + w2 + mitte, x = (W - breit) / 2, y = H - 16;
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x - 10, y - 12, breit + 20, 24, 7); ctx.fill(); ctx.stroke();
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  _n9nStab(ctx, x + st / 2, y, 0, st, 6, 3, 'ei', 1);
  ctx.fillStyle = '#0f172a'; ctx.fillText(t1, x + st + luft, y + 0.5);
  const x2 = x + st + luft + w1 + mitte;
  _n9nStab(ctx, x2 + st / 2, y, 0, st, 6, 3, 'sp', 1);
  ctx.fillStyle = '#0f172a'; ctx.fillText(t2, x2 + st + luft, y + 0.5);
  ctx.restore();
}
function _n9nDraw(ctx, cv) {
  if (!_n9n) return;
  const W = cv.width, H = cv.height, t = _n9n.t, zn = _n9n.zelle;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = _N9N_HG; ctx.fillRect(0, 0, W, H);
  const kam = _n9nKamera();

  // ── Zelle und Oval, mit der Kamera vergrößert ──
  ctx.save();
  ctx.translate(kam.cx, kam.cy); ctx.scale(kam.k, kam.k); ctx.translate(-kam.nx, -kam.ny);
  if (zn === 'haut') _n9nHautzelle(ctx, t);
  else if (zn === 'sp') _n9nSpermium(ctx, t);
  else _n9nEizelle(ctx, t);
  _n9nOval(ctx, kam.nx, kam.ny, kam.k);
  ctx.restore();

  // ── Linie, auf der die Stäbchen stehen ──
  if (kam.e > 0.01) {
    ctx.save();
    ctx.strokeStyle = 'rgba(100,116,139,' + (0.7 * kam.e).toFixed(3) + ')'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(_N9N_X0 - 2, _N9N_BASIS + 1.5); ctx.lineTo(_N9N_X1 + 2, _N9N_BASIS + 1.5); ctx.stroke();
    ctx.restore();
  }

  // ── Spermium beim Eintritt ──
  if (_n9n.phase === 'eintritt') _n9nGastZeichnen(ctx);

  // ── Stäbchen: erst die ruhenden, dann die fliegenden obenauf ──
  const auf = 0.25 + 0.75 * _n9nKl(_n9n.ein / 0.35);
  const fliegt = [];
  for (const st of _n9n.staebe) {
    const q = _n9nLage(st, kam);
    if (!q) continue;
    const imFlug = (_n9n.phase === 'ordnen' && _n9n.s > st.start && _n9n.s < st.start + _N9N_FLUG);
    if (imFlug) fliegt.push([st, q]);
    else _n9nStab(ctx, q.x, q.y, q.a, q.l, q.d, st.k, st.her, q.al * auf);
  }
  for (const [st, q] of fliegt) _n9nStab(ctx, q.x, q.y, q.a, q.l, q.d, st.k, st.her, q.al * auf);

  _bioFxAlleDraw(ctx, _n9n.fx);
  _n9nZaehler(ctx);
  if (zn === 'bef') _n9nLegende(ctx, W, H);
}
