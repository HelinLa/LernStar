# Förderheft 8 · Gesamtschule NRW — Seitenplan (zur Freigabe)

Stand 05.09.2026. Grundlage: Schritt-1-Analyse aller 23 Lerneinheiten von
FELO 8 Gesamtschule (`analyse_schritt1.json`) plus fünf adversariale Prüfungen
(Umfang, Kompetenzen, Fachwörter, Reziprozität, Heft-gegen-Sim).
**Nichts wird ausformuliert, bevor dieser Plan freigegeben ist.**

Rahmen aus dem Ausgangsheft: Nour und Jannis, ein Jahr älter, richten die
**Fahrrad-AG** ein — Werkbank mit Netzteil, Kabeln und einer Kiste Bauteile.

## Umfang (gemessen, nicht geschätzt)

| | Original FELO 8 | Förderheft 8 |
|---|---|---|
| Lerneinheiten | 23 | **20** (3 Zusammenlegungen) |
| Schülerseiten | 91 (gezählt) | **49** |
| Wörter im Schülerteil | 13 111 (gemessen) | ≈ 7 080 |
| Reduktion | — | **−46 %** (Ziel 35–50 % ✓) |
| Lösungen | im Heft | **separater Lehrerband** (~24 S.) |

Seitenrechnung: Deckblatt 1 · So arbeitest du 1 · Inhalt 1 · Trenner 2 ·
20 Doppelseiten 40 · 2 Fördertests 4 = **49**.
Wörter: 20 × 354 (gemessener foe7-Median) = 7 080 gegen 13 111 → −46,0 %.

> Der Umfangsprüfer hat den Boden gemessen: Eine fertige Förderseite wiegt
> 310–404 Wörter (Median 354), davon 116 allein für die Pflichtblöcke Wortbank,
> Beispiel, Hilfen und Selbstcheck. Deshalb ist der Korridor **nur** mit
> Zusammenlegungen sicher zu halten — ohne sie lägen wir bei −38 % mit zwei
> Seiten Reserve.

## Kapitel 1 · Strom in der Werkstatt (13 Einheiten, Kennung `fs`)

| Nr | Kennung | Aus | Titel (Arbeitsstand) | Simulation | Entscheidung |
|---|---|---|---|---|---|
| 1 | fs1 | st1 | Das Knistern im Pullover | ladung | vereinfachen: nur die zwei belegten Zustände (A+/B− anziehen, beide− abstoßen). **Achtung:** Die Sim zeigt in Bildtexten kein „+/−“, nur „ungleiche/gleiche Ladung“ — Tabellenköpfe entsprechend. Influenz (Papierschnipsel) entfällt, die Sim zeigt sie nicht |
| 2 | fs2 | st2 | Zwei geladene Kugeln | ladungen-kraft | vereinfachen: nur „mehr Ladung → mehr Kraft“ und „doppelter Abstand → ein Viertel“; nC und µN nur ablesen, nicht rechnen |
| 3 | fs3 | st3 | Die Zahl mit dem V | spannung | vereinfachen: Spannung U in Volt ablesen, mehr Zellen → mehr Volt |
| 4 | fs4 | st4 | Wie viel fließt da? | stromstaerke | vereinfachen: Stromstärke I in Ampere; offener Kreis = 0 A |
| 5 | fs5 | st5 | Wohin kommt das Messgerät? | messen | vereinfachen: nur die Zuordnung Amperemeter → in Reihe, Voltmeter → parallel |
| 6 | fs6 | st6 | Was bremst den Strom? | widerstand | vereinfachen: großer Widerstand → kleiner Strom, bei 4,5 V. R = U/I entfällt |
| 7 | fs7 | st7 | Der lange dünne Draht | draht | vereinfachen: länger und dünner → mehr Widerstand |
| 8 | fs8 | st8 | Doppelte Spannung | ohm-kennlinie | vereinfachen: nur „doppelte Spannung, doppelter Strom“ an den belegten Werten (20 Ω: 1,5 V → 0,07 A · 3 V → 0,15 A). **Nur 10 Ω und 20 Ω verwenden** — 9 Ω und 30 Ω zeigt die Sim nicht |
| 9 | fs9 | st9 | Alles hintereinander | reihe-widerstand | vereinfachen: R addieren, Strom überall gleich. **Bedienhinweis Pflicht:** obere Knopfreihe stellt R₁, untere R₂ (gleiche Aufschriften!) |
| 10 | fs10 | st10 | Zwei Wege für den Strom | parallel-widerstand | vereinfachen: Zweigströme addieren sich zum Gesamtstrom |
| 11 | fs11 | st11 | Warum geht das Licht sofort an? | elektronen-drift | vereinfachen: langsames Wandern gegen schnelles Signal. **Werte wörtlich in m/s** („Signal: 200 000 000 m/s“, „Zappeln: 1 570 000 m/s“) — die Sim schreibt keine km/s |
| 12 | fs12 | st12 | Blitz und Donner | blitz | vereinfachen: Licht sofort, Schall 343 m/s — deshalb kommt der Donner später. Feldstärke entfällt |
| 13 | fs13 | st13+st14 | Wie viel Strom verträgt die Leitung? | elektrische-leistung | **zusammengelegt.** Träger st14 (Sicherung). P = U·I entfällt; es bleibt: Ströme addieren und mit 16 A vergleichen. **Nachgemessen (werte.js):** 1 Gerät 6 A · 2 Geräte 12 A · 3 Geräte 18 A → „Die Sicherung hat ausgelöst“. Die Leistungs-Sim liefert den Anwendungsabschnitt mit Bild, ohne eigene Aufgabe |

Fördertest Kapitel 1 (13 Punkte, 2 Seiten).

## Kapitel 2 · Wie schnell ist schnell? (7 Einheiten, Kennung `fb`)

| Nr | Kennung | Aus | Titel | Simulation | Entscheidung |
|---|---|---|---|---|---|
| 14 | fb1 | be1 | Wer ist schneller? | v-begriff | vereinfachen: gleiche Zeit, mehr Strecke → schneller |
| 15 | fb2 | be2+be3 | Messen und ausrechnen | v-messen | **zusammengelegt.** Beide trugen dieselbe Merksatz-Lücke `v = s / t`. **Nachgemessen:** Nach „Messung starten“ zeigt die Sim Stoppuhr und fertige Rechnung — langsam 10,0 s → 1,0 m/s · mittel 5,0 s → 2,0 m/s · schnell 2,0 s → 5,0 m/s. Drei Tabellenzeilen, alle belegt. v-formel liefert den Anwendungsabschnitt |
| 16 | fb3 | be4 | km/h oder m/s? | v-umrechnung | vereinfachen: Faktor 3,6, nur eine Richtung (m/s → km/h) |
| 17 | fb4 | be5+be7 | Was sagen die Abstände? | gleichfoermig-rs | **zusammengelegt.** EIN Lernziel: gleiche Abstände = gleich schnell, größere = schneller, kleinere = langsamer. Genau zwei neue Fachwörter (gleichförmig, beschleunigt). beschleunigung-rs als Anwendungsabschnitt mit Bild |
| 18 | fb5 | be6 | Die Linie im Weg-Zeit-Bild | weg-zeit-diagramm | vereinfachen: steil = schnell, flach = langsam, waagerecht = Stillstand |
| 19 | fb6 | be8 | Die Linie im Tempo-Bild | v-zeit-diagramm | vereinfachen: waagerecht = gleich schnell, steigend = schneller, fallend = langsamer |
| 20 | fb7 | be9 | Bis das Auto steht | bremsweg-jg9 | vereinfachen: Reaktionsweg + Bremsweg = Anhalteweg, bei 30/50/100 km/h ablesen |

Fördertest Kapitel 2 (13 Punkte, 2 Seiten).

> Kapitel 2 endet bei 7 Einheiten (fb1–fb7), Kapitel 1 bei 13 (fs1–fs13):
> zusammen **20 Doppelseiten** aus 23 Quelleinheiten.

## Was komplett aus dem Schülerheft wandert

- Alle 23 separaten Übungsseiten → die drei Aufgaben stecken in jeder Doppelseite
- Lösungen, Erwartungshorizonte, typische Fehler → Lehrerband
- Transferaufgaben AFB III → Lehrerband als optionales Zusatzblatt
- Kompetenzchips auf Schülerseiten → nur im Lehrerband
- Wortgitter/Kreuzworträtsel → entfallen (der Fördertest übernimmt)

## Gesicherte Einzelträger-Kompetenzen (aus der Prüfung)

Anders als bei Heft 7 tötet hier nicht das Verschmelzen die Kompetenz, sondern
der Schnitt **innerhalb** einer Einheit. Fünf Codes werden deshalb festgeschrieben:

- **K2** nur in be6 → gesichert über die **Tabelle und Aufgabe 1** von fb5
  (Ablesen, nicht Begründen). Die gestrichene MC-Zugfahrt wird nicht ersetzt.
- **B3** nur in st14 → gesichert auf fs13 als Erklären-Aufgabe („Warum schaltet
  die Sicherung ab, bevor das Kabel heiß wird?“). Der Erklär-Slot gehört B3 allein.
- **K4** (st8, be1, be4) → bleibt auf fs8 und fb3; auf fs8 über den Selbstcheck.
- **K3** (st8, be6) → bleibt über den Zuhause-Auftrag von fb5 (Weg-Zeit-Bild
  vom Schulweg, mit vorgedrucktem Achsenkreuz).
- **E4** (st1, be2) → bleibt auf fs1 (Luftballon zu Hause) und in fb2.

## Fachwort-Zählregel (Ergänzung zum FÖRDERPROFIL, vor der Freigabe zu klären)

Der Fachwortprüfer hat gezeigt, dass das Limit „höchstens zwei" ohne feste
Zählregel gar nicht prüfbar ist — vier Einheiten zählten anders als vier andere.
Vorschlag:

1. **Größe + Formelzeichen + Einheit = EIN Fachwort** („Spannung U in Volt“).
2. **Gerätenamen zählen nicht**, wenn sie im Alltagsteil einen Begriffssatz
   bekommen und weder in der Wortbank noch in einer Merksatz-Lücke stehen.
3. **Alles andere zählt** — auch Wörter, die „am Bildschirm stehen“.

Danach reißen sechs Einheiten das Limit und werden entlastet: fs4 (Stromkreis,
Schalter), fs10 (Gesamtstrom), fs11 (Elektron), fb2, fb4, fb7. Doppelte
Einführungen werden aufgelöst: *Gesamtstrom* nur auf fs10 (die Sim schreibt es
dort, auf st14 kommt es gar nicht vor), *konstant* und *Sekunden-Marke* nur auf fb4.

## Heft-gegen-Sim: was vor dem Schreiben feststeht

Alle 23 Faktendateien wurden geprüft. Zwei Befunde waren hart und sind durch
**Nachmessen aufgelöst** (`simcheck/werte.js`) — die Werte stehen jetzt unter
`nachgemessen` in `fakten/stromgefahren.json` und `fakten/v-messen.json`:

- **fs13:** Der dritte Zustand existiert (3 Geräte → 18 A, Sicherung löst aus).
  `simfakten` erreichte ihn nicht, weil es jedes Bedienelement nur einmal drückt.
- **fb2:** Zeit und Ergebnis erscheinen nach dem Lauf auf der Leinwand.
  `simfakten` fotografiert davor und sah nur „0,0s“.

Verbindlich außerdem: fs8 nur 10 Ω/20 Ω · fs11 Werte in m/s · fs9 Bedienhinweis
zu den zwei gleich beschrifteten Knopfreihen · fs1 ohne „+/−“ in den Tabellenköpfen.

## Entscheidungen — am 05.09.2026 von Abdullah freigegeben

1. ✅ **Seitenplan freigegeben.** Alle 20 Einheiten werden ausformuliert.
2. ✅ **Drei Zusammenlegungen**: fs13 = st13+st14, fb2 = be2+be3, fb4 = be5+be7.
   Damit 20 Einheiten, 49 Seiten, −46 %.
3. ✅ **Kennungen `fs` und `fb`** — gegen alle 46 vergebenen Präfixe geprüft.
4. ✅ **Fachwort-Zählregel** in `../arbeitsheft_foe7/FOERDER_PROFIL.md` aufgenommen,
   gilt für alle Bände. Heft 7 wurde rückwirkend geprüft: kein Verstoß —
   keine Einheit über zwei Wörtern, keine Doppeleinführung (32 Wörter auf 25 Einheiten).

## Fachwort-Zuteilung (verbindlich, jedes Wort genau einmal im Band)

fs1 Ladung · fs2 Kraft F · fs3 Spannung U in Volt · fs4 Stromstärke I in Ampere +
Stromkreis · fs5 in Reihe + parallel · fs6 Widerstand R in Ohm · fs7 — · fs8 — ·
fs9 Reihenschaltung + Gesamtwiderstand · fs10 Parallelschaltung + Gesamtstrom ·
fs11 Elektron · fs12 — · fs13 Sicherung · fb1 Geschwindigkeit · fb2 Strecke s +
Zeit t · fb3 km/h · fb4 gleichförmig + beschleunigt · fb5 Weg-Zeit-Diagramm ·
fb6 Tempo-Zeit-Diagramm · fb7 Reaktionsweg + Anhalteweg.

Zusammen 24 neue Fachwörter auf 20 Einheiten; Gerätenamen (Amperemeter,
Voltmeter, Stoppuhr) zählen nach Regel 2 nicht mit.

## Noch nicht geklärt

Die Einstiegsbilder von FELO 8 sind wie bei Band 7 **alle 23 Platzhalter**
(„Bild st1 folgt“). Das Förderheft 8 erbt sie, bis eigene Bilder da sind.
