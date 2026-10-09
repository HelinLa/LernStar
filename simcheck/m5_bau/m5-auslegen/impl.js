
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mu2 „Welche Fläche ist größer?“ (Kennung m5-auslegen,
// Praefix _m6m). Bauplan: arbeitsheft_mathe_foe5/KAPITEL7_PROFIL.md,
// Abschnitt „m5-auslegen (mu2)“.
// Ueberschrift NICHT die Frage der Einheit (sie enthaelt das Lueckenwort
// „Flächeninhalt“), sondern laut Bauplan: „Welcher Teppich bedeckt mehr Platz?“
//
// Was man sieht (Holzboden von oben, hell):
//   links Teppich A – 8 große Plaettchen lang, 2 breit, rostrot, kurze Fransen
//     an den beiden Schmalseiten (links und rechts);
//   rechts daneben Teppich B – 5 lang, 4 breit, gruen. Beide zuerst ohne
//     Raster, Unterkanten auf einer Linie, Beschriftung „Teppich A“ / „Teppich B“
//     ueber dem Teppich in seiner Farbe.
//   Ein großes Plaettchen ist ein hellblaues Quadrat (20 px), ein kleines ein
//     gelbes Quadrat mit halber Seitenlaenge (10 px). Gelegt wird mit 1 px Luft,
//     so scheint die Farbe des Teppichs als Fuge durch – man sieht immer, WELCHER
//     Teppich darunter liegt.
//   Unter jedem Teppich ein Zaehlerschild: Plaettchen-Zeichen (groß bzw. klein
//     gezeichnet) und die Zahl der Plaettchen, die gerade daliegen.
//   Unten links die feste Legende OHNE Text (ein Tablett): ein großes Plaettchen,
//     daneben dieselbe Flaeche aus 2 · 2 kleinen. Von dort fliegen die
//     Plaettchen los (der Bauplan: „von unten links“).
//   Rechts oben der Merkzettel: Ueberschrift „Merkzettel“, darunter je fertig
//     ausgelegtem Teppich eine Zeile „A 16 große“ (Buchstabe in der Farbe des
//     Teppichs, Zahl in der Farbe der Plaettchen), in der Reihenfolge, in der
//     sie fertig wurden, hoechstens vier.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1 = Sprungmarken = Zeilen der Heft-Tabelle (_m6mWahl('…')):
//     „Teppich A, große Plättchen“ · „Teppich B, große Plättchen“ ·
//     „Teppich A, kleine Plättchen“ · „Teppich B, kleine Plättchen“ (frei)
//   Reihe 2: „übereinanderlegen“ (frei, _m6mUeber()) · „noch einmal“
//     (_m6mNochmal(): die letzte Handlung neu abspielen; blass, solange keine
//     war) · „neu“ (_m6mNeu(): beide Teppiche leer, Merkzettel leer).
//
// Bewegung (spielt nach der Sprungmarke SELBST ab, N1: ein Schritt im Heft =
// eine Handlung):
//   Liegen auf dem gewaehlten Teppich schon Plaettchen, verblassen sie (0,3 s).
//   Dann fliegen die Plaettchen einzeln vom Tablett auf den Teppich, Reihe fuer
//   Reihe von unten links (große: alle 0,15 s eins, Flug 0,35 s; kleine: alle
//   0,05 s eins, Flug 0,3 s). Jede fertige Reihe blinkt kurz (0,35 s), das
//   Zaehlerschild springt bei jedem Plaettchen. Ist der Teppich voll, wandert
//   die Zahl als kleines Kaertchen auf den Merkzettel (0,6 s). Der andere
//   Teppich behaelt seine Plaettchen, bis „neu“.
//   „übereinanderlegen“: B gleitet ueber A (0,8 s, untere linke Ecken
//   aufeinander, B hebt sich dabei etwas ab), die ueberstehenden Teile BEIDER
//   Teppiche leuchten orange (1,2 s), dann gleitet B zurueck (0,8 s).
//   Alles ist eine Funktion der Ablaufzeit (_m6mZeiten, _m6mStand,
//   _m6mUeberE): keine Zufallszahl; jede Zahl im Bild kommt aus derselben
//   Rechnung wie die Statuszeilen.
//   Eine neue Handlung (Sprungmarke, „übereinanderlegen“, „noch einmal“, „neu“)
//   bricht eine laufende ab. Was nicht fertig war, gilt nicht: Der Teppich
//   zeigt wieder, was vorher auf ihm lag, und auf den Merkzettel kommt nichts.
//
// Statuszeilen (woertlich, alle mit mehr als 18 Zeichen – simfakten.js):
//   _m6m-wahl        „Ausgelegt wird: Teppich A, große Plättchen“
//                    (Start „Ausgelegt wird: noch nichts“)
//   _m6m-plaettchen  „Plättchen auf Teppich A: 16 große“ – zaehlt hoch, kleine
//                    „Plättchen auf Teppich A: 64 kleine“
//                    (Start „Plättchen: noch keine gelegt“)
//   _m6m-reihen      „Reihen: 2, große Plättchen je Reihe: 8“ – erst, wenn der
//                    Teppich voll ist (sim_plan mu2); davor „Reihen: …,
//                    große Plättchen je Reihe: …“ (Start „Reihen: noch keine gelegt“)
//   _m6m-merk        „Merkzettel: A 16 große, B 20 große“ (fuellt sich in der
//                    Reihenfolge des Fertigwerdens; Start „Merkzettel: noch leer“)
//   _m6m-ueber       nur nach „übereinanderlegen“ (sonst leer und versteckt):
//                    „Übereinander: …“, sobald B auf A liegt
//                    „Übereinander: A und B stehen beide über.“
//   Wird nach einer abgebrochenen Handlung nichts Neues fertig, zeigen
//   _m6m-wahl/-plaettchen/-reihen den zuletzt FERTIG ausgelegten Teppich.
//
// Werte (nachgerechnet, simcheck/werte.js):
//   Teppich A, große Plättchen  → 2 Reihen zu je 8,  16 große
//   Teppich B, große Plättchen  → 4 Reihen zu je 5,  20 große
//   Teppich A, kleine Plättchen → 4 Reihen zu je 16, 64 kleine
//   Teppich B, kleine Plättchen → 8 Reihen zu je 10, 80 kleine (frei)
//   Dauer bis zum Merkzettel: 3,5 s · 4,1 s · 4,35 s · 5,15 s.
// Start: zwei Teppiche, noch keine Plaettchen.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Sobald „A 16 große“ UND
// „B 20 große“ beide auf dem Merkzettel stehen – also wenn das Kaertchen des
// zweiten der beiden landet –, ein Lichtring um Teppich B und einer um die
// „20“ auf dem Merkzettel; B und die „20“ leuchten 2,6 s nach. Einmal je
// Ablauf (jede fertige Sprungmarke „… große Plättchen“, solange beide dastehen).
// Das widerlegt „A ist länger, also größer“: der kuerzere Teppich hat mehr.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen, Container fpm-lehrkraft fuer
// simfakten.js): eigene Knopfzeile UNTER den Heftknoepfen, davor klein
// „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6mAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links auf der Leinwand (Stelle wie in m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6mTempo()): ein Drittel so schnell.
//   „Zahlen verdecken: aus“ ↔ „… an“ (_m6mVerdecken()): verdeckt Zaehler und
//     Merkzettel (Zaehlerschilder, Kaertchen und Merkzettel zeigen „?“, die
//     Statuszeilen „verdeckt“) bis zum Aufdecken – zum Schaetzen an der Tafel.
//   Eine Sprungmarke, „übereinanderlegen“, „noch einmal“ oder „neu“ heben die
//   Pause auf; Tempo und Verdecken bleiben stehen.
//   Das wechselnde Wort steht in einem eigenen <span>.
// Hinweiszeile _m6m-lehrkraft (in der Pause „lmp-status off“) nennt immer die
// Einstellung: „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal,
// Zahlen: sichtbar.“ Voreinstellung: Zeitfaktor 1.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Flächeninhalt“,
// „größer“, „kleiner“, „4 kleine“ als Satz („so viel wie“), die Regel als
// Satz. Die Legende zeigt 1 großes = 2 · 2 kleine nur als Bild. Keine Namen,
// keine Punkte, keine Zeitmessung.
// ════════════════════════════════════════════════════════════════════════
let _m6m = null;
const _m6mK = {
  S: 20,                                   // Seitenlaenge eines großen Plaettchens (px)
  // Teppiche in Ruhelage: linke Kante, Unterkante, Laenge und Breite in großen Plaettchen
  A: { x0: 18, y1: 170, sp: 8, re: 2 },
  B: { x0: 204, y1: 170, sp: 5, re: 4 },
  FR: 5,                                   // Fransen von A
  ZY: 190,                                 // Mitte der Zaehlerschilder
  // Legende (Tablett) unten links; Ecke des großen Plaettchens, Ecke der 2 · 2 kleinen
  TX0: 10, TY0: 210, TX1: 84, TY1: 244, LGX: 18, LKX: 54, LY: 217,
  // Merkzettel rechts oben; Grundlinie der ersten Zeile, Zeilenabstand
  MX0: 316, MY0: 10, MX1: 412, MY1: 116, MZ0: 42, MZD: 19,
  // Zeiten in s
  T_WEG: 0.3, STAG_G: 0.15, STAG_K: 0.05, FLUG_G: 0.35, FLUG_K: 0.3,
  T_KARTE: 0.6, T_BLINK: 0.35, T_RAEUMEN: 0.35,
  T_HIN: 0.8, T_HALT: 1.2, T_ZURUECK: 0.8,
  // Farben
  ROT: '#a8432a', ROT_H: '#c96a48', FRANSE: '#d9946f',
  GRUEN: '#2f7d4f', GRUEN_H: '#4f9e6c',
  GROSS: '#bfdbfe', GROSS_R: '#2563eb', GROSS_T: '#1d4ed8',
  KLEIN: '#fde68a', KLEIN_R: '#ca8a04', KLEIN_T: '#a16207',
  ORANGE: '#f97316', TINTE: '#0f172a', GRAU: '#64748b'
};
const _m6mWAHL = {
  ag: { tep: 'A', gr: 'gross', text: 'Teppich A, große Plättchen' },
  bg: { tep: 'B', gr: 'gross', text: 'Teppich B, große Plättchen' },
  ak: { tep: 'A', gr: 'klein', text: 'Teppich A, kleine Plättchen' },
  bk: { tep: 'B', gr: 'klein', text: 'Teppich B, kleine Plättchen' }
};
const _m6mREIHE = ['ag', 'bg', 'ak', 'bk'];

// ── Mass und Orte ────────────────────────────────────────────────────────
// Plaettchen je Reihe (sp), Reihen (re), zusammen (n), Seitenlaenge (s).
function _m6mMass(tep, gr) {
  const T = _m6mK[tep], k = gr === 'gross' ? 1 : 2;
  return { sp: T.sp * k, re: T.re * k, n: T.sp * T.re * k * k, s: _m6mK.S / k };
}
function _m6mRahmen(tep, dx) {
  const K = _m6mK, T = K[tep], x0 = T.x0 + (dx || 0);
  return { x0, x1: x0 + T.sp * K.S, y0: T.y1 - T.re * K.S, y1: T.y1 };
}
// Mitte des i-ten Plaettchens: Reihe fuer Reihe von unten links.
function _m6mPlatz(tep, gr, i, dx) {
  const m = _m6mMass(tep, gr), R = _m6mRahmen(tep, dx);
  const r = Math.floor(i / m.sp), c = i % m.sp;
  return { x: R.x0 + (c + 0.5) * m.s, y: R.y1 - (r + 0.5) * m.s };
}
function _m6mQuelle(gr) {
  const K = _m6mK;
  return { x: (gr === 'gross' ? K.LGX : K.LKX) + K.S / 2, y: K.LY + K.S / 2 };
}
function _m6mZeileY(j) { return _m6mK.MY0 + _m6mK.MZ0 + j * _m6mK.MZD; }

// ── Ablauf: alles aus der Ablaufzeit ─────────────────────────────────────
function _m6mZeiten(L) {
  const K = _m6mK, W = _m6mWAHL[L.key], m = _m6mMass(W.tep, W.gr);
  const stag = W.gr === 'gross' ? K.STAG_G : K.STAG_K;
  const flug = W.gr === 'gross' ? K.FLUG_G : K.FLUG_K;
  const tLeg = K.T_WEG + (m.n - 1) * stag + flug;
  return { W, m, stag, flug, tLeg, tEnde: tLeg + K.T_KARTE,
           start: i => K.T_WEG + i * stag, land: i => K.T_WEG + i * stag + flug };
}
function _m6mStand(L) {
  const T = _m6mZeiten(L);
  let gelegt = 0;
  for (let i = 0; i < T.m.n; i++) if (L.at >= T.land(i) - 1e-9) gelegt++;
  return { gelegt, reihen: Math.floor(gelegt / T.m.sp), fertig: L.at >= T.tEnde - 1e-9 };
}
// Wie weit B beim Uebereinanderlegen unterwegs ist (0 = zu Hause, 1 = auf A).
function _m6mUeberE(z) {
  if (!z.ueber) return 0;
  const K = _m6mK, at = z.ueber.at, E = _bioFxEase.sanft;
  if (at < K.T_HIN) return E(at / K.T_HIN);
  if (at < K.T_HIN + K.T_HALT) return 1;
  return 1 - E(_bioFxKlemme((at - K.T_HIN - K.T_HALT) / K.T_ZURUECK));
}
function _m6mUeberGlanz(z) {
  if (!z.ueber) return 0;
  const K = _m6mK, at = z.ueber.at;
  if (at < K.T_HIN) return 0;
  if (at < K.T_HIN + 0.2) return (at - K.T_HIN) / 0.2;
  if (at < K.T_HIN + K.T_HALT) return 1;
  return Math.max(0, 1 - (at - K.T_HIN - K.T_HALT) / 0.25);
}

function _m6mInit() {
  _m6m = { t: 0, lauf: null, ueber: null, raeumen: null,
           belegt: { A: null, B: null },    // was in Ruhe auf dem Teppich liegt
           zuletzt: null, letzte: null,     // zuletzt FERTIG ausgelegt · zuletzt gedrueckt
           merk: [], merkAlter: {},
           ahaGlanz: 0, fx: { teile: [] },
           pause: false, langsam: false, verdeckt: false };   // Lehrkraft-Einstellungen
}
function _m6mHTML() {
  const marke = k => `<button class="sim-btn" id="_m6m-b-${k}" onclick="_m6mWahl('${k}')">${_m6mWAHL[k].text}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welcher Teppich bedeckt mehr Platz?</h3>
    <div class="fpm-note" style="margin-top:2px">Alle großen Plättchen sind gleich groß. Alle kleinen auch.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6m-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6mREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6m-ueberknopf" onclick="_m6mUeber()">übereinanderlegen</button>
          <button class="sim-btn" id="_m6m-nochmal" onclick="_m6mNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m6mNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6m-pause" onclick="_m6mAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6m-tempo" onclick="_m6mTempo()">Tempo: <span id="_m6m-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6m-verdeckt" onclick="_m6mVerdecken()">Zahlen verdecken: <span id="_m6m-verdeckt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6m-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6m-wahl" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6m-plaettchen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6m-reihen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6m-merk" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6m-ueber" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: zwei Teppiche, noch keine Plättchen</p>
  </div>`;
}
function _m6mSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6mWort(gr) { return gr === 'gross' ? 'große' : 'kleine'; }
function _m6mFarbeT(gr) { return gr === 'gross' ? _m6mK.GROSS_T : _m6mK.KLEIN_T; }
function _m6mStatus() {
  if (!_m6m) return;
  const z = _m6m, K = _m6mK, zu = z.verdeckt;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  // Angezeigt wird der laufende Teppich, sonst der zuletzt FERTIG ausgelegte.
  const key = z.lauf ? z.lauf.key : z.zuletzt, W = key ? _m6mWAHL[key] : null;
  _m6mSetze('_m6m-wahl', 'Ausgelegt wird: ' + (W ? W.text : 'noch nichts'));
  if (!W) {
    _m6mSetze('_m6m-plaettchen', 'Plättchen: noch keine gelegt');
    _m6mSetze('_m6m-reihen', 'Reihen: noch keine gelegt');
  } else {
    const m = _m6mMass(W.tep, W.gr), st = z.lauf ? _m6mStand(z.lauf) : { gelegt: m.n, reihen: m.re };
    const wort = _m6mWort(W.gr), farbe = _m6mFarbeT(W.gr), voll = st.gelegt >= m.n;
    _m6mSetze('_m6m-plaettchen', 'Plättchen auf Teppich ' + W.tep + ': ' +
      (zu ? 'verdeckt' : f(st.gelegt + ' ' + wort, farbe)));
    // Reihen erst, wenn der Teppich voll ist (sim_plan mu2); davor „…“.
    _m6mSetze('_m6m-reihen', 'Reihen: ' + (zu ? 'verdeckt'
      : (voll ? f(m.re, K.TINTE) : '…') + ', ' + wort + ' Plättchen je Reihe: ' +
        (voll ? f(m.sp, farbe) : '…')));
  }
  _m6mSetze('_m6m-merk', 'Merkzettel: ' + (!z.merk.length ? 'noch leer' : zu ? 'verdeckt'
    : z.merk.map(e => {
        const V = _m6mWAHL[e.key];
        return V.tep + ' ' + f(e.n + ' ' + _m6mWort(V.gr), _m6mFarbeT(V.gr));
      }).join(', ')));
  const ue = _m6mSetze('_m6m-ueber', z.ueber
    ? 'Übereinander: ' + (z.ueber.at >= K.T_HIN ? f('A und B stehen beide über.', '#c2410c') : '…')
    : '');
  if (ue && ue.style) ue.style.display = z.ueber ? '' : 'none';
  // Knoepfe: die zuletzt gedrueckte Handlung hervorheben, „noch einmal“ blass ohne Handlung
  _m6mREIHE.forEach(k => {
    const b = document.getElementById('_m6m-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.letzte);
  });
  const ub = document.getElementById('_m6m-ueberknopf');
  if (ub && ub.classList) ub.classList.toggle('primary', z.letzte === 'ueber');
  const nm = document.getElementById('_m6m-nochmal');
  if (nm) { nm.disabled = !z.letzte; if (nm.style) nm.style.opacity = z.letzte ? '' : '0.45'; }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6mSetze('_m6m-pause', z.pause ? 'weiter' : 'Pause');
  _m6mSetze('_m6m-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6mSetze('_m6m-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6mSetze('_m6m-lehrkraft', _m6mHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6m-pause', z.pause], ['_m6m-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6mHinweis() {
  const z = _m6m;
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Zahlen: ' + (z.verdeckt ? 'verdeckt' : 'sichtbar') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Jede Handlung bricht eine laufende ab; was nicht fertig war, gilt nicht.
function _m6mAbbrechen() {
  const z = _m6m;
  z.lauf = null; z.ueber = null; z.raeumen = null;
  z.ahaGlanz = 0; z.pause = false;          // neu anfangen hebt die Pause auf
}
function _m6mWahl(key) {
  if (!_m6m || !_m6mWAHL[key]) return;
  const z = _m6m;
  _m6mAbbrechen();
  z.lauf = { key, at: 0, alt: z.belegt[_m6mWAHL[key].tep] };
  z.letzte = key;
  _m6mStatus();
}
function _m6mUeber() {
  if (!_m6m) return;
  const z = _m6m;
  _m6mAbbrechen();
  z.ueber = { at: 0, fertig: false };
  z.letzte = 'ueber';
  _m6mStatus();
}
function _m6mNochmal() {
  if (!_m6m || !_m6m.letzte) return;
  if (_m6m.letzte === 'ueber') _m6mUeber(); else _m6mWahl(_m6m.letzte);
}
function _m6mNeu() {
  if (!_m6m) return;
  const z = _m6m;
  _m6mAbbrechen();
  if (z.belegt.A || z.belegt.B) z.raeumen = { at: 0, A: z.belegt.A, B: z.belegt.B };
  z.belegt = { A: null, B: null };
  z.zuletzt = null; z.letzte = null;
  z.merk = []; z.merkAlter = {};
  _m6mStatus();
}
// Ein Teppich ist voll und das Kaertchen ist auf dem Merkzettel angekommen.
function _m6mFertig() {
  const z = _m6m, K = _m6mK, L = z.lauf, W = _m6mWAHL[L.key], m = _m6mMass(W.tep, W.gr);
  z.belegt[W.tep] = W.gr;
  z.zuletzt = L.key;
  if (!z.merk.some(e => e.key === L.key)) z.merk.push({ key: L.key, n: m.n });
  z.merkAlter[L.key] = 0;
  z.lauf = null;
  const da = k => z.merk.some(e => e.key === k);
  if ((L.key === 'ag' || L.key === 'bg') && da('ag') && da('bg')) {
    // Aha: der kuerzere Teppich hat mehr gleich große Plaettchen
    z.ahaGlanz = 2.6;
    const R = _m6mRahmen('B', 0), j = z.merk.findIndex(e => e.key === 'bg');
    _bioFxWelle(z.fx.teile, (R.x0 + R.x1) / 2, (R.y0 + R.y1) / 2, '#f59e0b', 78);
    _bioFxWelle(z.fx.teile, K.MX0 + 34, _m6mZeileY(j) - 5, '#f59e0b', 30);
  }
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6mAnhalten() {
  if (!_m6m) return;
  _m6m.pause = !_m6m.pause;
  _m6mStatus();
}
function _m6mTempo() {
  if (!_m6m) return;
  _m6m.langsam = !_m6m.langsam;
  _m6mStatus();
}
function _m6mVerdecken() {
  if (!_m6m) return;
  _m6m.verdeckt = !_m6m.verdeckt;
  _m6mStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6mZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6mUpdate(dt) {
  if (!_m6m) return;
  const z = _m6m, K = _m6mK;
  dt = _bioFxDt(dt) * _m6mZeitfaktor(z);            // ab hier Sim-Zeit
  z.t += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  for (const k in z.merkAlter) z.merkAlter[k] += dt;
  let neu = false;
  if (z.lauf && dt > 0) {                           // ohne Zeit kein Schritt im Ablauf
    const alt = _m6mStand(z.lauf);
    z.lauf.at += dt;
    const st = _m6mStand(z.lauf);
    if (st.gelegt !== alt.gelegt || st.reihen !== alt.reihen) neu = true;
    if (st.fertig) { _m6mFertig(); neu = true; }
  }
  if (z.ueber && !z.ueber.fertig && dt > 0) {
    const vor = z.ueber.at, ende = K.T_HIN + K.T_HALT + K.T_ZURUECK;
    z.ueber.at = Math.min(ende, vor + dt);
    if (vor < K.T_HIN && z.ueber.at >= K.T_HIN) neu = true;
    if (z.ueber.at >= ende) z.ueber.fertig = true;
  }
  if (z.raeumen && dt > 0) {
    z.raeumen.at += dt;
    if (z.raeumen.at >= K.T_RAEUMEN) z.raeumen = null;
  }
  if (neu) _m6mStatus();
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6mText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m6mK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Ein Plaettchen mit Mitte (cx, cy), Seitenlaenge s, Groesse k (1 = voll), Deckkraft a.
function _m6mPlatte(ctx, cx, cy, s, gr, k, a) {
  if (a <= 0.01 || k <= 0.05) return;
  const K = _m6mK, gross = gr === 'gross', luft = gross ? 1 : 0.7;
  const h = s * k / 2 - luft;
  if (h <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = gross ? K.GROSS : K.KLEIN;
  ctx.strokeStyle = gross ? K.GROSS_R : K.KLEIN_R;
  ctx.lineWidth = gross ? 1.1 : 0.8;
  _bioFxRundRect(ctx, cx - h, cy - h, 2 * h, 2 * h, gross ? 2.5 : 1.5);
  ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Teppich mit Schatten, Borduere, Fransen (A) und Beschriftung; hebt = 0 … 1.
function _m6mTeppich(ctx, tep, dx, hebt) {
  const K = _m6mK, R = _m6mRahmen(tep, dx), w = R.x1 - R.x0, h = R.y1 - R.y0;
  const farbe = tep === 'A' ? K.ROT : K.GRUEN;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,' + (0.13 + 0.07 * hebt).toFixed(3) + ')';
  ctx.fillRect(R.x0 + 2 + 4 * hebt, R.y0 + 3 + 5 * hebt, w, h);
  if (tep === 'A') {                                  // Fransen an den Schmalseiten
    ctx.strokeStyle = K.FRANSE; ctx.lineWidth = 1.3;
    for (let y = R.y0 + 2.5; y < R.y1 - 1; y += 3.5) {
      ctx.beginPath(); ctx.moveTo(R.x0, y); ctx.lineTo(R.x0 - K.FR, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(R.x1, y); ctx.lineTo(R.x1 + K.FR, y); ctx.stroke();
    }
  }
  ctx.fillStyle = farbe;
  ctx.fillRect(R.x0, R.y0, w, h);
  ctx.strokeStyle = tep === 'A' ? K.ROT_H : K.GRUEN_H; ctx.lineWidth = 2;
  ctx.strokeRect(R.x0 + 3.5, R.y0 + 3.5, w - 7, h - 7);   // Borduere
  ctx.restore();
  _m6mText(ctx, 'Teppich ' + tep, R.x0, R.y0 - 10, 12, farbe, 'left');
}
// Was auf einem Teppich liegt: Ruhe, laufendes Auslegen oder Raeumen nach „neu“.
function _m6mBelag(ctx, tep, dx) {
  const z = _m6m, K = _m6mK, L = z.lauf;
  if (L && _m6mWAHL[L.key].tep === tep) {
    const T = _m6mZeiten(L), st = _m6mStand(L), W = T.W;
    if (L.alt) {                                      // was vorher lag, verblasst
      const u = _bioFxKlemme(L.at / K.T_WEG), mA = _m6mMass(tep, L.alt);
      for (let i = 0; i < mA.n; i++) {
        const p = _m6mPlatz(tep, L.alt, i, dx);
        _m6mPlatte(ctx, p.x, p.y, mA.s, L.alt, 1 - 0.3 * u, 1 - u);
      }
    }
    for (let i = 0; i < st.gelegt; i++) {
      const p = _m6mPlatz(tep, W.gr, i, dx);
      _m6mPlatte(ctx, p.x, p.y, T.m.s, W.gr, 1, 1);
    }
    // jede fertige Reihe blinkt kurz
    const R = _m6mRahmen(tep, dx);
    for (let r = 0; r < st.reihen; r++) {
      const u = (L.at - T.land(r * T.m.sp + T.m.sp - 1)) / K.T_BLINK;
      if (u < 0 || u >= 1) continue;
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,' + (0.6 * (1 - u)).toFixed(3) + ')';
      ctx.strokeStyle = _m6mFarbeT(W.gr); ctx.globalAlpha = 1; ctx.lineWidth = 2;
      const y0 = R.y1 - (r + 1) * T.m.s;
      ctx.fillRect(R.x0, y0, R.x1 - R.x0, T.m.s);
      ctx.globalAlpha = 1 - u;
      ctx.strokeRect(R.x0 + 1, y0 + 1, R.x1 - R.x0 - 2, T.m.s - 2);
      ctx.restore();
    }
    return;
  }
  const gr = z.belegt[tep];
  if (gr) {
    const m = _m6mMass(tep, gr);
    for (let i = 0; i < m.n; i++) {
      const p = _m6mPlatz(tep, gr, i, dx);
      _m6mPlatte(ctx, p.x, p.y, m.s, gr, 1, 1);
    }
  }
  if (z.raeumen && z.raeumen[tep]) {
    const u = _bioFxKlemme(z.raeumen.at / K.T_RAEUMEN), g = z.raeumen[tep], m = _m6mMass(tep, g);
    for (let i = 0; i < m.n; i++) {
      const p = _m6mPlatz(tep, g, i, dx);
      _m6mPlatte(ctx, p.x, p.y, m.s, g, 1 - 0.3 * u, 1 - u);
    }
  }
}
// Zaehlerschild unter dem Teppich: Plaettchen-Zeichen und Zahl.
function _m6mZaehlerWert(tep) {
  const z = _m6m, L = z.lauf;
  if (L && _m6mWAHL[L.key].tep === tep) {
    const T = _m6mZeiten(L), st = _m6mStand(L);
    const zuletzt = st.gelegt ? L.at - T.land(st.gelegt - 1) : 9;
    return { n: st.gelegt, gr: T.W.gr, pop: zuletzt };
  }
  if (z.belegt[tep]) return { n: _m6mMass(tep, z.belegt[tep]).n, gr: z.belegt[tep], pop: 9 };
  return null;
}
function _m6mSchild(ctx, cx, cy, n, gr, k, a, rand) {
  const K = _m6mK, w = 56, h = 21, ik = gr === 'gross' ? 12 : 6;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(cx, cy);
  if (k !== 1) ctx.scale(k, k);
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, -w / 2 + 1.5, -h / 2 + 2, w, h, 8); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = rand; ctx.lineWidth = 1.6;
  _bioFxRundRect(ctx, -w / 2, -h / 2, w, h, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = gr === 'gross' ? K.GROSS : K.KLEIN;
  ctx.strokeStyle = gr === 'gross' ? K.GROSS_R : K.KLEIN_R; ctx.lineWidth = 1;
  ctx.fillRect(-w / 2 + 14 - ik / 2, -ik / 2, ik, ik);
  ctx.strokeRect(-w / 2 + 14 - ik / 2, -ik / 2, ik, ik);
  _m6mText(ctx, _m6m.verdeckt ? '?' : String(n), 9, 5, 14, _m6mFarbeT(gr));
  ctx.restore();
}
function _m6mZaehler(ctx, tep, dx, a) {
  if (a <= 0.01) return;
  const K = _m6mK, v = _m6mZaehlerWert(tep);
  if (!v) return;
  const R = _m6mRahmen(tep, dx);
  const k = v.pop < 0.25 ? 1 + 0.12 * Math.sin(Math.PI * v.pop / 0.25) : 1;
  _m6mSchild(ctx, (R.x0 + R.x1) / 2, K.ZY, v.n, v.gr, k, a, tep === 'A' ? K.ROT : K.GRUEN);
}
// Was gerade fliegt: Plaettchen vom Tablett auf den Teppich.
function _m6mFlug(ctx) {
  const z = _m6m, L = z.lauf;
  if (!L) return;
  const T = _m6mZeiten(L), W = T.W, q = _m6mQuelle(W.gr), E = _bioFxEase.sanft;
  for (let i = 0; i < T.m.n; i++) {
    const u = (L.at - T.start(i)) / T.flug;
    if (u < 0 || u >= 1) continue;
    const e = E(u), p = _m6mPlatz(W.tep, W.gr, i, 0);
    const x = q.x + (p.x - q.x) * e, y = q.y + (p.y - q.y) * e - 30 * Math.sin(Math.PI * e);
    _m6mPlatte(ctx, x, y, T.m.s, W.gr, 0.85 + 0.15 * e, Math.min(1, 0.35 + 2 * u));
  }
}
// Das Kaertchen mit der Zahl wandert vom Zaehlerschild auf den Merkzettel.
function _m6mKarte(ctx) {
  const z = _m6m, K = _m6mK, L = z.lauf;
  if (!L) return;
  const T = _m6mZeiten(L);
  if (L.at < T.tLeg) return;
  const e = _bioFxEase.sanft(_bioFxKlemme((L.at - T.tLeg) / K.T_KARTE));
  const R = _m6mRahmen(T.W.tep, 0);
  let j = z.merk.findIndex(m => m.key === L.key);
  if (j < 0) j = Math.min(3, z.merk.length);
  const ax = (R.x0 + R.x1) / 2, ay = K.ZY, bx = K.MX0 + 34, by = _m6mZeileY(j) - 5;
  const x = ax + (bx - ax) * e, y = ay + (by - ay) * e - 28 * Math.sin(Math.PI * e);
  _m6mSchild(ctx, x, y, T.m.n, T.W.gr, 1 - 0.25 * e, 1, T.W.tep === 'A' ? K.ROT : K.GRUEN);
}
// Feste Legende ohne Text: ein großes Plaettchen, daneben 2 · 2 kleine.
function _m6mLegende(ctx) {
  const K = _m6mK, S = K.S, s = S / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.TX0 + 1.5, K.TY0 + 2, K.TX1 - K.TX0, K.TY1 - K.TY0, 8); ctx.fill();
  ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.TX0, K.TY0, K.TX1 - K.TX0, K.TY1 - K.TY0, 8); ctx.fill(); ctx.stroke();
  ctx.restore();
  _m6mPlatte(ctx, K.LGX + S / 2, K.LY + S / 2, S, 'gross', 1, 1);
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 2; c++)
      _m6mPlatte(ctx, K.LKX + (c + 0.5) * s, K.LY + (r + 0.5) * s, s, 'klein', 1, 1);
}
// Merkzettel rechts oben.
function _m6mMerkzettel(ctx) {
  const z = _m6m, K = _m6mK, x0 = K.MX0, y0 = K.MY0, w = K.MX1 - K.MX0, h = K.MY1 - K.MY0;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  ctx.fillRect(x0 + 2, y0 + 3, w, h);
  ctx.fillStyle = '#fffdf2'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
  ctx.fillRect(x0, y0, w, h); ctx.strokeRect(x0, y0, w, h);
  ctx.fillStyle = '#94a3b8';                           // Klammer
  _bioFxRundRect(ctx, x0 + w / 2 - 14, y0 - 4, 28, 8, 3); ctx.fill();
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  for (let j = 0; j < 4; j++) {
    const y = _m6mZeileY(j) + 5;
    ctx.beginPath(); ctx.moveTo(x0 + 6, y); ctx.lineTo(x0 + w - 6, y); ctx.stroke();
  }
  ctx.restore();
  _m6mText(ctx, 'Merkzettel', x0 + 10, y0 + 22, 11, K.GRAU, 'left', '600');
  // Aha: die „20“ leuchtet nach – ein Kaestchen NUR um die Zahl, VOR allen
  // Zeilen gezeichnet, damit es keine Nachbarzeile zudeckt.
  const jb = z.merk.findIndex(e => e.key === 'bg');
  if (z.ahaGlanz > 0 && jb >= 0 && jb < 4) {
    const y = _m6mZeileY(jb), puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.ahaGlanz / 1.2) * (0.6 + 0.4 * puls);
    ctx.fillStyle = 'rgba(252,211,77,0.55)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, x0 + 22, y - 15, 26, 19, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  z.merk.slice(0, 4).forEach((e, j) => {
    const V = _m6mWAHL[e.key], y = _m6mZeileY(j), alter = z.merkAlter[e.key] || 0;
    _m6mText(ctx, V.tep, x0 + 10, y, 13, V.tep === 'A' ? K.ROT : K.GRUEN, 'left');
    const k = alter < 0.3 ? 1 + 0.2 * Math.sin(Math.PI * alter / 0.3) : 1;
    ctx.save();
    ctx.translate(x0 + 44, y - 5); if (k !== 1) ctx.scale(k, k);
    _m6mText(ctx, z.verdeckt ? '?' : String(e.n), 0, 5, 13, _m6mFarbeT(V.gr), 'right');
    ctx.restore();
    _m6mText(ctx, _m6mWort(V.gr), x0 + 49, y, 12, K.TINTE, 'left', '600');
  });
}
// Uebereinanderlegen: die ueberstehenden Teile beider Teppiche leuchten orange.
function _m6mUeberstand(ctx, dxB) {
  const z = _m6m, K = _m6mK, g = _m6mUeberGlanz(z);
  if (g <= 0.01) return;
  const A = _m6mRahmen('A', 0), B = _m6mRahmen('B', dxB);
  const teile = [];
  if (B.x1 < A.x1) teile.push([Math.max(A.x0, B.x1), A.y0, A.x1, A.y1]);   // A steht rechts ueber
  if (B.y0 < A.y0) teile.push([B.x0, B.y0, B.x1, Math.min(B.y1, A.y0)]);   // B steht oben ueber
  const puls = 0.75 + 0.25 * Math.sin(z.t * 5);
  ctx.save();
  for (const [x0, y0, x1, y1] of teile) {
    ctx.globalAlpha = g * puls;
    ctx.fillStyle = 'rgba(249,115,22,0.38)';
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.globalAlpha = g;
    ctx.strokeStyle = K.ORANGE; ctx.lineWidth = 2.5;
    ctx.strokeRect(x0 + 1.25, y0 + 1.25, x1 - x0 - 2.5, y1 - y0 - 2.5);
  }
  ctx.restore();
}
// Aha: B leuchtet nach (pulsierender Rahmen).
function _m6mAhaRahmen(ctx) {
  const z = _m6m;
  if (z.ahaGlanz <= 0) return;
  const R = _m6mRahmen('B', 0), puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
  ctx.save();
  ctx.globalAlpha = Math.min(1, z.ahaGlanz / 1.2) * (0.55 + 0.35 * puls);
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3.5;
  _bioFxRundRect(ctx, R.x0 - 4, R.y0 - 4, R.x1 - R.x0 + 8, R.y1 - R.y0 + 8, 5); ctx.stroke();
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m6mPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6mText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6mDraw(ctx, cv) {
  if (!_m6m) return;
  const z = _m6m, K = _m6mK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);         // heller Holzboden
  bg.addColorStop(0, '#faf6ef'); bg.addColorStop(1, '#f1e9dc');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.strokeStyle = 'rgba(120,85,40,0.07)'; ctx.lineWidth = 1;
  for (let y = 31; y < H; y += 31) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
  const e = _m6mUeberE(z), dxB = e * (K.A.x0 - K.B.x0);
  _m6mTeppich(ctx, 'A', 0, 0);
  _m6mBelag(ctx, 'A', 0);
  _m6mAhaRahmen(ctx);
  _m6mTeppich(ctx, 'B', dxB, e);
  _m6mBelag(ctx, 'B', dxB);
  _m6mUeberstand(ctx, dxB);
  _m6mZaehler(ctx, 'A', 0, 1 - e);
  _m6mZaehler(ctx, 'B', dxB, 1 - e);
  _m6mLegende(ctx);
  _m6mMerkzettel(ctx);
  _m6mFlug(ctx);
  _m6mKarte(ctx);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6mPauseSchild(ctx);
}
