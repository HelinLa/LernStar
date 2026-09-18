# FeLabs PHYSIK 5/6 · Forscherheft Realschule NRW

110 Seiten, sechs Kapitel, ein durchgehender Rahmen: **fünf Kinder bauen und benutzen
ein Jahr lang eine Bude im Wald.** Jede Seite löst ein Problem, das aus der Seite davor
entsteht. Ergebnis ist ein PDF auf dem Schreibtisch, die Druckvorstufe bleibt in `build/`:

| Datei | wofür |
|---|---|
| `FeLabs_Physik_5_6_Realschule_NRW.pdf` | auf dem Schreibtisch: Lesezeichen, klickbares Inhaltsverzeichnis, QR-Kärtchen sind Links zur Simulation |
| `build/FeLabs_Physik_5_6_Realschule_NRW_Druck.pdf` | Druckvorstufe, A4, 150 dpi (mit `--druck` auch auf den Schreibtisch) |

## Zwei Befehle

```bash
node bau.js          # alle Einstiegsbilder bauen   -> img/einstieg_*.png
python3 build_book.py   # daraus das Heft setzen     -> E-Book + Druckvorstufe
```

## Wie ein Bild entsteht

Ein Bild wird nicht gezeichnet, sondern **zusammengesetzt**:

```
svg/_stil.svg       Materialien: Holz, Stahl, Blech, Glas, Gras, Schatten, Vignetten
svg/bauteile.svg    69 Bauteile (t_*) – Wand, Kiste, Batterie, Becher, Baum, Mond …
szenen/<id>.svg     die Szene: meist zwanzig Zeilen <use>
```

`szenen/l3.svg` sieht zum Beispiel so aus:

```xml
<use href="#t_wand" x="0" y="0"/>
<use href="#t_boden" transform="translate(0,412)"/>
<use href="#t_kiste" transform="translate(186,500) scale(0.86)"/>
<use href="#t_lampe_an" transform="translate(196,316) scale(0.8)"/>
```

Deshalb sieht die Bude auf allen 31 Seiten gleich aus, und ein neues Bild kostet Minuten.
Wer ein Bauteil ändert, ändert es überall.

**Ankerpunkt** jedes Bauteils ist `(0,0)`: bei stehenden Dingen die Mitte der Standfläche,
bei liegenden die Mitte. Deshalb setzt `translate(x,y)` ein Ding genau dorthin, wo es
stehen soll. Nachtszenen beginnen mit `<!-- nacht -->`; Bauteile sind für Tageslicht
gebaut und werden dort über `filter="url(#nachtTon)"` bzw. `daemmerTon` entsättigt.

### Weitere Aufrufe

```bash
node bau.js l3 s6 h4    # nur diese Szenen neu bauen
node bau.js --pruefen   # doppelte ids, fehlende Bauteile, unbenutzte Teile
node bau.js --teile     # Kontaktbogen aller Bauteile  -> img/_bauteile.png
node bau.js --blatt     # Kontaktbogen aller Szenen    -> img/_szenen.png
```

`--pruefen` läuft in Sekunden und fängt genau die Fehler, die man sonst erst im
fertigen Heft sieht: zwei Bauteile mit demselben Namen (dann zeichnet resvg wortlos
das falsche) oder ein `<use>` auf ein Teil, das es nicht gibt (dann fehlt es einfach).

## Wo der Inhalt steht

```
content/forscherseiten.json   31 Seiten: Titel, Einstieg, Forscherfrage, Vermutungen,
                              Forschen-Schritte, Tabelle, Merksätze, Aufgabe, Überleitung
content/uebungen.json         Lückensätze, Richtig/Falsch, Multiple Choice, offene Aufgabe
content/assessment.json       Wortgitter, Kreuzworträtsel, Testvorbereitung, Kapiteltest
```

Der **Rahmen jedes Kapitels** steht als `VORHABEN` in `build_book.py` und erscheint auf
der Trennseite. Die **Kette** zwischen den Seiten steckt im Feld `ueberleitung`; sie wird
unten auf der Übungsseite als *UND JETZT?* gedruckt und führt ins nächste Problem —
über Kapitelgrenzen hinweg.

## Die Bausteine des Layouts

```
build_final.py     Werkzeugkasten: Seite, Schrift, Linien, Kästen, Tabellen, pastefit
diagrams.py        Schaltzeichen und Schaltbilder (Batterie, Lampe, Schalter, Motor, Summer)
build_book.py      setzt daraus die 106 Seiten und beide PDFs
build_muster.py    einzelne Musterseite zum Ausprobieren
make_qr.py         erzeugt qr/qr_<id>.png aus den Simulations-Links
```

Feste Besetzung in allen Kapiteln: **Ben, Mia, Emma, Jonas, Noah.** Kein Erwachsener löst
ein Problem. Jede Forscherfrage beginnt mit einem Operator und steht in der Form
*„Untersuche: Wovon hängt es ab, …?"* — im Fragekasten wird der Operator fett und in der
Kapitelfarbe gesetzt.
