

// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mr6 „Wie geht das Muster weiter?“
// (Kennung m5-folgen, Praefix _m6f)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL5_PROFIL.md, Abschnitt m5-folgen
// (Einheit mr6; Regeln N1–N3, Lehrkraft-Zeile wie Kapitel 4), genauer
// gefasst in einheiten/mr6.json → seite.sim_plan: 0,2 s je Staebchen (V7),
// Startzeilen, „die Sprungmarken legen immer Quadrate“, „nächste Figur“ auf
// leerem Tisch legt Figur 1.
// Ueberschrift laut Bauplan: „Wie viele Stäbchen braucht Figur 4?“ (die
// `frage` der Einheit nennt Leni).
//
// Was man sieht – zwei Darstellungen, durch FARBE und Aufleuchten verbunden:
//   TISCH (oben, Karopapier, Kaestchen 15 px): Holzstaebchen als braune
//     Balken, je 2 Kaestchen lang, an beiden Enden eine kleine Luecke – so
//     ist jedes Staebchen einzeln zu zaehlen (Strukturregel MATHE_PROFIL
//     § 10.10). Figur n = n Quadrate in einer Reihe; benachbarte Quadrate
//     teilen sich ein Staebchen. Die zuletzt dazugekommenen Staebchen sind
//     ORANGE, die alten braun. Ueber der Figur klein „Figur 4“.
//   LEISTE (unter dem Tisch): eine kleine Tabelle mit den Zeilen „Figur“ und
//     „Stäbchen“, je gebauter Figur eine Spalte (1 | 4 · 2 | 7 · 3 | 10 …).
//     Zwischen zwei Staebchenzahlen ein ORANGER Bogen mit „+ 3“ darunter –
//     orange wie die neuen Staebchen. Ist eine Figur fertig, springt ihre
//     Zahl federnd herein und leuchtet bernsteinfarben (0,9 s), der Bogen
//     waechst von links nach rechts (0,3 s), dann kommt „+ 3“.
//   „anderes Muster“: Dreiecke in einer Reihe, abwechselnd mit der Spitze
//     nach oben und unten (Seite 2 Kaestchen); Bogen „+ 2“.
//
// Bewegung (jede Handlung bewegt sich; alles ist eine Funktion der
// Ablaufzeit L.t, Konstanten in _m6fK – keine Zufallszahl):
//   Sprungmarke „Figur n“  der Tisch leert sich (0,15 s: alte Figur und alte
//       Leiste blenden aus), dann faellt Staebchen fuer Staebchen von oben
//       ein (0,2 s je Staebchen): erst die 4 von Quadrat 1, dann je Quadrat
//       3. Die Staebchen des Quadrats, das gerade entsteht, sind orange;
//       beginnt das naechste, werden sie braun (0,2 s). Schliesst sich ein
//       Quadrat, steht Figur k auf dem Tisch: ihre Spalte erscheint in der
//       Leiste. Am Ende sind die 3 Staebchen des letzten Quadrats orange
//       (bei Figur 1 alle 4).
//       GEMESSEN (Frames zu 16 ms, Tempo normal): Figur 1 nach 0,95 s
//       (60 Frames), Figur 2 nach 1,55 s (97), Figur 3 nach 2,15 s (135),
//       Figur 4 nach 2,75 s (172) fertig – unter 3 s (V7). simfakten.js
//       deshalb mit --frames=50 --verlauf=3 (liest bis Frame 200).
//   „nächste Figur“  die Figur bleibt liegen, ihre orangen Staebchen werden
//       braun (0,2 s); 3 orange Staebchen fliegen nacheinander von oben rechts
//       im Bogen an und drehen sich dabei in ihre Lage (je 0,45 s, Abstand
//       0,25 s – das letzte liegt nach 1,1 s = 69 Frames). Dann ist das Quadrat
//       zu, die neue Spalte erscheint mit ihrem Bogen „+ 3“. Auf leerem Tisch
//       fliegen die 4 Staebchen von Figur 1 an (1,35 s = 85 Frames).
//   „2-mal Figur 2“  der Tisch leert sich; zwei Figuren 2 erscheinen mit
//       Abstand (0,4 s), in der Leiste unter jeder „2 | 7“. Ab 1,0 s gleitet
//       die rechte an die linke heran (0,8 s). Bei 1,8 s liegen an der
//       Beruehrstelle zwei Staebchen uebereinander: das obere wird orange und
//       hebt sich sichtbar ab (Schatten). Ab 2,05 s hebt es sich und fliegt
//       oben rechts hinaus (0,7 s). Bei 2,75 s (172 Frames) liegt eine Figur
//       mit 4 Quadraten da, ueber ihr „Figur 4“, in der Leiste „4 | 13“.
//       (Bei Dreiecken genauso: 5 + 5, eines liegt doppelt, 9.)
//   „anderes Muster“ wechselt Quadrate ↔ Dreiecke und baut die Figur mit
//       derselben Nummer im anderen Muster neu auf wie eine Sprungmarke (auf
//       leerem Tisch Figur 1). Die Sprungmarken legen immer Quadrate.
//   „neu“  sofort zurueck zum Start (Quadrate, leerer Tisch).
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort
// ankommen (dann ohne Lichtring); dann geschieht das Neue. Jede Knopffolge
// endet so in denselben Zahlen.
// Grenze: Figur 10 (Quadrate 31, Dreiecke 21 Staebchen). „nächste Figur“
// darueber: die Figur wackelt, _m6f-grenze zeigt „Mehr Figuren passen nicht
// auf den Tisch.“ (bis zur naechsten Handlung; sonst ausgeblendet).
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6fMarke('f1') …):
//     „Figur 1“ · „Figur 2“ · „Figur 3“ · „Figur 4“
//   Reihe 2: „nächste Figur“ (_m6fNaechste()) · „2-mal Figur 2“ (_m6fDoppelt())
//            · „anderes Muster“ (_m6fMuster()) · „neu“ (_m6fNeu())
// Hervorgehoben: die Sprungmarke, deren Figur (aus Quadraten) gerade daliegt
// oder gebaut wird; „2-mal Figur 2“, solange seine Figur daliegt; „anderes
// Muster“, solange Dreiecke gelegt werden.
//
// Statuszeilen (woertlich aus dem Bauplan, jede mit mehr als 18 Zeichen –
// simfakten.js). Sie folgen dem Bild: Eine Anzahl steht erst da, wenn die
// Figur fertig im Bild liegt; solange sie entsteht, steht „…“.
//   _m6f-figur     „Gewählt ist Figur 4 (4 Quadrate)“ · „Gewählt ist Figur 1
//                  (1 Quadrat)“ · „… (4 Dreiecke)“ / „… (1 Dreieck)“ ·
//                  „Gewählt ist 2-mal Figur 2 (4 Quadrate)“ · Start „Gewählt
//                  ist noch keine Figur“ (die Wahl steht sofort da)
//   _m6f-neu       „Neue Stäbchen bei dieser Figur: 3“ (Figur 1: „…: 4“,
//                  Start „…: keine“)
//   _m6f-zusammen  „Stäbchen zusammen: 13“ (Start „Stäbchen zusammen: 0“)
//   _m6f-bisher    „Stäbchen der Figuren bisher: 4, 7, 10, 13“ (Start „…:
//                  keine“) – genau die Spalten der Leiste
//   nur nach „2-mal Figur 2“ (dann sind _m6f-neu und _m6f-bisher
//   ausgeblendet; die Figur ist nicht Schritt fuer Schritt entstanden):
//   _m6f-doppelt   „2-mal Figur 2: 7 + 7 = 14“, wenn beide Figuren liegen,
//                  „2-mal Figur 2: 7 + 7 = 14, zusammengeschoben 13“, wenn
//                  das Staebchen weg ist. _m6f-zusammen zaehlt mit: 14, dann 13.
//   _m6f-grenze    nur an der Grenze (siehe oben)
// Zwischen Zahl und Rechenzeichen steht ein geschuetztes Leerzeichen (U+00A0).
//
// Werte (jede Zahl aus _m6fStaebe(), der Liste, nach der auch gezeichnet
// wird; nachgerechnet mit simcheck/werte.js):
//   Quadrate  Figur 1 → neu 4, zusammen 4 · Figur 2 → 3, 7 · Figur 3 → 3, 10
//             · Figur 4 → 3, 13 · Figur 5 → 3, 16 · … · Figur 10 → 3, 31
//             („Figur 1“ + „nächste Figur“ = „Figur 2“: 3, 7, bisher 4, 7)
//   Dreiecke  Figur 1 → 3, 3 · Figur 2 → 2, 5 · Figur 3 → 2, 7 · Figur 4 →
//             2, 9 · Figur 10 → 2, 21
//   2-mal Figur 2 → 7 + 7 = 14, zusammengeschoben 13 (Dreiecke 5 + 5 = 10,
//             zusammengeschoben 9). Die 13 kommt aus der Zeichnung: 14
//             Staebchen minus die, die nach dem Zusammenschieben genau auf
//             einem anderen liegen (geometrisch gesucht, es ist genau eines).
// Start: Tisch leer, Quadrate („Start: noch keine Figur gelegt“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen):
//   Ist mit „nächste Figur“ Figur 4 (Quadrate) fertig: ein Lichtring breitet
//     sich um die Figur aus, ein bernsteinfarbener Rahmen pulsiert 2,2 s um
//     sie, ihre 13 leuchtet. Das widerlegt „14“ und „16“.
//   „2-mal Figur 2“: ein oranger Lichtring um das Staebchen, das doppelt lag,
//     in dem Augenblick, in dem sich die Figuren beruehren.
//   Beides nur bei natuerlichem Ende, nicht wenn ein Knopfdruck die Bewegung
//   sofort ankommen laesst.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-punktefeld / m5-reihenfolge, Container
// <div class="fpm-lehrkraft">, den simfakten.js ueberspringt). Eigene Zeile
// UNTER den Heftknoepfen, davor klein „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6fAnhalten()): friert jede Bewegung sofort ein;
//     Schild „Pause“ oben links im Bild (Stelle wie in m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6fTempo()): ein Drittel so schnell.
//   „Zahlen verdecken: aus“ ↔ „… an“ (_m6fVerdecken()): verdeckt die
//     Staebchenzahlen und die „+ 3“ in der Leiste (graue Karten mit „?“) und
//     die Anzahlen in den Statuszeilen („verdeckt“). Staebchen, Farben,
//     Boegen und die Figurnummern bleiben: zum Vermuten an der Tafel.
//   Nur das wechselnde Wort steht in einem eigenen <span>.
// Hinweiszeile _m6f-lehrkraft (in der Pause „lmp-status off“, sonst „on“):
//   sonst    „Für die Lehrkraft: „Pause“ hält alles an. „Zahlen verdecken“ lässt erst vermuten.“
//   verdeckt „Zahlen verdeckt. Erst vermuten lassen, dann wieder aufdecken.“
//   Pause    „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
// So ist es gebaut: EIN Zeitfaktor (_m6fZeitfaktor: 0 Pause, 1/3 langsam,
// 1 normal) an der einen Stelle, an der dt in _m6fUpdate hineingeht; ohne
// Zeit kein Schritt im Ablauf. In der Pause bewegen „nächste Figur“, „2-mal
// Figur 2“ und „anderes Muster“ nichts: Steht eine Bewegung, entfaellt der
// Druck; steht keine, wird er VORGEMERKT und beginnt mit „weiter“ (das
// Schild „Pause“ leuchtet kurz auf, in echter Zeit). Sprungmarke und „neu“
// heben die Pause auf; Tempo und Verdecken bleiben stehen. Voreinstellung:
// Pause aus, Tempo normal, Verdecken aus – dann laeuft alles wie ohne
// Lehrkraft-Zeile.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Zahlenfolge“, „Regel“,
// „immer + 3“ (die Regel als Satz), „doppelt so viele“. Keine Namen, keine
// Punkte, keine Zeitmessung, kein „falsch“. Deterministisch, ohne Zufall.
// ════════════════════════════════════════════════════════════════════════
let _m6f = null;
const _m6fMARKEN = { f1: 1, f2: 2, f3: 3, f4: 4 };
const _m6fREIHE = ['f1', 'f2', 'f3', 'f4'];
const _m6fK = {
  KA: 15,                                   // Kaestchen (px)
  // Tisch (Karopapier) und Leiste darunter
  TX0: 4, TX1: 416, TY0: 4, TY1: 160,
  LX0: 4, LX1: 416, LY0: 166, LY1: 246,
  // Figur: linke Kante, Ober- und Unterkante der Quadrate, Spitze der Dreiecke
  X0: 60, YO: 75, YU: 105, YD: 79,
  S: 30,                                    // Staebchenlaenge = 2 Kaestchen
  DICKE: 3,                                 // halbe Dicke eines Staebchens
  RAND: 3,                                  // Luecke an jedem Ende
  LY: 64,                                   // Grundlinie „Figur 4“ ueber der Figur
  // Leiste: Kopfspalte, erste Spalte, Spaltenabstand, Grundlinien
  KX: 12, TRENN: 76, CX0: 96, CS: 34, FY: 183, LINIE: 191, SY: 210,
  BY0: 216, BY1: 232, PY: 242,
  MAXN: 10, GAP: 45,
  // Zeiten (s)
  T_LEER: 0.15, T_STAB: 0.2,                // Sprungmarke: Tisch leeren, je Staebchen
  T_N0: 0.15, T_NABST: 0.25, T_NFLUG: 0.45, // nächste Figur
  T_DPOP: 0.4, D_GLEIT0: 1.0, T_GLEIT: 0.8, D_TREFF: 1.8, D_HEB: 2.05, D_ENDE: 2.75,
  T_FARBE: 0.2, T_POP: 0.35, T_GLANZ: 0.9, T_BOGEN: 0.3, T_AHA: 2.2, LANGSAM: 1 / 3,
  // Farben
  HOLZ: '#b07a3e', HOLZ_R: '#6b4423', OR: '#fb923c', OR_R: '#c2410c', OR_T: '#c2410c',
  DUNKEL: '#111827', GRAU: '#64748b', KARO: '#d4e3f1', AMBER: '#d97706'
};
const _m6fNB = ' ';

// ── Die Figuren: EINE Liste, nach der gezeichnet UND gezaehlt wird ─────────
// Staebchen in der Reihenfolge, in der sie gelegt werden; f = die Figur, mit
// der das Staebchen dazukommt. dx verschiebt die ganze Figur nach rechts.
function _m6fStaebe(muster, n, dx) {
  const K = _m6fK, S = K.S, x0 = K.X0 + (dx || 0), out = [];
  const st = (x1, y1, x2, y2, f) => out.push({ x1, y1, x2, y2, f });
  if (muster === 'q') {
    for (let k = 0; k < n; k++) {
      const a = x0 + k * S, b = a + S;
      if (k === 0) st(a, K.YU, a, K.YO, 1);  // links (nur das erste Quadrat)
      st(a, K.YO, b, K.YO, k + 1);            // oben
      st(b, K.YO, b, K.YU, k + 1);            // rechts
      st(b, K.YU, a, K.YU, k + 1);            // unten
    }
  } else {
    // Dreiecke: Grundpunkte B(i) unten, Spitzen T(i) oben
    const B = i => [x0 + i * S, K.YU], T = i => [x0 + S / 2 + i * S, K.YD];
    const kante = (p, q, f) => st(p[0], p[1], q[0], q[1], f);
    for (let k = 0; k < n; k++) {
      const m = k >> 1;
      if (k === 0) { kante(B(0), T(0), 1); kante(T(0), B(1), 1); kante(B(1), B(0), 1); }
      else if (k % 2) { kante(T(m), T(m + 1), k + 1); kante(T(m + 1), B(m + 1), k + 1); }   // Spitze unten
      else { kante(B(m), B(m + 1), k + 1); kante(B(m + 1), T(m), k + 1); }                  // Spitze oben
    }
  }
  return out;
}
function _m6fZahl(muster, n) { return _m6fStaebe(muster, n, 0).length; }
function _m6fDazu(muster, n) { return n ? _m6fStaebe(muster, n, 0).filter(s => s.f === n).length : 0; }
function _m6fBreite(muster, n) { const S = _m6fK.S; return !n ? 0 : muster === 'q' ? n * S : (n + 1) * S / 2; }
function _m6fOben(muster) { return muster === 'q' ? _m6fK.YO : _m6fK.YD; }
// Liegen zwei Staebchen genau aufeinander (in einer der beiden Richtungen)?
function _m6fDeckt(a, b) {
  const d = (x, y) => Math.abs(x) < 0.5 && Math.abs(y) < 0.5;
  return (d(a.x1 - b.x1, a.y1 - b.y1) && d(a.x2 - b.x2, a.y2 - b.y2)) ||
         (d(a.x1 - b.x2, a.y1 - b.y2) && d(a.x2 - b.x1, a.y2 - b.y1));
}
// „2-mal Figur 2“: zwei Figuren 2, die rechte um eine Figurbreite verschoben.
// geteilt = die Staebchen der rechten, die dann auf einem der linken liegen.
function _m6fDoppelLage(muster) {
  const K = _m6fK, schub = muster === 'q' ? 2 * K.S : K.S;
  const eins = _m6fStaebe(muster, 2, 0), zwei = _m6fStaebe(muster, 2, schub);
  const geteilt = [];
  zwei.forEach((s, j) => { if (eins.some(e => _m6fDeckt(e, s))) geteilt.push(j); });
  const a = eins.length;
  return { muster, schub, eins, zwei, geteilt, a, ganz: 2 * a - geteilt.length };
}

function _m6fInit() {
  _m6f = { t: 0, muster: 'q', n: 0, ab: 1, modus: 'folge', orange: 0, lauf: null,
           fx: [], popT: {}, dPopT: -9, ahaGlanz: 0, wackel: 0, grenze: '', stand: '',
           pause: false, blink: 0, vormerk: null,                  // Lehrkraft
           langsam: false, verdeckt: false };
}
function _m6fHTML() {
  const marke = k => `<button class="sim-btn" id="_m6f-b-${k}" onclick="_m6fMarke('${k}')">Figur&nbsp;${_m6fMARKEN[k]}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Stäbchen braucht Figur&nbsp;4?</h3>
    <div class="fpm-note" style="margin-top:2px">Neue Stäbchen sind orange. Zähle mit.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6f-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6fREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_m6fNaechste()">nächste Figur</button>
          <button class="sim-btn" id="_m6f-b-doppelt" onclick="_m6fDoppelt()">2-mal Figur&nbsp;2</button>
          <button class="sim-btn" id="_m6f-b-muster" onclick="_m6fMuster()">anderes Muster</button>
          <button class="sim-btn" onclick="_m6fNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6f-pause" onclick="_m6fAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6f-tempo" onclick="_m6fTempo()">Tempo: <span id="_m6f-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6f-verdeckt" onclick="_m6fVerdecken()">Zahlen verdecken: <span id="_m6f-verdeckt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6f-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6f-figur" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6f-neu" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6f-zusammen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6f-bisher" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6f-doppelt" style="margin-top:6px;display:none"></div>
        <div class="lmp-status off" id="_m6f-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: noch keine Figur gelegt</p>
  </div>`;
}
function _m6fSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Zeile setzen und nur zeigen, wenn sie etwas sagt.
function _m6fZeige(id, html) {
  const e = _m6fSetze(id, html);
  if (e && e.style) e.style.display = html ? '' : 'none';
}
// Was die Anzeige gerade sagen darf – sie folgt dem Bild, nicht dem Knopf.
//   mod     'folge' | 'doppelt'
//   n       die gewaehlte Figur (steht sofort da)
//   fertig  liegt sie schon fertig im Bild?
//   von…bis die Spalten der Leiste (Figurnummern), die schon dastehen
//   dStufe  bei „2-mal Figur 2“: 0 noch nichts, 1 beide liegen, 2 zusammengeschoben
function _m6fLage(z) {
  const K = _m6fK, L = z.lauf;
  const g = { mod: z.modus, muster: z.muster, n: z.n, fertig: !L, von: z.ab, bis: z.n,
              dStufe: z.modus === 'doppelt' ? 2 : 0 };
  if (L && L.art === 'bau') { g.mod = 'folge'; g.n = L.ziel; g.muster = L.muster; g.von = 1; g.bis = L.fertig; }
  else if (L && L.art === 'naechste') { g.n = L.von + 1; g.bis = L.von; }
  else if (L && L.art === 'doppelt') { g.mod = 'doppelt'; g.n = 4; g.dStufe = L.t >= K.T_LEER + K.T_DPOP ? 1 : 0; }
  return g;
}
function _m6fStand(z) {
  const g = _m6fLage(z);
  return [g.mod, g.muster, g.n, g.fertig, g.von, g.bis, g.dStufe, z.pause, z.langsam,
          z.verdeckt, z.grenze, z.lauf ? z.lauf.art : ''].join('|');
}
function _m6fStatus() {
  if (!_m6f) return;
  const z = _m6f, g = _m6fLage(z), NB = _m6fNB;
  const zahl = v => (z.verdeckt ? 'verdeckt' : String(v));
  const form = n => n + ' ' + (g.muster === 'q' ? (n === 1 ? 'Quadrat' : 'Quadrate') : (n === 1 ? 'Dreieck' : 'Dreiecke'));
  let figur;
  if (g.mod === 'doppelt') figur = 'Gewählt ist 2-mal Figur 2 (' + form(4) + ')';
  else if (!g.n) figur = 'Gewählt ist noch keine Figur';
  else figur = 'Gewählt ist Figur ' + g.n + ' (' + form(g.n) + ')';
  _m6fSetze('_m6f-figur', figur);
  if (g.mod === 'folge') {
    const liste = [];
    for (let k = g.von; k <= g.bis; k++) liste.push(_m6fZahl(g.muster, k));
    _m6fZeige('_m6f-neu', 'Neue Stäbchen bei dieser Figur: ' +
              (!g.n ? 'keine' : !g.fertig ? '…' : zahl(_m6fDazu(g.muster, g.n))));
    _m6fSetze('_m6f-zusammen', 'Stäbchen zusammen: ' +
              (!g.n ? zahl(0) : !g.fertig ? '…' : zahl(_m6fZahl(g.muster, g.n))));
    _m6fZeige('_m6f-bisher', 'Stäbchen der Figuren bisher: ' +
              (!liste.length ? 'keine' : z.verdeckt ? 'verdeckt' : liste.join(', ')));
    _m6fZeige('_m6f-doppelt', '');
  } else {
    const D = z.lauf && z.lauf.art === 'doppelt' ? z.lauf.D : _m6fDoppelLage(g.muster);
    _m6fZeige('_m6f-neu', '');
    _m6fZeige('_m6f-bisher', '');
    _m6fSetze('_m6f-zusammen', 'Stäbchen zusammen: ' +
              (g.dStufe === 0 ? '…' : zahl(g.dStufe === 1 ? 2 * D.a : D.ganz)));
    let d = '';
    if (g.dStufe > 0) {
      d = '2-mal Figur 2: ' + (z.verdeckt ? 'verdeckt'
        : D.a + NB + '+' + NB + D.a + NB + '=' + NB + 2 * D.a + (g.dStufe === 2 ? ', zusammengeschoben ' + D.ganz : ''));
    }
    _m6fZeige('_m6f-doppelt', d);
  }
  _m6fZeige('_m6f-grenze', z.grenze);
  // Knoepfe hervorheben
  for (const k of _m6fREIHE) {
    const b = document.getElementById('_m6f-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', g.mod === 'folge' && g.muster === 'q' && g.n === _m6fMARKEN[k]);
  }
  try {
    document.getElementById('_m6f-b-doppelt').classList.toggle('primary', g.mod === 'doppelt');
    document.getElementById('_m6f-b-muster').classList.toggle('primary', g.muster === 'd');
  } catch (e) { /* Mini-DOM */ }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _m6fSetze('_m6f-pause', z.pause ? 'weiter' : 'Pause');
  _m6fSetze('_m6f-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6fSetze('_m6f-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6fSetze('_m6f-lehrkraft',
    z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : z.verdeckt ? 'Zahlen verdeckt. Erst vermuten lassen, dann wieder aufdecken.'
    : 'Für die Lehrkraft: „Pause“ hält alles an. „Zahlen verdecken“ lässt erst vermuten.');
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6f-pause', z.pause], ['_m6f-tempo', z.langsam], ['_m6f-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
  z.stand = _m6fStand(z);
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Was gerade auf dem Tisch liegt – zum Ausblenden, wenn neu gebaut wird.
function _m6fSchnappschuss(z) {
  return { n: z.n, muster: z.muster, modus: z.modus, orange: z.orange, ab: z.ab };
}
// Tisch leeren und Figur n im Muster neu aufbauen (Sprungmarke, anderes Muster).
function _m6fBau(n, muster) {
  const z = _m6f, K = _m6fK;
  const alt = _m6fSchnappschuss(z);
  z.grenze = ''; z.wackel = 0; z.ahaGlanz = 0; z.fx.length = 0;
  z.muster = muster; z.n = 0; z.ab = 1; z.modus = 'folge'; z.orange = 0; z.popT = {}; z.dPopT = -9;
  const st = _m6fStaebe(muster, n, 0), ende = [], anfang = [];
  st.forEach((s, i) => {
    if (anfang[s.f] === undefined) anfang[s.f] = K.T_LEER + i * K.T_STAB;
    ende[s.f] = K.T_LEER + (i + 1) * K.T_STAB;      // das letzte Staebchen schliesst die Figur
  });
  z.lauf = { art: 'bau', ziel: n, muster, t: 0, st, anfang, ende, fertig: 0, alt };
}
// Sprungmarke: Figur n aus Quadraten aufbauen. Hebt die Pause auf.
function _m6fMarke(k) {
  if (!_m6f || !_m6fMARKEN[k]) return;
  const z = _m6f;
  _m6fFertig();
  z.pause = false; z.vormerk = null; z.blink = 0;
  _m6fBau(_m6fMARKEN[k], 'q');
  _m6fStatus();
}
// Waehrend der Pause: vormerken, wenn nichts unterwegs ist; sonst entfaellt der Druck.
function _m6fInDerPause(tat) {
  const z = _m6f;
  z.blink = 0.6;
  if (!z.lauf) z.vormerk = tat;
  _m6fStatus();
}
// „nächste Figur“: die Figur bleibt, die neuen Staebchen fliegen an.
function _m6fNaechste() {
  if (!_m6f) return;
  const z = _m6f, K = _m6fK;
  if (z.pause) { _m6fInDerPause(_m6fNaechste); return; }
  _m6fFertig();
  z.grenze = '';
  if (z.n >= K.MAXN) {
    z.wackel = 0.45; z.grenze = 'Mehr Figuren passen nicht auf den Tisch.';
    _m6fStatus(); return;
  }
  if (z.modus === 'doppelt') {                     // die zusammengeschobene Figur waechst weiter
    z.modus = 'folge'; z.ab = z.n; z.popT = {}; z.popT[z.n] = -9;
  }
  if (z.n === 0) { z.ab = 1; z.popT = {}; }
  z.ahaGlanz = 0;
  const neu = _m6fStaebe(z.muster, z.n + 1, 0).filter(s => s.f === z.n + 1);
  z.lauf = { art: 'naechste', von: z.n, t: 0, neu,
             ende: K.T_N0 + (neu.length - 1) * K.T_NABST + K.T_NFLUG };
  _m6fStatus();
}
// „2-mal Figur 2“: zwei Figuren 2 legen und zusammenschieben.
function _m6fDoppelt() {
  if (!_m6f) return;
  const z = _m6f;
  if (z.pause) { _m6fInDerPause(_m6fDoppelt); return; }
  _m6fFertig();
  const alt = _m6fSchnappschuss(z);
  z.grenze = ''; z.wackel = 0; z.ahaGlanz = 0; z.fx.length = 0;
  z.n = 0; z.ab = 4; z.modus = 'doppelt'; z.orange = 0; z.popT = {}; z.dPopT = -9;
  z.lauf = { art: 'doppelt', t: 0, D: _m6fDoppelLage(z.muster), alt };
  _m6fStatus();
}
// „anderes Muster“: Quadrate ↔ Dreiecke, dieselbe Figurnummer neu aufbauen.
function _m6fMuster() {
  if (!_m6f) return;
  const z = _m6f;
  if (z.pause) { _m6fInDerPause(_m6fMuster); return; }
  _m6fFertig();
  _m6fBau(Math.max(1, z.n), z.muster === 'q' ? 'd' : 'q');
  _m6fStatus();
}
// „neu“: sofort der Start (Quadrate, leerer Tisch). Hebt die Pause auf.
function _m6fNeu() {
  if (!_m6f) return;
  const z = _m6f;
  z.lauf = null; z.pause = false; z.vormerk = null; z.blink = 0;
  z.muster = 'q'; z.n = 0; z.ab = 1; z.modus = 'folge'; z.orange = 0; z.popT = {}; z.dPopT = -9;
  z.grenze = ''; z.wackel = 0; z.ahaGlanz = 0; z.fx.length = 0;
  _m6fStatus();
}
// Die laufende Bewegung ankommen lassen. natuerlich = am Ende angekommen
// (dann mit Lichtring); sonst hat ein Knopfdruck sie sofort ans Ziel gesetzt.
function _m6fLanden(natuerlich) {
  const z = _m6f, K = _m6fK, L = z.lauf;
  if (!L) return;
  z.lauf = null;
  if (L.art === 'bau') {
    z.n = L.ziel; z.orange = L.ziel;
    for (let k = 1; k <= L.ziel; k++) if (z.popT[k] === undefined) z.popT[k] = z.t;
  } else if (L.art === 'naechste') {
    z.n = L.von + 1; z.orange = z.n; z.popT[z.n] = z.t;
    if (natuerlich && z.muster === 'q' && z.n === 4) {
      // Aha: Figur 4 ist fertig – 13 Staebchen, nicht 14 und nicht 16
      z.ahaGlanz = K.T_AHA;
      _bioFxWelle(z.fx, K.X0 + _m6fBreite('q', 4) / 2, (K.YO + K.YU) / 2, '#f59e0b', 100);
    }
  } else if (L.art === 'doppelt') {
    z.n = 4; z.ab = 4; z.modus = 'doppelt'; z.orange = 0; z.dPopT = z.t;
  }
  _m6fStatus();
}
function _m6fFertig() { if (_m6f && _m6f.lauf) _m6fLanden(false); }
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
// „Pause“ ↔ „weiter“. Beim Weitermachen laeuft die Bewegung genau dort weiter,
// wo sie stand; ein vorgemerkter Knopf wirkt jetzt.
function _m6fAnhalten() {
  if (!_m6f) return;
  const z = _m6f;
  if (z.pause) {
    z.pause = false; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v && !z.lauf) v();
  } else z.pause = true;
  _m6fStatus();
}
function _m6fTempo() {
  if (!_m6f) return;
  _m6f.langsam = !_m6f.langsam;
  _m6fStatus();
}
function _m6fVerdecken() {
  if (!_m6f) return;
  _m6f.verdeckt = !_m6f.verdeckt;
  _m6fStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6fZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6fK.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6fUpdate(dt) {
  if (!_m6f) return;
  const z = _m6f, K = _m6fK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);            // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6fZeitfaktor(z);                    // ab hier Sim-Zeit: 0 Pause, 1/3 langsam, 1 normal
  z.t += dt;
  z.wackel = Math.max(0, z.wackel - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  const L = z.lauf;
  if (L && dt > 0) {                               // ohne Zeit kein Schritt im Ablauf
    const vor = L.t;
    L.t += dt;
    if (L.art === 'bau') {
      while (L.fertig < L.ziel && L.t >= L.ende[L.fertig + 1] - 1e-9) {
        L.fertig++; z.popT[L.fertig] = z.t;        // Quadrat zu: Figur k liegt da, ihre Spalte kommt
      }
      if (L.fertig >= L.ziel) _m6fLanden(true);
    } else if (L.art === 'naechste') {
      if (L.t >= L.ende - 1e-9) _m6fLanden(true);
    } else if (L.art === 'doppelt') {
      if (vor < K.D_TREFF && L.t >= K.D_TREFF) {
        // Aha: an der Beruehrstelle liegen zwei Staebchen uebereinander
        for (const j of L.D.geteilt) {
          const s = L.D.zwei[j];
          _bioFxWelle(z.fx, (s.x1 + s.x2) / 2, (s.y1 + s.y2) / 2, '#fb923c', 52);
        }
      }
      if (L.t >= K.D_ENDE - 1e-9) _m6fLanden(true);
    }
  }
  _bioFxUpdate(z.fx, dt);
  if (_m6fStand(z) !== z.stand) _m6fStatus();
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6fTxt(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.fillStyle = farbe; ctx.textAlign = ausr || 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Federn beim Erscheinen: d = Sekunden seit Erscheinen
function _m6fPop(d) {
  return d >= 0 && d < _m6fK.T_POP ? Math.max(0.3, _bioFxEase.federn(d / _m6fK.T_POP)) : 1;
}
// Zwei Farben „#rrggbb“ mischen: u = 0 → a, u = 1 → b
function _m6fMisch(a, b, u) {
  const h = (c, i) => parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16);
  const m = i => Math.round(h(a, i) + (h(b, i) - h(a, i)) * u);
  return u <= 0 ? a : u >= 1 ? b : 'rgb(' + m(0) + ',' + m(1) + ',' + m(2) + ')';
}
function _m6fFlaeche(ctx, x0, y0, x1, y1, karo) {
  const K = _m6fK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 3, x1 - x0, y1 - y0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 6); ctx.fill();
  if (karo) {                                      // Karo an der Figur ausgerichtet
    ctx.strokeStyle = K.KARO; ctx.lineWidth = 1;
    let xa = K.X0, ya = K.YO;
    while (xa - K.KA > x0 + 1) xa -= K.KA;
    while (ya - K.KA > y0 + 1) ya -= K.KA;
    for (let x = xa; x < x1 - 1; x += K.KA) { ctx.beginPath(); ctx.moveTo(x, y0 + 1); ctx.lineTo(x, y1 - 1); ctx.stroke(); }
    for (let y = ya; y < y1 - 1; y += K.KA) { ctx.beginPath(); ctx.moveTo(x0 + 1, y); ctx.lineTo(x1 - 1, y); ctx.stroke(); }
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 6); ctx.stroke();
  ctx.restore();
}
// Ein Holzstaebchen um seine Mitte (cx, cy), Winkel ang, Laenge len.
// o = Anteil orange (0 braun … 1 orange), a = Deckkraft, k = Groesse,
// hebe = 0 … 1: liegt hoeher (Schatten darunter).
function _m6fStab(ctx, cx, cy, ang, len, o, a, k, hebe) {
  const K = _m6fK;
  if (a <= 0.01) return;
  const l = len / 2 - K.RAND, d = K.DICKE;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(k, k);
  if (hebe > 0.01) {
    ctx.fillStyle = 'rgba(15,23,42,' + (0.22 * Math.min(1, hebe)).toFixed(3) + ')';
    _bioFxRundRect(ctx, -l + 2 * hebe, -d + 3 * hebe, 2 * l, 2 * d, d); ctx.fill();
  }
  ctx.fillStyle = _m6fMisch(K.HOLZ, K.OR, o);
  ctx.strokeStyle = _m6fMisch(K.HOLZ_R, K.OR_R, o); ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, -l, -d, 2 * l, 2 * d, d); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.38)'; ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-l + 3, -1.2); ctx.lineTo(l - 3, -1.2); ctx.stroke();
  ctx.restore();
}
// Ein Staebchen aus der Liste, verschoben um (dx, dy)
function _m6fStabAus(ctx, s, dx, dy, o, a, k, hebe) {
  _m6fStab(ctx, (s.x1 + s.x2) / 2 + dx, (s.y1 + s.y2) / 2 + dy,
           Math.atan2(s.y2 - s.y1, s.x2 - s.x1), Math.hypot(s.x2 - s.x1, s.y2 - s.y1), o, a, k || 1, hebe || 0);
}
// Eine fertige Figur: Staebchen der Figur fOrange sind zu oAnteil orange.
function _m6fFigurBild(ctx, muster, n, fOrange, oAnteil, a, dx) {
  for (const s of _m6fStaebe(muster, n, 0)) _m6fStabAus(ctx, s, dx, 0, s.f === fOrange ? oAnteil : 0, a);
}
// „Figur 4“ ueber der Figur
function _m6fSchild(ctx, text, x, a, ausr) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  _m6fTxt(ctx, text, x, _m6fK.LY, 12, '#334155', ausr || 'left');
  ctx.restore();
}
// Was vor einem Neubau auf dem Tisch lag, blendet aus.
function _m6fAltesBild(ctx, alt, a, wk) {
  const K = _m6fK;
  if (!alt || !alt.n || a <= 0.01) return;
  _m6fFigurBild(ctx, alt.muster, alt.n, alt.orange, 1, a, wk);
  _m6fSchild(ctx, 'Figur ' + alt.n, K.X0 + wk, a);
}
function _m6fFigur(ctx) {
  const z = _m6f, K = _m6fK, L = z.lauf, kl = _bioFxKlemme, E = _bioFxEase;
  const wk = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0;
  if (L && L.art === 'bau') {
    if (L.t < K.T_LEER) { _m6fAltesBild(ctx, L.alt, 1 - L.t / K.T_LEER, wk); return; }
    const tb = L.t - K.T_LEER, N = L.st.length;
    const iAkt = Math.min(N, Math.floor(tb / K.T_STAB + 1e-9) + 1);   // so viele Staebchen sind unterwegs oder liegen
    const fAkt = L.st[iAkt - 1].f;                                    // diese Figur entsteht gerade
    const oAlt = 1 - kl((L.t - L.anfang[fAkt]) / K.T_FARBE);          // die vorige wird braun
    for (let i = 0; i < iAkt; i++) {
      const s = L.st[i], p = kl((tb - i * K.T_STAB) / K.T_STAB);
      const o = s.f === fAkt ? 1 : s.f === fAkt - 1 ? oAlt : 0;
      _m6fStabAus(ctx, s, wk, -16 * (1 - E.raus(p)), o, kl(p * 2.5));
    }
    _m6fSchild(ctx, 'Figur ' + fAkt, K.X0 + wk, 1);
    return;
  }
  if (L && L.art === 'naechste') {
    if (L.von) _m6fFigurBild(ctx, z.muster, L.von, z.orange, 1 - kl(L.t / K.T_FARBE), 1, wk);
    const zu = L.t >= K.T_N0 ? L.von + 1 : L.von;
    if (zu) _m6fSchild(ctx, 'Figur ' + zu, K.X0 + wk, 1);
    L.neu.forEach((s, j) => {
      const p = kl((L.t - K.T_N0 - j * K.T_NABST) / K.T_NFLUG);
      if (p <= 0) return;
      const e = E.sanft(p);
      const tx = (s.x1 + s.x2) / 2 + wk, ty = (s.y1 + s.y2) / 2;
      const ang = Math.atan2(s.y2 - s.y1, s.x2 - s.x1), len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
      const sx = K.TX1 + 30, sy = K.TY0 - 30, a0 = ang + Math.PI * 0.75;
      const x = sx + (tx - sx) * e, y = sy + (ty - sy) * e - 28 * Math.sin(Math.PI * e);
      const hoch = Math.sin(Math.PI * p);
      _m6fStab(ctx, x, y, a0 + (ang - a0) * e, len, 1, 1, 1 + 0.2 * hoch, hoch);
    });
    return;
  }
  if (L && L.art === 'doppelt') {
    if (L.t < K.T_LEER) { _m6fAltesBild(ctx, L.alt, 1 - L.t / K.T_LEER, wk); return; }
    const D = L.D, tp = L.t - K.T_LEER;
    const u = E.sanft(kl((L.t - K.D_GLEIT0) / K.T_GLEIT));
    const dx2 = K.GAP * (1 - u);                   // so weit liegt die rechte Figur noch weg
    D.eins.forEach((s, i) => {
      const p = kl((tp - i * 0.03) / (K.T_DPOP - 0.18));
      _m6fStabAus(ctx, s, wk, -10 * (1 - E.raus(p)), 0, kl(p * 2));
    });
    D.zwei.forEach((s, j) => {
      const p = kl((tp - j * 0.03) / (K.T_DPOP - 0.18));
      if (D.geteilt.indexOf(j) < 0 || L.t < K.D_TREFF) {
        _m6fStabAus(ctx, s, dx2 + wk, -10 * (1 - E.raus(p)), 0, kl(p * 2));
        return;
      }
      // das Staebchen, das doppelt liegt: wird orange, liegt sichtbar oben, fliegt weg
      const o = kl((L.t - K.D_TREFF) / K.T_FARBE);
      if (L.t < K.D_HEB) {
        const h = kl((L.t - K.D_TREFF) / 0.15);
        _m6fStabAus(ctx, s, wk - 2 * h, -3 * h, o, 1, 1, 0.6 * h);
      } else {
        const q = kl((L.t - K.D_HEB) / (K.D_ENDE - K.D_HEB));
        const heb = kl(q / 0.25), f = E.rein(kl((q - 0.15) / 0.85));
        const cx = (s.x1 + s.x2) / 2 + wk - 2, cy = (s.y1 + s.y2) / 2 - 3 - 6 * heb;
        const zx = K.TX1 + 20, zy = K.TY0 - 40;
        const ang = Math.atan2(s.y2 - s.y1, s.x2 - s.x1), len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
        _m6fStab(ctx, cx + (zx - cx) * f, cy + (zy - cy) * f, ang + 2.4 * f, len, 1,
                 1 - kl((q - 0.75) / 0.25), 1 + 0.18 * heb, 0.6 + 0.4 * heb);
      }
    });
    // „Figur 2“ ueber jeder Figur, solange sie getrennt liegen
    const aS = kl((tp - K.T_DPOP) / 0.2) * (1 - kl((L.t - K.D_GLEIT0) / 0.3));
    const b2 = _m6fBreite(D.muster, 2);
    _m6fSchild(ctx, 'Figur 2', K.X0 + b2 / 2 + wk, aS, 'center');
    _m6fSchild(ctx, 'Figur 2', K.X0 + D.schub + dx2 + b2 / 2 + wk, aS, 'center');
    return;
  }
  // Ruhe
  if (!z.n) return;
  if (z.ahaGlanz > 0) {                            // Aha: Rahmen um Figur 4
    const b = _m6fBreite(z.muster, z.n), top = _m6fOben(z.muster);
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.5);
    ctx.fillStyle = 'rgba(252,211,77,0.16)';
    ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.2 + 0.8 * Math.sin(z.t * 7);
    _bioFxRundRect(ctx, K.X0 - 7 + wk, top - 6, b + 14, K.YU - top + 13, 8); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  _m6fFigurBild(ctx, z.muster, z.n, z.orange, 1, 1, wk);
  if (z.modus === 'doppelt') {
    const d = z.t - z.dPopT;
    _m6fSchild(ctx, 'Figur ' + z.n, K.X0 + wk, kl(d / 0.25));
  } else _m6fSchild(ctx, 'Figur ' + z.n, K.X0 + wk, 1);
}

// ── Leiste unter dem Tisch: Figur | Staebchen, Boegen „+ 3“ ───────────────
// Graue Karte mit „?“ (Zahlen verdecken)
function _m6fKarte(ctx, xm, yb, w, h) {
  ctx.save();
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, xm - w / 2, yb - h + 3, w, h, 4); ctx.fill(); ctx.stroke();
  _m6fTxt(ctx, '?', xm, yb, Math.round(h * 0.8), '#475569');
  ctx.restore();
}
// Eine Spalte: Figurnummer oben, Staebchenzahl darunter (federnd, leuchtend)
function _m6fSpalte(ctx, cx, fig, zahl, d, a) {
  const K = _m6fK, z = _m6f, kl = _bioFxKlemme;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a) * kl(d / 0.12);
  _m6fTxt(ctx, String(fig), cx, K.FY, 12, '#334155');
  if (d < K.T_GLANZ) {                             // die neue Zahl leuchtet
    ctx.save();
    ctx.globalAlpha *= 1 - d / K.T_GLANZ;
    ctx.fillStyle = 'rgba(252,211,77,0.55)'; ctx.strokeStyle = 'rgba(217,119,6,0.75)'; ctx.lineWidth = 1.4;
    _bioFxRundRect(ctx, cx - 15, K.SY - 16, 30, 21, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  if (z.verdeckt) _m6fKarte(ctx, cx, K.SY, 24, 19);
  else {
    const k = _m6fPop(d);
    ctx.translate(cx, K.SY - 6); ctx.scale(k, k);
    _m6fTxt(ctx, String(zahl), 0, 6, 17, K.DUNKEL);
  }
  ctx.restore();
}
// Bogen von Spalte x0 nach x1 unter den Zahlen, waechst mit b (0 … 1); dann „+ 3“
function _m6fBogen(ctx, x0, x1, b, plus, aPlus, a) {
  const K = _m6fK, z = _m6f;
  if (a <= 0.01 || b <= 0.01) return;
  const xa = x0 + 6, xb = x1 - 6, xm = (xa + xb) / 2, cy = K.BY1 + 6;
  const P = t => [(1 - t) * (1 - t) * xa + 2 * (1 - t) * t * xm + t * t * xb,
                  (1 - t) * (1 - t) * K.BY0 + 2 * (1 - t) * t * cy + t * t * K.BY0];
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.strokeStyle = K.OR_T; ctx.lineWidth = 1.7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  const n = 12;
  for (let i = 0; i <= n; i++) {
    const [x, y] = P(b * i / n);
    if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
  }
  ctx.stroke();
  if (b >= 1) {                                    // Pfeilspitze am Ende
    const [x, y] = P(1), [xv, yv] = P(0.9), w = Math.atan2(y - yv, x - xv);
    ctx.fillStyle = K.OR_T;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 6 * Math.cos(w - 0.45), y - 6 * Math.sin(w - 0.45));
    ctx.lineTo(x - 6 * Math.cos(w + 0.45), y - 6 * Math.sin(w + 0.45));
    ctx.closePath(); ctx.fill();
  }
  if (aPlus > 0.01) {
    ctx.globalAlpha *= Math.min(1, aPlus);
    _m6fTxt(ctx, z.verdeckt ? '+' + _m6fNB + '?' : '+' + _m6fNB + plus, xm, K.PY, 12, K.OR_T);
  }
  ctx.restore();
}
function _m6fLeiste(ctx) {
  const z = _m6f, K = _m6fK, L = z.lauf, kl = _bioFxKlemme, E = _bioFxEase;
  // Kopf und Linien
  _m6fTxt(ctx, 'Figur', K.KX, K.FY, 11, K.GRAU, 'left');
  _m6fTxt(ctx, 'Stäbchen', K.KX, K.SY - 2, 11, K.GRAU, 'left');
  ctx.save();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(K.LX0 + 6, K.LINIE); ctx.lineTo(K.LX1 - 6, K.LINIE); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(K.TRENN, K.LY0 + 6); ctx.lineTo(K.TRENN, K.LY1 - 6); ctx.stroke();
  ctx.restore();
  const cx = (k, von) => K.CX0 + (k - von) * K.CS;
  // Folge: Spalten von…bis, Boegen dazwischen
  const folge = (muster, von, bis, popT, a) => {
    for (let k = von; k <= bis; k++) {
      const d = popT[k] === undefined ? 99 : z.t - popT[k];
      _m6fSpalte(ctx, cx(k, von), k, _m6fZahl(muster, k), d, a);
      if (k > von)
        _m6fBogen(ctx, cx(k - 1, von), cx(k, von), kl(d / K.T_BOGEN), _m6fDazu(muster, k),
                  kl((d - K.T_BOGEN) / 0.2), a);
    }
  };
  // die zusammengeschobene Figur: eine Spalte unter ihrer Mitte
  const doppelSpalte = (muster, d, a) =>
    _m6fSpalte(ctx, K.X0 + _m6fBreite(muster, 4) / 2, 4, _m6fDoppelLage(muster).ganz, d, a);
  if (L && (L.art === 'bau' || L.art === 'doppelt') && L.t < K.T_LEER) {
    const alt = L.alt, a = 1 - L.t / K.T_LEER;     // die alte Leiste blendet mit aus
    if (alt.modus === 'doppelt') { if (alt.n) doppelSpalte(alt.muster, 99, a); }
    else folge(alt.muster, alt.ab, alt.n, {}, a);
    return;
  }
  if (L && L.art === 'doppelt') {
    const D = L.D, d = L.t - K.T_LEER - K.T_DPOP;
    if (d < 0) return;
    const u = E.sanft(kl((L.t - K.D_GLEIT0) / K.T_GLEIT)), b2 = _m6fBreite(D.muster, 2);
    _m6fSpalte(ctx, K.X0 + b2 / 2, 2, D.a, d, 1);
    _m6fSpalte(ctx, K.X0 + D.schub + K.GAP * (1 - u) + b2 / 2, 2, D.a, d, 1);
    return;
  }
  if (z.modus === 'doppelt') { if (z.n) doppelSpalte(z.muster, z.t - z.dPopT, 1); return; }
  const g = _m6fLage(z);
  folge(g.muster, g.von, g.bis, z.popT, 1);
}
function _m6fDraw(ctx, cv) {
  if (!_m6f) return;
  const z = _m6f, K = _m6fK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6fFlaeche(ctx, K.TX0, K.TY0, K.TX1, K.TY1, true);
  _m6fFlaeche(ctx, K.LX0, K.LY0, K.LX1, K.LY1, false);
  _bioFxDraw(ctx, z.fx);                           // Lichtring hinter den Staebchen
  _m6fFigur(ctx);
  _m6fLeiste(ctx);
  if (z.pause) _m6fPauseSchild(ctx);
}
// Schild „Pause“ oben links – gleiche Stelle, Groesse und Farbe wie in
// m5-plus-schriftlich. Leuchtet kurz auf, wenn waehrend der Pause ein Knopf
// gedrueckt wird.
function _m6fPauseSchild(ctx) {
  const z = _m6f, w = 64, h = 25, x = 8, y = 8;
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
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);
  ctx.font = '700 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Pause', x + 20, y + 17.5);
  ctx.restore();
}
