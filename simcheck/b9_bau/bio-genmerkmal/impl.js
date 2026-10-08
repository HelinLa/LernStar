// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · WIE WIRD AUS EINEM GEN EIN MERKMAL?   (Förderheft Bio 9 · bt5)
// Kennung bio-genmerkmal, Präfix _n9r. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bt5.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250, heller Grund, schematisch):
//   - links eine Pflanzenzelle aus einem reifenden Erbsensamen (doppelte Wand),
//     in der Mitte ein runder Körper OHNE Beschriftung (Zellkern, Mitte 100/141,
//     Radius 44, rechts zwei Poren). Darin ein Chromosomenpaar (zwei waagerechte
//     Stäbe); auf jedem ein orangefarbenes Gen-Feld mit seinem Buchstaben
//     (G oder g, je nach Einstellung).
//   - um ihn herum 10 Körner mit Blattgrün: grün MIT drei dunklen Streifen.
//     Wird das Blattgrün abgebaut, werden sie blass und GLATT (Farbe UND Form).
//   - oben zwei Zähler: „arbeitende Proteine: N“ und „Blattgrün: N %“.
//   - oben rechts die Stationsleiste 1 2 3 4, darunter klein der ganze Samen
//     (Zeichnung wie bio-mendel: grün mit drei Streifen bzw. gelb und glatt mit
//     Glanzpunkt, Farbe UND Muster). Er hat so viel Blattgrün wie die Körner:
//     Am Start ist der reifende Samen grün, beim Abbau wird er gelb.
//   - rechts unten „Ergebnisse“: drei Fächer „G und G“, „G und g“, „g und g“.
//     Nach jedem Durchgang liegt dort der reife Samen dieser Einstellung – so
//     liegen am Ende die Samen von G und G und G und g nebeneinander.
//
// BEDIENUNG (wörtlich): „Allele“ mit „G und G“ · „G und g“ · „g und g“
//   (_n9rAllele, Start G und G) · „▶ Samen reifen lassen“ (_n9rReifen, grau
//   während des Laufs; nach dem Ende startet er denselben Lauf neu) · „neu“
//   (_n9rNeu: G und G, Ergebnisfächer leer). Allele umstellen = neue Zelle,
//   die Ergebnisfächer bleiben.
//
// ABLAUF (Sekunden nach dem Druck, ohne Zufall):
//   Station 1   0,0–2,4  „1: Das Gen wird abgeschrieben.“  Beide Gen-Felder
//               leuchten; daneben wächst je eine Abschrift (orangefarbenes Band
//               mit dem Buchstaben ihres Gens) 0,3–1,8.
//   Station 2   2,4–4,4  „2: Die Abschrift wandert hinaus.“  Die beiden
//               Abschriften wandern 2,5–4,2 durch je eine Pore nach draußen.
//               Das Gen selbst steht weiter an seinem Platz.
//   Station 3   4,4–6,8  „3: Nach der Abschrift entstehen Proteine.“  An jeder
//               Abschrift entstehen 5 Proteine (4,6 + 0,36 · k s) und warten im
//               Fächer (Radius 24 px, die Zangen der beiden Fächer zeigen
//               voneinander weg). Nach einer
//               G-Abschrift: dunkelblau mit Zange (arbeitet), nach einer
//               g-Abschrift: grau mit abgebrochener Zange (Farbe UND Form).
//               Der Zähler „arbeitende Proteine“ zählt nur die dunkelblauen.
//   Station 4   ab 6,8   „4: Die Proteine arbeiten am Blattgrün.“  Alle
//               Proteine laufen auf Wegen ÜBER und UNTER dem runden Körper zu
//               den Körnern (Abfahrt 6,8 + 0,08 · i, Fahrt 0,9 s). Ein
//               dunkelblaues baut in 1,7 s das Blattgrün EINES Korns ab
//               (Krümel fliegen weg). Ein graues hält sich am Korn fest, seine
//               Zange greift nicht – das Korn ändert sich nicht.
//               G und g: Die 5 dunkelblauen machen erst 5 Körner, wechseln dann
//               zum linken Nachbarkorn (0,3 s; eines wechselt von unten rechts
//               nach oben rechts, 0,75 s) und machen die anderen 5 – an denen
//               sitzt die ganze Zeit ein graues. Zwei benachbarte Kornenden
//               (13 px) sind dabei nie zugleich besetzt.
//   Ende        Blattgrün 0 % (bzw. Probezeit vorbei) + 0,6 s:
//               „Allele: … · Der Samen ist reif.“
//   Laufzeiten (gemessen, 16 ms je Bild): G und G 670 Bilder = 10,72 s ·
//   G und g 799 = 12,78 s · g und g 670 = 10,72 s. Damit erreicht jeder Lauf
//   sein Ende innerhalb der 875 Bilder, die simfakten.js mit den Schaltern von
//   fakten_ziehen.py (--frames=25) nach einem Aktionsknopf abwartet. OHNE
//   Schalter (2 Bilder je Ablesung) sieht der Dump nur Station 1.
//   Gegengerechnet (Mini-DOM, Bild für Bild, mit vier kaputten Gegenproben):
//   kein Protein im runden Körper oder in der Zellwand, keines fährt über ein
//   fremdes Korn, ruhende Proteine mindestens 14 px auseinander.
//
// WERTE (lehrer.tabelle_erwartet, Modellwerte; Zähler auf der Leinwand und im
//   Zählerfeld _n9r-zaehler):
//   G und G  arbeitende Proteine: 10 · Blattgrün: 0 %   · Samen gelb, glatt
//   G und g  arbeitende Proteine: 5 (5 graue daneben) · Blattgrün: 0 % · gelb
//   g und g  arbeitende Proteine: 0 (10 graue) · Blattgrün: 100 % · grün, Streifen
//   Blattgrün = Mittel der 10 Körner, gerundet; ganz abgebaut ist exakt 0 %.
//
// AHA (_bioFx, ruhig, ohne Textstreifen): Wenn das Blattgrün bei 0 % ankommt,
//   Lichtringe um den Zähler „Blattgrün“, um den Samen und um jedes
//   dunkelblaue Protein, dazu goldene Funken am Samen. Bei G und g sieht man
//   davor, wie dieselben 5 Proteine nach den ersten 5 Körnern weitermachen
//   (der Zähler hält nicht bei der Mitte an), und im Ergebnisfach liegt der
//   Samen genau wie der von G und G (Lichtring um beide Fächer). Bei g und g
//   sitzen 10 graue Proteine an den Körnern, und nichts ändert sich (blauer,
//   ruhiger Ring um Samen und Zähler).
//
// NICHT AM BILDSCHIRM (Lückenwörter aus Merksatz und Aufgabe 2, Wortbank):
//   „Bauplan“, „Hälfte“, „bleibt“, „Zellkern“ (auch nicht „Kern“),
//   „dominant“, „verschwindet“, „Farbstoff“ – und „gelb“/„grün“ als Farbwort
//   für den Samen (nur der Name „Blattgrün“ steht da). Der runde Körper in der
//   Mitte trägt keine Beschriftung.
// ═══════════════════════════════════════════════════════════════════════
let _n9r = null;
const _N9R_ALLELE = {
  GG: { name: 'G und G', b: ['G', 'G'], zeile: 1 },
  Gg: { name: 'G und g', b: ['G', 'g'], zeile: 2 },
  gg: { name: 'g und g', b: ['g', 'g'], zeile: 3 }
};
const _N9R_REIHE = ['GG', 'Gg', 'gg'];
// Zeitplan in s nach dem Druck
const _N9R_S2 = 2.4, _N9R_S3 = 4.4, _N9R_S4 = 6.8;
const _N9R_POP0 = 4.6, _N9R_POPAB = 0.36;            // Proteine entstehen
const _N9R_ABFAHRT = 0.08, _N9R_FAHRT = 0.9;          // Station 4: Abfahrt, Fahrt
const _N9R_ARBEIT = 1.7, _N9R_HUEPF = 0.3;            // ein Korn abbauen, zum Nachbarn
const _N9R_AUSKLANG = 0.6;
const _N9R_TEXT = [
  '1: Das Gen wird abgeschrieben.',
  '2: Die Abschrift wandert hinaus.',
  '3: Nach der Abschrift entstehen Proteine.',
  '4: Die Proteine arbeiten am Blattgrün.'
];
// Lage im Bild
const _N9R_ZK = { x: 100, y: 141, r: 44 };            // runder Körper in der Mitte
const _N9R_CHR_Y = [127, 155], _N9R_CHR_X0 = 74, _N9R_CHR_X1 = 126;
const _N9R_GEN_X0 = 106, _N9R_GEN_X1 = 122;
const _N9R_BAND_Y = [114, 168], _N9R_BAND_L = 18;     // Abschrift: Lage beim Entstehen, Länge
const _N9R_PORE_W = 35 * Math.PI / 180;               // Poren bei ±35°
const _N9R_BAU = [{ x: 178, y: 110 }, { x: 178, y: 172 }];
const _N9R_KORN_X = [45, 99, 153, 207, 261], _N9R_KORN_Y = [66, 216];
const _N9R_KORN_RX = 14, _N9R_KORN_RY = 8.5, _N9R_SPOT = 21;
const _N9R_GANG = [86, 196];                          // Laufwege über / unter dem runden Körper
const _N9R_SPUR_AB = 220, _N9R_SPUR_AUF = 232;        // senkrechte Laufwege rechts
const _N9R_SAMEN = { x: 362, y: 76, r: 25 };
const _N9R_FACH_Y = [150, 180, 210];
const _N9R_MARKE = [{ x: 56, y: 98 }, { x: 160, y: 141 }, { x: 160, y: 141 }, { x: 262, y: 141 }];
const _N9R_LEISTE_X = [330, 351, 372, 393];
// Farben
const _N9R_HG = '#eef3f6';
const _N9R_SAMENF = { gelb: '#fcd34d', gelbR: '#a16207', glanz: '#fff7d1',
                      gruen: '#4caf50', gruenR: '#14532d', streif: '#1b5e20' };

function _n9rKl(x) { return _bioFxKlemme(x); }
function _n9rE(x) { return _bioFxEase.sanft(_bioFxKlemme(x)); }
// Farbe zwischen a (u = 0) und b (u = 1)
function _n9rMisch(a, b, u) {
  const p = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const A = p(a), B = p(b);
  return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(',') + ')';
}
function _n9rWinkel(a, b, u) {                       // auf dem kürzesten Weg drehen
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * u;
}
function _n9rPore(c) {
  const w = c === 0 ? -_N9R_PORE_W : _N9R_PORE_W;
  return { x: _N9R_ZK.x + _N9R_ZK.r * Math.cos(w), y: _N9R_ZK.y + _N9R_ZK.r * Math.sin(w) };
}
// Korn g (0–4 obere Reihe, 5–9 untere), Stelle 'A' rechts davon, 'B' links davon
function _n9rKornOrt(g) { return { x: _N9R_KORN_X[g % 5], y: _N9R_KORN_Y[g < 5 ? 0 : 1] }; }
function _n9rStelle(g, st) {
  const k = _n9rKornOrt(g), A = st === 'A';
  return { x: k.x + (A ? _N9R_SPOT : -_N9R_SPOT), y: k.y, w: A ? Math.PI : 0 };
}
// Laufweg vom Start S zur Stelle P: über den oberen oder unteren Gang, wer die
// Seite wechselt, nimmt rechts eine senkrechte Spur. Nie durch den runden Körper.
function _n9rWeg(S, P) {
  const oben = P.y < _N9R_ZK.y, vonOben = S.y < _N9R_ZK.y;
  const gy = _N9R_GANG[oben ? 0 : 1];
  const roh = [{ x: S.x, y: S.y }];
  if (oben !== vonOben) {
    const lx = oben ? _N9R_SPUR_AUF : _N9R_SPUR_AB;
    roh.push({ x: lx, y: S.y }, { x: lx, y: gy });
  } else roh.push({ x: S.x, y: gy });
  roh.push({ x: P.x, y: gy }, { x: P.x, y: P.y });
  return _n9rPunkte(roh);
}
function _n9rPunkte(roh) {
  const pts = [roh[0]];
  for (const p of roh.slice(1)) {
    const q = pts[pts.length - 1];
    if (Math.hypot(p.x - q.x, p.y - q.y) > 0.5) pts.push(p);
  }
  return pts;
}
// Punkt und Richtung nach dem Anteil f (0–1) der Weglänge
function _n9rAufWeg(pts, f) {
  let L = 0;
  const seg = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); seg.push(d); L += d; }
  if (L < 1e-6) return { x: pts[0].x, y: pts[0].y, w: 0 };
  let r = _n9rKl(f) * L;
  for (let i = 0; i < seg.length; i++) {
    if (r <= seg[i] || i === seg.length - 1) {
      const u = seg[i] > 0 ? Math.min(1, r / seg[i]) : 1, a = pts[i], b = pts[i + 1];
      return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, w: Math.atan2(b.y - a.y, b.x - a.x) };
    }
    r -= seg[i];
  }
  const z = pts[pts.length - 1];
  return { x: z.x, y: z.y, w: 0 };
}

// ── Der Plan eines Durchgangs (alles vorher festgelegt, ohne Zufall) ──────
function _n9rPlan(al) {
  const b = _N9R_ALLELE[al].b;
  const prot = [];
  for (let c = 0; c < 2; c++) for (let k = 0; k < 5; k++) {
    // Fächer: oben von -110° bis 30°, unten von -30° bis 110° – die Zangen zeigen voneinander weg
    const B = _N9R_BAU[c], w = ((c === 0 ? -110 : -30) + 35 * k) * Math.PI / 180;
    prot.push({
      c, k, ok: b[c] === 'G', pop: _N9R_POP0 + _N9R_POPAB * k,
      // wer am Gang liegt, fährt zuerst: oben von oben nach unten, unten von unten nach oben
      i: c === 0 ? 2 * k : 2 * (4 - k) + 1,
      fan: { x: B.x + 24 * Math.cos(w), y: B.y + 24 * Math.sin(w), w },
      auf: []
    });
  }
  const P = (c, k) => prot[c * 5 + k];
  const korn = [];
  for (let g = 0; g < 10; g++) korn.push({ ds: null, de: null });
  const ziele = [];                                  // [c, k, [[korn, stelle], ...]]
  if (al === 'Gg') {
    // Die 5 dunkelblauen arbeiten erst an T1 T3 U4 U3 U1 (linkes Ende), dann
    // am linken Nachbarn (rechtes Ende); das von U4 wechselt nach T4. Die
    // grauen warten genau an diesen zweiten Körnern. So sind nie zwei
    // benachbarte Kornenden (13 px) zugleich besetzt.
    const erst = [[1, 'B'], [3, 'B'], [9, 'B'], [8, 'B'], [6, 'B']];
    const dann = [[0, 'A'], [2, 'A'], [4, 'B'], [7, 'A'], [5, 'A']];
    const grau = [[0, 'B'], [2, 'B'], [4, 'A'], [7, 'B'], [5, 'B']];
    for (let k = 0; k < 5; k++) {
      ziele.push([0, k, [erst[k], dann[k]]]);
      ziele.push([1, k, [grau[k]]]);
    }
  } else {
    for (let k = 0; k < 5; k++) { ziele.push([0, k, [[k, 'A']]]); ziele.push([1, k, [[5 + k, 'A']]]); }
  }
  let ende = 0;
  for (const [c, k, liste] of ziele) {
    const p = P(c, k);
    let von = { x: p.fan.x, y: p.fan.y }, ab = _N9R_S4 + _N9R_ABFAHRT * p.i, erster = true;
    for (const [g, st] of liste) {
      const ziel = _n9rStelle(g, st);
      const weg = erster ? _n9rWeg(von, ziel) : _n9rPunkte([von, { x: ziel.x, y: ziel.y }]);
      // Fahrt: fest; Wechsel zum Nachbarkorn: nach Weglänge (die Reihe wechseln dauert länger)
      const dauer = erster ? _N9R_FAHRT : Math.max(_N9R_HUEPF, Math.hypot(ziel.x - von.x, ziel.y - von.y) / 200);
      const a = { g, st, ab, an: ab + dauer, weg, w0: erster ? p.fan.w : null, w1: ziel.w, krumel: ab + dauer };
      if (!erster) a.w0 = p.auf[p.auf.length - 1].w1;
      p.auf.push(a);
      if (p.ok) {
        korn[g].ds = a.an; korn[g].de = a.an + _N9R_ARBEIT;
        a.bis = korn[g].de;
        ende = Math.max(ende, korn[g].de);
        ab = korn[g].de;
      } else {
        a.bis = Infinity;
        ende = Math.max(ende, a.an + _N9R_ARBEIT);   // so lange versucht es ein graues
      }
      von = { x: ziel.x, y: ziel.y }; erster = false;
    }
  }
  const okZahl = prot.filter(p => p.ok).length;
  return { al, prot, korn, ende, fertig: ende + _N9R_AUSKLANG, okZahl };
}

function _n9rInit() {
  _n9r = { t: 0, al: 'GG', ernte: { GG: null, Gg: null, gg: null }, pill2: { x: 240, y: 18 } };
  _n9rAnfang();
}
// Neue Zelle: nichts abgeschrieben, alle Körner voll Blattgrün
function _n9rAnfang() {
  const n = _n9r;
  n.phase = 'ruhe'; n.s = 0; n.plan = _n9rPlan(n.al);
  n.fx = { teile: [] }; n.aha = false; n.krumen = []; n.krumZahl = 0; n.letzt = '';
}

// ── Bedienung ──────────────────────────────────────────
function _n9rAllele(a) {
  if (!_n9r || !_N9R_ALLELE[a]) return;
  _n9r.al = a;
  _n9rAnfang();
  _n9rStatus();
}
function _n9rReifen() {
  if (!_n9r || _n9r.phase === 'lauf') return;
  _n9rAnfang();
  _n9r.phase = 'lauf';
  for (const y of _N9R_CHR_Y) _bioFxWelle(_n9r.fx.teile, (_N9R_GEN_X0 + _N9R_GEN_X1) / 2, y, '#fdba74', 22);
  _n9rStatus();
}
function _n9rNeu() {
  if (!_n9r) return;
  _n9r.al = 'GG';
  _n9r.ernte = { GG: null, Gg: null, gg: null };
  _n9rAnfang();
  _n9rStatus();
}

// ── Zustand ablesen ────────────────────────────────────
function _n9rStation() {                              // 0 = noch nicht gestartet, 5 = fertig
  const n = _n9r;
  if (n.phase === 'ruhe') return 0;
  if (n.phase === 'fertig') return 5;
  return n.s < _N9R_S2 ? 1 : n.s < _N9R_S3 ? 2 : n.s < _N9R_S4 ? 3 : 4;
}
function _n9rStufe(g, s) {                            // Blattgrün eines Korns, 1 = voll
  const k = _n9r.plan.korn[g];
  if (k.ds == null || _n9r.phase === 'ruhe') return 1;
  return 1 - _n9rKl((s - k.ds) / (k.de - k.ds));
}
function _n9rBlattgruen() {                           // Mittel aller Körner, 0–1
  let m = 0;
  for (let g = 0; g < 10; g++) m += _n9rStufe(g, _n9r.s);
  return m / 10;
}
function _n9rProzent() { return Math.round(100 * _n9rBlattgruen()); }
function _n9rArbeitende() {
  const n = _n9r;
  if (n.phase === 'ruhe') return 0;
  return n.plan.prot.filter(p => p.ok && n.s >= p.pop).length;
}
function _n9rZeile() {
  const n = _n9r, st = _n9rStation(), name = _N9R_ALLELE[n.al].name;
  if (st === 0) return 'Allele: ' + name + ' · Der Samen ist noch nicht reif.';
  if (st === 5) return 'Allele: ' + name + ' · Der Samen ist reif.';
  return _N9R_TEXT[st - 1];
}
function _n9rZaehlerText() {
  return 'arbeitende Proteine: ' + _n9rArbeitende() + '<br>Blattgrün: ' + _n9rProzent() + ' %';
}
function _n9rHinweis() {
  const n = _n9r, st = _n9rStation(), z = _N9R_ALLELE[n.al].zeile;
  if (st === 0) return 'Drücke „▶ Samen reifen lassen“. Beobachte die vier Stationen.';
  if (st === 1) return 'Sieh in die Mitte der Zelle: Was passiert am Gen?';
  if (st === 2) return 'Folge der Abschrift mit den Augen. Wohin wandert sie?';
  if (st === 3) return 'Zähle mit: Wie viele Proteine sind dunkelblau?';
  if (st === 4) return 'Beobachte den Zähler „Blattgrün“ und den Samen rechts.';
  if (z === 1) return 'Notiere in Zeile 1 der Tabelle die Farbe des Samens. Stelle dann „G und g“ ein.';
  if (z === 2) return 'Notiere in Zeile 2 der Tabelle: arbeitende Proteine und Farbe des Samens. Stelle dann „g und g“ ein.';
  return 'Notiere in Zeile 3 der Tabelle: arbeitende Proteine und Farbe des Samens. Vergleiche dann Zeile 1 und 2.';
}
function _n9rStatus() {
  if (!_n9r) return;
  const n = _n9r;
  const z = _n9rZeile(), zt = _n9rZaehlerText(), h = _n9rHinweis();
  n.letzt = z + '|' + zt + '|' + h;
  const el = document.getElementById('_n9r-status');
  if (el) { el.textContent = z; el.className = 'lmp-status on'; }
  const za = document.getElementById('_n9r-zaehler');
  if (za) { za.innerHTML = zt; za.className = 'lmp-status on'; }
  const hi = document.getElementById('_n9r-hinweis');
  if (hi) hi.textContent = h;
  const los = document.getElementById('_n9r-los');
  if (los) {
    los.disabled = n.phase === 'lauf';
    try { if (los.classList) los.classList.toggle('primary', n.phase !== 'lauf'); } catch (e) { /* Beiwerk */ }
  }
  try {
    document.querySelectorAll('[data-n9r]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9r') === n.al);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
}
function _n9rHTML() {
  const k = a => `<button class="sim-btn${a === 'GG' ? ' primary' : ''}" data-n9r="${a}" onclick="_n9rAllele('${a}')">${_N9R_ALLELE[a].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie wird aus einem Gen ein Merkmal?</h3>
    <div class="fpm-note" style="margin-top:2px">Eine Zelle aus einem reifenden Erbsensamen, stark vergrößert. In der Mitte liegen zwei Chromosomen mit dem Gen für die Samenfarbe. Die Körner um sie herum enthalten Blattgrün.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9r-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <span class="fpm-label" style="margin-right:4px">Allele</span>
          ${_N9R_REIHE.map(k).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9r-los" onclick="_n9rReifen()">▶ Samen reifen lassen</button>
          <button class="sim-btn" onclick="_n9rNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Station</div>
        <div class="lmp-status on" id="_n9r-status" style="margin-top:4px"></div>
        <div class="fpm-label" style="margin-top:8px">Zähler</div>
        <div class="lmp-status on" id="_n9r-zaehler" style="margin-top:4px"></div>
        <div class="fpm-note" id="_n9r-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Dunkelblau mit Zange: Dieses Protein arbeitet. Grau mit abgebrochener Zange: Dieses Protein arbeitet nicht.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: G und G &nbsp;|&nbsp; Ein Durchgang dauert etwa 12 Sekunden.</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9rUpdate(dt) {
  if (!_n9r) return;
  dt = _bioFxDt(dt);
  const n = _n9r;
  n.t += dt;
  if (n.phase !== 'ruhe') n.s += dt;
  if (n.phase === 'lauf') {
    _n9rKrumenNeu();
    if (!n.aha && n.s >= n.plan.ende) { n.aha = true; _n9rAha(); }
    if (n.s >= n.plan.fertig) { n.phase = 'fertig'; _n9rErnten(); }
  }
  for (let i = n.krumen.length - 1; i >= 0; i--) {
    const q = n.krumen[i];
    q.alter += dt;
    if (q.alter >= q.leben) { n.krumen.splice(i, 1); continue; }
    q.x += q.vx * dt; q.y += q.vy * dt;
  }
  for (const a of _N9R_REIHE) if (n.ernte[a]) n.ernte[a].alter += dt;
  _bioFxAlleUpdate(n.fx, dt);
  const jetzt = _n9rZeile() + '|' + _n9rZaehlerText() + '|' + _n9rHinweis();
  if (jetzt !== n.letzt) _n9rStatus();
}
// Krümel Blattgrün fliegen vom Korn weg, solange ein dunkelblaues arbeitet
function _n9rKrumenNeu() {
  const n = _n9r, s = n.s;
  for (const p of n.plan.prot) {
    if (!p.ok) continue;
    for (const a of p.auf) {
      while (s >= a.krumel && a.krumel < a.bis - 0.2) {
        const k = _n9rKornOrt(a.g), seite = a.st === 'A' ? 1 : -1, m = n.krumZahl++;
        const w = (m % 2 ? -1 : 1) * (0.9 + 0.35 * Math.sin(m * 1.7));
        n.krumen.push({ x: k.x + seite * (_N9R_KORN_RX - 3), y: k.y,
                        vx: seite * 7 * Math.cos(w) + 4 * Math.sin(m), vy: 16 * Math.sin(w),
                        alter: 0, leben: 0.8 });
        if (n.krumen.length > 80) n.krumen.shift();
        a.krumel += 0.28;
      }
    }
  }
}
// Blattgrün ist am Ende angekommen (bzw. die grauen haben es lange genug versucht)
function _n9rAha() {
  const n = _n9r, fx = n.fx, S = _N9R_SAMEN, p2 = n.pill2;
  if (n.plan.okZahl > 0) {
    _bioFxWelle(fx.teile, p2.x, p2.y, '#86efac', 42);
    _bioFxWelle(fx.teile, S.x, S.y, '#fde047', S.r + 22);
    _bioFxFunken(fx.teile, S.x, S.y, 10, ['#ffd84d', '#fff3b0', '#ffffff']);
    for (const p of n.plan.prot) if (p.ok) { const o = _n9rProteinOrt(p, n.s); _bioFxWelle(fx.teile, o.x, o.y, '#93c5fd', 20); }
  } else {
    _bioFxWelle(fx.teile, p2.x, p2.y, '#93c5fd', 42);
    _bioFxWelle(fx.teile, S.x, S.y, '#93c5fd', S.r + 22);
  }
}
// Der reife Samen kommt in sein Ergebnisfach
function _n9rErnten() {
  const n = _n9r, j = _N9R_REIHE.indexOf(n.al);
  n.ernte[n.al] = { stufe: _n9rBlattgruen(), alter: 0 };
  _bioFxWelle(n.fx.teile, 326, _N9R_FACH_Y[j] + 13, '#fde68a', 22);
  const partner = n.al === 'GG' ? 'Gg' : n.al === 'Gg' ? 'GG' : null;
  if (partner && n.ernte[partner]) {
    const jp = _N9R_REIHE.indexOf(partner);
    _bioFxWelle(n.fx.teile, 326, _N9R_FACH_Y[jp] + 13, '#fde68a', 22);
  }
}

// ── Wo steht ein Protein zur Zeit s? ───────────────────
function _n9rSchweb(g, t) {                           // Körner treiben sacht im Zellsaft
  return { x: 1.1 * Math.sin(0.55 * t + 1.3 * g), y: 0.9 * Math.cos(0.47 * t + 2.1 * g) };
}
function _n9rProteinOrt(p, s) {
  const n = _n9r, t = n.t, B = _N9R_BAU[p.c];
  if (s < p.pop) return null;
  const wack = { x: 0.6 * Math.sin(1.3 * t + p.i), y: 0.6 * Math.cos(1.1 * t + 1.7 * p.i) };
  // (3) entstehen an der Abschrift und an den Wartplatz gehen
  if (s < p.pop + 0.6) {
    const sc = 0.25 + 0.75 * _bioFxEase.raus(_n9rKl((s - p.pop) / 0.25));
    const u = _n9rE((s - p.pop - 0.25) / 0.35);
    const x0 = B.x + 9, y0 = B.y;
    return { x: x0 + (p.fan.x - x0) * u, y: y0 + (p.fan.y - y0) * u, w: p.fan.w, sc, zu: 'neu' };
  }
  const a0 = p.auf[0];
  if (!a0 || s < a0.ab) return { x: p.fan.x + wack.x, y: p.fan.y + wack.y, w: p.fan.w, sc: 1, zu: 'warten' };
  // (4) Fahrt zu den Körnern, Arbeit am Korn
  for (let i = 0; i < p.auf.length; i++) {
    const a = p.auf[i], naechste = p.auf[i + 1];
    if (s < a.an) {
      const f = _n9rE((s - a.ab) / (a.an - a.ab));
      const o = _n9rAufWeg(a.weg, f);
      let w = o.w;
      w = _n9rWinkel(a.w0, w, _n9rKl(f / 0.15));
      w = _n9rWinkel(w, a.w1, _n9rKl((f - 0.8) / 0.2));
      return { x: o.x, y: o.y, w, sc: 1, zu: 'fahrt' };
    }
    if (!naechste || s < naechste.ab) {
      const st = _n9rStelle(a.g, a.st), sw = _n9rSchweb(a.g, t), m = _n9rKl((s - a.an) / 0.3);
      let x = st.x + sw.x * m, y = st.y + sw.y * m, zu;
      if (!p.ok) {
        // ein graues drückt gegen das Korn, die Zange rutscht ab
        const stoss = Math.max(0, Math.sin(2 * Math.PI * 0.8 * (s - a.an) + p.i));
        x += Math.cos(a.w1) * 1.6 * stoss;
        zu = 'probe';
      } else zu = s < a.bis ? 'arbeit' : 'fertig';
      return { x, y, w: a.w1, sc: 1, zu };
    }
  }
  const z = p.auf[p.auf.length - 1], st = _n9rStelle(z.g, z.st);
  return { x: st.x, y: st.y, w: z.w1, sc: 1, zu: p.ok ? 'fertig' : 'probe' };
}

// ── Zeichnen ───────────────────────────────────────────
function _n9rZelle(ctx, t) {
  ctx.save();
  ctx.fillStyle = '#dfe9cc'; ctx.strokeStyle = '#6f8f3e'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, 8, 38, 290, 206, 16); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f7faef'; ctx.strokeStyle = '#a8bd84'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, 14, 44, 278, 194, 12); ctx.fill(); ctx.stroke();
  // feine Teilchen im Zellsaft – das Bild lebt
  ctx.fillStyle = 'rgba(110,130,80,0.28)';
  for (let i = 0; i < 16; i++) {
    const px = 20 + ((i * 53 + t * 5) % 266), py = 50 + ((i * 37) % 182) + 2 * Math.sin(t * 0.6 + i);
    if (Math.hypot(px - _N9R_ZK.x, py - _N9R_ZK.y) < _N9R_ZK.r + 4) continue;
    ctx.beginPath(); ctx.arc(px, py, 1.3, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
// Ein Korn mit Blattgrün: grün mit drei dunklen Streifen; abgebaut blass und glatt
function _n9rKorn(ctx, x, y, st) {
  ctx.save();
  ctx.fillStyle = _n9rMisch('#fde9a6', '#5aae55', st);
  ctx.strokeStyle = _n9rMisch('#b8892a', '#22622b', st); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.ellipse(x, y, _N9R_KORN_RX, _N9R_KORN_RY, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  if (st > 0.02) {
    ctx.globalAlpha = st;
    ctx.strokeStyle = '#1d5c27'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (const dx of [-7, 0, 7]) {
      const h = dx ? 3.4 : 4.6;
      ctx.beginPath(); ctx.moveTo(x + dx, y - h); ctx.lineTo(x + dx, y + h); ctx.stroke();
    }
  }
  ctx.restore();
}
// Der runde Körper in der Mitte mit zwei Poren rechts (ohne Beschriftung)
function _n9rMitte(ctx, t) {
  const K = _N9R_ZK, luecke = 0.13;
  ctx.save();
  ctx.fillStyle = '#fdf3dc';
  ctx.beginPath(); ctx.arc(K.x, K.y, K.r, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = '#9a7b4f'; ctx.lineWidth = 2.6;
  const r = K.r + 0.4 * Math.sin(t * 1.2);
  const stuecke = [[_N9R_PORE_W + luecke, 2 * Math.PI - _N9R_PORE_W - luecke], [-_N9R_PORE_W + luecke, _N9R_PORE_W - luecke]];
  for (const [a0, a1] of stuecke) { ctx.beginPath(); ctx.arc(K.x, K.y, r, a0, a1); ctx.stroke(); }
  ctx.fillStyle = '#7a5f38';
  for (const sg of [-1, 1]) for (const d of [-luecke, luecke]) {
    const w = sg * _N9R_PORE_W + d;
    ctx.beginPath(); ctx.arc(K.x + r * Math.cos(w), K.y + r * Math.sin(w), 1.9, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
// Chromosomenpaar mit dem Gen; während Station 1 leuchten die Gen-Felder
function _n9rChromosomen(ctx, t, s, st) {
  const b = _N9R_ALLELE[_n9r.al].b, gx = (_N9R_GEN_X0 + _N9R_GEN_X1) / 2;
  ctx.save();
  if (st === 0) for (const y of _N9R_CHR_Y) _bioFxLeuchten(ctx, gx, y, 11, t, '251,146,60');
  if (st === 1) for (const y of _N9R_CHR_Y) _bioFxLeuchten(ctx, gx, y, 13, t, '251,146,60');
  _N9R_CHR_Y.forEach((y, c) => {
    ctx.lineCap = 'round';
    // erst alle Ränder, dann alle Füllungen – sonst malt die Taille ihren Rand über den Arm
    const teile = [[_N9R_CHR_X0, 86, 12], [94, _N9R_CHR_X1, 12], [84, 96, 7]];
    for (const [rand, farbe, dick] of [[true, '#4c1d95', 2], [false, '#8b5cf6', 0]]) {
      ctx.strokeStyle = farbe;
      for (const [x0, x1, d] of teile) {
        ctx.lineWidth = d + dick;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      }
    }
    ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(_N9R_CHR_X0 + 2, y - 3); ctx.lineTo(84, y - 3); ctx.stroke();
    // Gen-Feld mit Buchstabe
    ctx.fillStyle = '#fb923c'; ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 1.2;
    ctx.fillRect(_N9R_GEN_X0, y - 6.5, _N9R_GEN_X1 - _N9R_GEN_X0, 13);
    ctx.strokeRect(_N9R_GEN_X0, y - 6.5, _N9R_GEN_X1 - _N9R_GEN_X0, 13);
    ctx.fillStyle = '#1c1917'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(b[c], gx, y + 0.5);
    // Station 1: ein heller Leser wandert über das Gen
    if (st === 1) {
      const g = _n9rKl((s - 0.3) / 1.5);
      if (g > 0 && g < 1) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(_N9R_GEN_X0 + g * (_N9R_GEN_X1 - _N9R_GEN_X0), y + (c ? 6.5 : -6.5), 2.6, 0, 2 * Math.PI);
        ctx.fill(); ctx.stroke();
      }
    }
  });
  ctx.restore();
}
// Eine Abschrift: orangefarbenes Band mit Basenstrichen, Mitte x/y, Winkel w, Länge L
function _n9rBand(ctx, x, y, w, L, buch) {
  if (L < 0.5) return;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(w);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const welle = u => 1.4 * Math.sin(u * 0.75);
  ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 1.3;
  for (let u = -L / 2 + 1.5; u <= L / 2 - 1; u += 3) {
    ctx.beginPath(); ctx.moveTo(u, welle(u)); ctx.lineTo(u, welle(u) + 4); ctx.stroke();
  }
  ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 3;
  ctx.beginPath();
  for (let u = -L / 2, i = 0; u <= L / 2 + 0.01; u += 1.5, i++) { if (i) ctx.lineTo(u, welle(u)); else ctx.moveTo(u, welle(u)); }
  ctx.stroke();
  ctx.restore();
  if (buch && L > 8) {
    // Buchstabe immer waagerecht lesbar, links neben dem Band
    const tx = x - (L / 2 + 6) * Math.abs(Math.cos(w)) - 9 * Math.abs(Math.sin(w));
    ctx.save();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(tx, y, 5.6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#7c2d12'; ctx.font = '700 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(buch, tx, y + 0.5);
    ctx.restore();
  }
}
function _n9rAbschriften(ctx, s, st) {
  if (st === 0) return;
  const b = _N9R_ALLELE[_n9r.al].b, L = _N9R_BAND_L;
  for (let c = 0; c < 2; c++) {
    const y0 = _N9R_BAND_Y[c], B = _N9R_BAU[c];
    if (s < _N9R_S2 && st === 1) {
      const g = _n9rKl((s - 0.3) / 1.5);             // wächst von links nach rechts mit
      _n9rBand(ctx, _N9R_GEN_X0 - 2 + L * g / 2, y0, 0, L * g, g > 0.5 ? b[c] : '');
      continue;
    }
    const u = _n9rE((s - 2.5) / 1.7);
    const start = { x: _N9R_GEN_X0 - 2 + L / 2, y: y0 }, pore = _n9rPore(c);
    const o = _n9rAufWeg([start, pore, { x: B.x, y: B.y }], u);
    const w = _n9rWinkel(o.w, -Math.PI / 2, _n9rKl((u - 0.75) / 0.25));
    _n9rBand(ctx, o.x, o.y, u >= 1 ? -Math.PI / 2 : w, L, b[c]);
  }
}
// Ein Protein: Körper und Zange vorn (Richtung w). ok = dunkelblau mit ganzer
// Zange; sonst grau mit abgebrochener unterer Backe und Riss im Körper.
function _n9rProtein(ctx, x, y, w, ok, auf, sc) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(w); ctx.scale(sc, sc);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const off = 0.2 + 0.36 * auf, L = 7.5;
  ctx.strokeStyle = ok ? '#1e3a8a' : '#6b7280'; ctx.lineWidth = 2.4;
  for (const sg of [-1, 1]) {
    const kurz = !ok && sg > 0;
    const l = kurz ? 3.2 : L;
    const ex = 4.6 + Math.cos(off) * l, ey = sg * (1.4 + Math.sin(off) * l);
    ctx.beginPath(); ctx.moveTo(4.2, sg * 1.4); ctx.lineTo(ex, ey);
    if (!kurz) ctx.lineTo(ex + 1.3, ey - sg * 2.3);
    ctx.stroke();
    if (kurz) {                                       // Bruchkante
      ctx.save(); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ex - 0.6, ey - 1.4); ctx.lineTo(ex + 1.2, ey - 0.4);
      ctx.lineTo(ex + 0.2, ey + 0.6); ctx.lineTo(ex + 1.6, ey + 1.6); ctx.stroke();
      ctx.restore();
    }
  }
  ctx.fillStyle = ok ? '#1e3a8a' : '#c3c8d0';
  ctx.strokeStyle = ok ? '#0b1640' : '#6b7280'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.ellipse(-0.6, 0, 6.2, 5.1, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  if (ok) {
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath(); ctx.arc(-2.4, -1.9, 1.4, 0, 2 * Math.PI); ctx.fill();
  } else {
    ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(1.4, -4.6); ctx.lineTo(-0.4, -1.6); ctx.lineTo(1.2, 0.6); ctx.lineTo(-0.2, 3); ctx.stroke();
  }
  ctx.restore();
}
function _n9rProteine(ctx, s) {
  const n = _n9r, t = n.t, liste = [];
  for (const p of n.plan.prot) {
    const o = _n9rProteinOrt(p, s);
    if (o) liste.push([p, o]);
  }
  // wer fährt, liegt oben
  liste.sort((a, b) => (a[1].zu === 'fahrt') - (b[1].zu === 'fahrt'));
  for (const [p, o] of liste) {
    let auf = 0.6;
    if (o.zu === 'arbeit') auf = 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.0 * s + p.i);
    else if (o.zu === 'probe') auf = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.8 * s + p.i);
    else if (o.zu === 'fertig') auf = 0.45 + 0.1 * Math.sin(t * 1.5 + p.i);
    _n9rProtein(ctx, o.x, o.y, o.w, p.ok, auf, o.sc);
  }
}
// Zähler oben: feste Breite nach dem längsten Text, damit nichts springt
function _n9rPillen(ctx) {
  const n = _n9r;
  ctx.save();
  ctx.font = '700 12px sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const w1 = Math.ceil(ctx.measureText('arbeitende Proteine: 10').width) + 18;
  const w2 = Math.ceil(ctx.measureText('Blattgrün: 100 %').width) + 18;
  const x1 = 8, x2 = x1 + w1 + 6, y = 7, h = 23;
  ctx.fillStyle = '#ffffff'; ctx.lineWidth = 1.6;
  ctx.strokeStyle = '#1e3a8a';
  _bioFxRundRect(ctx, x1, y, w1, h, 9); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#3f8f46';
  _bioFxRundRect(ctx, x2, y, w2, h, 9); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0f172a';
  ctx.fillText('arbeitende Proteine: ' + _n9rArbeitende(), x1 + 9, y + h / 2 + 0.5);
  ctx.fillText('Blattgrün: ' + _n9rProzent() + ' %', x2 + 9, y + h / 2 + 0.5);
  n.pill2 = { x: x2 + w2 / 2, y: y + h / 2 };
  ctx.restore();
}
// Stationsleiste 1–4 oben rechts
function _n9rLeiste(ctx, st, t) {
  const y = 18;
  ctx.save();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(_N9R_LEISTE_X[0], y); ctx.lineTo(_N9R_LEISTE_X[3], y); ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const x = _N9R_LEISTE_X[i], nr = i + 1, jetzt = st === nr, fertig = st > nr;
    if (jetzt) _bioFxLeuchten(ctx, x, y, 9, t, '20,184,166');
    ctx.fillStyle = jetzt ? '#0f766e' : fertig ? '#ccfbf1' : '#ffffff';
    ctx.strokeStyle = jetzt || fertig ? '#0f766e' : '#cbd5e1'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(x, y, 8.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.fillStyle = jetzt ? '#ffffff' : fertig ? '#0f766e' : '#94a3b8';
    ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(nr), x, y + 0.5);
  }
  ctx.restore();
}
// Nummer der Station an der Stelle, wo es gerade passiert
function _n9rMarke(ctx, st, s) {
  if (st < 1 || st > 4) return;
  const beginn = [0, _N9R_S2, _N9R_S3, _N9R_S4][st - 1], m = _N9R_MARKE[st - 1];
  const a = _n9rKl((s - beginn) / 0.3);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = '#0f766e'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(m.x, m.y, 10, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(st), m.x, m.y + 0.5);
  ctx.restore();
}
// Ein Erbsensamen (wie bio-mendel): st = Blattgrün 0–1. Voll: grün mit drei
// Streifen. Leer: gelb und glatt mit Glanzpunkt. Streifen ohne clip() gerechnet.
function _n9rSamenZeichnen(ctx, x, y, r, st) {
  const F = _N9R_SAMENF;
  ctx.save();
  ctx.fillStyle = _n9rMisch(F.gelb, F.gruen, st);
  ctx.strokeStyle = _n9rMisch(F.gelbR, F.gruenR, st); ctx.lineWidth = Math.max(1.4, r * 0.08);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  if (st > 0.02) {
    ctx.globalAlpha = st;
    ctx.strokeStyle = F.streif; ctx.lineWidth = Math.max(1.4, r * 0.16); ctx.lineCap = 'round';
    const w = -0.7, nx = Math.cos(w + Math.PI / 2), ny = Math.sin(w + Math.PI / 2);
    for (const o of [-0.45, 0, 0.45]) {
      const d = o * r, hl = Math.sqrt(Math.max(0, (0.78 * r) ** 2 - d * d));
      const mx = x + nx * d, my = y + ny * d;
      ctx.beginPath(); ctx.moveTo(mx - Math.cos(w) * hl, my - Math.sin(w) * hl);
      ctx.lineTo(mx + Math.cos(w) * hl, my + Math.sin(w) * hl); ctx.stroke();
    }
  }
  if (st < 0.98) {
    ctx.globalAlpha = 1 - st;
    ctx.fillStyle = F.glanz;
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
function _n9rRechts(ctx, st, t) {
  const n = _n9r, S = _N9R_SAMEN;
  _n9rLeiste(ctx, st, t);
  _n9rSamenZeichnen(ctx, S.x, S.y + 0.6 * Math.sin(t * 0.9), S.r, _n9rBlattgruen());
  ctx.save();
  ctx.fillStyle = '#334155'; ctx.font = '600 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('der ganze Samen', S.x, 120);
  ctx.fillStyle = '#475569'; ctx.font = '700 11px sans-serif';
  ctx.fillText('Ergebnisse', S.x, 143);
  _N9R_REIHE.forEach((a, j) => {
    const y = _N9R_FACH_Y[j], e = n.ernte[a], jetzt = a === n.al;
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = jetzt ? '#0f766e' : '#cbd5e1'; ctx.lineWidth = jetzt ? 2 : 1.2;
    _bioFxRundRect(ctx, 312, y, 100, 26, 7); ctx.fill(); ctx.stroke();
    if (e) {
      const sc = 0.4 + 0.6 * _bioFxEase.raus(_n9rKl(e.alter / 0.4));
      _n9rSamenZeichnen(ctx, 326, y + 13, 9 * sc, e.stufe);
    } else {
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2; ctx.setLineDash([2.5, 2.5]);
      ctx.beginPath(); ctx.arc(326, y + 13, 8, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.fillStyle = '#0f172a'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(_N9R_ALLELE[a].name, 342, y + 13.5);
  });
  ctx.restore();
}
function _n9rDraw(ctx, cv) {
  if (!_n9r) return;
  const n = _n9r, W = cv.width, H = cv.height, t = n.t, s = n.s, st = _n9rStation();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = _N9R_HG; ctx.fillRect(0, 0, W, H);
  _n9rZelle(ctx, t);
  for (let g = 0; g < 10; g++) {
    const k = _n9rKornOrt(g), sw = _n9rSchweb(g, t);
    _n9rKorn(ctx, k.x + sw.x, k.y + sw.y, _n9rStufe(g, s));
  }
  _n9rMitte(ctx, t);
  _n9rChromosomen(ctx, t, s, st);
  _n9rAbschriften(ctx, s, st);
  if (st >= 3) _n9rProteine(ctx, s);
  ctx.save();
  for (const q of n.krumen) {
    ctx.globalAlpha = 1 - q.alter / q.leben;
    ctx.fillStyle = '#3f9b48';
    ctx.beginPath(); ctx.arc(q.x, q.y, 1.7, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
  _n9rMarke(ctx, st, s);
  _n9rPillen(ctx);
  _n9rRechts(ctx, st, t);
  _bioFxAlleDraw(ctx, n.fx);
}
