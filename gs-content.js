/* ============================================================
   LernStar – Grundschule Content (Klasse 1–4)
   NRW Lehrplan Mathematik (Corrigenda 18.03.2025)
   Modulgenerator-Struktur: 10 Lernschritte pro Thema
   ============================================================ */

const GS_CONTENT = {

  /* ========================  KLASSE 1  ======================== */
  klasse1: {
    id:'klasse1', num:1, label:'Klasse 1', emoji:'🌱',
    color:['#EC4899','#F9A8D4'], light:'#FCE7F3',
    tagline:'Meine ersten Schritte in der Mathematik',
    subjects:[{
      id:'mathe', name:'Mathematik', icon:'🔢',
      desc:'Zahlen bis 20, erstes Rechnen, geometrische Formen',
      color:'#EC4899',
      intro:'Hallo! Ich bin Herr Lala, dein Mathe-Freund. In Klasse 1 lernst du Zahlen bis 20 kennen, rechnest zum ersten Mal und entdeckst Formen. Ich begleite dich bei jedem Schritt – fang einfach an!',
      topics:[
        { isChapter:true, name:'📚 Zahlen und Operationen' },
        {
          name:'Zahlen bis 20', diff:1,
          kompetenz:'Ich kann Zahlen von 1 bis 20 zählen, lesen, schreiben und ordnen.',
          explanation:'Zahlen begegnen dir überall: auf Hausnummern, Buslinien oder beim Würfeln. Die Zahlen 1 bis 20 lernst du Schritt für Schritt kennen. Erst kommt 1, dann 2, dann 3 – und so weiter bis 20. Nach der 9 kommt die 10, die erste Zahl mit zwei Stellen. Die 11 heißt „elf", die 12 „zwölf" – das sind Sonderformen! Ab 13 wird es einfacher: drei-zehn, vier-zehn, fünf-zehn... bis neun-zehn. Und dann kommt die 20, die „zwanzig". Auf dem Zahlenstrahl stehen alle Zahlen der Reihe nach – je weiter rechts, desto größer die Zahl.',
          vorwissen:['Kannst du schon bis 10 zählen?','Wie viele Finger hat eine Hand?','Was kommt nach der Zahl 9?'],
          merksatz:'11 = elf, 12 = zwölf – die klingen anders! 13 bis 19 enden alle auf "-zehn".',
          beispiele:['12 Eier in einer Packung','20 Kinder sitzen im Klassenraum','Hausnummer 17'],
          gegenbeispiele:['100 ist viel mehr als 20','0 kommt vor der 1'],
          typischeFehler:['11 heißt "elf", nicht "einzehn"','12 heißt "zwölf", nicht "zwölfzehn"','Bei 16 sagt man "sechzehn" (nicht "sechszehn")'],
          videoskript:'Szene 1 – Titel: "Zahlen bis 20". Herr Lala zeigt einen Zahlenstrahl von 0 bis 20. Er tippt auf jede Zahl und spricht sie laut aus: "Eins, zwei, drei..." Szene 2 – Herr Lala legt 12 Murmeln in eine Reihe. "Das sind zwölf Murmeln – ich schreibe eine 1 und eine 2: 12." Szene 3 – Zahlenstrahl: "Links = klein, rechts = groß. Die 15 ist größer als die 8, weil sie weiter rechts steht." Szene 4 – Merksatz einblenden: "11=elf, 12=zwölf – merkt euch das!"',
          transfer:{ aufgabe:'Zähle alle Stühle in deinem Zimmer oder in der Küche. Schreibe die Zahl auf und male so viele Punkte, wie du Stühle gezählt hast.', kontext:'Zählen im Alltag', tipp:'Tippe mit dem Finger auf jeden Stuhl und zähle laut mit.' }
        },
        {
          name:'Plus und Minus bis 10', diff:1,
          kompetenz:'Ich kann Additions- und Subtraktionsaufgaben bis 10 lösen.',
          explanation:'Wenn du 3 Äpfel hast und 2 dazubekommst, hast du 3 + 2 = 5 Äpfel. Das Pluszeichen (+) bedeutet: dazunehmen. Wenn du 5 Äpfel hast und 2 davon aufisst, bleiben 5 − 2 = 3 übrig. Das Minuszeichen (−) bedeutet: wegnehmen. Du kannst dir die Rechenaufgaben mit Gegenständen vorstellen oder an den Fingern abzählen. Wichtige Sätze, die du auswendig können solltest: 1+1=2, 2+2=4, 5+5=10. Und: Subtraktion ist das Umkehren der Addition – wenn 3+2=5, dann ist auch 5−2=3 richtig!',
          vorwissen:['Weißt du, was "dazunehmen" bedeutet?','Kannst du bis 10 zählen?','Was bedeutet das Zeichen "+"?'],
          merksatz:'Plus = dazunehmen → Ergebnis wird größer. Minus = wegnehmen → Ergebnis wird kleiner.',
          beispiele:['4 + 3 = 7 (vier Kinder, drei kommen dazu)','8 − 5 = 3 (acht Bonbons, fünf gegessen)'],
          gegenbeispiele:['Minus macht nie eine größere Zahl (wenn wir im positiven Bereich bleiben)'],
          typischeFehler:['Bei 7−3 manchmal fälschlich 3 statt 4','Das Ergebnis nie vergessen hinzuschreiben'],
          videoskript:'Szene 1 – Tisch mit 4 Äpfeln. Herr Lala legt 3 weitere dazu. "4 plus 3 – ich zähle weiter: 5, 6, 7! Das Ergebnis ist 7." Szene 2 – 8 Murmeln, 5 werden weggenommen. "8 minus 5 – ich zähle zurück: 7, 6, 5, 4, 3. Ergebnis: 3." Szene 3 – Einblendung: Rechenhaus mit 5 oben, 2 und 3 unten. "2+3=5 und 3+2=5 – die Reihenfolge ist egal beim Plus!"',
          transfer:{ aufgabe:'Leg 6 Buntstifte auf den Tisch. Gib 4 davon weg. Wie viele bleiben? Schreibe die Rechnung auf: 6 − 4 = ?', kontext:'Rechnen mit Gegenständen', tipp:'Du kannst die Stifte auch zählen, die weggegeben wurden.' }
        },
        { isChapter:true, name:'📚 Raum und Form' },
        {
          name:'Geometrische Grundformen', diff:1,
          kompetenz:'Ich kann Kreis, Dreieck, Rechteck und Quadrat erkennen und benennen.',
          explanation:'Überall um dich herum findest du geometrische Formen. Ein Kreis ist rund – wie ein Ball, eine Münze oder die Sonne. Ein Dreieck hat drei Ecken und drei Seiten – wie ein Dach. Ein Rechteck hat vier Ecken und vier Seiten, wobei gegenüberliegende Seiten gleich lang sind – wie ein Buch oder ein Tisch. Ein Quadrat ist ein besonderes Rechteck: alle vier Seiten sind gleich lang – wie ein Würfel von oben. Eine Ecke ist ein Punkt, wo zwei Seiten zusammenkommen. Eine Seite ist eine gerade Linie zwischen zwei Ecken.',
          vorwissen:['Was ist ein Kreis?','Kennst du andere Formen in deiner Umgebung?','Was ist eine Ecke?'],
          merksatz:'Dreieck = 3 Seiten, 3 Ecken. Viereck = 4 Seiten, 4 Ecken. Kreis = rund, keine Ecken.',
          beispiele:['Pizza = Kreis','Dachform = Dreieck','Fenster = Rechteck','Scrabble-Stein = Quadrat'],
          gegenbeispiele:['Eine Wolke ist keine geometrische Grundform','Ein Stern ist kein Dreieck'],
          typischeFehler:['Quadrat und Rechteck werden verwechselt: Quadrat hat ALLE Seiten gleich lang','Ein Dreieck muss nicht gleichseitig sein'],
          videoskript:'Szene 1 – Herr Lala zeigt 4 Karten mit den Formen. "Das ist ein Kreis – rund, keine Ecken." Szene 2 – "Das ist ein Dreieck – ich zähle: 1, 2, 3 Ecken, 1, 2, 3 Seiten." Szene 3 – "Rechteck: 4 Ecken, die langen Seiten sind gleich." Szene 4 – "Quadrat: wie Rechteck, aber ALLE vier Seiten gleich lang."',
          transfer:{ aufgabe:'Geh durch dein Zimmer und suche: 1 Gegenstand mit Kreisform, 1 mit Rechteckform, 1 mit Quadratform. Schreibe auf, was du gefunden hast.', kontext:'Formen in der Umwelt', tipp:'Schau auf Fenster, Bilder, Uhren, Bücher.' }
        }
      ],
      exercises:[
        {
          id:'e1', type:'Zahlen', diff:1, title:'Zahlen bis 20',
          desc:'Übe das Zählen, Lesen und Vergleichen von Zahlen bis 20.',
          ersteAnwendung:[
            { aufgabe:'Welche Zahl kommt nach der 14?', loesung:'15', hinweis:'Zähle einen Schritt weiter!' },
            { aufgabe:'Was ist mehr: 12 oder 17?', loesung:'17', hinweis:'Auf dem Zahlenstrahl ist rechts mehr.' },
            { aufgabe:'Schreibe die Zahl "zwölf" als Ziffer.', loesung:'12', hinweis:'Zwölf = 1 Zehner und 2 Einer.' }
          ],
          questions:[
            { q:'Welche Zahl kommt nach der 15?', hint:'Zähle einen weiter.', options:['14','16','17','13'], correct:1, explanation:'15 + 1 = 16.' },
            { q:'Was ist größer: 11 oder 18?', hint:'Weiter rechts auf dem Zahlenstrahl = größer.', options:['11','18','Beide gleich','Kann man nicht sagen'], correct:1, explanation:'18 > 11, weil 18 weiter rechts steht.' },
            { q:'Wie heißt die Zahl 12?', hint:'Diese Zahl klingt anders als erwartet!', options:['zwölfzehn','einzehn','zwölf','zehnzwei'], correct:2, explanation:'12 heißt "zwölf" – ein Sonderwort!' },
            { q:'Welche Zahl liegt zwischen 9 und 11?', hint:'Es ist genau eine Zahl dazwischen.', options:['8','10','12','13'], correct:1, explanation:'9, 10, 11 – die 10 liegt genau dazwischen.' },
            { q:'Wie viele Murmeln sind das: ●●●●●●●●●●●●●●●?', hint:'Zähle die Punkte.', options:['13','14','15','16'], correct:2, explanation:'15 Punkte = 15 Murmeln.' },
            { q:'Was kommt vor der 20?', hint:'Gehe einen Schritt zurück.', options:['21','19','18','17'], correct:1, explanation:'19 ist der Vorgänger von 20.' },
            { q:'Ordne von klein nach groß: 17, 11, 14. Was steht an erster Stelle?', hint:'Kleinstes zuerst!', options:['17','11','14','12'], correct:1, explanation:'11 ist die kleinste der drei Zahlen.' },
            { q:'Wie schreibt man "neunzehn"?', hint:'Neun + zehn.', options:['91','90','19','17'], correct:2, explanation:'neunzehn = 19 (1 Zehner, 9 Einer).' }
          ],
          minidiagnose:[
            { q:'Was ist die Zahl nach 18?', options:['17','19','20','16'], correct:1 },
            { q:'Welche Zahl ist kleiner: 15 oder 7?', options:['15','7','Beide gleich','Weiß nicht'], correct:1 },
            { q:'Wie heißt die Zahl 11?', options:['einzehn','einelf','elf','zehnein'], correct:2 },
            { q:'Was kommt zwischen 13 und 15?', options:['12','14','16','13'], correct:1 },
            { q:'Schreibe "zwanzig" als Zahl. Was ist richtig?', options:['22','21','12','20'], correct:3 }
          ],
          kompetenznachweis:[
            { q:'Wie viele Zähne zeigt die Grafik? ●●●●●●●●●●●●', options:['10','11','12','13'], correct:2 },
            { q:'Was ist der Vorgänger von 16?', options:['17','15','14','13'], correct:1 },
            { q:'Welche Reihenfolge ist richtig (klein→groß)?', options:['20,15,10,5','5,10,15,20','10,20,5,15','15,5,10,20'], correct:1 },
            { q:'Wie schreibt man "dreizehn"?', options:['31','30','13','3'], correct:2 },
            { q:'Was liegt zwischen 7 und 9?', options:['6','10','8','11'], correct:2 }
          ]
        },
        {
          id:'e2', type:'Rechnen', diff:1, title:'Plus und Minus bis 10',
          desc:'Löse einfache Additions- und Subtraktionsaufgaben.',
          ersteAnwendung:[
            { aufgabe:'Rechne: 3 + 4 = ?', loesung:'7', hinweis:'Zähle von 3 aus vier Schritte weiter.' },
            { aufgabe:'Rechne: 8 − 3 = ?', loesung:'5', hinweis:'Zähle von 8 aus drei Schritte zurück.' },
            { aufgabe:'Hast du 5 Bonbons und bekommst 4 dazu – wie viele hast du?', loesung:'9', hinweis:'5 + 4 = ?' }
          ],
          questions:[
            { q:'Was ergibt 4 + 3?', hint:'Zähle von 4 aus weiter: 5, 6, 7.', options:['6','7','8','5'], correct:1, explanation:'4 + 3 = 7.' },
            { q:'Was ergibt 9 − 4?', hint:'Von 9 rückwärts: 8, 7, 6, 5.', options:['4','6','5','3'], correct:2, explanation:'9 − 4 = 5.' },
            { q:'Was ergibt 6 + 4?', hint:'6 und 4 zusammen machen 10.', options:['9','11','10','8'], correct:2, explanation:'6 + 4 = 10.' },
            { q:'Was ergibt 7 − 3?', hint:'Von 7 rückwärts drei Schritte.', options:['3','5','4','6'], correct:2, explanation:'7 − 3 = 4.' },
            { q:'2 + 2 + 2 = ?', hint:'Dreimal zwei.', options:['4','5','6','8'], correct:2, explanation:'2+2+2 = 6.' },
            { q:'Wenn 3 + 5 = 8, was ist dann 8 − 5?', hint:'Subtraktion kehrt die Addition um.', options:['4','3','2','5'], correct:1, explanation:'8 − 5 = 3 (Umkehraufgabe).' },
            { q:'Lisa hat 10 Äpfel und gibt 6 ab. Wie viele bleiben?', hint:'10 minus 6.', options:['5','3','4','6'], correct:2, explanation:'10 − 6 = 4.' },
            { q:'Was ergibt 5 + 5?', hint:'Fünf und fünf – beide Hände!', options:['9','10','11','8'], correct:1, explanation:'5 + 5 = 10.' }
          ],
          minidiagnose:[
            { q:'3 + 4 = ?', options:['6','7','8','5'], correct:1 },
            { q:'10 − 3 = ?', options:['6','8','7','5'], correct:2 },
            { q:'Was ist 2 + 7?', options:['8','10','9','11'], correct:2 },
            { q:'Toni hat 6 Buntstifte und verliert 2. Wie viele hat er noch?', options:['3','5','4','8'], correct:2 },
            { q:'Welche Aufgabe ergibt 8?', options:['3+4','5+4','6+3','2+5'], correct:1 }
          ],
          kompetenznachweis:[
            { q:'7 + 2 = ?', options:['8','10','9','11'], correct:2 },
            { q:'9 − 6 = ?', options:['2','4','3','5'], correct:2 },
            { q:'Was fehlt? 5 + ? = 9', options:['3','5','4','6'], correct:2 },
            { q:'Mia hat 8 Murmeln und gibt 3 ab. Dann bekommt sie 2 zurück. Wie viele hat sie?', options:['5','6','7','8'], correct:2 },
            { q:'Welche Aufgabe stimmt?', options:['4+6=9','3+8=10','5+5=10','7+2=8'], correct:2 }
          ]
        }
      ]
    }]
  },

  /* ========================  KLASSE 2  ======================== */
  klasse2: {
    id:'klasse2', num:2, label:'Klasse 2', emoji:'⭐',
    color:['#F59E0B','#FCD34D'], light:'#FEF3C7',
    tagline:'Zahlen bis 100 und das Einspluseins',
    subjects:[{
      id:'mathe', name:'Mathematik', icon:'🔢',
      desc:'Zahlen bis 100, Einspluseins, Messen, Zeit und Geld',
      color:'#D97706',
      intro:'Klasse 2 bringt neue Herausforderungen! Wir zählen jetzt bis 100, lernen das Einspluseins und messen Längen. Mit Herr Lala wird alles klar!',
      topics:[
        { isChapter:true, name:'📚 Zahlen und Operationen' },
        {
          name:'Zahlen bis 100', diff:1,
          kompetenz:'Ich kann Zahlen bis 100 lesen, schreiben, vergleichen und auf dem Zahlenstrahl einordnen.',
          explanation:'Unser Zahlsystem ist nach Zehnern aufgebaut. 10 Einer ergeben 1 Zehner. Die Zahl 47 besteht aus 4 Zehnern (= 40) und 7 Einern. Das nennt man den Stellenwert. Mit dem Zahlenstrahl von 0 bis 100 kannst du Zahlen vergleichen und ordnen: Die 63 liegt zwischen 60 und 70, näher an 60. Vorgänger und Nachfolger: Der Vorgänger von 47 ist 46, der Nachfolger ist 48. Zahlen vergleichen: 38 < 45, weil bei den Zehnern 3 < 4.',
          vorwissen:['Kannst du bis 20 zählen?','Was ist ein Zehner?','Was bedeutet < und >?'],
          merksatz:'Erste Stelle (von links) = Zehner, zweite Stelle = Einer. 47 = 4 Zehner und 7 Einer.',
          beispiele:['75 = siebzig + fünf = 7 Zehner + 5 Einer','100 = hundert = 10 Zehner'],
          gegenbeispiele:['09 schreibt man als 9 (keine führende Null)'],
          typischeFehler:['51 und 15 werden verwechselt (Zehner und Einer tauschen)','Bei 30+7 schreibt man 37, nicht 307'],
          videoskript:'Szene 1 – Bündel: 10 Stäbchen gebündelt = 1 Zehner. Herr Lala: "4 Bündel = 40, plus 7 einzelne = 47." Szene 2 – Zahlenstrahl 0-100: "Die 47 liegt zwischen 40 und 50, näher an 50." Szene 3 – Vergleich: "38 oder 45? Schau zuerst die Zehner: 3 < 4, also ist 38 kleiner."',
          transfer:{ aufgabe:'Lies die Hausnummern auf deiner Straße. Welche ist die größte, welche die kleinste? Schreibe sie auf und ordne sie.', kontext:'Zahlen im Alltag', tipp:'Schreib die Zahlen untereinander und vergleiche die Zehner.' }
        },
        {
          name:'Das kleine Einspluseins', diff:1,
          kompetenz:'Ich kenne alle Aufgaben des kleinen Einspluseins automatisiert (bis 10+10).',
          explanation:'Das Einspluseins sind alle Additionsaufgaben von 0+0 bis 10+10. Du solltest sie auswendig kennen, damit du schnell und sicher rechnen kannst. Wichtige Kernaufgaben: Verdopplungen (3+3=6, 4+4=8, 5+5=10). Zehnerergänzungen: 7+3=10, 8+2=10, 9+1=10. Umkehraufgaben: Wenn du 4+7=11 weißt, kennst du auch 7+4=11. Übungsregel: Übe täglich 5 Minuten das Einspluseins – mit Karten, App oder laut sprechen.',
          vorwissen:['Kannst du bis 20 zählen?','Was ergibt 5+5?','Was ergibt 8+2?'],
          merksatz:'Verdopplungen auswendig können! 1+1=2, 2+2=4, 3+3=6, 4+4=8, 5+5=10.',
          beispiele:['6+7=13 (6+6=12, dann +1=13)','9+4=13 (9+1=10, dann +3=13)'],
          gegenbeispiele:['Das Einspluseins endet bei 10+10=20'],
          typischeFehler:['6+7 und 7+6 ergeben das Gleiche (Kommutativgesetz!)','8+5: erst 8→10 (+2), dann +3=13'],
          videoskript:'Szene 1 – Einspluseins-Tabelle erscheint. "Schau die Diagonale an – das sind die Verdopplungen!" Szene 2 – Strategie: "Bei 8+6: Ich gehe erst zur 10 → 8+2=10, dann noch 4 dazu → 14." Szene 3 – Aufgabenkarten werden schnell aufgedeckt: "Übe täglich – dann weißt du die Aufgaben aus dem Kopf!"',
          transfer:{ aufgabe:'Schreibe alle Verdopplungsaufgaben auf: 1+1, 2+2, bis 10+10. Lerne sie auswendig und frage jemanden, dich abzufragen.', kontext:'Schnelles Kopfrechnen', tipp:'Karte schreiben und täglich üben!' }
        },
        {
          name:'Addieren und Subtrahieren bis 100', diff:2,
          kompetenz:'Ich kann Additions- und Subtraktionsaufgaben bis 100 rechnen.',
          explanation:'Im Zahlenraum bis 100 gibt es viele Strategien: Schrittweise: 47 + 36 → erst +30 = 77, dann +6 = 83. Stellenweise: 47 + 36 → Zehner: 40+30=70, Einer: 7+6=13, zusammen 83. Hilfsaufgaben: 48 + 35 → 50+35=85, dann −2=83. Beim Subtrahieren: 73 − 28 → schrittweise: 73−20=53, 53−8=45. Tipp: Überschlag – 47+36 ≈ 50+35=85, also ungefähr 83.',
          vorwissen:['Was sind Zehner und Einer?','Kannst du bis 100 zählen?','Was ergibt 30+40?'],
          merksatz:'Schrittweise oder stellenweise rechnen – such dir eine Strategie und bleib dabei!',
          beispiele:['56+27: 56+20=76, 76+7=83','64−38: 64−30=34, 34−8=26'],
          gegenbeispiele:['Nicht immer ist der Übertrag nötig – manchmal passt es glatt'],
          typischeFehler:['Bei Subtraktion: 45−27 nicht als 47−25 rechnen','Übertrag vergessen bei Einer ≥10'],
          videoskript:'Szene 1 – Zahlenstrahl: 47+36. "Erst ein großer Sprung +30 = 77, dann +6 = 83." Szene 2 – Stellenwert-Methode: "Zehner extra, Einer extra, dann zusammenführen." Szene 3 – Tipps gegen Fehler: "Überschlag macht! 47+36 ≈ 50+40=90. Mein Ergebnis liegt bei 83 – das passt!"',
          transfer:{ aufgabe:'Du hast 65 Cent und kaufst ein Heft für 38 Cent. Wie viel Geld hast du noch übrig? Rechne den Weg auf.', kontext:'Geld im Alltag', tipp:'Schrittweise: 65−30=35, 35−8=27.' }
        },
        { isChapter:true, name:'📚 Größen und Messen' },
        {
          name:'Längen, Uhrzeit und Geld', diff:1,
          kompetenz:'Ich kann Längen mit dem Lineal messen, einfache Uhrzeiten ablesen und mit Geld rechnen.',
          explanation:'Längen: 1 Meter = 100 Zentimeter (cm). Wir messen mit dem Lineal in cm. Uhrzeit: Die kurze Zeigerin zeigt die Stunden, die lange die Minuten. Volle Stunde: langer Zeiger auf 12. Halbe Stunde: langer Zeiger auf 6. Geld: 1 Euro = 100 Cent. Münzen: 1ct, 2ct, 5ct, 10ct, 20ct, 50ct, 1€, 2€. Scheine: 5€, 10€, 20€...',
          vorwissen:['Hast du schon mal mit einem Lineal gemessen?','Wie viele Minuten hat eine Stunde?','Kennst du Münzen und Scheine?'],
          merksatz:'1m = 100cm. Volle Stunde: großer Zeiger auf 12. 1€ = 100ct.',
          beispiele:['Dein Bleistift ist ca. 18 cm lang','Es ist halb 3: Zeiger auf 6 (Minuten) und kurz zwischen 2 und 3'],
          gegenbeispiele:['12:30 ist nicht 12 Uhr 3'],
          typischeFehler:['Langer und kurzer Zeiger verwechseln','50ct + 50ct = 1 Euro, nicht 100ct'],
          videoskript:'Szene 1 – Lineal mit Bleistift: "Anlegen an 0, ablesen am Ende: 18cm." Szene 2 – Uhr: "Kurzer Zeiger = Stunden (hier: 4), langer Zeiger = Minuten (auf 12 = volle Stunde) → 4 Uhr." Szene 3 – Geldbeutel: Münzen werden gezählt: "2×50ct = 1€."',
          transfer:{ aufgabe:'Miss drei Gegenstände in deinem Zimmer mit einem Lineal. Schreibe auf: Gegenstand – gemessene Länge. Welcher ist am längsten?', kontext:'Messen im Alltag', tipp:'Anlegen an der 0-Linie beginnen!' }
        }
      ],
      exercises:[
        {
          id:'e1', type:'Zahlen', diff:1, title:'Zahlen bis 100',
          desc:'Zahlen lesen, schreiben und vergleichen.',
          ersteAnwendung:[
            { aufgabe:'Wie viele Zehner hat die Zahl 73?', loesung:'7', hinweis:'Die linke Stelle ist der Zehner.' },
            { aufgabe:'Was ist größer: 58 oder 52?', loesung:'58', hinweis:'Die Zehner sind gleich, vergleiche die Einer.' },
            { aufgabe:'Was ist der Nachfolger von 99?', loesung:'100', hinweis:'99+1=?' }
          ],
          questions:[
            { q:'Wie viele Zehner stecken in der Zahl 64?', hint:'Erste Stelle von links.', options:['4','6','10','64'], correct:1, explanation:'64 = 6 Zehner + 4 Einer.' },
            { q:'Was ist kleiner: 72 oder 27?', hint:'Schau zuerst auf die Zehnerstelle.', options:['72','27','Gleich','Weiß nicht'], correct:1, explanation:'27 < 72 (2 Zehner < 7 Zehner).' },
            { q:'Wie viel ist 30 + 8?', hint:'3 Zehner und 8 Einer.', options:['38','308','83','13'], correct:0, explanation:'30 + 8 = 38.' },
            { q:'Welche Zahl liegt zwischen 49 und 51?', hint:'Eine Zahl genau dazwischen.', options:['48','52','50','53'], correct:2, explanation:'49, 50, 51 – die 50 liegt dazwischen.' },
            { q:'Was ist 100 − 1?', hint:'Eine weniger als hundert.', options:['101','90','99','100'], correct:2, explanation:'100 − 1 = 99.' },
            { q:'Ordne: 45, 54, 44, 55 von klein nach groß. Was steht an zweiter Stelle?', hint:'Klein nach groß: erste finden, dann nächste.', options:['45','54','44','55'], correct:0, explanation:'44, 45, 54, 55 – 45 steht an Stelle 2.' },
            { q:'Was ergibt 10 × 7?', hint:'7 Zehner.', options:['17','70','7','17'], correct:1, explanation:'10 × 7 = 70 = 7 Zehner.' },
            { q:'Wie heißt die Zahl 83 auf Deutsch?', hint:'Zehner zuerst, dann Einer, mit "und".', options:['achtzehn','dreiundachtzig','achthundertdrei','dreißig'], correct:1, explanation:'83 = drei­und­achtzig.' }
          ],
          minidiagnose:[
            { q:'Wie viele Einer hat die Zahl 56?', options:['5','6','56','11'], correct:1 },
            { q:'Was ist größer: 39 oder 93?', options:['39','93','Gleich','Weiß nicht'], correct:1 },
            { q:'Was ist 50 + 7?', options:['507','57','75','50'], correct:1 },
            { q:'Was kommt nach 79?', options:['70','90','78','80'], correct:3 },
            { q:'Welche Zahl hat 4 Zehner und 2 Einer?', options:['24','40','42','44'], correct:2 }
          ],
          kompetenznachweis:[
            { q:'Wie lautet die Zahl: 9 Zehner + 3 Einer?', options:['39','93','903','309'], correct:1 },
            { q:'Was ist der Vorgänger von 100?', options:['101','99','90','109'], correct:1 },
            { q:'Welche Aussage ist falsch?', options:['47 < 74','63 > 36','82 = 28','100 > 99'], correct:2 },
            { q:'Reihenfolge von groß nach klein: 55, 88, 11, 44. Was steht an erster Stelle?', options:['55','88','11','44'], correct:1 },
            { q:'Was ergibt 6 Zehner + 9 Einer?', options:['96','69','609','906'], correct:1 }
          ]
        },
        {
          id:'e2', type:'Rechnen', diff:2, title:'Addieren und Subtrahieren bis 100',
          desc:'Rechne Aufgaben im Zahlenraum bis 100.',
          ersteAnwendung:[
            { aufgabe:'Rechne: 36 + 25 = ?', loesung:'61', hinweis:'Schrittweise: 36+20=56, 56+5=61.' },
            { aufgabe:'Rechne: 74 − 32 = ?', loesung:'42', hinweis:'74−30=44, 44−2=42.' },
            { aufgabe:'Du hast 80ct und gibst 45ct aus. Wie viel bleibt?', loesung:'35ct', hinweis:'80−45=?' }
          ],
          questions:[
            { q:'Was ergibt 45 + 38?', hint:'Schrittweise: 45+30=75, 75+8.', options:['83','73','84','82'], correct:0, explanation:'45+38=83.' },
            { q:'Was ergibt 67 − 29?', hint:'67−20=47, 47−9.', options:['36','38','48','37'], correct:1, explanation:'67−29=38.' },
            { q:'Was ergibt 52 + 39?', hint:'52+40=92, −1=91.', options:['91','81','92','89'], correct:0, explanation:'52+39=91.' },
            { q:'Was ergibt 80 − 45?', hint:'80−40=40, 40−5.', options:['35','25','45','30'], correct:0, explanation:'80−45=35.' },
            { q:'Lea kauft Sticker für 43ct und Gummi für 27ct. Wie viel zahlt sie?', hint:'43+27.', options:['70ct','60ct','80ct','75ct'], correct:0, explanation:'43+27=70 Cent.' },
            { q:'Was fehlt? 56 + ? = 90', hint:'90−56=?', options:['34','36','44','46'], correct:0, explanation:'90−56=34.' },
            { q:'Was ergibt 100 − 63?', hint:'100−60=40, 40−3.', options:['37','47','27','43'], correct:0, explanation:'100−63=37.' },
            { q:'Was ergibt 28 + 46?', hint:'28+40=68, 68+6.', options:['74','73','75','76'], correct:0, explanation:'28+46=74.' }
          ],
          minidiagnose:[
            { q:'34 + 27 = ?', options:['61','51','71','57'], correct:0 },
            { q:'82 − 35 = ?', options:['43','47','57','53'], correct:1 },
            { q:'Was fehlt? 48 + ? = 75', options:['27','37','23','33'], correct:0 },
            { q:'Du hast 60ct und gibst 38ct aus. Was bleibt?', options:['22ct','32ct','18ct','28ct'], correct:0 },
            { q:'Was ist 70 − 23?', options:['47','53','43','57'], correct:0 }
          ],
          kompetenznachweis:[
            { q:'55 + 38 = ?', options:['83','93','87','97'], correct:1 },
            { q:'91 − 46 = ?', options:['45','55','35','50'], correct:0 },
            { q:'Was ergibt 37 + 47?', options:['74','84','76','86'], correct:1 },
            { q:'100 − 28 = ?', options:['72','82','68','78'], correct:0 },
            { q:'Beide Zahlen zusammen: 64 und 19.', options:['83','73','85','75'], correct:0 }
          ]
        }
      ]
    }]
  },

  /* ========================  KLASSE 3  ======================== */
  klasse3: {
    id:'klasse3', num:3, label:'Klasse 3', emoji:'🔥',
    color:['#10B981','#6EE7B7'], light:'#D1FAE5',
    tagline:'Zahlen bis 1000 und das Einmaleins',
    subjects:[{
      id:'mathe', name:'Mathematik', icon:'🔢',
      desc:'Zahlen bis 1000, schriftliche Verfahren, Einmaleins, Längen, Gewichte',
      color:'#059669',
      intro:'Klasse 3 – jetzt wird es richtig spannend! Das kleine Einmaleins, schriftliches Rechnen und Größen wie Meter und Kilogramm warten auf dich. Herr Lala hilft dir Schritt für Schritt!',
      topics:[
        { isChapter:true, name:'📚 Zahlen und Operationen' },
        {
          name:'Zahlen bis 1000', diff:1,
          kompetenz:'Ich kann Zahlen bis 1000 lesen, schreiben, vergleichen und auf dem Zahlenstrahl einordnen.',
          explanation:'Im Zahlenraum bis 1000 gibt es Einer, Zehner und Hunderter. 1 Hunderter = 10 Zehner = 100 Einer. Die Zahl 473 besteht aus 4 Huntertern (=400), 7 Zehnern (=70) und 3 Einern. 1000 = tausend = 10 Hunderter. Vergleichen: Erst die Hunderterstelle, dann Zehnerstelle, dann Einerstelle vergleichen. 473 < 523, weil 4 Hunderter < 5 Hunderter. Zahlen auf dem Zahlenstrahl: 500 liegt genau in der Mitte zwischen 0 und 1000.',
          vorwissen:['Kannst du bis 100 zählen?','Was sind Zehner und Einer?','Was bedeutet >, < und =?'],
          merksatz:'473 = 4 Hunderter + 7 Zehner + 3 Einer = 400 + 70 + 3.',
          beispiele:['856 = acht­hundert­sechs­und­fünfzig','1000 = tausend'],
          gegenbeispiele:['007 schreibt man einfach 7'],
          typischeFehler:['403 und 430 verwechseln: Hunderter gleich, aber Zehner und Einer anders','508 ≠ 580'],
          videoskript:'Szene 1 – Hunderter-Plättchen, Zehner-Stäbe, Einer-Würfel. "4 Plättchen + 7 Stäbe + 3 Würfel = 473." Szene 2 – Zahlenstrahl 0–1000: "473 liegt näher an 500 als an 400." Szene 3 – Vergleich: "473 vs 523: Hunderterstellen: 4 < 5, also 473 < 523."',
          transfer:{ aufgabe:'Schau in ein Buch: Wie viele Seiten hat es? Lies die Seitenzahl und schreibe sie in Hunderter + Zehner + Einer auf.', kontext:'Zahlen lesen', tipp:'z.B. 256 = 2 Hunderter + 5 Zehner + 6 Einer' }
        },
        {
          name:'Schriftliches Addieren und Subtrahieren', diff:2,
          kompetenz:'Ich kann schriftlich addieren und subtrahieren (auch mit Übertrag).',
          explanation:'Beim schriftlichen Addieren schreibst du die Zahlen untereinander – Einerstelle unter Einerstelle, Zehnerstelle unter Zehnerstelle usw. Dann rechnest du von rechts nach links. Wenn eine Spalte 10 oder mehr ergibt, trägst du die Eins zur nächsten Spalte (Übertrag). Beispiel: 347 + 265 → Einer: 7+5=12, schreib 2, Übertrag 1; Zehner: 4+6+1=11, schreib 1, Übertrag 1; Hunderter: 3+2+1=6 → Ergebnis: 612. Bei der Subtraktion: von rechts nach links subtrahieren, bei Bedarf von der nächsten Stelle „borgen".',
          vorwissen:['Kannst du bis 1000 rechnen?','Was ist ein Übertrag?','Wie addiert man schrittweise?'],
          merksatz:'Stelle unter Stelle! Von rechts rechnen! Übertrag notieren!',
          beispiele:['347 + 265 = 612 (mit Übertrag)','800 − 347 = 453'],
          gegenbeispiele:['Nicht im Kopf rechnen wenn die Zahlen zu groß werden – dann schriftlich!'],
          typischeFehler:['Stellen falsch untereinander schreiben','Übertrag vergessen oder doppelt zählen','Bei Subtraktion: 503 − 267 braucht mehrfaches Borgen'],
          videoskript:'Szene 1 – Schriftliche Addition: Zahlen werden übereinander geschrieben. "Von rechts: 7+5=12. Die 2 schreiben, die 1 klein oben drüber – das ist der Übertrag." Szene 2 – Zehner: "4+6+1(Übertrag)=11. Die 1 schreiben, 1 Übertrag." Szene 3 – Hunderter: "3+2+1=6. Fertig: 612." Szene 4 – Subtraktion: Borgen erklärt.',
          transfer:{ aufgabe:'Berechne schriftlich: Deine Schule hat 438 Schüler. Im nächsten Jahr kommen 127 dazu. Wie viele Schüler sind es dann?', kontext:'Rechnen mit Zahlen aus dem Alltag', tipp:'438 + 127 schriftlich!' }
        },
        {
          name:'Das kleine Einmaleins', diff:2,
          kompetenz:'Ich kenne alle Aufgaben des kleinen Einmaleins auswendig.',
          explanation:'Das kleine Einmaleins umfasst alle Aufgaben von 1×1 bis 10×10. Multiplikation ist schnelles Addieren: 4×3 bedeutet "4 mal die 3" = 3+3+3+3=12. Wichtige Strategien: Verdopplungen (4×4=16), Reihen auswendig lernen. Das Einmaleins hat Symmetrie: 4×7 = 7×4 (Kommutativgesetz). Divisionsaufgaben sind Umkehrungen: 4×7=28, also 28÷4=7 und 28÷7=4.',
          vorwissen:['Was bedeutet ×?','Was ist eine Verdopplung?','Kannst du die 2er-Reihe?'],
          merksatz:'4×7 = 7×4 = 28. Kenne die Reihen, dann kennst du alle Aufgaben!',
          beispiele:['6×8=48 (6 Reihen mit je 8 Stühlen = 48 Stühle)','9×7=63'],
          gegenbeispiele:['8×7 ≠ 58, ≠ 54 (Häufiger Fehler: es ist 56)'],
          typischeFehler:['6×7=42 (nicht 48)','7×8=56 (nicht 54 oder 58)','9×6=54 (nicht 56)'],
          videoskript:'Szene 1 – Einmaleins-Tabelle. "Die Diagonale zeigt Quadratzahlen: 1,4,9,16,25,36,49,64,81,100." Szene 2 – Strategie: "8×7: ich kenne 8×5=40 und 8×2=16, also 40+16=56." Szene 3 – Tricks: "9er-Reihe: 9×4=36 → Quersumme 3+6=9 immer!" Szene 4 – Umkehraufgaben: "28÷4=7, weil 4×7=28."',
          transfer:{ aufgabe:'Du kaufst 7 Pakete mit je 6 Buntstiften. Wie viele Buntstifte hast du insgesamt? Schreibe die Rechnung.', kontext:'Einmaleins anwenden', tipp:'7×6=? oder 6×7=?' }
        },
        { isChapter:true, name:'📚 Größen und Messen' },
        {
          name:'Längen und Gewichte', diff:1,
          kompetenz:'Ich kann Längen in mm, cm, m, km und Gewichte in g und kg umrechnen und messen.',
          explanation:'Längenmaße: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm. Eselsbrücke: "kilo" = 1000. Gewichte: 1 kg = 1000 g. Umrechnen in kleinere Einheit: multiplizieren. In größere Einheit: dividieren. Beispiele: 3,5 m = 350 cm. 2 kg 300 g = 2300 g. Messen: mit Lineal (mm, cm), Zollstock (cm, m), Küchenwaage (g, kg).',
          vorwissen:['Kannst du Längen in cm messen?','Was ist ein Kilometer?','Was wiegt 1 Kilogramm?'],
          merksatz:'km → m: ×1000. m → cm: ×100. cm → mm: ×10. kg → g: ×1000.',
          beispiele:['Schulweg 1,5 km = 1500 m','Tasche wiegt 3 kg 250 g = 3250 g'],
          gegenbeispiele:['1 m ≠ 10 cm (ist 100 cm)'],
          typischeFehler:['1 m = 10 cm statt 100 cm','km und m Faktor 100 statt 1000'],
          videoskript:'Szene 1 – Umrechnungspfeil: km ×1000 → m ×100 → cm ×10 → mm. Szene 2 – Beispiele mit Bildern: Stift 18cm, Schulweg 2km. Szene 3 – Waage: 1kg-Gewicht vs. 1000g-Zucker.',
          transfer:{ aufgabe:'Messe die Länge deines Schreibtisches in cm und rechne sie in mm um. Schreibe: ___ cm = ___ mm.', kontext:'Messen in der Praxis', tipp:'×10 für cm→mm' }
        }
      ],
      exercises:[
        {
          id:'e1', type:'Zahlen', diff:1, title:'Zahlen bis 1000',
          desc:'Zahlen lesen, schreiben, vergleichen und darstellen.',
          ersteAnwendung:[
            { aufgabe:'Wie viele Hunderter stecken in 743?', loesung:'7', hinweis:'Die erste Stelle von links.' },
            { aufgabe:'Schreibe: 5 Hunderter + 3 Zehner + 8 Einer', loesung:'538', hinweis:'Stelle die Ziffern zusammen.' },
            { aufgabe:'Was ist größer: 672 oder 726?', loesung:'726', hinweis:'Vergleiche die Hunderterstellen: 6 < 7.' }
          ],
          questions:[
            { q:'Wie viele Zehner hat die Zahl 537?', hint:'Zweite Stelle von links.', options:['5','3','7','53'], correct:1, explanation:'537: 5 Hunderter, 3 Zehner, 7 Einer.' },
            { q:'Wie lautet 700 + 40 + 6?', hint:'Stelle die Ziffern zusammen.', options:['746','7046','764','476'], correct:0, explanation:'700+40+6=746.' },
            { q:'Was ist kleiner: 608 oder 680?', hint:'Hunderterstellen gleich, Zehnerstellen vergleichen.', options:['680','608','Gleich','Weiß nicht'], correct:1, explanation:'608 < 680 (Zehner 0 < 8).' },
            { q:'Was ist der Vorgänger von 1000?', hint:'Eins weniger.', options:['1001','999','990','100'], correct:1, explanation:'1000−1=999.' },
            { q:'Wie heißt 843 auf Deutsch?', hint:'Hunderter, dann "und", dann Rest.', options:['achtzehndreiundvierzig','dreundvierzigtacht','dreiviertelacht','acht­hundert­drei­und­vierzig'], correct:3, explanation:'843 = acht­hundert­drei­und­vierzig.' },
            { q:'Runde 476 auf die nächste Hunderterstelle.', hint:'Zehnerstelle ist 7 ≥ 5 → aufrunden.', options:['400','500','470','480'], correct:1, explanation:'476 → Zehnerstelle 7 ≥ 5 → 500.' },
            { q:'Was ergibt 500 + 300?', hint:'5 + 3 Hunderter.', options:['800','850','5300','300'], correct:0, explanation:'500+300=800.' },
            { q:'Welche Zahl liegt genau zwischen 400 und 600?', hint:'Mitte = (400+600)÷2.', options:['450','550','500','480'], correct:2, explanation:'(400+600)÷2=500.' }
          ],
          minidiagnose:[
            { q:'Was ist 6 Hunderter + 0 Zehner + 5 Einer?', options:['65','650','605','560'], correct:2 },
            { q:'Was ist größer: 387 oder 378?', options:['387','378','Gleich','Weiß nicht'], correct:0 },
            { q:'Runde 324 auf Hunderter.', options:['400','300','320','330'], correct:1 },
            { q:'Was kommt nach 999?', options:['1000','998','990','9999'], correct:0 },
            { q:'Wie viele Hunderter hat die Zahl 803?', options:['0','8','3','83'], correct:1 }
          ],
          kompetenznachweis:[
            { q:'Welche Zahl hat 9 Hunderter, 4 Zehner und 1 Einer?', options:['914','941','419','194'], correct:1 },
            { q:'Was ist kleiner: 501 oder 510?', options:['510','501','Gleich','Weiß nicht'], correct:1 },
            { q:'Was ergibt 900 − 1?', options:['891','899','900','901'], correct:1 },
            { q:'Runde 749 auf Hunderter.', options:['700','750','800','740'], correct:2 },
            { q:'Ordne von groß nach klein: 563, 653, 356, 635.', options:['653,635,563,356','356,563,635,653','635,563,356,653','653,563,635,356'], correct:0 }
          ]
        },
        {
          id:'e2', type:'Einmaleins', diff:2, title:'Das kleine Einmaleins',
          desc:'Alle Aufgaben des Einmaleins sicher beherrschen.',
          ersteAnwendung:[
            { aufgabe:'6 × 7 = ?', loesung:'42', hinweis:'6er-Reihe: 6,12,18,24,30,36,42.' },
            { aufgabe:'8 × 9 = ?', loesung:'72', hinweis:'9er-Reihe: 9,18,27,36,45,54,63,72.' },
            { aufgabe:'7 × 7 = ?', loesung:'49', hinweis:'Quadratzahl!' }
          ],
          questions:[
            { q:'Was ergibt 7 × 8?', hint:'7er-Reihe bis 8.', options:['54','56','48','63'], correct:1, explanation:'7×8=56.' },
            { q:'Was ergibt 9 × 6?', hint:'9×6=9×5+9=45+9.', options:['54','48','56','63'], correct:0, explanation:'9×6=54.' },
            { q:'Was ergibt 8 × 8?', hint:'Quadratzahl – auswendig!', options:['64','56','72','48'], correct:0, explanation:'8×8=64.' },
            { q:'56 ÷ 7 = ?', hint:'7 × ? = 56', options:['6','8','7','9'], correct:1, explanation:'7×8=56, also 56÷7=8.' },
            { q:'Was ergibt 6 × 9?', hint:'6×9 = 6×10 − 6.', options:['54','63','48','56'], correct:0, explanation:'6×9=54.' },
            { q:'Was ergibt 4 × 7?', hint:'4er-Reihe: 4,8,12,16,20,24,28.', options:['24','28','32','21'], correct:1, explanation:'4×7=28.' },
            { q:'36 ÷ 6 = ?', hint:'6 × ? = 36', options:['5','7','6','8'], correct:2, explanation:'6×6=36, also 36÷6=6.' },
            { q:'Was ergibt 3 × 9?', hint:'3er-Reihe bis 9. Oder: 9×3.', options:['24','30','27','21'], correct:2, explanation:'3×9=27.' }
          ],
          minidiagnose:[
            { q:'5 × 8 = ?', options:['35','45','40','42'], correct:2 },
            { q:'7 × 6 = ?', options:['42','48','36','54'], correct:0 },
            { q:'63 ÷ 9 = ?', options:['6','8','7','9'], correct:2 },
            { q:'9 × 9 = ?', options:['72','81','80','90'], correct:1 },
            { q:'4 × 6 = ?', options:['28','20','24','30'], correct:2 }
          ],
          kompetenznachweis:[
            { q:'8 × 7 = ?', options:['54','56','63','49'], correct:1 },
            { q:'48 ÷ 6 = ?', options:['6','9','7','8'], correct:3 },
            { q:'9 × 4 = ?', options:['27','36','45','32'], correct:1 },
            { q:'72 ÷ 8 = ?', options:['7','8','9','10'], correct:2 },
            { q:'6 × 6 = ?', options:['30','36','42','48'], correct:1 }
          ]
        }
      ]
    }]
  },

  /* ========================  KLASSE 4  ======================== */
  klasse4: {
    id:'klasse4', num:4, label:'Klasse 4', emoji:'🏆',
    color:['#3B82F6','#93C5FD'], light:'#DBEAFE',
    tagline:'Zahlen bis 1.000.000 – Abschluss der Grundschule',
    subjects:[{
      id:'mathe', name:'Mathematik', icon:'🔢',
      desc:'Große Zahlen, schriftliche Multiplikation und Division, Brüche, Geometrie',
      color:'#2563EB',
      intro:'Klasse 4 – das Abschlussjahr der Grundschule! Millionen, schriftliches Multiplizieren und Dividieren, Brüche und Flächen. Du bist fast Experte – Herr Lala begleitet dich!',
      topics:[
        { isChapter:true, name:'📚 Zahlen und Operationen' },
        {
          name:'Zahlen bis 1.000.000', diff:1,
          kompetenz:'Ich kann Zahlen bis 1.000.000 lesen, schreiben, vergleichen und runden.',
          explanation:'Im Zahlenraum bis eine Million gibt es sechs Stellen: Einer, Zehner, Hunderter, Tausender, Zehntausender, Hunderttausender. 1.000.000 = eine Million. Die Zahl 347.528 liest man: drei­hundert­sieben­und­vierzig­tausend­fünf­hundert­acht­und­zwanzig. Stellen­wert­tafel: HT|ZT|T|H|Z|E. Runden auf Tausender: Hunderterstelle prüfen – ≥5 aufrunden, <5 abrunden. Das Binärsystem: Zahlen werden mit 0 und 1 dargestellt. 5 = 101 in Binär.',
          vorwissen:['Kannst du bis 1000 zählen?','Was ist ein Tausender?','Wie rundet man auf Hunderter?'],
          merksatz:'1.000.000 = eine Million = 1000 Tausender = 100 Hunderttausender.',
          beispiele:['Die Stadt hat 347.528 Einwohner','1 Kilometer = 1000 Meter, 1000 km ≈ 1 Million Meter'],
          gegenbeispiele:['1 Million ist viel mehr als 1000'],
          typischeFehler:['Bei großen Zahlen fehlende Stellen als 0 einsetzen: 3045 ≠ 345','Punkte als Tausender-Trennzeichen verwenden'],
          videoskript:'Szene 1 – Stellenwerttafel mit 6 Feldern. "HT=100.000, ZT=10.000, T=1000, H=100, Z=10, E=1." Szene 2 – Die Zahl 347.528 wird Stelle für Stelle eingetragen. Szene 3 – Runden: "347.528 auf Tausender: Hunderterstelle ist 5 ≥ 5 → 348.000."',
          transfer:{ aufgabe:'Schau im Internet nach: Wie viele Einwohner hat deine Stadt? Schreibe die Zahl auf und erkläre, wie viele Tausender das sind.', kontext:'Zahlen in der Welt', tipp:'Stelle die Zahl in der Stellenwerttafel dar.' }
        },
        {
          name:'Schriftlich Multiplizieren', diff:2,
          kompetenz:'Ich kann schriftlich mit mehrstelligen Faktoren multiplizieren.',
          explanation:'Beim schriftlichen Multiplizieren rechnest du Stelle für Stelle. Beispiel: 347 × 6. Du rechnest: 6×7=42, schreib 2 Übertrag 4; 6×4=24+4=28, schreib 8 Übertrag 2; 6×3=18+2=20 → 2082. Bei zweistelligem Multiplikator: erst mit der Einerstelle multiplizieren, dann mit der Zehnerstelle (dabei eine Stelle nach links rücken), dann addieren.',
          vorwissen:['Kennst du das Einmaleins?','Was ist ein Übertrag?','Kannst du schriftlich addieren?'],
          merksatz:'Stelle für Stelle von rechts! Überträge sofort oben notieren!',
          beispiele:['347 × 6 = 2082','234 × 12 = 2808'],
          gegenbeispiele:['Einmaleins-Fehler: 6×7≠48 (ist 42)'],
          typischeFehler:['Übertrag vergessen','Bei zweistelligem Multiplikator nicht nach links rücken'],
          videoskript:'Szene 1 – 347 × 6 wird Schritt für Schritt aufgebaut. "Einerstelle: 6×7=42, 2 schreiben, 4 merken." Szene 2 – "Zehnerstelle: 6×4=24+4=28, 8 schreiben, 2 merken." Szene 3 – "Hunderterstelle: 6×3=18+2=20." Szene 4 – Kontrolle: "Überschlag: 350×6=2100 ≈ 2082 ✓"',
          transfer:{ aufgabe:'Ein Buch hat 248 Seiten. Du liest 7 Tage lang täglich gleich viele Seiten. Wenn du das Buch nach 7 Tagen fertig liest, wie viele Seiten liest du täglich? Hinweis: 248÷7. Und: 7 Bücher mit je 248 Seiten = ?', kontext:'Rechnen im Alltag', tipp:'Schriftliche Division: 248÷7 = 35 Rest 3.' }
        },
        {
          name:'Schriftlich Dividieren', diff:3,
          kompetenz:'Ich kann schriftlich durch einstellige Divisoren dividieren (mit und ohne Rest).',
          explanation:'Division ist die Umkehrung der Multiplikation. 84÷4: "Wie oft passt 4 in 84?" Schriftliches Verfahren: 84÷4: Nehme erste Stelle(n): 8÷4=2, Rest 0. Bring nächste Stelle: 04÷4=1. Ergebnis: 21. Mit Rest: 85÷4: 8÷4=2 Rest 0; 05÷4=1 Rest 1 → 21 Rest 1. Probe: 21×4+1=85 ✓',
          vorwissen:['Kannst du das Einmaleins?','Was ist ein Rest?','Wie multipliziert man schriftlich?'],
          merksatz:'Division = Einmaleins rückwärts. Immer Probe machen: Ergebnis×Divisor + Rest = Dividend.',
          beispiele:['126÷3=42 (Probe: 42×3=126 ✓)','137÷4=34 Rest 1 (Probe: 34×4+1=137 ✓)'],
          gegenbeispiele:['Durch 0 darf man nicht dividieren!'],
          typischeFehler:['Rest vergessen','Stelle nicht herunterziehen'],
          videoskript:'Szene 1 – 84÷4 Schritt für Schritt. "8÷4=2, Rest 0. 0 und 4 → 04÷4=1. Ergebnis: 21." Szene 2 – 85÷4: "8÷4=2 Rest 0, 05÷4=1 Rest 1 → 21 Rest 1." Szene 3 – Probe: "21×4=84+1=85 ✓"',
          transfer:{ aufgabe:'Du hast 196 Buntstifte und möchtest sie gleichmäßig auf 7 Kinder verteilen. Wie viele bekommt jedes Kind?', kontext:'Division im Alltag', tipp:'196÷7=? Probe: Ergebnis × 7 sollte 196 ergeben.' }
        },
        { isChapter:true, name:'📚 Bruchzahlen' },
        {
          name:'Brüche im Alltag', diff:2,
          kompetenz:'Ich verstehe einfache Brüche (½, ¼, ¾) und kann sie darstellen.',
          explanation:'Ein Bruch beschreibt einen Teil eines Ganzen. Der Nenner (Zahl unten) sagt, in wie viele gleiche Teile geteilt wurde. Der Zähler (Zahl oben) sagt, wie viele dieser Teile gemeint sind. ½ = eine von zwei gleichen Hälften. ¼ = ein Viertel. ¾ = drei von vier Teilen. Brüche im Alltag: halbe Stunde = 30 min, Viertelstunde = 15 min, eine halbe Pizza, ein Viertel Apfel. Vergleichen: ½ > ¼, weil bei halben Teilen die Stücke größer sind.',
          vorwissen:['Weißt du was "die Hälfte" bedeutet?','Was ist ein Viertel?','Kannst du Teile eines Ganzen benennen?'],
          merksatz:'Bruch: Zähler (oben) / Nenner (unten). Großer Nenner = kleine Teile.',
          beispiele:['½ Pizza = Hälfte','¾ Stunde = 45 Minuten','¼ kg = 250 g'],
          gegenbeispiele:['1/3 ist nicht das Gleiche wie ½'],
          typischeFehler:['Zähler und Nenner verwechseln','¼ > ½ denken (falsch! ¼ < ½)'],
          videoskript:'Szene 1 – Kreis wird in 4 gleiche Teile geteilt. "1 von 4 Teilen = ¼." Szene 2 – "3 von 4 Teilen sind blau: ¾." Szene 3 – Zahlenstrahl: 0, ¼, ½, ¾, 1. Szene 4 – Vergleich: "½ ist größer als ¼, weil die Teile größer sind."',
          transfer:{ aufgabe:'Teile einen Apfel (oder ein Blatt Papier) in 4 gleiche Teile. Male davon 3 Teile an. Was ist das für ein Bruch? Schreibe ihn auf.', kontext:'Brüche sehen und anfassen', tipp:'Zähle die angemalten Teile → Zähler; Gesamtzahl der Teile → Nenner.' }
        },
        { isChapter:true, name:'📚 Geometrie: Umfang und Fläche' },
        {
          name:'Umfang und Flächeninhalt', diff:2,
          kompetenz:'Ich kann Umfang und Flächeninhalt von Rechtecken und Quadraten berechnen.',
          explanation:'Der Umfang ist die Summe aller Seiten. Beim Rechteck: U = 2 × (a + b), wobei a = Länge und b = Breite. Beim Quadrat: U = 4 × a. Der Flächeninhalt zeigt, wie groß die Fläche ist. Rechteck: A = a × b. Quadrat: A = a × a = a². Einheiten: Flächen werden in cm², m², km² gemessen. Das hochgestellte ² erinnert dich: zwei Maße multipliziert!',
          vorwissen:['Was ist ein Rechteck?','Was ist Länge und Breite?','Was ist das Einmaleins?'],
          merksatz:'Umfang = Rand entlang. Fläche = innen. Rechteck: U=2(a+b), A=a×b.',
          beispiele:['Zimmer 4m × 3m: U=2×(4+3)=14m, A=4×3=12m²','Spielfeld 10m × 7m: U=34m, A=70m²'],
          gegenbeispiele:['Umfang in cm, Fläche in cm² – verschiedene Einheiten!'],
          typischeFehler:['Verwechslung von Umfang und Fläche','Einheiten vergessen: cm vs cm²'],
          videoskript:'Szene 1 – Rechteck 5cm × 3cm. "Umfang: Ich gehe am Rand entlang: 5+3+5+3=16cm." Szene 2 – Quadratmuster wird ausgezählt: "3 Reihen × 5 = 15 Quadrate = 15 cm²." Szene 3 – Formel: U=2(a+b), A=a×b.',
          transfer:{ aufgabe:'Miss dein Schulheft: Wie lang und wie breit ist es? Berechne Umfang und Flächeninhalt. Welche Einheit ist richtig?', kontext:'Geometrie messen', tipp:'Länge × Breite = Fläche in cm².' }
        },
        { isChapter:true, name:'📚 Daten und Wahrscheinlichkeit' },
        {
          name:'Daten und Diagramme', diff:2,
          kompetenz:'Ich kann Daten erheben, in Tabellen und Diagrammen darstellen und auswerten.',
          explanation:'Daten sammeln bedeutet: Informationen zählen oder messen. Häufigkeit = wie oft etwas vorkommt. Strichliste: für jeden Fall einen Strich, beim 5. Strich quer durch. Diagramme: Säulendiagramm (Balken zeigen Häufigkeiten), Tabelle (Daten geordnet). Auswerten: Welche Kategorie hat die meisten/wenigsten Nennungen? Wahrscheinlichkeit: "sicher" (wird immer passieren), "unmöglich" (kann nie passieren), "wahrscheinlich/unwahrscheinlich".',
          vorwissen:['Weißt du was eine Tabelle ist?','Kennst du ein Säulendiagramm?','Was bedeutet "wahrscheinlich"?'],
          merksatz:'Daten → Strichliste → Tabelle → Diagramm → Auswertung.',
          beispiele:['Umfrage: Lieblingstier in der Klasse – Daten in Tabelle und Diagramm','Münzwurf: Kopf/Zahl – je ½ wahrscheinlich'],
          gegenbeispiele:['Ein Diagramm ohne Beschriftung ist wertlos'],
          typischeFehler:['Achsenbeschriftung vergessen','Strichliste falsch übertragen'],
          videoskript:'Szene 1 – Umfrage "Was ist dein Lieblingstier?" – Kinder zeigen Karten. Strichliste entsteht. Szene 2 – Tabelle mit Kategorien und Häufigkeiten. Szene 3 – Säulendiagramm wird daraus gemalt. Szene 4 – Auswertung: "Hunde wurden am häufigsten genannt."',
          transfer:{ aufgabe:'Befrage 5 Personen: "Was ist dein Lieblingsessen?" Erstelle eine Strichliste, eine Tabelle und ein einfaches Säulendiagramm.', kontext:'Statistik selbst erstellen', tipp:'Kategorien zuerst festlegen, dann auszählen.' }
        }
      ],
      exercises:[
        {
          id:'e1', type:'Zahlen', diff:1, title:'Zahlen bis 1.000.000',
          desc:'Große Zahlen lesen, schreiben und vergleichen.',
          ersteAnwendung:[
            { aufgabe:'Wie viele Stellen hat die Zahl 347.528?', loesung:'6', hinweis:'Zähle die Ziffern.' },
            { aufgabe:'Was ist größer: 245.000 oder 254.000?', loesung:'254.000', hinweis:'Zehntausender vergleichen: 4 < 5.' },
            { aufgabe:'Runde 347.528 auf Tausender.', loesung:'348.000', hinweis:'Hunderterstelle 5 ≥ 5 → aufrunden.' }
          ],
          questions:[
            { q:'Wie viele Tausender stecken in 347.000?', hint:'Stelle ab T: 347.', options:['34','347','3470','3047'], correct:1, explanation:'347.000 = 347 × 1000.' },
            { q:'Was ergibt 200.000 + 50.000 + 3.000 + 400 + 20 + 7?', hint:'Stelle die Ziffern zusammen.', options:['253427','253.427','2053427','25427'], correct:1, explanation:'253.427.' },
            { q:'Was ist kleiner: 876.543 oder 867.543?', hint:'Zehntausenderstelle vergleichen.', options:['876.543','867.543','Gleich','Weiß nicht'], correct:1, explanation:'867.543 < 876.543 (ZT-Stelle 6 < 7).' },
            { q:'Runde 649.312 auf Hunderttausender.', hint:'Zehntausenderstelle 4 < 5 → abrunden.', options:['700.000','600.000','640.000','650.000'], correct:1, explanation:'649.312 → ZT-Stelle 4 < 5 → 600.000.' },
            { q:'Wie lautet die nächste Zahl nach 999.999?', hint:'Millionengrenze.', options:['999.990','1.000.000','1.000.001','999.998'], correct:1, explanation:'999.999 + 1 = 1.000.000.' },
            { q:'Was ergibt 5 × 100.000?', hint:'5 Hunderttausender.', options:['50.000','5.000.000','500.000','50.0000'], correct:2, explanation:'5 × 100.000 = 500.000.' },
            { q:'Welche Zahl hat 3 Hunderttausender, 4 Zehntausender, 0 Tausender, 5 Hunderter, 2 Zehner, 1 Einer?', hint:'Stellenwerttafel ausfüllen.', options:['340.521','304.521','340.251','343.521'], correct:0, explanation:'300.000+40.000+0+500+20+1=340.521.' },
            { q:'Was ist 1.000.000 − 1?', hint:'Eine Million minus eins.', options:['999.999','999.000','999.990','990.000'], correct:0, explanation:'1.000.000−1=999.999.' }
          ],
          minidiagnose:[
            { q:'Wie viele Nullen hat eine Million?', options:['5','6','7','4'], correct:1 },
            { q:'Was ist größer: 500.000 oder 490.000?', options:['490.000','500.000','Gleich','Weiß nicht'], correct:1 },
            { q:'Runde 263.700 auf Zehntausender.', options:['260.000','270.000','300.000','250.000'], correct:0 },
            { q:'Was ergibt 700.000 + 30.000?', options:['703.000','730.000','7.030.000','7.300'], correct:1 },
            { q:'Welche Stelle ist fett in 3**4**7.528?', options:['Tausender','Hunderter','Zehnertausend','Hundertausend'], correct:0 }
          ],
          kompetenznachweis:[
            { q:'Wie lautet 4 Hunderttausender + 2 Zehntausender + 8 Tausender + 0 Hunderter + 3 Zehner + 6 Einer?', options:['428.036','428.360','420.836','42.836'], correct:0 },
            { q:'Runde 815.432 auf Hundertausender.', options:['800.000','900.000','810.000','820.000'], correct:0 },
            { q:'Was ist kleiner: 123.456 oder 213.456?', options:['213.456','123.456','Gleich','Weiß nicht'], correct:1 },
            { q:'Was ergibt 6 × 100.000?', options:['60.000','600.000','6.000.000','6.0000'], correct:1 },
            { q:'Was kommt nach 100.000?', options:['99.999','100.001','1.000.000','10.001'], correct:1 }
          ]
        },
        {
          id:'e2', type:'Rechnen', diff:2, title:'Schriftlich Multiplizieren und Dividieren',
          desc:'Schriftliche Multiplikation und Division anwenden.',
          ersteAnwendung:[
            { aufgabe:'Rechne schriftlich: 234 × 4 = ?', loesung:'936', hinweis:'4×4=16, 4×3=12+1=13, 4×2=8+1=9 → 936' },
            { aufgabe:'Rechne: 126 ÷ 3 = ?', loesung:'42', hinweis:'1÷3=0 Rest 1; 12÷3=4; 06÷3=2 → 42.' },
            { aufgabe:'Probe: 42 × 3 = ?', loesung:'126', hinweis:'Einmaleins!' }
          ],
          questions:[
            { q:'Was ergibt 318 × 3?', hint:'Stelle für Stelle von rechts.', options:['924','954','934','964'], correct:1, explanation:'3×8=24(schreib4,Ü2); 3×1=3+2=5; 3×3=9 → 954.' },
            { q:'Was ergibt 248 ÷ 4?', hint:'Schritt für Schritt.', options:['62','72','52','63'], correct:0, explanation:'24÷4=6; 08÷4=2 → 62.' },
            { q:'Was ergibt 543 × 6?', hint:'Übertrag sorgfältig notieren.', options:['3248','3258','3268','3218'], correct:1, explanation:'6×3=18(8,Ü1); 6×4=24+1=25(5,Ü2); 6×5=30+2=32 → 3258.' },
            { q:'Was ergibt 357 ÷ 7?', hint:'Einmaleins nutzen.', options:['49','51','47','53'], correct:1, explanation:'35÷7=5; 07÷7=1 → 51.' },
            { q:'Was ergibt 125 × 8?', hint:'8×5=40...', options:['1000','1040','990','1010'], correct:0, explanation:'8×5=40(0,Ü4); 8×2=16+4=20(0,Ü2); 8×1=8+2=10 → 1000.' },
            { q:'Was ergibt 196 ÷ 7?', hint:'7×?=196?', options:['27','28','29','26'], correct:1, explanation:'196÷7=28.' },
            { q:'Was ergibt 267 × 4?', hint:'4×7=28...', options:['1068','1048','1078','1028'], correct:0, explanation:'4×7=28(8,Ü2); 4×6=24+2=26(6,Ü2); 4×2=8+2=10 → 1068.' },
            { q:'Was ergibt 144 ÷ 6?', hint:'6×24=144', options:['22','24','26','20'], correct:1, explanation:'14÷6=2 Rest 2; 24÷6=4 → 24.' }
          ],
          minidiagnose:[
            { q:'214 × 3 = ?', options:['632','642','612','652'], correct:1 },
            { q:'135 ÷ 5 = ?', options:['25','27','29','23'], correct:1 },
            { q:'156 × 6 = ?', options:['936','926','946','916'], correct:0 },
            { q:'280 ÷ 7 = ?', options:['38','40','42','36'], correct:1 },
            { q:'204 × 5 = ?', options:['1000','1010','1020','1030'], correct:2 }
          ],
          kompetenznachweis:[
            { q:'328 × 4 = ?', options:['1312','1302','1322','1332'], correct:0 },
            { q:'252 ÷ 4 = ?', options:['63','62','64','61'], correct:0 },
            { q:'143 × 7 = ?', options:['1001','1011','1101','991'], correct:0 },
            { q:'315 ÷ 9 = ?', options:['33','35','37','31'], correct:1 },
            { q:'Was ergibt 5 × 248?', options:['1240','1230','1250','1260'], correct:0 }
          ]
        },
        {
          id:'e3', type:'Geometrie', diff:2, title:'Umfang und Fläche',
          desc:'Umfang und Flächeninhalt von Rechtecken berechnen.',
          ersteAnwendung:[
            { aufgabe:'Rechteck: Länge 8cm, Breite 4cm. Was ist der Umfang?', loesung:'24cm', hinweis:'U = 2×(8+4) = 2×12 = 24 cm.' },
            { aufgabe:'Gleiche Maße: Was ist die Fläche?', loesung:'32cm²', hinweis:'A = 8×4 = 32 cm².' },
            { aufgabe:'Quadrat: Seite 5cm. Was ist der Umfang?', loesung:'20cm', hinweis:'U = 4×5 = 20 cm.' }
          ],
          questions:[
            { q:'Rechteck: a=6cm, b=4cm. Was ist der Umfang?', hint:'U=2×(a+b).', options:['20cm','22cm','24cm','18cm'], correct:0, explanation:'U=2×(6+4)=2×10=20cm.' },
            { q:'Rechteck: a=7cm, b=3cm. Was ist die Fläche?', hint:'A=a×b.', options:['21cm²','20cm²','22cm²','21cm'], correct:0, explanation:'A=7×3=21cm².' },
            { q:'Quadrat mit Seite 6cm. Was ist der Flächeninhalt?', hint:'A=a×a.', options:['24cm²','36cm²','12cm²','36cm'], correct:1, explanation:'A=6×6=36cm².' },
            { q:'Umfang eines Quadrats ist 28cm. Wie lang ist eine Seite?', hint:'U=4×a → a=U÷4.', options:['4cm','7cm','8cm','6cm'], correct:1, explanation:'28÷4=7cm.' },
            { q:'Rechteck: A=30cm², b=5cm. Wie lang ist a?', hint:'A=a×b → a=A÷b.', options:['5cm','6cm','7cm','8cm'], correct:1, explanation:'30÷5=6cm.' },
            { q:'Ein Garten hat a=12m, b=8m. Was ist der Umfang?', hint:'U=2×(12+8).', options:['40m','96m','20m','48m'], correct:0, explanation:'U=2×20=40m.' },
            { q:'A=48m². a=8m. Was ist b?', hint:'48÷8=?', options:['5m','6m','7m','8m'], correct:1, explanation:'48÷8=6m.' },
            { q:'Was ist größer: U eines Quadrats (Seite 5cm) oder Umfang des Rechtecks (6cm×4cm)?', hint:'Beide Umfänge berechnen und vergleichen.', options:['Quadrat','Rechteck','Gleich','Weiß nicht'], correct:2, explanation:'Quadrat: 4×5=20cm. Rechteck: 2×(6+4)=20cm. Beide gleich!' }
          ],
          minidiagnose:[
            { q:'Rechteck: a=9cm, b=3cm. Umfang?', options:['24cm','27cm','12cm','36cm'], correct:0 },
            { q:'Quadrat: Seite 4cm. Fläche?', options:['16cm²','8cm²','12cm²','16cm'], correct:0 },
            { q:'Fläche=35cm², a=7cm. Was ist b?', options:['4cm','5cm','6cm','7cm'], correct:1 },
            { q:'Umfang eines Quadrats = 24cm. Seite?', options:['4cm','6cm','8cm','12cm'], correct:1 },
            { q:'Rechteck: a=10m, b=4m. Fläche?', options:['28m²','40m²','40m','14m'], correct:1 }
          ],
          kompetenznachweis:[
            { q:'Rechteck: a=15cm, b=6cm. Umfang?', options:['42cm','90cm','21cm','30cm'], correct:0 },
            { q:'Quadrat: Seite 9cm. Fläche?', options:['36cm²','72cm²','81cm²','81cm'], correct:2 },
            { q:'Zimmer: 5m×4m. Fläche?', options:['18m²','20m²','9m²','40m²'], correct:1 },
            { q:'Fläche=72m², a=9m. Was ist b?', options:['6m','7m','8m','9m'], correct:2 },
            { q:'Rechteck: Umfang=32cm, a=10cm. Was ist b?', options:['6cm','7cm','8cm','12cm'], correct:0 }
          ]
        }
      ]
    }]
  }
};
