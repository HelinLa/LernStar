
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mg3 „Gramm, Kilogramm, Tonne“ (Kennung m5-waage, Praefix _m6i)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL6_PROFIL.md, Abschnitte mg3 und m5-waage.
// Ueberschrift = Frage der Einheit: „Wie viele Gramm sind 1 kg?“
//
// Was man sieht (Leinwand 420 x 250) – Bild und Zeichen, durch die FARBE
// verbunden (links bernstein, rechts blau; in Bild, Schildern, Zettel und
// Statuszeilen gleich):
//   WAAGE (Mitte): eine Tafelwaage – Fuss, Saeule, Balken mit Drehpunkt, auf
//     jedem Balkenende eine Schale, die waagerecht bleibt. Ueber dem Drehpunkt
//     eine kleine Skala mit Mittelstrich, davor der rote Zeiger. Der Balken
//     kippt nach der Seite, auf der mehr liegt (hoechstens 11°), und geht mit
//     jedem Stueck ein Stueck zurueck: Kippen = (links − rechts) : links.
//     Gerade steht er nur bei Gleichheit; dann leuchtet die Mitte der Skala
//     kurz gruen auf und der Mittelstrich bleibt gruen.
//   LINKS: der gewaehlte Gegenstand mit Schild („500 g Nudeln“ – Folienbeutel
//     mit Penne, „1 kg Mehl“ – Papiertuete, „2 kg Kartoffeln“ – Netz).
//   RECHTS: Stuecke zu 100 g (graue Zylinder mit „100 g“) in FUENFERTUERMEN:
//     5 uebereinander, die Tuerme nebeneinander von innen nach aussen
//     (hoechstens 5 Tuerme = 25 Stuecke).
//   „1 t Sand“ schaltet auf die GROSSE WAAGE (dunkler Stahl, Plattformen mit
//     Riffelblech, schwerer Fuss; Ueberblendung 0,3 s): links ein Sandhaufen
//     mit Schild „1 t Sand“, rechts Saecke zu 100 kg (braun, „100 kg“), auch
//     in Fuenfertuermen.
//   SCHILDER oben: „Links: 1 kg“ (bernstein) und „Rechts: 700 g“ (blau, zaehlt
//     mit jedem gelandeten Stueck hoch und springt kurz).
//   ZETTEL unten (sobald kein Ablauf mehr laeuft und rechts etwas liegt):
//     „Rechnung: 10 · 100 g = 1 000 g“ – Anzahl dunkel, Ergebnis blau.
//
// Bewegung (spielt nach der Sprungmarke SELBST ab, N1 im Bauplan: ein Schritt
// im Heft = eine Handlung; anhalten kann die Lehrkraft). Alles ist eine
// Funktion der Ablaufzeit L.at (_m6iStart, _m6iLand, _m6iEnde, _m6iStandAus):
// keine Zufallszahl, jede Zahl im Bild kommt aus derselben Rechnung wie die
// Statuszeilen. Nur der Balken folgt seinem Ziel ueber eine gedaempfte Feder
// (Kippen des Balkens, auch die ist deterministisch).
//   Sprungmarke: was vorher auf der Waage lag, blendet aus (0,25 s); der
//     Gegenstand senkt sich in die linke Schale (0,6 s), der Balken kippt nach
//     links (0,3 s); dann faellt Stueck fuer Stueck in die rechte Schale
//     (0,4 s je Stueck, 0,3 s Fall), der Balken hebt sich in gleichen
//     Schritten. Dauer: 500 g 2,9 s · 1 kg 4,9 s · 2 kg 8,9 s · 1 t 4,9 s.
//   „+ 1 Stück“: ein Stueck faellt dazu (0,4 s). „− 1 Stück“: das oberste
//     Stueck hebt sich ab und verschwindet (0,35 s). Laeuft gerade etwas, kommt
//     es sofort an, dann geschieht das Neue (Bauart m5-rest).
//   „Tareks Weg“ (bei „1 kg Mehl“ 1 Stueck, „2 kg Kartoffeln“ 2 Stuecke,
//     „1 t Sand“ 1 Sack; bei „500 g Nudeln“ und ohne Gegenstand blass): die
//     Stuecke rechts heben sich ab (0,3 s), der Balken kippt ganz nach links,
//     dann fallen Tareks Stuecke – der Balken bleibt fast ganz unten.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1 = Zeilen der Heft-Tabelle (_m6iWahl('…'), eine Wahlgruppe):
//     „500 g Nudeln“ · „1 kg Mehl“ · „2 kg Kartoffeln“ · „1 t Sand“
//   Reihe 2: „+ 1 Stück“ (_m6iPlus) · „− 1 Stück“ (_m6iMinus) – frei, operativ,
//     erst nach einer Wahl bedienbar, Grenzen 0 und 25 Stuecke (dort blass) ·
//     „Tareks Weg“ (_m6iTarek) · „neu“ (_m6iNeu: leere Waage, kleine Waage).
//
// Statuszeilen (woertlich aus dem Bauplan, alle mit Wert mehr als 18 Zeichen –
// simfakten.js). Eine Zahl steht erst in der Anzeige, wenn ihr Stueck im Bild
// gelandet ist:
//   _m6i-links     „Links auf der Waage: 1 kg Mehl“ (Start „… noch nichts“;
//                  Sand „Links auf der Waage: 1 t Sand (1 Tonne)“)
//   _m6i-stuecke   „Rechts liegen: 10 Stücke zu 100 g“ (zaehlt hoch; 1 Stueck
//                  „Rechts liegt: 1 Stück zu 100 g“, keins „Rechts liegt noch
//                  kein Stück.“; Sand „Rechts liegen: 10 Säcke zu 100 kg“)
//   _m6i-lage      „Die Waage steht gerade.“ / „Die Waage steht noch schief.“
//                  (rechts weniger) / „Die Waage steht schief.“ (rechts mehr)
//   _m6i-rechnung  „Rechnung: 10 · 100 g = 1 000 g“ (Sand „Rechnung: 10 · 100 kg
//                  = 1 000 kg“); waehrend eines Ablaufs „Rechnung: erst am
//                  Ende“, ohne Stueck „Rechnung: noch keine“
//   _m6i-zusammen  „Rechts liegen zusammen: 1 000 g“ (zaehlt hoch)
//   _m6i-tarek     nur nach „Tareks Weg“, wenn seine Stuecke liegen:
//                  „Tareks Weg: 1 kg gegen 100 g. Die Waage steht schief.“
//                  (2 kg gegen 200 g · 1 t gegen 100 kg), sonst leer und
//                  ausgeblendet
//   _m6i-lehrkraft Hinweis fuer die Lehrkraft (siehe unten)
// Rechnungen mit Groessen tragen Einheiten (N3): Anzahl · Groesse = Groesse.
//
// Werte (nachgerechnet, simcheck/werte.js):
//   500 g Nudeln    → 5 Stücke,  5 · 100 g = 500 g,       gerade
//   1 kg Mehl       → 10 Stücke, 10 · 100 g = 1 000 g,    gerade
//   2 kg Kartoffeln → 20 Stücke, 20 · 100 g = 2 000 g,    gerade
//   1 t Sand        → 10 Säcke,  10 · 100 kg = 1 000 kg,  gerade
//   frei „− 1 Stück“ ab 1 kg Mehl → 9 Stücke, 9 · 100 g = 900 g, noch schief
//   frei „+ 1 Stück“ ab 1 kg Mehl → 11 Stücke, 1 100 g, schief
//   Tareks Weg: 1 kg gegen 100 g · 2 kg gegen 200 g · 1 t gegen 100 kg
// Start: leere Waage, Balken gerade („Start: Die Waage ist leer.“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): „1 kg Mehl“ – das 10. Stueck
// landet, die Waage steht gerade: Lichtring um die zwei Fuenfertuerme, die
// Tuerme sind 2,6 s bernsteinfarben eingerahmt. Einmal je Ablauf. Das
// widerlegt „1 kg sind 100 g“ (nach einem Stueck steht die Waage noch weit
// schief) und „1 kg sind 10 g“.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen / m5-rest, im Container
// <div class="fpm-lehrkraft">, damit simfakten.js die Zeile ueberspringt –
// V3 aus Kapitel 4). Eigene Zeile UNTER den Heftknoepfen, davor klein
// „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_m6iAnhalten): friert jede Bewegung ein (auch den
//     Balken); Schild „Pause“ oben links im Bild. Ein Druck auf „+ 1 Stück“,
//     „− 1 Stück“ oder „Tareks Weg“ in der Pause bewegt nichts, das Schild
//     leuchtet kurz auf.
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6iTempo): ein Drittel so schnell.
//   „Zahlen verdecken: aus“ ↔ „… an“ (_m6iVerdecken): verdeckt Stuecke-Zahl,
//     Rechnung und Summe (Statuszeilen, Schild rechts, Zettel) bis zum
//     Aufdecken – zum Vermuten an der Tafel. Links bleibt sichtbar.
//   Eine Sprungmarke oder „neu“ heben die Pause auf; Tempo und Verdecken
//   bleiben stehen. Nur das wechselnde Wort steht in einem eigenen <span>.
// Hinweiszeile _m6i-lehrkraft (in der Pause „lmp-status off“) nennt immer die
// Einstellung: „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal,
// Zahlen: sichtbar.“ – so aendert JEDER Lehrkraft-Knopf eine Zeile.
// EIN Zeitfaktor (_m6iZeitfaktor: 0 in der Pause, 1/3 langsam, 1 normal) an
// der einen Stelle, an der dt in _m6iUpdate hineingeht.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Masse“, „Kilo bedeutet
// tausend“ und jede Regel als Satz, „1 kg = 1 000 g“ als Satz (die Gleichheit
// zeigt die gerade Waage, die Rechnung steht als Zeichen da), „Gewicht“.
// Keine Namen ausser im Knopf und in der Zeile „Tareks Weg“ (wie
// m5-rechenstrich und Kapitel 4), keine Punkte, keine Zeitmessung.
// ════════════════════════════════════════════════════════════════════════
let _m6i = null;
// links = Masse des Gegenstands in Stuecken (100 g bzw. 100 kg); tarek = Tareks Stuecke
const _m6iDING = {
  nudeln:     { text: '500 g Nudeln',    kurz: '500 g', links: 5,  tarek: 0, gross: false },
  mehl:       { text: '1 kg Mehl',       kurz: '1 kg',  links: 10, tarek: 1, gross: false },
  kartoffeln: { text: '2 kg Kartoffeln', kurz: '2 kg',  links: 20, tarek: 2, gross: false },
  sand:       { text: '1 t Sand',        kurz: '1 t',   links: 10, tarek: 1, gross: true }
};
const _m6iREIHE = ['nudeln', 'mehl', 'kartoffeln', 'sand'];
const _m6iK = {
  // Waage: Drehpunkt, halbe Balkenlaenge, groesster Kippwinkel, Pfosten bis zur
  // Schalenoberkante, Schalenbreite, Schalendicke (klein / gross)
  PX: 210, PY: 162, ARM: 105, AMAX: 11 * Math.PI / 180, POST: 14, SW: 158, ST: 5, STG: 8,
  // Fuss (Oberkante), Tisch
  FY: 200, TY: 214,
  // Stuecke: Breite, Hoehe, Turmabstand, Mitte von Turm 0 relativ zur Schalenmitte, hoechstens
  TW: 28, TH: 16, TP: 31, T0: -62, MAX: 25,
  // Fallhoehe (Unterkante beim Start), Mindestfall
  FALL_Y: 46, FALL_MIN: 30,
  // Zeiger und Skala
  ZL: 50, SKR: 51,
  // Schilder oben: Oberkante, Hoehe, Mitten
  SY: 9, SH: 24, SLX: 120, SRX: 315,
  // Zettel unten
  ZY0: 222, ZY1: 247,
  // Zeiten in s
  T_AB: 0.6, T_KIPP: 0.3, T_STUECK: 0.4, T_FALL: 0.3, T_NACH: 0.1, T_WEG: 0.3, T_HEB: 0.35,
  T_ALT: 0.25, T_GROSS: 0.3, T_ZETTEL: 0.4, T_GRUEN: 1.4, T_AHA: 2.6,
  // Farben
  LINKS: '#b45309', RECHTS: '#1d4ed8', TINTE: '#0f172a', GRAU: '#64748b', GRUEN: '#15803d'
};

// ── Zahlen ──────────────────────────────────────────────────────────────
function _m6iTsd(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function _m6iEinheit(d) { return d && d.gross ? 'kg' : 'g'; }
// n Stuecke zu 100 g (bzw. 100 kg) als Groesse: „700 g“, „1 000 kg“
function _m6iMenge(n, d) { return _m6iTsd(n * 100) + ' ' + _m6iEinheit(d); }

// ── Ablauf: alles aus der Ablaufzeit ─────────────────────────────────────
// Stueck k beginnt zu fallen / ist gelandet.
function _m6iStart(L, k) {
  const K = _m6iK;
  if (L.art === 'spiel') return K.T_AB + K.T_KIPP + k * K.T_STUECK;
  if (L.art === 'tarek') return K.T_WEG + k * K.T_STUECK;
  return 0;                                          // „+ 1 Stück“
}
function _m6iLand(L, k) { return _m6iStart(L, k) + _m6iK.T_FALL; }
function _m6iEnde(L) {
  const K = _m6iK;
  if (L.art === 'spiel') return _m6iLand(L, L.N - 1) + K.T_NACH;
  if (L.art === 'tarek') return _m6iLand(L, L.M - 1) + K.T_NACH;
  if (L.art === 'plus') return K.T_STUECK;
  return K.T_HEB;
}
// Endstand eines Ablaufs (fuer die Grenzen der Knoepfe)
function _m6iZielN(z) {
  const L = z.lauf;
  if (!L) return z.n;
  return L.art === 'spiel' ? L.N : L.art === 'tarek' ? L.M : L.art === 'plus' ? L.von + 1 : L.von - 1;
}
// Stand: liegt der Gegenstand schon in der Schale? Wie viele Stuecke sind rechts gelandet? Fertig?
function _m6iStandAus(z) {
  const L = z.lauf, K = _m6iK;
  if (!L) return { drauf: !!z.key, n: z.n, fertig: true };
  const at = L.at;
  if (L.art === 'spiel' || L.art === 'tarek') {
    const m = L.art === 'spiel' ? L.N : L.M;
    let n = 0;
    for (let k = 0; k < m; k++) if (at >= _m6iLand(L, k)) n++;
    return { drauf: L.art === 'tarek' || at >= K.T_AB, n, fertig: at >= _m6iEnde(L) };
  }
  if (L.art === 'plus') return { drauf: true, n: L.von + (at >= K.T_FALL ? 1 : 0), fertig: at >= _m6iEnde(L) };
  return { drauf: true, n: L.von - 1, fertig: at >= _m6iEnde(L) };   // „− 1 Stück“: hebt sich sofort ab
}
// Wohin der Balken will: +1 ganz links unten, 0 gerade, −1 ganz rechts unten.
function _m6iZielKipp(z) {
  const d = z.key ? _m6iDING[z.key] : null, st = z.stand;
  const L = d && st.drauf ? d.links : 0, R = st.n;
  if (L === 0) return R > 0 ? -1 : 0;
  return Math.max(-1, Math.min(1, (L - R) / L));
}
function _m6iGerade(z) {
  const d = z.key ? _m6iDING[z.key] : null;
  return !!(d && z.stand.drauf && z.stand.n === d.links);
}

function _m6iInit() {
  _m6i = { t: 0, key: null, n: 0, modus: 'leer', lauf: null, alt: null,
           kipp: 0, kippV: 0, grossAnz: 0, gruen: 0,
           aha: false, ahaGlanz: 0, zettel: 0, rechtsPop: 9, blink: 0,
           pause: false, langsam: false, verdeckt: false,          // Lehrkraft-Einstellungen
           fx: { teile: [] } };
  _m6i.stand = _m6iStandAus(_m6i);
}
// Einen Gegenstand laden (key = null: leere Waage). Was gerade auf der Waage liegt, blendet aus.
function _m6iLaden(key) {
  const z = _m6i, st = z.stand, alt = z.key ? _m6iDING[z.key] : null;
  const altKey = alt && st.drauf ? z.key : null;
  z.alt = (altKey || st.n) ? { key: altKey, gross: !!(alt && alt.gross), n: st.n, at: 0 } : null;
  z.key = key; z.n = 0;
  z.lauf = key ? { art: 'spiel', at: 0, N: _m6iDING[key].links } : null;
  z.modus = key ? 'spiel' : 'leer';
  z.aha = false; z.ahaGlanz = 0; z.gruen = 0; z.zettel = 0; z.rechtsPop = 9;
  z.fx.teile.length = 0;
  z.pause = false;                                   // neu laden hebt die Pause auf
  z.stand = _m6iStandAus(z);
}
function _m6iHTML() {
  const marke = k => `<button class="sim-btn" id="_m6i-b-${k}" onclick="_m6iWahl('${k}')">${_m6iDING[k].text.replace(/(\d) /g, '$1&nbsp;')}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Gramm sind 1&nbsp;kg?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle etwas für die linke Schale. Rechts legen sich Stücke dazu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6i-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6iREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6i-plus" onclick="_m6iPlus()">+&nbsp;1&nbsp;Stück</button>
          <button class="sim-btn" id="_m6i-minus" onclick="_m6iMinus()">−&nbsp;1&nbsp;Stück</button>
          <button class="sim-btn" id="_m6i-tarekknopf" onclick="_m6iTarek()">Tareks Weg</button>
          <button class="sim-btn" onclick="_m6iNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6i-pause" onclick="_m6iAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6i-tempo" onclick="_m6iTempo()">Tempo: <span id="_m6i-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6i-verdeckt" onclick="_m6iVerdecken()">Zahlen verdecken: <span id="_m6i-verdeckt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6i-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6i-links" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6i-stuecke" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6i-lage" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6i-rechnung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6i-zusammen" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_m6i-tarek" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Die Waage ist leer.</p>
  </div>`;
}
function _m6iSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6iKnopf(id, an) {
  const b = document.getElementById(id);
  if (b) { b.disabled = !an; if (b.style) b.style.opacity = an ? '' : '0.45'; }
}
function _m6iStatus() {
  if (!_m6i) return;
  const z = _m6i, K = _m6iK, d = z.key ? _m6iDING[z.key] : null, st = z.stand;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const zu = z.verdeckt, n = st.n, gross = !!(d && d.gross);
  const wort = gross ? ['Sack', 'Säcke'] : ['Stück', 'Stücke'];
  const je = '100 ' + _m6iEinheit(d);
  _m6iSetze('_m6i-links', 'Links auf der Waage: ' +
    (d ? f(d.text + (gross ? ' (1 Tonne)' : ''), K.LINKS) : 'noch nichts'));
  _m6iSetze('_m6i-stuecke',
    zu ? 'Rechts liegen: verdeckt'
       : n === 0 ? 'Rechts liegt noch kein ' + wort[0] + '.'
       : n === 1 ? 'Rechts liegt: ' + f('1 ' + wort[0], K.TINTE) + ' zu ' + je
       : 'Rechts liegen: ' + f(n + ' ' + wort[1], K.TINTE) + ' zu ' + je);
  const links = d && st.drauf ? d.links : 0;
  _m6iSetze('_m6i-lage', 'Die Waage steht ' +
    (n === links ? f('gerade', K.GRUEN) : n < links ? f('noch schief', K.LINKS) : f('schief', K.RECHTS)) + '.');
  const laeuft = !!(z.lauf && (z.lauf.art === 'spiel' || z.lauf.art === 'tarek'));
  _m6iSetze('_m6i-rechnung', 'Rechnung: ' +
    (laeuft ? 'erst am Ende' : n === 0 ? 'noch keine' : zu ? 'verdeckt'
            : f(String(n), K.TINTE) + ' · ' + je + ' = ' + f(_m6iMenge(n, d), K.RECHTS)));
  _m6iSetze('_m6i-zusammen', 'Rechts liegen zusammen: ' + (zu ? 'verdeckt' : f(_m6iMenge(n, d), K.RECHTS)));
  const tarek = z.modus === 'tarek' && !z.lauf && d
    ? 'Tareks Weg: ' + d.kurz + ' gegen ' + _m6iMenge(d.tarek, d) + '. Die Waage steht schief.' : '';
  const tz = _m6iSetze('_m6i-tarek', tarek);
  if (tz && tz.style) tz.style.display = tarek ? '' : 'none';
  // Knoepfe: Wahl hervorheben, Grenzen blass
  _m6iREIHE.forEach(k => {
    const b = document.getElementById('_m6i-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  const ziel = _m6iZielN(z);
  _m6iKnopf('_m6i-plus', !!d && ziel < K.MAX);
  _m6iKnopf('_m6i-minus', !!d && ziel > 0);
  _m6iKnopf('_m6i-tarekknopf', !!(d && d.tarek));
  try { document.getElementById('_m6i-tarekknopf').classList.toggle('primary', z.modus === 'tarek'); } catch (e) { /* Mini-DOM */ }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6iSetze('_m6i-pause', z.pause ? 'weiter' : 'Pause');
  _m6iSetze('_m6i-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6iSetze('_m6i-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6iSetze('_m6i-lehrkraft', _m6iHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6i-pause', z.pause], ['_m6i-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6iHinweis() {
  const z = _m6i;
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Zahlen: ' + (z.verdeckt ? 'verdeckt' : 'sichtbar') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6iWahl(key) {
  if (!_m6i || !_m6iDING[key]) return;
  _m6iLaden(key);
  _m6iStatus();
}
function _m6iNeu() {
  if (!_m6i) return;
  _m6iLaden(null);
  _m6iStatus();
}
// Die laufende Bewegung sofort ankommen lassen (Endstand setzen, ohne Lichtring).
function _m6iAnkommen() {
  const z = _m6i;
  if (!z.lauf) return;
  z.n = _m6iZielN(z);
  z.lauf = null;
  z.stand = _m6iStandAus(z);
}
// In der Pause bewegt ein Druck nichts – das Schild „Pause“ leuchtet kurz auf.
function _m6iInPause() {
  if (!_m6i.pause) return false;
  _m6i.blink = 0.6;
  _m6iStatus();
  return true;
}
function _m6iPlus() {
  const z = _m6i;
  if (!z || !z.key || _m6iInPause()) return;
  if (z.lauf) _m6iAnkommen();
  if (z.n >= _m6iK.MAX) { _m6iStatus(); return; }
  z.lauf = { art: 'plus', at: 0, von: z.n };
  z.modus = 'frei';
  z.stand = _m6iStandAus(z);
  _m6iStatus();
}
function _m6iMinus() {
  const z = _m6i;
  if (!z || !z.key || _m6iInPause()) return;
  if (z.lauf) _m6iAnkommen();
  if (z.n <= 0) { _m6iStatus(); return; }
  z.lauf = { art: 'minus', at: 0, von: z.n };
  z.modus = 'frei';
  z.stand = _m6iStandAus(z);
  z.rechtsPop = 0;                                   // Schild rechts zaehlt sofort herunter
  if (_m6iGerade(z)) z.gruen = _m6iK.T_GRUEN;       // zurueck auf gleich: Mitte leuchtet
  _m6iStatus();
}
function _m6iTarek() {
  const z = _m6i;
  if (!z || !z.key || !_m6iDING[z.key].tarek || _m6iInPause()) return;
  if (z.lauf) _m6iAnkommen();
  z.lauf = { art: 'tarek', at: 0, alt: z.n, M: _m6iDING[z.key].tarek };
  z.modus = 'tarek';
  z.ahaGlanz = 0; z.gruen = 0;
  z.stand = _m6iStandAus(z);
  _m6iStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6iAnhalten() {
  if (!_m6i) return;
  _m6i.pause = !_m6i.pause;
  _m6i.blink = 0;
  _m6iStatus();
}
function _m6iTempo() {
  if (!_m6i) return;
  _m6i.langsam = !_m6i.langsam;
  _m6iStatus();
}
function _m6iVerdecken() {
  if (!_m6i) return;
  _m6i.verdeckt = !_m6i.verdeckt;
  _m6iStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6iZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6iUpdate(dt) {
  if (!_m6i) return;
  const z = _m6i, K = _m6iK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);              // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6iZeitfaktor(z);                      // ab hier Sim-Zeit
  z.t += dt;
  if (z.alt) { z.alt.at += dt; if (z.alt.at >= K.T_ALT) z.alt = null; }
  const d = z.key ? _m6iDING[z.key] : null, gz = d && d.gross ? 1 : 0;
  z.grossAnz = gz > z.grossAnz ? Math.min(gz, z.grossAnz + dt / K.T_GROSS)
                               : Math.max(gz, z.grossAnz - dt / K.T_GROSS);
  z.rechtsPop += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.gruen = Math.max(0, z.gruen - dt);
  const L = z.lauf;
  if (L && dt > 0) {                                 // ohne Zeit kein Schritt im Ablauf
    L.at += dt;
    const st = _m6iStandAus(z), alt = z.stand;
    let neu = st.drauf !== alt.drauf;
    if (st.n !== alt.n) { z.rechtsPop = 0; neu = true; }
    z.stand = st;
    if (neu && _m6iGerade(z)) z.gruen = K.T_GRUEN;   // eben gleich geworden: Mitte leuchtet gruen
    if (L.art === 'spiel' && z.key === 'mehl' && !z.aha && st.n >= 10) {
      // Aha: das 10. Stueck liegt, die Waage steht gerade – Lichtring um die zwei Fuenfertuerme
      z.aha = true; z.ahaGlanz = K.T_AHA;
      const g = _m6iGeo();
      _bioFxWelle(z.fx.teile, g.rx + K.T0 + K.TP / 2, g.rsy - 2.5 * K.TH, '#f59e0b', 66);
    }
    if (st.fertig) { _m6iAnkommen(); neu = true; }
    if (neu) _m6iStatus();
  }
  // Balken: gedaempfte Feder zum Ziel (in kleinen Teilschritten, damit sie ruhig bleibt)
  const ziel = _m6iZielKipp(z);
  for (let rest = dt; rest > 1e-9; ) {
    const h = Math.min(0.02, rest); rest -= h;
    z.kippV += ((ziel - z.kipp) * 90 - z.kippV * 15) * h;
    z.kipp += z.kippV * h;
  }
  // Zettel: nur wenn rechts etwas liegt und kein Ablauf laeuft
  const zeigen = z.stand.n > 0 && !(z.lauf && (z.lauf.art === 'spiel' || z.lauf.art === 'tarek'));
  z.zettel = zeigen ? Math.min(1, z.zettel + dt / K.T_ZETTEL) : 0;
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Orte ────────────────────────────────────────────────────────────────
// Balkenenden und Schalenoberkanten (die Schalen bleiben waagerecht).
function _m6iGeo() {
  const K = _m6iK, phi = -_m6i.kipp * K.AMAX, c = Math.cos(phi), s = Math.sin(phi);
  const lx = K.PX - K.ARM * c, ly = K.PY - K.ARM * s, rx = K.PX + K.ARM * c, ry = K.PY + K.ARM * s;
  return { phi, lx, ly, rx, ry, lsy: ly - K.POST, rsy: ry - K.POST };
}
// Stueck i rechts: Turm i div 5 (von innen nach aussen), Reihe i mod 5 (von unten).
function _m6iPlatz(g, i) {
  const K = _m6iK;
  return { x: g.rx + K.T0 + Math.floor(i / 5) * K.TP, yb: g.rsy - (i % 5) * K.TH };
}
// Was rechts zu sehen ist: {i, dy (nach oben negativ), a} fuer liegende,
// {i, fall: u} fuer fallende Stuecke.
function _m6iStueckeSzene(z) {
  const L = z.lauf, K = _m6iK, out = [];
  if (!L) { for (let i = 0; i < z.n; i++) out.push({ i, dy: 0, a: 1 }); return out; }
  const at = L.at;
  const fallend = (i, t0) => {
    const u = (at - t0) / K.T_FALL;
    if (u < 0) return;
    if (u < 1) { out.push({ i, fall: u }); return; }
    const w = at - t0 - K.T_FALL;                    // gelandet: ein kleiner Nachfederer
    out.push({ i, dy: w < 0.12 ? -2.2 * Math.sin(Math.PI * w / 0.12) : 0, a: 1 });
  };
  if (L.art === 'spiel') {
    for (let k = 0; k < L.N; k++) fallend(k, _m6iStart(L, k));
  } else if (L.art === 'tarek') {
    const u = _bioFxKlemme(at / K.T_WEG);            // die alten Stuecke heben sich ab
    if (u < 1) for (let i = 0; i < L.alt; i++) out.push({ i, dy: -26 * _bioFxEase.sanft(u), a: 1 - u });
    for (let k = 0; k < L.M; k++) fallend(k, _m6iStart(L, k));
  } else if (L.art === 'plus') {
    for (let i = 0; i < L.von; i++) out.push({ i, dy: 0, a: 1 });
    fallend(L.von, 0);
  } else {
    for (let i = 0; i < L.von - 1; i++) out.push({ i, dy: 0, a: 1 });
    const u = _bioFxKlemme(at / K.T_HEB);
    out.push({ i: L.von - 1, dy: -30 * _bioFxEase.sanft(u), a: 1 - u });
  }
  return out;
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6iText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m6iK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Text, der in eine Breite passen muss: notfalls kleiner (nicht unter min px).
function _m6iTextPasst(ctx, s, x, y, groesse, farbe, breite, min) {
  ctx.font = '700 ' + groesse + 'px sans-serif';
  const br = ctx.measureText(s).width;
  if (br > breite) groesse = Math.max(min, groesse * breite / br);
  _m6iText(ctx, s, x, y, groesse, farbe);
}
// Die Waage (gross = false: Tafelwaage, true: grosse Waage), Deckkraft a.
function _m6iWaage(ctx, g, gross, a) {
  if (a <= 0.01) return;
  const K = _m6iK, z = _m6i;
  ctx.save();
  ctx.globalAlpha = a;
  // Fuss
  if (gross) {
    ctx.fillStyle = '#475569'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, 140, K.FY - 4, 140, K.TY - K.FY + 4, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    for (const x of [150, 270]) { ctx.beginPath(); ctx.arc(x, K.FY + 5, 2.2, 0, Math.PI * 2); ctx.fill(); }
  } else {
    ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(172, K.FY); ctx.lineTo(248, K.FY); ctx.lineTo(262, K.TY); ctx.lineTo(158, K.TY);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  // Saeule
  const sb = gross ? 9 : 6;
  ctx.fillStyle = gross ? '#334155' : '#94a3b8'; ctx.strokeStyle = gross ? '#1e293b' : '#64748b'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.rect(K.PX - sb, K.PY, 2 * sb, K.FY - K.PY); ctx.fill(); ctx.stroke();
  // Skala ueber dem Drehpunkt: Bogen, Teilstriche, Mittelstrich (gruen, wenn gleich)
  const sk = a0 => ({ x: K.PX + Math.sin(a0), y: K.PY - Math.cos(a0) });
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(K.PX, K.PY, K.SKR + 2, -Math.PI / 2 - 0.36, -Math.PI / 2 + 0.36); ctx.stroke();
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.3;
  for (const w of [-1, -0.5, 0.5, 1]) {
    const al = w * K.AMAX, p = sk(al);
    ctx.beginPath();
    ctx.moveTo(K.PX + (p.x - K.PX) * (K.SKR - 1), K.PY + (p.y - K.PY) * (K.SKR - 1));
    ctx.lineTo(K.PX + (p.x - K.PX) * (K.SKR + 5), K.PY + (p.y - K.PY) * (K.SKR + 5));
    ctx.stroke();
  }
  const gleich = _m6iGerade(z);
  if (z.gruen > 0) {
    ctx.save();
    ctx.globalAlpha = a * Math.min(1, z.gruen / 0.5);
    _bioFxLeuchten(ctx, K.PX, K.PY - K.SKR - 2, 7, z.t, '34,197,94');
    ctx.restore();
  }
  ctx.strokeStyle = gleich ? K.GRUEN : '#1e293b'; ctx.lineWidth = gleich ? 3 : 2;
  ctx.beginPath(); ctx.moveTo(K.PX, K.PY - K.SKR + 3); ctx.lineTo(K.PX, K.PY - K.SKR - 8); ctx.stroke();
  // Pfosten zu den Schalen
  ctx.strokeStyle = gross ? '#334155' : '#64748b'; ctx.lineWidth = gross ? 6 : 4; ctx.lineCap = 'round';
  const st = gross ? K.STG : K.ST;
  for (const [x, y, sy] of [[g.lx, g.ly, g.lsy], [g.rx, g.ry, g.rsy]]) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, sy + st); ctx.stroke();
  }
  // Balken
  ctx.strokeStyle = gross ? '#1e293b' : '#475569'; ctx.lineWidth = gross ? 11 : 7;
  ctx.beginPath(); ctx.moveTo(g.lx, g.ly); ctx.lineTo(g.rx, g.ry); ctx.stroke();
  ctx.strokeStyle = gross ? '#64748b' : '#94a3b8'; ctx.lineWidth = gross ? 3 : 2;
  ctx.beginPath(); ctx.moveTo(g.lx, g.ly - (gross ? 2 : 1)); ctx.lineTo(g.rx, g.ry - (gross ? 2 : 1)); ctx.stroke();
  ctx.lineCap = 'butt';
  // Zeiger (dreht mit dem Balken), Drehpunkt
  const zx = K.PX + Math.sin(g.phi) * K.ZL, zy = K.PY - Math.cos(g.phi) * K.ZL;
  ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(K.PX, K.PY); ctx.lineTo(zx, zy); ctx.stroke();
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath(); ctx.arc(zx, zy, 2.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = gross ? '#0f172a' : '#334155';
  ctx.beginPath(); ctx.arc(K.PX, K.PY, gross ? 8 : 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath(); ctx.arc(K.PX, K.PY, 2.5, 0, Math.PI * 2); ctx.fill();
  // Schalen (klein: Messing) bzw. Plattformen (gross: Riffelblech)
  for (const [x, sy] of [[g.lx, g.lsy], [g.rx, g.rsy]]) {
    if (gross) {
      ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5;
      _bioFxRundRect(ctx, x - K.SW / 2, sy, K.SW, K.STG, 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
      for (let i = 1; i < 12; i++) {
        const xx = x - K.SW / 2 + i * K.SW / 12;
        ctx.beginPath(); ctx.moveTo(xx - 2, sy + 2); ctx.lineTo(xx + 2, sy + K.STG - 2); ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#e8c873'; ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1.3;
      _bioFxRundRect(ctx, x - K.SW / 2, sy, K.SW, K.ST, 2.5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillRect(x - K.SW / 2 + 4, sy + 1, K.SW - 8, 1.2);
    }
  }
  ctx.restore();
}
// Schild ueber dem Gegenstand (Text in Bernstein wie „Links“), an einem Faden
// (y1: wo der Faden den Gegenstand erreicht) bzw. beim Sand an einem Stab.
function _m6iEtikett(ctx, s, x, y, y1, stab) {
  if (y1 !== undefined) {
    ctx.strokeStyle = stab ? '#92400e' : '#a8a29e'; ctx.lineWidth = stab ? 2.2 : 1;
    ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x, y1); ctx.stroke();
  }
  ctx.font = '700 10.5px sans-serif';
  const w = ctx.measureText(s).width + 10, h = 15;
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = _m6iK.LINKS; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x - w / 2, y - h / 2, w, h, 4); ctx.fill(); ctx.stroke();
  _m6iText(ctx, s, x, y + 3.8, 10.5, _m6iK.LINKS);
}
// Der Gegenstand links: Mitte x, Unterkante yb, Deckkraft a.
function _m6iDingZeichnen(ctx, key, x, yb, a) {
  if (a <= 0.01) return;
  const d = _m6iDING[key];
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (key === 'nudeln') {
    const w = 54, h = 52, x0 = x - w / 2, y0 = yb - h;
    ctx.fillStyle = 'rgba(219,234,254,0.9)'; ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x0 + 3, y0 + 7);
    for (let i = 0; i <= 8; i++) ctx.lineTo(x0 + 3 + i * (w - 6) / 8, y0 + (i % 2 ? 2 : 7));
    ctx.lineTo(x0 + w - 2, yb - 6);
    ctx.quadraticCurveTo(x0 + w - 2, yb, x0 + w - 8, yb);
    ctx.lineTo(x0 + 8, yb);
    ctx.quadraticCurveTo(x0 + 2, yb, x0 + 2, yb - 6);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // Penne in festen Lagen (keine Zufallszahl)
    const P = [[-16, -9, 0.6], [-5, -11, -0.4], [7, -8, 0.9], [17, -11, -0.2], [-13, -20, -0.8],
               [1, -21, 0.3], [13, -20, 1.2], [-17, -30, 0.2], [-6, -32, 1.0], [6, -31, -0.6],
               [16, -29, 0.4], [-10, -39, -0.3], [3, -40, 0.7], [14, -38, -1.0]];
    for (const [dx, dy, wi] of P) {
      ctx.save(); ctx.translate(x + dx, yb + dy); ctx.rotate(wi);
      ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 0.9;
      _bioFxRundRect(ctx, -5, -2.2, 10, 4.4, 1.5); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0 + 8, y0 + 14); ctx.lineTo(x0 + 8, yb - 10); ctx.stroke();
    _m6iEtikett(ctx, d.text, x, yb - h - 12, yb - h + 3);
  } else if (key === 'mehl') {
    const w = 48, h = 64, x0 = x - w / 2, y0 = yb - h;
    ctx.fillStyle = '#ecdcb6'; ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.rect(x0, y0 + 9, w, h - 9); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#dcc597';                                     // gefalteter Rand oben
    ctx.beginPath();
    ctx.moveTo(x0, y0 + 9); ctx.lineTo(x0 + 4, y0); ctx.lineTo(x0 + w - 4, y0); ctx.lineTo(x0 + w, y0 + 9);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(161,98,7,0.12)';                         // Schatten rechts
    ctx.fillRect(x0 + w - 9, y0 + 10, 8, h - 11);
    ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 1.3;              // Aehre
    ctx.beginPath(); ctx.moveTo(x, y0 + 40); ctx.lineTo(x, y0 + 16); ctx.stroke();
    ctx.fillStyle = '#eab308';
    for (let i = 0; i < 4; i++) {
      for (const sgn of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(x + sgn * 3.2, y0 + 19 + i * 5, 2.2, 3.6, sgn * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    _m6iEtikett(ctx, d.text, x, yb - h - 12, y0);
  } else if (key === 'kartoffeln') {
    const w = 74, x0 = x - w / 2;
    // Kartoffeln: 4 · 3 · 2, von unten
    const K3 = [[-27, -8], [-9, -8], [9, -8], [27, -8], [-18, -21], [0, -21], [18, -21], [-9, -34], [9, -34]];
    for (const [dx, dy] of K3) {
      ctx.fillStyle = '#c08a4a'; ctx.strokeStyle = '#7c4a1e'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.ellipse(x + dx, yb + dy, 9.5, 7.2, dx * 0.01, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#7c4a1e';
      ctx.beginPath(); ctx.arc(x + dx - 3, yb + dy - 1.5, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + dx + 3.5, yb + dy + 1.8, 0.9, 0, Math.PI * 2); ctx.fill();
    }
    // Netz: Zickzacklinien von oben (Knoten) nach unten
    ctx.strokeStyle = 'rgba(234,88,12,0.75)'; ctx.lineWidth = 1;
    for (let j = 0; j <= 6; j++) {
      ctx.beginPath();
      for (let r = 0; r <= 5; r++) {
        const yy = yb - 46 + r * 9.2, sp = 0.25 + 0.75 * Math.min(1, r / 2);
        const xx = x + (x0 + j * w / 6 - x) * sp + (r % 2 ? 3 : -3);
        if (r === 0) ctx.moveTo(x + (j - 3) * 2, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }
    ctx.fillStyle = '#ea580c';                                     // Knoten
    ctx.beginPath(); ctx.ellipse(x - 4, yb - 49, 4, 2.6, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 4, yb - 49, 4, 2.6, 0.4, 0, Math.PI * 2); ctx.fill();
    _m6iEtikett(ctx, d.text, x, yb - 64, yb - 52);
  } else {
    // Sandhaufen
    const w = 136, h = 50;
    ctx.fillStyle = '#e9c46a'; ctx.strokeStyle = '#b7791f'; ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, yb);
    ctx.bezierCurveTo(x - w * 0.3, yb - h * 0.25, x - w * 0.16, yb - h, x, yb - h);
    ctx.bezierCurveTo(x + w * 0.16, yb - h, x + w * 0.3, yb - h * 0.25, x + w / 2, yb);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c9952e';
    const S = [[-40, -6], [-22, -14], [-8, -9], [10, -16], [28, -8], [44, -5], [-30, -22], [-4, -30], [18, -27],
               [-14, -38], [6, -42], [34, -18], [-48, -3], [52, -3]];
    for (const [dx, dy] of S) { ctx.beginPath(); ctx.arc(x + dx, yb + dy, 1.1, 0, Math.PI * 2); ctx.fill(); }
    _m6iEtikett(ctx, d.text, x, yb - h - 16, yb - h + 8, true);
  }
  ctx.restore();
}
// Ein Stueck rechts: Zylinder „100 g“ (klein) oder Sack „100 kg“ (gross). Mitte x, Unterkante yb.
function _m6iStueck(ctx, x, yb, gross, a) {
  if (a <= 0.01) return;
  const K = _m6iK, w = K.TW, h = K.TH, x0 = x - w / 2, yt = yb - h;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (gross) {
    // Sack: Kissenform mit gewoelbten Seiten und kleinen Zipfeln an den Ecken
    const o = yt + 1.5, u = yb - 0.5;
    ctx.fillStyle = '#9a5b1e'; ctx.strokeStyle = '#5c3510'; ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(x0 + 1, o);
    ctx.quadraticCurveTo(x, o + 2.5, x0 + w - 1, o);
    ctx.quadraticCurveTo(x0 + w - 3, (o + u) / 2, x0 + w - 1, u);
    ctx.quadraticCurveTo(x, u - 2.5, x0 + 1, u);
    ctx.quadraticCurveTo(x0 + 3, (o + u) / 2, x0 + 1, o);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(254,243,199,0.18)';                              // Lichtkante oben
    ctx.fillRect(x0 + 5, o + 2.5, w - 10, 2);
    _m6iTextPasst(ctx, '100 kg', x, yb - 4.5, 8, '#fef3c7', w - 6, 6.5);
  } else {
    const g = ctx.createLinearGradient(x0, 0, x0 + w, 0);
    g.addColorStop(0, '#9ca3af'); g.addColorStop(0.45, '#e5e7eb'); g.addColorStop(1, '#6b7280');
    ctx.fillStyle = g; ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, yt + 3); ctx.lineTo(x0, yb - 2);
    ctx.ellipse(x, yb - 2, w / 2, 2, 0, Math.PI, 0, true);
    ctx.lineTo(x0 + w, yt + 3);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d1d5db';
    ctx.beginPath(); ctx.ellipse(x, yt + 3, w / 2, 2.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    _m6iTextPasst(ctx, '100 g', x, yb - 3.5, 8.5, '#1f2937', w - 4, 6.5);
  }
  ctx.restore();
}
// Schild oben: „Links: 1 kg“ / „Rechts: 700 g“ (pop: springt kurz).
function _m6iSchild(ctx, s, mx, farbe, a, pop) {
  if (a <= 0.01) return;
  const K = _m6iK;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.font = '700 12px sans-serif';
  const w = ctx.measureText(s).width + 14, h = K.SH;
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = farbe; ctx.lineWidth = 1.6;
  _bioFxRundRect(ctx, mx - w / 2, K.SY, w, h, 7); ctx.fill(); ctx.stroke();
  const k = pop < 0.3 ? 1 + 0.12 * Math.sin(Math.PI * pop / 0.3) : 1;
  ctx.translate(mx, K.SY + h / 2); ctx.scale(k, k);
  _m6iText(ctx, s, 0, 4.3, 12, farbe);
  ctx.restore();
}
// Zettel „Rechnung“ unten – gleitet herein; Anzahl dunkel, Ergebnis blau.
function _m6iZettel(ctx, d) {
  const z = _m6i, K = _m6iK, e = _bioFxEase.sanft(z.zettel), n = z.stand.n;
  if (e <= 0.01 || !d || n <= 0) return;
  const gr = 16;
  const teile = z.verdeckt ? [['verdeckt', '#94a3b8']]
    : [[String(n), K.TINTE], ['·', K.TINTE], ['100 ' + _m6iEinheit(d), '#4b5563'], ['=', K.TINTE],
       [_m6iMenge(n, d), K.RECHTS]];
  ctx.save();
  ctx.font = '700 ' + gr + 'px sans-serif';
  const br = teile.map(t => ctx.measureText(t[0]).width), luft = gr * 0.32;
  const ges = br.reduce((s, b) => s + b, 0) + luft * (teile.length - 1);
  ctx.font = '600 11px sans-serif';
  const lab = ctx.measureText('Rechnung:').width;
  const w = 10 + lab + 10 + ges + 12, x0 = K.PX - w / 2, dy = 6 * (1 - e);
  const y0 = K.ZY0 + dy, y1 = K.ZY1 + dy;
  ctx.globalAlpha = e;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 2, w, y1 - y0, 7); ctx.fill();
  ctx.fillStyle = z.verdeckt ? '#e2e8f0' : '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x0, y0, w, y1 - y0, 7); ctx.fill(); ctx.stroke();
  _m6iText(ctx, 'Rechnung:', x0 + 10, y0 + 17, 11, K.GRAU, 'left', '600');
  let x = x0 + 10 + lab + 10;
  teile.forEach((t, i) => { _m6iText(ctx, t[0], x, y0 + 18.5, gr, t[1], 'left'); x += br[i] + luft; });
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m6iPauseSchild(ctx) {
  const z = _m6i, w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  if (z.blink > 0) {
    ctx.globalAlpha = Math.min(1, z.blink / 0.3);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, x - 3, y - 3, w + 6, h + 6, 9); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6iText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m6iDraw(ctx, cv) {
  if (!_m6i) return;
  const z = _m6i, K = _m6iK, W = cv.width, H = cv.height, E = _bioFxEase, kl = _bioFxKlemme;
  const d = z.key ? _m6iDING[z.key] : null, L = z.lauf;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ece4d6'; ctx.fillRect(0, K.TY, W, H - K.TY);            // Tischplatte
  ctx.strokeStyle = '#d6c9b3'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, K.TY + 0.5); ctx.lineTo(W, K.TY + 0.5); ctx.stroke();
  const g = _m6iGeo();
  _m6iWaage(ctx, g, false, 1 - z.grossAnz);
  _m6iWaage(ctx, g, true, z.grossAnz);
  // was vorher auf der Waage lag, blendet aus
  if (z.alt) {
    const a = 1 - kl(z.alt.at / K.T_ALT);
    if (z.alt.key) _m6iDingZeichnen(ctx, z.alt.key, g.lx, g.lsy, a);
    for (let i = 0; i < z.alt.n; i++) { const p = _m6iPlatz(g, i); _m6iStueck(ctx, p.x, p.yb, z.alt.gross, a); }
  }
  // der Gegenstand links (senkt sich beim Laden in die Schale)
  let ein = 1;
  if (d) {
    let dy = 0;
    if (L && L.art === 'spiel' && L.at < K.T_AB) {
      const u = kl(L.at / K.T_AB);
      dy = -60 * (1 - E.raus(u)); ein = Math.min(1, u / 0.3);
    }
    _m6iDingZeichnen(ctx, z.key, g.lx, g.lsy + dy, ein);
  }
  // Stuecke rechts (liegend, fallend, sich abhebend)
  if (d) {
    // Aha: die zwei Fuenfertuerme bernsteinfarben eingerahmt
    if (z.ahaGlanz > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.8) * (0.55 + 0.45 * Math.sin(z.t * Math.PI * 1.6));
      ctx.fillStyle = 'rgba(252,211,77,0.22)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
      const xa = g.rx + K.T0 - K.TW / 2 - 5, xb = g.rx + K.T0 + K.TP + K.TW / 2 + 5;
      _bioFxRundRect(ctx, xa, g.rsy - 5 * K.TH - 6, xb - xa, 5 * K.TH + 9, 8); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    for (const s of _m6iStueckeSzene(z)) {
      const p = _m6iPlatz(g, s.i);
      if (s.fall !== undefined) {
        const y0 = Math.min(K.FALL_Y, p.yb - K.FALL_MIN);
        _m6iStueck(ctx, p.x, y0 + (p.yb - y0) * s.fall * s.fall, d.gross, Math.min(1, s.fall / 0.25));
      } else _m6iStueck(ctx, p.x, p.yb + s.dy, d.gross, s.a);
    }
    // Schilder oben
    _m6iSchild(ctx, 'Links: ' + d.kurz, K.SLX, K.LINKS, ein, 9);
    _m6iSchild(ctx, 'Rechts: ' + (z.verdeckt ? '?' : _m6iMenge(z.stand.n, d)), K.SRX, K.RECHTS, ein, z.rechtsPop);
  }
  _m6iZettel(ctx, d);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6iPauseSchild(ctx);
}
