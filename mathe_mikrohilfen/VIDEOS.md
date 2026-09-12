# Die elf Mikrohilfen als Video

Stand 11.09.2026. Alle elf sind gebaut, gerendert und **Teil für Teil am
gerenderten Standbild** gegengelesen — nicht stichprobenhaft.

Gemessen wird an der **ausgelieferten Datei**: Länge mit `ffprobe`, Bild mit
sechs Standbildern je Hilfe, gezogen aus dem fertigen `mp4` in dem Augenblick,
in dem der jeweilige Satz noch gesprochen wird (80 % der Sprechdauer). Nicht
aus einem zweiten Renderlauf und nicht aus dem Wortmodell.

Die Standbilder liegen in **`mathe_mikrohilfen/standbilder/`**: je Hilfe ein
Kontaktbogen `bogen-<kennung>.png` mit allen sechs Teilen, dazu die vier
Einzelbilder zu den offenen Befunden aus §3 in voller Auflösung.

---

## 1. Die elf Videos

| Kennung | Frage des Schülers | Aufgabe | Länge | Datei | geprüft |
|---|---|---|---|---|---|
| gl01 | Was soll am Ende allein stehen? | a06 | **25,32 s** | `videos-remotion/out/mh-gl01.mp4` | ja — **mit Befund**, siehe §3.1 |
| gl02 | Wie bekomme ich die +5 weg? | a03 | **24,26 s** | `videos-remotion/out/mh-gl02.mp4` | ja, ohne Befund |
| gl03 | Warum muss ich auf beiden Seiten dasselbe rechnen? | a02 | **24,36 s** | `videos-remotion/out/mh-gl03.mp4` | ja — Befund gefunden und **behoben**, §4.1 |
| gl04 | Wie bekomme ich die 3 vor dem x weg? | a05 | **25,92 s** | `videos-remotion/out/mh-gl04.mp4` | ja — Befund gefunden und **behoben**, §4.2 |
| gl05 | Wie bekomme ich die −4 weg? | a04 | **23,36 s** | `videos-remotion/out/mh-gl05.mp4` | ja, ohne Befund |
| gl06 | Womit fange ich an: Zahl daneben oder Zahl davor? | a07 | **28,35 s** | `videos-remotion/out/mh-gl06.mp4` | ja, kleine Abweichungen §3.5 |
| gl07 | Wie fasse ich 3x + 2x zusammen? | a13 | **28,18 s** | `videos-remotion/out/mh-gl07.mp4` | ja, kleine Abweichungen §3.5 |
| gl08 | Warum ist 3x + 2 nicht 5x? | a08 | **27,52 s** | `videos-remotion/out/mh-gl08.mp4` | ja, kleine Abweichungen §3.5 |
| gl09 | Was mache ich, wenn x auf beiden Seiten steht? | a09 | **27,18 s** | `videos-remotion/out/mh-gl09.mp4` | ja — **mit Befund**, §3.3 |
| gl10 | Wie mache ich die Probe? | a20 | **26,75 s** | `videos-remotion/out/mh-gl10.mp4` | ja — **mit Befund**, §3.4 |
| gl11 | Wie rechne ich weiter, wenn ich x schon kenne? | a10 | **25,45 s** | `videos-remotion/out/mh-gl11.mp4` | ja — **mit Befund**, §3.2 |

**Median 25,9 s · längste 28,35 s (gl06) · über 30 s: 0 von 11.** Die Regel des
Auftraggebers ist eingehalten, mit 1,65 s Luft bei der längsten.

Die Standzeit liegt bei allen elf zwischen 9,01 und 9,10 s: 3 s `halte` am
Ende plus 1 s Nachlauf je Teil. Die kürzeste Hilfe spricht 14,3 s, die
längste 19,3 s.

---

## 2. Was für dieses Ergebnis nötig war

**Die Szenendaten waren nicht fertig.** Von elf Hilfen hatten vier gar kein
Feld `szene` (gl03, gl08, gl10, gl11), zwei hatten Lücken (gl06 ohne Teil B,
gl07 ohne Teil D). Gebaut und registriert waren fünf, gerendert drei. Übersetzt
wurden die fehlenden Teile aus der Prosa; die offenen Stellen sind in
`szene_offen` jeder Hilfe festgehalten, nicht weggelassen.

**Sieben Bausteine fehlten der Bildsprache** und sind in PROFIL §12.2
nachgetragen — nicht als Prosa in die Szene geschmuggelt:
`zusammen` · `gegenprobe` · `kasten` · `buendel` · `pfeile` · `gross` ·
`unterLinks`/`unterRechts`. Die beiden von §12.6 ausdrücklich offen gehaltenen
Bildideen (die zwei Pfeile in gl06 B, das Kästchen-Bündel in gl07 D / gl08 D)
sind damit erledigt.

**Die Regel „je Teil eine Hervorhebung" war zu grob.** In sieben Teilen zählte
der Prüfer Bausteine, während die Bildbeschreibung Gedanken zählt — „die beiden
gelben Ringe um 3x und 2x" ist EIN `hervorgehoben`, aber zwei `ring`. Statt es
siebenmal örtlich zu umgehen, gibt es jetzt `zusammen`; die Herleitung steht in
PROFIL §12.4.

---

## 3. Befunde, die offen sind

Diese vier sind **Entscheidungen über den Inhalt**, nicht über das Werkzeug.
Die Prosa in `bild` ist die abgenommene Wahrheit; sie wird nicht im
Vorbeigehen umgeschrieben.

### 3.1 gl01 — vier Teile, ein Bild; und Teil D zeigt nicht, wovon er spricht

Gemessen am Pixel: **die Tafel ändert sich von Teil C bis zum Ende nicht mehr.**
C → D → E → F sind bildgleich (0,000 % veränderte Fläche). Das sind 448 von
758 Frames, also **14,9 s der 25,3 s** mit stehendem Bild.

Schwerer wiegt: Die Bildbeschreibung von D hebt **„das leere Feld hinter dem
x"** hervor — dieses Feld steht überhaupt nicht im Bild. Die Zielzeile zeigt
nur ein blasses `x`. PROFIL §12.2 führt als Beispiel `{"zielzeile": "x = ⬚"}`
— genau das scheitert aber an der Klammer aus §12.4, weil das Zeichen `⬚` in
der Bildbeschreibung von B nicht vorkommt (dort steht „rechts ein leeres
Feld" in Worten).

> **Zu entscheiden:** Entweder die Bildbeschreibung von gl01 B/D schreibt das
> leere Feld als Zeichen, oder `zielzeile` bekommt eine eigene Schreibweise
> dafür. Danach sollten C, D und E auch drei verschiedene Bilder zeigen.

### 3.2 gl11 D — der Satz nennt ein x, das im Bild nicht mehr existiert

Gesprochen wird **„x und 4 sind dieselbe Zahl."** Im Bild steht zu diesem
Zeitpunkt `4 + y = 10` und die 4 im grauen Kasten — **kein x**. Teil C hat es
ersetzt.

Die Bildbeschreibung verlangt in C, dass das x *blass stehen bleibt* und die 4
*an seiner Stelle* erscheint, um in D beide zu ringen. `ersetze` tauscht aber;
der alte Term ist danach weg. Zwei Zeichen an einem Platz kann die Bildsprache
nicht.

Das ist die Heft-gegen-Sim-Regel auf Video: Der Sprecher nennt etwas, das der
Bildschirm nicht zeigt. Von allen Befunden ist dieser der schwerste.

> **Zu entscheiden:** Entweder `ersetze` bekommt eine Fassung, die den alten
> Term blass an Ort und Stelle lässt — oder die Bildbeschreibung von C/D wird
> nachgezogen. Der billigste Weg wäre, den grauen Kasten in A mit `x = 4` zu
> beschriften statt mit `4`; dann stimmt D's Satz wieder, ohne dass ein
> Baustein dazukommt.

### 3.3 gl09 D — die grüne Null auf der rechten Seite fehlt

Gesprochen wird **„Minus 2x hebt die plus 2x auf. Links bleiben 3x."** Die
Bildbeschreibung dazu: „Rechts steht jetzt 2x − 2x. **Daraus wird eine grüne
0.** Links bleiben von 5x − 2x noch 3x."

Im Bild wird nur die linke Hälfte bedient: 5x wird grün, links erscheint das
grüne 3x. Das `plus 2x`, von dem der erste Satzteil spricht, bleibt rechts
weiß und unverändert; die grüne 0 gibt es nicht.

Ursache: `hebeAuf` kann genau **eine** Seite bedienen — es rechnet die Seite
aus dem ersten Term des Paars. gl09 braucht beide: rechts die Aufhebung zu 0,
links den Rest 3x.

> **Zu entscheiden:** `hebeAuf` müsste zwei Ergebnisse tragen können (rechts
> `0`, links `3x`). Das betrifft nur gl09; die drei anderen `hebeAuf`-Hilfen
> (gl02, gl04, gl05) heben auf derselben Seite auf, auf der der Rest steht.

### 3.4 gl10 E — die richtige Zahl trägt einen roten Ring

In Teil E sagt der Sprecher „Links steht dann 19. Rechts steht auch 19." — die
Probe ist damit aufgegangen, die 4 ist **richtig**. Sie trägt in diesem
Augenblick aber immer noch den **roten** Ring aus Teil B.

Rot ist nach PROFIL §12.3 belegt: „das, was stört, und das Falsche". Eine
bestätigte Lösung rot zu ringen, während der Ton sie bestätigt, sagt das
Gegenteil. In Teil F ist der Ring weg (die Tafel wird abgeräumt), in E steht er.

Die Szene ist der Prosa treu — B verlangt ausdrücklich einen roten Ring, und
danach sagt die Bildbeschreibung nichts mehr; nach §12.4 bleibt eine
Hervorhebung stehen, bis eine andere sie ablöst.

> **Zu entscheiden:** In B ist Rot als „sieh hier hin" gemeint, solange die 4
> ungeprüft ist. Sobald sie geprüft ist, müsste sie grün werden oder den Ring
> verlieren. Sauber wäre, in E das Feld grün zu setzen — ein Baustein dafür
> gibt es bereits.

### 3.5 Kleinere Abweichungen, alle in `szene_offen` der jeweiligen Hilfe

- **gl06 D, gl10 D:** „bleibt blass stehen" — bleibt stehen, aber hell. Blass
  wird auf der Tafel nur alles zusammen, durch `neueZeile`.
- **gl08 C:** „Zuerst … um 3x. Dann … um die 2" und „darin leuchtet das x gelb
  auf" — ein Teil hat einen Zustand, keinen Ablauf, und ein Zeichen im Zeichen
  zeichnet die Komponente nicht. Beide Rahmen erscheinen gemeinsam.
- **gl08 E/F:** Die gelben Ringe aus C bleiben auf `3x + 2` stehen, bis F
  abräumt; die Bildbeschreibung von E erwähnt sie nicht mehr.
- **gl10 D, gl03 D:** „Darüber erscheint eine Waage" / „Daneben läuft die
  Gegenprobe" — die Tafel wächst nach unten, nicht nach oben oder zur Seite.
- **gl11 B:** Die Zielzeile zeigt nur den Buchstaben `y`; mehr nennt die
  Bildbeschreibung nicht.
- **Volle Zeilen sitzen rechts neben der Mitte.** Die Tafel hat drei Spalten
  und richtet sich am `=` aus. Eine Zeile ohne `=` (das gelbe Feld in gl07 C/D,
  der graue Kasten in gl10/gl11) steht deshalb mittig unter dem
  Gleichheitszeichen — bei gl07 D rund 140 px rechts von der Mitte der Zeile
  darüber. Nicht falsch, aber sichtbar versetzt.

---

## 4. Befunde, die behoben sind

### 4.1 gl03 — das widerlegte Ergebnis stand in der Abschreibzeit

**Nur am gerenderten Bild zu sehen.** Die Gegenprobe in Teil D zeigt
`x = 14 ✗`. Mit einem gewöhnlichen `zusammen`-Bündel blieb diese Zeile auf der
Tafel — auch in E („Unter beiden Seiten steht −6") und in F, also **ausgerechnet
in den drei Sekunden, in denen der Schüler abschreibt.** Das Kreuz war da,
§5.4 also formal erfüllt; das Falsche stand nur genau dort, wo das Richtige
stehen sollte.

Behoben mit dem Baustein `gegenprobe` (PROFIL §12.2): Was darin steht, ist nach
seinem Teil wieder weg. Eine Gegenprobe ist ein Vorführstück, kein Zustand der
Tafel. Nachgeprüft am neuen Standbild: In E und F steht die gerade Waage mit
den beiden −6 — genau das, was die Bildbeschreibung von F verlangt.

### 4.2 gl04 D — eine Hervorhebung, die es gab, wurde nie gezeichnet

**Nur am gerenderten Bild zu sehen.** Die Bildbeschreibung hebt „das Paar 3x
und : 3" hervor und sagt „Daraus wird ein grünes x". Im Bild stand stattdessen
der **rote** Ring aus Teil B noch um die 3, und das `3x` wurde **nicht grün** —
rot und grün nebeneinander, also genau das, was §12.4 verbietet.

Ursache, eine stille: `hebeAuf` räumte den alten Ring nur bei **Gleichheit** der
Terme ab. gl04 ringt in B die `3` ein und hebt in D das `3x` auf — verschiedene
Zeichenketten, also blieb der Ring liegen. Und weil er das `3x` bereits in `3`
und `x` zerlegt hatte, fand die grüne Hervorhebung ihren Term nicht mehr und
**fiel ersatzlos aus, ohne Fehlermeldung**.

Behoben: Verglichen wird jetzt auf Überschneidung, nicht auf Gleichheit. In
gl02, gl05 und gl09 ändert das nichts (dort sind die Terme ohnehin gleich) —
nachgeprüft, indem **alle elf** Videos aus dem Endstand neu gerendert wurden,
nicht nur die beiden geänderten.

### 4.3 Gegenprobe: steht am Ende irgendwo ein Falschergebnis?

Nachgezählt im **Schlussbild** (Teil F) jedes der elf Videos, über die roten
Bildpunkte der Tafel:

- **gl03: 0** rote Bildpunkte — vor der Behebung stand dort `x = 14 ✗`.
- **gl08: 9** Bildpunkte, Kantenglättung, nichts Sichtbares. Das falsche `5x`
  ist in F abgeräumt; davor trägt es in B, C und D das gelbe Fragezeichen und
  in E das rote Kreuz, steht also **nie unmarkiert**.
- **gl01: 4692** — das ist kein Ergebnis, sondern der rote Ring um die `−9`,
  den die Bildbeschreibung von F ausdrücklich verlangt.
- Die übrigen acht: 0.

Damit steht in keinem der elf Videos ein Falschergebnis ohne Kreuz oder
Fragezeichen — und seit §4.1 auch keines mehr in der Abschreibzeit.

---

## 5. Lesbarkeit am Beamer

Gemessen an den gerenderten Bildern, umgerechnet auf ein **2,00 m breites
Projektionsbild bei 8 m Sitzabstand** (hintere Reihe):

| Element | Glyphenhöhe | auf 2,00 m Bild | Sehwinkel |
|---|---|---|---|
| Hauptzeile (`3x + 5 = 20`) | 60 px | 6,2 cm | **27′** |
| Kästchen aus `buendel` | 90 px | 9,4 cm | **40′** |
| Waageschale (`x + 6`) | 55 px | 5,7 cm | **25′** |
| Rechenzeile (`−5`, `: 3`) | 53 px | 5,5 cm | **24′** |
| Untertitel | 42 px | 4,4 cm | **19′** |
| `notiz` („5 mal x", nur gl06 D) | 30 px | 3,1 cm | **13′** |
| Kopfzeile „MIKROHILFE GL02 · …" | 20 px | 2,1 cm | 9′ |

Für sicheres Lesen an der Wand gelten rund **15′**. Alles, was ein Schüler
lesen muss, liegt darüber — mit einer Ausnahme: die `notiz`, die nur in
**gl06 D** vorkommt („5 mal x") und mit 13′ knapp darunter liegt. Die Kopfzeile
mit der Kennung ist Beschriftung, kein Inhalt; sie darf klein bleiben.

Zusätzlich geprüft: **keine Tafel läuft unter die Kante.** Das Band zwischen
Tafelboden und Untertitel ist in allen elf Videos frei — die einzige Meldung
(gl07 D) war der zweizeilige Untertitel selbst. Die Tafel verkleinert sich als
Ganzes, wenn der Inhalt nicht in die 570 px passt, statt abgeschnitten zu
werden.

---

## 6. Ein Befund an den Werkzeugen

**`sprechfassung.py` und das Wortmodell der Skripte zählen verschieden — in
10 von 11 Hilfen.** Das Werkzeug beendet sich mit Exitcode 1, während
`pruefe_mikrohilfe.py` 0 Befunde meldet.

Der Unterschied ist systematisch und genau eins je `=`: **Das Feld `woerter`
zählt das Gleichheitszeichen als zwei Wörter („ist gleich"), gesprochen wird
aber eines („gleich").** Betroffen sind 17 Teile, alle mit `=`; gl08 ist die
einzige Hilfe ohne `=` im Skript und die einzige ohne Abweichung. Auch der
Docstring von `sprechfassung.py` rechnet mit der höheren Zahl („genau diese
sieben Wörter" für `3x + 5 = 20`, gesprochen sind es sechs).

**Für das Budget ist das ungefährlich** — das Modell zählt zu HOCH, die echten
Sprechzahlen liegen bei 41 bis 51 statt 42 bis 53, und gemessen bleibt keine
Hilfe über 28,4 s. Gefährlich ist der stehende Exitcode 1: Ein Prüfer, der
immer rot meldet, wird nicht mehr gelesen.

> **Zu entscheiden:** Entweder `woerter`/`woerter_gesamt` in den elf Hilfen um
> die Zahl der `=` senken, oder `ZEICHEN["="]` auf „ist gleich" setzen — dann
> spricht die Stimme anders und **alle elf Audios und Zeitmarken ändern sich**.
> Nicht im Vorbeigehen zu entscheiden, deshalb hier stehengelassen.

---

## 7. Wie man es nachprüft

```
cd mathe_mikrohilfen
python3 pruefe_mikrohilfe.py          # Inhalt der elf Hilfen      -> 0 Befunde
python3 narration_bauen.py            # Szene + Sprechfassung + Audio + Zeitmarken
cd ../videos-remotion
npx remotion render Mikrohilfe-gl03 out/mh-gl03.mp4
```

`narration_bauen.py` prüft die Szene gegen die Prosa, bevor es etwas schreibt:
Jeder sichtbare Text der Szene muss in der Bildbeschreibung **desselben Teils**
vorkommen. Alle elf Hilfen bestehen das (0 Befunde) — das ist die Klammer,
die verhindert, dass ein Video etwas zeigt, was nie gegengelesen wurde.

**Das ersetzt das Ansehen nicht.** Von den sechs Befunden dieses Durchgangs
hätte die Klammer keinen einzigen gefunden: Sie prüft, ob Bild und Prosa
dieselben Zeichen nennen, nicht, ob am Ende das Richtige auf der Wand steht.
Die zwei behobenen Fehler (§4) waren **nur im gerenderten Bild** zu sehen.
