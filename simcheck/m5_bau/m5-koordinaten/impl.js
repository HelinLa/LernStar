
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mf3 „Wo liegt der Punkt?“ (Kennung m5-koordinaten)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL3_PROFIL.md, Abschnitt m5-koordinaten.
// Ueberschrift: „Wo liegt der Punkt?“ (der Name der Einheit). Die Frage der
// Einheit („Kommt Tarek mit seinem Weg zum Punkt (3|5)?“) traegt einen Namen,
// und am Bildschirm stehen keine Namen (MATHE_PROFIL § 10, Regel 11).
//
// Was man sieht: links eine Schatzkarte aus Karopapier als Koordinaten-
// system, waagerechte Achse 0 bis 8, senkrechte Achse 0 bis 6, beide mit
// Pfeil und mit Zahlen an jedem Kaestchen, die 0 im Ursprung. Beschriftet wie
// das Koordinatengitter im Heft (Abdullah, 09.10.2026: „Koordinatensystem mit
// x und y beschriften“): „x“ hinter der Pfeilspitze der waagerechten Achse,
// „y“ neben der Pfeilspitze der senkrechten. Vier gezeichnete Dinge stehen mit
// dem Fuss auf ihrem Gitterpunkt, der einen dunklen Ortspunkt traegt, das
// Wort steht daneben: Baum bei (3|5), Haus bei (5|3), Brunnen bei (0|4),
// Boot bei (6|0). Eine violette Spielfigur steht beim Start (0|0).
// Wird ein Punkt gewaehlt, geht die Figur Kaestchen fuer Kaestchen (jeder
// Schritt ein kleiner Huepfer, 0,18 s): erst so viele Schritte, wie die
// ERSTE Zahl sagt, waagerecht – die Spur ist BLAU –, dann eine kurze Pause an
// der Ecke, dann so viele Schritte, wie die ZWEITE Zahl sagt, senkrecht – die
// Spur ist ORANGE. An jedem Gitterpunkt, den sie erreicht, bleibt ein Punkt
// in der Farbe der Spur liegen; ist ein Wegstueck fertig, bekommt es eine
// Pfeilspitze. Schrittzaehler: Neben jedem Wegstueck steht ein Schild in
// seiner Farbe mit der Zahl der Schritte, die schon gegangen sind (1, 2,
// 3 …); es wandert mit der Mitte der Spur mit. Ein Wegstueck mit 0 Schritten
// faellt weg. Am Ziel springt das Ding federnd schraeg in die Mitte des
// Kaestchens darueber (0,35 s) – so verdeckt die Figur es nie, und es landet
// auf keinem anderen Gitterpunkt – und leuchtet mit einem pulsierenden
// Lichtkranz nach (2,2 s); sein Wort bleibt am Punkt stehen. Die Achsen-
// zahlen werden zuletzt gezeichnet, mit hellem Rand, damit nichts sie verdeckt.
// Steht die Figur nicht am Start, verschwindet sie zuerst (0,125 s), die
// alte Spur verblasst, und sie taucht beim Start wieder auf (0,125 s).
// Rechts eine Tafel: „Punkt“ mit dem gewaehlten Punkt gross („A(3|5)“, die
// erste Zahl blau, die zweite orange – dieselben Farben wie die Spuren),
// beim vertauschten Gehen darunter das Wort „vertauscht“; „Figur“ mit der
// Stelle, an der die Figur gerade steht, ebenso gefaerbt (erste Zahl blau,
// zweite orange) – sie zaehlt Schritt fuer Schritt mit: (1|0), (2|0) …;
// unten die Farberklaerung „erste Zahl“ (blau) und „zweite Zahl“ (orange).
// „vertauscht gehen“: dieselben zwei Zahlen, aber die Wegstuecke vertauscht –
// erst die erste Zahl senkrecht (blau), dann die zweite waagerecht (orange).
// Der Weg zum gewaehlten Punkt bleibt dabei blass gestrichelt stehen, zum
// Vergleich. Landet die Figur auf keinem Ding, liegt dort ein gestrichelter
// grauer Ring am Boden. In der Tafel sieht man dabei, dass die BLAUE Spur jetzt die
// ORANGE Zahl der Figur wachsen laesst.
// Ein Knopf waehrend einer Bewegung: Die Figur geht sofort zurueck zum Start
// und dann den neuen Weg. Jede Knopffolge endet so im selben Zustand.
// Texte um die Leinwand (woertlich): darueber „Die Figur startet bei (0|0)
// und geht Kästchen für Kästchen. Neben jedem Wegstück steht, wie viele
// Schritte sie gegangen ist.“ · rechts „„vertauscht gehen“ geht den
// gewählten Punkt noch einmal, mit vertauschten Wegstücken.“ · darunter
// „Start: Die Figur steht bei (0|0), noch kein Punkt gewählt“.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5oPunkt('a'|'b'|'c'|'d')):
//     „A(3|5)“ · „B(5|3)“ · „C(0|4)“ · „D(6|0)“
//   Reihe 2: „vertauscht gehen“ (_m5oVertauscht(): fuer den gewaehlten
//     Punkt erst senkrecht so viele Schritte wie die erste Zahl, dann
//     waagerecht wie die zweite; ohne gewaehlten Punkt wackelt die Figur
//     nur) · „neu“ (_m5oNeu(): kein Punkt, Figur beim Start, keine Spur)
//
// Statuszeilen (woertlich; jede mit mehr als 18 Zeichen, simfakten.js-Grenze):
//   _m5o-punkt  „Gewählter Punkt: noch keiner“ → „Gewählter Punkt: A(3|5)“
//   _m5o-weg    „Weg: noch kein Punkt gewählt“ →
//               „Weg: erst 3 Schritte, dann 5 Schritte“ (gleich beim Waehlen;
//               beim vertauschten Gehen derselbe Text – die Zahlen bleiben,
//               nur die Richtungen wechseln, und die zeigt allein das Bild)
//   _m5o-ziel   „Die Figur steht am Start (0|0).“ · unterwegs „Die Figur ist
//               unterwegs …“ · bei Ankunft „Die Figur steht beim Baum.“ ·
//               vertauscht „Vertauscht gegangen: Die Figur steht beim Haus.“
//               bzw. „Vertauscht gegangen: Die Figur steht an einer leeren
//               Stelle.“ · ohne Punkt nach „vertauscht gehen“: „Zuerst einen
//               Punkt wählen: A, B, C oder D.“
//
// Werte (jede Sprungmarke nachgerechnet mit simcheck/werte.js, die Figur
// jeweils bis zur Ankunft gelaufen):
//   A(3|5)  Weg erst 3, dann 5  → Baum     · vertauscht (5|3) → Haus
//   B(5|3)  Weg erst 5, dann 3  → Haus     · vertauscht (3|5) → Baum
//   C(0|4)  Weg erst 0, dann 4  → Brunnen  · vertauscht (4|0) → leere Stelle
//   D(6|0)  Weg erst 6, dann 0  → Boot     · vertauscht (0|6) → leere Stelle
// Zeiten (Frames zu 16 ms, simcheck-Treiber): Ein Weg mit 8 Schritten von
// einem anderen Punkt aus ist nach 1,91 s fertig (0,25 zurueck + 0,1 Start +
// 8 · 0,18 + 0,12 Pause), also nach 120 Frames. simfakten.js mit
// --frames=25 --verlauf=4 liest bis 125 Frames – jede Ankunft steht im Dump.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Kommt die Figur bei
// „vertauscht gehen“ mit dem Punkt A(3|5) beim HAUS an, laeuft ein goldener
// Lichtring um das Haus, und es leuchtet laenger nach (3,2 s). Das widerlegt
// Vermutung 1 („Ja, Tarek landet genau bei (3|5).“). Jedes Mal.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „oben“, „hoch“,
// „rechts“, „anderen“, „tauschen“ (der Knopf „vertauscht gehen“ und das
// Wort „vertauscht“ sind erlaubt) – und ueberhaupt keine Regel als Satz:
// Welche Zahl in welche Richtung zaehlt, zeigt nur die Figur, kein Wort.
// Keine Namen, keine Wertung, keine Zeitmessung. Deterministisch, ohne Zufall: jede
// Zahl im Bild und in der Anzeige kommt aus _m5oPUNKTE und _m5oBeine().
// ════════════════════════════════════════════════════════════════════════
let _m5o = null;
const _m5oPUNKTE = {
  a: { name: 'A', x: 3, y: 5 },
  b: { name: 'B', x: 5, y: 3 },
  c: { name: 'C', x: 0, y: 4 },
  d: { name: 'D', x: 6, y: 0 }
};
const _m5oREIHE = ['a', 'b', 'c', 'd'];
const _m5oDINGE = [
  { x: 3, y: 5, art: 'baum', wort: 'Baum' },
  { x: 5, y: 3, art: 'haus', wort: 'Haus' },
  { x: 0, y: 4, art: 'brunnen', wort: 'Brunnen' },
  { x: 6, y: 0, art: 'boot', wort: 'Boot' }
];
const _m5oK = {
  OX: 30, OY: 214, KA: 30,      // Ursprung (px) und Kaestchenbreite (px); OX 30 (vorher 52):
                                // so hat „x“ hinter der Pfeilspitze noch Platz auf der Karte
  NX: 8, NY: 6,                 // waagerecht 0 bis 8, senkrecht 0 bis 6
  TX: 316, TW: 96,              // Tafel rechts: linke Kante, Breite
  T_ZURUECK: 0.25,              // s: Figur verschwindet und taucht beim Start auf
  T_START: 0.1,                 // s: kurzer Halt beim Start
  T_SCHRITT: 0.18,              // s: ein Kaestchen
  T_PAUSE: 0.12,                // s: Halt an der Ecke
  T_POP: 0.35,                  // s: das Ding hopst bei der Ankunft
  T_GLANZ: 2.2,                 // s: das Ding leuchtet nach
  T_AHA: 3.2,                   // s: das Haus leuchtet nach (Aha)
  HOPS: 6,                      // px: Hoehe eines Huepfers
  HUB_X: 15, HUB_Y: 24,         // px: so weit springt das gefundene Ding (Mitte des Kaestchens)
  F_EINS: '#1d4ed8',            // blau: erste Zahl, erstes Wegstueck
  F_ZWEI: '#c2410c',            // orange: zweite Zahl, zweites Wegstueck
  F_FIGUR: '#7c3aed', F_FRAND: '#4c1d95',
  F_PAPIER: '#f8eed6', F_KARTE: '#fbf4e2', F_KRAND: '#c9ad78',
  F_GITTER: '#e2cc9c', F_ACHSE: '#4a3726', F_ZAHL: '#3b2a1c',
  F_WORT: '#5b4636', F_LEISE: '#7a6650'
};

// Gitterpunkt -> Bildpunkt
function _m5oPx(gx, gy) {
  const K = _m5oK;
  return { x: K.OX + gx * K.KA, y: K.OY - gy * K.KA };
}
function _m5oDingBei(gx, gy) {
  return _m5oDINGE.find(d => d.x === gx && d.y === gy) || null;
}
// Die zwei Wegstuecke eines Punkts. Normal: erst die erste Zahl waagerecht,
// dann die zweite senkrecht. Vertauscht: erst die erste Zahl senkrecht, dann
// die zweite waagerecht. Bild, Tafel und Statuszeilen lesen nur hier.
function _m5oBeine(k, modus) {
  const P = _m5oPUNKTE[k];
  return modus === 'vertauscht'
    ? [{ dx: 0, dy: 1, n: P.x }, { dx: 1, dy: 0, n: P.y }]
    : [{ dx: 1, dy: 0, n: P.x }, { dx: 0, dy: 1, n: P.y }];
}
function _m5oSchritte(n) { return n + (n === 1 ? ' Schritt' : ' Schritte'); }

function _m5oInit() {
  _m5o = { wahl: null, modus: 'normal', phase: 'ruhe', pt: 0,
           pos: { x: 0, y: 0 },          // Gitterpunkt, den die Figur zuletzt erreicht hat
           beine: [], bein: 0, schritt: 0, gezaehlt: [0, 0],
           alt: null,                    // alte Spur und alter Ort beim Zuruecksetzen
           bitte: false, wackel: 0, pop: 0, glanz: 0, zeit: 0, fx: { teile: [] } };
}
function _m5oHTML() {
  const marke = k => {
    const P = _m5oPUNKTE[k];
    return `<button class="sim-btn" id="_m5o-b-${k}" onclick="_m5oPunkt('${k}')">${P.name}(${P.x}|${P.y})</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wo liegt der Punkt?</h3>
    <div class="fpm-note" style="margin-top:2px">Die Figur startet bei (0|0) und geht Kästchen für Kästchen. Neben jedem Wegstück steht, wie viele Schritte sie gegangen ist.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5o-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5oREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m5o-vt" onclick="_m5oVertauscht()">vertauscht gehen</button>
          <button class="sim-btn" onclick="_m5oNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5o-punkt" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5o-weg" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5o-ziel" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">„vertauscht gehen“ geht den gewählten Punkt noch einmal, mit vertauschten Wegstücken.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Die Figur steht bei (0|0), noch kein Punkt gewählt</p>
  </div>`;
}
function _m5oZeile(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}
function _m5oStatus() {
  if (!_m5o) return;
  const z = _m5o, K = _m5oK;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const P = z.wahl ? _m5oPUNKTE[z.wahl] : null;
  _m5oZeile('_m5o-punkt', 'Gewählter Punkt: ' + (P
    ? P.name + '(' + f(P.x, K.F_EINS) + '|' + f(P.y, K.F_ZWEI) + ')'
    : 'noch keiner'));
  _m5oZeile('_m5o-weg', P
    ? 'Weg: erst ' + f(_m5oSchritte(P.x), K.F_EINS) + ', dann ' + f(_m5oSchritte(P.y), K.F_ZWEI)
    : 'Weg: noch kein Punkt gewählt');
  let ziel;
  if (z.phase === 'da') {
    const d = _m5oDingBei(z.pos.x, z.pos.y);
    ziel = 'Die Figur steht ' + (d ? 'beim ' + d.wort : 'an einer leeren Stelle') + '.';
    if (z.modus === 'vertauscht') ziel = 'Vertauscht gegangen: ' + ziel;
  } else if (z.phase !== 'ruhe') ziel = 'Die Figur ist unterwegs …';
  else if (z.bitte) ziel = 'Zuerst einen Punkt wählen: A, B, C oder D.';
  else ziel = 'Die Figur steht am Start (0|0).';
  _m5oZeile('_m5o-ziel', ziel);
  for (const k of _m5oREIHE) {
    const b = document.getElementById('_m5o-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.wahl);
  }
  const vt = document.getElementById('_m5o-vt');
  if (vt && vt.classList) vt.classList.toggle('primary', z.modus === 'vertauscht' && !!z.wahl);
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Wo die Figur gerade gezeichnet wird (Bildpunkt), wie gross (sk) und wie
// hoch sie huepft.
function _m5oFigurOrt() {
  const z = _m5o, K = _m5oK;
  if (z.phase === 'zurueck') {
    const h = K.T_ZURUECK / 2;
    if (z.pt < h && z.alt) return { p: z.alt.fig, sk: 1 - _bioFxEase.sanft(z.pt / h), hops: 0 };
    return { p: _m5oPx(0, 0), sk: Math.max(0.02, _bioFxEase.federn(Math.min(1, (z.pt - h) / h))), hops: 0 };
  }
  if (z.phase === 'gehen') {
    const b = z.beine[z.bein], u = Math.min(1, z.pt / K.T_SCHRITT), e = _bioFxEase.sanft(u);
    const a = _m5oPx(z.pos.x, z.pos.y), c = _m5oPx(z.pos.x + b.dx, z.pos.y + b.dy);
    return { p: { x: a.x + (c.x - a.x) * e, y: a.y + (c.y - a.y) * e }, sk: 1,
             hops: Math.sin(Math.PI * u) * K.HOPS };
  }
  return { p: _m5oPx(z.pos.x, z.pos.y), sk: 1, hops: 0 };
}
// Der Teil eines Schritts, der gerade gegangen wird (fuer die Spur).
function _m5oTeil() {
  const z = _m5o;
  if (z.phase !== 'gehen') return null;
  return { bein: z.bein, u: _bioFxEase.sanft(Math.min(1, z.pt / _m5oK.T_SCHRITT)) };
}
// Einen neuen Weg beginnen. Steht die Figur nicht ruhig beim Start, geht sie
// zuerst dorthin zurueck; ein schon laufendes Zuruecksetzen laeuft weiter.
function _m5oLos(k, modus) {
  const z = _m5o;
  const ruhigAmStart = (z.phase === 'ruhe' || z.phase === 'start') && z.pos.x === 0 && z.pos.y === 0;
  if (z.phase !== 'zurueck') {
    if (ruhigAmStart) { z.phase = 'start'; z.pt = 0; z.alt = null; }
    else {
      z.alt = { fig: _m5oFigurOrt().p, pos: { x: z.pos.x, y: z.pos.y },
                beine: z.beine, gezaehlt: z.gezaehlt.slice(), teil: _m5oTeil() };
      z.phase = 'zurueck'; z.pt = 0;
    }
  }
  if (z.phase === 'zurueck' && z.pt >= _m5oK.T_ZURUECK / 2) z.pos = { x: 0, y: 0 };
  z.wahl = k; z.modus = modus; z.bitte = false;
  z.beine = k ? _m5oBeine(k, modus) : [];
  z.bein = 0; z.schritt = 0; z.gezaehlt = [0, 0];
  z.pop = 0; z.glanz = 0;
  _m5oStatus();
}
function _m5oPunkt(k) {
  if (!_m5o || !_m5oPUNKTE[k]) return;
  _m5oLos(k, 'normal');
}
function _m5oVertauscht() {
  if (!_m5o) return;
  const z = _m5o;
  if (!z.wahl) {                          // ohne Punkt: die Figur wackelt nur
    z.bitte = true; z.wackel = 0.45;
    _m5oStatus();
    return;
  }
  _m5oLos(z.wahl, 'vertauscht');
}
function _m5oNeu() {
  if (!_m5o) return;
  const z = _m5o;
  _m5oLos(null, 'normal');
  if (z.phase === 'start') z.phase = 'ruhe';
  _m5oStatus();
}
// Das naechste Wegstueck mit mindestens einem Schritt beginnen – oder ankommen.
function _m5oNaechstesBein(ab) {
  const z = _m5o;
  for (let b = ab; b < 2; b++) {
    if (z.beine[b].n > 0) { z.phase = 'gehen'; z.bein = b; z.schritt = 0; z.pt = 0; return; }
  }
  _m5oAngekommen();
}
function _m5oAngekommen() {
  const z = _m5o, K = _m5oK;
  z.phase = 'da'; z.pt = 0;
  z.pop = K.T_POP; z.glanz = K.T_GLANZ;
  const d = _m5oDingBei(z.pos.x, z.pos.y);
  // Aha: Punkt A vertauscht gegangen – die Figur steht beim Haus.
  if (z.modus === 'vertauscht' && z.wahl === 'a' && d && d.art === 'haus') {
    const p = _m5oDingMitte(d, 1, 0);
    _bioFxWelle(z.fx.teile, p.x, p.y, '#f59e0b', 46);
    z.glanz = K.T_AHA;
  }
  _m5oStatus();
}

// ── Bewegung ────────────────────────────────────────────────────────────
// Die Zeit wird uebertragen: Was von einem Abschnitt uebrig bleibt, geht in
// den naechsten. So dauert ein Weg genau so lange, wie die Konstanten sagen.
function _m5oUpdate(dt) {
  if (!_m5o) return;
  dt = _bioFxDt(dt);
  const z = _m5o, K = _m5oK;
  z.zeit += dt;
  let rest = dt, n = 0, neu = false;
  while (rest > 1e-9 && n++ < 40) {
    if (z.phase === 'zurueck') {
      const h = K.T_ZURUECK / 2;
      if (z.pt < h && z.pt + rest >= h) z.pos = { x: 0, y: 0 };   // Figur ist beim Start
      const bis = K.T_ZURUECK - z.pt;
      if (rest < bis) { z.pt += rest; rest = 0; break; }
      rest -= bis; z.alt = null; z.pos = { x: 0, y: 0 }; z.pt = 0;
      if (z.wahl) z.phase = 'start';
      else { z.phase = 'ruhe'; neu = true; }
    } else if (z.phase === 'start') {
      const bis = K.T_START - z.pt;
      if (rest < bis) { z.pt += rest; rest = 0; break; }
      rest -= bis;
      _m5oNaechstesBein(0);
    } else if (z.phase === 'gehen') {
      const bis = K.T_SCHRITT - z.pt;
      if (rest < bis) { z.pt += rest; rest = 0; break; }
      rest -= bis;
      const b = z.beine[z.bein];
      z.pos = { x: z.pos.x + b.dx, y: z.pos.y + b.dy };
      z.gezaehlt[z.bein] += 1; z.schritt += 1; z.pt = 0;
      if (z.schritt >= b.n) {
        if (z.bein === 0 && z.beine[1].n > 0) { z.phase = 'pause'; z.pt = 0; }
        else _m5oAngekommen();
      }
    } else if (z.phase === 'pause') {
      const bis = K.T_PAUSE - z.pt;
      if (rest < bis) { z.pt += rest; rest = 0; break; }
      rest -= bis;
      _m5oNaechstesBein(1);
    } else break;                            // ruhe, da: nichts laeuft
  }
  z.pop = Math.max(0, z.pop - dt);
  z.glanz = Math.max(0, z.glanz - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  _bioFxUpdate(z.fx.teile, dt);
  if (neu) _m5oStatus();
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5oText(ctx, s, x, y, ausr, farbe, groesse, gew) {
  ctx.fillStyle = farbe || _m5oK.F_ZAHL;
  ctx.font = (gew || '700') + ' ' + (groesse || 13) + 'px sans-serif';
  ctx.textAlign = ausr || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Text mit hellem Rand: Linien laufen dahinter durch, das Wort bleibt lesbar.
function _m5oWort(ctx, s, x, y, farbe, groesse) {
  ctx.save();
  ctx.font = '700 ' + (groesse || 12) + 'px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round'; ctx.strokeStyle = _m5oK.F_KARTE; ctx.lineWidth = 4;
  ctx.strokeText(s, x, y);
  ctx.fillStyle = farbe; ctx.fillText(s, x, y);
  ctx.restore();
}
// Ein Zahlenpaar wie „A(3|5)“ mittig um cx: erste Zahl blau, zweite orange.
// Jedes Zeichen steht mittig in einem festen Platz (Breite je Zeichenart) –
// so haengt die Zeile nicht an measureText und wird nirgends zerrissen.
function _m5oPaar(ctx, name, a, b, cx, y, g) {
  const K = _m5oK;
  const teile = [];
  if (name) teile.push([name, K.F_ZAHL, 0.72]);
  teile.push(['(', K.F_ZAHL, 0.38], [String(a), K.F_EINS, 0.62], ['|', K.F_ZAHL, 0.34],
             [String(b), K.F_ZWEI, 0.62], [')', K.F_ZAHL, 0.38]);
  let x = cx - teile.reduce((s, t) => s + t[2] * g, 0) / 2;
  ctx.save();
  ctx.font = '700 ' + g + 'px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  for (const t of teile) {
    ctx.fillStyle = t[1];
    ctx.fillText(t[0], x + t[2] * g / 2, y);
    x += t[2] * g;
  }
  ctx.restore();
}
function _m5oKarte(ctx) {
  const K = _m5oK;
  ctx.save();
  ctx.fillStyle = 'rgba(90,60,20,0.10)';                     // Schatten
  _bioFxRundRect(ctx, 8, 9, 300, 236, 10); ctx.fill();
  ctx.fillStyle = K.F_KARTE;
  _bioFxRundRect(ctx, 6, 6, 300, 236, 10); ctx.fill();
  ctx.strokeStyle = K.F_KRAND; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, 6, 6, 300, 236, 10); ctx.stroke();
  // Kaestchen
  ctx.strokeStyle = K.F_GITTER; ctx.lineWidth = 1;
  const o = _m5oPx(0, 0), e = _m5oPx(K.NX, K.NY);
  for (let i = 0; i <= K.NX; i++) {
    const x = o.x + i * K.KA;
    ctx.beginPath(); ctx.moveTo(x, e.y - 8); ctx.lineTo(x, o.y); ctx.stroke();
  }
  for (let j = 0; j <= K.NY; j++) {
    const y = o.y - j * K.KA;
    ctx.beginPath(); ctx.moveTo(o.x, y); ctx.lineTo(e.x + 8, y); ctx.stroke();
  }
  // Achsen mit Pfeil
  ctx.strokeStyle = K.F_ACHSE; ctx.fillStyle = K.F_ACHSE; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(e.x + 12, o.y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x, e.y - 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(e.x + 20, o.y); ctx.lineTo(e.x + 10, o.y - 5.5); ctx.lineTo(e.x + 10, o.y + 5.5); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(o.x, e.y - 20); ctx.lineTo(o.x - 5.5, e.y - 10); ctx.lineTo(o.x + 5.5, e.y - 10); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Zahlen an den Achsen und die Buchstaben x und y – zuletzt gezeichnet, mit
// hellem Rand, damit kein Leuchten und kein Kreis sie verdeckt. „x“ steht
// hinter der Pfeilspitze der waagerechten Achse, „y“ neben der Pfeilspitze
// der senkrechten (wie build_pilot.b_koordinatengitter im Heft).
function _m5oAchsenZahlen(ctx) {
  const K = _m5oK, o = _m5oPx(0, 0);
  ctx.save();
  ctx.font = '700 13px sans-serif'; ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round'; ctx.strokeStyle = K.F_KARTE; ctx.lineWidth = 4;
  ctx.fillStyle = K.F_ZAHL;
  const z = (s, x, y, a) => { ctx.textAlign = a; ctx.strokeText(s, x, y); ctx.fillText(s, x, y); };
  for (let i = 0; i <= K.NX; i++) z(String(i), o.x + i * K.KA, o.y + 18, 'center');
  for (let j = 1; j <= K.NY; j++) z(String(j), o.x - 10, o.y - j * K.KA + 4.5, 'right');
  const e = _m5oPx(K.NX, K.NY);                 // Pfeilspitzen bei (e.x + 20 | o.y) und (o.x | e.y - 20)
  ctx.font = '700 14px sans-serif'; ctx.fillStyle = K.F_ACHSE;
  z('x', e.x + 23, o.y + 4, 'left');
  z('y', o.x + 10, e.y - 16, 'left');
  ctx.restore();
}
// Wo das Bild eines Dings sitzt: mit dem Fuss genau auf seinem Gitterpunkt,
// darauf ein dunkler Ortspunkt (_m5oOrtspunkt). Ist die Figur dort
// angekommen, springt das Bild schraeg in das Kaestchen darueber (u = 0 auf
// dem Punkt, 1 ganz gesprungen) – so verdeckt die Figur es nie, man sieht:
// gefunden. Es landet MITTEN im Kaestchen, nie auf einem anderen Gitterpunkt.
function _m5oDingFuss(d, u, wipp) {
  const p = _m5oPx(d.x, d.y), K = _m5oK;
  return { x: p.x + K.HUB_X * (u || 0), y: p.y - K.HUB_Y * (u || 0) - (wipp || 0) };
}
function _m5oDingMitte(d, u, wipp) {
  const f = _m5oDingFuss(d, u, wipp);
  return { x: f.x, y: f.y - 13 };
}
// Wie weit das Bild des Ziels gerade gesprungen ist (0 = auf seinem Punkt).
function _m5oHub(d) {
  const z = _m5o, K = _m5oK;
  if (z.phase !== 'da' || !d || d.x !== z.pos.x || d.y !== z.pos.y) return 0;
  return _bioFxEase.federn(Math.min(1, 1 - z.pop / K.T_POP));
}
function _m5oOrtspunkt(ctx, d) {
  const p = _m5oPx(d.x, d.y);
  ctx.save();
  ctx.fillStyle = _m5oK.F_ACHSE; ctx.strokeStyle = _m5oK.F_KARTE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Ein gezeichnetes Ding, Fuss bei _m5oDingFuss; sk = Groesse beim Hopsen.
function _m5oDing(ctx, d, sk, u, wipp) {
  const p = _m5oDingFuss(d, u, wipp);
  ctx.save();
  ctx.translate(p.x, p.y); ctx.scale(sk, sk);
  ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
  if (d.art === 'baum') {
    ctx.fillStyle = '#7c4a1e';
    ctx.fillRect(-2.5, -11, 5, 11);
    ctx.fillStyle = '#22a046'; ctx.strokeStyle = '#166534';
    for (const c of [[-6, -15, 6.5], [6, -15, 6.5], [0, -20, 9]]) {
      ctx.beginPath(); ctx.arc(c[0], c[1], c[2], 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  } else if (d.art === 'haus') {
    ctx.fillStyle = '#fde4b8'; ctx.strokeStyle = '#7c2d12';
    ctx.fillRect(-9, -13, 18, 13); ctx.strokeRect(-9, -13, 18, 13);
    ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#7f1d1d';
    ctx.beginPath(); ctx.moveTo(-11.5, -12); ctx.lineTo(0, -24); ctx.lineTo(11.5, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#92400e'; ctx.fillRect(-2.5, -7, 5, 7);
  } else if (d.art === 'brunnen') {
    ctx.strokeStyle = '#6b3f1d'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-6.5, -8); ctx.lineTo(-6.5, -17); ctx.moveTo(6.5, -8); ctx.lineTo(6.5, -17); ctx.stroke();
    ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-10, -16); ctx.lineTo(0, -23); ctx.lineTo(10, -16); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#475569';
    ctx.fillRect(-8, -9, 16, 9); ctx.strokeRect(-8, -9, 16, 9);
    ctx.beginPath(); ctx.moveTo(-8, -4.5); ctx.lineTo(8, -4.5); ctx.stroke();
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath(); ctx.ellipse(0, -9, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
  } else if (d.art === 'boot') {
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, -28); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#64748b';
    ctx.beginPath(); ctx.moveTo(1.5, -27); ctx.lineTo(1.5, -10); ctx.lineTo(12, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#451a03';
    ctx.beginPath(); ctx.moveTo(-12, -8); ctx.lineTo(12, -8); ctx.lineTo(8, 0); ctx.lineTo(-8, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
// Schild mit der Zahl der Schritte eines Wegstuecks.
function _m5oSchild(ctx, text, x, y, farbe) {
  ctx.save();
  ctx.font = '700 14px sans-serif';
  const w = Math.max(22, ctx.measureText(text).width + 12), h = 20;
  ctx.fillStyle = farbe;
  _bioFxRundRect(ctx, x - w / 2, y - h / 2, w, h, 7); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, x - w / 2, y - h / 2, w, h, 7); ctx.stroke();
  _m5oText(ctx, text, x, y + 5, 'center', '#ffffff', 14);
  ctx.restore();
}
// Die Spur eines Wegs: je Wegstueck eine Linie in seiner Farbe, Punkte an den
// erreichten Gitterpunkten, Pfeilspitze am fertigen Wegstueck. teil = der
// Schritt, der gerade gegangen wird ({bein, u}) oder null.
function _m5oSpur(ctx, beine, gezaehlt, teil, alpha, mitSchild) {
  const K = _m5oK;
  if (!beine || !beine.length || alpha <= 0.01) return;
  const farben = [K.F_EINS, K.F_ZWEI];
  const schilder = [];
  let sx = 0, sy = 0;
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let b = 0; b < 2; b++) {
    const bn = beine[b];
    const len = gezaehlt[b] + (teil && teil.bein === b ? teil.u : 0);
    if (len > 0.001) {
      const a = _m5oPx(sx, sy), c = _m5oPx(sx + bn.dx * len, sy + bn.dy * len);
      ctx.strokeStyle = farben[b]; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
      ctx.fillStyle = farben[b];
      for (let s = 1; s <= gezaehlt[b]; s++) {
        const q = _m5oPx(sx + bn.dx * s, sy + bn.dy * s);
        ctx.beginPath(); ctx.arc(q.x, q.y, 4.5, 0, Math.PI * 2); ctx.fill();
      }
      if (gezaehlt[b] >= bn.n) {                            // Pfeilspitze am Ende
        const ux = bn.dx, uy = -bn.dy;
        ctx.beginPath();
        ctx.moveTo(c.x + ux * 9, c.y + uy * 9);
        ctx.lineTo(c.x - ux * 3 + uy * 7, c.y - uy * 3 - ux * 7);
        ctx.lineTo(c.x - ux * 3 - uy * 7, c.y - uy * 3 + ux * 7);
        ctx.closePath(); ctx.fill();
      }
      if (gezaehlt[b] >= 1) {
        const m = _m5oPx(sx + bn.dx * len / 2, sy + bn.dy * len / 2);
        schilder.push([String(gezaehlt[b]), bn.dy ? m.x + 17 : m.x, bn.dy ? m.y : m.y - 15, farben[b]]);
      }
    }
    sx += bn.dx * bn.n; sy += bn.dy * bn.n;
  }
  ctx.restore();
  return schilder;
}
// Gestrichelt: der Weg zum gewaehlten Punkt (beim vertauschten Gehen, zum Vergleich).
function _m5oGeist(ctx, k) {
  const P = _m5oPUNKTE[k], a = _m5oPx(0, 0), b = _m5oPx(P.x, 0), c = _m5oPx(P.x, P.y);
  ctx.save();
  ctx.strokeStyle = 'rgba(71,85,105,0.55)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
function _m5oFigur(ctx, p, sk, hops) {
  const K = _m5oK;
  if (sk <= 0.02) return;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.fillStyle = 'rgba(40,25,10,0.25)';                    // Schatten am Boden
  ctx.beginPath(); ctx.ellipse(0, 0, 9 * sk, 3.2 * sk, 0, 0, Math.PI * 2); ctx.fill();
  ctx.translate(0, -hops); ctx.scale(sk, sk);
  ctx.fillStyle = K.F_FIGUR; ctx.strokeStyle = K.F_FRAND; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-8, -1.5); ctx.quadraticCurveTo(-3, -9, -3.5, -16);
  ctx.lineTo(3.5, -16); ctx.quadraticCurveTo(3, -9, 8, -1.5); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, -1.5, 8.5, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -21, 6.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.arc(-2.2, -23.2, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// Rechts: gewaehlter Punkt, Ort der Figur, Farberklaerung.
function _m5oTafel(ctx) {
  const z = _m5o, K = _m5oK, x0 = K.TX, cx = K.TX + K.TW / 2;
  ctx.save();
  ctx.fillStyle = '#fffdf7';
  _bioFxRundRect(ctx, x0, 6, K.TW, 236, 10); ctx.fill();
  ctx.strokeStyle = K.F_KRAND; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, x0, 6, K.TW, 236, 10); ctx.stroke();
  _m5oText(ctx, 'Punkt', cx, 32, 'center', K.F_LEISE, 12);
  const P = z.wahl ? _m5oPUNKTE[z.wahl] : null;
  if (P) _m5oPaar(ctx, P.name, P.x, P.y, cx, 60, 23);
  else _m5oText(ctx, '–', cx, 60, 'center', K.F_LEISE, 23);
  if (P && z.modus === 'vertauscht') _m5oText(ctx, 'vertauscht', cx, 81, 'center', '#9a3412', 12);
  ctx.strokeStyle = '#e7d9b8'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x0 + 12, 95); ctx.lineTo(x0 + K.TW - 12, 95); ctx.stroke();
  // Figur: kleines Zeichen und ihr Ort, Schritt fuer Schritt
  _m5oFigur(ctx, { x: x0 + 22, y: 126 }, 0.62, 0);
  _m5oText(ctx, 'Figur', x0 + 34, 123, 'left', K.F_LEISE, 12);
  let ort = z.pos;
  if (z.phase === 'zurueck' && z.alt && z.pt < K.T_ZURUECK / 2) ort = z.alt.pos;
  _m5oPaar(ctx, '', ort.x, ort.y, cx, 156, 23);
  ctx.beginPath(); ctx.moveTo(x0 + 12, 175); ctx.lineTo(x0 + K.TW - 12, 175); ctx.stroke();
  // Farberklaerung
  const zeile = (y, farbe, wort) => {
    ctx.fillStyle = farbe;
    _bioFxRundRect(ctx, x0 + 10, y - 10, 12, 12, 3); ctx.fill();
    _m5oText(ctx, wort, x0 + 27, y, 'left', farbe, 12);
  };
  zeile(200, K.F_EINS, 'erste Zahl');
  zeile(222, K.F_ZWEI, 'zweite Zahl');
  ctx.restore();
}
function _m5oDraw(ctx, cv) {
  if (!_m5o) return;
  const W = cv.width, H = cv.height, z = _m5o, K = _m5oK;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = K.F_PAPIER; ctx.fillRect(0, 0, W, H);
  _m5oKarte(ctx);
  // Beim vertauschten Gehen: der Weg zum gewaehlten Punkt, blass gestrichelt
  if (z.wahl && z.modus === 'vertauscht') _m5oGeist(ctx, z.wahl);
  // Spuren: die alte verblasst beim Zuruecksetzen, die neue waechst
  let schilder = [];
  if (z.phase === 'zurueck' && z.alt) {
    const a = 1 - Math.min(1, z.pt / K.T_ZURUECK);
    schilder = schilder.concat((_m5oSpur(ctx, z.alt.beine, z.alt.gezaehlt, z.alt.teil, a) || [])
      .map(s => s.concat([a])));
  } else {
    schilder = (_m5oSpur(ctx, z.beine, z.gezaehlt, _m5oTeil(), 1) || []).map(s => s.concat([1]));
  }
  // Die Dinge auf ihren Punkten, jedes mit Ortspunkt und Wort; das Ziel kommt
  // erst nach der Figur dran (es hebt sich ueber ihren Kopf).
  const ziel = z.phase === 'da' ? _m5oDingBei(z.pos.x, z.pos.y) : null;
  for (const d of _m5oDINGE) {
    if (d === ziel) { _m5oOrtspunkt(ctx, d); continue; }
    _m5oDing(ctx, d, 1, 0, 0);
    _m5oOrtspunkt(ctx, d);
  }
  // leere Stelle: gestrichelter grauer Ring am Boden um den Gitterpunkt
  if (z.phase === 'da' && !ziel) {
    const p = _m5oPx(z.pos.x, z.pos.y);
    ctx.save();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.ellipse(p.x, p.y, 17, 7, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  // die Figur (in Ruhe wippt sie leicht); das gefundene Ding hebt sich ueber
  // ihren Kopf, hopst und leuchtet – Leuchten und Aha-Ring liegen HINTER
  // Figur und Ding, damit beide ganz zu sehen sind.
  const f = _m5oFigurOrt();
  const wx = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0;
  const ruhig = z.phase === 'ruhe' || z.phase === 'da';
  const wipp = ruhig ? 1.2 * (1 + Math.sin(z.zeit * Math.PI * 2 * 0.6)) : 0;
  const u = ziel ? _m5oHub(ziel) : 0;
  if (ziel && z.glanz > 0) {
    const m = _m5oDingMitte(ziel, u, wipp);
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.glanz / 0.6);
    _bioFxLeuchten(ctx, m.x, m.y, 15, z.zeit, '245,158,11');
    ctx.restore();
  }
  _bioFxDraw(ctx, z.fx.teile);
  _m5oFigur(ctx, { x: f.p.x + wx, y: f.p.y }, f.sk, f.hops + wipp);
  if (ziel) {
    const sk = z.pop > 0 ? 1 + 0.2 * Math.sin(Math.PI * (1 - z.pop / K.T_POP)) : 1;
    _m5oDing(ctx, ziel, sk, u, wipp);
  }
  // Woerter neben den Punkten – sie bleiben stehen, auch wenn das Ding springt
  for (const d of _m5oDINGE) {
    const p = _m5oPx(d.x, d.y);
    _m5oWort(ctx, d.wort, p.x + 15, p.y - 9, K.F_WORT, 12);
  }
  _m5oAchsenZahlen(ctx);
  // Schrittzaehler-Schilder zuletzt, damit die Figur sie nie verdeckt
  for (const s of schilder) {
    ctx.save(); ctx.globalAlpha = s[4];
    _m5oSchild(ctx, s[0], s[1], s[2], s[3]);
    ctx.restore();
  }
  _m5oTafel(ctx);
}
