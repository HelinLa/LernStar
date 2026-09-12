
// ═══════════════════════════════════════════════════════
// ZENTRIPETALKRAFT – gleichfoermige Kreisbewegung quantitativ
// Gymnasiale Oberstufe (EF), Kernlehrplan NRW:
//   "beschreiben quantitativ die bei einer gleichfoermigen Kreisbewegung
//    wirkende Zentripetalkraft in Abhaengigkeit der Beschreibungsgroessen"
//   "interpretieren Messergebnisse aus Experimenten zur quantitativen
//    Untersuchung der Zentripetalkraft"
//
// Die alte 'kreisbewegung' fuehrt nur omega und F_z und misst den Radius in
// PIXELN. Hier ist der Radius in Metern, und die Statuszeile fuehrt alle
// sieben Beschreibungsgroessen mit Formelzeichen und Einheit:
//   r [m] · phi [Grad] · T [s] · f [Hz] · v [m/s] · omega [rad/s] · a_z [m/s²]
// dazu die Zentripetalkraft F_z [N].
//
// Messwerterfassung wie in 'gleichfoermig': Messpunkte in eine Wertetabelle,
// drei Auftragungen mit Ausgleichsgerade, Steigung und R².
//
// REGISTRY-EINTRAG fuer simcheck/einbau.py:
//   'zentripetalkraft': modal => {
//     _zpkInit();
//     modal.innerHTML = _zpkHTML();
//     _zpkRenderTable();
//     _zpkStatus();
//     _pSim = new PhysicsSimEngine('zpkAnim', 'zpkPlot');
//     _pSim.start(dt => _zpkUpdate(dt), (ctx, cv) => _zpkDraw(ctx, cv), []);
//     _mlabRenderTheorie(_zpk, false);
//     _mlabDrawPlot('zpkPlot', _zpk);
//   },
// ═══════════════════════════════════════════════════════

let _zpk = null;

const _ZPK_4PI2 = 4 * Math.PI * Math.PI;   // 39,478…  – steckt in jeder Steigung
const _ZPK_SKALA = 70;                     // Pixel je Meter im Bild (Radius maßstäblich)
const _ZPK_STREU = 0.03;                   // Kraftmessdose: ±1,5 % Streuung

// ── Gruppenschluessel ──────────────────────────────────
// Eine Ausgleichsgerade entsteht nur, wenn zwischen zwei Messpunkten NUR die
// aufgetragene Groesse veraendert wurde. Deshalb werden die Messzeilen nach den
// beiden festgehaltenen Groessen gruppiert. Beide stecken in einer Zahl:
// A (Schritt 0,1; hoechstens 2,0) mal 100, dazu B (hoechstens 4,0).
function _zpkKey(a, b) { return Math.round(a * 10) * 100 + Math.round(b * 10) / 10; }
function _zpkKeyA(k) { return Math.floor(k / 100 + 1e-9) / 10; }
function _zpkKeyB(k) { return Math.round((k - Math.floor(k / 100 + 1e-9) * 100) * 10) / 10; }

// ── Physik an einer Stelle ─────────────────────────────
function _zpkGroessen(m, r, f) {
  const T = 1 / f;
  const om = 2 * Math.PI * f;
  const v = om * r;
  const az = om * om * r;          // = v²/r
  return { m: m, r: r, f: f, T: T, om: om, v: v, az: az, F: m * az };
}

// ── Anzeigen heisst rechnen ────────────────────────────
// Grundsatz: Was im Rechenweg steht, muss aus den ANGEZEIGTEN Zahlen folgen.
// Sonst rechnet jemand die Zeile nach, bekommt etwas anderes heraus und haelt
// sich fuer dumm. Also ZUERST runden, DANN mit den gerundeten Werten weiter.

// Runden wie von Hand: die halbe Einheit geht nach oben. Math.round allein taugt
// dafuer nicht – 35,495 liegt als Gleitkommazahl knapp UNTER der Mitte und wuerde
// zu 35,49 statt 35,50. toPrecision(12) raeumt dieses Rauschen vorher weg.
function _zpkRund(v, n) {
  if (!isFinite(v)) return v;
  const p = Math.pow(10, n);
  return Math.sign(v) * Math.round(Number((Math.abs(v) * p).toPrecision(12))) / p;
}

// Anzeigegenauigkeit nach Groessenordnung: 0,197 N und 1895 N im selben Format
// waere unsinnig. Gilt fuer die Kraft UND fuer die Zentripetalbeschleunigung.
function _zpkNk(v) { const a = Math.abs(v); return a >= 100 ? 1 : (a >= 10 ? 2 : 3); }
function _zpkFmt(v, n) { return _fpmNum(_zpkRund(v, n), n); }

// Eine Spalte, EIN Format – sonst stehen 8,867 und 17,77 untereinander.
// Gewaehlt wird es aus dem groessten Betrag der Spalte (so grob ist die Messdose
// ueber diesen Bereich), aber nie so grob, dass der kleinste Wert unter drei
// geltende Ziffern faellt.
function _zpkSpaltenNk(werte) {
  const w = werte.filter(v => isFinite(v) && v !== 0).map(Math.abs);
  if (!w.length) return 3;
  const klein = Math.min(...w);
  const drei = Math.min(3, Math.max(0, 3 - (Math.floor(Math.log10(klein)) + 1)));
  return Math.max(_zpkNk(Math.max(...w)), drei);
}

// omega mit 4, v mit 5 Nachkommastellen. Die 5 ist kein Zierrat: r hat genau EINE
// Nachkommastelle, also ist v = omega·r bei 5 Stellen exakt – und damit ist v²/r
// rechnerisch dasselbe wie omega²·r. Nur so geht die Probe unten wirklich auf,
// statt sie bloss zu behaupten. Bei 4 Stellen fuer v laufen die beiden Wege in
// 36 von 504 (r,f)-Paaren um eine Einheit der letzten Stelle auseinander.
// Mit nur 2 Stellen fuer omega laege a_z ausserdem bis zu 0,3 % neben dem Wert,
// den der Theoriekasten nebenan aus 4·π²·f²·r nennt.
const _ZPK_NK_OM = 4;
const _ZPK_NK_V = 5;

// Alles, was auf dem Schirm steht – als Zahl UND als fertige Zeichenkette.
// Jede Zeile des Rechenwegs rechnet mit genau diesen Zahlen weiter.
function _zpkAnzeige(m, r, f) {
  const md = _zpkRund(m, 2), rd = _zpkRund(r, 2), fd = _zpkRund(f, 2);
  const T = _zpkRund(1 / fd, 3);
  const om = _zpkRund(2 * Math.PI * fd, _ZPK_NK_OM);
  const v = _zpkRund(om * rd, _ZPK_NK_V);
  // Zwei getrennte Rechnungen, nicht zweimal dieselbe Variable.
  const azV = v * v / rd, azOm = om * om * rd;
  const nkA = _zpkNk(azOm);
  const az = _zpkRund(azOm, nkA);
  const Froh = md * az, nkF = _zpkNk(Froh);
  return {
    m: md, r: rd, f: fd, T: T, om: om, v: v, az: az,
    azV: _zpkRund(azV, nkA), F: _zpkRund(Froh, nkF),
    sm: _fpmNum(md, 2), sr: _fpmNum(rd, 2), sf: _fpmNum(fd, 2),
    sT: _fpmNum(T, 3), som: _fpmNum(om, _ZPK_NK_OM), sv: _fpmNum(v, _ZPK_NK_V),
    saz: _zpkFmt(azOm, nkA), sazV: _zpkFmt(azV, nkA), sF: _zpkFmt(Froh, nkF)
  };
}

// 359,7 Grad runden auf "360" – und widersprechen dem Satz, dass der Winkel nach
// einer vollen Umdrehung wieder bei 0 steht. Deshalb wird der GERUNDETE Wert auf
// den Vollkreis zurueckgeholt, nicht der ungerundete.
function _zpkGrad(phi) { return _fpmNum(_zpkRund(phi * 180 / Math.PI, 0) % 360, 0); }

// Abschlussblock der Auswertung. _mlabErgebnis() rechnet die Abweichung aus
// zwei bereits mit Dezimalkomma formatierten Zeichenketten – das ergibt NaN.
// Hier wird deshalb mit Zahlen gerechnet und erst danach formatiert.
function _zpkErgebnis(label, wert, einheit, soll, formel) {
  const dev = (isFinite(soll) && soll !== 0 && isFinite(wert))
    ? Math.abs(wert - soll) / Math.abs(soll) * 100 : null;
  const cls = dev === null ? 'ok' : (dev < 1 ? 'ok' : (dev < 5 ? 'mid' : 'no'));
  const nk = Math.abs(wert) >= 100 ? 1 : (Math.abs(wert) >= 10 ? 2 : 3);
  return `<div class="fpm-fitline" style="border-top:1px solid #e2e8f0;padding-top:7px;margin-top:5px">
      <span class="fpm-fitmeta">${label}</span>
      <span class="fpm-fiteq">${_fpmNum(wert, nk)} ${einheit} &nbsp;·&nbsp; eingestellt: ${_fpmNum(soll, nk)} ${einheit}</span>
      ${dev !== null ? `<span class="fpm-badge ${cls}">Abweichung ${_fpmNum(dev, 2)} %</span>` : ''}
      <span class="fpm-fitmeta" style="margin-top:3px">${formel}</span>
    </div>`;
}

// ── Die drei Auftragungen ──────────────────────────────
const _ZPK_PRESETS = [
  { tab: 'F über r auftragen', xl: 'r in m', yl: 'F_z in N',
    x: z => z.r, y: z => z.F, grp: z => _zpkKey(z.m, z.f),
    gl: k => 'm = ' + _fpmNum(_zpkKeyA(k), 1) + ' kg, f = ' + _fpmNum(_zpkKeyB(k), 1) + ' Hz',
    slope: k => _ZPK_4PI2 * _zpkKeyA(k) * _zpkKeyB(k) * _zpkKeyB(k),
    curveFn: (xv, k) => _ZPK_4PI2 * _zpkKeyA(k) * _zpkKeyB(k) * _zpkKeyB(k) * xv,
    note: 'Ursprungsgerade ⇒ F_z ~ r bei festgehaltener Masse und Umlauffrequenz. Doppelter Radius, doppelte Kraft. Die Steigung ist 4·π²·m·f² und hat die Einheit N/m. Punkte, die einzeln herumliegen, stammen aus einer Einstellung, bei der m oder f mitverändert wurde.',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'F_z(r) = 4·π²·m·f² · r',
    param: () => 'Steigung = 4·π²·m·f² = ' + _fpmNum(_ZPK_4PI2 * _zpk.m * _zpk.f * _zpk.f, 2) + ' N/m (aktuelle Einstellung)',
    term: () => (_ZPK_4PI2 * _zpk.m * _zpk.f * _zpk.f).toFixed(4) + '*x',
    deutung: 'Bei gleicher Umlauffrequenz wächst die Zentripetalkraft proportional zum Radius: Der Körper muss auf der weiteren Bahn in derselben Zeit stärker zur Mitte gezogen werden.',
    ergebnis: g0 => {
      const m = _zpkKeyA(g0.key), f = _zpkKeyB(g0.key);
      return _zpkErgebnis('Masse m aus der Steigung k', g0.fit.k / (_ZPK_4PI2 * f * f), 'kg', m,
        'F_z = 4·π²·m·f²·r  ⇒  m = k / (4·π²·f²)'); } },

  { tab: 'F über f² auftragen', xl: 'f² in 1/s²', yl: 'F_z in N',
    x: z => z.f * z.f, y: z => z.F, grp: z => _zpkKey(z.m, z.r),
    gl: k => 'm = ' + _fpmNum(_zpkKeyA(k), 1) + ' kg, r = ' + _fpmNum(_zpkKeyB(k), 1) + ' m',
    slope: k => _ZPK_4PI2 * _zpkKeyA(k) * _zpkKeyB(k),
    curveFn: (xv, k) => _ZPK_4PI2 * _zpkKeyA(k) * _zpkKeyB(k) * xv,
    note: 'Über f allein ergäbe sich eine Parabel. Erst über f² liegen die Punkte auf einer Ursprungsgeraden ⇒ F_z ~ f². Doppelte Umlauffrequenz, vierfache Kraft. Die Steigung ist 4·π²·m·r in N·s².',
    typ: 'proportionale Funktion (Ursprungsgerade nach dem Quadrieren)', form: 'F_z(f²) = 4·π²·m·r · f²',
    param: () => 'Steigung = 4·π²·m·r = ' + _fpmNum(_ZPK_4PI2 * _zpk.m * _zpk.r, 2) + ' N·s² (aktuelle Einstellung)',
    term: () => (_ZPK_4PI2 * _zpk.m * _zpk.r).toFixed(4) + '*x',
    deutung: 'Die Zentripetalkraft wächst quadratisch mit der Umlauffrequenz. Deshalb reißt der Faden beim schnelleren Schleudern so plötzlich.',
    ergebnis: g0 => {
      const m = _zpkKeyA(g0.key), r = _zpkKeyB(g0.key);
      return _zpkErgebnis('Masse m aus der Steigung k', g0.fit.k / (_ZPK_4PI2 * r), 'kg', m,
        'F_z = 4·π²·m·r·f²  ⇒  m = k / (4·π²·r)'); } },

  { tab: 'F über m auftragen', xl: 'm in kg', yl: 'F_z in N',
    x: z => z.m, y: z => z.F, grp: z => _zpkKey(z.r, z.f),
    gl: k => 'r = ' + _fpmNum(_zpkKeyA(k), 1) + ' m, f = ' + _fpmNum(_zpkKeyB(k), 1) + ' Hz',
    slope: k => _ZPK_4PI2 * _zpkKeyA(k) * _zpkKeyB(k) * _zpkKeyB(k),
    curveFn: (xv, k) => _ZPK_4PI2 * _zpkKeyA(k) * _zpkKeyB(k) * _zpkKeyB(k) * xv,
    note: 'Ursprungsgerade ⇒ F_z ~ m. Die Steigung ist hier die Zentripetalbeschleunigung a_z selbst, denn F_z = m · a_z. Ihre Einheit ist N/kg = m/s².',
    typ: 'proportionale Funktion (Ursprungsgerade)', form: 'F_z(m) = a_z · m  mit  a_z = 4·π²·f²·r',
    // Dieselbe Zahl wie in der Statuszeile - nicht der exakte Wert daneben.
    // 4·π²·f²·r liegt bei 80 von 10080 Reglerstellungen genau auf einer
    // Rundungsgrenze (r = 0,5 m, f = 1,8 Hz: 63,955) und stuende dann als
    // 63,96 neben einer Statuszeile, die 63,95 anzeigt.
    param: () => 'Steigung = a_z = 4·π²·f²·r = ' + _zpkAnzeige(_zpk.m, _zpk.r, _zpk.f).saz + ' m/s² (aktuelle Einstellung)',
    term: () => (_ZPK_4PI2 * _zpk.f * _zpk.f * _zpk.r).toFixed(4) + '*x',
    deutung: 'Die Bahn hängt nicht von der Masse ab – die nötige Kraft schon. Die Steigung dieser Geraden ist unmittelbar die Zentripetalbeschleunigung.',
    ergebnis: g0 => {
      const r = _zpkKeyA(g0.key), f = _zpkKeyB(g0.key);
      return _zpkErgebnis('Zentripetalbeschleunigung a_z aus der Steigung k', g0.fit.k, 'm/s²',
        _ZPK_4PI2 * f * f * r, 'F_z = m · a_z  ⇒  a_z = k = 4·π²·f²·r'); } }
];

// ── Zustand ────────────────────────────────────────────
function _zpkInit() {
  _zpk = {
    m: 0.5, r: 0.8, f: 1.5,
    phi: 0,          // laufender Drehwinkel in rad
    t: 0,            // Stoppuhr seit der letzten Änderung
    umlauf: 0,       // gezählte volle Umläufe
    tLetzt: 0,       // Zeitpunkt des letzten Nulldurchgangs
    Tgem: 0,         // daraus gemessene Umlaufzeit
    blitz: 0,        // kurzes Aufleuchten nach einem Messpunkt
    rows: [], nextId: 1,
    preset: 0, fn: null, fnAuto: false, origin: true, showTheory: false,
    pre: 'zpk', plotId: 'zpkPlot', fitId: 'zpkFit', fnId: 'zpkFn',
    fnErrId: 'zpkErr', theoId: 'zpkTheo',
    presets: _ZPK_PRESETS
  };
}

// ── Oberflaeche ────────────────────────────────────────
function _zpkHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim zpk-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">⭕ Zentripetalkraft – die gleichförmige Kreisbewegung nachrechnen</h3>
    <div class="fpm-grid">
      <div>
        <canvas id="zpkAnim" width="440" height="330" class="phys-anim-cv"></canvas>
        <div class="phys-ctrl" style="margin-top:8px">
          <span class="phys-ctrl-label">Masse m: <b id="zpkMLbl">0,5 kg</b></span>
          <input type="range" id="zpkM" min="0.1" max="2" step="0.1" value="0.5"
            oninput="_zpkSetM(this.value)" style="width:100%;accent-color:#7c3aed">
        </div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Radius r: <b id="zpkRLbl">0,8 m</b></span>
          <input type="range" id="zpkR" min="0.2" max="1.5" step="0.1" value="0.8"
            oninput="_zpkSetR(this.value)" style="width:100%;accent-color:#0284c7">
        </div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Umlauffrequenz f: <b id="zpkFLbl">1,5 Hz</b></span>
          <input type="range" id="zpkF" min="0.5" max="4" step="0.1" value="1.5"
            oninput="_zpkSetF(this.value)" style="width:100%;accent-color:#f97316">
        </div>
        <div class="fpm-note" style="margin-top:7px">Das Bild zeigt den <b>Blick von oben auf eine waagerechte Kreisbahn</b> – die Gewichtskraft zeigt aus dem Bild heraus und wird von der Unterlage getragen. Deshalb ist das Kraftbild vollständig: Der rote Pfeil zeigt <b>immer zum Mittelpunkt</b>, die Zentripetalkraft hält den Körper auf der Bahn. Nach außen wirkt keine Kraft – der grüne Pfeil zeigt nur, wohin der Körper ohne diese Kraft weiterfliegen würde: <b>tangential</b>, geradeaus. Bei einer <i>senkrechten</i> Bahn (Looping, Eimer am Seil) käme die Gewichtskraft dazu; die zeigt dieses Bild nicht.</div>
      </div>
      <div>
        <div class="fpm-label">Alle Größen der Kreisbewegung</div>
        <div class="lmp-status" id="zpkStatus" style="font-weight:400;margin-top:6px"></div>
      </div>
    </div>

    <div class="fpm-label" style="margin-top:12px">Messreihe aufnehmen</div>
    <div class="sim-btn-row">
      <button class="sim-btn primary" onclick="_zpkMesspunkt()">Messpunkt übernehmen</button>
      <button class="sim-btn" onclick="_zpkReihe()">Messreihe automatisch aufnehmen</button>
      <button class="sim-btn" onclick="_zpkClear()">Tabelle leeren</button>
    </div>
    <div class="fpm-note" style="margin-top:5px">Für eine auswertbare Gerade darf zwischen zwei Messpunkten <b>nur eine</b> Größe verändert werden. Die automatische Messreihe verändert genau die Größe, die gerade auf der x-Achse steht, fährt dabei von einem Reglerende zum anderen und hält die beiden anderen Größen fest. Die Kraftmessdose sitzt in der Drehachse (der dunkle Block im Bild) und misst die Fadenspannung; sie streut um etwa 1,5 % – deshalb liegen die Punkte nicht exakt auf der Geraden.</div>
    <div class="fpm-tablewrap">
      <table class="sim-table">
        <thead><tr><th>m (kg)</th><th>r (m)</th><th>f (Hz)</th><th>F_z (N)</th><th></th></tr></thead>
        <tbody id="zpkTbody"></tbody>
      </table>
      <div class="fpm-empty" id="zpkEmpty">Noch keine Messwerte.<br>Regler einstellen → Messpunkt übernehmen.</div>
    </div>

    <div class="fpm-label" style="margin-top:12px">Auswertung – in welcher Auftragung liegen die Punkte auf einer Ursprungsgeraden?</div>
    ${_mlabAuswertungHTML(_zpk, { preset: '_zpkSetPreset', setfn: '_zpkSetFn', theo: '_zpkTheorieFn', clear: '_zpkClearFn', bool: '_zpkSetBool' })}
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>T = 1/f</b> &nbsp;|&nbsp; <b>ω = 2·π·f</b> &nbsp;|&nbsp; <b>v = ω·r</b> &nbsp;|&nbsp; <b>a_z = v²/r = ω²·r</b> &nbsp;|&nbsp; <b>F_z = m·a_z</b>
    </p>
  </div>`;
}

// ── Bedienung ──────────────────────────────────────────
function _zpkNeu() {
  // Stoppuhr und Umlaufzähler gehören zur eingestellten Umlauffrequenz
  _zpk.t = 0; _zpk.umlauf = 0; _zpk.tLetzt = 0; _zpk.Tgem = 0; _zpk.phi = 0;
}
function _zpkSetM(v) {
  _zpk.m = Math.round(+v * 10) / 10;
  const el = document.getElementById('zpkMLbl'); if (el) el.textContent = _fpmNum(_zpk.m, 1) + ' kg';
  _zpkStatus(); _mlabRefreshTheorie(_zpk);
}
function _zpkSetR(v) {
  _zpk.r = Math.round(+v * 10) / 10;
  const el = document.getElementById('zpkRLbl'); if (el) el.textContent = _fpmNum(_zpk.r, 1) + ' m';
  _zpkStatus(); _mlabRefreshTheorie(_zpk);
}
function _zpkSetF(v) {
  _zpk.f = Math.round(+v * 10) / 10;
  const el = document.getElementById('zpkFLbl'); if (el) el.textContent = _fpmNum(_zpk.f, 1) + ' Hz';
  _zpkNeu();
  _zpkStatus(); _mlabRefreshTheorie(_zpk);
}

// ── Messwerterfassung ──────────────────────────────────
function _zpkMesswert(m, r, f) {
  const F = _zpkGroessen(m, r, f).F * (1 + (Math.random() - 0.5) * _ZPK_STREU);
  return _zpkRund(F, _zpkNk(F));
}
function _zpkAddRow(m, r, f) {
  _zpk.rows.push({ id: _zpk.nextId++, m: m, r: r, f: f, F: _zpkMesswert(m, r, f) });
}
function _zpkMesspunkt() {
  _zpkAddRow(_zpk.m, _zpk.r, _zpk.f);
  _zpk.blitz = 1;
  _zpkRenderTable(); _mlabDrawPlot('zpkPlot', _zpk);
}
// Nimmt die Größe auf, die in der gewählten Auftragung auf der x-Achse steht.
// Jede Reihe laeuft von einem Reglerende zum anderen – sonst fehlt der Messreihe
// genau der Bereich, den eine Heftseite mit "Regler ganz nach rechts" meint.
function _zpkReihe() {
  if (_zpk.preset === 0)      [0.2, 0.4, 0.6, 0.9, 1.1, 1.3, 1.5].forEach(r => _zpkAddRow(_zpk.m, r, _zpk.f));
  else if (_zpk.preset === 1) [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0].forEach(f => _zpkAddRow(_zpk.m, _zpk.r, f));
  else                        [0.1, 0.4, 0.7, 1.0, 1.4, 1.7, 2.0].forEach(m => _zpkAddRow(m, _zpk.r, _zpk.f));
  _zpk.blitz = 1;
  _zpkRenderTable(); _mlabDrawPlot('zpkPlot', _zpk);
}
function _zpkDelRow(id) {
  _zpk.rows = _zpk.rows.filter(z => z.id !== id);
  _zpkRenderTable(); _mlabDrawPlot('zpkPlot', _zpk);
}
function _zpkClear() {
  if (_zpk.rows.length && !confirm('Alle ' + _zpk.rows.length + ' Messwerte löschen?')) return;
  _zpk.rows = [];
  _zpkRenderTable(); _mlabDrawPlot('zpkPlot', _zpk);
}
function _zpkRenderTable() {
  const tb = document.getElementById('zpkTbody'); if (!tb) return;
  const leer = document.getElementById('zpkEmpty');
  if (leer) leer.style.display = _zpk.rows.length ? 'none' : 'block';
  const P = _zpk.presets[_zpk.preset];
  // Die Farbkugel muss dieselbe Gruppe meinen wie der Punkt im Diagramm.
  // _mlabDrawPlot sortiert die Gruppenschluessel AUFSTEIGEND und faerbt danach;
  // wer hier nach dem ersten Auftreten faerbt, vertauscht die Farben genau dann,
  // wenn die groessere Gruppe zuerst gemessen wurde.
  const keys = [...new Set(_zpk.rows.map(z => P.grp(z)))].sort((a, b) => a - b);
  const nk = _zpkSpaltenNk(_zpk.rows.map(z => z.F));   // ein Format fuer die ganze Spalte
  tb.innerHTML = _zpk.rows.map(z => {
    const i = keys.indexOf(P.grp(z));
    return `<tr><td><span class="fpm-dot" style="background:${_MLAB_PALETTE[i % _MLAB_PALETTE.length]}"></span>${_fpmNum(z.m, 1)}</td>
       <td>${_fpmNum(z.r, 1)}</td><td>${_fpmNum(z.f, 1)}</td><td><b>${_zpkFmt(z.F, nk)}</b></td>
       <td class="fpm-del" onclick="_zpkDelRow(${z.id})" title="löschen">✕</td></tr>`;
  }).join('');
}

// ── Anschluss an das Auswertungs-Gerüst ────────────────
function _zpkSetPreset(i) { _mlabSetPreset(_zpk, i); _zpkRenderTable(); }
function _zpkSetFn(s) { _mlabSetFn(_zpk, s); }
function _zpkTheorieFn() { _mlabTheorieFn(_zpk); }
function _zpkClearFn() { _mlabClearFn(_zpk); }
function _zpkSetBool(k, v) { _zpk[k] = v; _mlabDrawPlot('zpkPlot', _zpk); }

// ── Zeit ───────────────────────────────────────────────
function _zpkUpdate(dt) {
  if (!_zpk) return;
  const om = 2 * Math.PI * _zpk.f;
  _zpk.t += dt;
  _zpk.phi += om * dt;
  while (_zpk.phi >= 2 * Math.PI) {
    _zpk.phi -= 2 * Math.PI;
    _zpk.umlauf++;
    // Der Nulldurchgang liegt MITTEN im Einzelbild. Nähme man einfach die
    // Bildzeit, käme bei 4 Hz T = 0,256 s statt 0,250 s heraus – ein Fehler der
    // Bildrate, den die Heftseite dann der Formel anlasten würde.
    const tKreuz = _zpk.t - _zpk.phi / om;
    _zpk.Tgem = tKreuz - _zpk.tLetzt;   // gemessene Umlaufzeit: Probe auf T = 1/f
    _zpk.tLetzt = tKreuz;
  }
  if (_zpk.blitz > 0) _zpk.blitz = Math.max(0, _zpk.blitz - dt * 2);
  // Nur die beiden laufenden Felder nachziehen – die ganze Statuszeile jedes
  // Bild neu zu schreiben wäre Verschwendung.
  const p = document.getElementById('zpkPhi');
  if (p) p.textContent = _zpkGrad(_zpk.phi);
  const u = document.getElementById('zpkUhr');
  if (u) u.textContent = _zpkUhrText();
}

function _zpkUhrText() {
  return 'Uhr der Simulation: ' + _fpmNum(_zpk.t, 2) + ' s · vollendete Umläufe: ' + _zpk.umlauf +
    ' · daraus gemessene Umlaufzeit T = ' + (_zpk.Tgem > 0 ? _fpmNum(_zpk.Tgem, 3) + ' s' : '–');
}

// ── Statuszeile: die wichtigste Ausgabe ────────────────
function _zpkStatus() {
  const el = document.getElementById('zpkStatus');
  if (!el || !_zpk) return;
  const g = _zpkAnzeige(_zpk.m, _zpk.r, _zpk.f);
  const grad = _zpkGrad(_zpk.phi);
  const probe = g.saz === g.sazV;

  const ro = (k, w, e, id) => `<div class="fpm-ro"><span class="fpm-ro-k">${k}</span>` +
    `<span class="fpm-ro-v"${id ? ' id="' + id + '"' : ''}>${w}</span><span class="fpm-ro-u">${e}</span></div>`;

  let t = `<div class="fpm-readout">
      ${ro('Masse m', g.sm, 'kg')}
      ${ro('Radius r', g.sr, 'm')}
      ${ro('Umlauffrequenz f', g.sf, 'Hz')}
      ${ro('Drehwinkel φ', grad, 'Grad', 'zpkPhi')}
      ${ro('Umlaufzeit T', g.sT, 's')}
      ${ro('Winkelgeschw. ω', g.som, 'rad/s')}
      ${ro('Bahngeschw. v', g.sv, 'm/s')}
      ${ro('Zentripetalbeschl. a_z', g.saz, 'm/s²')}
      ${ro('Zentripetalkraft F_z', g.sF, 'N')}
    </div>`;

  t += `<div class="fpm-note" id="zpkUhr" style="margin-top:7px;font-weight:700;color:#475569">${_zpkUhrText()}</div>`;

  // Jede Zeile rechnet mit den Zahlen weiter, die eine Zeile hoeher stehen.
  // Mit dem Taschenrechner kommt genau das heraus, was hier fett gedruckt ist.
  t += `<div style="font-family:ui-monospace,monospace;font-size:.73rem;line-height:1.75;color:#334155;margin-top:8px;border-top:1px solid #e2e8f0;padding-top:7px">
      T&nbsp;&nbsp; = 1/f = 1 / ${g.sf} Hz = <b>${g.sT} s</b><br>
      ω&nbsp;&nbsp; = 2·π·f = 2·π·${g.sf} Hz = <b>${g.som} rad/s</b><br>
      v&nbsp;&nbsp; = ω·r = ${g.som} rad/s · ${g.sr} m = <b>${g.sv} m/s</b><br>
      a_z = v²/r = (${g.sv} m/s)² / ${g.sr} m = <b>${g.sazV} m/s²</b><br>
      a_z = ω²·r = (${g.som} rad/s)² · ${g.sr} m = <b>${g.saz} m/s²</b><br>
      F_z = m·a_z = ${g.sm} kg · ${g.saz} m/s² = <b>${g.sF} N</b>
    </div>`;

  t += `<div class="fpm-note" style="margin-top:7px">${probe
      ? 'Die beiden a_z-Zeilen sind <b>getrennt gerechnet</b> – einmal aus v, einmal aus ω – und kommen beide auf <b>' + g.saz + ' m/s²</b>. Genau deshalb ist ω hier auf vier und v auf fünf Stellen angegeben: Mit weniger Stellen würden die beiden Wege auseinanderlaufen, und die Probe wäre keine.'
      : 'Hier stimmt etwas nicht: Der Weg über v ergibt <b>' + g.sazV + ' m/s²</b>, der Weg über ω <b>' + g.saz + ' m/s²</b>. Beide müssten gleich sein.'}
    Der Drehwinkel φ läuft mit: nach einer vollen Umdrehung steht er wieder bei 0 Grad, und die Uhr zeigt dann gerade die Umlaufzeit T – in Simulationszeit, 16 ms je Bild.</div>`;

  el.innerHTML = t;
}

// ── Bild ───────────────────────────────────────────────
function _zpkPfeil(ctx, x1, y1, x2, y2, farbe, breite) {
  const dx = x2 - x1, dy = y2 - y1, l = Math.sqrt(dx * dx + dy * dy);
  if (!(l > 1)) return;
  ctx.strokeStyle = farbe; ctx.fillStyle = farbe; ctx.lineWidth = breite;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const ux = dx / l, uy = dy / l, s = 4 + breite * 2;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ux * s * 2 + uy * s, y2 - uy * s * 2 - ux * s);
  ctx.lineTo(x2 - ux * s * 2 - uy * s, y2 - uy * s * 2 + ux * s);
  ctx.closePath(); ctx.fill();
}

function _zpkDraw(ctx, cv) {
  if (!_zpk) return;
  const W = cv.width, H = cv.height;
  const g = _zpkAnzeige(_zpk.m, _zpk.r, _zpk.f);   // dieselben Zahlen wie die Statuszeile
  const cx = 140, cy = 172, rp = _zpk.r * _ZPK_SKALA;
  const phi = _zpk.phi;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  // Bahn
  ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.arc(cx, cy, rp, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);

  // Bezugsrichtung 0 Grad
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + rp + 16, cy); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('0°', cx + rp + 19, cy + 4);

  // Spur der letzten 0,25 s – daran sieht man Drehsinn und Tempo
  const spur = 2 * Math.PI * _zpk.f * 0.25;
  ctx.strokeStyle = 'rgba(124,58,237,0.35)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(cx, cy, rp, -phi, -phi + Math.min(spur, Math.PI * 1.9)); ctx.stroke();

  // Drehwinkel phi als Bogen
  const ar = Math.max(9, Math.min(30, rp * 0.55));
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(cx, cy, ar, -phi, 0); ctx.stroke();
  ctx.fillStyle = '#7c3aed'; ctx.font = '700 11px sans-serif';
  ctx.fillText('φ = ' + _zpkGrad(phi) + '°',
    cx + (ar + 8) * Math.cos(phi / 2), cy - (ar + 8) * Math.sin(phi / 2) + 4);

  // Faden und Drehachse. In der Achse sitzt die Kraftmessdose – sie misst die
  // Fadenspannung, also genau F_z. Der Hinweistext nennt sie; also muss sie auch
  // im Bild stehen. Sie liegt im Mittelpunkt und kann deshalb bei keinem Radius
  // mit der Bahn zusammenstossen.
  const bx = cx + rp * Math.cos(phi), by = cy - rp * Math.sin(phi);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
  ctx.fillStyle = '#1e293b'; ctx.fillRect(cx - 6, cy - 6, 12, 12);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(cx - 2, cy - 2, 4, 4);

  // Zentripetalkraft: IMMER zum Mittelpunkt. Nach aussen wird nichts gezeichnet.
  const lF = Math.min(18 + 40 * (Math.sqrt(g.F) - 0.44) / (Math.sqrt(1900) - 0.44), 58, rp * 0.95);
  _zpkPfeil(ctx, bx, by, bx + (cx - bx) / rp * lF, by + (cy - by) / rp * lF, '#dc2626', 3);

  // Bahngeschwindigkeit: tangential, in Drehrichtung
  const lv = 18 + 34 * (Math.sqrt(g.v) - 0.79) / (Math.sqrt(37.7) - 0.79);
  const tx = -Math.sin(phi), ty = -Math.cos(phi);
  _zpkPfeil(ctx, bx, by, bx + tx * lv, by + ty * lv, '#16a34a', 3);

  // Koerper
  ctx.fillStyle = _zpk.blitz > 0.3 ? '#f59e0b' : '#f97316';
  ctx.beginPath(); ctx.arc(bx, by, 9, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.stroke();

  // Kurzzeichen an den Pfeilspitzen
  ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillStyle = '#dc2626';
  ctx.fillText('F_z', bx + (cx - bx) / rp * (lF + 12), by + (cy - by) / rp * (lF + 12) + 4);
  ctx.fillStyle = '#16a34a';
  ctx.fillText('v', bx + tx * (lv + 11), by + ty * (lv + 11) + 4);

  // Zahlenfeld rechts
  ctx.textAlign = 'left';
  const px = 288;
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.rect(px - 8, 14, 152, 150); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0f172a'; ctx.font = '700 11px sans-serif';
  ctx.fillText('m = ' + g.sm + ' kg', px, 32);
  ctx.fillText('r = ' + g.sr + ' m', px, 48);
  ctx.fillText('f = ' + g.sf + ' Hz', px, 64);
  ctx.fillStyle = '#7c3aed';
  ctx.fillText('T = ' + g.sT + ' s', px, 84);
  ctx.fillText('ω = ' + g.som + ' rad/s', px, 100);
  ctx.fillStyle = '#16a34a';
  ctx.fillText('v = ' + g.sv + ' m/s', px, 120);
  ctx.fillStyle = '#dc2626';
  ctx.fillText('a_z = ' + g.saz + ' m/s²', px, 140);
  ctx.fillText('F_z = ' + g.sF + ' N', px, 156);

  // laufende Uhr – ohne sie sieht man nicht, dass T wirklich stimmt.
  // Sie zaehlt Simulationszeit: PhysicsSimEngine.start() rechnet mit festen
  // 16 ms je Bild, nicht mit der gemessenen Bildzeit. Auf einem 120-Hz-Schirm
  // laeuft das Bild deshalb schneller als die Uhr am Handgelenk – untereinander
  // bleiben alle Zahlen stimmig, mit einer echten Stoppuhr messen darf man aber
  // nicht.
  ctx.fillStyle = '#475569'; ctx.font = '11px sans-serif';
  ctx.fillText('Uhr der Simulation: ' + _fpmNum(_zpk.t, 2) + ' s', px, 190);
  ctx.fillText('Umläufe: ' + _zpk.umlauf, px, 206);
  ctx.fillText('gemessen: T = ' + (_zpk.Tgem > 0 ? _fpmNum(_zpk.Tgem, 3) + ' s' : '–'), px, 222);
  ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif';
  ctx.fillText('16 ms Zeitschritt je Bild –', px, 242);
  ctx.fillText('keine Echtzeit.', px, 256);
  ctx.fillText('Pfeillängen nicht maßstäblich.', px, 270);

  // Massstab fuer den Radius
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(24, 312); ctx.lineTo(24 + _ZPK_SKALA, 312);
  ctx.moveTo(24, 307); ctx.lineTo(24, 317);
  ctx.moveTo(24 + _ZPK_SKALA, 307); ctx.lineTo(24 + _ZPK_SKALA, 317);
  ctx.stroke();
  ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif';
  ctx.fillText('1,00 m – der Radius ist maßstäblich gezeichnet', 24 + _ZPK_SKALA + 8, 316);

  // Blickrichtung. Ohne sie liest man den Kreis als senkrechte Bahn (Looping,
  // Eimer) – und dann waere "nach aussen wirkt keine Kraft" nur die halbe
  // Wahrheit, weil die Gewichtskraft fehlt.
  ctx.fillStyle = '#64748b'; ctx.font = '700 10px sans-serif';
  ctx.fillText('Blick von oben auf eine waagerechte Kreisbahn', 24, 292);

  // Legende
  ctx.font = '700 10px sans-serif';
  ctx.fillStyle = '#dc2626'; ctx.fillText('F_z zum Mittelpunkt', 24, 24);
  ctx.fillStyle = '#16a34a'; ctx.fillText('v tangential', 24, 40);
  ctx.fillStyle = '#1e293b'; ctx.fillRect(24, 49, 8, 8);
  ctx.fillText('Kraftmessdose in der Drehachse', 37, 56);
}
