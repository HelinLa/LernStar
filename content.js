/* ============================================================
   LernStar – Content Database
   Nur Mathematik & Physik (Klasse 5–10)
   Videos mit Hedda-Erklärungen für alle Themen
   ============================================================ */

const CONTENT = {

  /* =========================================================  KLASSE 5  */
  klasse5: {
    id:'klasse5', num:5, label:'Klasse 5',
    emoji:'🚀', color:['#7C3AED','#A855F7'], light:'#EDE9FE',
    tagline:'Dein Start in der weiterführenden Schule',
    subjects:[
      {
        id:'mathe', name:'Mathematik', icon:'🔢',
        desc:'Natürliche Zahlen, Grundrechenarten und erste Geometrie',
        color:'#2563EB',
        intro:'Hallo und herzlich willkommen! Ich bin dein digitaler Lernassistent für Mathematik in Klasse 5. Wir starten mit natürlichen Zahlen, Grundrechenarten, ersten Brüchen und Geometrie. Ich erkläre dir alles Schritt für Schritt mit Beispielen aus deinem Alltag!',
        topics:[
          { name:'Natürliche Zahlen & Stellenwerte', diff:1,
            explanation:'Stell dir vor, dein Lieblingsvideo auf YouTube hat 1.347.850 Aufrufe – das ist über eine Million! Damit wir solche riesigen Zahlen lesen und verstehen können, haben wir das Stellenwert-System erfunden. Jede Stelle in einer Zahl hat einen eigenen Wert, der zehnmal größer ist als die Stelle rechts davon. In der Zahl 4.723 zum Beispiel steht die 4 für 4.000, die 7 für 700, die 2 für 20 und die 3 einfach für 3. Die Position von rechts bestimmt den Wert: erste Stelle = Einer, zweite = Zehner, dritte = Hunderter, vierte = Tausender. Wenn du eine Zahl schreibst, darfst du keine Stelle vergessen – eine fehlende Null kann aus 1.023 die falsche Zahl 123 machen! Das Stellenwert-System ist die Basis für die gesamte Mathematik und wird auf der ganzen Welt verwendet.' },
          { name:'Addition und Subtraktion', diff:1,
            explanation:'Du spielst ein Handyspiel mit 1.247 Punkten und gewinnst eine Runde mit 856 Bonuspunkten – wie viele hast du insgesamt? Genau das löst du mit schriftlicher Addition! Dabei schreibst du die Zahlen so untereinander, dass Einerstelle unter Einerstelle steht, und rechnest von rechts nach links. Ergibt eine Spalte 10 oder mehr, überträgst du den Zehner als "Übertrag" zur nächsten Stelle. Subtraktion funktioniert umgekehrt: Du ziehst Stelle für Stelle ab und "borgst" dir bei Bedarf von der nächsten Stelle einen Zehner. Das Tolle: Du kannst dein Ergebnis immer überprüfen, indem du Ergebnis und subtrahierte Zahl addierst – du musst die Ausgangszahl erhalten. Diese beiden Rechenoperationen sind das Fundament der Mathematik und begegnen dir täglich: beim Einkaufen, im Sport und beim Planen. Übe sie, bis du sie sicher beherrschst!' },
          { name:'Multiplikation und Division', diff:1,
            explanation:'Du kaufst 6 Packungen mit je 14 Sammelkarten – du könntest 14 sechsmal addieren, aber es ist viel schneller: 6 × 14 = 84! Multiplikation ist schnelles Addieren gleicher Zahlen. Das kleine Einmaleins von 1×1 bis 10×10 solltest du auswendig können – es ist wie das ABC der Mathematik und macht alle späteren Berechnungen viel einfacher. Division dreht die Multiplikation um: 84 Karten gleichmäßig auf 6 Freunde verteilt ergibt 14 pro Person. Multiplikation und Division sind immer Umkehroperationen: wenn 6 × 14 = 84 gilt, dann ist auch 84 ÷ 6 = 14 und 84 ÷ 14 = 6 richtig. Prüfe dein Ergebnis immer mit der Umkehroperation nach! Teilst du mit Rest, zum Beispiel 17 ÷ 5, nennst du zuerst den ganzen Anteil (3) und dann den Rest (2) – also 3 Rest 2. Multiplikation und Division stecken in Rezepten, beim Geldwechseln, in der Musik und sogar in der Programmierung!' },
          { name:'Runden und Schätzen', diff:2,
            explanation:'An der Supermarktkasse kannst du blitzschnell abschätzen, ob dein Geld reicht: 3,95 Euro wird zu 4 Euro, 2,10 Euro zu 2 Euro – macht ungefähr 6 Euro. Genau dafür gibt es das Runden! Die Grundregel ist einfach: Schau die Stelle rechts neben der an, auf die du rundest. Ist diese Stelle 5 oder größer, rundest du auf – die Ziffer davor wird um 1 erhöht. Ist sie kleiner als 5, rundest du ab – die Ziffer davor bleibt gleich, alle Stellen rechts davon werden zu Nullen. Beispiel: 2.764 gerundet auf Hunderter – schau auf die Zehnerstelle (6 ≥ 5), also aufrunden: 2.800. Du kannst auf beliebige Stellen runden: Einer, Zehner, Hunderter, Tausender – je nach Bedarf. Schätzen geht noch einen Schritt weiter: Du rechnest mit vereinfachten Zahlen im Kopf, um schnell ein ungefähres Ergebnis zu bekommen. Ingenieure, Architekten, Kaufleute und Wissenschaftler nutzen Runden und Schätzen täglich – es spart Zeit und ist oft genau genug!' },
          { name:'Einführung in Brüche', diff:2,
            explanation:'Teilst du eine Pizza mit drei Freunden, bekommt jeder ein Viertel – das schreibt man als 1/4. Brüche beschreiben Teile eines Ganzen und begegnen uns überall: halbe Stunden, dreiviertel gefüllte Wasserflasche, ein Fünftel Rabatt! Die Zahl unten heißt Nenner und sagt, in wie viele gleiche Teile das Ganze geteilt wurde. Die Zahl oben heißt Zähler und sagt, wie viele dieser Teile du hast. Beim Vergleichen von Brüchen mit gleichem Zähler gilt: je kleiner der Nenner, desto größer das Stück – 1/2 ist größer als 1/4, weil bei 1/2 nur in zwei Teile geteilt wurde. Brüche lassen sich auch kürzen: Teile einfach Zähler und Nenner durch dieselbe Zahl – 4/8 wird zu 1/2. Ein Bruch wie 5/5 oder 8/8 ist immer gleich 1 – das ganze Ganze! Brüche und Dezimalzahlen sind eng verwandt: 1/2 = 0,5 und 1/4 = 0,25. Brüche sind überall in Mathematik, Musik, Kochen und Technik!' },
          { name:'Geometrie: Flächen und Umfang', diff:2,
            explanation:'Willst du deinem Zimmer einen neuen Teppich kaufen, brauchst du den Flächeninhalt – also wie viele Quadratmeter der Boden hat. Willst du eine Lichterkette rund ums Zimmer befestigen, brauchst du den Umfang – die Summe aller Seiten. Für ein Rechteck gilt: Fläche = Länge × Breite, und Umfang = 2 × (Länge + Breite). Ein Zimmer mit 5 m mal 4 m hat also eine Fläche von 20 m² und einen Umfang von 18 m. Flächen werden immer in quadratischen Einheiten gemessen – das hochgestellte ² erinnert dich daran, dass zwei Maße miteinander multipliziert werden. Das Quadrat ist ein besonderes Rechteck mit vier gleich langen Seiten: seine Fläche ist einfach Seite × Seite = Seite². Für ein Dreieck gilt: Fläche = (Grundlinie × Höhe) ÷ 2. Geometrie steckt in Architektur, Stadtplanung, Design und sogar in Videospielen!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Natürliche Zahlen – Stellenwerte',
            desc:'Lerne, wie Zahlen aufgebaut sind.',
            questions:[
              { q:'Welchen Stellenwert hat die Ziffer 7 in der Zahl 4.723?', hint:'Zähle die Stellen von rechts: 1. Einer, 2. Zehner, 3. Hunderter, 4. Tausender – wo ist die 7?', options:['Einer','Zehner','Hunderter','Tausender'], correct:2, explanation:'Die 7 steht an der 3. Stelle von rechts = Hunderterstelle.' },
              { q:'Welche Zahl ist größer: 3.405 oder 3.450?', hint:'Vergleiche Stelle für Stelle von links: Tausender gleich, Hunderter gleich, dann Zehner: 0 vs 5.', options:['3.405','3.450','Beide gleich','Nicht bestimmbar'], correct:1, explanation:'Zehnerstelle: 5 > 0 → 3.450 ist größer.' },
              { q:'Wie viel ist 6.000 + 400 + 80 + 3?', hint:'Schreibe die Zahl direkt auf: Tausender=6, Hunderter=4, Zehner=8, Einer=3.', options:['6.043','6.483','6.408','6.384'], correct:1, explanation:'6.000 + 400 + 80 + 3 = 6.483.' },
              { q:'Auf welche Hunderterstelle wird 2.764 gerundet?', hint:'Schau auf die Zehnerstelle: 6 ≥ 5 → aufrunden, also Hunderter von 7 auf 8.', options:['2.700','2.800','2.750','3.000'], correct:1, explanation:'2.764 ≈ 2.800 (Zehnerstelle 6 ≥ 5 → aufrunden).' },
              { q:'Welche Zahl kommt nach 9.999?', hint:'Alle Stellen sind 9. Eine weitere Addition von 1 erzeugt eine neue Stelle.', options:['9.990','10.000','9.000','10.001'], correct:1, explanation:'9.999 + 1 = 10.000.' },
              { q:'Welcher Stellenwert hat die 5 in der Zahl 15.382?', hint:'Von rechts: Einer(2), Zehner(8), Hunderter(3), Tausender(5), Zehntausender(1).', options:['Einer','Hunderter','Tausender','Zehntausender'], correct:2, explanation:'Die 5 steht an 4. Stelle von rechts = Tausenderstelle.' },
              { q:'Wie lautet 5.000 + 60 + 7 als Zahl?', hint:'Hunderter und Zehner fehlen → werden als 0 geschrieben.', options:['5.067','5.670','5.607','5.760'], correct:0, explanation:'5.000 + 0 + 60 + 7 = 5.067.' },
              { q:'Auf welche Zehnerstelle wird 1.345 gerundet?', hint:'Einerstelle = 5 ≥ 5 → Zehnerstelle aufrunden: 4 wird zu 5.', options:['1.340','1.350','1.300','1.400'], correct:1, explanation:'Einerstelle 5 ≥ 5 → aufrunden: 1.350.' },
            ]
          },
          { id:'e2', type:'Rechnen', diff:1, title:'Addieren und Subtrahieren',
            desc:'Schriftliches Rechnen üben.',
            questions:[
              { q:'Was ist 1.247 + 856?', hint:'Rechne von rechts: 7+6=13 (1 merken), 4+5+1=10 (1 merken), 2+8+1=11 (1 merken), 1+1=2.', options:['2.103','2.093','2.013','2.083'], correct:0, explanation:'1.247 + 856 = 2.103.' },
              { q:'Was ist 5.000 – 347?', hint:'Erst 5.000 – 300 = 4.700, dann 4.700 – 47 = 4.653.', options:['4.653','4.743','4.663','5.347'], correct:0, explanation:'5.000 – 347 = 4.653.' },
              { q:'□ + 483 = 1.200. Welche Zahl fehlt?', hint:'Umformen: □ = 1.200 – 483. Rechne 1.200 – 400 = 800, dann 800 – 83 = 717.', options:['717','1.683','783','817'], correct:0, explanation:'1.200 – 483 = 717.' },
              { q:'Buch: 312 Seiten. Max hat 178 gelesen. Wie viele fehlen?', hint:'312 – 178: Rechne 312 – 100 = 212, dann 212 – 78 = 134.', options:['134','144','490','124'], correct:0, explanation:'312 – 178 = 134.' },
              { q:'Was ist 9.876 – 5.432?', hint:'Subtrahiere jede Stelle: 6–2=4, 7–3=4, 8–4=4, 9–5=4.', options:['4.444','4.544','4.434','4.344'], correct:0, explanation:'9.876 – 5.432 = 4.444.' },
              { q:'Was ist 3.650 + 1.275?', hint:'Addiere: 0+5=5, 5+7=12 (1 merken), 6+2+1=9, 3+1=4.', options:['4.825','4.925','4.815','5.025'], correct:1, explanation:'3.650 + 1.275 = 4.925.' },
              { q:'Was ist 8.000 – 2.356?', hint:'Rechne schrittweise: 8.000 – 2.000 = 6.000, dann 6.000 – 356 = 5.644.', options:['5.644','5.754','6.644','5.444'], correct:0, explanation:'8.000 – 2.356 = 5.644.' },
              { q:'In einer Schule sind 847 Schüler. 392 sind Mädchen. Wie viele sind Jungen?', hint:'847 – 392: Rechne 847 – 400 = 447, dann 447 + 8 = 455.', options:['455','465','1.239','345'], correct:0, explanation:'847 – 392 = 455 Jungen.' },
            ]
          },
          { id:'e3', type:'Brüche', diff:2, title:'Einführung in Brüche',
            desc:'Zähler, Nenner und Bruchteile verstehen.',
            questions:[
              { q:'Pizza in 8 Teile geteilt, Tom isst 3. Welcher Bruch?', hint:'Zähler = wie viele Teile Tom isst (3), Nenner = Gesamtteile (8).', options:['3/8','8/3','5/8','3/5'], correct:0, explanation:'3 von 8 Teilen = 3/8.' },
              { q:'Was bedeutet der Nenner?', hint:'Der Nenner steht unten und zeigt, in wie viele gleich große Teile das Ganze geteilt wurde.', options:['Wie viele Teile man hat','In wie viele Teile geteilt','Größe eines Teils','Wie viele fehlen'], correct:1, explanation:'Nenner = Anzahl aller gleichen Teile.' },
              { q:'Welcher Bruch ist die Hälfte?', hint:'Die Hälfte bedeutet: 1 Teil von 2 gleichen Teilen = 1/2.', options:['1/3','2/4','1/2','3/6'], correct:2, explanation:'1/2 ist die Hälfte (auch 2/4 und 3/6 sind gleich, aber 1/2 ist die einfachste Form).' },
              { q:'Welcher Bruch ist am größten: 1/4, 1/2 oder 1/8?', hint:'Je kleiner der Nenner, desto größer der Bruchteil – bei gleichem Zähler (1).', options:['1/8','1/4','1/2','Alle gleich'], correct:2, explanation:'1/2 > 1/4 > 1/8 (kleinster Nenner = größtes Stück).' },
              { q:'Rechteck in 5 Teile, 2 blau. Welcher Anteil blau?', hint:'Zähler = blaue Teile (2), Nenner = alle Teile (5).', options:['5/2','2/3','2/5','3/5'], correct:2, explanation:'2 von 5 Teilen = 2/5.' },
              { q:'Kürze den Bruch 4/8 auf die einfachste Form.', hint:'Teile Zähler und Nenner durch denselben Wert: 4 und 8 sind beide durch 4 teilbar.', options:['2/4','1/2','4/8','3/6'], correct:1, explanation:'4/8 ÷ 4 = 1/2.' },
              { q:'Was ist größer: 3/5 oder 3/8?', hint:'Zähler ist gleich (3). Welcher Nenner ist kleiner?', options:['3/8','3/5','Beide gleich','Nicht vergleichbar'], correct:1, explanation:'3/5 > 3/8, weil 5 < 8 → jeder Teil bei /5 größer ist.' },
              { q:'Eine Tafel Schokolade hat 12 Stücke. Lena isst 4. Welcher Bruch bleibt übrig?', hint:'Übrig = 12 – 4 = 8 Stücke. Nenner = 12 Stücke gesamt.', options:['4/12','8/12','4/8','8/4'], correct:1, explanation:'8 von 12 Stücken = 8/12 (= 2/3 gekürzt).' },
            ]
          },
          { id:'e4', type:'Geometrie', diff:2, title:'Flächen und Umfang',
            desc:'Umfang und Flächeninhalt berechnen.',
            questions:[
              { q:'Rechteck 6 cm × 4 cm. Umfang?', hint:'Formel: U = 2×(Länge + Breite) = 2×(6+4).', options:['10 cm','20 cm','24 cm','48 cm'], correct:1, explanation:'U = 2×(6+4) = 2×10 = 20 cm.' },
              { q:'Flächeninhalt 7 cm × 3 cm?', hint:'Formel: A = Länge × Breite = 7 × 3.', options:['10 cm²','20 cm²','21 cm²','42 cm²'], correct:2, explanation:'A = 7 × 3 = 21 cm².' },
              { q:'Quadrat Umfang 32 cm. Seitenlänge?', hint:'Quadrat hat 4 gleiche Seiten: Seite = U ÷ 4 = 32 ÷ 4.', options:['4 cm','8 cm','16 cm','128 cm'], correct:1, explanation:'32 ÷ 4 = 8 cm.' },
              { q:'Einheit für Flächeninhalte?', hint:'Fläche ist zweidimensional → cm im Quadrat.', options:['cm','cm²','cm³','m'], correct:1, explanation:'Flächeninhalte werden in cm² (Quadratzentimeter) gemessen.' },
              { q:'Schulhof 40 m × 25 m. Wie groß?', hint:'A = Länge × Breite = 40 × 25. Tipp: 40 × 25 = 40 × 100 ÷ 4.', options:['65 m²','130 m²','1.000 m²','500 m²'], correct:2, explanation:'40 × 25 = 1.000 m².' },
              { q:'Rechteck: Fläche 36 cm², Breite 4 cm. Länge?', hint:'A = l × b → l = A ÷ b = 36 ÷ 4.', options:['6 cm','8 cm','9 cm','144 cm'], correct:2, explanation:'l = 36 ÷ 4 = 9 cm.' },
              { q:'Quadrat mit Seite 5 cm. Flächeninhalt?', hint:'Quadrat: A = Seite × Seite = 5 × 5.', options:['10 cm²','20 cm²','25 cm²','50 cm²'], correct:2, explanation:'A = 5 × 5 = 25 cm².' },
              { q:'Zimmer 4 m × 3,5 m. Teppich kostet 20 €/m². Gesamtkosten?', hint:'Erst Fläche: 4 × 3,5 = 14 m². Dann mal Preis: 14 × 20.', options:['150 €','280 €','340 €','700 €'], correct:1, explanation:'A = 14 m², Kosten = 14 × 20 = 280 €.' },
            ]
          },
          { id:'e6', type:'Gemischt', diff:2, title:'Gemischte Aufgaben – Klasse 5',
            desc:'Alle Themen aus Klasse 5 kombiniert üben.',
            questions:[
              { q:'Ein Buch hat 240 Seiten. Anna liest täglich 30 Seiten. Wie viele Tage braucht sie?', hint:'Gesamtseiten ÷ Seiten pro Tag = Anzahl Tage. 240 ÷ 30 = ?', options:['6','7','8','9'], correct:2, explanation:'240 ÷ 30 = 8 Tage.' },
              { q:'Rechteck: Länge 12 cm, Breite 5 cm. Wie groß ist der Flächeninhalt?', hint:'A = Länge × Breite = 12 × 5.', options:['34 cm²','50 cm²','60 cm²','17 cm²'], correct:2, explanation:'A = 12 × 5 = 60 cm².' },
              { q:'Was ist größer: 3/4 oder 5/8?', hint:'Bringe auf gemeinsamen Nenner 8: 3/4 = 6/8. Dann vergleichen.', options:['3/4','5/8','Beide gleich','Nicht vergleichbar'], correct:0, explanation:'3/4 = 6/8 > 5/8.' },
              { q:'Eine Zahl ist 5 mal so groß wie 14. Wie groß ist sie?', hint:'5 × 14 = ?', options:['19','60','65','70'], correct:3, explanation:'5 × 14 = 70.' },
              { q:'Runde 6.849 auf Hunderterstellen.', hint:'Zehnerstelle = 4 < 5 → abrunden: Hunderterstelle bleibt 8.', options:['6.800','6.900','6.850','7.000'], correct:0, explanation:'Zehnerstelle 4 < 5 → abrunden → 6.800.' },
              { q:'Quadrat mit Umfang 28 cm. Flächeninhalt?', hint:'Seite = 28 ÷ 4 = 7 cm. Dann A = 7 × 7.', options:['28 cm²','49 cm²','56 cm²','14 cm²'], correct:1, explanation:'Seite = 7 cm, A = 49 cm².' },
              { q:'5.000 – 1.348 = ?', hint:'Rechne schrittweise: 5.000 – 1.000 = 4.000, dann 4.000 – 348 = 3.652.', options:['3.652','3.752','3.642','4.652'], correct:0, explanation:'5.000 – 1.348 = 3.652.' },
              { q:'Welcher Bruch liegt auf der Hälfte zwischen 0 und 1?', hint:'Die Mitte ist genau 1 geteilt durch 2.', options:['1/3','1/4','1/2','2/3'], correct:2, explanation:'1/2 liegt genau in der Mitte zwischen 0 und 1.' },
            ]
          },
          { id:'e5', type:'Knobelaufgaben', diff:3, title:'Knobeln mit Zahlen & Figuren',
            desc:'Herausforderungen für Mathe-Profis.',
            questions:[
              { q:'Eine Zahl mal 7 minus 15 ergibt 41. Welche Zahl?', hint:'Stelle die Gleichung auf: 7x – 15 = 41. Addiere 15 auf beiden Seiten, dann teile durch 7.', options:['6','7','8','9'], correct:2, explanation:'7x = 56 → x = 8. Probe: 7×8–15 = 56–15 = 41 ✓' },
              { q:'Rechteck: Umfang 30 cm, Länge = 2 × Breite. Länge?', hint:'Sei Breite = b, dann Länge = 2b. Umfang: 2×(2b + b) = 6b = 30 → b = 5, Länge = 10.', options:['5 cm','8 cm','10 cm','12 cm'], correct:2, explanation:'b = 5 cm, l = 2×5 = 10 cm. Probe: U = 2×15 = 30 ✓' },
              { q:'Drei aufeinanderfolgende Zahlen ergeben 48. Mittlere Zahl?', hint:'Nenne sie n–1, n, n+1. Summe = 3n = 48 → n = ?', options:['14','15','16','17'], correct:2, explanation:'3n = 48 → n = 16. Die Zahlen sind 15, 16, 17.' },
              { q:'Quadrat hat doppelt so großen Flächeninhalt wie eines mit Seite 3 cm. Neue Seite?', hint:'Altes Quadrat: 3² = 9 cm². Doppelt = 18 cm². Neue Seite = √18 ≈ ?', options:['4,2 cm','4,5 cm','6 cm','9 cm'], correct:0, explanation:'√18 ≈ 4,24 cm.' },
              { q:'In einer Klasse haben 60 % der 30 Schüler ein Haustier. Wie viele haben keins?', hint:'60% haben eines → 100% – 60% = 40% haben keins. 40% von 30 = ?', options:['12','15','18','20'], correct:0, explanation:'40% × 30 = 0,4 × 30 = 12 Schüler.' },
              { q:'Ein Zug fährt 240 km in 3 Stunden. Wie weit fährt er in 5 Stunden?', hint:'Erst Geschwindigkeit berechnen: 240 ÷ 3 = 80 km/h. Dann: 80 × 5.', options:['300 km','360 km','400 km','480 km'], correct:2, explanation:'80 km/h × 5 h = 400 km.' },
              { q:'Zwei Zahlen: Summe = 100, Differenz = 24. Größere Zahl?', hint:'x + y = 100 und x – y = 24. Addiere beide Gleichungen: 2x = 124.', options:['52','60','62','76'], correct:2, explanation:'2x = 124 → x = 62. Probe: 62+38=100, 62–38=24 ✓' },
              { q:'Wie viele Rechtecke passen in ein 24 cm × 16 cm Blatt, wenn jedes 4 cm × 2 cm groß ist?', hint:'Fläche Blatt: 24×16=384 cm². Fläche Rechteck: 4×2=8 cm². 384÷8 = ?', options:['24','36','48','96'], correct:2, explanation:'384 ÷ 8 = 48 Rechtecke.' },
            ]
          },
        ]
      },
    ]
  },

  /* =========================================================  KLASSE 6  */
  klasse6: {
    id:'klasse6', num:6, label:'Klasse 6',
    emoji:'⚡', color:['#2563EB','#60A5FA'], light:'#DBEAFE',
    tagline:'Brüche, Dezimalzahlen und Proportionen',
    subjects:[
      {
        id:'mathe', name:'Mathematik', icon:'🔢',
        desc:'Brüche rechnen, Dezimalzahlen & Proportionen',
        color:'#2563EB',
        intro:'Willkommen in Mathematik Klasse 6! Heute rechnen wir mit Brüchen und Dezimalzahlen und lernen proportionale Zuordnungen kennen. Diese Themen begegnen dir täglich – beim Einkaufen, Kochen und Planen!',
        topics:[
          { name:'Brüche addieren und subtrahieren', diff:2,
            explanation:'Du isst 1/4 einer Pizza und dein Freund noch 2/4 – zusammen habt ihr 3/4 gegessen. So einfach ist Bruchaddition, wenn beide Brüche denselben Nenner haben: einfach die Zähler addieren, der Nenner bleibt gleich. Schwieriger wird es bei verschiedenen Nennern, zum Beispiel 1/3 + 1/6. Dann musst du zuerst auf einen gemeinsamen Nenner bringen: 1/3 ist dasselbe wie 2/6 (Zähler und Nenner mit 2 multipliziert). Jetzt rechne: 2/6 + 1/6 = 3/6, und das kürzt sich zu 1/2. Der gemeinsame Nenner ist das kleinste gemeinsame Vielfache beider Nenner – bei 4 und 6 wäre das 12. Bei der Subtraktion gehst du genauso vor: erst den gemeinsamen Nenner herstellen, dann die Zähler subtrahieren. Am Ende immer kürzen! Denke daran: 3/6 = 1/2 = 0,5 – alle drei beschreiben dasselbe. Bruchrechnen steckt in Rezepten, Messungen, Bauplänen und Musiknoten!' },
          { name:'Brüche multiplizieren und dividieren', diff:2,
            explanation:'Ein Rezept für 4 Personen braucht 3/4 Liter Milch – du kochst aber nur für 2 Personen, also brauchst du die Hälfte davon: 1/2 × 3/4. Bei der Bruchmultiplikation ist das ganz einfach: Zähler mit Zähler, Nenner mit Nenner multiplizieren. Also 1×3 = 3 und 2×4 = 8 – Ergebnis: 3/8 Liter. Das Schöne: Du brauchst keinen gemeinsamen Nenner! Vergiss am Ende nicht zu kürzen. Division durch einen Bruch klingt kompliziert, ist aber ein Trick: Du multiplizierst mit dem Kehrwert. Den Kehrwert erhältst du, indem du Zähler und Nenner vertauschst – der Kehrwert von 3/4 ist 4/3. Also ist 3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2 = 1,5. Diesen Trick nennt man "Dividieren durch Umkehren und Multiplizieren". Vor dem Rechnen kannst du Zähler und Nenner auch quer kürzen, um mit kleineren Zahlen zu arbeiten. Bruchmultiplikation und -division stecken in Rezepten, beim Handwerk und in der Technik!' },
          { name:'Dezimalzahlen', diff:2,
            explanation:'Der Benzinpreis an der Tankstelle zeigt 1,879 Euro pro Liter – das sind Dezimalzahlen! Sie begegnen uns überall: Preise, Temperaturen, Sportergebnisse, Medikamentendosierungen. Das Komma trennt die ganzen Zahlen links davon von den Teilen rechts davon. Die erste Stelle nach dem Komma sind Zehntel, die zweite Hundertstel, die dritte Tausendstel – also ist 1,879 Euro gleich 1 Euro + 8 Zehntelcent + 7 Hundertstelcent + 9 Tausendstelcent. Beim Addieren und Subtrahieren ist das Wichtigste: Komma unter Komma schreiben, dann wie gewohnt rechnen. Multiplikation mit 10 verschiebt das Komma eine Stelle nach rechts (3,5 × 10 = 35), Division durch 10 verschiebt es nach links (3,5 ÷ 10 = 0,35). Dezimalzahlen und Brüche sind eng verwandt: 1/4 = 0,25, 1/2 = 0,5, 3/4 = 0,75 – du kannst jederzeit zwischen beiden Darstellungen wechseln! Beim Vergleichen von Dezimalzahlen schau Stelle für Stelle von links nach rechts, z.B. ist 0,9 größer als 0,85, weil 0,90 > 0,85.' },
          { name:'Proportionale Zuordnungen', diff:3,
            explanation:'Wenn 3 Schokoriegel 2,70 Euro kosten, kosten 6 Riegel das Doppelte – genau 5,40 Euro. Das ist eine proportionale Zuordnung: verdoppelst du die Menge, verdoppelt sich der Preis. Bei proportionalen Zuordnungen ist das Verhältnis zwischen beiden Größen immer gleich – man nennt das den Proportionalitätsfaktor. Mit dem Dreisatz löst du solche Aufgaben in drei Schritten: Erst schreibst du auf, was du weißt (3 Riegel = 2,70 €), dann berechnest du eine Einheit (1 Riegel = 0,90 €), zuletzt multiplizierst du für die gewünschte Menge (5 Riegel = 4,50 €). Schreib dir immer eine Tabelle auf – das verhindert Fehler! Nicht alle Zuordnungen sind proportional: Wenn mehr Arbeiter eine Arbeit schneller erledigen, ist das antiproportional – hier nimmt eine Größe zu, während die andere abnimmt. Proportionale Zuordnungen stecken im Tanken, Kochen, Reisen, Zinsrechnen und in der Wirtschaft!' },
          { name:'Symmetrie und Spiegelung', diff:1,
            explanation:'Schmetterlinge, das Mercedes-Logo, die Eiffelturm-Silhouette – Symmetrie ist überall um uns herum! Eine Figur heißt achsensymmetrisch, wenn du sie an einer Linie (der Symmetrieachse) spiegeln kannst und beide Hälften exakt übereinanderliegen. Buchstaben wie A, M, T, U, V, W und Y sind symmetrisch; B, C, D, E haben eine waagerechte Symmetrieachse; S und Z dagegen sind überhaupt nicht symmetrisch. Beim Spiegeln wird jeder Punkt der Figur auf die andere Seite der Achse "geklappt", wobei sein Abstand zur Achse gleich bleibt. Eine Figur kann sogar mehrere Symmetrieachsen haben: Ein Quadrat hat vier, ein gleichseitiges Dreieck drei, ein Kreis sogar unendlich viele! Punktsymmetrie ist anders: Eine Figur ist punktsymmetrisch, wenn man sie um 180° um einen Mittelpunkt drehen kann und sie danach gleich aussieht – wie ein S oder eine Raute. Symmetrie ist nicht nur schön, sondern steckt auch in Physik, Chemie, Molekülstrukturen, Musik und Computeranimation!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Brüche – Grundbegriffe',
            desc:'Was sind Brüche? Zähler, Nenner, einfache Darstellung.',
            questions:[
              { q:'Was ist der Nenner eines Bruchs?', hint:'Merke: Nenner = unten (wie "Nenne den Baugrund"). Er zeigt, in wie viele gleiche Teile das Ganze aufgeteilt wurde.', options:['Zahl oben','Zahl unten','Ergebnis der Division','Differenz'], correct:1, explanation:'Der Nenner steht unten und gibt an, in wie viele Teile geteilt wurde.' },
              { q:'Wie lautet ¾ als Aussage?', hint:'Bruchstrich = geteilt durch. Sprich: Zähler geteilt durch Nenner.', options:['3 mal 4','3 durch 4','4 minus 3','3 plus 4'], correct:1, explanation:'¾ = 3 geteilt durch 4.' },
              { q:'Welcher Bruch entspricht einer Hälfte?', hint:'Ein Ganzes in 2 gleiche Teile geteilt, du nimmst 1 Teil.', options:['2/1','1/4','1/2','2/3'], correct:2, explanation:'1/2 = eine Hälfte.' },
              { q:'Erweitere 1/3 auf Sechstel.', hint:'3 × 2 = 6. Zähler und Nenner beide mit 2 multiplizieren.', options:['2/3','2/6','3/6','1/6'], correct:1, explanation:'1/3 × (2/2) = 2/6.' },
              { q:'Welcher Bruch ist kleiner: 1/3 oder 1/5?', hint:'Stell dir vor: Eine Pizza in 3 Teile vs. in 5 Teile. Welches Stück ist kleiner?', options:['1/3','1/5','Beide gleich','Nicht vergleichbar'], correct:1, explanation:'1/5 < 1/3: bei mehr Teilen ist jedes Stück kleiner.' },
              { q:'Kürze 8/12 auf die einfachste Form.', hint:'Was ist der größte gemeinsame Teiler von 8 und 12? → 4. Teile beide durch 4.', options:['4/6','2/3','3/4','8/12'], correct:1, explanation:'8/12 ÷ 4 = 2/3.' },
              { q:'Was ist der Kehrwert von 3/4?', hint:'Beim Kehrwert tauscht du Zähler und Nenner.', options:['4/3','3/4','1/4','4/1'], correct:0, explanation:'Kehrwert von 3/4 ist 4/3.' },
              { q:'Erweitere 2/5 auf Zehntel.', hint:'5 × 2 = 10. Multipliziere Zähler und Nenner mit 2.', options:['2/10','4/10','4/5','10/2'], correct:1, explanation:'2/5 × (2/2) = 4/10.' },
            ]
          },
          { id:'e2', type:'Brüche', diff:2, title:'Addieren & Subtrahieren – gleicher Nenner',
            desc:'Brüche mit demselben Nenner addieren und subtrahieren.',
            questions:[
              { q:'Was ist die Regel beim Addieren von Brüchen mit gleichem Nenner?', hint:'Schau auf den Nenner: Was passiert damit? Und was passiert mit den Zählern?', options:['Zähler und Nenner addieren','Nur die Zähler addieren, Nenner bleibt gleich','Nenner addieren, Zähler bleibt gleich','Beide Zähler multiplizieren'], correct:1, explanation:'Nur die Zähler werden addiert. Der Nenner bleibt unverändert, da er die Teilgröße beschreibt.' },
              { q:'Was ist 2/7 + 3/7?', hint:'Gleicher Nenner 7 → Zähler addieren: 2 + 3 = ?', options:['5/14','5/7','6/7','1/7'], correct:1, explanation:'2/7 + 3/7 = (2+3)/7 = 5/7.' },
              { q:'Was ist 8/11 – 3/11?', hint:'Gleicher Nenner → Zähler subtrahieren: 8 – 3 = ?', options:['5/22','11/11','5/11','3/11'], correct:2, explanation:'8/11 – 3/11 = (8–3)/11 = 5/11.' },
              { q:'Tobias isst 3/10 einer Pizza, sein Freund Leon isst 4/10. Wie viel haben beide zusammen gegessen?', hint:'Gleicher Nenner 10 → Zähler addieren. Lässt sich das Ergebnis kürzen?', options:['7/20','7/10','1/2','12/10'], correct:1, explanation:'3/10 + 4/10 = 7/10. (Lässt sich nicht weiter kürzen.)' },
              { q:'Welche Zahl gehört in die Lücke? □/12 + 5/12 = 11/12', hint:'Denke rückwärts: 11/12 – 5/12 = ? Zähler: 11 – 5 = ?', options:['4','6','5','16'], correct:1, explanation:'11 – 5 = 6, also lautet der fehlende Bruch 6/12.' },
              { q:'Was ist 2/9 + 3/9 + 1/9?', hint:'Drei Brüche, gleicher Nenner → alle Zähler zusammen addieren: 2 + 3 + 1 = ?', options:['6/27','6/9','7/9','2/3'], correct:1, explanation:'2/9 + 3/9 + 1/9 = (2+3+1)/9 = 6/9 = 2/3 (gekürzt).' },
              { q:'Was ist 3 2/5 + 2/5? (als gemischte Zahl)', hint:'Ganzzahl bleibt: 3. Rechne nur die Bruchteile: 2/5 + 2/5 = 4/5. Zusammensetzen.', options:['5 4/5','3 4/5','4 2/5','6/5'], correct:1, explanation:'3 2/5 + 2/5 = 3 + (2+2)/5 = 3 4/5.' },
              { q:'5/8 + 4/8 = ? Schreibe als gemischte Zahl.', hint:'5 + 4 = 9, also 9/8. 8/8 ist ein Ganzes → wie viel bleibt übrig?', options:['9/8','1 2/8','1 1/8','2 1/8'], correct:2, explanation:'9/8 = 8/8 + 1/8 = 1 1/8 als gemischte Zahl.' },
            ]
          },
          { id:'e3', type:'Dezimal', diff:2, title:'Dezimalzahlen',
            desc:'Rechnen mit Kommazahlen.',
            questions:[
              { q:'Was ist 2,4 + 1,8?', hint:'Schreibe Komma unter Komma: 4+8=12 (1 merken), 2+1+1=4 → 4,2.', options:['3,2','4,2','4,12','3,12'], correct:1, explanation:'2,4 + 1,8 = 4,2.' },
              { q:'Was ist 5,0 – 2,7?', hint:'5,0 – 2,0 = 3,0, dann 3,0 – 0,7 = 2,3.', options:['2,3','3,3','7,7','2,7'], correct:0, explanation:'5,0 – 2,7 = 2,3.' },
              { q:'Was bedeutet 3,45?', hint:'Links vom Komma: Einer. Rechts: 1. Stelle = Zehntel, 2. Stelle = Hundertstel.', options:['Drei Komma fünfundvierzig','Dreiundvierzig Komma fünf','Dreihundertfünfundvierzig','Drei und fünf'], correct:0, explanation:'3,45 = 3 Einer + 4 Zehntel + 5 Hundertstel.' },
              { q:'Größer: 0,9 oder 0,85?', hint:'Schreibe 0,9 als 0,90 → dann Vergleich Stelle für Stelle: 90 > 85.', options:['0,85','0,9','Beide gleich','Kommt drauf an'], correct:1, explanation:'0,90 > 0,85 → 0,9 ist größer.' },
              { q:'Was ist 3,6 × 10?', hint:'Mal 10 → Komma eine Stelle nach rechts: 3,6 → 36.', options:['0,36','3,60','36','360'], correct:2, explanation:'3,6 × 10 = 36.' },
              { q:'Was ist 1,25 + 2,5?', hint:'Schreibe 2,5 als 2,50: 25 + 50 = 75 → 3,75.', options:['3,55','3,75','3,70','4,25'], correct:1, explanation:'1,25 + 2,50 = 3,75.' },
              { q:'Was ist 6,0 ÷ 100?', hint:'Geteilt durch 100 → Komma zwei Stellen nach links.', options:['600','0,6','0,06','60'], correct:2, explanation:'6,0 ÷ 100 = 0,06.' },
              { q:'Sortiere von klein nach groß: 0,3 | 0,03 | 0,33', hint:'Stelle für Stelle vergleichen: 0,03 < 0,30 < 0,33.', options:['0,03 – 0,3 – 0,33','0,3 – 0,03 – 0,33','0,33 – 0,3 – 0,03','0,3 – 0,33 – 0,03'], correct:0, explanation:'0,03 < 0,3 < 0,33.' },
            ]
          },
          { id:'e4', type:'Proportionen', diff:3, title:'Proportionale Zuordnungen',
            desc:'Dreisatzaufgaben lösen.',
            questions:[
              { q:'3 Bleistifte = 1,50 €. Was kosten 7?', hint:'Schritt 1: Preis für 1 Stift = 1,50 ÷ 3. Schritt 2: × 7.', options:['3,00 €','3,50 €','3,80 €','4,00 €'], correct:1, explanation:'1 Stift = 0,50 €. 7 × 0,50 = 3,50 €.' },
              { q:'Auto: 120 km in 2 h. Wie weit in 5 h?', hint:'Geschwindigkeit = 120 ÷ 2 = 60 km/h. Dann 60 × 5.', options:['240 km','300 km','250 km','360 km'], correct:1, explanation:'60 km/h × 5 h = 300 km.' },
              { q:'Was bedeutet proportional?', hint:'Stell dir eine Tabelle vor: verdoppelst du eine Größe, verdoppelt sich die andere genauso.', options:['Größe wird kleiner','Beide wachsen gleich','Unabhängig','Eine bleibt gleich'], correct:1, explanation:'Proportional = beide Größen wachsen im gleichen Verhältnis.' },
              { q:'5 Arbeiter = 8 Tage. 10 Arbeiter = wie viele Tage?', hint:'Mehr Arbeiter → weniger Tage. Das ist antiproportional: doppelt so viele Arbeiter = halb so viele Tage.', options:['16','8','4','40'], correct:2, explanation:'Antiproportional: 10 Arbeiter = 4 Tage.' },
              { q:'Rezept für 4 Personen braucht 300 g Mehl. Für 6 Personen?', hint:'Erst für 1 Person: 300 ÷ 4 = 75 g. Dann × 6.', options:['400 g','450 g','500 g','600 g'], correct:1, explanation:'75 g × 6 = 450 g.' },
              { q:'6 Äpfel kosten 2,40 €. Wie viele bekommst du für 4,00 €?', hint:'Preis pro Apfel: 2,40 ÷ 6 = 0,40 €. Dann: 4,00 ÷ 0,40.', options:['8','9','10','12'], correct:2, explanation:'0,40 € pro Apfel → 4,00 ÷ 0,40 = 10 Äpfel.' },
              { q:'Maßstab 1:100. Im Plan 3 cm → Wirklichkeit?', hint:'1 cm im Plan = 100 cm = 1 m in Wirklichkeit. Also: 3 × 100 cm.', options:['3 m','30 m','300 cm','3.000 cm'], correct:2, explanation:'3 cm × 100 = 300 cm = 3 m.' },
              { q:'Zug: 450 km in 3 h. Wie lange für 600 km?', hint:'Schritt 1: Zeit pro km = 3 ÷ 450. Oder: Geschwindigkeit = 450 ÷ 3 = 150 km/h → 600 ÷ 150.', options:['3 h','4 h','5 h','6 h'], correct:1, explanation:'150 km/h → 600 ÷ 150 = 4 Stunden.' },
            ]
          },
          { id:'e5', type:'Gemischt', diff:2, title:'Gemischte Aufgaben – Klasse 6',
            desc:'Brüche, Dezimalzahlen und Dreisatz kombiniert.',
            questions:[
              { q:'Was ist 0,5 + 1/4?', hint:'0,5 = 1/2 = 2/4. Dann: 2/4 + 1/4 = ?', options:['3/4','0,75','Beide Antworten sind richtig','1/6'], correct:2, explanation:'0,5 + 0,25 = 0,75 = 3/4 – beide Darstellungen stimmen.' },
              { q:'5 Hefte kosten 6,25 €. Was kostet 1 Heft?', hint:'Dreisatz: 6,25 ÷ 5 = ?', options:['1,00 €','1,25 €','1,50 €','0,75 €'], correct:1, explanation:'6,25 ÷ 5 = 1,25 € pro Heft.' },
              { q:'Was ist 3/4 × 8?', hint:'3/4 × 8 = (3 × 8) ÷ 4 = 24 ÷ 4.', options:['2','6','8','24'], correct:1, explanation:'3/4 × 8 = 24/4 = 6.' },
              { q:'Sortiere: 0,6 | 3/5 | 5/8 von klein nach groß.', hint:'Wandle um: 0,6 = 3/5 = 0,600; 5/8 = 0,625. Dann vergleichen.', options:['3/5 – 0,6 – 5/8','5/8 – 0,6 – 3/5','0,6 – 5/8 – 3/5','Alle gleich'], correct:0, explanation:'3/5 = 0,6 = 0,600 < 5/8 = 0,625. Also: 3/5 = 0,6 < 5/8.' },
              { q:'12 Brötchen kosten 3,60 €. Was kosten 8 Brötchen?', hint:'Preis pro Brötchen: 3,60 ÷ 12 = 0,30 €. Dann × 8.', options:['2,00 €','2,40 €','2,80 €','3,00 €'], correct:1, explanation:'0,30 × 8 = 2,40 €.' },
              { q:'Kürze 15/20 auf die einfachste Form.', hint:'GGT von 15 und 20 ist 5. Dividiere beide durch 5.', options:['3/4','5/7','3/5','15/20'], correct:0, explanation:'15 ÷ 5 = 3, 20 ÷ 5 = 4 → 3/4.' },
              { q:'Was ist 2,5 × 4?', hint:'2,5 × 4 = 2 × 4 + 0,5 × 4 = 8 + 2.', options:['8','9','10','12'], correct:2, explanation:'2,5 × 4 = 10.' },
              { q:'Maßstab 1:50. Im Plan: 4 cm. Wirklichkeit?', hint:'4 cm × 50 = 200 cm = 2 m.', options:['4 m','2 m','200 m','0,08 m'], correct:1, explanation:'4 × 50 = 200 cm = 2 m.' },
            ]
          },
        ]
      },
    ]
  },

  /* =========================================================  KLASSE 7  */
  klasse7: {
    id:'klasse7', num:7, label:'Klasse 7',
    emoji:'🧮', color:['#0D9488','#2DD4BF'], light:'#CCFBF1',
    tagline:'Gleichungen, Dreiecke und erste Physik',
    subjects:[
      {
        id:'mathe', name:'Mathematik', icon:'🔢',
        desc:'Rationale Zahlen, Gleichungen & Dreiecke',
        color:'#2563EB',
        intro:'Herzlich willkommen in Mathematik Klasse 7! Wir lösen Gleichungen, rechnen mit negativen Zahlen und erkunden Dreiecke. Diese Themen sind das Fundament für die gesamte Oberstufe!',
        topics:[
          { name:'Negative Zahlen und rationale Zahlen', diff:2,
            explanation:'Im Winter zeigt das Thermometer minus 8 Grad Celsius – das sind negative Zahlen! Schulden, Minusgrade, der Meeresspiegel und Stockwerke unter der Erde zeigen: Negative Zahlen sind überall. Auf der Zahlengeraden liegen sie links der Null – je weiter links, desto kleiner die Zahl: –7 < –3 < 0 < 5. Addition mit negativen Zahlen: –3 + 7 = 4 (7 Schritte nach rechts starten von –3). Subtraktion: –3 – 5 = –8 (5 Schritte weiter nach links). Die wichtigste Regel bei Multiplikation und Division: Zwei negative Vorzeichen ergeben ein positives! Also: (–4) × (–3) = +12. Aber: positiv × negativ ergibt immer negativ – (–4) × 3 = –12. Diese Vorzeichenregeln gelten auch für die Division. Rationale Zahlen sind alle Zahlen, die sich als Bruch schreiben lassen – also auch Dezimalzahlen und alle ganzen Zahlen. Negative Zahlen machen Mathematik vollständig: Ohne sie könnten wir keine Temperaturen, Schulden, Tiefen oder Zeitpunkte vor einem Ereignis ausdrücken!' },
          { name:'Lineare Gleichungen lösen', diff:2,
            explanation:'Ich denke an eine Zahl, addiere 5 und erhalte 12 – welche Zahl war es? Das ist eine lineare Gleichung: x + 5 = 12. Das Geheimnis beim Lösen ist: Eine Gleichung ist wie eine Waage – was du auf einer Seite tust, musst du auf der anderen auch tun! Subtrahiere 5 auf beiden Seiten: x + 5 – 5 = 12 – 5, also x = 7. Schwieriger: 2x + 4 = 14. Erst –4 auf beiden Seiten: 2x = 10. Dann ÷2: x = 5. Mache immer eine Probe: 2×5 + 4 = 14. Wenn x auf beiden Seiten steht, z.B. 3x + 7 = x + 13, sammle erst alle x-Terme auf einer Seite: 3x – x = 13 – 7, also 2x = 6, x = 3. Probe: 3×3+7 = 16 und 3+13 = 16. Erlaubte Umformungen sind: Addieren/Subtrahieren derselben Zahl auf beiden Seiten, und Multiplizieren/Dividieren durch dieselbe Zahl (ausser 0). Lineare Gleichungen stecken in Physik, Chemie, Wirtschaft und überall in der Wissenschaft!' },
          { name:'Dreiecke: Arten und Winkelsumme', diff:2,
            explanation:'Das Dach eines Hauses, ein Bootssegel, das Adidas-Logo, die ägyptischen Pyramiden – überall Dreiecke! Die wichtigste Regel: Die Winkelsumme in jedem Dreieck beträgt immer genau 180 Grad. Kennst du zwei Winkel, berechnest du den dritten einfach: 180° minus die beiden bekannten Winkel. Beim gleichseitigen Dreieck sind alle drei Seiten gleich lang und alle drei Winkel je 60°. Das gleichschenklige Dreieck hat zwei gleich lange Seiten und zwei gleich große Basiswinkel. Das rechtwinklige Dreieck hat genau einen 90°-Winkel und ist die Grundlage des berühmten Satzes von Pythagoras. Ein stumpfwinkliges Dreieck hat einen Winkel größer als 90°, ein spitzwinkliges Dreieck hat alle Winkel kleiner als 90°. Dreiecke sind die stabilste geometrische Form: Deshalb nutzen Brücken, Kräne und Fachwerkkonstruktionen überall Dreiecke in ihren Strukturen. Diese Eigenschaft der Dreiecke – Starrheit und Stabilität – macht sie unverzichtbar in der Architektur und im Ingenieurwesen!' },
          { name:'Terme und Variablen', diff:3,
            explanation:'In der Formel U = 2×(Länge + Breite) stehen "Länge" und "Breite" für beliebige Werte – das sind Variablen, Platzhalter für Zahlen, die wir noch nicht kennen oder die sich ändern können. Ein Term ist ein mathematischer Ausdruck mit Zahlen, Variablen und Rechenzeichen, wie 3x + 2y – 5. Beim Vereinfachen sammelst du gleichartige Glieder zusammen: 3x + 2x = 5x, oder 4a – a + 3 = 3a + 3. Wichtig: Nur Terme mit derselben Variable und Potenz lassen sich zusammenfassen – 3x + 2y bleibt so, weil x und y verschiedene Variablen sind! Beim Ausmultiplizieren (Distributivgesetz) löst du Klammern auf: 3(x + 4) = 3x + 12 – jedes Glied in der Klammer wird mit dem Faktor multipliziert. Steht vor der Klammer ein Minuszeichen, dreht sich jedes Vorzeichen darin um: –(x + 3) = –x – 3. Du kannst auch umgekehrt vorgehen und gemeinsame Faktoren ausklammern: 4x + 6 = 2(2x + 3). Diese Fähigkeiten sind das absolute Fundament für alle weiteren Themen der Algebra!' },
          { name:'Prozentrechnungen', diff:3,
            explanation:'Sale – 25 Prozent Rabatt auf Sneakers! Wenn die Schuhe 80 Euro kosten, sparst du 25% × 80 = 20 Euro und zahlst nur noch 60 Euro. Prozentrechnung ist vielleicht das wichtigste Alltagswerkzeug der Mathematik! Das Wort "Prozent" kommt vom lateinischen "pro centum" und bedeutet "von Hundert". Es gibt drei Grundaufgaben: Erstens den Prozentwert berechnen: 25% von 80 € = 0,25 × 80 = 20 €. Zweitens den Prozentsatz berechnen: 20 von 80 sind wie viel Prozent? – 20 ÷ 80 × 100 = 25%. Drittens den Grundwert berechnen: Wenn 30% schon 45 sind, was ist dann 100%? – 45 ÷ 0,30 = 150. Merke dir diese drei Formeln und du kannst jede Prozentaufgabe lösen. Prozente begegnen dir bei Mehrwertsteuer (19%), Akku-Ladestand, Schulnoten, Sportergebnissen, Zinsen und Rabatten. Und vergiss nicht: 25% = 25/100 = 1/4 – Prozente sind einfach Brüche mit Nenner 100!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Negative Zahlen – Grundlagen',
            desc:'Mit negativen Zahlen umgehen und rechnen.',
            questions:[
              { q:'Was ist –3 + 7?', hint:'Stelle dir eine Zahlengeraden vor. Starte bei –3, gehe 7 Schritte nach rechts.', options:['–4','4','10','–10'], correct:1, explanation:'–3 + 7 = 4.' },
              { q:'Was ist –5 – 2?', hint:'Subtraktion = weitere Schritte nach links. Starte bei –5, gehe 2 nach links.', options:['–3','3','–7','7'], correct:2, explanation:'–5 – 2 = –7.' },
              { q:'Was ist –4 × (–3)?', hint:'Vorzeichen-Regel: Minus × Minus = Plus. Dann: 4 × 3 berechnen.', options:['–12','12','–7','7'], correct:1, explanation:'(–4) × (–3) = +12.' },
              { q:'Was ist –12 ÷ 4?', hint:'Vorzeichen: Minus ÷ Plus = Minus. Betrag: 12 ÷ 4 = 3.', options:['–3','3','–48','48'], correct:0, explanation:'–12 ÷ 4 = –3.' },
              { q:'Welche Zahl liegt auf der Zahlengeraden zwischen –2 und 0?', hint:'Nur Ganzzahlen: –2, –1, 0. Welche liegt dazwischen?', options:['–3','1','–1','2'], correct:2, explanation:'–1 liegt zwischen –2 und 0.' },
              { q:'Was ist –8 + (–3)?', hint:'Plus vor der Klammer: –8 + (–3) = –8 – 3. Schritte nach links.', options:['–5','5','–11','11'], correct:2, explanation:'–8 + (–3) = –8 – 3 = –11.' },
              { q:'Ordne von klein nach groß: –3, 1, –7, 0', hint:'Auf der Zahlengeraden: je weiter links, desto kleiner.', options:['–3, –7, 0, 1','–7, –3, 0, 1','0, –3, –7, 1','1, 0, –3, –7'], correct:1, explanation:'–7 < –3 < 0 < 1.' },
              { q:'Was ist 6 – (–4)?', hint:'Minus vor negativer Zahl umdrehen: 6 – (–4) = 6 + 4.', options:['2','–2','10','–10'], correct:2, explanation:'6 – (–4) = 6 + 4 = 10.' },
            ]
          },
          { id:'e2', type:'Algebra', diff:2, title:'Lineare Gleichungen lösen',
            desc:'Finde die unbekannte Variable x.',
            questions:[
              { q:'Löse: x + 5 = 12', hint:'Was muss von beiden Seiten subtrahiert werden, damit x allein steht? Beide Seiten – 5.', options:['x = 7','x = 17','x = 6','x = 5'], correct:0, explanation:'x + 5 – 5 = 12 – 5 → x = 7. Probe: 7+5=12 ✓' },
              { q:'Löse: 3x = 18', hint:'x allein: beide Seiten durch 3 dividieren.', options:['x = 21','x = 15','x = 6','x = 54'], correct:2, explanation:'3x ÷ 3 = 18 ÷ 3 → x = 6.' },
              { q:'Löse: 2x + 4 = 14', hint:'Schritt 1: –4 auf beiden Seiten → 2x = 10. Schritt 2: ÷2 auf beiden Seiten.', options:['x = 9','x = 5','x = 7','x = 4'], correct:1, explanation:'2x = 10 → x = 5. Probe: 2×5+4=14 ✓' },
              { q:'Löse: x/3 = 7', hint:'x allein: beide Seiten × 3. Aus x/3 × 3 = x.', options:['x = 10','x = 4','x = 21','x = 3'], correct:2, explanation:'x = 7 × 3 = 21.' },
              { q:'Löse: 5x – 3 = 22', hint:'Schritt 1: +3 auf beiden Seiten → 5x = 25. Schritt 2: ÷5.', options:['x = 5','x = 4','x = 25','x = 3'], correct:0, explanation:'5x = 25 → x = 5. Probe: 5×5–3=22 ✓' },
              { q:'Löse: –2x = 10', hint:'Beide Seiten durch –2 dividieren. Achtung: Vorzeichen beachten!', options:['x = –5','x = 5','x = –20','x = 20'], correct:0, explanation:'x = 10 ÷ (–2) = –5.' },
              { q:'Löse: 3x + 7 = x + 13', hint:'x-Terme auf eine Seite: –x auf beiden Seiten → 2x + 7 = 13. Dann –7.', options:['x = 3','x = 6','x = 10','x = 2'], correct:0, explanation:'2x = 6 → x = 3. Probe: 3×3+7=16=3+13 ✓' },
              { q:'Löse: x/4 – 2 = 3', hint:'Schritt 1: +2 auf beiden Seiten → x/4 = 5. Schritt 2: ×4.', options:['x = 4','x = 20','x = 8','x = 12'], correct:1, explanation:'x/4 = 5 → x = 20.' },
            ]
          },
          { id:'e3', type:'Geometrie', diff:2, title:'Dreiecke und Winkelsummen',
            desc:'Dreiecksarten und Winkel berechnen.',
            questions:[
              { q:'Winkelsumme in jedem Dreieck?', hint:'Merksatz: Alle drei Innenwinkel zusammen ergeben immer denselben Wert.', options:['90°','180°','360°','270°'], correct:1, explanation:'Die Winkelsumme im Dreieck beträgt immer 180°.' },
              { q:'Winkel 60° und 80°. Dritter Winkel?', hint:'Rechne: 180° – (1. Winkel) – (2. Winkel) = 180° – 60° – 80°.', options:['40°','50°','30°','140°'], correct:0, explanation:'180° – 60° – 80° = 40°.' },
              { q:'Was ist ein gleichseitiges Dreieck?', hint:'„Gleich" + „seitig" → alle Seiten gleich lang. Was folgt für die Winkel?', options:['Alle Winkel 90°','Alle Seiten & Winkel gleich (je 60°)','Zwei Seiten gleich','Keine Seite gleich'], correct:1, explanation:'3 gleiche Seiten → 3 gleiche Winkel à 60°.' },
              { q:'Was ist ein rechtwinkliges Dreieck?', hint:'„Rechtwinklig" = enthält einen rechten Winkel (90°). Symbol: kleines Quadrat in der Ecke.', options:['Hat einen 90°-Winkel','3 gleiche Seiten','2 gleiche Seiten','Alle Winkel < 90°'], correct:0, explanation:'Genau ein Winkel = 90°.' },
              { q:'Zwei Winkel je 45°. Dritter Winkel?', hint:'180° – 45° – 45° = ?', options:['45°','90°','135°','180°'], correct:1, explanation:'180° – 90° = 90°.' },
              { q:'Was ist ein gleichschenkliges Dreieck?', hint:'„Gleichschenklig" = zwei gleiche Schenkel (Seiten). Was gilt für die Basiswinkel?', options:['3 gleiche Seiten','2 gleiche Seiten und 2 gleiche Winkel','Alle Winkel 60°','Einen 90°-Winkel'], correct:1, explanation:'Zwei gleiche Seiten → zwei gleiche Basiswinkel.' },
              { q:'Dreieck: 2 Winkel sind 70° und 40°. Dritter?', hint:'Nutze: α + β + γ = 180°.', options:['60°','70°','80°','110°'], correct:1, explanation:'180° – 70° – 40° = 70°.' },
              { q:'Wann ist ein Dreieck stumpfwinklig?', hint:'„Stumpf" = größer als 90°.', options:['Alle Winkel < 90°','Ein Winkel = 90°','Ein Winkel > 90°','Alle Winkel gleich'], correct:2, explanation:'Stumpfwinkliges Dreieck hat einen Winkel > 90°.' },
            ]
          },
          { id:'e4', type:'Prozent', diff:3, title:'Prozentrechnung',
            desc:'Grundwert, Prozentwert und Prozentsatz.',
            questions:[
              { q:'20 % von 150?', hint:'Formel: Prozentwert = Grundwert × Prozentsatz ÷ 100. Oder: 0,20 × 150.', options:['25','30','20','15'], correct:1, explanation:'0,20 × 150 = 30.' },
              { q:'T-Shirt 40 €, 25 % Rabatt. Neuer Preis?', hint:'Schritt 1: Rabatt = 25% × 40 = 10 €. Schritt 2: 40 – 10 = ?', options:['30 €','35 €','25 €','32 €'], correct:0, explanation:'Rabatt: 0,25 × 40 = 10 €. Neuer Preis: 40 – 10 = 30 €.' },
              { q:'Wie viel Prozent sind 15 von 60?', hint:'Formel: Prozentsatz = (Anteil ÷ Ganzes) × 100 = (15 ÷ 60) × 100.', options:['15 %','25 %','40 %','20 %'], correct:1, explanation:'15 ÷ 60 = 0,25 = 25 %.' },
              { q:'Preis +10 % von 200 €. Neuer Preis?', hint:'10% von 200 = 20 €. Dann zum ursprünglichen Preis addieren.', options:['210 €','220 €','202 €','180 €'], correct:1, explanation:'200 + 20 = 220 €.' },
              { q:'Von 80 auf 100 erhöht. Prozentuale Steigerung?', hint:'Zunahme = 20. Formel: (Zunahme ÷ Ausgangswert) × 100 = (20 ÷ 80) × 100.', options:['20 %','25 %','80 %','100 %'], correct:1, explanation:'(20 ÷ 80) × 100 = 25 %.' },
              { q:'Grundwert gesucht: 30 % = 45. Was ist 100 %?', hint:'Formel: Grundwert = Prozentwert ÷ Prozentsatz × 100 = 45 ÷ 0,30.', options:['13,5','135','150','1.350'], correct:2, explanation:'45 ÷ 0,30 = 150.' },
              { q:'Preis nach 20 % Rabatt: 64 €. Ursprünglicher Preis?', hint:'Nach Rabatt = 80% des Originals. Grundwert = 64 ÷ 0,80.', options:['51,20 €','76,80 €','80 €','84 €'], correct:2, explanation:'64 ÷ 0,80 = 80 €.' },
              { q:'Klasse: 12 Mädchen, 18 Jungen. Anteil Mädchen in %?', hint:'Gesamt = 30. Formel: 12 ÷ 30 × 100.', options:['12 %','33 %','40 %','60 %'], correct:2, explanation:'12 ÷ 30 = 0,4 = 40 %.' },
            ]
          },
        ]
      },
      {
        id:'physik', name:'Physik', icon:'⚡',
        desc:'Kräfte, Bewegung und einfache Maschinen',
        color:'#0284C7',
        intro:'Willkommen in Physik Klasse 7! Hier lernst du die Grundlagen der Mechanik kennen – Kräfte, Bewegungen und einfache Maschinen. Physik erklärt dir, warum Dinge so funktionieren, wie sie es tun!',
        topics:[
          { name:'Kraft und Kraftmessung', diff:1,
            explanation:'Wenn du einen Ball wirfst, eine Tür aufdrückst oder eine Schubkarre schiebst – du übst immer eine Kraft aus! Kräfte können zwei Dinge bewirken: Sie verändern den Bewegungszustand eines Körpers (er beschleunigt, bremst oder ändert die Richtung), oder sie verformen ihn (ein Gummiball beim Aufprall). Die Einheit der Kraft ist Newton (N), benannt nach dem berühmten Wissenschaftler Isaac Newton. Ein Newton entspricht ungefähr dem Gewicht eines kleinen Apfels. Auf der Erde hat 1 Kilogramm Masse eine Gewichtskraft von etwa 9,81 N – vereinfacht sagen wir oft 10 N pro kg. Mit einem Federkraftmesser kannst du Kräfte direkt messen: Die Feder dehnt sich proportional zur wirkenden Kraft aus. Kräfte haben immer eine Richtung und einen Betrag – sie sind sogenannte Vektoren und werden als Pfeile dargestellt. Mehrere Kräfte können sich addieren oder gegenseitig aufheben – wenn zwei gleich starke Kräfte entgegengesetzt wirken, ist die Gesamtkraft null und der Körper bewegt sich nicht.' },
          { name:'Geschwindigkeit und Bewegung', diff:1,
            explanation:'Ein Auto fährt auf der Autobahn 130 km/h – das ist seine Durchschnittsgeschwindigkeit! Die Grundformel lautet: Geschwindigkeit (v) = Weg (s) ÷ Zeit (t). Fährst du 180 km in 2 Stunden, ist deine Geschwindigkeit 90 km/h. Du kannst die Formel auch umstellen: Weg = Geschwindigkeit × Zeit (s = v × t) und Zeit = Weg ÷ Geschwindigkeit (t = s ÷ v). In der Physik rechnen wir oft in Metern pro Sekunde (m/s): Um km/h in m/s umzurechnen, dividiere durch 3,6. Also: 36 km/h ÷ 3,6 = 10 m/s. Gleichförmige Bewegung bedeutet: Die Geschwindigkeit bleibt immer gleich, der zurückgelegte Weg wächst gleichmäßig mit der Zeit. Im Gegensatz dazu gibt es beschleunigte Bewegung: Beim Anfahren eines Autos oder beim freien Fall wächst die Geschwindigkeit mit der Zeit. Die Beschleunigung gibt an, wie schnell sich die Geschwindigkeit ändert und wird in m/s² gemessen. Geschwindigkeit und Bewegung stecken in allem: Auto, Flugzeuge, Satelliten, Sport und sogar Blutfluss in deinem Körper!' },
          { name:'Reibungskräfte', diff:2,
            explanation:'Warum bleibt ein Buch auf einem schrägen Pult liegen, statt herunterzurutschen? Wegen der Reibungskraft! Reibung entsteht überall, wo zwei Flächen aneinander berühren – sie wirkt immer der Bewegung entgegen. Es gibt drei wichtige Reibungsarten: Haftreibung hält einen ruhenden Körper an seinem Platz, bevor er sich überhaupt bewegt – sie ist am stärksten. Gleitreibung wirkt, sobald ein Körper über eine Fläche gleitet – sie ist kleiner als Haftreibung. Rollreibung entsteht bei rollenden Körpern wie Rädern – sie ist am kleinsten, deshalb haben Autos und Fahrräder Räder statt Kufen! Manchmal ist Reibung nützlich: Autoreifen beim Bremsen, Schuhe damit wir nicht ausrutschen, Finger zum Greifen. Manchmal ist sie störend: Maschinenteile nutzen sich ab, weshalb man Öl und Schmierung verwendet. Reibungskräfte hängen von der Oberflächenrauheit und der Normalkraft ab – je glatter die Fläche und je leichter der Körper, desto kleiner die Reibung. Wintersportler wachsen ihre Skier, um Gleitreibung gezielt zu verringern.' },
          { name:'Hebel und einfache Maschinen', diff:2,
            explanation:'Mit einem langen Hebel kannst du schwere Lasten mit wenig Kraft bewegen – Menschen nutzten dieses Prinzip schon beim Bau der Pyramiden! Das Hebelgesetz lautet: Kraft × Kraftarm = Last × Lastarm. Der Kraftarm ist der Abstand zwischen dem Drehpunkt (Fulkrum) und der angreifenden Kraft; der Lastarm ist der Abstand vom Drehpunkt zur Last. Je länger dein Kraftarm, desto weniger Kraft brauchst du – du musst dafür aber einen längeren Weg zurücklegen. Beispiel: Du willst eine 200 N schwere Last mit 50 N Kraft heben. Dann muss dein Kraftarm viermal so lang sein wie der Lastarm (50 × 4 = 200 × 1). Eine Schaukel ist ein zweiseitiger Hebel: Sitzt die schwerere Person näher am Mittelpunkt, können beide ins Gleichgewicht kommen. Einseitige Hebel wie Nussknacker, Schubkarre und Flaschenöffner haben Kraft und Last auf derselben Seite. Auch dein Unterarm ist ein Hebel! Archimedes sagte berühmt: "Gebt mir einen festen Punkt und ich hebe die Erde aus den Angeln" – er meinte die enorme Kraftverstärkung durch einen langen Hebelarm.' },
          { name:'Masse und Gewichtskraft', diff:2,
            explanation:'Masse und Gewicht klingen ähnlich, sind aber physikalisch völlig verschieden – dieser Unterschied ist enorm wichtig! Deine Masse gibt an, wie viel Materie in dir steckt, und bleibt überall gleich: auf der Erde, auf dem Mond und im Weltall. Die Einheit der Masse ist Kilogramm (kg). Die Gewichtskraft dagegen ist eine Kraft, die durch die Schwerkraft eines Planeten auf dich wirkt. Sie berechnet sich so: Gewichtskraft (FG) = Masse (m) × Erdbeschleunigung (g), wobei g auf der Erde 9,81 m/s² beträgt. Auf dem Mond ist g nur etwa 1,62 m/s² – du würdest dort also nur ein Sechstel deines Erdgewichts "wiegen"! Ein Astronaut mit 80 kg Masse hat auf der Erde eine Gewichtskraft von ca. 785 N, auf dem Mond nur ca. 130 N. Im Weltall, weit weg von jedem Planeten, ist die Gewichtskraft praktisch null – der Astronaut schwebt, obwohl seine Masse immer noch 80 kg beträgt. Genau dieser Unterschied ist fundamental für die Raumfahrt, Satellitentechnik und das Verständnis des Universums!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Kraft und Geschwindigkeit',
            desc:'Grundgrößen der Mechanik kennenlernen.',
            questions:[
              { q:'Einheit der Kraft?', hint:'Benannt nach dem Wissenschaftler, der die Schwerkraft beschrieben hat – Isaac N.', options:['Joule (J)','Newton (N)','Watt (W)','Pascal (Pa)'], correct:1, explanation:'Kraft wird in Newton (N) gemessen.' },
              { q:'Formel für Geschwindigkeit?', hint:'Geschwindigkeit = wie weit ÷ wie lange. Formel: v = s ÷ t.', options:['v = m × t','v = s / t','v = s × t','v = t / s'], correct:1, explanation:'v = s / t (Weg durch Zeit).' },
              { q:'Auto: 180 km in 2 h. Durchschnittsgeschwindigkeit?', hint:'v = s ÷ t = 180 km ÷ 2 h = ?', options:['60 km/h','90 km/h','120 km/h','360 km/h'], correct:1, explanation:'v = 180 ÷ 2 = 90 km/h.' },
              { q:'Was verändert eine Kraft?', hint:'Kräfte haben zwei verschiedene Wirkungen auf Körper. Was kann sich ändern?', options:['Nur Geschwindigkeit','Nur Form','Bewegungszustand oder Form','Nur Richtung'], correct:2, explanation:'Kräfte ändern Bewegungszustand (Beschleunigung, Richtung) oder Form (Verformung).' },
              { q:'1 kg Masse wiegt auf der Erde ca. wie viel Newton?', hint:'Erdbeschleunigung g ≈ 9,81 m/s². Gewichtskraft = Masse × g.', options:['1 N','9,81 N','100 N','0,1 N'], correct:1, explanation:'FG = 1 kg × 9,81 m/s² ≈ 9,81 N.' },
              { q:'Radfahrer: 30 km in 1,5 h. Geschwindigkeit?', hint:'v = s ÷ t = 30 km ÷ 1,5 h.', options:['15 km/h','20 km/h','25 km/h','45 km/h'], correct:1, explanation:'30 ÷ 1,5 = 20 km/h.' },
              { q:'Wie lange braucht man bei 50 km/h für 150 km?', hint:'t = s ÷ v = 150 ÷ 50.', options:['1 h','2 h','3 h','4 h'], correct:2, explanation:'t = 150 ÷ 50 = 3 h.' },
              { q:'Was ist die Gewichtskraft FG?', hint:'Formel: FG = m × g. Die Kraft, mit der die Erde einen Körper anzieht.', options:['Kraft beim Schwimmen','Kraft, mit der Erde einen Körper anzieht','Kraft beim Stoßen','Luftwiderstand'], correct:1, explanation:'FG = m × g ist die Schwerkraft der Erde auf den Körper.' },
            ]
          },
          { id:'e2', type:'Mechanik', diff:2, title:'Hebel und Reibung',
            desc:'Hebelgesetz und Reibungsarten.',
            questions:[
              { q:'Hebelgesetz: Kraft × Kraftarm = ?', hint:'Im Gleichgewicht gilt auf beiden Seiten das gleiche Produkt: F × lF = L × lL.', options:['Kraft × Last','Last × Lastarm','Last / Lastarm','Masse × g'], correct:1, explanation:'F × lF = L × lL (Hebelgesetz).' },
              { q:'Kraftarm 2 m, Kraft 50 N, Lastarm 0,5 m. Last?', hint:'Umstellen: L = (F × lF) ÷ lL = (50 × 2) ÷ 0,5.', options:['25 N','100 N','200 N','400 N'], correct:2, explanation:'L = 100 ÷ 0,5 = 200 N.' },
              { q:'Welche Reibung ist am kleinsten?', hint:'Denk an einen Wagen auf Rollen vs. einen Schlitten – welcher bewegt sich leichter?', options:['Haftreibung','Gleitreibung','Rollreibung','Alle gleich'], correct:2, explanation:'Rollreibung < Gleitreibung < Haftreibung.' },
              { q:'Was ist Haftreibung?', hint:'„Haft" = haftet. Diese Reibung hält einen Körper am Platz, BEVOR er sich bewegt.', options:['Reibung beim Gleiten','Reibung beim Rollen','Reibung vor Bewegungsbeginn','Reibung im Wasser'], correct:2, explanation:'Haftreibung wirkt, solange der Körper noch stillsteht.' },
              { q:'Kraft 30 N, Kraftarm 1,5 m, Lastarm 0,5 m. Last?', hint:'L = (F × lF) ÷ lL = (30 × 1,5) ÷ 0,5.', options:['10 N','45 N','90 N','150 N'], correct:2, explanation:'L = 45 ÷ 0,5 = 90 N.' },
              { q:'Was ist Gleitreibung?', hint:'„Gleiten" = der Körper bewegt sich bereits.', options:['Reibung bevor Bewegung','Reibung während Gleiten','Reibung beim Rollen','Reibung im Wasser'], correct:1, explanation:'Gleitreibung tritt auf, wenn Körper aneinander gleiten.' },
              { q:'Welches Alltagsgerät nutzt das Hebelgesetz?', hint:'Denk an Dinge, bei denen du Kraft einsparst.', options:['Glühbirne','Nussknacker','Taschenlampe','Thermometer'], correct:1, explanation:'Nussknacker, Schere, Schubkarre – alle nutzen das Hebelgesetz.' },
              { q:'Warum haben Fahrräder Räder statt Kufen?', hint:'Vergleiche Gleit- und Rollreibung.', options:['Regen rutscht besser','Rollreibung ist kleiner als Gleitreibung','Reifen sind leichter','Sieht besser aus'], correct:1, explanation:'Rollreibung ist viel kleiner als Gleitreibung → weniger Kraftaufwand.' },
            ]
          },
          { id:'e3', type:'Kräfte', diff:3, title:'Kräfte und Energie – Anwendung',
            desc:'Schwierige Aufgaben zu Kräften, Arbeit und Energie.',
            questions:[
              { q:'Formel für mechanische Arbeit W?', hint:'Arbeit = Kraft in Richtung der Bewegung × zurückgelegter Weg.', options:['W = m × v','W = F × s','W = m × g','W = P × t'], correct:1, explanation:'W = F × s (Kraft × Weg), Einheit: Joule (J).' },
              { q:'Kraft 20 N, Weg 5 m. Arbeit?', hint:'W = F × s = 20 N × 5 m. Einheit: Newton × Meter = Joule.', options:['4 J','25 J','100 J','15 J'], correct:2, explanation:'W = 20 × 5 = 100 J.' },
              { q:'Was ist Leistung?', hint:'Leistung sagt, wie schnell Arbeit verrichtet wird: Arbeit ÷ Zeit.', options:['Kraft × Weg','Masse × Beschleunigung','Arbeit / Zeit','Energie × Zeit'], correct:2, explanation:'P = W / t, Einheit: Watt (W).' },
              { q:'Was ist potenzielle Energie (Lageenergie)?', hint:'Diese Energie hat ein Körper durch seine Höhe. Formel: Ep = m × g × h.', options:['Energie durch Bewegung','Energie durch Lage/Höhe','Energie durch Wärme','Energie durch Licht'], correct:1, explanation:'Epot = m × g × h (Lageenergie durch Höhe).' },
              { q:'Ball fällt von 5 m Höhe. Masse 0,5 kg, g = 10 m/s². Lageenergie?', hint:'Ep = m × g × h = 0,5 kg × 10 m/s² × 5 m.', options:['2,5 J','25 J','50 J','100 J'], correct:1, explanation:'0,5 × 10 × 5 = 25 J.' },
              { q:'Was ist kinetische Energie?', hint:'„Kinetisch" kommt von griechisch „Bewegung". Formel: Ekin = ½ × m × v².', options:['Lageenergie','Wärmeenergie','Bewegungsenergie','Elektrische Energie'], correct:2, explanation:'Kinetische Energie = Bewegungsenergie = ½ × m × v².' },
              { q:'P = 500 W, t = 10 s. Wie viel Arbeit?', hint:'Umstellen: W = P × t = 500 W × 10 s.', options:['50 J','500 J','5.000 J','0,05 J'], correct:2, explanation:'W = 500 × 10 = 5.000 J.' },
              { q:'Energieerhaltungssatz: Was gilt beim freien Fall?', hint:'Energie kann nicht verschwinden, sie wandelt sich nur um.', options:['Energie nimmt ab','Lageenergie → Bewegungsenergie','Energie entsteht aus Nichts','Bewegungsenergie → Lageenergie'], correct:1, explanation:'Beim Fall: Lageenergie wird in Bewegungsenergie umgewandelt.' },
            ]
          },
        ]
      },
    ]
  },

  /* =========================================================  KLASSE 8  */
  klasse8: {
    id:'klasse8', num:8, label:'Klasse 8',
    emoji:'📐', color:['#059669','#34D399'], light:'#D1FAE5',
    tagline:'Funktionen, Pythagoras und elektrischer Strom',
    subjects:[
      {
        id:'mathe', name:'Mathematik', icon:'🔢',
        desc:'Lineare Funktionen, Pythagoras & Statistik',
        color:'#2563EB',
        intro:'Herzlich willkommen in Mathe Klasse 8! Heute entdecken wir lineare Funktionen, den Satz des Pythagoras und lernen Statistik kennen. Diese Themen begegnen dir im Alltag, in der Wirtschaft und in der Technik!',
        topics:[
          { name:'Lineare Funktionen und Graphen', diff:2,
            explanation:'Wenn du einen Streamingdienst für 10 Euro pro Monat abonnierst, steigen deine Gesamtkosten gleichmäßig: nach 1 Monat 10 €, nach 6 Monaten 60 €, nach 12 Monaten 120 €. Das ist eine lineare Funktion! Die allgemeine Form ist y = mx + b. Darin ist m die Steigung – sie sagt, wie stark die Gerade ansteigt (m > 0) oder fällt (m < 0). Und b ist der y-Achsenabschnitt, also der Wert der Funktion genau bei x = 0. Beispiel: Ein Taxi berechnet 3 € Grundgebühr plus 2 € pro Kilometer: y = 2x + 3. Die Steigung 2 bedeutet: jeder Kilometer mehr kostet 2 € extra. Bei x = 0 (noch keine Fahrt) zahlst du 3 € Grundgebühr. Um den Graphen zu zeichnen, brauchst du nur zwei Punkte: Berechne den y-Achsenabschnitt (x = 0 einsetzen) und einen weiteren Punkt. Die Nullstelle (Schnittpunkt mit der x-Achse) findest du, indem du y = 0 setzt und nach x auflöst. Lineare Funktionen sind überall: Stromtarife, Handyverträge, Arbeitslohn und Temperaturen sind lineare Zusammenhänge!' },
          { name:'Satz des Pythagoras', diff:3,
            explanation:'Bauarbeiter überprüfen rechte Winkel mit dem legendären 3-4-5-Trick: Ein Dreieck mit Seiten 3, 4 und 5 Meter hat immer exakt einen rechten Winkel – weil 3² + 4² = 9 + 16 = 25 = 5². Das ist der Satz des Pythagoras: In jedem rechtwinkligen Dreieck gilt a² + b² = c². Die Seiten a und b heißen Katheten, die längste Seite c heißt Hypotenuse und liegt gegenüber dem rechten Winkel. Willst du die Hypotenuse berechnen: c = Wurzel aus (a² + b²). Willst du eine Kathete berechnen, stelle um: a = Wurzel aus (c² – b²). Praxisbeispiel: Eine 5 m lange Leiter lehnt an einer Wand, der Fuß ist 3 m entfernt. In welcher Höhe lehnt sie? h² = 5² – 3² = 25 – 9 = 16, also h = 4 m. Pythagoras war ein griechischer Mathematiker (ca. 570–510 v. Chr.), aber der Satz war schon Jahrtausende früher in Ägypten und Babylonien bekannt. Er steckt heute in GPS-Navigation, Architektur, Computergrafik und unzähligen technischen Berechnungen!' },
          { name:'Statistik: Mittelwert, Median, Modus', diff:2,
            explanation:'Instagram-Analytics, Sportergebnisse, Wahlergebnisse, Klimadaten – überall wird Statistik genutzt, um Daten zu verstehen! Es gibt drei wichtige Lagemaße: Der Mittelwert (Durchschnitt) wird berechnet, indem du alle Werte addierst und durch ihre Anzahl teilst – einfach und häufig genutzt, aber empfindlich gegenüber Ausreißern. Zum Beispiel: Die Werte 2, 3, 3, 4, 100 haben einen Mittelwert von 22,4 – obwohl fast alle Werte unter 5 liegen! Der Median ist der mittlere Wert einer sortierten Liste – er wird durch extreme Werte kaum beeinflusst. Bei einer geraden Anzahl von Werten nimmst du den Durchschnitt der beiden mittleren. Beim Durchschnittsgehalt sagt der Median oft mehr aus als der Mittelwert, weil wenige Topverdiener den Mittelwert stark nach oben ziehen. Der Modus ist der am häufigsten vorkommende Wert – bei den Noten 1, 2, 2, 3, 2, 4 ist der Modus 2. Wann nutzt man was? Mittelwert für gleichmäßige Daten ohne Ausreißer; Median für schiefe Verteilungen wie Gehälter und Hauspreise; Modus für Schuhgrößen oder Lieblingsprodukte. Statistik hilft uns, aus vielen Zahlen verständliche Aussagen zu machen!' },
          { name:'Terme vereinfachen und ausmultiplizieren', diff:3,
            explanation:'Stell dir vor, du musst denselben langen Rechenweg immer wieder wiederholen – effizienter wäre es, den Ausdruck zuerst zu vereinfachen. Genau das tun wir beim Vereinfachen von Termen! Gleichartige Terme haben dieselbe Variable und Potenz: 3x + 2x = 5x, oder 4a² – a² = 3a². Nur gleichartige Terme dürfen zusammengefasst werden: 3x + 2y kann nicht weiter vereinfacht werden, weil x und y verschiedene Variablen sind. Beim Ausmultiplizieren (Distributivgesetz) löst du Klammern auf: 2(x + 3) = 2x + 6 – jedes Glied in der Klammer wird mit dem Faktor vor der Klammer multipliziert. Steht ein Minuszeichen vor der Klammer, dreht sich jedes Vorzeichen darin um: –(x + 3) = –x – 3. Beim Ausklammern gehst du umgekehrt vor: 4x + 6 = 2(2x + 3) – du erkennst den gemeinsamen Faktor 2 und schreibst ihn vor die Klammer. Die binomischen Formeln – zum Beispiel (a + b)² = a² + 2ab + b² – sind Abkürzungen für häufige Ausmultiplikationen. Diese Fähigkeiten begleiten dich durch die gesamte Oberstufe!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Koordinatensystem – Grundlagen',
            desc:'Punkte ablesen und einzeichnen.',
            questions:[
              { q:'Wie nennt man den Schnittpunkt der Achsen?', hint:'An diesem Punkt sind beide Koordinaten 0: x=0 und y=0.', options:['Nullpunkt','Ursprung','Mittelpunkt','Achsenkreuz'], correct:1, explanation:'Der Ursprung liegt bei (0|0).' },
              { q:'Punkt A(3|–2) – was bedeutet –2?', hint:'Im Koordinatenpaar (x|y) ist die zweite Zahl der y-Wert. Negativ = nach unten.', options:['3 Schritte nach links','3 Schritte nach rechts','2 Schritte nach unten','2 Schritte nach oben'], correct:2, explanation:'–2 ist der y-Wert → 2 Schritte nach unten.' },
              { q:'Was ist die x-Achse?', hint:'Denk an „x" wie quer (horizontal). y-Achse ist senkrecht.', options:['Senkrechte Achse','Waagerechte Achse','Diagonale Achse','Keine davon'], correct:1, explanation:'x-Achse = waagerecht, y-Achse = senkrecht.' },
              { q:'In welchem Quadranten liegt (–2|3)?', hint:'x negativ = links von y-Achse. y positiv = über x-Achse. Links+oben = ?', options:['1. Quadrant','2. Quadrant','3. Quadrant','4. Quadrant'], correct:1, explanation:'Links oben = 2. Quadrant (x<0, y>0).' },
              { q:'Welcher Punkt liegt auf der y-Achse?', hint:'Auf der y-Achse gilt immer: x-Koordinate = 0.', options:['(3|0)','(0|–4)','(2|2)','(–1|–1)'], correct:1, explanation:'(0|–4): x=0 → liegt auf der y-Achse.' },
              { q:'Welcher Punkt liegt auf der x-Achse?', hint:'Auf der x-Achse gilt immer: y-Koordinate = 0.', options:['(0|5)','(3|0)','(2|3)','(0|0) zählt nicht'], correct:1, explanation:'(3|0): y=0 → liegt auf der x-Achse.' },
              { q:'Punkt B(–4|–3) liegt im …?', hint:'x negativ = links, y negativ = unten. Links+unten = ?', options:['1. Quadrant','2. Quadrant','3. Quadrant','4. Quadrant'], correct:2, explanation:'Links unten = 3. Quadrant (x<0, y<0).' },
              { q:'Was sind kartesische Koordinaten?', hint:'Benannt nach Descartes. Zwei senkrechte Achsen bilden ein System.', options:['Kreisförmiges System','System mit zwei senkrechten Achsen','Nur positive Zahlen','Polarsystem'], correct:1, explanation:'Kartesisches Koordinatensystem: zwei senkrechte Achsen (x und y).' },
            ]
          },
          { id:'e2', type:'Funktionen', diff:2, title:'Lineare Funktionen',
            desc:'Steigung und y-Achsenabschnitt verstehen.',
            questions:[
              { q:'Was bedeutet m in y = mx + b?', hint:'Wenn du einen Schritt nach rechts gehst (x+1), wie viele Schritte gehst du rauf oder runter? Das ist m.', options:['y-Achsenabschnitt','Steigung','x-Wert','Nullstelle'], correct:1, explanation:'m = Steigung des Graphen.' },
              { q:'Was bedeutet b in y = mx + b?', hint:'Setze x=0 ein: y = m×0 + b = b. Das ist der Schnittpunkt mit der y-Achse.', options:['Steigung','x-Achsenabschnitt','y-Achsenabschnitt','Nullstelle'], correct:2, explanation:'b = y-Achsenabschnitt (Schnittpunkt mit y-Achse bei x=0).' },
              { q:'y für x=3: y = 2x + 1', hint:'x=3 einsetzen: y = 2 × 3 + 1 = 6 + 1 = ?', options:['5','6','7','8'], correct:2, explanation:'y = 2×3 + 1 = 7.' },
              { q:'Steigung m = –1. Was bedeutet das?', hint:'Negatives m: für jede Einheit rechts geht die Gerade eine Einheit runter.', options:['Graph steigt','Graph fällt','Graph waagerecht','Graph senkrecht'], correct:1, explanation:'m = –1: Graph fällt (für jedes +1 bei x gibt es –1 bei y).' },
              { q:'Steigung einer waagerechten Gerade?', hint:'Waagerecht = kein Anstieg, kein Abfall. Was ist die Steigung?', options:['m = 1','m = –1','m = 0','Nicht definiert'], correct:2, explanation:'Waagerechte Gerade: m = 0 (keine Steigung).' },
              { q:'Funktion y = 3x – 2. y-Achsenabschnitt?', hint:'b ablesen aus y = mx + b. Welches ist b?', options:['3','–2','2','0'], correct:1, explanation:'b = –2 → Schnittpunkt mit y-Achse bei (0|–2).' },
              { q:'y = –2x + 4. Wo ist die Nullstelle?', hint:'Nullstelle: y=0 setzen → 0 = –2x + 4 → 2x = 4 → x = ?', options:['x = –2','x = 2','x = 4','x = –4'], correct:1, explanation:'0 = –2x + 4 → x = 2.' },
              { q:'Zwei Punkte: (0|1) und (2|5). Steigung m?', hint:'Formel: m = (y2–y1) ÷ (x2–x1) = (5–1) ÷ (2–0).', options:['2','3','4','5'], correct:0, explanation:'m = 4 ÷ 2 = 2.' },
            ]
          },
          { id:'e3', type:'Geometrie', diff:3, title:'Satz des Pythagoras',
            desc:'a² + b² = c² anwenden.',
            questions:[
              { q:'Satz des Pythagoras?', hint:'Nur für rechtwinklige Dreiecke. c ist die Hypotenuse (längste Seite).', options:['a+b=c','a²+b²=c²','a×b=c²','a²=b²+c²'], correct:1, explanation:'a² + b² = c² (nur bei rechtwinkligen Dreiecken).' },
              { q:'a=3, b=4. c=?', hint:'c² = 3² + 4² = 9 + 16 = 25. c = √25 = ?', options:['5','6','7','25'], correct:0, explanation:'c = √25 = 5. Der klassische 3-4-5-Trick!' },
              { q:'Längste Seite im rechtwinkligen Dreieck?', hint:'Sie liegt dem rechten Winkel gegenüber. Sonderbezeichnung?', options:['Kathete','Hypotenuse','Gegenkathete','Ankathete'], correct:1, explanation:'Hypotenuse = längste Seite, gegenüber dem 90°-Winkel.' },
              { q:'c=13, a=5. b=?', hint:'b² = c² – a² = 13² – 5² = 169 – 25. Dann b = √144 = ?', options:['10','11','12','8'], correct:2, explanation:'b² = 144 → b = 12.' },
              { q:'Wofür steht c?', hint:'c ist die Seite gegenüber dem rechten Winkel – welcher Sonderausdruck?', options:['Beliebige Seite','Kürzeste Seite','Hypotenuse','Den rechten Winkel'], correct:2, explanation:'c = Hypotenuse (längste Seite, dem rechten Winkel gegenüber).' },
              { q:'Ist ein Dreieck mit a=6, b=8, c=10 rechtwinklig?', hint:'Prüfe: a² + b² = c²? 36 + 64 = ?', options:['Nein','Ja','Unmöglich zu bestimmen','Nur ungefähr'], correct:1, explanation:'36 + 64 = 100 = 10² ✓ → rechtwinklig.' },
              { q:'Leiter 5 m lehnt an Wand, Fuß 3 m vom Haus. Höhe?', hint:'Hypotenuse = Leiter = 5 m, Kathete am Boden = 3 m. h² = 5² – 3².', options:['2 m','4 m','5 m','8 m'], correct:1, explanation:'h² = 25 – 9 = 16 → h = 4 m.' },
              { q:'a=5, b=12. c=?', hint:'c² = 5² + 12² = 25 + 144. Dann √169 = ?', options:['13','14','15','17'], correct:0, explanation:'c = √169 = 13. Ein weiteres pythagoräisches Tripel!' },
            ]
          },
          { id:'e4', type:'Statistik', diff:2, title:'Mittelwert, Median, Modus',
            desc:'Die drei wichtigsten Lagemaße.',
            questions:[
              { q:'Wie berechnet man den Mittelwert?', hint:'Alle Werte addieren, dann durch ihre Anzahl dividieren.', options:['Mittleren Wert nehmen','Alle addieren ÷ Anzahl','Häufigsten Wert nehmen','Größten – Kleinsten'], correct:1, explanation:'Mittelwert = Summe ÷ Anzahl.' },
              { q:'Werte: 3, 7, 7, 9, 4. Mittelwert?', hint:'Summe = 3+7+7+9+4 = 30. Anzahl = 5. 30 ÷ 5 = ?', options:['5','6','7','9'], correct:1, explanation:'30 ÷ 5 = 6.' },
              { q:'Median von 2, 5, 7, 9, 11?', hint:'Bereits sortiert. 5 Werte → mittlerer = 3. Wert.', options:['5','6,8','7','9'], correct:2, explanation:'3. Wert einer 5er-Liste = 7.' },
              { q:'Modus von 4, 7, 4, 9, 7, 4, 1?', hint:'Zähle, wie oft jeder Wert vorkommt: 4→3x, 7→2x, 9→1x, 1→1x.', options:['4','7','1','9'], correct:0, explanation:'4 erscheint 3-mal → Modus = 4.' },
              { q:'Median von 3, 8, 1, 6, 2, 9 (6 Werte)?', hint:'Sortieren: 1,2,3,6,8,9. Mittlere zwei Werte = 3. und 4. Wert. Durchschnitt dieser beiden.', options:['3','4,5','6','4'], correct:1, explanation:'(3+6) ÷ 2 = 4,5.' },
              { q:'Was ist der Vorteil des Medians gegenüber dem Mittelwert?', hint:'Was passiert beim Mittelwert, wenn ein Wert extrem hoch ist?', options:['Einfacher zu berechnen','Weniger anfällig für Ausreißer','Immer größer','Immer kleiner'], correct:1, explanation:'Median wird durch Ausreißer (sehr hohe/niedrige Werte) kaum beeinflusst.' },
              { q:'Noten: 2, 1, 3, 2, 4, 2, 5. Modus?', hint:'Welche Note kommt am häufigsten vor?', options:['2','3','1','5'], correct:0, explanation:'Note 2 erscheint 3-mal → Modus = 2.' },
              { q:'Werte: 10, 20, 30, 40, 100. Mittelwert?', hint:'Summe = 200. Anzahl = 5. 200 ÷ 5 = ?', options:['30','35','40','50'], correct:2, explanation:'200 ÷ 5 = 40. Der Ausreißer 100 zieht den Mittelwert hoch!' },
            ]
          },
        ]
      },
      {
        id:'physik', name:'Physik', icon:'⚡',
        desc:'Elektrischer Strom, Spannung und Schaltkreise',
        color:'#0284C7',
        intro:'Willkommen in Physik Klasse 8! Heute tauchen wir in die Welt des elektrischen Stroms ein. Spannung, Stromstärke, Widerstand – und das Ohmsche Gesetz verbindet alles!',
        topics:[
          { name:'Elektrische Spannung (Volt)', diff:1,
            explanation:'Dein Handy-Akku hat 3,7 Volt, eine Haushaltssteckdose 230 Volt und eine Autobatterie 12 Volt – das alles sind elektrische Spannungen! Spannung ist der Antrieb, der Elektronen durch einen Leiter bewegt – vergleichbar mit dem Wasserdruck in einem Rohr: Je höher der Druck (Spannung), desto stärker fließt das Wasser (der Strom). Die elektrische Spannung entsteht, wenn zwischen zwei Punkten ein Unterschied in der elektrischen Energie besteht – das nennt man Potenzialdifferenz. Die Einheit ist Volt (V), benannt nach dem Physiker Alessandro Volta, der 1800 die erste Batterie erfand. Gemessen wird Spannung mit einem Voltmeter, das immer parallel (also nebenher, nicht hintereinander) zum Bauteil angeschlossen wird. Ohne Spannung fließt kein Strom – eine leere Batterie hat fast 0 Volt. Sehr hohe Spannungen wie in Hochspannungsleitungen (bis 380.000 V) sind tödlich gefährlich: niemals anfassen! Bei Strom zuhause (230 V) gilt: Immer einen Elektriker beauftragen und niemals selbst reparieren.' },
          { name:'Stromstärke (Ampere)', diff:1,
            explanation:'Dein Handyladekabel überträgt 1 bis 2 Ampere, ein Herd braucht bis zu 16 Ampere und eine LED-Lampe nur 0,05 Ampere – das sind sehr unterschiedliche Stromstärken! Die Stromstärke beschreibt, wie viele Elektronen pro Sekunde durch einen Querschnitt eines Leiters fließen – ähnlich wie die Fließmenge von Wasser in einem Rohr. Die Einheit ist Ampere (A), benannt nach dem französischen Physiker André-Marie Ampère. Gemessen wird die Stromstärke mit einem Amperemeter, das immer in Reihe (also hintereinander) in den Stromkreis eingebaut wird – nie parallel! Schließt du es falsch (parallel) an, kann es zerstört werden, weil fast kein Widerstand da ist und der gesamte Strom hindurchfließt. In der Sicherungstechnik ist Stromstärke entscheidend: Fließt zu viel Strom, schmilzt die Sicherung und schützt vor Überhitzung und Bränden. Interessant: Obwohl Elektronen sich im Leiter nur millimeterweise vorwärts bewegen, breitet sich der elektrische Impuls mit nahezu Lichtgeschwindigkeit aus – deshalb leuchtet eine Lampe sofort!' },
          { name:'Das Ohmsche Gesetz', diff:2,
            explanation:'Das Ohmsche Gesetz lautet: Spannung (U) = Stromstärke (I) × Widerstand (R), kurz U = I × R. Der elektrische Widerstand beschreibt, wie stark ein Material den Stromfluss bremst – wie ein enges Rohr, das den Wasserfluss verringert. Einheit des Widerstands ist Ohm (Ω). Eine dicke Kupferschiene hat kleinen Widerstand (Strom fließt leicht), ein dünnes Wolframglühwendel hat großen Widerstand (wird heiß und leuchtet). Das Gesetz lässt sich auch umstellen: I = U ÷ R (Strom berechnen) und R = U ÷ I (Widerstand berechnen). Beispiel: U = 12 V, R = 6 Ω – dann ist I = 12 ÷ 6 = 2 A. Merke dir das "Dreieck": U oben, I und R unten – decke die gesuchte Größe ab, um die richtige Formel zu sehen. Schließt du eine LED an eine Batterie an, berechnest du damit den nötigen Vorwiderstand, damit die LED nicht durchbrennt. Georg Simon Ohm entdeckte diesen Zusammenhang 1826 – es ist die wichtigste Formel der gesamten Elektrizitätslehre!' },
          { name:'Reihen- und Parallelschaltung', diff:3,
            explanation:'Weihnachtslichter früher waren in Reihe geschaltet – fiel eine Birne aus, wurden alle dunkel! Das war ein typisches Problem der Reihenschaltung. Heute sind LED-Lichterketten parallel geschaltet: Fällt eine aus, leuchten alle anderen weiter. In der Reihenschaltung sind alle Bauteile hintereinander in einem einzigen Stromkreis geschaltet. Dabei gilt: Die Stromstärke ist überall gleich groß, aber die Spannungen addieren sich – jedes Bauteil bekommt einen Teil der Gesamtspannung. In der Parallelschaltung liegen alle Bauteile nebeneinander zwischen denselben zwei Leitungen. Dabei gilt: Die Spannung ist an allen Zweigen gleich, aber die Gesamtstromstärke teilt sich auf die Zweige auf. In deinem Zuhause sind alle Steckdosen parallel geschaltet – deshalb hat jede die volle Netzspannung von 230 V und jedes Gerät kann unabhängig ein- und ausgeschaltet werden. Widerstände in Reihe addieren sich: R_ges = R1 + R2. Widerstände parallel ergeben einen kleineren Gesamtwiderstand: immer kleiner als der kleinste Einzelwiderstand!' },
          { name:'Elektrische Energie und Leistung', diff:3,
            explanation:'Ein Gaming-PC verbraucht 500 Watt, dein Smartphone-Ladegerät nur 20 Watt – das sind sehr unterschiedliche elektrische Leistungen! Die Formel lautet: Leistung (P) = Spannung (U) × Stromstärke (I), Einheit: Watt (W). Leistung sagt aus, wie schnell ein Gerät elektrische Energie in eine andere Energieform (Wärme, Licht, Bewegung) umwandelt. Auf der Stromrechnung erscheinen Kilowattstunden (kWh): Eine kWh ist die Energie, die ein 1000-Watt-Gerät in einer Stunde verbraucht. Berechnung: Energie (E) = Leistung (P) × Zeit (t), wobei P in kW und t in Stunden eingesetzt werden. Beispiel: Gaming-PC 500 W = 0,5 kW, 4 Stunden spielen: E = 0,5 × 4 = 2 kWh. Bei 30 Cent/kWh kostet das 60 Cent. Merke: Leistung (Watt) ist die momentane Rate, Energie (kWh) ist die gesamte verbrauchte Menge über eine Zeit. Der Wirkungsgrad gibt an, wie viel Prozent der zugeführten Energie wirklich nutzbar ist – kein Gerät hat 100%!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Spannung, Stromstärke, Widerstand',
            desc:'Die Grundgrößen des elektrischen Stroms.',
            questions:[
              { q:'Einheit der elektrischen Spannung?', hint:'Benannt nach Alessandro Volta, der die erste Batterie erfand.', options:['Ampere (A)','Ohm (Ω)','Volt (V)','Watt (W)'], correct:2, explanation:'Spannung wird in Volt (V) gemessen.' },
              { q:'Einheit der Stromstärke?', hint:'Benannt nach André-Marie Ampère, dem Pionier der Elektromagnetismus-Forschung.', options:['Volt (V)','Ampere (A)','Ohm (Ω)','Joule (J)'], correct:1, explanation:'Stromstärke in Ampere (A).' },
              { q:'Ohmsches Gesetz?', hint:'Spannung (U), Stromstärke (I), Widerstand (R). Spannung = ? × ?', options:['U = I + R','U = I × R','I = U × R','R = U × I'], correct:1, explanation:'U = I × R (Georg Simon Ohm, 1826).' },
              { q:'U=12V, I=2A. R=?', hint:'Umstellen: R = U ÷ I = 12 ÷ 2.', options:['24 Ω','10 Ω','6 Ω','14 Ω'], correct:2, explanation:'R = 12 ÷ 2 = 6 Ω.' },
              { q:'R=10Ω, U=5V. I=?', hint:'Umstellen: I = U ÷ R = 5 ÷ 10.', options:['0,5 A','2 A','50 A','15 A'], correct:0, explanation:'I = 5 ÷ 10 = 0,5 A.' },
              { q:'Was beschreibt der elektrische Widerstand?', hint:'Er zeigt, wie sehr ein Material dem Stromfluss entgegenwirkt.', options:['Wie viel Strom fließt','Wie stark Strom gebremst wird','Wie hoch die Spannung ist','Wie viel Energie verbraucht wird'], correct:1, explanation:'Widerstand = Maß dafür, wie stark der Stromfluss gebremst wird.' },
              { q:'I=3A, R=4Ω. Spannung U=?', hint:'U = I × R = 3 × 4.', options:['1,3 V','7 V','12 V','0,75 V'], correct:2, explanation:'U = 3 × 4 = 12 V.' },
              { q:'Womit misst man Spannung?', hint:'Es wird parallel zum Bauteil angeschlossen.', options:['Amperemeter','Ohmmeter','Voltmeter','Wattmeter'], correct:2, explanation:'Voltmeter – wird parallel (nicht in Reihe) geschaltet.' },
            ]
          },
          { id:'e2', type:'Energie', diff:2, title:'Elektrische Energie und Leistung',
            desc:'Leistung und Energieverbrauch berechnen.',
            questions:[
              { q:'Formel für elektrische Leistung?', hint:'Leistung = Spannung × Stromstärke. P = U × I.', options:['P = U + I','P = U × I','P = U / I','P = I / U'], correct:1, explanation:'P = U × I, Einheit: Watt (W).' },
              { q:'U = 230 V, I = 2 A. Leistung?', hint:'P = U × I = 230 × 2 = ?', options:['115 W','232 W','460 W','920 W'], correct:2, explanation:'P = 230 × 2 = 460 W.' },
              { q:'Was ist eine Kilowattstunde (kWh)?', hint:'kWh = Energie-Einheit. 1 kW = 1.000 W. kWh = Leistung × Zeit.', options:['Leistung von 1 kW','1.000 W über 1 Stunde','Spannung × Zeit','Strom × Widerstand'], correct:1, explanation:'1 kWh = 1.000 Watt × 1 Stunde = 3,6 Millionen Joule.' },
              { q:'500-W-Gerät, 3 Stunden. Verbrauch?', hint:'Erst in kW umrechnen: 500 W = 0,5 kW. Dann E = 0,5 kW × 3 h.', options:['0,5 kWh','1,5 kWh','1.500 kWh','500 kWh'], correct:1, explanation:'E = 0,5 kW × 3 h = 1,5 kWh.' },
              { q:'1 kWh kostet 0,30 €. 1,5 kWh kostet?', hint:'1,5 × 0,30 = ?', options:['0,20 €','0,45 €','0,30 €','1,80 €'], correct:1, explanation:'1,5 × 0,30 = 0,45 €.' },
              { q:'Laptop 60 W, täglich 4 h. Verbrauch pro Tag?', hint:'E = P × t = 0,06 kW × 4 h.', options:['0,24 kWh','2,4 kWh','24 kWh','240 kWh'], correct:0, explanation:'E = 0,06 × 4 = 0,24 kWh pro Tag.' },
              { q:'Monatliche Kosten: 30 kWh verbraucht, 0,30 €/kWh?', hint:'Kosten = Verbrauch × Preis = 30 × 0,30.', options:['3 €','9 €','30 €','90 €'], correct:1, explanation:'30 × 0,30 = 9 €.' },
              { q:'Was bedeutet „Wirkungsgrad"?', hint:'Kein Gerät wandelt 100% der Energie in nützliche Energie um.', options:['Leistung in Watt','Nutze Energie ÷ zugeführte Energie × 100 %','Spannung × Zeit','Stromstärke ÷ Widerstand'], correct:1, explanation:'Wirkungsgrad = (Nutzenergie ÷ zugeführte Energie) × 100 %.' },
            ]
          },
          { id:'e3', type:'Schaltungen', diff:3, title:'Reihen- und Parallelschaltung',
            desc:'Was passiert mit Spannung und Strom?',
            questions:[
              { q:'Was ist eine Reihenschaltung?', hint:'Alle Bauteile hintereinander in einem einzigen Stromkreis.', options:['Bauteile nebeneinander','Bauteile hintereinander','Jedes mit eigener Quelle','Keins davon'], correct:1, explanation:'Strom fließt durch alle Bauteile nacheinander.' },
              { q:'Stromstärke in der Reihenschaltung?', hint:'Es gibt nur einen Weg für den Strom → gleiche Menge fließt überall.', options:['Überall verschieden','Überall gleich','Nimmt ab','Nimmt zu'], correct:1, explanation:'In der Reihenschaltung ist I überall gleich.' },
              { q:'Spannung in der Parallelschaltung?', hint:'Alle Zweige hängen direkt an der Spannungsquelle.', options:['Verschieden pro Zweig','An allen Zweigen gleich','Null','Verdoppelt'], correct:1, explanation:'U ist an allen Parallelzweigen gleich.' },
              { q:'Welche Schaltung bei Haushaltsgeräten?', hint:'Jedes Gerät muss unabhängig ein- und ausschaltbar sein.', options:['Reihe','Parallel','Gemischt','Keine'], correct:1, explanation:'Parallelschaltung – jedes Gerät unabhängig schaltbar.' },
              { q:'Zwei Widerstände (10Ω und 20Ω) in Reihe. Gesamtwiderstand?', hint:'Reihe: Widerstände addieren sich. R_ges = R1 + R2.', options:['10 Ω','15 Ω','30 Ω','200 Ω'], correct:2, explanation:'R_ges = 10 + 20 = 30 Ω.' },
              { q:'Was passiert in der Reihenschaltung, wenn eine Lampe ausfällt?', hint:'Kette unterbrochen → Strom kann nicht mehr fließen.', options:['Andere leuchten heller','Andere leuchten weiter','Alle gehen aus','Nichts ändert sich'], correct:2, explanation:'Alle Lampen erlöschen – der Stromkreis ist unterbrochen.' },
              { q:'Spannung an Reihenschaltung 12V, 3 gleiche Widerstände. Spannung pro Widerstand?', hint:'Spannung teilt sich gleichmäßig auf alle auf: 12 ÷ 3.', options:['3 V','4 V','6 V','12 V'], correct:1, explanation:'12 V ÷ 3 = 4 V pro Widerstand.' },
              { q:'Was ist ein Kurzschluss?', hint:'Strom nimmt den Weg des geringsten Widerstands.', options:['Zu hoher Widerstand','Zu niedrige Spannung','Direktverbindung ohne Widerstand','Keine Spannung'], correct:2, explanation:'Kurzschluss: Strom fließt direkt ohne Widerstand → gefährlich hohe Stromstärke.' },
            ]
          },
        ]
      },
    ]
  },

  /* =========================================================  KLASSE 9  */
  klasse9: {
    id:'klasse9', num:9, label:'Klasse 9',
    emoji:'🧪', color:['#D97706','#FBBF24'], light:'#FEF3C7',
    tagline:'Quadratische Gleichungen und Wellen',
    subjects:[
      {
        id:'mathe', name:'Mathematik', icon:'🔢',
        desc:'Quadratische Gleichungen & Trigonometrie',
        color:'#2563EB',
        intro:'Klasse 9 Mathematik – jetzt kommen quadratische Gleichungen und Trigonometrie! Mit den richtigen Schritten löst du jede Aufgabe. Ich zeige dir alles systematisch mit Beispielen aus Physik, Sport und Technik!',
        topics:[
          { name:'Quadratische Funktionen (Parabeln)', diff:3,
            explanation:'Der Wurf eines Basketballs, ein springender Wasserstrahl, das Seil einer Hängebrücke – sie alle beschreiben Parabeln! Eine Parabel ist der Graph einer quadratischen Funktion der Form y = ax² + bx + c. Die einfachste Parabel ist y = x²: Sie öffnet sich nach oben und hat ihren tiefsten Punkt, den Scheitelpunkt, im Ursprung (0|0). Ist a positiv, öffnet die Parabel nach oben (Lächeln); ist a negativ, öffnet sie nach unten (Trauriges Gesicht). Je größer der Betrag von a, desto schmaler und steiler ist die Parabel. Die Parabel y = (x – 2)² + 3 hat ihren Scheitelpunkt bei (2|3) – die Zahl in der Klammer verschiebt horizontal, die addierte Zahl verschiebt vertikal. Nullstellen sind die x-Werte, wo die Parabel die x-Achse schneidet (y = 0 setzen). Satellitenschüsseln und Autoscheinwerfer nutzen die Reflexionseigenschaft der Parabel: Alle Strahlen werden in einem Punkt (Brennpunkt) gebündelt. Quadratische Funktionen sind überall in Physik, Technik und Wirtschaft!' },
          { name:'Quadratische Gleichungen – Lösungsformel', diff:3,
            explanation:'Bei einem Ballwurf in der Physik entsteht automatisch eine quadratische Gleichung: Wann trifft der Ball den Boden? Die allgemeine Form lautet: ax² + bx + c = 0. Zur Lösung gibt es die Mitternachtsformel (auch Lösungsformel genannt): x = (–b ± Wurzel(b² – 4ac)) ÷ (2a). Der Ausdruck unter der Wurzel heißt Diskriminante (D = b² – 4ac) und verrät, wie viele Lösungen es gibt: Ist D > 0, gibt es zwei verschiedene Lösungen (Parabel schneidet x-Achse zweimal). Ist D = 0, gibt es genau eine Lösung (Parabel berührt x-Achse nur einmal). Ist D < 0, gibt es keine reelle Lösung (Parabel berührt die x-Achse gar nicht). Beispiel: x² – 5x + 6 = 0. Hier ist a=1, b=–5, c=6. D = 25 – 24 = 1 > 0 → zwei Lösungen: x = (5 ± 1) ÷ 2, also x₁ = 3 und x₂ = 2. Manchmal geht es einfacher: x² – 9 = 0 → x² = 9 → x = ±3. Quadratische Gleichungen stecken in Physik, Ingenieurwesen, Wirtschaft und Computergrafik!' },
          { name:'Ähnlichkeit und Strahlensätze', diff:3,
            explanation:'Wie hoch ist ein Gebäude, ohne es zu besteigen? Ganz einfach mit Ähnlichkeit! Stell dich in die Sonne und miss deinen Schatten (z.B. 0,5 m) und den Schatten des Gebäudes (z.B. 20 m). Wenn du 1,70 m groß bist, kannst du rechnen: 1,70 ÷ 0,5 = 3,4, also ist das Gebäude 20 × 3,4 = 68 m hoch! Zwei Figuren sind ähnlich, wenn sie dieselbe Form haben – also gleiche Winkel und proportionale Seiten. Maßstab gibt das Verhältnis der entsprechenden Seiten an (z.B. 1:100 bei Bauplänen). Die Strahlensätze beschreiben, wie sich Strecken verhalten, wenn zwei Geraden von einem gemeinsamen Punkt ausgehen und von parallelen Linien geschnitten werden: Die Strecken sind dann immer proportional zueinander. Erster Strahlensatz: parallele Abschnitte teilen die Strahlen im gleichen Verhältnis. Zweiter Strahlensatz: die parallelen Abschnitte selbst verhalten sich wie die Abstände vom Ausgangspunkt. Architekten, Landvermesser, GPS-Systeme und Computergrafik nutzen Ähnlichkeit und Strahlensätze täglich!' },
          { name:'Trigonometrie: Sinus, Kosinus, Tangens', diff:3,
            explanation:'GPS-Navigation, 3D-Computerspiele, Kransysteme und Architektur – überall steckt Trigonometrie! Im rechtwinkligen Dreieck beziehen sich Sinus, Kosinus und Tangens immer auf einen bestimmten Winkel (alpha). Sinus(alpha) = Gegenkathete ÷ Hypotenuse – die Seite "gegenüber" dem Winkel durch die längste Seite. Kosinus(alpha) = Ankathete ÷ Hypotenuse – die Seite "neben" dem Winkel durch die Hypotenuse. Tangens(alpha) = Gegenkathete ÷ Ankathete. Die hilfreiche Eselsbrücke SOHCAHTOA hilft dir: SOH = Sinus = Gegenkathete/Hypotenuse, CAH = Kosinus = Ankathete/Hypotenuse, TOA = Tangens = Gegenkathete/Ankathete. Beispiel: Hypotenuse = 10 m, Winkel = 30°. Gegenkathete = sin(30°) × 10 = 0,5 × 10 = 5 m. Wichtige Werte auswendig lernen: sin(30°) = 0,5, sin(45°) ≈ 0,71, sin(60°) ≈ 0,87, cos(60°) = 0,5. Mit dem Taschenrechner kannst du auch unbekannte Winkel berechnen: Wenn sin(alpha) = 0,5, dann alpha = arcsin(0,5) = 30°. Trigonometrie ist das Werkzeug für alle Berechnungen mit Winkeln und Seiten!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Terme und Gleichungen – Wiederholung',
            desc:'Grundlegendes Handwerkszeug für Klasse 9.',
            questions:[
              { q:'Vereinfache: 4x + 3x', hint:'Gleichartige Terme zusammenfassen.', options:['7x²','7x','12x','43x'], correct:1, explanation:'4x + 3x = 7x.' },
              { q:'Löse: x + 9 = 15', hint:'9 subtrahieren.', options:['x=24','x=6','x=135','x=–6'], correct:1, explanation:'x = 15 – 9 = 6.' },
              { q:'Multipliziere aus: 3(x + 4)', hint:'3 × x und 3 × 4', options:['3x + 4','3x + 7','3x + 12','x + 12'], correct:2, explanation:'3(x + 4) = 3x + 12.' },
              { q:'Wie viel ist 15 % von 200?', hint:'0,15 × 200', options:['15','25','30','150'], correct:2, explanation:'15% × 200 = 30.' },
              { q:'Faktorisiere: 6x + 9', hint:'Gemeinsamer Faktor ist 3.', options:['3(2x + 3)','6(x + 9)','3(6x + 9)','2(3x + 9)'], correct:0, explanation:'6x + 9 = 3(2x + 3).' },
              { q:'Löse: 2x – 5 = 11', hint:'Schritt 1: +5 auf beiden Seiten → 2x = 16. Schritt 2: ÷2 → x = 8.', options:['x = 3','x = 8','x = 16','x = 6'], correct:1, explanation:'2x = 16 → x = 8.' },
              { q:'Vereinfache: 5a – 2a + 3a', hint:'Alle a-Terme zusammenzählen: 5 – 2 + 3 = ?', options:['6a','7a','8a','10a'], correct:2, explanation:'5a – 2a + 3a = 6a.' },
              { q:'Löse: 3y = 21', hint:'Beide Seiten durch 3 dividieren: y = 21 ÷ 3.', options:['y = 7','y = 18','y = 63','y = 3'], correct:0, explanation:'3y = 21 → y = 7.' },
            ]
          },
          { id:'e2', type:'Funktionen', diff:2, title:'Parabeln und quadratische Funktionen',
            desc:'Graphen und Eigenschaften von Parabeln.',
            questions:[
              { q:'Was ist der Scheitelpunkt von y = x²?', hint:'Tiefster Punkt der Parabel.', options:['(0|0)','(1|1)','(0|1)','(–1|0)'], correct:0, explanation:'y = x² hat den Scheitelpunkt im Ursprung (0|0).' },
              { q:'Öffnet y = –x² nach oben oder unten?', hint:'Negatives a-Vorzeichen.', options:['Nach oben','Nach unten','Senkrecht','Waagerecht'], correct:1, explanation:'Negatives Vorzeichen → Parabel öffnet nach unten.' },
              { q:'Wo schneidet y = x² – 4 die x-Achse?', hint:'y = 0 setzen: x² = 4', options:['x = 2','x = –2','x = 2 und x = –2','x = 4'], correct:2, explanation:'x² = 4 → x = ±2.' },
              { q:'Was ist ein Scheitelpunkt?', hint:'Extrempunkt der Parabel.', options:['Schnittpunkt mit y-Achse','Tiefster oder höchster Punkt','Nullstelle','Steigung'], correct:1, explanation:'Scheitelpunkt = Tiefpunkt (Minimum) oder Hochpunkt (Maximum).' },
              { q:'Scheitelpunkt von y = (x – 2)²?', hint:'Die Form y = (x – a)² hat den Scheitelpunkt bei (a|0).', options:['(0|0)','(2|0)','(–2|0)','(0|2)'], correct:1, explanation:'y = (x–2)² → Scheitelpunkt bei (2|0).' },
              { q:'Wohin verschiebt y = x² + 3 die Parabel y = x²?', hint:'Die + 3 verschiebt den Graphen nach oben.', options:['3 nach links','3 nach rechts','3 nach oben','3 nach unten'], correct:2, explanation:'Addieren verschiebt die Parabel nach oben.' },
              { q:'Wie lautet die Symmetrieachse von y = x²?', hint:'Die Parabel ist links und rechts spiegelbildlich – an welcher Achse?', options:['x-Achse','y-Achse','x = 1','x = –1'], correct:1, explanation:'y = x² ist symmetrisch zur y-Achse.' },
              { q:'Scheitelpunkt von y = x² – 6x + 9?', hint:'Schreibe um: (x – 3)² → Scheitelpunkt bei (3|0).', options:['(3|0)','(–3|0)','(0|9)','(6|0)'], correct:0, explanation:'x² – 6x + 9 = (x–3)² → Scheitelpunkt (3|0).' },
            ]
          },
          { id:'e3', type:'Algebra', diff:3, title:'Quadratische Gleichungen',
            desc:'Standardform und Lösungsformel.',
            questions:[
              { q:'Form einer quadratischen Gleichung?', hint:'Höchstes Glied: x²', options:['ax+b=0','ax²+bx+c=0','ax³+bx=0','a/x=b'], correct:1, explanation:'ax² + bx + c = 0.' },
              { q:'Diskriminante für x²–5x+6=0?', hint:'D = b²–4ac', options:['D=1','D=25','D=49','D=–1'], correct:0, explanation:'D = 25–24 = 1.' },
              { q:'Wann keine reelle Lösung?', hint:'Schau auf D.', options:['D=0','D>0','D<0','D=1'], correct:2, explanation:'D < 0 → keine reelle Lösung.' },
              { q:'Löse: x²–4=0', hint:'x²=4 → x=±√4', options:['x=2','x=–2','x=2 oder x=–2','x=4'], correct:2, explanation:'x = ±2.' },
              { q:'Lösungen von x²+1=0?', hint:'x²=–1 → ?', options:['Zwei','Eine','Keine reelle','Unendlich viele'], correct:2, explanation:'Keine reelle Lösung.' },
              { q:'Löse: x² – 9 = 0', hint:'Schritt 1: x² = 9. Schritt 2: x = ±√9 = ±3.', options:['x = 3','x = –3','x = 3 oder x = –3','x = 9'], correct:2, explanation:'x² = 9 → x = ±3.' },
              { q:'Was bedeutet D = 0 bei der Lösungsformel?', hint:'Eine Lösung – der Graph berührt die x-Achse nur einmal.', options:['Keine Lösung','Genau eine Lösung','Zwei Lösungen','Unendlich viele'], correct:1, explanation:'D = 0 → genau eine (doppelte) Lösung.' },
              { q:'Wie viele Lösungen hat x² – 6x + 9 = 0?', hint:'Diskriminante: D = 36 – 36 = 0.', options:['Keine','Genau eine','Zwei','Unendlich'], correct:1, explanation:'D = 0 → genau eine Lösung: x = 3.' },
            ]
          },
          { id:'e4', type:'Trigonometrie', diff:3, title:'Sinus, Kosinus, Tangens',
            desc:'Winkelfunktionen anwenden.',
            questions:[
              { q:'Definition von sin(α)?', hint:'Gegenkathete / Hypotenuse', options:['Ank/Hyp','Geg/Hyp','Geg/Ank','Hyp/Geg'], correct:1, explanation:'sin(α) = Gegenkathete / Hypotenuse.' },
              { q:'Definition von cos(α)?', hint:'Ankathete / Hypotenuse', options:['Geg/Hyp','Ank/Geg','Ank/Hyp','Hyp/Ank'], correct:2, explanation:'cos(α) = Ankathete / Hypotenuse.' },
              { q:'Was ist sin(30°)?', hint:'Merke: sin(30°) = 1/2', options:['0','0,5','0,71','1'], correct:1, explanation:'sin(30°) = 0,5.' },
              { q:'Hypotenuse=10, α=30°. Gegenkathete?', hint:'Geg = sin(α) × Hyp', options:['3','5','8,66','10'], correct:1, explanation:'0,5 × 10 = 5.' },
              { q:'Was ist cos(60°)?', hint:'Merke: cos(60°) = 1/2 = 0,5.', options:['0','0,5','0,71','1'], correct:1, explanation:'cos(60°) = 0,5.' },
              { q:'Was ist tan(45°)?', hint:'tan(45°) = sin(45°) / cos(45°). Beide gleich → Ergebnis = 1.', options:['0','0,5','1','√2'], correct:2, explanation:'tan(45°) = 1.' },
              { q:'Hypotenuse=10, α=60°. Ankathete?', hint:'Ank = cos(α) × Hyp = cos(60°) × 10 = 0,5 × 10.', options:['3','5','8,66','10'], correct:1, explanation:'cos(60°) × 10 = 5.' },
              { q:'Welcher Winkel liegt im rechtwinkligen Dreieck gegenüber der Hypotenuse?', hint:'Die Hypotenuse ist die längste Seite.', options:['30°','45°','60°','90°'], correct:3, explanation:'Die Hypotenuse liegt gegenüber dem 90°-Winkel (rechter Winkel).' },
            ]
          },
        ]
      },
      {
        id:'physik', name:'Physik', icon:'⚡',
        desc:'Wellen, Schall und Licht',
        color:'#0284C7',
        intro:'Willkommen in Physik Klasse 9! Wir erkunden Wellen, Schall und Licht. Diese Phänomene begegnen dir in Musik, Handy-Übertragung und optischen Geräten!',
        topics:[
          { name:'Wellen und Wellengrößen', diff:2,
            explanation:'Wirfst du einen Stein ins Wasser, breiten sich Wellen kreisförmig aus – das Wasser selbst bewegt sich dabei kaum vorwärts, nur die Energie wird transportiert! Wellen transportieren immer Energie, aber keine Materie. Jede Welle hat eine Wellenlänge (lambda): der Abstand von einem Wellenberg zum nächsten, gemessen in Metern. Die Frequenz (f) gibt an, wie viele vollständige Schwingungen pro Sekunde stattfinden – Einheit: Hertz (Hz). Die Periode (T) ist die Zeit für eine vollständige Schwingung: T = 1/f. Die Ausbreitungsgeschwindigkeit (v) hängt mit Wellenlänge und Frequenz zusammen: v = lambda × f. Transversalwellen schwingen quer zur Ausbreitungsrichtung (z.B. Wasserwellen, Lichtwellen). Longitudinalwellen schwingen in Ausbreitungsrichtung (z.B. Schallwellen). Die Lichtgeschwindigkeit im Vakuum beträgt 300.000 km/s – das ist die schnellste Geschwindigkeit im Universum. Wellen begegnen dir in Musik (Schall), Handy (Radiowellen), Licht und Medizin (Ultraschall)!' },
          { name:'Schall und Schallgeschwindigkeit', diff:2,
            explanation:'Schall entsteht durch Schwingungen – wenn eine Gitarrensaite schwingt, drückt sie die Luft zusammen und verdünnt sie abwechselnd, und diese Druckwellen wandern als Schall zu deinen Ohren. Schall ist eine mechanische Longitudinalwelle: die Luftteilchen schwingen in dieselbe Richtung, in die sich der Schall ausbreitet. Schall braucht immer ein Medium (Luft, Wasser, Feststoffe) – im Vakuum ist es still! In Luft beträgt die Schallgeschwindigkeit etwa 343 m/s bei 20°C – wärmer macht Schall schneller. Im Wasser ist Schall etwa viermal schneller (~1.480 m/s), in Stahl sogar etwa 15-mal schneller (~5.000 m/s). Den Abstand eines Gewitters berechnest du so: Sekunden zwischen Blitz und Donner × 340 m = Entfernung in Metern. Ultraschall (über 20.000 Hz) hören Menschen nicht, aber Hunde und Fledermäuse schon. In der Medizin nutzt man Ultraschall für sichere Untersuchungen ohne Strahlung. Infrasschall (unter 20 Hz) wird von Elefanten und Walen über Hunderte Kilometer kommuniziert!' },
          { name:'Licht: Spektrum und Farben', diff:2,
            explanation:'Weißes Licht sieht nach einer Farbe aus, enthält aber alle Farben des Regenbogens – das zeigt ein Prisma eindrucksvoll! Ein Prisma bricht verschiedene Wellenlängen unterschiedlich stark und trennt sie dadurch: Violett wird am stärksten gebrochen, Rot am schwächsten. Das sichtbare Lichtspektrum reicht von Violett (ca. 380 nm, kürzeste Wellenlänge) über Blau, Grün, Gelb, Orange bis Rot (ca. 780 nm, längste Wellenlänge). Je kürzer die Wellenlänge, desto mehr Energie hat das Licht. Jenseits des sichtbaren Bereichs gibt es unsichtbare Strahlung: Infrarot (wärmt uns, Wärmekameras nutzen es) und Ultraviolett (lässt uns braun werden, kann Haut schädigen). Weißes Licht entsteht, wenn alle Farben zusammen auf unser Auge treffen – ein weißes T-Shirt reflektiert alle Farben, ein schwarzes absorbiert sie alle. Farben entstehen durch selektive Absorption: Eine rote Tomate absorbiert alle Farben außer Rot und reflektiert nur Rot. So erklären sich alle Farben in unserer Welt!' },
          { name:'Radioaktivität – Grundlagen', diff:3,
            explanation:'Manche Atomkerne sind instabil – sie senden Strahlung aus, um stabil zu werden. Das nennt man radioaktiven Zerfall. Es gibt drei wichtige Strahlungsarten: Alpha-Strahlung (α) besteht aus Heliumkernen (2 Protonen + 2 Neutronen) und wird schon von einem Blatt Papier oder der Haut gestoppt – gefährlich ist sie nur, wenn Alpha-Strahler eingeatmet oder geschluckt werden. Beta-Strahlung (β) besteht aus schnellen Elektronen und dringt tiefer ein – eine dünne Aluminiumschicht hält sie auf. Gamma-Strahlung (γ) ist elektromagnetische Strahlung (wie Licht, aber viel energiereicher) und dringt tief in Materie ein – nur dickes Blei oder Beton können sie abschirmen. Die Halbwertszeit gibt an, nach welcher Zeit die Hälfte der radioaktiven Atome zerfallen ist – sie reicht von Bruchteilen einer Sekunde bis zu Milliarden Jahren. Kernkraftwerke nutzen die enorme Energie bei der Kernspaltung (Uran-235), Kernfusionsreaktoren der Zukunft sollen Wasserstoffkerne verschmelzen lassen. In der Medizin nutzt man Radioaktivität für Diagnose und Therapie bei Krebs!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Wellen – Grundbegriffe',
            desc:'Was sind Wellen? Grundbegriffe einfach erklärt.',
            questions:[
              { q:'Was überträgt eine Welle?', hint:'Nicht die Materie selbst.', options:['Materie','Energie','Druck','Wärme'], correct:1, explanation:'Wellen transportieren Energie, nicht Materie.' },
              { q:'Was ist die Frequenz einer Welle?', hint:'Schwingungen pro Sekunde.', options:['Abstand zweier Wellenberge','Höhe der Welle','Schwingungen pro Sekunde','Ausbreitungsgeschwindigkeit'], correct:2, explanation:'Frequenz = Anzahl Schwingungen pro Sekunde, Einheit: Hertz (Hz).' },
              { q:'Einheit der Frequenz?', hint:'Benannt nach Heinrich H.', options:['Meter','Sekunde','Hertz (Hz)','Newton'], correct:2, explanation:'Frequenz wird in Hertz (Hz) gemessen.' },
              { q:'Was ist eine Transversalwelle?', hint:'Quer zur Ausbreitungsrichtung.', options:['Schwingung in Ausbreitungsrichtung','Schwingung quer zur Ausbreitungsrichtung','Keine Schwingung','Stehende Welle'], correct:1, explanation:'Transversalwellen schwingen quer – z. B. Lichtwellen.' },
              { q:'Schallwellen sind …?', hint:'Schall braucht ein Medium.', options:['Transversalwellen','Longitudinalwellen','Elektromagn. Wellen','Lichtwellen'], correct:1, explanation:'Schall ist eine Longitudinalwelle (Druckwelle).' },
              { q:'Was ist ein Wellenberg?', hint:'Der höchste Punkt einer Welle.', options:['Tiefster Punkt der Welle','Höchster Punkt der Welle','Abstand zweier Wellenberge','Schwingungszeit'], correct:1, explanation:'Wellenberg = Hochpunkt der Welle; das Gegenteil ist das Wellental.' },
              { q:'Kann Schall im Vakuum reisen?', hint:'Schall braucht Materie zum Schwingen.', options:['Ja, sehr schnell','Ja, aber langsam','Nein, kein Medium vorhanden','Nur bei hoher Frequenz'], correct:2, explanation:'Schall ist eine mechanische Welle und braucht ein Medium – im Vakuum überträgt sich kein Schall.' },
              { q:'Was ist die Periode T einer Schwingung?', hint:'Zeit für eine vollständige Schwingung.', options:['Anzahl Schwingungen pro Sekunde','Zeit für eine vollständige Schwingung','Abstand zweier Wellenberge','Amplitude der Welle'], correct:1, explanation:'Periode T = Zeit für eine vollständige Schwingung; Einheit: Sekunde (s).' },
            ]
          },
          { id:'e2', type:'Wellen', diff:2, title:'Schall und Licht',
            desc:'Wellengrößen und Ausbreitung.',
            questions:[
              { q:'Schallgeschwindigkeit in Luft (ca.)?', hint:'Wie schnell hören wir Donner?', options:['100 m/s','343 m/s','3.000 m/s','300.000 m/s'], correct:1, explanation:'Ca. 343 m/s (bei 20 °C).' },
              { q:'Lichtgeschwindigkeit (ca.)?', hint:'Schnellste im Universum.', options:['343 m/s','300.000 km/s','3.000 km/s','30.000 m/s'], correct:1, explanation:'c ≈ 300.000 km/s.' },
              { q:'Donner 5 Sek. nach Blitz. Entfernung?', hint:'s = v × t, v ≈ 340 m/s', options:['340 m','680 m','1.700 m','5.000 m'], correct:2, explanation:'340 × 5 = 1.700 m = 1,7 km.' },
              { q:'Was ist die Wellenlänge?', hint:'Von Berg zu Berg.', options:['Anzahl Schwingungen/Sek.','Abstand zweier Wellenberge','Höhe der Welle','Ausbreitungsgeschwindigkeit'], correct:1, explanation:'Wellenlänge = Abstand zweier aufeinander folgender Wellenberge.' },
              { q:'Welche Lichtfarbe hat die kürzeste Wellenlänge?', hint:'Denk an den Regenbogen.', options:['Rot','Grün','Blau','Violett'], correct:3, explanation:'Violett hat die kürzeste Wellenlänge.' },
              { q:'Was ist Ultraschall?', hint:'Schall oberhalb des menschlichen Hörbereichs (> 20.000 Hz).', options:['Schall unter 20 Hz','Schall über 20.000 Hz','Licht mit hoher Frequenz','Sehr lauter Schall'], correct:1, explanation:'Ultraschall hat Frequenzen über 20.000 Hz – für Menschen nicht hörbar, genutzt in Medizin und Sonar.' },
              { q:'In welchem Stoff breitet sich Schall am schnellsten aus?', hint:'Je dichter das Material, desto schneller kann Schall Teilchen anstoßen.', options:['Luft','Wasser','Stahl','Vakuum'], correct:2, explanation:'Schall ist im Stahl am schnellsten (~5.000 m/s) – Festkörper leiten Schall besser als Gase oder Flüssigkeiten.' },
              { q:'Was passiert mit weißem Licht durch ein Prisma?', hint:'Ein Prisma zerlegt Licht – wie ein Regenbogen.', options:['Es wird abgeschwächt','Es wird in Farben aufgespalten','Es bleibt weiß','Es wird zu Infrarot'], correct:1, explanation:'Weißes Licht enthält alle Farben – ein Prisma bricht jede Wellenlänge unterschiedlich stark (Dispersion).' },
            ]
          },
          { id:'e3', type:'Strahlung', diff:3, title:'Radioaktivität',
            desc:'Strahlungsarten und Eigenschaften.',
            questions:[
              { q:'Welche Strahlung wird von Papier gestoppt?', hint:'Die schwächste Strahlung.', options:['Gamma','Beta','Alpha','Röntgen'], correct:2, explanation:'Alpha-Strahlung.' },
              { q:'Welche Strahlung dringt am tiefsten ein?', hint:'Braucht Blei oder Beton.', options:['Alpha','Beta','Gamma','Infrarot'], correct:2, explanation:'Gamma-Strahlung.' },
              { q:'Was misst die Halbwertszeit?', hint:'Zeit bis zur Hälfte.', options:['Wie lange Strahlung leuchtet','Zeit bis Hälfte der Atome zerfallen','Energie der Strahlung','Reichweite'], correct:1, explanation:'Halbwertszeit = Zeit, nach der die Hälfte zerfallen ist.' },
              { q:'Was sind Alpha-Teilchen?', hint:'Zwei Protonen + zwei Neutronen = Heliumkern.', options:['Elektronen','Heliumkerne','Photonen','Neutrinos'], correct:1, explanation:'Alpha-Teilchen bestehen aus 2 Protonen und 2 Neutronen – entspricht einem Heliumkern.' },
              { q:'Was sind Beta-Strahlen?', hint:'Schnelle Elektronen oder Positronen aus dem Kern.', options:['Heliumkerne','Lichtteilchen','Schnelle Elektronen','Magnetwellen'], correct:2, explanation:'Beta-Strahlung: schnelle Elektronen (β⁻) oder Positronen (β⁺), entstehen im Atomkern.' },
              { q:'Welche Strahlung stoppt eine dünne Aluminiumschicht?', hint:'Alpha wird von Papier gestoppt, Gamma braucht Beton – Beta ist dazwischen.', options:['Alpha','Beta','Gamma','Röntgen'], correct:1, explanation:'Beta-Strahlung wird von wenigen Millimetern Aluminium gestoppt.' },
              { q:'Was bedeutet radioaktiver Zerfall?', hint:'Ein instabiler Kern gibt Energie und Strahlung ab.', options:['Ein Atom verbrennt','Ein instabiler Atomkern sendet Strahlung aus','Elektronen verlassen das Atom','Neutronen werden abgespalten'], correct:1, explanation:'Radioaktiver Zerfall: instabile Atomkerne werden stabil, indem sie Strahlung (α, β, γ) abgeben.' },
              { q:'Wofür wird Gamma-Strahlung in der Medizin eingesetzt?', hint:'Gamma dringt tief ins Gewebe ein.', options:['Ultraschalldiagnostik','Krebsbehandlung (Strahlentherapie)','Röntgenbilder','Blutdruckmessung'], correct:1, explanation:'Gamma-Strahlung wird zur gezielten Bestrahlungstherapie bei Krebs eingesetzt.' },
            ]
          },
        ]
      },
    ]
  },

  /* =========================================================  KLASSE 10  */
  klasse10: {
    id:'klasse10', num:10, label:'Klasse 10',
    emoji:'🎓', color:['#DC2626','#F87171'], light:'#FEE2E2',
    tagline:'Abitur-Vorbereitung: Analysis und Quantenphysik',
    subjects:[
      {
        id:'mathe', name:'Mathematik', icon:'🔢',
        desc:'Stochastik, Analysis und Analytische Geometrie',
        color:'#2563EB',
        intro:'Willkommen in Klasse 10 Mathematik – dem letzten Schritt vor dem Abitur! Wir vertiefen Wahrscheinlichkeitsrechnung, Analysis und Vektoren. Diese Grundlagen stecken in KI, Wirtschaft und Technik!',
        topics:[
          { name:'Wahrscheinlichkeitsrechnung', diff:3,
            explanation:'Wetterdienste berechnen "70% Regenwahrscheinlichkeit", Versicherungen kalkulieren Risiken und KI-Algorithmen treffen Entscheidungen – all das basiert auf Wahrscheinlichkeitsrechnung! Wahrscheinlichkeit (P) misst, wie wahrscheinlich ein Ereignis eintritt: P = (günstige Ergebnisse) ÷ (alle möglichen Ergebnisse). Beim Würfeln ist P(eine 6) = 1/6. Beim Laplace-Experiment sind alle Ergebnisse gleichwahrscheinlich. Die Gegenwahrscheinlichkeit: P(A nicht eintritt) = 1 – P(A). Wenn P(Regen) = 0,3, dann P(kein Regen) = 0,7. Bei unabhängigen Ereignissen multiplizierst du: P(zweimal Kopf beim Münzwurf) = 0,5 × 0,5 = 0,25 = 25%. Beim Lotto (6 aus 49) gibt es 13.983.816 mögliche Kombination – die Gewinnwahrscheinlichkeit ist also etwa 1 zu 14 Millionen! Baumdiagramme helfen beim Visualisieren mehrstufiger Experimente: Jeder Ast zeigt eine Möglichkeit und die Wahrscheinlichkeiten der Äste auf demselben Weg werden multipliziert. Wahrscheinlichkeitsrechnung ist die Grundlage von Statistik, KI, Medizin, Finanzen und Spieltheorie!' },
          { name:'Exponentialfunktionen', diff:3,
            explanation:'Ein TikTok-Video bekommt am ersten Tag 100 Views, am zweiten 200, am dritten 400, am vierten 800 – die Anzahl verdoppelt sich täglich. Das ist exponentielles Wachstum! Die allgemeine Form lautet: f(x) = a × bˣ. Dabei ist a der Startwert und b die Basis (der Wachstumsfaktor). Ist b > 1, wächst die Funktion (z.B. Zinsen, Bevölkerung, Virusausbreitung). Ist 0 < b < 1, nimmt die Funktion ab (exponentieller Zerfall, z.B. radioaktiver Zerfall, Medikament im Körper). Der Unterschied zu linearem Wachstum ist enorm: Linear wächst um einen festen Betrag (z.B. +100 pro Tag), exponentiell wächst um einen festen Faktor (z.B. ×2 pro Tag). Nach kurzer Zeit überholt Exponentialwachstum lineares Wachstum bei weitem. Zinseszins ist ein klassisches Beispiel: 1.000 € bei 5% Zinsen nach 30 Jahren: 1.000 × 1,05³⁰ ≈ 4.322 €! Die Eulersche Zahl e ≈ 2,718 ist die Basis der natürlichen Exponentialfunktion und überall in der Natur zu finden. Exponentialfunktionen sind fundamental in Mathematik, Physik, Biologie, Wirtschaft und Informatik!' },
          { name:'Ableitung und Analysis', diff:3,
            explanation:'Wie schnell steigt gerade ein Aktienkurs? Wie stark beschleunigt ein Elektroauto in genau diesem Moment? Die Ableitung beantwortet diese Fragen! Die Ableitung f\'(x) gibt die momentane Steigung des Graphen von f(x) an jedem Punkt x an. Ist f\'(x) > 0, steigt der Graph; ist f\'(x) < 0, fällt er; ist f\'(x) = 0, liegt ein Extrempunkt oder Sattelpunkt vor. Mit der Potenzregel leitest du einfach ab: f(x) = xⁿ → f\'(x) = n × xⁿ⁻¹. Beispiele: (x³)\' = 3x², (5x²)\' = 10x, (x)\' = 1, Konstante\' = 0. Für Summen: Jedes Glied einzeln ableiten. f(x) = 3x² + 2x + 5 → f\'(x) = 6x + 2. Extrempunkte findest du, indem du f\'(x) = 0 setzt und die Lösungen in f\'\'(x) einsetzt: f\'\'(x) > 0 = Tiefpunkt (Minimum), f\'\'(x) < 0 = Hochpunkt (Maximum). Analysis ist das Werkzeug für Optimierungsprobleme: Wann ist Gewinn maximal? Welche Form braucht ein Behälter, um bei minimalem Material maximales Volumen zu haben? Ableitung ist fundamental für Physik, Technik, KI und Wirtschaft!' },
          { name:'Analytische Geometrie – Vektoren', diff:3,
            explanation:'In 3D-Computerspielen, autonomen Fahrzeugen, Robotik und GPS werden ständig Vektoren berechnet. Ein Vektor beschreibt gleichzeitig eine Richtung und eine Länge (Betrag) im Raum. Im Gegensatz zu einer Zahl (Skalar) hat ein Vektor also auch eine Richtung. In 2D schreibt man einen Vektor als Spalte (a, b) – er bedeutet "a Schritte in x-Richtung und b Schritte in y-Richtung". In 3D kommt noch eine z-Komponente dazu. Vektoren addierst du komponentenweise: (2, 3) + (1, –1) = (3, 2). Multiplizierst du einen Vektor mit einer Zahl (Skalar), verändert sich seine Länge: 2 × (2, 3) = (4, 6). Die Länge (Betrag) eines Vektors berechnest du mit dem Satz des Pythagoras: |(a, b)| = Wurzel(a² + b²). Mit Vektoren beschreibst du Positionen, Geraden (Punkte + Richtung), Ebenen und Bewegungen im Raum. Der Skalarprodukt zweier Vektoren hilft, Winkel zwischen ihnen zu berechnen: Wenn das Skalarprodukt = 0, stehen sie senkrecht aufeinander. Vektoren sind das Fundament für 3D-Grafik, Physik und maschinelles Lernen!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Grundlagen Analysis – Funktionen lesen',
            desc:'Graphen verstehen und Eigenschaften ablesen.',
            questions:[
              { q:'Was ist ein Funktionswert f(x)?', hint:'x einsetzen → Ergebnis.', options:['Die Steigung','Der y-Wert bei gegebenem x','Die Nullstelle','Der Schnittpunkt'], correct:1, explanation:'f(x) ist der y-Wert, den die Funktion für x liefert.' },
              { q:'Wann hat eine Funktion eine Nullstelle?', hint:'Wo kreuzt der Graph die x-Achse?', options:['f(x) = 1','f(x) = x','f(x) = 0','x = 0'], correct:2, explanation:'Nullstelle: f(x) = 0 → Graph schneidet x-Achse.' },
              { q:'f(x) = 3x². Was ist f(2)?', hint:'3 × 2² einsetzen.', options:['6','9','12','36'], correct:2, explanation:'f(2) = 3 × 4 = 12.' },
              { q:'Was bedeutet f\'(x) > 0?', hint:'Positive Steigung.', options:['Graph fällt','Graph ist waagerecht','Graph steigt','Graph hat Knick'], correct:2, explanation:'f\'(x) > 0 bedeutet: Graph steigt an der Stelle x.' },
              { q:'Was ist die Ableitung einer Konstante, z. B. f(x) = 5?', hint:'Konstante ändert sich nie.', options:['5','1','0','–5'], correct:2, explanation:'Die Ableitung einer Konstante ist immer 0.' },
              { q:'f(x) = 2x + 5. Was ist f(0)?', hint:'x = 0 einsetzen: 2 × 0 + 5 = ?', options:['2','0','5','7'], correct:2, explanation:'f(0) = 2 × 0 + 5 = 5.' },
              { q:'Was ist eine Nullstelle?', hint:'Wo schneidet der Graph die x-Achse?', options:['x-Wert, wo f(x) = 0','y-Wert, wo x = 0','Steigung an x = 0','Scheitelpunkt'], correct:0, explanation:'Nullstelle: f(x) = 0, d. h. der Graph liegt auf der x-Achse.' },
              { q:'Was ist der Unterschied zwischen f(x) und f\'(x)?', hint:'f gibt den Wert an, f\' gibt die Steigung an.', options:['Kein Unterschied','f ist die Funktion, f\' ist ihre Steigungsfunktion','f\' ist die Fläche unter f','f ist die Ableitung von f\''], correct:1, explanation:'f(x) = Funktionswert; f\'(x) = momentane Steigung (Ableitung).' },
            ]
          },
          { id:'e2', type:'Exponential', diff:2, title:'Exponentialfunktionen',
            desc:'Wachstum und Zerfall erkennen und berechnen.',
            questions:[
              { q:'Allgemeine Form einer Exponentialfunktion?', hint:'f(x) = a × b^x', options:['f(x) = ax + b','f(x) = ax²','f(x) = a × bˣ','f(x) = x^a'], correct:2, explanation:'f(x) = a × bˣ, mit Basis b > 0.' },
              { q:'b > 1 bedeutet …?', hint:'Die Funktion wächst.', options:['Exponentieller Zerfall','Exponentielles Wachstum','Lineares Wachstum','Konstant'], correct:1, explanation:'b > 1 → Wachstum (z. B. Zinsen, Bevölkerung).' },
              { q:'f(x) = 2^x. Was ist f(3)?', hint:'2 hoch 3', options:['6','8','9','16'], correct:1, explanation:'2³ = 8.' },
              { q:'Welcher Vorgang ist exponentieller Zerfall?', hint:'b zwischen 0 und 1.', options:['Zinseszins','Bevölkerungswachstum','Radioaktiver Zerfall','TikTok-Views'], correct:2, explanation:'Radioaktiver Zerfall: Menge halbiert sich regelmäßig.' },
              { q:'Startmenge 100, halbiert sich alle 2 h. Nach 6 h?', hint:'3 Halbierungen: 100 → 50 → 25 → ?', options:['12,5','25','50','6,25'], correct:0, explanation:'100 × (½)³ = 12,5.' },
              { q:'Was ist die Eulersche Zahl e (ungefähr)?', hint:'e ist eine mathematische Konstante wie π.', options:['1','2','2,718','3,14'], correct:2, explanation:'e ≈ 2,718 – Basis der natürlichen Exponentialfunktion.' },
              { q:'f(x) = 3^x. Was ist f(0)?', hint:'Jede Zahl hoch 0 ist 1.', options:['0','1','3','9'], correct:1, explanation:'f(0) = 3⁰ = 1.' },
              { q:'0 < b < 1 in f(x) = a × bˣ. Was passiert?', hint:'Kleine Basis → Funktion nimmt ab statt zu.', options:['Exponentielles Wachstum','Lineares Wachstum','Exponentieller Zerfall','Konstante Funktion'], correct:2, explanation:'Basis zwischen 0 und 1 → exponentieller Zerfall (z. B. radioaktiver Zerfall, Halbwertszeitmodell).' },
            ]
          },
          { id:'e3', type:'Stochastik', diff:3, title:'Wahrscheinlichkeitsrechnung',
            desc:'Wahrscheinlichkeiten berechnen.',
            questions:[
              { q:'P(6 würfeln)?', hint:'6 Ergebnisse, 1 günstig.', options:['1/3','1/4','1/6','1/2'], correct:2, explanation:'P = 1/6.' },
              { q:'Gegenwahrscheinlichkeit zu P(A)=0,3?', hint:'1 – P(A)', options:['0,3','0,6','0,7','1,3'], correct:2, explanation:'0,7.' },
              { q:'Zweimal Münze: P(zweimal Kopf)?', hint:'½ × ½', options:['1/2','1/4','1/3','3/4'], correct:1, explanation:'¼ = 25 %.' },
              { q:'Was ist ein Laplace-Experiment?', hint:'Alle Ergebnisse gleich wahrscheinlich.', options:['Ungleiche Wahrscheinlichkeiten','Alle Ergebnisse gleichwahrscheinlich','Physikalisches Experiment','Ohne Zufall'], correct:1, explanation:'Alle Ergebnisse gleichwahrscheinlich.' },
              { q:'Urne: 3 rot, 7 blau. P(rot)?', hint:'3 von 10', options:['3/10','7/10','3/7','1/3'], correct:0, explanation:'P = 3/10 = 30 %.' },
              { q:'Münze 3-mal werfen: P(mindestens einmal Kopf)?', hint:'Leichter: P(kein Kopf) = (1/2)³ = 1/8. Dann: 1 – 1/8.', options:['1/8','3/8','7/8','1/2'], correct:2, explanation:'P(mind. 1 Kopf) = 1 – P(kein Kopf) = 1 – 1/8 = 7/8.' },
              { q:'52 Karten, 1 As ziehen: P?', hint:'4 Asse in 52 Karten: 4 ÷ 52.', options:['1/52','1/13','1/4','4/13'], correct:1, explanation:'P = 4/52 = 1/13 ≈ 7,7 %.' },
              { q:'Zwei unabhängige Ereignisse A und B: P(A und B) = ?', hint:'Unabhängig bedeuten: keines beeinflusst das andere.', options:['P(A) + P(B)','P(A) × P(B)','P(A) – P(B)','P(A) / P(B)'], correct:1, explanation:'Bei unabhängigen Ereignissen: P(A ∩ B) = P(A) × P(B).' },
            ]
          },
          { id:'e4', type:'Analysis', diff:3, title:'Ableitungen',
            desc:'Ableitung berechnen und anwenden.',
            questions:[
              { q:'Was gibt f\'(x) an?', hint:'Steigung an einem Punkt.', options:['Den Funktionswert','Die Steigung an Stelle x','Die Fläche darunter','Den Nullpunkt'], correct:1, explanation:'f\'(x) = momentane Steigung.' },
              { q:'Ableitung von f(x) = x²?', hint:'Potenzregel: n·x^(n-1)', options:['f\'=x','f\'=2x','f\'=x²','f\'=2'], correct:1, explanation:'f\'(x) = 2x.' },
              { q:'Ableitung von f(x) = 5x³?', hint:'3 × 5 × x²', options:['5x²','15x','15x²','3x²'], correct:2, explanation:'f\'(x) = 15x².' },
              { q:'Tiefpunkt von f(x) = x²–4x?', hint:'f\'(x)=0 → x=?', options:['x=0','x=2','x=–2','x=4'], correct:1, explanation:'f\'=2x–4=0 → x=2.' },
              { q:'Ableitung von f(x) = x⁴?', hint:'Potenzregel: n × x^(n–1) = 4 × x³.', options:['x³','3x³','4x³','4x⁴'], correct:2, explanation:'f\'(x) = 4x³.' },
              { q:'f(x) = 3x² + 2x. Was ist f\'(x)?', hint:'Jedes Glied einzeln ableiten: (3x²)\' = 6x, (2x)\' = 2.', options:['3x + 2','6x + 2','6x + 2x','3x² + 2'], correct:1, explanation:'f\'(x) = 6x + 2.' },
              { q:'f(x) = x³ – 3x. Wo liegt ein lokaler Extrempunkt?', hint:'f\'(x) = 0: 3x² – 3 = 0 → x² = 1 → x = ±1.', options:['x = 0','x = ±1','x = ±3','x = 3'], correct:1, explanation:'f\'= 3x²–3 = 0 → x = ±1. Extrempunkte bei x = 1 und x = –1.' },
              { q:'Was bedeutet f\'\'(x) > 0 an einem Extrempunkt?', hint:'Positive zweite Ableitung → Kurve ist nach oben gewölbt.', options:['Hochpunkt','Tiefpunkt (Minimum)','Wendepunkt','Keine Aussage möglich'], correct:1, explanation:'f\'\'(x) > 0 → Linkskrümmung → Tiefpunkt (Minimum).' },
            ]
          },
        ]
      },
      {
        id:'physik', name:'Physik', icon:'⚡',
        desc:'Mechanik, Optik und Elektromagnetismus',
        color:'#0284C7',
        intro:'Willkommen in Physik Klasse 10! Wir runden Mechanik ab und erkunden Optik und Elektromagnetismus. Diese Themen stecken in Glasfaserkabeln, Elektroautos und Smartphones!',
        topics:[
          { name:'Impuls und Impulserhaltung', diff:3,
            explanation:'Bei einem Autounfall überträgt sich Impuls von einem Fahrzeug auf das andere – deshalb sind Knautschzonen so wichtig! Sie verlängern die Aufprallzeit und verringern damit die wirkende Kraft. Der Impuls eines Körpers ist: p = m × v (Masse × Geschwindigkeit), Einheit: kg × m/s. Der Impulserhaltungssatz besagt: In einem abgeschlossenen System (keine äußeren Kräfte) bleibt der Gesamtimpuls konstant. Beim Stoß zweier Körper: Gesamtimpuls vorher = Gesamtimpuls nachher. Beim elastischen Stoß bleiben Impuls UND kinetische Energie erhalten (z.B. Billardkugeln). Beim unelastischen Stoß bleibt nur der Impuls erhalten, kinetische Energie wird in Wärme und Verformung umgewandelt (z.B. Autounfall). Raketen nutzen den Impulserhaltungssatz perfekt: Die Rakete stößt Gase nach hinten aus (Impuls nach hinten), die Rakete selbst bewegt sich dadurch nach vorne (gleicher Impuls in entgegengesetzter Richtung). Das funktioniert sogar im Vakuum! Das ist auch das dritte Newtonsche Gesetz: Actio = Reactio.' },
          { name:'Optik: Reflexion und Brechung', diff:2,
            explanation:'Glasfaserkabel übertragen Internetdaten mit Lichtgeschwindigkeit durch Totalreflexion – Licht prallt dabei tausende Male von den Wänden des Glasfasers ab! Das Reflexionsgesetz beschreibt den einfachen Spiegeleffekt: Einfallswinkel = Reflexionswinkel (beide gemessen zur Senkrechten der Fläche). Regelmäßige Reflexion (Spiegel) ergibt scharfe Bilder; diffuse Reflexion (raue Fläche) streut Licht in alle Richtungen. Lichtbrechung tritt auf, wenn Licht von einem Medium ins andere übergeht (z.B. Luft → Wasser) und dabei die Richtung ändert. Das Snelliusssche Brechungsgesetz beschreibt das genaue Verhältnis der Winkel. Totalreflexion tritt auf, wenn Licht aus einem dichteren Medium (z.B. Glas) flach genug auf die Grenzfläche trifft – dann tritt kein Licht aus und wird vollständig reflektiert. Dieser Kritische Winkel ist die Grundlage der Glasfasertechnik. Regenbögen entstehen durch Brechung und Reflexion in kugelförmigen Wassertropfen – rotes Licht wird am schwächsten gebrochen, violettes am stärksten, deshalb entsteht das Farbspektrum. Linsen in Kameras, Brillen und Mikroskopen nutzen kontrollierte Lichtbrechung!' },
          { name:'Magnetismus und Elektromagnetismus', diff:3,
            explanation:'Elektromotoren in Elektroautos, Generatoren in Windrädern, Transformatoren im Stromnetz, MRT-Geräte im Krankenhaus – alles basiert auf Elektromagnetismus! Magnetismus und Elektrizität sind zwei Seiten derselben Medaille. Ein Magnet erzeugt ein Magnetfeld. Fließt elektrischer Strom durch einen Leiter, entsteht um ihn herum ebenfalls ein Magnetfeld – das ist Elektromagnetismus. Eine Spule mit Strom (Elektromagnet) verhält sich wie ein Stabmagnet und kann durch Stromänderung gesteuert werden. Das Induktionsprinzip dreht es um: Ein sich änderndes Magnetfeld erzeugt in einem Leiter eine elektrische Spannung (induzierten Strom). Faraday entdeckte dieses Prinzip 1831 – und legte damit die Grundlage für unsere gesamte Stromerzeugung! Im Generator wird durch Rotation mechanische Energie in elektrische Energie umgewandelt. Im Motor dreht sich die Sache um: Elektrische Energie wird in mechanische Energie umgewandelt. Transformatoren nutzen Induktion, um Spannungen zu erhöhen (für Übertragung über weite Strecken) oder zu verringern (für Haushaltsgeräte). Elektromagnetismus ist die Grundlage moderner Zivilisation!' },
          { name:'Einführung Quantenphysik', diff:3,
            explanation:'Dein Handy-Chip, der Laser im Supermarktscanner, LED-Leuchten, MRT-Geräte und Solarzellen – alles basiert auf Quantenphysik! In der Quantenwelt gelten völlig andere Regeln als in unserem Alltag. Licht verhält sich sowohl wie eine Welle (Beugung, Interferenz) als auch wie ein Teilchen – ein Photon. Das nennt man Welle-Teilchen-Dualismus. Elektronen in einem Atom können nur bestimmte Energieniveaus einnehmen, keine dazwischen – das ist Quantisierung. Wenn ein Elektron von einem höheren auf ein niedrigeres Energieniveau fällt, sendet es ein Photon (Lichtteilchen) mit genau der entsprechenden Energie aus. So entstehen die charakteristischen Spektrallinien jedes Elements und das Licht von LEDs und Lasern. Das photoelektrische Effekt (entdeckt von Einstein, dafür Nobelpreis 1921): Licht, das auf Metall trifft, schlägt Elektronen heraus – Grundlage für Solarzellen. Heisenbergs Unschärfeprinzip besagt: Ort und Impuls eines Teilchens können nicht gleichzeitig beliebig genau gemessen werden. Die Quantenmechanik klingt seltsam, aber sie ist die am genauesten überprüfte Theorie der Physik!' },
        ],
        exercises:[
          { id:'e1', type:'Grundlagen', diff:1, title:'Physik-Grundlagen – Wiederholung',
            desc:'Wichtige Formeln und Konzepte aus Klasse 7–9.',
            questions:[
              { q:'Einheit der Kraft?', hint:'Newton …', options:['Joule','Watt','Newton','Ampere'], correct:2, explanation:'Kraft wird in Newton (N) gemessen.' },
              { q:'Einheit der Energie?', hint:'Arbeit = Energie', options:['Watt','Newton','Joule','Volt'], correct:2, explanation:'Energie wird in Joule (J) gemessen.' },
              { q:'Ohmsches Gesetz: U = ?', hint:'I und R', options:['U = I + R','U = I × R','U = R / I','U = I – R'], correct:1, explanation:'U = I × R (Spannung = Stromstärke × Widerstand).' },
              { q:'Schallgeschwindigkeit in Luft ca.?', hint:'Wie schnell kommt Donner?', options:['30 m/s','343 m/s','3.000 m/s','300.000 km/s'], correct:1, explanation:'Schall: ca. 343 m/s in Luft.' },
              { q:'Was ist Leistung?', hint:'Arbeit pro Zeit.', options:['Kraft × Weg','Arbeit / Zeit','Spannung × Stromstärke','Masse × Beschleunigung'], correct:1, explanation:'P = W / t, Einheit: Watt.' },
              { q:'Einheit der Frequenz?', hint:'Benannt nach einem deutschen Physiker.', options:['Newton','Joule','Hertz','Pascal'], correct:2, explanation:'Frequenz in Hertz (Hz) – benannt nach Heinrich Rudolf Hertz.' },
              { q:'Formel für mechanische Arbeit W?', hint:'W = Kraft mal Weg.', options:['W = m × a','W = F × s','W = P × t','W = U × I'], correct:1, explanation:'W = F × s (Kraft × zurückgelegter Weg), Einheit: Joule.' },
              { q:'Einheit des Drucks?', hint:'1 Pascal = 1 Newton pro Quadratmeter.', options:['Newton','Joule','Pascal','Watt'], correct:2, explanation:'Druck in Pascal (Pa): p = F / A.' },
            ]
          },
          { id:'e2', type:'Mechanik', diff:3, title:'Impuls und Impulserhaltung',
            desc:'Impuls berechnen und Erhaltungssatz.',
            questions:[
              { q:'Formel für Impuls p?', hint:'Masse × Geschwindigkeit', options:['p=m+v','p=m/v','p=m×v','p=v/m'], correct:2, explanation:'p = m × v.' },
              { q:'Einheit des Impulses?', hint:'kg × m/s', options:['N','J','kg·m/s','W'], correct:2, explanation:'kg·m/s.' },
              { q:'Impulserhaltungssatz?', hint:'Abgeschlossenes System …', options:['Impuls nimmt zu','Gesamtimpuls bleibt konstant','Impuls nimmt ab','Impuls = null'], correct:1, explanation:'Gesamtimpuls konstant.' },
              { q:'Ball: 2 kg, 3 m/s. Impuls?', hint:'p = m × v', options:['1,5 kg·m/s','5 kg·m/s','6 kg·m/s','9 kg·m/s'], correct:2, explanation:'p = 6 kg·m/s.' },
              { q:'Elastischer Stoß: Was bleibt erhalten?', hint:'Elastisch = nichts verloren.', options:['Nur Impuls','Nur Energie','Impuls UND Energie','Nichts'], correct:2, explanation:'Impuls und kinetische Energie.' },
              { q:'Unelastischer Stoß: Was bleibt erhalten?', hint:'Beim unelastischen Stoß verformt sich ein Körper.', options:['Nur kinetische Energie','Nur Impuls','Impuls UND kinetische Energie','Nichts'], correct:1, explanation:'Beim unelastischen Stoß bleibt nur der Impuls erhalten – kinetische Energie wird in Wärme/Verformung umgewandelt.' },
              { q:'Auto (1.000 kg, 20 m/s): Impuls?', hint:'p = m × v = 1.000 × 20.', options:['20 kg·m/s','200 kg·m/s','2.000 kg·m/s','20.000 kg·m/s'], correct:3, explanation:'p = 1.000 × 20 = 20.000 kg·m/s.' },
              { q:'Was ist ein Rückstoß?', hint:'Rakete: Gase raus → Rakete vor.', options:['Schlag nach vorn','Reaktionskraft in entgegengesetzter Richtung','Reibungskraft','Gravitation'], correct:1, explanation:'Rückstoß: nach Impulserhaltung – nach hinten abgefeuerte Masse treibt Rakete nach vorn (Actio = Reactio).' },
            ]
          },
          { id:'e3', type:'Optik', diff:2, title:'Reflexion und Brechung',
            desc:'Lichtverhalten an Grenzflächen.',
            questions:[
              { q:'Reflexionsgesetz?', hint:'α = ?', options:['Reflexionswinkel größer','Reflexionswinkel kleiner','Beide gleich','Verhältnis 2:1'], correct:2, explanation:'Einfallswinkel = Reflexionswinkel.' },
              { q:'Was ist Lichtbrechung?', hint:'Licht wechselt das Medium.', options:['Licht wird reflektiert','Licht ändert Richtung beim Medienübergang','Licht wird absorbiert','Licht hört auf'], correct:1, explanation:'Richtungsänderung beim Medienübergang.' },
              { q:'Warum erscheint ein Stab im Wasser gebrochen?', hint:'Licht bricht an der Wasseroberfläche.', options:['Stab biegt sich','Licht bricht an der Wasseroberfläche','Wasser verzerrt','Spiegelung'], correct:1, explanation:'Lichtbrechung Wasser→Luft.' },
              { q:'Was ist Totalreflexion?', hint:'Ab einem bestimmten Winkel …', options:['Licht absorbiert','Licht vollständig reflektiert ohne Mediumverlassen','Mehrfach gebrochen','Farbe ändert sich'], correct:1, explanation:'Grundlage der Glasfaserkabel.' },
              { q:'Wo wird Totalreflexion technisch genutzt?', hint:'Internet-Daten reisen damit.', options:['Spiegel','Glasfaserkabel','Linsen','Prisma'], correct:1, explanation:'Glasfaserkabel nutzen Totalreflexion – Licht bounced durch das Kabel ohne zu entkommen.' },
              { q:'Was ist diffuse Reflexion?', hint:'Gegenteil von direkter (gerichteter) Reflexion.', options:['Licht wird vollständig absorbiert','Licht wird in alle Richtungen gestreut','Licht bricht durch ein Medium','Licht ändert seine Farbe'], correct:1, explanation:'Raue Oberflächen streuen Licht in alle Richtungen – deshalb blenden sie nicht wie ein Spiegel.' },
              { q:'Warum ist der Himmel blau?', hint:'Kurzwelliges Licht wird stärker gestreut.', options:['Wasser im Himmel','Blaues Licht wird stärker gestreut als rotes','Sonnenenergie ist blau','Sauerstoff ist blau'], correct:1, explanation:'Blaues Licht hat kürzere Wellenlänge und wird von Luftmolekülen stärker gestreut (Rayleigh-Streuung).' },
              { q:'Wo tritt Lichtbrechung im Alltag auf?', hint:'Brillen, Lupen und Kameras nutzen das Prinzip.', options:['Nur im Labor','In Linsen, Brillen und Prismen','Nur im Wasser','Nur in Glasfaser'], correct:1, explanation:'Lichtbrechung wird in Linsen (Brillen, Kameras, Lupen) und Prismen genutzt, um Licht zu bündeln oder zu zerstreuen.' },
            ]
          },
        ]
      },
    ]
  },

  /* =========================================================  KLASSE 11  */
  klasse11: {
    id:'klasse11', num:11, label:'Klasse 11',
    emoji:'📈', color:['#4F46E5','#818CF8'], light:'#EEF2FF',
    tagline:'Einführungsphase: Analysis, Stochastik und Schwingungen',
    subjects:[
      {
        id:'mathe', name:'Mathematik', icon:'🔢',
        desc:'Kurvendiskussion, Integralrechnung und Stochastik',
        color:'#2563EB',
        intro:'Willkommen in Klasse 11 Mathematik! Die Oberstufe beginnt – wir vertiefen Analysis, führen das Integral ein und lernen statistische Tests. Diese Werkzeuge stecken in KI, Wirtschaft und Forschung!',
        topics:[
          { name:'Kurvendiskussion', diff:3,
            explanation:'Eine vollständige Kurvendiskussion ist das Schweizer Taschenmesser der Analysis! Sie beantwortet alle wichtigen Fragen über eine Funktion auf einmal. Gegeben ist z.B. f(x) = x³ – 3x² + 2. Schritt 1 – Definitionsbereich: Wo ist f definiert? Polynome sind überall definiert: D = ℝ. Schritt 2 – Nullstellen: f(x) = 0 lösen, z.B. durch Ausklammern oder numerisch. Schritt 3 – Ableitungen bilden: f\'(x), f\'\'(x). Schritt 4 – Extremstellen: f\'(x) = 0 setzen und Vorzeichen von f\'\'(x) prüfen. f\'\'(x) > 0 → Minimum, f\'\'(x) < 0 → Maximum. Schritt 5 – Wendepunkte: f\'\'(x) = 0 und Vorzeichenwechsel von f\'\'(x) prüfen. Schritt 6 – Verhalten im Unendlichen: Wie verhält sich f für x → ±∞? Bei Polynomen dominiert der höchste Term. Schritt 7 – Skizze zeichnen. Eine vollständige Kurvendiskussion verbindet alle analytischen Werkzeuge und liefert ein vollständiges Bild der Funktion. Ingenieure nutzen sie z.B. um Brückenbögen optimal zu gestalten!' },
          { name:'Integralrechnung – Einführung', diff:3,
            explanation:'Wie viel Fläche liegt unter einer Kurve? Das ist die zentrale Frage der Integralrechnung! Der bestimmte Grenzen ∫ₐᵇ f(x) dx gibt den orientierten Flächeninhalt zwischen dem Graphen und der x-Achse an. Der Hauptsatz der Differential- und Integralrechnung verknüpft beide: Eine Stammfunktion F von f erfüllt F\'(x) = f(x). Dann gilt: ∫ₐᵇ f(x) dx = F(b) – F(a). Stammfunktionen findest du durch "umgekehrtes Ableiten": Stammfunktion von xⁿ ist xⁿ⁺¹/(n+1). Beispiel: ∫ 3x² dx = x³ + C (C = Integrationskonstante). Wichtig: Liegt der Graph unter der x-Achse, ist der Integralwert negativ – für den echten Flächeninhalt nimmst du den Betrag! Anwendungen: Flächeninhalte, Volumen von Rotationskörpern, Weg aus Geschwindigkeit, Arbeit aus Kraft, Gewinne in der Wirtschaft. Das Integral ist das zweite fundamentale Werkzeug der Analysis neben der Ableitung – zusammen revolutionierten sie die Mathematik im 17. Jahrhundert (Newton & Leibniz)!' },
          { name:'Binomialverteilung', diff:3,
            explanation:'Du wirfst eine Münze 10-mal – wie wahrscheinlich ist genau 6-mal Kopf? Die Binomialverteilung beantwortet genau solche Fragen! Voraussetzungen: n gleichartige, unabhängige Versuche, jeder Versuch hat zwei mögliche Ergebnisse (Erfolg/Misserfolg) mit konstanter Erfolgswahrscheinlichkeit p. Formel: P(X = k) = C(n,k) × pᵏ × (1-p)ⁿ⁻ᵏ. Dabei ist C(n,k) = n!/(k!×(n-k)!) der Binomialkoeffizient – er zählt alle Möglichkeiten, genau k Erfolge in n Versuchen zu erzielen. Erwartungswert μ = n × p (im Durchschnitt so viele Erfolge). Standardabweichung σ = √(n × p × (1-p)). Beispiel: n=10, p=0,5 (Münze), k=6: P(X=6) = C(10,6) × 0,5⁶ × 0,5⁴ = 210 × 0,015625 ≈ 20,5%. Kumulierte Wahrscheinlichkeiten P(X ≤ k) erhältst du durch Addition. Anwendungen: Qualitätskontrolle, Medizinstudien, Meinungsumfragen, Genetik. Die Binomialverteilung ist überall dort, wo man Ja/Nein-Experimente wiederholt!' },
          { name:'Vektoren und lineare Abhängigkeit', diff:3,
            explanation:'Vektoren in der Oberstufe gehen weit über die Grundlagen hinaus! Linearkombination: Ein Vektor w⃗ ist eine Linearkombination von u⃗ und v⃗, wenn es Zahlen λ, μ gibt mit w⃗ = λu⃗ + μv⃗. Linear unabhängig heißen Vektoren, wenn keiner von den anderen als Linearkombination darstellbar ist – geometrisch: sie zeigen in grundlegend verschiedene Richtungen. Das Skalarprodukt: u⃗ · v⃗ = u₁v₁ + u₂v₂ + u₃v₃. Es ist null genau dann, wenn u⃗ ⊥ v⃗ (senkrecht zueinander). Der Winkel zwischen zwei Vektoren: cos(α) = (u⃗·v⃗)/(|u⃗|×|v⃗|). Das Kreuzprodukt (Vektorprodukt): u⃗ × v⃗ erzeugt einen neuen Vektor senkrecht zu beiden. Betrag = |u⃗||v⃗|sin(α) = Fläche des Parallelogramms. Gerade in Parameterform: g: x⃗ = p⃗ + t·r⃗ (Stützpunkt + t × Richtungsvektor). Geraden auf Parallelität, Schnittpunkt oder Windschieflage prüfen. Vektoren sind die Sprache der 3D-Computergrafik, Physik, Robotik und maschinellen Lernens!' },
        ],
        exercises:[
          { id:'e1', type:'Analysis', diff:3, title:'Kurvendiskussion',
            desc:'Extrempunkte, Wendepunkte und Nullstellen bestimmen.',
            questions:[
              { q:'f(x) = x³ – 3x. Was ist f\'(x)?', hint:'Potenzregel für jeden Term.', options:['3x² – 3','3x² – 3x','x² – 3','3x³ – 3'], correct:0, explanation:'f\'(x) = 3x² – 3.' },
              { q:'Extremstellen: f\'(x) = 3x² – 3 = 0. Lösung?', hint:'3x² = 3 → x² = 1', options:['x = 0','x = ±1','x = ±3','x = 3'], correct:1, explanation:'x² = 1 → x = ±1.' },
              { q:'f\'\'(x) = 6x. Bei x = 1: Hoch- oder Tiefpunkt?', hint:'f\'\'(1) = 6 > 0', options:['Hochpunkt','Tiefpunkt (Minimum)','Wendepunkt','Sattelunkt'], correct:1, explanation:'f\'\'(1) = 6 > 0 → Linkskrümmung → Tiefpunkt.' },
              { q:'Wendepunkt: f\'\'(x) = 6x = 0. Wo?', hint:'6x = 0 → x = ?', options:['x = 1','x = –1','x = 0','x = 6'], correct:2, explanation:'x = 0 ist Wendepunkt (Vorzeichenwechsel von f\'\').' },
              { q:'f(x) = x⁴ – 4x². Was ist f\'(x)?', hint:'Potenzregel: 4x³ – 8x', options:['4x³ – 4x','4x³ – 8x','4x – 8','x³ – 2x'], correct:1, explanation:'f\'(x) = 4x³ – 8x.' },
              { q:'Nullstellen: f(x) = x² – 4 = 0. Lösung?', hint:'x² = 4', options:['x = 2','x = –2','x = ±2','x = ±4'], correct:2, explanation:'x² = 4 → x = ±2.' },
              { q:'f(x) → ∞ für x → ∞ und f(x) → ∞ für x → –∞. Welche Funktion?', hint:'Gerade Hochzahl = beide Seiten gleich.', options:['f(x) = x³','f(x) = x⁴','f(x) = x','f(x) = –x²'], correct:1, explanation:'x⁴: gerade Potenz → beide Seiten nach oben.' },
              { q:'Wann hat eine Funktion ein lokales Maximum?', hint:'f\'(x₀) = 0 und f\'\'(x₀) < 0', options:['f\'(x₀) > 0','f\'(x₀) = 0 und f\'\'(x₀) > 0','f\'(x₀) = 0 und f\'\'(x₀) < 0','f\'\'(x₀) = 0'], correct:2, explanation:'f\'(x₀) = 0 und f\'\'(x₀) < 0 → Hochpunkt (Maximum).' },
            ]
          },
          { id:'e2', type:'Integral', diff:3, title:'Integralrechnung Grundlagen',
            desc:'Stammfunktionen und bestimmte Integrale.',
            questions:[
              { q:'Stammfunktion von f(x) = 2x?', hint:'Umgekehrte Potenzregel: xⁿ → xⁿ⁺¹/(n+1)', options:['x','x²','2x²','x² + C'], correct:3, explanation:'F(x) = x² + C.' },
              { q:'∫₀² x dx = ?', hint:'F(x) = x²/2. Dann F(2) – F(0).', options:['1','2','4','0'], correct:1, explanation:'F(x) = x²/2. F(2) – F(0) = 2 – 0 = 2.' },
              { q:'Stammfunktion von f(x) = 3x²?', hint:'Umkehrung von (x³)\' = 3x²', options:['6x','x³ + C','3x³','x² + C'], correct:1, explanation:'F(x) = x³ + C.' },
              { q:'∫₁³ 2 dx = ?', hint:'Stammfunktion von 2 ist 2x.', options:['2','4','6','8'], correct:1, explanation:'F(x) = 2x. F(3) – F(1) = 6 – 2 = 4.' },
              { q:'Was besagt der Hauptsatz der Infinitesimalrechnung?', hint:'Integral und Ableitung sind Umkehrungen.', options:['Integration = Ableiten','F\'(x) = f(x) → ∫f dx = F(b) – F(a)','Integral ist immer 0','Nur für lineare Funktionen'], correct:1, explanation:'Hauptsatz: ∫ₐᵇ f(x) dx = F(b) – F(a), wenn F\'= f.' },
              { q:'Stammfunktion von f(x) = x³?', hint:'xⁿ → xⁿ⁺¹/(n+1) = x⁴/4', options:['3x²','x⁴','x⁴/4 + C','4x³'], correct:2, explanation:'F(x) = x⁴/4 + C.' },
              { q:'∫₀¹ 3x² dx = ?', hint:'F(x) = x³. F(1) – F(0).', options:['0','1','3','9'], correct:1, explanation:'F(1) – F(0) = 1 – 0 = 1.' },
              { q:'Was ist die Integrationskonstante C?', hint:'Ableiten von Konstante = 0', options:['Immer 0','Beliebige reelle Konstante','Immer 1','Die Stammfunktion'], correct:1, explanation:'C ist beliebig, da Ableitung von Konstante 0 ergibt – sie verschwindet beim Differenzieren.' },
            ]
          },
          { id:'e3', type:'Stochastik', diff:3, title:'Binomialverteilung',
            desc:'Wahrscheinlichkeiten bei wiederholten Versuchen.',
            questions:[
              { q:'Voraussetzungen für Binomialverteilung?', hint:'Unabhängig + 2 Ergebnisse + konstantes p', options:['Nur 1 Versuch','n unabhängige Versuche, 2 Ergebnisse, konstantes p','Beliebige Verteilung','Nur mit Würfeln'], correct:1, explanation:'B(n; p): n unabhängige Versuche, Erfolg/Misserfolg, konstante Wahrscheinlichkeit p.' },
              { q:'Erwartungswert μ bei B(20; 0,4)?', hint:'μ = n × p', options:['4','8','12','20'], correct:1, explanation:'μ = 20 × 0,4 = 8.' },
              { q:'P(X = k) = C(n,k) × pᵏ × (1–p)ⁿ⁻ᵏ. Was ist C(4,2)?', hint:'4!/(2!×2!) = 24/4', options:['2','4','6','8'], correct:2, explanation:'C(4,2) = 6.' },
              { q:'Münze 4×: P(genau 2× Kopf)? p = 0,5', hint:'C(4,2) × 0,5² × 0,5² = 6 × 0,0625', options:['0,125','0,25','0,375','0,5'], correct:2, explanation:'6 × 0,5⁴ = 6/16 = 0,375.' },
              { q:'Standardabweichung σ bei B(25; 0,4)?', hint:'σ = √(n × p × (1–p))', options:['√4 = 2','√6 = 2,45','√10 = 3,16','√25 = 5'], correct:1, explanation:'σ = √(25 × 0,4 × 0,6) = √6 ≈ 2,45.' },
              { q:'Was ist P(X ≤ 2) bei B(5; 0,5)?', hint:'P(0) + P(1) + P(2) addieren.', options:['0,125','0,3125','0,5','0,6875'], correct:2, explanation:'P(X≤2) = P(0)+P(1)+P(2) = 1/32+5/32+10/32 = 16/32 = 0,5.' },
              { q:'Für welches k ist P(X = k) bei B(10; 0,5) am größten?', hint:'Binomialverteilung ist symmetrisch um μ.', options:['k = 0','k = 5','k = 10','k = 2'], correct:1, explanation:'Bei p = 0,5 ist die Verteilung symmetrisch mit Maximum bei μ = n × p = 5.' },
              { q:'Was bedeutet "kumulierte Wahrscheinlichkeit" P(X ≤ 3)?', hint:'Alle Wahrscheinlichkeiten bis k = 3 aufaddieren.', options:['Nur P(X = 3)','P(X = 0) + ... + P(X = 3)','P(X > 3)','P(X = 3) × 3'], correct:1, explanation:'P(X ≤ 3) = Summe von P(X = 0) bis P(X = 3).' },
            ]
          },
        ]
      },
      {
        id:'physik', name:'Physik', icon:'⚡',
        desc:'Bewegungen, Kräfte, Erhaltungsgrößen, Gravitation und Relativitätstheorie',
        color:'#0284C7',
        intro:'Willkommen in Physik Klasse 11! Wir starten mit Kinematik – also wie Bewegungen beschrieben werden – und arbeiten uns dann durch Kräfte, Energie, das Gravitationsfeld bis hin zur faszinierenden Relativitätstheorie von Einstein!',
        topics:[

          // ── KAPITEL 1: BEWEGUNGEN ──────────────────────────────────────
          { isChapter:true, name:'Kapitel 1 – Bewegungen' },
          { name:'1.1 – Was ist Bewegung?', diff:1,
            explanation:'Stell dir vor, du sitzt im Bus und schaust aus dem Fenster – die Bäume rasen vorbei, aber du sitzt ganz ruhig. Bewegst du dich? Jein! Es kommt immer darauf an, von wo aus man schaut – das nennt man Bezugssystem. Im Weg-Zeit-Diagramm kann man sehen, wo ein Körper zu welchem Zeitpunkt ist. Eine steile Linie bedeutet: schnell. Eine flache Linie bedeutet: langsam. Eine waagerechte Linie bedeutet: gar keine Bewegung.' },

          { name:'1.2 – Gleichförmige Bewegung', diff:1, exp:'gleichfoermig',
            explanation:'Stell dir eine Schnecke auf einem Lineal vor, die immer genau 2 cm pro Sekunde kriecht – nie schneller, nie langsamer. Das ist gleichförmige Bewegung! Die Formel dafür lautet: s = v × t (Weg = Geschwindigkeit mal Zeit). Im v-t-Diagramm sieht das aus wie eine ruhige gerade Linie – flach wie ein See an einem windstillen Tag. Kein Gas, keine Bremse – einfach konstant.' },

          { name:'1.3 – Beschleunigte Bewegung', diff:2,
            explanation:'Wer schon mal auf einem Skateboard losgefahren ist, kennt das Gefühl: am Anfang langsam, dann immer schneller. Das ist Beschleunigung! Die Beschleunigung a zeigt, wie stark sich die Geschwindigkeit pro Sekunde ändert – Einheit: m/s². Formeln: v(t) = v₀ + a × t und s(t) = v₀ × t + einhalb × a × t². Im v-t-Diagramm ist Beschleunigung eine schräge Linie – je steiler, desto heftiger die Beschleunigung.' },

          { name:'1.4 – Freier Fall', diff:2,
            explanation:'Lass gleichzeitig einen Tennisball und einen Stein aus derselben Höhe fallen – welcher trifft zuerst auf? Beide gleichzeitig! Das hat Galileo Galilei vor über 400 Jahren herausgefunden. Die Erde zieht alle Körper gleich stark nach unten – mit g ≈ 9,81 m/s² (wenn kein Luftwiderstand stört). Formeln: v(t) = g × t und s(t) = einhalb × g × t². Nach 1 Sekunde hat ein frei fallender Körper bereits fast 10 m/s erreicht.' },

          { name:'1.5 – Wurfbewegungen', diff:2,
            explanation:'Wenn du einen Basketball wirfst, passieren gleichzeitig zwei Dinge: Waagerecht fliegt er mit gleichmäßiger Geschwindigkeit (keine Kraft bremst ihn in dieser Richtung), und senkrecht zieht die Schwerkraft ihn nach unten. Diese beiden Bewegungen addieren sich zur bekannten Kurve. Der optimale Wurfwinkel für maximale Weite? Genau 45° – dann teilen sich waagerechte und senkrechte Kraft am besten auf.' },

          { name:'1.6 – Kreisbewegung', diff:3,
            explanation:'Stell dir eine Schleuder vor: Du drehst einen Stein an einem Faden im Kreis. Die Geschwindigkeit bleibt dem Betrag nach gleich – aber die Richtung ändert sich ständig. Und Richtungsänderung bedeutet: Beschleunigung! Diese Beschleunigung zeigt immer zur Kreismitte und heißt Zentripetalbeschleunigung: a_z = v²/r. Dazu kommt: Winkelgeschwindigkeit ω = 2π/T (wie viele Runden pro Sekunde) und Bahngeschwindigkeit v = ω × r (je größer der Radius, desto schneller läuft der Außenrand).' },

          // ── KAPITEL 2: URSACHE VON BEWEGUNGEN ─────────────────────────
          { isChapter:true, name:'Kapitel 2 – Ursache von Bewegungen' },
          { name:'2.1 – Was sind Kräfte?', diff:1,
            explanation:'Kräfte sind unsichtbare „Hände", die Dinge anstoßen, bremsen, verbiegen oder festhalten. Du kannst sie nicht sehen, aber du spürst sie ständig: die Schwerkraft zieht dich auf deinen Stuhl, der Stuhl drückt dich zurück, Reibung hält dein Heft am Tisch. Kräfte haben eine Stärke (gemessen in Newton, N) und eine Richtung – deshalb zeichnet man sie als Pfeile. Mehrere Kräfte kann man wie Vektoren addieren – heraus kommt die Gesamtkraft.' },

          { name:'2.2 – Newtons 1. Gesetz: Trägheit', diff:1,
            explanation:'Stell dir deinen Kaffeebecher auf dem Tisch vor – du bremst plötzlich im Auto, und der Becher rutscht nach vorne. Warum? Weil der Becher „nicht mitbekommt", dass das Auto bremst – er will einfach so weitermachen wie vorher. Das nennt man Trägheit. Newtons 1. Gesetz: Kein Körper ändert seinen Bewegungszustand von alleine – dazu braucht er immer eine Kraft. Je größer die Masse, desto störrischer und trägheit ist der Körper.' },

          { name:'2.3 – Newtons 2. Gesetz: F = m × a', diff:2,
            explanation:'Stell dir vor, du schiebst einen leeren Einkaufswagen – easy. Jetzt ist der Wagen voller Getränkekisten – viel schwerer! Gleiche Kraft, aber viel weniger Beschleunigung. Das steckt in Newtons 2. Gesetz: F = m × a. Umgeformt: a = F/m. Eine größere Kraft beschleunigt mehr, eine größere Masse beschleunigt weniger. Einheit der Kraft: 1 Newton = 1 kg × m/s² – also genau die Kraft, die 1 kg mit 1 m/s² beschleunigt.' },

          { name:'2.4 – Newtons 3. Gesetz: Actio = Reactio', diff:2,
            explanation:'Blas einen Luftballon auf und lass ihn los – er schießt durchs Zimmer! Die Luft wird nach hinten gedrückt, der Ballon fliegt nach vorne. Genau so funktionieren Raketen! Newtons 3. Gesetz: Jede Kraft hat eine gleich große Gegenkraft in die entgegengesetzte Richtung. Wenn du jemanden wegdrückst, wirst du selbst zurückgedrückt. Actio und Reactio wirken immer auf zwei verschiedene Körper – daher heben sie sich nicht auf.' },

          { name:'2.5 – Reibungskräfte', diff:2,
            explanation:'Warum rutschst du auf Eis fast aus, aber auf einem Teppich nicht? Der Unterschied liegt im Reibungskoeffizienten μ – Eis hat ein winzig kleines μ, Teppich ein großes. Gleitreibung hält Körper in Bewegung zurück: F_R = μ × F_N (F_N ist die Kraft, die die Fläche senkrecht drückt). Haftreibung ist noch etwas größer und hält einen ruhenden Körper an Ort – deshalb ist Anfahren auf Eis schwieriger als Fahren auf Eis.' },

          { name:'2.6 – Zentripetalkraft', diff:3,
            explanation:'Probier mal, einen Eimer mit Wasser über dem Kopf zu schwingen – das Wasser fällt nicht heraus, solange du schnell genug bist! Damit ein Körper auf einer Kreisbahn bleibt, muss ihn ständig eine Kraft zur Mitte ziehen – die Zentripetalkraft: F_z = m × v²/r. Lässt du den Eimer-Faden los, fliegt er sofort geradeaus weg (Trägheit!). Bei Planeten übernimmt die Schwerkraft diese Rolle – sie hält den Mond auf seiner Bahn.' },

          { name:'2.7 – Rotation und Trägheitsmoment', diff:3,
            explanation:'Ein Eiskunstläufer dreht sich langsam mit ausgestreckten Armen – zieht er sie ein, dreht er sich plötzlich viel schneller. Kein Trick, reine Physik! Das Trägheitsmoment J beschreibt, wie schwer es ist, eine Drehbewegung zu ändern. Je weiter die Masse vom Drehpunkt weg ist, desto größer J. Wenn J kleiner wird (Arme rein), muss die Drehgeschwindigkeit ω größer werden – denn der Drehimpuls L = J × ω bleibt immer gleich.' },

          // ── KAPITEL 3: ERHALTUNGSGRÖSSEN ──────────────────────────────
          { isChapter:true, name:'Kapitel 3 – Erhaltungsgrößen' },
          { name:'3.1 – Was ist Energie?', diff:1,
            explanation:'Energie ist so etwas wie die „Währung" der Physik – alles, was passiert, kostet Energie. Du kannst sie in verschiedene „Münzen" umtauschen: Bewegungsenergie E_kin = einhalb × m × v², Lageenergie E_pot = m × g × h, Wärme, Licht, elektrische Energie … Aber egal in welcher Form: Die Gesamtsumme bleibt immer gleich. Einheit: 1 Joule (J). 1 J ist ungefähr die Energie, die du brauchst, um einen Apfel einen Meter hochzuheben.' },

          { name:'3.2 – Energieerhaltungssatz', diff:2,
            explanation:'Stell dir vor, du hast einen 10-Euro-Schein. Du wechselst ihn in Münzen – du hast immer noch 10 Euro, nur in einer anderen Form. Genau so funktioniert Energie: Sie wechselt die Form, verschwindet aber nie! Ein Roller fährt einen Hügel herunter – E_pot wird zu E_kin. Unten geht etwas davon durch Reibung in Wärme über. Die Summe bleibt immer gleich. Das ist einer der wichtigsten Sätze der gesamten Physik.' },

          { name:'3.3 – Leistung und Wirkungsgrad', diff:2,
            explanation:'Zwei Schüler schleppen dieselbe Kiste vier Stockwerke hoch – einer in 20 Sekunden, der andere in 2 Minuten. Beide haben die gleiche Arbeit verrichtet, aber der schnelle hatte viel mehr Leistung! Leistung P = Arbeit/Zeit (Einheit: Watt). Wirkungsgrad η = Nutzleistung/zugeführte Leistung – er zeigt, wie viel Energie wirklich ankommt. Ein Glühbirne hat η ≈ 5% (95% Wärme!), eine LED ≈ 40%.' },

          { name:'3.4 – Was ist Impuls?', diff:2,
            explanation:'Warum ist es gefährlicher, von einem langsamen LKW als von einer schnellen Feder angestupst zu werden? Weil der LKW viel mehr Impuls hat! Impuls p = m × v – er hängt von Masse und Geschwindigkeit ab und hat eine Richtung. Eine Kraft ändert den Impuls eines Körpers: F = Δp/Δt. Einheit: kg × m/s. Der Impuls ist wie der „Wumms" hinter einer Bewegung.' },

          { name:'3.5 – Impulserhaltung bei Stößen', diff:3,
            explanation:'Beim Billard stößt eine Kugel gegen eine andere – plötzlich bleibt die erste fast stehen und die zweite rollt weg. Wie ist das möglich? Der Gesamtimpuls vor und nach dem Stoß bleibt gleich! Elastischer Stoß (Billardkugeln): Energie und Impuls bleiben erhalten. Unelastischer Stoß (zwei Knetklumpen prallen zusammen): Nur Impuls bleibt erhalten, Energie geht als Wärme verloren. Beim Autounfall, bei dem Autos ineinander haken, ist das ein vollkommen unelastischer Stoß.' },

          { name:'3.6 – Drehimpuls', diff:3,
            explanation:'Hast du schon mal gesehen, wie sich ein Kreisel stundenlang dreht, ohne umzufallen? Das liegt am Drehimpuls L = J × ω – solange nichts von außen stört, bleibt er erhalten. Genau das passiert beim Eiskunstläufer: Zieht er die Arme rein, wird J kleiner, und ω (Drehgeschwindigkeit) muss zunehmen. Planeten drehen sich übrigens ebenfalls schneller, wenn sie der Sonne näherkommen – aus demselben Grund.' },

          // ── KAPITEL 4: GRAVITATIONSFELD ───────────────────────────────
          { isChapter:true, name:'Kapitel 4 – Gravitationsfeld' },
          { name:'4.1 – Weltmodelle: Erde oder Sonne im Mittelpunkt?', diff:1,
            explanation:'Jahrtausende lang dachten die Menschen, die Erde sei der Nabel des Universums – alles dreht sich um uns! Das klingt logisch, wenn man nachts in den Himmel schaut und die Sterne „wandern" sieht. 1543 kam Kopernikus mit einer unbequemen Wahrheit: Die Sonne steht im Mittelpunkt, und wir drehen uns um sie. Galileo bestätigte das mit dem Teleskop – und wurde dafür fast vor Gericht gestellt. Heute wissen wir: Nicht mal die Sonne ist besonders – sie ist ein ganz gewöhnlicher Stern unter Hunderten Milliarden in unserer Galaxie.' },

          { name:'4.2 – Die 3 Keplerschen Gesetze', diff:2,
            explanation:'Johannes Kepler war so etwas wie ein Detektiv der Astronomie. Er hatte Berge von Messdaten, aber keine Erklärung dafür. Nach Jahren des Rechnens entdeckte er drei Muster: Erstens, Planetenbahnen sind keine Kreise sondern Ellipsen, mit der Sonne in einem Brennpunkt. Zweitens, Planeten fliegen in Sonnennähe schneller (der Leitstrahl überstreicht immer gleich große Flächen). Drittens, weit entfernte Planeten brauchen überproportional länger – T² geteilt durch a³ ist für alle Planeten gleich.' },

          { name:'4.3 – Newtons Gravitationsgesetz', diff:3,
            explanation:'Die Geschichte vom Apfel, der Newton auf den Kopf fiel, ist vermutlich übertrieben – aber die Frage, die er sich stellte, ist real: Warum fällt der Apfel genau senkrecht nach unten? Und warum fällt der Mond nicht auch einfach auf die Erde? Newton erkannte: Der Mond fällt die ganze Zeit – er fällt nur schnell genug seitwärts davon, dass er immer um die Erde herumfällt. Die Gravitationskraft: F_G = G × m₁ × m₂ / r² – mit G = 6,674 × 10⁻¹¹ Nm²/kg². Doppelter Abstand bedeutet ein Viertel der Kraft.' },

          { name:'4.4 – Das Gravitationsfeld', diff:2,
            explanation:'Stell dir die Erde als riesigen unsichtbaren Magneten für Masse vor. Überall um sie herum gibt es eine Zugkraft – das Gravitationsfeld. Je näher du der Erde bist, desto stärker der Zug: g = G × M / r². An der Erdoberfläche gilt g ≈ 9,81 m/s². Auf dem Mond ist g nur einhalb davon – deshalb hüpfen Astronauten dort so leicht. Ein Satellit im Orbit: Die Gravitationskraft übernimmt exakt die Rolle der Zentripetalkraft – sie hält ihn auf der Kreisbahn.' },

          // ── KAPITEL 5: RELATIVITÄTSTHEORIE ────────────────────────────
          { isChapter:true, name:'Kapitel 5 – Relativitätstheorie' },
          { name:'5.1 – Was ist ein Bezugssystem?', diff:1,
            explanation:'Schau aus dem Fenster eines fahrenden Zuges – die Landschaft rauscht vorbei, du sitzt still. Jetzt schau auf den Mitreisenden neben dir – er sitzt auch still. Für den Menschen auf dem Bahnsteig rasen aber beide mit 200 km/h vorbei. Wer hat Recht? Alle! Bewegung gibt es nur relativ zu einem Bezugspunkt. Ein Inertialsystem ist ein Bezugssystem, das selbst nicht beschleunigt wird – in so einem System gelten Newtons Gesetze ohne Ausnahme.' },

          { name:'5.2 – Einsteins 2 Postulate', diff:2,
            explanation:'Einstein fragte sich als Teenager: Was würde ich sehen, wenn ich neben einem Lichtstrahl herfliege? Er kam zu dem Schluss: Das geht gar nicht! Licht rast immer mit c ≈ 3 × 10⁸ m/s von dir weg – egal ob du stillstehst oder selbst mit 99% der Lichtgeschwindigkeit fliegst. Das ist Einsteins 2. Postulat. Sein 1. Postulat: Die Naturgesetze sehen für jeden, der sich gleichförmig bewegt, gleich aus. Kein Mensch ist „absolut in Ruhe".' },

          { name:'5.3 – Gleichzeitigkeit ist relativ', diff:3,
            explanation:'Wenn dein Freund auf dem Bahnsteig steht und zwei Blitze gleichzeitig an beiden Enden des Zuges einschlagen, sieht er beide wirklich gleichzeitig. Du sitzt in der Zugmitte und fährst auf einen der Blitze zu – das Licht dieses Blitzes erreicht dich früher! Du siehst die Blitze nacheinander. Beide Beobachtungen sind richtig – denn Gleichzeitigkeit hängt davon ab, wo und wie man sich bewegt. Das war für viele Physiker anfangs unvorstellbar.' },

          { name:'5.4 – Zeitdilatation: Uhren gehen langsamer', diff:3,
            explanation:'Stell dir zwei identische Uhren vor – du nimmst eine mit auf eine superschnelle Raumreise, die andere lässt du auf der Erde. Als du zurückkommst, geht deine Reiseuhr nach! Schnell bewegte Uhren gehen langsamer. Formel: Δt = Δt₀ / √(1 − v²/c²). Das ist keine Einbildung – Wissenschaftler haben das mit echten Atomuhren in Flugzeugen gemessen. Beim Zwillingsparadoxon reist ein Zwilling mit 90% der Lichtgeschwindigkeit los und kommt jünger zurück als sein Geschwister auf der Erde.' },

          { name:'5.5 – Längenkontraktion: Objekte werden kürzer', diff:3,
            explanation:'Ein Raumschiff, das an dir vorbeischießt, sieht für dich in Fahrtrichtung kürzer aus als wenn es stehen würde. Formel: L = L₀ × √(1 − v²/c²). Im Raumschiff selbst merkt die Besatzung nichts davon – für sie ist es ihr Außen, das sich zusammenstaucht. Beide Sichtweisen sind physikalisch gleichwertig. Im Alltag sind diese Effekte unmessbar klein – nur nahe der Lichtgeschwindigkeit werden sie spürbar. Deswegen korrigieren GPS-Satelliten ständig ihre Zeitangaben – sonst würde die Positionsangabe täglich um Kilometer abdriften.' },

        ],
        exercises:[
          { id:'e1', type:'Bewegungen', diff:3, title:'Kinematik – Geradlinige Bewegung',
            desc:'Gleichförmige und beschleunigte Bewegungen berechnen.',
            questions:[
              { q:'Ein Auto fährt gleichförmig mit v = 20 m/s. Welchen Weg legt es in 5 s zurück?', hint:'s = v × t', options:['4 m','25 m','100 m','400 m'], correct:2, explanation:'s = 20 × 5 = 100 m.' },
              { q:'Was zeigt die Steigung im v-t-Diagramm an?', hint:'Änderung der Geschwindigkeit pro Zeit', options:['Den zurückgelegten Weg','Die Beschleunigung a','Die Kraft','Die Energie'], correct:1, explanation:'Steigung im v-t-Diagramm = Beschleunigung a = Δv/Δt.' },
              { q:'Freier Fall: Welche Aussage stimmt (ohne Luftwiderstand)?', hint:'Galileo Galileis Experiment am Schiefen Turm von Pisa', options:['Schwerere Körper fallen schneller','Alle Körper fallen gleich schnell','Leichtere Körper fallen schneller','Die Fallgeschwindigkeit ist konstant'], correct:1, explanation:'Ohne Luftwiderstand fallen alle Körper mit a = g ≈ 9,81 m/s², unabhängig von ihrer Masse.' },
              { q:'Bei welchem Wurfwinkel ist die Wurfweite bei schrägem Wurf maximal?', hint:'Formel: w = v₀² × sin(2α) / g', options:['30°','45°','60°','90°'], correct:1, explanation:'Maximale Weite bei 45°, weil sin(90°) = 1 den größten Wert ergibt.' },
              { q:'Beim schiefen Wurf: Was gilt für die horizontale Bewegungskomponente?', hint:'In waagerechter Richtung wirkt keine Kraft.', options:['Sie wird durch g beschleunigt','Sie bleibt gleichförmig (konstante v_x)','Sie wird durch Reibung gebremst','Sie ist null'], correct:1, explanation:'Horizontal wirkt keine Kraft → v_x = const → gleichförmige Bewegung.' },
              { q:'Zentripetalbeschleunigung: a_z = ?', hint:'Zeigt zum Kreismittelpunkt', options:['a_z = v × r','a_z = v²/r','a_z = ω/r','a_z = r/T'], correct:1, explanation:'a_z = v²/r = ω² × r – trotz konstantem |v| gibt es Beschleunigung durch Richtungsänderung.' },
              { q:'Ein Körper startet aus der Ruhe mit a = 4 m/s². Welche Geschwindigkeit hat er nach 3 s?', hint:'v = v₀ + a × t', options:['1,3 m/s','7 m/s','12 m/s','36 m/s'], correct:2, explanation:'v = 0 + 4 × 3 = 12 m/s.' },
              { q:'Was ist der Unterschied zwischen Geschwindigkeit und Beschleunigung?', hint:'Eine ist die Änderungsrate der anderen.', options:['Es gibt keinen Unterschied','Geschwindigkeit ist Δs/Δt, Beschleunigung ist Δv/Δt','Beschleunigung ist Δs/Δt, Geschwindigkeit ist Δv/Δt','Beides ist dasselbe wie Kraft'], correct:1, explanation:'Geschwindigkeit = Weg pro Zeit (m/s), Beschleunigung = Geschwindigkeitsänderung pro Zeit (m/s²).' },
            ]
          },
          { id:'e2', type:'Kräfte', diff:3, title:'Ursache von Bewegungen – Newtonsche Gesetze',
            desc:'Kräfte, Trägheit und Newtons Gesetze anwenden.',
            questions:[
              { q:'Newtons 2. Gesetz: Ein Körper (m = 5 kg) wird mit F = 20 N beschleunigt. Wie groß ist a?', hint:'F = m × a', options:['0,25 m/s²','4 m/s²','25 m/s²','100 m/s²'], correct:1, explanation:'a = F/m = 20/5 = 4 m/s².' },
              { q:'Was besagt Newtons 1. Gesetz (Trägheitsprinzip)?', hint:'Ohne Kraft – keine Änderung der Bewegung.', options:['F = m × a','Actio = Reactio','Körper halten ihren Bewegungszustand ohne äußere Kraft aufrecht','Alle Körper fallen gleich schnell'], correct:2, explanation:'Trägheitsprinzip: Kein Nettokraft → keine Bewegungsänderung (Ruhe oder gleichförmige Bewegung).' },
              { q:'Ein Astronaut drückt gegen eine Wand mit F = 50 N. Mit welcher Kraft drückt die Wand zurück?', hint:'Actio = Reactio (Newtons 3. Gesetz)', options:['0 N','25 N','50 N','100 N'], correct:2, explanation:'Actio = Reactio: Die Wand drückt genau so stark zurück – 50 N.' },
              { q:'Zentripetalkraft auf eine Masse m = 2 kg bei v = 6 m/s und r = 3 m?', hint:'F_z = m × v²/r', options:['4 N','12 N','24 N','36 N'], correct:2, explanation:'F_z = 2 × 36/3 = 24 N.' },
              { q:'Was ist Gleitreibungskraft (F_R = μ × F_N)?', hint:'μ = Reibungskoeffizient, F_N = Normalkraft', options:['Kraft in Bewegungsrichtung','Kraft senkrecht zur Fläche','Kraft entgegen der Bewegungsrichtung','Gravitationskraft'], correct:2, explanation:'Gleitreibung wirkt entgegen der Bewegungsrichtung: F_R = μ × F_N.' },
              { q:'Warum dreht sich ein Eiskunstläufer schneller, wenn er die Arme anzieht?', hint:'Drehimpuls L = J × ω bleibt erhalten.', options:['Er hat mehr Kraft','Das Trägheitsmoment J verringert sich, also steigt ω','Der Luftwiderstand nimmt ab','Die Energie nimmt zu'], correct:1, explanation:'L = J × ω = const. Kleines J → großes ω → schnellere Rotation.' },
              { q:'Auf der Mondoberfläche (g_Mond = 1,6 m/s²): Gewichtskraft eines 60-kg-Menschen?', hint:'F_G = m × g', options:['37,5 N','60 N','96 N','588 N'], correct:2, explanation:'F_G = 60 × 1,6 = 96 N (auf der Erde wären es 588 N).' },
              { q:'Was ist der Unterschied zwischen Masse und Gewichtskraft?', hint:'Masse ist eine Eigenschaft, Gewichtskraft eine Kraft.', options:['Kein Unterschied, beides ist dasselbe','Masse (kg) ist konstant, Gewichtskraft (N) hängt von g ab','Gewichtskraft (kg) ist konstant, Masse (N) hängt von g ab','Masse wird in Newton gemessen'], correct:1, explanation:'Masse m (in kg) ist eine unveränderliche Eigenschaft. Gewichtskraft F_G = m × g (in N) hängt von der Gravitation ab.' },
            ]
          },
          { id:'e3', type:'Erhaltungsgrößen', diff:3, title:'Energie, Impuls und Drehimpuls',
            desc:'Energieerhaltung und Impulserhaltung anwenden.',
            questions:[
              { q:'Ein Ball (m = 0,5 kg) fällt aus h = 5 m. Welche kinetische Energie hat er kurz vor dem Aufprall?', hint:'E_pot = m × g × h → E_kin (Energieerhaltung)', options:['2,5 J','12,5 J','24,5 J','49 J'], correct:2, explanation:'E_kin = E_pot = 0,5 × 9,8 × 5 = 24,5 J.' },
              { q:'Was besagt der Energieerhaltungssatz?', hint:'Energie kann weder erzeugt noch vernichtet werden.', options:['Energie nimmt immer zu','Energie kann in jedem System erzeugt werden','Die Gesamtenergie eines abgeschlossenen Systems bleibt konstant','Kinetische Energie bleibt immer erhalten'], correct:2, explanation:'Energieerhaltung: E_gesamt = const. Energie wird nur umgewandelt, nie erzeugt oder vernichtet.' },
              { q:'Zwei Kugeln stoßen zusammen und bleiben aneinander haften (unelastischer Stoß). Was bleibt erhalten?', hint:'Nicht die kinetische Energie – sondern …?', options:['Kinetische Energie','Impuls','Beide','Keine der beiden'], correct:1, explanation:'Beim unelastischen Stoß bleibt der Gesamtimpuls erhalten, kinetische Energie geht als Wärme verloren.' },
              { q:'Impuls p = m × v. Einheit?', hint:'kg × m/s', options:['N','J','kg × m/s','W'], correct:2, explanation:'Einheit des Impulses: 1 kg × m/s = 1 N × s.' },
              { q:'Leistung P = W/t. Ein Motor verrichtet 6000 J in 10 s. Wie groß ist P?', hint:'P = W/t', options:['60 W','600 W','6000 W','60000 W'], correct:1, explanation:'P = 6000/10 = 600 W.' },
              { q:'E_kin = einhalb × m × v². Um welchen Faktor ändert sich E_kin, wenn v verdoppelt wird?', hint:'Quadratische Abhängigkeit!', options:['Faktor 2','Faktor 4','Faktor 8','Faktor 16'], correct:1, explanation:'E_kin ∝ v² → bei 2v gilt: E_kin ∝ 4v² → Faktor 4.' },
              { q:'Was ist Wirkungsgrad η?', hint:'Nutzenergie / zugeführte Energie', options:['η = P_nutz × P_gesamt','η = P_nutz / P_gesamt','η = P_gesamt − P_nutz','η = P_nutz + P_gesamt'], correct:1, explanation:'η = P_nutz / P_gesamt, immer ≤ 1 (100%). Reibung und Wärmeverluste machen η kleiner als 1.' },
              { q:'Drehimpulserhaltung: Ein Planet ist näher an der Sonne. Wie ändert sich seine Bahngeschwindigkeit?', hint:'2. Keplersches Gesetz – Flächensatz', options:['Sie nimmt ab','Sie bleibt gleich','Sie nimmt zu','Sie wird null'], correct:2, explanation:'Drehimpuls L = r × m × v = const. Kleines r → großes v. Planeten sind in Sonnennähe am schnellsten.' },
            ]
          },
          { id:'e4', type:'Gravitation', diff:3, title:'Gravitationsfeld',
            desc:'Newtonsches Gravitationsgesetz und Keplersche Gesetze.',
            questions:[
              { q:'Newtonsches Gravitationsgesetz: F_G = G × m₁ × m₂ / r². Wie ändert sich F_G, wenn der Abstand r verdoppelt wird?', hint:'Quadratisches Abstandsgesetz!', options:['Halbiert sich','Viertelt sich','Verdoppelt sich','Vervierfacht sich'], correct:1, explanation:'F_G ∝ 1/r². Bei 2r: F_G ∝ 1/(4r²) → ein Viertel der ursprünglichen Kraft.' },
              { q:'3. Keplersches Gesetz: T² ∝ a³. Was bedeutet das?', hint:'T = Umlaufzeit, a = große Halbachse', options:['Alle Planeten haben gleiche Umlaufzeit','Je weiter der Planet von der Sonne, desto länger die Umlaufzeit','Umlaufzeit ist proportional zum Radius','Je schwerer der Planet, desto langsamer'], correct:1, explanation:'T² / a³ = const. Fernere Planeten haben viel längere Umlaufzeiten – Saturn braucht ~29 Erdenjahre!' },
              { q:'Welches Weltmodell stellte als erstes die Sonne in den Mittelpunkt?', hint:'Erschienen 1543 im Buch "De revolutionibus"', options:['Ptolemäus (geocentrisch)','Kopernikus (heliocentrisch)','Kepler (elliptisch)','Tycho Brahe (hybrid)'], correct:1, explanation:'Nikolaus Kopernikus (1543) – das heliozentrische Modell ersetzte das ptolemäische Epizykelmodell.' },
              { q:'Was besagt das 1. Keplersche Gesetz?', hint:'Form der Planetenbahn', options:['Planeten bewegen sich auf Kreisbahnen','Planeten bewegen sich auf Ellipsen mit der Sonne im Brennpunkt','Planeten bewegen sich mit konstanter Geschwindigkeit','Alle Planeten haben gleiche Abstände'], correct:1, explanation:'1. Kepler: Planetenbahnen sind Ellipsen – die Sonne steht in einem der Brennpunkte.' },
              { q:'Gravitationsfeldstärke g an der Erdoberfläche: g ≈ ?', hint:'Beschleunigung im freien Fall', options:['1 m/s²','9,81 m/s²','50 m/s²','300 m/s²'], correct:1, explanation:'g ≈ 9,81 m/s² an der Erdoberfläche = Gravitationsfeldstärke = Fallbeschleunigung.' },
              { q:'Ein Satellit fliegt auf einer Kreisbahn. Welche Bedingung muss gelten?', hint:'Gravitation liefert Zentripetalkraft.', options:['F_G > F_z','F_G < F_z','F_G = F_z','F_G = 0'], correct:2, explanation:'F_G = F_z: Die Gravitationskraft liefert genau die nötige Zentripetalkraft für die Kreisbahn.' },
              { q:'Was besagt das 2. Keplersche Gesetz (Flächensatz)?', hint:'In gleichen Zeiten gleiche Flächen', options:['Alle Planeten bewegen sich gleich schnell','Ein Leitstrahl überstreicht in gleichen Zeiten gleiche Flächen','Planeten nahe der Sonne bewegen sich langsamer','Die Bahn ist eine Ellipse'], correct:1, explanation:'Flächensatz: Leitstrahl Planet–Sonne überstreicht in gleichen Zeiten gleiche Flächen → Geschwindigkeit ist in Sonnennähe größer.' },
              { q:'Geostationärer Satellit: Umlaufzeit T = ?', hint:'Er erscheint von der Erde aus ruhend.', options:['12 h','24 h','1 Woche','1 Monat'], correct:1, explanation:'T = 24 h – synchron mit der Erdrotation, daher scheinbar fest über einem Punkt.' },
            ]
          },
          { id:'e5', type:'Relativitätstheorie', diff:4, title:'Spezielle Relativitätstheorie',
            desc:'Einsteins Postulate, Zeitdilatation und Längenkontraktion.',
            questions:[
              { q:'Wie groß ist die Lichtgeschwindigkeit c (im Vakuum)?', hint:'Konstant in allen Inertialsystemen', options:['3 × 10⁶ m/s','3 × 10⁸ m/s','3 × 10¹⁰ m/s','∞'], correct:1, explanation:'c ≈ 3 × 10⁸ m/s = 300.000 km/s. Diese Konstanz ist Grundlage der Relativitätstheorie.' },
              { q:'Was besagt Einsteins 2. Postulat?', hint:'Licht verhält sich anders als andere Wellen.', options:['Alle Bezugssysteme sind gleichwertig','Die Lichtgeschwindigkeit c ist in allen Inertialsystemen gleich groß','Masse und Energie sind äquivalent','Zeit ist absolut'], correct:1, explanation:'c = const in allen Inertialsystemen – egal ob sich Quelle oder Beobachter bewegen!' },
              { q:'Was ist Zeitdilatation?', hint:'Bewegte Uhren …', options:['Bewegte Uhren gehen schneller','Bewegte Uhren gehen langsamer','Alle Uhren gehen gleich','Zeit gibt es nicht in der Relativitätstheorie'], correct:1, explanation:'Zeitdilatation: Δt = Δt₀ / √(1 − v²/c²). Je schneller ein System, desto langsamer vergeht die Zeit darin.' },
              { q:'Was ist Längenkontraktion?', hint:'Bewegte Objekte in Bewegungsrichtung …', options:['Bewegte Objekte werden länger','Bewegte Objekte werden kürzer','Die Länge bleibt immer gleich','Nur Breite und Höhe ändern sich'], correct:1, explanation:'L = L₀ × √(1 − v²/c²). In Bewegungsrichtung ist ein bewegtes Objekt kürzer als im Ruhesystem.' },
              { q:'Was ist ein Inertialsystem?', hint:'Newtons 1. Gesetz gilt darin.', options:['Ein System das beschleunigt','Ein kräftefreies Bezugssystem ohne Beschleunigung (Trägheitsprinzip gilt)','Ein System auf der Erde','Ein rotierendes System'], correct:1, explanation:'Inertialsystem: kein beschleunigtes Bezugssystem. Das Trägheitsprinzip gilt. Alle Inertialsysteme sind gleichwertig.' },
              { q:'Das Zwillingsparadoxon: Ein Zwilling fliegt mit 0,9c zu einem Stern und zurück. Was gilt nach der Rückkehr?', hint:'Zeitdilatation wirkt auf den bewegten Zwilling.', options:['Beide Zwillinge sind gleich alt','Der Flugzwilling ist jünger','Der Erdlingstwilling ist jünger','Beide sind jünger'], correct:1, explanation:'Zeitdilatation: Der bewegte Flugzwilling erlebt weniger Zeit → er ist nach der Rückkehr jünger als der Erdlingstwilling.' },
              { q:'Warum brauchen GPS-Satelliten relativistische Korrekturen?', hint:'Zeitdilatation + Gravitation ändern die Uhrengeschwindigkeit.', options:['Satelliten sind zu weit weg','Zeitdilatation und Gravitation ändern den Uhrengang – ohne Korrektur wäre die Position nach 1 Tag um km falsch','Satelliten bewegen sich rückwärts','Licht braucht zu lange'], correct:1, explanation:'Satelliten-Uhren gehen durch Zeitdilatation (Bewegung) langsamer und durch schwächere Gravitation schneller. Beide Effekte müssen korrigiert werden!' },
              { q:'Bei welcher Geschwindigkeit werden relativistische Effekte spürbar?', hint:'Vergleich mit der Lichtgeschwindigkeit c', options:['Ab 1 km/h','Ab 1000 km/h','Erst bei einem erheblichen Bruchteil von c (Prozente von c)','Ab Schallgeschwindigkeit'], correct:2, explanation:'Relativistische Effekte werden erst bei v > 10% von c (30.000 km/s) spürbar. Im Alltag sind sie vernachlässigbar.' },
            ]
          },
        ]
      },
    ]
  },

  /* =========================================================  KLASSE 12  */
  klasse12: {
    id:'klasse12', num:12, label:'Klasse 12',
    emoji:'🔬', color:['#0E7490','#22D3EE'], light:'#CFFAFE',
    tagline:'Qualifikationsphase: Integralrechnung, E-Felder und Kernphysik',
    subjects:[
      {
        id:'mathe', name:'Mathematik', icon:'🔢',
        desc:'Integralrechnung vertieft, Logarithmen und Analytische Geometrie',
        color:'#2563EB',
        intro:'Willkommen in Klasse 12 Mathematik! Wir vertiefen die Integralrechnung, lernen Logarithmen und tauchen tief in die analytische Geometrie mit Ebenen ein – alles Abitur-relevantes Wissen!',
        topics:[
          { name:'Integralrechnung – Flächenberechnung', diff:3,
            explanation:'Wie groß ist die Fläche zwischen zwei Kurven? Das ist eine klassische Abituraufgabe! Für die Fläche zwischen Kurve und x-Achse gilt: Fläche = |∫ₐᵇ f(x) dx|. Liegt ein Teil des Graphen unter der x-Achse, ist das Integral dort negativ – du musst das Intervall aufteilen und Beträge addieren. Fläche zwischen zwei Kurven f(x) und g(x): A = ∫ₐᵇ |f(x) – g(x)| dx = ∫ₐᵇ (obere Kurve – untere Kurve) dx. Schnittstellen der Kurven (f(x) = g(x)) geben die Integralgrenzen a und b. Rotationsvolumen: Dreht man den Bereich um die x-Achse, erhält man ein Volumen: V = π × ∫ₐᵇ [f(x)]² dx. Beispiel: Ein parabolisches Tal hat den Umriss y = x². Um zu wissen, wie viel Beton man für ein Dammbauwerk braucht, berechnet man die Fläche unter der Parabel. Integrale kommen in Wirtschaft (Gewinn aus Grenzkosten), Physik (Weg aus Geschwindigkeit) und Technik ständig vor!' },
          { name:'Logarithmen und Logarithmusfunktionen', diff:3,
            explanation:'Auf welcher Stelle in einer Potenz steckt die Variable? Beim Logarithmus! log_b(x) beantwortet: "Zu welcher Potenz muss ich b erheben, um x zu bekommen?" Beispiel: log₂(8) = 3, weil 2³ = 8. Wichtige Logarithmen: lg (dekadischer Logarithmus, Basis 10), ln (natürlicher Logarithmus, Basis e ≈ 2,718). Logarithmusgesetze: log(a×b) = log(a) + log(b), log(a/b) = log(a) – log(b), log(aⁿ) = n×log(a), log_b(b) = 1, log(1) = 0. Exponentialgleichungen lösen: 2^x = 100 → x = log₂(100) = ln(100)/ln(2) ≈ 6,64. Die Logarithmusfunktion f(x) = ln(x) ist streng monoton steigend, geht durch (1,0), hat als Ableitung f\'(x) = 1/x. Anwendungen: pH-Wert in der Chemie (pH = –log[H⁺]), Dezibel in der Akustik, Erdbebenstärke (Richterskala), Halbwertszeit (radioaktiver Zerfall), Wachstumszeiten berechnen, Informationstheorie!' },
          { name:'Analytische Geometrie: Ebenen', diff:3,
            explanation:'Wie beschreibt man eine Ebene im 3D-Raum mathematisch? Mit der Parameterdarstellung oder der Normalenform! Parameterdarstellung: E: x⃗ = a⃗ + s×u⃗ + t×v⃗ (Aufpunkt a⃗, zwei Richtungsvektoren u⃗, v⃗ in der Ebene). Normalenform: E: n⃗ · (x⃗ – a⃗) = 0, wobei n⃗ der Normalenvektor (senkrecht zur Ebene) ist. Koordinatenform: ax₁ + bx₂ + cx₃ = d. Normalenvektor n⃗ = (a, b, c) kann aus zwei Richtungsvektoren durch Kreuzprodukt gewonnen werden. Lagebeziehungen Gerade–Ebene: Liegt die Gerade in der Ebene (Schnittpunkt aller Punkte), schneidet sie die Ebene in einem Punkt, oder ist sie parallel (kein Schnittpunkt). Lagebeziehungen Ebene–Ebene: parallel, identisch oder schneidend (dann in einer Geraden). Abstand Punkt–Ebene: d = |n⃗·a⃗_P – d| / |n⃗|. Analytische Geometrie steckt in Computer-Grafik, CAD-Software, Robotersteuerung und Kollisionserkennung!' },
          { name:'Hypothesentest (Stochastik)', diff:3,
            explanation:'Eine Medikamentenfirma behauptet, ihr Mittel hilft in 80% der Fälle. Du testest es an 20 Patienten – nur 12 wurden gesund. Widerspricht das der Behauptung? Das testest du mit einem Hypothesentest! Schritt 1: Nullhypothese H₀ aufstellen (z.B. p = 0,8) und Alternativhypothese H₁ (p < 0,8). Schritt 2: Signifikanzniveau α wählen (meist 5% oder 1%). Schritt 3: Ablehnungsbereich bestimmen – für welche Werte von k (Anzahl Erfolge) lehnst du H₀ ab? Der Ablehnungsbereich enthält Werte, bei denen P(X ≤ k) ≤ α. Schritt 4: Entscheidung – liegt k im Ablehnungsbereich? Dann lehne H₀ ab. Fehlerarten: Fehler 1. Art = H₀ fälschlicherweise ablehnen (Wahrscheinlichkeit = α). Fehler 2. Art = H₀ fälschlicherweise beibehalten. Im Alltag: Medikamententests, Qualitätskontrolle, Wahlprognosen, wissenschaftliche Studien. Der p-Wert gibt an, wie wahrscheinlich das beobachtete Ergebnis (oder Extremeres) ist, wenn H₀ gilt – je kleiner, desto mehr spricht gegen H₀!' },
        ],
        exercises:[
          { id:'e1', type:'Integral', diff:3, title:'Flächenberechnung mit Integralen',
            desc:'Flächen zwischen Kurven und der x-Achse berechnen.',
            questions:[
              { q:'∫₀² (x²) dx = ?', hint:'F(x) = x³/3. F(2) – F(0).', options:['4/3','8/3','4','8'], correct:1, explanation:'F(2) – F(0) = 8/3 – 0 = 8/3 ≈ 2,67.' },
              { q:'Fläche zwischen f(x) = x² und g(x) = x im Intervall [0,1]?', hint:'∫₀¹ (x – x²) dx = [x²/2 – x³/3]₀¹', options:['1/6','1/3','1/2','1'], correct:0, explanation:'F(1) – F(0) = (1/2 – 1/3) = 1/6.' },
              { q:'Schnittstelle von f(x) = x² und g(x) = 4 (außer x=0)?', hint:'x² = 4 → x = ?', options:['x = 1','x = 2','x = 4','x = –4'], correct:1, explanation:'x² = 4 → x = ±2.' },
              { q:'Liegt f(x) unter der x-Achse: Was passiert mit dem Integral?', hint:'Fläche geometrisch = Betrag.', options:['Integral wird positiv','Integral wird negativ','Integral = 0','Kein Integral möglich'], correct:1, explanation:'Für geometrische Fläche Betrag nehmen: A = |∫f dx|.' },
              { q:'Rotationsvolumen um x-Achse: V = ?', hint:'V = π × ∫ [f(x)]² dx', options:['V = ∫f dx','V = π∫f dx','V = π∫[f(x)]² dx','V = 2π∫f dx'], correct:2, explanation:'V = π × ∫ₐᵇ [f(x)]² dx.' },
              { q:'∫₋₁¹ x dx = ?', hint:'Symmetrisch: positiver und negativer Teil heben sich auf.', options:['0','1','2','-1'], correct:0, explanation:'∫₋₁¹ x dx = [x²/2]₋₁¹ = 1/2 – 1/2 = 0.' },
              { q:'Stammfunktion von f(x) = 1/x (x > 0)?', hint:'Das ist der natürliche Logarithmus.', options:['–1/x²','x²/2','ln(x) + C','e^x'], correct:2, explanation:'F(x) = ln(x) + C – deshalb ist ln(x) so wichtig!' },
              { q:'Fläche von f(x) = sin(x) zwischen 0 und π?', hint:'∫₀^π sin(x) dx = [–cos(x)]₀^π', options:['0','1','2','π'], correct:2, explanation:'[–cos(π)] – [–cos(0)] = 1 + 1 = 2.' },
            ]
          },
          { id:'e2', type:'Logarithmen', diff:3, title:'Logarithmen und Exponentialgleichungen',
            desc:'Logarithmusgesetze anwenden und Gleichungen lösen.',
            questions:[
              { q:'Was ist log₂(8)?', hint:'2^? = 8', options:['2','3','4','6'], correct:1, explanation:'2³ = 8 → log₂(8) = 3.' },
              { q:'ln(e²) = ?', hint:'ln(eⁿ) = n', options:['e','2','e²','1/2'], correct:1, explanation:'ln(e²) = 2.' },
              { q:'log(100) = ? (Basis 10)', hint:'10^? = 100', options:['1','2','10','100'], correct:1, explanation:'log₁₀(100) = 2.' },
              { q:'log(a×b) = ?', hint:'Logarithmus eines Produkts', options:['log(a) × log(b)','log(a) + log(b)','log(a) – log(b)','log(a)/log(b)'], correct:1, explanation:'log(a×b) = log(a) + log(b).' },
              { q:'2^x = 16. Lösung?', hint:'2^? = 16', options:['x = 2','x = 4','x = 8','x = 16'], correct:1, explanation:'2⁴ = 16 → x = 4.' },
              { q:'Ableitung von f(x) = ln(x)?', hint:'Standardableitung aus dem Kurs.', options:['e^x','1/x²','1/x','x'], correct:2, explanation:'(ln x)\' = 1/x für x > 0.' },
              { q:'Wie lange dauert es, bis 1000€ bei 3% jährl. Zinsen auf 2000€ verdoppelt sind?', hint:'1000 × 1,03^t = 2000 → t = ln(2)/ln(1,03)', options:['~15 Jahre','~23 Jahre','~30 Jahre','~10 Jahre'], correct:1, explanation:'t = ln(2)/ln(1,03) ≈ 23 Jahre (Faustregel: 70/Zinssatz).' },
              { q:'log(a/b) = ?', hint:'Quotientenregel des Logarithmus.', options:['log(a) + log(b)','log(a) / log(b)','log(a) – log(b)','log(b) – log(a)'], correct:2, explanation:'log(a/b) = log(a) – log(b).' },
            ]
          },
          { id:'e3', type:'Geometrie', diff:3, title:'Analytische Geometrie – Ebenen',
            desc:'Ebenengleichungen und Lagebeziehungen.',
            questions:[
              { q:'Wie viele Parameter hat eine Ebenengleichung in Parameterform?', hint:'Aufpunkt + 2 Richtungsvektoren', options:['1','2','3','4'], correct:1, explanation:'E = a⃗ + s×u⃗ + t×v⃗ – zwei Parameter s und t.' },
              { q:'Normalenvektor n⃗ = (2, 0, 0). Wie liegt die Ebene?', hint:'Normale zeigt in x-Richtung.', options:['In x-Richtung geneigt','Parallel zur yz-Ebene','Parallel zur xy-Ebene','Senkrecht zur y-Achse'], correct:1, explanation:'Normalenvektor in x-Richtung → Ebene steht senkrecht zur x-Achse = parallel zur yz-Ebene.' },
              { q:'Koordinatenform der Ebene: 2x + 3y – z = 6. Normalenvektor?', hint:'Koeffizienten der Variablen.', options:['(6, 3, –1)','(2, 3, –1)','(2, –3, 1)','(1/2, 1/3, –1)'], correct:1, explanation:'Normalenvektor n⃗ = (2, 3, –1) – die Koeffizienten.' },
              { q:'Gerade parallel zu Ebene: Was gilt für Richtungsvektor r⃗ und n⃗?', hint:'Senkrecht aufeinander', options:['r⃗ × n⃗ = 0','r⃗ · n⃗ = 0','r⃗ = n⃗','r⃗ = 2×n⃗'], correct:1, explanation:'r⃗ · n⃗ = 0 – Richtung der Geraden senkrecht auf Normalenvektor.' },
              { q:'Abstand Punkt P(1,2,3) von Ebene 2x+2y+z=10. d=?', hint:'d = |2+4+3–10|/√(4+4+1) = |–1|/3', options:['1/3','2/3','1','3'], correct:0, explanation:'d = |2×1+2×2+1×3–10|/√(4+4+1) = |–1|/3 = 1/3.' },
              { q:'Zwei Ebenen sind identisch, wenn …?', hint:'Alle Punkte der einen liegen auf der anderen.', options:['Normalenvektoren parallel','Normalenvektoren gleich und selber d-Wert','Nur 1 Punkt gemeinsam','Kein gemeinsamer Punkt'], correct:1, explanation:'Identisch: proportionale Normalenvektoren und gleicher Abstand zum Ursprung.' },
              { q:'Wie erhält man den Normalenvektor aus zwei Richtungsvektoren?', hint:'Vektorprodukt', options:['Skalarprodukt','Kreuzprodukt (Vektorprodukt)','Addition','Differenz'], correct:1, explanation:'n⃗ = u⃗ × v⃗ – das Kreuzprodukt steht senkrecht auf beiden Vektoren.' },
              { q:'Schnittpunkt Gerade g: x⃗ = (0,0,0)+t(1,1,1) mit Ebene x+y+z=6?', hint:'t+t+t = 6 → 3t = 6', options:['t = 1, Punkt (1,1,1)','t = 2, Punkt (2,2,2)','t = 3, Punkt (3,3,3)','t = 6, Punkt (6,6,6)'], correct:1, explanation:'t+t+t=6 → t=2 → Schnittpunkt (2,2,2).' },
            ]
          },
        ]
      },
      {
        id:'physik', name:'Physik', icon:'⚡',
        desc:'Schwingungen, Wellen, Elektrisches & Magnetisches Feld, Induktion',
        color:'#0284C7',
        intro:'Herzlich willkommen in Physik Klasse 12! In diesem Jahr erkundest du fünf faszinierende Welten: Schwingungen, die in jeder Gitarrensaite und jedem Brückenbau stecken. Wellen, die Energie durch den Raum tragen – von Wasserwellen bis Licht. Das elektrische Feld, das unsere gesamte Technik antreibt. Das magnetische Feld, das Erde und Kompass miteinander verbindet. Und die Induktion – das Geheimnis hinter jedem Kraftwerk und jedem Motor. Zusammen bilden diese Themen das Herzstück der klassischen Physik!',
        topics:[
          { isChapter:true, name:'Kapitel 1 – Schwingungen' },
          { name:'1.1 – Merkmale von Schwingungen', diff:2,
            explanation:'Stell dir eine Schaukel vor: einmal angestoßen schwingt sie regelmäßig hin und her um ihre Ruhelage – das ist eine Schwingung! Eine Schwingung ist eine periodische Hin-und-Her-Bewegung um eine Gleichgewichtsposition. Wichtige Begriffe: Die Periode T ist die Zeit für einen vollständigen Durchgang (in Sekunden). Die Frequenz f = 1/T gibt an, wie viele Schwingungen pro Sekunde stattfinden (Einheit: Hertz, Hz). Die Amplitude A ist die maximale Auslenkung. Die Kreisfrequenz ω = 2πf. Eine harmonische Schwingung folgt einer Sinuskurve: y(t) = A × sin(ωt + φ₀). Die Phase φ₀ beschreibt die Startposition. Beispiele im Alltag: Gitarrensaite, Stimmgabel, Herzschlag (ca. 1 Hz), Wechselstrom (50 Hz), Quartz in Armbanduhren (32.768 Hz). Schwingungen bilden die Grundlage von Musik, Funkübertragung und präziser Zeitmessung!' },
          { name:'1.2 – Energie von Schwingungen', diff:2,
            explanation:'Beobachte einen Ball, der auf und ab springt: ganz oben hat er maximale Lageenergie, am tiefsten Punkt maximale Bewegungsenergie. Bei jeder Schwingung wird Energie ständig umgewandelt, aber die Summe bleibt konstant. Bei einer Federschwingung mit Federkonstante D und Auslenkung x gilt: kinetische Energie E_kin = ½mv², potenzielle Energie E_pot = ½Dx². Die Gesamtenergie E_ges = ½DA² (A = Amplitude) bleibt immer gleich. Ohne Reibung schwingt das System ewig mit gleicher Amplitude. Mit Dämpfung verliert das System Energie als Wärme – die Amplitude nimmt exponentiell ab. Resonanz: Wird von außen Energie im richtigen Rhythmus zugeführt, steigt die Amplitude enorm an. Dieses Prinzip erklärt Brückenvibrationen, Lautsprechertöne und sogar Spektrallinien von Atomen!' },
          { name:'1.3 – Das Fadenpendel', diff:2,
            explanation:'Pendeluhren ticken seit Jahrhunderten – und ihre Genauigkeit verdanken sie einer eleganten Formel! Ein Fadenpendel der Länge L schwingt mit der Periode T = 2π × √(L/g), wobei g ≈ 9,81 m/s² die Erdbeschleunigung ist. Das Erstaunliche: Die Periode hängt weder von der Masse noch von der Amplitude ab (für kleine Winkel unter ca. 15°)! Eine schwere Kugel und eine leichte am gleichen Faden schwingen identisch schnell – das nennt man Isochronismus. Durch Messen von T kann man g bestimmen – Galileo nutzte das Pendel schon 1602 zur Zeitmessung. Auf dem Mond (kleineres g) schwingt das gleiche Pendel langsamer. Alltagsbeispiele: Schaukel auf dem Spielplatz, Großvateruhr, Krangehänge (schwingendes Bauteil), Seismograf. Mit der Formel lässt sich auch die Fadenlänge aus der Schwingungsdauer berechnen!' },
          { name:'1.4 – Erzwungene Schwingungen', diff:2,
            explanation:'Hast du schon mal jemanden auf einer Schaukel im falschen Moment angeschubst? Er wurde langsamer! Beim richtigen Moment klettert die Amplitude immer höher – das ist Resonanz. Bei erzwungenen Schwingungen treibt eine äußere Kraft mit Erregerfrequenz f_err ein System mit Eigenfrequenz f₀ an. Die Amplitude hängt vom Verhältnis f_err/f₀ ab: weit entfernt von f₀ bleibt sie klein, nahe f₀ wird sie riesig. Das kann gefährlich werden! Die Tacoma-Narrows-Brücke in den USA kollabierte 1940, weil Wind genau die Eigenfrequenz der Brücke traf. Gebäude werden gezielt so konstruiert, dass ihre Eigenfrequenz weit von Erdbebenfrequenzen entfernt liegt. Aber Resonanz kann auch nützlich sein: Musikinstrumente verstärken Töne durch Resonanz, MRT-Geräte nutzen Kernspinresonanz für medizinische Bilder, Mikrowellen regen Wassermoleküle an ihrer Eigenfrequenz an!' },
          { name:'1.5 – Überlagerung von Schwingungen', diff:3,
            explanation:'Was passiert, wenn zwei Schwingungen zusammentreffen? Sie addieren sich – und nach dem Treffen laufen beide unverändert weiter. Superpositionsprinzip: Die Auslenkung an jedem Punkt und zu jedem Zeitpunkt ist die Summe der Einzelauslenkungen. Gleiche Frequenz, gleiche Phase: Die Amplitude verdoppelt sich (konstruktive Interferenz). Gleiche Frequenz, entgegengesetzte Phase: Die Schwingungen loeschen sich aus (destruktive Interferenz). Fast gleiche Frequenzen f₁ ≈ f₂: Es entstehen Schwebungen – ein abwechselndes Lauter und Leiser mit der Schwebungsfrequenz f_S = |f₁ – f₂|. Je langsamer die Schwebung, desto aehnlicher sind die Frequenzen. Musiker stimmen Instrumente, indem sie die Schwebung zum Verschwinden bringen! Lissajous-Figuren entstehen auf dem Oszilloskop bei zwei senkrecht zueinander stehenden Schwingungen mit verschiedenen Frequenzverhaeltnissen – geometrische Muster, die Frequenzverhaeltnisse sichtbar machen.' },

          { isChapter:true, name:'Kapitel 2 – Wellen' },
          { name:'2.1 – Entstehung von Wellen', diff:1,
            explanation:'Wirf einen Stein ins ruhige Wasser und beobachte, wie sich Ringe ausbreiten – das Wasser selbst bleibt fast an Ort und Stelle, nur die Stoerung wandert weiter. Eine Welle entsteht, wenn ein schwingender Koerper seine Nachbarn in Schwingung versetzt, die dann wiederum ihre Nachbarn anregen – mit einer kleinen Zeitverzoegerung. Wellenarten: Transversalwellen – Teilchen schwingen senkrecht zur Ausbreitungsrichtung (Seilwelle, Lichtwelle, Wasseroberflaeche). Longitudinalwellen – Teilchen schwingen parallel zur Ausbreitungsrichtung (Schall in Luft, Druckwellen). Grundformel: Wellengeschwindigkeit c = λ × f (Wellenlaenge mal Frequenz). Die Wellengeschwindigkeit haengt vom Medium ab: Schall in Luft ≈ 340 m/s, im Wasser ≈ 1.500 m/s, in Stahl ≈ 5.000 m/s. Mechanische Wellen brauchen ein Medium – elektromagnetische Wellen breiten sich auch im Vakuum aus. Bei einer Welle wird Energie transportiert, aber keine Materie!' },
          { name:'2.2 – Harmonische Wellen', diff:2,
            explanation:'Schiebe ein langes Seil an einem Ende gleichmaessig hin und her – du siehst eine wandernde Sinuskurve. Das ist eine harmonische Welle! Ihre mathematische Beschreibung: y(x,t) = A × sin(ωt − kx + φ₀), wobei A die Amplitude, ω = 2πf die Kreisfrequenz und k = 2π/λ die Wellenzahl sind. Die Wellenlaenge λ ist der Abstand zwischen zwei identischen Punkten (z.B. zwei benachbarten Wellenberegen). Die Periode T ist die Zeit fuer eine vollstaendige Schwingung an einem fixen Ort. Die Wellengeschwindigkeit c = λ/T = λ × f. Ein bestimmter Wellenberg bewegt sich mit der Phasengeschwindigkeit vorwaerts. Fourier-Analyse: Jede noch so komplizierte periodische Welle laesst sich als Summe harmonischer Wellen darstellen. Diese Erkenntnis ist die Grundlage von Klanganalyse, MP3-Kompression und medizinischer Bildgebung!' },
          { name:'2.3 – Ueberlagerung von Wellen', diff:2,
            explanation:'Wenn zwei Wellen aufeinandertreffen, addieren sie sich kurzzeitig – und laufen danach unbeeindruckt weiter, als haetten sie sich nie getroffen! Superpositionsprinzip fuer Wellen: Die Gesamtauslenkung an jedem Punkt ist die Summe der Einzelauslenkungen zu jedem Zeitpunkt. Konstruktive Interferenz: Wellenberg trifft Wellenberg → Amplitude verdoppelt sich. Destruktive Interferenz: Wellenberg trifft Wellental → die Wellen loeschen sich aus. Anwendungen: Noise-Cancelling-Kopfhoerer erzeugen eine exakt gegenphasige Welle, die Umgebungslaerm ausloescht. Seifenblasen schimmern bunt, weil Licht an Vorder- und Rueckseite der Seifenfilm-Schicht reflektiert und interferiert – je nach Schichtdicke werden verschiedene Farben verstaerkt oder ausgeloescht. Doppelspaltversuch: Zwei Lichtquellen aus einem Spalt erzeugen abwechselnd helle und dunkle Streifen – Beweis fuer den Wellencharakter des Lichts!' },
          { name:'2.4 – Stehende Wellen', diff:2,
            explanation:'Zupf eine Gitarrensaite und sie schwingt in einer festen sichtbaren Form – nicht als wandernde Welle, sondern als stehende Welle mit unveraenderlichen Punkten. Eine stehende Welle entsteht, wenn eine laufende Welle an einem Ende reflektiert wird und mit der hinlaufenden Welle ueberlagert. Es bilden sich Knoten (Punkte ohne Schwingung) und Baeuchde (Punkte maximaler Schwingung). Fuer eine beidseitig eingespannte Saite der Laenge L gilt: Nur bestimmte Wellenlaengen sind erlaubt: λ_n = 2L/n. Die Eigenfrequenzen sind: f_n = n × f₁ (Grundton und Obertöne). Der Grundton f₁ = c/(2L). Je mehr Schwingungsbaeuchde, desto hoeher der Ton. Das erklaert: Kurze Gitarrensaiten klingen hoeher (kleineres L → groesseres f₁). Jede Saite erzeugt ihren Grundton plus charakteristische Obertone – so entsteht die typische Klangfarbe!' },
          { name:'2.5 – Das Huygenssche Prinzip', diff:3,
            explanation:'Warum biegen sich Schall und Licht um Ecken – obwohl man Ecken nicht "sehen" kann? Huygens erklaerte es bereits 1678 mit einem genialen Gedanken! Das Huygenssche Prinzip: Jeder Punkt einer Wellenfront ist selbst der Ausgangspunkt einer neuen Elementarwelle. Die neue Wellenfront ist die gemeinsame Einhüllende all dieser Elementarwellen. Damit erklaert es: Reflexion – Wellenfront wird zurueckgeworfen, Einfallswinkel gleich Reflexionswinkel. Brechung – An einer Grenzflaeche aendern Elementarwellen ihre Ausbreitungsgeschwindigkeit → Richtungsaenderung (wie ein Rad, das in weicheren Boden faehrt). Beugung – An Hindernissen und Spalten biegt sich die Welle um: Je kleiner der Spalt gegenueber der Wellenlaenge, desto staerker die Beugung. Das Prinzip gilt fuer alle Wellenarten: Schall, Licht, Wasser, Radiowellen. Es bildete spaeter die Grundlage der Wellenoptik und der Quantenmechanik!' },
          { name:'2.6 – Ultraschall', diff:1,
            explanation:'Fledermaeusse sehen mit den Ohren – sie senden Ultraschall und navigieren anhand der Echos. Ultraschall sind Schallwellen oberhalb von 20.000 Hz, also ausserhalb des menschlichen Hoerbereichs. Das Echolotprinzip: Ein Sender schickt einen kurzen Impuls, der Empfaenger misst die Laufzeit bis zum Echo. Abstand = Schallgeschwindigkeit × halbe Laufzeit. Medizin (Sonografie): Ultraschall zeigt Organe, Muskeln und ungeborene Kinder ohne Roentgenstrahlung. Hoehere Frequenz = kuerzere Wellenlaenge = feinere Detailaufloesung. Industrielle Pruefung: Ultraschall entdeckt Risse in Metallteilen ohne Zerstoerung (zerstoerungsfreie Werkstoffpruefung). Ultraschallreinigung: Im Ultraschallbad entstehen mikroskopisch kleine Blasen, die beim Kollaps Schmutz von Brillen, Schmuck und chirurgischen Instrumenten sprengen. Anwendungsfrequenzen: 20 kHz bis mehrere GHz je nach Verwendung.' },

          { isChapter:true, name:'Kapitel 3 – Elektrisches Feld' },
          { name:'3.1 – Die elektrische Ladung', diff:1,
            explanation:'Reibe einen Luftballon am Haar – er haftet danach an der Wand. Das liegt an elektrischer Ladung! Elektrische Ladung existiert in zwei Formen: positiv (Protonen) und negativ (Elektronen). Einheit: Coulomb (C). Die Elementarladung e ≈ 1,6 × 10⁻¹⁹ C ist die kleinste frei vorkommende Ladungsmenge – sie ist nicht weiter teilbar. Gleichnamige Ladungen stossen sich ab, ungleichnamige ziehen sich an. Ladungserhaltung: In einem abgeschlossenen System bleibt die Nettoladung konstant – das ist ein unverbruechliches Naturgesetz! Leiter lassen Ladungen wandern (Metalle, Salzsaeure), Isolatoren halten sie fest (Holz, Gummi, Luft). Blitz: Riesige Ladungstrennung in Gewitterwolken, dann schlagartige Entladung zur Erde. Das Universum hat insgesamt Nettoladung null – positive und negative Ladungen halten sich exakt die Waage!' },
          { name:'3.2 – Das elektrische Feld', diff:2,
            explanation:'Wie weiss eine Ladung, dass eine andere in der Naehe ist – obwohl kein koerperlicher Kontakt besteht? Durch das elektrische Feld! Das elektrische Feld durchdringt den Raum um jede Ladung und uebertraegt die Kraft. Elektrische Feldstaerke E = F/q (Kraft auf eine positive Probeladung q), Einheit: V/m oder N/C. Feldlinien zeigen die Richtung der Kraft auf positive Ladungen: sie beginnen bei + und enden bei −. Feldlinien dichterer Anordnung bedeuten staerkeres Feld. Feld einer Punktladung: E = k × Q / r² (nimmt mit dem Quadrat des Abstands ab). Homogenes Feld im Plattenkondensator: E = U/d (ueberall gleich stark). Feldlinien koennen sich niemals schneiden! Das Konzept des Feldes revolutionierte die Physik: Vorher dachte man, Kraefte wirken auf magische Weise ueber Distanz – jetzt weiss man, das Feld ist der eigentliche Traeger!' },
          { name:'3.3 – Das Coulombsche Gesetz', diff:2,
            explanation:'Wie stark ist die Kraft zwischen zwei Ladungen? Das Coulombsche Gesetz gibt die praezise Antwort! F = k × |q₁ × q₂| / r², mit k ≈ 8,99 × 10⁹ N·m²/C² (Coulomb-Konstante) und r = Abstand zwischen den Ladungen. Die Kraft ist anziehend bei ungleichen Ladungen, abstossend bei gleichen. Sie ist proportional zu beiden Ladungen und nimmt mit dem Quadrat des Abstands ab – genau wie die Gravitation! Vergleich zur Schwerkraft: Die Coulomb-Kraft zwischen zwei Elektronen ist 10⁴² Mal staerker als ihre gegenseitige Gravitationsanziehung! Deshalb dominieren elektrische Kraefte auf atomarer Ebene. Charles-Augustin de Coulomb entdeckte dieses Gesetz 1785 mit einer empfindlichen Torsionswaage. Das Gesetz erklaert Atombindungen, Ionen in Loesungen und warum Materie ueberhaupt zusammenhaelt.' },
          { name:'3.4 – Superposition von Feldern', diff:2,
            explanation:'In der Naehe mehrerer Ladungen wirken mehrere Felder gleichzeitig auf eine Probeladung – wie addiert man sie? Durch vektorielles Addieren! Superpositionsprinzip: Das Gesamtfeld an einem Punkt ist die vektorielle Summe aller Einzelfelder: E_ges = E₁ + E₂ + E₃ + ... Das gilt gleichermassen fuer Kraefte: F_ges = F₁ + F₂ + F₃ + ... Elektrischer Dipol: Zwei gleich grosse, entgegengesetzte Ladungen bilden ein charakteristisches Feldmuster. Dipolfelder spielen eine riesige Rolle im Alltag: Wassermolek üle sind elektrische Dipole – deshalb ist Wasser ein exzellentes Loesungsmittel fuer Salze und Zucker. Proteine und DNA-Straenge haben Dipolstrukturen, die biochemische Reaktionen steuern. Dipolantennen senden und empfangen Radiowellen. Das Superpositionsprinzip erlaubt die Analyse beliebig komplizierter Ladungsverteilungen!' },
          { name:'3.5 – Energie und Spannung im elektrischen Feld', diff:2,
            explanation:'Um eine positive Ladung in einem elektrischen Feld gegen die Feldrichtung zu schieben, muss man Arbeit leisten – genau wie beim Bergaufgehen gegen die Schwerkraft. Das elektrische Potenzial φ ist die potenzielle Energie pro Ladung: φ = W/q. Die elektrische Spannung U zwischen zwei Punkten ist ihre Potenzialdifferenz: U = φ₁ − φ₂, Einheit: Volt (V). Im homogenen Feld gilt: E = U/d. Aequipotenziallinien verlaufen immer senkrecht zu den Feldlinien. Entlang einer Aequipotenziallinie ist keine Arbeit noetig – das macht manche Bewegungen in Feldern "kostenlos". Ein Elektron, das durch 1 V beschleunigt wird, gewinnt 1 eV (Elektronvolt) = 1,6 × 10⁻¹⁹ J kinetische Energie. Hochspannungsleitungen fuehren bis zu 380.000 V – deshalb ist selbst die Naehe ohne direkten Kontakt lebensgefaehrlich!' },
          { name:'3.6 – Der Kondensator', diff:2,
            explanation:'Ein Kondensator ist ein elektrischer Energiespeicher – er kann schnell geladen und fast sofort wieder entladen werden, wie ein elektrischer Sprint-Akku! Zwei leitende Platten mit Abstand d speichern bei angelegter Spannung U eine Ladung Q. Kapazitaet C = Q/U (gespeicherte Ladung pro Volt), Einheit: Farad (F). Fuer einen Plattenkondensator: C = ε₀ × εᵣ × A/d (εᵣ = relative Permittivitaet des Fuellmaterials). Ein Dielektrikum zwischen den Platten erhoet C um den Faktor εᵣ. Gespeicherte Energie: E = ½ × C × U². Anwendungen: Kamerablitz (schnelle Energieabgabe), Defibrillator (Herzwiederbelebung), Milliarden winziger Kondensatoren in CPUs, Tastaturerkennung (Fingerdruck aendert C), Hybridfahrzeuge. Beim Aufladen ueber Widerstand R: U(t) = U₀ × (1 − e^(−t/(RC))).' },
          { name:'3.7 – Kondensator im Stromkreis', diff:3,
            explanation:'Ein Kondensator sperrt Gleichstrom wie eine Wand, laesst aber Wechselstrom durch wie ein offenes Tor – das macht ihn unverzichtbar in der Elektronik! Im Gleichstromkreis: Kondensator laedt sich auf Quellspannung auf, dann fliesst kein Strom mehr. Im eingeschwungenen Zustand wirkt er wie eine Unterbrechung. Im Wechselstromkreis: Da sich die Spannung staendig aendert, wird der Kondensator permanent geladen und entladen – Strom fliesst die ganze Zeit! Kapazitiver Blindwiderstand: X_C = 1/(2πfC). Hohe Frequenz → kleines X_C → Wechselstrom fliesst leicht. Niedrige Frequenz → grosses X_C → Strom wird gebremst. Der Strom eilt der Spannung um 90° voraus. Zeitkonstante τ = R × C – nach einer Zeitkonstante hat die Spannung 63% des Endwerts erreicht. RC-Filter: Tiefpass sperrt hohe Frequenzen, Hochpass sperrt niedrige. Steckt in jedem Radio, Equalizer und Lautsprecher-Frequenzweiche!' },
          { name:'3.8 – Ladungstraeger im elektrischen Feld', diff:3,
            explanation:'Ein geladenes Teilchen im elektrischen Feld wird beschleunigt – aehnlich wie ein Ball auf einer schiefen Ebene. Kraft auf eine Ladung: F = q × E. Beschleunigung: a = qE/m. Ein aus der Ruhe beschleunigtes Teilchen erreicht: v = √(2qU/m), mit kinetischer Energie ½mv² = qU. Das Elektronenstrahlrohr: Ein Elektronenstrahl wird durch elektrische Felder abgelenkt und auf einen Leuchtschirm gelenkt – Grundlage der alten Roehrenbildschirme und Oszilloskope. Geschwindigkeitsselektor: Elektrisches Feld E (Kraft nach oben) und magnetisches Feld B (Kraft nach unten) wirken gleichzeitig. Nur wenn F_E = F_B gilt, also qE = qvB, fliesst ein Teilchen mit v = E/B geradeaus – alle anderen werden abgelenkt. Das Massenspektrometer kombiniert Geschwindigkeitsselektor mit Magnetfeld-Kreisbahn zur praezisen Massenbestimmung von Atomen und Molekuelen.' },
          { name:'3.9 – Nachweis der Elementarladung', diff:3,
            explanation:'Woher wissen wir, dass elektrische Ladung in kleinsten Portionen vorkommt und nicht beliebig klein werden kann? Robert Millikan bewies es 1909 mit einem genialen Experiment! Millikans Oeltroepfchenversuch: Winzige Oeltroepfchen schweben zwischen zwei Kondensatorplatten. Durch Roentgenstrahlen werden sie ionisiert (erhalten ganzzahlige Vielfache der Elementarladung). Ohne Feld sinken sie (Schwerkraft). Mit passendem E-Feld schweben sie: F_E = F_g → qE = mg → q = mg/E. Ergebnis: Alle gemessenen Ladungen sind ganzzahlige Vielfache von e ≈ 1,6 × 10⁻¹⁹ C! Das beweist: Ladung ist quantisiert – sie kommt in Portionen, ist nicht beliebig teilbar. Millikan erhielt dafuer 1923 den Nobelpreis. Die Elementarladung e ist eine der fundamentalsten Naturkonstanten: Sie steckt in jedem Atom, jedem Ion, jeder chemischen Bindung und bestimmt die Staerke aller elektromagnetischen Wechselwirkungen.' },

          { isChapter:true, name:'Kapitel 4 – Magnetisches Feld' },
          { name:'4.1 – Das magnetische Feld', diff:1,
            explanation:'Magnete ziehen Eisen an, Kompassnadeln zeigen nach Norden – aber wie wird diese Kraft ueber Distanz uebertragen ohne Kontakt? Durch das magnetische Feld! Das magnetische Feld B (magnetische Flussdichte) beschreibt, wie stark und in welche Richtung eine Kraft auf bewegte Ladungen und Magnete wirkt. Einheit: Tesla (T). Magnetische Feldlinien verlaufen ausserhalb des Magneten vom Nordpol zum Suedpol und bilden immer geschlossene Schleifen. Wichtig: Magnetische Einzelpole (Monopole) existieren nicht – jeder Magnet hat immer beide Pole! Das Erdmagnetfeld (ca. 5 × 10⁻⁵ T) entsteht durch Konvektionsstroeume im fluessigen Eisenkern. Magnetfeld um einen geraden Stromleiter: B = μ₀ × I / (2πr). Im Innern einer langen Spule: B = μ₀ × n × I (n = Windungen pro Meter). Rechte-Hand-Regel: Daumen zeigt in Stromrichtung – gebogene Finger zeigen Feldrichtung!' },
          { name:'4.2 – Quantitative Beschreibung des Magnetfeldes', diff:3,
            explanation:'Mit Zahlen laesst sich das Magnetfeld vollstaendig beschreiben und berechnen! Magnetischer Fluss Φ = B × A × cos(θ) beschreibt, wie viele Feldlinien durch die Flaeche A treten, wobei θ der Winkel zwischen B und der Flaechennormalen ist. Einheit: Weber (Wb = T·m²). Lorentzkraft auf einen stromdurchflossenen Leiter: F = B × I × L × sin(α). Magnetfeld einer kreisfoermigen Leiterschleife im Mittelpunkt: B = μ₀ × I / (2R). Kraft zwischen zwei parallelen Stromleitern: F/L = μ₀ × I₁ × I₂ / (2πd). Parallele Stroeme in gleicher Richtung ziehen sich an, entgegengesetzte stossen sich ab! Genau darauf basiert die SI-Definition des Ampere: 1 A erzeugt zwischen zwei 1 m entfernten Leitern die Kraft 2 × 10⁻⁷ N pro Meter. Energie des Magnetfelds: E = ½ × L × I² (L = Induktivitaet in Henry).' },
          { name:'4.3 – Der Hall-Effekt', diff:3,
            explanation:'Ein winziger Chip misst ein Magnetfeld ohne Kompassnadel und ohne bewegliche Teile – dank des Hall-Effekts! Wenn ein Strom durch einen Leiter in einem Magnetfeld fliesst, werden die Ladungstraeger seitlich abgelenkt. Diese seitliche Verschiebung baut eine Querspannung auf (Hall-Spannung): U_H = (I × B) / (n × e × d), wobei n die Ladungstraegerdichte, e die Elementarladung und d die Leiterdicke sind. Aus der Hall-Spannung kann man ablesen: Vorzeichen der Ladungstraeger (positiv oder negativ), Ladungstraegerdichte n und die Magnetfeldstaerke B. Hall-Sensoren sind im Alltag allgegenwaertig: Computer-Festplatten (Lesekopfposition), Elektromotoren (Drehzahlmessung), Smartphone-Kompass, ABS-Raddrehzahlsensoren in Autos, beruehrungslose Positionsschalter. Guenstiger, robuster und langlebiger als jede Kompassnadel!' },
          { name:'4.4 – Elektronen haben eine Masse', diff:3, exp:'fadenstrahlrohr',
            explanation:'Wie misst man die Masse eines Elektrons – eines Teilchens, das selbst im besten Mikroskop unsichtbar ist? Mit einer genialen Kombination aus elektrischen und magnetischen Feldern! J. J. Thomson gelang es 1897 erstmals, das Masse-Ladungs-Verhaeltnis des Elektrons zu bestimmen. Methode: Elektronen werden durch Spannung U beschleunigt: v = √(2eU/m_e). Im Geschwindigkeitsselektor (E und B senkrecht): nur Elektronen mit v = E/B fliegen geradeaus. Im reinen Magnetfeld: Kreisbahn mit Radius r = m_e × v / (e × B). Durch Kombination: m_e/e = B² × r / (2U). Mit bekannten r, B, U ergibt sich m_e/e ≈ 5,69 × 10⁻¹² kg/C. Elektronenmasse: m_e ≈ 9,11 × 10⁻³¹ kg. Das war das erste Mal in der Geschichte, dass die Masse eines subatomaren Teilchens gemessen wurde – ein Meilenstein! Das Zyklotron als Teilchenbeschleuniger und das Elektronenmikroskop nutzen beide dieses Kreisbahn-Prinzip.' },

          { isChapter:true, name:'Kapitel 5 – Induktion' },
          { name:'5.1 – Elektrische Spannung durch Magnetfelder', diff:2,
            explanation:'Wie erzeugt ein Fahrrad-Dynamo Strom ganz ohne Batterie? Durch elektromagnetische Induktion! Faradaysches Induktionsgesetz: Aendert sich der magnetische Fluss Φ durch eine Leiterschleife, wird eine Spannung induziert: U_ind = −N × dΦ/dt (N = Windungszahl). Der Fluss kann sich aendern durch: zeitlich veraenderliches Magnetfeld B, sich aendernde Flaeche A oder Aendern des Winkels θ (rotierende Spule). Bewegter Leiter der Laenge L mit Geschwindigkeit v im Feld B: U_ind = B × L × v. Ein Generator rotiert eine Spule im Magnetfeld → staendig wechselnder Fluss → Wechselspannung. Wind- und Wasserkraftwerke, Kernkraftwerke – alle erzeugen Strom nach genau diesem Prinzip. Faraday entdeckte das Induktionsgesetz 1831 und leitete damit die industrielle Elektrifizierung der Welt ein!' },
          { name:'5.2 – Die Lenzsche Regel', diff:2,
            explanation:'Warum ist es schwerer, einen Magneten schnell aus einem Kupferrohr zu ziehen als langsam? Weil der induzierte Strom dagegen haelt! Lenzsche Regel: Der induzierte Strom fliesst immer in der Richtung, die der Aenderung entgegenwirkt, die ihn erzeugt hat. Naehert sich ein Magnet: induzierter Strom erzeugt ein Feld, das den Magneten abbremst. Entfernt sich ein Magnet: induzierter Strom erzeugt ein Feld, das ihn zurueckzieht. Das ist eine direkte Folge der Energieerhaltung – elektrische Energie aus dem Nichts ist unmoeglich! Wirbelstroeume: In massiven Leitern fliessen induzierte Kreisstroeume, die bremsend wirken – beruerhrungslose Bremse. Anwendungen: Induktionsherd – Wechselfeld induziert Stroeume im Topfboden → Waerme direkt dort wo sie gebraucht wird. Rekuperatives Bremsen: Elektroauto nutzt den Motor als Generator → Energie zurueck in die Batterie!' },
          { name:'5.3 – Selbstinduktion', diff:3,
            explanation:'Eine Spule wehrt sich gegen Stromaenderungen – wie ein Schwungrad, das seinen Drehzustand beibehalten moechte. Selbstinduktion: Aendert sich der Strom in einer Spule, aendert sich das eigene Magnetfeld – und dieses induziert eine Spannung in der Spule selbst! Diese Gegeninduktionsspannung U_L = −L × dI/dt wirkt der Stromaenderung entgegen. Die Induktivitaet L (Einheit: Henry H) misst die Staerke dieses Effekts. Energie im Magnetfeld der Spule: E = ½ × L × I². Grosse L bedeutet: viel gespeicherte Energie und starker Widerstand gegen Aenderungen. Daran erkennt man Selbstinduktion im Alltag: der Funken beim Lichtschalter-Ausschalten entsteht, weil die Leitungsspule kurz sehr hohe Spannungen aufbaut, um den Strom aufrechtzuerhalten. Anwendungen: Drosselspulen in Netzteilen, Zuendspulen im Automotor, Filter in Audiogeraeten.' },
          { name:'5.4 – Die Spule als Energiespeicher', diff:3,
            explanation:'Spule und Kondensator sind beide Energiespeicher – aber mit gegensaetzlichem Charakter! Spule (Induktivitaet L): Energie E = ½ × L × I². Die Spule "will" den Strom konstant halten. Beim Einschalten steigt der Strom langsam: I(t) = I_max × (1 − e^(−Rt/L)). Beim Ausschalten klingt er ab: I(t) = I_max × e^(−Rt/L). Zeitkonstante: τ = L/R. Kondensator (Kapazitaet C): Energie E = ½ × C × U². Er "will" die Spannung konstant halten. Zusammen bilden Spule und Kondensator die Grundlage des elektrischen Schwingkreises (Kapitel 5.10). Supraleitende Spulen in MRT-Geraeten speichern bei nahezu null Widerstand gewaltige Energiemengen im Magnetfeld – Kuehlung auf −269 °C mit fluessigem Helium noetig. Schaltnetzteil-Drosseln glaetten Stromspitzen in Computernetzteilen und Ladegeraeten.' },
          { name:'5.5 – Wechselspannung und Wechselstrom', diff:2,
            explanation:'Haushaltsstrom fliesst nicht gleichmaessig in eine Richtung – er schwingt 50 Mal pro Sekunde hin und her! Wechselspannung: U(t) = U_max × sin(ωt) mit Kreisfrequenz ω = 2πf. In Deutschland: f = 50 Hz, U_max = 325 V. Aber auf Steckdosen steht "230 V" – das ist der Effektivwert: U_eff = U_max / √2 ≈ 0,707 × U_max. Der Effektivwert entspricht der Gleichspannung, die dieselbe Heizwirkung in einem Widerstand erzeugt. Ebenso: I_eff = I_max / √2. Warum Wechselstrom im Netz? Nur mit Wechselstrom funktionieren Transformatoren! Sie ermoeglichen es, die Spannung fuer Fernleitungen hochzusetzen (weniger Verluste) und beim Verbraucher wieder runterzusetzen. Der Stromkrieg der 1880er: Edison (Gleichstrom) versus Tesla und Westinghouse (Wechselstrom) – Wechselstrom gewann und elektrrifiziert seitdem die Welt.' },
          { name:'5.6 – Elektrische Energie, Leistung und Wirkungsgrad', diff:3,
            explanation:'Deine Stromrechnung misst Kilowattstunden – aber was steckt genau dahinter? Elektrische Leistung im Wechselstromkreis: P = U_eff × I_eff × cos(φ), wobei φ der Phasenwinkel zwischen U und I ist. Bei reinen Widerstaenden gilt φ = 0 und P = U_eff × I_eff. Blindleistung Q = U_eff × I_eff × sin(φ) pendelt zwischen Generator und Verbraucher hin und her, ohne nuetzliche Arbeit zu leisten. Scheinleistung S = U_eff × I_eff (Gesamtbelastung des Generators). Leistungsfaktor cos(φ) = P/S – Ingenieure wollen ihn moeglichst nahe bei 1 halten. Wirkungsgrad η = P_nutz / P_gesamt: Ein Geraet mit 80% Wirkungsgrad gibt 20% als Waerme ab. Energie: 1 kWh = 3,6 × 10⁶ J. Bei Kondensatoren eilt der Strom der Spannung 90° voraus, bei Spulen hinkt er 90° hinterher. Kondensatoren zur Phasenkompensation verbessern den Leistungsfaktor in Industrieanlagen.' },
          { name:'5.7 – Wechselstromkreis mit Kondensator oder Spule', diff:3,
            explanation:'In Wechselstromkreisen verhalten sich Kondensatoren und Spulen wie frequenzabhaengige Widerstaende – das ist das Herzstuck aller elektronischen Filter und Abstimmschaltungen! Kapazitiver Blindwiderstand: X_C = 1/(2πfC). Hohe Frequenz → kleines X_C → Kondensator leitet gut. Niedrige Frequenz → grosses X_C → Kondensator sperrt. Induktiver Blindwiderstand: X_L = 2πfL. Niedrige Frequenz → kleines X_L → Spule leitet gut. Hohe Frequenz → grosses X_L → Spule sperrt. Impedanz (Gesamtwiderstand): Z = √(R² + (X_L − X_C)²). Eselsbruecke "CIVIL": Bei C eilt I (Strom) vor U (Spannung), bei L hinkt I hinterher. Lautsprecher-Frequenzweiche: Hochton-Lautsprecher erhaelt Kondensator (sperrt tiefe Toene), Tiefton-Lautsprecher erhaelt Spule (sperrt hohe Toene). Equalizer, Radiosender-Abstimmung und Mobilfunkfilter – alles basiert auf reaktiven Bauteilen!' },
          { name:'5.8 – Der Transformator', diff:2,
            explanation:'Ein Geraet ohne bewegliche Teile, das Spannung beliebig hoch- oder runtertransformiert – der Transformator ist eine der wichtigsten Erfindungen der Elektrotechnik! Aufbau: Primaerspule (N₁ Windungen) und Sekundaerspule (N₂ Windungen) auf gemeinsamem Eisenkern. Wechselspannung in der Primaerspule erzeugt einen zeitlich veraenderlichen magnetischen Fluss im Kern, der in der Sekundaerspule eine Spannung induziert. Spannungsverhaeltnis: U₁/U₂ = N₁/N₂. Stromverhaeltnis (Energieerhaltung): I₁/I₂ = N₂/N₁. Leistung rein ≈ Leistung raus (idealer Transformator, Wirkungsgrad η ≈ 98−99%). Hochspannungstransformator (N₂ > N₁): Spannung hinauf fuer Fernleitungen (bis 380.000 V). Tiefsttransformator (N₂ < N₁): Spannung herunter auf 230 V fuer den Haushalt. Der laminierte Eisenkern vermindert Wirbelstromverluste. Ohne Transformatoren kein Fernnetz – jedes Kraftwerk muesste direkt neben seinen Verbrauchern stehen!' },
          { name:'5.9 – Energieversorgung', diff:2,
            explanation:'Wie kommt der Strom aus einem 500 km entfernten Kraftwerk in deine Steckdose? Das ist eine Meisterleistung der Ingenieurskunst! Stromerzeugung: Turbine treibt Generator an (Dampf aus Kernkraft, Kohle oder Gas – oder Wind und Wasser direkt). Generator erzeugt Wechselstrom bei ca. 10−25 kV. Hochtransformator: Spannung auf 220−380 kV angehoben fuer Fernuebertragung. Warum? Da P = U × I, benoetigt man bei gleicher Leistung und hoeherem U weniger I → viel weniger Waermeverluste im Kabel (P_verlust = R × I²). Uebertragungsleitungen: Stahl-Aluminium-Kabel ueber hunderte Kilometer. Tiefsttransformatoren: Regional (110 kV → 10 kV), lokal (10 kV → 400/230 V). Smart Grid: Sensoren, Speicher, erneuerbare Quellen und Laststeuerung. Herausforderung: Wind und Sonne sind wetterabhaengig – Speichertechnologien und flexible Kraftwerke werden immer wichtiger. Das Stromnetz gilt als eines der groessten Ingenieurwerke der Menschheitsgeschichte!' },
          { name:'5.10 – Der elektromagnetische Schwingkreis', diff:3,
            explanation:'Ein Schaltkreis, der ganz von selbst schwingt und Radiowellen senden oder empfangen kann – der LC-Schwingkreis ist das Herzstuck jedes Radios! LC-Schwingkreis: Kondensator C und Spule L sind zusammengeschaltet. Ablauf: Kondensator geladen → entlaedt sich ueber Spule → Magnetfeld in Spule baut sich auf → Kondensator laedt sich entgegengesetzt auf → und so weiter. Die Energie schaukelt hin und her: E = ½CU² ↔ E = ½LI². Resonanzfrequenz: f₀ = 1/(2π × √(LC)) – die Thomsonsche Schwingungsformel. Mit ohmschemn Widerstand R → gedaempfte Schwingung, Amplitude klingt ab. Durch externe Anregung genau bei f₀ → Resonanz, Amplitude waechst. Radioempfang: Der Schwingkreis im Empfaenger wird auf die Senderfrequenz abgestimmt – nur diese Frequenz schwingt stark an. Radioabstimmung: Du veraenderst C → f₀ aendert sich → anderer Sender. Smartphones, WLAN-Router, GPS – alle nutzen abgestimmte Schwingkreise fuer ihre Funkverbindungen!' },
        ],
        exercises:[
          { id:'e1', type:'E-Feld', diff:3, title:'Elektrisches Feld und Kondensator',
            desc:'Feldstärke, Kapazität und Energie.',
            questions:[
              { q:'Elektrische Feldstärke E im Plattenkondensator: U=100V, d=2mm. E=?', hint:'E = U/d, Einheiten beachten: d = 0,002 m', options:['50 V/m','200 V/m','50.000 V/m','5.000 V/m'], correct:2, explanation:'E = 100 / 0,002 = 50.000 V/m.' },
              { q:'Kapazität: Q = 0,01 C, U = 100 V. C = ?', hint:'C = Q/U', options:['0,01 mF','0,1 mF','1 mF','10 mF'], correct:1, explanation:'C = Q/U = 0,01/100 = 10⁻⁴ F = 0,1 mF.' },
              { q:'Energie eines Kondensators: C=100μF, U=10V. W=?', hint:'W = ½ × C × U²', options:['0,005 J','0,01 J','0,05 J','5 J'], correct:0, explanation:'W = ½ × 10⁻⁴ × 100 = 0,005 J.' },
              { q:'Einheit der Kapazität?', hint:'Benannt nach Michael Faraday', options:['Henry','Ohm','Farad','Volt'], correct:2, explanation:'Kapazität in Farad (F) = Coulomb/Volt.' },
              { q:'Zeitkonstante τ beim Laden eines Kondensators: R=1kΩ, C=1μF. τ=?', hint:'τ = R × C', options:['1 μs','1 ms','1 s','1 ks'], correct:1, explanation:'τ = 1000 × 10⁻⁶ = 10⁻³ s = 1 ms.' },
              { q:'Was macht ein Kondensator im Gleichstromkreis im eingeschwungenen Zustand?', hint:'Er ist vollständig geladen.', options:['Lässt Strom durch','Blockiert den Strom','Erzeugt Strom','Verbraucht Energie'], correct:1, explanation:'Vollständig geladen: kein Strom fließt mehr (blockiert Gleichstrom).' },
              { q:'Verdoppelt man die Spannung am Kondensator, wie ändert sich die Energie?', hint:'W = ½CU² – Spannung quadratisch!', options:['Verdoppelt','Verdreifacht','Vervierfacht','Halbiert'], correct:2, explanation:'W ∝ U² → Spannung ×2 → Energie ×4.' },
              { q:'Wofür steht E im elektrischen Feld?', hint:'Kraft pro Ladung', options:['Energie','Elektrische Feldstärke in V/m','Elementarladung','Effizienz'], correct:1, explanation:'E = elektrische Feldstärke, Einheit V/m (oder N/C).' },
            ]
          },
          { id:'e2', type:'Kernphysik', diff:3, title:'Radioaktivität und Kernphysik',
            desc:'Zerfallsarten, Halbwertszeit und Kernreaktionen.',
            questions:[
              { q:'Was ist Alpha-Strahlung?', hint:'Heliumkern', options:['Elektron','Heliumkern (2p+2n)','Photon','Neutron'], correct:1, explanation:'α-Strahlung = ⁴He-Kern, geringe Reichweite.' },
              { q:'Gamma-Strahlung ist …?', hint:'Elektromagnetische Strahlung', options:['Elektronen','Protonen','Elektromagnet. Strahlung hoher Energie','Neutronen'], correct:2, explanation:'γ-Strahlung = hochenergetische elektromagnet. Wellen, sehr durchdringend.' },
              { q:'Halbwertszeit von ¹⁴C ≈ 5730 Jahre. Nach 2 Halbwertszeiten: Wie viel bleibt?', hint:'Jede HWZ → Halbierung: ½ × ½', options:['1/2','1/4','1/8','1/16'], correct:1, explanation:'2 Halbierungen: (½)² = 1/4 der Ausgangsmenge.' },
              { q:'Einheit der Radioaktivität?', hint:'Benannt nach Henri Becquerel', options:['Gray','Sievert','Becquerel','Curie'], correct:2, explanation:'Becquerel (Bq) = Zerfälle pro Sekunde.' },
              { q:'Zerfallsgesetz: N(t) = N₀ × e^(–λt). Was ist λ?', hint:'Zerfallskonstante', options:['Halbwertszeit','Aktivität','Zerfallskonstante','Wellenlänge'], correct:2, explanation:'λ = Zerfallskonstante; je größer λ, desto schneller der Zerfall.' },
              { q:'Was ist Kernspaltung?', hint:'Schwerer Kern → zwei leichtere', options:['Zwei leichte Kerne fusionieren','Schwerer Kern zerfällt in leichtere + Energie','Protonen wandeln sich in Neutronen','Elektronen verlassen den Kern'], correct:1, explanation:'Kernspaltung: z.B. U-235 + n → Ba + Kr + 3n + Energie.' },
              { q:'E = m × c². c ≈ 3×10⁸ m/s. Was zeigt diese Formel?', hint:'Masse kann in Energie umgewandelt werden.', options:['Lichtgeschwindigkeit ist konstant','Masse und Energie sind äquivalent','Energie = Kraft × Weg','Temperatur erhöht Energie'], correct:1, explanation:'Einsteinsche Masse-Energie-Äquivalenz: kleinste Masse = riesige Energie.' },
              { q:'Was ist der Unterschied zwischen Kernspaltung und Kernfusion?', hint:'Spaltung = groß → klein; Fusion = klein → groß', options:['Kein Unterschied','Spaltung spaltet schwere Kerne; Fusion verschmilzt leichte','Fusion ist künstlich, Spaltung natürlich','Beide laufen in der Sonne ab'], correct:1, explanation:'Spaltung: schwere Kerne (U, Pu) → leichtere. Fusion: leichte Kerne (H) → schwerere. Sonne nutzt Fusion.' },
            ]
          },
          { id:'e3', type:'Magnetismus', diff:3, title:'Magnetfeld und Lorentzkraft',
            desc:'Magnetische Kräfte und Induktion.',
            questions:[
              { q:'Lorentzkraft auf Elektron: q=1,6×10⁻¹⁹C, v=10⁶m/s, B=0,1T (v⊥B). F=?', hint:'F = q×v×B', options:['1,6×10⁻¹⁴ N','1,6×10⁻¹⁵ N','1,6×10⁻¹³ N','1,6×10⁻¹² N'], correct:0, explanation:'F = 1,6×10⁻¹⁹ × 10⁶ × 0,1 = 1,6×10⁻¹⁴ N.' },
              { q:'Was leistet die Lorentzkraft an einem Teilchen?', hint:'Senkrecht zur Geschwindigkeit.', options:['Beschleunigt das Teilchen','Bremst das Teilchen','Ändert nur die Richtung, keine Arbeit','Ändert die Masse'], correct:2, explanation:'F ⊥ v → keine Arbeit, nur Richtungsänderung.' },
              { q:'Faradaysches Induktionsgesetz: U_ind = –dΦ/dt. Was ist Φ?', hint:'Magnetischer Fluss', options:['Elektrische Feldstärke','Magnetischer Fluss (B×A)','Widerstand','Kapazität'], correct:1, explanation:'Φ = B × A = magnetischer Fluss (T×m² = Weber Wb).' },
              { q:'Transformator: N₁=100, N₂=1000, U₁=230V. U₂=?', hint:'U₁/U₂ = N₁/N₂ → U₂ = U₁×N₂/N₁', options:['23 V','230 V','2300 V','23000 V'], correct:2, explanation:'U₂ = 230 × 1000/100 = 2300 V.' },
              { q:'Lenzsche Regel besagt …?', hint:'Induktionsstrom wirkt seiner Ursache entgegen.', options:['Magnetfelder addieren sich','Induzierter Strom verstärkt seine Ursache','Induzierter Strom wirkt seiner Ursache entgegen','B ist immer konstant'], correct:2, explanation:'Lenz: Induzierter Strom erzeugt Feld, das der Flussänderung entgegenwirkt (Energieerhaltung!).' },
              { q:'Einheit der magnetischen Flussdichte B?', hint:'1 Tesla = 1 Vs/m²', options:['Ampere','Weber','Tesla','Henry'], correct:2, explanation:'B in Tesla (T) = Vs/m² = kg/(As²).' },
              { q:'Radius r der Kreisbahn eines Elektrons im B-Feld?', hint:'Zentripetalkraft = Lorentzkraft: mv²/r = qvB', options:['r = qB/m','r = mv/(qB)','r = qv/B','r = mB/(qv)'], correct:1, explanation:'mv²/r = qvB → r = mv/(qB).' },
              { q:'Wo wird der Massenspektrometer eingesetzt?', hint:'Isotopentrennung', options:['TV-Gerät','Messung von Radioaktivität','Trennung von Isotopen, Elementanalyse','Stromerzeugung'], correct:2, explanation:'Massenspektrometer: Isotopentrennung (r ∝ m/q), Elementanalyse, Altersbestimmung.' },
            ]
          },
        ]
      },
    ]
  },

  /* =========================================================  KLASSE 13  */
  klasse13: {
    id:'klasse13', num:13, label:'Klasse 13',
    emoji:'🏆', color:['#B45309','#F59E0B'], light:'#FEF3C7',
    tagline:'Abitur: Analysis, Geometrie, Relativitätstheorie und Quantenphysik',
    subjects:[
      {
        id:'mathe', name:'Mathematik', icon:'🔢',
        desc:'Abitur-Vorbereitung: vollständige Analysis, Geometrie und Stochastik',
        color:'#2563EB',
        intro:'Klasse 13 – die Zielgerade zum Abitur! Wir verbinden alle Themen der Oberstufe: vollständige Kurvendiskussion, Integralanwendungen, Raumgeometrie und die Normalverteilung. Ich begleite dich durch jeden Schritt!',
        topics:[
          { name:'Vollständige Kurvendiskussion (Abitur)', diff:3,
            explanation:'Die vollständige Kurvendiskussion ist eine der häufigsten Abituraufgaben in Mathematik – und mit System ist sie lösbar! Checkliste: 1. Definitionsbereich D bestimmen (Ausschluss: Division durch 0, Logarithmus negativer Zahlen). 2. Symmetrie prüfen: f(–x) = f(x) → achsensymmetrisch; f(–x) = –f(x) → punktsymmetrisch. 3. Nullstellen: f(x) = 0 (Ausklammern, pq-Formel, Substitution, Polynomdivision). 4. Ableitungen: f\'(x), f\'\'(x), ggf. f\'\'\'(x). 5. Extrempunkte: f\'(x) = 0 und Vorzeichen von f\'\'(x). 6. Wendepunkte: f\'\'(x) = 0 und Vorzeichenwechsel von f\'\'(x). 7. Asymptoten: horizontale (Verhalten x→±∞), vertikale (Poles), schiefe. 8. Monotoniebereiche aus f\'(x)-Vorzeichen. 9. Krümmungsverhalten aus f\'\'(x)-Vorzeichen. 10. Wertetabelle und sorgfältige Skizze. Tipp: Schreibe jeden Schritt auf, auch wenn er trivial erscheint – Punktabzug droht bei fehlenden Begründungen!' },
          { name:'Integral und Anwendungen im Abitur', diff:3,
            explanation:'Integrale im Abitur gehen über einfaches Ausrechnen hinaus – Anwendungen sind gefragt! Flächeninhalt zwischen Kurve und x-Achse: Null­stellen bestimmen, Integral über jedes Teilintervall separat berechnen, Beträge addieren. Fläche zwischen zwei Kurven: Schnittpunkte = Grenzen, ∫(obere – untere) dx. Mittelwert einer Funktion auf [a,b]: f_M = 1/(b–a) × ∫ₐᵇ f(x) dx. Stammfunktionen besonderer Funktionen: ∫sin(x) dx = –cos(x) + C, ∫cos(x) dx = sin(x) + C, ∫e^x dx = e^x + C, ∫(1/x) dx = ln|x| + C, ∫e^(ax) dx = (1/a)×e^(ax) + C. Partielle Integration: ∫u×v\' dx = u×v – ∫u\'×v dx. Substitution: Ersetze g(x) = u, dx umschreiben. Wirtschaft: Gesamtkosten = ∫Grenzkosten dx, Gewinnmaximierung. Physik: Weg = ∫Geschwindigkeit dt. Das Integral ist ein universelles Werkzeug – es löst Probleme in jeder Wissenschaft!' },
          { name:'Analytische Geometrie – Abstände und Winkel', diff:3,
            explanation:'Im Abitur müssen Abstände und Winkel in 3D-Räumen berechnet werden – die Rechenwege sind klar, aber erfordern Präzision! Abstand Punkt–Punkt: |PQ⃗| = √((x₂–x₁)² + (y₂–y₁)² + (z₂–z₁)²). Abstand Punkt–Gerade: Lotfußpunkt L bestimmen (L liegt auf g, PL⃗ ⊥ r⃗), dann |PL⃗|. Abstand Punkt–Ebene: d = |n⃗·OA⃗ – d| / |n⃗| (bei Koordinatenform ax+by+cz=d). Winkel zwischen zwei Geraden: cos(α) = |r₁⃗·r₂⃗| / (|r₁⃗|×|r₂⃗|). Winkel zwischen Gerade und Ebene: sin(φ) = |r⃗·n⃗| / (|r⃗|×|n⃗|). Winkel zwischen zwei Ebenen: cos(α) = |n₁⃗·n₂⃗| / (|n₁⃗|×|n₂⃗|). Spiegelung: Punkt P an Ebene E spiegeln → Lotfußpunkt L berechnen, P\' = 2L – P. Diese Werkzeuge sind die Grundlage von CAD-Software, 3D-Druckern, Robotersteuerungen und Navigationssystemen!' },
          { name:'Normalverteilung und Konfidenzintervalle', diff:3,
            explanation:'Die Normalverteilung ist das "Universel-Werkzeug" der Statistik – sie beschreibt Körpergrößen, Messfehler, IQ-Werte und unzählige Naturphänomene! Die Normalverteilung N(μ; σ²) hat die glockenförmige Dichte: Symmetrisch um den Mittelwert μ, Standardabweichung σ bestimmt die Breite. Faustregeln: ca. 68% aller Werte liegen in [μ–σ, μ+σ], ca. 95% in [μ–2σ, μ+2σ], ca. 99,7% in [μ–3σ, μ+3σ]. Mit dem Tabellenwerk oder GTR berechnest du P(X ≤ x) für standardisierte Z-Werte: Z = (X–μ)/σ. Konfidenzintervall: Ein Vertrauensbereich für einen unbekannten Parameter. Bei 95%-Konfidenz: μ liegt mit 95% Wahrscheinlichkeit in [x̄ – 1,96×σ/√n, x̄ + 1,96×σ/√n]. Die Binomialverteilung kann für große n durch die Normalverteilung approximiert werden, wenn np > 5 und n(1–p) > 5. Normalverteilung + Hypothesentest + Konfidenzintervalle sind die Grundlage jeder empirischen Forschung, von Medizinstudien bis zu Wahlumfragen!' },
        ],
        exercises:[
          { id:'e1', type:'Analysis', diff:3, title:'Abitur Analysis: Vollständige Kurvendiskussion',
            desc:'Alle Schritte der Kurvendiskussion üben.',
            questions:[
              { q:'f(x) = x³ – 6x² + 9x. Nullstellen?', hint:'Ausklammern: x(x²–6x+9) = x(x–3)²', options:['x=0 und x=3','x=0 und x=6','x=1 und x=3','x=–3 und x=3'], correct:0, explanation:'f(x) = x(x–3)² → x = 0 und x = 3 (doppelte NS).' },
              { q:'f\'(x) = 3x² – 12x + 9 = 0. Lösung?', hint:'x² – 4x + 3 = 0 → (x–1)(x–3) = 0', options:['x=1 und x=3','x=2 und x=6','x=0 und x=4','x=–1 und x=–3'], correct:0, explanation:'f\'=0 → x=1 (Hochpunkt) und x=3 (Tiefpunkt).' },
              { q:'f\'\'(x) = 6x – 12. Bei x=1: Hoch- oder Tiefpunkt?', hint:'f\'\'(1) = 6–12 = –6 < 0', options:['Tiefpunkt','Wendepunkt','Hochpunkt','Sattelunkt'], correct:2, explanation:'f\'\'(1) = –6 < 0 → Hochpunkt (lokales Maximum).' },
              { q:'Wendepunkt: f\'\'(x) = 6x–12 = 0. x=?', hint:'6x = 12', options:['x=1','x=2','x=3','x=6'], correct:1, explanation:'x = 2 → Wendepunkt (Vorzeichenwechsel von f\'\' prüfen!).' },
              { q:'Für welches n → ∞ gilt xⁿ → ∞ für x > 1?', hint:'Beliebige positive Potenz', options:['Nur gerade n','Nur ungerade n','Alle n ∈ ℕ','Kein n'], correct:2, explanation:'Für x > 1 gilt xⁿ → ∞ für alle natürlichen n.' },
              { q:'f(x) = x⁴ – 2x² ist …?', hint:'f(–x) = (–x)⁴ – 2(–x)² = x⁴ – 2x² = f(x)', options:['Ungerade (punktsymm.)','Gerade (achsensymm.)','Weder noch','Periodisch'], correct:1, explanation:'f(–x) = f(x) → gerade Funktion → achsensymmetrisch zur y-Achse.' },
              { q:'Steigung der Tangente an f(x) = x³ bei x = 2?', hint:'f\'(2) = 3×4 = 12', options:['8','12','6','3'], correct:1, explanation:'f\'(x) = 3x², f\'(2) = 12.' },
              { q:'Tangente an f(x)=x²+1 im Punkt (1, 2). Gleichung?', hint:'m = f\'(1) = 2, dann y = mx + b', options:['y = 2x','y = 2x – 1','y = x + 1','y = 2x + 0'], correct:0, explanation:'m=2, Punkt (1,2): 2 = 2×1 + b → b = 0 → y = 2x.' },
            ]
          },
          { id:'e2', type:'Stochastik', diff:3, title:'Normalverteilung und Hypothesentests',
            desc:'Normalverteilung anwenden und Tests durchführen.',
            questions:[
              { q:'N(μ=170, σ=10): Etwa wie viel % der Werte liegen in [160, 180]?', hint:'[μ–σ, μ+σ] enthält ca. 68%', options:['50%','68%','95%','99,7%'], correct:1, explanation:'Ca. 68% liegen im Bereich μ ± σ.' },
              { q:'Z-Standardisierung: Z = ?', hint:'Abweichung vom Mittelwert in Einheiten von σ', options:['Z = (X+μ)/σ','Z = (X–μ)/σ','Z = σ/(X–μ)','Z = X × σ'], correct:1, explanation:'Z = (X–μ)/σ – transformiert auf Standardnormalverteilung N(0,1).' },
              { q:'Signifikanzniveau α = 5% bedeutet …?', hint:'Fehler 1. Art', options:['H₀ wird immer abgelehnt','Wahrscheinlichkeit für Fehler 1. Art = 5%','Test ist 95% richtig','α = 0,95'], correct:1, explanation:'α = 5%: Wenn H₀ gilt, beträgt die Irrtumswahrscheinlichkeit beim Ablehnen 5%.' },
              { q:'Konfidenzintervall 95%: Breite hängt ab von …?', hint:'Stichprobengröße n', options:['Nur von μ','Nur von σ','Von σ und n','Gar nicht'], correct:2, explanation:'Breite ~ σ/√n – größeres n → schmaleres, präziseres Intervall.' },
              { q:'Normalapproximation der Binomialverteilung: wann gültig?', hint:'np > 5 und n(1–p) > 5', options:['Immer','Bei n > 100','Wenn np > 5 und n(1–p) > 5','Nur bei p = 0,5'], correct:2, explanation:'Faustregel: np > 5 und n(1–p) > 5 → Approximation zuverlässig.' },
              { q:'Fehler 2. Art beim Hypothesentest ist …?', hint:'H₀ fälschlicherweise beibehalten', options:['H₀ ablehnen, obwohl richtig','H₁ ablehnen, obwohl H₀ falsch ist','Rechenfehler','Messfehler'], correct:1, explanation:'Fehler 2. Art (β): H₀ beibehalten, obwohl H₁ wahr ist.' },
              { q:'Bei N(0,1): P(Z ≤ 1,96) ≈ ?', hint:'Typischer Wert für 95%-Konfidenz', options:['0,90','0,95','0,975','0,99'], correct:2, explanation:'Φ(1,96) ≈ 0,975, deshalb ±1,96 für 95%-Konfidenzintervall.' },
              { q:'Was testet der linksseitige Hypothesentest?', hint:'H₁: p < p₀', options:['Ob p größer als angenommen','Ob p kleiner als angenommen','Ob p ungleich p₀','Nur Normalverteilungen'], correct:1, explanation:'Linksseitig: H₁: p < p₀; Ablehnungsbereich liegt im linken Schwanz.' },
            ]
          },
          { id:'e3', type:'Geometrie', diff:3, title:'Raumgeometrie – Abstände und Winkel',
            desc:'Abstandsberechnungen und Winkel im 3D-Raum.',
            questions:[
              { q:'Abstand P(1,2,3) zu Q(4,6,3)?', hint:'√((4–1)²+(6–2)²+(3–3)²)', options:['3','4','5','7'], correct:2, explanation:'√(9+16+0) = √25 = 5.' },
              { q:'Winkel zwischen n⃗₁=(1,0,0) und n⃗₂=(0,1,0)?', hint:'cos(α) = n₁·n₂/(|n₁||n₂|) = 0', options:['0°','45°','90°','180°'], correct:2, explanation:'Skalarprodukt = 0 → senkrecht → 90°.' },
              { q:'Spiegelung P an Ebene: wie erhält man P\'?', hint:'L = Lotfußpunkt, P\' = 2L – P', options:['P\' = P + n⃗','P\' = 2L – P','P\' = L + P','P\' = –P'], correct:1, explanation:'P\' = 2×Lotfußpunkt – P.' },
              { q:'Abstand Punkt P(3,0,0) von Ebene x+y+z=6. d=?', hint:'d = |1×3+1×0+1×0–6|/√3 = 3/√3', options:['1','√3','3','3√3'], correct:1, explanation:'d = |3–6|/√(1+1+1) = 3/√3 = √3.' },
              { q:'Winkel zwischen Gerade (r⃗=(1,1,0)) und Ebene (n⃗=(0,0,1))?', hint:'sin(φ) = |r⃗·n⃗|/(|r⃗||n⃗|) = 0', options:['0°','30°','45°','90°'], correct:0, explanation:'r⃗·n⃗ = 0 → sin(φ) = 0 → φ = 0° → Gerade liegt in der Ebene.' },
              { q:'Zwei Ebenen mit Normalenvektoren n⃗₁=(1,0,0) und n⃗₂=(1,0,0): Lage?', hint:'Parallele oder identische Normalenvektoren.', options:['Senkrecht','Parallel oder identisch','Schneidend','Windschief'], correct:1, explanation:'Gleiche Normalenvektoren → Ebenen parallel oder identisch.' },
              { q:'Geradengleichung g: x⃗ = (1,2,3)+t(1,1,1). Liegt P(3,4,5) auf g?', hint:'(3,4,5)=(1,2,3)+t(1,1,1) → t=?', options:['Nein','Ja, t=2','Ja, t=1','Ja, t=3'], correct:1, explanation:'3=1+t → t=2; 4=2+2✓; 5=3+2✓ → P liegt auf g, t=2.' },
              { q:'Lotfußpunkt L von P(0,0,5) auf g: x⃗=(0,0,0)+t(0,0,1)?', hint:'Richtungsvektor (0,0,1): L=(0,0,t). PL⃗=(0,0,t–5)⊥(0,0,1): immer erfüllt → t=5', options:['L=(0,0,0)','L=(0,0,5)','L=(0,0,1)','L=(1,1,5)'], correct:1, explanation:'Gerade entlang z-Achse: t=5 → L=(0,0,5).' },
            ]
          },
        ]
      },
      {
        id:'physik', name:'Physik', icon:'⚡',
        desc:'Relativitätstheorie, Quantenphysik und Elektromagnetismus',
        color:'#0284C7',
        intro:'Klasse 13 Physik – wir erkunden die faszinierendsten Theorien der Wissenschaft: Einsteins Relativitätstheorie, Quantenphysik und die elektromagnetischen Wellen. Diese Themen revolutionierten unser Weltbild!',
        topics:[
          { name:'Spezielle Relativitätstheorie', diff:3,
            explanation:'1905 revolutionierte Albert Einstein die Physik: Die spezielle Relativitätstheorie zeigt, dass Raum und Zeit keine absoluten Größen sind! Zwei Postulate: 1. Die Gesetze der Physik gelten in allen Inertialsystemen gleich. 2. Die Lichtgeschwindigkeit c ≈ 3×10⁸ m/s ist in allen Inertialsystemen gleich (unabhängig von Quelle oder Beobachter!). Konsequenzen: Zeitdilatation: Eine bewegte Uhr geht langsamer! t = t₀ / √(1 – v²/c²). Ein Astronaut, der mit 99% Lichtgeschwindigkeit reist, altert deutlich langsamer als Zurückgebliebene. Längenkontraktion: Bewegte Körper erscheinen in Bewegungsrichtung kürzer: l = l₀ × √(1 – v²/c²). Relativistische Masse: m = m₀ / √(1 – v²/c²). Bei v → c steigt die Masse gegen unendlich – kein Körper mit Masse kann Lichtgeschwindigkeit erreichen! Masse-Energie-Äquivalenz: E = mc². Selbst ruhende Masse enthält unvorstellbar viel Energie – ein Gramm Masse entspricht ca. 9×10¹³ Joule. GPS-Satelliten müssen relativistische Korrekturen einbeziehen, sonst wäre die Positionsgenauigkeit nach einem Tag um Kilometer falsch!' },
          { name:'Quantenphysik und Wellenoptik', diff:3,
            explanation:'Licht ist gleichzeitig Welle und Teilchen – das klingt widersprüchlich, ist aber experimentell bewiesen! Wellenoptik: Interferenz von Licht entsteht, wenn Lichtwellen sich überlagern. Beim Doppelspaltexperiment (Young) entstehen helle und dunkle Streifen. Bedingung konstruktive Interferenz: Gangunterschied Δ = n×λ. Gangunterschied: Δ = g × sin(α), wobei g der Gitterabstand ist. Doppelspalt-Formel: d = L × λ / (g × n) für den n-ten Streifen. Gitterspektroskopie: Ein Beugungsgitter zerlegt weißes Licht in seine Spektralfarben – Grundlage der Spektroskopie. Quantenphysik: Das Photoelektrische Effekt zeigt: Licht überträgt Energie in Paketen (Quanten/Photonen). Energie eines Photons: E = h × f = h × c / λ (h = 6,626 × 10⁻³⁴ Js, Plancksches Wirkungsquantum). Compton-Effekt: Photon überträgt Impuls auf Elektron. De-Broglie-Wellenlänge von Teilchen: λ = h/p = h/(mv). Selbst Elektronen, Protonen und Moleküle zeigen Wellenverhalten! Quantenmechanik revolutionierte unser Weltbild: Teilchen haben keine eindeutige Position, nur Aufenthaltswahrscheinlichkeiten!' },
          { name:'Elektromagnetische Wellen und Licht', diff:3,
            explanation:'Radio, TV, WLAN, Handy, Infrarot-Fernbedienung, sichtbares Licht, Röntgen und Gammastrahlung – das alles sind elektromagnetische Wellen! Sie alle sind im Grunde dasselbe Phänomen mit unterschiedlichen Frequenzen. Entstehung: Beschleunigte elektrische Ladungen senden elektromagnetische Wellen aus. Das Wechselspiel von elektrischem (E⃗) und magnetischem Feld (B⃗) erhält sich selbst – die Welle breitet sich ohne Medium aus. Alle EM-Wellen breiten sich im Vakuum mit c ≈ 3×10⁸ m/s aus. Das Spektrum (geordnet nach Frequenz/Energie): Radiowellen (f < 10⁹ Hz), Mikrowellen, Infrarot, sichtbares Licht (400–700 nm), UV, Röntgen, Gamma (E > 10 keV). Strahlungsgesetze: Jeder Körper strahlt als Wärmestrahlung (Schwarzkörperstrahlung). Wien\'sches Verschiebungsgesetz: λ_max × T = 2,898 mm×K (heiß = kurzwellig = weiß/blau, kalt = langwellig = rot/IR). Stefan-Boltzmann: P = σ × A × T⁴. So bestimmt man Oberflächentemperaturen von Sternen und die Energiebilanz der Erde!' },
          { name:'Atomphysik und Bohrsches Atommodell', diff:3,
            explanation:'Wie entstehen die bunten Leuchtfarben in Neonreklamen und Feuerwerk? Das Bohrsche Atommodell erklärt es! Rutherford zeigte: Fast alle Masse des Atoms ist im winzigen Kern (Radius ~10⁻¹⁵ m) konzentriert – das Atom selbst ist 100.000-mal größer (~10⁻¹⁰ m). Bohrsches Atommodell (1913): Elektronen umkreisen den Kern nur auf bestimmten erlaubten Bahnen (Energieniveaus). Auf diesen Bahnen strahlen sie keine Energie ab. Beim Übergang von höheren zu niedrigeren Niveaus wird ein Photon emittiert: E_Photon = E_höher – E_tiefer = h × f. Beim Übergang von niedrig zu hoch wird ein Photon absorbiert. Dadurch entstehen diskrete Spektrallinien – jedes Element hat sein einzigartiges "Fingerabdruck-Spektrum". Quantenzahlen im modernen Atommodell: Hauptquantenzahl n (Schale), Nebenquantenzahl l (Unterschale), Magnetquantenzahl m_l, Spinquantenzahl m_s. Pauli-Prinzip: Keine zwei Elektronen dürfen dieselben vier Quantenzahlen haben – daraus folgt der Aufbau des Periodensystems! Laser-Prinzip: stimulierte Emission bringt Photonen in Phase (kohärentes Licht).' },
        ],
        exercises:[
          { id:'e1', type:'Relativität', diff:3, title:'Spezielle Relativitätstheorie',
            desc:'Zeitdilatation, Längenkontraktion und E=mc².',
            questions:[
              { q:'Ein Raumschiff fliegt mit v = 0,6c. Lorentzfaktor γ = 1/√(1–0,36) = ?', hint:'√(1–0,36) = √0,64 = 0,8', options:['0,8','1,0','1,25','1,5'], correct:2, explanation:'γ = 1/0,8 = 1,25.' },
              { q:'Eigenzeit t₀ = 10 Jahre, v = 0,6c, γ = 1,25. Wie lange dauert Reise auf Erde?', hint:'t = γ × t₀', options:['8 Jahre','10 Jahre','12,5 Jahre','25 Jahre'], correct:2, explanation:'t = 1,25 × 10 = 12,5 Jahre (Zeitdilatation).' },
              { q:'E = mc². Energie von m = 1g Masse? (c = 3×10⁸ m/s)', hint:'E = 0,001 × (3×10⁸)²', options:['3×10⁵ J','9×10¹³ J','3×10¹⁰ J','9×10¹⁶ J'], correct:1, explanation:'E = 10⁻³ × 9×10¹⁶ = 9×10¹³ J.' },
              { q:'Kann ein Körper mit Masse je Lichtgeschwindigkeit erreichen?', hint:'Masse → ∞ bei v → c', options:['Ja, mit genug Energie','Nein, Masse würde unendlich','Ja, im Vakuum','Nein, wegen Reibung'], correct:1, explanation:'Relativistische Masse m = m₀/√(1–v²/c²) → ∞ für v → c.' },
              { q:'Wozu müssen GPS-Satelliten Relativitätskorrekturen machen?', hint:'Bewegung und Gravitationspotential', options:['Schlechter Empfang','Zeitdilatation durch Bewegung und Gravitation verändert Takt der Uhren','GPS-Signale sind Lichtwellen','Satelliten sind zu weit weg'], correct:1, explanation:'Ohne Relativitätskorrekturen (SRT+ART) wäre GPS täglich ~10 km ungenau.' },
              { q:'Ruhende Länge l₀ = 100m, v = 0,8c, γ = 1/0,6. Gemessene Länge l?', hint:'l = l₀/γ = l₀ × √(1–v²/c²)', options:['40 m','60 m','80 m','125 m'], correct:1, explanation:'l = 100 × 0,6 = 60 m (Längenkontraktion).' },
              { q:'Welche Größe bleibt für alle Beobachter gleich (Relativitätstheorie)?', hint:'2. Postulat Einstein', options:['Masse','Zeit','Länge','Lichtgeschwindigkeit c'], correct:3, explanation:'c = 299.792.458 m/s ist für alle Beobachter identisch – unabhängig von Bewegung.' },
              { q:'Was ist das Zwillingsparadoxon?', hint:'Einer reist mit v ~ c und kommt jünger zurück.', options:['Zwillinge können nicht unterschieden werden','Reisender Zwilling altert langsamer','Beide altern gleich schnell','Keine Zeitunterschiede möglich'], correct:1, explanation:'Reisender Zwilling ist bei Rückkehr jünger (Zeitdilatation ist real und asymmetrisch).' },
            ]
          },
          { id:'e2', type:'Quantenphysik', diff:3, title:'Quantenphysik und Wellenoptik',
            desc:'Photonen, de-Broglie und Interferenz.',
            questions:[
              { q:'Energie eines Photons: E = ? (h = 6,6×10⁻³⁴ Js, f = 5×10¹⁴ Hz)', hint:'E = h × f', options:['3,3×10⁻¹⁹ J','6,6×10⁻²⁰ J','3,3×10⁻²⁰ J','6,6×10⁻¹⁹ J'], correct:0, explanation:'E = 6,6×10⁻³⁴ × 5×10¹⁴ = 3,3×10⁻¹⁹ J.' },
              { q:'Photoelektrischer Effekt: Was beobachtet man?', hint:'Einstein: Nobelpreis 1921', options:['Licht wird gebeugt','Licht schlägt Elektronen aus Metall heraus','Elektronen erzeugen Licht','Lichtwellen werden reflektiert'], correct:1, explanation:'Licht (Photonen) schlägt Elektronen aus Metall. Zeigt Teilchennatur des Lichts.' },
              { q:'de-Broglie-Wellenlänge: λ = ? (p = Impuls)', hint:'λ = h/p', options:['λ = hp','λ = h/p','λ = p/h','λ = h×c/p'], correct:1, explanation:'λ = h/p – auch Teilchen haben Welleneigenschaften!' },
              { q:'Beim Doppelspalt (Young): Wann ist konstruktive Interferenz?', hint:'Gangunterschied = ganzzahliges Vielfaches von λ', options:['Δ = λ/2','Δ = n×λ','Δ = (n+½)×λ','Δ = n²×λ'], correct:1, explanation:'Δ = n×λ → Wellenberge überlagern sich konstruktiv.' },
              { q:'Was ist das Wellenpaket-Modell in der Quantenmechanik?', hint:'Teilchen = Wellenpakete im Raum', options:['Teilchen sind klassische Kugeln','Teilchen können als lokalisierte Wellenpakete beschrieben werden','Wellen haben keine Teilcheneigenschaften','Photonen haben keine Wellenlänge'], correct:1, explanation:'Quantenmechanik: Teilchen und Wellen sind zwei Seiten derselben Münze (Welle-Teilchen-Dualismus).' },
              { q:'Plancksches Wirkungsquantum h ≈ ?', hint:'h = 6,626 × 10⁻³⁴ Js', options:['6,626×10⁻³⁴ Js','3×10⁸ m/s','9,11×10⁻³¹ kg','1,6×10⁻¹⁹ C'], correct:0, explanation:'h ≈ 6,626×10⁻³⁴ Js – fundamentale Naturkonstante der Quantenphysik.' },
              { q:'Laserlich ist kohärent. Das bedeutet …?', hint:'Alle Photonen in Phase', options:['Sehr hell','Alle Photonen haben gleiche Phase, Frequenz und Richtung','Alle Photonen haben verschiedene Frequenzen','Energiereicher als normales Licht'], correct:1, explanation:'Kohärentes Licht: alle Photonen in Phase, gleiche Frequenz und Richtung – ermöglicht Interferenz über große Distanzen.' },
              { q:'Heisenbergsche Unschärferelation: Was gilt?', hint:'Δx × Δp ≥ h/(4π)', options:['Ort und Impuls gleichzeitig genau messbar','Δx×Δp ≥ ħ/2 – Ort und Impuls nicht gleichzeitig beliebig genau','Nur für große Objekte','Nur bei hohen Temperaturen'], correct:1, explanation:'Je genauer der Ort bekannt, desto ungenauer der Impuls und umgekehrt – grundlegendes Prinzip der Quantenmechanik.' },
            ]
          },
          { id:'e3', type:'Atomphysik', diff:3, title:'Bohrsches Atommodell und Spektren',
            desc:'Energieniveaus, Spektrallinien und Quantenzahlen.',
            questions:[
              { q:'Beim Übergang von Energieniveau E₃ auf E₁ (E₃ > E₁): Was passiert?', hint:'Energie wird freigesetzt.', options:['Photon wird absorbiert','Photon wird emittiert','Keine Energieänderung','Elektron verlässt Atom'], correct:1, explanation:'Energiereicher → energiearm: Photon mit E = E₃ – E₁ wird emittiert (Licht!).' },
              { q:'Energie des emittierten Photons bei Übergang 5eV → 2eV?', hint:'E_Photon = ΔE', options:['7 eV','3 eV','2 eV','5 eV'], correct:1, explanation:'E_Photon = 5 – 2 = 3 eV.' },
              { q:'Was ist das Pauli-Prinzip?', hint:'Quantenzahlen', options:['Elektronen stoßen sich ab','Keine zwei Elektronen mit gleichen Quantenzahlen','Elektronen bewegen sich um den Kern','Kern ist positiv geladen'], correct:1, explanation:'Pauli-Prinzip: Keine zwei Elektronen in einem Atom dürfen identische Quantenzahlen haben – erklärt Periodensystem.' },
              { q:'Warum hat jedes Element ein einzigartiges Spektrum?', hint:'Energieniveaus sind elementspezifisch', options:['Verschiedene Massen','Verschiedene Energieniveauabstände → einzigartige Spektrallinien','Verschiedene Temperaturen','Verschiedene Ladungen'], correct:1, explanation:'Energieniveaus sind charakteristisch für jedes Element → Spektrum = "Fingerabdruck".' },
              { q:'Wie groß ist ein Atom im Vergleich zum Kern?', hint:'Kern: ~10⁻¹⁵ m, Atom: ~10⁻¹⁰ m', options:['Gleich groß','Atom ist ca. 100× größer','Atom ist ca. 100.000× größer','Atom ist kleiner als Kern'], correct:2, explanation:'Atom ~10⁻¹⁰ m, Kern ~10⁻¹⁵ m → 10⁵ = 100.000-fach!' },
              { q:'Was ist stimulierte Emission (Grundlage des Lasers)?', hint:'Photon trifft angeregtes Atom.', options:['Spontane Lichtemission','Ein Photon erzeugt Emission eines zweiten phasengleichen Photons','Absorption von Photonen','Thermische Strahlung'], correct:1, explanation:'Stimulierte Emission: eintreffendes Photon regt Aussendung eines phasengleichen Photons an → Grundlage des Lasers.' },
              { q:'Hauptquantenzahl n = 1 beschreibt …?', hint:'Erste Schale, am nächsten am Kern.', options:['Äußerste Schale','Innerste Schale (niedrigstes Energieniveau)','Valenzelektronen','Freie Elektronen'], correct:1, explanation:'n = 1 = K-Schale, niedrigste Energie, am nächsten am Kern.' },
              { q:'Welches Modell ersetzte das Bohrsche Atommodell?', hint:'Schrödinger, Heisenberg', options:['Rutherford-Modell','Quantenmechanisches Orbitalmodell','Thomsonsches Modell','Keplersches Modell'], correct:1, explanation:'Quantenmechanisches Orbitalmodell (Schrödinger-Gleichung) beschreibt Aufenthaltswahrscheinlichkeiten statt fester Bahnen.' },
            ]
          },
        ]
      },
    ]
  },

};
