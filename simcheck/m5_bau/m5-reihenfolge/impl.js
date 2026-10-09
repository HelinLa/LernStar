

// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mr3 „Punkt vor Strich – warum?“
// (Kennung m5-reihenfolge, Praefix _m6c)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL5_PROFIL.md, Abschnitt m5-reihenfolge
// (Einheit mr3; Regeln N1–N3, Lehrkraft-Zeile wie Kapitel 4).
// Ueberschrift laut Bauplan: „Was wird zuerst gerechnet?“ (die `frage` der
// Einheit nennt Leni; „zuerst“ ist seit mr2 eingefuehrt).
//
// Was man sieht – drei Darstellungen, durch die FARBE verbunden (Punktefeld
// blau, einzelne Plaettchen orange; in Rechnung, Rechenbaum, Tisch und
// Statuszeilen gleich):
//   RECHNUNG (oben, gross): „3 + 4 · 5“ – die 3 orange, „4 · 5“ blau. Ist das
//     Ergebnis da, kommt „= 23“ dazu (federnd).
//   RECHENBAUM (links, Ueberschrift „Rechenbaum“): oben die drei Zahlen in
//     Kaestchen, darunter zwei Rechenkreise mit ihrem Zeichen, unter jedem
//     Kreis ein Kasten fuer sein Ergebnis (gestrichelt, solange leer). Der
//     Kreis, der zuerst gerechnet wird, HAENGT HOEHER: bei 3 + 4 · 5 rechts
//     (4 und 5), bei 4 · 5 + 3 und (3 + 4) · 5 links. Bei (3 + 4) · 5 ist der
//     Teil in der Klammer gestrichelt umrandet.
//   TISCH (rechts, Karopapier, ein Plaettchen je Kaestchen): das Produkt als
//     blaues Punktefeld (4 Reihen zu je 5), daneben eine Klammer „]“ mit
//     „4 · 5“; der Summand als einzelne orange Plaettchen in einer Reihe
//     unten, daneben „3“. Bei (3 + 4) · 5 liegen 3 orange und 4 blaue Reihen
//     zu je 5 da („3 Reihen“, „4 Reihen“), mit kleinem Abstand dazwischen.
//     Die Menge liegt von Anfang an da; die Rechnung zaehlt sie nur.
//
// Bewegung (eine Sprungmarke spielt SELBST ab, N1: ein Schritt im Heft = eine
// Handlung; anhalten kann die Lehrkraft). Alles ist eine Funktion der
// Ablaufzeit L.t (Konstanten in _m6cK) – keine Zufallszahl:
//   0–0,65 s   Rechnung und Rechenbaum blenden ein, die Plaettchen springen
//              Reihe fuer Reihe auf den Tisch (federnd).
//   0,65 s     ERSTER Schritt: der hoehere Kreis leuchtet, seine Aeste werden
//              bernsteinfarben. Bei einer Malrechnung leuchten die Reihen des
//              Feldes nacheinander auf; bei (3 + 4) · 5 gleiten die 3 orange
//              und die 4 blauen Reihen zusammen. 1,35 s: das Zwischenergebnis
//              springt in seinen Kasten, neben dem Feld steht „4 · 5 = 20“
//              (bzw. „7 Reihen“).
//   1,6 s      ZWEITER Schritt: der untere Kreis leuchtet; die einzelnen
//              Plaettchen gleiten in die naechste Reihe des Feldes (bei
//              (3 + 4) · 5 leuchten die 7 Reihen nacheinander). 2,35 s: das
//              Ergebnis springt in den unteren Kasten und hinter die Rechnung.
//   Ende 2,55 s = 160 Frames zu 16 ms (alle vier Sprungmarken gleich lang;
//   gemessen mit dem Treiber auf rauchtest.baueContext, 08.10.2026).
//   simfakten.js deshalb mit --frames=40 --verlauf=4 fahren (liest bis Frame
//   200): Mit dem Standard (2 Frames) stehen die Zeilen der Sprungmarken im
//   Dump, die der Gegenprobe („Von links: …“, „Für 7 Reihen …“) fehlen.
//   „von links rechnen“ (Gegenprobe fuer die geladene Rechnung):
//     3 + 4 · 5 und 2 + 3 · 4: der Rechenbaum wechselt (0,35 s) in die Form
//       „von links“ (erst +, dann ·; Ueberschrift „Rechenbaum von links“,
//       Aeste gestrichelt). 1,1 s: 3 + 4 = 7, auf dem Tisch erscheint ein
//       gestrichelter Rahmen fuer 7 Reihen zu je 5. 1,95 s: 7 · 5 = 35, die
//       12 Plaetze, fuer die keine Plaettchen da sind, stehen gestrichelt im
//       Rahmen und blinken zweimal orange. Ende 2,3 s = 144 Frames.
//     4 · 5 + 3: derselbe Baum noch einmal, von links gerechnet; am Ende
//       leuchten alle 23 Plaettchen kurz („Es fehlen keine Plättchen.“).
//     (3 + 4) · 5: der Baum bleibt; die Klammer in der Rechnung und die
//       Umrandung im Baum leuchten auf (0,9 s).
//   „noch einmal“ spielt die gewaehlte Rechnung neu ab, „neu“ fuehrt zum
//   Start zurueck.
// Wer waehrend einer Bewegung „von links rechnen“ drueckt, laesst die
// laufende Bewegung sofort ankommen; dann geschieht das Neue. Sprungmarke,
// „noch einmal“ und „neu“ bauen neu auf. Jede Knopffolge endet so in
// denselben Zahlen.
// Grenzen: keine (keine Regler, Bauplan). „von links rechnen“ und „noch
// einmal“ sind blass, solange keine Rechnung gewaehlt ist; ein Druck laesst
// dann nur den Rechenbaum kurz wackeln.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6cMarke('a') …):
//     „2 + 3 · 4“ · „3 + 4 · 5“ · „4 · 5 + 3“ · „(3 + 4) · 5“
//   Reihe 2: „von links rechnen“ (_m6cLinks()) · „noch einmal“ (_m6cNochmal())
//            · „neu“ (_m6cNeu())
//
// Statuszeilen (woertlich aus dem Bauplan, jede mit mehr als 18 Zeichen –
// simfakten.js). Sie folgen dem Bild: Eine Zahl steht erst in der Anzeige,
// wenn sie im Bild angekommen ist.
//   _m6c-rechnung  „Gerechnet wird: 3 + 4 · 5“ (Start „Gerechnet wird: noch nichts“)
//   _m6c-schritt1  „Erster Schritt: 4 · 5 = 20“ (vorher „… noch nicht gerechnet“)
//   _m6c-schritt2  „Zweiter Schritt: 3 + 20 = 23“ (vorher „… noch nicht gerechnet“)
//   _m6c-ergebnis  „Ergebnis der Rechnung: 23“ (vorher „… noch keins“)
//   _m6c-tisch     „Plättchen auf dem Tisch: 23“ (Start „… noch keine“, waehrend
//                  die Rechnung zaehlt „…“)
//   nur nach „von links rechnen“ (sonst ausgeblendet):
//   _m6c-links     „Von links: 3 + 4 = 7, 7 · 5 = 35“ (nach dem ersten Schritt
//                  „Von links: 3 + 4 = 7, …“); bei (3 + 4) · 5 stattdessen
//                  „Hier gibt die Klammer den Weg vor.“
//   _m6c-fehlen    „Für 7 Reihen zu je 5 fehlen 12 Plättchen.“ bzw.
//                  „Es fehlen keine Plättchen.“ (nicht bei (3 + 4) · 5)
// Zwischen Zahl und Zeichen steht ein geschuetztes Leerzeichen (U+00A0).
//
// Werte (jede Zahl aus _m6cWerte(), nachgerechnet mit simcheck/werte.js):
//   2 + 3 · 4   → 3 · 4 = 12, 2 + 12 = 14, Tisch 14; von links 2 + 3 = 5,
//                 5 · 4 = 20, „Für 5 Reihen zu je 4 fehlen 6 Plättchen.“
//   3 + 4 · 5   → 4 · 5 = 20, 3 + 20 = 23, Tisch 23; von links 3 + 4 = 7,
//                 7 · 5 = 35, „Für 7 Reihen zu je 5 fehlen 12 Plättchen.“
//   4 · 5 + 3   → 4 · 5 = 20, 20 + 3 = 23, Tisch 23; von links 4 · 5 = 20,
//                 20 + 3 = 23, „Es fehlen keine Plättchen.“
//   (3 + 4) · 5 → 3 + 4 = 7, 7 · 5 = 35, Tisch 35 (7 Reihen zu je 5);
//                 von links „Hier gibt die Klammer den Weg vor.“
// Start: noch nichts gewaehlt („Start: noch keine Rechnung gewählt“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen):
//   3 + 4 · 5 – die 3 Plaettchen sind zum fertigen Feld geglitten: ein
//     Lichtring breitet sich ueber allen 23 aus, ein bernsteinfarbener Rahmen
//     pulsiert 2,6 s um sie. Das widerlegt „35“ und „12“.
//   Gegenprobe zu 3 + 4 · 5 – ein zweiter Lichtring (orange) um die 12 leeren
//     Plaetze. Bei jedem Abspielen; nicht, wenn ein Knopfdruck die Bewegung
//     sofort ankommen laesst.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-plus-schriftlich / m5-malkreuz, im
// Container <div class="fpm-lehrkraft">, den simfakten.js ueberspringt).
// Eigene Zeile UNTER den Heftknoepfen, davor klein „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6cAnhalten()): friert jede Bewegung sofort ein;
//     Schild „Pause“ oben links im Bild (Stelle wie in m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6cTempo()): ein Drittel so schnell.
//   „Halt nach dem ersten Schritt: aus“ ↔ „… an“ (_m6cHaltSchalter()): Der
//     Ablauf haelt von selbst an, sobald das Zwischenergebnis im oberen
//     Kasten steht und BEVOR der zweite Kreis leuchtet (Sprungmarke 1,5 s,
//     von links 1,25 s). Der Kasten ist bernsteinfarben eingerahmt; dann ist
//     Pause, „weiter“ rechnet den zweiten Schritt.
//   Nur das wechselnde Wort steht in einem eigenen <span>.
// Hinweiszeile _m6c-lehrkraft (in der Pause „lmp-status off“, sonst „on“):
//   sonst  „Für die Lehrkraft: „Pause“ hält alles an. „Halt nach dem ersten Schritt“ stoppt von selbst.“
//   Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
//   Halt   „Halt nach dem ersten Schritt: 4 · 5 = 20. Was wird jetzt gerechnet? Dann „weiter“.“
// So ist es gebaut: EIN Zeitfaktor (_m6cZeitfaktor: 0 Pause, 1/3 langsam,
// 1 normal) an der einen Stelle, an der dt in _m6cUpdate hineingeht; ohne
// Zeit kein Schritt im Ablauf. Der Halt ist ein EREIGNIS im Ablauf (Zeitpunkt
// HALT_N bzw. HALT_L wird ueberschritten). In der Pause bewegt „von links
// rechnen“ nichts: Steht eine Bewegung, entfaellt der Druck; steht keine, wird
// er VORGEMERKT und beginnt mit „weiter“ (das Schild „Pause“ leuchtet kurz
// auf, in echter Zeit). Sprungmarke, „noch einmal“ und „neu“ heben die Pause
// auf; Tempo und Halt bleiben stehen. Voreinstellung: Pause aus, Tempo
// normal, Halt aus – dann laeuft alles wie ohne Lehrkraft-Zeile.
//
// Farbe der Klammer: schiefergrau (#475569), nicht orange wie in m5-klammern
// (#ea580c) – hier traegt Orange schon den Summanden (die 3 einzelnen
// Plaettchen bzw. die 3 orange Reihen); eine orange Klammer laese sich als
// „gehoert zur 3“. Wer es wie m5-klammern will: _m6cK.KLAMMER = '#ea580c'.
// Der Baum selbst ist wie in m5-klammern: Aeste #94a3b8, Kreise weiss mit
// Rand #334155, beim Rechnen #fef3c7 mit Rand #d97706 (Bernstein).
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Punktrechnung“,
// „Strichrechnung“, „Punkt vor Strich“, die Regel als Satz (kein „Mal kommt
// vor Plus“). Keine Namen, keine Punkte, keine Zeitmessung, kein „falsch“.
// Deterministisch, ohne Zufall: jede Zahl im Bild und in den Statuszeilen
// kommt aus _m6cWerte().
// ════════════════════════════════════════════════════════════════════════
let _m6c = null;
const _m6cREIHE = ['a', 'b', 'c', 'd'];
// typ plusMal: z = [einzelne, Reihen, je Reihe]   s + r · n
// typ malPlus: z = [Reihen, je Reihe, einzelne]   r · n + s
// typ klammer: z = [orange Reihen, blaue Reihen, je Reihe]   (r1 + r2) · n
const _m6cR = {
  a: { typ: 'plusMal', z: [2, 3, 4] },
  b: { typ: 'plusMal', z: [3, 4, 5] },
  c: { typ: 'malPlus', z: [4, 5, 3] },
  d: { typ: 'klammer', z: [3, 4, 5] }
};
const _m6cK = {
  // Tisch: Kaestchen, linke obere Ecke des Feldes, Plaettchenradius,
  // Reihe der einzelnen Plaettchen vor dem zweiten Schritt, Abstand 3 | 4 Reihen
  KA: 15, GX: 230, GY: 60, RP: 5.2, SROW: 9, GAP: 10,
  // Flaechen: Rechenbaum links, Tisch rechts
  BX0: 6, BX1: 206, BY0: 48, BY1: 246,
  TX0: 212, TX1: 414, TY0: 48, TY1: 246,
  // Rechnung oben
  RX: 210, RY: 35, RG: 26,
  // Rechenbaum: Zahlen oben (Mitten, Hoehe), Kreise, Ergebniskaesten
  NX: [40, 106, 172], NY: 84, NW: 34, NH: 24,
  C1Y: 128, E1Y: 160, C2Y: 198, E2Y: 230, CR: 13, EW: 40, EH: 24,
  // Zeiten (s) – Sprungmarke
  A_EIN0: 0.05, A_EIN: 0.3, M_POP0: 0.1, M_ROW: 0.05, M_POP: 0.25,
  S1: 0.65, S1_ERG: 1.35, HALT_N: 1.5, S2: 1.6, S2_ERG: 2.35, N_ENDE: 2.55,
  // Zeiten (s) – von links
  L_WECHSEL: 0.35, L1: 0.45, L1_ERG: 1.1, HALT_L: 1.25, L2: 1.35, L2_ERG: 1.95,
  L_FEHLEN: 2.05, L_ENDE: 2.3, KL_TXT: 0.3, KL_ENDE: 0.9,
  T_AHA: 2.6, T_BLINK: 0.8, T_GLANZ: 0.9, LANGSAM: 1 / 3,
  // Farben
  BL: '#1d4ed8', BL_F: '#3b82f6', OR: '#c2410c', OR_F: '#fb923c', DUNKEL: '#111827',
  GRAU: '#64748b', LINIE: '#94a3b8', KARO: '#d4e3f1', AMBER: '#d97706',
  KLAMMER: '#475569', LEER: '#ea580c', LEER_T: '#9a3412'
};
const _m6cNB = ' ';

// Ein Zeichen der Rechnung: s = Text, f = 'or' | 'bl' | '' (dunkel)
function _m6cTok(s, f) { return { s: String(s), f: f || '' }; }
function _m6cFarbe(f) { const K = _m6cK; return f === 'or' ? K.OR : f === 'bl' ? K.BL : K.DUNKEL; }

// ALLE Zahlen einer Rechnung aus EINER Rechnung.
function _m6cWerte(key) {
  const R = _m6cR[key], T = _m6cTok, [x, y, v] = R.z;
  const w = { key, typ: R.typ };
  if (R.typ === 'plusMal') {
    const s = x, r = y, n = v, P = r * n, E = s + P, RL = s + r, L = RL * n;
    Object.assign(w, {
      n, s, rOrange: 0, rBlau: r, P, E, RL, L, fehlt: L - E,
      term: [T(s, 'or'), T('+'), T(r, 'bl'), T('·'), T(n, 'bl')],
      s1: [T(r, 'bl'), T('·'), T(n, 'bl'), T(P, 'bl')], s2: [T(s, 'or'), T('+'), T(P, 'bl'), T(E)],
      l1: [T(s, 'or'), T('+'), T(r, 'bl'), T(RL)], l2: [T(RL), T('·'), T(n, 'bl'), T(L)],
      baumN: { form: 'rechts', zahl: [T(s, 'or'), T(r, 'bl'), T(n, 'bl')], op1: '·', e1: T(P, 'bl'), op2: '+', e2: T(E) },
      baumL: { form: 'links', zahl: [T(s, 'or'), T(r, 'bl'), T(n, 'bl')], op1: '+', e1: T(RL), op2: '·', e2: T(L), e2Leer: L > E }
    });
  } else if (R.typ === 'malPlus') {
    const r = x, n = y, s = v, P = r * n, E = P + s;
    Object.assign(w, {
      n, s, rOrange: 0, rBlau: r, P, E, RL: r, L: E, fehlt: 0,
      term: [T(r, 'bl'), T('·'), T(n, 'bl'), T('+'), T(s, 'or')],
      s1: [T(r, 'bl'), T('·'), T(n, 'bl'), T(P, 'bl')], s2: [T(P, 'bl'), T('+'), T(s, 'or'), T(E)],
      l1: [T(r, 'bl'), T('·'), T(n, 'bl'), T(P, 'bl')], l2: [T(P, 'bl'), T('+'), T(s, 'or'), T(E)],
      baumN: { form: 'links', zahl: [T(r, 'bl'), T(n, 'bl'), T(s, 'or')], op1: '·', e1: T(P, 'bl'), op2: '+', e2: T(E) },
      baumL: { form: 'links', zahl: [T(r, 'bl'), T(n, 'bl'), T(s, 'or')], op1: '·', e1: T(P, 'bl'), op2: '+', e2: T(E) }
    });
  } else {
    const r1 = x, r2 = y, n = v, RR = r1 + r2, E = RR * n;
    Object.assign(w, {
      n, s: 0, rOrange: r1, rBlau: r2, RR, E, fehlt: 0,
      term: [T('('), T(r1, 'or'), T('+'), T(r2, 'bl'), T(')'), T('·'), T(n)],
      s1: [T(r1, 'or'), T('+'), T(r2, 'bl'), T(RR)], s2: [T(RR), T('·'), T(n), T(E)],
      baumN: { form: 'links', zahl: [T(r1, 'or'), T(r2, 'bl'), T(n)], op1: '+', e1: T(RR), op2: '·', e2: T(E), klammer: true }
    });
  }
  return w;
}
// Rechnung als Text. nb = Leerzeichen zwischen den Teilen; farbig = mit <b>.
// Nach „(“ und vor „)“ steht kein Leerzeichen.
function _m6cText(toks, nb, farbig) {
  let s = '';
  toks.forEach((t, i) => {
    if (i && toks[i - 1].s !== '(' && t.s !== ')') s += nb;
    s += farbig && t.f ? '<b style="color:' + _m6cFarbe(t.f) + '">' + t.s + '</b>' : t.s;
  });
  return s;
}
// Ein Rechenschritt [a, op, b, e] als „a · b = e“
function _m6cSchritt(st, farbig) {
  return _m6cText([st[0], st[1], st[2], _m6cTok('='), st[3]], _m6cNB, farbig);
}

function _m6cInit() {
  _m6c = { t: 0, key: null, w: null, lauf: null, fertigN: false, zeigL: false, fertigL: false,
           ahaGlanz: 0, leerBlink: 0, allGlanz: 0, wackel: 0, fx: [], stand: '',
           pause: false, halt: false, blink: 0, vormerk: false,
           langsam: false, haltAn: false };                      // Lehrkraft-Einstellungen
}
function _m6cHTML() {
  const marke = k => `<button class="sim-btn" id="_m6c-b-${k}" onclick="_m6cMarke('${k}')">${_m6cText(_m6cWerte(k).term, '&nbsp;', false)}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was wird zuerst gerechnet?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle eine Rechnung. Der Rechenbaum zeigt die Reihenfolge.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6c-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6cREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6c-vonlinks" onclick="_m6cLinks()">von links rechnen</button>
          <button class="sim-btn" id="_m6c-nochmal" onclick="_m6cNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m6cNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6c-pause" onclick="_m6cAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6c-tempo" onclick="_m6cTempo()">Tempo: <span id="_m6c-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6c-halt" onclick="_m6cHaltSchalter()">Halt nach dem ersten Schritt: <span id="_m6c-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6c-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6c-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6c-schritt1" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6c-schritt2" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6c-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6c-tisch" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6c-links" style="margin-top:6px;display:none"></div>
        <div class="lmp-status on" id="_m6c-fehlen" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: noch keine Rechnung gewählt</p>
  </div>`;
}
function _m6cSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Zeile setzen und nur zeigen, wenn sie etwas sagt.
function _m6cZeige(id, html) {
  const e = _m6cSetze(id, html);
  if (e && e.style) e.style.display = html ? '' : 'none';
}
// Wie weit ist ein Ablauf? normal = Sprungmarke, links = Gegenprobe.
// -1: noch nicht begonnen, 99: fertig, sonst die Ablaufzeit.
function _m6cZeit(z, art) {
  if (!z.w) return -1;
  if (z.lauf && z.lauf.art === art) return z.lauf.t;
  if (art === 'normal') return z.fertigN ? 99 : -1;
  return z.zeigL && z.fertigL ? 99 : -1;
}
// Was die Anzeige gerade sagen darf – sie folgt dem Bild, nicht dem Knopf.
function _m6cLage(z) {
  const K = _m6cK, tN = _m6cZeit(z, 'normal'), tL = z.zeigL ? _m6cZeit(z, 'links') : -1;
  const kl = !!z.w && z.w.typ === 'klammer';
  return { s1: tN >= K.S1_ERG, s2: tN >= K.S2_ERG,
           l1: tL >= (kl ? K.KL_TXT : K.L1_ERG), l2: !kl && tL >= K.L2_ERG, lf: !kl && tL >= K.L_FEHLEN };
}
function _m6cStand(z) {
  const L = _m6cLage(z);
  return [z.key, L.s1, L.s2, L.l1, L.l2, L.lf, z.zeigL, z.pause, z.halt, z.haltAn, z.langsam,
          z.lauf ? z.lauf.art : ''].join('|');
}
function _m6cStatus() {
  if (!_m6c) return;
  const z = _m6c, w = z.w, L = _m6cLage(z), NB = _m6cNB;
  _m6cSetze('_m6c-rechnung', 'Gerechnet wird: ' + (w ? _m6cText(w.term, NB, true) : 'noch nichts'));
  _m6cSetze('_m6c-schritt1', 'Erster Schritt: ' + (L.s1 ? _m6cSchritt(w.s1, true) : 'noch nicht gerechnet'));
  _m6cSetze('_m6c-schritt2', 'Zweiter Schritt: ' + (L.s2 ? _m6cSchritt(w.s2, true) : 'noch nicht gerechnet'));
  _m6cSetze('_m6c-ergebnis', 'Ergebnis der Rechnung: ' + (L.s2 ? w.E : 'noch keins'));
  _m6cSetze('_m6c-tisch', 'Plättchen auf dem Tisch: ' + (!w ? 'noch keine' : L.s2 ? w.E : '…'));
  let links = '', fehlen = '';
  if (w && z.zeigL) {
    if (w.typ === 'klammer') {
      if (L.l1) links = 'Hier gibt die Klammer den Weg vor.';
    } else {
      if (L.l2) links = 'Von links: ' + _m6cSchritt(w.l1, true) + ', ' + _m6cSchritt(w.l2, true);
      else if (L.l1) links = 'Von links: ' + _m6cSchritt(w.l1, true) + ', …';
      if (L.lf) fehlen = w.fehlt > 0
        ? 'Für ' + w.RL + ' Reihen zu je ' + w.n + ' fehlen ' + w.fehlt + ' Plättchen.'
        : 'Es fehlen keine Plättchen.';
    }
  }
  _m6cZeige('_m6c-links', links);
  _m6cZeige('_m6c-fehlen', fehlen);
  // Knoepfe: gewaehlte Sprungmarke hervorheben; „von links rechnen“ und
  // „noch einmal“ erst nach einer Rechnung
  for (const k of _m6cREIHE) {
    const b = document.getElementById('_m6c-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  }
  for (const id of ['_m6c-vonlinks', '_m6c-nochmal']) {
    const b = document.getElementById(id);
    if (b) { b.disabled = !w; if (b.style) b.style.opacity = w ? '' : '0.45'; }
  }
  try { document.getElementById('_m6c-vonlinks').classList.toggle('primary', !!w && z.zeigL); } catch (e) { /* Mini-DOM */ }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _m6cSetze('_m6c-pause', z.pause ? 'weiter' : 'Pause');
  _m6cSetze('_m6c-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6cSetze('_m6c-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _m6cSetze('_m6c-lehrkraft', _m6cHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6c-pause', z.pause], ['_m6c-halt', z.haltAn], ['_m6c-tempo', z.langsam]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
  z.stand = _m6cStand(z);
}
function _m6cHinweis() {
  const z = _m6c, w = z.w;
  if (z.halt && w) {
    const st = z.lauf && z.lauf.art === 'links' ? w.l1 : w.s1;
    return 'Halt nach dem ersten Schritt: ' + _m6cSchritt(st, false) + '. Was wird jetzt gerechnet? Dann „weiter“.';
  }
  if (z.pause) return 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  return 'Für die Lehrkraft: „Pause“ hält alles an. „Halt nach dem ersten Schritt“ stoppt von selbst.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Sprungmarke: Rechnung laden und abspielen. Hebt die Pause auf.
function _m6cMarke(k) {
  if (!_m6c || !_m6cR[k]) return;
  _m6cSpielen(k);
  _m6cStatus();
}
function _m6cSpielen(k) {
  const z = _m6c;
  z.key = k; z.w = _m6cWerte(k);
  z.fertigN = false; z.zeigL = false; z.fertigL = false;
  z.lauf = { art: 'normal', t: 0, angehalten: false };
  z.ahaGlanz = 0; z.leerBlink = 0; z.allGlanz = 0; z.wackel = 0; z.fx.length = 0;
  z.pause = false; z.halt = false; z.vormerk = false; z.blink = 0;
}
// „noch einmal“: die gewaehlte Rechnung neu abspielen
function _m6cNochmal() {
  if (!_m6c) return;
  if (!_m6c.key) { _m6c.wackel = 0.45; _m6cStatus(); return; }
  _m6cSpielen(_m6c.key);
  _m6cStatus();
}
// „neu“: zurueck zum Start (Tempo und Halt bleiben stehen)
function _m6cNeu() {
  if (!_m6c) return;
  const z = _m6c;
  z.key = null; z.w = null; z.lauf = null;
  z.fertigN = false; z.zeigL = false; z.fertigL = false;
  z.ahaGlanz = 0; z.leerBlink = 0; z.allGlanz = 0; z.wackel = 0; z.fx.length = 0;
  z.pause = false; z.halt = false; z.vormerk = false; z.blink = 0;
  _m6cStatus();
}
// „von links rechnen“: Gegenprobe fuer die geladene Rechnung
function _m6cLinks() {
  if (!_m6c) return;
  const z = _m6c;
  if (!z.key) { z.wackel = 0.45; _m6cStatus(); return; }
  if (z.pause) {                                   // in der Pause: vormerken oder entfallen
    z.blink = 0.6;
    if (!z.lauf) z.vormerk = true;
    _m6cStatus();
    return;
  }
  if (z.lauf) _m6cLanden();                        // laufende Bewegung sofort ankommen lassen
  _m6cLinksLos();
  _m6cStatus();
}
function _m6cLinksLos() {
  const z = _m6c;
  z.zeigL = true; z.fertigL = false;
  z.lauf = { art: 'links', t: 0, angehalten: false };
  z.ahaGlanz = 0; z.leerBlink = 0; z.allGlanz = 0; z.fx.length = 0;
}
// Die laufende Bewegung ist am Ziel (oder wird sofort dorthin gesetzt –
// dann ohne Lichtring).
function _m6cLanden() {
  const z = _m6c, L = z.lauf;
  if (!L) return;
  z.lauf = null; z.halt = false;
  if (L.art === 'normal') z.fertigN = true; else z.fertigL = true;
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6cAnhalten() {
  if (!_m6c) return;
  const z = _m6c;
  if (z.pause) {
    z.pause = false; z.halt = false; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = false;
    if (v && !z.lauf && z.key) _m6cLinksLos();
  } else z.pause = true;
  _m6cStatus();
}
function _m6cTempo() {
  if (!_m6c) return;
  _m6c.langsam = !_m6c.langsam;
  _m6cStatus();
}
function _m6cHaltSchalter() {
  if (!_m6c) return;
  _m6c.haltAn = !_m6c.haltAn;
  _m6cStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6cZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6cK.LANGSAM : 1; }

// ── Lage im Bild ────────────────────────────────────────────────────────
function _m6cSpalteX(j) { const K = _m6cK; return K.GX + j * K.KA + K.KA / 2; }
// Mitte der Reihe i; bei (3 + 4) · 5 liegen die blauen Reihen um gap tiefer
function _m6cReiheY(w, i, gap) {
  const K = _m6cK;
  return K.GY + i * K.KA + K.KA / 2 + (w.typ === 'klammer' && i >= w.rOrange ? gap : 0);
}
// Rechenbaum: Mitte der beiden Kreise und welche Zahlen wohin gehen
function _m6cBaumLage(B) {
  const X = _m6cK.NX;
  if (B.form === 'rechts') {
    const c1 = (X[1] + X[2]) / 2;
    return { c1, c2: (X[0] + c1) / 2, ein1: [1, 2], frei: 0 };
  }
  const c1 = (X[0] + X[1]) / 2;
  return { c1, c2: (c1 + X[2]) / 2, ein1: [0, 1], frei: 2 };
}
// Leuchtkurve eines Rechenkreises: an ab s, steht bis e, klingt danach ab
function _m6cAktiv(t, s, e) {
  if (t < s) return 0;
  if (t < e) return _bioFxKlemme((t - s) / 0.15);
  return Math.max(0, 1 - (t - e) / 0.35);
}
// Kurzes Aufleuchten ab Zeitpunkt g (Reihe zaehlt mit)
function _m6cGlanz(t, g) {
  const d = t - g;
  if (d < 0) return 0;
  return d < 0.12 ? d / 0.12 : Math.max(0, 1 - (d - 0.12) / 0.5);
}
// Puls der Klammer bei „von links rechnen“ fuer (3 + 4) · 5
function _m6cKlPuls(z) {
  if (!z.w || z.w.typ !== 'klammer' || !z.zeigL || !z.lauf || z.lauf.art !== 'links') return 0;
  return Math.max(0, Math.sin(Math.PI * _bioFxKlemme(z.lauf.t / _m6cK.KL_ENDE)));
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6cUpdate(dt) {
  if (!_m6c) return;
  const z = _m6c, K = _m6cK, w = z.w;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);            // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6cZeitfaktor(z);                    // ab hier Sim-Zeit: 0 Pause, 1/3 langsam, 1 normal
  z.t += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.leerBlink = Math.max(0, z.leerBlink - dt);
  z.allGlanz = Math.max(0, z.allGlanz - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  const L = z.lauf;
  if (L && w && dt > 0) {                          // ohne Zeit kein Schritt im Ablauf
    const vor = L.t;
    L.t += dt;
    const ueber = s => vor < s && L.t >= s;
    if (L.art === 'normal') {
      if (z.haltAn && !L.angehalten && ueber(K.HALT_N)) {
        // HALT nach dem ersten Schritt: das Zwischenergebnis steht, der zweite Kreis noch nicht
        L.t = K.HALT_N; L.angehalten = true;
        z.pause = true; z.halt = true;
      } else {
        if (ueber(K.S2_ERG) && w.key === 'b') {
          // Aha: die 3 Plaettchen liegen am fertigen Feld – Lichtring um alle 23
          z.ahaGlanz = K.T_AHA;
          _bioFxWelle(z.fx, K.GX + w.n * K.KA / 2, K.GY + (w.rBlau + 1) * K.KA / 2, '#f59e0b', 80);
        }
        if (L.t >= K.N_ENDE) _m6cLanden();
      }
    } else if (w.typ === 'klammer') {
      if (L.t >= K.KL_ENDE) _m6cLanden();
    } else {
      if (z.haltAn && !L.angehalten && ueber(K.HALT_L)) {
        L.t = K.HALT_L; L.angehalten = true;
        z.pause = true; z.halt = true;
      } else {
        if (ueber(K.L2_ERG)) {
          if (w.fehlt > 0) {
            z.leerBlink = K.T_BLINK;
            if (w.key === 'b')                     // zweiter Lichtring: um die 12 leeren Plaetze
              _bioFxWelle(z.fx, K.GX + w.n * K.KA / 2, K.GY + (w.rBlau + w.RL) * K.KA / 2, '#fb923c', 62);
          } else z.allGlanz = K.T_GLANZ;
        }
        if (L.t >= K.L_ENDE) _m6cLanden();
      }
    }
  }
  _bioFxUpdate(z.fx, dt);
  if (_m6cStand(z) !== z.stand) _m6cStatus();
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6cSchrift(ctx, groesse, gew) { ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif'; }
function _m6cTxt(ctx, s, x, y, groesse, farbe, ausr) {
  _m6cSchrift(ctx, groesse);
  ctx.fillStyle = farbe; ctx.textAlign = ausr || 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Federn beim Erscheinen: d = Sekunden seit Erscheinen
function _m6cPop(d) {
  return d >= 0 && d < 0.35 ? Math.max(0.3, _bioFxEase.federn(d / 0.35)) : 1;
}
function _m6cFlaeche(ctx, x0, y0, x1, y1, karo) {
  const K = _m6cK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 3, x1 - x0, y1 - y0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 6); ctx.fill();
  if (karo) {                                      // Karo am Feld ausgerichtet
    ctx.strokeStyle = K.KARO; ctx.lineWidth = 1;
    let xa = K.GX, ya = K.GY;
    while (xa - K.KA > x0 + 1) xa -= K.KA;
    while (ya - K.KA > y0 + 1) ya -= K.KA;
    for (let x = xa; x < x1 - 1; x += K.KA) { ctx.beginPath(); ctx.moveTo(x, y0 + 1); ctx.lineTo(x, y1 - 1); ctx.stroke(); }
    for (let y = ya; y < y1 - 1; y += K.KA) { ctx.beginPath(); ctx.moveTo(x0 + 1, y); ctx.lineTo(x1 - 1, y); ctx.stroke(); }
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 6); ctx.stroke();
  ctx.restore();
}
// Ein Plaettchen: f = 'bl' | 'or', s = Groesse, a = Deckkraft
function _m6cPlaettchen(ctx, x, y, f, s, a) {
  const K = _m6cK, r = K.RP * s;
  if (a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.fillStyle = f === 'or' ? K.OR_F : K.BL_F;
  ctx.strokeStyle = f === 'or' ? K.OR : K.BL; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (r > 3) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Leuchtband hinter einer Reihe (Bernstein)
function _m6cBand(ctx, x0, x1, y, a) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.fillStyle = 'rgba(252,211,77,0.45)'; ctx.strokeStyle = 'rgba(217,119,6,0.8)'; ctx.lineWidth = 1.6;
  _bioFxRundRect(ctx, x0, y - 6.5, x1 - x0, 13, 6.5); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Klammer „]“ von y0 bis y1 bei x
function _m6cEcke(ctx, x, y0, y1, farbe, a, strich) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.strokeStyle = farbe; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (strich) ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x + 4, y0); ctx.lineTo(x + 4, y1); ctx.lineTo(x, y1); ctx.stroke();
  ctx.restore();
}
// Beschriftung neben dem Feld (linksbuendig ab x). teil2 springt federnd
// dazu (pop2 = Sekunden seit Erscheinen); ist das Federn vorbei, steht alles
// als EIN Text da – so haengt der Abstand nie an einer Schaetzung.
function _m6cMarke2(ctx, teil1, teil2, x, y, farbe, a, pop2) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  const federt = teil2 && pop2 >= 0 && pop2 < 0.35;
  if (!federt) {
    _m6cTxt(ctx, [teil1, teil2].filter(Boolean).join(' '), x, y, 13, farbe, 'left');
  } else {
    let x2 = x;
    if (teil1) {
      _m6cTxt(ctx, teil1, x, y, 13, farbe, 'left');
      _m6cSchrift(ctx, 13);
      x2 = x + ctx.measureText(teil1 + ' ').width;
    }
    const k = _m6cPop(pop2);
    ctx.translate(x2, y - 4.5); ctx.scale(k, k);
    _m6cTxt(ctx, teil2, 0, 4.5, 13, farbe, 'left');
  }
  ctx.restore();
}

function _m6cTisch(ctx) {
  const z = _m6c, K = _m6cK, w = z.w, kl = _bioFxKlemme, E = _bioFxEase;
  if (!w) return;
  const tN = _m6cZeit(z, 'normal'), tL = z.zeigL ? _m6cZeit(z, 'links') : -1;
  const n = w.n, rO = w.rOrange, rB = w.rBlau, R0 = rO + rB, kla = w.typ === 'klammer';
  const gap = kla ? K.GAP * (1 - E.sanft(kl((tN - K.S1 - 0.1) / 0.5))) : 0;
  const Y = i => _m6cReiheY(w, i, gap), X = _m6cSpalteX;
  const xl = X(0) - K.RP - 4, xr = X(n - 1) + K.RP + 4;
  const probe = z.zeigL && w.typ === 'plusMal';   // Rahmen und leere Plaetze der Gegenprobe
  // ── Leuchtbaender (hinter den Plaettchen)
  for (let i = 0; i < R0; i++) {
    let g = 0;
    if (!kla) g = _m6cGlanz(tN, K.S1 + 0.05 + i * 0.12);                       // 4 · 5: Reihe fuer Reihe
    else {
      g = 0.6 * Math.max(0, Math.sin(Math.PI * kl((tN - K.S1 - 0.1) / 0.6)));  // 3 + 4: Reihen gleiten zusammen
      g = Math.max(g, _m6cGlanz(tN, K.S2 + 0.05 + i * 0.09));                   // 7 · 5: Reihe fuer Reihe
    }
    if (z.allGlanz > 0) g = Math.max(g, z.allGlanz / K.T_GLANZ);
    _m6cBand(ctx, xl, xr, Y(i), g);
  }
  if (!kla && z.allGlanz > 0)
    _m6cBand(ctx, xl, X(w.s - 1) + K.RP + 4, Y(rB), z.allGlanz / K.T_GLANZ);
  // ── Aha: pulsierender Rahmen um alle Plaettchen (3 + 4 · 5)
  if (z.ahaGlanz > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.5);
    ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.2 + 0.8 * Math.sin(z.t * 7);
    _bioFxRundRect(ctx, xl - 3, K.GY - 4, xr - xl + 6, (rB + 1) * K.KA + 8, 8); ctx.stroke();
    ctx.restore();
  }
  // ── Gegenprobe: Rahmen fuer „7 Reihen zu je 5“ und die leeren Plaetze
  if (probe && tL >= 0) {
    const fa = kl((tL - K.L1 - 0.1) / 0.35);
    if (fa > 0.01) {
      ctx.save();
      ctx.globalAlpha = fa;
      ctx.fillStyle = 'rgba(251,146,60,0.06)'; ctx.strokeStyle = K.LEER; ctx.lineWidth = 1.6;
      ctx.setLineDash([5, 4]);
      _bioFxRundRect(ctx, K.GX - 3, K.GY - 3, n * K.KA + 6, w.RL * K.KA + 6, 6); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    const ph = K.T_BLINK - z.leerBlink;
    const blinkA = z.leerBlink > 0 ? 0.6 * Math.pow(Math.sin(Math.PI * ph / (K.T_BLINK / 2)), 2) : 0;
    for (let idx = w.E; idx < w.L; idx++) {
      const ea = kl((tL - K.L2 - 0.05 - (idx - w.E) * 0.02) / 0.25);
      if (ea <= 0.01) continue;
      const x = X(idx % n), y = Y(Math.floor(idx / n));
      ctx.save();
      ctx.globalAlpha = ea;
      ctx.fillStyle = 'rgba(251,146,60,' + (0.14 + blinkA).toFixed(3) + ')';
      ctx.strokeStyle = K.LEER; ctx.lineWidth = 1.3; ctx.setLineDash([2.5, 2]);
      ctx.beginPath(); ctx.arc(x, y, K.RP, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }
  // ── Plaettchen
  for (let i = 0; i < R0; i++) {
    const st = K.M_POP0 + i * K.M_ROW, f = i < rO ? 'or' : 'bl';
    for (let j = 0; j < n; j++) {
      const s = Math.max(0, E.federn(kl((tN - st - j * 0.012) / K.M_POP)));
      _m6cPlaettchen(ctx, X(j), Y(i), f, s, 1);
    }
  }
  if (!kla) {
    const st = K.M_POP0 + R0 * K.M_ROW + 0.05, y0 = Y(K.SROW), y1 = Y(rB);
    for (let j = 0; j < w.s; j++) {
      const s = Math.max(0, E.federn(kl((tN - st - j * 0.02) / K.M_POP)));
      const u = E.sanft(kl((tN - (K.S2 + 0.05 + j * 0.06)) / 0.5));
      const y = y0 + (y1 - y0) * u;
      if (u > 0 && u < 1) {                        // gleitet: kleiner Lichthof
        ctx.save();
        ctx.globalAlpha = Math.sin(Math.PI * u) * 0.7;
        ctx.fillStyle = 'rgba(252,211,77,0.6)';
        ctx.beginPath(); ctx.arc(X(j), y, K.RP + 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      _m6cPlaettchen(ctx, X(j), y, 'or', s * (1 + 0.15 * Math.sin(Math.PI * u)), 1);
    }
  }
  // ── Beschriftungen rechts neben dem Feld
  const bx = K.GX + n * K.KA + 6, tx = bx + 10;
  const aFeld = kl((tN - K.M_POP0) / 0.3);
  const aAlt = probe && tL >= 0 ? 1 - kl(tL / K.L_WECHSEL) : 1;   // die Gegenprobe raeumt sie weg
  if (!kla) {
    const y0 = K.GY + 2, y1 = K.GY + rB * K.KA - 2, ym = (y0 + y1) / 2 + 4.5;
    _m6cEcke(ctx, bx, y0, y1, K.BL, aFeld * aAlt);
    _m6cMarke2(ctx, rB + ' · ' + n, tN >= K.S1_ERG ? '= ' + w.P : '', tx, ym, K.BL, aFeld * aAlt, tN - K.S1_ERG);
    // „3“ neben den einzelnen Plaettchen; gleiten sie los, blendet sie aus und
    // steht danach als „+ 3“ neben ihrer neuen Reihe
    const aS = kl((tN - K.M_POP0 - R0 * K.M_ROW) / 0.3) * (1 - kl((tN - K.S2) / 0.2));
    _m6cMarke2(ctx, String(w.s), '', K.GX + w.s * K.KA + 8, Y(K.SROW) + 4.5, K.OR, aS, -1);
    _m6cMarke2(ctx, '+ ' + w.s, '', tx, Y(rB) + 4.5, K.OR, kl((tN - K.S2_ERG) / 0.2) * aAlt, -1);
  } else {
    const m = 1 - kl((tN - K.S1_ERG) / 0.2), mm = kl((tN - K.S1_ERG) / 0.2);
    const yo0 = Y(0) - 5.5, yo1 = Y(rO - 1) + 5.5, yb0 = Y(rO) - 5.5, yb1 = Y(R0 - 1) + 5.5;
    _m6cEcke(ctx, bx, yo0, yo1, K.OR, aFeld * m);
    _m6cMarke2(ctx, rO + ' Reihen', '', tx, (yo0 + yo1) / 2 + 4.5, K.OR, aFeld * m, -1);
    _m6cEcke(ctx, bx, yb0, yb1, K.BL, aFeld * m);
    _m6cMarke2(ctx, rB + ' Reihen', '', tx, (yb0 + yb1) / 2 + 4.5, K.BL, aFeld * m, -1);
    const ym = (yo0 + yb1) / 2;
    _m6cEcke(ctx, bx, yo0, yb1, K.DUNKEL, mm);
    _m6cMarke2(ctx, w.RR + ' Reihen', '', tx, ym - 3, K.DUNKEL, mm, -1);
    if (tN >= K.S2_ERG) _m6cMarke2(ctx, '', w.RR + ' · ' + n + ' = ' + w.E, tx, ym + 14, K.DUNKEL, 1, tN - K.S2_ERG);
  }
  if (probe && tL >= K.L1_ERG) {                   // Gegenprobe: „7 Reihen“, dann „7 · 5 = 35“
    // keine eigene Klammer: der gestrichelte Rahmen um die 7 Reihen ist sie
    const ym = K.GY + w.RL * K.KA / 2, a = kl((tL - K.L1_ERG) / 0.2);
    _m6cMarke2(ctx, w.RL + ' Reihen', '', tx - 4, ym - 3, K.LEER_T, a, -1);
    if (tL >= K.L2_ERG) _m6cMarke2(ctx, '', w.RL + ' · ' + n + ' = ' + w.L, tx - 4, ym + 14, K.LEER_T, 1, tL - K.L2_ERG);
  }
}

// Ein Kasten im Rechenbaum. tok = null: noch leer (gestrichelt).
function _m6cKasten(ctx, x, y, bw, bh, tok, pop, rand) {
  const K = _m6cK;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = rand || (tok ? K.GRAU : '#cbd5e1'); ctx.lineWidth = tok ? 1.5 : 1.3;
  if (!tok || rand) ctx.setLineDash([4, 3]);
  _bioFxRundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 5); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  if (tok) {
    const k = _m6cPop(pop);
    ctx.translate(x, y); ctx.scale(k, k);
    _m6cTxt(ctx, tok.s, 0, 6, 17, _m6cFarbe(tok.f));
  }
  ctx.restore();
}
// Ein Rechenkreis mit Zeichen; g = Leuchten 0..1
function _m6cKreis(ctx, x, y, op, g) {
  const K = _m6cK;
  ctx.save();
  if (g > 0.01) {
    ctx.globalAlpha *= g;
    ctx.fillStyle = 'rgba(252,211,77,0.45)';
    ctx.beginPath(); ctx.arc(x, y, K.CR + 6, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha /= g;
  }
  ctx.fillStyle = g > 0.3 ? '#fef3c7' : '#ffffff';            // wie die Kreise in m5-klammern
  ctx.strokeStyle = g > 0.3 ? K.AMBER : '#334155'; ctx.lineWidth = g > 0.3 ? 2.4 : 1.8;
  ctx.beginPath(); ctx.arc(x, y, K.CR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (op === '·') {                                // der Malpunkt als Punkt – als Zeichen waere er winzig
    ctx.fillStyle = K.DUNKEL;
    ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill();
  } else _m6cTxt(ctx, op, x, y + 6.5, 19, K.DUNKEL);
  ctx.restore();
}
function _m6cAst(ctx, x0, y0, x1, y1, g, strich) {
  const K = _m6cK;
  ctx.save();
  ctx.strokeStyle = g > 0.5 ? K.AMBER : K.LINIE; ctx.lineWidth = g > 0.5 ? 3 : 2; ctx.lineCap = 'round';
  if (strich) ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.restore();
}
// Ein ganzer Rechenbaum. T = Zeitpunkte {s1, e1, s2, e2} des Ablaufs, t = Ablaufzeit.
function _m6cBaum(ctx, B, t, a, T, probe, dx) {
  const K = _m6cK, G = _m6cBaumLage(B), X = K.NX;
  const g1 = _m6cAktiv(t, T.s1, T.e1), g2 = _m6cAktiv(t, T.s2, T.e2);
  const ast1 = t >= T.s1 && t < T.e1 + 0.2 ? 1 : 0, ast2 = t >= T.s2 && t < T.e2 + 0.2 ? 1 : 0;
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.translate(dx || 0, 0);
  if (B.klammer) {                                 // der Teil in der Klammer: gestrichelt umrandet
    const p = _m6cKlPuls(_m6c);
    ctx.save();
    ctx.strokeStyle = p > 0.05 ? K.AMBER : K.KLAMMER; ctx.lineWidth = 1.6 + 1.6 * p;
    ctx.setLineDash([5, 4]);
    if (p > 0.05) { ctx.fillStyle = 'rgba(252,211,77,' + (0.25 * p).toFixed(3) + ')'; }
    _bioFxRundRect(ctx, X[0] - K.NW / 2 - 7, K.NY - K.NH / 2 - 4, X[1] - X[0] + K.NW + 14, K.E1Y - K.NY + (K.NH + K.EH) / 2 + 9, 10);
    if (p > 0.05) ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  // Aeste (Mitte zu Mitte; Kaesten und Kreise decken die Enden)
  _m6cAst(ctx, X[G.ein1[0]], K.NY, G.c1, K.C1Y, ast1, probe);
  _m6cAst(ctx, X[G.ein1[1]], K.NY, G.c1, K.C1Y, ast1, probe);
  _m6cAst(ctx, G.c1, K.C1Y, G.c1, K.E1Y, ast1 && t >= T.e1 - 0.1 ? 1 : 0, probe);
  _m6cAst(ctx, G.c1, K.E1Y, G.c2, K.C2Y, ast2, probe);
  _m6cAst(ctx, X[G.frei], K.NY, G.c2, K.C2Y, ast2, probe);
  _m6cAst(ctx, G.c2, K.C2Y, G.c2, K.E2Y, ast2 && t >= T.e2 - 0.1 ? 1 : 0, probe);
  for (let i = 0; i < 3; i++) _m6cKasten(ctx, X[i], K.NY, K.NW, K.NH, B.zahl[i], -1);
  _m6cKreis(ctx, G.c1, K.C1Y, B.op1, g1);
  _m6cKreis(ctx, G.c2, K.C2Y, B.op2, g2);
  _m6cKasten(ctx, G.c1, K.E1Y, K.EW, K.EH, t >= T.e1 ? B.e1 : null, t - T.e1);
  _m6cKasten(ctx, G.c2, K.E2Y, K.EW, K.EH, t >= T.e2 ? B.e2 : null, t - T.e2,
             probe && B.e2Leer && t >= T.e2 ? K.LEER : null);
  if (_m6c.halt) {                                 // Halt: das Zwischenergebnis ist eingerahmt
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, G.c1 - K.EW / 2 - 5, K.E1Y - K.EH / 2 - 5, K.EW + 10, K.EH + 10, 8); ctx.stroke();
  }
  ctx.restore();
}
function _m6cBaeume(ctx) {
  const z = _m6c, K = _m6cK, w = z.w, kl = _bioFxKlemme;
  const wk = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0;
  const tN = _m6cZeit(z, 'normal'), tL = z.zeigL ? _m6cZeit(z, 'links') : -1;
  const wechsel = !!w && z.zeigL && w.typ !== 'klammer';
  const u = wechsel ? kl(tL / K.L_WECHSEL) : 0;
  // Ueberschrift (bei der Gegenprobe: „Rechenbaum von links“)
  ctx.save();
  ctx.globalAlpha = 1 - u;
  _m6cTxt(ctx, 'Rechenbaum', K.BX0 + 9 + wk, K.BY0 + 13, 11, '#475569', 'left');
  ctx.globalAlpha = u;
  _m6cTxt(ctx, 'Rechenbaum von links', K.BX0 + 9 + wk, K.BY0 + 13, 11, K.LEER_T, 'left');
  ctx.restore();
  if (!w) return;
  const aN = kl((tN - K.A_EIN0) / K.A_EIN) * (1 - u);
  if (aN > 0.01) _m6cBaum(ctx, w.baumN, tN, aN, { s1: K.S1, e1: K.S1_ERG, s2: K.S2, e2: K.S2_ERG }, false, wk);
  if (u > 0.01) _m6cBaum(ctx, w.baumL, tL, u, { s1: K.L1, e1: K.L1_ERG, s2: K.L2, e2: K.L2_ERG }, true, wk);
}
// Die Rechnung oben, gross; nach dem zweiten Schritt „= Ergebnis“
function _m6cRechnung(ctx) {
  const z = _m6c, K = _m6cK, w = z.w;
  if (!w) return;
  const tN = _m6cZeit(z, 'normal'), a = _bioFxKlemme((tN - K.A_EIN0) / K.A_EIN);
  if (a <= 0.01) return;
  const toks = w.term.slice();
  const fertig = tN >= K.S2_ERG;
  if (fertig) toks.push(_m6cTok('='), _m6cTok(w.E));
  ctx.save();
  ctx.globalAlpha = a;
  _m6cSchrift(ctx, K.RG);
  const luft = K.RG * 0.3;
  const br = toks.map(t => ctx.measureText(t.s).width);
  const abst = toks.map((t, i) => (i && toks[i - 1].s !== '(' && t.s !== ')' ? luft : 0));
  let ges = 0;
  toks.forEach((t, i) => { ges += br[i] + abst[i]; });
  let x = K.RX - ges / 2;
  const p = _m6cKlPuls(z);
  toks.forEach((t, i) => {
    x += abst[i];
    const xm = x + br[i] / 2, kla = t.s === '(' || t.s === ')';
    // Gegenprobe bei (3 + 4) · 5: die Klammer selbst leuchtet bernsteinfarben
    // und wird kurz groesser (ein Kasten dahinter ragte ueber die Ziffern)
    const farbe = kla ? (p > 0.3 ? K.AMBER : K.KLAMMER) : _m6cFarbe(t.f);
    if (kla && p > 0.05) {
      const k = 1 + 0.22 * p;
      ctx.save(); ctx.translate(xm, K.RY - K.RG * 0.36); ctx.scale(k, k);
      _m6cTxt(ctx, t.s, 0, K.RG * 0.36, K.RG, farbe);
      ctx.restore();
    } else if (fertig && i === toks.length - 1) {   // das Ergebnis springt und federt
      const k = _m6cPop(tN - K.S2_ERG);
      ctx.save(); ctx.translate(xm, K.RY - K.RG * 0.36); ctx.scale(k, k);
      _m6cTxt(ctx, t.s, 0, K.RG * 0.36, K.RG, farbe);
      ctx.restore();
    } else _m6cTxt(ctx, t.s, xm, K.RY, K.RG, farbe);
    x += br[i];
  });
  ctx.restore();
}
function _m6cDraw(ctx, cv) {
  if (!_m6c) return;
  const z = _m6c, K = _m6cK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6cFlaeche(ctx, K.BX0, K.BY0, K.BX1, K.BY1, false);
  _m6cFlaeche(ctx, K.TX0, K.TY0, K.TX1, K.TY1, true);
  _bioFxDraw(ctx, z.fx);                           // Lichtring hinter den Plaettchen
  _m6cTisch(ctx);
  _m6cBaeume(ctx);
  _m6cRechnung(ctx);
  if (z.pause) _m6cPauseSchild(ctx);
}
// Schild „Pause“ oben links – gleiche Stelle, Groesse und Farbe wie in
// m5-plus-schriftlich. Leuchtet kurz auf, wenn waehrend der Pause ein Knopf
// gedrueckt wird.
function _m6cPauseSchild(ctx) {
  const z = _m6c, w = 64, h = 25, x = 8, y = 8;
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
