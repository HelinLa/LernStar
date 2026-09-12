# Was für welches Bild gebraucht wird

Zu jedem Thema: der Einstiegstext (damit du weißt, worum es geht), das Motiv,
**was auf keinen Fall zu sehen sein darf**, und ein fertiger englischer Prompt zum Kopieren.

Englisch, weil Bildmodelle darauf zuverlässiger reagieren. Die deutsche Beschreibung
darüber ist für dich.

## Die eine Regel

**Das Bild zeigt das Problem, nie die Lösung.** Wenn darauf schon zu sehen ist, welches
Blech der Magnet anzieht oder wie das Lichtset verdrahtet ist, ist die Forscherfrage tot.
Deshalb steht bei jedem Bild ausdrücklich dabei, was fehlen muss.

## Ablauf

1. Bild erzeugen, herunterladen
2. als `m1.png` in diesen Ordner legen (Kennung am Anfang, Rest egal)
3. `python3 build_book.py`

Format am besten 5 : 3, mindestens 900 px breit. Runde Ecken und goldener Rahmen
kommen automatisch dazu.

**Gemeinsamer Stilanfang** — steckt schon in jedem Prompt und hält die 31 Bilder zusammen:

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark
```

---

## Magnetismus

### `m1.png` — Der Schlüssel liegt unten

*Magnete und magnetische Felder*

> Bens Schlüssel rutscht ihm aus der Jacke. Er fällt durch einen Schlitz im Gullyrost. Unten liegt er im nassen Laub, halb im Wasser. Mit den Fingern kommt Ben nicht durch den Rost. Mia bindet ihren Magneten an eine Schnur und lässt ihn hinunter. Der Schlüssel springt hoch, bevor der Magnet ihn berührt.

**Untersuche: Wovon hängt es ab, ob der Magnet den Schlüssel hochzieht?**

**Motiv:** Nahaufnahme eines Gullyrosts von schräg oben; unten im Schacht liegt ein silberner Schlüssel in nassem Herbstlaub und flachem Wasser; von oben wird ein Stabmagnet an einer Schnur durch einen Schlitz hinuntergelassen. Nasser Asphalt, grauer Herbsttag.

**Darf nicht zu sehen sein:** Der Schlüssel darf NICHT schon am Magneten kleben.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. close view of a cast-iron street drain grate from above, wet asphalt around it; through the dark slots you can see down into the shaft where a silver house key lies in wet brown autumn leaves and shallow water; a bar magnet on a string is being lowered through one slot, still well above the key; grey autumn daylight
```

### `m2.png` — Nicht alles kommt mit

*Welche Stoffe zieht ein Magnet an?*

> Beim Angeln kommt allerlei mit hoch. Ein Kronkorken bleibt am Magneten hängen, die Alulasche einer Dose nicht. Bens Zweitschlüssel aus Messing bleibt unten liegen. Der silberne Schlüssel dagegen springt sofort hoch. Beide sehen aus wie Metall. Beide fühlen sich kalt und schwer an. Ben versteht das nicht.

**Untersuche: Wovon hängt es ab, ob der Magnet einen Gegenstand hochzieht?**

**Motiv:** Auf dem nassen Asphalt neben dem Gully liegen einzeln erkennbar: ein silberner Stahlschlüssel, ein goldgelber Messingschlüssel, ein Kronkorken, eine Alu-Aufreißlasche, eine Münze. Daneben der Stabmagnet an der Schnur.

**Darf nicht zu sehen sein:** Kein Gegenstand darf am Magneten hängen.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. wet grey asphalt beside a drain grate, six small objects laid out separately and clearly apart from each other: a silver steel key, a brass-gold key, a bottle cap, an aluminium ring pull tab, a coin, and a bar magnet on a string lying next to them; nothing is stuck to the magnet; grey autumn daylight
```

### `m3.png` — Zwei Magnete, zweimal anders

*Wie wirken Magnetpole aufeinander?*

> Mia klebt zwei gleiche Magnete aneinander. So soll die Angel stärker werden. Beim ersten Versuch springen die beiden auseinander. Sie dreht einen um – jetzt kleben sie fest zusammen. Am Rost hebt diese Angel doppelt so viel. Die Magnete sehen an allen Enden gleich aus. Beschriftet ist nichts.

**Untersuche: Wovon hängt es ab, ob zwei Magnete zusammenhalten?**

**Motiv:** Zwei gleich aussehende Stabmagnete: das eine Paar klebt fest aneinander, das zweite Paar wird auf Abstand gehalten, mit sichtbarer Lücke.

**Darf nicht zu sehen sein:** KEINE Buchstaben, keine N/S-Kennzeichnung, keine farbcodierten Enden.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. two pairs of identical plain grey bar magnets lying on wet asphalt; the first pair is stuck firmly together end to end; the second pair is held apart with a clear visible gap between the ends as if pushed away; the magnets are uniform grey metal with no markings, no letters, no coloured ends
```

### `m4.png` — In der Mitte rutscht er ab

*Wie sieht ein Magnetfeld aus?*

> Mia hält den Magneten flach über den Rost. In der Mitte bleibt der Schlüssel nicht hängen. Er rutscht ab und fällt zurück. Hält sie ein Ende darüber, springt er sofort hoch. Am anderen Ende genauso. Dabei ist der Magnet überall gleich dick und gleich schwer.

**Untersuche: Wovon hängt es ab, an welcher Stelle des Magneten der Schlüssel hält?**

**Motiv:** Ein Stabmagnet waagerecht über dem Gullyrost; ein Schlüssel rutscht gerade von der Mitte ab und fällt, im Fall festgehalten.

**Darf nicht zu sehen sein:** An den Enden darf NICHTS hängen.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a plain grey bar magnet held horizontally just above a street drain grate; a single house key is sliding off the middle of the magnet and falling, caught mid-fall; nothing is attached at either end of the magnet; wet asphalt, grey daylight
```

### `m5.png` — Im Park sieht jeder Weg gleich aus

*Wie funktioniert ein Kompass?*

> Im Park sieht nach zehn Minuten jeder Weg gleich aus. Ben hat einen kleinen Kompass am Schlüsselbund. Am Eisenzaun zeigt die Nadel zum Zaun. Zwei Schritte weiter auf der Wiese dreht sie sich und bleibt woanders stehen. Ben dreht sich im Kreis – die Nadel kommt immer wieder zurück.

**Untersuche: Wovon hängt es ab, wohin die Kompassnadel zeigt?**

**Motiv:** Ein Parkweg in der Dämmerung, mehrere gleich aussehende Wege gabeln sich, dahinter ein schmiedeeiserner Zaun. Im Vordergrund groß ein kleiner Kompass an einem Schlüsselbund.

**Darf nicht zu sehen sein:** Die Kompassnadel darf keine Beschriftung tragen.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a park at dusk, several identical-looking gravel paths forking away between bare trees, a wrought-iron fence in the middle distance; in the foreground, large and sharp, a small round pocket compass hanging on a keyring; the compass dial has no letters and no numbers
```

---

## Licht & Schatten

### `l1.png` — Was leuchtet hier eigentlich?

*Lichtquellen und Lichtausbreitung*

> Im ganzen Haus ist es dunkel. Emma zündet die Kerze an. An der Decke schimmern die Leuchtsterne schwach nach. Am Fenster steht der Mond. Auf dem Schulranzen blitzt der Reflektorstreifen auf, sobald die Taschenlampe ihn trifft. Ohne die Lampe ist der Streifen wieder weg.

**Untersuche: Wovon hängt es ab, ob man etwas im Dunkeln leuchten sieht?**

**Motiv:** Dunkles Wohnzimmer bei Stromausfall: brennende Kerze auf dem Tisch, blassgrüne Leuchtsterne an der Decke, Mond am Fenster, ein Schulranzen, dessen Reflektorstreifen im Taschenlampenstrahl aufblitzt.

**Darf nicht zu sehen sein:** Nichts erklären — die Lichtquellen stehen nur nebeneinander.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a dark living room during a power cut; a single lit candle on the table, faint pale-green glow-in-the-dark stars on the ceiling, the moon visible through the window, and on the floor a school backpack whose wide reflective stripe flares brightly where a torch beam hits it; everything else sinks into darkness
```

### `l2.png` — Es liegt doch direkt da

*Wie können wir einen Gegenstand sehen?*

> Emmas Handy liegt neben dem Sofa. Der Akku ist leer, der Bildschirm bleibt schwarz. Im Zimmer ist kein Licht mehr. Emma tastet den Boden ab und findet nichts. Die Augen reißt sie weit auf. Dann leuchtet Ben mit der Taschenlampe kurz hinein – da liegt es.

**Untersuche: Wovon hängt es ab, ob du einen Gegenstand sehen kannst?**

**Motiv:** Fast schwarzes Wohnzimmer. Ein Sofa, davor auf dem Teppich ein Handy mit schwarzem Bildschirm, gerade eben als Umriss zu ahnen.

**Darf nicht zu sehen sein:** Das Handy darf NICHT leuchten und nicht beleuchtet sein.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. an almost completely black living room at night, no light source at all; a sofa is barely readable as a darker shape, and on the carpet in front of it lies a smartphone with a dead black screen, only just discernible as a silhouette; the viewer should have to search for it
```

### `l3.png` — Der Klotz an der Wand

*Wie entsteht ein Schatten?*

> Auf dem Tisch brennt eine Kerze. Ben stellt den Milchkarton daneben. An der Wand erscheint ein dunkler Klotz. Er sitzt nicht hinter dem Karton, sondern weiter links. Ben schiebt die Kerze nach links – der Klotz wandert nach rechts. Den Karton hat er dabei nicht angefasst.

**Untersuche: Wovon hängt es ab, wo der Schatten an der Wand liegt?**

**Motiv:** Wohnzimmer bei Nacht: brennende Kerze auf dem Tisch, daneben ein Milchkarton. An der Wand ein großer dunkler rechteckiger Schatten, deutlich weiter links als der Karton.

**Darf nicht zu sehen sein:** Keine Linien, keine Pfeile, kein Strahlengang.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a living room at night, one lit candle standing on a table with a milk carton beside it; on the smooth wall behind, a large dark rectangular shadow of the carton, clearly offset well to the left rather than directly behind it; warm candlelight, no drawn lines or arrows
```

### `l4.png` — Bis unter die Decke

*Wovon hängt die Größe des Schattens ab?*

> Emma schiebt den Karton langsam zur Kerze. Der Schatten an der Wand wird größer und größer. Am Ende reicht er bis unter die Decke. Schiebt sie den Karton zur Wand, wird er wieder klein. Der Karton bleibt die ganze Zeit gleich groß. Ben hat ihn zweimal nachgemessen.

**Untersuche: Wovon hängt es ab, wie groß der Schatten an der Wand wird?**

**Motiv:** Dieselbe Szene, der Milchkarton steht jetzt dicht an der Kerze, sein Schatten füllt die Wand bis unter die Decke.

**Darf nicht zu sehen sein:** Keine Maßlinien, keine Pfeile.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. the same living room at night; the milk carton now stands very close to the candle flame, and its shadow on the wall behind has grown enormous, filling the whole wall and running up to the ceiling; the carton itself is still small; warm candlelight
```

### `l5.png` — Zwei Kerzen, ein komischer Schatten

*Kern- und Halbschatten*

> Zwei Kerzen stehen nebeneinander auf dem Tisch. Beide leuchten den Karton an. Der Schatten an der Wand sieht komisch aus. In der Mitte ist er tiefschwarz. Zum Rand hin wird er blass und grau. Bläst Emma eine Kerze aus, ist der blasse Rand weg.

**Untersuche: Wovon hängt es ab, ob ein Schatten tiefschwarz oder blassgrau ist?**

**Motiv:** Dieselbe Szene mit ZWEI Kerzen. Der Schatten hat einen tiefschwarzen Kern und zu beiden Seiten einen blassen grauen Rand.

**Darf nicht zu sehen sein:** Keine Linien, die zeigen, welcher Rand von welcher Kerze kommt.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. the same living room with TWO lit candles standing side by side on the table and a milk carton in front of them; the shadow on the wall has a deep black core with a distinctly paler grey band on each side of it; warm candlelight, no drawn lines
```

---

### `l6.png` — Licht um die Ecke

*Reflexionsgesetz & ebene Spiegel*

> Der Sicherungskasten hängt im Flur um die Ecke. Emma leuchtet mit der Taschenlampe hin, aber der Fleck landet an der Wand daneben. Ben hält den Schminkspiegel seiner Schwester in die Ecke und dreht ihn langsam.

**Untersuche: Nach welcher Regel wird Licht an einem Spiegel zurückgeworfen?**

**Motiv:** Halbdunkler Flur mit einer Ecke: Emma hält die Taschenlampe, ihr Lichtfleck liegt an der falschen Wand, ein gutes Stück neben dem geschlossenen grauen Sicherungskasten. Ben steht an der Ecke und hält einen runden Schminkspiegel schräg in die Luft, die Hand mitten in der Drehung angehalten.

**Darf nicht zu sehen sein:** Kein Lichtfleck auf dem Sicherungskasten — das ist die Lösung. Kein sichtbarer Strahl in der Luft, kein Staubkegel, kein zweiter Fleck, keine gemalten Linien, kein Winkel, kein Gradmaß.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a dim hallway that turns a corner in an old flat, evening: a ten-year-old girl with short brown hair stands in the near part of the hallway and holds a small torch pointing round the corner; one single oval patch of light lies on the side wall well away from a closed grey fuse box that hangs further along the corner wall in shadow; a ten-year-old boy stands at the corner and holds a round hand mirror up at an angle, his hand stopped in mid-turn, looking towards the fuse box; the air in the hallway is completely clear; there is no patch of light on the fuse box, no visible beam or cone in the air, no dust beam, no second patch, no drawn lines and no angle marks anywhere in the picture
```

## Einfacher Stromkreis

### `s2.png` — Alles heil, und trotzdem dunkel

*Wann leuchtet eine Lampe?*

> Emma steht abends vor der Halle. Ihr Vorderlicht bleibt dunkel. Sie schiebt das Rad ein Stück an. Der Dynamo surrt, hinten leuchtet das Rücklicht. Vorne bleibt es schwarz. Im Glas sieht sie den Draht der Birne, er ist heil. Dann drückt sie den Stecker fester auf die Lampe – Licht.

**Untersuche: Wovon hängt es ab, ob die Lampe leuchtet?**

**Motiv:** Nacht vor einer beleuchteten Sporthalle. Ein Fahrrad im Ständer, rotes Rücklicht leuchtet, vordere Lampe dunkel.

**Darf nicht zu sehen sein:** Kein Hinweis auf die Ursache.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. night outside a lit sports hall entrance, wet asphalt reflecting the warm light from the doorway; a bicycle stands in a bike rack; its red rear light glows brightly, while the front lamp stays completely dark and unlit
```

### `s3.png` — Der Riss im Kabel

*Welche Stoffe leiten Strom?*

> Am Gabelrohr hat das Kabel eine offene Stelle. Der Draht darin ist durchgescheuert. Bis nach Hause sind es zwanzig Minuten, und es ist dunkel. Emma kippt ihren Rucksack aus. Da liegen eine Büroklammer, die Alufolie vom Pausenbrot und ein Bleistift. Dazu ein Radiergummi, ein Lineal, ihr Schlüssel und eine Münze.

**Untersuche: Wovon hängt es ab, womit du die Lücke im Kabel schließen kannst?**

**Motiv:** Nahaufnahme der Vorderradgabel bei Nacht: am Gabelrohr ein dünnes schwarzes Kabel, in der Mitte aufgeplatzt, die blanken Kupferdrähte deutlich getrennt. Daneben ein umgekippter Rucksack, daraus einzeln: Büroklammer, Alufolie, Bleistift, Radiergummi, Lineal, Schlüsselbund, Münze.

**Darf nicht zu sehen sein:** Nichts steckt in der Lücke. Keine Hand, kein Werkzeug.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. night close-up of a bicycle front fork; a thin black electrical cable runs down the fork tube, and in the middle its insulation is split wide open so the bare copper wires are visible and clearly separated with an obvious gap between the two ends, lit by a small warm pool of light; on the dark ground beside it a school backpack has tipped over, and seven objects lie separately and clearly apart: a paperclip, a crumpled piece of aluminium foil, a pencil, an eraser, a ruler, a bunch of keys, a coin; nothing is inserted into the gap
```

### `s6.png` — Jedes Mal den Draht abziehen

*Der Schalter*

> Emmas Notlicht klemmt am Lenker: eine Batterie, ein Lämpchen, zwei Drähte. Zum Ausmachen muss sie einen Draht von der Batterie ziehen. Das macht sie im Dunkeln, mit klammen Fingern. Einmal ist ihr der Draht auf beide Pole gerutscht. Die Batterie wurde richtig warm. Auf dem Tisch liegen ein Brettchen, zwei Reißzwecken und eine Büroklammer.

**Untersuche: Wovon hängt es ab, ob dein Schalter das Lämpchen ausmacht?**

**Motiv:** Werktisch: Flachbatterie, leuchtendes Lämpchen, zwei Kabel mit Krokodilklemmen, eine Klemme hängt halb ab. Daneben lose: Holzbrettchen, zwei Reißzwecken, Büroklammer.

**Darf nicht zu sehen sein:** Der Schalter ist NICHT gebaut.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a wooden workbench in warm evening light: a flat 4.5V battery, a small light bulb in a holder that is lit, two wires with crocodile clips, one clip hanging half off the battery terminal; separately beside them, lying loose and unassembled, a small wooden board, two drawing pins and a paperclip
```

### `s7.png` — Der Knopf, der den Magneten anschaltet

*Elektromagnet*

> Im Fahrradladen liegt hinter der Theke ein Gerät an einem Kabel. Der Mann drückt einen Knopf, und eine Handvoll Schrauben springt daran hoch. Lässt er den Knopf los, fallen alle wieder herunter.

**Untersuche: Wovon hängt die Stärke eines Elektromagneten ab?**

**Motiv:** Nahaufnahme über die Ladentheke hinweg: die Hand des Verkäufers hält ein schlichtes graues Gerät an einem dicken Kabel, der Daumen liegt auf einem roten Knopf. Unten am Gerät hängt ein Büschel Schrauben. Ben beugt sich von rechts ins Bild und schaut aus nächster Nähe zu.

**Darf nicht zu sehen sein:** Kein Blick ins Innere, keine sichtbare Drahtwicklung, kein Eisenkern, kein aufgeschnittenes Gehäuse. Kein Regler, keine Skala, kein zweites Gerät zum Vergleich, keine Feldlinien.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a close-up across a bicycle shop counter in warm afternoon light: the hand of a shop assistant holds a plain grey handheld device on a thick black cable, his thumb resting on a single red button; a cluster of steel screws hangs from the flat underside of the device in a tight bunch; a ten-year-old boy leans in from the right edge of the frame, chin almost at counter height, watching the screws closely; behind them out of focus a wall of bicycle parts and a workshop bench; the device is completely closed, its housing smooth and featureless, no window, no cutaway, no visible coil of wire, no iron core, no dial, no scale, no second device and no drawn field lines anywhere in the picture
```

### `s1.png` — Der Zettel aus dem Fahrradladen

*Stromkreis und Schaltzeichen*

> Auf dem Zettel aus dem Laden ist kein einziges Bild. Da steht ein Kreis mit einem Kreuz. Daneben zwei ungleich lange Striche und eine Linie mit einem Knick. Emma malt darunter, wie sie es meint. Die Batterie wird ein Klotz, das Lämpchen eine Sonne. Ben baut nach ihrer Zeichnung und bekommt etwas ganz anderes.

**Untersuche: Wovon hängt es ab, ob ein anderer deine Zeichnung richtig nachbaut?**

**Motiv:** Zwei Zettel auf einem Werktisch: links karierte Schaltzeichen, rechts eine kindlich gemalte Fassung mit braunem Klotz und gelber Sonne. Bleistift und Fahrradlampe daneben.

**Darf nicht zu sehen sein:** Auf beiden Zetteln KEINE lesbare Schrift.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. two sheets of paper lying side by side on a wooden workbench; the left one is squared paper with a neat pencil circuit drawing made only of plain symbols: a circle with a cross, two parallel lines of different length, a line with a kink; the right one is a childlike crayon drawing of a brown block and a yellow sun joined by wavy lines; a pencil and a bicycle lamp lie beside them; no readable writing anywhere
```

### `s4.png` — Zwei Lampen, und beide funzeln

*Reihenschaltung*

> Emma will auch hinten Licht. Sie hängt an ihr Notlicht ein zweites Lämpchen, hinter das erste. Heller wird es nicht. Beide leuchten jetzt schwächer als das eine vorher. Sie hängt ein drittes dahinter – noch schwächer. Dann lockert sich eines in der Fassung, und alle drei sind aus. Fest sitzen die anderen beiden noch.

**Untersuche: Wovon hängt es ab, ob alle Lämpchen zusammen ausgehen?**

**Motiv:** Werktisch: links drei Lämpchen hintereinander an einer Batterie, alle matt; rechts ein einzelnes an eigener Batterie, kräftig hell.

**Darf nicht zu sehen sein:** Nicht als Schaltplan erklären.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a wooden workbench: on the left, three small light bulbs in holders wired one behind the other to a single flat battery, all three glowing only faintly and dimly; on the right, clearly separated, one single bulb on its own battery burning brightly and warmly; the brightness difference is the point
```

### `s5.png` — Vorne aus, hinten an

*Parallelschaltung*

> Am Fahrradständer soll nur das Rücklicht brennen. So sieht man Emmas Rad im Dunkeln. Das Vorderlicht soll aus bleiben, damit die Batterie hält. Mit ihrer Reihe geht das nicht: Entweder brennen beide oder keins. Am gekauften Lichtset ihres Nachbarn klappt es. Beide Lampen hängen dort an derselben Batterie.

**Untersuche: Wovon hängt es ab, ob du ein Lämpchen allein ausschalten kannst?**

**Motiv:** Werktisch: links zwei dunkle Lämpchen an einer Batterie; rechts ein Fahrrad-Lichtset, rotes Rücklicht an, vordere Lampe aus. Die Verdrahtung verschwindet unter einer Kunststoffhaube.

**Darf nicht zu sehen sein:** Wie das Set verdrahtet ist, darf man NICHT sehen.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a wooden workbench: on the left two small bulbs wired in a row to a battery, both dark; on the right a shop-bought bicycle light set where the red rear lamp glows and the front lamp stays dark, and the wiring between them disappears under a moulded plastic cover so it cannot be seen
```

---

## Temperatur & Wärme

### `w1.png` — Der Löffel in der Teetasse

*Sind Temperatur und Wärme das Gleiche?*

> Emma stellt den kalten Metalllöffel in ihren heißen Tee. Sie rührt nicht damit. Sie reibt ihn auch nicht. Sie wartet nur kurz und hält die Hände um den Becher. Dann fasst sie den Löffel wieder an: Er ist warm geworden. Der Tee ist dafür etwas weniger heiß.

**Untersuche: Wovon hängt es ab, ob ein kalter Gegenstand von allein warm wird?**

**Motiv:** Parkbank im Schnee: Thermoskanne, Becher mit dampfendem Tee, darin ein Metalllöffel, daneben ein trockener zweiter Löffel.

**Darf nicht zu sehen sein:** Kein Thermometer im Bild.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a park bench in fresh snow on a cold bright winter day; on the bench a steel vacuum flask and a mug of steaming tea with a metal spoon standing in it, and beside them a second dry metal spoon lying on the wood
```

### `w2.png` — Der Faden, der wandert

*Wie funktioniert ein Thermometer?*

> Das Thermometer hängt an der Lehne der Parkbank. Jonas nimmt es ab und hält es fest in der Faust. Nach kurzer Zeit bewegt sich der dünne Faden darin. Ganz langsam wandert er an den Zahlen entlang. Dabei hat Jonas die Flüssigkeit gar nicht angefasst. An der Bank wandert der Faden wieder herunter.

**Untersuche: Wovon hängt es ab, wie weit der Faden im Thermometer steigt?**

**Motiv:** An der Banklehne hängt ein Stabthermometer mit rotem Faden; auf der Bank ein zweites, das in dampfendem Tee steckt und höher steht.

**Darf nicht zu sehen sein:** Auf der Skala KEINE lesbaren Zahlen.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a park bench in snow; a stick thermometer with a red liquid column hangs on the backrest, and on the seat a second identical thermometer stands in a mug of steaming tea, its red column noticeably higher; the scales show only tick marks, no numbers
```

### `w3.png` — Der bockige Deckel

*Was geschieht beim Erwärmen von Stoffen?*

> Noah will das Marmeladenglas aufmachen. Der Blechdeckel sitzt bombenfest. Er zieht und dreht mit aller Kraft. Auch mit dem Wollhandschuh bewegt sich nichts. Dann hält er den Deckel kurz in den heißen Tee. Danach dreht sich derselbe Deckel ganz leicht auf. Das Glas hat er nicht angefasst.

**Untersuche: Wovon hängt es ab, ob sich der Deckel leicht aufdrehen lässt?**

**Motiv:** Parkbank im Schnee: Marmeladenglas mit fest sitzendem Blechdeckel, zerknüllter Wollhandschuh, dampfender Becher.

**Darf nicht zu sehen sein:** Der Deckel ist zu und sitzt gerade.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a park bench in snow: a glass jam jar with a tightly closed metal screw lid, a crumpled woollen glove lying beside it, and a mug of steaming tea; cold clear winter light
```

### `w4.png` — Aus Eis wird Wasser

*Wie ändern Stoffe ihren Zustand?*

> In der Nacht hat es gefroren. Mias Wasserflasche steht auf der Parkbank, das Wasser darin ist zu Eis geworden. Später stellt Mia die Flasche an einen wärmeren Ort. Nach einiger Zeit ist das Eis weg – dabei war die Flasche die ganze Zeit verschlossen.

**Untersuche, wovon es abhängt, ob Wasser fest bleibt oder schmilzt.**

**Motiv:** Eine verschlossene, durchsichtige Wasserflasche steht auf einer Holzbank. In der Flasche ist ein großer Eisklumpen deutlich erkennbar. Die Umgebung wirkt kühl und herbstlich.

**Darf nicht zu sehen sein:** Kein ausgelaufenes Wasser, keine Pfütze, keine Wärmepfeile, kein Thermometer, keine Sonne als Symbol.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a clear plastic water bottle with its cap screwed on, standing upright on a wooden park bench; a large solid block of ice clearly visible inside the closed bottle; cool late-autumn surroundings, frost on the bench, bare branches behind; the ground around the bottle is completely dry
```

### `w5.png` — Zu heiß zum Anfassen

*Wie wird Wärme übertragen?*

> Ben und Emma trinken heißen Tee. In einem Becher stehen drei Löffel: einer aus Metall, einer aus Holz, einer aus Kunststoff. Ben will den Metalllöffel herausnehmen und zieht die Hand sofort zurück. Die anderen beiden kann Emma problemlos anfassen.

**Vergleiche, wie warm die Stiele von Löffeln aus Metall, Holz und Kunststoff im warmen Wasser werden.**

**Motiv:** Ein Becher mit dampfendem Tee steht auf einer Holzbank. Im Becher stehen drei deutlich unterscheidbare Löffel: Metall, Holz und Kunststoff. Eine Kinderhand nähert sich vorsichtig dem Metalllöffel.

**Darf nicht zu sehen sein:** Kein Glühen, keine Flammen, keine Hitzewellen, keine Pfeile, keine Schmerzsymbole, keine Beschriftung. Alle drei Löffel sehen ganz gewöhnlich aus.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. three clearly different spoons standing upright side by side in a mug of steaming tea on a wooden park bench - one stainless steel, one wooden, one plastic, all looking completely ordinary; a child's hand approaching the metal one carefully; cold autumn morning light
```

## Schall & Hören

### `sc1.png` — Das Brummen aus der Gitarre

*Wie entsteht ein Ton?*

> Jonas zupft eine Saite der Gitarre. Sofort brummt ein tiefer Ton durch den Keller. Dann schaut er genauer hin. Die Saite ist auf einmal ganz verschwommen. Es sieht aus, als wären da mehrere Saiten. Legt er den Finger darauf, ist der Ton sofort weg.

**Untersuche: Wovon hängt es ab, ob die Saite einen Ton macht?**

**Motiv:** Nahaufnahme einer Akustikgitarre; eine gezupfte Saite ist sichtbar verschwommen, als lägen mehrere übereinander.

**Darf nicht zu sehen sein:** Keine Schallwellen, keine Notenzeichen.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. close-up of an acoustic guitar body in a cellar; one single string has just been plucked and is visibly blurred into several overlapping ghost images as it vibrates, while the neighbouring strings stay perfectly sharp
```

### `sc2.png` — Nicht so laut!

*Wovon hängt die Lautstärke ab?*

> Jonas zupft die Saite ganz sanft. Im Keller hört man ihn kaum. Dann zupft er fester – und der Nachbar klopft. Beim sanften Zupfen zittert die Saite nur wenig. Beim festen Zupfen schlägt sie weit aus. Die Saite ist beide Male dieselbe, und Jonas sitzt am selben Platz.

**Untersuche: Wovon hängt es ab, wie laut der Ton wird?**

**Motiv:** Kellerraum mit verputzter Wand: Akustikgitarre, kleiner Verstärker, Cajon, Eierkartons an der Wand.

**Darf nicht zu sehen sein:** Keine Schallwellen, keine Lautstärkeanzeige.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a small band practice cellar with rough plastered walls: an acoustic guitar, a small guitar amplifier, a cajon drum box, and egg cartons taped to the wall as sound insulation; dim warm light
```

### `sc3.png` — Zu hoch, zu tief

*Wovon hängt die Tonhöhe ab?*

> Emma singt einen Ton vor. Jonas sucht ihn auf der Gitarre. Die dünne Saite klingt viel höher, die dicke viel tiefer. Dann dreht er an einem Wirbel. Derselbe Ton wird höher, obwohl die Saite dieselbe bleibt. Fester zupfen ändert nur, wie laut es ist.

**Untersuche: Wovon hängt es ab, wie hoch der Ton klingt?**

**Motiv:** Nahaufnahme des Gitarrenkopfs mit sechs Stimmwirbeln und unterschiedlich dicken Saiten.

**Darf nicht zu sehen sein:** Keine Beschriftung an den Wirbeln.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. close-up of an acoustic guitar headstock with six tuning pegs and the six strings running over the nut, clearly differing in thickness from thin to thick; the cellar behind is softly out of focus; no lettering anywhere
```

### `sc4.png` — Der Nachbar hört alles

*Wie breitet sich Schall aus?*

> Ben steht im Keller. Im Nebenraum läuft eine Waschmaschine, zuerst hört er nur ein leises Brummen. Dann legt er sein Ohr an die Wand. Plötzlich klingt die Maschine viel lauter – obwohl die Wand geschlossen ist und keine Ritze hat.

**Untersuche, ob du ein Klopfen lauter durch die Tischplatte oder durch die Luft hörst.**

**Motiv:** Eine massive Kellerwand steht in der Mitte des Bildes. Links drückt ein Junge sein Ohr gegen die Wand. Rechts läuft hinter der Wand eine Waschmaschine. Die Wand ist geschlossen.

**Darf nicht zu sehen sein:** Keine Schallwellen, keine Pfeile, keine Noten, keine Gitarre, kein Verstärker, keine Ohrsymbole, keine Beschriftung.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a cutaway view of one solid plastered cellar wall standing in the middle of the picture; on the left a boy presses his ear against the wall and listens; on the right, behind the same wall, a washing machine is running in a small utility room; the wall is completely closed with no gap, no door and no window; dim warm basement light
```

### `sc5.png` — Das Pfeifen im Ohr

*Wie funktioniert das Ohr?*

> Nach der Probe pfeift bei Emma das linke Ohr. Sie hat direkt vor dem Verstärker gesessen. Noah spannt Frischhaltefolie über eine Schüssel und streut Salzkörner darauf. Er stellt sie neben den Verstärker und dreht auf. Die Körner hüpfen in die Luft. Berührt hat sie niemand.

**Untersuche: Wovon hängt es ab, ob die Körner auf der Folie hüpfen?**

**Motiv:** Schüssel mit straffer Frischhaltefolie, Salzkörner darauf, mehrere springen in die Luft. Daneben ein Verstärker, dazwischen deutlich Luft.

**Darf nicht zu sehen sein:** Keine Schallwellen zwischen Verstärker und Folie.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a bowl on a table with cling film stretched tightly over the opening and grains of salt scattered on it; several grains are caught in mid-air jumping above the film; beside the bowl, not touching it and with a clear air gap between them, stands a small guitar amplifier
```

---

## Sonne, Erde & Mond

### `h1.png` — Tag hier, Nacht dort

*Wie entstehen Tag und Nacht?*

> Ben ruft am Nachmittag seine Cousine Yumi in Japan an. Bei ihm scheint die Sonne ins Zimmer. Auf dem Bildschirm ist es bei Yumi stockdunkel. Sie gähnt und will gleich ins Bett. Beide schauen im selben Moment aus dem Fenster. Beide sehen einen ganz anderen Himmel.

**Untersuche: Wovon hängt es ab, ob es an einem Ort gerade Tag oder Nacht ist?**

**Motiv:** Sonnendurchflutetes Kinderzimmer am Nachmittag. Ein angelehntes Smartphone zeigt ein stockdunkles Nachtfenster mit Stadtlichtern.

**Darf nicht zu sehen sein:** Kein Globus, kein Erde-Sonne-Modell. MENSCHEN ERLAUBT auf dem Bildschirm.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a child's room flooded with warm afternoon sunlight, a bright patch of sun falling across the floor; on the table a smartphone is propped upright, and its screen shows a video call from a pitch-dark room at night with a few distant city lights outside the window
```

### `h2.png` — Vom Schnee zum Sonnenbrand

*Wie entstehen die Jahreszeiten?*

> Emma vergleicht zwei Fotos derselben Straße. Auf dem einen liegt Schnee, die Bäume sind kahl und die Schatten sind lang. Auf dem anderen sind die Bäume grün, die Sonne steht höher und die Schatten sind kurz. Beide Fotos entstanden mittags.

**Vergleiche, auf wie viele Kästchen sich der Lichtfleck verteilt, wenn die Taschenlampe steil oder flach steht.**

**Motiv:** Zwei Ansichten derselben Straße nebeneinander. Links Winter: Schnee, kahle Bäume, tiefer Sonnenstand und lange Schatten. Rechts Sommer: grüne Bäume, helle Umgebung, hoher Sonnenstand und kurze Schatten. Häuser, Blickwinkel und Bildausschnitt sind identisch.

**Darf nicht zu sehen sein:** Keine Erdkugel, keine Umlaufbahn, keine Erdachse, keine Pfeile, keine Monatsnamen, keine Beschriftung.

```
EXACTLY TWO photographs side by side and nothing else, no third panel, no insets, no arrows, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. two photographs of the exact same suburban street placed side by side, identical houses and identical camera angle in both; LEFT: winter, deep snow, bare trees, the sun low in the sky and very long shadows stretching across the street; RIGHT: summer, green leafy trees, bright surroundings, the sun high in the sky and short shadows directly under the trees; both taken at midday
```

### `h3.png` — Jeden Abend ein anderer Mond

*Warum verändert der Mond sein Aussehen?*

> Emma fotografiert seit zwei Wochen jeden Abend den Mond. Am Montag ist er nur eine dünne Sichel. Ein paar Tage später ist er halb. Dann steht er ganz rund über den Dächern. Eine Woche danach fehlt wieder ein großes Stück. Fotografiert hat sie immer vom selben Fenster.

**Untersuche: Wovon hängt es ab, wie viel wir vom Mond sehen?**

**Motiv:** Ein Smartphone flach auf dem Tisch, auf dem Bildschirm acht Mondbilder in zwei Reihen, von der dünnen Sichel über den Vollmond zurück zur Sichel.

**Darf nicht zu sehen sein:** Keine Datumsangaben, keine Schrift, kein Erde-Mond-Modell.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a smartphone lying flat on a wooden table, its screen showing a photo gallery grid of eight moon photographs in two rows: a thin crescent, a wider crescent, a half moon, a nearly full moon, a full moon, then waning back through half to a thin crescent on the other side; no text or dates on the screen
```

### `h4.png` — Nacht am Mittag

*Wie entsteht eine Sonnenfinsternis?*

> Ben steht mittags auf der Straße. Die Sonne scheint, am Himmel ist keine Wolke. Trotzdem wird es plötzlich dunkler, die Straßenlaternen gehen an und die Luft wird kühler. Nach ein paar Minuten ist das Tageslicht zurück.

**Prüfe, wo der kleine Ball stehen muss, damit ein Schatten auf den Globus fällt.**

**Motiv:** Eine Wohnstraße ist tagsüber ungewöhnlich dunkel, die Straßenlaternen leuchten. Hoch am Himmel ist die Sonne fast vollständig durch die dunkle Mondscheibe verdeckt, nur eine schmale helle Sichel bleibt sichtbar.

**Darf nicht zu sehen sein:** Keine Sterne, kein Vollmond, kein schwarzer Nachthimmel, keine Pfeile, keine Sonnenfinsternisbrille, keine Beschriftung.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a suburban street unusually dark in the middle of the day, street lamps switched on; high in the sky the sun is almost completely covered by the dark disc of the moon, only a thin bright crescent remains visible; pale blue-grey gloom, long strange shadows, clear cloudless sky, no stars and no full moon
```

### `h5.png` — Der Mond wird rot

*Wie entsteht eine Mondfinsternis?*

> Auf dem letzten Foto ist der Vollmond kupferrot. Emma hat an dem Abend eine ganze Reihe aufgenommen. Zuerst steht er groß und weiß über dem Hof. Nach und nach wird er dunkler. Am Ende schimmert er rot. Kein Wölkchen war am Himmel, und die Sterne blieben gleich hell.

**Untersuche: Wovon hängt es ab, ob der Vollmond dunkel und rot wird?**

**Motiv:** Nachthimmel über Hausdächern, groß und mittig ein kupferroter Vollmond, ringsum klare Sterne.

**Darf nicht zu sehen sein:** Kein Erdschatten als Kegel, keine Erde, keine Sonne.

```
ONE single scene, no panels, no insets, no arrows, no wave or ripple symbols, no speaker or ear icons, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, clear readable silhouettes, smooth soft gradients, gentle light from the upper left, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. a clear night sky above dark rooftops, with a large coppery red full moon hanging in the middle of the frame and sharp stars scattered around it; not a single cloud
```
