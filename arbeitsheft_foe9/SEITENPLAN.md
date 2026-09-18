# Förderheft 9 · Gesamtschule NRW — Seitenplan (zur Freigabe)

Stand 05.09.2026. Grundlage: Schritt-1-Analyse aller 27 Lerneinheiten von
FeLabs 9 Gesamtschule (`analyse_schritt1.json`) plus **sechs** adversariale
Prüfungen (Umfang, Kompetenzen, Fachwörter, Reziprozität, Heft-gegen-Sim,
E-Kurs/Reihenfolge). Alle sechs meldeten Mängel; dieser Plan löst sie auf.
**Nichts wird ausformuliert, bevor er freigegeben ist.**

Rahmen aus dem Ausgangsheft: Nour und Jannis sind vierzehn und bauen mit
Herrn Kessler die **Bühne fürs Sommerfest** — Podeste, Traversen, ein Klavier
muss hoch.

## Umfang (gemessen, nicht geschätzt)

| | Original FeLabs 9 | Förderheft 9 |
|---|---|---|
| Lerneinheiten | 27 | **25** (2 Zusammenlegungen) |
| Schülerseiten | 101 (gezählt) | **59** |
| Wörter im Schülerteil | 15 806 (gemessen) | ≤ 9 500 |
| Reduktion | — | **−41,6 % Seiten · −39,9 % Wörter** (Ziel 35–50 % ✓) |
| Lösungen | im Heft | **separater Lehrerband** (~30 S.) |

Seitenrechnung: Deckblatt 1 · So arbeitest du 1 · Inhalt 1 · Trenner 2 ·
25 Doppelseiten 50 · 2 Fördertests 4 = **59**.

> **Das Wortbudget ist diesmal verbindlich: höchstens 380 Wörter je Doppelseite.**
> Der Umfangsprüfer hat nachgewiesen, dass der Korridor an zwei Zahlen hängt —
> an der Seitenzahl *und* am Gewicht. Nachgemessen: Band 7 liegt bei Median 363,
> **Band 8 bei 451 (+24 %)**. Mit Band-8-Gewicht verfehlt Band 9 den Korridor
> (25 × 451 = 11 275 Wörter = nur −28,7 %). `pruefe_profil.py` misst das Gewicht
> jetzt und weist es aus.

## Kapitel 1 · Kräfte auf der Bühne (14 Einheiten, Kennung `fk`)

Alle 14 Einheiten bleiben einzeln — Kapitel 1 baut streng aufeinander auf
(Kraft → Gewichtskraft → Druck → Auftrieb), und jede Zusammenlegung riss im
Entwurf entweder das Fachwortlimit oder eine Voraussetzung.

| Nr | Kennung | Aus | Simulation | Entscheidung |
|---|---|---|---|---|
| 1 | fk1 | kf1 | kraft-wirkung | vereinfachen. **E1 anders sichern:** E1 heißt „Fragestellungen erkennen", nicht „beobachten" (das wäre E2). Die Erkennen-Aufgabe gibt drei Fragen vor — eine, die der Bildschirm beantworten kann, zwei, die er nicht kann. Beispielzeile der Tabelle ist **„Bewegen"**, nicht „Verformen": nur dort nennt die Statuszeile das Ergebnis wörtlich. Abbremsen kommt am Bildschirm nicht vor und bleibt Alltagsaufgabe |
| 2 | fk2 | kf2 | kraftmesser | vereinfachen: Kraft ablesen in Newton |
| 3 | fk3 | kf3 | federgesetz | vereinfachen: mehr Kraft → längere Feder; harte und weiche Feder vergleichen. Keine Formel |
| 4 | fk4 | kf4 | masse-gewicht | vereinfachen. Leitplanke: Masse und Gewichtskraft nie gleichsetzen |
| 5 | fk5 | kf5 | ortsfaktor | vereinfachen: Erde 9,8 N/kg, Mond kleiner. **Nur ablesen, nie rechnen** |
| 6 | fk6 | kf6 | kraftpfeil | vereinfachen: Pfeil zeigt Richtung, Länge zeigt Größe. Trägt K4 |
| 7 | fk7 | kf7 | kraefte-addieren | vereinfachen: gleiche Richtung addieren, Gegenrichtung abziehen |
| 8 | fk8 | kf8 | kraefte-gleichgewicht | vereinfachen. **Zwei Statusformate:** Die Sim liefert bei „zu wenig Haltekraft" nur „Haltekraft 4 N unten.", bei „zu viel" den vollen Satz. Die Spalte fragt deshalb „Was passiert mit der Lampe?", nicht nach der Gesamtkraft. Leitplanke: Gleichgewicht heißt resultierende Kraft null, nicht „keine Kräfte" |
| 9 | fk9 | kf9 | traegheit-rs | vereinfachen. **Führt „Tempo v in m/s" ein** (erste Verwendung im Band) |
| 10 | fk10 | kf10 | wechselwirkung | vereinfachen. Verweist auf fk9 zurück. Der Bildschirm schreibt hier „Geschwindigkeit" — im Heft durchgehend „Tempo v", der Lehrerteil nennt beide Wörter |
| 11 | fk11 | kf11 | druck-flaeche | vereinfachen: gleiche Kraft, kleinere Fläche → größerer Druck |
| 12 | fk12 | kf12 | schweredruck | vereinfachen: tiefer → mehr Druck; schwerere Flüssigkeit → mehr Druck. **Ohne das Wort „Dichte"** — es gehört fk13 |
| 13 | fk13 | kf13 | dichte | vereinfachen. **Führt „Dichte ρ" ein.** Die Wasser-Zeile entfällt: Der Bildschirm fällt dort kein Urteil („Wasser ist der Bezugsstoff"), nur die anderen Stoffe tragen „schwimmt/sinkt" |
| 14 | fk14 | kf14 | auftrieb | vereinfachen: unter 1000 kg/m³ schwimmt es |

Fördertest Kapitel 1 (13 Punkte, 2 Seiten).

## Kapitel 2 · Arbeit, Energie und Maschinen (11 Einheiten, Kennung `fe`)

| Nr | Kennung | Aus | Simulation | Entscheidung |
|---|---|---|---|---|
| 15 | fe1 | el1 | arbeit | vereinfachen: W = F · s, nur Tragen gegen Schieben |
| 16 | fe2 | el2 | lageenergie | vereinfachen: höher oder schwerer → mehr Lageenergie |
| 17 | fe3 | el3 | bewegungsenergie | vereinfachen: doppelte Masse → doppelt, doppeltes Tempo → viermal. Verweist für „Tempo v" auf fk9 |
| 18 | fe4 | el4 | energieerhaltung | **neu zugeschnitten** (Messung, siehe unten). Keine Tabelle mit Ablesepunkten; abgelesen wird nur der Startzustand und die Bewegung der zwei Balken, ausdrücklich nur solange „noch kein Aufprall" am Bildschirm steht. Beide Regler bleiben unberührt. Merksatz: „Beim Fallen wird die Lageenergie kleiner und die Bewegungsenergie größer." Der Erhaltungssatz steht im Fachtext, nicht in der Lücke |
| 19 | fe5 | el5 | energie-entwerten | vereinfachen: nur die Kette „Benzin → Fahrt", 1000 J. Leitplanke: Energie bleibt erhalten, wird aber entwertet |
| 20 | fe6 | el6 | leistung-rs | vereinfachen: P = W / t; halbe Zeit → doppelte Leistung, gleiche Arbeit |
| 21 | fe7 | el7 | wirkungsgrad | vereinfachen. **B3 richtig stellen:** B3 heißt „Werte und Normen berücksichtigen" — die Erklär-Aufgabe fragt nicht nach dem günstigeren Preis (das wäre B2), sondern: „Die alte Lampe geht noch. Ist es richtig, sie trotzdem zu tauschen?" |
| 22 | fe8 | el8 | hebel | vereinfachen: langer Kraftarm → kleine Kraft, aber langer Weg. **Fachwortlimit:** nur Hebel und Kraftarm l₁; Kraftweg, Lastweg und Drehpunkt bleiben Alltagswörter mit Begriffssatz |
| 23 | fe9 | el9+el10 | flaschenzug | **zusammengelegt**, Träger el10. Die Faktenlage trägt es: n = 1 → 600,0 N / 2,0 m samt „Eine feste Rolle spart keine Kraft. Sie dreht nur die Richtung um.", n = 2 → 300,0 N / 4,0 m / 1200,0 J. Die feste-Rolle-Sim wird Anwendungsabschnitt mit Bild, ohne eigene Aufgabe und ohne QR. **Die 0-%/50-%-Aufgabe entfällt** — `flaschenzug.json` hat keine „gespart"-Zeile. E8 (einziger Träger) bleibt über den Alltagsauftrag „Zähle die Seilstücke am Baukran". Fachwörter: feste Rolle · lose Rolle |
| 24 | fe10 | el11 | zahnrad | vereinfachen: wenige Zähne → schnelle Drehung |
| 25 | fe11 | el12+el13 | schiefe-ebene | **zusammengelegt** — beide benutzen dieselbe Simulation. EIN Lernziel: flachere Rampe → kleinere Zugkraft, dafür längerer Weg. Merksatz-Lücken: „kleiner" und „Weg". Die goldene Regel wird hier **nicht** neu eingeführt, sondern auf fe9 zurückverwiesen. Der eine Erklär-Slot gehört der el12-Aufgabe („Nour kann höchstens 2 N ziehen. Welche Rampe muss sie nehmen?") |

Fördertest Kapitel 2 (13 Punkte, 2 Seiten).

## Was die sechs Prüfer aufgedeckt haben — und wie es hier gelöst ist

**Drei Wörter wurden doppelt eingeführt** (Verstoß gegen Zählregel 4). Verbindlich:
- *Dichte ρ* → **fk13** (die Einheit, die davon handelt). fk12 spricht von der
  „schwereren Flüssigkeit", ohne das Wort zu brauchen.
- *goldene Regel der Mechanik* → **auf der Schülerseite gar nicht als Name.**
  Beim Zusammenstellen der Zuteilung zeigte sich der sauberere Weg: Der Ausdruck
  ist ein drittes Fachwort, das keine der beiden Einheiten frei hat. Auf fe9 und
  fe11 steht deshalb nur die **Sache** — „Was du an Kraft sparst, zahlst du am
  Weg zurück" (so schreibt es auch der Bildschirm). Der **Name** steht im
  Lehrerband. Damit ist die Kollision aufgelöst, ohne dass Inhalt verlorengeht.
- *Tempo v in m/s* → **fk9**. fk10 und fe3 verweisen zurück.

**el9/el10 war nur einseitig markiert** — genau der Heft-8-Fehler. Entschieden:
zusammenlegen, Träger el10 (siehe fe9).

**E1 war ein sechster, ungezählter Einzelträger** (kf1) und die geplante
Sicherung war fachlich falsch. Behoben, siehe fk1.

**el4 kann sein Lernziel nicht tragen.** Nachgemessen: Die Simulation hat keine
Knöpfe, keine Statuszeile, keine Pause — und die Energiesumme fällt bei jedem
Aufprall um rund 28 % (392 → 282 → 203 → 144 J). Der Erhaltungssatz ist am
Bildschirm also *widerlegt*. Neu zugeschnitten, siehe fe4.

**Der Ortsfaktor steht im Band mit zwei Zahlen:** `masse-gewicht` und
`ortsfaktor` zeigen **9,8 N/kg**, `druck-flaeche`, `schweredruck`, `dichte` und
`auftrieb` rechnen mit **9,81** (75/42/32/74 Treffer). Die Förderseiten lesen
nur ab und rechnen nie mit g — für die Lernenden entsteht der Widerspruch
deshalb nicht. Der Lehrerband nennt ihn.

## Gesicherte Einzelträger-Kompetenzen

Sechs Codes hängen an genau einer Einheit: **E1** (kf1) · **E7** (el4) ·
**E8** (el9/el10) · **B3** (el7) · **K4** (kf6, zweiter Träger el13) ·
**B1** (mehrfach, unkritisch). Jeder ist oben namentlich gesichert.

## Vorschlag: dritte Kategorie in der Fachwort-Zählregel

Der Fachwortprüfer hat eine Lücke gezeigt: Das Profil kennt „zählt" und
„Gerätename", aber nicht **Alltagswörter ohne Formelzeichen und ohne Einheit**
(Form, Tempo, Richtung, Höhe, Last, Weg, Zähne, Seilstück). Ohne sie reißt
schon fk1 das Limit. Vorschlag als Regel 5:

> Alltagswörter ohne Formelzeichen und ohne Einheit zählen nicht. Sie bekommen
> im Alltagsteil einen Begriffssatz und stehen nicht in der Wortbank. Sobald
> ein Formelzeichen oder eine Einheit dazukommt, zählen sie wieder
> (*Tempo* frei — *Tempo v in m/s* zählt).

## Entscheidungen — am 05.09.2026 von Abdullah freigegeben

1. ✅ **Seitenplan freigegeben.** Alle 25 Einheiten werden ausformuliert.
2. ✅ **Schiefe Ebene bleibt drin** als eine zusammengelegte Doppelseite (fe11).
   Die E-Kurs-Frage bleibt fachlich offen: `plan.py` markiert nur el12, der
   Docstring liest sich weiter. Wenn der Kernlehrplan (Heft 3108) einmal im
   Projekt liegt, gehört das nachgeprüft — dann wären es 24 Einheiten.
3. ✅ **Regel 5** (Alltagswörter ohne Formelzeichen und Einheit zählen nicht)
   in `../arbeitsheft_foe7/FOERDER_PROFIL.md` aufgenommen, gilt für alle Bände.
4. ✅ **Wortbudget 380** je Doppelseite verbindlich; `pruefe_profil.py` meldet
   jede Überschreitung (`BUDGET = 380`).

## Fachwort-Zuteilung (verbindlich, jedes Wort genau einmal im Band)

fk1 Kraft + Wirkung · fk2 Newton (N) · fk3 — · fk4 Masse m in kg +
Gewichtskraft F_G · fk5 Ortsfaktor g in N/kg · fk6 Kraftpfeil · fk7 — ·
fk8 Kräftegleichgewicht · fk9 Trägheit + Tempo v in m/s · fk10 Wechselwirkung ·
fk11 Druck p in Pascal + Fläche A · fk12 Schweredruck · fk13 Dichte ρ +
Volumen V · fk14 Auftrieb · fe1 Arbeit W in Joule · fe2 Lageenergie ·
fe3 Bewegungsenergie · fe4 Energieerhaltung · fe5 entwertet ·
fe6 Leistung P in Watt · fe7 Wirkungsgrad · fe8 Hebel + Kraftarm ·
fe9 feste Rolle + lose Rolle · fe10 Drehzahl · fe11 schiefe Ebene.

Zusammen 30 neue Fachwörter auf 25 Einheiten, keine Einheit über zwei.
Gerätenamen (Kraftmesser) zählen nach Regel 2 nicht, Alltagswörter (Form,
Tempo, Höhe, Last, Weg, Zähne, Seilstück, Drehpunkt) nach Regel 5 nicht.

## Noch nicht geklärt

Die Einstiegsbilder von FeLabs 9 sind wie in Band 7 und 8 Platzhalter. Das
Förderheft 9 erbt sie, bis eigene Bilder da sind.
