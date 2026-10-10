
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 6 FOERDER – mt6 „Alle ungeraden Zahlen?“ (Kennung m6-sieb,
// Praefix _k6f). Bauplan: arbeitsheft_mathe_foe6/KAPITEL1_PROFIL.md,
// Abschnitte mt6 und m6-sieb (N1–N3, Lehrkraft-Zeile wie Heft 5).
// Ueberschrift = frage der Einheit: „Welche Zahlen bis 50 haben nur zwei Teiler?“
//
// Was man sieht (Leinwand 420 x 250) – im Aussehen der Hundertertafel aus
// m6-hundertertafel (_k6b), gleicher Bausatz, eigenes Praefix:
//   ZAHLENTAFEL rechts: 1 bis 50 in 5 Zeilen zu 10 Feldern, Felder 31 x 40 px
//     (groesser als in mt2, dort 30 x 19), Zahlen 15 px fett. Spalten fein
//     getrennt, die Zehnerzeilen etwas kraeftiger, aussen ein Rand. Darueber
//     die Kopfzeile „letzte Ziffer:  1 2 3 4 5 6 7 8 9 0“ wie in mt2.
//     Ein gestrichenes Feld wird GRAU, seine Zahl grau, darueber ein schraeger
//     Strich (von links unten nach rechts oben) in der Farbe der Reihe, die es
//     gestrichen hat. Die Startzahl einer Reihe bekommt einen Ring in der
//     Reihenfarbe und bleibt frei. Es steht immer nur EIN Ring da – der der
//     Reihe, die gerade gesiebt wird oder zuletzt gesiebt wurde; beginnt eine
//     neue Reihe, blendet der alte Ring aus (0,4 s), waehrend der neue entsteht.
//     Grund: Blieben die Ringe stehen, waeren am Ende genau 2, 3, 5 und 7
//     umkreist – eine Markierung freier Zahlen („Nicht am Bildschirm“), die
//     ausgerechnet die Vermutung „Nur die Zahlen 2, 3, 5 und 7“ stuetzt.
//   LINKS das Schild der Reihe in ihrer Farbe („3er-Reihe“), darunter „Start:“
//     mit der umkreisten Startzahl und ein Bogen „+ 3“: so weit springt der
//     Punkt. Vor der ersten Reihe steht dort ein graues, gestricheltes Schild
//     „keine Reihe“.
//   Farben: 2er violett, 5er gruen, 4er rosa wie in m6-hundertertafel; die
//     7er-Reihe (gibt es in mt2 nicht) blau. ABWEICHUNG von mt2: 3er orange und
//     6er tuerkis (in mt2 umgekehrt) – im Sieb stehen 3er- und 5er-Striche
//     nebeneinander, und Tuerkis (#0f766e) war neben Gruen (#15803d) im Bild
//     nicht zu unterscheiden (25 und 35 sahen aus wie 21 und 27). In mt2 steht
//     immer nur EINE Reihe da, dort faellt der Tausch nicht auf. Schild, Ring,
//     Striche und die Werte in der Anzeige tragen dieselbe Farbe.
//
// Bewegung (jede Sprungmarke spielt ihre Tabellenzeile SELBST ab, N1; alles ist
// eine Funktion der Ablaufzeit L.at, Konstanten in _k6fK – keine Zufallszahl):
//   0 – 0,4 s  der Ring zieht sich um die Startzahl, der Punkt springt auf.
//   dann       der Punkt springt im Bogen um n, von Feld zu Feld (ueber das
//              Zeilenende hinweg in die naechste Zeile). Ein Sprung dauert
//              2er 0,14 s · 3er 0,24 s · 4er 0,30 s · 6er 0,34 s · 5er 0,40 s ·
//              7er 0,55 s. Landet er auf einem FREIEN Feld, zieht sich der
//              Strich (0,2 s) und das Feld wird grau; der Punkt wartet so lange
//              (bei der 2er-Reihe 0,12 s, der Strich laeuft im Sprung zu Ende).
//              Landet er auf einem SCHON GESTRICHENEN Feld, leuchtet es kurz
//              bernsteinfarben auf (0,35 s), kein neuer Strich; der Punkt
//              wartet 0,1 s. Der Punkt sitzt ueber der Zahl (verdeckt keine).
//              Der Bogen ist hoechstens 26 px hoch und bleibt unter der
//              Kopfzeile; waehrend des Flugs ist er fein gepunktet zu sehen.
//   Ende       der Punkt blendet aus (0,4 s).
//   GEMESSEN (Frames zu 16 ms, Tempo normal) bis zur Ruhe: 2er 7,04 s (440
//   Frames), 3er 6,60 s (413), 5er 5,50 s (344), 7er 4,80 s (300); frei auf
//   der leeren Tafel 4er 6,30 s (394), 6er 4,58 s (287). simfakten.js mit --frames=25
//   --verlauf=4 liest die Endwerte im zweiten Knopfdurchgang ab (er laeuft
//   bis zu 625 Frames aus).
//   Sprungmarke  stellt OHNE Bewegung den Stand nach den Zeilen davor her
//              („5er-Reihe“ setzt die Striche der 2er- und der 3er-Reihe)
//              und siebt dann ihre Reihe – die Werte stimmen in
//              jeder Reihenfolge der Knoepfe.
//   „4er-Reihe“, „6er-Reihe“ (frei) sieben auf dem Stand, der gerade dasteht.
//   „neu“      sofort der Start; Striche und Ring blenden aus (0,35 s).
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort ankommen
// (alle Striche der Reihe stehen dann da); dann geschieht das Neue.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_k6fMarke(2|3|5|7)):
//     „2er-Reihe“ · „3er-Reihe“ · „5er-Reihe“ · „7er-Reihe“
//   Reihe 2: „4er-Reihe“ · „6er-Reihe“ (frei, _k6fReihe(4|6)) · „neu“ (_k6fNeu())
//   Der Knopf der Reihe, die gerade gesiebt wird oder zuletzt gesiebt wurde,
//   ist hervorgehoben.
//
// Statuszeilen (woertlich, jede mit mindestens 19 Zeichen). Sie folgen dem
// Bild: jede Zahl aendert sich in dem Augenblick, in dem der Punkt auf einem
// freien Feld landet.
//   _k6f-reihe   „Gewählte Reihe: 3er-Reihe“ (Start „Gewählte Reihe: noch keine“) – wie in
//                m6-hundertertafel. Pruefung 10.10.2026: vorher „Gerade gesiebt: …“; „gerade“
//                ist in dieser Einheit das Wort fuer die 2er-Reihe (Tareks „ungerade“) und
//                „gesiebt“ klingt wie die Zahl sieben – fuer DaZ-Kinder doppelt missverstaendlich.
//   _k6f-neu     „Neu gestrichen: 7 Felder“ (Einzahl „1 Feld“; zaehlt mit, ab
//                „… 0 Felder“; Start „Neu gestrichen: noch kein Feld“)
//   _k6f-welche  „Neu gestrichen sind: 9, 15, 21, 27, 33, 39, 45“ (waechst mit;
//                mehr als 8 Zahlen in gleichem Abstand kurz: „4, 6, 8 … 50“;
//                vor dem ersten Strich „… noch keine“, ohne Strich am Ende
//                „… keine“)
//   _k6f-frei    „Noch frei auf der Tafel: 19 Felder“ (Einzahl „1 Feld“, Start 50)
//
// Werte (jede Zeile nachgerechnet mit simcheck/werte.js, Endwerte):
//   2er-Reihe → 24 neu (4, 6, 8 … 50), frei 26
//   3er-Reihe →  7 neu (9, 15, 21, 27, 33, 39, 45), frei 19
//   5er-Reihe →  2 neu (25, 35), frei 17
//   7er-Reihe →  1 neu (49), frei 16
//   frei: 4er- und 6er-Reihe nach der 7er-Reihe → 0 neu („keine“), frei 16;
//         auf der leeren Tafel 4er → 11 neu (8, 12, 16 … 48), frei 39,
//         6er → 7 neu (12, 18, 24, 30, 36, 42, 48), frei 43.
//   Frei bleiben 1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47 –
//   nur im Bild (weisse Felder), nirgends als Liste.
// Start: Tafel 1 bis 50, nichts gestrichen („Start: Zahlen von 1 bis 50, noch
// nichts gestrichen“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): „7er-Reihe“ – der Punkt springt
// ueber 14, 21, 28, 35, 42 (nur Aufleuchten) und streicht als einziges Feld die
// 49: Lichtring um 49 und ein bernsteinfarbener Rahmen 1,4 s. Die 3er-Reihe
// streicht 9, 15, 21 (widerlegt „alle ungeraden“), 11 und 13 bleiben bis zum
// Schluss weiss (widerlegt „nur 2, 3, 5 und 7“) – das zeigt das Bild ohne Text.
//
// FUER DIE LEHRKRAFT (Container <div class="fpm-lehrkraft">, eigene Zeile unter
// den Heftknoepfen, davor klein „Für die Lehrkraft:“):
//   „Pause“ ↔ „weiter“ (_k6fAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ links unten (unter dem Bogen, dort steht sonst nichts).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_k6fTempo()): ein Drittel so schnell.
//   „Halt bei jedem Strich: aus“ ↔ „… an“ (_k6fHaltSchalter()): haelt an,
//     sobald der Punkt auf einem FREIEN Feld gelandet ist – VOR dem Strich.
//     Das Feld bekommt einen pulsierenden bernsteinfarbenen Rahmen, das
//     Schild links unten sagt „Halt“, die Anzeige zaehlt das Feld noch nicht.
//     Hinweiszeile: „Halt: Der Punkt steht auf 9. Gleich kommt der Strich.
//     Dann „weiter“.“ – der Moment fuer „Warum wird 9 gestrichen?“.
//     „weiter“ zieht den Strich und laesst weiterspringen. Auf schon
//     gestrichenen Feldern haelt nichts an.
//   In der Pause (und im Halt) bewegen „4er-Reihe“ und „6er-Reihe“ nichts:
//   Steht eine Bewegung, entfaellt der Druck; steht keine, wird er VORGEMERKT
//   und beginnt mit „weiter“ (das Schild leuchtet kurz auf). Eine Sprungmarke
//   und „neu“ heben die Pause auf; Tempo und Halt bleiben stehen.
//   EIN Zeitfaktor (_k6fZeitfaktor: 0 Pause, 1/3 langsam, 1 normal) an der
//   einen Stelle, an der dt in _k6fUpdate hineingeht. Das wechselnde Wort steht
//   in einem eigenen <span>. Hinweiszeile _k6f-lehrkraft (in der Pause
//   bernsteinfarben, „lmp-status off“) nennt immer die Einstellungen:
//     sonst „Für die Lehrkraft: „Pause“ hält alles an. „Halt bei jedem Strich“ stoppt von selbst. Tempo: normal, Halt: aus.“
//     Pause „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. Tempo: …, Halt: …“
//   Voreinstellung Pause aus, Tempo normal, Halt aus.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Primzahl“, „Sieb des
// Eratosthenes“, eine Liste oder Markierung der freien Zahlen (frei heisst nur:
// weiss, ohne Strich; am Ende leuchtet nichts Freies auf), „genau zwei Teiler“,
// die Regel als Satz. „Teiler“ steht nur in der Ueberschrift (Frage) und im
// Hinweis (Bruecke „gestrichen = hat noch einen Teiler“ an der 10, die in
// keiner Vermutung vorkommt). Keine Namen, keine Punkte, keine Zeit, kein Urteil.
// ════════════════════════════════════════════════════════════════════════
let _k6f = null;
const _k6fMARKEN = [2, 3, 5, 7];          // Reihe 1: die vier Tabellenzeilen, in dieser Reihenfolge gesiebt
const _k6fFREI = [4, 6];                  // Reihe 2: frei, auf dem Stand, der gerade dasteht
const _k6fREIHEN = {
  2: { name: '2er-Reihe', fuell: '#c084fc', dunkel: '#7e22ce' },
  3: { name: '3er-Reihe', fuell: '#fb923c', dunkel: '#c2410c' },
  5: { name: '5er-Reihe', fuell: '#4ade80', dunkel: '#15803d' },
  7: { name: '7er-Reihe', fuell: '#60a5fa', dunkel: '#1d4ed8' },
  4: { name: '4er-Reihe', fuell: '#fb7185', dunkel: '#be123c' },
  6: { name: '6er-Reihe', fuell: '#2dd4bf', dunkel: '#0f766e' }
};
const _k6fK = {
  X0: 100, Y0: 30, FW: 31, FH: 40,        // Zahlentafel: linke obere Ecke, Feldgroesse (10 x 5 Felder)
  KOPF: 17,                               // Grundlinie der Kopfzeile
  GZ: 15, GK: 12, GB: 11,                 // Schriftgrade: Zahlen der Tafel, Kopfzeile, Beschriftungen
  HOCH: 14.5,                             // der Punkt sitzt so weit ueber der Feldmitte (ueber der Zahl)
  RP: 5, RR: 12,                          // Radius: Punkt, Ring um die Startzahl
  BOGEN_MAX: 26, BOGEN_OBEN: 22,          // Sprungbogen: hoechstens 26 px hoch, nie ueber y = 22 (Kopfzeile)
  SCHILD_X: 52, SCHILD_Y: 50,             // Mitte des Schilds der Reihe (links)
  START_Y: 90, BOGEN_Y: 142,              // Zeile „Start:“, Grundlinie des Bogens „+ n“
  PX: 18, PY: 204,                        // Schild „Pause“ / „Halt“ (links unten)
  T_RING: 0.4, T_STRICH: 0.2, T_STEH: 0.2, T_STEH2: 0.12, T_STEH_ALT: 0.1, T_BLITZ: 0.35,
  T_AUS: 0.4, T_NEU: 0.35, T_POP: 0.3, T_AHA: 1.4, LANGSAM: 1 / 3,
  SPRUNG: { 2: 0.14, 3: 0.24, 4: 0.3, 5: 0.4, 6: 0.34, 7: 0.55 },
  F_TEXT: '#1e293b', F_GITTER: '#cbd5e1', F_ZEILE: '#94a3b8', F_RAND: '#64748b', F_GRAU: '#475569',
  F_GESTR: '#e2e8f0', F_GESTR_TEXT: '#64748b', F_PUNKT: '#1e293b', F_AHA: '#f59e0b'
};

// ── Rechnungen (eine Quelle fuer Bild und Anzeige) ──────────────────────
// Feld k (1 … 50): Spalte (k − 1) % 10, Zeile ⌊(k − 1) / 10⌋.
function _k6fFeld(k) {
  const K = _k6fK, p = (k - 1) % 10, r = Math.floor((k - 1) / 10);
  const x = K.X0 + p * K.FW, y = K.Y0 + r * K.FH;
  return { x, y, cx: x + K.FW / 2, cy: y + K.FH / 2 };
}
// Landeplatz des Punkts auf Feld k: ueber der Zahl.
function _k6fPlatz(k) { const F = _k6fFeld(k); return { x: F.cx, y: F.cy - _k6fK.HOCH }; }
function _k6fLeer() { return new Array(51).fill(0); }
// Siebt Reihe n auf dem Stand b OHNE Bewegung: jedes noch freie Landefeld 2n, 3n …
// bekommt n (die Reihe, die es gestrichen hat). Die Startzahl n bleibt frei.
function _k6fSieben(b, n) {
  const neu = [];
  for (let k = 2 * n; k <= 50; k += n) if (!b[k]) { b[k] = n; neu.push(k); }
  return neu;
}
// Stand VOR einer Sprungmarke: die Reihen davor, in der Reihenfolge der Tabelle.
function _k6fStandVor(n) {
  const b = _k6fLeer();
  for (const m of _k6fMARKEN) {
    if (m === n) break;
    _k6fSieben(b, m);
  }
  return b;
}
// Drehbuch einer Reihe n auf dem Stand b: Sprung j fliegt von t0 bis t1 und
// landet auf „nach“; frei = das Feld war vor der Reihe noch nicht gestrichen.
// alt = Startzahl der Reihe davor: ihr Ring blendet aus, waehrend der neue entsteht.
function _k6fPlan(n, b, alt) {
  const K = _k6fK, J = K.SPRUNG[n], steh = n === 2 ? K.T_STEH2 : K.T_STEH, ev = [], bei = {};
  let t = K.T_RING, von = n;
  for (let k = 2 * n; k <= 50; k += n) {
    const e = { von, nach: k, t0: t, t1: t + J, frei: !b[k], gehalten: false };
    ev.push(e); bei[k] = e;
    t += J + (e.frei ? steh : K.T_STEH_ALT);
    von = k;
  }
  return { n, ev, bei, at: 0, ende: t + K.T_AUS, aha: false, alt: alt && alt !== n ? alt : null };
}
// Was gerade dasteht: Reihe, neu gestrichene Felder (in der Reihenfolge des
// Streichens), Zahl der freien Felder.
function _k6fStand() {
  const z = _k6f, L = z.lauf;
  let n = null, neu = [];
  if (L) { n = L.n; neu = L.ev.filter(e => e.frei && e.t1 <= L.at).map(e => e.nach); }
  else if (z.zuletzt) { n = z.zuletzt.n; neu = z.zuletzt.neu; }
  let gestr = L ? neu.length : 0;
  for (let k = 1; k <= 50; k++) if (z.b[k]) gestr++;
  return { n, neu, frei: 50 - gestr };
}
// Liste fuer die Anzeige: mehr als 8 Zahlen in gleichem Abstand kurz („4, 6, 8 … 50“).
function _k6fListe(l) {
  if (l.length > 8) {
    const d = l[1] - l[0];
    if (l.every((v, i) => i === 0 || v - l[i - 1] === d))
      return l[0] + ', ' + l[1] + ', ' + l[2] + ' … ' + l[l.length - 1];
  }
  return l.join(', ');
}
function _k6fFelder(m) { return m === 1 ? '1 Feld' : m + ' Felder'; }

function _k6fInit() {
  _k6f = { b: _k6fLeer(), lauf: null, zuletzt: null, weg: null,
           fx: [], ein: _k6fK.T_NEU, ahaGlanz: 0, echt: 0, sig: '',
           steht: false, haltInfo: null, haltAn: false, langsam: false, blink: 0, vormerk: null };   // Lehrkraft
}
function _k6fHTML() {
  const knopf = n => `<button class="sim-btn" id="_k6f-b-${n}" style="white-space:nowrap" onclick="${_k6fMARKEN.includes(n) ? '_k6fMarke' : '_k6fReihe'}(${n})">${_k6fREIHEN[n].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welche Zahlen bis 50 haben nur zwei Teiler?</h3>
    <div class="fpm-note" style="margin-top:2px">Jede Reihe streicht ihre Landefelder. Die 2er-Reihe trifft 10: Also hat 10 den Teiler 2.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_k6f-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_k6fMARKEN.map(knopf).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_k6fFREI.map(knopf).join('\n          ')}
          <button class="sim-btn" id="_k6f-b-neu" onclick="_k6fNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_k6f-pause" onclick="_k6fAnhalten()">Pause</button>
            <button class="sim-btn" id="_k6f-tempo" onclick="_k6fTempo()">Tempo: <span id="_k6f-tempo-an">normal</span></button>
            <button class="sim-btn" id="_k6f-halt" onclick="_k6fHaltSchalter()">Halt bei jedem Strich: <span id="_k6f-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_k6f-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_k6f-reihe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6f-neu" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6f-welche" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6f-frei" style="margin-top:6px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Zahlen von 1 bis 50, noch nichts gestrichen</p>
  </div>`;
}
function _k6fSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Die vier Statuszeilen – sie folgen dem Bild.
function _k6fTexte() {
  const S = _k6fStand(), R = S.n ? _k6fREIHEN[S.n] : null;
  const f = s => R ? '<b style="color:' + R.dunkel + '">' + s + '</b>' : String(s);
  return {
    reihe: 'Gewählte Reihe: ' + (R ? f(R.name) : 'noch keine'),
    neu: 'Neu gestrichen: ' + (R ? f(_k6fFelder(S.neu.length)) : 'noch kein Feld'),
    welche: 'Neu gestrichen sind: ' + (S.neu.length ? f(_k6fListe(S.neu)) : R && !_k6f.lauf ? 'keine' : 'noch keine'),
    frei: 'Noch frei auf der Tafel: ' + _k6fFelder(S.frei)
  };
}
function _k6fHinweis() {
  const z = _k6f;
  let a;
  if (z.steht && z.haltInfo)
    a = 'Halt: Der Punkt steht auf ' + z.haltInfo.nach + '. Gleich kommt der Strich. Dann „weiter“.';
  else if (z.steht) a = 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  else a = 'Für die Lehrkraft: „Pause“ hält alles an. „Halt bei jedem Strich“ stoppt von selbst.';
  return a + ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') + ', Halt: ' + (z.haltAn ? 'an' : 'aus') + '.';
}
// Schreibt die Anzeige, wenn sich etwas geaendert hat (immer = true: auf jeden Fall).
function _k6fStatus(immer) {
  if (!_k6f) return;
  const z = _k6f, T = _k6fTexte(), H = _k6fHinweis();
  const n = z.lauf ? z.lauf.n : z.zuletzt ? z.zuletzt.n : null;
  const sig = JSON.stringify(T) + '|' + H + '|' + n + '|' + z.steht;
  if (!immer && sig === z.sig) return;
  z.sig = sig;
  for (const id of ['reihe', 'neu', 'welche', 'frei']) _k6fSetze('_k6f-' + id, T[id]);
  for (const m of _k6fMARKEN.concat(_k6fFREI)) {
    const b = document.getElementById('_k6f-b-' + m);
    if (b && b.classList) b.classList.toggle('primary', m === n);
  }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _k6fSetze('_k6f-pause', z.steht ? 'weiter' : 'Pause');
  _k6fSetze('_k6f-tempo-an', z.langsam ? 'langsam' : 'normal');
  _k6fSetze('_k6f-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _k6fSetze('_k6f-lehrkraft', H);
  if (hz) hz.className = 'lmp-status ' + (z.steht ? 'off' : 'on');
  for (const [id, an] of [['_k6f-pause', z.steht], ['_k6f-tempo', z.langsam], ['_k6f-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Sprungmarke: ohne Bewegung der Stand nach den Zeilen davor, dann siebt die
// Reihe. Hebt die Pause auf.
function _k6fMarke(n) {
  if (!_k6f || !_k6fMARKEN.includes(n)) return;
  const z = _k6f, alt = _k6fStart();
  z.steht = false; z.haltInfo = null; z.vormerk = null; z.blink = 0;
  z.lauf = null; z.b = _k6fStandVor(n); z.zuletzt = null; z.weg = null; z.ein = 0;
  z.ahaGlanz = 0; z.fx.length = 0;
  z.lauf = _k6fPlan(n, z.b, alt);
  _k6fStatus(true);
}
// Freie Reihe (4er, 6er) auf dem Stand, der gerade dasteht.
function _k6fReihe(n) {
  if (!_k6f || !_k6fFREI.includes(n)) return;
  const z = _k6f;
  if (z.steht) {                         // Pause/Halt: vormerken oder entfallen lassen
    z.blink = 0.6;
    if (!z.lauf) z.vormerk = n;
    _k6fStatus(true);
    return;
  }
  _k6fFertig();
  z.weg = null; z.ein = 0;
  z.lauf = _k6fPlan(n, z.b, _k6fStart());
  _k6fStatus(true);
}
// „neu“: sofort der Start; Striche und Ringe blenden aus. Hebt die Pause auf.
function _k6fNeu() {
  if (!_k6f) return;
  const z = _k6f;
  _k6fFertig();
  z.weg = { b: z.b, ring: _k6fStart(), t: _k6fK.T_NEU };
  z.b = _k6fLeer(); z.zuletzt = null; z.lauf = null;
  z.steht = false; z.haltInfo = null; z.vormerk = null; z.blink = 0;
  z.ahaGlanz = 0; z.fx.length = 0;
  _k6fStatus(true);
}
// Die laufende Reihe ankommen lassen: alle ihre Striche stehen da.
function _k6fLanden() {
  const z = _k6f, L = z.lauf;
  if (!L) return;
  z.lauf = null; z.haltInfo = null;
  const neu = [];
  for (const e of L.ev) if (e.frei) { z.b[e.nach] = L.n; neu.push(e.nach); }
  z.zuletzt = { n: L.n, neu };
  _k6fStatus(true);
}
function _k6fFertig() { if (_k6f && _k6f.lauf) _k6fLanden(); }
// Startzahl der Reihe, die gerade dasteht (laeuft oder zuletzt gesiebt), sonst null.
function _k6fStart() { const z = _k6f; return z.lauf ? z.lauf.n : z.zuletzt ? z.zuletzt.n : null; }

// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
// „Pause“ ↔ „weiter“. Nach einem Halt zieht „weiter“ den Strich; ein
// vorgemerkter Knopf wirkt jetzt.
function _k6fAnhalten() {
  if (!_k6f) return;
  const z = _k6f;
  if (z.steht) {
    z.steht = false; z.haltInfo = null; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v && !z.lauf) { z.weg = null; z.lauf = _k6fPlan(v, z.b, _k6fStart()); }
  } else z.steht = true;
  _k6fStatus(true);
}
function _k6fTempo() {
  if (!_k6f) return;
  _k6f.langsam = !_k6f.langsam;
  _k6fStatus(true);
}
function _k6fHaltSchalter() {
  if (!_k6f) return;
  _k6f.haltAn = !_k6f.haltAn;            // gilt ab dem naechsten freien Feld
  _k6fStatus(true);
}
// DER Zeitfaktor: 0 in Pause und Halt, ein Drittel bei „Tempo: langsam“, sonst 1.
function _k6fZeitfaktor(z) { return z.steht ? 0 : z.langsam ? _k6fK.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _k6fUpdate(dt) {
  if (!_k6f) return;
  const z = _k6f, K = _k6fK;
  const roh = _bioFxDt(dt);
  z.echt += roh;                                      // Halt-Rahmen pulsiert in echter Zeit
  z.blink = Math.max(0, z.blink - roh);               // Schild leuchtet in echter Zeit
  dt = roh * _k6fZeitfaktor(z);                       // ab hier Sim-Zeit
  z.ein = Math.max(0, z.ein - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  if (z.weg) { z.weg.t -= dt; if (z.weg.t <= 0) z.weg = null; }
  const L = z.lauf;
  if (L && dt > 0) {
    let neu = L.at + dt, halt = null;
    if (z.haltAn) {                                   // Halt VOR dem Strich auf einem freien Feld
      for (const e of L.ev) {
        if (e.frei && !e.gehalten && L.at < e.t1 && neu >= e.t1) { neu = e.t1 - 1e-6; halt = e; break; }
      }
    }
    const e49 = L.bei[49];                            // Aha: die 7er-Reihe streicht nur die 49
    if (L.n === 7 && e49 && e49.frei && !L.aha && L.at < e49.t1 && neu >= e49.t1) {
      L.aha = true; z.ahaGlanz = K.T_AHA;
      const F = _k6fFeld(49);
      _bioFxWelle(z.fx, F.cx, F.cy, K.F_AHA, 40);
    }
    L.at = neu;
    if (halt) { halt.gehalten = true; z.steht = true; z.haltInfo = halt; }
    if (L.at >= L.ende) _k6fLanden();
  }
  _bioFxUpdate(z.fx, dt);
  _k6fStatus(false);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _k6fText(ctx, s, x, y, gr, farbe, ausr, gew, grund) {
  ctx.fillStyle = farbe || _k6fK.F_TEXT;
  ctx.font = (gew || '700') + ' ' + gr + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = grund || 'alphabetic';
  ctx.fillText(s, x, y);
}
// Kopfzeile: „letzte Ziffer:“ und die Ziffern 1 … 9, 0 ueber den Spalten (wie mt2).
function _k6fKopf(ctx) {
  const K = _k6fK;
  _k6fText(ctx, 'letzte Ziffer:', K.X0 - 6, K.KOPF, K.GB, K.F_GRAU, 'right', '700');
  for (let p = 0; p < 10; p++)
    _k6fText(ctx, String((p + 1) % 10), K.X0 + p * K.FW + K.FW / 2, K.KOPF, K.GK, K.F_TEXT, 'center', '700');
}
// Wie weit ist Feld k gestrichen (0 … 1), in welcher Farbe, mit welcher Deckkraft?
function _k6fStrichStand(k) {
  const z = _k6f, K = _k6fK, L = z.lauf;
  if (z.b[k]) return { s: 1, R: _k6fREIHEN[z.b[k]], a: 1 };
  if (L) {
    const e = L.bei[k];
    if (e && e.frei && L.at >= e.t1) return { s: _bioFxKlemme((L.at - e.t1) / K.T_STRICH), R: _k6fREIHEN[L.n], a: 1 };
  }
  if (z.weg && z.weg.b[k]) return { s: 1, R: _k6fREIHEN[z.weg.b[k]], a: z.weg.t / K.T_NEU };
  return null;
}
// Ring um Feld k in der Farbe R, gezogen bis zum Anteil bis (0 … 1).
function _k6fRing(ctx, k, R, bis, a) {
  const K = _k6fK, F = _k6fFeld(k);
  if (bis <= 0 || a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.strokeStyle = R.dunkel; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(F.cx, F.cy, K.RR, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * Math.min(1, bis)); ctx.stroke();
  ctx.restore();
}
function _k6fTafel(ctx) {
  const z = _k6f, K = _k6fK, L = z.lauf, kl = _bioFxKlemme;
  const breit = 10 * K.FW, hoch = 5 * K.FH;
  const ein = z.ein > 0 ? 1 - z.ein / K.T_NEU : 1;    // beim Oeffnen blendet die Tafel ein
  ctx.save();
  ctx.globalAlpha = 0.25 + 0.75 * ein;
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  ctx.fillRect(K.X0 + 2, K.Y0 + 3, breit, hoch);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(K.X0, K.Y0, breit, hoch);
  // graue Felder (beim Streichen blendet das Grau mit dem Strich ein)
  const stand = [];
  for (let k = 1; k <= 50; k++) {
    const S = _k6fStrichStand(k);
    stand[k] = S;
    if (!S) continue;
    const F = _k6fFeld(k);
    ctx.globalAlpha = (0.25 + 0.75 * ein) * S.a * _bioFxEase.sanft(S.s);
    ctx.fillStyle = K.F_GESTR;
    ctx.fillRect(F.x, F.y, K.FW, K.FH);
  }
  ctx.globalAlpha = 0.25 + 0.75 * ein;
  // Gitter: Spalten fein, Zehnerzeilen etwas kraeftiger, aussen ein Rand (wie mt2)
  ctx.lineWidth = 1;
  ctx.strokeStyle = K.F_GITTER;
  ctx.beginPath();
  for (let p = 1; p < 10; p++) { const x = K.X0 + p * K.FW + 0.5; ctx.moveTo(x, K.Y0); ctx.lineTo(x, K.Y0 + hoch); }
  ctx.stroke();
  ctx.strokeStyle = K.F_ZEILE;
  ctx.beginPath();
  for (let r = 1; r < 5; r++) { const y = K.Y0 + r * K.FH + 0.5; ctx.moveTo(K.X0, y); ctx.lineTo(K.X0 + breit, y); }
  ctx.stroke();
  ctx.strokeStyle = K.F_RAND; ctx.lineWidth = 1.5;
  ctx.strokeRect(K.X0, K.Y0, breit, hoch);
  // Zahlen 1 … 50 (gestrichen grau)
  for (let k = 1; k <= 50; k++) {
    const F = _k6fFeld(k), S = stand[k], grau = S && S.s * S.a >= 0.5;
    _k6fText(ctx, String(k), F.cx, F.cy + 0.5, K.GZ, grau ? K.F_GESTR_TEXT : K.F_TEXT, 'center', '700', 'middle');
  }
  // schraege Striche in der Farbe der Reihe, von links unten nach rechts oben
  ctx.lineCap = 'round';
  for (let k = 1; k <= 50; k++) {
    const S = stand[k];
    if (!S || S.s <= 0) continue;
    const F = _k6fFeld(k), x0 = F.x + 6, y0 = F.y + K.FH - 7, x1 = F.x + K.FW - 6, y1 = F.y + 7;
    ctx.globalAlpha = (0.25 + 0.75 * ein) * S.a;
    ctx.strokeStyle = S.R.dunkel; ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * S.s, y0 + (y1 - y0) * S.s); ctx.stroke();
  }
  ctx.restore();
  // Ring nur um die Startzahl der Reihe, die gerade dasteht (sonst waeren am
  // Ende genau 2, 3, 5 und 7 umkreist – eine Markierung freier Zahlen, die die
  // Vermutung „nur 2, 3, 5 und 7“ stuetzen wuerde). Der Ring der Reihe davor
  // blendet aus, waehrend der neue entsteht.
  if (L) {
    if (L.alt) _k6fRing(ctx, L.alt, _k6fREIHEN[L.alt], 1, 1 - kl(L.at / K.T_RING));
    _k6fRing(ctx, L.n, _k6fREIHEN[L.n], _bioFxEase.sanft(kl(L.at / K.T_RING)), 1);
  } else if (z.zuletzt) _k6fRing(ctx, z.zuletzt.n, _k6fREIHEN[z.zuletzt.n], 1, 1);
  if (z.weg && z.weg.ring) _k6fRing(ctx, z.weg.ring, _k6fREIHEN[z.weg.ring], 1, z.weg.t / K.T_NEU);
  // schon gestrichen: kurzes Aufleuchten, kein neuer Strich
  if (L) for (const e of L.ev) {
    if (e.frei || L.at < e.t1 || L.at - e.t1 >= K.T_BLITZ) continue;
    const F = _k6fFeld(e.nach), u = (L.at - e.t1) / K.T_BLITZ;
    ctx.save();
    ctx.globalAlpha = 1 - _bioFxEase.rein(u);
    ctx.fillStyle = 'rgba(252,211,77,0.45)'; ctx.strokeStyle = K.F_AHA; ctx.lineWidth = 2.5;
    _bioFxRundRect(ctx, F.x + 2, F.y + 2, K.FW - 4, K.FH - 4, 4); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // Aha: bernsteinfarbener Rahmen um 49
  if (z.ahaGlanz > 0) {
    const F = _k6fFeld(49);
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.5);
    ctx.strokeStyle = K.F_AHA; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, F.x - 1, F.y - 1, K.FW + 2, K.FH + 2, 5); ctx.stroke();
    ctx.restore();
  }
  // Halt (Lehrkraft): pulsierender Rahmen um das Feld, auf dem der Punkt steht
  if (z.steht && z.haltInfo) {
    const F = _k6fFeld(z.haltInfo.nach);
    ctx.save();
    ctx.globalAlpha = 0.8 + 0.2 * Math.sin(z.echt * Math.PI * 2 * 0.8);
    ctx.strokeStyle = K.F_AHA; ctx.lineWidth = 3.5;
    _bioFxRundRect(ctx, F.x + 1, F.y + 1, K.FW - 2, K.FH - 2, 4); ctx.stroke();
    ctx.restore();
  }
}
// Wo ist der Punkt? Sitzt er (auf „k“) oder fliegt er (Sprung e, Anteil u)?
function _k6fPunktLage() {
  const z = _k6f, K = _k6fK, L = z.lauf, kl = _bioFxKlemme;
  if (!L) return null;
  for (const e of L.ev) {
    if (L.at < e.t0) {
      const auf = e === L.ev[0] ? Math.max(0, _bioFxEase.federn(kl(L.at / K.T_POP))) : 1;
      return { k: e.von, s: auf, a: 1 };
    }
    // im Halt (Lehrkraft) steht die Uhr 1e-6 s vor der Landung: dann SITZT der Punkt
    if (L.at < e.t1 - 1e-5) return { e, u: (L.at - e.t0) / (e.t1 - e.t0), s: 1, a: 1 };
    if (L.at < e.t1) return { k: e.nach, s: 1, a: 1 };
  }
  const letzt = L.ev[L.ev.length - 1], tAus = L.ende - K.T_AUS;
  return { k: letzt ? letzt.nach : L.n, s: 1, a: 1 - kl((L.at - tAus) / K.T_AUS) };
}
// Bogen eines Sprungs: Hoehe waechst mit der Weite, hoechstens 26 px, und der
// Scheitel bleibt unter der Kopfzeile (in der obersten Zeile flacher).
function _k6fBogenPunkte(e) {
  const K = _k6fK, A = _k6fPlatz(e.von), B = _k6fPlatz(e.nach);
  const w = Math.hypot(B.x - A.x, B.y - A.y);
  const h = Math.min(K.BOGEN_MAX, 8 + 0.12 * w, (A.y + B.y) / 2 - K.BOGEN_OBEN);
  return { A, B, C: { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 - 2 * h } };
}
function _k6fAufBogen(P, u) {
  const v = 1 - u;
  return { x: v * v * P.A.x + 2 * v * u * P.C.x + u * u * P.B.x,
           y: v * v * P.A.y + 2 * v * u * P.C.y + u * u * P.B.y };
}
function _k6fPunkt(ctx) {
  const K = _k6fK, Q = _k6fPunktLage();
  if (!Q || Q.a <= 0.01 || Q.s <= 0.05) return;
  let p, hub = 0;
  ctx.save();
  if (Q.e) {
    const P = _k6fBogenPunkte(Q.e), u = _bioFxEase.sanft(_bioFxKlemme(Q.u));
    // der Bogen dieses Sprungs, fein gepunktet
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = _k6fREIHEN[_k6f.lauf.n].dunkel; ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.moveTo(P.A.x, P.A.y); ctx.quadraticCurveTo(P.C.x, P.C.y, P.B.x, P.B.y); ctx.stroke();
    ctx.setLineDash([]);
    p = _k6fAufBogen(P, u);
    hub = 4 * u * (1 - u);                              // Schatten bleibt auf der Linie zwischen den Feldern
    const sx = P.A.x + (P.B.x - P.A.x) * u, sy = P.A.y + (P.B.y - P.A.y) * u;
    ctx.globalAlpha = 0.16 * (1 - 0.5 * hub);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.ellipse(sx + 1, sy + 4, K.RP, K.RP * 0.45, 0, 0, Math.PI * 2); ctx.fill();
  } else p = _k6fPlatz(Q.k);
  ctx.globalAlpha = Math.min(1, Q.a);
  const r = K.RP * Q.s;
  ctx.fillStyle = K.F_PUNKT; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (r > 3) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(p.x - r * 0.35, p.y - r * 0.35, r * 0.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Links: Schild der Reihe, „Start:“ mit der umkreisten Startzahl, Bogen „+ n“.
function _k6fLinks(ctx) {
  const z = _k6f, K = _k6fK, kl = _bioFxKlemme;
  const n = z.lauf ? z.lauf.n : z.zuletzt ? z.zuletzt.n : null;
  if (!n) {                                            // noch keine Reihe: graues, gestricheltes Schild
    ctx.save();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    _bioFxRundRect(ctx, K.SCHILD_X - 40, K.SCHILD_Y - 12, 80, 24, 7); ctx.stroke();
    ctx.setLineDash([]);
    _k6fText(ctx, 'keine Reihe', K.SCHILD_X, K.SCHILD_Y + 0.5, K.GB, K.F_RAND, 'center', '700', 'middle');
    ctx.restore();
    return;
  }
  const R = _k6fREIHEN[n], t = z.lauf ? z.lauf.at : 99;
  const k = Math.max(0.3, _bioFxEase.federn(kl(t / K.T_POP)));
  ctx.save();
  ctx.translate(K.SCHILD_X, K.SCHILD_Y); ctx.scale(k, k);
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, -38, -10, 80, 24, 7); ctx.fill();
  ctx.fillStyle = R.fuell; ctx.strokeStyle = R.dunkel; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, -40, -12, 80, 24, 7); ctx.fill(); ctx.stroke();
  _k6fText(ctx, R.name, 0, 0.5, 13, K.F_TEXT, 'center', '700', 'middle');
  ctx.restore();
  // „Start:“ und die Startzahl im Ring – derselbe Ring wie auf der Tafel
  ctx.save();
  ctx.globalAlpha = kl(t / K.T_POP);
  _k6fText(ctx, 'Start:', K.SCHILD_X - 4, K.START_Y + 4, K.GB, K.F_GRAU, 'right', '700');
  _k6fText(ctx, String(n), K.SCHILD_X + 16, K.START_Y + 0.5, K.GZ, K.F_TEXT, 'center', '700', 'middle');
  ctx.strokeStyle = R.dunkel; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(K.SCHILD_X + 16, K.START_Y, K.RR, 0, Math.PI * 2); ctx.stroke();
  // Bogen mit „+ n“: so weit springt der Punkt
  const x0 = 24, x1 = 80, y = K.BOGEN_Y, h = 16;
  ctx.strokeStyle = R.dunkel; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 20; i++) {
    const e = i / 20, x = x0 + (x1 - x0) * e, yy = y - 4 * h * e * (1 - e);
    if (i) ctx.lineTo(x, yy); else ctx.moveTo(x, yy);
  }
  ctx.stroke();
  ctx.fillStyle = R.dunkel;
  ctx.beginPath(); ctx.moveTo(x1 + 1, y + 1); ctx.lineTo(x1 - 7, y - 4); ctx.lineTo(x1 - 2, y - 9); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(x0, y, 2.6, 0, Math.PI * 2); ctx.fill();
  _k6fText(ctx, '+ ' + n, (x0 + x1) / 2, y - h - 6, 13, R.dunkel, 'center', '700');
  ctx.restore();
}
// Schild „Pause“ bzw. „Halt“ links unten. Leuchtet kurz auf, wenn waehrend der
// Pause ein Knopf gedrueckt wird.
function _k6fPauseSchild(ctx) {
  const z = _k6f, K = _k6fK, w = 64, h = 25, x = K.PX, y = K.PY;
  ctx.save();
  if (z.blink > 0) {
    ctx.globalAlpha = Math.min(1, z.blink / 0.3);
    ctx.strokeStyle = K.F_AHA; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, x - 3, y - 3, w + 6, h + 6, 9); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _k6fText(ctx, z.haltInfo ? 'Halt' : 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _k6fDraw(ctx, cv) {
  if (!_k6f) return;
  const z = _k6f, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _k6fKopf(ctx);
  _k6fTafel(ctx);
  _k6fLinks(ctx);
  _bioFxDraw(ctx, z.fx);                              // Lichtring um 49
  _k6fPunkt(ctx);
  if (z.steht) _k6fPauseSchild(ctx);
}
