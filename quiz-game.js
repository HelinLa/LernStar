// quiz-game.js — LernStar Quiz-Spiel 🎮
// Standalone quiz game for all grades, Mathe & Physik

// ============================================================
// FRAGEN-BANK
// ============================================================
const QUIZ_BANK = {
  mathe: {
    k5: [
      { q:"347 + 256 = ?", opts:["593","603","613","583"], a:1, hint:"Von rechts: 7+6=13, Übertrag 1; 4+5+1=10..." },
      { q:"8 × 7 = ?", opts:["54","56","64","48"], a:1, hint:"7er-Reihe: 7,14,21,28,35,42,49,56" },
      { q:"1000 − 487 = ?", opts:["413","513","523","533"], a:1, hint:"1000 − 500 = 500, dann +13 = 513" },
      { q:"48 ÷ 6 = ?", opts:["6","7","8","9"], a:2, hint:"6 × 8 = 48" },
      { q:"Welche Ziffer steht an der Hunderterstelle bei 3.478?", opts:["3","7","4","8"], a:2, hint:"T–H–Z–E: 3–4–7–8" },
      { q:"Runde 6.734 auf Tausender.", opts:["6.000","6.700","7.000","6.800"], a:2, hint:"Hunderterstelle ist 7 ≥ 5 → aufrunden" },
      { q:"Was ist ¾ von 28?", opts:["18","21","24","14"], a:1, hint:"28 ÷ 4 = 7 ; 7 × 3 = 21" },
      { q:"Rechteck: l = 8 cm, b = 5 cm. Fläche A = ?", opts:["26 cm²","40 cm²","13 cm²","24 cm²"], a:1, hint:"A = l × b" },
      { q:"½ + ¼ = ?", opts:["2/6","2/4","3/4","1/2"], a:2, hint:"Gleichnamig: 2/4 + 1/4 = 3/4" },
      { q:"Wie viele Minuten hat 2½ Stunden?", opts:["120","130","150","145"], a:2, hint:"2 × 60 + 30 = 150" },
      { q:"5² = ?", opts:["10","15","20","25"], a:3, hint:"5 × 5 = 25" },
      { q:"Quadrat: Seite 7 cm. Umfang U = ?", opts:["14 cm","21 cm","28 cm","49 cm"], a:2, hint:"U = 4 × a = 4 × 7" },
      { q:"Dreieck: g = 10 cm, h = 6 cm. Fläche?", opts:["60 cm²","30 cm²","16 cm²","32 cm²"], a:1, hint:"A = ½ × g × h" },
      { q:"60 % von 200 = ?", opts:["60","100","120","140"], a:2, hint:"200 × 0,6 = 120" },
      { q:"37 × 4 = ?", opts:["138","148","152","132"], a:1, hint:"30×4=120 , 7×4=28 → 148" },
      { q:"Welche Figur hat 4 gleich lange Seiten und 4 rechte Winkel?", opts:["Rechteck","Raute","Quadrat","Trapez"], a:2, hint:"Alle 4 Seiten gleich UND alle Winkel 90°" },
    ],
    k6: [
      { q:"(−3) + 7 = ?", opts:["−4","4","10","−10"], a:1, hint:"Starte bei −3, gehe 7 Schritte nach rechts" },
      { q:"(−5) × (−2) = ?", opts:["−10","10","7","−7"], a:1, hint:"Minus × Minus = Plus" },
      { q:"¾ ÷ ½ = ?", opts:["3/8","6/4 = 3/2","1/2","3/4"], a:1, hint:"Kehre den Divisor um: ¾ × 2 = 6/4 = 3/2" },
      { q:"0,7 × 0,4 = ?", opts:["0,28","2,8","0,028","1,1"], a:0, hint:"7 × 4 = 28, zwei Nachkommastellen" },
      { q:"Proportional: 4 Bücher = 12 €. 6 Bücher kosten?", opts:["15 €","18 €","20 €","24 €"], a:1, hint:"12 ÷ 4 = 3 € pro Buch; 3 × 6 = 18 €" },
      { q:"25 % von 80 = ?", opts:["15","20","25","40"], a:1, hint:"80 ÷ 4 = 20" },
      { q:"(−8) − (−3) = ?", opts:["−11","11","−5","5"], a:2, hint:"−(−3) = +3 → −8 + 3 = −5" },
      { q:"Kreisumfang: r = 7 cm, π ≈ 3,14. U ≈ ?", opts:["21,98 cm","43,96 cm","31,4 cm","14 cm"], a:1, hint:"U = 2 × π × r = 2 × 3,14 × 7" },
      { q:"30 % von ? = 12", opts:["30","36","40","50"], a:2, hint:"12 ÷ 0,30 = 40" },
      { q:"⅗ als Dezimalzahl?", opts:["0,35","0,53","0,6","0,5"], a:2, hint:"3 ÷ 5 = 0,6" },
      { q:"Wie viele Symmetrieachsen hat ein Rechteck?", opts:["0","1","2","4"], a:2, hint:"Waagrecht und senkrecht durch die Mitte" },
      { q:"Kreisfläche: r = 4 cm, π ≈ 3,14. A ≈ ?", opts:["12,56 cm²","25,12 cm²","50,24 cm²","16 cm²"], a:2, hint:"A = π × r² = 3,14 × 16" },
      { q:"(−4)² = ?", opts:["−16","8","−8","16"], a:3, hint:"(−4) × (−4) = +16" },
      { q:"Antiproportional: 4 Arbeiter = 6 Tage. 3 Arbeiter brauchen?", opts:["4,5 Tage","7 Tage","8 Tage","9 Tage"], a:2, hint:"4 × 6 = 3 × ? → ? = 8" },
      { q:"2² × 3 = ?", opts:["12","18","6","36"], a:0, hint:"2² = 4; 4 × 3 = 12" },
      { q:"5 : 4 als Dezimalzahl?", opts:["1,15","1,25","0,8","0,45"], a:1, hint:"5 ÷ 4 = 1,25" },
    ],
    k7: [
      { q:"2x + 5 = 13. Löse nach x.", opts:["x = 3","x = 4","x = 5","x = 9"], a:1, hint:"2x = 8 → x = 4" },
      { q:"3(x − 2) = 9. Löse nach x.", opts:["x = 3","x = 4","x = 5","x = 7"], a:2, hint:"x − 2 = 3 → x = 5" },
      { q:"Vereinfache: 4a + 3b − 2a + b", opts:["2a + 4b","6a + 4b","2a + 2b","6a + 2b"], a:0, hint:"(4−2)a + (3+1)b = 2a + 4b" },
      { q:"Pythagoras: a = 6 cm, b = 8 cm → Hypotenuse c = ?", opts:["10 cm","12 cm","14 cm","7 cm"], a:0, hint:"c² = 36 + 64 = 100 → c = 10" },
      { q:"Winkelsumme im Dreieck = ?", opts:["90°","180°","270°","360°"], a:1, hint:"Alle drei Innenwinkel zusammen" },
      { q:"Steigung m=2, y-Achsenabschnitt b=−3. Gleichung?", opts:["y = 3x−2","y = 2x+3","y = 2x−3","y = −3x+2"], a:2, hint:"y = mx + b = 2x + (−3) = 2x − 3" },
      { q:"Umfang Kreis d=10 cm, π≈3,14. U=?", opts:["31,4 cm","15,7 cm","78,5 cm","62,8 cm"], a:0, hint:"U = π × d = 3,14 × 10" },
      { q:"Innenwinkelsumme Viereck = ?", opts:["180°","270°","360°","540°"], a:2, hint:"Viereck = 2 Dreiecke → 2 × 180° = 360°" },
      { q:"Löse: x / 4 = 7", opts:["x = 4","x = 7","x = 28","x = 11"], a:2, hint:"x = 7 × 4 = 28" },
      { q:"Multipliziere aus: 3x(2x − 1)", opts:["5x − 3","6x² − 3x","6x − 3","5x² − 3"], a:1, hint:"3x·2x = 6x² ; 3x·(−1) = −3x" },
      { q:"f(x) = 2x − 4. x-Achsenabschnitt?", opts:["x = −2","x = 2","x = 4","x = 0"], a:1, hint:"0 = 2x − 4 → x = 2" },
      { q:"15 % von 60 = ?", opts:["9","15","12","6"], a:0, hint:"60 × 0,15 = 9" },
      { q:"Vergleiche: 3/4 __ 4/5", opts:["<","=",">","≠ (unklar)"], a:0, hint:"0,75 < 0,80 → Kleiner-Zeichen" },
      { q:"Was ist der Koeffizient in 5x²?", opts:["2","x","5x","5"], a:3, hint:"Der Koeffizient ist die Zahl vor der Variable" },
      { q:"Strecke A(2|3) bis B(6|3). Länge?", opts:["6","4","8","3"], a:1, hint:"Horizontale Strecke: |6 − 2| = 4" },
    ],
    k8: [
      { q:"Nullstellen von x² − 5x + 6 = 0?", opts:["x=2 und x=3","x=1 und x=6","x=−2 und x=−3","x=5 und x=1"], a:0, hint:"(x−2)(x−3) = 0 → x=2 oder x=3" },
      { q:"Scheitelpunkt von f(x) = (x−3)² + 5?", opts:["S(−3|5)","S(3|−5)","S(3|5)","S(5|3)"], a:2, hint:"Scheitelpunktform (x−d)²+e → S(d|e)" },
      { q:"Pythagoras: c=13, a=5. Andere Kathete b=?", opts:["8","10","12","√194"], a:2, hint:"b = √(13²−5²) = √144 = 12" },
      { q:"Modus von: 3,5,3,7,3,8,5?", opts:["5","3","7","8"], a:1, hint:"3 kommt 3-mal vor – häufigster Wert" },
      { q:"Vereinfache: (x+4)(x−4)", opts:["x²+16","x²−8x−16","x²−16","2x−16"], a:2, hint:"3. Binomische Formel: (a+b)(a−b) = a²−b²" },
      { q:"Steigung durch A(1|3) und B(3|7)?", opts:["m = 1","m = 2","m = 3","m = 4"], a:1, hint:"m = (7−3)/(3−1) = 4/2 = 2" },
      { q:"f(x) = 3x − 7. Berechne f(4).", opts:["5","12","1","19"], a:0, hint:"3 × 4 − 7 = 12 − 7 = 5" },
      { q:"Schnittpunkt: y = x+2 und y = −2x+8?", opts:["(2|4)","(3|7)","(1|3)","(6|2)"], a:0, hint:"x+2=−2x+8 → 3x=6 → x=2 → y=4" },
      { q:"Median von: 3, 5, 5, 7, 9?", opts:["5","6","7","9"], a:0, hint:"Mittlerer Wert (3. Stelle bei 5 Zahlen)" },
      { q:"Löse: x² = 49", opts:["x = 7","x = ±7","x = ±49","x = 24,5"], a:1, hint:"Beide Vorzeichen: ±7" },
      { q:"Potenz: 2³ × 2⁴ = ?", opts:["2⁷","4⁷","2¹²","4¹²"], a:0, hint:"Gleiche Basis → Exponenten addieren: 3+4=7" },
      { q:"Fläche Trapez: a=8, c=4, h=5?", opts:["20","30","40","16"], a:1, hint:"A = (a+c)/2 × h = 6 × 5 = 30" },
      { q:"Wohin öffnet f(x) = −2x²?", opts:["Nach oben","Nach unten","Nach rechts","Nach links"], a:1, hint:"Negativer Koeffizient → nach unten" },
      { q:"Potenz: 2⁰ = ?", opts:["0","1","2","−1"], a:1, hint:"Jede Zahl hoch 0 ergibt 1" },
      { q:"Löse: 4/x = 2", opts:["x = 2","x = 8","x = 6","x = 1"], a:0, hint:"x = 4 ÷ 2 = 2" },
    ],
    k9: [
      { q:"Scheitelpunkt von f(x) = x² − 6x + 8?", opts:["S(3|−1)","S(−3|−1)","S(3|1)","S(6|8)"], a:0, hint:"d = 6/2 = 3; f(3) = 9−18+8 = −1" },
      { q:"sin(30°) = ?", opts:["√3/2","√2/2","0,5","1"], a:2, hint:"30-60-90-Dreieck: sin(30°) = 1/2" },
      { q:"Kreisfläche: r = 5 cm, π≈3,14?", opts:["31,4 cm²","78,5 cm²","15,7 cm²","25 cm²"], a:1, hint:"A = π × r² = 3,14 × 25" },
      { q:"Ähnliche Dreiecke 1:3. Seite = 4 cm → andere?", opts:["7 cm","12 cm","9 cm","16 cm"], a:1, hint:"4 × 3 = 12 cm" },
      { q:"Würfel: P(gerade Zahl) = ?", opts:["1/6","1/3","1/2","2/3"], a:2, hint:"Gerade: 2,4,6 → 3 von 6 = 1/2" },
      { q:"Strahlensatz: ZA=4, ZB=5, ZA'=6 → ZB'=?", opts:["6","7","7,5","8"], a:2, hint:"ZB'/ZA' = ZB/ZA → ZB' = 6×5/4 = 7,5" },
      { q:"cos(60°) = ?", opts:["√3/2","0,5","1","√2/2"], a:1, hint:"cos(60°) = 1/2" },
      { q:"P(2× Kopf bei 2 Münzwürfen) = ?", opts:["1/2","1/3","1/4","3/4"], a:2, hint:"½ × ½ = ¼" },
      { q:"tan(45°) = ?", opts:["0","0,5","1","√2"], a:2, hint:"tan(45°) = 1 (gleichschenkliges rechtwinkliges Dreieck)" },
      { q:"Diskriminante D < 0 → Anzahl reeller Lösungen?", opts:["2","1","0","Unendlich"], a:2, hint:"D < 0: Parabel schneidet x-Achse nicht" },
      { q:"Außenwinkel Dreieck = ?", opts:["360° − Innenwinkel","Summe der 2 nicht-anliegenden Innenwinkel","90°","Doppelter Innenwinkel"], a:1, hint:"Außenwinkel = α + β (die beiden anderen Innenwinkel)" },
      { q:"Streckungsfaktor k=2: Fläche ändert sich um?", opts:["× 2","× 3","× 4","× 8"], a:2, hint:"Flächenmaßstab = k² = 4" },
      { q:"P(nicht Sechs) beim Würfel = ?", opts:["5/6","4/6","1/6","1/3"], a:0, hint:"1 − 1/6 = 5/6" },
      { q:"Stab 2 m Schatten 1,5 m; Baum Schatten 6 m → Baumhöhe?", opts:["4 m","8 m","6 m","12 m"], a:1, hint:"Baum/6 = 2/1,5 → Baum = 8 m" },
      { q:"Löse x² + 2x − 8 = 0.", opts:["x=2 und x=−4","x=4 und x=−2","x=1 und x=−8","x=8 und x=−1"], a:0, hint:"(x+4)(x−2)=0 → x=2 oder x=−4" },
    ],
    k10: [
      { q:"Ableitung von f(x) = 3x²?", opts:["3x","6x","6x²","9x"], a:1, hint:"Potenzregel: f'(x) = 2 × 3 × x¹ = 6x" },
      { q:"log₂(8) = ?", opts:["2","3","4","6"], a:1, hint:"2³ = 8 → log₂(8) = 3" },
      { q:"Vektoraddition: (2|3) + (4|−1) = ?", opts:["(6|4)","(6|2)","(8|2)","(2|4)"], a:1, hint:"Komponentenweise: (6|2)" },
      { q:"sin²(x) + cos²(x) = ?", opts:["0","1","2","sin(2x)"], a:1, hint:"Trigonometrischer Pythagoras – immer gültig" },
      { q:"Vollkreis in Bogenmaß = ?", opts:["π","2π","π/2","4π"], a:1, hint:"360° = 2π rad" },
      { q:"Ableitung von f(x) = sin(x)?", opts:["−sin(x)","cos(x)","−cos(x)","1/cos(x)"], a:1, hint:"(sin x)' = cos x" },
      { q:"|(−3|4)| = ?", opts:["7","5","1","√7"], a:1, hint:"√(9+16) = √25 = 5" },
      { q:"log(1000) = ? (Basis 10)", opts:["2","3","4","10"], a:1, hint:"10³ = 1000" },
      { q:"f(x) = 100 × 1,05ˣ. f(0) = ?", opts:["0","1","100","105"], a:2, hint:"1,05⁰ = 1 → 100 × 1 = 100" },
      { q:"Ableitung von f(x) = x³ − 2x + 1?", opts:["3x² − 2","x³ − 2","3x² − 2x","3x + 2"], a:0, hint:"Potenzregel: 3x² − 2" },
      { q:"Skalarprodukt (1|0) · (0|1) = ?", opts:["0 (senkrecht)","1","2","√2"], a:0, hint:"1·0 + 0·1 = 0 → senkrecht" },
      { q:"Inverse Funktion von f(x) = 2x?", opts:["f⁻¹(x) = x/2","f⁻¹(x) = 2x","f⁻¹(x) = x²","f⁻¹(x) = 1/(2x)"], a:0, hint:"y = 2x → x = y/2" },
      { q:"Was beschreibt ein Extrempunkt?", opts:["Nullstelle","Wendepunkt","Hoch- oder Tiefpunkt","y-Achsenabschnitt"], a:2, hint:"f'(x) = 0 und Vorzeichenwechsel" },
      { q:"Normalvektor zu (3|2) ist?", opts:["(3|2)","(−2|3)","(2|3)","(3|−2)"], a:1, hint:"Drehe 90°: (a|b) → (−b|a)" },
      { q:"e⁰ = ?", opts:["0","1","e","−1"], a:1, hint:"Jede Basis hoch 0 ergibt 1" },
    ],
    k11: [
      { q:"Hochpunkt von f(x) = −x² + 4x?", opts:["x = 0","x = 2","x = 4","x = −2"], a:1, hint:"f'(x) = −2x+4 = 0 → x = 2" },
      { q:"∫x dx = ?", opts:["1","x²","x²/2 + C","2x + C"], a:2, hint:"Exponent +1, durch neuen Exponenten teilen" },
      { q:"f(x) = eˣ → f'(x) = ?", opts:["xeˣ","eˣ","eˣ⁻¹","1/eˣ"], a:1, hint:"Die e-Funktion ist ihre eigene Ableitung" },
      { q:"Wendepunkt: Bedingung?", opts:["f'(x)=0","f''(x)=0 mit Vorzeichenwechsel","f(x)=0","f'(x)>0"], a:1, hint:"Krümmungswechsel → f''=0 UND Vorzeichenwechsel" },
      { q:"ln(e²) = ?", opts:["2e","e²","2","e"], a:2, hint:"ln(eˣ) = x" },
      { q:"Ableitung: f(x) = x⁴ − 3x² + 2?", opts:["4x³ − 6x","4x³ − 6x + 2","4x³ − 3x","x³ − 6x"], a:0, hint:"Potenzregel für jeden Term" },
      { q:"Fläche unter f(x) = 2x von 0 bis 3?", opts:["6","9","12","18"], a:1, hint:"[x²]₀³ = 9 − 0 = 9" },
      { q:"Produktregel: (u·v)' = ?", opts:["u'·v'","u·v'","u'·v + u·v'","u'·v − u·v'"], a:2, hint:"u'v + uv'" },
      { q:"Nullstelle von f(x) = eˣ − 1?", opts:["x = 0","x = 1","x = e","Keine"], a:0, hint:"eˣ = 1 → x = 0" },
      { q:"Monoton fallend: f'(x) ist ...?", opts:["> 0","= 0","< 0","≠ 0"], a:2, hint:"Fallend = negative Steigung" },
      { q:"log(a × b) = ?", opts:["log a × log b","log a + log b","log a − log b","log(a/b)"], a:1, hint:"Produkt → Summe der Logarithmen" },
      { q:"Kettenregel: f(x) = (2x+1)³ → f'(x) = ?", opts:["3(2x+1)²","6(2x+1)²","3(2x+1)³","(2x+1)²"], a:1, hint:"Äußere × Innere: 3(2x+1)² × 2" },
      { q:"Stammfunktion von f(x) = cos(x)?", opts:["−sin(x)","sin(x)","−cos(x)","tan(x)"], a:1, hint:"(sin x)' = cos x → Stammfunktion ist sin x" },
      { q:"Tiefpunkt: f'(x) = 0 und f''(x)?", opts:["< 0","= 0","> 0","≠ 0"], a:2, hint:"f'' > 0: Linkskrümmung → Tiefpunkt" },
      { q:"lim(x→∞) 1/x = ?", opts:["∞","1","0","−1"], a:2, hint:"Je größer x, desto kleiner 1/x → 0" },
    ],
    k12: [
      { q:"∫₀² x² dx = ?", opts:["4/3","8/3","4","2"], a:1, hint:"[x³/3]₀² = 8/3" },
      { q:"Determinante von ((1,2),(3,4))?", opts:["2","−2","10","−10"], a:1, hint:"1×4 − 2×3 = −2" },
      { q:"P(X=2) bei B(3; 0,5)?", opts:["0,375","0,25","0,5","0,125"], a:0, hint:"C(3,2)×0,5²×0,5 = 3×0,25×0,5 = 0,375" },
      { q:"Ableitung von f(x) = ln(x)?", opts:["1/x","ln(x)/x","x·ln(x)","eˣ"], a:0, hint:"(ln x)' = 1/x" },
      { q:"Was berechnet ein bestimmtes Integral?", opts:["Steigung","Flächeninhalt (algebraisch)","Scheitelpunkt","Ableitung"], a:1, hint:"∫ₐᵇ f(x)dx = orientierter Flächeninhalt" },
      { q:"Standardnormalverteilung: μ und σ?", opts:["μ=0, σ=1","μ=1, σ=0","μ=0, σ=0","μ=1, σ=1"], a:0, hint:"Standardisiert: Erwartungswert 0, Standardabw. 1" },
      { q:"∫eˣ dx = ?", opts:["eˣ + C","x·eˣ + C","eˣ−1 + C","1/eˣ + C"], a:0, hint:"eˣ ist seine eigene Stammfunktion" },
      { q:"Unabhängige Ereignisse: P(A∩B) = ?", opts:["P(A)+P(B)","P(A)−P(B)","P(A)×P(B)","P(A)/P(B)"], a:2, hint:"Unabhängig → Produkt der Einzelwahrscheinlichkeiten" },
      { q:"2ˣ = 16. x = ?", opts:["2","4","8","3"], a:1, hint:"2⁴ = 16" },
      { q:"Partielle Integration: ∫u·v' dx = ?", opts:["u·v + ∫u'·v dx","u·v − ∫u'·v dx","u'·v − ∫u·v' dx","u·v' − ∫u·v dx"], a:1, hint:"∫uv' = uv − ∫u'v" },
      { q:"Urne: 3 rot, 2 blau. P(rot) = ?", opts:["2/5","3/5","1/5","3/2"], a:1, hint:"3 von 5 = 3/5" },
      { q:"Varianz σ² beschreibt?", opts:["Den Mittelwert","Die Streubreite","Den Modus","Die Schiefe"], a:1, hint:"Je größer σ², desto breiter die Verteilung" },
      { q:"A × I (Einheitsmatrix) = ?", opts:["I","A","0","A²"], a:1, hint:"Einheitsmatrix ist das neutrale Element" },
      { q:"Normalverteilung: ±1σ deckt ca. ? % ab.", opts:["50%","68%","95%","99%"], a:1, hint:"68-95-99,7-Regel: ±1σ ≈ 68%" },
      { q:"∫sin(x) dx = ?", opts:["cos(x)+C","−cos(x)+C","sin(x)+C","−sin(x)+C"], a:1, hint:"(−cos x)' = sin x" },
    ],
    k13: [
      { q:"L'Hôpital: lim(x→0) sin(x)/x = ?", opts:["0","∞","1","π"], a:2, hint:"Form 0/0 → cos(x)/1 → cos(0) = 1" },
      { q:"Taylor-Reihe von eˣ beginnt mit?", opts:["1+x+x²/2+...","x+x²+x³+...","1+x²+x⁴+...","1−x+x²/2−..."], a:0, hint:"eˣ = 1 + x + x²/2! + x³/3! + ..." },
      { q:"Geometrische Reihe 1+½+¼+... konvergiert gegen?", opts:["1,5","2","3","∞"], a:1, hint:"S = a/(1−r) = 1/(1−0,5) = 2" },
      { q:"Komplexe Zahl z = 3+4i. |z| = ?", opts:["7","5","4","√7"], a:1, hint:"|z| = √(3²+4²) = 5" },
      { q:"Wahrscheinlichkeit ±1σ Normalverteilung?", opts:["50%","68,3%","95,4%","99,7%"], a:1, hint:"68-95-99,7-Regel" },
      { q:"Euler-Identität?", opts:["eⁱ = −1","eⁱᵖ + 1 = 0","eᵖⁱ = 1","e + iπ = 0"], a:1, hint:"eⁱᵖ + 1 = 0 – vereint e, i, π, 1, 0" },
      { q:"Poissonverteilung: Was ist λ?", opts:["Maximum","Varianz und Erwartungswert","Standardabweichung","Schiefe"], a:1, hint:"Bei Poisson: E(X) = Var(X) = λ" },
      { q:"f'>0 und f''>0 → f ist...?", opts:["Fallend, linksgekrümmt","Steigend, rechtsgekrümmt","Steigend, linksgekrümmt","Fallend, rechtsgekrümmt"], a:1, hint:"f'>0 steigend; f''>0 Rechtskrümmung" },
      { q:"Eigenwerte der Diagonalmatrix ((2,0),(0,3))?", opts:["2 und 3","5 und 1","6 und 0","2 und −3"], a:0, hint:"Diagonalelemente sind die Eigenwerte" },
      { q:"Zentraler Grenzwertsatz besagt?", opts:["Summen konvergieren gegen 0","Summen vieler unabh. ZV sind annähernd normalverteilt","Alle Verteilungen symmetrisch","Wahrscheinlichkeit → 1"], a:1, hint:"Grundlage der Statistik" },
      { q:"Doppelintegral ∬ Einheitsquadrat [0,1]² dA = ?", opts:["0","1","2","π"], a:1, hint:"Fläche des Einheitsquadrats = 1" },
      { q:"Mehrdimensionale Kettenregel: ∂f/∂t = ?", opts:["∂f/∂x+∂f/∂y","∂f/∂x·∂x/∂t+∂f/∂y·∂y/∂t","∂f/∂t×∂x/∂t","f'(t)"], a:1, hint:"Partielle Ableitungen × jeweilige t-Ableitungen" },
      { q:"Konvergiert Σ(1/n²) für n=1..∞?", opts:["Nein","Ja, gegen π²/6","Ja, gegen 1","Ja, gegen ∞"], a:1, hint:"Basler Problem: π²/6 ≈ 1,645" },
      { q:"Fourier-Transformation zerlegt Signal in?", opts:["Polynome","Frequenzanteile (Schwingungen)","Ableitungen","Matrizen"], a:1, hint:"Zeitbereich → Frequenzbereich" },
      { q:"Was beschreibt die Kovarianz zweier Zufallsgrößen?", opts:["Ihre Summe","Ihren linearen Zusammenhang","Ihr Produkt","Ihre Differenz"], a:1, hint:"Cov(X,Y) = E[(X−μₓ)(Y−μᵧ)] – positiv = gleichläufig" },
    ],
  },

  physik: {
    k5: [
      { q:"In welchem Zustand hat Wasser die geringste Dichte?", opts:["Fest (Eis)","Flüssig","Gasförmig","Immer gleich"], a:0, hint:"Eis schwimmt auf Wasser → geringere Dichte" },
      { q:"Bei welcher Temperatur siedet Wasser (normal)?", opts:["80°C","90°C","100°C","120°C"], a:2, hint:"Wasser kocht bei 100°C unter Normaldruck" },
      { q:"Was ist Schall?", opts:["Elektromagnetische Welle","Mechanische Schwingung/Welle","Lichtstrahlung","Wärmestrahlung"], a:1, hint:"Schall braucht ein Medium (Luft, Wasser, Feststoff)" },
      { q:"Welcher Aggregatzustand hat kein festes Volumen?", opts:["Fest","Flüssig","Gasförmig","Plasma"], a:2, hint:"Gase dehnen sich auf jeden Behälter aus" },
      { q:"Wie breitet sich Licht im Vakuum aus?", opts:["Als Schallwelle","Geradlinig","Immer gebogen","Gar nicht"], a:1, hint:"Licht fährt immer gerade, solange kein Medium es ablenkt" },
      { q:"Licht trifft auf einen Spiegel. Was passiert?", opts:["Absorption","Brechung","Reflexion","Es verschwindet"], a:2, hint:"Einfallswinkel = Ausfallswinkel" },
      { q:"Was ist die Einheit der Kraft?", opts:["Kilogramm","Meter","Newton","Joule"], a:2, hint:"Benannt nach Isaac Newton: [F] = N" },
      { q:"Welches Material leitet Wärme am besten?", opts:["Holz","Kunststoff","Metall","Luft"], a:2, hint:"Metalle sind gute Wärme- und Stromleiter" },
      { q:"Schall braucht zum Ausbreiten?", opts:["Nichts (Vakuum)","Ein Medium (Luft, Wasser...)","Licht","Magnetfeld"], a:1, hint:"Im Weltall ist es still – dort gibt es kein Medium" },
      { q:"Lichtgeschwindigkeit im Vakuum ≈ ?", opts:["300.000 km/s","300 km/s","3.000 km/s","30.000 km/s"], a:0, hint:"c ≈ 3 × 10⁸ m/s = 300.000 km/s" },
      { q:"Einheit der Energie?", opts:["Newton","Watt","Joule","Volt"], a:2, hint:"1 J = 1 N × 1 m" },
      { q:"Welche Farbe hat die höchste Frequenz im sichtbaren Licht?", opts:["Rot","Grün","Violett","Gelb"], a:2, hint:"Violett: kürzeste Wellenlänge, höchste Frequenz" },
      { q:"Aggregatzustandsänderung: flüssig → gasförmig heißt?", opts:["Schmelzen","Sieden/Verdampfen","Kondensieren","Gefrieren"], a:1, hint:"Wasser kocht → Dampf entsteht" },
      { q:"Thermometer misst?", opts:["Luftdruck","Windgeschwindigkeit","Temperatur","Luftfeuchtigkeit"], a:2, hint:"Thermo = Wärme, Meter = Messen" },
      { q:"Schwimmende Blasen steigen auf. Welche Kraft?", opts:["Schwerkraft","Auftriebskraft","Reibungskraft","Federkraft"], a:1, hint:"Auftrieb wirkt entgegen der Schwerkraft" },
    ],
    k6: [
      { q:"Drehmoment M = F × r. F=10 N, r=0,5 m. M=?", opts:["5 Nm","20 Nm","0,5 Nm","10 Nm"], a:0, hint:"M = 10 × 0,5 = 5 Nm" },
      { q:"Druck p = F/A. F=100 N, A=2 m². p=?", opts:["200 Pa","50 Pa","100 Pa","2 Pa"], a:1, hint:"p = 100/2 = 50 Pa" },
      { q:"Was ist die Einheit des Drucks?", opts:["Newton","Pascal","Joule","Watt"], a:1, hint:"Pa = N/m²" },
      { q:"Wann schwimmt ein Körper?", opts:["Masse > Wasser","Dichte < Dichte des Fluids","Dichte > Dichte des Fluids","Immer"], a:1, hint:"Schwimmen wenn ρ_Körper < ρ_Fluid" },
      { q:"Lageenergie: m=2 kg, h=5 m, g=10 m/s². E_pot=?", opts:["10 J","50 J","100 J","25 J"], a:2, hint:"E_pot = m×g×h = 2×10×5 = 100 J" },
      { q:"Was wandelt ein Elektromotor um?", opts:["Elektrisch → mechanisch","Chemisch → Wärme","Licht → Strom","Wärme → Strom"], a:0, hint:"Motor = elektrische Energie → Bewegungsenergie" },
      { q:"Welche Lichteigenschaft erklärt den Regenbogen?", opts:["Reflexion","Beugung","Brechung (Dispersion)","Interferenz"], a:2, hint:"Verschiedene Farben brechen unterschiedlich stark" },
      { q:"Gewichtskraft: G = m × g. m=5 kg, g=10 m/s². G=?", opts:["2 N","15 N","50 N","500 N"], a:2, hint:"G = 5 × 10 = 50 N" },
      { q:"1 kWh = ? Joule", opts:["1000 J","3.600 J","360.000 J","3.600.000 J"], a:3, hint:"1 kWh = 1000 W × 3600 s = 3,6 MJ" },
      { q:"Was beschreibt Dichte?", opts:["m/V","F/A","m×g","m/t"], a:0, hint:"ρ = m/V – Masse pro Volumen" },
      { q:"Feste Rolle verändert nur ...?", opts:["Betrag der Kraft","Richtung der Kraft","Energie","Gewicht"], a:1, hint:"Feste Rolle leitet die Kraft um, ändert aber nicht den Betrag" },
      { q:"Kinetische Energie einer Masse m, Geschwindigkeit v?", opts:["m×v","½×m×v","½×m×v²","m×v²"], a:2, hint:"E_kin = ½mv²" },
      { q:"Schiefer Ebene: Warum braucht man weniger Kraft?", opts:["Größere Geschwindigkeit","Größerer Weg, kleinere Kraft","Weniger Gewicht","Mehr Energie"], a:1, hint:"Goldene Regel der Mechanik: Kraft × Weg = konst." },
      { q:"Totalreflexion tritt auf, wenn Licht von ...?", opts:["Dünn zu dicht geht","Dicht zu dünn geht und Grenzwinkel überschritten wird","Auf Spiegel trifft","Durch Prisma geht"], a:1, hint:"Grenzwinkel überschritten → keine Brechung mehr möglich" },
      { q:"Hebelarm ist?", opts:["Die Kraft","Senkrechter Abstand Kraft–Drehpunkt","Die Masse","Die Beschleunigung"], a:1, hint:"M = F × r_senkrecht" },
    ],
    k7: [
      { q:"v = s/t. s=150 m, t=30 s. v=?", opts:["5 m/s","30 m/s","180 m/s","0,2 m/s"], a:0, hint:"v = 150/30 = 5 m/s" },
      { q:"Gleichförmige Bewegung: a=?", opts:["a>0","a<0","a=0","a=v"], a:2, hint:"Keine Geschwindigkeitsänderung → a=0" },
      { q:"1. Newtonsches Gesetz: Körper ohne Kraft ...?", opts:["Beschleunigt","Bewegt sich geradlinig gleichförmig","Bremst ab","Bleibt stets stehen"], a:1, hint:"Trägheitsprinzip: Zustand bleibt ohne Kraft erhalten" },
      { q:"F = m × a. F=20 N, m=4 kg. a=?", opts:["80 m/s²","0,2 m/s²","5 m/s²","16 m/s²"], a:2, hint:"a = F/m = 20/4 = 5 m/s²" },
      { q:"3. Newtonsches Gesetz: actio = reactio bedeutet?", opts:["Kraft verdoppelt sich","Gleich groß, entgegengesetzt, verschiedene Körper","Ungleich groß","Nur bei Reibung"], a:1, hint:"Kraft und Gegenkraft sind gleich groß, aber an verschiedenen Körpern" },
      { q:"Hubarbeit: W = m×g×h. m=3 kg, h=4 m, g=10. W=?", opts:["12 J","120 J","7 J","1,2 J"], a:1, hint:"W = 3×10×4 = 120 J" },
      { q:"Schallgeschwindigkeit in Luft (20°C) ≈ ?", opts:["300 m/s","340 m/s","1500 m/s","3000 m/s"], a:1, hint:"≈ 343 m/s – viel langsamer als Licht" },
      { q:"Was misst ein Dynamometer?", opts:["Temperatur","Geschwindigkeit","Kraft","Druck"], a:2, hint:"Dyna = Kraft (Federwaage)" },
      { q:"Frequenz ist?", opts:["Anzahl Schwingungen pro Sekunde","Amplitude","Dauer einer Schwingung","Maximale Auslenkung"], a:0, hint:"f = 1/T, Einheit: Hz" },
      { q:"Einheit der Geschwindigkeit?", opts:["m/s²","m/s","N/m","J/s"], a:1, hint:"Meter pro Sekunde (auch km/h)" },
      { q:"Welche Kraft wirkt zwischen Ladungen?", opts:["Gravitationskraft","Lorentzkraft","Coulombkraft","Normalkraft"], a:2, hint:"Coulomb: F ~ q₁×q₂/r²" },
      { q:"Welche Kraft hält ein Buch auf dem Tisch?", opts:["Gewichtskraft","Normalkraft","Reibungskraft","Federkraft"], a:1, hint:"Die Normalkraft wirkt senkrecht zur Unterlage" },
      { q:"Energieerhaltung: Wo ist E_kin am Pendel maximal?", opts:["Im Umkehrpunkt","In der Ruhelage","Beim Halbweg","Überall gleich"], a:1, hint:"In der Ruhelage ist v am größten" },
      { q:"Aggregatzustandsänderung: fest → flüssig heißt?", opts:["Sieden","Schmelzen","Kondensieren","Sublimieren"], a:1, hint:"Eis wird zu Wasser → Schmelzen" },
      { q:"Licht bricht beim Übergang von Luft in Wasser. Es wird?", opts:["Zum Lot hin gebrochen","Vom Lot weg gebrochen","Nicht gebrochen","Reflektiert"], a:0, hint:"Dicht zu dünn: vom Lot weg; dünn zu dicht: zum Lot hin" },
    ],
    k8: [
      { q:"R = U/I. U=12 V, I=3 A. R=?", opts:["36 Ω","4 Ω","9 Ω","15 Ω"], a:1, hint:"R = 12/3 = 4 Ω (Ohmsches Gesetz)" },
      { q:"Leistung P=U×I. U=230 V, I=2 A. P=?", opts:["115 W","460 W","232 W","228 W"], a:1, hint:"P = 230×2 = 460 W" },
      { q:"Parallelschaltung: Gesamtstrom = ?", opts:["Kleinstem Teilstrom","Größtem Teilstrom","Summe aller Teilströme","Produkt der Teilströme"], a:2, hint:"I_ges = I₁+I₂+I₃" },
      { q:"Reihenschaltung: Was ist für alle Bauteile gleich?", opts:["Spannung","Widerstand","Strom","Leistung"], a:2, hint:"In Reihe fließt derselbe Strom überall" },
      { q:"Elektrische Energie: W=U×I×t. U=12V, I=2A, t=10s. W=?", opts:["60 J","120 J","240 J","480 J"], a:2, hint:"W = 12×2×10 = 240 J" },
      { q:"Voltmeter wird ... geschaltet.", opts:["In Reihe","Parallel","Zwischen Erde und Bauteil","Senkrecht"], a:1, hint:"Voltmeter: parallel; Amperemeter: in Reihe" },
      { q:"Ohmsches Gesetz: R größer bei gleichem U → I ...?", opts:["Größer","Gleich","Kleiner","Unabhängig"], a:2, hint:"I = U/R – I wird kleiner wenn R wächst" },
      { q:"Sammellinse (Konvexlinse) bündelt parallele Strahlen ...?", opts:["Im Brennpunkt","Am Rand","Am Linsenmittelpunkt","Überall gleich"], a:0, hint:"Konvexlinse: F(Brennpunkt)" },
      { q:"Was wandelt eine Glühbirne hauptsächlich um?", opts:["Elektrisch → Licht (nur)","Elektrisch → Licht + Wärme","Chemisch → Licht","Mechanisch → Licht"], a:1, hint:"Größter Teil = Wärme (Verlust)" },
      { q:"Frequenz sichtbares Licht (ungefähr)?", opts:["10³ Hz","10⁹ Hz","10¹⁴ Hz","10²⁰ Hz"], a:2, hint:"4–8 × 10¹⁴ Hz" },
      { q:"Reflexionsgesetz: Einfallswinkel = ?", opts:["90°","Brechungswinkel","Ausfallswinkel","Grenzwinkel"], a:2, hint:"α_ein = α_aus" },
      { q:"Magnetfeld um stromdurchflossenen Leiter ist?", opts:["Geradlinig","Kreisförmig","Senkrecht nach oben","Nicht vorhanden"], a:1, hint:"Rechte-Hand-Regel: Daumen=Strom, Finger=Feldlinien" },
      { q:"Energie: W=P×t. P=500 W, t=2 h. W=?", opts:["250 Wh","1000 Wh","1500 Wh","2500 Wh"], a:1, hint:"W = 500×2 = 1000 Wh = 1 kWh" },
      { q:"Brechzahl n beschreibt?", opts:["Lichtgeschwindigkeit im Vakuum","Verhältnis c/c_Medium","Wellenlänge","Frequenz"], a:1, hint:"n = c / c_Medium" },
      { q:"Welches Bauteil speichert elektrische Ladung?", opts:["Widerstand","Spule","Kondensator","Diode"], a:2, hint:"Kondensator: Q = C × U" },
    ],
    k9: [
      { q:"Induktion: Induzierte Spannung entsteht durch?", opts:["Konstantes Magnetfeld","Änderndes Magnetfeld","Hohen Strom","Hohe Spannung"], a:1, hint:"Faradaysches Gesetz: dΦ/dt → U_ind" },
      { q:"Halbwertszeit: Nach 2 Halbwertszeiten ist noch ? % vorhanden.", opts:["50%","25%","12,5%","75%"], a:1, hint:"½ × ½ = ¼ = 25%" },
      { q:"Alpha-Strahler emittiert?", opts:["Elektron","Positron","Heliumkern (⁴He)","Photon"], a:2, hint:"Alpha = ²₄He-Kern (2p + 2n)" },
      { q:"Trafo: U₁/U₂ = N₁/N₂. U₁=230V, N₁=1000, N₂=50. U₂=?", opts:["11,5 V","4600 V","23 V","46 V"], a:0, hint:"U₂ = 230×50/1000 = 11,5 V" },
      { q:"Welche Strahlung hat die größte Reichweite?", opts:["α-Strahlung","β-Strahlung","γ-Strahlung","Alle gleich"], a:2, hint:"γ: elektromagnetisch, kaum abschirmbar" },
      { q:"Kernspaltung: Was entsteht bei Uran-235?", opts:["Größere Kerne","Zwei leichtere Kerne + Neutronen + Energie","Nur Neutronen","Nur Energie"], a:1, hint:"U-235 → Ba + Kr + 3n + E" },
      { q:"Welche Strahlung wird durch Papier abgeschirmt?", opts:["α-Strahlung","β-Strahlung","γ-Strahlung","Alle drei"], a:0, hint:"Alpha: wenige cm Luft oder ein Blatt Papier" },
      { q:"Lenzsche Regel: Induktionsstrom wirkt ...?", opts:["Verstärkend","Neutral","Entgegen seiner Ursache","Nur bei Gleichstrom"], a:2, hint:"Induktionsstrom bekämpft immer seine Ursache" },
      { q:"Elektromagnet: Was erhöht die Magnetkraft?", opts:["Weniger Windungen","Mehr Strom","Kleiner Kern","Dünner Draht"], a:1, hint:"Mehr Strom → stärkeres Magnetfeld" },
      { q:"Was ist ein Isotop?", opts:["Anderer Atomkern","Gleiche Protonenanzahl, andere Neutronenanzahl","Negativ geladenes Atom","Atomkomplex"], a:1, hint:"Gleiche Ordnungszahl Z, verschiedene Massenzahl A" },
      { q:"Kernfusion vereinigt?", opts:["Schwere Kerne (U, Pu)","Leichte Kerne (H, He)","Elektronen und Protonen","Neutronen und Photonen"], a:1, hint:"Sonne: H → He (Fusion)" },
      { q:"Magnetische Flussdichte B – Einheit?", opts:["Volt","Ampere","Tesla","Weber"], a:2, hint:"[B] = Tesla (T)" },
      { q:"Generator erzeugt Strom durch?", opts:["Chemische Reaktion","Rotation im Magnetfeld","Wärmeleitung","Reibung"], a:1, hint:"Rotation → änderndes Feld → Induktion" },
      { q:"Gammastrahlung wird am besten abgeschirmt durch?", opts:["Papier","Aluminium","Blei","Holz"], a:2, hint:"Blei: sehr dicht → hält γ auf" },
      { q:"Energie eines Photons E = h × f. Höhere Frequenz → ?", opts:["Weniger Energie","Gleiche Energie","Mehr Energie","Keine Energie"], a:2, hint:"E = hf: direkt proportional" },
    ],
    k10: [
      { q:"Photoeffekt: Welche Eigenschaft des Lichts ist entscheidend?", opts:["Intensität","Frequenz","Einfallswinkel","Brechzahl"], a:1, hint:"Einstein: E_Photon = h × f → Frequenz entscheidet" },
      { q:"Wellen-Teilchen-Dualismus: de-Broglie-Wellenlänge λ = ?", opts:["h/p","h×p","p/h","h×f"], a:0, hint:"λ = h/p = h/(mv)" },
      { q:"Massenzahl A = ?", opts:["Elektronen","Protonen","Protonen + Neutronen","Neutronen"], a:2, hint:"A = Z + N" },
      { q:"Elektrisches Feld: E=U/d. U=100V, d=0,02m. E=?", opts:["2 V/m","200 V/m","5000 V/m","5 V/m"], a:2, hint:"E = 100/0,02 = 5000 V/m" },
      { q:"Kernbindungsenergie pro Nukleon ist maximal bei?", opts:["Uran-238","Wasserstoff-1","Eisen-56","Helium-4"], a:2, hint:"Eisen-56: stabilster Kern" },
      { q:"Fotodiode wandelt um?", opts:["Strom → Licht","Licht → Strom","Wärme → Strom","Strom → Wärme"], a:1, hint:"Photoeffekt im Halbleiter" },
      { q:"Wellengleichung: c=f×λ. c=3×10⁸, λ=600nm. f=?", opts:["5×10¹⁴ Hz","5×10⁸ Hz","2×10⁻¹⁵ Hz","3×10⁸ Hz"], a:0, hint:"f = c/λ = 3×10⁸/600×10⁻⁹ = 5×10¹⁴ Hz" },
      { q:"Lorentzkraft F = q×v×B. Richtung?", opts:["Parallel zu v","Senkrecht zu v und B","Parallel zu B","Immer nach oben"], a:1, hint:"Linke-Hand-Regel (Elektronen)" },
      { q:"Transistor dient als?", opts:["Widerstand","Verstärker und Schalter","Kondensator","Spule"], a:1, hint:"Grundbaustein moderner Elektronik" },
      { q:"Massenzahl: Welcher Kernbestandteil fehlt?", opts:["Proton","Neutron","Elektron","Quark"], a:2, hint:"Elektronen sind nicht im Kern" },
      { q:"E = Δm × c². Was ist Δm?", opts:["Gesamtmasse","Massendefekt","Bindungsenergie","Ordnungszahl"], a:1, hint:"Massendefekt → wird zu Energie" },
      { q:"Compton-Effekt: Wellenlänge des Photons nach Streuung?", opts:["Kleiner","Gleich","Größer","Wird null"], a:2, hint:"Photon gibt Energie ab → kleinere f → größere λ" },
      { q:"Halbleiter: Welches Element ist typisch?", opts:["Kupfer","Eisen","Silizium","Blei"], a:2, hint:"Si (Silizium) und Ge (Germanium)" },
      { q:"Energiebändermodell: Leiter haben Leitungsband?", opts:["Weit getrennt","Überlappend","Mit Bandlücke","Nicht vorhanden"], a:1, hint:"Leiter: Leitungsband teilweise besetzt" },
      { q:"Supraleitung tritt auf bei?", opts:["Hoher Temperatur","Sehr tiefer Temperatur (< Tc)","Hohem Druck","Starkem Magnetfeld"], a:1, hint:"Unterhalb Tc: R = 0 exakt" },
    ],
    k11: [
      { q:"Beschleunigte Bewegung: s = ?", opts:["v×t","½×a×t²","a×t","v₀+a×t"], a:1, hint:"Weg bei gleichmäßiger Beschleunigung" },
      { q:"Impuls: p=m×v. m=5 kg, v=10 m/s. p=?", opts:["50 kg·m/s","0,5 kg·m/s","15 kg·m/s","500 kg·m/s"], a:0, hint:"p = 5×10 = 50 kg·m/s" },
      { q:"Energieerhaltung: h=10m, g=10m/s². v am Boden?", opts:["10 m/s","14,1 m/s","20 m/s","100 m/s"], a:1, hint:"v = √(2gh) = √200 ≈ 14,1 m/s" },
      { q:"Freier Fall: t=3 s, g=10 m/s². v=?", opts:["10 m/s","20 m/s","30 m/s","45 m/s"], a:2, hint:"v = g×t = 10×3 = 30 m/s" },
      { q:"a = Δv/Δt. Δv=20m/s, Δt=4s. a=?", opts:["80 m/s²","5 m/s²","24 m/s²","0,2 m/s²"], a:1, hint:"a = 20/4 = 5 m/s²" },
      { q:"Kreisbewegung: Welche Kraft wirkt zum Mittelpunkt?", opts:["Gewichtskraft","Normalkraft","Zentripetalkraft","Reaktionskraft"], a:2, hint:"Fp = mv²/r – immer zum Zentrum" },
      { q:"v-t Diagramm gleichförmige Bewegung zeigt?", opts:["Fallende Linie","Horizontale Gerade","Parabel","Steigende Gerade"], a:1, hint:"v = konst → horizontale Linie" },
      { q:"Gravitationsgesetz: Abstand verdoppelt → F?", opts:["Halbiert","Viertel","Gleich","Doppelt"], a:1, hint:"F ~ 1/r² → (2r)² = 4r² → F/4" },
      { q:"Reibungskraft: F_R=μ×F_N. μ=0,3, F_N=100N. F_R=?", opts:["300 N","33 N","30 N","3 N"], a:2, hint:"F_R = 0,3×100 = 30 N" },
      { q:"Arbeit bei F senkrecht zum Weg (φ=90°)?", opts:["F×s","0","−F×s","F×s/2"], a:1, hint:"W = F×s×cos(90°) = 0" },
      { q:"s-t Diagramm bei beschleunigter Bewegung zeigt?", opts:["Gerade Linie","Parabel","Horizontale Linie","Senkrechte Linie"], a:1, hint:"s = ½at² → Parabel" },
      { q:"Impulserhaltung gilt, wenn?", opts:["Keine äußeren Kräfte wirken","Reibung wirkt","Alle Kräfte gleich sind","Energie erhalten bleibt"], a:0, hint:"F_ext = 0 → p_ges = const" },
      { q:"Leistung: P=F×v. F=500 N, v=4 m/s. P=?", opts:["125 W","504 W","2000 W","496 W"], a:2, hint:"P = 500×4 = 2000 W" },
      { q:"Kepler 3. Gesetz: T² ~ r³. Größerer Orbit → T?", opts:["Kürzer","Gleich","Länger","Unabhängig"], a:2, hint:"Größerer Abstand → längere Umlaufzeit" },
      { q:"Welche Diagrammform zeigt v(t) bei freiem Fall?", opts:["Parabel","Horizontale Gerade","Ansteigende Gerade","Hyperbel"], a:2, hint:"v = g×t → linearer Anstieg" },
    ],
    k12: [
      { q:"Harmonische Schwingung: x(t) = A×sin(ωt). Was ist A?", opts:["Frequenz","Kreisfrequenz","Amplitude","Periode"], a:2, hint:"A = maximale Auslenkung" },
      { q:"c = f × λ. Größere Frequenz → Wellenlänge?", opts:["Größer","Gleich","Kleiner","Unabhängig"], a:2, hint:"c konstant → f×λ=c → λ = c/f kleiner" },
      { q:"Interferenz konstruktiv: Gangunterschied = ?", opts:["λ/2","λ (oder n×λ)","0,75λ","2,5λ"], a:1, hint:"Gleiche Phase: n×λ → Verstärkung" },
      { q:"Magnetische Energie Spule: W=½LI². L=2H, I=3A. W=?", opts:["3 J","6 J","9 J","18 J"], a:2, hint:"W = ½×2×9 = 9 J" },
      { q:"Stehende Welle – wo sind die Knoten?", opts:["Amplitude maximal","Amplitude = 0","In der Mitte","An den Enden (offen)"], a:1, hint:"Knoten = keine Schwingung" },
      { q:"Doppler-Effekt: Schallquelle nähert sich → Frequenz?", opts:["Niedriger","Gleich","Höher","Null"], a:2, hint:"Nähern → Wellenlänge kürzer → f höher" },
      { q:"Kapazität: C=Q/U. Q=0,01 C, U=100 V. C=?", opts:["10 F","1000 F","0,0001 F","10000 F"], a:2, hint:"C = 0,01/100 = 100 μF = 10⁻⁴ F" },
      { q:"Elektromagnetisches Spektrum: Kürzeste Wellenlänge?", opts:["Radiowellen","Mikrowellen","Röntgenstrahlung","Gammastrahlung"], a:3, hint:"γ < X < UV < sichtbar < IR < Mikro < Radio" },
      { q:"Induktivität – Einheit?", opts:["Ohm (Ω)","Farad (F)","Henry (H)","Weber (Wb)"], a:2, hint:"[L] = Henry (H) = V·s/A" },
      { q:"Maxwell-Gleichungen beschreiben?", opts:["Mechanik","Thermodynamik","Elektromagnetismus","Quantenmechanik"], a:2, hint:"4 Gleichungen für E- und B-Felder" },
      { q:"Wellen transportieren?", opts:["Materie","Ladung","Energie (ohne Materietransport)","Masse"], a:2, hint:"Wellen übertragen Energie, nicht Materie" },
      { q:"Schwingkreis: Resonanz f = 1/(2π√LC). Größeres C → f?", opts:["Größer","Kleiner","Gleich","Unabhängig"], a:1, hint:"Größeres C → größeres LC → kleineres f" },
      { q:"Strom in Spule bei Wechselspannung: I eilt U um?", opts:["0°","90° vor","90° nach","180°"], a:2, hint:"Induktiv: Strom hinkt der Spannung nach" },
      { q:"Stehende Welle λ=2L/n. Halbwelle (n=1): λ=?", opts:["L","2L","L/2","4L"], a:1, hint:"n=1 → λ=2L/1 = 2L" },
      { q:"Energieübertragung bei elektromagnetischen Wellen?", opts:["Durch Materie","Durch Vakuum (ohne Träger)","Nur durch Luft","Nur durch Leiter"], a:1, hint:"EM-Wellen brauchen kein Medium" },
    ],
    k13: [
      { q:"Spezielle Relativitätstheorie: Was ist konstant für alle Inertialsysteme?", opts:["Zeit","Länge","Lichtgeschwindigkeit","Masse"], a:2, hint:"2. Postulat Einsteins: c ≈ 3×10⁸ m/s überall gleich" },
      { q:"Zeitdilatation: Δt'=Δt/√(1−v²/c²). Bei v→c wird Δt'?", opts:["Kleiner","Gleich","Größer","Null"], a:2, hint:"Nenner→0 → Δt'→∞ (bewegte Uhren laufen langsamer)" },
      { q:"Heisenbergsche Unschärferelation: Δx×Δp ≥ ?", opts:["0","h","h/2","h/(4π)"], a:3, hint:"ΔxΔp ≥ ħ/2 = h/(4π)" },
      { q:"Massenäquivalenz: E=mc². 1 kg ≈ ? Joule?", opts:["3×10⁸ J","9×10¹⁶ J","3×10¹⁶ J","9×10⁸ J"], a:1, hint:"E = 1×(3×10⁸)² = 9×10¹⁶ J" },
      { q:"Aus was bestehen Protonen?", opts:["3 Elektronen","3 Quarks (uud)","2 Quarks (ud)","1 Quark+Elektron"], a:1, hint:"Proton = 2 Up-Quarks + 1 Down-Quark" },
      { q:"Tunneleffekt: Ein Quantenteilchen kann?", opts:["Sich teilen","Potenzialbarriere durchdringen","Schneller als Licht","Masse verlieren"], a:1, hint:"Quanteneffekt: Wellenfunktion dringt in Barriere ein" },
      { q:"Higgs-Boson (entdeckt 2012) gibt anderen Teilchen?", opts:["Ladung","Masse","Spin","Farbe"], a:1, hint:"Wechselwirkung mit Higgs-Feld → Masse" },
      { q:"2. Hauptsatz Thermodynamik: Entropie geschlossenes System?", opts:["Nimmt ab","Bleibt konstant","Nimmt zu oder bleibt konstant","Sinkt bei Kühlung"], a:2, hint:"dS ≥ 0 – Unordnung nimmt nie spontan ab" },
      { q:"Schrödingers Gleichung beschreibt?", opts:["Elektrische Felder","Wellenfunktion Ψ","Relativität","Kernreaktionen"], a:1, hint:"|Ψ|² = Aufenthaltswahrscheinlichkeit" },
      { q:"Quantenchromodynamik (QCD) beschreibt?", opts:["Elektromagnetismus","Schwache Kernkraft","Starke Kernkraft","Gravitation"], a:2, hint:"QCD: Quarks und Gluonen – starke Wechselwirkung" },
      { q:"Hawking-Strahlung entsteht durch?", opts:["Kernfusion","Quantenfluktuationen am Ereignishorizont","Cherenkov-Strahlung","Röntgenstrahlung"], a:1, hint:"Virtuelles Teilchenpaar am Schwarzen Loch" },
      { q:"CPT-Symmetrie: C steht für?", opts:["Ladungskonjugation","Coulomb","Compton","Coulomb-Konstante"], a:0, hint:"C=Ladungsumkehr, P=Raumspiegelung, T=Zeitumkehr" },
      { q:"Kosmologische Konstante Λ steht für?", opts:["Lichtgeschwindigkeit","Entropie","Dunkle Energie / beschleunigte Ausdehnung","Gravitationskonstante"], a:2, hint:"Λ: repulsive Kraft → beschleunigte Expansion" },
      { q:"Planck-Länge (≈ 1,6×10⁻³⁵ m) beschreibt?", opts:["Atomgröße","Kleinste physikalisch sinnvolle Skala","γ-Wellenlänge","Kerngröße"], a:1, hint:"Unterhalb Planck-Länge versagen alle Theorien" },
      { q:"de-Broglie: Welcher Gegenstand hat eine Wellenlänge?", opts:["Nur Photonen","Nur Elektronen","Alle Objekte (auch Fußball)","Nur Atome"], a:2, hint:"λ=h/p gilt für alle Massen – aber normalerweise winzig" },
    ],
  },
};

// ============================================================
// GAME STATE
// ============================================================
let _qg = {
  subject: null, grade: null, questions: [], idx: 0,
  score: 0, lives: 3, streak: 0, answered: false,
  timer: null, timeLeft: 30,
  used5050: false, usedFreezeTime: false,
  frozen: false, frozenTimeLeft: 0,
};

// ============================================================
// OPEN QUIZ GAME (SELECTION SCREEN)
// ============================================================
function openQuizGame() {
  if (document.getElementById('qgOverlay')) return;
  const ov = document.createElement('div');
  ov.id = 'qgOverlay';
  ov.innerHTML = `
  <div class="qg-select-box">
    <button class="qg-close-btn" onclick="closeQuizGame()">✕</button>
    <div class="qg-logo">🎮</div>
    <h2 class="qg-select-title">Quiz-Spiel</h2>
    <p class="qg-select-sub">Wähle dein Fach und deine Klasse und beweise dein Wissen!</p>
    <div class="qg-subj-row">
      <button class="qg-subj-btn" id="qgBtnMath" onclick="qgPickSubject('mathe')">📐 Mathe</button>
      <button class="qg-subj-btn" id="qgBtnPhys" onclick="qgPickSubject('physik')">⚡ Physik</button>
    </div>
    <div class="qg-grade-grid">
      ${['k5','k6','k7','k8','k9','k10','k11','k12','k13'].map((k,i)=>`
        <button class="qg-grade-btn" id="qgGrade_${k}" onclick="qgPickGrade('${k}')">Kl. ${i+5}</button>
      `).join('')}
    </div>
    <button class="qg-start-btn" id="qgStartBtn" onclick="qgStartGame()" disabled>🚀 Spielen!</button>
    <div class="qg-rules">⏱ 30 Sek. pro Frage &nbsp;|&nbsp; ❤️ 3 Leben &nbsp;|&nbsp; 🔥 Streak-Bonus &nbsp;|&nbsp; 10 Fragen</div>
  </div>`;
  document.body.appendChild(ov);
}

function qgPickSubject(s) {
  _qg.subject = s;
  document.querySelectorAll('.qg-subj-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(s === 'mathe' ? 'qgBtnMath' : 'qgBtnPhys').classList.add('active');
  qgCheckReady();
}

function qgPickGrade(g) {
  _qg.grade = g;
  document.querySelectorAll('.qg-grade-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('qgGrade_' + g).classList.add('active');
  qgCheckReady();
}

function qgCheckReady() {
  const btn = document.getElementById('qgStartBtn');
  if (btn) btn.disabled = !(_qg.subject && _qg.grade);
}

// ============================================================
// START GAME
// ============================================================
function qgStartGame() {
  const pool = QUIZ_BANK[_qg.subject]?.[_qg.grade] || [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  _qg.questions = shuffled.slice(0, 10);
  _qg.idx = 0; _qg.score = 0; _qg.lives = 3; _qg.streak = 0;
  _qg.answered = false; _qg.used5050 = false; _qg.usedFreezeTime = false;
  _qg.frozen = false;

  const gradeNum = { k5:'5',k6:'6',k7:'7',k8:'8',k9:'9',k10:'10',k11:'11',k12:'12',k13:'13' }[_qg.grade];
  const subjectLabel = _qg.subject === 'mathe' ? '📐 Mathe' : '⚡ Physik';

  const ov = document.getElementById('qgOverlay');
  ov.innerHTML = `
  <div class="qg-game-box" id="qgGameBox">
    <div class="qg-header">
      <button class="qg-hdr-back" onclick="qgAskQuit()">✕</button>
      <div class="qg-hdr-subj">${subjectLabel} · Kl. ${gradeNum}</div>
      <div class="qg-hdr-right">
        <span class="qg-lives" id="qgLives">❤️❤️❤️</span>
        <span class="qg-streak" id="qgStreak" style="display:none">🔥 <b id="qgStreakNum">0</b></span>
        <span class="qg-score-disp">💎 <b id="qgScoreDisp">0</b></span>
      </div>
    </div>

    <div class="qg-timer-wrap">
      <svg class="qg-timer-svg" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="26" fill="none" stroke="#e2e8f0" stroke-width="5"/>
        <circle cx="30" cy="30" r="26" fill="none" stroke="#7C3AED" stroke-width="5"
          stroke-dasharray="163.4" stroke-dashoffset="0" stroke-linecap="round"
          transform="rotate(-90 30 30)" id="qgTimerRing"/>
      </svg>
      <div class="qg-timer-text" id="qgTimerText">30</div>
    </div>

    <div class="qg-progress-wrap">
      <div class="qg-q-counter" id="qgCounter">Frage 1 von 10</div>
      <div class="qg-bar-bg"><div class="qg-bar-fill" id="qgBarFill" style="width:0%"></div></div>
    </div>

    <div class="qg-question" id="qgQuestion">Laden…</div>

    <div class="qg-options" id="qgOptions"></div>

    <div class="qg-powerups">
      <button class="qg-pu-btn" id="qgPu5050" onclick="qgUse5050()" title="Entfernt 2 falsche Antworten">🃏 50/50</button>
      <button class="qg-pu-btn" id="qgPuFreeze" onclick="qgUseFreeze()" title="Friert den Timer für 10 Sekunden ein">⏸ +10 Sek.</button>
    </div>

    <div class="qg-hint-wrap" id="qgHintWrap" style="display:none">
      <span class="qg-hint-text" id="qgHintText"></span>
    </div>

    <div class="qg-feedback" id="qgFeedback" style="display:none"></div>

    <button class="qg-next-btn" id="qgNextBtn" onclick="qgNext()" style="display:none">Weiter →</button>
  </div>`;

  qgRenderQ();
}

// ============================================================
// RENDER QUESTION
// ============================================================
function qgRenderQ() {
  const q = _qg.questions[_qg.idx];
  _qg.answered = false;
  _qg.timeLeft = 30;
  _qg.frozen = false;

  document.getElementById('qgCounter').textContent = `Frage ${_qg.idx + 1} von ${_qg.questions.length}`;
  document.getElementById('qgBarFill').style.width = (_qg.idx / _qg.questions.length * 100) + '%';
  document.getElementById('qgQuestion').textContent = q.q;
  document.getElementById('qgFeedback').style.display = 'none';
  document.getElementById('qgNextBtn').style.display = 'none';
  document.getElementById('qgHintWrap').style.display = 'none';

  const labels = ['A','B','C','D'];
  const opts = document.getElementById('qgOptions');
  opts.innerHTML = q.opts.map((o, i) =>
    `<button class="qg-opt" id="qgOpt${i}" onclick="qgAnswer(${i})">${labels[i]}: ${o}</button>`
  ).join('');

  // Restore power-up states
  document.getElementById('qgPu5050').disabled = _qg.used5050;
  document.getElementById('qgPuFreeze').disabled = _qg.usedFreezeTime;
  if (_qg.used5050) document.getElementById('qgPu5050').classList.add('qg-pu-used');
  if (_qg.usedFreezeTime) document.getElementById('qgPuFreeze').classList.add('qg-pu-used');

  qgStartTimer();
}

// ============================================================
// TIMER
// ============================================================
function qgStartTimer() {
  clearInterval(_qg.timer);
  qgUpdateTimerRing();
  _qg.timer = setInterval(() => {
    if (_qg.frozen) return;
    _qg.timeLeft--;
    qgUpdateTimerRing();
    if (_qg.timeLeft <= 0) {
      clearInterval(_qg.timer);
      qgTimeUp();
    }
  }, 1000);
}

function qgUpdateTimerRing() {
  const ring = document.getElementById('qgTimerRing');
  const txt  = document.getElementById('qgTimerText');
  if (!ring || !txt) return;
  const pct = _qg.timeLeft / 30;
  const circ = 163.4;
  ring.style.strokeDashoffset = circ * (1 - pct);
  ring.style.stroke = _qg.timeLeft > 10 ? '#7C3AED' : (_qg.timeLeft > 5 ? '#F59E0B' : '#DC2626');
  txt.textContent = _qg.timeLeft;
  txt.style.color = _qg.timeLeft > 10 ? '#334155' : (_qg.timeLeft > 5 ? '#D97706' : '#DC2626');
}

function qgTimeUp() {
  if (_qg.answered) return;
  _qg.answered = true;
  _qg.streak = 0;
  _qg.lives--;
  qgUpdateHeader();
  const q = _qg.questions[_qg.idx];
  document.querySelectorAll('.qg-opt').forEach(b => b.disabled = true);
  document.getElementById(`qgOpt${q.a}`).classList.add('qg-correct');
  qgShowFeedback(false, '⏱ Zeit abgelaufen! ' + q.hint);
  if (_qg.lives <= 0) {
    setTimeout(() => qgShowResult(), 1400);
  } else {
    document.getElementById('qgNextBtn').style.display = '';
  }
}

// ============================================================
// ANSWER
// ============================================================
function qgAnswer(idx) {
  if (_qg.answered) return;
  _qg.answered = true;
  clearInterval(_qg.timer);

  const q = _qg.questions[_qg.idx];
  const correct = idx === q.a;

  document.querySelectorAll('.qg-opt').forEach(b => b.disabled = true);
  document.getElementById(`qgOpt${idx}`).classList.add(correct ? 'qg-correct' : 'qg-wrong');
  if (!correct) document.getElementById(`qgOpt${q.a}`).classList.add('qg-correct');

  if (correct) {
    _qg.streak++;
    let pts = 100;
    if (_qg.timeLeft >= 20) pts += 50;      // speed bonus
    pts += Math.max(0, (_qg.streak - 2)) * 25; // streak bonus
    _qg.score += pts;
    qgShowFeedback(true, `✅ Richtig! +${pts} Punkte${_qg.streak >= 3 ? ' 🔥 Streak x' + _qg.streak : ''}`);
  } else {
    _qg.streak = 0;
    _qg.lives--;
    qgShowFeedback(false, `❌ Falsch. 💡 ${q.hint}`);
  }

  qgUpdateHeader();
  qgShowHint(q.hint);

  if (_qg.lives <= 0) {
    setTimeout(() => qgShowResult(), 1500);
  } else {
    document.getElementById('qgNextBtn').style.display = '';
  }
}

function qgShowFeedback(ok, msg) {
  const el = document.getElementById('qgFeedback');
  el.style.display = '';
  el.className = 'qg-feedback ' + (ok ? 'qg-fb-ok' : 'qg-fb-err');
  el.textContent = msg;
}

function qgShowHint(hint) {
  const el = document.getElementById('qgHintWrap');
  document.getElementById('qgHintText').textContent = '💡 ' + hint;
  el.style.display = '';
}

function qgUpdateHeader() {
  const livesEl = document.getElementById('qgLives');
  const streakEl = document.getElementById('qgStreak');
  const streakNum = document.getElementById('qgStreakNum');
  const scoreEl = document.getElementById('qgScoreDisp');
  if (livesEl) livesEl.textContent = '❤️'.repeat(_qg.lives) + '🖤'.repeat(3 - _qg.lives);
  if (streakEl) {
    if (_qg.streak >= 2) {
      streakEl.style.display = '';
      streakNum.textContent = _qg.streak;
    } else {
      streakEl.style.display = 'none';
    }
  }
  if (scoreEl) {
    scoreEl.textContent = _qg.score;
    scoreEl.parentElement.classList.add('qg-score-bump');
    setTimeout(() => scoreEl.parentElement.classList.remove('qg-score-bump'), 400);
  }
}

// ============================================================
// POWER-UPS
// ============================================================
function qgUse5050() {
  if (_qg.used5050 || _qg.answered) return;
  _qg.used5050 = true;
  document.getElementById('qgPu5050').disabled = true;
  document.getElementById('qgPu5050').classList.add('qg-pu-used');
  const q = _qg.questions[_qg.idx];
  const wrongs = [0,1,2,3].filter(i => i !== q.a);
  const toHide = wrongs.sort(() => Math.random()-0.5).slice(0,2);
  toHide.forEach(i => {
    const b = document.getElementById(`qgOpt${i}`);
    if (b) { b.disabled = true; b.classList.add('qg-opt-hidden'); }
  });
}

function qgUseFreeze() {
  if (_qg.usedFreezeTime || _qg.answered) return;
  _qg.usedFreezeTime = true;
  _qg.frozen = true;
  document.getElementById('qgPuFreeze').disabled = true;
  document.getElementById('qgPuFreeze').classList.add('qg-pu-used');
  _qg.timeLeft = Math.min(30, _qg.timeLeft + 10);
  qgUpdateTimerRing();
  // Unfreeze after 8 seconds
  setTimeout(() => { _qg.frozen = false; }, 8000);
}

// ============================================================
// NEXT QUESTION
// ============================================================
function qgNext() {
  _qg.idx++;
  if (_qg.idx >= _qg.questions.length) {
    qgShowResult();
  } else {
    qgRenderQ();
  }
}

// ============================================================
// RESULT
// ============================================================
function qgShowResult() {
  clearInterval(_qg.timer);
  const total = _qg.questions.length;
  const correct = Math.round(_qg.score / 100); // rough estimate
  const pct = Math.round((_qg.score / (total * 150)) * 100);

  // Highscore
  const hsKey = `qg_hs_${_qg.subject}_${_qg.grade}`;
  const oldHs = parseInt(localStorage.getItem(hsKey) || '0');
  const newRecord = _qg.score > oldHs;
  if (newRecord) localStorage.setItem(hsKey, _qg.score);
  const displayHs = Math.max(oldHs, _qg.score);

  let emoji, title, msg;
  if (_qg.score >= 1200) { emoji='🏆'; title='Absolut genial!'; msg='Du bist ein echter Lernstar! Top-Ergebnis!'; }
  else if (_qg.score >= 800) { emoji='🎉'; title='Super gemacht!'; msg='Fantastisch! Du kennst die Themen richtig gut!'; }
  else if (_qg.score >= 500) { emoji='👍'; title='Gut versucht!'; msg='Schon ordentlich – mehr Übung macht noch stärker!'; }
  else { emoji='💪'; title='Nicht aufgeben!'; msg='Jede Runde bringt dich weiter. Probier es nochmal!'; }

  const gradeNum = { k5:'5',k6:'6',k7:'7',k8:'8',k9:'9',k10:'10',k11:'11',k12:'12',k13:'13' }[_qg.grade];
  const confettiHtml = _qg.score >= 800
    ? `<div class="qg-confetti" id="qgConfetti"></div>` : '';

  document.getElementById('qgOverlay').innerHTML = `
  ${confettiHtml}
  <div class="qg-result-box">
    <div class="qg-result-emoji">${emoji}</div>
    <div class="qg-result-title">${title}</div>
    <div class="qg-result-score">💎 ${_qg.score} Punkte</div>
    <div class="qg-result-sub">${msg}</div>
    ${newRecord ? '<div class="qg-new-record">🏆 Neuer Highscore!</div>' : `<div class="qg-hs-info">Bestleistung: ${displayHs} Punkte</div>`}
    <div class="qg-result-stats">
      <div class="qg-stat-item"><span class="qg-stat-big">${_qg.lives}</span><span class="qg-stat-lbl">Leben übrig</span></div>
      <div class="qg-stat-item"><span class="qg-stat-big">${_qg.score >= 800 ? '🔥' : '—'}</span><span class="qg-stat-lbl">Streak-Bonus</span></div>
    </div>
    <div class="qg-result-btns">
      <button class="qg-rbtn qg-rbtn-primary" onclick="qgStartGame()">🔄 Nochmal</button>
      <button class="qg-rbtn" onclick="openQuizGame(); qgPickSubject('${_qg.subject}')">🎯 Andere Klasse</button>
      <button class="qg-rbtn" onclick="closeQuizGame()">✕ Schließen</button>
    </div>
    <div style="font-size:.75rem;color:#94a3b8;margin-top:8px">${_qg.subject==='mathe'?'📐 Mathe':'⚡ Physik'} · Klasse ${gradeNum}</div>
  </div>`;

  if (_qg.score >= 800) qgSpawnConfetti();
}

// ============================================================
// CONFETTI
// ============================================================
function qgSpawnConfetti() {
  const c = document.getElementById('qgConfetti');
  if (!c) return;
  const colors = ['#7C3AED','#FBBF24','#34D399','#F87171','#60A5FA','#F472B6'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'qg-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = Math.random() * 1.5 + 's';
    p.style.animationDuration = (1.5 + Math.random()) + 's';
    p.style.transform = `rotate(${Math.random()*360}deg)`;
    c.appendChild(p);
  }
}

// ============================================================
// QUIT / CLOSE
// ============================================================
function qgAskQuit() {
  clearInterval(_qg.timer);
  if (confirm('Quiz beenden?')) closeQuizGame();
  else qgStartTimer();
}

function closeQuizGame() {
  clearInterval(_qg.timer);
  const ov = document.getElementById('qgOverlay');
  if (ov) ov.remove();
}
