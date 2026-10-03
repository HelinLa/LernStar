
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mf4 „Welches Viereck ist das?“ (Kennung m5-vierecke)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL3_PROFIL.md, Abschnitt m5-vierecke.
// Ueberschrift: „Wo passt die Papierecke – und wie lang sind die Seiten?“ – die
// Frage der Einheit („Ist ein Quadrat auch ein Rechteck?“) traegt zwei Woerter,
// die nicht am Bildschirm stehen duerfen, deshalb eine neutrale Frage.
//
// Was man sieht: links ein Geobrett aus hellem Holz auf Karopapier (Kaestchen
// 0,5 cm), 9 × 9 Naegel im Abstand 1 cm (Koordinaten 0 bis 8). Ein blaues
// Gummiband ist um vier Naegel gespannt; an diesen Naegeln liegt das Band
// sichtbar um den Nagel. Wechselt die Figur, gleiten die vier Ecken des
// Bandes in 0,7 s zu den neuen Naegeln (das Band wird umgespannt).
// Rechts vier Merkfelder „Figur 1“ … „Figur 4“, je mit der Figur klein auf
// einem Mini-Brett; das Feld der gewaehlten Figur ist blau umrandet. Darunter
// eine Legende: gruener Haken „passt genau“, oranger Keil „passt nicht“.
//
// „Papierecke prüfen“: Eine weisse Papierecke (Kaestchenpapier, mit Schatten)
// gleitet nacheinander in jede Ecke der Figur (je 0,4 s) und legt sich mit
// einer Kante an die Seite zur naechsten Ecke. Sie bleibt 0,3 s liegen. Passt
// sie genau, faerben sich ihre beiden Kanten gruen; danach bleiben in der Ecke
// ein kleines gruenes Eckzeichen und aussen ein gruener Haken stehen. Passt sie
// nicht, waechst zwischen ihrer zweiten Kante und der Seite der Figur ein
// oranger Keil (bei einer spitzen Ecke steht die Papierecke ueber, bei einer
// stumpfen bleibt eine Luecke); der Keil bleibt stehen. Aus jeder Ecke fliegt
// ein kleiner Punkt (gruen mit Haken bzw. orange, 0,45 s) in die gleiche Ecke
// der kleinen Figur im Merkfeld; dort zaehlt die Zahl neben dem Haken hoch.
// Nach der vierten Ecke gleitet die Papierecke weg (0,3 s).
// „Seiten messen“: Ein gelbes Lineal mit cm-Teilung (Ziffern 0, 1, 2 …, am
// Ende „cm“) legt sich aussen an jede Seite (je 0,4 s gleiten, 0,3 s liegen);
// dann erscheint die Laenge als Schild an der Seite (z. B. „3 cm“) und bleibt.
// Die Ziffern stehen nie kopf: Laeuft eine Seite nach links, zaehlt das Lineal
// von der anderen Ecke.
// Ein Knopf waehrend einer Bewegung laesst sie sofort fertig werden; dann
// geschieht das Neue. Jede Knopffolge endet so in denselben Zahlen.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5pFigur('1'|'2'|'3'|'4')):
//     „Figur 1“ · „Figur 2“ · „Figur 3“ · „Figur 4“
//     (eine Sprungmarke loescht Haken, Keile und Laengen der grossen Figur;
//      die Merkfelder bleiben stehen)
//   „Papierecke prüfen“ (_m5pEcke()) · „Seiten messen“ (_m5pMessen()) ·
//   „neu“ (_m5pNeu(): Figur 1, nichts geprueft, Merkfelder leer)
//
// Statuszeilen (woertlich; alle laenger als 18 Zeichen, simfakten.js-Grenze;
// zwischen Zahl und „cm“ ein geschuetztes Leerzeichen):
//   _m5p-figur   „Gewählt ist Figur 2“
//   _m5p-ecken   „Papierecke: noch nicht geprüft“ → waehrend der Pruefung
//                „Papierecke wird angelegt: Ecke 2 von 4“ → sobald die vierte
//                Ecke ihr Zeichen hat „Papierecke passt in 4 Ecken.“
//                (bei Figur 4 „Papierecke passt in 0 Ecken.“)
//   _m5p-seiten  „Seitenlängen: noch nicht gemessen“ → waehrend der Messung
//                „Seitenlängen: wird gemessen …“, dann waechst die Zeile mit
//                jedem Schild: „Seitenlängen: 4 cm …“, „Seitenlängen: 4 cm,
//                2 cm …“ → am Ende „Seitenlängen: 4 cm, 2 cm, 4 cm, 2 cm“
//                (Reihenfolge: unten bzw. erste Seite, dann gegen den
//                Uhrzeigersinn – dieselbe Reihenfolge, in der das Lineal geht)
//
// Werte (Ecken in cm; jede Sprungmarke nachgerechnet mit simcheck/werte.js):
//   Figur 1  (2|3) (6|3) (6|5) (2|5)  → passt in 4 Ecken · 4 cm, 2 cm, 4 cm, 2 cm
//   Figur 2  (2|3) (5|3) (5|6) (2|6)  → passt in 4 Ecken · 3 cm, 3 cm, 3 cm, 3 cm
//   Figur 3  (4|0) (7|4) (3|7) (0|3)  → passt in 4 Ecken · 5 cm, 5 cm, 5 cm, 5 cm
//   Figur 4  (0|0) (5|0) (8|4) (3|4)  → passt in 0 Ecken · 5 cm, 5 cm, 5 cm, 5 cm
// Gerechnet wird ganzzahlig: Die Papierecke passt, wenn das Skalarprodukt der
// beiden Seiten an der Ecke 0 ist (Figur 3: 3·(−4) + 4·3 = 0; Figur 4:
// 5·3 + 0·4 = 15, Winkel 53° und 127°). Seitenlaenge = Wurzel aus dx² + dy²
// (3-4-5: Wurzel aus 25 = 5). Bild und Statuszeilen lesen nur _m5pRechne().
// Gemessen (Frames zu 16 ms, simcheck-Treiber): Figurwechsel 44 Frames; die
// Eckenzeile ist nach rund 2,8 s fertig (176 Frames), die Papierecke ist nach
// 195 Frames weg, der letzte Punkt landet im Merkfeld nach 204 Frames; die
// Laengenzeile ist nach 176 Frames fertig, das Lineal nach 195 weg.
// simfakten.js faehrt die Sprungmarken als Wahlgruppe (_m5pFigur('…')) und
// laesst danach jeden Aktionsknopf auslaufen – jeder Endwert steht im Dump.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): Landet bei Figur 2 der vierte
// gruene Punkt im Merkfeld (vier Haken wie bei Figur 1), laeuft ein goldener
// Lichtring um die Figur und um das Merkfeld 2, das Band leuchtet 2,5 s golden
// nach. Ist Figur 1 schon geprueft und hat ebenfalls vier Haken, laeuft ein
// zweiter Ring um Merkfeld 1 und es leuchtet mit. Das widerlegt „Ein Quadrat
// ist nie ein Rechteck“: dieselben vier Haken wie bei der langen Figur.
//
// NICHT am Bildschirm (sim_plan.nicht_am_bildschirm): „Rechteck“, „Quadrat“,
// „Raute“, „rechte“, „rechter Winkel“, „gleich lang“ – und keine Regel als
// Satz. Die Figuren heissen nur „Figur 1“ bis „Figur 4“. Keine Namen, keine
// Punkte, keine Zeit. Deterministisch, ohne Zufall.
// ════════════════════════════════════════════════════════════════════════
let _m5p = null;
const _m5pFIGUREN = {                       // Ecken in cm (x|y), gegen den Uhrzeigersinn
  '1': [[2, 3], [6, 3], [6, 5], [2, 5]],    // 4 cm lang, 2 cm hoch
  '2': [[2, 3], [5, 3], [5, 6], [2, 6]],    // 3 cm, 3 cm
  '3': [[4, 0], [7, 4], [3, 7], [0, 3]],    // gedreht, Seiten 5 cm
  '4': [[0, 0], [5, 0], [8, 4], [3, 4]]     // Seiten 5 cm, schief
};
const _m5pREIHE = ['1', '2', '3', '4'];
const _m5pK = {
  S: 24,                        // px je cm (Nagelabstand)
  X0: 26, Y0: 214,              // Bildpunkt des Nagels (0|0); y waechst nach oben
  N: 8,                         // Brett von 0 bis 8 cm: 9 × 9 Naegel
  BX: 12, BY: 8, BW: 220, BH: 220,          // Holzbrett
  R_PAPIER: 46,                 // Kantenlaenge der Papierecke (px)
  R_KEIL: 28,                   // Radius des orangen Keils
  B_LINEAL: 18,                 // Breite des Lineals
  T_ZUG: 0.7,                   // s: Band wird umgespannt
  T_GLEIT: 0.4,                 // s: Papierecke / Lineal gleitet zur naechsten Stelle
  T_LIEG: 0.3,                  // s: liegt an, dann das Ergebnis
  T_WEG: 0.3,                   // s: gleitet weg
  T_FLUG: 0.45,                 // s: Punkt fliegt ins Merkfeld
  T_POP: 0.35,                  // s: Zeichen springt auf
  LEUCHT: 2.5,                  // s: Nachleuchten beim Aha
  ZX: [246, 334], ZY: [8, 110], ZW: 80, ZH: 94,   // Merkfelder (2 × 2)
  MINI: 6,                      // px je cm im Merkfeld
  F_BAND: '#2563eb', F_BAND_D: '#1e3a8a',
  F_JA: '#16a34a', F_JA_D: '#15803d',
  F_NEIN: '#ea580c', F_NEIN_D: '#c2410c',
  F_GOLD: '#f59e0b',
  F_HOLZ: '#f3e2bf', F_HOLZ_R: '#c8a46a',
  F_NAGEL: '#475569',
  F_LINEAL: '#fef3c7', F_LINEAL_R: '#b45309', F_LINEAL_T: '#78350f',
  F_KARO: '#e2ecf7'
};

// Bildpunkt eines Nagels (x|y in cm)
function _m5pPx(c) { const K = _m5pK; return [K.X0 + c[0] * K.S, K.Y0 - c[1] * K.S]; }
function _m5pRichtung(a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  return [dx / l, dy / l];
}
// Laenge in cm als Text: „5 cm“ (Komma, falls je noetig; sp = Leerzeichen)
function _m5pCm(l, sp) {
  const r = Math.round(l * 10) / 10;
  return String(r).replace('.', ',') + (sp || ' ') + 'cm';
}
// Die ganze Rechnung einer Figur – Bild und Statuszeilen lesen nur hier.
function _m5pRechne(k) {
  const P = _m5pFIGUREN[k];
  const ecken = P.map((v, i) => {
    const nach = P[(i + 1) % 4], vor = P[(i + 3) % 4];
    const ax = nach[0] - v[0], ay = nach[1] - v[1], bx = vor[0] - v[0], by = vor[1] - v[1];
    return ax * bx + ay * by === 0;           // ganzzahlig: 0 heisst, die Papierecke passt
  });
  const seiten = P.map((v, i) => { const n = P[(i + 1) % 4]; return Math.hypot(n[0] - v[0], n[1] - v[1]); });
  return { ecken, passt: ecken.filter(Boolean).length, seiten };
}

function _m5pInit() {
  _m5p = { fig: '1', pos: _m5pFIGUREN['1'].map(c => c.slice()), zug: null,
           pruef: null, marken: [null, null, null, null], pop: [0, 0, 0, 0],
           mess: null, laengen: [null, null, null, null], lpop: [0, 0, 0, 0],
           flug: [], merk: { '1': null, '2': null, '3': null, '4': null },
           glanz: { '1': 0, '2': 0, '3': 0, '4': 0 }, leucht: 0, blink: 0,
           t: 0, fx: { teile: [] } };
}
function _m5pHTML() {
  const marke = k => `<button class="sim-btn" id="_m5p-b-${k}" onclick="_m5pFigur('${k}')">Figur ${k}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wo passt die Papierecke – und wie lang sind die Seiten?</h3>
    <div class="fpm-note" style="margin-top:2px">Auf dem Geobrett ist ein Gummiband um vier Nägel gespannt. Von Nagel zu Nagel sind es 1&nbsp;cm.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5p-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5pREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_m5pEcke()">Papierecke prüfen</button>
          <button class="sim-btn" onclick="_m5pMessen()">Seiten messen</button>
          <button class="sim-btn" onclick="_m5pNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5p-figur" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5p-ecken" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5p-seiten" style="margin-top:6px"></div>
        <div class="fpm-note" style="margin-top:10px">„Papierecke prüfen“ legt die Ecke eines Blatts nacheinander in jede Ecke der Figur. „Seiten messen“ legt ein Lineal an jede Seite.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Figur 1 auf dem Geobrett, noch nichts geprüft und nichts gemessen</p>
  </div>`;
}
function _m5pZeile(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}
function _m5pStatus() {
  if (!_m5p) return;
  const z = _m5p, K = _m5pK, nb = ' ';
  const b = (s, f) => '<b style="color:' + f + '">' + s + '</b>';
  _m5pZeile('_m5p-figur', 'Gewählt ist Figur ' + b(z.fig, K.F_BAND));
  // Ecken: erst wenn alle vier Zeichen stehen, steht die Zahl da.
  let ecken;
  if (z.marken.every(m => m !== null)) {
    const n = z.marken.filter(m => m === true).length;
    ecken = 'Papierecke passt in ' + b(String(n), n > 0 ? K.F_JA_D : K.F_NEIN_D) + (n === 1 ? ' Ecke.' : ' Ecken.');
  } else if (z.pruef) {
    ecken = 'Papierecke wird angelegt: Ecke ' + (z.pruef.i + 1) + ' von 4';
  } else {
    ecken = 'Papierecke: noch nicht geprüft';
  }
  _m5pZeile('_m5p-ecken', ecken);
  // Seiten: die Zeile waechst mit jedem Schild.
  const da = z.laengen.filter(l => l !== null).map(l => b(_m5pCm(l, nb), K.F_BAND_D));
  let seiten;
  if (da.length === 4) seiten = 'Seitenlängen: ' + da.join(', ');
  else if (z.mess) seiten = 'Seitenlängen: ' + (da.length ? da.join(', ') + ' …' : 'wird gemessen …');
  else seiten = 'Seitenlängen: noch nicht gemessen';
  _m5pZeile('_m5p-seiten', seiten);
  for (const k of _m5pREIHE) {
    const e = document.getElementById('_m5p-b-' + k);
    if (e && e.classList) e.classList.toggle('primary', k === z.fig);
  }
}

// ── Lagen: Papierecke und Lineal ────────────────────────────────────────
// Papierecke an Ecke i: Spitze im Nagel, erste Kante entlang der Seite zur
// naechsten Ecke, zweite Kante 90° dazu ins Innere der Figur.
function _m5pEckLage(i) {
  const p = _m5p.pos, V = _m5pPx(p[i]), N = _m5pPx(p[(i + 1) % 4]);
  const u = _m5pRichtung(V, N);
  return { x: V[0], y: V[1], a: Math.atan2(u[1], u[0]), l: 0 };
}
// Lineal an Seite j: von Ecke j zu Ecke j+1, aussen an der Seite.
function _m5pSeitLage(j) {
  const p = _m5p.pos, A = _m5pPx(p[j]), B = _m5pPx(p[(j + 1) % 4]);
  const d = _m5pRichtung(A, B);
  return { x: A[0], y: A[1], a: Math.atan2(d[1], d[0]), l: Math.hypot(B[0] - A[0], B[1] - A[1]) };
}
function _m5pVersetzt(L, dx, dy) { return { x: L.x + dx, y: L.y + dy, a: L.a, l: L.l }; }
function _m5pMischLage(a, b, u) {
  let d = b.a - a.a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d <= -Math.PI) d += 2 * Math.PI;
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, a: a.a + d * u, l: a.l + (b.l - a.l) * u };
}
// Wo die Papierecke gerade liegt und wie deutlich sie zu sehen ist.
function _m5pPapierJetzt() {
  const z = _m5p, s = z.pruef, K = _m5pK;
  if (!s) return null;
  const e = _bioFxEase.sanft(Math.min(1, s.t / (s.phase === 'weg' ? K.T_WEG : K.T_GLEIT)));
  if (s.phase === 'gleiten') return { L: _m5pMischLage(s.von, _m5pEckLage(s.i), e), alpha: s.i === 0 ? e : 1 };
  if (s.phase === 'liegen') return { L: _m5pEckLage(s.i), alpha: 1 };
  const L0 = _m5pEckLage(3);
  return { L: _m5pMischLage(L0, _m5pVersetzt(L0, 40, -40), e), alpha: 1 - e };
}
function _m5pLinealJetzt() {
  const z = _m5p, s = z.mess, K = _m5pK;
  if (!s) return null;
  const e = _bioFxEase.sanft(Math.min(1, s.t / (s.phase === 'weg' ? K.T_WEG : K.T_GLEIT)));
  if (s.phase === 'gleiten') return { L: _m5pMischLage(s.von, _m5pSeitLage(s.j), e), alpha: s.j === 0 ? e : 1, ziffern: 0 };
  if (s.phase === 'liegen') return { L: _m5pSeitLage(s.j), alpha: 1, ziffern: Math.min(1, s.t / 0.12) };
  const L0 = _m5pSeitLage(3), n = [-Math.sin(L0.a), Math.cos(L0.a)];
  return { L: _m5pMischLage(L0, _m5pVersetzt(L0, n[0] * 26, n[1] * 26), e), alpha: 1 - e, ziffern: 1 - e };
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Ecke i ist geprueft: Zeichen setzen, Punkt ins Merkfeld schicken.
function _m5pMarke(i, fliegen) {
  const z = _m5p, K = _m5pK, ja = _m5pRechne(z.fig).ecken[i];
  z.marken[i] = ja; z.pop[i] = K.T_POP;
  if (!z.merk[z.fig]) z.merk[z.fig] = [null, null, null, null];
  if (fliegen) z.flug.push({ k: z.fig, i, ja, t: 0, von: _m5pMarkenOrt(i, ja) });
  else z.merk[z.fig][i] = ja;
}
// Ein Punkt ist im Merkfeld gelandet.
function _m5pLande(f, mitAha) {
  const z = _m5p, K = _m5pK;
  if (!z.merk[f.k]) z.merk[f.k] = [null, null, null, null];
  z.merk[f.k][f.i] = f.ja;
  const m = z.merk[f.k];
  if (!mitAha || f.k !== '2' || !m.every(x => x === true)) return;
  // Aha: vier Haken bei Figur 2 – wie bei Figur 1
  const pts = z.pos.map(_m5pPx);
  const cx = pts.reduce((s, p) => s + p[0], 0) / 4, cy = pts.reduce((s, p) => s + p[1], 0) / 4;
  _bioFxWelle(z.fx.teile, cx, cy, K.F_GOLD, 78);
  const zf = _m5pFeld('2');
  _bioFxWelle(z.fx.teile, zf.x + K.ZW / 2, zf.y + K.ZH / 2, K.F_GOLD, 56);
  z.glanz['2'] = K.LEUCHT; z.leucht = K.LEUCHT;
  const m1 = z.merk['1'];
  if (m1 && m1.every(x => x === true)) {
    const z1 = _m5pFeld('1');
    _bioFxWelle(z.fx.teile, z1.x + K.ZW / 2, z1.y + K.ZH / 2, K.F_GOLD, 56);
    z.glanz['1'] = K.LEUCHT;
  }
}
// Alles Laufende sofort fertig werden lassen (vor jeder neuen Bedienung).
function _m5pFertig() {
  const z = _m5p;
  if (z.zug) { z.pos = z.zug.nach.map(c => c.slice()); z.zug = null; }
  for (const f of z.flug) _m5pLande(f, false);
  z.flug = [];
  if (z.pruef) {
    if (z.pruef.phase !== 'weg') for (let i = z.pruef.i; i < 4; i++) _m5pMarke(i, false);
    z.pruef = null;
  }
  if (z.mess) {
    const r = _m5pRechne(z.fig);
    if (z.mess.phase !== 'weg') for (let j = z.mess.j; j < 4; j++) z.laengen[j] = r.seiten[j];
    z.mess = null;
  }
  _m5pStatus();
}
function _m5pFigur(k) {
  if (!_m5p || !_m5pFIGUREN[k]) return;
  _m5pFertig();
  const z = _m5p;
  z.zug = { von: z.pos.map(c => c.slice()), nach: _m5pFIGUREN[k].map(c => c.slice()), t: 0 };
  if (k === z.fig) z.blink = 0.4;
  z.fig = k;
  z.marken = [null, null, null, null]; z.laengen = [null, null, null, null];
  z.leucht = 0;
  _m5pStatus();
}
function _m5pEcke() {
  if (!_m5p) return;
  _m5pFertig();
  const z = _m5p;
  z.marken = [null, null, null, null];
  z.merk[z.fig] = [null, null, null, null];
  z.glanz[z.fig] = 0; z.leucht = 0;
  z.pruef = { i: 0, phase: 'gleiten', t: 0, von: _m5pVersetzt(_m5pEckLage(0), 46, -46) };
  _m5pStatus();
}
function _m5pMessen() {
  if (!_m5p) return;
  _m5pFertig();
  const z = _m5p, L0 = _m5pSeitLage(0), n = [-Math.sin(L0.a), Math.cos(L0.a)];
  z.laengen = [null, null, null, null];
  z.mess = { j: 0, phase: 'gleiten', t: 0, von: _m5pVersetzt(L0, n[0] * 26, n[1] * 26) };
  _m5pStatus();
}
function _m5pNeu() {
  if (!_m5p) return;
  _m5pFertig();
  const z = _m5p;
  z.merk = { '1': null, '2': null, '3': null, '4': null };
  z.glanz = { '1': 0, '2': 0, '3': 0, '4': 0 };
  _m5pFigur('1');
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5pUpdate(dt) {
  if (!_m5p) return;
  dt = _bioFxDt(dt);
  const z = _m5p, K = _m5pK;
  z.t += dt;
  let neu = false;
  if (z.zug) {
    const g = z.zug;
    g.t += dt;
    const e = _bioFxEase.sanft(Math.min(1, g.t / K.T_ZUG));
    z.pos = g.von.map((c, i) => [c[0] + (g.nach[i][0] - c[0]) * e, c[1] + (g.nach[i][1] - c[1]) * e]);
    if (g.t >= K.T_ZUG) { z.pos = g.nach.map(c => c.slice()); z.zug = null; }
  }
  const s = z.pruef;
  if (s) {
    s.t += dt;
    if (s.phase === 'gleiten' && s.t >= K.T_GLEIT) { s.phase = 'liegen'; s.t = 0; }
    else if (s.phase === 'liegen' && s.t >= K.T_LIEG) {
      _m5pMarke(s.i, true); neu = true;
      if (s.i < 3) { s.von = _m5pEckLage(s.i); s.i += 1; s.phase = 'gleiten'; s.t = 0; }
      else { s.phase = 'weg'; s.t = 0; }
    } else if (s.phase === 'weg' && s.t >= K.T_WEG) { z.pruef = null; neu = true; }
  }
  const m = z.mess;
  if (m) {
    m.t += dt;
    if (m.phase === 'gleiten' && m.t >= K.T_GLEIT) { m.phase = 'liegen'; m.t = 0; }
    else if (m.phase === 'liegen' && m.t >= K.T_LIEG) {
      z.laengen[m.j] = _m5pRechne(z.fig).seiten[m.j]; z.lpop[m.j] = K.T_POP; neu = true;
      if (m.j < 3) { m.von = _m5pSeitLage(m.j); m.j += 1; m.phase = 'gleiten'; m.t = 0; }
      else { m.phase = 'weg'; m.t = 0; }
    } else if (m.phase === 'weg' && m.t >= K.T_WEG) { z.mess = null; neu = true; }
  }
  for (let n = z.flug.length - 1; n >= 0; n--) {
    const f = z.flug[n];
    f.t += dt;
    if (f.t >= K.T_FLUG) { z.flug.splice(n, 1); _m5pLande(f, true); }
  }
  for (let i = 0; i < 4; i++) {
    z.pop[i] = Math.max(0, z.pop[i] - dt);
    z.lpop[i] = Math.max(0, z.lpop[i] - dt);
  }
  for (const k of _m5pREIHE) z.glanz[k] = Math.max(0, z.glanz[k] - dt);
  z.leucht = Math.max(0, z.leucht - dt);
  z.blink = Math.max(0, z.blink - dt);
  _bioFxUpdate(z.fx.teile, dt);
  if (neu) _m5pStatus();
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5pVieleck(ctx, pts) {
  ctx.beginPath();
  pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); });
  ctx.closePath();
}
function _m5pText(ctx, s, x, y, ausr, farbe, groesse, gew) {
  ctx.fillStyle = farbe || '#1f2937';
  ctx.font = (gew || '700') + ' ' + (groesse || 13) + 'px sans-serif';
  ctx.textAlign = ausr || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Merkfeld der Figur k: linke obere Ecke
function _m5pFeld(k) {
  const K = _m5pK, i = _m5pREIHE.indexOf(k);
  return { x: K.ZX[i % 2], y: K.ZY[Math.floor(i / 2)] };
}
// Ecke c (cm) der kleinen Figur im Merkfeld k
function _m5pMiniPx(k, c) {
  const K = _m5pK, f = _m5pFeld(k), mx = f.x + (K.ZW - 8 * K.MINI) / 2, my = f.y + 22;
  return [mx + c[0] * K.MINI, my + 8 * K.MINI - c[1] * K.MINI];
}
// Richtungen an Ecke i der grossen Figur (Bildpunkte): u zur naechsten Ecke,
// p zur vorigen, w = u um 90° ins Innere gedreht.
function _m5pAnEcke(i) {
  const p = _m5p.pos, V = _m5pPx(p[i]);
  const u = _m5pRichtung(V, _m5pPx(p[(i + 1) % 4])), q = _m5pRichtung(V, _m5pPx(p[(i + 3) % 4]));
  return { V, u, p: q, w: [u[1], -u[0]] };
}
// Wo das Zeichen einer Ecke steht (Haken aussen, Keil in der Ecke).
function _m5pMarkenOrt(i, ja) {
  const E = _m5pAnEcke(i), K = _m5pK;
  if (ja) {
    const o = [-(E.u[0] + E.p[0]), -(E.u[1] + E.p[1])], l = Math.hypot(o[0], o[1]) || 1;
    // nie ueber den Rand der Leinwand (Figur 3: die Ecke (0|3) liegt am Brettrand)
    return [Math.max(12, E.V[0] + o[0] / l * 17), Math.max(12, E.V[1] + o[1] / l * 17)];
  }
  const m = [E.w[0] + E.p[0], E.w[1] + E.p[1]], l = Math.hypot(m[0], m[1]) || 1;
  return [E.V[0] + m[0] / l * K.R_KEIL * 0.6, E.V[1] + m[1] / l * K.R_KEIL * 0.6];
}
function _m5pHaken(ctx, x, y, r, sk, alpha) {
  const K = _m5pK;
  ctx.save();
  ctx.globalAlpha = alpha == null ? 1 : alpha;
  ctx.translate(x, y); ctx.scale(sk, sk);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.F_JA; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = K.F_JA_D; ctx.lineWidth = Math.max(2, r * 0.28); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-r * 0.45, r * 0.02); ctx.lineTo(-r * 0.1, r * 0.38); ctx.lineTo(r * 0.5, -r * 0.36);
  ctx.stroke();
  ctx.restore();
}
// Der orange Keil an Ecke i: zwischen der zweiten Kante der Papierecke (w)
// und der Seite der Figur (p).
function _m5pKeil(ctx, i, r, alpha) {
  const E = _m5pAnEcke(i), K = _m5pK;
  const aw = Math.atan2(E.w[1], E.w[0]), ap = Math.atan2(E.p[1], E.p[0]);
  let d = ap - aw;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d <= -Math.PI) d += 2 * Math.PI;
  if (Math.abs(d) < 1e-6) return;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(E.V[0], E.V[1]);
  ctx.arc(E.V[0], E.V[1], r, aw, aw + d, d < 0);
  ctx.closePath();
  ctx.globalAlpha = 0.42 * alpha; ctx.fillStyle = K.F_NEIN; ctx.fill();
  ctx.globalAlpha = alpha; ctx.strokeStyle = K.F_NEIN_D; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}
// Kleines Eckzeichen in einer Ecke, in die die Papierecke genau passt.
function _m5pEckZeichen(ctx, i, sk) {
  const E = _m5pAnEcke(i), K = _m5pK, s = 10 * sk;
  ctx.save();
  ctx.strokeStyle = K.F_JA; ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(E.V[0] + E.u[0] * s, E.V[1] + E.u[1] * s);
  ctx.lineTo(E.V[0] + (E.u[0] + E.w[0]) * s, E.V[1] + (E.u[1] + E.w[1]) * s);
  ctx.lineTo(E.V[0] + E.w[0] * s, E.V[1] + E.w[1] * s);
  ctx.stroke();
  ctx.restore();
}
function _m5pPapier(ctx, L, alpha, gruen) {
  const K = _m5pK, R = K.R_PAPIER;
  const u = [Math.cos(L.a), Math.sin(L.a)], w = [u[1], -u[0]];
  const P = (a, b) => [L.x + a * u[0] + b * w[0], L.y + a * u[1] + b * w[1]];
  const ecken = [P(0, 0), P(R, 0), P(R, R), P(0, R)];
  ctx.save();
  ctx.globalAlpha = 0.18 * alpha;                           // Schatten
  ctx.fillStyle = '#0f172a';
  _m5pVieleck(ctx, ecken.map(p => [p[0] + 2, p[1] + 3])); ctx.fill();
  ctx.globalAlpha = 0.93 * alpha;
  ctx.fillStyle = '#ffffff';
  _m5pVieleck(ctx, ecken); ctx.fill();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#cfe0f5'; ctx.lineWidth = 1;          // Kaestchen
  for (const s of [R / 3, 2 * R / 3]) {
    let a = P(s, 0), b = P(s, R);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    a = P(0, s); b = P(R, s);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  // Rand: gruen, sobald feststeht, dass die Ecke genau passt
  ctx.strokeStyle = gruen > 0 ? K.F_JA : '#94a3b8'; ctx.lineWidth = gruen > 0 ? 1.2 + 1.8 * gruen : 1.2;
  _m5pVieleck(ctx, ecken); ctx.stroke();
  // die beiden Kanten an der Spitze – gruen, wenn die Ecke genau passt
  ctx.strokeStyle = gruen > 0 ? K.F_JA : '#475569'; ctx.lineWidth = 2.5 + 1.5 * (gruen || 0);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const a = P(R, 0), c = P(0, R);
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(L.x, L.y); ctx.lineTo(c[0], c[1]); ctx.stroke();
  ctx.restore();
}
function _m5pLineal(ctx, L, alpha, ziffern) {
  const K = _m5pK, B = K.B_LINEAL, hS = K.S / 2;
  const d = [Math.cos(L.a), Math.sin(L.a)], n = [-d[1], d[0]];      // n zeigt nach aussen
  // Ziffern nie kopf: laeuft die Seite nach links (oder senkrecht nach unten),
  // zaehlt das Lineal von der anderen Ecke.
  const kipp = d[0] < -1e-6 || (Math.abs(d[0]) <= 1e-6 && d[1] > 0);
  const e0 = kipp ? 26 : 6, e1 = kipp ? 6 : 26;
  const Q = (s, o) => [L.x + s * d[0] + o * n[0], L.y + s * d[1] + o * n[1]];
  ctx.save();
  ctx.globalAlpha = 0.16 * alpha;                           // Schatten
  ctx.fillStyle = '#0f172a';
  _m5pVieleck(ctx, [Q(-e0, 2), Q(L.l + e1, 2), Q(L.l + e1, 2 + B), Q(-e0, 2 + B)].map(p => [p[0] + 2, p[1] + 3]));
  ctx.fill();
  ctx.globalAlpha = 0.96 * alpha;
  ctx.fillStyle = K.F_LINEAL;
  _m5pVieleck(ctx, [Q(-e0, 2), Q(L.l + e1, 2), Q(L.l + e1, 2 + B), Q(-e0, 2 + B)]); ctx.fill();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = K.F_LINEAL_R; ctx.lineWidth = 1.5; ctx.stroke();
  // Teilung: alle 0,5 cm ein Strich, jeder volle cm laenger
  const n2 = Math.floor(L.l / hS + 1e-6);
  ctx.strokeStyle = K.F_LINEAL_T; ctx.lineWidth = 1.2;
  for (let k = 0; k <= n2; k++) {
    const s = kipp ? L.l - k * hS : k * hS, lang = k % 2 === 0 ? 7 : 4;
    const a = Q(s, 2), b = Q(s, 2 + lang);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  if (ziffern > 0.01) {
    const wl = kipp ? L.a + Math.PI : L.a;
    ctx.globalAlpha = alpha * ziffern;
    ctx.fillStyle = K.F_LINEAL_T;
    ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const zeige = (txt, s) => {
      const p = Q(s, 2 + 12.5);
      ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(wl); ctx.fillText(txt, 0, 0); ctx.restore();
    };
    for (let k = 0; k <= n2; k += 2) zeige(String(k / 2), kipp ? L.l - k * hS : k * hS);
    zeige('cm', kipp ? -15 : L.l + 15);
  }
  ctx.restore();
}
// Schild mit der Laenge an Seite j, aussen neben der Seite.
function _m5pSchild(ctx, j, text, sk) {
  const K = _m5pK, p = _m5p.pos, A = _m5pPx(p[j]), Bp = _m5pPx(p[(j + 1) % 4]);
  const d = _m5pRichtung(A, Bp), n = [-d[1], d[0]];
  ctx.save();
  ctx.font = '700 14px sans-serif';
  const pw = ctx.measureText(text).width + 14, ph = 21;
  const off = 3 + Math.abs(n[0]) * pw / 2 + Math.abs(n[1]) * ph / 2;
  const mx = (A[0] + Bp[0]) / 2 + n[0] * off, my = (A[1] + Bp[1]) / 2 + n[1] * off;
  ctx.translate(mx, my); ctx.scale(sk, sk);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.F_BAND; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, -pw / 2, -ph / 2, pw, ph, 8); ctx.fill(); ctx.stroke();
  _m5pText(ctx, text, 0, 5, 'center', K.F_BAND_D, 14);
  ctx.restore();
}
function _m5pBrett(ctx) {
  const K = _m5pK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.12)';
  _bioFxRundRect(ctx, K.BX + 2, K.BY + 3, K.BW, K.BH, 10); ctx.fill();
  ctx.fillStyle = K.F_HOLZ;
  _bioFxRundRect(ctx, K.BX, K.BY, K.BW, K.BH, 10); ctx.fill();
  ctx.strokeStyle = K.F_HOLZ_R; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, K.BX, K.BY, K.BW, K.BH, 10); ctx.stroke();
  for (let x = 0; x <= K.N; x++) {
    for (let y = 0; y <= K.N; y++) {
      const p = _m5pPx([x, y]);
      ctx.fillStyle = K.F_NAGEL;
      ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.arc(p[0] - 1, p[1] - 1, 1.1, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}
function _m5pBand(ctx) {
  const z = _m5p, K = _m5pK, pts = z.pos.map(_m5pPx);
  ctx.save();
  if (z.leucht > 0) {                                       // Aha: das Band leuchtet nach
    const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
    ctx.globalAlpha = Math.min(1, z.leucht / 0.8) * (0.35 + 0.3 * puls);
    ctx.strokeStyle = K.F_GOLD; ctx.lineWidth = 14; ctx.lineJoin = 'round';
    _m5pVieleck(ctx, pts); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  if (z.blink > 0) {
    ctx.globalAlpha = z.blink / 0.4 * 0.5;
    ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 10; ctx.lineJoin = 'round';
    _m5pVieleck(ctx, pts); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = K.F_BAND; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  _m5pVieleck(ctx, pts); ctx.stroke();
  for (const p of pts) {                                    // das Band liegt um den Nagel
    ctx.fillStyle = K.F_BAND;
    ctx.beginPath(); ctx.arc(p[0], p[1], 5.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(p[0], p[1], 2.8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
function _m5pMerkfelder(ctx) {
  const z = _m5p, K = _m5pK;
  for (const k of _m5pREIHE) {
    const f = _m5pFeld(k), aktiv = k === z.fig;
    ctx.save();
    if (z.glanz[k] > 0) {                                   // Aha: das Feld leuchtet nach
      const puls = 0.5 + 0.5 * Math.sin(z.t * Math.PI * 2 * 0.8);
      ctx.globalAlpha = Math.min(1, z.glanz[k] / 0.8) * (0.45 + 0.4 * puls);
      ctx.strokeStyle = K.F_GOLD; ctx.lineWidth = 6;
      _bioFxRundRect(ctx, f.x - 3, f.y - 3, K.ZW + 6, K.ZH + 6, 11); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = aktiv ? '#eff6ff' : '#ffffff';
    _bioFxRundRect(ctx, f.x, f.y, K.ZW, K.ZH, 9); ctx.fill();
    ctx.strokeStyle = aktiv ? K.F_BAND : '#cbd5e1'; ctx.lineWidth = aktiv ? 2.5 : 1.2;
    _bioFxRundRect(ctx, f.x, f.y, K.ZW, K.ZH, 9); ctx.stroke();
    _m5pText(ctx, 'Figur ' + k, f.x + K.ZW / 2, f.y + 16, 'center', aktiv ? K.F_BAND_D : '#334155', 13);
    // Mini-Brett mit der Figur
    const m0 = _m5pMiniPx(k, [0, 8]), mb = 8 * K.MINI;
    ctx.fillStyle = K.F_HOLZ;
    _bioFxRundRect(ctx, m0[0] - 3, m0[1] - 3, mb + 6, mb + 6, 4); ctx.fill();
    ctx.strokeStyle = K.F_HOLZ_R; ctx.lineWidth = 1;
    _bioFxRundRect(ctx, m0[0] - 3, m0[1] - 3, mb + 6, mb + 6, 4); ctx.stroke();
    const mp = _m5pFIGUREN[k].map(c => _m5pMiniPx(k, c));
    ctx.strokeStyle = K.F_BAND; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    _m5pVieleck(ctx, mp); ctx.stroke();
    const m = z.merk[k];
    if (m) {
      m.forEach((ja, i) => {
        if (ja === null) return;
        ctx.fillStyle = ja ? K.F_JA : K.F_NEIN; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(mp[i][0], mp[i][1], 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      if (m.some(x => x !== null)) {
        const n = m.filter(x => x === true).length;
        _m5pHaken(ctx, f.x + K.ZW / 2 - 9, f.y + K.ZH - 11, 8, 1);
        _m5pText(ctx, String(n), f.x + K.ZW / 2 + 5, f.y + K.ZH - 5.5, 'left', '#14532d', 16);
      }
    }
    ctx.restore();
  }
  // Legende
  _m5pHaken(ctx, 256, 222, 7.5, 1);
  _m5pText(ctx, 'passt genau', 269, 227, 'left', '#334155', 12, '600');
  ctx.save();
  ctx.beginPath(); ctx.moveTo(250, 246); ctx.arc(250, 246, 14, -Math.PI * 0.5, -Math.PI * 0.27, false); ctx.closePath();
  ctx.globalAlpha = 0.42; ctx.fillStyle = K.F_NEIN; ctx.fill();
  ctx.globalAlpha = 1; ctx.strokeStyle = K.F_NEIN_D; ctx.lineWidth = 1.8; ctx.stroke();
  ctx.restore();
  _m5pText(ctx, 'passt nicht', 269, 245, 'left', '#334155', 12, '600');
}
function _m5pDraw(ctx, cv) {
  if (!_m5p) return;
  const W = cv.width, H = cv.height, z = _m5p, K = _m5pK;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.save();                                               // Karopapier, 0,5 cm
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  for (let x = K.X0 % 12; x <= W; x += 12) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = K.Y0 % 12; y <= H; y += 12) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
  _m5pBrett(ctx);
  // Papierecke (unter dem Band: das Band liegt sichtbar an ihren Kanten)
  const pa = _m5pPapierJetzt(), s = z.pruef;
  let gruen = 0, keil = -1, keilA = 0;
  if (s && s.phase === 'liegen') {
    const ja = _m5pRechne(z.fig).ecken[s.i], a = Math.min(1, s.t / 0.15);
    if (ja) gruen = a; else { keil = s.i; keilA = a; }
  }
  if (pa) _m5pPapier(ctx, pa.L, pa.alpha, gruen);
  // Keile: die stehen gebliebenen und der, der gerade waechst
  z.marken.forEach((ja, i) => { if (ja === false) _m5pKeil(ctx, i, K.R_KEIL, 1); });
  if (keil >= 0) _m5pKeil(ctx, keil, K.R_KEIL, keilA);
  _bioFxDraw(ctx, z.fx.teile);                              // Lichtring hinter dem Band
  _m5pBand(ctx);
  // Zeichen der passenden Ecken
  z.marken.forEach((ja, i) => {
    if (ja !== true) return;
    const sk = z.pop[i] > 0 ? _bioFxEase.federn(1 - z.pop[i] / K.T_POP) : 1;
    _m5pEckZeichen(ctx, i, Math.max(0.05, sk));
    const o = _m5pMarkenOrt(i, true);
    _m5pHaken(ctx, o[0], o[1], 9, Math.max(0.05, sk));
  });
  // Lineal und Schilder
  const li = _m5pLinealJetzt();
  if (li) _m5pLineal(ctx, li.L, li.alpha, li.ziffern);
  z.laengen.forEach((l, j) => {
    if (l === null) return;
    const sk = z.lpop[j] > 0 ? _bioFxEase.federn(1 - z.lpop[j] / K.T_POP) : 1;
    _m5pSchild(ctx, j, _m5pCm(l), Math.max(0.05, sk));
  });
  _m5pMerkfelder(ctx);
  // fliegende Punkte: von der Ecke in die kleine Figur
  for (const f of z.flug) {
    const u = _bioFxEase.sanft(Math.min(1, f.t / K.T_FLUG));
    const ziel = _m5pMiniPx(f.k, _m5pFIGUREN[f.k][f.i]);
    const c = [(f.von[0] + ziel[0]) / 2, Math.min(f.von[1], ziel[1]) - 40];
    const x = (1 - u) * (1 - u) * f.von[0] + 2 * (1 - u) * u * c[0] + u * u * ziel[0];
    const y = (1 - u) * (1 - u) * f.von[1] + 2 * (1 - u) * u * c[1] + u * u * ziel[1];
    if (f.ja) _m5pHaken(ctx, x, y, 7 - 2 * u, 1);
    else {
      ctx.save();
      ctx.fillStyle = K.F_NEIN; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 6 - 1.5 * u, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }
}
