# FELO Physik — Gutachten Lesbarkeit und Gestaltungskonsistenz

**Gegenstand:** 19 Bände (Realschule 5/6–10, Gesamtschule 7–10, Gymnasium 5/6–10,
Förderreihe 7–10, Oberstufe EF), zusammen 2378 gesetzte Seiten in `*/build/book_p*.png`.
**Satzmotor:** `arbeitsheft/build_final.py` (Raster, Schriften, Zeichenhilfen) plus je Band
ein `build_book.py` bzw. `build_pilot.py`.
**Stand:** 09.09.2026 · Es wurde **nichts geändert**. Alle Zahlen sind gemessen, die
Messwege stehen im Anhang.

**Umrechnung.** Seite 1240 × 1754 px bei 150 dpi, `build_final.py:7` lädt jede Schrift mit
`S=2`. Eine Zahl im Code × 0,48 = Punkt im Druck. `AV(15.5)` = 7,44 pt. Für 12 pt gedruckt
braucht es `AV(25)`.

**Gesamtbefund in einer Zeile:** Von **2883 Textschrift-Aufrufen** im Satz aller 19 Bände
liegen **0 bei 12 pt oder darüber**, 31 bei 10 pt oder darüber, **98,9 % unter 10 pt** und
**63,5 % unter 7 pt**. Gleichzeitig ist der Zeilenabstand mit 1,42–1,82 durchgehend
**zu weit** — die Seite gibt den Platz, den die Vorgabe für Schriftgröße verlangt,
bereits aus, nur an der falschen Stelle.

---

## 0 · Sofortbefund: 41 leere Kästchen im ausgelieferten Druck

Nicht Teil der sieben Prüfpunkte, aber der einzige Befund, der **jetzt schon sichtbar
falsch gedruckt** ist. SourceSans3 fehlen neun Zeichen, die der Heftinhalt benutzt; PIL
setzt dafür `.notdef` — ein durchgekreuztes Kästchen.

**Belegt am fertigen Bild:** `arbeitsheft_gts10/build/book_p56.png`, Arbeitsschritt 2 lautet
gedruckt „Drücke „⌧ eine Halbwertszeit weiter" …". Gegenprobe: derselbe String durch
dieselbe Schrift gesetzt liefert dasselbe Kästchen.

| Fundstelle (datei:zeile) | was ist | was soll | warum |
|---|---|---|---|
| `arbeitsheft_gts10/content/forscherseiten.json` → gedr. S. 7, 11, 13, 56, 58, 60, 62, 65 | `⏭ ⇄ ↺ ⏻` fehlen SourceSans3 → 16 Kästchen | Zeichen ersetzen (`→`, `↔`, „zurück"), Schriftwahl nicht ändern | Der Arbeitsschritt nennt eine Taste, die auf dem Blatt nicht lesbar ist |
| `arbeitsheft_gym10/…` → gedr. S. 16, 18, 25 | 6 Kästchen (`⏭ ↺`) | dito | dito |
| `arbeitsheft_gts7/…` → gedr. S. 43, 45, 49, 65, 69 | 6 Kästchen (`↺ ⏯`) | dito | ew12/ew14 tragen es in der **Tabellenzeile** — die Zeile ist unbeschriftet |
| `arbeitsheft_gts9/…` → gedr. S. 17, 19 | 3 Kästchen (`⇄ ↺`) | dito | kf8 in `tabRows` |
| `arbeitsheft_gym8/…` → gedr. S. 26, 28 | 3 Kästchen (`⇄ ↺`) | dito | me11 auch im Lösungsteil |
| `arbeitsheft_gts8/…` → gedr. S. 5, 13 | 3 Kästchen (`↺ Ⓐ Ⓥ`) | dito | st5: „Ⓐ Amperemeter" ist die Taste, die gedrückt werden soll |
| `arbeitsheft10/…` → gedr. S. 21 | 2 Kästchen (`⊙ ⊗`) | dito | mo9 `tabCols[0]`: die **Spaltenüberschrift** ist unlesbar |
| `arbeitsheft_gym9/…` → gedr. S. 16 | 1 Kästchen (`↺`) | dito | |

**24 Einheiten auf 24 gedruckten Seiten in 8 Bänden, 41 Zeichen.**
Der Prüfer dafür existiert schon: `arbeitsheft_foe10/pruefe_profil.py::renderer_zeichen()`
prüft nur das *Setzskript*, nicht den *Inhalt*. Die Gegenrichtung fehlt.

---

## 1 · Schriftgrößen

Belegband für die Zeilennummern ist `arbeitsheft8/build_book.py`; dieselbe Zeile steht in
allen 15 Regelbänden (Zeilennummer je Band verschieden, Zahl in Klammern = Fundstellen
über alle Bände).

### 1a · Fließtext und Aufgabenstellungen — Soll 12 pt

| Fundstelle | was ist | was soll | warum |
|---|---|---|---|
| `arbeitsheft8/build_book.py:80` (13×) | Quellenangabe am Datenblatt `COP(9.5)` = **4,56 pt**, Kapitälchen, GOLD_D | ≥ 10 pt, Grundschrift | kleinstes Fließtextelement der Reihe; Vorgabe nennt Quellen ausdrücklich |
| `arbeitsheft_gts10/build_book.py:90,95` (6×) | Datenblattzelle `AVB/AV(11.5)` = **5,52 pt**, Boden 8,5 = **4,08 pt** | 12 pt | die Tabelle IST hier die Quelle; alles darauf beruht |
| `arbeitsheft8/build_book.py:137,138,143` (15×) | Tabelle Abschnitt 4: `_passt(…,15.5)` = 7,44 pt, Boden `mini=9.5` = **4,56 pt** | 12 pt, sonst umbrechen | gemessen: **109 von 2631 Zellen unter 7 pt, 27 unter 6 pt, 3 auf dem Boden** |
| `arbeitsheft8/build_book.py:358,378–384` (15×) | Hinweisleiste + Warn-/Modellkasten `AVM(14.5)` = **6,96 pt** | 12 pt | die Sicherheitswarnung ist der kleinste Satz der Seite |
| `arbeitsheft8/build_book.py:159` (15×) | Merksatz `AV(15)` = **7,20 pt**, ohne Fettung | 12 pt mit fetten Schlüsselbegriffen | der Satz, den die Klasse abschreibt |
| `arbeitsheft8/build_book.py:156` (15×) | Merkkasten-Fachtext `AV(15.5)` = **7,44 pt** | 12 pt | |
| `arbeitsheft8/build_book.py:300` (15×) | Forschungsauftrag `AV(15.5)` = **7,44 pt** | 12 pt | trägt den Operator, also den eigentlichen Auftrag |
| `arbeitsheft/build_final.py:326, 334, 351, 355` (alle Bände) | Übungsseite komplett `AV(16.5)` = **7,92 pt** | 12 pt | vier Aufgabenblöcke je Thema, ~476 Seiten |
| `arbeitsheft8/build_book.py:236` (15×) | Alltagkasten `AV(16.5)` = **7,92 pt** | 12 pt | |
| `arbeitsheft8/build_book.py:333, 366` (15×) | Vermutungsoptionen und Arbeitsschritte `AV(17.5)` = **8,40 pt** | 12 pt | |
| `arbeitsheft8/build_book.py:287` (15×) | Forscherfrage `AVM(18)` = **8,64 pt** | 12 pt | die Frage, um die die ganze Seite gebaut ist |
| `arbeitsheft8/build_book.py:201` (15×) | Aufgabenstellung `AVM(18.5)` = **8,88 pt** | 12 pt | |
| `arbeitsheft8/build_book.py:281` (15×) | Problemtext `AV(19)` = **9,12 pt** — größter Fließtext | 12 pt | der Einstieg, nach dem gelesen oder weggelegt wird |

### 1b · Überschriften — Soll 20–24 pt (Haupt), 14–16 pt fett (Zwischen)

| Fundstelle | was ist | was soll | warum |
|---|---|---|---|
| `arbeitsheft/build_final.py:299` (jede Forscherseite) | Abschnittsmarke `AVB(19.5)` = **9,36 pt** | 14–16 pt fett | die fünf Zwischenüberschriften sind kleiner als der Mindestwert für Bildunterschriften |
| `arbeitsheft8/build_book.py:270–274` (15×) | Seitentitel `DIDOT(34)` = **16,32 pt**, stufenweise bis `DIDOT(22)` = **10,56 pt** | 20–24 pt fett | Didot hat Haarstriche; gemessen an `book_p7.png` sind die dünnsten Striche **1 px bei 150 dpi** |
| `arbeitsheft8/build_book.py:153` (16×) | Merkkasten-Etikett „DAS MUSST DU MITNEHMEN" `COP(10.5)` = **5,04 pt** | 14–16 pt | benennt den wichtigsten Kasten der Seite |
| `arbeitsheft8/build_book.py:234, 418` (16×) | „ALLTAG & ANWENDUNG" / „MEIN SELBST-CHECK" `COP(13)`/`COP(12)` = 6,24 / **5,76 pt** | 14–16 pt | |
| `arbeitsheft8/build_book.py:256` (15×) | „BASISKONZEPT …" `COP(11)` = **5,28 pt** | ≥ 10 pt | Lehrplanbezug, für die Lehrkraft gedacht |

### 1c · Kolumnentitel, Bildunterschriften, Fußzeile — Soll ≥ 10 pt

| Fundstelle | was ist | was soll | warum |
|---|---|---|---|
| `arbeitsheft8/build_book.py:98` (23×) | Fußzeile `COP(9)` = **4,32 pt** | ≥ 10 pt | steht auf jeder der 2378 Seiten |
| `arbeitsheft8/build_book.py:93` (19×) | QR-Etikett „SIMULATION" `COP(9)` = **4,32 pt** | ≥ 10 pt | die einzige Beschriftung des QR-Codes |
| `arbeitsheft/diagrams.py:105, 174, 207, 264, 275, 286, 303, 306, 393, 394, 400, 402` | Bildbeschriftungen `AVM(10)` = **4,80 pt** | ≥ 10 pt | genau der Fall, den die Vorgabe „Bildunterschriften mindestens 10 pt" meint |
| `arbeitsheft8/build_book.py:660` (19×) | Inhaltsverzeichnis „KAPITEL n" `COP(10)` = **4,80 pt** | ≥ 10 pt | Navigationsebene des Hefts |
| `arbeitsheft8/build_book.py:759` (15×) | Impressum/Urheberrecht `AV(11.5)` = **5,52 pt** | ≥ 10 pt | Rechtstext |
| `arbeitsheft8/build_book.py:357` (15×) | Zeichen „▤"/„▸" in der Hinweisleiste `AVB(9)` = **4,32 pt** | ≥ 10 pt | |

### 1d · Der Lösungsteil ist heute das Gegenteil des alten Fehlers

`arbeitsheft8/build_book.py:857` `LOES_GR = 22` = **10,56 pt**. Der 4,3-pt-Absturz ist
behoben, die Notiz in Zeile 853–856 hält den Grund fest.
**Aber:** Damit ist der Lösungsteil *für Eltern und Lehrkräfte* mit 10,56 pt die **größte
Schrift des Hefts** — größer als jeder Satz, den ein Kind liest. Fundstellen der 31
Aufrufe ≥ 10 pt: 15 × `LOES_GR`, 16 × `AVM(22)` im Wortgitter
(`arbeitsheft8/build_book.py:441`). Sonst nichts.

---

## 2 · Konsistenz

Die 15 Regelbände sind untereinander **erstaunlich sauber**: Ein Abgleich von 28
Elementarten über alle Bände fand nur **zwei** echte Abweichungen (unten). Die
Unsauberkeit liegt nicht *zwischen* den Bänden, sondern **innerhalb einer Seite**.

| Fundstelle | was ist | was soll | warum |
|---|---|---|---|
| eine einzige Forscherseite, z. B. `arbeitsheft8/build_book.py:281, 201, 287, 333, 366, 236, 300, 156, 159, 358` | **acht verschiedene Grade für durchgehenden Schülertext:** 9,12 · 8,88 · 8,64 · 8,40 · 7,92 · 7,44 · 7,20 · 6,96 pt | **ein** Grad (12 pt) für alles, was Fließtext oder Aufgabenstellung ist | Das ist die häufigste stille Unsauberkeit — jeder Grad ist einzeln entstanden, keiner ist begründet |
| `arbeitsheft8/build_book.py:137` gegen `:138` | Tabellenkopf Spalte 1 startet bei `15.5`, Spalte 2 bei `14.5` — **zwei Basisgrade in derselben Kopfzeile** | ein Grad für beide Spalten | gemessen an `arbeitsheft7/build/book_p69.png`: links „Was ich wähle" 7,44 pt, rechts 4,56 pt — **derselbe Tabellenkopf, Faktor 1,6** |
| `arbeitsheft/build_final.py:423, 530` gegen `arbeitsheft8/build_book.py:338, 421` | „Begründe:" und „Das möchte ich noch üben:" stehen im Satzmotor auf `AVM(14)` = 6,72 pt, in allen 15 build_book auf `AVM(15)` = 7,20 pt | eine Größe | Der Motor trägt eine zweite, veraltete Fassung derselben Zeile |
| `arbeitsheft8/build_book.py:80, 82` gegen `arbeitsheft_foe10/build_pilot.py:124, 127` | Datenblatt-Quelle 4,56 pt gegen **6,96 pt**, Merke-Zeile 5,76 gegen **7,20 pt** | eine Größe je Elementart | Die Förderreihe hat die Größen bereits einmal korrigiert (Notiz in `CLAUDE.md`), die Regelreihe nicht — der Stand ist auseinandergelaufen |
| `arbeitsheft_foe9/build_pilot.py:98, 120` gegen `arbeitsheft8/build_book.py:281, 366` | Förderheft setzt Problemtext/Arbeitsschritte auf `AV(20)` = **9,60 pt**, Regelheft auf 8,40–9,12 pt | bewusst oder gar nicht | Zwei Reihen derselben Marke, unterschiedliche Grade für dasselbe Element. Wenn es Absicht ist, steht sie nirgends |
| `arbeitsheft8/build_book.py:151, 232, 416, 506, 537, 556, 683, 704, 719, 735, 778` (11 je Band, **165 gesamt**) | **elf** verschiedene Kastenarten benutzen denselben Gold-Doppelrahmen `h.gframe` | verschiedene Bedeutung = verschiedene Form | „Gleiche Elemente überall gleich" gilt auch umgekehrt: Merkkasten, Alltagkasten, Selbst-Check, Notenspiegel und Impressumskasten sehen identisch aus und unterscheiden sich nur am 5-pt-Etikett |
| `arbeitsheft8/plan.py:97` `(31,122,116)` gegen `arbeitsheft/build_final.py:22` `STEP[2]=(22,120,118)` | Kapitelfarbe „Tempo" und Abschnittsfarbe „Forschen" sind **9 RGB-Stufen** voneinander entfernt — im Druck derselbe Ton, zwei Bedeutungen | zwei klar verschiedene oder ein einziger Ton | Auf jeder Seite des Kapitels bedeutet dasselbe Petrol einmal „Kapitel" und einmal „Abschnitt 3" |
| `arbeitsheft8/plan.py:75` `(192,138,30)` gegen `STEP[3]=(190,148,50)` und `GOLD=(198,160,74)` | drei Goldtöne, keiner unterscheidbar | ein Gold | dasselbe Problem im Goldbereich |

---

## 3 · Kontrast

Alle Werte WCAG 2.1, Text auf Creme `#FAF6EC`, nachgerechnet (Anhang A).
Schwelle: 4,5:1 für Text, 3,0:1 nur für ≥ 18 pt bzw. ≥ 14 pt fett — **im FELO-Satz gibt es
keinen einzigen Text, der groß genug für die 3,0-Ausnahme wäre.** Es gilt überall 4,5:1.

| Fundstelle | was ist | was soll | warum |
|---|---|---|---|
| `arbeitsheft/build_final.py:299` über `numtab(…, STEP[3], "ORDNEN & SICHERN")`, aufgerufen in `arbeitsheft8/build_book.py:118` (**476 gedruckte Seiten**) | Zwischenüberschrift in `STEP[3] #BE9432` = **2,60:1** bei 9,36 pt | ≥ 4,5:1, z. B. `#163A5F` (10,78:1) | Die Überschrift des Sicherungsabschnitts ist der am schlechtesten lesbare Text der Seite. Sichtbar in `arbeitsheft7/build/book_p69.png` |
| `arbeitsheft8/build_book.py:254, 93, 99` mit `acc` aus `plan.py` (13 Kapitel, 10 Bände, **143 Themen ≈ 286 Seiten**) | Kapitelfarbe unter 4,5:1 trägt Kopfzeile (6,24 pt), QR-Etikett (4,32 pt) und **Seitenzahl** (Creme auf der Farbe): `arbeitsheft_gym56/plan.py:132` #C8961E **2,48:1** · `arbeitsheft9/plan.py:101` #C49422 **2,56:1** · `arbeitsheft10/plan.py:67`, `arbeitsheft7/plan.py:28`, `arbeitsheft8/plan.py:75`, `arbeitsheft_gts10/plan.py:47`, `arbeitsheft_foe10/plan.py:62` #C08A1E **2,82:1** · vier weitere #B06A1E **3,95:1** · zwei #B05C30 **4,40:1** | Kapitelfarben auf ≥ 4,5:1 nachziehen (Farbwinkel behalten, Helligkeit senken) | Auch die **Seitenzahl** fällt durch — die Navigationsebene des Hefts |
| `arbeitsheft8/build_book.py:80, 121 (gts10)` (13×) | Datenblatt-Quelle GOLD_D **4,53:1** bei **4,56 pt** | ≥ 4,5:1 **und** ≥ 10 pt | 4,53 ist rechnerisch bestanden, praktisch nicht: 4,56 pt in Kapitälchen ist unter jedem Maß |
| `arbeitsheft_gts10/build_book.py:123`, `arbeitsheft10` ge6/ge11 | `merke`-Zeile `AVM(12)` = 5,76 pt **in der Kapitelfarbe**; bei #C08A1E = **2,82:1** | INK auf hellem Grund | schlechteste Kombination der Reihe: kleinste Größe × schwächster Kontrast × Datenblattseite ohne Simulation |
| `arbeitsheft8/build_book.py:330, 338, 421`; `arbeitsheft/build_final.py:331`; + 262 weitere SUB-Stellen | `SUB #787887` = **4,02:1** als Schriftfarbe, meist 6,24–7,44 pt | ≥ 4,5:1 | `build_final.py:331` ist der kritische Fall: „richtig"/„falsch" beschriften zwei sonst identische Kästchen — die einzige Unterscheidung, in der schwächsten Farbe |
| `arbeitsheft8/build_book.py:118` → `numtab` Abschnitt 5 `STEP[4] #C6463C` = **4,48:1** | knapp durchgefallen bei 9,36 pt | ≥ 4,5:1 | zwei Hundertstel — aber es ist die Aufgabenüberschrift |
| `arbeitsheft8/build_book.py:355, 358` | Hinweisleiste: `STEP[2]` auf eigenem 90-%-Tint = **4,58:1** bei 6,96 pt | ≥ 4,5:1 mit Reserve | steht auf der Kippe; jede Farbkorrektur am Petrol reißt es |
| `arbeitsheft8/build_book.py:372–380` | Warnkasten: Rand `#D6963C` auf eigener Füllung `#FDF1E0` = **2,27:1** | Vorgabe: `#B42318` (6,57:1) | der Rand ist das Warnzeichen und ist unsichtbar; die Schrift `#8C5614` (5,45:1) ist in Ordnung |
| `arbeitsheft8/build_book.py:307, 355` | Kastenfüllungen sind 90-%-Tints der Abschnittsfarbe. Auf ihnen: `STEP[0]` 11,33:1 ✓, `STEP[1]` 8,09:1 ✓, `STEP[2]` 4,58:1 (knapp), `STEP[3]` **2,56:1**, `STEP[4]` **4,20:1** | jede Fläche, auf der Text steht, ≥ 4,5:1 | Der 55-%-Tint (`:315`) wird heute nur mit `STEP[0]` benutzt und ist mit 5,20:1 in Ordnung — er wird zur Falle, sobald ein anderer STEP-Ton dort landet |

**GOLD, GOLD_L und GLINE als Schriftfarbe:** 111 + 134 Stellen — **alle auf dunkelblauem
Grund** (Deckblatt `build_book.py:626`, Kapitel-Trennseite `:527`, `:535`, `:541`, `:550`,
`:634`, `:644`). Dort sind sie 7,06:1 / 10,60:1 / 11,18:1 und in Ordnung. In der
Druckfassung (`HEFT_WEISS=1`) dreht `build_final.py:33–43` sie über `DF()` auf GOLD_D.
**Zwei Ausnahmen ohne `DF()`:** `arbeitsheft/build_final.py:362–379` und `:500–513`
(Deckblatt und Methodenseite des alten Musterhefts) — dort stünde GOLD_L bei
`HEFT_WEISS=1` mit **1,52:1** auf Weiß. Diese Funktionen werden von keinem `build_book`
mehr aufgerufen, sind also toter Code — aber sie sind eine geladene Falle.

---

## 4 · Farbe als einziges Merkmal

Maßstab ist der Graustufenwert der Schwarz-Weiß-Kopie (Anhang A).

| Fundstelle | was ist | was soll | warum |
|---|---|---|---|
| `arbeitsheft8/build_book.py:99` Fußzeile, `:93` QR-Kärtchen | Kapitel wird allein über `acc` codiert. Grauwerte der Kapitelfarben: 95 · 103 · 108 · 110 · 114 · 115 — **sechs Töne in einem Fenster von 20 von 255** | Kapitelnummer in die Seitenzahl-Kachel, Kapitelkürzel ans QR-Kärtchen | In der Kopie sind Kapitel 2 (Grau 115) und Kapitel 4 (Grau 110) nicht mehr zu unterscheiden |
| `arbeitsheft/build_final.py:296–299` Abschnittsmarken | STEP-Grauwerte 45 · 69 · **108** · 154 · **114** — Abschnitt 3 und 5 liegen 6 Stufen auseinander | Farbe darf die Nummer nur unterstützen | Die Ziffer im Feld rettet es; die Farbcodierung selbst trägt in der Kopie keine Information |
| `arbeitsheft8/build_book.py:355` Hinweisleiste | Füllung = 90-%-Tint von STEP[2], Grau **240** gegen Seitengrund **246** | zusätzlich Rahmen oder Regel | Δ6 von 255 — in der Kopie verschwindet die Leiste, die sagt „hier arbeitest du am Bildschirm" |
| `arbeitsheft8/build_book.py:151, 232, 416` | Merkkasten, Alltagkasten und Selbst-Check tragen denselben `h.gframe`, denselben Creme-Grund und unterscheiden sich nur am 5,04/6,24/5,76-pt-Etikett | drei verschiedene Formen — die Vorgabe nennt Merkkasten `#EAF4F8` und Experimentierkasten `#EAF6EE` | Die beiden Flächenfarben der Vorgabe **existieren im Satz überhaupt nicht** |
| `arbeitsheft/build_final.py:329–336` | zwei leere Kästchen, unterschieden nur durch „richtig"/„falsch" in SUB 6,24 pt darüber | Beschriftung in Textfarbe, ≥ 10 pt, oder Kästchen mit R/F beschriften | schwächste Farbe an der Stelle mit der größten Verwechslungsgefahr |
| `arbeitsheft8/build_book.py:372–376` | Warn- und Modellkasten trennen sich über Füllfarbe (Grau 240 gegen 242), Rand und ein Zeichen („!" / „M") | „M" durch ein Wort ersetzen | Zweites Merkmal ist vorhanden, aber „M" erklärt sich niemandem |

---

## 5 · Großbuchstaben und Fettdruck

| Fundstelle | was ist | was soll | warum |
|---|---|---|---|
| **jede Forscherseite**: `arbeitsheft8/build_book.py:254, 256, 93, 118 (×5 numtab), 153, 234, 98` + `build_final.py:299, 309` | **13 Zeilen in Versalien auf einer Seite** — Kopfzeile, Basiskonzept, QR-Etikett, fünf Abschnittsmarken, zwei Kastenetiketten, Fußzeile | höchstens die Marke selbst | Die Vorgabe sagt „keine Wörter in Großbuchstaben". Die Seite besteht in ihrer ganzen Beschriftungsebene aus Versalien |
| `arbeitsheft/build_final.py:14` `COP()` = Copperplate | **769 Aufrufe** über 19 Bände. Copperplate hat keine Gemeinen — jede damit gesetzte Zeichenkette druckt als Kapitälchen, auch wenn die Quelle klein geschrieben ist | Grundschrift, gemischt | Es sind nicht 13 Entscheidungen, es ist eine: die Wahl der Schrift für die ganze Beschriftungsebene |
| 862 Aufrufe mit `h.tracked(` oder `.upper()` über 19 Bände, gleichmäßig 39–70 je Band | Sperrung zusätzlich zu Versalien (`tr=2…7`) | Sperrung nur für die Marke | Versalien + Sperrung + 4,3–6,2 pt ist die schlechteste Kombination für Wortbilderkennung |
| **Gegenprobe Fettdruck** | `AVB` wird nur für Überschriften, Operatoren, Ziffern in Kreisen und Tabellenköpfe benutzt; **kein einziger Absatz ist ganz fett** | so lassen | Dieser Punkt der Vorgabe ist erfüllt |
| `arbeitsheft8/build_book.py:159` | **Merksätze haben keine fetten Schlüsselbegriffe** — `gapsatz(…, AV(15), INK, …)` setzt alles mager | „Merksätze 12 pt mit fetten Schlüsselbegriffen" | Der eine Ort, an dem die Vorgabe Fettdruck *verlangt*, hat keinen |

---

## 6 · Zeilenabstand — der Befund, der die Rechnung dreht

Gemessen an **373 `h.para`-Aufrufen** mit fester Zeilenhöhe über alle 19 Bände.
Verhältnis Zeilenhöhe : Schriftgrad:

| Verhältnis | Anzahl |
|---|---|
| unter 1,15 (zu eng) | **0** |
| 1,15 – 1,30 (Vorgabe) | **0** |
| 1,42 – 1,60 | 175 |
| 1,61 – 1,82 | 198 |

**Kein einziger Absatz im ganzen Werk ist zu eng gesetzt. Alle 373 sind zu weit.**
Median 1,60. Weitester Absatz in einem lebenden Band: **1,73**
(`arbeitsheft_gym9/build_book.py:512`, `AV(15)` mit `lh=26`); im Satzmotor 1,82
(`arbeitsheft/build_final.py:511`). Noch weiter geht der Lückensatz der Übungsseite:
`arbeitsheft/build_final.py:325` `blk_lueck(…, lh=33)` bei `AV(16.5)` = **2,00** — er
läuft über `gapsatz`/`flow` und steckt deshalb nicht in den 373 `h.para`-Aufrufen.

Das heißt: die Seite verteilt bereits den senkrechten Platz, den 12-pt-Text braucht — nur
liegt er als Luft zwischen 7-pt-Zeilen statt in den Buchstaben.

| Fundstelle | Schrittweite ist | für 12 pt bei 1,25 nötig | Ergebnis |
|---|---|---|---|
| `arbeitsheft8/build_book.py:281` Problemtext | `lh=30` = **14,40 pt** | 15,00 pt | +4 % — praktisch gratis |
| `arbeitsheft8/build_book.py:201` Aufgabenstellung | `lh=30` = **14,40 pt** | 15,00 pt | +4 % |
| `arbeitsheft/build_final.py:325` Lückensatz | `lh=33` = **15,84 pt** | 15,00 pt | **passt bereits** |
| `arbeitsheft8/build_book.py:857` Lösungsteil | `lh=34` = **16,32 pt** | 15,00 pt | **passt bereits** |
| `arbeitsheft8/build_book.py:366` Arbeitsschritte | `lh=28` = 13,44 pt | 15,00 pt | +12 % |
| `arbeitsheft8/build_book.py:156` Merkkasten-Fachtext | `lh=22` = 10,56 pt | 15,00 pt | +42 % |
| `arbeitsheft8/build_book.py:80` Datenblatt-Quelle | `lh=14` = 6,72 pt | 15,00 pt | +123 % |

Über die 20 gemessenen Elementarten zusammen: **+22,7 % Schrittweite**, nicht das
Zweieinhalbfache, das die Flächenrechnung nahelegt.

**Die Wahrheit dazwischen — gemessen, nicht geschätzt.** Der Prototyp
`arbeitsheft/prototyp/lesbar.py` setzt die echte Einheit sp4 aus `arbeitsheft8` einmal
im Ist-Stand und einmal nach voller Vorgabe, mit echtem Umbruch:

```
ist    A4-Seiten: 1   Inhaltshöhe 1476 EH = 708 pt = 0,96 Nutzhöhen
spec   A4-Seiten: 2   Inhaltshöhe 2550 EH = 1224 pt = 1,65 Nutzhöhen
spec gegen ist: Inhalt × 1,73  ·  Seiten 1 → 2
```

Der Faktor 1,73 (nicht 2,5) kommt genau daher, dass der Zeilenabstand von 1,60 auf 1,25
fällt und das Wachstum der Schrift zur Hälfte bezahlt. Der Rest kommt aus der
Zeilenlänge (nächster Abschnitt).

**Zeilenlänge, mitgemessen:** Arbeitsschritte, Aufgabenstellung, Alltagkasten und
Übungsseite laufen über **116 Zeichen je Zeile** (Spalte 502–545 pt). Empfohlen sind
45–75. Der Prototyp setzt deshalb `SPALTE = 830` EH = rund 65 Zeichen bei 12 pt — und
gewinnt damit die Randspalte für QR-Kärtchen und Bild.

Hochrechnung auf die Reihe: Forscher- und Übungsseiten sind rund 45 % der 2378 Seiten;
bei × 1,73 auf diesem Anteil landet die Reihe bei **rund 3160 Seiten (+33 %)**.

---

## 7 · Akzentfarben je Seite

Gezählt am fertigen Bild `arbeitsheft8/build/book_p7.png` (Forscherseite sp2),
Palettentreffer mit Toleranz ±2:

| Farbe | Anteil der Seite | wofür |
|---|---|---|
| `STEP[0]` #1C2A5A | 0,133 % | Abschnitt 1 + Forscherfragekasten |
| `STEP[1]` #543874 | 0,093 % | Abschnitt 2 |
| `STEP[2]` #167876 | 0,149 % | Abschnitt 3 + Hinweisleiste |
| `STEP[3]` #BE9432 | 0,093 % | Abschnitt 4 |
| `STEP[4]` #C6463C | 0,094 % | Abschnitt 5 + Alltagkasten |
| `acc` #2E5CB2 | 0,086 % | Kapitel: Kopfzeile, QR, Seitenzahl |
| GOLD / GOLD_L / GOLD_D / GLINE | 0,234 % | Rahmen, Etiketten, Linien, Sterne |
| SUB #787887 | Nebenschrift | |

| Fundstelle | was ist | was soll | warum |
|---|---|---|---|
| `arbeitsheft/build_final.py:22` `STEP=[…]` + `plan.py` `acc` + `:20` Goldfamilie | **sieben Akzentfarben auf einer Forscherseite** (fünf Abschnittsfarben, eine Kapitelfarbe, die Goldfamilie), dazu Warnorange und Modellblau, wenn die Kästen vorkommen — **bis zu neun** | höchstens zwei | Die Vorgabe nennt genau zwei; die Seite trägt drei- bis viereinhalbmal so viele |
| `arbeitsheft/build_final.py:296–299` | die fünf Abschnittsfarben tragen keine eigene Bedeutung — die Nummer im Feld sagt dasselbe | eine Akzentfarbe für alle fünf Marken | fünf der sieben Farben lassen sich streichen, ohne dass Information verlorengeht |
| `arbeitsheft8/build_book.py:372–376` | Warnkasten und Modellkasten bringen je zwei weitere Töne mit | Warnrot `#B42318` aus der Vorgabe, Modellkasten in Grau | |

---

## Was die Vorgabe heute schon erfüllt

Damit die Liste nicht falsch gelesen wird:

- **Kein Blocksatz.** `build_final.py:214–228` (`wrap`/`para`) setzt ausschließlich
  linksbündig mit Flatterrand. Erfüllt, ausnahmslos, in allen 19 Bänden.
- **Wenig Fettdruck.** Kein einziger Absatz ist ganz fett gesetzt.
- **Kein zu enger Zeilenabstand.** 0 von 373 Absätzen unter 1,15.
- **Reichlich Abstand zwischen Aufgaben und Abschnitten.** Eher zu viel als zu wenig.
- **Die Regelbände sind untereinander konsistent.** Von 28 gesuchten Elementarten
  ließen sich 24 messen; in allen 24 setzen die 15 Regelbände exakt denselben Grad.
  Die beiden gefundenen Abweichungen (Datenblatt-Quelle, Datenblatt-Merke) liegen
  zwischen Regel- und Förderreihe, nicht innerhalb einer Reihe. Eine dritte Meldung
  („Fußzeile") war ein Fehlalarm meiner eigenen Suche: sie hat Seitenfuß und Deckblatt
  in einen Topf geworfen.
- **Der Lösungsteil ist repariert** und trägt seine Begründung im Code
  (`arbeitsheft8/build_book.py:853–856`).
- **Die Zielfarben sind geprüft und tragen.** `#1F2937` 14,68:1 · `#163A5F` 11,64:1 ·
  `#B42318` 6,57:1. Nur `#007C83` liegt auf `#EAF4F8` bei 4,46:1 und muss auf
  **`#00777D`** (4,78 / 5,34 / 4,81).
- **SourceSans3 ist die richtige Textschrift.** Atkinson Hyperlegible fehlen 55 Zeichen
  mit 2944 Vorkommen im Heftinhalt und ist als Textschrift unbrauchbar; SourceSans3 fehlen
  nur die neun aus Abschnitt 0.

---

## Die drei Änderungen mit der größten Wirkung je Aufwand

### 1 · Neun Zeichen austauschen — 41 leere Kästchen verschwinden
**Aufwand:** 24 Textstellen in 8 `content/forscherseiten.json`, dazu eine
Zeichenprüfung des *Inhalts* neben der schon vorhandenen Prüfung des *Renderers*.
Kein Eingriff in den Satz, keine Seitenzahl ändert sich, keine gedruckte QR-Kennung
wird berührt.
**Wirkung:** Der einzige Befund, der heute als sichtbarer Fehler gedruckt wird, ist weg.
**Belegt an:** `arbeitsheft_gts10/build/book_p56.png`.

### 2 · Sieben Akzentfarben auf zwei — plus die zwei Kastenfarben der Vorgabe
**Aufwand:** vier Konstanten in `arbeitsheft/build_final.py:19–22` und ein `acc`-Wert je
Kapitel in 19 `plan.py`. Kein Umbruch, keine Seite wächst, keine Seitenzahl verschiebt
sich — die gedruckten QR-Codes und `js/heft-bruecke.js` bleiben unberührt.
**Wirkung, alles in einem Zug:**
- `STEP[3]` 2,60:1 auf 476 Seiten → behoben (Befund 3, Platz 1)
- 143 Themen mit Kapitelfarbe unter 4,5:1 ≈ 286 Seiten → behoben (Befund 3, Platz 2)
- `STEP[4]` 4,48:1, SUB 4,02:1, Warnrand 2,27:1 → behoben
- sieben Akzentfarben → zwei (Befund 7 vollständig)
- Grauwert-Kollaps der Kapitelfarben → behoben (Befund 4)
- Merkkasten `#EAF4F8` und Experimentierkasten `#EAF6EE` bekommen erstmals eine
  eigene Fläche → Befund 4 an zwei weiteren Stellen
**Das ist der beste Schnitt im ganzen Gutachten: ein knapper Tag Arbeit, kein
Satzrisiko, und er räumt Befundgruppe 3, 4 und 7 fast vollständig ab.**

### 3 · Ein Fließtextgrad, ein Zeilenabstand — und die Spalte auf 65 Zeichen
**Aufwand:** der große Schnitt. Acht Fließtextgrade auf `AV(25)` = 12 pt, alle
`lh` auf 1,25 × Grad, Textspalte von 1136 auf 830 EH, Randspalte für QR und Bild.
Der Prototyp `arbeitsheft/prototyp/lesbar.py` hat den Umbruch bereits echt gerechnet:
**Inhalt × 1,73, eine Forscherseite wird zwei**, hochgerechnet rund 3160 statt 2378
Seiten (+33 %).
**Warum trotzdem hier und nicht später:** Er räumt Befundgruppe 1, 2 und 6 in einem
ab — 2852 Aufrufe unter 10 pt, acht Grade für dasselbe Element, 373 zu weite Absätze —
und er ist **zur Hälfte selbst finanziert**: die Schrittweite wächst nur um 22,7 %, weil
der heutige Zeilenabstand von 1,60 auf 1,25 fällt.
**Reihenfolge:** zuerst an einem Band, der noch nicht gedruckt ist. Die Realschulreihe
und alle gedruckten QR-Kennungen bleiben bis zur Abnahme unberührt — Seitenzahlen
verschieben sich, und `js/heft-bruecke.js` hängt daran.

---

## Anhang A — wie gemessen wurde

| Zahl | Weg |
|---|---|
| 2883 Textschrift-Aufrufe, Verteilung | Quelltext-Abzug aller `AV/AVM/AVB/COP`-Aufrufe in `build_book.py`, `build_pilot.py`, `build_final.py` der 19 Bände, Grad × 0,48 |
| 31 Aufrufe ≥ 10 pt | dieselbe Liste, `AV`-Familie, Wert ≥ 10,0 — reproduziert die vorgegebene Zahl |
| Kontrastwerte | WCAG 2.1 relative Leuchtdichte, sRGB-Linearisierung; reproduziert alle vorgegebenen Werte (SUB 4,02 · GOLD_D 4,53 · GOLD 2,28 · GOLD_L 1,52 · GLINE 1,44) |
| Graustufen der Schwarz-Weiß-Kopie | Leuchtdichte → sRGB zurück |
| 7 Akzentfarben je Seite | Palettentreffer ±2 auf dem fertigen `book_p7.png`, nicht im Quelltext |
| 373 Zeilenabstände | `h.para`-Aufrufe mit konstanter `lh`, Verhältnis `lh / Grad` |
| 109 / 27 / 3 Tabellenzellen unter 7 / 6 / 4,56 pt | `_passt()` aus `sichern_block` mit den echten `tabCols`/`tabRows` aller 476 Themen nachgefahren, Breiten mit der echten Schrift gemessen (`h.tw`) |
| 116 Zeichen je Zeile | `h.wrap()` mit der echten Schrift auf die echten Spaltenbreiten |
| 41 fehlende Zeichen | `cmap` von SourceSans3 gegen den vollständigen Inhalt aller `content/forscherseiten.json`; gegengeprüft am gerenderten `book_p56.png` und an einer eigenen Satzprobe |
| Faktor 1,73 / 1 → 2 Seiten | `arbeitsheft/prototyp/lesbar.py`, echter Umbruch derselben Einheit in beiden Fassungen |
| gedruckte Seitenzahlen | `<band>/build/seiten.json` (aus den QR-Codes der gesetzten Seiten gelesen), nicht gerechnet |

**Selbstauskunft zu den Grenzen dieses Gutachtens.** Drei Zahlen sind *nicht* am
fertigen Blatt gemessen, sondern aus dem Quelltext hergeleitet, und können daneben
liegen, wenn eine Seite einen Sonderweg nimmt: die 13 Versalzeilen je Forscherseite
(gezählt an `topic_page` plus Hilfsfunktionen), die Hochrechnung auf 3160 Seiten
(ein gemessener Faktor auf einen geschätzten Seitenanteil), und die Aussage
„Didot-Haarstriche 1 px" (an einer Titelzeile gemessen, nicht an allen 476).
