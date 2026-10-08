
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mm4 „Verteilen oder aufteilen?“ (Kennung m5-verteilen)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL4_PROFIL.md, Abschnitt m5-verteilen.
// Ueberschrift = Frage der Einheit: „Wie viele Bälle kann die Klasse kaufen?“
//
// Was man sieht: links die Kasse (Blechdose mit Deckel und Schlitz). In ihr
// 24 Ein-Euro-Muenzen (goldener Rand, silberner Kern) in zwei Zehnerreihen und
// einer Viererreihe, nach fuenf Muenzen eine Luecke. Vorn auf der Dose ein
// Schild „Kasse: 24 €“, das mitzaehlt. Rechts, je nach Situation:
//   * an Kinder: N Geldboersen (blau) mit den Nummern 1 bis N darunter und
//     ihrem Betrag darueber („0 €“, „1 €“, … – zaehlt beim Eintreffen mit);
//   * Ball fuer … €: ein Ballwagen mit acht leeren Ballplaetzen (gestrichelt;
//     acht, damit die Zahl der Plaetze keine Antwort vorsagt), darueber ein
//     Ball-Symbol mit Preisschild „6 €“.
// Ist die Situation zu Ende, gleitet unten ein Zettel „Rechnung“ herein:
//   „24 € : 4 = 6 €“ bzw. „24 € : 6 € = 4“ – Teile in den Farben ihres Bildes
//   (Geld bernstein, Kinder blau, Preis orange, Ergebnis dunkel).
//
// Bewegung (spielt nach der Sprungmarke SELBST ab, N1 im Bauplan: ein Schritt
// im Heft = eine Handlung; anhalten kann die Lehrkraft):
//   Aufbau 0,6 s: fehlende Muenzen springen zurueck in die Kasse (das Schild
//     zaehlt sie mit), die Geldboersen schweben von oben ein bzw. Ballwagen
//     und Preisschild erscheinen – nichts ragt dabei aus der Leinwand.
//   An Kinder: je Runde gleitet in jede Geldboerse eine Muenze (0,5 s je
//     Runde, leicht gestaffelt, im Bogen), bis die Kasse leer ist. Die Muenzen
//     verlassen die Kasse von hinten (zuerst die Viererreihe).
//   Ball fuer p €: p Muenzen fliegen aus der Kasse zu einem Stapel ueber der
//     Kasse (0,3 s), der Stapel gleitet auf den naechsten Ballplatz (0,3 s),
//     schrumpft und verschwindet, dort springt ein Ball auf (0,2 s) –
//     zusammen 0,8 s je Ball.
// Alles ist eine Funktion der Ablaufzeit z.at (_m5uAb, _m5uBallZeit, _m5uEnde):
// keine Zufallszahl, jede Zahl im Bild kommt aus derselben Rechnung wie die
// Statuszeilen (_m5uStand).
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5uWahl('…'), eine Wahlgruppe):
//     „24 € an 4 Kinder“ · „24 € an 6 Kinder“ · „24 €, Ball für 6 €“ ·
//     „24 €, Ball für 4 €“ (frei, nicht im Heft)
//   „noch einmal“ (_m5uNochmal(): die gewaehlte Situation neu abspielen; blass,
//     solange keine gewaehlt ist) · „neu“ (_m5uNeu(): Kasse mit 24 €, nichts gewaehlt)
//   Eine Sprungmarke waehrend des Ablaufs startet die Situation neu.
//
// Statuszeilen (woertlich, alle mit Wert mehr als 18 Zeichen – simfakten.js):
//   _m5u-situation  „Situation: 24 € an 4 Kinder“ (Start: „Situation: noch keine gewählt“)
//   _m5u-kasse      „Noch in der Kasse: 24 €“ (zaehlt herunter)
//   _m5u-ergebnis   am Ende „Jedes Kind bekommt: 6 €“ bzw.
//                   „Gekaufte Bälle: 4, übrig: 0 €“ (vorher „…“)
//   _m5u-rechnung   am Ende „Rechnung: 24 € : 4 = 6 €“ bzw. „Rechnung: 24 € : 6 € = 4“
//   _m5u-probe      am Ende „Probe mit der Malaufgabe: 4 · 6 € = 24 €“
// Rechnungen mit Groessen tragen Einheiten (N3): an Kinder Groesse : Zahl =
// Groesse, Ball fuer … Groesse : Groesse = Zahl, Probe Anzahl · Groesse.
//
// Werte (nachgerechnet, simcheck/werte.js):
//   24 € an 4 Kinder   → 6 € je Kind,  24 € : 4 = 6 €,  Probe 4 · 6 € = 24 €
//   24 € an 6 Kinder   → 4 € je Kind,  24 € : 6 = 4 €,  Probe 6 · 4 € = 24 €
//   24 €, Ball für 6 € → 4 Bälle,      24 € : 6 € = 4,  Probe 4 · 6 € = 24 €
//   24 €, Ball für 4 € → 6 Bälle,      24 € : 4 € = 6,  Probe 6 · 4 € = 24 €
// Start: Kasse mit 24 €, nichts gewaehlt (die Muenzen fallen beim Oeffnen hinein).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): „24 €, Ball für 6 €“ – der
// 4. Ball erscheint, die Kasse zeigt 0 € – Lichtring um die 4 Baelle, die
// Baelle leuchten 2,6 s nach. Einmal je Ablauf. Das widerlegt „144 Bälle“
// (mal gerechnet) und „18 Bälle“ (minus gerechnet).
//
// FUER DIE LEHRKRAFT (Bauart wie m5-plus-schriftlich, Container fpm-lehrkraft
// fuer simfakten.js, V3 im Bauplan): eigene Knopfzeile UNTER den Heftknoepfen,
// davor klein „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m5uAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links auf der Leinwand (Stelle wie in m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m5uTempo()): ein Drittel so schnell.
//   „Zahlen verdecken: aus“ ↔ „… an“ (_m5uVerdecken()): verdeckt Rechnung und
//     Ergebnis (Statuszeilen, Betraege ueber den Geldboersen, Zettel) bis zum
//     Aufdecken – zum Vermuten an der Tafel. Die Kasse zaehlt weiter sichtbar.
//   Eine Sprungmarke, „noch einmal“ oder „neu“ heben die Pause auf; Tempo und
//   Verdecken bleiben stehen (die Lehrkraft stellt sie einmal ein).
//   Das wechselnde Wort steht in einem eigenen <span>, damit die Aufschrift
//   nicht als Statuszeile in den Faktendump geraet.
// Hinweiszeile _m5u-lehrkraft (in der Pause bernsteinfarben) nennt immer die
// Einstellung: „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal,
// Zahlen: sichtbar.“ – so aendert JEDER Lehrkraft-Knopf eine Zeile, und
// simfakten.js legt ihn nicht einmal um und laesst ihn dann umgelegt stehen.
// Voreinstellung (Pause aus, Tempo normal, Zahlen sichtbar): Zeitfaktor 1.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „aufteilen“,
// „Aufteilen“, „aufgeteilt“, „Quotient“, „Geteiltaufgabe“ – die Rechnung
// steht als Zeichen da. Keine Namen, keine Punkte, keine Zeitmessung.
// ════════════════════════════════════════════════════════════════════════
let _m5u = null;
const _m5uGELD = 24;
const _m5uSIT = {
  k4: { art: 'kinder', n: 4, text: '24 € an 4 Kinder' },
  k6: { art: 'kinder', n: 6, text: '24 € an 6 Kinder' },
  b6: { art: 'ball', preis: 6, text: '24 €, Ball für 6 €' },
  b4: { art: 'ball', preis: 4, text: '24 €, Ball für 4 €' }
};
const _m5uREIHE = ['k4', 'k6', 'b6', 'b4'];
const _m5uK = {
  // Kasse: Dose, Deckel, Schlitz, Schild
  DX0: 10, DX1: 168, DY0: 44, DY1: 162,
  LX0: 6, LX1: 172, LY0: 36, LY1: 48,
  SX0: 30, SX1: 148, SY0: 122, SY1: 152,
  // Muenzen in der Kasse: Radius, erste Mitte, Abstand, Fuenferluecke, Reihen
  MR: 6, MXS: 25.25, MP: 13.5, M5: 6, MRY: [68, 86, 104],
  // Geldboersen: Mitte des rechten Bereichs, Koerper, Betrag, Nummer, Muenzradius
  MITTE: 300, BY0: 100, BY1: 156, BBY: 84, BNY: 172, BMR: 5.5,
  // Ballwagen: Plaetze, Abstand, Mitte, Radius, Ablage
  PLAETZE: 8, PP: 27, PY: 126, PR: 11, RY0: 140, RY1: 145,
  // Preisschild (Ball-Symbol und Schild)
  TBX: 268, TBY: 58,
  // Stapel ueber der Kasse (unterste Muenze), Hoehe je Muenze
  STX: 150, STY: 25, STD: 3.4,
  // Zettel „Rechnung“
  ZX0: 100, ZX1: 320, ZY0: 186, ZY1: 238,
  // Zeiten in s
  T_AUF: 0.6, T_FUELL: 0.4, T_RUNDE: 0.5, STAG: 0.04, T_MFLUG: 0.3,
  T_BALL: 0.8, GSTAG: 0.02, T_GFLUG: 0.2, T_SAMMEL: 0.3, T_GLEIT: 0.3, T_WEG: 0.2,
  T_ZETTEL: 0.4,
  // Farben
  GELD: '#b45309', KIND: '#1d4ed8', BALL: '#c2410c', TINTE: '#0f172a', GRAU: '#64748b'
};

// ── Ablauf: alles aus der Ablaufzeit ─────────────────────────────────────
// Zeitpunkt, zu dem die m-te Muenze (0 … 23) die Kasse verlaesst.
function _m5uAb(S, m) {
  const K = _m5uK;
  if (S.art === 'kinder') return K.T_AUF + Math.floor(m / S.n) * K.T_RUNDE + (m % S.n) * K.STAG;
  return K.T_AUF + Math.floor(m / S.preis) * K.T_BALL + (m % S.preis) * K.GSTAG;
}
// Beginn von Ball b (die Muenzen fliegen los); der Ball erscheint T_SAMMEL + T_GLEIT spaeter.
function _m5uBallZeit(b) { return _m5uK.T_AUF + b * _m5uK.T_BALL; }
function _m5uBallDa(b) { return _m5uBallZeit(b) + _m5uK.T_SAMMEL + _m5uK.T_GLEIT; }
function _m5uEnde(S) {
  const K = _m5uK;
  if (S.art === 'kinder')
    return K.T_AUF + (_m5uGELD / S.n - 1) * K.T_RUNDE + (S.n - 1) * K.STAG + K.T_MFLUG;
  return K.T_AUF + (_m5uGELD / S.preis) * K.T_BALL;
}
// Stand zur Ablaufzeit: wie viele Muenzen weg, was in den Boersen, wie viele Baelle, fertig?
function _m5uStand(z) {
  const S = z.key ? _m5uSIT[z.key] : null;
  const st = { weg: 0, inKasse: _m5uGELD, boerse: [], baelle: 0, fertig: false };
  if (!S) return st;
  const K = _m5uK, at = z.at;
  for (let m = 0; m < _m5uGELD; m++) if (at >= _m5uAb(S, m)) st.weg++;
  st.inKasse = _m5uGELD - st.weg;
  if (S.art === 'kinder') {
    for (let j = 0; j < S.n; j++) st.boerse.push(0);
    for (let m = 0; m < _m5uGELD; m++) if (at >= _m5uAb(S, m) + K.T_MFLUG) st.boerse[m % S.n]++;
  } else {
    for (let b = 0; b < _m5uGELD / S.preis; b++) if (at >= _m5uBallDa(b)) st.baelle++;
  }
  st.fertig = at >= _m5uEnde(S);
  return st;
}

function _m5uInit() {
  _m5u = { t: 0, at: 0, key: null, fx: { teile: [] },
           pause: false, langsam: false, verdeckt: false };   // Lehrkraft-Einstellungen
  _m5uLaden(null);
  _m5u.fuell = _m5uGELD;                 // beim Oeffnen fallen alle 24 Muenzen in die Kasse
}
// Eine Situation laden (key = null: nichts gewaehlt). Was vorher fehlte, springt zurueck.
function _m5uLaden(key) {
  const z = _m5u;
  z.fuell = _m5uStand(z).weg;
  z.key = key; z.at = 0;
  z.stand = _m5uStand(z);
  z.kassePop = 9; z.boersePop = [9, 9, 9, 9, 9, 9];
  z.ende = false; z.zettel = 0; z.endGlanz = 0;
  z.aha = false; z.ahaGlanz = 0;
  z.fx.teile.length = 0;
  z.pause = false;                       // neu laden hebt die Pause auf
}
function _m5uHTML() {
  const marke = k => `<button class="sim-btn" id="_m5u-b-${k}" onclick="_m5uWahl('${k}')">${_m5uSIT[k].text.replace(/(\d) /g, '$1&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Bälle kann die Klasse kaufen?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle eine Situation. Die Münzen wandern von selbst.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5u-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5uREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m5u-nochmal" onclick="_m5uNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m5uNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m5u-pause" onclick="_m5uAnhalten()">Pause</button>
          <button class="sim-btn" id="_m5u-tempo" onclick="_m5uTempo()">Tempo: <span id="_m5u-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m5u-verdeckt" onclick="_m5uVerdecken()">Zahlen verdecken: <span id="_m5u-verdeckt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m5u-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5u-situation" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5u-kasse" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5u-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5u-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5u-probe" style="margin-top:6px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 24&nbsp;€ in der Kasse</p>
  </div>`;
}
function _m5uSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m5uStatus() {
  if (!_m5u) return;
  const z = _m5u, K = _m5uK, S = z.key ? _m5uSIT[z.key] : null, st = z.stand;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const G = _m5uGELD, fertig = !!(S && st.fertig), zu = z.verdeckt;
  _m5uSetze('_m5u-situation', 'Situation: ' + (S ? S.text : 'noch keine gewählt'));
  _m5uSetze('_m5u-kasse', 'Noch in der Kasse: ' + f(st.inKasse + ' €', K.GELD));
  let erg = 'Ergebnis: …', rech = 'Rechnung: …', probe = 'Probe mit der Malaufgabe: …';
  if (S && S.art === 'kinder') {
    const je = G / S.n;
    erg = 'Jedes Kind bekommt: ' + (!fertig ? '…' : zu ? 'verdeckt' : f(je + ' €', K.TINTE));
    if (fertig) {
      rech = 'Rechnung: ' + (zu ? 'verdeckt'
           : f(G + ' €', K.GELD) + ' : ' + f(S.n, K.KIND) + ' = ' + f(je + ' €', K.TINTE));
      probe = 'Probe mit der Malaufgabe: ' + (zu ? 'verdeckt'
            : f(S.n, K.KIND) + ' · ' + f(je + ' €', K.TINTE) + ' = ' + f(G + ' €', K.GELD));
    }
  } else if (S) {
    const n = Math.floor(G / S.preis), rest = G - n * S.preis;
    erg = 'Gekaufte Bälle: ' + (!fertig ? '…' : zu ? 'verdeckt'
        : f(n, K.TINTE) + ', übrig: ' + f(rest + ' €', K.GELD));
    if (fertig) {
      rech = 'Rechnung: ' + (zu ? 'verdeckt'
           : f(G + ' €', K.GELD) + ' : ' + f(S.preis + ' €', K.BALL) + ' = ' + f(n, K.TINTE));
      probe = 'Probe mit der Malaufgabe: ' + (zu ? 'verdeckt'
            : f(n, K.TINTE) + ' · ' + f(S.preis + ' €', K.BALL) + ' = ' + f(G + ' €', K.GELD));
    }
  }
  _m5uSetze('_m5u-ergebnis', erg);
  _m5uSetze('_m5u-rechnung', rech);
  _m5uSetze('_m5u-probe', probe);
  _m5uREIHE.forEach(k => {
    const b = document.getElementById('_m5u-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  const nm = document.getElementById('_m5u-nochmal');
  if (nm) { nm.disabled = !S; if (nm.style) nm.style.opacity = S ? '' : '0.45'; }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m5uSetze('_m5u-pause', z.pause ? 'weiter' : 'Pause');
  _m5uSetze('_m5u-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m5uSetze('_m5u-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m5uSetze('_m5u-lehrkraft', _m5uHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m5u-pause', z.pause], ['_m5u-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m5uHinweis() {
  const z = _m5u;
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Zahlen: ' + (z.verdeckt ? 'verdeckt' : 'sichtbar') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m5uWahl(key) {
  if (!_m5u || !_m5uSIT[key]) return;
  _m5uLaden(key);
  _m5uStatus();
}
function _m5uNochmal() {
  if (!_m5u || !_m5u.key) return;
  _m5uLaden(_m5u.key);
  _m5uStatus();
}
function _m5uNeu() {
  if (!_m5u) return;
  _m5uLaden(null);
  _m5uStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m5uAnhalten() {
  if (!_m5u) return;
  _m5u.pause = !_m5u.pause;
  _m5uStatus();
}
function _m5uTempo() {
  if (!_m5u) return;
  _m5u.langsam = !_m5u.langsam;
  _m5uStatus();
}
function _m5uVerdecken() {
  if (!_m5u) return;
  _m5u.verdeckt = !_m5u.verdeckt;
  _m5uStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m5uZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5uUpdate(dt) {
  if (!_m5u) return;
  const z = _m5u, K = _m5uK;
  dt = _bioFxDt(dt) * _m5uZeitfaktor(z);            // ab hier Sim-Zeit
  z.t += dt; z.at += dt;
  z.kassePop += dt;
  for (let j = 0; j < z.boersePop.length; j++) z.boersePop[j] += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.endGlanz = Math.max(0, z.endGlanz - dt);
  if (z.ende) z.zettel = Math.min(1, z.zettel + dt / K.T_ZETTEL);
  if (z.key && dt > 0) {                            // ohne Zeit kein Schritt im Ablauf
    const st = _m5uStand(z), alt = z.stand;
    let neu = false;
    if (st.inKasse !== alt.inKasse) { z.kassePop = 0; neu = true; }
    st.boerse.forEach((c, j) => { if (c !== (alt.boerse[j] || 0)) z.boersePop[j] = 0; });
    if (z.key === 'b6' && !z.aha && st.baelle >= 4) {
      // Aha: der 4. Ball ist da, die Kasse ist leer
      z.aha = true; z.ahaGlanz = 2.6;
      _bioFxWelle(z.fx.teile, (_m5uPlatzX(0) + _m5uPlatzX(3)) / 2, K.PY, '#f59e0b', 74);
    }
    if (st.fertig && !z.ende) { z.ende = true; z.zettel = 0; z.endGlanz = 1.6; neu = true; }
    z.stand = st;
    if (neu) _m5uStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Orte ────────────────────────────────────────────────────────────────
// Platz q (0 … 23) in der Kasse: Reihen zu 10, 10, 4, nach fuenf eine Luecke.
function _m5uKassePlatz(q) {
  const K = _m5uK, r = q < 10 ? 0 : q < 20 ? 1 : 2, j = q - r * 10;
  return { x: K.MXS + j * K.MP + (j >= 5 ? K.M5 : 0), y: K.MRY[r] };
}
function _m5uBoerseX(S, j) { return _m5uK.MITTE + (j - (S.n - 1) / 2) * (S.n === 4 ? 55 : 37); }
function _m5uBoerseB(S) { return S.n === 4 ? 44 : 30; }
// Platz der r-ten Muenze in Geldboerse j: zwei Spalten, von unten nach oben.
function _m5uBoersePlatz(S, j, r) {
  return { x: _m5uBoerseX(S, j) + (r % 2 ? 6 : -6), y: _m5uK.BY1 - 11 - Math.floor(r / 2) * 12 };
}
function _m5uPlatzX(i) { return _m5uK.MITTE + (i - (_m5uK.PLAETZE - 1) / 2) * _m5uK.PP; }

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5uText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m5uK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Ein-Euro-Muenze: goldener Rand, silberner Kern. ry < r: schraeg von der Seite (Stapel).
function _m5uMuenze(ctx, x, y, r, ry, a) {
  if (a <= 0.01 || r <= 0.3) return;
  ry = ry === undefined ? r : ry;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (ry < r - 0.5) {                                // Kante
    ctx.fillStyle = '#d97706';
    ctx.beginPath(); ctx.ellipse(x, y + 1.8, r, ry, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.ellipse(x, y, r, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e5e7eb'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.ellipse(x, y, r * 0.56, ry * 0.56, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function _m5uBall(ctx, x, y, r, k, a) {
  if ((a !== undefined && a <= 0.01) || k <= 0.01) return;
  ctx.save();
  if (a !== undefined) ctx.globalAlpha = Math.min(1, a);
  ctx.translate(x, y);
  if (k !== 1) ctx.scale(k, k);
  ctx.fillStyle = '#fb923c'; ctx.strokeStyle = '#c2410c'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 1;                   // Naehte
  ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
  ctx.beginPath(); ctx.arc(-r * 1.25, 0, r * 0.9, -0.85, 0.85); ctx.stroke();
  ctx.beginPath(); ctx.arc(r * 1.25, 0, r * 0.9, Math.PI - 0.85, Math.PI + 0.85); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath(); ctx.arc(-r * 0.38, -r * 0.42, r * 0.26, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function _m5uKasse(ctx) {
  const z = _m5u, K = _m5uK, E = _bioFxEase;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, K.DX0 + 3, K.DY0 + 4, K.DX1 - K.DX0, K.DY1 - K.DY0, 10); ctx.fill();
  const g = ctx.createLinearGradient(K.DX0, 0, K.DX1, 0);
  g.addColorStop(0, '#e2e8f0'); g.addColorStop(0.5, '#f8fafc'); g.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = g; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.6;
  _bioFxRundRect(ctx, K.DX0, K.DY0, K.DX1 - K.DX0, K.DY1 - K.DY0, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#cbd5e1';
  _bioFxRundRect(ctx, K.LX0, K.LY0, K.LX1 - K.LX0, K.LY1 - K.LY0, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#334155';
  _bioFxRundRect(ctx, (K.LX0 + K.LX1) / 2 - 15, K.LY0 + 4, 30, 4, 2); ctx.fill();   // Schlitz
  ctx.restore();
  // Muenzen: weg ist, was nach _m5uAb schon losgeflogen ist (von hinten her)
  const weg = z.stand.weg, ab = _m5uGELD - z.fuell;
  let drin = 0;                                      // so viele Muenzen sind zu sehen
  for (let q = 0; q < _m5uGELD; q++) {
    if (_m5uGELD - 1 - q < weg) continue;
    let k = 1;
    if (q >= ab) {                                   // springt beim Laden zurueck in die Kasse
      const u = (z.at - (q - ab) * (K.T_FUELL / Math.max(1, z.fuell))) / 0.25;
      if (u <= 0) continue;
      k = u < 1 ? Math.max(0.3, E.federn(u)) : 1;
    }
    drin++;
    const p = _m5uKassePlatz(q);
    _m5uMuenze(ctx, p.x, p.y, K.MR * k, K.MR * k, 1);
  }
  // Schild „Kasse: 24 €“ – zaehlt die Muenzen, die zu sehen sind (auch beim
  // Zurueckspringen), springt kurz bei jeder Aenderung
  ctx.save();
  ctx.fillStyle = '#fffbeb'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.8;
  _bioFxRundRect(ctx, K.SX0, K.SY0, K.SX1 - K.SX0, K.SY1 - K.SY0, 8); ctx.fill(); ctx.stroke();
  const pop = z.kassePop < 0.3 ? 1 + 0.12 * Math.sin(Math.PI * z.kassePop / 0.3) : 1;
  ctx.translate((K.SX0 + K.SX1) / 2, (K.SY0 + K.SY1) / 2);
  ctx.scale(pop, pop);
  _m5uText(ctx, 'Kasse: ' + drin + ' €', 0, 6, 17, K.GELD);
  ctx.restore();
}
function _m5uBoersen(ctx, S) {
  const z = _m5u, K = _m5uK, E = _bioFxEase, w = _m5uBoerseB(S);
  for (let j = 0; j < S.n; j++) {
    const e = E.sanft(_bioFxKlemme((z.at - j * 0.04) / 0.4));
    if (e <= 0.01) continue;
    const x = _m5uBoerseX(S, j);                    // schwebt von oben ein, bleibt im Bild
    ctx.save();
    ctx.globalAlpha = e;
    ctx.translate(0, -18 * (1 - e));
    ctx.fillStyle = 'rgba(15,23,42,0.10)';
    _bioFxRundRect(ctx, x - w / 2 + 2, K.BY0 + 3, w, K.BY1 - K.BY0, 9); ctx.fill();
    ctx.fillStyle = '#bfdbfe'; ctx.strokeStyle = K.KIND; ctx.lineWidth = 1.6;
    _bioFxRundRect(ctx, x - w / 2, K.BY0, w, K.BY1 - K.BY0, 9); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#93c5fd';                       // Buegel
    _bioFxRundRect(ctx, x - w / 2 + 2, K.BY0 - 3, w - 4, 7, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = K.KIND;                          // Verschluss
    for (const s of [-3.5, 3.5]) { ctx.beginPath(); ctx.arc(x + s, K.BY0 - 6, 3, 0, Math.PI * 2); ctx.fill(); }
    const c = z.stand.boerse[j] || 0;
    for (let r = 0; r < c; r++) {
      const p = _m5uBoersePlatz(S, j, r);
      _m5uMuenze(ctx, p.x, p.y, K.BMR, K.BMR, 1);
    }
    // Betrag darueber (am Ende kurz hinterlegt; verdeckt: „?“)
    if (z.endGlanz > 0 && !z.verdeckt) {
      ctx.save();
      ctx.globalAlpha = e * Math.min(1, z.endGlanz / 0.6) * (0.55 + 0.45 * Math.sin(z.t * 6));
      ctx.fillStyle = 'rgba(252,211,77,0.55)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
      _bioFxRundRect(ctx, x - 17, K.BBY - 16, 34, 21, 7); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    const bp = z.boersePop[j] < 0.3 ? 1 + 0.18 * Math.sin(Math.PI * z.boersePop[j] / 0.3) : 1;
    ctx.save();
    ctx.translate(x, K.BBY - 5); ctx.scale(bp, bp);
    _m5uText(ctx, z.verdeckt ? '?' : c + ' €', 0, 5, 15, K.TINTE);
    ctx.restore();
    // Nummer darunter
    ctx.fillStyle = K.KIND;
    ctx.beginPath(); ctx.arc(x, K.BNY, 9, 0, Math.PI * 2); ctx.fill();
    _m5uText(ctx, String(j + 1), x, K.BNY + 4.5, 12, '#ffffff');
    ctx.restore();
  }
}
function _m5uBaelle(ctx, S) {
  const z = _m5u, K = _m5uK, E = _bioFxEase;
  const e = E.sanft(_bioFxKlemme(z.at / 0.4)), dy = -14 * (1 - e);
  ctx.save();
  ctx.globalAlpha = e;
  // Ballwagen: Ablage und acht leere Plaetze
  ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, K.MITTE - 110, K.RY0, 220, K.RY1 - K.RY0, 2.5); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3; ctx.setLineDash([3, 3]);
  for (let i = 0; i < K.PLAETZE; i++) {
    ctx.beginPath(); ctx.arc(_m5uPlatzX(i), K.PY, K.PR, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.setLineDash([]);
  // Preisschild: Ball-Symbol, Faden, Schild „6 €“
  const bx = K.TBX, by = K.TBY + dy;
  _m5uBall(ctx, bx, by, 11, 1);
  ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(bx + 10, by - 4); ctx.lineTo(bx + 26, by - 4); ctx.stroke();
  ctx.fillStyle = '#fff7ed'; ctx.strokeStyle = K.BALL; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(bx + 22, by - 4); ctx.lineTo(bx + 31, by - 16); ctx.lineTo(bx + 80, by - 16);
  ctx.lineTo(bx + 80, by + 8); ctx.lineTo(bx + 31, by + 8); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(bx + 30, by - 4, 2.4, 0, Math.PI * 2); ctx.stroke();
  _m5uText(ctx, S.preis + ' €', bx + 56, by + 2, 16, K.BALL);
  ctx.restore();
  // Baelle, die schon da sind (springen beim Erscheinen auf)
  for (let b = 0; b < z.stand.baelle; b++) {
    const x = _m5uPlatzX(b), alter = z.at - _m5uBallDa(b);
    const glanz = Math.max(z.ahaGlanz / 2.6, z.endGlanz / 1.6);
    if (glanz > 0) {
      ctx.save(); ctx.globalAlpha = Math.min(1, glanz * 1.6);
      _bioFxLeuchten(ctx, x, K.PY, 13, z.t, '245,158,11');
      ctx.restore();
    }
    _m5uBall(ctx, x, K.PY, K.PR, alter < 0.25 ? Math.max(0.3, E.federn(alter / 0.25)) : 1);
  }
}
// Was gerade fliegt: Muenzen zu den Geldboersen bzw. Muenzen zum Stapel und der Stapel zum Platz.
function _m5uFlug(ctx, S) {
  const z = _m5u, K = _m5uK, E = _bioFxEase, kl = _bioFxKlemme, at = z.at;
  if (S.art === 'kinder') {
    for (let m = 0; m < _m5uGELD; m++) {
      const u = (at - _m5uAb(S, m)) / K.T_MFLUG;
      if (u < 0 || u >= 1) continue;
      const e = E.sanft(u), a = _m5uKassePlatz(_m5uGELD - 1 - m);
      const b = _m5uBoersePlatz(S, m % S.n, Math.floor(m / S.n));
      const x = a.x + (b.x - a.x) * e, y = a.y + (b.y - a.y) * e - 34 * Math.sin(Math.PI * e);
      const r = K.MR + (K.BMR - K.MR) * e;
      _m5uMuenze(ctx, x, y, r, r, 1);
    }
    return;
  }
  const p = S.preis;
  for (let b = 0; b < _m5uGELD / p; b++) {
    const lt = at - _m5uBallZeit(b);
    if (lt < 0 || lt >= K.T_SAMMEL + K.T_GLEIT + K.T_WEG) continue;
    if (lt < K.T_SAMMEL) {
      // die Muenzen fliegen einzeln zum Stapel ueber der Kasse und kippen dabei flach
      for (let i = 0; i < p; i++) {
        const u = (lt - i * K.GSTAG) / K.T_GFLUG;
        if (u < 0) continue;
        const e = E.sanft(kl(u)), a = _m5uKassePlatz(_m5uGELD - 1 - (b * p + i));
        const zx = K.STX, zy = K.STY - i * K.STD;
        const x = a.x + (zx - a.x) * e, y = a.y + (zy - a.y) * e - 10 * Math.sin(Math.PI * e);
        _m5uMuenze(ctx, x, y, K.MR + 2 * e, K.MR - 3.3 * e, 1);
      }
    } else {
      // der Stapel gleitet auf den Ballplatz, dann schrumpft er und verschwindet
      const e = E.sanft(kl((lt - K.T_SAMMEL) / K.T_GLEIT));
      const w = kl((lt - K.T_SAMMEL - K.T_GLEIT) / K.T_WEG);
      const zx = _m5uPlatzX(b), zy = K.PY + 7;
      const sx = K.STX + (zx - K.STX) * e, sy = K.STY + (zy - K.STY) * e;
      const k = 1 - 0.7 * w;
      for (let i = 0; i < p; i++)
        _m5uMuenze(ctx, sx, sy - i * K.STD * k, (K.MR + 2) * k, (K.MR - 3.3) * k, 1 - w);
    }
  }
}
// Zettel „Rechnung“ unten – gleitet am Ende herein; Teile in den Farben ihres Bildes.
function _m5uZettel(ctx, S) {
  const z = _m5u, K = _m5uK, e = _bioFxEase.sanft(z.zettel);
  if (e <= 0.01) return;
  const dy = 10 * (1 - e), x0 = K.ZX0, x1 = K.ZX1, y0 = K.ZY0 + dy, y1 = K.ZY1 + dy;
  ctx.save();
  ctx.globalAlpha = e;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 3, x1 - x0, y1 - y0, 8); ctx.fill();
  ctx.fillStyle = z.verdeckt ? '#e2e8f0' : '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 8); ctx.fill(); ctx.stroke();
  _m5uText(ctx, 'Rechnung', x0 + 10, y0 + 15, 11, K.GRAU, 'left', '600');
  if (z.verdeckt) {
    _m5uText(ctx, 'verdeckt', (x0 + x1) / 2, y0 + 37, 16, '#94a3b8', 'center', '600');
    ctx.restore();
    return;
  }
  const G = _m5uGELD;
  const teile = S.art === 'kinder'
    ? [[G + ' €', K.GELD], [':', K.TINTE], [String(S.n), K.KIND], ['=', K.TINTE], [G / S.n + ' €', K.TINTE]]
    : [[G + ' €', K.GELD], [':', K.TINTE], [S.preis + ' €', K.BALL], ['=', K.TINTE], [String(G / S.preis), K.TINTE]];
  const gr = 22;
  ctx.font = '700 ' + gr + 'px sans-serif';
  const br = teile.map(t => ctx.measureText(t[0]).width), luft = gr * 0.36;
  const ges = br.reduce((s, b) => s + b, 0) + luft * (teile.length - 1);
  let x = (x0 + x1) / 2 - ges / 2;
  teile.forEach((t, i) => { _m5uText(ctx, t[0], x, y0 + 40, gr, t[1], 'left'); x += br[i] + luft; });
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m5uPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m5uText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m5uDraw(ctx, cv) {
  if (!_m5u) return;
  const z = _m5u, W = cv.width, H = cv.height;
  const S = z.key ? _m5uSIT[z.key] : null;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m5uKasse(ctx);
  if (S && S.art === 'kinder') _m5uBoersen(ctx, S);
  if (S && S.art === 'ball') _m5uBaelle(ctx, S);
  if (S) _m5uFlug(ctx, S);
  if (S && z.ende) _m5uZettel(ctx, S);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m5uPauseSchild(ctx);
}
