
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mg5 „2 € 40 ct zurück?“ (Kennung m5-geld, Praefix _m6k)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL6_PROFIL.md, Abschnitte mg5 und m5-geld.
// Ueberschrift = Frage der Einheit: „Wie viel Rückgeld gibt es?“
//
// WAS MAN SIEHT (Leinwand 420 x 250, eine Kiosktheke von oben):
//   - Oben ein Papierstreifen mit dem RECHENSTRICH (wie m5-rechenstrich, ohne
//     Skala): eine Linie, Punkte nur am Preis, am naechsten vollen Euro und bei
//     5 €, jeder mit einem Faehnchen darunter („3,40 €“, „4 €“, „5 €“). Ueber
//     der Linie waechst ein ORANGER Bogen vom Preis bis zum vollen Euro
//     („+ 60 ct“) und ein BLAUER Bogen vom vollen Euro bis 5 € („+ 1 €“).
//     Der Strich hat keine Skala. Die Euro-Spruenge sind massstaeblich; ein
//     kurzer Cent-Sprung wird auf mindestens 34 px gedehnt (_m6kK.CMIN), damit
//     Bogen, Spitze und beide Punkte zu sehen sind – bei „Preis 1,90 €“ waeren
//     10 ct sonst nur 10 px breit. Er bleibt sichtbar der kleine Sprung. Das
//     Fenster richtet sich nach dem Preis und gleitet bei jedem Wechsel weich
//     (0,5 s), Zahlen stehen nur an den drei Punkten.
//   - Unten links das Preisschild: der Preis gross mit Komma („3,40 €“ –
//     Euro-Ziffern blau, Cent-Ziffern orange), darunter klein „3 € 40 ct“ in
//     denselben Farben. Darunter der bezahlte 5-Euro-Schein.
//   - Unten in der Mitte der Rueckgeld-Teller mit zwei Feldern: oben ein
//     oranges Feld fuer die 10-ct-Muenzen (Fuenferreihen), unten ein blaues
//     fuer die 1-€-Muenzen. Orange = Cent, blau = Euro – im Bild, an den Boegen
//     und in den Statuszeilen dieselbe Farbe (MATHE_PROFIL § 10.2).
//   - „Tareks Weg“: rechts ein zweiter, BLASSER Teller mit Tareks Muenzen
//     (5 € minus die ganzen Euro, die Cent des Preises stehen gelassen). Unter
//     der Linie waechst ein grauer, gestrichelter Bogen vom Preis aus um Tareks
//     Betrag – sichtbar UEBER 5 € hinaus (bei 3,40 € bis „5,80 €“). Das Fenster
//     des Rechenstrichs weitet sich dafuer weich.
//
// BEWEGUNG (jede Sprungmarke spielt SELBST ab, N1 im Bauplan: ein Schritt im
// Heft = eine Handlung; anhalten kann die Lehrkraft):
//   Aufbau 0,6 s: Preisschild und Schein erscheinen, der Rechenstrich gleitet
//   in sein Fenster. Dann faellt je eine 10-ct-Muenze auf den Teller (0,25 s je
//   Muenze), der orange Bogen waechst mit und zaehlt „+ 10 ct“, „+ 20 ct“, …;
//   am vollen Euro ein Halt (0,4 s), das Faehnchen „4 €“ springt auf; dann je
//   eine 1-€-Muenze (0,4 s), der blaue Bogen waechst bis 5 €.
//   Dauer ab Knopfdruck: Preis 4 € 1,0 s · 3,40 € 2,9 s · 2,70 € 2,55 s ·
//   1,90 € 2,45 s (frei hoechstens 4,85 s bei 0,10 €).
//   „Preis − 10 ct“ / „Preis + 10 ct“ (frei, operativ): neuer Preis, kurzer
//   Aufbau (0,3 s), das Rueckgeld legt sich neu. Grenzen 0,10 € und 5,00 €;
//   dort ist der Knopf blass und tut nichts. Ohne gewaehlten Preis blass.
//   „Tareks Weg“: Tareks Euro-Muenzen (0,2 s je Muenze), dann seine
//   10-ct-Muenzen (0,15 s je Muenze) auf den blassen Teller, danach waechst der
//   graue Bogen (0,8 s), am Ende das graue Faehnchen (bei 3,40 € nach 2,2 s,
//   hoechstens 3,55 s). Ohne Preis blass; noch
//   einmal gedrueckt, legt er neu. Ein neuer Preis raeumt Tareks Teller ab.
// Alles ist eine Funktion der Ablaufzeiten (z.at, z.tarek.t, z.fenT): keine
// Zufallszahl; jede Zahl im Bild und in den Zeilen kommt aus _m6kPlan().
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6kWahl('…'), Wahlgruppe):
//     „Preis 4 €“ · „Preis 3,40 €“ · „Preis 2,70 €“ · „Preis 1,90 €“
//   Reihe 2: „Preis − 10 ct“ (_m6kSchritt(-1)) · „Preis + 10 ct“ (_m6kSchritt(1))
//     · „Tareks Weg“ (_m6kTarek) · „neu“ (_m6kNeu: Theke mit 5-Euro-Schein,
//     kein Preis)
//   Eine Sprungmarke waehrend des Ablaufs startet den Preis neu.
//
// STATUSZEILEN (woertlich aus dem Bauplan, jede mit Wert mehr als 18 Zeichen):
//   _m6k-preis     „Preis: 3,40 € (3 € 40 ct)“ · „Preis: 4,00 € (4 €)“ ·
//                  „Preis: 0,90 € (90 ct)“ (Start „Preis: noch keiner gewählt“)
//   _m6k-spruenge  am Ende „Sprünge bis 5 €: 60 ct + 1 €“ · „… 1 €“ (bei 4 €) ·
//                  „… 10 ct“ (bei 4,90 €) · „… keine“ (bei 5,00 €); vorher „…“
//   _m6k-rueckgeld am Ende „Rückgeld: 1 € 60 ct, kurz 1,60 €“ ·
//                  „Rückgeld: 1 €, kurz 1,00 €“ · „Rückgeld: 0 €, kurz 0,00 €“
//   _m6k-probe     am Ende „Probe: 3 € 40 ct + 1 € 60 ct = 5 €“
//   _m6k-tarek     nur nach „Tareks Weg“ (sonst unsichtbar):
//                  „Tareks Weg: 2 € 40 ct. Probe: 3 € 40 ct + 2 € 40 ct = 5 € 80 ct“
// Jede Groesse in jeder Zeile mit Einheit (N3); gemischt „3 € 40 ct“, mit Komma
// immer zwei Stellen und € nachgestellt („3,40 €“, „0,10 €“).
//
// WERTE (jede Zeile nachgerechnet mit simcheck/werte.js; Geld in ct gerechnet):
//   Preis 4 €     -> Sprünge 1 €          · Rückgeld 1 €, kurz 1,00 €
//                    Probe 4 € + 1 € = 5 €               · Tarek 1 € (Probe 5 €)
//   Preis 3,40 €  -> Sprünge 60 ct + 1 €  · Rückgeld 1 € 60 ct, kurz 1,60 €
//                    Probe 3 € 40 ct + 1 € 60 ct = 5 €   · Tarek 2 € 40 ct (Probe 5 € 80 ct)
//   Preis 2,70 €  -> Sprünge 30 ct + 2 €  · Rückgeld 2 € 30 ct, kurz 2,30 €
//                    Probe 2 € 70 ct + 2 € 30 ct = 5 €   · Tarek 3 € 70 ct (Probe 6 € 40 ct)
//   Preis 1,90 €  -> Sprünge 10 ct + 3 €  · Rückgeld 3 € 10 ct, kurz 3,10 €
//                    Probe 1 € 90 ct + 3 € 10 ct = 5 €   · Tarek 4 € 90 ct (Probe 6 € 80 ct)
//   frei 3,50 €   -> 50 ct + 1 € · 1 € 50 ct, kurz 1,50 €
//   frei 5,00 €   -> keine · Rückgeld: 0 €, kurz 0,00 € · Probe 5 € + 0 € = 5 €
// Nur 10-ct-Schritte, also nur 10-ct- und 1-€-Muenzen (hoechstens 9 und 4,
// auf Tareks Teller hoechstens 9 und 5).
// START: Theke mit 5-Euro-Schein, kein Preis („Start: Bezahlt wird mit 5 €.“).
//
// AHA (_bioFxWelle, ruhig, OHNE Textstreifen): bei „Preis 3,40 €“, wenn die
// 6. Muenze zu 10 ct liegt und der orange Bogen den vollen Euro (4 €) erreicht
// – Lichtring um die sechs Muenzen, die sechs sind 2,6 s bernstein umrandet.
// Einmal je Laden. Das widerlegt „2 € 40 ct“ (Cent stehen gelassen) und
// „2 € 60 ct“ (Euro nicht verringert): bis 4 € sind es 60 ct, nicht 40 ct.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-verteilen / m5-laengen, Container
// fpm-lehrkraft fuer simfakten.js, V3 aus Kapitel 4): eigene Knopfzeile UNTER
// den Heftknoepfen, davor klein „Für die Lehrkraft:“:
//   „Pause“ <-> „weiter“ (_m6kAnhalten): friert jede Bewegung ein (Muenzen,
//     Boegen, Fenster, Tareks Teller, Lichtring); Schild „Pause“ oben links.
//   „Tempo: normal“ <-> „Tempo: langsam“ (_m6kTempo): ein Drittel so schnell.
//   „Zahlen verdecken: aus“ <-> „… an“ (_m6kVerdecken): verdeckt Sprünge,
//     Rückgeld und Probe (Zeilen, Zahlen an den Boegen) – zum Vermuten an der
//     Tafel. Preisschild, Muenzen und Faehnchen bleiben sichtbar.
//   Eine Sprungmarke, ein Preisschritt oder „neu“ heben die Pause auf; Tempo und
//   Verdecken bleiben stehen. Hinweiszeile _m6k-lehrkraft nennt immer die
//   Einstellung (in der Pause bernsteinfarben). Voreinstellung: Zeitfaktor 1.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm): das WORT „Komma“ (das
// Zeichen steht im Preis), „ergänzen“, „bis zum vollen Euro“ als Regel-Satz,
// „1 € = 100 ct“ als Satz, kein „falsch“, kein „richtig“. Keine Punkte, keine
// Zeitmessung; ein Name nur im Knopf und in der Zeile „Tareks Weg“ (Bauplan,
// wie m5-rechenstrich und m5-laengen).
// ════════════════════════════════════════════════════════════════════════
let _m6k = null;
const _m6kPREISE = { p400: 400, p340: 340, p270: 270, p190: 190 };     // Preis in ct
const _m6kREIHE = ['p400', 'p340', 'p270', 'p190'];
const _m6kBEZAHLT = 500;                                                // 5 € in ct
const _m6kMIN = 10, _m6kMAX = 500;
const _m6kK = {
  // Papierstreifen mit dem Rechenstrich: Linie, Fenster (lo bei XL, hi bei XR)
  PX0: 6, PX1: 414, PY0: 4, PY1: 117,
  LX0: 14, LX1: 406, LY: 56, XL: 54, XR: 366, CMIN: 34,
  // Bogenhoehen (oben bunt, unten Tareks Bogen), Faehnchen unter der Linie
  HMIN: 11, HMAX: 32, HT: 41, FY: 67, FH: 19,
  // Preisschild und 5-Euro-Schein
  SX0: 8, SX1: 122, SY0: 125, SY1: 183,
  GX0: 12, GX1: 120, GY0: 192, GY1: 243,
  // Rueckgeld-Teller (T) und Tareks Teller (Q): Mitte, Halbachsen
  TX: 199, TY: 186, TRX: 72, TRY: 61,
  QX: 347, QY: 186, QRX: 64, QRY: 61,
  // Muenzplaetze relativ zur Tellermitte: Cent-Reihen, Euro-Reihe, Abstaende, Radien
  RC0: -27, RC1: -5, RE: 25, DC: 19, DE: 21, MRC: 8.5, MRE: 10.5,
  // Zeiten in s
  T_AUF: 0.6, T_AUFK: 0.3, T_CT: 0.25, T_HALT: 0.4, T_EU: 0.4, T_FEN: 0.5, T_POP: 0.3,
  T_TV: 0.2, T_TEU: 0.2, T_TCT: 0.15, T_TBOGEN: 0.8, T_TFAHNE: 0.2,
  // Farben
  CENT: '#c2410c', EURO: '#1d4ed8', PREIS: '#1e3a8a', ZIEL: '#92400e',
  TAREK: '#64748b', TINTE: '#0f172a', GRAU: '#64748b', GLANZ: '#f59e0b'
};

// ── Rechnung: alles aus dem Preis (in ct) ───────────────────────────────
// cj = Sprung bis zum vollen Euro (ct), v = voller Euro, ej = Euro-Sprung bis 5 €,
// r = Rueckgeld; Tarek: 5 € minus die ganzen Euro, die Cent stehen gelassen.
function _m6kPlan(p) {
  const c = p % 100, cj = c ? 100 - c : 0, v = p + cj, ej = (_m6kBEZAHLT - v) / 100;
  const tE = (_m6kBEZAHLT - (p - c)) / 100, tarek = tE * 100 + c;
  return { p, c, cj, v, ej, k: cj / 10, n: ej, r: _m6kBEZAHLT - p,
           tE, tC: c, tarek, probeT: p + tarek };
}
// „3 € 40 ct“, „4 €“, „60 ct“, „0 €“
function _m6kGeld(ct) {
  const e = Math.floor(ct / 100), c = ct % 100;
  return e && c ? e + ' € ' + c + ' ct' : e ? e + ' €' : c ? c + ' ct' : '0 €';
}
// „3,40 €“, „0,10 €“, „4,00 €“ – immer zwei Stellen nach dem Zeichen
function _m6kKomma(ct) {
  const e = Math.floor(ct / 100), c = ct % 100;
  return e + ',' + (c < 10 ? '0' : '') + c + ' €';
}
// Punkt am Rechenstrich und Knopfaufschrift: „3,40 €“, aber „4 €“ und „5 €“
function _m6kMarke(ct) { return ct % 100 ? _m6kKomma(ct) : (ct / 100) + ' €'; }
function _m6kKnopfText(ct) { return 'Preis ' + _m6kMarke(ct); }

// ── Ablauf: Zeitpunkte zu einem Preis ───────────────────────────────────
function _m6kZeiten(P, tAuf) {
  const K = _m6kK, c0 = tAuf, c1 = c0 + P.k * K.T_CT;
  const e0 = c1 + (P.k && P.n ? K.T_HALT : 0), e1 = e0 + P.n * K.T_EU;
  return { c0, c1, e0, e1, ende: e1 };
}
function _m6kTarekZeiten(P) {
  const K = _m6kK, e0 = K.T_TV, c0 = e0 + P.tE * K.T_TEU, b0 = c0 + (P.tC / 10) * K.T_TCT;
  return { e0, c0, b0, ende: b0 + K.T_TBOGEN + K.T_TFAHNE };
}
// Stand zur Ablaufzeit: gelandete 10-ct- und 1-€-Muenzen, fertig?
function _m6kStand(z) {
  const st = { ct: 0, eu: 0, fertig: false };
  if (z.preis === null) return st;
  const K = _m6kK, P = _m6kPlan(z.preis), Z = _m6kZeiten(P, z.tAuf);
  for (let i = 0; i < P.k; i++) if (z.at >= Z.c0 + (i + 1) * K.T_CT) st.ct++;
  for (let j = 0; j < P.n; j++) if (z.at >= Z.e0 + (j + 1) * K.T_EU) st.eu++;
  st.fertig = z.at >= Z.ende;
  return st;
}

// ── Fenster des Rechenstrichs (in €), weich ueberblendet ────────────────
// lo/hi: sichtbarer Bereich; s: Dehnung des Cent-Sprungs [Preis, voller Euro],
// so dass er mindestens CMIN px breit ist. Rechts vom vollen Euro bleibt alles
// massstaeblich (Euro-Spruenge, Tareks Ueberschuss ueber 5 €).
function _m6kFensterZiel(z) {
  if (z.preis === null) return { lo: 0, hi: 5, s: 1 };
  const K = _m6kK, P = _m6kPlan(z.preis);
  const hi = z.tarek ? Math.max(5, P.probeT / 100) : 5;
  let lo = P.p / 100, s = 1;
  if (hi - lo < 1) lo = hi - 1;
  else if (P.cj) {
    // gedehnte Breite c (in €) mit c / (Rest + c) · Breite = CMIN
    const rest = hi - P.v / 100, c = K.CMIN * rest / (K.XR - K.XL - K.CMIN);
    s = Math.max(1, c / (P.cj / 100));
  }
  return { lo, hi, s };
}
function _m6kFenster(z) {
  const e = _bioFxEase.sanft(_bioFxKlemme(z.fenT / _m6kK.T_FEN)), a = z.fenVon, b = z.fenZiel;
  return { lo: a.lo + (b.lo - a.lo) * e, hi: a.hi + (b.hi - a.hi) * e, s: a.s + (b.s - a.s) * e };
}
function _m6kFensterNeu(z) {
  z.fenVon = z.fenZiel ? _m6kFenster(z) : { lo: 0, hi: 5, s: 1 };
  z.fenZiel = _m6kFensterZiel(z);
  z.fenT = 0;
}

function _m6kInit() {
  _m6k = { t: 0, at: 0, preis: null, tAuf: _m6kK.T_AUF, kurz: false, tarek: null,
           fenVon: null, fenZiel: null, fenT: 9,
           fx: { teile: [] }, pause: false, langsam: false, verdeckt: false };   // Lehrkraft
  _m6kLaden(null, false);
  _m6k.fenVon = _m6k.fenZiel; _m6k.fenT = 9;          // beim Oeffnen kein Gleiten
}
// Einen Preis laden (p = null: Theke mit Schein, kein Preis). kurz: Preisschritt.
function _m6kLaden(p, kurz) {
  const z = _m6k, K = _m6kK;
  z.preis = p; z.at = 0; z.kurz = !!kurz;
  z.tAuf = kurz ? K.T_AUFK : K.T_AUF;
  z.tarek = null;
  z.stand = _m6kStand(z);
  z.ende = false; z.endGlanz = 0;
  z.aha = false; z.ahaGlanz = 0;
  z.fx.teile.length = 0;
  z.pause = false;                        // neu laden hebt die Pause auf
  _m6kFensterNeu(z);
}

function _m6kHTML() {
  const nb = s => s.replace(/ /g, '&nbsp;');
  const marke = k => `<button class="sim-btn" id="_m6k-b-${k}" onclick="_m6kWahl('${k}')">${nb(_m6kKnopfText(_m6kPREISE[k]))}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viel Rückgeld gibt es?</h3>
    <div class="fpm-note" style="margin-top:2px">Bezahlt wird mit 5&nbsp;€. Wähle einen Preis. Das Rückgeld legt sich von selbst.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6k-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6kREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m6k-runter" onclick="_m6kSchritt(-1)">Preis&nbsp;−&nbsp;10&nbsp;ct</button>
          <button class="sim-btn" id="_m6k-rauf" onclick="_m6kSchritt(1)">Preis&nbsp;+&nbsp;10&nbsp;ct</button>
          <button class="sim-btn" id="_m6k-tarekweg" onclick="_m6kTarek()">Tareks Weg</button>
          <button class="sim-btn" onclick="_m6kNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m6k-pause" onclick="_m6kAnhalten()">Pause</button>
          <button class="sim-btn" id="_m6k-tempo" onclick="_m6kTempo()">Tempo: <span id="_m6k-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m6k-verdeckt" onclick="_m6kVerdecken()">Zahlen verdecken: <span id="_m6k-verdeckt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m6k-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6k-preis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6k-spruenge" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6k-rueckgeld" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6k-probe" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_m6k-tarek" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Bezahlt wird mit 5&nbsp;€.</p>
  </div>`;
}
function _m6kSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m6kZeige(id, html) {
  const e = _m6kSetze(id, html);
  if (e && e.style) e.style.display = html ? '' : 'none';
}
function _m6kKnopf(id, an) {
  const b = document.getElementById(id);
  if (!b) return;
  b.disabled = !an;
  if (b.style) b.style.opacity = an ? '' : '0.45';
}
// Gemischter Betrag in den Farben der Muenzen: Euro blau, Cent orange.
function _m6kGeldBunt(ct) {
  const K = _m6kK, e = Math.floor(ct / 100), c = ct % 100;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  if (e && c) return f(e + ' €', K.EURO) + ' ' + f(c + ' ct', K.CENT);
  if (c) return f(c + ' ct', K.CENT);
  return f(e + ' €', K.EURO);
}
function _m6kStatus() {
  if (!_m6k) return;
  const z = _m6k, K = _m6kK, p = z.preis, P = p === null ? null : _m6kPlan(p);
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const zu = z.verdeckt, fertig = !!(P && z.stand.fertig);
  _m6kSetze('_m6k-preis', 'Preis: ' + (P ? f(_m6kKomma(p), K.PREIS) + ' (' + _m6kGeldBunt(p) + ')'
                                         : 'noch keiner gewählt'));
  let spr = 'Sprünge bis 5 €: …', rg = 'Rückgeld: …', probe = 'Probe: …';
  if (fertig) {
    const teile = [];
    if (P.cj) teile.push(f(P.cj + ' ct', K.CENT));
    if (P.ej) teile.push(f(P.ej + ' €', K.EURO));
    spr = 'Sprünge bis 5 €: ' + (zu ? 'verdeckt' : teile.length ? teile.join(' + ') : 'keine');
    rg = 'Rückgeld: ' + (zu ? 'verdeckt' : _m6kGeldBunt(P.r) + ', kurz ' + f(_m6kKomma(P.r), K.TINTE));
    probe = 'Probe: ' + (zu ? 'verdeckt' : f(_m6kGeld(p), K.PREIS) + ' + ' + _m6kGeldBunt(P.r) +
                                           ' = ' + f(_m6kGeld(_m6kBEZAHLT), K.ZIEL));
  }
  _m6kSetze('_m6k-spruenge', spr);
  _m6kSetze('_m6k-rueckgeld', rg);
  _m6kSetze('_m6k-probe', probe);
  _m6kZeige('_m6k-tarek', P && z.tarek && z.tarek.fertig
    ? 'Tareks Weg: ' + _m6kGeld(P.tarek) + '. Probe: ' + _m6kGeld(p) + ' + ' + _m6kGeld(P.tarek) +
      ' = ' + _m6kGeld(P.probeT) : '');
  _m6kREIHE.forEach(k => {
    const b = document.getElementById('_m6k-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', _m6kPREISE[k] === p);
  });
  _m6kKnopf('_m6k-runter', !!P && p > _m6kMIN);
  _m6kKnopf('_m6k-rauf', !!P && p < _m6kMAX);
  _m6kKnopf('_m6k-tarekweg', !!P);
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6kSetze('_m6k-pause', z.pause ? 'weiter' : 'Pause');
  _m6kSetze('_m6k-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6kSetze('_m6k-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6kSetze('_m6k-lehrkraft', _m6kHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6k-pause', z.pause], ['_m6k-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6kHinweis() {
  const z = _m6k;
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Zahlen: ' + (z.verdeckt ? 'verdeckt' : 'sichtbar') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m6kWahl(key) {
  if (!_m6k || !_m6kPREISE[key]) return;
  _m6kLaden(_m6kPREISE[key], false);
  _m6kStatus();
}
// „Preis − 10 ct“ / „Preis + 10 ct“: nur mit gewaehltem Preis, Grenzen 0,10 € und 5,00 €.
function _m6kSchritt(d) {
  const z = _m6k;
  if (!z || z.preis === null) return;
  const p = z.preis + 10 * d;
  if (p < _m6kMIN || p > _m6kMAX) return;
  _m6kLaden(p, true);
  _m6kStatus();
}
// „Tareks Weg“: nur mit gewaehltem Preis; noch einmal gedrueckt, legt er neu.
function _m6kTarek() {
  const z = _m6k;
  if (!z || z.preis === null) return;
  z.tarek = { t: 0, fertig: false };
  _m6kFensterNeu(z);
  _m6kStatus();
}
function _m6kNeu() {
  if (!_m6k) return;
  _m6kLaden(null, false);
  _m6kStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6kAnhalten() {
  if (!_m6k) return;
  _m6k.pause = !_m6k.pause;
  _m6kStatus();
}
function _m6kTempo() {
  if (!_m6k) return;
  _m6k.langsam = !_m6k.langsam;
  _m6kStatus();
}
function _m6kVerdecken() {
  if (!_m6k) return;
  _m6k.verdeckt = !_m6k.verdeckt;
  _m6kStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6kZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6kUpdate(dt) {
  if (!_m6k) return;
  const z = _m6k, K = _m6kK;
  dt = _bioFxDt(dt) * _m6kZeitfaktor(z);              // ab hier Sim-Zeit
  z.t += dt; z.at += dt; z.fenT += dt;
  if (z.tarek) z.tarek.t += dt;
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.endGlanz = Math.max(0, z.endGlanz - dt);
  if (z.preis !== null && dt > 0) {                   // ohne Zeit kein Schritt im Ablauf
    const st = _m6kStand(z), alt = z.stand, P = _m6kPlan(z.preis);
    let neu = st.ct !== alt.ct || st.eu !== alt.eu;
    if (z.preis === 340 && !z.aha && st.ct >= 6) {
      // Aha: die 6. Muenze zu 10 ct liegt, der orange Bogen ist bei 4 €
      z.aha = true; z.ahaGlanz = 2.6;
      const m = _m6kSechsMitte();
      _bioFxWelle(z.fx.teile, m.x, m.y, K.GLANZ, 60);
    }
    if (st.fertig && !z.ende) { z.ende = true; z.endGlanz = 1.6; neu = true; }
    z.stand = st;
    if (z.tarek && !z.tarek.fertig && z.tarek.t >= _m6kTarekZeiten(P).ende) {
      z.tarek.fertig = true; neu = true;
    }
    if (neu) _m6kStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Orte ────────────────────────────────────────────────────────────────
// Platz der i-ten 10-ct-Muenze (Fuenferreihen) und der j-ten 1-€-Muenze auf einem Teller.
function _m6kPlatzCt(cx, cy, i) {
  const K = _m6kK, r = i < 5 ? 0 : 1;
  return { x: cx + (i % 5 - 2) * K.DC, y: cy + (r ? K.RC1 : K.RC0) };
}
function _m6kPlatzEu(cx, cy, j) { return { x: cx + (j - 2) * _m6kK.DE, y: cy + _m6kK.RE }; }
function _m6kSechsMitte() {
  const K = _m6kK;
  let x = 0, y = 0;
  for (let i = 0; i < 6; i++) { const q = _m6kPlatzCt(K.TX, K.TY, i); x += q.x / 6; y += q.y / 6; }
  return { x, y };
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6kText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m6kK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Teile [Text, Farbe] nebeneinander, als Ganzes um xm zentriert.
function _m6kTeile(ctx, teile, xm, y, gr) {
  ctx.font = '700 ' + gr + 'px sans-serif';
  const br = teile.map(t => ctx.measureText(t[0]).width);
  let x = xm - br.reduce((a, b) => a + b, 0) / 2;
  teile.forEach((t, i) => { _m6kText(ctx, t[0], x, y, gr, t[1], 'left'); x += br[i]; });
}
function _m6kBogenHoehe(w) { const K = _m6kK; return Math.max(K.HMIN, Math.min(K.HMAX, K.HMIN + 0.16 * Math.abs(w))); }
// Bogen von x0 nach x1 bis zum Anteil u (0 … 1); oben bunt, unten (Tarek) gestrichelt.
function _m6kBogen(ctx, x0, x1, h, u, farbe, unten) {
  if (u <= 0 || Math.abs(x1 - x0) < 0.5) return;
  const K = _m6kK, sg = unten ? 1 : -1, w = x1 - x0;
  const yv = s => K.LY + sg * 4 * h * s * (1 - s);
  const n = Math.max(8, Math.ceil(Math.abs(w) / 4));
  ctx.save();
  ctx.strokeStyle = farbe; ctx.lineWidth = unten ? 2 : 2.6; ctx.lineCap = 'round';
  if (unten) ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(x0, K.LY);
  for (let i = 1; i <= n; i++) {
    const s = Math.min(u, i / n);
    ctx.lineTo(x0 + w * s, yv(s));
    if (s >= u) break;
  }
  ctx.stroke();
  ctx.setLineDash([]);
  if (Math.abs(w) < 14) { ctx.restore(); return; }     // winziger Sprung: nur der Bogen
  // Spitze in Laufrichtung
  const tx = x0 + w * u, ty = yv(u), dx = w, dy = sg * 4 * h * (1 - 2 * u);
  const l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
  const a = Math.min(6, Math.max(3.5, Math.abs(w) / 3));
  ctx.fillStyle = farbe;
  ctx.beginPath(); ctx.moveTo(tx, ty);
  ctx.lineTo(tx - ux * a * 1.5 - uy * a * 0.75, ty - uy * a * 1.5 + ux * a * 0.75);
  ctx.lineTo(tx - ux * a * 1.5 + uy * a * 0.75, ty - uy * a * 1.5 - ux * a * 0.75);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Zahl an einem Bogen: weisses Schild, Schrift in der Farbe des Bogens.
function _m6kSchildchen(ctx, s, xm, y, farbe, a, gr) {
  if (a <= 0.01) return;
  gr = gr || 13;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.font = '700 ' + gr + 'px sans-serif';
  const w = ctx.measureText(s).width + 10;
  let x = Math.min(_m6kK.PX1 - 4 - w / 2, Math.max(_m6kK.PX0 + 4 + w / 2, xm));
  if (_m6k && _m6k.pause && y < 42) x = Math.max(x, 78 + w / 2);   // nicht unter das Schild „Pause“
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  _bioFxRundRect(ctx, x - w / 2, y - gr + 1, w, gr + 4, 6); ctx.fill();
  _m6kText(ctx, s, x, y, gr, farbe);
  ctx.restore();
}
// Faehnchen unter der Linie: [{x, text, rand, grund, schrift, a, pop}] – dicht beieinander
// liegende zeigen nach aussen, notfalls rutscht eins eine Stufe tiefer.
function _m6kFahnen(ctx, liste) {
  const K = _m6kK;
  ctx.save();
  ctx.font = '700 12px sans-serif';
  const boxen = liste.filter(f => f.a > 0.01).sort((a, b) => a.x - b.x).map(f => {
    const w = ctx.measureText(f.text).width + 12;
    return Object.assign({ w, x0: f.x - w / 2, y: K.FY }, f);
  });
  for (let i = 1; i < boxen.length; i++) {
    const v = boxen[i - 1], b = boxen[i];
    if (b.x0 < v.x0 + v.w + 3) {
      v.x0 = v.x + 6 - v.w;                           // linkes zeigt nach links
      b.x0 = b.x - 6;                                 // rechtes nach rechts
      if (b.x0 < v.x0 + v.w + 3) b.y = v.y + K.FH + 4;
    }
  }
  for (const b of boxen) {
    b.x0 = Math.max(K.PX0 + 3, Math.min(K.PX1 - 3 - b.w, b.x0));
    ctx.save();
    ctx.globalAlpha = Math.min(1, b.a);
    ctx.strokeStyle = b.rand; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(b.x, K.LY + 4); ctx.lineTo(b.x, b.y); ctx.stroke();
    const k = b.pop || 1;
    ctx.translate(b.x0 + b.w / 2, b.y + K.FH / 2);
    ctx.scale(k, k);
    ctx.fillStyle = b.grund;
    _bioFxRundRect(ctx, -b.w / 2, -K.FH / 2, b.w, K.FH, 6); ctx.fill(); ctx.stroke();
    _m6kText(ctx, b.text, 0, 4.5, 12, b.schrift);
    ctx.restore();
  }
  ctx.restore();
}
function _m6kPunkt(ctx, x, farbe, a, ring) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (ring) {                                            // Ziel: Ring mit hellem Kern
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = farbe; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, _m6kK.LY, 5.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else {
    ctx.fillStyle = farbe; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, _m6kK.LY, 4.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
// Muenzen. a: Deckkraft, k: Groesse, glanz: farbiger Ring beim Landen (0 … 1).
function _m6kMuenzeCt(ctx, x, y, a, k, glanz) {
  const K = _m6kK, r = K.MRC * (k || 1);
  if (a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (glanz > 0.01) {
    ctx.save(); ctx.globalAlpha = Math.min(1, a) * glanz;
    ctx.strokeStyle = K.CENT; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(15,23,42,0.14)';
  ctx.beginPath(); ctx.arc(x + 1, y + 1.4, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#eccb6e'; ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(161,98,7,0.55)'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(x, y, r * 0.78, 0, Math.PI * 2); ctx.stroke();
  _m6kText(ctx, '10', x, y + r * 0.36, Math.max(5, r * 0.95), K.CENT);
  ctx.restore();
}
function _m6kMuenzeEu(ctx, x, y, a, k, glanz) {
  const K = _m6kK, r = K.MRE * (k || 1);
  if (a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  if (glanz > 0.01) {
    ctx.save(); ctx.globalAlpha = Math.min(1, a) * glanz;
    ctx.strokeStyle = K.EURO; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(15,23,42,0.14)';
  ctx.beginPath(); ctx.arc(x + 1, y + 1.6, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8c25a'; ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1.1;      // goldener Ring
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e5e7eb'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 0.8;      // silberner Kern
  ctx.beginPath(); ctx.arc(x, y, r * 0.62, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  _m6kText(ctx, '1', x, y + r * 0.36, Math.max(5, r * 1.0), K.EURO);
  ctx.restore();
}
// Muenze im Flug oder gelandet: von schraeg oben auf ihren Platz (Fallen, Aufsetzen).
function _m6kMuenzeAm(ctx, art, q, t0, dauer, jetzt, blass) {
  const E = _bioFxEase, kl = _bioFxKlemme;
  const u = (jetzt - t0) / dauer;
  if (u <= 0) return;
  const zeichne = art === 'ct' ? _m6kMuenzeCt : _m6kMuenzeEu;
  const b = blass || 1;
  if (u < 1) {
    const e = E.sanft(u);
    zeichne(ctx, q.x + 22 * (1 - e), q.y - 30 * (1 - e), b * kl(u * 2.5), 1.25 - 0.25 * e, 0);
    return;
  }
  const alter = jetzt - t0 - dauer;
  const k = alter < 0.2 ? 1 + 0.12 * Math.sin(Math.PI * alter / 0.2) : 1;
  zeichne(ctx, q.x, q.y, b, k, blass ? 0 : Math.max(0, 1 - alter / 0.45));
}
// Teller von oben: Rand, Mulde, oben das Cent-Feld (orange), unten das Euro-Feld (blau).
function _m6kTeller(ctx, cx, cy, rx, ry, blass) {
  const K = _m6kK;
  ctx.save();
  if (blass) ctx.globalAlpha = blass;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  ctx.beginPath(); ctx.ellipse(cx + 2, cy + 3, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = blass ? '#f1f5f9' : '#f8fafc'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(cx, cy, rx - 9, ry - 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const zc = blass ? ['rgba(100,116,139,0.10)', 'rgba(100,116,139,0.40)']
                   : ['rgba(234,88,12,0.10)', 'rgba(194,65,12,0.45)'];
  const ze = blass ? ['rgba(100,116,139,0.10)', 'rgba(100,116,139,0.40)']
                   : ['rgba(29,78,216,0.09)', 'rgba(29,78,216,0.45)'];
  ctx.lineWidth = 1.1; ctx.setLineDash([3, 3]);
  ctx.fillStyle = zc[0]; ctx.strokeStyle = zc[1];
  _bioFxRundRect(ctx, cx - 48, cy + K.RC0 - 12, 96, K.RC1 - K.RC0 + 24, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = ze[0]; ctx.strokeStyle = ze[1];
  _bioFxRundRect(ctx, cx - 54, cy + K.RE - 13, 108, 26, 12); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
// Preisschild: Preis gross mit Komma (Euro-Ziffern blau, Cent-Ziffern orange),
// darunter klein gemischt („3 € 40 ct“) in denselben Farben.
function _m6kPreisschild(ctx, p, a, k) {
  const K = _m6kK;
  if (a <= 0.01) return;
  const x0 = K.SX0, x1 = K.SX1, y0 = K.SY0, y1 = K.SY1, ym = (y0 + y1) / 2;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.translate((x0 + x1) / 2, ym); ctx.scale(k, k); ctx.translate(-(x0 + x1) / 2, -ym);
  const form = (dx, dy) => {
    ctx.beginPath();
    ctx.moveTo(x0 + dx, ym + dy); ctx.lineTo(x0 + 14 + dx, y0 + dy);
    ctx.lineTo(x1 + dx, y0 + dy); ctx.lineTo(x1 + dx, y1 + dy);
    ctx.lineTo(x0 + 14 + dx, y1 + dy); ctx.closePath();
  };
  ctx.fillStyle = 'rgba(15,23,42,0.12)'; form(2, 3); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
  form(0, 0); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath(); ctx.arc(x0 + 11, ym, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const e = Math.floor(p / 100), c = p % 100, xm = (x0 + 16 + x1) / 2;
  _m6kTeile(ctx, [[String(e), K.EURO], [',' + (c < 10 ? '0' : '') + c, K.CENT], [' €', K.TINTE]],
            xm, ym + 3, 25);
  const klein = e && c ? [[e + ' €', K.EURO], [' ', K.TINTE], [c + ' ct', K.CENT]]
              : c ? [[c + ' ct', K.CENT]] : [[e + ' €', K.EURO]];
  _m6kTeile(ctx, klein, xm, y1 - 8, 13);
  ctx.restore();
}
// Der bezahlte 5-Euro-Schein (grau-gruen, mit Torbogen).
function _m6kSchein(ctx, a, dy) {
  const K = _m6kK, x0 = K.GX0, x1 = K.GX1, y0 = K.GY0 + dy, y1 = K.GY1 + dy;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = 'rgba(15,23,42,0.12)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 3, x1 - x0, y1 - y0, 4); ctx.fill();
  ctx.fillStyle = '#dde5df'; ctx.strokeStyle = '#5f7268'; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 4); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(95,114,104,0.45)'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x0 + 4, y0 + 4, x1 - x0 - 8, y1 - y0 - 8, 3); ctx.stroke();
  const bx = x1 - 26, by = y1 - 8;                     // Torbogen rechts
  ctx.beginPath(); ctx.moveTo(bx - 14, by); ctx.lineTo(bx - 14, by - 16);
  ctx.arc(bx, by - 16, 14, Math.PI, 0); ctx.lineTo(bx + 14, by); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx - 8, by); ctx.lineTo(bx - 8, by - 16);
  ctx.arc(bx, by - 16, 8, Math.PI, 0); ctx.lineTo(bx + 8, by); ctx.stroke();
  _m6kText(ctx, '5 €', x0 + 10, y0 + 30, 22, '#3f5248', 'left');
  ctx.restore();
}
// Lichtring-Rest: die sechs 10-ct-Muenzen bernstein umrandet (Aha).
function _m6kSechsRahmen(ctx) {
  const z = _m6k, K = _m6kK;
  if (z.ahaGlanz <= 0) return;
  const a = _m6kPlatzCt(K.TX, K.TY, 0), b = _m6kPlatzCt(K.TX, K.TY, 5), c = _m6kPlatzCt(K.TX, K.TY, 4);
  const r = K.MRC + 4;
  ctx.save();
  ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.8) * (0.6 + 0.35 * Math.sin(z.t * Math.PI * 1.6));
  ctx.strokeStyle = K.GLANZ; ctx.lineWidth = 3;
  ctx.beginPath();                                       // Treppe: Reihe 1 ganz, Reihe 2 eine Muenze
  ctx.moveTo(a.x - r, a.y - r); ctx.lineTo(c.x + r, c.y - r); ctx.lineTo(c.x + r, c.y + r);
  ctx.lineTo(b.x + r, c.y + r); ctx.lineTo(b.x + r, b.y + r); ctx.lineTo(b.x - r, b.y + r);
  ctx.closePath(); ctx.stroke();
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-verteilen.
function _m6kPauseSchild(ctx) {
  const w = 64, h = 25, x = 8, y = 8;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  _bioFxRundRect(ctx, x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 6, y + 6.5, 3.5, 12); ctx.fillRect(x + 12.5, y + 6.5, 3.5, 12);   // Pausezeichen
  _m6kText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}

function _m6kDraw(ctx, cv) {
  if (!_m6k) return;
  const z = _m6k, K = _m6kK, E = _bioFxEase, kl = _bioFxKlemme, W = cv.width, H = cv.height;
  const P = z.preis === null ? null : _m6kPlan(z.preis);
  const Z = P ? _m6kZeiten(P, z.tAuf) : null;
  const fen = _m6kFenster(z);
  // links vom vollen Euro gedehnt (Cent-Sprung, Faktor fen.s), rechts davon massstaeblich
  const vE = P ? P.v / 100 : 0;
  const g = e => (P && e < vE) ? vE - (vE - e) * fen.s : e;
  const g0 = g(fen.lo), g1 = g(fen.hi);
  const X = euro => K.XL + (g(euro) - g0) / (g1 - g0) * (K.XR - K.XL);
  const auf = z.kurz ? 1 : E.sanft(kl(z.at / K.T_AUF));      // Aufbau (Preisschild, Schein)
  ctx.clearRect(0, 0, W, H);
  // Theke (helles Holz)
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f6efe3'); bg.addColorStop(1, '#eadcc5');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(146,104,60,0.10)'; ctx.lineWidth = 1;
  for (const y of [138, 171, 204, 232]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + 3); ctx.stroke(); }
  // Papierstreifen mit dem Rechenstrich
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 8); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 8); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(K.LX0, K.LY); ctx.lineTo(K.LX1, K.LY); ctx.stroke();
  ctx.lineCap = 'butt';

  const fahnen = [];
  const x5 = X(_m6kBEZAHLT / 100);
  if (P) {
    const xp = X(P.p / 100), xv = X(P.v / 100);
    // Tareks Bogen (unter der Linie, grau, gestrichelt) – ueber 5 € hinaus
    if (z.tarek) {
      const TZ = _m6kTarekZeiten(P), xt = X(P.probeT / 100);
      const uT = kl((z.tarek.t - TZ.b0) / K.T_TBOGEN);
      _m6kBogen(ctx, xp, xt, K.HT, uT, '#94a3b8', true);
      if (P.tarek && uT > 0)
        _m6kSchildchen(ctx, '+ ' + _m6kGeld(P.tarek), (xp + xt) / 2, K.LY + K.HT + 14, K.TAREK,
                       kl((uT - 0.3) / 0.4), 12);
      const aT = kl((z.tarek.t - TZ.b0 - K.T_TBOGEN) / K.T_TFAHNE);
      if (P.probeT !== _m6kBEZAHLT && aT > 0)
        fahnen.push({ x: xt, text: _m6kMarke(P.probeT), rand: '#94a3b8', grund: '#f1f5f9',
                      schrift: K.TAREK, a: aT });
    }
    // oranger Bogen (Preis -> voller Euro) und blauer Bogen (voller Euro -> 5 €)
    const hC = _m6kBogenHoehe(xv - xp), hE = _m6kBogenHoehe(x5 - xv);
    const uC = P.k ? kl((z.at - Z.c0) / (P.k * K.T_CT)) : 0;
    const uE = P.n ? kl((z.at - Z.e0) / (P.n * K.T_EU)) : 0;
    _m6kBogen(ctx, xp, xv, hC, uC, K.CENT, false);
    _m6kBogen(ctx, xv, x5, hE, uE, K.EURO, false);
    // Punkte und Faehnchen: Preis, voller Euro, 5 €
    if (P.p !== _m6kBEZAHLT) {
      _m6kPunkt(ctx, xp, K.PREIS, auf);
      fahnen.push({ x: xp, text: _m6kMarke(P.p), rand: K.PREIS, grund: '#ffffff', schrift: K.PREIS, a: auf });
    }
    if (P.v !== P.p && P.v !== _m6kBEZAHLT) {
      const tv = z.at - Z.c1, av = kl(tv / 0.2);
      _m6kPunkt(ctx, xv, K.CENT, av);
      fahnen.push({ x: xv, text: _m6kMarke(P.v), rand: K.CENT, grund: '#fff7ed', schrift: '#9a3412',
                    a: av, pop: tv > 0 && tv < K.T_POP ? 1 + 0.15 * Math.sin(Math.PI * tv / K.T_POP) : 1 });
    }
    // Zahlen an den Boegen (zaehlen mit den Muenzen; verdeckt: „?“)
    const st = z.stand;
    if (P.k && st.ct > 0)
      _m6kSchildchen(ctx, z.verdeckt ? '?' : '+ ' + st.ct * 10 + ' ct', (xp + xv) / 2, K.LY - hC - 6, K.CENT, 1);
    if (P.n && st.eu > 0)
      _m6kSchildchen(ctx, z.verdeckt ? '?' : '+ ' + st.eu + ' €', (xv + x5) / 2, K.LY - hE - 6, K.EURO, 1);
  }
  // Ziel 5 € (leuchtet am Ende kurz)
  if (z.endGlanz > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, z.endGlanz / 0.6);
    _bioFxLeuchten(ctx, x5, K.LY, 9, z.t, '245,158,11');
    ctx.restore();
  }
  _m6kPunkt(ctx, x5, '#a16207', 1, true);
  fahnen.push({ x: x5, text: _m6kMarke(_m6kBEZAHLT), rand: '#a16207', grund: '#fde68a', schrift: '#713f12', a: 1 });
  _m6kFahnen(ctx, fahnen);

  // unten: Preisschild, Schein, Teller
  if (P) {
    const tp = z.at, pop = z.kurz && tp < K.T_POP ? 1 + 0.1 * Math.sin(Math.PI * tp / K.T_POP) : 1;
    _m6kPreisschild(ctx, P.p, auf, z.kurz ? pop : 0.85 + 0.15 * auf);
  }
  _m6kSchein(ctx, 0.5 + 0.5 * auf, -8 * (1 - auf));
  _m6kTeller(ctx, K.TX, K.TY, K.TRX, K.TRY, 0);
  if (z.tarek) {
    const a = E.sanft(kl(z.tarek.t / 0.3));
    _m6kTeller(ctx, K.QX, K.QY, K.QRX, K.QRY, 0.55 * a);
  }
  if (P) {
    _m6kSechsRahmen(ctx);
    for (let i = 0; i < P.k; i++)
      _m6kMuenzeAm(ctx, 'ct', _m6kPlatzCt(K.TX, K.TY, i), Z.c0 + i * K.T_CT, K.T_CT, z.at);
    for (let j = 0; j < P.n; j++)
      _m6kMuenzeAm(ctx, 'eu', _m6kPlatzEu(K.TX, K.TY, j), Z.e0 + j * K.T_EU, K.T_EU, z.at);
    if (z.tarek) {                                     // Tareks Muenzen: erst Euro, dann Cent
      const TZ = _m6kTarekZeiten(P);
      for (let j = 0; j < P.tE; j++)
        _m6kMuenzeAm(ctx, 'eu', _m6kPlatzEu(K.QX, K.QY, j), TZ.e0 + j * K.T_TEU, K.T_TEU, z.tarek.t, 0.55);
      for (let i = 0; i < P.tC / 10; i++)
        _m6kMuenzeAm(ctx, 'ct', _m6kPlatzCt(K.QX, K.QY, i), TZ.c0 + i * K.T_TCT, K.T_TCT, z.tarek.t, 0.55);
    }
  }
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m6kPauseSchild(ctx);
}
