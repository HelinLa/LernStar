
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mu1 „Wie lang ist der Rand?“ (Kennung m5-umfang, Praefix _m6l)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL7_PROFIL.md, Abschnitte mu1 und m5-umfang.
// Ueberschrift = Frage der Einheit: „Wie viel Zaun braucht das Gehege?“
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   - Oben eine Wiese (hellgruen) von oben, mit feinem Raster: 1 Kaestchen = 1 m
//     (24 px). Das Gehege steht immer mit seiner Ecke unten links auf demselben
//     Gitterpunkt – so sieht man von Zeile zu Zeile, welche Seite waechst.
//   - Zaunteile: braune Latten mit einem kleinen Pfosten an jedem Ende, also ein
//     Pfosten an jedem Gitterpunkt des Rands. Die beiden LANGEN Seiten (unten,
//     oben) sind BLAU gerandet, die beiden KURZEN (rechts, links) ORANGE – ohne
//     Text sichtbar: jede Seitenlaenge kommt zweimal vor. Beim Quadrat 3 m x 3 m
//     gilt dieselbe Lage: waagerecht blau, senkrecht orange.
//   - Ist eine Seite fertig, springt aussen ihr Schild auf („4 m“ blau bzw. „2 m“
//     orange).
//   - Unter der Wiese ein gelbes Massband 0 bis 16 m (Striche je 1 m, Zahlen je
//     2 m, „0 m“ … „16 m“), im SELBEN Massstab wie die Wiese (24 px je m). Darum
//     ist eine abgewickelte Seite auf dem Band genau so lang wie am Gehege.
//   - Legende oben rechts: ein Zaunteil mit „1 m“.
//
// BEWEGUNG (jede Sprungmarke spielt SELBST ab, N1 im Bauplan: ein Schritt im
// Heft = eine Handlung; anhalten kann die Lehrkraft):
//   Aufbau 0,4 s: die Pfosten der vier Ecken springen auf (gestaffelt).
//   Dann gleitet Zaunteil fuer Zaunteil an seinen Platz (0,3 s je Teil, von
//     aussen herein, blendet dabei auf), beginnend unten links, gegen den
//     Uhrzeigersinn: unten (lang), rechts (kurz), oben (lang), links (kurz).
//     Die Statuszeile zaehlt jedes Teil, das steht.
//   Ist der Zaun zu, Ruhe 0,4 s, dann WIRD ER ABGEWICKELT: die vier Seiten
//     klappen nacheinander auf das Massband herunter (0,6 s je Seite, als
//     starres Stueck – gedreht und verschoben, nie gestaucht) und liegen dort
//     in einer Linie ab 0 m, Farben bleiben (blau, orange, blau, orange). Am
//     Gehege bleibt der Umriss gestrichelt stehen, die Schilder auch. Ueber
//     jeder abgelegten Seite springt ihr Schild auf. Das Ende der Linie zeigt
//     auf den Umfang: Markierung durch das Band, die Zahl dort hinterlegt.
//   Dauer ab Knopfdruck: 4 m x 1 m 6,2 s · 4 m x 2 m 6,8 s · 5 m x 2 m 7,4 s ·
//   3 m x 3 m 6,8 s. simfakten.js (--frames=25 --verlauf=4) liest das Ende im
//   zweiten Knopfdurchgang (bis 10 s) und beim „noch einmal“ der Wahlgruppe ab.
// Alles ist eine Funktion der Ablaufzeit z.at (_m6lZeiten, _m6lStand, _m6lLage):
// keine Zufallszahl; jede Zahl im Bild kommt aus derselben Rechnung wie die
// Statuszeilen.
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6lWahl('…'), Wahlgruppe):
//     „4 m lang, 1 m breit“ · „4 m lang, 2 m breit“ · „5 m lang, 2 m breit“ ·
//     „3 m lang, 3 m breit“ (frei, nicht im Heft)
//   Reihe 2: „noch einmal“ (_m6lNochmal: das gewaehlte Gehege neu aufbauen;
//     blass, solange keins gewaehlt ist) · „neu“ (_m6lNeu: leere Wiese)
//   Eine Sprungmarke waehrend des Ablaufs startet das Gehege neu.
//
// STATUSZEILEN (woertlich aus dem Bauplan, jede mit Wert mehr als 18 Zeichen):
//   _m6l-gehege    „Gehege: 4 m lang, 2 m breit“ (Start „Gehege: noch keins gewählt“)
//   _m6l-teile     „Aufgestellte Zaunteile: 7“ (zaehlt hoch, Start 0)
//   _m6l-seiten    „Seitenlängen: 4 m, 2 m, 4 m, 2 m“ (waechst mit jeder fertigen
//                  Seite; Start und vor der ersten Seite „Seitenlängen: noch keine“)
//   _m6l-rechnung  ist der Zaun zu: „Rechnung: 4 m + 2 m + 4 m + 2 m = …“,
//                  nach dem Abwickeln „Rechnung: 4 m + 2 m + 4 m + 2 m = 12 m“
//                  (vorher „Rechnung: …“)
//   _m6l-umfang    nach dem Abwickeln „Umfang des Geheges: 12 m“ (vorher „… …“)
// Jede Laenge mit Einheit (N3), zwischen Zahl und Einheit U+00A0. Die Zahlen
// tragen die Farbe ihrer Seite (blau lang, orange kurz) – Bild und Zeichen
// verbunden (MATHE_PROFIL § 10.2).
//
// WERTE (jede Zeile nachgerechnet mit simcheck/werte.js):
//   4 m lang, 1 m breit -> 10 Zaunteile, 4 m + 1 m + 4 m + 1 m = 10 m, Umfang 10 m
//   4 m lang, 2 m breit -> 12 Zaunteile, 4 m + 2 m + 4 m + 2 m = 12 m, Umfang 12 m
//   5 m lang, 2 m breit -> 14 Zaunteile, 5 m + 2 m + 5 m + 2 m = 14 m, Umfang 14 m
//   3 m lang, 3 m breit -> 12 Zaunteile, 3 m + 3 m + 3 m + 3 m = 12 m, Umfang 12 m
//   Halt nach 2 Seiten: 5 · 6 · 7 · 6 Zaunteile.
// START: leere Wiese, noch kein Zaun („Start: leere Wiese, noch kein Zaun“).
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen): „4 m lang, 2 m breit“ – das
// 12. Zaunteil schliesst den Zaun: Lichtring um das ganze Gehege, und die zwei
// Seiten, die erst nach den ersten beiden kommen (oben und links), leuchten
// 2,6 s bernstein mit – auch noch, waehrend sie aufs Band klappen. Einmal je
// Ablauf. Das widerlegt „6 m“ (nur zwei Seiten) und „8 m“ (4 · 2).
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen, Container fpm-lehrkraft fuer
// simfakten.js): eigene Knopfzeile UNTER den Heftknoepfen, davor klein
// „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m6lAnhalten): friert jede Bewegung ein (Aufbau,
//     Abwickeln, Schilder, Lichtring); Schild „Pause“ oben links.
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m6lTempo): ein Drittel so schnell.
//   „Halt nach 2 Seiten: aus“ <-> „… an“ (_m6lHalt): haelt den Aufbau nach der
//     ersten langen und der ersten kurzen Seite an – genau dort, wo die
//     Rechnung „4 m + 2 m“ aufhoert. Die Simulation steht dann in der Pause
//     (Knopf „weiter“, Schild „Pause“), die Hinweiszeile sagt
//     „Halt: Nach 2 Seiten stehen 6 Zaunteile. Dann „weiter“.“ (bei 4 m x 2 m).
//     „weiter“ oder der Schalter auf „aus“ bauen den Zaun fertig. Einmal je
//     Ablauf; wer den Schalter erst danach einlegt, haelt beim naechsten Ablauf.
//   Eine Sprungmarke, „noch einmal“ oder „neu“ heben die Pause auf; Tempo und
//   Halt bleiben stehen (die Lehrkraft stellt sie einmal ein). Das wechselnde
//   Wort steht in einem eigenen <span>. Hinweiszeile _m6l-lehrkraft nennt immer
//   die Einstellung (in der Pause bernsteinfarben). Voreinstellung (Pause aus,
//   Tempo normal, Halt aus): Zeitfaktor 1.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): „Summe“, „gegenüber“,
// „gleich lang“, „2-mal“/„zweimal“/„doppelt“, „alle Seiten“ als Regel,
// „addieren“. Die Rechnung steht als Zeichen da, die Wiederholung zeigen die
// Farben. Keine Namen, keine Punkte, keine Zeitmessung, kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m6l = null;
const _m6lGEHEGE = {
  l4b1: { L: 4, B: 1, text: '4 m lang, 1 m breit' },
  l4b2: { L: 4, B: 2, text: '4 m lang, 2 m breit' },
  l5b2: { L: 5, B: 2, text: '5 m lang, 2 m breit' },
  l3b3: { L: 3, B: 3, text: '3 m lang, 3 m breit' }
};
const _m6lREIHE = ['l4b1', 'l4b2', 'l5b2', 'l3b3'];
const _m6lK = {
  // Massstab: px je m – Wiese UND Massband
  S: 24,
  // Ecke unten links des Geheges (ein Gitterpunkt der Wiese)
  GX0: 150, GY0: 144,
  // Wiese
  WX0: 6, WX1: 414, WY0: 6, WY1: 174,
  // Massband: Nullpunkt, Bandflaeche, Laenge in m
  TX0: 22, BX0: 8, BX1: 412, BY0: 206, BY1: 230, BMAX: 16,
  // Mittellinie der abgewickelten Latten, Schilder darueber
  LY: 197, ZY: 187,
  // Legende oben rechts
  LX0: 330, LX1: 408, LY0: 12, LY1: 38,
  // Lattenstaerke, Hub beim Herunterklappen, Weg beim Hereingleiten
  DICK: 7, HUB: 16, REIN: 14,
  // Zeiten in s
  T_AUF: 0.4, T_TEIL: 0.3, T_RUH: 0.4, T_KLAPP: 0.6, T_POP: 0.3,
  // Farben
  LANG: '#1d4ed8', KURZ: '#c2410c', HOLZ: '#c08a4a', PFOSTEN: '#5b3a1a',
  BAND: '#fde047', BANDRAND: '#ca8a04', STRICH: '#713f12',
  WIESE: '#dcf3d2', WIESENRAND: '#86c27a', AHA: '#f59e0b',
  TINTE: '#0f172a', GRAU: '#64748b'
};

// ── Hilfen ───────────────────────────────────────────────────────────────
// Laenge mit Einheit, geschuetztes Leerzeichen zwischen Zahl und Einheit.
function _m6lM(x) { return x + ' m'; }
function _m6lName(G) { return G.text.replace(/(\d) /g, '$1 '); }
function _m6lX(mx) { return _m6lK.GX0 + mx * _m6lK.S; }
function _m6lY(my) { return _m6lK.GY0 - my * _m6lK.S; }
function _m6lFarbe(s) { return s.art === 'lang' ? _m6lK.LANG : _m6lK.KURZ; }

// Die vier Seiten in Aufbau-Reihenfolge. a: Startpunkt in m (x nach rechts,
// y nach oben), d: Richtung, n: Aussen-Normale, w0: Winkel auf der Leinwand,
// dw: Drehung beim Herunterklappen (danach liegt jede Seite waagerecht, Winkel 0),
// ab: wo die Seite auf dem Band beginnt (in m).
function _m6lSeiten(G) {
  const L = G.L, B = G.B, H = Math.PI / 2;
  const s = [
    { len: L, art: 'lang', a: [0, 0], d: [1, 0],  n: [0, -1], w0: 0,  dw: 0 },
    { len: B, art: 'kurz', a: [L, 0], d: [0, 1],  n: [1, 0],  w0: -H, dw: H },
    { len: L, art: 'lang', a: [L, B], d: [-1, 0], n: [0, 1],  w0: 2 * H, dw: -2 * H },
    { len: B, art: 'kurz', a: [0, B], d: [0, -1], n: [-1, 0], w0: H,  dw: -H }
  ];
  let ab = 0;
  s.forEach((t, k) => { t.k = k; t.ab = ab; ab += t.len; });
  return s;
}
// Zeitplan eines Geheges (Ablaufzeit in s).
function _m6lZeiten(G) {
  const K = _m6lK, S = _m6lSeiten(G), n = 2 * (G.L + G.B);
  const zu = K.T_AUF + n * K.T_TEIL, ab0 = zu + K.T_RUH;
  return {
    n, zu, ab0, ende: ab0 + 4 * K.T_KLAPP,
    seiteFertig: S.map(s => K.T_AUF + (s.ab + s.len) * K.T_TEIL),
    seiteLiegt: S.map(s => ab0 + (s.k + 1) * K.T_KLAPP)
  };
}
// Stand zur Ablaufzeit: wie viele Teile stehen, wie viele Seiten sind fertig,
// ist der Zaun zu, wie viele Seiten liegen auf dem Band, ist alles fertig?
function _m6lStand(z) {
  const st = { teile: 0, seiten: 0, zu: false, gelegt: 0, fertig: false };
  const G = z.key ? _m6lGEHEGE[z.key] : null;
  if (!G) return st;
  const K = _m6lK, T = _m6lZeiten(G), at = z.at + 1e-9;
  for (let i = 0; i < T.n; i++) if (at >= K.T_AUF + (i + 1) * K.T_TEIL) st.teile++;
  st.seiten = T.seiteFertig.filter(t => at >= t).length;
  st.zu = st.teile === T.n;
  st.gelegt = T.seiteLiegt.filter(t => at >= t).length;
  st.fertig = at >= T.ende;
  return st;
}
// Lage einer Seite beim Herunterklappen: e = 0 am Zaun, e = 1 auf dem Band.
// Starr: Mitte wandert (mit kleinem Hub), Winkel dreht – die Laenge bleibt.
function _m6lLage(s, e) {
  const K = _m6lK, hl = s.len * K.S / 2;
  const ax = _m6lX(s.a[0]), ay = _m6lY(s.a[1]);
  const fx = ax + Math.cos(s.w0) * hl, fy = ay + Math.sin(s.w0) * hl;
  const tx = K.TX0 + s.ab * K.S + hl, ty = K.LY;
  return { x: fx + (tx - fx) * e, y: fy + (ty - fy) * e - K.HUB * Math.sin(Math.PI * e),
           w: s.w0 + s.dw * e, hl };
}
function _m6lKlapp(s, T, at) {
  const K = _m6lK;
  return _bioFxEase.sanft(_bioFxKlemme((at - T.ab0 - s.k * K.T_KLAPP) / K.T_KLAPP));
}

function _m6lInit() {
  _m6l = { t: 0, at: 0, key: null, fx: { teile: [] },
           pause: false, langsam: false, halt: false };   // Lehrkraft-Einstellungen
  _m6lLaden(null);
}
// Ein Gehege laden (key = null: leere Wiese). Hebt die Pause auf.
function _m6lLaden(key) {
  const z = _m6l;
  z.key = key; z.at = 0;
  z.stand = _m6lStand(z);
  z.aha = false; z.ahaGlanz = 0;
  z.ende = false; z.endGlanz = 0;
  z.gehalten = false; z.haltJetzt = false;
  z.fx.teile.length = 0;
  z.pause = false;
}
function _m6lHTML() {
  const marke = k => `<button class="sim-btn" id="_m6l-b-${k}" onclick="_m6lWahl('${k}')">${_m6lGEHEGE[k].text.replace(/(\d) /g, '$1&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viel Zaun braucht das Gehege?</h3>
    <div class="fpm-note" style="margin-top:2px">Jedes Zaunteil ist 1&nbsp;m lang. Wähle ein Gehege und sieh zu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6l-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6lREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6l-nochmal" onclick="_m6lNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m6lNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6l-pause" onclick="_m6lAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6l-tempo" onclick="_m6lTempo()">Tempo: <span id="_m6l-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6l-halt" onclick="_m6lHalt()">Halt nach 2 Seiten: <span id="_m6l-halt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6l-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6l-gehege" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6l-teile" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6l-seiten" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6l-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6l-umfang" style="margin-top:6px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: leere Wiese, noch kein Zaun</p>
  </div>`;
}
function _m6lSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6lStatus() {
  if (!_m6l) return;
  const z = _m6l, K = _m6lK, G = z.key ? _m6lGEHEGE[z.key] : null, st = z.stand;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const fs = s => f(_m6lM(s.len), _m6lFarbe(s));
  let seiten = 'noch keine', rech = '…', umf = '…';
  if (G) {
    const S = _m6lSeiten(G), U = 2 * (G.L + G.B);
    if (st.seiten) seiten = S.slice(0, st.seiten).map(fs).join(', ');
    if (st.zu) rech = S.map(fs).join(' + ') + ' = ' + (st.fertig ? f(_m6lM(U), K.TINTE) : '…');
    if (st.fertig) umf = f(_m6lM(U), K.TINTE);
  }
  _m6lSetze('_m6l-gehege', 'Gehege: ' + (G ? _m6lName(G) : 'noch keins gewählt'));
  _m6lSetze('_m6l-teile', 'Aufgestellte Zaunteile: ' + f(st.teile, K.TINTE));
  _m6lSetze('_m6l-seiten', 'Seitenlängen: ' + seiten);
  _m6lSetze('_m6l-rechnung', 'Rechnung: ' + rech);
  _m6lSetze('_m6l-umfang', 'Umfang des Geheges: ' + umf);
  _m6lREIHE.forEach(k => {
    const b = document.getElementById('_m6l-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  const nm = document.getElementById('_m6l-nochmal');
  if (nm) { nm.disabled = !G; if (nm.style) nm.style.opacity = G ? '' : '0.45'; }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6lSetze('_m6l-pause', z.pause ? 'weiter' : 'Pause');
  _m6lSetze('_m6l-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6lSetze('_m6l-halt-an', z.halt ? 'an' : 'aus');
  const hz = _m6lSetze('_m6l-lehrkraft', _m6lHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6l-pause', z.pause], ['_m6l-halt', z.halt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6lHinweis() {
  const z = _m6l, G = z.key ? _m6lGEHEGE[z.key] : null;
  let a;
  if (z.pause && z.haltJetzt && G) a = 'Halt: Nach 2 Seiten stehen ' + (G.L + G.B) + ' Zaunteile. Dann „weiter“.';
  else if (z.pause) a = 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  else a = 'Für die Lehrkraft: „Pause“ hält alles an.';
  return a + ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt nach 2 Seiten: ' + (z.halt ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6lWahl(key) {
  if (!_m6l || !_m6lGEHEGE[key]) return;
  _m6lLaden(key);
  _m6lStatus();
}
function _m6lNochmal() {
  if (!_m6l || !_m6l.key) return;
  _m6lLaden(_m6l.key);
  _m6lStatus();
}
function _m6lNeu() {
  if (!_m6l) return;
  _m6lLaden(null);
  _m6lStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6lAnhalten() {
  if (!_m6l) return;
  _m6l.pause = !_m6l.pause;
  if (!_m6l.pause) _m6l.haltJetzt = false;
  _m6lStatus();
}
function _m6lTempo() {
  if (!_m6l) return;
  _m6l.langsam = !_m6l.langsam;
  _m6lStatus();
}
function _m6lHalt() {
  if (!_m6l) return;
  const z = _m6l;
  z.halt = !z.halt;
  if (!z.halt && z.haltJetzt) { z.pause = false; z.haltJetzt = false; }   // aus: weiterbauen
  _m6lStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6lZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6lUpdate(dt) {
  if (!_m6l) return;
  const z = _m6l, K = _m6lK;
  dt = _bioFxDt(dt) * _m6lZeitfaktor(z);            // ab hier Sim-Zeit
  z.t += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.endGlanz = Math.max(0, z.endGlanz - dt);
  const G = z.key ? _m6lGEHEGE[z.key] : null;
  if (G && dt > 0) {                                // ohne Zeit kein Schritt im Ablauf
    const T = _m6lZeiten(G);
    let neuAt = z.at + dt, neu = false;
    // Halt nach 2 Seiten: genau auf dem Zeitpunkt anhalten, an dem Seite 2 fertig ist
    const tHalt = T.seiteFertig[1];
    if (z.halt && !z.gehalten && z.at < tHalt - 1e-9 && neuAt >= tHalt - 1e-9) {
      neuAt = tHalt; z.gehalten = true; z.pause = true; z.haltJetzt = true; neu = true;
    }
    z.at = neuAt;
    const st = _m6lStand(z), alt = z.stand;
    if (st.teile !== alt.teile || st.seiten !== alt.seiten || st.zu !== alt.zu ||
        st.gelegt !== alt.gelegt || st.fertig !== alt.fertig) neu = true;
    if (z.key === 'l4b2' && !z.aha && st.zu) {
      // Aha: das 12. Zaunteil schliesst den Zaun
      z.aha = true; z.ahaGlanz = 2.6;
      _bioFxWelle(z.fx.teile, _m6lX(G.L / 2), _m6lY(G.B / 2), K.AHA, 78);
    }
    if (st.fertig && !z.ende) { z.ende = true; z.endGlanz = 1.6; }
    z.stand = st;
    if (neu) _m6lStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6lText(ctx, s, x, y, groesse, farbe, ausr, gew, grund) {
  ctx.fillStyle = farbe || _m6lK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = grund || 'alphabetic';
  ctx.fillText(s, x, y);
}
// Ein Zaunteil von (x1|y1) nach (x2|y2): Latte mit Rand in der Farbe der Seite,
// Maserung, an jedem Ende ein kleiner Pfosten.
function _m6lLatte(ctx, x1, y1, x2, y2, farbe, a) {
  if (a <= 0.01) return;
  const K = _m6lK, l = Math.hypot(x2 - x1, y2 - y1);
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
  ctx.rotate(Math.atan2(y2 - y1, x2 - x1));
  ctx.fillStyle = K.HOLZ; ctx.strokeStyle = farbe; ctx.lineWidth = 1.8;
  _bioFxRundRect(ctx, -l / 2 + 2, -K.DICK / 2, l - 4, K.DICK, 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(91,58,26,0.35)'; ctx.lineWidth = 0.8;   // Maserung
  ctx.beginPath(); ctx.moveTo(-l / 2 + 6, 0); ctx.lineTo(l / 2 - 6, 0); ctx.stroke();
  ctx.fillStyle = K.PFOSTEN;
  ctx.fillRect(-l / 2 - 2.5, -2.5, 5, 5);
  ctx.fillRect(l / 2 - 2.5, -2.5, 5, 5);
  ctx.restore();
}
function _m6lWiese(ctx) {
  const K = _m6lK;
  ctx.save();
  ctx.fillStyle = K.WIESE; ctx.strokeStyle = K.WIESENRAND; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.WX0, K.WY0, K.WX1 - K.WX0, K.WY1 - K.WY0, 10); ctx.fill(); ctx.stroke();
  // feines Raster, 1 Kaestchen = 1 m, ausgerichtet an der Gehege-Ecke
  ctx.strokeStyle = 'rgba(22,101,52,0.13)'; ctx.lineWidth = 1;
  ctx.beginPath();
  // (Linien naeher als 8 px am Rand fallen weg – sie wirkten wie ein doppelter Rand.)
  for (let x = K.GX0 - Math.floor((K.GX0 - K.WX0) / K.S) * K.S; x < K.WX1 - 8; x += K.S) {
    if (x <= K.WX0 + 8) continue;
    ctx.moveTo(x, K.WY0 + 2); ctx.lineTo(x, K.WY1 - 2);
  }
  for (let y = K.GY0 + Math.floor((K.WY1 - K.GY0) / K.S) * K.S; y > K.WY0 + 8; y -= K.S) {
    if (y >= K.WY1 - 8) continue;
    ctx.moveTo(K.WX0 + 2, y); ctx.lineTo(K.WX1 - 2, y);
  }
  ctx.stroke();
  ctx.restore();
}
// Legende oben rechts: ein Zaunteil, daneben „1 m“.
function _m6lLegende(ctx) {
  const K = _m6lK;
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, K.LX0, K.LY0, K.LX1 - K.LX0, K.LY1 - K.LY0, 6); ctx.fill(); ctx.stroke();
  ctx.restore();
  const y = (K.LY0 + K.LY1) / 2, x0 = K.LX0 + 12;
  _m6lLatte(ctx, x0, y, x0 + K.S, y, K.GRAU, 1);
  _m6lText(ctx, _m6lM(1), x0 + K.S + 10, y, 13, K.TINTE, 'left', '700', 'middle');
}
// Massband 0 bis 16 m: Striche je 1 m, Zahlen je 2 m (im Band, wie m5-laengen).
function _m6lBand(ctx) {
  const K = _m6lK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, K.BX0 + 2, K.BY0 + 3, K.BX1 - K.BX0, K.BY1 - K.BY0, 4); ctx.fill();
  ctx.fillStyle = K.BAND; ctx.strokeStyle = K.BANDRAND; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, K.BX0, K.BY0, K.BX1 - K.BX0, K.BY1 - K.BY0, 4); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = K.STRICH;
  for (let m = 0; m <= K.BMAX; m++) {
    const x = K.TX0 + m * K.S, gross = m % 2 === 0;
    ctx.lineWidth = gross ? 1.5 : 1;
    ctx.beginPath(); ctx.moveTo(x, K.BY0 + 1); ctx.lineTo(x, K.BY0 + (gross ? 10 : 6)); ctx.stroke();
  }
  ctx.restore();
  for (let m = 0; m <= K.BMAX; m += 2) {
    const t = _m6lM(m);
    ctx.font = '700 11px sans-serif';
    const w = ctx.measureText(t).width;
    const x = Math.min(K.BX1 - 3 - w / 2, Math.max(K.BX0 + 3 + w / 2, K.TX0 + m * K.S));
    _m6lText(ctx, t, x, K.BY1 - 5, 11, K.STRICH);
  }
}
// Pfosten der vier Ecken: springen beim Aufbau gestaffelt auf, bleiben stehen.
function _m6lEcken(ctx, G) {
  const z = _m6l, K = _m6lK, E = _bioFxEase;
  const ecken = [[0, 0], [G.L, 0], [G.L, G.B], [0, G.B]];
  ecken.forEach((p, q) => {
    const u = (z.at - q * 0.05) / 0.25;
    if (u <= 0) return;
    const k = u < 1 ? Math.max(0.3, E.federn(u)) : 1, r = 4.5 * k;
    const x = _m6lX(p[0]), y = _m6lY(p[1]);
    ctx.fillStyle = 'rgba(15,23,42,0.18)';
    ctx.fillRect(x - r + 1.5, y - r + 2, 2 * r, 2 * r);
    ctx.fillStyle = K.PFOSTEN;
    ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(x - r + 1.5, y - r + 1.5, r, r);
  });
}
// Umriss am Gehege, wo eine Seite schon heruntergeklappt ist (gestrichelt).
function _m6lUmriss(ctx, S, T) {
  const z = _m6l;
  ctx.save();
  ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
  for (const s of S) {
    const e = _m6lKlapp(s, T, z.at);
    if (e <= 0) continue;
    const L = _m6lLage(s, 0);
    ctx.globalAlpha = 0.5 * Math.min(1, e * 3);
    ctx.strokeStyle = _m6lFarbe(s);
    ctx.beginPath();
    ctx.moveTo(L.x - Math.cos(L.w) * L.hl, L.y - Math.sin(L.w) * L.hl);
    ctx.lineTo(L.x + Math.cos(L.w) * L.hl, L.y + Math.sin(L.w) * L.hl);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();
}
// Aha: die Seiten oben und links leuchten bernstein mit – auch beim Klappen.
function _m6lAhaGlanz(ctx, S, T) {
  const z = _m6l;
  if (z.ahaGlanz <= 0) return;
  const a = Math.min(1, z.ahaGlanz / 0.8) * (0.6 + 0.4 * Math.sin(z.t * 5));
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineWidth = 15;
  ctx.strokeStyle = 'rgba(245,158,11,' + (0.45 * a).toFixed(3) + ')';
  for (const s of [S[2], S[3]]) {
    const L = _m6lLage(s, _m6lKlapp(s, T, z.at));
    ctx.beginPath();
    ctx.moveTo(L.x - Math.cos(L.w) * L.hl, L.y - Math.sin(L.w) * L.hl);
    ctx.lineTo(L.x + Math.cos(L.w) * L.hl, L.y + Math.sin(L.w) * L.hl);
    ctx.stroke();
  }
  ctx.restore();
}
// Alle Zaunteile: im Aufbau gleiten sie von aussen herein, beim Abwickeln
// klappt jede Seite als Ganzes aufs Band.
function _m6lZaun(ctx, S, T) {
  const z = _m6l, K = _m6lK, E = _bioFxEase, kl = _bioFxKlemme, at = z.at;
  for (const s of S) {
    const L = _m6lLage(s, _m6lKlapp(s, T, at));
    const cw = Math.cos(L.w), sw = Math.sin(L.w), nx = s.n[0], ny = -s.n[1];
    for (let j = 0; j < s.len; j++) {
      const u = (at - K.T_AUF - (s.ab + j) * K.T_TEIL) / K.T_TEIL;
      if (u <= 0) continue;
      const weg = K.REIN * (1 - E.sanft(kl(u)));
      const o0 = j * K.S - L.hl, o1 = o0 + K.S, dx = nx * weg, dy = ny * weg;
      _m6lLatte(ctx, L.x + cw * o0 + dx, L.y + sw * o0 + dy,
                L.x + cw * o1 + dx, L.y + sw * o1 + dy, _m6lFarbe(s), kl(u * 2));
    }
  }
}
// Ein Schild, das beim Erscheinen kurz aufspringt.
function _m6lSchild(ctx, t, x, y, farbe, alter, ausr) {
  if (alter < 0) return;
  const K = _m6lK;
  const k = alter < K.T_POP ? Math.max(0.3, _bioFxEase.federn(alter / K.T_POP)) : 1;
  ctx.save();
  ctx.translate(x, y); ctx.scale(k, k);
  _m6lText(ctx, t, 0, 0, 13, farbe, ausr || 'center', '700', 'middle');
  ctx.restore();
}
// Schilder aussen am Gehege (wenn die Seite fertig ist) und ueber dem Band
// (wenn die Seite dort liegt).
function _m6lSchilder(ctx, G, S, T) {
  const z = _m6l, K = _m6lK, at = z.at;
  const xL = _m6lX(0), xR = _m6lX(G.L), yU = _m6lY(0), yO = _m6lY(G.B);
  const xm = (xL + xR) / 2, ym = (yU + yO) / 2;
  const orte = [[xm, yU + 14, 'center'], [xR + 9, ym, 'left'],
                [xm, yO - 13, 'center'], [xL - 9, ym, 'right']];
  for (const s of S) {
    const o = orte[s.k];
    // Der Halt nach 2 Seiten faellt genau auf den Augenblick, in dem das Schild
    // der zweiten Seite aufspringt. Ohne diese Zeile stuende es im Halt auf 30 %
    // Groesse (gesehen am Leinwandbild) und spraenge nach „weiter“ ein zweites Mal.
    let alter = at - T.seiteFertig[s.k] + 1e-9;
    if (z.gehalten && s.k === 1 && alter >= 0) alter = Math.max(alter, K.T_POP);
    _m6lSchild(ctx, _m6lM(s.len), o[0], o[1], _m6lFarbe(s), alter, o[2]);
    _m6lSchild(ctx, _m6lM(s.len), K.TX0 + (s.ab + s.len / 2) * K.S, K.ZY, _m6lFarbe(s),
               at - T.seiteLiegt[s.k] + 1e-9);
  }
}
// Das Ende der Linie zeigt auf den Umfang: Markierung durch das Band, Zahl hinterlegt.
function _m6lEnde(ctx, G) {
  const z = _m6l, K = _m6lK;
  if (!z.stand.fertig) return;
  const U = 2 * (G.L + G.B), x = K.TX0 + U * K.S;
  const puls = z.endGlanz > 0 ? 0.5 + 0.5 * Math.sin(z.t * 6) : 0;
  ctx.save();
  ctx.strokeStyle = K.AHA; ctx.lineWidth = 2.5 + 1.5 * puls;
  // beginnt am letzten Pfosten, nicht hoeher: bei 4 m x 1 m steht das Schild
  // „1 m“ der letzten Seite sonst direkt an der Linie
  ctx.beginPath(); ctx.moveTo(x, K.LY - 4); ctx.lineTo(x, K.BY0 + 11); ctx.stroke();
  const t = _m6lM(U);
  ctx.font = '700 12px sans-serif';
  const w = ctx.measureText(t).width + 10;
  ctx.fillStyle = 'rgba(252,211,77,' + (0.85 + 0.15 * puls).toFixed(3) + ')';
  ctx.strokeStyle = K.AHA; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, x - w / 2, K.BY1 - 18, w, 16, 6); ctx.fill(); ctx.stroke();
  ctx.restore();
  _m6lText(ctx, t, x, K.BY1 - 5.5, 12, K.TINTE);
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m6lPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6lText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6lDraw(ctx, cv) {
  if (!_m6l) return;
  const z = _m6l, W = cv.width, H = cv.height;
  const G = z.key ? _m6lGEHEGE[z.key] : null;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6lWiese(ctx);
  _m6lLegende(ctx);
  _m6lBand(ctx);
  if (G) {
    const S = _m6lSeiten(G), T = _m6lZeiten(G);
    _m6lUmriss(ctx, S, T);
    _m6lAhaGlanz(ctx, S, T);
    _m6lEcken(ctx, G);
    _m6lZaun(ctx, S, T);
    _m6lSchilder(ctx, G, S, T);
    _m6lEnde(ctx, G);
  }
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6lPauseSchild(ctx);
}
