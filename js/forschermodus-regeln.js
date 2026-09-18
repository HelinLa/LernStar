// ============================================================================
//  forschermodus-regeln.js  –  ERZEUGT, NICHT VON HAND AENDERN
//  Quelle: die umgeschriebenen Forscherseiten; erzeugt von
//  simcheck/forschermodus_bauen.py
//
//  SEITEN: welche HEFTSEITE ihre Simulation im Forschermodus oeffnet.
//  REGELN: was je Simulation verdeckt (weg) oder ersetzt (maske) wird.
//  BEDIENUNG: womit ein Pruefer die Simulation in den Zustand bringt, in
//  dem die Masken greifen (nur fuer simcheck, nicht fuer die App).
// ============================================================================
'use strict';

const FELABS_FORSCHEN_SEITEN = {
  el10: "flaschenzug",
  el11: "zahnrad",
  el2: "lageenergie",
  el3: "bewegungsenergie",
  el5: "energie-entwerten",
  el6: "leistung-rs",
  el7: "wirkungsgrad",
  el8: "hebel",
  el9: "feste-rolle",
  kf11: "druck-flaeche",
  kf12: "schweredruck",
  kf13: "dichte",
  kf3: "federgesetz",
  kf4: "masse-gewicht",
  kf7: "kraefte-addieren",
  ki3: "beschleunigung-ef",
  ki4: "beschleunigung-ef",
  la1: "ladungen-kraft",
  st8: "ohm-kennlinie",
};

const FELABS_FORSCHEN_REGELN = {
  "beschleunigung-ef": {
    weg: [".bef-sim > .sim-hint", "#befFit .fpm-note"],
    maske: [
      { sel: "#befALbl", re: /^[\d,]+ m\/s²$/, mit: "verdeckt" },
      { sel: "#befStatus", re: /\s*bei a = [\d,]+ m\/s²/, mit: "" },
      { sel: "#befFit", re: / · erwartet: [\d,.]+/g, mit: "" },
      { sel: "#befFit", re: /&nbsp;·&nbsp; Literatur: [\d,.]+/g, mit: "" },
      { sel: "#befFit", re: /<span class="fpm-badge [^"]*">Abweichung[^<]*<\/span>/g, mit: "" },
      { sel: "#befFit", re: /a = [\d,]+ m\/s²/g, mit: "deine Fahrt" },
    ],
    hinweis: "Miss selbst: mindestens fünf Zeiten stoppen, dann die Steigung der t-v-Geraden bestimmen.",
  },
  "bewegungsenergie": {
    weg: [".fpm-grid .fpm-note", ".fpm-tabs", ".fpm-grid2", ".fpm-sim > .sim-hint"],
    maske: [
      { sel: "#bgeStatus", re: /<br>E = ½ · [\d.,]+ · [\d.,]+² = <b>[\d.,]+ J<\/b>/, mit: "" },
      { sel: ".fpm-label", re: /Auswertung – in welcher Auftragung liegen die Punkte auf einer Ursprungsgeraden\?/, mit: "Auswertung – erst nach deiner eigenen Rechnung" },
    ],
    hinweis: "Miss selbst: bei fester Masse drei Tempi aufnehmen, dann in deiner Tabelle E : v² ausrechnen.",
  },
  "dichte": {
    weg: [".dch-sim > .sim-hint", ".dch-sim .fpm-grid .fpm-note", ".dch-sim .ab-wrap"],
    maske: [
      { sel: "#dchStatus", re: /m = ρ · V<br>m = \d+ kg\/m³ · [\d,]+ m³<br>/, mit: "" },
      { sel: "#dchStatus", re: /<br><br><b>4 · [\s\S]*$/, mit: "" },
      { sel: ".dch-sim .sim-btn-row + .sim-btn-row button", re: /Wasser · genau 1 kg/, mit: "Wasser · 10 cm" },
    ],
    hinweis: "Miss selbst: drei Kantenlängen einstellen, V und m ablesen, dann m : V ausrechnen.",
  },
  "druck-flaeche": {
    weg: [".dru-sim > .sim-hint", ".dru-sim .ab-body"],
    maske: [
      { sel: "#druStatus", re: /p = F \/ A = [^<]*<br>/, mit: "" },
      { sel: "#druStatus", re: /<b>Zum Vergleich<\/b><br>[\s\S]*$/, mit: "" },
      { sel: ".dru-sim .fpm-grid .fpm-note", re: /<b>Die Einheit:<\/b>[\s\S]*$/, mit: "<b>Die Maßeinheit:</b> Der Druck wird hier in Kilopascal angegeben (1 kPa = 1000 Pa)." },
    ],
    hinweis: "Miss selbst: vier Flächen einstellen, den Druck ablesen, dann p mal A ausrechnen.",
  },
  "energie-entwerten": {
    weg: [".fpm-grid .fpm-note", ".fpm-sim > .sim-hint"],
    maske: [
      { sel: ".sim-h3", re: /Wenn Energie nie verloren geht – warum soll man dann sparen\?/, mit: "Was ist am Ende einer Energiekette noch zu gebrauchen?" },
      { sel: ".fpm-sim > .fpm-note", re: /Zähle unten mit: die Gesamtmenge bleibt bei 1000 J[^<]*/, mit: "Lies nach jedem Schritt beide Zahlen ab." },
      { sel: "#eewStatus", re: /zusammen immer noch \d+ J – keine ist verschwunden\./, mit: "Trage beide Zahlen in deine Tabelle ein." },
      { sel: "#eewStatus", re: /<br><span style="color:#b91c1c">[\s\S]*?<\/span>/, mit: "" },
    ],
    hinweis: "Miss selbst: alle vier Schritte durchgehen, nutzbar und Wärme ablesen, dann beides zusammenzählen.",
  },
  "federgesetz": {
    weg: [".fed-sim .fpm-grid .fpm-note", ".fed-sim > .sim-hint"],
    maske: [
      { sel: ".fed-sim > .fpm-note", re: /\s*Ab zwei Punkten legt die Simulation[^<]*?Federhärte D\./, mit: " Ab zwei Punkten legt die Simulation die Ausgleichsgerade hindurch." },
      { sel: "#fedStatus", re: /\s*·\s*Ausgleichsgerade durch (\d+) Punkte: <b>Steigung D = [^<]*<\/b>/, mit: " · Ausgleichsgerade durch $1 Punkte" },
    ],
    hinweis: "Miss selbst: mindestens fünf Messpunkte aufnehmen, dann in deiner Tabelle F : s ausrechnen.",
  },
  "feste-rolle": {
    weg: [".rol-sim .fpm-grid .fpm-note", ".rol-sim > .sim-hint", ".rol-sim .ab-body"],
    maske: [
      { sel: "#rolStatus", re: /Die Rolle hängt[^<]*\. Die Last hängt an <b>\w+<\/b> Seilstück\w*,[^<]*\.<br>/, mit: "Zähle selbst, an wie vielen Seilstücken die Last hängt.<br>" },
      { sel: "#rolStatus", re: /F = G(?: : 2 = [\d,]+ N : 2)? = <b>/, mit: "F = <b>" },
      { sel: "#rolStatus", re: /\s*(?: )?→ gespart: [\d,]+ %/, mit: "" },
      { sel: "#rolStatus", re: /(?:Beide Seilstücke müssen um h kürzer werden\.<br>)?s = (?:h|2 · h = 2 · [\d,]+ m) = <b>/, mit: "s = <b>" },
      { sel: "#rolStatus", re: /<b>Der Vergleich bei [\s\S]*$/, mit: "" },
    ],
    hinweis: "Miss selbst: drei Lasten an der festen Rolle einstellen, dann F geteilt durch G ausrechnen.",
  },
  "flaschenzug": {
    weg: [".flz-sim .fpm-grid .fpm-note", ".flz-sim > .sim-hint", ".flz-sim .sim-btn-row", ".flz-sim .ab-body"],
    maske: [
      { sel: "#flzStatus", re: /F = G \/ n<br>F = [\d.,]+ N \/ \d+ = /, mit: "Zugkraft F = " },
      { sel: "#flzStatus", re: /s = n · h<br>s = \d+ · [\d,]+ m = /, mit: "Zugweg s = " },
      { sel: "#flzStatus", re: /<b>4 · Die Arbeit bleibt gleich<\/b><br>[\s\S]*$/, mit: "" },
    ],
    hinweis: "Miss selbst: vier Seilzahlen einstellen, F und s ablesen, dann F · s ausrechnen.",
  },
  "hebel": {
    weg: ["#hebStatus", ".heb-sim .fpm-grid div.fpm-label", ".heb-sim .fpm-grid .fpm-note", ".heb-sim > .sim-hint", ".heb-sim .ab-body"],
    maske: [
      { sel: ".heb-sim .sim-btn-row .sim-btn", re: /gleich lang – nichts gespart/, mit: "Kraftarm 0,25 m" },
      { sel: ".heb-sim .sim-btn-row .sim-btn", re: /doppelt so lang – halbe Kraft/, mit: "Kraftarm 0,50 m" },
      { sel: ".heb-sim .sim-btn-row .sim-btn", re: /achtfach – ein Achtel der Kraft/, mit: "Kraftarm 2,00 m" },
      { sel: ".heb-sim .ab-summary", re: /Der Hebel – Kraft sparen, Weg bezahlen/, mit: "Der Hebel" },
    ],
    hinweis: "Miss selbst: vier Kraftarme einstellen, die Kraft im Bild ablesen, dann Kraft mal Kraftarm rechnen.",
  },
  "kraefte-addieren": {
    weg: [".kad-sim .fpm-grid .fpm-note", ".kad-sim > .sim-hint", ".kad-sim .ab-body"],
    maske: [
      { sel: "#kadStatus", re: /\s*(?:Beide zeigen [a-zä]+ →|Entgegengesetzt →|Gleich groß, entgegengesetzt →)[\s\S]*$/, mit: "" },
    ],
    hinweis: "Miss selbst: F2 festhalten, F1 in drei Stufen einstellen, einmal umdrehen und dann F1 + F2 rechnen.",
  },
  "ladungen-kraft": {
    weg: [".ldk-sim .fpm-grid .fpm-note", ".ldk-sim > .sim-hint"],
    maske: [
      { sel: "#ldkStatus", re: /F = k · q · q \/ r²[\s\S]*?<b>([^<]*)<\/b>/, mit: "Kraft F = <b>$1</b>" },
      { sel: "#ldkStatus", re: /<b>Der Abstand zählt doppelt[\s\S]*$/, mit: "" },
    ],
    hinweis: "Vorzeichen und Ladungsmenge untersuchen – die Rechnung mit dem Abstand kommt erst in der Oberstufe.",
  },
  "lageenergie": {
    weg: [".fpm-sim > .sim-hint", ".fpm-sim .fpm-grid .fpm-note"],
    maske: [
      { sel: "#lgeStatus", re: /^Hubarbeit beim Hochheben: [^<]*<br>Lageenergie oben: <b>[\d,]+ J<\/b><br>/, mit: "" },
    ],
    hinweis: "Miss selbst: drei Höhen fallen lassen, die Pfahltiefe ablesen, dann Tiefe : Höhe ausrechnen.",
  },
  "leistung-rs": {
    weg: [".fpm-sim > .sim-hint"],
    maske: [
      { sel: "#lrsStatus", re: /^\s*Arbeit W = [\d,]+ kg · [\d,]+ N\/kg · [\d,]+ m = <b>[\d,]+ J<\/b><br>\s*/, mit: "" },
      { sel: "#lrsStatus", re: /Leistung P = [\d,]+ J \/ [\d,]+ s = /, mit: "Leistung P = " },
      { sel: ".fpm-sim > .fpm-note", re: /\s*–\s*die Arbeit bleibt also dieselbe\./, mit: "." },
    ],
    hinweis: "Miss selbst: vier Zeiten einstellen, die Leistung ablesen, dann P mal t ausrechnen.",
  },
  "masse-gewicht": {
    weg: [".mgw-sim .fpm-grid .fpm-note", ".mgw-sim > .sim-hint", ".mgw-sim .ab-body"],
    maske: [
      { sel: "#mgwStatus", re: /<b>F = m · g = /, mit: "<b>F = " },
    ],
    hinweis: "Miss selbst: drei Körper wählen, Masse und Kraft ablesen, dann F : m ausrechnen.",
  },
  "ohm-kennlinie": {
    weg: [".ohg-sim .fpm-grid .fpm-note", ".ohg-sim > .sim-hint"],
    maske: [
      { sel: "#ohgRklein", re: /^10 Ω$/, mit: "Draht A" },
      { sel: "#ohgRgross", re: /^20 Ω$/, mit: "Draht B" },
      { sel: "#ohgStatus", re: /\s*·\s*R = U\/I = [\d,.]+ Ω/, mit: "" },
      { sel: "#ohgStatus", re: /\s*Widerstand fest: [\d,.]+ Ω\./, mit: " Der Draht bleibt derselbe." },
      { sel: "#ohgTable", re: /<td>R = U\/I<\/td>/, mit: "<td>U : I</td>" },
    ],
    hinweis: "Miss selbst: fünf Spannungen einstellen, Messpunkte eintragen, dann U : I ausrechnen.",
  },
  "schweredruck": {
    weg: [".swd-sim > .sim-hint", ".swd-sim .fpm-grid .fpm-note", ".swd-sim .ab-body"],
    maske: [
      { sel: "#swdStatus", re: /p = ρ · g · h<br>p = [\d.]+ kg\/m³ · 9,81 N\/kg · \d+ m<br>/, mit: "" },
      { sel: "#swdStatus", re: /<b>Die Zehn-Meter-Regel<\/b><br>[\s\S]*?an der Oberfläche\.<br><br>/, mit: "" },
      { sel: ".swd-sim .sim-btn-row .sim-btn", re: /10 m – doppelter Druck/, mit: "10 m" },
    ],
    hinweis: "Miss selbst: drei Tiefen einstellen, den Schweredruck ablesen, dann p : h ausrechnen.",
  },
  "wirkungsgrad": {
    weg: [".fpm-sim > .sim-hint", ".fpm-sim .fpm-grid .fpm-note"],
    maske: [
      { sel: "#wgrStatus", re: /\s*·\s*η = <b>[\d,]+ %<\/b>/, mit: "" },
      { sel: "#wgrStatus", re: /als Wärme verloren:/, mit: "als Verlust:" },
    ],
    hinweis: "Miss selbst: an der LED-Lampe vier Energien einstellen, das Licht ablesen, dann Licht : hinein ausrechnen.",
  },
  "zahnrad": {
    weg: [".znr-sim > .sim-hint", ".znr-sim .fpm-grid .fpm-note", "#znrStatus", ".znr-sim .ab-wrap"],
    maske: [
      { sel: ".znr-sim .sim-btn-row .sim-btn", re: /klein treibt groß – langsamer, kräftiger/, mit: "klein treibt groß" },
      { sel: ".znr-sim .sim-btn-row .sim-btn", re: /groß treibt klein – schneller/, mit: "groß treibt klein" },
      { sel: ".znr-sim .sim-btn-row .sim-btn", re: /40 auf 10 – vierfach schnell/, mit: "40 auf 10 Zähne" },
    ],
    hinweis: "Miss selbst: Rad 2 dreimal anders einstellen, n₂ ablesen, dann n₂ mal z₂ ausrechnen.",
  },
};

const FELABS_FORSCHEN_BEDIENUNG = {
 "federgesetz": "_fedSetFeder('weich'); _fedHaenge(100); _fedMessen(); _fedHaenge(100); _fedMessen();",
 "ohm-kennlinie": "_ohgSetR('klein'); _ohgU_(1); _ohgMessen(); _ohgU_(1); _ohgMessen();",
 "beschleunigung-ef": "_befSetA(2); _befMessen(); _befSetPreset(0);",
 "masse-gewicht": "_mgwSet(2); _mgwSet(3); _mgwSet(4);",
 "kraefte-addieren": "_kadB(1,-1); _kadB(1,-1); _kadB(1,1); _kadB(1,1); _kadB(1,1); _kadDir(1);",
 "druck-flaeche": "_druMarke(60, 150); _druSet('a', 400); _druMarke(60, 2800);",
 "schweredruck": "_swdFluid('oel'); _swdSet(30); _swdFluid('wasser'); _swdTiefe(20);",
 "dichte": "_dchStoff('styropor'); _dchSet('a', 5); _dchSet('a', 20); _dchSet('a', 10);",
 "lageenergie": "_lgeSet('m',9); _lgeSet('h',1); _lgeGo(); _lgeUpdate(1);",
 "bewegungsenergie": "_bgeSet('m',6); _bgeSet('v',3); _bgeMesspunkt();",
 "energie-entwerten": "_eewSet('strom'); _eewWeiter(); _eewWeiter(); _eewWeiter(); _eewWeiter();",
 "leistung-rs": "_lrsSet('m',50); _lrsSet('h',4); _lrsSet('t',3); _lrsGo();",
 "wirkungsgrad": "_wgrSet(1); _wgrVal(800); _wgrVal(1400); _wgrVal(2200); _wgrVal(3000);",
 "hebel": "_hebSet('f2', 200); _hebSet('l1', 0.40); _hebSet('l1', 0.80); _hebMarke(2);",
 "feste-rolle": "_rolMarke('fest'); _rolSet('g', 200); _rolSet('g', 500); _rolSet('g', 800); _rolMarke('lose');",
 "flaschenzug": "_flzSet('g', 900); _flzSet('n', 1); _flzSet('n', 4);",
 "zahnrad": "_znrSet('z1', 30); _znrSet('n1', 60); _znrSet('z2', 12); _znrSet('z2', 20); _znrSet('z2', 45);",
 "ladungen-kraft": "_ldkMarke(1,-1,10,6);"
};
