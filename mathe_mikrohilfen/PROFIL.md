# FELO MATHEMATIK 8 — Profil der Mikrohilfen (GLEICHUNGEN)

Verbindlicher Standard für alle elf Mikrohilfen. Grundlage: das Master-System
des Auftraggebers (Abdullah) und der Sprachstandard der Förderreihe
(`../arbeitsheft_foe7/FOERDER_PROFIL.md`, Abschnitte „Sprachregeln" und
„Fachwort-Zählregel").

Jede Zahl in diesem Profil steht mit ihrer Begründung da. Das ist Absicht: In
diesem Projekt sind Regeln ohne Begründung schon dreimal beim ersten Zweifel
aufgeweicht worden. Wer eine Zahl ändern will, muss zuerst die Begründung
widerlegen — nicht nur die Zahl.

Geprüft wird maschinell: `python3 pruefe_mikrohilfe.py`. Der Prüfer besteht
vorher einen Selbsttest (Wortzähler gegen 19 Handzählungen · `aufgaben.json`
nachgerechnet · 2 gute Hilfen · 68 Proben: 54 absichtlich kaputte und 14
Gegenproben); fällt der durch, urteilt er nicht. Hausregel: **Ein Prüfer, der
schweigt, weil er nichts sieht, ist schlimmer als keiner.** Jede Regel braucht
deshalb **beide** Richtungen — eine Probe, die durchfallen MUSS, und eine, die
durchgehen muss. Ohne die zweite ist eine zu scharfe Prüfung von einer
richtigen nicht zu unterscheiden.

---

## 1. Zweck und Grundprinzip

    AUFGABE → SCHÜLER HÄNGT → PASSENDE MIKROHILFE → SCHÜLER ARBEITET SELBST WEITER

Die Mikrohilfen übernehmen die kleinen Arbeitsschritte, die eine Lehrkraft im
Unterricht immer wieder einzeln wiederholt. Sie ersetzen die Lehrkraft **nicht**
— sie schaffen ihr Zeit für die Schüler, die wirklich Betreuung brauchen.

Prüffrage für jede Hilfe: *Kann ein Schüler mit Förderbedarf nach dieser kurzen
Erklärung den nächsten Schritt möglichst selbstständig durchführen?*

**Fachlicher Stand.** In `content.js` beginnt Mathematik 8 direkt mit linearen
Gleichungssystemen (`klasse8_rs`: „Einsetzverfahren", „Additionsverfahren";
`klasse8_gts`: „LGS: Einsetz- und Additionsverfahren"). Einfache Gleichungen
stehen in Klasse 7 („Lineare Gleichungen lösen", „Terme aufstellen und
vereinfachen") und gelten in Klasse 8 als vorausgesetzt. Genau dort hängen die
Förderschüler. Die Mikrohilfen sind **Aufbauhilfe für Klasse 8**, nicht
Erstunterricht — sie liefern die Grundlage nach, die der Kurs schon verlangt.

`gl01` bis `gl10` bleiben dabei in Klasse 7. **`gl11` ist der Übertritt:**
dieselben Schritte an einer Gleichung mit ZWEI Buchstaben.

> **Wie weit `gl11` trägt — nachgelesen, nicht behauptet** (Gegenlesen
> 11.09.2026). In `content.js` steht zum Thema „Einsetzverfahren" wörtlich:
> *„Eine Gleichung nach einer Variable auflösen und in die andere einsetzen.
> x + y = 10 und x − y = 4 → x = 4+y → (4+y)+y = 10 → 2y = 6 → y = 3, x = 7."*
> Der Griff, mit dem das Verfahren dort **anfängt**, setzt also einen **TERM**
> ein (`4+y`). `gl11` setzt eine **ZAHL** ein — das ist der Griff, mit dem das
> Verfahren **endet** (Rückeinsetzen, im Kursbeispiel der Schritt zu `x = 7`).
> Das ist ein echter Schritt des Verfahrens und die richtige Stelle für den
> Anfang: Er ist der einzige, den ein Förderschüler ohne Termumformung schafft.
> Es ist aber **nicht** der erste Griff, und die Reihe deckt das
> Einsetzverfahren damit **nicht** ab. Der Satz „gl11 setzt den Fuß hinein"
> (§9) ist so gemeint und nicht weiter. **[OFFEN für Abdullah: eine `gl12`, die
> einen TERM einsetzt — erst dann berührt die Reihe den Kursstoff der Klasse 8.]**

---

## 2. Das Wortbudget — gemessen, nicht geschätzt

### 2.1 Die Zählregel (gesprochene Wörter)

Gezählt wird, **was der Sprecher sagt**, nicht was auf der Tastatur steht. Ohne
diese Unterscheidung zählt eine Gleichung viel zu billig: `3x + 5 = 20` sind
fünf Tastatur-Tokens, aber **sieben gesprochene Wörter** („drei x plus fünf ist
gleich zwanzig"). Eine Hilfe voller Gleichungen käme sonst formal unter Budget
und wäre in Wirklichkeit 40 Sekunden lang.

Verbindliche Umrechnung (so rechnet `pruefe_mikrohilfe.py::woerter`):

| Zeichen | gesprochen | Wörter |
|---|---|---|
| Wort | — | 1 |
| ganze Zahl (`5`, `20`, `137`) | „fünf", „zwanzig" | **1** (deutsche Zahlwörter unter einer Million sind EIN Wort) |
| Dezimalzahl (`2,5`) | „zwei Komma fünf" | 3 |
| `3x` | „drei x" | 2 |
| `+` | „plus" | 1 |
| `−` `-` | „minus" | 1 |
| `·` `*` | „mal" | 1 |
| `:` `/` **allein stehend** | „geteilt durch" | 2 |
| `=` | „ist gleich" | **2** |
| `²` `³` | „Quadrat", „Kubik" | 1 |
| `√` | „Wurzel aus" | 2 |
| Satzzeichen, Bindestrich im Wort | — | 0 |

**Division wird mit Leerzeichen geschrieben: `15 : 3`, nicht `15:3`.** Der
Doppelpunkt ist das einzige zweideutige Zeichen — in „Wir prüfen:" wird er
nicht gesprochen, in `15 : 3` sind es zwei Wörter. Als Rechenzeichen gilt
deshalb nur ein Doppelpunkt, der **allein zwischen Leerzeichen** steht. Ohne
diese Schreibregel zählte `Teile durch 3: 15 : 3 = 5.` acht statt zehn Wörter.

**Der Wortzähler hat seinen eigenen Selbsttest** (`ZAEHLER_PROBEN`): 19 Sätze
mit von Hand ausgesprochenem und gezähltem Sollwert. Zwei Zeilen darin sind
echte gefundene Fehler — der allein stehende Doppelpunkt (fiel ersatzlos weg)
und `²`, das Python zu `\w` und **nicht** zu `\d` zählt, sodass `a²` als EIN
Wort durchging: `a² + b² = c²` ergab 6 statt 9. Beides hätte jede Pythagoras-
Hilfe der Reihe zu billig gerechnet. Eine dritte Zeile lief umgekehrt: Dort war
**mein Sollwert** falsch, nicht der Zähler (`15 : 3 = 5` sind sieben Wörter,
nicht sechs). Die Tafel prüft in beide Richtungen.

### 2.2 Die Zahlen

| Größe | Wert | Begründung |
|---|---|---|
| Sprechtempo | **2,0 Wörter/Sekunde** | Fördertempo, langsam und deutlich. Vorgabe des Auftraggebers. |
| Obergrenze | **60 Wörter** | 30 s × 2,0 = 60. Die 30-Sekunden-Regel, in Wörter umgerechnet. Harte Wand. |
| Warnung | **ab 55 Wörtern** | *hergeleitet:* Der Endzustand muss mindestens 3 s stehen bleiben (§5.3). 55 Wörter Sprache = 27,5 s, plus 3 s = **30,5 s — schon über der Regel.** Ab 55 Wörtern kann eine Hilfe die Standzeit nicht mehr tragen. Die rechnerische Grenze liegt bei 54; 55 ist die gerundete Warnschwelle. |
| Satzlänge | **höchstens 12 gesprochene Wörter** | 12 Wörter = 6 s = ein Fünftel der ganzen Hilfe in EINEM Satz. Mehr ist für Förderniveau keine Information mehr, sondern ein Gedankensprung. (Das Förderprofil erlaubt 8–14 Wörter je Satz — das gilt für eine gedruckte Seite, die man zurücklesen kann. Ein Video kann man nicht zurücklesen.) |
| Fragezeichen im Skript | **höchstens 1** | Abdullahs Geodreieck-Hilfe kam auf 75 Wörter (37,5 s) und scheiterte, **weil sie drei Fragen auf einmal enthielt**. Ein zweites Fragezeichen ist der Beweis, dass die Hilfe geteilt werden muss. |
| Imperativsätze im Skript | **genau 1, und zwar in Teil C** | „nur EIN Arbeitsschritt je Hilfe". Ein zweiter Befehl ist ein zweiter Arbeitsschritt — also eine zweite Hilfe. **Auch der Ort wird geprüft** (seit 11.09.2026): Der Prüfer zählte die Befehle vorher nur. Wer den Befehl nach B schob und C zum Aussagesatz machte, fuhr grün durch — dann begründet D eine Handlung, die schon zwei Teile vorher stand, und die feste Reihenfolge A B C D E F ist nur noch Papier. Gemessen an gl11 mit dem Befehl in B: **0 Befunde.** Jetzt eine Kaputt-Probe und eine Gegenprobe (ein Aussagesatz mit Operatorwort ist kein Befehl). |

Das Budget gilt für den **gesamten Sprechertext, alle sechs Teile zusammen**.
Nicht gezählt werden: `frage`, `vorwissen`, `bild`, `faengt_fehler_auf`
(Dokumentation für die Lehrkraft, wird nicht gesprochen) sowie `hilfe1` und
`hilfe3` (eigene Hilfestufen, eigene Budgets — §4).

### 2.3 Gegenprobe an den Beispielen des Auftraggebers

Die Zählregel wurde an seinen eigenen Sätzen geprüft. Sein Maßstab: die
Gleichungshilfe „+5 wegbekommen" kommt auf **43 Wörter = 21,5 s**.

| Teil | Text | Wörter |
|---|---|---|
| A | Du hast jetzt 3x + 5 = 20. | 10 |
| B | Wir wollen die +5 wegbekommen. | 6 |
| C | Rechne auf beiden Seiten −5. | 6 |
| D | Minus 5 hebt die plus 5 auf. | 7 |
| E | Jetzt muss dort 3x = 15 stehen. | 9 |
| F | Jetzt bist du wieder dran. | 5 |
| | **Summe** | **43** |

**43 Wörter, 21,5 s — genau seine Zahlen.** Die fünf Sätze A, B, C, E, F sind
wörtlich aus seinem Dokument; einzig Teil D ist hier ergänzt (bei ihm nicht
ausgeschrieben) und trifft mit 7 Wörtern die Summe exakt. Die Zählregel ist
damit an der Referenz kalibriert und nicht frei erfunden.

Wer über Budget kommt, **teilt die Hilfe**. Die Regel wird nicht aufgeweicht.

---

## 3. Aufbau — immer dieselben sechs Teile

| Teil | Name | Inhalt |
|---|---|---|
| **A** | ORIENTIERUNG | Was sieht der Schüler gerade? Muss den Startzustand seiner Aufgabe nennen. |
| **B** | ZIEL | Was wollen wir erreichen? |
| **C** | HANDLUNG | Was soll er konkret tun? Der EINE Arbeitsschritt, mit konkretem Verb. |
| **D** | KURZES WARUM | Warum dieser Schritt? Siehe §3.1. |
| **E** | KONTROLLE | Woran erkennt er, dass es geklappt hat? Muss konkrete Zahlen nennen. |
| **F** | ZURÜCK | Endet mit der Rücknahme an den Schüler. |

**Reihenfolge ist fest: A B C D E F.** Erst handeln, dann begründen — wer die
Begründung vor die Handlung stellt, verliert den Schüler, bevor er etwas getan
hat.

### 3.1 Wann ist D Pflicht?

| `art` | D | Grund |
|---|---|---|
| `rechenschritt` | **PFLICHT** | Eine Regel, die behauptet statt hergeleitet wird, bleibt nicht hängen (Erfahrung aus dem Physikprojekt). Ein Schüler, dem nur „rechne minus 5" gesagt wurde, kann es — und weiß nicht, warum. Beim nächsten Aufgabentyp steht er wieder. |
| `fehler` | **PFLICHT** | Eine Fehlerhilfe IST ein Warum. Ohne D bleibt sie ein Verbot. |
| `handgriff` | entfällt | Beim Anlegen des Geodreiecks gibt es nichts herzuleiten. Ein erzwungenes Warum wäre Füllmaterial und kostet Sekunden, die der Handgriff braucht. |

`art` ist eines dieser drei Wörter, sonst nichts. Der Prüfer verlangt D bei
`rechenschritt` und `fehler` und lässt es bei `handgriff` weg.

### 3.2 Teil E — die Kontrollzeile

E muss **mindestens eine Zahl oder einen Term** nennen. „Jetzt hast du es
richtig gemacht" ist keine Kontrolle — der Schüler kann nicht nachsehen.

Der genannte Zustand muss ein **echter Schritt der Aufgabe** sein (§6).

**Wie viel später E sein muss, hängt an der LÄNGE der Aufgabe** (entschieden
11.09.2026). Die alte Fassung verlangte bei *jeder* Aufgabe mit mehr als einem
Schritt einen **späteren** Zustand als A. Bei einer Aufgabe mit genau **zwei**
Schritten ist der spätere Zustand aber die **Lösung** — und die darf nach §4 in
keinem Text stehen. Die Regel widersprach sich selbst.

| Schritte der Aufgabe | was Teil E nennen muss |
|---|---|
| **1** (fertiger Term, z. B. a08) | den einen Schritt; es gibt nichts Späteres |
| **2** (z. B. a06, a02, a20) | einen **Markierschritt** oder **Teilzustand**: was nach dem einen Arbeitsschritt auf dem Blatt zu SEHEN ist. Einen ganzen Schritt darf E hier **nicht** nennen — `schritte[0]` hätte nichts bewegt, `schritte[1]` wäre die Lösung |
| **3 und mehr** (z. B. a03, a05) | den **Zwischenzustand** wörtlich — er existiert, er ist nicht die Lösung, also ist er die Kontrolle |

So sehen die drei betroffenen Kontrollzeilen aus — alle drei standen schon so
da und sind fachlich in Ordnung; **die Regel wurde an die Hilfen angepasst,
nicht umgekehrt**:

- `gl01` / a06: „Jetzt ist nur die −9 markiert, nicht das x." → Markierschritt
- `gl03` / a02: „Unter beiden Seiten steht −6, nicht nur links." → Teilzustand
- `gl10` / a20: „Links steht dann 19. Rechts steht auch 19." → Teilzustand

> **Warum dieser Weg und nicht der andere.** Man könnte statt dessen
> `aufgaben.json` um Zwischenzustände erweitern, bis jede Aufgabe drei Schritte
> hat (so hält es a05 mit `x = 15 : 3`). Für diese drei geht das nicht, ohne sie
> **fachlich zu verbiegen**: `gl01` lässt *markieren*, nicht rechnen — eine
> Rechenzeile in E behauptete einen Schritt, den der Schüler nicht getan hat.
> `gl03` ist eine Fehlerhilfe über die Beidseitigkeit; ihre Kontrolle muss
> zeigen, was **unter beiden Seiten** steht. `gl10` ist eine Probe und hat
> überhaupt keine Umformungskette. Geprüft, bevor entschieden wurde: keine der
> drei musste umgeschrieben werden.

> **Der eigentliche Befund war das Schweigen.** Die alte Forderung wurde nie
> durchgesetzt — sie hing an der Term-Schleife und sprach nur an, wenn E
> zufällig einen ganzen Schritt nennt. Eine Kontrollzeile aus nackten Zahlen
> lief an ihr vorbei: `gl02` mit „Links steht dann 15. Rechts steht auch 15."
> ergab **0 Befunde**, obwohl a03 drei Schritte hat. Die Regel steht jetzt
> **positiv** im Prüfer (ab drei Schritten MUSS der Zwischenzustand dastehen),
> mit Kaputt-Probe und zwei Gegenproben — eine davon schrumpft a03 auf zwei
> Schritte und verlangt, dass die Forderung dann **schweigt**.

### 3.3 Teil F — die Rücknahme

F endet mit genau einem dieser drei Sätze:

1. `Jetzt bist du wieder dran.` ← Regelfall
2. `Jetzt probierst du es selbst.`
3. `Jetzt machst du weiter.`

Das ist eine geschlossene Satzliste, keine Positivliste über Inhalte: Der
Schlusssatz ist ein Gestaltungsmerkmal der Reihe wie die Farbe des Vorspanns.
Elf Hilfen mit elf verschiedenen Schlüssen klingen nach elf Autoren.

---

## 4. Die drei Hilfestufen

| Stufe | Was | Regeln (prüfbar) |
|---|---|---|
| **Hilfe 1** | kleiner Denkanstoß, **KEINE Lösung** | Genau EIN Satz, muss eine **Frage** sein (endet mit `?`), höchstens **12 gesprochene Wörter**. Darf keinen späteren Zustand der Aufgabe und nicht ihre Lösung enthalten. Jeder Term, den sie nennt, muss im **Startzustand** der Aufgabe vorkommen. |
| **Hilfe 2** | die 30-Sekunden-Mikrohilfe (das Video) | §2, §3, §5 |
| **Hilfe 3** | derselbe Schritt an einer **ANDEREN** Aufgabe | Zeigt auf eine andere Aufgabenkennung (der Prüfer vergleicht). `text` + `kontrolle` zusammen höchstens **30 gesprochene Wörter** — halbes Budget, weil nur EIN Schritt gezeigt wird und die Orientierung schon gelaufen ist. Darf auch dort **nur den einen Schritt** zeigen, nicht die ganze Aufgabe lösen. Feld `kontrolle` nennt das Zwischenergebnis; es muss ein echter Schritt jener anderen Aufgabe sein. |

**Warum Hilfe 1 eine Frage sein muss:** Ein Denkanstoß im Aussagesatz ist schon
eine halbe Lösung („Neben dem 3x steht eine 5."). Die Frageform erzwingt, dass
der Schüler selbst hinsieht.

**Warum die eigene Aufgabe nie fertig gelöst wird:** Sonst schreibt der Schüler
das Ergebnis ab und hat den Schritt nicht gemacht. Der Prüfer setzt das hart
durch: Hat die Aufgabe mehr als einen Schritt, darf ihre Lösung in **keinem**
Text der Hilfe auftauchen — nicht im Skript, nicht in Hilfe 1, nicht in Hilfe 3,
nicht im Vorwissen.

---

## 5. Das Bild

Das Bild ist mindestens so wichtig wie der Text. Je Teil A–F wird notiert, **was
genau sichtbar ist** (`sichtbar`) und **was hervorgehoben wird**
(`hervorgehoben`).

> Diese Prosa ist die **Vorlage**. Damit Remotion sie zeichnen kann, steht
> dieselbe Aussage noch einmal als Daten im Feld `szene` — die Bausteine dafür
> stehen in **§12**. Die Prosa bleibt und ist die Gegenprobe.

### 5.1 Sprechertext und Bild müssen EXAKT zusammenpassen

**Prüfbar gemacht:** Jede Zahl und jeder Term, die in Teil X gesprochen werden,
müssen in `bild.X` wörtlich vorkommen. Wenn gesagt wird „Rechne auf beiden
Seiten minus 5", muss in `bild.C` stehen, **wo** die −5 auf beiden Seiten
hinkommt.

Das ist die Heft-gegen-Sim-Regel des Physikprojekts, auf Video übertragen. Dort
war es der teuerste Fehler der ganzen Reihe: Seiten verlangten Werte, die der
Bildschirm nicht zeigte. Ein Video, dessen Sprecher eine andere Zahl nennt als
das Bild zeigt, ist derselbe Fehler — nur schneller.

### 5.2 Wenig gleichzeitig

`bild.A` beginnt mit einem leeren Bild und der Aufgabe. Rechnungen entstehen
**Schritt für Schritt**; in keinem Teil steht mehr als der aktuelle Schritt neu
dazu. Alte Zeilen werden blass, nicht gelöscht — der Schüler muss sehen, woher
er kommt.

Jeder Teil hat genau **ein** `hervorgehoben`. Zwei Hervorhebungen gleichzeitig
sind zwei Informationen gleichzeitig.

### 5.3 Der Endzustand bleibt stehen

`bild.F` muss eine **Standzeit von mindestens drei Sekunden** ausweisen (das
Wort „Sekunden" muss dort vorkommen). Drei Sekunden sind bei Fördertempo sechs
Wörter Denkzeit — genug, um eine kurze Zeile abzuschreiben. Diese 3 s sind Teil
der 30 s und der Grund für die Warnschwelle 55 (§2.2).

### 5.4 Falsche Ergebnisse im Bild

Eine Fehlerhilfe muss das falsche Ergebnis zeigen — sonst weiß der Schüler
nicht, worüber geredet wird. Es darf aber **nie unmarkiert** dastehen. Im Bild
heißt die Markierung **„rotes Kreuz"** oder **„Fragezeichen"**; der Prüfer
verlangt eines von beiden im selben Teil. (Das Wort „durchgestrichen" ist
verboten, siehe §7 — im Bild wird nichts gestrichen, es wird gekreuzt.)

---

## 6. Die Aufgabenbindung (`aufgaben.json`)

**Jede Hilfe zeigt auf genau eine Aufgabe mit eigener Kennung.** Das ist kein
Beiwerk. Die Kontrollzeile nennt konkrete Zahlen („Jetzt muss dort 3x = 15
stehen"). Steht die Aufgabe auf dem Arbeitsblatt anders, **lügt das Video**.

Eine Aufgabe in `aufgaben.json`:

```json
{
  "kennung": "a03",
  "blatt": "GL-1",
  "nummer": "3",
  "aufgabe": "Löse: 3x + 5 = 20",
  "typ": "gleichung",
  "variable": "x",
  "schritte": ["3x + 5 = 20", "3x = 15", "x = 5"],
  "falsch": ["3x = 20"],
  "loesung": "x = 5"
}
```

- `schritte` — die **vollständige** Kette vom Startzustand bis zur Lösung.
  `schritte[0]` ist der Zustand, in dem der Schüler die Hilfe aufruft.
- `falsch` — die typischen **Falschergebnisse**, die in einer Hilfe genannt
  werden dürfen. Jedes muss in `falsch` stehen, bevor ein Text es ausspricht.
- `typ` ist `gleichung` (eine Variable, eine Lösung) oder `term` (Zusammenfassen).
- `gegeben` — **optional**, die Brücke zum Einsetzverfahren (seit 11.09.2026).
  Ein Wörterbuch Buchstabe → Zahl für einen **zweiten** Buchstaben, dessen Wert
  schon bekannt ist: `"gegeben": {"x": 4}` zu `"variable": "y"`.

> **Wofür `gegeben` da ist.** Der Startzustand von a10 ist `x + y = 10` — die
> Zeile, die **wirklich auf dem Blatt steht**, mit zwei Buchstaben. Ohne dieses
> Feld konnte der Prüfer sie nicht nachrechnen (`unbekannter Buchstabe x`) und
> brach mit Exitcode 2 ab. Die Ausweichlösung wäre gewesen, `4 + y = 10` als
> Startzustand zu hinterlegen — dann wäre das Einsetzen **schon passiert,
> bevor die Hilfe anfängt**, und der eine Arbeitsschritt von `gl11` hätte
> keinen Ort. Die Grundwahrheit darf sich nicht nach dem richten, was der
> Nachrechner gerade kann. Ein gegebener Buchstabe rechnet wie seine Zahl; der
> Prüfer rechnet damit **alle** Schritte durch und merkt, wenn die bekannte
> Zahl nicht zur Kette passt.

### 6.1 Der Prüfer rechnet `aufgaben.json` selbst nach

Eine Aufgabe mit falschen Zwischenschritten vergiftet jede Hilfe, die auf ihr
steht. Deshalb wird die Grundwahrheit nachgerechnet, nicht geglaubt:

- **`gleichung`:** Alle `schritte` müssen **dieselbe Lösung** haben
  (Äquivalenzumformungen ändern die Lösungsmenge nicht). Der letzte Schritt muss
  die Form `variable = Zahl` haben und `loesung` entsprechen.
  Ein Schritt darf eine **ausgeschriebene Division** sein (`x = 15 : 3`), und der
  Prüfer rechnet sie mit (seit 11.09.2026, `_lin`). Das ist kein Schmuck: Bei
  einer Aufgabe der Form `ax = b` ist der Teilschritt der **einzige** spätere
  Zustand, den die Kontrollzeile nennen kann, ohne die Lösung auszusprechen
  (§4) — ohne ihn müsste `gl04` „x = 5" zeigen, und der Schüler schreibt ab.
  Geschrieben wird mit Leerzeichen (`15 : 3`, §2.1); `: 0` und `: x` lehnt der
  Prüfer ab.
- **`gegeben`:** wird nachgeprüft, nicht geglaubt — es geht in **jede**
  Nachrechnung dieser Aufgabe ein, ein Tippfehler darin verschöbe die ganze
  Grundwahrheit lautlos. Jeder Name ein einzelner Buchstabe, nie die gesuchte
  `variable` selbst, jeder Wert eine Zahl. Vier Proben im Selbsttest: mit
  `gegeben` rechnet `x + y = 10` durch (Gegenprobe), ohne es nicht, eine
  falsche Zahl (`x = 5`) fällt als „verschiedene Lösungen" auf, und `gegeben`
  auf die gesuchte Variable gesetzt wird abgelehnt.
- **`term`:** Alle `schritte` müssen für x = 2 und x = 3 **denselben Wert**
  ergeben. `loesung` ist der letzte Schritt.
- **`falsch`:** Jeder Eintrag muss **nachweisbar falsch** sein — bei
  `gleichung` eine andere Lösung, bei `term` ein anderer Wert. Das fängt eine
  Fehlerhilfe ab, die etwas „widerlegt", was in Wahrheit richtig ist.
  (`3x + 2` und `5x` sind bei x = 1 beide 5 — geprüft wird deshalb bei x = 2
  UND x = 3.)
- **Andere `typ`-Werte werden abgelehnt**, nicht übersprungen. Für
  Handgriff-Aufgaben ist noch keine Nachrechnung geschrieben. Solange das so
  ist, meldet der Prüfer sie **laut** als Lücke. **[OFFEN für Abdullah]**

### 6.2 Was der Prüfer gegen die Aufgabe hält

| Prüfung | warum dort |
|---|---|
| `aufgabe` existiert in `aufgaben.json` | sonst zeigt die Hilfe ins Leere |
| Teil **A** enthält `schritte[0]` | A zeigt den Startzustand des Schülers |
| jeder Term in **A** und **E** ist ein echter `schritt` oder steht in `falsch` | die beiden Teile beschreiben den Zustand des Blattes. **Ausnahme: ein blanker Buchstabe der Aufgabe** (`variable` oder ein Name aus `gegeben`) — „nicht das x" und „für x steht die 4" behaupten keinen Zustand, sie zeigen auf einen Buchstaben. Zuerst galt die Ausnahme nur für E und nur für die gesuchte Variable; beim Bau von `gl11` war beides zu eng (dort ist der blanke Buchstabe `x`, gesucht wird `y`). Ein Buchstabe, der **nicht** zur Aufgabe gehört, bleibt ein Befund |
| ab **drei** Schritten: **E** nennt den Zwischenzustand wörtlich · bei **zwei** Schritten: E nennt keinen ganzen Schritt (§3.2) | sonst hat der Schritt nichts bewegt — oder E spricht die Lösung aus |
| jede Zahl in **A, B, C, D, E** kommt in der Aufgabe vor | B/C/D reden über die Handlung, nicht über den Zustand — geprüft wird auf Zahlenebene. A und E stehen seit 11.09.2026 mit dabei: die Termprüfung darüber lässt eine **nackte Zahl** absichtlich fallen („−5“ ist eine Anweisung, kein Zustand), und eine Kontrollzeile wie „Links steht dann 19. Rechts steht auch 19.“ nennt deshalb gar keinen Term. Gemessen an `gl10`: 19 durch 18 ersetzt → **0 Befunde**. Genau der Fall, den der Auftraggeber abgefangen haben wollte |
| ein `falsch`-Term nur in einem Satz mit **Verneinung** oder **Fragezeichen** | ein unmarkiertes Falschergebnis ist eine falsche Aussage |
| `loesung` taucht nirgends auf (bei mehr als einem Schritt) — **im Text UND im Bild** | §4. Das Bild steht seit 11.09.2026 mit dabei: `gl04` sagte „Rechts steht jetzt die 5." und blieb damit im Buchstaben der Regel, während `bild.E` und `bild.F` die fertige Zeile „x = 5" drei Sekunden lang groß zeigten. Der Schüler schreibt ab, was er **sieht**. Verglichen wird auf Fundstellen, nicht auf Zeichenketten — eine blanke 5 im Bild ist nicht die Zeile „x = 5" |
| `hilfe3.aufgabe` ist eine **andere**, existierende Kennung | §4 |
| Terme in `hilfe3.kontrolle` sind echte Schritte **jener** Aufgabe | dieselbe Regel, andere Aufgabe |

---

## 7. Sprache

Sprich wie eine geduldige Lehrkraft neben dem Schüler am Tisch.

- **NICHT** „Führe eine Äquivalenzumformung durch."
- **SONDERN** „Wir wollen die +5 wegbekommen. Deshalb rechnen wir auf beiden
  Seiten −5."

Kurze Sätze, aktive Sprache, direkt zum Schüler, konkrete Verben: **Rechne,
Suche, Markiere, Lege, Zeichne, Miss, Schreibe, Setze, Zähle, Teile, Kreise,
Lies, Trage, Prüfe, Ordne, Vergleiche, Klammere, Kürze.** Keine Fremdwörter.
Nichts vorwegnehmen, was für diesen Schritt noch nicht gebraucht wird. **Nur
EINE Information auf einmal.** Dezimalkomma, nie Dezimalpunkt.

### 7.1 Verbotene Wörter

Geprüft werden alle schülerseitigen Texte: `frage`, `skript`, `hilfe1`,
`hilfe3`, **und das `bild`** — ein Zeichner, dem man „die 5 wandert nach rechts"
in den Auftrag schreibt, zeichnet die falsche Vorstellung.

| Muster | warum verboten |
|---|---|
| `äquivalenzumformung` | Fachwort, das für den Schritt nichts leistet |
| `umstell…` („Term umstellen") | nährt die Vorstellung vom Hinüberschieben |
| `rüber…`, `hinüber…`, `drüber…` (nur am **Wortanfang**) | „rüberbringen" — die Zahl wandert nicht. Ohne die Wortgrenze traf das Muster „**Da**rüber erscheint eine Waage" in einer Bildbeschreibung und hätte auch „worüber" getroffen — ein Wort, das in §5.4 dieses Profils selbst steht. Ein Fehlalarm ist hier teuer, weil die übliche Reaktion darauf ist, die Regel aufzuweichen |
| `streich…` („wegstreichen") | nichts verschwindet; im Bild heißt es „rotes Kreuz" (§5.4) |
| `wander…` | Bewegungsbild statt beidseitiger Rechnung |
| `auf die andere seite …schieb/bring/…` | Seitenwechsel ohne Rechnung |
| `vorzeichenwechsel`, `vorzeichen wechsel` | Merkregel statt Herleitung |
| `koeffizient`, `isolier…`, `substitu…`, `term` | Fachwörter, für diesen Schritt nicht gebraucht |
| `klick…` | FELO-Hausregel (bestehend) |

**Die falsche Vorstellung ist das eigentliche Ziel dieser Liste.** „Die 5 kommt
rüber und wird minus" erzeugt einen Schüler, der bei `3x = 15` ratlos ist, weil
dort nichts zum Rüberbringen steht. Deshalb steht in jeder Hilfe **beide
Seiten** — im Text und im Bild.

Die Liste ist offen. Wer ein Muster ergänzt, schreibt die Begründung dazu.

### 7.2 Die Frage des Schülers (`frage`)

Höchstens 12 gesprochene Wörter, endet mit `?`, benennt **einen Schritt**, nicht
ein Thema. Nicht „So löst du Gleichungen", sondern „Wie bekomme ich die +5
weg?". Verboten in der Frage: `so löst du`, `alles über`, `grundlagen`, `thema`.

---

## 8. Das Schema einer Hilfe (verbindlich)

Eine Datei je Hilfe: `hilfen/<kennung>-<kurzname>.json`.

```json
{
  "kennung":   "gl02",
  "frage":     "Wie bekomme ich die +5 weg?",
  "art":       "rechenschritt",
  "aufgabe":   "a03",
  "vorwissen": ["… 2 bis 4 ganze Sätze, je höchstens 14 Wörter …"],
  "hilfe1":    "Welche Zahl stört neben dem 3x?",
  "skript": {
    "A": { "text": "Du hast jetzt 3x + 5 = 20.", "woerter": 10 },
    "B": { "text": "…", "woerter": 6 },
    "C": { "text": "…", "woerter": 6 },
    "D": { "text": "…", "woerter": 7 },
    "E": { "text": "…", "woerter": 9 },
    "F": { "text": "Jetzt bist du wieder dran.", "woerter": 5 }
  },
  "woerter_gesamt": 43,
  "sekunden_sprache": 21.5,
  "sekunden_gesamt":  24.5,
  "bild": {
    "A": { "sichtbar": "…", "hervorgehoben": "…" },
    "B": { "sichtbar": "…", "hervorgehoben": "…" },
    "C": { "sichtbar": "…", "hervorgehoben": "…" },
    "D": { "sichtbar": "…", "hervorgehoben": "…" },
    "E": { "sichtbar": "…", "hervorgehoben": "…" },
    "F": { "sichtbar": "…", "hervorgehoben": "…" }
  },
  "hilfe3": {
    "aufgabe":   "a11",
    "text":      "…derselbe Schritt an der anderen Aufgabe…",
    "kontrolle": "Dann steht dort 4x = 24."
  },
  "faengt_fehler_auf": "…der typische Fehler, konkret, mit Zahl oder Term…"
}
```

Feldregeln, die der Prüfer durchsetzt:

| Feld | Regel |
|---|---|
| `kennung` | `gl` + zwei Ziffern, gleich dem Dateinamen-Anfang. Präfix `gl` ist gegen alle vergebenen FELO-Kennungen geprüft und frei. |
| `frage` | §7.2 |
| `art` | `rechenschritt` \| `fehler` \| `handgriff` |
| `aufgabe` | existiert in `aufgaben.json` |
| `vorwissen` | 2–4 Sätze, je ≤ 14 Wörter (Maß des Förderprofils), endet je mit `.`, enthält nicht die Lösung |
| `hilfe1` | §4 — ein Satz, Frage, ≤ 12 Wörter |
| `skript` | Teile A–F (D nur bei `handgriff` entbehrlich), je `text` + `woerter` |
| `woerter` je Teil | muss der **nachgerechneten** Zahl entsprechen. Eine von Hand eingetragene Zahl, die nicht stimmt, ist ein Befund — sonst schreibt der nächste Autor 43 hin und meint 61. |
| `woerter_gesamt` | Summe, ≤ 60, Warnung ab 55 |
| `sekunden_sprache` | `woerter_gesamt / 2,0` |
| `sekunden_gesamt` | `sekunden_sprache + 3` (Standzeit), muss ≤ 30 sein |
| `bild` | dieselben Teile wie `skript`, je `sichtbar` + `hervorgehoben`, beide gefüllt |
| `hilfe3` | §4 — andere Aufgabe, ≤ 30 Wörter, `kontrolle` nennt ein Zwischenergebnis |
| `faengt_fehler_auf` | ≤ 25 Wörter, enthält mindestens eine Zahl oder einen Term; nennt sie einen falschen Term, muss er in `falsch` der Aufgabe stehen. **Vom Verneinungszwang ausgenommen** — dieses Feld beschreibt den Fehler, es spricht ihn nicht zum Schüler. Dazu über alle Dateien hinweg: **kein zweites Feld darf dieselbe Behauptung tragen** (verglichen wird ohne die Zahlen, §9.1). |

---

## 9. Die elf Hilfen der Reihe

`gl02` und `gl08` sind die Maßstab-Hilfen. Die anderen neun werden gegen sie
geschrieben und mit demselben Prüfer abgenommen.

| Kennung | Frage des Schülers | Art | Aufgabe | fängt allein auf |
|---|---|---|---|---|
| gl01 | Was soll am Ende allein stehen? | rechenschritt | a06 | kein Ziel vor Augen |
| **gl02** | **Wie bekomme ich die +5 weg?** | **rechenschritt** | **a03** | Zahl weg ohne Gegenzahl |
| gl03 | Warum muss ich auf beiden Seiten dasselbe rechnen? | fehler | a02 | nur eine Seite gerechnet |
| gl04 | Wie bekomme ich die 3 vor dem x weg? | rechenschritt | a05 | minus statt geteilt |
| gl05 | Wie bekomme ich die −4 weg? | rechenschritt | a04 | falsches Vorzeichen |
| gl06 | Womit fange ich an: Zahl daneben oder Zahl davor? | rechenschritt | a07 | falsche Reihenfolge |
| gl07 | Wie fasse ich 3x + 2x zusammen? | rechenschritt | a13 | mal statt plus |
| **gl08** | **Warum ist 3x + 2 nicht 5x?** | **fehler** | **a08** | Ungleiches zusammengefasst |
| gl09 | Was mache ich, wenn x auf beiden Seiten steht? | rechenschritt | a09 | links nicht zusammengefasst |
| gl10 | Wie mache ich die Probe? | rechenschritt | a20 | Probe ohne Vergleich |
| gl11 | Wie rechne ich weiter, wenn ich x schon kenne? | rechenschritt | a10 | dazugezählt statt eingesetzt |

### 9.1 Die Spalte „fängt allein auf" — jeder Fehler gehört GENAU einer Hilfe

Diese Spalte ist am 11.09.2026 dazugekommen und löst einen Befund, den bis
dahin **kein Prüfer sehen konnte**, weil er nicht in einer Datei steckt,
sondern **zwischen** den Dateien: `gl02` und `gl03` nannten in
`faengt_fehler_auf` beide den Fehler „rechnet nur links" — `gl09` ebenfalls.
Wer nach *der* Hilfe für diesen Fehler suchte, bekam drei Antworten.

**Die Regel:** Die Beide-Seiten-Frage gehört ganz zu `gl03`. Jede andere Hilfe
nennt **genau EINEN** Fehler, und zwar den, den **ihr eigenes Teil D**
beantwortet — nicht einen, den sie nur nebenbei mit auffängt, und keine zwei in
einem Satz. Prüffrage: *Wenn diese Hilfe fehlte, welchen Fehler könnte keine
andere auffangen?* **Diese Zuordnung prüft keine Maschine** (siehe Kasten unten);
sie steht deshalb hier bei den Autorenentscheidungen und nicht in §8 bei den
Feldregeln, die der Prüfer durchsetzt.

So fällt die Familie der vier Umformungs-Hilfen sauber auseinander:

| Hilfe | ihr Teil D | der Fehler, den nur sie auffängt |
|---|---|---|
| gl02 | „Minus 5 hebt die plus 5 auf." | **gar keine** Gegenrechnung — die Zahl wird für weg erklärt |
| gl03 | „Rechnest du nur links, kippt die Waage." | Gegenrechnung **nur auf einer** Seite |
| gl05 | „Plus 4 hebt die minus 4 auf." | Gegenrechnung mit **falschem Vorzeichen** |
| gl09 | „Minus 2x hebt die plus 2x auf. **Links bleiben 3x.**" | Gegenrechnung richtig, aber **links nicht zusammengefasst** |

> **Teil D muss den Fehler wirklich beantworten — gefunden beim Gegenlesen
> (11.09.2026).** `gl09` beanspruchte „links nicht zusammengefasst", sein Teil D
> sagte aber nur „Minus 2x hebt die plus 2x auf." — das ist die **rechte** Seite
> und wortgleich gebaut wie das D von `gl02` und `gl05`. Ein Schüler, der
> `5x = 12` schreibt, hat genau das getan, was dort steht; das Warum gab ihm
> keinen Grund, die linke Seite anzufassen. Aufgefangen wurde sein Fehler nur
> im Bild. D trägt jetzt den Satz „Links bleiben 3x." (49 → 53 Wörter, 29,5 s),
> `bild.D` zeigt die Zusammenfassung, `bild.E` nur noch die neue Zeile.
> Dieselbe Prüfung an den übrigen zehn: `gl01` nannte „schreibt x = −6" — das
> ist bei `x − 9 = 3` die Rechnung `3 − 9`, also **falsches Vorzeichen** und
> damit der Fehler von `gl05`; `gl01` lässt überhaupt nicht rechnen, sondern
> markieren, und kann ihn nicht auffangen. Das Feld nennt jetzt den Fehler, den
> `gl01` allein auffängt: „markiert das x statt der −9".

> **Was der Prüfer hier kann und was nicht.** Er hält jede Zeile gegen die
> Datei und meldet, wenn zwei Zeilen **denselben Text** tragen oder eine leer
> bleibt. Er sieht **nicht**, dass zwei verschieden formulierte Zeilen dasselbe
> meinen, und auch nicht, ob Teil D den genannten Fehler beantwortet — das
> bleibt eine Entscheidung des Autors. Die Spalte macht sie nur sichtbar und
> vergleichbar, statt sie in elf Fließtexten zu verstecken. Diese Grenze steht
> so auch im Prüfer (`tafel_vergleich`, `fehler_vergleich`), damit niemand sie
> für mehr hält, als sie ist.

> **Die Tafel allein reicht nicht — sie ist Dokumentation.** Die Spalte wird von
> Hand gepflegt; das Soll steht in den elf Dateien. Gemessen 11.09.2026: Setzt
> man die FELDER `faengt_fehler_auf` von `gl02` und `gl09` auf ihre alten Texte
> zurück und lässt die Tafel stehen, meldet der Prüfer **0 Befunde** — der
> Befund von Punkt 1 wäre lautlos zurückgedriftet. `fehler_vergleich` hält
> deshalb auch die Felder gegeneinander, und zwar **ohne ihre Zahlen**: Der
> historische Fall unterschied sich in genau einem Zeichen („rechnet die −5 nur
> links" gegen „rechnet die −6 nur links"). Kaputt-Probe und Gegenprobe an
> diesem Fall. Was er weiter nicht sieht: „zieht 2x nur rechts ab" und „rechnet
> die −6 nur links" meinen dasselbe und bleiben für ihn verschieden.

> **Diese Tafel wird vom Prüfer bewacht.** Sie stand beim ersten
> Durchgang in SECHS von zehn Zeilen falsch: Die Reihe wurde umgeplant,
> die Tafel blieb der alte Plan — und der nächste Autor hätte gegen ein
> Soll geschrieben, das nicht gilt. `pruefe_mikrohilfe.py` hält jede
> Zeile gegen die Datei; wer eine Frage, eine Art oder eine Aufgabe
> ändert, ändert beides oder bekommt einen Befund.


Reihenfolge ist Absicht: gl01 sichert das Ziel, gl02 baut die Zahl daneben ab,
gl03 begründet die Beidseitigkeit, gl04/gl05 nehmen Zahl davor und Minuszahl,
gl06 prüft die Reihenfolge, gl08 fängt den häufigsten Fehler beim
Zusammenfassen, gl09/gl10 führen an das Gleichungssystem der Klasse 8 heran —
und **gl11 setzt den Fuß hinein**: dieselben zehn Schritte, angewandt auf eine
Gleichung mit ZWEI Buchstaben. Das ist der **Rückeinsetz-Schritt** des
Einsetzverfahrens aus `content.js` (`klasse8_rs`) — der eine Griff des
Verfahrens, der ohne Termumformung auskommt, und deshalb der Fuß in der Tür.
Der ERSTE Griff (einen Term einsetzen) fehlt der Reihe noch; die genaue
Abgrenzung mit dem Wortlaut aus `content.js` steht in §1.

> **Diese Tabelle ist Dokumentation und läuft den Dateien hinterher.** `gl03`
> und `gl05` standen bis zum 11.09.2026 vertauscht darin (die Tabelle gab gl03
> „−4 weg / a04", die Datei trug „beide Seiten / a02" — und umgekehrt); beim
> Gegenlesen von gl03/gl04 sind die zwei Zeilen nach den Dateien richtiggestellt.
> **Beim Abschluss der Reihe gegen die elf Dateien nachlesen, nicht umgekehrt.**
> Stand 11.09.2026 ist die Tafel in allen elf Zeilen an den Dateien gemessen
> und wird vom Prüfer bewacht — auch die neue Spalte. Ohne Hilfe bleibt nur
> noch `a01` (der reine Zusammenfass-Term ohne Gleichheitszeichen); `a10` trägt
> jetzt `gl11`.

**Keine zwei Hilfen dürfen auf dieselbe Aufgabe zeigen.** Sonst treffen zwei
Videos auf derselben Zeile des Arbeitsblatts zusammen und widersprechen sich
in der Kontrollzeile. Der Prüfer hält das über alle Dateien hinweg nach —
ebenso doppelte Kennungen (ein Wörterbuch hätte die zweite Hilfe still
verschluckt) und Dateinamen, die nicht mit ihrer Kennung beginnen.

---

## 10. Anschluss an die Reihe

- Marke: **FELO** (Forschen · Eigeninitiative · Lernen · Organisieren).
  Band: FELO MATHEMATIK 8.
- Sollten je QR-Codes gedruckt werden: die Adresse bleibt **LernStar**
  (`helinla.github.io/LernStar`). An dieser Adresse hängen 108+ gedruckte Codes
  der Physikreihe.
- Kennungspräfix `gl` ist gegen alle vergebenen Präfixe geprüft (Physik
  Realschule, Gesamtschule, Gymnasium, Förderreihe, Oberstufe) und frei.
  Aufgabenkennungen `a01…` liegen in einem eigenen Namensraum und stehen nicht
  in `js/heft-bruecke.js`.

---

## 11. Der Prüfer

```
python3 pruefe_mikrohilfe.py            # Selbsttest + alle Hilfen
python3 pruefe_mikrohilfe.py gl02       # Selbsttest + nur diese
```

Der Lauf beginnt **immer** mit dem Selbsttest. Vier Stufen, in dieser
Reihenfolge:

1. **Wortzähler** gegen 19 von Hand ausgesprochene und gezählte Sätze (§2.1)
   — er trägt das ganze Budget, also kommt er zuerst dran.
2. **`aufgaben.json` nachgerechnet** (§6.1) — alle 23 Aufgaben, jeder Schritt,
   jede Lösung, jedes Falschergebnis, jedes `gegeben`.
3. **Die zwei Maßstab-Hilfen** `gl02` und `gl08` müssen ohne Befund durchgehen.
4. **68 Proben** — 46 an den Hilfen, 17 an `aufgaben.json`, 3 an der Tafel (§9),
   2 an den Fehlerfeldern der ganzen Reihe (§9.1).
   Davon **54 absichtlich kaputte**, von denen jede **genau ihre eigene**
   Meldung auslösen muss, und **14 Gegenproben**, bei denen die Meldung
   ausbleiben muss. Darunter die vier, die der Auftraggeber ausdrücklich
   verlangt hat: eine zu lange Hilfe, eine ohne Kontrolle, eine mit erfundener
   Aufgabenkennung und eine mit einer Kontrollzahl, die nicht zur Aufgabe passt.

Fällt eine Stufe durch, bricht der Prüfer mit **Exitcode 2** ab und urteilt
über nichts.

Dazu eine Prüfung gegen die eigene Blindheit: Der Prüfer **zählt seine
ausgeführten Prüfungen** und fällt durch, wenn es zu wenige sind. Gemessen an
den Maßstab-Hilfen: **330** Prüfungen für `gl02`, **322** für `gl08`. Die
Schwelle ist `30 × Teile + 40` (also 220 bei sechs Teilen) — weich genug, dass
eine Hilfe ohne Teil D nicht fälschlich anschlägt, hart genug, dass ein
ausgefallener Prüfblock sofort auffällt.

**Warum diese Zählung sein muss:** Eine Positivliste ist selbst eine
Fehlerquelle. Ein Prüfer, der ein fehlendes Feld still überspringt, meldet „in
Ordnung" und hat nichts angesehen. Genau das ist in diesem Projekt zweimal
passiert — `heft_gegen_sim.py` meldete grün, ohne zu prüfen, und `pruefe_profil`
maß in Band 8 die Antwortpositionen von null Einheiten.

**Die Gegenproben prüfen auch sich selbst.** Beim ersten Lauf fiel die Probe
„Bild passt nicht zum Sprechertext" **nicht** durch — zu Recht: sie hatte nur
`bild.C.sichtbar` ersetzt, und in `bild.C.hervorgehoben` stand die −5 weiter.
Der Prüfer war richtig, die Probe war falsch. Wer eine Probe ergänzt, ersetzt
deshalb **den ganzen Teil**, nicht ein Feld darin.

---

## 12. Die Bildsprache (Feld `szene`)

`bild` ist Prosa: „Um die +5 liegt ein roter Ring." Ein Mensch kann danach
zeichnen, Remotion nicht. Deshalb trägt jede Hilfe dieselbe Aussage ein zweites
Mal als **Daten**: `szene` mit je einer Liste Bausteine für A bis F.

**Die Prosa ist die Wahrheit, die Szene ist die Übersetzung.** Sie wurde Teil
für Teil dagegen gelesen, ob sie zum gesprochenen Satz passt (§5.1). Wer die
Szene schreibt, erfindet nichts: Weicht sie von der Prosa ab, ist einer von
beiden falsch — das ist ein Befund, keine Geschmacksfrage. `narration_bauen.py`
hält beide gegeneinander (unten).

### 12.1 Die Tafel

Gezeichnet wird auf **drei Spalten**: linke Seite · `=` · rechte Seite. Alle
Zeilen teilen sich diese Spalten, deshalb steht das, was unter der linken Seite
erscheint, auch wirklich unter der linken Seite. Neue Zeilen wachsen nach
unten; alte werden **blass**, nicht gelöscht (§5.2).

Um die Tafel herum steht ein **Rahmen**, der nicht zur Szene gehört und in
jedem Teil gleich bleibt: oben Kennung und die Frage des Schülers, unten der
gesprochene Satz als Untertitel. „Das Bild ist leer" in `bild.A` meint die
Tafel, nicht den Rahmen.

### 12.2 Die Bausteine

Ein Baustein ist ein Objekt mit **genau einem Leitfeld**. Mehr Bausteine gibt
es nicht; wer einen braucht, der fehlt, trägt ihn hier nach — er schreibt keine
Prosa in die Szene.

| Baustein | Felder | Was er tut |
|---|---|---|
| `{"zeile": "3x + 5 = 20"}` | — | Zeile groß auf die Tafel. Weitere `zeile` stellen sich darunter, ohne die vorige blass zu machen. |
| `{"zielzeile": "x = ⬚"}` | — | blasse Zielzeile („am Ende soll dort stehen …"), verändert nichts. |
| `{"kasten": "4"}` | — | eine **gegebene** Zahl im neutralen Kasten unter der Zeile („deine 4", „die 4 für das x"). Kein Rechenschritt, keine Bewertung — deshalb auch keine der vier Farben. |
| `{"ring": "+5"}` | `farbe` (Vorgabe `rot`) | legt einen Ring um einen Teil der aktiven Zeile. Der Ring verschiebt nichts — die Zeile steht, wo sie stand. |
| `{"markiere": "5x"}` | `farbe` (Vorgabe `blau`) | hinterlegt statt einzuringen (ruhiger als der Ring). Umfasst der Term die **ganze** Seite, wird daraus ein Feld um die Zeile. |
| `{"gross": "3"}` | — | lässt einen Teil der Zeile größer werden (`gl07 D`: „dann werden die 3 und die 2 davor groß"). |
| `{"buendel": [{"unter":"3x","inhalt":"x"},{"unter":"2","inhalt":""}]}` | — | unter jeden genannten Term ein Kästchen. Gleiche Kästchen sagen „hier steckt dasselbe drin" (`gl07 D`), ein leeres „hier steckt nichts dergleichen" (`gl08 D`). Zwei Einträge auf denselben Term treffen das **erste und das zweite** Vorkommen. |
| `{"pfeile": {"blass":"5","kraeftig":"+2"}}` | — | zwei Pfeile von unten: die **Wahl** zwischen zwei Stellen (`gl06 B`). Zeigegeste, kein Zustand — sie stehen nur in ihrem eigenen Teil. |
| `{"unterBeide": "−5"}` | — | schreibt denselben Term unter **beide** Seiten, gleichzeitig. Der Kern der Reihe. |
| `{"unterLinks": "−6"}` `{"unterRechts": "−6"}` | — | dasselbe unter **eine** Seite. Nur für die Gegenprobe da, die zeigt, was dann schiefgeht (`gl03 D`). |
| `{"hebeAuf": ["+5","−5"]}` | `wird` (Vorgabe `"0"`) | Paar aus Zeile und Rechenzeile wird grün, darunter erscheint grün, was übrig bleibt (`0`, bei `gl04` `x`). |
| `{"ersetze": {"was":"4x","durch":"4 · 4"}}` | `farbe` (Vorgabe `gelb`) | tauscht in der Zeile, die den Term trägt, **an Ort und Stelle** und hebt das Neue hervor (Einsetzen, `gl10`/`gl11`). |
| `{"neueZeile": "3x = 15"}` | `hervor` | alles davor wird blass, die neue Zeile steht groß darunter. `hervor` ringt einen Teil der neuen Zeile ein. |
| `{"nurNoch": "3x = 15"}` | — | räumt die Tafel ab und lässt genau **eine** Zeile stehen — die unterste, die den Term trägt („steht allein im Bild"). Das Gerüst darunter (Kästchen, Pfeile) geht mit ab, die Bewertung der Zeile bleibt. |
| `{"kreuz": "5x"}` `{"frage": "5x"}` `{"haken": "3x + 2"}` | — | Urteilszeichen neben die genannte Zeile: rotes Kreuz, gelbes Fragezeichen, grüner Haken. Ein Falschergebnis steht nie ohne eines davon (§5.4). |
| `{"waage": {"links":"x + 6","rechts":"14","kippt":"rechts"}}` | — | Waage; `kippt` ist `links`, `rechts`, `keine` oder fehlt (= gerade). |
| `{"notiz": "nicht nur links"}` | — | kleine Zeile unter dem Bild. |
| `{"halte": 3}` | — | Sekunden, die der Endzustand stehen bleibt. Kein Bild, nur Zeit. |
| `{"zusammen": [ … ]}` | — | bündelt Bausteine zu **einem** Vorgang und zählt als **eine** Hervorhebung (§12.4). Fürs Bild ist das Bündel nichts; es wird ausgepackt. |
| `{"gegenprobe": [ … ]}` | — | wie `zusammen`, aber alles darin ist **nach seinem Teil wieder weg**: „was passiert, wenn du es falsch machst" (`gl03 D`). |

> **Warum eine Gegenprobe nicht `zusammen` sein darf.** Am Standbild gefunden:
> Mit `zusammen` blieb das widerlegte `x = 14 ✗` in `gl03` auch in E und F
> stehen — ausgerechnet in den drei Sekunden, in denen der Schüler abschreibt.
> Ein Falschergebnis trug zwar sein Kreuz (§5.4) und war damit nie
> *unmarkiert*; es stand nur genau dort, wo das Richtige stehen sollte. Eine
> Gegenprobe ist ein Vorführstück, kein Zustand der Tafel.

**Terme werden gesucht, nicht buchstabiert.** `"+5"` findet die `+ 5` in
`3x + 5`; Leerzeichen zählen nicht, und jeder Strich gilt als Minus. Der Autor
schreibt den Term so, wie er in der Bildbeschreibung steht.

**Die Waage ist EIN Gerät, nicht eine Reihe von Bildern.** Wer sie noch einmal
setzt, verstellt sie; nicht genannte Felder bleiben, wie sie waren. `gl03` hat
deshalb eine Waage, die in D kippt und in E wieder gerade steht — nicht drei
Waagen untereinander.

**Es gibt höchstens EINE offene Rechenzeile.** Ein neues `unter…` löst die
vorige ab, solange `hebeAuf` oder `neueZeile` sie nicht festgeschrieben haben.
Ohne diese Regel stapelte `gl03` drei −6-Zeilen übereinander: C rechnet
richtig, D zeigt die Gegenprobe, E rechnet wieder richtig.

**Zweimal dasselbe in EINEM Teil meint zwei Stellen** (`gl10 E`: „beide 19
werden grün"), dasselbe in einem **späteren** Teil dieselbe Hervorhebung, neu
betont (`gl01` wiederholt den roten Ring in C, D und E).

### 12.3 Farben — vier, mehr nicht

| Wort | Farbe aus `src/theme.ts` | Bedeutung |
|---|---|---|
| `rot` | `COLORS.red` | „sieh hier hin" — das, was stört, und das Falsche |
| `gruen` | `COLORS.green` | richtig, oder: hebt sich auf |
| `gelb` | `COLORS.amber` | die zweite Hervorhebung, wenn Rot schon vergeben ist |
| `blau` | `COLORS.sky` | ruhige Markierung, die nichts bewertet |

Grün und Rot sind **belegt** und dürfen nichts anderes heißen: Ein grüner Ring
sagt „richtig", ein roter „hier stimmt etwas nicht". Deshalb setzen `hebeAuf`
und `haken` immer Grün, `kreuz` immer Rot — dort ist keine Farbe zu wählen.

### 12.4 Regeln, die die Szene einhalten muss

- **Je Teil genau eine Hervorhebung.** Gezählt wird alles außer `notiz`,
  `nurNoch` und `halte`. Gehören mehrere Bausteine zu **einem** Vorgang, bündelt
  sie `zusammen` — das zählt als eine.

  > **Warum es `zusammen` geben muss.** Der Zähler zählte Bausteine, die
  > Bildbeschreibung zählt Gedanken, und in sieben Teilen gingen die beiden
  > auseinander: „die beiden gelben Ringe um 3x und 2x" (`gl07 B`) ist **ein**
  > `hervorgehoben`, aber zwei `ring`. Dasselbe bei „das 5x mit dem
  > Fragezeichen" (`gl08 B`), „der grüne Haken an 3x + 2" neben dem roten Kreuz
  > (`gl08 E`), „die zwei grünen 19" (`gl10 E`), „die beiden gelben Ringe um x
  > und 4" (`gl11 D`), dem gelben Feld aus `zeile` + `markiere` (`gl07 C`) und
  > der ganzen Gegenprobe von `gl03 D`. Die Prosa hatte in allen sieben Fällen
  > recht; der Zähler war zu grob. `zusammen` macht die Bündelung zur Angabe
  > des Autors, statt sie den Zähler raten zu lassen — und `zusammen` in
  > `zusammen` ist verboten, sonst ließe sich die Regel durch Schachteln
  > beliebig aushebeln.

- **Teil A fängt mit einer `zeile` an** — davor ist das Bild leer (auch, wenn
  sie in einem `zusammen` steht).
- **Teil F braucht `halte` mit mindestens 3** (§5.3).
- **Eine Hervorhebung bleibt stehen, bis eine andere sie ablöst.** `hebeAuf`
  löst den Ring auf demselben Term ab: In `gl02` wird die rot eingeringte +5 in
  Teil D grün, statt rot und grün nebeneinander zu tragen. Das Paar soll als
  **ein** Paar zu lesen sein.
- **Jeder sichtbare Text der Szene muss in der Bildbeschreibung desselben Teils
  vorkommen.** Das ist §5.1 auf die Daten übertragen und die einzige Klammer,
  die Prosa und Szene zusammenhält.

### 12.5 Der Weg zum Video

```
python3 narration_bauen.py gl02     # Sprechfassung + Audio + Szene + Registrierung
cd ../videos-remotion
npx remotion render Mikrohilfe-gl02 out/mh-gl02.mp4
```

`narration_bauen.py` prüft die Szene, bevor es etwas schreibt (Leitfeld, Farbe,
eine Hervorhebung, `halte` in F, `nurNoch` nur auf eine Zeile, die es gibt, und
die Klammer aus §12.4). Es erzeugt die Sprechfassung mit `sprechfassung.py` —
**kein Sprechertext wird abgetippt**, sonst driften Hilfe und Video
auseinander. Gesprochen wird mit 140 Wörtern je Minute; die Systemstimme rastet
zwischen 110 und 150 (gemessen: gl02 dort immer 15,18 s, bei 178 nur 13,80 s).

**Die Bildlängen kommen aus den gemessenen Zeitmarken**
(`mh-<kennung>.timings.json`, aus dem fertigen Audio), plus 1 s Nachlauf je
Teil, plus `halte` am Ende; kein Teil ist kürzer als 2,5 s. Ohne Zeitmarken
wird eine Hilfe **nicht registriert** — lieber kein Video als eines mit
geschätzten Frames. Gemessen für `gl02`: 15,2 s Sprache, **24,3 s Video**, davon
4,0 s Standbild am Ende.

Eine einzige Komponente zeichnet alle elf: `src/videos/Mikrohilfe.tsx`. Die
Hilfen unterscheiden sich in den Daten, nicht im Aussehen; registriert wird in
`src/Root.tsx` über eine Schleife über die Kennungen.

### 12.6 Was noch fehlt

Alle elf Hilfen sind übersetzt, gerendert und Teil für Teil am Standbild
gegengelesen. Bis auf **einen** ist damit jeder Baustein der Tabelle in einem
fertigen Video gesehen worden.

> **Ungesehen ist `unterRechts`.** Er steht nur als Gegenstück zu `unterLinks`
> in der Tabelle; keine der elf Hilfen führt ihre Gegenprobe auf der rechten
> Seite. Gebaut heißt nicht geprüft — wer ihn zuerst benutzt, sieht ihn sich am
> Standbild an, bevor er sich auf ihn verlässt.

Die beiden Bildideen ohne Baustein sind nachgetragen: die **zwei Pfeile**
heißen `pfeile` (`gl06 B`), das **Kästchen-Bündel** heißt `buendel` und ist für
`gl07 D` und `gl08 D` zusammen entworfen. Dazu kamen `kasten`, `gross`,
`unterLinks`/`unterRechts`, `zusammen` und `gegenprobe`.

**Was die Bildsprache weiterhin nicht kann** — je ein Befund, kein Versäumnis
des Autors:

- **Reihenfolge innerhalb eines Teils.** `gl08 C` sagt „Zuerst … um 3x … Dann
  … um die 2", `gl07 D` „Dann werden die 3 und die 2 davor groß". Ein Teil hat
  einen Zustand, keinen Ablauf; beides erscheint gemeinsam.
- **Hervorhebung IN einer Hervorhebung.** „Darin leuchtet das x gelb auf"
  (`gl08 C`) verlangt einen Ring im Ring. Die Zerlegung einer Zeile kennt
  mehrere Zeichen auf **einem** Stück, aber kein Zeichen in einem Zeichen.
- **Ein `ersetze`, das den alten Term blass stehen lässt.** `gl11 C/D` verlangt
  das x blass **und** die 4 an seiner Stelle, um danach beide zu ringen. Der
  Tausch löscht; der Ring auf „das blasse x" geht deshalb ins Leere. Hier muss
  entweder die Bildsprache nachziehen oder die Bildbeschreibung.
- **Etwas NEBEN die Tafel stellen.** „Daneben läuft die Gegenprobe" (`gl03 D`),
  „Darüber erscheint eine Waage" (`gl10 D`). Die Tafel wächst nach unten.
- **Eine einzelne Zeile blass machen.** Blass wird nur alles zusammen, durch
  `neueZeile`. Deshalb bleiben die −2 in `gl06 D` und die Zeile in `gl10 D`
  hell, obwohl die Bildbeschreibung „blass" sagt.
