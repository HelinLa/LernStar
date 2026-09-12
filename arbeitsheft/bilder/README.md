# Deine eigenen Bilder

Leg deine Bilder **hier** ab — nicht auf dem Schreibtisch. Auf den Schreibtisch
darf ich zwar schreiben, aber macOS lässt mich dort nichts auflisten und keine
vorhandene Datei öffnen. Dieser Ordner funktioniert.

## Dateiname

Der Name beginnt mit der Themen-Kennung, alles danach ist egal:

```
m1.png                        ✓
s3.jpg                        ✓
sc4 die band im keller.png    ✓
h2-schnee-und-sonne.jpeg      ✓
riss.png                      ✗  keine Kennung am Anfang
```

Erlaubt: png, jpg, jpeg, webp, tif.

## Format

Am besten **im Verhältnis 900 × 540** (also 5 : 3), zum Beispiel 1500 × 900.
Andere Formate gehen auch — sie werden **mittig beschnitten**, damit keine
Balken entstehen. Bei einem quadratischen Bild fällt also oben und unten je
ein knappes Viertel weg. Wenn dir das wichtige Motiv am Rand liegt, lieber
vorher selbst auf 5 : 3 zuschneiden.

Kleiner als 900 px breit sollte es nicht sein, sonst wird es im Druck weich.

Runde Ecken und den goldenen Rahmen bekommt das Bild automatisch — du musst
nichts vorbereiten.

## Danach

```bash
python3 build_book.py
```

Das liest diesen Ordner ein und setzt das Heft neu. Ein Bild hier **ersetzt**
die gezeichnete Fassung aus `szenen/`. Nimmst du es wieder heraus, ist die
gezeichnete Fassung nach dem nächsten `node bau.js` zurück.

Welches Bild wofür gebraucht wird und was darauf zu sehen sein muss, steht in
`PROMPTS.md` — dort ist zu jedem Thema ein fertiger Prompt.
