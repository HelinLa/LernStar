# Kernlehrplan Mathematik NRW 2022 – Auswertung für Klasse 5/6

Stand 03.10.2026. Gezogen für das Förderheft Mathematik 5 (`arbeitsheft_mathe_foe5/`).

## Quellen (alle hier abgelegt)

| Datei | Was | Herkunft |
|---|---|---|
| `rs_m_klp_2022.pdf` + `_volltext.txt` | Kernlehrplan Mathematik **Realschule**, Heft 3302, Endfassung 17.06.2022, gültig seit 01.08.2022 | lehrplannavigator.nrw.de |
| `gesk_m_klp_2022.pdf` + `_volltext.txt` | Kernlehrplan Mathematik **Gesamtschule/Sekundarschule** 2022 | lehrplannavigator.nrw.de |
| `rs_m_silp_2023.docx` + `_volltext.txt` | amtliches **Beispiel** eines schulinternen Lehrplans Realschule (09.06.2023) | lehrplannavigator.nrw.de |
| `gesk_m_silp_2023.docx` + `_volltext.txt` | dasselbe für die Gesamtschule (10.06.2023) | lehrplannavigator.nrw.de |

## Realschule und Gesamtschule sind für 5/6 wortgleich

Maschinell verglichen (Kap. 2.3, „bis zum Ende der Doppeljahrgangsstufe 5/6“): Außer
Satzzeichen, Silbentrennungsresten des PDF-Exports und „grafisch/graphisch“ gibt es
**keinen Unterschied**. Das Förderheft deckt damit beide Schulformen ab; auf dem
Deckblatt steht wie in der ganzen Förderreihe „Gesamtschule NRW“.

## Was der Plan NICHT enthält – nachgezählt

- **Keine Anforderungsbereiche I/II/III.** Das Wort kommt im Kernlehrplan nicht vor
  (Leitfaden Frage 8). Die Förderhefte drucken deshalb in Mathematik **kein AFB**.
- **„Werkzeuge nutzen“ ist kein Kompetenzbereich.** Das war der Lehrplan 2004
  (Gesamtkonzept 4.8, Anhang A K9). Es gibt fünf Prozesse: Operieren, Modellieren,
  Problemlösen, Argumentieren, Kommunizieren. Medien und Werkzeuge sind ein
  Unterbereich von Operieren (Ope-9 bis Ope-13).
- **Keine Pflicht zur Eingangsdiagnose.** Verbindlich ist die Verknüpfung von
  Beurteilung und Diagnose (Kap. 3) – Standortbestimmungen sind fachdidaktisch
  begründet, nicht vorgeschrieben (Leitfaden Frage 2).

## Codes

Wortlaut aller 93 Kompetenzerwartungen bis Ende 5/6: `../arbeitsheft/kompetenzen_mathe.py`
(maschinell aus dem PDF, mit Selbsttest). Zählung wie im amtlichen Beispiel-Lehrplan:

| Kürzel | Bereich | Unterbereiche |
|---|---|---|
| Ope-1 … 13 | Operieren | 1–8 Hilfsmittelfreies Operieren · 9–13 Arbeiten mit Medien und Werkzeugen |
| Mod-1 … 9 | Modellieren | 1–3 Strukturieren · 4–6 Mathematisieren · 7–9 Interpretieren und Validieren |
| Pro-1 … 10 | Problemlösen | 1–3 Erkunden · 4–6 Lösen · 7–10 Reflektieren |
| Arg-1 … 10 | Argumentieren | 1–3 Vermuten · 4–8 Begründen · 9–10 Beurteilen |
| Kom-1 … 11 | Kommunizieren | 1–3 Rezipieren · 4–8 Produzieren · 9–11 Diskutieren |
| Ari-1 … 16 | Arithmetik/Algebra (Inhaltsfeld) | |
| Fkt-1 … 4 | Funktionen | |
| Geo-1 … 15 | Geometrie | |
| Sto-1 … 5 | Stochastik | |

## Inhaltliche Schwerpunkte bis Ende 5/6 (wörtlich)

- **Arithmetik/Algebra:** Grundrechenarten (natürliche Zahlen, endliche Dezimalzahlen,
  einfache Brüche, schriftliche Division) · Gesetze und Regeln (Kommutativ-, Assoziativ-,
  Distributivgesetz, Teilbarkeitsregeln) · Begriffsbildung (Anteile, Bruchteile, Kürzen,
  Erweitern, Rechenterm) · Zahlbereichserweiterung (positive rationale Zahlen, Darstellung
  ganzer Zahlen) · Darstellung (Stellenwerttafel, Zahlenstrahl, Wortform, Bruch, Dezimalzahl,
  Prozentzahl) · Größen und Einheiten (Länge, Flächeninhalt, Volumen, Zeit, Geld, Masse)
- **Funktionen:** Zusammenhang zwischen Größen: Diagramm, Tabelle, Wortform, Maßstab
- **Geometrie:** Ebene Figuren (Kreis, besondere Drei- und Vierecke, Winkel, Strecke, Gerade,
  Koordinatensystem, Umfang und Flächeninhalt Rechteck/rechtwinkliges Dreieck, Zerlegen und
  Ergänzen) · Körper (Quader, Pyramide, Zylinder, Kegel, Kugel, Schrägbilder und Netze,
  Oberfläche und Volumen Quader/Würfel) · Lagebeziehung und Symmetrie · Abbildungen
- **Stochastik:** Datenerhebung, Ur- und Strichlisten, Klasseneinteilung, Säulen- und
  Kreisdiagramme · relative und absolute Häufigkeit · arithmetisches Mittel, Median,
  Minimum und Maximum, Spannweite

## Wie das Beispiel-Lehrplan Klasse 5 schneidet (Realschule, 120 Ustd.)

UV 5.1 Daten („Wir lernen uns kennen“, 20 Std.) · UV 5.2 Zahlen darstellen, ordnen, runden
(16) · UV 5.3 Figuren, Koordinaten, Symmetrie (24) · UV 5.4 Größen, schriftliche Division,
Umfang und Fläche Rechteck (40) · UV 5.5 Rechengesetze, Terme, Variablen (20). Brüche,
Dezimalzahlen, Winkel, Körper und Volumen liegen dort in Klasse 6.

Das Felo-Gesamtkonzept schneidet Klasse 5 feiner in **acht Themen 5.1–5.8** (Zahlen zuerst,
Daten zuletzt; 5.1, 5.2, 5.4, 5.6 nehmen Grundschulstoff auf, 5.7 baut auf 5.6, 5.8 ist
weitgehend neu). Das Förderheft folgt dem Konzept, deckt aber dieselben Inhalte ab wie die
fünf UV des Beispiel-Lehrplans – die Zuordnung steht in `../arbeitsheft_mathe_foe5/plan.py`.

## Zitate aus Kapitel 3, die das Heft binden

- „Die Beurteilung von Leistungen soll ebenfalls grundsätzlich mit der Diagnose des
  erreichten Lernstandes und Hinweisen zum individuellen Lernfortschritt verknüpft sein.“
- „Im Fach Mathematik ist besonders darauf zu achten, dass fehlerhafte Unterrichtsbeiträge in
  Erarbeitungs- und Übungsphasen nicht zum Anlass punktueller Abwertung genommen, sondern
  produktiv für den individuellen und generellen Lernfortschritt genutzt werden.“
  → Standortbestimmung und Selbstcheck werden **nicht benotet** und dürfen es nicht.
- „Überprüfungsformen, die für schriftliche Arbeiten eingesetzt werden, müssen bei
  verschiedenen Gelegenheiten hinreichend und rechtzeitig angewandt werden …“
  → Jedes Format des Fördertests kommt vorher in den Einheiten vor.
