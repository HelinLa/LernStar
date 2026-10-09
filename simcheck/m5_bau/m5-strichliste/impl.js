

// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – md1 „Wie sammelt man Daten?“ (Kennung m5-strichliste,
// Praefix _m6r)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL8_PROFIL.md, Abschnitt m5-strichliste
// (Einheit md1; Regeln N1–N3, Lehrkraft-Zeile V3). Ueberschrift = Frage der
// Einheit: „Wie viele Kinder kommen mit dem Bus?“
//
// Was man sieht – zwei Darstellungen, durch die FARBE verbunden (zu Fuss gruen,
// Rad blau, Bus lila, Auto rosenrot; Karte, Zeile, Striche, Anzahl und
// Statuszeile in derselben Farbe):
//   LINKS die 28 Antwortkarten der Umfrage auf einem Tisch, 4 Reihen zu 7, in
//     fester Reihenfolge (_m6rUMFRAGE). Jede Karte traegt nur ein Symbol:
//     Fussabdruck, Fahrrad, Bus, Auto. Darunter, durch eine gestrichelte Linie
//     getrennt, eine Reihe fuer neue Karten („+ 1 Strich“, hoechstens 7).
//   RECHTS die Strichliste auf Karopapier: vier Zeilen „zu Fuß“, „Rad“, „Bus“,
//     „Auto“ (Symbol + Wort), daneben das Strichfeld, rechts davon ein Feld
//     fuer die Anzahl (gestrichelt und leer, bis gezaehlt ist).
//   Die Zeile der gewaehlten Antwort ist zart in ihrer Farbe hinterlegt.
//
// Bewegung (jede Sprungmarke spielt ihre Zeile SELBST ab, N1; alles ist eine
// Funktion der Ablaufzeit J.t – _m6rPlan legt die Zeitpunkte fest):
//   Leeren 0,3 s: alte Striche dieser Zeile blenden aus, ihre Karten werden
//     wieder bunt, das Anzahl-Feld leert sich; neue Karten dieser Antwort
//     gleiten nach rechts hinaus. Die anderen Zeilen bleiben stehen – so
//     waechst die Strichliste Zeile fuer Zeile wie im Heft.
//   Je Karte (in Umfrage-Reihenfolge): sie leuchtet auf (0,15 s), eine Kopie
//     gleitet im Bogen zur Zeile (0,5 s) und wird dort zum senkrechten Strich
//     (0,12 s); die Karte wird grau und bekommt einen Haken in ihrer Farbe.
//     Jeder 5. Strich wird langsamer QUER ueber die vier gezogen (0,7 s), das
//     Buendel leuchtet kurz (0,6 s).
//   Zaehlen: ein Lichtpunkt springt ueber die Zeile – je Buendel ein Sprung
//     (0,45 s, ueber dem Buendel erscheinen 5, 10 …), dann je einzelnem Strich
//     ein kleiner Sprung (0,3 s, die Zahl reitet auf dem Punkt: 11, 12, 13).
//     Die letzte Zahl gleitet in das Anzahl-Feld (0,4 s) und federt dort.
//   „+ 1 Strich“: eine neue Karte der gewaehlten Antwort kommt von rechts in die
//     Reihe fuer neue Karten (0,45 s), dann wie oben: Kopie gleitet, Strich,
//     Haken; die Anzahl leert sich, sobald der Strich steht, und wird neu
//     gezaehlt (Zaehlweg von vorn). Grenzen: 20 Striche je Zeile, 7 neue
//     Karten – darueber wackelt die Zeile, sonst geschieht nichts.
//   „nur gerade Striche“ (Gegenprobe in der gewaehlten Zeile): Querstriche und
//     ihre Karten werden orange (0,4 s); ein Punkt springt nur ueber die
//     senkrechten Striche (0,22 s je Strich), die Zahl reitet orange mit und
//     bleibt am Ende ueber dem letzten senkrechten Strich stehen. Das
//     Anzahl-Feld bleibt, wie es ist – beide Zahlen stehen nebeneinander.
//   „alle Antworten“: leert alle Zeilen und neuen Karten, dann laufen die vier
//     Zeilen nacheinander schnell ab (0,25 s je Karte, Querstrich 0,35 s).
//     Danach ist „Auto“ gewaehlt (die zuletzt gelaufene Zeile).
//   „neu“: sofort der Start, die Karten blenden ein (0,35 s).
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort ankommen
// (_m6rFertig); dann geschieht das Neue. Jede Knopffolge endet so in
// denselben Zahlen. Gemessen (Frames zu 16 ms, Tempo normal, bis der Ablauf
// gelandet ist): „zu Fuß“ 424 Frames (6,8 s), „Rad“ 327 (5,2 s), „Bus“ 817
// (13,1 s), „Auto“ 357 (5,7 s), „alle Antworten“ 859 (13,7 s), „nur gerade
// Striche“ bei Auto 112, „+ 1 Strich“ bei Auto 186. Nachgemessen 09.10.2026:
// Der Standard-Dump (2 Frames) zeigt nach einer Sprungmarke nur den Anfang,
// enthaelt aber alle Tabellenwerte (6, 4, 13, 5 mit Buendeln und Strichen),
// weil der naechste Knopf den Ablauf landen laesst. Die Endstaende von „nur
// gerade Striche“ und „alle Antworten“ stehen erst mit --voll --frames=900
// im Dump (Laufzeit rund 13 Minuten).
// werte.js liest nach 2 Frames ab; zum Vorspulen im Schritt mitgeben:
//   for(var i=0;i<1500;i++)_m6rUpdate(0.016)
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6rMarke('fuss') …):
//     „zu Fuß“ · „Rad“ · „Bus“ · „Auto“
//   Reihe 2: „+ 1 Strich“ (_m6rPlus()) · „nur gerade Striche“ (_m6rGerade())
//     – beide blass, bis eine Antwort gewaehlt ist – · „alle Antworten“
//     (_m6rAlle()) · „neu“ (_m6rNeu())
//
// Statuszeilen (woertlich, jede mit mehr als 18 Zeichen; sie folgen dem Bild:
// eine Zahl steht erst da, wenn sie im Bild angekommen ist):
//   _m6r-antwort  „Gewählte Antwort: Bus“ (Start „Gewählte Antwort: noch keine“)
//   _m6r-karten   „Abgehakt bei dieser Antwort: 13 Karten“ (zaehlt mit; „1 Karte“;
//                 ohne Wahl „Abgehakt bei dieser Antwort: …“)
//   _m6r-buendel  „Bus: 2 Fünferbündel und 3 einzelne Striche“ („1 einzelner
//                 Strich“; ohne Wahl „Fünferbündel und einzelne Striche: …“)
//   _m6r-zaehlen  „Zählweg der Striche: 5, 10, 11, 12, 13“ (vorher „…“)
//   _m6r-anzahl   „Anzahl bei Bus: 13 Kinder“ (vorher „Anzahl bei Bus: …“;
//                 ohne Wahl „Anzahl bei dieser Antwort: …“; „1 Kind“)
//   _m6r-gerade   nur nach „nur gerade Striche“, sonst versteckt:
//                 „Nur gerade Striche gezählt: 11, Karten: 13“ (waehrend des
//                 Zaehlens „Nur gerade Striche gezählt: …“)
//   _m6r-summe    nur nach „alle Antworten“, sonst versteckt:
//                 „Alle Striche zusammen: 28, Karten: 28“ (waehrend des Ablaufs
//                 „Alle Striche zusammen: …“; zaehlt „+ 1 Strich“ mit)
//   _m6r-lehrkraft  Hinweis fuer die Lehrkraft (siehe unten)
//
// Werte (nachgerechnet mit simcheck/werte.js; jede Zahl aus _m6rUMFRAGE):
//   zu Fuß → 1 Fünferbündel und 1 einzelner Strich · Zählweg 5, 6 · 6 Kinder ·
//            gerade 5, Karten 6
//   Rad    → 0 Fünferbündel und 4 einzelne Striche · Zählweg 1, 2, 3, 4 ·
//            4 Kinder · gerade 4, Karten 4
//   Bus    → 2 Fünferbündel und 3 einzelne Striche · Zählweg 5, 10, 11, 12, 13 ·
//            13 Kinder · gerade 11, Karten 13
//   Auto   → 1 Fünferbündel und 0 einzelne Striche · Zählweg 5 · 5 Kinder ·
//            gerade 4, Karten 5
//   alle Antworten → Alle Striche zusammen: 28, Karten: 28
//   ab Bus „+ 1 Strich“ → 14 (2 Fünferbündel und 4 einzelne Striche, Zählweg
//            5, 10, 11, 12, 13, 14); noch einmal → 15 (3 Fünferbündel und
//            0 einzelne Striche, Zählweg 5, 10, 15)
// Start: 28 Karten, Strichliste leer („Start: 28 Antwortkarten, die Strichliste
// ist leer“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): bei „Bus“, wenn die Anzahl 13 im
// Feld erscheint – Lichtringe um die beiden Querstriche und um ihre beiden
// Karten; 2,6 s lang verbindet je eine gestrichelte Linie Querstrich und
// Karte (jeder Querstrich hat seine eigene abgehakte Karte). Das widerlegt
// „11“ (Querstrich nicht gezaehlt) und „23“ (Buendel wie zehn gelesen): der
// Zaehlweg kommt mit 5, 10, 11, 12, 13 an. Bei „nur gerade Striche“ leuchten
// am Ende genau die Karten ohne gezaehlten Strich orange auf (bei Bus 2).
//
// FUER DIE LEHRKRAFT (Bauart wie m5-malkreuz, Container <div class=
// "fpm-lehrkraft">, V3). Eigene Zeile unter den Heftknoepfen, davor klein
// „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6rAnhalten()): friert jede Bewegung sofort ein;
//     Schild „Pause“ oben links im Bild (Stelle und Aussehen wie in
//     m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6rTempo()): ein Drittel so schnell.
//   „Halt vor dem Querstrich: aus“ ↔ „… an“ (_m6rHaltSchalter()): haelt vor
//     jedem 5. Strich an – die Kopie der Karte liegt schon auf dem Buendel,
//     der Querstrich ist noch nicht gezogen. Unter der Strichliste steht das
//     Schild „Jetzt kommt der Querstrich.“; dann ist Pause.
//   Nur das wechselnde Wort steht in einem eigenen <span> (_m6r-tempo-an,
//   _m6r-halt-an), wie in den Bausaetzen von Kapitel 2 und 4.
// Hinweiszeile _m6r-lehrkraft (in der Pause „lmp-status off“, sonst „on“):
//   sonst  „Für die Lehrkraft: „Pause“ hält alles an. „Halt vor dem Querstrich“ stoppt von selbst.“
//   Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
//   Halt   „Halt vor dem Querstrich. Frage: Wie geht der 5. Strich? Dann „weiter“.“
// So ist es gebaut:
//   * EIN Zeitfaktor (_m6rZeitfaktor: 0 in der Pause, 1/3 langsam, 1 normal)
//     an der einen Stelle, an der dt in _m6rUpdate hineingeht. Ohne Zeit kein
//     Schritt im Ablauf (`dt > 0`).
//   * Der Halt ist ein EREIGNIS im Ablauf (Landezeit eines 5. Strichs wird
//     ueberschritten), keine Zeitmessung.
//   * Waehrend der Pause bewegt KEIN Heftknopf etwas: Steht eine Bewegung,
//     entfaellt der Druck; steht keine, wird er VORGEMERKT und beginnt mit
//     „weiter“. Das Schild „Pause“ leuchtet dabei kurz auf (in echter Zeit).
//     Eine Sprungmarke und „neu“ heben die Pause auf; „Tempo“ und „Halt“
//     bleiben stehen. Voreinstellung: Pause aus, Tempo normal, Halt aus.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): das Fachwort fuer die
// Anzahl der Striche (Merksatz-Luecke), das Wort fuer zehn Einer, die Regel als
// Satz (kein „Ein Buendel zaehlt 5“). „Fünferbündel“ ist erlaubt (Bauplan).
// Keine Namen, keine Punkte als Belohnung, keine Zeit, kein „falsch“.
// Deterministisch, ohne Zufall: jede Zahl im Bild und in den Statuszeilen
// kommt aus _m6rUMFRAGE und den gezeichneten Strichen.
// ════════════════════════════════════════════════════════════════════════
let _m6r = null;
// Die Umfrage: 28 Antwortkarten in fester Reihenfolge, 4 Reihen zu 7.
// 0 zu Fuss · 1 Rad · 2 Bus · 3 Auto. Zusammen 6 + 4 + 13 + 5 = 28.
const _m6rUMFRAGE = [2, 0, 2, 1, 3, 2, 2,
                     0, 2, 3, 2, 1, 2, 0,
                     2, 3, 0, 2, 2, 1, 3,
                     2, 0, 3, 2, 1, 0, 2];
const _m6rANTW = [
  { k: 'fuss', wort: 'zu Fuß', f: '#15803d', hell: '#dcfce7' },
  { k: 'rad',  wort: 'Rad',    f: '#1d4ed8', hell: '#dbeafe' },
  { k: 'bus',  wort: 'Bus',    f: '#7e22ce', hell: '#f3e8ff' },
  { k: 'auto', wort: 'Auto',   f: '#be123c', hell: '#ffe4e6' }
];
const _m6rK = {
  // Karten links: Breite, Hoehe, Raster, erste Ecke, Reihe fuer neue Karten, Tisch
  KW: 21, KH: 27, KPX: 24, KPY: 32, KX0: 12, KY0: 48, TRENN_Y: 185, ZUS_Y: 196,
  TX0B: 6, TX1B: 180, TY0B: 38, TY1B: 244,
  // Strichliste rechts: Papier, Karo, Tabelle, Spaltenlinien
  PX0: 184, PX1: 414, PY0: 6, PY1: 244, KA: 12,
  LX0: 188, LX1: 410, LY0: 12, RH: 50, SP1: 258, SP2: 378,
  // Striche: erster Strich, Abstand im Buendel, Abstand der Buendel, halbe Hoehe
  SX0: 268, SAB: 6, BUE: 27, SH: 9,
  AX: 394,                                   // Mitte des Anzahl-Felds
  MAXS: 20, MAXZ: 7,                         // Grenzen: Striche je Zeile, neue Karten
  // Farben
  F_TINTE: '#0f172a', F_GRAU: '#94a3b8', F_KARO: '#d4e3f1', F_LINIE: '#94a3b8',
  F_LICHT: '#f59e0b', F_ORANGE: '#ea580c'
};
// Zeiten in s. N normal, S schnell („alle Antworten“, 0,25 s je Karte).
const _m6rZ = {
  N: { LICHT: 0.15, GLEIT: 0.5, STRICH: 0.12, QUER: 0.7, NACH: 0.25, SPR_B: 0.45, SPR_E: 0.3,
       ANZ: 0.4, POP: 0.35 },
  S: { LICHT: 0.05, GLEIT: 0.2, STRICH: 0.08, QUER: 0.35, NACH: 0.1, SPR_B: 0.25, SPR_E: 0.15,
       ANZ: 0.2, POP: 0.2 },
  LEER: 0.3, REIN: 0.45, ZWISCHEN: 0.2, G_EIN: 0.4, G_SPR: 0.22, G_NACH: 0.5,
  GLANZ: 0.6, AHA: 2.6, EIN: 0.35, WACKEL: 0.45, LANGSAM: 1 / 3
};

// ── Lage ────────────────────────────────────────────────────────────────
// Mitte des Zeileninhalts (Striche, Symbol, Anzahl) in Zeile a; darueber
// 23 px Luft fuer Zaehlpunkt und Zahlen.
function _m6rYC(a) { return _m6rK.LY0 + a * _m6rK.RH + 32; }
// x des k-ten Strichs (0 …); beim Querstrich die Mitte seines Buendels.
function _m6rSX(k) {
  const K = _m6rK, b = Math.floor(k / 5), j = k % 5;
  return K.SX0 + b * K.BUE + (j < 4 ? j * K.SAB : 1.5 * K.SAB);
}
function _m6rBuendelX(b) { return _m6rK.SX0 + b * _m6rK.BUE; }
// Antwort einer Karte (0 … 27 Umfrage, ab 28 neue Karten)
function _m6rAntwortVon(id) {
  return id < 28 ? _m6rUMFRAGE[id] : (_m6r.zusInfo[id] ? _m6r.zusInfo[id].a : 0);
}
// linke obere Ecke einer Karte
function _m6rKartePos(id) {
  const K = _m6rK;
  if (id < 28) return { x: K.KX0 + (id % 7) * K.KPX, y: K.KY0 + Math.floor(id / 7) * K.KPY };
  const s = _m6r.zusInfo[id] ? _m6r.zusInfo[id].slot : 0;
  return { x: K.KX0 + s * K.KPX, y: K.ZUS_Y };
}
// Die Karten der Umfrage zu Antwort a, in Umfrage-Reihenfolge
function _m6rUmfrageVon(a) {
  const out = [];
  _m6rUMFRAGE.forEach((w, i) => { if (w === a) out.push(i); });
  return out;
}
function _m6rZaehlweg(n) {
  const out = [], nB = Math.floor(n / 5);
  for (let b = 1; b <= nB; b++) out.push(5 * b);
  for (let e = 1; e <= n % 5; e++) out.push(5 * nB + e);
  return out;
}

// ── Ablaufplaene: alle Zeitpunkte einer Bewegung im Voraus ──────────────
// Striche fuer die Karten ids in Zeile a, ab Strich k0, Beginn t, Zeiten T.
function _m6rPlan(a, ids, t, T, k0) {
  const K = _m6rK, P = { a, k0, n: k0 + ids.length, karten: [], zaehl: [], tStart: t, T };
  ids.forEach((id, i) => {
    const k = k0 + i, quer = k % 5 === 4;
    const e = { id, k, quer, tL: t, tG: t + T.LICHT };
    e.tLand = e.tG + T.GLEIT;
    e.tFertig = e.tLand + (quer ? T.QUER : T.STRICH);
    P.karten.push(e);
    t = quer ? e.tFertig : e.tLand;              // die naechste Karte leuchtet, waehrend der Strich waechst
  });
  P.tLetzt = P.karten.length ? P.karten[P.karten.length - 1].tFertig : t;
  // Zaehlen: erst je Buendel ein Sprung, dann je einzelnem Strich
  let cur = P.tLetzt + T.NACH, px = K.SX0 - 12;
  const nB = Math.floor(P.n / 5), nE = P.n % 5;
  for (let b = 0; b < nB; b++) {
    const x = _m6rSX(b * 5 + 4);
    P.zaehl.push({ tAb: cur, tAn: cur + T.SPR_B, x0: px, x1: x, wert: 5 * (b + 1), buendel: true });
    px = x; cur += T.SPR_B;
  }
  for (let e = 0; e < nE; e++) {
    const x = _m6rSX(nB * 5 + e);
    P.zaehl.push({ tAb: cur, tAn: cur + T.SPR_E, x0: px, x1: x, wert: nB * 5 + e + 1, buendel: false });
    px = x; cur += T.SPR_E;
  }
  P.tZaehlEnde = cur; P.tAnzahl = cur + T.ANZ; P.tEnde = P.tAnzahl + T.POP;
  return P;
}
// Gegenprobe: nur ueber die senkrechten Striche einer Zeile mit n Strichen
function _m6rGPlan(a, n) {
  const K = _m6rK, Z = _m6rZ, G = { a, n, spr: [] };
  let cur = Z.G_EIN, px = K.SX0 - 12, w = 0;
  for (let k = 0; k < n; k++) {
    if (k % 5 === 4) continue;
    w++;
    const x = _m6rSX(k);
    G.spr.push({ tAb: cur, tAn: cur + Z.G_SPR, x0: px, x1: x, wert: w });
    px = x; cur += Z.G_SPR;
  }
  G.wert = w; G.tFertig = cur; G.tEnde = cur + Z.G_NACH;
  return G;
}
// Schnellzugriff im Ablauf: Plan je Zeile, Eintrag je Karte
function _m6rVerzeichnis(J) {
  J.planVon = {}; J.eintrag = {};
  for (const P of J.abl || []) {
    J.planVon[P.a] = P;
    for (const e of P.karten) J.eintrag[e.id] = e;
  }
  J.leerReihe = {}; J.leerKarte = {};
  if (J.leer) {
    for (const a of J.leer.reihen) J.leerReihe[a] = true;
    for (const id of J.leer.zus) J.leerKarte[id] = true;
  }
  return J;
}

function _m6rInit() {
  _m6r = { t: 0, fx: [], haltAn: false, langsam: false, cache: {} };   // Lehrkraft-Einstellungen
  _m6rLeer();
}
// Start: 28 Karten, Strichliste leer. Hebt die Pause auf.
function _m6rLeer() {
  const z = _m6r;
  z.reihe = [[], [], [], []]; z.gezaehlt = [false, false, false, false];
  z.zus = []; z.zusInfo = {}; z.naechste = 28;
  z.wahl = null; z.lauf = null; z.gerade = null; z.summeAn = false;
  z.ein = _m6rZ.EIN; z.wackel = 0; z.ahaGlanz = 0; z.ahaIds = [];
  z.fx.length = 0;
  z.pause = false; z.halt = false; z.blink = 0; z.vormerk = null;
}
function _m6rHTML() {
  const marke = (A, a) => `<button class="sim-btn" id="_m6r-b-${A.k}" onclick="_m6rMarke('${A.k}')">${A.wort.replace(' ', '&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Kinder kommen mit dem Bus?</h3>
    <div class="fpm-note" style="margin-top:2px">Jede Karte ist eine Antwort. Wähle eine Antwort und sieh zu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6r-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6rANTW.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6r-plus" onclick="_m6rPlus()">+&nbsp;1 Strich</button>
          <button class="sim-btn" id="_m6r-gerade-k" onclick="_m6rGerade()">nur gerade Striche</button>
          <button class="sim-btn" onclick="_m6rAlle()">alle Antworten</button>
          <button class="sim-btn" onclick="_m6rNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6r-pause" onclick="_m6rAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6r-tempo" onclick="_m6rTempo()">Tempo: <span id="_m6r-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6r-halt" onclick="_m6rHaltSchalter()">Halt vor dem Querstrich: <span id="_m6r-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6r-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6r-antwort" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6r-karten" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6r-buendel" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6r-zaehlen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6r-anzahl" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6r-gerade" style="margin-top:6px;display:none"></div>
        <div class="lmp-status on" id="_m6r-summe" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 28 Antwortkarten, die Strichliste ist leer</p>
  </div>`;
}

// ── Was gerade dasteht (Bild UND Anzeige lesen hier ab) ─────────────────
// Antwort, die gerade gilt: bei „alle Antworten“ die Zeile, die gerade laeuft.
function _m6rAktuell() {
  const z = _m6r, J = z.lauf;
  if (J && J.art === 'alle') {
    let a = J.abl[0].a;
    for (const P of J.abl) if (J.t >= P.tStart) a = P.a;
    return a;
  }
  return z.wahl;
}
// Sichtbare Striche in Zeile a: [{k, id, p (gezogen 0..1), al (Deckkraft)}]
function _m6rStriche(a) {
  const z = _m6r, J = z.lauf, out = [];
  const alt = z.reihe[a];
  if (J && J.leerReihe[a]) {
    if (J.t < _m6rZ.LEER) {
      const al = 1 - J.t / _m6rZ.LEER;
      alt.forEach((id, k) => out.push({ k, id, p: 1, al }));
    }
  } else alt.forEach((id, k) => out.push({ k, id, p: 1, al: 1 }));
  const P = J && J.planVon[a];
  if (P) for (const e of P.karten) {
    if (J.t > e.tLand)                             // beim Halt (t = Landezeit) fehlt der Querstrich noch
      out.push({ k: e.k, id: e.id, p: _bioFxKlemme((J.t - e.tLand) / (e.tFertig - e.tLand)), al: 1, e });
  }
  return out;
}
// Wie viele Karten der Zeile a sind abgehakt? (= gelandete Striche)
function _m6rAbgehakt(a) {
  const z = _m6r, J = z.lauf;
  let n = 0;
  if (J && J.leerReihe[a]) { if (J.t < _m6rZ.LEER / 2) n = z.reihe[a].length; }
  else n = z.reihe[a].length;
  const P = J && J.planVon[a];
  if (P) for (const e of P.karten) if (J.t > e.tLand) n++;
  return n;
}
// Fertig gezogene Striche (von vorn ohne Luecke) – daraus Buendel und Rest
function _m6rFertigeStriche(a) {
  const z = _m6r, J = z.lauf;
  let m = 0;
  if (J && J.leerReihe[a]) { if (J.t < _m6rZ.LEER / 2) m = z.reihe[a].length; }
  else m = z.reihe[a].length;
  const P = J && J.planVon[a];
  if (P) for (const e of P.karten) if (J.t >= e.tFertig && J.t > e.tLand) m = Math.max(m, e.k + 1);
  return m;
}
// Laeuft in Zeile a gerade eine Neuzaehlung? (bei „+ 1 Strich“ erst, wenn der Strich steht)
function _m6rZaehltNeu(a) {
  const J = _m6r.lauf, P = J && J.planVon[a];
  if (!P) return null;
  if (J.art === 'plus' && !(J.t > P.karten[0].tLand)) return null;
  return P;
}
// Anzahl-Feld der Zeile a: {wert, pop (s seit Erscheinen), al} oder null (leer)
function _m6rFeld(a) {
  const z = _m6r, J = z.lauf;
  if (J && J.leerReihe[a]) {
    if (J.t < _m6rZ.LEER && z.gezaehlt[a])
      return { wert: z.reihe[a].length, pop: 9, al: 1 - J.t / _m6rZ.LEER, alt: true };
    const P = J.planVon[a];
    if (P && J.t >= P.tAnzahl) return { wert: P.n, pop: J.t - P.tAnzahl, al: 1 };
    return null;
  }
  const P = _m6rZaehltNeu(a);
  if (P) return J.t >= P.tAnzahl ? { wert: P.n, pop: J.t - P.tAnzahl, al: 1 } : null;
  return z.gezaehlt[a] ? { wert: z.reihe[a].length, pop: 9, al: 1 } : null;
}
// Zaehlweg, soweit der Lichtpunkt gesprungen ist (leer: noch nicht gezaehlt)
function _m6rZaehlStand(a) {
  const z = _m6r, J = z.lauf;
  if (J && J.leerReihe[a]) {
    const P = J.planVon[a];
    return P ? P.zaehl.filter(s => J.t >= s.tAn).map(s => s.wert) : [];
  }
  const P = _m6rZaehltNeu(a);
  if (P) return P.zaehl.filter(s => J.t >= s.tAn).map(s => s.wert);
  return z.gezaehlt[a] ? _m6rZaehlweg(z.reihe[a].length) : [];
}

// ── Statuszeilen ────────────────────────────────────────────────────────
function _m6rSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6rZeige(id, html) {
  const z = _m6r;
  if (z.cache[id] === html) return;
  z.cache[id] = html;
  const e = _m6rSetze(id, html);
  if (e && e.style) e.style.display = html ? '' : 'none';
}
function _m6rTexte() {
  const z = _m6r, J = z.lauf, a = _m6rAktuell(), T = {};
  const farbig = (s, f) => '<b style="color:' + f + '">' + s + '</b>';
  if (a === null) {
    T.antwort = 'Gewählte Antwort: noch keine';
    T.karten = 'Abgehakt bei dieser Antwort: …';
    T.buendel = 'Fünferbündel und einzelne Striche: …';
    T.zaehlen = 'Zählweg der Striche: …';
    T.anzahl = 'Anzahl bei dieser Antwort: …';
  } else {
    const A = _m6rANTW[a], w = farbig(A.wort, A.f);
    T.antwort = 'Gewählte Antwort: ' + w;
    const n = _m6rAbgehakt(a);
    T.karten = 'Abgehakt bei dieser Antwort: ' + n + (n === 1 ? ' Karte' : ' Karten');
    const m = _m6rFertigeStriche(a), b = Math.floor(m / 5), e = m % 5;
    T.buendel = w + ': ' + b + ' Fünferbündel und ' + e + (e === 1 ? ' einzelner Strich' : ' einzelne Striche');
    const zw = _m6rZaehlStand(a);
    T.zaehlen = 'Zählweg der Striche: ' + (zw.length ? zw.join(', ') : '…');
    const f = _m6rFeld(a);
    T.anzahl = 'Anzahl bei ' + w + ': ' +
               (f && !f.alt ? farbig(f.wert + (f.wert === 1 ? ' Kind' : ' Kinder'), A.f) : '…');
  }
  // Gegenprobe (nur danach)
  T.gerade = '';
  if (J && J.art === 'gerade') {
    T.gerade = 'Nur gerade Striche gezählt: ' +
               (J.t >= J.g.tFertig ? J.g.wert + ', Karten: ' + J.g.n : '…');
  } else if (z.gerade) T.gerade = 'Nur gerade Striche gezählt: ' + z.gerade.wert + ', Karten: ' + z.gerade.n;
  // alle Antworten (nur danach)
  T.summe = '';
  if (J && J.art === 'alle') T.summe = 'Alle Striche zusammen: …';
  else if (z.summeAn) {
    let s = 0, k = 0;
    for (let r = 0; r < 4; r++) { s += _m6rFertigeStriche(r); k += _m6rAbgehakt(r); }
    T.summe = 'Alle Striche zusammen: ' + s + ', Karten: ' + k;
  }
  return T;
}
function _m6rStatus() {
  if (!_m6r) return;
  const z = _m6r, T = _m6rTexte(), a = _m6rAktuell();
  for (const id of ['antwort', 'karten', 'buendel', 'zaehlen', 'anzahl', 'gerade', 'summe'])
    _m6rZeige('_m6r-' + id, T[id]);
  // Sprungmarke der gewaehlten Antwort hervorheben
  _m6rANTW.forEach((A, i) => {
    const b = document.getElementById('_m6r-b-' + A.k);
    if (b && b.classList) b.classList.toggle('primary', i === a);
  });
  // „+ 1 Strich“ und „nur gerade Striche“ erst nach einer Sprungmarke
  for (const id of ['_m6r-plus', '_m6r-gerade-k']) {
    const b = document.getElementById(id);
    if (b) { b.disabled = a === null; if (b.style) b.style.opacity = a === null ? '0.45' : ''; }
  }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _m6rZeige('_m6r-pause', z.pause ? 'weiter' : 'Pause');
  _m6rZeige('_m6r-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6rZeige('_m6r-halt-an', z.haltAn ? 'an' : 'aus');
  _m6rZeige('_m6r-lehrkraft', _m6rHinweis());
  const hz = document.getElementById('_m6r-lehrkraft');
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6r-pause', z.pause], ['_m6r-halt', z.haltAn], ['_m6r-tempo', z.langsam]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6rHinweis() {
  const z = _m6r;
  if (z.halt) return 'Halt vor dem Querstrich. Frage: Wie geht der 5. Strich? Dann „weiter“.';
  if (z.pause) return 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  return 'Für die Lehrkraft: „Pause“ hält alles an. „Halt vor dem Querstrich“ stoppt von selbst.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6rIndex(key) {
  for (let i = 0; i < _m6rANTW.length; i++) if (_m6rANTW[i].k === key) return i;
  return -1;
}
// Pause aufheben (Sprungmarke, „neu“)
function _m6rPauseWeg() {
  const z = _m6r;
  z.pause = false; z.halt = false; z.vormerk = null; z.blink = 0;
}
// Sprungmarke: die Zeile dieser Antwort neu abspielen. Hebt die Pause auf.
function _m6rMarke(key) {
  if (!_m6r) return;
  const a = _m6rIndex(key);
  if (a < 0) return;
  const z = _m6r;
  _m6rPauseWeg();
  _m6rFertig();
  z.wahl = a; z.gerade = null; z.summeAn = false; z.wackel = 0; z.ahaGlanz = 0;
  const P = _m6rPlan(a, _m6rUmfrageVon(a), _m6rZ.LEER, _m6rZ.N, 0);
  z.lauf = _m6rVerzeichnis({ art: 'spiel', a, t: 0, abl: [P], ende: P.tEnde,
    leer: { reihen: [a], zus: z.zus.filter(id => z.zusInfo[id].a === a) } });
  _m6rStatus();
}
// „neu“: sofort der Start. Hebt die Pause auf.
function _m6rNeu() {
  if (!_m6r) return;
  _m6rLeer();
  _m6rStatus();
}
// Heftknoepfe ausser Sprungmarke und „neu“: in der Pause vormerken oder entfallen
function _m6rTat(f) {
  if (!_m6r) return;
  const z = _m6r;
  if (z.pause) {
    z.blink = 0.6;
    if (!z.lauf) z.vormerk = f;
    _m6rStatus();
    return;
  }
  f();
}
function _m6rPlus() { _m6rTat(_m6rPlusLos); }
function _m6rGerade() { _m6rTat(_m6rGeradeLos); }
function _m6rAlle() { _m6rTat(_m6rAlleLos); }
// „+ 1 Strich“: eine neue Karte der gewaehlten Antwort, ein Strich mehr
function _m6rPlusLos() {
  const z = _m6r, K = _m6rK;
  _m6rFertig();
  const a = z.wahl;
  if (a === null) return;
  const belegt = {};
  for (const id of z.zus) belegt[z.zusInfo[id].slot] = true;
  let slot = -1;
  for (let s = 0; s < K.MAXZ; s++) if (!belegt[s]) { slot = s; break; }
  if (slot < 0 || z.reihe[a].length >= K.MAXS) { z.wackel = _m6rZ.WACKEL; _m6rStatus(); return; }
  const id = z.naechste++;
  z.zusInfo[id] = { a, slot };
  z.gerade = null; z.ahaGlanz = 0;
  const P = _m6rPlan(a, [id], _m6rZ.REIN, _m6rZ.N, z.reihe[a].length);
  z.lauf = _m6rVerzeichnis({ art: 'plus', a, t: 0, abl: [P], ende: P.tEnde, neu: id, leer: null });
  _m6rStatus();
}
// „nur gerade Striche“: Gegenprobe in der gewaehlten Zeile
function _m6rGeradeLos() {
  const z = _m6r;
  _m6rFertig();
  const a = z.wahl;
  if (a === null || !z.reihe[a].length) return;
  z.gerade = null; z.ahaGlanz = 0;
  const G = _m6rGPlan(a, z.reihe[a].length);
  z.lauf = _m6rVerzeichnis({ art: 'gerade', a, t: 0, g: G, ende: G.tEnde, leer: null });
  _m6rStatus();
}
// „alle Antworten“: alles leeren, dann die vier Zeilen nacheinander schnell
function _m6rAlleLos() {
  const z = _m6r, Z = _m6rZ;
  _m6rFertig();
  z.gerade = null; z.summeAn = false; z.ahaGlanz = 0;
  const abl = [];
  let t = Z.LEER;
  for (let a = 0; a < 4; a++) {
    const P = _m6rPlan(a, _m6rUmfrageVon(a), t, Z.S, 0);
    abl.push(P);
    t = P.tEnde + Z.ZWISCHEN;
  }
  z.lauf = _m6rVerzeichnis({ art: 'alle', t: 0, abl, ende: abl[3].tEnde,
    leer: { reihen: [0, 1, 2, 3], zus: z.zus.slice() } });
  _m6rStatus();
}
// Die laufende Bewegung ankommen lassen: erst jetzt aendert sich der feste Stand.
function _m6rLanden() {
  const z = _m6r, J = z.lauf;
  if (!J) return;
  z.lauf = null;
  if (J.leer) {                                    // was geleert wurde, ist weg
    for (const a of J.leer.reihen) { z.reihe[a] = []; z.gezaehlt[a] = false; }
    for (const id of J.leer.zus) { delete z.zusInfo[id]; }
    z.zus = z.zus.filter(id => !J.leerKarte[id]);
  }
  if (J.art === 'spiel' || J.art === 'alle') {
    for (const P of J.abl) { z.reihe[P.a] = P.karten.map(e => e.id); z.gezaehlt[P.a] = true; }
    if (J.art === 'alle') { z.wahl = 3; z.summeAn = true; }
  } else if (J.art === 'plus') {
    z.zus.push(J.neu);
    z.reihe[J.a].push(J.neu); z.gezaehlt[J.a] = true;
  } else if (J.art === 'gerade') {
    z.gerade = { a: J.a, wert: J.g.wert, n: J.g.n };
  }
  _m6rStatus();
}
function _m6rFertig() { if (_m6r && _m6r.lauf) _m6rLanden(); }

// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6rAnhalten() {
  if (!_m6r) return;
  const z = _m6r;
  if (z.pause) {
    z.pause = false; z.halt = false; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v && !z.lauf) v();
  } else z.pause = true;
  _m6rStatus();
}
function _m6rTempo() {
  if (!_m6r) return;
  _m6r.langsam = !_m6r.langsam;
  _m6rStatus();
}
function _m6rHaltSchalter() {
  if (!_m6r) return;
  _m6r.haltAn = !_m6r.haltAn;
  _m6rStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6rZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6rZ.LANGSAM : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6rUpdate(dt) {
  if (!_m6r) return;
  const z = _m6r, Z = _m6rZ;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);            // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6rZeitfaktor(z);                    // ab hier Sim-Zeit
  z.t += dt;
  z.ein = Math.max(0, z.ein - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  const J = z.lauf;
  if (J && dt > 0) {                               // ohne Zeit kein Schritt im Ablauf
    const vor = J.t;
    J.t += dt;
    const ueber = s => vor < s && J.t >= s;
    // HALT vor dem Querstrich: die Kopie liegt auf dem Buendel, der Strich fehlt noch
    if (z.haltAn && J.abl) {
      outer: for (const P of J.abl) for (const e of P.karten) {
        if (e.quer && ueber(e.tLand)) {
          J.t = e.tLand; z.pause = true; z.halt = true;
          break outer;
        }
      }
    }
    if (J.art === 'spiel' && J.a === 2 && ueber(J.abl[0].tAnzahl)) _m6rAha(J.abl[0]);
    if (J.art === 'gerade' && ueber(J.g.tFertig)) {
      // Gegenprobe am Ziel: die Karten ohne gezaehlten Strich leuchten auf
      for (const [k, id] of z.reihe[J.a].entries()) {
        if (k % 5 !== 4) continue;
        const p = _m6rKartePos(id);
        _bioFxWelle(z.fx, p.x + _m6rK.KW / 2, p.y + _m6rK.KH / 2, _m6rK.F_ORANGE, 26);
      }
    }
    if (!z.halt && J.t >= J.ende) _m6rLanden();
  }
  _bioFxUpdate(z.fx, dt);
  _m6rStatus();                                    // setzt nur, was sich geaendert hat
}
// Aha bei „Bus“: Lichtringe um die Querstriche und ihre Karten
function _m6rAha(P) {
  const z = _m6r, K = _m6rK, yc = _m6rYC(P.a);
  z.ahaGlanz = _m6rZ.AHA;
  z.ahaIds = P.karten.filter(e => e.quer).map(e => ({ id: e.id, k: e.k }));
  for (const q of z.ahaIds) {
    _bioFxWelle(z.fx, _m6rSX(q.k), yc, K.F_LICHT, 30);
    const p = _m6rKartePos(q.id);
    _bioFxWelle(z.fx, p.x + K.KW / 2, p.y + K.KH / 2, K.F_LICHT, 30);
  }
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6rText(ctx, s, x, y, gr, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m6rK.F_TINTE;
  ctx.font = (gew || '700') + ' ' + gr + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Symbol der Antwort a um (x, y), Groesse s (1 = etwa 14 px), Farbe f
function _m6rSymbol(ctx, a, x, y, s, f) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = f; ctx.strokeStyle = f; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (a === 0) {                                   // Fussabdruck
    ctx.beginPath(); ctx.ellipse(0.3, 2.4, 3.1, 4.6, 0.12, 0, Math.PI * 2); ctx.fill();
    const zehen = [[-2.2, -3.9, 1.35], [-0.2, -4.9, 1.1], [1.6, -4.7, 0.95], [3.0, -3.8, 0.8], [3.9, -2.5, 0.7]];
    for (const [zx, zy, zr] of zehen) { ctx.beginPath(); ctx.arc(zx, zy, zr, 0, Math.PI * 2); ctx.fill(); }
  } else if (a === 1) {                            // Fahrrad
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.arc(-4.4, 2.6, 3.2, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(4.4, 2.6, 3.2, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4.4, 2.6); ctx.lineTo(-1.2, -1.6); ctx.lineTo(3.0, -1.6); ctx.lineTo(4.4, 2.6);
    ctx.moveTo(-1.2, -1.6); ctx.lineTo(0.4, 2.6); ctx.lineTo(-4.4, 2.6);
    ctx.moveTo(3.0, -1.6); ctx.lineTo(2.5, -4.2); ctx.lineTo(4.1, -4.4);
    ctx.moveTo(-1.2, -1.6); ctx.lineTo(-1.5, -3.2);
    ctx.stroke();
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-2.7, -3.2); ctx.lineTo(-0.3, -3.2); ctx.stroke();
  } else if (a === 2) {                            // Bus
    _bioFxRundRect(ctx, -6.4, -5.4, 12.8, 9.6, 1.8); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5.2, -4.0, 2.7, 3.0); ctx.fillRect(-1.8, -4.0, 2.7, 3.0); ctx.fillRect(1.6, -4.0, 3.4, 3.0);
    ctx.fillRect(-5.2, 0.9, 10.2, 0.8);
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.arc(-3.5, 4.4, 1.75, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3.5, 4.4, 1.75, 0, Math.PI * 2); ctx.fill();
  } else {                                         // Auto
    ctx.beginPath();
    ctx.moveTo(-3.8, -0.6); ctx.lineTo(-2.2, -4.2); ctx.lineTo(2.4, -4.2); ctx.lineTo(4.3, -0.6);
    ctx.closePath(); ctx.fill();
    _bioFxRundRect(ctx, -6.6, -0.9, 13.2, 4.6, 1.4); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-2.9, -1.0); ctx.lineTo(-1.8, -3.4); ctx.lineTo(-0.1, -3.4); ctx.lineTo(-0.1, -1.0); ctx.closePath();
    ctx.moveTo(0.6, -1.0); ctx.lineTo(0.6, -3.4); ctx.lineTo(2.0, -3.4); ctx.lineTo(3.3, -1.0); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.arc(-3.7, 3.9, 1.75, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3.7, 3.9, 1.75, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Eine Antwortkarte, linke obere Ecke (x, y). o: {haken 0..1, licht 0..1, orange, al, s}
function _m6rKarte(ctx, x, y, a, o) {
  const K = _m6rK, A = _m6rANTW[a], s = o.s || 1, al = o.al === undefined ? 1 : o.al;
  if (al <= 0.01) return;
  const cx = x + K.KW / 2, cy = y + K.KH / 2, h = o.haken || 0;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, al);
  ctx.translate(cx, cy); ctx.scale(s, s);
  const w = K.KW, hh = K.KH;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, -w / 2 + 1, -hh / 2 + 1.5, w, hh, 3); ctx.fill();
  ctx.fillStyle = h > 0.5 ? '#f1f5f9' : '#ffffff';
  ctx.strokeStyle = h > 0.5 ? '#cbd5e1' : A.f; ctx.lineWidth = 1.6;
  _bioFxRundRect(ctx, -w / 2, -hh / 2, w, hh, 3); ctx.fill(); ctx.stroke();
  if (o.licht > 0.01) {                            // leuchtet: bernsteinfarbener Rand
    ctx.save();
    ctx.globalAlpha *= Math.min(1, o.licht);
    ctx.strokeStyle = K.F_LICHT; ctx.lineWidth = 2.6;
    _bioFxRundRect(ctx, -w / 2 - 2, -hh / 2 - 2, w + 4, hh + 4, 4); ctx.stroke();
    ctx.restore();
  }
  if (o.orange > 0.01) {                           // Gegenprobe: Karte ohne gezaehlten Strich
    ctx.save();
    ctx.globalAlpha *= Math.min(1, o.orange);
    ctx.fillStyle = 'rgba(251,146,60,0.22)';
    _bioFxRundRect(ctx, -w / 2, -hh / 2, w, hh, 3); ctx.fill();
    ctx.strokeStyle = K.F_ORANGE; ctx.lineWidth = 2.6;
    _bioFxRundRect(ctx, -w / 2 - 2, -hh / 2 - 2, w + 4, hh + 4, 4); ctx.stroke();
    ctx.restore();
  }
  _m6rSymbol(ctx, a, 0, -1.5, 1, h > 0.5 ? K.F_GRAU : A.f);
  if (h > 0.01) {                                  // Haken in der Farbe der Antwort
    ctx.save();
    ctx.globalAlpha *= Math.min(1, h);
    ctx.strokeStyle = A.f; ctx.lineWidth = 2.3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-6, 5.5); ctx.lineTo(-2.5, 9); ctx.lineTo(6.5, -0.5); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
// Zustand einer Karte im Bild
function _m6rKarteBild(id) {
  const z = _m6r, J = z.lauf, Z = _m6rZ, a = _m6rAntwortVon(id);
  const o = { haken: 0, licht: 0, orange: 0, al: 1, dx: 0 };
  const inReihe = z.reihe[a].indexOf(id);
  if (inReihe >= 0) o.haken = 1;
  if (J && J.leerReihe[a] && inReihe >= 0) o.haken = 1 - _bioFxKlemme((J.t - 0.1) / 0.1);
  if (J && J.leerKarte[id]) {                      // neue Karte gleitet hinaus
    const u = _bioFxKlemme(J.t / Z.LEER);
    o.dx = 50 * _bioFxEase.rein(u); o.al = 1 - u;
  }
  if (J && J.art === 'plus' && J.neu === id) {     // neue Karte kommt von rechts
    const u = _bioFxKlemme(J.t / Z.REIN);
    o.dx = 50 * (1 - _bioFxEase.raus(u)); o.al = u;
  }
  const e = J && J.eintrag[id];
  if (e) {
    if (J.t >= e.tL && J.t <= e.tLand) o.licht = _bioFxKlemme((J.t - e.tL) / 0.1);
    if (J.t > e.tLand) { o.haken = 1; o.licht = 1 - _bioFxKlemme((J.t - e.tLand) / 0.25); }
  }
  // Gegenprobe: die Karten der Querstriche werden orange
  const g = _m6rGeradeBild();
  if (g && g.a === a && inReihe >= 0 && inReihe % 5 === 4) o.orange = g.u;
  return o;
}
// Gegenprobe im Bild: {a, u (orange 0..1), spr, t} oder null
function _m6rGeradeBild() {
  const z = _m6r, J = z.lauf;
  if (J && J.art === 'gerade') return { a: J.a, u: _bioFxKlemme(J.t / _m6rZ.G_EIN), g: J.g, t: J.t };
  if (z.gerade && z.reihe[z.gerade.a].length === z.gerade.n)
    return { a: z.gerade.a, u: 1, g: _m6rGPlan(z.gerade.a, z.gerade.n), t: 99 };
  return null;
}
function _m6rTisch(ctx) {
  const K = _m6rK, z = _m6r;
  ctx.save();
  ctx.fillStyle = '#eef2f7'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, K.TX0B, K.TY0B, K.TX1B - K.TX0B, K.TY1B - K.TY0B, 8); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(K.KX0, K.TRENN_Y); ctx.lineTo(K.TX1B - 6, K.TRENN_Y); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  const ein = z.ein > 0 ? 1 - z.ein / _m6rZ.EIN : 1;
  for (let id = 0; id < 28; id++) {
    const p = _m6rKartePos(id), o = _m6rKarteBild(id);
    o.al *= ein;
    _m6rKarte(ctx, p.x + o.dx, p.y, _m6rUMFRAGE[id], o);
  }
  // neue Karten (fest, hinausgleitend, hereinkommend)
  const J = z.lauf, ids = z.zus.slice();
  if (J && J.art === 'plus' && ids.indexOf(J.neu) < 0) ids.push(J.neu);
  for (const id of ids) {
    if (!z.zusInfo[id]) continue;
    const p = _m6rKartePos(id), o = _m6rKarteBild(id);
    _m6rKarte(ctx, p.x + o.dx, p.y, z.zusInfo[id].a, o);
  }
}
function _m6rPapier(ctx) {
  const K = _m6rK, z = _m6r;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  let x0 = K.LX0, y0 = K.LY0;                      // Karo an der Tabelle ausgerichtet
  while (x0 - K.KA > K.PX0 + 1) x0 -= K.KA;
  while (y0 - K.KA > K.PY0 + 1) y0 -= K.KA;
  for (let x = x0; x < K.PX1 - 1; x += K.KA) { ctx.beginPath(); ctx.moveTo(x, K.PY0 + 1); ctx.lineTo(x, K.PY1 - 1); ctx.stroke(); }
  for (let y = y0; y < K.PY1 - 1; y += K.KA) { ctx.beginPath(); ctx.moveTo(K.PX0 + 1, y); ctx.lineTo(K.PX1 - 1, y); ctx.stroke(); }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.stroke();
  // Zeile der gewaehlten Antwort zart hinterlegen
  const a = _m6rAktuell();
  if (a !== null) {
    ctx.fillStyle = _m6rANTW[a].hell; ctx.globalAlpha = 0.8;
    ctx.fillRect(K.LX0, K.LY0 + a * K.RH, K.LX1 - K.LX0, K.RH);
    ctx.globalAlpha = 1;
  }
  // Tabelle: vier Zeilen, drei Spalten
  const yb = K.LY0 + 4 * K.RH;
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.3;
  ctx.strokeRect(K.LX0, K.LY0, K.LX1 - K.LX0, yb - K.LY0);
  ctx.strokeStyle = K.F_LINIE; ctx.lineWidth = 1;
  for (let r = 1; r < 4; r++) {
    const y = K.LY0 + r * K.RH;
    ctx.beginPath(); ctx.moveTo(K.LX0, y); ctx.lineTo(K.LX1, y); ctx.stroke();
  }
  for (const x of [K.SP1, K.SP2]) { ctx.beginPath(); ctx.moveTo(x, K.LY0); ctx.lineTo(x, yb); ctx.stroke(); }
  // Zeilenkopf: Symbol und Wort in der Farbe der Antwort
  _m6rANTW.forEach((A, r) => {
    const yc = _m6rYC(r);
    _m6rSymbol(ctx, r, 201, yc, 1.05, A.f);
    _m6rText(ctx, A.wort, 212, yc + 4.5, 13, A.f, 'left');
  });
  ctx.restore();
}
// Striche einer Zeile (mit Buendel-Leuchten und Gegenprobe-Orange)
function _m6rStricheZeichnen(ctx, a) {
  const K = _m6rK, z = _m6r, J = z.lauf, yc = _m6rYC(a), A = _m6rANTW[a];
  const wk = z.wackel > 0 && a === z.wahl ? Math.sin(z.wackel * 50) * 3 * (z.wackel / _m6rZ.WACKEL) : 0;
  const g = _m6rGeradeBild(), orange = g && g.a === a ? g.u : 0;
  const st = _m6rStriche(a);
  // Buendel leuchtet kurz, wenn sein Querstrich fertig ist
  for (const s of st) {
    if (!s.e || !s.e.quer || !J) continue;
    const seit = J.t - s.e.tFertig;
    if (seit < 0 || seit > _m6rZ.GLANZ) continue;
    const bx = _m6rBuendelX(Math.floor(s.k / 5)) + wk;
    ctx.save();
    ctx.globalAlpha = 1 - seit / _m6rZ.GLANZ;
    ctx.fillStyle = 'rgba(252,211,77,0.45)'; ctx.strokeStyle = 'rgba(217,119,6,0.8)'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, bx - 4, yc - K.SH - 3, 26, 2 * K.SH + 6, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.lineCap = 'round';
  for (const s of st) {
    ctx.globalAlpha = s.al;
    const quer = s.k % 5 === 4;
    if (!quer) {
      const x = _m6rSX(s.k) + wk, p = Math.max(0.15, s.p);
      ctx.strokeStyle = A.f; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(x, yc - K.SH); ctx.lineTo(x, yc - K.SH + 2 * K.SH * p); ctx.stroke();
    } else if (s.p > 0) {
      const bx = _m6rBuendelX(Math.floor(s.k / 5)) + wk;
      const x0 = bx - 3, y0 = yc + 7, x1 = bx + 21, y1 = yc - 7;
      ctx.strokeStyle = orange > 0 ? _m6rMisch(A.f, K.F_ORANGE, orange) : A.f;
      ctx.lineWidth = orange > 0 ? 2.2 + orange : 2.2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * s.p, y0 + (y1 - y0) * s.p); ctx.stroke();
    }
  }
  ctx.restore();
}
function _m6rMisch(h1, h2, u) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const a = p(h1), b = p(h2);
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * u)).join(',') + ')';
}
// Anzahl-Feld rechts in der Zeile
function _m6rFeldZeichnen(ctx, a) {
  const K = _m6rK, z = _m6r, yc = _m6rYC(a), A = _m6rANTW[a], f = _m6rFeld(a);
  const x = K.AX - 13, y = yc - 13;
  ctx.save();
  if (!f || f.al < 1) {                            // leer: gestrichelt
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    _bioFxRundRect(ctx, x, y, 26, 26, 5); ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
  }
  if (f) {
    ctx.globalAlpha = f.al;
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = A.f; ctx.lineWidth = 1.8;
    _bioFxRundRect(ctx, x, y, 26, 26, 5); ctx.fill(); ctx.stroke();
    const k = f.pop < 0.35 ? Math.max(0.4, _bioFxEase.federn(f.pop / 0.35)) : 1;
    ctx.translate(K.AX, yc); ctx.scale(k, k);
    _m6rText(ctx, String(f.wert), 0, 5.8, 16, A.f);
  }
  ctx.restore();
}
// Zaehlen: Lichtpunkt, Zahlen ueber den Buendeln, reitende Zahl, Flug ins Feld
function _m6rZaehlZeichnen(ctx, a) {
  const K = _m6rK, z = _m6r, J = z.lauf, yc = _m6rYC(a), A = _m6rANTW[a], E = _bioFxEase;
  let P = J && J.planVon[a];
  if (P && J.art === 'plus' && !(J.t > P.karten[0].tLand)) P = null;
  if (P && P.zaehl.length && J.t >= P.zaehl[0].tAb && J.t < P.tEnde) {
    const t = J.t, Zs = P.zaehl, letzt = Zs[Zs.length - 1];
    const aus = t > P.tAnzahl ? 1 - _bioFxKlemme((t - P.tAnzahl) / P.T.POP) : 1;
    // Zahlen ueber den Buendeln (5, 10 …)
    for (const s of Zs) if (s.buendel && t >= s.tAn)
      _m6rZahl(ctx, s.wert, s.x1, yc - K.SH - 8, 11, A.f, aus * _bioFxKlemme((t - s.tAn) / 0.12));
    // Lichtpunkt
    let x = letzt.x1, y = yc - K.SH - 3, punktA = 1 - _bioFxKlemme((t - P.tZaehlEnde) / 0.3), reit = null;
    for (const s of Zs) {
      if (t >= s.tAb && t < s.tAn) {
        const u = (t - s.tAb) / (s.tAn - s.tAb);
        x = s.x0 + (s.x1 - s.x0) * E.sanft(u);
        y = yc - K.SH - 3 - Math.sin(Math.PI * u) * (s.buendel ? 9 : 5);
        break;
      }
    }
    // reitende Zahl bei den einzelnen Strichen: die zuletzt erreichte
    let zuletzt = null;
    for (const s of Zs) if (t >= s.tAn) zuletzt = s;
    if (zuletzt && !zuletzt.buendel && t < P.tZaehlEnde) reit = zuletzt.wert;
    if (punktA > 0.01) _m6rPunkt(ctx, x, y, punktA, K.F_LICHT);
    if (reit !== null) _m6rZahl(ctx, reit, x, y - 6, 11, A.f, 1);
    // die letzte Zahl gleitet ins Anzahl-Feld
    if (t >= P.tZaehlEnde && t < P.tAnzahl) {
      const u = E.sanft(_bioFxKlemme((t - P.tZaehlEnde) / (P.tAnzahl - P.tZaehlEnde)));
      const x0 = letzt.x1, y0 = yc - K.SH - (letzt.buendel ? 8 : 9) - 4, x1 = K.AX, y1 = yc;
      _m6rZahl(ctx, P.n, x0 + (x1 - x0) * u, y0 + (y1 - y0) * u - Math.sin(Math.PI * u) * 10,
               11 + 5 * u, A.f, 1);
    }
  }
  // Gegenprobe: Punkt nur ueber den senkrechten Strichen, Zahl orange
  const g = _m6rGeradeBild();
  if (g && g.a === a && g.g.spr.length) {
    const t = g.t, S = g.g.spr, letzt = S[S.length - 1];
    let x = letzt.x1, y = yc - K.SH - 3, aktiv = false, wert = null;
    for (const s of S) {
      if (t >= s.tAb && t < s.tAn) {
        const u = (t - s.tAb) / (s.tAn - s.tAb);
        x = s.x0 + (s.x1 - s.x0) * E.sanft(u);
        y = yc - K.SH - 3 - Math.sin(Math.PI * u) * 5;
        aktiv = true;
        break;
      }
    }
    for (const s of S) if (t >= s.tAn) wert = s.wert;
    if (aktiv || (t >= letzt.tAn && t < g.g.tEnde)) _m6rPunkt(ctx, x, y, 1, K.F_ORANGE);
    if (wert !== null) _m6rZahl(ctx, wert, x, y - 6, 12, K.F_ORANGE, 1);
  }
}
function _m6rZahl(ctx, wert, x, y, gr, farbe, al) {
  if (!(al > 0.01)) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, al);
  ctx.font = '700 ' + gr + 'px sans-serif';
  const w = ctx.measureText(String(wert)).width;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  _bioFxRundRect(ctx, x - w / 2 - 2, y - gr * 0.8, w + 4, gr * 1.0, 3); ctx.fill();
  _m6rText(ctx, String(wert), x, y, gr, farbe);
  ctx.restore();
}
function _m6rPunkt(ctx, x, y, al, farbe) {
  ctx.save();
  ctx.globalAlpha *= Math.min(1, al);
  ctx.fillStyle = farbe; ctx.shadowColor = farbe; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(x, y, 3.6, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath(); ctx.arc(x - 1.1, y - 1.1, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// Kopien, die von der Karte zur Zeile gleiten (und beim Halt dort liegen)
function _m6rFluege(ctx) {
  const z = _m6r, J = z.lauf, K = _m6rK;
  if (!J || !J.abl) return;
  for (const P of J.abl) for (const e of P.karten) {
    if (J.t < e.tG || J.t > e.tLand) continue;
    const u = _bioFxEase.sanft(_bioFxKlemme((J.t - e.tG) / (e.tLand - e.tG)));
    const p = _m6rKartePos(e.id), o = _m6rKarteBild(e.id);
    const x0 = p.x + o.dx + K.KW / 2, y0 = p.y + K.KH / 2;
    // Ziel: der Platz des Strichs. Beim 5. Strich schwebt die Kopie UEBER dem
    // Buendel – beim Halt muessen die vier Striche darunter zu sehen sein.
    const x1 = _m6rSX(e.k), y1 = _m6rYC(P.a) - (e.quer ? K.SH + 9 : 0);
    const x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u - Math.sin(Math.PI * u) * 34;
    _m6rKarte(ctx, x - K.KW / 2, y - K.KH / 2, P.a, { s: 1 - 0.45 * u, licht: 1, al: 0.95 });
  }
}
// Aha: Querstrich und seine Karte, verbunden
function _m6rAhaZeichnen(ctx) {
  const z = _m6r, K = _m6rK;
  if (!(z.ahaGlanz > 0) || !z.ahaIds.length) return;
  const al = Math.min(1, z.ahaGlanz / 0.5), yc = _m6rYC(2);
  const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
  ctx.save();
  ctx.globalAlpha = al * (0.65 + 0.35 * puls);
  ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.2;
  for (const q of z.ahaIds) {
    const bx = _m6rBuendelX(Math.floor(q.k / 5)), p = _m6rKartePos(q.id);
    _bioFxRundRect(ctx, bx - 4, yc - K.SH - 3, 26, 2 * K.SH + 6, 5); ctx.stroke();
    _bioFxRundRect(ctx, p.x - 1.5, p.y - 1.5, K.KW + 3, K.KH + 3, 4); ctx.stroke();
    ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(p.x + K.KW + 1.5, p.y + K.KH / 2); ctx.lineTo(bx - 4, yc); ctx.stroke();
    ctx.setLineDash([]); ctx.lineWidth = 2.2;
  }
  ctx.restore();
}
function _m6rDraw(ctx, cv) {
  if (!_m6r) return;
  const z = _m6r, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6rTisch(ctx);
  _m6rPapier(ctx);
  _bioFxDraw(ctx, z.fx);                           // Lichtringe hinter den Strichen
  for (let a = 0; a < 4; a++) {
    _m6rStricheZeichnen(ctx, a);
    _m6rFeldZeichnen(ctx, a);
    _m6rZaehlZeichnen(ctx, a);
  }
  _m6rAhaZeichnen(ctx);
  _m6rFluege(ctx);
  if (z.halt) _m6rHaltSchild(ctx);
  if (z.pause) _m6rPauseSchild(ctx);
}
// Schild beim Halt, unter der Strichliste
function _m6rHaltSchild(ctx) {
  const K = _m6rK, x0 = 200, x1 = 398, y0 = 218, y1 = 240;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 6); ctx.fill();
  ctx.strokeStyle = K.F_LICHT; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 6); ctx.stroke();
  _m6rText(ctx, 'Jetzt kommt der Querstrich.', (x0 + x1) / 2, y0 + 15.5, 13, '#ffffff');
  ctx.restore();
}
// Schild „Pause“ oben links – gleiche Stelle, Groesse und Farbe wie in
// m5-plus-schriftlich. Leuchtet kurz auf, wenn waehrend der Pause ein Knopf
// gedrueckt wird. Endet ueber dem Tisch (y = 33 < 38).
function _m6rPauseSchild(ctx) {
  const z = _m6r, w = 64, h = 25, x = 8, y = 8;
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
