
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mg2 „3 m sind 30 cm?“ (Kennung m5-laengen, Praefix _m6h)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL6_PROFIL.md, Abschnitte mg2 und m5-laengen.
// Ueberschrift = Frage der Einheit: „Wie viele Zentimeter sind 3 m?“
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   - Mitte: ein gelbes Massband. Meter-Ansicht: 0 bis 4 m, 95 px je m, lange
//     Striche mit „0 m“ … „4 m“, mittlere bei 50 cm, kurze alle 10 cm.
//   - Darueber liegt die gewaehlte Laenge als Meter-Staebe (blau, je 1 m, mit
//     „1 m“ beschriftet). Jeder Meter-Stab ZERFAELLT sichtbar in 10 Staebe zu
//     je 10 cm: 5 dunkel, 5 hell (Zehner-/Fuenferstruktur wie die
//     Zehnerstangen aus mz1).
//   - Ueber den Staeben eine Klammer ab 0, die mitwaechst; an ihrem Ende steht
//     der Zaehler („100 cm“, „200 cm“, …). So ist jede Zahl an das Stueck
//     Massband gebunden, das sie zaehlt (Bild <-> Zeichen, MATHE_PROFIL § 10.2).
//   - „4 cm“ schaltet in die LUPE: das Massband zoomt (0,6 s, stetig) auf 0 bis
//     5 cm (75 px je cm, Millimeterstriche, „0 cm“ … „5 cm“), oben rechts das
//     Zeichen „Lupe“. Vier Zentimeter-Stuecke („1 cm“) zerfallen in je 10
//     Millimeter-Teile (5 dunkel, 5 hell).
//   - Am Ende gleitet unten der Zettel „Rechnung“ herein, Teile in den Farben
//     ihres Bildes (Meter-Stab blau, 10-cm-Staebe dunkelblau, 40 cm bernstein).
//   - „Tareks Weg“: UNTER dem Massband legen sich so viele 10-cm-Staebe
//     (orange) wie Meter gewaehlt sind (bei 3 m 40 cm: 3 + 4 = 7), am Ende der
//     Reihe „30 cm“ – sichtbar viel zu kurz gegen die Klammer darueber.
//
// BEWEGUNG (jede Sprungmarke spielt SELBST ab, N1 im Bauplan: ein Schritt im
// Heft = eine Handlung; anhalten kann die Lehrkraft):
//   Zoom (nur beim Wechsel Meter <-> Lupe) 0,6 s · die Staebe legen sich
//   gestaffelt auf das Band (zusammen 0,6 s, je Stab 0,35 s Fall) · dann
//   zerfaellt ein Stab nach dem anderen (0,8 s je Stab: hebt sich, zwischen
//   den zehn Teilen oeffnen sich kurz Luecken und schliessen sich wieder,
//   setzt sich; die Klammer waechst mit, der Zaehler springt am Ende des
//   Stabs). Die Teile bleiben dabei in IHREM Meter – kein 10-cm-Teil ragt
//   ueber die Meter-Marke (gefunden am Leinwandbild 09.10.2026).
//   „3 m 40 cm“: drei Meter-Staebe zerfallen, die vier 10-cm-Staebe liegen
//   schon da und leuchten nur auf (0,6 s), dann springt der Zaehler auf 340 cm.
//   Dauer ab Knopfdruck: 1 m 1,4 s · 3 m 3,0 s · 3 m 40 cm 3,6 s ·
//   4 cm 4,4 s (mit Zoom). simfakten.js mit --frames=25 --verlauf=4 liest das
//   Ende von „1 m“ schon im Knopfdurchgang ab (100 Frames), die Enden von
//   „3 m“, „3 m 40 cm“ und „4 cm“ erst im Wahlgruppen-Durchgang (175, 200 und
//   250 Frames) – mit den Voreinstellungen (2 Frames) steht KEIN Endwert im
//   Dump. Gemessen 09.10.2026.
//   „zurück zu Metern“ (frei, fuer Aufgabe 2): die 10-cm-Staebe jedes Meters
//     schieben sich wieder zu einem Meter-Stab zusammen (0,6 s je Meter), bei
//     3 m 40 cm leuchten danach die vier 10-cm-Staebe kurz (0,4 s).
//     Blass, solange keine Meter-Laenge fertig zerfallen ist, in der Lupe und
//     nach dem Zusammenschieben.
//   „Tareks Weg“: je Stab 0,25 s, Reihe fertig nach n · 0,25 s + 0,25 s.
//     In der Lupe und ohne Wahl blass.
// Alles ist eine Funktion der Ablaufzeiten (z.at, z.zus.t, z.tarek.t):
// keine Zufallszahl; jede Zahl im Bild und in den Zeilen kommt aus
// _m6hWert() und _m6hTexte().
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6hWahl('…'), Wahlgruppe):
//     „1 m“ · „3 m“ · „3 m 40 cm“ · „4 cm“
//   Reihe 2: „zurück zu Metern“ (_m6hZusammen) · „Tareks Weg“ (_m6hTarek) ·
//     „noch einmal“ (_m6hNochmal: die gewaehlte Laenge neu abspielen; blass
//     ohne Wahl) · „neu“ (_m6hNeu: leeres Massband in der Meter-Ansicht)
//   Eine Sprungmarke waehrend des Ablaufs startet die Laenge neu.
//   (_m6hZusammen heisst NICHT „…Zurueck“: simfakten.js haelt jeden Knopf mit
//   „Zurueck“ im Namen fuer den Ruecksetzknopf.)
//
// STATUSZEILEN (woertlich aus dem Bauplan, jede mit Wert mehr als 18 Zeichen):
//   _m6h-laenge   „Gewählte Länge: 3 m 40 cm“ (Start „Gewählte Länge: noch keine“)
//   _m6h-stueck   „1 m zerfällt in 10 Stäbe zu je 10 cm.“ (Meter-Ansicht) bzw.
//                 „1 cm zerfällt in 10 Millimeter (mm).“ (Lupe)
//   _m6h-zaehler  „Bisher gezählt: 300 cm“ (zaehlt hoch; Lupe „… 40 mm“;
//                 ohne Wahl „Bisher gezählt: noch nichts“)
//   _m6h-rechnung am Ende „Rechnung: 3 m = 3 · 100 cm = 300 cm“ /
//                 „Rechnung: 3 m 40 cm = 300 cm + 40 cm = 340 cm“ /
//                 „Rechnung: 4 cm = 4 · 10 mm = 40 mm“ /
//                 „Rechnung: 1 m = 1 · 100 cm = 100 cm“; nach „zurück zu
//                 Metern“ „Rechnung: 300 cm = 3 · 100 cm = 3 m“ bzw.
//                 „Rechnung: 340 cm = 300 cm + 40 cm = 3 m 40 cm“ (vorher „Rechnung: …“)
//   _m6h-ergebnis am Ende „Ergebnis der Umrechnung: 340 cm“, zurueck „… 3 m 40 cm“
//   _m6h-tarek    nur nach „Tareks Weg“ (sonst unsichtbar):
//                 „Tareks Weg: 30 cm. Das sind nur 3 Stäbe zu 10 cm.“ ·
//                 bei 1 m „Tareks Weg: 10 cm. Das ist nur 1 Stab zu 10 cm.“
// Jede Groesse in jeder Zeile mit Einheit (N3), Rechenzeichen · (U+00B7) und +.
//
// WERTE (jede Zeile nachgerechnet mit simcheck/werte.js):
//   1 m       -> 1 · 100 cm = 100 cm              · Tarek 10 cm (1 Stab)
//   3 m       -> 3 · 100 cm = 300 cm              · Tarek 30 cm (3 Staebe)
//   3 m 40 cm -> 300 cm + 40 cm = 340 cm          · Tarek 70 cm (7 Staebe)
//   4 cm      -> 4 · 10 mm = 40 mm                · Tareks Weg blass
//   zurueck: 100 cm -> 1 m · 300 cm -> 3 m · 340 cm -> 3 m 40 cm
// START: leeres Massband in der Meter-Ansicht („Start: leeres Maßband von 0 bis 4 m“).
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen): bei „3 m“, wenn der erste
// Meter-Stab zerfallen ist – Lichtring um seine zehn Staebe, die zehn Staebe
// sind 2,6 s bernstein umrandet (das sind 100 cm, nicht 10 cm). Einmal je Laden.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen, Container fpm-lehrkraft fuer
// simfakten.js, V3 aus Kapitel 4): eigene Knopfzeile UNTER den Heftknoepfen,
// davor klein „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m6hAnhalten): friert jede Bewegung ein (Zoom,
//     Zerfallen, Zusammenschieben, Tareks Reihe, Lichtring); Schild „Pause“
//     oben links. „zurück zu Metern“ und „Tareks Weg“ in der Pause beginnen
//     erst mit „weiter“.
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m6hTempo): ein Drittel so schnell.
//   „Zahlen verdecken: aus“ <-> „… an“ (_m6hVerdecken): verdeckt Zaehler,
//     Rechnung und Ergebnis (Zeilen, Klammer-Zahl, Zettel) – zum Vermuten an
//     der Tafel. Massband, Staebe und Tareks Reihe bleiben sichtbar.
//   Eine Sprungmarke, „noch einmal“ oder „neu“ heben die Pause auf; Tempo und
//   Verdecken bleiben stehen. Hinweiszeile _m6h-lehrkraft nennt immer die
//   Einstellung (in der Pause bernsteinfarben). Voreinstellung: Zeitfaktor 1.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): die Regel als Satz
// (kein „Die Einheit wird kleiner, die Maßzahl größer“, kein „mal 100“ als
// Merksatz), „Nullen anhängen“, „1 000“. Die Zahlen 100 und 10 stehen als
// Rechnung da. Kein „falsch“, keine Punkte, keine Zeitmessung; ein Name nur
// im Knopf und in der Zeile „Tareks Weg“ (Bauplan, wie m5-rechenstrich).
// ════════════════════════════════════════════════════════════════════════
let _m6h = null;
const _m6hLAENGEN = {
  '1m':   { text: '1 m',       n: 1, z: 0, lupe: false },
  '3m':   { text: '3 m',       n: 3, z: 0, lupe: false },
  '3m40': { text: '3 m 40 cm', n: 3, z: 4, lupe: false },
  '4cm':  { text: '4 cm',      n: 4, z: 0, lupe: true }
};
const _m6hREIHE = ['1m', '3m', '3m40', '4cm'];
const _m6hK = {
  // Massband: Nullpunkt, Bandflaeche, Massstab (px je cm)
  X0: 20, BX0: 12, BX1: 410, BY0: 100, BY1: 130, S_M: 0.95, S_L: 75,
  // Staebe (liegen auf dem Band), Anheben beim Zerfallen, Luecke zwischen den
  // Teilen als Anteil der Teilbreite (die Teile bleiben in IHREM Meter: ein
  // 10-cm-Teil, das ueber die Meter-Marke ragt, zeigte kurz eine falsche Laenge)
  SY0: 72, SY1: 99, HUB: 8, SPREIZ: 0.3,
  // Klammer des Zaehlers (Linie, Endstriche bis KY2, Schild darueber)
  KY: 55, KY2: 62, KSY: 47,
  // Tareks Reihe unter dem Band
  TY0: 144, TY1: 158,
  // Zettel „Rechnung“
  ZX0: 24, ZX1: 396, ZY0: 178, ZY1: 238,
  // Zeiten in s
  T_ZOOM: 0.6, T_LEGEN: 0.6, T_FALL: 0.35, T_ZERF: 0.8, T_LEUCHT: 0.6,
  T_ZUS: 0.6, T_ZUSREST: 0.4, T_TAREK: 0.25, T_TFALL: 0.25, T_ZETTEL: 0.4,
  // Farben
  STAB: '#3b82f6', STABRAND: '#1d4ed8', DUNKEL: '#1d4ed8', HELL: '#93c5fd',
  TEILRAND: '#1e3a8a', REST: '#b45309', GLANZ: '#f59e0b',
  TAREK: '#fdba74', TAREKRAND: '#c2410c', TINTE: '#0f172a', GRAU: '#64748b',
  BAND: '#fde047', BANDRAND: '#ca8a04', STRICH: '#713f12'
};

// ── Ablauf: Zeitpunkte einer gewaehlten Laenge ──────────────────────────
// tZoom = Dauer des Zooms vor dem Legen (0, wenn die Ansicht schon stimmt).
function _m6hZeiten(S, tZoom) {
  const K = _m6hK, alle = S.n + S.z;
  const leg0 = tZoom;
  const stag = alle > 1 ? (K.T_LEGEN - K.T_FALL) / (alle - 1) : 0;
  const zerf0 = leg0 + K.T_LEGEN;
  const leucht = zerf0 + S.n * K.T_ZERF;            // nur bei S.z > 0
  const ende = S.z ? leucht + K.T_LEUCHT : zerf0 + S.n * K.T_ZERF;
  return { leg0, stag, zerf0, leucht, ende };
}
// Was zur Ablaufzeit z.at erreicht ist: zerfallene Stuecke, Rest gezaehlt, fertig.
function _m6hStand(z) {
  const st = { teile: 0, rest: false, fertig: false };
  const S = z.key ? _m6hLAENGEN[z.key] : null;
  if (!S) return st;
  const K = _m6hK, P = _m6hZeiten(S, z.tZoom);
  for (let k = 0; k < S.n; k++) if (z.at >= P.zerf0 + (k + 1) * K.T_ZERF) st.teile++;
  st.rest = S.z > 0 && z.at >= P.leucht + K.T_LEUCHT;
  st.fertig = z.at >= P.ende;
  return st;
}
// Gezaehlter Wert zum Stand (cm in der Meter-Ansicht, mm in der Lupe).
function _m6hWert(S, st) {
  if (!S) return 0;
  return S.lupe ? st.teile * 10 : st.teile * 100 + (st.rest ? S.z * 10 : 0);
}
function _m6hEinh(S) { return S && S.lupe ? 'mm' : 'cm'; }
function _m6hTarekZahl(S) { return S.n + S.z; }          // so viele 10-cm-Staebe legt Tarek
function _m6hTarekEnde(S) { return _m6hTarekZahl(S) * _m6hK.T_TAREK + _m6hK.T_TFALL; }
function _m6hZusEnde(S) { return S.n * _m6hK.T_ZUS + (S.z ? _m6hK.T_ZUSREST : 0); }

// Die Rechnung als Teile [Text, Farbe] – dieselben Teile fuer Zeile und Zettel.
function _m6hRechnung(S, zurueck) {
  const K = _m6hK, ges = S.n * 100 + S.z * 10;
  if (S.lupe)
    return [[S.n + ' cm', K.STABRAND], ['=', K.TINTE], [S.n + ' · 10 mm', K.DUNKEL],
            ['=', K.TINTE], [S.n * 10 + ' mm', K.TINTE]];
  if (!zurueck && !S.z)
    return [[S.text, K.STABRAND], ['=', K.TINTE], [S.n + ' · 100 cm', K.DUNKEL],
            ['=', K.TINTE], [S.n * 100 + ' cm', K.TINTE]];
  if (!zurueck)
    return [[S.text, K.STABRAND], ['=', K.TINTE], [S.n * 100 + ' cm', K.DUNKEL], ['+', K.TINTE],
            [S.z * 10 + ' cm', K.REST], ['=', K.TINTE], [ges + ' cm', K.TINTE]];
  if (!S.z)
    return [[ges + ' cm', K.TINTE], ['=', K.TINTE], [S.n + ' · 100 cm', K.DUNKEL],
            ['=', K.TINTE], [S.text, K.STABRAND]];
  return [[ges + ' cm', K.TINTE], ['=', K.TINTE], [S.n * 100 + ' cm', K.DUNKEL], ['+', K.TINTE],
          [S.z * 10 + ' cm', K.REST], ['=', K.TINTE], [S.text, K.STABRAND]];
}
function _m6hErgebnis(S, zurueck) {
  if (zurueck) return S.text;
  return S.lupe ? S.n * 10 + ' mm' : (S.n * 100 + S.z * 10) + ' cm';
}
function _m6hTarekText(S) {
  const n = _m6hTarekZahl(S);
  return 'Tareks Weg: ' + n * 10 + ' cm. ' +
         (n === 1 ? 'Das ist nur 1 Stab zu 10 cm.' : 'Das sind nur ' + n + ' Stäbe zu 10 cm.');
}

function _m6hInit() {
  _m6h = { t: 0, at: 0, key: null, tZoom: 0, sVon: _m6hK.S_M, sNach: _m6hK.S_M,
           fx: { teile: [] }, pause: false, langsam: false, verdeckt: false };   // Lehrkraft
  _m6hLaden(null);
}
// Eine Laenge laden (key = null: leeres Massband in der Meter-Ansicht).
function _m6hLaden(key) {
  const z = _m6h, K = _m6hK, S = key ? _m6hLAENGEN[key] : null;
  z.sVon = _m6hSkala(z);                  // von der Ansicht aus, die gerade zu sehen ist
  z.sNach = S && S.lupe ? K.S_L : K.S_M;
  z.key = key; z.at = 0;
  z.tZoom = Math.abs(Math.log(z.sVon / z.sNach)) > 0.01 ? K.T_ZOOM : 0;
  z.stand = _m6hStand(z);
  z.pop = 9; z.ende = false; z.zettel = 0; z.endGlanz = 0;
  z.aha = false; z.ahaGlanz = 0;
  z.zus = null; z.tarek = null;
  z.fx.teile.length = 0;
  z.pause = false;                        // neu laden hebt die Pause auf
}
// Massstab (px je cm) zur Ablaufzeit: stetiger Zoom, logarithmisch.
function _m6hSkala(z) {
  if (!z || z.sVon === undefined) return _m6hK.S_M;
  if (!z.tZoom || z.at >= z.tZoom) return z.sNach;
  const e = _bioFxEase.sanft(_bioFxKlemme(z.at / z.tZoom));
  return Math.exp(Math.log(z.sVon) + (Math.log(z.sNach) - Math.log(z.sVon)) * e);
}

function _m6hHTML() {
  const marke = k => `<button class="sim-btn" id="_m6h-b-${k}" onclick="_m6hWahl('${k}')">${_m6hLAENGEN[k].text.replace(/ /g, '&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Zentimeter sind 3&nbsp;m?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle eine Länge. Die Stäbe zerfallen von selbst.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6h-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6hREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6h-zusammen" onclick="_m6hZusammen()">zurück zu Metern</button>
          <button class="sim-btn" id="_m6h-tarekweg" onclick="_m6hTarek()">Tareks Weg</button>
          <button class="sim-btn" id="_m6h-nochmal" onclick="_m6hNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m6hNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6h-pause" onclick="_m6hAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6h-tempo" onclick="_m6hTempo()">Tempo: <span id="_m6h-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6h-verdeckt" onclick="_m6hVerdecken()">Zahlen verdecken: <span id="_m6h-verdeckt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6h-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6h-laenge" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6h-stueck" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6h-zaehler" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6h-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6h-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_m6h-tarek" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: leeres Maßband von 0 bis 4&nbsp;m</p>
  </div>`;
}
function _m6hSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6hZeige(id, html) {
  const e = _m6hSetze(id, html);
  if (e && e.style) e.style.display = html ? '' : 'none';
}
function _m6hKnopf(id, an) {
  const b = document.getElementById(id);
  if (!b) return;
  b.disabled = !an;
  if (b.style) b.style.opacity = an ? '' : '0.45';
}
function _m6hStatus() {
  if (!_m6h) return;
  const z = _m6h, K = _m6hK, S = z.key ? _m6hLAENGEN[z.key] : null, st = z.stand;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const zu = z.verdeckt, lupe = !!(S && S.lupe);
  const zurueck = !!(z.zus && z.zus.fertig);
  const fertig = !!(S && st.fertig && (!z.zus || z.zus.fertig));
  _m6hSetze('_m6h-laenge', 'Gewählte Länge: ' + (S ? S.text : 'noch keine'));
  _m6hSetze('_m6h-stueck', lupe ? '1 cm zerfällt in 10 Millimeter (mm).'
                                : '1 m zerfällt in 10 Stäbe zu je 10 cm.');
  _m6hSetze('_m6h-zaehler', 'Bisher gezählt: ' + (!S ? 'noch nichts' : zu ? 'verdeckt'
           : f(_m6hWert(S, st) + ' ' + _m6hEinh(S), K.TINTE)));
  let rech = 'Rechnung: …', erg = 'Ergebnis der Umrechnung: …';
  if (fertig) {
    rech = 'Rechnung: ' + (zu ? 'verdeckt'
         : _m6hRechnung(S, zurueck).map(([s, c]) => c === K.TINTE && s.length === 1 ? s : f(s, c)).join(' '));
    erg = 'Ergebnis der Umrechnung: ' + (zu ? 'verdeckt' : f(_m6hErgebnis(S, zurueck), K.TINTE));
  }
  _m6hSetze('_m6h-rechnung', rech);
  _m6hSetze('_m6h-ergebnis', erg);
  _m6hZeige('_m6h-tarek', S && z.tarek && z.tarek.fertig ? _m6hTarekText(S) : '');
  _m6hREIHE.forEach(k => {
    const b = document.getElementById('_m6h-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  _m6hKnopf('_m6h-nochmal', !!S);
  _m6hKnopf('_m6h-tarekweg', !!(S && !lupe));
  _m6hKnopf('_m6h-zusammen', !!(S && !lupe && st.fertig && !z.zus));
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6hSetze('_m6h-pause', z.pause ? 'weiter' : 'Pause');
  _m6hSetze('_m6h-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6hSetze('_m6h-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6hSetze('_m6h-lehrkraft', _m6hHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6h-pause', z.pause], ['_m6h-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6hHinweis() {
  const z = _m6h;
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Zahlen: ' + (z.verdeckt ? 'verdeckt' : 'sichtbar') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6hWahl(key) {
  if (!_m6h || !_m6hLAENGEN[key]) return;
  _m6hLaden(key);
  _m6hStatus();
}
function _m6hNochmal() {
  if (!_m6h || !_m6h.key) return;
  _m6hLaden(_m6h.key);
  _m6hStatus();
}
function _m6hNeu() {
  if (!_m6h) return;
  _m6hLaden(null);
  _m6hStatus();
}
// „zurück zu Metern“: nur in der Meter-Ansicht, wenn alles zerfallen ist, und einmal.
function _m6hZusammen() {
  const z = _m6h;
  if (!z || !z.key) return;
  const S = _m6hLAENGEN[z.key];
  if (S.lupe || !z.stand.fertig || z.zus) return;
  z.zus = { t: 0, fertig: false };
  z.zettel = 0; z.endGlanz = 0;
  _m6hStatus();
}
// „Tareks Weg“: nur in der Meter-Ansicht; noch einmal gedrueckt, legt er neu.
function _m6hTarek() {
  const z = _m6h;
  if (!z || !z.key || _m6hLAENGEN[z.key].lupe) return;
  z.tarek = { t: 0, fertig: false };
  _m6hStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6hAnhalten() {
  if (!_m6h) return;
  _m6h.pause = !_m6h.pause;
  _m6hStatus();
}
function _m6hTempo() {
  if (!_m6h) return;
  _m6h.langsam = !_m6h.langsam;
  _m6hStatus();
}
function _m6hVerdecken() {
  if (!_m6h) return;
  _m6h.verdeckt = !_m6h.verdeckt;
  _m6hStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6hZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6hUpdate(dt) {
  if (!_m6h) return;
  const z = _m6h, K = _m6hK;
  dt = _bioFxDt(dt) * _m6hZeitfaktor(z);             // ab hier Sim-Zeit
  z.t += dt; z.at += dt; z.pop += dt;
  if (z.zus) z.zus.t += dt;
  if (z.tarek) z.tarek.t += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.endGlanz = Math.max(0, z.endGlanz - dt);
  const S = z.key ? _m6hLAENGEN[z.key] : null;
  const zettelAn = z.ende && (!z.zus || z.zus.fertig);
  if (zettelAn) z.zettel = Math.min(1, z.zettel + dt / K.T_ZETTEL);
  if (S && dt > 0) {                                  // ohne Zeit kein Schritt im Ablauf
    const st = _m6hStand(z), alt = z.stand;
    let neu = false;
    if (_m6hWert(S, st) !== _m6hWert(S, alt)) { z.pop = 0; neu = true; }
    if (z.key === '3m' && !z.aha && st.teile >= 1) {
      // Aha: der erste Meter-Stab ist zerfallen – zehn Staebe, 100 cm
      z.aha = true; z.ahaGlanz = 2.6;
      _bioFxWelle(z.fx.teile, K.X0 + 50 * K.S_M, (K.SY0 + K.SY1) / 2, K.GLANZ, 62);
    }
    if (st.fertig && !z.ende) { z.ende = true; z.zettel = 0; z.endGlanz = 1.6; neu = true; }
    z.stand = st;
    if (z.tarek && !z.tarek.fertig && z.tarek.t >= _m6hTarekEnde(S)) { z.tarek.fertig = true; neu = true; }
    if (z.zus && !z.zus.fertig && z.zus.t >= _m6hZusEnde(S)) {
      z.zus.fertig = true; z.zettel = 0; z.endGlanz = 1.6; neu = true;
    }
    if (neu) _m6hStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6hText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m6hK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Zwei Hexfarben mischen (t = 0: a, t = 1: b).
function _m6hMisch(a, b, t) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')';
}
// Das Massband im Massstab s (px je cm): Striche nach Abstand ein- und ausgeblendet,
// beschriftet wird die feinste Stufe, deren Striche weit genug auseinander liegen.
function _m6hBand(ctx, s) {
  const K = _m6hK, kl = _bioFxKlemme;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, K.BX0 + 2, K.BY0 + 3, K.BX1 - K.BX0, K.BY1 - K.BY0, 4); ctx.fill();
  ctx.fillStyle = K.BAND; ctx.strokeStyle = K.BANDRAND; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, K.BX0, K.BY0, K.BX1 - K.BX0, K.BY1 - K.BY0, 4); ctx.fill(); ctx.stroke();
  // Striche: Stufen in mm; jede Stelle bekommt die Hoehe ihrer groebsten Stufe
  const STUFEN = [1000, 500, 100, 50, 10, 5, 1];
  let fein = STUFEN[0];
  for (const L of STUFEN) if (L / 10 * s >= 5) fein = L;
  const xMax = K.BX1 - 3;
  ctx.strokeStyle = K.STRICH;
  for (let v = 0; v <= 4000; v += fein) {
    const x = K.X0 + v / 10 * s;
    if (x > xMax) break;
    let Lc = fein;
    for (const L of STUFEN) if (v % L === 0) { Lc = L; break; }
    const p = Lc / 10 * s;
    const h = p >= 60 ? 15 : p >= 28 ? 10 : 6;
    ctx.globalAlpha = Lc === fein ? kl((fein / 10 * s - 5) / 2) : 1;
    ctx.lineWidth = p >= 60 ? 1.6 : 1;
    ctx.beginPath(); ctx.moveTo(x, K.BY0 + 1); ctx.lineTo(x, K.BY0 + h); ctx.stroke();
  }
  // Beschriftung: m, 10 cm oder cm – die feinste Stufe mit genug Platz
  let lab = null;
  for (const c of [[1000, 'm', 1000], [100, 'cm', 10], [10, 'cm', 10]]) if (c[0] / 10 * s >= 55) lab = c;
  if (lab) {
    ctx.globalAlpha = kl((lab[0] / 10 * s - 55) / 15);
    for (let v = 0; v <= 4000; v += lab[0]) {
      const x = K.X0 + v / 10 * s;
      if (x > xMax) break;
      const t = (v / lab[2]) + ' ' + lab[1];
      ctx.font = '700 11px sans-serif';
      const w = ctx.measureText(t).width;
      // an beiden Bandenden nach innen geschoben („0 m“ links, „4 m“/„5 cm“ rechts)
      _m6hText(ctx, t, Math.min(K.BX1 - 4 - w / 2, Math.max(K.BX0 + 3 + w / 2, x)), K.BY1 - 6, 11, K.STRICH);
    }
  }
  ctx.restore();
}
// Ein Stab aus zehn Teilen. o: {dy, a, mix (0 ganz, 1 Teile), g (Luecke 0 … 1), la (Aufschrift)}.
// Die Luecken oeffnen sich INNERHALB des Stabs: Teil j bleibt zwischen x + j·pw und
// x + (j+1)·pw, der Stab ragt nie ueber seine Meter-Marke.
function _m6hStab(ctx, x, w, o, aufschrift) {
  const K = _m6hK;
  if (o.a <= 0.01) return;
  const y0 = K.SY0 + o.dy, h = K.SY1 - K.SY0, pw = w / 10, lu = o.g * K.SPREIZ * pw;
  ctx.save();
  ctx.globalAlpha = Math.min(1, o.a);
  if (o.mix < 0.999) {                                 // der ganze Stab
    ctx.fillStyle = 'rgba(15,23,42,0.10)';
    _bioFxRundRect(ctx, x + 1.5, y0 + 2, w, h, 3); ctx.fill();
  }
  if (o.mix < 0.01) {                                  // ganz: EINE Flaeche (sonst Naehte beim Einblenden)
    ctx.fillStyle = K.STAB;
    _bioFxRundRect(ctx, x, y0, w, h, 3); ctx.fill();
  } else for (let j = 0; j < 10; j++) {
    const ins = 0.6 * o.mix + lu / 2, px = x + j * pw + ins, pb = pw - 2 * ins;
    ctx.fillStyle = _m6hMisch(K.STAB, j < 5 ? K.DUNKEL : K.HELL, o.mix);
    ctx.fillRect(px, y0, pb + (o.mix < 0.5 && lu < 0.05 ? 0.4 : 0), h);
    if (o.mix > 0.01) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, o.a) * o.mix;
      ctx.strokeStyle = K.TEILRAND; ctx.lineWidth = 0.7;
      ctx.strokeRect(px, y0, pb, h);
      ctx.restore();
    }
  }
  if (o.mix < 0.999) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, o.a) * (1 - o.mix);
    ctx.strokeStyle = K.STABRAND; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, x, y0, w, h, 3); ctx.stroke();
    ctx.restore();
  }
  if (o.la > 0.01) {
    ctx.globalAlpha = Math.min(1, o.a) * o.la;
    _m6hText(ctx, aufschrift, x + w / 2, y0 + h / 2 + 5, 13, '#ffffff');
  }
  ctx.restore();
}
// Zustand von Stab k zur Ablaufzeit (Fallen, Zerfallen, Zusammenschieben).
function _m6hStabZustand(z, S, P, k) {
  const K = _m6hK, E = _bioFxEase, kl = _bioFxKlemme;
  const e = E.sanft(kl((z.at - P.leg0 - k * P.stag) / K.T_FALL));
  const o = { dy: -30 * (1 - e), a: e, mix: 0, g: 0, la: 1 };
  const u = (z.at - P.zerf0 - k * K.T_ZERF) / K.T_ZERF;
  if (u > 0) {
    const v = kl(u);
    o.dy += -K.HUB * (v < 0.25 ? E.sanft(v / 0.25) : v < 0.8 ? 1 : 1 - E.sanft((v - 0.8) / 0.2));
    o.la = 1 - kl((v - 0.1) / 0.2);
    o.mix = E.sanft(kl((v - 0.2) / 0.3));
    o.g = v < 0.3 ? 0 : v < 0.5 ? E.sanft((v - 0.3) / 0.2) : v < 0.75 ? 1
        : 1 - E.sanft(kl((v - 0.75) / 0.2));
  }
  if (z.zus) {                                        // zurueck: zusammenschieben
    const w = kl((z.zus.t - k * K.T_ZUS) / K.T_ZUS);
    if (w > 0) {
      const b = Math.sin(Math.PI * w);
      o.dy = -K.HUB * b;
      o.g = b;
      o.mix = 1 - E.sanft(kl((w - 0.3) / 0.5));
      o.la = E.sanft(kl((w - 0.6) / 0.4));
    }
  }
  return o;
}
function _m6hStaebe(ctx, S, s) {
  const z = _m6h, K = _m6hK, E = _bioFxEase, kl = _bioFxKlemme;
  const P = _m6hZeiten(S, z.tZoom), len = S.lupe ? 1 : 100;
  for (let k = 0; k < S.n; k++) {
    const o = _m6hStabZustand(z, S, P, k);
    if (o.a <= 0.01) continue;
    const x = K.X0 + k * len * s, w = len * s;
    // Aha: die zehn Staebe des ersten Meters bernstein umrandet
    if (k === 0 && z.ahaGlanz > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.8) * (0.6 + 0.35 * Math.sin(z.t * Math.PI * 1.6));
      ctx.strokeStyle = K.GLANZ; ctx.lineWidth = 3;
      _bioFxRundRect(ctx, x - 4, K.SY0 - 4, w + 8, K.SY1 - K.SY0 + 8, 6); ctx.stroke();
      ctx.restore();
    }
    _m6hStab(ctx, x, w, o, S.lupe ? '1 cm' : '1 m');
  }
  // die 10-cm-Staebe von „3 m 40 cm“: liegen da und leuchten auf – EIN Schein um alle vier
  if (S.z) {
    const ul = (z.at - P.leucht) / K.T_LEUCHT;
    let glanz = ul > 0 && ul < 1 ? Math.sin(Math.PI * ul) : 0;
    if (z.zus) {
      const uz = (z.zus.t - S.n * K.T_ZUS) / K.T_ZUSREST;
      if (uz > 0 && uz < 1) glanz = Math.sin(Math.PI * uz);
    }
    if (glanz > 0.01) {
      const xa = K.X0 + S.n * 100 * s, xb = K.X0 + (S.n * 100 + S.z * 10) * s;
      ctx.save();
      ctx.globalAlpha = glanz;
      ctx.fillStyle = 'rgba(245,158,11,0.40)'; ctx.strokeStyle = K.GLANZ; ctx.lineWidth = 2;
      _bioFxRundRect(ctx, xa - 3, K.SY0 - 4, xb - xa + 6, K.SY1 - K.SY0 + 8, 4); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }
  for (let j = 0; j < S.z; j++) {
    const e = E.sanft(kl((z.at - P.leg0 - (S.n + j) * P.stag) / K.T_FALL));
    if (e <= 0.01) continue;
    const x = K.X0 + (S.n * 100 + j * 10) * s, w = 10 * s, dy = -30 * (1 - e);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.fillStyle = j < 5 ? K.DUNKEL : K.HELL;
    ctx.fillRect(x + 0.6, K.SY0 + dy, w - 1.2, K.SY1 - K.SY0);
    ctx.strokeStyle = K.TEILRAND; ctx.lineWidth = 0.7;
    ctx.strokeRect(x + 0.6, K.SY0 + dy, w - 1.2, K.SY1 - K.SY0);
    ctx.restore();
  }
}
// Klammer ab 0 ueber den Staeben; sie waechst, waehrend ein Stab zerfaellt, und
// traegt am Ende den gezaehlten Wert.
function _m6hKlammer(ctx, S, s) {
  const z = _m6h, K = _m6hK, E = _bioFxEase, kl = _bioFxKlemme;
  const P = _m6hZeiten(S, z.tZoom), len = S.lupe ? 1 : 100;
  let lang = 0;                                         // in cm
  for (let k = 0; k < S.n; k++) {
    const u = (z.at - P.zerf0 - k * K.T_ZERF) / K.T_ZERF;
    lang += len * E.sanft(kl((u - 0.6) / 0.4));
  }
  if (S.z) lang += S.z * 10 * E.sanft(kl((z.at - P.leucht) / K.T_LEUCHT));
  if (lang <= 0.001) return;
  const x0 = K.X0, x1 = K.X0 + lang * s;
  ctx.save();
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x0, K.KY2); ctx.lineTo(x0, K.KY); ctx.lineTo(x1, K.KY); ctx.lineTo(x1, K.KY2);
  ctx.stroke();
  const wert = _m6hWert(S, z.stand);
  if (wert > 0) {
    const t = z.verdeckt ? '?' : wert + ' ' + _m6hEinh(S);
    ctx.font = '700 14px sans-serif';
    const w = Math.max(26, ctx.measureText(t).width + 14);
    const xm = Math.min(K.BX1 - w / 2, Math.max(K.BX0 + w / 2, x1));
    const pop = z.pop < 0.3 ? 1 + 0.15 * Math.sin(Math.PI * z.pop / 0.3) : 1;
    ctx.translate(xm, K.KSY - 8);
    ctx.scale(pop, pop);
    if (z.endGlanz > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, z.endGlanz / 0.6) * (0.55 + 0.45 * Math.sin(z.t * 6));
      ctx.fillStyle = 'rgba(252,211,77,0.55)'; ctx.strokeStyle = K.GLANZ; ctx.lineWidth = 2;
      _bioFxRundRect(ctx, -w / 2 - 4, -13, w + 8, 26, 9); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.3;
    _bioFxRundRect(ctx, -w / 2, -10, w, 20, 7); ctx.fill(); ctx.stroke();
    _m6hText(ctx, t, 0, 5, 14, K.TINTE);
  }
  ctx.restore();
}
// Tareks Reihe unter dem Band: so viele 10-cm-Staebe wie Meter (plus die 40 cm).
function _m6hTarekReihe(ctx, S, s) {
  const z = _m6h, K = _m6hK, E = _bioFxEase, kl = _bioFxKlemme;
  const n = _m6hTarekZahl(S), w = 10 * s;
  for (let j = 0; j < n; j++) {
    const e = E.sanft(kl((z.tarek.t - j * K.T_TAREK) / K.T_TFALL));
    if (e <= 0.01) continue;
    const x = K.X0 + j * w, dy = -12 * (1 - e);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.fillStyle = K.TAREK; ctx.strokeStyle = K.TAREKRAND; ctx.lineWidth = 0.9;
    ctx.fillRect(x + 0.6, K.TY0 + dy, w - 1.2, K.TY1 - K.TY0);
    ctx.strokeRect(x + 0.6, K.TY0 + dy, w - 1.2, K.TY1 - K.TY0);
    ctx.restore();
  }
  const e = E.sanft(kl((z.tarek.t - n * K.T_TAREK) / 0.3));
  if (e <= 0.01) return;
  const xe = K.X0 + n * w;
  ctx.save();
  ctx.globalAlpha = e;
  ctx.strokeStyle = K.TAREKRAND; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(xe, K.TY0 - 6); ctx.lineTo(xe, K.TY1 + 4); ctx.stroke();
  ctx.setLineDash([]);
  _m6hText(ctx, n * 10 + ' cm', xe + 6, K.TY1 - 2, 13, K.TAREKRAND, 'left');
  ctx.restore();
}
// Zettel „Rechnung“ unten – gleitet am Ende herein; Teile in den Farben ihres Bildes.
function _m6hZettel(ctx, S) {
  const z = _m6h, K = _m6hK, e = _bioFxEase.sanft(z.zettel);
  if (e <= 0.01) return;
  const dy = 10 * (1 - e), x0 = K.ZX0, x1 = K.ZX1, y0 = K.ZY0 + dy, y1 = K.ZY1 + dy;
  ctx.save();
  ctx.globalAlpha = e;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 3, x1 - x0, y1 - y0, 8); ctx.fill();
  ctx.fillStyle = z.verdeckt ? '#e2e8f0' : '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 8); ctx.fill(); ctx.stroke();
  _m6hText(ctx, 'Rechnung', x0 + 10, y0 + 15, 11, K.GRAU, 'left', '600');
  if (z.verdeckt) {
    _m6hText(ctx, 'verdeckt', (x0 + x1) / 2, y0 + 41, 16, '#94a3b8', 'center', '600');
    ctx.restore();
    return;
  }
  const teile = _m6hRechnung(S, !!(z.zus && z.zus.fertig));
  let gr = 22;
  ctx.font = '700 ' + gr + 'px sans-serif';
  let br = teile.map(t => ctx.measureText(t[0]).width);
  let ges = br.reduce((a, b) => a + b, 0) + gr * 0.36 * (teile.length - 1);
  if (ges > x1 - x0 - 24) {                            // zu breit: kleiner setzen
    gr = Math.max(14, Math.floor(gr * (x1 - x0 - 24) / ges));
    ctx.font = '700 ' + gr + 'px sans-serif';
    br = teile.map(t => ctx.measureText(t[0]).width);
    ges = br.reduce((a, b) => a + b, 0) + gr * 0.36 * (teile.length - 1);
  }
  let x = (x0 + x1) / 2 - ges / 2;
  teile.forEach((t, i) => { _m6hText(ctx, t[0], x, y0 + 44, gr, t[1], 'left'); x += br[i] + gr * 0.36; });
  ctx.restore();
}
// Zeichen „Lupe“ oben rechts, solange stark vergroessert ist.
function _m6hLupe(ctx, s) {
  const a = _bioFxKlemme((Math.log(s) - Math.log(8)) / (Math.log(40) - Math.log(8)));
  if (a <= 0.01) return;
  const x = 396, y = 18;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 2.2;
  ctx.fillStyle = 'rgba(191,219,254,0.6)';
  ctx.beginPath(); ctx.arc(x - 3, y - 2, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 3.2;
  ctx.beginPath(); ctx.moveTo(x + 3, y + 4); ctx.lineTo(x + 9, y + 10); ctx.stroke();
  _m6hText(ctx, 'Lupe', x - 16, y + 3, 12, '#334155', 'right');
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-verteilen.
function _m6hPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6hText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6hDraw(ctx, cv) {
  if (!_m6h) return;
  const z = _m6h, W = cv.width, H = cv.height;
  const S = z.key ? _m6hLAENGEN[z.key] : null, s = _m6hSkala(z);
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6hBand(ctx, s);
  if (S) _m6hStaebe(ctx, S, s);
  _bioFxDraw(ctx, z.fx.teile);            // Lichtring UNTER der Klammer: die Zahl bleibt lesbar
  if (S) _m6hKlammer(ctx, S, s);
  if (S && z.tarek && !S.lupe) _m6hTarekReihe(ctx, S, s);
  if (S && z.ende) _m6hZettel(ctx, S);
  _m6hLupe(ctx, s);
  if (z.pause) _m6hPauseSchild(ctx);
}
