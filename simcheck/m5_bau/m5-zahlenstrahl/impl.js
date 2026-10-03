
// ════════════════════════════════════════════════════════════════════════
// MATHE 5 FOERDER – mz5 „Welche Zahl ist größer?“
// (Kennung m5-zahlenstrahl, Praefix _m5e)
//
// Was man sieht: oben ein Zahlenstrahl von 0 bis 40 000 mit Pfeil am Ende -
// lange Striche alle 10 000 mit Zahl, halblange bei jedem 5 000er, kurze alle
// 1 000 (Zehner- und Fuenferstruktur). Zwei Punkte, A blau und B orange, mit
// je einem Faehnchen, das die Zahl traegt (A-Faehnchen in der oberen Reihe,
// B-Faehnchen darunter). Bei jeder Wahl fallen beide Punkte samt Faehnchen
// von oben an ihren Platz (0,8 s, B 0,12 s spaeter).
// „Lupe an“ legt einen gelben Rahmen um den Ausschnitt des Paares auf dem
// Zahlenstrahl; aus dem Rahmen zieht sich ein Lupenkasten unter dem Strahl
// auseinander (0,8 s), mit zwei gestrichelten Linien zum Rahmen verbunden.
// Im Kasten liegt der Ausschnitt als eigener Zahlenstrahl, darauf A und B
// mit kleineren Faehnchen. „Lupe aus“ zieht ihn wieder in den Rahmen (0,45 s).
// „Ziffern untereinander“ setzt unten eine kleine Tafel ZT | T | H | Z | E:
// Zeile A blau, Zeile B orange, die Ziffern fallen Spalte fuer Spalte in
// ihre Zellen, die Einer zuerst (beide Zahlen stehen an den Einern
// ausgerichtet). Danach leuchtet die erste Spalte, in der sich die beiden
// Zeilen unterscheiden (gelb hinterlegt, ein Lichtring).
//
// Knoepfe (Profil KAPITEL1 mz5, woertlich):
//   Reihe 1 (Sprungmarken, Wahlgruppe _m5ePaar('p1'…'p4')):
//     „9 870 und 12 300“ · „4 506 und 4 560“ · „7 999 und 8 001“ ·
//     „30 012 und 3 012“
//   Reihe 2: „Lupe an“ / „Lupe aus“ (ein Knopf, _m5eLupe()) ·
//            „Ziffern untereinander“ (_m5eZiffern()) · „neu“ (_m5eNeu())
//   Start und „neu“: Paar „9 870 und 12 300“, Lupe aus, keine Tafel.
//   Ein neues Paar behaelt die Lupe (sie oeffnet sich nach der Landung neu)
//   und die Tafel (sie fuellt sich mit den neuen Ziffern).
//
// Statuszeilen (woertlich, Tausendertrenner U+00A0):
//   _m5e-a        „A: 9 870 (4 Stellen)“                (blau)
//   _m5e-b        „B: 12 300 (5 Stellen)“               (orange)
//   _m5e-lupe     „Lupe: 9 000 bis 13 000“              nur bei Lupe an
//   _m5e-ziffern  „Erste verschiedene Stelle: Zehntausender (leer und 1)“
//                 nur nach „Ziffern untereinander“
//   Alle Zeilen stehen sofort nach dem Knopfdruck; das Bild zieht in 0,8 s nach.
//
// Werte (gerechnet, nicht eingetragen: Stellenzahl = Laenge der Ziffernfolge,
// erste verschiedene Stelle = erste Spalte von ZT bis E mit ungleichem Inhalt):
//   P1  9 870 (4)  · 12 300 (5) · Zehntausender (leer und 1) · Lupe 9 000 bis 13 000
//   P2  4 506 (4)  · 4 560 (4)  · Zehner (0 und 6)          · Lupe 4 500 bis 4 600
//   P3  7 999 (4)  · 8 001 (4)  · Tausender (7 und 8)       · Lupe 7 990 bis 8 010
//   P4  30 012 (5) · 3 012 (4)  · Zehntausender (3 und leer) · Lupe 0 bis 40 000
//   Lupenstriche: P1 alle 100 (Zahl alle 1 000) · P2 alle 10 (Zahl alle 50) ·
//   P3 alle 1 (Zahl alle 5) · P4 wie der Hauptstrahl.
//
// Aha (_bioFx, ruhig, OHNE Textstreifen): bei P2 und „Lupe an“ – oben liegen
// 4 506 und 4 560 aufeinander (0,5 px auseinander), in der Lupe stehen sie
// weit auseinander; sobald die Lupe ganz offen ist, je ein Lichtring an
// beiden Punkten. Nach „Ziffern untereinander“ ein Lichtring an der
// leuchtenden Spalte.
//
// NICHT am Bildschirm (sim_plan.nicht_am_bildschirm, Merksatz und Regel):
// „größer“, „kleiner“, „links“, „rechts“, „mehr“ – auch nicht als Wortteil
// (also nicht „vergrößert“, „rechtsbündig“, „mehrere“). Die Ueberschrift ist
// deshalb nicht die Frage der Einheit („Welche Zahl ist größer?“), sondern
// „Wo stehen die Zahlen auf dem Zahlenstrahl?“. Keine Namen, keine Punkte,
// keine Zeit, kein Urteil. Deterministisch, ohne Zufall.
// ════════════════════════════════════════════════════════════════════════
let _m5e = null;
const _m5ePAARE = {
  p1: { a: 9870,  b: 12300, von: 9000, bis: 13000, fein: 100,  mitte: 500,  lang: 1000,  zahl: 1000 },
  p2: { a: 4506,  b: 4560,  von: 4500, bis: 4600,  fein: 10,   mitte: 50,   lang: 100,   zahl: 50 },
  p3: { a: 7999,  b: 8001,  von: 7990, bis: 8010,  fein: 1,    mitte: 5,    lang: 10,    zahl: 5 },
  p4: { a: 30012, b: 3012,  von: 0,    bis: 40000, fein: 1000, mitte: 5000, lang: 10000, zahl: 10000 }
};
const _m5eREIHE = ['p1', 'p2', 'p3', 'p4'];
const _m5eHAUPT = { von: 0, bis: 40000, fein: 1000, mitte: 5000, lang: 10000, zahl: 10000 };
const _m5eSTELLE = ['Zehntausender', 'Tausender', 'Hunderter', 'Zehner', 'Einer'];
const _m5eKOPF = ['ZT', 'T', 'H', 'Z', 'E'];
const _m5eK = {
  XL: 30, XR: 390,                 // Hauptstrahl: 0 bei XL, 40 000 bei XR
  YS: 74,                          // Hoehe des Hauptstrahls
  FA: 6, FB: 30, FH: 20,           // Faehnchen oben: Reihe A, Reihe B, Hoehe
  BOX: [12, 106, 408, 186],        // Lupenkasten (x0, y0, x1, y1)
  LX0: 40, LX1: 380, YL: 157,      // Lupenstrahl
  LA: 111, LB: 131, LH: 17,        // Faehnchen in der Lupe
  ZY: 19,                          // Abstand Strahl -> Mitte der Zahlen darunter
  TX: 112, TY: 192, TS: 26, TW: 34, TK: 15, TR: 19,   // Tafel: x, y, Kennspalte, Spalte, Kopf, Zeile
  FLUG: 0.8, VERSATZ: 0.12, AUF: 0.8, ZU: 0.45,
  ZIF: 0.6, ZIF_STAFFEL: 0.08, ZIF_ALLE: 0.95,
  FENSTER: 12                      // Mindestbreite des Lupenrahmens oben (px)
};
const _m5eFARBE = { a: '#1d4ed8', b: '#c2410c', strahl: '#334155', text: '#1f2937',
                    lupe: '#b45309', lupeGrund: '#fffbeb', rahmen: 'rgba(251,191,36,0.32)',
                    licht: '#fcd34d', hell: 'rgba(250,204,21,0.45)' };

// ── Rechnen (alles, was angezeigt wird, kommt von hier) ──────────────────
function _m5eZahl(n) {
  const s = String(n);
  let o = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) o += ' ';
    o += s[i];
  }
  return o;
}
function _m5eStellen(n) { return String(n).length; }
// Ziffern in den Spalten ZT T H Z E, an den Einern ausgerichtet; '' = leer
function _m5eSpalten(n) {
  const s = String(n), r = ['', '', '', '', ''];
  for (let i = 0; i < s.length; i++) r[5 - s.length + i] = s[i];
  return r;
}
function _m5eErsteVerschieden(p) {
  const a = _m5eSpalten(p.a), b = _m5eSpalten(p.b);
  for (let i = 0; i < 5; i++) {
    if (a[i] !== b[i]) return { i: i, a: a[i] || 'leer', b: b[i] || 'leer' };
  }
  return null;
}
function _m5eX(v) { const K = _m5eK; return K.XL + (K.XR - K.XL) * v / _m5eHAUPT.bis; }
function _m5eGelandet() { return !!_m5e && _m5e.flug >= _m5eK.FLUG + _m5eK.VERSATZ; }

// ── Zustand, Oberflaeche, Status ─────────────────────────────────────────
function _m5eInit() {
  _m5e = { paar: 'p1', lupe: false, ziffern: false, t: 0,
           flug: 0,          // s seit der Wahl des Paares (Anflug)
           lupeK: 0,         // 0 = Lupe zu, 1 = ganz offen
           zifT: 0,          // s seit dem Fuellen der Tafel
           ahaFertig: false, ringFertig: false,
           fx: { teile: [] } };
}
function _m5eHTML() {
  const pk = (k) => {
    const p = _m5ePAARE[k];
    return `<button class="sim-btn${k === 'p1' ? ' primary' : ''}" id="_m5e-p-${k}" onclick="_m5ePaar('${k}')">${_m5eZahl(p.a)} und ${_m5eZahl(p.b)}</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wo stehen die Zahlen auf dem Zahlenstrahl?</h3>
    <div class="fpm-note" style="margin-top:2px">Jede Zahl hat auf dem Zahlenstrahl ihren festen Platz. Oben sind es von Strich zu Strich 1 000. Die Lupe zeigt einen kleinen Teil des Zahlenstrahls ganz nah.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5e-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5eREIHE.map(pk).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m5e-lupe-knopf" onclick="_m5eLupe()">Lupe an</button>
          <button class="sim-btn" id="_m5e-ziffern-knopf" onclick="_m5eZiffern()">Ziffern untereinander</button>
          <button class="sim-btn" onclick="_m5eNeu()">neu</button>
        </div>
        <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 9 870 und 12 300, Lupe aus</p>
      </div>
      <div>
        <div class="fpm-label">Die zwei Zahlen</div>
        <div class="lmp-status on" id="_m5e-a" style="margin-top:6px;color:${_m5eFARBE.a};font-weight:700"></div>
        <div class="lmp-status on" id="_m5e-b" style="margin-top:6px;color:${_m5eFARBE.b};font-weight:700"></div>
        <div class="lmp-status on" id="_m5e-lupe" style="margin-top:6px;display:none"></div>
        <div class="lmp-status on" id="_m5e-ziffern" style="margin-top:6px;display:none"></div>
        <div class="fpm-note" style="margin-top:10px">A ist blau, B ist orange. Die Fähnchen tragen die Zahlen. In der Tafel stehen die Ziffern untereinander: ZT Zehntausender, T Tausender, H Hunderter, Z Zehner, E Einer.</div>
      </div>
    </div>
  </div>`;
}
function _m5eStatus() {
  if (!_m5e) return;
  const z = _m5e, p = _m5ePAARE[z.paar];
  const setze = (id, text, zeigen) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = zeigen ? text : '';
    if (el.style) el.style.display = zeigen ? '' : 'none';
  };
  setze('_m5e-a', 'A: ' + _m5eZahl(p.a) + ' (' + _m5eStellen(p.a) + ' Stellen)', true);
  setze('_m5e-b', 'B: ' + _m5eZahl(p.b) + ' (' + _m5eStellen(p.b) + ' Stellen)', true);
  setze('_m5e-lupe', 'Lupe: ' + _m5eZahl(p.von) + ' bis ' + _m5eZahl(p.bis), z.lupe);
  const v = _m5eErsteVerschieden(p);
  setze('_m5e-ziffern', v ? 'Erste verschiedene Stelle: ' + _m5eSTELLE[v.i] + ' (' + v.a + ' und ' + v.b + ')' : '',
        z.ziffern && !!v);
  const lk = document.getElementById('_m5e-lupe-knopf');
  if (lk) {
    lk.textContent = z.lupe ? 'Lupe aus' : 'Lupe an';
    if (lk.classList) lk.classList.toggle('primary', z.lupe);
  }
  const zk = document.getElementById('_m5e-ziffern-knopf');
  if (zk && zk.classList) zk.classList.toggle('primary', z.ziffern);
  for (const k of _m5eREIHE) {
    const b = document.getElementById('_m5e-p-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.paar);
  }
}

// ── Knoepfe ──────────────────────────────────────────────────────────────
function _m5ePaar(k) {
  if (!_m5e || !_m5ePAARE[k]) return;
  const z = _m5e;
  z.paar = k; z.flug = 0;
  z.lupeK = 0; z.ahaFertig = false;      // die Lupe oeffnet sich nach der Landung neu
  z.zifT = 0; z.ringFertig = false;      // die Tafel fuellt sich neu
  _m5eStatus();
}
function _m5eLupe() {
  if (!_m5e) return;
  const z = _m5e;
  z.lupe = !z.lupe;
  if (z.lupe) z.ahaFertig = false;
  _m5eStatus();
}
function _m5eZiffern() {
  if (!_m5e) return;
  const z = _m5e;
  z.ziffern = true; z.zifT = 0; z.ringFertig = false;
  _m5eStatus();
}
function _m5eNeu() {
  if (!_m5e) return;
  _m5eInit(); _m5eStatus();
}

// ── Bewegung ─────────────────────────────────────────────────────────────
function _m5eUpdate(dt) {
  if (!_m5e) return;
  dt = _bioFxDt(dt);
  const z = _m5e, K = _m5eK;
  z.t += dt;
  z.flug += dt;
  const da = _m5eGelandet();
  if (z.lupe) {
    if (da && z.lupeK < 1) {
      z.lupeK = Math.min(1, z.lupeK + dt / K.AUF);
      if (z.lupeK >= 1 && !z.ahaFertig) {
        z.ahaFertig = true;
        // Aha: nur bei 4 506 und 4 560 - oben aufeinander, in der Lupe weit auseinander
        if (z.paar === 'p2') {
          const g = _m5eLupeGeo(1), p = _m5ePAARE[z.paar];
          _bioFxWelle(z.fx.teile, g.wert(p.a), K.YL, _m5eFARBE.licht, 30);
          _bioFxWelle(z.fx.teile, g.wert(p.b), K.YL, _m5eFARBE.licht, 30);
        }
      }
    }
  } else if (z.lupeK > 0) {
    z.lupeK = Math.max(0, z.lupeK - dt / K.ZU);
  }
  if (z.ziffern && da) {
    const vor = z.zifT;
    z.zifT += dt;
    if (vor < K.ZIF_ALLE && z.zifT >= K.ZIF_ALLE && !z.ringFertig) {
      z.ringFertig = true;
      const v = _m5eErsteVerschieden(_m5ePAARE[z.paar]);
      if (v) _bioFxWelle(z.fx.teile, K.TX + K.TS + K.TW * (v.i + 0.5), K.TY + K.TK + K.TR, _m5eFARBE.licht, 24);
    }
  }
  _bioFxAlleUpdate(z.fx, dt);
}

// ── Zeichnen ─────────────────────────────────────────────────────────────
// Lupengeometrie bei Oeffnung e (0 = im Rahmen oben, 1 = ganz offen).
function _m5eLupeGeo(e) {
  const K = _m5eK, p = _m5ePAARE[_m5e.paar];
  let w0 = _m5eX(p.von), w1 = _m5eX(p.bis);
  if (w1 - w0 < K.FENSTER) { const m = (w0 + w1) / 2; w0 = m - K.FENSTER / 2; w1 = m + K.FENSTER / 2; }
  const fen = { x0: w0 - 4, y0: K.YS - 11, x1: w1 + 4, y1: K.YS + 10 };
  const L = (a, b) => a + (b - a) * e;
  const box = { x0: L(fen.x0, K.BOX[0]), y0: L(fen.y0, K.BOX[1]), x1: L(fen.x1, K.BOX[2]), y1: L(fen.y1, K.BOX[3]) };
  const lx0 = L(w0, K.LX0), lx1 = L(w1, K.LX1), ly = L(K.YS, K.YL);
  return { fen, box, lx0, lx1, ly,
           wert: (v) => lx0 + (lx1 - lx0) * (v - p.von) / (p.bis - p.von) };
}
function _m5eText(ctx, s, x, y, farbe, groesse, ausr, gewicht) {
  ctx.fillStyle = farbe || _m5eFARBE.text;
  ctx.font = (gewicht || '600') + ' ' + (groesse || 12) + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}
// Ein Zahlenstrahl-Stueck von x0 bis x1 fuer die Werte von..bis.
// st: Strichabstaende (fein, mitte, lang) und Zahlabstand (zahl).
function _m5eStrahl(ctx, x0, x1, y, von, bis, st, aStriche, aZahlen, pfeil, grund) {
  ctx.save();
  ctx.strokeStyle = _m5eFARBE.strahl; ctx.lineCap = 'round';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(pfeil ? x1 + 11 : x1, y); ctx.stroke();
  if (pfeil) {
    ctx.fillStyle = _m5eFARBE.strahl;
    ctx.beginPath(); ctx.moveTo(x1 + 18, y); ctx.lineTo(x1 + 8, y - 5); ctx.lineTo(x1 + 8, y + 5); ctx.closePath(); ctx.fill();
  } else {
    // ein Ausschnitt: der Strahl geht an beiden Enden weiter
    ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0 - 14, y); ctx.lineTo(x0, y); ctx.moveTo(x1, y); ctx.lineTo(x1 + 14, y); ctx.stroke();
    ctx.setLineDash([]);
  }
  const n = Math.round((bis - von) / st.fein);
  if (aStriche > 0.01) {
    ctx.globalAlpha = aStriche;
    for (let k = 0; k <= n; k++) {
      const v = von + k * st.fein, x = x0 + (x1 - x0) * k / n;
      const lang = v % st.lang === 0, mitte = v % st.mitte === 0;
      const hh = lang ? 8 : mitte ? 6 : 3.5;
      ctx.lineWidth = lang ? 1.8 : mitte ? 1.4 : 1;
      ctx.beginPath(); ctx.moveTo(x, y - hh); ctx.lineTo(x, y + hh); ctx.stroke();
    }
  }
  if (aZahlen > 0.01) {
    ctx.globalAlpha = aZahlen;
    ctx.font = '600 12px sans-serif';
    for (let k = 0; k <= n; k++) {
      const v = von + k * st.fein;
      if (v % st.zahl !== 0) continue;
      const x = x0 + (x1 - x0) * k / n, s = _m5eZahl(v);
      const w = ctx.measureText(s).width;
      // Grund hinter der Zahl: Linien der Lupe laufen hinter den Zahlen durch
      ctx.fillStyle = grund || '#ffffff'; ctx.fillRect(x - w / 2 - 3, y + _m5eK.ZY - 8, w + 6, 16);
      ctx.fillStyle = _m5eFARBE.text;
      _m5eText(ctx, s, x, y + _m5eK.ZY, _m5eFARBE.text, 12);
    }
  }
  ctx.restore();
}
function _m5ePunkt(ctx, x, y, farbe, r) {
  ctx.save();
  ctx.fillStyle = farbe; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Faehnchen: Mast vom Punkt bis zum Tuch, das Tuch traegt die Zahl.
// seite -1: Tuch vor dem Mast, +1: Tuch hinter dem Mast (weicht am Rand aus).
function _m5eFahne(ctx, x, yPunkt, yTuch, hoch, text, farbe, seite, groesse, xmin, xmax, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha == null ? 1 : alpha;
  ctx.font = '700 ' + groesse + 'px sans-serif';
  const w = Math.ceil(ctx.measureText(text).width) + 16;
  let s = seite;
  if (s < 0 && x - w < xmin) s = 1;
  if (s > 0 && x + w > xmax) s = -1;
  const t0 = s < 0 ? x - w : x;
  ctx.strokeStyle = farbe; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(x, yPunkt); ctx.lineTo(x, yTuch); ctx.stroke();
  ctx.fillStyle = farbe;
  _bioFxRundRect(ctx, t0, yTuch, w, hoch, 4); ctx.fill();
  _m5eText(ctx, text, t0 + w / 2, yTuch + hoch / 2 + 1, '#ffffff', groesse, 'center', '700');
  ctx.restore();
}
// Rahmen oben und Trichter: zwei gestrichelte Linien vom Rahmen zum Kasten.
// Wird VOR dem Hauptstrahl gezeichnet, damit die Linien hinter den Zahlen laufen.
function _m5eLupeRahmen(ctx) {
  const z = _m5e, F = _m5eFARBE;
  const g0 = _m5eLupeGeo(0), g = _m5eLupeGeo(_bioFxEase.sanft(z.lupeK));
  ctx.save();
  ctx.globalAlpha = Math.min(1, z.lupeK * 3);
  ctx.fillStyle = F.rahmen;
  _bioFxRundRect(ctx, g0.fen.x0, g0.fen.y0, g0.fen.x1 - g0.fen.x0, g0.fen.y1 - g0.fen.y0, 4); ctx.fill();
  ctx.strokeStyle = F.lupe; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, g0.fen.x0, g0.fen.y0, g0.fen.x1 - g0.fen.x0, g0.fen.y1 - g0.fen.y0, 4); ctx.stroke();
  ctx.lineWidth = 1.2; ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(g.fen.x0, g.fen.y1); ctx.lineTo(g.box.x0, g.box.y0);
  ctx.moveTo(g.fen.x1, g.fen.y1); ctx.lineTo(g.box.x1, g.box.y0);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
function _m5eLupeZeichnen(ctx, W) {
  const z = _m5e, K = _m5eK, F = _m5eFARBE, p = _m5ePAARE[z.paar];
  const e = _bioFxEase.sanft(z.lupeK), g = _m5eLupeGeo(e);
  ctx.save();
  // Kasten
  ctx.fillStyle = F.lupeGrund;
  _bioFxRundRect(ctx, g.box.x0, g.box.y0, g.box.x1 - g.box.x0, g.box.y1 - g.box.y0, 8); ctx.fill();
  ctx.strokeStyle = F.lupe; ctx.lineWidth = 1.6;
  _bioFxRundRect(ctx, g.box.x0, g.box.y0, g.box.x1 - g.box.x0, g.box.y1 - g.box.y0, 8); ctx.stroke();
  ctx.restore();
  // Lupenstrahl mit Strichen und Zahlen
  const aS = _bioFxKlemme((e - 0.15) / 0.4), aZ = _bioFxKlemme((e - 0.65) / 0.35);
  _m5eStrahl(ctx, g.lx0, g.lx1, g.ly, p.von, p.bis, p, aS, aZ, false, F.lupeGrund);
  // A und B in der Lupe
  const xa = g.wert(p.a), xb = g.wert(p.b), aF = _bioFxKlemme((e - 0.55) / 0.45);
  const yA = K.LA + (g.ly - K.YL), yB = K.LB + (g.ly - K.YL);
  if (aF > 0.01) {
    _m5eFahne(ctx, xa, g.ly, yA, K.LH, _m5eZahl(p.a), F.a, -1, 12, K.BOX[0] + 4, K.BOX[2] - 4, aF);
    _m5eFahne(ctx, xb, g.ly, yB, K.LH, _m5eZahl(p.b), F.b, 1, 12, K.BOX[0] + 4, K.BOX[2] - 4, aF);
  }
  _m5ePunkt(ctx, xa, g.ly, F.a, 5.5);
  _m5ePunkt(ctx, xb, g.ly, F.b, 5.5);
}
function _m5eTafel(ctx) {
  const z = _m5e, K = _m5eK, F = _m5eFARBE, p = _m5ePAARE[z.paar];
  const x0 = K.TX, y0 = K.TY, xs = x0 + K.TS, x1 = xs + 5 * K.TW, y1 = y0 + K.TK + 2 * K.TR;
  const v = _m5eErsteVerschieden(p);
  ctx.save();
  // Kopfzeile und Raster
  ctx.fillStyle = '#ffffff'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.fillStyle = '#f1f5f9'; ctx.fillRect(xs, y0, x1 - xs, K.TK);
  // leuchtende Spalte, sobald alle Ziffern stehen
  const aH = _bioFxKlemme((z.zifT - K.ZIF_ALLE) / 0.3);
  if (v && aH > 0) {
    ctx.globalAlpha = aH;
    ctx.fillStyle = F.hell; ctx.fillRect(xs + K.TW * v.i, y0, K.TW, y1 - y0);
    ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 2;
    ctx.strokeRect(xs + K.TW * v.i + 1, y0 + 1, K.TW - 2, y1 - y0 - 2);
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  ctx.strokeRect(xs, y0, x1 - xs, y1 - y0);
  ctx.beginPath();
  for (let c = 1; c < 5; c++) { ctx.moveTo(xs + c * K.TW, y0); ctx.lineTo(xs + c * K.TW, y1); }
  ctx.moveTo(xs, y0 + K.TK); ctx.lineTo(x1, y0 + K.TK);
  ctx.moveTo(xs, y0 + K.TK + K.TR); ctx.lineTo(x1, y0 + K.TK + K.TR);
  ctx.stroke();
  for (let c = 0; c < 5; c++) _m5eText(ctx, _m5eKOPF[c], xs + K.TW * (c + 0.5), y0 + K.TK / 2 + 1, '#334155', 12, 'center', '700');
  _m5eText(ctx, 'A', x0 + K.TS / 2, y0 + K.TK + K.TR / 2 + 1, F.a, 14, 'center', '700');
  _m5eText(ctx, 'B', x0 + K.TS / 2, y0 + K.TK + K.TR * 1.5 + 1, F.b, 14, 'center', '700');
  // Ziffern fallen Spalte fuer Spalte in ihre Zelle, die Einer zuerst -
  // jede bleibt in ihrer eigenen Spalte, nichts ueberkreuzt sich.
  const reihen = [[_m5eSpalten(p.a), F.a], [_m5eSpalten(p.b), F.b]];
  reihen.forEach(([sp, farbe], r) => {
    for (let c = 0; c < 5; c++) {
      if (!sp[c]) continue;
      const t = _bioFxKlemme((z.zifT - (4 - c) * K.ZIF_STAFFEL) / K.ZIF);
      if (t <= 0) continue;
      const e = _bioFxEase.raus(t);
      ctx.globalAlpha = e;
      _m5eText(ctx, sp[c], xs + K.TW * (c + 0.5), y0 + K.TK + K.TR * (r + 0.5) + 1 - (1 - e) * 8, farbe, 16, 'center', '700');
    }
  });
  ctx.restore();
}
function _m5eDraw(ctx, cv) {
  if (!_m5e) return;
  const z = _m5e, K = _m5eK, F = _m5eFARBE, p = _m5ePAARE[z.paar];
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  // Lupenrahmen oben und Trichter (hinter dem Strahl und seinen Zahlen)
  if (z.lupeK > 0) _m5eLupeRahmen(ctx);
  // Hauptstrahl 0 bis 40 000
  _m5eStrahl(ctx, K.XL, K.XR, K.YS, _m5eHAUPT.von, _m5eHAUPT.bis, _m5eHAUPT, 1, 1, true);
  // Lupe
  if (z.lupeK > 0) _m5eLupeZeichnen(ctx, W);
  // Tafel
  if (z.ziffern) _m5eTafel(ctx);
  // A und B fallen von oben an ihren Platz
  const ea = _bioFxEase.raus(_bioFxKlemme(z.flug / K.FLUG));
  const eb = _bioFxEase.raus(_bioFxKlemme((z.flug - K.VERSATZ) / K.FLUG));
  const dya = -(1 - ea) * (K.YS + 20), dyb = -(1 - eb) * (K.YS + 20);
  const xa = _m5eX(p.a), xb = _m5eX(p.b);
  _m5eFahne(ctx, xa, K.YS + dya, K.FA + dya, K.FH, _m5eZahl(p.a), F.a, -1, 13, 2, W - 2, 1);
  _m5eFahne(ctx, xb, K.YS + dyb, K.FB + dyb, K.FH, _m5eZahl(p.b), F.b, 1, 13, 2, W - 2, 1);
  _m5ePunkt(ctx, xa, K.YS + dya, F.a, 6);
  _m5ePunkt(ctx, xb, K.YS + dyb, F.b, 6);
  _bioFxAlleDraw(ctx, z.fx);
}
