
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mg4 „Wie lange dauert es?“ (Kennung m5-zeit, Praefix _m6j)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL6_PROFIL.md, Abschnitte mg4 und
// „m5-zeit (mg4) · _m6j“; sim_plan in einheiten/mg4.json.
// Ueberschrift = Frage der Einheit: „Wie lange dauert die Fahrt?“
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   - Links oben eine runde Uhr: Zifferblatt mit 1–12 und Minutenstrichen,
//     Stunden- und Minutenzeiger. Waehrend der Fahrt fuellt sich am Rand des
//     Zifferblatts ein Ring in der Farbe des Sprungs (erster Sprung orange,
//     zweiter blau) – dieselben Minuten wie der Bogen auf dem Zeitstrahl.
//   - Unten ueber die ganze Breite ein Zeitstrahl von 7:30 bis 9:30
//     (massstaeblich, rund 3 px je Minute): kurze Striche alle 5 Minuten,
//     lange beschriftete Striche bei 7:30, 8:00, 8:30, 9:00, 9:30; die vollen
//     Stunden kraeftig (dicker, laenger, fett beschriftet). Rechts ein Pfeil.
//   - Ein kleiner gelber Bus steht auf dem Strahl; die Mitte des Busses (ein
//     kleines Dreieck zwischen den Raedern) zeigt auf die Uhrzeit. Uhr und Bus
//     laufen gemeinsam. Im Start steht er bei 7:30 an einer Haltestelle
//     (gruener Ring mit gelbem Grund und gezeichnetem „H“ – keine Schrift).
//   - Ueber dem Strahl die Spruenge als Boegen (von Busdach zu Busdach): der
//     erste bis zur vollen Stunde orange, der zweite blau; jeder wird beim
//     Landen beschriftet („10 min“, „15 min“). Liegen zwei Beschriftungen zu
//     dicht (7:50 bis 8:15), ruecken sie auseinander und zeigen mit einem
//     feinen Strich auf ihren Bogen.
//   - Unter dem Strahl Faehnchen: Abfahrt (schiefergrau, zeigt nach links),
//     Ankunft (gold, zeigt nach rechts). Ein Faehnchen verdeckt die
//     Strichbeschriftung, durch die sein Stiel liefe (7:50 bis 8:00: die
//     Ankunft „8:00“ steht dann im goldenen Faehnchen).
//   - „Tareks Weg“: neben der Uhr erscheint „815 − 750 = 65“ als
//     Ziffernrechnung (grauer, gestrichelter Kasten), ein blasser Bus faehrt
//     65 Minuten ab der Abfahrt und haelt bei 8:55 – dort ein graues
//     Faehnchen „8:55“, weit hinter der goldenen Ankunft. Die Uhr bleibt bei
//     der echten Fahrt (sie ist das Material, nicht Tareks Rechnung).
//
// BEWEGUNG (jede Sprungmarke spielt SELBST ab, N1 im Bauplan: ein Schritt im
// Heft = eine Handlung; anhalten kann die Lehrkraft):
//   Sprung auf die Abfahrt 0,6 s: der Bus huepft im Bogen von seiner Stelle
//     auf die Abfahrt, die Zeiger drehen mit, die Haltestelle blendet aus, die
//     beiden Faehnchen blenden ein.
//   Fahrt: 0,08 s je Minute (hoechstens 4,5 s je Fahrt; die vier Zeilen
//     brauchen 0,8 · 2,0 · 3,6 · 4,4 s), der Minutenzeiger dreht mit, der
//     Bogen waechst ueber dem Bus (Punkt an der Spitze).
//   Volle Stunde: der Bus haelt 0,4 s, der Minutenzeiger steht oben, der
//     erste Bogen ist fertig (Pfeilspitze, Beschriftung); dann waechst der
//     zweite Bogen bis zur Ankunft. Geht die Fahrt nur BIS zur vollen Stunde
//     (7:50 bis 8:00), ist das die Ankunft – kein Halt.
//   Ankunft: das goldene Faehnchen leuchtet 1,6 s, die Zeilen „Sprünge …“ und
//     „So lange …“ fuellen sich.
//   „Tareks Weg“: Kasten und blasser Bus blenden ein (0,3 s), der Bus faehrt
//     mit derselben Geschwindigkeit (hoechstens 4,5 s), am Ende das graue
//     Faehnchen und die Zeile _m6j-tarek. Noch einmal gedrueckt: von vorn.
//   „neu“: der Bus huepft zurueck auf 7:30 an die Haltestelle (0,6 s).
// Alles ist eine Funktion der Ablaufzeiten z.at und z.tarek.t (_m6jPlan,
// _m6jTarekPlan, _m6jBusMin): keine Zufallszahl, jede Zahl im Bild und in
// den Zeilen kommt aus derselben Rechnung in Minuten.
//
// Abspieldauer ab Knopfdruck (Tempo normal, Frames zu 16 ms, fuer simfakten.js):
//   7:50 bis 8:00 1,4 s (88) · 7:50 bis 8:15 3,0 s (188) · 7:35 bis 8:20 4,6 s
//   (288) · 7:45 bis 8:40 5,4 s (338) · „Tareks Weg“ 4,3 s (50 min) bzw. 4,8 s.
//   Mit den Schaltern aus fakten_ziehen.py (--voll --frames=25 --verlauf=4,
//   bis Frame 125) stehen die Endwerte ab Zeile 2 erst im zweiten
//   Knopfdurchgang und in der Wahlgruppe (die laeuft jede Fahrt mit jedem
//   Aktionsknopf aus).
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6jWahl('f1') …, eine
//     Wahlgruppe): „7:50 bis 8:00“ · „7:50 bis 8:15“ · „7:35 bis 8:20“ ·
//     „7:45 bis 8:40“
//   Reihe 2: „Tareks Weg“ (_m6jTarek) · „noch einmal“ (_m6jNochmal: die
//     gewaehlte Fahrt neu abspielen) – beide blass, solange keine Fahrt
//     gewaehlt ist · „neu“ (_m6jNeu: Bus an der Haltestelle, 7:30 Uhr).
//   Eine Sprungmarke waehrend des Ablaufs startet die Fahrt neu.
//
// STATUSZEILEN (woertlich aus dem Bauplan, jede mit Wert mehr als 18 Zeichen):
//   _m6j-fahrt     „Abfahrt 7:50 Uhr, Ankunft 8:15 Uhr“ (sofort bei der Wahl;
//                  Start „Fahrt: noch keine gewählt“)
//   _m6j-uhr       „Die Uhr zeigt jetzt: 8:00 Uhr“ (laeuft mit, ganze Minuten)
//   _m6j-spruenge  „Sprünge bis zur Ankunft: 10 min + 15 min“ (erst am Ende,
//                  in den Farben der Boegen; bei „7:50 bis 8:00“
//                  „Sprünge bis zur Ankunft: 10 min“; vorher „…“)
//   _m6j-dauer     „So lange dauert die Fahrt: 25 min“ (erst am Ende; Summe
//                  der angezeigten Spruenge; vorher „…“)
//   _m6j-tarek     nur nach „Tareks Weg“, wenn der blasse Bus steht:
//                  „Tareks Weg: 815 − 750 = 65. Mit 65 min wäre der Bus um
//                  8:55 Uhr da.“ (Muster fuer alle Zeilen: Uhrzeiten ohne
//                  Doppelpunkt subtrahiert, dann diese Minuten ab der Abfahrt)
// Jede Groesse mit Einheit (N3): „min“, Uhrzeiten mit „Uhr“. Nur Tareks
// Ziffernrechnung steht ohne Einheit – das ist genau sein Fehler (Bauplan).
//
// WERTE (jede Zeile nachgerechnet mit simcheck/werte.js):
//   7:50 bis 8:00 → 10 min                → 10 min · Tarek 800 − 750 = 50 → 8:40 Uhr
//   7:50 bis 8:15 → 10 min + 15 min       → 25 min · Tarek 815 − 750 = 65 → 8:55 Uhr
//   7:35 bis 8:20 → 25 min + 20 min       → 45 min · Tarek 820 − 735 = 85 → 9:00 Uhr
//   7:45 bis 8:40 → 15 min + 40 min       → 55 min · Tarek 840 − 745 = 95 → 9:20 Uhr
//   Alle Ankunftszeiten von „Tareks Weg“ liegen im Zeitstrahl (7:30 bis 9:30).
// START: Bus an der Haltestelle, Uhr auf 7:30 („Start: Es ist 7:30 Uhr.“).
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen): bei „7:50 bis 8:15“, wenn der
// Bus an der vollen Stunde haelt und der Minutenzeiger oben steht – Lichtring
// um den Strich 8:00, die Beschriftung „8:00“ leuchtet 2,6 s nach (die Stunde
// ist nach 60 Minuten voll, nicht nach 100). Einmal je Ablauf.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen / m5-minus-schriftlich,
// Container fpm-lehrkraft fuer simfakten.js, V3 aus Kapitel 4): eigene
// Knopfzeile UNTER den Heftknoepfen, davor klein „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m6jAnhalten): friert jede Bewegung ein (auch den
//     blassen Bus und den Lichtring); Schild „Pause“ oben links.
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m6jTempo): ein Drittel so schnell.
//   „Halt bei der vollen Stunde: aus“ <-> „…: an“ (_m6jHaltSchalter): ist er
//     an, wartet der Bus an der vollen Stunde, bis „weiter“ gedrueckt wird
//     (ein Ereignis im Ablauf wie „Halt beim Entbündeln“: die Ablaufzeit steht
//     genau auf der vollen Stunde). Im Bild das Schild „Volle Stunde: 8:00 Uhr“
//     mit gestricheltem Strich zum Bus, die Beschriftung „8:00“ leuchtet
//     orange. Gilt fuer die naechste volle Stunde einer Fahrt mit zwei
//     Spruengen.
//   Eine Sprungmarke, „noch einmal“ oder „neu“ heben die Pause auf; Tempo und
//   Halt bleiben stehen. Nur das wechselnde Wort steht in einem eigenen
//   <span> (sonst stuende die Knopfaufschrift als Zeile im Faktendump).
//   Hinweiszeile _m6j-lehrkraft (in der Pause bernsteinfarben) nennt immer die
//   Einstellung: „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal,
//   Halt: aus.“ · von Hand angehalten „Angehalten. Erkläre, was gerade
//   passiert. Dann „weiter“. …“ · beim Halt „Halt: Es ist 8:00 Uhr. Erkläre,
//   was gerade passiert. Dann „weiter“. …“.
//   Voreinstellung (Pause aus, Tempo normal, Halt aus): Zeitfaktor 1.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): „Zeitdauer“,
// „Zeitpunkt“, „60 Minuten“ und „1 Stunde hat …“ als Regel-Satz (die Uhr
// zeigt es), „bis zur vollen Stunde“ als Regel (der Bus tut es, der Text sagt
// es nicht), jedes Urteil (kein „falsch“, kein „richtig“). Keine Punkte, KEINE
// Zeitmessung (die Uhr ist Material, nichts wird gestoppt). Ein Name nur im
// Knopf und in der Zeile „Tareks Weg“ (Bauplan, wie m5-laengen).
// ════════════════════════════════════════════════════════════════════════
let _m6j = null;
// Uhrzeiten in Minuten seit Mitternacht: 7:50 Uhr = 470.
const _m6jFAHRTEN = {
  f1: { text: '7:50 bis 8:00', ab: 470, an: 480 },
  f2: { text: '7:50 bis 8:15', ab: 470, an: 495, aha: true },
  f3: { text: '7:35 bis 8:20', ab: 455, an: 500 },
  f4: { text: '7:45 bis 8:40', ab: 465, an: 520 }
};
const _m6jREIHE = ['f1', 'f2', 'f3', 'f4'];
const _m6jK = {
  // Zeitstrahl: 7:30 (450 min) bei X0, 9:30 (570 min) bei X1, Linie bei LY
  M0: 450, M1: 570, X0: 34, X1: 398, LY: 192,
  // Uhr: Mitte und Radius (oben links bleibt Platz fuer das Schild „Pause“,
  // unten fuer die Beschriftung des Bogens 7:35 bis 8:00 – gemessen am Bild)
  UX: 92, UY: 78, UR: 40,
  // Boegen: Anfang/Ende BY ueber der Linie (ueber dem Busdach), Hoehe aus der Breite
  BY: 22, BH_MIN: 14, BH_MAX: 34, BH_K: 0.27,
  // Strichbeschriftung (Grundlinie unter LY), Faehnchen (Oberkante, Hoehe)
  TLY: 26, FY: 31, FH: 18,
  // Tareks Ziffernrechnung neben der Uhr; Schild beim Lehrkraft-Halt
  RX: 146, RY: 34, HX: 152, HY: 80,
  // Zeiten in s
  T_HOP: 0.6, S_MIN: 0.08, T_MAX: 4.5, T_HALT: 0.4, T_EIN: 0.3,
  // Farben: erster Sprung orange, zweiter blau, Abfahrt schiefer, Ankunft gold
  F1: '#ea580c', F1T: '#c2410c', F2: '#1d4ed8', F2T: '#1e40af',
  ABF: '#334155', ANK: '#b45309', ANKT: '#92400e', TINTE: '#0f172a', GRAU: '#64748b'
};

// ── Rechnen in Minuten ──────────────────────────────────────────────────
// 470 -> „7:50“ (Doppelpunkt ohne Leerzeichen, Minuten zweistellig)
function _m6jUz(min) {
  const m = Math.round(min), h = Math.floor(m / 60), r = m - h * 60;
  return h + ':' + (r < 10 ? '0' : '') + r;
}
// Tareks Lesart: die Uhrzeit ohne Doppelpunkt als Zahl, 7:50 -> 750
function _m6jZiffern(min) { return Math.floor(min / 60) * 100 + min % 60; }
function _m6jX(min) {
  const K = _m6jK;
  return K.X0 + (min - K.M0) * (K.X1 - K.X0) / (K.M1 - K.M0);
}
// Der Plan einer Fahrt: volle Stunde, Spruenge, Zeitpunkte im Ablauf.
function _m6jPlan(S) {
  const K = _m6jK, vs = (Math.floor(S.ab / 60) + 1) * 60, zwei = S.an > vs;
  const v = Math.min(K.S_MIN, K.T_MAX / (S.an - S.ab));        // s je Minute
  const n1 = zwei ? vs : S.an, t1 = K.T_HOP + (n1 - S.ab) * v;
  const spr = [{ von: S.ab, nach: n1, d: n1 - S.ab, s0: K.T_HOP, dauer: (n1 - S.ab) * v,
                 farbe: K.F1, tinte: K.F1T }];
  let ende = t1;
  if (zwei) {
    const s0 = t1 + K.T_HALT;
    spr.push({ von: vs, nach: S.an, d: S.an - vs, s0, dauer: (S.an - vs) * v,
               farbe: K.F2, tinte: K.F2T });
    ende = s0 + (S.an - vs) * v;
  }
  return { ab: S.ab, an: S.an, vs, zwei, v, t1, ende, spr };
}
// Tareks Weg: Ziffern subtrahiert, dann diese Minuten ab der Abfahrt gefahren.
function _m6jTarekPlan(S) {
  const K = _m6jK, zAb = _m6jZiffern(S.ab), zAn = _m6jZiffern(S.an), d = zAn - zAb;
  const v = Math.min(K.S_MIN, K.T_MAX / d);
  return { zAb, zAn, d, ab: S.ab, ziel: S.ab + d, v, ende: K.T_EIN + d * v };
}
// Wo der Bus steht (Minuten, nicht gerundet) – daraus Uhr, Strahl und Zeile.
function _m6jBusMin(z) {
  const K = _m6jK, P = z.plan, at = z.at;
  if (at < K.T_HOP)
    return z.vonMin + (z.zielMin - z.vonMin) * _bioFxEase.sanft(_bioFxKlemme(at / K.T_HOP));
  if (!P) return z.zielMin;
  if (at < P.t1) return P.ab + (at - K.T_HOP) / P.v;
  if (P.zwei && at < P.t1 + K.T_HALT) return P.vs;
  if (P.zwei && at < P.ende) return P.vs + (at - P.t1 - K.T_HALT) / P.v;
  return P.an;
}
// Huepfer auf die Abfahrt (bzw. zurueck an die Haltestelle): Hoehe in px.
function _m6jHopY(z) {
  const K = _m6jK;
  if (z.at >= K.T_HOP) return 0;
  return -16 * Math.sin(Math.PI * _bioFxKlemme(z.at / K.T_HOP));
}
// Wo der blasse Bus steht (Tareks Weg).
function _m6jTarekMin(T) {
  const K = _m6jK, P = T.P;
  if (T.t <= K.T_EIN) return P.ab;
  return Math.min(P.ziel, P.ab + (T.t - K.T_EIN) / P.v);
}
// Sichtbarkeit der Haltestelle (blendet beim Losfahren aus, bei „neu“ ein).
function _m6jStopAlpha(z) {
  const u = _bioFxKlemme(z.at / _m6jK.T_HOP);
  return z.key ? z.stopVon * (1 - u) : z.stopVon + (1 - z.stopVon) * u;
}
// Stand fuer die Zeilen: ganze Minute der Uhr, Fahrt fertig, Tarek fertig.
function _m6jStand(z) {
  const P = z.plan;
  return { min: Math.floor(_m6jBusMin(z) + 1e-6),
           fertig: !!P && z.at >= P.ende,
           tarek: !!z.tarek && z.tarek.t >= z.tarek.P.ende };
}

function _m6jInit() {
  const K = _m6jK;
  _m6j = { t: 0, at: 9, key: null, plan: null, vonMin: K.M0, zielMin: K.M0, stopVon: 1,
           tarek: null, ende: false, endGlanz: 0, aha: false, ahaGlanz: 0,
           gehalten: false, haltInfo: null, fx: { teile: [] },
           pause: false, langsam: false, haltAn: false };   // Lehrkraft-Einstellungen
  _m6j.stand = _m6jStand(_m6j);
}
// Eine Fahrt laden (key = null: Bus zurueck an die Haltestelle, 7:30 Uhr).
function _m6jLaden(key) {
  const z = _m6j, K = _m6jK, S = key ? _m6jFAHRTEN[key] : null;
  z.vonMin = _m6jBusMin(z);               // von da aus, wo der Bus gerade ist
  z.stopVon = _m6jStopAlpha(z);
  z.key = key; z.plan = S ? _m6jPlan(S) : null;
  z.zielMin = S ? S.ab : K.M0;
  z.at = 0; z.tarek = null;
  z.ende = false; z.endGlanz = 0; z.aha = false; z.ahaGlanz = 0;
  z.gehalten = false; z.haltInfo = null;
  z.fx.teile.length = 0;
  z.pause = false;                        // neu laden hebt die Pause auf
  z.stand = _m6jStand(z);
}
function _m6jHTML() {
  const marke = k => `<button class="sim-btn" id="_m6j-b-${k}" onclick="_m6jWahl('${k}')">${_m6jFAHRTEN[k].text.replace(/ /g, '&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie lange dauert die Fahrt?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle eine Fahrt. Der Bus fährt von selbst. min heißt Minuten.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6j-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6jREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6j-tarekweg" onclick="_m6jTarek()">Tareks Weg</button>
          <button class="sim-btn" id="_m6j-nochmal" onclick="_m6jNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m6jNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6j-pause" onclick="_m6jAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6j-tempo" onclick="_m6jTempo()">Tempo: <span id="_m6j-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6j-halt" onclick="_m6jHaltSchalter()">Halt bei der vollen Stunde: <span id="_m6j-halt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6j-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6j-fahrt" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6j-uhr" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6j-spruenge" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6j-dauer" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_m6j-tarek" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Es ist 7:30&nbsp;Uhr.</p>
  </div>`;
}
function _m6jSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6jZeige(id, html) {
  const e = _m6jSetze(id, html);
  if (e && e.style) e.style.display = html ? '' : 'none';
}
function _m6jKnopf(id, an) {
  const b = document.getElementById(id);
  if (!b) return;
  b.disabled = !an;
  if (b.style) b.style.opacity = an ? '' : '0.45';
}
function _m6jStatus() {
  if (!_m6j) return;
  const z = _m6j, K = _m6jK, S = z.key ? _m6jFAHRTEN[z.key] : null, P = z.plan, st = z.stand;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  _m6jSetze('_m6j-fahrt', S
    ? 'Abfahrt ' + f(_m6jUz(S.ab) + ' Uhr', K.ABF) + ', Ankunft ' + f(_m6jUz(S.an) + ' Uhr', K.ANKT)
    : 'Fahrt: noch keine gewählt');
  _m6jSetze('_m6j-uhr', 'Die Uhr zeigt jetzt: ' + f(_m6jUz(st.min) + ' Uhr', K.TINTE));
  // Spruenge und Dauer erst am Ende; die Dauer ist die Summe der angezeigten Spruenge.
  const fertig = !!(P && st.fertig);
  _m6jSetze('_m6j-spruenge', 'Sprünge bis zur Ankunft: ' +
    (fertig ? P.spr.map(s => f(s.d + ' min', s.tinte)).join(' + ') : '…'));
  const summe = P ? P.spr.reduce((a, s) => a + s.d, 0) : 0;
  _m6jSetze('_m6j-dauer', 'So lange dauert die Fahrt: ' + (fertig ? f(summe + ' min', K.TINTE) : '…'));
  const T = z.tarek;
  _m6jZeige('_m6j-tarek', S && T && st.tarek
    ? 'Tareks Weg: ' + T.P.zAn + ' − ' + T.P.zAb + ' = ' + T.P.d + '. Mit ' + T.P.d +
      ' min wäre der Bus um ' + _m6jUz(T.P.ziel) + ' Uhr da.'
    : '');
  _m6jREIHE.forEach(k => {
    const b = document.getElementById('_m6j-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  _m6jKnopf('_m6j-tarekweg', !!S);
  _m6jKnopf('_m6j-nochmal', !!S);
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6jSetze('_m6j-pause', z.pause ? 'weiter' : 'Pause');
  _m6jSetze('_m6j-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6jSetze('_m6j-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _m6jSetze('_m6j-lehrkraft', _m6jHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6j-pause', z.pause], ['_m6j-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6jHinweis() {
  const z = _m6j;
  const kopf = z.haltInfo ? 'Halt: Es ist ' + _m6jUz(z.haltInfo.vs) + ' Uhr. Erkläre, was gerade passiert. Dann „weiter“.'
             : z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
             : 'Für die Lehrkraft: „Pause“ hält alles an.';
  return kopf + ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') + ', Halt: ' + (z.haltAn ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6jWahl(key) {
  if (!_m6j || !_m6jFAHRTEN[key]) return;
  _m6jLaden(key);
  _m6jStatus();
}
function _m6jNochmal() {
  if (!_m6j || !_m6j.key) return;
  _m6jLaden(_m6j.key);
  _m6jStatus();
}
function _m6jNeu() {
  if (!_m6j) return;
  _m6jLaden(null);
  _m6jStatus();
}
// „Tareks Weg“: nur mit gewaehlter Fahrt; noch einmal gedrueckt, faehrt er neu.
function _m6jTarek() {
  const z = _m6j;
  if (!z || !z.key) return;
  z.tarek = { t: 0, P: _m6jTarekPlan(_m6jFAHRTEN[z.key]) };
  z.stand = _m6jStand(z);
  _m6jStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6jAnhalten() {
  if (!_m6j) return;
  _m6j.pause = !_m6j.pause;
  _m6j.haltInfo = null;                   // „weiter“ nach dem Halt: der Bus faehrt jetzt weiter
  _m6jStatus();
}
function _m6jTempo() {
  if (!_m6j) return;
  _m6j.langsam = !_m6j.langsam;
  _m6jStatus();
}
function _m6jHaltSchalter() {
  if (!_m6j) return;
  _m6j.haltAn = !_m6j.haltAn;             // gilt fuer die naechste volle Stunde
  _m6jStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6jZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6jUpdate(dt) {
  if (!_m6j) return;
  const z = _m6j, K = _m6jK, P = z.plan;
  dt = _bioFxDt(dt) * _m6jZeitfaktor(z);            // ab hier Sim-Zeit
  if (dt > 0) {
    z.t += dt;
    let neu = false, at = z.at + dt;
    // Halt bei der vollen Stunde (Lehrkraft): ein Ereignis im Ablauf – die
    // Ablaufzeit bleibt genau auf der vollen Stunde stehen, bis „weiter“.
    if (P && P.zwei && z.haltAn && !z.gehalten && z.at < P.t1 && at >= P.t1) {
      at = P.t1; z.gehalten = true; z.pause = true; z.haltInfo = { vs: P.vs }; neu = true;
    }
    z.at = at;
    if (z.tarek) z.tarek.t += dt;
    z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
    z.endGlanz = Math.max(0, z.endGlanz - dt);
    if (P && _m6jFAHRTEN[z.key].aha && !z.aha && z.at >= P.t1) {
      // Aha: der Bus steht an der vollen Stunde, der Minutenzeiger oben
      z.aha = true; z.ahaGlanz = 2.6;
      _bioFxWelle(z.fx.teile, _m6jX(P.vs), K.LY, '#f59e0b', 30);
    }
    const st = _m6jStand(z), alt = z.stand;
    if (st.fertig && !z.ende) { z.ende = true; z.endGlanz = 1.6; }
    if (st.min !== alt.min || st.fertig !== alt.fertig || st.tarek !== alt.tarek) neu = true;
    z.stand = st;
    if (neu) _m6jStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6jText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m6jK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Die Uhr: Zifferblatt 1–12, Minutenstriche, Ringe der Spruenge, zwei Zeiger.
function _m6jUhr(ctx, min) {
  const z = _m6j, K = _m6jK, P = z.plan, cx = K.UX, cy = K.UY, R = K.UR;
  const w = m => -Math.PI / 2 + m * Math.PI / 30;          // Minute -> Winkel
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.12)';
  ctx.beginPath(); ctx.arc(cx + 2, cy + 3, R + 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, R + 1.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Ringe: die Minuten jedes Sprungs in seiner Farbe (erst nach dem Sprung auf die Abfahrt)
  if (P && z.at >= K.T_HOP) {
    for (const s of P.spr) {
      const bis = Math.min(min, s.nach);
      if (bis <= s.von + 1e-6) continue;
      const a0 = w(s.von % 60), a1 = a0 + (bis - s.von) * Math.PI / 30;
      ctx.globalAlpha = 0.3; ctx.fillStyle = s.farbe;
      ctx.beginPath(); ctx.arc(cx, cy, R - 0.5, a0, a1); ctx.arc(cx, cy, R - 10, a1, a0, true);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  // Minutenstriche (lang bei jeder fuenften Minute)
  for (let i = 0; i < 60; i++) {
    const a = w(i), lang = i % 5 === 0, r0 = R - (lang ? 7 : 3.5), r1 = R - 0.5;
    ctx.strokeStyle = lang ? '#1e293b' : '#64748b'; ctx.lineWidth = lang ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + r0 * Math.cos(a), cy + r0 * Math.sin(a));
    ctx.lineTo(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a));
    ctx.stroke();
  }
  // Zeiger: Stunde (kurz, breit), Minute (lang)
  const hA = -Math.PI / 2 + ((min / 60) % 12) * Math.PI / 6, mA = w(((min % 60) + 60) % 60);
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * 0.48 * Math.cos(hA), cy + R * 0.48 * Math.sin(hA)); ctx.stroke();
  ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * 0.82 * Math.cos(mA), cy + R * 0.82 * Math.sin(mA)); ctx.stroke();
  // Ziffern NACH den Zeigern, mit weissem Rand: der Minutenzeiger laeuft unter
  // ihnen durch, und „3“ bei 8:15 oder „12“ bei 8:00 bleibt lesbar.
  ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round'; ctx.lineWidth = 3.2; ctx.strokeStyle = '#ffffff';
  for (let n = 1; n <= 12; n++) {
    const a = w(n * 5), x = cx + (R - 14.5) * Math.cos(a), y = cy + (R - 14.5) * Math.sin(a) + 4;
    ctx.strokeText(String(n), x, y);
    _m6jText(ctx, String(n), x, y, 11, '#0f172a');
  }
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(cx, cy, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// Der Zeitstrahl: Linie mit Pfeil, Striche alle 5 Minuten, Beschriftung bei
// :00 und :30 (nicht dort, wo der Stiel eines Faehnchens durchliefe);
// glanzMin/glanz/glanzFarbe: eine Beschriftung leuchtet (Aha, Halt).
function _m6jStrahl(ctx, fahnen, glanzMin, glanz, glanzFarbe) {
  const K = _m6jK;
  ctx.save();
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(K.X0 - 8, K.LY); ctx.lineTo(K.X1 + 9, K.LY); ctx.stroke();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.moveTo(K.X1 + 17, K.LY); ctx.lineTo(K.X1 + 8, K.LY - 5.5); ctx.lineTo(K.X1 + 8, K.LY + 5.5);
  ctx.closePath(); ctx.fill();
  for (let m = K.M0; m <= K.M1; m += 5) {
    const x = _m6jX(m), voll = m % 60 === 0, halb = m % 30 === 0;
    ctx.strokeStyle = voll ? '#0f172a' : halb ? '#334155' : '#64748b';
    ctx.lineWidth = voll ? 3 : halb ? 1.8 : 1.2; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.moveTo(x, K.LY + 1.5); ctx.lineTo(x, K.LY + (voll ? 13 : halb ? 9 : 5)); ctx.stroke();
    if (!halb) continue;
    const t = _m6jUz(m);
    ctx.font = (voll ? '800' : '600') + ' 12px sans-serif';
    const halbB = ctx.measureText(t).width / 2 + 3;          // Stiel braucht 3 px Luft
    if (fahnen.some(f => Math.abs(_m6jX(f) - x) < halbB)) continue;
    if (m === glanzMin && glanz > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(0.85, glanz);
      _bioFxLeuchten(ctx, x, K.LY + K.TLY - 5, 11, _m6j.t, glanzFarbe);
      ctx.restore();
    }
    _m6jText(ctx, t, x, K.LY + K.TLY, 12, voll ? '#0f172a' : '#475569', 'center', voll ? '800' : '600');
  }
  ctx.restore();
}
// Haltestelle bei 7:30: Mast und runder Schild (gezeichnetes „H“, keine Schrift).
function _m6jHaltestelle(ctx, a) {
  if (a <= 0.01) return;
  const K = _m6jK, x = _m6jX(K.M0) - 21, y = K.LY;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y - 1); ctx.lineTo(x, y - 26); ctx.stroke();
  ctx.fillStyle = '#fde047'; ctx.strokeStyle = '#15803d'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y - 32, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#15803d'; ctx.lineWidth = 1.8; ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(x - 2.6, y - 35.6); ctx.lineTo(x - 2.6, y - 28.4);
  ctx.moveTo(x + 2.6, y - 35.6); ctx.lineTo(x + 2.6, y - 28.4);
  ctx.moveTo(x - 2.6, y - 32); ctx.lineTo(x + 2.6, y - 32);
  ctx.stroke();
  ctx.restore();
}
// Geometrie eines Bogens (quadratische Kurve, Spitze waechst linear in x mit dem Bus).
function _m6jBogenForm(s) {
  const K = _m6jK, xa = _m6jX(s.von), xb = _m6jX(s.nach), b = xb - xa;
  const y0 = K.LY - K.BY, h = Math.max(K.BH_MIN, Math.min(K.BH_MAX, b * K.BH_K));
  return { xa, xb, y0, cx: (xa + xb) / 2, cy: y0 - 2 * h, ax: (xa + xb) / 2, ay: y0 - h };
}
function _m6jBogenPfad(ctx, g, u) {
  // Teilkurve [0,u] (de Casteljau)
  const qx = g.xa + (g.cx - g.xa) * u, qy = g.y0 + (g.cy - g.y0) * u;
  const ex = (1 - u) * (1 - u) * g.xa + 2 * u * (1 - u) * g.cx + u * u * g.xb;
  const ey = (1 - u) * (1 - u) * g.y0 + 2 * u * (1 - u) * g.cy + u * u * g.y0;
  ctx.beginPath(); ctx.moveTo(g.xa, g.y0); ctx.quadraticCurveTo(qx, qy, ex, ey);
  return [ex, ey];
}
// Beschriftungen ueber den Scheiteln; zu dicht beieinander -> auseinanderruecken.
function _m6jEtiketten(ctx, P) {
  ctx.font = '700 13px sans-serif';
  const e = P.spr.map(s => {
    const g = _m6jBogenForm(s), t = s.d + ' min';
    return { s, g, t, w: ctx.measureText(t).width + 16, x: g.ax, y: g.ay - 13 };
  });
  if (e.length === 2) {
    const soll = (e[0].w + e[1].w) / 2 + 6, ist = e[1].x - e[0].x;
    if (ist < soll) { const d = (soll - ist) / 2; e[0].x -= d; e[1].x += d; }
  }
  return e;
}
function _m6jBogen(ctx, s, u) {
  const g = _m6jBogenForm(s);
  ctx.save();
  ctx.strokeStyle = s.farbe; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  const [ex, ey] = _m6jBogenPfad(ctx, g, u);
  ctx.stroke();
  if (u < 1) {                                   // Punkt an der Spitze, ueber dem Bus
    ctx.fillStyle = s.farbe; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else {                                       // Pfeilspitze an der Landung
    const dx = g.xb - g.cx, dy = g.y0 - g.cy, n = Math.hypot(dx, dy) || 1;
    const ux = dx / n, uy = dy / n, px = -uy, py = ux;
    ctx.fillStyle = s.farbe;
    ctx.beginPath();
    ctx.moveTo(g.xb - ux * 3, g.y0 - uy * 3);
    ctx.lineTo(g.xb - ux * 13 + px * 4.5, g.y0 - uy * 13 + py * 4.5);
    ctx.lineTo(g.xb - ux * 13 - px * 4.5, g.y0 - uy * 13 - py * 4.5);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function _m6jEtikett(ctx, e, a) {
  if (a <= 0.01) return;
  const h = 21;
  ctx.save();
  ctx.globalAlpha = a;
  if (Math.abs(e.x - e.g.ax) > 3) {              // feiner Strich zum eigenen Bogen
    ctx.strokeStyle = e.s.farbe; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(e.x, e.y + h / 2); ctx.lineTo(e.g.ax, e.g.ay - 1.5); ctx.stroke();
  }
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = e.s.farbe; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, e.x - e.w / 2, e.y - h / 2, e.w, h, 7); ctx.fill(); ctx.stroke();
  _m6jText(ctx, e.t, e.x, e.y + 4.7, 13, e.s.tinte);
  ctx.restore();
}
// Faehnchen unter dem Strahl: Punkt auf der Linie, Stiel, Kaestchen mit der Uhrzeit.
// art 'ab' zeigt nach links, 'an' und 'tarek' nach rechts.
function _m6jFahne(ctx, m, art, a, glanz) {
  if (a <= 0.01) return;
  const K = _m6jK, x = _m6jX(m), text = _m6jUz(m);
  const F = { ab:    ['#334155', '#f1f5f9', '#1e293b', '#334155'],
              an:    ['#b45309', '#fef3c7', '#92400e', '#f59e0b'],
              tarek: ['#94a3b8', '#f8fafc', '#64748b', '#94a3b8'] }[art];
  ctx.save();
  ctx.font = '700 12px sans-serif';
  const w = ctx.measureText(text).width + 14, y = K.LY + K.FY;
  const bx = art === 'ab' ? x + 5 - w : x - 5;
  ctx.globalAlpha = a;
  if (glanz > 0) {
    ctx.save(); ctx.globalAlpha = a * Math.min(1, glanz / 0.6);
    _bioFxLeuchten(ctx, bx + w / 2, y + K.FH / 2, 16, _m6j.t, '252,211,77');
    ctx.restore();
  }
  ctx.strokeStyle = F[0]; ctx.lineWidth = 1.5;
  if (art === 'tarek') ctx.setLineDash([3, 2]);
  ctx.beginPath(); ctx.moveTo(x, K.LY + 4); ctx.lineTo(x, y); ctx.stroke();
  ctx.fillStyle = F[1]; ctx.lineWidth = 1.8;
  _bioFxRundRect(ctx, bx, y, w, K.FH, 5); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  _m6jText(ctx, text, bx + w / 2, y + K.FH / 2 + 4.3, 12, F[2]);
  ctx.fillStyle = F[3]; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, K.LY, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Kleiner Bus von der Seite, Front rechts; y = Hoehe der Linie (die Raeder stehen darauf).
// Das Dreieck zwischen den Raedern zeigt auf die Uhrzeit.
function _m6jBus(ctx, x, y, blass, a) {
  if (a <= 0.01) return;
  const c = blass
    ? { k: '#e2e8f0', r: '#94a3b8', f: '#f8fafc', s: '#cbd5e1', d: '#94a3b8', l: '#e2e8f0' }
    : { k: '#facc15', r: '#a16207', f: '#dbeafe', s: '#ca8a04', d: '#1f2937', l: '#fef9c3' };
  ctx.save();
  ctx.globalAlpha = a;
  if (!blass) {
    ctx.fillStyle = 'rgba(15,23,42,0.12)';
    _bioFxRundRect(ctx, x - 14, y - 17, 31, 14, 3.5); ctx.fill();
  }
  ctx.fillStyle = c.k; ctx.strokeStyle = c.r; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x - 15, y - 19, 30, 14, 3.5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = c.f;
  for (const dx of [-12.5, -7, -1.5]) ctx.fillRect(x + dx, y - 17, 4.3, 4.6);
  _bioFxRundRect(ctx, x + 4.5, y - 17, 8.5, 6, 1.5); ctx.fill();        // Frontscheibe
  ctx.fillStyle = c.s; ctx.fillRect(x - 15, y - 10.6, 30, 1.6);         // Zierstreifen
  ctx.fillStyle = c.l;
  ctx.beginPath(); ctx.arc(x + 13.2, y - 7.6, 1.3, 0, Math.PI * 2); ctx.fill();   // Scheinwerfer
  for (const dx of [-8.5, 8.5]) {
    ctx.fillStyle = c.d;
    ctx.beginPath(); ctx.arc(x + dx, y - 3.6, 3.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath(); ctx.arc(x + dx, y - 3.6, 1.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = c.r;
  ctx.beginPath(); ctx.moveTo(x - 3, y - 5); ctx.lineTo(x + 3, y - 5); ctx.lineTo(x, y - 0.8);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Tareks Weg: Ziffernrechnung neben der Uhr, blasser Bus, graues Faehnchen.
function _m6jTarekBild(ctx) {
  const z = _m6j, K = _m6jK, T = z.tarek;
  if (!T || !z.key) return;
  const P = T.P, a = _bioFxKlemme(T.t / K.T_EIN);
  const text = P.zAn + ' − ' + P.zAb + ' = ' + P.d;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.font = '700 17px sans-serif';
  const w = ctx.measureText(text).width + 22, h = 30;
  ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.8;
  ctx.setLineDash([5, 3]);
  _bioFxRundRect(ctx, K.RX, K.RY, w, h, 7); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  _m6jText(ctx, text, K.RX + w / 2, K.RY + h / 2 + 6, 17, '#475569');
  ctx.restore();
  if (T.t >= P.ende) _m6jFahne(ctx, P.ziel, 'tarek', _bioFxKlemme((T.t - P.ende) / 0.25), 0);
  _m6jBus(ctx, _m6jX(_m6jTarekMin(T)), K.LY, true, 0.75 * a);
}
// Schild beim Lehrkraft-Halt: „Volle Stunde: 8:00 Uhr“, gestrichelter Strich zum Bus.
function _m6jHaltSchild(ctx) {
  const z = _m6j, K = _m6jK, h = z.haltInfo;
  if (!h) return;
  const text = 'Volle Stunde: ' + _m6jUz(h.vs) + ' Uhr';
  ctx.save();
  ctx.font = '700 14px sans-serif';
  const w = ctx.measureText(text).width + 20, hh = 26, bx = K.HX, by = K.HY;
  ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(bx + 12, by + hh); ctx.lineTo(_m6jX(h.vs) + 5, K.LY - K.BY - 4); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#fff7ed'; ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 2.2;
  _bioFxRundRect(ctx, bx, by, w, hh, 8); ctx.fill(); ctx.stroke();
  _m6jText(ctx, text, bx + w / 2, by + hh / 2 + 5, 14, '#9a3412');
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-verteilen.
function _m6jPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6jText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6jDraw(ctx, cv) {
  if (!_m6j) return;
  const z = _m6j, K = _m6jK, W = cv.width, H = cv.height, P = z.plan, T = z.tarek;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const min = _m6jBusMin(z);
  _m6jUhr(ctx, min);
  // Zeitstrahl; die volle Stunde leuchtet beim Aha (gold) und beim Halt (orange)
  const fahnen = P ? [P.ab, P.an] : [];
  if (T && T.t >= T.P.ende) fahnen.push(T.P.ziel);
  const glanz = z.haltInfo ? 1 : z.ahaGlanz / 2.6 * 1.6;
  _m6jStrahl(ctx, fahnen, P ? P.vs : -1, glanz, z.haltInfo ? '234,88,12' : '245,158,11');
  _m6jHaltestelle(ctx, _m6jStopAlpha(z));
  if (P) {
    const ein = _bioFxKlemme(z.at / K.T_HOP);
    _m6jFahne(ctx, P.ab, 'ab', ein, 0);
    _m6jFahne(ctx, P.an, 'an', ein, z.endGlanz);
    const et = _m6jEtiketten(ctx, P);
    P.spr.forEach((s, i) => {
      // + 1e-6: beim Halt steht at GENAU auf der vollen Stunde – (1,4 − 0,6) / 0,8
      // ergibt 0,99999…, und der Bogen zeigte noch den Punkt statt der Pfeilspitze.
      const u = _bioFxKlemme((z.at - s.s0) / s.dauer + 1e-6);
      if (z.at < s.s0 || u <= 0) return;
      _m6jBogen(ctx, s, u);
      _m6jEtikett(ctx, et[i], _bioFxKlemme((u - 0.8) / 0.2));
    });
  }
  _m6jTarekBild(ctx);
  _m6jBus(ctx, _m6jX(min), K.LY + _m6jHopY(z), false, 1);
  _m6jHaltSchild(ctx);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6jPauseSchild(ctx);
}
