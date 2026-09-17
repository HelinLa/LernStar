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

const FELO_FORSCHEN_SEITEN = {
  kf3: "federgesetz",
  ki3: "beschleunigung-ef",
  ki4: "beschleunigung-ef",
  st8: "ohm-kennlinie",
};

const FELO_FORSCHEN_REGELN = {
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
  "federgesetz": {
    weg: [".fed-sim .fpm-grid .fpm-note", ".fed-sim > .sim-hint"],
    maske: [
      { sel: ".fed-sim > .fpm-note", re: /\s*Ab zwei Punkten legt die Simulation[^<]*?Federhärte D\./, mit: " Ab zwei Punkten legt die Simulation die Ausgleichsgerade hindurch." },
      { sel: "#fedStatus", re: /\s*·\s*Ausgleichsgerade durch (\d+) Punkte: <b>Steigung D = [^<]*<\/b>/, mit: " · Ausgleichsgerade durch $1 Punkte" },
    ],
    hinweis: "Miss selbst: mindestens fünf Messpunkte aufnehmen, dann in deiner Tabelle F : s ausrechnen.",
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
};

const FELO_FORSCHEN_BEDIENUNG = {
 "federgesetz": "_fedSetFeder('weich'); _fedHaenge(100); _fedMessen(); _fedHaenge(100); _fedMessen();",
 "ohm-kennlinie": "_ohgSetR('klein'); _ohgU_(1); _ohgMessen(); _ohgU_(1); _ohgMessen();",
 "beschleunigung-ef": "_befSetA(2); _befMessen(); _befSetPreset(0);"
};
