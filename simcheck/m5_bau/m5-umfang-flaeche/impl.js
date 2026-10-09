
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mu5 „Gleicher Umfang, gleiche Fläche?“
// (Kennung m5-umfang-flaeche, Praefix _m6p)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL7_PROFIL.md, Abschnitte mu5 und
// „m5-umfang-flaeche (mu5)“.
// Ueberschrift NICHT die Frage der Einheit (sie nennt „gleich viel“ als
// Moeglichkeit), sondern laut Bauplan neutral:
// „Wie viel Platz hat ein Gehege mit 12 m Zaun?“
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   - Links neben der Wiese ein Stapel aus 12 Zaunteilen auf einer kleinen
//     Palette (Start). Das oberste Teil ist Teil 1: es traegt einen dunklen
//     Punkt in der Mitte – daran sieht man bei jedem Umbau, dass es DIESELBEN
//     12 Teile sind.
//   - Die Wiese (hellgruen) mit 1-m-Raster (30 px je m). Das Gehege steht immer
//     mit seiner Ecke unten links auf demselben Gitterpunkt; so sieht man von
//     Zeile zu Zeile, wie dieselben Teile eine andere Form bilden.
//   - Zaunteile: braune Latten (je 1 m) mit einem kleinen Pfosten an jedem
//     Ende, also ein Pfosten an jedem Gitterpunkt des Zauns.
//   - Steht der Zaun, springen aussen die Seitenlaengen auf („5 m“ unten und
//     oben, „1 m“ rechts und links), in der Farbe des Zauns – die Rechnung des
//     Umfangs ist damit am Bild ablesbar (Bild und Zeichen verbunden).
//   - Innen Rasenstuecke mit 1 m Seitenlaenge (sattgruen), Reihe fuer Reihe von
//     unten links gelegt.
//   - Rechts drei Merkfelder fuer die drei Gehege der Heft-Tabelle (Feld 1
//     „5 m lang, 1 m breit“, Feld 2 „4 m lang, 2 m breit“, Feld 3 „3 m lang,
//     3 m breit“), zuerst leer (gestrichelt). Nach seinem Ablauf zeigt jedes
//     seine Form klein (Rasen gruen, Zaun braun) und daneben „12 m“ (braun, wie
//     der Zaun) und seinen Flaecheninhalt (gruen, wie der Rasen).
//
// BEWEGUNG (jede Sprungmarke spielt SELBST ab, N1: ein Schritt im Heft = eine
// Handlung). Ablaufzeit at ab Knopfdruck:
//   0 – 0,9 s   die 12 Zaunteile gleiten aus der vorigen Form (beim ersten Mal
//               aus dem Stapel) in die neue, Teil fuer Teil leicht gestaffelt
//               (0,025 s Versatz, 0,625 s je Teil, kleiner Bogen). Der Rasen
//               des vorigen Geheges verblasst (0,6 s), seine Seitenschilder
//               auch (0,25 s).
//   0,9 s       die Seitenschilder springen auf.
//   ab 1,1 s    Rasenstueck fuer Rasenstueck (0,2 s je Stueck) faellt in das
//               Gehege, Reihe fuer Reihe; jede fertige Reihe blinkt kurz; die
//               Statuszeile zaehlt jedes gelandete Stueck.
//   + 0,3 s     „Umfang: … = 12 m“ erscheint, der Zaun leuchtet kurz auf.
//   + 0,6 s     „Flächeninhalt: … m²“ erscheint, der Rasen leuchtet kurz auf.
//   + 0,3 s     die Form fliegt verkleinert in ihr Merkfeld (0,6 s) – nur bei
//               den drei Gehegen der Tabelle; das freie Gehege hat keins.
//   Dauer ab Knopfdruck: 5 m x 1 m 3,9 s · 4 m x 2 m 4,5 s · 3 m x 3 m 4,7 s ·
//   2 m x 4 m 4,5 s (Frames zu 16 ms: 244 · 282 · 294 · 282). Gemessen 09.10.2026:
//   Umfang 3 m x 3 m bei 3,20 s, Flaecheninhalt bei 3,81 s, Merkfeld 3 bei 4,70 s.
//   Der Hausstandard-Dump (fakten_ziehen.py: --voll --frames=25 --verlauf=4) liest
//   in der Knopfreihe nur bis 2,0 s, findet die Endwerte aller vier Gehege aber in
//   den Durchgaengen mit zweitem Knopfdruck und „+ noch einmal“ (dort laeuft er bis zur Ruhe) –
//   kein Eintrag in stellen.json noetig.
//   „noch einmal“: dasselbe Gehege; der Zaun steht schon, der Rasen verblasst
//   und wird neu gelegt, die Rechnungen erscheinen neu.
//   „neu“: die 12 Teile gleiten zurueck auf den Stapel (0,9 s), Rasen und
//   Merkfelder verblassen.
//   Eine Sprungmarke waehrend eines Ablaufs startet neu: die Teile gleiten von
//   da aus, wo sie gerade sind.
// Alles ist eine Funktion der Ablaufzeit (_m6pZeiten, _m6pStand, _m6pPose):
// keine Zufallszahl; jede Zahl im Bild kommt aus derselben Rechnung wie die
// Statuszeilen.
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6pWahl('…')):
//     „5 m lang, 1 m breit“ · „4 m lang, 2 m breit“ · „3 m lang, 3 m breit“ ·
//     „2 m lang, 4 m breit“ (frei, nicht im Heft)
//   Reihe 2: „noch einmal“ (_m6pNochmal; blass, solange keins gewaehlt ist) ·
//     „neu“ (_m6pNeu)
//
// STATUSZEILEN (woertlich aus dem Bauplan, jede mit Wert mehr als 18 Zeichen):
//   _m6p-gehege  „Gehege: 4 m lang, 2 m breit“ (Start „Gehege: noch keins gewählt“)
//   _m6p-zaun    „Zaun: 12 Teile, je 1 m lang“ (bleibt immer gleich)
//   _m6p-umfang  am Ende „Umfang: 4 m + 2 m + 4 m + 2 m = 12 m“ (vorher „Umfang: …“)
//   _m6p-rasen   „Rasenstücke mit 1 m Seitenlänge: 8“ (zaehlt hoch, Start 0)
//   _m6p-flaeche am Ende „Flächeninhalt: 2 · 4 m² = 8 m²“ (vorher „Flächeninhalt: …“)
// Jede Laenge und Flaeche mit Einheit (N3), zwischen Zahl und Einheit U+00A0,
// „m²“ mit U+00B2, Malzeichen U+00B7. Flaeche = Reihen · m² je Reihe (E2):
// Reihen = Breite, je Reihe = Laenge. Laengen im Zaunbraun, Flaechen im
// Rasengruen – dieselben Farben wie im Bild.
//
// WERTE (jede Zeile nachgerechnet mit simcheck/werte.js):
//   5 m lang, 1 m breit -> 5 m + 1 m + 5 m + 1 m = 12 m · 5 Rasenstuecke · 1 · 5 m² = 5 m²
//   4 m lang, 2 m breit -> 4 m + 2 m + 4 m + 2 m = 12 m · 8 · 2 · 4 m² = 8 m²
//   3 m lang, 3 m breit -> 3 m + 3 m + 3 m + 3 m = 12 m · 9 · 3 · 3 m² = 9 m²
//   2 m lang, 4 m breit -> 2 m + 4 m + 2 m + 4 m = 12 m · 8 · 4 · 2 m² = 8 m² (frei)
// START: 12 Zaunteile gestapelt neben der Wiese („Start: 12 Zaunteile, noch kein Gehege“).
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen): „3 m lang, 3 m breit“ – das
// 9. Rasenstueck landet: Lichtring um das Gehege, das Gehege leuchtet 2,6 s
// bernstein nach. Landet danach seine Form in Merkfeld 3, Lichtring um
// Merkfeld 3 (2,6 s Nachleuchten) – dort steht „12 m“ wie in Feld 1 und 2,
// aber mehr m² (derselbe Zaun, mehr Rasen). Einmal je Ablauf.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen/m5-auslegen, Container
// fpm-lehrkraft fuer simfakten.js): eigene Knopfzeile UNTER den Heftknoepfen,
// davor klein „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m6pAnhalten): friert jede Bewegung ein; Schild
//     „Pause“ oben links.
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m6pTempo): ein Drittel so schnell.
//   „Zahlen verdecken: aus“ <-> „… an“ (_m6pVerdecken): verdeckt den
//     Flaecheninhalt – Statuszeile „Flächeninhalt: verdeckt“, die Rasenzahl
//     („Rasenstücke …: verdeckt“, sie IST die Zahl des Flaecheninhalts) und die
//     m²-Zahl in den Merkfeldern („? m²“) – bis zum Aufdecken, zum Vermuten an
//     der Tafel. Umfang und „12 m“ bleiben sichtbar.
//   Eine Sprungmarke, „noch einmal“ oder „neu“ heben die Pause auf; Tempo und
//   Verdecken bleiben stehen. Das wechselnde Wort steht in einem eigenen
//   <span>. Hinweiszeile _m6p-lehrkraft (in der Pause „lmp-status off“) nennt
//   immer die Einstellung. Voreinstellung: Zeitfaktor 1, Zahlen sichtbar.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): „Quadratmeter“
// (ausgeschrieben; nur „m²“), „gleich“/„nicht gleich“, „verschieden“,
// „am meisten“, „größte“, die Regel als Satz. Keine Namen, keine Punkte,
// keine Zeitmessung, kein „falsch“.
// ════════════════════════════════════════════════════════════════════════
let _m6p = null;
const _m6pGEHEGE = {
  l5b1: { L: 5, B: 1, text: '5 m lang, 1 m breit', feld: 0 },
  l4b2: { L: 4, B: 2, text: '4 m lang, 2 m breit', feld: 1 },
  l3b3: { L: 3, B: 3, text: '3 m lang, 3 m breit', feld: 2 },
  l2b4: { L: 2, B: 4, text: '2 m lang, 4 m breit', feld: -1 }
};
const _m6pREIHE = ['l5b1', 'l4b2', 'l3b3', 'l2b4'];
const _m6pFELDER = ['l5b1', 'l4b2', 'l3b3'];      // Merkfeld 1, 2, 3
const _m6pN = 12;                                  // Zaunteile, je 1 m
const _m6pK = {
  S: 30,                                           // px je m
  GX0: 88, GY0: 200,                               // Gehege-Ecke unten links
  WX0: 52, WX1: 272, WY0: 6, WY1: 244,             // Wiese
  SX: 27, SY0: 158, SDY: 7,                        // Stapel: Mitte x, oberstes Teil, Abstand
  PX0: 8, PX1: 46, PY0: 239, PY1: 245,             // Palette unter dem Stapel
  MX0: 280, MX1: 410, MY: [10, 90, 170], MH: 70,   // Merkfelder (Leuchtrahmen bleibt 4 px vor dem Rand)
  MS: 10,                                          // px je m im Merkfeld
  DICK: 7, HUB: 12,
  // Zeiten in s
  T_TEIL: 0.625, STAG: 0.025, T_GLEIT: 0.9, T_RASEN0: 1.1, T_STUECK: 0.2,
  T_RUH: 0.3, T_ZEIG: 0.6, T_VOR: 0.3, T_FLUG: 0.6, T_POP: 0.3,
  T_VERBLASS: 0.6, T_SCHILD_WEG: 0.25, T_BLINK: 0.35, T_LEUCHT: 0.8,
  // Farben
  HOLZ: '#c08a4a', HOLZRAND: '#7c4a1e', PFOSTEN: '#5b3a1a', PUNKT: '#2b1a0b',
  ZAUN_T: '#7c4a1e',                               // Zahlen des Umfangs (Zaunbraun)
  RASEN: '#3fae5a', RASENRAND: '#2a8a44', HALM: '#1f7a37',
  RASEN_T: '#15803d',                              // Zahlen der Flaeche (Rasengruen)
  WIESE: '#dcf3d2', WIESENRAND: '#86c27a', AHA: '#f59e0b',
  TINTE: '#0f172a', GRAU: '#64748b'
};

// ── Hilfen ───────────────────────────────────────────────────────────────
// Groesse mit Einheit, geschuetztes Leerzeichen zwischen Zahl und Einheit.
function _m6pM(x) { return x + ' m'; }
function _m6pQM(x) { return x + ' m²'; }
function _m6pName(G) { return G.text.replace(/(\d) /g, '$1 '); }
function _m6pX(mx) { return _m6pK.GX0 + mx * _m6pK.S; }
function _m6pY(my) { return _m6pK.GY0 - my * _m6pK.S; }

// Zeitplan eines Geheges (Ablaufzeit in s).
function _m6pZeiten(G) {
  const K = _m6pK, n = G.L * G.B;
  const tR = K.T_RASEN0 + n * K.T_STUECK;          // letztes Rasenstueck gelandet
  const tU = tR + K.T_RUH, tF = tU + K.T_ZEIG, tM = tF + K.T_VOR;
  return { n, tR, tU, tF, tM, ende: tM + K.T_FLUG,
           land: k => K.T_RASEN0 + (k + 1) * K.T_STUECK };
}
// Stand zur Ablaufzeit.
function _m6pStand(z) {
  const st = { steht: false, rasen: 0, umfang: false, flaeche: false, fertig: false };
  const G = z.key ? _m6pGEHEGE[z.key] : null, at = z.at + 1e-9;
  st.steht = at >= _m6pK.T_GLEIT;
  if (!G) { st.fertig = st.steht; return st; }
  const T = _m6pZeiten(G);
  for (let k = 0; k < T.n; k++) if (at >= T.land(k)) st.rasen++;
  st.umfang = at >= T.tU;
  st.flaeche = at >= T.tF;
  st.fertig = at >= T.ende;
  return st;
}
// Wo Teil i in der Form key liegt (key = null: auf dem Stapel).
// Die Teile laufen ab der Ecke unten links gegen den Uhrzeigersinn um das
// Gehege: unten, rechts, oben, links. Teil 1 (i = 0) liegt also immer unten links.
function _m6pZiel(key, i) {
  const K = _m6pK, H = Math.PI / 2;
  if (!key) return { x: K.SX, y: K.SY0 + i * K.SDY, w: 0 };
  const G = _m6pGEHEGE[key], L = G.L, B = G.B, s = i + 0.5;
  let x, y, w;
  if (s < L)               { x = s;                 y = 0;                     w = 0; }
  else if (s < L + B)      { x = L;                 y = s - L;                 w = H; }
  else if (s < 2 * L + B)  { x = L - (s - L - B);   y = B;                     w = 0; }
  else                     { x = 0;                 y = B - (s - 2 * L - B);   w = H; }
  return { x: _m6pX(x), y: _m6pY(y), w };
}
// Lage von Teil i JETZT: von z.von[i] zum Ziel, gestaffelt, mit kleinem Bogen.
// Eine Latte ist symmetrisch – gedreht wird nur um hoechstens eine Vierteldrehung.
function _m6pPose(z, i) {
  const K = _m6pK, a = z.von[i], b = _m6pZiel(z.key, i);
  const e = _bioFxEase.sanft(_bioFxKlemme((z.at - i * K.STAG) / K.T_TEIL));
  let d = b.w - a.w;
  d = ((d + Math.PI / 2) % Math.PI + Math.PI) % Math.PI - Math.PI / 2;
  const weit = Math.min(1, Math.hypot(b.x - a.x, b.y - a.y) / 20);
  return { x: a.x + (b.x - a.x) * e,
           y: a.y + (b.y - a.y) * e - K.HUB * weit * Math.sin(Math.PI * e),
           w: a.w + d * e };
}
function _m6pStapel() {
  const v = [];
  for (let i = 0; i < _m6pN; i++) v.push(_m6pZiel(null, i));
  return v;
}

function _m6pInit() {
  _m6p = { t: 0, at: 99, key: null, von: _m6pStapel(), alt: null,
           merk: [false, false, false], merkAlter: [9, 9, 9], merkWeg: null,
           fx: { teile: [] },
           pause: false, langsam: false, verdeckt: false };   // Lehrkraft-Einstellungen
  _m6p.stand = _m6pStand(_m6p);
  _m6p.ahaGlanz = 0; _m6p.merkGlanz = 0; _m6p.aha = false; _m6p.gemerkt = true;
}
// Eine Handlung beginnen (key = null: zurueck auf den Stapel). Die Teile
// starten dort, wo sie gerade sind. Hebt die Pause auf.
function _m6pLaden(key) {
  const z = _m6p;
  const von = [];
  for (let i = 0; i < _m6pN; i++) von.push(_m6pPose(z, i));
  z.alt = z.key ? { key: z.key, rasen: z.stand.rasen, schilder: z.stand.steht,
                    gleich: z.key === key } : null;
  z.von = von;
  z.key = key; z.at = 0;
  z.stand = _m6pStand(z);
  z.aha = false; z.ahaGlanz = 0; z.merkGlanz = 0;
  z.gemerkt = false;
  z.fx.teile.length = 0;
  z.pause = false;
}
function _m6pHTML() {
  const marke = k => `<button class="sim-btn" id="_m6p-b-${k}" onclick="_m6pWahl('${k}')">${_m6pGEHEGE[k].text.replace(/(\d) /g, '$1&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viel Platz hat ein Gehege mit 12&nbsp;m Zaun?</h3>
    <div class="fpm-note" style="margin-top:2px">Es sind immer dieselben 12 Zaunteile. Wähle ein Gehege und sieh zu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6p-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6pREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6p-nochmal" onclick="_m6pNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m6pNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6p-pause" onclick="_m6pAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6p-tempo" onclick="_m6pTempo()">Tempo: <span id="_m6p-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6p-verdeckt" onclick="_m6pVerdecken()">Zahlen verdecken: <span id="_m6p-verdeckt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6p-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6p-gehege" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6p-zaun" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6p-umfang" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6p-rasen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6p-flaeche" style="margin-top:6px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 12 Zaunteile, noch kein Gehege</p>
  </div>`;
}
function _m6pSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6pStatus() {
  if (!_m6p) return;
  const z = _m6p, K = _m6pK, G = z.key ? _m6pGEHEGE[z.key] : null, st = z.stand, zu = z.verdeckt;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  let umf = '…', fl = '…';
  if (G && st.umfang) {
    umf = [G.L, G.B, G.L, G.B].map(x => f(_m6pM(x), K.ZAUN_T)).join(' + ') +
          ' = ' + f(_m6pM(2 * (G.L + G.B)), K.ZAUN_T);
  }
  if (G && st.flaeche) {
    fl = f(G.B, K.TINTE) + ' · ' + f(_m6pQM(G.L), K.RASEN_T) + ' = ' + f(_m6pQM(G.L * G.B), K.RASEN_T);
  }
  _m6pSetze('_m6p-gehege', 'Gehege: ' + (G ? _m6pName(G) : 'noch keins gewählt'));
  _m6pSetze('_m6p-zaun', 'Zaun: ' + f(_m6pN, K.ZAUN_T) + ' Teile, je ' + _m6pM(1) + ' lang');
  _m6pSetze('_m6p-umfang', 'Umfang: ' + umf);
  _m6pSetze('_m6p-rasen', 'Rasenstücke mit ' + _m6pM(1) + ' Seitenlänge: ' +
            (zu ? 'verdeckt' : f(st.rasen, K.RASEN_T)));
  _m6pSetze('_m6p-flaeche', 'Flächeninhalt: ' + (zu ? 'verdeckt' : fl));
  _m6pREIHE.forEach(k => {
    const b = document.getElementById('_m6p-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  const nm = document.getElementById('_m6p-nochmal');
  if (nm) { nm.disabled = !G; if (nm.style) nm.style.opacity = G ? '' : '0.45'; }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6pSetze('_m6p-pause', z.pause ? 'weiter' : 'Pause');
  _m6pSetze('_m6p-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6pSetze('_m6p-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6pSetze('_m6p-lehrkraft', _m6pHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6p-pause', z.pause], ['_m6p-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6pHinweis() {
  const z = _m6p;
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Zahlen: ' + (z.verdeckt ? 'verdeckt' : 'sichtbar') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6pWahl(key) {
  if (!_m6p || !_m6pGEHEGE[key]) return;
  _m6pLaden(key);
  _m6pStatus();
}
function _m6pNochmal() {
  if (!_m6p || !_m6p.key) return;
  _m6pLaden(_m6p.key);
  _m6pStatus();
}
function _m6pNeu() {
  if (!_m6p) return;
  const z = _m6p;
  if (z.merk.some(m => m)) z.merkWeg = { merk: z.merk.slice(), at: 0 };
  z.merk = [false, false, false];
  _m6pLaden(null);
  _m6pStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6pAnhalten() {
  if (!_m6p) return;
  _m6p.pause = !_m6p.pause;
  _m6pStatus();
}
function _m6pTempo() {
  if (!_m6p) return;
  _m6p.langsam = !_m6p.langsam;
  _m6pStatus();
}
function _m6pVerdecken() {
  if (!_m6p) return;
  _m6p.verdeckt = !_m6p.verdeckt;
  _m6pStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6pZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
// Mitte der kleinen Form im Merkfeld j (dort beginnt der Lichtring – nicht ueber den Zahlen).
function _m6pFeldMitte(j) {
  const K = _m6pK;
  return { x: K.MX0 + 38, y: K.MY[j] + K.MH / 2 };
}
function _m6pUpdate(dt) {
  if (!_m6p) return;
  const z = _m6p, K = _m6pK;
  dt = _bioFxDt(dt) * _m6pZeitfaktor(z);            // ab hier Sim-Zeit
  z.t += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.merkGlanz = Math.max(0, z.merkGlanz - dt);
  for (let j = 0; j < 3; j++) z.merkAlter[j] += dt;
  if (z.merkWeg && dt > 0) {
    z.merkWeg.at += dt;
    if (z.merkWeg.at >= K.T_VERBLASS) z.merkWeg = null;
  }
  if (dt > 0 && z.at < 60) {                        // ohne Zeit kein Schritt im Ablauf
    z.at += dt;
    const G = z.key ? _m6pGEHEGE[z.key] : null;
    const st = _m6pStand(z), alt = z.stand;
    let neu = st.steht !== alt.steht || st.rasen !== alt.rasen || st.umfang !== alt.umfang ||
              st.flaeche !== alt.flaeche || st.fertig !== alt.fertig;
    if (G && z.key === 'l3b3' && !z.aha && st.rasen >= 9) {
      // Aha: das 9. Rasenstueck – derselbe Zaun, mehr Rasen
      z.aha = true; z.ahaGlanz = 2.6;
      _bioFxWelle(z.fx.teile, _m6pX(G.L / 2), _m6pY(G.B / 2), K.AHA, 72);
    }
    if (G && st.fertig && !z.gemerkt) {
      z.gemerkt = true;
      if (G.feld >= 0) {
        z.merk[G.feld] = true; z.merkAlter[G.feld] = 0; neu = true;
        if (z.key === 'l3b3') {
          const m = _m6pFeldMitte(G.feld);
          z.merkGlanz = 2.6;
          // Radius 30 wie der Merkzettel-Ring in m5-auslegen: der Ring umfasst die
          // kleine Form (Mitte x 318, bis x 348) und bleibt links der Zahlen (ab x 356).
          _bioFxWelle(z.fx.teile, m.x, m.y, K.AHA, 30);
        }
      }
    }
    z.stand = st;
    if (neu) _m6pStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6pText(ctx, s, x, y, groesse, farbe, ausr, gew, grund) {
  ctx.fillStyle = farbe || _m6pK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = grund || 'alphabetic';
  ctx.fillText(s, x, y);
}
// Ein Zaunteil: Mitte (x|y), Winkel w, Laenge l. Latte mit Maserung, an jedem
// Ende ein Pfosten; Teil 1 traegt einen dunklen Punkt in der Mitte.
function _m6pLatte(ctx, p, l, erstes, a) {
  if (a <= 0.01) return;
  const K = _m6pK;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.translate(p.x, p.y);
  ctx.rotate(p.w);
  ctx.fillStyle = 'rgba(15,23,42,0.16)';
  ctx.fillRect(-l / 2 + 3, -K.DICK / 2 + 2, l - 4, K.DICK);           // Schatten
  ctx.fillStyle = K.HOLZ; ctx.strokeStyle = K.HOLZRAND; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, -l / 2 + 2, -K.DICK / 2, l - 4, K.DICK, 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(91,58,26,0.35)'; ctx.lineWidth = 0.8;     // Maserung
  ctx.beginPath(); ctx.moveTo(-l / 2 + 6, 0); ctx.lineTo(l / 2 - 6, 0); ctx.stroke();
  ctx.fillStyle = K.PFOSTEN;
  ctx.fillRect(-l / 2 - 2.5, -2.5, 5, 5);
  ctx.fillRect(l / 2 - 2.5, -2.5, 5, 5);
  if (erstes) {
    ctx.fillStyle = K.PUNKT;
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
function _m6pWiese(ctx) {
  const K = _m6pK;
  ctx.save();
  ctx.fillStyle = K.WIESE; ctx.strokeStyle = K.WIESENRAND; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.WX0, K.WY0, K.WX1 - K.WX0, K.WY1 - K.WY0, 10); ctx.fill(); ctx.stroke();
  // 1-m-Raster, ausgerichtet an der Gehege-Ecke; Linien naeher als 8 px am Rand fallen weg
  ctx.strokeStyle = 'rgba(22,101,52,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath();
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
// Palette unter dem Stapel (bleibt stehen, auch wenn die Teile auf der Wiese sind).
function _m6pPalette(ctx) {
  const K = _m6pK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.12)';
  ctx.fillRect(K.PX0 + 1.5, K.PY0 + 2, K.PX1 - K.PX0, K.PY1 - K.PY0);
  ctx.fillStyle = '#d6b07a'; ctx.strokeStyle = K.HOLZRAND; ctx.lineWidth = 1;
  ctx.fillRect(K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0);
  ctx.strokeRect(K.PX0 + 0.5, K.PY0 + 0.5, K.PX1 - K.PX0 - 1, K.PY1 - K.PY0 - 1);
  ctx.restore();
}
// Ein Rasenstueck in Zelle (c|r) des Geheges; k = Groesse 0…1, a = Deckkraft, dy = Versatz.
function _m6pRasenStueck(ctx, c, r, k, a, dy) {
  if (a <= 0.01 || k <= 0.05) return;
  const K = _m6pK, S = K.S;
  const cx = _m6pX(c + 0.5), cy = _m6pY(r + 0.5) - (dy || 0);
  const h = (S / 2 - 1.5) * k;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = K.RASEN; ctx.strokeStyle = K.RASENRAND; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, cx - h, cy - h, 2 * h, 2 * h, 2.5); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = K.HALM; ctx.lineWidth = 1.1;                    // ein paar Halme
  ctx.beginPath();
  for (const [ox, oy] of [[-0.45, 0.35], [-0.05, -0.25], [0.4, 0.3], [0.15, 0.6], [-0.5, -0.5]]) {
    const x = cx + ox * h, y = cy + oy * h;
    ctx.moveTo(x, y); ctx.lineTo(x + 1.5 * k, y - 4.5 * k);
  }
  ctx.stroke();
  ctx.restore();
}
// Rasen eines Geheges: n gelegte Stuecke voll, das fallende Stueck im Flug,
// fertige Reihen blinken. alpha fuer das Verblassen.
function _m6pRasen(ctx, G, at, alpha, nFest) {
  const K = _m6pK, T = _m6pZeiten(G), E = _bioFxEase;
  for (let k = 0; k < T.n; k++) {
    const c = k % G.L, r = Math.floor(k / G.L);
    if (nFest !== undefined) {                       // verblassender alter Rasen
      if (k < nFest) _m6pRasenStueck(ctx, c, r, 1, alpha, 0);
      continue;
    }
    const u = (at - (T.land(k) - K.T_STUECK)) / K.T_STUECK;
    if (u <= 0) continue;
    const e = E.raus(_bioFxKlemme(u));
    _m6pRasenStueck(ctx, c, r, 0.55 + 0.45 * e, Math.min(1, 0.2 + 1.2 * u), 16 * (1 - e));
  }
  if (nFest !== undefined) return;
  // jede fertige Reihe blinkt kurz
  for (let r = 0; r < G.B; r++) {
    const u = (at - T.land(r * G.L + G.L - 1)) / K.T_BLINK;
    if (u < 0 || u >= 1) continue;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,' + (0.55 * (1 - u)).toFixed(3) + ')';
    ctx.fillRect(_m6pX(0), _m6pY(r + 1), G.L * K.S, K.S);
    ctx.restore();
  }
  // Flaecheninhalt erscheint: der Rasen leuchtet kurz auf
  const v = (at - T.tF) / K.T_LEUCHT;
  if (v >= 0 && v < 1) {
    ctx.save();
    ctx.fillStyle = 'rgba(250,204,21,' + (0.38 * Math.sin(Math.PI * v)).toFixed(3) + ')';
    ctx.fillRect(_m6pX(0), _m6pY(G.B), G.L * K.S, G.B * K.S);
    ctx.restore();
  }
}
// Umfang erscheint: der Zaun leuchtet kurz auf (Rand des Geheges).
function _m6pZaunLeuchten(ctx, G, at) {
  const K = _m6pK, T = _m6pZeiten(G), v = (at - T.tU) / K.T_LEUCHT;
  if (v < 0 || v >= 1) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(245,158,11,' + (0.55 * Math.sin(Math.PI * v)).toFixed(3) + ')';
  ctx.lineWidth = 13; ctx.lineJoin = 'round';
  ctx.strokeRect(_m6pX(0), _m6pY(G.B), G.L * K.S, G.B * K.S);
  ctx.restore();
}
// Aha: das Gehege leuchtet nach (pulsierender Rahmen).
function _m6pAhaRahmen(ctx, G) {
  const z = _m6p, K = _m6pK;
  if (z.ahaGlanz <= 0 || !G) return;
  const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
  ctx.save();
  ctx.globalAlpha = Math.min(1, z.ahaGlanz / 1.2) * (0.55 + 0.35 * puls);
  ctx.strokeStyle = K.AHA; ctx.lineWidth = 3;
  _bioFxRundRect(ctx, _m6pX(0) - 5.5, _m6pY(G.B) - 5.5, G.L * K.S + 11, G.B * K.S + 11, 6); ctx.stroke();
  ctx.restore();
}
// Die 12 Zaunteile.
function _m6pZaun(ctx) {
  const z = _m6p, K = _m6pK;
  // erst die anderen, Teil 1 obenauf (im Stapel liegt es zuoberst)
  for (let i = _m6pN - 1; i >= 0; i--) _m6pLatte(ctx, _m6pPose(z, i), K.S, i === 0, 1);
}
// Ein Schild, das beim Erscheinen kurz aufspringt.
function _m6pSchild(ctx, t, x, y, farbe, alter, ausr, a) {
  if (alter < 0 || a <= 0.01) return;
  const K = _m6pK;
  const k = alter < K.T_POP ? Math.max(0.3, _bioFxEase.federn(alter / K.T_POP)) : 1;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.translate(x, y); ctx.scale(k, k);
  _m6pText(ctx, t, 0, 0, 12, farbe, ausr || 'center', '700', 'middle');
  ctx.restore();
}
// Seitenlaengen aussen am Gehege: unten, rechts, oben, links.
function _m6pSchilder(ctx, G, alter, a) {
  const K = _m6pK;
  const xL = _m6pX(0), xR = _m6pX(G.L), yU = _m6pY(0), yO = _m6pY(G.B);
  const xm = (xL + xR) / 2, ym = (yU + yO) / 2;
  // Abstand 11 px (waagerecht) bzw. 16 px (senkrecht): ausserhalb des Aha-Rahmens (4 … 7 px)
  _m6pSchild(ctx, _m6pM(G.L), xm, yU + 16, K.ZAUN_T, alter, 'center', a);
  _m6pSchild(ctx, _m6pM(G.B), xR + 11, ym, K.ZAUN_T, alter, 'left', a);
  _m6pSchild(ctx, _m6pM(G.L), xm, yO - 15, K.ZAUN_T, alter, 'center', a);
  _m6pSchild(ctx, _m6pM(G.B), xL - 11, ym, K.ZAUN_T, alter, 'right', a);
}
// Kleine Form eines Geheges (Rasen gruen mit Raster, Zaun braun) im Rechteck x, y, w, h.
function _m6pKleineForm(ctx, G, x, y, w, h, a) {
  const K = _m6pK;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = K.RASEN; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (let c = 1; c < G.L; c++) { ctx.moveTo(x + c * w / G.L, y); ctx.lineTo(x + c * w / G.L, y + h); }
  for (let r = 1; r < G.B; r++) { ctx.moveTo(x, y + r * h / G.B); ctx.lineTo(x + w, y + r * h / G.B); }
  ctx.stroke();
  ctx.strokeStyle = K.HOLZRAND; ctx.lineWidth = 2.2;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}
// Drei Merkfelder rechts.
function _m6pMerkfelder(ctx) {
  const z = _m6p, K = _m6pK, w = K.MX1 - K.MX0;
  for (let j = 0; j < 3; j++) {
    const y0 = K.MY[j], G = _m6pGEHEGE[_m6pFELDER[j]];
    const voll = z.merk[j], weg = z.merkWeg && z.merkWeg.merk[j];
    ctx.save();
    if (voll || weg) {
      ctx.fillStyle = 'rgba(15,23,42,0.10)';
      _bioFxRundRect(ctx, K.MX0 + 1.5, y0 + 2, w, K.MH, 8); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
      _bioFxRundRect(ctx, K.MX0, y0, w, K.MH, 8); ctx.fill(); ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      _bioFxRundRect(ctx, K.MX0, y0, w, K.MH, 8); ctx.fill(); ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
    if (!voll && !weg) continue;
    const a = voll ? 1 : 1 - _bioFxKlemme(z.merkWeg.at / K.T_VERBLASS);
    const alter = voll ? z.merkAlter[j] : 9;
    const k = alter < K.T_POP ? 1 + 0.12 * Math.sin(Math.PI * alter / K.T_POP) : 1;
    if (voll && z.merkGlanz > 0 && j === 2) {
      ctx.save();
      const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
      ctx.globalAlpha = Math.min(1, z.merkGlanz / 1.2) * (0.55 + 0.35 * puls);
      ctx.strokeStyle = K.AHA; ctx.lineWidth = 3.5;
      _bioFxRundRect(ctx, K.MX0 - 4, y0 - 4, w + 8, K.MH + 8, 10); ctx.stroke();
      ctx.restore();
    }
    const fw = G.L * K.MS, fh = G.B * K.MS, c = _m6pFeldMitte(j), cx = c.x, cy = c.y;
    ctx.save();
    ctx.translate(cx, cy); if (k !== 1) ctx.scale(k, k);
    _m6pKleineForm(ctx, G, -fw / 2, -fh / 2, fw, fh, a);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = a;
    _m6pText(ctx, _m6pM(2 * (G.L + G.B)), K.MX0 + 76, y0 + 30, 15, K.ZAUN_T, 'left');
    _m6pText(ctx, z.verdeckt ? _m6pQM('?') : _m6pQM(G.L * G.B), K.MX0 + 76, y0 + 53, 15, K.RASEN_T, 'left');
    ctx.restore();
  }
}
// Die Form fliegt verkleinert vom Gehege in ihr Merkfeld.
function _m6pFlug(ctx, G, at) {
  const K = _m6pK, T = _m6pZeiten(G);
  if (G.feld < 0 || at < T.tM || at >= T.ende) return;
  const e = _bioFxEase.sanft(_bioFxKlemme((at - T.tM) / K.T_FLUG));
  const a0 = { x: _m6pX(0), y: _m6pY(G.B), w: G.L * K.S, h: G.B * K.S };
  const fw = G.L * K.MS, fh = G.B * K.MS, c = _m6pFeldMitte(G.feld);
  const b0 = { x: c.x - fw / 2, y: c.y - fh / 2, w: fw, h: fh };
  const x = a0.x + (b0.x - a0.x) * e, y = a0.y + (b0.y - a0.y) * e - 24 * Math.sin(Math.PI * e);
  const w = a0.w + (b0.w - a0.w) * e, h = a0.h + (b0.h - a0.h) * e;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.12)';
  ctx.fillRect(x + 3, y + 4, w, h);
  ctx.restore();
  _m6pKleineForm(ctx, G, x, y, w, h, 0.9);
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m6pPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6pText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6pDraw(ctx, cv) {
  if (!_m6p) return;
  const z = _m6p, K = _m6pK, W = cv.width, H = cv.height, at = z.at;
  const G = z.key ? _m6pGEHEGE[z.key] : null;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6pWiese(ctx);
  _m6pPalette(ctx);
  // der Rasen des vorigen Geheges verblasst
  if (z.alt && z.alt.rasen > 0) {
    const a = 1 - _bioFxKlemme(at / K.T_VERBLASS);
    if (a > 0.01) _m6pRasen(ctx, _m6pGEHEGE[z.alt.key], at, a, z.alt.rasen);
  }
  if (G) {
    _m6pRasen(ctx, G, at, 1);
    _m6pAhaRahmen(ctx, G);
    _m6pZaunLeuchten(ctx, G, at);
  }
  _m6pZaun(ctx);
  // Seitenschilder: die alten verblassen, die neuen springen auf, sobald der Zaun steht.
  // Bleibt das Gehege dasselbe („noch einmal“), bleiben die Schilder einfach stehen.
  if (z.alt && z.alt.schilder) {
    if (z.alt.gleich) _m6pSchilder(ctx, G, 9, 1);
    else _m6pSchilder(ctx, _m6pGEHEGE[z.alt.key], 9, 1 - _bioFxKlemme(at / K.T_SCHILD_WEG));
  }
  if (G && !(z.alt && z.alt.schilder && z.alt.gleich)) _m6pSchilder(ctx, G, at - K.T_GLEIT + 1e-9, 1);
  _m6pMerkfelder(ctx);
  if (G) _m6pFlug(ctx, G, at);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6pPauseSchild(ctx);
}
