
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mp5 „Stimmt das Ergebnis ungefähr?“ (Kennung m5-ueberschlag)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL2_PROFIL.md, Abschnitt m5-ueberschlag.
//
// Ueberschrift: NICHT die Frage der Einheit („Kann 4 105 stimmen?“). Sie
// enthaelt „stimmen“, und „stimmt“ steht in nicht_am_bildschirm (Kapitel-2-
// Regel 3). Neutral: „Wie weit liegt das Ergebnis vom Überschlag entfernt?“
//
// Was man sieht (von oben nach unten, alles auf EINER Leinwand 420 x 250):
// 1. Der Zettel: ein Stueck Karopapier mit der Aufgabe und dem Ergebnis, das
//    dort jemand hingeschrieben hat, z. B. „398 + 207 = 4 105“. Das Ergebnis
//    steht ORANGE – in der Farbe seines Faehnchens am grossen Zahlenstrahl.
//    Bei jeder Wahl faellt der Zettel von oben herein (0,5 s), und das
//    Ergebnis fliegt als oranges Faehnchen auf seinen Platz am Strahl (0,6 s).
// 2. Zwei kleine Zahlenstrahlen, einer je Zahl der Aufgabe, dazwischen das
//    Rechenzeichen. Jeder reicht von der glatten Zahl unter der Zahl bis zur
//    glatten Zahl ueber ihr, gebildet an der ERSTEN Stelle der Zahl (398: 300
//    bis 400 · 98: 90 bis 100 · 1 985: 1 000 bis 2 000); Striche alle zehntel,
//    der Strich in der Haelfte gestrichelt und ohne Zahl, beschriftet sind nur
//    die beiden Enden. Die Zahl ist eine goldene Kugel mit Faehnchen.
// 3. Die Zeile fuer den Ueberschlag: anfangs ein leerer, gestrichelter Rahmen.
// 4. Der grosse Zahlenstrahl 0 bis 7 000, Striche alle 1 000 mit Zahl, darunter
//    klein „Striche alle 1 000“. Das Zettel-Ergebnis steht dort als oranges
//    Faehnchen mit Raute auf dem Strahl.
//
// „Überschlag rechnen“ (_m5kRechnen) – vier Bewegungen hintereinander, 1,8 s:
//   rollen   0,65 s  beide Kugeln rollen zu der glatten Zahl, die naeher
//                    liegt (bei gleichem Abstand zur oberen); das Faehnchen
//                    zeigt danach diese Zahl in Blau, das Ende des kleinen
//                    Strahls bekommt einen goldenen Kasten und leuchtet nach
//   zeile    0,40 s  die beiden blauen Zahlen fliegen aus den Faehnchen in die
//                    Zeile, Rechenzeichen und „= 600“ blenden ein; erst jetzt
//                    steht die Statuszeile „Überschlag: …“
//   fallen   0,40 s  das Ergebnis des Ueberschlags faellt als blauer Punkt auf
//                    den grossen Strahl und bekommt ein blaues Faehnchen
//   klammer  0,35 s  eine violette Klammer waechst vom blauen Punkt zum
//                    orangen Faehnchen; gestrichelte Linien fuehren von ihren
//                    Enden zu beiden Punkten; der Abstand steht in der Klammer
//                    und leuchtet 2,5 s ruhig nach (_m5kGlimmen, 0,8 Hz);
//                    erst jetzt steht „Abstand zum Überschlag: …“
// Waehrend der Bewegung ist „Überschlag rechnen“ gesperrt (der Handler kehrt
// sofort zurueck, die Bewegung laeuft weiter – jede Knopffolge endet also im
// selben Zustand). Ist alles fertig, spielt ein zweiter Druck dieselbe Bewegung
// noch einmal ab und endet wieder gleich.
//
// Knoepfe (Bauplan, woertlich; Tausendertrenner U+00A0, Minus U+2212):
//   Sprungmarken = Zeilen der Heft-Tabelle, _m5kZettel('a'|'b'|'c'|'d'):
//     „398 + 207 = 4 105“ · „512 − 289 = 223“ · „1 985 + 3 020 = 5 005“ ·
//     „703 − 98 = 6 050“
//   „Überschlag rechnen“ (_m5kRechnen()) · „neu“ (_m5kNeu(): Zettel „398 + 207
//   = 4 105“, ohne Ueberschlag, Aha-Gedaechtnis geloescht)
// Eine Sprungmarke setzt den Zettel neu und loescht den Ueberschlag.
//
// Statuszeilen (woertlich; alle Endwerte mit mindestens 19 Zeichen, damit
// simcheck/simfakten.js sie in den Faktendump nimmt):
//   _m5k-zettel      „Auf dem Zettel: 398 + 207 = 4 105“ (sofort bei der Wahl)
//   _m5k-ueberschlag „Überschlag: …“, nach „Überschlag rechnen“ (Ende der
//                    Phase zeile, 1,05 s) „Überschlag: 400 + 200 = 600“
//   _m5k-abstand     „Abstand zum Überschlag: …“, nach „Überschlag rechnen“
//                    (Ende der Klammer, 1,8 s) „Abstand zum Überschlag: 3 505“
//
// Werte (jede Zahl auf ihre erste Stelle; nachgerechnet mit simcheck/werte.js):
//   398 + 207 = 4 105     400 + 200 = 600        Abstand 3 505
//   512 − 289 = 223       500 − 300 = 200        Abstand 23
//   1 985 + 3 020 = 5 005 2 000 + 3 000 = 5 000  Abstand 5
//   703 − 98 = 6 050      700 − 100 = 600        Abstand 5 450
//   kleine Strahlen: 300–400 / 200–300 · 500–600 / 200–300 ·
//                    1 000–2 000 / 3 000–4 000 · 700–800 / 90–100
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Steht die Klammer zum ersten
// Mal in der Sitzung und ist der Abstand groesser als der halbe Ueberschlag
// (4 105 gegen 600, 6 050 gegen 600 – nicht 223 gegen 200, nicht 5 005 gegen
// 5 000), laeuft ein goldener Lichtring um die Klammer: 4 105 liegt weit weg
// vom blauen Punkt. Das widerlegt „der Taschenrechner rechnet immer richtig“
// und „ohne genaues Rechnen kann man das nicht sagen“. Einmal je Sitzung,
// „neu“ setzt es zurueck.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „gerundet“, „runden“,
// „nach“, „stimmt“, „falsch“ – auch nicht als Wortteil („danach“,
// „Nachbarzahl“), und kein Satz, der sagt, ob das Zettel-Ergebnis passt. Das
// entscheidet das Kind. Keine Namen, keine Punkte, keine Zeit.
// Deterministisch, ohne Zufall: jede Zahl im Bild kommt aus _m5kRechnung().
// ════════════════════════════════════════════════════════════════════════
let _m5k = null;
const _m5kAUFGABEN = {
  a: { a: 398,  op: '+',      b: 207,  r: 4105 },
  b: { a: 512,  op: '−', b: 289,  r: 223 },
  c: { a: 1985, op: '+',      b: 3020, r: 5005 },
  d: { a: 703,  op: '−', b: 98,   r: 6050 }
};
const _m5kREIHE = ['a', 'b', 'c', 'd'];
const _m5kPHASEN = ['rollen', 'zeile', 'fallen', 'klammer'];
const _m5kK = {
  ZY: 3, ZH: 32,                           // Zettel: Oberkante, Hoehe
  ML: [[32, 180], [240, 388]], MY: 80,     // kleine Strahlen: x von/bis, Hoehe
  MOPX: 210,                               // Rechenzeichen dazwischen
  RY: 110, RH: 22,                         // Zeile fuer den Ueberschlag
  KY: 146,                                 // Klammer
  OY: 159, BY: 181, FH: 18,                // Faehnchen orange / blau
  X0: 30, X1: 390, LY: 212, MAX: 7000,     // grosser Strahl: 0 bei X0, 7 000 bei X1
  R: 6.5,                                  // Kugelradius
  T_ZETTEL: 0.5, T_FAHNE: 0.6,             // s: Zettel faellt herein, Faehnchen fliegt
  DAUER: { rollen: 0.65, zeile: 0.4, fallen: 0.4, klammer: 0.35 },
  LEUCHT: 2.5, GLANZ: 1.6,                 // s: Abstand leuchtet / Ende leuchtet
  F_ORANGE: '#c2410c', F_ORANGE_GRUND: '#fff7ed',
  F_BLAU: '#1d4ed8', F_BLAU_GRUND: '#eff6ff',
  F_KLAMMER: '#6d28d9', F_STRAHL: '#1e293b', F_TEXT: '#1f2937', F_GRAU: '#475569'
};

// 4105 -> "4 105" mit geschuetztem Leerzeichen (im Heft steht ein normales)
function _m5kFmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
// Stellenwert der ersten Ziffer: 398 -> 100, 98 -> 10, 1 985 -> 1 000
function _m5kStelle(n) {
  let s = 1;
  while (s * 10 <= n) s *= 10;
  return s;
}
// Die glatten Zahlen an der ersten Stelle und die, zu der die Kugel rollt
// (die naehere; bei gleichem Abstand die obere).
function _m5kNachbar(n) {
  const s = _m5kStelle(n), lo = Math.floor(n / s) * s, hi = lo + s;
  return { s, lo, hi, ziel: (n - lo) < (hi - n) ? lo : hi };
}
// Alles, was am Bildschirm als Zahl steht, kommt von hier.
function _m5kRechnung(k) {
  const A = _m5kAUFGABEN[k], na = _m5kNachbar(A.a), nb = _m5kNachbar(A.b);
  const u = A.op === '+' ? na.ziel + nb.ziel : na.ziel - nb.ziel;
  return { A, na, nb, ga: na.ziel, gb: nb.ziel, u, abstand: Math.abs(A.r - u) };
}
function _m5kX(v) {
  const K = _m5kK;
  return K.X0 + v / K.MAX * (K.X1 - K.X0);
}

function _m5kInit() {
  _m5k = { k: 'a', t: 0, ein: 0, phase: null, pt: 0, zeigeU: false, zeigeA: false,
           glanz: 0, leucht: 0, aha: false, fx: { teile: [] } };
}
function _m5kHTML() {
  const knopf = k => {
    const A = _m5kAUFGABEN[k];
    return `<button class="sim-btn" id="_m5k-b-${k}" onclick="_m5kZettel('${k}')">${_m5kFmt(A.a)} ${A.op} ${_m5kFmt(A.b)} = ${_m5kFmt(A.r)}</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie weit liegt das Ergebnis vom Überschlag entfernt?</h3>
    <div class="fpm-note" style="margin-top:2px">Oben liegt ein Zettel mit einer Aufgabe und ihrem Ergebnis. Das orange Fähnchen zeigt dieses Ergebnis am Zahlenstrahl.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5k-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5kREIHE.map(knopf).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_m5k-rechnen" onclick="_m5kRechnen()">Überschlag rechnen</button>
          <button class="sim-btn" onclick="_m5kNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5k-zettel" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5k-ueberschlag" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5k-abstand" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">„Überschlag rechnen“ lässt beide Zahlen zu einer glatten Zahl rollen. Der blaue Punkt zeigt den Überschlag, die Klammer den Abstand.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Zettel 398 + 207 = 4&nbsp;105, noch ohne Überschlag</p>
  </div>`;
}
function _m5kZeile(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}
function _m5kLaeuft() {
  return !!(_m5k && _m5k.phase && _m5k.phase !== 'fertig');
}
function _m5kStatus() {
  if (!_m5k) return;
  const z = _m5k, K = _m5kK, R = _m5kRechnung(z.k), A = R.A;
  const b = (farbe, s) => '<b style="color:' + farbe + '">' + s + '</b>';
  _m5kZeile('_m5k-zettel', 'Auf dem Zettel: ' + _m5kFmt(A.a) + ' ' + A.op + ' ' +
            _m5kFmt(A.b) + ' = ' + b(K.F_ORANGE, _m5kFmt(A.r)));
  _m5kZeile('_m5k-ueberschlag', 'Überschlag: ' + (z.zeigeU
            ? _m5kFmt(R.ga) + ' ' + A.op + ' ' + _m5kFmt(R.gb) + ' = ' + b(K.F_BLAU, _m5kFmt(R.u))
            : '…'));
  _m5kZeile('_m5k-abstand', 'Abstand zum Überschlag: ' +
            (z.zeigeA ? b(K.F_KLAMMER, _m5kFmt(R.abstand)) : '…'));
  for (const k of _m5kREIHE) {
    const e = document.getElementById('_m5k-b-' + k);
    if (e && e.classList) e.classList.toggle('primary', k === z.k);
  }
  const rb = document.getElementById('_m5k-rechnen');
  if (rb) {
    const l = _m5kLaeuft();
    rb.disabled = l;
    rb.style.opacity = l ? '0.45' : '';
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m5kZettel(k) {
  if (!_m5k || !_m5kAUFGABEN[k]) return;
  const z = _m5k;
  z.k = k; z.ein = 0; z.phase = null; z.pt = 0;
  z.zeigeU = false; z.zeigeA = false; z.glanz = 0; z.leucht = 0;
  _m5kStatus();
}
function _m5kRechnen() {
  if (!_m5k) return;
  const z = _m5k;
  if (_m5kLaeuft()) return;                       // laeuft noch: weiterlaufen lassen
  z.ein = Math.max(z.ein, 5);                     // Zettel und Faehnchen stehen sofort
  z.phase = 'rollen'; z.pt = 0;
  z.zeigeU = false; z.zeigeA = false; z.glanz = 0; z.leucht = 0;
  _m5kStatus();
}
function _m5kNeu() {
  if (!_m5k) return;
  _m5k.aha = false;
  _m5k.fx.teile.length = 0;
  _m5kZettel('a');
}
// Fortschritt (0 bis 1) einer Phase, gemessen am jetzigen Stand.
function _m5kFort(name) {
  const z = _m5k;
  if (!z.phase) return 0;
  if (z.phase === 'fertig') return 1;
  const i = _m5kPHASEN.indexOf(z.phase), j = _m5kPHASEN.indexOf(name);
  if (j < i) return 1;
  if (j > i) return 0;
  return Math.min(1, z.pt / _m5kK.DAUER[name]);
}
// Die Klammer steht: Abstand zeigen, Aha pruefen.
function _m5kFertig() {
  const z = _m5k, K = _m5kK, R = _m5kRechnung(z.k);
  z.phase = 'fertig'; z.pt = 0;
  z.zeigeA = true; z.leucht = K.LEUCHT;
  if (!z.aha && R.abstand * 2 > R.u) {
    z.aha = true;
    const xa = _m5kX(R.u), xb = _m5kX(R.A.r);
    _bioFxWelle(z.fx.teile, (xa + xb) / 2, K.KY, '#fcd34d',
                Math.max(44, Math.min(110, Math.abs(xb - xa) / 2 + 14)));
  }
  _m5kStatus();
}

function _m5kUpdate(dt) {
  if (!_m5k) return;
  dt = _bioFxDt(dt);
  const z = _m5k, K = _m5kK;
  z.t += dt;
  z.ein += dt;
  if (_m5kLaeuft()) {
    z.pt += dt;
    if (z.pt >= K.DAUER[z.phase]) {
      if (z.phase === 'rollen') { z.phase = 'zeile'; z.pt = 0; z.glanz = K.GLANZ; }
      else if (z.phase === 'zeile') { z.phase = 'fallen'; z.pt = 0; z.zeigeU = true; _m5kStatus(); }
      else if (z.phase === 'fallen') { z.phase = 'klammer'; z.pt = 0; }
      else _m5kFertig();
    }
  }
  if (z.glanz > 0) z.glanz = Math.max(0, z.glanz - dt);
  if (z.leucht > 0) z.leucht = Math.max(0, z.leucht - dt);
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ─────────────────────────────────────────────────────────────
function _m5kText(ctx, s, x, y, ausr, farbe, groesse, gew) {
  ctx.fillStyle = farbe || _m5kK.F_TEXT;
  ctx.font = (gew || '700') + ' ' + (groesse || 14) + 'px sans-serif';
  ctx.textAlign = ausr || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Eine Zeile aus Stuecken, mittig um `mitte`; liefert die Lage jedes Stuecks.
function _m5kTeile(ctx, liste, groesse, mitte) {
  ctx.font = '700 ' + groesse + 'px sans-serif';
  let w = 0;
  const t = liste.map(s => { const b = ctx.measureText(s).width; w += b; return { s, w: b }; });
  let x = mitte - w / 2;
  for (const e of t) { e.x = x; e.cx = x + e.w / 2; x += e.w; }
  return { t, w };
}
// Faehnchen: Kasten mit Zahl, Mitte (cx, cy). Liefert die Kastenmasse.
function _m5kPille(ctx, txt, cx, cy, farbe, grund, groesse, W) {
  ctx.font = '700 ' + groesse + 'px sans-serif';
  const pw = ctx.measureText(txt).width + 16, ph = groesse + 5;
  const x = Math.max(3, Math.min(W - 3 - pw, cx - pw / 2));
  ctx.fillStyle = grund; ctx.strokeStyle = farbe; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, x, cy - ph / 2, pw, ph, 6); ctx.fill(); ctx.stroke();
  _m5kText(ctx, txt, x + pw / 2, cy + groesse * 0.36, 'center', farbe, groesse);
  return { x, w: pw, h: ph };
}

// Ruhiges Nachleuchten um einen Kasten (0,8 Hz, Deckkraft 45–85 %) – ein Rahmen,
// keine Scheibe: so bleibt alles darum herum lesbar.
function _m5kGlimmen(ctx, x, y, w, h, t, farbe, a) {
  if (!(a > 0.01)) return;
  const puls = 0.5 + 0.5 * Math.sin((t || 0) * Math.PI * 2 * 0.8);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = 'rgba(' + farbe + ',' + (0.45 + 0.4 * puls).toFixed(3) + ')';
  ctx.lineWidth = 3 + 1.5 * puls;
  _bioFxRundRect(ctx, x - 4, y - 4, w + 8, h + 8, 9); ctx.stroke();
  ctx.restore();
}

function _m5kZettelZeichnen(ctx, W) {
  const z = _m5k, K = _m5kK, A = _m5kAUFGABEN[z.k];
  const e = _bioFxEase.raus(_bioFxKlemme(z.ein / K.T_ZETTEL));
  const T = _m5kTeile(ctx, [_m5kFmt(A.a), ' ' + A.op + ' ', _m5kFmt(A.b), ' = ', _m5kFmt(A.r)],
                      21, W / 2);
  const bw = Math.max(230, T.w + 56), bx = W / 2 - bw / 2, by = K.ZY - 44 * (1 - e), bh = K.ZH;
  ctx.save();
  ctx.globalAlpha = 0.25 + 0.75 * e;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';                 // Schatten
  _bioFxRundRect(ctx, bx + 3, by + 3, bw, bh, 4); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, bx, by, bw, bh, 4); ctx.fill();
  ctx.strokeStyle = '#d6e4f5'; ctx.lineWidth = 1;          // Karo
  for (let x = bx + 8; x < bx + bw - 3; x += 8) {
    ctx.beginPath(); ctx.moveTo(x, by + 1); ctx.lineTo(x, by + bh - 1); ctx.stroke();
  }
  for (let y = by + 8; y < by + bh - 3; y += 8) {
    ctx.beginPath(); ctx.moveTo(bx + 1, y); ctx.lineTo(bx + bw - 1, y); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, bx, by, bw, bh, 4); ctx.stroke();
  const base = by + 23;
  // jedes Stueck mittig auf seinen Platz (Leerzeichen nur fuer den Abstand)
  T.t.forEach((s, i) => _m5kText(ctx, s.s.trim(), s.cx, base, 'center', i === 4 ? K.F_ORANGE : K.F_TEXT, 21));
  const r = T.t[4];                                       // Ergebnis orange unterstrichen
  ctx.strokeStyle = K.F_ORANGE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(r.x + 1, base + 4); ctx.lineTo(r.x + r.w - 1, base + 4); ctx.stroke();
  ctx.restore();
  return { r: { cx: r.cx, y: base + 6 } };
}

// Die beiden kleinen Strahlen; liefert die Lage der beiden Faehnchen.
function _m5kMini(ctx, W) {
  const z = _m5k, K = _m5kK, A = _m5kAUFGABEN[z.k];
  const sicht = _bioFxKlemme((z.ein - 0.15) / 0.35);
  const pr = _m5kFort('rollen'), e = _bioFxEase.sanft(pr);
  const flaggen = [];
  ctx.save();
  ctx.globalAlpha = sicht;
  [A.a, A.b].forEach((n, i) => {
    const nb = _m5kNachbar(n), x0 = K.ML[i][0], x1 = K.ML[i][1], y = K.MY, L = x1 - x0;
    const X = v => x0 + (v - nb.lo) / nb.s * L;
    ctx.strokeStyle = K.F_STRAHL; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0 - 8, y); ctx.lineTo(x1 + 8, y); ctx.stroke();
    for (let k = 0; k <= 10; k++) {
      const x = x0 + k / 10 * L;
      if (k === 0 || k === 10) {
        ctx.strokeStyle = K.F_STRAHL; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(x, y - 9); ctx.lineTo(x, y + 9); ctx.stroke();
      } else if (k === 5) {                                // Haelfte: gestrichelt, ohne Zahl
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
        if (ctx.setLineDash) ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x, y + 6); ctx.stroke();
        if (ctx.setLineDash) ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke();
      }
    }
    // die beiden Enden; das, wo die Kugel liegt, golden
    for (const [v, x] of [[nb.lo, x0], [nb.hi, x1]]) {
      const txt = _m5kFmt(v);
      ctx.font = '700 13px sans-serif';
      const tw = ctx.measureText(txt).width;
      if (pr >= 1 && v === nb.ziel) {
        if (z.glanz > 0)
          _m5kGlimmen(ctx, x - tw / 2 - 6, y + 7, tw + 12, 19, z.t,
                      '245,158,11', sicht * Math.min(1, z.glanz / 0.6));
        ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
        _bioFxRundRect(ctx, x - tw / 2 - 6, y + 7, tw + 12, 19, 6); ctx.fill(); ctx.stroke();
      }
      _m5kText(ctx, txt, x, y + 21, 'center', '#334155', 13);
    }
    // Kugel
    const p = n + (nb.ziel - n) * e, xb = X(p), r = K.R, cy = y - 1.5 - r;
    const dreh = (xb - X(n)) / r;
    ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(xb, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 1.6;                                   // Streifen dreht sich mit
    ctx.beginPath();
    ctx.moveTo(xb - Math.cos(dreh) * r * 0.75, cy - Math.sin(dreh) * r * 0.75);
    ctx.lineTo(xb + Math.cos(dreh) * r * 0.75, cy + Math.sin(dreh) * r * 0.75);
    ctx.stroke();
    // Faehnchen ueber der Kugel: erst die Zahl, nach dem Rollen die glatte Zahl
    const da = pr >= 1, txt = _m5kFmt(da ? nb.ziel : n), farbe = da ? K.F_BLAU : '#1e3a8a';
    ctx.font = '700 14px sans-serif';
    const pw = ctx.measureText(txt).width + 16, ph = K.FH;
    const px = Math.max(x0 - 16, Math.min(x1 + 16 - pw, xb - pw / 2)), py = y - 40;
    ctx.strokeStyle = farbe; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(xb, py + ph); ctx.lineTo(xb, cy - r); ctx.stroke();
    ctx.fillStyle = da ? K.F_BLAU_GRUND : '#ffffff'; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, px, py, pw, ph, 6); ctx.fill(); ctx.stroke();
    _m5kText(ctx, txt, px + pw / 2, py + 14, 'center', farbe, 14);
    flaggen.push({ cx: px + pw / 2, base: py + 14 });
  });
  _m5kText(ctx, A.op, K.MOPX, K.MY + 2, 'center', K.F_STRAHL, 24);
  ctx.restore();
  return flaggen;
}

// Die Zeile fuer den Ueberschlag; liefert die Lage seines Ergebnisses.
function _m5kZeileZeichnen(ctx, W, flaggen) {
  const z = _m5k, K = _m5kK, R = _m5kRechnung(z.k), A = R.A;
  const T = _m5kTeile(ctx, [_m5kFmt(R.ga), ' ' + A.op + ' ', _m5kFmt(R.gb), ' = ', _m5kFmt(R.u)],
                      18, W / 2);
  const bw = Math.max(170, T.w + 40), bx = W / 2 - bw / 2, by = K.RY, bh = K.RH, base = by + 17;
  const pz = _m5kFort('zeile');
  ctx.save();
  ctx.globalAlpha = _bioFxKlemme((z.ein - 0.15) / 0.35);
  if (pz > 0) {
    ctx.fillStyle = K.F_BLAU_GRUND;
    _bioFxRundRect(ctx, bx, by, bw, bh, 8); ctx.fill();
    ctx.strokeStyle = K.F_BLAU; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, bx, by, bw, bh, 8); ctx.stroke();
  } else {
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
    if (ctx.setLineDash) ctx.setLineDash([5, 4]);
    _bioFxRundRect(ctx, bx, by, bw, bh, 8); ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
  }
  if (pz > 0) {
    const e = _bioFxEase.sanft(pz);
    [[0, flaggen[0]], [2, flaggen[1]]].forEach(([i, f]) => {   // die zwei Zahlen fliegen
      const t = T.t[i];
      const x = f.cx + (t.cx - f.cx) * e, y = f.base + (base - f.base) * e;
      _m5kText(ctx, t.s, x, y, 'center', K.F_BLAU, Math.round(14 + 4 * e));
    });
    const a = _bioFxKlemme((pz - 0.45) / 0.55);
    if (a > 0) {
      ctx.globalAlpha *= a;
      for (const i of [1, 3, 4]) _m5kText(ctx, T.t[i].s.trim(), T.t[i].cx, base, 'center', K.F_BLAU, 18);
    }
  }
  ctx.restore();
  return { ux: T.t[4].cx, uy: by + bh };
}

function _m5kStrahl(ctx, W, H) {
  const K = _m5kK;
  ctx.save();
  ctx.strokeStyle = K.F_STRAHL; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(K.X0 - 10, K.LY); ctx.lineTo(K.X1 + 12, K.LY); ctx.stroke();
  ctx.fillStyle = K.F_STRAHL;                               // Pfeilspitze
  ctx.beginPath(); ctx.moveTo(K.X1 + 22, K.LY); ctx.lineTo(K.X1 + 11, K.LY - 6);
  ctx.lineTo(K.X1 + 11, K.LY + 6); ctx.closePath(); ctx.fill();
  for (let v = 0; v <= K.MAX; v += 1000) {
    const x = _m5kX(v);
    ctx.strokeStyle = K.F_STRAHL; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x, K.LY - 8); ctx.lineTo(x, K.LY + 8); ctx.stroke();
    _m5kText(ctx, _m5kFmt(v), x, K.LY + 21, 'center', '#334155', 12);
  }
  _m5kText(ctx, 'Striche alle ' + _m5kFmt(1000), W / 2, H - 4, 'center', K.F_GRAU, 11, '600');
  ctx.restore();
}

function _m5kKlammer(ctx, W) {
  const z = _m5k, K = _m5kK, pk = _m5kFort('klammer');
  if (pk <= 0) return;
  const R = _m5kRechnung(z.k), xu = _m5kX(R.u), xr = _m5kX(R.A.r);
  const xe = xu + (xr - xu) * _bioFxEase.sanft(pk), y = K.KY;
  ctx.save();
  ctx.strokeStyle = 'rgba(109,40,217,0.5)'; ctx.lineWidth = 1.5;   // Linien zu den Punkten
  if (ctx.setLineDash) ctx.setLineDash([3, 4]);
  for (const x of [xu, xe]) { ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x, K.LY - 3); ctx.stroke(); }
  if (ctx.setLineDash) ctx.setLineDash([]);
  ctx.strokeStyle = K.F_KLAMMER; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(xu, y + 8); ctx.lineTo(xu, y); ctx.lineTo(xe, y); ctx.lineTo(xe, y + 8);
  ctx.stroke();
  if (pk >= 1) {
    const txt = _m5kFmt(R.abstand), cx = (xu + xr) / 2;
    const p = _m5kPille(ctx, txt, cx, y, K.F_KLAMMER, '#ffffff', 14, W);
    if (z.leucht > 0)
      _m5kGlimmen(ctx, p.x, y - p.h / 2, p.w, p.h, z.t, '109,40,217', Math.min(1, z.leucht / 0.8));
  }
  ctx.restore();
}

function _m5kOrange(ctx, W, zettel) {
  const z = _m5k, K = _m5kK, A = _m5kAUFGABEN[z.k];
  const u = _bioFxKlemme((z.ein - 0.3) / K.T_FAHNE);
  if (u <= 0) return;
  const xr = _m5kX(A.r), e = _bioFxEase.sanft(u), cy0 = K.OY + K.FH / 2;
  const cx = zettel.r.cx + (xr - zettel.r.cx) * e, cy = zettel.r.y + (cy0 - zettel.r.y) * e;
  ctx.save();
  if (u >= 1) {                                             // Stab und Raute auf dem Strahl
    ctx.strokeStyle = K.F_ORANGE; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(xr, cy0 + K.FH / 2); ctx.lineTo(xr, K.LY - 6); ctx.stroke();
    ctx.fillStyle = K.F_ORANGE; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(xr, K.LY - 7); ctx.lineTo(xr + 7, K.LY); ctx.lineTo(xr, K.LY + 7);
    ctx.lineTo(xr - 7, K.LY); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  _m5kPille(ctx, _m5kFmt(A.r), cx, cy, K.F_ORANGE, K.F_ORANGE_GRUND, 14, W);
  ctx.restore();
}

function _m5kBlau(ctx, W, zeile) {
  const z = _m5k, K = _m5kK, pf = _m5kFort('fallen');
  if (pf <= 0) return;
  const R = _m5kRechnung(z.k), xu = _m5kX(R.u);
  ctx.save();
  if (pf < 1) {                                             // der Punkt faellt
    const e = _bioFxEase.rein(pf);
    const x = zeile.ux + (xu - zeile.ux) * _bioFxEase.sanft(pf), y = zeile.uy + (K.LY - zeile.uy) * e;
    ctx.strokeStyle = 'rgba(29,78,216,0.35)'; ctx.lineWidth = 2;
    if (ctx.setLineDash) ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.moveTo(zeile.ux, zeile.uy); ctx.lineTo(x, y); ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
    ctx.fillStyle = '#2563eb'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, K.R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else {
    const hops = z.phase === 'klammer' ? -5 * Math.sin(Math.PI * Math.min(1, z.pt / 0.3)) : 0;
    const cy0 = K.BY + K.FH / 2 + hops;
    ctx.strokeStyle = K.F_BLAU; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(xu, cy0 + K.FH / 2); ctx.lineTo(xu, K.LY - 6); ctx.stroke();
    _m5kPille(ctx, _m5kFmt(R.u), xu, cy0, K.F_BLAU, K.F_BLAU_GRUND, 14, W);
    ctx.fillStyle = '#2563eb'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(xu, K.LY, K.R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

function _m5kDraw(ctx, cv) {
  if (!_m5k) return;
  const W = cv.width, H = cv.height, z = _m5k;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#f4f7fb');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _bioFxDraw(ctx, z.fx.teile);                // Lichtring HINTER allem anderen
  const zettel = _m5kZettelZeichnen(ctx, W);
  const flaggen = _m5kMini(ctx, W);
  const zeile = _m5kZeileZeichnen(ctx, W, flaggen);
  _m5kStrahl(ctx, W, H);
  _m5kKlammer(ctx, W);
  _m5kOrange(ctx, W, zettel);
  _m5kBlau(ctx, W, zeile);
}
