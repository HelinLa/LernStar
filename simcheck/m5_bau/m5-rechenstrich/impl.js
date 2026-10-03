
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mp1 „Wie rechnest du 46 + 37 im Kopf?“ (Kennung m5-rechenstrich)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL2_PROFIL.md, Abschnitt m5-rechenstrich.
// Ueberschrift = Frage der Einheit: „Welche Summe hat 46 + 37?“
//
// Was man sieht: oben links die Aufgabe („Aufgabe: 46 + 37“). In der Mitte
// ein Rechenstrich – eine waagerechte Linie OHNE Striche, gezeichnet fuer den
// Bereich 40 bis 90 (7,4 px je 1, damit jeder Sprung so lang ist, wie er
// zaehlt). Nur die Punkte, an denen gerechnet wird, tragen eine Zahl: als
// Faehnchen UNTER der Linie (Start dunkelblau, Zwischenergebnis orange, Ziel
// gold). Jeder Rechenschritt ist ein Bogen UEBER der Linie, beschriftet mit
// „+ 30“ usw.; ein Minus-Schritt ist ein Bogen UNTER der Linie zurueck.
// Unten ein Kasten „Rechnung“: dort steht jeder Schritt als Zeile, in DER
// Farbe seines Bogens (Sprung 1 blau, Sprung 2 violett), und blitzt kurz
// auf, sobald der Bogen landet – Bild und Zeichen sind so verbunden.
// Ist ein Weg fertig, bleibt er als duenner grauer Bogen stehen, wenn der
// naechste Weg beginnt. Nach drei Wegen enden drei verschiedene Boegen am
// selben Punkt (nur im Bild, nie als Satz).
//
// Knoepfe (Sprungmarken = Zeilen der Heft-Tabelle, woertlich) – _m5gWeg(…):
//   „erst Zehner, dann Einer“   ('zehner')    46 → + 30 → 76 → + 7 → 83
//   „Zehner und Einer getrennt“ ('getrennt')  Kaertchen „40 + 30 = 70“ und
//        „6 + 7 = 13“ fliegen oben ein; unter der 13 teilt sie sich in
//        „1 Z“ und „3 E“; die 70 faellt auf den Rechenstrich, eine blaue
//        Zehnerstange (10 Wuerfel) und 3 gruene Einerwuerfel legen sich von 70
//        bis 83 auf die Linie; dann ein Sprung „+ 13“ von 70 nach 83.
//   „bis 50, dann weiter“       ('fuenfzig')  46 → + 4 → 50 → + 33 → 83
//   „plus 40, dann minus 3“     ('minus')     46 → + 40 → 86 → − 3 → 83
//                                              (der − 3 ist ein Bogen UNTER der Linie)
//   „nebeneinander schreiben“   ('neben')     Gegenprobe zu Tareks Weg: dieselben
//        Kaertchen, dann ruecken die Ergebnisse 70 und 13 als Plaettchen
//        aneinander: die 13 schiebt sich auf die 0 der 70, die 0 verblasst,
//        es steht „713“ da. Ein gestrichelter Pfeil zeigt aus dem
//        Rechenstrich hinaus, im Bild steht „713 passt nicht auf diesen
//        Rechenstrich“, im Rechnungskasten „7 Zehner und 13 Einer
//        nebeneinander: 713“. Der Punkt 46 bleibt blass stehen.
//        (Der Bauplan nennt den Knopf „Tareks Weg“ – eine Simulation traegt
//        keine Figurennamen, MATHE_PROFIL § 10 Regel 11; Kapitel 1 benennt
//        die Gegenprobe ebenso nach der Handlung: „ohne leere Stellen schreiben“.)
//   „neu“ (_m5gNeu()): nur der Startpunkt 46, keine grauen Boegen, Aha-
//        Gedaechtnis geloescht.
// Ein Knopf waehrend eines laufenden Weges startet sofort den neuen Weg; der
// alte blendet in 0,2 s aus. Jede Knopffolge ergibt am Ende denselben Zustand.
//
// Zeiten (s, ab Knopfdruck): Sprungwege 0,2 Vorlauf, Sprung 1 0,2–0,8, Sprung 2
// 0,95–1,55. „getrennt“: Kaertchen 0,2–0,5 und 0,3–0,6, Teilen 0,6–0,85,
// Fallen 0,85–1,15, Sprung + 13 1,15–1,65. „nebeneinander“: Kaertchen wie oben,
// Zusammenruecken 0,65–1,15, Pfeil 1,15–1,55. Alles ist nach hoechstens 1,65 s
// fertig (simfakten.js liest mit --frames=25 --verlauf=4 bis 2,0 s ab).
//
// Statuszeilen (woertlich; jede, deren Wert das Heft verlangt, hat mehr als
// 18 Zeichen, sonst fehlt sie im Faktendump):
//   _m5g-weg       „Rechenweg: erst Zehner, dann Einer“ (Start: „Rechenweg: noch
//                  nicht gewählt“) – sofort beim Knopfdruck
//   _m5g-rechnung  „Rechnung: …“, waechst mit jeder Landung:
//                  „Rechnung: 46 + 30 = 76“ → „Rechnung: 46 + 30 = 76, 76 + 7 = 83“
//   _m5g-zwischen  „Zwischenergebnis: …“ → „Zwischenergebnis: 76“
//   _m5g-summe     „Ergebnis der Aufgabe: …“ → „Ergebnis der Aufgabe: 83“;
//                  beim Weg „nebeneinander schreiben“:
//                  „Nebeneinander geschrieben: …“ → „Nebeneinander geschrieben: 713“
//
// Werte (jeder Endwert nachgerechnet mit simcheck/werte.js):
//   erst Zehner, dann Einer   46 + 30 = 76, 76 + 7 = 83            · 76         · 83
//   Zehner und Einer getrennt 40 + 30 = 70, 6 + 7 = 13, 70 + 13 = 83 · 70 und 13 · 83
//   bis 50, dann weiter       46 + 4 = 50, 50 + 33 = 83            · 50         · 83
//   plus 40, dann minus 3     46 + 40 = 86, 86 − 3 = 83            · 86         · 83
//   nebeneinander schreiben   40 + 30 = 70, 6 + 7 = 13             · 70 und 13  · Nebeneinander geschrieben: 713
// Alle Zahlen kommen aus EINER Rechnung (_m5gPlan) mit A = 46, B = 37: Zehner
// und Einer werden zerlegt, die Spruenge daraus gebildet (+ 4 = 50 − 46,
// + 40 = naechster Zehner ueber 37, − 3 = 37 − 40), „713“ ist die Zehnerziffer
// „7“ der 70 mit „13“ dahinter – die 13 setzt sich im Bild auf die 0 der 70
// (NICHT „70“ + „13“ = „7013“). Rechenzeichen: + und − (U+2212).
// Faehnchen dicht beieinander liegender Punkte zeigen nach aussen: 46 links /
// 50 rechts; bei 86 − 3 haengen 83 und 86 eine Stufe tiefer, schraeg nach
// aussen, und das Schild „− 3“ steht zwischen ihnen unter dem Bogen.
// Start: Punkt bei 46, kein Sprung, alle Statuszeilen mit „…“.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Landet der DRITTE verschiedene
// Weg (Gegenprobe nicht mitgezaehlt) wieder bei 83, laufen zwei Lichtringe um
// das Ziel; die beiden frueheren Wege stehen dabei als graue Boegen, die am
// selben Punkt enden. Einmal je Sitzung, „neu“ setzt es zurueck. Jede Landung
// auf 83 laesst das Ziel 2,5 s ruhig leuchten (_bioFxLeuchten, 0,8 Hz).
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „selben“, „gleichen“
// (auch nicht in „vergleichen“), „dazu“ – und keine Regel als Satz. Keine
// Namen, keine Punkte, keine Zeit. Deterministisch, ohne Zufall.
// ════════════════════════════════════════════════════════════════════════
let _m5g = null;
const _m5gA = 46, _m5gB = 37;                       // die Aufgabe
const _m5gWEGE = {
  zehner:   'erst Zehner, dann Einer',
  getrennt: 'Zehner und Einer getrennt',
  fuenfzig: 'bis 50, dann weiter',
  minus:    'plus 40, dann minus 3',
  neben:    'nebeneinander schreiben'
};
const _m5gREIHE = ['zehner', 'getrennt', 'fuenfzig', 'minus', 'neben'];
const _m5gK = {
  X0: 24, X1: 394, V0: 40, V1: 90,     // Rechenstrich: 40 bei x = 24, 90 bei x = 394
  LY: 120,                             // Hoehe der Linie
  FY: 14, FH: 24,                      // Faehnchen: Abstand unter der Linie, Hoehe
  KY: 6, KH: 32,                       // Kaertchen oben
  RY: 192,                             // Rechnungskasten
  T_VOR: 0.2, T_SPRUNG: 0.6, T_PAUSE: 0.15,
  T_KARTE: 0.3, T_TEIL: 0.25, T_FALL: 0.3, T_SPRUNG13: 0.5, T_SCHIEB: 0.5, T_PFEIL: 0.4,
  LEUCHT: 2.5, BLITZ: 0.8, POP: 0.22,
  F_S1: '#1d4ed8', F_S2: '#7c3aed', F_Z: '#1d4ed8', F_E: '#15803d', F_NEBEN: '#c2410c',
  F_LINIE: '#1e293b', F_GEIST: '#b8c2d1'
};
const _m5gFLAGGE = {                  // Rand, Grund, Schrift, Punkt
  start:    ['#1e3a8a', '#ffffff', '#1e3a8a', '#1e3a8a'],
  zwischen: ['#c2410c', '#fff7ed', '#9a3412', '#ea580c'],
  ziel:     ['#b45309', '#fef3c7', '#92400e', '#f59e0b']
};

function _m5gX(v) {
  const K = _m5gK;
  return K.X0 + (v - K.V0) * (K.X1 - K.X0) / (K.V1 - K.V0);
}

// ── Der Plan eines Weges: jede Zahl, jede Zeile, jede Zeit ─────────────────
function _m5gPlan(key) {
  const K = _m5gK, A = _m5gA, B = _m5gB;
  const zA = A - A % 10, eA = A % 10, zB = B - B % 10, eB = B % 10;   // 40, 6, 30, 7
  const p = { key, start: A, startAb: 0, startBlass: false, spruenge: [], zeilen: [],
              flaggen: [], ereignisse: [], karten: null, teil: null, fall: null,
              schieb: null, pfeil: null, ende: 0 };
  const zeile = (text, farbe, t, nurBild) => {
    p.zeilen.push({ text, farbe, t });
    p.ereignisse.push({ t, art: 'zeile', text, nurBild: !!nurBild });
  };
  if (key === 'getrennt' || key === 'neben') {
    const k1 = { text: zA + ' + ' + zB + ' = ' + (zA + zB), erg: String(zA + zB), farbe: K.F_Z,
                 t0: K.T_VOR, t1: K.T_VOR + K.T_KARTE };
    const k2 = { text: eA + ' + ' + eB + ' = ' + (eA + eB), erg: String(eA + eB), farbe: K.F_E,
                 t0: K.T_VOR + 0.1, t1: K.T_VOR + 0.1 + K.T_KARTE };
    p.karten = [k1, k2];
    zeile(k1.text, k1.farbe, k1.t1);
    zeile(k2.text, k2.farbe, k2.t1);
    p.ereignisse.push({ t: k2.t1, art: 'zwischen', text: (zA + zB) + ' und ' + (eA + eB) });
    if (key === 'getrennt') {
      const v0 = zA + zB, d = eA + eB, v1 = v0 + d;                    // 70, 13, 83
      const tTeil = k2.t1, tFall = tTeil + K.T_TEIL, tSpr = tFall + K.T_FALL, tZ = tSpr + K.T_SPRUNG13;
      p.teil = { t0: tTeil, t1: tFall, z: Math.floor(d / 10), e: d % 10 };
      p.fall = { t0: tFall, t1: tSpr, v: v0, z: Math.floor(d / 10), e: d % 10 };
      p.start = v0; p.startAb = tSpr;
      p.spruenge.push({ von: v0, nach: v1, d, s: tSpr, dauer: K.T_SPRUNG13, farbe: K.F_S2 });
      zeile(v0 + ' + ' + d + ' = ' + v1, K.F_S2, tZ);
      p.flaggen.push({ v: v0, text: String(v0), art: 'start', dir: 'M', t: tSpr });
      p.flaggen.push({ v: v1, text: String(v1), art: 'ziel', dir: 'M', t: tZ });
      p.ereignisse.push({ t: tZ, art: 'ziel', wert: v1 });
      p.ende = tZ;
    } else {
      // Tareks Weg: die Zehnerziffer 7 und die 13 nebeneinander – die 13
      // setzt sich auf die Einerstelle der 70 (die 0 verschwindet): „713“.
      const zz = String((zA + zB) / 10), neben = zz + String(eA + eB);   // "7" + "13"
      const tS = k2.t1 + 0.05, tP = tS + K.T_SCHIEB;
      p.schieb = { t0: tS, t1: tP, links: String(zA + zB), ziffer: zz, rechts: String(eA + eB), text: neben };
      p.pfeil = { t0: tP, t1: tP + K.T_PFEIL, text: neben + ' passt nicht auf diesen Rechenstrich' };
      zeile(zz + ' Zehner und ' + (eA + eB) + ' Einer nebeneinander: ' + neben, K.F_NEBEN, tP, true);
      p.ereignisse.push({ t: tP, art: 'neben', text: neben });
      p.startBlass = true;
      p.flaggen.push({ v: A, text: String(A), art: 'start', dir: 'M', t: 0 });
      p.ende = tP + K.T_PFEIL;
    }
  } else {
    let d;
    if (key === 'zehner') d = [zB, eB];                                  // + 30, + 7
    else if (key === 'fuenfzig') { const bis = zA + 10 - A; d = [bis, B - bis]; }   // + 4, + 33
    else { const auf = zB + 10; d = [auf, B - auf]; }                    // + 40, − 3
    // Lage der Faehnchen [dir, dx, ebene]: dicht beieinander liegende Punkte
    // (46/50, 83/86) bekommen Faehnchen, die nach aussen zeigen.
    const lagen = { zehner:   [['M', 0, 0], ['M', 0, 0], ['M', 0, 0]],
                    fuenfzig: [['L', 0, 0], ['R', 0, 0], ['M', 0, 0]],
                    minus:    [['M', 0, 0], ['M', 32, 1], ['M', -32, 1]] }[key];
    const fl = (v, art, i, t) => ({ v, text: String(v), art, dir: lagen[i][0], dx: lagen[i][1],
                                    ebene: lagen[i][2], t });
    let v = A, t = K.T_VOR;
    p.flaggen.push(fl(A, 'start', 0, 0));
    d.forEach((dd, i) => {
      const nach = v + dd, letzte = i === d.length - 1, tl = t + K.T_SPRUNG;
      p.spruenge.push({ von: v, nach, d: dd, s: t, dauer: K.T_SPRUNG, farbe: i ? K.F_S2 : K.F_S1 });
      zeile(v + (dd < 0 ? ' − ' : ' + ') + Math.abs(dd) + ' = ' + nach, i ? K.F_S2 : K.F_S1, tl);
      p.flaggen.push(fl(nach, letzte ? 'ziel' : 'zwischen', i + 1, tl));
      if (letzte) p.ereignisse.push({ t: tl, art: 'ziel', wert: nach });
      else p.ereignisse.push({ t: tl, art: 'zwischen', text: String(nach) });
      v = nach; t = tl + K.T_PAUSE;
    });
    p.ende = t - K.T_PAUSE;
  }
  p.ereignisse.sort((a, b) => a.t - b.t);
  return p;
}

function _m5gInit() {
  _m5g = { weg: null, plan: null, t: 0, ei: 0, zeilen: [], zwischen: null, summe: null,
           neben: null, alt: null, altA: 0, erledigt: {}, geister: {}, aha: false,
           leucht: 0, zeit: 0, fx: { teile: [] } };
}
function _m5gHTML() {
  const knopf = k => `<button class="sim-btn" id="_m5g-b-${k}" onclick="_m5gWeg('${k}')">${_m5gWEGE[k]}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Welche Summe hat 46 + 37?</h3>
    <div class="fpm-note" style="margin-top:2px">Jeder Bogen ist ein Sprung auf dem Rechenstrich. Unten im Bild steht die Rechnung in Zeilen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5g-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${knopf('zehner')}
          ${knopf('getrennt')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          ${knopf('fuenfzig')}
          ${knopf('minus')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          ${knopf('neben')}
          <button class="sim-btn" onclick="_m5gNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5g-weg" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5g-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5g-zwischen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5g-summe" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">Jeder Knopf zeigt einen anderen Rechenweg für 46 + 37. „nebeneinander schreiben“ schreibt die Ergebnisse von Zehnern und Einern nebeneinander.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Punkt bei 46, noch kein Sprung</p>
  </div>`;
}
function _m5gStatus() {
  if (!_m5g) return;
  const z = _m5g;
  const setze = (id, s) => { const e = document.getElementById(id); if (e) e.textContent = s; };
  setze('_m5g-weg', 'Rechenweg: ' + (z.weg ? _m5gWEGE[z.weg] : 'noch nicht gewählt'));
  setze('_m5g-rechnung', 'Rechnung: ' + (z.zeilen.length ? z.zeilen.join(', ') : '…'));
  setze('_m5g-zwischen', 'Zwischenergebnis: ' + (z.zwischen || '…'));
  setze('_m5g-summe', z.weg === 'neben'
    ? 'Nebeneinander geschrieben: ' + (z.neben || '…')
    : 'Ergebnis der Aufgabe: ' + (z.summe || '…'));
  for (const k of _m5gREIHE) {
    const b = document.getElementById('_m5g-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.weg);
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Was gerade zu sehen ist, blendet in 0,2 s aus (auch der blosse Startpunkt).
function _m5gAbblenden() {
  const z = _m5g;
  z.alt = { plan: z.plan, t: z.t };
  z.altA = 1;
}
function _m5gWeg(key) {
  if (!_m5g || !_m5gWEGE[key]) return;
  const z = _m5g;
  _m5gAbblenden();
  z.weg = key; z.plan = _m5gPlan(key); z.t = 0; z.ei = 0;
  z.zeilen = []; z.zwischen = null; z.summe = null; z.neben = null; z.leucht = 0;
  _m5gStatus();
}
function _m5gNeu() {
  if (!_m5g) return;
  const z = _m5g;
  _m5gAbblenden();
  z.weg = null; z.plan = null; z.t = 0; z.ei = 0;
  z.zeilen = []; z.zwischen = null; z.summe = null; z.neben = null; z.leucht = 0;
  z.erledigt = {}; z.aha = false; z.fx.teile.length = 0;
  _m5gStatus();
}
function _m5gEreignis(e) {
  const z = _m5g, K = _m5gK;
  if (e.art === 'zeile') { if (!e.nurBild) z.zeilen.push(e.text); }
  else if (e.art === 'zwischen') z.zwischen = e.text;
  else if (e.art === 'neben') z.neben = e.text;
  else if (e.art === 'ziel') {
    z.summe = String(e.wert);
    z.leucht = K.LEUCHT;
    if (!z.erledigt[z.weg]) {
      z.erledigt[z.weg] = true;
      // Aha: der dritte verschiedene Weg landet wieder bei 83.
      if (!z.aha && Object.keys(z.erledigt).length === 3) {
        z.aha = true;
        const zf = z.plan.flaggen.find(f => f.art === 'ziel'), [mx, my] = _m5gFlaggeMitte(zf);
        _bioFxWelle(z.fx.teile, _m5gX(e.wert), K.LY, '#f59e0b', 52);
        _bioFxWelle(z.fx.teile, mx, my, '#fcd34d', 38);
      }
    }
  }
}
function _m5gUpdate(dt) {
  if (!_m5g) return;
  dt = _bioFxDt(dt);
  const z = _m5g;
  z.zeit += dt;
  if (z.altA > 0) z.altA = Math.max(0, z.altA - dt / _m5gK.T_VOR);
  if (z.plan) {
    z.t += dt;
    const p = z.plan;
    let neu = false;
    while (z.ei < p.ereignisse.length && p.ereignisse[z.ei].t <= z.t + 1e-9) {
      _m5gEreignis(p.ereignisse[z.ei]); z.ei++; neu = true;
    }
    if (neu) _m5gStatus();
  }
  if (z.leucht > 0) z.leucht = Math.max(0, z.leucht - dt);
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5gKl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
function _m5gText(ctx, s, x, y, ausr, farbe, groesse, gew) {
  ctx.fillStyle = farbe || _m5gK.F_LINIE;
  ctx.font = (gew || '700') + ' ' + (groesse || 15) + 'px sans-serif';
  ctx.textAlign = ausr || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function _m5gBreite(ctx, s, groesse, gew) {
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  return ctx.measureText(s).width;
}
// Lage der beiden Kaertchen: Die „70“ steht genau ueber 70 auf dem Strich.
function _m5gKartenLage(ctx) {
  const K = _m5gK;
  const t1 = (_m5gA - _m5gA % 10) + ' + ' + (_m5gB - _m5gB % 10) + ' = ';
  const t2 = (_m5gA % 10) + ' + ' + (_m5gB % 10) + ' = ';
  const e1 = String((_m5gA - _m5gA % 10) + (_m5gB - _m5gB % 10)), e2 = String(_m5gA % 10 + _m5gB % 10);
  const w1 = _m5gBreite(ctx, t1, 16), we1 = _m5gBreite(ctx, e1, 16);
  const w2 = _m5gBreite(ctx, t2, 16), we2 = _m5gBreite(ctx, e2, 16);
  const xErg1 = _m5gX(+e1);
  const xs1 = xErg1 - we1 / 2 - w1;
  const k1 = { x: xs1 - 11, w: w1 + we1 + 22, xs: xs1, xErg: xErg1, wErg: we1 };
  const xs2 = k1.x + k1.w + 26;
  const k2 = { x: xs2 - 11, w: w2 + we2 + 22, xs: xs2, xErg: xs2 + w2 + we2 / 2, wErg: we2 };
  return [k1, k2];
}
function _m5gKarte(ctx, lage, karte, t, a) {
  const K = _m5gK;
  const u = _m5gKl((t - karte.t0) / (karte.t1 - karte.t0));
  if (u <= 0) return;
  const y = K.KY - (1 - _bioFxEase.raus(u)) * 44;
  ctx.save();
  ctx.globalAlpha = a * Math.min(1, u * 2.5);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = karte.farbe; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, lage.x, y, lage.w, K.KH, 8); ctx.fill(); ctx.stroke();
  _m5gText(ctx, karte.text, lage.xs, y + K.KH / 2 + 6, 'left', karte.farbe, 16);
  ctx.restore();
}
// Punkt auf der Linie mit Faehnchen darunter. dir: M mittig, L links, R rechts vom Stab.
// Mitte des Faehnchenkastens (fuer das Leuchten und den Lichtring).
function _m5gFlaggeMitte(f) {
  const K = _m5gK;
  return [_m5gX(f.v) + (f.dx || 0), K.LY + K.FY + (f.ebene ? 26 : 0) + K.FH / 2];
}
function _m5gFlagge(ctx, f, a, pop) {
  const K = _m5gK, F = _m5gFLAGGE[f.art], x = _m5gX(f.v), xm = x + (f.dx || 0);
  const w = _m5gBreite(ctx, f.text, 16) + 16, y = K.LY + K.FY + (f.ebene ? 26 : 0);
  const bx = f.dir === 'L' ? x + 2 - w : f.dir === 'R' ? x - 2 : xm - w / 2;
  const k = 1 + 0.25 * pop;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = F[0]; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, K.LY + 5); ctx.lineTo(xm, y + 2); ctx.stroke();
  ctx.fillStyle = F[1]; ctx.strokeStyle = F[0]; ctx.lineWidth = f.art === 'ziel' ? 2.5 : 2;
  _bioFxRundRect(ctx, bx, y, w, K.FH, 6); ctx.fill(); ctx.stroke();
  _m5gText(ctx, f.text, bx + w / 2, y + K.FH / 2 + 6, 'center', F[2], 16);
  ctx.fillStyle = F[3]; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, K.LY, 6.5 * k, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Geometrie eines Bogens: oben fuer plus, unten (tiefes U) fuer minus.
function _m5gBogenForm(s) {
  const K = _m5gK, xa = _m5gX(s.von), xb = _m5gX(s.nach), b = Math.abs(xb - xa);
  if (s.d >= 0) {
    const h = Math.max(17, Math.min(52, b * 0.32));
    return { xa, xb, y0: K.LY - 3, cx: (xa + xb) / 2, cy: K.LY - 3 - 2 * h,
             lx: (xa + xb) / 2, ly: K.LY - 3 - h - 15 };
  }
  const h = 26;
  return { xa, xb, y0: K.LY + 3, cx: (xa + xb) / 2, cy: K.LY + 3 + 2 * h,
           lx: (xa + xb) / 2, ly: K.LY + 3 + h + 16 };
}
function _m5gBogenPfad(ctx, g, u) {
  // Teilkurve [0,u] einer quadratischen Kurve (de Casteljau)
  const qx = g.xa + (g.cx - g.xa) * u, qy = g.y0 + (g.cy - g.y0) * u;
  const ex = (1 - u) * (1 - u) * g.xa + 2 * u * (1 - u) * g.cx + u * u * g.xb;
  const ey = (1 - u) * (1 - u) * g.y0 + 2 * u * (1 - u) * g.cy + u * u * g.y0;
  ctx.beginPath(); ctx.moveTo(g.xa, g.y0); ctx.quadraticCurveTo(qx, qy, ex, ey);
  return [ex, ey];
}
function _m5gBogen(ctx, s, u, a) {
  const g = _m5gBogenForm(s);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = s.farbe; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  const [ex, ey] = _m5gBogenPfad(ctx, g, u);
  ctx.stroke();
  if (u < 1) {                                   // der Springer an der Spitze
    ctx.fillStyle = s.farbe; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ex, ey, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else {                                       // Pfeilspitze an der Landung
    const dx = g.xb - g.cx, dy = g.y0 - g.cy, n = Math.hypot(dx, dy) || 1;
    const ux = dx / n, uy = dy / n, px = -uy, py = ux;
    ctx.fillStyle = s.farbe;
    ctx.beginPath();
    ctx.moveTo(g.xb - ux * 6, g.y0 - uy * 6);
    ctx.lineTo(g.xb - ux * 16 + px * 5, g.y0 - uy * 16 + py * 5);
    ctx.lineTo(g.xb - ux * 16 - px * 5, g.y0 - uy * 16 - py * 5);
    ctx.closePath(); ctx.fill();
  }
  // Beschriftung „+ 30“ – blendet ein, waehrend der Bogen waechst
  const la = _m5gKl((u - 0.3) / 0.35);
  if (la > 0) {
    const txt = (s.d < 0 ? '− ' : '+ ') + Math.abs(s.d);
    const w = Math.max(40, _m5gBreite(ctx, txt, 16) + 18), h = 24;
    ctx.globalAlpha = a * la;
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = s.farbe; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, g.lx - w / 2, g.ly - h / 2, w, h, 8); ctx.fill(); ctx.stroke();
    _m5gText(ctx, txt, g.lx, g.ly + 6, 'center', s.farbe, 16);
  }
  ctx.restore();
}
function _m5gGeist(ctx, s) {
  const g = _m5gBogenForm(s);
  ctx.save();
  ctx.strokeStyle = _m5gK.F_GEIST; ctx.lineWidth = 2;
  if (ctx.setLineDash) ctx.setLineDash([5, 4]);
  _m5gBogenPfad(ctx, g, 1); ctx.stroke();
  if (ctx.setLineDash) ctx.setLineDash([]);
  ctx.restore();
}
// Zehnerstange und Einerwuerfel – genau so lang, wie sie auf dem Strich zaehlen.
function _m5gStange(ctx, x, y, w, h) {
  ctx.fillStyle = '#93c5fd'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(29,78,216,0.45)'; ctx.lineWidth = 0.8;
  for (let k = 1; k < 10; k++) {
    if (k === 5) continue;
    ctx.beginPath(); ctx.moveTo(x + w * k / 10, y); ctx.lineTo(x + w * k / 10, y + h); ctx.stroke();
  }
  ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 1.6;           // Fuenfermarke
  ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
  ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
}
function _m5gWuerfel(ctx, x, y, w, h) {
  ctx.fillStyle = '#86efac'; ctx.strokeStyle = '#15803d'; ctx.lineWidth = 1;
  ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h);
}
function _m5gGetrennt(ctx, p, t, a, lage) {
  const K = _m5gK;
  // die 13 teilt sich: „1 Z“ und „3 E“ gleiten unter dem Kaertchen auseinander
  const ut = _m5gKl((t - p.teil.t0) / (p.teil.t1 - p.teil.t0));
  const k2 = lage[1];
  const yT = K.KY + K.KH, xZ = k2.xErg - 19 * _bioFxEase.sanft(ut), xE = k2.xErg + 19 * _bioFxEase.sanft(ut);
  if (ut > 0) {
    ctx.save();
    ctx.globalAlpha = a * Math.min(1, ut * 2);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(k2.xErg - 3, yT + 1); ctx.lineTo(xZ, yT + 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(k2.xErg + 3, yT + 1); ctx.lineTo(xE, yT + 8); ctx.stroke();
    _m5gText(ctx, p.teil.z + ' Z', xZ, yT + 22, 'center', K.F_Z, 14);
    _m5gText(ctx, p.teil.e + ' E', xE, yT + 22, 'center', K.F_E, 14);
    ctx.restore();
  }
  // die 70 faellt auf den Strich, Stange und Wuerfel legen sich daneben
  const uf = _m5gKl((t - p.fall.t0) / (p.fall.t1 - p.fall.t0)), e = _bioFxEase.sanft(uf);
  if (uf <= 0) return;
  const xv = _m5gX(p.fall.v), einh = _m5gX(1) - _m5gX(0), yM = K.LY - 15, hM = 7;
  ctx.save();
  ctx.globalAlpha = a;
  if (uf < 1) {                                  // Plaettchen „70“ unterwegs
    const lx = lage[0].xErg + (xv - lage[0].xErg) * e;
    const ly = (K.KY + K.KH / 2) + (K.LY - 14 - (K.KY + K.KH / 2)) * e;
    const w = lage[0].wErg + 12;
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.F_Z; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, lx - w / 2, ly - 12, w, 24, 6); ctx.fill(); ctx.stroke();
    _m5gText(ctx, p.karten[0].erg, lx, ly + 6, 'center', K.F_Z, 16);
  }
  // Material: von unter „1 Z“/„3 E“ auf die Linie, waechst dabei auf volle Laenge
  const sx0 = xZ - 2.5 * einh, sy0 = yT + 28, sx1 = xv + 0.5, sw1 = 10 * einh - 1;
  const sx = sx0 + (sx1 - sx0) * e, sy = sy0 + (yM - sy0) * e, sw = (5 * einh) + (sw1 - 5 * einh) * e;
  _m5gStange(ctx, sx, sy, sw, hM);
  for (let i = 0; i < p.fall.e; i++) {
    const wx0 = xE - 1.5 * einh * 0.6 + i * einh * 0.6, wx1 = xv + (10 + i) * einh + 0.5;
    const ww = einh * (0.6 + 0.4 * e) - 1;
    _m5gWuerfel(ctx, wx0 + (wx1 - wx0) * e, sy, ww, hM);
  }
  ctx.restore();
}
function _m5gNeben(ctx, p, t, a, lage) {
  const K = _m5gK, sb = p.schieb;
  const u = _m5gKl((t - sb.t0) / (sb.t1 - sb.t0)), e = _bioFxEase.sanft(u);
  if (u <= 0) return;
  const gr = 22, wL = _m5gBreite(ctx, sb.links, gr), wZ = _m5gBreite(ctx, sb.ziffer, gr);
  const wR = _m5gBreite(ctx, sb.rechts, gr);
  const MX = 352, MY = 84, w = wZ + wR + 24, h = 32;
  const li = MX - (wZ + wR) / 2;                 // linker Rand von „713“
  const zl = li + wL / 2, zr = li + wZ + wR / 2;   // Ziel: „70“ links, „13“ auf der 0
  const yK = K.KY + K.KH / 2;
  ctx.save();
  ctx.globalAlpha = a;
  if (u < 1) {
    const lx = lage[0].xErg + (zl - lage[0].xErg) * e, rx = lage[1].xErg + (zr - lage[1].xErg) * e;
    const yy = yK + (MY - yK) * e;
    ctx.lineWidth = 2;
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.F_Z;
    _bioFxRundRect(ctx, lx - wL / 2 - 6, yy - h / 2, wL + 12, h, 6); ctx.fill(); ctx.stroke();
    _m5gText(ctx, sb.ziffer, lx - wL / 2, yy + 8, 'left', K.F_Z, gr);
    ctx.save(); ctx.globalAlpha = a * (1 - e);   // die 0 der 70 verschwindet unter der 13
    _m5gText(ctx, sb.links.slice(sb.ziffer.length), lx - wL / 2 + wZ, yy + 8, 'left', K.F_Z, gr);
    ctx.restore();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.F_E;
    _bioFxRundRect(ctx, rx - wR / 2 - 6, yy - h / 2, wR + 12, h, 6); ctx.fill(); ctx.stroke();
    _m5gText(ctx, sb.rechts, rx, yy + 8, 'center', K.F_E, gr);
  } else {
    ctx.fillStyle = '#fff7ed'; ctx.strokeStyle = K.F_NEBEN; ctx.lineWidth = 2.5;
    _bioFxRundRect(ctx, MX - w / 2, MY - h / 2, w, h, 7); ctx.fill(); ctx.stroke();
    _m5gText(ctx, sb.text, MX, MY + 8, 'center', '#9a3412', gr);
  }
  // Pfeil aus dem Rechenstrich hinaus, dazu der Hinweis im Bild
  const up = _m5gKl((t - p.pfeil.t0) / (p.pfeil.t1 - p.pfeil.t0));
  if (up > 0) {
    const x0 = MX + w / 2 + 4, y0 = MY, cx = 412, cy = MY, x1 = 414, y1 = K.LY - 14;
    // eigene Teilkurve (Endpunkt hat ein anderes y als der Anfang)
    const qx = x0 + (cx - x0) * up, qy = y0 + (cy - y0) * up;
    const ex = (1 - up) * (1 - up) * x0 + 2 * up * (1 - up) * cx + up * up * x1;
    const ey = (1 - up) * (1 - up) * y0 + 2 * up * (1 - up) * cy + up * up * y1;
    ctx.strokeStyle = K.F_NEBEN; ctx.lineWidth = 2.5;
    if (ctx.setLineDash) ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(qx, qy, ex, ey); ctx.stroke();
    // die Linie selbst laeuft gestrichelt ueber ihr Ende hinaus
    ctx.beginPath(); ctx.moveTo(K.X1 + 14, K.LY); ctx.lineTo(K.X1 + 14 + 12 * up, K.LY); ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
    if (up >= 1) {
      ctx.fillStyle = K.F_NEBEN;
      ctx.beginPath(); ctx.moveTo(x1, y1 + 8); ctx.lineTo(x1 - 6, y1 - 3); ctx.lineTo(x1 + 5, y1 - 3);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = a * up;
    _m5gText(ctx, p.pfeil.text, 412, K.LY + K.FY + K.FH / 2 + 6, 'right', '#9a3412', 14);
  }
  ctx.restore();
}
// Alles, was ein Weg zur Zeit t zeigt (ohne Rechnungskasten).
function _m5gZeichnePlan(ctx, p, t, a) {
  const K = _m5gK;
  if (a <= 0.01) return;
  if (!p) {                                      // Startzustand
    _m5gFlagge(ctx, { v: _m5gA, text: String(_m5gA), art: 'start', dir: 'M' }, a, 0);
    return;
  }
  const lage = p.karten ? _m5gKartenLage(ctx) : null;
  if (p.karten) p.karten.forEach((k, i) => _m5gKarte(ctx, lage[i], k, t, a));
  if (p.teil) _m5gGetrennt(ctx, p, t, a, lage);
  for (const s of p.spruenge) {
    const u = _m5gKl((t - s.s) / s.dauer);
    if (u > 0) _m5gBogen(ctx, s, _bioFxEase.sanft(u), a);
  }
  for (const f of p.flaggen) {
    if (t < f.t) continue;
    const pop = _m5gKl(1 - (t - f.t) / K.POP);
    const fa = (p.startBlass && f.art === 'start') ? a * 0.4 : a;
    _m5gFlagge(ctx, f, fa, pop);
  }
  if (p.schieb) _m5gNeben(ctx, p, t, a, lage);
}
function _m5gRechnung(ctx, p, t, a) {
  const K = _m5gK;
  if (!p || a <= 0.01) return;
  ctx.save();
  p.zeilen.forEach((zl, i) => {
    if (t < zl.t) return;
    const y = K.RY + 17 + 17 * i, b = _m5gKl(1 - (t - zl.t) / K.BLITZ);
    if (b > 0) {
      ctx.globalAlpha = a * b * 0.9;
      ctx.fillStyle = '#fde68a';
      _bioFxRundRect(ctx, 10, y - 14, _m5gBreite(ctx, zl.text, 15) + 12, 18, 4); ctx.fill();
    }
    ctx.globalAlpha = a;
    _m5gText(ctx, zl.text, 16, y, 'left', zl.farbe, 15);
  });
  ctx.restore();
}
function _m5gDraw(ctx, cv) {
  if (!_m5g) return;
  const z = _m5g, K = _m5gK, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#f4f7fb');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // die Aufgabe
  _m5gText(ctx, 'Aufgabe: ' + _m5gA + ' + ' + _m5gB, 10, 27, 'left', '#475569', 14, '700');
  // fruehere Wege: duenne graue Boegen
  for (const k of _m5gREIHE) {
    if (!z.erledigt[k] || k === z.weg) continue;
    if (!z.geister[k]) z.geister[k] = _m5gPlan(k);
    for (const s of z.geister[k].spruenge) _m5gGeist(ctx, s);
  }
  // der Rechenstrich: eine Linie ohne Striche
  ctx.save();
  ctx.strokeStyle = K.F_LINIE; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(K.X0 - 12, K.LY); ctx.lineTo(K.X1 + 12, K.LY); ctx.stroke();
  ctx.restore();
  // das Ziel leuchtet nach der Landung
  if (z.plan && z.leucht > 0) {
    const zf = z.plan.flaggen.find(f => f.art === 'ziel');
    if (zf) {
      const [mx, my] = _m5gFlaggeMitte(zf);
      ctx.save();
      ctx.globalAlpha = Math.min(1, z.leucht / 0.8);
      _bioFxLeuchten(ctx, mx, my, 24, z.zeit, '252,211,77');
      ctx.restore();
    }
  }
  if (z.alt && z.altA > 0) _m5gZeichnePlan(ctx, z.alt.plan, z.alt.t, z.altA);
  if (z.plan) _m5gZeichnePlan(ctx, z.plan, z.t, 1);
  else _m5gZeichnePlan(ctx, null, 0, 1 - z.altA);
  // Rechnungskasten
  ctx.save();
  ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, 6, K.RY, W - 12, H - K.RY - 3, 8); ctx.fill(); ctx.stroke();
  ctx.restore();
  _m5gText(ctx, 'Rechnung', W - 14, K.RY + 16, 'right', '#64748b', 12, '600');
  if (z.alt && z.altA > 0) _m5gRechnung(ctx, z.alt.plan, z.alt.t, z.altA);
  _m5gRechnung(ctx, z.plan, z.t, 1);
  _bioFxDraw(ctx, z.fx.teile);
}
