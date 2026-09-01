// ============================================================================
//  heft-bruecke.js  –  ERZEUGT, NICHT VON HAND AENDERN
//  Quelle: arbeitsheft*/content/forscherseiten.json
//  Neu bauen:  python3 arbeitsheft/bruecke_alle.py
//
//  Der QR-Code jeder Heftseite ruft  #experiment=<sim>&heft=<id>  auf. Ueber diese
//  Tabelle weiss die App dann, aus welchem Heft und von welcher Seite ein Kind
//  kommt und welche Forscherfrage oben stehen muss - auch wenn zwei Heftseiten
//  auf dieselbe Simulation zeigen.
// ============================================================================
'use strict';

const HEFT_SEITEN = {
  "m1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "magnetfeld", seite: 5,
    kapitel: "Magnetismus",
    name: "Magnete und magnetische Felder",
    titel: "Der Schlüssel liegt unten",
    frage: "Wie weit reicht die Wirkung eines Magneten?",
    auftrag: "Untersuche mit dem Prüfkompass, bis zu welchem Abstand die Nadel noch gedreht wird.",
    schritte: ["Schalte Feldlinien ein und stelle „Stelle am Magneten“ auf 0 Grad, also an das Ende. Stelle den Abstand ganz klein.", "Vergrößere den Abstand Schritt für Schritt. Merke dir die Zahl, ab der die Nadel kaum noch gedreht wird.", "Gegenprobe am Tisch: Nähere einen Magneten langsam einer Büroklammer. Lege dabei erst ein Blatt Papier dazwischen, dann ein dickes Buch."]
  },
  "m2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "magnet-stoffe", seite: 7,
    kapitel: "Magnetismus",
    name: "Welche Stoffe zieht ein Magnet an?",
    titel: "Nicht alles kommt mit",
    frage: "Welche Stoffe zieht ein Magnet an?",
    auftrag: "Prüfe der Reihe nach, welche Stoffe der Magnet anzieht und welche nicht.",
    schritte: ["Wähle nacheinander Eisen-Nagel, Büroklammer (Stahl) und Nickel-Münze. Notiere jedes Mal, ob der Magnet hält.", "Prüfe danach Alu-Dose, Kupfer-Draht und Holz-Stab. Vergleiche, was der Magnet mit ihnen macht.", "Wähle zum Schluss Blech 1, Blech 2 und Blech 3. Finde heraus, welche Bleche der Magnet anzieht."]
  },
  "m3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "magnetpole", seite: 9,
    kapitel: "Magnetismus",
    name: "Wie wirken Magnetpole aufeinander?",
    titel: "Zwei Magnete, zweimal anders",
    frage: "Wie wirken zwei Magnetpole aufeinander?",
    auftrag: "Vergleiche, was geschieht, wenn du den Magneten umdrehst.",
    schritte: ["Wähle Magnet an der Tür so herum und stelle Abstand d auf 5 cm. Lies ab, ob sich die Magnete anziehen oder abstoßen.", "Wähle nun Magnet an der Tür umgedreht bei gleichem Abstand d. Lies wieder ab und vergleiche mit Schritt 1.", "Stelle Abstand d auf 2 cm und danach auf 10 cm ein. Übernimm jeden Wert mit Messwert übernehmen."]
  },
  "m4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "magnetfeld", seite: 11,
    kapitel: "Magnetismus",
    name: "Wie sieht ein Magnetfeld aus?",
    titel: "Das unsichtbare Muster",
    frage: "Wo ist ein Magnetfeld stark und wo ist es schwach?",
    auftrag: "Vergleiche mit dem Regler „Stelle am Magneten“, wo die Feldlinien dicht liegen.",
    schritte: ["Schalte Feldlinien ein. Stelle „Stelle am Magneten“ auf 0 Grad und schau, wie dicht die Linien dort liegen.", "Stelle nacheinander 40 Grad und 90 Grad ein. Lies jedes Mal ab, ob die Linien dicht oder weit auseinander liegen.", "Gegenprobe am Tisch: Hänge eine Büroklammer an das Ende eines Magneten und danach an seine Mitte."]
  },
  "m5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "kompass", seite: 14,
    kapitel: "Magnetismus",
    name: "Wie funktioniert ein Kompass?",
    titel: "Im Park zeigt der Kompass plötzlich anders",
    frage: "Warum zeigt eine Kompassnadel nach Norden?",
    auftrag: "Untersuche, wann ein Magnet die Nadel von Norden wegzieht.",
    schritte: ["Schalte Erdmagnetfeld ein. Stelle „Magnet – Abstand“ auf 6 cm und lies ab, wohin die Nadelspitze zeigt.", "Stelle „Magnet – Abstand“ nacheinander auf den kleinsten und den größten Wert. Lies jedes Mal die Richtung der Nadel ab.", "Stelle wieder 6 cm ein und schalte Erdmagnetfeld aus. Stoße die Nadel mit „Nadel anstoßen“ an und lies ab, wohin sie sich stellt."]
  },
  "l1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "lichtausbreitung", seite: 24,
    kapitel: "Licht & Schatten",
    name: "Lichtquellen und Lichtausbreitung",
    titel: "Was leuchtet hier eigentlich?",
    frage: "Läuft Licht geradeaus oder um die Ecke?",
    auftrag: "Untersuche, wie die beiden Löcher stehen müssen, damit das Licht die Wand erreicht.",
    schritte: ["Stelle „Loch der 1. Blende“ auf 0 und „Loch der 2. Blende“ auf 0. Schau nach, ob hinten Licht an der Wand ankommt.", "Lass die 1. Blende auf 0 und schiebe „Loch der 2. Blende“ nach oben und nach unten. Lies ab, wann das Licht verschwindet.", "Stelle „Loch der 1. Blende“ auf +18. Probiere aus, bei welcher Zahl der 2. Blende wieder Licht ankommt."]
  },
  "l2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "sehen", seite: 26,
    kapitel: "Licht & Schatten",
    name: "Wie können wir einen Gegenstand sehen?",
    titel: "Es liegt doch direkt da",
    frage: "Warum sehen wir einen Gegenstand im Dunkeln nicht?",
    auftrag: "Untersuche, welche Dinge du ohne Zimmerlicht siehst und welche erst mit Licht.",
    schritte: ["Stelle Zimmerlicht auf aus. Wähle nacheinander Tuete Gummibaerchen, Katzenauge und Taschenlampe und notiere, was du siehst.", "Stelle Zimmerlicht auf an. Wähle dieselben drei Dinge noch einmal und lies ab, was sich geändert hat.", "Gegenprobe am Tisch: Leuchte im dunklen Zimmer mit der Taschenlampe auf einen Löffel und halte die Lampe dann daneben."]
  },
  "l3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "schatten-entstehung", seite: 28,
    kapitel: "Licht & Schatten",
    name: "Wie entsteht ein Schatten?",
    titel: "Der Klotz an der Wand",
    frage: "Wie entsteht ein Schatten?",
    auftrag: "Untersuche, wie das Schattenbild wandert, wenn du die Höhe der Lampe verstellst.",
    schritte: ["Stelle Lampe (Höhe) auf oben. Schau nach, wo das Schattenbild an der Wand liegt und wie lang es ist.", "Stelle Lampe (Höhe) Schritt für Schritt tiefer. Lies jedes Mal ab, wohin der Schatten wandert und wie lang er wird.", "Stelle Gegenstand auf weg. Schau nach, was dann von dem Schatten übrig bleibt."]
  },
  "l4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "schatten-groesse", seite: 30,
    kapitel: "Licht & Schatten",
    name: "Wovon hängt die Größe des Schattens ab?",
    titel: "Bis unter die Decke",
    frage: "Wovon hängt die Größe eines Schattens ab?",
    auftrag: "Untersuche, wie sich der Schatten ändert, wenn der Pappwolf von der Wand wegrückt.",
    schritte: ["Schiebe mit Pappwolf verschieben den Wolf dicht an die Bretterwand. Lies ab, wie hoch sein Schatten ist, und wähle Messwert übernehmen.", "Schiebe den Pappwolf Schritt für Schritt weiter von der Bretterwand weg. Wähle jedes Mal Messwert übernehmen und vergleiche die Werte.", "Lass den Pappwolf stehen und schiebe mit Bretterwand verschieben die Wand weiter weg. Lies den neuen Schatten ab."]
  },
  "l5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "kern-halbschatten", seite: 32,
    kapitel: "Licht & Schatten",
    name: "Kern- und Halbschatten",
    titel: "Zwei Kerzen, ein komischer Schatten",
    frage: "Warum hat ein Schatten manchmal einen helleren Rand?",
    auftrag: "Vergleiche den Schatten bei einer Lampe und bei zwei weit auseinanderstehenden Lampen.",
    schritte: ["Stelle Quelle auf „punktförmig“. Wähle dann „nur eine Taschenlampe“ und schau dir den Rand des Schattens an der Wand an.", "Wähle „zwei Lampen weit auseinander“. Vergleiche jetzt die Mitte des Schattens mit seinem Rand.", "Gegenprobe am Tisch: Leuchte im dunklen Zimmer mit zwei Taschenlampen nebeneinander auf einen Ball vor der Wand."]
  },
  "l6": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "reflexionsgesetz", seite: 35,
    kapitel: "Licht & Schatten",
    name: "Reflexionsgesetz & ebene Spiegel",
    titel: "Licht um die Ecke",
    frage: "Nach welcher Regel wird Licht an einem Spiegel zurückgeworfen?",
    auftrag: "Miss den Einfallswinkel und den Winkel des zurückgeworfenen Strahls.",
    schritte: ["Stelle den Einfallswinkel zum Lot auf 20 Grad ein und lies ab, unter welchem Winkel der Strahl zurückläuft. Wiederhole das mit 40 und mit 60 Grad.", "Stelle den Einfallswinkel auf 0 Grad, also senkrecht auf den Spiegel, und halte fest, wohin der Strahl geht.", "Stelle wieder 40 Grad ein und drehe dann den Spiegel um 10 Grad. Lies ab, um wie viel der Lichtfleck an der Wand weiterspringt."]
  },
  "s2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "stromkreis-lampe", seite: 46,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Wann leuchtet eine Lampe?",
    titel: "Alles heil, und trotzdem dunkel",
    frage: "Wann leuchtet eine Lampe und wann bleibt sie dunkel?",
    auftrag: "Untersuche, was geschieht, wenn du Schalter und Kabel umstellst.",
    schritte: ["Stelle es so ein, dass „Schalter: geschlossen“ und „Kabel: heil“ dasteht. Schau nach, ob das Lämpchen leuchtet.", "Drücke einmal auf „Schalter: geschlossen“. Lies ab, was jetzt dasteht, und beobachte dabei das Lämpchen.", "Stelle den Schalter zurück und drücke stattdessen auf „Kabel: heil“. Beobachte das Lämpchen noch einmal."]
  },
  "s3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "leiter-nichtleiter", seite: 49,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Welche Stoffe leiten Strom?",
    titel: "Der Riss im Kabel",
    frage: "Welche Stoffe leiten den Strom?",
    auftrag: "Untersuche, welche Gegenstände das Lämpchen zum Leuchten bringen.",
    schritte: ["Wähle nacheinander Büroklammer, Nagel und Münze. Notiere jedes Mal, ob das Lämpchen leuchtet.", "Prüfe danach Holz-Stab, Plastik-Lineal, Glas-Stab und Radiergummi. Schreibe wieder auf, was du siehst.", "Wähle zuletzt Alufolie und Bleistiftmine. Drücke dann „Alles zurücksetzen“ und beobachte das Lämpchen."]
  },
  "s6": {
    klasse: 5, schulform: "Realschule NRW",
    sim: null, seite: 43,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Der Schalter",
    titel: "Muss der Schalter an die Batterie?",
    frage: "Wovon hängt es ab, ob dein Schalter den Stromkreis unterbricht?",
    auftrag: "Untersuche, an welcher Stelle die Leitung getrennt sein muss.",
    schritte: ["Baue aus dem Brettchen, den zwei Reißzwecken und der Büroklammer einen Schalter und setze ihn in deinen Stromkreis.", "Prüfe den Schalter an drei Stellen im Kreis. Lege die Büroklammer als Gegenprobe auch nur auf eine Reißzwecke.", "Setze den Schalter zuletzt dicht an die Batterie und danach hinter das Lämpchen. Halte fest, ob sich am Ergebnis etwas ändert."]
  },
  "s4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "reihenschaltung-rs", seite: 54,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Reihenschaltung",
    titel: "Zwei Lampen, und beide funzeln",
    frage: "Was geschieht, wenn mehrere Lampen hintereinander hängen?",
    auftrag: "Untersuche die Helligkeit bei 1, 2 und 3 Lampen und drehe dann Lampe 2 heraus.",
    schritte: ["Stelle Anzahl Lampen in Reihe auf 1 und lass Schalter geschlossen. Schau nach, wie hell die Lampe leuchtet.", "Stelle Anzahl Lampen in Reihe nacheinander auf 2 und auf 3. Vergleiche jedes Mal, wie hell eine einzelne Lampe leuchtet.", "Bleibe bei 3 Lampen und wähle bei Lampe 2 herausgedreht. Beobachte, was mit den anderen Lampen passiert."]
  },
  "s5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "parallelschaltung-rs", seite: 56,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Parallelschaltung",
    titel: "Vorne aus, hinten an",
    frage: "Warum lässt sich jede Lampe einzeln schalten?",
    auftrag: "Untersuche, welche Lampe brennt, wenn du die beiden Schalter einzeln bedienst.",
    schritte: ["Stelle Bens Schalter (Lampe 1) auf an und Jonas’ Schalter (Lampe 2) auf an. Lies ab, welche Lampen brennen.", "Stelle Jonas’ Schalter (Lampe 2) auf aus. Beobachte, ob Lampe 1 weiterbrennt.", "Stelle Bens Schalter (Lampe 1) auf aus und Jonas’ Schalter (Lampe 2) auf an. Lies ab, welche Lampe jetzt brennt."]
  },
  "s7": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "elektromagnet", seite: 58,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Elektromagnet",
    titel: "Der Knopf, der den Magneten anschaltet",
    frage: "Wovon hängt die Stärke eines Elektromagneten ab?",
    auftrag: "Miss die Tragkraft, wenn du nur die Windungszahl und dann nur den Strom änderst.",
    schritte: ["Wähle „Windungszahl N“ und stelle 50, 100 und 200 ein. Lies jedes Mal die Tragkraft ab; der Strom bleibt bei 2 A.", "Stelle die Windungszahl auf 300 und vergleiche den Wert mit dem bei 150 Windungen.", "Wähle „Stromstärke I“ und stelle nacheinander 1 A, 2 A und 4 A ein; die Windungszahl bleibt fest bei 150."]
  },
  "s1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "schaltplan", seite: 53,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Stromkreis und Schaltzeichen",
    titel: "Der Zettel aus dem Fahrradladen",
    frage: "Warum versteht ein anderer meine Schaltung schneller mit Schaltzeichen?",
    auftrag: "Vergleiche, ob dein Partner besser nach deinem Bild oder nach Schaltzeichen nachbaut.",
    schritte: ["Ordne jedem Bauteil aus der Kiste sein Zeichen vom Zettel zu.", "Zeichne deinen Stromkreis zweimal: mit eigenen Bildern und nur mit Schaltzeichen. Lass beides nachbauen."]
  },
  "w1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "temperatur-waerme", seite: 69,
    kapitel: "Temperatur & Wärme",
    name: "Sind Temperatur und Wärme das Gleiche?",
    titel: "Der Löffel in der Teetasse",
    frage: "Sind Temperatur und Wärme dasselbe?",
    auftrag: "Untersuche, wie warm heißes und kaltes Wasser zusammen werden.",
    schritte: ["Stelle beim ersten Wasser Menge: 1 L und Temperatur: 80 °C ein, beim zweiten Menge: 1 L und Temperatur: 20 °C.", "Wähle In Kontakt bringen und lies beide Temperaturen ab. Wähle danach Zurücksetzen und stelle beim zweiten Wasser Menge: 2 L ein.", "Gegenprobe am Tisch: Stelle einen Löffel in ein Glas mit warmem Wasser. Fasse den Griff nach zwei Minuten an."]
  },
  "w2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "thermometer", seite: 71,
    kapitel: "Temperatur & Wärme",
    name: "Wie funktioniert ein Thermometer?",
    titel: "Der Faden, der wandert",
    frage: "Wie zeigt ein Thermometer die Temperatur an?",
    auftrag: "Untersuche, wie sich der Faden verändert, wenn du die Temperatur einstellst.",
    schritte: ["Stelle die Temperatur auf 20 °C ein. Lies ab, bei welcher Zahl der Faden steht.", "Wähle nacheinander „Eiswasser“, „Bens Faust“, „warmes Wasser“ und „kochendes Wasser“. Lies jedes Mal die Zahl ab.", "Gegenprobe am Tisch: Stelle ein Thermometer in ein Glas kaltes Wasser. Lies nach zwei Minuten ab."]
  },
  "w3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "waermeausdehnung", seite: 73,
    kapitel: "Temperatur & Wärme",
    name: "Was geschieht beim Erwärmen von Stoffen?",
    titel: "Der bockige Deckel",
    frage: "Dehnen sich alle Stoffe beim Erwärmen gleich stark aus?",
    auftrag: "Vergleiche einen festen, einen flüssigen und einen gasförmigen Stoff.",
    schritte: ["Wähle „fest“ und stelle die Temperatur auf 20 °C ein. Erhöhe dann auf 80 °C und beobachte, wie viel größer der Stoff wird.", "Wähle „flüssig“ und danach „Gas“. Gehe jedes Mal wieder von 20 °C auf 80 °C und vergleiche, wer sich am stärksten ausdehnt.", "Gegenprobe am Tisch: Halte den Blechdeckel eines Glases kurz in heißes Wasser und drehe ihn danach auf."]
  },
  "w4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "aggregatzustaende", seite: 75,
    kapitel: "Temperatur & Wärme",
    name: "Wie verändern sich Aggregatzustände?",
    titel: "Aus Eis wird Wasser",
    frage: "Bei welchen Temperaturen ist Wasser fest, flüssig oder gasförmig?",
    auftrag: "Untersuche die drei Zustände in der Simulation nacheinander.",
    schritte: ["Stelle die Temperatur auf 20 °C ein. Lies ab, ob das Wasser fest, flüssig oder gasförmig ist.", "Wähle „abkühlen“, bis du bei minus 10 °C bist. Beobachte, bei welcher Zahl das Wasser fest wird.", "Wähle danach „erwärmen“ bis 110 °C. Beobachte, bei welcher Zahl aus dem Wasser Wasserdampf wird."]
  },
  "w5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "waermeuebertragung", seite: 77,
    kapitel: "Temperatur & Wärme",
    name: "Wie wird Wärme übertragen?",
    titel: "Zu heiß zum Anfassen",
    frage: "Auf welchen Wegen wandert Wärme zu einem kalten Körper?",
    auftrag: "Vergleiche Leitung, Strömung und Strahlung an der Simulation.",
    schritte: ["Wähle Leitung. Beobachte, an welcher Stelle es zuerst warm wird und wohin die Wärme von dort aus wandert.", "Wähle danach Strömung und dann Strahlung. Lies jedes Mal ab, ob die Wärme das kalte Teil auch ohne Berührung erreicht.", "Gegenprobe am Tisch: Stelle einen Metalllöffel und einen Holzlöffel in ein Glas mit warmem Wasser und fühle nach fünf Minuten."]
  },
  "sc1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "ton-entsteht", seite: 87,
    kapitel: "Schall & Hören",
    name: "Wie entsteht ein Ton?",
    titel: "Das Brummen aus der Gitarre",
    frage: "Wie entsteht ein Ton?",
    auftrag: "Untersuche, ob ein Ton weitergeht, wenn das Gummiband nicht mehr zittert.",
    schritte: ["Wähle Gummiband zupfen. Beobachte das Band ganz genau und höre hin, ob dabei ein Ton entsteht.", "Wähle nun Finger auf das Band legen. Lies ab, ob das Band noch zittert und ob der Ton weitergeht.", "Gegenprobe am Tisch: Spanne ein Gummiband zwischen deine Finger, zupfe es und stoppe es dann mit dem Daumen."]
  },
  "sc2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "lautstaerke", seite: 89,
    kapitel: "Schall & Hören",
    name: "Wovon hängt die Lautstärke ab?",
    titel: "Nicht so laut!",
    frage: "Wovon hängt die Lautstärke ab?",
    auftrag: "Vergleiche Ausschlag und Lautstärke bei sanft, mittel und fest.",
    schritte: ["Stelle „So fest zupft Ben am Gummiband“ auf sanft. Beobachte, wie weit das Band ausschlägt, und lies die Lautstärke ab.", "Stelle danach mittel und dann fest ein. Lies jedes Mal ab, wie weit das Band ausschlägt und wie laut der Ton wird.", "Vergleiche zum Schluss sanft und fest. Achte darauf, ob der Ton dabei nur lauter wird oder auch höher klingt."]
  },
  "sc3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "tonhoehe", seite: 91,
    kapitel: "Schall & Hören",
    name: "Wovon hängt die Tonhöhe ab?",
    titel: "Zu hoch, zu tief",
    frage: "Wovon hängt die Tonhöhe ab?",
    auftrag: "Untersuche, wie sich der Ton von 200 Hz bis 800 Hz verändert.",
    schritte: ["Stelle „So schnell schwingt Emmas Glas (Schwingungen pro Sekunde)“ auf 200 Hz ein. Höre den Ton an.", "Stelle danach 300 Hz und 800 Hz ein. Lies jedes Mal ab, ob der Ton höher oder tiefer klingt als vorher.", "Gegenprobe am Tisch: Fülle zwei Gläser verschieden hoch mit Wasser und schlage sie mit einem Löffel an."]
  },
  "sc4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "schallausbreitung", seite: 93,
    kapitel: "Schall & Hören",
    name: "Wie breitet sich Schall aus?",
    titel: "Der Nachbar hört alles",
    frage: "Braucht Schall etwas, worin er sich ausbreiten kann?",
    auftrag: "Vergleiche Luft, Wasser, Holz und Vakuum miteinander.",
    schritte: ["Wähle „Luft“ und höre, wie laut der Schall ankommt. Wähle dann „Wasser“ und vergleiche beides.", "Wähle „Balken (Holz)“. Lies ab, ob der Schall dort lauter oder leiser ankommt als durch Luft.", "Wähle zum Schluss „Vakuum (Weltall)“. Beobachte, ob überhaupt noch etwas bei dir ankommt."]
  },
  "sc5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "ohr", seite: 95,
    kapitel: "Schall & Hören",
    name: "Wie funktioniert das Ohr?",
    titel: "Das Pfeifen im Ohr",
    frage: "Was geschieht im Ohr, wenn es laut wird?",
    auftrag: "Untersuche, wie stark das Trommelfell bei leise, mittel und laut schwingt.",
    schritte: ["Stelle „So laut schlägt Noah den Topf an“ auf leise. Beobachte, wie weit das Trommelfell ausschlägt.", "Stelle danach mittel und laut ein. Lies jedes Mal ab, ob das Trommelfell schwächer oder stärker schwingt.", "Gegenprobe am Tisch: Schlage einen Topf mit dem Löffel erst leise, dann kräftig an und fühle den Rand."]
  },
  "h1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "tag-nacht", seite: 105,
    kapitel: "Sonne, Erde & Mond",
    name: "Wie entstehen Tag und Nacht?",
    titel: "Tag hier, Nacht dort",
    frage: "Wie entstehen Tag und Nacht?",
    auftrag: "Untersuche mit dem Regler Drehung, wann dein Ort im Licht und wann im Schatten liegt.",
    schritte: ["Halte mit Pause an und stelle Drehung auf 0 Grad ein. Sieh nach, wie viel von der Erde hell ist und wie viel dunkel.", "Stelle danach 90, 180 und 270 Grad ein. Lies jedes Mal ab, ob dein Ort im Licht liegt oder im Schatten.", "Gegenprobe am Tisch: Leuchte mit einer Taschenlampe auf einen Globus. Drehe ihn langsam und suche die Grenze zwischen hell und dunkel."]
  },
  "h2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "jahreszeiten", seite: 107,
    kapitel: "Sonne, Erde & Mond",
    name: "Wie entstehen die Jahreszeiten?",
    titel: "Vom Schnee zum Sonnenbrand",
    frage: "Warum ist es im Sommer wärmer als im Winter?",
    auftrag: "Vergleiche mit den Knöpfen Sommer und Winter, wie steil das Licht auftrifft.",
    schritte: ["Wähle Sommer und sieh nach, welche Erdhälfte zur Sonne geneigt ist. Achte darauf, wie steil das Licht bei uns auftrifft.", "Wähle danach Herbst, Winter und Frühling. Vergleiche jedes Mal, wie steil oder wie flach das Licht bei uns ankommt.", "Gegenprobe am Tisch: Leuchte mit einer Taschenlampe steil und dann flach auf ein Blatt Papier. Vergleiche die Lichtflecke."]
  },
  "h3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "mondphasen", seite: 109,
    kapitel: "Sonne, Erde & Mond",
    name: "Warum verändert der Mond sein Aussehen?",
    titel: "Jeden Abend ein anderer Mond",
    frage: "Warum verändert der Mond sein Aussehen?",
    auftrag: "Untersuche, wie viel vom hellen Teil du bei den vier Stellungen siehst.",
    schritte: ["Wähle Mond zwischen Sonne und Erde. Sieh nach, wie viel von der hellen Seite des Mondes du von der Erde aus siehst.", "Wähle danach Mond seitlich – zunehmend, dann Mond der Sonne gegenüber, dann Mond seitlich – abnehmend. Lies jedes Mal die Form ab.", "Gegenprobe am Tisch: Leuchte mit einer Taschenlampe auf einen Ball und bewege ihn langsam um deinen Kopf herum."]
  },
  "h4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "sonnenfinsternis", seite: 111,
    kapitel: "Sonne, Erde & Mond",
    name: "Wie entsteht eine Sonnenfinsternis?",
    titel: "Nacht am Mittag",
    frage: "Wie entsteht eine Sonnenfinsternis?",
    auftrag: "Untersuche, bei welcher Mondstellung ein dunkler Fleck auf die Erde fällt.",
    schritte: ["Stelle Mondstellung auf 40. Schau nach, ob auf der Erde irgendwo ein dunkler Fleck liegt.", "Stelle den Regler dann auf 20 und auf 10. Nutze zuletzt den Knopf „Ball genau in die Linie stellen“ und lies jedes Mal ab, wie der Fleck aussieht.", "Gegenprobe am Tisch: Leuchte im dunklen Zimmer mit einer Taschenlampe auf einen Globus. Halte einen kleinen Ball genau dazwischen."]
  },
  "h5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "mondfinsternis", seite: 114,
    kapitel: "Sonne, Erde & Mond",
    name: "Wie entsteht eine Mondfinsternis?",
    titel: "Der Mond wird rot",
    frage: "Wie entsteht eine Mondfinsternis?",
    auftrag: "Untersuche, wie sich der Mond verändert, wenn er in die Schattenmitte wandert.",
    schritte: ["Stelle Mondbahn neben der Schattenmitte auf 40. Schau dir an, wie hell der Mond dort ist.", "Stelle den Regler dann auf 20 und auf 10. Lies jedes Mal ab, wie viel vom Mond noch hell ist.", "Nutze zuletzt den Knopf „Ball genau hinter den Globus stellen“. Beobachte in Ruhe, welche Farbe der Mond nun hat."]
  },
  "o1": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "lochkamera", seite: 5,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie macht ein kleines Loch ein Bild? (Lochkamera)",
    titel: "Ein Stich in den Karton",
    frage: "Wie verändern sich Schärfe und Helligkeit des Bildes, wenn das Loch größer wird?",
    auftrag: "Untersuche an der Simulation den Einfluss der Lochgröße auf Schärfe und Helligkeit.",
    schritte: ["Stelle die Gegenstandsweite g auf 40 cm, die Bildweite b (Kameralänge) auf 30 cm und die Lochgröße auf klein. Beschreibe, wie die Flamme auf dem Schirm steht.", "Stelle die Lochgröße nacheinander auf mittel und auf groß, ohne g und b zu verändern. Achte jedes Mal auf Schärfe und Helligkeit des Bildes.", "Stelle die Lochgröße wieder auf klein und vergrößere die Bildweite b (Kameralänge) von 30 cm auf 60 cm. Vergleiche das Bild mit deiner ersten Einstellung."]
  },
  "o2": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sammellinse", seite: 8,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie bündelt eine Sammellinse das Licht?",
    titel: "Der kleinste helle Fleck",
    frage: "Wovon hängt es ab, wie weit hinter der Linse das Licht gebündelt wird?",
    auftrag: "Untersuche an der Simulation, wie die Wölbung des Glases den Brennpunkt verschiebt.",
    schritte: ["Wähle in der Mitte dicker und stelle Wölbung des Glases – Brennweite f auf 90 ein. Lies ab, in welchem Abstand hinter der Linsenmitte sich alle Strahlen treffen.", "Stelle f nacheinander auf 60 und auf 150. Achte darauf, wie stark das Glas jeweils gewölbt ist und wie weit der Treffpunkt von der Linse entfernt liegt.", "Gegenprobe: Wähle bei f 90 den Knopf in der Mitte dünner und beobachte, ob sich die Strahlen hinter dem Glas noch in einem Punkt treffen."]
  },
  "o8": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sammellinse", seite: 10,
    kapitel: "Optik: Wie wir sehen",
    name: "Sammellinse und Zerstreuungslinse im Vergleich",
    titel: "Das Glas, das nichts bündelt",
    frage: "Was macht ein in der Mitte dickeres, was ein dünneres Glas mit dem Licht?",
    auftrag: "Vergleiche in der Simulation beide Gläser an demselben Lichtbündel.",
    schritte: ["Wähle „in der Mitte dicker“ und stelle Wölbung des Glases – Brennweite f auf 90. Verfolge, wo sich die Strahlen hinter dem Glas treffen.", "Wähle bei derselben Brennweite f von 90 „in der Mitte dünner“. Suche hinter dem Glas wieder eine Stelle, an der sich die Strahlen treffen.", "Gegenprobe am Tisch: Lege eine Lupe und ein Brillenglas für Kurzsichtige auf eine Zeile Schrift und hebe beide langsam an."]
  },
  "o3": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "bild-linse", seite: 12,
    kapitel: "Optik: Wie wir sehen",
    name: "Wann entsteht ein vergrößertes oder verkleinertes Bild?",
    titel: "Mal riesig, mal winzig",
    frage: "Wann entsteht ein vergrößertes, wann ein verkleinertes Bild?",
    auftrag: "Untersuche in der Simulation, wie Größe und Lage des Bildes von der Gegenstandsweite g abhängen.",
    schritte: ["Stelle die Gegenstandsweite g auf 170. Vergleiche die Höhe des Bildes mit der Höhe des Gegenstands und beachte, wie herum das Bild steht.", "Stelle g nacheinander auf 124, also auf 2f, und danach auf 90. Beobachte jedes Mal die Bildgröße und den Abstand des Bildes zur Linse.", "Stelle g auf den kleinsten einstellbaren Wert, der kleiner als f = 62 ist. Prüfe, ob sich die Strahlen hinter der Linse noch treffen."]
  },
  "o4": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "lupe", seite: 15,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie funktioniert eine Lupe?",
    titel: "Wenn das Bild kippt",
    frage: "Warum vergrößert eine Lupe erst, wenn sie nah genug am Gegenstand steht?",
    auftrag: "Untersuche, wie sich die Vergrößerung ändert, wenn g Schritt für Schritt an die Brennweite heranrückt.",
    schritte: ["Stelle den Regler „Abstand Gegenstand–Lupe g“ auf 10 ein und lies die angegebene Vergrößerung ab. Stelle danach 30 ein und lies erneut ab.", "Stelle g auf 54 und danach auf 58 und 80 ein. Notiere, ab welchem Wert die Simulation kein aufrechtes Lupenbild mehr zeigt.", "Gegenprobe am Tisch: Lege eine Lupe flach auf eine Schrift und hebe sie langsam an, bis das Bild verschwimmt und umgekehrt erscheint."]
  },
  "o5": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "kamera", seite: 17,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie funktioniert eine Kamera?",
    titel: "Das Papier muss wandern",
    frage: "Was muss man an einer Kamera einstellen, damit das Bild scharf wird?",
    auftrag: "Miss den Abstand Linse–Sensor für ein scharfes Bild und prüfe, ob die Blende daran etwas ändert.",
    schritte: ["Stelle „Abstand Linse–Sensor (Bildweite)“ auf 90 ein und lies die Meldung ab. Verkleinere den Wert in Zweierschritten und notiere, zwischen welchen Werten das Bild scharf ist.", "Halte die Bildweite bei 66 und stelle „Blende (Öffnung)“ nacheinander auf klein (dunkel), mittel und groß (hell). Stelle danach die Bildweite auf 110, die Blende bleibt groß (hell).", "Gegenprobe am Tisch: Fange mit einer Lupe das Bild des Fensters auf einem weißen Blatt auf und verschiebe das Blatt, bis das Bild scharf ist."]
  },
  "o6": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "auge", seite: 20,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie funktioniert das Auge?",
    titel: "Der Turm auf dem Papier",
    frage: "Wie ändert sich das Bild auf der Netzhaut, wenn der Gegenstand näher kommt?",
    auftrag: "Untersuche am Modellauge die Abbildung bei verschiedenen Abständen des Gegenstands.",
    schritte: ["Stelle „Abstand des Gegenstands“ auf weit und „Pupille (Helligkeit)“ auf mittel. Vergleiche, wohin die Spitze des Gegenstands zeigt und wohin die Spitze des Bildes auf der Netzhaut zeigt.", "Stelle „Abstand des Gegenstands“ nacheinander auf mittel und auf nah. Lies jedes Mal ab, wie groß das Bild auf der Netzhaut ist und wohin seine Spitze zeigt.", "Gegenprobe am Tisch: Halte eine Lupe etwa eine Handbreit vor ein weißes Blatt und suche darauf das Bild des Fensters. Prüfe, wohin der Fensterrahmen auf dem Blatt zeigt."]
  },
  "o7": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brille", seite: 23,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie korrigiert eine Brille Sehfehler?",
    titel: "Das Bild landet daneben",
    frage: "Wohin schiebt eine Brille den Treffpunkt der Strahlen?",
    auftrag: "Untersuche das nacheinander für ein kurzsichtiges und für ein weitsichtiges Auge.",
    schritte: ["Wähle kurzsichtig und beobachte, wo sich die Strahlen treffen: vor der Netzhaut, genau auf ihr oder dahinter. Schalte dann Brille dazu und beobachte den Treffpunkt erneut.", "Wähle weitsichtig und beobachte den Treffpunkt ohne und mit Brille. Notiere jedes Mal, wo die Strahlen zusammenlaufen und wie scharf das Bild ist.", "Gegenprobe am Tisch: Lege zwei Brillengläser auf eine Zeitungsseite. Das Glas, das die Schrift vergrößert, ist in der Mitte dicker, das andere in der Mitte dünner."]
  },
  "f8": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "licht-oberflaeche", seite: 34,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Was passiert, wenn Licht auf eine Oberfläche trifft?",
    titel: "Zwei Bilder in einer Scheibe",
    frage: "Was geschieht mit dem Licht, wenn es auf verschiedene Oberflächen trifft?",
    auftrag: "Untersuche an Spiegel, Fensterglas, schwarzem und weißem Papier, welche Anteile zurückkommen, durchgehen und bleiben.",
    schritte: ["Stelle den Winkel zum Lot auf 45° und wähle Spiegel. Lies ab, welche Anteile des Lichts zurückgeworfen, durchgelassen und geschluckt werden.", "Wähle bei genau diesem Winkel nacheinander Fensterglas, schwarzes Papier und weißes Papier. Lies jedes Mal alle drei Anteile ab.", "Gegenprobe am Tisch: Leuchte mit der Taschenlampe schräg auf einen Spiegel und auf schwarzes Papier und fange das zurückgeworfene Licht auf einem weißen Blatt auf."]
  },
  "f9": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "reflexionsgesetz", seite: 37,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Nach welcher Regel wird Licht an einem Spiegel zurückgeworfen?",
    titel: "Der Punkt an der Wand",
    frage: "Nach welcher Regel wird Licht an einem Spiegel zurückgeworfen?",
    auftrag: "Vergleiche Einfallswinkel und Reflexionswinkel am Lot und prüfe, was das Drehen des Spiegels bewirkt.",
    schritte: ["Lass Spiegel drehen auf 0° und stelle den Einfallswinkel zum Lot nacheinander auf 20°, 40° und 65° ein. Lies jedes Mal den Reflexionswinkel ab.", "Stelle den Einfallswinkel zum Lot auf 40° und Spiegel drehen auf 10°. Lies den Reflexionswinkel ab und beobachte, wie weit der Strahl im Raum schwenkt.", "Wähle Spiegel zurückstellen und danach Strahl auf das Lot. Halte fest, wohin der zurückgeworfene Strahl läuft."]
  },
  "f1": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "spiegelbild", seite: 39,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wie entsteht ein Spiegelbild?",
    titel: "Hinter dem Glas steht niemand",
    frage: "Wie weit hinter dem Spiegel liegt das Spiegelbild?",
    auftrag: "Untersuche mit dem Regler Abstand Gegenstand–Spiegel g, wie sich der Ort des Bildes ändert.",
    schritte: ["Stelle den Regler Abstand Gegenstand–Spiegel g auf 60 ein und lies ab, wie weit das Bild hinter dem Spiegel liegt. Das ist dein Ausgangswert.", "Stelle nacheinander 110 und 160 ein und lies jedes Mal beide Abstände ab. Achte darauf, ob sich das Bild dabei vom Spiegel wegbewegt.", "Gegenprobe am Tisch: Stelle einen Spiegel senkrecht auf und lege eine Münze 5 cm davor. Prüfe, ob ihr Bild ebenso weit hinter dem Spiegel zu liegen scheint."]
  },
  "f10": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brechung-eintritt", seite: 42,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wo ändert das Licht beim Übergang von Luft in Glas seine Richtung?",
    titel: "Der Knick am Rand",
    frage: "An welcher Stelle knickt ein Lichtstrahl beim Übergang von Luft in Glas?",
    auftrag: "Vergleiche für mehrere Winkel in der Luft, wie groß der Winkel im Glas ausfällt.",
    schritte: ["Stelle den Regler Winkel in der Luft auf 20° ein und lies den Winkel im Glas ab. Achte darauf, an welcher Stelle der Strahl knickt.", "Stelle nacheinander 40° und 60° ein und lies jedes Mal den Winkel im Glas ab. Vergleiche ihn mit dem eingestellten Winkel in der Luft.", "Schalte ungebrochene Richtung ein und vergleiche sie mit dem wirklichen Strahl im Glas. Wähle danach genau auf das Lot und prüfe, ob noch ein Knick bleibt."]
  },
  "f2": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brechung", seite: 44,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Warum erscheint ein Gegenstand im Wasser verschoben?",
    titel: "Die Münze kommt zurück",
    frage: "Warum sieht ein Gegenstand im Wasser flacher aus, als er wirklich liegt?",
    auftrag: "Untersuche an der Simulation, wie stark der scheinbare Ort mit der Tiefe abweicht.",
    schritte: ["Stelle Tiefe des Gegenstands auf 30 ein. Vergleiche, wo der Gegenstand wirklich liegt und wo dein Auge ihn sieht.", "Stelle nacheinander 60 und 90 ein. Lies jedes Mal ab, wie weit der scheinbare Ort über dem Gegenstand liegt.", "Gegenprobe am Tisch: Lege eine Münze in ein Glas Wasser und schaue schräg von oben hinein. Prüfe, ob sie höher zu liegen scheint als der Glasboden."]
  },
  "f3": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brechungswinkel", seite: 47,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wovon hängt die Stärke der Brechung ab?",
    titel: "Immer zehn Grad weiter",
    frage: "Wovon hängt es ab, wie stark ein Lichtstrahl gebrochen wird?",
    auftrag: "Untersuche, wie der Brechungswinkel mitwächst, und ob Wasser anders bricht als Glas.",
    schritte: ["Wähle Glas und stelle den Einfallswinkel θ auf 20 Grad ein. Lies den Brechungswinkel ab und vergleiche ihn mit dem Einfallswinkel.", "Stelle den Einfallswinkel θ nacheinander auf 40 Grad und auf 60 Grad ein. Lies jedes Mal den Brechungswinkel ab und prüfe, ob er sich beim Verdoppeln mitverdoppelt.", "Wähle bei 60 Grad Wasser statt Glas und lies den Brechungswinkel noch einmal ab. Vergleiche ihn mit dem Wert, den Glas bei 60 Grad ergeben hat."]
  },
  "f11": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brechung-austritt", seite: 49,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Was geschieht beim Übergang von Glas in Luft?",
    titel: "Zurück ins Freie",
    frage: "Ab welchem Winkel tritt aus dem Glas kein Licht mehr in die Luft aus?",
    auftrag: "Untersuche, wie sich der austretende Strahl ändert, wenn der Winkel im Glas wächst.",
    schritte: ["Stelle den Winkel im Glas auf 10 Grad ein und lies ab, unter welchem Winkel der Strahl in der Luft weiterläuft. Wiederhole das mit 25 Grad und mit 40 Grad.", "Wähle „42° – Grenzwinkel“ und beobachte, wie der austretende Strahl jetzt liegt und wie hell er noch ist.", "Wähle „55° – Totalreflexion“ und prüfe, ob vorn noch Licht austritt oder ob alles an der geraden Fläche zurückläuft."]
  },
  "f4": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "totalreflexion", seite: 51,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wie funktioniert ein Lichtleiter?",
    titel: "Das Licht macht die Kurve",
    frage: "Warum läuft Licht in einem dünnen Faden um die Kurve, statt seitlich auszutreten?",
    auftrag: "Untersuche am Glasstab, ab welchem Winkel an der Wand kein Licht mehr austritt.",
    schritte: ["Stelle den Einfallswinkel an der Wand θ auf 30 Grad ein und beobachte, ob Licht durch die Wand nach außen tritt.", "Vergrößere θ über 40 Grad auf 42 Grad und halte fest, bei welchem Wert zum ersten Mal nichts mehr nach außen dringt.", "Stelle θ auf 60 Grad ein und verfolge, wie der Strahl im Inneren weiterläuft und wie oft er an den Wänden zurückgeworfen wird."]
  },
  "f5": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "prisma", seite: 54,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Welche Farben stecken im weißen Licht?",
    titel: "Der Streifen auf dem Bauplan",
    frage: "Welche Farben stecken im weißen Licht?",
    auftrag: "Vergleiche, wie stark das Prisma rotes und blaues Licht ablenkt.",
    schritte: ["Stelle „weißes Licht“ ein und beobachte, was hinter dem Prisma zu sehen ist. Notiere die Farben in ihrer Reihenfolge.", "Wähle „nur Rot“ und merke dir, wohin dieser Strahl läuft. Wähle danach „nur Blau“ und vergleiche, welcher der beiden Strahlen stärker abgelenkt wird.", "Gegenprobe am Tisch: Leuchte mit einer Taschenlampe durch ein Prisma aus der Schulsammlung und fange das Licht dahinter auf weißem Papier auf."]
  },
  "f6": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "regenbogen", seite: 57,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wie entstehen die Farben eines Regenbogens?",
    titel: "Der Bogen über dem Feld",
    frage: "Warum ist ein Regenbogen nur mit der Sonne im Rücken zu sehen?",
    auftrag: "Untersuche an einem einzelnen Tropfen, welchen Weg das Licht darin nimmt.",
    schritte: ["Wähle „ein Tropfen“ und verfolge den Weg des Lichts: Eintritt vorn, Rückwurf an der Rückseite, Austritt. Halte fest, auf welcher Seite das Licht den Tropfen verlässt.", "Bleibe bei „ein Tropfen“ und vergleiche, in welche Richtung Rot und Violett austreten. Notiere, welche Farbe den größeren Winkel zur einfallenden Richtung hat.", "Stelle „der ganze Bogen“ ein und beobachte, aus welchen Tropfen Rot und Violett ins Auge kommen. Achte darauf, wo der Bogen zur Sonne liegt."]
  },
  "g1": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "himmelskoerper", seite: 68,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Sonne, Mond und Sterne – was leuchtet am Himmel?",
    titel: "Einer funkelt, einer nicht",
    frage: "Welche Himmelskörper leuchten selbst, welche werden nur beleuchtet?",
    auftrag: "Prüfe in der Simulation, was noch zu sehen ist, wenn du das Sonnenlicht abdeckst.",
    schritte: ["Wähle nacheinander Sonne, Stern, Mond und Planet. Halte fest, welcher Punkt ruhig und rund steht und welcher zittert.", "Wähle bei jedem der vier Sonnenlicht abdecken und lies ab, ob er weiter leuchtet oder verschwindet.", "Gegenprobe am Tisch: Richte im dunklen Raum eine Taschenlampe auf eine Styroporkugel und decke die Lampe dann ab."]
  },
  "g2": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "tag-nacht", seite: 71,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wie entstehen Tag und Nacht?",
    titel: "Dieselbe Minute, vier Uhrzeiten",
    frage: "Warum ist es in Japan Nacht, während bei uns die Sonne scheint?",
    auftrag: "Untersuche mit dem Regler Drehung, wie Licht und Schatten über die Erdkugel wandern.",
    schritte: ["Halte mit Pause an und stelle Drehung auf 0°. Notiere, wie groß der helle Teil ist und ob Deutschland und Japan hell oder dunkel sind.", "Drehe auf 90°, 180° und 270° weiter und lies jedes Mal beide Orte ab. Achte darauf, ob der helle Teil je größer wird.", "Gegenprobe am Tisch: Richte eine Taschenlampe waagerecht auf einen Globus und drehe ihn langsam."]
  },
  "g3": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "gravitation", seite: 74,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Die Gravitation – warum fällt alles nach unten?",
    titel: "Wer ist zuerst unten?",
    frage: "Fällt ein schwerer Körper schneller als ein leichter?",
    auftrag: "Vergleiche in der Simulation den Fall auf Mond, Erde und Jupiter.",
    schritte: ["Wähle in der Simulation Erde und starte den Fall mit Noch einmal fallen lassen. Achte genau darauf, ob der schwere Körper vor dem leichten ankommt oder beide gleichzeitig.", "Wähle danach Mond und anschließend Jupiter und lass jedes Mal noch einmal fallen. Halte fest, wie lange der Fall jeweils dauert und ob sich die Reihenfolge dabei ändert.", "Gegenprobe am Tisch: Lass eine Münze und ein flaches Blatt Papier aus gleicher Höhe gleichzeitig los. Zerknülle dann dasselbe Blatt zu einer festen Kugel und wiederhole den Versuch."]
  },
  "g9": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "gravitation-abstand", seite: 77,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wovon hängt die Anziehung zweier Körper ab?",
    titel: "Erst nichts, dann ein Ruck",
    frage: "Wovon hängt die Anziehung zweier Körper ab – von den Massen, vom Abstand?",
    auftrag: "Untersuche in der Simulation, wie sich die Anziehung ändert, wenn du Masse und Abstand verdoppelst.",
    schritte: ["Setze mit zurücksetzen alle Werte auf 1 und lies die Anziehung ab. Dieser Wert ist dein Ausgangswert, mit dem du alles Weitere vergleichst.", "Verdopple mit ×2 Masse links die Masse der linken Kugel und lies ab. Drücke denselben Knopf noch einmal, sodass die Masse viermal so groß ist wie am Anfang, und lies wieder ab.", "Setze zurück und verdopple stattdessen mit ×2 Abstand den Abstand, danach ein zweites Mal. Vergleiche beide Werte mit deinem Ausgangswert."]
  },
  "g6": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "planetenbahn", seite: 80,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Warum fallen die Planeten nicht in die Sonne?",
    titel: "Warum stürzt er nicht?",
    frage: "Warum stürzt die Erde nicht in die Sonne, obwohl diese sie anzieht?",
    auftrag: "Untersuche, welche Startgeschwindigkeit quer zur Sonne die Bahn zu einem Kreis schließt.",
    schritte: ["Stelle die Startgeschwindigkeit quer zur Sonne auf 10 km/s ein und wähle „neu starten“. Schalte auf Zeitraffer ×4 und verfolge, ob der Planet an der Sonne vorbeikommt oder in sie hineinfällt.", "Schalte Vergleichsspur an und lass den Planeten nacheinander mit 20 km/s, 30 km/s und 45 km/s laufen, dazwischen jeweils neu starten. Die alten Spuren bleiben stehen, so liegen alle vier Bahnen übereinander.", "Gegenprobe am Tisch: Wirf auf dem Schulhof einen Ball erst sanft, dann so fest du kannst. Er fliegt jedes Mal weiter und landet doch wieder, und du siehst, was ihm gegenüber dem Planeten fehlt."]
  },
  "g7": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sonnensystem", seite: 83,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Acht Planeten, zwei Sorten",
    titel: "Die Kleinen und die Riesen",
    frage: "Worin unterscheiden sich die vier inneren Planeten von den vier äußeren?",
    auftrag: "Vergleiche in der Ansicht Größen und im Steckbrief beide Gruppen miteinander.",
    schritte: ["Wähle Größen. Die acht Planeten stehen dann im gleichen Maßstab nebeneinander. Suche den größten und den kleinsten heraus und merke dir, wo die Grenze zwischen den kleinen und den großen verläuft.", "Öffne den Steckbrief nacheinander für Merkur, Erde, Jupiter und Neptun. Lies jedes Mal den Durchmesser ab und ob der Planet eine feste Oberfläche hat, und trage beides in die Tabelle ein.", "Wähle Abstände und lass die Planeten mit Umlauf bei sehr schnell laufen. Achte darauf, dass die vier kleinen Planeten innen dicht beieinander kreisen und die vier großen weit außen."]
  },
  "g8": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "ortsfaktor", seite: 86,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wäre ich auf dem Mond wirklich leichter?",
    titel: "Hüpfen wie auf dem Mond",
    frage: "Wäre ich auf dem Mond wirklich leichter – oder nur mein Gewicht?",
    auftrag: "Vergleiche mit den Knöpfen Erde, Mond und Jupiter, welche der beiden Anzeigen sich ändert.",
    schritte: ["Stelle in der Simulation Erde ein und lies beide Anzeigen ab: die Masse in Kilogramm und die Gewichtskraft in Newton.", "Wähle nacheinander Mond und Jupiter und lies jedes Mal beide Werte ab. Trage sie in die Tabelle ein.", "Teile bei jedem Himmelskörper die Gewichtskraft durch die Masse und vergleiche die drei Ergebnisse. Wähle danach noch einmal Erde und prüfe, ob dieselben Werte wie am Anfang erscheinen."]
  },
  "g10": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "gezeiten", seite: 89,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Warum steigt und fällt das Meer zweimal am Tag?",
    titel: "Zweimal am Tag",
    frage: "Warum steigt und fällt das Meer zweimal am Tag?",
    auftrag: "Untersuche mit dem Regler Erde von Hand drehen, wie oft dein Ort durch einen Wasserberg läuft.",
    schritte: ["Suche die Stellen, an denen das Wasser am höchsten steht. Halte fest, wie viele es sind und wo sie liegen.", "Vergleiche die Anziehung auf das Wasser der Mondseite, auf den Erdmittelpunkt und auf das Wasser der Rückseite.", "Drehe mit Erde von Hand drehen einmal ganz herum und zähle, wie oft dein Ort durch hohes Wasser läuft."]
  },
  "g4": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "weltall-aufbau", seite: 92,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wie groß ist das Sonnensystem wirklich?",
    titel: "Der Fußball und die Stecknadel",
    frage: "Wie groß ist das Sonnensystem im Vergleich zur Milchstraße?",
    auftrag: "Untersuche in der Simulation, wie viele Zoomschritte bis zur Milchstraße und darüber hinaus nötig sind.",
    schritte: ["Setze mit Zurücksetzen auf den Anfang und zoome Schritt für Schritt heraus. Halte fest, was neu ins Bild kommt.", "Zoome weiter, bis die Sonne nur ein Punkt unter vielen ist, und zähle die Schritte. Suche beim Hineinzoomen ihre Stelle in der Scheibe.", "Gegenprobe am Tisch: Lege auf dem Schulhof einen Fußball als Sonne hin und schreite 24 Meter bis zur Stecknadel ab."]
  },
  "g5": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "entfernungen", seite: 95,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wie weit ist es im Weltall? (Lichtjahr)",
    titel: "Wie alt ist dieses Licht?",
    frage: "Ist ein Lichtjahr eine Zeit oder eine Strecke?",
    auftrag: "Vergleiche, wie lange ein Lichtblitz vom Mond, von der Sonne und vom nächsten Stern braucht.",
    schritte: ["Setze die Simulation mit Zurücksetzen auf den Anfang und sende einen Lichtblitz zum Mond. Lies ab, wie lange er unterwegs ist, und trage die Zeit in die Tabelle ein.", "Gehe mit weiter zum nächsten Ziel und sende dort erneut einen Lichtblitz. Notiere so die Laufzeit für die Sonne und für den nächsten Stern und achte darauf, ab welchem Ziel die Zeit nicht mehr in Minuten, sondern in Jahren angegeben wird.", "Gehe mit näher wieder zurück zum Mond und sende noch einmal einen Lichtblitz. Prüfe, ob dieselbe Strecke wieder dieselbe Laufzeit ergibt."]
  },
  "t1": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "teleskop", seite: 106,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Wie holt ein Teleskop ferne Objekte näher heran?",
    titel: "Zwei Gläser auf der Leiste",
    frage: "Warum zeigt ein Teleskop mehr Sterne als das bloße Auge?",
    auftrag: "Vergleiche dieselbe Himmelsstelle mit bloßem Auge, mit kleiner und mit großer Öffnung.",
    schritte: ["Stelle in der Simulation zuerst bloßes Auge ein und halte fest, wie viel du von dem Objekt erkennst. Wechsle dann auf mit Teleskop und beschreibe, was sich am Bild ändert.", "Bleibe bei mit Teleskop und wechsle zwischen kleine Öffnung und große Öffnung hin und her. Zähle jedes Mal, wie viele lichtschwache Punkte noch zu sehen sind, und achte darauf, ob das Bild dabei größer wird oder nur heller.", "Gegenprobe am Tisch: Fange mit einer Lupe das Bild eines fernen Fensters auf einem Blatt Papier auf und decke danach die halbe Linse mit Papier ab. Prüfe, ob das Bild kleiner oder nur dunkler wird."]
  },
  "t2": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "spezialteleskop", seite: 109,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Wie sieht man mit besonderen Teleskopen unsichtbares Licht?",
    titel: "Die Lampe, die keiner sieht",
    frage: "Was zeigt derselbe Himmelsausschnitt in Licht, das wir nicht sehen können?",
    auftrag: "Untersuche die vier Bereiche und prüfe, welche davon am Boden überhaupt ankommen.",
    schritte: ["Stelle in der Simulation am Boden ein und schalte nacheinander Licht, Infrarot, Radio und Röntgen durch. Halte für jeden Bereich fest, was von der Himmelsstelle zu sehen ist.", "Wechsle auf im Weltraum und gehe dieselben vier Bereiche noch einmal durch. Vergleiche jeden Bereich mit dem, was du am Boden notiert hast, und halte fest, wo der Unterschied am größten ist.", "Gegenprobe am Tisch: Halte eine Fernbedienung vor die Kamera eines Handys und drücke eine Taste. Prüfe, ob auf dem Display etwas leuchtet, das dein Auge nicht sieht."]
  },
  "t6": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sternleben", seite: 112,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Warum leuchtet ein Stern – und warum nicht ewig?",
    titel: "Wer zuerst ausgeht",
    frage: "Warum leuchtet ein schwerer Stern heller und trotzdem kürzer?",
    auftrag: "Untersuche in der Simulation, wie die Masse Farbe und Lebensdauer eines Sterns bestimmt.",
    schritte: ["Wähle zuerst beim Regler „Masse des Sterns“ den Wert „1“ und lass den Lauf ganz durchlaufen. Halte fest, welche Farbe der Stern hat und welche Lebensdauer am Ende steht.", "Stelle den Regler „Masse des Sterns“ nacheinander auf die anderen Werte, indem du „0,5“, „10“ und „25“ wählst. Nutze jedes Mal „Lauf neu starten“ und trage Farbe und Lebensdauer in die Tabelle ein.", "Vergleiche den leichtesten mit dem schwersten Stern. Der schwere hat fünfzigmal so viel Wasserstoff im Vorrat – prüfe, ob er deshalb auch länger leuchtet."]
  },
  "t7": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sternspektrum", seite: 115,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Woraus bestehen die Sterne?",
    titel: "Streifen, die fehlen",
    frage: "Woran erkennt man, woraus ein Stern besteht, ohne hinzufliegen?",
    auftrag: "Vergleiche das Farbband einer Glühlampe mit denen von drei Sternen und suche die fehlenden Streifen.",
    schritte: ["Wähle „Glühlampe“ und sieh dir das Farbband genau an. Halte fest, ob irgendwo eine Farbe fehlt.", "Wechsle zu „Stern 1 gelb“ und schiebe den Regler „Lupe – Wellenlänge“ langsam durch das Farbband, bis du auf einer dunklen Linie stehst. Lies die Wellenlänge in Nanometern ab; mit „Suchlauf“ findest du eine Linie, die du nicht triffst.", "Schalte „Vergleichsstreifen einblenden“ ein und prüfe bei „Stern 2 blau-weiß“ und „Stern 3 rot“, ob dort Linien an denselben Wellenlängen sitzen."]
  },
  "t8": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "milchstrasse", seite: 117,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Die Milchstraße – wo stehen wir?",
    titel: "Das Band über dem Feld",
    frage: "Warum sehen wir die Milchstraße als schmales Band und nicht rundherum?",
    auftrag: "Untersuche, welche Form die Scheibe hat und wie dicht die Sterne in verschiedenen Richtungen stehen.",
    schritte: ["Stelle den Regler „Ansicht drehen“ von von oben (0°) langsam bis zur Kantenansicht und halte fest, welche Form die Milchstraße von oben und welche sie von der Seite zeigt.", "Lass den Regler „Sonne vom Zentrum“ auf 26 000 Lichtjahre stehen und wähle nacheinander „zur Mitte“, „nach außen“ und „quer heraus“. Trage für jede Richtung ein, wie dicht die Sterne im Blickfeld stehen.", "Wähle „Gegenprobe: Sonne in die Mitte“ und sieh dir dieselben drei Richtungen noch einmal an. Geh danach mit „zurück auf 26 000 Lj“ auf die Ausgangslage."]
  },
  "t3": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "weltbild", seite: 120,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Wie hat sich die Vorstellung vom Weltall verändert?",
    titel: "Wer steht in der Mitte?",
    frage: "Welches Weltbild erklärt die Schleifen der Planeten mit weniger Zusatzannahmen?",
    auftrag: "Vergleiche an der Simulation den Lauf eines Planeten in beiden Weltbildern.",
    schritte: ["Wähle „Erde in der Mitte (alt)“ und lass die Bahnen einmal ganz durchlaufen. Halte fest, welchen Weg ein Planet nimmt und was nötig ist, damit dabei eine Schleife entsteht.", "Wähle „Sonne in der Mitte (heute)“ und lass dieselbe Zeit noch einmal laufen. Achte darauf, welche Form die einzelnen Bahnen jetzt haben und wann der äußere Planet von der Erde aus rückwärts zu laufen scheint. Mit „Zurücksetzen“ kannst du beide Weltbilder mehrfach nacheinander vergleichen.", "Gegenprobe am Tisch: Legt eine Münze als Sonne auf ein Blatt Papier, geht mit zwei Fingern auf einem inneren und einem äußeren Kreis darum herum und schaut vom inneren Finger aus, wie der äußere sich beim Überholen kurz rückwärts vor der Wand zu bewegen scheint."]
  },
  "t4": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "schwarzes-loch", seite: 123,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Was passiert bei einem schwarzen Loch?",
    titel: "Ein Ring um nichts",
    frage: "Was geschieht mit einem Lichtstrahl, der dicht an einem schwarzen Loch vorbeiläuft?",
    auftrag: "Untersuche in der Simulation die Ablenkung bei verschiedenen Abständen.",
    schritte: ["Wähle in der Simulation den Abstand „weit weg“ und nutze „Lichtstrahl senden“. Verfolge den Weg des Strahls und halte fest, ob er die gerade Richtung behält.", "Setze mit „Zurücksetzen“ zurück und wiederhole den Versuch mit „mittel“ und danach mit „sehr nah“. Vergleiche die drei Bahnen miteinander und achte darauf, bei welchem Abstand der Strahl nicht mehr herauskommt.", "Gegenprobe am Tisch: Spanne ein T-Shirt über einen Reifen und lege eine schwere Kugel in die Mitte. Rolle eine Murmel einmal weit außen und einmal dicht an der Kugel vorbei."]
  },
  "t5": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "urknall", seite: 126,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Wie ist das Weltall entstanden? (Urknall)",
    titel: "Punkte auf dem Ballon",
    frage: "Entfernen sich alle Galaxien gleich schnell voneinander?",
    auftrag: "Vergleiche in der Simulation nahe und weit entfernte Galaxien miteinander.",
    schritte: ["Suche dir vor dem Start eine nahe und eine weit entfernte Galaxie und merke dir ihre Lage. Lass danach mit „Urknall starten“ die Ausdehnung ablaufen und beobachte beide Galaxien gleichzeitig.", "Gehe mit „zum Anfang“ zurück und lass den Vorgang noch einmal laufen. Wähle diesmal eine andere Galaxie als Ausgangspunkt und prüfe, ob sich von ihr aus alle übrigen ebenfalls entfernen.", "Gegenprobe am Tisch: Male Punkte auf einen schlaffen Luftballon, miss zwei nahe und zwei weit entfernte Punktepaare und blase den Ballon weiter auf. Miss dieselben Abstände erneut."]
  },
  "sp1": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "ladung", seite: 5,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Was ist elektrische Ladung?",
    titel: "Der Staub am Kabel",
    frage: "Warum ziehen sich manche Dinge an und andere stoßen sich ab?",
    auftrag: "Untersuche, wie sich zwei Kugeln bei gleicher und bei ungleicher Ladung verhalten.",
    schritte: ["Gib beiden Kugeln „positiv“ und beobachte, was zwischen ihnen geschieht.", "Stelle die zweite Kugel auf „negativ“ um und halte fest, wie sich das Verhalten ändert.", "Gib zuletzt beiden Kugeln „negativ“ und vergleiche das Ergebnis mit Schritt 1."]
  },
  "sp2": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "stromstaerke", seite: 7,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Was ist der elektrische Strom (Stromstärke)?",
    titel: "Wie viel fließt da eigentlich?",
    frage: "Was gibt die Stromstärke an?",
    auftrag: "Miss die Stromstärke bei schwachem, mittlerem und starkem Strom.",
    schritte: ["Wähle „Strom schwach“ und lies die Stromstärke am Amperemeter ab. Achte dabei auch auf die Lampe.", "Wähle nacheinander „mittel“ und „stark“ und trage beide Werte ein.", "Drücke auf „Schalter: geschlossen“, sodass der Kreis offen ist, und lies noch einmal ab."]
  },
  "sp3": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "spannung", seite: 9,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Was ist die elektrische Spannung?",
    titel: "Was die Zahl mit dem V bedeutet",
    frage: "Was bewirkt eine größere Spannung im Stromkreis?",
    auftrag: "Vergleiche den Stromkreis mit einer, zwei und drei Zellen.",
    schritte: ["Wähle „1 Zelle“ und lies die Spannung ab. Achte darauf, wie hell die Lampe brennt.", "Wähle „2 Zellen“ und danach „3 Zellen“ und trage jedes Mal die Spannung ein.", "Ordne die drei Helligkeiten den drei Spannungen zu."]
  },
  "sp4": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "messen", seite: 11,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Wie misst man Stromstärke und Spannung?",
    titel: "Ein Messgerät, zwei Anschlüsse",
    frage: "Wie schließt man Amperemeter und Voltmeter richtig an?",
    auftrag: "Prüfe alle vier Kombinationen aus Gerät und Anschluss.",
    schritte: ["Wähle „Amperemeter“ und „in Reihe“. Lies ab, was die Simulation meldet und welcher Wert angezeigt wird.", "Lass das Amperemeter stehen und stelle auf „parallel“ um. Halte fest, was gemeldet wird.", "Wiederhole beide Schritte mit dem Voltmeter."]
  },
  "sp5": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "stromabhaengigkeit", seite: 13,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Wovon hängt die Stromstärke ab?",
    titel: "Zwei Stellschrauben",
    frage: "Wovon hängt es ab, wie viel Strom durch einen Kreis fließt?",
    auftrag: "Untersuche Spannung und Widerstand einzeln, immer nur eine Größe auf einmal.",
    schritte: ["Stelle den Widerstand auf „mittel“ und wähle nacheinander 1,5 V, 3 V und 4,5 V. Lies jedes Mal die Stromstärke ab.", "Lass die Spannung auf 4,5 V stehen und wähle nacheinander „klein“, „mittel“ und „groß“.", "Vergleiche beide Reihen miteinander: Welche Änderung bringt mehr, welche weniger Strom?"]
  },
  "wd1": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "widerstand", seite: 23,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Was ist ein elektrischer Widerstand?",
    titel: "Warum das Kabel warm wird",
    frage: "Warum fließt durch das eine Bauteil mehr Strom als durch das andere?",
    auftrag: "Vergleiche die Stromstärke bei drei Bauteilen mit gleichem Antrieb.",
    schritte: ["Wähle „kleiner Widerstand“ (dicker Kupferdraht) und lies R und die Stromstärke ab; die Spannung bleibt bei 4,5 V.", "Wähle „mittel“ (Glühdraht) und danach „großer Widerstand“ (Widerstandsdraht) und trage beide Wertepaare ein.", "Ordne die drei Stromstärken den drei Widerständen zu."]
  },
  "wd2": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "ohm-kennlinie", seite: 25,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Das Ohmsche Gesetz – die U-I-Kennlinie",
    titel: "Eine Gerade durch den Nullpunkt",
    frage: "Wie hängen Spannung und Stromstärke bei festem Widerstand zusammen?",
    auftrag: "Miss bei 10 Ω fünf Wertepaare und trage sie als Kennlinie ein.",
    schritte: ["Wähle 10 Ω. Stelle nacheinander 0 V, 1,5 V, 3 V, 4,5 V und 6 V ein und drücke jedes Mal „Messpunkt“.", "Lies zu jedem Punkt die Stromstärke ab und prüfe, ob U/I jedes Mal denselben Wert ergibt.", "Lösche die Punkte, wähle 20 Ω und nimm dieselbe Reihe noch einmal auf. Vergleiche beide Geraden."]
  },
  "wd3": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "draht", seite: 27,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Wovon hängt der Widerstand eines Drahtes ab?",
    titel: "Lang, dünn, oder woraus?",
    frage: "Wovon hängt der Widerstand eines Drahtes ab?",
    auftrag: "Untersuche Länge, Dicke und Material nacheinander, jeweils einzeln.",
    schritte: ["Stelle Material „Kupfer“, Länge „kurz“ und Dicke „dick“ ein und lies R und I ab. Das ist dein Ausgangswert.", "Wechsle nur auf „lang“ und lies wieder ab. Setze zurück und wechsle stattdessen nur auf „dünn“.", "Setze zurück und wechsle nur das Material, erst auf Eisen, dann auf Konstantan."]
  },
  "wd4": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "reihe-widerstand", seite: 29,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Reihenschaltung von Widerständen",
    titel: "Hintereinander wird es weniger",
    frage: "Was geschieht, wenn zwei Widerstände hintereinander liegen?",
    auftrag: "Bestimme Gesamtwiderstand, Stromstärke und beide Teilspannungen.",
    schritte: ["Stelle R₁ = 10 Ω und R₂ = 20 Ω ein. Lies Gesamtwiderstand, Stromstärke und beide Teilspannungen ab.", "Stelle beide auf 10 Ω und danach beide auf 30 Ω. Trage jedes Mal Gesamtwiderstand und Strom ein.", "Prüfe bei jeder Einstellung, ob die beiden Teilspannungen zusammen 6 V ergeben."]
  },
  "wd5": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "parallel-widerstand", seite: 31,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Parallelschaltung von Widerständen",
    titel: "Nebeneinander wird es mehr",
    frage: "Warum fließt bei zwei parallelen Widerständen mehr Strom?",
    auftrag: "Miss beide Teilströme und den Gesamtstrom und vergleiche sie.",
    schritte: ["Stelle R₁ = 10 Ω und R₂ = 20 Ω ein. Lies beide Teilströme, den Gesamtstrom und den Gesamtwiderstand ab.", "Stelle beide auf 10 Ω und danach beide auf 30 Ω und trage jedes Mal denselben Satz Werte ein.", "Vergleiche den Gesamtwiderstand mit dem kleineren der beiden Einzelwiderstände."]
  },
  "wd6": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "potentiometer", seite: 33,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Das Potentiometer – ein veränderbarer Widerstand",
    titel: "Der Regler am Motor",
    frage: "Wie lässt sich die Stromstärke stufenlos verändern?",
    auftrag: "Untersuche, wie Reglerstellung, Widerstand und Stromstärke zusammenhängen.",
    schritte: ["Drücke „weniger Widerstand“, bis der Regler ganz links steht. Lies R, I und die Helligkeit ab.", "Drücke „mehr Widerstand“ bis zum rechten Anschlag und lies dieselben drei Angaben ab.", "Setze zurück, sodass der Regler in der Mitte steht, und trage die Werte dazwischen ein."]
  },
  "lt1": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "elektrische-leistung", seite: 43,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Elektrische Leistung P = U · I",
    titel: "Wie schnell die Energie verbraucht wird",
    frage: "Was sagt die Leistung eines Gerätes aus?",
    auftrag: "Bestimme die Leistung bei verschiedenen Spannungen und Verbrauchern.",
    schritte: ["Stelle „3 V“ und „mittel“ ein und lies Spannung, Stromstärke und Leistung ab.", "Wechsle nur auf „6 V“ und lies wieder ab. Vergleiche die Leistung mit dem ersten Wert.", "Stelle bei 6 V nacheinander „viel Strom“ und „wenig Strom“ ein und trage beide Leistungen ein."]
  },
  "lt2": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "elektrische-energie", seite: 45,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Elektrische Energie E = P · t",
    titel: "Watt mal Stunden",
    frage: "Wie hängen Leistung, Zeit und Energie zusammen?",
    auftrag: "Bestimme die Energie für drei Geräte bei drei Betriebszeiten.",
    schritte: ["Wähle „LED 10 W“ und „1 h“ und lies die Energie in Wattstunden und in Kilowattstunden ab.", "Lass das Gerät stehen und wechsle auf „3 h“ und danach „10 h“. Trage beide Werte ein.", "Wähle „Wasserkocher 2000 W“ und „1 h“ und vergleiche mit der LED bei 10 h."]
  },
  "lt3": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "stromkosten", seite: 47,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Was kostet elektrische Energie? (kWh)",
    titel: "Was eine Kilowattstunde kostet",
    frage: "Was kostet der Betrieb eines Gerätes im Jahr?",
    auftrag: "Bestimme die Tages- und Jahreskosten für drei Geräte.",
    schritte: ["Wähle „TV 100 W“ und „3 h“ und lies Energie je Tag, Kosten je Tag und Kosten im Jahr ab.", "Wähle „Wasserkocher 2000 W“ und „1 h“ und trage dieselben drei Werte ein.", "Wähle „Kühlschrank 150 W“ und „24 h“ und vergleiche die Jahreskosten mit den beiden anderen."]
  },
  "lt4": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "energiesparen", seite: 49,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Energie sparen im Haushalt",
    titel: "Wo sich das Sparen lohnt",
    frage: "Welche Maßnahme spart im Jahr am meisten?",
    auftrag: "Vergleiche drei Maßnahmen nach ihrer Ersparnis im Jahr.",
    schritte: ["Wähle „Glühlampe→LED“ und lies ab, wie viele Kilowattstunden vorher und nachher im Jahr anfallen.", "Wähle „Standby aus“ und danach „Kühlschrank“ und trage jedes Mal die Ersparnis in kWh und in Euro ein.", "Ordne die drei Maßnahmen nach ihrer Ersparnis."]
  },
  "lt5": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "stromgefahren", seite: 51,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Gefahren des elektrischen Stroms & Schutz",
    titel: "Wenn die Sicherung kommt",
    frage: "Warum schaltet eine Sicherung den Stromkreis ab?",
    auftrag: "Prüfe, bei wie vielen Geräten die Sicherung auslöst.",
    schritte: ["Schließe ein Gerät an und lies ab, wie viel Strom fließt und wo die Grenze der Sicherung liegt.", "Schließe ein zweites Gerät an und lies wieder ab.", "Schließe ein drittes an und halte fest, was die Simulation meldet."]
  },
  "bg1": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-begriff", seite: 61,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Was bedeutet Geschwindigkeit?",
    titel: "Wer ist schneller?",
    frage: "Wann ist ein Körper schneller als ein anderer?",
    auftrag: "Vergleiche zwei Autos, die dieselbe Zeit lang fahren.",
    schritte: ["Stelle Auto A auf „langsam“ und Auto B auf „schnell“ und drücke „Rennen starten“. Beobachte, wie weit jedes Auto kommt.", "Stelle beide auf „mittel“ und starte noch einmal. Halte fest, was sich ändert.", "Stelle A auf „schnell“ und B auf „mittel“ und lies ab, was die Simulation meldet."]
  },
  "bg2": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-messen", seite: 63,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie misst man eine Geschwindigkeit?",
    titel: "Zehn Meter und eine Stoppuhr",
    frage: "Wie bestimmt man eine Geschwindigkeit aus Strecke und Zeit?",
    auftrag: "Miss die Fahrzeit bei drei Tempostufen auf derselben Strecke.",
    schritte: ["Wähle „langsam“ und drücke „Messung starten“. Lies Strecke, Zeit und Geschwindigkeit ab.", "Wiederhole die Messung mit „mittel“ und mit „schnell“ und trage beide Ergebnisse ein.", "Prüfe bei jeder Messung, ob Strecke geteilt durch Zeit den angezeigten Wert ergibt."]
  },
  "bg3": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-formel", seite: 65,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie berechnet man eine Geschwindigkeit? (v = s/t)",
    titel: "Strecke geteilt durch Zeit",
    frage: "Wann führen verschiedene Messungen zur selben Geschwindigkeit?",
    auftrag: "Bestimme v für verschiedene Kombinationen aus Strecke und Zeit.",
    schritte: ["Stelle s = 100 m und t = 10 s ein. Lies die Geschwindigkeit in m/s und in km/h ab.", "Stelle s = 50 m und t = 5 s ein, danach s = 200 m und t = 20 s. Vergleiche mit dem ersten Wert.", "Halte t = 10 s fest und wechsle die Strecke zwischen 50 m, 100 m und 200 m."]
  },
  "bg4": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-umrechnung", seite: 67,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie werden m/s und km/h umgerechnet?",
    titel: "Mal 3,6 und zurück",
    frage: "Wie rechnet man zwischen m/s und km/h um?",
    auftrag: "Prüfe an vier Beispielen, welcher Faktor die beiden Einheiten verbindet.",
    schritte: ["Stelle mit „schneller“ und „langsamer“ den Wert 10 m/s ein und lies die Umrechnung in km/h ab.", "Wähle nacheinander die Beispiele Fußgänger, Radfahrer, Auto und ICE und trage beide Werte ein.", "Prüfe bei jedem Beispiel nach, ob der Wert in km/h das 3,6-Fache des Wertes in m/s ist."]
  },
  "bg5": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "gleichfoermig-rs", seite: 69,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Was ist eine gleichförmige Bewegung?",
    titel: "Immer gleich weit",
    frage: "Woran erkennt man eine gleichförmige Bewegung?",
    auftrag: "Untersuche die Abstände der Sekundenmarken bei drei Tempostufen.",
    schritte: ["Wähle „langsam“ und starte die Fahrt. Beobachte, wie die Sekundenmarken gesetzt werden.", "Wiederhole das mit „mittel“ und mit „schnell“ und vergleiche die Abstände miteinander.", "Halte fest, ob sich die Abstände innerhalb einer Fahrt ändern."]
  },
  "bg6": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "beschleunigung-rs", seite: 71,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Was ist eine beschleunigte Bewegung?",
    titel: "Immer weiter, immer enger",
    frage: "Woran erkennt man eine beschleunigte Bewegung?",
    auftrag: "Vergleiche die Markenabstände beim Beschleunigen und beim Bremsen.",
    schritte: ["Wähle „Beschleunigen“ und starte. Beobachte, wie sich die Abstände der Sekundenmarken entwickeln.", "Wähle „Bremsen“ und starte erneut. Halte fest, wie sich die Abstände jetzt verhalten.", "Vergleiche beide Fahrten mit der gleichförmigen Bewegung von der vorigen Seite."]
  },
  "bg7": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "weg-zeit-diagramm", seite: 73,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie stellt man eine Bewegung im Weg-Zeit-Diagramm dar?",
    titel: "Die Linie, die steigt",
    frage: "Was verrät die Steigung im Weg-Zeit-Diagramm?",
    auftrag: "Vergleiche drei Fahrten im Weg-Zeit-Diagramm miteinander.",
    schritte: ["Wähle „langsam“ und drücke „Fahren“. Beobachte, wie steil die Linie ansteigt.", "Wähle „schnell“ und starte erneut. Vergleiche die Steigung mit der ersten Fahrt.", "Wähle „mit Pause“ und halte fest, was die Linie während des Stillstands macht."]
  },
  "bg8": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-zeit-diagramm", seite: 75,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie liest man ein Geschwindigkeit-Zeit-Diagramm?",
    titel: "Die Linie, die waagerecht bleibt",
    frage: "Was zeigt das Geschwindigkeit-Zeit-Diagramm an?",
    auftrag: "Untersuche drei Fahrten im Geschwindigkeit-Zeit-Diagramm.",
    schritte: ["Wähle „konstant“ und drücke „Fahren“. Halte fest, wie die Linie verläuft.", "Wähle „beschleunigen“ und danach „bremsen“ und beschreibe jedes Mal den Verlauf.", "Vergleiche die drei Linien mit dem, was du im Weg-Zeit-Diagramm gesehen hast."]
  },
  "bg9": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "verkehr-messung", seite: 77,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie funktioniert eine Geschwindigkeitsmessung im Straßenverkehr?",
    titel: "Der Blitzer an der Straße",
    frage: "Wann löst eine Geschwindigkeitsmessung aus?",
    auftrag: "Prüfe verschiedene Tempi gegen verschiedene erlaubte Höchstwerte.",
    schritte: ["Stelle das Auto auf 70 km/h und die erlaubte Geschwindigkeit auf 50 km/h. Lass es vorbeifahren und lies ab, was gemeldet wird.", "Lass das Auto bei 70 km/h stehen und stelle die erlaubte Geschwindigkeit auf 70 km/h. Fahre erneut vorbei.", "Prüfe zuletzt 30 km/h bei erlaubten 50 km/h und 100 km/h bei erlaubten 30 km/h."]
  },
  "kr1": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraft-wirkung", seite: 5,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Woran erkennt man, dass eine Kraft wirkt?",
    titel: "Die Delle im Karton",
    frage: "Woran erkennt man, dass eine Kraft gewirkt hat?",
    auftrag: "Untersuche die drei Situationen der Simulation und halte fest, was sich jeweils verändert hat.",
    schritte: ["Wähle in der Simulation „Verformen“ und drücke „Kraft wirken lassen“. Halte in der Tabelle fest, was sich an der weichen Knete ändert.", "Wähle nacheinander „Bewegen“ und „Richtung ändern“ und lasse jedes Mal die Kraft wirken. Nutze „Zurücksetzen“, bevor du die nächste Situation startest.", "Gegenprobe am Tisch: Drücke ein Stück Knete flach und schiebe danach dein Mäppchen über den Tisch. Notiere für beides, was vorher und nachher anders ist."]
  },
  "kr2": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraft-wirkungen", seite: 8,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Was kann eine Kraft alles bewirken?",
    titel: "Mias Liste auf der Treppe",
    frage: "Was kann eine Kraft alles bewirken?",
    auftrag: "Vergleiche die sechs Alltagssituationen und prüfe, welche Wirkung jeweils im Vordergrund steht.",
    schritte: ["Wähle in der Simulation „Schwamm ausdrücken“ und ordne die Situation der Gruppe „Verformen“, „Bewegen“ oder „Richtung“ zu. Mit „Zurücksetzen“ beginnst du die Sortierung neu.", "Sortiere danach „Einkaufswagen anschieben“, „Tennisball zurückschlagen“, „Getränkedose eindrücken“, „Fahrrad abbremsen“ und „Ball prallt an der Wand ab“. Trage die Gruppen in die Tabelle ein.", "Gegenprobe am Tisch: Drücke einen Schwamm zusammen, schiebe ihn über den Tisch und stoppe ihn mit der Hand. Benenne für jeden der drei Fälle die Wirkung."]
  },
  "kr3": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraftmesser", seite: 11,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Wie misst man eine Kraft?",
    titel: "Der Strich, an dem der Zeiger stehen bleibt",
    frage: "Wie lässt sich eine Kraft messen?",
    auftrag: "Untersuche, wie sich die Dehnung der Feder ändert, wenn du gleiche Gewichte nacheinander anhängst.",
    schritte: ["Wähle „Feder leeren“ und lies ab, welche Kraft der Zeiger ohne Last anzeigt. Trage Kraft und Dehnung in die erste Zeile der Tabelle ein.", "Hänge mit „Gewicht anhängen (1 N)“ ein Gewicht nach dem anderen an. Lies nach jedem Schritt die Kraft am Zeiger und die Dehnung der Feder ab und trage beide Werte ein.", "Nimm die Gewichte mit „Gewicht abnehmen“ einzeln wieder ab und prüfe, ob die Feder bei jeder Stufe dieselbe Dehnung zeigt wie beim Anhängen."]
  },
  "kr4": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "federgesetz", seite: 14,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Warum wird eine Feder gleichmäßig länger? (Hooke)",
    titel: "Zwei Federn, die nicht gleich nachgeben",
    frage: "Dehnen sich eine weiche und eine harte Feder bei derselben Kraft gleich weit?",
    auftrag: "Vergleiche beide Federn, wenn dieselbe Kraft an ihnen zieht.",
    schritte: ["Wähle „weiche Feder“ und stelle mit „weniger“ und „mehr“ nacheinander F = 0 N, F = 1 N und F = 2 N ein. Sichere jede Stufe mit „Messpunkt“ und lies s sowie D = F/s ab.", "Wähle „harte Feder“ und stelle wieder F = 1 N ein. Vergleiche Dehnung, D-Wert und die Steilheit der Geraden mit denen der weichen Feder und trage beides in die Tabelle ein.", "Gegenprobe am Tisch: Hänge an eine Schraubenfeder ein Gewichtsstück, dann zwei, dann drei und miss jedes Mal die Länge der Feder mit dem Lineal."]
  },
  "kr5": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "masse-gewicht", seite: 17,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Ist „schwer“ dasselbe wie „viel Masse“?",
    titel: "Die Kiste und die zwei Waagen",
    frage: "Ist „schwer“ dasselbe wie „viel Masse“?",
    auftrag: "Untersuche, wie sich Waage und Kraftmesser ändern, wenn du die Masse vergrößerst.",
    schritte: ["Stelle in der Simulation nacheinander die Massen 100 g, 200 g und 500 g ein. Lies jedes Mal beide Anzeigen ab und trage Masse und Gewichtskraft in die Tabelle ein.", "Stelle danach 1 kg und 2 kg ein. Prüfe mit dem Taschenrechner, ob F = m · g mit g = 9,8 N/kg zu den angezeigten Werten passt.", "Gegenprobe am Tisch: Wiege dein Mäppchen auf der Küchenwaage und hänge es dann an die Federwaage. Vergleiche die beiden Anzeigen mit deiner Tabelle."]
  },
  "kr6": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "ortsfaktor", seite: 20,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Wäre ich auf dem Mond wirklich leichter?",
    titel: "Die schwerste Kiste und der Mond",
    frage: "Wäre ich auf dem Mond wirklich leichter?",
    auftrag: "Vergleiche Masse und Gewichtskraft desselben Körpers auf Mond, Erde und Jupiter.",
    schritte: ["Wähle in der Simulation nacheinander „Mond“, „Erde“ und „Jupiter“. Lies jedes Mal den Ortsfaktor g, die Masse und die Gewichtskraft ab und trage die Werte in die Tabelle ein.", "Rechne für jeden Ort selbst mit F = m · g und vergleiche dein Ergebnis mit der Anzeige. Achte darauf, welche der drei Zahlen sich nie ändert.", "Stelle zum Schluss wieder „Erde“ ein und bestimme, wie oft die Gewichtskraft auf dem Mond in die Gewichtskraft auf der Erde passt."]
  },
  "kr7": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraftpfeil", seite: 23,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Hat eine Kraft auch eine Richtung?",
    titel: "Dieselbe Zahl, zwei Wirkungen",
    frage: "Ist eine Kraft schon vollständig beschrieben, wenn man ihren Betrag kennt?",
    auftrag: "Untersuche, was zur Angabe in Newton noch hinzukommen muss.",
    schritte: ["Wähle die Richtung „→“ und stelle nacheinander die Beträge „2 N“, „4 N“ und „6 N“ ein. Achte darauf, wie sich die Länge des Pfeils dabei verändert.", "Bleibe bei 6 N und wähle „←“. Vergleiche Länge und Richtung des Pfeils mit dem Ergebnis bei „→“ und lies mit, wohin der Körper gezogen würde.", "Wähle nacheinander „↑“, „↓“ und „↗“ und beschreibe, wie sich der Pfeil dreht, während der eingestellte Betrag unverändert bleibt."]
  },
  "kr8": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraefte-addieren", seite: 26,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Was passiert, wenn zwei Kräfte gleichzeitig ziehen?",
    titel: "Zu zweit am Sofa",
    frage: "Was passiert, wenn zwei Kräfte gleichzeitig an einem Körper ziehen?",
    auftrag: "Vergleiche die Gesamtkraft bei gleicher und bei entgegengesetzter Richtung.",
    schritte: ["Stelle F1 = 2 N und F2 = 2 N ein, beide nach rechts, und lies die Gesamtkraft ab. Erhöhe dann F1 mit „+ N“ auf 4 N und notiere den neuen Wert.", "Drehe F2 mit „Richtung“ nach links und stelle F1 = 3 N und F2 = 2 N ein. Notiere Betrag und Richtung der Gesamtkraft. Drehe danach stattdessen F1 nach links.", "Gegenprobe am Tisch: Zieht zu zweit mit zwei Federwaagen am selben Haken eines Holzklotzes, erst beide in dieselbe Richtung, dann gegeneinander, und vergleicht die Anzeigen."]
  },
  "kr9": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraefte-gleichgewicht", seite: 29,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Warum bewegt sich ein ruhender Körper nicht?",
    titel: "Die Lampe über der Kellertreppe",
    frage: "Warum bewegt sich ein ruhender Körper nicht, obwohl Kräfte an ihm ziehen?",
    auftrag: "Untersuche, wie groß die Haltekraft des Kabels sein muss, damit die Lampe hängen bleibt.",
    schritte: ["Stelle mit „– N“ und „+ N“ die Haltekraft auf 4 N ein. Lies ab, wie groß die Gesamtkraft ist und in welche Richtung sie zeigt.", "Erhöhe die Haltekraft mit „+ N“ auf 5 N und danach auf 6 N. Trage für jede Einstellung ein, ob die Lampe hängen bleibt, sinkt oder steigt. Mit „zurück in die Mitte“ startest du neu.", "Gegenprobe am Tisch: Hänge ein Massestück an eine Federwaage und halte sie ruhig. Lies die Kraft ab, mit der die Federwaage nach oben zieht, und vergleiche sie mit der Gewichtskraft."]
  },
  "kr10": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "wechselwirkung", seite: 32,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Kraft und Gegenkraft: Warum drücke ich zurück?",
    titel: "Das Rollbrett unter Bens Füßen",
    frage: "Warum drückt mich das zurück, was ich selbst wegdrücke?",
    auftrag: "Vergleiche in den drei Situationen die beiden Kräfte und die Bewegung danach.",
    schritte: ["Wähle „Eisläufer“ und löse mit „Abstoßen“ den Stoß aus. Lies für beide Läufer Masse und Geschwindigkeit ab und trage die Werte ein.", "Wähle nacheinander „Boot“ und „Rakete“ und starte jeweils mit „Abstoßen“. Nutze davor „Zurücksetzen“ und notiere wieder beide Massen und Geschwindigkeiten.", "Gegenprobe am Tisch: Blase einen Luftballon auf und lass ihn los. Beobachte, in welche Richtung die Luft ausströmt und in welche Richtung der Ballon fliegt."]
  },
  "kr11": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "schiefe-ebene", seite: 35,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Warum geht ein Stein über eine Rampe leichter hoch?",
    titel: "Zwei Bretter über die Treppe",
    frage: "Warum geht ein Stein über eine Rampe leichter hoch als senkrecht?",
    auftrag: "Untersuche, wie sich Zugkraft und Weg ändern, wenn die Rampe steiler wird.",
    schritte: ["Wähle nacheinander „flach“, „mittel“ und „steil“. Lies jedes Mal die Zugkraft F ab und dazu, wie viel länger der Weg im Vergleich zur Höhe ist. Trage beides in die Tabelle ein.", "Vergleiche jede Zugkraft mit den 6 N, die zum senkrechten Heben nötig sind. Rechne für jede Rampe Zugkraft mal Weg-Faktor aus und vergleiche die drei Ergebnisse miteinander.", "Gegenprobe am Tisch: Ziehe ein Holzklötzchen mit der Federwaage einmal senkrecht 20 cm hoch und einmal über ein schräg gelegtes Brett auf dieselbe Höhe. Vergleiche beide Anzeigen."]
  },
  "kr12": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "reibung-rs", seite: 37,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Warum bremst mich der Boden aus? (Reibung)",
    titel: "Der Wagen bleibt zu früh stehen",
    frage: "Warum bleibt ein angestoßener Wagen von allein stehen?",
    auftrag: "Vergleiche, wie weit er nach demselben Anschub auf Eis, Holz und Teppich rollt.",
    schritte: ["Wähle „Eis“ und starte den Wagen mit „Anschieben“. Lies die Rollstrecke in cm ab. Wähle dann „Zurücksetzen“ und wiederhole das Ganze für „Holz“ und „Teppich“.", "Vergleiche die drei Strecken. Bestimme, um welchen Faktor die Strecke auf Eis länger ist als auf Teppich, und ordne die drei Böden nach der Größe ihrer Reibungskraft.", "Gegenprobe am Tisch: Schiebe ein Mäppchen mit gleichem Schwung einmal über die blanke Tischplatte und einmal über ein aufgelegtes Handtuch. Miss beide Strecken mit dem Lineal."]
  },
  "bw1": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "bewegung-beschreiben", seite: 48,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Wie beschreibt man eine Bewegung? (Weg & Zeit)",
    titel: "Mias Liste auf dem Beifahrersitz",
    frage: "Welche Angaben braucht man, um eine Bewegung genau zu beschreiben?",
    auftrag: "Untersuche, was jemand wissen muss, der die Fahrt später nachvollziehen will.",
    schritte: ["Tippe auf „Start“ und nimm während der Fahrt drei Momentaufnahmen auf. Trage jedes Wertepaar aus Zeit und Weg in die Tabelle ein.", "Setze mit „Zurücksetzen“ zurück und lies vor dem Start ab: t = 0,0 s und s = 0 m. Starte erneut und halte eine Momentaufnahme bei etwa t = 3,2 s fest; dort zeigt die Simulation s = 26 m.", "Gegenprobe am Tisch: Lass eine Mitschülerin gleichmäßig durch den Klassenraum gehen. Ruft alle zwei Sekunden „jetzt“ und markiert die Stelle mit einem Klebestreifen am Boden."]
  },
  "bw2": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "geschwindigkeit-rs", seite: 50,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Was bedeutet „schnell“? (v = s/t)",
    titel: "Der Lieferwagen, der vorn liegt",
    frage: "Woran erkennt man sicher, welches von zwei Fahrzeugen das schnellere ist?",
    auftrag: "Vergleiche beide Fahrzeuge, auch wenn eines von ihnen vorn liegt.",
    schritte: ["Starte mit „Rennen starten“ und beobachte, welcher Wagen zuerst am Ziel ist. Notiere dazu die eingestellten Tempos A = 10 m/s und B = 6 m/s.", "Lies während des Rennens ab, wie weit A und B nach 3 s und nach 6 s gekommen sind, und trage die Wege ein. Teile danach jeden Weg durch die zugehörige Zeit.", "Gegenprobe am Tisch: Messt im Flur 20 m ab. Einer geht die Strecke, einer stoppt die Zeit. Rechnet v = s : t aus und vergleicht euer Ergebnis mit 6 m/s."]
  },
  "bw3": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "gleichfoermige-bewegung", seite: 52,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Was ist eine gleichförmige Bewegung?",
    titel: "Die Leitpfosten im Takt",
    frage: "Legt ein Körper bei gleichem Tempo in gleichen Zeiten gleich weite Stücke zurück?",
    auftrag: "Prüfe das an drei verschiedenen Tempos der Simulation.",
    schritte: ["Wähle „mittel“ und starte mit „Start“. Halte mit „Stopp“ an, lies Zeit und Weg ab und prüfe, ob v · t den abgelesenen Weg ergibt.", "Setze mit „Zurücksetzen“ zurück und wiederhole das mit „langsam“ und mit „schnell“. Vergleiche die drei Tempowerte und die Abstände der Marken miteinander.", "Gegenprobe am Tisch: Zieht ein Spielzeugauto mit gleichmäßigem Zug an einer Schnur über den Tisch und setzt alle zwei Sekunden einen Kreidepunkt."]
  },
  "bw4": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "s-t-diagramm-deuten", seite: 54,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Wie lese ich aus einem Diagramm, was ein Körper gerade tut?",
    titel: "Mias Zettel im Handschuhfach",
    frage: "Was verrät die Steilheit einer Linie im Weg-Zeit-Diagramm?",
    auftrag: "Untersuche, was der Verlauf über die Bewegung des Körpers aussagt.",
    schritte: ["Stelle in der Simulation „steil“ ein und starte die Anzeige mit „Bewegung zeigen“. Lies die angegebene Steigung v = Δs/Δt ab und trage sie in die Tabelle ein.", "Setze mit „Zurücksetzen“ zurück und wiederhole das mit „flach“ und mit „waagerecht“. Vergleiche jedes Mal, wie weit der Körper in derselben Zeit kommt.", "Gegenprobe am Tisch: Lasst eine Person gleichmäßig durch den Raum gehen, stoppt die Zeit alle 2 m und tragt Weg über Zeit auf kariertes Papier auf."]
  },
  "bw5": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "beschleunigung-jg9", seite: 57,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Was passiert, wenn ein Körper immer schneller wird?",
    titel: "Zwischen zwei Leitpfosten",
    frage: "Woran erkennt man, dass ein Körper immer schneller wird?",
    auftrag: "Vergleiche Geschwindigkeit und Markenabstände mit einer gleichförmigen Bewegung.",
    schritte: ["Wähle „Gas geben (beschleunigt)“ und starte mit „Start“. Halte mit „Stopp“ an und trage Zeit, Geschwindigkeit und Weg in die Tabelle ein.", "Setze mit „Zurücksetzen“ zurück, wähle „gleichförmig“ und lies noch einmal ab. Vergleiche dabei, wie die Abstände der Marken in beiden Fällen liegen.", "Notiere für „Gas geben (beschleunigt)“ den angezeigten Wert von a und prüfe, ob a · t ungefähr deine abgelesene Geschwindigkeit ergibt."]
  },
  "bw6": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "beschleunigung-formel-jg9", seite: 60,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum wird ein Auto gleichmäßig schneller – und was heißt das in Zahlen?",
    titel: "Der Kleinwagen ist längst weg",
    frage: "Wie schnell ist ein Körper nach einer bestimmten Zeit?",
    auftrag: "Bestimme das aus seiner Beschleunigung und der vergangenen Zeit.",
    schritte: ["Wähle „2 m/s²“ und starte mit „Start“. Halte mit „Stopp“ an, lies Zeit und Geschwindigkeit ab und rechne sie mit v = a · t selbst nach.", "Setze mit „Zurücksetzen“ zurück und wiederhole den Versuch mit „1 m/s²“ und mit „3 m/s²“. Trage jedes Mal ein, wie viel Geschwindigkeit in einer Sekunde dazukommt.", "Gegenprobe am Tisch: Lasst einen Wagen eine schräge Schiene hinunterrollen und stoppt die Zeit für den ersten und für den zweiten Meter. Vergleicht die beiden Zeiten."]
  },
  "bw7": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "verzoegerung-jg9", seite: 63,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Was ist der Unterschied zwischen schneller werden und langsamer werden?",
    titel: "Das Schild mit der 30",
    frage: "Was unterscheidet Schnellerwerden von Langsamerwerden?",
    auftrag: "Vergleiche, wie sich die Geschwindigkeit beim Gasgeben und beim Bremsen ändert.",
    schritte: ["Wähle „Gas geben (+a)“ und drücke „Start“. Halte mit „Stopp“ an, lies Zeit und Geschwindigkeit ab und notiere den Wert von a.", "Drücke „Zurücksetzen“, wähle „Bremsen (−a)“ und lies den Startwert von v und das Vorzeichen von a ab.", "Rechne beide Fälle mit v = a · t nach und vergleiche Betrag und Vorzeichen von a."]
  },
  "bw8": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "bremsweg-jg9", seite: 65,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum braucht ein Auto zum Bremsen viel mehr Platz, als man denkt?",
    titel: "Das Reh am Straßenrand",
    frage: "Warum braucht ein Auto zum Bremsen viel mehr Platz, als man denkt?",
    auftrag: "Untersuche, wie sich Reaktions-, Brems- und Anhalteweg bei doppeltem Tempo ändern.",
    schritte: ["Wähle „50 km/h“ und lies Reaktionsweg, Bremsweg und Anhalteweg ab. Trage die drei Werte in die Tabelle ein.", "Wähle „100 km/h“, also das doppelte Tempo, und vergleiche die drei Werte mit denen von vorher.", "Drücke „Gefahr! (Start)“ und beobachte, an welcher Stelle die Reaktionsphase endet und die Bremsphase beginnt."]
  },
  "bw9": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "freier-fall-jg9", seite: 67,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum fällt ein schwerer Stein nicht schneller als ein leichter?",
    titel: "Ein Klacken auf der Raststätte",
    frage: "Fällt ein schwerer Stein schneller als ein leichter?",
    auftrag: "Prüfe, ob die Masse Fallzeit und Aufschlaggeschwindigkeit verändert.",
    schritte: ["Wähle „5 kg“ und drücke „Loslassen“. Lies ab, nach welcher Zeit die Kugeln unten sind, wie weit sie gefallen sind und wie schnell sie dann sind.", "Drücke „Zurücksetzen“, wähle nacheinander „1 kg“ und „10 kg“ und vergleiche die Fallzeiten mit deinem ersten Wert.", "Gegenprobe am Tisch: Lass ein Schlüsselbund und einen Radiergummi aus gleicher Höhe gleichzeitig los und höre auf den Aufschlag."]
  },
  "bw10": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "luftwiderstand-jg9", seite: 70,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum fällt eine Feder langsamer als ein Stein – liegt es wirklich am Gewicht?",
    titel: "Der Bon, der trudelt",
    frage: "Fällt eine Feder auch ohne Luft langsamer als ein Stein?",
    auftrag: "Untersuche beide Körper mit Luft und ohne Luft in der Simulation.",
    schritte: ["Wähle „mit Luft“ und drücke „Loslassen“. Lies ab, nach welcher Zeit der Stein unten ist und nach welcher die Feder, und trage beide Zeiten ein.", "Drücke „Zurücksetzen“, wähle „Vakuum (keine Luft)“ und lasse noch einmal los. Vergleiche die beiden Fallzeiten mit denen aus Schritt 1.", "Gegenprobe am Tisch: Lasse ein Blatt Papier und ein Buch gleichzeitig los. Lege das Blatt danach flach oben auf das Buch und wiederhole den Versuch."]
  },
  "bw11": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "traegheit-rs", seite: 73,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum bewegt sich nichts von allein schneller – wer oder was steckt dahinter?",
    titel: "Bis an die Wand",
    frage: "Warum wird ein angestoßener Körper von allein wieder langsamer?",
    auftrag: "Vergleiche, wie lange und wie weit der Wagen auf Tisch, Eis und im Weltall rollt.",
    schritte: ["Wähle „Tisch“ und drücke „Anstoßen“. Lies ab, nach welcher Zeit der Wagen still steht und wie weit er gekommen ist, und trage beides ein.", "Drücke „Zurücksetzen“ und wiederhole den Anstoß mit „Eis“ und danach mit „Weltall“. Halte fest, was die Simulation für den Weltall-Fall anzeigt.", "Vergleiche die drei Zeilen: Der Anstoß war jedes Mal gleich stark. Notiere, was verändert wurde und was daraus für einen Wagen ganz ohne Reibung folgt."]
  },
  "bw12": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "traegheit-alltag", seite: 75,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum werde ich beim Anfahren in den Sitz gedrückt und beim Bremsen nach vorn geworfen?",
    titel: "Mia hält sich nicht fest",
    frage: "Warum drückt es mich beim Anfahren in den Sitz und beim Bremsen nach vorn?",
    auftrag: "Bestimme, in welchen Fahrzuständen etwas zu spüren ist und wie groß dort a ist.",
    schritte: ["Wähle nacheinander „steht“ und „gleichmäßig fahren“. Lies jeweils a und v ab und notiere, ob dein Körper dabei etwas spürt.", "Wähle „Anfahren“ und danach „Bremsen“. Lies beide Werte für a ab, achte auf das Vorzeichen und darauf, wohin dein Körper gedrückt wird.", "Gegenprobe am Tisch: Lege einen Radiergummi auf ein Buch und ziehe das Buch ruckartig nach vorn. Beobachte, wohin der Radiergummi kippt."]
  },
  "bw13": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "schwerelosigkeit", seite: 78,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum fühlt man sich im freien Fall schwerelos, obwohl die Erde weiter zieht?",
    titel: "Die Kiste, die kurz nichts wiegt",
    frage: "Warum fühlt man sich im freien Fall schwerelos, obwohl die Erde weiter zieht?",
    auftrag: "Untersuche die Anzeige der Waage im beschleunigten und im frei fallenden Aufzug.",
    schritte: ["Wähle „steht still“ und lies ab, was die Waage anzeigt und welche Masse darunter steht.", "Wähle nacheinander „beschleunigt nach oben“, „beschleunigt nach unten“ und „Seil reißt: freier Fall“ und trage jede Anzeige in die Tabelle ein.", "Gegenprobe am Tisch: Stelle dich auf eine Personenwaage, gehe langsam in die Hocke und drücke dich wieder hoch. Beobachte, wann der Zeiger über und wann er unter deinem Ruhewert steht."]
  },
  "bw14": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "orbit", seite: 81,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum schweben Astronauten in der Raumstation, obwohl sie ständig „fallen“?",
    titel: "Vierhundert Kilometer über dem Wohnzimmer",
    frage: "Warum schweben Astronauten, obwohl sie ständig fallen?",
    auftrag: "Untersuche, welche Abschussgeschwindigkeit quer für eine Umlaufbahn nötig ist.",
    schritte: ["Stelle die Abschussgeschwindigkeit quer nacheinander auf „5 km/s“ und auf „7,7 km/s“ ein und beschreibe, was mit der Bahn geschieht.", "Wähle danach „9 km/s“ und „11 km/s“ und trage für jede Einstellung ein, ob der Körper zurückfällt, umläuft oder entkommt.", "Gegenprobe am Tisch: Rolle eine Kugel unterschiedlich schnell über die Tischkante und miss, wie weit sie fliegt, bevor sie den Boden trifft."]
  },
  "bw15": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "rueckstoss", seite: 84,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Wie schafft es eine Rakete, sich im Weltall abzustoßen, wo doch nichts da ist?",
    titel: "Der Stuhl rollt nach hinten",
    frage: "Wie stößt sich eine Rakete im Weltall ab, wo doch nichts da ist?",
    auftrag: "Untersuche, wie Gasmasse und Gasgeschwindigkeit das Tempo der Rakete bestimmen.",
    schritte: ["Stelle Ausgestoßene Gasmasse auf 20 kg und Geschwindigkeit des Gases auf 600 m/s ein, wähle „Gas ausstoßen“ und lies ab, wie schnell die Rakete wird.", "Wähle „Zurücksetzen“, halbiere die Ausgestoßene Gasmasse auf 10 kg und stoße erneut aus; wiederhole das anschließend mit 300 m/s bei 20 kg.", "Gegenprobe am Tisch: Setze dich auf einen Bürostuhl, halte einen schweren Ball und stoße ihn kräftig von dir weg. Beobachte, wohin sich der Stuhl bewegt."]
  },
  "en1": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "energieformen", seite: 95,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Was ist Energie – und wie misst man sie?",
    titel: "Sechs Sachen, ein einziges Maß",
    frage: "Was haben so verschiedene Energiespeicher miteinander gemeinsam?",
    auftrag: "Untersuche die sechs Speicher der Simulation auf ihre Gemeinsamkeit.",
    schritte: ["Wähle nacheinander „gespannte Sprungfeder“, „rollender Fußball“ und „Kiste auf dem Regal“. Trage für jeden ein, welche Energieform dort steht und wie viele Joule.", "Wähle danach „volle AA-Batterie“, „Tasse heißer Tee“ und „Butterbrot“ und trage sie ebenso ein.", "Lies in der Simulation bei jedem Speicher an der Skala rechts ab, wie hoch er den 10-kg-Sack heben würde, und ordne am Ende alle sechs nach ihrer Energie."]
  },
  "en2": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "arbeit", seite: 98,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Wann wird Arbeit verrichtet? (W = F · s)",
    titel: "Schieben, tragen, heben",
    frage: "Wann wird physikalisch Arbeit verrichtet – und wann nicht?",
    auftrag: "Prüfe das an den drei Situationen der Simulation.",
    schritte: ["Wähle „Schieben“, stelle F = 100 N und s = 4 m ein und drücke „Ausführen“. Achte auf die beiden Pfeile im Bild und trage die Arbeit ein.", "Wähle „Waagerecht tragen“ mit m = 20 kg und s = 4 m. Vergleiche die Richtung des roten Kraftpfeils mit der des blauen Wegpfeils und notiere, was dabei für die Arbeit herauskommt.", "Wähle „Hochheben“ mit m = 20 kg und h = 2 m. Halte fest, wie die Pfeile jetzt zueinander stehen und welche Arbeit angezeigt wird."]
  },
  "en3": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "arbeit", seite: 101,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Hubarbeit: W = m · g · h",
    titel: "Drei Stockwerke, kein Aufzug",
    frage: "Wovon hängt die Arbeit ab, die das Heben eines Körpers kostet?",
    auftrag: "Untersuche das in der Simulation und übertrage es auf den Weg in den dritten Stock.",
    schritte: ["Wähle „Hochheben“ und stelle m = 20 kg bei h = 1,0 m ein. Notiere die Arbeit, verdopple dann die Höhe auf h = 2,0 m und danach auf h = 4,0 m.", "Stelle die Höhe fest auf h = 3,0 m und verändere nur die Masse: 10 kg, 20 kg, 40 kg. Trage jedes Ergebnis ein.", "Gegenprobe am Tisch: Hebe dein Mäppchen einmal auf die Tischplatte und einmal aufs Regal darüber. Beschreibe, woran du merkst, welcher Weg mehr Arbeit kostet."]
  },
  "en4": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "lageenergie", seite: 104,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Lageenergie: E = m · g · h",
    titel: "Oben auf dem Schrank",
    frage: "Wovon hängt die Energie eines angehobenen Körpers ab?",
    auftrag: "Untersuche in der Simulation, woran man diese Energie erkennen kann.",
    schritte: ["Stelle m = 5 kg und h = 3 m ein und drücke „Fallen lassen“. Notiere die angezeigte Lageenergie und die Tiefe, die der Pfahl in den Boden getrieben wird.", "Drücke „×2 Masse“ und lasse erneut fallen. Setze danach mit „zurücksetzen“ alles zurück, drücke „×2 Höhe“ und lasse wieder fallen. Trage beide Ergebnisse ein.", "Vergleiche die beiden Verdopplungen miteinander: Zählt die Masse stärker, die Höhe stärker, oder sind beide gleich wichtig?"]
  },
  "en5": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "bewegungsenergie", seite: 107,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Bewegungsenergie: E = ½ · m · v²",
    titel: "Der Ball im Flur",
    frage: "Zählen Masse und Tempo gleich stark für die Bewegungsenergie?",
    auftrag: "Untersuche in der Simulation beide Größen nacheinander einzeln.",
    schritte: ["Stelle m = 4 kg und v = 4 m/s ein und drücke „Rollen lassen“. Notiere die Energie und die Strecke, um die der Klotz geschoben wird.", "Drücke „×2 Masse“ und lasse erneut rollen. Setze danach mit „zurücksetzen“ zurück, drücke „×2 Tempo“ und lasse noch einmal rollen.", "Vergleiche die beiden Schiebestrecken miteinander. Halte fest, um welchen Faktor die Energie jeweils gewachsen ist."]
  },
  "en6": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "reibungswaerme", seite: 109,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Wohin geht die Energie beim Ausrollen?",
    titel: "Warum der Ball einfach liegen bleibt",
    frage: "Wohin geht die Bewegungsenergie, wenn ein Körper von allein stehen bleibt?",
    auftrag: "Untersuche in der Simulation, was aus ihr wird.",
    schritte: ["Wähle „Ball rollt aus“, stelle v = 6 m/s ein und drücke „Los“. Notiere die Bewegungsenergie am Anfang und die Erwärmung, die am Ende angezeigt wird.", "Stelle am Regler „Anfangstempo v“ nacheinander 2 m/s und 8 m/s ein und drücke jedes Mal „Los“. Trage die Erwärmung ein und achte darauf, ob sie zu spüren wäre.", "Beobachte während des Rollens den Balken oben: Wie verändert sich das Verhältnis von blauem und rotem Anteil, und wie ändert sich dabei die Gesamtlänge?"]
  },
  "en7": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "energieerhaltung", seite: 112,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Der Energieerhaltungssatz",
    titel: "Der Ball springt nicht mehr so hoch",
    frage: "Verschwindet Energie beim Springen, oder wechselt sie nur die Form?",
    auftrag: "Prüfe das in der Simulation an jeder Stelle der Bewegung.",
    schritte: ["Stelle die Höhe h = 20 m und die Masse m = 2 kg ein. Beobachte im Diagramm, wie sich die Kurven für Epot und Ekin abwechseln, und halte fest, wann welche am größten ist.", "Achte auf den Ball selbst: Notiere, wie hoch er nach dem ersten und nach dem zweiten Aufprall noch kommt.", "Verändere die Masse auf m = 8 kg und schaue, ob sich am Verhältnis von Epot und Ekin etwas ändert oder nur an den Zahlenwerten."]
  },
  "en8": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "achterbahn", seite: 115,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Umwandlung an der Achterbahn",
    titel: "Vom Balkon aus sieht man die Kirmes",
    frage: "Warum braucht eine Achterbahn nach dem ersten Berg keinen Motor mehr?",
    auftrag: "Untersuche, wie sich Lage- und Bewegungsenergie über die Bahn verteilen.",
    schritte: ["Stelle h₀ = 30 m und h₂ = 20 m ein und drücke „Losfahren“. Halte am Starthügel, im Tal und auf dem zweiten Hügel jeweils Höhe, Tempo und die beiden Energien fest.", "Achte dabei auf den Balken oben: Notiere, wie sich der violette und der rote Anteil verschieben und ob sich die Gesamtlänge dabei ändert.", "Stelle nun h₂ = 40 m ein, also höher als den Starthügel, und fahre erneut los. Beschreibe, was passiert und warum das gar nicht anders sein kann."]
  },
  "en9": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "reibungswaerme", seite: 118,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Warum wird beim Bremsen alles warm?",
    titel: "Heiße Felgen am Berg",
    frage: "Warum wird beim Bremsen alles warm?",
    auftrag: "Vergleiche die beiden Fälle und finde, warum man die Wärme nur einmal spürt.",
    schritte: ["Wähle „Fahrrad bremsen“, stelle v = 8 m/s ein und drücke „Los“. Notiere die Bewegungsenergie und die Erwärmung der Bremse.", "Stelle nacheinander v = 3 m/s und v = 12 m/s ein und bremse jedes Mal. Trage beide Ergebnisse in die Tabelle ein.", "Wechsle zurück zu „Ball rollt aus“ mit v = 8 m/s und vergleiche die Erwärmung mit der des Fahrrads bei gleichem Tempo."]
  },
  "en10": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "wirkungsgrad", seite: 121,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Der Wirkungsgrad η",
    titel: "Was die alte Lampe wirklich macht",
    frage: "Welcher Anteil der hineingesteckten Energie kommt als Nutzen heraus?",
    auftrag: "Untersuche das an den sechs Maschinen der Simulation.",
    schritte: ["Lass die hineingesteckte Energie auf 1000 J stehen und wähle „Glühlampe“. Notiere, wie viel davon Licht wird und wie viel Wärme.", "Wähle danach „LED-Lampe“, „Benzinmotor“ und „Elektromotor“ und trage jedes Mal den Wirkungsgrad und die beiden Anteile ein.", "Stelle zuletzt die hineingesteckte Energie auf 2000 J und prüfe an der Glühlampe, ob sich der Wirkungsgrad dadurch ändert oder nur die Zahlenwerte."]
  },
  "en11": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "wirkungsgrad", seite: 124,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Wo die Verluste entstehen",
    titel: "Wo der fehlende Rest bleibt",
    frage: "Wohin geht der Anteil, den man Verlust nennt?",
    auftrag: "Untersuche das an den sechs Maschinen und prüfe, wovon der Name abhängt.",
    schritte: ["Wähle nacheinander alle sechs Maschinen von „Glühlampe“ bis „Handy-Ladegerät“. Lies bei jeder den Text unter der Statuszeile und trage stichwortartig ein, wo der Verlust hingeht.", "Vergleiche „Wasserkocher“ und „Glühlampe“ miteinander: Beide geben viel Wärme ab, haben aber sehr verschiedene Wirkungsgrade. Notiere, woran das liegt.", "Ordne die sechs Maschinen der Simulation nach ihrem Wirkungsgrad und prüfe, ob ein Zusammenhang zwischen der Art des Nutzens und der Höhe von η zu erkennen ist."]
  },
  "en12": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "leistung-rs", seite: 127,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Leistung: P = W / t",
    titel: "Schnell oder langsam die Treppe hoch",
    frage: "Was ändert sich, wenn dieselbe Arbeit in kürzerer Zeit verrichtet wird?",
    auftrag: "Untersuche das in der Simulation bei gleicher Arbeit und halber Zeit.",
    schritte: ["Stelle m = 50 kg, h = 4 m und t = 10 s ein und drücke „Hochziehen“. Notiere die Arbeit und die Leistung.", "Drücke „÷2 Zeit“ und ziehe erneut hoch. Trage Arbeit und Leistung wieder ein und achte besonders darauf, welche der beiden Größen sich verändert hat.", "Stelle t = 20 s ein und danach t = 2 s. Halte für beide Fälle fest, mit welchem Vergleich aus dem Alltag die Simulation die Leistung beschreibt."]
  },
  "en13": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "leistung-rs", seite: 129,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Watt, Kilowatt und PS",
    titel: "100 PS und 2000 Watt",
    frage: "Welche Leistungen stecken hinter Watt, Kilowatt und PS?",
    auftrag: "Untersuche die Zahlenwerte und rechne zwischen den Einheiten um.",
    schritte: ["Stelle m = 100 kg, h = 10 m und t = 1 s ein. Notiere die Leistung in Watt, in Kilowatt und in PS sowie den Alltagsvergleich, den die Simulation nennt.", "Stelle nun t so ein, dass die Leistung ungefähr 1000 W beträgt, und danach so, dass sie ungefähr 2000 W beträgt. Trage die jeweilige Zeit und den Vergleich ein.", "Suche die Einstellung mit der kleinsten möglichen Leistung. Vergleiche sie mit den 9 W der LED-Lampe von der Verpackung."]
  },
  "en14": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "energie-entwerten", seite: 131,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Energieentwertung: warum sparen?",
    titel: "Die erste Stromrechnung",
    frage: "Was bleibt am Ende einer Energiekette noch zu gebrauchen?",
    auftrag: "Untersuche eine Kette Schritt für Schritt und bestimme den nutzbaren Rest.",
    schritte: ["Wähle „Kohle → Licht“ und drücke viermal „nächster Schritt“. Trage nach jedem Schritt ein, wie viel Joule noch nutzbar sind und wie viel schon zu Wärme wurde.", "Achte dabei auf die Gesamtlänge der Balken: Notiere, ob sie sich von Schritt zu Schritt verändert.", "Wechsle zu „Benzin → Fahrt“ und gehe auch diese Kette durch. Vergleiche, nach wie vielen Schritten in beiden Fällen nichts Nutzbares mehr übrig ist."]
  },
  "kw1": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 105,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Woher der Strom kommt",
    titel: "Der Schalter und das Kraftwerk",
    frage: "Woher kommt der Strom in Deutschland?",
    auftrag: "Untersuche das Datenblatt und bestimme den Anteil der erneuerbaren Quellen.",
    schritte: ["Lies aus dem Datenblatt die beiden größten Anteile ab und trage sie mit Namen und Prozentwert in die Tabelle ein.", "Rechne die Anteile von Windkraft, Photovoltaik, Biomasse und Wasserkraft zusammen. Vergleiche die Summe mit dem Rest.", "Beurteile mit deinem Ergebnis, ob Bens Antwort „aus der Steckdose“ als Erklärung ausreicht."]
  },
  "kw2": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "generator", seite: 145,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Wie Bewegung zu Strom wird",
    titel: "Der Dynamo im Fahrradkeller",
    frage: "Wovon hängt es ab, wie viel Spannung ein Generator erzeugt?",
    auftrag: "Untersuche die Simulation bei stehendem und bei schnell gedrehtem Magneten.",
    schritte: ["Stelle nacheinander eine langsame, eine mittlere und eine hohe Drehzahl ein. Lies jedes Mal die Spannung ab und trage sie in die Tabelle ein.", "Halte den Magneten ganz an und lies ab, was das Messgerät nun zeigt. Vergleiche diesen Wert mit den drei Werten aus der Tabelle.", "Beurteile mit deinem Ergebnis Bens Behauptung, der Dynamo mache den Strom von selbst."]
  },
  "kw3": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 109,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Ein Prinzip, viele Brennstoffe",
    titel: "Der gleiche Dampf hinter jeder Flamme",
    frage: "Bestimmt der Brennstoff den Wirkungsgrad oder der Weg über Dampf und Turbine?",
    auftrag: "Vergleiche die fünf Kraftwerke im Datenblatt miteinander.",
    schritte: ["Lies für Braunkohlekraftwerk, Gas- und Dampfkraftwerk und Kernkraftwerk den Wirkungsgrad ab und trage die drei Werte in die Tabelle ein.", "Ordne alle fünf Anlagen nach dem Wirkungsgrad und rechne den Abstand zwischen dem höchsten und dem niedrigsten Wert aus.", "Beurteile mit deinem Ergebnis Bens Behauptung, ein Kernkraftwerk arbeite völlig anders als ein Kraftwerk, das Holz verbrennt."]
  },
  "kw4": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 111,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Was vom Brennstoff bleibt",
    titel: "Verbrannt ist nicht verschwunden",
    frage: "Wie viel Kohlenstoffdioxid kostet eine Kilowattstunde aus fossilen Quellen?",
    auftrag: "Vergleiche die Werte im Datenblatt und bestimme, wie lange die Vorräte reichen.",
    schritte: ["Lies die CO₂-Werte von Braunkohle und Erdgas je Kilowattstunde Strom aus dem Datenblatt ab und trage beide in die Tabelle ein.", "Rechne aus, um wie viel Gramm Braunkohle über Erdgas liegt, und vergleiche dazu die Reichweiten der beiden Energieträger.", "Beurteile mit deinem Ergebnis Bens Behauptung, nach dem Verbrennen sei das Gas einfach weg."]
  },
  "kw5": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 113,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Strom ohne Feuer",
    titel: "Das Solardach der Turnhalle",
    frage: "Woher stammt die Energie der erneuerbaren Quellen?",
    auftrag: "Untersuche das Datenblatt und vergleiche, wie stark jede Quelle vom Wetter abhängt.",
    schritte: ["Lies für Photovoltaik, Wasserkraft und Geothermie im Datenblatt ab, ob sie vom Wetter abhängen, und trage die Angaben in die Tabelle ein.", "Zähle im Datenblatt, wie viele der fünf Quellen deutlich vom Wetter abhängen und wie viele kaum oder gar nicht. Vergleiche beide Gruppen.", "Beurteile mit deinem Ergebnis Bens Behauptung, ohne Verbrennung könne kein Kraftwerk Strom liefern."]
  },
  "kw6": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 115,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Sonne, Wind und Wasser",
    titel: "Was am Ende eines Jahres zusammenkommt",
    frage: "Wie viel liefert eine Anlage je Kilowatt Leistung im Jahr?",
    auftrag: "Vergleiche Leistung und Jahresertrag der drei Anlagen im Datenblatt.",
    schritte: ["Lies Leistung und Jahresertrag der drei Anlagen aus dem Datenblatt ab und ordne sie den Zeilen der Tabelle zu.", "Rechne für jede Anlage den Jahresertrag geteilt durch die Leistung aus und trage das Ergebnis in die Tabelle ein.", "Beurteile mit deinen drei Ergebnissen, ob Bens Satz stimmt, das Wasserkraftwerk sei die schwächste der drei Anlagen."]
  },
  "kw7": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 117,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Zu viel und zu wenig",
    titel: "Der Wind macht keinen Stundenplan",
    frage: "Passen Angebot und Bedarf an jedem Tag der Woche zusammen?",
    auftrag: "Untersuche die Wochentabelle und bestimme Überschuss- und Mangeltage.",
    schritte: ["Lies für alle fünf Tage die Prozentwerte ab und trage den höchsten und den niedrigsten Tageswert in die Tabelle ein.", "Addiere die fünf Prozentwerte und teile durch 5. Trage den Durchschnitt ein und vergleiche ihn mit Dienstag und Freitag.", "Beurteile mit deinem Ergebnis, ob Bens Vorschlag „doppelt so viele Windräder“ die Lücke am Freitag schließt."]
  },
  "kw8": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 119,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Speicher für später",
    titel: "Sonne von mittags, Licht am Abend",
    frage: "Wie viel Energie geht beim Speichern verloren?",
    auftrag: "Vergleiche die Wirkungsgrade im Datenblatt und bestimme den Verlust in Prozent.",
    schritte: ["Lies den höchsten und den niedrigsten Wirkungsgrad aus dem Datenblatt ab und trage beide Werte in die Tabelle ein.", "Rechne die Differenz der beiden Wirkungsgrade aus und bestimme, wie viel Prozent im Wasserstoffspeicher verloren gehen.", "Beurteile mit deinem Ergebnis, ob Bens Satz „egal womit“ für den Strom vom Mittag bis zum Abend stimmt."]
  },
  "kw9": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 121,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Kohlenstoff wird zu Kohlendioxid",
    titel: "Die Luft merkt sich jedes Feuer",
    frage: "Wie hat sich der CO₂-Anteil der Luft seit 1750 verändert?",
    auftrag: "Untersuche das Datenblatt und vergleiche den Anstieg vor 1900 mit dem seit 1960.",
    schritte: ["Lies die Werte für 1750, 1900, 1960 und 2025 aus dem Datenblatt ab und ordne sie den drei Zeiträumen der Tabelle zu.", "Rechne für jeden Zeitraum den Anstieg in ppm aus. Vergleiche den Anstieg von 1960 bis 2025 mit den beiden Zeiträumen davor.", "Beurteile mit deinem Ergebnis Bens Satz, eine einzelne Wohnung ändere am Klima der ganzen Erde nichts."]
  },
  "kw10": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 123,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Der natürliche Treibhauseffekt",
    titel: "Die Decke aus Gas",
    frage: "Wie viel wärmer macht der Treibhauseffekt die Erde?",
    auftrag: "Vergleiche die mittleren Temperaturen der Himmelskörper im Datenblatt.",
    schritte: ["Lies die mittleren Temperaturen der Erde ohne Treibhauseffekt, der wirklichen Erde und der Venus ab und trage sie in die Tabelle ein.", "Rechne die Differenz der beiden Erdwerte aus: 15 °C − (−18 °C). Vergleiche danach Mars und Venus, beide mit CO₂-Hülle.", "Beurteile mit deinen Ergebnissen, ob Bens Vorschlag, den Treibhauseffekt abzuschalten, für die Erde eine gute Idee wäre."]
  },
  "kw11": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 125,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Ein Jahr macht kein Klima",
    titel: "Der Schneewinter und die lange Kurve",
    frage: "Reicht ein einzelnes Jahr aus, um etwas über das Klima zu sagen?",
    auftrag: "Vergleiche im Datenblatt einzelne Jahre mit langen Zeiträumen.",
    schritte: ["Lies die Mitteltemperaturen der Zeiträume 1881–1910, 1991–2020 und 2015–2024 aus dem Datenblatt ab und trage sie in die Tabelle ein.", "Rechne die Differenz zwischen 2015–2024 und 1881–1910 aus. Vergleiche danach das Einzeljahr 2010 mit dem Mittelwert von 1881–1910.", "Beurteile mit deinem Ergebnis, ob Bens Schneewinter beweist, dass es in Deutschland nicht wärmer wird."]
  },
  "kw12": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 127,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "CO₂ über den ganzen Lebensweg",
    titel: "Der Rucksack des Solarmoduls",
    frage: "Wie weit liegen die Stromquellen beim CO₂ über den ganzen Lebensweg auseinander?",
    auftrag: "Vergleiche die fünf Quellen im Datenblatt je Kilowattstunde.",
    schritte: ["Lies aus dem Datenblatt den höchsten und den niedrigsten Wert ab und trage beide mit dem Namen der Quelle in die Tabelle ein.", "Rechne den Unterschied der beiden Werte aus und bestimme, wie oft der kleine Wert in den großen hineinpasst.", "Beurteile mit deinem Ergebnis, ob Bens Behauptung stimmt, der Strom vom Balkon entstehe ganz ohne CO₂."]
  },
  "kw13": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 129,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Strom aus der eigenen Stadt",
    titel: "Alle Dächer, alle Windräder",
    frage: "Kann eine Stadt ihren Strom auf den eigenen Dächern erzeugen?",
    auftrag: "Prüfe mit dem Datenblatt Jahresertrag und Bedarf und stelle sie gegenüber.",
    schritte: ["Lies Dachfläche, Ertrag je Quadratmeter, Zahl der Windräder und Ertrag je Windrad aus dem Datenblatt ab und trage die Werte in die Tabelle ein.", "Rechne den Jahresertrag der Dächer und den der Windräder aus, addiere beides und vergleiche die Summe mit dem Bedarf der Stadt.", "Beurteile mit deinem Ergebnis, ob Bens Behauptung „mehr braucht die Stadt nicht“ zutrifft."]
  },
  "mo1": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "magnetfeld", seite: 5,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Das Magnetfeld sichtbar machen",
    titel: "Der Motor liegt in Einzelteilen da",
    frage: "An welchen Stellen eines Magneten wirkt er am stärksten?",
    auftrag: "Untersuche mit dem Prüfkompass, wo der Magnet die Nadel am kräftigsten dreht.",
    schritte: ["Ziehe den Prüfkompass dicht an das linke Ende des Magneten und beobachte die Nadel.", "Führe ihn an dieselbe Stelle, aber mit größerem Abstand. Vergleiche den Ausschlag.", "Setze ihn zuletzt in die Mitte zwischen beide Enden und halte fest, was die Nadel tut."]
  },
  "mo2": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kompass", seite: 7,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Die Erde als großer Magnet",
    titel: "Warum der Kompass nicht lügt",
    frage: "Wovon hängt es ab, wohin die Kompassnadel zeigt?",
    auftrag: "Vergleiche die Nadel im freien Gelände mit der Nadel neben einer Magnetleiste.",
    schritte: ["Wähle die Einstellung „Erdmagnetfeld“ und stoße die Nadel an. Warte ab, wo sie zur Ruhe kommt.", "Stoße sie mehrmals aus verschiedenen Richtungen an und prüfe, ob sie immer gleich endet.", "Wähle danach die Einstellung mit der Magnetleiste daneben und stoße die Nadel erneut an."]
  },
  "mo3": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "oersted", seite: 9,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Der Versuch von Ørsted",
    titel: "Ein Draht, der sich benimmt wie ein Magnet",
    frage: "Kann elektrischer Strom eine Kompassnadel bewegen?",
    auftrag: "Miss den Ausschlag der Nadel bei verschiedenen Stromstärken und Abständen.",
    schritte: ["Schalte den Strom aus und halte fest, wohin die Nadel zeigt.", "Stelle nacheinander I = 1,0 A, 3,0 A und 5,0 A ein, jeweils bei 1,0 cm Abstand, und lies Feld und Ausschlag ab.", "Stelle zuletzt 3,0 A ein und vergrößere nur den Abstand auf 3,0 cm."]
  },
  "mo4": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromagnet", seite: 11,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Der Elektromagnet",
    titel: "Ein Magnet mit Schalter",
    frage: "Wie baut man einen Magneten, den man an- und ausschalten kann?",
    auftrag: "Prüfe, wie viele Büroklammern eine Spule mit Eisenkern trägt.",
    schritte: ["Wähle „Windungszahl ändern“ und stelle N = 150 bei I = 2 A ein. Lies die Tragkraft ab.", "Stelle nacheinander N = 50, N = 100 und N = 300 ein und übernimm jeden Messwert.", "Sieh dir die entstehende Kurve an und lies ab, welchen Verlauf sie hat."]
  },
  "mo5": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromagnet", seite: 13,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Was einen Elektromagneten stärker macht",
    titel: "Zwei Schrauben, an denen man drehen kann",
    frage: "Wovon hängt die Stärke eines Elektromagneten ab?",
    auftrag: "Bestimme die Tragkraft bei verschiedenen Stromstärken und vergleiche sie.",
    schritte: ["Wähle „Stromstärke ändern“. Die Windungszahl steht dabei fest bei N = 150.", "Stelle I = 2 A ein, lies die Tragkraft ab und übernimm den Messwert.", "Stelle danach I = 4 A ein, übernimm auch diesen Wert und prüfe, ob sich die Tragkraft verdoppelt hat."]
  },
  "mo6": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "stromwirkungen", seite: 15,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Wirkungen des elektrischen Stroms",
    titel: "Vier Geräte an derselben Batterie",
    frage: "Welche Wirkungen kann elektrischer Strom haben?",
    auftrag: "Vergleiche, was derselbe Strom in vier verschiedenen Geräten bewirkt.",
    schritte: ["Schließe die Glühlampe an und halte fest, welche Wirkungen angezeigt werden.", "Wechsle nacheinander zu Heizdraht, Spule und Elektromotor.", "Lies bei jedem Gerät ab, in welche Energieform die elektrische Energie übergeht."]
  },
  "mo7": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "leiterkraft", seite: 17,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Kraft auf einen stromdurchflossenen Leiter",
    titel: "Der Stab, der von selbst hochspringt",
    frage: "Warum bewegt sich ein Draht im Magnetfeld, sobald Strom fließt?",
    auftrag: "Miss die Kraft auf den Stab bei verschiedenen Stromstärken und Feldstärken.",
    schritte: ["Stelle I = 0 A ein und halte fest, was mit dem Stab geschieht.", "Stelle B = 0,20 T und I = 5,0 A ein, lies Kraft und Richtung ab und verdopple danach nur die Stromstärke auf 10,0 A.", "Gehe zurück auf I = 5,0 A und verdopple stattdessen nur das Feld auf B = 0,40 T."]
  },
  "mo8": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "leiterkraft", seite: 19,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Die Richtung der Kraft vorhersagen",
    titel: "Ben baut den Motor falsch herum ein",
    frage: "Wie sagt man die Richtung der Kraft vorher, ohne sie auszuprobieren?",
    auftrag: "Prüfe, wie sich die Kraftrichtung beim Umpolen von Strom und Magnet verändert.",
    schritte: ["Stelle B = 0,20 T und I = 5,0 A ein und halte die Kraftrichtung fest.", "Drücke „Strom umpolen“, lies die neue Richtung ab und drücke danach zusätzlich „Magnet umdrehen“.", "Setze zurück und drücke diesmal nur „Magnet umdrehen“."]
  },
  "mo9": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromotor", seite: 21,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Aus Kraft wird Drehung",
    titel: "Warum sich die Spule überhaupt dreht",
    frage: "Wie wird aus einer schiebenden Kraft eine Drehbewegung?",
    auftrag: "Untersuche, in welche Richtungen die Kräfte auf die beiden Spulenseiten wirken.",
    schritte: ["Sieh dem laufenden Motor eine halbe Minute lang zu und achte auf die grünen Pfeile.", "Halte fest, in welche Richtung der Strom auf jeder der beiden Spulenseiten fließt, und vergleiche die beiden Kraftpfeile.", "Lies das Drehmoment ab, das die Simulation dazu berechnet."]
  },
  "mo10": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromotor", seite: 23,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Der Kommutator",
    titel: "Das kleine Teil, ohne das nichts läuft",
    frage: "Warum bleibt der Motor nicht nach einer halben Umdrehung stehen?",
    auftrag: "Vergleiche den Motor mit eingeschaltetem und mit ausgeschaltetem Kommutator.",
    schritte: ["Sieh dem Motor mit eingeschaltetem Kommutator zu und lies die Zahl der Umdrehungen ab.", "Schalte den Kommutator aus, setze zurück und beobachte die Spule mindestens zwanzig Sekunden lang.", "Schalte den Kommutator wieder ein und vergleiche."]
  },
  "mo11": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromotor", seite: 25,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Was einen Motor kräftiger macht",
    titel: "Vier Stellschrauben am fertigen Motor",
    frage: "Was macht einen Elektromotor kräftiger und schneller?",
    auftrag: "Bestimme das Drehmoment, wenn du Windungszahl, Stromstärke und Magnetfeld veränderst.",
    schritte: ["Stelle 20 Windungen, I = 2,0 A und B = 0,20 T ein und lies das Drehmoment ab.", "Verdopple nur die Windungszahl auf 40, lies erneut ab und gehe danach wieder auf 20 zurück.", "Verdopple nun nur die Stromstärke auf 4,0 A und zuletzt nur das Magnetfeld auf 0,40 T."]
  },
  "ge1": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "induktion-rs", seite: 35,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Induktion – Spannung ohne Batterie",
    titel: "Das Messgerät zeigt etwas an, obwohl nichts angeschlossen ist",
    frage: "Kann ein bewegter Magnet eine Spannung erzeugen, ohne dass eine Batterie da ist?",
    auftrag: "Untersuche, wann das Messgerät ausschlägt und wann es auf null steht.",
    schritte: ["Beobachte einen ganzen Durchgang: hineinschieben, liegen lassen, herausziehen, liegen lassen.", "Halte fest, was das Messgerät in jeder der vier Phasen anzeigt.", "Vergleiche besonders das Hineinschieben mit dem Herausziehen und achte auf das Vorzeichen."]
  },
  "ge2": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "induktion-rs", seite: 37,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Wovon die induzierte Spannung abhängt",
    titel: "Drei Schrauben an derselben Spule",
    frage: "Wovon hängt die Höhe der induzierten Spannung ab?",
    auftrag: "Bestimme die Spannung, wenn du Tempo, Windungszahl und Magnetstärke veränderst.",
    schritte: ["Stelle 600 Windungen, Tempo 50 cm/s und den mittleren Magneten ein und lies die Spannung ab.", "Verdopple nur das Tempo auf 100 cm/s, danach nur die Windungszahl auf 1200.", "Stelle zuletzt wieder 600 Windungen und 50 cm/s ein und wähle nur den starken Magneten."]
  },
  "ge3": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "thomson-ring", seite: 39,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Die Lenzsche Regel",
    titel: "Der Ring, der von der Spule wegspringt",
    frage: "Warum wirkt bei der Induktion immer eine bremsende Kraft?",
    auftrag: "Vergleiche, was beim Einschalten und was beim Ausschalten mit dem Ring geschieht.",
    schritte: ["Halte fest, was der Ring in Ruhe tut, solange kein Strom fließt.", "Schalte den Strom ein und lies ab, wie sich der Ring bewegt und wie die Felder zueinander stehen.", "Schalte danach wieder aus und vergleiche die Bewegung mit der beim Einschalten."]
  },
  "ge4": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "generator", seite: 41,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Der Generator",
    titel: "Eine Spule, die sich nicht mehr anhalten lässt",
    frage: "Wie erzeugt ein Kraftwerk ohne Unterbrechung Strom?",
    auftrag: "Untersuche, wie sich die Spannung ändert, während sich die Spule einmal ganz dreht.",
    schritte: ["Lasse die Spule sich drehen und beobachte den Verlauf der Spannung über eine volle Umdrehung.", "Halte die Spule in der Lage an, in der ihre Fläche senkrecht zum Feld steht, und lies die Spannung ab.", "Drehe sie um eine Vierteldrehung weiter und lies die Spannung dort erneut ab."]
  },
  "ge5": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "generator", seite: 43,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Wechselspannung",
    titel: "Warum die Steckdose keinen Plus- und Minuspol hat",
    frage: "Warum wechselt der Strom aus der Steckdose ständig seine Richtung?",
    auftrag: "Vergleiche die Spannung in den vier ausgezeichneten Lagen einer vollen Umdrehung.",
    schritte: ["Lies in der Tabelle der Simulation die Spannung bei 0°, 90°, 180° und 270° ab.", "Achte dabei besonders auf das Vorzeichen der Werte bei 90° und bei 270°.", "Vergleiche den Verlauf mit dem einer Batterie, die immer denselben Pol behält."]
  },
  "ge6": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 45,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Gleichstrom und Wechselstrom",
    titel: "Zwei Sorten Strom in einem einzigen Gerät",
    frage: "Wann braucht man Gleichstrom und wann Wechselstrom?",
    auftrag: "Vergleiche die Einsatzgebiete beider Stromarten anhand des Datenblatts.",
    schritte: ["Lies im Datenblatt ab, welche Geräte Gleichstrom und welche Wechselstrom brauchen.", "Halte fest, welche Stromart sich mit einem Transformator umspannen lässt.", "Suche für jede der beiden Stromarten den entscheidenden Vorteil heraus."]
  },
  "ge7": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "transformator-schluessel", seite: 48,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Der Transformator",
    titel: "Zwei Spulen, die sich nicht berühren",
    frage: "Wie ändert man eine Spannung, ohne dabei viel Energie zu verschwenden?",
    auftrag: "Untersuche, wie die Spannung an der zweiten Spule von der Windungszahl abhängt.",
    schritte: ["Wähle den Spulensatz 500 → 1000 und lies das Übersetzungsverhältnis ab.", "Vergleiche die ideal erwartete Sekundärspannung mit der tatsächlich gemessenen.", "Lies in der Leistungsbilanz ab, wie viel hineingesteckt und wie viel herausgeholt wird."]
  },
  "ge8": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "transformator-schluessel", seite: 50,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Die Transformatorgleichung",
    titel: "Das Verhältnis, auf das es ankommt",
    frage: "Wie hängen Windungszahl und Spannung an einem Transformator zusammen?",
    auftrag: "Bestimme für mehrere Spulensätze das Verhältnis von Windungszahlen und Spannungen.",
    schritte: ["Wähle nacheinander die Spulensätze 1000 → 500, 1000 → 250 und 500 → 1000.", "Notiere für jeden Satz das Übersetzungsverhältnis und die gemessene Spannung.", "Prüfe an der Messwerttabelle, ob das Verhältnis der Spannungen zum Verhältnis der Windungszahlen passt."]
  },
  "ge9": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "freileitungen", seite: 52,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Verluste auf der Leitung",
    titel: "Was zwischen Kraftwerk und Lampe verlorengeht",
    frage: "Warum geht auf langen Leitungen Energie verloren?",
    auftrag: "Vergleiche die Verluste der drei Leitungsvarianten miteinander.",
    schritte: ["Wähle die Niederspannungs-Fernleitung und lies ab, wie hell die Lampen leuchten.", "Lies in der Energiebilanz ab, wie viel Energie je Sekunde in der Leitung bleibt.", "Wähle danach die Leitung mit kleinem spezifischem Widerstand und vergleiche den Verlust."]
  },
  "ge10": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "freileitungen", seite: 54,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Warum Hochspannung",
    titel: "380 000 Volt über dem Acker",
    frage: "Warum transportiert man elektrische Energie mit Hochspannung?",
    auftrag: "Vergleiche Stromstärke und Verlust bei Hoch- und bei Niederspannung.",
    schritte: ["Wähle die Hochspannungs-Fernleitung und lies ab, auf welche Spannung hochtransformiert wird.", "Lies die Stromstärke in der Fernleitung ab und vergleiche sie mit der bei den Lampen.", "Halte den Verlust je Sekunde fest und vergleiche ihn mit dem der Niederspannungsleitung."]
  },
  "ge11": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 55,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Vom Kraftwerk in die Steckdose",
    titel: "Vier Spannungen auf demselben Weg",
    frage: "Wie kommt der Strom vom Kraftwerk bis in die Steckdose?",
    auftrag: "Untersuche im Datenblatt, an welcher Station die Spannung jeweils geändert wird.",
    schritte: ["Lies im Datenblatt ab, mit welcher Spannung der Generator im Kraftwerk arbeitet.", "Verfolge die Stationen der Reihe nach und halte jede Spannung fest.", "Bestimme, an welchen Stellen ein Transformator stehen muss."]
  },
  "ak1": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "atombau-isotope", seite: 67,
    kapitel: "Atomkern und Strahlung",
    name: "Der Aufbau des Atoms",
    titel: "Was hinter der Bleitür passiert",
    frage: "Woraus besteht ein Atom, und was macht es zu genau diesem Element?",
    auftrag: "Untersuche, wie sich Name und Massenzahl ändern, wenn du am Kern etwas veränderst.",
    schritte: ["Stelle 6 Protonen und 6 Neutronen ein und lies Name, Massenzahl und Schreibweise ab.", "Verändere die Protonenzahl auf 7 und danach auf 8 und halte jeden Namen fest.", "Lies ab, wie viele Elektronen in der Hülle sind und wie sie sich auf die Schalen verteilen."]
  },
  "ak2": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "atombau-isotope", seite: 69,
    kapitel: "Atomkern und Strahlung",
    name: "Isotope",
    titel: "Warum im Periodensystem 35,45 steht",
    frage: "Warum gibt es von demselben Element verschiedene Sorten?",
    auftrag: "Vergleiche die Sorten von Kohlenstoff und Chlor und lies ihre Anteile ab.",
    schritte: ["Stelle 6 Protonen ein und ziehe nur den Neutronenregler auf 6, 7 und 8.", "Halte fest, ob sich dabei der Name des Elements ändert oder nur die Massenzahl.", "Wähle nacheinander Chlor-35 und Chlor-37 und lies beide natürlichen Anteile ab."]
  },
  "ak3": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfallsreihe", seite: 71,
    kapitel: "Atomkern und Strahlung",
    name: "Warum Kerne zerfallen",
    titel: "Der Kern, der es nicht aushält",
    frage: "Warum zerfallen manche Atomkerne von selbst und andere nie?",
    auftrag: "Untersuche in der Nuklidkarte, wo die zerfallenden Kerne liegen und wo Schluss ist.",
    schritte: ["Starte bei Uran-238 und lies ab, wie viele Neutronen auf ein Proton kommen.", "Gehe Schritt für Schritt weiter und beobachte, wohin der Punkt in der Karte wandert.", "Lies beim letzten Kern ab, warum die Reihe dort endet, und vergleiche sein Verhältnis mit dem am Anfang."]
  },
  "ak4": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfallsreihe", seite: 73,
    kapitel: "Atomkern und Strahlung",
    name: "Woher die Strahlung kommt",
    titel: "Strahlung aus dem Kellerfußboden",
    frage: "Woher kommt eine Strahlung, die niemand sehen kann?",
    auftrag: "Untersuche an der Zerfallsreihe, was ein zerfallender Kern dabei aussendet.",
    schritte: ["Gehe die Zerfallsreihe von Uran-238 an Schritt für Schritt durch.", "Halte fest, was bei jedem Schritt aus dem Kern herausfliegt.", "Suche in der Reihe das Nuklid, das ein Gas ist, und lies nach, warum es besonders wichtig ist."]
  },
  "ak5": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "ionisation", seite: 75,
    kapitel: "Atomkern und Strahlung",
    name: "Ionisierende Strahlung",
    titel: "Was die Strahlung im Gewebe anrichtet",
    frage: "Was macht radioaktive Strahlung mit dem Stoff, durch den sie hindurchgeht?",
    auftrag: "Vergleiche, wie dicht die drei Strahlungsarten auf ihrem Weg Atome zerlegen.",
    schritte: ["Wähle Alphastrahlung und lies Energie, Reichweite und Ionenpaare je Millimeter ab.", "Wechsle zu Betastrahlung und danach zu Gammastrahlung und notiere dieselben Werte.", "Lies bei jeder Art den Wichtungsfaktor ab, mit dem im Strahlenschutz gerechnet wird."]
  },
  "ak6": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "geiger-mueller", seite: 77,
    kapitel: "Atomkern und Strahlung",
    name: "Das Geiger-Müller-Zählrohr",
    titel: "Das Gerät, das die Strahlung hörbar macht",
    frage: "Wie macht man eine Strahlung sichtbar, die man weder sehen noch fühlen kann?",
    auftrag: "Vergleiche die Zählrate ohne Präparat mit der bei verschiedenen Proben.",
    schritte: ["Wähle „ohne Präparat“ und lies ab, wie viele Impulse je Sekunde gezählt werden.", "Wähle nacheinander Paranussmehl, gebrannten Ziegel und Am-241 und notiere jede Rate.", "Lies ab, bei welcher Spannung das Zählrohr arbeitet und wie breit der Auslösebereich ist."]
  },
  "ak7": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "absorption-strahlung", seite: 79,
    kapitel: "Atomkern und Strahlung",
    name: "Alphastrahlung",
    titel: "Ein Blatt Papier reicht",
    frage: "Was ist Alphastrahlung, und wie weit kommt sie?",
    auftrag: "Prüfe, wie viel Alphastrahlung durch Papier, Aluminium und Blei hindurchkommt.",
    schritte: ["Wähle Alphastrahlung und stelle als Absorber Papier ein.", "Lies in der Faustregel-Tabelle ab, was Papier, Aluminium und Blei mit Alphastrahlung machen.", "Vergleiche das mit dem, was dieselben Absorber bei Beta- und Gammastrahlung bewirken."]
  },
  "ak8": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "absorption-strahlung", seite: 81,
    kapitel: "Atomkern und Strahlung",
    name: "Betastrahlung",
    titel: "Wenn Papier nicht mehr genügt",
    frage: "Warum ist Betastrahlung durchdringender als Alphastrahlung?",
    auftrag: "Vergleiche, wie viel Aluminium nötig ist, um Betastrahlung aufzuhalten.",
    schritte: ["Wähle Betastrahlung und stelle als Absorber Papier ein. Halte die Zählrate fest.", "Wechsle zu Aluminium und lies in der Faustregel ab, welche Dicke nötig ist.", "Vergleiche den Wert mit dem, was bei Alphastrahlung schon genügt hat."]
  },
  "ak9": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "absorption-strahlung", seite: 83,
    kapitel: "Atomkern und Strahlung",
    name: "Gammastrahlung",
    titel: "Die Bleitür, die nur die Hälfte schafft",
    frage: "Wieso hält selbst eine dicke Bleiwand Gammastrahlung nicht vollständig auf?",
    auftrag: "Bestimme, wie viel Gammastrahlung durch 6,0 mm Blei hindurchkommt.",
    schritte: ["Wähle Gammastrahlung, stelle Blei als Absorber ein und lies die Dicke ab.", "Lies ab, wie viel Prozent der Strahlung bei 6,0 mm Blei noch durchkommen.", "Lies die Halbwertsdicke ab und überlege, was nach zwei und nach drei solchen Dicken übrig bleibt."]
  },
  "ak10": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "absorption-strahlung", seite: 85,
    kapitel: "Atomkern und Strahlung",
    name: "Abschirmung im Vergleich",
    titel: "Drei Absorber, drei Ergebnisse",
    frage: "Womit kann ich welche Strahlung aufhalten?",
    auftrag: "Prüfe für alle drei Strahlungsarten, welcher Absorber sie aufhält.",
    schritte: ["Stelle nacheinander alle drei Strahlungsarten ein und wähle jeweils Papier als Absorber.", "Wiederhole das mit Aluminium und danach mit Blei.", "Trage die Ergebnisse in die Faustregel-Tabelle ein und vergleiche die drei Zeilen."]
  },
  "ak11": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 85,
    kapitel: "Atomkern und Strahlung",
    name: "Die drei Strahlungsarten unterscheiden",
    titel: "Ein Präparat ohne Beschriftung",
    frage: "Wie unterscheide ich die drei Strahlungsarten voneinander?",
    auftrag: "Untersuche im Datenblatt, welche Eigenschaften jede Strahlungsart eindeutig kennzeichnen.",
    schritte: ["Lies im Datenblatt ab, was jede Strahlungsart aufhält.", "Halte fest, welche Ladung die drei Arten tragen und wie sie sich im Magnetfeld verhalten.", "Überlege dir aus diesen Angaben eine Reihenfolge von Prüfungen für das unbekannte Präparat."]
  },
  "ak12": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfallsreihe", seite: 90,
    kapitel: "Atomkern und Strahlung",
    name: "Zerfallsgleichungen",
    titel: "Aus Uran wird am Ende Blei",
    frage: "Was wird aus einem Kern, nachdem er zerfallen ist?",
    auftrag: "Bestimme für jeden Schritt der Reihe, wie sich Massenzahl und Kernladungszahl ändern.",
    schritte: ["Starte bei Uran-238 und lies die Gleichung des ersten Zerfalls ab.", "Gehe zum nächsten Schritt und halte fest, wie sich A und Z beim Betazerfall ändern.", "Gehe bis ans Ende der Reihe und lies ab, wie viele Alpha- und wie viele Betazerfälle es waren."]
  },
  "ak13": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfall-halbwertszeit", seite: 92,
    kapitel: "Atomkern und Strahlung",
    name: "Halbwertszeit",
    titel: "Der Kern, dem man nicht ansieht, wann er dran ist",
    frage: "Warum kann man nie sagen, wann ein bestimmter Kern zerfällt?",
    auftrag: "Miss, wie viele Kerne nach jeder Halbwertszeit noch übrig sind.",
    schritte: ["Wähle Radon-220 und drücke fünfmal „eine Halbwertszeit weiter“. Notiere jeden Wert.", "Setze zurück und wiederhole den ganzen Durchgang ein zweites Mal.", "Vergleiche beide Reihen miteinander und mit der erwarteten Reihe 100, 50, 25, 12,5 und 6,25."]
  },
  "ak14": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfall-halbwertszeit", seite: 94,
    kapitel: "Atomkern und Strahlung",
    name: "Altersbestimmung mit C-14",
    titel: "Wie alt ist der Mann aus dem Eis",
    frage: "Wie bestimmt man das Alter von Holz, Knochen oder Leder?",
    auftrag: "Bestimme mit der Halbwertszeit von C-14, wie viel nach mehreren Halbwertszeiten übrig ist.",
    schritte: ["Wähle Kohlenstoff-14 und lies seine Halbwertszeit ab.", "Drücke dreimal „eine Halbwertszeit weiter“ und notiere Zeit und übrige Kerne.", "Rechne aus, wie alt eine Probe ist, bei der noch ein Viertel des C-14 vorhanden ist."]
  },
  "ke1": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 101,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Strahlung in der Medizin",
    titel: "Warum Mia die Spritze in einem Bleibehälter holt",
    frage: "Wie hilft radioaktive Strahlung in der Medizin?",
    auftrag: "Vergleiche im Datenblatt, wofür die einzelnen Nuklide eingesetzt werden.",
    schritte: ["Lies im Datenblatt ab, welche Nuklide zum Untersuchen und welche zum Behandeln dienen.", "Vergleiche die Halbwertszeiten und überlege, warum sie so unterschiedlich gewählt sind.", "Halte fest, welche Nuklide im Körper wirken und welche von außen bestrahlen."]
  },
  "ke2": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 103,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Strahlung in der Technik",
    titel: "Der Sensor über dem Fließband",
    frage: "Wo nutzt die Technik radioaktive Strahlung?",
    auftrag: "Untersuche im Datenblatt, welche Eigenschaft der Strahlung jeweils ausgenutzt wird.",
    schritte: ["Lies im Datenblatt ab, welche Strahlungsart bei der Dickenmessung genutzt wird.", "Halte fest, warum bei der Prüfung von Schweißnähten Gammastrahlung nötig ist.", "Vergleiche, welche Anwendungen die Durchdringung nutzen und welche die Schwächung."]
  },
  "ke3": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 105,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Strahlung im Alltag",
    titel: "Die Dosis, die jeder mitbringt",
    frage: "Wie viel Strahlung bekommt ein Mensch in Deutschland im Jahr ab?",
    auftrag: "Bestimme aus dem Datenblatt, woher der größte Anteil der Jahresdosis stammt.",
    schritte: ["Lies im Datenblatt die natürlichen Anteile ab und addiere sie.", "Vergleiche die Summe mit dem zivilisatorischen Anteil.", "Suche heraus, welcher einzelne Beitrag am größten ist, und ordne ihn ein."]
  },
  "ke4": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "strahlenschutz", seite: 112,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Die drei A des Strahlenschutzes",
    titel: "Zwei Schritte zurück sind mehr wert als eine Bleiweste",
    frage: "Womit schütze ich mich am wirksamsten vor Strahlung?",
    auftrag: "Miss, wie sich die Dosis bei größerem Abstand, mit Blei und bei kürzerer Zeit ändert.",
    schritte: ["Stelle 100 cm Abstand, 0 mm Blei und 20 Minuten ein und lies die Dosis ab.", "Verdopple nur den Abstand auf 200 cm und lies die Dosisleistung erneut ab.", "Gehe zurück auf 100 cm und lege stattdessen nur 7 mm Blei dazwischen."]
  },
  "ke5": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kernspaltung", seite: 114,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Kernspaltung",
    titel: "Ein Würfel Uran gegen einen ganzen Güterzug",
    frage: "Wie holt man riesige Energie aus einem winzigen Kern?",
    auftrag: "Bestimme aus der Massenbilanz, wie viel Energie bei einer Spaltung frei wird.",
    schritte: ["Sieh dir die drei Phasen an: anfliegendes Neutron, ²³⁶U, Spaltung.", "Wähle nacheinander alle drei Spaltwege und prüfe jedes Mal die Summen von A und Z.", "Lies den Massenunterschied und die frei werdende Energie je Spaltung ab."]
  },
  "ke6": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kettenreaktion", seite: 116,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Die Kettenreaktion steuern",
    titel: "Die eine Zahl, auf die alles ankommt",
    frage: "Wie verhindert man, dass eine Kettenreaktion außer Kontrolle gerät?",
    auftrag: "Untersuche, wie sich die Zahl der Spaltungen bei verschiedenen Stabstellungen entwickelt.",
    schritte: ["Fahre die Steuerstäbe auf 80 % ein und drücke fünfmal „nächste Generation“.", "Setze zurück, stelle 50 % ein und wiederhole den Durchgang.", "Setze erneut zurück, stelle 20 % ein und vergleiche alle drei Reihen."]
  },
  "ke7": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kettenreaktion", seite: 118,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Vom Reaktor zur Steckdose",
    titel: "Ein Dampfkraftwerk mit ungewöhnlichem Feuer",
    frage: "Wie wird aus der Kernspaltung Strom in meiner Steckdose?",
    auftrag: "Untersuche, über welche Schritte die Energie vom Kern bis zur Leitung gelangt.",
    schritte: ["Lies in der Simulation nach, welche vier Schritte vom Reaktor zur Steckdose führen.", "Halte fest, an welcher Stelle die elektrische Energie tatsächlich entsteht.", "Lies ab, wie viele Spaltungen je Sekunde ein Kraftwerk für 300 Megawatt braucht."]
  },
  "ke8": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 115,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Wenn ein Reaktor außer Kontrolle gerät",
    titel: "Zwei Daten, die niemand vergisst",
    frage: "Was passiert, wenn ein Reaktor außer Kontrolle gerät?",
    auftrag: "Vergleiche im Datenblatt die Ursachen und Folgen der drei schwersten Unfälle.",
    schritte: ["Lies im Datenblatt die drei Unfälle mit ihren Jahreszahlen und Ursachen ab.", "Vergleiche die INES-Stufen und ordne sie der Skala von 0 bis 7 zu.", "Halte fest, welcher Stoff nach einem Unfall am längsten Probleme macht."]
  },
  "ke9": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfall-halbwertszeit", seite: 123,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Endlagerung",
    titel: "Ein Behälter für hunderttausend Jahre",
    frage: "Wohin mit dem Müll, der noch Tausende Jahre strahlt?",
    auftrag: "Bestimme mit der Halbwertszeit, wie lange Plutonium-239 gefährlich bleibt.",
    schritte: ["Wähle Plutonium-239 und lies seine Halbwertszeit ab.", "Drücke fünfmal „eine Halbwertszeit weiter“ und notiere jedes Mal die vergangene Zeit.", "Vergleiche diese Zeiten mit dem Alter der ältesten menschlichen Bauwerke."]
  },
  "ke10": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kernfusion", seite: 125,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Kernfusion",
    titel: "Das Feuer, das seit viereinhalb Milliarden Jahren brennt",
    frage: "Woher nimmt die Sonne ihre Energie?",
    auftrag: "Bestimme aus der Massenbilanz, wie viel Energie beim Aufbau eines Heliumkerns frei wird.",
    schritte: ["Stelle 5 Millionen Grad ein und beobachte eine halbe Minute lang, was geschieht.", "Erhöhe schrittweise und halte fest, ab welcher Temperatur der erste Heliumkern entsteht.", "Stelle 15 Millionen Grad ein und lies die Massenbilanz und die Energie je Baustein ab."]
  },
  "ke11": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 121,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Kernenergie bewerten",
    titel: "Zwei Listen und eine eigene Entscheidung",
    frage: "Ist Kernenergie eher ein Segen oder eher eine Gefahr?",
    auftrag: "Vergleiche im Datenblatt die Argumente beider Seiten miteinander.",
    schritte: ["Lies im Datenblatt beide Spalten vollständig durch.", "Ordne jedes Argument einem der Bereiche Klima, Sicherheit, Müll oder Kosten zu.", "Suche das Argument heraus, das für dich am schwersten wiegt, und notiere warum."]
  },
  "oi1": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "licht-oberflaeche", seite: 5,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was passiert, wenn Licht auf eine Oberfläche trifft?",
    titel: "Zwei Kisten ohne Beschriftung",
    frage: "Was macht eine Oberfläche mit dem Licht, das auf sie trifft?",
    auftrag: "Vergleiche bei allen vier Oberflächen, welcher Anteil des Lichts zurückkommt, hindurchgeht und geschluckt wird.",
    schritte: ["Wähle nacheinander die vier Oberflächen Spiegel, Fensterglas, schwarzes Papier und weißes Papier.", "Lies in der Statuszeile die drei Prozentzahlen für zurück, hindurch und geschluckt ab.", "Stelle den Winkel zum Lot von 0° bis 80° ein und beobachte, ob sich die Anteile ändern."]
  },
  "oi2": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "spiegelbild", seite: 7,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo steht das Bild hinter dem Spiegel?",
    titel: "Der Handspiegel mit Holzgriff",
    frage: "Wie weit hinter dem Spiegel liegt das Bild des Gegenstands?",
    auftrag: "Bestimme für verschiedene Abstände g, wie weit das Bild hinter dem Spiegel liegt.",
    schritte: ["Stelle den Abstand g nacheinander auf 40, 80, 110 und 200 ein.", "Lies in der Statuszeile ab, wie weit das Bild hinter dem Spiegel liegt.", "Wähle bei der Frage nach dem Bildort die Antwort „Gleich weit hinter dem Spiegel wie der Gegenstand davor“ und lies die Rückmeldung."]
  },
  "oi3": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "reflexionsgesetz", seite: 9,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Nach welcher Regel wird Licht am Spiegel zurückgeworfen?",
    titel: "Der Lichtfleck an der Wand",
    frage: "Nach welcher Regel wirft der Spiegel einen Lichtstrahl zurück?",
    auftrag: "Untersuche, wie Einfallswinkel und Reflexionswinkel zusammenhängen und was beim Drehen des Spiegels geschieht.",
    schritte: ["Stelle den Einfallswinkel zum Lot nacheinander auf 0°, 20°, 40° und 80° ein.", "Lies nach jeder Einstellung in der Statuszeile den Reflexionswinkel ab.", "Stelle den Einfallswinkel wieder auf 40°, dann den Regler „Spiegel drehen“ auf 25°, und lies ab, um wie viel Grad der Strahl schwenkt."]
  },
  "oi4": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "brechung-eintritt", seite: 11,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum knickt der Lichtstrahl beim Eintritt ins Glas?",
    titel: "Der halbrunde Glasklotz",
    frage: "An welcher Stelle knickt der Strahl, und wohin knickt er?",
    auftrag: "Untersuche, wie groß der Winkel im Glas ist, wenn du den Winkel in der Luft veränderst.",
    schritte: ["Stelle den Winkel in der Luft nacheinander auf 0°, 40° und 75° ein.", "Lies in der Statuszeile den zugehörigen Winkel im Glas ab.", "Drücke „↓ genau auf das Lot“ und beobachte, ob der Strahl dann noch knickt."]
  },
  "oi5": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "brechung-austritt", seite: 13,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was passiert beim Austritt aus dem Glas?",
    titel: "Ein Glasklotz wird zum Spiegel",
    frage: "Wann tritt Licht aus dem Glas aus, und wann bleibt es darin gefangen?",
    auftrag: "Bestimme den Winkel im Glas, ab dem kein Licht mehr in die Luft austritt.",
    schritte: ["Stelle den Winkel im Glas auf 0° ein und lies ab, welcher Winkel in der Luft angezeigt wird.", "Stelle nacheinander 20° und 25° ein und vergleiche die beiden Winkel in der Luft.", "Stelle 55° ein und beobachte die Statuszeile, während du den Winkel im Glas weiter bis 70° vergrößerst."]
  },
  "oi6": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "totalreflexion", seite: 15,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie kommt Licht durch eine gebogene Faser?",
    titel: "Ein Bündel dünner Glasfäden",
    frage: "Warum bleibt das Licht in einer gebogenen Glasfaser gefangen?",
    auftrag: "Untersuche, bei welchen Winkeln das Licht im Lichtleiter bleibt und bei welchen es austritt.",
    schritte: ["Stelle den Einfallswinkel an der Wand auf 85° ein und beobachte den Weg des Lichts im Glasstab.", "Stelle nacheinander 60°, 40° und 20° ein und beobachte, wann im Bild „Licht tritt aus“ steht.", "Vergleiche, wie das Licht bei 60° und bei 20° durch den Stab läuft."]
  },
  "oi7": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "sammellinse", seite: 17,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Welches Glas bündelt das Licht, welches nicht?",
    titel: "Zwei geschliffene Gläser ohne Aufschrift",
    frage: "Welches Glas bündelt paralleles Licht, und welches nicht?",
    auftrag: "Vergleiche, wohin die parallelen Strahlen hinter den beiden Gläsern laufen.",
    schritte: ["Stelle das Glas auf „in der Mitte dicker“ ein und lies ab, wo sich die Strahlen treffen.", "Stelle die Brennweite nacheinander auf 45, 90 und 150 ein und vergleiche, wie weit der Brennpunkt vom Glas entfernt liegt.", "Stelle das Glas auf „in der Mitte dünner“ ein und beobachte, wohin die Strahlen jetzt laufen."]
  },
  "oi8": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "bild-linse", seite: 19,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo entsteht das Bild einer Linse?",
    titel: "Das zerlegte Fernrohr auf dem Tisch",
    frage: "Wovon hängt es ab, ob das Bild vergrößert oder umgekehrt ist?",
    auftrag: "Untersuche, wie sich das Bild ändert, wenn du den Gegenstand näher an die Linse schiebst.",
    schritte: ["Stelle die Gegenstandsweite g auf 190 ein und lies die Statuszeile ab.", "Stelle nacheinander 124 und 100 ein und vergleiche jedes Mal Größe und Lage des Bildes.", "Stelle 25 ein und beobachte, wie das Bild jetzt steht."]
  },
  "oi9": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "lupe", seite: 21,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum vergrößert eine Lupe?",
    titel: "Das Glas mit dem Griff",
    frage: "Wann vergrößert die Lupe – und wann kippt das Bild um?",
    auftrag: "Untersuche, wie sich die Vergrößerung ändert, wenn du den Abstand g vergrößerst.",
    schritte: ["Stelle den Regler „Abstand Gegenstand–Lupe g“ auf 10 und lies in der Statuszeile die Vergrößerung ab.", "Stelle nacheinander 32 und 48 ein und halte jedes Mal die Zahl vor „-fache Vergrößerung“ fest.", "Schiebe g auf 60 – über die Brennweite f = 58 hinaus – und lies Statuszeile und Bildtext ab."]
  },
  "oi10": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "auge", seite: 23,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entsteht ein Bild im Auge?",
    titel: "Das aufklappbare Augenmodell",
    frage: "Wo entsteht das Bild im Auge – und wie bleibt es scharf?",
    auftrag: "Untersuche, wie sich Linse und Pupille ändern, wenn du Abstand und Helligkeit verstellst.",
    schritte: ["Schiebe den Regler „Abstand des Gegenstands“ ganz nach rechts (weit) und lies in der Statuszeile ab, wie die Linse beschrieben wird.", "Schiebe denselben Regler ganz nach links (nah) und vergleiche Statuszeile und Wölbung der Linse im Bild.", "Schiebe den Regler „Pupille (Helligkeit)“ erst ganz nach links, dann ganz nach rechts, und lies jedes Mal die Statuszeile ab."]
  },
  "oi11": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "brille", seite: 25,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie hilft eine Brille beim Scharfsehen?",
    titel: "Zwei Brillen ohne Etikett",
    frage: "Welche Linse gehört zu welchem Sehfehler?",
    auftrag: "Prüfe für beide Sehfehler, wo das Bild ohne Brille liegt und was die Brille daran ändert.",
    schritte: ["Wähle „kurzsichtig“ und lies in der Statuszeile ab, wo das Bild liegt und welche Linse nötig ist.", "Drücke „Brille“ und vergleiche Statuszeile und Beschriftung am Bild mit dem Zustand vorher.", "Wähle „weitsichtig“, drücke wieder „Brille“ und vergleiche beide Meldungen."]
  },
  "oi12": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "lochkamera", seite: 27,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie macht eine Kamera ein Bild ohne Linse?",
    titel: "Die Pappkiste mit dem Nadelloch",
    frage: "Wie sieht das Bild aus, das ein kleines Loch auf den Schirm wirft?",
    auftrag: "Untersuche, wie Bildgröße und Schärfe von der Bildweite b und der Lochgröße abhängen.",
    schritte: ["Stelle bei einer Gegenstandsweite von g = 40 cm die Bildweite b auf 29 cm und lies die Statuszeile ab.", "Stelle b nacheinander auf 39 cm und auf 51 cm und vergleiche jedes Mal die Länge der beiden Pfeile.", "Schiebe den Regler „Lochgröße“ ganz nach rechts (groß) und beobachte, wie sich Statuszeile und Pfeil auf dem Schirm ändern."]
  },
  "oi13": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "prisma", seite: 29,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Woraus besteht weißes Licht?",
    titel: "Der Glaskeil in der Schublade",
    frage: "Macht das Prisma die Farben – oder stecken sie schon im weißen Licht?",
    auftrag: "Untersuche, was das Prisma mit weißem Licht macht und was mit einer einzelnen Farbe.",
    schritte: ["Wähle weißes Licht und lies in der Statuszeile ab, was mit dem Strahl passiert.", "Drücke nur Rot und beobachte, ob sich hinter dem Prisma noch etwas auffächert.", "Vergleiche das Ergebnis mit nur Blau und achte dabei auf die Beschriftung im Bild."]
  },
  "oi14": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "farbmischung-additiv", seite: 31,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entstehen die Farben auf einem Bildschirm?",
    titel: "Die Lupe auf dem Bildschirm",
    frage: "Wie entsteht Weiß, wenn dort nur rote, grüne und blaue Punkte leuchten?",
    auftrag: "Untersuche, welche Farbe entsteht, wenn du Rot, Grün und Blau verschieden hell mischst.",
    schritte: ["Lies zuerst im Statusfeld die Ergebnisfarbe des Ausgangszustands mit ihren drei Zahlen ab.", "Drücke danach aus und anschließend Gelb und notiere jedes Mal alle drei Werte.", "Schiebe den Regler Blau von 0 auf 255 und vergleiche das Ergebnis mit dem Knopf Weiß."]
  },
  "oi15": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "spektrum-unsichtbar", seite: 33,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Welches Licht sehen wir nicht?",
    titel: "Das Thermometer mit der schwarzen Kugel",
    frage: "Kommt hinter dem letzten Rot noch etwas an, das man nicht sehen kann?",
    auftrag: "Miss an mehreren Stellen des Spektrums, wie stark es wärmt und ob das Auge dort etwas sieht.",
    schritte: ["Drücke 555 nm – Grün und lies den Bereich und die Erwärmung ab.", "Wähle nacheinander 310 nm, 700 nm und 940 nm und notiere jedes Mal beide Angaben.", "Stelle den Regler auf 1100 nm ein und vergleiche die Erwärmung mit den anderen Werten."]
  },
  "ew1": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "himmelskoerper", seite: 43,
    kapitel: "Der Blick ins Weltall",
    name: "Was leuchtet da eigentlich am Nachthimmel?",
    titel: "Ein Karton voller Sternkarten",
    frage: "Welche Körper am Himmel leuchten selbst und welche werden beleuchtet?",
    auftrag: "Untersuche mit der Blende, welche Himmelskörper ohne Sonnenlicht weiterleuchten.",
    schritte: ["Wähle nacheinander Sonne, Stern, Mond und Planet und lies jedes Mal die Statuszeile darunter ab.", "Drücke Sonnenlicht abdecken und wähle danach noch einmal jeden der vier Körper: Wer wird sofort dunkel, wer strahlt weiter?", "Vergleiche mit ↺ Zurücksetzen den hellen Zustand noch einmal mit dem abgedeckten."]
  },
  "ew2": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "tag-nacht", seite: 45,
    kapitel: "Der Blick ins Weltall",
    name: "Warum ist es nicht überall gleichzeitig hell?",
    titel: "Der staubige Globus neben dem Schrank",
    frage: "Wovon hängt es ab, ob es an einem Ort gerade Tag oder Nacht ist?",
    auftrag: "Untersuche, wie sich Tag und Nacht bei Ben und Yumi ändern, wenn du den Globus Vierteldrehung für Vierteldrehung weiterdrehst.",
    schritte: ["Drücke ⏯ Pause, damit der Globus stehen bleibt und du in Ruhe ablesen kannst.", "Stelle den Regler „Erde von Hand drehen“ nacheinander auf 0°, 90°, 180° und 270° ein.", "Lies bei jeder Stellung die Statuszeile ab und notiere, wer gerade Sonne hat: Ben oder Yumi."]
  },
  "ew3": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "gravitation", seite: 47,
    kapitel: "Der Blick ins Weltall",
    name: "Warum fällt alles nach unten?",
    titel: "Zwei Glasrohre aus dem Sammlungsschrank",
    frage: "Fallen Stein und Feder gleich schnell, wenn keine Luft im Rohr ist?",
    auftrag: "Vergleiche auf Mond, Erde und Jupiter die Fallzeit im luftleeren Rohr und beobachte dabei die Feder im Rohr mit Luft.",
    schritte: ["Drücke Noch einmal fallen lassen und beobachte beide Rohre gleichzeitig: links ohne Luft, rechts mit Luft.", "Wähle nacheinander Mond, Erde und Jupiter und lies in der Statuszeile die Fallbeschleunigung und die Fallzeit ab.", "Vergleiche im linken Rohr die Abstände zwischen den gestrichelten Linien 1 bis 4."]
  },
  "ew4": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "gravitation-abstand", seite: 49,
    kapitel: "Der Blick ins Weltall",
    name: "Wovon hängt die Stärke der Anziehung ab?",
    titel: "Zwei Messingkugeln in der Schublade",
    frage: "Was wirkt stärker: die doppelte Masse oder der doppelte Abstand?",
    auftrag: "Untersuche, wie sich die Anziehung ändert, wenn du die Massen und wenn du den Abstand verdoppelst.",
    schritte: ["Lies zuerst den Ausgangswert in der Statuszeile ab: beide Massen stehen auf 1, der Abstand auf 1.", "Drücke ×2 Masse links, danach ×2 Abstand, und lies nach jedem Druck die Anziehung ab.", "Drücke ↺ zurücksetzen und stelle dann beide Massenregler nacheinander auf 5."]
  },
  "ew5": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "planetenbahn", seite: 51,
    kapitel: "Der Blick ins Weltall",
    name: "Warum stürzen die Planeten nicht in die Sonne?",
    titel: "Der Bogen mit den Bahnen",
    frage: "Warum stürzt ein Planet nicht in die Sonne, obwohl sie ihn anzieht?",
    auftrag: "Untersuche, wie die Bahnform vom Anschub quer zur Sonne abhängt.",
    schritte: ["Drücke ganz klein und beobachte, wohin der Planet läuft.", "Drücke nacheinander mittlerer Wert, etwas darüber und Gegenprobe groß und lies jedes Mal die Bahnform in der Statuszeile ab.", "Vergleiche deine Werte mit der letzten Zeile der Anzeige: Für einen Kreis braucht er 29,8 km/s, ab 42,1 km/s entkommt er."]
  },
  "ew6": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "sonnensystem", seite: 53,
    kapitel: "Der Blick ins Weltall",
    name: "Was unterscheidet die acht Planeten voneinander?",
    titel: "Acht gleich große Kugeln",
    frage: "Was unterscheidet die inneren Planeten von den äußeren?",
    auftrag: "Untersuche in den Ansichten Steckbrief, Größen, Abstände und Umlauf, was die acht Planeten unterscheidet.",
    schritte: ["Drücke Steckbrief und lies für die Erde Sorte, Durchmesser, Abstand und Umlauf ab.", "Drücke Größen und danach Abstände und beobachte, was im Bild jeweils gestaucht wird; lies dazu den Hinweis unter dem Bild.", "Drücke Umlauf und dazu sehr schnell und vergleiche, wie oft die inneren und wie oft die äußeren Planeten herumkommen."]
  },
  "ew7": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "entfernungen", seite: 55,
    kapitel: "Der Blick ins Weltall",
    name: "Wie groß ist das Sonnensystem wirklich?",
    titel: "Ein Wort auf der Rückseite",
    frage: "Wie lange braucht das Licht von immer ferneren Zielen bis zur Erde?",
    auftrag: "Bestimme für vier Ziele, wie lange das Licht bis zur Erde unterwegs ist.",
    schritte: ["Drücke Lichtblitz senden und beobachte, wie lange der Blitz von der Erde bis zum Mond unterwegs ist.", "Drücke weiter und lies in der Statuszeile die Entfernung und die Laufzeit des Lichts ab.", "Vergleiche die Laufzeiten, indem du dich mit weiter Schritt für Schritt bis zu den fernsten Zielen vorarbeitest."]
  },
  "ew8": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "teleskop", seite: 57,
    kapitel: "Der Blick ins Weltall",
    name: "Wie holt ein Fernrohr Fernes heran?",
    titel: "Zwei Linsen und ein Rohr",
    frage: "Wie verändert ein Fernrohr Größe, Lage und Helligkeit des Bildes?",
    auftrag: "Vergleiche das Mondbild mit bloßem Auge und durch das Teleskop bei beiden Öffnungen.",
    schritte: ["Drücke bloßes Auge und beobachte, wie groß der Mond ist und wie herum die gelbe Marke steht.", "Drücke mit Teleskop und lies in der Statuszeile die Vergrößerung ab; achte dabei wieder auf die gelbe Marke.", "Vergleiche große Öffnung mit kleine Öffnung und beobachte dabei nur die Helligkeit des Bildes."]
  },
  "ew9": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "sternparallaxe", seite: 59,
    kapitel: "Der Blick ins Weltall",
    name: "Wie misst man die Entfernung zu einem Stern?",
    titel: "Kein Maßband bis zum Stern",
    frage: "Wie hängt der gemessene Winkel mit der Entfernung eines Sterns zusammen?",
    auftrag: "Vergleiche bei vier Sternen den gemessenen Winkel und die Entfernung miteinander.",
    schritte: ["Drücke Proxima Centauri und lies in der Statuszeile den Winkel p und die Entfernung in Parsec ab.", "Vergleiche damit 61 Cygni und Wega und notiere jedes Mal beide Zahlen.", "Wähle Polarstern und drücke danach Lupe ×100, damit der winzige Sprung im Bild sichtbar wird."]
  },
  "ew10": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "sternleben", seite: 61,
    kapitel: "Der Blick ins Weltall",
    name: "Warum leuchtet ein Stern - und wie lange?",
    titel: "Die Randnotiz auf der Sternkarte",
    frage: "Lebt ein schwerer Stern länger als ein leichter?",
    auftrag: "Untersuche, wie die Masse eines Sterns seine Lebensdauer, seine Farbe und sein Ende bestimmt.",
    schritte: ["Drücke 1 und beobachte im Bild den ganzen Lebenslauf von der Gaswolke bis zum Ende.", "Wähle nacheinander 0,5 und 10 und lies jedes Mal Lebensdauer, Farbe und Ende in der Statuszeile ab.", "Drücke Gegenprobe 25 und vergleiche die Lebensdauer mit den drei Sternen davor."]
  },
  "ew11": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "milchstrasse", seite: 63,
    kapitel: "Der Blick ins Weltall",
    name: "Wo stehen wir in der Milchstraße?",
    titel: "Das blasse Band auf der Sternkarte",
    frage: "Steht die Sonne in der Mitte der Milchstraße oder irgendwo dazwischen?",
    auftrag: "Vergleiche, wie viele Sterne in drei verschiedenen Blickrichtungen im Blickfeld stehen.",
    schritte: ["Wähle nacheinander zur Mitte, nach außen und quer heraus und lies jedes Mal die Sterne im Blickfeld ab.", "Drehe die Ansicht mit dem Regler auf von der Seite (90°) und beobachte, wie flach die Scheibe wirklich ist.", "Drücke Gegenprobe: Sonne in die Mitte und vergleiche die Anzeige mit dem Wert davor."]
  },
  "ew12": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "weltbild", seite: 65,
    kapitel: "Der Blick ins Weltall",
    name: "Wer steht in der Mitte? Zwei Weltbilder",
    titel: "Ein vergilbtes Blatt voller Kreise",
    frage: "Welches Weltbild erklärt den Himmel ohne Zusatzkreise?",
    auftrag: "Vergleiche das alte und das heutige Weltbild und prüfe, welches ohne Zusatzkreise auskommt.",
    schritte: ["Drücke „Erde in der Mitte (alt)“ und lies die Statuszeile ab.", "Drücke „Sonne in der Mitte (heute)“ und vergleiche die neue Statuszeile mit der alten.", "Beobachte unten den Streifen: Wie läuft der Mars von der Erde aus gesehen?"]
  },
  "ew13": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "schwarzes-loch", seite: 67,
    kapitel: "Der Blick ins Weltall",
    name: "Wie findet man etwas, das kein Licht aussendet?",
    titel: "Ein Kreis um ein leeres Feld",
    frage: "Woran erkennt man ein schwarzes Loch, wenn es selbst nicht leuchtet?",
    auftrag: "Untersuche, wie sich ein Lichtstrahl in drei verschiedenen Abständen am schwarzen Loch verhält.",
    schritte: ["Drücke „weit weg“ und danach „Lichtstrahl senden“.", "Wähle nacheinander „mittel“ und „sehr nah“ und sende jedes Mal einen Lichtstrahl.", "Lies zu jedem Abstand die Statuszeile ab und vergleiche die drei Wege im Bild."]
  },
  "ew14": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "urknall", seite: 69,
    kapitel: "Der Blick ins Weltall",
    name: "Woher kommt alles? Der Urknall",
    titel: "Die Frage auf der Rückseite",
    frage: "Wie hat sich das Weltall seit dem Urknall verändert?",
    auftrag: "Untersuche, wie sich die Abstände zwischen den Galaxien nach dem Start verändern.",
    schritte: ["Drücke „↺ zum Anfang“ und lies sofort die Zeitanzeige und die Statuszeile ab.", "Drücke „Urknall starten“ und beobachte die Abstände zwischen den Galaxien.", "Vergleiche das Bild am Anfang mit dem Bild am Ende des Ablaufs."]
  },
  "st1": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "ladung", seite: 5,
    kapitel: "Stromkreise verstehen",
    name: "Warum knistert der Pullover beim Ausziehen?",
    titel: "Knistern in der kalten Werkstatt",
    frage: "Wann ziehen sich zwei geladene Kugeln an und wann stoßen sie sich ab?",
    auftrag: "Untersuche, wie sich die beiden Kugeln bei gleicher und bei ungleicher Ladung verhalten.",
    schritte: ["Drücke bei Kugel A „positiv“ und bei Kugel B „negativ“ und lies die Statuszeile ab.", "Drücke nun bei Kugel A „negativ“, sodass beide Kugeln negativ sind, und beobachte das Bild.", "Drücke bei Kugel B „positiv“, danach „↺ Zurücksetzen“, und vergleiche alle vier Statuszeilen."]
  },
  "st2": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "ladungen-kraft", seite: 7,
    kapitel: "Stromkreise verstehen",
    name: "Wie wirken Ladungen aufeinander?",
    titel: "Zwei geladene Kugeln an dünnen Fäden",
    frage: "Wie ändert sich die Kraft zwischen zwei Ladungen, wenn der Abstand wächst?",
    auftrag: "Untersuche, wie Abstand und Ladungsmenge die Kraft zwischen den beiden Kugeln verändern.",
    schritte: ["Lies ab, wie groß die Kraft bei 10 nC und 6,0 cm Abstand ist.", "Drücke „Abstand verdoppeln“ und lies die Kraft bei 12,0 cm ab.", "Stelle ein: Ladung 4 nC, danach 18 nC, und lies jedes Mal die Kraft ab."]
  },
  "st3": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "spannung", seite: 9,
    kapitel: "Stromkreise verstehen",
    name: "Was sagt die Zahl mit dem V auf der Batterie?",
    titel: "Die Zahl mit dem V auf der Zelle",
    frage: "Wie wirkt sich die Spannung der Quelle auf die Helligkeit der Lampe aus?",
    auftrag: "Untersuche, wie sich Spannung und Helligkeit der Lampe ändern, wenn du Zellen dazuschaltest.",
    schritte: ["Drücke „1 Zelle (1,5 V)“ und lies die Spannung am Voltmeter ab.", "Drücke nacheinander „2 Zellen (3 V)“ und „3 Zellen (4,5 V)“ und beobachte die Lampe.", "Vergleiche die drei Spannungen mit der Helligkeit der Lampe."]
  },
  "st4": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "stromstaerke", seite: 11,
    kapitel: "Stromkreise verstehen",
    name: "Wie viel fließt da eigentlich?",
    titel: "Ein Schalter unterbricht den Kreis",
    frage: "Wie groß ist die Stromstärke im Kreis, und wann fließt gar nichts mehr?",
    auftrag: "Miss die Stromstärke bei schwachem, mittlerem und starkem Strom und bei offenem Schalter.",
    schritte: ["Drücke „Strom schwach“ und lies die Stromstärke am Amperemeter ab.", "Drücke nacheinander „mittel“ und „stark“ und beobachte die Lampe.", "Beobachte das Amperemeter, nachdem du mit dem Schalter den Kreis geöffnet hast."]
  },
  "st5": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "messen", seite: 13,
    kapitel: "Stromkreise verstehen",
    name: "Wie schließt man ein Messgerät richtig an?",
    titel: "Zwei Messgeräte an der Werkbank",
    frage: "Wie muss ein Amperemeter, wie ein Voltmeter im Stromkreis liegen?",
    auftrag: "Prüfe, wie ein Amperemeter und wie ein Voltmeter angeschlossen werden müssen.",
    schritte: ["Drücke „Ⓐ Amperemeter“ und lies die Statuszeile und den Wert am Messgerät ab.", "Wähle „Ⓥ Voltmeter“, drücke „in Reihe“ und beobachte die Lampe.", "Drücke „parallel“ und vergleiche diese Anzeige mit der vorherigen."]
  },
  "st6": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "widerstand", seite: 15,
    kapitel: "Stromkreise verstehen",
    name: "Was bremst den Strom?",
    titel: "Drei Bauteile an derselben Batterie",
    frage: "Warum fließt bei gleicher Spannung durch jedes Bauteil ein anderer Strom?",
    auftrag: "Vergleiche die Stromstärken bei drei verschiedenen Widerständen und gleicher Spannung.",
    schritte: ["Drücke „kleiner Widerstand“ und lies Widerstand und Stromstärke in der Statuszeile ab.", "Wähle danach „mittel“ und „großer Widerstand“ und notiere jedes Mal beide Werte.", "Vergleiche die drei Stromstärken bei der gleichen Spannung von 4,5 V."]
  },
  "st7": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "draht", seite: 17,
    kapitel: "Stromkreise verstehen",
    name: "Wovon hängt der Widerstand eines Drahtes ab?",
    titel: "Drahtrollen aus der Restekiste",
    frage: "Wovon hängt es ab, wie stark ein Draht den Strom bremst?",
    auftrag: "Untersuche, wie Länge, Dicke und Material den Widerstand eines Drahtes verändern.",
    schritte: ["Drücke „lang“ und lies ab, wie sich Widerstand und Stromstärke gegenüber „kurz“ ändern.", "Drücke „dünn“ und lies den neuen Widerstand und die neue Stromstärke ab.", "Vergleiche bei diesem Draht die Materialien Kupfer, Eisen und Konstantan."]
  },
  "st8": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "ohm-kennlinie", seite: 19,
    kapitel: "Stromkreise verstehen",
    name: "Wie hängen Spannung, Stromstärke und Widerstand zusammen?",
    titel: "Eine Gerade aus Messpunkten",
    frage: "Wie ändert sich die Stromstärke, wenn die Spannung verdoppelt wird?",
    auftrag: "Miss bei festem Widerstand die Stromstärke zu zwei Spannungen und vergleiche beide Werte.",
    schritte: ["Drücke „20 Ω“, stelle mit „weniger“ 1,5 V ein und drücke „Messpunkt“.", "Stelle mit „mehr“ 3 V ein, drücke erneut „Messpunkt“ und vergleiche beide Tabellenzeilen.", "Drücke „10 Ω“ und lies ab, welche Stromstärke jetzt bei 3 V fließt."]
  },
  "st9": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "reihe-widerstand", seite: 21,
    kapitel: "Stromkreise verstehen",
    name: "Was passiert, wenn alles hintereinander hängt?",
    titel: "Die Lichterkette an der Werkbank",
    frage: "Wie verändert ein zweiter Widerstand in Reihe den Strom im Stromkreis?",
    auftrag: "Untersuche, wie sich Gesamtwiderstand, Strom und Teilspannungen ändern, wenn du die beiden Widerstände in der Reihenschaltung veränderst.",
    schritte: ["Lies ab, welchen Gesamtwiderstand und welchen Strom die Statuszeile in der Grundstellung mit 10 Ω und 20 Ω anzeigt.", "Wähle für den ersten Widerstand nacheinander 20 Ω und 30 Ω, stelle danach auch den zweiten auf 30 Ω und notiere jedes Mal R_ges und I.", "Vergleiche die beiden Teilspannungen U₁ und U₂ mit den 6 V der Quelle."]
  },
  "st10": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "parallel-widerstand", seite: 23,
    kapitel: "Stromkreise verstehen",
    name: "Warum bleibt das Licht an, wenn eine Lampe ausfällt?",
    titel: "Eine Lampe fällt aus",
    frage: "Wie verteilen sich Spannung und Strom auf zwei parallele Widerstände?",
    auftrag: "Untersuche, wie sich Gesamtstrom und Gesamtwiderstand ändern, wenn du die beiden parallel geschalteten Widerstände veränderst.",
    schritte: ["Lies ab, welche Zweigströme und welchen Gesamtstrom die Statuszeile mit R₁ = 10 Ω und R₂ = 20 Ω anzeigt.", "Wähle für R₁ nacheinander 20 Ω und 30 Ω und notiere jedes Mal I₁, I₂ und den Gesamtstrom.", "Vergleiche den angezeigten Gesamtwiderstand R_ges mit dem kleineren der beiden Einzelwiderstände."]
  },
  "st11": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "elektronen-drift", seite: 25,
    kapitel: "Stromkreise verstehen",
    name: "Was bewegt sich im Draht wirklich?",
    titel: "Sofort hell trotz drei Metern Kabel",
    frage: "Wie schnell wandern die Elektronen im Draht wirklich?",
    auftrag: "Bestimme, wie schnell die Elektronen im Kupferdraht wandern, und vergleiche das mit der Geschwindigkeit des Anstoßes in der Leitung.",
    schritte: ["Lies ab, welche Wandergeschwindigkeit die Simulation für die Leselampe mit I = 1,0 A und A = 1,50 mm² anzeigt.", "Drücke „Wasserkocher“ und vergleiche die neue Wandergeschwindigkeit mit dem Wert der Leselampe.", "Wähle mit dem Regler die kleinste Stromstärke 0,1 A und lies ab, wie lange ein Elektron dann für einen Meter Kabel braucht."]
  },
  "st12": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "blitz", seite: 27,
    kapitel: "Stromkreise verstehen",
    name: "Was passiert bei einem Blitz?",
    titel: "Gewitter über dem Schulhof",
    frage: "Ab wann schlägt ein Blitz durch, und warum kommt der Donner später?",
    auftrag: "Untersuche, ab welcher Feldstärke die Luft leitend wird, und bestimme, wie lange der Donner aus 3,0 km Entfernung braucht.",
    schritte: ["Lies in der Grundstellung bei 120 kV/m ab, wie viel bis zur Schwelle fehlt, und stelle den Regler danach auf 250 kV/m.", "Drücke „knapp darunter“ und danach „knapp darüber“ und beobachte, wann die Luft leitend wird.", "Lies ab, wie lange der Donner bei 3,0 km Entfernung braucht, und vergleiche das mit der Faustregel drei Sekunden je Kilometer."]
  },
  "st13": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "elektrische-leistung", seite: 29,
    kapitel: "Stromkreise verstehen",
    name: "Wie viel Energie braucht ein Gerät?",
    titel: "Zwei Lampen an einem Netzteil",
    frage: "Wie ändert sich die Leistung, wenn Spannung oder Stromstärke größer werden?",
    auftrag: "Untersuche, wie sich die Leistung ändert, wenn du Spannung und Verbraucher wechselst.",
    schritte: ["Drücke nacheinander 1,5 V, 3 V und 6 V und lies jedes Mal Stromstärke und Leistung ab.", "Wähle bei 6 V nacheinander wenig Strom, mittel und viel Strom.", "Vergleiche die drei Leistungen bei 6 V miteinander."]
  },
  "st14": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "stromgefahren", seite: 31,
    kapitel: "Stromkreise verstehen",
    name: "Wo wird Strom im Haushalt gefährlich?",
    titel: "Zu viel an einer Steckdose",
    frage: "Wann unterbricht die Sicherung den Stromkreis?",
    auftrag: "Untersuche, bei wie vielen Geräten die Sicherung den Stromkreis unterbricht.",
    schritte: ["Lies ab, wie viel Strom ein Gerät zieht und wo die Grenze der Sicherung liegt.", "Drücke mehrmals „Gerät anschließen“ und beobachte nach jedem Gerät die Stromstärke.", "Vergleiche den Strom mit der Grenze und beobachte, wann die Sicherung eingreift."]
  },
  "be1": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-begriff", seite: 41,
    kapitel: "Bewegungen beschreiben",
    name: "Wer ist schneller - und woran misst man das?",
    titel: "Das Wettrennen auf dem Schulhof",
    frage: "Woran erkennst du, welches der beiden Autos wirklich schneller ist?",
    auftrag: "Untersuche mit verschiedenen Tempo-Einstellungen, wann Auto A und wann Auto B schneller ist.",
    schritte: ["Wähle für Auto A das Tempo langsam und für Auto B das Tempo schnell.", "Drücke „Rennen starten“ und beobachte, welches Auto am Ziel weiter vorne ist.", "Vergleiche die Statuszeile mit der Meldung, wenn beide Autos auf schnell stehen."]
  },
  "be2": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-messen", seite: 43,
    kapitel: "Bewegungen beschreiben",
    name: "Wie misst man eine Geschwindigkeit?",
    titel: "Zehn Meter und eine Stoppuhr",
    frage: "Welche zwei Größen musst du messen, um eine Geschwindigkeit zu bestimmen?",
    auftrag: "Bestimme aus der Messstrecke und der gestoppten Zeit die Geschwindigkeit des Wagens.",
    schritte: ["Wähle das Tempo langsam und drücke „Messung starten“.", "Beobachte die Stoppuhr, während der Wagen die Messstrecke von 10 m abfährt.", "Vergleiche das Ergebnis, indem du zurücksetzt, das Tempo schnell wählst und erneut misst."]
  },
  "be3": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-formel", seite: 45,
    kapitel: "Bewegungen beschreiben",
    name: "Wie rechnet man aus Weg und Zeit die Geschwindigkeit?",
    titel: "Der Rechenzettel an der Werkbank",
    frage: "Wie ändert sich v, wenn du die Strecke verdoppelst oder die Zeit halbierst?",
    auftrag: "Untersuche, wie sich die berechnete Geschwindigkeit ändert, wenn du Strecke oder Zeit veränderst.",
    schritte: ["Wähle die Strecke 100 m und die Zeit 10 s und lies die Statuszeile ab.", "Stelle die Strecke auf 200 m um und vergleiche den neuen Wert von v.", "Wähle danach die Zeit 5 s und beobachte, was mit der Geschwindigkeit passiert."]
  },
  "be4": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-umrechnung", seite: 47,
    kapitel: "Bewegungen beschreiben",
    name: "Warum steht auf dem Schild km/h und im Heft m/s?",
    titel: "Tacho und Heft widersprechen sich",
    frage: "Wie rechnest du eine Geschwindigkeit von m/s in km/h um – und wieder zurück?",
    auftrag: "Vergleiche die beiden Anzeigen bei verschiedenen Geschwindigkeiten und bestimme den Umrechnungsfaktor.",
    schritte: ["Lies im Ausgangszustand beide Anzeigen ab: links den Wert in m/s, rechts den in km/h.", "Drücke „langsamer“ und beobachte, wie sich beide Zahlen zugleich ändern.", "Vergleiche die Voreinstellungen Fußgänger, Radfahrer, Auto (Stadt) und ICE miteinander."]
  },
  "be5": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "gleichfoermig-rs", seite: 49,
    kapitel: "Bewegungen beschreiben",
    name: "Was heißt gleichförmige Bewegung?",
    titel: "Kreidestriche auf dem Schulhof",
    frage: "Wie liegen die Sekunden-Marken, wenn die Geschwindigkeit gleich bleibt?",
    auftrag: "Untersuche die Abstände der Sekunden-Marken innerhalb einer Fahrt und vergleiche sie bei den drei Geschwindigkeiten.",
    schritte: ["Wähle „langsam“ und drücke Fahren.", "Lies ab, welchen Wert v die Statuszeile zeigt, und beobachte die Abstände der Marken.", "Vergleiche das mit den Durchgängen für „mittel“ und „schnell“."]
  },
  "be6": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "weg-zeit-diagramm", seite: 51,
    kapitel: "Bewegungen beschreiben",
    name: "Was verrät ein Zeit-Weg-Diagramm?",
    titel: "Linien an der Werkstattwand",
    frage: "Was verrät die Steilheit der Linie im Weg-Zeit-Diagramm über die Fahrt?",
    auftrag: "Vergleiche die Linien im Weg-Zeit-Diagramm für eine langsame Fahrt, eine schnelle Fahrt und eine Fahrt mit Pause.",
    schritte: ["Wähle „langsam“, drücke Fahren und beobachte, wie steil die Linie im s-t-Diagramm steigt.", "Wähle „schnell“, drücke erneut Fahren und vergleiche die Steilheit mit dem ersten Durchgang.", "Wähle „mit Pause“, drücke Fahren und beobachte die Linie, während der Wagen auf der Fahrbahn steht."]
  },
  "be7": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "beschleunigung-rs", seite: 53,
    kapitel: "Bewegungen beschreiben",
    name: "Was passiert beim Anfahren und Bremsen?",
    titel: "Anfahren und Bremsen am Hoftor",
    frage: "Wie ändern sich die Sekunden-Marken beim Beschleunigen und beim Bremsen?",
    auftrag: "Untersuche, wie sich die Abstände der Sekunden-Marken beim Beschleunigen und beim Bremsen verändern.",
    schritte: ["Drücke beschleunigen, starte mit Fahren und beobachte die Abstände der Sekunden-Marken.", "Drücke bremsen, fahre erneut und vergleiche die Marken mit dem ersten Durchgang.", "Lies ab, was die Statuszeile zu jeder der beiden Fahrten meldet."]
  },
  "be8": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-zeit-diagramm", seite: 55,
    kapitel: "Bewegungen beschreiben",
    name: "Was verrät ein Zeit-Geschwindigkeit-Diagramm?",
    titel: "Die Linie steigt und fällt",
    frage: "Was bedeuten steigende, waagerechte und fallende Linien im v-t-Diagramm?",
    auftrag: "Untersuche, wie sich die Linie im v-t-Diagramm bei konstanter Fahrt, beim Beschleunigen und beim Bremsen verändert.",
    schritte: ["Wähle konstant und drücke Fahren. Beobachte die Linie und die Anzeige v jetzt.", "Wähle beschleunigen, drücke Fahren und lies ab, wie sich v jetzt dabei verändert.", "Vergleiche damit den Verlauf bei bremsen und lies dazu die Statuszeile ab."]
  },
  "be9": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "bremsweg-jg9", seite: 57,
    kapitel: "Bewegungen beschreiben",
    name: "Wie weit fährt ein Auto, bis es steht?",
    titel: "Ein Schild für die Einfahrt",
    frage: "Wie verändert sich der Bremsweg, wenn sich die Geschwindigkeit verdoppelt?",
    auftrag: "Vergleiche Reaktionsweg, Bremsweg und Anhalteweg bei 30 km/h, 50 km/h und 100 km/h.",
    schritte: ["Wähle 30 km/h und drücke Gefahr! (Start). Lies Reaktionsweg, Bremsweg und Anhalteweg in der Statuszeile ab.", "Drücke danach 50 km/h und anschließend 100 km/h und lies die drei Wege jedes Mal neu ab.", "Vergleiche die Bremswege bei 50 km/h und bei 100 km/h miteinander."]
  },
  "kf1": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraft-wirkung", seite: 5,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Woran erkennt man, dass eine Kraft wirkt?",
    titel: "Der unsichtbare Schubs",
    frage: "Woran erkennst du, dass eine Kraft gewirkt hat?",
    auftrag: "Untersuche, welche drei Wirkungen eine Kraft an den Körpern der Simulation auslöst.",
    schritte: ["Wähle „Verformen“ und drücke auf „Kraft wirken lassen“. Beobachte die Knete.", "Drücke „Bewegen“, dann „Kraft wirken lassen“, und lies die Statuszeile ab.", "Vergleiche damit „Richtung ändern“: Was meldet die Statuszeile über den rollenden Ball?"]
  },
  "kf2": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraftmesser", seite: 7,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Wie misst man eine Kraft?",
    titel: "Was der Zeiger verrät",
    frage: "Wie kannst du eine Kraft messen, obwohl du sie nicht sehen kannst?",
    auftrag: "Miss mit dem Federkraftmesser, wie groß die Kraft angehängter Gewichte ist.",
    schritte: ["Beobachte die Feder ohne Last und lies den Wert in der Statuszeile ab.", "Drücke einmal auf „Gewicht anhängen (1 N)“ und lies Kraft und Dehnung ab.", "Vergleiche: Hänge zwei weitere Gewichte an und lies den Zeiger auf der Skala ab."]
  },
  "kf3": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "federgesetz", seite: 9,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum geben zwei Federn nicht gleich nach?",
    titel: "Weicher Puffer, harter Puffer",
    frage: "Warum gibt die harte Feder bei gleicher Kraft weniger nach als die weiche?",
    auftrag: "Vergleiche die Dehnung der weichen und der harten Feder bei gleicher Kraft.",
    schritte: ["Wähle „harte Feder“ und lies in der Statuszeile die Dehnung bei F = 1 N ab.", "Drücke „Messpunkt“, stelle mit „mehr“ die Kraft F = 2 N ein und nimm einen zweiten Messpunkt auf.", "Vergleiche: Wähle „weiche Feder“ und lies bei denselben Kräften die Dehnung ab."]
  },
  "kf4": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "masse-gewicht", seite: 11,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Was ist der Unterschied zwischen Masse und Gewichtskraft?",
    titel: "Kilogramm oder Newton",
    frage: "Worin unterscheidet sich die Masse eines Körpers von seiner Gewichtskraft?",
    auftrag: "Vergleiche für mehrere Körper die Anzeige der Waage mit der Anzeige des Kraftmessers.",
    schritte: ["Wähle „100 g“ und lies in der Statuszeile die Masse und die Gewichtskraft ab.", "Vergleiche damit „200 g“ und „1 kg“: Wie ändern sich die beiden Werte?", "Stelle zuletzt „2 kg“ ein und prüfe, ob F = m · g mit g = 9,8 N/kg passt."]
  },
  "kf5": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "ortsfaktor", seite: 13,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Wäre dasselbe Klavier auf dem Mond leichter?",
    titel: "Das Klavier auf dem Mond",
    frage: "Was ändert sich auf dem Mond: die Masse oder die Gewichtskraft?",
    auftrag: "Untersuche, welche Größe beim Wechsel des Himmelskörpers gleich bleibt.",
    schritte: ["Wähle nacheinander Erde, Mond und Jupiter aus.", "Lies bei jedem Himmelskörper den Ortsfaktor g und die Gewichtskraft F in der Statuszeile ab.", "Vergleiche, welcher Wert sich ändert und welcher bei 60 kg gleich bleibt."]
  },
  "kf6": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraftpfeil", seite: 15,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Wie zeichnet man eine Kraft auf?",
    titel: "Ein Pfeil für jede Kraft",
    frage: "Was zeigt ein Kraftpfeil neben dem Betrag noch an?",
    auftrag: "Untersuche, wie sich der Kraftpfeil bei verschiedenen Beträgen und Richtungen verändert.",
    schritte: ["Wähle nacheinander 2 N, 4 N und 6 N und beobachte die Länge des Pfeils.", "Stelle bei 6 N nacheinander die Richtungen →, ↑ und ↗ ein.", "Vergleiche, was sich beim Wechsel des Betrags und was sich beim Wechsel der Richtung ändert."]
  },
  "kf7": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraefte-addieren", seite: 17,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Was passiert, wenn zwei Menschen ziehen?",
    titel: "Zwei ziehen am selben Seil",
    frage: "Wie groß ist die Gesamtkraft, wenn zwei Kräfte an einem Körper ziehen?",
    auftrag: "Untersuche, wie sich die Gesamtkraft ändert, wenn sich Betrag oder Richtung einer der beiden Kräfte ändert.",
    schritte: ["Lies im Ausgangszustand ab, welche Gesamtkraft aus F1 = 3 N und F2 = 2 N nach rechts entsteht.", "Drücke bei F1 einmal auf – N, lies die Gesamtkraft ab und stelle F1 mit + N wieder auf 3 N.", "Drücke bei F1 auf ⇄ Richtung, danach bei F2 einmal auf – N, und lies jedes Mal die Gesamtkraft ab."]
  },
  "kf8": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraefte-gleichgewicht", seite: 19,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Wann bewegt sich trotz Kraft nichts?",
    titel: "Der Scheinwerfer hängt still",
    frage: "Wirken an einem Körper, der in Ruhe bleibt, wirklich keine Kräfte?",
    auftrag: "Untersuche, bei welcher Haltekraft die Lampe hängen bleibt und wann sie sich bewegt.",
    schritte: ["Lies im Ausgangszustand ab, wie groß Haltekraft, Gewichtskraft und Gesamtkraft sind.", "Drücke einmal auf – N und beobachte, was mit der Lampe geschieht.", "Drücke auf ↺ zurück in die Mitte und vergleiche die beiden Fälle."]
  },
  "kf9": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "traegheit-rs", seite: 21,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum rutscht die Kiste weiter, obwohl niemand schiebt?",
    titel: "Die Kiste rutscht weiter",
    frage: "Warum bleibt ein angestoßener Wagen stehen – und was passiert ohne Reibung?",
    auftrag: "Untersuche, wie weit derselbe Anstoß den Wagen auf Tisch, Eis und im Weltall trägt.",
    schritte: ["Wähle den Untergrund „Tisch“ und drücke „Anstoßen“; beobachte, wie das Tempo abnimmt.", "Drücke „Zurücksetzen“, wähle „Eis“ und stoße den Wagen erneut an.", "Wähle „Weltall“, stoße erneut an und vergleiche die Tempoanzeige mit den anderen Untergründen."]
  },
  "kf10": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "wechselwirkung", seite: 23,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum rollt das Rollbrett zurück?",
    titel: "Rückwärts auf dem Rollbrett",
    frage: "Warum rollt man selbst zurück, wenn man einen schweren Körper wegdrückt?",
    auftrag: "Vergleiche bei drei Beispielen die Geschwindigkeiten der beiden abgestoßenen Körper.",
    schritte: ["Wähle „Eisläufer“ und drücke „Abstoßen“; lies beide Geschwindigkeiten in der Statuszeile ab.", "Wähle „Boot“ und vergleiche die Geschwindigkeit der Person mit der des Bootes.", "Vergleiche bei „Rakete“ die Massen von Rakete und Gas mit ihren Geschwindigkeiten."]
  },
  "kf11": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "druck-flaeche", seite: 25,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum sinkt das Podest unter dem schmalen Fuß ein?",
    titel: "Vier Dellen im neuen Podest",
    frage: "Warum sinkt ein schmaler Fuß in das Podest ein und ein breiter nicht?",
    auftrag: "Untersuche, wie der Druck von der Auflagefläche abhängt, und vergleiche Person und Elefant.",
    schritte: ["Drücke „Turnschuhe“ und lies die Gewichtskraft und den Druck in der Statuszeile ab.", "Wähle nacheinander „Stöckelabsatz“ und „Skier“ und vergleiche die beiden Druckwerte.", "Stelle mit dem Regler die Auflagefläche von 300 cm² auf 1200 cm² und beobachte, wie der Druck sinkt."]
  },
  "kf12": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "schweredruck", seite: 27,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum drückt Wasser in der Tiefe stärker?",
    titel: "Der untere Hahn spritzt weiter",
    frage: "Warum drückt Wasser weiter unten stärker als knapp unter der Oberfläche?",
    auftrag: "Miss den Druck in verschiedenen Tiefen und in verschiedenen Flüssigkeiten.",
    schritte: ["Stelle die Tiefe mit dem Regler auf 0 m und lies den Schweredruck ab.", "Drücke „10 m – doppelter Druck“ und vergleiche Schweredruck und Gesamtdruck.", "Wähle nacheinander Öl, Meerwasser und Quecksilber und lies den Druck bei 10 m ab."]
  },
  "kf13": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "dichte", seite: 29,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum wiegen gleich große Körper ganz verschieden viel?",
    titel: "Zwei gleich große Klötze in der Werkstatt",
    frage: "Warum haben gleich große Würfel aus verschiedenen Stoffen verschiedene Massen?",
    auftrag: "Vergleiche die Massen von sechs gleich großen Würfeln aus verschiedenen Stoffen.",
    schritte: ["Stelle die Kantenlänge a auf 10 cm ein und wähle nacheinander Blei, Eisen, Aluminium, Wasser, Fichtenholz und Styropor.", "Lies bei jedem Stoff im Rechenweg die Masse m und die Gewichtskraft G ab.", "Vergleiche die Masse von Blei mit der Masse von Styropor bei gleicher Kantenlänge."]
  },
  "kf14": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "auftrieb", seite: 31,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum schwimmt ein Schiff aus Eisen?",
    titel: "Ein Traversenrohr in der Regentonne",
    frage: "Warum geht massives Eisen unter, ein hohler Eisenwürfel aber nicht?",
    auftrag: "Untersuche, ab welchem Hohlraumanteil der Eisenwürfel oben bleibt.",
    schritte: ["Drücke „massiv – sinkt“ und lies die Gewichtskraft G und die Auftriebskraft FA ab.", "Stelle den Hohlraum am Regler von 0 % über 87 % auf 88 % und beobachte, wann der Würfel oben bleibt.", "Vergleiche bei 90 % Hohlraum, wie tief der Würfel in Süßwasser und in Meerwasser eintaucht."]
  },
  "el1": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "arbeit", seite: 41,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wann wird in der Physik Arbeit verrichtet?",
    titel: "Vier Meter über den Hof",
    frage: "Wann wird beim Bewegen einer Kiste wirklich Arbeit verrichtet?",
    auftrag: "Vergleiche die verrichtete Arbeit beim Schieben, beim waagerechten Tragen und beim Hochheben.",
    schritte: ["Wähle „Schieben“, drücke „Ausführen“ und lies die Arbeit in der Statuszeile ab.", "Wähle „Waagerecht tragen“ und vergleiche den angezeigten Wert mit dem Wert von vorhin.", "Wähle „Hochheben“, drücke „Ausführen“ und notiere die Hubarbeit."]
  },
  "el2": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "lageenergie", seite: 43,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wo steckt die Energie, wenn etwas oben liegt?",
    titel: "Der Klotz über dem Pfahl",
    frage: "Wovon hängt die Energie ab, die ein Körper oben gespeichert hat?",
    auftrag: "Untersuche, wie sich die Lageenergie ändert, wenn du die Masse und wenn du die Höhe verdoppelst.",
    schritte: ["Stelle die Masse auf 5 kg und die Höhe auf 3 m ein und lies die Lageenergie ab.", "Drücke „×2 Masse“ und notiere den neuen Wert der Lageenergie.", "Drücke „×2 Höhe“ und vergleiche alle drei Werte miteinander."]
  },
  "el3": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "bewegungsenergie", seite: 45,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wo steckt die Energie, wenn etwas rollt?",
    titel: "Die Kabeltrommel auf der Rampe",
    frage: "Wovon hängt es ab, wie viel Energie in einer rollenden Kugel steckt?",
    auftrag: "Untersuche, wie sich die Bewegungsenergie ändert, wenn du die Masse und wenn du das Tempo verdoppelst.",
    schritte: ["Stelle die Masse auf 4 kg und das Tempo auf 4 m/s ein und lies die Energie ab.", "Drücke „×2 Masse“ und danach „Rollen lassen“; beobachte die Schiebestrecke des Klotzes.", "Drücke „×2 Tempo“ und vergleiche den neuen Energiewert mit den beiden Werten davor."]
  },
  "el4": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "energieerhaltung", seite: 47,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Bleibt die Energie beim Umwandeln erhalten?",
    titel: "Der Ball vom Bühnenrand",
    frage: "Wo bleibt die Lageenergie, während der Ball nach unten fällt?",
    auftrag: "Untersuche, wie sich E_pot und E_kin während des Falls verändern und was mit ihrer Summe geschieht.",
    schritte: ["Stelle die Höhe auf 20 m und die Masse auf 2 kg ein und lies E_pot und E_kin ab.", "Beobachte während des Falls die Balken „Potentielle Energie“ und „Kinetische Energie“ und die Kurven über t [s].", "Stelle die Höhe auf 5 m und vergleiche E_pot und E_kin bei der Anzeige „Höhe = 4,9 m“."]
  },
  "el5": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "energie-entwerten", seite: 49,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum wird alles am Ende warm?",
    titel: "Der heiße Scheinwerfer am Abend",
    frage: "Warum wird Energie unbrauchbar, obwohl ihre Menge gleich bleibt?",
    auftrag: "Untersuche, wie viel von 1000 J am Ende einer Energiekette noch zu gebrauchen ist.",
    schritte: ["Wähle die Kette „Benzin → Fahrt“ und lies die Startmenge ab.", "Drücke dreimal „nächster Schritt“ und lies jedes Mal ab, wie viel noch nutzbar und wie viel Wärme geworden ist.", "Wähle danach „Kohle → Licht“ und vergleiche die vier Schritte mit ihren Prozentangaben."]
  },
  "el6": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "leistung-rs", seite: 51,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was unterscheidet Arbeit von Leistung?",
    titel: "Zwei Kisten, zwei Tempos",
    frage: "Was ändert sich, wenn dieselbe Last in der halben Zeit oben ankommt?",
    auftrag: "Untersuche, wie sich Arbeit und Leistung ändern, wenn du die Zeit halbierst und wenn du die Masse veränderst.",
    schritte: ["Stelle die Masse auf 50 kg, die Höhe auf 4 m und die Zeit auf 10 s ein.", "Drücke „Hochziehen“ und lies Arbeit W und Leistung P ab; drücke dann „÷2 Zeit“ und vergleiche.", "Drücke „zurücksetzen“ und stelle die Masse nacheinander auf 10 kg und auf 100 kg ein."]
  },
  "el7": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "wirkungsgrad", seite: 53,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wie viel von der Energie kommt an?",
    titel: "Glühlampe oder LED",
    frage: "Wie viel von der hineingesteckten Energie gibt eine Maschine als Nutzen ab?",
    auftrag: "Vergleiche den Wirkungsgrad von Glühlampe, LED-Lampe, Benzinmotor und Elektromotor.",
    schritte: ["Wähle die Glühlampe und lies ab, wie viel von 1000 J zu Licht wird und wie viel zu Wärme.", "Wähle nacheinander LED-Lampe, Benzinmotor und Elektromotor und lies jedes Mal den Wirkungsgrad η ab.", "Stelle beim Handy-Ladegerät die hineingesteckte Energie auf 200 J und vergleiche den Nutzen mit dem bei 1000 J."]
  },
  "el8": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "hebel", seite: 55,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum ist eine Stange länger als der Weg der Last?",
    titel: "Die Eisenstange unter dem Klavier",
    frage: "Spart eine lange Hebelstange nur Kraft – oder auch Arbeit?",
    auftrag: "Vergleiche Kraft und Weg an beiden Enden des Hebels und dazu die beiden Arbeiten.",
    schritte: ["Stelle den Kraftarm l₁ auf 1,00 m und die Last F₂ auf 200 N ein.", "Lies die nötige Kraft F₁, den Kraftweg s₁ und die beiden Arbeiten W₁ und W₂ ab.", "Drücke nacheinander „gleich lang“, „doppelt so lang“ und „achtfach“ und vergleiche jedes Mal Kraft und Weg."]
  },
  "el9": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "feste-rolle", seite: 57,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was bringt eine Rolle an der Decke?",
    titel: "Die Rolle unter dem Hallendach",
    frage: "Spart eine feste Rolle an der Decke wirklich Kraft?",
    auftrag: "Vergleiche bei derselben Last, welche Kraft und welchen Weg die feste und die lose Rolle verlangen.",
    schritte: ["Drücke „Ohne Rolle“ und lies Kraft, Weg und Arbeit ab.", "Drücke „Feste Rolle“ und vergleiche die Kraft mit dem Wert ohne Rolle.", "Drücke „Lose Rolle“ und beobachte, wie weit deine Hand nun ziehen muss."]
  },
  "el10": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "flaschenzug", seite: 59,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wie viele Seile tragen die Last?",
    titel: "Vier Seile für das Klavier",
    frage: "Wie hängen Zugkraft und Seilweg von der Zahl der tragenden Seile ab?",
    auftrag: "Untersuche, wie sich Zugkraft, Seilweg und Arbeit ändern, wenn mehr Seilstücke die Last tragen.",
    schritte: ["Stelle die Last auf 600 N und die tragenden Seilstücke auf 1 ein.", "Lies bei n = 2 die Zugkraft und den Weg deiner Hand ab.", "Vergleiche bei n = 4 die Zugarbeit mit der Hubarbeit."]
  },
  "el11": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "zahnrad", seite: 61,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum dreht sich das kleine Rad schneller?",
    titel: "Im Getriebe der Seilwinde",
    frage: "Wovon hängt es ab, wie schnell sich das angetriebene Zahnrad dreht?",
    auftrag: "Untersuche, wie die Zähnezahlen der beiden Räder die Drehzahl des Abtriebs bestimmen.",
    schritte: ["Drücke „gleich groß (24: 24)“ und lies die Drehzahl von Rad 2 ab.", "Wähle „groß treibt klein – schneller“ und vergleiche die beiden Drehzahlen.", "Beobachte bei „klein treibt groß – langsamer, kräftiger“, wie sich Drehzahl und Drehmoment ändern."]
  },
  "el12": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "schiefe-ebene", seite: 63,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum ist die Rampe leichter als das Heben?",
    titel: "Zwei Bohlen an der Bühnenkante",
    frage: "Wie verändert die Steilheit der Rampe die nötige Zugkraft?",
    auftrag: "Vergleiche die Zugkraft an einer steilen, einer mittleren und einer flachen Rampe.",
    schritte: ["Wähle „steil“ und lies die Zugkraft in der Statuszeile ab.", "Wähle danach „mittel“ und dann „flach“ und lies jedes Mal die Zugkraft ab.", "Vergleiche deine drei Werte mit den 6 N, die senkrechtes Heben verlangt."]
  },
  "el13": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "schiefe-ebene", seite: 65,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was spart man wirklich - Kraft oder Arbeit?",
    titel: "Kraft gespart, Arbeit nicht",
    frage: "Bleibt das Produkt aus Kraft und Weg bei jeder Rampe gleich?",
    auftrag: "Untersuche, ob Kraft mal Weg bei flacher, mittlerer und steiler Rampe denselben Wert ergibt.",
    schritte: ["Wähle „flach“ und lies Zugkraft und Weglänge aus der Statuszeile ab.", "Wähle nacheinander „mittel“ und „steil“ und notiere jedes Mal beide Werte.", "Vergleiche für jede Rampe den angezeigten Wert von Kraft mal Weg."]
  },
  "ev1": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "magnetfeld", seite: 5,
    kapitel: "Woher der Strom kommt",
    name: "Wie sieht das Feld um einen Magneten aus?",
    titel: "Erster Tag im Umspannwerk",
    frage: "An welchen Stellen um einen Stabmagneten ist das Feld am stärksten?",
    auftrag: "Untersuche mit dem Prüfkompass, an welchen Stellen die Nadel am kräftigsten gedreht wird.",
    schritte: ["Stelle den Abstand auf 55 und die Stelle am Magneten nacheinander auf 0°, 45° und 90°.", "Stelle danach bei 0° den Abstand auf 140 und beobachte die Nadel des Prüfkompasses noch einmal.", "Drücke „Feldlinien“ und vergleiche, wo die Linien dicht und wo sie weit auseinander liegen."]
  },
  "ev2": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "oersted", seite: 7,
    kapitel: "Woher der Strom kommt",
    name: "Kann Strom eine Kompassnadel bewegen?",
    titel: "Der Draht über der Kompassnadel",
    frage: "Was macht eine Kompassnadel, wenn neben ihr Strom fließt?",
    auftrag: "Prüfe, ob der Strom im Draht die Kompassnadel bewegt und wovon der Ausschlag abhängt.",
    schritte: ["Stelle die Stromstärke auf 3,0 A und den Abstand auf 2,0 cm ein und lies den Ausschlag in der Statuszeile ab.", "Drücke „⏻ Strom ausschalten“ und beobachte, wohin die Nadel jetzt zeigt.", "Drücke „⏻ Strom einschalten“, dann „⇄ umpolen“, dann „↓ Nadel unter den Draht“ und vergleiche jeweils, zu welcher Seite die Nadel ausschlägt."]
  },
  "ev3": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "elektromagnet", seite: 9,
    kapitel: "Woher der Strom kommt",
    name: "Wie baut man einen Magneten zum Anschalten?",
    titel: "Das Klacken im Schaltschrank",
    frage: "Wovon hängt die Tragkraft eines Elektromagneten ab?",
    auftrag: "Untersuche, wie Windungszahl und Stromstärke die Tragkraft der Spule verändern.",
    schritte: ["Stelle bei „Windungszahl ändern“ nacheinander N = 50, 150 und 300 ein und lies die Tragkraft in Büroklammern ab.", "Drücke „Stromstärke ändern“ und danach „Beispielmessreihe“.", "Vergleiche in der Tabelle die Tragkraft bei 1 A mit der bei 5 A."]
  },
  "ev4": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "leiterkraft", seite: 11,
    kapitel: "Woher der Strom kommt",
    name: "Warum bewegt sich ein Draht im Magnetfeld?",
    titel: "Der aufgeschraubte Motor",
    frage: "Warum wird ein Draht im Magnetfeld zur Seite gedrückt?",
    auftrag: "Bestimme die Kraft auf den Stab und untersuche, wovon ihre Richtung abhängt.",
    schritte: ["Stelle die Stromstärke auf 5,0 A und das Magnetfeld auf 0,20 T ein und lies die Kraft in der Statuszeile ab.", "Drücke „⇄ Strom umpolen“ und beobachte, wohin der Stab jetzt gedrückt wird.", "Stelle die Stromstärke auf 0 A und vergleiche die Kraft mit der bei 10,0 A."]
  },
  "ev5": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "leiterkraft", seite: 13,
    kapitel: "Woher der Strom kommt",
    name: "Wie sagt man die Richtung der Kraft vorher?",
    titel: "Zwei Kabel vertauscht",
    frage: "Wie ändert sich die Kraftrichtung, wenn du Strom oder Magnet umpolst?",
    auftrag: "Untersuche, wohin der Stab gedrückt wird, wenn du Strom und Magnet einzeln und gemeinsam umpolst.",
    schritte: ["Lies ab, wohin der Stab im Ausgangszustand gedrückt wird und wo der Nordpol liegt.", "Drücke „⇄ Strom umpolen“ und lies die neue Richtung in der Statuszeile ab.", "Drücke zusätzlich „⇄ Magnet umdrehen“ und vergleiche die Kraftrichtung mit der im Ausgangszustand; prüfe nach „↺ zurücksetzen“ auch das Umdrehen des Magneten allein."]
  },
  "ev6": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "elektromotor", seite: 15,
    kapitel: "Woher der Strom kommt",
    name: "Wie wird aus der Kraft eine Drehbewegung?",
    titel: "Der geteilte Ring",
    frage: "Warum dreht sich die Spule nur weiter, wenn der Kommutator eingeschaltet ist?",
    auftrag: "Untersuche, was mit der drehenden Spule geschieht, wenn du den Kommutator ausschaltest.",
    schritte: ["Beobachte die drehende Spule und lies das angezeigte Drehmoment ab.", "Stelle die Windungen der Spule auf 40 und vergleiche das Drehmoment mit dem Wert bei 20 Windungen.", "Drücke „Kommutator ist AN“ und beobachte, wie weit sich die Spule danach noch dreht."]
  },
  "ev7": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "induktion-rs", seite: 17,
    kapitel: "Woher der Strom kommt",
    name: "Wie entsteht Spannung ohne Batterie?",
    titel: "Ein Aufbau ohne Batterie",
    frage: "Wann zeigt der Spannungsmesser etwas an – und wovon hängt der Wert ab?",
    auftrag: "Bestimme, wann eine Spannung entsteht und wie groß sie bei verschiedenen Einstellungen ist.",
    schritte: ["Beobachte den Zeiger, während der Magnet hineinfährt, liegen bleibt und wieder herausfährt.", "Drücke „stark“ und lies die Spannung beim Tempo 50 cm/s ab.", "Stelle das Tempo des Magneten auf 100 cm/s und lies die Spannung erneut ab."]
  },
  "ev8": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "generator", seite: 19,
    kapitel: "Woher der Strom kommt",
    name: "Wie macht ein Generator daraus Strom?",
    titel: "Der Schatten und die Kurve",
    frage: "Wann ist die Spannung am größten – und wie groß ist der Schatten dann?",
    auftrag: "Vergleiche den Schatten der Spule mit der Spannung in den ausgezeichneten Lagen.",
    schritte: ["Beobachte nach dem Drücken von „2 · Warum ein Sinus?“, wie Schatten und Spannungskurve zusammenhängen.", "Drücke nacheinander „φ = 0°“, „φ = 90°“ und „φ = 180°“ und lies jedes Mal cos φ und sin φ ab.", "Lies den Scheitelwert Û und den Effektivwert Û/√2 aus der Rechnung ab."]
  },
  "ev9": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "transformator-schluessel", seite: 21,
    kapitel: "Woher der Strom kommt",
    name: "Wie ändert ein Transformator die Spannung?",
    titel: "Zwei Spulen auf einem Eisenjoch",
    frage: "Wovon hängt die Spannung an der Sekundärspule eines Transformators ab?",
    auftrag: "Untersuche, wie die Windungszahlen der beiden Spulen die Sekundärspannung bestimmen.",
    schritte: ["Drücke die Station „2 · Spannungstransformation“ und stelle die Spannung UP auf 5,0 V ein.", "Stelle NP fest auf 500 und wähle für NS nacheinander 250, 500, 1000 und 2000; lies jedes Mal US ab.", "Vergleiche jeden abgelesenen Wert mit der Spannung, die die Simulation als ideal erwartet."]
  },
  "ev10": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "freileitungen", seite: 24,
    kapitel: "Woher der Strom kommt",
    name: "Warum hängen die Leitungen unter Hochspannung?",
    titel: "Zwei Lampen und ein dünner Draht",
    frage: "Warum wird elektrische Energie über weite Strecken mit Hochspannung übertragen?",
    auftrag: "Untersuche, wie der Verlust in der Leitung von der Übertragungsspannung abhängt.",
    schritte: ["Drücke die Station „2 · Warum Hochspannung?“ und stelle die Übertragungsspannung U auf 20 V ein.", "Lies den Leitungsverlust ab, drücke „Messwert übernehmen“ und wiederhole das für 40 V, 80 V und 250 V.", "Drücke „1/U² → PVerlust“ und vergleiche, ob deine Punkte nun auf einer Ursprungsgeraden liegen."]
  },
  "ev11": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "freileitungen", seite: 26,
    kapitel: "Woher der Strom kommt",
    name: "Was passiert zwischen Kraftwerk und Steckdose?",
    titel: "Der Weg bis zur Steckdose",
    frage: "Wie kommt die Energie vom Kraftwerk bis zur Lampe möglichst verlustarm an?",
    auftrag: "Vergleiche die drei Leitungskonzepte des Modellversuchs an denselben zwei Lampen.",
    schritte: ["Drücke die Station „1 · Die drei Teilversuche“ und wähle das Konzept „Hochspannung“.", "Beobachte die Helligkeit der beiden Lampen und lies Leitungswiderstand, Strom und Verlust ab.", "Wähle nacheinander „Niederspannung, CrNi“ und „Niederspannung, Kupfer“ und vergleiche jedes Mal dieselben Anzeigen."]
  },
  "ev12": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 27,
    kapitel: "Woher der Strom kommt",
    name: "Welche Kraftwerke liefern unseren Strom?",
    titel: "Steckbriefe für Kraftwerke",
    frage: "Welches Kraftwerk passt am besten in eine sichere Stromversorgung?",
    auftrag: "Vergleiche die Kraftwerksarten im Datenblatt nach Brennstoff, Regelbarkeit und Nebenwirkungen.",
    schritte: ["Lies die Kopfzeile des Datenblatts und kläre für jede Spalte, was dort angegeben wird.", "Vergleiche die Spalte zur Regelbarkeit und markiere die Kraftwerke, die sich schnell hoch- und herunterfahren lassen.", "Vergleiche zum Schluss Brennstoff und Nebenwirkungen und ordne die Zeilen nach ihrer Eignung für die Grundlast."]
  },
  "ev13": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "wirkungsgrad", seite: 31,
    kapitel: "Woher der Strom kommt",
    name: "Wie viel von der Energie kommt beim Kunden an?",
    titel: "Warme Luft aus dem Schaltschrank",
    frage: "Bekommt man aus einem Gerät so viel Energie heraus, wie man hineinsteckt?",
    auftrag: "Vergleiche die sechs Maschinen und bestimme, wie viel von 1000 J als Nutzen herauskommt.",
    schritte: ["Wähle nacheinander „Glühlampe“ und „LED-Lampe“. Lies für beide ab, wie viel der 1000 J als Licht herauskommt und wie viel als Wärme verloren geht.", "Vergleiche danach „Benzinmotor“, „Elektromotor“ und „Wasserkocher“ und trage Nutzen und Wirkungsgrad in die Tabelle ein.", "Wähle „Handy-Ladegerät“ und stelle die hineingesteckte Energie nacheinander auf 200 J, 600 J und 1200 J ein. Beobachte dabei den Wirkungsgrad."]
  },
  "ev14": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "stromkosten", seite: 33,
    kapitel: "Woher der Strom kommt",
    name: "Was kostet ein Gerät im Jahr?",
    titel: "Die Jahresrechnung am Tresen",
    frage: "Wovon hängt es ab, was ein Gerät im Jahr an Strom kostet?",
    auftrag: "Vergleiche vier Geräte und bestimme, was die tägliche Laufzeit für die Jahreskosten bedeutet.",
    schritte: ["Stelle mit „3 h“ die Laufzeit ein und wähle nacheinander „LED 10 W“, „TV 100 W“, „Kühlschrank 150 W“ und „Wasserkocher 2000 W“. Lies jedes Mal die Jahreskosten ab.", "Wähle „Wasserkocher 2000 W“ und drücke nacheinander „1 h“, „3 h“, „8 h“ und „24 h“. Trage die Jahreskosten in die Tabelle ein.", "Drücke bei den beiden Prüffragen „In Kilowattstunden (kWh)“ und „Kosten = Energie (kWh) · Preis pro kWh“ und lies die Rückmeldung ab."]
  },
  "ev15": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 33,
    kapitel: "Woher der Strom kommt",
    name: "Was haben elektrisches, magnetisches und Gravitationsfeld gemeinsam?",
    titel: "Zwei Schilder am Zaun",
    frage: "Was haben elektrisches, magnetisches und Gravitationsfeld gemeinsam?",
    auftrag: "Vergleiche die drei Felder im Datenblatt und bestimme, worin sie sich gleichen und worin nicht.",
    schritte: ["Lies im Datenblatt zu jedem der drei Felder ab, worauf es wirkt.", "Vergleiche die drei Einträge und halte fest, welche Aussage bei allen drei Feldern gleich lautet.", "Ordne jedem Feld die Quelle zu, von der es ausgeht, und trage sie in die Tabelle ein."]
  },
  "rk1": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "atombau-isotope", seite: 46,
    kapitel: "Aus dem Atomkern",
    name: "Woraus besteht ein Atomkern?",
    titel: "Der Kühlschrank mit den Zahlen",
    frage: "Welche Teilchen im Kern entscheiden, welches Element vor dir liegt?",
    auftrag: "Untersuche, wie sich die Anzeige ändert, wenn du Protonen und Neutronen einzeln veränderst.",
    schritte: ["Drücke Kohlenstoff-12 und lies im Statusfeld ab, wie viele Protonen und Neutronen im Kern sitzen.", "Drücke Kohlenstoff-14 und vergleiche Massenzahl und Stabilität mit Kohlenstoff-12.", "Stelle den Regler Protonen im Kern auf 8 ein und beobachte, welcher Elementname jetzt oben steht."]
  },
  "rk2": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "geiger-mueller", seite: 48,
    kapitel: "Aus dem Atomkern",
    name: "Was ist radioaktive Strahlung?",
    titel: "Das Knacken vor der Tür",
    frage: "Warum betreibt man ein Zählrohr ausgerechnet bei etwa 450 Volt?",
    auftrag: "Untersuche, wie die Spannung am Zählrohr die Höhe der Impulse verändert.",
    schritte: ["Wähle die Karte 2 · Die Kennlinie und stelle die Zählrohrspannung U nacheinander auf 10 V, 200 V, 450 V und 650 V ein.", "Lies bei jeder Spannung ab, welcher Bereich mit Nummer, Namen und Spannungsgrenzen im Textfeld steht.", "Drücke nacheinander Proportionalbereich und Auslösebereich und vergleiche die Impulshöhen von α, β und γ."]
  },
  "rk3": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "absorption-strahlung", seite: 50,
    kapitel: "Aus dem Atomkern",
    name: "Welche Strahlungsarten gibt es?",
    titel: "Die Schürze aus Blei",
    frage: "Welches Material hält welche Strahlungsart auf?",
    auftrag: "Vergleiche, wie weit α-, β- und γ-Strahlung durch Papier, Aluminium und Blei kommen.",
    schritte: ["Wähle die Karte 1 · Drei Strahlungsarten, drücke α-Strahlung und Papier und stelle den Regler Dicke d auf 1 mm ein.", "Drücke β-Strahlung und Aluminium, stelle Dicke d auf 5 mm ein und beobachte, was hinter dem Blech noch ankommt.", "Drücke γ-Strahlung und Blei, stelle Dicke d auf 6,0 mm ein und lies ab, wie viel Prozent hinten ankommen."]
  },
  "rk4": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "ionisation", seite: 52,
    kapitel: "Aus dem Atomkern",
    name: "Warum ist die Strahlung gefährlich?",
    titel: "Das Fläschchen, das zubleibt",
    frage: "Warum ist die kurze Alphastrahlung im Körper die gefährlichste?",
    auftrag: "Vergleiche für α, β und γ, wie weit die Strahlung kommt und wie dicht sie unterwegs ionisiert.",
    schritte: ["Drücke α Alpha und lies ab, wie viele Ionenpaare je Millimeter entstehen.", "Drücke danach β Beta und γ Gamma und vergleiche Energie, Reichweite und Ionisationsdichte.", "Lies zu jeder Strahlungsart den Wichtungsfaktor ab, mit dem der Strahlenschutz rechnet."]
  },
  "rk5": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "geiger-mueller", seite: 54,
    kapitel: "Aus dem Atomkern",
    name: "Wie weist man Strahlung nach?",
    titel: "Das Knacken im Messraum",
    frage: "Wovon hängt die Höhe eines Impulses im Zählrohr ab?",
    auftrag: "Vergleiche die Impulshöhen im Proportionalbereich und im Auslösebereich.",
    schritte: ["Drücke „3 · Proportional- oder Auslösebereich“ und danach „Proportionalbereich“.", "Lies in der Tabelle die Impulshöhe für α, β und γ ab und trage sie ein.", "Drücke „Auslösebereich“ und vergleiche dieselben drei Zeilen noch einmal."]
  },
  "rk6": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "zerfall-halbwertszeit", seite: 56,
    kapitel: "Aus dem Atomkern",
    name: "Wann ist die Hälfte zerfallen?",
    titel: "Das Fläschchen im Bleibehälter",
    frage: "Zerfällt nach einer Halbwertszeit immer genau die Hälfte der Kerne?",
    auftrag: "Vergleiche die Halbwertszeiten von vier Nukliden und prüfe, wie genau nach einer Halbwertszeit die Hälfte übrig bleibt.",
    schritte: ["Drücke „Radon-220“ und lies in der Statuszeile die Halbwertszeit und die Zahl der Kerne ab.", "Drücke „⏭ eine Halbwertszeit weiter“ und vergleiche die übrige Zahl mit der erwarteten Zahl.", "Wähle nacheinander Iod-131, Cäsium-137 und Plutonium-239 und drücke jedes Mal „⏭ eine Halbwertszeit weiter“."]
  },
  "rk7": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "zerfall-halbwertszeit", seite: 58,
    kapitel: "Aus dem Atomkern",
    name: "Wie alt ist ein Fund?",
    titel: "Ein Holzstück aus dem Moor",
    frage: "Wie kommst du von der Restmenge an Kohlenstoff-14 auf das Alter eines Fundes?",
    auftrag: "Bestimme, wie viel Zeit vergeht, bis von 200 Kohlenstoff-14-Kernen nur noch etwa ein Viertel übrig ist.",
    schritte: ["Drücke „Kohlenstoff-14“ und lies in der Statuszeile die Halbwertszeit und den Startwert ab.", "Drücke „⏭ eine Halbwertszeit weiter“ und lies ab, wie viele Jahre vergangen und wie viel Prozent übrig sind.", "Drücke die Taste noch zweimal und vergleiche nach jedem Schritt Jahreszahl und Prozentwert mit dem Schritt davor."]
  },
  "rk8": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "zerfallsreihe", seite: 60,
    kapitel: "Aus dem Atomkern",
    name: "Was wird aus einem Kern, der zerfällt?",
    titel: "Vierzehn Schritte bis zum Blei",
    frage: "Was ändert sich an einem Kern bei einem Alpha- und was bei einem Betazerfall?",
    auftrag: "Vergleiche, wie sich Massenzahl und Kernladungszahl beim Alphazerfall und beim Betazerfall ändern.",
    schritte: ["Lies im Startbild ab, wie viele Protonen und Neutronen Uran-238 hat und welche Strahlung als Erstes wegfliegt.", "Drücke zweimal „⏭ nächster Zerfall“ und vergleiche nach jedem Druck Massenzahl und Kernladungszahl mit den Werten davor.", "Drücke „⏭⏭ bis zum Ende“ und lies ab, bei welchem Kern die Reihe aufhört und wie viele Zerfälle es waren."]
  },
  "rk9": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "kernspaltung", seite: 62,
    kapitel: "Aus dem Atomkern",
    name: "Was passiert bei einer Kernspaltung?",
    titel: "Ein Würfel gegen einen Güterzug",
    frage: "Woher kommt die Energie, die bei einer Kernspaltung frei wird?",
    auftrag: "Vergleiche die drei Spaltungen und bestimme, wo die frei werdende Energie herkommt.",
    schritte: ["Drücke „↺ Spaltung noch einmal“ und beobachte, wie das langsame Neutron den Urankern trifft. Lies danach ab, wie viele Neutronen bei Barium + Krypton frei werden.", "Vergleiche die Zahl der Kernbausteine und die Zahl der Protonen links und rechts vom Pfeil. Lies ab, um wie viel u die Bruchstücke leichter sind.", "Wähle nacheinander „Xenon + Strontium“ und „Cäsium + Rubidium“ und trage die fehlende Masse und die frei werdende Energie in die Tabelle ein."]
  },
  "rk10": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "kettenreaktion", seite: 65,
    kapitel: "Aus dem Atomkern",
    name: "Wie hält man eine Kettenreaktion unter Kontrolle?",
    titel: "Der Beitrag im Aufenthaltsraum",
    frage: "Was entscheidet darüber, ob eine Kettenreaktion gleichmäßig läuft?",
    auftrag: "Untersuche, wie die Steuerstäbe den Vermehrungsfaktor k verändern.",
    schritte: ["Stelle die Steuerstäbe auf 0 % ein und lies den Vermehrungsfaktor k und die Meldung darunter ab.", "Stelle nacheinander 50 %, 75 % und 100 % ein und trage k mit der Meldung in die Tabelle ein.", "Drücke „↺ Zurücksetzen“, stelle 50 % ein und drücke dann „⏭ nächste Generation“. Vergleiche die Zahl der Spaltungen mit der Generation davor."]
  },
  "rk11": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "kettenreaktion", seite: 67,
    kapitel: "Aus dem Atomkern",
    name: "Wie ist ein Kernkraftwerk aufgebaut?",
    titel: "Der Umweg über den Dampf",
    frage: "Wie wird aus der Wärme im Reaktor der Strom in der Leitung?",
    auftrag: "Bestimme, wie viel Energie die Spaltungen liefern, und vergleiche sie mit dem Bedarf eines Kraftwerks.",
    schritte: ["Stelle die Steuerstäbe auf 50 % ein und lies ab, wie viel Energie eine einzelne Spaltung liefert und wie viel die 500 Spaltungen der Generation 0 zusammen ergeben.", "Drücke „Laufen lassen“ und beobachte über mehrere Generationen, ob die Zahl der Spaltungen gleich bleibt.", "Lies ab, wie viele Spaltungen je Sekunde ein Kraftwerk für 300 Megawatt braucht, und vergleiche diese Zahl mit den 500 Spaltungen im Bild."]
  },
  "rk12": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 65,
    kapitel: "Aus dem Atomkern",
    name: "Wohin mit dem, was übrig bleibt?",
    titel: "Der abgeschlossene Raum im Keller",
    frage: "Warum kann man abgebrannte Brennstäbe nicht einfach abklingen lassen?",
    auftrag: "Vergleiche die Halbwertszeiten im Datenblatt und beurteile, welche Lagerung die Stoffe verlangen.",
    schritte: ["Lies im Datenblatt zu jedem Stoff die Halbwertszeit ab und trage die drei Werte in die Tabelle ein.", "Vergleiche die kürzeste mit der längsten Halbwertszeit und halte fest, um wie viel sie sich unterscheiden.", "Ordne die Stoffe danach, ob nach zehn Halbwertszeiten ein Abklingraum genügt oder ein Lager für viele Generationen nötig ist."]
  },
  "rk13": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "strahlenschutz", seite: 72,
    kapitel: "Aus dem Atomkern",
    name: "Wie schützt man sich vor Strahlung?",
    titel: "Dosimeter, Blei und ein Schritt zurück",
    frage: "Was senkt die Dosis stärker: mehr Abstand oder ein paar Millimeter Blei?",
    auftrag: "Vergleiche, wie stark Abstand und Blei die Dosisleistung senken.",
    schritte: ["Stelle den Abstand nacheinander auf 50 cm, 100 cm und 200 cm ein und lies jedes Mal die Dosisleistung ab.", "Stelle den Abstand zurück auf 50 cm und schiebe den Regler für das Blei auf 7 mm.", "Vergleiche, welche der beiden Änderungen den Wert stärker senkt."]
  },
  "rk14": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "strahlenschutz", seite: 74,
    kapitel: "Aus dem Atomkern",
    name: "Wie viel Strahlung ist noch vertretbar?",
    titel: "Ein Flug, eine Röntgenaufnahme, ein Grenzwert",
    frage: "Ab welchem Abstand bleibt die Dosis in 20 Minuten unter der eines Fluges?",
    auftrag: "Bestimme, ab welchem Abstand die Dosis in 20 Minuten unter 40 µSv bleibt.",
    schritte: ["Stelle die Aufenthaltsdauer auf 20 Minuten und den Abstand auf 55 cm ein.", "Lies ab, wie groß die Dosis in 20 Minuten ist, und lies die Vergleichszeile darunter mit.", "Vergleiche diese Zeile mit der bei 90 cm, 125 cm und 300 cm."]
  },
  "rk15": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 71,
    kapitel: "Aus dem Atomkern",
    name: "Wie hilft Strahlung in der Medizin?",
    titel: "Die Liste im Vorbereitungsraum",
    frage: "Warum eignet sich nicht jeder radioaktive Stoff für jede Aufgabe in der Medizin?",
    auftrag: "Vergleiche die Angaben im Datenblatt und ordne jedem Stoff seine Aufgabe zu.",
    schritte: ["Lies ab, welche Strahlungsart und welche Halbwertszeit im Datenblatt zu jedem Stoff gehören.", "Vergleiche die Zeilen, die zur Diagnose gehören, mit den Zeilen für die Therapie.", "Wähle zu jeder der beiden Aufgaben den Stoff aus, der nach der Tabelle am besten passt."]
  },
  "rk16": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "kernfusion", seite: 79,
    kapitel: "Aus dem Atomkern",
    name: "Woher nimmt die Sonne ihre Energie?",
    titel: "Der Ofen im Sonnenkern",
    frage: "Ab welcher Temperatur verschmelzen Wasserstoffkerne zu Helium?",
    auftrag: "Untersuche, ab welcher Temperatur im Modell Heliumkerne entstehen.",
    schritte: ["Stelle die Temperatur auf 4 Millionen °C ein und lies die Statuszeile darunter.", "Stelle die Temperatur Schritt für Schritt höher, bis dort „Es zündet“ steht.", "Vergleiche im Text die Energie je Kernbaustein bei Fusion und bei Spaltung."]
  },
  "rk17": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 75,
    kapitel: "Aus dem Atomkern",
    name: "Kernenergie: Wie stehst du dazu?",
    titel: "Die Folie, die noch fehlt",
    frage: "Welche Gründe sprechen für und gegen Kernenergie, und was wiegt schwerer?",
    auftrag: "Vergleiche die Angaben im Datenblatt und ordne sie nach Gründen dafür und dagegen.",
    schritte: ["Lies ab, welche Angaben im Datenblatt stehen, und unterstreiche darin jede Zahl.", "Vergleiche die Spalten des Datenblatts und markiere, wo die Unterschiede am größten sind.", "Wähle vier Angaben aus, die für dich am schwersten wiegen, und trage sie in die Tabelle ein."]
  },
};

// simId -> alle Heftseiten, die darauf zeigen
const HEFT_ZU_SIM = {};
for (const [id, d] of Object.entries(HEFT_SEITEN))
  if (d.sim) (HEFT_ZU_SIM[d.sim] = HEFT_ZU_SIM[d.sim] || []).push(id);
