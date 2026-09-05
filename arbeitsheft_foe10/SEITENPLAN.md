# Förderheft 10 · Gesamtschule NRW — Seitenplan (zur Freigabe)

Stand 05.09.2026. Grundlage: Schritt-1-Analyse aller 32 Lerneinheiten von
FELO 10 Gesamtschule (`analyse_schritt1.json`) plus **sieben** adversariale
Prüfungen (Umfang, Kompetenzen, Fachwörter, Reziprozität, Heft-gegen-Sim,
E-Kurs, Datenblattseiten). Alle sieben meldeten Mängel.
**Nichts wird ausformuliert, bevor dieser Plan freigegeben ist.**

Rahmen aus dem Ausgangsheft: Nour und Jannis sind fünfzehn und machen
**Praktikum** — Jannis bei den Stadtwerken, Nour in der Nuklearmedizin.

## Umfang (gemessen und nachgerechnet)

| | Original FELO 10 | Förderheft 10 |
|---|---|---|
| Lerneinheiten | 32 | **28** (4 Streichungen, 0 Zusammenlegungen) |
| Schülerseiten | 126 (gezählt) | **65** |
| Wörter im Schülerteil | 19 348 (gemessen) | ≤ 10 640 |
| Reduktion | — | **−48,4 % Seiten · −45,0 % Wörter** (Ziel 35–50 % ✓) |
| Lösungen | im Heft | **separater Lehrerband** (95 S., gemessen) |

Seitenrechnung: 3 + 2 Trenner + 56 + 4 = **65** — nach dem Satz nachgemessen und
bestätigt. Budget bleibt 380 Wörter je Doppelseite; gemessener Median 379, keine
Einheit darüber.

> **Warum keine Zusammenlegungen?** Der Entwurf schlug vier vor. Nachgerechnet:
> mit ihnen läge der Band bei N = 25, also **−53,2 % auf Seiten** — außerhalb
> des Korridors. Auch N = 26 fällt durch (−51,6 %), N = 27 sitzt exakt auf
> −50,0 % ohne Reserve. **N = 28 ist die erste Zahl, die beide Metriken mit
> Luft hält.** Band 10 ist der einzige der vier Förderbände, der seinen
> Korridor allein über Streichungen erreicht — er ist auch der größte.

## Die vier Streichungen: konsequent nach der E-Kurs-Regel

`arbeitsheft_gts10/plan.py` markiert **genau vier** Einheiten mit `"kurs": "E"`:
**ev5, ev15, rk8, rk14**. Ein Förderheft bedient den G-Kurs — also entfallen
alle vier. Der Entwurf strich nur drei und legte rk14 zusammen; das war der
einzige Ausreißer und ist hiermit vereinheitlicht.

Geprüft und unbedenklich: Die einzigen Einzelträger des Bandes sind **E7**
(nur rk5) und **K4** (nur rk17) — beide bleiben. B3 hat **zwei** Träger
(rk12 *und* rk17; rk17s Analyse zählte hier falsch). B2 behält nach rk14 noch
sechs G-Träger, E6 noch zehn, UF3 noch fünf, K2 noch vier.

Was aus den Gestrichenen erhalten bleibt:
- **ev5** → ihr Kern („Strom umpolen dreht die Kraft um") steht bereits wörtlich
  in ev4; ihr Alltagsauftrag wandert nach fv4 und trägt dort UF4.
- **ev15** → Inhalt stammt aus den Inhaltsfeldern 6 und 7, nicht aus 10.
- **rk8** → Alpha- und Betazerfall werden in fn7 (Halbwertszeit) als Merkwissen
  genannt, ohne eigene Bildschirmaufgabe.
- **rk14** → **Achtung, Reihenfolge:** rk13 benutzt heute das Wort *Dosis*,
  eingeführt wird es aber allein in rk14. Deshalb übernimmt **fn12 beide
  Fachwörter**: Dosisleistung H′ **und** Dosis H in Sievert.

## Kapitel 1 · Woher der Strom kommt (13 Einheiten, Kennung `fv`)

| Nr | Kennung | Aus | Simulation | Entscheidung |
|---|---|---|---|---|
| 1 | fv1 | ev1 | magnetfeld | vereinfachen. **Die Sim gibt keinen Messwert aus** — alle Statuszeilen sind leer. Die dritte Spalte wird angekreuzt (stark/mittel/schwach), nie als Zahl verlangt. Der Abstand steht ohne Einheit („Abstand 55"). Lernziel auf „am Ende des Magneten" umschreiben, dann entfällt *Pol* als drittes Fachwort |
| 2 | fv2 | ev2 | oersted | vereinfachen. Führt **Magnetfeld B in Mikrotesla (µT)** ein — die Sim schreibt µT 31-mal. *Stromstärke I in A* ist Rückverweis auf Förderband 8 (fs4), kein neuer Platz |
| 3 | fv3 | ev3 | elektromagnet | vereinfachen. **Die Tragkraft ist eine Zufallszahl** (±1 Klammer, in 14 Läufen gemessen: 1 A → 4 oder 5, 4 A → 17/18/19, 5 A → 22 oder 23). Es darf **kein fester Wert** als Lösung gedruckt werden — die Tabelle fragt „mehr oder weniger als vorher?". Ebenso Pflicht: Der Arbeitsschritt muss den Knopf „Stromstärke ändern" ausdrücklich nennen, sonst zeigt die Sim die Windungsreihe |
| 4 | fv4 | ev4 | leiterkraft | vereinfachen. Führt **Leiterlänge L in m** ein; B ist Rückverweis auf fv2. Nimmt den Alltagsauftrag von ev5 mit |
| 5 | fv5 | ev6 | elektromotor | vereinfachen |
| 6 | fv6 | ev7 | induktion-rs | vereinfachen. **Der Windungen-Regler ist brauchbar** — die Behauptung des Entwurfs, er zeige immer 0,000 V, wurde nachgemessen und widerlegt |
| 7 | fv7 | ev8 | generator | vereinfachen |
| 8 | fv8 | ev9 | transformator-schluessel | vereinfachen |
| 9 | fv9 | ev10 | freileitungen | vereinfachen: **warum Hochspannung?** (kleiner Strom → wenig Verlust) |
| 10 | fv10 | ev11 | freileitungen | vereinfachen: **der Weg vom Kraftwerk zur Steckdose**. Bleibt eigenständig; die zwei Einheiten teilen die Simulation, aber nicht das Lernziel — fv9 fragt nach dem Warum, fv10 nach dem Weg |
| 11 | fv11 | ev12 | — **Datenblatt** | vereinfachen. Dreischritt **ablesen – ordnen – beurteilen** (siehe unten). „Pumpspeicherkraftwerk" wird zu **„Pumpspeicher"** — das lange Wort fällt im Satz sonst auf 6,0 pt |
| 12 | fv12 | ev13 | wirkungsgrad | vereinfachen |
| 13 | fv13 | ev14 | stromkosten | vereinfachen |

Fördertest Kapitel 1 (13 Punkte, 2 Seiten).

## Kapitel 2 · Aus dem Atomkern (15 Einheiten, Kennung `fn`)

| Nr | Kennung | Aus | Simulation | Entscheidung |
|---|---|---|---|---|
| 14 | fn1 | rk1 | atombau-isotope | vereinfachen |
| 15 | fn2 | rk2 | geiger-mueller | vereinfachen: **das Zählrohr und seine Spannung**. Behält die Kennlinie — **0 V** ist als „Bereich I – Rekombination" belegt (NACHGEMESSEN 05.09.2026: `fakten/geiger-mueller.json` enthält 33 Reglerzustände — jeden 25-V-Schritt von 0 bis 700 plus 90, 265, 440, 615 V, aber **keinen bei 10 V**. Die frühere Angabe „10 V ist belegt" war falsch; der Regler kann 10 V, der Zustand wurde nur nie aufgenommen. Nicht wieder auf 10 V ändern, solange der Dump keinen solchen Zustand führt) |
| 16 | fn3 | rk3 | absorption-strahlung | vereinfachen: was hält Alpha, Beta, Gamma auf |
| 17 | fn4 | rk4 | ionisation | vereinfachen |
| 18 | fn5 | rk5 | geiger-mueller | vereinfachen: **die Impulshöhe bei 200 V gegen 450 V**. Bleibt eigenständig — **E7 hängt allein hier** („Modellgrenzen angeben", die Totzeit-Aufgabe). Sie darf **nicht** gestrichen werden, der Entwurf hatte genau das vor |
| 19 | fn6 | rk6 | zerfall-halbwertszeit | vereinfachen: Halbwertszeit, Zufall im Einzelnen |
| 20 | fn7 | rk7 | zerfall-halbwertszeit | vereinfachen: **Altersbestimmung**. Nennt Alpha- und Betazerfall als Merkwissen (Erbe von rk8) |
| 21 | fn8 | rk9 | kernspaltung | vereinfachen |
| 22 | fn9 | rk10 | kettenreaktion | vereinfachen: **Steuerstäbe und k**. Hier liegen die belegten Ablesestellen |
| 23 | fn10 | rk11 | kettenreaktion | vereinfachen: **Aufbau des Kraftwerks** (Wärme → Dampf → Turbine → Generator). Eigenes Lernziel, keine Dopplung mit fn9 |
| 24 | fn11 | rk12 | — **Datenblatt** | vereinfachen. Dreischritt ablesen – ordnen – beurteilen. Trägt B3 |
| 25 | fn12 | rk13 | strahlenschutz | vereinfachen: **Abstand schützt stärker als Blei**. Führt **beide** Wörter ein: Dosisleistung H′ und Dosis H in Sievert (Erbe von rk14) |
| 26 | fn13 | rk15 | — **Datenblatt** | vereinfachen. Die Rechnung 8 × 24 = 192 entfällt ersatzlos — zweistellig mal zweistellig ist für A2–B1 zu viel; entschieden wird über den Vergleich „6 Stunden gegen 8 Tage" |
| 27 | fn14 | rk16 | kernfusion | vereinfachen. Leitplanke: Fusion ist Verschmelzen, kein Verbrennen. Die Abstoßung der Kerne ist Rückverweis auf Förderband 8 |
| 28 | fn15 | rk17 | — **Datenblatt** | vereinfachen. **Trägt K4 als einziger im Band.** Dreischritt ablesen – ordnen – beurteilen; das „Auszählen" entfällt, es wäre Scheinrechnen |

Fördertest Kapitel 2 (13 Punkte, 2 Seiten).

## Die Datenblattseiten — vier Stück, mit eigenem Dreischritt

Neu in dieser Reihe. Der Renderer kann es seit heute: Abschnitt 3 heißt
**„AUSWERTEN & BEURTEILEN"**, das Datenblatt steht **neben** den Schritten
(nie darüber — sonst bleiben unten null Schreiblinien), es gibt **keinen
QR-Code** und keinen Simulations-Ersatzsatz.

**Der Dreischritt lautet bei qualitativen Datenblättern
„ablesen – ordnen/vergleichen – beurteilen".** Nicht „ablesen – rechnen –
beurteilen": Drei der vier Blätter tragen im Tabellenkörper gar keine oder
genau eine Zahl; ein erzwungener Rechenschritt wäre Scheinrechnen. Der
Operator **„Beurteile"** fehlte im Formprüfer und ist ergänzt (mit
„Entscheide" und „Begründe").

**Schriftgrad gemessen, nicht geschätzt.** Der Faktor 0,48 gilt auch hier: Die
erste Fassung lief auf **6,5 pt** — kleiner als alles andere auf der Seite
(Alltag 9,6 pt, Schreibtabelle 7,9 pt) und nah an der 4,3-pt-Katastrophe des
Lösungsteils. Das Datenblatt steht jetzt auf **16,5 Einheiten = 7,9 pt**, also
im Maß der Schreibtabelle; Quellzeile und Merkzeile wurden mit angehoben.
Dadurch passen je Spalte rund **22 / 20 / 17 Zeichen** einzeilig — die Zellen
werden für das Förderheft entsprechend neu gefasst.

Die **Merkzeile** unter dem Datenblatt bleibt eine Lesehilfe und nimmt nie das
Ergebnis vorweg (dieselbe Regel wie bei den Bildaufträgen).

## Was die Prüfer sonst aufgedeckt haben

**Drei Paare waren nur einseitig markiert** (rk2/rk5, rk10/rk11, rk13/rk14) —
zum dritten Mal in dieser Reihe derselbe Fehler. Alle drei sind oben
entschieden: keine Zusammenlegung, jede Einheit mit eigenem Lernziel, rk14
gestrichen.

**E7 wäre verlorengegangen.** Der einzige Träger ist rk5, und ausgerechnet
seine tragende Aufgabe (Totzeit) stand auf der Streichliste. Sie bleibt.

**K3 wird im ganzen Band falsch belegt.** Alle fünf K3-Träger tragen einen
Zuhause-Auftrag „Erkläre jemandem…" — das ist Präsentieren, nicht
„Untersuchungen dokumentieren". **K3 wandert einheitlich auf das Eintragen der
Messwerte in die Tabelle**; das ist echtes Dokumentieren und steht auf jeder
Seite ohnehin.

**Reihenfolge Tesla:** ev2 druckt µT, eingeführt wurde *Magnetfeld B in Tesla*
aber erst bei ev4. Behoben: **fv2 führt µT ein**, fv4 verweist zurück; die
Umrechnung 1 T = 1 000 000 µT steht nur im Lehrerband.

**Metrik-Mischung:** Sieben Analysen maßen Wortzahlen teils mit, teils ohne
Lösungstexte. Für den Band gilt ab jetzt nur die Messung von
`pruefe_profil.py` (Schülerseite ohne Bildauftrag).

## Offene Entscheidungen für Abdullah

1. **Seitenplan so freigeben?** Danach werden alle 28 Einheiten ausformuliert.
2. **Alle vier E-Kurs-Einheiten streichen** (ev5, ev15, rk8, rk14)? Das ist die
   konsequente Anwendung der Regel und die einzige Variante, die den Korridor
   ohne Zusammenlegungen hält. Alternative wäre, rk14 als eigene Seite zu
   behalten (29 Einheiten, 67 Seiten, −46,8 %) — auch das läge im Korridor.
3. **Dreischritt „ablesen – ordnen – beurteilen"** für qualitative
   Datenblätter ins `FOERDER_PROFIL.md` aufnehmen?
4. **K3 einheitlich auf das Ausfüllen der Tabelle** legen statt auf die
   Zuhause-Aufträge?

## Noch nicht geklärt

Die Einstiegsbilder von FELO 10 sind wie in allen Bänden Platzhalter.
