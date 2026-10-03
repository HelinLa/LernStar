
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mf2 „Senkrecht oder parallel?“ (Kennung m5-geodreieck)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL3_PROFIL.md, Abschnitt m5-geodreieck.
// Ueberschrift: „Wie liegen die Geraden g und h zueinander?“ – die Frage der
// Einheit („Können schräge Geraden senkrecht zueinander sein?“) traegt das
// Wort „senkrecht“ (nicht am Bildschirm), deshalb eine neutrale Frage.
//
// Was man sieht: ein Blatt Karopapier (Kaestchen 12 px = 0,5 cm im Modell,
// also 24 px = 1 cm). Darauf zwei Geraden ueber das ganze Bild: g blau, h
// orange, beschriftet mit „g“ und „h“. Schneiden sie sich, sitzt dort ein
// kleiner dunkler Punkt (immer in der Bildmitte 196|120).
// Eine Sprungmarke dreht die Geraden in 0,8 s in ihre neue Lage (Bewegung
// statt Sprung):
//   „Kreuz, gerade“          g waagerecht (0°), h von oben nach unten (90°)
//   „Kreuz, schräg“          dasselbe Kreuz um 30° gedreht: g 30°, h 120°
//   „schräg geschnitten“     g bleibt bei 30°, h steht bei 90°: Winkel 60°
//   „nebeneinander, schräg“  g bleibt bei 30°, h dreht ebenfalls auf 30° und
//                            liegt 48 px = 2 cm daneben
// In den drei schraegen Lagen bleibt g also stehen, nur h dreht sich (eine
// Groesse wird veraendert, alles andere bleibt – MATHE_PROFIL § 10, Regel 3).
// „Papierecke anlegen“: Eine weisse Papierecke (Ecke eines Blatts, zwei
// gerade Kanten, die dritte Kante abgerissen) mit Schatten gleitet in 0,9 s
// von unten rechts herein. Ihre eine Kante legt sie auf g, ihre Ecke an den
// Schnittpunkt; die zweite Kante zeigt nach unten rechts.
//   passt genau  – die zweite Kante liegt auf h: innen laeuft ein gruener
//                  Rand an beiden Kanten auf (0,45 s)
//   passt nicht  – zwischen der zweiten Kante und h bleibt ein Keil frei
//                  (30°), er fuellt sich orange (0,45 s)
//   kein Schnittpunkt – die Ecke liegt auf g, ihre zweite Kante reicht ueber h
//                  hinaus; sie rutscht 0,9 s auf g hin und her (sucht) und
//                  bleibt dann liegen
// „Abstand messen“:
//   g und h schneiden sich nicht – zwei Messpfeile wachsen an zwei Stellen
//     von g bis h (rechtwinklig zu h, jeder 0,55 s, der zweite 0,3 s
//     spaeter); hinter h erscheint je ein Schild „2 cm“
//   g und h schneiden sich – ein Messpfeil von einem Punkt auf g bis h
//     (rechtwinklig zu h) rutscht in 1,1 s auf g bis zum Schnittpunkt und
//     wird dabei immer kuerzer, bis nichts mehr uebrig ist; dort springt ein
//     Ring auf. Keine Zahl.
// Ein Knopfdruck waehrend einer Bewegung laesst sie sofort fertig werden; eine
// Sprungmarke nimmt Papierecke und Messpfeile weg. Jede Knopffolge endet so
// im selben Zustand.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5nLage('a'|'b'|'c'|'d')):
//     „Kreuz, gerade“ · „Kreuz, schräg“ · „schräg geschnitten“ ·
//     „nebeneinander, schräg“
//   „Papierecke anlegen“ (_m5nEcke()) · „Abstand messen“ (_m5nAbstand()) ·
//   „neu“ (_m5nNeu(): zurueck zu „Kreuz, gerade“, alles weg)
//
// Statuszeilen (woertlich; jede laenger als 18 Zeichen, simfakten.js-Grenze):
//   _m5n-lage     „Lage: Kreuz, schräg“
//   _m5n-schnitt  „Schneiden sich g und h? ja“ bzw. „… nein“
//                 (waehrend die Geraden sich drehen: „… ?“ mit „…“)
//   _m5n-ecke     vorher „Papierecke: noch nicht angelegt“, waehrend der
//                 Bewegung „Papierecke: wird angelegt …“, danach
//                 „Papierecke am Schnittpunkt: passt genau“ /
//                 „Papierecke am Schnittpunkt: passt nicht“ /
//                 „Papierecke: Es gibt keinen Schnittpunkt.“
//   _m5n-abstand  vorher „Abstand: noch nicht gemessen“, waehrend der
//                 Bewegung „Abstand: wird gemessen …“, danach
//                 „Abstand an zwei Stellen: 2 cm und 2 cm“ (nur bei
//                 „nebeneinander, schräg“), sonst „Abstand: g und h schneiden
//                 sich.“
// Farben verbinden Bild und Zeile: g blau und h orange in beiden; „passt
// genau“ gruen wie der Rand, „passt nicht“ orange wie der Keil.
//
// Werte (jede Sprungmarke nachgerechnet mit simcheck/werte.js, Bewegungen
// ausgelaufen; alles aus _m5nRechne(), dieselbe Rechnung wie das Bild):
//   Kreuz, gerade          schneiden ja   · passt genau  · g und h schneiden sich
//   Kreuz, schräg          schneiden ja   · passt genau  · g und h schneiden sich
//   schräg geschnitten     schneiden ja   · passt nicht (Winkel 60°, Keil 30°)
//                                         · g und h schneiden sich
//   nebeneinander, schräg  schneiden nein · keinen Schnittpunkt · 2 cm und 2 cm
// Gemessen (Frames zu 16 ms): Drehen 50 Frames, Papierecke 86 Frames (mit
// Pruefen) bzw. 114 Frames (mit Suchen), Abstand 69 Frames (zwei Messpfeile)
// bzw. 85 Frames (rutschender Messpfeil) – alles
// unter den 125 Frames, die simfakten.js mit --frames=25 --verlauf=4 liest.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): „Kreuz, schräg“ und
// „Papierecke anlegen“ – sobald die Ecke liegt und genau passt, laeuft ein
// goldener Lichtring um die Ecke, und sie leuchtet 2,5 s nach (0,8 Hz). Das
// widerlegt Vermutung 1 („senkrecht heißt von oben nach unten“): Keine der
// beiden Geraden geht von oben nach unten, und die Ecke passt trotzdem.
//
// NICHT am Bildschirm (sim_plan.nicht_am_bildschirm): „senkrecht“,
// „parallel“, „gleich“ (auch nicht in „vergleichen“ o. Ae.) – die Kinder
// entscheiden selbst, welches Wort zur Lage passt. Keine Regel als Satz, kein
// Winkel in Grad. Keine Namen, keine Punkte, keine Zeit. Deterministisch,
// ohne Zufall: jede Zahl und jede Lage im Bild kommt aus _m5nLAGEN.
// ════════════════════════════════════════════════════════════════════════
let _m5n = null;
const _m5nLAGEN = {                       // [Winkel in Grad, Abstand von der Mitte in px]
  a: { name: 'Kreuz, gerade',         g: [0, 0],  h: [90, 0] },
  b: { name: 'Kreuz, schräg',         g: [30, 0], h: [120, 0] },
  c: { name: 'schräg geschnitten',    g: [30, 0], h: [90, 0] },
  d: { name: 'nebeneinander, schräg', g: [30, 0], h: [30, 48] }
};
const _m5nREIHE = ['a', 'b', 'c', 'd'];
const _m5nK = {
  CX: 196, CY: 120,             // Mitte des Bilds: hier schneiden sich g und h
  KAST: 12,                     // px je Kaestchen (0,5 cm)
  PX_CM: 24,                    // px je cm
  L: 84,                        // Kantenlaenge der Papierecke (px)
  MESS_T: [-112, 128],          // wo auf g gemessen wird (px von der Mitte, entlang g)
  RUTSCH_T0: -150,              // wo der rutschende Messpfeil auf g startet
  T_DREH: 0.8,                  // s: Geraden drehen sich in die neue Lage
  T_GLEIT: 0.9,                 // s: Papierecke gleitet herein
  T_PRUEF: 0.45,                // s: gruener Rand bzw. oranger Keil laeuft auf
  T_SUCH: 0.9,                  // s: Papierecke rutscht auf g hin und her
  T_PFEIL: 0.55,                // s: ein Messpfeil waechst
  T_VERSATZ: 0.3,               // s: der zweite Messpfeil startet spaeter
  T_ZAHL: 0.25,                 // s: Schild bzw. Ring springt auf
  T_RUTSCH: 1.1,                // s: Messpfeil rutscht zum Schnittpunkt
  LEUCHT: 2.5,                  // s: die Ecke leuchtet nach (Aha)
  F_G: '#2563eb', F_H: '#ea580c', F_GRUEN: '#16a34a', F_KEIL: '234,88,12',
  F_MESS: '#334155', F_KARO: '#d6e4f5', F_PAPIER: '#fdfdfb', F_PUNKT: '#1e293b'
};

// ── Geometrie: alles aus Winkel und Abstand einer Geraden ──────────────
// Richtung einer Geraden auf dem Bildschirm (y zeigt nach unten).
function _m5nRich(w) { const r = w * Math.PI / 180; return { x: Math.cos(r), y: -Math.sin(r) }; }
// Die Richtung rechtwinklig dazu (nach unten rechts bei 30°).
function _m5nNorm(w) { const r = w * Math.PI / 180; return { x: Math.sin(r), y: Math.cos(r) }; }
// Punkt einer Geraden l = [Winkel, Abstand] beim Parameter t (px entlang l).
function _m5nPunkt(l, t) {
  const K = _m5nK, u = _m5nRich(l[0]), n = _m5nNorm(l[0]);
  return { x: K.CX + t * u.x + l[1] * n.x, y: K.CY + t * u.y + l[1] * n.y };
}
// Schnittpunkt zweier Geraden, null wenn sie sich nicht schneiden.
function _m5nSchnitt(g, h) {
  const K = _m5nK, ng = _m5nNorm(g[0]), nh = _m5nNorm(h[0]);
  const det = ng.x * nh.y - ng.y * nh.x;
  if (Math.abs(det) < 1e-9) return null;
  return { x: K.CX + (g[1] * nh.y - ng.y * h[1]) / det,
           y: K.CY + (ng.x * h[1] - g[1] * nh.x) / det };
}
// Fusspunkt von p auf der Geraden l (rechtwinklig zu l) und der Abstand.
function _m5nLot(p, l) {
  const K = _m5nK, n = _m5nNorm(l[0]);
  const s = (p.x - K.CX) * n.x + (p.y - K.CY) * n.y - l[1];
  return { fuss: { x: p.x - s * n.x, y: p.y - s * n.y }, abst: Math.abs(s) };
}
// Die ganze Rechnung einer Lage – Bild und Statuszeilen lesen nur hier.
function _m5nRechne(k) {
  const L = _m5nLAGEN[k], K = _m5nK;
  const S = _m5nSchnitt(L.g, L.h);
  let winkel = ((L.h[0] - L.g[0]) % 180 + 180) % 180;      // 0 bis 180
  if (winkel > 90) winkel = 180 - winkel;                    // der kleinere Winkel
  return {
    name: L.name, g: L.g, h: L.h, S, schneiden: !!S, winkel,
    passt: !!S && Math.abs(winkel - 90) < 0.5,
    keil: S ? 90 - winkel : 0,                               // was die Papierecke frei laesst
    abstand: K.MESS_T.map(t => _m5nLot(_m5nPunkt(L.g, t), L.h).abst / K.PX_CM)
  };
}
// 2 -> "2 cm", 2.5 -> "2,5 cm" (geschuetztes Leerzeichen)
function _m5nCm(x) {
  return String(Math.round(x * 10) / 10).replace('.', ',') + ' cm';
}

function _m5nInit() {
  const L = _m5nLAGEN.a;
  _m5n = { lage: 'a', g: L.g.slice(), h: L.h.slice(), dreh: null, ecke: null, mess: null,
           leucht: 0, t: 0, fx: { teile: [] } };
}
function _m5nHTML() {
  const marke = k => `<button class="sim-btn" id="_m5n-b-${k}" onclick="_m5nLage('${k}')">${_m5nLAGEN[k].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie liegen die Geraden g und h zueinander?</h3>
    <div class="fpm-note" style="margin-top:2px">Die Geraden g (blau) und h (orange) gehen über das ganze Blatt. Die Papierecke ist die Ecke eines Blatts Papier.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5n-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5nREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_m5nEcke()">Papierecke anlegen</button>
          <button class="sim-btn" onclick="_m5nAbstand()">Abstand messen</button>
          <button class="sim-btn" onclick="_m5nNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5n-lage" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5n-schnitt" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5n-ecke" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5n-abstand" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">„Papierecke anlegen“ legt die Papierecke dorthin, wo sich g und h schneiden. „Abstand messen“ misst von g bis h.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Kreuz, gerade – noch keine Papierecke, noch nicht gemessen</p>
  </div>`;
}
function _m5nZeile(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}
function _m5nStatus() {
  if (!_m5n) return;
  const z = _m5n, K = _m5nK, r = _m5nRechne(z.lage);
  const b = (s, f) => '<b style="color:' + f + '">' + s + '</b>';
  const gh = b('g', K.F_G) + ' und ' + b('h', K.F_H);
  _m5nZeile('_m5n-lage', 'Lage: ' + r.name);
  _m5nZeile('_m5n-schnitt', 'Schneiden sich ' + gh + '? ' + (z.dreh ? '…' : (r.schneiden ? 'ja' : 'nein')));
  const e = z.ecke;
  _m5nZeile('_m5n-ecke', !e ? 'Papierecke: noch nicht angelegt'
    : e.phase !== 'liegt' ? 'Papierecke: wird angelegt …'
    : !r.schneiden ? 'Papierecke: Es gibt keinen Schnittpunkt.'
    : 'Papierecke am Schnittpunkt: ' + (r.passt ? b('passt genau', K.F_GRUEN) : b('passt nicht', K.F_H)));
  const m = z.mess;
  _m5nZeile('_m5n-abstand', !m ? 'Abstand: noch nicht gemessen'
    : !m.fertig ? 'Abstand: wird gemessen …'
    : r.schneiden ? 'Abstand: ' + gh + ' schneiden sich.'
    : 'Abstand an zwei Stellen: ' + r.abstand.map(a => b(_m5nCm(a), K.F_MESS)).join(' und '));
  for (const k of _m5nREIHE) {
    const el = document.getElementById('_m5n-b-' + k);
    if (el && el.classList) el.classList.toggle('primary', k === z.lage);
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Eine laufende Drehung steht sofort am Ziel.
function _m5nDrehFertig() {
  const z = _m5n;
  if (!z.dreh) return;
  z.g = z.dreh.nach.g.slice(); z.h = z.dreh.nach.h.slice();
  z.dreh = null;
}
// Die Papierecke liegt (Aha, wenn sie in „Kreuz, schräg“ genau passt).
function _m5nEckeLiegt() {
  const z = _m5n, e = z.ecke;
  if (!e || e.phase === 'liegt') return;
  const vorPruefen = e.phase === 'gleiten';
  e.phase = 'liegt'; e.t = 0;
  if (vorPruefen) _m5nAha();
}
function _m5nAha() {
  const z = _m5n, e = z.ecke;
  if (!e || !e.r.passt || z.lage !== 'b') return;
  z.leucht = _m5nK.LEUCHT;
  _bioFxWelle(z.fx.teile, e.r.S.x, e.r.S.y, '#f59e0b', 58);
}
function _m5nLage(k) {
  if (!_m5n || !_m5nLAGEN[k]) return;
  const z = _m5n, L = _m5nLAGEN[k];
  z.lage = k; z.ecke = null; z.mess = null; z.leucht = 0;
  const da = (a, c) => Math.abs(a[0] - c[0]) < 1e-9 && Math.abs(a[1] - c[1]) < 1e-9;
  z.dreh = (da(z.g, L.g) && da(z.h, L.h)) ? null
         : { von: { g: z.g.slice(), h: z.h.slice() }, nach: { g: L.g.slice(), h: L.h.slice() }, t: 0 };
  _m5nStatus();
}
function _m5nEcke() {
  if (!_m5n) return;
  const z = _m5n;
  _m5nDrehFertig();
  if (z.mess) { z.mess.fertig = true; z.mess.t = z.mess.dauer; }
  z.leucht = 0;
  z.ecke = { phase: 'gleiten', t: 0, r: _m5nRechne(z.lage) };
  _m5nStatus();
}
function _m5nAbstand() {
  if (!_m5n) return;
  const z = _m5n, K = _m5nK;
  _m5nDrehFertig();
  _m5nEckeLiegt();
  const r = _m5nRechne(z.lage);
  z.mess = { t: 0, fertig: false, r,
             dauer: r.schneiden ? K.T_RUTSCH + K.T_ZAHL : K.T_VERSATZ + K.T_PFEIL + K.T_ZAHL };
  _m5nStatus();
}
function _m5nNeu() {
  if (!_m5n) return;
  _m5nLage('a');
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5nUpdate(dt) {
  if (!_m5n) return;
  dt = _bioFxDt(dt);
  const z = _m5n, K = _m5nK;
  z.t += dt;
  let neu = false;
  if (z.dreh) {
    const d = z.dreh;
    d.t += dt;
    const u = Math.min(1, d.t / K.T_DREH), e = _bioFxEase.sanft(u);
    const misch = (a, c) => [a[0] + (c[0] - a[0]) * e, a[1] + (c[1] - a[1]) * e];
    z.g = misch(d.von.g, d.nach.g); z.h = misch(d.von.h, d.nach.h);
    if (u >= 1) { _m5nDrehFertig(); neu = true; }
  }
  const e = z.ecke;
  if (e) {
    e.t += dt;
    if (e.phase === 'gleiten' && e.t >= K.T_GLEIT) {
      e.phase = e.r.schneiden ? 'pruefen' : 'suchen'; e.t = 0;
      if (e.phase === 'pruefen') _m5nAha();
    } else if (e.phase === 'pruefen' && e.t >= K.T_PRUEF) {
      e.phase = 'liegt'; e.t = 0; neu = true;
    } else if (e.phase === 'suchen' && e.t >= K.T_SUCH) {
      e.phase = 'liegt'; e.t = 0; neu = true;
    }
  }
  const m = z.mess;
  if (m && !m.fertig) {
    m.t += dt;
    if (m.t >= m.dauer) { m.fertig = true; m.t = m.dauer; neu = true; }
  }
  if (z.leucht > 0) z.leucht = Math.max(0, z.leucht - dt);
  _bioFxUpdate(z.fx.teile, dt);
  if (neu) _m5nStatus();
}

// ── Zeichnen ────────────────────────────────────────────────────────────
// Das Stueck einer Geraden, das im Bild liegt (von -u nach +u).
function _m5nKappen(l, W, H) {
  const a = _m5nPunkt(l, -1200), c = _m5nPunkt(l, 1200);
  const dx = c.x - a.x, dy = c.y - a.y;
  const p = [-dx, dx, -dy, dy], q = [a.x, W - a.x, a.y, H - a.y];
  let t0 = 0, t1 = 1;
  for (let i = 0; i < 4; i++) {
    if (Math.abs(p[i]) < 1e-12) { if (q[i] < 0) return null; continue; }
    const r = q[i] / p[i];
    if (p[i] < 0) { if (r > t1) return null; if (r > t0) t0 = r; }
    else { if (r < t0) return null; if (r < t1) t1 = r; }
  }
  return [{ x: a.x + t0 * dx, y: a.y + t0 * dy }, { x: a.x + t1 * dx, y: a.y + t1 * dy }];
}
function _m5nText(ctx, s, x, y, farbe, groesse, ausr) {
  ctx.save();
  ctx.font = '700 ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center'; ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5;
  ctx.strokeText(s, x, y);
  ctx.fillStyle = farbe;
  ctx.fillText(s, x, y);
  ctx.restore();
}
// Eine Gerade ueber das ganze Bild, mit ihrem Namen am Ende in Richtung +u.
// seite: auf welcher Seite der Name steht (-1 oder +1, entlang der Normalen).
// Beide Namen stehen auf der Seite +1 (unter g bzw. rechts von h): Bei 30°
// laeuft g oben rechts aus dem Bild, ueber der Linie waere dort kein Platz.
function _m5nGerade(ctx, l, farbe, name, seite, W, H) {
  const s = _m5nKappen(l, W, H);
  if (!s) return;
  ctx.save();
  ctx.strokeStyle = farbe; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(s[0].x, s[0].y); ctx.lineTo(s[1].x, s[1].y); ctx.stroke();
  ctx.restore();
  const u = _m5nRich(l[0]), n = _m5nNorm(l[0]);
  let x = s[1].x - u.x * 24 + seite * n.x * 17, y = s[1].y - u.y * 24 + seite * n.y * 17 + 6;
  x = Math.max(12, Math.min(W - 12, x)); y = Math.max(20, Math.min(H - 8, y));
  _m5nText(ctx, name, x, y, farbe, 19);
}
// Punkt der Papierecke: lokale Koordinaten (entlang Kante 1, entlang Kante 2).
function _m5nEckPunkt(V, phi, a, c) {
  const e1 = _m5nRich(phi), e2 = _m5nRich(phi - 90);
  return { x: V.x + a * e1.x + c * e2.x, y: V.y + a * e1.y + c * e2.y };
}
// Umriss der Papierecke: zwei gerade Kanten, die dritte abgerissen (fest
// gezackt, ohne Zufall).
function _m5nUmriss(ctx, V, phi, L) {
  ctx.beginPath();
  let p = _m5nEckPunkt(V, phi, 0, 0); ctx.moveTo(p.x, p.y);
  p = _m5nEckPunkt(V, phi, L, 0); ctx.lineTo(p.x, p.y);
  for (let k = 1; k < 18; k++) {
    const w = k / 18 * Math.PI / 2, r = L + [2, -1, 1, -2, 0, 2][k % 6];
    p = _m5nEckPunkt(V, phi, r * Math.cos(w), r * Math.sin(w)); ctx.lineTo(p.x, p.y);
  }
  p = _m5nEckPunkt(V, phi, 0, L); ctx.lineTo(p.x, p.y);
  ctx.closePath();
}
// Lage der Papierecke im Augenblick: Ecke V, Richtung der Kante 1, Anheben.
function _m5nEckLage(e) {
  const K = _m5nK, r = e.r;
  const ziel = r.S || _m5nPunkt(r.g, 0), phi = r.g[0];
  if (e.phase === 'gleiten') {
    const u = _bioFxEase.sanft(Math.min(1, e.t / K.T_GLEIT));
    const von = { x: 470, y: 300 }, phi0 = phi - 40;
    return { V: { x: von.x + (ziel.x - von.x) * u, y: von.y + (ziel.y - von.y) * u },
             phi: phi0 + (phi - phi0) * u, hub: 1 - u };
  }
  if (e.phase === 'suchen') {
    const s = 30 * Math.sin(2 * Math.PI * Math.min(1, e.t / K.T_SUCH)), d = _m5nRich(phi);
    return { V: { x: ziel.x + s * d.x, y: ziel.y + s * d.y }, phi, hub: 0 };
  }
  return { V: ziel, phi, hub: 0 };
}
// Der freie Keil zwischen der zweiten Kante und h (nur wenn sie nicht passt).
function _m5nKeil(ctx, e) {
  const K = _m5nK, r = e.r;
  if (!r.schneiden || r.passt || e.phase === 'gleiten') return;
  const a = e.phase === 'pruefen' ? _bioFxEase.raus(Math.min(1, e.t / K.T_PRUEF)) : 1;
  // Kante 2 zeigt in Richtung g - 90°; h liegt r.keil Grad weiter im Uhrzeigersinn.
  const w2 = -(r.g[0] - 90) * Math.PI / 180;              // Bildschirmwinkel der Kante 2
  const wh = w2 + r.keil * Math.PI / 180 * a;
  const R = K.L * 1.05;
  ctx.save();
  ctx.fillStyle = 'rgba(' + K.F_KEIL + ',0.38)';
  ctx.beginPath(); ctx.moveTo(r.S.x, r.S.y); ctx.arc(r.S.x, r.S.y, R, w2, wh, false); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(' + K.F_KEIL + ',0.9)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(r.S.x, r.S.y, R, w2, wh, false); ctx.stroke();
  ctx.restore();
}
function _m5nPapierecke(ctx, e) {
  const K = _m5nK, r = e.r, p = _m5nEckLage(e), L = K.L;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,' + (0.16 + 0.08 * p.hub).toFixed(3) + ')';   // Schatten
  _m5nUmriss(ctx, { x: p.V.x + 3 + 6 * p.hub, y: p.V.y + 4 + 8 * p.hub }, p.phi, L); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.93)';
  _m5nUmriss(ctx, p.V, p.phi, L); ctx.fill();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
  _m5nUmriss(ctx, p.V, p.phi, L); ctx.stroke();
  // passt genau: innen an beiden geraden Kanten laeuft ein gruener Rand auf
  if (r.passt && e.phase !== 'gleiten') {
    const a = e.phase === 'pruefen' ? _bioFxEase.raus(Math.min(1, e.t / K.T_PRUEF)) : 1;
    const q0 = _m5nEckPunkt(p.V, p.phi, 4, 4);
    const q1 = _m5nEckPunkt(p.V, p.phi, 4 + (L - 10) * a, 4);
    const q2 = _m5nEckPunkt(p.V, p.phi, 4, 4 + (L - 10) * a);
    ctx.strokeStyle = K.F_GRUEN; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q0.x, q0.y); ctx.lineTo(q2.x, q2.y); ctx.stroke();
  }
  ctx.restore();
}
// Doppelpfeil von a nach c.
function _m5nPfeil(ctx, a, c, farbe) {
  const dx = c.x - a.x, dy = c.y - a.y, l = Math.hypot(dx, dy);
  if (l < 1) return;
  const ux = dx / l, uy = dy / l, px = -uy, py = ux, sp = Math.min(8, l / 2.5);
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
  ctx.strokeStyle = farbe; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
  ctx.fillStyle = farbe;
  for (const [s, e, v] of [[a, 1, 1], [c, -1, 1]]) {
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x + e * ux * sp * 1.4 + px * sp * 0.7 * v, s.y + e * uy * sp * 1.4 + py * sp * 0.7 * v);
    ctx.lineTo(s.x + e * ux * sp * 1.4 - px * sp * 0.7 * v, s.y + e * uy * sp * 1.4 - py * sp * 0.7 * v);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
// Schild mit einer Zahl (springt auf, sk 0..1).
function _m5nSchild(ctx, s, x, y, sk, W, H) {
  if (sk <= 0.01) return;
  ctx.save();
  ctx.font = '700 15px sans-serif';
  const bw = ctx.measureText(s).width + 16, bh = 23;
  x = Math.max(bw / 2 + 3, Math.min(W - bw / 2 - 3, x));
  y = Math.max(bh / 2 + 3, Math.min(H - bh / 2 - 3, y));
  ctx.translate(x, y); ctx.scale(sk, sk);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = _m5nK.F_MESS; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, -bw / 2, -bh / 2, bw, bh, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = _m5nK.F_MESS; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, 0, 5.5);
  ctx.restore();
}
function _m5nMessen(ctx, m, W, H) {
  const K = _m5nK, r = m.r;
  if (!r.schneiden) {
    // zwei Messpfeile wachsen von g bis h, dahinter je ein Schild
    K.MESS_T.forEach((t, i) => {
      const s = m.t - i * K.T_VERSATZ;
      if (s <= 0) return;
      const P = _m5nPunkt(r.g, t), lot = _m5nLot(P, r.h);
      const u = _bioFxEase.sanft(Math.min(1, s / K.T_PFEIL));
      const F = { x: P.x + (lot.fuss.x - P.x) * u, y: P.y + (lot.fuss.y - P.y) * u };
      _m5nPfeil(ctx, P, F, K.F_MESS);
      const sz = (s - K.T_PFEIL) / K.T_ZAHL;
      if (sz > 0) {
        const n = _m5nNorm(r.h[0]);
        _m5nSchild(ctx, _m5nCm(r.abstand[i]), lot.fuss.x + n.x * 22, lot.fuss.y + n.y * 22,
                   _bioFxEase.federn(Math.min(1, sz)), W, H);
      }
    });
    return;
  }
  // g und h schneiden sich: der Messpfeil rutscht auf g bis zum Schnittpunkt
  const u = _bioFxEase.sanft(Math.min(1, m.t / K.T_RUTSCH));
  const P = _m5nPunkt(r.g, K.RUTSCH_T0 * (1 - u)), lot = _m5nLot(P, r.h);
  if (lot.abst > 2) _m5nPfeil(ctx, P, lot.fuss, K.F_MESS);
  const sz = (m.t - K.T_RUTSCH) / K.T_ZAHL;
  if (sz > 0) {
    const rr = 11 * Math.max(0.05, _bioFxEase.federn(Math.min(1, sz)));
    ctx.save();
    ctx.strokeStyle = K.F_MESS; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(r.S.x, r.S.y, rr, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}
function _m5nDraw(ctx, cv) {
  if (!_m5n) return;
  const W = cv.width, H = cv.height, z = _m5n, K = _m5nK;
  ctx.clearRect(0, 0, W, H);
  // Karopapier: Kaestchen 0,5 cm, ein Gitterpunkt liegt in der Bildmitte
  ctx.fillStyle = K.F_PAPIER; ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = K.CX % K.KAST; x <= W; x += K.KAST) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
  for (let y = K.CY % K.KAST; y <= H; y += K.KAST) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
  ctx.stroke();
  ctx.restore();
  const e = z.ecke, m = z.mess;
  if (e) _m5nKeil(ctx, e);
  // die beiden Geraden
  _m5nGerade(ctx, z.h, K.F_H, 'h', 1, W, H);
  _m5nGerade(ctx, z.g, K.F_G, 'g', 1, W, H);
  const S = _m5nSchnitt(z.g, z.h);
  if (S && S.x > -20 && S.x < W + 20 && S.y > -20 && S.y < H + 20) {
    ctx.save();
    ctx.fillStyle = K.F_PUNKT; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(S.x, S.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  if (e) {
    if (z.leucht > 0 && e.r.S) {                           // Aha: die Ecke leuchtet nach
      ctx.save();
      ctx.globalAlpha = Math.min(1, z.leucht / 0.8);
      _bioFxLeuchten(ctx, e.r.S.x, e.r.S.y, 18, z.t, '252,211,77');
      ctx.restore();
    }
    _m5nPapierecke(ctx, e);
  }
  _bioFxDraw(ctx, z.fx.teile);                             // Lichtring
  if (m) _m5nMessen(ctx, m, W, H);
}
