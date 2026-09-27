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
    sim: "magnetfeld", seite: 6,
    kapitel: "Magnetismus",
    name: "Magnete und magnetische Felder",
    titel: "Der Schlüssel liegt unten",
    frage: "Wie weit reicht die Wirkung eines Magneten?",
    schritte: ["Schalte Feldlinien ein und stelle „Stelle am Magneten“ auf 0 Grad, also an das Ende. Stelle den Abstand ganz klein.", "Vergrößere den Abstand Schritt für Schritt: erst auf einen mittleren, dann auf einen großen Wert. Merke dir die Zahl, ab der die Nadel kaum noch gedreht wird.", "Gegenprobe am Tisch: Nähere einen Magneten langsam einer Büroklammer. Lege dabei erst ein Blatt Papier dazwischen, dann ein dickes Buch."]
  },
  "m2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "magnet-stoffe", seite: 10,
    kapitel: "Magnetismus",
    name: "Welche Stoffe zieht ein Magnet an?",
    titel: "Nicht alles kommt mit",
    frage: "Welche Stoffe zieht ein Magnet an?",
    schritte: ["Wähle nacheinander Eisen-Nagel, Büroklammer (Stahl) und Nickel-Münze. Notiere jedes Mal, ob der Gegenstand angezogen wird.", "Prüfe danach Alu-Dose, Kupfer-Draht und Holz-Stab. Trage die Alu-Dose ein und vergleiche, was der Magnet mit den drei Gegenständen macht.", "Wähle zum Schluss Blech 1, Blech 2 und Blech 3. Finde heraus, welche Bleche der Magnet anzieht."]
  },
  "m3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "magnetpole", seite: 14,
    kapitel: "Magnetismus",
    name: "Wie wirken Magnetpole aufeinander?",
    titel: "Zwei Magnete, zweimal anders",
    frage: "Wie wirken zwei Magnetpole aufeinander?",
    schritte: ["Wähle Magnet an der Tür so herum und stelle Abstand d auf 5 cm. Lies ab, ob sich die Magnete anziehen oder abstoßen.", "Wähle nun Magnet an der Tür umgedreht bei gleichem Abstand d. Lies wieder ab und vergleiche mit Schritt 1.", "Stelle Abstand d auf 2 cm und danach auf 10 cm ein. Übernimm jeden Wert mit Messwert übernehmen."]
  },
  "m4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "magnetfeld", seite: 18,
    kapitel: "Magnetismus",
    name: "Wie sieht ein Magnetfeld aus?",
    titel: "Das unsichtbare Muster",
    frage: "Wo ist ein Magnetfeld stark und wo ist es schwach?",
    schritte: ["Schalte Feldlinien ein. Stelle „Stelle am Magneten“ auf 0 Grad und schau, wie dicht die Linien dort liegen.", "Stelle nacheinander 40 Grad und 90 Grad ein. Lies jedes Mal ab, ob die Linien dicht oder weit auseinander liegen. Schalte danach Kompass-Raster ein und stelle wieder 0 Grad ein.", "Gegenprobe am Tisch: Hänge eine Büroklammer an das Ende eines Magneten und danach an seine Mitte."]
  },
  "m5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "kompass", seite: 21,
    kapitel: "Magnetismus",
    name: "Wie funktioniert ein Kompass?",
    titel: "Im Park zeigt der Kompass plötzlich anders",
    frage: "Warum zeigt eine Kompassnadel nach Norden?",
    schritte: ["Schalte Erdmagnetfeld ein. Stelle „Magnet – Abstand“ auf den kleinsten Wert und lies ab, wohin die Nadelspitze zeigt.", "Stelle „Magnet – Abstand“ nacheinander auf 6 cm und auf den größten Wert. Lies jedes Mal die Richtung der Nadel ab.", "Stelle wieder 6 cm ein und schalte Erdmagnetfeld aus. Stoße die Nadel mit „Nadel anstoßen“ an und lies ab, wohin sie sich stellt."]
  },
  "l1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "lichtausbreitung", seite: 28,
    kapitel: "Licht & Schatten",
    name: "Lichtquellen und Lichtausbreitung",
    titel: "Zwei Löcher, und trotzdem dunkel",
    frage: "Läuft Licht geradeaus oder um die Ecke?",
    schritte: ["Stelle „Loch der 1. Blende“ auf 0 und „Loch der 2. Blende“ auf 0. Schau nach, ob hinten Licht am Schirm ankommt.", "Lass die 1. Blende auf 0 und schiebe „Loch der 2. Blende“ nach oben bis +18. Lies ab, wann das Licht verschwindet. Stelle zum Schluss „Loch der 2. Blende“ auf +18.", "Stelle „Loch der 1. Blende“ auf +18 und „Loch der 2. Blende“ auf 0. Probiere aus, bei welcher Zahl der 2. Blende wieder Licht ankommt."]
  },
  "l2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "sehen", seite: 32,
    kapitel: "Licht & Schatten",
    name: "Wie können wir einen Gegenstand sehen?",
    titel: "Es liegt doch direkt da",
    frage: "Warum sehen wir einen Gegenstand im Dunkeln nicht?",
    schritte: ["Stelle Zimmerlicht auf aus. Wähle nacheinander Tüte Gummibärchen und Katzenauge und notiere, was du siehst.", "Stelle Zimmerlicht auf an. Wähle dieselben zwei Gegenstände noch einmal und lies ab, was sich geändert hat. Stelle danach Zimmerlicht wieder auf aus und wähle Taschenlampe.", "Gegenprobe am Tisch: Leuchte im dunklen Zimmer mit der Taschenlampe auf einen Löffel und halte die Lampe dann daneben."]
  },
  "l3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "schatten-entstehung", seite: 36,
    kapitel: "Licht & Schatten",
    name: "Wie entsteht ein Schatten?",
    titel: "Der Klotz an der Wand",
    frage: "Wie entsteht ein Schatten?",
    schritte: ["Stelle Lampe (Höhe) auf oben. Schau nach, wo das Schattenbild an der Wand liegt und wie lang es ist.", "Stelle Lampe (Höhe) erst auf Mitte und dann auf unten. Lies jedes Mal ab, wohin der Schatten wandert und wie lang er ist.", "Stelle Gegenstand auf entfernt. Schau nach, was dann von dem Schatten übrig bleibt."]
  },
  "l4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "schatten-groesse", seite: 40,
    kapitel: "Licht & Schatten",
    name: "Wovon hängt die Größe des Schattens ab?",
    titel: "Bis unter die Decke",
    frage: "Wovon hängt die Größe eines Schattens ab?",
    schritte: ["Schiebe mit Pappwolf verschieben den Wolf dicht an die Bretterwand. Lies die Schattengröße B ab und wähle Messwert übernehmen.", "Schiebe den Pappwolf erst in die Mitte und dann weit von der Bretterwand weg. Wähle jedes Mal Messwert übernehmen und vergleiche die Werte.", "Lass den Pappwolf stehen und schiebe mit Bretterwand verschieben die Wand weiter weg. Lies die neue Schattengröße B ab."]
  },
  "l5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "kern-halbschatten", seite: 44,
    kapitel: "Licht & Schatten",
    name: "Kern- und Halbschatten",
    titel: "Zwei Kerzen, ein komischer Schatten",
    frage: "Warum hat ein Schatten manchmal einen helleren Rand?",
    schritte: ["Stelle Quelle auf „punktförmig“. Wähle dann „nur eine Taschenlampe“ und schau dir den Rand des Schattens an der Wand an.", "Wähle „zwei Lampen weit auseinander“. Vergleiche jetzt die Mitte des Schattens mit seinem Rand.", "Gegenprobe am Tisch: Leuchte im dunklen Zimmer mit zwei Taschenlampen nebeneinander auf einen Ball vor der Wand."]
  },
  "l6": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "reflexionsgesetz", seite: 48,
    kapitel: "Licht & Schatten",
    name: "Reflexionsgesetz & ebene Spiegel",
    titel: "Licht um die Ecke",
    frage: "Nach welcher Regel wird Licht an einem Spiegel reflektiert (zurückgeworfen)?",
    schritte: ["Stelle den Einfallswinkel zum Lot auf 20 Grad ein und lies ab, unter welchem Winkel der Strahl reflektiert (zurückgeworfen) wird. Wiederhole das mit 40 und mit 60 Grad.", "Stelle den Einfallswinkel auf 0 Grad, also senkrecht auf den Spiegel, und halte fest, wohin der Strahl geht.", "Stelle wieder 40 Grad ein und drehe dann den Spiegel um 10 Grad. Lies ab, um wie viel der Lichtfleck an der Wand weiterspringt."]
  },
  "s2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "stromkreis-lampe", seite: 56,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Wann leuchtet eine Lampe?",
    titel: "Alles heil, und trotzdem dunkel",
    frage: "Wann leuchtet eine Lampe und wann bleibt sie dunkel?",
    schritte: ["Stelle es so ein, dass „Schalter: geschlossen“ und „Kabel: heil“ dasteht. Schau nach, ob das Lämpchen leuchtet.", "Drücke einmal auf „Schalter: geschlossen“. Lies ab, was jetzt dasteht, und beobachte dabei das Lämpchen.", "Stelle den Schalter zurück und drücke stattdessen auf „Kabel: heil“. Beobachte das Lämpchen noch einmal. Stelle zum Schluss als Gegenprobe wieder „Schalter: geschlossen“ und „Kabel: heil“ ein."]
  },
  "s3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "leiter-nichtleiter", seite: 60,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Welche Stoffe leiten Strom?",
    titel: "Der Riss im Kabel",
    frage: "Welche Stoffe leiten den Strom?",
    schritte: ["Wähle nacheinander Büroklammer, Nagel und Münze. Notiere jedes Mal, ob das Lämpchen leuchtet.", "Prüfe danach Holz-Stab, Plastik-Lineal und Glas-Stab. Schreibe wieder auf, was du siehst.", "Wähle dann Alufolie und Bleistiftmine. Prüfe zuletzt als Gegenprobe den Radiergummi."]
  },
  "s6": {
    klasse: 5, schulform: "Realschule NRW",
    sim: null, seite: 64,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Der Schalter",
    titel: "Muss der Schalter an die Batterie?",
    frage: "Wovon hängt es ab, ob dein Schalter den Stromkreis unterbricht?",
    schritte: ["Baue aus dem Brettchen, den zwei Reißzwecken und der Büroklammer einen Schalter und setze ihn in deinen Stromkreis. Lege die Büroklammer auf beide Reißzwecken.", "Lege die Büroklammer zuerst auf beide Reißzwecken. Lege sie als Gegenprobe nur auf eine Reißzwecke.", "Setze den Schalter zuletzt dicht an die Batterie und danach hinter das Lämpchen. Halte fest, ob sich am Ergebnis etwas ändert."]
  },
  "s4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "reihenschaltung-rs", seite: 70,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Reihenschaltung",
    titel: "Zwei Lampen, und beide funzeln",
    frage: "Was geschieht, wenn mehrere Lampen hintereinander geschaltet sind?",
    schritte: ["Stelle Anzahl Lampen in Reihe auf 1 und lass Schalter geschlossen. Schau nach, wie hell die Lampe leuchtet.", "Stelle Anzahl Lampen in Reihe nacheinander auf 2 und auf 3. Vergleiche jedes Mal, wie hell eine einzelne Lampe leuchtet.", "Bleibe bei 3 Lampen und wähle bei Lampe 2 herausgedreht. Beobachte, was mit den anderen Lampen passiert."]
  },
  "s5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "parallelschaltung-rs", seite: 74,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Parallelschaltung",
    titel: "Vorne aus, hinten an",
    frage: "Warum lässt sich jede Lampe einzeln schalten?",
    schritte: ["Stelle Bens Schalter (Lampe 1) auf an und Jonas’ Schalter (Lampe 2) auf an. Lies ab, welche Lampen leuchten.", "Stelle Jonas’ Schalter (Lampe 2) auf aus. Beobachte, ob Lampe 1 weiterleuchtet.", "Stelle Bens Schalter (Lampe 1) auf aus und Jonas’ Schalter (Lampe 2) auf an. Lies ab, welche Lampe jetzt leuchtet. Stelle zum Schluss beide Schalter auf aus."]
  },
  "s7": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "elektromagnet", seite: 78,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Elektromagnet",
    titel: "Der Knopf, der den Magneten anschaltet",
    frage: "Wovon hängt die Stärke eines Elektromagneten ab?",
    schritte: ["Wähle „Windungszahl ändern“ und stelle 50, 100 und 200 ein. Lies jedes Mal die Tragkraft ab; die Stromstärke bleibt bei 2 A.", "Stelle die Windungszahl erst auf 150, dann auf 300 und vergleiche die beiden Werte.", "Wähle „Stromstärke ändern“ und stelle nacheinander 1 A, 2 A und 4 A ein; die Windungszahl bleibt fest bei 150."]
  },
  "s1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "schaltplan", seite: 68,
    kapitel: "Stromkreis & Elektromagnet",
    name: "Stromkreis und Schaltzeichen",
    titel: "Der Zettel aus dem Fahrradladen",
    frage: "Warum versteht ein anderer meine Schaltung schneller mit Schaltzeichen?",
    schritte: ["Ordne jedem Bauteil aus der Kiste sein Schaltzeichen vom Zettel zu.", "Zeichne die Batterie erst als eigenes Bild, dann als Schaltzeichen. Lass deinen Partner jedes Mal das passende Bauteil aus der Kiste holen.", "Zeichne deinen Stromkreis zweimal: mit eigenen Bildern und nur mit Schaltzeichen. Lass beides nachbauen."]
  },
  "w1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "temperatur-waerme", seite: 86,
    kapitel: "Temperatur & Wärme",
    name: "Sind Temperatur und Wärme das Gleiche?",
    titel: "Der Löffel in der Teetasse",
    frage: "Sind Temperatur und Wärme dasselbe?",
    schritte: ["Stelle bei Gefäß 1 Menge: 1 L und Temperatur: 80 °C ein, bei Gefäß 2 Menge: 1 L und Temperatur: 20 °C.", "Wähle In Kontakt bringen und lies beide Temperaturen ab. Wähle danach Zurücksetzen und stelle bei Gefäß 2 Menge: 2 L ein. Wähle wieder In Kontakt bringen.", "Gegenprobe am Tisch: Stelle einen Löffel in ein Glas mit warmem Wasser. Fasse den Griff nach zwei Minuten an."]
  },
  "w2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "thermometer", seite: 89,
    kapitel: "Temperatur & Wärme",
    name: "Wie funktioniert ein Thermometer?",
    titel: "Der Faden, der wandert",
    frage: "Wie zeigt ein Thermometer die Temperatur an?",
    schritte: ["Stelle die Temperatur auf 20 °C ein. Lies an der Skala ab, bei welcher Temperatur der Faden steht.", "Wähle nacheinander „Eiswasser“, „Bens Faust“ und „kochendes Wasser“. Lies jedes Mal die Temperatur ab.", "Gegenprobe am Tisch: Stelle ein Thermometer in ein Glas kaltes Wasser. Lies nach zwei Minuten ab."]
  },
  "w3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "waermeausdehnung", seite: 92,
    kapitel: "Temperatur & Wärme",
    name: "Was geschieht beim Erwärmen von Stoffen?",
    titel: "Der bockige Deckel",
    frage: "Dehnen sich alle Stoffe beim Erwärmen gleich stark aus?",
    schritte: ["Wähle „fest“ und stelle die Temperatur auf 20 °C ein. Erhöhe dann auf 80 °C und beobachte, wie stark sich der Stoff ausdehnt.", "Wähle „flüssig“ und danach „Gas“. Gehe jedes Mal wieder von 20 °C auf 80 °C und vergleiche, wer sich am stärksten ausdehnt. Wähle zum Schluss wieder „fest“ und stelle 20 °C ein.", "Gegenprobe am Tisch: Halte den Blechdeckel eines Glases kurz in heißes Wasser und drehe ihn danach auf."]
  },
  "w4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "aggregatzustaende", seite: 96,
    kapitel: "Temperatur & Wärme",
    name: "Wie verändern sich Aggregatzustände?",
    titel: "Aus Eis wird Wasser",
    frage: "Bei welchen Temperaturen ist Wasser fest, flüssig oder gasförmig?",
    schritte: ["Stelle die Temperatur auf 20 °C ein. Lies ab, ob das Wasser fest, flüssig oder gasförmig ist.", "Wähle „abkühlen“, bis du bei minus 10 °C bist. Beobachte, bei welcher Temperatur das Wasser fest wird.", "Wähle danach „erwärmen“ bis 50 °C und dann weiter bis 110 °C. Beobachte, bei welcher Temperatur aus dem Wasser Wasserdampf wird."]
  },
  "w5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "waermeuebertragung", seite: 100,
    kapitel: "Temperatur & Wärme",
    name: "Wie wird Wärme übertragen?",
    titel: "Zu heiß zum Anfassen",
    frage: "Auf welchen Wegen wandert Wärme zu einem kalten Körper?",
    schritte: ["Wähle Leitung. Beobachte, an welcher Stelle es zuerst warm wird und wohin die Wärme von dort aus wandert.", "Wähle danach Strömung und dann Strahlung. Lies jedes Mal ab, ob die Wärme den kalten Körper auch ohne Berührung erreicht.", "Gegenprobe am Tisch: Stelle einen Metalllöffel und einen Holzlöffel in ein Glas mit warmem Wasser und fühle nach fünf Minuten."]
  },
  "sc1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "ton-entsteht", seite: 107,
    kapitel: "Schall & Hören",
    name: "Wie entsteht ein Ton?",
    titel: "Das Brummen aus der Keksdose",
    frage: "Wie entsteht ein Ton?",
    schritte: ["Wähle Gummiband zupfen. Beobachte das Band ganz genau und höre hin, ob dabei ein Ton entsteht.", "Wähle nun Finger auf das Band legen. Lies ab, ob das Band noch schwingt und ob der Ton weitergeht. Wähle dann noch einmal Gummiband zupfen.", "Gegenprobe am Tisch: Spanne ein Gummiband zwischen deine Finger, zupfe es und stoppe es dann mit dem Daumen."]
  },
  "sc2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "lautstaerke", seite: 110,
    kapitel: "Schall & Hören",
    name: "Wovon hängt die Lautstärke ab?",
    titel: "Nicht so laut!",
    frage: "Wovon hängt die Lautstärke ab?",
    schritte: ["Stelle „So fest wird am Gummiband gezupft“ auf sanft. Beobachte, wie weit das Band ausschlägt, und lies die Lautstärke ab.", "Stelle danach mittel und dann fest ein. Lies jedes Mal ab, wie weit das Band ausschlägt und wie laut der Ton wird.", "Vergleiche zum Schluss sanft und fest. Achte darauf, ob der Ton dabei nur lauter wird oder auch höher klingt."]
  },
  "sc3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "tonhoehe", seite: 113,
    kapitel: "Schall & Hören",
    name: "Wovon hängt die Tonhöhe ab?",
    titel: "Zu hoch, zu tief",
    frage: "Wovon hängt die Tonhöhe ab?",
    schritte: ["Stelle „Schwingungen pro Sekunde (Frequenz)“ auf 200 Hz ein. Höre den Ton an.", "Stelle danach 300 Hz und 800 Hz ein. Lies jedes Mal ab, ob der Ton höher oder tiefer klingt als vorher.", "Gegenprobe am Tisch: Fülle zwei Gläser verschieden hoch mit Wasser und schlage sie mit einem Löffel an."]
  },
  "sc4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "schallausbreitung", seite: 117,
    kapitel: "Schall & Hören",
    name: "Wie breitet sich Schall aus?",
    titel: "Der Nachbar hört alles",
    frage: "Braucht Schall einen Stoff, in dem er sich ausbreiten kann?",
    schritte: ["Wähle „Luft“ und höre, wie laut der Schall ankommt. Wähle dann „Wasser“ und vergleiche beides.", "Wähle „Balken (Holz)“. Lies ab, ob der Schall dort lauter oder leiser ankommt als durch Luft.", "Wähle zum Schluss „Vakuum (Weltall)“. Beobachte, ob überhaupt noch etwas bei dir ankommt."]
  },
  "sc5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "ohr", seite: 121,
    kapitel: "Schall & Hören",
    name: "Wie funktioniert das Ohr?",
    titel: "Das Pfeifen im Ohr",
    frage: "Was geschieht im Ohr, wenn es laut wird?",
    schritte: ["Stelle „So laut wird der Topf angeschlagen“ auf leise. Beobachte, wie weit das Trommelfell ausschlägt.", "Stelle danach mittel und laut ein. Lies jedes Mal ab, ob das Trommelfell schwächer oder stärker schwingt.", "Gegenprobe am Tisch: Schlage einen Topf mit dem Löffel erst leise, dann kräftig an und fühle den Rand."]
  },
  "h1": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "tag-nacht", seite: 128,
    kapitel: "Sonne, Erde & Mond",
    name: "Wie entstehen Tag und Nacht?",
    titel: "Tag hier, Nacht dort",
    frage: "Wie entstehen Tag und Nacht?",
    schritte: ["Halte mit Pause an und stelle Drehung auf 0 Grad ein. Sieh nach, wie viel von der Erde beleuchtet ist und wie viel im Schatten liegt.", "Stelle danach 90, 180 und 270 Grad ein. Lies jedes Mal ab, ob dein Ort im Licht liegt oder im Schatten.", "Gegenprobe am Tisch: Leuchte mit einer Taschenlampe auf einen Globus. Drehe ihn langsam und suche die Grenze zwischen Tag und Nacht."]
  },
  "h2": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "jahreszeiten", seite: 131,
    kapitel: "Sonne, Erde & Mond",
    name: "Wie entstehen die Jahreszeiten?",
    titel: "Vom Schnee zum Sonnenbrand",
    frage: "Warum ist es im Sommer wärmer als im Winter?",
    schritte: ["Wähle Sommer und sieh nach, welche Erdhalbkugel zur Sonne geneigt ist. Achte darauf, wie steil das Licht bei uns auftrifft.", "Wähle danach Herbst, Winter und Frühling. Vergleiche jedes Mal, wie steil oder wie flach das Licht bei uns ankommt.", "Gegenprobe am Tisch: Leuchte mit einer Taschenlampe steil und dann flach auf ein Blatt Papier. Vergleiche die Lichtflecke."]
  },
  "h3": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "mondphasen", seite: 135,
    kapitel: "Sonne, Erde & Mond",
    name: "Warum verändert der Mond sein Aussehen?",
    titel: "Jeden Abend ein anderer Mond",
    frage: "Warum verändert der Mond sein Aussehen?",
    schritte: ["Wähle Mond zwischen Sonne und Erde. Sieh nach, wie viel von der beleuchteten Hälfte des Mondes du von der Erde aus siehst.", "Wähle danach Mond seitlich – zunehmend, dann Mond der Sonne gegenüber, dann Mond seitlich – abnehmend. Lies jedes Mal die Mondphase ab.", "Gegenprobe am Tisch: Leuchte mit einer Taschenlampe auf einen Ball und bewege ihn langsam um deinen Kopf herum."]
  },
  "h4": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "sonnenfinsternis", seite: 139,
    kapitel: "Sonne, Erde & Mond",
    name: "Wie entsteht eine Sonnenfinsternis?",
    titel: "Nacht am Mittag",
    frage: "Wie entsteht eine Sonnenfinsternis?",
    schritte: ["Stelle Mondstellung auf 40. Schau nach, ob der Schatten des Mondes die Erde trifft.", "Stelle den Regler dann auf 20 und auf 12. Nutze zuletzt den Knopf „Ball genau in die Linie stellen“ und lies jedes Mal ab, welcher Schatten die Erde trifft.", "Gegenprobe am Tisch: Leuchte im dunklen Zimmer mit einer Taschenlampe auf einen Globus. Halte einen kleinen Ball genau dazwischen."]
  },
  "h5": {
    klasse: 5, schulform: "Realschule NRW",
    sim: "mondfinsternis", seite: 142,
    kapitel: "Sonne, Erde & Mond",
    name: "Wie entsteht eine Mondfinsternis?",
    titel: "Der Mond wird rot",
    frage: "Wie entsteht eine Mondfinsternis?",
    schritte: ["Stelle Mondbahn neben der Schattenmitte auf 40. Schau dir an, wie hell der Mond dort ist.", "Stelle den Regler dann auf 20 und auf 12. Lies jedes Mal ab, wie viel vom Mond noch hell ist.", "Nutze zuletzt den Knopf „Ball genau hinter den Globus stellen“. Beobachte in Ruhe, welche Farbe der Mond nun hat."]
  },
  "o1": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "lochkamera", seite: 6,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie macht ein kleines Loch ein Bild? (Lochkamera)",
    titel: "Ein Stich in den Karton",
    frage: "Wie verändern sich Schärfe und Helligkeit des Bildes, wenn das Loch größer wird?",
    schritte: ["Stelle die Gegenstandsweite g auf 40 cm, die Bildweite b (Kameralänge) auf 30 cm und die Lochgröße auf klein. Beschreibe, wie das Bild auf dem Schirm steht.", "Stelle die Lochgröße nacheinander auf mittel und auf groß, ohne g und b zu verändern. Achte jedes Mal auf Schärfe und Helligkeit des Bildes.", "Stelle die Lochgröße wieder auf klein und vergrößere die Bildweite b (Kameralänge) von 30 cm auf 55 cm. Vergleiche das Bild mit deiner ersten Einstellung."]
  },
  "o2": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sammellinse", seite: 10,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie bündelt eine Sammellinse das Licht?",
    titel: "Der kleinste helle Fleck",
    frage: "Wovon hängt es ab, wie weit hinter der Linse das Licht gebündelt wird?",
    schritte: ["Wähle „in der Mitte dicker“ und stelle „Wölbung des Glases – Brennweite f“ auf 90 ein. Lies ab, in welchem Abstand hinter der Linsenmitte sich alle Strahlen im Brennpunkt treffen.", "Stelle f nacheinander auf 60 und auf 150. Achte darauf, wie stark die Linse jeweils gewölbt ist und wie weit der Brennpunkt von der Linse entfernt liegt.", "Gegenprobe: Wähle bei f 90 den Knopf „in der Mitte dünner“ und beobachte, ob sich die Strahlen hinter der Linse noch in einem Punkt treffen."]
  },
  "o8": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sammellinse", seite: 14,
    kapitel: "Optik: Wie wir sehen",
    name: "Sammellinse und Zerstreuungslinse im Vergleich",
    titel: "Das Glas, das nichts bündelt",
    frage: "Was macht eine Sammellinse, was ein in der Mitte dünneres Glas mit dem Licht?",
    schritte: ["Wähle „in der Mitte dicker“ und stelle Wölbung des Glases – Brennweite f auf 90. Verfolge, wo sich die Strahlen hinter der Linse treffen.", "Wähle bei derselben Brennweite f von 90 „in der Mitte dünner“. Suche hinter der Linse wieder einen Brennpunkt.", "Gegenprobe am Tisch: Lege eine Lupe und ein Brillenglas für Kurzsichtige auf eine Zeile Schrift und hebe beide langsam an."]
  },
  "o3": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "bild-linse", seite: 18,
    kapitel: "Optik: Wie wir sehen",
    name: "Wann entsteht ein vergrößertes oder verkleinertes Bild?",
    titel: "Mal riesig, mal winzig",
    frage: "Wann entsteht ein vergrößertes, wann ein verkleinertes Bild?",
    schritte: ["Stelle die Gegenstandsweite g auf 170. Vergleiche die Höhe des Bildes mit der Höhe des Gegenstands und beachte, ob das Bild aufrecht oder umgekehrt ist.", "Stelle g nacheinander auf 124, also auf 2f, und danach auf 91. Beobachte jedes Mal die Bildgröße und die Bildweite (den Abstand des Bildes zur Linse).", "Stelle g auf den kleinsten einstellbaren Wert, der kleiner als f = 62 ist. Prüfe, ob sich die Strahlen hinter der Linse noch treffen."]
  },
  "o4": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "lupe", seite: 22,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie funktioniert eine Lupe?",
    titel: "Wenn das Bild kippt",
    frage: "Warum vergrößert eine Lupe erst, wenn sie nah genug am Gegenstand steht?",
    schritte: ["Stelle den Regler „Abstand Gegenstand–Lupe g“ auf 10 ein und lies die angegebene Vergrößerung ab. Stelle danach 30 ein und lies erneut ab.", "Stelle g auf 54 und danach auf 58 und 80 ein. Notiere, ab welchem Wert die Simulation kein aufrechtes Lupenbild mehr zeigt.", "Gegenprobe am Tisch: Lege eine Lupe flach auf eine Schrift und hebe sie langsam an, bis das Bild verschwimmt und umgekehrt erscheint."]
  },
  "o5": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "kamera", seite: 26,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie funktioniert eine Kamera?",
    titel: "Das Papier muss wandern",
    frage: "Was muss man an einer Kamera einstellen, damit das Bild scharf wird?",
    schritte: ["Stelle „Abstand Linse–Sensor (Bildweite)“ auf 90 und „Blende (Öffnung)“ auf mittel ein und lies die Meldung ab. Verkleinere den Wert in Zweierschritten und notiere, zwischen welchen Werten das Bild scharf ist.", "Stelle die Bildweite auf 66 und „Blende (Öffnung)“ nacheinander auf mittel, klein (dunkel) und groß (hell). Stelle danach die Bildweite auf 110, die Blende bleibt groß (hell).", "Gegenprobe am Tisch: Fange mit einer Lupe das Bild des Fensters auf einem weißen Blatt auf und verschiebe das Blatt, bis das Bild scharf ist."]
  },
  "o6": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "auge", seite: 30,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie funktioniert das Auge?",
    titel: "Der Turm auf dem Papier",
    frage: "Wie ändert sich das Bild auf der Netzhaut, wenn der Gegenstand näher kommt?",
    schritte: ["Stelle „Abstand des Gegenstands“ auf weit und „Pupille (Helligkeit)“ auf mittel. Vergleiche, wohin die Spitze des Gegenstands zeigt und wohin die Spitze des Bildes auf der Netzhaut zeigt.", "Stelle „Abstand des Gegenstands“ nacheinander auf mittel und auf nah. Lies jedes Mal ab, wie groß das Bild auf der Netzhaut ist und wohin seine Spitze zeigt.", "Gegenprobe am Tisch: Halte eine Lupe etwa eine Handbreit vor ein weißes Blatt und suche darauf das Bild des Fensters. Prüfe, wohin der Fensterrahmen auf dem Blatt zeigt."]
  },
  "o7": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brille", seite: 34,
    kapitel: "Optik: Wie wir sehen",
    name: "Wie korrigiert eine Brille Sehfehler?",
    titel: "Das Bild landet daneben",
    frage: "Wohin schiebt eine Brille den Brennpunkt?",
    schritte: ["Wähle kurzsichtig und beobachte, wo sich die Strahlen treffen: vor der Netzhaut, genau auf ihr oder dahinter. Schalte dann Brille dazu und beobachte den Brennpunkt erneut.", "Wähle weitsichtig und beobachte den Brennpunkt ohne und mit Brille. Notiere jedes Mal, wo die Strahlen zusammenlaufen und wie scharf das Bild ist.", "Gegenprobe am Tisch: Lege zwei Brillengläser auf eine Zeitungsseite. Das Glas, das die Schrift vergrößert, ist in der Mitte dicker, das andere in der Mitte dünner."]
  },
  "f8": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "licht-oberflaeche", seite: 42,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Was passiert, wenn Licht auf eine Oberfläche trifft?",
    titel: "Zwei Bilder in einer Scheibe",
    frage: "Was geschieht mit dem Licht, wenn es auf verschiedene Oberflächen trifft?",
    schritte: ["Stelle den Winkel zum Lot auf 45° und wähle Spiegel. Lies ab, welche Anteile des Lichts reflektiert, durchgelassen und absorbiert werden.", "Wähle bei genau diesem Winkel nacheinander Fensterglas, schwarzes Papier und weißes Papier. Lies jedes Mal alle drei Anteile ab.", "Gegenprobe am Tisch: Leuchte mit der Taschenlampe schräg auf einen Spiegel und auf schwarzes Papier und fange das reflektierte Licht auf einem weißen Blatt auf."]
  },
  "f9": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "reflexionsgesetz", seite: 46,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Nach welcher Regel wird Licht an einem Spiegel zurückgeworfen?",
    titel: "Der Punkt an der Wand",
    frage: "Nach welcher Regel wird Licht an einem Spiegel reflektiert?",
    schritte: ["Lass Spiegel drehen auf 0° und stelle den Einfallswinkel zum Lot nacheinander auf 20° und 65° ein. Lies jedes Mal den Reflexionswinkel ab.", "Stelle den Einfallswinkel zum Lot auf 40° und Spiegel drehen auf 10°. Lies den Reflexionswinkel ab und beobachte, wie weit der Strahl im Raum schwenkt.", "Wähle Spiegel zurückstellen und danach Strahl auf das Lot. Halte fest, wohin der reflektierte Strahl läuft."]
  },
  "f1": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "spiegelbild", seite: 50,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wie entsteht ein Spiegelbild?",
    titel: "Hinter dem Glas steht niemand",
    frage: "Wie weit hinter dem Spiegel liegt das Spiegelbild?",
    schritte: ["Stelle den Regler Abstand Gegenstand–Spiegel g auf 60 ein und lies ab, wie weit das Bild hinter dem Spiegel liegt. Das ist dein Ausgangswert.", "Stelle nacheinander 110 und 160 ein und lies jedes Mal beide Abstände ab. Achte darauf, ob sich das Bild dabei vom Spiegel wegbewegt.", "Gegenprobe am Tisch: Stelle einen Spiegel senkrecht auf und lege eine Münze 5 cm davor. Prüfe, ob ihr Bild ebenso weit hinter dem Spiegel zu liegen scheint."]
  },
  "f10": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brechung-eintritt", seite: 54,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wo ändert das Licht beim Übergang von Luft in Glas seine Richtung?",
    titel: "Der Knick am Rand",
    frage: "An welcher Stelle ändert ein Lichtstrahl beim Übergang von Luft in Glas seine Richtung?",
    schritte: ["Stelle den Regler Winkel in der Luft (Einfallswinkel) auf 20° ein und lies den Winkel im Glas (Brechungswinkel) ab. Achte darauf, an welcher Stelle der Strahl seine Richtung ändert.", "Stelle nacheinander 40° und 60° ein und lies jedes Mal den Brechungswinkel ab. Vergleiche ihn mit dem eingestellten Einfallswinkel.", "Schalte ungebrochene Richtung ein und vergleiche sie mit dem wirklichen Strahl im Glas. Wähle danach genau auf das Lot und prüfe, ob der Strahl noch seine Richtung ändert."]
  },
  "f2": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brechung", seite: 58,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Warum erscheint ein Gegenstand im Wasser verschoben?",
    titel: "Die Münze kommt zurück",
    frage: "Warum erscheint ein Gegenstand im Wasser höher, als er wirklich liegt?",
    schritte: ["Stelle Tiefe des Gegenstands auf 40 ein. Vergleiche, wo der Gegenstand wirklich liegt und in welcher scheinbaren Tiefe dein Auge ihn sieht.", "Stelle nacheinander 60 und 90 ein. Lies jedes Mal die scheinbare Tiefe ab und berechne, wie weit der scheinbare Ort über dem Gegenstand liegt.", "Gegenprobe am Tisch: Lege eine Münze in ein Glas Wasser und schaue schräg von oben hinein. Prüfe, ob sie höher zu liegen scheint als der Glasboden."]
  },
  "f3": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brechungswinkel", seite: 62,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wovon hängt die Stärke der Brechung ab?",
    titel: "Immer zehn Grad weiter",
    frage: "Wovon hängt es ab, wie stark ein Lichtstrahl gebrochen wird?",
    schritte: ["Wähle Glas und stelle den Einfallswinkel θ auf 20 Grad ein. Lies den Brechungswinkel ab und vergleiche ihn mit dem Einfallswinkel.", "Stelle den Einfallswinkel θ nacheinander auf 40 Grad und auf 60 Grad ein. Lies jedes Mal den Brechungswinkel ab und prüfe, ob er sich beim Verdoppeln mitverdoppelt.", "Wähle bei 60 Grad Wasser statt Glas und lies den Brechungswinkel noch einmal ab. Vergleiche ihn mit dem Wert, den Glas bei 60 Grad ergeben hat."]
  },
  "f11": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "brechung-austritt", seite: 66,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Was geschieht beim Übergang von Glas in Luft?",
    titel: "Zurück ins Freie",
    frage: "Ab welchem Winkel tritt aus dem Glas kein Licht mehr in die Luft aus?",
    schritte: ["Stelle den Einfallswinkel am Regler „Winkel im Glas“ auf 10 Grad ein und lies den Brechungswinkel in der Luft ab. Wiederhole das mit 25 Grad und mit 40 Grad.", "Stelle den Winkel im Glas auf 41 Grad ein und beobachte, wie der austretende Strahl jetzt liegt und wie hell er noch ist. Wähle dann „42° – Grenzwinkel“.", "Wähle „55° – Totalreflexion“ und prüfe, ob vorn noch Licht austritt oder ob alles an der geraden Fläche reflektiert wird."]
  },
  "f4": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "totalreflexion", seite: 70,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wie funktioniert ein Lichtleiter?",
    titel: "Das Licht macht die Kurve",
    frage: "Warum läuft Licht in einem dünnen Faden um die Kurve, statt seitlich auszutreten?",
    schritte: ["Stelle den Einfallswinkel an der Wand θ auf 30 Grad ein und beobachte, ob Licht durch die Wand nach außen tritt.", "Vergrößere θ erst auf 40 Grad, dann auf 42 Grad und halte fest, bei welchem Wert zum ersten Mal nichts mehr nach außen dringt.", "Stelle θ auf 60 Grad ein und verfolge, wie der Strahl im Inneren weiterläuft und wie oft er an den Wänden reflektiert wird."]
  },
  "f5": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "prisma", seite: 74,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Welche Farben stecken im weißen Licht?",
    titel: "Der Streifen auf dem Bauplan",
    frage: "Welche Farben stecken im weißen Licht?",
    schritte: ["Stelle „weißes Licht“ ein und beobachte, was hinter dem Prisma zu sehen ist. Notiere die Farben in ihrer Reihenfolge.", "Wähle „nur Rot“ und merke dir, wohin dieser Strahl läuft. Wähle danach „nur Blau“ und vergleiche, welcher der beiden Strahlen stärker abgelenkt wird.", "Gegenprobe am Tisch: Leuchte mit einer Taschenlampe durch ein Prisma aus der Schulsammlung und fange das Licht dahinter auf weißem Papier auf."]
  },
  "f6": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "regenbogen", seite: 78,
    kapitel: "Spiegel, Brechung & Farben",
    name: "Wie entstehen die Farben eines Regenbogens?",
    titel: "Der Bogen über dem Feld",
    frage: "Warum ist ein Regenbogen nur mit der Sonne im Rücken zu sehen?",
    schritte: ["Wähle „ein Tropfen“ und verfolge den Weg des Lichts: Eintritt vorn, Reflexion an der Rückseite, Austritt. Halte fest, auf welcher Seite das Licht den Tropfen verlässt.", "Bleibe bei „ein Tropfen“ und vergleiche, in welche Richtung Rot und Violett austreten. Notiere, welche Farbe den größeren Winkel zur einfallenden Richtung hat.", "Stelle „der ganze Bogen“ ein und beobachte, aus welchen Tropfen Rot und Violett ins Auge kommen. Achte darauf, wo der Bogen zur Sonne liegt."]
  },
  "g1": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "himmelskoerper", seite: 86,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Sonne, Mond und Sterne – was leuchtet am Himmel?",
    titel: "Einer funkelt, einer nicht",
    frage: "Welche Himmelskörper leuchten selbst, welche werden nur beleuchtet?",
    schritte: ["Wähle nacheinander Sonne, Stern, Mond und Planet. Halte fest, welcher Punkt ruhig und rund steht und welcher zittert.", "Wähle bei jedem der vier Sonnenlicht abdecken und lies ab, ob er weiter leuchtet oder verschwindet.", "Gegenprobe am Tisch: Richte im dunklen Raum eine Taschenlampe auf eine Styroporkugel und decke die Lampe dann ab."]
  },
  "g2": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "tag-nacht", seite: 91,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wie entstehen Tag und Nacht?",
    titel: "Dieselbe Minute, vier Uhrzeiten",
    frage: "Warum ist es in Japan Nacht, während bei uns die Sonne scheint?",
    schritte: ["Halte mit Pause an und stelle Drehung auf 0°. Notiere, wie groß der beleuchtete Teil ist und ob in Deutschland und Japan Tag oder Nacht ist.", "Drehe auf 90°, 180° und 270° weiter und lies jedes Mal beide Orte ab. Achte darauf, ob der beleuchtete Teil je größer wird.", "Gegenprobe am Tisch: Richte eine Taschenlampe waagerecht auf einen Globus und drehe ihn langsam."]
  },
  "g3": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "gravitation", seite: 95,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Die Gravitation – warum fällt alles nach unten?",
    titel: "Wer ist zuerst unten?",
    frage: "Fällt ein schwerer Körper schneller als ein leichter?",
    schritte: ["Wähle in der Simulation Erde und starte den Fall mit Noch einmal fallen lassen. Achte im Rohr „ohne Luft“ genau darauf, ob der schwere Körper vor dem leichten ankommt oder beide gleichzeitig.", "Wähle danach Mond und anschließend Jupiter und lass jedes Mal noch einmal fallen. Halte für Erde, Mond und Jupiter fest, wie lange der Fall dauert (Fallzeit t) und ob sich die Reihenfolge dabei ändert.", "Gegenprobe am Tisch: Lass eine Münze und ein flaches Blatt Papier aus gleicher Höhe gleichzeitig los. Zerknülle dann dasselbe Blatt zu einer festen Kugel und wiederhole den Versuch."]
  },
  "g9": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "gravitation-abstand", seite: 99,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wovon hängt die Anziehungskraft zweier Körper ab?",
    titel: "Der Kleine zieht, der Große nicht",
    frage: "Wovon hängt die Anziehungskraft zweier Körper ab – von den Massen, vom Abstand?",
    schritte: ["Setze mit zurücksetzen alle Werte auf 1 und lies die Anziehungskraft ab. Dieser Wert ist dein Ausgangswert, mit dem du alles Weitere vergleichst.", "Verdopple mit ×2 Masse links die Masse der linken Kugel und lies ab. Drücke denselben Knopf noch einmal, sodass die Masse viermal so groß ist wie am Anfang, und lies wieder ab.", "Setze zurück und verdopple stattdessen mit ×2 Abstand den Abstand, danach ein zweites Mal. Vergleiche beide Werte mit deinem Ausgangswert."]
  },
  "g6": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "planetenbahn", seite: 103,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Warum fallen die Planeten nicht in die Sonne?",
    titel: "Warum stürzt er nicht?",
    frage: "Warum stürzt die Erde nicht in die Sonne, obwohl diese sie anzieht?",
    schritte: ["Stelle die Startgeschwindigkeit quer zur Sonne auf 10 km/s ein und wähle „neu starten“. Schalte auf Zeitraffer ×4 und verfolge, ob der Planet an der Sonne vorbeikommt oder in sie hineinfällt.", "Schalte Vergleichsspur an und lass den Planeten nacheinander mit 20 km/s, 30 km/s und 45 km/s laufen, dazwischen jeweils neu starten. Die alten Spuren bleiben stehen, so liegen alle vier Bahnen übereinander.", "Gegenprobe am Tisch: Wirf auf dem Schulhof einen Ball erst sanft, dann so fest du kannst. Er fliegt jedes Mal weiter und landet doch wieder, und du siehst, was ihm gegenüber dem Planeten fehlt."]
  },
  "g7": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sonnensystem", seite: 107,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Acht Planeten, zwei Sorten",
    titel: "Die Kleinen und die Riesen",
    frage: "Worin unterscheiden sich die vier inneren Planeten von den vier äußeren?",
    schritte: ["Wähle Größen. Die acht Planeten stehen dann im gleichen Maßstab nebeneinander. Suche den größten und den kleinsten heraus und merke dir, wo die Grenze zwischen den kleinen und den großen verläuft.", "Öffne den Steckbrief nacheinander für Merkur, Erde, Jupiter und Neptun. Lies jedes Mal den Durchmesser ab und ob der Planet eine feste Oberfläche hat, und trage beides in die Tabelle ein.", "Wähle Abstände und lass die Planeten mit Umlauf bei sehr schnell laufen. Achte darauf, dass die vier kleinen Planeten innen dicht beieinander kreisen und die vier großen weit außen."]
  },
  "g8": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "ortsfaktor", seite: 111,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wäre ich auf dem Mond wirklich leichter?",
    titel: "Hüpfen wie auf dem Mond",
    frage: "Wäre auf dem Mond meine Masse kleiner – oder nur meine Gewichtskraft?",
    schritte: ["Stelle in der Simulation Erde ein und lies beide Anzeigen ab: die Masse in Kilogramm und die Gewichtskraft in Newton.", "Wähle nacheinander Mond und Jupiter und lies jedes Mal beide Werte ab. Trage sie in die Tabelle ein.", "Teile bei jedem Himmelskörper die Gewichtskraft durch die Masse und vergleiche die drei Ergebnisse. Wähle danach noch einmal Erde und prüfe, ob dieselben Werte wie am Anfang erscheinen."]
  },
  "g10": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "gezeiten", seite: 115,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Warum steigt und fällt das Meer zweimal am Tag?",
    titel: "Zweimal am Tag",
    frage: "Warum steigt und fällt das Meer zweimal am Tag?",
    schritte: ["Suche die Stellen, an denen das Wasser am höchsten steht. Halte fest, wie viele es sind und wo sie liegen.", "Vergleiche die Anziehungskraft auf das Wasser der Mondseite, auf den Erdmittelpunkt und auf das Wasser der Rückseite.", "Drehe mit Erde von Hand drehen einmal ganz herum und zähle, wie oft dein Ort durch einen Flutberg läuft (am Bildschirm: „Wasserberg“). Stelle danach nacheinander 0 h, 6 h und 12 h ein und zum Schluss als Gegenprobe noch einmal 0 h mit Sonne dazu; trage jedes Mal den Wasserstand ein."]
  },
  "g4": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "weltall-aufbau", seite: 120,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wie groß ist das Sonnensystem wirklich?",
    titel: "Der Fußball und die Stecknadel",
    frage: "Wie groß ist das Sonnensystem im Vergleich zur Milchstraße?",
    schritte: ["Setze mit Zurücksetzen auf den Anfang und zoome Schritt für Schritt heraus. Halte fest, was neu ins Bild kommt: im Ausgangsbild, nach einem und nach zwei Schritten und zum Schluss so weit herausgezoomt wie möglich.", "Zoome weiter, bis die Sonne nur ein Punkt unter vielen ist, und zähle die Schritte. Suche beim Hineinzoomen ihre Stelle in der Scheibe.", "Gegenprobe am Tisch: Lege auf dem Schulhof einen Fußball als Sonne hin und schreite 24 Meter bis zur Stecknadel ab."]
  },
  "g5": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "entfernungen", seite: 124,
    kapitel: "Sonne, Planeten und Schwerkraft",
    name: "Wie weit ist es im Weltall? (Lichtjahr)",
    titel: "Wie alt ist dieses Licht?",
    frage: "Ist ein Lichtjahr eine Zeit oder eine Strecke?",
    schritte: ["Setze die Simulation mit Zurücksetzen auf den Anfang und sende einen Lichtblitz zum Mond. Lies ab, wie lange er unterwegs ist, und trage die Zeit in die Tabelle ein.", "Gehe mit weiter zum nächsten Ziel und sende dort erneut einen Lichtblitz. Notiere so die Laufzeit für die Sonne und für den nächsten Stern und achte darauf, ab welchem Ziel die Zeit nicht mehr in Minuten, sondern in Jahren angegeben wird.", "Gehe mit näher wieder zurück zum Mond und sende noch einmal einen Lichtblitz. Prüfe, ob dieselbe Strecke wieder dieselbe Laufzeit ergibt."]
  },
  "t1": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "teleskop", seite: 132,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Wie holt ein Teleskop ferne Objekte näher heran?",
    titel: "Zwei Gläser auf der Leiste",
    frage: "Warum zeigt ein Teleskop mehr Sterne als das bloße Auge?",
    schritte: ["Stelle in der Simulation zuerst bloßes Auge ein und halte fest, wie viel du von dem Objekt erkennst. Wechsle dann auf mit Teleskop und beschreibe, was sich am Bild ändert.", "Bleibe bei „mit Teleskop“ und wechsle von „kleine Öffnung“ auf „große Öffnung“ und zur Gegenprobe wieder zurück auf „kleine Öffnung“. Zähle jedes Mal, wie viele lichtschwache Punkte noch zu sehen sind, und achte darauf, ob das Bild dabei größer wird oder nur heller.", "Gegenprobe am Tisch: Fange mit einer Lupe das Bild eines fernen Fensters auf einem Blatt Papier auf und decke danach die halbe Linse mit Papier ab. Prüfe, ob das Bild kleiner oder nur dunkler wird."]
  },
  "t2": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "spezialteleskop", seite: 136,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Wie sieht man mit besonderen Teleskopen unsichtbares Licht?",
    titel: "Die Lampe, die keiner sieht",
    frage: "Was zeigt derselbe Himmelsausschnitt in Licht, das wir nicht sehen können?",
    schritte: ["Stelle in der Simulation am Boden ein und schalte nacheinander Licht, Infrarot, Radio und Röntgen durch. Halte für jeden Bereich fest, was von der Himmelsstelle zu sehen ist. Trage die Einstellungen am Boden mit Licht, Infrarot und Röntgen in dieser Reihenfolge in die Tabelle ein.", "Wechsle auf im Weltraum und gehe dieselben vier Bereiche noch einmal durch. Vergleiche jeden Bereich mit dem, was du am Boden notiert hast, und halte fest, wo der Unterschied am größten ist. Trage zuletzt die Einstellung im Weltraum mit Röntgen in die Tabelle ein.", "Gegenprobe am Tisch: Halte eine Fernbedienung vor die Kamera eines Handys und drücke eine Taste. Prüfe, ob auf dem Display etwas leuchtet, das dein Auge nicht sieht."]
  },
  "t6": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sternleben", seite: 140,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Warum leuchtet ein Stern – und warum nicht ewig?",
    titel: "Wer zuerst ausgeht",
    frage: "Warum leuchtet ein massereicher Stern heller und trotzdem kürzer?",
    schritte: ["Wähle zuerst beim Regler „Masse des Sterns“ den Wert „1“ und lass den Lauf ganz durchlaufen. Halte fest, welche Farbe der Stern hat und welche Lebensdauer am Ende steht.", "Stelle den Regler „Masse des Sterns“ nacheinander auf die anderen Werte, indem du „0,5“, „10“ und „Gegenprobe 25“ wählst. Nutze jedes Mal „Lauf neu starten“ und trage Farbe und Lebensdauer in die Tabelle ein – der Masse nach geordnet: zuerst 0,5, dann 1, 10 und 25 Sonnenmassen.", "Vergleiche den masseärmsten mit dem massereichsten Stern. Der massereichste hat fünfzigmal so viel Wasserstoff im Vorrat – prüfe, ob er deshalb auch länger leuchtet."]
  },
  "t7": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "sternspektrum", seite: 144,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Woraus bestehen die Sterne?",
    titel: "Streifen, die fehlen",
    frage: "Woran erkennt man, woraus ein Stern besteht, ohne hinzufliegen?",
    schritte: ["Wähle „Glühlampe“ und sieh dir das Spektrum genau an. Halte fest, ob irgendwo eine Farbe fehlt.", "Wechsle zu „Stern 1 gelb“ und schiebe den Regler „Lupe – Wellenlänge“ langsam durch das Spektrum, bis du auf einer dunklen Linie stehst. Lies die Wellenlänge in Nanometern ab; mit „Suchlauf“ findest du eine Linie, die du nicht triffst.", "Schalte „Vergleichsstreifen einblenden“ ein und prüfe bei „Stern 2 blau-weiß“ und „Stern 3 rot“, ob dort Linien an denselben Wellenlängen sitzen. Trage in die Tabelle zuerst die drei Sterne und zuletzt die Glühlampe ein."]
  },
  "t8": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "milchstrasse", seite: 148,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Die Milchstraße – wo stehen wir?",
    titel: "Das Band über dem Feld",
    frage: "Warum sehen wir die Milchstraße als schmales Band und nicht rundherum?",
    schritte: ["Stelle den Regler „Ansicht drehen“ von „von oben (0°)“ langsam bis „von der Seite (90°)“ und halte fest, welche Form die Milchstraße von oben und welche sie von der Seite zeigt.", "Lass den Regler „Sonne vom Zentrum“ auf 26 000 Lichtjahre stehen und wähle nacheinander „zur Mitte“, „nach außen“ und „quer heraus“. Trage für jede Richtung ein, wie dicht die Sterne im Blickfeld stehen.", "Wähle „Gegenprobe: Sonne in die Mitte“ und sieh dir dieselben drei Richtungen noch einmal an. Geh danach mit „zurück auf 26 000 Lj“ auf die Ausgangslage."]
  },
  "t3": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "weltbild", seite: 152,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Wie hat sich die Vorstellung vom Weltall verändert?",
    titel: "Wer steht in der Mitte?",
    frage: "Welches Weltbild erklärt die Schleifen der Planeten mit weniger Zusatzannahmen?",
    schritte: ["Wähle „Erde in der Mitte (alt)“ und lass die Bahnen einmal ganz durchlaufen. Halte fest, welchen Weg ein Planet nimmt und was nötig ist, damit dabei eine Schleife entsteht.", "Wähle „Sonne in der Mitte (heute)“ und lass dieselbe Zeit noch einmal laufen. Achte darauf, welche Form die einzelnen Bahnen jetzt haben und wann der äußere Planet von der Erde aus rückwärts zu laufen scheint. Mit „Zurücksetzen“ kannst du beide Weltbilder mehrfach nacheinander vergleichen.", "Gegenprobe am Tisch: Legt eine Münze als Sonne auf ein Blatt Papier, geht mit zwei Fingern auf einem inneren und einem äußeren Kreis darum herum und schaut vom inneren Finger aus, wie der äußere sich beim Überholen kurz rückwärts vor der Wand zu bewegen scheint."]
  },
  "t4": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "schwarzes-loch", seite: 156,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Was passiert bei einem schwarzen Loch?",
    titel: "Ein Ring um nichts",
    frage: "Was geschieht mit einem Lichtstrahl, der dicht an einem schwarzen Loch vorbeiläuft?",
    schritte: ["Wähle in der Simulation den Abstand „weit weg“ und nutze „Lichtstrahl senden“. Verfolge den Weg des Strahls und halte fest, ob er die gerade Richtung behält.", "Setze mit „Zurücksetzen“ zurück und wiederhole den Versuch mit „mittel“ und danach mit „sehr nah“. Vergleiche die drei Bahnen miteinander und achte darauf, bei welchem Abstand der Strahl nicht mehr herauskommt.", "Gegenprobe am Tisch: Spanne ein T-Shirt über einen Reifen und lege eine schwere Kugel in die Mitte. Rolle eine Murmel einmal weit außen und einmal dicht an der Kugel vorbei."]
  },
  "t5": {
    klasse: 7, schulform: "Realschule NRW",
    sim: "urknall", seite: 161,
    kapitel: "Sterne, Galaxien und der Anfang",
    name: "Wie ist das Weltall entstanden? (Urknall)",
    titel: "Punkte auf dem Ballon",
    frage: "Entfernen sich alle Galaxien gleich schnell voneinander?",
    schritte: ["Lass mit „Urknall starten“ die Ausdehnung ablaufen. Sobald die Galaxien erscheinen, suche dir eine nahe und eine weit entfernte Galaxie aus und beobachte beide Galaxien gleichzeitig. Achte danach auf zwei Galaxien, die beide weit von uns weg liegen: Wächst auch der Abstand zwischen ihnen?", "Gehe mit „zum Anfang“ zurück und lass den Vorgang noch einmal laufen. Warte, bis nach „heute“ der Blick zu einer anderen Galaxie wechselt („Blick von Galaxie 2“), und prüfe, ob sich von ihr aus alle übrigen ebenfalls entfernen.", "Gegenprobe am Tisch: Male Punkte auf einen schlaffen Luftballon, miss die Abstände von zwei nahen und zwei weit entfernten Punktepaaren und blase den Ballon weiter auf. Miss dieselben Abstände erneut."]
  },
  "sp1": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "ladung", seite: 6,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Was ist elektrische Ladung?",
    titel: "Der Staub am Kabel",
    frage: "Warum ziehen sich manche Körper an und andere stoßen sich ab?",
    schritte: ["Gib beiden Kugeln „positiv“ und beobachte, was zwischen ihnen geschieht.", "Stelle die zweite Kugel auf „negativ“ um und halte fest, wie sich das Verhalten ändert.", "Gib zuletzt beiden Kugeln „negativ“ und vergleiche das Ergebnis mit Schritt 1."]
  },
  "sp2": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "stromstaerke", seite: 10,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Was ist der elektrische Strom (Stromstärke)?",
    titel: "Wie viel fließt da eigentlich?",
    frage: "Was gibt die Stromstärke an?",
    schritte: ["Wähle „Strom schwach“ und lies die Stromstärke am Amperemeter ab. Achte dabei auch auf die Lampe.", "Wähle nacheinander „mittel“ und „stark“ und trage beide Werte ein.", "Drücke auf „Schalter: geschlossen“, sodass der Kreis offen ist, und lies noch einmal ab."]
  },
  "sp3": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "spannung", seite: 14,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Was ist die elektrische Spannung?",
    titel: "Was die Spannung bewirkt",
    frage: "Was bewirkt eine größere Spannung im Stromkreis?",
    schritte: ["Wähle „1 Energiequelle“ und lies die Spannung ab. Achte darauf, wie hell die Lampe leuchtet.", "Wähle „2 Energiequellen“ und danach „3 Energiequellen“ und trage jedes Mal die Spannung ein.", "Ordne die drei Helligkeiten den drei Spannungen zu."]
  },
  "sp4": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "messen", seite: 18,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Wie misst man Stromstärke und Spannung?",
    titel: "Ein Messgerät, zwei Anschlüsse",
    frage: "Wie schließt man Amperemeter und Voltmeter richtig an?",
    schritte: ["Wähle „Amperemeter“ und „in Reihe“. Lies ab, was die Simulation meldet und welcher Wert angezeigt wird.", "Lass das Amperemeter stehen und stelle auf „parallel“ um. Halte fest, was gemeldet wird.", "Wähle dann „Voltmeter“ und stelle erst auf „parallel“, danach auf „in Reihe“. Halte beide Meldungen fest."]
  },
  "sp5": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "stromabhaengigkeit", seite: 22,
    kapitel: "Spannung, Strom und der erste Kreis",
    name: "Wovon hängt die Stromstärke ab?",
    titel: "Zwei Stellschrauben",
    frage: "Wovon hängt es ab, wie viel Strom durch einen Kreis fließt?",
    schritte: ["Stelle den Widerstand auf „mittel“ und wähle nacheinander 1,5 V, 3 V und 4,5 V. Lies jedes Mal die Stromstärke ab.", "Lass die Spannung auf 4,5 V stehen und wähle nacheinander „klein“, „mittel“ und „groß“.", "Vergleiche beide Messreihen miteinander: Welche Änderung bringt mehr, welche weniger Strom?"]
  },
  "wd1": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "widerstand", seite: 29,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Was ist ein elektrischer Widerstand?",
    titel: "Warum das Kabel warm wird",
    frage: "Warum fließt durch das eine Bauteil mehr Strom als durch das andere?",
    schritte: ["Wähle „kleiner Widerstand“ (dicker Kupferdraht) und lies R und die Stromstärke ab; die Spannung bleibt bei 4,5 V.", "Wähle „mittel“ (Glühdraht) und danach „großer Widerstand“ (Widerstandsdraht) und trage beide Wertepaare ein.", "Ordne die drei Stromstärken den drei Widerständen zu."]
  },
  "wd2": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "ohm-kennlinie", seite: 33,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Das Ohmsche Gesetz – die U-I-Kennlinie",
    titel: "Eine Gerade durch den Nullpunkt",
    frage: "Wie hängen Spannung und Stromstärke bei festem Widerstand zusammen?",
    schritte: ["Wähle 10 Ω. Stelle nacheinander 0 V, 1,5 V, 3 V, 4,5 V und 6 V ein und drücke jedes Mal „Messpunkt“.", "Lies zu jedem Messpunkt die Stromstärke ab und prüfe, ob U/I jedes Mal denselben Wert ergibt.", "Lösche die Messpunkte, wähle 20 Ω und nimm dieselbe Messreihe noch einmal auf. Vergleiche beide Geraden."]
  },
  "wd3": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "draht", seite: 37,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Wovon hängt der Widerstand eines Drahtes ab?",
    titel: "Lang, dünn, oder woraus?",
    frage: "Wovon hängt der Widerstand eines Drahtes ab?",
    schritte: ["Stelle Material „Kupfer“, Länge „kurz“ und Dicke „dick“ ein und lies R und I ab. Das ist dein Ausgangswert.", "Wechsle nur auf „lang“ und lies wieder ab. Setze zurück und wechsle stattdessen nur auf „dünn“.", "Setze zurück und wechsle nur das Material, erst auf Eisen, dann auf Konstantan."]
  },
  "wd4": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "reihe-widerstand", seite: 41,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Reihenschaltung von Widerständen",
    titel: "Hintereinander wird es weniger",
    frage: "Was geschieht, wenn zwei Widerstände in Reihe geschaltet sind?",
    schritte: ["Stelle R₁ = 10 Ω und R₂ = 20 Ω ein. Lies Gesamtwiderstand, Stromstärke und beide Teilspannungen ab.", "Stelle beide auf 10 Ω und danach beide auf 30 Ω. Trage jedes Mal Gesamtwiderstand, Stromstärke und beide Teilspannungen ein.", "Prüfe bei jeder Einstellung, ob die beiden Teilspannungen zusammen 6 V ergeben."]
  },
  "wd5": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "parallel-widerstand", seite: 45,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Parallelschaltung von Widerständen",
    titel: "Nebeneinander wird es mehr",
    frage: "Warum fließt bei zwei parallelen Widerständen mehr Strom?",
    schritte: ["Stelle R₁ = 10 Ω und R₂ = 20 Ω ein. Lies beide Teilströme, den Gesamtstrom und den Gesamtwiderstand ab.", "Stelle beide auf 10 Ω und danach beide auf 30 Ω und trage jedes Mal denselben Satz Werte ein.", "Vergleiche den Gesamtwiderstand mit dem kleineren der beiden Einzelwiderstände."]
  },
  "wd6": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "potentiometer", seite: 49,
    kapitel: "Widerstand und das Ohmsche Gesetz",
    name: "Das Potentiometer – ein veränderbarer Widerstand",
    titel: "Der Regler am Motor",
    frage: "Wie lässt sich die Stromstärke stufenlos verändern?",
    schritte: ["Drücke „weniger Widerstand“, bis der Regler ganz links steht. Lies R, I und die Helligkeit ab.", "Setze zurück, sodass der Regler in der Mitte steht, und lies dieselben drei Angaben ab.", "Drücke „mehr Widerstand“ bis zum rechten Anschlag und trage auch diese Werte ein."]
  },
  "lt1": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "elektrische-leistung", seite: 56,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Elektrische Leistung P = U · I",
    titel: "Wie schnell die Energie verbraucht wird",
    frage: "Was sagt die Leistung eines Gerätes aus?",
    schritte: ["Stelle „3 V“ und „mittel“ ein und lies Spannung, Stromstärke und Leistung ab.", "Wechsle nur auf „6 V“ und lies wieder ab. Vergleiche die Leistung mit dem ersten Wert.", "Stelle bei 6 V unter „Verbraucher“ erst „viel Strom“, dann „wenig Strom“ ein. Trage jedes Mal alle drei Werte ein."]
  },
  "lt2": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "elektrische-energie", seite: 60,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Elektrische Energie E = P · t",
    titel: "Watt mal Stunden",
    frage: "Wie hängen Leistung, Zeit und Energie zusammen?",
    schritte: ["Wähle „LED 10 W“ und „1 h“ und lies die Energie in Wattstunden und in Kilowattstunden ab.", "Lass das Gerät stehen und wechsle auf „3 h“ und danach „10 h“. Trage beide Werte ein.", "Wähle „Wasserkocher 2000 W“ und „1 h“ und vergleiche mit der LED bei 10 h."]
  },
  "lt3": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "stromkosten", seite: 64,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Was kostet elektrische Energie? (kWh)",
    titel: "Was eine Kilowattstunde kostet",
    frage: "Was kostet der Betrieb eines Gerätes im Jahr?",
    schritte: ["Wähle „TV 100 W“ und „3 h“ und lies Energie je Tag, Kosten je Tag und Kosten im Jahr ab.", "Wähle „Wasserkocher 2000 W“ und „1 h“ und trage dieselben drei Werte ein.", "Wähle „Kühlschrank 150 W“ und „24 h“ und vergleiche die Jahreskosten mit den beiden anderen."]
  },
  "lt4": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "energiesparen", seite: 68,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Energie sparen im Haushalt",
    titel: "Wo sich das Sparen lohnt",
    frage: "Welche Maßnahme spart im Jahr am meisten?",
    schritte: ["Wähle „Glühlampe→LED“ und lies ab, wie viel elektrische Energie in kWh vorher und nachher im Jahr umgewandelt wird.", "Wähle „Standby aus“ und danach „Kühlschrank“ und trage jedes Mal die Ersparnis in kWh und in Euro ein.", "Ordne die drei Maßnahmen nach ihrer Ersparnis."]
  },
  "lt5": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "stromgefahren", seite: 72,
    kapitel: "Leistung, Energie und was der Strom kostet",
    name: "Gefahren des elektrischen Stroms & Schutz",
    titel: "Wenn die Sicherung kommt",
    frage: "Warum schaltet eine Sicherung den Stromkreis ab?",
    schritte: ["Beginne mit einem Gerät – so startet die Simulation. Lies ab, wie groß die Stromstärke I ist (am Bildschirm: „Strom“) und wo die Grenze der Sicherung liegt.", "Schließe ein zweites Gerät an und lies wieder ab.", "Schließe ein drittes an und halte fest, was die Simulation meldet."]
  },
  "bg1": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-begriff", seite: 79,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Was bedeutet Geschwindigkeit?",
    titel: "Wer ist schneller?",
    frage: "Wann ist ein Körper schneller als ein anderer?",
    schritte: ["Stelle Auto A auf „langsam“ und Auto B auf „schnell“ und drücke „Rennen starten“. Beobachte, welche Strecke jedes Auto zurücklegt.", "Stelle beide auf „mittel“ und starte noch einmal. Halte fest, was sich ändert.", "Stelle A auf „schnell“ und B auf „mittel“ und lies ab, was die Simulation meldet."]
  },
  "bg2": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-messen", seite: 83,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie misst man eine Geschwindigkeit?",
    titel: "Zehn Meter und eine Stoppuhr",
    frage: "Wie bestimmt man eine Geschwindigkeit aus Strecke und Zeit?",
    schritte: ["Wähle „langsam“ und drücke „Messung starten“. Lies Strecke s, Zeit t und Geschwindigkeit v ab.", "Wiederhole die Messung mit „mittel“ und mit „schnell“ und trage beide Ergebnisse ein.", "Prüfe bei jeder Messung, ob Strecke geteilt durch Zeit den angezeigten Wert ergibt."]
  },
  "bg3": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-formel", seite: 87,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie berechnet man eine Geschwindigkeit? (v = s/t)",
    titel: "Strecke geteilt durch Zeit",
    frage: "Wann führen verschiedene Messungen zur selben Geschwindigkeit?",
    schritte: ["Stelle s = 100 m und t = 10 s ein. Lies die Geschwindigkeit in m/s und in km/h ab.", "Stelle s = 50 m und t = 5 s ein, danach s = 200 m und t = 20 s. Vergleiche mit dem ersten Wert.", "Halte t = 10 s fest und wechsle die Strecke zwischen 50 m, 100 m und 200 m."]
  },
  "bg4": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-umrechnung", seite: 91,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie werden m/s und km/h umgerechnet?",
    titel: "Mal 3,6 und zurück",
    frage: "Wie rechnet man zwischen m/s und km/h um?",
    schritte: ["Stelle mit „schneller“ und „langsamer“ den Wert 10 m/s ein und lies die Umrechnung in km/h ab.", "Wähle nacheinander die Beispiele Fußgänger, Radfahrer, Auto (Stadt) und ICE und trage beide Werte ein.", "Prüfe bei jedem Beispiel nach, ob der Wert in km/h das 3,6-Fache des Wertes in m/s ist."]
  },
  "bg5": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "gleichfoermig-rs", seite: 95,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Was ist eine gleichförmige Bewegung?",
    titel: "Immer gleich weit",
    frage: "Woran erkennt man eine gleichförmige Bewegung?",
    schritte: ["Wähle „langsam“ und starte die Fahrt. Beobachte, wie die Sekundenmarken gesetzt werden.", "Wiederhole das mit „mittel“ und mit „schnell“ und vergleiche die Abstände miteinander.", "Halte fest, ob sich die Abstände innerhalb einer Fahrt ändern."]
  },
  "bg6": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "beschleunigung-rs", seite: 99,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Was ist eine beschleunigte Bewegung?",
    titel: "Immer weiter, immer enger",
    frage: "Woran erkennt man eine beschleunigte Bewegung?",
    schritte: ["Wähle „Beschleunigen“ und starte. Beobachte, wie sich die Abstände der Sekundenmarken entwickeln.", "Wähle „Bremsen“ und starte erneut. Halte fest, wie sich die Abstände jetzt verhalten.", "Vergleiche beide Fahrten mit der gleichförmigen Bewegung von der vorigen Seite."]
  },
  "bg7": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "weg-zeit-diagramm", seite: 103,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie stellt man eine Bewegung im Weg-Zeit-Diagramm dar?",
    titel: "Die Linie, die steigt",
    frage: "Was verrät die Steigung im Weg-Zeit-Diagramm?",
    schritte: ["Wähle „langsam“ und drücke „Fahren“. Beobachte, wie steil die Linie ansteigt.", "Wähle „schnell“ und starte erneut. Vergleiche die Steigung mit der ersten Fahrt.", "Wähle „mit Pause“ und halte fest, was die Linie während des Stillstands macht."]
  },
  "bg8": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "v-zeit-diagramm", seite: 107,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie liest man ein Geschwindigkeit-Zeit-Diagramm?",
    titel: "Die Linie, die waagerecht bleibt",
    frage: "Was zeigt das Geschwindigkeit-Zeit-Diagramm an?",
    schritte: ["Wähle „konstant“ und drücke „Fahren“. Halte fest, wie die Linie verläuft.", "Wähle „beschleunigen“ und danach „bremsen“ und beschreibe jedes Mal den Verlauf.", "Vergleiche die drei Linien mit dem, was du im Weg-Zeit-Diagramm gesehen hast."]
  },
  "bg9": {
    klasse: 8, schulform: "Realschule NRW",
    sim: "verkehr-messung", seite: 111,
    kapitel: "Geschwindigkeit: wie schnell ist schnell?",
    name: "Wie funktioniert eine Geschwindigkeitsmessung im Straßenverkehr?",
    titel: "Der Blitzer an der Straße",
    frage: "Wann löst eine Geschwindigkeitsmessung aus?",
    schritte: ["Stelle das Auto auf 70 km/h und die erlaubte Geschwindigkeit auf 50 km/h. Lass es vorbeifahren und lies ab, was gemeldet wird.", "Lass die Geschwindigkeit des Autos auf 70 km/h und stelle die erlaubte Geschwindigkeit auf 70 km/h. Fahre erneut vorbei.", "Prüfe zuletzt 30 km/h bei erlaubten 50 km/h und 100 km/h bei erlaubten 30 km/h."]
  },
  "kr1": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraft-wirkung", seite: 6,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Woran erkennt man, dass eine Kraft wirkt?",
    titel: "Knete, Wagen und ein Ball, der abbiegt",
    frage: "Woran erkennt man, dass eine Kraft gewirkt hat?",
    schritte: ["Wähle in der Simulation „Verformen“ und drücke „Kraft wirken lassen“. Halte in der Tabelle fest, was sich an der weichen Knete ändert.", "Wähle nacheinander „Bewegen“ und „Richtung ändern“ und lasse jedes Mal die Kraft wirken. Nutze „Zurücksetzen“, bevor du die nächste Situation startest.", "Gegenprobe am Tisch: Drücke ein Stück Knete flach und schiebe danach dein Mäppchen über den Tisch. Notiere für beides, was vorher und nachher anders ist."]
  },
  "kr2": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraft-wirkungen", seite: 10,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Was kann eine Kraft alles bewirken?",
    titel: "Mias Liste auf der Treppe",
    frage: "Was kann eine Kraft alles bewirken?",
    schritte: ["Wähle in der Simulation „Schwamm ausdrücken“ und ordne die Situation der Gruppe „Verformen“, „Bewegen“ oder „Richtung“ zu. Mit „Zurücksetzen“ beginnst du die Sortierung neu.", "Sortiere danach „Einkaufswagen anschieben“, „Tennisball zurückschlagen“, „Getränkedose eindrücken“, „Fahrrad abbremsen“ und „Ball prallt an der Wand ab“. Trage in die Tabelle ein, zu welcher Gruppe Schwamm, Einkaufswagen, Fahrrad und Ball an der Wand gehören.", "Gegenprobe am Tisch: Drücke einen Schwamm zusammen, schiebe ihn über den Tisch und stoppe ihn mit der Hand. Benenne für jeden der drei Fälle die Wirkung."]
  },
  "kr3": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraftmesser", seite: 14,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Wie misst man eine Kraft?",
    titel: "Der Strich, an dem der Zeiger stehen bleibt",
    frage: "Wie lässt sich eine Kraft messen?",
    schritte: ["Drücke „Feder leeren“. Lies ab, was der Zeiger ohne Last anzeigt. Trage m = 0 g und diesen Wert in die erste Zeile ein.", "Hänge mit „Gewichtsstück anhängen (100 g)“ ein Stück nach dem anderen an, bis insgesamt 100 g, 200 g und 300 g hängen. Lies nach jedem Stück am Zeiger die Kraft F in Newton ab und trage Masse und Kraft ein.", "Nimm die Stücke mit „Gewichtsstück abnehmen“ einzeln wieder ab und prüfe, ob der Zeiger bei jeder Stufe denselben Wert zeigt wie beim Anhängen."]
  },
  "kr4": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "federgesetz", seite: 18,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Warum wird eine Feder gleichmäßig länger? (Hooke)",
    titel: "Zwei Federn, die nicht gleich nachgeben",
    frage: "Dehnen sich eine weiche und eine harte Feder bei derselben Kraft gleich weit?",
    schritte: ["Wähle „weiche Feder“. Hänge mit „+ 100 g“ nacheinander 100 g, 200 g, 300 g und 400 g an und drücke nach jedem Gewichtsstück „Messpunkt eintragen“. Trage die Werte für 100 g, 200 g und 400 g in die Tabelle ein.", "Rechne in jeder Zeile F/s aus. Lies dann in der Statuszeile die Steigung der Ausgleichsgeraden ab. Sie ist die Federkonstante D.", "Drücke „alles abnehmen“ und „Tabelle leeren“, wähle „harte Feder“ und wiederhole die vier Gewichtsstücke. Trage die Werte für 400 g in die letzte Zeile ein und rechne F/s aus. Vergleiche die neue Steigung mit der alten."]
  },
  "kr5": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "masse-gewicht", seite: 23,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Ist „schwer“ dasselbe wie „viel Masse“?",
    titel: "Ein Gewicht, zwei Anzeigen",
    frage: "Ist „schwer“ dasselbe wie „viel Masse“?",
    schritte: ["Stelle in der Simulation nacheinander die Massen 100 g, 200 g und 500 g ein. Lies jedes Mal beide Anzeigen ab und trage Masse und Gewichtskraft in die Tabelle ein.", "Stelle danach 1 kg (letzte Tabellenzeile) und 2 kg ein. Prüfe mit dem Taschenrechner, ob F = m · g mit g = 9,8 N/kg zu den angezeigten Werten passt.", "Gegenprobe am Tisch: Wiege dein Mäppchen auf der Küchenwaage und hänge es dann an den Federkraftmesser. Vergleiche die beiden Anzeigen mit deiner Tabelle."]
  },
  "kr6": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "ortsfaktor", seite: 27,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Wäre ich auf dem Mond wirklich leichter?",
    titel: "Die schwerste Kiste und der Mond",
    frage: "Wäre ich auf dem Mond wirklich leichter?",
    schritte: ["Wähle in der Simulation nacheinander „Mond“, „Erde“ und „Jupiter“. Lies jedes Mal den Ortsfaktor g, die Masse und die Gewichtskraft ab und trage die Werte in die Tabelle ein.", "Rechne für jeden Ort selbst mit F = m · g und vergleiche dein Ergebnis mit der Anzeige. Achte darauf, welche der drei Zahlen sich nie ändert.", "Stelle zum Schluss wieder „Erde“ ein und bestimme, wie oft die Gewichtskraft auf dem Mond in die Gewichtskraft auf der Erde passt."]
  },
  "kr7": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraftpfeil", seite: 31,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Hat eine Kraft auch eine Richtung?",
    titel: "Dieselbe Zahl, zwei Wirkungen",
    frage: "Ist eine Kraft schon vollständig beschrieben, wenn man ihren Betrag kennt?",
    schritte: ["Wähle die Richtung „→“ und stelle nacheinander die Beträge „2 N“, „4 N“ und „6 N“ ein. Achte darauf, wie sich die Länge des Pfeils dabei verändert.", "Bleibe bei 6 N und wähle „←“. Vergleiche Länge und Richtung des Pfeils mit dem Ergebnis bei „→“ und lies mit, wohin der Körper gezogen würde.", "Wähle nacheinander „↑“, „↓“ und „↗“ und beschreibe, wie sich der Pfeil dreht, während der eingestellte Betrag unverändert bleibt."]
  },
  "kr8": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraefte-addieren", seite: 35,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Was passiert, wenn zwei Kräfte gleichzeitig ziehen?",
    titel: "Zu zweit am Sofa",
    frage: "Was passiert, wenn zwei Kräfte gleichzeitig an einem Körper ziehen?",
    schritte: ["Stelle F1 = 2 N und F2 = 2 N ein, beide nach rechts, und lies die Gesamtkraft ab. Erhöhe dann F1 mit „+ N“ auf 4 N und notiere den neuen Wert.", "Drehe F2 mit „Richtung“ nach links und stelle F1 = 3 N und F2 = 2 N ein. Notiere Betrag und Richtung der Gesamtkraft. Drehe danach F2 wieder nach rechts und F1 nach links.", "Gegenprobe am Tisch: Zieht zu zweit mit zwei Federwaagen am selben Haken eines Holzklotzes, erst beide in dieselbe Richtung, dann in entgegengesetzte Richtungen, und vergleicht die Anzeigen."]
  },
  "kr9": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "kraefte-gleichgewicht", seite: 39,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Warum bewegt sich ein ruhender Körper nicht?",
    titel: "Die Lampe über der Kellertreppe",
    frage: "Warum bewegt sich ein ruhender Körper nicht, obwohl Kräfte an ihm ziehen?",
    schritte: ["Stelle mit „– N“ und „+ N“ die Haltekraft auf 4 N ein. Lies ab, wie groß die Gesamtkraft ist und in welche Richtung sie zeigt.", "Erhöhe die Haltekraft mit „+ N“ auf 5 N und danach auf 6 N. Trage für jede Einstellung ein, ob die Lampe in Ruhe bleibt, sinkt oder steigt. Mit „zurück in die Mitte“ startest du neu.", "Gegenprobe am Tisch: Hänge ein Massestück an eine Federwaage und halte sie ruhig. Lies die Kraft ab, mit der die Federwaage nach oben zieht, und vergleiche sie mit der Gewichtskraft."]
  },
  "kr10": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "wechselwirkung", seite: 43,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Kraft und Gegenkraft: Warum drücke ich zurück?",
    titel: "Der Stoß auf dem Eis",
    frage: "Warum drückt mich das zurück, was ich selbst wegdrücke?",
    schritte: ["Wähle „Eisläufer“ und löse mit „Abstoßen“ den Stoß aus. Lies für beide Läufer Masse und Geschwindigkeit ab und trage die Werte ein.", "Wähle nacheinander „Boot“ und „Rakete“ und starte jeweils mit „Abstoßen“. Nutze davor „Zurücksetzen“ und notiere wieder beide Massen und Geschwindigkeiten.", "Gegenprobe am Tisch: Blase einen Luftballon auf und lass ihn los. Beobachte, in welche Richtung die Luft ausströmt und in welche Richtung der Ballon fliegt."]
  },
  "kr11": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "schiefe-ebene", seite: 47,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Warum geht ein Stein über eine Rampe leichter hoch?",
    titel: "Zwei Bretter über die Treppe",
    frage: "Warum geht ein Stein über eine Rampe leichter hoch als senkrecht?",
    schritte: ["Wähle nacheinander „flach“, „mittel“ und „steil“. Lies jedes Mal die Zugkraft F ab und dazu, wie viel länger der Weg im Vergleich zur Höhe ist. Trage beides in die Tabelle ein.", "Vergleiche jede Zugkraft mit den 6 N, die zum senkrechten Heben nötig sind. Rechne für jede Rampe Zugkraft mal Weg-Faktor aus und vergleiche die drei Ergebnisse miteinander.", "Gegenprobe am Tisch: Ziehe ein Holzklötzchen mit der Federwaage einmal senkrecht 20 cm hoch und einmal über ein schräg gelegtes Brett auf dieselbe Höhe. Vergleiche beide Anzeigen."]
  },
  "kr12": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "reibung-rs", seite: 51,
    kapitel: "Kräfte – wenn etwas schiebt, zieht oder verformt",
    name: "Warum bremst mich der Boden aus? (Reibung)",
    titel: "Der Wagen bleibt zu früh stehen",
    frage: "Warum bleibt ein angestoßener Wagen von allein stehen?",
    schritte: ["Wähle „Eis“ und starte den Wagen mit „Anschieben“. Lies die Rollstrecke in cm ab (am Bildschirm: „Auslaufweg“). Wähle dann „Zurücksetzen“ und wiederhole das Ganze für „Holz“ und „Teppich“.", "Vergleiche die drei Strecken. Bestimme, um welchen Faktor die Strecke auf Eis länger ist als auf Teppich, und ordne die drei Böden nach der Größe ihrer Reibungskraft.", "Gegenprobe am Tisch: Schiebe ein Mäppchen mit möglichst gleicher Startgeschwindigkeit einmal über die blanke Tischplatte und einmal über ein aufgelegtes Handtuch. Miss beide Strecken mit dem Lineal."]
  },
  "bw1": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "bewegung-beschreiben", seite: 60,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Wie beschreibt man eine Bewegung? (Weg & Zeit)",
    titel: "Mias Liste auf dem Beifahrersitz",
    frage: "Welche Angaben braucht man, um eine Bewegung genau zu beschreiben?",
    schritte: ["Tippe auf „Start“ und nimm während der Fahrt drei Momentaufnahmen auf: kurz nach dem Start, mitten in der Fahrt und deutlich später. Trage jedes Wertepaar aus Zeit und Weg in die Tabelle ein.", "Setze mit „Zurücksetzen“ zurück und lies vor dem Start ab: t = 0,0 s und s = 0 m. Starte erneut und halte eine Momentaufnahme bei etwa t = 3,2 s fest; dort zeigt die Simulation s = 26 m.", "Gegenprobe am Tisch: Lass eine Mitschülerin gleichmäßig durch den Klassenraum gehen. Ruft alle zwei Sekunden „jetzt“ und markiert die Stelle mit einem Klebestreifen am Boden."]
  },
  "bw2": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "geschwindigkeit-rs", seite: 64,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Was bedeutet „schnell“? (v = s/t)",
    titel: "Der Lieferwagen, der vorn liegt",
    frage: "Woran erkennt man sicher, welches von zwei Fahrzeugen das schnellere ist?",
    schritte: ["Starte mit „Rennen starten“ und beobachte, welcher Wagen zuerst am Ziel ist. Notiere dazu die eingestellten Geschwindigkeiten A = 10 m/s und B = 6 m/s.", "Lies während des Rennens ab, wie weit A und B nach 3 s und nach 6 s gekommen sind, und trage die Wege ein. Teile danach jeden Weg durch die zugehörige Zeit.", "Gegenprobe am Tisch: Messt im Flur 20 m ab. Einer geht die Strecke, einer stoppt die Zeit. Rechnet v = s : t aus und vergleicht euer Ergebnis mit 6 m/s."]
  },
  "bw3": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "gleichfoermige-bewegung", seite: 68,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Was ist eine gleichförmige Bewegung?",
    titel: "Die Leitpfosten im Takt",
    frage: "Legt ein Körper bei konstanter Geschwindigkeit in gleichen Zeiten gleich lange Wege zurück?",
    schritte: ["Wähle „langsam“ und starte mit „Start“. Halte mit „Stopp“ an, lies Geschwindigkeit v, Zeit und Weg ab und prüfe, ob v · t den abgelesenen Weg ergibt.", "Setze mit „Zurücksetzen“ zurück und wiederhole das mit „mittel“ und mit „schnell“. Vergleiche die drei Geschwindigkeiten und die Abstände der Marken miteinander.", "Gegenprobe am Tisch: Zieht ein Spielzeugauto an einer Schnur mit konstanter Geschwindigkeit über den Tisch und setzt alle zwei Sekunden einen Kreidepunkt."]
  },
  "bw4": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "s-t-diagramm-deuten", seite: 72,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Wie lese ich aus einem Diagramm, was ein Körper gerade tut?",
    titel: "Mias Zettel im Handschuhfach",
    frage: "Was verrät die Steilheit einer Linie im Weg-Zeit-Diagramm?",
    schritte: ["Stelle in der Simulation „steil“ ein und starte die Anzeige mit „Bewegung zeigen“. Lies die angegebene Steigung v = Δs/Δt ab und trage sie in die Tabelle ein.", "Setze mit „Zurücksetzen“ zurück und wiederhole das mit „flach“ und mit „waagerecht“. Vergleiche jedes Mal, welchen Weg der Körper in derselben Zeit zurücklegt.", "Gegenprobe am Tisch: Lasst eine Person mit konstanter Geschwindigkeit durch den Raum gehen, stoppt die Zeit alle 2 m und tragt Weg über Zeit auf kariertes Papier auf."]
  },
  "bw5": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "beschleunigung-jg9", seite: 76,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Was passiert, wenn ein Körper immer schneller wird?",
    titel: "Zwischen zwei Leitpfosten",
    frage: "Woran erkennt man, dass ein Körper immer schneller wird?",
    schritte: ["Wähle „Gas geben (beschleunigt)“ und trage Zeit, Geschwindigkeit und Weg vor dem Start in die Tabelle ein. Starte dann mit „Start“, halte mit „Stopp“ an und trage die Werte beim Anhalten ein.", "Setze mit „Zurücksetzen“ zurück, wähle „gleichförmig“ und lies vor dem Start noch einmal ab. Starte dann und vergleiche, wie die Abstände der Marken in beiden Fällen liegen.", "Notiere für „Gas geben (beschleunigt)“ den angezeigten Wert von a und prüfe, ob a · t ungefähr deine abgelesene Geschwindigkeit ergibt."]
  },
  "bw6": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "beschleunigung-formel-jg9", seite: 80,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum wird ein Auto gleichmäßig schneller – und was heißt das in Zahlen?",
    titel: "Der Kleinwagen ist längst weg",
    frage: "Wie schnell ist ein Körper nach einer bestimmten Zeit?",
    schritte: ["Wähle „1 m/s²“ und starte mit „Start“. Halte mit „Stopp“ an, lies Zeit und Geschwindigkeit ab und rechne sie mit v = a · t selbst nach.", "Setze mit „Zurücksetzen“ zurück und wiederhole den Versuch mit „2 m/s²“ und mit „3 m/s²“. Trage für alle drei Einstellungen ein, wie viel Geschwindigkeit in einer Sekunde dazukommt.", "Gegenprobe am Tisch: Lasst einen Wagen eine schräge Schiene hinunterrollen und stoppt die Zeit für den ersten und für den zweiten Meter. Vergleicht die beiden Zeiten."]
  },
  "bw7": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "verzoegerung-jg9", seite: 85,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Was ist der Unterschied zwischen schneller werden und langsamer werden?",
    titel: "Das Schild mit der 30",
    frage: "Was unterscheidet Schnellerwerden von Langsamerwerden?",
    schritte: ["Wähle „Gas geben (+a)“, lies v und a vor dem Start ab und drücke dann „Start“. Halte mit „Stopp“ an, lies Zeit und Geschwindigkeit ab und notiere den Wert von a.", "Drücke „Zurücksetzen“, wähle „Bremsen (−a)“ und lies den Startwert von v und das Vorzeichen von a ab.", "Rechne beide Fälle nach: beim Gasgeben mit v = a · t, beim Bremsen für t = 3,2 s mit v = Startwert + a · t. Vergleiche Betrag und Vorzeichen von a."]
  },
  "bw8": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "bremsweg-jg9", seite: 89,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum braucht ein Auto zum Bremsen viel mehr Platz, als man denkt?",
    titel: "Das Reh am Straßenrand",
    frage: "Warum braucht ein Auto zum Bremsen viel mehr Platz, als man denkt?",
    schritte: ["Wähle nacheinander „30 km/h“ und „50 km/h“ und lies jeweils Reaktionsweg, Bremsweg und Anhalteweg ab. Trage jedes Mal die drei Werte in die Tabelle ein.", "Wähle „100 km/h“, also die doppelte Geschwindigkeit, und vergleiche die drei Werte mit denen bei 50 km/h.", "Drücke „Gefahr! (Start)“ und beobachte, an welcher Stelle die Reaktionsphase endet und die Bremsphase beginnt."]
  },
  "bw9": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "freier-fall-jg9", seite: 93,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum fällt ein schwerer Stein nicht schneller als ein leichter?",
    titel: "Ein Klacken auf der Raststätte",
    frage: "Fällt ein schwerer Stein schneller als ein leichter?",
    schritte: ["Wähle „1 kg“ und drücke „Loslassen“. Lies ab, nach welcher Zeit die Kugeln unten sind, wie weit sie gefallen sind und welche Geschwindigkeit v sie dann haben.", "Drücke „Zurücksetzen“, wähle nacheinander „5 kg“ und „10 kg“ und vergleiche die Fallzeiten mit deinem ersten Wert. Trage zuletzt die Werte der Vergleichskugel „leicht (0,1 kg)“ ein.", "Gegenprobe am Tisch: Lass ein Schlüsselbund und einen Radiergummi aus gleicher Höhe gleichzeitig los und höre auf den Aufschlag."]
  },
  "bw10": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "luftwiderstand-jg9", seite: 98,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum fällt eine Feder langsamer als ein Stein – liegt es wirklich am Gewicht?",
    titel: "Der Bon, der trudelt",
    frage: "Fällt eine Feder auch ohne Luft langsamer als ein Stein?",
    schritte: ["Wähle „mit Luft“ und drücke „Loslassen“. Lies ab, nach welcher Zeit der Stein unten ist und nach welcher die Feder, und trage beide Zeiten ein.", "Drücke „Zurücksetzen“, wähle „Vakuum (keine Luft)“ und lasse noch einmal los. Trage die Fallzeiten von Stein und Feder ein und vergleiche sie mit denen aus Schritt 1.", "Gegenprobe am Tisch: Lasse ein Blatt Papier und ein Buch gleichzeitig los. Lege das Blatt danach flach oben auf das Buch und wiederhole den Versuch."]
  },
  "bw11": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "traegheit-rs", seite: 103,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum bewegt sich nichts von allein schneller – wer oder was steckt dahinter?",
    titel: "Bis an die Wand",
    frage: "Warum wird ein angestoßener Körper von allein wieder langsamer?",
    schritte: ["Wähle „Tisch“ und drücke „Anstoßen“. Lies ab, nach welcher Zeit der Wagen still steht und welchen Weg er zurückgelegt hat, und trage beides ein.", "Drücke „Zurücksetzen“ und wiederhole den Anstoß mit „Eis“ und danach mit „Weltall“. Halte fest, was die Simulation für den Weltall-Fall anzeigt.", "Vergleiche die drei Zeilen: Die Startgeschwindigkeit war jedes Mal gleich (am Bildschirm: „Anstoß mit 8 m/s“). Notiere, was verändert wurde und was daraus für einen Wagen ganz ohne Reibung folgt."]
  },
  "bw12": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "traegheit-alltag", seite: 107,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum werde ich beim Anfahren in den Sitz gedrückt und beim Bremsen nach vorn geworfen?",
    titel: "Mia hält sich nicht fest",
    frage: "Warum drückt es mich beim Anfahren in den Sitz und beim Bremsen nach vorn?",
    schritte: ["Wähle nacheinander „steht“, „Anfahren“, „gleichmäßig fahren“ und „Bremsen“. Lies jeweils a und v ab und notiere, ob dein Körper dabei etwas spürt.", "Wähle „Anfahren“ und „Bremsen“ noch einmal. Vergleiche die beiden Werte für a, achte auf das Vorzeichen und darauf, wohin dein Körper gedrückt wird.", "Gegenprobe am Tisch: Lege einen Radiergummi auf ein Buch und ziehe das Buch ruckartig nach vorn. Beobachte, wohin der Radiergummi kippt."]
  },
  "bw13": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "schwerelosigkeit", seite: 112,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum fühlt man sich im freien Fall schwerelos, obwohl die Erde weiter zieht?",
    titel: "Die Waage im Aufzug",
    frage: "Warum fühlt man sich im freien Fall schwerelos, obwohl die Gewichtskraft weiter wirkt?",
    schritte: ["Wähle „steht still“ und lies ab, was die Waage anzeigt und welche Masse darunter steht.", "Wähle nacheinander „beschleunigt nach oben“, „beschleunigt nach unten“ und „Seil reißt: freier Fall“ und trage jede Anzeige in die Tabelle ein.", "Gegenprobe am Tisch: Stelle dich auf eine Personenwaage, gehe langsam in die Hocke und drücke dich wieder hoch. Beobachte, wann der Zeiger über und wann er unter deinem Ruhewert steht."]
  },
  "bw14": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "orbit", seite: 117,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Warum schweben Astronauten in der Raumstation, obwohl sie ständig „fallen“?",
    titel: "Vierhundert Kilometer über dem Wohnzimmer",
    frage: "Warum schweben Astronauten, obwohl sie ständig fallen?",
    schritte: ["Stelle die Abschussgeschwindigkeit quer nacheinander auf „5 km/s“ und auf „7,7 km/s“ ein und beschreibe, was mit der Bahn geschieht.", "Wähle danach „9 km/s“ und „11 km/s“ und trage für jede Einstellung ein, ob der Körper zurückfällt, umläuft oder entkommt.", "Gegenprobe am Tisch: Rolle eine Kugel unterschiedlich schnell über die Tischkante und miss, wie weit sie fliegt, bevor sie den Boden trifft."]
  },
  "bw15": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "rueckstoss", seite: 122,
    kapitel: "Bewegung – schneller, langsamer, immer schneller",
    name: "Wie schafft es eine Rakete, sich im Weltall abzustoßen, wo doch nichts da ist?",
    titel: "Der Stuhl rollt nach hinten",
    frage: "Wie stößt sich eine Rakete im Weltall ab, wo doch nichts da ist?",
    schritte: ["Stelle Ausgestoßene Gasmasse auf 20 kg und Geschwindigkeit des Gases auf 600 m/s ein, wähle „Gas ausstoßen“ und lies ab, wie schnell die Rakete wird.", "Wähle „Zurücksetzen“, halbiere die Ausgestoßene Gasmasse auf 10 kg und stoße erneut aus; wiederhole das anschließend mit 300 m/s bei 20 kg.", "Gegenprobe am Tisch: Setze dich auf einen Bürostuhl, halte einen schweren Ball und stoße ihn kräftig von dir weg. Beobachte, wohin sich der Stuhl bewegt."]
  },
  "en1": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "energieformen", seite: 131,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Was ist Energie – und wie misst man sie?",
    titel: "Sechs Sachen, ein einziges Maß",
    frage: "Was haben so verschiedene Energiespeicher miteinander gemeinsam?",
    schritte: ["Wähle nacheinander „gespannte Sprungfeder“, „rollender Fußball“ und „Kiste auf dem Regal“. Trage für jeden ein, welche Energieform dort steht und wie viele Joule.", "Wähle danach „volle AA-Batterie“, „Tasse heißer Tee“ und „Butterbrot“ und trage sie ebenso ein.", "Lies in der Simulation bei jedem Speicher an der Skala rechts ab, wie hoch er den 10-kg-Sack heben würde, und ordne am Ende alle sechs nach ihrer Energie."]
  },
  "en2": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "arbeit", seite: 135,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Wann wird Arbeit verrichtet? (W = F · s)",
    titel: "Schieben, tragen, heben",
    frage: "Wann wird physikalisch Arbeit verrichtet – und wann nicht?",
    schritte: ["Wähle „Schieben“, stelle F = 100 N und s = 4 m ein und drücke „Ausführen“. Achte auf die beiden Pfeile im Bild und trage die Arbeit ein.", "Wähle „Waagerecht tragen“ mit m = 20 kg und s = 4 m. Vergleiche die Richtung des roten Kraftpfeils mit der des blauen Wegpfeils und notiere, was dabei für die Arbeit herauskommt.", "Wähle „Hochheben“ mit m = 20 kg und h = 2 m. Halte fest, wie die Pfeile jetzt zueinander stehen und welche Arbeit angezeigt wird."]
  },
  "en3": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "arbeit", seite: 139,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Hubarbeit: W = m · g · h",
    titel: "Drei Stockwerke, kein Aufzug",
    frage: "Wovon hängt die Arbeit ab, die beim Heben eines Körpers verrichtet wird?",
    schritte: ["Wähle „Hochheben“ und stelle m = 20 kg bei h = 1,0 m ein. Notiere die Arbeit, verdopple dann die Höhe auf h = 2,0 m und danach auf h = 4,0 m.", "Stelle die Höhe fest auf h = 3,0 m und verändere nur die Masse: 10 kg, 20 kg, 40 kg. Trage jedes Ergebnis ein.", "Gegenprobe am Tisch: Hebe dein Mäppchen einmal auf die Tischplatte und einmal aufs Regal darüber. Beschreibe, woran du merkst, welcher Weg mehr Arbeit kostet."]
  },
  "en4": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "lageenergie", seite: 143,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Lageenergie: E = m · g · h",
    titel: "Oben auf dem Schrank",
    frage: "Wovon hängt die Energie eines angehobenen Körpers ab?",
    schritte: ["Stelle m = 5 kg und h = 3 m ein und drücke „Fallen lassen“. Notiere die angezeigte Lageenergie und die Tiefe, die der Pfahl in den Boden getrieben wird.", "Drücke „×2 Masse“ und lasse erneut fallen. Setze danach mit „zurücksetzen“ alles zurück, drücke „×2 Höhe“ und lasse wieder fallen. Trage beide Ergebnisse ein.", "Vergleiche die beiden Verdopplungen miteinander: Zählt die Masse stärker, die Höhe stärker, oder sind beide gleich wichtig?"]
  },
  "en5": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "bewegungsenergie", seite: 147,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Bewegungsenergie: E = ½ · m · v²",
    titel: "Der Ball im Flur",
    frage: "Zählen Masse und Geschwindigkeit gleich stark für die Bewegungsenergie?",
    schritte: ["Stelle m = 4 kg und v = 4 m/s ein und drücke „Rollen lassen“. Notiere die Energie und die Strecke, um die der Klotz geschoben wird.", "Drücke „×2 Masse“ und lasse erneut rollen. Setze danach mit „zurücksetzen“ zurück, drücke „×2 v“ und lasse noch einmal rollen.", "Vergleiche die beiden Schiebestrecken miteinander. Halte fest, um welchen Faktor die Energie jeweils gewachsen ist."]
  },
  "en6": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "reibungswaerme", seite: 151,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Wohin geht die Energie beim Ausrollen?",
    titel: "Warum der Ball einfach liegen bleibt",
    frage: "Wohin geht die Bewegungsenergie, wenn ein Körper von allein stehen bleibt?",
    schritte: ["Wähle „Ball rollt aus“, stelle v = 2 m/s ein und drücke „Los“. Notiere die Bewegungsenergie am Anfang und die Erwärmung, die am Ende angezeigt wird.", "Stelle am Regler „Anfangstempo v“ nacheinander 6 m/s und 8 m/s ein und drücke jedes Mal „Los“. Trage die Erwärmung ein und achte darauf, ob sie zu spüren wäre.", "Beobachte während des Rollens den Balken oben: Wie verändert sich das Verhältnis von blauem und rotem Anteil, und wie ändert sich dabei die Gesamtlänge?"]
  },
  "en7": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "energieerhaltung", seite: 155,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Der Energieerhaltungssatz",
    titel: "Der Ball springt nicht mehr so hoch",
    frage: "Verschwindet Energie beim Springen, oder wechselt sie nur die Form?",
    schritte: ["Stelle die Höhe h = 20 m und die Masse m = 2 kg ein. Beobachte im Diagramm, wie sich die Kurven für Epot (Lageenergie) und Ekin (Bewegungsenergie) abwechseln, und halte fest, wann welche am größten ist. Lies beide Werte nacheinander ganz oben, auf halber Höhe und kurz vor dem Aufprall ab und trage sie ein.", "Achte auf den Ball selbst: Notiere die Sprunghöhe nach dem ersten und nach dem zweiten Aufprall.", "Verändere die Masse auf m = 8 kg und schaue, ob sich am Verhältnis von Epot und Ekin etwas ändert oder nur an den Zahlenwerten."]
  },
  "en8": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "achterbahn", seite: 160,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Umwandlung an der Achterbahn",
    titel: "Vom Balkon aus sieht man die Kirmes",
    frage: "Warum braucht eine Achterbahn nach dem ersten Berg keinen Motor mehr?",
    schritte: ["Stelle h₀ = 30 m und h₂ = 20 m ein und drücke „Losfahren“. Halte am Starthügel, im Tal und auf dem zweiten Hügel jeweils Höhe, Geschwindigkeit und die beiden Energien fest.", "Achte dabei auf den Balken oben: Notiere, wie sich der violette und der rote Anteil verschieben und ob sich die Gesamtlänge dabei ändert.", "Stelle nun h₂ = 40 m ein, also höher als den Starthügel, und fahre erneut los. Beschreibe, was passiert und warum das gar nicht anders sein kann."]
  },
  "en9": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "reibungswaerme", seite: 165,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Warum wird beim Bremsen alles warm?",
    titel: "Heiße Felgen am Berg",
    frage: "Warum wird beim Bremsen alles warm?",
    schritte: ["Wähle „Fahrrad bremsen“, stelle v = 3 m/s ein und drücke „Los“. Notiere die Bewegungsenergie und die Erwärmung der Bremse.", "Stelle nacheinander v = 8 m/s und v = 12 m/s ein und bremse jedes Mal. Trage beide Ergebnisse in die Tabelle ein.", "Wechsle zurück zu „Ball rollt aus“ mit v = 8 m/s und vergleiche die Erwärmung mit der des Fahrrads bei gleicher Geschwindigkeit."]
  },
  "en10": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "wirkungsgrad", seite: 169,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Der Wirkungsgrad η",
    titel: "Was die alte Lampe wirklich macht",
    frage: "Welcher Anteil der zugeführten Energie wird als Nutzenergie abgegeben?",
    schritte: ["Lass die zugeführte Energie (am Bildschirm: „hineingesteckte Energie“) auf 1000 J stehen und wähle „Glühlampe“. Notiere, wie viel davon Licht wird und wie viel Wärme.", "Wähle danach „LED-Lampe“, „Benzinmotor“ und „Elektromotor“ und trage jedes Mal den Wirkungsgrad und die beiden Anteile ein.", "Stelle zuletzt die zugeführte Energie auf 2000 J und prüfe an der Glühlampe, ob sich der Wirkungsgrad dadurch ändert oder nur die Zahlenwerte."]
  },
  "en11": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "wirkungsgrad", seite: 174,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Wo die Verluste entstehen",
    titel: "Wo der fehlende Rest bleibt",
    frage: "Wohin geht der Anteil, den man Verlust nennt?",
    schritte: ["Wähle nacheinander „Glühlampe“, „LED-Lampe“, „Benzinmotor“, „Elektromotor“, „Wasserkocher“ und „Handy-Ladegerät“. Lies bei jeder den Text unter der Statuszeile und trage stichwortartig ein, wo der Verlust hingeht.", "Vergleiche „Wasserkocher“ und „Glühlampe“ miteinander: Beide geben viel Wärme ab, haben aber sehr verschiedene Wirkungsgrade. Notiere, woran das liegt.", "Ordne die sechs Maschinen der Simulation nach ihrem Wirkungsgrad und prüfe, ob ein Zusammenhang zwischen der Art des Nutzens und der Höhe von η zu erkennen ist."]
  },
  "en12": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "leistung-rs", seite: 178,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Leistung: P = W / t",
    titel: "Schnell oder langsam die Treppe hoch",
    frage: "Was ändert sich, wenn dieselbe Arbeit in kürzerer Zeit verrichtet wird?",
    schritte: ["Stelle m = 50 kg, h = 4 m und t = 10 s ein und drücke „Hochziehen“. Notiere die Arbeit und die Leistung.", "Drücke „÷2 Zeit“ (t = 5 s) und ziehe erneut hoch. Trage Arbeit und Leistung wieder ein und achte besonders darauf, welche der beiden Größen sich verändert hat.", "Stelle t = 20 s ein und danach t = 2 s. Halte für beide Fälle fest, mit welchem Vergleich aus dem Alltag die Simulation die Leistung beschreibt."]
  },
  "en13": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "leistung-rs", seite: 182,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Watt, Kilowatt und PS",
    titel: "100 PS und 2000 Watt",
    frage: "Welche Leistungen stecken hinter Watt, Kilowatt und PS?",
    schritte: ["Stelle m = 100 kg, h = 10 m und t = 1 s ein. Notiere die Leistung in Watt, in Kilowatt und in PS sowie den Alltagsvergleich, den die Simulation nennt.", "Stelle nun t so ein, dass die Leistung ungefähr 1000 W beträgt, und danach so, dass sie ungefähr 2000 W beträgt. Trage die jeweilige Zeit und den Vergleich ein.", "Suche die Einstellung mit der kleinsten möglichen Leistung. Vergleiche sie mit den 9 W der LED-Lampe von der Verpackung."]
  },
  "en14": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "energie-entwerten", seite: 186,
    kapitel: "Energie, Arbeit & Leistung",
    name: "Energieentwertung: warum sparen?",
    titel: "Die erste Stromrechnung",
    frage: "Wie viel Energie ist am Ende einer Energiekette noch nutzbar?",
    schritte: ["Wähle „Kohle → Licht“ und drücke viermal „nächster Schritt“. Trage für den Start, nach dem ersten Schritt und am Ende der Kette ein, wie viel Joule noch nutzbar sind und wie viel schon zu Wärme wurde.", "Achte dabei auf die Gesamtlänge der Balken: Notiere, ob sie sich von Schritt zu Schritt verändert.", "Wechsle zu „Benzin → Fahrt“ und gehe auch diese Kette durch. Vergleiche, nach wie vielen Schritten in beiden Fällen nichts Nutzbares mehr übrig ist."]
  },
  "kw1": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 195,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Woher der Strom kommt",
    titel: "Der Schalter und das Kraftwerk",
    frage: "Woher kommt der Strom in Deutschland?",
    schritte: ["Lies aus dem Datenblatt die beiden größten Anteile ab und trage sie mit Namen und Prozentwert in die Tabelle ein.", "Rechne die Anteile der erneuerbaren Energieträger Windkraft, Photovoltaik, Biomasse und Wasserkraft zusammen und trage die Summe ein. Vergleiche die Summe mit dem Rest.", "Beurteile mit deinem Ergebnis, ob Bens Antwort „aus der Steckdose“ als Erklärung ausreicht."]
  },
  "kw2": {
    klasse: 9, schulform: "Realschule NRW",
    sim: "generator", seite: 200,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Wie Bewegung zu Strom wird",
    titel: "Der Dynamo im Fahrradkeller",
    frage: "Wovon hängt es ab, wie groß die Spannung ist, die ein Generator erzeugt?",
    schritte: ["Stelle am Regler „Drehfrequenz f“ nacheinander eine niedrige, eine mittlere und eine hohe Drehfrequenz ein. Lies jedes Mal die Spannung ab und trage sie in die Tabelle ein.", "Halte den Magneten ganz an und lies ab, was das Messgerät nun zeigt. Vergleiche diesen Wert mit den drei Werten aus der Tabelle.", "Beurteile mit deinem Ergebnis Bens Behauptung, der Dynamo mache den Strom von selbst."]
  },
  "kw3": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 204,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Ein Prinzip, viele Brennstoffe",
    titel: "Der gleiche Dampf hinter jeder Flamme",
    frage: "Bestimmt der Brennstoff den Wirkungsgrad oder der Weg über Dampf und Turbine?",
    schritte: ["Lies für Braunkohlekraftwerk, Gas- und Dampfkraftwerk und Kernkraftwerk den Wirkungsgrad ab und trage die drei Werte in die Tabelle ein.", "Ordne alle fünf Anlagen nach dem Wirkungsgrad und rechne den Abstand zwischen dem höchsten und dem niedrigsten Wert aus.", "Beurteile mit deinem Ergebnis Bens Behauptung, ein Kernkraftwerk arbeite völlig anders als ein Kraftwerk, das Holz verbrennt."]
  },
  "kw4": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 209,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Was vom Brennstoff bleibt",
    titel: "Verbrannt ist nicht verschwunden",
    frage: "Wie viel Kohlenstoffdioxid entsteht je Kilowattstunde aus fossilen Energieträgern?",
    schritte: ["Lies die CO₂-Werte von Braunkohle und Erdgas je Kilowattstunde Strom aus dem Datenblatt ab und trage beide in die Tabelle ein.", "Rechne den Unterschied zwischen Braunkohle und Erdgas in Gramm aus und trage ihn in die Tabelle ein. Vergleiche dazu die Reichweiten der beiden Energieträger.", "Beurteile mit deinem Ergebnis Bens Behauptung, nach dem Verbrennen sei das Gas einfach weg."]
  },
  "kw5": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 214,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Strom ohne Feuer",
    titel: "Das Solardach der Turnhalle",
    frage: "Woher stammt die Energie der erneuerbaren Energiequellen?",
    schritte: ["Lies für Photovoltaik, Wasserkraft und Geothermie im Datenblatt ab, ob sie vom Wetter abhängen, und trage die Angaben in die Tabelle ein.", "Zähle im Datenblatt, wie viele der fünf Quellen deutlich vom Wetter abhängen und wie viele kaum oder gar nicht. Vergleiche beide Gruppen.", "Beurteile mit deinem Ergebnis Bens Behauptung, ohne Verbrennung könne kein Kraftwerk Strom liefern."]
  },
  "kw6": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 219,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Sonne, Wind und Wasser",
    titel: "Was am Ende eines Jahres zusammenkommt",
    frage: "Wie viel Energie liefert eine Anlage je Kilowatt Leistung im Jahr?",
    schritte: ["Lies Leistung und Jahresertrag der Solaranlage auf dem Hausdach, des Windrads an Land und des kleinen Wasserkraftwerks aus dem Datenblatt ab. Trage die drei Anlagen in dieser Reihenfolge in die Tabelle ein.", "Rechne für jede Anlage den Jahresertrag geteilt durch die Leistung aus und trage das Ergebnis in die Tabelle ein.", "Beurteile mit deinen drei Ergebnissen, ob Bens Satz stimmt, das Wasserkraftwerk sei die schwächste der drei Anlagen."]
  },
  "kw7": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 224,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Zu viel und zu wenig",
    titel: "Der Wind macht keinen Stundenplan",
    frage: "Passen Angebot und Bedarf an jedem Tag der Woche zusammen?",
    schritte: ["Lies für alle fünf Tage die Prozentwerte ab und trage den höchsten und den niedrigsten Tageswert in die Tabelle ein.", "Addiere die fünf Prozentwerte und teile durch 5. Trage den Durchschnitt ein und vergleiche ihn mit Dienstag und Freitag.", "Beurteile mit deinem Ergebnis, ob Bens Vorschlag „doppelt so viele Windräder“ die Lücke am Freitag schließt."]
  },
  "kw8": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 229,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Speicher für später",
    titel: "Sonne von mittags, Licht am Abend",
    frage: "Wie viel Energie geht beim Speichern verloren?",
    schritte: ["Lies den höchsten und den niedrigsten Wirkungsgrad aus dem Datenblatt ab und trage beide Werte in die Tabelle ein.", "Rechne die Differenz der beiden Wirkungsgrade aus und trage sie als Unterschied in die Tabelle ein. Bestimme dann, wie viel Prozent der eingespeicherten Energie im Wasserstoffspeicher verloren gehen.", "Beurteile mit deinem Ergebnis, ob Bens Satz „egal womit“ für den Strom vom Mittag bis zum Abend stimmt."]
  },
  "kw9": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 234,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Kohlenstoff wird zu Kohlendioxid",
    titel: "Die Luft merkt sich jedes Feuer",
    frage: "Wie hat sich der CO₂-Anteil der Luft seit 1750 verändert?",
    schritte: ["Lies die Werte für 1750, 1900, 1960 und 2025 aus dem Datenblatt ab und trage sie als Anfangs- und Endwert zu den Zeiträumen 1750 bis 1900, 1900 bis 1960 und 1960 bis 2025 in die Tabelle ein.", "Rechne für jeden Zeitraum den Anstieg in ppm aus. Vergleiche den Anstieg von 1960 bis 2025 mit den beiden Zeiträumen davor.", "Beurteile mit deinem Ergebnis Bens Satz, eine einzelne Wohnung ändere am Klima der ganzen Erde nichts."]
  },
  "kw10": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 239,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Der natürliche Treibhauseffekt",
    titel: "Die Decke aus Gas",
    frage: "Wie viel wärmer macht der Treibhauseffekt die Erde?",
    schritte: ["Lies die mittleren Temperaturen der Erde ohne Treibhauseffekt, der wirklichen Erde und der Venus ab und trage sie in die Tabelle ein.", "Rechne die Differenz der beiden Erdwerte aus: 15 °C − (−18 °C). Vergleiche danach Mars und Venus, beide mit einer Atmosphäre aus CO₂.", "Beurteile mit deinen Ergebnissen, ob Bens Vorschlag, den Treibhauseffekt abzuschalten, für die Erde eine gute Idee wäre."]
  },
  "kw11": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 244,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Ein Jahr macht kein Klima",
    titel: "Der Schneewinter und die lange Kurve",
    frage: "Reicht ein einzelnes Jahr aus, um etwas über das Klima zu sagen?",
    schritte: ["Lies die Mitteltemperaturen der Zeiträume 1881–1910, 1991–2020 und 2015–2024 aus dem Datenblatt ab und trage sie in die Tabelle ein.", "Rechne die Differenz zwischen 2015–2024 und 1881–1910 aus. Vergleiche danach das Einzeljahr 2010 mit dem Mittelwert von 1881–1910.", "Beurteile mit deinem Ergebnis, ob Bens Schneewinter beweist, dass es in Deutschland nicht wärmer wird."]
  },
  "kw12": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 249,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "CO₂ über den ganzen Lebensweg",
    titel: "Der Rucksack des Solarmoduls",
    frage: "Wie weit liegen die Energiequellen beim CO₂ über den ganzen Lebensweg auseinander?",
    schritte: ["Lies aus dem Datenblatt den höchsten und den niedrigsten Wert ab und trage zuerst den höchsten, dann den niedrigsten Wert mit dem Namen der Energiequelle in die Tabelle ein.", "Rechne den Unterschied der beiden Werte aus, trage ihn in die dritte Zeile ein und bestimme, wie oft der kleine Wert in den großen hineinpasst.", "Beurteile mit deinem Ergebnis, ob Bens Behauptung stimmt, der Strom vom Balkon entstehe ganz ohne CO₂."]
  },
  "kw13": {
    klasse: 9, schulform: "Realschule NRW",
    sim: null, seite: 254,
    kapitel: "Kraftwerke, Energieversorgung & Klimaschutz",
    name: "Strom aus der eigenen Stadt",
    titel: "Alle Dächer, alle Windräder",
    frage: "Kann eine Stadt ihren Strom auf den eigenen Dächern erzeugen?",
    schritte: ["Lies Dachfläche, Ertrag je Quadratmeter, Zahl der Windräder und Ertrag je Windrad aus dem Datenblatt ab.", "Rechne den Jahresertrag der Dächer und den der Windräder aus, addiere beides und vergleiche die Summe mit dem Bedarf der Stadt. Trage den Jahresertrag der Photovoltaik auf allen Dächern, den der acht Windräder und den Bedarf der Stadt in die Tabelle ein.", "Beurteile mit deinem Ergebnis, ob Bens Behauptung „mehr braucht die Stadt nicht“ zutrifft."]
  },
  "mo1": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "magnetfeld", seite: 6,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Das Magnetfeld sichtbar machen",
    titel: "Der Motor liegt in Einzelteilen da",
    frage: "An welchen Stellen eines Magneten wirkt er am stärksten?",
    schritte: ["Ziehe den Prüfkompass dicht an das linke Ende des Magneten und beobachte die Nadel.", "Führe ihn an dieselbe Stelle, aber mit größerem Abstand. Vergleiche den Ausschlag.", "Setze ihn zuletzt in die Mitte zwischen beide Enden und halte fest, was die Nadel tut."]
  },
  "mo2": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kompass", seite: 10,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Die Erde als großer Magnet",
    titel: "Warum der Kompass nicht lügt",
    frage: "Wovon hängt es ab, wohin die Kompassnadel zeigt?",
    schritte: ["Wähle die Einstellung „Erdmagnetfeld“ und stoße die Nadel an. Warte ab, wo sie zur Ruhe kommt.", "Stoße sie mehrmals aus verschiedenen Richtungen an und prüfe, ob sie immer gleich endet.", "Wähle danach die Einstellung mit der Magnetleiste daneben und stoße die Nadel erneut an."]
  },
  "mo3": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "oersted", seite: 14,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Der Versuch von Ørsted",
    titel: "Ein Draht, der sich benimmt wie ein Magnet",
    frage: "Kann elektrischer Strom eine Kompassnadel bewegen?",
    schritte: ["Schalte den Strom aus und halte fest, wohin die Nadel zeigt.", "Stelle nacheinander I = 1,0 A und 3,0 A ein, jeweils bei 1,0 cm Abstand, und lies Feld und Ausschlag ab.", "Stelle zuletzt 3,0 A ein und vergrößere nur den Abstand auf 3,0 cm."]
  },
  "mo4": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromagnet", seite: 18,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Der Elektromagnet",
    titel: "Ein Magnet mit Schalter",
    frage: "Wie baut man einen Magneten, den man an- und ausschalten kann?",
    schritte: ["Wähle „Windungszahl ändern“ und stelle N = 150 bei I = 2 A ein. Lies die Tragkraft ab.", "Stelle nacheinander N = 50, N = 100, N = 150 und N = 300 ein und übernimm jeden Messwert.", "Sieh dir die entstehende Kurve an und lies ab, welchen Verlauf sie hat."]
  },
  "mo5": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromagnet", seite: 22,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Was einen Elektromagneten stärker macht",
    titel: "Zwei Schrauben, an denen man drehen kann",
    frage: "Wovon hängt die Stärke eines Elektromagneten ab?",
    schritte: ["Wähle „Stromstärke ändern“. Die Windungszahl steht dabei fest bei N = 150.", "Stelle I = 2 A ein, lies die Tragkraft ab und übernimm den Messwert.", "Stelle danach I = 4 A ein, übernimm auch diesen Wert und trage in die dritte Zeile ein, ob sich die Tragkraft verdoppelt hat (ja oder nein)."]
  },
  "mo6": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "stromwirkungen", seite: 26,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Wirkungen des elektrischen Stroms",
    titel: "Vier Geräte an derselben Batterie",
    frage: "Welche Wirkungen kann elektrischer Strom haben?",
    schritte: ["Schließe die Glühlampe an und halte fest, welche Wirkungen angezeigt werden.", "Wechsle nacheinander zu Heizdraht, Spule und Elektromotor.", "Lies bei jedem Gerät ab, in welche Energieform die elektrische Energie umgewandelt wird."]
  },
  "mo7": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "leiterkraft", seite: 30,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Kraft auf einen stromdurchflossenen Leiter",
    titel: "Der Stab, der von selbst hochspringt",
    frage: "Warum bewegt sich ein Draht im Magnetfeld, sobald Strom fließt?",
    schritte: ["Stelle I = 0 A ein und halte fest, was mit dem Stab geschieht.", "Stelle B = 0,20 T und I = 5,0 A ein, lies Kraft und Richtung ab und verdopple danach nur die Stromstärke auf 10,0 A.", "Gehe zurück auf I = 5,0 A und verdopple stattdessen nur das Feld auf B = 0,40 T."]
  },
  "mo8": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "leiterkraft", seite: 34,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Die Richtung der Kraft vorhersagen",
    titel: "Ben baut den Motor falsch herum ein",
    frage: "Wie sagt man die Richtung der Kraft vorher, ohne sie auszuprobieren?",
    schritte: ["Stelle B = 0,20 T und I = 5,0 A ein und halte die Kraftrichtung in der Ausgangslage fest.", "Drücke „Strom umpolen“, lies die neue Richtung ab und drücke danach zusätzlich „Magnet umdrehen“.", "Setze zurück und drücke diesmal nur „Magnet umdrehen“."]
  },
  "mo9": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromotor", seite: 38,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Aus Kraft wird Drehung",
    titel: "Warum sich die Spule überhaupt dreht",
    frage: "Wie wird aus einer schiebenden Kraft eine Drehbewegung?",
    schritte: ["Sieh dem laufenden Motor eine halbe Minute lang zu und achte auf die grünen Pfeile.", "Halte fest, in welche Richtung der Strom zuerst auf der linken, dann auf der rechten Spulenseite fließt, und vergleiche die beiden Kraftpfeile.", "Lies das Drehmoment ab, das die Simulation dazu berechnet."]
  },
  "mo10": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromotor", seite: 42,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Der Kommutator",
    titel: "Das kleine Teil, ohne das nichts läuft",
    frage: "Warum bleibt der Motor nicht nach einer halben Umdrehung stehen?",
    schritte: ["Sieh dem Motor mit eingeschaltetem Kommutator zu und lies die Drehzahl (Umdrehungen je Minute) ab.", "Schalte den Kommutator aus, setze zurück und beobachte die Spule mindestens zwanzig Sekunden lang.", "Schalte den Kommutator wieder ein und vergleiche."]
  },
  "mo11": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "elektromotor", seite: 46,
    kapitel: "Magnetfeld, Kraft und Motor",
    name: "Was einen Motor kräftiger macht",
    titel: "Vier Stellschrauben am fertigen Motor",
    frage: "Was macht einen Elektromotor kräftiger und schneller?",
    schritte: ["Stelle 20 Windungen, I = 2,0 A und B = 0,20 T ein und lies das Drehmoment ab.", "Verdopple nur die Windungszahl auf 40, lies erneut ab und gehe danach wieder auf 20 zurück.", "Verdopple nun nur die Stromstärke auf 4,0 A. Stelle danach wieder 2,0 A ein und verdopple zuletzt nur das Magnetfeld auf 0,40 T."]
  },
  "ge1": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "induktion-rs", seite: 53,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Induktion – Spannung ohne Batterie",
    titel: "Das Messgerät zeigt etwas an, obwohl nichts angeschlossen ist",
    frage: "Kann ein bewegter Magnet eine Spannung erzeugen, ohne dass eine Batterie da ist?",
    schritte: ["Beobachte einen ganzen Durchgang: hineinschieben, in der Spule liegen lassen, herausziehen, außerhalb liegen lassen.", "Halte fest, was das Messgerät in jeder der vier Phasen anzeigt.", "Vergleiche besonders das Hineinschieben mit dem Herausziehen und achte auf das Vorzeichen."]
  },
  "ge2": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "induktion-rs", seite: 57,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Wovon die induzierte Spannung abhängt",
    titel: "Drei Schrauben an derselben Spule",
    frage: "Wovon hängt die Höhe der induzierten Spannung ab?",
    schritte: ["Stelle 600 Windungen, die Geschwindigkeit 50 cm/s und den mittleren Magneten ein und lies die Spannung ab.", "Verdopple nur die Geschwindigkeit auf 100 cm/s. Stelle danach wieder 50 cm/s ein und verdopple nur die Windungszahl auf 1200.", "Stelle zuletzt wieder 600 Windungen und 50 cm/s ein und wähle nur den starken Magneten."]
  },
  "ge3": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "thomson-ring", seite: 61,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Die Lenzsche Regel",
    titel: "Der Ring, der von der Spule wegspringt",
    frage: "Warum wirkt bei der Induktion immer eine bremsende Kraft?",
    schritte: ["Halte fest, was der Ring in Ruhe tut, solange kein Strom fließt.", "Schalte den Strom ein und lies ab, wie sich der Ring bewegt und wie die Felder zueinander stehen.", "Schalte danach wieder aus und vergleiche die Bewegung mit der beim Einschalten."]
  },
  "ge4": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "generator", seite: 65,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Der Generator",
    titel: "Eine Spule, die sich nicht mehr anhalten lässt",
    frage: "Wie erzeugt ein Kraftwerk ohne Unterbrechung eine Spannung?",
    schritte: ["Lasse die Spule sich drehen und beobachte den Verlauf der Spannung über eine volle Umdrehung.", "Halte die Spule in der Lage an, in der ihre Fläche senkrecht zum Feld steht, und lies die Spannung ab.", "Drehe sie um eine Vierteldrehung weiter und lies die Spannung dort erneut ab, danach noch eine Vierteldrehung weiter."]
  },
  "ge5": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "generator", seite: 69,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Wechselspannung",
    titel: "Warum die Steckdose keinen Plus- und Minuspol hat",
    frage: "Warum wechselt der Strom aus der Steckdose ständig seine Richtung?",
    schritte: ["Lies in der Tabelle der Simulation die Spannung bei 0°, 90°, 180° und 270° ab.", "Achte dabei besonders auf das Vorzeichen der Werte bei 90° und bei 270°.", "Vergleiche den Verlauf mit dem einer Batterie, die immer denselben Pol behält."]
  },
  "ge6": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 73,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Gleichstrom und Wechselstrom",
    titel: "Zwei Sorten Strom in einem einzigen Gerät",
    frage: "Wann braucht man Gleichstrom und wann Wechselstrom?",
    schritte: ["Lies im Datenblatt zuerst die Quelle jeder Stromart ab, dann, welche Geräte Gleichstrom und welche Wechselstrom brauchen.", "Halte fest, welche Stromart sich mit einem Transformator umspannen lässt.", "Suche für jede der beiden Stromarten den entscheidenden Vorteil heraus."]
  },
  "ge7": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "transformator-schluessel", seite: 78,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Der Transformator",
    titel: "Zwei Spulen, die sich nicht berühren",
    frage: "Wie ändert man eine Spannung, ohne dabei viel Energie zu verschwenden?",
    schritte: ["Wähle den Spulensatz 500 → 1000 und lies das Übersetzungsverhältnis ab.", "Vergleiche die ideal erwartete Sekundärspannung mit der tatsächlich gemessenen.", "Lies in der Leistungsbilanz die zugeführte Leistung (am Bildschirm „hineingesteckt“), die abgegebene Leistung („herausgeholt“) und den Wirkungsgrad η ab."]
  },
  "ge8": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "transformator-schluessel", seite: 82,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Die Transformatorgleichung",
    titel: "Das Verhältnis, auf das es ankommt",
    frage: "Wie hängen Windungszahl und Spannung an einem Transformator zusammen?",
    schritte: ["Wähle nacheinander die Spulensätze 1000 → 500, 1000 → 250 und 500 → 1000.", "Notiere für jeden Satz das Übersetzungsverhältnis und die gemessene Spannung.", "Prüfe an der Messwerttabelle, ob das Verhältnis der Spannungen zum Verhältnis der Windungszahlen passt."]
  },
  "ge9": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "freileitungen", seite: 86,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Verluste auf der Leitung",
    titel: "Was zwischen Kraftwerk und Lampe verlorengeht",
    frage: "Warum geht auf langen Leitungen Energie verloren?",
    schritte: ["Wähle die Niederspannungs-Fernleitung und lies ab, wie hell die Lampen leuchten.", "Lies in der Energiebilanz ab, wie viel Energie je Sekunde in der Leitung in thermische Energie umgewandelt wird.", "Wähle danach die Leitung mit kleinem spezifischem Widerstand und zuletzt die Hochspannungs-Fernleitung und vergleiche jeweils den Verlust."]
  },
  "ge10": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "freileitungen", seite: 90,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Warum Hochspannung",
    titel: "380 000 Volt über dem Acker",
    frage: "Warum transportiert man elektrische Energie mit Hochspannung?",
    schritte: ["Wähle die Hochspannungs-Fernleitung und lies ab, auf welche Spannung hochtransformiert wird.", "Lies die Stromstärke in der Fernleitung ab und vergleiche sie mit der bei den Lampen.", "Halte den Verlust je Sekunde und das Verhältnis von Verlust zu Nutzen fest und vergleiche beide mit der Niederspannungsleitung."]
  },
  "ge11": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 94,
    kapitel: "Induktion, Generator und das Stromnetz",
    name: "Vom Kraftwerk in die Steckdose",
    titel: "Vier Spannungen auf demselben Weg",
    frage: "Wie gelangt die elektrische Energie vom Kraftwerk bis zur Steckdose?",
    schritte: ["Lies im Datenblatt ab, mit welcher Spannung der Generator im Kraftwerk arbeitet.", "Verfolge die Stationen der Reihe nach – Überlandleitung, Ortsnetz, Steckdose – und halte jede Spannung fest.", "Bestimme, an welchen Stellen ein Transformator stehen muss."]
  },
  "ak1": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "atombau-isotope", seite: 103,
    kapitel: "Atomkern und Strahlung",
    name: "Der Aufbau des Atoms",
    titel: "Was hinter der Bleitür passiert",
    frage: "Woraus besteht ein Atom, und was macht es zu genau diesem Element?",
    schritte: ["Stelle 6 Protonen und 6 Neutronen ein und lies Name, Massenzahl und Schreibweise ab.", "Verändere die Protonenzahl auf 7 und danach auf 8 und halte jeden Namen fest.", "Lies ab, wie viele Elektronen in der Hülle sind und wie sie sich auf die Schalen verteilen."]
  },
  "ak2": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "atombau-isotope", seite: 107,
    kapitel: "Atomkern und Strahlung",
    name: "Isotope",
    titel: "Warum im Periodensystem 35,45 steht",
    frage: "Warum gibt es von demselben Element verschiedene Sorten?",
    schritte: ["Stelle 6 Protonen ein und ziehe nur den Neutronenregler auf 6, 7 und 8.", "Halte fest, ob sich dabei der Name des Elements ändert oder nur die Massenzahl. Notiere bei Kohlenstoff-12 und Kohlenstoff-13 den natürlichen Anteil.", "Wähle nacheinander Chlor-35 und Chlor-37 und lies beide natürlichen Anteile ab."]
  },
  "ak3": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfallsreihe", seite: 111,
    kapitel: "Atomkern und Strahlung",
    name: "Warum Kerne zerfallen",
    titel: "Der Kern, der es nicht aushält",
    frage: "Warum zerfallen manche Atomkerne von selbst und andere nie?",
    schritte: ["Starte bei Uran-238 und lies ab, wie viele Neutronen auf ein Proton kommen.", "Gehe Schritt für Schritt weiter und beobachte, wohin der Punkt in der Karte wandert. Lies bei Radium-226 wieder ab, wie viele Neutronen auf ein Proton kommen.", "Lies beim letzten Kern, Blei-206, ab, warum die Reihe dort endet, und vergleiche sein Verhältnis mit dem am Anfang."]
  },
  "ak4": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfallsreihe", seite: 115,
    kapitel: "Atomkern und Strahlung",
    name: "Woher die Strahlung kommt",
    titel: "Strahlung aus dem Kellerfußboden",
    frage: "Woher kommt eine Strahlung, die niemand sehen kann?",
    schritte: ["Gehe die Zerfallsreihe von Uran-238 an Schritt für Schritt durch.", "Halte für Uran-238, Thorium-234 und Radium-226 fest, welche Strahlung der Kern aussendet und welcher Kern zurückbleibt.", "Suche in der Reihe das Nuklid, das ein Gas ist, und lies nach, warum es besonders wichtig ist."]
  },
  "ak5": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "ionisation", seite: 119,
    kapitel: "Atomkern und Strahlung",
    name: "Ionisierende Strahlung",
    titel: "Was die Strahlung im Gewebe anrichtet",
    frage: "Was macht radioaktive Strahlung mit dem Stoff, durch den sie hindurchgeht?",
    schritte: ["Wähle Alphastrahlung und lies Energie, Reichweite und Ionenpaare je Millimeter ab.", "Wechsle zu Betastrahlung und danach zu Gammastrahlung und notiere dieselben Werte.", "Lies bei jeder Art den Wichtungsfaktor ab, mit dem im Strahlenschutz gerechnet wird."]
  },
  "ak6": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "geiger-mueller", seite: 123,
    kapitel: "Atomkern und Strahlung",
    name: "Das Geiger-Müller-Zählrohr",
    titel: "Das Gerät, das die Strahlung hörbar macht",
    frage: "Wie weist man eine Strahlung nach, die man weder sehen noch fühlen kann?",
    schritte: ["Wähle „ohne Präparat“ und lies ab, wie viele Impulse je Sekunde gezählt werden.", "Wähle nacheinander Paranussmehl, gebrannten Ziegel und Am-241 und notiere jede Rate.", "Lies ab, bei welcher Spannung das Zählrohr arbeitet und wie breit der Auslösebereich ist."]
  },
  "ak7": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "absorption-strahlung", seite: 127,
    kapitel: "Atomkern und Strahlung",
    name: "Alphastrahlung",
    titel: "Ein Blatt Papier reicht",
    frage: "Was ist Alphastrahlung, und wie weit kommt sie?",
    schritte: ["Wähle Alphastrahlung und stelle als Absorber Papier ein.", "Lies in der Faustregel-Tabelle ab, ob Papier, Aluminium und Blei die Alphastrahlung stoppen oder nur schwächen.", "Vergleiche das mit dem, was dieselben Absorber bei Beta- und Gammastrahlung bewirken."]
  },
  "ak8": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "absorption-strahlung", seite: 131,
    kapitel: "Atomkern und Strahlung",
    name: "Betastrahlung",
    titel: "Wenn Papier nicht mehr genügt",
    frage: "Warum ist Betastrahlung durchdringender als Alphastrahlung?",
    schritte: ["Stelle als Absorber Papier mit der Dicke d = 0,2 mm ein und wähle zuerst Alphastrahlung, dann Betastrahlung. Lies jeweils ab, wie viel Prozent der Strahlung durchkommen.", "Wechsle zu Aluminium, lies in der Faustregel-Tabelle ab, welche Dicke nötig ist, und stelle d auf diesen Wert.", "Vergleiche den Wert mit dem, was bei Alphastrahlung schon genügt hat."]
  },
  "ak9": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "absorption-strahlung", seite: 135,
    kapitel: "Atomkern und Strahlung",
    name: "Gammastrahlung",
    titel: "Die Bleitür, die nur die Hälfte schafft",
    frage: "Wieso hält selbst eine dicke Bleiwand Gammastrahlung nicht vollständig auf?",
    schritte: ["Wähle Gammastrahlung und Blei als Absorber. Stelle die Dicke d zuerst auf 0 mm und lies ab, wie viel Prozent der Strahlung durchkommen.", "Lies ab, wie viel Prozent der Strahlung bei 6,0 mm Blei noch durchkommen.", "Lies die Halbwertsdicke ab und überlege, was nach zwei solchen Dicken (12 mm) und nach drei (18 mm) übrig bleibt."]
  },
  "ak10": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "absorption-strahlung", seite: 139,
    kapitel: "Atomkern und Strahlung",
    name: "Abschirmung im Vergleich",
    titel: "Drei Absorber, drei Ergebnisse",
    frage: "Womit kann ich welche Strahlung aufhalten?",
    schritte: ["Stelle nacheinander Alpha-, Beta- und Gammastrahlung ein und wähle jeweils Papier mit der Dicke d = 0,2 mm als Absorber.", "Wiederhole das mit 3 mm Aluminium und danach mit 6 mm Blei.", "Trage die Ergebnisse in deine Tabelle ein und vergleiche die drei Zeilen."]
  },
  "ak11": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 143,
    kapitel: "Atomkern und Strahlung",
    name: "Die drei Strahlungsarten unterscheiden",
    titel: "Ein Präparat ohne Beschriftung",
    frage: "Wie unterscheide ich die drei Strahlungsarten voneinander?",
    schritte: ["Lies im Datenblatt ab, was Alpha-, Beta- und Gammastrahlung jeweils aufhält.", "Halte fest, welche Ladung die drei Arten tragen und wie sie sich im Magnetfeld verhalten.", "Überlege dir aus diesen Angaben eine Reihenfolge von Prüfungen für das unbekannte Präparat."]
  },
  "ak12": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfallsreihe", seite: 148,
    kapitel: "Atomkern und Strahlung",
    name: "Zerfallsgleichungen",
    titel: "Aus Uran wird am Ende Blei",
    frage: "Was wird aus einem Kern, nachdem er zerfallen ist?",
    schritte: ["Starte bei Uran-238, lies die Gleichung des ersten Zerfalls ab und halte fest, wie sich A und Z beim Alphazerfall ändern.", "Gehe zum nächsten Schritt und halte fest, wie sich A und Z beim Betazerfall ändern.", "Gehe bis ans Ende der Reihe und lies ab, wie viele Alpha- und wie viele Betazerfälle es waren."]
  },
  "ak13": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfall-halbwertszeit", seite: 152,
    kapitel: "Atomkern und Strahlung",
    name: "Halbwertszeit",
    titel: "Der Kern, dem man nicht ansieht, wann er dran ist",
    frage: "Warum kann man nie sagen, wann ein bestimmter Kern zerfällt?",
    schritte: ["Wähle Radon-220 und drücke fünfmal „eine Halbwertszeit weiter“. Notiere nach 1, 2, 3 und 5 Halbwertszeiten, wie viele Kerne noch übrig sind.", "Setze zurück und wiederhole den ganzen Durchgang ein zweites Mal.", "Vergleiche beide Reihen miteinander und mit der erwarteten Reihe 100, 50, 25, 12,5 und 6,25."]
  },
  "ak14": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfall-halbwertszeit", seite: 156,
    kapitel: "Atomkern und Strahlung",
    name: "Altersbestimmung mit C-14",
    titel: "Wie alt ist der Mann aus dem Eis",
    frage: "Wie bestimmt man das Alter von Holz, Knochen oder Leder?",
    schritte: ["Wähle Kohlenstoff-14 und lies seine Halbwertszeit ab.", "Drücke dreimal „eine Halbwertszeit weiter“ und notiere nach 1, 2 und 3 Halbwertszeiten jeweils Zeit und übrige Kerne.", "Rechne aus, wie alt eine Probe ist, bei der noch ein Viertel des C-14 vorhanden ist."]
  },
  "ke1": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 163,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Strahlung in der Medizin",
    titel: "Warum Mia die Spritze in einem Bleibehälter holt",
    frage: "Wie hilft radioaktive Strahlung in der Medizin?",
    schritte: ["Lies im Datenblatt für Technetium-99m, Fluor-18, Iod-131 und Cobalt-60 ab, welche zum Untersuchen und welche zum Behandeln dienen.", "Vergleiche die Halbwertszeiten und überlege, warum sie so unterschiedlich gewählt sind.", "Halte fest, welche Nuklide im Körper wirken und welche von außen bestrahlen."]
  },
  "ke2": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 168,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Strahlung in der Technik",
    titel: "Der Sensor über dem Fließband",
    frage: "Wo nutzt die Technik radioaktive Strahlung?",
    schritte: ["Lies im Datenblatt ab, welche Strahlungsart bei der Dickenmessung und bei der Füllstandsmessung genutzt wird.", "Halte fest, warum bei der Prüfung von Schweißnähten Gammastrahlung nötig ist.", "Ergänze die Sterilisation und vergleiche, welche Anwendungen die Durchdringung nutzen und welche die Schwächung."]
  },
  "ke3": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 173,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Strahlung im Alltag",
    titel: "Die Dosis, die jeder mitbringt",
    frage: "Welche Strahlendosis erhält ein Mensch in Deutschland im Jahr?",
    schritte: ["Lies im Datenblatt die Beiträge von Radon in Wohnräumen, kosmischer Strahlung und Medizin ab. Addiere dann alle natürlichen Anteile.", "Vergleiche die Summe mit dem zivilisatorischen Anteil und bestimme die gesamte Jahresdosis.", "Suche heraus, welcher einzelne Beitrag am größten ist, und ordne ihn ein."]
  },
  "ke4": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "strahlenschutz", seite: 177,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Die drei A des Strahlenschutzes",
    titel: "Zwei Schritte zurück sind mehr wert als eine Bleiweste",
    frage: "Womit schütze ich mich am wirksamsten vor Strahlung?",
    schritte: ["Stelle 100 cm Abstand, 0 mm Blei und 20 Minuten ein und lies die Dosisleistung ab.", "Verdopple nur den Abstand auf 200 cm und lies die Dosisleistung erneut ab.", "Gehe zurück auf 100 cm und lege stattdessen nur 7 mm Blei dazwischen."]
  },
  "ke5": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kernspaltung", seite: 181,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Kernspaltung",
    titel: "Ein Würfel Uran gegen einen ganzen Güterzug",
    frage: "Wie holt man riesige Energie aus einem winzigen Kern?",
    schritte: ["Sieh dir die drei Phasen an: anfliegendes Neutron, ²³⁶U, Spaltung.", "Wähle nacheinander „Barium + Krypton“, „Xenon + Strontium“ und „Cäsium + Rubidium“ und prüfe jedes Mal die Summen von A und Z.", "Lies den Massenunterschied und die frei werdende Energie je Spaltung ab."]
  },
  "ke6": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kettenreaktion", seite: 185,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Die Kettenreaktion steuern",
    titel: "Die eine Zahl, auf die alles ankommt",
    frage: "Wie verhindert man, dass eine Kettenreaktion außer Kontrolle gerät?",
    schritte: ["Fahre die Steuerstäbe auf 80 % ein und drücke fünfmal „nächste Generation“.", "Setze zurück, stelle 50 % ein und wiederhole den Durchgang.", "Setze erneut zurück, stelle 20 % ein und vergleiche alle drei Reihen."]
  },
  "ke7": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kettenreaktion", seite: 189,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Vom Reaktor zur Steckdose",
    titel: "Ein Dampfkraftwerk mit ungewöhnlichem Feuer",
    frage: "Wie wird aus der Kernspaltung Strom in meiner Steckdose?",
    schritte: ["Lies in der Simulation nach, welche vier Schritte vom Reaktor zur Steckdose führen, und trage sie der Reihe nach in die erste Spalte ein.", "Halte fest, an welcher Stelle die Energie tatsächlich in elektrische Energie umgewandelt wird.", "Lies ab, wie viele Spaltungen je Sekunde ein Kraftwerk für eine Leistung von 300 Megawatt braucht."]
  },
  "ke8": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 193,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Wenn ein Reaktor außer Kontrolle gerät",
    titel: "Zwei Daten, die niemand vergisst",
    frage: "Was passiert, wenn ein Reaktor außer Kontrolle gerät?",
    schritte: ["Lies im Datenblatt die drei Unfälle Three Mile Island, Tschernobyl und Fukushima mit ihren Jahreszahlen und Ursachen ab.", "Vergleiche die INES-Stufen und ordne sie der Skala von 0 bis 7 zu.", "Halte fest, welches Nuklid die Umwelt nach einem Unfall am längsten belastet."]
  },
  "ke9": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "zerfall-halbwertszeit", seite: 198,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Endlagerung",
    titel: "Ein Behälter für hunderttausend Jahre",
    frage: "Wohin mit dem Müll, der noch Tausende Jahre strahlt?",
    schritte: ["Wähle Plutonium-239 und lies seine Halbwertszeit ab.", "Drücke fünfmal „eine Halbwertszeit weiter“ und notiere nach 1, 3 und 5 Halbwertszeiten die vergangene Zeit und die übrigen Kerne in Prozent.", "Vergleiche diese Zeiten mit dem Alter der ältesten menschlichen Bauwerke."]
  },
  "ke10": {
    klasse: 10, schulform: "Realschule NRW",
    sim: "kernfusion", seite: 202,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Kernfusion",
    titel: "Das Feuer, das seit viereinhalb Milliarden Jahren brennt",
    frage: "Woher nimmt die Sonne ihre Energie?",
    schritte: ["Stelle die Temperatur auf 5 Millionen °C ein und beobachte eine halbe Minute lang, was geschieht.", "Erhöhe die Temperatur schrittweise, halte fest, ab welcher Temperatur der erste Heliumkern entsteht, und beobachte bei 10 Millionen °C eine halbe Minute lang.", "Stelle die Temperatur auf 15 Millionen °C ein, beobachte wieder eine halbe Minute lang und lies die Massenbilanz und die Energie je Kernbaustein ab."]
  },
  "ke11": {
    klasse: 10, schulform: "Realschule NRW",
    sim: null, seite: 206,
    kapitel: "Kernenergie nutzen und verantworten",
    name: "Kernenergie bewerten",
    titel: "Zwei Listen und eine eigene Entscheidung",
    frage: "Ist Kernenergie eher ein Segen oder eher eine Gefahr?",
    schritte: ["Lies im Datenblatt beide Spalten vollständig durch.", "Ordne jedes Argument einem der Bereiche Klima, Versorgung, Sicherheit, Abfall oder Kosten zu. Trage Klima, Sicherheit und Abfall in dieser Reihenfolge in die Tabelle ein.", "Suche das Argument heraus, das für dich am schwersten wiegt, und notiere warum."]
  },
  "oi1": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "licht-oberflaeche", seite: 7,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was passiert, wenn Licht auf eine Oberfläche trifft?",
    titel: "Zwei Kisten ohne Beschriftung",
    frage: "Was macht eine Oberfläche mit dem Licht, das auf sie trifft?",
    schritte: ["Wähle nacheinander die vier Oberflächen Spiegel, Fensterglas, schwarzes Papier und weißes Papier.", "Lies in der Statuszeile die drei Prozentzahlen für reflektiert, durchgelassen und absorbiert ab.", "Stelle den Einfallswinkel von 0° bis 80° ein und beobachte, ob sich die Anteile ändern."]
  },
  "oi2": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "spiegelbild", seite: 12,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo steht das Bild hinter dem Spiegel?",
    titel: "Der Handspiegel mit Holzgriff",
    frage: "Wie weit hinter dem Spiegel liegt das Bild des Gegenstands?",
    schritte: ["Stelle den Abstand g nacheinander auf 40, 80, 110 und 200 ein.", "Lies in der Statuszeile ab, wie weit das Bild hinter dem Spiegel liegt.", "Wähle bei der Frage nach dem Bildort die Antwort „Gleich weit hinter dem Spiegel wie der Gegenstand davor“ und lies die Rückmeldung."]
  },
  "oi3": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "reflexionsgesetz", seite: 16,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Nach welcher Regel wird Licht am Spiegel zurückgeworfen?",
    titel: "Der Lichtfleck an der Wand",
    frage: "Nach welcher Regel reflektiert der Spiegel einen Lichtstrahl?",
    schritte: ["Stelle den Einfallswinkel zum Lot nacheinander auf 0°, 20°, 40° und 80° ein.", "Lies nach jeder Einstellung in der Statuszeile den Reflexionswinkel ab.", "Stelle den Einfallswinkel wieder auf 40°, dann den Regler „Spiegel drehen“ auf 25°, und lies ab, um wie viel Grad der Strahl schwenkt."]
  },
  "oi4": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "brechung-eintritt", seite: 20,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum knickt der Lichtstrahl beim Eintritt ins Glas?",
    titel: "Der halbrunde Glasklotz",
    frage: "An welcher Stelle wird der Strahl gebrochen, und zu welcher Seite?",
    schritte: ["Stelle den Einfallswinkel (am Bildschirm: „Winkel in der Luft“) nacheinander auf 0°, 40° und 75° ein.", "Lies in der Statuszeile den zugehörigen Brechungswinkel ab (am Bildschirm: „im Glas“).", "Drücke „↓ genau auf das Lot“ und beobachte, ob der Strahl dann noch gebrochen wird."]
  },
  "oi5": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "brechung-austritt", seite: 24,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was passiert beim Austritt aus dem Glas?",
    titel: "Ein Glasklotz wird zum Spiegel",
    frage: "Wann tritt Licht aus dem Glas aus, und wann bleibt es darin gefangen?",
    schritte: ["Stelle den Einfallswinkel (am Bildschirm: „Winkel im Glas“) auf 0° ein und lies ab, welcher Brechungswinkel („in der Luft“) angezeigt wird.", "Stelle nacheinander 20° und 25° ein und vergleiche die beiden Brechungswinkel in der Luft.", "Stelle 55° ein und beobachte die Statuszeile, während du den Einfallswinkel weiter bis 70° vergrößerst."]
  },
  "oi6": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "totalreflexion", seite: 28,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie kommt Licht durch eine gebogene Faser?",
    titel: "Ein Bündel dünner Glasfäden",
    frage: "Warum bleibt das Licht in einer gebogenen Glasfaser gefangen?",
    schritte: ["Stelle den Einfallswinkel an der Wand nacheinander auf 20°, 40°, 60° und 85° ein und beobachte den Weg des Lichts im Glasstab.", "Beobachte bei jeder Einstellung, ob im Bild „Licht tritt aus“ steht.", "Vergleiche, wie das Licht bei 60° und bei 20° durch den Stab läuft."]
  },
  "oi7": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "sammellinse", seite: 32,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Welches Glas bündelt das Licht, welches nicht?",
    titel: "Zwei geschliffene Gläser ohne Aufschrift",
    frage: "Welches Glas bündelt paralleles Licht, und welches nicht?",
    schritte: ["Stelle das Glas auf „in der Mitte dicker“ ein und lies ab, wo sich die Strahlen treffen.", "Stelle die Brennweite nacheinander auf 45, 90 und 150 ein und vergleiche, wie weit der Brennpunkt vom Glas entfernt liegt.", "Stelle das Glas auf „in der Mitte dünner“ und die Brennweite wieder auf 90 ein und beobachte, wohin die Strahlen jetzt laufen."]
  },
  "oi8": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "bild-linse", seite: 36,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo entsteht das Bild einer Linse?",
    titel: "Das zerlegte Fernrohr auf dem Tisch",
    frage: "Wovon hängt es ab, ob das Bild vergrößert oder umgekehrt ist?",
    schritte: ["Stelle die Gegenstandsweite g auf 190 ein und lies die Statuszeile ab.", "Stelle nacheinander 124 und 100 ein und vergleiche jedes Mal Größe und Lage des Bildes.", "Stelle 25 ein und beobachte, wie das Bild jetzt steht."]
  },
  "oi9": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "lupe", seite: 40,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum vergrößert eine Lupe?",
    titel: "Das Glas mit dem Griff",
    frage: "Wann vergrößert die Lupe – und wann ist das Bild umgekehrt?",
    schritte: ["Stelle den Regler „Abstand Gegenstand–Lupe g“ auf 10 und lies in der Statuszeile die Vergrößerung ab.", "Stelle nacheinander 32 und 48 ein und halte jedes Mal die Zahl vor „-fache Vergrößerung“ fest.", "Schiebe g auf 60 – über die Brennweite f = 58 hinaus – und lies Statuszeile und Bildtext ab."]
  },
  "oi10": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "auge", seite: 44,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entsteht ein Bild im Auge?",
    titel: "Das aufklappbare Augenmodell",
    frage: "Wo entsteht das Bild im Auge – und wie bleibt es scharf?",
    schritte: ["Schiebe den Regler „Abstand des Gegenstands“ ganz nach rechts (weit), lass die Pupille auf „mittel“ und lies in der Statuszeile ab, wie die Linse beschrieben wird.", "Schiebe denselben Regler ganz nach links (nah) und vergleiche Statuszeile und Wölbung der Linse im Bild.", "Schiebe den Regler „Abstand des Gegenstands“ wieder ganz nach rechts (weit). Schiebe dann den Regler „Pupille (Helligkeit)“ erst ganz nach links (eng), dann ganz nach rechts (weit), und lies jedes Mal die Statuszeile ab."]
  },
  "oi11": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "brille", seite: 48,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie hilft eine Brille beim Scharfsehen?",
    titel: "Zwei Brillen ohne Etikett",
    frage: "Welche Linse gehört zu welchem Sehfehler?",
    schritte: ["Wähle „kurzsichtig“ und lies in der Statuszeile ab, wo das Bild liegt und welche Linse nötig ist.", "Drücke „Brille“ und vergleiche Statuszeile und Beschriftung am Bild mit dem Zustand vorher.", "Drücke „Brille“ noch einmal, damit die Brille wieder ab ist. Wähle „weitsichtig“ und lies die Meldung ab. Drücke dann wieder „Brille“ und vergleiche beide Meldungen."]
  },
  "oi12": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "lochkamera", seite: 52,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie macht eine Kamera ein Bild ohne Linse?",
    titel: "Die Pappkiste mit dem Nadelloch",
    frage: "Wie sieht das Bild aus, das ein kleines Loch auf den Schirm wirft?",
    schritte: ["Stelle bei einer Gegenstandsweite von g = 40 cm und der Lochgröße „klein“ die Bildweite b auf 29 cm und lies die Statuszeile ab.", "Stelle b nacheinander auf 39 cm und auf 51 cm und vergleiche jedes Mal die Länge der beiden Pfeile.", "Schiebe den Regler „Lochgröße“ ganz nach rechts (groß) und beobachte, wie sich Statuszeile und Pfeil auf dem Schirm ändern."]
  },
  "oi13": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "prisma", seite: 56,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Woraus besteht weißes Licht?",
    titel: "Der Glaskeil in der Schublade",
    frage: "Macht das Prisma die Farben – oder stecken sie schon im weißen Licht?",
    schritte: ["Wähle weißes Licht und lies in der Statuszeile ab, was mit dem Strahl passiert.", "Drücke nur Rot und beobachte, ob das Licht hinter dem Prisma noch zerlegt wird.", "Vergleiche das Ergebnis mit nur Blau und achte dabei auf die Beschriftung im Bild."]
  },
  "oi14": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "farbmischung-additiv", seite: 60,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entstehen die Farben auf einem Bildschirm?",
    titel: "Die Lupe auf dem Bildschirm",
    frage: "Wie entsteht Weiß, wenn dort nur rote, grüne und blaue Punkte leuchten?",
    schritte: ["Lies zuerst im Statusfeld die Ergebnisfarbe des Ausgangszustands mit ihren drei Zahlen ab.", "Drücke danach aus und anschließend Gelb und notiere jedes Mal alle drei Werte.", "Schiebe den Regler Blau von 0 auf 255 und vergleiche das Ergebnis mit dem Knopf Weiß."]
  },
  "oi15": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "spektrum-unsichtbar", seite: 64,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Welches Licht sehen wir nicht?",
    titel: "Das Thermometer mit der schwarzen Kugel",
    frage: "Kommt hinter dem letzten Rot noch etwas an, das man nicht sehen kann?",
    schritte: ["Drücke 310 nm – Sonnenbrand und lies den Bereich und die Erwärmung ab.", "Wähle nacheinander 555 nm, 700 nm und 940 nm und notiere jedes Mal beide Angaben.", "Stelle den Regler auf 1100 nm ein und vergleiche die Erwärmung mit den anderen Werten."]
  },
  "ew1": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "himmelskoerper", seite: 72,
    kapitel: "Der Blick ins Weltall",
    name: "Was leuchtet da eigentlich am Nachthimmel?",
    titel: "Ein Karton voller Sternkarten",
    frage: "Welche Himmelskörper leuchten selbst und welche werden beleuchtet?",
    schritte: ["Wähle nacheinander Sonne, Stern, Mond und Planet und lies jedes Mal die Statuszeile darunter ab.", "Drücke Sonnenlicht abdecken und wähle danach noch einmal jeden der vier Körper: Wer wird sofort dunkel, wer strahlt weiter?", "Vergleiche mit Zurücksetzen den hellen Zustand noch einmal mit dem abgedeckten."]
  },
  "ew2": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "tag-nacht", seite: 76,
    kapitel: "Der Blick ins Weltall",
    name: "Warum ist es nicht überall gleichzeitig hell?",
    titel: "Der staubige Globus neben dem Schrank",
    frage: "Wovon hängt es ab, ob es an einem Ort gerade Tag oder Nacht ist?",
    schritte: ["Drücke Pause, damit der Globus stehen bleibt und du in Ruhe ablesen kannst.", "Stelle den Regler „Erde von Hand drehen“ nacheinander auf 0°, 90°, 180° und 270° ein.", "Lies bei jeder Stellung die Statuszeile ab und notiere, wer gerade Tag hat: dein Ort oder die Gegenseite."]
  },
  "ew3": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "gravitation", seite: 80,
    kapitel: "Der Blick ins Weltall",
    name: "Warum fällt alles nach unten?",
    titel: "Zwei Glasrohre aus dem Sammlungsschrank",
    frage: "Fallen Stein und Feder gleich schnell, wenn keine Luft im Rohr ist?",
    schritte: ["Drücke Noch einmal fallen lassen und beobachte beide Rohre gleichzeitig: links ohne Luft, rechts mit Luft.", "Wähle nacheinander Mond, Erde und Jupiter und lies in der Statuszeile die Fallbeschleunigung und die Fallzeit ab.", "Vergleiche im linken Rohr die Abstände zwischen den gestrichelten Linien 1 bis 4."]
  },
  "ew4": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "gravitation-abstand", seite: 84,
    kapitel: "Der Blick ins Weltall",
    name: "Wovon hängt die Stärke der Anziehung ab?",
    titel: "Zwei Messingkugeln in der Schublade",
    frage: "Was wirkt stärker: die doppelte Masse oder der doppelte Abstand?",
    schritte: ["Lies zuerst den Ausgangswert in der Statuszeile ab: beide Massen stehen auf 1, der Abstand auf 1.", "Drücke ×2 Masse links, danach ×2 Abstand, und lies nach jedem Druck die Anziehungskraft ab.", "Drücke zurücksetzen und stelle dann beide Massenregler nacheinander auf 5."]
  },
  "ew5": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "planetenbahn", seite: 88,
    kapitel: "Der Blick ins Weltall",
    name: "Warum stürzen die Planeten nicht in die Sonne?",
    titel: "Der Bogen mit den Bahnen",
    frage: "Warum stürzt ein Planet nicht in die Sonne, obwohl sie ihn anzieht?",
    schritte: ["Drücke ganz klein und beobachte, wohin der Planet läuft.", "Drücke nacheinander mittlerer Wert, etwas darüber und Gegenprobe groß und lies jedes Mal die Bahnform in der Statuszeile ab.", "Vergleiche deine Werte mit der letzten Zeile der Anzeige: Für einen Kreis braucht er 29,8 km/s, ab 42,1 km/s entkommt er."]
  },
  "ew6": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "sonnensystem", seite: 92,
    kapitel: "Der Blick ins Weltall",
    name: "Was unterscheidet die acht Planeten voneinander?",
    titel: "Acht gleich große Kugeln",
    frage: "Was unterscheidet die inneren Planeten von den äußeren?",
    schritte: ["Drücke Steckbrief und lies für die Erde Sorte, Durchmesser, Abstand und Umlauf ab.", "Drücke Größen und danach Abstände und beobachte, was im Bild jeweils gestaucht wird; lies dazu den Hinweis unter dem Bild.", "Drücke Umlauf und dazu sehr schnell und vergleiche, wie oft die inneren und wie oft die äußeren Planeten die Sonne umrunden."]
  },
  "ew7": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "entfernungen", seite: 96,
    kapitel: "Der Blick ins Weltall",
    name: "Wie groß ist das Sonnensystem wirklich?",
    titel: "Ein Wort auf der Rückseite",
    frage: "Wie lange braucht das Licht von immer ferneren Zielen bis zur Erde?",
    schritte: ["Drücke Lichtblitz senden und beobachte, wie lange der Blitz von der Erde bis zum Mond unterwegs ist.", "Drücke weiter (Erde → Sonne) und lies in der Statuszeile die Entfernung und die Laufzeit des Lichts ab.", "Vergleiche die Laufzeiten, indem du dich mit weiter Schritt für Schritt bis zum nächsten Stern und zur Andromeda-Galaxie vorarbeitest."]
  },
  "ew8": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "teleskop", seite: 100,
    kapitel: "Der Blick ins Weltall",
    name: "Wie holt ein Fernrohr Fernes heran?",
    titel: "Zwei Linsen und ein Rohr",
    frage: "Wie verändert ein Fernrohr Größe, Lage und Helligkeit des Bildes?",
    schritte: ["Drücke bloßes Auge und beobachte, wie groß das Mondbild ist und wie herum die gelbe Marke steht.", "Drücke mit Teleskop und lies in der Statuszeile die Vergrößerung ab; achte dabei wieder auf die gelbe Marke.", "Vergleiche große Öffnung mit kleine Öffnung und beobachte dabei nur die Helligkeit des Bildes."]
  },
  "ew9": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "sternparallaxe", seite: 104,
    kapitel: "Der Blick ins Weltall",
    name: "Wie misst man die Entfernung zu einem Stern?",
    titel: "Kein Maßband bis zum Stern",
    frage: "Wie hängt der gemessene Winkel mit der Entfernung eines Sterns zusammen?",
    schritte: ["Drücke Proxima Centauri und lies in der Statuszeile den Winkel p und die Entfernung in Parsec ab.", "Vergleiche damit 61 Cygni und Wega und notiere jedes Mal beide Zahlen.", "Wähle Polarstern und drücke danach Lupe ×100, damit die winzige Verschiebung im Bild sichtbar wird."]
  },
  "ew10": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "sternleben", seite: 108,
    kapitel: "Der Blick ins Weltall",
    name: "Warum leuchtet ein Stern - und wie lange?",
    titel: "Die Randnotiz auf der Sternkarte",
    frage: "Lebt ein Stern mit großer Masse länger als einer mit kleiner Masse?",
    schritte: ["Drücke 1 und beobachte im Bild den ganzen Lebenslauf von der Gaswolke bis zum Ende.", "Wähle nacheinander 0,5 und 10 und lies jedes Mal Lebensdauer, Farbe und Ende in der Statuszeile ab.", "Drücke Gegenprobe 25 und vergleiche die Lebensdauer mit den drei Sternen davor. Trage die vier Sterne nach ihrer Masse geordnet in die Tabelle ein: 0,5, 1, 10 und 25 Sonnenmassen."]
  },
  "ew11": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "milchstrasse", seite: 112,
    kapitel: "Der Blick ins Weltall",
    name: "Wo stehen wir in der Milchstraße?",
    titel: "Das blasse Band auf der Sternkarte",
    frage: "Steht die Sonne in der Mitte der Milchstraße oder irgendwo dazwischen?",
    schritte: ["Wähle nacheinander zur Mitte, nach außen und quer heraus und lies jedes Mal die Sterne im Blickfeld ab.", "Drehe die Ansicht mit dem Regler auf von der Seite (90°) und beobachte, wie flach die Scheibe wirklich ist.", "Drücke Gegenprobe: Sonne in die Mitte und vergleiche die Anzeige mit dem Wert davor."]
  },
  "ew12": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "weltbild", seite: 116,
    kapitel: "Der Blick ins Weltall",
    name: "Wer steht in der Mitte? Zwei Weltbilder",
    titel: "Ein vergilbtes Blatt voller Kreise",
    frage: "Welches Weltbild erklärt den Himmel ohne Zusatzkreise?",
    schritte: ["Drücke „Erde in der Mitte (alt)“ und lies die Statuszeile ab.", "Drücke „Sonne in der Mitte (heute)“ und vergleiche die neue Statuszeile mit der alten.", "Beobachte unten den Streifen: Wie läuft der Mars von der Erde aus gesehen? Drücke zum Schluss „Zurücksetzen“ und lies die Statuszeile noch einmal ab."]
  },
  "ew13": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "schwarzes-loch", seite: 120,
    kapitel: "Der Blick ins Weltall",
    name: "Wie findet man etwas, das kein Licht aussendet?",
    titel: "Ein Kreis um ein leeres Feld",
    frage: "Woran erkennt man ein schwarzes Loch, wenn es selbst nicht leuchtet?",
    schritte: ["Drücke „weit weg“ und danach „Lichtstrahl senden“.", "Wähle nacheinander „mittel“ und „sehr nah“ und sende jedes Mal einen Lichtstrahl.", "Lies zu jedem Abstand die Statuszeile ab und vergleiche die drei Wege im Bild."]
  },
  "ew14": {
    klasse: 7, schulform: "Gesamtschule NRW",
    sim: "urknall", seite: 124,
    kapitel: "Der Blick ins Weltall",
    name: "Woher kommt alles? Der Urknall",
    titel: "Die Frage auf der Rückseite",
    frage: "Wie hat sich das Weltall seit dem Urknall verändert?",
    schritte: ["Drücke „zum Anfang“ und lies sofort die Zeitanzeige und die Statuszeile ab.", "Drücke „Urknall starten“ und beobachte die Abstände zwischen den Galaxien kurz nach dem Start und in der Mitte des Ablaufs.", "Vergleiche das Bild am Anfang mit dem Bild am Ende des Ablaufs."]
  },
  "st1": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "ladung", seite: 7,
    kapitel: "Stromkreise verstehen",
    name: "Warum knistert der Pullover beim Ausziehen?",
    titel: "Knistern in der kalten Werkstatt",
    frage: "Wann ziehen sich zwei geladene Kugeln an und wann stoßen sie sich ab?",
    schritte: ["Drücke bei Kugel A „positiv“ und bei Kugel B „negativ“ und lies die Statuszeile ab.", "Drücke nun bei Kugel A „negativ“, sodass beide Kugeln negativ sind, und beobachte das Bild.", "Drücke bei Kugel B „positiv“, danach „Zurücksetzen“, und vergleiche alle vier Statuszeilen."]
  },
  "st3": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "spannung", seite: 11,
    kapitel: "Stromkreise verstehen",
    name: "Was sagt die Spannung an der Batterie?",
    titel: "Die Spannung an der Energiequelle",
    frage: "Wie wirkt sich die Spannung der Quelle auf die Helligkeit der Lampe aus?",
    schritte: ["Drücke „1 Energiequelle (1,5 V)“ und lies die Spannung am Voltmeter ab.", "Drücke nacheinander „2 Energiequellen (3 V)“ und „3 Energiequellen (4,5 V)“ und beobachte die Lampe.", "Vergleiche die drei Spannungen mit der Helligkeit der Lampe."]
  },
  "st4": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "stromstaerke", seite: 15,
    kapitel: "Stromkreise verstehen",
    name: "Wie viel fließt da eigentlich?",
    titel: "Ein Schalter unterbricht den Kreis",
    frage: "Wie groß ist die Stromstärke im Kreis, und wann fließt kein Strom mehr?",
    schritte: ["Drücke „Strom schwach“ und lies die Stromstärke am Amperemeter ab.", "Drücke nacheinander „mittel“ und „stark“ und beobachte die Lampe.", "Beobachte das Amperemeter, nachdem du mit dem Schalter den Kreis geöffnet hast."]
  },
  "st5": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "messen", seite: 19,
    kapitel: "Stromkreise verstehen",
    name: "Wie schließt man ein Messgerät richtig an?",
    titel: "Zwei Messgeräte an der Werkbank",
    frage: "Wie muss ein Amperemeter, wie ein Voltmeter im Stromkreis liegen?",
    schritte: ["Drücke „Amperemeter“, dann „in Reihe“, und lies die Statuszeile und den Wert am Messgerät ab.", "Wähle „Voltmeter“, drücke „in Reihe“ und beobachte die Lampe.", "Drücke „parallel“ und vergleiche diese Anzeige mit der vorherigen."]
  },
  "st6": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "widerstand", seite: 23,
    kapitel: "Stromkreise verstehen",
    name: "Was bremst den Strom?",
    titel: "Drei Bauteile an derselben Batterie",
    frage: "Warum fließt bei gleicher Spannung durch jedes Bauteil ein anderer Strom?",
    schritte: ["Drücke „kleiner Widerstand“ und lies Widerstand und Stromstärke in der Statuszeile ab.", "Wähle danach „mittel“ und „großer Widerstand“ und notiere jedes Mal beide Werte.", "Vergleiche die drei Stromstärken bei der gleichen Spannung von 4,5 V."]
  },
  "st7": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "draht", seite: 27,
    kapitel: "Stromkreise verstehen",
    name: "Wovon hängt der Widerstand eines Drahtes ab?",
    titel: "Drahtrollen aus der Restekiste",
    frage: "Wovon hängt es ab, wie groß der Widerstand eines Drahtes ist?",
    schritte: ["Lies Widerstand und Stromstärke bei Kupfer, „kurz“ und „dick“ ab. Drücke dann „lang“ und lies ab, wie sich beide ändern.", "Drücke „dünn“ und lies den neuen Widerstand und die neue Stromstärke ab.", "Vergleiche bei diesem Draht die Materialien Kupfer, Eisen und Konstantan."]
  },
  "st8": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "ohm-kennlinie", seite: 31,
    kapitel: "Stromkreise verstehen",
    name: "Wie hängen Spannung, Stromstärke und Widerstand zusammen?",
    titel: "Eine Gerade aus Messpunkten",
    frage: "Wie ändert sich die Stromstärke, wenn die Spannung verdoppelt wird?",
    schritte: ["Drücke „Draht A“, stelle mit „weniger“ 1,5 V ein und drücke „Messpunkt“.", "Stelle nacheinander 3 V, 4,5 V und 6 V ein und drücke jedes Mal „Messpunkt“. Trage 1,5 V, 3 V und 6 V ins Heft ein.", "Rechne in jeder Zeile U geteilt durch I aus. Drücke danach „Draht B“, miss bei 6 V und rechne auch dort."]
  },
  "st9": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "reihe-widerstand", seite: 35,
    kapitel: "Stromkreise verstehen",
    name: "Was passiert, wenn alles hintereinander hängt?",
    titel: "Die Lichterkette an der Werkbank",
    frage: "Wie verändert ein zweiter Widerstand in Reihe die Stromstärke im Stromkreis?",
    schritte: ["Lies ab, welchen Gesamtwiderstand und welche Stromstärke die Statuszeile in der Grundstellung mit 10 Ω und 20 Ω anzeigt.", "Wähle für den ersten Widerstand nacheinander 20 Ω und 30 Ω, stelle danach auch den zweiten auf 30 Ω und notiere jedes Mal R_ges und I.", "Vergleiche die beiden Teilspannungen U₁ und U₂ mit den 6 V der Energiequelle."]
  },
  "st10": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "parallel-widerstand", seite: 39,
    kapitel: "Stromkreise verstehen",
    name: "Warum bleibt das Licht an, wenn eine Lampe ausfällt?",
    titel: "Eine Lampe fällt aus",
    frage: "Wie verteilen sich Spannung und Stromstärke auf zwei parallele Widerstände?",
    schritte: ["Lies ab, welche Zweigströme und welchen Gesamtstrom die Statuszeile mit R₁ = 10 Ω und R₂ = 20 Ω anzeigt.", "Wähle für R₁ nacheinander 20 Ω und 30 Ω und notiere jedes Mal I₁, I₂ und den Gesamtstrom.", "Vergleiche den angezeigten Gesamtwiderstand R_ges mit dem kleineren der beiden Einzelwiderstände."]
  },
  "st11": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "elektronen-drift", seite: 43,
    kapitel: "Stromkreise verstehen",
    name: "Was bewegt sich im Draht wirklich?",
    titel: "Sofort hell trotz drei Metern Kabel",
    frage: "Wie schnell wandern die Elektronen im Draht wirklich?",
    schritte: ["Lies ab, welche Driftgeschwindigkeit v (am Bildschirm: „Wandern“) die Simulation für die Leselampe mit I = 1,0 A und A = 1,50 mm² anzeigt.", "Drücke „Wasserkocher“ und vergleiche die neue Driftgeschwindigkeit mit dem Wert der Leselampe.", "Wähle mit dem Regler die kleinste Stromstärke 0,1 A und lies ab, wie lange ein Elektron dann für einen Meter Kabel braucht."]
  },
  "st12": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "blitz", seite: 47,
    kapitel: "Stromkreise verstehen",
    name: "Was passiert bei einem Blitz?",
    titel: "Gewitter über dem Schulhof",
    frage: "Ab wann schlägt ein Blitz durch, und warum kommt der Donner später?",
    schritte: ["Lies in der Grundstellung bei 120 kV/m ab, wie viel bis zur Schwelle fehlt, und stelle den Regler danach auf 250 kV/m.", "Drücke „knapp darunter“ (290 kV/m) und danach „knapp darüber“ (310 kV/m) und beobachte, wann die Luft leitend wird.", "Lies ab, wie lange der Donner bei 3,0 km Entfernung braucht, und vergleiche das mit der Faustregel drei Sekunden je Kilometer."]
  },
  "st13": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "elektrische-leistung", seite: 51,
    kapitel: "Stromkreise verstehen",
    name: "Wie viel Energie braucht ein Gerät?",
    titel: "Zwei Lampen an einem Netzteil",
    frage: "Wie ändert sich die Leistung, wenn Spannung oder Stromstärke größer werden?",
    schritte: ["Drücke nacheinander 1,5 V, 3 V und 6 V und lies jedes Mal Stromstärke und Leistung ab.", "Wähle bei 6 V nacheinander die Verbraucher „wenig Strom“, „mittel“ und „viel Strom“.", "Vergleiche die drei Leistungen bei 6 V miteinander."]
  },
  "st14": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "stromgefahren", seite: 55,
    kapitel: "Stromkreise verstehen",
    name: "Wo wird Strom im Haushalt gefährlich?",
    titel: "Zu viel an einer Steckdose",
    frage: "Wann unterbricht die Sicherung den Stromkreis?",
    schritte: ["Lies ab, wie groß die Stromstärke I bei einem Gerät ist und wo die Grenze der Sicherung liegt.", "Drücke „Gerät anschließen“, bis 2 und dann 3 Geräte angeschlossen sind, und beobachte nach jedem Gerät die Stromstärke.", "Vergleiche die Stromstärke mit der Grenze und beobachte, wann die Sicherung eingreift."]
  },
  "be1": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-begriff", seite: 62,
    kapitel: "Bewegungen beschreiben",
    name: "Wer ist schneller - und woran misst man das?",
    titel: "Das Wettrennen auf dem Schulhof",
    frage: "Woran erkennst du, welches der beiden Autos wirklich schneller ist?",
    schritte: ["Wähle für Auto A die Geschwindigkeit „langsam“ und für Auto B die Geschwindigkeit „schnell“.", "Drücke „Rennen starten“ und beobachte, welches Auto am Ziel weiter vorne ist.", "Stelle danach Auto A auf „mittel“ und dann auf „schnell“, zum Schluss Auto B auf „langsam“. Vergleiche jedes Mal die Meldung in der Statuszeile."]
  },
  "be2": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-messen", seite: 66,
    kapitel: "Bewegungen beschreiben",
    name: "Wie misst man eine Geschwindigkeit?",
    titel: "Zehn Meter und eine Stoppuhr",
    frage: "Welche zwei Größen musst du messen, um eine Geschwindigkeit zu bestimmen?",
    schritte: ["Wähle die Einstellung „langsam“ und drücke „Messung starten“.", "Beobachte die Stoppuhr, während der Wagen die Messstrecke von 10 m abfährt.", "Vergleiche das Ergebnis, indem du zurücksetzt, nacheinander „mittel“ und „schnell“ wählst und jeweils erneut misst."]
  },
  "be3": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-formel", seite: 70,
    kapitel: "Bewegungen beschreiben",
    name: "Wie rechnet man aus Weg und Zeit die Geschwindigkeit?",
    titel: "Der Rechenzettel an der Werkbank",
    frage: "Wie ändert sich v, wenn du die Strecke verdoppelst oder die Zeit halbierst?",
    schritte: ["Wähle die Strecke 50 m und die Zeit 10 s und lies die Statuszeile ab. Stelle dann die Strecke auf 100 m und lies erneut ab.", "Stelle die Strecke auf 200 m um und vergleiche den neuen Wert von v.", "Wähle danach die Zeit 5 s und beobachte, was mit der Geschwindigkeit passiert."]
  },
  "be4": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-umrechnung", seite: 74,
    kapitel: "Bewegungen beschreiben",
    name: "Warum steht auf dem Schild km/h und im Heft m/s?",
    titel: "Tacho und Heft widersprechen sich",
    frage: "Wie rechnest du eine Geschwindigkeit von m/s in km/h um – und wieder zurück?",
    schritte: ["Lies im Ausgangszustand beide Anzeigen ab: links den Wert in m/s, rechts den in km/h.", "Drücke „langsamer“ und beobachte, wie sich beide Zahlen zugleich ändern.", "Vergleiche die Voreinstellungen Fußgänger, Radfahrer, Auto (Stadt) und ICE miteinander."]
  },
  "be5": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "gleichfoermig-rs", seite: 78,
    kapitel: "Bewegungen beschreiben",
    name: "Was heißt gleichförmige Bewegung?",
    titel: "Kreidestriche auf dem Schulhof",
    frage: "Wie liegen die Sekunden-Marken, wenn die Geschwindigkeit gleich bleibt?",
    schritte: ["Wähle „langsam“ und drücke Fahren.", "Lies ab, welchen Wert v die Statuszeile zeigt, und beobachte die Abstände der Marken.", "Vergleiche das mit den Durchgängen für „mittel“ und „schnell“."]
  },
  "be6": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "weg-zeit-diagramm", seite: 82,
    kapitel: "Bewegungen beschreiben",
    name: "Was verrät ein Zeit-Weg-Diagramm?",
    titel: "Linien an der Werkstattwand",
    frage: "Was verrät die Steilheit der Linie im Weg-Zeit-Diagramm über die Fahrt?",
    schritte: ["Wähle „langsam“, drücke Fahren und beobachte, wie steil die Linie im s-t-Diagramm steigt.", "Wähle „schnell“, drücke erneut Fahren und vergleiche die Steilheit mit dem ersten Durchgang.", "Wähle „mit Pause“, drücke Fahren und beobachte die Linie, während der Wagen auf der Fahrbahn steht."]
  },
  "be7": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "beschleunigung-rs", seite: 86,
    kapitel: "Bewegungen beschreiben",
    name: "Was passiert beim Anfahren und Bremsen?",
    titel: "Anfahren und Bremsen am Hoftor",
    frage: "Wie ändern sich die Sekunden-Marken beim Beschleunigen und beim Bremsen?",
    schritte: ["Drücke beschleunigen, starte mit Fahren und beobachte die Abstände der Sekunden-Marken und die Geschwindigkeit im Verlauf.", "Drücke bremsen, fahre erneut und vergleiche die Marken mit dem ersten Durchgang.", "Lies ab, was die Statuszeile zu jeder der beiden Fahrten meldet."]
  },
  "be8": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "v-zeit-diagramm", seite: 90,
    kapitel: "Bewegungen beschreiben",
    name: "Was verrät ein Zeit-Geschwindigkeit-Diagramm?",
    titel: "Die Linie steigt und fällt",
    frage: "Was bedeuten steigende, waagerechte und fallende Linien im v-t-Diagramm?",
    schritte: ["Wähle konstant und drücke Fahren. Beobachte die Linie und die Anzeige v jetzt.", "Wähle beschleunigen, drücke Fahren und lies ab, wie sich v jetzt dabei verändert.", "Vergleiche damit den Verlauf bei bremsen und lies dazu die Statuszeile ab."]
  },
  "be9": {
    klasse: 8, schulform: "Gesamtschule NRW",
    sim: "bremsweg-jg9", seite: 94,
    kapitel: "Bewegungen beschreiben",
    name: "Wie weit fährt ein Auto, bis es steht?",
    titel: "Ein Schild für die Einfahrt",
    frage: "Wie verändert sich der Bremsweg, wenn sich die Geschwindigkeit verdoppelt?",
    schritte: ["Wähle 30 km/h und drücke Gefahr! (Start). Lies Reaktionsweg, Bremsweg und Anhalteweg in der Statuszeile ab.", "Drücke danach 50 km/h und anschließend 100 km/h und lies die drei Wege jedes Mal neu ab.", "Vergleiche die Bremswege bei 50 km/h und bei 100 km/h miteinander."]
  },
  "kf1": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraft-wirkung", seite: 7,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Woran erkennt man, dass eine Kraft wirkt?",
    titel: "Der unsichtbare Schubs",
    frage: "Woran erkennst du, dass eine Kraft gewirkt hat?",
    schritte: ["Wähle „Verformen“ und drücke auf „Kraft wirken lassen“. Beobachte die Knete.", "Drücke „Bewegen“, dann „Kraft wirken lassen“, und lies die Statuszeile ab.", "Vergleiche damit „Richtung ändern“: Was meldet die Statuszeile über den rollenden Ball?"]
  },
  "kf2": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraftmesser", seite: 11,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Wie misst man eine Kraft?",
    titel: "Was der Zeiger verrät",
    frage: "Wie kannst du eine Kraft messen, obwohl du sie nicht sehen kannst?",
    schritte: ["Sieh die Feder ohne Last an und lies den Zeigerwert in der Statuszeile ab.", "Hänge ein Gewichtsstück von 100 g an. Lies ab, wie viel Newton der Zeiger zeigt.", "Hänge nacheinander zwei weitere Stücke an (insgesamt 200 g, dann 300 g) und lies jedes Mal wieder am Zeiger ab."]
  },
  "kf3": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "federgesetz", seite: 15,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum geben zwei Federn nicht gleich nach?",
    titel: "Weicher Puffer, harter Puffer",
    frage: "Warum dehnt sich die harte Feder bei gleicher Kraft weniger als die weiche?",
    schritte: ["Wähle „weiche Feder“, hänge „+ 100 g“ an und drücke „Messpunkt eintragen“.", "Hänge Schritt für Schritt bis 500 g an und drücke nach jedem Gewichtsstück wieder „Messpunkt eintragen“. Trage 100 g, 300 g und 500 g ins Heft ein.", "Rechne in jeder Zeile F geteilt durch s aus. Wähle danach „harte Feder“, miss bei 300 g und rechne auch dort."]
  },
  "kf4": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "masse-gewicht", seite: 19,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Was ist der Unterschied zwischen Masse und Gewichtskraft?",
    titel: "Kilogramm oder Newton",
    frage: "Worin unterscheidet sich die Masse eines Körpers von seiner Gewichtskraft?",
    schritte: ["Drücke „500 g“ und lies die Masse und die Gewichtskraft ab.", "Wiederhole das mit „1 kg“ und „2 kg“; notiere die Masse in Kilogramm.", "Rechne in jeder Zeile F geteilt durch m aus. Vergleiche die Zahlen."]
  },
  "kf5": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "ortsfaktor", seite: 23,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Wäre dasselbe Klavier auf dem Mond leichter?",
    titel: "Das Klavier auf dem Mond",
    frage: "Was ändert sich auf dem Mond: die Masse oder die Gewichtskraft?",
    schritte: ["Wähle nacheinander Mond, Erde und Jupiter aus.", "Lies bei jedem Himmelskörper den Ortsfaktor g und die Gewichtskraft F in der Statuszeile ab.", "Vergleiche, welcher Wert sich ändert und welcher bei 60 kg gleich bleibt."]
  },
  "kf6": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraftpfeil", seite: 27,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Wie zeichnet man eine Kraft auf?",
    titel: "Ein Pfeil für jede Kraft",
    frage: "Was zeigt ein Kraftpfeil neben dem Betrag noch an?",
    schritte: ["Wähle die Richtung → und dann nacheinander 2 N, 4 N und 6 N. Beobachte die Länge des Pfeils.", "Stelle bei 6 N nacheinander die Richtungen →, ↑ und ↗ ein.", "Vergleiche, was sich beim Wechsel des Betrags und was sich beim Wechsel der Richtung ändert."]
  },
  "kf7": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraefte-addieren", seite: 31,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Was passiert, wenn zwei Menschen ziehen?",
    titel: "Zwei ziehen am selben Seil",
    frage: "Wie groß ist die Gesamtkraft, wenn zwei Kräfte an einem Körper ziehen?",
    schritte: ["F2 bleibt bei 2 N nach rechts. Drücke bei Kraft 1 zweimal „– N“ (F1 = 1 N nach rechts) und lies die Gesamtkraft ab.", "Drücke einmal „+ N“ (F1 = 2 N) und lies ab, dann zweimal „+ N“ und lies erneut ab. F1 steht bei 4 N.", "Drücke bei Kraft 1 „Richtung“ (F1 = 4 N nach links) und lies ab. Rechne dann in jeder Zeile F1 + F2 aus."]
  },
  "kf8": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "kraefte-gleichgewicht", seite: 35,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Wann bewegt sich trotz Kraft nichts?",
    titel: "Der Scheinwerfer hängt still",
    frage: "Wirken an einem Körper, der in Ruhe bleibt, wirklich keine Kräfte?",
    schritte: ["Lies im Ausgangszustand ab, wie groß Haltekraft, Gewichtskraft und Gesamtkraft sind.", "Drücke einmal auf „– N“ (Haltekraft 4 N) und beobachte, was mit der Lampe geschieht.", "Drücke auf „zurück in die Mitte“ (Haltekraft wieder 5 N) und vergleiche die beiden Fälle."]
  },
  "kf9": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "traegheit-rs", seite: 39,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum rutscht die Kiste weiter, obwohl niemand schiebt?",
    titel: "Die Kiste rutscht weiter",
    frage: "Warum bleibt ein angestoßener Wagen stehen – und was passiert ohne Reibung?",
    schritte: ["Wähle den Untergrund „Tisch“ und drücke „Anstoßen“; beobachte, wie die Geschwindigkeit v abnimmt.", "Drücke „Zurücksetzen“, wähle „Eis“ und stoße den Wagen erneut an.", "Wähle „Weltall“, stoße erneut an und vergleiche die Anzeige der Geschwindigkeit v mit den anderen Untergründen."]
  },
  "kf10": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "wechselwirkung", seite: 43,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum rollt das Rollbrett zurück?",
    titel: "Rückwärts auf dem Rollbrett",
    frage: "Warum rollt man selbst zurück, wenn man einen Körper mit großer Masse wegdrückt?",
    schritte: ["Wähle „Eisläufer“ und drücke „Abstoßen“; lies beide Geschwindigkeiten in der Statuszeile ab.", "Wähle „Boot“ und vergleiche die Geschwindigkeit der Person mit der des Bootes.", "Vergleiche bei „Rakete“ die Massen von Rakete und Gas mit ihren Geschwindigkeiten."]
  },
  "kf11": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "druck-flaeche", seite: 47,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum sinkt das Podest unter dem schmalen Fuß ein?",
    titel: "Vier Dellen im neuen Podest",
    frage: "Warum sinkt ein schmaler Fuß in das Podest ein und ein breiter nicht?",
    schritte: ["Stelle 60 kg ein, schiebe die Auflagefläche auf 150 cm² und lies A in m² und p ab.", "Wiederhole das bei 200 cm² und 400 cm²; drücke zuletzt „Skier“ (2800 cm²).", "Rechne in jeder Zeile p mal A aus und vergleiche die vier Zahlen mit der Kraft F."]
  },
  "kf12": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "schweredruck", seite: 51,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum drückt Wasser in der Tiefe stärker?",
    titel: "Der untere Hahn spritzt weiter",
    frage: "Warum drückt Wasser weiter unten stärker als knapp unter der Oberfläche?",
    schritte: ["Wähle Öl und stelle die Tiefe mit dem Regler auf 20 m. Die Flüssigkeit bleibt in allen Zeilen dieselbe.", "Lies den Schweredruck p ab, dann ebenso bei 30 m, bei 40 m und bei 50 m.", "Rechne in jeder Zeile p geteilt durch h aus und vergleiche die vier Werte."]
  },
  "kf13": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "dichte", seite: 55,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum haben gleich große Körper ganz verschiedene Massen?",
    titel: "Zwei gleich große Klötze in der Werkstatt",
    frage: "Warum haben gleich große Würfel aus verschiedenen Stoffen verschiedene Massen?",
    schritte: ["Wähle Styropor und stelle die Kantenlänge a nacheinander auf 3 cm, 5 cm, 10 cm und 20 cm.", "Lies jedes Mal im Feld Nachgerechnet das Volumen V in m³ und die Masse m in kg ab.", "Rechne in jeder Zeile m geteilt durch V aus und vergleiche die vier Zahlen."]
  },
  "kf14": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "auftrieb", seite: 59,
    kapitel: "Kräfte, Druck und Auftrieb",
    name: "Warum schwimmt ein Schiff aus Eisen?",
    titel: "Ein Traversenrohr in der Regentonne",
    frage: "Warum sinkt massives Eisen, ein hohler Eisenwürfel aber nicht?",
    schritte: ["Drücke „massiv – sinkt“ und lies die Gewichtskraft G und die Auftriebskraft FA ab.", "Stelle den Hohlraum am Regler von 0 % über 87 % auf 88 % und beobachte, wann der Würfel schwimmt.", "Vergleiche bei 90 % Hohlraum, wie tief der Würfel in Süßwasser und in Meerwasser eintaucht."]
  },
  "el1": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "arbeit", seite: 67,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wann wird in der Physik Arbeit verrichtet?",
    titel: "Vier Meter über den Hof",
    frage: "Wann wird beim Bewegen einer Kiste wirklich Arbeit verrichtet?",
    schritte: ["Wähle „Schieben“, stelle F = 100 N und s = 4 m ein, drücke „Ausführen“ und lies die Arbeit in der Statuszeile ab.", "Wähle „Waagerecht tragen“, stelle m = 20 kg und s = 4 m ein und vergleiche den angezeigten Wert mit dem Wert von vorhin.", "Wähle „Hochheben“, stelle m = 20 kg und h = 2,0 m ein, drücke „Ausführen“ und notiere die Hubarbeit."]
  },
  "el2": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "lageenergie", seite: 71,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wo steckt die Energie, wenn etwas oben liegt?",
    titel: "Der Klotz über dem Pfahl",
    frage: "Wovon hängt die Energie ab, die ein Körper oben gespeichert hat?",
    schritte: ["Stelle 9 kg und 1 m ein, drücke „Fallen lassen“ und lies die Pfahltiefe ab.", "Wiederhole das bei 2 m und bei 3 m; drücke danach „×2 Masse“ (18 kg, 3 m) und lass noch einmal fallen.", "Rechne in jeder Zeile die Tiefe geteilt durch die Höhe aus und vergleiche."]
  },
  "el3": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "bewegungsenergie", seite: 75,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wo steckt die Energie, wenn etwas rollt?",
    titel: "Die Kabeltrommel auf der Rampe",
    frage: "Wovon hängt es ab, wie viel Energie in einer rollenden Kugel steckt?",
    schritte: ["Stelle die Masse 6 kg und die Geschwindigkeit 3 m/s ein und drücke „Messpunkt übernehmen“.", "Wiederhole das bei 6 m/s, bei 9 m/s und bei 12 m/s; die Masse bleibt dabei 6 kg.", "Trage E aus der Tabelle ein, rechne E geteilt durch v² aus und vergleiche die Werte."]
  },
  "el4": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "energieerhaltung", seite: 79,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Bleibt die Energie beim Umwandeln erhalten?",
    titel: "Der Ball vom Bühnenrand",
    frage: "Wo bleibt die Lageenergie, während der Ball nach unten fällt?",
    schritte: ["Stelle die Höhe auf 20 m und die Masse auf 2 kg ein und lies E_pot und E_kin ab.", "Beobachte während des Falls die Balken „Potentielle Energie“ und „Kinetische Energie“ und die Kurven über t [s].", "Stelle die Höhe auf 5 m und vergleiche E_pot und E_kin bei der Anzeige „Höhe = 4,9 m“."]
  },
  "el5": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "energie-entwerten", seite: 83,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum wird alles am Ende warm?",
    titel: "Der heiße Scheinwerfer am Abend",
    frage: "Warum wird Energie unbrauchbar, obwohl ihre Menge gleich bleibt?",
    schritte: ["Wähle „Kohle → Licht“ und drücke einmal „nächster Schritt“.", "Trage nutzbar und Wärme ein, drücke erneut „nächster Schritt“ und fülle so der Reihe nach die Zeilen Kraftwerk, Leitung, Lampe und Wände.", "Rechne in der letzten Spalte nutzbar + Wärme aus und vergleiche die vier Werte."]
  },
  "el6": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "leistung-rs", seite: 87,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was unterscheidet Arbeit von Leistung?",
    titel: "Zwei Kisten, zwei Tempos",
    frage: "Was ändert sich, wenn dieselbe Last in der halben Zeit oben ankommt?",
    schritte: ["Stelle die Masse auf 50 kg und die Höhe auf 4 m ein. Beide bleiben so.", "Stelle die Zeit auf 3 s, drücke „Hochziehen“ und lies die Leistung P ab.", "Wiederhole das mit 6 s, 9 s und 18 s. Rechne in jeder Zeile P mal t aus."]
  },
  "el7": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "wirkungsgrad", seite: 91,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wie viel von der Energie kommt an?",
    titel: "Glühlampe oder LED",
    frage: "Wie viel von der zugeführten Energie gibt eine Maschine als Nutzenergie ab?",
    schritte: ["Wähle die LED-Lampe und stelle die zugeführte Energie auf 800 J ein (am Bildschirm: „hineingesteckte Energie“). Lies ab, wie viel davon Licht wird.", "Stelle nacheinander 1400 J, 2200 J und 3000 J ein und lies jedes Mal die Lichtenergie ab (am Bildschirm: „davon Licht“).", "Teile in jeder Zeile die Lichtenergie durch die zugeführte Energie und vergleiche."]
  },
  "el8": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "hebel", seite: 95,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum ist eine Stange länger als der Weg der Last?",
    titel: "Die Eisenstange unter dem Klavier",
    frage: "Spart eine lange Hebelstange nur Kraft – oder auch Arbeit?",
    schritte: ["Stelle die Last F₂ auf 200 N und den Kraftarm auf 0,40 m.", "Lies die Kraft F₁ am roten Pfeil im Bild ab und trage sie ein.", "Wiederhole das mit 0,80 m, 1,00 m und 2,00 m und rechne jede Zeile F₁ · l₁ aus."]
  },
  "el9": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "feste-rolle", seite: 99,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was bringt eine Rolle an der Decke?",
    titel: "Die Rolle unter dem Hallendach",
    frage: "Spart eine feste Rolle an der Decke wirklich Kraft?",
    schritte: ["Drücke „Feste Rolle“ und stelle die Last mit dem Regler auf 200 N.", "Lies die Zugkraft F und den Weg s ab; wiederhole das bei 500 N und bei 800 N.", "Drücke „Lose Rolle“ und miss bei 800 N. Rechne dann in jeder Zeile F geteilt durch G aus."]
  },
  "el10": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "flaschenzug", seite: 103,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wie viele Seile tragen die Last?",
    titel: "Vier Seile für das Klavier",
    frage: "Wie hängen Zugkraft und Seilweg von der Zahl der tragenden Seilstücke ab?",
    schritte: ["Stelle die Last auf 900 N ein und lass sie stehen.", "Stelle nacheinander n = 1, 2, 3 und 4 ein und lies F und s ab.", "Rechne in jeder Zeile F · s aus und vergleiche die Werte."]
  },
  "el11": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "zahnrad", seite: 107,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum dreht sich das kleine Rad schneller?",
    titel: "Im Getriebe der Seilwinde",
    frage: "Wovon hängt die Drehzahl des angetriebenen Zahnrads ab?",
    schritte: ["Stelle Rad 1 auf 30 Zähne und die Antriebsdrehzahl auf 60 U/min.", "Stelle Rad 2 nacheinander auf 12, 20 und 45 Zähne und lies n₂ ab.", "Rechne in jeder Zeile n₂ mal z₂ aus. Stelle dann Rad 1 auf 20 und Rad 2 auf 12 Zähne."]
  },
  "el12": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "schiefe-ebene", seite: 111,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum ist die Rampe leichter als das Heben?",
    titel: "Zwei Bohlen an der Bühnenkante",
    frage: "Wie verändert die Neigung der Rampe die nötige Zugkraft?",
    schritte: ["Wähle „steil“ und lies die Zugkraft in der Statuszeile ab.", "Wähle danach „mittel“ und dann „flach“ und lies jedes Mal die Zugkraft ab.", "Vergleiche deine drei Werte mit den 6 N, die senkrechtes Heben verlangt."]
  },
  "el13": {
    klasse: 9, schulform: "Gesamtschule NRW",
    sim: "schiefe-ebene", seite: 115,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was spart man wirklich - Kraft oder Arbeit?",
    titel: "Kraft gespart, Arbeit nicht",
    frage: "Bleibt das Produkt aus Kraft und Weg bei jeder Rampe gleich?",
    schritte: ["Wähle „flach“ und lies Zugkraft und Weglänge aus der Statuszeile ab.", "Wähle nacheinander „mittel“ und „steil“ und notiere jedes Mal beide Werte.", "Trage zuletzt senkrechtes Heben ein: 6 N, Weg 1,0 mal die Höhe. Vergleiche dann Kraft mal Weg in allen Zeilen."]
  },
  "ev1": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "magnetfeld", seite: 7,
    kapitel: "Woher der Strom kommt",
    name: "Wie sieht das Feld um einen Magneten aus?",
    titel: "Erster Tag im Umspannwerk",
    frage: "An welchen Stellen um einen Stabmagneten ist das Feld am stärksten?",
    schritte: ["Stelle den Abstand auf 55 und die Stelle am Magneten nacheinander auf 0°, 45° und 90°.", "Stelle danach bei 0° den Abstand auf 140 und beobachte die Nadel des Prüfkompasses noch einmal.", "Drücke „Feldlinien“ und vergleiche, wo die Linien dicht und wo sie weit auseinander liegen."]
  },
  "ev2": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "oersted", seite: 11,
    kapitel: "Woher der Strom kommt",
    name: "Kann Strom eine Kompassnadel bewegen?",
    titel: "Der Draht über der Kompassnadel",
    frage: "Was macht eine Kompassnadel, wenn neben ihr Strom fließt?",
    schritte: ["Stelle die Stromstärke auf 3,0 A und den Abstand auf 2,0 cm ein und lies den Ausschlag in der Statuszeile ab.", "Drücke „Strom ausschalten“ und beobachte, wohin die Nadel jetzt zeigt.", "Drücke „Strom einschalten“, dann „umpolen“; drücke danach noch einmal „umpolen“, dann „↓ Nadel unter den Draht“, und vergleiche jeweils, zu welcher Seite die Nadel ausschlägt."]
  },
  "ev3": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "elektromagnet", seite: 15,
    kapitel: "Woher der Strom kommt",
    name: "Wie baut man einen Magneten zum Anschalten?",
    titel: "Das Klacken im Schaltschrank",
    frage: "Wovon hängt die Tragkraft eines Elektromagneten ab?",
    schritte: ["Stelle bei „Windungszahl ändern“ nacheinander N = 50, 150 und 300 ein (I = 2 A) und lies die Tragkraft in Büroklammern ab.", "Drücke „Stromstärke ändern“, stelle I = 5 A ein (N = 150) und lies die Tragkraft ab; drücke danach „Beispielmessreihe“.", "Vergleiche in der Tabelle die Tragkraft bei 1 A mit der bei 5 A."]
  },
  "ev4": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "leiterkraft", seite: 19,
    kapitel: "Woher der Strom kommt",
    name: "Warum bewegt sich ein Draht im Magnetfeld?",
    titel: "Der aufgeschraubte Motor",
    frage: "Warum wird ein stromdurchflossener Draht im Magnetfeld zur Seite gedrückt?",
    schritte: ["Stelle das Magnetfeld auf 0,20 T und die Stromstärke nacheinander auf 0 A, 5,0 A und 10,0 A ein und lies jeweils die Kraft in der Statuszeile ab.", "Stelle wieder 5,0 A ein, drücke „Strom umpolen“ und beobachte, wohin der Stab jetzt gedrückt wird.", "Vergleiche in deiner Tabelle die Kraft bei 0 A mit der bei 10,0 A."]
  },
  "ev5": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "leiterkraft", seite: 23,
    kapitel: "Woher der Strom kommt",
    name: "Wie sagt man die Richtung der Kraft vorher?",
    titel: "Zwei Kabel vertauscht",
    frage: "Wie ändert sich die Kraftrichtung, wenn du Strom oder Magnet umpolst?",
    schritte: ["Lies ab, wohin der Stab im Ausgangszustand gedrückt wird und wo der Nordpol liegt.", "Drücke „Strom umpolen“ und lies die neue Richtung in der Statuszeile ab.", "Drücke „zurücksetzen“ und dann nur „Magnet umdrehen“; drücke danach zusätzlich „Strom umpolen“ und vergleiche die Kraftrichtung jeweils mit der im Ausgangszustand."]
  },
  "ev6": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "elektromotor", seite: 27,
    kapitel: "Woher der Strom kommt",
    name: "Wie wird aus der Kraft eine Drehbewegung?",
    titel: "Der geteilte Ring",
    frage: "Warum dreht sich die Spule nur weiter, wenn der Kommutator eingeschaltet ist?",
    schritte: ["Beobachte die drehende Spule bei 20 Windungen und eingeschaltetem Kommutator und lies das angezeigte Drehmoment ab.", "Stelle die Windungen der Spule auf 40 und vergleiche das Drehmoment mit dem Wert bei 20 Windungen.", "Drücke „Kommutator ist AN“ und beobachte, wie weit sich die Spule danach noch dreht."]
  },
  "ev7": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "induktion-rs", seite: 31,
    kapitel: "Woher der Strom kommt",
    name: "Wie entsteht Spannung ohne Batterie?",
    titel: "Ein Aufbau ohne Batterie",
    frage: "Wann zeigt der Spannungsmesser etwas an – und wovon hängt der Wert ab?",
    schritte: ["Beobachte bei „mittel“ und v = 50 cm/s den Zeiger, während der Magnet hineinfährt, liegen bleibt und wieder herausfährt.", "Drücke „stark“ und lies die Spannung bei v = 50 cm/s ab.", "Stelle die Geschwindigkeit des Magneten auf 100 cm/s und lies die Spannung erneut ab."]
  },
  "ev8": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "generator", seite: 35,
    kapitel: "Woher der Strom kommt",
    name: "Wie macht ein Generator daraus Strom?",
    titel: "Der Schatten und die Kurve",
    frage: "Wann ist die Spannung am größten – und wie groß ist der Schatten dann?",
    schritte: ["Beobachte nach dem Drücken von „2 · Warum ein Sinus?“, wie Schatten und Spannungskurve zusammenhängen.", "Drücke nacheinander „φ = 0°“, „φ = 90°“, „φ = 180°“ und „φ = 270°“ und lies jedes Mal cos φ und sin φ ab.", "Lies den Scheitelwert Û und den Effektivwert Û/√2 aus der Rechnung ab."]
  },
  "ev9": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "transformator-schluessel", seite: 39,
    kapitel: "Woher der Strom kommt",
    name: "Wie ändert ein Transformator die Spannung?",
    titel: "Zwei Spulen auf einem Eisenjoch",
    frage: "Wovon hängt die Spannung an der Sekundärspule eines Transformators ab?",
    schritte: ["Drücke die Station „2 · Spannungstransformation“ und stelle die Spannung UP auf 5,0 V ein.", "Stelle NP fest auf 500 und wähle für NS nacheinander 250, 500, 1000 und 2000; lies jedes Mal US ab.", "Vergleiche jeden abgelesenen Wert mit der Spannung, die die Simulation als ideal erwartet."]
  },
  "ev10": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "freileitungen", seite: 43,
    kapitel: "Woher der Strom kommt",
    name: "Warum hängen die Leitungen unter Hochspannung?",
    titel: "Zwei Lampen und ein dünner Draht",
    frage: "Warum wird elektrische Energie über weite Strecken mit Hochspannung übertragen?",
    schritte: ["Drücke die Station „2 · Warum Hochspannung?“ und stelle die Übertragungsspannung U auf 20 V ein.", "Lies den Leitungsverlust ab, drücke „Messwert übernehmen“ und wiederhole das für 40 V, 80 V und 250 V.", "Drücke „1/U² → PVerlust“ und vergleiche, ob deine Punkte nun auf einer Ursprungsgeraden liegen."]
  },
  "ev11": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "freileitungen", seite: 48,
    kapitel: "Woher der Strom kommt",
    name: "Was passiert zwischen Kraftwerk und Steckdose?",
    titel: "Der Weg bis zur Steckdose",
    frage: "Wie kommt die Energie vom Kraftwerk bis zur Lampe möglichst verlustarm an?",
    schritte: ["Drücke die Station „1 · Die drei Teilversuche“ und wähle das Konzept „Hochspannung“.", "Beobachte die Helligkeit der beiden Lampen und lies Leitungswiderstand, Stromstärke und Verlust ab.", "Wähle nacheinander „Niederspannung, CrNi“ und „Niederspannung, Kupfer“ und vergleiche jedes Mal dieselben Anzeigen."]
  },
  "ev12": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 52,
    kapitel: "Woher der Strom kommt",
    name: "Welche Kraftwerke liefern unseren Strom?",
    titel: "Steckbriefe für Kraftwerke",
    frage: "Welches Kraftwerk passt am besten in eine sichere Stromversorgung?",
    schritte: ["Lies die Kopfzeile des Datenblatts und kläre für jede Spalte, was dort angegeben wird.", "Vergleiche die Spalte zur Regelbarkeit und markiere die Kraftwerke, die sich schnell hoch- und herunterfahren lassen.", "Vergleiche zum Schluss Brennstoff und Umweltbelastung und ordne die Zeilen nach ihrer Eignung für die Grundlast. Trage dann für Kohlekraftwerk, Kernkraftwerk, Windpark und Pumpspeicherkraftwerk je einen Vorteil und einen Nachteil in die Tabelle ein."]
  },
  "ev13": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "wirkungsgrad", seite: 57,
    kapitel: "Woher der Strom kommt",
    name: "Wie viel von der Energie kommt beim Kunden an?",
    titel: "Warme Luft aus dem Schaltschrank",
    frage: "Gibt ein Gerät so viel Nutzenergie ab, wie man ihm an Energie zuführt?",
    schritte: ["Wähle nacheinander „Glühlampe“ und „LED-Lampe“. Lies für beide ab, wie viel der 1000 J als Licht abgegeben wird und wie viel als Wärme verloren geht.", "Vergleiche danach „Benzinmotor“, „Elektromotor“ und „Wasserkocher“ und trage Nutzenergie und Wirkungsgrad in die Tabelle ein.", "Wähle „Handy-Ladegerät“ und stelle die zugeführte Energie (am Bildschirm: „hineingesteckte Energie“) nacheinander auf 200 J, 600 J und 1200 J ein. Beobachte dabei den Wirkungsgrad."]
  },
  "ev14": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "stromkosten", seite: 62,
    kapitel: "Woher der Strom kommt",
    name: "Was kostet ein Gerät im Jahr?",
    titel: "Die Jahresrechnung am Tresen",
    frage: "Wovon hängt es ab, was ein Gerät im Jahr an elektrischer Energie kostet?",
    schritte: ["Stelle mit „3 h“ die Laufzeit ein und wähle nacheinander „LED 10 W“, „TV 100 W“, „Kühlschrank 150 W“ und „Wasserkocher 2000 W“. Lies jedes Mal die Jahreskosten ab.", "Wähle „Wasserkocher 2000 W“ und drücke nacheinander „1 h“, „3 h“, „8 h“ und „24 h“. Trage die Jahreskosten in die Tabelle ein.", "Drücke bei den beiden Prüffragen „In Kilowattstunden (kWh)“ und „Kosten = Energie (kWh) · Preis pro kWh“ und lies die Rückmeldung ab."]
  },
  "ev15": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 66,
    kapitel: "Woher der Strom kommt",
    name: "Was haben elektrisches, magnetisches und Gravitationsfeld gemeinsam?",
    titel: "Zwei Schilder am Zaun",
    frage: "Was haben elektrisches, magnetisches und Gravitationsfeld gemeinsam?",
    schritte: ["Lies im Datenblatt zum elektrischen Feld, zum magnetischen Feld und zum Gravitationsfeld ab, worauf es jeweils wirkt.", "Vergleiche die drei Einträge und halte fest, welche Aussage bei allen drei Feldern gleich lautet.", "Ordne jedem Feld die Quelle zu, von der es ausgeht, und trage sie in die Tabelle ein."]
  },
  "rk1": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "atombau-isotope", seite: 75,
    kapitel: "Aus dem Atomkern",
    name: "Woraus besteht ein Atomkern?",
    titel: "Der Kühlschrank mit den Zahlen",
    frage: "Welche Teilchen im Kern entscheiden, welches Element vor dir liegt?",
    schritte: ["Drücke nacheinander Wasserstoff-1, Helium-4 und Kohlenstoff-12 und lies im Statusfeld jeweils ab, wie viele Protonen und Neutronen im Kern sitzen.", "Drücke Kohlenstoff-14 und vergleiche Massenzahl und Stabilität mit Kohlenstoff-12.", "Stelle den Regler Protonen im Kern auf 8 ein und beobachte, welcher Elementname jetzt oben steht."]
  },
  "rk2": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "geiger-mueller", seite: 79,
    kapitel: "Aus dem Atomkern",
    name: "Was ist radioaktive Strahlung?",
    titel: "Das Knacken vor der Tür",
    frage: "Warum betreibt man ein Zählrohr ausgerechnet bei etwa 450 Volt?",
    schritte: ["Wähle die Karte 2 · Die Kennlinie und stelle die Zählrohrspannung U nacheinander auf 10 V, 200 V, 450 V und 650 V ein.", "Lies bei jeder Spannung ab, welcher Bereich mit Nummer, Namen und Spannungsgrenzen im Textfeld steht.", "Drücke nacheinander Proportionalbereich und Auslösebereich und vergleiche die Impulshöhen von α, β und γ."]
  },
  "rk3": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "absorption-strahlung", seite: 83,
    kapitel: "Aus dem Atomkern",
    name: "Welche Strahlungsarten gibt es?",
    titel: "Die Schürze aus Blei",
    frage: "Welches Material hält welche Strahlungsart auf?",
    schritte: ["Wähle die Karte 1 · Drei Strahlungsarten, drücke α-Strahlung und Papier und stelle den Regler Dicke d auf 1 mm ein.", "Drücke β-Strahlung und Aluminium, stelle Dicke d auf 5 mm ein und beobachte, was hinter dem Blech noch ankommt.", "Drücke γ-Strahlung und Blei, stelle Dicke d auf 6,0 mm ein und lies ab, wie viel Prozent durch das Blei hindurchkommen."]
  },
  "rk4": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "ionisation", seite: 87,
    kapitel: "Aus dem Atomkern",
    name: "Warum ist die Strahlung gefährlich?",
    titel: "Das Fläschchen, das zubleibt",
    frage: "Warum ist die kurze Alphastrahlung im Körper die gefährlichste?",
    schritte: ["Drücke α Alpha und lies ab, wie viele Ionenpaare je Millimeter entstehen.", "Drücke danach β Beta und γ Gamma und vergleiche Energie, Reichweite und Ionisationsdichte.", "Lies zu jeder Strahlungsart den Wichtungsfaktor ab, mit dem der Strahlenschutz rechnet."]
  },
  "rk5": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "geiger-mueller", seite: 91,
    kapitel: "Aus dem Atomkern",
    name: "Wie weist man Strahlung nach?",
    titel: "Das Knacken im Messraum",
    frage: "Wovon hängt die Höhe eines Impulses im Zählrohr ab?",
    schritte: ["Drücke „3 · Proportional- oder Auslösebereich“ und danach „Proportionalbereich“.", "Lies in der Tabelle die Impulshöhe für α, β und γ ab und trage sie ein.", "Drücke „Auslösebereich“ und vergleiche dieselben drei Zeilen noch einmal."]
  },
  "rk6": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "zerfall-halbwertszeit", seite: 95,
    kapitel: "Aus dem Atomkern",
    name: "Wann ist die Hälfte zerfallen?",
    titel: "Das Fläschchen im Bleibehälter",
    frage: "Zerfällt nach einer Halbwertszeit immer genau die Hälfte der Kerne?",
    schritte: ["Drücke „Radon-220“ und lies in der Statuszeile die Halbwertszeit und die Zahl der Kerne ab.", "Drücke „eine Halbwertszeit weiter“ und vergleiche die übrige Zahl mit der erwarteten Zahl.", "Wähle nacheinander Iod-131, Cäsium-137 und Plutonium-239 und drücke jedes Mal „eine Halbwertszeit weiter“."]
  },
  "rk7": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "zerfall-halbwertszeit", seite: 99,
    kapitel: "Aus dem Atomkern",
    name: "Wie alt ist ein Fund?",
    titel: "Ein Holzstück aus dem Moor",
    frage: "Wie kommst du vom Restanteil an Kohlenstoff-14 auf das Alter eines Fundes?",
    schritte: ["Drücke „Kohlenstoff-14“ und lies in der Statuszeile die Halbwertszeit und die Anzahl der Kerne am Start ab.", "Drücke „eine Halbwertszeit weiter“ und lies ab, wie viele Jahre vergangen und wie viel Prozent übrig sind.", "Drücke die Taste noch zweimal, bis 3 Halbwertszeiten vergangen sind, und vergleiche nach jedem Schritt Jahreszahl und Prozentwert mit dem Schritt davor."]
  },
  "rk8": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "zerfallsreihe", seite: 103,
    kapitel: "Aus dem Atomkern",
    name: "Was wird aus einem Kern, der zerfällt?",
    titel: "Vierzehn Schritte bis zum Blei",
    frage: "Was ändert sich an einem Kern bei einem Alpha- und was bei einem Betazerfall?",
    schritte: ["Lies im Startbild (Schritt 0) ab, wie viele Protonen und Neutronen Uran-238 hat und welche Strahlung es als Erstes aussendet.", "Drücke zweimal „nächster Zerfall“ (Schritt 1 und 2) und vergleiche nach jedem Druck Massenzahl und Kernladungszahl mit den Werten davor.", "Drücke „bis zum Ende“ und lies ab, bei welchem Kern die Reihe aufhört und wie viele Zerfälle es waren."]
  },
  "rk9": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "kernspaltung", seite: 107,
    kapitel: "Aus dem Atomkern",
    name: "Was passiert bei einer Kernspaltung?",
    titel: "Ein Würfel gegen einen Güterzug",
    frage: "Woher kommt die Energie, die bei einer Kernspaltung frei wird?",
    schritte: ["Drücke „Spaltung noch einmal“ und beobachte, wie das langsame Neutron den Urankern trifft. Lies danach ab, wie viele Neutronen bei Barium + Krypton frei werden.", "Vergleiche die Zahl der Kernbausteine und die Zahl der Protonen links und rechts vom Pfeil. Lies ab, um wie viel u die Masse aller Teilchen nach der Spaltung kleiner ist als vorher.", "Wähle nacheinander „Xenon + Strontium“ und „Cäsium + Rubidium“ und trage die fehlende Masse und die frei werdende Energie in die Tabelle ein."]
  },
  "rk10": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "kettenreaktion", seite: 111,
    kapitel: "Aus dem Atomkern",
    name: "Wie hält man eine Kettenreaktion unter Kontrolle?",
    titel: "Der Beitrag im Aufenthaltsraum",
    frage: "Was entscheidet darüber, ob eine Kettenreaktion gleichmäßig läuft?",
    schritte: ["Stelle die Steuerstäbe auf 0 % ein und lies den Vermehrungsfaktor k und die Meldung darunter ab.", "Stelle nacheinander 50 %, 75 % und 100 % ein und trage k mit der Meldung in die Tabelle ein.", "Drücke „Zurücksetzen“, stelle 50 % ein und drücke dann „nächste Generation“. Vergleiche die Zahl der Spaltungen mit der Generation davor."]
  },
  "rk11": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "kettenreaktion", seite: 115,
    kapitel: "Aus dem Atomkern",
    name: "Wie ist ein Kernkraftwerk aufgebaut?",
    titel: "Der Umweg über den Dampf",
    frage: "Wie wird die Wärme aus dem Reaktor in elektrische Energie umgewandelt?",
    schritte: ["Stelle die Steuerstäbe auf 50 % ein und lies ab, wie viel Energie eine einzelne Spaltung liefert und wie viel die 500 Spaltungen der Generation 0 zusammen ergeben.", "Drücke „Laufen lassen“ und beobachte über mehrere Generationen, ob die Zahl der Spaltungen gleich bleibt.", "Lies ab, wie viele Spaltungen je Sekunde ein Kraftwerk für 300 Megawatt braucht, und vergleiche diese Zahl mit den 500 Spaltungen im Bild."]
  },
  "rk12": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 119,
    kapitel: "Aus dem Atomkern",
    name: "Wohin mit dem, was übrig bleibt?",
    titel: "Der abgeschlossene Raum im Keller",
    frage: "Warum kann man abgebrannte Brennstäbe nicht einfach abklingen lassen?",
    schritte: ["Lies im Datenblatt zu jedem Stoff die Halbwertszeit ab und trage nacheinander den Stoff mit der kürzesten, einen mit mittlerer und den mit der längsten Halbwertszeit in die Tabelle ein.", "Vergleiche die kürzeste mit der längsten Halbwertszeit und halte fest, um wie viel sie sich unterscheiden.", "Ordne die Stoffe danach, ob nach zehn Halbwertszeiten ein Abklingraum genügt oder ein Lager für viele Generationen nötig ist."]
  },
  "rk13": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "strahlenschutz", seite: 124,
    kapitel: "Aus dem Atomkern",
    name: "Wie schützt man sich vor Strahlung?",
    titel: "Dosimeter, Blei und ein Schritt zurück",
    frage: "Was senkt die Dosis stärker: mehr Abstand oder ein paar Millimeter Blei?",
    schritte: ["Stelle den Abstand nacheinander auf 50 cm, 100 cm und 200 cm ein und lies jedes Mal die Dosisleistung ab.", "Stelle den Abstand zurück auf 50 cm und schiebe den Regler für das Blei auf 7 mm.", "Vergleiche, welche der beiden Änderungen den Wert stärker senkt."]
  },
  "rk14": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "strahlenschutz", seite: 128,
    kapitel: "Aus dem Atomkern",
    name: "Wie viel Strahlung ist noch vertretbar?",
    titel: "Ein Flug, eine Röntgenaufnahme, ein Grenzwert",
    frage: "Ab welchem Abstand bleibt die Dosis in 20 Minuten unter der eines Fluges?",
    schritte: ["Stelle die Aufenthaltsdauer auf 20 Minuten und den Abstand auf 55 cm ein.", "Lies ab, wie groß die Dosis in 20 Minuten ist, und lies die Vergleichszeile darunter mit.", "Vergleiche diese Zeile mit der bei 90 cm, 125 cm und 300 cm."]
  },
  "rk15": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 132,
    kapitel: "Aus dem Atomkern",
    name: "Wie hilft Strahlung in der Medizin?",
    titel: "Die Liste im Vorbereitungsraum",
    frage: "Warum eignet sich nicht jeder radioaktive Stoff für jede Aufgabe in der Medizin?",
    schritte: ["Lies ab, welche Strahlungsart und welche Halbwertszeit im Datenblatt zu jedem Stoff gehören.", "Vergleiche die Zeilen, die zur Diagnose gehören, mit den Zeilen für die Therapie, und lies unter dem Datenblatt ab, wo die Strahlung jeweils ihre Energie abgibt.", "Wähle zu jeder der beiden Aufgaben den Stoff aus, der nach der Tabelle am besten passt."]
  },
  "rk16": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: "kernfusion", seite: 137,
    kapitel: "Aus dem Atomkern",
    name: "Woher nimmt die Sonne ihre Energie?",
    titel: "Der Ofen im Sonnenkern",
    frage: "Ab welcher Temperatur verschmelzen Wasserstoffkerne zu Heliumkernen?",
    schritte: ["Stelle die Temperatur auf 4 Millionen °C ein und lies die Statuszeile darunter.", "Stelle die Temperatur nacheinander auf 8, 12 und 16 Millionen °C und achte darauf, ab wann dort „Es zündet“ steht.", "Vergleiche im Text die Energie je Kernbaustein bei Fusion und bei Spaltung."]
  },
  "rk17": {
    klasse: 10, schulform: "Gesamtschule NRW",
    sim: null, seite: 141,
    kapitel: "Aus dem Atomkern",
    name: "Kernenergie: Wie stehst du dazu?",
    titel: "Die Folie, die noch fehlt",
    frage: "Welche Gründe sprechen für und gegen Kernenergie, und was wiegt schwerer?",
    schritte: ["Lies ab, welche Angaben im Datenblatt stehen, und unterstreiche darin jede Zahl.", "Vergleiche die Spalten des Datenblatts und markiere, wo die Unterschiede am größten sind.", "Wähle vier Angaben aus, die für dich am schwersten wiegen, und trage sie in die Tabelle ein."]
  },
  "wm1": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "thermometer", seite: 6,
    kapitel: "Temperatur und Wärme",
    name: "Wie misst man, wie warm etwas ist?",
    titel: "Der kletternde rote Faden",
    frage: "Wie misst man, wie warm etwas ist?",
    schritte: ["Schiebe den Regler Temperatur langsam nach oben und beobachte, wie die rote Säule in der Röhre mitwandert.", "Tippe nacheinander auf Eiswasser, Deine Faust, warmes Wasser und kochendes Wasser und lies jedes Mal den angezeigten Wert in °C ab.", "Stelle den Regler Temperatur auf -10 °C und beobachte, wie tief die Säule jetzt fällt."]
  },
  "wm2": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "temperatur-waerme", seite: 10,
    kapitel: "Temperatur und Wärme",
    name: "Sind Temperatur und Wärme dasselbe?",
    titel: "Die große Kanne gewinnt",
    frage: "Sind Temperatur und Wärme dasselbe?",
    schritte: ["Schiebe die Temperatur von Gefäß 2 (Menge: 2 L) auf 80 °C, lies in der Statuszeile die Wärmemenge beider Gefäße ab und tippe dann auf In Kontakt bringen.", "Stelle die Temperatur von Gefäß 2 zurück auf 20 °C, notiere erst beide Wärmemengen und lies nach dem Tippen auf In Kontakt bringen die Mischtemperatur ab.", "Schiebe die Menge von Gefäß 2 auf 1 L, notiere die Wärmemengen, tippe noch einmal auf In Kontakt bringen und vergleiche die neue Mischtemperatur mit vorher."]
  },
  "wm3": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "waermeuebertragung", seite: 15,
    kapitel: "Temperatur und Wärme",
    name: "Auf welchen Wegen wandert Wärme?",
    titel: "Der heiße Löffelstiel",
    frage: "Auf welchen Wegen wandert Wärme?",
    schritte: ["Wähle Leitung und verfolge im Bild, wie die Wärme von der Flamme durch den Metallstab vom heißen zum kalten Ende wandert.", "Wähle Strömung und beobachte im Topf, wie das warme Wasser in der Mitte aufsteigt und das kalte außen absinkt.", "Wähle Strahlung und lies im Feld Das passiert gerade nach, wie die Wärme der Sonne durch den leeren Raum kommt."]
  },
  "wm4": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "daemmung", seite: 19,
    kapitel: "Temperatur und Wärme",
    name: "Wie hält man Wärme auf?",
    titel: "Der lauwarme Tee",
    frage: "Wie hält man Wärme auf?",
    schritte: ["Wähle den Dämmstoff ohne Dämmung und starte mit Messreihe (0–10 min) die erste Messung.", "Tippe auf Alle Materialien und lies nacheinander für ohne Dämmung, Alufolie, Watte/Wolle und Styropor in der Spalte T (°C) die Temperatur nach 10 min ab.", "Vergleiche im Diagramm der Auswertung, welche Abkühlkurve am flachsten verläuft."]
  },
  "wm5": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "waermeausdehnung", seite: 23,
    kapitel: "Temperatur und Wärme",
    name: "Warum passt der heiße Deckel nicht mehr?",
    titel: "Der wacklige Deckel",
    frage: "Warum passt der heiße Deckel nicht mehr?",
    schritte: ["Wähle die Taste fest und schiebe den Regler Temperatur von 20 °C auf 100 °C – beobachte die Teilchen und den Balken Größe des Stoffs und lies bei 100 °C die Ausdehnung in der Statuszeile ab.", "Stelle nacheinander flüssig und Gas ein und lies jeweils in der Statuszeile die Ausdehnung bei 100 °C ab.", "Schiebe den Regler zurück auf 20 °C und beobachte, was mit der Größe des Stoffs passiert."]
  },
  "wm6": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "aggregatzustaende", seite: 27,
    kapitel: "Temperatur und Wärme",
    name: "Fest, flüssig, gasförmig - was passiert beim Wechsel?",
    titel: "Hart, nass und einfach weg",
    frage: "Fest, flüssig, gasförmig – was passiert beim Wechsel?",
    schritte: ["Schiebe den Regler Temperatur auf −10 °C und lies in der Statuszeile ab, wie die Teilchen im Eis sitzen.", "Erwärme das Eis Schritt für Schritt mit der Taste erwärmen oder dem Regler und beobachte, kurz nach welcher Marke der Skala die Statuszeile auf Wasser – flüssig umspringt, und erwärme dann weiter bis 20 °C.", "Stelle 100 °C ein und vergleiche die Teilchen des Wasserdampfs mit denen im Eisgitter."]
  },
  "wm7": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "anomalie-wasser", seite: 31,
    kapitel: "Temperatur und Wärme",
    name: "Warum schwimmt Eis oben?",
    titel: "Wasser tanzt aus der Reihe",
    frage: "Warum schwimmt Eis oben?",
    schritte: ["Schiebe den Regler Wassertemperatur langsam von 10 °C auf 0 °C und beobachte im Feld Nachgerechnet, wie sich Dichte und Volumen von 1 kg Wasser verändern.", "Tippe nacheinander auf 0 °C · eiskalt, 4 °C · am dichtesten und 10 °C · kühl, lies jeweils unter Nachgerechnet Dichte und Volumen von 1 kg Wasser ab und vergleiche mit dem Eis-Wert unter der Überschrift 4 · Und Eis?", "Tippe auf Der See im Winter und stelle den Regler nacheinander auf 0 °C, 2 °C und 4 °C – der Messfühler zeigt dir, in welcher Tiefe er dieses Wasser findet."]
  },
  "sm1": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "stromkreis-lampe", seite: 39,
    kapitel: "Strom und Magnete",
    name: "Wann leuchtet das Lämpchen?",
    titel: "Die Kiste mit dem Lämpchen",
    frage: "Wann leuchtet das Lämpchen?",
    schritte: ["Sieh dir den Anfangszustand an: Die Taste Schalter steht auf geschlossen, die Taste Kabel auf heil. Lies die Statuszeile ab.", "Tippe auf die Taste Schalter, sodass dort offen steht, und beobachte Lämpchen und Statuszeile.", "Stelle den Schalter wieder auf geschlossen und tippe dann auf die Taste Kabel, sodass dort unterbrochen steht. Stelle zum Schluss beide Unterbrechungen gleichzeitig ein: Schalter offen, Kabel unterbrochen."]
  },
  "sm2": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schaltplan", seite: 43,
    kapitel: "Strom und Magnete",
    name: "Wie zeichnet man einen Stromkreis?",
    titel: "Die geheime Zeichensprache",
    frage: "Wie zeichnet man einen Stromkreis?",
    schritte: ["Wähle die Ansicht Aufbau (Bild) und tippe auf die Taste Schalter: Im Bild steht dann offen – Lampe aus oder geschlossen – Lampe leuchtet.", "Wechsle zur Ansicht Schaltplan und finde Batterie, Lampe, Schalter und Leitung in der Zeichnung wieder; der Zettel aus der Kiste hilft dir dabei.", "Bearbeite das Zuordnungsspiel, bis unter allen vier Fragen Richtig! steht."]
  },
  "sm3": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "leiter-nichtleiter", seite: 47,
    kapitel: "Strom und Magnete",
    name: "Welche Stoffe lassen Strom hindurch?",
    titel: "Das zu kurze Kabel",
    frage: "Welche Stoffe lassen Strom hindurch?",
    schritte: ["Tippe nacheinander alle neun Gegenstände an, von der Büroklammer bis zum Radiergummi – jedes wird in die Lücke gesetzt.", "Beobachte bei jedem Gegenstand das Lämpchen und die Meldung im Bild: Lampe leuchtet: Leiter oder Lampe aus: Nichtleiter. Trage Büroklammer, Bleistiftmine, Plastik-Lineal und Glas-Stab in die Tabelle ein.", "Lies zum Schluss die Regel ab, die nach Alle getestet! erscheint, und vergleiche sie mit deinen zwei Gruppen."]
  },
  "sm4": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "reihenschaltung-rs", seite: 51,
    kapitel: "Strom und Magnete",
    name: "Was ändert sich, wenn Lampen hintereinander hängen?",
    titel: "Mehr Lämpchen, weniger Licht",
    frage: "Was ändert sich, wenn Lampen hintereinander hängen?",
    schritte: ["Stelle mit dem Schieberegler Anzahl Lampen in Reihe nacheinander 1, 2 und 3 ein und lies jedes Mal die Angabe Helligkeit je Lampe ab.", "Beobachte dabei die Lampen im Bild und die Statuszeile: Sie meldet, ob alle Lampen leuchten.", "Tippe bei 2 Lampen auf die Taste Lampe 2, sodass dort herausgedreht steht, und beobachte, was mit der anderen Lampe und der Helligkeit passiert."]
  },
  "sm5": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "parallelschaltung-rs", seite: 55,
    kapitel: "Strom und Magnete",
    name: "Was ändert sich, wenn jede Lampe ihren eigenen Weg hat?",
    titel: "Zwei Lämpchen, zwei Schalter",
    frage: "Was ändert sich, wenn jede Lampe ihren eigenen Weg hat?",
    schritte: ["Beobachte den Anfangszustand: Beide Tasten stehen auf an, die Statuszeile meldet: Beide Lampen leuchten – jede voll hell.", "Tippe auf die Taste Schalter 1 (Lampe 1), sodass dort aus steht, und beobachte Lampe 2 und die Statuszeile.", "Stelle nacheinander diese vier Stellungen ein: beide Schalter an, nur Schalter 1 (Lampe 1) an, nur Schalter 2 (Lampe 2) an, beide Schalter aus. Trage jedes Mal ein, welche Lampe leuchtet."]
  },
  "sm6": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "und-oder-schaltung", seite: 59,
    kapitel: "Strom und Magnete",
    name: "UND oder ODER - wie schalten zwei Schalter zusammen?",
    titel: "Das Rätsel der zwei Bretter",
    frage: "UND oder ODER – wie schalten zwei Schalter zusammen?",
    schritte: ["Wähle UND · in Reihe und stelle mit den Knöpfen Schalter S1 und Schalter S2 nacheinander diese vier Stellungen ein: beide offen, nur S2 geschlossen, nur S1 geschlossen, beide geschlossen; lies jedes Mal ab, ob darunter Lampe = 1 (leuchtet) oder Lampe = 0 (aus) steht.", "Wähle ODER · parallel und stelle dieselben vier Stellungen noch einmal ein; beobachte, wie sich der Stromkreis in zwei Zweige umbaut und die grün gestrichelten Stromwege nur durch geschlossene Zweige laufen.", "Lies in der Wahrheitstabelle ab, in wie vielen der vier Zeilen die Lampe bei UND an ist und in wie vielen bei ODER; trage deine Ergebnisse mit 0 = offen und 1 = geschlossen in die Tabelle ein."]
  },
  "sm7": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "stromwirkungen", seite: 64,
    kapitel: "Strom und Magnete",
    name: "Was kann der Strom alles bewirken?",
    titel: "Vier Geräte, eine Batterie",
    frage: "Was kann der Strom alles bewirken?",
    schritte: ["Wähle unter Gerät anschließen nacheinander Glühlampe, Heizdraht, Spule (Elektromagnet) und Elektromotor.", "Lies in der Liste Beobachtete Wirkung(en) ab, welche Wirkungen einen Haken bekommen, und trage sie in die Tabelle ein.", "Schiebe den Regler Stromstärke I von 1 A auf 5 A und beobachte, wie sich Lampe, Draht und Motor im Bild verändern."]
  },
  "sm8": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "elektronen-drift", seite: 68,
    kapitel: "Strom und Magnete",
    name: "Was fließt da eigentlich im Draht?",
    titel: "Der Streit am Lichtschalter",
    frage: "Was fließt da eigentlich im Draht?",
    schritte: ["Tippe auf die Taste Leselampe und lies im Feld Nachgerechnet ab, mit welcher Geschwindigkeit v die Elektronen wandern und wie lange sie für einen Meter Kabel brauchen.", "Wähle danach Handy-Ladegerät und Wasserkocher und trage die Werte in die Tabelle ein.", "Schiebe den Regler Stromstärke langsam nach rechts und beobachte, wie sich die Zeile Wandern unter dem Draht verändert."]
  },
  "sm9": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "stromgefahren", seite: 72,
    kapitel: "Strom und Magnete",
    name: "Wozu gibt es Sicherungen?",
    titel: "Die volle Steckdosenleiste",
    frage: "Wozu gibt es Sicherungen?",
    schritte: ["Lies im Feld Strom & Sicherung ab, wie groß die Stromstärke I bei einem einzelnen Gerät ist, und trage den Wert in die Tabelle ein.", "Tippe dreimal auf Gerät anschließen (2, 3 und 4 Geräte) und notiere nach jedem neuen Gerät die Stromstärke und ob die Sicherung hält oder auslöst.", "Drücke Sicherung zurücksetzen und finde mit Gerät anschließen und Gerät entfernen heraus, wie viele Geräte gerade noch sicher laufen."]
  },
  "sm10": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "magnetpole", seite: 76,
    kapitel: "Strom und Magnete",
    name: "Wo zieht ein Magnet am stärksten?",
    titel: "Die Tür, die plötzlich zuzieht",
    frage: "Wo zieht ein Magnet am stärksten?",
    schritte: ["Stelle mit dem Regler den Abstand d auf 2 cm ein und lies ab, wie viele Skalenteile der Kraftmesser zeigt.", "Schiebe den Regler nacheinander auf 4 cm, 8 cm und 12 cm und trage die Skalenteile jeweils in die Tabelle ein.", "Wähle die Taste Magnet an der Tür umgedreht und beobachte, was aus der Anziehung wird und wohin die Pfeile jetzt zeigen."]
  },
  "sm11": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "magnet-stoffe", seite: 80,
    kapitel: "Strom und Magnete",
    name: "Was zieht ein Magnet an - und was nicht?",
    titel: "Der Beutel aus der zweiten Kiste",
    frage: "Was zieht ein Magnet an – und was nicht?",
    schritte: ["Tippe der Reihe nach auf alle neun Materialien, vom Eisen-Nagel bis zu Blech 3.", "Beobachte die Meldung unten im Bild – „wird angezogen!“ oder „bleibt liegen – nicht magnetisch“ – und trage für Eisen-Nagel, Büroklammer (Stahl), Alu-Dose und Kupfer-Draht Ja oder Nein in die Tabelle ein.", "Vergleiche am Ende die beiden Gruppen „wird angezogen“ und „wird nicht angezogen“ und lies die Regel unter der Tabelle ab."]
  },
  "sm12": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "magnetfeld", seite: 84,
    kapitel: "Strom und Magnete",
    name: "Wie sieht man das Unsichtbare um den Magneten?",
    titel: "Nichts zu sehen und doch da",
    frage: "Wie sieht man das Unsichtbare um den Magneten?",
    schritte: ["Schiebe den Regler „Stelle am Magneten“ auf 0° und den Regler „Abstand des Prüfkompasses vom Magneten“ auf 55 und beobachte die rote Spitze des Prüfkompasses.", "Stelle danach 90° und 180° ein und vergleiche, wie sich die Nadel an jeder Stelle des Magneten ausrichtet.", "Lass die Taste „Feldlinien“ eingeschaltet und untersuche, wo die Linien dicht beieinanderliegen und wo sie weit auseinanderlaufen – auch beim Abstand 140."]
  },
  "sm13": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "elementarmagnete", seite: 88,
    kapitel: "Strom und Magnete",
    name: "Wie wird ein Nagel selbst zum Magneten?",
    titel: "Der aufgeräumte Nagel",
    frage: "Wie wird ein Nagel selbst zum Magneten?",
    schritte: ["Lass die Streichwirkung auf 30 % stehen und tippe dreimal nacheinander auf „Mit Magnet streichen“ – lies nach jedem Strich unter „Nachgerechnet“ ab, wie viele der 64 Elementarmagnete (am Bildschirm: Pfeile) ausgerichtet sind und wie viele Büroklammern der Nagel trägt, und trage die Werte in die Tabelle ein.", "Tippe danach auf „Erhitzen“ und trage ein, wie viele Elementarmagnete jetzt noch ausgerichtet sind und wie viele Büroklammern hängen bleiben.", "Magnetisiere den Nagel mit drei neuen Strichen und tippe auf „Nagel durchsägen“ – prüfe unter „Nachgerechnet“, ob eines der beiden Stücke nur einen einzigen Pol hat."]
  },
  "sm14": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "kompass", seite: 93,
    kapitel: "Strom und Magnete",
    name: "Warum zeigt der Kompass nach Norden?",
    titel: "Die Nadel ohne Motor",
    frage: "Warum zeigt der Kompass nach Norden?",
    schritte: ["Lass die Magnetleiste zuerst aus, sodass nur das Erdmagnetfeld wirkt. Tippe mehrmals auf „Nadel anstoßen“ und beobachte, wo die rote Nadelspitze jedes Mal zur Ruhe kommt.", "Schalte die Taste „in der Bude: die Magnetleiste“ ein und stelle „Magnet – Abstand“ erst auf 3 cm, dann auf 15 cm – beobachte die rote Spitze.", "Schalte zuletzt die Taste „Erdmagnetfeld“ aus und prüfe, wohin sich die Nadel jetzt dreht."]
  },
  "sl1": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "ton-entsteht", seite: 100,
    kapitel: "Schall",
    name: "Wie entsteht ein Ton?",
    titel: "Die Keksdose mit dem Gummiband",
    frage: "Wie entsteht ein Ton?",
    schritte: ["Sieh dir das Band zuerst vor dem ersten Zupfen an und trage ein, was du beobachtest. Tippe dann auf»Gummiband zupfen«und beobachte, wie das Band ausschlägt und welche Linien von ihm ausgehen.", "Lies im Feld»Zustand«ab, ob du einen Ton hörst, und trage es in die Tabelle ein.", "Tippe auf»Finger auf das Band legen«und vergleiche, was das Band jetzt macht und was im Feld»Zustand«steht."]
  },
  "sl2": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "tonhoehe", seite: 104,
    kapitel: "Schall",
    name: "Was macht einen Ton hoch oder tief?",
    titel: "Helles Pling, tiefes Brummen",
    frage: "Was macht einen Ton hoch oder tief?",
    schritte: ["Schiebe den Regler»Schwingungen pro Sekunde (Frequenz)«ganz nach links auf 100 Hz und betrachte, wie weit die Wellenberge auseinanderliegen.", "Lies im Feld»Tonhöhe«ab, ob der Ton tief, mittel oder hoch ist, und trage es mit der Frequenz in die Tabelle ein.", "Stelle nacheinander 300 Hz, 560 Hz und 800 Hz ein und beobachte, wie der Punkt auf der Skala von»tief«nach»hoch«wandert."]
  },
  "sl3": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "lautstaerke", seite: 108,
    kapitel: "Schall",
    name: "Was macht einen Ton laut oder leise?",
    titel: "Zweimal am selben Band gezupft",
    frage: "Was macht einen Ton laut oder leise?",
    schritte: ["Schiebe den Regler»So fest wird am Gummiband gezupft«ganz nach links und betrachte den Ausschlag der Kurve und die gestrichelte Linie»Amplitude«.", "Lies im Feld»Lautstärke«ab, was dort steht, und trage es in die Tabelle ein.", "Stelle den Regler in die Mitte und danach ganz nach rechts und vergleiche Ausschlag, Balken und Anzeige."]
  },
  "sl4": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schallausbreitung", seite: 112,
    kapitel: "Schall",
    name: "Wie kommt der Schall zu uns?",
    titel: "Ein Ohr an der Tischplatte",
    frage: "Wie kommt der Schall zu uns?",
    schritte: ["Wähle unter»Stoff zwischen Glocke und Ohr«zuerst»Luft«und beobachte, wie die Teilchen die Schwingung von der Glocke zum Ohr weitergeben.", "Lies im Feld»Ergebnis«ab, ob du die Glocke hörst und was dort über die Geschwindigkeit steht, und trage beides in die Tabelle ein.", "Wähle danach»Wasser«,»Balken (Holz)«und zuletzt»Vakuum (Weltall)«und vergleiche, was mit den Teilchen und dem Ton passiert."]
  },
  "sl5": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schall", seite: 116,
    kapitel: "Schall",
    name: "Warum hallt es in der Turnhalle?",
    titel: "Flöte und Bass kommen zusammen an",
    frage: "Sind hohe Töne schneller als tiefe?",
    schritte: ["Schiebe den Regler Frequenz f ganz nach links auf 100 Hz und sieh dir an, wie weit die Verdichtungen im Bild auseinanderliegen.", "Lies im weißen Kästchen oben rechts die Wellenlänge λ (den Abstand zweier Verdichtungen) und die Geschwindigkeit c ab und trage beide in die Tabelle ein.", "Stelle nacheinander 400 Hz, 1000 Hz und 2000 Hz ein und prüfe jedes Mal, ob sich die Geschwindigkeit c ändert."]
  },
  "sl6": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "laermschutz", seite: 120,
    kapitel: "Schall",
    name: "Wann wird Schall zu Lärm?",
    titel: "Der Bohrer hinter der Wand",
    frage: "Wann wird Schall zu Lärm?",
    schritte: ["Lass die Lautstärke der Quelle auf 100 dB stehen und lies in der Statuszeile ab, wie viele dB bei 2 m Abstand am Ohr ankommen.", "Schiebe den Regler Abstand zur Quelle auf 16 m, lies erneut ab und stelle danach wieder 2 m ein.", "Tippe zuerst auf Gehörschutz, schalte ihn wieder aus und tippe dann auf Schallschutz (Absorption) – vergleiche die Lautstärke am Ohr."]
  },
  "sl7": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "ohr", seite: 124,
    kapitel: "Schall",
    name: "Wie hört das Ohr?",
    titel: "Das Häutchen im Kopf",
    frage: "Wie hört das Ohr?",
    schritte: ["Schiebe den Regler So laut wird der Topf angeschlagen ganz nach links auf leise und beobachte das rote Trommelfell im Bild.", "Stelle danach mittel und laut ein und vergleiche, wie stark das Trommelfell jedes Mal hin- und herschwingt.", "Öffne erst zum Schluss den Klapptext Erst nach dem Versuch öffnen: der Weg des Schalls und lies die sechs Stationen nach."]
  },
  "sl8": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "tonhoehe", seite: 128,
    kapitel: "Schall",
    name: "Was hören Tiere, was wir nicht hören?",
    titel: "Die stumme Pfeife",
    frage: "Was hören Tiere, was wir nicht hören?",
    schritte: ["Schiebe den Regler Schwingungen pro Sekunde (Frequenz) ganz nach links auf 100 Hz und lies die Anzeige in der Statuszeile ab.", "Stelle danach 300 Hz und 800 Hz ein und trage jedes Mal ein, ob dort tiefer, mittlerer oder hoher Ton steht.", "Beobachte die violette Welle im Bild: Zähle, ob bei 800 Hz mehr Wellenberge zu sehen sind als bei 100 Hz."]
  },
  "li1": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "lichtausbreitung", seite: 135,
    kapitel: "Licht",
    name: "Wie breitet sich Licht aus?",
    titel: "Zwei Pappstreifen, kein Licht",
    frage: "Wie breitet sich Licht aus?",
    schritte: ["Stelle den Regler „Loch der 1. Blende“ auf +18 und lass „Loch der 2. Blende“ auf 0 stehen. Lies die Statuszeile.", "Schiebe „Loch der 2. Blende“, bis die Statuszeile „Das Licht kommt durch!“ meldet und der Strahl genau durch die Mitte des Lochs läuft. Notiere beide Zahlen in der Tabelle.", "Wiederhole das mit „Loch der 1. Blende“ auf -20 und auf 0 und trage jedes Mal die passende Zahl der 2. Blende ein."]
  },
  "li2": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "sehen", seite: 139,
    kapitel: "Licht",
    name: "Warum sehen wir Dinge?",
    titel: "Stockdunkel im Physikraum",
    frage: "Warum sehen wir Dinge?",
    schritte: ["Tippe auf „Zimmerlicht“, sodass dort „aus“ steht, und wähle nacheinander Kerze und Taschenlampe. Lies jedes Mal die Statuszeile.", "Wähle bei ausgeschaltetem Zimmerlicht die Tüte Gummibärchen und den Mond und trage ein, ob du etwas siehst.", "Schalte das Zimmerlicht wieder an und prüfe alle Gegenstände noch einmal – auch das Katzenauge."]
  },
  "li3": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "licht-oberflaeche", seite: 143,
    kapitel: "Licht",
    name: "Warum spiegelt das eine und das andere nicht?",
    titel: "Ein Spiegel aus Papier?",
    frage: "Warum spiegelt das eine und das andere nicht?",
    schritte: ["Wähle nacheinander Spiegel, Fensterglas, schwarzes Papier und weißes Papier und lies in der Statuszeile die drei Prozentzahlen ab: reflektiert, durchgelassen und absorbiert.", "Beobachte im Bild genau, in wie viele Richtungen das Licht beim Spiegel und beim weißen Papier reflektiert wird.", "Stelle den „Winkel zum Lot“ erst auf 0° und dann auf 80° und prüfe, ob sich die Prozentzahlen ändern."]
  },
  "li4": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "dunkle-flaechen", seite: 147,
    kapitel: "Licht",
    name: "Warum wird Dunkles in der Sonne heißer?",
    titel: "Heißer Deckel, kühler Deckel",
    frage: "Warum wird Dunkles in der Sonne heißer?",
    schritte: ["Wähle unter „Farbe der Fläche wählen“ zuerst schwarz und beobachte, wie die Temperaturanzeige neben der Fläche von 20 °C aus steigt.", "Lies in der Liste „Endtemperatur im Vergleich“ die Werte für schwarz, dunkelrot, weiß und silber (blank) ab und trage sie in die Tabelle ein.", "Vergleiche im Bild, wie viele blaue „reflektiert“-Strahlen bei schwarz und bei silber (blank) zurücklaufen."]
  },
  "li5": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schatten-entstehung", seite: 151,
    kapitel: "Licht",
    name: "Wie entsteht ein Schatten?",
    titel: "Probe für das Schattenspiel",
    frage: "Wie entsteht ein Schatten?",
    schritte: ["Stelle den Regler „Lampe (Höhe)“ nacheinander auf oben, Mitte und unten und beobachte den Schatten an der Bretterwand.", "Trage jedes Mal in die Tabelle ein, wo der Schatten an der Bretterwand liegt.", "Tippe zum Schluss auf „Gegenstand“, sodass dort „entfernt“ steht, und lies die Statuszeile. Trage ein, was ohne Gegenstand passiert."]
  },
  "li6": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "schatten-groesse", seite: 155,
    kapitel: "Licht",
    name: "Wovon hängt die Größe des Schattens ab?",
    titel: "Der Wolf an der Bretterwand",
    frage: "Wovon hängt die Größe des Schattens ab?",
    schritte: ["Wähle „Bretterwand verschieben“ und stelle den Schirmabstand b nacheinander auf 30 cm, 60 cm und 90 cm ein.", "Lies nach jeder Einstellung unter dem Bild die aktuelle Schattengröße B ab und trage sie in die Tabelle ein.", "Wähle danach „Pappwolf verschieben“ und stelle den Gegenstandsabstand a auf 10 cm, trage B ein und schiebe a dann bis 40 cm – beobachte dabei die Anzeige von B."]
  },
  "li7": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "kern-halbschatten", seite: 159,
    kapitel: "Licht",
    name: "Warum hat ein Schatten manchmal einen Rand?",
    titel: "Der graue Saum",
    frage: "Warum hat ein Schatten manchmal einen grauen Rand?",
    schritte: ["Tippe auf „nur eine Taschenlampe“ (Quelle: punktförmig) und sieh dir den Rand des Schattens an der Wand ganz genau an.", "Schiebe den Regler „Größe der Lichtquelle“ langsam nach rechts, bis neben Quelle erst „klein ausgedehnt“ und dann „groß ausgedehnt“ steht, und beobachte, was am Rand erscheint.", "Vergleiche mit der Taste „zwei Lampen weit auseinander“ und lies in der Statuszeile ab, welche zwei Schattenbereiche genannt werden."]
  },
  "li8": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "lochkamera", seite: 163,
    kapitel: "Licht",
    name: "Wie malt eine Lochkamera ein Bild?",
    titel: "Die Dose mit dem Loch",
    frage: "Wie malt eine Lochkamera ein Bild?",
    schritte: ["Beobachte bei g = 40 cm, b = 30 cm und kleinem Loch den leuchtenden Pfeil und sein Bild auf dem Schirm und lies in der Statuszeile ab, wie das Bild steht.", "Schiebe zuerst die Gegenstandsweite g auf 60 cm, stelle sie zurück auf 40 cm und schiebe dann die Bildweite b (Kameralänge) auf 55 cm – vergleiche nach jedem Schritt die Bildgröße in der Statuszeile.", "Stelle die Lochgröße von klein auf groß und lies ab, was mit der Schärfe des Bildes passiert."]
  },
  "li9": {
    klasse: "5/6", schulform: "Gymnasium NRW",
    sim: "spektrum-unsichtbar", seite: 167,
    kapitel: "Licht",
    name: "Welches Licht sehen wir nicht?",
    titel: "Das Thermometer hinter dem Rot",
    frage: "Welches Licht sehen wir nicht?",
    schritte: ["Tippe auf „555 nm – Grün“ und lies in der Statuszeile ab, wie viel Prozent Erwärmung das Thermometer dort anzeigt.", "Schiebe den Regler „Stelle im Spektrum“ weiter zu „700 nm – letztes Rot“ und dann hinter den roten Rand zu „940 nm – Fernbedienung“ und vergleiche die Prozentwerte.", "Tippe zuletzt auf „365 nm – Schwarzlicht“ und lies ab, ob das Auge dort etwas sieht und womit man diese Stelle nachweisen kann."]
  },
  "op1": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "reflexionsgesetz", seite: 7,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Nach welcher Regel wird Licht am Spiegel zurückgeworfen?",
    titel: "Ein kleiner Stoß, ein weiter Sprung",
    frage: "Nach welcher Regel wird Licht am Spiegel reflektiert?",
    schritte: ["Stelle den Einfallswinkel zum Lot nacheinander auf 0°, 30°, 60° und 80° ein.", "Lies nach jeder Einstellung in der Statuszeile ab, wie groß der Reflexionswinkel ist.", "Stelle den Einfallswinkel zum Lot wieder auf 40° und schiebe den Regler „Spiegel drehen“ auf 10°; lies ab, um wie viel Grad der Strahl schwenkt."]
  },
  "op2": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "spiegelbild", seite: 11,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo steht das Bild hinter dem Spiegel?",
    titel: "Der Klebepunkt für das Spiegelbild",
    frage: "Wo steht das Bild hinter dem Spiegel?",
    schritte: ["Stelle den Abstand Gegenstand–Spiegel g nacheinander auf 40, 110 und 200 ein.", "Lies jeweils in der Statuszeile ab, wie weit das Bild hinter dem Spiegel liegt.", "Beobachte den gestrichelten Pfeil „virtuelles Bild“ und den Strahlverlauf zum Auge, während du g langsam von 40 auf 200 schiebst."]
  },
  "op3": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "brechung-eintritt", seite: 15,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum knickt der Lichtstrahl beim Eintritt ins Glas?",
    titel: "Zwei gerade Strecken, ein Knick",
    frage: "Warum wird der Lichtstrahl beim Eintritt ins Glas gebrochen?",
    schritte: ["Stelle den Winkel in der Luft nacheinander auf 20°, 40° und 60° ein und lies jeweils in der Statuszeile den Winkel im Glas ab.", "Drücke „genau auf das Lot“ und lies ab, was die Statuszeile über die Brechung meldet.", "Vergleiche die gestrichelte ungebrochene Richtung mit dem wirklichen Strahl im Glas; mit „ungebrochene Richtung“ blendest du die Linie aus und wieder ein."]
  },
  "op4": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "brechung-austritt", seite: 19,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was passiert beim Austritt aus dem Glas?",
    titel: "Vorn kommt nichts mehr an",
    frage: "Was passiert beim Austritt aus dem Glas?",
    schritte: ["Stelle den Winkel im Glas nacheinander auf 10°, 25° und 40° ein und lies jeweils in der Statuszeile den Winkel in der Luft ab.", "Schiebe den Regler langsam weiter auf 42° und lies ab, was die Statuszeile über den Grenzwinkel meldet.", "Drücke „55° – Totalreflexion“, trage 55° in die letzte Zeile ein und beobachte, wohin der Strahl an der geraden Fläche jetzt läuft."]
  },
  "op5": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "totalreflexion", seite: 23,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie hält eine Glasfaser das Licht gefangen?",
    titel: "Die Lampe mit den Glasfäden",
    frage: "Wie hält eine Glasfaser das Licht gefangen?",
    schritte: ["Stelle den Regler „Einfallswinkel an der Wand θ“ auf 20° und lies in der Statuszeile ab, was mit dem Licht passiert.", "Erhöhe den Winkel in Einserschritten von 41° auf 42° und beobachte, wann die Meldung zu „Totalreflexion!“ wechselt.", "Stelle 60° und 75° ein und verfolge den Zickzackweg des Lichts bis zur Anzeige „Licht kommt an →“."]
  },
  "op6": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sammellinse", seite: 27,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was macht eine Sammellinse mit dem Licht?",
    titel: "Zwei Gläser aus der Linsenkiste",
    frage: "Was macht eine Sammellinse mit dem Licht?",
    schritte: ["Wähle „in der Mitte dicker“ und lies in der Statuszeile ab, wo sich die Strahlen treffen.", "Stelle den Regler „Wölbung des Glases – Brennweite f“ nacheinander auf 45, 90 und 150 und beobachte, wie der Brennpunkt wandert.", "Stelle f wieder auf 90, wähle „in der Mitte dünner“ und prüfe, ob hinter diesem Glas ein heller Fleck entsteht."]
  },
  "op7": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "bild-linse", seite: 31,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo entsteht das Bild einer Linse?",
    titel: "Dieselbe Linse, zwei Bilder",
    frage: "Wo entsteht das Bild einer Linse?",
    schritte: ["Stelle den Regler „Gegenstandsweite g“ auf 199 und lies unter „Das Bild ist …“ Größe, Ausrichtung und Art des Bildes ab.", "Verkleinere g Schritt für Schritt auf 124 und dann auf 97 und lies jeweils die neue Meldung ab.", "Schiebe den Gegenstand auf g = 40, also näher als die Brennweite f = 62, und vergleiche das Bild mit vorher."]
  },
  "op8": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "auge", seite: 35,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entsteht ein scharfes Bild im Auge?",
    titel: "Die Kamera im Kopf",
    frage: "Wie entsteht ein scharfes Bild im Auge?",
    schritte: ["Schiebe den Regler „Abstand des Gegenstands“ ganz nach links auf „nah“ und beobachte die Form der Linse in der Zeichnung.", "Schiebe ihn ganz nach rechts auf „weit“ und lies in der Statuszeile ab, wie die Linse jetzt beschrieben wird.", "Stelle den Regler „Pupille (Helligkeit)“ auf „eng (dunkel)“ und danach auf „weit (hell)“ und beobachte, wie hell die Strahlen gezeichnet werden."]
  },
  "op9": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "brille", seite: 39,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie hilft eine Brille beim Scharfsehen?",
    titel: "Großvaters Brille",
    frage: "Wie hilft eine Brille beim Scharfsehen?",
    schritte: ["Wähle die Taste „kurzsichtig“ und lies in der Statuszeile ab, wo das Bild ohne Brille liegt.", "Drücke die Taste „Brille“ und beobachte, welche Linse das Bild auf die Netzhaut bringt.", "Drücke die Taste „Brille“ erneut, um sie abzusetzen, und wiederhole dann mit der Taste „weitsichtig“ beide Ablesungen: erst ohne, dann mit Brille."]
  },
  "op10": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "lupe", seite: 44,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum vergrößert eine Lupe?",
    titel: "Die kippende Lupe",
    frage: "Warum vergrößert eine Lupe?",
    schritte: ["Stelle den Regler „Abstand Gegenstand–Lupe g“ auf 10 und lies die Vergrößerung in der Statuszeile ab.", "Schiebe den Regler nacheinander auf 32, 50 und 54 und notiere jedes Mal die angezeigte Vergrößerung.", "Stelle g auf 56 oder mehr und lies ab, was die Statuszeile jetzt meldet."]
  },
  "op11": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "kamera", seite: 48,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie macht die Kamera ihr Bild?",
    titel: "Scharf durch Verschieben",
    frage: "Wie macht die Kamera ihr Bild?",
    schritte: ["Lies bei der Bildweite 90 die Statuszeile ab. Schiebe dann den Regler „Abstand Linse–Sensor (Bildweite)“ langsam nach unten, bis die Statuszeile ein scharfes Bild meldet, und stelle ihn auf 66.", "Bestimme durch Probieren die kleinste und die größte Bildweite, bei der das Bild scharf bleibt.", "Stelle die Bildweite wieder auf 66 und den Regler „Blende (Öffnung)“ erst ganz nach links, dann ganz nach rechts, und lies die Helligkeitsangabe in der Statuszeile ab."]
  },
  "op12": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "teleskop", seite: 52,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie holt ein Fernrohr Fernes heran?",
    titel: "Der Mond steht Kopf",
    frage: "Wie holt ein Fernrohr Fernes heran?",
    schritte: ["Wähle die Taste „bloßes Auge“ und beobachte im Sehfeld, wie groß der Mond erscheint und ob sein Bild aufrecht oder umgekehrt ist.", "Wechsle zur Taste „mit Teleskop“ und lies in der Statuszeile ab, wie die Vergrößerung berechnet wird.", "Vergleiche die Tasten „große Öffnung“ und „kleine Öffnung“ und achte darauf, wie hell das Mondbild ist."]
  },
  "op13": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "prisma", seite: 57,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Woraus besteht weißes Licht?",
    titel: "Farben aus farblosem Glas",
    frage: "Woraus besteht weißes Licht?",
    schritte: ["Wähle die Taste „weißes Licht“ und zähle, in wie viele Farben das Prisma den Strahl auffächert.", "Lies in der Statuszeile unter „Was passiert“ ab, was mit dem weißen Licht geschieht.", "Wähle nacheinander „nur Rot“ und „nur Blau“ und vergleiche: Wird eine einzelne Farbe weiter zerlegt, und welcher Strahl verlässt das Prisma stärker abgelenkt?"]
  },
  "op14": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "farbmischung-additiv", seite: 61,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie mischt ein Bildschirm seine Farben?",
    titel: "Winzige Pünktchen unter der Lupe",
    frage: "Wie mischt ein Bildschirm seine Farben?",
    schritte: ["Wähle die Taste „Weiß“ und lies in der Statuszeile die Ergebnisfarbe mit ihren Werten für R, G und B ab.", "Stelle mit den Reglern Rot, Grün und Blau nacheinander je zwei Farben auf 255 und die dritte auf 0 – erst Rot und Grün, dann Grün und Blau, dann Rot und Blau – und lies jede Ergebnisfarbe ab.", "Wähle die Taste „aus“ und prüfe, welche Farbe übrig bleibt, wenn keine der drei Lichtquellen leuchtet."]
  },
  "op15": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "farbmischung-subtraktiv", seite: 66,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum druckt der Drucker mit anderen Farben?",
    titel: "Die fremden Farben im Drucker",
    frage: "Warum druckt der Drucker mit anderen Farben?",
    schritte: ["Wähle die Taste „ohne Filter“ und lies in der Statuszeile die Werte für die Fläche unter allen drei Filtern ab.", "Wähle nacheinander die Tasten „Blau: C+M“, „Grün: C+Y“ und „Rot: M+Y“ und notiere für C+M und M+Y jeweils Ergebnisfarbe und Werte.", "Schiebe die drei Regler Deckkraft Cyan, Deckkraft Magenta und Deckkraft Gelb auf 100 % und lies in der Liste „Alle Teilflächen nachgerechnet“ die Zeile „alle drei“ ab."]
  },
  "op16": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "regenbogen", seite: 71,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entsteht der Regenbogen?",
    titel: "Der Bogen über dem Schulhof",
    frage: "Wie entsteht der Regenbogen?",
    schritte: ["Wähle die Taste „ein Tropfen“ und verfolge den weißen Strahl: Suche im Bild die drei Stationen 1 Brechung, 2 Reflexion und 3 Brechung + Farben.", "Lies in der Liste „Im Tropfen passiert“ ab, was an jeder der drei Stationen mit dem Licht geschieht.", "Wähle die Taste „der ganze Bogen“ und beschreibe die Lage von Sonne, Beobachter und Regen – achte auf die Zeile „Rot außen · Violett innen“."]
  },
  "wa1": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "himmelskoerper", seite: 79,
    kapitel: "Der Blick ins Weltall",
    name: "Was leuchtet da am Nachthimmel?",
    titel: "Vier Lichter über dem Schulhof",
    frage: "Was leuchtet da am Nachthimmel?",
    schritte: ["Tippe nacheinander Sonne, Stern, Mond und Planet an und lies jeweils die Statuszeile.", "Drücke die Taste Sonnenlicht abdecken und wähle erneut alle vier Himmelskörper.", "Drücke Sonnenlicht wieder freigeben und prüfe, welche Körper sofort wieder hell sind."]
  },
  "wa2": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "jahreszeiten", seite: 83,
    kapitel: "Der Blick ins Weltall",
    name: "Warum gibt es Sommer und Winter?",
    titel: "Weihnachten am Strand",
    frage: "Warum gibt es Sommer und Winter?",
    schritte: ["Drücke die Taste Sommer und lies im rechten Fenster die Zeile Licht mit Winkel und Kästchenzahl sowie die Tageslänge ab.", "Drücke nacheinander die Tasten Herbst, Winter und Frühling und trage dieselben Werte in die Tabelle ein.", "Ziehe den Regler Position im Jahr langsam von 0° bis 360° und beobachte, wie sich Lichtwinkel und Tageslänge ändern."]
  },
  "wa3": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "mondphasen", seite: 87,
    kapitel: "Der Blick ins Weltall",
    name: "Warum sieht der Mond jede Woche anders aus?",
    titel: "Die schnurgerade Kante",
    frage: "Warum sieht der Mond jede Woche anders aus?",
    schritte: ["Drücke die Taste Mond der Sonne gegenüber und lies in der Statuszeile ab, was du siehst.", "Drücke danach Mond zwischen Sonne und Erde, Mond seitlich – zunehmend und Mond seitlich – abnehmend und trage jeweils die Statuszeile ein.", "Ziehe den Regler Stellung des Mondes langsam von 0° bis 360° und beobachte im rechten Fenster, wie sich die helle Form ändert."]
  },
  "wa4": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sonnenfinsternis", seite: 91,
    kapitel: "Der Blick ins Weltall",
    name: "Wie entsteht eine Sonnenfinsternis?",
    titel: "Die Brille von 2015",
    frage: "Wie entsteht eine Sonnenfinsternis?",
    schritte: ["Lies in der Startstellung (Mondstellung 40) die Statuszeile ab.", "Drücke die Taste Ball genau in die Linie stellen (Mondstellung 0) und beobachte das Fenster Blick von der Lichtung.", "Stelle mit dem Regler die Mondstellung 16 ein und vergleiche Kernschatten und Halbschatten auf der Erdkugel."]
  },
  "wa5": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "mondfinsternis", seite: 95,
    kapitel: "Der Blick ins Weltall",
    name: "Wie entsteht eine Mondfinsternis?",
    titel: "Der rote Mond im alten Kalender",
    frage: "Wie entsteht eine Mondfinsternis?",
    schritte: ["Lass den Regler „Mondbahn neben der Schattenmitte“ zuerst auf dem Startwert 40 stehen und lies die Meldung im Statusfeld ab.", "Schiebe den Regler auf 12 und lies ab, welche Finsternis das Statusfeld jetzt meldet.", "Drücke die Taste „Ball genau hinter den Globus stellen“ (der Regler springt auf 0) und beobachte, wie der Mond beim Durchgang durch den Kernschatten kupferrot wird."]
  },
  "wa6": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sonnensystem", seite: 99,
    kapitel: "Der Blick ins Weltall",
    name: "Was unterscheidet die acht Planeten?",
    titel: "Acht Kugeln aus Styropor",
    frage: "Was unterscheidet die acht Planeten?",
    schritte: ["Wähle in der Liste „Planet wählen“ nacheinander Merkur, Erde, Jupiter und Neptun und lies im Statusfeld Durchmesser, Abstand und Umlaufzeit ab.", "Schalte auf die Ansicht „Größen“ und vergleiche die vier inneren Planeten mit den vier äußeren.", "Schalte auf „Umlauf“, stelle unter „Tempo“ die Stufe „schnell“ ein und beobachte, welche Planeten die Sonne am schnellsten umrunden."]
  },
  "wa7": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "gravitation", seite: 103,
    kapitel: "Der Blick ins Weltall",
    name: "Warum fällt alles nach unten?",
    titel: "Feder gegen Schraube",
    frage: "Warum fällt alles nach unten?",
    schritte: ["Drücke auf der Erde die Taste „Noch einmal fallen lassen“ und vergleiche, wie Stein und Feder im luftleeren und im luftgefüllten Rohr unten ankommen.", "Wechsle mit den Tasten „Mond“ und „Jupiter“ den Himmelskörper und lies im Statusfeld die Fallbeschleunigung g ab.", "Notiere für Mond, Erde und Jupiter nacheinander g und die Fallzeit aus 1,50 m Höhe aus dem Statusfeld in die Tabelle."]
  },
  "wa8": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "gravitation-abstand", seite: 107,
    kapitel: "Der Blick ins Weltall",
    name: "Wovon hängt die Stärke der Anziehung ab?",
    titel: "Tauziehen am Nachthimmel",
    frage: "Wovon hängt die Anziehungskraft ab?",
    schritte: ["Drücke „zurücksetzen“ und lies im Statusfeld den Ausgangswert der Anziehungskraft ab.", "Verdopple mit der Taste „×2 Masse links“ die linke Masse und lies den neuen Wert ab.", "Setze noch einmal zurück, schiebe den Regler „Abstand“ von 1 auf 2 und vergleiche den neuen Wert mit dem Ausgangswert. Setze zum Schluss zurück und stelle mit „×2 Masse links“ und dem Regler „Masse der rechten Kugel“ beide Massen auf 2."]
  },
  "wa9": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "planetenbahn", seite: 111,
    kapitel: "Der Blick ins Weltall",
    name: "Warum stürzen die Planeten nicht in die Sonne?",
    titel: "Die unsichtbare Schnur",
    frage: "Warum stürzen die Planeten nicht in die Sonne?",
    schritte: ["Drücke ganz klein und lies in der Statuszeile ab, was aus der Bahn wird.", "Drücke nacheinander mittlerer Wert, etwas darüber und Gegenprobe groß und notiere jedes Mal die Bahnform und ob der Planet zurückkommt.", "Schiebe den Regler Startgeschwindigkeit quer zur Sonne von 36 km/s langsam nach oben und bestimme, ab welchem Wert der Planet entkommt."]
  },
  "wa10": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "schwerelosigkeit", seite: 115,
    kapitel: "Der Blick ins Weltall",
    name: "Ist man im All wirklich schwerelos?",
    titel: "Die Waage im Aufzug",
    frage: "Ist man im All wirklich schwerelos?",
    schritte: ["Drücke steht still und lies in der Statuszeile ab, wie viel Newton die Waage bei der 60-kg-Person zeigt.", "Drücke beschleunigt nach oben und danach beschleunigt nach unten und notiere jedes Mal Beschleunigung und Anzeige der Waage.", "Drücke Seil reißt: freier Fall und vergleiche die Anzeige mit dem Wert im Stand."]
  },
  "wa11": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "entfernungen", seite: 119,
    kapitel: "Der Blick ins Weltall",
    name: "Wie weit ist ein Lichtjahr?",
    titel: "Die Karte mit den Lichtjahren",
    frage: "Wie weit ist ein Lichtjahr?",
    schritte: ["Drücke Lichtblitz senden und verfolge den Blitz von der Erde bis zum Mond; lies in der Statuszeile Entfernung und Laufzeit ab.", "Drücke weiter und arbeite dich über Sonne und nächster Stern bis zur Andromeda-Galaxie vor; notiere zu Mond, Sonne, nächstem Stern und Andromeda-Galaxie beide Angaben.", "Lies zu jedem Ziel den letzten Satz der Statuszeile ab: Er verrät, wie lange das Bild zurückliegt, das wir gerade sehen."]
  },
  "wa12": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sternparallaxe", seite: 124,
    kapitel: "Der Blick ins Weltall",
    name: "Wie misst man die Entfernung zu einem Stern?",
    titel: "Der Trick mit dem Daumen",
    frage: "Wie misst man die Entfernung zu einem Stern?",
    schritte: ["Drücke Proxima Centauri und lies in der Statuszeile den Winkel p und die Entfernung in Parsec ab.", "Wähle danach 61 Cygni und Wega und notiere jedes Mal beide Zahlen.", "Drücke Polarstern, notiere beide Zahlen und drücke danach Lupe ×100, damit der winzige Sprung im Bild wieder sichtbar wird."]
  },
  "wa13": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sternspektrum", seite: 128,
    kapitel: "Der Blick ins Weltall",
    name: "Was verrät das Licht über einen Stern?",
    titel: "Die Streifen im Sternlicht",
    frage: "Was verrät das Licht über einen Stern?",
    schritte: ["Wähle nacheinander die Quellen Stern 1 gelb, Stern 2 blau-weiß und Stern 3 rot und lies unter Beobachtung ab, wie viele dunkle Streifen im Spektrum gefunden werden.", "Blende den Vergleichsstreifen ein und lies für jeden Stern ab, wie kräftig Wasserstoff, Helium, Natrium und Eisen zu sehen sind.", "Schiebe den Regler Lupe – Wellenlänge auf 656 nm und auf 486 nm, prüfe, welches Element dort gemeldet wird, und wähle zuletzt die Glühlampe als Gegenprobe."]
  },
  "wa14": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "sternleben", seite: 133,
    kapitel: "Der Blick ins Weltall",
    name: "Wie lebt und stirbt ein Stern?",
    titel: "Ein Sternleben im Zeitraffer",
    frage: "Wie lebt und stirbt ein Stern?",
    schritte: ["Wähle die Masse 0,5 und lass den Lebenslauf einmal ganz durchlaufen, bis sich die Zeile unter Deine Tabelle füllt.", "Wiederhole das mit den Massen 1 und 10 und lies unter Messwerte jeweils Lebensdauer, Farbe, Leuchtkraft und Ende ab.", "Starte die Gegenprobe 25 und prüfe, ob die Lebensdauer noch weiter fällt oder wieder steigt."]
  },
  "wa15": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "weltbild", seite: 137,
    kapitel: "Der Blick ins Weltall",
    name: "Wer steht in der Mitte? Zwei Weltbilder",
    titel: "Die vergilbte Himmelskarte",
    frage: "Wer steht in der Mitte – die Erde oder die Sonne?",
    schritte: ["Wähle Erde in der Mitte (alt) und lies unter Welches Weltbild? ab, womit das alte Modell die Schleifen der Planeten erklärt.", "Wähle Sonne in der Mitte (heute) und zähle die Kreise, die der Mars braucht: links die Bahn samt gestricheltem Zusatzkreis, rechts nur eine Bahn.", "Beobachte den Streifen unten im Bild und achte darauf, wo die Erde gerade steht, wenn die Spur des Mars orange wird. Trage zuletzt in die erste Spalte der Tabelle nacheinander die Merkmale ein – wer in der Mitte steht, Kreise je Planet für die Schleife, richtige Vorhersage des Himmels, heute gültig – und vergleiche beide Modelle."]
  },
  "wa16": {
    klasse: 7, schulform: "Gymnasium NRW",
    sim: "rueckstoss", seite: 142,
    kapitel: "Der Blick ins Weltall",
    name: "Wie kommt eine Rakete vom Fleck?",
    titel: "Start ins Nichts",
    frage: "Wie kommt eine Rakete vom Fleck?",
    schritte: ["Stelle die ausgestoßene Gasmasse auf 20 kg und die Geschwindigkeit des Gases auf 600 m/s, drücke Gas ausstoßen und lies die Geschwindigkeit der Rakete ab.", "Verdopple die Gasmasse auf 40 kg und stelle danach 100 kg ein – lies jedes Mal neu ab.", "Stelle die Gasmasse zurück auf 20 kg, verdopple die Gasgeschwindigkeit auf 1200 m/s und vergleiche mit dem Wert bei 40 kg Gas."]
  },
  "me1": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "bewegung-beschreiben", seite: 7,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie beschreibt man eine Bewegung genau?",
    titel: "Streit auf dem Flur",
    frage: "Wie beschreibt man eine Bewegung genau?",
    schritte: ["Starte das Auto mit „Start“ und beobachte, wie in der Statuszeile Zeit t und Weg s wachsen.", "Nimm während der Fahrt mit „Momentaufnahme“ drei Wertepaare auf (Momentaufnahme 1, 2 und 3) und lies sie in der Tabelle ab. Lies am Ende der Fahrt auch t und s in der Statuszeile ab.", "Fahre nach „Zurücksetzen“ noch einmal und prüfe, ob zu gleichen Zeiten wieder gleiche Wege gehören."]
  },
  "me2": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "v-messen", seite: 11,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie misst man Geschwindigkeit?",
    titel: "Eine Zahl mit Einheit",
    frage: "Wie misst man Geschwindigkeit?",
    schritte: ["Wähle die Geschwindigkeitsstufe „langsam“ und starte die Fahrt mit „Messung starten“.", "Lies in der Statuszeile die gestoppte Zeit t und die berechnete Geschwindigkeit v ab.", "Wiederhole die Messung mit den Geschwindigkeitsstufen „mittel“ und „schnell“ und vergleiche die drei Zeiten."]
  },
  "me3": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "v-formel", seite: 15,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Strecke geteilt durch Zeit - was sagt v aus?",
    titel: "Zweimal dieselbe Zahl",
    frage: "Strecke geteilt durch Zeit – was sagt v aus?",
    schritte: ["Stelle mit den Tasten „100 m“ und „10 s“ die erste Fahrt ein und lies v in der Statuszeile ab.", "Wähle „200 m“ bei „10 s“ und danach „100 m“ bei „20 s“ und beobachte, wie sich v ändert.", "Stelle „50 m“ und „5 s“ ein und vergleiche das Ergebnis mit der ersten Fahrt."]
  },
  "me4": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "v-umrechnung", seite: 19,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie rechnet man km/h in m/s um?",
    titel: "Tempo 30 gegen Rollwagen",
    frage: "Wie rechnet man km/h in m/s um?",
    schritte: ["Stelle mit „langsamer“ und „schneller“ verschiedene Werte ein und lies beide Anzeigen in m/s und km/h ab.", "Wähle nacheinander die Beispiele „Fußgänger“, „Radfahrer“, „Auto (Stadt)“ und „ICE“ und notiere die Wertepaare.", "Prüfe in der Statuszeile die Rückrechnung: km/h geteilt durch 3,6 muss wieder den m/s-Wert ergeben."]
  },
  "me5": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "weg-zeit-diagramm", seite: 23,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was verrät das Weg-Zeit-Diagramm?",
    titel: "Die Linie, die bergauf führt",
    frage: "Was verrät das Weg-Zeit-Diagramm?",
    schritte: ["Wähle die Fahrt schnell und drücke Fahren – beobachte den Wagen auf der Fahrbahn und die Linie im Diagramm gleichzeitig.", "Drücke Zurücksetzen, wähle langsam und starte erneut mit Fahren – vergleiche die Steilheit der beiden Geraden.", "Wähle mit Pause, starte mit Fahren und lies in der Statuszeile ab, was der waagerechte Abschnitt der Linie bedeutet."]
  },
  "me6": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "beschleunigung", seite: 27,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was ist Beschleunigung?",
    titel: "Immer schneller die Rampe hinab",
    frage: "Was ist Beschleunigung?",
    schritte: ["Stelle den Regler Beschleunigung a auf 2,0 m/s² und drücke Lichtschranken-Messfahrt – die Tabelle füllt sich mit a, s, t und v. Übertrage t und v an den Marken 0,5 m, 1,0 m, 2,0 m und 4,5 m.", "Wähle in der Auswertung die Auftragung t → v und lies die Steigung der Ursprungsgeraden sowie das Ergebnis Beschleunigung a ab.", "Stelle den Regler auf 4,0 m/s², drücke erneut Lichtschranken-Messfahrt und vergleiche die Steilheit der beiden Geraden."]
  },
  "me7": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "kraft-wirkungen", seite: 31,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Woran erkennt man, dass eine Kraft wirkt?",
    titel: "Verbeult, gebremst, abgeprallt",
    frage: "Woran erkennt man, dass eine Kraft wirkt?",
    schritte: ["Wähle die Situation Fahrrad abbremsen und entscheide dich für eine der Tasten Verformen, Bewegen oder Richtung – die Anzeige verrät, ob die Zuordnung stimmt.", "Ordne die übrigen fünf Situationen zu und lies am Zähler ab, wie viele von 6 richtig sind.", "Drücke Zurücksetzen und sortiere alle sechs Situationen noch einmal, bis die Meldung Alle 6 zugeordnet – 6 richtig erscheint."]
  },
  "me8": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "masse-gewicht", seite: 35,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Ist schwer dasselbe wie viel Masse?",
    titel: "Zehn Kilo oder 98 Newton?",
    frage: "Ist schwer dasselbe wie viel Masse?",
    schritte: ["Wähle den Körper 1 kg und lies in der Statuszeile Masse und Gewichtskraft ab.", "Stelle nacheinander 100 g, 500 g, 1 kg und 2 kg ein und übertrage Waagen- und Kraftmesser-Anzeige in die Tabelle.", "Prüfe mit der eingeblendeten Formel F = m · g (g = 9,8 N/kg), ob die angezeigte Gewichtskraft jeweils zur Masse passt."]
  },
  "me9": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "ortsfaktor", seite: 39,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wäre die Kiste auf dem Mond leichter?",
    titel: "Toms Mondwunsch",
    frage: "Wäre die Kiste auf dem Mond leichter?",
    schritte: ["Wähle bei Ort die Taste Mond und lies in der Statuszeile den Ortsfaktor g und die Gewichtskraft F ab.", "Wähle danach die Orte Erde und Jupiter und lies jedes Mal g und F ab.", "Vergleiche die drei Statuszeilen: Welche Angabe bleibt an allen Orten gleich?"]
  },
  "me10": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "kraftpfeil", seite: 43,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie zeichnet man eine Kraft?",
    titel: "Der Zug in die falsche Richtung",
    frage: "Wie zeichnet man eine Kraft?",
    schritte: ["Stelle bei Betrag nacheinander 2 N, 4 N und 6 N ein und beobachte die Länge des roten Pfeils.", "Wähle bei Richtung nacheinander die Tasten →, ↑ und ↗ und lies in der Statuszeile ab, wohin der Körper gezogen würde.", "Prüfe mit der Legende im Bild, wofür Pfeil-Länge, Pfeil-Richtung und der Punkt am Pfeilanfang stehen."]
  },
  "me11": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "kraefte-addieren", seite: 47,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was passiert, wenn zwei Kräfte gleichzeitig ziehen?",
    titel: "Zweimal ziehen, zwei Ergebnisse",
    frage: "Was passiert, wenn zwei Kräfte gleichzeitig ziehen?",
    schritte: ["Lies in der Statuszeile die Gesamtkraft ab, solange F1 = 3 N und F2 = 2 N beide nach rechts zeigen.", "Drücke bei Kraft 2 die Taste Richtung und lies bei 3 N gegen 2 N die neue Gesamtkraft ab.", "Drücke bei Kraft 2 einmal die Taste + N und beobachte, was die Anzeige bei 3 N gegen 3 N meldet."]
  },
  "me12": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "kraefte-gleichgewicht", seite: 51,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wann heben sich Kräfte auf?",
    titel: "Der Scheinwerfer, der nicht fällt",
    frage: "Wann heben sich Kräfte auf?",
    schritte: ["Lies zuerst die Statuszeile bei Haltekraft 5 N ab und beobachte, ob sich die Lampe bewegt.", "Drücke zweimal die Taste + N, bis die Haltekraft 7 N beträgt, und lies die Gesamtkraft ab.", "Drücke viermal die Taste – N, lies bei Haltekraft 3 N die Gesamtkraft ab und hole die Lampe danach mit zurück in die Mitte."]
  },
  "me13": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "wechselwirkung", seite: 55,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Warum gibt es zu jeder Kraft eine Gegenkraft?",
    titel: "Der Stoß nach hinten",
    frage: "Warum gibt es zu jeder Kraft eine Gegenkraft?",
    schritte: ["Wähle das Beispiel Eisläufer, drücke Abstoßen und lies in der Statuszeile für Läufer A und Läufer B jeweils m und v ab.", "Wechsle zum Beispiel Boot, drücke wieder Abstoßen und vergleiche die Geschwindigkeiten von Boot und Person.", "Wähle das Beispiel Rakete und prüfe in der Statuszeile, wievielmal so schnell das Gas mit der kleineren Masse gegenüber der Rakete wird."]
  },
  "me14": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "reibung", seite: 59,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wann stört Reibung - und wann rettet sie?",
    titel: "Der gebohnerte Streifen",
    frage: "Wann stört Reibung – und wann rettet sie?",
    schritte: ["Lass den Wagen bei μ = 0,30 mit der Antriebskraft F = 80 N anfahren und lies im Bild die Reibungskraft F_R sowie den Verlauf im v-t-Diagramm ab.", "Schiebe die Antriebskraft F auf 0 N und verfolge im v-t-Diagramm, wie v bis auf 0,0 m/s sinkt.", "Stelle den Reibungskoeffizienten μ auf 0, gib erneut Antriebskraft F = 80 N und schiebe sie wieder auf F = 0 N – beobachte, was v jetzt macht."]
  },
  "me15": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "hebel", seite: 63,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie hebelt man das Zehnfache?",
    titel: "Die lange Eisenstange",
    frage: "Wie hebelt man das Zehnfache?",
    schritte: ["Stelle die Last F₂ auf 200 N, drücke gleich lang – nichts gespart (l₁ = 0,25 m) und lies unter Nachgerechnet die Kraft F₁ und den Kraftweg s₁ ab.", "Stelle danach den Kraftarm l₁ auf 1,00 m, drücke zuletzt achtfach – ein Achtel der Kraft (l₁ = 2,00 m) und notiere jeweils F₁ und s₁.", "Vergleiche in jeder Einstellung die beiden Arbeiten W₁ und W₂ unter Und jetzt beide Arbeiten."]
  },
  "me16": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "flaschenzug", seite: 67,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie hebt ein Flaschenzug die schwere Box?",
    titel: "Acht Meter Seil für zwei Meter Höhe",
    frage: "Wie hebt ein Flaschenzug die schwere Box?",
    schritte: ["Stelle die Last auf 600 N, wähle n = 1 · volle Kraft und lies unter Nachgerechnet die Kraft F und den Weg s ab.", "Schiebe den Regler Tragende Seilstücke auf 2, 3 und 4, zähle die grün nummerierten Seilstücke im Bild mit und notiere jedes Mal F und s.", "Vergleiche für jede Einstellung die Hubarbeit und die Zugarbeit unter Die Arbeit bleibt gleich."]
  },
  "me17": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "schiefe-ebene", seite: 71,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was spart die Rampe wirklich?",
    titel: "Halbe Kraft, doppelter Weg",
    frage: "Was spart die Rampe wirklich?",
    schritte: ["Wähle bei „Rampe:“ die Einstellung flach und lies unter „Zugkraft und Weg“ die Zugkraft F und den Weg ab.", "Stelle danach mittel und steil ein und trage Zugkraft, Weg und Kraft × Weg jeweils in die Tabelle ein.", "Vergleiche jede Zugkraft mit dem roten Pfeil „senkrecht“ mit 6 N rechts im Bild."]
  },
  "me18": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "energieformen", seite: 75,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Welche Formen hat Energie?",
    titel: "Brot, Tee und Batterie",
    frage: "Welche Formen hat Energie?",
    schritte: ["Wähle die gespannte Sprungfeder und lies ab, wie viel Energie sie speichert und wie hoch sie den 10-kg-Sack hebt.", "Stelle nacheinander Kiste auf dem Regal, volle AA-Batterie und Butterbrot ein und trage Energie und Hubhöhe in die Tabelle ein.", "Prüfe mit rollender Fußball und Tasse heißer Tee, wo beide auf der Skala zwischen 1 cm und 10 km landen – sie springt je Stufe auf das Zehnfache."]
  },
  "me19": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "lageenergie", seite: 80,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wie berechnet man Lageenergie?",
    titel: "Hoch gehoben, tief geschlagen",
    frage: "Wie berechnet man Lageenergie?",
    schritte: ["Stelle mit den Reglern Masse m auf 5 kg und Höhe h auf 3 m, drücke „Fallen lassen“ und lies Lageenergie und Einschlagtiefe des Pfahls ab.", "Drücke ×2 Masse, lass den Klotz erneut fallen und notiere, wie sich Lageenergie und Pfahltiefe ändern.", "Wähle zurücksetzen, drücke ×2 Höhe, lass den Klotz wieder fallen und vergleiche: Wirkt die doppelte Höhe genauso stark wie die doppelte Masse?"]
  },
  "me20": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "bewegungsenergie", seite: 84,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Wohin geht die Energie beim Rollen und Federn?",
    titel: "Die entwischte Rollbox",
    frage: "Wohin geht die Energie beim Rollen?",
    schritte: ["Drücke „Rollen lassen“ und lies in der Statuszeile ab, welche Energie E die Kugel mit 4 kg und 4 m/s hat und wie weit sie den Klotz schiebt.", "Drücke „×2 Masse“, lass die Kugel mit „Rollen lassen“ erneut los und trage Energie und Schiebestrecke in die Tabelle ein.", "Stelle mit „zurücksetzen“ den Anfang wieder her, drücke „×2 v“ und dann „Rollen lassen“ – vergleiche die neue Schiebestrecke mit den beiden ersten."]
  },
  "me21": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "energieerhaltung", seite: 88,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Geht Energie verloren?",
    titel: "Der müde Ball",
    frage: "Geht Energie verloren?",
    schritte: ["Beobachte den Ball bei „Höhe h“ = 20 m und „Masse m“ = 2 kg, notiere Höhe und E_pot beim Start und lies im Infofeld ab, wie E_pot beim Fallen ab- und E_kin zunimmt.", "Notiere die Summe E_pot + E_kin an einem Punkt während des Flugs und vergleiche sie mit den 392 J vom Start.", "Miss mit der gestrichelten Linie „letzte Sprunghöhe“ und der Angabe „Sprunghöhe“ im Infofeld, wie hoch der Ball nach dem ersten und dem zweiten Aufprall noch kommt, und trage die Werte in die Tabelle ein."]
  },
  "me22": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "leistung", seite: 92,
    kapitel: "Bewegung, Kraft und Energie",
    name: "Was sagt die Leistung über die Arbeit?",
    titel: "Endspurt mit dem Rollwagen",
    frage: "Was sagt die Leistung über die Arbeit?",
    schritte: ["Beobachte bei „Kraft F“ = 100 N und „Wirkungsgrad η“ = 80 % im Infofeld, wie die Leistung P mitwächst, während das Auto schneller wird, und lies P einmal kurz nach dem Start und einmal später im Lauf ab.", "Lies jeweils im selben Augenblick unter dem grünen Balken den Wert P_nutz ab und trage beide Werte in die Tabelle ein.", "Stelle „Wirkungsgrad η“ auf 50 %, lies P und P_nutz ab und prüfe, welcher Anteil von P jetzt noch als P_nutz übrig bleibt."]
  },
  "da1": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "dichte", seite: 99,
    kapitel: "Druck und Auftrieb",
    name: "Warum ist Styropor leicht und Stahl schwer?",
    titel: "Der leichte Riese",
    frage: "Warum ist Styropor leicht und Stahl schwer?",
    schritte: ["Stelle den Regler Kantenlänge a auf 10 cm und wähle nacheinander die Sprungmarken Eisen · 10 cm, Wasser · genau 1 kg, Fichtenholz · 10 cm und Styropor · 10 cm.", "Lies unter Nachgerechnet jeweils die Masse m und die Gewichtskraft G ab und trage beide in die Tabelle ein.", "Wähle zuletzt den Stoff Blei und vergleiche seine Masse mit der des gleich großen Styroporwürfels."]
  },
  "da2": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "druck-flaeche", seite: 103,
    kapitel: "Druck und Auftrieb",
    name: "Warum trägt der Schnee den Ski, aber nicht den Stiefel?",
    titel: "Löcher im Rasen",
    frage: "Warum trägt der Schnee den Ski, aber nicht den Stiefel?",
    schritte: ["Wähle die Marke Turnschuhe und lies unter Nachgerechnet die Gewichtskraft F und den Druck p ab.", "Verkleinere die Auflagefläche mit dem Regler auf 1 cm² (wie bei der Marke Stöckelabsatz), ohne die Masse zu verändern, und beobachte, wie der Körper im Bild einsinkt.", "Wähle danach die Marken Skier und Elefant und trage alle Werte in die Tabelle ein."]
  },
  "da3": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "schweredruck", seite: 107,
    kapitel: "Druck und Auftrieb",
    name: "Warum drückt das Wasser unten stärker?",
    titel: "Die Beule in der Beckenwand",
    frage: "Warum drückt das Wasser unten stärker?",
    schritte: ["Stelle in Wasser mit dem Regler Tiefe nacheinander 10 m, 20 m und 40 m ein und lies unter Nachgerechnet jeweils den Schweredruck und den Gesamtdruck ab.", "Drücke die Taste 0 m – Oberfläche und vergleiche den Gesamtdruck dort mit dem Gesamtdruck in 10 m Tiefe.", "Drücke die Taste 10 m – doppelter Druck, wechsle die Flüssigkeit zu Öl und zu Quecksilber, lies bei Quecksilber beide Drücke ab und beobachte die aufsteigenden Blasen."]
  },
  "da4": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "luftdruck-hoehe", seite: 112,
    kapitel: "Druck und Auftrieb",
    name: "Wie schwer ist die Luft über uns?",
    titel: "Ein Schulbus aus Luft",
    frage: "Wie schwer ist die Luft über uns?",
    schritte: ["Drücke die Taste Meereshöhe · 0 m und lies unter Nachgerechnet den Druck und den Anteil vom Bodendruck ab.", "Drücke nacheinander die Tasten Zugspitze · 2962 m, Mont Blanc · 4810 m und halber Druck · 5538 m und trage die Werte ein.", "Schiebe den Regler Höhe h langsam bis 9000 m und verfolge, wie der rote Punkt auf der Kurve p(h) wandert."]
  },
  "da5": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "auftrieb", seite: 116,
    kapitel: "Druck und Auftrieb",
    name: "Woher kommt der Auftrieb?",
    titel: "Der Anker, der leichter wird",
    frage: "Woher kommt der Auftrieb?",
    schritte: ["Drücke in Süßwasser die Taste massiv – sinkt (Hohlraum 0 %) und lies unter Nachgerechnet die Gewichtskraft G und den Auftrieb F_A ab.", "Stelle den Regler Hohlraum im Würfel auf 50 % und vergleiche: Wie ändert sich G, wie ändert sich F_A?", "Drücke wieder die Taste massiv – sinkt, wechsle zur Taste Meerwasser und lies G und F_A erneut ab."]
  },
  "da6": {
    klasse: 8, schulform: "Gymnasium NRW",
    sim: "auftrieb", seite: 120,
    kapitel: "Druck und Auftrieb",
    name: "Steigen, schweben, sinken - was entscheidet?",
    titel: "Ein Prozent entscheidet",
    frage: "Steigen, schweben, sinken – was entscheidet?",
    schritte: ["Drücke in Süßwasser nacheinander die Tasten 87 % – sinkt noch und 88 % – schwimmt gerade und lies unter Nachgerechnet jeweils die mittlere Dichte ab.", "Drücke die Taste 90 % – Schiff und lies die mittlere Dichte und den Anteil des Würfels unter Wasser in Prozent ab.", "Stelle den Regler Hohlraum im Würfel zurück auf 87 %, wechsle zur Taste Meerwasser und beobachte, ob der Würfel jetzt schwimmt."]
  },
  "la1": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "ladungen-kraft", seite: 6,
    kapitel: "Ladungen und Felder",
    name: "Wann ziehen sich Ladungen an, wann stoßen sie sich ab?",
    titel: "Wenn die Folie knistert",
    frage: "Wann ziehen sich Ladungen an, wann stoßen sie sich ab?",
    schritte: ["Wähle die Marke „plus und minus“ und lies unter „Was wirkt hier?“ ab, ob sich die Kugeln anziehen und wie groß die Kraft in µN ist.", "Wähle bei gleichem Abstand die Marke „beide plus“ und vergleiche Richtung und Betrag der Kraft.", "Wähle wieder die Marke „plus und minus“ und stelle die Ladung je Kugel auf 4 nC und danach auf 18 nC; lies jedes Mal ab, ohne den Abstand zu ändern."]
  },
  "la2": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "elektroskop", seite: 10,
    kapitel: "Ladungen und Felder",
    name: "Wie macht ein Elektroskop Ladung sichtbar?",
    titel: "Der Zeiger, der stehen bleibt",
    frage: "Wie macht ein Elektroskop Ladung sichtbar?",
    schritte: ["Wähle die Marke „Nur nähern – Influenz“ und lies unter „Nachgerechnet“ Influenz-Anteil, Ladung Q und Zeigerwinkel α ab.", "Wähle die Marke „Berührt, Stab wieder weg“ und vergleiche, welche Ladung jetzt auf dem Elektroskop sitzt und wie groß α ist.", "Wähle die Marke „Volle Ladung, ganz nah“ und lies den größten Zeigerwinkel ab."]
  },
  "la3": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "efeld", seite: 14,
    kapitel: "Ladungen und Felder",
    name: "Was liegt um eine Ladung herum?",
    titel: "Kraft im leeren Raum",
    frage: "Was liegt um eine Ladung herum?",
    schritte: ["Stelle den Regler „Spannung U“ auf 100 V und „Plattenabstand d“ auf 10 cm und lies die Feldstärke E im Infofeld ab.", "Verdopple „Spannung U“ auf 200 V; stelle danach – wieder bei 100 V – „Plattenabstand d“ auf 5 cm und lies E jeweils neu ab.", "Setze mit einem Tipp auf die Animation eine positive Probeladung zwischen die Platten und beobachte, wohin der rote Kraftpfeil zeigt."]
  },
  "la4": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "blitz", seite: 18,
    kapitel: "Ladungen und Felder",
    name: "Wie entsteht ein Blitz?",
    titel: "Wenn die Luft nicht mehr aushält",
    frage: "Wie entsteht ein Blitz?",
    schritte: ["Schiebe den Regler „Feld zwischen Wolke und Boden“ langsam höher und lies ab, bei welcher Feldstärke die Luft leitend wird.", "Vergleiche mit den Tasten „knapp darunter“ und „knapp darüber“, ob der Kanal zündet.", "Stelle mit „Entfernung des Gewitters“ nacheinander 1 km, 3 km und 6 km ein und lies bei „Was gerade passiert“ die Zeit bis zum Donner ab."]
  },
  "la5": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "spannung", seite: 22,
    kapitel: "Ladungen und Felder",
    name: "Was ist Spannung wirklich?",
    titel: "Was das Voltmeter anzeigt",
    frage: "Was ist Spannung wirklich?",
    schritte: ["Setze mit der Taste „1 Energiequelle (1,5 V)“ eine einzelne Energiequelle ein und lies die Spannung am Voltmeter ab.", "Schalte über „2 Energiequellen (3 V)“ und „3 Energiequellen (4,5 V)“ weiter und vergleiche jedes Mal, wie hell die Lampe wird.", "Drücke „Zurücksetzen“ und beschreibe, wie der Antrieb der Quelle mit der Zahl der Energiequellen zusammenhängt."]
  },
  "la6": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "elektronen-drift", seite: 26,
    kapitel: "Ladungen und Felder",
    name: "Warum leitet Metall und Gummi nicht?",
    titel: "Was im Draht wirklich wandert",
    frage: "Warum leitet Metall, und Gummi nicht?",
    schritte: ["Wähle nacheinander die Tasten „Handy-Ladegerät“, „Leselampe“ und „Wasserkocher“ und lies bei „Nachgerechnet“ die Driftgeschwindigkeit v ab.", "Stelle mit dem Regler „Stromstärke“ größere Werte ein und beobachte, wie sich v verändert.", "Vergrößere mit dem Regler „Querschnitt des Drahtes“ die Fläche und vergleiche, ob die Elektronen dann schneller oder langsamer wandern."]
  },
  "wi1": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "stromstaerke", seite: 33,
    kapitel: "Stromkreise und Widerstand",
    name: "Wie viel fließt da eigentlich?",
    titel: "Der erste Blick aufs Amperemeter",
    frage: "Wie viel fließt da eigentlich durch den Scheinwerfer?",
    schritte: ["Stelle den Strom nacheinander auf schwach, mittel und stark und lies jedes Mal die Stromstärke am Amperemeter ab.", "Vergleiche, wie hell die Lampe bei den drei Stufen leuchtet.", "Drücke auf Schalter: geschlossen, sodass er offen steht, und lies die Stromstärke erneut ab."]
  },
  "wi2": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "widerstand", seite: 37,
    kapitel: "Stromkreise und Widerstand",
    name: "Was bremst den Strom?",
    titel: "Drei Bauteile am selben Kabel",
    frage: "Was bremst den Strom in der Leitung?",
    schritte: ["Wähle nacheinander die Bauteile kleiner Widerstand, mittel und großer Widerstand aus.", "Lies bei jedem Bauteil den Widerstand R und die Stromstärke I aus der Statuszeile ab.", "Prüfe an einem Bauteil mit R = U/I, ob der Wert aus der Statuszeile herauskommt."]
  },
  "wi3": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "ohmsches-gesetz", seite: 41,
    kapitel: "Stromkreise und Widerstand",
    name: "Wann gilt das Ohmsche Gesetz?",
    titel: "Wenn der Widerstand gleich bleibt",
    frage: "Wann gilt das Ohmsche Gesetz U = R · I?",
    schritte: ["Stelle den Regler Widerstand R fest auf 100 Ω ein.", "Stelle den Regler Spannung U nacheinander auf 6 V, 12 V und 24 V und lies jedes Mal die Stromstärke I ab.", "Vergleiche, um welchen Faktor die Stromstärke wächst, wenn du die Spannung verdoppelst."]
  },
  "wi4": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "ohm-kennlinie", seite: 45,
    kapitel: "Stromkreise und Widerstand",
    name: "Was verrät die Kennlinie?",
    titel: "Punkt für Punkt eine Gerade",
    frage: "Was verrät die U-I-Kennlinie über den Widerstand?",
    schritte: ["Wähle den Widerstand 10 Ω und stelle mit weniger und mehr die Spannung ein.", "Setze für 1,5 V, 3 V, 4,5 V und 6 V je einen Messpunkt und lies die Wertetabelle mit U, I und R = U/I ab.", "Betrachte die aufgetragenen Punkte und beschreibe die Form der Kennlinie."]
  },
  "wi5": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "draht", seite: 49,
    kapitel: "Stromkreise und Widerstand",
    name: "Lang, dünn oder woraus? Der Draht entscheidet",
    titel: "Der Draht hinter dem Scheinwerfer",
    frage: "Lang, dünn oder aus welchem Material – wovon hängt der Widerstand eines Drahtes ab?",
    schritte: ["Stelle Länge kurz, Dicke dick und Material Kupfer ein und lies Widerstand und Stromstärke ab.", "Drücke lang, dann wieder kurz und danach dünn und beobachte, wie sich der Widerstand jeweils verändert.", "Stelle wieder dick ein, wechsle das Material zu Eisen und danach zu Konstantan und vergleiche die drei Widerstände."]
  },
  "wi6": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "reihe-widerstand", seite: 53,
    kapitel: "Stromkreise und Widerstand",
    name: "Hintereinander wird es weniger",
    titel: "Zwei Widerstände hintereinander",
    frage: "Wie ändert sich der Gesamtwiderstand, wenn zwei Bauteile in Reihe liegen?",
    schritte: ["Stelle R₁ auf 10 Ω und R₂ auf 20 Ω und lies Gesamtwiderstand und Stromstärke ab.", "Ändere R₂ auf 30 Ω und beobachte, wie sich Gesamtwiderstand und Stromstärke verändern.", "Stelle R₁ und R₂ beide auf 30 Ω und vergleiche die Stromstärke mit dem Anfangswert."]
  },
  "wi7": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "parallel-widerstand", seite: 57,
    kapitel: "Stromkreise und Widerstand",
    name: "Nebeneinander wird es mehr",
    titel: "Zwei Kanäle nebeneinander",
    frage: "Was passiert mit dem Strom, wenn zwei Widerstände parallel im Stromkreis liegen?",
    schritte: ["Stelle R₁ auf 10 Ω und R₂ auf 20 Ω und lies Gesamtstrom und Gesamtwiderstand ab.", "Stelle R₁ und R₂ beide auf 10 Ω und beobachte, wie sich der Gesamtstrom ändert.", "Stelle R₁ und R₂ beide auf 30 Ω. Vergleiche jedes Mal den Gesamtwiderstand mit dem kleinsten Einzelwiderstand in der Statuszeile."]
  },
  "wi8": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "potentiometer", seite: 61,
    kapitel: "Stromkreise und Widerstand",
    name: "Der Regler am Pult",
    titel: "Der Regler am Pult",
    frage: "Was verändert der Drehregler am Mischpult im Stromkreis der Lampe?",
    schritte: ["Drücke mehrmals „weniger Widerstand“, bis der Reglerwiderstand 0 Ω anzeigt, und lies Stromstärke und Helligkeit ab.", "Drücke mehrmals „mehr Widerstand“, bis der Regler zuerst 23 Ω und danach 45 Ω zeigt, und lies jedes Mal Stromstärke und Helligkeit ab.", "Vergleiche zu drei Reglerstellungen die Stromstärke und die Helligkeit in der Statuszeile."]
  },
  "ep1": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "elektrische-energie", seite: 68,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Wie viel Energie steckt im Abend?",
    titel: "Was der Abend frisst",
    frage: "Wie viel Energie setzen die Geräte an einem Abend um?",
    schritte: ["Wähle nacheinander die Geräte LED 10 W, TV 100 W und Wasserkocher 2000 W und lies im Feld Umgesetzte Energie den Wert für E ab.", "Stelle bei der LED 10 W die Zeit von 1 h auf 10 h und beobachte, wie sich E in Wattstunden verändert.", "Vergleiche die LED 10 W bei 10 h mit dem TV 100 W bei 1 h und lies beide Male E in Wattstunden ab; lies danach E auch für TV 100 W und Wasserkocher 2000 W jeweils bei 3 h ab."]
  },
  "ep2": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "elektrische-leistung", seite: 72,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Was sagt die Wattzahl?",
    titel: "Zwei Zahlen ergeben ein Watt",
    frage: "Was sagt die Wattzahl?",
    schritte: ["Stelle den Verbraucher auf mittel und schalte die Spannung nacheinander auf 1,5 V, 3 V und 6 V; lies jedes Mal I und P ab.", "Stelle nun 3 V fest ein und wechsle den Verbraucher von wenig Strom über mittel zu viel Strom.", "Vergleiche, bei welcher Einstellung die Leistung P am größten ist, und notiere U und I dazu."]
  },
  "ep3": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "stromkosten", seite: 76,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Was kostet eine Kilowattstunde Konzert?",
    titel: "Die Rechnung nach dem Applaus",
    frage: "Was kostet eine Kilowattstunde Konzert?",
    schritte: ["Wähle den TV 100 W und stelle die tägliche Laufzeit von 1 h über 3 h und 8 h auf 24 h; lies jeweils die Kosten pro Jahr ab.", "Wähle die LED 10 W bei 8 h, dann den Kühlschrank 150 W bei 24 h und danach den Wasserkocher 2000 W bei 1 h und vergleiche die Jahreskosten.", "Notiere im Feld Energie & Kosten für jedes Gerät die Energie in kWh pro Tag und die Kosten pro Jahr."]
  },
  "ep4": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: "stromgefahren", seite: 80,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Ab wann wird Strom für den Körper gefährlich?",
    titel: "Eine Dose, zu viele Geräte",
    frage: "Ab wann wird der Strom gefährlich – und was schaltet ihn ab?",
    schritte: ["Die Simulation startet mit 1 Gerät. Schließe dann mit Gerät anschließen ein Gerät nach dem anderen an und lies bei 1, 2, 3 und 5 Geräten im Feld Strom & Sicherung die Gesamtstromstärke I in Ampere ab.", "Beobachte, bei welchem Gerät die Stromstärke die Sicherungsgrenze von 16 A überschreitet und die Sicherung auslöst.", "Entferne mit Gerät entfernen so lange Geräte, bis der Strom wieder sicher fließt, und setze danach mit Sicherung zurücksetzen den Kreis zurück."]
  },
  "ep5": {
    klasse: 9, schulform: "Gymnasium NRW",
    sim: null, seite: 85,
    kapitel: "Energie, Leistung, Sicherheit",
    name: "Wie ist das Haus verkabelt?",
    titel: "Hinter dem Sicherungskasten",
    frage: "Wie ist das Haus verkabelt?",
    schritte: ["Lies im Datenblatt die Spalte typische Absicherung für Lichtstromkreis, Steckdosen-Stromkreis, Herd-Stromkreis und FI-Schutzschalter ab und ordne die vier Zeilen nach ihrem Auslösewert.", "Vergleiche den Lichtstromkreis mit dem Steckdosen-Stromkreis und notiere, welcher Leitungsquerschnitt zu welcher Sicherung gehört.", "Sieh am Sicherungskasten zu Hause nach, welche Zahlen auf den Schaltern stehen, und suche den FI-Schutzschalter mit 30 mA."]
  },
  "kp1": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "atombau-isotope", seite: 7,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Woraus besteht ein Atomkern?",
    titel: "Die Zahl hinter dem Namen",
    frage: "Woraus besteht ein Atomkern – und was macht ihn zu genau diesem Element?",
    schritte: ["Drücke „Kohlenstoff-12“ und lies im Statusfeld Protonen, Neutronen und Massenzahl ab.", "Drücke „Kohlenstoff-14“ und vergleiche Massenzahl und Stabilität mit Kohlenstoff-12. Drücke danach nacheinander „Chlor-35“ und „Kalium-40“ und lies dieselben Werte ab.", "Ziehe den Regler „Neutronen im Kern“ von 6 auf 8 und dann den Regler „Protonen im Kern“ auf 7 – achte darauf, wann der Elementname wechselt."]
  },
  "kp2": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "radioaktivitaet", seite: 12,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Alpha, Beta, Gamma - was strahlt da?",
    titel: "Halb so viel bis nächste Woche",
    frage: "Wie stark strahlt ein Präparat – und warum wird das mit der Zeit weniger?",
    schritte: ["Stelle den Regler „Halbwertszeit T½“ auf 5 s und den Regler „Anfangskerne N₀“ auf 80 ×100; lies im weißen Kästchen T½ und λ ab.", "Beobachte, wie im linken Bild die 200 roten Punkte nach und nach grau werden und die rote Kurve N(t) im Diagramm fällt; lies dabei N und die Aktivität A ab.", "Ziehe die Halbwertszeit T½ auf 10 s und danach auf 20 s und vergleiche, wie sich λ und der Verlauf der Kurve ändern."]
  },
  "kp3": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "geiger-mueller", seite: 16,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie zählt man Strahlung?",
    titel: "Wenn der Zähler nicht mehr mitkommt",
    frage: "Wie weist man unsichtbare Strahlung nach?",
    schritte: ["Wähle die Karte „4 · Totzeit & wahre Zählrate“ und stelle die wahre Zählrate auf 2000 /s und die Totzeit τ auf 100 µs.", "Lies in der Rechnung die gemessene Rate Z_mess, den Verlust in Prozent und die zurückkorrigierte Rate Z_kor ab.", "Ziehe die wahre Zählrate erst auf 5000 /s, dann auf 9000 /s und beobachte, wie stark der Verlust jetzt wächst."]
  },
  "kp4": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "ionisation", seite: 20,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Was richtet Strahlung in Materie an?",
    titel: "Die unsichtbare Spur im Gewebe",
    frage: "Was richtet Strahlung in Materie an, wenn sie hindurchgeht?",
    schritte: ["Drücke „α Alpha“ und lies im Statusfeld Energie, Reichweite und die Ionenpaare je Millimeter ab.", "Drücke danach „β Beta“ und „γ Gamma“ und vergleiche jeweils Reichweite und Ionisationsdichte.", "Lies zu jeder Strahlungsart den Wichtungsfaktor ab, mit dem der Strahlenschutz rechnet."]
  },
  "kp5": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "absorption-strahlung", seite: 24,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Was hält Strahlung auf?",
    titel: "Drei Strahlen, drei Schilde",
    frage: "Was hält Strahlung auf?",
    schritte: ["Wähle die Strahlungsart α-Strahlung und den Absorber Papier und lies bei der Dicke d = 6,0 mm ab, wie viel Prozent der Strahlung durchkommen.", "Stelle nacheinander β-Strahlung mit Aluminium und γ-Strahlung mit Blei ein und lies jeweils bei d = 6,0 mm den Prozentwert ab.", "Schiebe bei γ-Strahlung und Blei den Regler Dicke d von 6,0 mm auf 12,0 mm und beobachte, wie sich der Prozentwert ändert."]
  },
  "kp6": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "zerfall-halbwertszeit", seite: 28,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wann ist die Hälfte zerfallen?",
    titel: "Der Kern ohne Uhr",
    frage: "Wann ist die Hälfte zerfallen?",
    schritte: ["Drücke die Schaltfläche „Radon-220“ und lies in der Statuszeile ab, wie viele der 200 Kerne noch da sind und wie lang die Halbwertszeit ist.", "Drücke dreimal „eine Halbwertszeit weiter“ und notiere nach jedem Schritt die übrige Zahl neben der Angabe „Erwartet hätte man …“.", "Setze mit „Zurücksetzen“ zurück, wähle Kohlenstoff-14 und vergleiche dessen Halbwertszeit mit der von Radon-220."]
  },
  "kp7": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "zerfallsreihe", seite: 32,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wohin zerfällt Uran?",
    titel: "Warum im Uran das Blei steckt",
    frage: "Wohin zerfällt Uran?",
    schritte: ["Lies im Startbild in der Statuszeile für Uran-238 ab, wie viele Neutronen auf ein Proton kommen und welche Strahlung als Erstes ausgesendet wird.", "Drücke zweimal „nächster Zerfall“ und vergleiche nach jedem Zerfall Massenzahl A und Kernladungszahl Z mit den Werten davor.", "Drücke „bis zum Ende“ und lies ab, bei welchem Kern die Reihe stoppt und aus wie vielen Alpha- und Betazerfällen sie besteht."]
  },
  "kp8": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "roentgen-charakteristisch", seite: 36,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie entsteht Röntgenlicht?",
    titel: "Zwei Linien und eine Grenze",
    frage: "Wie entsteht Röntgenlicht?",
    schritte: ["Wähle als Anodenmaterial Molybdän und stelle die Beschleunigungsspannung U_A (am Bildschirm: „Beschleunigung U_A“) auf 25 kV. Lies die Grenzwellenlänge und die Wellenlängen der Linien Kα und Kβ ab.", "Schiebe U_A zwischen 15 kV und 40 kV hin und her und achte darauf, wie die Grenzwellenlänge wandert, während Kα und Kβ ihren Platz behalten und unter 20 kV ganz verschwinden. Stelle danach 40 kV ein und lies die Grenzwellenlänge und die Wellenlänge der Kα-Linie ab.", "Stelle wieder 25 kV ein, wechsle das Anodenmaterial auf Kupfer und vergleiche, wohin die Linien Kα und Kβ dabei springen."]
  },
  "kp9": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "lorentzkraft", seite: 41,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Was lenkt geladene Teilchen ab?",
    titel: "Der Halbkreis im Magnetfeld",
    frage: "Was lenkt geladene Teilchen ab?",
    schritte: ["Stelle die Geschwindigkeit v auf 5 und die Feldstärke B auf 5 und lies im Feld „Nachgerechnet“ den Bahnradius r ab.", "Stelle nacheinander v = 2, B = 8 und v = 9, B = 1 ein und beobachte, wie sich der abgelesene Radius r jeweils verändert.", "Stelle wieder v = 5 und B = 5 ein, drücke „Ladung − (negativ)“ und vergleiche, wie sich der Umlaufsinn gegenüber der positiven Ladung dreht."]
  },
  "kp10": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "kernspaltung", seite: 45,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie zerlegt man einen Kern?",
    titel: "Ein langsames Neutron genügt",
    frage: "Wie zerlegt man einen Kern?",
    schritte: ["Drücke „Spaltung noch einmal“ und verfolge, wie das langsame Neutron den Urankern trifft und ihn spaltet.", "Vergleiche im Feld rechts die Summe der Kernbausteine und die Summe der Protonen links und rechts vom Pfeil.", "Wähle nacheinander die Spaltwege „Barium + Krypton“, „Xenon + Strontium“ und „Cäsium + Rubidium“ und lies den Massenunterschied Δm und die frei werdende Energie E ab."]
  },
  "kp11": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "kettenreaktion", seite: 49,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie hält man die Kettenreaktion im Zaum?",
    titel: "Der Regler mit dem Namen k",
    frage: "Wie hält man die Kettenreaktion im Zaum?",
    schritte: ["Stelle den Regler Steuerstäbe eingefahren auf 20 % und lies in der Statuszeile den Vermehrungsfaktor k und die Lage ab.", "Fahre die Steuerstäbe danach auf 50 % und dann auf 80 % ein; notiere jedes Mal k und ob dort unterkritisch, kritisch oder überkritisch steht.", "Drücke bei jeder Einstellung mehrmals nächste Generation und beobachte, ob die Zahl der Spaltungen wächst, gleich bleibt oder abnimmt."]
  },
  "kp12": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "kernfusion", seite: 53,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wovon lebt die Sonne?",
    titel: "Ein Feuer, das leichter wird",
    frage: "Wovon lebt die Sonne?",
    schritte: ["Stelle den Regler Temperatur auf 5 Millionen °C und lies in der Statuszeile ab, ob überhaupt etwas passiert.", "Erhöhe die Temperatur schrittweise bis 10 Millionen °C und finde heraus, ab welchem Wert die Anzeige von „Es passiert nichts“ auf „Es zündet“ umspringt.", "Stelle 15 Millionen °C ein und lies die Massenbilanz sowie die Energie je Kernbaustein ab. Stelle zum Schluss 25 Millionen °C ein und lies ab, ob es zündet."]
  },
  "kp13": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "strahlenschutz", seite: 58,
    kapitel: "Strahlung aus dem Atomkern",
    name: "Wie viel Dosis ist zu viel?",
    titel: "Abstand schlägt Blei",
    frage: "Wie viel Dosis ist zu viel – und wie hält man sie klein?",
    schritte: ["Stelle Abstand 100 cm, Blei dazwischen 0 mm und Aufenthaltsdauer 20 Minuten ein und lies die Dosis in der Statuszeile ab.", "Verdopple nur den Abstand auf 200 cm und beobachte, auf welchen Teil die Dosisleistung sinkt.", "Gehe zurück auf 100 cm und schiebe nur den Regler Blei dazwischen auf 7 mm; lies die Halbwertsdicken und den übrig bleibenden Anteil ab. Stelle das Blei danach wieder auf 0 mm, halbiere die Aufenthaltsdauer auf 10 Minuten und lies die Dosis ab."]
  },
  "eg1": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "oersted", seite: 67,
    kapitel: "Strom für alle",
    name: "Was entdeckte Ørsted neben dem Kompass?",
    titel: "Der Kompass in der Leitwarte",
    frage: "Was entdeckte Ørsted, als neben dem Kompass ein Draht Strom führte?",
    schritte: ["Drücke den Knopf Strom ausschalten, beobachte, wohin die Nadel zeigt, und schalte den Strom wieder ein.", "Stelle den Regler Stromstärke auf 3,0 A und Abstand Draht – Nadel auf 2,0 cm und lies in der Statuszeile das Drahtfeld und den Ausschlag ab.", "Drücke umpolen und danach Nadel unter den Draht und vergleiche jeweils, zu welcher Seite die Nadel ausschlägt."]
  },
  "eg2": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "leiterkraft", seite: 71,
    kapitel: "Strom für alle",
    name: "Warum zuckt der Draht im Magnetfeld?",
    titel: "Der Stab zwischen den Polen",
    frage: "Warum wirkt eine Kraft auf einen Draht, sobald Strom durch ihn fließt und er im Magnetfeld hängt?",
    schritte: ["Stelle mit den Reglern die Stromstärke I auf 5,0 A und das Magnetfeld B auf 0,20 T ein und lies Betrag und Richtung der Kraft F in der Statuszeile ab.", "Ziehe den Regler Stromstärke I erst auf 0 A und dann auf 10,0 A und vergleiche jeweils die Kraft.", "Drücke Strom umpolen, danach zusätzlich Magnet umdrehen und beobachte, wohin der Stab jeweils gedrückt wird."]
  },
  "eg3": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "elektromotor", seite: 76,
    kapitel: "Strom für alle",
    name: "Wie dreht sich der Elektromotor?",
    titel: "Aus Kraft wird eine Drehung",
    frage: "Wie wird aus Strom eine Drehbewegung?",
    schritte: ["Sieh dem laufenden Motor mit 20 Windungen, 2,0 A und 0,20 T zu und lies das Drehmoment in der Statuszeile ab.", "Drücke den Knopf Kommutator ist AN, bis Kommutator ist AUS erscheint, drücke zurücksetzen und beobachte, was die Spule jetzt macht.", "Schalte den Kommutator wieder ein und stelle die Windungen der Spule von 20 auf 40; stelle danach die Windungen wieder auf 20 und die Stromstärke I von 2,0 auf 4,0 A."]
  },
  "eg4": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "induktion", seite: 81,
    kapitel: "Strom für alle",
    name: "Wie macht Bewegung Spannung?",
    titel: "Der Magnet, der vorbeifährt",
    frage: "Wie erzeugt die Bewegung eines Magneten eine Spannung?",
    schritte: ["Stelle die Magnet-Geschwindigkeit v auf 5 m/s und verfolge im violetten Diagramm U_ind, während der Magnet die Spule passiert.", "Schiebe die Magnet-Geschwindigkeit v von 5 auf 10 m/s und vergleiche die Höhe des Ausschlags.", "Stelle v wieder auf 5 m/s und die Windungszahl N von 10 auf 20 und beobachte, wie hoch der Ausschlag nun wird. Lies zuletzt U_ind ab, während der Magnet weit von der Spule entfernt ist."]
  },
  "eg5": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "generator", seite: 85,
    kapitel: "Strom für alle",
    name: "Wie erzeugt der Generator Strom?",
    titel: "Strom aus einer Drehung",
    frage: "Wie erzeugt der Generator fortlaufend Spannung?",
    schritte: ["Stelle die Drehfrequenz f auf 2,0 Hz und lies unter Scheitelwert Û und Effektivwert die beiden Spannungswerte ab.", "Ziehe den Regler Windungen n über 4000, 8000 und 12000 und beobachte, wie der Scheitelwert Û proportional wächst.", "Beobachte am Oszilloskop die Spannung U in den beiden Extremlagen: Spulenfläche senkrecht zum Feld und Spule auf der Kante."]
  },
  "eg6": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "wechselstrom", seite: 89,
    kapitel: "Strom für alle",
    name: "Warum wechselt der Strom die Richtung?",
    titel: "Fünfzigmal in der Sekunde",
    frage: "Warum wechselt der Strom ständig die Richtung – und was leistet er trotzdem?",
    schritte: ["Stelle die Frequenz f auf 50 Hz und verfolge, wie die Sinuskurve U(t) über und unter die Nulllinie läuft.", "Lies den Wert U_eff = U_max/√2 ab, der als orange Linie im Diagramm eingezeichnet ist.", "Stelle U_max nacheinander auf 250 V, 325 V und 400 V und beobachte, wie sich U_eff verändert."]
  },
  "eg7": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "transformator", seite: 93,
    kapitel: "Strom für alle",
    name: "Wie verwandelt der Trafo die Spannung?",
    titel: "Zwei Spulen, ein Eisenkern",
    frage: "Wie verwandelt der Transformator eine Spannung in eine höhere oder niedrigere?",
    schritte: ["Stelle die Primärspannung U₁ auf 230 V und das Windungsverhältnis N₁/N₂ auf 1,0.", "Ziehe das Windungsverhältnis N₁/N₂ auf 2,0 und lies oben rechts im Bild die Sekundärspannung U₂ und den Sekundärstrom I₂ ab.", "Stelle das Windungsverhältnis N₁/N₂ auf 0,5 und vergleiche U₂ und I₂ mit den vorigen Werten."]
  },
  "eg8": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "freileitungen", seite: 97,
    kapitel: "Strom für alle",
    name: "Warum hängen die Leitungen so hoch - und führen Hochspannung?",
    titel: "380 000 Volt in der Leitwarte",
    frage: "Warum führen die Leitungen Hochspannung?",
    schritte: ["Öffne den Reiter „2 · Warum Hochspannung?“ und stelle die Übertragungsspannung U auf 20 V.", "Verdopple die Übertragungsspannung schrittweise auf 40 V und dann auf 80 V.", "Lies bei jeder Spannung den Leitungsstrom I = P/U und die Verlustleistung P_Verlust = R·I² ab."]
  },
  "eg9": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "wirkungsgrad", seite: 101,
    kapitel: "Strom für alle",
    name: "Wie gut ist ein Energiewandler?",
    titel: "Fünf Prozent Licht, der Rest ist warm",
    frage: "Wie gut ist ein Energiewandler?",
    schritte: ["Stelle die eingesetzte Energie (am Bildschirm: „hineingesteckte Energie“) auf 1000 J ein.", "Wähle nacheinander die Geräte Glühlampe, LED-Lampe, Benzinmotor und Elektromotor.", "Lies im Statusfeld jeweils den Wirkungsgrad η, die Nutzenergie (am Bildschirm: „davon Licht“ bzw. „davon Bewegung“) und die als Wärme verlorene Energie ab."]
  },
  "eg10": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "energie-entwerten", seite: 105,
    kapitel: "Strom für alle",
    name: "Warum wird Energie entwertet?",
    titel: "Am Ende bleibt lauwarme Luft",
    frage: "Warum wird Energie entwertet?",
    schritte: ["Wähle die Kette „Kohle → Licht“.", "Drücke „nächster Schritt“, bis alle vier Schritte (Schritt 1 bis Schritt 4) durchlaufen sind.", "Lies nach jedem Schritt ab, wie viel Energie weiter nutzbar ist und wie viel als Wärme abgegeben wurde."]
  },
  "eg11": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: null, seite: 109,
    kapitel: "Strom für alle",
    name: "Welches Kraftwerk für welche Aufgabe?",
    titel: "Kein Kraftwerk kann alles",
    frage: "Welches Kraftwerk für welche Aufgabe?",
    schritte: ["Lies die Kopfzeile des Datenblatts und kläre für jede der drei Spalten, was dort angegeben wird. Gehe dann die Zeilen Kohlekraftwerk, Kernkraftwerk, Windpark und Solarpark der Reihe nach durch.", "Vergleiche die Spalte „Regelbarkeit“ und markiere die Kraftwerke, die sich schnell hoch- und herunterfahren lassen.", "Vergleiche zum Schluss „Brennstoff und Nebenwirkung“ und ordne die vier Zeilen nach ihrer Eignung für eine ständige Grundlast."]
  },
  "eg12": {
    klasse: 10, schulform: "Gymnasium NRW",
    sim: "energiesparen", seite: 114,
    kapitel: "Strom für alle",
    name: "Wie speichert man Strom für die Nacht?",
    titel: "Die billigste Kilowattstunde",
    frage: "Wie senkt ein Haushalt seinen Bedarf an elektrischer Energie?",
    schritte: ["Wähle die Maßnahme „Glühlampe→LED“.", "Wechsle danach zu „Standby aus“ und schließlich zu „Kühlschrank“.", "Lies bei jeder Maßnahme unter „Ersparnis pro Jahr“ den Energiebedarf vorher und nachher sowie die Ersparnis in Kilowattstunden und Euro ab."]
  },
  "fo1": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "licht-oberflaeche", seite: 7,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Was macht eine Oberfläche mit Licht?",
    titel: "Zwei Kisten ohne Beschriftung",
    frage: "Was macht eine Oberfläche mit dem Licht, das auf sie trifft?",
    schritte: ["Wähle den Spiegel und lies die drei Zahlen in der Statuszeile ab.", "Wähle danach Fensterglas, schwarzes Papier und weißes Papier.", "Trage die Oberfläche und die drei Zahlen in die Tabelle ein.", "Berechne für jede Zeile die Summe."]
  },
  "fo2": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "reflexionsgesetz", seite: 11,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie reflektiert der Spiegel Licht?",
    titel: "Der Spiegel",
    frage: "Wie hängen Einfallswinkel und Reflexionswinkel zusammen?",
    schritte: ["Stelle den Regler „Spiegel drehen“ auf 0°. Lass ihn dort.", "Stelle den Einfallswinkel zum Lot auf 0°. Lies die Statuszeile.", "Trage beide Winkel in die Tabelle ein.", "Stelle den Einfallswinkel nacheinander auf 20°, 40° und 80° ein und ergänze die Tabelle."]
  },
  "fo3": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "brechung-eintritt", seite: 15,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Warum wird Licht am Glas gebrochen?",
    titel: "Der halbrunde Glasklotz",
    frage: "Wohin wird der Lichtstrahl gebrochen, wenn er ins Glas eintritt?",
    schritte: ["Drücke „↓ genau auf das Lot“ (0°) und trage die erste Zeile ein.", "Stelle 40° ein, lies den Winkel im Glas ab und trage beide Winkel ein.", "Stelle 75° ein und ergänze die letzte Zeile der Tabelle.", "Vergleiche: Ist der Winkel im Glas größer oder kleiner als in der Luft?"]
  },
  "fo4": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "brechung-austritt", seite: 19,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wann kommt Licht nicht mehr heraus?",
    titel: "Wenn Licht nicht mehr herauskommt",
    frage: "Wann tritt Licht aus dem Glas aus – und wann nicht mehr?",
    schritte: ["Stelle den Winkel im Glas auf 0°. Lies beide Winkel ab.", "Stelle danach 20° ein, dann 25°. Lies jedes Mal beide Winkel ab.", "Drücke den Knopf „55° – Totalreflexion“ und lies die Meldung.", "Trage ein, bei welchen Winkeln Licht austritt."]
  },
  "fo5": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "sammellinse", seite: 23,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Welches Glas bündelt das Licht?",
    titel: "Zwei geschliffene Gläser",
    frage: "Welches Glas bündelt paralleles Licht – und welches nicht?",
    schritte: ["Wähle „in der Mitte dicker“ und lies die Statuszeile.", "Trage die erste Zeile der Tabelle ein.", "Wähle „in der Mitte dünner“ und lies die Statuszeile.", "Ergänze die zweite Zeile der Tabelle."]
  },
  "fo6": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "bild-linse", seite: 27,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wo entsteht das Bild der Linse?",
    titel: "Das Bild der Linse und die Lupe",
    frage: "Wovon hängt es ab, wie das Bild der Linse aussieht?",
    schritte: ["Stelle am Regler die Gegenstandsweite g (Abstand vom Gegenstand zur Linse) auf 190. Lies die Statuszeile.", "Stelle 100 ein und vergleiche Größe und Lage des Bildes.", "Stelle 25 ein – näher als die Brennweite f = 62.", "Trage jedes Mal ein, wie das Bild aussieht."]
  },
  "fo7": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "auge", seite: 31,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie entsteht ein Bild im Auge?",
    titel: "Das aufklappbare Augenmodell",
    frage: "Wo entsteht das Bild im Auge – und wie bleibt es scharf?",
    schritte: ["Schiebe den Regler „Abstand des Gegenstands“ ganz nach rechts (Abstand weit) und lies die Statuszeile.", "Schiebe ihn ganz nach links (Abstand nah) und vergleiche die Wölbung der Linse.", "Schiebe ihn wieder ganz nach rechts. Bewege dann den Regler „Pupille“ ganz nach links (Pupille eng) und ganz nach rechts (Pupille weit).", "Trage deine Beobachtungen in die Tabelle ein."]
  },
  "fo8": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "brille", seite: 35,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie hilft eine Brille?",
    titel: "Zwei Brillen ohne Etikett",
    frage: "Welche Linse hilft dem kurzsichtigen Auge, welche dem weitsichtigen?",
    schritte: ["Wähle „kurzsichtig“ und lies die Meldung ohne Brille ab.", "Drücke „Brille“ und lies die neue Meldung mit Brille ab.", "Drücke „Brille“ noch einmal, dann ist die Brille wieder ab.", "Wähle „weitsichtig“ und lies die Meldung ohne Brille ab. Drücke dann „Brille“ und lies die Meldung mit Brille ab."]
  },
  "fo9": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "lochkamera", seite: 39,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie macht die Lochkamera ein Bild?",
    titel: "Die Pappkiste mit dem Nadelloch",
    frage: "Wie sieht das Bild aus, das ein kleines Loch auf den Schirm wirft?",
    schritte: ["Stelle „Gegenstandsweite g“ auf 40 cm. Sie bleibt so.", "Stelle die Bildweite b (Kameralänge) auf 29 cm, 39 cm und 51 cm. Die „Lochgröße“ bleibt klein. Lies jedes Mal die Statuszeile.", "Schiebe „Lochgröße“ ganz nach rechts: Loch groß. Die Bildweite b bleibt 51 cm. Lies den Satz unter den Reglern.", "Trage alle vier Zeilen in die Tabelle ein."]
  },
  "fo10": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "prisma", seite: 43,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Woraus besteht weißes Licht?",
    titel: "Der Glaskeil in der Schublade",
    frage: "Macht das Prisma die Farben – oder stecken sie schon im weißen Licht?",
    schritte: ["Wähle weißes Licht und lies die Meldung in der Statuszeile.", "Trage in die Tabelle ein, was hinter dem Prisma erscheint.", "Wähle nur Rot. Beobachte, ob das Licht noch zerlegt wird.", "Vergleiche mit nur Blau und ergänze die letzte Zeile."]
  },
  "fo11": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "farbmischung-additiv", seite: 47,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Wie macht der Bildschirm Farben?",
    titel: "Die Lupe auf dem Bildschirm",
    frage: "Wie entsteht Weiß, wenn dort nur Rot, Grün und Blau leuchten?",
    schritte: ["Lies gleich nach dem Öffnen (Ausgangszustand) in der Statuszeile die Ergebnisfarbe und die drei Zahlen ab.", "Drücke unter dem Bild den Knopf „aus“. Notiere alle drei Werte.", "Drücke unter dem Bild den Knopf „Gelb“. Notiere die Werte.", "Schiebe den Regler „Blau“ auf 255. Schreibe „Weiß“ in die erste Spalte und fülle die Zeile aus."]
  },
  "fo12": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "spektrum-unsichtbar", seite: 51,
    kapitel: "Sehen, spiegeln, brechen",
    name: "Welches Licht sehen wir nicht?",
    titel: "Das Thermometer mit der schwarzen Kugel",
    frage: "Kommt hinter dem letzten Rot noch etwas an, das wir nicht sehen?",
    schritte: ["Drücke „555 nm – Grün“. Lies ab: Sieht das Auge etwas? Wie groß ist die Erwärmung?", "Drücke „700 nm – letztes Rot“. Lies beide Angaben ab.", "Drücke „940 nm – Fernbedienung“. Lies beide Angaben ab.", "Trage alle drei Zeilen in die Tabelle ein."]
  },
  "fw1": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "himmelskoerper", seite: 58,
    kapitel: "Der Blick ins Weltall",
    name: "Was leuchtet am Nachthimmel?",
    titel: "Ein Karton voller Sternkarten",
    frage: "Welche Himmelskörper leuchten selbst – und welche werden beleuchtet?",
    schritte: ["Wähle nacheinander Sonne, Stern, Mond und Planet. Lies jede Statuszeile.", "Trage jeden Himmelskörper ein. Leuchtet er selbst?", "Drücke „Sonnenlicht abdecken“ und wähle wieder Sonne, Stern, Mond und Planet.", "Ergänze: Wer ist jetzt dunkel, wer leuchtet weiter?"]
  },
  "fw2": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "tag-nacht", seite: 62,
    kapitel: "Der Blick ins Weltall",
    name: "Warum wird es Tag und Nacht?",
    titel: "Der staubige Globus",
    frage: "Wovon hängt es ab, ob es gerade Tag oder Nacht ist?",
    schritte: ["Drücke „Pause“, damit der Globus stehen bleibt.", "Stelle den Regler „Erde von Hand drehen“ auf 0°. Lies ab: Wer hat Tag?", "Stelle 180° ein und vergleiche.", "Ergänze die letzte Zeile nach einer vollen Drehung."]
  },
  "fw3": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "gravitation", seite: 66,
    kapitel: "Der Blick ins Weltall",
    name: "Warum fällt alles nach unten?",
    titel: "Warum alles nach unten fällt",
    frage: "Fallen Stein und Feder gleich schnell, wenn keine Luft da ist?",
    schritte: ["Drücke „Noch einmal fallen lassen“. Beobachte beide Rohre.", "Wähle den Mond und lies die Fallbeschleunigung g und die Fallzeit ab. g zeigt, wie stark der Mond anzieht.", "Wähle Erde und Jupiter und ergänze die Tabelle.", "Vergleiche: Wo fällt der Stein am schnellsten?"]
  },
  "fw4": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "planetenbahn", seite: 70,
    kapitel: "Der Blick ins Weltall",
    name: "Warum stürzen Planeten nicht ab?",
    titel: "Warum Planeten nicht abstürzen",
    frage: "Warum stürzt ein Planet nicht in die Sonne?",
    schritte: ["Drücke „ganz klein“. Lies die Startgeschwindigkeit ab: So schnell startet der Planet. Lies auch die Bahnform ab.", "Drücke „mittlerer Wert“ und vergleiche.", "Drücke „Gegenprobe groß“ und lies die Meldung.", "Trage alle drei Zeilen in die Tabelle ein."]
  },
  "fw5": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "sonnensystem", seite: 74,
    kapitel: "Der Blick ins Weltall",
    name: "Wie unterscheiden sich die Planeten?",
    titel: "Acht gleich große Kugeln",
    frage: "Was unterscheidet die inneren Planeten von den äußeren?",
    schritte: ["Drücke „Steckbrief“ und lies für die Erde Art und Durchmesser ab.", "Drücke „Größen“ und vergleiche die acht Planeten.", "Drücke „Umlauf“ und „sehr schnell“. Wer umrundet die Sonne öfter: innen oder außen?", "Trage deine Beobachtungen in die Tabelle ein."]
  },
  "fw6": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "entfernungen", seite: 78,
    kapitel: "Der Blick ins Weltall",
    name: "Wie groß ist das Sonnensystem?",
    titel: "Ein Wort auf der Rückseite",
    frage: "Wie lange ist das Licht von fernen Himmelskörpern zu uns unterwegs?",
    schritte: ["Drücke „Lichtblitz senden“ und beobachte den Weg zum Mond.", "Lies Entfernung und Zeit in der Statuszeile ab.", "Drücke „weiter ▶“ und lies die Werte für die Sonne ab.", "Gehe mit „weiter ▶“ bis zum nächsten Stern und trage ein."]
  },
  "fw7": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "teleskop", seite: 82,
    kapitel: "Der Blick ins Weltall",
    name: "Was macht das Fernrohr mit dem Bild?",
    titel: "Zwei Linsen und ein Rohr",
    frage: "Wie verändert das Fernrohr Größe, Lage und Helligkeit des Bildes?",
    schritte: ["Drücke „bloßes Auge“. Achte auf die Größe und die gelbe Marke.", "Drücke „mit Teleskop“ und lies die Vergrößerung ab.", "Vergleiche „große Öffnung“ und „◦ kleine Öffnung“: Achte nur auf die Helligkeit.", "Trage alle drei Zeilen in die Tabelle ein."]
  },
  "fw8": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "sternparallaxe", seite: 86,
    kapitel: "Der Blick ins Weltall",
    name: "Wie weit ist ein Stern entfernt?",
    titel: "Kein Maßband bis zum Stern",
    frage: "Wie hängt der gemessene Winkel mit der Entfernung zusammen?",
    schritte: ["Drücke „Proxima Centauri“ und lies den Winkel p und die Entfernung in Lichtjahren ab.", "Vergleiche mit „61 Cygni“ und „Wega“. Trage alle Werte ein.", "Wähle „Polarstern“ und drücke „Lupe ×100“, um den winzigen Sprung zu sehen.", "Vergleiche: Wie ändert sich der Winkel mit der Entfernung?"]
  },
  "fw9": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "sternleben", seite: 90,
    kapitel: "Der Blick ins Weltall",
    name: "Wie lange leuchtet ein Stern?",
    titel: "Die Randnotiz auf der Sternkarte",
    frage: "Lebt ein Stern mit großer Masse länger als einer mit kleiner Masse?",
    schritte: ["Drücke „1“ und sieh den ganzen Lebenslauf durch.", "Lies die Lebensdauer ab und trage sie ein.", "Drücke „10“ und vergleiche.", "Prüfe mit „Gegenprobe 25“: Lebt er noch kürzer?"]
  },
  "fw10": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "milchstrasse", seite: 94,
    kapitel: "Der Blick ins Weltall",
    name: "Wo stehen wir in der Milchstraße?",
    titel: "Das blasse Band",
    frage: "Steht die Sonne in der Mitte der Milchstraße?",
    schritte: ["Drücke nacheinander „zur Mitte“, „nach außen“ und „quer heraus“.", "Lies jedes Mal die Sterne im Blickfeld ab und trage ein.", "Drücke „Gegenprobe: Sonne in die Mitte“ und lies die Meldung.", "Vergleiche: Passt die Gegenprobe zu unserem Himmel?"]
  },
  "fw11": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "weltbild", seite: 98,
    kapitel: "Der Blick ins Weltall",
    name: "Wer steht in der Mitte?",
    titel: "Zwei Weltbilder",
    frage: "Welches Weltbild erklärt den Himmel ohne Zusatzkreise?",
    schritte: ["Drücke „Erde in der Mitte (alt)“ und lies die Statuszeile.", "Drücke „Sonne in der Mitte (heute)“ und vergleiche.", "Beobachte unten den Streifen: Wie läuft der Mars von der Erde aus?", "Trage beide Zeilen in die Tabelle ein."]
  },
  "fw12": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "schwarzes-loch", seite: 102,
    kapitel: "Der Blick ins Weltall",
    name: "Wie findet man ein schwarzes Loch?",
    titel: "Ein Kreis um ein leeres Feld",
    frage: "Woran erkennt man ein schwarzes Loch, wenn es nicht leuchtet?",
    schritte: ["Drücke „weit weg“ und dann „Lichtstrahl senden“.", "Lies die Statuszeile ab und trage ein.", "Wiederhole mit „mittel“ und „sehr nah“.", "Vergleiche die drei Wege im Bild."]
  },
  "fw13": {
    klasse: 7, schulform: "Gesamtschule NRW · Förderheft",
    sim: "urknall", seite: 106,
    kapitel: "Der Blick ins Weltall",
    name: "Wie hat sich das Weltall seit dem Urknall verändert?",
    titel: "Woher kommt alles?",
    frage: "Wie hat sich das Weltall seit dem Urknall verändert?",
    schritte: ["Drücke „zum Anfang“ und lies Zeitanzeige und Statuszeile.", "Drücke „▶ Urknall starten“ und beobachte die Galaxien in der Mitte und am Ende des Ablaufs.", "Vergleiche das Bild am Anfang mit dem Bild am Ende.", "Trage alle Zeilen in die Tabelle ein."]
  },
  "fs1": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "ladung", seite: 7,
    kapitel: "Strom in der Werkstatt",
    name: "Wie wirken Ladungen aufeinander?",
    titel: "Das Knistern im Pullover",
    frage: "Wann ziehen sich zwei geladene Kugeln an und wann stoßen sie sich ab?",
    schritte: ["Öffne die Simulation und lies am Anfang die Statuszeile.", "Drücke bei Kugel A und bei Kugel B den Knopf „− negativ“.", "Lies die Statuszeile noch einmal und trage die zweite Zeile ein.", "Vergleiche die zwei Zeilen: Wann ziehen sich die Kugeln an?"]
  },
  "fs3": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "spannung", seite: 11,
    kapitel: "Strom in der Werkstatt",
    name: "Was sagt die Spannung der Energiequelle?",
    titel: "Die Spannung an der Energiequelle",
    frage: "Was ändert sich am Voltmeter und an der Lampe, wenn du mehr Energiequellen einsetzt?",
    schritte: ["Drücke „1 Energiequelle (1,5 V)“ und lies die Spannung U am Voltmeter ab.", "Lies in der Statuszeile, wie hell die Lampe leuchtet.", "Drücke „2 Energiequellen (3 V)“ und trage die zweite Zeile ein.", "Drücke „3 Energiequellen (4,5 V)“ und trage die dritte Zeile ein."]
  },
  "fs4": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "stromstaerke", seite: 15,
    kapitel: "Strom in der Werkstatt",
    name: "Wie viel Strom fließt?",
    titel: "Wie viel fließt da?",
    frage: "Wie groß ist die Stromstärke – und wann fließt gar nichts mehr?",
    schritte: ["Drücke „Strom schwach“ und dann „mittel“. Trage jedes Mal die Stromstärke I in die Tabelle ein.", "Drücke „stark“ und trage die Stromstärke I ein.", "Drücke den Knopf „Schalter: geschlossen“. Damit öffnest du den Stromkreis.", "Lies die Stromstärke ab und fülle die letzte Zeile aus."]
  },
  "fs5": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "messen", seite: 19,
    kapitel: "Strom in der Werkstatt",
    name: "Wohin kommt das Messgerät?",
    titel: "Zwei Messgeräte auf der Werkbank",
    frage: "Wohin gehört das Amperemeter, wohin das Voltmeter?",
    schritte: ["Drücke den Knopf „Amperemeter“ und lies die Statuszeile.", "Drücke „Voltmeter“ und dann „in Reihe“. Beobachte die Lampe.", "Wähle danach für das Voltmeter „parallel“, nicht die Quiz-Antwort „Parallel zum Bauteil“.", "Trage in die Tabelle ein: das Gerät, wie es eingebaut ist und was die Statuszeile meldet."]
  },
  "fs6": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "widerstand", seite: 23,
    kapitel: "Strom in der Werkstatt",
    name: "Großer Widerstand, kleiner Strom",
    titel: "Was bremst den Strom?",
    frage: "Warum fließt bei 4,5 Volt durch jedes Bauteil ein anderer Strom?",
    schritte: ["Drücke „mittel“, dann „kleiner Widerstand“. Lies jedes Mal die Statuszeile.", "Trage jeweils den Knopf, den Widerstand R und die Stromstärke I in die Tabelle ein.", "Drücke „großer Widerstand“ und trage den Knopf und die beiden Werte ein.", "Vergleiche die drei Zeilen: Wo fließt der meiste Strom?"]
  },
  "fs7": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "draht", seite: 27,
    kapitel: "Strom in der Werkstatt",
    name: "Wovon hängt der Widerstand ab?",
    titel: "Der lange dünne Draht",
    frage: "Wovon hängt es ab, wie groß der Widerstand eines Drahtes ist?",
    schritte: ["Lies die Statuszeile beim Start: „Kupfer, kurz, dick“. Trage den Draht, den Widerstand R und die Stromstärke I ein.", "Drücke „lang“, dann „dünn“. Trage nach jedem Knopf den Draht, R und I in die nächste Zeile ein.", "Drücke „Eisen“. Trage den Draht und beide Werte in die letzte Zeile ein.", "Vergleiche die vier Zeilen: Wo ist der Widerstand am größten?"]
  },
  "fs8": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "ohm-kennlinie", seite: 31,
    kapitel: "Strom in der Werkstatt",
    name: "Doppelte Spannung, doppelter Strom",
    titel: "Was macht doppelte Spannung?",
    frage: "Fließt bei doppelter Spannung auch doppelt so viel Strom?",
    schritte: ["Drücke „20 Ω“ und dann einmal „◀ weniger“. Trage 20 Ω, Spannung U und Stromstärke I in Zeile 1 ein.", "Drücke einmal „mehr ▶“. Trage 20 Ω, Spannung U und Stromstärke I in Zeile 2 ein.", "Drücke „10 Ω“. Trage 10 Ω und die beiden neuen Werte in Zeile 3 ein.", "Vergleiche Zeile 1 und Zeile 2: Wie ändert sich die Stromstärke?"]
  },
  "fs9": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "reihe-widerstand", seite: 35,
    kapitel: "Strom in der Werkstatt",
    name: "Zwei Widerstände in einer Reihe",
    titel: "Was passiert hintereinander?",
    frage: "Was macht ein zweiter Widerstand in der Reihe mit dem Strom?",
    schritte: ["Drücke in der oberen Reihe „10 Ω“ und in der unteren „20 Ω“. Jetzt steht R₁ auf 10 Ω und R₂ auf 20 Ω. Trage alles in Zeile 1 ein. Vor der oberen Knopfreihe steht „R₁:“, vor der unteren „R₂:“.", "Drücke bei R₁ auf 20 Ω. R₂ bleibt auf 20 Ω. Lies R_ges und die Stromstärke I ab und trage Zeile 2 ein.", "Drücke bei R₁ auf 30 Ω und bei R₂ auf 30 Ω. Trage Zeile 3 ein.", "Vergleiche die drei Zeilen. Wird der Strom größer oder kleiner?"]
  },
  "fs10": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "parallel-widerstand", seite: 39,
    kapitel: "Strom in der Werkstatt",
    name: "Zwei Wege für den Strom",
    titel: "Was passiert nebeneinander?",
    frage: "Wie groß ist der Strom insgesamt, wenn er zwei Wege hat?",
    schritte: ["Drücke bei R₁ auf 10 Ω und bei R₂ auf 20 Ω. Vor der oberen Knopfreihe steht „R₁:“, vor der unteren „R₂:“.", "Lies I₁, I₂ und den Gesamtstrom I in der Statuszeile ab. Trage alles in die erste Tabellenzeile ein.", "Drücke bei R₁ auf 30 Ω. R₂ bleibt auf 20 Ω. Trage die zweite Tabellenzeile ein.", "Drücke danach bei R₂ auf 10 Ω. R₁ bleibt auf 30 Ω. Trage die letzte Tabellenzeile ein."]
  },
  "fs11": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "elektronen-drift", seite: 43,
    kapitel: "Strom in der Werkstatt",
    name: "Langsames Wandern, schnelles Signal",
    titel: "Warum geht das Licht sofort an?",
    frage: "Müssen die Elektronen schnell durch das Kabel fahren, damit die Lampe sofort leuchtet?",
    schritte: ["Drücke „Leselampe“ und sieh dir das Bild vom Kupferdraht an.", "Lies im Bild die Werte für Wandern, ungeordnete Bewegung und Signal ab.", "Trage die drei Wörter und ihre Werte in dieser Reihenfolge in die Tabelle ein.", "Lies in der Statuszeile, wie lange ein Elektron für einen Meter Kabel braucht."]
  },
  "fs12": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "blitz", seite: 47,
    kapitel: "Strom in der Werkstatt",
    name: "Warum kommt der Donner später?",
    titel: "Blitz und Donner",
    frage: "Warum hören wir den Donner erst nach dem Blitz?",
    schritte: ["Stelle den Regler „Entfernung des Gewitters“ auf 1,0 km.", "Lies unter „4 · Der Donner kommt hinterher“ ab, wie lange der Donner braucht.", "Stelle den Regler danach auf 2,0 km und zuletzt auf 3,0 km.", "Trage jede Entfernung, die Zeit für den Donner und die Zeit für das Licht in die Tabelle ein."]
  },
  "fs13": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "stromgefahren", seite: 51,
    kapitel: "Strom in der Werkstatt",
    name: "Wann schaltet die Sicherung ab?",
    titel: "Zu viel an einer Steckdose",
    frage: "Wann unterbricht die Sicherung den Stromkreis?",
    schritte: ["Beginne mit 1 Gerät. Die Sicherung erlaubt 16 A. Lies die Stromstärke ab (am Bildschirm: „Strom“) und trage Zeile 1 ein.", "Drücke „Gerät anschließen“: Jetzt sind es 2 Geräte. Lies die Stromstärke ab und trage Zeile 2 ein.", "Drücke „Gerät anschließen“ noch einmal: Jetzt sind es 3 Geräte. Lies die Meldung und trage Zeile 3 ein.", "Achte auf den Warnhinweis: Nie mit der Netzspannung (230 V) experimentieren – nur mit ungefährlicher Kleinspannung!"]
  },
  "fb1": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "v-begriff", seite: 58,
    kapitel: "Wie schnell ist schnell?",
    name: "Wer ist schneller?",
    titel: "Das Wettrennen am Bildschirm",
    frage: "Woran erkennst du, welches der zwei Autos schneller ist?",
    schritte: ["Drücke den Knopf „Rennen starten“ und beobachte die zwei Autos.", "Lies die Statuszeile unter „Wer ist schneller?“. Auto A steht auf mittel, Auto B auf schnell. Trage Zeile 1 ein.", "Drücke bei Auto A den Knopf „schnell“ und dann „Rennen starten“. Auto B bleibt auf schnell. Trage Zeile 2 ein.", "Drücke bei Auto B den Knopf „langsam“ und dann „Rennen starten“. Auto A bleibt auf schnell. Trage Zeile 3 ein."]
  },
  "fb2": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "v-messen", seite: 62,
    kapitel: "Wie schnell ist schnell?",
    name: "Wie misst und rechnet man die Geschwindigkeit?",
    titel: "Messen und ausrechnen",
    frage: "Wie rechnest du aus Strecke und Zeit die Geschwindigkeit aus?",
    schritte: ["Drücke den Knopf langsam und danach den Knopf „Messung starten“.", "Lies die Zeit t im Bild ab. Trage die erste Zeile ein.", "Drücke mittel und dann „Messung starten“. Trage die zweite Zeile ein.", "Drücke schnell und dann „Messung starten“. Ergänze die letzte Zeile."]
  },
  "fb3": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "v-umrechnung", seite: 66,
    kapitel: "Wie schnell ist schnell?",
    name: "Von m/s zu km/h – mal 3,6",
    titel: "km/h oder m/s?",
    frage: "Wie rechnest du einen Wert von m/s in km/h um?",
    schritte: ["Lies zuerst die Statuszeile ab. Dort steht die Rechnung mit 3,6.", "Drücke „Fußgänger“. Trage beide Zahlen in Zeile 1 ein.", "Drücke „Radfahrer“. Trage beide Zahlen in Zeile 2 ein.", "Drücke „Auto (Stadt)“. Trage beide Zahlen in Zeile 3 ein."]
  },
  "fb4": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "gleichfoermig-rs", seite: 70,
    kapitel: "Wie schnell ist schnell?",
    name: "Was sagen die Abstände?",
    titel: "Kreidestriche auf dem Schulhof",
    frage: "Was sagen dir die Abstände zwischen den Sekunden-Marken?",
    schritte: ["Die Simulation startet auf „mittel“. Drücke „▶ Fahren“ und fülle Zeile 1 aus.", "Wähle den Knopf „langsam“ und drücke danach „▶ Fahren“.", "Lies ab, welche Zahl bei v steht. Sieh dir die Abstände an. Fülle Zeile 2 aus.", "Wiederhole das mit „schnell“ und fülle die letzte Zeile aus."]
  },
  "fb5": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "weg-zeit-diagramm", seite: 74,
    kapitel: "Wie schnell ist schnell?",
    name: "Was verrät die Linie im Weg-Zeit-Diagramm?",
    titel: "Linien an der Werkstattwand",
    frage: "Was sagt dir die Linie im Weg-Zeit-Diagramm über die Fahrt?",
    schritte: ["Drücke „schnell“ und dann „▶ Fahren“. Trage Zeile 1 in die Tabelle ein.", "Drücke „langsam“ und dann „▶ Fahren“. Beobachte, wie stark die Linie steigt.", "Lies die Statuszeile und trage Zeile 2 in die Tabelle ein.", "Drücke „mit Pause“ und dann „▶ Fahren“. Trage danach Zeile 3 ein."]
  },
  "fb6": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "v-zeit-diagramm", seite: 78,
    kapitel: "Wie schnell ist schnell?",
    name: "Was verrät die Linie im Geschwindigkeit-Zeit-Diagramm?",
    titel: "Die Linie steigt und fällt",
    frage: "Was bedeutet eine waagerechte, eine ansteigende und eine fallende Linie?",
    schritte: ["Öffne die Simulation. Das Bild oben heißt dort „v-t-Diagramm“ – gemeint ist das Geschwindigkeit-Zeit-Diagramm.", "Drücke den Knopf „konstant“ und dann „▶ Fahren“. Lies die Statuszeile und fülle Zeile 1 aus.", "Drücke den Knopf „beschleunigen“ und dann „▶ Fahren“. Lies die Statuszeile und fülle Zeile 2 aus.", "Drücke den Knopf „bremsen“ und dann „▶ Fahren“. Lies die Statuszeile und fülle Zeile 3 aus."]
  },
  "fb7": {
    klasse: 8, schulform: "Gesamtschule NRW · Förderheft",
    sim: "bremsweg-jg9", seite: 82,
    kapitel: "Wie schnell ist schnell?",
    name: "Wie weit fährt ein Auto bis zum Halt?",
    titel: "Bis das Auto steht",
    frage: "Woraus besteht der Weg, bis das Auto wirklich steht?",
    schritte: ["Drücke „▶ Gefahr! (Start)“ und beobachte, wie weit das Auto noch fährt.", "Lies in der Statuszeile Reaktionsweg und Bremsweg ab. Trage die Geschwindigkeit 50 km/h und beide Wege in Zeile 1 ein. Am Bildschirm steht „Geschwindigkeit v = 50 km/h“.", "Drücke „100 km/h“ für Zeile 2, danach „30 km/h“ für Zeile 3.", "Vergleiche den Bremsweg bei 50 km/h mit dem Bremsweg bei 100 km/h."]
  },
  "fk1": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "kraft-wirkung", seite: 7,
    kapitel: "Kräfte auf der Bühne",
    name: "Woran erkennt man eine Kraft?",
    titel: "Der unsichtbare Schubs",
    frage: "Woran erkennst du, dass eine Kraft gewirkt hat?",
    schritte: ["Wähle „Bewegen“, drücke „Kraft wirken lassen“ und lies die Statuszeile ab.", "Wähle „Verformen“, drücke „Kraft wirken lassen“ und lies ab.", "Wähle „Richtung ändern“, drücke „Kraft wirken lassen“ und lies ab.", "Trage in die Tabelle ein, was sich jedes Mal ändert."]
  },
  "fk2": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "kraftmesser", seite: 11,
    kapitel: "Kräfte auf der Bühne",
    name: "Wie misst man eine Kraft?",
    titel: "Was der Zeiger verrät",
    frage: "Wie kannst du eine Kraft messen, die du nicht siehst?",
    schritte: ["Drücke auf „Feder leeren“. Jetzt hängen 0 g dran. Lies die Statuszeile.", "Drücke einmal auf „Gewichtsstück anhängen (100 g)“. Lies ab: Wie viel Newton zeigt der Zeiger?", "Drücke noch einmal darauf. Jetzt hängen 200 g dran. Lies wieder ab und füll die letzte Zeile."]
  },
  "fk3": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "federgesetz", seite: 15,
    kapitel: "Kräfte auf der Bühne",
    name: "Warum gibt eine Feder nach?",
    titel: "Weicher Puffer, harter Puffer",
    frage: "Wovon hängt es ab, wie weit sich eine Feder dehnt?",
    schritte: ["Wähle „weiche Feder“. Drücke „+ 100 g“.", "Lies ab: Wie viel Gramm? Wie weit dehnt sich die Feder? Trage es ein.", "Drücke „+ 100 g“ noch einmal (weiche Feder, 200 g). Trage wieder ein.", "Drücke „alles abnehmen“, dann „harte Feder“, dann „+ 100 g“. Füll die letzte Zeile."]
  },
  "fk4": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "masse-gewicht", seite: 19,
    kapitel: "Kräfte auf der Bühne",
    name: "Masse oder Gewichtskraft?",
    titel: "Zwei Zahlen für ein Klavier",
    frage: "Sind Masse und Gewichtskraft dasselbe?",
    schritte: ["Drücke zuerst „100 g“. Sonst steht noch 1 kg da.", "Lies in der Statuszeile Masse und Gewichtskraft ab. Trage alles ein.", "Drücke danach „1 kg“ und „2 kg“. Trage sie ein und vergleiche."]
  },
  "fk5": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "ortsfaktor", seite: 23,
    kapitel: "Kräfte auf der Bühne",
    name: "Wäre das Klavier auf dem Mond leichter?",
    titel: "Das Klavier auf dem Mond",
    frage: "Wird auf dem Mond die Masse kleiner oder die Gewichtskraft?",
    schritte: ["Wähle Erde und lies g und F in der Statuszeile ab.", "Trage Erde und beide Werte in Zeile 1 ein.", "Wiederhole das mit Mond und mit Jupiter.", "Vergleiche: Welche Zahl bleibt überall gleich?"]
  },
  "fk6": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "kraftpfeil", seite: 27,
    kapitel: "Kräfte auf der Bühne",
    name: "Wie zeichnet man eine Kraft auf?",
    titel: "Pfeile auf dem Bühnenplan",
    frage: "Was zeigt der Kraftpfeil außer der Stärke noch?",
    schritte: ["Drücke immer zuerst eine Zahl, dann einen Pfeil-Knopf.", "Drücke 2 N und →, danach 6 N und →. Lies jedes Mal den letzten Satz in der Statuszeile.", "Wiederhole das bei 6 N mit ↑ (nach oben) und ↗ (schräg nach rechts oben).", "Trage alles in die Tabelle ein."]
  },
  "fk7": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "kraefte-addieren", seite: 31,
    kapitel: "Kräfte auf der Bühne",
    name: "Was passiert, wenn zwei ziehen?",
    titel: "Zwei ziehen am selben Seil",
    frage: "Wann wird die Gesamtkraft größer, wann kleiner?",
    schritte: ["Drücke noch nichts. Lies die Statuszeile ab. Trage Zeile 1 ein.", "Drücke bei F1 auf „Richtung“. Prüfe: F1 zieht jetzt nach links. Trage Zeile 2 ein.", "Drücke bei F2 auf „– N“. Trage Zeile 3 ein."]
  },
  "fk8": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "kraefte-gleichgewicht", seite: 35,
    kapitel: "Kräfte auf der Bühne",
    name: "Warum bewegt sich die Lampe nicht?",
    titel: "Die Lampe hängt still",
    frage: "Wirken an der stillen Lampe wirklich keine Kräfte?",
    schritte: ["Lies am Anfang die Haltekraft und die Gewichtskraft ab (am Bildschirm: „Halte 5 N“, „Gewicht 5 N“).", "Drücke einmal auf – N. Die Haltekraft ist jetzt 4 N. Beobachte die Lampe.", "Lies im Bild unter der Lampe die Gesamtkraft ab.", "Drücke auf den Knopf zurück in die Mitte. Die Haltekraft ist wieder 5 N. Vergleiche."]
  },
  "fk9": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "traegheit-rs", seite: 39,
    kapitel: "Kräfte auf der Bühne",
    name: "Warum rutscht die Kiste weiter?",
    titel: "Niemand schiebt mehr",
    frage: "Warum bleibt der Wagen stehen – und was passiert ohne Reibung?",
    schritte: ["Wähle „Tisch“, drücke „Anstoßen“ und warte, bis er steht.", "Drücke „Zurücksetzen“, wähle „Eis“ und stoße wieder an.", "Wähle „Weltall“, stoße an und lies die Statuszeile.", "Trage alles in die Tabelle ein."]
  },
  "fk10": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "wechselwirkung", seite: 43,
    kapitel: "Kräfte auf der Bühne",
    name: "Warum rollt das Rollbrett zurück?",
    titel: "Rückwärts auf dem Rollbrett",
    frage: "Warum rollt Jannis zurück, wenn er das Klavier wegdrückt?",
    schritte: ["Drücke Eisläufer. Trage Läufer A und Läufer B mit ihrer Masse m und Geschwindigkeit v ein.", "Drücke Boot. Trage Boot und Person mit ihrer Masse m und Geschwindigkeit v ein.", "Drücke Rakete. Lies die Statuszeile.", "Vergleiche: Wer ist leichter? Wer wird schneller?"]
  },
  "fk11": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "druck-flaeche", seite: 47,
    kapitel: "Kräfte auf der Bühne",
    name: "Warum sinkt der schmale Fuß ein?",
    titel: "Vier Dellen im neuen Podest",
    frage: "Warum hinterlassen schmale Rollen Dellen und breite Bretter nicht?",
    schritte: ["Drücke Turnschuhe. Lies bei p die Zahl vor kPa. Fülle die erste Zeile aus.", "Drücke Stöckelabsatz und fülle die zweite Zeile aus.", "Drücke Skier und fülle die letzte Zeile aus."]
  },
  "fk12": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "schweredruck", seite: 51,
    kapitel: "Kräfte auf der Bühne",
    name: "Warum drückt Wasser in der Tiefe mehr?",
    titel: "Der untere Hahn spritzt weiter",
    frage: "Warum drückt das Wasser unten stärker als oben?",
    schritte: ["Drücke zuerst Wasser. Die Tiefe bleibt 10 m. Lies unter der Überschrift Der Schweredruck die Zahl vor kPa.", "Drücke Öl und trage den Wert bei 10 m ein.", "Drücke Quecksilber und fülle die dritte Zeile aus.", "Drücke zuletzt 40 m – Tauchgrenze. Quecksilber bleibt gewählt. Ergänze die letzte Zeile."]
  },
  "fk13": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "dichte", seite: 55,
    kapitel: "Kräfte auf der Bühne",
    name: "Warum haben gleich große Würfel verschiedene Massen?",
    titel: "Zwei Klötze auf der Werkbank",
    frage: "Warum hat der eine Würfel mehr Masse als der andere?",
    schritte: ["Drücke Blei und suche die Zeile 2 · Die Masse. Fülle die erste Tabellenzeile aus.", "Drücke Eisen und fülle die zweite Tabellenzeile aus.", "Drücke Styropor und fülle die letzte Zeile aus.", "Lies in Zeile 4: schwimmt oder sinkt der Würfel?"]
  },
  "fk14": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "auftrieb", seite: 59,
    kapitel: "Kräfte auf der Bühne",
    name: "Warum schwimmt ein Schiff aus Eisen?",
    titel: "Ein Stahlrohr in der Regentonne",
    frage: "Warum sinkt massives Eisen, ein hohler Eisenwürfel aber nicht?",
    schritte: ["Drücke „massiv – sinkt“ und lies die mittlere Dichte ab.", "Drücke „87 % – sinkt noch“ und dann „88 % – schwimmt gerade“.", "Drücke „90 % – Schiff“ und vergleiche jede Zahl mit 1000 kg/m³.", "Trage alles in die Tabelle ein."]
  },
  "fe1": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "arbeit", seite: 66,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wann wird Arbeit verrichtet?",
    titel: "Vier Meter über den Hof",
    frage: "Wann verrichtet Jannis wirklich Arbeit?",
    schritte: ["Drücke „Schieben“ und „Ausführen“. Lies die Arbeit ab.", "Drücke „Waagerecht tragen“. Vergleiche mit 400 J.", "Drücke „Hochheben“. Lies die Arbeit im Bild ab.", "Trage alles in die Tabelle ein."]
  },
  "fe2": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "lageenergie", seite: 70,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wo steckt die Energie oben?",
    titel: "Der Sack liegt oben still",
    frage: "Wovon hängt es ab, wie viel Lageenergie ein Körper oben hat?",
    schritte: ["Drücke zuerst keinen Knopf (Start). Lies in der Statuszeile ab, wie viel Lageenergie der Klotz oben hat.", "Drücke „×2 Masse“ und trage die Werte in die Tabelle ein.", "Drücke danach „×2 Höhe“ und trage ein. Setze vorher nicht zurück.", "Vergleiche die drei Werte."]
  },
  "fe3": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "bewegungsenergie", seite: 74,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wo steckt die Energie beim Rollen?",
    titel: "Der Ball wirft den Eimer um",
    frage: "Was bringt mehr Bewegungsenergie: doppelte Masse oder doppelte Geschwindigkeit v?",
    schritte: ["Drücke „zurücksetzen“ für den Start. Am Bildschirm stehen 4 kg und 4 m/s. Fülle Zeile 1 aus.", "Drücke „×2 Masse“ und fülle Zeile 2 aus.", "Drücke danach „×2 v“ (doppelte Geschwindigkeit v) und fülle Zeile 3 aus.", "Vergleiche die drei Werte. Drücke „Rollen lassen“ und beobachte den Klotz."]
  },
  "fe4": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "energieerhaltung", seite: 78,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was passiert beim Fallen?",
    titel: "Der Ball vom Bühnenrand",
    frage: "Wo bleibt die Lageenergie, während der Ball fällt?",
    schritte: ["Öffne die Simulation. Fasse die beiden Regler nicht an. Am Anfang ruht der Ball in 20,0 m Höhe.", "Sieh dir den Ball an. Er fällt, springt hoch und fällt wieder.", "Beobachte die Höhe und die zwei Balken „E_pot“ und „E_kin“, solange der Ball nach unten fällt.", "Trage Höhe, E_pot und E_kin ein: Wird der Balken kürzer oder länger?"]
  },
  "fe5": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "energie-entwerten", seite: 82,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum wird alles am Ende warm?",
    titel: "Am Ende ist alles warm",
    frage: "Warum soll man Energie sparen, wenn keine Energie verloren geht?",
    schritte: ["Drücke zuerst „Benzin → Fahrt“. Sonst misst du die falsche Kette. Das ist der Anfang: Fülle Zeile 1 aus.", "Drücke „nächster Schritt“. Lies ab, wie viel man noch gebrauchen kann.", "Lies auch die letzte Zeile: Wie viel ist zusammen da?", "Trage beides in Zeile 2 ein: nach Schritt 1 (Motor)."]
  },
  "fe6": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "leistung-rs", seite: 86,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was ist Leistung?",
    titel: "Nour zieht schneller",
    frage: "Was ändert sich, wenn Nour die halbe Zeit braucht?",
    schritte: ["Drücke „zurücksetzen“ und dann „Hochziehen“. Die Zahlen stehen schon vorher da. Fülle Zeile 1 aus: 50 kg in 10 s.", "Drücke „÷2 Zeit“ und fülle Zeile 2 aus.", "Drücke „zurücksetzen“. Stelle 20 kg ein und fülle Zeile 3 aus."]
  },
  "fe7": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "wirkungsgrad", seite: 90,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Wie viel Energie kommt an?",
    titel: "Die alte Glühlampe im Scheinwerfer",
    frage: "Wie viel von 1000 J wird bei einer Maschine wirklich zu Licht oder Bewegungsenergie?",
    schritte: ["Lies die Statuszeile. Fasse den Regler nicht an. Die Glühlampe ist schon gewählt. Fülle Zeile 1 aus.", "Drücke „LED-Lampe“ und fülle Zeile 2 aus.", "Drücke „Benzinmotor“ und fülle Zeile 3 aus. Drücke „Elektromotor“ und fülle Zeile 4 aus.", "Vergleiche: Wo kommt am meisten heraus?"]
  },
  "fe8": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "hebel", seite: 94,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum hilft eine lange Stange?",
    titel: "Die Eisenstange unter dem Klavier",
    frage: "Was passiert mit Kraft und Weg, wenn der Kraftarm länger wird?",
    schritte: ["Stelle den Kraftarm l₁ auf 1,00 m. Die Last F₂ bleibt 200 N. Fülle Zeile 1 aus.", "Drücke „gleich lang – nichts gespart“ (0,25 m). Fülle Zeile 2 aus.", "Drücke „achtfach – ein Achtel der Kraft“ (2,00 m). Fülle Zeile 3 aus.", "Vergleiche die drei Zeilen. Lies im Bild die Arbeit ab."]
  },
  "fe9": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "flaschenzug", seite: 98,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was bringen Rollen und Seile?",
    titel: "Vier Seile für das Klavier",
    frage: "Was ändert sich, wenn mehr Seilstücke die Last tragen?",
    schritte: ["Drücke „n = 1 · volle Kraft“ (1 Seilstück) und fülle Zeile 1.", "Drücke „n = 2 · halbe Kraft“ (2 Seilstücke) und fülle Zeile 2.", "Drücke „n = 4 · ein Viertel“ (4 Seilstücke) und fülle Zeile 3.", "Vergleiche die Zeile „Zugarbeit“ bei den drei Knöpfen."]
  },
  "fe10": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "zahnrad", seite: 102,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Warum dreht sich das kleine Rad schneller?",
    titel: "Dreimal kurbeln, einmal herum",
    frage: "Wovon hängt die Drehzahl von Rad 2 ab?",
    schritte: ["Drücke „gleich groß (24 : 24)“. Jeder Knopf stellt Rad 1 auf 60 U/min. Trage alles ein.", "Drücke „groß treibt klein – schneller“ (Rad 1: 30 Zähne, Rad 2: 10 Zähne). Trage alles ein.", "Drücke „klein treibt groß – langsamer, kräftiger“ (Rad 1: 12 Zähne, Rad 2: 36 Zähne). Trage alles ein.", "Vergleiche die drei Zeilen."]
  },
  "fe11": {
    klasse: 9, schulform: "Gesamtschule NRW · Förderheft",
    sim: "schiefe-ebene", seite: 106,
    kapitel: "Arbeit, Energie und Maschinen",
    name: "Was spart die Rampe?",
    titel: "Zwei Bretter an der Bühnenkante",
    frage: "Was ändert sich an Kraft und Weg, wenn die Rampe flacher liegt?",
    schritte: ["Drücke nur „flach“, „mittel“ oder „steil“. Die anderen Knöpfe brauchst du hier nicht.", "Lies die Kraft F in der Statuszeile ab. Die Zahl steht vor N.", "Trage „flach“, „mittel“ und „steil“ mit Kraft und Weg in die Tabelle ein."]
  },
  "fv1": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "magnetfeld", seite: 7,
    kapitel: "Woher der Strom kommt",
    name: "Wo ist ein Magnet am stärksten?",
    titel: "Erster Tag bei den Stadtwerken",
    frage: "An welcher Stelle ist das Magnetfeld am stärksten?",
    schritte: ["Drücke „Feldlinien“. Die Feldlinien zeigen das Magnetfeld. Vergleiche, wo sie dicht liegen.", "Stelle den Abstand auf 55. Stelle bei „Stelle am Magneten“ die Zahl hinter dem Doppelpunkt auf 0. Sieh: Wie viele Feldlinien liegen dort?", "Stelle bei „Stelle am Magneten“ die Zahl auf 90. Trage Zeile 2 ein (Abstand 55).", "Stelle die Zahl wieder auf 0. Stelle den Abstand auf 140. Trage Zeile 3 ein."]
  },
  "fv2": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "oersted", seite: 11,
    kapitel: "Woher der Strom kommt",
    name: "Kann Strom eine Kompassnadel bewegen?",
    titel: "Der Draht unter der Kompassnadel",
    frage: "Was macht die Kompassnadel, wenn Strom fließt?",
    schritte: ["Lies in der Statuszeile „Strom an: 3,0 A, Abstand 2,0 cm“, „Feld des Drahtes“ und „Erdfeld“ ab. Trage Zeile 1 ein.", "Drücke „Strom ausschalten“. Der Knopf heißt danach „Strom einschalten“.", "Beobachte, wohin sich die Nadel dreht. Achte auf den Abstand.", "Trage Zeile 2 „Strom aus“ ein."]
  },
  "fv3": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "elektromagnet", seite: 15,
    kapitel: "Woher der Strom kommt",
    name: "Wie baut man einen Magneten zum Anschalten?",
    titel: "Der Kran auf dem Schrottplatz",
    frage: "Wie ändert sich die Tragkraft, wenn die Stromstärke größer wird?",
    schritte: ["Drücke zuerst „Stromstärke ändern“. Sonst füllt sich die falsche Tabelle.", "Drücke danach „Beispielmessreihe“. Lies die Tragkraft bei 1 A, 3 A und 5 A ab.", "Trage jede Stromstärke I und ihre Zahl ein. Vergleiche jede Zeile mit der davor.", "Lies am Bildschirm den Satz über den Eisenkern."]
  },
  "fv4": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "leiterkraft", seite: 19,
    kapitel: "Woher der Strom kommt",
    name: "Warum bewegt sich ein Draht im Magnetfeld?",
    titel: "Der aufgeschraubte Motor",
    frage: "Wohin wirkt die Kraft F auf den Stab?",
    schritte: ["Drücke „zurücksetzen“ (5,0 A). Lies den ersten Satz und die Zahl vor N. Den Absatz über drei Finger brauchst du nicht. Trage Zeile 1 ein.", "Stelle 0 A ein. Nimm nur den ersten Satz. Trage Zeile 2 ein.", "Stelle 10,0 A ein. Trage Zeile 3 ein.", "Stelle wieder 5,0 A ein. Drücke „Strom umpolen“. Trage Zeile 4 ein."]
  },
  "fv5": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "elektromotor", seite: 23,
    kapitel: "Woher der Strom kommt",
    name: "Wie wird aus der Kraft eine Drehung?",
    titel: "Der geteilte Ring im Motor",
    frage: "Was macht die Spule, wenn der Kommutator aus ist?",
    schritte: ["Beobachte die Spule: 20 Windungen, Kommutator ist AN. Das ist Zeile 1.", "Drücke den Knopf mit dem Wort Kommutator. Dort steht dann: Kommutator ist AUS.", "Beobachte wieder. Lies M ab. Trage Zeile 2 ein.", "Stelle die Windungen auf 40. Der Kommutator bleibt aus. Lies M ab. Trage Zeile 3 ein."]
  },
  "fv6": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "induktion-rs", seite: 27,
    kapitel: "Woher der Strom kommt",
    name: "Wie entsteht Spannung ohne Batterie?",
    titel: "Der Aufbau ohne Batterie",
    frage: "Wann zeigt das Messgerät eine Spannung an?",
    schritte: ["Beobachte das Messgerät („mittel“, 50 cm/s). Der Magnet fährt hinein, liegt still, fährt heraus.", "Wähle „stark“. Lies bei 50 cm/s ab und trage ein.", "Stelle „Geschwindigkeit des Magneten“ auf 100 cm/s. Lies ab und trage ein.", "Lies ab, wenn der Magnet still liegt. Trage ein."]
  },
  "fv7": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "generator", seite: 31,
    kapitel: "Woher der Strom kommt",
    name: "Wie erzeugt ein Generator Spannung?",
    titel: "Die Maschine im Kraftwerk",
    frage: "Wie ändert sich die Spannung, wenn sich die Spule schneller dreht?",
    schritte: ["Drücke oben „1 · Der Grundversuch“. Drücke dann „Anhalten“.", "Lies bei „2,0 Hz“ den Kasten „Scheitelwert Û“ ab. Das ist die größte Spannung. Trage ein.", "Schiebe nur den Regler „Drehfrequenz f“ auf „1,0 Hz“. Lies „Scheitelwert Û“ ab. Trage ein.", "Schiebe auf „4,0 Hz“. Lies wieder ab. Trage ein. Vergleiche jede Zeile mit der davor."]
  },
  "fv8": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "transformator-schluessel", seite: 35,
    kapitel: "Woher der Strom kommt",
    name: "Wie ändert ein Transformator die Spannung?",
    titel: "Der Kasten, der brummt",
    frage: "Wovon hängt die Spannung an der Sekundärspule ab?",
    schritte: ["Drücke „1 · Aufbau und Wirkungskette“. „Wechselspannung“ ist schon gedrückt.", "Achte darauf: Du bewegst nur „Sekundär NS“. „Frequenz f“ bleibt, wie sie ist.", "Stelle „Sekundär NS“ erst auf 1000, dann auf 500. Lies jedes Mal die Zahl bei „Volt“ ab.", "Stelle „Sekundär NS“ auf 250. Trage alle Zeilen ein."]
  },
  "fv9": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "freileitungen", seite: 39,
    kapitel: "Woher der Strom kommt",
    name: "Warum ist der Verlust mit Hochspannung klein?",
    titel: "Zwei Lampen und ein dünner Draht",
    frage: "Warum ist der Verlust mit Hochspannung so klein?",
    schritte: ["Drücke „1 · Die drei Teilversuche“, dann „Hochspannung“.", "Lies in der Zeile mit „Strom“ die Zahl vor A ab. Lies in der Zeile „Verlust in der Leitung“ die Zahl vor W ab.", "Drücke „Niederspannung, CrNi“. Lies den neuen Satz.", "Lies beide Zahlen wieder ab. Trage beide Zeilen ein."]
  },
  "fv10": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "freileitungen", seite: 43,
    kapitel: "Woher der Strom kommt",
    name: "Wie kommt die Energie zur Steckdose?",
    titel: "Der Weg bis zur Steckdose",
    frage: "Welche Stellen liegen auf dem Weg vom Kraftwerk bis zur Steckdose?",
    schritte: ["Drücke „5 · Konzepte im Vergleich“.", "Sieh dir die fünf Kreise an. Jeder Kreis ist eine Stelle auf dem Weg.", "Lies unter Kreis 1 bis 5 beide Zeilen ab.", "Trage die Nummer und beide Zeilen ein."]
  },
  "fv12": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "wirkungsgrad", seite: 52,
    kapitel: "Woher der Strom kommt",
    name: "Wie viel Energie kommt beim Kunden an?",
    titel: "Warme Luft aus dem Schaltschrank",
    frage: "Bleibt der Wirkungsgrad η gleich, wenn mehr Energie hineingeht?",
    schritte: ["Drücke „Handy-Ladegerät“.", "Stelle den Regler auf 1000 J, 200 J, 600 J und 1200 J. Bleibe beim Handy-Ladegerät.", "Trage beide Joule-Zahlen und η ein.", "Vergleiche die vier Zeilen. Was bleibt gleich?"]
  },
  "fv13": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "stromkosten", seite: 56,
    kapitel: "Woher der Strom kommt",
    name: "Was kostet ein Gerät im Jahr?",
    titel: "Die Rechnung am Tresen",
    frage: "Wovon hängt es ab, was ein Gerät im Jahr kostet?",
    schritte: ["Lies die Statuszeile zum Fernseher 100 W ab. Nimm nur die Zahl hinter „Im Jahr:“.", "Drücke „LED 10 W“. Trage die Zeile ein.", "Drücke „Wasserkocher 2000 W“. Trage die Zeile ein.", "Drücke „1 h“. Der Wasserkocher bleibt gewählt. Trage die Zeile ein."]
  },
  "fn1": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "atombau-isotope", seite: 63,
    kapitel: "Aus dem Atomkern",
    name: "Woraus besteht ein Atomkern?",
    titel: "Der Kühlschrank mit den Zahlen",
    frage: "Welche Teilchen im Kern bestimmen den Namen?",
    schritte: ["Drücke Wasserstoff-1. Trage die erste Zeile ein.", "Drücke Kohlenstoff-12. Trage die zweite Zeile ein.", "Drücke Kohlenstoff-14. Trage die dritte Zeile ein.", "Stelle den Regler Protonen im Kern auf 8. Lies oben den Namen ab. Trage die vierte Zeile ein."]
  },
  "fn2": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "geiger-mueller", seite: 67,
    kapitel: "Aus dem Atomkern",
    name: "Was ist radioaktive Strahlung?",
    titel: "Das Knacken an der Wand",
    frage: "Warum knackt das Zählrohr bei manchen Spannungen nicht?",
    schritte: ["Drücke oben den Knopf „2 · Die Kennlinie“.", "Stelle den Regler „Zählrohrspannung U“ nacheinander auf 0 V, 450 V und 650 V.", "Lies die Zahl hinter „Bereich“ ab. Trage sie ein.", "Lies den Text unter der Zahl. Trage ein: „zählt“ heißt zählt, „zerstört“ heißt geht kaputt."]
  },
  "fn3": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "absorption-strahlung", seite: 71,
    kapitel: "Aus dem Atomkern",
    name: "Welche Strahlung kommt wie weit?",
    titel: "Die Schürze aus Blei",
    frage: "Welches Material hält welche Strahlung auf?",
    schritte: ["Drücke oben den Knopf „1 · Drei Strahlungsarten“. Die Materialknöpfe stehen in der Zeile „Absorber“.", "Drücke „γ-Strahlung“ und „Blei“. Lies oben rechts im Bild ab. Trage die erste Zeile ein.", "Drücke „α-Strahlung“ und „Papier“. Lies oben rechts im Bild ab, wie viel durchkommt. Trage die Zeile ein.", "Drücke zuerst „Aluminium“, dann „β-Strahlung“. Lies ab. Trage die letzte Zeile ein."]
  },
  "fn4": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "ionisation", seite: 75,
    kapitel: "Aus dem Atomkern",
    name: "Warum ist die Strahlung gefährlich?",
    titel: "Das Fläschchen, das zubleibt",
    frage: "Warum ist Alphastrahlung im Körper am gefährlichsten?",
    schritte: ["Drücke α Alpha. Lies beide Werte ab und trage die erste Zeile ein.", "Drücke β Beta und trage beide Werte in die Tabelle ein.", "Drücke γ Gamma. Trage zwei Wortangaben ein, keine Zahlen. Eine steht im letzten Satz.", "Drücke wieder α Alpha. Lies den letzten Abschnitt: Er erklärt die Gefahr im Körper."]
  },
  "fn5": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "geiger-mueller", seite: 79,
    kapitel: "Aus dem Atomkern",
    name: "Wie weist man Strahlung nach?",
    titel: "Das Knacken im Messraum",
    frage: "Wie hoch sind die Impulse bei etwa 200 V und bei etwa 450 V?",
    schritte: ["Drücke „3 · Proportional- oder Auslösebereich“, dann „Proportionalbereich“.", "Lies unter „Proportionalbereich (~200 V)“ die Spalte „Impulshöhe“. Ergänze die mittlere Spalte.", "Drücke „Auslösebereich“. Lies dieselbe Spalte unter „Auslösebereich (~450 V)“. Ergänze die rechte Spalte.", "Drücke „4 · Totzeit & wahre Zählrate“."]
  },
  "fn6": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "zerfall-halbwertszeit", seite: 83,
    kapitel: "Aus dem Atomkern",
    name: "Wann ist die Hälfte zerfallen?",
    titel: "Das Fläschchen wird schwächer",
    frage: "Am Bildschirm liegen 200 Kerne. Sind nach einer Halbwertszeit immer genau 100 übrig?",
    schritte: ["Drücke „Radon-220“. Lies in Zeile 1 der Statuszeile die Halbwertszeit ab.", "Drücke „eine Halbwertszeit weiter“. Lies in Zeile 2 die übrigen Kerne ab.", "Vergleiche deine Zahl mit Zeile 3.", "Wähle Iod-131 und danach Cäsium-137. Trage alle drei Nuklide mit ihren Werten ein."]
  },
  "fn7": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "zerfall-halbwertszeit", seite: 87,
    kapitel: "Aus dem Atomkern",
    name: "Wie alt ist der Fund?",
    titel: "Ein Holzstück aus dem Moor",
    frage: "Von 200 Kernen sind noch 50 übrig. Wie viele Halbwertszeiten sind vergangen?",
    schritte: ["Drücke „Kohlenstoff-14“. Lies im ersten Teil der Statuszeile die Halbwertszeit ab.", "Drücke „eine Halbwertszeit weiter“. Lies im zweiten Teil die Jahre ab.", "Lies im dritten Teil die Zahl hinter „Erwartet hätte man“ ab.", "Drücke „eine Halbwertszeit weiter“ noch zweimal. Lies Teil 2 und 3 ab. Trage für 0, 1, 2, 3 Halbwertszeiten alle Zahlen ohne Punkt ein."]
  },
  "fn8": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "kernspaltung", seite: 91,
    kapitel: "Aus dem Atomkern",
    name: "Was passiert bei einer Kernspaltung?",
    titel: "Der Güterzug und der Würfel",
    frage: "Woher kommt die Energie bei einer Kernspaltung?",
    schritte: ["Drücke „Spaltung noch einmal“. Beobachte das langsame Neutron.", "Lies in der Statuszeile die fehlende Masse ab. Sie steht vor „weniger als vorher“.", "Lies in der Statuszeile die Energie ab. Sie steht vor „je Spaltung“. Trage „Barium + Krypton“ und beide Werte ein.", "Wähle „Xenon + Strontium“. Trage beide Werte ein. Wiederhole das mit „Cäsium + Rubidium“."]
  },
  "fn9": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "kettenreaktion", seite: 95,
    kapitel: "Aus dem Atomkern",
    name: "Wie hält man eine Kettenreaktion in Schach?",
    titel: "Der Beitrag im Aufenthaltsraum",
    frage: "Wie ändert sich k, wenn die Steuerstäbe weiter drin sind?",
    schritte: ["Schiebe den Regler auf 0 %. Lies k und die Zahl darunter.", "Stelle 50 % ein. Lies den Satz zum Kernkraftwerk.", "Stelle 75 % und 100 % ein. Trage alles ein."]
  },
  "fn10": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "kettenreaktion", seite: 99,
    kapitel: "Aus dem Atomkern",
    name: "Wie ist ein Kernkraftwerk aufgebaut?",
    titel: "Der Pfeil auf Nours Folie",
    frage: "Wo im Kernkraftwerk entsteht der Strom?",
    schritte: ["Lies den Text „Vom Reaktor zur Steckdose“ unter der Anzeige „Wie geht es weiter?“.", "Prüfe im Text: Wo steht Strom?", "Trage der Reihe nach ein: Brennstab, Wasser, Turbine, Generator."]
  },
  "fn12": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "strahlenschutz", seite: 108,
    kapitel: "Aus dem Atomkern",
    name: "Wie schützt man sich vor Strahlung?",
    titel: "Nours Schritt zurück",
    frage: "Was hilft mehr: ein Schritt zurück oder Blei?",
    schritte: ["Stelle den Abstand auf 50 cm und lies beide Zahlen ab.", "Stelle 100 cm ein, dann 200 cm. Trage die Zahlen ein.", "Stelle wieder 50 cm ein und schiebe „Blei dazwischen“ auf 7 mm.", "Trage die Zahlen ein. „Aufenthaltsdauer“ bleibt auf 20 Minuten."]
  },
  "fn14": {
    klasse: 10, schulform: "Gesamtschule NRW · Förderheft",
    sim: "kernfusion", seite: 117,
    kapitel: "Aus dem Atomkern",
    name: "Woher nimmt die Sonne ihre Energie?",
    titel: "Die Heizung ohne Holz",
    frage: "Ab welcher Temperatur verschmelzen Wasserstoffkerne zu einem Heliumkern?",
    schritte: ["Schiebe den Regler nach links auf 4 Millionen °C.", "Lies die Statuszeile rechts neben dem Bild ab.", "Stelle nacheinander 8, 10 und 16 Millionen °C ein.", "Trage alles in die Tabelle ein."]
  },
  "ki1": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "gleichfoermig", seite: 7,
    kapitel: "Grundlagen der Mechanik",
    name: "Wie schnell läuft sie wirklich?",
    titel: "Fünf Stopps, eine Steigung",
    frage: "Wie misst man die Geschwindigkeit, statt sie am Regler abzulesen?",
    schritte: ["Stelle „Geschwindigkeit v“ auf 4,0 m/s und drücke fünfmal „Zeit stoppen“.", "Wähle „t → s“ und markiere mit „Steigung messen“ zwei Punkte auf der Geraden.", "Wechsle zu „t → v“ und danach zu „t → a“."]
  },
  "ki3": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "beschleunigung-ef", seite: 11,
    kapitel: "Grundlagen der Mechanik",
    name: "Wie schnell wird der Wagen schneller?",
    titel: "Drei Diagramme, eine Zahl",
    frage: "Welche Zahl der t-v-Geraden gibt an, wie schnell sich die Geschwindigkeit des Wagens ändert?",
    schritte: ["Der Regler „Beschleunigung a“ ist verdeckt; drücke während der Fahrt fünfmal „Zeit stoppen“.", "Wähle nacheinander „t → s“, „t → v“ und „t → a“.", "Drücke bei „t → v“ „Steigung messen“ und markiere zwei Punkte."]
  },
  "ki4": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "beschleunigung-ef", seite: 14,
    kapitel: "Grundlagen der Mechanik",
    name: "Warum trägt man t² auf?",
    titel: "Aus der Kurve eine Gerade machen",
    frage: "Wie wird aus der s-t-Parabel eine Gerade, aus der man a ablesen kann?",
    schritte: ["Der Regler „Beschleunigung a“ ist verdeckt; stoppe fünfmal während der Fahrt.", "Wähle „t² → s“ und markiere mit „Steigung messen“ zwei Punkte.", "Trage den 1. bis 4. Stopp in die Tabelle ein, rechne für jede Zeile t² und s/t² aus und vergleiche mit der Steigung."]
  },
  "ki5": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "freierfall", seite: 18,
    kapitel: "Grundlagen der Mechanik",
    name: "Zwei Wege zum Ortsfaktor – warum kommt nicht dasselbe heraus?",
    titel: "Zwei Wege, zwei Zahlen",
    frage: "Was bleibt vom Unterschied der beiden g-Werte, wenn man eine Messreihe auswertet?",
    schritte: ["Drücke „Tabelle leeren“ und danach „Messreihe automatisch aufnehmen“ bei 50 m Fallhöhe.", "Wähle „t² → s auftragen“, notiere die Steigung k und rechne daraus g = 2 · k aus.", "Wechsle zu „t → v auftragen“, notiere diese Steigung als g und bilde die Differenz der beiden g-Werte."]
  },
  "ki6": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "wurf-waagerecht", seite: 23,
    kapitel: "Grundlagen der Mechanik",
    name: "Warum trifft die geworfene Kugel gleichzeitig auf?",
    titel: "Ein Schlag, nicht zwei",
    frage: "Wovon hängt die Fallzeit beim waagerechten Wurf ab – von h oder von v₀?",
    schritte: ["Wähle bei v₀ = 8 m/s „t_F über h auftragen“ und nimm die Messreihe auf.", "Wechsle zu „t_F² über h auftragen“ und lies die Steigung k ab.", "Leere die Tabelle und nimm bei h = 20 m „t_F über v₀ auftragen“ neu auf."]
  },
  "ki7": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: null, seite: 27,
    kapitel: "Grundlagen der Mechanik",
    name: "Eine Kraft, zwei Richtungen",
    titel: "Zwei Kisten, ein schräges Seil",
    frage: "Welche Komponente einer schräg ziehenden Kraft zieht den Schlitten vorwärts?",
    schritte: ["Lies im Datenblatt die Zeilen für α = 0°, α = 30° und α = 60° ab.", "Rechne die Zeile α = 30° mit cos(30°) = 0,8660 und sin(30°) = 0,5000 nach.", "Ordne die Zeilen nach der Größe der waagerechten Komponente."]
  },
  "ki8": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "traegheit", seite: 32,
    kapitel: "Grundlagen der Mechanik",
    name: "Was macht ein Körper, wenn keine Kraft mehr zieht?",
    titel: "Niemand schiebt, nichts ändert sich",
    frage: "Wie ändert sich die Geschwindigkeit, wenn die resultierende Kraft null ist?",
    schritte: ["Stelle „Externe Kraft F“ auf 0 N und „Anfangsgeschwindigkeit v₀“ auf 20 m/s.", "Lies v im weißen Kästchen ab und nach einer Weile ein zweites Mal.", "Ziehe v₀ nacheinander auf 5, 12 und 40 m/s und lies v jedes Mal erneut ab."]
  },
  "ki9": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "newton2", seite: 36,
    kapitel: "Grundlagen der Mechanik",
    name: "Wovon hängt die Beschleunigung ab?",
    titel: "Ein Regler nach dem anderen",
    frage: "Wie hängt die Beschleunigung von der Zugkraft und von der Masse ab?",
    schritte: ["Wähle bei m = 5 kg „a über F auftragen“ und nimm die Messreihe auf. Notiere die Steigung k und danach „Masse m aus der Steigung k“.", "Leere die Tabelle und nimm bei F = 40 N „a über m auftragen“ neu auf.", "Wechsle zu „a über 1/m auftragen“ und lies die Steigung ab."]
  },
  "ki10": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "kraefte-gleichgewicht", seite: 40,
    kapitel: "Grundlagen der Mechanik",
    name: "Warum hängt die Lampe still, obwohl an ihr gezogen wird?",
    titel: "Still, aber nicht kräftefrei",
    frage: "Bedeutet Ruhe, dass keine Kraft wirkt – oder dass die Gesamtkraft null ist?",
    schritte: ["Lies im Ausgangszustand im Statusfeld Haltekraft, Gewichtskraft und Gesamtkraft ab.", "Drücke einmal „– N“ und notiere Betrag und Richtung der Gesamtkraft.", "Drücke zweimal „+ N“ und danach „zurück in die Mitte“."]
  },
  "ki11": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "wechselwirkung-ef", seite: 45,
    kapitel: "Grundlagen der Mechanik",
    name: "Warum drückt die Wand zurück?",
    titel: "Gleiche Kraft, ungleiche Fahrt",
    frage: "Wie hängen Kraft und Beschleunigung von den Massen zweier Wagen ab?",
    schritte: ["Stelle m1 = 1 kg und m2 = 5 kg ein, drücke „Feder lösen“ und lies F1, F2, a1 und a2 ab.", "Stelle danach m1 = 2 kg und dann m1 = 5 kg ein und löse die Feder jedes Mal neu.", "Ziehe zum Schluss m2 auf 1 kg (m1 bleibt 5 kg) und löse die Feder noch einmal."]
  },
  "ki12": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "reibung", seite: 49,
    kapitel: "Grundlagen der Mechanik",
    name: "Wie viel Kraft bleibt zum Beschleunigen übrig?",
    titel: "Was von 80 Newton übrig bleibt",
    frage: "Wovon hängt die Reibungskraft ab – und was beschleunigt den Wagen wirklich?",
    schritte: ["Prüfe die Ausgangsstellung: m = 5 kg, F = 80 N, μ = 0,30 und F_R = 14,7 N.", "Ziehe allein den Regler „Reibungskoeffizient μ“ auf 0,00, 0,20, 0,40 und 0,60.", "Notiere jedes Mal den Wert hinter „F_R=“."]
  },
  "ki13": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "arbeit", seite: 54,
    kapitel: "Grundlagen der Mechanik",
    name: "Wann wird wirklich Arbeit verrichtet?",
    titel: "Vier Meter getragen, null Joule",
    frage: "Wann verrichtet eine Kraft Arbeit – und wann bleibt W trotz Anstrengung null?",
    schritte: ["Drücke „Schieben“ und notiere W bei F = 100 N und s = 4 m.", "Drücke „Waagerecht tragen“ und notiere Haltekraft und W.", "Drücke „Hochheben“ und „Ausführen“ und notiere W bei h = 2,0 m."]
  },
  "ki14": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "bewegungsenergie", seite: 58,
    kapitel: "Grundlagen der Mechanik",
    name: "Warum zählt das Tempo doppelt?",
    titel: "Zweimal verdoppelt, zweimal anders",
    frage: "Zählt eine Verdopplung der Geschwindigkeit genauso viel wie eine der Masse?",
    schritte: ["Wähle „E über v auftragen“ und nimm die Messreihe auf.", "Wähle „E über v² auftragen“ und notiere Steigung k und R².", "Leere die Tabelle und nimm „E über m auftragen“ neu auf. Vergleiche zum Schluss R² und die Abweichung beider Rückrechnungen."]
  },
  "ki15": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "spannenergie", seite: 62,
    kapitel: "Grundlagen der Mechanik",
    name: "Die gespannte Feder – wo steckt die Energie?",
    titel: "Das Dreieck unter der Geraden",
    frage: "Welche Auftragung macht aus der E-s-Kurve eine Gerade – und was heißt ihre Steigung?",
    schritte: ["Drücke bei D = 20 N/m „Messreihe automatisch aufnehmen“.", "Drücke nacheinander „F über s auftragen“, „E über s auftragen“ und „E über s² auftragen“.", "Stelle „Federkonstante D“ auf 50 N/m, nimm die Reihe erneut auf und wähle „E über s² auftragen“."]
  },
  "ki16": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "impuls", seite: 66,
    kapitel: "Grundlagen der Mechanik",
    name: "Bleibt die Summe gleich, wenn zwei zusammenstoßen?",
    titel: "Die Summe mit Vorzeichen",
    frage: "Was bleibt beim Stoß gleich – und warum zählt das Vorzeichen mit?",
    schritte: ["Lies bei m₁ = 3 kg und m₂ = 5 kg p₁, p₂ und p_ges ab, solange die Kugeln getrennt sind.", "Stelle „Masse 1 (kg)“ auf 1 kg und drücke „Stoß auslösen“; lies die drei Zeilen vor und nach dem Stoß ab.", "Ziehe „Masse 1 (kg)“ erst nach dem Stoß auf 2 kg und lies die drei Zeilen erneut ab."]
  },
  "gw1": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "kreisbewegung", seite: 75,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Wie schnell ist ein Punkt auf der Kreisbahn?",
    titel: "Gleicher Winkel, verschiedener Weg",
    frage: "Wie hängen Winkelgeschwindigkeit ω und Bahngeschwindigkeit v zusammen?",
    schritte: ["Lies die Zeile v≈ ab, während ω auf 3 rad/s und r auf 70 px stehen.", "Erhöhe ω auf 6 rad/s und danach auf 7 rad/s und lies jedes Mal v≈ ab.", "Ziehe bei 7 rad/s den Regler „Radius r“ auf 40 px."]
  },
  "gw2": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "zentripetalkraft", seite: 79,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Was hält den Körper auf der Kreisbahn?",
    titel: "Der Pfeil zeigt nach innen",
    frage: "Wohin zeigt die Kraft auf der Kreisbahn – und wovon hängt ihr Betrag ab?",
    schritte: ["Lies bei m = 0,50 kg, r = 0,80 m und f = 1,50 Hz die Größen T, ω, v, a_z und F_z ab.", "Vergleiche im Bild die Pfeile „F_z zum Mittelpunkt“ und „v tangential“.", "Ziehe den Regler „Masse m“ auf 1,00 kg und auf 2,00 kg."]
  },
  "gw3": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "zentripetalkraft", seite: 83,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Was sagt eine Messreihe über die Zentripetalkraft?",
    titel: "Acht Punkte, eine Steigung",
    frage: "Wie gewinnt man aus einer streuenden Messreihe die Masse zurück?",
    schritte: ["Wähle bei m = 0,50 kg und f = 1,50 Hz „F über r auftragen“ und drücke „Messreihe automatisch aufnehmen“.", "Lies Steigung k, Masse aus der Steigung und Abweichung ab.", "Wiederhole das mit „F über f² auftragen“ bei r = 0,80 m und danach mit „F über r auftragen“ bei m = 1,50 kg."]
  },
  "gw4": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "gravitation-abstand", seite: 87,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Mehr Masse oder weniger Abstand – was wirkt stärker?",
    titel: "Zwei Kugeln, zwei Auftragungen",
    frage: "Wie ändert sich die Gravitationskraft, wenn man Masse oder Abstand verdoppelt?",
    schritte: ["Stelle beide Massenregler auf 5 und nimm bei „F über r auftragen“ eine Messreihe auf.", "Wechsle zu „F über 1/r² auftragen“ und notiere k und R².", "Leere die Tabelle, stelle den Abstand auf 2 und wähle „F über m₁ auftragen“."]
  },
  "gw5": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "ortsfaktor", seite: 91,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Warum wiegt derselbe Mensch auf dem Mond weniger?",
    titel: "Dieselbe Person, drei Zahlen",
    frage: "Was ändert sich mit dem Ort, was bleibt – und wofür steht g in N/kg?",
    schritte: ["Drücke „Mond“ und notiere Masse m, Ortsfaktor g und Gewichtskraft F.", "Drücke „Erde“ und danach „Jupiter“ und lies dieselben drei Größen ab.", "Beantworte die drei Quizfragen und halte die genannte Formel fest."]
  },
  "gw6": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: null, seite: 95,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Was ist ein Feld?",
    titel: "Vier Orte, ein Feld",
    frage: "Wie stark ist das Feld der Erde dort, wo Menschen schwerelos schweben?",
    schritte: ["Übertrage zu jedem Ort – Erdoberfläche, Raumstation ISS, Navigationssatellit, Mondbahn – den Abstand r in die Tabelle.", "Bilde für jede Zeile den Anteil g : 9,82 N/kg.", "Berechne g = G · M / r² für die ISS-Bahn mit r = 6771 km."]
  },
  "gw7": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: null, seite: 100,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Wie wiegt man die Erde?",
    titel: "Die Drehwaage im Gartenhaus",
    frage: "Was hat Cavendish wirklich gemessen – und wie kommt man von dort zur Erdmasse?",
    schritte: ["Lies die beiden Massen und ihren Abstand ab und notiere m₁ · m₂ und r².", "Berechne daraus mit G = 6,674 · 10⁻¹¹ N·m²/kg² die Anziehungskraft F.", "Vergleiche diese Kraft mit der Gewichtskraft m₂ · g der kleinen Kugel."]
  },
  "gw8": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "planetenbahn", seite: 105,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Warum fällt die Erde nicht in die Sonne?",
    titel: "Das ewige Vorbeifallen",
    frage: "Warum stürzt der Planet nicht in die Sonne, obwohl sie ihn ständig anzieht?",
    schritte: ["Stelle „Startgeschwindigkeit quer zur Sonne“ auf 6 km/s und drücke „neu starten“.", "Stelle nacheinander 18, 24, 30 und 36 km/s ein und notiere jede Statuszeile.", "Vergleiche danach 42 km/s mit 48 km/s."]
  },
  "gw9": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: null, seite: 109,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Was verrät die Umlaufzeit über den Bahnradius?",
    titel: "Sechs Planeten, eine Konstante",
    frage: "Welche Verknüpfung von Halbachse und Umlaufzeit ist für alle Planeten gleich?",
    schritte: ["Lies für jeden Planeten die große Halbachse a und die Umlaufzeit T ab.", "Berechne zeilenweise a³, T² und daraus den Quotienten T²/a³.", "Vergleiche die Quotienten von Merkur, Erde, Jupiter und Saturn."]
  },
  "gw10": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "weltbild", seite: 114,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Warum läuft der Mars manchmal rückwärts?",
    titel: "Zwei Modelle, ein Himmel",
    frage: "Was entscheidet zwischen dem geozentrischen und dem heliozentrischen Weltbild?",
    schritte: ["Drücke „Erde in der Mitte (alt)“ und notiere, wer in der Mitte steht, wie viele Kreise der Mars braucht, ob der Streifen unten eine Schleife zeigt und welches Urteil am Ende der Statuszeile steht.", "Drücke „Sonne in der Mitte (heute)“ und vergleiche dieselben Angaben.", "Verfolge im Streifen unten, wann die Spur des Mars orange wird."]
  },
  "gw11": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: null, seite: 118,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Wem glaubt man ein Weltbild?",
    titel: "Vier Quellen, eine Behauptung",
    frage: "Woran erkennt man, welche Quelle eine physikalische Aussage verlässlich belegt?",
    schritte: ["Markiere je Zeile des Datenblatts – Schulbuch, Zeitungsartikel, Netzvideo, Fachartikel – die erfüllten Kriterien.", "Rechne die erste Behauptung mit g = G · M / r² und r = 6771 km nach.", "Vergib nach der Zahl der erfüllten Kriterien die Rangplätze 1 bis 4."]
  },
  "gw12": {
    klasse: 11, schulform: "Gymnasiale Oberstufe NRW",
    sim: "lichtuhr", seite: 123,
    kapitel: "Kreisbewegung, Gravitation und Weltbilder",
    name: "Warum geht die bewegte Uhr langsamer?",
    titel: "Ein Photon, zwei Zeitspannen",
    frage: "Warum geht eine bewegte Uhr langsamer – und für wen gilt dann welche Zeit?",
    schritte: ["Drücke „2 · Die bewegte Lichtuhr“ und stelle „Relativgeschwindigkeit v/c“ auf 0,95.", "Drücke „4 · Der relativistische Faktor“ und lies den Faktor und γ ab.", "Drücke „6 · Zeitdehnung messen“ und miss bei 0,10, 0,60, 0,84 und 0,95."]
  },
  "bl1": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-lebewesen", seite: 7,
    kapitel: "Leben um uns",
    name: "Woran erkennt man ein Lebewesen?",
    titel: "Lebt das – oder nicht?",
    frage: "Welches der vier Dinge ist ein Lebewesen?",
    schritte: ["Wähle „Bohnensamen“ und stelle „Zeit“ auf „Tag 10“.", "Trage ein, was du siehst. Stelle dann „Tag 90“ ein.", "Wiederhole das mit „Kröten-Ei“, „Schmetterlings-Ei“ und „Kieselstein“.", "Vergleiche: Welches Ding bleibt immer gleich?"]
  },
  "bl2": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-bestimmen", seite: 11,
    kapitel: "Leben um uns",
    name: "Wie bestimmt man ein Tier?",
    titel: "Wer krabbelt unter der Hecke?",
    frage: "Wie findest du den Namen eines Tieres, das du nicht kennst?",
    schritte: ["Wähle „Tier 1“. Drücke „Lupe“ und zähle die Beine.", "Drücke „Röntgenblick“. Beantworte jede Frage mit „ja“ oder „nein“.", "Trage die Beine und den Namen ein, den der Schlüssel zeigt.", "Wiederhole das mit „Tier 2“, „Tier 3“ und „Tier 4“."]
  },
  "bl3": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-bluete", seite: 15,
    kapitel: "Leben um uns",
    name: "Aus welchen Teilen besteht eine Blüte?",
    titel: "Was in der Kirschblüte steckt",
    frage: "Aus welchem Teil der Blüte wird die Kirsche?",
    schritte: ["Stelle „Teil wegnehmen“ auf „nichts“. Drücke „▶ Sommer abwarten“.", "Lies die Statuszeile ab und trage beide Zahlen ein.", "Wiederhole das mit „Blütenblätter“, „Staubblätter“ und „Stempel“.", "Beobachte bei „nichts“: Welches Teil wird dick und rot?"]
  },
  "bl4": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-keimung", seite: 19,
    kapitel: "Leben um uns",
    name: "Was braucht ein Samen zum Keimen?",
    titel: "Zehn Kressesamen im Becher",
    frage: "Was braucht ein Kressesamen zum Keimen?",
    schritte: ["Drücke „▶ 5 Tage warten“. Am Start ist alles feucht, 20 °C und hell.", "Trage ein, wie viele Samen keimen und welche Farbe die Keimlinge haben.", "Drücke „neu“. Stelle nur EINE Sache um: „trocken“, „unter Wasser“, „5 °C“ oder „dunkel“.", "Vergleiche jede Zeile mit dem Start."]
  },
  "bl5": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-wachstum", seite: 23,
    kapitel: "Leben um uns",
    name: "Wie schnell wächst eine Pflanze?",
    titel: "Die Bohne im Schrank",
    frage: "Wie wächst die Bohne im dunklen Schrank?",
    schritte: ["Drücke „▶ 2 Tage weiter“. Lies an beiden Linealen die Höhe ab.", "Trage beide Höhen in cm ein.", "Wiederhole das bis Tag 8.", "Vergleiche die Farbe der beiden Bohnen an Tag 8."]
  },
  "bl6": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-samenflug", seite: 27,
    kapitel: "Leben um uns",
    name: "Wie fliegen Samen zu neuen Orten?",
    titel: "Schirmchen und Propeller",
    frage: "Welcher Samen fliegt mit dem Wind am weitesten?",
    schritte: ["Stelle „Wind“ auf „kein Wind“. Wähle „Haselnuss“ und drücke „▶ loslassen“.", "Lies die Fallzeit ab. Stelle dann „Wind“ ein, drücke wieder „▶ loslassen“ und lies die Weite ab.", "Wiederhole das mit „Ahorn-Samen“, „Löwenzahn-Samen“ und „Papier-Propeller“.", "Vergleiche den Papier-Propeller mit dem echten Ahorn-Samen."]
  },
  "bl7": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-nahrungskette", seite: 31,
    kapitel: "Leben um uns",
    name: "Wer frisst wen?",
    titel: "Raupe, Meise, Sperber",
    frage: "Was passiert mit den Raupen, wenn die Meisen fehlen?",
    schritte: ["Wähle „niemanden“ und drücke „▶ ein Sommer vergeht“.", "Lies die Zähler ab. Trage Raupen und Meisen ein.", "Wiederhole das. Nimm nacheinander „Raupen“, „Meisen“ und „Sperber“ weg.", "Beobachte die Pfeile. Schreibe die Nahrungskette unter die Tabelle."]
  },
  "bl8": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-bienentanz", seite: 35,
    kapitel: "Leben um uns",
    name: "Wie verständigen sich Bienen?",
    titel: "Der Tanz auf der Wabe",
    frage: "Wie zeigt die Biene den anderen Bienen, wo das Futter ist?",
    schritte: ["Stelle „20 m“ und „zur Sonne hin“ ein. Drücke „▶ Tanz zeigen“.", "Trage den Tanz und die Richtung der Laufspur ein.", "Wiederhole das mit „1000 m“: einmal „zur Sonne hin“, einmal „von der Sonne weg“.", "Beobachte: Wie kommen die anderen Bienen zum Futter?"]
  },
  "bl9": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-zuechtung", seite: 39,
    kapitel: "Leben um uns",
    name: "Wie wird aus einer Wildpflanze eine Nutzpflanze?",
    titel: "Vom Wildkohl zum Kohlrabi",
    frage: "Wie bekommt man Kohl mit großen Blättern?",
    schritte: ["Stelle „Samen von“ auf „den Pflanzen mit den größten Blättern“.", "Trage Jahr 1 ein. Drücke dreimal „▶ ein Jahr weiter“ und trage jedes Jahr ein.", "Drücke „neu“. Stelle „Samen von“ auf „irgendeiner Pflanze“ und wiederhole.", "Vergleiche die beiden Spalten in Jahr 4."]
  },
  "bl10": {
    klasse: "5/6", schulform: "Gesamtschule NRW · Förderheft Biologie",
    sim: "bio-kroeten", seite: 43,
    kapitel: "Leben um uns",
    name: "Warum brauchen Kröten Hilfe?",
    titel: "Die Straße vor dem Teich",
    frage: "Was passiert mit den Kröten an der Straße?",
    schritte: ["Stelle „keine Straße“ ein. Drücke „▶ Wanderung starten“ und trage beide Zahlen ein.", "Stelle „Straße mit vielen Autos“ ein. Wiederhole die Wanderung.", "Stelle „Krötenzaun“ auf „an“. Der Zaun leitet die Kröten in Eimer. Wiederhole.", "Stelle wieder „keine Straße“ und „Teich“ auf „zugeschüttet“. Wiederhole."]
  },
};

// simId -> alle Heftseiten, die darauf zeigen
const HEFT_ZU_SIM = {};
for (const [id, d] of Object.entries(HEFT_SEITEN))
  if (d.sim) (HEFT_ZU_SIM[d.sim] = HEFT_ZU_SIM[d.sim] || []).push(id);
