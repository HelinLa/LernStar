# simcheck – Prüfwerkzeuge für physics-sim.js

Vier Werkzeuge, die alle **an bekannten Fällen geeicht** sind. Ohne bestandenen
Selbsttest darf keines von ihnen über eine Simulation urteilen.

| Werkzeug | Was es tut |
|---|---|
| `rauchtest.js` | Öffnet Simulationen in einer Mini-DOM-Umgebung, betätigt jedes Bedienelement und prüft, ob sich das Bild von Frame zu Frame ändert. |
| `simfakten.js` | Liest aus, **was eine Simulation wirklich anzeigt**: Regler mit Bereichen, Knopfaufschriften, jede Statuszeile in jeder Stellung, jeden Text im Bild. Grundlage für Heftseiten. |
| `werte.js` | Öffnet eine Simulation, stellt sie ein und gibt eine bestimmte Anzeige aus. Für den Rechentest. |
| `einbaupruefung.py` | Prüft eine neue Simulationsdatei vor dem Einbau: Namenskollisionen, DOM-Kollisionen, Pflichtfunktionen, verbotene Wörter. |
| `einbau.py` | Baut Registry-Eintrag und Implementierung in `physics-sim.js` ein (Klammerzählung, nicht Textsuche). |
| `heft_gegen_sim.py` | Prüft, ob eine Heftseite nur Werte verlangt, die ihre Simulation wirklich anzeigt. |

## Benutzung

```
node simcheck/rauchtest.js physics-sim.js kernfusion ionisation
node simcheck/simfakten.js physics-sim.js hebel > fakten.json
node simcheck/werte.js physics-sim.js hebel '[{"tue":"_hebMarke(2.0)","lies":"hebStatus"}]'
python3 simcheck/einbaupruefung.py _neu /pfad/sim_neu.js
python3 simcheck/einbau.py reg.txt sim_neu.js
python3 simcheck/heft_gegen_sim.py <heft>/content/forscherseiten.json fakten.json <heft>/plan.py
```

## Eichung von `heft_gegen_sim.py`

Gemessen an den **47 abgenommenen Seiten von Klasse 10**. Der Weg dorthin:

| Fassung | Fehlalarme |
|---|---|
| erste | 37 |
| Zahl darf nicht auf einen Punkt enden (Ordnungszahlen) | 28 |
| numerischer statt Zeichenvergleich (0,40 T = 0,4 T) | 28 |
| Einheiten-**Positivliste** statt Wort-Sperrliste | 18 |
| ganzzahlige Vielfache erlaubt (2 × Halbwertszeit) | 6 |
| runde Reglerwerte mit abgetastet (100 cm, nicht 95 cm) | **4** |

**Bekannte Grenze:** `simfakten.js` verstellt immer nur EINEN Regler. Werte, die
sich erst aus einer **Kombination** zweier Regler ergeben, findet es nicht — daher
die vier übrigen Meldungen (`oersted` 71,6° hängt von zwei Reglern ab). Jede
Meldung deshalb von Hand nachsehen; sie heißt „sieh hier nach", nicht „das ist falsch".

## Warum die Werkzeuge selbst geprüft werden müssen

Beim Bau am 31.08.2026 hatte **jedes** von ihnen einen eigenen Fehler:

1. **rauchtest.js** verglich 5 Frames gegen 40 – also unterschiedlich lange Listen.
   Dadurch galt jede stehende Simulation als lebendig. Jetzt: genau ein Frame
   gegen genau ein Frame.
2. **rauchtest.js** übersah alle Knöpfe **ohne** `id` – ausgerechnet die
   Sprungmarken. Von 1 erkannten Bedienelementen wurden es danach 25.
3. **simfakten.js** suchte nur nach dem neuen Hausstil (`lmp-status`, `fpm-label`)
   und fand bei 24 von 29 älteren Simulationen nichts.
4. **einbaupruefung.py** fand einzeilige Zeichenfunktionen nicht (Regex auf `\n}`)
   und meldete deren Stillstand deshalb nie. Jetzt Klammerzählung.
5. **einbaupruefung.py** meldete Stillstand, wenn die Zeit in einer **Hilfsfunktion**
   gelesen wird, die `Draw` aufruft. Deshalb ist Regel R1 dort nur ein *Hinweis* –
   entschieden wird sie vom laufenden Rauchtest.

Gegenproben, die jedes Werkzeug bestehen muss, liegen als absichtlich fehlerhafte
Fälle bei: eine laufende, eine stehende und eine abstürzende Simulation.
