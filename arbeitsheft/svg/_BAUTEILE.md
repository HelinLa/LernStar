# Bauteile ändern oder neue bauen

Alles steht in **`svg/bauteile.svg`** — ein Fragment ohne `<svg>`-Wurzel, nach Themen
sortiert: Raum · Strom · Küche · Gläser · Natur · Papier · Wolf.

```xml
<!-- t_becher | Emaillebecher | nominal 150 x 175 | Anker: Standfläche Mitte -->
<g id="t_becher">…</g>
```

## Regeln

* **Bauteile heißen `t_…`, eigene Verläufe und Filter `b_…`.** `node bau.js --pruefen`
  meldet doppelte Namen — die sind der gefährlichste Fehler, weil dann wortlos das
  falsche Teil gezeichnet wird.
* **Ankerpunkt ist `(0,0)`**: stehende Dinge auf der Mitte der Standfläche, liegende
  in der Mitte. Im Kommentar steht, welcher gilt.
* **Licht kommt von oben links.** Glanz oben links, Schatten nach unten rechts.
* **Der Kontaktschatten gehört zum Teil** (`filter="url(#kontakt)"` am Körper), der
  große weiche Bodenschatten zur Szene.
* **Kein Text, keine Zahlen** in einem Bauteil.
* Zwei Zustände = zwei Teile: `t_laempchen_aus` und `t_laempchen_an`.

## Das Vier-Schritt-Rezept

Ohne diese vier Schritte sieht jedes Objekt aus wie Clipart:

1. Körper mit Verlauf, in `<g filter="url(#kontakt)">`
2. Konturlinie an der Silhouette (`stroke-opacity` 0.4–0.6, nie volles Schwarz)
3. warmer Rückwurf **unten** (`fill="url(#stahlWarm)" opacity="0.5"`)
4. harter Glanz **oben links** (`fill="url(#glanz)"`)

Bei Holz statt 3./4.: `filter="url(#maser)"` über die Fläche, oben eine helle
Fasenkante, unten ein dunkler Schattenstrich.

## Material aus `_stil.svg`

`holz` `holzHell` `maser` `rauh` · `stahl` `stahlWarm` `glanz` `blech` `kunststoff` ·
`pappe` `papier` `glasK` `wasser` · `gras` `grasDunkel` · `flamme` `warmSchein`
`schein` `scheinKlein` · `kontakt` `weich` `tiefe` · `karte` `karteNacht` `clipKarte`
`vigTag` `vigNacht` · `nachtTon` `daemmerTon`

## Zwei Fallstricke bei resvg

* **Filter über großen Gruppen stürzen ab.** Ein `feGaussianBlur` über einem
  900 × 300 großen Sternenfeld hat resvg mit `Option::unwrap() on None` beendet.
  Lieber jedem Element seinen eigenen kleinen Schein geben — oder einen Verlauf
  statt eines Filters.
* **Radien von 0 stürzen ab.** Ein `<circle r="0">` erzeugt eine leere Bounding-Box.
  Kleinste Radien immer auf mindestens `0.8` runden.

## Prüfen

```bash
node bau.js --teile     # Kontaktbogen aller Bauteile auf einer Standlinie
```
Dann `img/_bauteile.png` ansehen: Steht jedes Teil **auf** der gestrichelten Linie?
Der goldene Punkt markiert den Ankerpunkt. Schwebt oder versinkt etwas, stimmt der
Anker nicht — dann verschiebt man die Zeichnung, nicht die Linie.
