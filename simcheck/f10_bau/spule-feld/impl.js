// ════════════════════════════════════════════════════════════════════════
// PHYSIK 10 FOERDER – fz15 „Wie sieht das Magnetfeld einer Spule aus?“ (Kennung spule-feld)
// Bauplan: arbeitsheft_foe10/KAPITEL1_PROFIL.md, Abschnitt „### spule-feld (fz15)“
// (nachgetragen am 04.10.2026). Praefix _f10k.
//
// Bild (Seitenansicht): In der Mitte eine waagerechte Spule aus Kupferdraht
// (x 135…285, Achse y = 120, Drahtreihen bei y = 95 und y = 145), auf zwei
// Stuetzen ueber dem Tisch. Oben die Energiequelle mit Schaltzeichen, rechts
// davon der Schalter. Zehn kleine Kompassnadeln rund um die Spule (rote
// Spitze = Nordpol der Nadel), nicht dort, wo die Naegel haengen. Unter beiden
// Spulenenden liegt ein Haufen Eisennaegel. „mit Eisenkern“ schiebt einen
// grauen Eisenstab von rechts in die Spule; er steht an beiden Enden 14 px
// heraus. Sichtbare Windungen: 300 → 6, 600 → 10, 1200 → 16 (gleiche Laenge,
// also enger). Text im Bild nur: N, S, „Spule“, „Eisenkern“, „Energiequelle“
// (dazu + und − am Schaltzeichen der Energiequelle).
//
// ── Wicklungssinn und Pole (rechte-Hand-Regel, nachgerechnet) ──────────────
// Der Draht kommt oben am LINKEN Spulenende an. Jede Windung laeuft HINTEN
// (blass gezeichnet) von oben nach unten und VORN (kraeftige Schraegstriche)
// von unten nach oben. Start: Pluspol links. Der Strom (technische Richtung
// + → −, rote Pakete) laeuft von + nach links, hinunter zum linken Spulenende,
// durch die Windungen nach rechts und rechts wieder hinauf zum Minuspol.
// Auf der Vorderseite jeder Windung laeuft er also nach OBEN, oben von vorn
// nach hinten, hinten nach unten, unten von hinten nach vorn.
// Rechte Hand: Finger in Stromrichtung um die Spule (vorn nach oben) → der
// Daumen zeigt nach LINKS → Nordpol links. Gegenprobe im Pruefskript:
// magnetisches Moment m = ½ ∮ r × dl des gezeichneten Drahtwegs (vorn z = +R,
// hinten z = −R) hat m_x < 0, zeigt also nach links.
// „Strom umpolen“ tauscht + und − der Energiequelle: Die Pakete laufen
// andersherum, vorn nach unten → Daumen nach rechts → Nordpol rechts.
//
// ── Feld im Bild: Spulenquerschnitt ────────────────────────────────────────
// Die Feldlinien liegen in der Schnittebene durch die Spulenachse. Dort
// durchstossen die Draehte die Bildebene: oben laeuft jeder Draht von vorn
// nach hinten, also IN die Bildebene hinein (⊗), unten von hinten nach vorn,
// also HERAUS (⊙). Jeder gerade Leiter hat ein kreisfoermiges Feld,
// B ~ I / Abstand, tangential (Strom heraus → gegen den Uhrzeigersinn).
// In Mathe-Koordinaten (y nach oben, z heraus): B = I·(−(y−yi), x−xi) / r².
// Auf der Leinwand (y nach unten) wird daraus
//     bx = I·(y−yi)/r²,   by = −I·(x−xi)/r²,
// mit I = −1 fuer die obere Reihe (hinein) und I = +1 fuer die untere
// (heraus), bei „Strom umpolen“ umgekehrt (Faktor s = ±1).
// Probe in der Spulenmitte: obere Reihe (yi = y−25, I = −1) gibt bx = −1/25,
// untere (yi = y+25, I = +1) gibt bx = −1/25 → bx < 0, das Feld zeigt innen
// nach LINKS, vom Suedpol (rechts) zum Nordpol (links). Passt zu oben.
// Die Summe ueber viele dicht liegende Leiter ist ein Integral ueber die
// Drahtreihe von X0 bis X1 und laesst sich geschlossen ausrechnen
// (a = x−X0, b = x−X1, h = y−yReihe):
//     Σ h/r²        →  atan2(h·(a−b), h² + a·b)
//     Σ (x−xi)/r²   →  ½·ln((a² + h²)/(b² + h²))
// Damit sind die Feldlinien glatt (keine Zacken an den 6–16 gezeichneten
// Windungen), und ihre FORM haengt nur von Laenge und Weite der Spule ab,
// nicht von der Windungszahl und nicht vom Eisenkern. Pruefskript: die
// geschlossene Formel stimmt mit der Summe ueber 2000 einzelne Leiter auf
// 3·10⁻⁶ (relativ) ueberein.
// Normiert ist das Feld auf die Spulenmitte bei Staerke 1 (bx = −1).
// Gemessen (Staerke 1, Nordpol links): innen zeigt das Feld ueberall nach
// links, in der mittleren Haelfte der Spule hoechstens 3,5° schraeg (Betrag
// 0,95 … 1,01), an den Enden (15 px vor dem Ende, 7 px vor der Drahtreihe)
// hoechstens 13°.
// Aussen laeuft es in Boegen vom Nordpol zum Suedpol: links vor dem Nordpol
// nach links (vom N weg), ueber und unter der Spulenmitte nach rechts (von N
// nach S), rechts hinter dem Suedpol nach links (zum S hin).
// Das ist das Feld eines sehr tiefen Spulenquerschnitts (2D-Modell). Bei
// einer runden Spule faellt das Feld aussen schneller ab; die Form – innen
// dicht und gerade, aussen Boegen von N nach S – ist dieselbe.
//
// ── Staerke (Modellwerte, Lehrerteil) ──────────────────────────────────────
// Naegel = (Windungen : 300) × (ohne Eisenkern 1, mit Eisenkern 3):
// 300 → 1 / 3 · 600 → 2 / 6 · 1200 → 4 / 12. Ausgeschaltet 0. Die
// Stromstaerke ist fest 2 A. Dieselbe Zahl ist der Faktor, mit dem das Feld
// an den Kompassnadeln wirkt. Der Eisenkern aendert NUR diesen Faktor.
//
// ── Feldlinien ─────────────────────────────────────────────────────────────
// Stromlinien des berechneten Felds: Runge-Kutta 4. Ordnung, 1,5 px je
// Schritt, einmal je Polung und Linienzahl vorberechnet (erst beim ersten
// Zeigen). Start in der Spulenmitte (x = 210) bei gleichen Flussabstaenden:
// psi = Σ I·ln r ist laengs jeder Feldlinie konstant, der Fluss zwischen zwei
// Linien ist die Differenz von psi. Eine Linie ist geschlossen, wenn die Spur
// zum Start zurueckkehrt; Linien nahe der Achse laufen weit hinaus und
// verlassen das Bild (sie schliessen sich ausserhalb). Pfeile aussen in
// Feldrichtung, also vom Nordpol zum Suedpol, und EIN Pfeil innen auf der
// Mittellinie, in Feldrichtung vom Suedpol zum Nordpol: So sieht man, dass
// die Linien geschlossen sind (aussen N → S, innen S → N). Er steht in der
// Luecke zwischen zwei vorderen Windungen nahe der Mitte und wird NACH den
// vorderen Windungen gezeichnet, damit kein Draht ihn verdeckt.
// Linien je Seite (dazu die Achse) nach Nagelzahl: 1 → 1, 2 → 2, 3 → 3,
// 4 → 4, 6 → 5, 12 → 7. Mehr Linien = staerkeres Feld; die Form bleibt.
// Die Zahl waechst NICHT im gleichen Verhaeltnis wie die Staerke (streng
// proportional waeren es bei 12 Naegeln 25 Linien auf 40 px) – sie ist
// nicht zum Abzaehlen gedacht, nur „mehr Linien = staerker“.
// Der Eisenkern aendert in diesem Modell nur die Staerke, nicht die Form;
// ein echter Eisenkern buendelt das Feld zusaetzlich an seinen Enden.
//
// ── Kompassnadeln ──────────────────────────────────────────────────────────
// Gedaempfte Drehschwingung zur Richtung von B = Spule + Erdfeld. Erdfeld:
// 0,6 % des Innenfelds bei Staerke 1, nach oben (Norden = oben). Ohne Strom
// zeigen alle Nadeln nach oben.
// MODELL: Spule, Tisch und Naegel sind von der Seite gezeichnet, die
// Kompassnadeln dagegen wie in einer Draufsicht (Buch S. 127, kleine
// Magnetnadeln um die Spule). Ein echter Kompass dreht waagerecht; in einer
// senkrechten Ebene wirkte vom Erdfeld nur der senkrechte Anteil (in NRW
// nach unten). Deshalb steht neben dem Bild „Oben im Bild ist Norden.“ –
// die Abmachung ist sichtbar, nicht versteckt. Die Nadel am schwaechsten Platz (ganz aussen
// auf der Achse, 5,3 % des Innenfelds) weicht bei Staerke 1 hoechstens 7°
// von der Richtung des Spulenfelds ab.
//
// Lebendig: rote Strompakete laufen, Nadeln schwingen beim Ein-, Aus- und
// Umschalten, Naegel springen hoch und fallen (das erste Ausschalten nach
// „neu“ in Zeitlupe), Feldlinien wachsen aus der Spule heraus, der Eisenkern
// gleitet hinein, Lichtwellen beim Ankommen der Naegel und an den Polen.
// Alle angezeigten Zahlen sind fest; es gibt keinen Zufall.
// ════════════════════════════════════════════════════════════════════════
let _f10k = null;
const _F10K_XC = 210, _F10K_X0 = 135, _F10K_X1 = 285;   // Spulenmitte, linkes und rechtes Ende
const _F10K_YA = 120, _F10K_R = 25;                     // Achse; Drahtreihen bei YA − R und YA + R
const _F10K_TISCH = 205;                                // Tischkante
const _F10K_NL = 26;                                    // Nagellaenge in px
const _F10K_ERDE = 0.006;                               // Erdfeld (Innenfeld bei Staerke 1 = 1)
const _F10K_G = 1200;                                   // px/s² beim Fallen
const _F10K_TEMPO = 40;                                 // px/s der Strompakete (2 A, fest)
const _F10K_KERN = { h: 9, ueber: 14, weg: 300 };       // Eisenkern: halbe Hoehe, Ueberstand, Einschubweg
const _F10K_SICHTBAR = { 300: 6, 600: 10, 1200: 16 };   // gezeichnete Windungen
const _F10K_NS = { 1: 1, 2: 2, 3: 3, 4: 4, 6: 5, 12: 7 };  // Feldlinien je Seite nach Nagelzahl
const _F10K_QUELLE = { x: 186, y: 18, w: 48, h: 24 };   // Energiequelle, Anschluesse bei y = 30
const _F10K_SCH = { kontakt: 250, dreh: 272, y: 30 };   // Schalter: Kontakt links, Drehpunkt rechts
const _F10K_STUETZEN = [189, 231];                      // Stuetzen der Spule
const _F10K_KR = 12;                                    // Kompassradius
// Kompassnadeln: Achse links aussen, links, oben links, oben Mitte, oben rechts,
// Achse rechts, rechts aussen, unten links, unten Mitte, unten rechts
const _F10K_KOMPASSE = [[28, 120], [72, 120], [88, 68], [210, 60], [332, 68],
                        [348, 120], [392, 120], [80, 180], [210, 182], [340, 180]];
const _F10K_NADEL0 = [0.3, -0.25, 0.35, -0.3, 0.28, -0.32, 0.22, -0.27, 0.33, -0.24];  // Startauslenkung (fest)
const _F10K_SCHILD = [[119, 86], [301, 86]];            // N/S-Schilder an den Spulenenden
// Haengeplaetze [x, Neigung]: links aussen, rechts aussen, links, rechts, ...
const _F10K_PLATZ = [[138, -0.36], [282, 0.36], [145, -0.288], [275, 0.288], [152, -0.216], [268, 0.216],
                     [159, -0.144], [261, 0.144], [166, -0.072], [254, 0.072], [173, 0], [247, 0]];
// Nagelhaufen links [Mitte x, Mitte y, Richtung Kopf → Spitze], von oben nach unten:
// die oberen springen zuerst, so liegt nie ein Nagel in der Luft. Platz 6 (ganz
// unten, auf dem Tisch) bleibt immer liegen.
// Der rechte Haufen ist das Spiegelbild (x → 420 − x, Richtung → π − Richtung).
const _F10K_HAUFEN_L = [[154, 193.5, 3.3], [142, 193, 0.4], [133, 196, 2.95], [166, 196.5, 0.25],
                        [146, 197.5, -0.2], [159, 201.5, -0.04], [136, 201, 0.03]];
// Felder, an denen kein Pfeil einer Feldlinie stehen soll [x0, y0, x1, y1]
// (fest; haengende Naegel und die Beschriftung „Eisenkern“ kommen beim Zeichnen dazu)
const _F10K_SPERR = [
  [160, 0, 260, 46], [240, 6, 282, 40],                     // Energiequelle mit Beschriftung, Schalter
  [106, 73, 132, 99], [288, 73, 314, 99],                    // N/S-Schilder
  [130, 24, 140, 99], [280, 24, 290, 99], [130, 25, 290, 35], // Zuleitungen
  [115, 105, 137, 135], [283, 105, 305, 135],                // Ueberstand des Eisenkerns
  [112, 184, 182, 205], [238, 184, 308, 205]                 // Nagelhaufen
];
const _F10K_SCHILD_EK = [54, 138, 130, 162];            // Beschriftung „Eisenkern“
const _F10K_PFADE = {};                                 // Stromweg je Windungszahl
const _F10K_LINIEN = {};                                // Feldlinien je Linienzahl und Polung

// ── Feld ──────────────────────────────────────────────────────────────────
// Eine Drahtreihe bei y = yr von X0 bis X1, Strom I (+1 = aus der Bildebene
// heraus), als Summe (Integral) gerader Leiter. Leinwandkoordinaten.
function _f10kStreifen(x, y, yr, I) {
  const h = y - yr, a = x - _F10K_X0, b = x - _F10K_X1;
  const bx = I * Math.atan2(h * (a - b), h * h + a * b);
  const by = -I * 0.5 * Math.log((a * a + h * h) / (b * b + h * h));
  return (isFinite(bx) && isFinite(by)) ? [bx, by] : [0, 0];
}
// s = +1: Pluspol links (obere Reihe hinein, untere heraus) → Nordpol links.
function _f10kFeldRoh(x, y, s) {
  const o = _f10kStreifen(x, y, _F10K_YA - _F10K_R, -s);
  const u = _f10kStreifen(x, y, _F10K_YA + _F10K_R, s);
  return [o[0] + u[0], o[1] + u[1]];
}
const _F10K_B0 = Math.abs(_f10kFeldRoh(_F10K_XC, _F10K_YA, 1)[0]);
// Feld normiert: Spulenmitte bei Staerke 1 hat den Betrag 1.
function _f10kFeld(x, y, s) {
  const b = _f10kFeldRoh(x, y, s);
  return [b[0] / _F10K_B0, b[1] / _F10K_B0];
}
// psi = Σ I·ln r (konstant laengs einer Feldlinie). Fuer eine Drahtreihe:
// ½ ∫ ln(u² + h²) du = ½·(u·ln(u² + h²) − 2u + 2h·atan(u/h)), von b bis a.
function _f10kPsi(x, y, s) {
  const reihe = (yr, I) => {
    const h = y - yr, a = x - _F10K_X0, b = x - _F10K_X1;
    const G = u => 0.5 * (u * Math.log(u * u + h * h) - 2 * u + 2 * h * Math.atan(u / h));
    return I * (G(a) - G(b));
  };
  return reihe(_F10K_YA - _F10K_R, -s) + reihe(_F10K_YA + _F10K_R, s);
}

// ── Feldlinien ────────────────────────────────────────────────────────────
// Spur laengs (dir = +1) oder gegen (dir = −1) das Feld, RK4 mit 1,5 px; nahe
// an den Enden der Drahtreihen (dort aendert das Feld seine Richtung auf
// wenigen Pixeln) und nahe an einer Drahtreihe (Linien nahe der Wand treten
// an den Enden zwischen den Windungen hindurch; dort springt die Feldrichtung)
// kleiner, bis 0,05 px. Gespeichert wird etwa alle 3 px.
function _f10kSpur(x, y, s, dir) {
  const pts = [x, y];
  const f = (qx, qy) => {
    const b = _f10kFeldRoh(qx, qy, s), m = Math.hypot(b[0], b[1]) || 1e-12;
    return [dir * b[0] / m, dir * b[1] / m];
  };
  const ecken = [[_F10K_X0, _F10K_YA - _F10K_R], [_F10K_X1, _F10K_YA - _F10K_R],
                 [_F10K_X0, _F10K_YA + _F10K_R], [_F10K_X1, _F10K_YA + _F10K_R]];
  let px = x, py = y, zu = false, weg = 0, seitGespeichert = 0;
  for (let i = 1; i <= 20000; i++) {
    let dmin = 1e9;
    for (const e of ecken) dmin = Math.min(dmin, Math.hypot(px - e[0], py - e[1]));
    let dw = 1e9;
    if (px > _F10K_X0 && px < _F10K_X1) dw = Math.min(Math.abs(py - _F10K_YA + _F10K_R), Math.abs(py - _F10K_YA - _F10K_R));
    const h = Math.max(0.05, Math.min(1.5, 0.15 * dmin, 0.25 * dw));
    const k1 = f(px, py);
    const k2 = f(px + h / 2 * k1[0], py + h / 2 * k1[1]);
    const k3 = f(px + h / 2 * k2[0], py + h / 2 * k2[1]);
    const k4 = f(px + h * k3[0], py + h * k3[1]);
    px += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    py += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    weg += h; seitGespeichert += h;
    if (weg > 40 && Math.hypot(px - x, py - y) < h * 1.2) { pts.push(x, y); zu = true; break; }
    const raus = px < -60 || px > 480 || py < -60 || py > 310;
    if (seitGespeichert >= 2.9 || raus) { pts.push(px, py); seitGespeichert = 0; }
    if (raus) break;
  }
  return { pts, zu };
}
// Eine Linie, Punkte in Feldrichtung geordnet. seed = Index des Startpunkts.
function _f10kBaueLinie(y0, s) {
  const vor = _f10kSpur(_F10K_XC, y0, s, 1);
  let p, seed;
  if (vor.zu) { p = vor.pts; seed = 0; }
  else {
    const rueck = _f10kSpur(_F10K_XC, y0, s, -1).pts;
    p = [];
    for (let i = rueck.length - 2; i >= 0; i -= 2) p.push(rueck[i], rueck[i + 1]);
    seed = p.length / 2 - 1;
    for (let i = 2; i < vor.pts.length; i += 2) p.push(vor.pts[i], vor.pts[i + 1]);
  }
  const n = p.length / 2, arc = [0];
  for (let i = 1; i < n; i++) arc.push(arc[i - 1] + Math.hypot(p[2 * i] - p[2 * i - 2], p[2 * i + 1] - p[2 * i - 1]));
  const L = { p, n, seed, zu: vor.zu, arc, laenge: arc[n - 1], y0, gruppen: null, wahl: null, pfeile: [] };
  L.gruppen = _f10kPfeilKandidaten(L);
  L.pfeile = _f10kPfeileJetzt(L, [], 'leer');
  return L;
}
// Abstand eines Punkts vom Startpunkt, so wie die Linie waechst (in beide Richtungen).
function _f10kWachsWeg(L, i) {
  if (L.zu) return Math.min(L.arc[i], L.laenge - L.arc[i]);
  return Math.abs(L.arc[i] - L.arc[L.seed]);
}
function _f10kInnen(x, y, rand) {
  return x > _F10K_X0 - rand && x < _F10K_X1 + rand && Math.abs(y - _F10K_YA) < _F10K_R + rand;
}
function _f10kPfeilFrei(x, y) {
  if (x < 12 || x > 408 || y < 10 || y > _F10K_TISCH - 8) return false;
  if (_f10kInnen(x, y, 8)) return false;
  const m = 6;                             // halbe Pfeilgroesse als Rand
  for (const k of _F10K_KOMPASSE) if (Math.hypot(x - k[0], y - k[1]) < _F10K_KR + m + 1) return false;
  for (const r of _F10K_SPERR) if (x > r[0] - m && x < r[2] + m && y > r[1] - m && y < r[3] + m) return false;
  return true;
}
// Pfeilplaetze: eine sichtbare, geschlossene Schleife bekommt einen Pfeil am
// aeusseren Scheitel; eine Linie, die das Bild verlaesst (oder deren Scheitel
// verdeckt ist), zwei – hinter dem Nordpol (vom N weg) und vor dem Suedpol
// (zum S hin). Vorberechnet werden je Platz bis zu 30 Kandidaten in der
// Reihenfolge, in der sie die Linie entlang vom Wunschplatz wegrutschen;
// ausgewaehlt wird beim Zeichnen, weil haengende Naegel und die Beschriftung
// „Eisenkern“ nicht immer da sind.
function _f10kPfeilKandidaten(L) {
  const P = L.p, n = L.n;
  const reihe = (start, richtung, weit) => {
    const out = [];
    for (let d = 0; d <= weit && out.length < 30; d++) {
      const js = richtung ? [start + richtung * d] : (d === 0 ? [start] : [start + d, start - d]);
      for (const j of js) {
        if (!L.zu && (j < 1 || j > n - 2)) continue;
        const k = ((j % n) + n) % n;
        if (_f10kPfeilFrei(P[2 * k], P[2 * k + 1])) out.push(k);
      }
    }
    return out;
  };
  const g = { scheitel: null, seiten: [] };
  if (Math.abs(L.y0 - _F10K_YA) > 0.5) {
    let best = -1, bw = -1;
    for (let i = 0; i < n; i++) {
      const w = Math.abs(P[2 * i + 1] - _F10K_YA);
      if (w > bw) { bw = w; best = i; }
    }
    const sx = P[2 * best], sy = P[2 * best + 1];
    if (sx > 12 && sx < 408 && sy > 10 && sy < _F10K_TISCH - 8) g.scheitel = reihe(best, 0, 30);
  }
  // Austritt am Nordpol: vom Startpunkt in Feldrichtung bis aus der Spule heraus
  let i = L.seed, schritte = 0;
  while (schritte < n && _f10kInnen(P[2 * i], P[2 * i + 1], 2)) { i = L.zu ? (i + 1) % n : i + 1; schritte++; if (i >= n) break; }
  if (i < n) g.seiten.push(reihe(i + 10, 1, 45));
  // Eintritt am Suedpol: vom Startpunkt gegen die Feldrichtung
  i = L.seed; schritte = 0;
  while (schritte < n && _f10kInnen(P[2 * i], P[2 * i + 1], 2)) { i = L.zu ? (i - 1 + n) % n : i - 1; schritte++; if (i < 0) break; }
  if (i >= 0) g.seiten.push(reihe(i - 10, -1, 45));
  return g;
}
// Pfeile fuer den jetzigen Zustand; hind = bewegliche Hindernisse [x0, y0, x1, y1].
function _f10kPfeileJetzt(L, hind, key) {
  if (L.wahl && L.wahl.key === key) return L.wahl.pf;
  const P = L.p, n = L.n, m = 6;
  const frei = k => {
    const x = P[2 * k], y = P[2 * k + 1];
    for (const r of hind) if (x > r[0] - m && x < r[2] + m && y > r[1] - m && y < r[3] + m) return false;
    return true;
  };
  const nimm = liste => { for (const k of liste) if (frei(k)) return k; return null; };
  let ks = [];
  if (L.gruppen.scheitel) { const k = nimm(L.gruppen.scheitel); if (k != null) ks = [k]; }
  if (!ks.length) for (const liste of L.gruppen.seiten) { const k = nimm(liste); if (k != null) ks.push(k); }
  const pf = ks.map(k => {
    const a = Math.max(0, k - 1), b = Math.min(n - 1, k + 1);
    return { x: P[2 * k], y: P[2 * k + 1], ang: Math.atan2(P[2 * b + 1] - P[2 * a + 1], P[2 * b] - P[2 * a]),
             weg: _f10kWachsWeg(L, k) };
  });
  L.wahl = { key, pf };
  return pf;
}
// Bewegliche Hindernisse: haengende (und gerade anfliegende) Naegel, Beschriftung „Eisenkern“.
function _f10kHindernisse(z) {
  const hind = [];
  let anz = 0;
  for (let k = 0; k < 12; k++) {
    const nm = z.naegel[k];
    if (nm.mode !== 'haengt' && nm.mode !== 'fliegt') continue;
    anz++;
    const p = _F10K_PLATZ[k], ay = _F10K_YA + _F10K_R + 2, tx = p[0] + Math.sin(p[1]) * _F10K_NL;
    hind.push([Math.min(p[0], tx) - 4, ay - 2, Math.max(p[0], tx) + 4, ay + _F10K_NL + 1]);
  }
  const ek = z.kern > 0.5;
  if (ek) hind.push(_F10K_SCHILD_EK);
  return { hind, key: anz + '|' + (ek ? 1 : 0) };
}
// Linienzahl je Seite ns, Polung s: Startpunkte bei gleichen Flussabstaenden.
function _f10kLinienSatz(ns, s) {
  const key = ns + '|' + s;
  if (_F10K_LINIEN[key]) return _F10K_LINIEN[key];
  const xc = _F10K_XC, ya = _F10K_YA, p0 = _f10kPsi(xc, ya, s);
  const Psi = _f10kPsi(xc, ya - 0.85 * _F10K_R, s) - p0;
  const liste = [_f10kBaueLinie(ya, s)];
  for (let j = 1; j <= ns; j++) {
    const ziel = j / (ns + 0.45) * Psi;
    let lo = 0, hi = 0.95 * _F10K_R;                  // Abstand von der Achse
    for (let k = 0; k < 40; k++) {
      const m = (lo + hi) / 2;
      if ((_f10kPsi(xc, ya - m, s) - p0 - ziel) * Psi < 0) lo = m; else hi = m;
    }
    const d = (lo + hi) / 2;
    liste.push(_f10kBaueLinie(ya - d, s), _f10kBaueLinie(ya + d, s));
  }
  return (_F10K_LINIEN[key] = liste);
}

// ── Stromweg ──────────────────────────────────────────────────────────────
// Weg, wenn der Pluspol LINKS ist (technische Stromrichtung).
// art: draht | hinten (Windung hinter der Spule) | vorn | quelle (in der Energiequelle)
function _f10kPfad(nw) {
  if (_F10K_PFADE[nw]) return _F10K_PFADE[nw];
  const p = (_F10K_X1 - _F10K_X0) / nw, oben = _F10K_YA - _F10K_R, unten = _F10K_YA + _F10K_R;
  const Q = _F10K_QUELLE, seg = [];
  let x = Q.x, y = 30;
  const zu = (nx, ny, art) => {
    seg.push({ x0: x, y0: y, x1: nx, y1: ny, art, len: Math.hypot(nx - x, ny - y), s0: 0 });
    x = nx; y = ny;
  };
  zu(_F10K_X0, 30, 'draht'); zu(_F10K_X0, oben, 'draht');
  for (let k = 0; k < nw; k++) {
    const xk = _F10K_X0 + k * p;
    zu(xk + p / 2, unten, 'hinten');
    zu(xk + p, oben, 'vorn');
  }
  zu(_F10K_X1, 30, 'draht'); zu(Q.x + Q.w, 30, 'draht'); zu(Q.x, 30, 'quelle');
  let s = 0;
  for (const g of seg) { g.s0 = s; s += g.len; }
  return (_F10K_PFADE[nw] = { seg, L: s, p });
}

// ── Zustand und Bedienung ─────────────────────────────────────────────────
function _f10kWinkelDiff(a, b) {          // b − a, auf (−π, π]
  let d = (b - a) % (2 * Math.PI);
  if (d > Math.PI) d -= 2 * Math.PI;
  if (d <= -Math.PI) d += 2 * Math.PI;
  return d;
}
function _f10kHaufen(k) {                 // Liegeplatz des Nagels k (0…13; 12, 13 bleiben liegen)
  const links = k % 2 === 0, h = _F10K_HAUFEN_L[k < 12 ? Math.floor(k / 2) : 6];
  return links ? h : [420 - h[0], h[1], Math.PI - h[2]];
}
function _f10kInit() {
  _f10k = {
    t: 0, an: false, wind: 600, mitKern: false, plusLinks: true, zeigen: false,
    f: 0, wst: 2, kern: 0, strom: 0, hebel: 1, pol: 1, s: 0,
    nadeln: _F10K_KOMPASSE.map((p, i) => ({ x: p[0], y: p[1], phi: -Math.PI / 2 + _F10K_NADEL0[i], w: 0 })),
    naegel: [],
    saetze: [], fx: { teile: [] }, zeitlupe: null, ahaGezeigt: false
  };
  for (let k = 0; k < 14; k++) {
    const h = _f10kHaufen(k);
    _f10k.naegel.push({ mode: 'liegt', x: h[0], y: h[1], psi: h[2], d: 0, w: 0, tw: null, hupf: 0 });
  }
}
function _f10kHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie sieht das Magnetfeld einer Spule aus?</h3>
    <div class="fpm-note" style="margin-top:2px">In der Mitte ist eine Spule aus Kupferdraht. Sie ist an eine Energiequelle mit Schalter angeschlossen. Um die Spule stehen kleine Kompassnadeln. Unter der Spule liegen Eisennägel.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_f10k-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_f10k-schalter" onclick="_f10kSchalter()">Schalter an</button>
          <button class="sim-btn" onclick="_f10kUmpolen()">Strom umpolen</button>
          <button class="sim-btn" id="_f10k-linien" onclick="_f10kLinien()">Feldlinien zeigen</button>
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_f10k-w300" onclick="_f10kWind('300')">300 Windungen</button>
          <button class="sim-btn primary" id="_f10k-w600" onclick="_f10kWind('600')">600 Windungen</button>
          <button class="sim-btn" id="_f10k-w1200" onclick="_f10kWind('1200')">1200 Windungen</button>
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_f10k-ohne" onclick="_f10kKern('ohne')">ohne Eisenkern</button>
          <button class="sim-btn" id="_f10k-mit" onclick="_f10kKern('mit')">mit Eisenkern</button>
          <button class="sim-btn" onclick="_f10kNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Spule</div>
        <div class="lmp-status on" id="_f10k-spule"></div>
        <div class="fpm-label" style="margin-top:10px">Pole</div>
        <div class="lmp-status on" id="_f10k-pole"></div>
        <div class="fpm-label" style="margin-top:10px">Feldlinien</div>
        <div class="lmp-status on" id="_f10k-feld"></div>
        <div class="fpm-note" style="margin-top:10px">Die rote Spitze einer Kompassnadel ist ihr Nordpol. Oben im Bild ist Norden.</div>
        <div class="fpm-note" style="margin-top:8px">Schalte den Strom an und wieder aus. Achte auf die Nadeln und auf die Nägel.</div>
        <div class="fpm-note" style="margin-top:8px">Ändere immer nur eine Sache: die Windungen oder den Eisenkern.</div>
        <div class="fpm-note" style="margin-top:8px">Die Stromstärke bleibt immer 2 A.</div>
        <div class="fpm-note" style="margin-top:8px">Die Zahlen der Nägel sind Modellwerte.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Schalter aus, 600 Windungen, ohne Eisenkern</p>
  </div>`;
}
function _f10kNaegelZahl() {
  const z = _f10k;
  return z.an ? (z.wind / 300) * (z.mitKern ? 3 : 1) : 0;
}
function _f10kTextSpule() {
  const z = _f10k;
  if (!z.an) return 'Spule: aus – hält 0 Nägel.';
  const n = _f10kNaegelZahl();
  return 'Spule: ' + z.wind + ' Windungen, ' + (z.mitKern ? 'mit' : 'ohne') + ' Eisenkern – hält ' +
         n + (n === 1 ? ' Nagel.' : ' Nägel.');
}
function _f10kTextPole() {
  const z = _f10k;
  if (!z.an) return 'Die Kompassnadeln zeigen nach Norden.';
  return z.plusLinks ? 'Nordpol links, Südpol rechts.' : 'Nordpol rechts, Südpol links.';
}
function _f10kTextFeld() {
  const z = _f10k;
  if (!z.zeigen) return 'Feldlinien sind ausgeblendet.';
  return z.an ? 'Feldlinien: außen vom Nordpol zum Südpol. In der Spule dicht und gerade.'
              : 'Ohne Strom hat die Spule kein Magnetfeld und keine Feldlinien.';
}
function _f10kStatus() {
  if (!_f10k) return;
  const z = _f10k;
  const setze = (id, txt) => {
    const e = document.getElementById(id);
    if (e) { e.textContent = txt; e.className = 'lmp-status on'; }
  };
  setze('_f10k-spule', _f10kTextSpule());
  setze('_f10k-pole', _f10kTextPole());
  setze('_f10k-feld', _f10kTextFeld());
  const s = document.getElementById('_f10k-schalter');
  if (s) s.textContent = z.an ? 'Schalter aus' : 'Schalter an';
  const l = document.getElementById('_f10k-linien');
  if (l) l.textContent = z.zeigen ? 'Feldlinien aus' : 'Feldlinien zeigen';
  const markiere = (id, an) => {
    const b = document.getElementById(id);
    try { if (b && b.classList) b.classList.toggle('primary', an); } catch (err) { /* Beiwerk */ }
  };
  for (const w of [300, 600, 1200]) markiere('_f10k-w' + w, z.wind === w);
  markiere('_f10k-ohne', !z.mitKern);
  markiere('_f10k-mit', z.mitKern);
}
function _f10kSchalter() {
  if (!_f10k) return;
  const z = _f10k, vorher = _f10kNaegelZahl();
  z.an = !z.an;
  if (z.an) {
    for (const p of _F10K_SCHILD) _bioFxWelle(z.fx.teile, p[0], p[1], '#fde68a', 22);
  } else if (vorher > 0) {
    // Aha: ausschalten → die Naegel fallen; beim ersten Mal nach „neu“ in Zeitlupe
    // Die Zeitlupe greift sofort (sonst ist der Fall von 0,3 s vorbei, bevor sie wirkt).
    if (!z.ahaGezeigt) { z.ahaGezeigt = true; _bioFxZeitlupe(z, 0.3, 1.3); z.zeitlupe.faktor = 0.3; }
  }
  _f10kStatus();
}
function _f10kWind(w) {
  const n = Number(w);
  if (!_f10k || !(n === 300 || n === 600 || n === 1200)) return;
  _f10k.wind = n;
  _f10kStatus();
}
function _f10kKern(k) {
  if (!_f10k || !(k === 'mit' || k === 'ohne')) return;
  _f10k.mitKern = k === 'mit';
  _f10kStatus();
}
function _f10kUmpolen() {
  if (!_f10k) return;
  const z = _f10k;
  z.plusLinks = !z.plusLinks;
  if (z.an) {
    // Das Feld kehrt sich um: die Naegel zucken kurz, bleiben aber haengen
    // (Eisen wird von jedem Pol angezogen); die Pole tauschen.
    z.naegel.forEach((m, k) => { if (m.mode === 'haengt') m.w += (k % 2 ? 1 : -1) * 1.4; });
    for (const p of _F10K_SCHILD) _bioFxWelle(z.fx.teile, p[0], p[1], '#fde68a', 22);
  }
  _f10kStatus();
}
function _f10kLinien() {
  if (!_f10k) return;
  _f10k.zeigen = !_f10k.zeigen;
  _f10kStatus();
}
function _f10kNeu() {
  if (!_f10k) return;
  _f10kInit(); _f10kStatus();
}

// ── Bewegung ──────────────────────────────────────────────────────────────
function _f10kNadel(n, bx, by, d) {
  const B = Math.hypot(bx, by), ziel = Math.atan2(by, bx);
  const k = 16 * Math.min(1.8, Math.max(0.45, B / 0.1));
  n.w += (k * Math.sin(ziel - n.phi) - 2.4 * n.w) * d;
  n.phi += n.w * d;
}
function _f10kHaengePose(k, delta) {
  const p = _F10K_PLATZ[k], psi = Math.PI / 2 - (p[1] + delta);
  const ax = p[0], ay = _F10K_YA + _F10K_R + 2, h = _F10K_NL / 2;
  return { x: ax + Math.cos(psi) * h, y: ay + Math.sin(psi) * h, psi };
}
function _f10kNaegel(d) {
  const z = _f10k;
  // Der Eisenkern wirkt, sobald er zur Haelfte in der Spule steckt.
  const soll = z.an ? (z.wind / 300) * (z.kern > 0.5 ? 3 : 1) : 0;
  let erster = -1;
  for (let k = 0; k < 12; k++) {
    const n = z.naegel[k];
    if (erster < 0 && k < soll && (n.mode === 'liegt' || n.mode === 'faellt')) erster = k;
  }
  for (let k = 0; k < 14; k++) {
    const n = z.naegel[k], hz = _f10kHaufen(k);
    if (k >= 12) { n.x = hz[0]; n.y = hz[1]; n.psi = hz[2]; continue; }   // bleibt liegen
    const oben = k < soll;
    if (oben && (n.mode === 'liegt' || n.mode === 'faellt')) {
      const vomHaufen = n.mode === 'liegt';
      n.mode = 'fliegt';
      n.tw = { p: vomHaufen ? -0.06 * Math.floor((k - erster) / 2) : 0, T: 0.3,
               x0: n.x, y0: n.y, psi0: n.psi, vomHaufen };
    } else if (!oben && n.mode === 'fliegt' && n.tw.vomHaufen && n.tw.p <= 0) {
      n.mode = 'liegt'; n.tw = null;                 // war noch gar nicht losgeflogen
    } else if (!oben && (n.mode === 'haengt' || n.mode === 'fliegt')) {
      n.mode = 'faellt';
      n.tw = { p: 0, T: Math.max(0.12, Math.sqrt(2 * Math.max(1, hz[1] - n.y) / _F10K_G)),
               x0: n.x, y0: n.y, psi0: n.psi };
    }
    if (n.mode === 'fliegt') {
      n.tw.p += d;
      const q = _bioFxKlemme(n.tw.p / n.tw.T), ziel = _f10kHaengePose(k, 0), e = q * q;
      n.x = n.tw.x0 + (ziel.x - n.tw.x0) * e;
      n.y = n.tw.y0 + (ziel.y - n.tw.y0) * e;
      n.psi = n.tw.psi0 + _f10kWinkelDiff(n.tw.psi0, ziel.psi) * _bioFxEase.raus(q);
      if (q >= 1) {
        n.mode = 'haengt'; n.tw = null; n.d = 0; n.w = (k % 2 ? 1 : -1) * 2.4;
        _bioFxWelle(z.fx.teile, _F10K_PLATZ[k][0], _F10K_YA + _F10K_R + 2, '#cbd5e1', 10);
      }
    } else if (n.mode === 'haengt') {
      n.w += (-42 * n.d - 1.0 * n.w) * d;
      n.d = Math.max(-0.6, Math.min(0.6, n.d + n.w * d));
      const pose = _f10kHaengePose(k, n.d);
      n.x = pose.x; n.y = pose.y; n.psi = pose.psi;
    } else if (n.mode === 'faellt') {
      n.tw.p += d;
      const q = _bioFxKlemme(n.tw.p / n.tw.T);
      n.x = n.tw.x0 + (hz[0] - n.tw.x0) * q;
      n.y = n.tw.y0 + (hz[1] - n.tw.y0) * q * q;
      n.psi = n.tw.psi0 + _f10kWinkelDiff(n.tw.psi0, hz[2]) * q * q * q;
      if (q >= 1) {
        n.mode = 'liegt'; n.tw = null; n.hupf = 0.25;
        n.x = hz[0]; n.y = hz[1]; n.psi = hz[2];
        if (k < 2 || k % 3 === 0) _bioFxWelle(z.fx.teile, hz[0], hz[1], '#94a3b8', 10);
      }
    } else {
      n.hupf = Math.max(0, n.hupf - d);
      n.x = hz[0]; n.psi = hz[2];
      n.y = hz[1] - Math.sin(Math.PI * n.hupf / 0.25) * 3;
    }
  }
}
// Feldliniensaetze: der gewuenschte waechst aus der Spule heraus, andere verblassen.
function _f10kSaetze(d) {
  const z = _f10k;
  let ziel = null;
  if (z.zeigen && z.an) {
    const ns = _F10K_NS[_f10kNaegelZahl()] || 1, s = z.plusLinks ? 1 : -1;
    ziel = ns + '|' + s;
    let q = z.saetze.find(e => e.key === ziel);
    if (!q) { q = { key: ziel, ns, s, a: 0, g: 0, weg: false }; z.saetze.push(q); }
    if (q.weg) { q.weg = false; q.g = 0; }
  }
  for (const q of z.saetze) {
    if (q.key === ziel) { q.a = Math.min(1, q.a + d / 0.25); q.g += d * 260; }
    else { q.weg = true; q.a -= d / 0.3; }
  }
  z.saetze = z.saetze.filter(q => q.a > 0);
}
function _f10kUpdate(dt) {
  if (!_f10k) return;
  const z = _f10k;
  dt = _bioFxDt(dt);
  const d = dt * _bioFxZeitlupeFaktor(z, dt);
  z.t += d;
  // Feld folgt dem Strom schnell; der Kern gleitet in 0,5 s hinein oder heraus.
  z.f += ((z.an ? (z.plusLinks ? 1 : -1) : 0) - z.f) * Math.min(1, d / 0.06);
  z.wst += (z.wind / 300 - z.wst) * Math.min(1, d / 0.15);
  z.kern += ((z.mitKern ? 1 : 0) - z.kern) * Math.min(1, d * 7);
  if (Math.abs(z.kern - (z.mitKern ? 1 : 0)) < 0.002) z.kern = z.mitKern ? 1 : 0;
  z.strom += ((z.an ? 1 : 0) - z.strom) * Math.min(1, d * 10);
  z.hebel += ((z.an ? 0 : 1) - z.hebel) * Math.min(1, d * 12);
  z.pol += ((z.plusLinks ? 1 : -1) - z.pol) * Math.min(1, d * 9);
  if (z.an) z.s += d * _F10K_TEMPO * (z.plusLinks ? 1 : -1);
  // Kompassnadeln: Spulenfeld × Staerke + Erdfeld (Norden = oben = −y)
  const st = z.f * z.wst * (1 + 2 * z.kern);
  for (const n of z.nadeln) {
    const b = _f10kFeld(n.x, n.y, 1);
    _f10kNadel(n, st * b[0], st * b[1] - _F10K_ERDE, d);
  }
  _f10kSaetze(d);
  _f10kNaegel(d);
  _bioFxAlleUpdate(z.fx, d);
}

// ── Zeichnen ──────────────────────────────────────────────────────────────
function _f10kNagel(ctx, cx, cy, psi) {
  const c = Math.cos(psi), s = Math.sin(psi), h = _F10K_NL / 2;
  const kx = cx - c * h, ky = cy - s * h, sx = cx + c * h, sy = cy + s * h;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(sx - c * 4, sy - s * 4); ctx.stroke();
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.moveTo(sx, sy);
  ctx.lineTo(sx - c * 5 - s * 1.3, sy - s * 5 + c * 1.3);
  ctx.lineTo(sx - c * 5 + s * 1.3, sy - s * 5 - c * 1.3);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(kx - s * 0.6, ky + c * 0.6); ctx.lineTo(sx - c * 6 - s * 0.6, sy - s * 6 + c * 0.6); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.strokeStyle = '#374151'; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(kx - s * 3.6, ky + c * 3.6); ctx.lineTo(kx + s * 3.6, ky - c * 3.6); ctx.stroke();
  ctx.restore();
}
function _f10kKompass(ctx, x, y, phi) {
  const r = _F10K_KR;
  ctx.save();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2;
    ctx.beginPath(); ctx.moveTo(x + (r - 3.5) * Math.cos(a), y + (r - 3.5) * Math.sin(a));
    ctx.lineTo(x + (r - 1.2) * Math.cos(a), y + (r - 1.2) * Math.sin(a)); ctx.stroke();
  }
  ctx.translate(x, y); ctx.rotate(phi);
  ctx.fillStyle = '#dc2626';                       // Nordpol der Nadel: rot
  ctx.beginPath(); ctx.moveTo(r - 2.2, 0); ctx.lineTo(0, -2.9); ctx.lineTo(0, 2.9); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#16a34a';                       // Suedpol der Nadel: gruen
  ctx.beginPath(); ctx.moveTo(-(r - 2.2), 0); ctx.lineTo(0, -2.9); ctx.lineTo(0, 2.9); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(0, 0, 1.6, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
function _f10kPakete(ctx, z, hinten) {
  if (z.strom < 0.02) return;
  const P = _f10kPfad(_F10K_SICHTBAR[z.wind]), n = Math.round(P.L / 17), ab = P.L / n;
  ctx.save();
  ctx.fillStyle = '#dc2626';
  for (let i = 0; i < n; i++) {
    const s = ((i * ab + z.s) % P.L + P.L) % P.L;
    let g = P.seg[0];
    for (const q of P.seg) { if (s >= q.s0) g = q; else break; }
    if (g.art === 'quelle' || (g.art === 'hinten') !== hinten) continue;
    const f = (s - g.s0) / g.len;
    ctx.globalAlpha = z.strom * (hinten ? 0.45 : 1);
    ctx.beginPath(); ctx.arc(g.x0 + (g.x1 - g.x0) * f, g.y0 + (g.y1 - g.y0) * f, 2.7, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
function _f10kPfeil(ctx, x, y, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  ctx.beginPath();
  ctx.moveTo(x + c * 5, y + s * 5);
  ctx.lineTo(x - c * 4 - s * 4, y - s * 4 + c * 4);
  ctx.lineTo(x - c * 4 + s * 4, y - s * 4 - c * 4);
  ctx.closePath(); ctx.fill();
}
function _f10kFeldlinien(ctx, z) {
  const H = _f10kHindernisse(z);
  for (const q of z.saetze) {
    const a = q.a * Math.max(0, Math.min(1, z.f * q.s));
    if (a < 0.01) continue;
    const liste = _f10kLinienSatz(q.ns, q.s);
    ctx.save();
    ctx.globalAlpha = a * 0.85;
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1.4; ctx.lineJoin = 'round';
    for (const L of liste) {
      const P = L.p, n = L.n;
      ctx.beginPath();
      if (L.zu) {
        if (q.g >= L.laenge / 2) {
          ctx.moveTo(P[0], P[1]);
          for (let i = 1; i < n; i++) ctx.lineTo(P[2 * i], P[2 * i + 1]);
        } else {
          ctx.moveTo(P[0], P[1]);
          for (let i = 1; i < n && L.arc[i] <= q.g; i++) ctx.lineTo(P[2 * i], P[2 * i + 1]);
          ctx.moveTo(P[2 * n - 2], P[2 * n - 1]);
          for (let i = n - 2; i > 0 && L.laenge - L.arc[i] <= q.g; i--) ctx.lineTo(P[2 * i], P[2 * i + 1]);
        }
      } else {
        const a0 = L.arc[L.seed];
        ctx.moveTo(P[2 * L.seed], P[2 * L.seed + 1]);
        for (let i = L.seed + 1; i < n && L.arc[i] - a0 <= q.g; i++) ctx.lineTo(P[2 * i], P[2 * i + 1]);
        ctx.moveTo(P[2 * L.seed], P[2 * L.seed + 1]);
        for (let i = L.seed - 1; i >= 0 && a0 - L.arc[i] <= q.g; i--) ctx.lineTo(P[2 * i], P[2 * i + 1]);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = a;
    ctx.fillStyle = '#1e3a8a';
    for (const L of liste) for (const pf of _f10kPfeileJetzt(L, H.hind, H.key)) if (pf.weg <= q.g) _f10kPfeil(ctx, pf.x, pf.y, pf.ang);
    ctx.restore();
  }
}
// Der Pfeil IN der Spule auf der Mittellinie (y = Achse): Feldrichtung vom
// Suedpol zum Nordpol. Die vordere Windung k kreuzt die Achse bei
// X0 + (k + 0,75)·pw (Mitte des Schraegstrichs), die Luecke zwischen zwei
// Windungen liegt also bei X0 + (k + 1,25)·pw; genommen wird die Luecke, die
// der Spulenmitte am naechsten ist (6 Windungen: x = 216, 10: 214, 16: 212).
// Die Richtung wird aus dem Feld an genau dieser Stelle gelesen, nicht aus
// der Polung gefolgert.
function _f10kPfeilInnenX(wind) {
  const pw = (_F10K_X1 - _F10K_X0) / _F10K_SICHTBAR[wind];
  return _F10K_X0 + (Math.round((_F10K_XC - _F10K_X0) / pw - 1.25) + 1.25) * pw;
}
function _f10kPfeilInnen(ctx, z) {
  const xm = _f10kPfeilInnenX(z.wind), ym = _F10K_YA;
  for (const q of z.saetze) {
    const a = q.a * Math.max(0, Math.min(1, z.f * q.s));
    if (a < 0.01 || q.g < Math.abs(xm - _F10K_XC)) continue;
    const ang = _f10kFeld(xm, ym, q.s)[0] < 0 ? Math.PI : 0;
    const c = Math.cos(ang), s = Math.sin(ang);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.moveTo(xm + c * 6, ym + s * 6);
    ctx.lineTo(xm - c * 5 - s * 5, ym - s * 5 + c * 5);
    ctx.lineTo(xm - c * 5 + s * 5, ym - s * 5 - c * 5);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.fillStyle = '#1e3a8a'; ctx.fill();
    ctx.restore();
  }
}
function _f10kSchild(ctx, x, y, text, farbe) {
  ctx.fillStyle = farbe;
  ctx.beginPath(); ctx.arc(x, y, 9, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, 9, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = '800 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(text, x, y + 4.5);
}
function _f10kDraw(ctx, cv) {
  if (!_f10k) return;
  const z = _f10k, W = cv.width, H = cv.height, YA = _F10K_YA, T = _F10K_TISCH;
  const oben = YA - _F10K_R, unten = YA + _F10K_R, X0 = _F10K_X0, X1 = _F10K_X1;
  const nw = _F10K_SICHTBAR[z.wind], pw = (X1 - X0) / nw;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f4f7fb'); bg.addColorStop(1, '#e3e9f0');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // Tisch
  ctx.fillStyle = '#cbb89a'; ctx.fillRect(0, T, W, H - T);
  ctx.fillStyle = '#a8957a'; ctx.fillRect(0, T, W, 2);
  // Stuetzen der Spule
  ctx.fillStyle = '#94a3b8';
  for (const x of _F10K_STUETZEN) ctx.fillRect(x - 2, unten + 2, 4, T - unten - 2);
  ctx.fillStyle = '#64748b';
  for (const x of _F10K_STUETZEN) ctx.fillRect(x - 9, T - 4, 18, 5);

  // Zuleitungen
  const Q = _F10K_QUELLE, S = _F10K_SCH;
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(Q.x, 30); ctx.lineTo(X0, 30); ctx.lineTo(X0, oben);
  ctx.moveTo(Q.x + Q.w, 30); ctx.lineTo(S.kontakt, 30);
  ctx.moveTo(S.dreh, 30); ctx.lineTo(X1, 30); ctx.lineTo(X1, oben);
  ctx.stroke();

  // Spule: Spulenkoerper, hintere Windungen, Eisenkern, Feldlinien, vordere Windungen
  ctx.fillStyle = 'rgba(203,213,225,0.35)';
  ctx.fillRect(X0 - 3, oben + 3, X1 - X0 + 6, unten - oben - 6);
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(124,63,18,0.6)'; ctx.lineWidth = 2.4;
  for (let k = 0; k < nw; k++) {
    const x = X0 + k * pw;
    ctx.beginPath(); ctx.moveTo(x, oben); ctx.lineTo(x + pw / 2, unten); ctx.stroke();
  }
  ctx.restore();
  _f10kPakete(ctx, z, true);
  if (z.kern > 0.003) {
    const K = _F10K_KERN, off = (1 - z.kern) * K.weg;
    const xa = X0 - K.ueber + off, xb = X1 + K.ueber + off;
    const kg = ctx.createLinearGradient(0, YA - K.h, 0, YA + K.h);
    kg.addColorStop(0, '#b6bcc6'); kg.addColorStop(1, '#6b7280');
    ctx.fillStyle = kg; ctx.fillRect(xa, YA - K.h, xb - xa, 2 * K.h);
    ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1.2;
    ctx.strokeRect(xa, YA - K.h, xb - xa, 2 * K.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(xa + 2, YA - K.h + 2.5); ctx.lineTo(xb - 2, YA - K.h + 2.5); ctx.stroke();
  }
  _f10kFeldlinien(ctx, z);
  ctx.save(); ctx.lineCap = 'round';
  for (let k = 0; k < nw; k++) {
    const x = X0 + k * pw;
    ctx.strokeStyle = '#7c3f12'; ctx.lineWidth = 3.6;
    ctx.beginPath(); ctx.moveTo(x + pw / 2, unten); ctx.lineTo(x + pw, oben); ctx.stroke();
    ctx.strokeStyle = '#d08a4a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + pw / 2, unten); ctx.lineTo(x + pw, oben); ctx.stroke();
  }
  ctx.restore();
  _f10kPakete(ctx, z, false);
  _f10kPfeilInnen(ctx, z);

  // Naegel (haengende und liegende)
  for (const n of z.naegel) _f10kNagel(ctx, n.x, n.y, n.psi);

  // Energiequelle mit Schaltzeichen; pol = +1: Pluspol links
  ctx.save();
  ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.6;
  _bioFxRundRect(ctx, Q.x, Q.y, Q.w, Q.h, 4); ctx.fill(); ctx.stroke();
  const pol = z.pol, xm = Q.x + Q.w / 2, xl = xm - 4 * pol, xk = xm + 4 * pol;
  ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(Q.x, 30); ctx.lineTo(Math.min(xl, xk), 30);
  ctx.moveTo(Math.max(xl, xk), 30); ctx.lineTo(Q.x + Q.w, 30); ctx.stroke();
  ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(xl, 22); ctx.lineTo(xl, 38); ctx.stroke();
  ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(xk, 26); ctx.lineTo(xk, 34); ctx.stroke();
  ctx.globalAlpha = Math.min(1, Math.abs(pol) * 1.2);
  ctx.fillStyle = '#1f2937'; ctx.font = '700 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('+', xm - 15 * pol, 27); ctx.fillText('−', xm + 15 * pol, 27);
  ctx.restore();
  ctx.fillStyle = 'rgba(244,247,251,0.9)';
  _bioFxRundRect(ctx, xm - 43, 1, 86, 15, 4); ctx.fill();
  ctx.fillStyle = '#1f2937'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Energiequelle', xm, 12);
  // Schalter: Drehpunkt rechts, Kontakt links
  const al = 0.55 * z.hebel, lh = S.dreh - S.kontakt;
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(S.dreh, 30); ctx.lineTo(S.dreh - lh * Math.cos(al), 30 - lh * Math.sin(al)); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.arc(S.dreh, 30, 3, 0, 2 * Math.PI); ctx.fill();
  ctx.beginPath(); ctx.arc(S.kontakt, 30, 3, 0, 2 * Math.PI); ctx.fill();

  // Kompassnadeln
  for (const n of z.nadeln) _f10kKompass(ctx, n.x, n.y, n.phi);

  // Pole: N und S an den Spulenenden, solange Strom fliesst
  const ap = Math.min(1, Math.abs(z.f) * 1.5);
  if (ap > 0.02) {
    ctx.save(); ctx.globalAlpha = ap;
    const nordLinks = z.f > 0;
    _f10kSchild(ctx, _F10K_SCHILD[0][0], _F10K_SCHILD[0][1], nordLinks ? 'N' : 'S', nordLinks ? '#dc2626' : '#16a34a');
    _f10kSchild(ctx, _F10K_SCHILD[1][0], _F10K_SCHILD[1][1], nordLinks ? 'S' : 'N', nordLinks ? '#16a34a' : '#dc2626');
    ctx.restore();
  }
  // Beschriftung „Eisenkern“ am linken Ende des Kerns
  const ak = _bioFxKlemme((z.kern - 0.7) / 0.3);
  if (ak > 0.01) {
    ctx.save(); ctx.globalAlpha = ak;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(X0 - _F10K_KERN.ueber + 3, 142); ctx.lineTo(X0 - _F10K_KERN.ueber + 3, YA + _F10K_KERN.h + 1); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    _bioFxRundRect(ctx, 56, 142, 70, 17, 5); ctx.fill();
    ctx.fillStyle = '#1f2937'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Eisenkern', 91, 155);
    ctx.restore();
  }
  // Beschriftung „Spule“ auf dem Tisch
  ctx.fillStyle = 'rgba(241,234,222,0.92)';
  _bioFxRundRect(ctx, 186, 217, 48, 18, 5); ctx.fill();
  ctx.fillStyle = '#1f2937'; ctx.font = '700 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Spule', _F10K_XC, 231);
  _bioFxAlleDraw(ctx, z.fx);
}
