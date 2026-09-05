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
  "wm1": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "thermometer", seite: 5,
    kapitel: "Temperatur und Wärme",
    name: "Wie misst man, wie warm etwas ist?",
    titel: "Der kletternde rote Faden",
    frage: "Wie misst man, wie warm etwas ist?",
    auftrag: "Miss mit dem Thermometer die Temperatur von vier Proben und beobachte dabei genau, wie sich die rote Säule in der Röhre verändert.",
    schritte: ["Schiebe den Regler Temperatur langsam nach oben und beobachte, wie die rote Säule in der Röhre mitwandert.", "Tippe nacheinander auf Eiswasser, Bens Faust, warmes Wasser und kochendes Wasser und lies jedes Mal den angezeigten Wert in °C ab.", "Stelle den Regler Temperatur auf -10 °C und beobachte, wie tief die Säule jetzt fällt."]
  },
  "wm2": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "temperatur-waerme", seite: 7,
    kapitel: "Temperatur und Wärme",
    name: "Sind Temperatur und Wärme dasselbe?",
    titel: "Die große Kanne gewinnt",
    frage: "Sind Temperatur und Wärme dasselbe?",
    auftrag: "Untersuche mit den beiden Gefäßen, ob in gleich warmem Wasser immer gleich viel Wärme steckt und was beim Kontakt von Warm und Kalt passiert.",
    schritte: ["Schiebe die Temperatur von Gefäß 2 auf 80 °C, lies in der Statuszeile die Wärmemenge beider Gefäße ab und tippe dann auf In Kontakt bringen.", "Stelle die Temperatur von Gefäß 2 zurück auf 20 °C, notiere erst beide Wärmemengen und lies nach dem Tippen auf In Kontakt bringen die Mischtemperatur ab.", "Schiebe die Menge von Gefäß 2 auf 1 L, notiere die Wärmemengen, tippe noch einmal auf In Kontakt bringen und vergleiche die neue Mischtemperatur mit vorher."]
  },
  "wm3": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "waermeuebertragung", seite: 10,
    kapitel: "Temperatur und Wärme",
    name: "Auf welchen Wegen wandert Wärme?",
    titel: "Der heiße Löffelstiel",
    frage: "Auf welchen Wegen wandert Wärme?",
    auftrag: "Vergleiche die drei Wege der Wärme in der Simulation und finde zu jedem Weg heraus, wie die Wärme dabei vorankommt.",
    schritte: ["Wähle Leitung und verfolge im Bild, wie die Wärme von der Flamme durch den Metallstab vom heißen zum kalten Ende wandert.", "Wähle Strömung und beobachte im Topf, wie das warme Wasser in der Mitte aufsteigt und das kalte außen absinkt.", "Wähle Strahlung und lies im Feld Das passiert gerade nach, wie die Wärme der Sonne durch den leeren Raum kommt."]
  },
  "wm4": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "daemmung", seite: 12,
    kapitel: "Temperatur und Wärme",
    name: "Wie hält man Wärme auf?",
    titel: "Der lauwarme Tee",
    frage: "Wie hält man Wärme auf?",
    auftrag: "Vergleiche, wie schnell 80 °C heißes Wasser in fünf verschiedenen Hüllen abkühlt, und finde heraus, welcher Dämmstoff die Wärme am längsten hält.",
    schritte: ["Wähle den Dämmstoff ohne Dämmung und starte mit Messreihe (0–10 min) die erste Messung.", "Tippe auf Alle Materialien und lies für jede Hülle in der Spalte T (°C) die Temperatur nach 10 min ab.", "Vergleiche im Diagramm der Auswertung, welche Abkühlkurve am flachsten verläuft."]
  },
  "wm5": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "waermeausdehnung", seite: 14,
    kapitel: "Temperatur und Wärme",
    name: "Warum passt der heiße Deckel nicht mehr?",
    titel: "Der wacklige Deckel",
    frage: "Warum passt der heiße Deckel nicht mehr?",
    auftrag: "Untersuche mit dem Teilchenmodell, wie sich ein Festkörper, eine Flüssigkeit und ein Gas beim Erwärmen verändern.",
    schritte: ["Wähle die Taste fest und schiebe den Regler Temperatur von 20 °C auf 100 °C – beobachte die Teilchen und den Balken Größe des Stoffs.", "Stelle nacheinander flüssig und Gas ein und lies jeweils in der Statuszeile die Ausdehnung bei 100 °C ab.", "Schiebe den Regler zurück auf 20 °C und beobachte, was mit der Größe des Stoffs passiert."]
  },
  "wm6": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "aggregatzustaende", seite: 16,
    kapitel: "Temperatur und Wärme",
    name: "Fest, flüssig, gasförmig - was passiert beim Wechsel?",
    titel: "Hart, nass und einfach weg",
    frage: "Fest, flüssig, gasförmig – was passiert beim Wechsel?",
    auftrag: "Untersuche, bei welchen Temperaturen Wasser seinen Zustand wechselt und was seine Teilchen dabei tun.",
    schritte: ["Schiebe den Regler Temperatur ganz nach links auf −20 °C und lies in der Statuszeile ab, wie die Teilchen im Eis sitzen.", "Erwärme das Eis Schritt für Schritt mit der Taste erwärmen oder dem Regler und beobachte, kurz nach welcher Marke der Skala die Statuszeile auf Wasser – flüssig umspringt.", "Stelle 100 °C ein und vergleiche die Teilchen des Wasserdampfs mit denen im Eisgitter."]
  },
  "wm7": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "anomalie-wasser", seite: 18,
    kapitel: "Temperatur und Wärme",
    name: "Warum schwimmt Eis oben?",
    titel: "Wasser tanzt aus der Reihe",
    frage: "Warum schwimmt Eis oben?",
    auftrag: "Untersuche mit dem Temperaturregler, wie viel Platz 1 kg Wasser bei verschiedenen Temperaturen braucht, und vergleiche das mit dem Platzbedarf von 1 kg Eis.",
    schritte: ["Schiebe den Regler Wassertemperatur langsam von 10 °C auf 0 °C und beobachte im Feld Nachgerechnet, wie sich Dichte und Volumen von 1 kg Wasser verändern.", "Tippe auf 4 °C · am dichtesten und lies unter Nachgerechnet ab, wie viele Liter 1 kg Wasser jetzt braucht – vergleiche mit dem Eis-Wert unter der Überschrift 4 · Und Eis?", "Tippe auf Der See im Winter und stelle den Regler nacheinander auf 0 °C, 2 °C und 4 °C – der Messfühler zeigt dir, in welcher Tiefe er dieses Wasser findet."]
  },
  "sm1": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "stromkreis-lampe", seite: 29,
    kapitel: "Strom und Magnete",
    name: "Wann leuchtet das Lämpchen?",
    titel: "Die Kiste mit dem Lämpchen",
    frage: "Wann leuchtet das Lämpchen?",
    auftrag: "Untersuche, bei welchen Stellungen von Schalter und Kabel das Lämpchen leuchtet und bei welchen es dunkel bleibt.",
    schritte: ["Sieh dir den Anfangszustand an: Die Taste Schalter steht auf geschlossen, die Taste Kabel auf heil. Lies die Statuszeile ab.", "Tippe auf die Taste Schalter, sodass dort offen steht, und beobachte Lämpchen und Statuszeile.", "Stelle den Schalter wieder auf geschlossen und tippe dann auf die Taste Kabel, sodass dort unterbrochen steht. Probiere zum Schluss beide Störungen gleichzeitig aus."]
  },
  "sm2": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schaltplan", seite: 31,
    kapitel: "Strom und Magnete",
    name: "Wie zeichnet man einen Stromkreis?",
    titel: "Die geheime Zeichensprache",
    frage: "Wie zeichnet man einen Stromkreis?",
    auftrag: "Vergleiche das Foto des Aufbaus mit dem Schaltplan und ordne jedem Bauteil sein Schaltzeichen zu.",
    schritte: ["Wähle die Ansicht Aufbau (Bild) und tippe auf die Taste Schalter: Im Bild steht dann offen – Lampe aus oder geschlossen – Lampe leuchtet.", "Wechsle zur Ansicht Schaltplan und finde Batterie, Lampe und Schalter in der Zeichnung wieder; der Zettel aus der Kiste hilft dir dabei.", "Bearbeite das Zuordnungsspiel, bis unter allen vier Fragen Richtig! steht."]
  },
  "sm3": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "leiter-nichtleiter", seite: 33,
    kapitel: "Strom und Magnete",
    name: "Welche Stoffe lassen Strom hindurch?",
    titel: "Das zu kurze Kabel",
    frage: "Welche Stoffe lassen Strom hindurch?",
    auftrag: "Prüfe alle neun Gegenstände aus der Kiste und sortiere sie in zwei Gruppen: Strom kommt hindurch oder nicht.",
    schritte: ["Tippe nacheinander alle neun Materialien an, von der Büroklammer bis zum Radiergummi – jedes wird in die Lücke gesetzt.", "Beobachte bei jedem Material das Lämpchen und die Meldung im Bild: Lampe leuchtet: Leiter oder Lampe aus: Nichtleiter.", "Lies zum Schluss die Regel ab, die nach Alle getestet! erscheint, und vergleiche sie mit deinen zwei Gruppen."]
  },
  "sm4": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "reihenschaltung-rs", seite: 35,
    kapitel: "Strom und Magnete",
    name: "Was ändert sich, wenn Lampen hintereinander hängen?",
    titel: "Mehr Lämpchen, weniger Licht",
    frage: "Was ändert sich, wenn Lampen hintereinander hängen?",
    auftrag: "Miss die Helligkeit je Lampe für 1, 2 und 3 Lampen in Reihe und prüfe, was passiert, wenn eine Lampe herausgedreht wird.",
    schritte: ["Stelle mit dem Schieberegler Anzahl Lampen in Reihe nacheinander 1, 2 und 3 ein und lies jedes Mal die Angabe Helligkeit je Lampe ab.", "Beobachte dabei die Lampen im Bild und die Statuszeile: Sie meldet, ob alle Lampen leuchten.", "Tippe bei 2 Lampen auf die Taste Lampe 2, sodass dort herausgedreht steht, und beobachte, was mit der anderen Lampe und der Helligkeit passiert."]
  },
  "sm5": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "parallelschaltung-rs", seite: 37,
    kapitel: "Strom und Magnete",
    name: "Was ändert sich, wenn jede Lampe ihren eigenen Weg hat?",
    titel: "Zwei Lämpchen, zwei Schalter",
    frage: "Was ändert sich, wenn jede Lampe ihren eigenen Weg hat?",
    auftrag: "Untersuche alle vier Stellungen der beiden Schalter und finde heraus, wann welche Lampe leuchtet.",
    schritte: ["Beobachte den Anfangszustand: Beide Tasten stehen auf an, die Statuszeile meldet: Beide Lampen leuchten – jede voll hell.", "Tippe auf die Taste Bens Schalter (Lampe 1), sodass dort aus steht, und beobachte Lampe 2 und die Statuszeile.", "Stelle nacheinander alle vier Stellungen der beiden Schalter ein und trage jedes Mal ein, welche Lampe leuchtet."]
  },
  "sm6": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "und-oder-schaltung", seite: 39,
    kapitel: "Strom und Magnete",
    name: "UND oder ODER - wie schalten zwei Schalter zusammen?",
    titel: "Das Rätsel der zwei Bretter",
    frage: "UND oder ODER – wie schalten zwei Schalter zusammen?",
    auftrag: "Vergleiche die UND-Schaltung mit der ODER-Schaltung, indem du für alle vier Schalterstellungen prüfst, ob die Lampe leuchtet.",
    schritte: ["Wähle UND · in Reihe und stelle mit den Knöpfen Schalter S1 und Schalter S2 nacheinander alle vier Stellungen aus offen und geschlossen ein; lies jedes Mal ab, ob darunter Lampe = 1 (leuchtet) oder Lampe = 0 (aus) steht.", "Wähle ODER · parallel und stelle dieselben vier Stellungen noch einmal ein; beobachte, wie sich der Stromkreis in zwei Zweige umbaut und die grün gestrichelten Stromwege nur durch geschlossene Zweige laufen.", "Lies in der Wahrheitstabelle ab, in wie vielen der vier Zeilen die Lampe bei UND an ist und in wie vielen bei ODER; trage deine Ergebnisse mit 0 = offen und 1 = geschlossen in die Tabelle ein."]
  },
  "sm7": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "stromwirkungen", seite: 42,
    kapitel: "Strom und Magnete",
    name: "Was kann der Strom alles bewirken?",
    titel: "Vier Geräte, eine Batterie",
    frage: "Was kann der Strom alles bewirken?",
    auftrag: "Untersuche, welche Wirkungen der elektrische Strom bei vier verschiedenen Geräten hat.",
    schritte: ["Wähle unter Gerät anschließen nacheinander Glühlampe, Heizdraht, Spule (Elektromagnet) und Elektromotor.", "Lies in der Liste Beobachtete Wirkung(en) ab, welche Wirkungen einen Haken bekommen, und trage sie in die Tabelle ein.", "Schiebe den Regler Stromstärke I von 1 A auf 5 A und beobachte, wie sich Lampe, Draht und Motor im Bild verändern."]
  },
  "sm8": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "elektronen-drift", seite: 44,
    kapitel: "Strom und Magnete",
    name: "Was fließt da eigentlich im Draht?",
    titel: "Der Streit am Lichtschalter",
    frage: "Was fließt da eigentlich im Draht?",
    auftrag: "Vergleiche bei drei Geräten, wie schnell die Elektronen im Kabel wandern.",
    schritte: ["Tippe auf die Taste Leselampe und lies im Feld Nachgerechnet ab, wie viele Millimeter je Sekunde die Elektronen wandern und wie lange sie für einen Meter Kabel brauchen.", "Wähle danach Handy-Ladegerät und Wasserkocher und trage die Werte in die Tabelle ein.", "Schiebe den Regler Stromstärke langsam nach rechts und beobachte, wie sich die Zeile Wandern unter dem Draht verändert."]
  },
  "sm9": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "stromgefahren", seite: 47,
    kapitel: "Strom und Magnete",
    name: "Wozu gibt es Sicherungen?",
    titel: "Die volle Steckdosenleiste",
    frage: "Wozu gibt es Sicherungen?",
    auftrag: "Prüfe, wie viele Geräte an einer Steckdose sicher laufen und ab welcher Stromstärke die Sicherung eingreift.",
    schritte: ["Lies im Feld Strom & Sicherung ab, wie viel Ampere ein einzelnes Gerät zieht, und trage den Wert in die Tabelle ein.", "Tippe dreimal auf Gerät anschließen und notiere nach jedem neuen Gerät die Ampere-Zahl und ob die Sicherung hält oder auslöst.", "Drücke Sicherung zurücksetzen und finde mit Gerät anschließen und Gerät entfernen heraus, wie viele Geräte gerade noch sicher laufen."]
  },
  "sm10": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "magnetpole", seite: 49,
    kapitel: "Strom und Magnete",
    name: "Wo zieht ein Magnet am stärksten?",
    titel: "Die Tür, die plötzlich zuzieht",
    frage: "Wo zieht ein Magnet am stärksten?",
    auftrag: "Miss mit dem Kraftmesser, wie stark zwei Magnete bei verschiedenen Abständen aneinander ziehen.",
    schritte: ["Stelle mit dem Regler den Abstand d auf 2 cm ein und lies ab, wie viele Skalenteile der Kraftmesser zeigt.", "Schiebe den Regler nacheinander auf 4 cm, 8 cm und 12 cm und trage die Skalenteile jeweils in die Tabelle ein.", "Wähle die Taste Magnet an der Tür umgedreht und beobachte, was aus der Anziehung wird und wohin die Pfeile jetzt zeigen."]
  },
  "sm11": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "magnet-stoffe", seite: 51,
    kapitel: "Strom und Magnete",
    name: "Was zieht ein Magnet an - und was nicht?",
    titel: "Der Beutel aus der zweiten Kiste",
    frage: "Was zieht ein Magnet an – und was nicht?",
    auftrag: "Untersuche, welche der neun Gegenstände der Magnet anzieht, und finde die gemeinsame Regel.",
    schritte: ["Tippe der Reihe nach auf alle neun Materialien, vom Eisen-Nagel bis zu Blech 3.", "Beobachte die Meldung unten im Bild – „wird angezogen!“ oder „bleibt liegen – nicht magnetisch“ – und trage Ja oder Nein in die Tabelle ein.", "Vergleiche am Ende die beiden Gruppen „wird angezogen“ und „wird nicht angezogen“ und lies die Regel unter der Tabelle ab."]
  },
  "sm12": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "magnetfeld", seite: 53,
    kapitel: "Strom und Magnete",
    name: "Wie sieht man das Unsichtbare um den Magneten?",
    titel: "Nichts zu sehen und doch da",
    frage: "Wie sieht man das Unsichtbare um den Magneten?",
    auftrag: "Untersuche mit dem Prüfkompass, wie der unsichtbare Bereich um den Magneten geformt ist und an welchen Stellen er am stärksten wirkt.",
    schritte: ["Schiebe den Regler „Stelle am Magneten“ auf 0° und den Regler „Abstand des Prüfkompasses vom Magneten“ auf 55 und beobachte die rote Spitze des Prüfkompasses.", "Stelle danach 90° und 180° ein und vergleiche, wie sich die Nadel an jeder Stelle des Magneten ausrichtet.", "Lass die Taste „Feldlinien“ eingeschaltet und untersuche, wo die Linien dicht beieinanderliegen und wo sie weit auseinanderlaufen – auch beim Abstand 140."]
  },
  "sm13": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "elementarmagnete", seite: 56,
    kapitel: "Strom und Magnete",
    name: "Wie wird ein Nagel selbst zum Magneten?",
    titel: "Der aufgeräumte Nagel",
    frage: "Wie wird ein Nagel selbst zum Magneten?",
    auftrag: "Untersuche mit dem Modell der Elementarmagnete, wie der Nagel durch Streichen magnetisch wird und wodurch er seine Wirkung wieder verliert.",
    schritte: ["Lass die Streichwirkung auf 30 % stehen und tippe dreimal nacheinander auf „Mit Magnet streichen“ – lies nach jedem Strich unter „Nachgerechnet“ ab, wie viele der 64 Pfeile ausgerichtet sind und wie viele Büroklammern der Nagel trägt, und trage die Werte in die Tabelle ein.", "Tippe danach auf „Erhitzen“ und trage ein, wie viele Pfeile jetzt noch ausgerichtet sind und wie viele Büroklammern hängen bleiben.", "Magnetisiere den Nagel mit drei neuen Strichen und tippe auf „Nagel durchsägen“ – prüfe unter „Nachgerechnet“, ob eines der beiden Stücke nur einen einzigen Pol hat."]
  },
  "sm14": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "kompass", seite: 59,
    kapitel: "Strom und Magnete",
    name: "Warum zeigt der Kompass nach Norden?",
    titel: "Die Nadel ohne Motor",
    frage: "Warum zeigt der Kompass nach Norden?",
    auftrag: "Untersuche, wohin die Kompassnadel zeigt, wenn nur das Erdmagnetfeld wirkt – und was passiert, wenn ein Magnet in die Nähe kommt.",
    schritte: ["Tippe mehrmals auf „Nadel anstoßen“ und beobachte, wo die rote Nadelspitze jedes Mal zur Ruhe kommt.", "Schalte die Taste „in der Bude: Noahs Magnetleiste“ ein und stelle „Magnet – Abstand“ erst auf 3 cm, dann auf 15 cm – beobachte die rote Spitze.", "Schalte zuletzt die Taste „Erdmagnetfeld“ aus und prüfe, wohin sich die Nadel jetzt dreht."]
  },
  "sl1": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "ton-entsteht", seite: 69,
    kapitel: "Schall",
    name: "Wie entsteht ein Ton?",
    titel: "Die Keksdose mit dem Gummiband",
    frage: "Wie entsteht ein Ton?",
    auftrag: "Untersuche, was das Gummiband tun muss, damit ein Ton entsteht – und was passiert, wenn es stillsteht.",
    schritte: ["Tippe auf»Gummiband zupfen«und beobachte, wie das Band ausschlägt und welche Linien von ihm ausgehen.", "Lies im Feld»Zustand«ab, ob du einen Ton hörst, und trage es in die Tabelle ein.", "Tippe auf»Finger auf das Band legen«und vergleiche, was das Band jetzt macht und was im Feld»Zustand«steht."]
  },
  "sl2": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "tonhoehe", seite: 71,
    kapitel: "Schall",
    name: "Was macht einen Ton hoch oder tief?",
    titel: "Helles Pling, tiefes Brummen",
    frage: "Was macht einen Ton hoch oder tief?",
    auftrag: "Vergleiche langsame und schnelle Schwingungen und finde heraus, was die Tonhöhe bestimmt.",
    schritte: ["Schiebe den Regler»So schnell schwingt Emmas Glas«ganz nach links auf 100 Hz und betrachte, wie weit die Wellenberge auseinanderliegen.", "Lies im Feld»Tonhöhe«ab, ob der Ton tief, mittel oder hoch ist, und trage es mit dem Hz-Wert in die Tabelle ein.", "Stelle nacheinander 300 Hz, 560 Hz und 800 Hz ein und beobachte, wie der Punkt auf der Skala von»tief«nach»hoch«wandert."]
  },
  "sl3": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "lautstaerke", seite: 73,
    kapitel: "Schall",
    name: "Was macht einen Ton laut oder leise?",
    titel: "Zwei Schläge auf die Trommel",
    frage: "Was macht einen Ton laut oder leise?",
    auftrag: "Untersuche, wie sich die Schwingungskurve ändert, wenn das Gummiband sanft oder fest gezupft wird, und was die Lautstärke bestimmt.",
    schritte: ["Schiebe den Regler»So fest zupft Ben am Gummiband«ganz nach links und betrachte den Ausschlag der Kurve und die gestrichelte Linie»Amplitude«.", "Lies im Feld»Lautstärke«ab, was dort steht, und trage es in die Tabelle ein.", "Stelle den Regler in die Mitte und danach ganz nach rechts und vergleiche Ausschlag, Balken und Anzeige."]
  },
  "sl4": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schallausbreitung", seite: 75,
    kapitel: "Schall",
    name: "Wie kommt der Schall zu uns?",
    titel: "Ein Ohr an der Tischplatte",
    frage: "Wie kommt der Schall zu uns?",
    auftrag: "Prüfe, durch welche Stoffe der Schall von der Glocke bis zum Ohr gelangt – und was im leeren Raum passiert.",
    schritte: ["Wähle unter»Stoff zwischen Glocke und Ohr«zuerst»Luft«und beobachte, wie die Teilchen die Schwingung von der Glocke zum Ohr weitergeben.", "Lies im Feld»Ergebnis«ab, ob du die Glocke hörst und was dort über die Geschwindigkeit steht, und trage beides in die Tabelle ein.", "Wähle danach»Wasser«,»Balken (Holz)«und zuletzt»Vakuum (Weltall)«und vergleiche, was mit den Teilchen und dem Ton passiert."]
  },
  "sl5": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schall", seite: 77,
    kapitel: "Schall",
    name: "Warum hallt es in der Turnhalle?",
    titel: "Die Halle klatscht zurück",
    frage: "Warum hallt es in der Turnhalle?",
    auftrag: "Miss, wie schnell der Schall durch die Luft läuft, und prüfe, ob hohe Töne schneller sind als tiefe.",
    schritte: ["Schiebe den Regler Frequenz f ganz nach links auf 100 Hz und sieh dir an, wie weit die Verdichtungen im Bild auseinanderliegen.", "Lies im weißen Kästchen oben rechts den Abstand λ und die Geschwindigkeit c ab und trage beide in die Tabelle ein.", "Stelle nacheinander 400 Hz, 1000 Hz und 2000 Hz ein und prüfe jedes Mal, ob sich die Geschwindigkeit c ändert."]
  },
  "sl6": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "laermschutz", seite: 79,
    kapitel: "Schall",
    name: "Wann wird Schall zu Lärm?",
    titel: "Der Bohrer hinter der Wand",
    frage: "Wann wird Schall zu Lärm?",
    auftrag: "Untersuche, wie viel von dem Lärm einer Maschine am Ohr ankommt und welche Schutzmaßnahme die Zahl am stärksten senkt.",
    schritte: ["Lass die Lautstärke der Quelle auf 100 dB stehen und lies in der Statuszeile ab, wie viele dB bei 2 m Abstand am Ohr ankommen.", "Schiebe den Regler Abstand zur Quelle auf 16 m, lies erneut ab und stelle danach wieder 2 m ein.", "Tippe zuerst auf Gehörschutz, schalte ihn wieder aus und tippe dann auf Schallschutz (Absorption) – vergleiche die Zahlen am Ohr."]
  },
  "sl7": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "ohr", seite: 81,
    kapitel: "Schall",
    name: "Wie hört das Ohr?",
    titel: "Das Häutchen im Kopf",
    frage: "Wie hört das Ohr?",
    auftrag: "Untersuche, was im Ohr geschieht, wenn ein leiser oder ein lauter Ton ankommt.",
    schritte: ["Schiebe den Regler So laut schlägt Noah den Topf an ganz nach links auf leise und beobachte das rote Trommelfell im Bild.", "Stelle danach mittel und laut ein und vergleiche, wie stark das Trommelfell jedes Mal hin- und herschwingt.", "Öffne erst zum Schluss den Klapptext Erst nach dem Versuch öffnen: der Weg des Schalls und lies die sechs Stationen nach."]
  },
  "sl8": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "tonhoehe", seite: 83,
    kapitel: "Schall",
    name: "Was hören Tiere, was wir nicht hören?",
    titel: "Die stumme Pfeife",
    frage: "Was hören Tiere, was wir nicht hören?",
    auftrag: "Untersuche, wie die Tonhöhe mit der Zahl der Schwingungen in jeder Sekunde zusammenhängt.",
    schritte: ["Schiebe den Regler So schnell schwingt Emmas Glas ganz nach links auf 100 Hz und lies die Anzeige in der Statuszeile ab.", "Stelle danach 300 Hz und 800 Hz ein und trage jedes Mal ein, ob dort tiefer, mittlerer oder hoher Ton steht.", "Beobachte die violette Welle im Bild: Zähle, ob bei 800 Hz mehr Wellenberge zu sehen sind als bei 100 Hz."]
  },
  "li1": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "lichtausbreitung", seite: 93,
    kapitel: "Licht",
    name: "Wie breitet sich Licht aus?",
    titel: "Zwei Pappstreifen, kein Licht",
    frage: "Wie breitet sich Licht aus?",
    auftrag: "Untersuche, wie die beiden Löcher stehen müssen, damit das Licht der Taschenlampe am Schirm ankommt.",
    schritte: ["Stelle den Regler „Loch der 1. Blende“ auf +18 und lass „Loch der 2. Blende“ auf 0 stehen. Lies die Statuszeile.", "Schiebe „Loch der 2. Blende“, bis die Statuszeile „Das Licht kommt durch!“ meldet und der Strahl genau durch die Mitte des Lochs läuft. Notiere beide Zahlen in der Tabelle.", "Wiederhole das mit „Loch der 1. Blende“ auf -20 und auf 0 und trage jedes Mal die passende Zahl der 2. Blende ein."]
  },
  "li2": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "sehen", seite: 95,
    kapitel: "Licht",
    name: "Warum sehen wir Dinge?",
    titel: "Stockdunkel im Physikraum",
    frage: "Warum sehen wir Dinge?",
    auftrag: "Untersuche, welche Gegenstände du mit und ohne Zimmerlicht sehen kannst.",
    schritte: ["Tippe auf „Zimmerlicht“, sodass dort „aus“ steht, und wähle nacheinander Kerze und Taschenlampe. Lies jedes Mal die Statuszeile.", "Wähle bei ausgeschaltetem Zimmerlicht die Tüte Gummibärchen und den Mond und trage ein, ob du etwas siehst.", "Schalte das Zimmerlicht wieder an und prüfe alle Gegenstände noch einmal – auch das Katzenauge."]
  },
  "li3": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "licht-oberflaeche", seite: 97,
    kapitel: "Licht",
    name: "Warum spiegelt das eine und das andere nicht?",
    titel: "Ein Spiegel aus Papier?",
    frage: "Warum spiegelt das eine und das andere nicht?",
    auftrag: "Vergleiche, was Spiegel, Fensterglas, schwarzes Papier und weißes Papier mit dem Lichtstrahl machen.",
    schritte: ["Wähle nacheinander Spiegel, Fensterglas, schwarzes Papier und weißes Papier und lies in der Statuszeile die drei Prozentzahlen ab.", "Beobachte im Bild genau, auf wie vielen Wegen das Licht beim Spiegel und beim weißen Papier zurückläuft.", "Stelle den „Winkel zum Lot“ erst auf 0° und dann auf 80° und prüfe, ob sich die Prozentzahlen ändern."]
  },
  "li4": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "dunkle-flaechen", seite: 99,
    kapitel: "Licht",
    name: "Warum wird Dunkles in der Sonne heißer?",
    titel: "Heißer Deckel, kühler Deckel",
    frage: "Warum wird Dunkles in der Sonne heißer?",
    auftrag: "Miss, wie warm verschieden gefärbte Flächen in derselben Sonne werden.",
    schritte: ["Wähle unter „Farbe der Fläche wählen“ zuerst schwarz und beobachte, wie die Temperaturanzeige neben der Fläche von 20 °C aus steigt.", "Lies in der Liste „Endtemperatur im Vergleich“ die Werte für alle vier Farben ab und trage sie in die Tabelle ein.", "Vergleiche im Bild, wie viele blaue „reflektiert“-Strahlen bei schwarz und bei silber (blank) zurücklaufen."]
  },
  "li5": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schatten-entstehung", seite: 101,
    kapitel: "Licht",
    name: "Wie entsteht ein Schatten?",
    titel: "Probe für das Schattenspiel",
    frage: "Wie entsteht ein Schatten?",
    auftrag: "Untersuche, wo der Schatten entsteht und wohin er wandert, wenn du die Lampe bewegst.",
    schritte: ["Tippe auf „Gegenstand“, sodass dort „entfernt“ steht, und lies die Statuszeile. Hole den Gegenstand dann zurück.", "Stelle den Regler „Lampe (Höhe)“ nacheinander auf oben, Mitte und unten und beobachte den Schatten an der Bretterwand.", "Trage in die Tabelle ein, wo der Schatten an der Bretterwand liegt – und was ohne Gegenstand passiert."]
  },
  "li6": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schatten-groesse", seite: 103,
    kapitel: "Licht",
    name: "Wovon hängt die Größe des Schattens ab?",
    titel: "Der Wolf an der Bretterwand",
    frage: "Wovon hängt die Größe des Schattens ab?",
    auftrag: "Untersuche, wie sich die Schattengröße B ändert, wenn du nur die Bretterwand oder nur den Pappwolf verschiebst.",
    schritte: ["Wähle „Bretterwand verschieben“ und stelle den Schirmabstand b nacheinander auf 30 cm, 60 cm und 90 cm ein.", "Lies nach jeder Einstellung unter dem Bild die aktuelle Schattengröße B ab und trage sie in die Tabelle ein.", "Wähle danach „Pappwolf verschieben“ und schiebe den Gegenstandsabstand a von 10 cm bis 40 cm – beobachte dabei die Anzeige von B."]
  },
  "li7": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "kern-halbschatten", seite: 105,
    kapitel: "Licht",
    name: "Warum hat ein Schatten manchmal einen Rand?",
    titel: "Der graue Saum",
    frage: "Warum hat ein Schatten manchmal einen grauen Rand?",
    auftrag: "Untersuche, wie sich Rand und Mitte des Schattens verändern, wenn aus der punktförmigen Lichtquelle eine breite Lichtquelle wird.",
    schritte: ["Tippe auf „nur eine Taschenlampe“ und sieh dir den Rand des Schattens an der Wand ganz genau an.", "Schiebe den Regler „Größe der Lichtquelle“ langsam nach rechts, bis neben Quelle „groß ausgedehnt“ steht, und beobachte, was am Rand erscheint.", "Vergleiche mit der Taste „zwei Lampen weit auseinander“ und lies in der Statuszeile ab, welche zwei Schattenbereiche genannt werden."]
  },
  "li8": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "lochkamera", seite: 107,
    kapitel: "Licht",
    name: "Wie malt eine Lochkamera ein Bild?",
    titel: "Die Dose mit dem Loch",
    frage: "Wie malt eine Lochkamera ein Bild?",
    auftrag: "Untersuche am Modell der Lochkamera, wie das Bild auf dem Schirm steht und wovon seine Größe und seine Schärfe abhängen.",
    schritte: ["Beobachte den leuchtenden Pfeil und sein Bild auf dem Schirm und lies in der Statuszeile ab, wie das Bild steht.", "Schiebe zuerst die Gegenstandsweite g auf 60 cm, stelle sie zurück auf 40 cm und schiebe dann die Bildweite b (Kameralänge) auf 55 cm – vergleiche nach jedem Schritt die Bildgröße in der Statuszeile.", "Stelle die Lochgröße von klein auf groß und lies ab, was mit der Schärfe des Bildes passiert."]
  },
  "li9": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "spektrum-unsichtbar", seite: 109,
    kapitel: "Licht",
    name: "Welches Licht sehen wir nicht?",
    titel: "Das Thermometer hinter dem Rot",
    frage: "Welches Licht sehen wir nicht?",
    auftrag: "Miss mit dem Thermometer an verschiedenen Stellen des Lichtbandes, wie stark die Erwärmung ist – auch dort, wo das Auge gar nichts sieht.",
    schritte: ["Tippe auf „555 nm – Grün“ und lies in der Statuszeile ab, wie viel Prozent Erwärmung das Thermometer dort anzeigt.", "Schiebe den Regler „Stelle im Spektrum“ weiter zu „700 nm – letztes Rot“ und dann hinter den roten Rand zu „940 nm – Fernbedienung“ und vergleiche die Prozentwerte.", "Tippe zuletzt auf „365 nm – Schwarzlicht“ und lies ab, ob das Auge dort etwas sieht und womit man diese Stelle nachweisen kann."]
  },
  "op1": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "reflexionsgesetz", seite: 5,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Nach welcher Regel wird Licht am Spiegel zurückgeworfen?",
    titel: "Ein kleiner Stoß, ein weiter Sprung",
    frage: "Nach welcher Regel wird Licht am Spiegel zurückgeworfen?",
    auftrag: "Untersuche, wie Einfallswinkel und Reflexionswinkel zusammenhängen und um wie viel Grad der Strahl beim Drehen des Spiegels schwenkt.",
    schritte: ["Stelle den Einfallswinkel zum Lot nacheinander auf 0°, 30°, 60° und 80° ein.", "Lies nach jeder Einstellung in der Statuszeile ab, wie groß der Reflexionswinkel ist.", "Stelle den Einfallswinkel zum Lot wieder auf 40° und schiebe den Regler „Spiegel drehen“ auf 10°; lies ab, um wie viel Grad der Strahl schwenkt."]
  },
  "op2": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "spiegelbild", seite: 8,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo steht das Bild hinter dem Spiegel?",
    titel: "Der Klebepunkt für das Spiegelbild",
    frage: "Wo steht das Bild hinter dem Spiegel?",
    auftrag: "Miss für verschiedene Abstände g, wie weit das Bild hinter dem Spiegel liegt.",
    schritte: ["Stelle den Abstand Gegenstand–Spiegel g nacheinander auf 40, 110 und 200 ein.", "Lies jeweils in der Statuszeile ab, wie weit das Bild hinter dem Spiegel liegt.", "Beobachte den gestrichelten Pfeil „virtuelles Bild“ und den Strahlverlauf zum Auge, während du g langsam von 40 auf 200 schiebst."]
  },
  "op3": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "brechung-eintritt", seite: 10,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum knickt der Lichtstrahl beim Eintritt ins Glas?",
    titel: "Zwei gerade Strecken, ein Knick",
    frage: "Warum knickt der Lichtstrahl beim Eintritt ins Glas?",
    auftrag: "Prüfe, an welcher Stelle der Lichtstrahl auf dem Weg von Luft in Glas knickt, und vergleiche den Winkel in der Luft mit dem Winkel im Glas.",
    schritte: ["Stelle den Winkel in der Luft nacheinander auf 20°, 40° und 60° ein und lies jeweils in der Statuszeile den Winkel im Glas ab.", "Drücke „genau auf das Lot“ und lies ab, was die Statuszeile über den Knick meldet.", "Vergleiche die gestrichelte ungebrochene Richtung mit dem wirklichen Strahl im Glas; mit „ungebrochene Richtung“ blendest du die Linie aus und wieder ein."]
  },
  "op4": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "brechung-austritt", seite: 12,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was passiert beim Austritt aus dem Glas?",
    titel: "Vorn kommt nichts mehr an",
    frage: "Was passiert beim Austritt aus dem Glas?",
    auftrag: "Bestimme, ab welchem Winkel im Glas kein Licht mehr austritt, und vergleiche vorher die Winkel im Glas und in der Luft.",
    schritte: ["Stelle den Winkel im Glas nacheinander auf 10°, 25° und 40° ein und lies jeweils in der Statuszeile den Winkel in der Luft ab.", "Schiebe den Regler langsam weiter auf 42° und lies ab, was die Statuszeile über den Grenzwinkel meldet.", "Drücke „55° – Totalreflexion“ und beobachte, wohin der Strahl an der geraden Fläche jetzt läuft."]
  },
  "op5": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "totalreflexion", seite: 14,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie hält eine Glasfaser das Licht gefangen?",
    titel: "Die Lampe mit den Glasfäden",
    frage: "Wie hält eine Glasfaser das Licht gefangen?",
    auftrag: "Bestimme den Einfallswinkel, ab dem das Licht den Glasstab nicht mehr verlassen kann.",
    schritte: ["Stelle den Regler „Einfallswinkel an der Wand θ“ auf 20° und lies in der Statuszeile ab, was mit dem Licht passiert.", "Erhöhe den Winkel in Einserschritten von 41° auf 42° und beobachte, wann die Meldung zu „Totalreflexion!“ wechselt.", "Stelle 60° und 75° ein und verfolge den Zickzackweg des Lichts bis zur Anzeige „Licht kommt an →“."]
  },
  "op6": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sammellinse", seite: 17,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was macht eine Sammellinse mit dem Licht?",
    titel: "Zwei Gläser aus der Linsenkiste",
    frage: "Was macht eine Sammellinse mit dem Licht?",
    auftrag: "Vergleiche, wohin die beiden Glassorten ein paralleles Lichtbündel lenken, und bestimme die Rolle der Brennweite.",
    schritte: ["Wähle „in der Mitte dicker“ und lies in der Statuszeile ab, wo sich die Strahlen treffen.", "Stelle den Regler „Wölbung des Glases – Brennweite f“ auf 45 und danach auf 150 und beobachte, wie der Brennpunkt wandert.", "Wähle „in der Mitte dünner“ und prüfe, ob hinter diesem Glas ein heller Fleck entsteht."]
  },
  "op7": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "bild-linse", seite: 19,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo entsteht das Bild einer Linse?",
    titel: "Dieselbe Linse, zwei Bilder",
    frage: "Wo entsteht das Bild einer Linse?",
    auftrag: "Untersuche, wie Größe, Lage und Art des Bildes von der Gegenstandsweite g abhängen.",
    schritte: ["Stelle den Regler „Gegenstandsweite g“ auf 199 und lies unter „Das Bild ist …“ Größe, Ausrichtung und Art des Bildes ab.", "Verkleinere g Schritt für Schritt auf 124 und dann auf 97 und lies jeweils die neue Meldung ab.", "Schiebe den Gegenstand auf g = 40, also näher als die Brennweite f = 62, und vergleiche das Bild mit vorher."]
  },
  "op8": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "auge", seite: 22,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entsteht ein scharfes Bild im Auge?",
    titel: "Die Kamera im Kopf",
    frage: "Wie entsteht ein scharfes Bild im Auge?",
    auftrag: "Untersuche, wie das Auge für nahe und ferne Gegenstände scharf stellt und wozu die Pupille dient.",
    schritte: ["Schiebe den Regler „Abstand des Gegenstands“ ganz nach links auf „nah“ und beobachte die Form der Linse in der Zeichnung.", "Schiebe ihn ganz nach rechts auf „weit“ und lies in der Statuszeile ab, wie die Linse jetzt beschrieben wird.", "Stelle den Regler „Pupille (Helligkeit)“ auf „eng (dunkel)“ und danach auf „weit (hell)“ und beobachte, wie hell die Strahlen gezeichnet werden."]
  },
  "op9": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "brille", seite: 24,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie hilft eine Brille beim Scharfsehen?",
    titel: "Großvaters Brille",
    frage: "Wie hilft eine Brille beim Scharfsehen?",
    auftrag: "Untersuche für beide Sehfehler, wo das Bild ohne Brille liegt und welche Linse es zurück auf die Netzhaut holt.",
    schritte: ["Wähle die Taste „kurzsichtig“ und lies in der Statuszeile ab, wo das Bild ohne Brille liegt.", "Drücke die Taste „Brille“ und beobachte, welche Linse das Bild auf die Netzhaut bringt.", "Drücke die Taste „Brille“ erneut, um sie abzusetzen, und wiederhole dann beide Ablesungen mit der Taste „weitsichtig“."]
  },
  "op10": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "lupe", seite: 26,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum vergrößert eine Lupe?",
    titel: "Die kippende Lupe",
    frage: "Warum vergrößert eine Lupe?",
    auftrag: "Bestimme, wie sich die Vergrößerung der Lupe ändert, wenn der Gegenstand immer näher an die Brennweite rückt.",
    schritte: ["Stelle den Regler „Abstand Gegenstand–Lupe g“ auf 10 und lies die Vergrößerung in der Statuszeile ab.", "Schiebe den Regler nacheinander auf 32, 50 und 54 und notiere jedes Mal die angezeigte Vergrößerung.", "Stelle g auf 56 oder mehr und lies ab, was die Statuszeile jetzt meldet."]
  },
  "op11": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "kamera", seite: 28,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie macht die Kamera ihr Bild?",
    titel: "Scharf durch Verschieben",
    frage: "Wie macht die Kamera ihr Bild?",
    auftrag: "Prüfe, bei welchem Abstand zwischen Linse und Sensor das Bild scharf wird und was die Blende an der Helligkeit ändert.",
    schritte: ["Schiebe den Regler „Abstand Linse–Sensor (Bildweite)“ von 90 langsam nach unten, bis die Statuszeile ein scharfes Bild meldet.", "Bestimme durch Probieren die kleinste und die größte Bildweite, bei der das Bild scharf bleibt.", "Stelle den Regler „Blende (Öffnung)“ erst ganz nach links, dann ganz nach rechts, und lies die Helligkeitsangabe in der Statuszeile ab."]
  },
  "op12": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "teleskop", seite: 30,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie holt ein Fernrohr Fernes heran?",
    titel: "Der Mond steht Kopf",
    frage: "Wie holt ein Fernrohr Fernes heran?",
    auftrag: "Vergleiche den Mond mit bloßem Auge und durch das Teleskop: Größe, Helligkeit und Ausrichtung des Bildes.",
    schritte: ["Wähle die Taste „bloßes Auge“ und beobachte im Sehfeld, wie groß der Mond erscheint und wie herum er steht.", "Wechsle zur Taste „mit Teleskop“ und lies in der Statuszeile ab, wie die Vergrößerung berechnet wird.", "Vergleiche die Tasten „kleine Öffnung“ und „große Öffnung“ und achte darauf, wie hell das Mondbild ist."]
  },
  "op13": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "prisma", seite: 33,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Woraus besteht weißes Licht?",
    titel: "Farben aus farblosem Glas",
    frage: "Woraus besteht weißes Licht?",
    auftrag: "Untersuche mit dem Prisma, ob weißes Licht wirklich aus vielen Farben besteht und ob sich eine einzelne Farbe weiter zerlegen lässt.",
    schritte: ["Wähle die Taste „weißes Licht“ und zähle, in wie viele Farben das Prisma den Strahl auffächert.", "Lies in der Statuszeile unter „Was passiert“ ab, was mit dem weißen Licht geschieht.", "Wähle nacheinander „nur Rot“ und „nur Blau“ und vergleiche: Wird eine einzelne Farbe weiter zerlegt, und welcher Strahl verlässt das Prisma stärker abgelenkt?"]
  },
  "op14": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "farbmischung-additiv", seite: 35,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie mischt ein Bildschirm seine Farben?",
    titel: "Winzige Pünktchen unter der Lupe",
    frage: "Wie mischt ein Bildschirm seine Farben?",
    auftrag: "Prüfe, welche Farben entstehen, wenn rotes, grünes und blaues Licht zusammen auf eine Fläche treffen.",
    schritte: ["Wähle die Taste „Weiß“ und lies in der Statuszeile die Ergebnisfarbe mit ihren Werten für R, G und B ab.", "Stelle mit den Reglern Rot, Grün und Blau nacheinander je zwei Farben auf 255 und die dritte auf 0 und lies jede Ergebnisfarbe ab.", "Wähle die Taste „aus“ und prüfe, welche Farbe übrig bleibt, wenn keine der drei Lichtquellen leuchtet."]
  },
  "op15": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "farbmischung-subtraktiv", seite: 37,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum druckt der Drucker mit anderen Farben?",
    titel: "Die fremden Farben im Drucker",
    frage: "Warum druckt der Drucker mit anderen Farben?",
    auftrag: "Bestimme, welche Farben übrig bleiben, wenn Farbfilter auf weißem Papier nacheinander Rot, Grün und Blau aus dem Licht wegnehmen.",
    schritte: ["Wähle die Taste „ohne Filter“ und lies in der Statuszeile die Werte für die Fläche unter allen drei Filtern ab.", "Wähle nacheinander die Tasten „Blau: C+M“, „Grün: C+Y“ und „Rot: M+Y“ und notiere jeweils Ergebnisfarbe und Werte.", "Schiebe die drei Regler Deckkraft Cyan, Deckkraft Magenta und Deckkraft Gelb auf 100 % und lies in der Liste „Alle Teilflächen nachgerechnet“ die Zeile „alle drei“ ab."]
  },
  "op16": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "regenbogen", seite: 40,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entsteht der Regenbogen?",
    titel: "Der Bogen über dem Schulhof",
    frage: "Wie entsteht der Regenbogen?",
    auftrag: "Untersuche, was weißes Sonnenlicht in einem einzelnen Regentropfen erlebt und wie daraus der ganze Bogen am Himmel wird.",
    schritte: ["Wähle die Taste „ein Tropfen“ und verfolge den weißen Strahl: Suche im Bild die drei Stationen 1 Brechung, 2 Reflexion und 3 Brechung + Farben.", "Lies in der Liste „Im Tropfen passiert“ ab, was an jeder der drei Stationen mit dem Licht geschieht.", "Wähle die Taste „der ganze Bogen“ und beschreibe die Lage von Sonne, Beobachter und Regen – achte auf die Zeile „Rot außen · Violett innen“."]
  },
  "wa1": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "himmelskoerper", seite: 50,
    kapitel: "Der Blick ins Weltall",
    name: "Was leuchtet da am Nachthimmel?",
    titel: "Vier Lichter über dem Schulhof",
    frage: "Was leuchtet da am Nachthimmel?",
    auftrag: "Untersuche, welche Himmelskörper ihr Licht selbst erzeugen und welche nur beleuchtet werden.",
    schritte: ["Tippe nacheinander Sonne, Stern, Mond und Planet an und lies jeweils die Statuszeile.", "Drücke die Taste Sonnenlicht abdecken und wähle erneut alle vier Himmelskörper.", "Drücke Sonnenlicht wieder freigeben und prüfe, welche Körper sofort wieder hell sind."]
  },
  "wa2": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "jahreszeiten", seite: 52,
    kapitel: "Der Blick ins Weltall",
    name: "Warum gibt es Sommer und Winter?",
    titel: "Weihnachten am Strand",
    frage: "Warum gibt es Sommer und Winter?",
    auftrag: "Untersuche, wie steil das Sonnenlicht im Lauf des Jahres bei uns auftrifft und wie lang der Tag dabei ist.",
    schritte: ["Drücke die Taste Sommer und lies im rechten Fenster die Zeile Licht mit Winkel und Kästchenzahl sowie die Tageslänge ab.", "Drücke nacheinander die Tasten Herbst, Winter und Frühling und trage dieselben Werte in die Tabelle ein.", "Ziehe den Regler Position im Jahr langsam von 0° bis 360° und beobachte, wie sich Lichtwinkel und Tageslänge ändern."]
  },
  "wa3": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "mondphasen", seite: 54,
    kapitel: "Der Blick ins Weltall",
    name: "Warum sieht der Mond jede Woche anders aus?",
    titel: "Die schnurgerade Kante",
    frage: "Warum sieht der Mond jede Woche anders aus?",
    auftrag: "Vergleiche die vier Stellungen des Mondes auf seiner Bahn mit der Form, die er dabei am Himmel zeigt.",
    schritte: ["Drücke die Taste Mond der Sonne gegenüber und lies in der Statuszeile ab, was du siehst.", "Drücke danach Mond zwischen Sonne und Erde, Mond seitlich – zunehmend und Mond seitlich – abnehmend und trage jeweils die Statuszeile ein.", "Ziehe den Regler Stellung des Mondes langsam von 0° bis 360° und beobachte im rechten Fenster, wie sich die helle Form ändert."]
  },
  "wa4": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sonnenfinsternis", seite: 56,
    kapitel: "Der Blick ins Weltall",
    name: "Wie entsteht eine Sonnenfinsternis?",
    titel: "Die Brille von 2015",
    frage: "Wie entsteht eine Sonnenfinsternis?",
    auftrag: "Prüfe, bei welcher Mondstellung der Schatten des Mondes die Erde trifft.",
    schritte: ["Lies in der Startstellung (Mondstellung 40) die Statuszeile ab.", "Drücke die Taste Ball genau in die Linie stellen und beobachte das Fenster Blick von der Lichtung.", "Stelle mit dem Regler die Mondstellung 16 ein und vergleiche Kernschatten und Halbschatten auf der Erdkugel."]
  },
  "wa5": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "mondfinsternis", seite: 59,
    kapitel: "Der Blick ins Weltall",
    name: "Wie entsteht eine Mondfinsternis?",
    titel: "Der rote Mond im alten Kalender",
    frage: "Wie entsteht eine Mondfinsternis?",
    auftrag: "Untersuche, bei welcher Lage der Mondbahn eine totale, eine teilweise oder gar keine Mondfinsternis entsteht.",
    schritte: ["Lass den Regler „Mondbahn neben der Schattenmitte“ zuerst auf dem Startwert 40 stehen und lies die Meldung im Statusfeld ab.", "Schiebe den Regler auf 12 und lies ab, welche Finsternis das Statusfeld jetzt meldet.", "Drücke die Taste „Ball genau hinter den Globus stellen“ und beobachte, wie der Mond beim Durchgang durch den Kernschatten kupferrot wird."]
  },
  "wa6": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sonnensystem", seite: 62,
    kapitel: "Der Blick ins Weltall",
    name: "Was unterscheidet die acht Planeten?",
    titel: "Acht Kugeln aus Styropor",
    frage: "Was unterscheidet die acht Planeten?",
    auftrag: "Vergleiche die acht Planeten nach Größe, Umlaufzeit und Aufbau und teile sie in Gruppen ein.",
    schritte: ["Wähle in der Liste „Planet wählen“ nacheinander Merkur, Erde, Jupiter und Neptun und lies im Statusfeld Durchmesser, Abstand und Umlaufzeit ab.", "Schalte auf die Ansicht „Größen“ und vergleiche die vier inneren Planeten mit den vier äußeren.", "Schalte auf „Umlauf“, stelle das Tempo „schnell“ ein und beobachte, welche Planeten die Sonne am schnellsten umrunden."]
  },
  "wa7": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "gravitation", seite: 64,
    kapitel: "Der Blick ins Weltall",
    name: "Warum fällt alles nach unten?",
    titel: "Feder gegen Schraube",
    frage: "Warum fällt alles nach unten?",
    auftrag: "Prüfe, ob Stein und Feder ohne Luft gleich schnell fallen, und bestimme die Fallzeiten auf Mond, Erde und Jupiter.",
    schritte: ["Drücke auf der Erde die Taste „Noch einmal fallen lassen“ und vergleiche, wie Stein und Feder im luftleeren und im luftgefüllten Rohr unten ankommen.", "Wechsle mit den Tasten „Mond“ und „Jupiter“ den Himmelskörper und lies im Statusfeld die Fallbeschleunigung g ab.", "Notiere zu jedem Himmelskörper die Fallzeit aus 1,50 m Höhe aus dem Statusfeld in die Tabelle."]
  },
  "wa8": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "gravitation-abstand", seite: 66,
    kapitel: "Der Blick ins Weltall",
    name: "Wovon hängt die Stärke der Anziehung ab?",
    titel: "Tauziehen am Nachthimmel",
    frage: "Wovon hängt die Stärke der Anziehung ab?",
    auftrag: "Bestimme, wie stark sich die Anziehung ändert, wenn du erst eine Masse und dann den Abstand verdoppelst.",
    schritte: ["Drücke „zurücksetzen“ und lies im Statusfeld den Ausgangswert der Anziehung ab.", "Verdopple mit der Taste „×2 Masse links“ die linke Masse und lies den neuen Wert ab.", "Setze noch einmal zurück, schiebe den Regler „Abstand“ von 1 auf 2 und vergleiche den neuen Wert mit dem Ausgangswert."]
  },
  "wa9": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "planetenbahn", seite: 68,
    kapitel: "Der Blick ins Weltall",
    name: "Warum stürzen die Planeten nicht in die Sonne?",
    titel: "Die unsichtbare Schnur",
    frage: "Warum stürzen die Planeten nicht in die Sonne?",
    auftrag: "Untersuche, wie die Bahn eines Planeten von seiner Startgeschwindigkeit quer zur Sonne abhängt.",
    schritte: ["Drücke ganz klein und lies in der Statuszeile ab, was aus der Bahn wird.", "Drücke nacheinander mittlerer Wert, etwas darüber und Gegenprobe groß und notiere jedes Mal die Bahnform und ob der Planet zurückkommt.", "Schiebe den Regler Startgeschwindigkeit quer zur Sonne von 36 km/s langsam nach oben und bestimme, ab welchem Wert der Planet entkommt."]
  },
  "wa10": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "schwerelosigkeit", seite: 71,
    kapitel: "Der Blick ins Weltall",
    name: "Ist man im All wirklich schwerelos?",
    titel: "Die Waage im Aufzug",
    frage: "Ist man im All wirklich schwerelos?",
    auftrag: "Prüfe mit dem Aufzugversuch, was eine Waage wirklich misst, wenn sich der Aufzug bewegt.",
    schritte: ["Drücke steht still und lies in der Statuszeile ab, wie viel Newton die Waage bei der 60-kg-Person zeigt.", "Drücke beschleunigt nach oben und danach beschleunigt nach unten und notiere jedes Mal Beschleunigung und Anzeige der Waage.", "Drücke Seil reißt: freier Fall und vergleiche die Anzeige mit dem Wert im Stand."]
  },
  "wa11": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "entfernungen", seite: 74,
    kapitel: "Der Blick ins Weltall",
    name: "Wie weit ist ein Lichtjahr?",
    titel: "Die Karte mit den Lichtjahren",
    frage: "Wie weit ist ein Lichtjahr?",
    auftrag: "Bestimme für vier immer fernere Ziele, wie lange ein Lichtblitz von der Erde bis dorthin unterwegs ist.",
    schritte: ["Drücke Lichtblitz senden und verfolge den Blitz von der Erde bis zum Mond; lies in der Statuszeile Entfernung und Laufzeit ab.", "Drücke weiter und arbeite dich über Sonne und nächster Stern bis zur Andromeda-Galaxie vor; notiere zu jedem Ziel aus der Tabelle beide Angaben.", "Lies zu jedem Ziel den letzten Satz der Statuszeile ab: Er verrät, wie lange das Bild zurückliegt, das wir gerade sehen."]
  },
  "wa12": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sternparallaxe", seite: 76,
    kapitel: "Der Blick ins Weltall",
    name: "Wie misst man die Entfernung zu einem Stern?",
    titel: "Der Trick mit dem Daumen",
    frage: "Wie misst man die Entfernung zu einem Stern?",
    auftrag: "Vergleiche bei vier Sternen, wie der gemessene Winkel p mit der Entfernung zusammenhängt.",
    schritte: ["Drücke Proxima Centauri und lies in der Statuszeile den Winkel p und die Entfernung in Parsec ab.", "Wähle danach 61 Cygni und Wega und notiere jedes Mal beide Zahlen.", "Drücke Polarstern und danach Lupe ×100, damit der winzige Sprung im Bild wieder sichtbar wird."]
  },
  "wa13": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sternspektrum", seite: 79,
    kapitel: "Der Blick ins Weltall",
    name: "Was verrät das Licht über einen Stern?",
    titel: "Die Streifen im Sternlicht",
    frage: "Was verrät das Licht über einen Stern?",
    auftrag: "Untersuche die dunklen Streifen im Licht der drei Sterne und bestimme mit dem Vergleichsstreifen, welche Elemente in ihren Gashüllen stecken.",
    schritte: ["Wähle nacheinander die Quellen Stern 1 gelb, Stern 2 blau-weiß und Stern 3 rot und lies unter Beobachtung ab, wie viele dunkle Streifen im Farbband gefunden werden.", "Blende den Vergleichsstreifen ein und lies für jeden Stern ab, wie kräftig Wasserstoff, Helium, Natrium und Eisen zu sehen sind.", "Schiebe den Regler Lupe – Wellenlänge auf 656 nm und auf 486 nm, prüfe, welches Element dort gemeldet wird, und wähle zuletzt die Glühlampe als Gegenprobe."]
  },
  "wa14": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sternleben", seite: 82,
    kapitel: "Der Blick ins Weltall",
    name: "Wie lebt und stirbt ein Stern?",
    titel: "Ein Sternleben im Zeitraffer",
    frage: "Wie lebt und stirbt ein Stern?",
    auftrag: "Untersuche, wie die Masse eines Sterns über seine Lebensdauer, seine Farbe und sein Ende entscheidet.",
    schritte: ["Wähle die Masse 0,5 und lass den Lebenslauf einmal ganz durchlaufen, bis sich die Zeile unter Deine Tabelle füllt.", "Wiederhole das mit den Massen 1 und 10 und lies unter Messwerte jeweils Lebensdauer, Farbe, Leuchtkraft und Ende ab.", "Starte die Gegenprobe 25 und prüfe, ob die Lebensdauer noch weiter fällt oder wieder steigt."]
  },
  "wa15": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "weltbild", seite: 84,
    kapitel: "Der Blick ins Weltall",
    name: "Wer steht in der Mitte? Zwei Weltbilder",
    titel: "Die vergilbte Himmelskarte",
    frage: "Wer steht in der Mitte – die Erde oder die Sonne?",
    auftrag: "Vergleiche das alte und das heutige Weltbild und prüfe, welches von beiden den Himmel einfacher erklärt.",
    schritte: ["Wähle Erde in der Mitte (alt) und lies unter Welches Weltbild? ab, womit das alte Modell die Schleifen der Planeten erklärt.", "Wähle Sonne in der Mitte (heute) und zähle die Kreise, die der Mars braucht: links die Bahn samt gestricheltem Zusatzkreis, rechts nur eine Bahn.", "Beobachte den Streifen unten im Bild und achte darauf, wo die Erde gerade steht, wenn die Spur des Mars orange wird."]
  },
  "wa16": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "rueckstoss", seite: 87,
    kapitel: "Der Blick ins Weltall",
    name: "Wie kommt eine Rakete vom Fleck?",
    titel: "Start ins Nichts",
    frage: "Wie kommt eine Rakete vom Fleck?",
    auftrag: "Miss, wie schnell die Rakete wird, wenn du Gasmasse und Gasgeschwindigkeit veränderst.",
    schritte: ["Stelle die ausgestoßene Gasmasse auf 20 kg und die Geschwindigkeit des Gases auf 600 m/s, drücke Gas ausstoßen und lies die Geschwindigkeit der Rakete ab.", "Verdopple die Gasmasse auf 40 kg und stelle danach 100 kg ein – lies jedes Mal neu ab.", "Stelle die Gasmasse zurück auf 20 kg, verdopple die Gasgeschwindigkeit auf 1200 m/s und vergleiche mit dem Wert bei 40 kg Gas."]
  },
  "me1": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "bewegung-beschreiben", seite: 5,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie beschreibt man eine Bewegung genau?",
    titel: "Streit auf dem Flur",
    frage: "Wie beschreibt man eine Bewegung genau?",
    auftrag: "Untersuche, mit welchen zwei Größen sich die Fahrt des Autos vollständig beschreiben lässt.",
    schritte: ["Starte das Auto mit „Start“ und beobachte, wie in der Statuszeile Zeit t und Weg s wachsen.", "Nimm während der Fahrt mit „Momentaufnahme“ drei Wertepaare auf und lies sie in der Tabelle ab.", "Fahre nach „Zurücksetzen“ noch einmal und prüfe, ob zu gleichen Zeiten wieder gleiche Wege gehören."]
  },
  "me2": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "v-messen", seite: 8,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie misst man Geschwindigkeit?",
    titel: "Eine Zahl mit Einheit",
    frage: "Wie misst man Geschwindigkeit?",
    auftrag: "Miss für die drei Tempostufen die Fahrzeit auf der 10-m-Strecke und bestimme daraus jeweils die Geschwindigkeit.",
    schritte: ["Wähle das Tempo „langsam“ und starte die Fahrt mit „Messung starten“.", "Lies in der Statuszeile die gestoppte Zeit t und die berechnete Geschwindigkeit v ab.", "Wiederhole die Messung mit den Tempos „mittel“ und „schnell“ und vergleiche die drei Zeiten."]
  },
  "me3": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "v-formel", seite: 10,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Strecke geteilt durch Zeit - was sagt v aus?",
    titel: "Zweimal dieselbe Zahl",
    frage: "Strecke geteilt durch Zeit – was sagt v aus?",
    auftrag: "Vergleiche verschiedene Kombinationen aus Strecke s und Zeit t und prüfe, wann dieselbe Geschwindigkeit herauskommt.",
    schritte: ["Stelle mit den Tasten „100 m“ und „10 s“ die erste Fahrt ein und lies v in der Statuszeile ab.", "Wähle „200 m“ bei „10 s“ und danach „100 m“ bei „20 s“ und beobachte, wie sich v ändert.", "Stelle „50 m“ und „5 s“ ein und vergleiche das Ergebnis mit der ersten Fahrt."]
  },
  "me4": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "v-umrechnung", seite: 12,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie rechnet man km/h in m/s um?",
    titel: "Tempo 30 gegen Rollwagen",
    frage: "Wie rechnet man km/h in m/s um?",
    auftrag: "Bestimme den Umrechnungsfaktor zwischen m/s und km/h und rechne damit Alltagsgeschwindigkeiten um.",
    schritte: ["Stelle mit „langsamer“ und „schneller“ verschiedene Werte ein und lies beide Anzeigen in m/s und km/h ab.", "Wähle nacheinander die Beispiele „Fußgänger“, „Radfahrer“, „Auto (Stadt)“ und „ICE“ und notiere die Wertepaare.", "Prüfe in der Statuszeile die Rückrechnung: km/h geteilt durch 3,6 muss wieder den m/s-Wert ergeben."]
  },
  "me5": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "weg-zeit-diagramm", seite: 14,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was verrät das Weg-Zeit-Diagramm?",
    titel: "Die Linie, die bergauf führt",
    frage: "Was verrät das Weg-Zeit-Diagramm?",
    auftrag: "Untersuche, wie sich schnelle Fahrt, langsame Fahrt und Stillstand in der Linie des Weg-Zeit-Diagramms zeigen.",
    schritte: ["Wähle die Fahrt schnell und drücke Fahren – beobachte den Wagen auf der Fahrbahn und die Linie im Diagramm gleichzeitig.", "Drücke Zurücksetzen, wähle langsam und starte erneut mit Fahren – vergleiche die Steilheit der beiden Geraden.", "Wähle mit Pause, starte mit Fahren und lies in der Statuszeile ab, was der waagerechte Abschnitt der Linie bedeutet."]
  },
  "me6": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "beschleunigung", seite: 16,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was ist Beschleunigung?",
    titel: "Immer schneller die Rampe hinab",
    frage: "Was ist Beschleunigung?",
    auftrag: "Miss mit den Lichtschranken, wie Zeit und Geschwindigkeit an den Marken wachsen, und bestimme die Beschleunigung aus der Steigung der v-t-Geraden.",
    schritte: ["Stelle den Regler Beschleunigung a auf 2,0 m/s² und drücke Lichtschranken-Messfahrt – die Tabelle füllt sich mit a, s, t und v.", "Wähle in der Auswertung die Auftragung t → v und lies die Steigung der Ursprungsgeraden sowie das Ergebnis Beschleunigung a ab.", "Stelle den Regler auf 4,0 m/s², drücke erneut Lichtschranken-Messfahrt und vergleiche die Steilheit der beiden Geraden."]
  },
  "me7": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "kraft-wirkungen", seite: 18,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Woran erkennt man, dass eine Kraft wirkt?",
    titel: "Verbeult, gebremst, abgeprallt",
    frage: "Woran erkennt man, dass eine Kraft wirkt?",
    auftrag: "Untersuche an sechs Alltagssituationen, welche Wirkungen eine Kraft haben kann, und ordne jede Situation der passenden Wirkung zu.",
    schritte: ["Wähle die Situation Fahrrad abbremsen und entscheide dich für eine der Tasten Verformen, Bewegen oder Richtung – die Anzeige verrät, ob die Zuordnung stimmt.", "Ordne die übrigen fünf Situationen zu und lies am Zähler ab, wie viele von 6 richtig sind.", "Drücke Zurücksetzen und sortiere alle sechs Situationen noch einmal, bis die Meldung Alle 6 zugeordnet – 6 richtig erscheint."]
  },
  "me8": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "masse-gewicht", seite: 20,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Ist schwer dasselbe wie viel Masse?",
    titel: "Zehn Kilo oder 98 Newton?",
    frage: "Ist schwer dasselbe wie viel Masse?",
    auftrag: "Vergleiche bei vier Körpern die Anzeige der Waage mit der Anzeige des Kraftmessers und bestimme den Zusammenhang zwischen Masse und Gewichtskraft.",
    schritte: ["Wähle den Körper 1 kg und lies in der Statuszeile Masse und Gewichtskraft ab.", "Stelle nacheinander 100 g, 500 g und 2 kg ein und übertrage Waagen- und Kraftmesser-Anzeige in die Tabelle.", "Prüfe mit der eingeblendeten Formel F = m · g (g = 9,8 N/kg), ob die angezeigte Gewichtskraft jeweils zur Masse passt."]
  },
  "me9": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "ortsfaktor", seite: 22,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wäre die Kiste auf dem Mond leichter?",
    titel: "Toms Mondwunsch",
    frage: "Wäre die Kiste auf dem Mond leichter?",
    auftrag: "Vergleiche für dieselbe Masse von 60 kg den Ortsfaktor g und die Gewichtskraft F auf Mond, Erde und Jupiter.",
    schritte: ["Wähle bei Ort die Taste Erde und lies in der Statuszeile den Ortsfaktor g und die Gewichtskraft F ab.", "Wähle danach die Orte Mond und Jupiter und lies jedes Mal g und F ab.", "Vergleiche die drei Statuszeilen: Welche Angabe bleibt an allen Orten gleich?"]
  },
  "me10": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "kraftpfeil", seite: 24,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie zeichnet man eine Kraft?",
    titel: "Der Zug in die falsche Richtung",
    frage: "Wie zeichnet man eine Kraft?",
    auftrag: "Untersuche, wie der Kraftpfeil Betrag, Richtung und Angriffspunkt einer Kraft sichtbar macht.",
    schritte: ["Stelle bei Betrag nacheinander 2 N, 4 N und 6 N ein und beobachte die Länge des roten Pfeils.", "Wähle bei Richtung nacheinander die Tasten →, ↑ und ↗ und lies in der Statuszeile ab, wohin der Körper gezogen würde.", "Prüfe mit der Legende im Bild, wofür Pfeil-Länge, Pfeil-Richtung und der Punkt am Pfeilanfang stehen."]
  },
  "me11": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "kraefte-addieren", seite: 26,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was passiert, wenn zwei Kräfte gleichzeitig ziehen?",
    titel: "Zweimal ziehen, zwei Ergebnisse",
    frage: "Was passiert, wenn zwei Kräfte gleichzeitig ziehen?",
    auftrag: "Bestimme die Gesamtkraft von zwei Kräften längs einer Linie – erst bei gleicher, dann bei entgegengesetzter Richtung.",
    schritte: ["Lies in der Statuszeile die Gesamtkraft ab, solange F1 = 3 N und F2 = 2 N beide nach rechts zeigen.", "Drücke bei Kraft 2 die Taste ⇄ Richtung und lies die neue Gesamtkraft ab.", "Drücke bei Kraft 2 einmal die Taste + N und beobachte, was die Anzeige bei 3 N gegen 3 N meldet."]
  },
  "me12": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "kraefte-gleichgewicht", seite: 28,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wann heben sich Kräfte auf?",
    titel: "Der Scheinwerfer, der nicht fällt",
    frage: "Wann heben sich Kräfte auf?",
    auftrag: "Prüfe, bei welcher Haltekraft die Lampe trotz der Gewichtskraft von 5 N in Ruhe bleibt.",
    schritte: ["Lies zuerst die Statuszeile bei Haltekraft 5 N ab und beobachte, ob sich die Lampe bewegt.", "Drücke zweimal die Taste + N, bis die Haltekraft 7 N beträgt, und lies die Gesamtkraft ab.", "Drücke viermal die Taste – N, lies bei Haltekraft 3 N die Gesamtkraft ab und hole die Lampe danach mit ↺ zurück in die Mitte."]
  },
  "me13": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "wechselwirkung", seite: 31,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Warum gibt es zu jeder Kraft eine Gegenkraft?",
    titel: "Der Stoß nach hinten",
    frage: "Warum gibt es zu jeder Kraft eine Gegenkraft?",
    auftrag: "Untersuche in drei Beispielen, welche Kräfte beim Abstoßen auf beide Körper wirken und wovon abhängt, wer von beiden schneller wird.",
    schritte: ["Wähle das Beispiel Eisläufer, drücke Abstoßen und lies in der Statuszeile für Läufer A und Läufer B jeweils m und v ab.", "Wechsle zum Beispiel Boot, drücke wieder Abstoßen und vergleiche die Geschwindigkeiten von Boot und Person.", "Wähle das Beispiel Rakete und prüfe in der Statuszeile, wievielmal so schnell das leichte Gas gegenüber der Rakete wird."]
  },
  "me14": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "reibung", seite: 34,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wann stört Reibung - und wann rettet sie?",
    titel: "Der gebohnerte Streifen",
    frage: "Wann stört Reibung – und wann rettet sie?",
    auftrag: "Untersuche, wie die Reibungskraft F_R das Anfahren und das Ausrollen des Wagens bestimmt.",
    schritte: ["Lass den Wagen mit der Antriebskraft F = 80 N anfahren und lies im Bild die Reibungskraft F_R sowie den Verlauf im v-t-Diagramm ab.", "Schiebe die Antriebskraft F auf 0 N und verfolge im v-t-Diagramm, wie v bis auf 0,0 m/s sinkt.", "Stelle den Reibungskoeffizienten μ auf 0, gib erneut Antriebskraft F = 80 N und nimm sie wieder weg – beobachte, was v jetzt macht."]
  },
  "me15": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "hebel", seite: 37,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie hebelt man das Zehnfache?",
    titel: "Die lange Eisenstange",
    frage: "Wie hebelt man das Zehnfache?",
    auftrag: "Bestimme, wie Kraftarm, Kraft und Weg am Hebel zusammenhängen – und was dabei immer gleich bleibt.",
    schritte: ["Stelle die Last F₂ auf 200 N und den Kraftarm l₁ auf 1,00 m und lies unter Nachgerechnet die Kraft F₁ und den Kraftweg s₁ ab.", "Drücke nacheinander die Tasten gleich lang – nichts gespart und achtfach – ein Achtel der Kraft und notiere jeweils F₁ und s₁.", "Vergleiche in jeder Einstellung die beiden Arbeiten W₁ und W₂ unter Und jetzt beide Arbeiten."]
  },
  "me16": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "flaschenzug", seite: 40,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie hebt ein Flaschenzug die schwere Box?",
    titel: "Acht Meter Seil für zwei Meter Höhe",
    frage: "Wie hebt ein Flaschenzug die schwere Box?",
    auftrag: "Prüfe, wie die Zahl der tragenden Seilstücke die Zugkraft und den Seilweg verändert – und was dabei mit der Arbeit passiert.",
    schritte: ["Stelle die Last auf 600 N, wähle n = 1 · volle Kraft und lies unter Nachgerechnet die Kraft F und den Weg s ab.", "Schiebe den Regler Tragende Seilstücke auf 2, 3 und 4, zähle die grün nummerierten Seilstücke im Bild mit und notiere jedes Mal F und s.", "Vergleiche für jede Einstellung die Hubarbeit und die Zugarbeit unter Die Arbeit bleibt gleich."]
  },
  "me17": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "schiefe-ebene", seite: 42,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was spart die Rampe wirklich?",
    titel: "Halbe Kraft, doppelter Weg",
    frage: "Was spart die Rampe wirklich?",
    auftrag: "Vergleiche für die flache, die mittlere und die steile Rampe die Zugkraft, die Weglänge und das Produkt Kraft × Weg.",
    schritte: ["Wähle bei „Rampe:“ die Einstellung flach und lies unter „Zugkraft und Weg“ die Zugkraft F und den Weg ab.", "Stelle danach mittel und steil ein und trage Zugkraft, Weg und Kraft × Weg jeweils in die Tabelle ein.", "Vergleiche jede Zugkraft mit dem roten Pfeil „senkrecht“ mit 6 N rechts im Bild."]
  },
  "me18": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "energieformen", seite: 44,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Welche Formen hat Energie?",
    titel: "Brot, Tee und Batterie",
    frage: "Welche Formen hat Energie?",
    auftrag: "Vergleiche sechs verschiedene Energiespeicher mit demselben Maß: Wie hoch hebt jeder den 10-kg-Sack?",
    schritte: ["Wähle die gespannte Sprungfeder und lies ab, wie viel Energie sie speichert und wie hoch sie den 10-kg-Sack hebt.", "Stelle nacheinander Kiste auf dem Regal, volle AA-Batterie und Butterbrot ein und trage Energie und Hubhöhe in die Tabelle ein.", "Prüfe mit rollender Fußball und Tasse heißer Tee, wo beide auf der Skala zwischen 1 cm und 10 km landen – sie springt je Stufe auf das Zehnfache."]
  },
  "me19": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "lageenergie", seite: 46,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie berechnet man Lageenergie?",
    titel: "Hoch gehoben, tief geschlagen",
    frage: "Wie berechnet man Lageenergie?",
    auftrag: "Untersuche, wie die Lageenergie eines Klotzes von seiner Masse und seiner Höhe abhängt, und prüfe die Formel E = m · g · h.",
    schritte: ["Stelle mit den Reglern Masse m auf 5 kg und Höhe h auf 3 m, drücke „Fallen lassen“ und lies Lageenergie und Einschlagtiefe des Pfahls ab.", "Drücke ×2 Masse, lass den Klotz erneut fallen und notiere, wie sich Lageenergie und Pfahltiefe ändern.", "Wähle zurücksetzen, drücke ×2 Höhe, lass den Klotz wieder fallen und vergleiche: Wirkt die doppelte Höhe genauso stark wie die doppelte Masse?"]
  },
  "me20": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "bewegungsenergie", seite: 48,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wohin geht die Energie beim Rollen und Federn?",
    titel: "Die entwischte Rollbox",
    frage: "Wohin geht die Energie beim Rollen?",
    auftrag: "Untersuche mit der rollenden Kugel, wie die Schiebestrecke des Klotzes von Masse und Tempo abhängt.",
    schritte: ["Drücke „Rollen lassen“ und lies in der Statuszeile ab, welche Energie E die Kugel mit 4 kg und 4 m/s hat und wie weit sie den Klotz schiebt.", "Drücke „×2 Masse“, lass die Kugel mit „Rollen lassen“ erneut los und trage Energie und Schiebestrecke in die Tabelle ein.", "Stelle mit „zurücksetzen“ den Anfang wieder her, drücke „×2 Tempo“ und dann „Rollen lassen“ – vergleiche die neue Schiebestrecke mit den beiden ersten."]
  },
  "me21": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "energieerhaltung", seite: 51,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Geht Energie verloren?",
    titel: "Der müde Ball",
    frage: "Geht Energie verloren?",
    auftrag: "Prüfe am springenden Ball, ob die Summe aus Lage- und Bewegungsenergie erhalten bleibt.",
    schritte: ["Beobachte den Ball bei „Höhe h“ = 20 m und „Masse m“ = 2 kg und lies im Infofeld ab, wie E_pot beim Fallen ab- und E_kin zunimmt.", "Notiere die Summe E_pot + E_kin an einem Punkt während des Flugs und vergleiche sie mit den 392 J vom Start.", "Miss mit der gestrichelten Linie „letzte Sprunghöhe“ und der Angabe „Sprunghöhe“ im Infofeld, wie hoch der Ball nach dem ersten und dem zweiten Aufprall noch kommt, und trage die Werte in die Tabelle ein."]
  },
  "me22": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "leistung", seite: 53,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was sagt die Leistung über die Arbeit?",
    titel: "Endspurt mit dem Rollwagen",
    frage: "Was sagt die Leistung über die Arbeit?",
    auftrag: "Untersuche, wie die Leistung P bei fester Kraft vom Tempo abhängt und welcher Anteil davon als Nutzleistung ankommt.",
    schritte: ["Beobachte bei „Kraft F“ = 100 N im Infofeld, wie die Leistung P mitwächst, während das Auto schneller wird, und lies zu einem Zeitpunkt P ab.", "Lies im selben Augenblick unter dem grünen Balken den Wert P_nutz ab und trage beide Werte in die Tabelle ein.", "Stelle „Wirkungsgrad η“ auf 50 % und prüfe, welcher Anteil von P jetzt noch als P_nutz übrig bleibt."]
  },
  "da1": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "dichte", seite: 63,
    kapitel: "Druck und Auftrieb",
    name: "Warum ist Styropor leicht und Stahl schwer?",
    titel: "Der leichte Riese",
    frage: "Warum ist Styropor leicht und Stahl schwer?",
    auftrag: "Untersuche, wie viel Masse gleich große Würfel aus verschiedenen Stoffen haben, und bestimme daraus, was einen Stoff leicht oder schwer macht.",
    schritte: ["Stelle den Regler Kantenlänge a auf 10 cm und wähle nacheinander die Sprungmarken Eisen · 10 cm, Wasser · genau 1 kg, Fichtenholz · 10 cm und Styropor · 10 cm.", "Lies unter Nachgerechnet jeweils die Masse m und die Gewichtskraft G ab und trage beide in die Tabelle ein.", "Wähle zuletzt den Stoff Blei und vergleiche seine Masse mit der des gleich großen Styroporwürfels."]
  },
  "da2": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "druck-flaeche", seite: 66,
    kapitel: "Druck und Auftrieb",
    name: "Warum trägt der Schnee den Ski, aber nicht den Stiefel?",
    titel: "Löcher im Rasen",
    frage: "Warum trägt der Schnee den Ski, aber nicht den Stiefel?",
    auftrag: "Vergleiche den Druck, den dieselbe Person auf verschieden großen Auflageflächen ausübt, und prüfe, ob ein Elefant stärker drückt als ein Stöckelabsatz.",
    schritte: ["Wähle die Marke Turnschuhe und lies unter Nachgerechnet die Gewichtskraft F und den Druck p ab.", "Verkleinere die Auflagefläche mit dem Regler auf 1 cm², ohne die Masse zu verändern, und beobachte, wie der Körper im Bild einsinkt.", "Wähle danach die Marken Skier und Elefant und trage alle Werte in die Tabelle ein."]
  },
  "da3": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "schweredruck", seite: 68,
    kapitel: "Druck und Auftrieb",
    name: "Warum drückt das Wasser unten stärker?",
    titel: "Die Beule in der Beckenwand",
    frage: "Warum drückt das Wasser unten stärker?",
    auftrag: "Miss den Schweredruck in verschiedenen Tiefen und prüfe, wovon er abhängt – und wovon nicht.",
    schritte: ["Stelle in Wasser mit dem Regler Tiefe nacheinander 10 m, 20 m und 40 m ein und lies unter Nachgerechnet jeweils den Schweredruck ab.", "Drücke die Taste 0 m – Oberfläche und vergleiche den Gesamtdruck dort mit dem Gesamtdruck in 10 m Tiefe.", "Drücke die Taste 10 m – doppelter Druck, wechsle die Flüssigkeit zu Öl und zu Quecksilber und beobachte die aufsteigenden Blasen."]
  },
  "da4": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "luftdruck-hoehe", seite: 70,
    kapitel: "Druck und Auftrieb",
    name: "Wie schwer ist die Luft über uns?",
    titel: "Ein Schulbus aus Luft",
    frage: "Wie schwer ist die Luft über uns?",
    auftrag: "Untersuche, wie der Luftdruck mit der Höhe abnimmt, und prüfe, ob er gleichmäßig fällt.",
    schritte: ["Drücke die Taste Meereshöhe · 0 m und lies unter Nachgerechnet den Druck und den Anteil vom Bodendruck ab.", "Drücke nacheinander die Tasten Zugspitze · 2962 m, Mont Blanc · 4810 m und halber Druck · 5538 m und trage die Werte ein.", "Schiebe den Regler Höhe h langsam bis 9000 m und verfolge, wie der rote Punkt auf der Kurve p(h) wandert."]
  },
  "da5": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "auftrieb", seite: 72,
    kapitel: "Druck und Auftrieb",
    name: "Woher kommt der Auftrieb?",
    titel: "Der Anker, der leichter wird",
    frage: "Woher kommt der Auftrieb?",
    auftrag: "Bestimme Gewichtskraft und Auftrieb des Eisenwürfels und prüfe, wovon der Auftrieb abhängt – und wovon nicht.",
    schritte: ["Drücke die Taste massiv – sinkt und lies unter Nachgerechnet die Gewichtskraft G und den Auftrieb F_A ab.", "Stelle den Regler Hohlraum im Würfel auf 50 % und vergleiche: Wie ändert sich G, wie ändert sich F_A?", "Drücke wieder die Taste massiv – sinkt, wechsle zur Taste Meerwasser und lies F_A erneut ab."]
  },
  "da6": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "auftrieb", seite: 75,
    kapitel: "Druck und Auftrieb",
    name: "Steigen, schweben, sinken - was entscheidet?",
    titel: "Ein Prozent entscheidet",
    frage: "Steigen, schweben, sinken – was entscheidet?",
    auftrag: "Prüfe, bei welchem Hohlraum der Eisenwürfel zu schwimmen beginnt, und vergleiche Süßwasser mit Meerwasser.",
    schritte: ["Drücke nacheinander die Tasten 87 % – sinkt noch und 88 % – schwimmt gerade und lies unter Nachgerechnet jeweils die mittlere Dichte ab.", "Drücke die Taste 90 % – Schiff und lies ab, wie viel Prozent des Würfels unter Wasser liegen.", "Stelle den Regler Hohlraum im Würfel zurück auf 87 %, wechsle zur Taste Meerwasser und beobachte, ob der Würfel jetzt schwimmt."]
  },
  "la1": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "ladungen-kraft", seite: 5,
    kapitel: "Ladungen und Felder",
    name: "Wann ziehen sich Ladungen an, wann stoßen sie sich ab?",
    titel: "Wenn die Folie knistert",
    frage: "Wann ziehen sich Ladungen an, wann stoßen sie sich ab?",
    auftrag: "Untersuche, wie das Vorzeichen der beiden Kugeln und ihr Abstand über Richtung und Betrag der Kraft entscheiden.",
    schritte: ["Wähle die Marke „plus und minus“ und lies unter „Was wirkt hier?“ ab, ob sich die Kugeln anziehen und wie groß die Kraft in µN ist.", "Wähle bei gleichem Abstand die Marke „beide plus“ und vergleiche Richtung und Betrag der Kraft.", "Wähle die Marke „Abstand verdoppeln“ (von 6 cm auf 12 cm) und lies die Kraft erneut ab."]
  },
  "la2": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "elektroskop", seite: 7,
    kapitel: "Ladungen und Felder",
    name: "Wie macht ein Elektroskop Ladung sichtbar?",
    titel: "Der Zeiger, der stehen bleibt",
    frage: "Wie macht ein Elektroskop Ladung sichtbar?",
    auftrag: "Vergleiche, wie sich der Zeiger verhält, wenn du den Stab nur näherst und wenn du das Elektroskop wirklich berührst.",
    schritte: ["Wähle die Marke „Nur nähern – Influenz“ und lies unter „Nachgerechnet“ Influenz-Anteil, Ladung Q und Zeigerwinkel α ab.", "Wähle die Marke „Berührt, Stab wieder weg“ und vergleiche, welche Ladung jetzt auf dem Elektroskop sitzt und wie groß α ist.", "Wähle die Marke „Volle Ladung, ganz nah“ und lies den größten Zeigerwinkel ab."]
  },
  "la3": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "efeld", seite: 10,
    kapitel: "Ladungen und Felder",
    name: "Was liegt um eine Ladung herum?",
    titel: "Kraft im leeren Raum",
    frage: "Was liegt um eine Ladung herum?",
    auftrag: "Bestimme, wie die elektrische Feldstärke E zwischen zwei Platten von der Spannung U und vom Plattenabstand d abhängt.",
    schritte: ["Stelle den Regler „Spannung U“ auf 100 V und „Plattenabstand d“ auf 10 cm und lies die Feldstärke E im Infofeld ab.", "Verdopple „Spannung U“ auf 200 V; stelle danach – wieder bei 100 V – „Plattenabstand d“ auf 5 cm und lies E jeweils neu ab.", "Setze mit einem Tipp auf die Animation eine positive Probeladung zwischen die Platten und beobachte, wohin der rote Kraftpfeil zeigt."]
  },
  "la4": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "blitz", seite: 13,
    kapitel: "Ladungen und Felder",
    name: "Wie entsteht ein Blitz?",
    titel: "Wenn die Luft nicht mehr aushält",
    frage: "Wie entsteht ein Blitz?",
    auftrag: "Untersuche, ab welcher Feldstärke die Luft leitend wird und wie sich aus der Zeit bis zum Donner die Entfernung des Gewitters berechnen lässt.",
    schritte: ["Schiebe den Regler „Feld zwischen Wolke und Boden“ langsam höher und lies ab, bei welcher Feldstärke die Luft leitend wird.", "Vergleiche mit den Tasten „knapp darunter“ und „knapp darüber“, ob der Kanal zündet.", "Stelle mit „Entfernung des Gewitters“ nacheinander 1 km, 3 km und 6 km ein und lies bei „Was gerade passiert“ die Zeit bis zum Donner ab."]
  },
  "la5": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "spannung", seite: 16,
    kapitel: "Ladungen und Felder",
    name: "Was ist Spannung wirklich?",
    titel: "Was das Voltmeter anzeigt",
    frage: "Was ist Spannung wirklich?",
    auftrag: "Untersuche, wie sich die Spannung am Voltmeter ändert, wenn du eine, zwei oder drei Batteriezellen einsetzt, und was dabei mit der Lampe geschieht.",
    schritte: ["Setze mit der Taste „1 Zelle (1,5 V)“ eine einzelne Zelle ein und lies die Spannung am Voltmeter ab.", "Schalte über „2 Zellen (3 V)“ und „3 Zellen (4,5 V)“ weiter und vergleiche jedes Mal, wie hell die Lampe wird.", "Drücke „↺ Zurücksetzen“ und beschreibe, wie der Antrieb der Quelle mit der Zahl der Zellen zusammenhängt."]
  },
  "la6": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "elektronen-drift", seite: 18,
    kapitel: "Ladungen und Felder",
    name: "Warum leitet Metall und Gummi nicht?",
    titel: "Was im Draht wirklich wandert",
    frage: "Warum leitet Metall, und Gummi nicht?",
    auftrag: "Untersuche im Kupferdraht, wie schnell die freien Elektronen wandern und wie sich ihre Geschwindigkeit ändert, wenn du Stromstärke und Querschnitt einstellst.",
    schritte: ["Wähle nacheinander die Tasten „Handy-Ladegerät“, „Leselampe“ und „Wasserkocher“ und lies bei „Nachgerechnet“ die Driftgeschwindigkeit v ab.", "Stelle mit dem Regler „Stromstärke“ größere Werte ein und beobachte, wie sich v verändert.", "Vergrößere mit dem Regler „Querschnitt des Drahtes“ die Fläche und vergleiche, ob die Elektronen dann schneller oder langsamer wandern."]
  },
  "wi1": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "stromstaerke", seite: 29,
    kapitel: "Stromkreise und Widerstand",
    name: "Wie viel fließt da eigentlich?",
    titel: "Der erste Blick aufs Amperemeter",
    frage: "Wie viel fließt da eigentlich durch den Scheinwerfer?",
    auftrag: "Untersuche, wie sich die Stromstärke am Amperemeter ändert, wenn du den Strom stärker stellst oder den Kreis öffnest.",
    schritte: ["Stelle den Strom nacheinander auf schwach, mittel und stark und lies jedes Mal die Stromstärke am Amperemeter ab.", "Vergleiche, wie hell die Lampe bei den drei Stufen leuchtet.", "Drücke auf Schalter: geschlossen, sodass er offen steht, und lies die Stromstärke erneut ab."]
  },
  "wi2": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "widerstand", seite: 31,
    kapitel: "Stromkreise und Widerstand",
    name: "Was bremst den Strom?",
    titel: "Drei Bauteile am selben Kabel",
    frage: "Was bremst den Strom in der Leitung?",
    auftrag: "Vergleiche bei gleicher Spannung von 4,5 V, wie stark der Strom bei den drei Bauteilen mit verschiedenem Widerstand ist.",
    schritte: ["Wähle nacheinander die Bauteile kleiner Widerstand, mittel und großer Widerstand aus.", "Lies bei jedem Bauteil den Widerstand R und die Stromstärke I aus der Statuszeile ab.", "Prüfe an einem Bauteil mit R = U/I, ob der Wert aus der Statuszeile herauskommt."]
  },
  "wi3": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "ohmsches-gesetz", seite: 33,
    kapitel: "Stromkreise und Widerstand",
    name: "Wann gilt das Ohmsche Gesetz?",
    titel: "Wenn der Widerstand gleich bleibt",
    frage: "Wann gilt das Ohmsche Gesetz U = R · I?",
    auftrag: "Bestimme bei festem Widerstand von 100 Ω, wie sich die Stromstärke ändert, wenn du die Spannung verdoppelst.",
    schritte: ["Stelle den Regler Widerstand R fest auf 100 Ω ein.", "Stelle den Regler Spannung U nacheinander auf 6 V, 12 V und 24 V und lies jedes Mal die Stromstärke I ab.", "Vergleiche, um welchen Faktor der Strom wächst, wenn du die Spannung verdoppelst."]
  },
  "wi4": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "ohm-kennlinie", seite: 36,
    kapitel: "Stromkreise und Widerstand",
    name: "Was verrät die Kennlinie?",
    titel: "Punkt für Punkt eine Gerade",
    frage: "Was verrät die U-I-Kennlinie über den Widerstand?",
    auftrag: "Miss bei festem Widerstand für mehrere Spannungen die Stromstärke und trage die Punkte als Kennlinie auf.",
    schritte: ["Wähle den Widerstand 10 Ω und stelle mit weniger und mehr die Spannung ein.", "Setze für 1,5 V, 3 V, 4,5 V und 6 V je einen Messpunkt und lies die Wertetabelle mit U, I und R = U/I ab.", "Betrachte die aufgetragenen Punkte und beschreibe die Form der Kennlinie."]
  },
  "wi5": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "draht", seite: 38,
    kapitel: "Stromkreise und Widerstand",
    name: "Lang, dünn oder woraus? Der Draht entscheidet",
    titel: "Der Draht hinter dem Scheinwerfer",
    frage: "Lang, dünn oder aus welchem Material – wovon hängt der Widerstand eines Drahtes ab?",
    auftrag: "Untersuche, wie sich der Widerstand eines Drahtes ändert, wenn du Länge, Dicke und Material einzeln veränderst.",
    schritte: ["Stelle Länge kurz, Dicke dick und Material Kupfer ein und lies Widerstand und Stromstärke ab.", "Drücke lang und danach dünn und beobachte, wie sich der Widerstand jeweils verändert.", "Wechsle das Material zu Eisen und Konstantan und vergleiche die drei Widerstände."]
  },
  "wi6": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "reihe-widerstand", seite: 40,
    kapitel: "Stromkreise und Widerstand",
    name: "Hintereinander wird es weniger",
    titel: "Zwei Widerstände hintereinander",
    frage: "Wie ändert sich der Widerstand, wenn zwei Bauteile in Reihe liegen?",
    auftrag: "Vergleiche Gesamtwiderstand und Stromstärke, wenn ein oder wenn zwei Widerstände hintereinander in Reihe liegen.",
    schritte: ["Stelle R₁ auf 10 Ω und R₂ auf 20 Ω und lies Gesamtwiderstand und Stromstärke ab.", "Ändere R₂ auf 30 Ω und beobachte, wie sich Gesamtwiderstand und Strom verändern.", "Stelle R₁ und R₂ beide auf 30 Ω und vergleiche die Stromstärke mit dem Anfangswert."]
  },
  "wi7": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "parallel-widerstand", seite: 42,
    kapitel: "Stromkreise und Widerstand",
    name: "Nebeneinander wird es mehr",
    titel: "Zwei Kanäle nebeneinander",
    frage: "Was passiert mit dem Strom, wenn zwei Widerstände nebeneinander im Stromkreis liegen?",
    auftrag: "Untersuche, wie sich Gesamtstrom und Gesamtwiderstand ändern, wenn du zwei Widerstände nebeneinander parallel schaltest.",
    schritte: ["Stelle R₁ auf 10 Ω und R₂ auf 20 Ω und lies Gesamtstrom und Gesamtwiderstand ab.", "Stelle R₁ und R₂ beide auf 10 Ω und beobachte, wie sich der Gesamtstrom ändert.", "Vergleiche den Gesamtwiderstand mit dem kleinsten Einzelwiderstand in der Statuszeile."]
  },
  "wi8": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "potentiometer", seite: 44,
    kapitel: "Stromkreise und Widerstand",
    name: "Der Regler am Pult",
    titel: "Der Regler am Pult",
    frage: "Was verändert der Drehregler am Mischpult im Stromkreis der Lampe?",
    auftrag: "Bestimme, wie sich Stromstärke und Helligkeit ändern, wenn du den Reglerwiderstand von 0 Ω bis 45 Ω vergrößerst.",
    schritte: ["Drücke mehrmals „weniger Widerstand“, bis der Reglerwiderstand 0 Ω anzeigt, und lies Strom und Helligkeit ab.", "Drücke mehrmals „mehr Widerstand“, bis der Regler 45 Ω zeigt, und lies den neuen Strom ab.", "Vergleiche zu drei Reglerstellungen die Stromstärke und die Helligkeit in der Statuszeile."]
  },
  "ep1": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "elektrische-energie", seite: 54,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Wie viel Energie steckt im Abend?",
    titel: "Was der Abend frisst",
    frage: "Wie viel Energie steckt im Abend?",
    auftrag: "Bestimme für LED, Fernseher und Wasserkocher die umgesetzte Energie und vergleiche, wie stark Leistung und Zeit sie verändern.",
    schritte: ["Wähle nacheinander die Geräte LED 10 W, TV 100 W und Wasserkocher 2000 W und lies im Feld Umgesetzte Energie den Wert für E ab.", "Stelle bei der LED 10 W die Zeit von 1 h auf 10 h und beobachte, wie sich E in Wattstunden verändert.", "Vergleiche die LED 10 W bei 10 h mit dem TV 100 W bei 1 h und lies beide Male E in Wattstunden ab."]
  },
  "ep2": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "elektrische-leistung", seite: 56,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Was sagt die Wattzahl?",
    titel: "Zwei Zahlen ergeben ein Watt",
    frage: "Was sagt die Wattzahl?",
    auftrag: "Untersuche, wie sich die Leistung P ändert, wenn du erst die Spannung und dann den Verbrauchertyp veränderst.",
    schritte: ["Stelle den Verbraucher auf mittel und schalte die Spannung nacheinander auf 1,5 V, 3 V und 6 V; lies jedes Mal I und P ab.", "Stelle nun 3 V fest ein und wechsle den Verbraucher von wenig Strom über mittel zu viel Strom.", "Vergleiche, bei welcher Einstellung die höchste Leistung P entsteht, und notiere U und I dazu."]
  },
  "ep3": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "stromkosten", seite: 58,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Was kostet eine Kilowattstunde Konzert?",
    titel: "Die Rechnung nach dem Applaus",
    frage: "Was kostet eine Kilowattstunde Konzert?",
    auftrag: "Vergleiche für mehrere Geräte, wie sich Energie und Kosten pro Jahr ändern, wenn du Leistung und tägliche Laufzeit veränderst.",
    schritte: ["Wähle den TV 100 W und stelle die tägliche Laufzeit von 1 h über 3 h und 8 h auf 24 h; lies jeweils die Kosten pro Jahr ab.", "Wähle den Kühlschrank 150 W bei 24 h und danach den Wasserkocher 2000 W bei 1 h und vergleiche die Jahreskosten.", "Notiere im Feld Energie & Kosten für jedes Gerät die kWh pro Tag und die Kosten pro Jahr."]
  },
  "ep4": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "stromgefahren", seite: 60,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Ab wann wird Strom für den Körper gefährlich?",
    titel: "Eine Dose, zu viele Geräte",
    frage: "Ab wann wird der Strom gefährlich – und was schaltet ihn ab?",
    auftrag: "Untersuche, bei wie vielen Geräten der Strom die Sicherung auslöst und was dabei mit dem Stromkreis geschieht.",
    schritte: ["Schließe mit Gerät anschließen ein Gerät nach dem anderen an und lies im Feld Strom & Sicherung den Gesamtstrom in Ampere ab.", "Beobachte, bei welchem Gerät der Strom die Sicherungsgrenze von 16 A überschreitet und die Sicherung auslöst.", "Setze mit Sicherung zurücksetzen den Kreis zurück und entferne mit Gerät entfernen so lange Geräte, bis der Strom wieder sicher fließt."]
  },
  "ep5": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: null, seite: 57,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Wie ist das Haus verkabelt?",
    titel: "Hinter dem Sicherungskasten",
    frage: "Wie ist das Haus verkabelt?",
    auftrag: "Vergleiche im Datenblatt die Stromkreise nach Aufgabe und Absicherung und finde heraus, wodurch sich der FI-Schutzschalter von den übrigen Sicherungen unterscheidet.",
    schritte: ["Lies im Datenblatt die Spalte typische Absicherung und ordne die vier Zeilen nach ihrem Auslösewert.", "Vergleiche den Lichtstromkreis mit dem Steckdosen-Stromkreis und notiere, welcher Leitungsquerschnitt zu welcher Sicherung gehört.", "Sieh am Sicherungskasten zu Hause nach, welche Zahlen auf den Schaltern stehen, und suche den FI-Schutzschalter mit 30 mA."]
  },
  "kp1": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "atombau-isotope", seite: 5,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Woraus besteht ein Atomkern?",
    titel: "Die Zahl hinter dem Namen",
    frage: "Woraus besteht ein Atomkern – und was macht ihn zu genau diesem Element?",
    auftrag: "Untersuche mit den beiden Reglern, was das Element festlegt und was sich ändern darf, ohne dass ein neues Element entsteht.",
    schritte: ["Drücke „Kohlenstoff-12“ und lies im Statusfeld Protonen, Neutronen und Massenzahl ab.", "Drücke „Kohlenstoff-14“ und vergleiche Massenzahl und Stabilität mit Kohlenstoff-12.", "Ziehe den Regler „Neutronen im Kern“ von 6 auf 8 und dann den Regler „Protonen im Kern“ auf 7 – achte darauf, wann der Elementname wechselt."]
  },
  "kp2": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "radioaktivitaet", seite: 7,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Alpha, Beta, Gamma - was strahlt da?",
    titel: "Halb so viel bis nächste Woche",
    frage: "Wie stark strahlt ein Präparat – und warum wird das mit der Zeit weniger?",
    auftrag: "Untersuche mit den Reglern für Halbwertszeit und Anfangskerne, wie die Zahl der Kerne und die Aktivität eines Präparats mit der Zeit abnehmen.",
    schritte: ["Stelle den Regler „Halbwertszeit T½“ auf 5 s und den Regler „Anfangskerne N₀“ auf 80 ×100; lies im weißen Kästchen T½ und λ ab.", "Beobachte, wie im linken Bild die 200 roten Punkte nach und nach grau werden und die rote Kurve N(t) im Diagramm fällt; lies dabei N und die Aktivität A ab.", "Ziehe die Halbwertszeit T½ auf 10 s und vergleiche, wie sich λ und der Verlauf der Kurve ändern."]
  },
  "kp3": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "geiger-mueller", seite: 9,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie zählt man Strahlung?",
    titel: "Wenn der Zähler nicht mehr mitkommt",
    frage: "Wie weist man unsichtbare Strahlung nach?",
    auftrag: "Bestimme mit der Station „Totzeit & wahre Zählrate“, um wie viel sich ein Zählrohr bei hoher Rate verzählt und wie man die wahre Rate zurückgewinnt.",
    schritte: ["Wähle die Karte „4 · Totzeit & wahre Zählrate“ und stelle die wahre Zählrate auf 2000 /s und die Totzeit τ auf 100 µs.", "Lies in der Rechnung die gemessene Rate Z_mess, den Verlust in Prozent und die zurückkorrigierte Rate Z_kor ab.", "Ziehe die wahre Zählrate auf 9000 /s und beobachte, wie stark der Verlust jetzt wächst."]
  },
  "kp4": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "ionisation", seite: 12,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Was richtet Strahlung in Materie an?",
    titel: "Die unsichtbare Spur im Gewebe",
    frage: "Was richtet Strahlung in Materie an, wenn sie hindurchgeht?",
    auftrag: "Vergleiche für Alpha-, Beta- und Gammastrahlung, wie dicht sie auf ihrem Weg Atome ionisieren, und begründe daraus ihre Wirkung.",
    schritte: ["Drücke „α Alpha“ und lies im Statusfeld Energie, Reichweite und die Ionenpaare je Millimeter ab.", "Drücke danach „β Beta“ und „γ Gamma“ und vergleiche jeweils Reichweite und Ionisationsdichte.", "Lies zu jeder Strahlungsart den Wichtungsfaktor ab, mit dem der Strahlenschutz rechnet."]
  },
  "kp5": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "absorption-strahlung", seite: 14,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Was hält Strahlung auf?",
    titel: "Drei Strahlen, drei Schilde",
    frage: "Was hält Strahlung auf?",
    auftrag: "Untersuche für α-, β- und γ-Strahlung, welcher Absorber sie jeweils aufhält und welcher sie nur schwächt.",
    schritte: ["Wähle die Strahlungsart α-Strahlung und den Absorber Papier und lies bei der Dicke d = 6,0 mm ab, wie viel Prozent der Strahlung durchkommen.", "Stelle nacheinander β-Strahlung mit Aluminium und γ-Strahlung mit Blei ein und lies jeweils bei d = 6,0 mm den Prozentwert ab.", "Schiebe bei γ-Strahlung und Blei den Regler Dicke d von 6,0 mm auf 12,0 mm und beobachte, wie sich der Prozentwert ändert."]
  },
  "kp6": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "zerfall-halbwertszeit", seite: 16,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wann ist die Hälfte zerfallen?",
    titel: "Der Kern ohne Uhr",
    frage: "Wann ist die Hälfte zerfallen?",
    auftrag: "Vergleiche an mehreren Nukliden, wie viele von 200 Kernen nach einer Halbwertszeit übrig bleiben und wie stark die Zahl um die Erwartung schwankt.",
    schritte: ["Drücke die Schaltfläche „Radon-220“ und lies in der Statuszeile ab, wie viele der 200 Kerne noch da sind und wie lang die Halbwertszeit ist.", "Drücke dreimal „⏭ eine Halbwertszeit weiter“ und notiere nach jedem Schritt die übrige Zahl neben der Angabe „Erwartet hätte man …“.", "Setze mit „↺ Zurücksetzen“ zurück, wähle Kohlenstoff-14 und vergleiche dessen Halbwertszeit mit der von Radon-220."]
  },
  "kp7": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "zerfallsreihe", seite: 18,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wohin zerfällt Uran?",
    titel: "Warum im Uran das Blei steckt",
    frage: "Wohin zerfällt Uran?",
    auftrag: "Bestimme, in welche Kerne sich Uran-238 Schritt für Schritt verwandelt und bei welchem stabilen Kern die Reihe endet.",
    schritte: ["Lies im Startbild in der Statuszeile für Uran-238 ab, wie viele Neutronen auf ein Proton kommen und welche Strahlung als Erstes wegfliegt.", "Drücke zweimal „⏭ nächster Zerfall“ und vergleiche nach jedem Zerfall Massenzahl A und Kernladungszahl Z mit den Werten davor.", "Drücke „⏭⏭ bis zum Ende“ und lies ab, bei welchem Kern die Reihe stoppt und aus wie vielen Alpha- und Betazerfällen sie besteht."]
  },
  "kp8": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "roentgen-charakteristisch", seite: 20,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie entsteht Röntgenlicht?",
    titel: "Zwei Linien und eine Grenze",
    frage: "Wie entsteht Röntgenlicht?",
    auftrag: "Untersuche, wie Anodenmaterial und Spannung das Röntgenspektrum verändern, und ordne jeder Auffälligkeit ihre Ursache zu.",
    schritte: ["Wähle als Anodenmaterial Molybdän und stelle die Beschleunigung U_A auf 30 kV. Lies die Grenzwellenlänge und die Wellenlängen der Linien Kα und Kβ ab.", "Schiebe U_A zwischen 15 kV und 40 kV hin und her und achte darauf, wie die Grenzwellenlänge wandert, während Kα und Kβ ihren Platz behalten und unter 20 kV ganz verschwinden.", "Wechsle das Anodenmaterial auf Kupfer und vergleiche, wohin die Linien Kα und Kβ dabei springen."]
  },
  "kp9": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "lorentzkraft", seite: 23,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Was lenkt geladene Teilchen ab?",
    titel: "Der Halbkreis im Magnetfeld",
    frage: "Was lenkt geladene Teilchen ab?",
    auftrag: "Untersuche, wovon der Radius der Kreisbahn abhängt und wodurch sich der Umlaufsinn umkehrt.",
    schritte: ["Stelle die Geschwindigkeit v auf 5 und die Feldstärke B auf 5 und lies im Feld „Nachgerechnet“ den Bahnradius r ab.", "Schiebe v auf 10 und danach B auf 10 und beobachte, wie sich der abgelesene Radius r jeweils verändert.", "Drücke „Ladung − (negativ)“ und vergleiche, wie sich der Umlaufsinn gegenüber der positiven Ladung dreht."]
  },
  "kp10": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "kernspaltung", seite: 25,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie zerlegt man einen Kern?",
    titel: "Ein langsames Neutron genügt",
    frage: "Wie zerlegt man einen Kern?",
    auftrag: "Vergleiche die drei Spaltwege und prüfe, welche Größen beim Zerfall erhalten bleiben und welche nicht.",
    schritte: ["Drücke „↺ Spaltung noch einmal“ und verfolge, wie das langsame Neutron den Urankern trifft und ihn spaltet.", "Vergleiche im Feld rechts die Summe der Kernbausteine und die Summe der Protonen links und rechts vom Pfeil.", "Wähle nacheinander die Spaltwege „Xenon + Strontium“ und „Cäsium + Rubidium“ und lies die fehlende Masse und die frei werdende Energie ab."]
  },
  "kp11": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "kettenreaktion", seite: 28,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie hält man die Kettenreaktion im Zaum?",
    titel: "Der Regler mit dem Namen k",
    frage: "Wie hält man die Kettenreaktion im Zaum?",
    auftrag: "Untersuche, wie die Stellung der Steuerstäbe über den Vermehrungsfaktor k entscheidet und wann eine Generation so groß bleibt wie die vorige.",
    schritte: ["Stelle den Regler Steuerstäbe eingefahren auf 50 % und lies in der Statuszeile den Vermehrungsfaktor k und die Lage ab.", "Ziehe die Steuerstäbe auf 20 % zurück und fahre sie danach auf 80 % ein; notiere jedes Mal k und ob dort unterkritisch, kritisch oder überkritisch steht.", "Drücke bei jeder Einstellung mehrmals nächste Generation und beobachte, ob die Zahl der Spaltungen wächst, gleich bleibt oder erstirbt."]
  },
  "kp12": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "kernfusion", seite: 31,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wovon lebt die Sonne?",
    titel: "Ein Feuer, das leichter wird",
    frage: "Wovon lebt die Sonne?",
    auftrag: "Bestimme, ab welcher Temperatur die Wasserstoffkerne verschmelzen und wie aus der fehlenden Masse die Energie der Sonne wird.",
    schritte: ["Stelle den Regler Temperatur auf 5 Millionen °C und lies in der Statuszeile ab, ob überhaupt etwas passiert.", "Erhöhe die Temperatur schrittweise und finde heraus, ab welchem Wert die Anzeige von „Es passiert nichts“ auf „Es zündet“ umspringt.", "Stelle 15 Millionen °C ein und lies die Massenbilanz sowie die Energie je Kernbaustein ab."]
  },
  "kp13": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "strahlenschutz", seite: 34,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie viel Dosis ist zu viel?",
    titel: "Abstand schlägt Blei",
    frage: "Wie viel Dosis ist zu viel – und wie hält man sie klein?",
    auftrag: "Vergleiche, wie stark Abstand, Bleiabschirmung und Aufenthaltsdauer die Dosis senken, indem du immer nur eine Größe veränderst.",
    schritte: ["Stelle Abstand 100 cm, Blei dazwischen 0 mm und Aufenthaltsdauer 20 Minuten ein und lies die Dosis in der Statuszeile ab.", "Verdopple nur den Abstand auf 200 cm und beobachte, auf welchen Teil die Dosisleistung sinkt.", "Gehe zurück auf 100 cm und schiebe nur den Regler Blei dazwischen auf 7 mm; lies die Halbwertsdicken und den übrig bleibenden Anteil ab."]
  },
  "eg1": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "oersted", seite: 45,
    kapitel: "Strom für alle",
    name: "Was entdeckte Ørsted neben dem Kompass?",
    titel: "Der Kompass in der Leitwarte",
    frage: "Was entdeckte Ørsted, als neben dem Kompass ein Draht Strom führte?",
    auftrag: "Untersuche, ob der Strom im Draht die Kompassnadel bewegt und wovon der Ausschlag abhängt.",
    schritte: ["Stelle den Regler Stromstärke auf 3,0 A und Abstand Draht – Nadel auf 2,0 cm und lies in der Statuszeile das Drahtfeld und den Ausschlag ab.", "Drücke den Knopf Strom ausschalten, beobachte, wohin die Nadel zeigt, und schalte den Strom wieder ein.", "Drücke umpolen und danach Nadel unter den Draht und vergleiche jeweils, zu welcher Seite die Nadel ausschlägt."]
  },
  "eg2": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "leiterkraft", seite: 47,
    kapitel: "Strom für alle",
    name: "Warum zuckt der Draht im Magnetfeld?",
    titel: "Der Stab zwischen den Polen",
    frage: "Warum zuckt ein Draht, sobald Strom durch ihn fließt und er im Magnetfeld hängt?",
    auftrag: "Bestimme, wie groß die Kraft auf den Stab ist und wovon ihre Richtung abhängt.",
    schritte: ["Stelle mit den Reglern die Stromstärke I auf 5,0 A und das Magnetfeld B auf 0,20 T ein und lies Kraft und Richtung in der Statuszeile ab.", "Ziehe den Regler Stromstärke I erst auf 0 A und dann auf 10,0 A und vergleiche jeweils die Kraft.", "Drücke Strom umpolen, danach zusätzlich Magnet umdrehen und beobachte, wohin der Stab jeweils gedrückt wird."]
  },
  "eg3": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "elektromotor", seite: 50,
    kapitel: "Strom für alle",
    name: "Wie dreht sich der Elektromotor?",
    titel: "Aus Kraft wird eine Drehung",
    frage: "Wie wird aus Strom eine Drehbewegung?",
    auftrag: "Untersuche, was den Motor am Laufen hält und wovon sein Drehmoment abhängt.",
    schritte: ["Sieh dem laufenden Motor mit 20 Windungen, 2,0 A und 0,20 T zu und lies das Drehmoment in der Statuszeile ab.", "Drücke den Knopf Kommutator ist AN, bis Kommutator ist AUS erscheint, drücke zurücksetzen und beobachte, was die Spule jetzt macht.", "Schalte den Kommutator wieder ein und stelle die Windungen der Spule von 20 auf 40 und danach die Stromstärke I von 2,0 auf 4,0 A."]
  },
  "eg4": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "induktion", seite: 53,
    kapitel: "Strom für alle",
    name: "Wie macht Bewegung Spannung?",
    titel: "Der Magnet, der vorbeifährt",
    frage: "Wie erzeugt die Bewegung eines Magneten eine Spannung?",
    auftrag: "Untersuche, wann die Spule eine Spannung liefert und wovon die Höhe des Ausschlags abhängt.",
    schritte: ["Stelle die Magnet-Geschwindigkeit v auf 5 m/s und verfolge im violetten Diagramm U_ind, während der Magnet die Spule passiert.", "Schiebe die Magnet-Geschwindigkeit v von 5 auf 10 m/s und vergleiche die Höhe des Ausschlags.", "Stelle die Windungszahl N von 10 auf 20 und beobachte, wie hoch der Ausschlag nun wird."]
  },
  "eg5": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "generator", seite: 55,
    kapitel: "Strom für alle",
    name: "Wie erzeugt der Generator Strom?",
    titel: "Strom aus einer Drehung",
    frage: "Wie erzeugt der Generator fortlaufend Spannung?",
    auftrag: "Untersuche, wie die gedrehte Spule eine Wechselspannung erzeugt und wovon ihr Scheitelwert Û abhängt.",
    schritte: ["Stelle die Drehfrequenz f auf 2,0 Hz und lies unter Scheitelwert Û und Effektivwert die beiden Spannungswerte ab.", "Ziehe den Regler Windungen n über 4000, 8000 und 12000 und beobachte, wie der Scheitelwert Û proportional wächst.", "Beobachte am Oszilloskop die Spannung U in den beiden Extremlagen: Spulenfläche senkrecht zum Feld und Spule auf der Kante."]
  },
  "eg6": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "wechselstrom", seite: 58,
    kapitel: "Strom für alle",
    name: "Warum wechselt der Strom die Richtung?",
    titel: "Fünfzigmal in der Sekunde",
    frage: "Warum wechselt der Strom ständig die Richtung – und was leistet er trotzdem?",
    auftrag: "Untersuche, wie die Wechselspannung U(t) verläuft und welche gleichwertige Gleichspannung ihr Effektivwert angibt.",
    schritte: ["Stelle die Frequenz f auf 50 Hz und verfolge, wie die Sinuskurve U(t) über und unter die Nulllinie läuft.", "Lies den Wert U_eff = U_max/√2 ab, der als orange Linie im Diagramm eingezeichnet ist.", "Schiebe U_max von 325 V auf 400 V und beobachte, wie sich U_eff verändert."]
  },
  "eg7": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "transformator", seite: 60,
    kapitel: "Strom für alle",
    name: "Wie verwandelt der Trafo die Spannung?",
    titel: "Zwei Spulen, ein Eisenkern",
    frage: "Wie verwandelt der Transformator eine Spannung in eine höhere oder niedrigere?",
    auftrag: "Untersuche, wie das Windungsverhältnis N₁/N₂ die Sekundärspannung U₂ und den Sekundärstrom I₂ bestimmt.",
    schritte: ["Stelle die Primärspannung U₁ auf 230 V und das Windungsverhältnis N₁/N₂ auf 1,0.", "Ziehe das Windungsverhältnis N₁/N₂ auf 2,0 und lies im Diagramm die Sekundärspannung U₂ und den Sekundärstrom I₂ ab.", "Stelle das Windungsverhältnis N₁/N₂ auf 0,5 und vergleiche U₂ und I₂ mit den vorigen Werten."]
  },
  "eg8": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "freileitungen", seite: 63,
    kapitel: "Strom für alle",
    name: "Warum hängen die Leitungen so hoch - und führen Hochspannung?",
    titel: "380 000 Volt in der Leitwarte",
    frage: "Warum führen die Leitungen Hochspannung?",
    auftrag: "Untersuche, wie sich der Verlust in der Leitung ändert, wenn du die Übertragungsspannung erhöhst.",
    schritte: ["Öffne den Reiter „2 · Warum Hochspannung?“ und stelle die Übertragungsspannung U auf 20 V.", "Verdopple die Übertragungsspannung schrittweise auf 40 V und dann auf 80 V.", "Lies bei jeder Spannung den Leitungsstrom I = P/U und den abgelesenen Verlust P = R·I² ab."]
  },
  "eg9": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "wirkungsgrad", seite: 65,
    kapitel: "Strom für alle",
    name: "Wie gut ist ein Energiewandler?",
    titel: "Fünf Prozent Licht, der Rest ist warm",
    frage: "Wie gut ist ein Energiewandler?",
    auftrag: "Vergleiche bei mehreren Geräten, wie viel der eingesetzten Energie als Nutzen herauskommt und wie viel als Wärme verloren geht.",
    schritte: ["Stelle die hineingesteckte Energie auf 1000 J ein.", "Wähle nacheinander die Geräte Glühlampe, LED-Lampe, Benzinmotor und Elektromotor.", "Lies im Statusfeld jeweils den Wirkungsgrad η, den Nutzen und die als Wärme verlorene Energie ab."]
  },
  "eg10": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "energie-entwerten", seite: 67,
    kapitel: "Strom für alle",
    name: "Warum wird Energie entwertet?",
    titel: "Am Ende bleibt lauwarme Luft",
    frage: "Warum wird Energie entwertet?",
    auftrag: "Bestimme, wie viel Energie am Ende einer Kette noch nutzbar ist, indem du sie Schritt für Schritt verfolgst.",
    schritte: ["Wähle die Kette „Kohle → Licht“.", "Drücke „nächster Schritt“, bis alle vier Stufen durchlaufen sind.", "Lies nach jedem Schritt ab, wie viel Energie weiter nutzbar ist und wie viel als Wärme abgegeben wurde."]
  },
  "eg11": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: null, seite: 59,
    kapitel: "Strom für alle",
    name: "Welches Kraftwerk für welche Aufgabe?",
    titel: "Kein Kraftwerk kann alles",
    frage: "Welches Kraftwerk für welche Aufgabe?",
    auftrag: "Vergleiche die vier Kraftwerksarten im Datenblatt nach Brennstoff, Nebenwirkung und Regelbarkeit.",
    schritte: ["Lies die Kopfzeile des Datenblatts und kläre für jede der drei Spalten, was dort angegeben wird.", "Vergleiche die Spalte „Regelbarkeit“ und markiere die Kraftwerke, die sich schnell hoch- und herunterfahren lassen.", "Vergleiche zum Schluss „Brennstoff und Nebenwirkung“ und ordne die vier Zeilen nach ihrer Eignung für eine ständige Grundlast."]
  },
  "eg12": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "energiesparen", seite: 72,
    kapitel: "Strom für alle",
    name: "Wie speichert man Strom für die Nacht?",
    titel: "Die billigste Kilowattstunde",
    frage: "Wie senkt ein Haushalt seinen Stromverbrauch?",
    auftrag: "Vergleiche für drei Sparmaßnahmen den Stromverbrauch pro Jahr vorher und nachher und bestimme die Ersparnis.",
    schritte: ["Wähle die Maßnahme „Glühlampe→LED“.", "Wechsle danach zu „Standby aus“ und schließlich zu „Kühlschrank“.", "Lies bei jeder Maßnahme unter „Ersparnis pro Jahr“ den Verbrauch vorher und nachher sowie die Ersparnis in Kilowattstunden und Euro ab."]
  },
  "fo1": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "licht-oberflaeche", seite: 5,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was macht eine Oberfläche mit Licht?",
    titel: "Zwei Kisten ohne Beschriftung",
    frage: "Was macht eine Oberfläche mit dem Licht, das auf sie trifft?",
    auftrag: "",
    schritte: ["Wähle den Spiegel und lies die drei Zahlen in der Statuszeile ab.", "Trage die Zahlen für Fensterglas, schwarzes Papier und weißes Papier ein.", "Berechne für jede Zeile die Summe der drei Zahlen."]
  },
  "fo2": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "reflexionsgesetz", seite: 7,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie wirft der Spiegel Licht zurück?",
    titel: "Der Spiegel",
    frage: "Wie hängen Einfallswinkel und Reflexionswinkel zusammen?",
    auftrag: "",
    schritte: ["Stelle den Einfallswinkel zum Lot auf 0° und lies die Statuszeile.", "Trage beide Winkel in die Tabelle ein.", "Stelle nacheinander 20°, 40° und 80° ein und ergänze die Tabelle."]
  },
  "fo3": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "brechung-eintritt", seite: 9,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum knickt Licht im Glas?",
    titel: "Der halbrunde Glasklotz",
    frage: "Wohin knickt der Lichtstrahl, wenn er ins Glas eintritt?",
    auftrag: "",
    schritte: ["Drücke „↓ genau auf das Lot“ und lies die Statuszeile.", "Stelle den Winkel in der Luft auf 40° und lies den Winkel im Glas ab.", "Stelle 75° ein und ergänze die letzte Zeile der Tabelle.", "Vergleiche: Ist der Winkel im Glas größer oder kleiner?"]
  },
  "fo4": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "brechung-austritt", seite: 11,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wann kommt Licht nicht mehr heraus?",
    titel: "Wenn Licht nicht mehr herauskommt",
    frage: "Wann tritt Licht aus dem Glas aus – und wann nicht mehr?",
    auftrag: "",
    schritte: ["Stelle den Winkel im Glas auf 20° und lies den Winkel in der Luft ab.", "Stelle 25° ein und vergleiche beide Winkel.", "Drücke den Knopf „55° – Totalreflexion“ und lies die Meldung.", "Trage ein, bei welchen Winkeln Licht austritt."]
  },
  "fo5": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "sammellinse", seite: 13,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Welches Glas bündelt das Licht?",
    titel: "Zwei geschliffene Gläser",
    frage: "Welches Glas bündelt paralleles Licht – und welches nicht?",
    auftrag: "",
    schritte: ["Wähle „in der Mitte dicker“ und lies die Statuszeile.", "Trage ein, wo sich die Strahlen treffen.", "Wähle „in der Mitte dünner“ und beobachte die Strahlen.", "Ergänze die zweite Zeile der Tabelle."]
  },
  "fo6": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "bild-linse", seite: 15,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo entsteht das Bild der Linse?",
    titel: "Das Bild der Linse und die Lupe",
    frage: "Wovon hängt es ab, wie das Bild der Linse aussieht?",
    auftrag: "",
    schritte: ["Stelle die Gegenstandsweite g auf 190 und lies die Statuszeile.", "Stelle 100 ein und vergleiche Größe und Lage des Bildes.", "Stelle 25 ein – näher als die Brennweite f = 62.", "Trage jedes Mal ein, wie das Bild aussieht."]
  },
  "fo7": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "auge", seite: 17,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entsteht ein Bild im Auge?",
    titel: "Das aufklappbare Augenmodell",
    frage: "Wo entsteht das Bild im Auge – und wie bleibt es scharf?",
    auftrag: "",
    schritte: ["Schiebe den Regler „Abstand des Gegenstands“ ganz nach rechts und lies die Statuszeile.", "Schiebe ihn ganz nach links und vergleiche die Wölbung der Linse.", "Schiebe den Regler „Pupille“ nach links und nach rechts. Lies beide Meldungen.", "Trage deine Beobachtungen in die Tabelle ein."]
  },
  "fo8": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "brille", seite: 19,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie hilft eine Brille?",
    titel: "Zwei Brillen ohne Etikett",
    frage: "Welche Linse gehört zu welchem Sehfehler?",
    auftrag: "",
    schritte: ["Wähle „kurzsichtig“ und lies ab, wo das Bild liegt.", "Drücke „Brille“ und lies die neue Meldung.", "Wähle „weitsichtig“ und wiederhole beide Schritte.", "Trage alle vier Ergebnisse in die Tabelle ein."]
  },
  "fo9": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "lochkamera", seite: 21,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie macht die Lochkamera ein Bild?",
    titel: "Die Pappkiste mit dem Nadelloch",
    frage: "Wie sieht das Bild aus, das ein kleines Loch auf den Schirm wirft?",
    auftrag: "",
    schritte: ["Stelle die Bildweite b auf 29 cm und lies die Statuszeile.", "Stelle b auf 39 cm und dann auf 51 cm. Vergleiche die Bildgröße.", "Schiebe den Regler „Lochgröße“ ganz nach rechts und lies die Statuszeile.", "Trage alle vier Zeilen in die Tabelle ein."]
  },
  "fo10": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "prisma", seite: 23,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Woraus besteht weißes Licht?",
    titel: "Der Glaskeil in der Schublade",
    frage: "Macht das Prisma die Farben – oder stecken sie schon im weißen Licht?",
    auftrag: "",
    schritte: ["Wähle weißes Licht und lies die Meldung in der Statuszeile.", "Trage in die Tabelle ein, was hinter dem Prisma erscheint.", "Wähle nur Rot. Beobachte, ob sich das Licht noch auffächert.", "Vergleiche mit nur Blau und ergänze die letzte Zeile."]
  },
  "fo11": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "farbmischung-additiv", seite: 25,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie macht der Bildschirm Farben?",
    titel: "Die Lupe auf dem Bildschirm",
    frage: "Wie entsteht Weiß, wenn dort nur Rot, Grün und Blau leuchten?",
    auftrag: "",
    schritte: ["Lies im Statusfeld die Ergebnisfarbe mit ihren drei Zahlen ab.", "Drücke „aus“ und notiere alle drei Werte.", "Drücke „Gelb“ und notiere die Werte.", "Schiebe den Regler „Blau“ auf 255 und vergleiche mit dem Knopf „Weiß“."]
  },
  "fo12": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "spektrum-unsichtbar", seite: 27,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Welches Licht sehen wir nicht?",
    titel: "Das Thermometer mit der schwarzen Kugel",
    frage: "Kommt hinter dem letzten Rot noch etwas an, das wir nicht sehen?",
    auftrag: "",
    schritte: ["Drücke „555 nm – Grün“ und lies die Erwärmung ab.", "Drücke „700 nm – letztes Rot“ und vergleiche die Erwärmung.", "Drücke „940 nm – Fernbedienung“ und lies beide Angaben.", "Trage alle drei Zeilen in die Tabelle ein."]
  },
  "fw1": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "himmelskoerper", seite: 32,
    kapitel: "Der Blick ins Weltall",
    name: "Was leuchtet am Nachthimmel?",
    titel: "Ein Karton voller Sternkarten",
    frage: "Welche Himmelskörper leuchten selbst – und welche werden beleuchtet?",
    auftrag: "",
    schritte: ["Wähle nacheinander Sonne, Stern, Mond und Planet. Lies jede Statuszeile.", "Trage ein, wer selbst leuchtet.", "Drücke „Sonnenlicht abdecken“ und wähle wieder alle vier.", "Ergänze: Wer ist jetzt dunkel, wer strahlt weiter?"]
  },
  "fw2": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "tag-nacht", seite: 34,
    kapitel: "Der Blick ins Weltall",
    name: "Warum wird es Tag und Nacht?",
    titel: "Der staubige Globus",
    frage: "Wovon hängt es ab, ob es gerade Tag oder Nacht ist?",
    auftrag: "",
    schritte: ["Drücke „⏯ Pause“, damit der Globus stehen bleibt.", "Stelle den Regler „Erde von Hand drehen“ auf 0°. Lies ab: Wer hat Sonne?", "Stelle 180° ein und vergleiche.", "Ergänze die letzte Zeile nach einer vollen Drehung."]
  },
  "fw3": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "gravitation", seite: 36,
    kapitel: "Der Blick ins Weltall",
    name: "Warum fällt alles nach unten?",
    titel: "Warum alles nach unten fällt",
    frage: "Fallen Stein und Feder gleich schnell, wenn keine Luft da ist?",
    auftrag: "",
    schritte: ["Drücke „⬇ Noch einmal fallen lassen“. Beobachte beide Rohre.", "Wähle den Mond und lies g und die Fallzeit ab.", "Wähle Erde und Jupiter und ergänze die Tabelle.", "Vergleiche: Wo fällt der Stein am schnellsten?"]
  },
  "fw4": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "planetenbahn", seite: 38,
    kapitel: "Der Blick ins Weltall",
    name: "Warum stürzen Planeten nicht ab?",
    titel: "Warum Planeten nicht abstürzen",
    frage: "Warum stürzt ein Planet nicht in die Sonne?",
    auftrag: "",
    schritte: ["Drücke „➊ ganz klein“ und lies die Bahnform ab.", "Drücke „➋ mittlerer Wert“ und vergleiche.", "Drücke „➍ Gegenprobe groß“ und lies die Meldung.", "Trage alle drei Zeilen in die Tabelle ein."]
  },
  "fw5": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "sonnensystem", seite: 40,
    kapitel: "Der Blick ins Weltall",
    name: "Wie unterscheiden sich die Planeten?",
    titel: "Acht gleich große Kugeln",
    frage: "Was unterscheidet die inneren Planeten von den äußeren?",
    auftrag: "",
    schritte: ["Drücke „Steckbrief“ und lies für die Erde Sorte und Durchmesser ab.", "Drücke „Größen“ und vergleiche die acht Planeten.", "Drücke „Umlauf“ und „sehr schnell“. Wer kommt öfter herum: innen oder außen?", "Trage deine Beobachtungen in die Tabelle ein."]
  },
  "fw6": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "entfernungen", seite: 42,
    kapitel: "Der Blick ins Weltall",
    name: "Wie groß ist das Sonnensystem?",
    titel: "Ein Wort auf der Rückseite",
    frage: "Wie lange ist das Licht von fernen Zielen zu uns unterwegs?",
    auftrag: "",
    schritte: ["Drücke „💡 Lichtblitz senden“ und beobachte den Weg zum Mond.", "Lies Entfernung und Zeit in der Statuszeile ab.", "Drücke „weiter ▶“ und lies die Werte für die Sonne ab.", "Gehe mit „weiter ▶“ bis zum nächsten Stern und trage ein."]
  },
  "fw7": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "teleskop", seite: 44,
    kapitel: "Der Blick ins Weltall",
    name: "Was macht das Fernrohr mit dem Bild?",
    titel: "Zwei Linsen und ein Rohr",
    frage: "Wie verändert das Fernrohr Größe, Lage und Helligkeit des Bildes?",
    auftrag: "",
    schritte: ["Drücke „👁 bloßes Auge“. Achte auf die Größe und die gelbe Marke.", "Drücke „🔭 mit Teleskop“ und lies die Vergrößerung ab.", "Vergleiche „◯ große Öffnung“ und „◦ kleine Öffnung“: Achte nur auf die Helligkeit.", "Trage alle drei Zeilen in die Tabelle ein."]
  },
  "fw8": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "sternparallaxe", seite: 46,
    kapitel: "Der Blick ins Weltall",
    name: "Wie weit ist ein Stern entfernt?",
    titel: "Kein Maßband bis zum Stern",
    frage: "Wie hängt der gemessene Winkel mit der Entfernung zusammen?",
    auftrag: "",
    schritte: ["Drücke „Proxima Centauri“ und lies den Winkel p und die Lichtjahre ab.", "Vergleiche mit „61 Cygni“ und „Wega“. Trage alle Werte ein.", "Wähle „Polarstern“ und drücke „Lupe ×100“, um den winzigen Sprung zu sehen.", "Vergleiche: Wie ändert sich der Winkel mit der Entfernung?"]
  },
  "fw9": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "sternleben", seite: 48,
    kapitel: "Der Blick ins Weltall",
    name: "Wie lange leuchtet ein Stern?",
    titel: "Die Randnotiz auf der Sternkarte",
    frage: "Lebt ein schwerer Stern länger als ein leichter?",
    auftrag: "",
    schritte: ["Drücke „1“ und sieh den ganzen Lebenslauf durch.", "Lies die Lebensdauer ab und trage sie ein.", "Drücke „10“ und vergleiche.", "Prüfe mit „Gegenprobe 25“: Lebt er noch kürzer?"]
  },
  "fw10": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "milchstrasse", seite: 50,
    kapitel: "Der Blick ins Weltall",
    name: "Wo stehen wir in der Milchstraße?",
    titel: "Das blasse Band",
    frage: "Steht die Sonne in der Mitte der Milchstraße?",
    auftrag: "",
    schritte: ["Drücke nacheinander „zur Mitte“, „nach außen“ und „quer heraus“.", "Lies jedes Mal die Sterne im Blickfeld ab und trage ein.", "Drücke „Gegenprobe: Sonne in die Mitte“ und lies die Meldung.", "Vergleiche: Passt die Gegenprobe zu unserem Himmel?"]
  },
  "fw11": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "weltbild", seite: 52,
    kapitel: "Der Blick ins Weltall",
    name: "Wer steht in der Mitte?",
    titel: "Zwei Weltbilder",
    frage: "Welches Weltbild erklärt den Himmel ohne Zusatzkreise?",
    auftrag: "",
    schritte: ["Drücke „🌍 Erde in der Mitte (alt)“ und lies die Statuszeile.", "Drücke „☀️ Sonne in der Mitte (heute)“ und vergleiche.", "Beobachte unten den Streifen: Wie läuft der Mars von der Erde aus?", "Trage beide Zeilen in die Tabelle ein."]
  },
  "fw12": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "schwarzes-loch", seite: 54,
    kapitel: "Der Blick ins Weltall",
    name: "Wie findet man ein schwarzes Loch?",
    titel: "Ein Kreis um ein leeres Feld",
    frage: "Woran erkennt man ein schwarzes Loch, wenn es nicht leuchtet?",
    auftrag: "",
    schritte: ["Drücke „➌ weit weg“ und dann „💡 Lichtstrahl senden“.", "Lies die Statuszeile ab und trage ein.", "Wiederhole mit „➋ mittel“ und „➊ sehr nah“.", "Vergleiche die drei Wege im Bild."]
  },
  "fw13": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "urknall", seite: 56,
    kapitel: "Der Blick ins Weltall",
    name: "Wie hat sich das Weltall seit dem Urknall verändert?",
    titel: "Woher kommt alles?",
    frage: "Wie hat sich das Weltall seit dem Urknall verändert?",
    auftrag: "",
    schritte: ["Drücke „↺ zum Anfang“ und lies Zeitanzeige und Statuszeile.", "Drücke „▶ Urknall starten“ und beobachte die Galaxien.", "Vergleiche das Bild am Anfang mit dem Bild am Ende.", "Trage alle Zeilen in die Tabelle ein."]
  },
  "fs1": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "ladung", seite: 5,
    kapitel: "Strom in der Werkstatt",
    name: "Wie wirken Ladungen aufeinander?",
    titel: "Das Knistern im Pullover",
    frage: "Wann ziehen sich zwei geladene Kugeln an und wann stoßen sie sich ab?",
    auftrag: "",
    schritte: ["Öffne die Simulation und lies die Statuszeile.", "Drücke bei Kugel A und bei Kugel B den Knopf „− negativ“.", "Lies die Statuszeile noch einmal und trage die zweite Zeile ein.", "Vergleiche die zwei Zeilen: Wann ziehen sich die Kugeln an?"]
  },
  "fs2": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "ladungen-kraft", seite: 7,
    kapitel: "Strom in der Werkstatt",
    name: "Was macht die Kraft größer?",
    titel: "Zwei geladene Kugeln",
    frage: "Was macht die Kraft F größer und was macht sie kleiner?",
    auftrag: "",
    schritte: ["Öffne die Simulation. Die kleine grüne Kugel brauchst du hier nicht.", "Drücke „Abstand verdoppeln“. Trage die Kraft F in Zeile 2 ein. Der Abstand bleibt jetzt 12,0 cm.", "Stelle „Ladung je Kugel“ auf 4 nC. Trage die Kraft F in Zeile 3 ein.", "Stelle „Ladung je Kugel“ auf 18 nC. Trage die Kraft F in Zeile 4 ein."]
  },
  "fs3": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "spannung", seite: 9,
    kapitel: "Strom in der Werkstatt",
    name: "Was sagt die Zahl mit dem V?",
    titel: "Die Zahl mit dem V auf der Zelle",
    frage: "Was ändert sich am Voltmeter und an der Lampe, wenn du mehr Zellen einsetzt?",
    auftrag: "",
    schritte: ["Drücke „1 Zelle (1,5 V)“ und lies die Spannung U am Voltmeter ab.", "Lies in der Statuszeile, wie hell die Lampe leuchtet.", "Drücke „2 Zellen (3 V)“ und trage die zweite Zeile ein.", "Drücke „3 Zellen (4,5 V)“ und trage die dritte Zeile ein."]
  },
  "fs4": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "stromstaerke", seite: 11,
    kapitel: "Strom in der Werkstatt",
    name: "Wie viel Strom fließt?",
    titel: "Wie viel fließt da?",
    frage: "Wie groß ist die Stromstärke – und wann fließt gar nichts mehr?",
    auftrag: "",
    schritte: ["Drücke „mittel“ und trage die Stromstärke I in die Tabelle ein.", "Drücke „stark“ und trage die Stromstärke I ein.", "Drücke den Knopf „Schalter: geschlossen“. Damit öffnest du den Kreis.", "Lies die Stromstärke ab und fülle die letzte Zeile aus."]
  },
  "fs5": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "messen", seite: 13,
    kapitel: "Strom in der Werkstatt",
    name: "Wohin kommt das Messgerät?",
    titel: "Zwei Messgeräte auf der Werkbank",
    frage: "Wohin gehört das Amperemeter, wohin das Voltmeter?",
    auftrag: "",
    schritte: ["Drücke den Knopf „Ⓐ Amperemeter“ und lies die Statuszeile.", "Drücke „Ⓥ Voltmeter“ und dann „in Reihe“. Beobachte die Lampe.", "Wähle danach „parallel“, nicht die Quiz-Antwort „Parallel zum Bauteil“.", "Trage in die Tabelle ein, was die Statuszeile meldet."]
  },
  "fs6": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "widerstand", seite: 15,
    kapitel: "Strom in der Werkstatt",
    name: "Großer Widerstand, kleiner Strom",
    titel: "Was bremst den Strom?",
    frage: "Warum fließt bei 4,5 Volt durch jedes Bauteil ein anderer Strom?",
    auftrag: "",
    schritte: ["Drücke „kleiner Widerstand“ und lies die Statuszeile.", "Trage Widerstand R und Stromstärke I in die Tabelle ein.", "Drücke „großer Widerstand“ und trage die beiden Werte ein.", "Vergleiche die drei Zeilen: Wo fließt der meiste Strom?"]
  },
  "fs7": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "draht", seite: 17,
    kapitel: "Strom in der Werkstatt",
    name: "Wovon hängt der Widerstand ab?",
    titel: "Der lange dünne Draht",
    frage: "Wovon hängt es ab, wie stark ein Draht den Strom bremst?",
    auftrag: "",
    schritte: ["Drücke „lang“. Trage den Widerstand R und die Stromstärke I ein.", "Drücke „dünn“. Trage beide Werte in die nächste Zeile ein.", "Drücke „Eisen“. Trage beide Werte in die letzte Zeile ein.", "Vergleiche die vier Zeilen: Wo ist der Widerstand am größten?"]
  },
  "fs8": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "ohm-kennlinie", seite: 19,
    kapitel: "Strom in der Werkstatt",
    name: "Doppelte Spannung, doppelter Strom",
    titel: "Was macht doppelte Spannung?",
    frage: "Fließt bei doppelter Spannung auch doppelt so viel Strom?",
    auftrag: "",
    schritte: ["Drücke „20 Ω“ und dann einmal „◀ weniger“. Vergleiche die Statuszeile mit Zeile 1.", "Drücke einmal „mehr ▶“. Trage Spannung U und Stromstärke I in Zeile 2 ein.", "Drücke „10 Ω“. Trage die beiden neuen Werte in Zeile 3 ein.", "Vergleiche Zeile 1 und Zeile 2: Wie ändert sich die Stromstärke?"]
  },
  "fs9": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "reihe-widerstand", seite: 21,
    kapitel: "Strom in der Werkstatt",
    name: "Zwei Widerstände in einer Reihe",
    titel: "Was passiert hintereinander?",
    frage: "Was macht ein zweiter Widerstand in der Reihe mit dem Strom?",
    auftrag: "",
    schritte: ["Drücke zuerst ↺. Jetzt steht R₁ auf 10 Ω und R₂ auf 20 Ω, wie in Zeile 1. Vor der oberen Knopfreihe steht „R₁:“, vor der unteren „R₂:“.", "Drücke bei R₁ auf 20 Ω. Lies R_ges und den Strom I ab und trage Zeile 2 ein.", "Drücke bei R₁ auf 30 Ω und bei R₂ auf 30 Ω. Trage Zeile 3 ein.", "Vergleiche die drei Zeilen. Wird der Strom größer oder kleiner?"]
  },
  "fs10": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "parallel-widerstand", seite: 23,
    kapitel: "Strom in der Werkstatt",
    name: "Zwei Wege für den Strom",
    titel: "Was passiert nebeneinander?",
    frage: "Wie groß ist der Strom insgesamt, wenn er zwei Wege hat?",
    auftrag: "",
    schritte: ["Drücke in Zeile R₁ den Knopf 10 Ω, in Zeile R₂ den Knopf 20 Ω.", "Lies I₁, I₂ und den Gesamtstrom I in der Statuszeile ab.", "Drücke in Zeile R₁ den Knopf 30 Ω. Trage die zweite Zeile ein.", "Drücke danach in Zeile R₂ den Knopf 10 Ω. Ergänze die letzte Zeile."]
  },
  "fs11": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "elektronen-drift", seite: 25,
    kapitel: "Strom in der Werkstatt",
    name: "Langsames Wandern, schnelles Signal",
    titel: "Warum geht das Licht sofort an?",
    frage: "Müssen die Elektronen schnell durch das Kabel fahren, damit die Lampe sofort leuchtet?",
    auftrag: "",
    schritte: ["Drücke „Leselampe“ und sieh dir das Bild vom Kupferdraht an.", "Lies im Bild die Werte für Zappeln und Signal ab.", "Trage die zwei leeren Zeilen in die Tabelle ein.", "Lies in der Statuszeile, wie lange ein Elektron für einen Meter Kabel braucht."]
  },
  "fs12": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "blitz", seite: 27,
    kapitel: "Strom in der Werkstatt",
    name: "Warum kommt der Donner später?",
    titel: "Blitz und Donner",
    frage: "Warum hören wir den Donner erst nach dem Blitz?",
    auftrag: "",
    schritte: ["Stelle den Regler „Entfernung des Gewitters“ auf 1,0 km.", "Lies unter „4 · Der Donner kommt hinterher“ ab, wie lange der Donner braucht.", "Stelle den Regler danach auf 2,0 km und zuletzt auf 3,0 km.", "Trage die Zeit für den Donner und die Zeit für das Licht in die Tabelle ein."]
  },
  "fs13": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "stromgefahren", seite: 29,
    kapitel: "Strom in der Werkstatt",
    name: "Wann schaltet die Sicherung ab?",
    titel: "Zu viel an einer Steckdose",
    frage: "Wann unterbricht die Sicherung den Stromkreis?",
    auftrag: "",
    schritte: ["Lies die Anzeige ab: 1 Gerät zieht 6 A. Die Sicherung erlaubt 16 A.", "Drücke „➕ Gerät anschließen“. Lies den Strom ab und trage Zeile 2 ein.", "Drücke „➕ Gerät anschließen“ noch einmal. Lies die Meldung und trage Zeile 3 ein.", "Achte auf den Warnhinweis: Nie mit der Netzspannung (230 V) experimentieren – nur mit ungefährlicher Kleinspannung!"]
  },
  "fb1": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "v-begriff", seite: 34,
    kapitel: "Wie schnell ist schnell?",
    name: "Wer ist schneller?",
    titel: "Das Wettrennen am Bildschirm",
    frage: "Woran erkennst du, welches der zwei Autos schneller ist?",
    auftrag: "",
    schritte: ["Drücke den Knopf „Rennen starten“ und beobachte die zwei Autos.", "Lies die Statuszeile unter „Wer ist schneller?“. Zeile 1 ist schon ausgefüllt.", "Drücke bei Auto A den Knopf „schnell“ und dann „Rennen starten“. Trage Zeile 2 ein.", "Drücke bei Auto B den Knopf „langsam“ und dann „Rennen starten“. Trage Zeile 3 ein."]
  },
  "fb2": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "v-messen", seite: 36,
    kapitel: "Wie schnell ist schnell?",
    name: "Wie misst und rechnet man das Tempo?",
    titel: "Messen und ausrechnen",
    frage: "Wie rechnest du aus Strecke und Zeit die Geschwindigkeit aus?",
    auftrag: "",
    schritte: ["Drücke den Knopf langsam und danach den Knopf „Messung starten“.", "Vergleiche die Zeit im Bild mit der ersten Zeile der Tabelle.", "Drücke mittel und dann „Messung starten“. Trage die zweite Zeile ein.", "Drücke schnell und dann „Messung starten“. Ergänze die letzte Zeile."]
  },
  "fb3": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "v-umrechnung", seite: 38,
    kapitel: "Wie schnell ist schnell?",
    name: "Von m/s zu km/h – mal 3,6",
    titel: "km/h oder m/s?",
    frage: "Wie rechnest du einen Wert von m/s in km/h um?",
    auftrag: "",
    schritte: ["Lies zuerst die Statuszeile ab. Dort steht die Rechnung mit 3,6.", "Drücke „🚶 Fußgänger“. Vergleiche die Statuszeile mit Zeile 1 der Tabelle.", "Drücke „🚴 Radfahrer“. Trage beide Zahlen in Zeile 2 ein.", "Drücke „🚗 Auto (Stadt)“. Trage beide Zahlen in Zeile 3 ein."]
  },
  "fb4": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "gleichfoermig-rs", seite: 40,
    kapitel: "Wie schnell ist schnell?",
    name: "Was sagen die Abstände?",
    titel: "Kreidestriche auf dem Schulhof",
    frage: "Was sagen dir die Abstände zwischen den Sekunden-Marken?",
    auftrag: "",
    schritte: ["Lies zuerst Zeile 1 der Tabelle. So startet die Simulation.", "Wähle den Knopf „langsam“ und drücke danach „▶ Fahren“.", "Lies ab, welche Zahl bei v steht. Beobachte dabei die Abstände der Marken.", "Wiederhole das mit „schnell“ und fülle die letzte Zeile aus."]
  },
  "fb5": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "weg-zeit-diagramm", seite: 42,
    kapitel: "Wie schnell ist schnell?",
    name: "Was verrät die Linie im Weg-Zeit-Bild?",
    titel: "Linien an der Werkstattwand",
    frage: "Was sagt dir die Linie im Weg-Zeit-Diagramm über die Fahrt?",
    auftrag: "",
    schritte: ["Drücke „schnell“ und dann „▶ Fahren“. Zeile 1 der Tabelle ist schon ausgefüllt.", "Drücke „langsam“ und dann „▶ Fahren“. Beobachte, wie stark die Linie steigt.", "Lies die Statuszeile und trage Zeile 2 in die Tabelle ein.", "Drücke „mit Pause“ und dann „▶ Fahren“. Trage danach Zeile 3 ein."]
  },
  "fb6": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "v-zeit-diagramm", seite: 44,
    kapitel: "Wie schnell ist schnell?",
    name: "Was verrät die Linie im Tempo-Bild?",
    titel: "Die Linie steigt und fällt",
    frage: "Was bedeutet eine waagerechte, eine ansteigende und eine fallende Linie?",
    auftrag: "",
    schritte: ["Öffne die Simulation. Das Bild oben heißt dort „v-t-Diagramm“ – gemeint ist das Tempo-Zeit-Diagramm.", "Drücke den Knopf „konstant“ und dann „▶ Fahren“. Zeile 1 der Tabelle ist schon ausgefüllt.", "Drücke den Knopf „beschleunigen“ und dann „▶ Fahren“. Lies die Statuszeile und fülle Zeile 2 aus.", "Drücke den Knopf „bremsen“ und dann „▶ Fahren“. Lies die Statuszeile und fülle Zeile 3 aus."]
  },
  "fb7": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "bremsweg-jg9", seite: 46,
    kapitel: "Wie schnell ist schnell?",
    name: "Wie weit fährt ein Auto bis zum Halt?",
    titel: "Bis das Auto steht",
    frage: "Woraus besteht der Weg, bis das Auto wirklich steht?",
    auftrag: "",
    schritte: ["Drücke „▶ Gefahr! (Start)“ und beobachte, wie weit das Auto noch fährt.", "Lies in der Statuszeile Reaktionsweg und Bremsweg ab. Zeile 1 (50 km/h) ist schon ausgefüllt.", "Drücke „100 km/h“ für Zeile 2, danach „30 km/h“ für Zeile 3.", "Vergleiche den Bremsweg bei 50 km/h mit dem Bremsweg bei 100 km/h."]
  },
};

// simId -> alle Heftseiten, die darauf zeigen
const HEFT_ZU_SIM = {};
for (const [id, d] of Object.entries(HEFT_SEITEN))
  if (d.sim) (HEFT_ZU_SIM[d.sim] = HEFT_ZU_SIM[d.sim] || []).push(id);
