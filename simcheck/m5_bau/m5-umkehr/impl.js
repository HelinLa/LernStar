
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mp2 „Plus und Minus gehören zusammen“ (Kennung m5-umkehr)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL2_PROFIL.md, Abschnitt m5-umkehr.
// Ueberschrift: „Wie prüft man eine Minusaufgabe?“ – die Frage der Einheit
// („Wie kann Leni prüfen, ob 54 stimmt?“) traegt einen Namen und das Wort
// „stimmt“ (nicht am Bildschirm), deshalb eine neutrale Frage.
//
// Was man sieht: oben ein Zettel aus Karopapier mit der Aufgabe, z. B.
// „83 − 37 = 54“ – die erste Zahl blau, die Zahl vom Zettel orange. Darunter
// ein Rechenstrich (waagerechte Linie OHNE Striche, nur Punkte mit Zahl; der
// Bereich passt zur Aufgabe: 40 bis 100, 70 bis 130 oder 130 bis 220). Die
// erste Zahl der Aufgabe ist ein blauer Punkt, ihre Zahl haengt als blaues
// Faehnchen UNTER dem Strich. Die Zahl vom Zettel ist ein oranger Punkt mit
// orangem Faehnchen UEBER dem Strich. Wie im Rechenstrich von mp1 gehen
// Plus-Spruenge ueber dem Strich, Minus-Spruenge darunter.
//
// „rückwärts springen“: Eine graue Kugel erscheint am blauen Punkt (0,15 s)
// und springt in 1,0 s auf einem Bogen UNTER dem Strich nach links, um so
// viel, wie die Aufgabe abzieht; am Bogen steht „− 37“. Wo sie landet,
// erscheinen ein grauer Ring und die Zahl (z. B. 46) als graues Faehnchen
// unter dem Strich – so sieht man, wo der Minus-Sprung WIRKLICH landet,
// neben dem orangen Faehnchen vom Zettel. Ist das genau die Zahl vom Zettel
// (83 − 37 = 46), umschliesst der graue Ring den orangen Punkt.
// „Probe“: Eine gruene Kugel erscheint am orangen Punkt (0,15 s) und springt
// in 1,0 s auf einem Bogen UEBER dem Strich nach rechts zurueck; am Bogen
// steht „+ 37“. Wo sie landet, steht ein gruener Ring mit gruener Zahl, und
// auf dem Zettel erscheint die zweite Zeile, z. B. „54 + 37 = 91“ (54 orange,
// 91 gruen). Erst bei der Landung aendern sich die Statuszeilen. Landet die
// Probe nicht auf dem blauen Punkt, leuchtet die Luecke zwischen beiden auf
// dem Strich rosa (ruhiger Puls, 0,8 Hz). Landet sie darauf, umschliesst der
// gruene Ring den blauen Punkt. Die Boegen enden am Landering, die
// Pfeilspitze steckt nie im Ring.
// Eine Sprungmarke loescht beide Boegen; die Faehnchen gleiten in 0,7 s an
// ihre neuen Plaetze (der Strich zoomt mit), der Zettel blendet die neue
// Aufgabe ein. Ein Knopf waehrend einer Bewegung laesst sie sofort fertig
// werden; ein zweiter Druck auf „Probe“ oder „rückwärts springen“ spielt den
// Sprung neu ab. Jede Knopffolge endet so im selben Zustand.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5hAufgabe('a'|'b'|'c'|'d')):
//     „83 − 37 = 54“ · „83 − 37 = 46“ · „125 − 48 = 77“ · „200 − 65 = 145“
//   „rückwärts springen“ (_m5hRueck()) · „Probe“ (_m5hProbe()) ·
//   „neu“ (_m5hNeu(): 83 − 37 = 54, keine Boegen, Aha-Gedaechtnis geloescht)
//
// Statuszeilen (woertlich; Rechenzeichen U+2212, zwischen den Gliedern
// geschuetzte Leerzeichen, damit die Gleichung nicht umbricht):
//   _m5h-zettel   „Aufgabe auf dem Zettel: 83 − 37 = 54“
//   _m5h-probe    „Umkehraufgabe: …“, nach der Landung der Probe
//                 „Umkehraufgabe: 54 + 37 = 91“
//   _m5h-landung  „Die Probe landet bei …“, nach der Landung der Probe
//                 „Die Probe landet bei 91. Gestartet wurde bei 83.“
// Alle Zeilen, deren Wert das Heft verlangt, sind laenger als 18 Zeichen
// (simfakten.js nimmt kuerzere nicht in den Dump).
//
// Werte (Probe = Zettel-Zahl + abgezogene Zahl; Minus-Sprung = Start − Zahl;
// jede Zeile nachgerechnet mit simcheck/werte.js, die Probe nach dem Auslaufen):
//   83 − 37 = 54   → Umkehraufgabe 54 + 37 = 91   · landet bei 91, gestartet bei 83
//                    (Minus-Sprung landet bei 46)
//   83 − 37 = 46   → Umkehraufgabe 46 + 37 = 83   · landet bei 83, gestartet bei 83
//   125 − 48 = 77  → Umkehraufgabe 77 + 48 = 125  · landet bei 125, gestartet bei 125
//   200 − 65 = 145 → Umkehraufgabe 145 + 65 = 210 · landet bei 210, gestartet bei 200
//                    (Minus-Sprung landet bei 135)
// Start: „Aufgabe auf dem Zettel: 83 − 37 = 54“, „Umkehraufgabe: …“,
// „Die Probe landet bei …“.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Landet die Probe von
// „83 − 37 = 46“, laeuft ein goldener Lichtring um den blauen Punkt, und er
// leuchtet 2,5 s nach (_bioFxLeuchten, 0,8 Hz). Dort ist zu sehen, was die
// Vermutung „noch einmal genauso rechnen“ nicht zeigt: Die Rueckwaertsrechnung
// kommt genau dort an, wo man begonnen hat. Einmal je Sitzung; „neu“ setzt
// es zurueck.
//
// NICHT am Bildschirm (sim_plan.nicht_am_bildschirm): „Plusaufgabe“,
// „Startzahl“, „stimmt“, „falsch“ – und keine Regel als Satz. Ob die Aufgabe
// aufgeht, sagt kein Text; das Kind vergleicht die beiden Zahlen der Zeile
// „Die Probe landet bei … Gestartet wurde bei …“. Keine Namen, keine Punkte,
// keine Zeit. Deterministisch, ohne Zufall: jede Zahl kommt aus _m5hRechne().
// ════════════════════════════════════════════════════════════════════════
let _m5h = null;
const _m5hAUFGABEN = {
  a: { start: 83,  minus: 37, zettel: 54,  lo: 40,  hi: 100 },
  b: { start: 83,  minus: 37, zettel: 46,  lo: 40,  hi: 100 },
  c: { start: 125, minus: 48, zettel: 77,  lo: 70,  hi: 130 },
  d: { start: 200, minus: 65, zettel: 145, lo: 130, hi: 220 }
};
const _m5hREIHE = ['a', 'b', 'c', 'd'];
const _m5hK = {
  X0: 40, X1: 380,              // Rechenstrich: Bereichsanfang und -ende (px)
  LY: 150,                      // Hoehe des Strichs
  KX: 110, KY: 6, KW: 200, KH: 58,   // Zettel oben (Karopapier)
  H_PLUS: 48, H_MINUS: 44,      // Bogenhoehe ueber / Bogentiefe unter dem Strich
  T_ZUG: 0.7,                   // s: Faehnchen gleiten, Strich zoomt
  T_AUF: 0.15,                  // s: Kugel erscheint
  T_SPRUNG: 1.0,                // s: Kugel springt
  T_EIN: 0.35,                  // s: Text blendet ein, Faehnchen springt auf
  LEUCHT: 2.5,                  // s: der blaue Punkt leuchtet nach (Aha)
  F_START: '#1d4ed8',           // blau: erste Zahl der Aufgabe
  F_ZETTEL: '#c2410c',          // orange: Zahl vom Zettel
  F_PROBE: '#15803d',           // gruen: Probe
  F_MINUS: '#475569',           // grau: Minus-Sprung
  F_LUECKE: '#db2777',          // rosa: Luecke
  F_STRICH: '#1e293b'
};

// 1234 -> "1 234" mit geschuetztem Leerzeichen (wie im Heft, dort normales)
function _m5hFmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
// Die ganze Rechnung einer Aufgabe – Bild und Statuszeilen lesen nur hier.
function _m5hRechne(k) {
  const a = _m5hAUFGABEN[k];
  return { start: a.start, minus: a.minus, zettel: a.zettel, lo: a.lo, hi: a.hi,
           wirklich: a.start - a.minus,          // wo der Minus-Sprung landet
           probe: a.zettel + a.minus };          // wo die Probe landet
}
// "83 − 37 = 54" als Text (Glieder mit geschuetztem Leerzeichen)
function _m5hGleichung(a, op, b, c) {
  const nb = ' ';
  return _m5hFmt(a) + nb + op + nb + _m5hFmt(b) + nb + '=' + nb + _m5hFmt(c);
}
function _m5hXin(v, lo, hi) {
  const K = _m5hK;
  return K.X0 + (v - lo) / (hi - lo) * (K.X1 - K.X0);
}
function _m5hX(v) { return _m5hXin(v, _m5h.lo, _m5h.hi); }

function _m5hInit() {
  const r = _m5hRechne('a');
  _m5h = { auf: 'a', lo: r.lo, hi: r.hi, zug: null,
           xs: _m5hXin(r.start, r.lo, r.hi), xz: _m5hXin(r.zettel, r.lo, r.hi),
           rueck: null, probe: null, aha: false, leucht: 0, karte: 1, fahne: 1,
           t: 0, fx: { teile: [] } };
}
function _m5hHTML() {
  const marke = k => {
    const r = _m5hRechne(k);
    return `<button class="sim-btn" id="_m5h-b-${k}" onclick="_m5hAufgabe('${k}')">${_m5hGleichung(r.start, '−', r.minus, r.zettel)}</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie prüft man eine Minusaufgabe?</h3>
    <div class="fpm-note" style="margin-top:2px">Oben im Bild liegt der Zettel mit der Aufgabe. Der blaue Punkt zeigt, wo die Rechnung beginnt. Das orange Fähnchen zeigt die Zahl vom Zettel.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5h-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5hREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m5h-rueck" onclick="_m5hRueck()">rückwärts springen</button>
          <button class="sim-btn primary" id="_m5h-pruef" onclick="_m5hProbe()">Probe</button>
          <button class="sim-btn" onclick="_m5hNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5h-zettel" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5h-probe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5h-landung" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">„rückwärts springen“ zeigt den Minus-Sprung unter dem Strich. „Probe“ springt vom orangen Fähnchen aus über dem Strich.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 83&nbsp;−&nbsp;37&nbsp;=&nbsp;54 auf dem Zettel, noch nicht gesprungen</p>
  </div>`;
}
function _m5hZeile(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}
function _m5hStatus() {
  if (!_m5h) return;
  const z = _m5h, K = _m5hK, r = _m5hRechne(z.auf), nb = ' ';
  const f = (n, farbe) => '<b style="color:' + farbe + '">' + _m5hFmt(n) + '</b>';
  _m5hZeile('_m5h-zettel', 'Aufgabe auf dem Zettel: ' + f(r.start, K.F_START) + nb + '−' + nb +
            _m5hFmt(r.minus) + nb + '=' + nb + f(r.zettel, K.F_ZETTEL));
  const da = !!(z.probe && z.probe.phase === 'da');
  _m5hZeile('_m5h-probe', 'Umkehraufgabe: ' + (da
    ? f(r.zettel, K.F_ZETTEL) + nb + '+' + nb + _m5hFmt(r.minus) + nb + '=' + nb + f(r.probe, K.F_PROBE)
    : '…'));
  _m5hZeile('_m5h-landung', da
    ? 'Die Probe landet bei ' + f(r.probe, K.F_PROBE) + '. Gestartet wurde bei ' + f(r.start, K.F_START) + '.'
    : 'Die Probe landet bei …');
  for (const k of _m5hREIHE) {
    const b = document.getElementById('_m5h-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.auf);
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Ein laufendes Gleiten steht sofort am Ziel.
function _m5hZugFertig() {
  const z = _m5h, g = z.zug;
  if (!g) return;
  z.lo = g.nach.lo; z.hi = g.nach.hi; z.xs = g.nach.xs; z.xz = g.nach.xz;
  z.zug = null;
}
function _m5hAufgabe(k) {
  if (!_m5h || !_m5hAUFGABEN[k]) return;
  const z = _m5h, r = _m5hRechne(k);
  const von = { lo: z.lo, hi: z.hi, xs: z.xs, xz: z.xz };
  const nach = { lo: r.lo, hi: r.hi, xs: _m5hXin(r.start, r.lo, r.hi), xz: _m5hXin(r.zettel, r.lo, r.hi) };
  z.auf = k; z.rueck = null; z.probe = null; z.leucht = 0;
  z.zug = { von, nach, t: 0, e: 0 };
  z.karte = 0; z.fahne = 0;                        // neue Aufgabe blendet ein
  _m5hStatus();
}
function _m5hRueck() {
  if (!_m5h) return;
  _m5hZugFertig();
  _m5h.rueck = { phase: 'auf', t: 0 };
  _m5hStatus();
}
function _m5hProbe() {
  if (!_m5h) return;
  _m5hZugFertig();
  _m5h.probe = { phase: 'auf', t: 0 };
  _m5h.leucht = 0;
  _m5hStatus();
}
function _m5hNeu() {
  if (!_m5h) return;
  _m5h.aha = false;
  _m5hAufgabe('a');
}
// Die Probe ist gelandet: Statuszeilen, Zettelzeile, Aha.
function _m5hProbeDa() {
  const z = _m5h, K = _m5hK, r = _m5hRechne(z.auf);
  if (!z.aha && z.auf === 'b' && r.probe === r.start) {
    z.aha = true;
    z.leucht = K.LEUCHT;
    _bioFxWelle(z.fx.teile, _m5hX(r.start), K.LY, '#fcd34d', 46);
  }
  _m5hStatus();
}

function _m5hUpdate(dt) {
  if (!_m5h) return;
  dt = _bioFxDt(dt);
  const z = _m5h, K = _m5hK;
  z.t += dt;
  if (z.zug) {
    const g = z.zug;
    g.t += dt;
    const u = Math.min(1, g.t / K.T_ZUG), e = _bioFxEase.sanft(u);
    g.e = e;
    z.lo = g.von.lo + (g.nach.lo - g.von.lo) * e;
    z.hi = g.von.hi + (g.nach.hi - g.von.hi) * e;
    z.xs = g.von.xs + (g.nach.xs - g.von.xs) * e;
    z.xz = g.von.xz + (g.nach.xz - g.von.xz) * e;
    if (u >= 1) _m5hZugFertig();
  }
  z.karte = Math.min(1, z.karte + dt / K.T_EIN);
  z.fahne = Math.min(1, z.fahne + dt / K.T_EIN);
  for (const art of ['rueck', 'probe']) {
    const s = z[art];
    if (!s) continue;
    s.t += dt;
    if (s.phase === 'auf' && s.t >= K.T_AUF) { s.phase = 'springt'; s.t = 0; }
    else if (s.phase === 'springt' && s.t >= K.T_SPRUNG) {
      s.phase = 'da'; s.t = 0;
      if (art === 'probe') _m5hProbeDa();
    }
  }
  if (z.leucht > 0) z.leucht = Math.max(0, z.leucht - dt);
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5hText(ctx, s, x, y, ausr, farbe, groesse, gew) {
  ctx.fillStyle = farbe || _m5hK.F_STRICH;
  ctx.font = (gew || '700') + ' ' + (groesse || 16) + 'px sans-serif';
  ctx.textAlign = ausr || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Glieder einer Gleichung nebeneinander, mittig um cx; jedes Glied mit eigener Farbe.
function _m5hGlieder(ctx, glieder, cx, y, groesse) {
  ctx.font = '700 ' + groesse + 'px sans-serif';
  const luft = groesse * 0.38;
  const br = glieder.map(g => ctx.measureText(g[0]).width);
  let x = cx - (br.reduce((s, b) => s + b, 0) + luft * (glieder.length - 1)) / 2;
  glieder.forEach((g, i) => { _m5hText(ctx, g[0], x, y, 'left', g[1], groesse); x += br[i] + luft; });
}
// Der Zettel oben: Karopapier, Zeile 1 die Aufgabe, Zeile 2 nach der Probe.
function _m5hZettel(ctx, r) {
  const z = _m5h, K = _m5hK, x = K.KX, y = K.KY, w = K.KW, h = K.KH;
  const hops = z.karte < 1 ? -4 * Math.sin(Math.PI * z.karte) : 0;
  ctx.save();
  ctx.translate(0, hops);
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.strokeStyle = '#dbeafe'; ctx.lineWidth = 1;          // Kaestchen
  for (let gx = x + 10; gx < x + w - 2; gx += 10) { ctx.beginPath(); ctx.moveTo(gx, y + 2); ctx.lineTo(gx, y + h - 2); ctx.stroke(); }
  for (let gy = y + 10; gy < y + h - 2; gy += 10) { ctx.beginPath(); ctx.moveTo(x + 2, gy); ctx.lineTo(x + w - 2, gy); ctx.stroke(); }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.stroke();
  ctx.globalAlpha = z.karte;
  _m5hGlieder(ctx, [[_m5hFmt(r.start), K.F_START], ['−', K.F_STRICH], [_m5hFmt(r.minus), K.F_STRICH],
                    ['=', K.F_STRICH], [_m5hFmt(r.zettel), K.F_ZETTEL]], x + w / 2, y + 25, 20);
  const p = z.probe;
  if (p && p.phase === 'da') {
    ctx.globalAlpha = Math.min(1, p.t / K.T_EIN);
    _m5hGlieder(ctx, [[_m5hFmt(r.zettel), K.F_ZETTEL], ['+', K.F_STRICH], [_m5hFmt(r.minus), K.F_STRICH],
                      ['=', K.F_STRICH], [_m5hFmt(r.probe), K.F_PROBE]], x + w / 2, y + 50, 20);
  }
  ctx.restore();
}
function _m5hStrich(ctx) {
  const K = _m5hK;
  ctx.save();
  ctx.strokeStyle = K.F_STRICH; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(K.X0 - 26, K.LY); ctx.lineTo(K.X1 + 24, K.LY); ctx.stroke();
  ctx.fillStyle = K.F_STRICH;                              // Pfeilspitze rechts
  ctx.beginPath(); ctx.moveTo(K.X1 + 34, K.LY); ctx.lineTo(K.X1 + 23, K.LY - 6);
  ctx.lineTo(K.X1 + 23, K.LY + 6); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Ein Punkt der Bogenlinie bei t (seite -1 = ueber dem Strich, +1 = darunter).
function _m5hBogenPunkt(xa, xb, h, seite, t) {
  return [xa + (xb - xa) * t, _m5hK.LY + seite * (3 + 4 * h * t * (1 - t))];
}
// Bis wohin der Bogen gezeichnet wird: er endet am Landering (Radius rEnde),
// nicht im Punkt – sonst steckt die Pfeilspitze im Ring.
function _m5hBogenEnde(xa, xb, h, seite, rEnde) {
  const K = _m5hK;
  let a = 0.5, b = 1;
  for (let i = 0; i < 24; i++) {
    const m = (a + b) / 2, p = _m5hBogenPunkt(xa, xb, h, seite, m);
    if (Math.hypot(p[0] - xb, p[1] - K.LY) > rEnde) a = m; else b = m;
  }
  return a;
}
// Ein Sprung als Bogen von xa nach xb, gezeichnet bis u (0..1), mit
// Pfeilspitze am Ende und der Sprungweite als Zahl am hoechsten Punkt.
function _m5hBogen(ctx, xa, xb, h, seite, u, farbe, text, W) {
  const K = _m5hK, n = 48;
  if (u <= 0) return;
  const tEnde = _m5hBogenEnde(xa, xb, h, seite, 13), te = Math.min(u, tEnde);
  ctx.save();
  ctx.strokeStyle = farbe; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const t = te * i / n, p = _m5hBogenPunkt(xa, xb, h, seite, t);
    if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
  }
  ctx.stroke();
  // Pfeilspitze, sobald der Bogen den Landering erreicht hat
  const p = _m5hBogenPunkt(xa, xb, h, seite, te);
  let dx = xb - xa, dy = seite * 4 * h * (1 - 2 * te);
  const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
  if (u >= tEnde) {
    ctx.fillStyle = farbe;
    ctx.beginPath();
    ctx.moveTo(p[0] + dx * 3, p[1] + dy * 3);
    ctx.lineTo(p[0] - dx * 11 - dy * 6, p[1] - dy * 11 + dx * 6);
    ctx.lineTo(p[0] - dx * 11 + dy * 6, p[1] - dy * 11 - dx * 6);
    ctx.closePath(); ctx.fill();
  }
  // Sprungweite am Scheitel, sobald die Kugel ihn passiert hat
  const a = Math.max(0, Math.min(1, (u - 0.45) / 0.2));
  if (a > 0) {
    ctx.globalAlpha = a;
    ctx.font = '700 16px sans-serif';
    const tw = ctx.measureText(text).width, pw = tw + 18, ph = 24;
    const cx = Math.max(pw / 2 + 3, Math.min(W - pw / 2 - 3, (xa + xb) / 2));
    const cy = K.LY + seite * (3 + h + 16);
    ctx.fillStyle = '#ffffff';
    _bioFxRundRect(ctx, cx - pw / 2, cy - ph / 2, pw, ph, 8); ctx.fill();
    ctx.strokeStyle = farbe; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, cx - pw / 2, cy - ph / 2, pw, ph, 8); ctx.stroke();
    _m5hText(ctx, text, cx, cy + 6, 'center', farbe, 16);
  }
  ctx.restore();
}
// Die springende Kugel: erscheint (federnd), springt, ist bei der Landung weg.
function _m5hKugel(ctx, xa, xb, h, seite, s, farbe) {
  const K = _m5hK;
  if (!s || s.phase === 'da') return;
  let x = xa, y = K.LY, r = 7;
  if (s.phase === 'auf') r = 7 * Math.max(0.05, _bioFxEase.federn(Math.min(1, s.t / K.T_AUF)));
  else {
    const u = _bioFxEase.sanft(Math.min(1, s.t / K.T_SPRUNG));
    const p = _m5hBogenPunkt(xa, xb, h, seite, u);
    x = p[0]; y = p[1];
  }
  ctx.save();
  ctx.fillStyle = farbe; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// Fortschritt eines Sprungs fuer den Bogen (0 vor dem Start, 1 nach der Landung).
function _m5hFortschritt(s) {
  if (!s || s.phase === 'auf') return 0;
  if (s.phase === 'da') return 1;
  return _bioFxEase.sanft(Math.min(1, s.t / _m5hK.T_SPRUNG));
}
// Ein Faehnchen mit Zahl. oben = true: ueber dem Strich, sonst haengend darunter.
// sk = Groesse beim Aufspringen (0..1), y0 = Oberkante des Kastens (sonst
// Voreinstellung), abst = Luecke zwischen Stab und Strich.
function _m5hFahne(ctx, x, zahl, farbe, oben, sk, W, y0, abst) {
  const K = _m5hK;
  if (sk <= 0.01) return;
  ctx.save();
  ctx.font = '700 18px sans-serif';
  const txt = _m5hFmt(zahl), tw = ctx.measureText(txt).width, bw = tw + 24, bh = 26;
  const by = y0 != null ? y0 : (oben ? K.LY - 74 : K.LY + 26);
  const bx = Math.max(3, Math.min(W - 3 - bw, x - bw / 2));
  ctx.globalAlpha = Math.min(1, sk);
  ctx.strokeStyle = farbe; ctx.lineWidth = 2;
  ctx.beginPath();
  const ab = abst || 7;                         // Luecke zwischen Stab und Punkt/Ring
  if (oben) { ctx.moveTo(x, by + bh); ctx.lineTo(x, K.LY - ab); }
  else { ctx.moveTo(x, K.LY + ab); ctx.lineTo(x, by); }
  ctx.stroke();
  const mx = bx + bw / 2, my = by + bh / 2;
  ctx.translate(mx, my); ctx.scale(sk, sk); ctx.translate(-mx, -my);
  ctx.fillStyle = '#ffffff'; ctx.lineWidth = 2.5;
  _bioFxRundRect(ctx, bx, by, bw, bh, 7); ctx.fill(); ctx.stroke();
  _m5hText(ctx, txt, mx, my + 6.5, 'center', farbe, 18);
  ctx.restore();
}
// Ein Punkt auf dem Strich.
function _m5hPunkt(ctx, x, r, farbe) {
  ctx.save();
  ctx.fillStyle = farbe; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, _m5hK.LY, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Die Luecke zwischen Landung der Probe und blauem Punkt leuchtet ruhig.
function _m5hLuecke(ctx, r) {
  const z = _m5h, K = _m5hK, p = z.probe;
  if (!p || p.phase !== 'da' || r.probe === r.start) return;
  const xa = _m5hX(Math.min(r.probe, r.start)), xb = _m5hX(Math.max(r.probe, r.start));
  const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
  const ein = Math.min(1, p.t / K.T_EIN);
  ctx.save();
  ctx.globalAlpha = ein * (0.3 + 0.35 * puls);
  ctx.fillStyle = K.F_LUECKE;
  _bioFxRundRect(ctx, xa - 4, K.LY - 8, xb - xa + 8, 16, 8); ctx.fill();
  ctx.globalAlpha = ein;
  ctx.strokeStyle = K.F_LUECKE; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, xa - 4, K.LY - 8, xb - xa + 8, 16, 8); ctx.stroke();
  ctx.restore();
}
function _m5hDraw(ctx, cv) {
  if (!_m5h) return;
  const W = cv.width, H = cv.height, z = _m5h, K = _m5hK, r = _m5hRechne(z.auf);
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#f4f7fb');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m5hZettel(ctx, r);
  _m5hLuecke(ctx, r);
  if (z.leucht > 0 && !z.zug) {                       // Aha: der blaue Punkt leuchtet nach
    ctx.save();
    ctx.globalAlpha = Math.min(1, z.leucht / 0.8);
    _bioFxLeuchten(ctx, z.xs, K.LY, 16, z.t, '252,211,77');
    ctx.restore();
  }
  _bioFxDraw(ctx, z.fx.teile);                        // Lichtring HINTER Strich und Zahlen
  _m5hStrich(ctx);
  const xs = z.xs, xz = z.xz, sk = _bioFxEase.federn(z.fahne);
  // Minus-Sprung unter dem Strich: vom blauen Punkt nach links
  const xw = _m5hX(r.wirklich), xp = _m5hX(r.probe);
  if (z.rueck && !z.zug) {
    _m5hBogen(ctx, xs, xw, K.H_MINUS, 1, _m5hFortschritt(z.rueck), K.F_MINUS,
              '− ' + _m5hFmt(r.minus), W);
  }
  // Probe ueber dem Strich: vom orangen Punkt nach rechts
  if (z.probe && !z.zug) {
    _m5hBogen(ctx, xz, xp, K.H_PLUS, -1, _m5hFortschritt(z.probe), K.F_PROBE,
              '+ ' + _m5hFmt(r.minus), W);
  }
  // Faehnchen: blau haengend unter dem Strich, orange darueber
  _m5hFahne(ctx, xs, r.start, K.F_START, false, 1, W);
  _m5hFahne(ctx, xz, r.zettel, K.F_ZETTEL, true, Math.max(0.05, sk), W);
  // Landestellen: ein Ring in der Farbe des Sprungs, darin ein kleiner Punkt –
  // ausser die Landestelle IST schon ein Punkt (dann umschliesst ihn der Ring).
  const ring = (x, farbe, e) => {
    ctx.save();
    ctx.strokeStyle = farbe; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, K.LY, 11 * e, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  };
  // wo der Minus-Sprung wirklich landet: grauer Ring, graue Zahl unter dem Strich
  const wDa = z.rueck && z.rueck.phase === 'da' && !z.zug;
  if (wDa) {
    const e = Math.max(0.05, _bioFxEase.federn(Math.min(1, z.rueck.t / K.T_EIN)));
    _m5hFahne(ctx, xw, r.wirklich, K.F_MINUS, false, e, W, K.LY + 26, 13);
    if (r.wirklich !== r.zettel) _m5hPunkt(ctx, xw, 4.5, K.F_MINUS);
  }
  _m5hPunkt(ctx, xz, 6, K.F_ZETTEL);
  _m5hPunkt(ctx, xs, 7, K.F_START);
  if (wDa) ring(xw, K.F_MINUS, Math.max(0.05, _bioFxEase.federn(Math.min(1, z.rueck.t / K.T_EIN))));
  // wo die Probe landet: gruener Ring, gruene Zahl ueber dem Strich
  if (z.probe && z.probe.phase === 'da' && !z.zug) {
    const e = Math.max(0.05, _bioFxEase.federn(Math.min(1, z.probe.t / K.T_EIN)));
    if (r.probe !== r.start) _m5hPunkt(ctx, xp, 4.5, K.F_PROBE);
    ring(xp, K.F_PROBE, e);
    _m5hFahne(ctx, xp, r.probe, K.F_PROBE, true, e, W, K.LY - 50, 13);
  }
  // die Kugeln zuletzt, damit sie vor allem liegen
  if (!z.zug) {
    _m5hKugel(ctx, xs, xw, K.H_MINUS, 1, z.rueck, K.F_MINUS);
    _m5hKugel(ctx, xz, xp, K.H_PLUS, -1, z.probe, K.F_PROBE);
  }
}
