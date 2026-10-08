
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mm1 „Was bedeutet 4 · 6?“ (Kennung m5-punktefeld)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL4_PROFIL.md, Abschnitt m5-punktefeld
// (Einheit mm1; Regeln N1–N3, Lehrkraft-Zeile V3). Ueberschrift = Frage der
// Einheit: „Wie viel ist 4 · 6?“
//
// Was man sieht: ein Blatt Karopapier (Kaestchen 15 px). Darauf das
// Punktefeld: Reihen gleich vieler blauer Punkte, ein Punkt je Kaestchen –
// wie der Ziffernkasten mit „●“ im Heft (V4). Nach dem 5. Punkt einer Reihe
// bleibt ein Kaestchen frei (kleine Luecke), nach der 5. Reihe eine ganze
// Kaestchenzeile (groesserer Abstand). Rechts neben jeder Reihe eine kleine
// Klammer „]“ mit der Anzahl je Reihe. Unter dem Feld die Plusaufgabe
// („6 + 6 + 6 + 6 + 6 = 30“), darunter gross die Malaufgabe („5 · 6 = 30“).
// Blau ist ueberall „Punkte je Reihe“: die Punkte, die Klammerzahl, jeder
// Summand, die zweite Zahl der Malaufgabe. Kommt eine Reihe dazu, leuchten
// sie, ihre Klammerzahl und IHR Summand gleichzeitig bernsteinfarben auf
// (0,9 s) – so sieht man, welcher Summand zu welcher Reihe gehoert.
//
// Bewegung (jede Handlung bewegt sich; Bild und Zahl stimmen in jedem
// Augenblick ueberein – Malaufgabe und Statuszeilen wechseln erst, wenn die
// Bewegung angekommen ist):
//   „− 1 Reihe“    die unterste Reihe hebt sich (0,15 s: kleiner Hub, Schatten
//                  auf dem Papier) und fliegt mit ihrer Klammer nach rechts aus
//                  dem Bild (0,65 s); ihr Summand „+ 6“ blendet dabei aus und
//                  gibt danach seinen Platz frei. Ist die Reihe weg, springt
//                  das Produkt in EINEM Schritt um 6 (federt kurz).
//   „+ 1 Reihe“    eine Reihe gleitet von rechts herein (0,8 s) und setzt sich
//                  unten an; dann erscheint ihr Summand, Reihe und Summand
//                  leuchten, das Produkt springt um die Reihe.
//   „− 1 je Reihe“ in jeder Reihe schrumpft der letzte Punkt und steigt weg
//                  (gestaffelt von oben nach unten), danach ruecken die
//                  Klammern nach (0,7 s); dann aendern sich alle Summanden.
//   „+ 1 je Reihe“ erst ruecken die Klammern zur Seite, dann springt in jeder
//                  Reihe ein Punkt dazu (gestaffelt, 0,7 s); ueber die Luecke
//                  nach dem 5. Punkt rueckt die Klammer zwei Kaestchen.
//                  Klammer und Punkt bewegen sich nacheinander, so decken sie
//                  sich nie; die Klammerzahl einer Reihe wechselt mit IHREM Punkt.
//   Sprungmarke    das alte Feld blendet aus (0,15 s), dann baut sich das Feld
//                  Reihe fuer Reihe auf (0,3 s je Reihe). Jede Reihe kommt mit
//                  ihrem Summanden und leuchtet; die Malaufgabe zeigt immer das
//                  Feld, das gerade dasteht (1 · 6 = 6, 2 · 6 = 12 …). Gemessen
//                  (Frames zu 16 ms): 6 · 6 ist nach 1,65 s fertig (104 Frames);
//                  simfakten.js mit --frames=25 --verlauf=4 liest bis 125.
//   „neu“          sofort Start 5 · 6, die Punkte blenden ein (0,35 s).
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort ankommen;
// dann geschieht das Neue. Jede Knopffolge ergibt so dieselben Zahlen.
// Grenzen: 0 bis 10 Reihen, 1 bis 10 Punkte je Reihe. Darueber wackelt das
// Feld, und _m5r-grenze zeigt „Mehr Reihen passen nicht ins Feld.“ bzw. „Mehr
// Punkte passen nicht in eine Reihe.“ (bis zur naechsten Handlung; sonst ist
// die Zeile ausgeblendet). Unter 0 Reihen bzw. 1 Punkt wackelt es nur.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m5rMarke('5x6') …):
//     „5 · 6“ · „4 · 6“ · „6 · 6“
//   Reihe 2: „− 1 Reihe“ · „+ 1 Reihe“ (_m5rReihe(-1|1)) ·
//            „− 1 je Reihe“ · „+ 1 je Reihe“ (_m5rJe(-1|1)) · „neu“ (_m5rNeu())
// Der Knopf der Sprungmarke, deren Feld gerade dasteht (oder gebaut wird),
// ist hervorgehoben.
//
// Statuszeilen (woertlich, jede mit mehr als 18 Zeichen):
//   _m5r-reihen       „Reihen: 4, Punkte je Reihe: 6“
//   _m5r-plus         „Plusaufgabe: 6 + 6 + 6 + 6 = 24“ · 0 Reihen „Plusaufgabe:
//                     keine Reihe, also 0“ · 1 Reihe „Plusaufgabe: eine Reihe, also 6“
//   _m5r-produkt      „Das Produkt von 4 · 6 ist 24.“
//   _m5r-unterschied  „Unterschied zu 5 · 6: 6 weniger“ / „…: 0“ / „…: 6 mehr“
//                     (bei n Punkten je Reihe „Unterschied zu 5 · n: …“)
//   _m5r-grenze       nur an der Grenze (siehe oben)
// Zwischen Zahl und „·“ steht ein geschuetztes Leerzeichen (U+00A0), damit
// „5 · 6“ in der schmalen Anzeige nicht umbricht.
//
// Werte (nachgerechnet mit simcheck/werte.js):
//   5 · 6 → 30, Unterschied 0 · 4 · 6 (auch Start + „− 1 Reihe“) → 24,
//   6 weniger · 6 · 6 → 36, 6 mehr · frei: 0 · 7 → 0, 35 weniger ·
//   6 · 9 → 54, 9 mehr.
// Start: 5 · 6, fertig aufgebaut („Start: 5 Reihen zu je 6 Punkten“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): das erste „− 1 Reihe“ ab 5 · 6
// (nach dem Oeffnen, einer Sprungmarke oder „neu“) – ein Lichtring breitet
// sich um die Reihe aus, die hinausfliegt, und sie fliegt bernsteinfarben
// umrandet hinaus. Das widerlegt „29“: weg ist eine ganze Reihe zu 6 Punkten.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-plus-/minus-schriftlich; Container
// <div class="fpm-lehrkraft">, V3). Eigene Zeile unter den Heftknoepfen,
// davor klein „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m5rAnhalten()): friert jede Bewegung sofort ein; im
//     Bild oben links das Schild „Pause“ (Stelle und Aussehen wie in
//     m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m5rTempo()): alles ein Drittel so schnell.
//   „Zahlen verdecken: aus“ ↔ „… an“ (_m5rVerdecken()): verdeckt Plusaufgabe,
//     Produkt und Unterschied – im Bild graue Karten mit „?“, in den
//     Statuszeilen „verdeckt“. Punkte, Klammern und „4 · 6 =“ bleiben
//     sichtbar: zum Vermuten an der Tafel.
//   Nur das wechselnde Wort steht in einem eigenen <span> (wie plus-schriftlich).
//   Hinweiszeile _m5r-lehrkraft (in der Pause bernsteinfarben, „lmp-status off“):
//     sonst    „Für die Lehrkraft: „Pause“ hält alles an. „Zahlen verdecken“ lässt erst vermuten.“
//     verdeckt „Zahlen verdeckt. Erst vermuten lassen, dann wieder aufdecken.“
//     Pause    „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
//   So ist es gebaut: EIN Zeitfaktor (_m5rZeitfaktor: 0 Pause, 1/3 langsam,
//   1 normal) an der einen Stelle, an der dt in die Bewegung geht (Anfang von
//   _m5rUpdate). Waehrend der Pause bewegt kein Knopf etwas: „± 1 …“ wird
//   VORGEMERKT, wenn nichts unterwegs ist (es beginnt mit „weiter“), und
//   ENTFAELLT, wenn eine Bewegung steht (er liesse sie sofort ankommen); das
//   Schild „Pause“ leuchtet dabei kurz auf (in echter Zeit). Eine Sprungmarke
//   und „neu“ heben die Pause auf; Tempo und Verdecken bleiben stehen.
//   Voreinstellung Pause aus, Tempo normal, Verdecken aus.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Faktor“, „Faktoren“,
// „Nachbaraufgabe“ und die Regel als Satz (kein „eine Reihe weniger ist 6
// weniger“). Keine Namen, keine Punktwertung, keine Zeit, kein „falsch“.
// Deterministisch, ohne Zufall: jede Zahl im Bild und in der Anzeige kommt aus
// z.r (Reihen) und z.n (Punkte je Reihe).
// ════════════════════════════════════════════════════════════════════════
let _m5r = null;
const _m5rMARKEN = { '5x6': [5, 6], '4x6': [4, 6], '6x6': [6, 6] };   // [Reihen, Punkte je Reihe]
const _m5rREIHE = ['5x6', '4x6', '6x6'];
const _m5rK = {
  KA: 15,                          // Kaestchen (px): ein Punkt je Kaestchen
  GX: 127, GY: 10,                 // linke obere Ecke des Feldes; 11 Kaestchen breit, mittig
  MITTE: 210,                      // Mitte der Plus- und der Malaufgabe
  MAXR: 10, MAXN: 10,              // Grenzen
  RP: 5.2,                         // Radius eines Punkts
  PY: 203, MY: 232,                // Grundlinien: Plusaufgabe, Malaufgabe
  GP: 15, GM: 26, GK: 13,          // Schriftgrade: Plus, Mal, Klammerzahl
  PX0: 4, PX1: 416, PY0: 4, PY1: 246,   // Papier
  FLUG: 305,                       // so weit fliegt eine Reihe hinaus / kommt sie herein (px)
  BAND: 6.5,                       // halbe Hoehe eines Leuchtbands: 13 px, Nachbarreihen beruehren sich nicht
  T_HEB: 0.15, T_RAUS: 0.8, T_REIN: 0.8, T_JE: 0.7, T_LEER: 0.15, T_BAU: 0.3,
  T_POP: 0.3, T_GLANZ: 0.9, T_NEU: 0.35, T_AHA: 1.4, LANGSAM: 1 / 3,
  F_PUNKT: '#3b82f6', F_PRAND: '#1d4ed8', F_BLAU: '#1d4ed8',
  F_TEXT: '#111827', F_KARO: '#d4e3f1', F_KLAMMER: '#64748b'
};

// 1234 -> "1 234" mit geschuetztem Leerzeichen (im Heft normales Leerzeichen)
function _m5rFmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
// „4 · 6“ mit geschuetzten Leerzeichen
function _m5rMal(a, b) { return a + ' · ' + b; }
// Kaestchenspalte des j-ten Punkts einer Reihe (nach dem 5. ein Kaestchen frei)
function _m5rSpalte(j) { return j + (j >= 5 ? 1 : 0); }
function _m5rPX(j) { const K = _m5rK; return K.GX + _m5rSpalte(j) * K.KA + K.KA / 2; }
// Mitte der Reihe i (nach der 5. Reihe eine Kaestchenzeile frei)
function _m5rPY(i) { const K = _m5rK; return K.GY + (i + (i >= 5 ? 1 : 0)) * K.KA + K.KA / 2; }
// Klammer rechts neben einer Reihe mit n Punkten
function _m5rKX(n) {
  const K = _m5rK;
  return n <= 0 ? K.GX + 2 : K.GX + (_m5rSpalte(n - 1) + 1) * K.KA + 2;
}

function _m5rInit() {
  _m5r = { r: 5, n: 6, lauf: null, t: 0, fx: { teile: [] },
           glanz: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], auf: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           popP: 0, wackel: 0, ein: 0, ahaGlanz: 0, aha: false, grenze: '',
           pause: false, langsam: false, verdeckt: false, blink: 0, vormerk: null };   // Lehrkraft
}
function _m5rHTML() {
  const marke = k => {
    const [r, n] = _m5rMARKEN[k];
    return `<button class="sim-btn" id="_m5r-b-${k}" onclick="_m5rMarke('${k}')">${r}&nbsp;·&nbsp;${n}</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viel ist 4&nbsp;·&nbsp;6?</h3>
    <div class="fpm-note" style="margin-top:2px">Jede Reihe hat gleich viele Punkte. „−&nbsp;1 Reihe“ und „+&nbsp;1 Reihe“ ändern die Zahl der Reihen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5r-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5rREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_m5rReihe(-1)">−&nbsp;1 Reihe</button>
          <button class="sim-btn" onclick="_m5rReihe(1)">+&nbsp;1 Reihe</button>
          <button class="sim-btn" onclick="_m5rJe(-1)">−&nbsp;1 je Reihe</button>
          <button class="sim-btn" onclick="_m5rJe(1)">+&nbsp;1 je Reihe</button>
          <button class="sim-btn" onclick="_m5rNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m5r-pause" onclick="_m5rAnhalten()">Pause</button>
            <button class="sim-btn" id="_m5r-tempo" onclick="_m5rTempo()">Tempo: <span id="_m5r-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m5r-verdeckt" onclick="_m5rVerdecken()">Zahlen verdecken: <span id="_m5r-verdeckt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m5r-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5r-reihen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5r-plus" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5r-produkt" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5r-unterschied" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_m5r-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 5 Reihen zu je 6 Punkten</p>
  </div>`;
}
function _m5rSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m5rStatus() {
  if (!_m5r) return;
  const z = _m5r, K = _m5rK, r = z.r, n = z.n, p = r * n, u = p - 5 * n;
  const blau = s => '<b style="color:' + K.F_BLAU + '">' + s + '</b>';
  _m5rSetze('_m5r-reihen', 'Reihen: ' + r + ', Punkte je Reihe: ' + blau(n));
  let plus;
  if (z.verdeckt) plus = 'verdeckt';
  else if (r === 0) plus = 'keine Reihe, also 0';
  else if (r === 1) plus = 'eine Reihe, also ' + blau(n);
  else plus = new Array(r).fill(blau(n)).join(' + ') + ' = ' + _m5rFmt(p);
  _m5rSetze('_m5r-plus', 'Plusaufgabe: ' + plus);
  _m5rSetze('_m5r-produkt', 'Das Produkt von ' + _m5rMal(r, blau(n)) + ' ist ' +
            (z.verdeckt ? 'verdeckt' : _m5rFmt(p)) + '.');
  _m5rSetze('_m5r-unterschied', 'Unterschied zu ' + _m5rMal(5, blau(n)) + ': ' +
            (z.verdeckt ? 'verdeckt' : u === 0 ? '0' : _m5rFmt(Math.abs(u)) + (u < 0 ? ' weniger' : ' mehr')));
  const g = _m5rSetze('_m5r-grenze', z.grenze);
  if (g && g.style) g.style.display = z.grenze ? '' : 'none';
  // Sprungmarke hervorheben, deren Feld gerade dasteht oder gebaut wird
  const ziel = z.lauf && z.lauf.art === 'bau' ? z.lauf.ziel : [r, n];
  for (const k of _m5rREIHE) {
    const b = document.getElementById('_m5r-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', _m5rMARKEN[k][0] === ziel[0] && _m5rMARKEN[k][1] === ziel[1]);
  }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _m5rSetze('_m5r-pause', z.pause ? 'weiter' : 'Pause');
  _m5rSetze('_m5r-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m5rSetze('_m5r-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m5rSetze('_m5r-lehrkraft',
    z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : z.verdeckt ? 'Zahlen verdeckt. Erst vermuten lassen, dann wieder aufdecken.'
    : 'Für die Lehrkraft: „Pause“ hält alles an. „Zahlen verdecken“ lässt erst vermuten.');
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m5r-pause', z.pause], ['_m5r-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Sprungmarke: das Feld neu aufbauen, Reihe fuer Reihe. Hebt die Pause auf.
function _m5rMarke(k) {
  if (!_m5r || !_m5rMARKEN[k]) return;
  const z = _m5r;
  _m5rFertig();
  z.pause = false; z.vormerk = null; z.blink = 0;
  z.grenze = ''; z.aha = false; z.wackel = 0; z.ein = 0;
  z.lauf = { art: 'bau', ziel: _m5rMARKEN[k].slice(), t: 0, k: 0, naechste: _m5rK.T_LEER };
  _m5rStatus();
}
// „neu“: sofort der Start 5 · 6. Hebt die Pause auf.
function _m5rNeu() {
  if (!_m5r) return;
  const z = _m5r;
  z.lauf = null; z.pause = false; z.vormerk = null; z.blink = 0;
  z.r = 5; z.n = 6; z.grenze = ''; z.aha = false; z.wackel = 0;
  z.ein = _m5rK.T_NEU; z.popP = 0; z.ahaGlanz = 0;
  z.glanz.fill(0); z.auf.fill(0);
  _m5rStatus();
}
// Waehrend der Pause: vormerken, wenn nichts unterwegs ist; sonst entfaellt der Druck.
function _m5rInDerPause(tat) {
  const z = _m5r;
  z.blink = 0.6;
  if (!z.lauf) z.vormerk = tat;
}
// „− 1 Reihe“ / „+ 1 Reihe“
function _m5rReihe(d) {
  if (!_m5r || (d !== 1 && d !== -1)) return;
  const z = _m5r, K = _m5rK;
  if (z.pause) { _m5rInDerPause(() => _m5rReihe(d)); return; }
  _m5rFertig();
  z.grenze = '';
  if (d < 0 && z.r <= 0) { z.wackel = 0.45; _m5rStatus(); return; }
  if (d > 0 && z.r >= K.MAXR) {
    z.wackel = 0.45; z.grenze = 'Mehr Reihen passen nicht ins Feld.';
    _m5rStatus(); return;
  }
  if (d < 0) {
    const i = z.r - 1, aha = !z.aha && z.r === 5 && z.n === 6;
    z.lauf = { art: 'raus', t: 0, i, aha };
    if (aha) {
      // Aha: eine ganze Reihe zu 6 Punkten geht weg, nicht 1
      z.aha = true; z.ahaGlanz = K.T_AHA;
      _bioFxWelle(z.fx.teile, (_m5rPX(0) + _m5rPX(z.n - 1)) / 2, _m5rPY(i), '#f59e0b', 70);
    }
  } else z.lauf = { art: 'rein', t: 0, i: z.r };
  _m5rStatus();
}
// „− 1 je Reihe“ / „+ 1 je Reihe“
function _m5rJe(d) {
  if (!_m5r || (d !== 1 && d !== -1)) return;
  const z = _m5r, K = _m5rK;
  if (z.pause) { _m5rInDerPause(() => _m5rJe(d)); return; }
  _m5rFertig();
  z.grenze = '';
  if (d < 0 && z.n <= 1) { z.wackel = 0.45; _m5rStatus(); return; }
  if (d > 0 && z.n >= K.MAXN) {
    z.wackel = 0.45; z.grenze = 'Mehr Punkte passen nicht in eine Reihe.';
    _m5rStatus(); return;
  }
  z.lauf = { art: 'je', t: 0, d };
  _m5rStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
// „Pause“ ↔ „weiter“. Beim Weitermachen laeuft die Bewegung genau dort weiter,
// wo sie stand; ein vorgemerkter Knopf wirkt jetzt.
function _m5rAnhalten() {
  if (!_m5r) return;
  const z = _m5r;
  if (z.pause) {
    z.pause = false; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v && !z.lauf) v();
  } else z.pause = true;
  _m5rStatus();
}
function _m5rTempo() {
  if (!_m5r) return;
  _m5r.langsam = !_m5r.langsam;
  _m5rStatus();
}
function _m5rVerdecken() {
  if (!_m5r) return;
  _m5r.verdeckt = !_m5r.verdeckt;
  _m5rStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m5rZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m5rK.LANGSAM : 1; }

// Die laufende Bewegung ankommen lassen: erst jetzt aendern sich die Zahlen.
function _m5rLanden() {
  const z = _m5r, K = _m5rK, L = z.lauf;
  if (!L) return;
  z.lauf = null;
  if (L.art === 'raus') {
    z.r -= 1;
  } else if (L.art === 'rein') {
    z.r += 1; z.glanz[z.r - 1] = K.T_GLANZ;
  } else if (L.art === 'je') {
    z.n += L.d;
    for (let i = 0; i < z.r; i++) z.glanz[i] = K.T_GLANZ;
  } else if (L.art === 'bau') {
    // abgebrochen: die fehlenden Reihen sind sofort da
    for (let i = L.k ? z.r : 0; i < L.ziel[0]; i++) { z.glanz[i] = K.T_GLANZ; z.auf[i] = K.T_POP; }
    z.r = L.ziel[0]; z.n = L.ziel[1];
  }
  z.popP = K.T_POP;
  _m5rStatus();
}
function _m5rFertig() { if (_m5r && _m5r.lauf) _m5rLanden(); }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5rUpdate(dt) {
  if (!_m5r) return;
  const z = _m5r, K = _m5rK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);               // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m5rZeitfaktor(z);                       // ab hier Sim-Zeit: 0 Pause, 1/3 langsam, 1 normal
  z.t += dt;
  for (let i = 0; i < 10; i++) {
    z.glanz[i] = Math.max(0, z.glanz[i] - dt);
    z.auf[i] = Math.max(0, z.auf[i] - dt);
  }
  z.popP = Math.max(0, z.popP - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  z.ein = Math.max(0, z.ein - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  const L = z.lauf;
  if (L && dt > 0) {                                  // ohne Zeit kein Schritt im Ablauf
    L.t += dt;
    if (L.art === 'raus' && L.t >= K.T_RAUS) _m5rLanden();
    else if (L.art === 'rein' && L.t >= K.T_REIN) _m5rLanden();
    else if (L.art === 'je' && L.t >= K.T_JE) _m5rLanden();
    else if (L.art === 'bau') {
      while (z.lauf === L && L.t >= L.naechste - 1e-9) {
        if (L.k === 0) { z.r = 0; z.n = L.ziel[1]; }  // das alte Feld ist ausgeblendet
        if (L.k < L.ziel[0]) {
          z.r = L.k + 1;
          z.glanz[L.k] = K.T_GLANZ; z.auf[L.k] = K.T_POP; z.popP = K.T_POP;
          L.k++;
        }
        L.naechste += K.T_BAU;
        if (L.k >= L.ziel[0]) z.lauf = null;
        _m5rStatus();
      }
    }
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5rPapier(ctx) {
  const K = _m5rK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  let x0 = K.GX, y0 = K.GY;                           // Raster am Feld ausgerichtet
  while (x0 - K.KA > K.PX0 + 1) x0 -= K.KA;
  while (y0 - K.KA > K.PY0 + 1) y0 -= K.KA;
  for (let x = x0; x < K.PX1 - 1; x += K.KA) {
    ctx.beginPath(); ctx.moveTo(x, K.PY0 + 1); ctx.lineTo(x, K.PY1 - 1); ctx.stroke();
  }
  for (let y = y0; y < K.PY1 - 1; y += K.KA) {
    ctx.beginPath(); ctx.moveTo(K.PX0 + 1, y); ctx.lineTo(K.PX1 - 1, y); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.stroke();
  ctx.restore();
}
// Ein Punkt (Wendeplaettchen): s = Groesse 0..1+, a = Deckkraft
function _m5rPunkt(ctx, x, y, s, a) {
  const K = _m5rK, r = K.RP * s;
  if (a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = K.F_PUNKT; ctx.strokeStyle = K.F_PRAND; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (r > 3) {                                        // Lichtpunkt: sieht aus wie ein Plaettchen
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Klammer „]“ rechts neben einer Reihe, daneben die Anzahl je Reihe (blau)
function _m5rKlammer(ctx, x, y, n, a) {
  const K = _m5rK;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = K.F_KLAMMER; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x + 3, y - 6); ctx.lineTo(x + 3, y + 6); ctx.lineTo(x, y + 6); ctx.stroke();
  ctx.fillStyle = K.F_BLAU; ctx.font = '700 ' + K.GK + 'px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(_m5rFmt(n), x + 7, y + K.GK * 0.36);
  ctx.restore();
}
// Leuchtband hinter einer Reihe (mit Klammer und Klammerzahl)
function _m5rBand(ctx, xl, xr, y, a, aha) {
  const B = _m5rK.BAND;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = 'rgba(252,211,77,0.35)'; ctx.strokeStyle = aha ? '#d97706' : 'rgba(217,119,6,0.75)';
  ctx.lineWidth = aha ? 2.5 : 1.8;
  _bioFxRundRect(ctx, xl, y - B, xr - xl, 2 * B, B); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// „± 1 je Reihe“ in Reihe i: wie weit ist ihr Punkt dazugekommen bzw. weg (0..1)?
// Nacheinander statt gleichzeitig, damit sich Klammer und Punkt nie decken:
// bei + 1 rueckt erst die Klammer (0–0,25 s), dann springt der Punkt herein;
// bei − 1 verschwindet erst der Punkt, dann rueckt die Klammer (0,4–0,65 s).
function _m5rJeStand(je, i) {
  const start = (je.d > 0 ? 0.2 : 0) + i * 0.02, dauer = je.d > 0 ? 0.25 : 0.3;
  return _bioFxKlemme((je.t - start) / dauer);
}
function _m5rJeKlammer(je) {
  return je.d > 0 ? _bioFxEase.sanft(_bioFxKlemme(je.t / 0.25))
                  : _bioFxEase.sanft(_bioFxKlemme((je.t - 0.4) / 0.25));
}
// Welche Reihen stehen gerade da, und wie bewegen sie sich?
function _m5rReihen() {
  const z = _m5r, K = _m5rK, L = z.lauf, E = _bioFxEase, kl = _bioFxKlemme;
  let a = z.ein > 0 ? 1 - z.ein / K.T_NEU : 1;
  if (L && L.art === 'bau' && L.k === 0) a *= 1 - kl(L.t / K.T_LEER);   // altes Feld blendet aus
  const out = [];
  for (let i = 0; i < z.r; i++) out.push({ i, dx: 0, dy: 0, a, flieg: false });
  if (L && L.art === 'raus' && out[L.i]) {
    // „hebt sich“: kleiner Hub und ein Schatten unter den Punkten, dann hinaus
    const R = out[L.i], heb = kl(L.t / K.T_HEB), u = kl((L.t - K.T_HEB) / (K.T_RAUS - K.T_HEB));
    R.dy = -2 * E.sanft(heb); R.dx = K.FLUG * E.rein(u); R.flieg = true; R.aha = L.aha; R.schatten = heb;
  }
  if (L && L.art === 'rein')
    out.push({ i: L.i, dx: K.FLUG * (1 - E.raus(kl(L.t / K.T_REIN))), dy: 0, a: 1, flieg: true });
  return out;
}
function _m5rFeld(ctx) {
  const z = _m5r, K = _m5rK, L = z.lauf, E = _bioFxEase, kl = _bioFxKlemme;
  const wk = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0;
  const n = z.n, reihen = _m5rReihen();
  const je = L && L.art === 'je' ? L : null;
  // Klammer: waehrend „± 1 je Reihe“ rueckt sie zur neuen Stelle (vor bzw. nach dem Punkt)
  const kx = je ? _m5rKX(n) + (_m5rKX(n + je.d) - _m5rKX(n)) * _m5rJeKlammer(je) : _m5rKX(n);
  ctx.save();
  ctx.font = '700 ' + K.GK + 'px sans-serif';
  const zahlBreite = ctx.measureText(_m5rFmt(Math.max(n, n + (je ? je.d : 0)))).width;
  ctx.restore();
  // Leuchtbaender hinter den Reihen (Reihe, Klammer und Klammerzahl gemeinsam)
  for (const R of reihen) {
    const y = _m5rPY(R.i) + R.dy, xl = _m5rPX(0) - K.RP - 4 + R.dx + wk, xr = kx + 7 + zahlBreite + 4 + R.dx + wk;
    if (R.aha && z.ahaGlanz > 0) _m5rBand(ctx, xl, xr, y, Math.min(1, z.ahaGlanz / 0.5), true);
    else if (!R.flieg && z.glanz[R.i] > 0) _m5rBand(ctx, xl, xr, y, R.a * z.glanz[R.i] / K.T_GLANZ, false);
  }
  for (const R of reihen) {
    const y = _m5rPY(R.i) + R.dy;
    const auf = z.auf[R.i] > 0 ? K.T_POP - z.auf[R.i] : null;   // Reihe erscheint gerade
    const st = je ? _m5rJeStand(je, R.i) : 0;
    if (R.schatten > 0) {                              // die Reihe hebt sich vom Papier ab
      ctx.save();
      ctx.globalAlpha = 0.18 * R.schatten; ctx.fillStyle = '#0f172a';
      for (let j = 0; j < n; j++) {
        ctx.beginPath(); ctx.arc(_m5rPX(j) + R.dx + wk + 1.5, y - R.dy + 2.5, K.RP, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    for (let j = 0; j < n; j++) {
      let s = 1, a = R.a, dy = 0;
      if (auf !== null) s = Math.max(0, E.federn(kl((auf - j * 0.015) / 0.18)));
      if (je && je.d < 0 && j === n - 1) {             // letzter Punkt schrumpft und steigt weg
        const u = E.sanft(st);
        s *= 1 - u; dy = -7 * u; a *= 1 - u;
      }
      _m5rPunkt(ctx, _m5rPX(j) + R.dx + wk, y + dy, s, a);
    }
    if (je && je.d > 0 && st > 0)                      // neuer Punkt springt dazu
      _m5rPunkt(ctx, _m5rPX(n) + R.dx + wk, y, Math.max(0, E.federn(st)), R.a);
    // Die Klammerzahl zaehlt die Punkte, die gerade in DIESER Reihe stehen
    const kn = je && st >= 0.5 ? n + je.d : n;
    const ka = auf !== null ? R.a * kl(auf / 0.15) : R.a;
    _m5rKlammer(ctx, kx + R.dx + wk, y, kn, ka);
  }
}
// Plusaufgabe als Folge von Teilen: { s, f, k (Nummer des Summanden), a (Deckkraft), w (Breite 0..1) }
function _m5rPlusTeile() {
  const z = _m5r, K = _m5rK, L = z.lauf, r = z.r, n = z.n, kl = _bioFxKlemme;
  if (r === 0) return [{ s: 'keine Reihe, also 0', f: K.F_TEXT }];
  if (r === 1) return [{ s: 'eine Reihe, also', f: K.F_TEXT }, { s: _m5rFmt(n), f: K.F_BLAU, k: 0 }];
  const t = [];
  for (let k = 0; k < r; k++) {
    // Der Summand der Reihe, die hinausfliegt, blendet erst aus und gibt dann
    // seinen Platz frei – so schiebt sich nie ein sichtbares Zeichen ueber ein anderes.
    let a = 1, w = 1;
    if (L && L.art === 'raus' && k === r - 1) {
      const u = kl(L.t / K.T_RAUS);
      a = 1 - kl(u / 0.55); w = 1 - _bioFxEase.sanft(kl((u - 0.55) / 0.45));
    }
    if (k) t.push({ s: '+', f: K.F_TEXT, a, w });
    t.push({ s: _m5rFmt(n), f: K.F_BLAU, k, a, w });
  }
  t.push({ s: '=', f: K.F_TEXT }, { s: _m5rFmt(r * n), f: K.F_TEXT, pop: true });
  return t;
}
// Teile mittig setzen; zu breit -> kleiner. Jedes Zeichen steht mittig in seinem
// Platz (so bleibt „·“ auch bei geschaetzter Schriftbreite mittig zwischen den Zahlen).
// Leuchten hinter Summanden, deren Reihe leuchtet; Karten fuer „verdeckt“.
function _m5rSetzen(ctx, teile, y, gr0, a0) {
  const z = _m5r, K = _m5rK;
  if (a0 <= 0.01) return;
  const breite = t => (t.w === undefined ? 1 : t.w), deck = t => (t.a === undefined ? 1 : t.a);
  let gr = gr0, br = [], luft = 0, ges = 0;
  const messen = () => {
    ctx.font = '700 ' + gr + 'px sans-serif';
    br = teile.map(t => t.karte ? Math.max(gr * 1.4, ctx.measureText(t.s).width + gr * 0.6) : ctx.measureText(t.s).width);
    luft = gr * 0.3; ges = 0;
    teile.forEach((t, i) => { ges += (br[i] + (i ? luft : 0)) * breite(t); });
  };
  ctx.save();
  messen();
  const platz = K.PX1 - K.PX0 - 24;
  if (ges > platz) { gr = Math.max(10, Math.floor(gr * platz / ges)); messen(); }
  const xm = [];                                       // Mitte jedes Platzes
  let x = K.MITTE - ges / 2;
  teile.forEach((t, i) => {
    if (i) x += luft * breite(t);
    xm.push(x + br[i] * breite(t) / 2);
    x += br[i] * breite(t);
  });
  // Leuchten hinter den Summanden, deren Reihe gerade leuchtet
  teile.forEach((t, i) => {
    if (t.k === undefined || !(z.glanz[t.k] > 0)) return;
    ctx.globalAlpha = a0 * Math.min(1, z.glanz[t.k] / K.T_GLANZ) * deck(t);
    ctx.fillStyle = 'rgba(252,211,77,0.55)'; ctx.strokeStyle = 'rgba(217,119,6,0.75)'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, xm[i] - br[i] / 2 - 3, y - gr * 0.82, br[i] + 6, gr * 1.04, 4); ctx.fill(); ctx.stroke();
  });
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  teile.forEach((t, i) => {
    const a = a0 * deck(t);
    if (a <= 0.01) return;
    ctx.globalAlpha = Math.min(1, a);
    if (t.karte) { _m5rKarte(ctx, xm[i] - br[i] / 2, y - gr * 0.85, br[i], gr * 1.1); return; }
    ctx.font = '700 ' + gr + 'px sans-serif';
    ctx.fillStyle = t.f;
    if (t.pop && z.popP > 0) {                         // das Ergebnis springt und federt
      const k = Math.max(0.6, _bioFxEase.federn(1 - z.popP / K.T_POP));
      ctx.save(); ctx.translate(xm[i], y - gr * 0.36); ctx.scale(k, k);
      ctx.fillText(t.s, 0, gr * 0.36);
      ctx.restore();
    } else ctx.fillText(t.s, xm[i], y);
  });
  ctx.restore();
}
// Graue Karte mit „?“ (Zahlen verdecken)
function _m5rKarte(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 ' + Math.round(Math.max(13, h * 0.8)) + 'px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('?', x + w / 2, y + h / 2 + Math.max(13, h * 0.8) * 0.36);
  ctx.restore();
}
function _m5rRechnungen(ctx) {
  const z = _m5r, K = _m5rK, L = z.lauf, r = z.r, n = z.n;
  // waehrend die Sprungmarke das alte Feld ausblendet, blenden die Rechnungen mit aus
  const a = L && L.art === 'bau' && L.k === 0 ? 1 - _bioFxKlemme(L.t / K.T_LEER) : 1;
  // verdeckt: eine Karte statt der Plusaufgabe (s gibt nur ihre Breite vor, gezeigt wird „?“)
  if (z.verdeckt) _m5rSetzen(ctx, [{ s: '6 + 6 + 6 + 6 + 6 = 30', karte: true }], K.PY, K.GP, a);
  else _m5rSetzen(ctx, _m5rPlusTeile(), K.PY, K.GP, a);
  const mal = [{ s: String(r), f: K.F_TEXT }, { s: '·', f: K.F_TEXT }, { s: _m5rFmt(n), f: K.F_BLAU },
               { s: '=', f: K.F_TEXT },
               z.verdeckt ? { s: '00', karte: true } : { s: _m5rFmt(r * n), f: K.F_TEXT, pop: true }];
  _m5rSetzen(ctx, mal, K.MY, K.GM, a);
}
function _m5rDraw(ctx, cv) {
  if (!_m5r) return;
  const z = _m5r, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m5rPapier(ctx);
  _bioFxDraw(ctx, z.fx.teile);                        // Lichtring hinter den Punkten
  _m5rFeld(ctx);
  _m5rRechnungen(ctx);
  if (z.pause) _m5rPauseSchild(ctx);
}
// Schild „Pause“ oben links – gleiche Stelle, Groesse und Farbe wie in
// m5-plus-schriftlich, damit die Lehrkraft es ueberall am selben Ort findet.
// Leuchtet kurz auf, wenn waehrend der Pause ein Knopf gedrueckt wird.
function _m5rPauseSchild(ctx) {
  const z = _m5r, w = 64, h = 25, x = 8, y = 8;       // endet vor dem Feld (x = 127)
  ctx.save();
  if (z.blink > 0) {
    ctx.globalAlpha = Math.min(1, z.blink / 0.3);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, x - 3, y - 3, w + 6, h + 6, 9); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  ctx.font = '700 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Pause', x + 20, y + 17.5);
  ctx.restore();
}
