
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mp4 „Wie subtrahiert man schriftlich?“
// (Kennung m5-minus-schriftlich, Praefix _m5j)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL2_PROFIL.md, Abschnitt m5-minus-schriftlich.
// Ueberschrift = Frage der Einheit: „Was ergibt 432 − 158 wirklich?“
//
// Was man sieht – zwei Darstellungen nebeneinander, Spalte fuer Spalte gleich
// gefaerbt (H rot, Z blau, E gruen wie in m5-buendeln):
//   RECHENBLATT (Karopapier, Kaestchen 28 px): klein darueber die Spalten
//     H Z E, darunter eine Notizzeile, die obere Zahl, die untere Zahl mit dem
//     Rechenzeichen „−“ davor, ein Strich, die Ergebniszeile. Unter dem Blatt
//     eine Sprechblase, die auf die Spalte zeigt, die gerade dran ist.
//   MATERIAL (daneben): die OBERE Zahl als Platten (Hunderter, Fuenfersaeulen),
//     Stangen (Zehner, 10 Wuerfel mit Fuenfermarke, 5 + 5 je Reihe) und Wuerfel
//     (Einer, Fuenferreihen, nach zehn eine Luecke). Unten im Bild steht je Feld
//     die ANZAHL der Stuecke; ab 10 ist sie orange hinterlegt (wie m5-buendeln).
//
// „nächste Spalte“ rechnet EINE Spalte, von den Einern aus. Die Spalte wird im
// Blatt UND im Material gelb hinterlegt, die Sprechblase zeigt „2 − 8“.
//   Reicht es:      die unteren Stuecke heben ab und verblassen (0,8 s), die
//                   Anzahl faellt, die Ergebnisziffer erscheint im Blatt.
//   Reicht es nicht: die Stuecke wackeln („2 − 8 reicht nicht“). Dann zerfaellt
//                   EINE Stange der Nachbarspalte sichtbar in zehn Wuerfel (bzw.
//                   eine Platte in zehn Stangen, 0,55 s) – die Nachbarspalte ist
//                   orange hinterlegt –, und die zehn Teile wandern nach rechts in
//                   das Feld der Spalte (0,75 s). Im Blatt wird dabei die Ziffer
//                   der Nachbarspalte durchgestrichen, darueber steht klein die um
//                   eins kleinere Ziffer, und die Spalte bekommt eine kleine 1
//                   davor (2 -> 12). Erst DANN wird weggenommen und geschrieben.
//   Ist in der Nachbarspalte nichts (503 − 128): „Bei den Zehnern ist nichts“,
//                   das leere Feld pulsiert; erst zerfaellt eine Platte in zehn
//                   Stangen, dann eine dieser Stangen in zehn Wuerfel. Im Blatt:
//                   5 durchgestrichen, klein 4; vor die 0 eine kleine 1; dann die
//                   10 durchgestrichen, klein 9; vor die 3 eine kleine 1.
// „alles rechnen“ rechnet die uebrigen Spalten nacheinander mit denselben
// Bewegungen (0,35 s Pause dazwischen). Waehrend eine Spalte laeuft, sind
// „nächste Spalte“ und „alles rechnen“ blass und tun nichts (bzw. „alles
// rechnen“ merkt sich, dass es weitergehen soll). Eine Aufgabe oder „neu“
// bricht alles ab: das alte Material faellt weg, das neue faellt von oben ein.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken „432 − 158“ · „563 − 241“ · „745 − 382“ · „503 − 128“
//                (_m5jAufgabe('432-158') usw.; Leerzeichen als &nbsp;)
//   „nächste Spalte“ (_m5jWeiter()) · „alles rechnen“ (_m5jAlles()) ·
//   „neu“ (_m5jNeu(): wieder 432 − 158, nichts gerechnet)
//
// FUER DIE LEHRKRAFT (seit 04.10.2026, Wunsch aus dem Unterricht: „die
// Entbündelung kurz stoppen und den Kindern erklären, was da passiert“).
// Eine eigene Zeile UNTER den Heftknoepfen, davor klein „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m5jAnhalten()): friert JEDE Bewegung sofort ein,
//                auch mitten in einer Spalte; „weiter“ macht genau dort weiter.
//                Im Bild steht oben links ein dunkles Schild „Pause“ (Stelle
//                und Aussehen wie in m5-plus-schriftlich).
//   „Halt beim Entbündeln: aus“ <-> „…: an“ (_m5jHaltSchalter()): ist er an,
//                haelt die Spalte VON SELBST an, bevor ein Stueck zerfaellt –
//                die Stange (bzw. Platte), die gleich zerfaellt, ist orange
//                umrandet, darunter steht „1 Zehner = 10 Einer“ (bzw.
//                „1 Hunderter = 10 Zehner“). Bei 503 − 128 zweimal. Die
//                Sprechblase nennt dabei den Grund: „2 − 8 reicht nicht“ bzw.
//                „Bei den Zehnern ist nichts“; beim zweiten Halt ueber die Null
//                wieder „3 − 8 reicht nicht“ (nicht das alte „1 Hunderter entbündeln“).
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m5jTempo()): langsam = ein Drittel.
// Bauart: EIN Zeitfaktor (_m5jZeitfaktor: 0 angehalten, 1/3 langsam, 1 normal)
// an der einen Stelle, an der dt in _m5jUpdate hineingeht. Bei 0 kehrt
// _m5jUpdate sofort zurueck – es laeuft keine Uhr weiter und es beginnt auch
// keine neue Phase. Der Halt ist ein EREIGNIS im Drehbuch: Er faellt beim
// Phasenwechsel, wenn die naechste Phase „zerfallen“ ist (also nach
// „reicht nicht“, „ist nichts“ bzw. nach dem ersten Wandern bei 503 − 128),
// nicht nach einer gemessenen Zeit. Mit „weiter“ beginnt genau diese Phase.
// Waehrend der Pause:
//   – „nächste Spalte“ / „alles rechnen“: laeuft gerade eine Spalte, sind sie
//     blass wie sonst auch (nichts aendert sich). Steht die Rechnung ZWISCHEN
//     zwei Spalten, wird die naechste Spalte VORGEMERKT (sie ist angelegt,
//     die Knoepfe werden blass) und beginnt erst mit „weiter“.
//   – „Halt …“ und „Tempo …“ schalten nur um; das Bild bleibt stehen.
//   – „neu“ und die vier Aufgabenknoepfe heben die Pause auf (die Schalter
//     „Halt“ und „Tempo“ bleiben, wie die Lehrkraft sie gestellt hat).
// Voreinstellung: Pause aus, Halt aus, Tempo normal -> genau wie vorher (der
// Faktor ist dann 1 und dt * 1 === dt; nachgefahren mit werte.js und einem
// Bild-fuer-Bild-Vergleich des Zustands gegen die alte Fassung).
//
// Statuszeilen (woertlich; jede, deren Wert das Heft verlangt, hat >= 19
// Zeichen, sonst fehlt sie im Faktendump):
//   _m5j-aufgabe   „Aufgabe: 432 − 158 (schriftlich)“
//   _m5j-spalte    Start „Noch keine Spalte gerechnet.“; waehrend der Spalte
//                  waechst die Zeile mit der Bewegung mit („Einer: 2 − 8 …“ ->
//                  „Einer: 2 − 8 reicht nicht. …“ -> „… entbündeln: …“), am
//                  Ende der Spalte z. B.
//                  „Einer: 2 − 8 reicht nicht. 1 Zehner entbündeln: 12 − 8 = 4, schreibe 4“
//                  „Hunderter: 3 − 1 = 2, schreibe 2“
//                  „Einer: 3 − 8 reicht nicht. Bei den Zehnern ist nichts. Erst
//                   1 Hunderter, dann 1 Zehner entbündeln: 13 − 8 = 5, schreibe 5“
//   _m5j-reicht    „Nicht gereicht hat es bei: …“, am Ende z. B.
//                  „Nicht gereicht hat es bei: E und Z“ (sonst „… bei: nirgends“)
//   _m5j-ergebnis  „Ergebnis der Aufgabe: …“, am Ende „Ergebnis der Aufgabe: 274“
//   _m5j-lehrkraft (Hinweis fuer die Lehrkraft, direkt unter der Lehrkraft-Zeile;
//                  in der Pause bernsteinfarben „lmp-status off“, sonst „on“)
//                  normal „Für die Lehrkraft: „Pause“ hält alles an. „Halt beim
//                  Entbündeln“ stoppt von selbst.“ · von Hand angehalten
//                  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“ ·
//                  beim Halt „Halt: 1 Zehner wird zu 10 Einern. Das ist das
//                  Entbündeln.“ bzw. „Halt: 1 Hunderter wird zu 10 Zehnern. …“
//
// Werte (jede Zeile mit simcheck/werte.js nachgerechnet):
//   432 − 158: E 2 − 8 reicht nicht, 1 Zehner entbuendeln, 12 − 8 = 4 ·
//              Z 2 − 5 reicht nicht, 1 Hunderter entbuendeln, 12 − 5 = 7 ·
//              H 3 − 1 = 2  ->  bei: E und Z  ->  274
//   563 − 241: E 3 − 1 = 2 · Z 6 − 4 = 2 · H 5 − 2 = 3  ->  nirgends  ->  322
//   745 − 382: E 5 − 2 = 3 · Z 4 − 8 reicht nicht, 1 Hunderter entbuendeln,
//              14 − 8 = 6 · H 6 − 3 = 3  ->  Z  ->  363
//   503 − 128: E 3 − 8 reicht nicht, bei den Zehnern ist nichts, erst
//              1 Hunderter, dann 1 Zehner entbuendeln, 13 − 8 = 5 ·
//              Z 9 − 2 = 7 · H 4 − 1 = 3  ->  E  ->  375
// Material am Ende = Ergebnis (2 Platten, 7 Stangen, 4 Wuerfel bei 274) –
// die Anzahlzeile zeigt dann dieselben Ziffern wie die Ergebniszeile.
// Start: Aufgabe 432 − 158, noch keine Spalte gerechnet.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): in 432 − 158 die erste Stange,
// die zerfaellt (Einerspalte) – Lichtring um die Stange; wenn ihre zehn Wuerfel
// angekommen sind, ein zweiter Ring an der kleinen 1 im Blatt. Das widerlegt
// „326 stimmt“ (kleiner von groesser) und „2 − 8 geht nicht“ zugleich: Die
// 2 bleibt oben, und es geht doch, weil eine Stange zu zehn Einern wird.
// Bei jedem Durchgang durch 432 − 158; ist die Aufgabe fertig, leuchtet die
// Ergebniszeile kurz nach.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): die Merksatzwoerter
// „links“ und „minus“ (als Wort), „oben minus unten“ – und ueberhaupt keine
// Regel: Die Seite benennt sie erst im Merksatz. Das Rechenzeichen „−“ ist
// erlaubt. Keine Namen, keine Punkte, keine Zeit, kein „falsch“.
// Deterministisch, ohne Zufall: jede Zahl im Bild und in den Statuszeilen
// kommt aus _m5jRechne().
// ════════════════════════════════════════════════════════════════════════
let _m5j = null;
const _m5jAUFGABEN = {
  '432-158': [432, 158], '563-241': [563, 241], '745-382': [745, 382], '503-128': [503, 128]
};
const _m5jREIHE = ['432-158', '563-241', '745-382', '503-128'];
const _m5jSP = ['H', 'Z', 'E'];                          // Spalten im Bild
const _m5jWORT = { H: 'Hunderter', Z: 'Zehner', E: 'Einer' };
const _m5jDATIV = { H: 'Hundertern', Z: 'Zehnern', E: 'Einern' };
const _m5jVOR = { E: 'Z', Z: 'H' };                      // woher eine Spalte entbuendelt
const _m5jK = {
  // Rechenblatt
  PX0: 6, PX1: 186, PY0: 6, PY1: 244,
  GX: 12, GY: 8, C: 28,                                  // Karogitter
  SPX: { V: 40, H: 68, Z: 96, E: 124 },                  // linke Kanten (V = Rechenzeichen)
  YN: 36, YO: 64, YU: 92, YE: 120,                       // Notiz, oben, unten, Ergebnis
  BL: 160,                                               // Oberkante der Sprechblase
  // Material
  MX0: 194, MX1: 414, MY0: 6, MY1: 244,
  FELD: { H: [194, 268], Z: [268, 348], E: [348, 414] },
  YF0: 44, YT: 198,                                      // Feldflaeche ab, Anzahlzeile ab
  // Zeiten in s
  T_ZEIGEN: 0.5, T_REICHT: 0.7, T_NICHTS: 0.8, T_ZERFALL: 0.55, T_WANDERN: 0.75,
  T_WEG: 0.8, T_SCHREIBEN: 0.45, T_PAUSE: 0.35,
  LANGSAM: 1 / 3                                         // Zeitfaktor bei „Tempo: langsam“
};
const _m5jFARBE = {
  H: { grund: '#fef2f2', fuell: '#fca5a5', linie: 'rgba(185,28,28,0.35)', rand: '#b91c1c' },
  Z: { grund: '#eff6ff', fuell: '#93c5fd', linie: 'rgba(29,78,216,0.45)', rand: '#1d4ed8' },
  E: { grund: '#f0fdf4', fuell: '#86efac', licht: '#dcfce7', rand: '#15803d' }
};
const _m5jNOTIZ = '#c2410c';           // Notizen im Blatt: Strich, kleine Ziffer, kleine 1
const _m5jERG = '#0f766e';             // Ergebnisziffern

// ── Rechnen ─────────────────────────────────────────────────────────────
function _m5jFmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function _m5jStellen(n) {
  return { H: Math.floor(n / 100) % 10, Z: Math.floor(n / 10) % 10, E: n % 10 };
}
// Der ganze Rechenweg einer Aufgabe, Spalte fuer Spalte von den Einern aus.
function _m5jRechne(oben, unten) {
  const a = _m5jStellen(oben), b = _m5jStellen(unten);
  const cur = { H: a.H, Z: a.Z, E: a.E };
  const spalten = [];
  for (const c of ['E', 'Z', 'H']) {
    const s = { c, oben: cur[c], unten: b[c], reicht: cur[c] >= b[c], nichts: null, schritte: [] };
    if (!s.reicht && _m5jVOR[c]) {
      const g = _m5jVOR[c];
      if (cur[g] === 0 && _m5jVOR[g]) {                  // ueber eine leere Spalte
        const gg = _m5jVOR[g];
        s.nichts = g;
        s.schritte.push({ von: gg, nach: g }); cur[gg] -= 1; cur[g] += 10;
      }
      s.schritte.push({ von: g, nach: c }); cur[g] -= 1; cur[c] += 10;
    }
    s.neu = cur[c];                                      // nach dem Entbuendeln
    cur[c] -= s.unten;
    s.ziffer = cur[c];
    s.texte = _m5jTexte(s);
    spalten.push(s);
  }
  const ergebnis = oben - unten;
  const nicht = spalten.filter(s => !s.reicht).map(s => s.c);
  const reicht = nicht.length === 0 ? 'nirgends'
    : nicht.length === 1 ? nicht[0]
    : nicht.slice(0, -1).join(', ') + ' und ' + nicht[nicht.length - 1];
  return { a, b, spalten, ergebnis, reicht, oben, unten };
}
// Die Statuszeile einer Spalte in ihren Teilen – sie waechst mit der Bewegung.
function _m5jTexte(s) {
  const kopf = _m5jWORT[s.c] + ': ' + s.oben + ' − ' + s.unten;
  if (s.reicht) return { kopf, rn: '', nichts: '', ent: '', ende: kopf + ' = ' + s.ziffer + ', schreibe ' + s.ziffer };
  const rn = kopf + ' reicht nicht.';
  const nichts = s.nichts ? ' Bei den ' + _m5jDATIV[s.nichts] + ' ist nichts.' : '';
  const ent = s.schritte.length === 1
    ? ' 1 ' + _m5jWORT[s.schritte[0].von] + ' entbündeln:'
    : ' Erst 1 ' + _m5jWORT[s.schritte[0].von] + ', dann 1 ' + _m5jWORT[s.schritte[1].von] + ' entbündeln:';
  return { kopf, rn, nichts, ent,
           ende: rn + nichts + ent + ' ' + s.neu + ' − ' + s.unten + ' = ' + s.ziffer + ', schreibe ' + s.ziffer };
}

// ── Material: Plaetze in den Feldern ────────────────────────────────────
function _m5jPlatz(art, i) {
  if (art === 'E') {                       // Fuenferreihen, nach zehn eine Luecke
    const c = i % 5, r = Math.floor(i / 5);
    return { x: 352 + c * 12, y: 50 + r * 12 + (r >= 2 ? 6 : 0), w: 10, h: 10 };
  }
  if (art === 'Z') {                       // zehn Stangen je Reihe, 5 + 5
    const k = i % 10, r = Math.floor(i / 10);
    return { x: 271 + k * 7 + (k >= 5 ? 4 : 0), y: 50 + r * 60, w: 6, h: 52 };
  }
  const c = Math.floor(i / 5), r = i % 5;  // H: Fuenfersaeulen
  return { x: 205 + c * 30, y: 48 + r * 28, w: 24, h: 24 };
}
function _m5jStueck(art, i, verz) {
  const p = _m5jPlatz(art, i);
  return { art, x: p.x, y: p.y - 26, w: p.w, h: p.h, tx: p.x, ty: p.y, tw: p.w, th: p.h,
           a: 0, verz: verz || 0 };
}

// ── Zustand ─────────────────────────────────────────────────────────────
function _m5jInit() {
  _m5j = { key: null, r: null, k: 0, fertig: false, alles: false, job: null, pause: 0,
           feld: { H: [], Z: [], E: [] }, n: { H: 0, Z: 0, E: 0 }, weg: [], teile: null,
           papier: null, erg: { H: null, Z: null, E: null }, papierT: 0,
           band: null, band2: null, blase: null, puls: null, spalteText: '',
           wackel: { H: 0, Z: 0, E: 0 }, glanz: { H: 0, Z: 0, E: 0 }, fertigGlanz: 0,
           t: 0, fx: { teile: [] },
           // fuer die Lehrkraft: angehalten? warum (Halt)? Schalter Halt / langsam
           steht: false, haltInfo: null, haltAn: false, langsam: false };
  _m5jSetze('432-158');
}
function _m5jSetze(key) {
  const z = _m5j, [oben, unten] = _m5jAUFGABEN[key];
  // altes Material faellt weg
  for (const c of _m5jSP) { for (const p of z.feld[c]) { p.modus = 'fall'; z.weg.push(p); } z.feld[c] = []; }
  if (z.teile) { for (const p of z.teile.liste) { p.modus = 'fall'; p.a = 1; z.weg.push(p); } }
  z.key = key; z.r = _m5jRechne(oben, unten);
  z.k = 0; z.fertig = false; z.alles = false; z.job = null; z.pause = 0; z.teile = null;
  z.band = null; z.band2 = null; z.blase = null; z.puls = null; z.fertigGlanz = 0;
  z.steht = false; z.haltInfo = null;                    // eine Aufgabe / „neu“ hebt die Pause auf
  z.spalteText = 'Noch keine Spalte gerechnet.';
  z.erg = { H: null, Z: null, E: null };
  z.papier = {};
  for (const c of _m5jSP)
    z.papier[c] = { gross: z.r.a[c], weg: null, eins: null, klein: null, kleinT: null, kleinEins: null };
  z.papierT = 0;
  let j = 0;
  for (const c of _m5jSP) {
    z.n[c] = z.r.a[c];
    for (let i = 0; i < z.r.a[c]; i++) z.feld[c].push(_m5jStueck(c, i, 0.12 + 0.03 * j++));
    z.wackel[c] = 0; z.glanz[c] = 0;
  }
}

function _m5jHTML() {
  const marke = k => {
    const [o, u] = _m5jAUFGABEN[k];
    return `<button class="sim-btn" id="_m5j-b-${k}" onclick="_m5jAufgabe('${k}')">${o}&nbsp;−&nbsp;${u}</button>`;
  };
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was ergibt 432&nbsp;−&nbsp;158 wirklich?</h3>
    <div class="fpm-note" style="margin-top:2px">Auf dem Rechenblatt steht die Aufgabe. Daneben liegt die obere Zahl als Material: Platten, Stangen und Würfel.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5j-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5jREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_m5j-weiter" onclick="_m5jWeiter()">nächste Spalte</button>
          <button class="sim-btn" id="_m5j-alles" onclick="_m5jAlles()">alles rechnen</button>
          <button class="sim-btn" onclick="_m5jNeu()">neu</button>
        </div>
        <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m5j-pause" onclick="_m5jAnhalten()">Pause</button>
          <button class="sim-btn" id="_m5j-halt" onclick="_m5jHaltSchalter()">Halt beim Entbündeln: <span id="_m5j-halt-an">aus</span></button>
          <button class="sim-btn" id="_m5j-tempo" onclick="_m5jTempo()">Tempo: <span id="_m5j-tempo-an">normal</span></button>
        </div>
        <div class="lmp-status on" id="_m5j-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5j-aufgabe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5j-spalte" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5j-reicht" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5j-ergebnis" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">„nächste Spalte“ rechnet eine Spalte, von den Einern aus. Unten im Bild steht, wie viele Stücke in jedem Feld liegen.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Aufgabe 432&nbsp;−&nbsp;158, noch keine Spalte gerechnet</p>
  </div>`;
}

function _m5jStatus() {
  if (!_m5j) return;
  const z = _m5j, r = z.r;
  const setze = (id, s) => { const e = document.getElementById(id); if (e) e.textContent = s; };
  setze('_m5j-aufgabe', 'Aufgabe: ' + _m5jFmt(r.oben) + ' − ' + _m5jFmt(r.unten) + ' (schriftlich)');
  setze('_m5j-spalte', z.spalteText);
  setze('_m5j-reicht', 'Nicht gereicht hat es bei: ' + (z.fertig ? r.reicht : '…'));
  setze('_m5j-ergebnis', 'Ergebnis der Aufgabe: ' + (z.fertig ? _m5jFmt(r.ergebnis) : '…'));
  for (const k of _m5jREIHE) {
    const b = document.getElementById('_m5j-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  }
  const laeuft = !!(z.job || z.pause > 0);
  for (const id of ['_m5j-weiter', '_m5j-alles']) {
    const b = document.getElementById(id);
    if (!b) continue;
    const aus = z.fertig || laeuft;
    b.disabled = aus;
    if (b.style) b.style.opacity = aus ? '0.45' : '';
  }
  // fuer die Lehrkraft: Knopfaufschriften und Hinweiszeile
  setze('_m5j-pause', z.steht ? 'weiter' : 'Pause');
  // Nur das wechselnde Wort steht in einem eigenen <span>: So taucht die
  // Knopfaufschrift „Halt beim Entbündeln: aus“ (> 18 Zeichen) nicht als
  // Statuszeile im Faktendump auf; im Bild steht sie unveraendert ganz da.
  setze('_m5j-halt-an', z.haltAn ? 'an' : 'aus');
  setze('_m5j-tempo-an', z.langsam ? 'langsam' : 'normal');
  for (const [id, an] of [['_m5j-pause', z.steht], ['_m5j-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
  const h = z.haltInfo;
  setze('_m5j-lehrkraft',
    h ? 'Halt: 1 ' + _m5jWORT[h.von] + ' wird zu 10 ' + _m5jDATIV[h.nach] + '. Das ist das Entbündeln.'
      : z.steht ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
      : 'Für die Lehrkraft: „Pause“ hält alles an. „Halt beim Entbündeln“ stoppt von selbst.');
  const hz = document.getElementById('_m5j-lehrkraft');   // in der Pause bernsteinfarben
  if (hz) hz.className = 'lmp-status ' + (z.steht ? 'off' : 'on');
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m5jAufgabe(key) {
  if (!_m5j || !_m5jAUFGABEN[key]) return;
  _m5jSetze(key);
  _m5jStatus();
}
function _m5jNeu() {
  if (!_m5j) return;
  _m5jSetze('432-158');
  _m5jStatus();
}
function _m5jWeiter() {
  const z = _m5j;
  if (!z || z.job || z.pause > 0 || z.fertig) return;
  _m5jStarte();
  _m5jStatus();
}
function _m5jAlles() {
  const z = _m5j;
  if (!z || z.fertig) return;
  z.alles = true;
  if (!z.job && !(z.pause > 0)) _m5jStarte();
  _m5jStatus();
}
// ── Für die Lehrkraft ───────────────────────────────────────────────────
// „Pause“ <-> „weiter“. Angehalten wird nur die Zeit (_m5jZeitfaktor = 0);
// „nächste Spalte“ / „alles rechnen“ legen waehrend der Pause hoechstens die
// naechste Spalte an (vorgemerkt), sie beginnt erst mit „weiter“.
function _m5jAnhalten() {
  const z = _m5j;
  if (!z) return;
  z.steht = !z.steht;
  z.haltInfo = null;                       // „weiter“ nach einem Halt: das Stueck zerfaellt jetzt
  _m5jStatus();
}
function _m5jHaltSchalter() {
  const z = _m5j;
  if (!z) return;
  z.haltAn = !z.haltAn;                    // gilt fuer das NAECHSTE Entbuendeln
  _m5jStatus();
}
function _m5jTempo() {
  const z = _m5j;
  if (!z) return;
  z.langsam = !z.langsam;
  _m5jStatus();
}
// Der eine Zeitfaktor: 0 = angehalten, 1/3 = langsam, 1 = normal.
function _m5jZeitfaktor() {
  const z = _m5j;
  return z.steht ? 0 : z.langsam ? _m5jK.LANGSAM : 1;
}
// Halt beim Entbuendeln: ein Ereignis im Drehbuch. Gerufen beim Phasenwechsel,
// wenn als Naechstes eine Phase „zerfallen“ kommt – das Stueck liegt noch ganz
// in seinem Feld und ist das letzte dort (genau das nimmt _m5jBeginn gleich).
function _m5jHalt(ph) {
  const z = _m5j;
  z.steht = true;
  z.haltInfo = { von: ph.st.von, nach: ph.st.nach };
  // Die Sprechblase nennt beim Halt immer den GRUND fuers Entbuendeln („2 − 8
  // reicht nicht“, „Bei den Zehnern ist nichts“). Beim zweiten Halt ueber die
  // Null (503 − 128) stand dort sonst noch „1 Hunderter entbündeln“ vom Schritt
  // davor, und die Hunderterspalte war noch orange, waehrend das Schild schon
  // „1 Zehner = 10 Einer“ zeigt. Mit „weiter“ kommt wie immer „1 Zehner entbündeln“.
  if (ph.nr > 0) {
    const s = z.job.s;
    _m5jBlase(s.oben + ' − ' + s.unten + ' reicht nicht', s.c);
    z.band2 = null; z.puls = null;
  }
  // Was gerade erst erscheint, steht beim Halt GANZ da (sonst fehlte bei
  // 503 − 128 im zweiten Halt die kleine 1 vor der 0: Sie beginnt genau beim
  // Phasenwechsel einzublenden). Nur Einblend-Uhren, keine Bewegung.
  const voll = (t, d) => (t === null || t === undefined ? t : Math.max(t, d));
  for (const c of _m5jSP) {
    const P = z.papier[c];
    P.weg = voll(P.weg, 0.4); P.eins = voll(P.eins, 0.3);
    P.kleinT = voll(P.kleinT, 0.35); P.kleinEins = voll(P.kleinEins, 0.3);
    if (z.erg[c]) z.erg[c].t = voll(z.erg[c].t, 0.35);
  }
  for (const b of [z.band, z.band2, z.blase]) if (b) b.t = voll(b.t, 0.3);
  z.papierT = voll(z.papierT, 0.5);
  _m5jStatus();
}
// Drehbuch einer Spalte: eine Liste von Phasen, jede mit Dauer.
function _m5jStarte() {
  const z = _m5j, K = _m5jK, s = z.r.spalten[z.k];
  const ph = [{ art: 'zeigen', dauer: K.T_ZEIGEN }];
  if (!s.reicht) ph.push({ art: 'reichtnicht', dauer: K.T_REICHT });
  if (s.nichts) ph.push({ art: 'nichts', dauer: K.T_NICHTS });
  s.schritte.forEach((st, i) => {
    ph.push({ art: 'zerfallen', dauer: K.T_ZERFALL, st, nr: i });
    ph.push({ art: 'wandern', dauer: K.T_WANDERN, st, nr: i, letzter: i === s.schritte.length - 1 });
  });
  ph.push({ art: 'wegnehmen', dauer: K.T_WEG });
  ph.push({ art: 'schreiben', dauer: K.T_SCHREIBEN });
  z.job = { s, phasen: ph, i: 0, t: 0, begonnen: false };
}
function _m5jBlase(text, c) { _m5j.blase = { text, c, t: 0 }; }
function _m5jMitte(p) { return { x: p.x + p.w / 2, y: p.y + p.h / 2 }; }

// Beginn einer Phase
function _m5jBeginn(ph, s) {
  const z = _m5j, T = s.texte;
  if (ph.art === 'zeigen') {
    z.band = { c: s.c, t: 0 }; z.band2 = null; z.puls = null;
    _m5jBlase(s.oben + ' − ' + s.unten, s.c);
    z.spalteText = T.kopf + ' …';
  } else if (ph.art === 'reichtnicht') {
    _m5jBlase(s.oben + ' − ' + s.unten + ' reicht nicht', s.c);
    z.wackel[s.c] = 0.6;
    z.spalteText = T.rn + ' …';
  } else if (ph.art === 'nichts') {
    _m5jBlase('Bei den ' + _m5jDATIV[s.nichts] + ' ist nichts', s.c);
    z.band2 = { c: s.nichts, t: 0 }; z.puls = s.nichts;
    z.spalteText = T.rn + T.nichts + ' …';
  } else if (ph.art === 'zerfallen') {
    const g = ph.st.von, p = z.feld[g].pop();
    z.band2 = { c: g, t: 0 }; z.puls = null;
    _m5jBlase('1 ' + _m5jWORT[g] + ' entbündeln', s.c);
    z.papier[g].weg = 0;                                   // die Ziffer wird durchgestrichen
    const liste = [];
    for (let i = 0; i < 10; i++) {
      let a, b;
      if (g === 'Z') {                                     // Stange -> zehn Wuerfelchen
        a = { x: p.x, y: p.y + i * p.h / 10, w: p.w, h: p.h / 10 };
        b = { x: p.x, y: p.y + p.h / 2 - 31 + i * 6.6, w: 6, h: 5.5 };
      } else {                                             // Platte -> zehn Streifen
        a = { x: p.x + i * p.w / 10, y: p.y, w: p.w / 10, h: p.h };
        b = { x: p.x - 7 + i * 3.8, y: p.y - 4, w: 2.4, h: p.h + 8 };
      }
      liste.push({ art: g, teil: true, x: a.x, y: a.y, w: a.w, h: a.h, a: 1, s0: a, s1: b, s2: null });
    }
    z.teile = { liste, von: g, nach: ph.st.nach };
    z.glanz[g] = 0.9;
    if (z.key === '432-158' && s.c === 'E' && ph.nr === 0) {
      const m = _m5jMitte(p);                              // Aha: die erste Stange zerfaellt
      _bioFxWelle(z.fx.teile, m.x, m.y, '#f59e0b', 44);
    }
  } else if (ph.art === 'wandern') {
    const tl = z.teile, basis = z.feld[tl.nach].length;
    tl.blitz = 0.3;
    tl.liste.forEach((p, i) => {
      p.art = tl.nach; p.teil = false;
      p.s1 = { x: p.x, y: p.y, w: p.w, h: p.h };
      p.s2 = _m5jPlatz(tl.nach, basis + i);
    });
  } else if (ph.art === 'wegnehmen') {
    _m5jBlase(s.neu + ' − ' + s.unten, s.c);
    z.band2 = null;
    const f = z.feld[s.c], los = f.splice(f.length - s.unten, s.unten);
    los.forEach((p, i) => { p.modus = 'hoch'; p.verz = 0.04 * i; p.a = 1; z.weg.push(p); });
  } else if (ph.art === 'schreiben') {
    _m5jBlase(s.neu + ' − ' + s.unten + ' = ' + s.ziffer, s.c);
    z.erg[s.c] = { ziffer: s.ziffer, t: 0 };
    z.spalteText = T.ende;
  }
  _m5jStatus();
}
// Ende einer Phase
function _m5jEnde(ph, s) {
  const z = _m5j;
  if (ph.art === 'zerfallen') {
    const g = ph.st.von, P = z.papier[g];
    z.n[g] -= 1;
    const wert = P.klein !== null ? (P.kleinEins !== null ? 10 : 0) + P.klein
               : (P.eins !== null ? 10 : 0) + P.gross;
    P.klein = wert - 1; P.kleinT = 0; P.kleinEins = null;
  } else if (ph.art === 'wandern') {
    const tl = z.teile, P = z.papier[tl.nach];
    for (const p of tl.liste) {
      const q = p.s2;
      z.feld[tl.nach].push({ art: tl.nach, x: q.x, y: q.y, w: q.w, h: q.h,
                             tx: q.x, ty: q.y, tw: q.w, th: q.h, a: 1, verz: 0 });
    }
    z.teile = null;
    z.n[tl.nach] += 10;
    z.glanz[tl.nach] = 0.9;
    if (P.klein !== null) P.kleinEins = 0; else P.eins = 0;   // die kleine 1 davor
    if (z.key === '432-158' && s.c === 'E' && ph.nr === 0) {
      const x = _m5jK.SPX.E + 7, y = _m5jK.YO + 9;          // Aha, zweiter Ring: im Blatt
      _bioFxWelle(z.fx.teile, x, y, '#f59e0b', 24);
    }
    if (ph.letzter) z.spalteText = s.texte.rn + s.texte.nichts + s.texte.ent + ' …';
  } else if (ph.art === 'wegnehmen') {
    z.n[s.c] -= s.unten;
  }
  _m5jStatus();
}
// Eine Spalte ist fertig.
function _m5jSpalteFertig() {
  const z = _m5j;
  z.job = null;
  z.k += 1;
  if (z.k >= z.r.spalten.length) {
    z.fertig = true; z.alles = false;
    z.band = null; z.band2 = null;
    z.fertigGlanz = 2.0;
  } else if (z.alles) {
    z.pause = _m5jK.T_PAUSE;
  }
  _m5jStatus();
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5jUpdate(dt) {
  if (!_m5j) return;
  // EIN Zeitfaktor fuer jede Bewegung. Angehalten: nichts laeuft weiter, und es
  // beginnt auch keine neue Phase. Normal ist er 1, dann ist dt unveraendert.
  const f = _m5jZeitfaktor();
  if (f === 0) return;
  dt = _bioFxDt(dt) * f;
  const z = _m5j, K = _m5jK;
  z.t += dt;
  z.papierT += dt;
  const k = 1 - Math.exp(-dt * 11);
  for (const c of _m5jSP) {
    for (const p of z.feld[c]) {
      if (p.verz > 0) { p.verz -= dt; continue; }
      p.x += (p.tx - p.x) * k; p.y += (p.ty - p.y) * k;
      p.w += (p.tw - p.w) * k; p.h += (p.th - p.h) * k;
      p.a += (1 - p.a) * k;
      if (Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) < 0.05 && p.a > 0.995) {
        p.x = p.tx; p.y = p.ty; p.w = p.tw; p.h = p.th; p.a = 1;
      }
    }
    z.wackel[c] = Math.max(0, z.wackel[c] - dt);
    z.glanz[c] = Math.max(0, z.glanz[c] - dt);
    const P = z.papier[c];
    if (P.weg !== null) P.weg += dt;
    if (P.eins !== null) P.eins += dt;
    if (P.kleinT !== null) P.kleinT += dt;
    if (P.kleinEins !== null) P.kleinEins += dt;
    if (z.erg[c]) z.erg[c].t += dt;
  }
  for (let i = z.weg.length - 1; i >= 0; i--) {
    const p = z.weg[i];
    if (p.modus === 'hoch') {
      if (p.verz > 0) { p.verz -= dt; continue; }
      p.a -= dt / 0.6; p.y -= 30 * dt;
    } else {
      p.a -= dt / 0.25; p.y += 40 * dt;
    }
    if (p.a <= 0) z.weg.splice(i, 1);
  }
  if (z.band) z.band.t += dt;
  if (z.band2) z.band2.t += dt;
  if (z.blase) z.blase.t += dt;
  if (z.fertigGlanz > 0) z.fertigGlanz = Math.max(0, z.fertigGlanz - dt);
  // Drehbuch der laufenden Spalte
  const j = z.job;
  if (j) {
    let ph = j.phasen[j.i];
    if (!j.begonnen) { j.begonnen = true; _m5jBeginn(ph, j.s); }
    j.t += dt;
    const u = Math.min(1, j.t / ph.dauer);
    if (z.teile && (ph.art === 'zerfallen' || ph.art === 'wandern')) {
      const e = _bioFxEase.sanft(u);
      for (const p of z.teile.liste) {
        const a = ph.art === 'zerfallen' ? p.s0 : p.s1, b = ph.art === 'zerfallen' ? p.s1 : p.s2;
        p.x = a.x + (b.x - a.x) * e; p.y = a.y + (b.y - a.y) * e;
        p.w = a.w + (b.w - a.w) * e; p.h = a.h + (b.h - a.h) * e;
      }
      if (z.teile.blitz > 0) z.teile.blitz = Math.max(0, z.teile.blitz - dt);
    }
    if (j.t >= ph.dauer) {
      _m5jEnde(ph, j.s);
      j.i += 1; j.t = 0; j.begonnen = false;
      if (j.i >= j.phasen.length) _m5jSpalteFertig();
      else if (z.haltAn && j.phasen[j.i].art === 'zerfallen') _m5jHalt(j.phasen[j.i]);
    }
  } else if (z.pause > 0) {
    z.pause -= dt;
    if (z.pause <= 0) { z.pause = 0; if (!z.fertig) _m5jStarte(); _m5jStatus(); }
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5jText(ctx, s, x, y, groesse, farbe, gew, ausr) {
  ctx.fillStyle = farbe || '#1f2937';
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function _m5jMitteX(c) { return _m5jK.SPX[c] + _m5jK.C / 2; }
function _m5jEin(t, d) { return t === null || t === undefined ? 0 : Math.min(1, t / (d || 0.35)); }

function _m5jPapier(ctx) {
  const z = _m5j, K = _m5jK, C = K.C;
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 8); ctx.fill();
  // Karos
  ctx.strokeStyle = '#d7e3f1'; ctx.lineWidth = 1;
  for (let x = K.GX; x <= K.PX1 - 4; x += C) { ctx.beginPath(); ctx.moveTo(x, K.PY0 + 2); ctx.lineTo(x, K.PY1 - 2); ctx.stroke(); }
  for (let y = K.GY; y <= K.PY1 - 4; y += C) { ctx.beginPath(); ctx.moveTo(K.PX0 + 2, y); ctx.lineTo(K.PX1 - 2, y); ctx.stroke(); }
  // Baender: die Spalte, die dran ist (gelb), und die Nachbarspalte, aus der entbuendelt wird (orange)
  const band = (b, farbe) => {
    if (!b) return;
    ctx.save(); ctx.globalAlpha = _m5jEin(b.t, 0.3);
    ctx.fillStyle = farbe;
    _bioFxRundRect(ctx, K.SPX[b.c] + 1.5, K.YN + 1, C - 3, K.YE + C - K.YN - 2, 5); ctx.fill();
    ctx.restore();
  };
  band(z.band, 'rgba(253,224,71,0.45)');
  band(z.band2, 'rgba(251,146,60,0.30)');
  // Spaltenkoepfe
  for (const c of _m5jSP) _m5jText(ctx, c, _m5jMitteX(c), K.GY + 19, 14, _m5jFARBE[c].rand);
  const vis = Math.min(1, z.papierT / 0.35), vis2 = Math.min(1, Math.max(0, z.papierT - 0.15) / 0.35);
  ctx.save(); ctx.globalAlpha = vis;
  // obere Zahl mit Notizen
  for (const c of _m5jSP) {
    const P = z.papier[c], cx = _m5jMitteX(c), y0 = K.YO + 21;
    const ein = P.eins !== null, dx = ein ? 3 : 0;
    _m5jText(ctx, String(P.gross), cx + dx, y0, 22, '#1f2937');
    if (ein) {                                              // kleine 1 vor der Ziffer
      const e = _m5jEin(P.eins, 0.3);
      ctx.save(); ctx.globalAlpha = vis * e;
      _m5jText(ctx, '1', K.SPX[c] + 6, K.YO + 12, 13, _m5jNOTIZ);
      ctx.restore();
    }
    if (P.weg !== null) {                                   // durchstreichen (waechst)
      const e = _m5jEin(P.weg, 0.4);
      const xa = cx - 9 - (ein ? 9 : 0) + dx, ya = y0 + 1, xb = cx + 9 + dx, yb = y0 - 17;
      ctx.strokeStyle = _m5jNOTIZ; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xa + (xb - xa) * e, ya + (yb - ya) * e); ctx.stroke();
    }
    if (P.klein !== null) {                                 // kleine Ziffer darueber
      const e = _m5jEin(P.kleinT, 0.35);
      ctx.save(); ctx.globalAlpha = vis * e;
      _m5jText(ctx, String(P.klein), cx + 3, K.YN + 22 - (1 - e) * 4, 15, _m5jNOTIZ);
      if (P.kleinEins !== null) {
        ctx.globalAlpha = vis * _m5jEin(P.kleinEins, 0.3);
        _m5jText(ctx, '1', cx - 5, K.YN + 22, 15, _m5jNOTIZ);
      }
      ctx.restore();
    }
  }
  ctx.restore();
  // untere Zahl mit Rechenzeichen, Strich
  ctx.save(); ctx.globalAlpha = vis2;
  _m5jText(ctx, '−', _m5jMitteX('V'), K.YU + 21, 22, '#1f2937');
  for (const c of _m5jSP) _m5jText(ctx, String(z.r.b[c]), _m5jMitteX(c), K.YU + 21, 22, '#1f2937');
  ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 2.5; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(K.SPX.V + 4, K.YE + 1); ctx.lineTo(K.SPX.E + C - 2, K.YE + 1); ctx.stroke();
  ctx.restore();
  // Ergebniszeile
  if (z.fertigGlanz > 0) {                                  // die fertige Zeile leuchtet kurz nach
    const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
    ctx.save(); ctx.globalAlpha = Math.min(1, z.fertigGlanz / 0.8) * (0.6 + 0.4 * puls);
    ctx.fillStyle = 'rgba(253,230,138,0.55)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
    _bioFxRundRect(ctx, K.SPX.H + 1, K.YE + 3, 3 * C - 2, C - 4, 6); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  for (const c of _m5jSP) {
    const e = z.erg[c];
    if (!e) continue;
    const u = _m5jEin(e.t, 0.35), sc = 0.6 + 0.4 * _bioFxEase.federn(u);
    ctx.save(); ctx.globalAlpha = Math.min(1, u * 1.5);
    ctx.translate(_m5jMitteX(c), K.YE + 14); ctx.scale(sc, sc);
    _m5jText(ctx, String(e.ziffer), 0, 8, 22, _m5jERG);
    ctx.restore();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 8); ctx.stroke();
}

// Sprechblase unter dem Blatt, zeigt auf die Spalte (Text bricht um).
function _m5jSprechblase(ctx) {
  const z = _m5j, K = _m5jK, b = z.blase;
  if (!b) return;
  ctx.save();
  ctx.font = '700 15px sans-serif';
  const max = K.PX1 - K.PX0 - 26, woerter = b.text.split(' '), zeilen = [];
  let zl = '';
  for (const w of woerter) {
    const neu = zl ? zl + ' ' + w : w;
    if (ctx.measureText(neu).width > max && zl) { zeilen.push(zl); zl = w; } else zl = neu;
  }
  if (zl) zeilen.push(zl);
  const bw = Math.max(...zeilen.map(s => ctx.measureText(s).width)) + 20, bh = zeilen.length * 19 + 12;
  const px = _m5jMitteX(b.c);
  const cx = Math.max(K.PX0 + bw / 2 + 5, Math.min(K.PX1 - bw / 2 - 5, px));
  const top = K.BL, e = _bioFxEase.raus(_m5jEin(b.t, 0.25));
  ctx.globalAlpha = e;
  ctx.translate(0, (1 - e) * 6);
  ctx.fillStyle = '#fffbeb'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, cx - bw / 2, top, bw, bh, 9); ctx.fill(); ctx.stroke();
  ctx.beginPath();                                          // Zipfel zur Spalte
  ctx.moveTo(px - 7, top + 1); ctx.lineTo(px, top - 9); ctx.lineTo(px + 7, top + 1); ctx.closePath();
  ctx.fill();
  ctx.beginPath(); ctx.moveTo(px - 7, top); ctx.lineTo(px, top - 9); ctx.lineTo(px + 7, top); ctx.stroke();
  zeilen.forEach((s, i) => _m5jText(ctx, s, cx, top + 21 + i * 19, 15, '#1f2937'));
  ctx.restore();
}

function _m5jEiner(ctx, x, y, w, h) {
  const F = _m5jFARBE.E;
  ctx.fillStyle = F.fuell; ctx.strokeStyle = F.rand; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x, y, w, h, Math.min(2.5, w / 4, h / 4)); ctx.fill(); ctx.stroke();
  if (w > 7 && h > 7) {
    ctx.strokeStyle = F.licht; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x + 2.5, y + h - 3); ctx.lineTo(x + 2.5, y + 2.5); ctx.lineTo(x + w - 3, y + 2.5); ctx.stroke();
  }
}
function _m5jStange(ctx, x, y, w, h) {
  const F = _m5jFARBE.Z;
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = F.linie; ctx.lineWidth = 0.8;
  for (let k = 1; k < 10; k++) {
    if (k === 5) continue;
    ctx.beginPath(); ctx.moveTo(x, y + h * k / 10); ctx.lineTo(x + w, y + h * k / 10); ctx.stroke();
  }
  ctx.strokeStyle = F.rand; ctx.lineWidth = 1.8;                     // Fuenfermarke
  ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
  ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
}
function _m5jPlatte(ctx, x, y, w, h) {
  const F = _m5jFARBE.H;
  ctx.fillStyle = F.fuell; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = F.linie; ctx.lineWidth = 0.5;
  for (let k = 1; k < 10; k++) {
    if (k === 5) continue;
    ctx.beginPath(); ctx.moveTo(x + w * k / 10, y); ctx.lineTo(x + w * k / 10, y + h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + h * k / 10); ctx.lineTo(x + w, y + h * k / 10); ctx.stroke();
  }
  ctx.strokeStyle = F.rand; ctx.lineWidth = 1;                       // Fuenferlinien
  ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
  ctx.strokeRect(x, y, w, h);
}
// Ein Teilstueck beim Zerfallen: ein Wuerfel der Stange bzw. ein Streifen der Platte.
function _m5jTeilstueck(ctx, p) {
  const F = _m5jFARBE[p.art];
  ctx.fillStyle = F.fuell; ctx.strokeStyle = F.rand; ctx.lineWidth = 0.9;
  ctx.fillRect(p.x, p.y, p.w, p.h); ctx.strokeRect(p.x, p.y, p.w, p.h);
}
function _m5jZeichneStueck(ctx, p, dx) {
  const al = Math.max(0, Math.min(1, p.a));
  if (al <= 0.01) return;
  ctx.save(); ctx.globalAlpha = al;
  const x = p.x + (dx || 0);
  if (p.teil) _m5jTeilstueck(ctx, Object.assign({}, p, { x }));
  else if (p.art === 'E') _m5jEiner(ctx, x, p.y, p.w, p.h);
  else if (p.art === 'Z') _m5jStange(ctx, x, p.y, p.w, p.h);
  else _m5jPlatte(ctx, x, p.y, p.w, p.h);
  ctx.restore();
}

function _m5jMaterial(ctx) {
  const z = _m5j, K = _m5jK;
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.MX0, K.MY0, K.MX1 - K.MX0, K.MY1 - K.MY0, 8); ctx.fill();
  // Baender (dieselben Farben wie im Blatt)
  const band = (b, farbe) => {
    if (!b) return;
    const [a, e] = K.FELD[b.c];
    ctx.save(); ctx.globalAlpha = _m5jEin(b.t, 0.3); ctx.fillStyle = farbe;
    _bioFxRundRect(ctx, a + 2, K.YF0 - 1, e - a - 4, K.MY1 - K.YF0 - 3, 6); ctx.fill();
    ctx.restore();
  };
  band(z.band, 'rgba(253,224,71,0.40)');
  band(z.band2, 'rgba(251,146,60,0.26)');
  // Koepfe
  for (const c of _m5jSP) {
    const [a, b] = K.FELD[c], cx = (a + b) / 2, F = _m5jFARBE[c];
    ctx.fillStyle = F.grund;
    _bioFxRundRect(ctx, a + 4, K.MY0 + 4, b - a - 8, 34, 7); ctx.fill();
    _m5jText(ctx, c, cx, 25, 17, F.rand);
    _m5jText(ctx, _m5jWORT[c], cx, 38, 11, '#334155', '400');
  }
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.2;
  for (const c of ['Z', 'E']) {
    const x = K.FELD[c][0];
    ctx.beginPath(); ctx.moveTo(x, K.MY0 + 2); ctx.lineTo(x, K.MY1 - 2); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(K.MX0, K.YT - 2); ctx.lineTo(K.MX1, K.YT - 2); ctx.stroke();
  // ein leeres Feld, aus dem nichts zu holen ist, pulsiert
  if (z.puls) {
    const [a, b] = K.FELD[z.puls], puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 1.2);
    ctx.save(); ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 2;
    if (ctx.setLineDash) ctx.setLineDash([6, 4]);
    ctx.globalAlpha = 0.45 + 0.4 * puls;
    _bioFxRundRect(ctx, a + 7, K.YF0 + 4, b - a - 14, K.YT - K.YF0 - 12, 6); ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
    ctx.restore();
  }
  // Material
  for (const c of _m5jSP) {
    const wk = z.wackel[c], dx = wk > 0 ? Math.sin(wk * 40) * 2.5 * (wk / 0.6) : 0;
    for (const p of z.feld[c]) _m5jZeichneStueck(ctx, p, dx);
  }
  for (const p of z.weg) _m5jZeichneStueck(ctx, p);
  if (z.teile) {
    for (const p of z.teile.liste) _m5jZeichneStueck(ctx, p);
    if (z.teile.blitz > 0) {
      ctx.save(); ctx.globalAlpha = 0.7 * z.teile.blitz / 0.3; ctx.fillStyle = '#ffffff';
      for (const p of z.teile.liste) ctx.fillRect(p.x - 1, p.y - 1, p.w + 2, p.h + 2);
      ctx.restore();
    }
  }
  // Anzahlzeile: wie viele Stuecke liegen im Feld (ab 10 orange)
  const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
  for (const c of _m5jSP) {
    const [a, b] = K.FELD[c], n = z.n[c];
    const x = a + 6, y = K.YT + 3, w = b - a - 12, h = K.MY1 - K.YT - 8, viel = n >= 10;
    ctx.fillStyle = viel ? '#fed7aa' : '#f8fafc';
    ctx.strokeStyle = viel ? '#ea580c' : '#cbd5e1';
    ctx.lineWidth = viel ? 2 + puls : 1;
    _bioFxRundRect(ctx, x, y, w, h, 7); ctx.fill(); ctx.stroke();
    const gl = Math.min(1, z.glanz[c] / 0.5);
    if (gl > 0.01) {
      ctx.save(); ctx.globalAlpha = gl; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
      _bioFxRundRect(ctx, x - 2, y - 2, w + 4, h + 4, 9); ctx.stroke(); ctx.restore();
    }
    _m5jText(ctx, String(n), (a + b) / 2, y + h / 2 + 8, 22, '#1f2937');
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.MX0, K.MY0, K.MX1 - K.MX0, K.MY1 - K.MY0, 8); ctx.stroke();
}

// Fuer die Lehrkraft: beim Halt das Stueck, das gleich zerfaellt, orange
// umrandet und darunter „1 Zehner = 10 Einer“; waehrend jeder Pause oben links
// das Schild „Pause“. Alles steht still (gezeichnet aus dem eingefrorenen Zustand).
function _m5jLehrkraftBild(ctx) {
  const z = _m5j, h = z.haltInfo;
  if (h) {
    const f = z.feld[h.von], p = f[f.length - 1];
    // Beschriftung im freien Streifen ueber der Anzahlzeile (dort liegt bei
    // keiner der vier Aufgaben Material: Platten reichen links bis x = 259)
    const text = '1 ' + _m5jWORT[h.von] + ' = 10 ' + _m5jWORT[h.nach];
    const bx = 236, by = 162, bw = 174, bh = 30;
    if (p) {
      const pd = p.w < 10 ? 2.5 : 4;                         // Stangen stehen dicht: schmaler Rand
      const r0 = { x: p.x - pd, y: p.y - pd, x1: p.x + p.w + pd, y1: p.y + p.h + pd };
      ctx.save();
      // Verbindung Beschriftung -> Stueck (kuerzeste Strecke zwischen den Rechtecken)
      const kl = (v, a, b) => Math.max(a, Math.min(b, v));
      const ax = kl((r0.x + r0.x1) / 2, bx + 10, bx + bw - 10), ay = kl((r0.y + r0.y1) / 2, by, by + bh);
      const ex = kl(ax, r0.x, r0.x1), ey = kl(ay, r0.y, r0.y1);
      if (Math.abs(ax - ex) + Math.abs(ay - ey) > 3) {
        ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(251,146,60,0.30)'; ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 3;
      _bioFxRundRect(ctx, r0.x, r0.y, r0.x1 - r0.x, r0.y1 - r0.y, 4); ctx.fill(); ctx.stroke();
      ctx.restore();
      _m5jZeichneStueck(ctx, p);                            // das Stueck selbst bleibt gut zu sehen
    }
    ctx.save();
    ctx.fillStyle = '#fff7ed'; ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 2.5;
    _bioFxRundRect(ctx, bx, by, bw, bh, 8); ctx.fill(); ctx.stroke();
    let gr = 16;
    ctx.font = '700 ' + gr + 'px sans-serif';
    while (gr > 11 && ctx.measureText(text).width > bw - 14) { gr -= 1; ctx.font = '700 ' + gr + 'px sans-serif'; }
    _m5jText(ctx, text, bx + bw / 2, by + bh / 2 + gr * 0.36, gr, '#9a3412');
    ctx.restore();
  }
  if (z.steht) {                                            // Schild „Pause“, oben links auf dem Blatt
    ctx.save();
    ctx.fillStyle = '#1e293b';
    _bioFxRundRect(ctx, 8, 8, 64, 25, 6); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(14, 14.5, 3.5, 12); ctx.fillRect(20.5, 14.5, 3.5, 12);
    _m5jText(ctx, 'Pause', 28, 25.5, 13, '#ffffff', '700', 'left');
    ctx.restore();
  }
}

function _m5jDraw(ctx, cv) {
  if (!_m5j) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m5jPapier(ctx);
  _m5jMaterial(ctx);
  _m5jSprechblase(ctx);
  _bioFxDraw(ctx, _m5j.fx.teile);
  if (_m5j.steht || _m5j.haltInfo) _m5jLehrkraftBild(ctx);
}
