
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mz6 „Auf welche Zahl rundet man?“ (Kennung m5-runden)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL1_PROFIL.md, Abschnitt m5-runden.
//
// Was man sieht: einen Ausschnitt des Zahlenstrahls zwischen den beiden
// Nachbarzehnern, Nachbarhundertern oder Nachbartausendern der gewaehlten
// Stelle (Hunderter: z. B. 2 400 bis 2 500, Striche alle 10; der Strich in
// der Haelfte ist gestrichelt und traegt keine Zahl – das ist die
// Fuenferstruktur des Ausschnitts). Nur diese beiden glatten Zahlen sind
// beschriftet. Die Zahl ist ein dunkelblauer Punkt mit
// Faehnchen, auf dem die Zahl gross steht. Zwei Boegen ueber dem Strahl
// verbinden den Punkt mit beiden; auf jedem Bogen steht der
// Abstand (links tuerkis, rechts violett – dieselben Farben tragen die beiden
// Zahlen in der Zeile „Abstände“). Unten im Bild: „Stelle: Hunderter ·
// Striche alle 10“.
// „runden“: Eine goldene Kugel erscheint am Punkt (0,18 s) und rollt in
// 0,9 s ueber den Strahl zu dem Nachbarhunderter (-zehner, -tausender), dessen
// Abstand kleiner ist; bei gleichen Abstaenden zum rechten. Der Bogen auf
// ihrer Seite wird dicker, der andere blass. Wo sie liegen bleibt, bekommt
// die glatte Zahl einen goldenen
// Kasten und leuchtet 2,5 s ruhig nach (_bioFxLeuchten, 0,8 Hz).
// Jede andere Handlung bewegt sich auch: Eine neue Zahl (Sprungmarke, „– 1“,
// „+ 1“) laesst den Punkt in 0,7 s gleiten, das Faehnchen macht dabei einen
// kleinen Hopser; liegt die neue Zahl in einem anderen Ausschnitt, rollt der
// Strahl mit. Eine andere Stelle zoomt den Ausschnitt in 0,7 s (die Breite
// aendert sich logarithmisch, Striche und Zahlen blenden ueber).
//
// Knoepfe (Profil, woertlich):
//   Sprungmarken  „2 449“ · „2 451“ · „2 450“ · „2 380“      _m5fZahl(n)
//   „Stelle:“     „Zehner“ · „Hunderter“ · „Tausender“      _m5fStelle('Z'|'H'|'T')
//                 (Wahlgruppe, Start Hunderter)
//   „– 1“ · „+ 1“ (_m5fSchritt(-1|1)) · „runden“ (_m5fRunden()) ·
//   „neu“ (_m5fNeu(): 2 449, Hunderter, Aha-Gedaechtnis geloescht)
// Ist die Zahl selbst eine glatte Zahl der Stelle, gilt sie als linker
// Nachbarhunderter (-zehner, -tausender; Abstaende 0 und 10/100/1 000) – die
// Kugel bleibt dann am Punkt.
// Bereich der Zahl: 0 bis 99 999.
//
// Fachwort (04.10.2026, Abdullah „ja“ zu Schulbuch-Abgleich A3): Die beiden
// glatten Zahlen heissen je nach Stelle „Nachbarzehner“, „Nachbarhunderter“
// oder „Nachbartausender“ – nicht mehr das fruehere Sammelwort „Nachbar-
// zahl“: So heissen in der Grundschule Vorgaenger und Nachfolger (2 448 und
// 2 450), und genau dorthin schieben die Knoepfe „– 1“ / „+ 1“ den Punkt.
//
// Statuszeilen (woertlich, Tausendertrenner geschuetztes Leerzeichen):
//   _m5f-zahl      „Zahl: 2 449“
//   _m5f-nachbarn  „Nachbarhunderter: 2 400 und 2 500“
//                  (Zehner: „Nachbarzehner: 2 440 und 2 450“,
//                   Tausender: „Nachbartausender: 2 000 und 3 000“;
//                   jede Fassung hat mehr als 18 Zeichen, steht also im Dump)
//   _m5f-abstand   „Abstände: 49 und 51“
//   _m5f-ergebnis  „Gerundet: …“ bis die Kugel liegt, dann „Gerundet: 2 400“
// Eine neue Zahl oder eine andere Stelle setzt „Gerundet: …“ zurueck. Die
// Zahl selbst aendert „runden“ nie – gerundet wird immer von ihr aus.
//
// Werte (Hunderter):
//   2 449 → Nachbarhunderter 2 400 und 2 500 · 49 und 51 · Gerundet: 2 400
//   2 451 → Nachbarhunderter 2 400 und 2 500 · 51 und 49 · Gerundet: 2 500
//   2 450 → Nachbarhunderter 2 400 und 2 500 · 50 und 50 · Gerundet: 2 500
//   2 380 → Nachbarhunderter 2 300 und 2 400 · 80 und 20 · Gerundet: 2 400
//   Zehner:    2 449 → Nachbarzehner 2 440 und 2 450 · 9 und 1 · Gerundet: 2 450
//   Tausender: 2 449 → Nachbartausender 2 000 und 3 000 · 449 und 551 · Gerundet: 2 000
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Sind auf Hunderter 2 449 UND
// 2 450 gerundet worden (Reihenfolge egal, z. B. „2 449“ → „runden“ → „+ 1“ →
// „runden“), laufen bei der zweiten Landung zwei Lichtringe – einer am Punkt
// (2 450 sitzt genau auf dem gestrichelten Strich), einer am Nachbarhunderter,
// wo die Kugel liegt. 2 449 landet bei 2 400, eins mehr bei 2 500: Das
// widerlegt das schrittweise Runden (2 449 → 2 450 → 2 500) aus Vermutung 2.
// Einmal je Sitzung; „neu“ setzt es zurueck.
//
// Nicht am Bildschirm (Merksatzwoerter und Regel, sim_plan.nicht_am_bildschirm):
// „aufgerundet“, „abgerundet“ (die beiden Merksatzwoerter seit 04.10.2026),
// „näher“, „Mitte“, „größer“, „kleiner“. Darum steht
// im Bild ausser Zahlen nur die Stellen-Zeile, und kein Hinweistext nennt die
// Regel, nach der die Kugel rollt.
// Deterministisch, ohne Zufall: jede Zahl im Bild kommt aus _m5fNachbarn().
// ════════════════════════════════════════════════════════════════════════
let _m5f = null;
// nb/nbDat: das Fachwort fuer die beiden glatten Zahlen der Stelle
// (Statuszeile „Nachbarhunderter: …“, Hinweistext im Dativ Plural).
const _m5fSTELLE = {
  Z: { name: 'Zehner',    s: 10,   nb: 'Nachbarzehner',    nbDat: 'Nachbarzehnern' },
  H: { name: 'Hunderter', s: 100,  nb: 'Nachbarhunderter', nbDat: 'Nachbarhundertern' },
  T: { name: 'Tausender', s: 1000, nb: 'Nachbartausender', nbDat: 'Nachbartausendern' }
};
const _m5fREIHE = ['Z', 'H', 'T'];
const _m5fMARKEN = [2449, 2451, 2450, 2380];
const _m5fK = {
  X0: 50, X1: 370,          // Zahlenstrahl: linker und rechter Nachbarhunderter (px)
  LY: 160,                  // Hoehe des Strahls
  FY: 16, FH: 36,           // Faehnchen: Oberkante, Hoehe
  R: 10,                    // Radius der Kugel
  MIN: 0, MAX: 99999,       // Bereich der Zahl
  T_ZUG: 0.7,               // s: Punkt gleitet, Strahl rollt oder zoomt
  T_AUF: 0.18,              // s: Kugel erscheint
  T_ROLL: 0.9,              // s: Kugel rollt
  T_HOPS: 0.35,             // s: kleiner Hopser beim Ankommen
  LEUCHT: 2.5,              // s: die erreichte glatte Zahl leuchtet nach
  F_L: '#0f766e',           // linker Bogen (tuerkis)
  F_R: '#6d28d9',           // rechter Bogen (violett)
  F_PUNKT: '#1e3a8a',       // Punkt und Faehnchen
  F_STRAHL: '#1e293b'
};

// 2449 -> "2 449" mit geschuetztem Leerzeichen (wie im Heft, dort normales)
function _m5fFmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
// Die beiden glatten Zahlen der Stelle (Nachbarzehner/-hunderter/-tausender),
// Abstaende und Ergebnis. Eine glatte Zahl ist ihr eigener linker Nachbar;
// bei gleichen Abstaenden geht es zum rechten.
function _m5fNachbarn(zahl, stelle) {
  const s = _m5fSTELLE[stelle].s;
  const lo = Math.floor(zahl / s) * s, hi = lo + s;
  const dl = zahl - lo, dr = hi - zahl;
  return { s, lo, hi, dl, dr, ziel: dl < dr ? lo : hi };
}
function _m5fLage(zahl, stelle) {
  const nb = _m5fNachbarn(zahl, stelle);
  return { p: zahl, w: nb.s, r: nb.dl / nb.s };
}

function _m5fInit() {
  const l = _m5fLage(2449, 'H');
  _m5f = { zahl: 2449, stelle: 'H', p: l.p, w: l.w, r: l.r, zug: null,
           kugel: null, ergebnis: null, leucht: 0, erledigt: {}, aha: false,
           t: 0, fx: { teile: [] } };
}
function _m5fHTML() {
  const marke = n => `<button class="sim-btn" id="_m5f-b-${n}" onclick="_m5fZahl(${n})">${_m5fFmt(n)}</button>`;
  const stelle = k => `<button class="sim-btn${k === 'H' ? ' primary' : ''}" id="_m5f-s-${k}" onclick="_m5fStelle('${k}')">${_m5fSTELLE[k].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was ist 2 449 auf Hunderter gerundet?</h3>
    <div class="fpm-note" id="_m5f-note-boegen" style="margin-top:2px">Der Punkt mit dem Fähnchen zeigt die Zahl am Zahlenstrahl. Die beiden Bögen zeigen die Abstände zu den Nachbarhundertern.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5f-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5fMARKEN.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px;align-items:center">
          <span class="fpm-label" style="margin:0 4px 0 0">Stelle:</span>
          ${_m5fREIHE.map(stelle).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_m5fSchritt(-1)">–&nbsp;1</button>
          <button class="sim-btn" onclick="_m5fSchritt(1)">+&nbsp;1</button>
          <button class="sim-btn primary" id="_m5f-runden" onclick="_m5fRunden()">runden</button>
          <button class="sim-btn" onclick="_m5fNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5f-zahl" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5f-nachbarn" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5f-abstand" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5f-ergebnis" style="margin-top:6px"></div>
        <div class="fpm-note" id="_m5f-note-kugel" style="margin-top:10px">„runden“ lässt eine Kugel vom Punkt zu einem Nachbarhunderter rollen. Mit „–&nbsp;1“ und „+&nbsp;1“ wandert der Punkt um eins.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Zahl 2&nbsp;449, Stelle Hunderter, noch nicht gerundet</p>
  </div>`;
}
function _m5fZeile(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}
function _m5fStatus() {
  if (!_m5f) return;
  const z = _m5f, nb = _m5fNachbarn(z.zahl, z.stelle), K = _m5fK, st = _m5fSTELLE[z.stelle];
  _m5fZeile('_m5f-zahl', 'Zahl: ' + _m5fFmt(z.zahl));
  _m5fZeile('_m5f-nachbarn', st.nb + ': ' + _m5fFmt(nb.lo) + ' und ' + _m5fFmt(nb.hi));
  // Die beiden Hinweistexte nennen das Fachwort der gewaehlten Stelle.
  _m5fZeile('_m5f-note-boegen', 'Der Punkt mit dem Fähnchen zeigt die Zahl am Zahlenstrahl. ' +
            'Die beiden Bögen zeigen die Abstände zu den ' + st.nbDat + '.');
  _m5fZeile('_m5f-note-kugel', '„runden“ lässt eine Kugel vom Punkt zu einem ' + st.nb +
            ' rollen. Mit „–\u00a01“ und „+\u00a01“ wandert der Punkt um eins.');
  _m5fZeile('_m5f-abstand', 'Abstände: <b style="color:' + K.F_L + '">' + _m5fFmt(nb.dl) +
            '</b> und <b style="color:' + K.F_R + '">' + _m5fFmt(nb.dr) + '</b>');
  _m5fZeile('_m5f-ergebnis', 'Gerundet: ' + (z.ergebnis === null ? '…' : _m5fFmt(z.ergebnis)));
  for (const k of _m5fREIHE) {
    const b = document.getElementById('_m5f-s-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.stelle);
  }
  for (const n of _m5fMARKEN) {
    const b = document.getElementById('_m5f-b-' + n);
    if (b && b.classList) b.classList.toggle('primary', n === z.zahl);
  }
  const rb = document.getElementById('_m5f-runden');
  if (rb) {
    const rollt = !!(z.kugel && z.kugel.phase !== 'da');
    rb.disabled = rollt;
    rb.style.opacity = rollt ? '0.45' : '';
  }
}

// Neues Ziel setzen; das Bild gleitet vom ANGEZEIGTEN Stand dorthin.
function _m5fSetze(zahl, stelle) {
  const z = _m5f;
  const alt = { zahl: z.zahl, stelle: z.stelle };
  z.zahl = zahl; z.stelle = stelle;
  z.kugel = null; z.ergebnis = null; z.leucht = 0;
  const nach = _m5fLage(zahl, stelle), von = { p: z.p, w: z.w, r: z.r };
  if (von.p === nach.p && von.w === nach.w && Math.abs(von.r - nach.r) < 1e-9) z.zug = null;
  else z.zug = { von, nach, t: 0, e: 0, alt };
  _m5fStatus();
}
function _m5fZahl(n) {
  if (!_m5f) return;
  _m5fSetze(Math.max(_m5fK.MIN, Math.min(_m5fK.MAX, Math.round(n))), _m5f.stelle);
}
function _m5fStelle(k) {
  if (!_m5f || !_m5fSTELLE[k]) return;
  _m5fSetze(_m5f.zahl, k);
}
function _m5fSchritt(d) {
  if (!_m5f) return;
  const n = Math.max(_m5fK.MIN, Math.min(_m5fK.MAX, _m5f.zahl + d));
  if (n === _m5f.zahl) return;
  _m5fSetze(n, _m5f.stelle);
}
function _m5fRunden() {
  if (!_m5f) return;
  const z = _m5f;
  if (z.kugel && z.kugel.phase !== 'da') return;          // rollt noch
  if (z.zug) {                                              // Bild steht sofort
    z.p = z.zug.nach.p; z.w = z.zug.nach.w; z.r = z.zug.nach.r; z.zug = null;
  }
  const nb = _m5fNachbarn(z.zahl, z.stelle);
  z.kugel = { von: z.zahl, nach: nb.ziel, phase: 'auf', t: 0,
              dauer: nb.ziel === z.zahl ? 0.25 : _m5fK.T_ROLL };
  z.ergebnis = null; z.leucht = 0;
  _m5fStatus();
}
function _m5fNeu() {
  if (!_m5f) return;
  _m5f.erledigt = {}; _m5f.aha = false;
  _m5fSetze(2449, 'H');
}
// Die Kugel liegt: Ergebnis zeigen, Aha pruefen.
function _m5fAngekommen() {
  const z = _m5f, K = _m5fK, k = z.kugel;
  z.ergebnis = k.nach;
  z.leucht = K.LEUCHT;
  z.erledigt[z.stelle + ':' + z.zahl] = k.nach;
  if (!z.aha && z.stelle === 'H' && (z.zahl === 2449 || z.zahl === 2450) &&
      z.erledigt['H:2449'] === 2400 && z.erledigt['H:2450'] === 2500) {
    z.aha = true;
    _bioFxWelle(z.fx.teile, _m5fX(z.zahl), K.LY, '#fcd34d', 40);
    _bioFxWelle(z.fx.teile, _m5fX(k.nach), K.LY + 30, '#fcd34d', 48);
  }
  _m5fStatus();
}

function _m5fUpdate(dt) {
  if (!_m5f) return;
  dt = _bioFxDt(dt);
  const z = _m5f, K = _m5fK;
  z.t += dt;
  if (z.zug) {
    const g = z.zug;
    g.t += dt;
    const u = Math.min(1, g.t / K.T_ZUG), e = _bioFxEase.sanft(u);
    g.e = e;
    z.p = g.von.p + (g.nach.p - g.von.p) * e;
    z.w = Math.exp(Math.log(g.von.w) + (Math.log(g.nach.w) - Math.log(g.von.w)) * e);
    z.r = g.von.r + (g.nach.r - g.von.r) * e;
    if (u >= 1) { z.p = g.nach.p; z.w = g.nach.w; z.r = g.nach.r; z.zug = null; }
  }
  const k = z.kugel;
  if (k) {
    k.t += dt;
    if (k.phase === 'auf' && k.t >= K.T_AUF) { k.phase = 'rollt'; k.t = 0; }
    else if (k.phase === 'rollt' && k.t >= k.dauer) { k.phase = 'da'; k.t = 0; _m5fAngekommen(); }
  }
  if (z.leucht > 0) z.leucht = Math.max(0, z.leucht - dt);
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ─────────────────────────────────────────────────────────────
function _m5fLo() { return _m5f.p - _m5f.r * _m5f.w; }
function _m5fX(v) {
  const K = _m5fK;
  return K.X0 + (v - _m5fLo()) / _m5f.w * (K.X1 - K.X0);
}
function _m5fText(ctx, s, x, y, ausr, farbe, groesse, gew) {
  ctx.fillStyle = farbe || _m5fK.F_STRAHL;
  ctx.font = (gew || '700') + ' ' + (groesse || 14) + 'px sans-serif';
  ctx.textAlign = ausr || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Striche einer Stelle (s), mit Deckkraft a. Zu dichte Striche entfallen.
function _m5fStriche(ctx, s, a) {
  const z = _m5f, K = _m5fK, st = s / 10, L = K.X1 - K.X0;
  if (a <= 0.01 || st / z.w * L < 4) return;
  const lo = _m5fLo(), rand = 12 / L * z.w;
  const k0 = Math.ceil((lo - rand) / st - 1e-9), k1 = Math.floor((lo + z.w + rand) / st + 1e-9);
  ctx.save();
  ctx.globalAlpha = a;
  for (let k = k0; k <= k1; k++) {
    const v = k * st, x = _m5fX(v);
    if (v % s === 0) {                                     // glatte Zahl der Stelle
      ctx.strokeStyle = K.F_STRAHL; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, K.LY - 15); ctx.lineTo(x, K.LY + 15); ctx.stroke();
    } else if (v % (s / 2) === 0) {                        // Haelfte: gestrichelt, ohne Zahl
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      if (ctx.setLineDash) ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x, K.LY - 52); ctx.lineTo(x, K.LY + 12); ctx.stroke();
      if (ctx.setLineDash) ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, K.LY - 8); ctx.lineTo(x, K.LY + 8); ctx.stroke();
    }
  }
  ctx.restore();
}
// Beschriftung der glatten Zahlen einer Stelle (nur, wenn sie Platz haben).
function _m5fMarken(ctx, s, a, W) {
  const z = _m5f, K = _m5fK, L = K.X1 - K.X0;
  if (a <= 0.01 || s / z.w * L < 70) return;
  const lo = _m5fLo();
  const k0 = Math.ceil((lo - 0.25 * z.w) / s), k1 = Math.floor((lo + 1.25 * z.w) / s);
  ctx.save();
  ctx.globalAlpha = a;
  for (let k = k0; k <= k1; k++) {
    const v = k * s, x = _m5fX(v);
    if (x < -40 || x > W + 40) continue;
    const txt = _m5fFmt(v);
    ctx.font = '700 18px sans-serif';
    const tw = ctx.measureText(txt).width;
    if (z.ergebnis === v && !z.zug) {
      ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
      _bioFxRundRect(ctx, x - tw / 2 - 9, K.LY + 18, tw + 18, 26, 7); ctx.fill(); ctx.stroke();
    }
    _m5fText(ctx, txt, x, K.LY + 37, 'center', K.F_STRAHL, 18);
  }
  ctx.restore();
}
// Die erreichte glatte Zahl leuchtet nach – HINTER dem Strahl, damit Strich
// und Zahl scharf bleiben.
function _m5fGlanz(ctx) {
  const z = _m5f, K = _m5fK;
  if (z.ergebnis === null || z.zug || z.leucht <= 0) return;
  ctx.save();
  ctx.font = '700 18px sans-serif';
  const tw = ctx.measureText(_m5fFmt(z.ergebnis)).width;
  ctx.globalAlpha = Math.min(1, z.leucht / 0.8);
  _bioFxLeuchten(ctx, _m5fX(z.ergebnis), K.LY + 31, tw / 2 + 2, z.t, '252,211,77');
  ctx.restore();
}
function _m5fStrahl(ctx, W) {
  const z = _m5f, K = _m5fK;
  // der Strahl selbst, an beiden Enden etwas laenger
  ctx.save();
  ctx.strokeStyle = K.F_STRAHL; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(K.X0 - 22, K.LY); ctx.lineTo(K.X1 + 22, K.LY); ctx.stroke();
  ctx.fillStyle = K.F_STRAHL;                              // Pfeilspitze rechts
  ctx.beginPath(); ctx.moveTo(K.X1 + 32, K.LY); ctx.lineTo(K.X1 + 21, K.LY - 6);
  ctx.lineTo(K.X1 + 21, K.LY + 6); ctx.closePath(); ctx.fill();
  ctx.restore();
  const sNeu = _m5fSTELLE[z.stelle].s;
  if (z.zug && z.zug.alt.stelle !== z.stelle) {            // Zoom: ueberblenden
    const sAlt = _m5fSTELLE[z.zug.alt.stelle].s, e = z.zug.e;
    _m5fStriche(ctx, sAlt, 1 - e); _m5fStriche(ctx, sNeu, e);
    _m5fMarken(ctx, sAlt, 1 - e, W); _m5fMarken(ctx, sNeu, e, W);
  } else {
    _m5fStriche(ctx, sNeu, 1);
    _m5fMarken(ctx, sNeu, 1, W);
  }
}
// Ein Bogen von xa nach xb ueber dem Strahl, oben der Abstand als Zahl.
// xp ist der Punkt (Fahnenstab): Der Zahlenkasten haelt von ihm Abstand,
// und bei kurzen Boegen steht er hoeher, damit er die Kugel nicht beruehrt.
function _m5fBogen(ctx, xa, xb, xp, farbe, a, text, dick, seite, W) {
  const K = _m5fK, breite = Math.abs(xb - xa);
  const h = Math.max(9, Math.min(50, breite * 0.32));
  ctx.save();
  ctx.globalAlpha = a;
  if (breite >= 1) {
    ctx.strokeStyle = farbe; ctx.lineWidth = dick ? 4.5 : 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(xa, K.LY - 2);
    ctx.quadraticCurveTo((xa + xb) / 2, K.LY - 2 * h, xb, K.LY - 2);
    ctx.stroke();
  }
  ctx.font = '700 16px sans-serif';
  const tw = ctx.measureText(text).width, pw = Math.max(30, tw + 18), ph = 24;
  let cx = (xa + xb) / 2;
  if (seite === 'L') cx = Math.min(cx, xp - pw / 2 - 9);
  else cx = Math.max(cx, xp + pw / 2 + 9);
  cx = Math.max(pw / 2 + 3, Math.min(W - pw / 2 - 3, cx));
  const cy = K.LY - Math.max(h, 28) - 17;
  // deckender Grund auch beim blassen Bogen: Striche scheinen nicht durch
  ctx.globalAlpha = Math.min(1, a * 3.4);
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, cx - pw / 2, cy - ph / 2, pw, ph, 8); ctx.fill();
  ctx.globalAlpha = a;
  ctx.strokeStyle = farbe; ctx.lineWidth = dick ? 3 : 2;
  _bioFxRundRect(ctx, cx - pw / 2, cy - ph / 2, pw, ph, 8); ctx.stroke();
  _m5fText(ctx, text, cx, cy + 6, 'center', farbe, 16);
  ctx.restore();
}
function _m5fBogenPaar(ctx, zahl, stelle, a, seite, W) {
  if (a <= 0.01) return;
  const K = _m5fK, nb = _m5fNachbarn(zahl, stelle);
  const xp = _m5fX(zahl), xl = _m5fX(nb.lo), xr = _m5fX(nb.hi);
  _m5fBogen(ctx, xl, xp, xp, K.F_L, a * (seite === 'R' ? 0.3 : 1), _m5fFmt(nb.dl), seite === 'L', 'L', W);
  _m5fBogen(ctx, xp, xr, xp, K.F_R, a * (seite === 'L' ? 0.3 : 1), _m5fFmt(nb.dr), seite === 'R', 'R', W);
}
function _m5fBoegen(ctx, W) {
  const z = _m5f;
  if (z.zug) {
    const e = z.zug.e;
    _m5fBogenPaar(ctx, z.zug.alt.zahl, z.zug.alt.stelle, Math.max(0, 1 - e * 2.2), null, W);
    _m5fBogenPaar(ctx, z.zahl, z.stelle, Math.max(0, (e - 0.55) / 0.45), null, W);
    return;
  }
  let seite = null;
  if (z.kugel && z.kugel.phase !== 'auf') {
    const nb = _m5fNachbarn(z.zahl, z.stelle);
    seite = z.kugel.nach === nb.hi ? 'R' : 'L';
  }
  _m5fBogenPaar(ctx, z.zahl, z.stelle, 1, seite, W);
}
function _m5fFahne(ctx, W) {
  const z = _m5f, K = _m5fK, xp = _m5fX(z.p);
  const hops = z.zug ? -9 * Math.sin(Math.PI * z.zug.e) : 0;
  const fy = K.FY + hops;
  ctx.save();
  ctx.font = '700 22px sans-serif';
  const txt = _m5fFmt(z.zahl), tw = ctx.measureText(txt).width, bw = tw + 30;
  const bx = Math.max(4, Math.min(W - 4 - bw, xp - bw / 2));
  ctx.strokeStyle = K.F_PUNKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(xp, fy + K.FH); ctx.lineTo(xp, K.LY - 6); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.F_PUNKT; ctx.lineWidth = 2.5;
  _bioFxRundRect(ctx, bx, fy, bw, K.FH, 8); ctx.fill(); ctx.stroke();
  _m5fText(ctx, txt, bx + bw / 2, fy + K.FH / 2 + 8, 'center', K.F_PUNKT, 22);
  ctx.fillStyle = K.F_PUNKT; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(xp, K.LY, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function _m5fKugel(ctx) {
  const z = _m5f, K = _m5fK, k = z.kugel;
  if (!k) return;
  const xa = _m5fX(k.von), xb = _m5fX(k.nach);
  let x = xa, sc = 1, dy = 0;
  if (k.phase === 'auf') sc = Math.max(0.05, _bioFxEase.federn(Math.min(1, k.t / K.T_AUF)));
  else if (k.phase === 'rollt') x = xa + (xb - xa) * _bioFxEase.sanft(Math.min(1, k.t / k.dauer));
  else {
    x = xb;
    if (k.t < K.T_HOPS) dy = -5 * Math.sin(Math.PI * k.t / K.T_HOPS);
  }
  const r = K.R * sc, cy = K.LY - 1.5 - r + dy, dreh = (x - xa) / K.R;
  ctx.save();
  ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // ein Streifen dreht sich mit: so sieht man das Rollen
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - Math.cos(dreh) * r * 0.8, cy - Math.sin(dreh) * r * 0.8);
  ctx.lineTo(x + Math.cos(dreh) * r * 0.8, cy + Math.sin(dreh) * r * 0.8);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.arc(x - r * 0.38, cy - r * 0.38, r * 0.24, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function _m5fDraw(ctx, cv) {
  if (!_m5f) return;
  const W = cv.width, H = cv.height, z = _m5f;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#f4f7fb');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m5fGlanz(ctx);
  _bioFxDraw(ctx, z.fx.teile);             // Lichtringe HINTER Strahl und Zahlen
  _m5fStrahl(ctx, W);
  _m5fBoegen(ctx, W);
  _m5fFahne(ctx, W);
  _m5fKugel(ctx);
  const st = _m5fSTELLE[z.stelle];
  _m5fText(ctx, 'Stelle: ' + st.name + ' · Striche alle ' + _m5fFmt(st.s / 10),
           W / 2, H - 14, 'center', '#475569', 13, '600');
}
