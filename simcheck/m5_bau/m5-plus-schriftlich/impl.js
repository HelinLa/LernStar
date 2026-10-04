
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mp3 „Wie addiert man schriftlich?“ (Kennung m5-plus-schriftlich)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL2_PROFIL.md, Abschnitt m5-plus-schriftlich.
// Ueberschrift = Frage der Einheit: „Was ergibt 457 + 368 wirklich?“
//
// Was man sieht: links ein Rechenblatt aus Karopapier (helle Kaestchen, eine
// Ziffer je Kaestchen). Oben klein die Spalten H Z E (T nur, wenn das Ergebnis
// vier Stellen hat). Darunter die obere Zahl (blau), die untere Zahl mit „+“
// davor (gruen), beide rechtsbuendig; dann eine Zeile fuer die Uebertraege
// (kleine Ziffern, bernsteinfarben), der Strich und die Ergebniszeile
// (dunkel). Rechts oben eine Sprechblase, rechts darunter ein Zwanzigerfeld
// (zwei Reihen zu je zehn Plaetzen, nach fuenf eine Luecke) und ein kleiner
// Farbschluessel: „Würfel aus 457“ (blau), „Würfel aus 368“ (gruen),
// „Übertrag“ (bernstein).
//
// „nächste Spalte“ rechnet EINE Spalte, von rechts her:
//   1. Die Spalte bekommt ein helles Band. Aus jeder Ziffer der Spalte fliegen
//      so viele kleine Wuerfel ins Zwanzigerfeld, wie sie angibt (gestaffelt,
//      rund 0,8 s) – in der Farbe ihrer Zeile; ein Uebertrag aus der Spalte
//      davor fliegt als ein bernsteinfarbener Wuerfel mit. In der Sprechblase
//      steht die Rechnung, z. B. „7 + 8 = “, und sobald alle Wuerfel liegen,
//      „15“ dazu.
//   2. Sind es 10 oder mehr Wuerfel, ist die obere Reihe voll: Die zehn
//      Wuerfel gleiten zu einer Stange zusammen (0,8 s) und werden dabei
//      bernsteinfarben; die Stange fliegt in die Uebertragszeile der naechsten
//      Spalte links (0,8 s), schrumpft und wird dort zur kleinen „1“.
//   3. Die uebrigen Wuerfel gleiten in das Ergebniskaestchen der Spalte
//      (0,7 s), und dort erscheint die Ziffer (z. B. „5“). Erst jetzt steht die
//      ganze Zeile in „_m5i-spalte“.
// „alles rechnen“ rechnet die restlichen Spalten nacheinander, genauso
// bewegt, mit 0,3 s Pause dazwischen. Wer waehrend einer Bewegung „nächste
// Spalte“ drueckt, laesst die laufende Spalte sofort landen und beginnt die
// naechste. Ist alles gerechnet, wird das Ergebnis doppelt unterstrichen, die
// Sprechblase zeigt die ganze Aufgabe („457 + 368 = 825“), und die beiden
// Rechenknoepfe werden blass.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5iAufgabe('…'), Wahlgruppe):
//     „457 + 368“ · „345 + 62“ · „508 + 294“ · „136 + 251“
//   „nächste Spalte“ (_m5iSpalte()) · „alles rechnen“ (_m5iAlles()) ·
//   „neu“ (_m5iNeu(): wieder 457 + 368, nichts gerechnet)
// Eine Sprungmarke laedt die Aufgabe neu: die Ziffern schreiben sich von
// links nach rechts ein (0,6 s), der Strich zieht sich durch.
//
// Statuszeilen (woertlich; Tausendertrenner waere U+00A0, kommt hier nicht vor):
//   _m5i-aufgabe    „Aufgabe: 457 + 368 (schriftlich)“
//   _m5i-spalte     vor dem Rechnen „Noch keine Spalte gerechnet.“; waehrend
//                   einer Spalte „Jetzt die Einer: 7 + 8 = …“; nach der Landung
//                   „Einer: 7 + 8 = 15, schreibe 5, Übertrag 1“ /
//                   „Zehner: 5 + 6 + 1 = 12, schreibe 2, Übertrag 1“ /
//                   „Hunderter: 4 + 3 + 1 = 8, schreibe 8“
//   _m5i-uebertrag  „Übertrag entstanden bei: …“, wenn alles gerechnet ist
//                   „Übertrag entstanden bei: E und Z“ (sonst „… bei: nirgends“)
//   _m5i-ergebnis   „Ergebnis der Aufgabe: …“, am Ende „Ergebnis der Aufgabe: 825“
// Alle vier Zeilen haben mehr als 18 Zeichen (simfakten.js-Grenze).
//
// Werte (jede Spalte nachgerechnet, simcheck/werte.js):
//   457 + 368 → E 7 + 8 = 15, Z 5 + 6 + 1 = 12, H 4 + 3 + 1 = 8 → E und Z → 825
//   345 + 62  → E 5 + 2 = 7, Z 4 + 6 = 10, H 3 + 1 = 4           → Z       → 407
//   508 + 294 → E 8 + 4 = 12, Z 0 + 9 + 1 = 10, H 5 + 2 + 1 = 8  → E und Z → 802
//   136 + 251 → E 6 + 1 = 7, Z 3 + 5 = 8, H 1 + 2 = 3            → nirgends → 387
// Start: 457 + 368, noch keine Spalte gerechnet.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): der erste Uebertrag in
// 457 + 368 – wenn die Stange aus den Einern als kleine „1“ ueber den Zehnern
// landet, laeuft ein Lichtring um diese „1“, und sie leuchtet 2,6 s nach
// (_bioFxLeuchten). Einmal je geladener Aufgabe. Das widerlegt „715“: die zehn
// Einer verschwinden nicht, sie wandern als 1 Zehner weiter.
//
// FUER DIE LEHRKRAFT (seit 04.10.2026). Abdullah: „könntest du ein Stoppzeichen
// einbauen, damit man im Unterricht den Kindern zeigen kann, was da passiert
// mit dem Übertrag, das ist wirklich sehr schnell“. Eine eigene Knopfzeile
// UNTER den Heftknoepfen, davor klein „Für die Lehrkraft:“ – so verwechselt
// kein Kind sie mit den Knoepfen, die das Heft nennt:
//   „Pause“ ↔ „weiter“ (_m5iAnhalten()): friert ALLES sofort ein, auch mitten in
//     einer Spalte (Wuerfel, Stange, Ziffern, Lichtring); „weiter“ macht genau
//     dort weiter. Im Bild oben links auf dem Rechenblatt das Schild „Pause“
//     (Stelle und Aussehen wie in m5-minus-schriftlich).
//   „Halt beim Übertrag: aus“ ↔ „… an“ (_m5iHaltSchalter()): haelt von selbst
//     an, sobald die zehn Wuerfel einer Spalte zusammenliegen und bernstein-
//     farben sind – BEVOR sie zur Stange verschmelzen und in die naechste
//     Spalte wandern. Dann ist Pause (Knopf „weiter“), die zehn Wuerfel sind
//     eingerahmt, und unten auf dem Blatt steht „10 Einer = 1 Zehner“
//     (Zehnerspalte: „10 Zehner = 1 Hunderter“).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m5iTempo()): alles ein Drittel so schnell.
//   Bei „Halt …“ und „Tempo …“ wechselt nur das letzte Wort (eigenes <span>
//   _m5i-halt-an / _m5i-tempo-an, Bauart wie in m5-minus-schriftlich).
// Hinweiszeile _m5i-lehrkraft (immer mehr als 18 Zeichen; direkt unter der
// Lehrkraft-Zeile, in der Pause bernsteinfarben – Stelle wie in m5-minus-schriftlich):
//   sonst      „Für die Lehrkraft: „Pause“ hält alles an. „Halt beim Übertrag“ stoppt von selbst.“
//   Pause      „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
//   Halt       „Halt: 10 Einer werden zu 1 Zehner. Das ist der Übertrag.“
//              („Halt: 10 Zehner werden zu 1 Hunderter. Das ist der Übertrag.“)
// So ist es gebaut:
//   * EIN Zeitfaktor (_m5iZeitfaktor: 0 in der Pause, 1/3 langsam, 1 normal)
//     an der einen Stelle, an der dt in die Bewegung geht (Anfang von
//     _m5iUpdate). Alles, was sich bewegt oder leuchtet, laeuft auf diesem dt.
//     Ohne Zeit auch kein Phasenwechsel (`dt > 0` vor dem Ablauf). In der
//     Voreinstellung ist der Faktor 1 und dt bitgleich wie vorher.
//   * Der Halt ist ein EREIGNIS im Ablauf: das Ende der Phase 'sammeln'
//     (L.angehalten), keine Zeitmessung. Nicht zu verwechseln mit der Phase
//     'halten', in der die Wuerfel nach dem Flug kurz ruhen, und mit der
//     Phase 'pause' zwischen zwei Spalten bei „alles rechnen“.
//   * Waehrend der Pause bewegt KEIN Knopf etwas. Regel: vorgemerkt wird, was
//     nichts Laufendes anfasst; was Laufendes anfassen wuerde, entfaellt.
//       „nächste Spalte“: Ist eine Spalte unterwegs (auch die kurze Luecke
//         zwischen zwei Spalten bei „alles rechnen“), ENTFAELLT der Druck – er
//         liesse die Spalte sofort landen und uebersprange genau das, was man
//         zeigen will. Steht keine Spalte an, wird er VORGEMERKT: die naechste
//         Spalte beginnt mit „weiter“.
//       „alles rechnen“ wird VORGEMERKT: Es schaltet wie sonst nur auf
//         Weiterrechnen um, die stehende Bewegung bleibt stehen; steht keine
//         Spalte an, beginnt die naechste mit „weiter“.
//       Bei beiden leuchtet das Schild „Pause“ kurz auf (in echter Zeit).
//       „Halt …“ und „Tempo …“ schalten um und wirken ab „weiter“.
//       „neu“ und die Aufgabenknoepfe laden wie bisher neu und heben die Pause auf.
//     Halt und Tempo bleiben ueber „neu“ und Aufgabenwechsel stehen: Die
//     Lehrkraft stellt sie einmal fuer die Stunde ein.
//   * „nächste Spalte“ WAEHREND einer Bewegung (ohne Pause) laesst die Spalte
//     wie bisher sofort landen; ein Halt in dieser Spalte entfaellt dann.
//   * Voreinstellung Pause aus, Halt aus, Tempo normal: alles wie vorher,
//     keine Knopfaufschrift und keine Statuszeile ist anders.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm, die Merksatzwoerter):
// „Stellen“, „eins“, „mit“ – und keine Regel als Satz. „Übertrag 1“ ist
// erlaubt. Keine Namen, keine Punkte, keine Zeit. Deterministisch, ohne
// Zufall: jede Zahl im Bild kommt aus _m5iSchritte().
// ════════════════════════════════════════════════════════════════════════
let _m5i = null;
const _m5iAUFGABEN = {
  '457+368': [457, 368], '345+62': [345, 62], '508+294': [508, 294], '136+251': [136, 251]
};
const _m5iREIHE = ['457+368', '345+62', '508+294', '136+251'];
const _m5iNAME = ['Einer', 'Zehner', 'Hunderter', 'Tausender'];
const _m5iKURZ = ['E', 'Z', 'H', 'T'];
const _m5iK = {
  KA: 38,                         // Kaestchen (px)
  XR: 191,                        // rechte Kante der Einerspalte (Block + H Z E mittig auf dem Papier)
  Y0: 8,                          // Kopfzeile 8..46
  R1: 46, R2: 84, RU: 122, RE: 160, RF: 198,   // obere Zahl, untere Zahl, Uebertrag, Ergebnis, Ende
  GZ: 28, BL: 29,                 // Ziffern: Schriftgrad, Grundlinie ab Zeilenoberkante
  GU: 18, UM: 24,                 // Uebertrag: Schriftgrad, Mitte ab Zeilenoberkante
  GK: 16,                         // Kopfzeile H Z E
  PX0: 4, PX1: 226, PY0: 4, PY1: 246,          // Papier
  BX0: 240, BX1: 414, BY0: 10, BY1: 56,        // Sprechblase
  FX0: 240, FX1: 414, FY0: 70, FY1: 122,       // Zwanzigerfeld (Rahmen)
  FXS: 245, FR1: 80, FR2: 100,                 // erster Platz, Reihen (Oberkante)
  W: 14, LUECKE: 2, FUENF: 8,                  // Wuerfel, Abstand, Luecke nach fuenf
  BARX: 257,                                   // linke Kante der Stange (10 · 14 px)
  LY: 146,                                     // Farbschluessel: erste Zeile
  T_SCHREIB: 0.6, T_FLUG: 0.55, T_HALT: 0.35, T_SAMMEL: 0.8,
  T_UEBER: 0.8, T_ZIFFER: 0.7, T_PAUSE: 0.3, T_BAND: 0.6,
  A: { fuell: '#93c5fd', rand: '#1d4ed8', text: '#1d4ed8' },   // obere Zahl
  B: { fuell: '#86efac', rand: '#15803d', text: '#15803d' },   // untere Zahl
  U: { fuell: '#fcd34d', rand: '#b45309', text: '#b45309' },   // Uebertrag
  F_ERG: '#111827', F_LINIE: '#1f2937', F_KARO: '#d4e3f1', F_GRAU: '#475569'
};

// 1234 -> "1 234" mit geschuetztem Leerzeichen (im Heft normales Leerzeichen)
function _m5iFmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
// Die Spalten von rechts: Ziffer oben, Ziffer unten, Uebertrag hinein, Summe.
function _m5iSchritte(a, b) {
  const sa = String(a), sb = String(b), n = Math.max(sa.length, sb.length);
  const out = [];
  let ue = 0;
  for (let c = 0; c < n; c++) {
    const da = c < sa.length ? +sa[sa.length - 1 - c] : null;
    const db = c < sb.length ? +sb[sb.length - 1 - c] : null;
    const s = (da || 0) + (db || 0) + ue;
    out.push({ c, da, db, ue, s, ziffer: s % 10, aus: s >= 10 ? 1 : 0 });
    ue = s >= 10 ? 1 : 0;
  }
  if (ue) out.push({ c: n, da: null, db: null, ue: 1, s: 1, ziffer: 1, aus: 0 });
  return out;
}
// Teile der Spaltenrechnung: [Text, Art] mit Art 'A', 'B', 'U'
function _m5iTeile(st) {
  const t = [];
  if (st.da !== null) t.push([String(st.da), 'A']);
  if (st.db !== null) t.push([String(st.db), 'B']);
  if (st.ue) t.push(['1', 'U']);
  return t;
}
function _m5iZeile(st, fertig, html) {
  const K = _m5iK;
  const farbig = (s, art) => html ? '<b style="color:' + K[art].text + '">' + s + '</b>' : s;
  if (st.da === null && st.db === null)
    return fertig ? _m5iNAME[st.c] + ': nur der Übertrag ' + farbig('1', 'U') + ', schreibe 1'
                  : 'Jetzt die ' + _m5iNAME[st.c] + ': nur der Übertrag ' + farbig('1', 'U');
  const r = _m5iTeile(st).map(p => farbig(p[0], p[1])).join(' + ');
  if (!fertig) return 'Jetzt die ' + _m5iNAME[st.c] + ': ' + r + ' = …';
  return _m5iNAME[st.c] + ': ' + r + ' = ' + st.s + ', schreibe ' + st.ziffer +
         (st.aus ? ', Übertrag ' + farbig('1', 'U') : '');
}

function _m5iInit() {
  _m5i = { t: 0, fx: { teile: [] }, haltAn: false, langsam: false };   // Lehrkraft-Einstellungen
  _m5iLaden('457+368');
}
function _m5iLaden(key) {
  const z = _m5i, [a, b] = _m5iAUFGABEN[key];
  z.key = key; z.a = a; z.b = b;
  z.schritte = _m5iSchritte(a, b);
  z.stellen = Math.max(String(a).length, String(b).length, String(a + b).length);
  z.fertig = 0; z.lauf = null; z.auto = false;
  z.ueSicht = {}; z.ergSicht = {}; z.popU = {}; z.popE = {};
  z.komplett = false; z.schreib = 0; z.band = 0; z.bandC = 0;
  z.aha = false; z.ahaGlanz = 0; z.endGlanz = 0; z.strich2 = 0; z.wackel = 0;
  z.blase = 'aufgabe'; z.blaseI = -1; z.blaseSumme = false; z.blaseT = 0;
  z.zeile = 'Noch keine Spalte gerechnet.';
  z.fx.teile.length = 0;
  z.pause = false; z.halt = null; z.blink = 0; z.vormerken = false;   // neu laden hebt die Pause auf
}
function _m5iHTML() {
  const marke = (k, i) => {
    const [a, b] = _m5iAUFGABEN[k];
    return `<button class="sim-btn" id="_m5i-b-${i}" onclick="_m5iAufgabe('${k}')">${a}&nbsp;+&nbsp;${b}</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was ergibt 457 + 368 wirklich?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle eine Aufgabe. „nächste Spalte“ rechnet eine Spalte, von rechts her. Sieh genau hin, was die Würfel tun.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5i-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5iREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_m5i-weiter" onclick="_m5iSpalte()">nächste Spalte</button>
          <button class="sim-btn" id="_m5i-alles" onclick="_m5iAlles()">alles rechnen</button>
          <button class="sim-btn" onclick="_m5iNeu()">neu</button>
        </div>
        <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m5i-pause" onclick="_m5iAnhalten()">Pause</button>
          <button class="sim-btn" id="_m5i-halt" onclick="_m5iHaltSchalter()">Halt beim Übertrag: <span id="_m5i-halt-an">aus</span></button>
          <button class="sim-btn" id="_m5i-tempo" onclick="_m5iTempo()">Tempo: <span id="_m5i-tempo-an">normal</span></button>
        </div>
        <div class="lmp-status on" id="_m5i-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5i-aufgabe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5i-spalte" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5i-uebertrag" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5i-ergebnis" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">Jede Ziffer wird zu Würfeln. Die Farbe zeigt, aus welcher Zeile sie kommen.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Aufgabe 457&nbsp;+&nbsp;368, noch keine Spalte gerechnet</p>
  </div>`;
}
function _m5iSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m5iStatus() {
  if (!_m5i) return;
  const z = _m5i, K = _m5iK;
  _m5iSetze('_m5i-aufgabe', 'Aufgabe: <b style="color:' + K.A.text + '">' + _m5iFmt(z.a) +
            '</b> + <b style="color:' + K.B.text + '">' + _m5iFmt(z.b) + '</b> (schriftlich)');
  _m5iSetze('_m5i-spalte', z.zeile);
  let bei = '…';
  if (z.komplett) {
    const wo = z.schritte.filter(s => s.aus).map(s => _m5iKURZ[s.c]);
    bei = !wo.length ? 'nirgends' : wo.length === 1 ? wo[0]
        : wo.slice(0, -1).join(', ') + ' und ' + wo[wo.length - 1];
  }
  _m5iSetze('_m5i-uebertrag', 'Übertrag entstanden bei: ' + bei);
  _m5iSetze('_m5i-ergebnis', 'Ergebnis der Aufgabe: ' + (z.komplett ? _m5iFmt(z.a + z.b) : '…'));
  _m5iREIHE.forEach((k, i) => {
    const b = document.getElementById('_m5i-b-' + i);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  for (const id of ['_m5i-weiter', '_m5i-alles']) {
    const b = document.getElementById(id);
    if (!b) continue;
    b.disabled = z.komplett;
    if (b.style) b.style.opacity = z.komplett ? '0.45' : '';
  }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _m5iSetze('_m5i-pause', z.pause ? 'weiter' : 'Pause');
  // Nur das wechselnde Wort steht in einem eigenen <span> (Bauart wie in
  // m5-minus-schriftlich): So taucht die Knopfaufschrift „Halt beim Übertrag: aus“
  // (> 18 Zeichen) nicht als Statuszeile im Faktendump auf; im Bild steht sie ganz da.
  _m5iSetze('_m5i-halt-an', z.haltAn ? 'an' : 'aus');
  _m5iSetze('_m5i-tempo-an', z.langsam ? 'langsam' : 'normal');
  const hz = _m5iSetze('_m5i-lehrkraft', _m5iHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m5i-pause', z.pause], ['_m5i-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m5iHinweis() {
  const z = _m5i;
  if (z.halt) return 'Halt: 10 ' + _m5iNAME[z.halt.c] + ' werden zu 1 ' + _m5iNAME[z.halt.c + 1] +
                     '. Das ist der Übertrag.';
  if (z.pause) return 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  return 'Für die Lehrkraft: „Pause“ hält alles an. „Halt beim Übertrag“ stoppt von selbst.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m5iAufgabe(key) {
  if (!_m5i || !_m5iAUFGABEN[key]) return;
  _m5iLaden(key);
  _m5iStatus();
}
function _m5iNeu() {
  if (!_m5i) return;
  _m5iLaden('457+368');
  _m5iStatus();
}
function _m5iSpalte() {
  if (!_m5i) return;
  const z = _m5i;
  if (z.pause) {                                     // in der Pause: vormerken oder ignorieren (siehe Kopf)
    z.blink = 0.6;
    if (!z.lauf && z.fertig < z.schritte.length) { z.auto = false; z.vormerken = true; }
    return;
  }
  z.auto = false;
  if (z.lauf) _m5iFertig();
  if (z.fertig >= z.schritte.length) { z.wackel = 0.45; _m5iStatus(); return; }
  _m5iStart(z.fertig);
  _m5iStatus();
}
function _m5iAlles() {
  if (!_m5i) return;
  const z = _m5i;
  if (z.pause) {                                     // in der Pause vorgemerkt (siehe Kopf)
    z.blink = 0.6;
    if (z.lauf || z.fertig < z.schritte.length) { z.auto = true; if (!z.lauf) z.vormerken = true; }
    return;
  }
  if (z.fertig >= z.schritte.length && !z.lauf) { z.wackel = 0.45; return; }
  z.auto = true;
  if (!z.lauf) _m5iStart(z.fertig);
  _m5iStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
// „Pause“ ↔ „weiter“. Beim Weitermachen laeuft die Bewegung genau dort weiter,
// wo sie stand; eine vorgemerkte Spalte beginnt jetzt.
function _m5iAnhalten() {
  if (!_m5i) return;
  const z = _m5i;
  if (z.pause) {
    z.pause = false; z.halt = null; z.blink = 0;
    if (z.vormerken) {
      z.vormerken = false;
      if (!z.lauf && z.fertig < z.schritte.length) _m5iStart(z.fertig);
    }
  } else z.pause = true;
  _m5iStatus();
}
function _m5iHaltSchalter() {
  if (!_m5i) return;
  _m5i.haltAn = !_m5i.haltAn;
  _m5iStatus();
}
function _m5iTempo() {
  if (!_m5i) return;
  _m5i.langsam = !_m5i.langsam;
  _m5iStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m5iZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }
// Das Halt-Ereignis: die zehn Wuerfel liegen zusammen, gleich werden sie eine Stange.
function _m5iHalt(st) {
  const z = _m5i;
  z.pause = true; z.halt = { c: st.c };
  _m5iStatus();
}

// Platz k im Zwanzigerfeld (Mitte des Wuerfels).
function _m5iPlatz(k) {
  const K = _m5iK, j = k % 10;
  return { x: K.FXS + j * (K.W + K.LUECKE) + (j >= 5 ? K.FUENF - K.LUECKE : 0) + K.W / 2,
           y: (k < 10 ? K.FR1 : K.FR2) + K.W / 2 };
}
function _m5iCX(c) { return _m5iK.XR - (c + 0.5) * _m5iK.KA; }
// Spalte i beginnen: Wuerfel fliegen aus den Ziffern ins Zwanzigerfeld.
function _m5iStart(i) {
  const z = _m5i, K = _m5iK, st = z.schritte[i], cx = _m5iCX(st.c);
  const quellen = [];
  if (st.da !== null) for (let k = 0; k < st.da; k++) quellen.push(['A', K.R1 + K.KA / 2]);
  if (st.db !== null) for (let k = 0; k < st.db; k++) quellen.push(['B', K.R2 + K.KA / 2]);
  if (st.ue) quellen.push(['U', K.RU + K.UM]);
  const n = quellen.length, stag = n > 1 ? Math.min(0.04, 0.4 / (n - 1)) : 0;
  const wuerfel = quellen.map((q, k) => {
    const p = _m5iPlatz(k);
    return { art: q[0], x0: cx, y0: q[1], x1: p.x, y1: p.y, x: cx, y: q[1], s: 6, a: 0,
             verz: k * stag, mix: 0 };
  });
  z.lauf = { i, phase: 'fliegen', t: 0, wuerfel, stange: null,
             dauer: K.T_FLUG + (n ? (n - 1) * stag : 0) };
  z.band = 1; z.bandC = st.c;
  z.blase = 'spalte'; z.blaseI = i; z.blaseSumme = false; z.blaseT = 0;
  z.zeile = _m5iZeile(st, false, true);
}
// Die laufende Spalte sofort landen lassen (vor jeder neuen Bedienung).
function _m5iFertig() {
  const z = _m5i, L = z.lauf;
  if (!L) return;
  z.lauf = null;
  if (L.phase === 'pause') return;
  const st = z.schritte[L.i];
  if (st.aus) z.ueSicht[st.c + 1] = true;
  _m5iGelandet(st, false);
}
// Die Ergebnisziffer steht: Statuszeilen nachfuehren, ggf. abschliessen.
function _m5iGelandet(st, weiter) {
  const z = _m5i;
  z.ergSicht[st.c] = true; z.popE[st.c] = 0;
  z.fertig = Math.max(z.fertig, z.schritte.indexOf(st) + 1);
  z.zeile = _m5iZeile(st, true, true);
  z.blaseSumme = true;
  if (z.fertig >= z.schritte.length) {
    z.komplett = true; z.auto = false; z.strich2 = 0; z.endGlanz = 1.6;
    z.blase = 'ganz'; z.blaseT = 0;
    z.lauf = null;
  } else if (weiter && z.auto) {
    z.lauf = { i: -1, phase: 'pause', t: 0, wuerfel: [], stange: null, dauer: _m5iK.T_PAUSE };
  } else z.lauf = null;
  _m5iStatus();
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5iUpdate(dt) {
  if (!_m5i) return;
  const z = _m5i, K = _m5iK, E = _bioFxEase, kl = _bioFxKlemme;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);              // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m5iZeitfaktor(z);                      // ab hier Sim-Zeit: 0 Pause, 1/3 langsam, 1 normal
  z.t += dt; z.schreib += dt; z.blaseT += dt;
  for (const c in z.popU) z.popU[c] += dt;
  for (const c in z.popE) z.popE[c] += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.endGlanz = Math.max(0, z.endGlanz - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  if (z.komplett) z.strich2 = Math.min(1, z.strich2 + dt / 0.5);
  const L = z.lauf;
  if (!L || L.phase === 'pause') z.band = Math.max(0, z.band - dt / K.T_BAND);
  if (L && dt > 0) {                                 // ohne Zeit kein Schritt im Ablauf
    L.t += dt;
    const st = L.i >= 0 ? z.schritte[L.i] : null;
    if (L.phase === 'fliegen') {
      for (const w of L.wuerfel) {
        const u = kl((L.t - w.verz) / K.T_FLUG), e = E.sanft(u);
        w.x = w.x0 + (w.x1 - w.x0) * e;
        w.y = w.y0 + (w.y1 - w.y0) * e + 12 * Math.sin(Math.PI * e);   // leicht durchhaengend: bleibt unter der Sprechblase
        w.s = 6 + (K.W - 6) * e; w.a = kl(u * 4);
      }
      if (L.t >= L.dauer) { L.phase = 'halten'; L.t = 0; z.blaseSumme = true; }
    } else if (L.phase === 'halten') {
      if (L.t >= K.T_HALT) {
        L.t = 0;
        if (st.s >= 10) {
          L.phase = 'sammeln';
          L.wuerfel.forEach((w, k) => {
            w.x0 = w.x; w.y0 = w.y;
            if (k < 10) { w.x1 = K.BARX + k * K.W + K.W / 2; w.y1 = w.y; }
          });
        } else {
          L.phase = 'ziffer';
          _m5iZumErgebnis(L, st);
        }
      }
    } else if (L.phase === 'sammeln') {
      const u = kl(L.t / K.T_SAMMEL), e = E.sanft(u);
      L.wuerfel.forEach((w, k) => {
        if (k >= 10) return;
        w.x = w.x0 + (w.x1 - w.x0) * e; w.mix = kl((e - 0.6) / 0.4);   // erst am Ende bernstein, sonst wird es grau
      });
      if (u >= 1 && z.haltAn && !L.angehalten) {
        // HALT beim Uebertrag: die zehn Wuerfel liegen zusammen, noch nicht verschmolzen
        L.angehalten = true;
        _m5iHalt(st);
      } else if (u >= 1) {
        // verschmelzen: aus zehn Wuerfeln wird eine Stange
        L.stange = { x0: K.BARX + 5 * K.W, y0: K.FR1 + K.W / 2, w0: 10 * K.W, h0: K.W,
                     x1: _m5iCX(st.c + 1), y1: K.RU + K.UM, w1: 11, h1: 18,
                     x: K.BARX + 5 * K.W, y: K.FR1 + K.W / 2, w: 10 * K.W, h: K.W, morph: 0, blitz: 0.3 };
        L.wuerfel = L.wuerfel.slice(10);
        L.phase = 'uebertrag'; L.t = 0;
      }
    } else if (L.phase === 'uebertrag') {
      const u = kl(L.t / K.T_UEBER), e = E.sanft(u), S = L.stange;
      S.x = S.x0 + (S.x1 - S.x0) * e; S.y = S.y0 + (S.y1 - S.y0) * e - 26 * Math.sin(Math.PI * e);
      S.w = S.w0 + (S.w1 - S.w0) * e; S.h = S.h0 + (S.h1 - S.h0) * e;
      S.morph = kl((u - 0.55) / 0.45); S.blitz = Math.max(0, S.blitz - dt);
      if (u >= 1) {
        z.ueSicht[st.c + 1] = true; z.popU[st.c + 1] = 0;
        L.stange = null;
        if (z.key === '457+368' && st.c === 0 && !z.aha) {
          // Aha: die zehn Einer sind als kleine 1 bei den Zehnern angekommen
          z.aha = true; z.ahaGlanz = 2.6;
          _bioFxWelle(z.fx.teile, _m5iCX(1), K.RU + K.UM, '#f59e0b', 34);
        }
        L.phase = 'ziffer'; L.t = 0;
        _m5iZumErgebnis(L, st);
      }
    } else if (L.phase === 'ziffer') {
      const u = kl(L.t / L.dauer), e = E.sanft(u);
      for (const w of L.wuerfel) {
        w.x = w.x0 + (w.x1 - w.x0) * e; w.y = w.y0 + (w.y1 - w.y0) * e - 14 * Math.sin(Math.PI * e);
        w.s = K.W + (5 - K.W) * e; w.a = 1 - kl((u - 0.75) / 0.25);
      }
      if (u >= 1) _m5iGelandet(st, true);
    } else if (L.phase === 'pause') {
      if (L.t >= L.dauer) { z.lauf = null; _m5iStart(z.fertig); _m5iStatus(); }
    }
  }
  _bioFxUpdate(z.fx.teile, dt);
}
// Die uebrigen Wuerfel machen sich auf den Weg ins Ergebniskaestchen.
function _m5iZumErgebnis(L, st) {
  const K = _m5iK, x1 = _m5iCX(st.c), y1 = K.RE + K.KA / 2;
  for (const w of L.wuerfel) { w.x0 = w.x; w.y0 = w.y; w.x1 = x1; w.y1 = y1; }
  L.dauer = L.wuerfel.length ? K.T_ZIFFER : 0.35;
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5iMisch(h1, h2, u) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const a = p(h1), b = p(h2);
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * u)).join(',') + ')';
}
function _m5iText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m5iK.F_ERG;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Ziffer mit Einschreiben (a: 0..1) und kleinem Federn (pop in s seit Erscheinen).
function _m5iZiffer(ctx, s, x, y, groesse, farbe, a, pop) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  const k = pop !== undefined && pop < 0.35 ? Math.max(0.3, _bioFxEase.federn(pop / 0.35)) : 1;
  ctx.translate(x, y - groesse * 0.36);
  ctx.scale(k, k);
  _m5iText(ctx, s, 0, groesse * 0.36 + (1 - Math.min(1, a)) * -6, groesse, farbe);
  ctx.restore();
}
function _m5iWuerfel(ctx, x, y, s, art, mix, a) {
  if (a <= 0.01 || s <= 0.5) return;
  const K = _m5iK, F = K[art], U = K.U;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = mix > 0 ? _m5iMisch(F.fuell, U.fuell, mix) : F.fuell;
  ctx.strokeStyle = mix > 0 ? _m5iMisch(F.rand, U.rand, mix) : F.rand;
  ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x - s / 2, y - s / 2, s, s, Math.min(3, s / 4)); ctx.fill(); ctx.stroke();
  if (s > 9) {                                       // Lichtkante: sieht aus wie ein Wuerfel
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x - s / 2 + 2.5, y + s / 2 - 3); ctx.lineTo(x - s / 2 + 2.5, y - s / 2 + 2.5);
    ctx.lineTo(x + s / 2 - 3, y - s / 2 + 2.5); ctx.stroke();
  }
  ctx.restore();
}
function _m5iStange(ctx, S) {
  const K = _m5iK, U = K.U, x = S.x - S.w / 2, y = S.y - S.h / 2;
  const a = 1 - S.morph;
  if (a > 0.01) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = U.fuell; ctx.strokeStyle = U.rand; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, x, y, S.w, S.h, Math.min(3, S.h / 4)); ctx.fill(); ctx.stroke();
    if (S.w > 40) {                                   // Fugen der zehn Wuerfel, Fuenfermarke dicker
      for (let k = 1; k < 10; k++) {
        ctx.lineWidth = k === 5 ? 2.2 : 0.8;
        ctx.beginPath(); ctx.moveTo(x + S.w * k / 10, y); ctx.lineTo(x + S.w * k / 10, y + S.h); ctx.stroke();
      }
    }
    if (S.blitz > 0) {
      ctx.globalAlpha = a * S.blitz / 0.3 * 0.8; ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 2, y - 2, S.w + 4, S.h + 4);
    }
    ctx.restore();
  }
  if (S.morph > 0) {
    ctx.save(); ctx.globalAlpha = S.morph;
    _m5iText(ctx, '1', S.x, S.y + K.GU * 0.36, K.GU, U.text);
    ctx.restore();
  }
}
function _m5iPapier(ctx) {
  const K = _m5iK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  for (let x = K.XR; x > K.PX0 + 1; x -= K.KA) {
    ctx.beginPath(); ctx.moveTo(x, K.PY0 + 1); ctx.lineTo(x, K.PY1 - 1); ctx.stroke();
  }
  for (let y = K.Y0; y < K.PY1 - 1; y += K.KA) {
    ctx.beginPath(); ctx.moveTo(K.PX0 + 1, y); ctx.lineTo(K.PX1 - 1, y); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.stroke();
  ctx.restore();
}
function _m5iBlatt(ctx) {
  const z = _m5i, K = _m5iK, n = z.stellen;
  // Band ueber der Spalte, die gerade gerechnet wird
  if (z.band > 0.01) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.band);
    const x = K.XR - (z.bandC + 1) * K.KA;
    ctx.fillStyle = 'rgba(254,240,138,0.6)'; ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, x + 1.5, K.Y0 + 1.5, K.KA - 3, K.RF - K.Y0 - 3, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // Kopfzeile: H Z E (T nur bei vier Stellen)
  for (let c = 0; c < n; c++) {
    const aktiv = z.band > 0.01 && z.bandC === c;
    _m5iText(ctx, _m5iKURZ[c], _m5iCX(c), K.Y0 + 25, K.GK, aktiv ? '#1f2937' : '#64748b');
  }
  // obere und untere Zahl, von links nach rechts eingeschrieben
  const zahl = (wert, zeile, farbe, start) => {
    const s = String(wert);
    for (let i = 0; i < s.length; i++) {
      const c = s.length - 1 - i;
      const a = (z.schreib - start - i * 0.07) / 0.22;
      _m5iZiffer(ctx, s[i], _m5iCX(c), zeile + K.BL, K.GZ, farbe, a);
    }
  };
  zahl(z.a, K.R1, K.A.text, 0);
  zahl(z.b, K.R2, K.B.text, 0.22);
  const plusC = n;                                    // Pluszeichen links vor dem Block
  _m5iZiffer(ctx, '+', _m5iCX(plusC), K.R2 + K.BL, K.GZ, K.F_LINIE, (z.schreib - 0.4) / 0.2);
  // Strich unter der Uebertragszeile, zieht sich von rechts nach links durch
  const u = _bioFxKlemme((z.schreib - 0.35) / 0.3);
  if (u > 0) {
    const xl = K.XR - (plusC + 1) * K.KA + 5;
    ctx.save(); ctx.strokeStyle = K.F_LINIE; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(K.XR - 2, K.RE); ctx.lineTo(K.XR - 2 - (K.XR - 2 - xl) * u, K.RE); ctx.stroke();
    ctx.restore();
  }
  // Uebertraege: klein, bernsteinfarben, im unteren Teil der Zeile
  for (const c in z.ueSicht) {
    const cx = _m5iCX(+c), cy = K.RU + K.UM;
    if (z.ahaGlanz > 0 && +c === 1 && z.key === '457+368') {
      ctx.save(); ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.8);
      _bioFxLeuchten(ctx, cx, cy, 11, z.t, '245,158,11');
      ctx.restore();
    }
    _m5iZiffer(ctx, '1', cx, cy + K.GU * 0.36, K.GU, K.U.text, 1, z.popU[c]);
  }
  // Ergebnis
  const wk = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0;
  if (z.endGlanz > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, z.endGlanz / 0.6) * (0.6 + 0.4 * Math.sin(z.t * 6));
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    const xl = K.XR - z.schritte.length * K.KA;
    _bioFxRundRect(ctx, xl - 2, K.RE + 3, K.XR - xl + 4, K.KA - 5, 7); ctx.stroke();
    ctx.restore();
  }
  for (const st of z.schritte) {
    if (!z.ergSicht[st.c]) continue;
    _m5iZiffer(ctx, String(st.ziffer), _m5iCX(st.c) + wk, K.RE + K.BL, K.GZ, K.F_ERG, 1, z.popE[st.c]);
  }
  // doppelt unterstrichen, wenn alles gerechnet ist
  if (z.komplett && z.strich2 > 0) {
    const xl = K.XR - (plusC + 1) * K.KA + 5, xr = K.XR - 2, xm = xr - (xr - xl) * z.strich2;
    ctx.save(); ctx.strokeStyle = K.F_LINIE; ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (const y of [K.RF + 3, K.RF + 7]) { ctx.beginPath(); ctx.moveTo(xr, y); ctx.lineTo(xm, y); ctx.stroke(); }
    ctx.restore();
  }
}
// Sprechblase: vor dem Rechnen die Aufgabe, dann die Spalte, am Ende alles.
// Gesetzt wird Zeichen fuer Zeichen (Zahl, „+“, „=“) mit festem Abstand, nicht
// ueber Leerzeichen: so steht der Text in jeder Darstellung gleich.
function _m5iBlase(ctx) {
  const z = _m5i, K = _m5iK;
  let teile;
  if (z.blase === 'spalte') {
    const st = z.schritte[z.blaseI];
    teile = [];
    _m5iTeile(st).forEach((p, i) => {
      if (i) teile.push(['+', K.F_ERG]);
      teile.push([p[0], K[p[1]].text]);
    });
    teile.push(['=', K.F_ERG]);
    if (z.blaseSumme) teile.push([String(st.s), K.F_ERG]);
  } else {
    teile = [[_m5iFmt(z.a), K.A.text], ['+', K.F_ERG], [_m5iFmt(z.b), K.B.text], ['=', K.F_ERG],
             [z.blase === 'ganz' ? _m5iFmt(z.a + z.b) : '?', K.F_ERG]];
  }
  const a = Math.min(1, z.blaseT / 0.25);
  ctx.save();
  // Blase mit Spitze nach links, zum Rechenblatt
  ctx.fillStyle = '#fefce8'; ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, K.BX0, K.BY0, K.BX1 - K.BX0, K.BY1 - K.BY0, 12); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(K.BX0 + 1, K.BY0 + 15); ctx.lineTo(K.PX1 + 3, K.BY0 + 22);
  ctx.lineTo(K.BX0 + 1, K.BY0 + 29); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(K.BX0, K.BY0 + 15); ctx.lineTo(K.PX1 + 3, K.BY0 + 22);
  ctx.lineTo(K.BX0, K.BY0 + 29); ctx.stroke();
  ctx.globalAlpha = 0.25 + 0.75 * a;
  const platz = K.BX1 - K.BX0 - 20;
  let gr = 22, br, luft, ges;
  const messen = () => {
    ctx.font = '700 ' + gr + 'px sans-serif';
    br = teile.map(t => ctx.measureText(t[0]).width);
    luft = gr * 0.32;
    ges = br.reduce((p, q) => p + q, 0) + luft * (teile.length - 1);
  };
  messen();
  if (ges > platz) { gr = Math.max(15, Math.floor(gr * platz / ges)); messen(); }
  let x = (K.BX0 + K.BX1) / 2 - ges / 2;
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  teile.forEach((t, i) => {
    ctx.fillStyle = t[1];
    ctx.fillText(t[0], x, (K.BY0 + K.BY1) / 2 + gr * 0.36);
    x += br[i] + luft;
  });
  ctx.restore();
}
function _m5iFeld(ctx) {
  const z = _m5i, K = _m5iK;
  ctx.save();
  ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.FX0, K.FY0, K.FX1 - K.FX0, K.FY1 - K.FY0, 9); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  for (let k = 0; k < 20; k++) {
    const p = _m5iPlatz(k);
    _bioFxRundRect(ctx, p.x - K.W / 2, p.y - K.W / 2, K.W, K.W, 3); ctx.stroke();
  }
  ctx.restore();
  // Farbschluessel
  const zeilen = [['A', 'Würfel aus ' + _m5iFmt(z.a)], ['B', 'Würfel aus ' + _m5iFmt(z.b)], ['U', 'Übertrag']];
  zeilen.forEach((zl, i) => {
    const y = K.LY + i * 22;
    _m5iWuerfel(ctx, K.FX0 + 12, y - 5, 13, zl[0], 0, 1);
    _m5iText(ctx, zl[1], K.FX0 + 26, y, 14, K[zl[0]].text, 'left', '600');
  });
}
function _m5iDraw(ctx, cv) {
  if (!_m5i) return;
  const z = _m5i, K = _m5iK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m5iPapier(ctx);
  _m5iBlatt(ctx);
  _m5iFeld(ctx);
  _m5iBlase(ctx);
  const L = z.lauf;
  if (L) {
    if (z.halt && L.phase === 'sammeln') _m5iHaltRahmen(ctx);
    for (const w of L.wuerfel) _m5iWuerfel(ctx, w.x, w.y, w.s, w.art, w.mix, w.a);
    if (L.stange) _m5iStange(ctx, L.stange);
  }
  _bioFxDraw(ctx, z.fx.teile);
  if (z.halt) _m5iHaltSchild(ctx, z.halt.c);
  if (z.pause) _m5iPauseSchild(ctx);
}
// Halt: die zehn zusammengeschobenen Wuerfel der oberen Reihe einrahmen (hinter den Wuerfeln).
function _m5iHaltRahmen(ctx) {
  const K = _m5iK;
  ctx.save();
  ctx.fillStyle = 'rgba(252,211,77,0.38)'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.5;
  _bioFxRundRect(ctx, K.BARX - 5, K.FR1 - 4, 10 * K.W + 10, K.W + 8, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Halt: Beschriftung unten auf dem Rechenblatt, unter der Ergebniszeile.
function _m5iHaltSchild(ctx, c) {
  const K = _m5iK, s = '10 ' + _m5iNAME[c] + ' = 1 ' + _m5iNAME[c + 1];
  const x0 = K.PX0 + 8, x1 = K.PX1 - 8, y0 = K.RF + 10, y1 = K.PY1 - 7;
  ctx.save();
  ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.5;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 9); ctx.fill(); ctx.stroke();
  let gr = 18;
  ctx.font = '700 ' + gr + 'px sans-serif';
  const br = ctx.measureText(s).width, platz = x1 - x0 - 16;
  if (br > platz) gr = Math.max(13, Math.floor(gr * platz / br));
  _m5iText(ctx, s, (x0 + x1) / 2, (y0 + y1) / 2 + gr * 0.36, gr, '#78350f');
  ctx.restore();
}
// Schild „Pause“ oben links auf dem Rechenblatt, links neben der Kopfzeile H Z E –
// gleiche Stelle, gleiche Groesse, gleiche Farbe wie in m5-minus-schriftlich, damit
// die Lehrkraft es in beiden Simulationen am selben Ort findet. Leuchtet kurz auf,
// wenn waehrend der Pause „nächste Spalte“ oder „alles rechnen“ gedrueckt wird.
function _m5iPauseSchild(ctx) {
  const z = _m5i, w = 64, h = 25, x = 8, y = 8;       // endet vor dem Band der Hunderterspalte (x = 78)
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
  _m5iText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
