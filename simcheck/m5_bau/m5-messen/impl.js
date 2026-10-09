
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mg1 „Was heißt messen?“ (Kennung m5-messen)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL6_PROFIL.md, Abschnitte mg1 und
// „m5-messen (mg1) · _m6g“. Ueberschrift = Frage der Einheit:
// „Wie lang ist der Stift?“
//
// Was man sieht: ein heller Schultisch von oben. Unten ein Holzlineal von 0
// bis 15 cm (25 px je cm), lange Striche mit Zahl bei jedem cm, kurze bei
// jedem halben cm, VOR der 0 ein Stueck leeres Lineal (wie bei echten
// Linealen), klein „cm“ neben der 0. Darueber ein gelber Bleistift mit Spitze,
// 8 cm lang. Liegt er am Lineal, fuehrt von seinem Anfang eine feine
// gestrichelte Linie hinunter zum Lineal (orange) und von seiner Spitze eine
// (blau); die beiden Zahlen darunter sind in denselben Farben hinterlegt.
// Zwischen Stift und Lineal legen sich Zentimeter-Stuecke: blaue Staebchen
// von 1 cm, ueber jedem seine Nummer (1, 2, …); Stueck 1–5 dunkelblau, ab 6
// hellblau (Fuenferstruktur). Der Lineal-Abschnitt unter jedem Stueck
// leuchtet in derselben Farbe auf (Bild ↔ Skala verbunden). Mit „Stücke:
// 2 cm“ sind die Stuecke 2 cm lang und tuerkis (nicht blau – der Hinweis
// „Jedes blaue Stück ist 1 cm lang.“ bleibt so wahr).
//
// Bewegung (spielt nach der Sprungmarke SELBST ab, N1 im Bauplan: ein Schritt
// im Heft = eine Handlung; anhalten kann die Lehrkraft):
//   Sprungmarke: der Stift gleitet an seine Lage (0,8 s), dann legen sich die
//     Stuecke von links nach rechts (0,3 s je Stueck), die Nummer erscheint
//     mit dem Stueck. Liegt der Stift schon dort, legen sich die Stuecke nach
//     0,25 s neu.
//   „Stift 1 cm nach links/rechts“: Stift und Stuecke gleiten gemeinsam
//     (0,6 s); die Zahl am Ende aendert sich, die Stuecke-Zahl nicht.
//   „Stücke: 1 cm“ ↔ „Stücke: 2 cm“: liegt der Stift am Lineal, verschwinden
//     die Stuecke und legen sich in der neuen Laenge neu (nach 0,25 s).
//   „neu“: der Stift gleitet zurueck neben das Lineal (0,6 s), keine Stuecke.
//   An der Grenze (Anfang 0 bzw. 7) wackelt der Stift kurz, _m6g-grenze
//   nennt den Grund bis zur naechsten Handlung.
// Alles ist eine Funktion der Ablaufzeit z.at und der Gleitzeit z.gl: keine
// Zufallszahl, jede Zahl im Bild kommt aus derselben Rechnung wie die
// Statuszeilen (_m6gStand, _m6gStueckOrte).
//
// Abspieldauer, gemessen in Frames zu 16 ms (Tempo normal), fuer simfakten.js:
//   Sprungmarke ab Start oder von einer anderen Lage: 0,8 s + 8 · 0,3 s
//     = 3,2 s (200 Frames); mit 2-cm-Stuecken 0,8 s + 4 · 0,3 s = 2,0 s
//     (125 Frames); Sprungmarke auf die eigene Lage oder „Stücke“ umschalten:
//     0,25 s + 8 · 0,3 s = 2,65 s (166 Frames); 1 cm schieben 0,6 s (38 Frames).
//   Mit den Schaltern aus fakten_ziehen.py (--voll --frames=25 --verlauf=4,
//   bis Frame 125) stehen die Endwerte der 1-cm-Sprungmarken erst beim
//   zweiten Druck derselben Sprungmarke im Dump (der laeuft bis zur Ruhe).
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6gMarke(a)):
//     „Stift ab 0“ · „Stift ab 1“ · „Stift ab 3“ · „Stift ab 5“
//   Reihe 2: „Stift 1 cm nach links“ · „Stift 1 cm nach rechts“ (_m6gSchieben,
//     blass, solange der Stift neben dem Lineal liegt) · „Stücke: 1 cm“ ↔
//     „Stücke: 2 cm“ (_m6gStuecke, ein Knopf) · „neu“ (_m6gNeu).
//   Grenzen: Anfang 0 bis 7 (Ende hoechstens 15).
//
// Statuszeilen (woertlich, alle mit Wert mehr als 18 Zeichen – simfakten.js):
//   _m6g-anfang   „Der Stift beginnt bei: 1“ (Start und nach „neu“: „Der Stift
//                 liegt neben dem Lineal.“; waehrend der Stift gleitet „…“)
//   _m6g-ende     „Am Ende des Stifts steht: 9“ (vorher und beim Gleiten „…“)
//   _m6g-stuecke  „Zentimeter-Stücke unter dem Stift: 8“ (zaehlt beim Legen
//                 hoch; mit 2-cm-Stuecken „2-cm-Stücke unter dem Stift: 4“)
//   _m6g-laenge   „Länge des Stifts: 8 cm“ (erst wenn alle Stuecke liegen,
//                 vorher „Länge des Stifts: …“) – Stuecke · Stuecklaenge
//   _m6g-rechnung „Kurz gerechnet: 9 cm − 1 cm = 8 cm“ (erst am Ende und nur,
//                 wenn der Stift ruht) – Ende minus Anfang mit Einheiten (N3)
//   _m6g-grenze   nur an der Grenze: „Weiter geht es nicht. Das Lineal endet
//                 bei 15.“ bzw. „Weiter geht es nicht. Die Zahlen beginnen
//                 bei 0.“ (links liegt vor der 0 noch leeres Lineal – deshalb
//                 nicht „Das Lineal beginnt bei 0.“)
//
// Werte (nachgerechnet, simcheck/werte.js):
//   Stift ab 0 → Ende 8,  8 Stuecke, 8 cm, „8 cm − 0 cm = 8 cm“
//   Stift ab 1 → Ende 9,  8 Stuecke, 8 cm, „9 cm − 1 cm = 8 cm“
//   Stift ab 3 → Ende 11, 8 Stuecke, 8 cm, „11 cm − 3 cm = 8 cm“
//   Stift ab 5 → Ende 13, 8 Stuecke, 8 cm, „13 cm − 5 cm = 8 cm“
//   frei: ab 7 → 15, 8, 8 cm, „15 cm − 7 cm = 8 cm“ · 2-cm-Stuecke ab 1 →
//   4 Stuecke, 8 cm.
// Start: Der Stift liegt schraeg neben dem Lineal, keine Stuecke.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): nach „Stift ab 1“ mit 1-cm-
// Stuecken, wenn das 8. Stueck liegt und am Ende 9 steht – Lichtring um den
// leeren Zentimeter zwischen 0 und 1 (dort liegt kein Stueck), er leuchtet
// 2,6 s nach. Einmal je Ablauf. Das widerlegt „9 cm“ (Zahl am Ende).
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen, Container fpm-lehrkraft fuer
// simfakten.js): eigene Knopfzeile UNTER den Heftknoepfen, davor klein „Für
// die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6gAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links auf der Leinwand.
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6gTempo()): ein Drittel so schnell.
//   „Länge verdecken: aus“ ↔ „… an“ (_m6gVerdecken()): verdeckt Stuecke-Zahl,
//     Laenge und Rechnung (Statuszeilen und die Nummern ueber den Stuecken)
//     bis zum Aufdecken – zum Vermuten an der Tafel. Die Stuecke selbst und
//     die Zahlen des Lineals bleiben sichtbar.
//   Eine Sprungmarke oder „neu“ heben die Pause auf; Tempo und Verdecken
//   bleiben stehen. Das wechselnde Wort steht in einem eigenen <span>.
// Hinweiszeile _m6g-lehrkraft (in der Pause bernsteinfarben) nennt immer die
// Einstellung: „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal,
// Länge: sichtbar.“
// Voreinstellung (Pause aus, Tempo normal, Laenge sichtbar): Zeitfaktor 1.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Maßzahl“, „Einheit“
// (das Wort steht gar nicht da), „Lege die 0 an“ und jede Regel als Satz,
// „Ende minus Anfang“ als Satz (die Rechnung steht als Zeichen da). Keine
// Namen, keine Punkte, keine Zeitmessung.
// ════════════════════════════════════════════════════════════════════════
let _m6g = null;
const _m6gLANG = 8;                       // der Stift ist 8 cm lang
const _m6gMARKEN = [0, 1, 3, 5];          // Sprungmarken = Zeilen der Heft-Tabelle
const _m6gK = {
  // Lineal: 0 bei X0, PX Pixel je cm, Zahlen bis CM_MAX; Koerper LX0 … LX1
  // (vor der 0 ein Stueck leeres Lineal), Oberkante LY0 = Messkante
  X0: 30, PX: 25, CM_MAX: 15, LX0: 12, LX1: 415, LY0: 172, LY1: 222,
  // Stift: Mitte y bei SY, halbe Hoehe SH; Start schraeg neben dem Lineal
  SY: 110, SH: 8, START: { x: 236, y: 58, r: -0.1 },
  // Zentimeter-Stuecke: oben, unten, Grundlinie der Nummer
  PY0: 145, PY1: 157, NY: 139,
  ANF_MAX: 7,                             // Anfang hoechstens 7 (Ende 15)
  // Zeiten in s
  T_GLEIT: 0.8, T_SCHUB: 0.6, T_STUECK: 0.3, T_NEU: 0.6, T_WIEDER: 0.25, T_WACKEL: 0.45,
  // Farben: Anfang orange, Ende blau, Stuecke (dunkel 1–5, hell ab 6)
  ANF: '#ea580c', END: '#1d4ed8', TINTE: '#0f172a', GRAU: '#64748b', HOLZ: '#3f2d14',
  ST1: { dunkel: '#1d4ed8', hell: '#60a5fa', rand: '#1e3a8a', zahl: '#1e3a8a' },
  ST2: { dunkel: '#0f766e', hell: '#2dd4bf', rand: '#134e4a', zahl: '#134e4a' }
};

// ── Ablauf: alles aus Ablaufzeit und Gleitzeit ─────────────────────────
// Lage des Stifts am Lineal (Mitte, ohne Drehung), Anfang bei a cm.
function _m6gPoseLage(a) {
  const K = _m6gK;
  return { x: K.X0 + (a + _m6gLANG / 2) * K.PX, y: K.SY, r: 0 };
}
function _m6gPoseStart() { const s = _m6gK.START; return { x: s.x, y: s.y, r: s.r }; }
// Wo der Stift gerade ist (gleitet weich von z.von nach z.zu).
function _m6gPose(z) {
  const u = z.glDauer > 0 ? _bioFxKlemme(z.gl / z.glDauer) : 1, e = _bioFxEase.sanft(u);
  return { x: z.von.x + (z.zu.x - z.von.x) * e, y: z.von.y + (z.zu.y - z.von.y) * e,
           r: z.von.r + (z.zu.r - z.von.r) * e };
}
function _m6gUnterwegs(z) { return z.ziel !== null && z.gl < z.glDauer; }
// Stand der Stuecke: wie viele liegen, sind alle da?
function _m6gStand(z) {
  const n = _m6gLANG / z.art, K = _m6gK;
  let gelegt = 0;
  if (z.ziel !== null) for (let k = 0; k < n; k++) if (z.at >= z.legeAb + (k + 1) * K.T_STUECK) gelegt++;
  return { n, gelegt, fertig: z.ziel !== null && gelegt === n };
}
// Wackeln an der Grenze (Verschiebung in px)
function _m6gWackel(z) {
  if (z.wackel <= 0) return 0;
  return 3 * Math.sin(z.wackel * 42) * (z.wackel / _m6gK.T_WACKEL);
}
// Orte der Stuecke, die gerade liegen oder sich legen (fuer Stuecke UND Lineal-Abschnitte).
function _m6gStueckOrte(z, p, dx) {
  const K = _m6gK, orte = [];
  if (z.ziel === null || !(z.at > z.legeAb)) return orte;
  const n = _m6gLANG / z.art, w = z.art * K.PX, links = p.x - _m6gLANG * K.PX / 2 + dx;
  const F = z.art === 1 ? K.ST1 : K.ST2;
  for (let k = 0; k < n; k++) {
    const u = (z.at - (z.legeAb + k * K.T_STUECK)) / K.T_STUECK;
    if (u <= 0) break;
    orte.push({ k, x0: links + k * w, x1: links + (k + 1) * w,
                e: _bioFxEase.raus(_bioFxKlemme(u)), farbe: k < 5 ? F.dunkel : F.hell, F });
  }
  return orte;
}

function _m6gInit() {
  const s = _m6gPoseStart();
  _m6g = { t: 0, at: 0, art: 1, ziel: null, key: null,
           von: s, zu: _m6gPoseStart(), gl: 1, glDauer: 1,
           legeAb: Infinity, wackel: 0, grenze: '',
           aha: false, ahaGlanz: 0, fx: { teile: [] },
           pause: false, langsam: false, verdeckt: false };   // Lehrkraft-Einstellungen
  _m6g.stand = _m6gStand(_m6g);
}
function _m6gHTML() {
  const marke = a => `<button class="sim-btn" id="_m6g-b-${a}" onclick="_m6gMarke(${a})">Stift ab&nbsp;${a}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie lang ist der Stift?</h3>
    <div class="fpm-note" style="margin-top:2px">Jedes blaue Stück ist 1&nbsp;cm lang. Wähle eine Lage für den Stift.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6g-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6gMARKEN.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6g-links" onclick="_m6gSchieben(-1)">Stift 1&nbsp;cm nach links</button>
          <button class="sim-btn" id="_m6g-rechts" onclick="_m6gSchieben(1)">Stift 1&nbsp;cm nach rechts</button>
          <button class="sim-btn" id="_m6g-art" onclick="_m6gStuecke()">Stücke: <span id="_m6g-art-an">1&nbsp;cm</span></button>
          <button class="sim-btn" onclick="_m6gNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6g-pause" onclick="_m6gAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6g-tempo" onclick="_m6gTempo()">Tempo: <span id="_m6g-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6g-verdeckt" onclick="_m6gVerdecken()">Länge verdecken: <span id="_m6g-verdeckt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6g-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6g-anfang" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6g-ende" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6g-stuecke" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6g-laenge" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6g-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_m6g-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Der Stift liegt neben dem Lineal.</p>
  </div>`;
}
function _m6gSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6gStatus() {
  if (!_m6g) return;
  const z = _m6g, K = _m6gK, st = z.stand, zu = z.verdeckt;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const liegt = z.ziel !== null && !_m6gUnterwegs(z);
  const a = z.ziel, ende = a + _m6gLANG;
  const F = z.art === 1 ? K.ST1 : K.ST2;
  _m6gSetze('_m6g-anfang', z.ziel === null ? 'Der Stift liegt neben dem Lineal.'
            : 'Der Stift beginnt bei: ' + (liegt ? f(a, K.ANF) : '…'));
  _m6gSetze('_m6g-ende', 'Am Ende des Stifts steht: ' + (liegt ? f(ende, K.END) : '…'));
  _m6gSetze('_m6g-stuecke', (z.art === 1 ? 'Zentimeter-Stücke' : z.art + '-cm-Stücke') +
            ' unter dem Stift: ' + (zu ? 'verdeckt' : f(st.gelegt, F.dunkel)));
  // Laenge = Zahl der Stuecke · Laenge eines Stuecks (erst, wenn alle liegen)
  const laenge = st.gelegt * z.art;
  _m6gSetze('_m6g-laenge', 'Länge des Stifts: ' + (!st.fertig ? '…' : zu ? 'verdeckt' : f(laenge + ' cm', K.TINTE)));
  // Kurz gerechnet: Ende minus Anfang, mit Einheiten (nur, wenn der Stift ruht)
  _m6gSetze('_m6g-rechnung', 'Kurz gerechnet: ' + (!(st.fertig && liegt) ? '…' : zu ? 'verdeckt'
            : f(ende + ' cm', K.END) + ' − ' + f(a + ' cm', K.ANF) + ' = ' + f((ende - a) + ' cm', K.TINTE)));
  const g = _m6gSetze('_m6g-grenze', z.grenze);
  if (g && g.style) g.style.display = z.grenze ? '' : 'none';
  // Sprungmarke der Lage hervorheben; Schiebeknoepfe blass, solange der Stift neben dem Lineal liegt
  _m6gMARKEN.forEach(m => {
    const b = document.getElementById('_m6g-b-' + m);
    if (b && b.classList) b.classList.toggle('primary', m === z.ziel);
  });
  for (const id of ['_m6g-links', '_m6g-rechts']) {
    const b = document.getElementById(id);
    if (b) { b.disabled = z.ziel === null; if (b.style) b.style.opacity = z.ziel === null ? '0.45' : ''; }
  }
  _m6gSetze('_m6g-art-an', z.art + '&nbsp;cm');
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6gSetze('_m6g-pause', z.pause ? 'weiter' : 'Pause');
  _m6gSetze('_m6g-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6gSetze('_m6g-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6gSetze('_m6g-lehrkraft', _m6gHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6g-pause', z.pause], ['_m6g-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6gHinweis() {
  const z = _m6g;
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Länge: ' + (z.verdeckt ? 'verdeckt' : 'sichtbar') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Sprungmarke: Stift an Anfang a legen, dann legen sich die Stuecke selbst.
function _m6gMarke(a) {
  if (!_m6g || _m6gMARKEN.indexOf(a) < 0) return;
  const z = _m6g, K = _m6gK, jetzt = _m6gPose(z), ziel = _m6gPoseLage(a);
  const schonDa = Math.abs(jetzt.x - ziel.x) < 0.5 && Math.abs(jetzt.y - ziel.y) < 0.5 && Math.abs(jetzt.r) < 1e-3;
  z.von = jetzt; z.zu = ziel; z.glDauer = K.T_GLEIT; z.gl = schonDa ? K.T_GLEIT : 0;
  z.ziel = a; z.key = a;
  z.at = 0; z.legeAb = schonDa ? K.T_WIEDER : K.T_GLEIT;
  z.aha = false; z.ahaGlanz = 0; z.fx.teile.length = 0;
  z.grenze = ''; z.wackel = 0;
  z.pause = false;                         // eine Sprungmarke hebt die Pause auf
  z.stand = _m6gStand(z);
  _m6gStatus();
}
// Stift samt Stuecken um 1 cm schieben (Anfang 0 bis 7).
function _m6gSchieben(d) {
  if (!_m6g || _m6g.ziel === null) return;
  const z = _m6g, K = _m6gK, neu = z.ziel + d;
  z.grenze = '';
  if (neu < 0 || neu > K.ANF_MAX) {
    z.wackel = K.T_WACKEL;
    z.grenze = neu < 0 ? 'Weiter geht es nicht. Die Zahlen beginnen bei 0.'
                       : 'Weiter geht es nicht. Das Lineal endet bei ' + K.CM_MAX + '.';
    _m6gStatus();
    return;
  }
  z.von = _m6gPose(z); z.zu = _m6gPoseLage(neu); z.gl = 0; z.glDauer = K.T_SCHUB;
  z.ziel = neu; z.key = null; z.wackel = 0;
  _m6gStatus();
}
// Stuecke 1 cm ↔ 2 cm: liegt der Stift am Lineal, legen sie sich neu.
function _m6gStuecke() {
  if (!_m6g) return;
  const z = _m6g, K = _m6gK;
  z.art = z.art === 1 ? 2 : 1;
  z.grenze = '';
  if (z.ziel !== null && z.at >= z.legeAb) { z.at = 0; z.legeAb = K.T_WIEDER; }
  z.stand = _m6gStand(z);
  _m6gStatus();
}
function _m6gNeu() {
  if (!_m6g) return;
  const z = _m6g, K = _m6gK;
  z.von = _m6gPose(z); z.zu = _m6gPoseStart(); z.gl = 0; z.glDauer = K.T_NEU;
  z.ziel = null; z.key = null; z.art = 1;
  z.at = 0; z.legeAb = Infinity;
  z.aha = false; z.ahaGlanz = 0; z.fx.teile.length = 0;
  z.grenze = ''; z.wackel = 0;
  z.pause = false;                         // „neu“ hebt die Pause auf
  z.stand = _m6gStand(z);
  _m6gStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6gAnhalten() {
  if (!_m6g) return;
  _m6g.pause = !_m6g.pause;
  _m6gStatus();
}
function _m6gTempo() {
  if (!_m6g) return;
  _m6g.langsam = !_m6g.langsam;
  _m6gStatus();
}
function _m6gVerdecken() {
  if (!_m6g) return;
  _m6g.verdeckt = !_m6g.verdeckt;
  _m6gStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6gZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6gUpdate(dt) {
  if (!_m6g) return;
  const z = _m6g, K = _m6gK;
  dt = _bioFxDt(dt) * _m6gZeitfaktor(z);            // ab hier Sim-Zeit
  z.t += dt; z.at += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  let neu = false;
  if (z.gl < z.glDauer && dt > 0) {
    z.gl = Math.min(z.glDauer, z.gl + dt);
    if (z.gl >= z.glDauer) neu = true;             // angekommen: Zahlen nachfuehren
  }
  if (dt > 0) {
    const st = _m6gStand(z), alt = z.stand;
    if (st.gelegt !== alt.gelegt || st.fertig !== alt.fertig || st.n !== alt.n) neu = true;
    if (!z.aha && z.key === 1 && z.art === 1 && st.fertig && z.ziel === 1 && !_m6gUnterwegs(z)) {
      // Aha: das 8. Stueck liegt, am Ende steht 9 – Lichtring um den leeren Zentimeter 0 bis 1
      z.aha = true; z.ahaGlanz = 2.6;
      _bioFxWelle(z.fx.teile, K.X0 + K.PX / 2, K.LY0 + 6, '#f59e0b', 30);
    }
    z.stand = st;
  }
  if (neu) _m6gStatus();
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6gText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m6gK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Heller Schultisch von oben (Maserung aus Sinuslinien, ohne Zufall).
function _m6gTisch(ctx, W, H) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f4f2ec'); bg.addColorStop(1, '#e9e5db');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.strokeStyle = 'rgba(150,130,100,0.10)'; ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const y0 = 16 + i * 41;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 14) {
      const y = y0 + 2.5 * Math.sin(x / 47 + i * 1.3);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
// Das Lineal: Koerper, leuchtende Abschnitte unter den Stuecken, Striche, Zahlen.
function _m6gLineal(ctx, orte, liegt) {
  const z = _m6g, K = _m6gK, X = c => K.X0 + c * K.PX;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.12)';
  _bioFxRundRect(ctx, K.LX0 + 2, K.LY0 + 4, K.LX1 - K.LX0, K.LY1 - K.LY0, 4); ctx.fill();
  const g = ctx.createLinearGradient(0, K.LY0, 0, K.LY1);
  g.addColorStop(0, '#f5dca4'); g.addColorStop(1, '#e4bd74');
  ctx.fillStyle = g; ctx.strokeStyle = '#a1743a'; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, K.LX0, K.LY0, K.LX1 - K.LX0, K.LY1 - K.LY0, 4); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(150,100,40,0.16)'; ctx.lineWidth = 1;          // Maserung
  for (const dy of [38, 43, 47]) {
    ctx.beginPath(); ctx.moveTo(K.LX0 + 6, K.LY0 + dy); ctx.lineTo(K.LX1 - 6, K.LY0 + dy - 1.5); ctx.stroke();
  }
  // Abschnitte unter den Stuecken leuchten in der Farbe ihres Stuecks
  // (erst weiss aufhellen, dann die Stueckfarbe: so bleibt es blau statt grau auf dem Holz)
  for (const o of orte) {
    ctx.globalAlpha = 0.6 * o.e;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(o.x0 + 1, K.LY0 + 1, o.x1 - o.x0 - 2, 11);
    ctx.globalAlpha = 0.42 * o.e;
    ctx.fillStyle = o.farbe;
    ctx.fillRect(o.x0 + 1, K.LY0 + 1, o.x1 - o.x0 - 2, 11);
  }
  ctx.globalAlpha = 1;
  // Lichtring-Nachglanz um den leeren Zentimeter 0 bis 1 (Aha)
  if (z.ahaGlanz > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.ahaGlanz / 2.6 * 1.6);
    ctx.fillStyle = 'rgba(253,230,138,0.55)';
    ctx.fillRect(X(0) + 1, K.LY0 + 1, K.PX - 2, 11);
    _bioFxLeuchten(ctx, X(0.5), K.LY0 + 6, 11, z.t, '245,158,11');
    ctx.restore();
  }
  // Striche: lang bei jedem cm, kurz bei jedem halben cm
  ctx.strokeStyle = K.HOLZ;
  for (let c = 0; c <= K.CM_MAX; c++) {
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(X(c), K.LY0); ctx.lineTo(X(c), K.LY0 + 15); ctx.stroke();
    if (c < K.CM_MAX) {
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(c + 0.5), K.LY0); ctx.lineTo(X(c + 0.5), K.LY0 + 8); ctx.stroke();
    }
  }
  // Zahlen; ruht der Stift, sind Anfang (orange) und Ende (blau) hinterlegt
  for (let c = 0; c <= K.CM_MAX; c++) {
    let farbe = K.HOLZ;
    if (liegt && (c === z.ziel || c === z.ziel + _m6gLANG)) {
      const anf = c === z.ziel;
      farbe = anf ? K.ANF : K.END;
      ctx.fillStyle = anf ? '#ffedd5' : '#dbeafe'; ctx.strokeStyle = farbe; ctx.lineWidth = 1.4;
      _bioFxRundRect(ctx, X(c) - 11, K.LY0 + 18, 22, 18, 5); ctx.fill(); ctx.stroke();
    }
    _m6gText(ctx, String(c), X(c), K.LY0 + 32, 13, farbe);
  }
  _m6gText(ctx, 'cm', X(0) + 3, K.LY0 + 46, 10, '#7c5a26', 'left', '600');
  ctx.restore();
}
// Gestrichelte Linien von Anfang (orange) und Spitze (blau) des Stifts hinunter zum Lineal.
function _m6gLinien(ctx, p, dx) {
  const K = _m6gK, S = K.START;
  // erst im letzten Drittel des Wegs zum Lineal einblenden – sonst zeigen die
  // Linien waehrend des Gleitens auf Stellen wie 3,7 und 11,7
  const a = _bioFxKlemme(((p.y - S.y) / (K.SY - S.y) - 0.7) / 0.3);
  if (a <= 0.02) return;
  const c = Math.cos(p.r), s = Math.sin(p.r), h = _m6gLANG * K.PX / 2;
  const anf = { x: p.x + dx - h * c, y: p.y - h * s }, ende = { x: p.x + dx + h * c, y: p.y + h * s };
  ctx.save();
  ctx.globalAlpha = a;
  ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
  for (const [q, farbe, y0] of [[anf, K.ANF, anf.y + K.SH], [ende, K.END, ende.y + 1]]) {
    ctx.strokeStyle = farbe;
    ctx.beginPath(); ctx.moveTo(q.x, y0); ctx.lineTo(q.x, K.LY0); ctx.stroke();
  }
  ctx.setLineDash([]);
  for (const [q, farbe] of [[anf, K.ANF], [ende, K.END]]) {
    ctx.fillStyle = farbe;
    ctx.beginPath(); ctx.arc(q.x, K.LY0, 2.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Die Stuecke mit ihren Nummern (legen sich von oben her hin).
function _m6gStueckeZeichnen(ctx, orte) {
  const z = _m6g, K = _m6gK;
  for (const o of orte) {
    const dy = -14 * (1 - o.e);
    ctx.save();
    ctx.globalAlpha = o.e;
    ctx.fillStyle = 'rgba(15,23,42,0.10)';
    _bioFxRundRect(ctx, o.x0 + 2, K.PY0 + dy + 2, o.x1 - o.x0 - 2, K.PY1 - K.PY0, 2.5); ctx.fill();
    ctx.fillStyle = o.farbe; ctx.strokeStyle = o.F.rand; ctx.lineWidth = 1.1;
    _bioFxRundRect(ctx, o.x0 + 1, K.PY0 + dy, o.x1 - o.x0 - 2, K.PY1 - K.PY0, 2.5); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 1;     // Glanzkante
    ctx.beginPath(); ctx.moveTo(o.x0 + 4, K.PY0 + dy + 2.5); ctx.lineTo(o.x1 - 4, K.PY0 + dy + 2.5); ctx.stroke();
    if (!z.verdeckt) _m6gText(ctx, String(o.k + 1), (o.x0 + o.x1) / 2, K.NY + dy, 11, o.F.zahl);
    ctx.restore();
  }
}
// Gelber Bleistift: flaches Ende links, Spitze rechts; Laenge 8 cm.
function _m6gStift(ctx, x, y, r) {
  const K = _m6gK, h = _m6gLANG * K.PX / 2, H = K.SH;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(r);
  ctx.fillStyle = 'rgba(15,23,42,0.14)';                              // Schatten
  ctx.beginPath();
  ctx.moveTo(-h + 2, -H + 4); ctx.lineTo(h - 38, -H + 4); ctx.lineTo(h + 2, 4);
  ctx.lineTo(h - 38, H + 4); ctx.lineTo(-h + 2, H + 4); ctx.closePath(); ctx.fill();
  // Holzkegel und Mine
  ctx.fillStyle = '#f3d9a4'; ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(h - 40, -H); ctx.lineTo(h - 8, -2.3); ctx.lineTo(h - 8, 2.3); ctx.lineTo(h - 40, H);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#374151';
  ctx.beginPath(); ctx.moveTo(h - 8, -2.3); ctx.lineTo(h, 0); ctx.lineTo(h - 8, 2.3); ctx.closePath(); ctx.fill();
  // Schaft in drei Flaechen
  ctx.fillStyle = '#fde047'; ctx.fillRect(-h, -H, 2 * h - 40, 5);
  ctx.fillStyle = '#facc15'; ctx.fillRect(-h, -H + 5, 2 * h - 40, 6);
  ctx.fillStyle = '#eab308'; ctx.fillRect(-h, -H + 11, 2 * h - 40, 5);
  ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1;
  ctx.strokeRect(-h, -H, 2 * h - 40, 2 * H);
  ctx.fillStyle = '#ca8a04'; ctx.fillRect(-h, -H, 4, 2 * H);           // flaches Ende
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-verteilen.
function _m6gPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6gText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6gDraw(ctx, cv) {
  if (!_m6g) return;
  const z = _m6g, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  _m6gTisch(ctx, W, H);
  const p = _m6gPose(z), dx = _m6gWackel(z);
  const orte = _m6gStueckOrte(z, p, dx);
  const liegt = z.ziel !== null && !_m6gUnterwegs(z);
  _m6gLineal(ctx, orte, liegt);
  _m6gLinien(ctx, p, dx);
  _m6gStueckeZeichnen(ctx, orte);
  _m6gStift(ctx, p.x + dx, p.y, p.r);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6gPauseSchild(ctx);
}
