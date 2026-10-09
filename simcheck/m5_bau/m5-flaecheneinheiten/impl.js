
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mu3 „Was ist ein Quadratzentimeter?“
// (Kennung m5-flaecheneinheiten, Praefix _m6n)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL7_PROFIL.md, Abschnitte mu3 und
// m5-flaecheneinheiten.
// Ueberschrift (Frage der Einheit ohne Namen): „Wie viele cm² hat das Rechteck?“
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   - Eine Heftseite, stark vergroessert: Karo mit 5-mm-Kaestchen (hellblaue
//     Linien, 1 Kaestchen = 25 px, also 1 cm = 2 Kaestchen = 50 px). Das Karo ist
//     gleichmaessig – keine dickere Linie je cm, wie im echten Heft.
//   - Oben und links je ein gelbes Lineal mit cm-Teilung (Striche je mm, laengere
//     je halben cm, lange je cm). Die cm-Striche fallen GENAU auf jede zweite
//     Kaestchenlinie. Ziffern 0, 1, 2 … und „cm“ am Ende (oben 0 bis 5, links 0
//     bis 3). Beide Lineale haben ihre 0 an der Ecke oben links des Rechtecks.
//   - Das Rechteck ist dunkelblau umrandet; die Seiten sind aussen beschriftet:
//     unten die Laenge („3 cm“), rechts die Breite („2 cm“).
//   - Rechts oben die Legende ohne Text: ein Quadrat mit 1 cm Seitenlaenge auf
//     den Kaestchenlinien (genau 2 x 2 Kaestchen), darin „1 cm²“. Aus ihr fliegen
//     die blauen Quadrate heraus – gleich gross, nie gestaucht.
//   - Darunter zwei Zaehlkaertchen ohne Text: ein gelbes Kaestchen mit der Zahl
//     der leuchtenden Kaestchen, ein blaues Quadrat mit der Zahl der gelegten
//     Quadrate. Gelb und blau sind dieselben Farben wie im Bild und in den
//     Statuszeilen (Bild und Zeichen verbunden, MATHE_PROFIL § 10.2).
//
// BEWEGUNG (jede Sprungmarke spielt SELBST ab, N1 im Bauplan: ein Schritt im
// Heft = eine Handlung; anhalten kann die Lehrkraft):
//   Das Rechteck zeichnet sich (0,6 s): eine Spitze faehrt den Rand ab, von der
//     Ecke oben links im Uhrzeigersinn. Danach springen die Seitenschilder auf.
//   Dann leuchten die Kaestchen darin nacheinander hellgelb auf
//     (Lesereihenfolge, 0,05 s je Kaestchen), der Kaestchenzaehler zaehlt mit.
//   Ruhe 0,4 s (darin haelt „Halt nach dem Kästchenzählen“ an, sobald das
//     letzte Kaestchen ausgeleuchtet ist).
//   Danach fliegen blaue Quadrate mit 1 cm Seitenlaenge einzeln aus der
//     Legende herein (0,3 s je Quadrat, Lesereihenfolge; geradewegs, leicht
//     gekippt und schwebend – ein Bogen nach oben liefe ueber das Lineal). Jedes
//     deckt genau vier gelbe Kaestchen zu, blitzt beim Landen kurz hell auf und
//     traegt klein „1 cm²“; der Quadratzaehler zaehlt mit.
//   Am Ende steht der Flaecheninhalt in der Statuszeile; das blaue
//     Zaehlkaertchen leuchtet 1,6 s.
//   Dauer ab Knopfdruck: 1 cm x 1 cm 1,5 s · 3 cm x 2 cm 4,0 s ·
//   4 cm x 3 cm 7,0 s · 2 cm x 2 cm 3,0 s. simfakten.js (--frames=25
//   --verlauf=4) liest das Ende im zweiten Knopfdurchgang (bis 10 s) ab.
// Alles ist eine Funktion der Ablaufzeit z.at (_m6nZeiten, _m6nStand): keine
// Zufallszahl; jede Zahl im Bild kommt aus derselben Rechnung wie die
// Statuszeilen.
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6nWahl('…'), Wahlgruppe):
//     „1 cm lang, 1 cm breit“ · „3 cm lang, 2 cm breit“ · „4 cm lang, 3 cm breit“
//     · „2 cm lang, 2 cm breit“ (frei, nicht im Heft)
//   Reihe 2: „noch einmal“ (_m6nNochmal: das gewaehlte Rechteck neu ablaufen
//     lassen; blass, solange keins gewaehlt ist) · „neu“ (_m6nNeu: leeres
//     Heftblatt mit Lineal)
//   Eine Sprungmarke waehrend des Ablaufs startet das Rechteck neu.
//
// STATUSZEILEN (woertlich aus dem Bauplan, jede mit Wert mehr als 18 Zeichen):
//   _m6n-rechteck   „Rechteck: 3 cm lang, 2 cm breit“ (Start „Rechteck: noch
//                   keins gewählt“)
//   _m6n-kaestchen  „Kästchen im Rechteck: 24“ (zaehlt hoch, Start 0)
//   _m6n-quadrate   „Quadrate mit 1 cm Seitenlänge: 6“ (zaehlt hoch, Start 0)
//   _m6n-flaeche    am Ende „Flächeninhalt: 6 cm²“ (vorher „Flächeninhalt: …“)
// Groessen mit Einheit (N3), zwischen Zahl und Einheit U+00A0, „cm²“ mit U+00B2.
// Die Anzahlen (Kaestchen, Quadrate) sind keine Groessen und stehen ohne Einheit.
//
// WERTE (jede Zeile nachgerechnet mit simcheck/werte.js):
//   1 cm lang, 1 cm breit ->  4 Kaestchen,  1 Quadrat,   1 cm²
//   3 cm lang, 2 cm breit -> 24 Kaestchen,  6 Quadrate,  6 cm²
//   4 cm lang, 3 cm breit -> 48 Kaestchen, 12 Quadrate, 12 cm²
//   2 cm lang, 2 cm breit -> 16 Kaestchen,  4 Quadrate,  4 cm²
//   (Kaestchen = 2 · Laenge in cm mal 2 · Breite in cm; Quadrate = Laenge mal
//   Breite – nur intern gerechnet, am Bildschirm wird gezaehlt.)
// START: leeres Heftblatt mit Lineal („Start: leeres Heftblatt mit Lineal“).
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen): „3 cm lang, 2 cm breit“ – das
// 6. Quadrat landet: Lichtring um die sechs Quadrate, ihre Raender leuchten
// 2,6 s bernstein; das gelbe Kaertchen mit der 24 bleibt daneben stehen
// (24 Kaestchen, aber 6 Quadrate). Einmal je Ablauf. Das widerlegt „24 cm²“
// (Kaestchen gezaehlt) und „12 cm²“ (Laengenregel 2 Kaestchen = 1 cm auf die
// Flaeche uebertragen).
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen, Container fpm-lehrkraft fuer
// simfakten.js): eigene Knopfzeile UNTER den Heftknoepfen, davor klein
// „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m6nAnhalten): friert jede Bewegung ein (Zeichnen,
//     Leuchten, Flug, Lichtring); Schild „Pause“ oben links.
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m6nTempo): ein Drittel so schnell.
//   „Halt nach dem Kästchenzählen: aus“ <-> „… an“ (_m6nHalt): haelt den Ablauf
//     an, sobald das letzte Kaestchen gezaehlt und ausgeleuchtet ist und noch
//     kein Quadrat fliegt – Tareks Stelle. Die Simulation steht dann in der Pause (Knopf „weiter“,
//     Schild „Pause“), die Hinweiszeile sagt
//     „Halt: 24 Kästchen gezählt, noch keine Quadrate. Dann „weiter“.“
//     (bei 3 cm x 2 cm). „weiter“ oder der Schalter auf „aus“ lassen die
//     Quadrate fliegen. Einmal je Ablauf; wer den Schalter erst danach einlegt,
//     haelt beim naechsten Ablauf.
//   Eine Sprungmarke, „noch einmal“ oder „neu“ heben die Pause auf; Tempo und
//   Halt bleiben stehen (die Lehrkraft stellt sie einmal ein). Das wechselnde
//   Wort steht in einem eigenen <span>. Hinweiszeile _m6n-lehrkraft nennt immer
//   die Einstellung (in der Pause bernsteinfarben). Voreinstellung (Pause aus,
//   Tempo normal, Halt aus): Zeitfaktor 1.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): „Quadratzentimeter“
// ausgeschrieben (am Bildschirm nur „cm²“), „4 Kästchen sind 1 cm²“ als Satz,
// „: 4“ als Rechnung, die Regel als Satz. Keine Namen, keine Punkte, keine
// Zeitmessung, kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m6n = null;
const _m6nRECHTECKE = {
  l1b1: { L: 1, B: 1, text: '1 cm lang, 1 cm breit' },
  l3b2: { L: 3, B: 2, text: '3 cm lang, 2 cm breit' },
  l4b3: { L: 4, B: 3, text: '4 cm lang, 3 cm breit' },
  l2b2: { L: 2, B: 2, text: '2 cm lang, 2 cm breit' }
};
const _m6nREIHE = ['l1b1', 'l3b2', 'l4b3', 'l2b2'];
const _m6nK = {
  // Massstab: ein Heftkaestchen (5 mm) und ein Zentimeter in px
  KA: 25, CM: 50, MM: 5,
  // Ecke oben links des Rechtecks = 0 cm auf beiden Linealen (ein Gitterpunkt)
  X0: 46, Y0: 46,
  // Lineal oben: Band von LO0 bis Y0, nach rechts bis LOX1, Ziffern 0 … LOMAX
  LO0: 18, LOX1: 326, LOMAX: 5,
  // Lineal links: Band von LL0 bis X0, nach unten bis LLY1, Ziffern 0 … LLMAX
  LL0: 18, LLY1: 231, LLMAX: 3,
  // Legende: Quadrat mit 1 cm Seitenlaenge auf den Kaestchenlinien
  GX: 346, GY: 46,
  // Zaehlkaertchen: Kaestchen (gelb) und Quadrate (blau)
  CX0: 338, CX1: 410, CKY: 114, CQY: 154, CH: 30,
  // Zeiten in s
  T_ZEICHNE: 0.6, T_KAE: 0.05, T_GLUEH: 0.15, T_RUH: 0.4, T_QUA: 0.3,
  T_LAND: 0.25, T_POP: 0.3,
  // Farben
  RAND: '#1e3a8a', QUAD: '#2563eb', QUADRAND: '#1e40af',
  KAE: '#fde68a', KAEHELL: '#fbbf24', KAEZAHL: '#a16207',
  LINIE: '#bfdbfe', PAPIER: '#fcfdff',
  LINEAL: '#fde047', LINEALRAND: '#ca8a04', STRICH: '#713f12',
  AHA: '#f59e0b', TINTE: '#0f172a', GRAU: '#64748b'
};

// ── Hilfen ───────────────────────────────────────────────────────────────
// Groessen mit Einheit, geschuetztes Leerzeichen zwischen Zahl und Einheit.
function _m6nCm(x) { return x + ' cm'; }
function _m6nQcm(x) { return x + ' cm²'; }
function _m6nName(R) { return R.text.replace(/(\d) /g, '$1 '); }

// Zeitplan eines Rechtecks (Ablaufzeit in s): n Kaestchen, m Quadrate.
function _m6nZeiten(R) {
  const K = _m6nK, n = 4 * R.L * R.B, m = R.L * R.B;
  const gezaehlt = K.T_ZEICHNE + n * K.T_KAE;      // letztes Kaestchen gezaehlt
  // Halt der Lehrkraft: wenn auch das letzte Kaestchen ausgeleuchtet hat (alle
  // gleich hellgelb) – noch in der Ruhe, also bevor das erste Quadrat fliegt.
  const halt = gezaehlt + (K.T_GLUEH - K.T_KAE);
  const q0 = gezaehlt + K.T_RUH;                   // erstes Quadrat fliegt los
  return { n, m, gezaehlt, halt, q0, ende: q0 + m * K.T_QUA };
}
// Stand zur Ablaufzeit: Rechteck fertig gezeichnet? Wie viele Kaestchen
// gezaehlt, wie viele Quadrate gelandet, alles fertig?
// Kaestchen k leuchtet ab T_ZEICHNE + k · T_KAE auf und ist gezaehlt, wenn sein
// Takt um ist; Quadrat q fliegt ab q0 + q · T_QUA und ist gezaehlt, wenn es liegt.
function _m6nStand(z) {
  const st = { gezeichnet: false, kaestchen: 0, quadrate: 0, fertig: false };
  const R = z.key ? _m6nRECHTECKE[z.key] : null;
  if (!R) return st;
  const K = _m6nK, T = _m6nZeiten(R), at = z.at + 1e-9;
  st.gezeichnet = at >= K.T_ZEICHNE;
  st.kaestchen = Math.max(0, Math.min(T.n, Math.floor((at - K.T_ZEICHNE) / K.T_KAE)));
  st.quadrate = Math.max(0, Math.min(T.m, Math.floor((at - T.q0) / K.T_QUA)));
  st.fertig = at >= T.ende;
  return st;
}
// Ecke oben links von Kaestchen k bzw. Quadrat q (Lesereihenfolge).
function _m6nKaePlatz(R, k) {
  const K = _m6nK, sp = 2 * R.L;
  return { x: K.X0 + (k % sp) * K.KA, y: K.Y0 + Math.floor(k / sp) * K.KA };
}
function _m6nQuaPlatz(R, q) {
  const K = _m6nK;
  return { x: K.X0 + (q % R.L) * K.CM, y: K.Y0 + Math.floor(q / R.L) * K.CM };
}

function _m6nInit() {
  _m6n = { t: 0, at: 0, key: null, fx: { teile: [] },
           pause: false, langsam: false, halt: false };   // Lehrkraft-Einstellungen
  _m6nLaden(null);
}
// Ein Rechteck laden (key = null: leeres Heftblatt). Hebt die Pause auf.
function _m6nLaden(key) {
  const z = _m6n;
  z.key = key; z.at = 0;
  z.stand = _m6nStand(z);
  z.kPop = 9; z.qPop = 9;
  z.aha = false; z.ahaGlanz = 0;
  z.ende = false; z.endGlanz = 0;
  z.gehalten = false; z.haltJetzt = false;
  z.fx.teile.length = 0;
  z.pause = false;
}
function _m6nHTML() {
  const marke = k => `<button class="sim-btn" id="_m6n-b-${k}" onclick="_m6nWahl('${k}')">${_m6nRECHTECKE[k].text.replace(/(\d) /g, '$1&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele cm² hat das Rechteck?</h3>
    <div class="fpm-note" style="margin-top:2px">Die Kästchen sind wie im Heft. Wähle ein Rechteck und sieh zu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6n-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6nREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6n-nochmal" onclick="_m6nNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m6nNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6n-pause" onclick="_m6nAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6n-tempo" onclick="_m6nTempo()">Tempo: <span id="_m6n-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6n-halt" onclick="_m6nHalt()">Halt nach dem Kästchenzählen: <span id="_m6n-halt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6n-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6n-rechteck" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6n-kaestchen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6n-quadrate" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6n-flaeche" style="margin-top:6px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: leeres Heftblatt mit Lineal</p>
  </div>`;
}
function _m6nSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6nStatus() {
  if (!_m6n) return;
  const z = _m6n, K = _m6nK, R = z.key ? _m6nRECHTECKE[z.key] : null, st = z.stand;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  _m6nSetze('_m6n-rechteck', 'Rechteck: ' + (R ? _m6nName(R) : 'noch keins gewählt'));
  _m6nSetze('_m6n-kaestchen', 'Kästchen im Rechteck: ' + f(st.kaestchen, K.KAEZAHL));
  _m6nSetze('_m6n-quadrate', 'Quadrate mit 1 cm Seitenlänge: ' + f(st.quadrate, K.QUAD));
  _m6nSetze('_m6n-flaeche', 'Flächeninhalt: ' +
            (R && st.fertig ? f(_m6nQcm(R.L * R.B), K.TINTE) : '…'));
  _m6nREIHE.forEach(k => {
    const b = document.getElementById('_m6n-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  const nm = document.getElementById('_m6n-nochmal');
  if (nm) { nm.disabled = !R; if (nm.style) nm.style.opacity = R ? '' : '0.45'; }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6nSetze('_m6n-pause', z.pause ? 'weiter' : 'Pause');
  _m6nSetze('_m6n-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6nSetze('_m6n-halt-an', z.halt ? 'an' : 'aus');
  const hz = _m6nSetze('_m6n-lehrkraft', _m6nHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6n-pause', z.pause], ['_m6n-halt', z.halt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6nHinweis() {
  const z = _m6n, R = z.key ? _m6nRECHTECKE[z.key] : null;
  let a;
  if (z.pause && z.haltJetzt && R)
    a = 'Halt: ' + _m6nZeiten(R).n + ' Kästchen gezählt, noch keine Quadrate. Dann „weiter“.';
  else if (z.pause) a = 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  else a = 'Für die Lehrkraft: „Pause“ hält alles an.';
  return a + ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt nach dem Kästchenzählen: ' + (z.halt ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6nWahl(key) {
  if (!_m6n || !_m6nRECHTECKE[key]) return;
  _m6nLaden(key);
  _m6nStatus();
}
function _m6nNochmal() {
  if (!_m6n || !_m6n.key) return;
  _m6nLaden(_m6n.key);
  _m6nStatus();
}
function _m6nNeu() {
  if (!_m6n) return;
  _m6nLaden(null);
  _m6nStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6nAnhalten() {
  if (!_m6n) return;
  _m6n.pause = !_m6n.pause;
  if (!_m6n.pause) _m6n.haltJetzt = false;
  _m6nStatus();
}
function _m6nTempo() {
  if (!_m6n) return;
  _m6n.langsam = !_m6n.langsam;
  _m6nStatus();
}
function _m6nHalt() {
  if (!_m6n) return;
  const z = _m6n;
  z.halt = !z.halt;
  if (!z.halt && z.haltJetzt) { z.pause = false; z.haltJetzt = false; }   // aus: weiterlegen
  _m6nStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6nZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6nUpdate(dt) {
  if (!_m6n) return;
  const z = _m6n, K = _m6nK;
  dt = _bioFxDt(dt) * _m6nZeitfaktor(z);            // ab hier Sim-Zeit
  z.t += dt;
  z.kPop += dt; z.qPop += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.endGlanz = Math.max(0, z.endGlanz - dt);
  const R = z.key ? _m6nRECHTECKE[z.key] : null;
  if (R && dt > 0) {                                // ohne Zeit kein Schritt im Ablauf
    const T = _m6nZeiten(R);
    let neuAt = z.at + dt, neu = false;
    // Halt nach dem Kaestchenzaehlen: anhalten, sobald das letzte Kaestchen
    // gezaehlt und ausgeleuchtet ist (noch kein Quadrat unterwegs)
    if (z.halt && !z.gehalten && z.at < T.halt - 1e-9 && neuAt >= T.halt - 1e-9) {
      neuAt = T.halt; z.gehalten = true; z.pause = true; z.haltJetzt = true; neu = true;
    }
    z.at = neuAt;
    const st = _m6nStand(z), alt = z.stand;
    if (st.kaestchen !== alt.kaestchen) { z.kPop = 0; neu = true; }
    if (st.quadrate !== alt.quadrate) { z.qPop = 0; neu = true; }
    if (st.gezeichnet !== alt.gezeichnet || st.fertig !== alt.fertig) neu = true;
    if (z.key === 'l3b2' && !z.aha && st.quadrate >= T.m) {
      // Aha: das 6. Quadrat liegt – 24 Kaestchen, aber 6 Quadrate
      z.aha = true; z.ahaGlanz = 2.6;
      _bioFxWelle(z.fx.teile, K.X0 + R.L * K.CM / 2, K.Y0 + R.B * K.CM / 2, K.AHA, 92);
    }
    if (st.fertig && !z.ende) { z.ende = true; z.endGlanz = 1.6; }
    z.stand = st;
    if (neu) _m6nStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6nText(ctx, s, x, y, groesse, farbe, ausr, gew, grund) {
  ctx.fillStyle = farbe || _m6nK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = grund || 'alphabetic';
  ctx.fillText(s, x, y);
}
// Heftpapier mit gleichmaessigem Karo (5 mm), ausgerichtet an der Ecke (X0|Y0).
function _m6nPapier(ctx, W, H) {
  const K = _m6nK;
  ctx.save();
  ctx.fillStyle = K.PAPIER; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = K.LINIE; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = K.X0 % K.KA; x < W; x += K.KA) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
  for (let y = K.Y0 % K.KA; y < H; y += K.KA) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
  ctx.stroke();
  ctx.restore();
}
// Ein Lineal-Band mit Schatten.
function _m6nBand(ctx, x, y, w, h) {
  const K = _m6nK;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, x + 2, y + 3, w, h, 4); ctx.fill();
  ctx.fillStyle = K.LINEAL; ctx.strokeStyle = K.LINEALRAND; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, x, y, w, h, 4); ctx.fill(); ctx.stroke();
}
// Lineal oben: Messkante unten (y = Y0), Striche nach oben, Ziffern darueber.
function _m6nLinealOben(ctx) {
  const K = _m6nK;
  ctx.save();
  _m6nBand(ctx, K.X0 - 3, K.LO0, K.LOX1 - K.X0 + 3, K.Y0 - K.LO0);
  ctx.strokeStyle = K.STRICH;
  const bis = Math.floor((K.LOX1 - 4 - K.X0) / K.MM);
  for (let mm = 0; mm <= bis; mm++) {
    const x = K.X0 + mm * K.MM, cm = mm % 10 === 0, halb = mm % 5 === 0;
    ctx.lineWidth = cm ? 1.5 : 1;
    ctx.beginPath(); ctx.moveTo(x, K.Y0); ctx.lineTo(x, K.Y0 - (cm ? 12 : halb ? 8 : 4)); ctx.stroke();
  }
  ctx.restore();
  for (let c = 0; c <= K.LOMAX; c++) _m6nText(ctx, String(c), K.X0 + c * K.CM, K.Y0 - 16, 12, K.STRICH);
  _m6nText(ctx, 'cm', K.X0 + K.LOMAX * K.CM + 16, K.Y0 - 16, 11, K.STRICH);
}
// Lineal links: Messkante rechts (x = X0), Striche nach links, Ziffern daneben.
function _m6nLinealLinks(ctx) {
  const K = _m6nK;
  ctx.save();
  _m6nBand(ctx, K.LL0, K.Y0 - 3, K.X0 - K.LL0, K.LLY1 - K.Y0 + 3);
  ctx.strokeStyle = K.STRICH;
  const bis = Math.floor((K.LLY1 - 4 - K.Y0) / K.MM);
  for (let mm = 0; mm <= bis; mm++) {
    const y = K.Y0 + mm * K.MM, cm = mm % 10 === 0, halb = mm % 5 === 0;
    ctx.lineWidth = cm ? 1.5 : 1;
    ctx.beginPath(); ctx.moveTo(K.X0, y); ctx.lineTo(K.X0 - (cm ? 12 : halb ? 8 : 4), y); ctx.stroke();
  }
  ctx.restore();
  const xm = (K.LL0 + K.X0 - 12) / 2;
  for (let c = 0; c <= K.LLMAX; c++) _m6nText(ctx, String(c), xm, K.Y0 + c * K.CM, 12, K.STRICH, 'center', '700', 'middle');
  _m6nText(ctx, 'cm', xm, K.Y0 + K.LLMAX * K.CM + 22, 11, K.STRICH, 'center', '700', 'middle');
}
// Ein Quadrat mit 1 cm Seitenlaenge (2 x 2 Kaestchen), darin klein „1 cm²“.
// Die Mitte ist leicht geteilt (die vier Kaestchen schimmern durch); das
// Schild in der Mitte deckt die Kreuzung ab, damit „1 cm²“ lesbar bleibt.
// hell: weisser Blitz beim Landen (0 … 1), aha: bernsteinfarbener Rand (0 … 1).
function _m6nQuadrat(ctx, x, y, hell, aha) {
  const K = _m6nK, s = K.CM;
  ctx.save();
  ctx.fillStyle = K.QUAD;
  ctx.fillRect(x + 1.5, y + 1.5, s - 3, s - 3);
  ctx.strokeStyle = K.QUADRAND; ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 1.5, y + 1.5, s - 3, s - 3);
  ctx.strokeStyle = 'rgba(255,255,255,0.30)'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + s / 2, y + 4); ctx.lineTo(x + s / 2, y + s - 4);
  ctx.moveTo(x + 4, y + s / 2); ctx.lineTo(x + s - 4, y + s / 2);
  ctx.stroke();
  ctx.fillStyle = K.QUAD;
  _bioFxRundRect(ctx, x + s / 2 - 17, y + s / 2 - 8, 34, 16, 4); ctx.fill();
  if (hell > 0) {
    ctx.fillStyle = 'rgba(255,255,255,' + (0.7 * hell).toFixed(3) + ')';
    ctx.fillRect(x + 1.5, y + 1.5, s - 3, s - 3);
  }
  if (aha > 0) {
    ctx.strokeStyle = 'rgba(251,191,36,' + (0.95 * aha).toFixed(3) + ')'; ctx.lineWidth = 2.5;
    ctx.strokeRect(x + 3.5, y + 3.5, s - 7, s - 7);
  }
  ctx.restore();
  _m6nText(ctx, _m6nQcm(1), x + s / 2, y + s / 2 + 0.5, 11, '#ffffff', 'center', '700', 'middle');
}
// Die Kaestchen im Rechteck, die schon leuchten (ein heller Blitz, dann hellgelb).
function _m6nKaestchen(ctx, R, T) {
  const z = _m6n, K = _m6nK;
  for (let k = 0; k < T.n; k++) {
    const u = (z.at - K.T_ZEICHNE - k * K.T_KAE) / K.T_GLUEH;
    if (u < 0) break;                                // Lesereihenfolge: der Rest kommt spaeter
    const e = _bioFxKlemme(u), p = _m6nKaePlatz(R, k);
    ctx.save();
    ctx.fillStyle = K.KAE; ctx.globalAlpha = Math.min(1, 0.35 + e);
    ctx.fillRect(p.x + 1.5, p.y + 1.5, K.KA - 2, K.KA - 2);
    if (e < 1) {
      ctx.fillStyle = K.KAEHELL; ctx.globalAlpha = 0.85 * (1 - e);
      ctx.fillRect(p.x + 1.5, p.y + 1.5, K.KA - 2, K.KA - 2);
    }
    ctx.restore();
  }
}
// Gelandete Quadrate: Blitz beim Landen, Aha-Rand.
function _m6nGelegt(ctx, R, T) {
  const z = _m6n, K = _m6nK, kl = _bioFxKlemme;
  const aha = z.ahaGlanz > 0 ? Math.min(1, z.ahaGlanz / 0.8) * (0.6 + 0.4 * Math.sin(z.t * 5)) : 0;
  for (let q = 0; q < z.stand.quadrate; q++) {
    const p = _m6nQuaPlatz(R, q), land = T.q0 + (q + 1) * K.T_QUA;
    _m6nQuadrat(ctx, p.x, p.y, 1 - kl((z.at - land) / K.T_LAND), aha);
  }
}
// Das Quadrat, das gerade fliegt (hoechstens eins).
function _m6nFlug(ctx, R, T) {
  const z = _m6n, K = _m6nK, E = _bioFxEase;
  const q = z.stand.quadrate;
  if (q >= T.m) return;
  const u = (z.at - T.q0 - q * K.T_QUA) / K.T_QUA;
  if (u <= 0 || u >= 1) return;
  // gleitet aus der Legende geradewegs auf seinen Platz (ein Bogen nach oben
  // liefe ueber das Lineal), schwebt dabei sichtbar ueber dem Blatt (Schatten
  // waechst und schrumpft) und kippt leicht – beim Landen liegt es wieder
  // gerade. Gleich gross, nie gestaucht.
  const e = E.sanft(u), p = _m6nQuaPlatz(R, q), hub = Math.sin(Math.PI * e);
  const x = K.GX + (p.x - K.GX) * e, y = K.GY + (p.y - K.GY) * e, s = K.CM;
  ctx.save();
  ctx.translate(x + s / 2, y + s / 2);
  ctx.rotate(-0.12 * hub);
  ctx.fillStyle = 'rgba(15,23,42,' + (0.08 + 0.10 * hub).toFixed(3) + ')';
  ctx.fillRect(-s / 2 + 2 + 5 * hub, -s / 2 + 3 + 7 * hub, s - 3, s - 3);
  _m6nQuadrat(ctx, -s / 2, -s / 2, 0, 0);
  ctx.restore();
}
// Rand des Rechtecks: zeichnet sich ab der Ecke oben links im Uhrzeigersinn,
// eine Spitze zeigt, wo gerade gezeichnet wird. Danach die Seitenschilder.
function _m6nUmriss(ctx, R) {
  const z = _m6n, K = _m6nK;
  const w = R.L * K.CM, h = R.B * K.CM, x0 = K.X0, y0 = K.Y0;
  const ecken = [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h], [x0, y0]];
  let rest = 2 * (w + h) * _bioFxEase.sanft(_bioFxKlemme(z.at / K.T_ZEICHNE));
  let sx = x0, sy = y0;
  ctx.save();
  ctx.strokeStyle = K.RAND; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i < ecken.length && rest > 0; i++) {
    const [ax, ay] = ecken[i - 1], [bx, by] = ecken[i];
    const l = Math.hypot(bx - ax, by - ay), t = Math.min(1, rest / l);
    sx = ax + (bx - ax) * t; sy = ay + (by - ay) * t;
    ctx.lineTo(sx, sy);
    rest -= l;
  }
  ctx.stroke();
  if (z.at < K.T_ZEICHNE) {                          // Spitze des Stifts
    ctx.fillStyle = K.RAND;
    ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  // Seitenschilder: unten die Laenge, rechts die Breite (springen auf)
  const alter = z.at - K.T_ZEICHNE + 1e-9;
  if (alter < 0) return;
  const k = alter < K.T_POP ? Math.max(0.3, _bioFxEase.federn(alter / K.T_POP)) : 1;
  const schild = (t, x, y, ausr) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    _m6nText(ctx, t, 0, 0, 14, K.RAND, ausr, '700', 'middle');
    ctx.restore();
  };
  schild(_m6nCm(R.L), x0 + w / 2, y0 + h + 15, 'center');
  schild(_m6nCm(R.B), x0 + w + 9, y0 + h / 2, 'left');
}
// Zwei Zaehlkaertchen ohne Text: gelbes Kaestchen + Zahl, blaues Quadrat + Zahl.
function _m6nZaehler(ctx) {
  const z = _m6n, K = _m6nK, st = z.stand;
  const e = _bioFxEase.sanft(_bioFxKlemme(z.at / 0.4));
  if (e <= 0.01) return;
  const karte = (y0, zahl, pop, glanz, symbol, farbe) => {
    ctx.save();
    ctx.globalAlpha = e;
    ctx.fillStyle = 'rgba(15,23,42,0.10)';
    _bioFxRundRect(ctx, K.CX0 + 2, y0 + 3, K.CX1 - K.CX0, K.CH, 7); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
    _bioFxRundRect(ctx, K.CX0, y0, K.CX1 - K.CX0, K.CH, 7); ctx.fill(); ctx.stroke();
    if (glanz > 0) {
      ctx.globalAlpha = e * Math.min(1, glanz / 0.6) * (0.55 + 0.45 * Math.sin(z.t * 6));
      ctx.fillStyle = 'rgba(252,211,77,0.45)'; ctx.strokeStyle = K.AHA; ctx.lineWidth = 2;
      _bioFxRundRect(ctx, K.CX0, y0, K.CX1 - K.CX0, K.CH, 7); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = e;
    }
    symbol(K.CX0 + 8, y0 + K.CH / 2);
    const k = pop < K.T_POP ? 1 + 0.18 * Math.sin(Math.PI * pop / K.T_POP) : 1;
    ctx.translate(K.CX1 - 10, y0 + K.CH / 2); ctx.scale(k, k);
    _m6nText(ctx, String(zahl), 0, 1, 18, farbe, 'right', '700', 'middle');
    ctx.restore();
  };
  karte(K.CKY, st.kaestchen, z.kPop, 0, (x, ym) => {        // ein Heftkaestchen, gelb
    ctx.fillStyle = K.KAE; ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 1.2;
    ctx.fillRect(x, ym - 8, 16, 16); ctx.strokeRect(x, ym - 8, 16, 16);
  }, K.KAEZAHL);
  karte(K.CQY, st.quadrate, z.qPop, z.endGlanz, (x, ym) => { // ein Quadrat, blau
    ctx.fillStyle = K.QUAD; ctx.strokeStyle = K.QUADRAND; ctx.lineWidth = 1.2;
    ctx.fillRect(x, ym - 9, 18, 18); ctx.strokeRect(x, ym - 9, 18, 18);
  }, K.QUAD);
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m6nPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6nText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6nDraw(ctx, cv) {
  if (!_m6n) return;
  const z = _m6n, K = _m6nK, W = cv.width, H = cv.height;
  const R = z.key ? _m6nRECHTECKE[z.key] : null;
  ctx.clearRect(0, 0, W, H);
  _m6nPapier(ctx, W, H);
  _m6nLinealOben(ctx);
  _m6nLinealLinks(ctx);
  _m6nQuadrat(ctx, K.GX, K.GY, 0, 0);               // Legende
  if (R) {
    const T = _m6nZeiten(R);
    _m6nKaestchen(ctx, R, T);
    _m6nGelegt(ctx, R, T);
    _m6nUmriss(ctx, R);
    _m6nZaehler(ctx);
    _m6nFlug(ctx, R, T);
  }
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6nPauseSchild(ctx);
}
