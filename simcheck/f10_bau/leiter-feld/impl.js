// ════════════════════════════════════════════════════════════════════════
// PHYSIK 10 FOERDER – fz16 „Welches Magnetfeld hat ein gerader Draht?“ (Kennung leiter-feld)
// Bauplan: arbeitsheft_foe10/KAPITEL1_PROFIL.md, Abschnitt „### leiter-feld (fz16)“
// (nachgetragen am 04.10.2026). Praefix _f10l. Vorbild im Buch: Metzler S. 120,
// Abb. 1 (Magnetnadeln im Kreis um einen stromfuehrenden Leiter) und Abb. 2
// (Rechte-Hand-Regel) – eigene Zeichnung, kein Buchtext.
//
// Bild: Schraeg von oben eine waagerechte, runde, helle Platte; durch ihre Mitte
// ein SENKRECHTER Kupferdraht. Oben und unten am Draht eine Klemme mit „+“ bzw.
// „−“. Kabel zu einer Energiequelle (oben rechts) und einem Schalter (unten
// rechts). Zwoelf Kompassnadeln auf zwei Kreisen um den Draht (innen 6 bei
// 10° + k·60°, aussen 6 bei 40° + k·60°, also um 30° versetzt; so steht keine
// Nadel genau hinter dem Draht). Rote Spitze = Nordpol der Nadel. Am Plattenrand
// hinten ein „N“ mit Pfeil (Norden = nach hinten). Bei „Schalter an“ laufen rote
// Pakete durch Kabel und Draht (technische Stromrichtung + → −), neben dem Draht
// ein Pfeil „I“ in Stromrichtung. Text im Bild nur: +, −, I, N, „Energiequelle“.
//
// ── Koordinaten und Schraegbild (EINE Abbildung fuer alles) ────────────────
// Raum: x nach rechts, y nach hinten (= Norden), z nach oben; Draht auf der
// z-Achse, Plattenoberseite bei z = 0. Parallelprojektion, Blick 30° von oben:
//     P(x, y, z) = (180 + x,  164 − y·sin 30° − z·cos 30°).
// Ein Kreis auf der Platte wird damit eine Ellipse mit dem Achsenverhaeltnis
// sin 30° = 0,5. Platte, Feldlinien, Nadelgehaeuse, NADELN und HAND laufen alle
// durch _f10lP – Nadeln und Feldlinien haben also dieselbe Ellipse (Pruefskript:
// die gezeichnete Nadel liegt nach dem Einschwingen parallel zur gezeichneten
// Feldlinie durch ihren Drehpunkt).
//
// ── Feld des geraden Drahts (hergeleitet, nachgerechnet) ───────────────────
// Ampere: ∮ B·ds = μ0·I. Aus Symmetrie ist B auf einem Kreis um den Draht
// ueberall gleich gross und tangential, also B·2πr = μ0·I:
//     B = μ0·I / (2π·r).
// Richtung (Biot-Savart dB ~ I·dl × r̂): Strom laengs +z gibt ẑ × r̂ = φ̂, von
// oben gesehen GEGEN den Uhrzeigersinn (rechte Hand: Daumen nach oben, die
// gekruemmten Finger laufen von +x ueber +y nach −x). In Komponenten:
//     B = s·K·(−y, x) / r²,   s = +1 Strom nach oben, s = −1 nach unten.
// Probe fuer s = +1 an vier Punkten (Abstand r):
//     vorn  (0, −r):  B ~ (+r, 0)  → nach RECHTS     (im Bild unten, vor dem Draht)
//     hinten(0, +r):  B ~ (−r, 0)  → nach LINKS
//     rechts(+r, 0):  B ~ (0, +r)  → nach hinten (Norden)
//     links (−r, 0):  B ~ (0, −r)  → nach vorn (Sueden)
// Das ist genau die Vorgabe des Profils: auf der VORDEREN Kreishaelfte zeigen
// Feld und Nadeln nach rechts, auf der hinteren nach links. Bei s = −1 alles
// umgekehrt, von oben gesehen im Uhrzeigersinn.
// Modellwerte (keine Zahl am Bildschirm): Einheit ist das Erdfeld, Erdfeld =
// (0, 1) (Norden = +y). K = 1760, also B = 40 am inneren Nadelkreis (r = 44) und
// 18,7 am aeusseren (r = 94). Groesste Abweichung einer Nadel von der Tangente
// mit Strom: atan(1/18,7) = 3,1° aussen, 1,4° innen (Pruefskript misst sie).
// MODELL: Im Versuch ist das Drahtfeld oft nur einige Male staerker als das
// Erdfeld (I = 10 A, r = 3 cm: 67 µT gegen rund 20 µT waagerechtes Erdfeld in
// NRW); die Nadeln weichen dann sichtbar ab. Hier ist das Erdfeld bewusst
// klein, damit die Kreisform eindeutig ist (Profil: „Erdfeld klein“).
//
// ── Kompassnadeln ──────────────────────────────────────────────────────────
// Gedaempfte Drehschwingung zur Richtung von B = Draht·f + Erdfeld, mit
// f = Stromfaktor (folgt dem Schalter in 0,06 s, −1 … +1). Rueckstellung
// ω² = 16·min(|B|, 14): ohne Strom ω = 4/s (die Nadeln pendeln sichtbar
// langsam nach Norden zurueck), mit Strom ω = 15/s (schnelles Einschwingen);
// Daempfungsgrad 0,18. Ohne Strom zeigen alle nach hinten (Norden), mit Strom
// stehen alle tangential. „Strom umpolen“ bei Strom: Die Nadeln stehen dann
// fast genau gegen das neue Feld (instabile Lage); ein kleiner Stoss in
// Richtung des Drehmoments laesst alle sichtbar umschlagen. Beim ersten
// Umpolen nach „neu“ in Zeitlupe.
//
// ── Feldlinien ─────────────────────────────────────────────────────────────
// Drei konzentrische Kreise r = 21, 44, 94: Die beiden aeusseren gehen genau
// durch die Nadelkreise (die Nadeln liegen AUF den Feldlinien). Die Radien
// stehen im Verhaeltnis 1 : 2,1 : 4,5 (gleiche Faktoren) – bei B ~ 1/r ist der
// Fluss zwischen zwei Nachbarlinien ~ ln(r2/r1), also gleich: Die Linien liegen
// innen dichter, dort ist das Feld staerker. Pfeilspitzen wandern in
// Feldrichtung (24 px/s); beim Umpolen kehren sie um. Ohne Strom keine Linien.
//
// ── Rechte Hand (Pruefskript misst die sichtbare Kruemmung) ────────────────
// Eigene Koordinaten (u, v, a): a = Daumenrichtung (laengs des Drahts), u = zum
// Handgelenk, v = nach hinten. u × v = a (Rechtssystem). Die Handflaeche liegt
// HINTER dem Draht bei v = 13 und schaut zum Betrachter; das Handgelenk liegt
// bei +u. Ist das eine RECHTE Hand? Ausgestreckt zeigen die Finger nach −u, die
// Handflaeche nach −v; fuer eine rechte Hand ist die Daumenseite
// (Fingerrichtung) × (Handflaechennormale) = (−u) × (−v) = u × v = +a. Der
// Daumen zeigt also nach +a. ✓
// Die vier Finger (bei a = 9, 3, −3, −9) laufen vom Knoechel links hinten
// (150°) um den Draht herum nach vorn bis rechts vorn (330°) – Winkel
// wachsend, also von +a aus gesehen gegen den Uhrzeigersinn: rechte-Hand-Regel.
// Ein blauer gebogener Pfeil an den Fingerspitzen zeigt die Feldrichtung: ein
// Bogen r = 18 um den Draht, 15 px unter der Griffmitte, vorn von 205° bis
// 275° (links → vorn → unter die Fingerspitzen rechts), bei gedrehter Hand
// gespiegelt (rechts → vorn → links, endet vor dem Daumen). Er bleibt immer
// UNTER der Faust, damit er nicht ueber den Fingern liegt; waehrend der
// Drehung blendet er um die Querstellung aus und kehrt um. Er steht NUR bei
// Strom: Ohne Strom hat der Draht kein Magnetfeld, also auch keine Feldrichtung
// (Deckkraft mal z.strom; z.strom folgt nur dem Schalter, beim Umpolen bleibt er).
// Die Hand selbst bleibt bei Schalter aus stehen (Daumen in die eingestellte Richtung).
// Strom nach oben: u = +x, v = +y, a = +z. Die sichtbaren Finger VOR dem Draht
// laufen von links nach rechts – wie das Feld auf der vorderen Kreishaelfte.
// Strom nach unten: dieselbe Hand um 180° um die waagerechte Blickachse
// (vorn–hinten, y) gedreht: (u, v, a) → (−x, +y, −z). Im Bild sieht das aus wie
// eine Drehung in der Bildebene; eine Drehung erhaelt die Haendigkeit, die Hand
// bleibt also eine rechte. Daumen nach unten, Handgelenk links, die Finger vor
// dem Draht laufen von rechts nach links – wie das Feld (vorn nach links).
// Die Drehung ist animiert (0,8 s); waehrend der Drehung ist die Hand
// zwischendurch quer gestellt.
// Gezeichnet in zwei Schichten: was hinter dem Draht liegt (Raum-y > 0: Hand
// mit Handgelenk, Aermel, Daumen, Knoechel), dann Draht, dann was davor liegt
// (Fingerteile mit y ≤ 0, untere zuerst, zuletzt der Pfeil).
// Pfeil „I“ neben dem Draht steht auf der Seite OHNE Hand (Strom nach oben:
// links, nach unten: rechts); beim Umpolen blendet er aus und drueben ein.
//
// ── Bedienung und Statuszeilen (woertlich aus KAPITEL1_PROFIL.md) ──────────
// Start: Schalter aus, Feldlinien aus, Hand aus; beim Einschalten fliesst der
// Strom im Draht VON UNTEN NACH OBEN (Klemme unten „+“, oben „−“: der Strom
// laeuft ausserhalb der Energiequelle von + nach −).
// Knopfreihenfolge: „Feldlinien zeigen“ und „rechte Hand zeigen“ stehen VOR
// „Schalter an“, „Strom umpolen“, „neu“. So liest simfakten.js im ersten
// Durchgang alle Zeilen ab: Feldlinien ohne Strom („Ohne Strom hat der Draht
// kein Magnetfeld …“), dann Strom nach oben („gegen den Uhrzeigersinn“), dann
// umgepolt („im Uhrzeigersinn“). In der Reihenfolge des Profils kaeme die
// erste und die zweite Zeile nie vor (dieselbe Falle wie bei drei-finger).
// „Ohne Strom HAT DER DRAHT kein Magnetfeld …“ (nicht „gibt es kein
// Magnetfeld“): Das Erdfeld bleibt – genau deshalb zeigen die Nadeln im selben
// Augenblick nach Norden. Geaendert am 04.10.2026, Profil nachgezogen.
// Alle Statuszeilen sind laenger als 18 Zeichen (simfakten.js liest erst ab 19).
// Lebendig: Strompakete, schwingende Nadeln, wandernde Pfeile, die Hand blendet
// weich ein und dreht sich beim Umpolen, Lichtringe am Schalter, an den Klemmen
// und an der Hand. Kein Zufall: alle Startauslenkungen sind fest.
// ════════════════════════════════════════════════════════════════════════
let _f10l = null;
const _F10L_CX = 180, _F10L_CY = 164;                 // Bildpunkt der Plattenmitte (Draht)
const _F10L_SA = 0.5, _F10L_CA = Math.sqrt(3) / 2;    // sin 30°, cos 30°
const _F10L_RP = 132, _F10L_DICKE = 6;                // Plattenradius, Plattenrand im Bild
const _F10L_LINIEN_R = [21, 44, 94];                  // Feldlinien (44 und 94 = Nadelkreise)
const _F10L_PFEILE_N = [2, 3, 5];                     // wandernde Pfeile je Feldlinie
const _F10L_K = 1760, _F10L_ERDE = 1;                 // Drahtfeld K/r, Erdfeld (Einheit)
const _F10L_YO = 12, _F10L_YU = 250;                  // Drahtenden im Bild
const _F10L_DR = 3;                                   // halbe Drahtbreite
const _F10L_LN = 12, _F10L_KR = 12;                   // halbe Nadellaenge, Gehaeuseradius
const _F10L_ZG = 112;                                 // Griffmitte der Hand ueber der Platte
const _F10L_HV = 13;                                  // Handflaeche: v (hinter dem Draht)
const _F10L_QUELLE = { x: 318, y: 26, w: 78, h: 26 }; // Energiequelle, Anschluesse bei y = 39
const _F10L_SCH = { dreh: 296, kontakt: 322, y: 242 };// Schalter im unteren Kabel
const _F10L_KL = { oben: 19, unten: 242 };            // Klemmen am Draht (Kabelhoehe)
const _F10L_TEMPO = 40;                               // px/s der Strompakete
const _F10L_PFEIL_V = 24;                             // px/s der Pfeile auf den Feldlinien
const _F10L_IPF = { links: 162, rechts: 198, y0: 30, y1: 50 };  // Pfeil „I“: auf der Seite ohne Hand
const _F10L_NMARKE = { r: 118, th: 68 * Math.PI / 180 };
// Nadeln: innen r = 44 bei 10° + k·60°, aussen r = 94 bei 40° + k·60°
const _F10L_NADELN = (() => {
  const L = [];
  for (let k = 0; k < 6; k++) L.push([44, (10 + 60 * k) * Math.PI / 180]);
  for (let k = 0; k < 6; k++) L.push([94, (40 + 60 * k) * Math.PI / 180]);
  return L.map(p => ({ x: p[0] * Math.cos(p[1]), y: p[0] * Math.sin(p[1]), r: p[0], th: p[1] }));
})();
const _F10L_NADEL0 = [0.3, -0.25, 0.35, -0.3, 0.28, -0.32, 0.22, -0.27, 0.33, -0.24, 0.26, -0.3];
// Hand: Flaechen in der (u, a)-Ebene bei v = HV; Daumen als Schlauch (u, v, a)
const _F10L_HAND = {
  flaeche: [[-11, -13], [-11, 12], [-2, 15], [10, 16], [20, 14], [30, 9], [50, 8],
            [50, -15], [30, -16], [14, -18], [-2, -17]],                  // Hand mit Handgelenk
  aermel: [[46, -18], [62, -18], [62, 10], [46, 10]],
  daumen: [[16, 9, 8], [14, 7, 17], [12, 4, 27]],
  finger: [[9, 330], [3, 330], [-3, 325], [-9, 312]]    // [a, Endwinkel in Grad]
};
// Gebogener Pfeil an den Fingerspitzen: Kreisbogen r = 18 um den Draht, 15 px
// UNTER der Griffmitte (Raum-z, nicht Hand-a: er bleibt unter der Faust, auch
// wenn die Hand gedreht ist), vorn von 205° bis 275° – er endet unter den
// Fingerspitzen; bei gedrehter Hand gespiegelt (x → −x), also im Uhrzeigersinn,
// und er endet dann vor dem nach unten zeigenden Daumen.
const _F10L_HPFEIL = { r: 18, dz: -15, von: 205, bis: 275 };
const _F10L_PFAD = {};                                 // Stromweg (einmal berechnet)

function _f10lP(x, y, z) { return [_F10L_CX + x, _F10L_CY - _F10L_SA * y - _F10L_CA * z]; }
// Feld in der Plattenebene (Einheit Erdfeld); f = Stromfaktor (+1 Strom nach oben)
function _f10lFeld(x, y, f) {
  const r2 = x * x + y * y, k = r2 > 1 ? f * _F10L_K / r2 : 0;
  return [-k * y, k * x + _F10L_ERDE];
}
// Hand: Punkt (u, v, a) → Raum, Drehung um die y-Achse um th, Massstab sc um die Griffmitte
function _f10lHandWelt(p, th, sc) {
  const c = Math.cos(th), s = Math.sin(th);
  return [sc * (p[0] * c + p[2] * s), sc * p[1], _F10L_ZG + sc * (-p[0] * s + p[2] * c)];
}
// Teile der Hand im Raum: { art, pts: [[x,y,z]…], schicht: 'hinten'|'vorn' }
function _f10lHandTeile(th, sc) {
  const H = _F10L_HAND, W = p => _f10lHandWelt(p, th, sc), teile = [];
  const flach = (liste, art) => teile.push({ art, pts: liste.map(q => W([q[0], _F10L_HV, q[1]])), schicht: 'hinten' });
  flach(H.flaeche, 'flaeche'); flach(H.aermel, 'aermel');
  teile.push({ art: 'daumen', pts: H.daumen.map(W), schicht: 'hinten' });
  for (const [a, ende] of H.finger) {
    const pts = [W([-11, _F10L_HV - 1, a])];
    for (let g = 150; g <= ende + 0.1; g += 7.5) {
      const w = g * Math.PI / 180;
      pts.push(W([11 * Math.cos(w), 11 * Math.sin(w), a]));
    }
    // an der Drahtebene (Raum-y = 0) teilen: hinten vor dem Draht zeichnen, vorn danach
    let teil = [pts[0]], hinten = pts[0][1] > 0;
    for (let i = 1; i < pts.length; i++) {
      const h = pts[i][1] > 0;
      if (h !== hinten) {
        const p = pts[i - 1], q = pts[i], t = p[1] / (p[1] - q[1]);
        const m = [p[0] + (q[0] - p[0]) * t, 0, p[2] + (q[2] - p[2]) * t];
        teil.push(m);
        teile.push({ art: 'finger', pts: teil, schicht: hinten ? 'hinten' : 'vorn' });
        teil = [m]; hinten = h;
      }
      teil.push(pts[i]);
    }
    teile.push({ art: 'finger', pts: teil, schicht: hinten ? 'hinten' : 'vorn', spitze: true });
  }
  return teile;
}
// Gebogener Pfeil (Raumpunkte, in Pfeilrichtung geordnet) und seine Deckkraft.
// sg = +1: Hand ungedreht (Strom nach oben) → von oben gesehen gegen den
// Uhrzeigersinn; sg = −1: gedreht → im Uhrzeigersinn. Waehrend der Drehung
// blendet er um die Querstellung herum aus und kehrt dort um.
function _f10lHandPfeil(th, sc) {
  const c = Math.cos(th), sg = c >= 0 ? 1 : -1, P = _F10L_HPFEIL, pts = [];
  for (let g = P.von; g <= P.bis + 0.1; g += 5) {
    const w = g * Math.PI / 180;
    pts.push([sg * sc * P.r * Math.cos(w), sc * P.r * Math.sin(w), _F10L_ZG + sc * P.dz]);
  }
  return { pts, sg, alpha: _bioFxKlemme((Math.abs(c) - 0.35) / 0.5) };
}

// ── Stromweg (Bildpunkte), Strom nach OBEN: Energiequelle + (rechts) → Kabel →
// Schalter → Klemme unten → Draht hinauf → Klemme oben → Kabel → − (links).
// art: kabel | drahtU (unter der Platte, vor ihr gezeichnet) | drahtO | quelle
function _f10lPfad() {
  if (_F10L_PFAD.seg) return _F10L_PFAD;
  const Q = _F10L_QUELLE, S = _F10L_SCH, ya = Q.y + Q.h / 2, seg = [];
  let x = Q.x + Q.w, y = ya;
  const zu = (nx, ny, art) => {
    seg.push({ x0: x, y0: y, x1: nx, y1: ny, art, len: Math.hypot(nx - x, ny - y), s0: 0 });
    x = nx; y = ny;
  };
  zu(408, ya, 'kabel'); zu(408, S.y, 'kabel'); zu(S.kontakt, S.y, 'kabel'); zu(S.dreh, S.y, 'kabel');
  zu(_F10L_CX, _F10L_KL.unten, 'kabel');
  zu(_F10L_CX, _F10L_CY, 'drahtU'); zu(_F10L_CX, _F10L_KL.oben, 'drahtO');
  zu(300, _F10L_KL.oben, 'kabel'); zu(Q.x, ya, 'kabel'); zu(Q.x + Q.w, ya, 'quelle');
  let s = 0;
  for (const g of seg) { g.s0 = s; s += g.len; }
  _F10L_PFAD.seg = seg; _F10L_PFAD.L = s;
  return _F10L_PFAD;
}

// ── Zustand und Bedienung ─────────────────────────────────────────────────
function _f10lInit() {
  _f10l = {
    t: 0, an: false, pol: 1, zeigen: false, hand: false,
    f: 0, strom: 0, hebel: 1, polS: 1, s: 0, iA: 0,
    linien: 0, wachs: 0, weg: 0,
    handA: 0, handTh: 0, handDreh: null,
    nadeln: _F10L_NADELN.map((p, i) => ({ x: p.x, y: p.y, phi: Math.PI / 2 + _F10L_NADEL0[i], w: 0 })),
    fx: { teile: [] }, zeitlupe: null, ahaGezeigt: false
  };
}
function _f10lHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welches Magnetfeld hat ein gerader Draht?</h3>
    <div class="fpm-note" style="margin-top:2px">Ein gerader Kupferdraht steht senkrecht in einer Platte. Auf der Platte stehen 12 kleine Kompassnadeln. Der Draht ist an eine Energiequelle mit Schalter angeschlossen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_f10l-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_f10l-linien" onclick="_f10lLinien()">Feldlinien zeigen</button>
          <button class="sim-btn" id="_f10l-handknopf" onclick="_f10lHand()">rechte Hand zeigen</button>
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_f10l-schalter" onclick="_f10lSchalter()">Schalter an</button>
          <button class="sim-btn" onclick="_f10lUmpolen()">Strom umpolen</button>
          <button class="sim-btn" onclick="_f10lNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Strom</div>
        <div class="lmp-status on" id="_f10l-strom"></div>
        <div class="fpm-label" style="margin-top:10px">Nadeln</div>
        <div class="lmp-status on" id="_f10l-nadeln"></div>
        <div class="fpm-label" style="margin-top:10px">Feldlinien</div>
        <div class="lmp-status on" id="_f10l-feld"></div>
        <div class="fpm-label" style="margin-top:10px">Rechte Hand</div>
        <div class="lmp-status on" id="_f10l-hand"></div>
        <div class="fpm-note" style="margin-top:10px">Die rote Spitze einer Kompassnadel ist ihr Nordpol.</div>
        <div class="fpm-note" style="margin-top:8px">Hinten auf der Platte ist Norden.</div>
        <div class="fpm-note" style="margin-top:8px">Die roten Punkte zeigen den Strom von + nach −.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Schalter aus, Feldlinien aus, Hand aus</p>
  </div>`;
}
function _f10lTextStrom() {
  const z = _f10l;
  if (!z.an) return 'Kein Strom im Draht.';
  return z.pol > 0 ? 'Strom fließt im Draht von unten nach oben.' : 'Strom fließt im Draht von oben nach unten.';
}
function _f10lTextNadeln() {
  return _f10l.an ? 'Die Nadeln bilden einen Kreis um den Draht.' : 'Alle Nadeln zeigen nach Norden.';
}
function _f10lTextFeld() {
  const z = _f10l;
  if (!z.zeigen) return 'Feldlinien sind ausgeblendet.';
  if (!z.an) return 'Ohne Strom hat der Draht kein Magnetfeld und keine Feldlinien.';
  return z.pol > 0 ? 'Feldlinien: Kreise um den Draht. Von oben gesehen gegen den Uhrzeigersinn.'
                   : 'Feldlinien: Kreise um den Draht. Von oben gesehen im Uhrzeigersinn.';
}
function _f10lTextHand() {
  return _f10l.hand ? 'Daumen in Stromrichtung – die Finger zeigen die Richtung der Feldlinien.'
                    : 'Die rechte Hand ist ausgeblendet.';
}
function _f10lStatus() {
  if (!_f10l) return;
  const z = _f10l;
  const setze = (id, txt) => {
    const e = document.getElementById(id);
    if (e) { e.textContent = txt; e.className = 'lmp-status on'; }
  };
  setze('_f10l-strom', _f10lTextStrom());
  setze('_f10l-nadeln', _f10lTextNadeln());
  setze('_f10l-feld', _f10lTextFeld());
  setze('_f10l-hand', _f10lTextHand());
  const knopf = (id, txt, an) => {
    const b = document.getElementById(id);
    if (!b) return;
    b.textContent = txt;
    try { if (b.classList) b.classList.toggle('primary', an); } catch (err) { /* Beiwerk */ }
  };
  knopf('_f10l-schalter', z.an ? 'Schalter aus' : 'Schalter an', true);
  knopf('_f10l-linien', z.zeigen ? 'Feldlinien aus' : 'Feldlinien zeigen', false);
  knopf('_f10l-handknopf', z.hand ? 'rechte Hand aus' : 'rechte Hand zeigen', false);
}
function _f10lSchalter() {
  if (!_f10l) return;
  const z = _f10l;
  z.an = !z.an;
  _bioFxWelle(z.fx.teile, (_F10L_SCH.dreh + _F10L_SCH.kontakt) / 2, _F10L_SCH.y, '#fde68a', 20);
  _f10lStatus();
}
function _f10lUmpolen() {
  if (!_f10l) return;
  const z = _f10l;
  z.pol = -z.pol;
  // Hand: 180° um die waagerechte Blickachse, immer im selben Sinn weiter
  if (z.handDreh) { z.handTh = z.handDreh.nach % (2 * Math.PI); z.handDreh = null; }
  if (z.hand || z.handA > 0.02) z.handDreh = { von: z.handTh, nach: z.handTh + Math.PI, p: 0 };
  else z.handTh = (z.handTh + Math.PI) % (2 * Math.PI);
  const ko = _f10lP(0, 0, (_F10L_CY - _F10L_KL.oben) / _F10L_CA), ku = [_F10L_CX, _F10L_KL.unten];
  _bioFxWelle(z.fx.teile, ko[0], ko[1], '#fca5a5', 16);
  _bioFxWelle(z.fx.teile, ku[0], ku[1], '#fca5a5', 16);
  if (z.an) {
    // Aha: alle Nadeln schlagen um. Sie stehen fast genau gegen das neue Feld
    // (instabil); ein kleiner Stoss in Richtung des Drehmoments.
    for (const m of z.nadeln) {
      const B = _f10lFeld(m.x, m.y, z.pol), d = Math.sin(Math.atan2(B[1], B[0]) - m.phi);
      m.w += (Math.abs(d) > 0.02 ? Math.sign(d) : 1) * 2.2;
    }
    if (!z.ahaGezeigt) { z.ahaGezeigt = true; _bioFxZeitlupe(z, 0.35, 1.1); z.zeitlupe.faktor = 0.35; }
  }
  _f10lStatus();
}
function _f10lLinien() {
  if (!_f10l) return;
  _f10l.zeigen = !_f10l.zeigen;
  _f10lStatus();
}
function _f10lHand() {
  if (!_f10l) return;
  const z = _f10l;
  z.hand = !z.hand;
  if (z.hand) {
    const g = _f10lP(0, 0, _F10L_ZG);
    _bioFxWelle(z.fx.teile, g[0] + 10, g[1], '#fde68a', 40);
  }
  _f10lStatus();
}
function _f10lNeu() {
  if (!_f10l) return;
  _f10lInit(); _f10lStatus();
}

// ── Bewegung ──────────────────────────────────────────────────────────────
function _f10lNadelSchritt(m, f, h) {
  const B = _f10lFeld(m.x, m.y, f), Bm = Math.hypot(B[0], B[1]);
  const om2 = 16 * Math.min(Bm, 14), om = Math.sqrt(om2);
  m.w += (om2 * Math.sin(Math.atan2(B[1], B[0]) - m.phi) - 0.36 * om * m.w) * h;
  m.phi += m.w * h;
}
function _f10lUpdate(dt) {
  if (!_f10l) return;
  const z = _f10l;
  dt = _bioFxDt(dt);
  const d = dt * _bioFxZeitlupeFaktor(z, dt);
  z.t += d;
  z.f += ((z.an ? z.pol : 0) - z.f) * Math.min(1, d / 0.06);
  z.strom += ((z.an ? 1 : 0) - z.strom) * Math.min(1, d * 10);
  z.hebel += ((z.an ? 0 : 1) - z.hebel) * Math.min(1, d * 12);
  z.polS += (z.pol - z.polS) * Math.min(1, d * 9);
  z.iA += ((z.an ? 1 : 0) - z.iA) * Math.min(1, d * 8);
  if (z.an) z.s += d * _F10L_TEMPO * z.pol;
  // Nadeln: kleine Schritte (ω bis 15/s)
  const n = Math.max(1, Math.ceil(d / 0.008)), h = d / n;
  for (const m of z.nadeln) for (let i = 0; i < n; i++) _f10lNadelSchritt(m, z.f, h);
  // Feldlinien: sichtbar nur gezeigt UND mit Strom; wachsen von vorn aus
  const sicht = z.zeigen && z.an;
  z.linien += ((sicht ? 1 : 0) - z.linien) * Math.min(1, d * (sicht ? 5 : 8));
  if (sicht) z.wachs = Math.min(2 * Math.PI, z.wachs + d * 8);
  else if (z.linien < 0.02) z.wachs = 0;
  z.weg += d * _F10L_PFEIL_V * Math.max(-1, Math.min(1, z.f * 3));
  // Hand: weich ein- und ausblenden, beim Umpolen drehen
  z.handA += ((z.hand ? 1 : 0) - z.handA) * Math.min(1, d * 6);
  if (z.handA < 0.003 && !z.hand) z.handA = 0;
  if (z.handDreh) {
    const D = z.handDreh;
    D.p += d / 0.8;
    if (D.p >= 1) { z.handTh = D.nach % (2 * Math.PI); z.handDreh = null; }
    else z.handTh = D.von + (D.nach - D.von) * _bioFxEase.sanft(D.p);
  }
  _bioFxAlleUpdate(z.fx, d);
}

// ── Zeichnen ──────────────────────────────────────────────────────────────
function _f10lPoly(ctx, pts, zu) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  if (zu) ctx.closePath();
}
// Kreis auf der Platte (Mitte cx, cy im Raum, Radius r, Hoehe zh) als Bildpunkte
function _f10lKreis(cx, cy, r, zh, w0, w1, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const w = w0 + (w1 - w0) * i / n;
    pts.push(_f10lP(cx + r * Math.cos(w), cy + r * Math.sin(w), zh));
  }
  return pts;
}
function _f10lPakete(ctx, z, arten) {
  if (z.strom < 0.02) return;
  const P = _f10lPfad(), n = Math.round(P.L / 17), ab = P.L / n;
  ctx.save();
  ctx.fillStyle = '#dc2626';
  ctx.globalAlpha = z.strom;
  for (let i = 0; i < n; i++) {
    const s = ((i * ab + z.s) % P.L + P.L) % P.L;
    let g = P.seg[0];
    for (const q of P.seg) { if (s >= q.s0) g = q; else break; }
    if (arten.indexOf(g.art) < 0) continue;
    const f = (s - g.s0) / g.len;
    ctx.beginPath(); ctx.arc(g.x0 + (g.x1 - g.x0) * f, g.y0 + (g.y1 - g.y0) * f, 2.7, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();
}
function _f10lDraht(ctx, y0, y1) {
  const x = _F10L_CX, r = _F10L_DR;
  ctx.fillStyle = '#b8733a';
  ctx.fillRect(x - r, y0, 2 * r, y1 - y0);
  ctx.strokeStyle = '#7c4a1e'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - r, y0); ctx.lineTo(x - r, y1); ctx.moveTo(x + r, y0); ctx.lineTo(x + r, y1); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,220,180,0.75)'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x - 1, y0); ctx.lineTo(x - 1, y1); ctx.stroke();
}
function _f10lKlemme(ctx, y) {
  ctx.fillStyle = '#64748b'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, _F10L_CX - 5, y - 4, 13, 8, 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath(); ctx.arc(_F10L_CX + 4, y, 1.6, 0, 2 * Math.PI); ctx.fill();
}
// Spitz (Laenge 1,9·g, Breite 1,1·g): ein fast gleichseitiges Dreieck liest sich
// je nach Lage in die falsche Richtung (am Bild gefunden).
function _f10lPfeilSpitze(ctx, x, y, ux, uy, g) {
  ctx.beginPath();
  ctx.moveTo(x + ux * g, y + uy * g);
  ctx.lineTo(x - ux * g * 0.9 - uy * g * 0.55, y - uy * g * 0.9 + ux * g * 0.55);
  ctx.lineTo(x - ux * g * 0.9 + uy * g * 0.55, y - uy * g * 0.9 - ux * g * 0.55);
  ctx.closePath();
}
// Feldlinien mit wandernden Pfeilspitzen. Richtung: Vorzeichen des Stroms.
function _f10lFeldlinien(ctx, z) {
  const a = z.linien * Math.min(1, Math.abs(z.f) * 1.5);
  if (a < 0.01 || z.wachs <= 0) return;
  const sg = z.f >= 0 ? 1 : -1, vorn = 1.5 * Math.PI, halb = z.wachs / 2;
  ctx.save();
  ctx.lineJoin = 'round';
  _F10L_LINIEN_R.forEach((r, k) => {
    ctx.globalAlpha = a * 0.9;
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1.7;
    _f10lPoly(ctx, _f10lKreis(0, 0, r, 0, vorn - halb, vorn + halb, Math.max(24, Math.round(r * 1.2))), false);
    ctx.stroke();
    ctx.globalAlpha = a;
    const n = _F10L_PFEILE_N[k];
    for (let i = 0; i < n; i++) {
      const w = vorn + 2 * Math.PI * (i + 0.5) / n + z.weg / r;
      const wd = Math.atan2(Math.sin(w - vorn), Math.cos(w - vorn));
      if (Math.abs(wd) > halb) continue;                // noch nicht gewachsen
      const p = _f10lP(r * Math.cos(w), r * Math.sin(w), 0);
      // Feldrichtung im Raum (Tangente, Vorzeichen des Stroms) → durch dieselbe Abbildung
      const q = _f10lP(r * Math.cos(w) - sg * Math.sin(w), r * Math.sin(w) + sg * Math.cos(w), 0);
      const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
      ctx.fillStyle = '#1e3a8a'; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.2;
      _f10lPfeilSpitze(ctx, p[0], p[1], (q[0] - p[0]) / l, (q[1] - p[1]) / l, 6);
      ctx.stroke(); ctx.fill();
    }
  });
  ctx.restore();
}
function _f10lNadelBild(m) {           // Bildpunkte: Drehpunkt, Nordspitze, Suedspitze
  const c = Math.cos(m.phi), s = Math.sin(m.phi), L = _F10L_LN;
  return { m: _f10lP(m.x, m.y, 1.5), n: _f10lP(m.x + L * c, m.y + L * s, 1.5), s: _f10lP(m.x - L * c, m.y - L * s, 1.5) };
}
function _f10lKompass(ctx, m) {
  ctx.save();
  _f10lPoly(ctx, _f10lKreis(m.x, m.y, _F10L_KR, 0, 0, 2 * Math.PI, 28), true);
  ctx.fillStyle = '#f8fafc'; ctx.fill();
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.4; ctx.stroke();
  const B = _f10lNadelBild(m), b = 2.8;
  for (const [spitze, farbe] of [[B.n, '#dc2626'], [B.s, '#16a34a']]) {
    const dx = spitze[0] - B.m[0], dy = spitze[1] - B.m[1], l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l * b, ny = dx / l * b;
    ctx.fillStyle = farbe;
    ctx.beginPath(); ctx.moveTo(spitze[0], spitze[1]);
    ctx.lineTo(B.m[0] + nx, B.m[1] + ny); ctx.lineTo(B.m[0] - nx, B.m[1] - ny); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(B.m[0], B.m[1], 1.6, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
function _f10lHandZeichnen(ctx, z, schicht) {
  if (z.handA < 0.01) return;
  const sc = 0.85 + 0.15 * z.handA;
  const teile = _f10lHandTeile(z.handTh, sc).filter(t => t.schicht === schicht);
  const mz = t => t.pts.reduce((s, p) => s + p[2], 0) / t.pts.length;
  if (schicht === 'vorn') {
    teile.sort((p, q) => mz(p) - mz(q));
    // Feldpfeil nur bei Strom (ohne Strom hat der Draht kein Magnetfeld)
    const hp = _f10lHandPfeil(z.handTh, sc), pa = hp.alpha * _bioFxKlemme(z.strom);
    if (pa > 0.01) teile.push({ art: 'pfeil', pts: hp.pts, alpha: pa });
  }
  ctx.save();
  ctx.globalAlpha = _bioFxKlemme(z.handA);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const t of teile) {
    const pts = t.pts.map(p => _f10lP(p[0], p[1], p[2]));
    if (t.art === 'aermel' || t.art === 'flaeche') {
      ctx.fillStyle = t.art === 'aermel' ? '#cbd5e1' : '#f2c4a0';
      ctx.strokeStyle = t.art === 'aermel' ? '#64748b' : '#9a6b4b'; ctx.lineWidth = 1.4;
      _f10lPoly(ctx, pts, true); ctx.fill(); ctx.stroke();
      continue;
    }
    if (t.art === 'pfeil') {
      ctx.globalAlpha = _bioFxKlemme(z.handA) * t.alpha;
      ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 6;
      _f10lPoly(ctx, pts, false); ctx.stroke();
      ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2.8;
      _f10lPoly(ctx, pts.slice(0, -1), false); ctx.stroke();
      const a = pts[pts.length - 2], b = pts[pts.length - 1];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      ctx.fillStyle = '#2563eb'; ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 1.2;
      _f10lPfeilSpitze(ctx, b[0], b[1], (b[0] - a[0]) / l, (b[1] - a[1]) / l, 6);
      ctx.stroke(); ctx.fill();
      continue;
    }
    const w = (t.art === 'daumen' ? 9 : 7) * sc;
    ctx.strokeStyle = '#9a6b4b'; ctx.lineWidth = w + 2.4;
    _f10lPoly(ctx, pts, false); ctx.stroke();
    ctx.strokeStyle = '#f2c4a0'; ctx.lineWidth = w;
    _f10lPoly(ctx, pts, false); ctx.stroke();
    if (t.art === 'daumen' || t.spitze) {             // Nagel an der Spitze
      const a = pts[pts.length - 2], b = pts[pts.length - 1];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      ctx.fillStyle = '#f8ddc8';
      ctx.beginPath(); ctx.arc(b[0] - (b[0] - a[0]) / l * 1.5, b[1] - (b[1] - a[1]) / l * 1.5, w * 0.3, 0, 2 * Math.PI); ctx.fill();
    }
  }
  ctx.restore();
}
function _f10lDraw(ctx, cv) {
  if (!_f10l) return;
  const z = _f10l, W = cv.width, H = cv.height, X = _F10L_CX, Y = _F10L_CY;
  const Q = _F10L_QUELLE, S = _F10L_SCH, ya = Q.y + Q.h / 2;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f4f7fb'); bg.addColorStop(1, '#e3e9f0');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Kabel: oben vom Draht zur Energiequelle, rechts hinunter zum Schalter, unten zum Draht
  ctx.save();
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(X + 4, _F10L_KL.oben); ctx.lineTo(300, _F10L_KL.oben); ctx.lineTo(Q.x, ya);
  ctx.moveTo(Q.x + Q.w, ya); ctx.lineTo(408, ya); ctx.lineTo(408, S.y); ctx.lineTo(S.kontakt, S.y);
  ctx.moveTo(S.dreh, S.y); ctx.lineTo(X + 4, S.y);
  ctx.stroke();
  ctx.restore();

  // Draht unter der Platte (wird von der Platte verdeckt), Pakete darin, Klemme unten
  _f10lDraht(ctx, Y, _F10L_YU);
  _f10lPakete(ctx, z, ['drahtU']);
  _f10lKlemme(ctx, _F10L_KL.unten);

  // Platte: Rand (vordere Haelfte nach unten verlaengert), Oberseite
  const rand = _f10lKreis(0, 0, _F10L_RP, 0, Math.PI, 2 * Math.PI, 60);
  const unten = rand.map(p => [p[0], p[1] + _F10L_DICKE]).reverse();
  ctx.save();
  ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
  _f10lPoly(ctx, rand.concat(unten), true); ctx.fill(); ctx.stroke();
  _f10lPoly(ctx, _f10lKreis(0, 0, _F10L_RP, 0, 0, 2 * Math.PI, 120), true);
  ctx.fillStyle = '#fbfcfe'; ctx.fill(); ctx.stroke();
  // Loch in der Mitte
  _f10lPoly(ctx, _f10lKreis(0, 0, 5, 0, 0, 2 * Math.PI, 16), true);
  ctx.fillStyle = '#475569'; ctx.fill();
  ctx.restore();

  // Feldlinien (auf der Platte), danach die Nadeln von hinten nach vorn
  _f10lFeldlinien(ctx, z);
  const reihe = z.nadeln.slice().sort((p, q) => q.y - p.y);
  for (const m of reihe) _f10lKompass(ctx, m);

  // Marke „N“ am Plattenrand hinten, mit Pfeil nach hinten
  {
    const M = _F10L_NMARKE, mx = M.r * Math.cos(M.th), my = M.r * Math.sin(M.th);
    const a = _f10lP(mx, my - 4, 0), b = _f10lP(mx, my + 10, 0);
    ctx.save();
    ctx.strokeStyle = '#334155'; ctx.fillStyle = '#334155'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1] + 3); ctx.stroke();
    _f10lPfeilSpitze(ctx, b[0], b[1], 0, -1, 4); ctx.fill();
    ctx.font = '800 12px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('N', a[0] + 5, a[1] + 1);
    ctx.restore();
  }

  // Hand hinten (Arm, Handflaeche, Daumen), Draht oben mit Paketen, Hand vorn
  _f10lHandZeichnen(ctx, z, 'hinten');
  _f10lDraht(ctx, _F10L_YO, Y);
  _f10lPakete(ctx, z, ['drahtO']);
  _f10lKlemme(ctx, _F10L_KL.oben);
  _f10lHandZeichnen(ctx, z, 'vorn');

  // Pfeil „I“ neben dem Draht in Stromrichtung (nur bei Strom)
  // Er steht auf der Seite, auf der die Hand NICHT ist (Strom nach oben: links),
  // und blendet beim Umpolen aus und auf der anderen Seite wieder ein.
  const ia = z.iA * Math.min(1, Math.abs(z.polS) * 1.5);
  if (ia > 0.02) {
    const I = _F10L_IPF, sg = z.polS >= 0 ? 1 : -1, x = sg > 0 ? I.links : I.rechts;
    const spitze = sg > 0 ? I.y0 : I.y1, fuss = sg > 0 ? I.y1 : I.y0;
    ctx.save(); ctx.globalAlpha = ia;
    ctx.strokeStyle = '#1f2937'; ctx.fillStyle = '#1f2937'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, fuss); ctx.lineTo(x, spitze + sg * 5); ctx.stroke();
    _f10lPfeilSpitze(ctx, x, spitze, 0, -sg, 5); ctx.fill();
    ctx.font = 'italic 700 14px serif'; ctx.textAlign = 'center';
    ctx.fillText('I', x + (sg > 0 ? -10 : 10), (I.y0 + I.y1) / 2 + 5);
    ctx.restore();
  }
  // + und − an den Klemmen (wechseln beim Umpolen); polS > 0: unten +
  {
    const k = Math.min(1, Math.abs(z.polS) * 1.2);
    ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * k;
    ctx.fillStyle = '#1f2937'; ctx.font = '700 15px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(z.polS > 0 ? '−' : '+', X - 13, _F10L_KL.oben + 5);
    ctx.fillText(z.polS > 0 ? '+' : '−', X - 13, _F10L_KL.unten + 5);
    ctx.restore();
  }

  // Energiequelle mit Schaltzeichen; polS > 0: Pluspol rechts
  ctx.save();
  ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.6;
  _bioFxRundRect(ctx, Q.x, Q.y, Q.w, Q.h, 4); ctx.fill(); ctx.stroke();
  const p = z.polS, xm = Q.x + Q.w / 2, xl = xm + 4 * p, xk = xm - 4 * p;
  ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(Q.x, ya); ctx.lineTo(Math.min(xl, xk), ya);
  ctx.moveTo(Math.max(xl, xk), ya); ctx.lineTo(Q.x + Q.w, ya); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xl, ya - 8); ctx.lineTo(xl, ya + 8); ctx.stroke();
  ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(xk, ya - 4); ctx.lineTo(xk, ya + 4); ctx.stroke();
  ctx.globalAlpha = Math.min(1, Math.abs(p) * 1.2);
  ctx.fillStyle = '#1f2937'; ctx.font = '700 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('+', xm + 17 * p, ya - 2); ctx.fillText('−', xm - 17 * p, ya - 2);
  ctx.restore();
  ctx.fillStyle = 'rgba(244,247,251,0.92)';
  _bioFxRundRect(ctx, xm - 46, Q.y + Q.h + 5, 92, 16, 4); ctx.fill();
  ctx.fillStyle = '#1f2937'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Energiequelle', xm, Q.y + Q.h + 17);
  // Schalter: Drehpunkt links, Kontakt rechts
  const al = 0.55 * z.hebel, lh = S.kontakt - S.dreh;
  ctx.save();
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(S.dreh, S.y); ctx.lineTo(S.dreh + lh * Math.cos(al), S.y - lh * Math.sin(al)); ctx.stroke();
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.arc(S.dreh, S.y, 3, 0, 2 * Math.PI); ctx.fill();
  ctx.beginPath(); ctx.arc(S.kontakt, S.y, 3, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
  _f10lPakete(ctx, z, ['kabel']);
  _bioFxAlleDraw(ctx, z.fx);
}
