
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 6 FOERDER – mt4 „Wann treffen sich die zwei Reihen wieder?“
// (Kennung m6-vielfache, Praefix _k6d)
// Bauplan: arbeitsheft_mathe_foe6/KAPITEL1_PROFIL.md, Abschnitte mt4 und
// „m6-vielfache (mt4) · _k6d“ (Regeln N1–N3, Lehrkraft-Zeile, nur onclick).
// Ueberschrift = Frage der Einheit: „Nach wie vielen Minuten halten beide
// wieder zusammen?“
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   - Unten ein Zeitstrahl 0–36 min mit Pfeil: Strich je Minute, Zahl je
//     6 min (0, 6, 12 … 36), rechts unter der Pfeilspitze der Achsentitel
//     „Zeit in min“.
//   - Darueber zwei Spuren, jede ein getoenter Streifen mit einer Strasse:
//     oben „Bus A“ (blau), darunter „Bus B“ (orange), je ein kleiner Bus von
//     der Seite, OHNE Nummer. Das Dreieck zwischen den Raedern zeigt auf die
//     Minute, an der der Bus steht.
//   - Ein gestrichelter Zeitzeiger (mit Dreieck auf dem Strahl) laeuft von
//     links nach rechts. Jeder Halt hinterlaesst auf der Strasse seiner Spur
//     eine Marke (Punkt in der Busfarbe) mit der Minutenzahl darunter.
//     Bei einem Takt von 1 min stehen die Zahlen abwechselnd in zwei Zeilen
//     (sonst ueberlappen sie: 9,2 px je Minute, „36“ ist 12,5 px breit).
//
// BEWEGUNG (jede Sprungmarke spielt die Fahrt bis 36 min SELBST ab, N1;
// anhalten kann die Lehrkraft):
//   Vorlauf 0,35 s   beide Busse stehen bei 0 min (nach einer frueheren
//                    Fahrt huepfen sie im Bogen dorthin zurueck, die alten
//                    Marken blenden aus).
//   Fahrt            der Zeitzeiger laeuft 0 -> 36 min, 0,15 s je Minute
//                    (5,4 s). Jeder Bus springt im Bogen von Halt zu Halt:
//                    er steht kurz (0,12 s, hoechstens 30 % seines Takts) und
//                    landet GENAU dann auf dem naechsten Halt, wenn der Zeiger
//                    diese Minute erreicht. Dann erscheint die Marke (federt)
//                    und die Zahl in der Statusliste.
//   gleiche Minute   halten beide in derselben Minute, steht ALLES 0,5 s
//                    still (Zeiger und Busse), und um beide Marken breitet
//                    sich ein Lichtring aus – ohne Text, ohne eigene Liste.
//                    (Bei sehr vielen gleichen Minuten im freien Probieren
//                    hoechstens 3 s zusammen: 1 min und 1 min haette sonst
//                    36 x 0,5 s = 18 s Stillstand. Fuer alle vier Sprungmarken
//                    sind es genau 0,5 s – Abweichung nur im freien Probieren.)
//   Ende             der Zeiger steht auf 36 min. Ein Bus, dessen letzter Halt
//                    vor 36 liegt (3 und 5: Bus B bei 35), bleibt dort stehen.
// Alles ist eine Funktion der Ablaufzeit z.at (_k6dPlan baut das Drehbuch
// EINMAL, _k6dMin und _k6dBus lesen es ab): keine Zufallszahl; jede Zahl im
// Bild und in den Zeilen kommt aus den Halten k, 2k, 3k … bis 36.
//
// Abspieldauer ab Knopfdruck (Tempo normal, Frames zu 16 ms, fuer simfakten.js):
//   2 und 3: 8,75 s (547) · 4 und 6: 7,25 s (454) · 3 und 5: 6,75 s (422) ·
//   4 und 8: 7,75 s (485). Mit --frames=25 --verlauf=4 (bis Frame 125) stehen
//   die Endwerte im Durchgang, der jeden Knopf ein zweites Mal drueckt (er laesst ihn
//   auslaufen, bis sich die Anzeige nicht mehr aendert).
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_k6dMarke('2-3') …):
//     „2 min und 3 min“ · „4 min und 6 min“ · „3 min und 5 min“ · „4 min und 8 min“
//     Der Knopf, dessen Takte gerade eingestellt sind, ist hervorgehoben.
//   Reihe 2: „A: − 1 min“ · „A: + 1 min“ (_k6dA(-1|1)) · „B: − 1 min“ ·
//     „B: + 1 min“ (_k6dB(-1|1)): Takt 1 bis 10 min, spielt neu ab. Am Rand
//     (1 bzw. 10 min) wackelt nur die Spur, nichts spielt neu ab, kein Text
//     (der Bauplan sieht keine Grenz-Zeile vor). · „neu“ (_k6dNeu()): Start.
//   Jeder dieser Knoepfe hebt eine Pause auf; Tempo und Halt bleiben stehen.
//
// STATUSZEILEN (woertlich aus dem Bauplan; jede hat mehr als 18 Zeichen,
// zwischen Zahl und „min“ ein geschuetztes Leerzeichen U+00A0):
//   _k6d-takte  „Bus A alle 4 min, Bus B alle 6 min“
//   _k6d-zeit   „Zeit seit dem Start: 12 min“ (laeuft mit dem Zeiger in
//               ganzen Minuten bis 36 min)
//   _k6d-a      „Bus A hält bei (min): 4, 8, 12, 16, 20, 24, 28, 32, 36“
//   _k6d-b      „Bus B hält bei (min): 6, 12, 18, 24, 30, 36“
//               (beide Listen wachsen mit den Marken; vor dem ersten Halt
//               „Bus A hält bei (min): …“ – der Bauplan nennt keinen
//               Starttext, „…“ wie in m5-zeit und m5-teilen-schriftlich)
//   Eine Zeile mit gemeinsamen Halten gibt es NICHT.
//   _k6d-lehrkraft  Hinweis fuer die Lehrkraft (siehe unten)
//
// WERTE (Ende der Fahrt, nachgerechnet mit simcheck/werte.js; die gleichen
// Minuten nur zum Nachpruefen – angezeigt werden sie nicht):
//   2 und 3 → A 2, 4, … 36 (18 Halte) · B 3, 6, … 36 (12) · gleich 6, 12, 18, 24, 30, 36
//   4 und 6 → A 4 … 36 (9) · B 6 … 36 (6) · gleich 12, 24, 36
//   3 und 5 → A 3 … 36 (12) · B 5 … 35 (7) · gleich 15, 30
//   4 und 8 → A 4 … 36 (9) · B 8 … 32 (4) · gleich 8, 16, 24, 32
//   In Minute 10 haelt bei „4 min und 6 min“ kein Bus (keine Marke, keine Zahl).
// START (auch nach „neu“): Takte 4 min und 6 min – die Busse aus ① des Hefts
//   („Bus A kommt alle 4 min, Bus B alle 6 min. Gerade halten beide
//   zusammen.“) –, beide Busse bei 0 min, noch keine Fahrt. Der Bauplan nennt
//   keinen Starttakt; „A/B: ± 1 min“ braucht aber einen Ausgangswert.
//   Unter der Leinwand: „Start: Beide Busse stehen bei 0 min.“
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen): bei „4 min und 6 min“ in
// Minute 12 – der Lichtring um beide Marken ist groesser (34 statt 22 px),
// und beide Marken leuchten 2,6 s nach (Tarek erwartet erst 24 min). Gilt fuer
// die Takte 4 und 6, gleich ueber welchen Knopf sie eingestellt sind.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-zeit / m5-teilen-schriftlich, Container
// <div class="fpm-lehrkraft">, den simfakten.js ueberspringt). Eigene Zeile
// UNTER den Heftknoepfen, davor klein „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_k6dAnhalten()): friert jede Bewegung sofort ein;
//     Schild „Pause“ oben links (Stelle und Aussehen wie in m5-zeit).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_k6dTempo()): ein Drittel so schnell.
//   „Halt bei gleicher Zeit: aus“ ↔ „… an“ (_k6dHaltSchalter()): haelt VON
//     SELBST an jeder Minute an, in der beide Busse halten (ein Ereignis im
//     Drehbuch: die Ablaufzeit steht im Stillstand dieser Minute, sobald die
//     Marken ganz da sind). Beide Marken dick orange umringt, oben das Schild
//     „Beide Busse halten bei 12 min.“; Hinweiszeile „Halt: Beide Busse
//     halten bei 12 min. Erkläre, was gerade passiert. Dann „weiter“. …“.
//   Hinweiszeile _k6d-lehrkraft (in der Pause bernsteinfarben, „lmp-status
//     off“) nennt IMMER die Einstellung („… Tempo: normal, Halt: aus.“):
//     sonst    „Für die Lehrkraft: „Pause“ hält alles an. Tempo: …, Halt: ….“
//     Pause    „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. …“
//   EIN Zeitfaktor (0 Pause, 1/3 langsam, 1 normal) an der einen Stelle, an der
//   dt in _k6dUpdate hineingeht. Voreinstellung: Pause aus, Tempo normal,
//   Halt aus. Nur das wechselnde Wort der Aufschrift steht in einem <span>.
//
// NICHT AM BILDSCHIRM (Bauplan): „Vielfaches“, „gemeinsam“, „kgV“,
// „kleinste“, „Treffen“, eine Liste der gemeinsamen Halte, „4 · 6“, die
// Regel als Satz. Keine Namen, keine Punkte, keine Zeitmessung (die Uhr ist
// Material), kein Urteil. „Bus A“/„Bus B“ sind Spurnamen, keine Liniennummern.
// ════════════════════════════════════════════════════════════════════════
let _k6d = null;
const _k6dMARKEN = { '2-3': [2, 3], '4-6': [4, 6], '3-5': [3, 5], '4-8': [4, 8] };   // [Takt A, Takt B] in min
const _k6dREIHE = ['2-3', '4-6', '3-5', '4-8'];
const _k6dSTART = [4, 6];
const _k6dNB = ' ';                 // geschuetztes Leerzeichen zwischen Zahl und „min“
const _k6dK = {
  M1: 36,                                // der Strahl reicht bis 36 min
  X0: 66, X1: 396, LY: 208,              // 0 min bei X0, 36 min bei X1; Strahl bei LY
  YA: 80, YB: 160,                       // Strassen der Spuren (die Raeder stehen darauf)
  SA: [38, 114], SB: [118, 194],         // getoente Streifen der Spuren (y von, bis)
  ZY0: 40,                               // oberes Ende des Zeitzeigers
  TAKT_MIN: 1, TAKT_MAX: 10,
  // Zeiten in s
  T_VOR: 0.35, S_MIN: 0.15, T_STEH: 0.5, T_STEH_SUMME: 3.0, T_RAST: 0.12,
  T_POP: 0.3, T_AHA: 2.6, T_WACKEL: 0.45, LANGSAM: 1 / 3,
  // Farben: Bus A blau, Bus B orange (Text dunkler, Kontrast auf Weiss > 4,5:1)
  A: { k: '#3b82f6', r: '#1e40af', f: '#dbeafe', s: '#1d4ed8', t: '#1d4ed8', grund: '#eff6ff', rand: '#bfdbfe' },
  B: { k: '#fb923c', r: '#c2410c', f: '#ffedd5', s: '#ea580c', t: '#c2410c', grund: '#fff7ed', rand: '#fed7aa' },
  TINTE: '#0f172a', ZEIGER: '#334155', STRASSE: '#cbd5e1', ORANGE: '#ea580c'
};

// ── Drehbuch ────────────────────────────────────────────────────────────
// Halte k, 2k, … bis 36; die Minuten, in denen beide halten; die Abschnitte
// des Zeitzeigers (laufen / stehen) mit Zeitpunkten. start = nur hinstellen.
function _k6dPlan(a, b, start) {
  const K = _k6dK, halteA = [], halteB = [];
  for (let m = a; m <= K.M1; m += a) halteA.push(m);
  for (let m = b; m <= K.M1; m += b) halteB.push(m);
  const P = { a, b, start: !!start, halteA, halteB, gleich: [], steh: 0, ab: [], an: {},
              ende: K.T_VOR, aha: null };
  if (start) return P;
  P.gleich = halteA.filter(m => m % b === 0);
  P.steh = P.gleich.length ? Math.min(K.T_STEH, K.T_STEH_SUMME / P.gleich.length) : 0;
  let t = K.T_VOR, m = 0;
  const lauf = bis => {
    if (bis <= m) return;
    P.ab.push({ t0: t, t1: t + (bis - m) * K.S_MIN, m0: m, m1: bis });
    t += (bis - m) * K.S_MIN; m = bis;
  };
  for (const g of P.gleich) {
    lauf(g);
    P.an[g] = t;                                        // hier kommt der Zeiger an
    P.ab.push({ t0: t, t1: t + P.steh, m0: g, m1: g }); // alles steht still
    t += P.steh;
  }
  lauf(K.M1);
  P.ende = t;
  if ((a === 4 && b === 6) || (a === 6 && b === 4)) P.aha = P.gleich[0];   // Minute 12
  return P;
}
// Wo steht der Zeitzeiger (Minuten, nicht gerundet) zur Ablaufzeit at?
function _k6dMin(P, at) {
  if (P.start || at <= _k6dK.T_VOR) return 0;
  for (const s of P.ab) if (at < s.t1) return s.m0 + (s.m1 - s.m0) * (at - s.t0) / (s.t1 - s.t0);
  return _k6dK.M1;
}
// Wann erreicht der Zeiger die Minute s? (fuer das Federn der Marke)
function _k6dZeitBei(P, s) {
  for (const sec of P.ab)
    if (sec.m1 > sec.m0 && s >= sec.m0 && s <= sec.m1) return sec.t0 + (s - sec.m0) * _k6dK.S_MIN;
  return P.ende;
}
// Ein Bus mit Takt k bei Zeigerstand m: auf welcher Minute steht er, wie hoch
// ist er gerade im Sprung? Er steht kurz auf seinem Halt, springt dann im
// Bogen und landet, wenn der Zeiger den naechsten Halt erreicht.
function _k6dSprungHoehe(k) {
  const K = _k6dK, px = k * (K.X1 - K.X0) / K.M1;
  return Math.max(5, Math.min(12, px * 0.3));
}
function _k6dBus(k, m) {
  const K = _k6dK, letzte = Math.floor(K.M1 / k) * k;
  if (m >= letzte) return { min: letzte, hoch: 0 };
  const vor = Math.floor(m / k + 1e-9) * k, frac = (m - vor) / k;
  const rast = Math.min(0.3, K.T_RAST / (K.S_MIN * k));
  if (frac <= rast) return { min: vor, hoch: 0 };
  const u = (frac - rast) / (1 - rast);
  return { min: vor + k * _bioFxEase.sanft(u), hoch: _k6dSprungHoehe(k) * Math.sin(Math.PI * u) };
}
function _k6dX(min) { const K = _k6dK; return K.X0 + min * (K.X1 - K.X0) / K.M1; }

// ── Zustand ─────────────────────────────────────────────────────────────
function _k6dInit() {
  const K = _k6dK;
  _k6d = { t: 0, at: K.T_VOR, P: _k6dPlan(_k6dSTART[0], _k6dSTART[1], true),
           vonA: 0, vonB: 0, alt: null, fx: { teile: [] }, sig: '',
           wackel: { A: 0, B: 0 },
           pause: false, langsam: false, haltAn: false, haltInfo: null };   // Lehrkraft
}
// Neu laden (Sprungmarke, ± 1 min, „neu“): die Busse huepfen von da, wo sie
// gerade sind, zurueck auf 0 min; die alten Marken blenden waehrend des
// Vorlaufs aus. Hebt die Pause auf, Tempo und Halt bleiben.
function _k6dLaden(a, b, start) {
  const z = _k6d, alt = z.P, m = _k6dMin(alt, z.at);
  z.vonA = _k6dLage(z, 'A').min; z.vonB = _k6dLage(z, 'B').min;
  if (m > 0) z.alt = { P: alt, m };
  else if (!(z.alt && z.at < _k6dK.T_VOR)) z.alt = null;   // mitten im Ausblenden: weiter ausblenden
  z.P = _k6dPlan(a, b, start);
  z.at = 0;
  z.fx.teile.length = 0;
  z.pause = false; z.haltInfo = null;
}
// Wo ein Bus gerade steht (im Vorlauf: Rueckweg auf 0 min).
function _k6dLage(z, wer) {
  const K = _k6dK, P = z.P, k = wer === 'A' ? P.a : P.b;
  if (z.at < K.T_VOR) {
    const von = wer === 'A' ? z.vonA : z.vonB, u = _bioFxKlemme(z.at / K.T_VOR);
    const h = von > 0 ? Math.max(6, Math.min(16, von * 0.6)) : 0;
    return { min: von * (1 - _bioFxEase.sanft(u)), hoch: h * Math.sin(Math.PI * u) };
  }
  return _k6dBus(k, _k6dMin(P, z.at));
}

function _k6dHTML() {
  const marke = key => {
    const [a, b] = _k6dMARKEN[key];
    return `<button class="sim-btn" id="_k6d-b-${key}" onclick="_k6dMarke('${key}')">${a}&nbsp;min und ${b}&nbsp;min</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Nach wie vielen Minuten halten beide wieder zusammen?</h3>
    <div class="fpm-note" style="margin-top:2px">Beide Busse fahren bei 0&nbsp;min los. Jeder springt immer gleich weit.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_k6d-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_k6dREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_k6dA(-1)">A:&nbsp;−&nbsp;1&nbsp;min</button>
          <button class="sim-btn" onclick="_k6dA(1)">A:&nbsp;+&nbsp;1&nbsp;min</button>
          <button class="sim-btn" onclick="_k6dB(-1)">B:&nbsp;−&nbsp;1&nbsp;min</button>
          <button class="sim-btn" onclick="_k6dB(1)">B:&nbsp;+&nbsp;1&nbsp;min</button>
          <button class="sim-btn" onclick="_k6dNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_k6d-pause" onclick="_k6dAnhalten()">Pause</button>
            <button class="sim-btn" id="_k6d-tempo" onclick="_k6dTempo()">Tempo: <span id="_k6d-tempo-an">normal</span></button>
            <button class="sim-btn" id="_k6d-halt" onclick="_k6dHaltSchalter()">Halt bei gleicher Zeit: <span id="_k6d-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_k6d-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_k6d-takte" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6d-zeit" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6d-a" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6d-b" style="margin-top:6px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Beide Busse stehen bei 0&nbsp;min.</p>
  </div>`;
}

// Was die Anzeige gerade sagt – sie folgt dem Zeiger (die Zahl kommt mit der Marke).
function _k6dTexte() {
  const z = _k6d, K = _k6dK, P = z.P, m = _k6dMin(P, z.at), NB = _k6dNB;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const liste = (h, farbe) => {
    const l = h.filter(s => s <= m + 1e-6);
    return l.length ? f(l.join(', '), farbe) : '…';
  };
  return {
    takte: f('Bus A', K.A.t) + ' alle ' + f(P.a + NB + 'min', K.A.t) + ', ' +
           f('Bus B', K.B.t) + ' alle ' + f(P.b + NB + 'min', K.B.t),
    zeit: 'Zeit seit dem Start: ' + Math.floor(m + 1e-6) + NB + 'min',
    a: f('Bus A', K.A.t) + ' hält bei (min): ' + liste(P.halteA, K.A.t),
    b: f('Bus B', K.B.t) + ' hält bei (min): ' + liste(P.halteB, K.B.t)
  };
}
function _k6dHinweis() {
  const z = _k6d, h = z.haltInfo;
  const kopf = h ? 'Halt: Beide Busse halten bei ' + h.g + _k6dNB + 'min. Erkläre, was gerade passiert. Dann „weiter“.'
    : z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : 'Für die Lehrkraft: „Pause“ hält alles an.';
  return kopf + ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') + ', Halt: ' + (z.haltAn ? 'an' : 'aus') + '.';
}
function _k6dSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Schreibt die Anzeige, wenn sich etwas geaendert hat (immer = true: auf jeden Fall).
function _k6dStatus(immer) {
  if (!_k6d) return;
  const z = _k6d, T = _k6dTexte(), H = _k6dHinweis();
  const sig = JSON.stringify(T) + '|' + H + '|' + z.pause;
  if (!immer && sig === z.sig) return;
  z.sig = sig;
  for (const id of ['takte', 'zeit', 'a', 'b']) _k6dSetze('_k6d-' + id, T[id]);
  for (const key of _k6dREIHE) {
    const b = document.getElementById('_k6d-b-' + key), [ma, mb] = _k6dMARKEN[key];
    if (b && b.classList) b.classList.toggle('primary', ma === z.P.a && mb === z.P.b);
  }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _k6dSetze('_k6d-pause', z.pause ? 'weiter' : 'Pause');
  _k6dSetze('_k6d-tempo-an', z.langsam ? 'langsam' : 'normal');
  _k6dSetze('_k6d-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _k6dSetze('_k6d-lehrkraft', H);
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_k6d-pause', z.pause], ['_k6d-halt', z.haltAn], ['_k6d-tempo', z.langsam]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Sprungmarke: Takte setzen und die Fahrt bis 36 min abspielen.
function _k6dMarke(key) {
  if (!_k6d || !_k6dMARKEN[key]) return;
  const [a, b] = _k6dMARKEN[key];
  _k6dLaden(a, b, false);
  _k6dStatus(true);
}
// „A: ± 1 min“ / „B: ± 1 min“: Takt 1 bis 10 min, spielt neu ab; am Rand wackelt die Spur.
function _k6dTakt(wer, d) {
  if (!_k6d || (d !== 1 && d !== -1)) return;
  const z = _k6d, K = _k6dK, P = z.P;
  const a = wer === 'A' ? P.a + d : P.a, b = wer === 'B' ? P.b + d : P.b, neu = wer === 'A' ? a : b;
  if (neu < K.TAKT_MIN || neu > K.TAKT_MAX) { z.wackel[wer] = K.T_WACKEL; return; }
  _k6dLaden(a, b, false);
  _k6dStatus(true);
}
function _k6dA(d) { _k6dTakt('A', d); }
function _k6dB(d) { _k6dTakt('B', d); }
// „neu“: der Start – Takte 4 min und 6 min, beide Busse bei 0 min, keine Fahrt.
function _k6dNeu() {
  if (!_k6d) return;
  _k6dLaden(_k6dSTART[0], _k6dSTART[1], true);
  _k6dStatus(true);
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _k6dAnhalten() {
  if (!_k6d) return;
  _k6d.pause = !_k6d.pause;
  _k6d.haltInfo = null;                  // „weiter“ nach einem Halt: die Fahrt geht weiter
  _k6dStatus(true);
}
function _k6dTempo() {
  if (!_k6d) return;
  _k6d.langsam = !_k6d.langsam;
  _k6dStatus(true);
}
function _k6dHaltSchalter() {
  if (!_k6d) return;
  _k6d.haltAn = !_k6d.haltAn;            // gilt ab der naechsten gleichen Minute
  _k6dStatus(true);
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _k6dZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _k6dK.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _k6dUpdate(dt) {
  if (!_k6d) return;
  const z = _k6d, K = _k6dK, P = z.P;
  const roh = _bioFxDt(dt);
  for (const w of ['A', 'B']) z.wackel[w] = Math.max(0, z.wackel[w] - roh);   // Wackeln in echter Zeit
  dt = roh * _k6dZeitfaktor(z);                        // ab hier Sim-Zeit
  if (dt > 0) {
    z.t += dt;
    let neu = z.at + dt, halt = null;
    // Halt bei gleicher Zeit (Lehrkraft): ein Ereignis im Drehbuch – die
    // Ablaufzeit bleibt genau auf der Minute stehen, bis „weiter“.
    // Gehalten wird, wenn die Marken ganz da sind (nach dem Federn, noch im
    // Stillstand dieser Minute) – sonst stuende der Halt auf einem winzigen Punkt.
    if (z.haltAn && !P.start) {
      for (const g of P.gleich) {
        const th = P.an[g] + Math.min(K.T_POP, P.steh);
        if (z.at < th && neu >= th) { neu = th; halt = g; break; }
      }
    }
    // Lichtring um beide Marken, sobald der Zeiger eine gleiche Minute erreicht
    for (const g of P.gleich) {
      const tg = P.an[g];
      if (!(z.at < tg && neu >= tg)) continue;
      const r = g === P.aha ? 34 : 22;
      _bioFxWelle(z.fx.teile, _k6dX(g), K.YA, '#f59e0b', r);
      _bioFxWelle(z.fx.teile, _k6dX(g), K.YB, '#f59e0b', r);
    }
    z.at = neu;
    if (halt !== null) { z.pause = true; z.haltInfo = { g: halt }; }
  }
  _bioFxUpdate(z.fx.teile, dt);
  _k6dStatus(false);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _k6dText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _k6dK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function _k6dWackel(z, wer) {
  const w = z.wackel[wer];
  return w > 0 ? Math.sin(w * 50) * 3 * (w / _k6dK.T_WACKEL) : 0;
}
// Getoenter Streifen einer Spur mit Namen und Strasse.
function _k6dSpur(ctx, wer) {
  const z = _k6d, K = _k6dK, F = K[wer], [y0, y1] = wer === 'A' ? K.SA : K.SB, Y = wer === 'A' ? K.YA : K.YB;
  ctx.save();
  ctx.fillStyle = F.grund; ctx.strokeStyle = F.rand; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, 4, y0, 412, y1 - y0, 8); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = K.STRASSE; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(K.X0 - 6, Y); ctx.lineTo(K.X1 + 8, Y); ctx.stroke();
  _k6dText(ctx, 'Bus ' + wer, 10 + _k6dWackel(z, wer), Y - 6, 13, F.t, 'left', '800');
  ctx.restore();
}
// Marken einer Spur: Punkt auf der Strasse, Minutenzahl darunter (bei 1 min
// abwechselnd in zwei Zeilen). a = Deckkraft (alte Marken blenden aus).
function _k6dMarken(ctx, P, wer, m, a, mitFedern) {
  if (a <= 0.01) return;
  const z = _k6d, K = _k6dK, F = K[wer], Y = wer === 'A' ? K.YA : K.YB;
  const h = wer === 'A' ? P.halteA : P.halteB, k = wer === 'A' ? P.a : P.b;
  const zweiZeilen = k * (K.X1 - K.X0) / K.M1 < 15;
  ctx.save();
  h.forEach((s, i) => {
    if (s > m + 1e-6) return;
    const x = _k6dX(s);
    let sc = 1;
    if (mitFedern && !(z.haltInfo && z.haltInfo.g === s)) {
      const seit = z.at - _k6dZeitBei(P, s);
      if (seit < K.T_POP) sc = Math.max(0.2, _bioFxEase.federn(_bioFxKlemme(seit / K.T_POP)));
    }
    ctx.globalAlpha = a;
    ctx.fillStyle = F.k; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, Y, 4.6 * sc, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = a * Math.min(1, sc);
    // weisser Rand: der Zeitzeiger laeuft hinter der Zahl durch, nicht durch sie
    const y = Y + (zweiZeilen && i % 2 ? 28 : 16);
    ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.lineJoin = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = F.grund;
    ctx.strokeText(String(s), x, y);
    _k6dText(ctx, String(s), x, y, 11, F.t, 'center', '700');
  });
  ctx.restore();
}
// Leuchten um beide Marken einer gleichen Minute (kurz beim Stillstand, beim Aha 2,6 s).
function _k6dGlanz(ctx) {
  const z = _k6d, K = _k6dK, P = z.P;
  if (P.start) return;
  for (const g of P.gleich) {
    const seit = z.at - P.an[g], dauer = g === P.aha ? K.T_AHA : P.steh + 0.35;
    if (seit < 0 || seit >= dauer) continue;
    const a = Math.min(1, (dauer - seit) / 0.35);
    ctx.save(); ctx.globalAlpha = a;
    _bioFxLeuchten(ctx, _k6dX(g), K.YA, g === P.aha ? 10 : 8, z.t, '245,158,11');
    _bioFxLeuchten(ctx, _k6dX(g), K.YB, g === P.aha ? 10 : 8, z.t, '245,158,11');
    ctx.restore();
  }
}
// Kleiner Bus von der Seite, Front rechts; y = Strasse (die Raeder stehen darauf).
// Das Dreieck zwischen den Raedern zeigt auf die Minute.
function _k6dBusBild(ctx, x, y, hoch, F) {
  ctx.save();
  // Schatten auf der Strasse (kleiner, je hoeher der Bus springt)
  ctx.fillStyle = 'rgba(15,23,42,' + (0.16 * (1 - Math.min(1, hoch / 16))).toFixed(3) + ')';
  ctx.beginPath(); ctx.ellipse(x, y + 1, 14 - hoch * 0.3, 2.2, 0, 0, Math.PI * 2); ctx.fill();
  const yb = y - hoch;
  ctx.fillStyle = F.k; ctx.strokeStyle = F.r; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x - 15, yb - 19, 30, 14, 3.5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = F.f;
  for (const dx of [-12.5, -7, -1.5]) ctx.fillRect(x + dx, yb - 17, 4.3, 4.6);
  _bioFxRundRect(ctx, x + 4.5, yb - 17, 8.5, 6, 1.5); ctx.fill();          // Frontscheibe
  ctx.fillStyle = F.s; ctx.fillRect(x - 15, yb - 10.6, 30, 1.6);           // Zierstreifen
  ctx.fillStyle = '#fef9c3';
  ctx.beginPath(); ctx.arc(x + 13.2, yb - 7.6, 1.3, 0, Math.PI * 2); ctx.fill();   // Scheinwerfer
  for (const dx of [-8.5, 8.5]) {
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.arc(x + dx, yb - 3.6, 3.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath(); ctx.arc(x + dx, yb - 3.6, 1.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = F.r;
  ctx.beginPath(); ctx.moveTo(x - 3, yb - 5); ctx.lineTo(x + 3, yb - 5); ctx.lineTo(x, yb - 0.8);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Zeitstrahl 0–36 min: Pfeil, Strich je Minute, Zahl je 6 min, Achsentitel.
function _k6dStrahl(ctx) {
  const K = _k6dK, Y = K.LY;
  ctx.save();
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(K.X0 - 8, Y); ctx.lineTo(K.X1 + 9, Y); ctx.stroke();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.moveTo(K.X1 + 18, Y); ctx.lineTo(K.X1 + 8, Y - 5.5); ctx.lineTo(K.X1 + 8, Y + 5.5);
  ctx.closePath(); ctx.fill();
  ctx.lineCap = 'butt';
  for (let m = 0; m <= K.M1; m++) {
    const x = _k6dX(m), sechs = m % 6 === 0;
    ctx.strokeStyle = sechs ? '#0f172a' : '#64748b'; ctx.lineWidth = sechs ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(x, Y + 1); ctx.lineTo(x, Y + (sechs ? 9 : 5)); ctx.stroke();
    if (sechs) _k6dText(ctx, String(m), x, Y + 21, 12, '#0f172a', 'center', '700');
  }
  _k6dText(ctx, 'Zeit in min', K.X1 + 18, Y + 37, 12, '#334155', 'right', '700');
  ctx.restore();
}
// Gestrichelter Zeitzeiger mit Dreieck auf dem Strahl.
function _k6dZeiger(ctx, m) {
  const K = _k6dK, x = _k6dX(m);
  ctx.save();
  ctx.strokeStyle = K.ZEIGER; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(x, K.ZY0); ctx.lineTo(x, K.LY - 9); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = K.ZEIGER;
  ctx.beginPath(); ctx.moveTo(x - 5, K.LY - 10); ctx.lineTo(x + 5, K.LY - 10); ctx.lineTo(x, K.LY - 1.5);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Fuer die Lehrkraft beim Halt: beide Marken dick orange umringt (der Ring
// endet ueber der Minutenzahl; die Verbindung zeigt schon der Zeitzeiger),
// oben das Schild „Beide Busse halten bei 12 min.“
function _k6dHaltBild(ctx) {
  const z = _k6d, K = _k6dK, h = z.haltInfo;
  if (!h) return;
  const x = _k6dX(h.g), text = 'Beide Busse halten bei ' + h.g + ' min.';
  ctx.save();
  ctx.strokeStyle = K.ORANGE; ctx.lineWidth = 2.6;
  for (const Y of [K.YA, K.YB]) { ctx.beginPath(); ctx.arc(x, Y, 7, 0, Math.PI * 2); ctx.stroke(); }
  ctx.font = '700 13px sans-serif';
  const w = ctx.measureText(text).width + 20, hh = 25, bx = 80, by = 8;
  ctx.fillStyle = '#fff7ed'; ctx.strokeStyle = K.ORANGE; ctx.lineWidth = 2.2;
  _bioFxRundRect(ctx, bx, by, w, hh, 8); ctx.fill(); ctx.stroke();
  _k6dText(ctx, text, bx + w / 2, by + hh / 2 + 4.6, 13, '#9a3412');
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-zeit.
function _k6dPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _k6dText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _k6dDraw(ctx, cv) {
  if (!_k6d) return;
  const z = _k6d, K = _k6dK, P = z.P, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const m = _k6dMin(P, z.at);
  _k6dSpur(ctx, 'A');
  _k6dSpur(ctx, 'B');
  _k6dZeiger(ctx, m);
  // alte Marken (vorige Fahrt) blenden im Vorlauf aus
  if (z.alt && z.at < K.T_VOR) {
    const a = 1 - _bioFxKlemme(z.at / K.T_VOR);
    _k6dMarken(ctx, z.alt.P, 'A', z.alt.m, a, false);
    _k6dMarken(ctx, z.alt.P, 'B', z.alt.m, a, false);
  }
  // Leuchten und Lichtringe HINTER Marken und Bussen: der Ring waechst unter
  // dem stehenden Bus hervor, Bus und Minutenzahl bleiben lesbar.
  _k6dGlanz(ctx);
  _bioFxDraw(ctx, z.fx.teile);
  _k6dMarken(ctx, P, 'A', m, 1, true);
  _k6dMarken(ctx, P, 'B', m, 1, true);
  for (const wer of ['A', 'B']) {
    const L = _k6dLage(z, wer);
    _k6dBusBild(ctx, _k6dX(L.min) + _k6dWackel(z, wer), wer === 'A' ? K.YA : K.YB, L.hoch, K[wer]);
  }
  _k6dStrahl(ctx);
  _k6dHaltBild(ctx);
  if (z.pause) _k6dPauseSchild(ctx);
}
