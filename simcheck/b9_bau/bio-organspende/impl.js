// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · EINE NEUE NIERE FÜR LINAS OPA   (Förderheft Bio 9 · bd5)
// Kennung bio-organspende, Präfix _n9k. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bd5.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250, schematisch, keine Operation):
//   - ein heller grauer Körper-Umriss von vorn (Kopf ohne Gesicht, Arme, Rumpf).
//   - links im Rumpf ein Blutgefäß; Opas Blut fließt darin von oben nach unten:
//     dunkelrote Blutkörperchen und kleine blaue Y-Teilchen (mit weißem Rand).
//     Die Y-Teilchen schwimmen IMMER in Opas Blut, bei allen vier Einstellungen.
//   - unten in der Mitte die Harnblase, rechts daneben (Leitlinie) der Zähler.
//   - rechts neben dem Körper eine weiße Kühlbox, darin die neue Niere (rot),
//     darüber das Schild „neue Niere / Blutgruppe …“.
//   - oben links der Kasten „Opa: Blutgruppe A“, daneben die Tablettenschachtel
//     „nimmt Medikamente“ – bei allen vier Einstellungen gleich. Oben rechts
//     „Zeit: … min“ mit Balken.
//
// BEDIENUNG (wörtlich wie im Bauplan):
//   Blutgruppe der neuen Niere: „A“ · „B“ · „AB“ · „0“   (Wahlgruppe _n9kGruppe)
//   „▶ Niere einsetzen“ (_n9kEinsetzen) · „neu“ (_n9kNeu → zurück auf „A“)
//
// ABLAUF NACH „▶ Niere einsetzen“ (Zeiten in s):
//   0–1,2   die Niere schwebt aus der Kühlbox in den Bauch unten rechts
//   1,2–1,6 zwei kurze Blutgefäße wachsen vom großen Blutgefäß zur Niere, ein
//           dünner Schlauch wächst von der Niere zur Harnblase
//   1,6–6,6 EINE STUNDE im Zeitraffer (5 s): Ein Teil des Blutes fließt durch die
//           neue Niere und wieder hinaus; die Y-Teilchen biegen in die Niere ab.
//     A, 0:  Die Y-Teilchen fließen durch die Niere hindurch und wieder hinaus.
//            Gelbe Tropfen laufen durch den Schlauch, die Harnblase füllt sich.
//            1 ml je Minute (Modellwert) → nach 60 min 60 ml.
//     B, AB: Die Y-Teilchen bleiben an der Niere hängen (8 Stellen), die Niere
//            wird grau (ganz grau ab 6 Teilchen). Kein Harn: 0 ml.
//   Das Endbild bleibt stehen, bis man umstellt oder neu einsetzt.
//   Gerechnet wird das Ergebnis NICHT aus einer Tabelle, sondern aus der Regel:
//   Opas Blut (Blutgruppe A) trägt Y-Teilchen gegen das Merkmal B; die Niere
//   trägt die Merkmale ihrer Blutgruppe (A: A · B: B · AB: A und B · 0: keines).
//
// STATUSZEILE (_n9k-status):
//   vorher   „Die neue Niere liegt in der Kühlbox.“
//   Einsetzen „Die neue Niere wird eingesetzt.“
//   Stunde   „Opas Blut fließt durch die neue Niere.“, dann
//            A, 0:  „Die Niere arbeitet.“         (ab 1 ml Harn)
//            B, AB: „Die Niere wird angegriffen.“ (ab dem ersten Y-Teilchen)
// ZÄHLER (_n9k-harn, dazu im Bild an der Harnblase):
//   vorher/Stunde „Zeit: 34 min · Harn: 34 ml“ (1 ml je Minute) bzw. „… 0 ml“
//   danach        „Harn in 1 Stunde: 60 ml“ oder „Harn in 1 Stunde: 0 ml“
// HINWEIS (_n9k-hinweis): vorher „Blutgruppe „B“ ist eingestellt. Drücke
//   „▶ Niere einsetzen“.“ · Stunde „Niere mit Blutgruppe „B“: Eine Stunde läuft
//   im Zeitraffer. …“ · danach „Niere mit Blutgruppe „B“: Die Stunde ist um.
//   Trage dein Ergebnis in die Tabelle ein. …“
//
// WERTE (lehrer.tabelle_erwartet, am Bild abzulesen):
//   A   nein  60 ml   „Die Niere arbeitet.“         „Harn in 1 Stunde: 60 ml“
//   B   ja     0 ml   „Die Niere wird angegriffen.“ „Harn in 1 Stunde: 0 ml“
//   AB  ja     0 ml   „Die Niere wird angegriffen.“ „Harn in 1 Stunde: 0 ml“
//   0   nein  60 ml   „Die Niere arbeitet.“         „Harn in 1 Stunde: 60 ml“
//
// AHA (_bioFx, ruhig, ohne Textstreifen, ohne Funken): B und AB – das erste
//   Y-Teilchen heftet sich in kurzer Zeitlupe an, jede Stelle zeigt einen kleinen
//   Ring, beim Grauwerden ein grauer Ring um die ganze Niere. A und 0 – der erste
//   Tropfen kommt in Zeitlupe in der Harnblase an (gelber Ring). Am Ende ein Ring
//   am Zähler. Die Y-Teilchen fließen bei A und 0 sichtbar an der Niere vorbei
//   und durch sie hindurch – nur EINE Bedingung ist anders.
//
// NICHT AM BILDSCHIRM: „passen“, „passt“, „Abwehr“, „Spender“, „Transplantation“
//   (Lückenwörter und neue Fachwörter der Seite), „gesund“ (Vermutung 3). Keine
//   Operation, keine Instrumente, keine Wunde, kein Gesicht. Deterministisch,
//   ohne Zufall.
// ═══════════════════════════════════════════════════════════════════════
let _n9k = null;
const _N9K_GRUPPEN = ['A', 'B', 'AB', '0'];
// Merkmale auf der Niere je Blutgruppe; Opas Blut (A) trägt Y-Teilchen gegen B
const _N9K_MERKMALE = { A: ['A'], B: ['B'], AB: ['A', 'B'], '0': [] };
const _N9K_OPA_GEGEN = 'B';
// Zeitplan in s nach „▶ Niere einsetzen“
const _N9K_FLUG = 1.2;                  // Niere schwebt an ihren Platz
const _N9K_ANSCHLUSS = 1.6;             // Blutgefäße und Schlauch fertig
const _N9K_STUNDE = 5.0;                // 60 Minuten im Zeitraffer
const _N9K_ENDE = _N9K_ANSCHLUSS + _N9K_STUNDE;
const _N9K_ML_JE_MIN = 1;               // Modellwert: 60 ml Harn in 1 Stunde
// Blutstrom
const _N9K_TEMPO = 80;                  // Bildpunkte je s
const _N9K_DT_BLUT = 0.1, _N9K_DT_Y = 0.22;   // Abstand der Teilchen in s
const _N9K_GRAU_BEI = 6;                // so viele Y-Teilchen: Niere ganz grau
const _N9K_TROPFEN_TEMPO = 70;
// Lage
const _N9K_CX = 150;                    // Körpermitte
const _N9K_NX = 178, _N9K_NY = 165;     // Platz der neuen Niere (Bauch unten rechts)
const _N9K_KX = 340, _N9K_KY = 112;     // Niere in der Kühlbox
const _N9K_A = 18, _N9K_B = 25;         // halbe Breite und Höhe der Niere
const _N9K_BX = 150, _N9K_BY = 228, _N9K_BRX = 17, _N9K_BRY = 13;   // Harnblase
const _N9K_BOX = { x: 306, y: 124, w: 68, h: 36 };                  // Kühlbox
const _N9K_ZB = { x: 266, y: 192, w: 146, h: 54 };                  // Zählerkasten
const _N9K_HG = '#f8fafc';

// ── Wege des Blutes (Polylinien) ───────────────────────
function _n9kQuad(p0, c, p1, n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]);
  }
  return out;
}
function _n9kLinie(p) {
  const c = [0];
  for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  return { p, c, L: c[c.length - 1] };
}
// Punkt und Richtung bei Strecke d
function _n9kAuf(lin, d) {
  const p = lin.p, c = lin.c;
  d = Math.max(0, Math.min(lin.L, d));
  let i = 1;
  while (i < p.length - 1 && c[i] < d) i++;
  const s = c[i] - c[i - 1] || 1, u = (d - c[i - 1]) / s;
  return { x: p[i - 1][0] + (p[i][0] - p[i - 1][0]) * u, y: p[i - 1][1] + (p[i][1] - p[i - 1][1]) * u,
           w: Math.atan2(p[i][1] - p[i - 1][1], p[i][0] - p[i - 1][0]) };
}
const _N9K_OBEN = [[122, 92], [122, 154]];                    // bis zum Abzweig
const _N9K_J1 = [122, 154], _N9K_J2 = [122, 182];            // Abzweig, Rückfluss
const _N9K_HIN = [167, 160], _N9K_HAUS = [167, 171];         // an der Niere
const _N9K_UNTEN = [_N9K_J2].concat(_n9kQuad(_N9K_J2, [122, 216], [100, 254], 12), [[94, 268]]);
const _N9K_SCHLEIFE = [_N9K_HIN, [176, 150], [187, 155], [190, 166], [187, 177], [176, 181], _N9K_HAUS];
const _N9K_WEG_H = _n9kLinie(_N9K_OBEN.concat(_N9K_UNTEN));
const _N9K_WEG_N = _n9kLinie(_N9K_OBEN.concat(_N9K_SCHLEIFE, _N9K_UNTEN));
const _N9K_D1 = 62;                                          // Strecke bis zum Abzweig
// Stellen, an denen Y-Teilchen hängen bleiben (relativ zur Nierenmitte)
// sieben auf einem Ring (Einbuchtung ausgespart) und eine in der Mitte
const _N9K_FLECKEN = [[-8.1, -11.3], [-1, -15.9], [6.6, -13.1], [11.1, -4.1],
                      [10.4, 6.8], [4.9, 14.5], [-3, 15.5], [1.5, 0.5]];
const _N9K_WEG_S = _N9K_FLECKEN.map(f => _n9kLinie(_N9K_OBEN.concat([_N9K_HIN, [_N9K_NX + f[0], _N9K_NY + f[1]]])));
const _N9K_LEITER = _n9kLinie([[175, 183]].concat(_n9kQuad([175, 183], [173, 206], [157, 217], 10), [[153, 223]]));

function _n9kAngriff(bg) { return _N9K_MERKMALE[bg].indexOf(_N9K_OPA_GEGEN) >= 0; }

function _n9kInit() {
  _n9k = { bg: 'A', phase: 'ruhe', s: -1, t: 0, teil: [], tb: 0, ty: 0, nb: 0, ny: 0,
           flecken: _N9K_FLECKEN.map(() => 0), fest: 0, grau: 0, tropfen: [], fuenf: -1,
           ev: {}, fx: { teile: [] }, zeitlupe: null, letzt: '' };
  // Das Blutgefäß ist schon beim Öffnen voll – drei Sekunden Blutstrom vorweg
  for (let i = 0; i < 190; i++) _n9kTeilchen(0.016);
}

// ── Bedienung ──────────────────────────────────────────
function _n9kRuhe() {
  const z = _n9k;
  z.phase = 'ruhe'; z.s = -1;
  z.teil = z.teil.filter(p => p.weg === 'H');
  z.flecken = _N9K_FLECKEN.map(() => 0); z.fest = 0; z.grau = 0;
  z.tropfen = []; z.fuenf = -1; z.ev = {}; z.fx = { teile: [] }; z.zeitlupe = null;
}
function _n9kGruppe(g) {
  if (!_n9k || _N9K_GRUPPEN.indexOf(g) < 0) return;
  _n9k.bg = g;
  _n9kRuhe();
  _n9kStatus();
}
function _n9kEinsetzen() {
  if (!_n9k || _n9k.phase === 'lauf') return;
  _n9kRuhe();
  _n9k.phase = 'lauf'; _n9k.s = 0;
  _n9kStatus();
}
function _n9kNeu() {
  if (!_n9k) return;
  _n9k.bg = 'A';
  _n9kRuhe();
  _n9kStatus();
}

// ── Zeit, Harn, Anzeige ────────────────────────────────
// Minuten seit dem Anschluss (Kommazahl, 0 … 60)
function _n9kMinGlatt() {
  const z = _n9k;
  if (z.phase === 'fertig') return 60;
  if (z.phase !== 'lauf' || z.s < _N9K_ANSCHLUSS) return 0;
  return Math.min(60, (z.s - _N9K_ANSCHLUSS) / _N9K_STUNDE * 60);
}
function _n9kMinute() { return Math.min(60, Math.floor(_n9kMinGlatt() + 1e-9)); }
function _n9kMl() { return _n9kAngriff(_n9k.bg) ? 0 : _n9kMinute() * _N9K_ML_JE_MIN; }
function _n9kZeilen() {
  const z = _n9k, an = _n9kAngriff(z.bg);
  if (z.phase === 'ruhe') return ['Die neue Niere liegt in der Kühlbox.', 'Zeit: 0 min · Harn: 0 ml'];
  if (z.phase === 'lauf' && z.s < _N9K_ANSCHLUSS) return ['Die neue Niere wird eingesetzt.', 'Zeit: 0 min · Harn: 0 ml'];
  const min = _n9kMinute(), ml = _n9kMl();
  let st = 'Opas Blut fließt durch die neue Niere.';
  if (an && z.fest >= 1) st = 'Die Niere wird angegriffen.';
  if (!an && ml >= 1) st = 'Die Niere arbeitet.';
  const harn = z.phase === 'fertig' ? 'Harn in 1 Stunde: ' + ml + ' ml'
                                    : 'Zeit: ' + min + ' min · Harn: ' + ml + ' ml';
  return [st, harn];
}
function _n9kHinweis() {
  // Der Hinweis nennt die Blutgruppe immer mit: Statuszeile und Zähler sind bei
  // B und AB (und bei A und 0) wortgleich, und simfakten.js legt gleiche
  // Ablesungen zusammen – ohne den Namen fehlten AB und 0 im Dump.
  const z = _n9k, bg = 'Blutgruppe „' + z.bg + '“';
  if (z.phase === 'lauf') return 'Niere mit ' + bg + ': Eine Stunde läuft im Zeitraffer. Sieh genau auf die neue Niere und auf die Harnblase.';
  if (z.phase === 'fertig') return 'Niere mit ' + bg + ': Die Stunde ist um. Trage dein Ergebnis in die Tabelle ein. Stelle dann eine andere Blutgruppe ein.';
  return bg + ' ist eingestellt. Drücke „▶ Niere einsetzen“.';
}
function _n9kStatus() {
  if (!_n9k) return;
  const zl = _n9kZeilen();
  _n9k.letzt = zl.join('|') + '|' + _n9k.phase;
  const el = document.getElementById('_n9k-status');
  if (el) { el.textContent = zl[0]; el.className = 'lmp-status on'; }
  const h = document.getElementById('_n9k-harn');
  if (h) { h.textContent = zl[1]; h.className = 'lmp-status on'; }
  const hw = document.getElementById('_n9k-hinweis');
  if (hw) hw.textContent = _n9kHinweis();
  try {
    document.querySelectorAll('[data-n9k]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9k') === _n9k.bg);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9k-los');
  if (los && los.classList) los.classList.toggle('primary', _n9k.phase !== 'lauf');
}
function _n9kHTML() {
  const k = g => `<button class="sim-btn" data-n9k="${g}" onclick="_n9kGruppe('${g}')">${g}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welche neue Niere arbeitet in Opas Körper?</h3>
    <div class="fpm-note" style="margin-top:2px">Opa bekommt die Niere eines anderen Menschen. Opas Blut fließt dann durch die neue Niere. Eine Niere bildet Harn. Der Harn fließt in die Harnblase.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9k-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9k-los" onclick="_n9kEinsetzen()">▶ Niere einsetzen</button>
          <button class="sim-btn" onclick="_n9kNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Blutgruppe der neuen Niere</span>
          <div class="sim-btn-row">${_N9K_GRUPPEN.map(k).join('')}</div>
        </div>
        <div class="lmp-status on" id="_n9k-status" style="margin-top:8px"></div>
        <div class="lmp-status on" id="_n9k-harn" style="margin-top:6px"></div>
        <div class="fpm-note" id="_n9k-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Die kleinen blauen Y-Teilchen schwimmen immer in Opas Blut. Opa nimmt jeden Tag seine Medikamente.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Blutgruppe der neuen Niere „A“ &nbsp;|&nbsp; Eine Stunde dauert im Zeitraffer etwa 5 Sekunden.</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9kUpdate(dt) {
  if (!_n9k) return;
  dt = _bioFxDt(dt);
  const z = _n9k;
  z.t += dt;
  const ds = dt * _bioFxZeitlupeFaktor(z, dt);
  if (z.phase === 'lauf') {
    z.s += ds;
    if (z.s >= _N9K_ENDE) { z.s = _N9K_ENDE; z.phase = 'fertig'; _n9kSchluss(); }
  }
  _n9kTeilchen(ds);
  _n9kHarn(ds);
  const ziel = _n9kAngriff(z.bg) ? Math.min(1, z.fest / _N9K_GRAU_BEI) : 0;
  z.grau += (ziel - z.grau) * Math.min(1, dt * 4);
  if (_n9kZeilen().join('|') + '|' + z.phase !== z.letzt) _n9kStatus();
  _bioFxAlleUpdate(z.fx, dt);
}
// Wie weit Blutgefäße und Schlauch zur neuen Niere schon reichen (0 … 1)
function _n9kAnschluss() {
  const z = _n9k;
  if (z.phase === 'fertig') return 1;
  if (z.phase !== 'lauf') return 0;
  return _bioFxKlemme((z.s - _N9K_FLUG) / (_N9K_ANSCHLUSS - _N9K_FLUG));
}
// Blutkörperchen und Y-Teilchen: entstehen oben, fließen nach unten.
// Am Abzweig entscheidet sich, wer durch die neue Niere fließt.
function _n9kTeilchen(dt) {
  const z = _n9k;
  z.tb += dt;
  while (z.tb >= _N9K_DT_BLUT) { z.tb -= _N9K_DT_BLUT; z.teil.push({ art: 'blut', weg: 'H', d: 0, nr: z.nb++, ent: false }); }
  z.ty += dt;
  while (z.ty >= _N9K_DT_Y) { z.ty -= _N9K_DT_Y; z.ny++; z.teil.push({ art: 'y', weg: 'H', d: 0, nr: z.ny, ph: (z.ny * 2.39) % 6.283, ent: false }); }
  const offen = _n9kAnschluss() >= 1, an = _n9kAngriff(z.bg);
  for (let i = z.teil.length - 1; i >= 0; i--) {
    const p = z.teil[i];
    p.d += _N9K_TEMPO * dt;
    if (!p.ent && p.d >= _N9K_D1) {
      p.ent = true;
      if (offen) {
        if (p.art === 'blut') { if (p.nr % 3 === 0) p.weg = 'N'; }
        else if (an) {
          const k = z.flecken.indexOf(0);
          if (k >= 0) { p.weg = 'S'; p.spot = k; z.flecken[k] = 1; }
        } else p.weg = 'N';
      }
    }
    const L = p.weg === 'S' ? _N9K_WEG_S[p.spot].L : p.weg === 'N' ? _N9K_WEG_N.L : _N9K_WEG_H.L;
    if (p.d >= L) {
      z.teil.splice(i, 1);
      if (p.weg === 'S') _n9kAngeheftet(p.spot);
    }
  }
}
function _n9kAngeheftet(k) {
  const z = _n9k, f = _N9K_FLECKEN[k];
  z.flecken[k] = 2; z.fest++;
  _bioFxWelle(z.fx.teile, _N9K_NX + f[0], _N9K_NY + f[1], '#60a5fa', 9);
  if (z.fest === 1) _bioFxZeitlupe(z, 0.35, 0.9);
  if (z.fest === _N9K_GRAU_BEI) _bioFxWelle(z.fx.teile, _N9K_NX, _N9K_NY, '#94a3b8', 40);
}
// Harn: alle 5 Minuten startet ein Tropfen; nur wenn die Niere arbeitet
function _n9kHarn(dt) {
  const z = _n9k;
  if (z.phase === 'lauf' && z.s >= _N9K_ANSCHLUSS && !_n9kAngriff(z.bg)) {
    const f = Math.floor(_n9kMinGlatt() / 5 + 1e-9);
    if (f > z.fuenf && f < 12) { z.fuenf = f; z.tropfen.push({ d: 0 }); }
  }
  for (let i = z.tropfen.length - 1; i >= 0; i--) {
    const tr = z.tropfen[i];
    tr.d += _N9K_TROPFEN_TEMPO * dt;
    if (tr.d >= _N9K_LEITER.L) {
      z.tropfen.splice(i, 1);
      if (!z.ev.tropfen) {
        z.ev.tropfen = true;
        _bioFxZeitlupe(z, 0.35, 0.9);
        _bioFxWelle(z.fx.teile, _N9K_BX, _N9K_BY, '#facc15', 26);
      } else _bioFxWelle(z.fx.teile, _N9K_BX, _N9K_BY, '#fde047', 12);
    }
  }
}
function _n9kSchluss() {
  const z = _n9k, fx = z.fx.teile, zb = _N9K_ZB;
  if (_n9kAngriff(z.bg)) {
    _bioFxWelle(fx, _N9K_NX, _N9K_NY, '#94a3b8', 34);
    _bioFxWelle(fx, zb.x + 40, zb.y + zb.h - 10, '#94a3b8', 22);
  } else {
    _bioFxWelle(fx, _N9K_BX, _N9K_BY, '#facc15', 30);
    _bioFxWelle(fx, zb.x + 40, zb.y + zb.h - 10, '#facc15', 22);
  }
}

// ── Zeichnen ───────────────────────────────────────────
function _n9kMisch(a, b, g) {
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * g)).join(',') + ')';
}
// Wo die Niere gerade ist: in der Kühlbox, unterwegs oder im Bauch
function _n9kNierePos() {
  const z = _n9k;
  if (z.phase === 'ruhe') return { x: _N9K_KX, y: _N9K_KY + Math.sin(z.t * 1.6) * 0.8, u: 0 };
  const u = z.phase === 'fertig' ? 1 : _bioFxEase.sanft(_bioFxKlemme(z.s / _N9K_FLUG)), v = 1 - u;
  const cx = 270, cy = 85;
  return { x: v * v * _N9K_KX + 2 * v * u * cx + u * u * _N9K_NX,
           y: v * v * _N9K_KY + 2 * v * u * cy + u * u * _N9K_NY, u };
}
function _n9kKoerper(ctx) {
  const c = _N9K_CX;
  const rumpf = () => {
    ctx.beginPath();
    ctx.moveTo(c - 7, 62); ctx.lineTo(c + 7, 62); ctx.lineTo(c + 8, 76);
    ctx.bezierCurveTo(c + 22, 80, c + 50, 80, c + 64, 86);
    ctx.quadraticCurveTo(c + 79, 90, c + 79, 108);
    ctx.bezierCurveTo(c + 78, 130, c + 66, 150, c + 64, 168);
    ctx.bezierCurveTo(c + 62, 190, c + 74, 214, c + 74, 254);
    ctx.lineTo(c - 74, 254);
    ctx.bezierCurveTo(c - 74, 214, c - 62, 190, c - 64, 168);
    ctx.bezierCurveTo(c - 66, 150, c - 78, 130, c - 79, 108);
    ctx.quadraticCurveTo(c - 79, 90, c - 64, 86);
    ctx.bezierCurveTo(c - 50, 80, c - 22, 80, c - 8, 76);
    ctx.closePath();
  };
  const arme = () => {
    ctx.beginPath();
    ctx.moveTo(c + 83, 110); ctx.lineTo(c + 95, 212);
    ctx.moveTo(c - 83, 110); ctx.lineTo(c - 95, 212);
  };
  const kopf = () => { ctx.beginPath(); ctx.arc(c, 49, 15, 0, 2 * Math.PI); };
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // erst alle Ränder, dann alle Flächen: ein einziger Umriss ohne Innenlinien
  ctx.strokeStyle = '#a8b3c2';
  ctx.lineWidth = 3; rumpf(); ctx.stroke(); kopf(); ctx.stroke();
  ctx.lineWidth = 23; arme(); ctx.stroke();
  ctx.fillStyle = '#e5e9ef'; ctx.strokeStyle = '#e5e9ef';
  rumpf(); ctx.fill(); kopf(); ctx.fill();
  ctx.lineWidth = 20; arme(); ctx.stroke();
  ctx.restore();
}
function _n9kBlase(ctx) {
  const ml = _n9kAngriff(_n9k.bg) ? 0 : _n9kMinGlatt() * _N9K_ML_JE_MIN;
  const f = 0.85 * Math.min(60, ml) / 60;
  ctx.save();
  ctx.fillStyle = '#fefce8';
  ctx.beginPath(); ctx.ellipse(_N9K_BX, _N9K_BY, _N9K_BRX, _N9K_BRY, 0, 0, 2 * Math.PI); ctx.fill();
  if (f > 0.005) {
    // Füllung als Ellipsenstück unterhalb des Pegels (ohne clip)
    const yl = _N9K_BY + _N9K_BRY - f * 2 * _N9K_BRY;
    const th = Math.asin(Math.max(-1, Math.min(1, (yl - _N9K_BY) / _N9K_BRY)));
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.ellipse(_N9K_BX, _N9K_BY, _N9K_BRX, _N9K_BRY, 0, th, Math.PI - th, false); ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(_N9K_BX, _N9K_BY, _N9K_BRX, _N9K_BRY, 0, 0, 2 * Math.PI); ctx.stroke();
  ctx.restore();
}
// Teilstück einer Polylinie bis zum Anteil a zeichnen
function _n9kStueck(ctx, pts, a) {
  const lin = _n9kLinie(pts), dE = lin.L * a;
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    if (lin.c[i] <= dE) ctx.lineTo(pts[i][0], pts[i][1]);
    else { const q = _n9kAuf(lin, dE); ctx.lineTo(q.x, q.y); break; }
  }
}
function _n9kSchlauch(ctx, c) {
  if (c <= 0) return;
  const pts = _N9K_LEITER.p;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 5; _n9kStueck(ctx, pts, c); ctx.stroke();
  const gelb = !_n9kAngriff(_n9k.bg) && (_n9k.phase === 'fertig' || (_n9k.phase === 'lauf' && _n9k.s > _N9K_ANSCHLUSS + 0.3));
  ctx.strokeStyle = gelb ? '#fde68a' : '#fdf6e3'; ctx.lineWidth = 2.8; _n9kStueck(ctx, pts, c); ctx.stroke();
  ctx.restore();
}
function _n9kGefaess(ctx, c) {
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const haupt = _N9K_WEG_H.p.slice(0, -1);
  const zug = (pts, lw1, lw2, a) => {
    ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = lw1; _n9kStueck(ctx, pts, a); ctx.stroke();
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = lw2; _n9kStueck(ctx, pts, a); ctx.stroke();
  };
  zug(haupt, 11, 8, 1);
  if (c > 0) {
    zug([_N9K_J1, _N9K_HIN], 7, 4.5, c);
    zug([_N9K_J2, _N9K_HAUS], 7, 4.5, c);
  }
  ctx.restore();
}
function _n9kNierePfad(ctx, x, y) {
  ctx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const th = i / 60 * 2 * Math.PI, dd = th - Math.PI;
    const e = 0.32 * Math.exp(-(dd * dd) / 0.2);          // Einbuchtung zum Blutgefäß hin
    const px = x + _N9K_A * Math.cos(th) * (1 - e), py = y + _N9K_B * Math.sin(th);
    if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
  }
  ctx.closePath();
}
function _n9kNiere(ctx, x, y, g) {
  ctx.save();
  _n9kNierePfad(ctx, x, y);
  ctx.fillStyle = _n9kMisch([220, 38, 38], [156, 163, 175], g); ctx.fill();
  ctx.strokeStyle = _n9kMisch([127, 29, 29], [75, 85, 99], g); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.beginPath(); ctx.ellipse(x + 6, y - 9, 4.5, 9, 0.2, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
// Ein Y-Teilchen: Arme zeigen in Richtung w, weißer Rand für den Kontrast
function _n9kY(ctx, x, y, w, k) {
  const arm = 4.2 * k, stiel = 4.6 * k, sp = 0.55;
  const sx = x - stiel * Math.cos(w), sy = y - stiel * Math.sin(w);
  const a1x = x + arm * Math.cos(w - sp), a1y = y + arm * Math.sin(w - sp);
  const a2x = x + arm * Math.cos(w + sp), a2y = y + arm * Math.sin(w + sp);
  const zug = () => { ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(x, y); ctx.lineTo(a1x, a1y); ctx.moveTo(x, y); ctx.lineTo(a2x, a2y); };
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.8 * k; zug(); ctx.stroke();
  ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 1.9 * k; zug(); ctx.stroke();
  ctx.restore();
}
function _n9kTeilchenMalen(ctx) {
  const z = _n9k, t = z.t;
  ctx.save();
  for (const p of z.teil) {
    const lin = p.weg === 'S' ? _N9K_WEG_S[p.spot] : p.weg === 'N' ? _N9K_WEG_N : _N9K_WEG_H;
    const q = _n9kAuf(lin, p.d);
    if (q.y > 252) continue;
    const a = Math.min(1, p.d / 10);
    if (p.art === 'blut') {
      ctx.globalAlpha = 0.9 * a;
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath(); ctx.arc(q.x, q.y, 2.1, 0, 2 * Math.PI); ctx.fill();
    } else {
      ctx.globalAlpha = a;
      _n9kY(ctx, q.x, q.y, q.w + 0.35 * Math.sin(t * 3 + p.ph), 0.9);
    }
  }
  ctx.restore();
}
function _n9kFleckenMalen(ctx) {
  const z = _n9k;
  for (let k = 0; k < _N9K_FLECKEN.length; k++) {
    if (z.flecken[k] !== 2) continue;
    const f = _N9K_FLECKEN[k], x = _N9K_NX + f[0], y = _N9K_NY + f[1];
    _n9kY(ctx, x, y, Math.atan2(y - _N9K_HIN[1], x - _N9K_HIN[0]), 0.95);
  }
}
function _n9kTropfenMalen(ctx) {
  ctx.save();
  ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#a16207'; ctx.lineWidth = 0.8;
  for (const tr of _n9k.tropfen) {
    const q = _n9kAuf(_N9K_LEITER, tr.d);
    ctx.beginPath(); ctx.arc(q.x, q.y, 2.6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
function _n9kKuehlboxHinten(ctx) {
  const b = _N9K_BOX;
  ctx.save();
  ctx.fillStyle = '#cbd5e1';
  _bioFxRundRect(ctx, b.x + 3, b.y - 6, b.w - 6, 9, 3); ctx.fill();
  ctx.restore();
}
function _n9kKuehlboxVorn(ctx) {
  const b = _N9K_BOX;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, b.x, b.y, b.w, b.h, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#93c5fd'; ctx.fillRect(b.x + 1, b.y + 7, b.w - 2, 5);
  ctx.fillStyle = '#cbd5e1';
  _bioFxRundRect(ctx, b.x + b.w / 2 - 11, b.y + 21, 22, 5, 2.5); ctx.fill();
  ctx.restore();
}
// Schild „neue Niere / Blutgruppe …“ über der Kühlbox, Leitlinie zur Niere
function _n9kSchild(ctx, np) {
  const z = _n9k, zeile = 'Blutgruppe ' + z.bg;
  ctx.save();
  ctx.font = '700 13px sans-serif';
  const w = Math.max(96, ctx.measureText(zeile).width + 22), x = _N9K_KX - w / 2, y = 40, h = 33;
  if (np.u > 0.25) {
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(np.x + 13, np.y - 15); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, x, y, w, h, 7); ctx.fill(); ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#475569'; ctx.font = '600 11px sans-serif';
  ctx.fillText('neue Niere', _N9K_KX, y + 13);
  ctx.fillStyle = '#0f172a'; ctx.font = '700 13px sans-serif';
  ctx.fillText(zeile, _N9K_KX, y + 28);
  ctx.restore();
}
// Zähler an der Harnblase
function _n9kZaehler(ctx) {
  const z = _n9k, b = _N9K_ZB, ml = _n9kMl();
  ctx.save();
  ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(_N9K_BX + _N9K_BRX + 2, _N9K_BY + 2); ctx.lineTo(b.x, _N9K_BY + 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, b.x, b.y, b.w, b.h, 8); ctx.fill(); ctx.stroke();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#92400e'; ctx.font = '600 11px sans-serif';
  ctx.fillText('Harnblase', b.x + 10, b.y + 14);
  ctx.fillStyle = '#0f172a'; ctx.font = '700 12px sans-serif';
  ctx.fillText(z.phase === 'fertig' ? 'Harn in 1 Stunde:' : 'Harn bisher:', b.x + 10, b.y + 30);
  ctx.fillStyle = '#a16207'; ctx.font = '700 17px sans-serif';
  ctx.fillText(ml + ' ml', b.x + 10, b.y + 49);
  ctx.restore();
}
function _n9kKopfzeile(ctx) {
  ctx.save();
  // Kasten „Opa: Blutgruppe A“ – bei allen vier Einstellungen gleich
  ctx.font = '700 13px sans-serif';
  const opa = 'Opa: Blutgruppe A', w = ctx.measureText(opa).width + 18;
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, 8, 6, w, 24, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0f172a'; ctx.textAlign = 'left';
  ctx.fillText(opa, 17, 23);
  // Tablettenschachtel „nimmt Medikamente“: Blisterstreifen mit 2 x 3 Tabletten
  const px = 8 + w + 12;
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, px, 8, 30, 20, 4); ctx.fill(); ctx.stroke();
  for (let r = 0; r < 2; r++) for (let q = 0; q < 3; q++) {
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(px + 7 + q * 8, 13.5 + r * 9, 3, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#0f172a'; ctx.font = '600 12px sans-serif';
  ctx.fillText('nimmt Medikamente', px + 40, 23);
  // Zeit mit Balken
  const mg = _n9kMinGlatt();
  ctx.textAlign = 'right'; ctx.font = '700 12px sans-serif'; ctx.fillStyle = '#0f172a';
  ctx.fillText('Zeit: ' + _n9kMinute() + ' min', 412, 18);
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(334, 24, 78, 5);
  ctx.fillStyle = '#64748b'; ctx.fillRect(334, 24, 78 * mg / 60, 5);
  ctx.restore();
}
function _n9kDraw(ctx, cv) {
  if (!_n9k) return;
  const W = cv.width, H = cv.height, z = _n9k;
  const c = _n9kAnschluss(), np = _n9kNierePos();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = _N9K_HG; ctx.fillRect(0, 0, W, H);
  _n9kKoerper(ctx);
  _n9kKuehlboxHinten(ctx);
  _n9kBlase(ctx);
  _n9kSchlauch(ctx, c);
  _n9kGefaess(ctx, c);
  // Blickführung vor dem Start: ruhiger Lichtkranz um die Niere in der Kühlbox
  if (z.phase === 'ruhe') _bioFxLeuchten(ctx, np.x, np.y, 24, z.t, '255,216,77');
  _n9kNiere(ctx, np.x, np.y, z.grau);
  _n9kTeilchenMalen(ctx);
  _n9kFleckenMalen(ctx);
  _n9kTropfenMalen(ctx);
  _n9kKuehlboxVorn(ctx);
  _n9kSchild(ctx, np);
  _n9kZaehler(ctx);
  _n9kKopfzeile(ctx);
  _bioFxAlleDraw(ctx, z.fx);
}
