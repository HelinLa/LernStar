
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mp6 „Was fällt an der Zahlenmauer auf?“
// (Kennung m5-zahlenmauer). Bauplan: arbeitsheft_mathe_foe5/KAPITEL2_PROFIL.md,
// Abschnitt m5-zahlenmauer. Ueberschrift = Frage der Einheit:
// „Um wie viel wächst der Deckstein, wenn ein Grundstein um 1 wächst?“
//
// Was man sieht: eine Zahlenmauer aus drei Reihen Ziegeln auf einer
// Bodenlinie – unten 3 Grundsteine (orange), darueber 2 Mittelsteine (hell),
// oben der Deckstein (gold, dicker Rand). In jedem Ziegel steht seine Zahl
// gross; jeder Stein ist die Summe der beiden Steine darunter. Rechts neben
// der Mauer stehen die Woerter „Deckstein“ und „Grundsteine“ an ihrer Reihe.
// Wird ein Grundstein um 1 groesser, springt seine Zahl hoch und er leuchtet
// kurz. Aus ihm steigt eine goldene Kugel mit der Aufschrift „+ 1“ in jeden
// Mittelstein, in dem er steckt (0,55 s), haelt dort kurz an (0,1 s) – der
// Mittelstein waechst um 1 und leuchtet – und steigt weiter in den Deckstein
// (0,55 s), der dann um 1 waechst und leuchtet. Danach rueckt die Kugel auf
// den Deckstein (0,3 s) und bleibt dort liegen bis zur naechsten Handlung.
// Jede Kugel zieht eine goldene Spur hinter sich her, die stehen bleibt: ein
// Pfeil von Zahl zu Zahl (er haelt von den Zahlen Abstand). Man sieht danach
// den Weg, auf dem der Grundstein gewirkt hat.
//   linker Grundstein   EIN Weg: linker Mittelstein -> Deckstein
//   rechter Grundstein  EIN Weg: rechter Mittelstein -> Deckstein
//   mittlerer           ZWEI Wege, die zweite Kugel startet 0,25 s spaeter:
//                       ueber den linken UND ueber den rechten Mittelstein.
//                       Am Deckstein kommen zwei Kugeln an, er zaehlt 16, dann
//                       17; oben liegen danach zwei Kugeln „+ 1“ nebeneinander,
//                       und die vier Pfeile bilden eine Raute.
// Die Zahlen in den Ziegeln haben einen weissen Rand und liegen ueber allem:
// Kugeln und Lichtring laufen hinter ihnen durch und verdecken sie nie – man
// sieht die Zahl genau in dem Augenblick wachsen, in dem die Kugel ankommt.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5lMarke('5-3-4') usw.):
//     „5, 3, 4“ (Start) · „6, 3, 4“ · „5, 4, 4“ · „5, 3, 5“
//   Reihe 2: „+ 1 links“ · „+ 1 Mitte“ · „+ 1 rechts“ (_m5lPlus(0|1|2)) ·
//            „neu“ (_m5lNeu())
// Eine Sprungmarke stellt die Mauer zuerst auf den Start 5, 3, 4 zurueck
// (die Mauer blinkt kurz hell, 0,25 s; steht sie schon dort, entfaellt das)
// und macht dann den Grundstein, der sich vom Start unterscheidet, um 1
// groesser – mit Kugeln wie oben. So zeigt jede Sprungmarke genau ihren
// Unterschied zum Start. „5, 3, 4“ und „neu“ stellen nur den Start her.
// „+ 1 …“ macht den Stein um 1 groesser, ausgehend von der Mauer, wie sie
// gerade steht (freies Probieren); der Knopf der Sprungmarke, deren Zahlen
// gerade unten stehen, ist hervorgehoben. Ein Grundstein geht bis 99, danach
// wackelt er nur. Wer waehrend der Bewegung einen Knopf drueckt, laesst alle
// Kugeln sofort ankommen; dann geschieht das Neue. Jede Knopffolge ergibt so
// dieselben Zahlen.
//
// Statuszeilen (woertlich). Sie folgen den Kugeln: Der Deckstein in der
// Anzeige waechst erst, wenn eine Kugel bei ihm ankommt – Bild und Zahl
// stimmen in jedem Augenblick ueberein. Die Zahlen tragen die Farbe ihres
// Ziegels; der Unterschied traegt das Gold der Kugeln.
//   _m5l-grund        „Grundsteine: 5, 3, 4“
//   _m5l-deck         „Oberster Stein (Deckstein): 15“
//   _m5l-start        „Deckstein beim Start 5, 3, 4: 15“ (steht immer da)
//   _m5l-unterschied  „Unterschied zum Start: 0“, sonst z. B. „Unterschied
//                     zum Start: + 2“ (zwischen + und Zahl U+00A0)
// Alle vier Zeilen haben mehr als 18 Zeichen (simfakten.js-Grenze).
//
// Werte (Grundsteine -> Mittelsteine -> Deckstein · Unterschied zum Start),
// jede Sprungmarke nachgerechnet mit simcheck/werte.js:
//   5, 3, 4 -> 8, 7 -> 15 · 0
//   6, 3, 4 -> 9, 7 -> 16 · + 1   (eine Kugel kommt oben an)
//   5, 4, 4 -> 9, 8 -> 17 · + 2   (zwei Kugeln kommen oben an)
//   5, 3, 5 -> 8, 8 -> 16 · + 1   (eine Kugel kommt oben an)
// Gemessen (Frames zu 16 ms, simcheck-Treiber): Ein aeusserer Grundstein ist
// vom Start aus nach rund 1,25 s fertig (78 Frames), der mittlere nach rund
// 1,5 s (93 Frames). Steht die Mauer nicht am Start, kommt bei einer
// Sprungmarke der Ruecksprung dazu: hoechstens rund 1,75 s (108 Frames).
// simfakten.js mit --frames=25 --verlauf=4 liest bis 125 Frames – jeder
// Endwert steht also im Faktendump.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Kommt die ZWEITE Kugel des
// mittleren Grundsteins am Deckstein an („5, 4, 4“ oder „+ 1 Mitte“), laeuft
// ein goldener Lichtring um den Deckstein, und er leuchtet laenger nach. Das
// widerlegt Vermutung 2 („Der Deckstein wächst immer um 1.“). Jedes Mal, wenn
// der mittlere Grundstein waechst.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „doppelt“, „zweimal“,
// „genauso“ – und ueberhaupt keine Regel als Satz: Die Seite benennt sie erst
// im Merksatz. Die Kugeln und die Zahlen zeigen es, kein Wort sagt es.
// Keine Namen, keine Punkte, keine Zeit. Deterministisch, ohne Zufall: jede
// Zahl im Bild kommt aus denselben Feldern wie die Statuszeilen.
// ════════════════════════════════════════════════════════════════════════
let _m5l = null;
const _m5lSTART = [5, 3, 4];
const _m5lMARKEN = {                                    // Grundsteine links, Mitte, rechts
  '5-3-4': [5, 3, 4], '6-3-4': [6, 3, 4], '5-4-4': [5, 4, 4], '5-3-5': [5, 3, 5]
};
const _m5lPLUS = ['links', 'Mitte', 'rechts'];
const _m5lK = {
  BW: 96, BH: 48, FUGE: 6,      // Ziegel: Breite, Hoehe, Fuge (px)
  MX: 170,                      // Mitte der Mauer; rechts bleibt Platz fuer die Woerter
  YG: 186, YM: 132, YD: 78,     // Oberkante der Reihen: Grund-, Mittel-, Deckstein
  BODEN: 237,                   // Bodenlinie unter der Mauer
  R: 13,                        // Radius der Kugel
  T_HOCH: 0.55,                 // s: Kugel steigt eine Reihe
  T_HALT: 0.1,                  // s: Kugel haelt im Mittelstein
  T_VERSATZ: 0.25,              // s: zweite Kugel des mittleren Steins startet spaeter
  T_PARK: 0.3,                  // s: Kugel rueckt auf den Deckstein
  T_ZURUECK: 0.25,              // s: Mauer springt auf den Start zurueck
  T_POP: 0.35,                  // s: Zahl springt hoch
  MAX: 99,                      // groesster Grundstein
  F_G: { fuell: '#fed7aa', licht: '#ffedd5', rand: '#c2410c', wort: '#9a3412' },
  F_M: { fuell: '#ffe9d4', licht: '#fff6ec', rand: '#c2410c' },
  F_D: { fuell: '#fde68a', licht: '#fef3c7', rand: '#b45309', wort: '#92400e' },
  F_ZAHL: '#1f2937',
  F_SPUR: 'rgba(217,119,6,0.6)',
  F_KUGEL: '#fbbf24', F_KRAND: '#b45309', F_KTEXT: '#78350f'
};

// 1234 -> "1 234" mit geschuetztem Leerzeichen (im Heft normales Leerzeichen)
function _m5lFmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
function _m5lPosG(i) { const K = _m5lK; return { x: K.MX + (i - 1) * (K.BW + K.FUGE), y: K.YG + K.BH / 2 }; }
function _m5lPosM(j) { const K = _m5lK; return { x: K.MX + (j - 0.5) * (K.BW + K.FUGE), y: K.YM + K.BH / 2 }; }
function _m5lPosD() { const K = _m5lK; return { x: K.MX, y: K.YD + K.BH / 2 }; }
// Deckstein einer Mauer mit den Grundsteinen g
function _m5lDeck(g) { return (g[0] + g[1]) + (g[1] + g[2]); }
// Mittel- und Deckstein aus den Grundsteinen neu rechnen (nur beim Zuruecksetzen;
// sonst wachsen sie mit den Kugeln)
function _m5lRechne() {
  const z = _m5l;
  z.m = [z.g[0] + z.g[1], z.g[1] + z.g[2]];
  z.d = z.m[0] + z.m[1];
}

function _m5lInit() {
  _m5l = { g: _m5lSTART.slice(), m: [0, 0], d: 0, kugeln: [], plan: [],
           glanz: { g: [0, 0, 0], m: [0, 0], d: 0 }, pop: { g: [0, 0, 0], m: [0, 0], d: 0 },
           wackel: [0, 0, 0], zurueck: 0, t: 0, fx: { teile: [] } };
  _m5lRechne();
}
function _m5lHTML() {
  const marke = k => `<button class="sim-btn" id="_m5l-b-${k}" onclick="_m5lMarke('${k}')">${_m5lMARKEN[k].join(', ')}</button>`;
  const plus = i => `<button class="sim-btn" onclick="_m5lPlus(${i})">+&nbsp;1 ${_m5lPLUS[i]}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Um wie viel wächst der Deckstein, wenn ein Grundstein um 1 wächst?</h3>
    <div class="fpm-note" style="margin-top:2px">Jeder Stein ist die Summe der beiden Steine darunter. Die Kugeln „+&nbsp;1“ zeigen, welche Steine mitwachsen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5l-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${Object.keys(_m5lMARKEN).map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          ${[0, 1, 2].map(plus).join('\n          ')}
          <button class="sim-btn" onclick="_m5lNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5l-grund" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5l-deck" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5l-start" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5l-unterschied" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">Mit „+&nbsp;1 links“, „+&nbsp;1 Mitte“ und „+&nbsp;1 rechts“ wird ein Grundstein um 1 größer.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Grundsteine 5, 3, 4 – Deckstein 15</p>
  </div>`;
}
function _m5lZeile(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}
// Die Grundsteine, wie sie nach allen geplanten Schritten stehen.
function _m5lZiel() {
  const g = _m5l.g.slice();
  for (const p of _m5l.plan) g[p.i] += 1;
  return g;
}
function _m5lStatus() {
  if (!_m5l) return;
  const z = _m5l, K = _m5lK;
  const b = (s, f) => '<b style="color:' + f + '">' + s + '</b>';
  _m5lZeile('_m5l-grund', 'Grundsteine: ' + z.g.map(n => b(_m5lFmt(n), K.F_G.wort)).join(', '));
  _m5lZeile('_m5l-deck', 'Oberster Stein (Deckstein): ' + b(_m5lFmt(z.d), K.F_D.wort));
  const s = _m5lDeck(_m5lSTART), u = z.d - s;
  _m5lZeile('_m5l-start', 'Deckstein beim Start ' + _m5lSTART.join(', ') + ': ' + _m5lFmt(s));
  _m5lZeile('_m5l-unterschied', 'Unterschied zum Start: ' +
            (u === 0 ? '0' : b((u > 0 ? '+' : '−') + ' ' + _m5lFmt(Math.abs(u)), K.F_KRAND)));
  const ziel = _m5lZiel();
  for (const k of Object.keys(_m5lMARKEN)) {
    const e = document.getElementById('_m5l-b-' + k);
    if (e && e.classList) e.classList.toggle('primary', _m5lMARKEN[k].every((n, i) => n === ziel[i]));
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Grundstein i waechst um 1; seine Kugeln machen sich auf den Weg.
function _m5lWachse(i) {
  const z = _m5l, K = _m5lK;
  z.g[i] += 1;
  z.glanz.g[i] = 0.9; z.pop.g[i] = K.T_POP;
  const wege = i === 0 ? [0] : i === 2 ? [1] : [0, 1];   // in welchen Mittelstein
  wege.forEach((j, n) => z.kugeln.push({ i, j, phase: 'warten', t: 0, verz: n * K.T_VERSATZ, oben: false }));
}
// Faellige geplante Schritte ausfuehren (eine Sprungmarke wartet erst den
// Ruecksprung ab).
function _m5lPlanen(dt) {
  const z = _m5l;
  for (const p of z.plan) p.verz -= dt;
  let neu = false;
  while (z.plan.length && z.plan[0].verz <= 1e-9) { _m5lWachse(z.plan.shift().i); neu = true; }
  if (neu) _m5lStatus();
}
// Alles Laufende sofort ankommen lassen (vor jeder neuen Bedienung).
function _m5lFertig() {
  const z = _m5l;
  while (z.plan.length) _m5lWachse(z.plan.shift().i);
  for (const k of z.kugeln) {
    if (k.phase === 'liegt') continue;
    if (k.phase === 'warten' || k.phase === 'hoch1') z.m[k.j] += 1;
    if (k.phase !== 'park') z.d += 1;
    k.phase = 'liegt'; k.t = 0; k.oben = true;
  }
  z.zurueck = 0;
  _m5lStatus();
}
// Zurueck auf den Start 5, 3, 4; gibt zurueck, ob die Mauer dafuer springen musste.
function _m5lZumStart() {
  const z = _m5l;
  z.kugeln = [];
  if (z.g.every((n, i) => n === _m5lSTART[i])) return false;
  z.g = _m5lSTART.slice(); _m5lRechne();
  z.zurueck = _m5lK.T_ZURUECK;
  return true;
}
function _m5lMarke(k) {
  if (!_m5l || !_m5lMARKEN[k]) return;
  _m5lFertig();
  const z = _m5l, K = _m5lK, ziel = _m5lMARKEN[k];
  let verz = _m5lZumStart() ? K.T_ZURUECK : 0;
  for (let i = 0; i < 3; i++)
    for (let n = _m5lSTART[i]; n < ziel[i]; n++) { z.plan.push({ i, verz }); verz += 0.8; }
  _m5lPlanen(0);
  _m5lStatus();
}
function _m5lPlus(i) {
  if (!_m5l || !(i === 0 || i === 1 || i === 2)) return;
  _m5lFertig();
  const z = _m5l;
  if (z.g[i] >= _m5lK.MAX) { z.wackel[i] = 0.45; return; }
  z.kugeln = [];
  _m5lWachse(i);
  _m5lStatus();
}
function _m5lNeu() {
  if (!_m5l) return;
  _m5lFertig();
  _m5lZumStart();
  _m5lStatus();
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5lUpdate(dt) {
  if (!_m5l) return;
  dt = _bioFxDt(dt);
  const z = _m5l, K = _m5lK;
  z.t += dt;
  if (z.plan.length) _m5lPlanen(dt);
  let neu = false;
  for (const k of z.kugeln) {
    if (k.phase === 'liegt') continue;
    k.t += dt;
    if (k.phase === 'warten' && k.t >= k.verz) { k.phase = 'hoch1'; k.t = 0; }
    else if (k.phase === 'hoch1' && k.t >= K.T_HOCH) {
      k.phase = 'halt'; k.t = 0;
      z.m[k.j] += 1; z.glanz.m[k.j] = 0.9; z.pop.m[k.j] = K.T_POP; neu = true;
    } else if (k.phase === 'halt' && k.t >= K.T_HALT) { k.phase = 'hoch2'; k.t = 0; }
    else if (k.phase === 'hoch2' && k.t >= K.T_HOCH) {
      k.phase = 'park'; k.t = 0; k.oben = true;
      z.d += 1; z.glanz.d = 0.9; z.pop.d = K.T_POP; neu = true;
      // Aha: die zweite Kugel des mittleren Grundsteins ist oben angekommen.
      const mitte = z.kugeln.filter(q => q.i === 1);
      if (k.i === 1 && mitte.length >= 2 && mitte.every(q => q.oben)) {
        const p = _m5lPosD();
        _bioFxWelle(z.fx.teile, p.x, p.y, '#f59e0b', 60);
        z.glanz.d = 2.4;
      }
    } else if (k.phase === 'park' && k.t >= K.T_PARK) { k.phase = 'liegt'; k.t = 0; }
  }
  for (let i = 0; i < 3; i++) {
    z.glanz.g[i] = Math.max(0, z.glanz.g[i] - dt);
    z.pop.g[i] = Math.max(0, z.pop.g[i] - dt);
    z.wackel[i] = Math.max(0, z.wackel[i] - dt);
  }
  for (let j = 0; j < 2; j++) {
    z.glanz.m[j] = Math.max(0, z.glanz.m[j] - dt);
    z.pop.m[j] = Math.max(0, z.pop.m[j] - dt);
  }
  z.glanz.d = Math.max(0, z.glanz.d - dt);
  z.pop.d = Math.max(0, z.pop.d - dt);
  z.zurueck = Math.max(0, z.zurueck - dt);
  _bioFxUpdate(z.fx.teile, dt);
  if (neu) _m5lStatus();
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5lMisch(a, b, u) { return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
// Wo die k-te von n Kugeln auf dem Deckstein liegt.
function _m5lPlatz(k, n) {
  const K = _m5lK;
  return { x: K.MX + (k - (n - 1) / 2) * (2 * K.R + 6), y: K.YD - K.R - 5 };
}
// Ort der Kugel und die Strecken ihrer Spur: [von, nach, wie weit 0..1].
function _m5lWeg(k, idx, n) {
  const K = _m5lK, a = _m5lPosG(k.i), b = _m5lPosM(k.j), c = _m5lPosD();
  if (k.phase === 'warten') return { ort: null, spur: [] };
  if (k.phase === 'hoch1') {
    const u = _bioFxEase.sanft(Math.min(1, k.t / K.T_HOCH));
    return { ort: _m5lMisch(a, b, u), spur: [[a, b, u]] };
  }
  if (k.phase === 'halt') return { ort: b, spur: [[a, b, 1]] };
  if (k.phase === 'hoch2') {
    const u = _bioFxEase.sanft(Math.min(1, k.t / K.T_HOCH));
    return { ort: _m5lMisch(b, c, u), spur: [[a, b, 1], [b, c, u]] };
  }
  const ziel = _m5lPlatz(idx, n);
  const p = k.phase === 'park' ? _m5lMisch(c, ziel, _bioFxEase.sanft(Math.min(1, k.t / K.T_PARK))) : ziel;
  return { ort: p, spur: [[a, b, 1], [b, c, 1]] };
}
function _m5lZiegel(ctx, p, F, glanz, dx, dick) {
  const K = _m5lK, x = p.x - K.BW / 2 + (dx || 0), y = p.y - K.BH / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.10)';                   // Schatten
  _bioFxRundRect(ctx, x + 2, y + 3, K.BW, K.BH, 6); ctx.fill();
  ctx.fillStyle = F.fuell;
  _bioFxRundRect(ctx, x, y, K.BW, K.BH, 6); ctx.fill();
  ctx.fillStyle = F.licht;                                  // helle Kante oben
  _bioFxRundRect(ctx, x + 5, y + 4, K.BW - 10, 6, 3); ctx.fill();
  ctx.strokeStyle = F.rand; ctx.lineWidth = dick ? 3 : 2;
  _bioFxRundRect(ctx, x, y, K.BW, K.BH, 6); ctx.stroke();
  if (glanz > 0.01) {                                       // leuchtet kurz
    ctx.globalAlpha = Math.min(1, glanz / 0.5);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 4;
    _bioFxRundRect(ctx, x - 4, y - 4, K.BW + 8, K.BH + 8, 9); ctx.stroke();
  }
  ctx.restore();
}
function _m5lZahl(ctx, n, p, pop, groesse, dx) {
  const K = _m5lK;
  const s = pop > 0 ? 1 + 0.3 * Math.sin(Math.PI * (1 - pop / K.T_POP)) : 1;
  ctx.save();
  ctx.translate(p.x + (dx || 0), p.y);
  ctx.scale(s, s);
  ctx.font = '700 ' + groesse + 'px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6;           // weisser Rand: Spuren laufen dahinter
  ctx.strokeText(_m5lFmt(n), 0, groesse * 0.36);
  ctx.fillStyle = K.F_ZAHL;
  ctx.fillText(_m5lFmt(n), 0, groesse * 0.36);
  ctx.restore();
}
// Spur einer Strecke von a nach b, so weit die Kugel gekommen ist. Sie haelt
// von beiden Zahlen Abstand (r0, r1) und bekommt am Ende eine Pfeilspitze: Man
// sieht, aus welchem Stein in welchen Stein die „+ 1“ gewandert ist.
function _m5lSpur(ctx, a, b, u) {
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
  const r0 = 20, r1 = b.y < _m5lK.YM ? 27 : 22;          // am Deckstein steht die Zahl groesser
  if (L < 1) return;
  const ux = dx / L, uy = dy / L, s0 = r0, s1 = Math.min(L * u, L - r1);
  if (s1 <= s0 + 1) return;
  ctx.save();
  ctx.strokeStyle = _m5lK.F_SPUR; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a.x + ux * s0, a.y + uy * s0); ctx.lineTo(a.x + ux * s1, a.y + uy * s1); ctx.stroke();
  if (u >= 1) {
    const ex = a.x + ux * s1, ey = a.y + uy * s1, px = -uy, py = ux;
    ctx.fillStyle = _m5lK.F_KRAND;
    ctx.beginPath();
    ctx.moveTo(ex + ux * 3, ey + uy * 3);
    ctx.lineTo(ex - ux * 8 + px * 6, ey - uy * 8 + py * 6);
    ctx.lineTo(ex - ux * 8 - px * 6, ey - uy * 8 - py * 6);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function _m5lKugel(ctx, p, k, t) {
  const K = _m5lK;
  let sc = 1;
  if (k.phase === 'hoch1') sc = 0.45 + 0.55 * _bioFxEase.raus(Math.min(1, k.t / 0.15));
  const r = K.R * sc;
  ctx.save();
  const puls = k.phase === 'liegt' ? 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 0.8) : 1;
  ctx.fillStyle = 'rgba(251,191,36,' + (0.22 + 0.18 * puls).toFixed(3) + ')';   // Schein
  ctx.beginPath(); ctx.arc(p.x, p.y, r + 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = K.F_KUGEL; ctx.strokeStyle = K.F_KRAND; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (sc > 0.8) {
    ctx.fillStyle = K.F_KTEXT;
    ctx.font = '700 12px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('+ 1', p.x, p.y + 4.5);
  }
  ctx.restore();
}
function _m5lDraw(ctx, cv) {
  if (!_m5l) return;
  const W = cv.width, H = cv.height, z = _m5l, K = _m5lK;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#f4f7fb');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // Boden
  const xl = _m5lPosG(0).x - K.BW / 2 - 12, xr = _m5lPosG(2).x + K.BW / 2 + 12;
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(xl, K.BODEN); ctx.lineTo(xr, K.BODEN); ctx.stroke();
  // Ziegel
  const dx = i => z.wackel[i] > 0 ? Math.sin(z.wackel[i] * 48) * 3 * (z.wackel[i] / 0.45) : 0;
  for (let i = 0; i < 3; i++) _m5lZiegel(ctx, _m5lPosG(i), K.F_G, z.glanz.g[i], dx(i));
  for (let j = 0; j < 2; j++) _m5lZiegel(ctx, _m5lPosM(j), K.F_M, z.glanz.m[j]);
  _m5lZiegel(ctx, _m5lPosD(), K.F_D, z.glanz.d, 0, true);
  if (z.zurueck > 0) {                                      // Ruecksprung: die Mauer blinkt hell
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,' + (0.7 * z.zurueck / K.T_ZURUECK).toFixed(3) + ')';
    for (const p of [_m5lPosG(0), _m5lPosG(1), _m5lPosG(2), _m5lPosM(0), _m5lPosM(1), _m5lPosD()]) {
      _bioFxRundRect(ctx, p.x - K.BW / 2, p.y - K.BH / 2, K.BW, K.BH, 6); ctx.fill();
    }
    ctx.restore();
  }
  // Spuren der Kugeln, hinter den Zahlen
  const n = z.kugeln.length;
  const wege = z.kugeln.map((k, idx) => _m5lWeg(k, idx, n));
  for (const w of wege) for (const st of w.spur) _m5lSpur(ctx, st[0], st[1], st[2]);
  _bioFxDraw(ctx, z.fx.teile);                              // Lichtring hinter den Zahlen
  // Kugeln HINTER den Zahlen: Kommt eine Kugel in einem Stein an, liegt sie
  // unter seiner Zahl, und man sieht die Zahl im selben Augenblick wachsen.
  z.kugeln.forEach((k, idx) => { if (wege[idx].ort) _m5lKugel(ctx, wege[idx].ort, k, z.t); });
  // Zahlen
  for (let i = 0; i < 3; i++) _m5lZahl(ctx, z.g[i], _m5lPosG(i), z.pop.g[i], 26, dx(i));
  for (let j = 0; j < 2; j++) _m5lZahl(ctx, z.m[j], _m5lPosM(j), z.pop.m[j], 26);
  _m5lZahl(ctx, z.d, _m5lPosD(), z.pop.d, 28);
  // Woerter an den Reihen
  ctx.save();
  ctx.font = '700 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = K.F_D.wort;
  ctx.fillText('Deckstein', _m5lPosD().x + K.BW / 2 + 15, _m5lPosD().y + 5);
  ctx.fillStyle = K.F_G.wort;
  ctx.fillText('Grundsteine', _m5lPosG(2).x + K.BW / 2 + 10, _m5lPosG(2).y + 5);
  ctx.restore();
}
