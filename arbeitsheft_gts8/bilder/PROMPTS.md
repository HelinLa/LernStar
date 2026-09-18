# Einstiegsbilder · FeLabs Physik 8 · Gesamtschule NRW

23 Bilder, eines je Forscherseite. Ablage in diesem Ordner (auf dem Schreibtisch
als `FeLabs-Bilder Gesamtschule 8` verlinkt). Dateiname = **Kennung, Leerzeichen,
Titel der Heftseite**, dann `.png` – genau so, wie er über jedem Auftrag steht.
Querformat 5:3, mindestens 1200 × 720 Punkte.

Sobald eine Datei im Ordner liegt, verschwindet ihr Auftrag von selbst aus dem
Auftrags-PDF (`python3 bildauftraege.py`).

## Die eine Regel

**Das Bild zeigt das Problem, nie die Lösung.** Ein Kind soll die Situation erkennen und
sich fragen, woran es liegt. Was der Versuch erst herausfinden soll, darf nicht schon im
Bild stehen: keine Strahlengänge, keine Pfeile, keine Beschriftung, keine erklärenden
Nebenbildchen.

## Vier Fehler, die bei Klasse 7 der Realschule acht Bilder gekostet haben

1. **Bildstreifen statt einer Szene** – sobald der Auftrag eine Veränderung beschreibt.
2. **Rundes Nebenbild**, das genau die Antwort zeigt.
3. **Gezeichneter Strahlengang** mit Pfeilspitzen und gestricheltem Lot.
4. **Stilbruch**: fotorealistisch oder flacher Comic statt gemalter Illustration.

Verbote im Prompt haben dagegen nicht geholfen – gelöst wird es über die **Komposition**:
Nahaufnahme, oder das entscheidende Objekt an den rechten Bildrand.

Passt ein erzeugtes Bild nicht, hilft oft ein Ausschnitt statt eines neuen Laufs:
`bilder/_schnitt.json` erlaubt einen Beschnitt je Datei.

## Der Rahmen

Nour und Jannis sind ein Jahr älter. Die Schule richtet einen Raum für die Fahrrad-AG ein: alte Räder werden wieder flott gemacht, und im Nebenraum steht eine Werkbank mit Netzteil, Kabeln und einer Kiste voller Bauteile. Bis zum Sommerfest soll daraus eine Werkstatt werden, in der auch Licht brennt und in der man messen kann, wie schnell die Räder wirklich sind.

---


### `st1 Knistern in der kalten Werkstatt.png` — st1

> Der Pullover hängt noch über Nours Gesicht, ihre Haare stehen senkrecht ab - und Jannis' Papierschnipsel klebt schon am Ärmel.

**Motiv:** NAHAUFNAHME, die den ganzen Rahmen füllt: Nour, 13, in der kalten Fahrradwerkstatt, erwischt in dem Sekundenbruchteil, in dem sie den dicken Strickpullover über den Kopf zieht - der Kragen liegt noch über ihrem Gesicht, einzelne Haarsträhnen schweben und stehen kerzengerade nach oben, die Schultern sind hochgezogen; am rechten Bildrand hält Jannis' Hand einen winzigen Papierschnipsel, der eben an den Ärmel gesprungen ist und flach daran klebt, dort hört das Bild auf; fahles kaltes Morgenlicht von einem hohen Fenster, im weichen Hintergrund unscharf Fahrradrahmen und eine Werkbank.

**Darf nicht zu sehen sein:** Keine zwei Kugeln, keine Plus- oder Minuszeichen, keine Ladungspunkte, keine Feldlinien, keine Funken, kein Kabel, keine Steckdose und keine Lampe - nichts, was zeigt, wann sich zwei Ladungen anziehen und wann sie sich abstoßen.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark.: extreme close-up filling the whole frame: a 13-year-old girl with dark hair in a cold bicycle workshop, caught in the split second of pulling a thick knitted sweater up over her head, the collar still lying across her face, single strands of her hair floating and standing straight up on end, her shoulders hunched up; at the right edge of the frame the hand of a 13-year-old boy holds a tiny scrap of paper that has just jumped across and clings flat to the sweater sleeve, and the picture ends there; pale cold morning light from a high window, blurred bicycle frames and a workbench soft in the background; no spheres or hanging balls of any kind, no plus or minus signs, no charge dots, no field lines, no sparks, no cable, no socket, no lamp, no glow and no drawn rays anywhere in the picture.
```

### `st2 Zwei geladene Kugeln an dünnen Fäden.png` — st2

> Die beiden Kugeln hängen still an ihren Fäden, und Jannis' Hand mit dem geriebenen Stab hält mitten in der Bewegung inne.

**Motiv:** HALBNAH von der Seite: auf der hölzernen Werkbank hängen an einem einfachen Holzgestell zwei kleine helle Kugeln reglos an dünnen Fäden, eine Handbreit voneinander entfernt, die Fäden leicht schräg; dahinter steht Jannis, 13, vorgebeugt, den geriebenen Kunststoffstab in der erhobenen Hand gerade von den Kugeln weggezogen, konzentrierter Blick; links stützt Nour, 13, das Kinn in die Hände und schaut zu; Mittagslicht fällt durch ein staubiges Werkstattfenster von links ein; der rechte Bildrand schneidet knapp hinter dem Gestell ab, dort hört das Bild auf.

**Darf nicht zu sehen sein:** Kein Lineal, keine Skala, kein Messgerät, kein zweites Kugelpaar in anderem Abstand, keine Kraftpfeile, keine Feldlinien, keine Zahlen an den Fäden - nichts, woran man ablesen könnte, wie die Kraft mit dem Abstand kleiner wird.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark.: medium shot seen from the side: on a wooden workbench in a bicycle workshop two small pale spheres hang motionless on thin threads from one simple wooden stand, about a hand's width apart, the threads tilted only slightly; behind the bench a 13-year-old boy leans in, holding a rubbed plastic rod in his raised hand, just drawn back and away from the spheres, his face concentrating; on the left a 13-year-old girl rests her chin on her hands and watches; midday light falls through a dusty workshop window on the left, tools and bicycle wheels dim behind them; the right edge of the frame cuts off just past the wooden stand and the picture ends there; no ruler, no scale, no measuring instrument, no second pair of spheres at another distance, no force arrows, no field lines, no numbers on the threads, no glow and no drawn rays anywhere in the picture.
```

### `st3 Die Zahl mit dem V auf der Zelle.png` — st3

> Vier Hände über einer Kiste voller Zellen, und das Lämpchen an der einen Zelle glimmt nur müde vor sich hin.

**Motiv:** NAHAUFNAHME, die den ganzen Rahmen füllt, leicht von schräg oben: vier Jugendhände über einer offenen Pappkiste voller kleiner runder Batteriezellen, Jannis' Hand drückt ein winziges Glaslämpchen in einer Fassung an die beiden Enden einer einzigen Zelle, der Glühfaden darin zeigt nur ein schwaches stumpfes Orange, daneben drehen Nours Finger eine zweite Zelle ratlos um ihre Achse; die Gesichter liegen außerhalb des Bildes; warmes Abendlicht von einer Arbeitsleuchte rechts oben, tiefe Schatten in der Kiste.

**Darf nicht zu sehen sein:** Keine hintereinander gesteckte Reihe aus mehreren Zellen, kein Stapel, kein Batteriehalter mit mehreren Fächern, keine hell strahlende Lampe, kein Messgerät und keine Aufschrift auf den Zellen - nichts, was verrät, wie die Spannung der Quelle die Helligkeit ändert.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark.: extreme close-up filling the whole frame, seen from slightly above: four teenage hands over an open cardboard box loosely filled with small plain cylindrical battery cells, the hand of a 13-year-old boy pressing a tiny clear glass bulb in a holder against the two ends of one single cell, the filament inside showing only a weak dull orange glimmer, beside it the fingers of a 13-year-old girl turning a second cell over end for end, both faces outside the frame; warm evening light from a work lamp at the upper right, deep shadows inside the box, blurred workbench wood at the edges; no row of cells joined one behind the other, no stack of cells, no battery holder with several slots, no brightly shining lamp, no meter, no dial, no printing on the cells, no glow and no drawn rays anywhere in the picture.
```

### `st4 Ein Schalter unterbricht den Kreis.png` — st4

> Nours Finger liegt noch auf dem Schalter, die Lampe über der Werkbank ist dunkel - und Jannis zeigt mitten auf das Kabel.

**Motiv:** WEIT, quer durch die Werkstatt gesehen: über der hölzernen Werkbank hängt eine nackte Glühlampe in einer einfachen Fassung und ist erloschen, auf der Bank steht ein flacher Batterieblock, von dem zwei stoffumwickelte Kabel zu einem kleinen Kippschalter und weiter nach oben zur Fassung führen; Nour, 13, steht an der Bank, den Finger noch auf dem eben gedrückten Schalter, und schaut zur dunklen Lampe hinauf; Jannis, 13, sitzt auf einem Hocker daneben und zeigt mitten auf das Kabel, mitten im Satz; tief stehende Nachmittagssonne fällt hinten durch das Fenster, der Raum liegt golden und dämmrig da, an den Wänden Fahrräder und eine Werkzeugwand.

**Darf nicht zu sehen sein:** Kein Amperemeter, keine Skala, kein Zeiger, keine Anzeige mit Zahlen, keine leuchtenden Punkte oder wandernden Teilchen im Kabel, keine Schaltzeichen und kein Schaltplan an der Wand - nichts, was verrät, wie groß der Strom ist oder ob im offenen Kreis noch etwas fließt.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark.: wide shot of a whole bicycle workshop seen from across the room: a bare unlit bulb in a plain fitting hangs above a wooden workbench, a flat battery block stands on the bench with two cloth-covered wires running to a small toggle switch and on up to the fitting; a 13-year-old girl stands at the bench, her finger still resting on the switch she has just pressed, looking up at the dark bulb; a 13-year-old boy sits on a stool beside her pointing at the middle of the cable, caught mid-sentence; low late-afternoon sun comes through the window at the back so the room is golden and dim while the lamp itself stays out, bicycles and a tool board along the walls; no meter, no dial, no pointer, no display, no glowing dots or moving particles inside the cable, no circuit symbols, no circuit diagram on the wall, no drawn rays anywhere in the picture.
```

### `st5 Zwei Messgeräte an der Werkbank.png` — st5

> Zwei fast gleiche Geräte liegen nebeneinander, ein Kabel hängt noch in Jannis' Hand - und die Lampe daneben bleibt dunkel.

**Motiv:** NAHAUFNAHME, die das Bild ganz ausfüllt: zwei fast gleich aussehende graue Handmessgeräte liegen dicht nebeneinander auf einer zerkratzten Werkbankplatte, beide mit der Rückseite und den Anschlussbuchsen zu uns, die Skalenseite abgewandt; quer über das Holz läuft ein Gewirr aus roten und schwarzen Messleitungen, eine Klemme hängt noch zwischen den Fingern eines 13-jährigen Jungen, dessen Hand von unten rechts ins Bild kommt, die flache Hand eines 13-jährigen Mädchens liegt ruhig daneben neben einem kleinen, dunklen Lämpchen in einer Holzfassung; tiefstehendes warmes Nachmittagslicht streift von links über die Bank, der Hintergrund verliert sich in weichem braunem Werkstattschatten.

**Darf nicht zu sehen sein:** Kein durchgehend verfolgbarer Kabelweg von Lämpchen zu Batterie, keine erkennbare Reihen- oder Parallelschaltung, keine Skalenseite, kein Zeiger, kein Anzeigewert, keine Schaltskizze und kein zweites Bildfeld mit dem richtigen Anschluss.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: extreme close-up filling the whole frame: two nearly identical grey handheld measuring instruments lying side by side on a scratched wooden workbench, both turned so that only their backs and connector sockets face the viewer and their dial sides are hidden, a loose tangle of red and black test leads spread across the wood, one clip still held between the fingers of a 13-year-old boy whose hand enters from the lower right, the flat resting hand of a 13-year-old girl beside a small dark unlit bulb in a wooden holder, low warm late-afternoon sunlight raking in from the left across the bench, the background dissolving into soft brown workshop shadow, no traceable wiring path from bulb to battery, no dial face, no pointer, no reading, no circuit diagram and no drawn wiring plan anywhere in the picture.
```

### `st6 Drei Bauteile an derselben Batterie.png` — st6

> Nour drückt den dritten Draht an dieselbe Batterie - und weiß noch nicht, warum ausgerechnet dieser so wenig hergibt.

**Motiv:** Halbnah von Nours linker Seite: ein 13-jähriges Mädchen mit dunklem, kurzem Zopf steht vorgebeugt an der Werkbank der Fahrradwerkstatt und drückt das blanke Ende eines dünnen grauen Widerstandsdrahts gegen den Pol einer flachen blauen Batterie, vor ihr liegen im lockeren Durcheinander ein kurzer dicker Kupferdraht und ein feiner gewendelter Glühdraht kreuz und quer übereinander neben der offenen Bauteilkiste, ein gleichaltriger Junge schaut ihr über die Schulter zu; kühles Morgenlicht fällt aus einem hohen Fenster hinter den beiden auf die Bank; ganz am rechten Bildrand steht ein altes Messgerät mit dem Rücken zu uns, und dort hört das Bild auf.

**Darf nicht zu sehen sein:** Keine Skalenseite und kein Zeigerausschlag, kein zweites Messgerät, keine Gegenüberstellung von zwei Drähten am selben Gerät, kein leuchtender oder unterschiedlich heller Vergleich, keine Schaltskizze und nichts rechts vom Messgerät.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: medium shot seen from her left side: a 13-year-old girl with short dark hair tied back, leaning forward over the workbench of a school bike workshop, pressing the bare end of a thin grey resistance wire against the terminal of a flat blue battery, in front of her a loose jumble of a short thick copper wire and a fine coiled filament wire crossing over each other beside an open parts box, a boy of the same age watching over her shoulder, cool morning light falling from a high window behind them onto the bench, an old measuring instrument standing at the very right edge of the frame with its back turned to us and there the picture ends, no dial face, no pointer, no reading, no second instrument, no side-by-side comparison, no circuit diagram anywhere in the picture.
```

### `st7 Drahtrollen aus der Restekiste.png` — st7

> Jannis hält das längste Stück Draht hoch, das er finden konnte - und Nours ausgestreckter Arm hält ihn im letzten Moment auf.

**Motiv:** Weit, vom offenen Türrahmen aus in die Ecke der hellen Fahrradwerkstatt gesehen: ein 13-jähriger Junge kniet auf dem Betonboden neben einer zerbeulten Holzkiste und hält grinsend mit beiden Händen einen langen, lockeren Drahtring über den Kopf, ein gleichaltriges Mädchen steht neben ihm und streckt den Arm aus, um ihn aufzuhalten, um seine Knie herum quellen Drahtrollen unterschiedlicher Dicke aus der Kiste, über den beiden hängt eine nackte, dunkle Glühlampe in ihrer Fassung an einem Deckenbalken, an der Rückwand lehnen zwei halb fertige Fahrräder, flaches Mittagslicht flutet durch ein hohes staubiges Fenster von rechts herein.

**Darf nicht zu sehen sein:** Keine brennende oder unterschiedlich hell leuchtende Lampe, kein Messgerät mit Anzeige, keine nebeneinandergelegte Reihe aus dünn-mittel-dick zum Vergleichen, keine Batterie im angeschlossenen Kreis und keine Schaltskizze.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: wide shot from an open doorway into the corner of a bright school bike workshop: a 13-year-old boy kneeling on the concrete floor beside a battered wooden crate, grinning as he holds a long loose coil of wire up over his head with both hands, a girl of the same age standing beside him with one arm stretched out to stop him, spools of wire of different thicknesses spilling out of the crate around his knees, a bare dark unlit bulb hanging in its socket from a ceiling beam above them, two half-built bicycles leaning against the back wall, flat midday daylight flooding in through a tall dusty window on the right, no glowing lamp, no measuring instrument, no connected battery, no neat row of samples laid out for comparison, no circuit diagram anywhere in the picture.
```

### `st8 Eine Gerade aus Messpunkten.png` — st8

> Nour hält Jannis ein Blatt hin, auf dem nur zwei winzige Bleistiftpunkte stehen - und er greift trotzdem schon nach dem Messgerät.

**Motiv:** Halbnah auf Augenhöhe quer über die Werkbank am Abend: ein 13-jähriges Mädchen hält ein kleines kariertes Blatt hoch, auf dem nur zwei winzige Bleistiftpunkte gesetzt sind und sonst nichts, und dreht es einem gleichaltrigen Jungen zu, der mit ausgestrecktem Arm an ihr vorbei nach einem Handmessgerät greift, zwischen beiden liegen auf der Bank ein Drahtbund und eine kleine Lampenfassung; warmes gelbes Licht einer einzelnen Arbeitsleuchte fällt von oben auf das Blatt und die Gesichter, dahinter ein dunkelblaues Fenster und die stille Werkstatt.

**Darf nicht zu sehen sein:** Keine Linie und keine Gerade durch die Punkte, keine Achsen, kein fertiges Diagramm, keine weiteren Messpunkte, keine Anzeige auf dem Messgerät und keine Rechnung auf dem Papier.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: medium shot at eye level across a workbench in the evening: a 13-year-old girl holding up a small sheet of squared paper on which only two tiny pencil dots have been marked and nothing else, turning it towards a boy of the same age who reaches past her with an outstretched arm for a handheld measuring instrument, a bundle of wire and a small lamp socket lying on the bench between them, warm yellow light from a single work lamp above falling onto the paper and their faces, a dark blue window and the quiet workshop behind them, no line and no straight line through the dots, no axes, no finished graph, no further points, no reading on the instrument, no calculation on the paper anywhere in the picture.
```

### `st9 Die Lichterkette an der Werkbank.png` — st9

> Die alte Kette hängt endlich am Netzteil, doch jedes einzelne Lämpchen glimmt nur müde vor sich hin.

**Motiv:** NAHAUFNAHME, die das Bild ganz ausfüllt: die Hände eines 13-jährigen Jungen heben eine verhedderte alte Lichterkette aus einem Pappkarton auf die Werkbank, alle winzigen Lämpchen sitzen an einem einzigen Kabel, eines hinter dem anderen, und glimmen nur matt bernsteinfarben; von links fällt graues, bedecktes Tageslicht durch ein Werkstattfenster darauf, sodass die Kette kaum heller wirkt als der Raum; vom rechten Bildrand her greift die Hand eines gleichaltrigen Mädchens an den Drehknopf eines kleinen Netzteils, ihr Gesicht liegt schon außerhalb des Bildes, dort hört das Bild auf; darunter abgewetztes Holz, ein Schraubendreher und ein paar Fahrradspeichen, unscharf am Rand.

**Darf nicht zu sehen sein:** Keine zweite, hellere Lichterkette und kein kürzeres Vergleichsstück daneben, kein Messgerät mit Zeiger oder Anzeige, keine Zahlen, kein Schaltplan, keine hervorgehobene einzelne Lampe und nichts, was zeigt, wie sich der Strom durch die Reihe verändert.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. extreme close-up filling the whole frame: the hands of a 13-year-old boy lifting a tangled old string of small lamps out of a cardboard box onto a worn wooden workbench, every tiny bulb sitting on one single cable one behind the other, all of them glowing only faintly in dull amber, barely brighter than the grey overcast daylight falling in from a workshop window on the left; the hand of a girl the same age comes in from the right edge with her fingers on the dial of a small power supply, her face already outside the frame, and there the picture ends; screwdriver and bicycle spokes blurred along the lower edge; no second brighter string of lights, no shorter comparison piece, no meter, no dial reading, no circuit diagram and no drawn rays anywhere in the picture.
```

### `st10 Eine Lampe fällt aus.png` — st10

> Kaum brennt die neue Deckenlampe, wird die alte daneben dunkel — und die neue leuchtet trotzdem ruhig weiter.

**Motiv:** Halbnahe Aufnahme aus der Untersicht: ein 13-jähriges Mädchen steht auf einem Holztritt in der kahlen Schulwerkstatt, den Arm noch erhoben, die Finger am Rand der zweiten Deckenlampe, die sie gerade eingeschraubt hat; ihr Kopf ist zur ersten Lampe daneben gedreht, deren Glas grau angelaufen ist und die dunkel bleibt, während die neue ruhig und warm brennt und ihren Schatten über die nackte Decke wirft; beide Lampen sitzen in schlichten Deckenfassungen, das Morgenlicht kommt von einem hohen Fenster hinter ihr, in der unteren rechten Ecke schaut ein gleichaltriger Junge zu ihr hoch.

**Darf nicht zu sehen sein:** Keine sichtbaren Kabel oder Leitungen zwischen den beiden Lampen, keine offene Decke, keine Klemme, kein Schalter, kein Schaltplan, keine Lichterkette im selben Bild und nichts, woran man ablesen könnte, wie die beiden Lampen miteinander verdrahtet sind.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. medium shot from a low angle looking up: a 13-year-old girl standing on a wooden step stool in a bare school workshop, one arm still raised with her fingers on the rim of the second ceiling lamp she has just screwed in, her head turned to the older lamp beside it whose glass has gone smoky and dark, while the new one burns steady and warm and throws her shadow across the plain ceiling; both lamps sit in simple ceiling sockets with no cable showing anywhere, cool morning daylight from a high window behind her, a boy the same age looking up from the lower right corner; no visible wiring, no cables between the lamps, no open ceiling, no switch, no circuit diagram, no string of lights and no drawn rays anywhere in the picture.
```

### `st11 Sofort hell trotz drei Metern Kabel.png` — st11

> Der Finger liegt noch auf dem Schalter, und am anderen Ende der Werkbank brennt die Lampe längst.

**Motiv:** Weite Aufnahme des ganzen Raums, gesehen von der offenen Tür aus: die lange schmale Schulwerkstatt am späten Abend, rechts am Werkbankende steht ein 13-jähriger Junge, den Zeigefinger noch auf einem schwarzen Kippschalter neben dem Netzteil; ganz links, am anderen Ende derselben Bank, brennt eine kleine Leselampe bereits hell und warm und ist die einzige Lichtquelle im Raum; das graue Kabel läuft über die ganze Länge der Bank, einmal über einen Haken an der Wand geschlungen, vom Netzteil bis zu dieser Lampe; in der Mitte der Bank steht ein gleichaltriges Mädchen und blickt vom Schalter zur Lampe hinüber, draußen vor dem Fenster blaue Nacht, dahinter Fahrräder im Halbdunkel.

**Darf nicht zu sehen sein:** Keine leuchtenden Punkte, Funken oder wandernden Kügelchen im Kabel, kein aufgeschnittenes oder durchsichtiges Kabel, keine Uhr, keine Stoppuhr, keine Zahlen, kein Schaltplan und nichts, was andeutet, wie schnell sich im Draht etwas bewegt.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. wide shot of the whole room seen from the open doorway: a long narrow school workshop late in the evening, on the right a 13-year-old boy at the end of the workbench with his forefinger still resting on a black rocker switch beside a small power supply, far away at the left end of the same bench a little reading lamp already burning bright and warm as the only light in the room, a grey cable running the whole length of the bench from the power supply to that lamp, looped once over a hook on the wall; a girl the same age stands halfway along the bench looking from the switch across to the lamp, blue night outside the window, bicycles in the shadows behind her; no glowing dots or travelling specks inside the cable, no cut-open or transparent cable, no clock, no stopwatch, no circuit diagram and no drawn rays anywhere in the picture.
```

### `st12 Gewitter über dem Schulhof.png` — st12

> Der Schulhof liegt für einen Moment blass im Licht, und die beiden zählen mit, während der Donner noch aussteht.

**Motiv:** Halbnahe Aufnahme von schräg hinten über die Schultern: zwei 13-Jährige stehen unter dem Betonvordach der Schule, neben sich die beiden hereingeschobenen Fahrräder, vor ihnen fällt Regen auf den leeren Schulhof; der Junge hält drei Finger einer Hand hoch, das Mädchen sieht mit halb offenem Mund zum Himmel, mitten im Zählen; weit hinten über den Dächern steht eine schwere dunkelgraue Wolke, die für einen Augenblick von innen heraus fahl aufleuchtet, das nasse Asphaltpflaster spiegelt diesen blassen Schein, ringsum spätnachmittägliches Gewitterlicht in Grau und Grün.

**Darf nicht zu sehen sein:** Kein gezackter Blitzstrahl vom Himmel zum Boden, keine Schallwellen, Ringe oder Kreise in der Luft, keine Uhr und keine Stoppuhr, keine Zahlen, keine geladenen Bereiche in der Wolke und nichts, was den Abstand oder die Zeit zwischen Blitz und Donner darstellt.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark. medium shot from slightly behind and above two 13-year-olds: a boy and a girl standing under a concrete school canopy with their two bicycles pushed in beside them, rain falling in front of them onto the empty schoolyard, the boy holding up three fingers of one hand, the girl looking up at the sky with her mouth half open in the middle of counting; far away over the rooftops one heavy dark grey cloud lit pale from inside for an instant, the wet asphalt reflecting that faint glow, late afternoon storm light in grey and green; no forked lightning bolt drawn between sky and ground, no sound waves, no rings or circles in the air, no clock, no stopwatch, no charged patches in the cloud and no drawn rays anywhere in the picture.
```

### `st13 Zwei Lampen an einem Netzteil.png` — st13

> In der Fassung glimmt das winzige Lämpchen kaum, und die zweite Lampe wartet noch kalt in Nours Hand.

**Motiv:** Sehr enge NAHAUFNAHME, die den ganzen Rahmen füllt: die beiden Hände eines dreizehnjährigen Mädchens an einer kahlen Porzellanfassung, die an einem Kabel dicht über der hölzernen Werkbank hängt; in der Fassung sitzt ein winziges klares Lämpchen mit haarfeinem Draht, das nur schwach bernsteinfarben glimmt, und in der anderen Hand hält sie am rechten Bildrand eine zweite, größere Lampe mit dickem gewendeltem Draht, kalt und unangeschlossen - dort hört das Bild auf; später Winternachmittag, das einzige warme Licht kommt vom schwachen Glimmen selbst, dazu dämmriges blaugraues Tageslicht von hinten; unscharf im Hintergrund Werkzeug und eine Pappkiste voller Bauteile.

**Darf nicht zu sehen sein:** Die zweite Lampe darf nicht leuchten, blenden oder glühen, es darf keinen Hell-Dunkel-Vergleich zweier brennender Lampen geben, keine Wärmeschlieren oder Hitzewellen, kein Netzteil mit ablesbarer Anzeige, kein Messgerät, keine Skala, keine Zahl und kein Aufdruck auf den Lampen.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: extreme close-up filling the whole frame: the two hands of a 13-year-old girl at a bare porcelain lamp socket hanging on a cord just above a wooden workbench; in the socket sits one tiny clear bulb with a hair-thin filament glowing only faintly amber, barely brighter than the room; her other hand holds a second, bigger bulb with a thick coiled filament up at the right edge of the frame, cold and unlit and not connected to anything, and there the picture ends; late winter afternoon, the only warm light is the weak glow of the small bulb, with dim blue-grey daylight from behind; softly blurred background of hand tools and a cardboard box of electrical parts; the second bulb stays dark, no glare, no second lit lamp, no heat shimmer, no meter, no dial, no scale, no printing on the glass and no drawn rays anywhere in the picture.
```

### `st14 Zu viel an einer Steckdose.png` — st14

> Drei Stecker hängen schon in der Mehrfachdose, und Jannis hält den vierten kurz vor dem letzten freien Platz.

**Motiv:** Halbnahe Aufnahme leicht von unten: eine einzelne weiße Steckdose tief an der Werkstattwand, aus der eine Mehrfachsteckdose heraushängt, drei Kabel stecken schon darin und hängen schwer nach unten - ein Handy-Ladegerät, ein Lötkolben, ein kleines Radio; ein vierzehnjähriger Junge hockt auf dem Betonboden und hält den Stecker eines kleinen Heizlüfters wenige Zentimeter vor dem letzten freien Platz, den Kopf fragend zu einem dreizehnjährigen Mädchen gedreht, das neben ihm steht und eine Hand halb hebt, zögernd; kaltes Morgenlicht fällt von einem zugigen Fenster links herein, lange weiche Schatten über den Boden, im Hintergrund unscharf ein Fahrradrahmen im Ständer.

**Darf nicht zu sehen sein:** Keine Funken, kein Rauch, keine glühende oder geschmolzene Steckdose, kein Sicherungskasten, kein umgelegter Schalter, kein plötzlich dunkler Raum, kein erschrockenes Gesicht und kein Hinweis darauf, ob der Stecker am Ende hineingeht oder nicht.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: medium shot from slightly below: one single white wall socket low on a workshop wall, a white multi-plug strip hanging out of it with three cables already plugged in and drooping heavily downward, a phone charger, a soldering iron and a small radio; a 14-year-old boy crouches on the concrete floor and holds the plug of a small fan heater a few centimetres away from the last free opening, his head turned up and questioning towards a 13-year-old girl standing beside him with one hand half raised, hesitating; cold early morning light from a draughty window on the left, long soft shadows across the floor, a bicycle frame in a repair stand blurred in the background; no sparks, no smoke, no glowing or melted plastic, no fuse box, no switch, no darkened room and no drawn rays anywhere in the picture.
```

### `be1 Das Wettrennen auf dem Schulhof.png` — be1

> Zwei fertige Räder stehen nebeneinander an der Kreidelinie, und noch ist keines gefahren.

**Motiv:** Weite Aufnahme aus niedriger Kameraposition dicht über dem Asphalt: ein sonniger Schulhof am Mittag, zwei frisch reparierte Fahrräder stehen still nebeneinander hinter einem dicken Kreidestrich, ein großes blaues und ein kleineres rotes, beide auf dem Ständer; ein vierzehnjähriger Junge zeigt stolz auf das blaue Rad, ein dreizehnjähriges Mädchen steht mit verschränkten Armen daneben und blickt an der leeren abgesteckten Bahn entlang, die nach rechts aus dem Bild läuft - dort hört das Bild auf; zwei orange Hütchen am Rand, hohe warme Mittagssonne von oben, kurze harte Schatten, im Hintergrund weich verschwommen das Schulgebäude.

**Darf nicht zu sehen sein:** Niemand fährt, niemand tritt in die Pedale, kein Rad ist in Bewegung, keine Bewegungsstreifen oder Windlinien, kein Vorsprung eines Rades vor dem anderen, kein Zielband, kein Sieger, keine laufende Stoppuhr und keine Markierung, die schon eine Zeit oder eine Länge angibt.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: wide shot from a low camera close above the asphalt: a sunny schoolyard at midday, two freshly repaired bicycles standing completely still side by side behind a thick chalk line, one big blue one and one smaller red one, both on their kickstands; a 14-year-old boy points proudly at the blue bicycle, a 13-year-old girl stands beside him with folded arms and looks along the empty marked lane that runs away to the right edge of the frame, and there the picture ends; two orange cones at the side, high warm midday sun from above, short crisp shadows, a school building softly blurred in the background; nobody is riding, no wheel is turning, no motion blur, no speed lines, no leader ahead of the other, no finish tape, no stopwatch and no winner anywhere in the picture.
```

### `be2 Zehn Meter und eine Stoppuhr.png` — be2

> Die Kreidelinie ist fertig, die Stoppuhr liegt bereit - und keiner weiß, was man jetzt aufschreiben soll.

**Motiv:** Halbnahe Aufnahme aus Kniehöhe schräg von der Seite: später Nachmittag auf dem Schulhof, tiefe goldene Sonne von links wirft lange Schatten über den Asphalt; ein dreizehnjähriges Mädchen kniet auf dem Boden und hat gerade einen dicken Kreidestrich quer über den Asphalt fertig gezogen, Kreidestaub an den Fingern; neben ihr steht ein vierzehnjähriger Junge, in der flachen Hand eine Stoppuhr, deren Zifferblatt vom Betrachter weggedreht ist, im anderen Arm ein aufgeschlagenes leeres Heft, die Schultern fragend hochgezogen, der Blick zu ihr; weit hinten am rechten Bildrand liegt der zweite Kreidestrich, dort hört das Bild auf; ein Fahrrad lehnt unscharf am Zaun.

**Darf nicht zu sehen sein:** Kein lesbares Zifferblatt, keine geschriebene Zahl, keine Tabelle und keine Rechnung im Heft, kein Maßband und kein Zollstock mit Zahlen, keine Meterangaben auf dem Boden, keine fahrende Person und keine Bewegungsstreifen.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: medium shot from knee height and slightly to the side: late afternoon on a schoolyard, low golden sun from the left casting long shadows over the asphalt; a 13-year-old girl kneels on the ground and has just finished drawing one thick chalk line across the asphalt, chalk dust on her fingers; beside her a 14-year-old boy stands holding a stopwatch flat in one hand with its face turned away from the viewer, an open blank notebook in his other arm, shoulders shrugged, looking at her with an open questioning face; far away at the right edge lies the second chalk line, and there the picture ends; a bicycle leans blurred against a fence; no readable dial, no written numbers, no table, no measuring tape, no marked distances on the ground, nobody riding and no motion streaks anywhere in the picture.
```

### `be3 Der Rechenzettel an der Werkbank.png` — be3

> Zwei Köpfe über einem kleinen Zettel, und jeder hat eine andere Zahl im Kopf.

**Motiv:** NAHAUFNAHME, die das ganze Bild ausfüllt: die Ecke einer hölzernen Werkbank, darauf mit einem Streifen Klebeband ein kleiner Zettel, dessen Bleistiftspuren weich, verwischt und völlig unlesbar sind; von links schiebt sich Nour (13) ins Bild, dunkle Locken, ein Finger liegt auf dem Zettel, von rechts Jannis (13) mit halb geschlossenen Augen, der an den erhobenen Fingern mitzählt; nur die beiden Gesichter, die Hände und der Zettel sind im Bild, Wangen und Knöchel von kühlem Morgenlicht aus einem hohen Fenster links getroffen, dahinter unscharf das warme Braun der Bank mit Schraubendreher und Fahrradklingel.

**Darf nicht zu sehen sein:** Kein lesbarer Zahlenwert, kein Ergebnis, keine Formel, keine Bruchschreibweise, kein Taschenrechner, keine Tabelle, kein Bildschirm, keine Uhr mit ablesbarem Zifferblatt, kein Diagramm und keine zweite Bildhälfte mit einem anderen Zeitpunkt.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark.: extreme close-up filling the whole frame: the corner of a wooden workshop bench, a small scrap of paper held to the bench edge by a strip of tape, its pencil marks soft, smudged and completely unreadable; a 13-year-old girl with dark curly hair leans in from the left with one fingertip resting on the paper, a 13-year-old boy leans in from the right with his eyes half closed, counting on his raised fingers; only their faces, their hands and the paper are inside the frame, cheeks and knuckles lit by cool morning light from a high window on the left, behind them the blurred warm brown of the bench with a screwdriver and a bicycle bell out of focus; no screen, no calculator, no clock face, no chart and no readable writing or figures anywhere in the picture.
```

### `be4 Tacho und Heft widersprechen sich.png` — be4

> Er hält den alten Tacho hoch, sie das Heft an die Brust gedrückt - und beide bestehen auf ihrer Zahl.

**Motiv:** Halbnah, später Nachmittag auf dem Schulhof, tief stehende goldene Sonne von rechts: links steht Nour (13) aufrecht, das aufgeschlagene Schulheft mit der beschriebenen Seite an die Brust gedrückt, eine Augenbraue hochgezogen; rechts hockt Jannis (13) neben dem Vorderrad eines frisch geputzten Fahrrads und hält den kleinen alten Fahrradtacho hoch zu ihr, dessen Zifferblatt von uns weggedreht ist; die beiden sehen einander an, nicht uns, lange Schatten laufen über den Asphalt, im weichen Hintergrund die Schulwand und ein Kreidestrich; der Tacho liegt am rechten Bildrand, dort hört das Bild auf.

**Darf nicht zu sehen sein:** Kein ablesbares Zifferblatt, keine Ziffern auf Tacho oder Heftseite, kein Verkehrsschild mit Tempoangabe, kein Rechenweg, keine Umrechnungstabelle, kein Bildschirm und keine zweite Person oder zweites Rad, das denselben Moment noch einmal zeigt.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark.: medium shot: late afternoon on a school yard, low golden sunlight coming from the right; on the left a 13-year-old girl stands upright holding an open exercise book pressed against her chest with the written page turned away from us, one eyebrow raised; on the right a 13-year-old boy crouches beside the front wheel of a freshly cleaned bicycle and holds a small old bicycle speedometer up towards her, its little dial turned away from the viewer; they look at each other, not at us, long shadows stretch across the asphalt, a chalk line and the school wall sit soft and hazy in the background; the speedometer is at the right edge and there the picture ends; no readable dial, no road sign, no printed table, no screen and no diagram anywhere in the picture.
```

### `be5 Kreidestriche auf dem Schulhof.png` — be5

> Sie reißt den Arm hoch und ruft "jetzt", während die Kreide noch nass auf dem Asphalt glänzt.

**Motiv:** Weit, aus leicht erhöhter Sicht über den hellen Schulhof, Mittagslicht von hoch oben, kurze harte Schatten, blasser Himmel: im Mittelgrund fährt Jannis (13) auf dem Fahrrad ruhig nach rechts, leicht im Stehen tretend, der Oberkörper aufrecht; vorne links kauert Nour (13) auf dem Asphalt, die Kreide in der rechten Hand, den linken Arm mitten im Hochreißen, der Mund offen; unter ihrer Hand liegt ein einziger frischer weißer Kreidestrich, davor ist der Asphalt leer; im weiten Hintergrund eine niedrige Ziegelmauer und ein einzelner Verkehrshütchen, warmer trockener Asphalt.

**Darf nicht zu sehen sein:** Keine Reihe aus mehreren Kreidestrichen, kein Maßband, keine Skala auf dem Boden, keine ablesbare Stoppuhr, kein Diagramm, keine Bahnkurve, keine Wiederholung desselben Fahrrads an einer zweiten Stelle und keine Bildfelder nebeneinander.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark.: wide shot from a slightly raised viewpoint: a broad sunlit school yard at midday under a high sun and a pale sky, short crisp shadows; in the middle distance a 13-year-old boy rides a bicycle steadily towards the right, standing lightly on the pedals with an upright body; in the near foreground on the left a 13-year-old girl crouches low on the asphalt, a piece of chalk in her right hand, her left arm flung up in mid-shout and her mouth open; under her hand lies one single fresh white chalk stroke and the asphalt in front of her is bare and empty; a low brick wall and a single traffic cone far in the background, warm dry asphalt; only one bicycle and only one chalk stroke exist in this picture; no row of marks, no measuring tape, no readable stopwatch, no scale on the ground and no diagram anywhere in the picture.
```

### `be6 Linien an der Werkstattwand.png` — be6

> Sie hat den Bleistift noch am Papier und dreht sich um; er sieht nur Striche.

**Motiv:** Halbnah, von schräg hinten und seitlich aufgenommen: die Werkstatt am Abend, eine warme Arbeitsleuchte an einem Ausleger beleuchtet ein großes Blatt Packpapier, das an der Bretterwand klebt; das Blatt steht in steiler Schrägsicht, sodass die wenigen blassen freihändigen Bleistiftstriche darauf verkürzt und unlesbar bleiben, ohne Achsen, ohne Raster, ohne Skala; Nour (13) steht dicht an der Wand, den Bleistift noch am Papier, und dreht den Kopf über die Schulter zurück zu Jannis (13), der einen Schritt hinter ihr steht, die Arme verschränkt, den Kopf schief, unüberzeugt; im dämmrigen warmen Hintergrund Fahrradrahmen und die Werkbank, im Fenster rechts blaue Abenddämmerung.

**Darf nicht zu sehen sein:** Kein sauber gezeichnetes Diagramm mit Achsen, Raster, Skala oder Achsenbeschriftung, keine Steigungsdreiecke, keine gestrichelten Hilfslinien, keine Pfeile, kein Bildschirm, kein gedrucktes Schaubild und keine zweite Zeichnung zum Vergleich daneben.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark.: medium shot seen from behind and slightly to the side: a bicycle workshop in the evening, a warm work lamp on a bracket lighting one large sheet of brown parcel paper taped to the plank wall; the sheet is seen at a steep sideways angle so that the few pale free-hand pencil strokes crossing it stay foreshortened and unreadable, with no axes, no grid and no scale; a 13-year-old girl stands close to the wall with her pencil still touching the paper, turning her head back over her shoulder towards a 13-year-old boy who stands one step behind her, arms folded, head tilted, unconvinced; bicycle frames and a workbench in the dim warm background, blue dusk in the window on the right; only one sheet of paper in the room; no screen, no ruler, no printed chart, no drawn axes and no readable writing or figures anywhere in the picture.
```

### `be7 Anfahren und Bremsen am Hoftor.png` — be7

> Nour hat die Kreide schon am Boden, Jannis drückt sich gerade in die Pedale – gleich wird sich zeigen, ob die Striche wieder gleich weit auseinanderliegen.

**Motiv:** Halbnah, Kamera dicht über dem Asphalt am offenen Hoftor: links im Vordergrund kniet Nour (13) auf einem Knie, den Kreidestummel bereits auf den blanken Asphalt gesetzt, den Kopf zu Jannis gedreht; er steht dicht neben ihr in den Pedalen des frisch reparierten Rads, das Gewicht weit nach vorn geworfen, das Vorderrad setzt sich gerade erst in Bewegung, feiner Staub am Reifen; die späte Vormittagssonne fällt von links und legt lange weiche Schatten über die leere graue Fläche, am rechten Bildrand steht der gemauerte Torpfeiler, dort hört das Bild auf, dahinter unscharf das niedrige Werkstattgebäude.

**Darf nicht zu sehen sein:** Kein einziger Kreidestrich und keine Punktreihe auf dem Boden, keine Marken mit erkennbar ungleichen Abständen, kein Maßband, keine Zahlen, kein bremsendes Rad an der Mauer, kein zweites Rad und kein Diagramm – wie sich die Sekunden-Marken beim Beschleunigen und beim Bremsen verändern, darf das Bild nicht vorwegnehmen.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: medium shot, camera low and close to the sunlit asphalt of a school yard at an open brick gateway, two 13-year-old children; on the left in the foreground a girl kneels on one knee, a short stub of chalk already pressed against the bare asphalt beside her, her head turned to follow the boy; right next to her the boy stands up on the pedals of a freshly repaired bicycle, weight thrown far forward, the front wheel only just beginning to roll, a little dust at the tyre; late morning sunlight from the left, long soft shadows across an empty grey surface, a brick gate post at the right edge where the picture ends, the low workshop building out of focus behind; the asphalt is completely bare and unmarked, no chalk strokes and no row of marks or dots on the ground anywhere, no measuring tape, no braking bicycle at a wall, no second bicycle and no diagram anywhere in the picture.
```

### `be8 Die Linie steigt und fällt.png` — be8

> Jannis rollt mit stehenden Pedalen über den Hof, Nour hebt den Stift – und am Rand streiten die anderen schon, was aus dieser Fahrt herauskommt.

**Motiv:** Weit, Blick quer über den Schulhof im tiefen Nachmittagslicht: links steht Nour (13) im Profil, ein Holzklemmbrett fest an die Brust gedrückt, sodass nur seine leere Rückseite zum Betrachter zeigt, der Bleistift in der erhobenen Hand, den Blick auf Jannis (13), der in der Bildmitte mit ausgetretenen Pedalen frei über den Asphalt ausrollt; nahe am rechten Bildrand stehen zwei weitere Kinder derselben Altersgruppe einander gegenüber, mitten im Widerspruch, die Hände offen, daneben markiert ein orangefarbener Hütchen-Kegel das Ende der Kreidestartlinie, dort hört das Bild auf; lange warme Schatten über der grauen Fläche, rote Backsteinwand und Fahrradständer im Hintergrund.

**Darf nicht zu sehen sein:** Die Papierseite des Klemmbretts bleibt abgewandt, keine gezeichnete Linie, kein Diagramm, keine Achsen, kein Millimeterpapier, kein steigender, waagerechter oder fallender Kurvenzug, kein Plakat an der Wand und keine Zahlen – was die drei Abschnitte im v-t-Diagramm bedeuten, darf im Bild nirgends ablesbar sein.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: wide shot across a big school yard in low late afternoon sunlight, seen from the side; on the left a 13-year-old girl stands in profile, a wooden clipboard hugged against her chest so that only its empty blank back faces the viewer, a pencil raised in her free hand, her eyes following a 13-year-old boy who coasts freely on a bicycle across the middle of the yard with his feet off the pedals; near the right edge two other children of the same age stand facing each other in the middle of a disagreement, hands open, and beside them a single orange cone marks the end of a chalk starting line, and there the picture ends; long warm shadows stretch over the grey asphalt, a red brick school wall and bicycle racks behind; the clipboard paper is turned away and nothing drawn is visible, no diagram, no graph, no curve, no axes, no grid paper, no chart or poster on any wall anywhere in the picture.
```

### `be9 Ein Schild für die Einfahrt.png` — be9

> Jannis tippt weit vorn auf den Asphalt, Nour klopft dicht vor sich auf den Boden – und dazwischen liegt das leere Brett, auf das gleich der Abstand kommen soll.

**Motiv:** NAHAUFNAHME, die das ganze Bild ausfüllt, Kamera tief am Rand der gepflasterten Einfahrt im frühen Morgenlicht: die Hände und Knie von Nour und Jannis (beide 13) auf kühlem grauem Asphalt, Jannis hockt und tippt mit ausgestrecktem Zeigefinger weit links auf den Boden, als setze er dort eine Marke, Nour kniet ihm gegenüber, ein unbemaltes rohes Sperrholzbrett quer auf dem Oberschenkel, den Zimmermannsbleistift in der Faust, die andere Hand klopft viel näher vor sich auf die Fläche; eine verblasste weiße Randlinie der Einfahrt läuft schräg an ihren Fingern vorbei, Tau liegt noch auf dem Boden, flaches Streiflicht von rechts, unscharf dahinter das offene Werkstatttor.

**Darf nicht zu sehen sein:** Das Brett bleibt völlig leer und unbeschriftet, kein Auto, kein Reifen, keine Bremsspur, keine Schleuderspur, kein Maßband, keine abgesteckte Strecke, keine Zahlen und keine gezeichnete Linie auf dem Boden – wie lang der Bremsweg wirklich wird, darf das Bild nicht zeigen.

```
ONE single scene in ONE frame, ONE frozen instant. Absolutely no film strip, no comic panels, no before-and-after, no split screen, no repeated objects, no sequence, no insets, no round inset circle, no arrows, no arrowheads, no dashed lines, no ray diagram, no drawn light rays, no captions, no labels, no text of any kind. warm painterly children's educational illustration, storybook realism, hand-painted look, NOT a photograph, not flat vector cartoon, clear readable silhouettes, smooth soft gradients, muted warm palette, wide 5:3 landscape composition, no text, no letters, no numbers, no logos, no watermark: extreme close-up filling the whole frame, camera very low at the edge of a paved driveway in early morning light, the hands and knees of two 13-year-old children on cool grey asphalt; the boy crouches and touches the ground far out to the left with an outstretched index finger as if setting a mark there, the girl kneels opposite him with a blank unpainted plywood board resting across her thigh and a thick carpenter's pencil in her fist, her other hand tapping the ground much closer in front of herself; a faded white painted edge line of the driveway runs diagonally past their fingers, dew still on the surface, low slanting sunlight from the right, the open workshop doorway soft and out of focus behind them; the board is completely blank and unpainted, no car, no vehicle, no tyre, no skid mark, no braking marks, no measuring tape, no marked-out distance and no drawing on the ground anywhere in the picture.
```
