
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mu4 „Wie groß ist das Rechteck?“ (Kennung m5-rechteck, Praefix _m6o)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL7_PROFIL.md, Abschnitte mu4 und m5-rechteck,
// dazu einheiten/mu4.json (seite.sim_plan).
// Ueberschrift = Frage der Einheit: „Wie viele cm² hat das Foto?“
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   - Ein Zentimeterraster (weisses Blatt, hellblaue Linien), 7 cm breit und
//     6 cm hoch, jedes Rasterquadrat 1 cm x 1 cm (28 px). Das Rechteck steht
//     immer mit seiner Ecke unten links auf der Ecke des Blatts – dort liegt
//     die 0 BEIDER Lineale.
//   - Unten und links ein gelbes Lineal in cm (Striche je halben cm, Zahlen je
//     cm, am Ende „cm“). Waehrend die beiden ersten Seiten gezeichnet werden,
//     waechst auf dem Lineal ein Streifen mit: unten blau bis zur rechten
//     Ecke (5 cm), links orange bis zur oberen Ecke (3 cm).
//   - Das Rechteck ist dunkelblau umrandet. Unten unter dem Lineal steht in
//     Blau „5 cm“, links neben dem Lineal in Orange „3 cm“.
//   - Die cm²-Quadrate sind blau (hell); die gerade gelegte Reihe ist dunkler.
//     Die ERSTE Reihe bleibt dunkel – sie ist die Reihe, die kopiert wird.
//     Links neben jeder fertigen Reihe springt ihre Nummer auf (1, 2, 3 …)
//     in einem orangen Kreis.
//   - Oben rechts die Legende ohne Satz: ein Quadrat in einem Rasterfeld,
//     daneben „1 cm²“.
//   - Am Ende gleitet rechts unten eine Karte „Rechnung“ herein:
//     „3 · 5 cm²“ / „= 15 cm²“.
//   Bild und Zeichen verbunden (MATHE_PROFIL § 10.2): Orange ist die Farbe
//   der Reihen (Reihennummern, Streifen links, „3 cm“ links, die 3 in der
//   Rechnung und im Zaehler „Reihen übereinander“), Blau die Farbe einer Reihe
//   (erste Reihe, Streifen unten, „5 cm“ unten, „5 cm²“ in der Rechnung und
//   der Zaehler „Quadrate in einer Reihe“). Die Regel steht nirgends als Satz.
//
// BEWEGUNG (jede Sprungmarke spielt SELBST ab, N1 im Bauplan: ein Schritt im
// Heft = eine Handlung; anhalten kann die Lehrkraft):
//   0 bis 0,5 s: das Rechteck zeichnet sich – erst die Seite unten und die
//     Seite links zugleich aus der Ecke heraus (0,25 s, die Streifen auf den
//     Linealen wachsen mit, danach springen „5 cm“ und „3 cm“ auf), dann die
//     Seite rechts und die Seite oben (0,25 s).
//   Erste Reihe: Quadrat fuer Quadrat entlang der unteren Seite (0,25 s je
//     Quadrat, jedes faellt von oben auf seinen Platz). Der Zaehler
//     „Quadrate in einer Reihe“ zaehlt jedes Quadrat, das liegt. Liegt die
//     Reihe, springt ihre Nummer 1 auf, „Reihen übereinander: 1“.
//   Ruhe 0,3 s.
//   Dann wird die ganze Reihe kopiert: die Kopie hebt sich von der obersten
//     Reihe ab (dunkel, mit Schatten) und gleitet eine Reihe hoeher (0,6 s je
//     Reihe). Liegt sie, wird sie hell, ihre Nummer springt auf, der Zaehler
//     „Reihen übereinander“ zaehlt mit. Die naechste Kopie startet sofort.
//   Ende: Statuszeilen „Rechnung“ und „Flächeninhalt“ erscheinen, die Karte
//     gleitet herein (0,4 s), die farbigen Zahlen darauf leuchten 1,6 s.
//   Dauer ab Knopfdruck: 4 x 2 2,4 s · 5 x 3 3,25 s · 6 x 3 3,5 s · 3 x 5 3,95 s.
// Alles ist eine Funktion der Ablaufzeit z.at (_m6oZeiten, _m6oStand): keine
// Zufallszahl; jede Zahl im Bild kommt aus derselben Rechnung wie die
// Statuszeilen.
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6oWahl('…'), Wahlgruppe):
//     „4 cm lang, 2 cm breit“ · „5 cm lang, 3 cm breit“ · „6 cm lang, 3 cm breit“ ·
//     „3 cm lang, 5 cm breit“ (frei, nicht im Heft: gedreht, 5 Reihen zu je 3 cm²)
//   Reihe 2: „noch einmal“ (_m6oNochmal: das gewaehlte Rechteck neu legen;
//     blass, solange keins gewaehlt ist) · „neu“ (_m6oNeu: leeres Raster)
//   Eine Sprungmarke waehrend des Ablaufs startet das Rechteck neu.
//
// STATUSZEILEN (woertlich aus dem Bauplan, jede mit Wert mehr als 18 Zeichen):
//   _m6o-rechteck  „Rechteck: 5 cm lang, 3 cm breit“ (Start „Rechteck: noch keins gewählt“)
//   _m6o-reihe     „Quadrate in einer Reihe: 5“ (zaehlt hoch, Start 0)
//   _m6o-reihen    „Reihen übereinander: 3“ (zaehlt hoch, Start 0)
//   _m6o-rechnung  am Ende „Rechnung: 3 · 5 cm² = 15 cm²“ (vorher „Rechnung: …“)
//   _m6o-flaeche   am Ende „Flächeninhalt: 15 cm²“ (vorher „Flächeninhalt: …“)
// Rechnung mit Groessen traegt Einheiten (N3, E2): Zahl der Reihen · cm² je
// Reihe = cm² (Anzahl · Groesse = Groesse). Zwischen Zahl und Einheit U+00A0,
// „cm²“ mit U+00B2, Rechenzeichen U+00B7.
//
// WERTE (jede Zeile nachgerechnet mit simcheck/werte.js):
//   4 cm lang, 2 cm breit -> 4 in einer Reihe, 2 Reihen, 2 · 4 cm² = 8 cm²
//   5 cm lang, 3 cm breit -> 5 in einer Reihe, 3 Reihen, 3 · 5 cm² = 15 cm²
//   6 cm lang, 3 cm breit -> 6 in einer Reihe, 3 Reihen, 3 · 6 cm² = 18 cm²
//   3 cm lang, 5 cm breit -> 3 in einer Reihe, 5 Reihen, 5 · 3 cm² = 15 cm²
// START: leeres Zentimeterraster („Start: leeres Zentimeterraster“).
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen): „5 cm lang, 3 cm breit“ – die
// dritte Reihe landet: Lichtring um das ganze Rechteck, der Rand leuchtet
// 2,6 s bernstein nach. Einmal je Ablauf. Das widerlegt „8 cm²“ (5 + 3) und
// „16 cm²“ (Rand).
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen/m5-umfang, Container
// fpm-lehrkraft, den simfakten.js ueberspringt): eigene Knopfzeile UNTER den
// Heftknoepfen, davor klein „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m6oAnhalten): friert jede Bewegung ein (Zeichnen,
//     Legen, Gleiten, Lichtring, Karte); Schild „Pause“ oben links.
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m6oTempo): ein Drittel so schnell.
//   „Halt nach der ersten Reihe: aus“ <-> „… an“ (_m6oHalt): haelt genau in dem
//     Augenblick an, in dem das letzte Quadrat der ersten Reihe liegt – zum
//     Vermuten, wie viele es mit allen Reihen werden. Die Simulation steht dann
//     in der Pause (Knopf „weiter“, Schild „Pause“), die Hinweiszeile sagt
//     „Halt: Die erste Reihe liegt. Dann „weiter“.“ „weiter“ oder der Schalter
//     auf „aus“ legen die Reihen fertig. Einmal je Ablauf; wer den Schalter erst
//     danach einlegt, haelt beim naechsten Ablauf.
//   Eine Sprungmarke, „noch einmal“ oder „neu“ heben die Pause auf; Tempo und
//   Halt bleiben stehen. Das wechselnde Wort steht in einem eigenen <span>.
//   Hinweiszeile _m6o-lehrkraft nennt immer die Einstellung (in der Pause
//   bernsteinfarben). Voreinstellung (Pause aus, Tempo normal, Halt aus):
//   Zeitfaktor 1, Bild gleich wie ohne Lehrkraft-Zeile.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): die Merksatzwoerter fuer
// die beiden Seiten als Nomen („lang“ und „breit“ in den Knoepfen sind
// erlaubt), „… · …“ als Regel mit diesen Woertern, „mal“ als Regel, die Regel
// als Satz. Keine Namen, keine Punkte, keine Zeitmessung, kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m6o = null;
const _m6oRECHTECK = {
  l4b2: { L: 4, B: 2, text: '4 cm lang, 2 cm breit' },
  l5b3: { L: 5, B: 3, text: '5 cm lang, 3 cm breit' },
  l6b3: { L: 6, B: 3, text: '6 cm lang, 3 cm breit' },
  l3b5: { L: 3, B: 5, text: '3 cm lang, 5 cm breit' }
};
const _m6oREIHE = ['l4b2', 'l5b3', 'l6b3', 'l3b5'];
const _m6oK = {
  // Massstab: px je cm; Ecke unten links des Rechtecks (= 0 beider Lineale)
  S: 28, GX0: 90, GY0: 194,
  // Raster: so viele cm breit und hoch
  NX: 7, NY: 6,
  // Lineal unten (Streifen) und Lineal links (Streifen)
  LU_X0: 82, LU_X1: 312, LU_Y0: 197, LU_Y1: 221,
  LL_X0: 48, LL_X1: 72, LL_Y0: 4, LL_Y1: 202,
  // Mitte der Reihennummern, rechter Rand von „3 cm“, Grundlinie von „5 cm“
  NRX: 81, BEX: 44, LAY: 240,
  // Legende (linke obere Ecke ihres Rasterfelds) und Karte „Rechnung“
  LGX: 326, LGY: 30,
  KX0: 318, KX1: 414, KY0: 120, KY1: 194,
  // Zeiten in s
  T_ZEICHNE: 0.5, T_QUAD: 0.25, T_RUH: 0.3, T_REIHE: 0.6, T_HELL: 0.3,
  T_KARTE: 0.4, T_POP: 0.3,
  // Farben
  RAND: '#1e3a8a', REIHE: '#1d4ed8', NUMMER: '#c2410c', AHA: '#f59e0b',
  HELL: '#bfdbfe', HELLRAND: '#60a5fa', DUNKEL: '#60a5fa', DUNKELRAND: '#1d4ed8',
  NETZ: '#cfe0f5', LINEAL: 'rgba(253,230,138,0.94)', LRAND: '#ca8a04', STRICH: '#713f12',
  TINTE: '#0f172a', GRAU: '#64748b'
};
// Leuchtfarbe hinter einer farbigen Zahl (als "r,g,b")
const _m6oGLANZ = { '#1d4ed8': '29,78,216', '#c2410c': '194,65,12' };

// ── Hilfen ───────────────────────────────────────────────────────────────
// Zahl mit Einheit, geschuetztes Leerzeichen dazwischen.
function _m6oCm(x) { return x + ' cm'; }
function _m6oCm2(x) { return x + ' cm²'; }
function _m6oName(R) { return R.text.replace(/(\d) /g, '$1 '); }
function _m6oX(cx) { return _m6oK.GX0 + cx * _m6oK.S; }
function _m6oY(cy) { return _m6oK.GY0 - cy * _m6oK.S; }

// Zeitplan eines Rechtecks (Ablaufzeit in s). Reihe k (0 = erste Reihe) liegt
// zur Zeit landet(k); Kopie k (1 … B−1) gleitet ab start(k) eine Reihe hoeher.
function _m6oZeiten(R) {
  const K = _m6oK, t1 = K.T_ZEICHNE + R.L * K.T_QUAD;
  const start = k => t1 + K.T_RUH + (k - 1) * K.T_REIHE;
  const landet = k => (k === 0 ? t1 : start(k) + K.T_REIHE);
  return { t1, start, landet, ende: landet(R.B - 1) };
}
// Stand zur Ablaufzeit: ist der Rand zu, wie viele Quadrate liegen in der
// ersten Reihe, wie viele Reihen liegen, ist alles fertig?
function _m6oStand(z) {
  const st = { zu: false, quad: 0, reihen: 0, fertig: false };
  const R = z.key ? _m6oRECHTECK[z.key] : null;
  if (!R) return st;
  const K = _m6oK, T = _m6oZeiten(R), at = z.at + 1e-9;
  st.zu = at >= K.T_ZEICHNE;
  for (let j = 0; j < R.L; j++) if (at >= K.T_ZEICHNE + (j + 1) * K.T_QUAD) st.quad++;
  for (let k = 0; k < R.B; k++) if (at >= T.landet(k)) st.reihen++;
  st.fertig = at >= T.ende;
  return st;
}

function _m6oInit() {
  _m6o = { t: 0, at: 0, key: null, fx: { teile: [] },
           pause: false, langsam: false, halt: false };   // Lehrkraft-Einstellungen
  _m6oLaden(null);
}
// Ein Rechteck laden (key = null: leeres Raster). Hebt die Pause auf.
function _m6oLaden(key) {
  const z = _m6o;
  z.key = key; z.at = 0;
  z.stand = _m6oStand(z);
  z.aha = false; z.ahaGlanz = 0;
  z.ende = false; z.karte = 0; z.endGlanz = 0;
  z.gehalten = false; z.haltJetzt = false;
  z.fx.teile.length = 0;
  z.pause = false;
}
function _m6oHTML() {
  const marke = k => `<button class="sim-btn" id="_m6o-b-${k}" onclick="_m6oWahl('${k}')">${_m6oRECHTECK[k].text.replace(/(\d) /g, '$1&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele cm² hat das Foto?</h3>
    <div class="fpm-note" style="margin-top:2px">Jedes Quadrat ist 1&nbsp;cm lang und 1&nbsp;cm breit. Sieh zu, wie die Reihen entstehen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6o-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6oREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6o-nochmal" onclick="_m6oNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m6oNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6o-pause" onclick="_m6oAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6o-tempo" onclick="_m6oTempo()">Tempo: <span id="_m6o-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6o-halt" onclick="_m6oHalt()">Halt nach der ersten Reihe: <span id="_m6o-halt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6o-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6o-rechteck" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6o-reihe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6o-reihen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6o-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6o-flaeche" style="margin-top:6px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: leeres Zentimeterraster</p>
  </div>`;
}
function _m6oSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6oStatus() {
  if (!_m6o) return;
  const z = _m6o, K = _m6oK, R = z.key ? _m6oRECHTECK[z.key] : null, st = z.stand;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  let rech = '…', fl = '…';
  if (R && st.fertig) {
    rech = f(R.B, K.NUMMER) + ' · ' + f(_m6oCm2(R.L), K.REIHE) + ' = ' + f(_m6oCm2(R.L * R.B), K.TINTE);
    fl = f(_m6oCm2(R.L * R.B), K.TINTE);
  }
  _m6oSetze('_m6o-rechteck', 'Rechteck: ' + (R ? _m6oName(R) : 'noch keins gewählt'));
  _m6oSetze('_m6o-reihe', 'Quadrate in einer Reihe: ' + f(st.quad, K.REIHE));
  _m6oSetze('_m6o-reihen', 'Reihen übereinander: ' + f(st.reihen, K.NUMMER));
  _m6oSetze('_m6o-rechnung', 'Rechnung: ' + rech);
  _m6oSetze('_m6o-flaeche', 'Flächeninhalt: ' + fl);
  _m6oREIHE.forEach(k => {
    const b = document.getElementById('_m6o-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  const nm = document.getElementById('_m6o-nochmal');
  if (nm) { nm.disabled = !R; if (nm.style) nm.style.opacity = R ? '' : '0.45'; }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6oSetze('_m6o-pause', z.pause ? 'weiter' : 'Pause');
  _m6oSetze('_m6o-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6oSetze('_m6o-halt-an', z.halt ? 'an' : 'aus');
  const hz = _m6oSetze('_m6o-lehrkraft', _m6oHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6o-pause', z.pause], ['_m6o-halt', z.halt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6oHinweis() {
  const z = _m6o, R = z.key ? _m6oRECHTECK[z.key] : null;
  let a;
  if (z.pause && z.haltJetzt && R) a = 'Halt: Die erste Reihe liegt. Dann „weiter“.';
  else if (z.pause) a = 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  else a = 'Für die Lehrkraft: „Pause“ hält alles an.';
  return a + ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt nach der ersten Reihe: ' + (z.halt ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6oWahl(key) {
  if (!_m6o || !_m6oRECHTECK[key]) return;
  _m6oLaden(key);
  _m6oStatus();
}
function _m6oNochmal() {
  if (!_m6o || !_m6o.key) return;
  _m6oLaden(_m6o.key);
  _m6oStatus();
}
function _m6oNeu() {
  if (!_m6o) return;
  _m6oLaden(null);
  _m6oStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6oAnhalten() {
  if (!_m6o) return;
  _m6o.pause = !_m6o.pause;
  if (!_m6o.pause) _m6o.haltJetzt = false;
  _m6oStatus();
}
function _m6oTempo() {
  if (!_m6o) return;
  _m6o.langsam = !_m6o.langsam;
  _m6oStatus();
}
function _m6oHalt() {
  if (!_m6o) return;
  const z = _m6o;
  z.halt = !z.halt;
  if (!z.halt && z.haltJetzt) { z.pause = false; z.haltJetzt = false; }   // aus: weiterlegen
  _m6oStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6oZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6oUpdate(dt) {
  if (!_m6o) return;
  const z = _m6o, K = _m6oK;
  dt = _bioFxDt(dt) * _m6oZeitfaktor(z);            // ab hier Sim-Zeit
  z.t += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.endGlanz = Math.max(0, z.endGlanz - dt);
  if (z.ende) z.karte = Math.min(1, z.karte + dt / K.T_KARTE);
  const R = z.key ? _m6oRECHTECK[z.key] : null;
  if (R && dt > 0) {                                // ohne Zeit kein Schritt im Ablauf
    const T = _m6oZeiten(R);
    let neuAt = z.at + dt, neu = false;
    // Halt nach der ersten Reihe: genau auf dem Zeitpunkt anhalten, an dem sie liegt
    if (z.halt && !z.gehalten && z.at < T.t1 - 1e-9 && neuAt >= T.t1 - 1e-9) {
      neuAt = T.t1; z.gehalten = true; z.pause = true; z.haltJetzt = true; neu = true;
    }
    z.at = neuAt;
    const st = _m6oStand(z), alt = z.stand;
    if (st.zu !== alt.zu || st.quad !== alt.quad || st.reihen !== alt.reihen ||
        st.fertig !== alt.fertig) neu = true;
    if (z.key === 'l5b3' && !z.aha && st.reihen >= 3) {
      // Aha: die dritte Reihe landet – 15, nicht 8 und nicht 16
      z.aha = true; z.ahaGlanz = 2.6;
      _bioFxWelle(z.fx.teile, _m6oX(R.L / 2), _m6oY(R.B / 2), K.AHA, 96);
    }
    if (st.fertig && !z.ende) { z.ende = true; z.karte = 0; z.endGlanz = 1.6; }
    z.stand = st;
    if (neu) _m6oStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6oText(ctx, s, x, y, groesse, farbe, ausr, gew, grund) {
  ctx.fillStyle = farbe || _m6oK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = grund || 'alphabetic';
  ctx.fillText(s, x, y);
}
// Das Zentimeterraster: weisses Blatt, hellblaue Linien je cm.
function _m6oRaster(ctx) {
  const K = _m6oK, x0 = K.GX0, x1 = _m6oX(K.NX), y0 = _m6oY(K.NY), y1 = K.GY0;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  ctx.fillRect(x0 + 2, y0 + 3, x1 - x0, y1 - y0);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = K.NETZ; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= K.NX; i++) { ctx.moveTo(_m6oX(i), y0); ctx.lineTo(_m6oX(i), y1); }
  for (let j = 0; j <= K.NY; j++) { ctx.moveTo(x0, _m6oY(j)); ctx.lineTo(x1, _m6oY(j)); }
  ctx.stroke();
  ctx.restore();
}
// Die beiden gelben Lineale; a = 0 … 1: so weit sind die Streifen gewachsen.
function _m6oLineale(ctx, R, a) {
  const K = _m6oK, S = K.S;
  ctx.save();
  for (const [x, y, w, h] of [[K.LU_X0, K.LU_Y0, K.LU_X1 - K.LU_X0, K.LU_Y1 - K.LU_Y0],
                              [K.LL_X0, K.LL_Y0, K.LL_X1 - K.LL_X0, K.LL_Y1 - K.LL_Y0]]) {
    ctx.fillStyle = 'rgba(15,23,42,0.14)';
    _bioFxRundRect(ctx, x + 2, y + 2.5, w, h, 3); ctx.fill();
    ctx.fillStyle = K.LINEAL;
    _bioFxRundRect(ctx, x, y, w, h, 3); ctx.fill();
    ctx.strokeStyle = K.LRAND; ctx.lineWidth = 1.2;
    _bioFxRundRect(ctx, x, y, w, h, 3); ctx.stroke();
  }
  // Streifen an der Kante: unten blau bis zur einen Seite, links orange bis zur anderen
  if (R && a > 0) {
    ctx.fillStyle = 'rgba(29,78,216,0.78)';
    ctx.fillRect(K.GX0, K.LU_Y0, a * R.L * S, 5);
    ctx.fillStyle = 'rgba(194,65,12,0.78)';
    ctx.fillRect(K.LL_X1 - 5, K.GY0 - a * R.B * S, 5, a * R.B * S);
  }
  // Striche: ganze cm lang, halbe cm kurz
  ctx.strokeStyle = K.STRICH; ctx.lineWidth = 1.1;
  ctx.beginPath();
  for (let k = 0; k <= 2 * K.NX; k++) {
    const x = K.GX0 + k * S / 2;
    ctx.moveTo(x, K.LU_Y0); ctx.lineTo(x, K.LU_Y0 + (k % 2 ? 5 : 9));
  }
  for (let k = 0; k <= 2 * K.NY; k++) {
    const y = K.GY0 - k * S / 2;
    ctx.moveTo(K.LL_X1, y); ctx.lineTo(K.LL_X1 - (k % 2 ? 5 : 9), y);
  }
  ctx.stroke();
  ctx.restore();
  for (let n = 0; n <= K.NX; n++) _m6oText(ctx, String(n), _m6oX(n), K.LU_Y1 - 5, 11, K.STRICH);
  _m6oText(ctx, 'cm', _m6oX(K.NX) + 15, K.LU_Y1 - 5, 10, K.STRICH, 'center', '600');
  for (let n = 0; n <= K.NY; n++) _m6oText(ctx, String(n), K.LL_X0 + 9, _m6oY(n), 11, K.STRICH, 'center', '700', 'middle');
  _m6oText(ctx, 'cm', K.LL_X0 + 10, K.LL_Y0 + 9, 10, K.STRICH, 'center', '600', 'middle');
}
// Ein cm²-Quadrat in der Rasterzelle mit linker oberer Ecke (x|y).
// dunkel = 0 … 1 (hell … dunkel), a = Deckkraft.
function _m6oQuadrat(ctx, x, y, dunkel, a) {
  if (a <= 0.01) return;
  const K = _m6oK, s = K.S - 4;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = K.HELL; ctx.strokeStyle = K.HELLRAND; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x + 2, y + 2, s, s, 3); ctx.fill(); ctx.stroke();
  if (dunkel > 0.01) {
    ctx.globalAlpha = Math.min(1, a) * Math.min(1, dunkel);
    ctx.fillStyle = K.DUNKEL; ctx.strokeStyle = K.DUNKELRAND; ctx.lineWidth = 1.3;
    _bioFxRundRect(ctx, x + 2, y + 2, s, s, 3); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
// Legende oben rechts: ein Rasterfeld mit Quadrat, daneben „1 cm²“.
function _m6oLegende(ctx) {
  const K = _m6oK;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.NETZ; ctx.lineWidth = 1;
  ctx.fillRect(K.LGX, K.LGY, K.S, K.S); ctx.strokeRect(K.LGX, K.LGY, K.S, K.S);
  ctx.restore();
  _m6oQuadrat(ctx, K.LGX, K.LGY, 0, 1);
  _m6oText(ctx, _m6oCm2(1), K.LGX + K.S + 7, K.LGY + K.S / 2 + 0.5, 13, K.TINTE, 'left', '700', 'middle');
}
// Die Quadrate: erste Reihe Quadrat fuer Quadrat, dann die Kopien Reihe fuer Reihe.
function _m6oQuadrate(ctx, R, T) {
  const z = _m6o, K = _m6oK, E = _bioFxEase, kl = _bioFxKlemme, at = z.at;
  for (let j = 0; j < R.L; j++) {
    const u = (at - K.T_ZEICHNE - j * K.T_QUAD) / K.T_QUAD;
    if (u <= 0) continue;
    const e = E.sanft(kl(u));
    _m6oQuadrat(ctx, _m6oX(j), _m6oY(1) - 14 * (1 - e), 1, kl(u * 2.5));
  }
  for (let k = 1; k < R.B; k++) {
    const s = T.start(k), u = (at - s) / K.T_REIHE;
    if (u <= 0) continue;
    const e = E.sanft(kl(u));
    const hub = u < 1 ? 4 * Math.sin(Math.PI * e) : 0;           // hebt sich kurz ab
    const yTop = _m6oY(k + e) - hub;
    const hell = u >= 1 ? kl((at - s - K.T_REIHE) / K.T_HELL) : 0;
    if (u < 1) {                                                  // Schatten der gleitenden Reihe
      ctx.save();
      ctx.globalAlpha = 0.18 * kl(u * 6);
      ctx.fillStyle = '#0f172a';
      _bioFxRundRect(ctx, _m6oX(0) + 3, yTop + 5, R.L * K.S - 2, K.S - 2, 4); ctx.fill();
      ctx.restore();
    }
    for (let j = 0; j < R.L; j++) _m6oQuadrat(ctx, _m6oX(j), yTop, 1 - hell, kl(u * 6));
  }
}
// Der Rand: erst unten und links aus der Ecke, dann rechts und oben.
function _m6oUmriss(ctx, R) {
  const z = _m6o, K = _m6oK, h = K.T_ZEICHNE / 2, E = _bioFxEase, kl = _bioFxKlemme;
  const a = E.sanft(kl(z.at / h)), b = E.sanft(kl((z.at - h) / h));
  if (a <= 0) return;
  ctx.save();
  ctx.strokeStyle = K.RAND; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(_m6oX(a * R.L), _m6oY(0)); ctx.lineTo(_m6oX(0), _m6oY(0)); ctx.lineTo(_m6oX(0), _m6oY(a * R.B));
  if (b > 0) {
    ctx.moveTo(_m6oX(R.L), _m6oY(0)); ctx.lineTo(_m6oX(R.L), _m6oY(b * R.B));
    ctx.moveTo(_m6oX(0), _m6oY(R.B)); ctx.lineTo(_m6oX(b * R.L), _m6oY(R.B));
  }
  ctx.stroke();
  ctx.restore();
}
// Aha: der Rand des ganzen Rechtecks leuchtet bernstein nach.
function _m6oAhaGlanz(ctx, R) {
  const z = _m6o, K = _m6oK;
  if (z.ahaGlanz <= 0) return;
  const a = Math.min(1, z.ahaGlanz / 0.8) * (0.6 + 0.4 * Math.sin(z.t * 5));
  ctx.save();
  ctx.strokeStyle = 'rgba(245,158,11,' + (0.55 * a).toFixed(3) + ')';
  ctx.lineWidth = 12; ctx.lineJoin = 'round';
  ctx.strokeRect(_m6oX(0), _m6oY(R.B), R.L * K.S, R.B * K.S);
  ctx.restore();
}
// Ein Schild, das beim Erscheinen kurz aufspringt.
function _m6oSchild(ctx, t, x, y, farbe, alter, ausr, grund, groesse) {
  if (alter < 0) return;
  const K = _m6oK;
  const k = alter < K.T_POP ? Math.max(0.3, _bioFxEase.federn(alter / K.T_POP)) : 1;
  ctx.save();
  ctx.translate(x, y); ctx.scale(k, k);
  _m6oText(ctx, t, 0, 0, groesse || 15, farbe, ausr || 'center', '700', grund || 'alphabetic');
  ctx.restore();
}
// „5 cm“ unten (blau) und „3 cm“ links (orange): springen auf, wenn die
// Seite unten und die Seite links stehen.
function _m6oSchilder(ctx, R) {
  const z = _m6o, K = _m6oK, alter = z.at - K.T_ZEICHNE / 2 + 1e-9;
  _m6oSchild(ctx, _m6oCm(R.L), _m6oX(R.L / 2), K.LAY, K.REIHE, alter, 'center', 'alphabetic');
  _m6oSchild(ctx, _m6oCm(R.B), K.BEX, _m6oY(R.B / 2), K.NUMMER, alter, 'right', 'middle');
}
// Reihennummern links neben jeder fertigen Reihe. Sie erscheinen gleich in
// voller Groesse und schwellen kurz an – NICHT aus klein heraus: „Halt nach der
// ersten Reihe“ friert genau den Augenblick ein, in dem die 1 erscheint, und
// dort muss sie lesbar sein (Leinwandbild 04 zeigte sonst einen Punkt).
function _m6oNummern(ctx, R, T) {
  const z = _m6o, K = _m6oK;
  for (let k = 0; k < R.B; k++) {
    const alter = z.at - T.landet(k) + 1e-9;
    if (alter < 0) continue;
    const s = alter < K.T_POP ? 1 + 0.25 * Math.sin(Math.PI * alter / K.T_POP) : 1;
    const x = K.NRX, y = _m6oY(k + 0.5);
    ctx.save();
    ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = K.NUMMER;
    ctx.beginPath(); ctx.arc(0, 0, 7.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(x, y); ctx.scale(s, s);
    _m6oText(ctx, String(k + 1), 0, 0.5, 10.5, '#ffffff', 'center', '700', 'middle');
    ctx.restore();
  }
}
// Eine Zeile aus farbigen Teilen, mittig um xm; glanz > 0 hinterlegt die farbigen Zahlen.
function _m6oZeile(ctx, teile, xm, y, gr, glanz) {
  const K = _m6oK;
  ctx.font = '700 ' + gr + 'px sans-serif';
  const br = teile.map(t => ctx.measureText(t[0]).width), luft = gr * 0.32;
  const ges = br.reduce((s, b) => s + b, 0) + luft * (teile.length - 1);
  let x = xm - ges / 2;
  teile.forEach((t, i) => {
    const rgb = _m6oGLANZ[t[1]];
    if (glanz > 0 && rgb) {
      ctx.save();
      ctx.fillStyle = 'rgba(' + rgb + ',' + (0.18 * glanz).toFixed(3) + ')';
      _bioFxRundRect(ctx, x - 3, y - gr * 0.85, br[i] + 6, gr * 1.15, 5); ctx.fill();
      ctx.restore();
    }
    _m6oText(ctx, t[0], x, y, gr, t[1], 'left');
    x += br[i] + luft;
  });
}
// Karte „Rechnung“ rechts unten – gleitet am Ende herein.
function _m6oKarte(ctx, R) {
  const z = _m6o, K = _m6oK, e = _bioFxEase.sanft(z.karte);
  if (e <= 0.01) return;
  const dy = 10 * (1 - e), x0 = K.KX0, x1 = K.KX1, y0 = K.KY0 + dy, y1 = K.KY1 + dy;
  ctx.save();
  ctx.globalAlpha = e;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 3, x1 - x0, y1 - y0, 8); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 8); ctx.fill(); ctx.stroke();
  _m6oText(ctx, 'Rechnung', x0 + 9, y0 + 15, 11, K.GRAU, 'left', '600');
  const gl = z.endGlanz > 0 ? Math.min(1, z.endGlanz / 0.6) * (0.55 + 0.45 * Math.sin(z.t * 6)) : 0;
  const xm = (x0 + x1) / 2;
  _m6oZeile(ctx, [[String(R.B), K.NUMMER], ['·', K.TINTE], [_m6oCm2(R.L), K.REIHE]], xm, y0 + 41, 17, gl);
  _m6oZeile(ctx, [['=', K.TINTE], [_m6oCm2(R.L * R.B), K.TINTE]], xm, y0 + 65, 17, 0);
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m6oPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6oText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6oDraw(ctx, cv) {
  if (!_m6o) return;
  const z = _m6o, K = _m6oK, W = cv.width, H = cv.height;
  const R = z.key ? _m6oRECHTECK[z.key] : null;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6oRaster(ctx);
  const a = R ? _bioFxEase.sanft(_bioFxKlemme(z.at / (K.T_ZEICHNE / 2))) : 0;
  _m6oLineale(ctx, R, a);
  _m6oLegende(ctx);
  if (R) {
    const T = _m6oZeiten(R);
    _m6oQuadrate(ctx, R, T);
    _m6oAhaGlanz(ctx, R);
    _m6oUmriss(ctx, R);
    _m6oSchilder(ctx, R);
    _m6oNummern(ctx, R, T);
    if (z.ende) _m6oKarte(ctx, R);
  }
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6oPauseSchild(ctx);
}
