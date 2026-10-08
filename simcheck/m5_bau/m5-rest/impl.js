
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mm5 „Was bleibt übrig?“ (Kennung m5-rest, Praefix _m5v)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL4_PROFIL.md, Abschnitt m5-rest.
// Ueberschrift = Frage der Einheit: „Wie viele Karten bleiben übrig?“
//
// Was man sieht – Bild und Zeichen, durch die FARBE verbunden (Karten indigo,
// volle Seiten gruen, Rest orange; in Bild, Zettel und Statuszeilen gleich):
//   KARTEN (oben, mittig): kleine Rechtecke mit gleichem Rueckenmuster
//     (weisser Innenrand, helle Raute), in Zehnerreihen mit Fuenferluecke.
//     Die Karten verlassen das Feld von hinten, so bleibt die Struktur
//     lesbar: 7 uebrige Karten sind immer „5 und 2“ in der ersten Reihe.
//   ALBUM (unten, helles Band mit der Aufschrift „Album“): Platz fuer sieben
//     Seiten nebeneinander, jede mit 4 Faechern (2 × 2). Eine Seite erscheint
//     erst, wenn sie gefuellt wird – das leere Album verraet also keine
//     Seitenzahl. Unter jeder vollen Seite ihre Nummer im gruenen Kreis.
//   ABLAGE „übrig“ (rechts neben dem Album): ein flacher Kasten mit 4 Plaetzen,
//     darueber eine geschweifte Klammer und das Wort „übrig“.
//   ZETTEL (unten, am Ende): „Kurz geschrieben: 23 : 4 = 5 Rest 3“ – 23 indigo
//     (Karten), 5 gruen (volle Seiten), „Rest 3“ orange (Ablage).
//
// Bewegung (spielt nach der Sprungmarke SELBST ab, N1 im Bauplan: ein Schritt
// im Heft = eine Handlung; anhalten kann die Lehrkraft). Alles ist eine
// Funktion der Ablaufzeit L.at (_m5vAb, _m5vLand, _m5vRStart …): keine
// Zufallszahl, jede Zahl im Bild kommt aus derselben Rechnung wie die
// Statuszeilen (_m5vStandAus).
//   Aufbau 0,45 s: Karten, die nicht auf dem Tisch liegen, springen zurueck ins
//     Feld (federnd, gestaffelt); ein altes Album blendet aus (0,25 s).
//   Je Seite 0,6 s: die Seite erscheint, ihre 4 Karten fliegen nacheinander
//     im Bogen in die Faecher. Ist sie voll, springt ihre Nummer auf.
//   Restphase (nur wenn weniger als 4 Karten uebrig sind): noch eine Seite
//     erscheint als gestrichelter Umriss, die uebrigen Karten schweben hinein,
//     die leeren Faecher leuchten kurz orange, dann gleiten die Karten in die
//     Ablage „übrig“. Danach bleibt der Umriss blass stehen.
//   Am Ende gleitet der Zettel herein.
//   Dauer: 21 : 4 und 23 : 4 je 5,45 s, 22 : 4 ebenso, 24 : 4 4,15 s.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5vAufgabe('21') usw., eine
//     Wahlgruppe): „21 : 4“ · „22 : 4“ · „23 : 4“ · „24 : 4“.
//   „+ 1 Karte“ (_m5vPlus()): legt eine Karte in die Ablage – sie springt im
//     Feld auf und fliegt hinueber. Sind dort dann 4 Karten, wandern sie auf
//     die neue Seite (der Umriss wird eine volle Seite). Erst nach einer
//     Aufgabe bedienbar (vorher blass). Grenze 28 Karten = 7 Seiten (mehr
//     passt nicht ins Album): die Ablage wackelt, _m5v-grenze sagt „Mehr
//     Karten passen nicht ins Album.“ (bis zur naechsten Handlung).
//   „noch einmal“ (_m5vNochmal()): spielt die Aufgabe mit der jetzigen
//     Kartenzahl neu ab (blass, solange noch nichts gespielt wurde).
//   „neu“ (_m5vNeu()): wieder 23 Karten, das Album ist leer.
// Wer waehrend einer Bewegung „+ 1 Karte“ drueckt, laesst die laufende
// Bewegung sofort ankommen; dann geschieht das Neue (Bauart m5-malkreuz).
// Eine Sprungmarke, „noch einmal“ und „neu“ brechen ab und bauen neu auf.
//
// Statuszeilen (woertlich aus dem Bauplan, alle mit Wert mehr als 18 Zeichen
// – simfakten.js). Sie folgen dem Bild: Eine Zahl steht erst in der Anzeige,
// wenn sie im Bild angekommen ist.
//   _m5v-aufgabe  „Aufgabe: 23 Karten, 4 auf jede Seite“
//   _m5v-karten   „Karten noch nicht im Album: 19“ (zaehlt herunter; Karten in
//                 der Ablage und auf dem Umriss sind NICHT im Album)
//   _m5v-seiten   „Volle Albumseiten: 5“ (zaehlt hoch, Start 0)
//   _m5v-rest     „Übrige Karten (Rest): 3“ (vorher „…“)
//   _m5v-kurz     am Ende „Kurz geschrieben: 23 : 4 = 5 Rest 3“ bzw.
//                 „Kurz geschrieben: 24 : 4 = 6“ (vorher „…“)
//   _m5v-grenze   nur an der Grenze (siehe oben), sonst ausgeblendet
//   _m5v-lehrkraft Hinweis fuer die Lehrkraft (siehe unten)
//
// Werte (nachgerechnet, simcheck/werte.js):
//   21 : 4 → 5 volle Seiten, Rest 1   „Kurz geschrieben: 21 : 4 = 5 Rest 1“
//   22 : 4 → 5 volle Seiten, Rest 2   „Kurz geschrieben: 22 : 4 = 5 Rest 2“
//   23 : 4 → 5 volle Seiten, Rest 3   „Kurz geschrieben: 23 : 4 = 5 Rest 3“
//   24 : 4 → 6 volle Seiten, Rest 0   „Kurz geschrieben: 24 : 4 = 6“
//   „+ 1 Karte“ ab 23 : 4 → wie 24 : 4 (Aufgabe: 24 Karten …).
// Start: 23 Karten, das Album ist leer (die Karten fallen beim Oeffnen ins Feld).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen):
//   23 : 4 – die 5. Seite fuellt sich (dort hat Tarek aufgehoert): Lichtring
//     um diese Seite, sie leuchtet 2,6 s nach. Das widerlegt „7 Karten übrig“.
//   24 : 4 – die 6. Seite (die bei 23 : 4 die Ablage war) wird voll: Lichtring.
//   „+ 1 Karte“ – aus der Ablage wird eine volle Seite: Lichtring dort.
//   Gilt fuer die KARTENZAHL (23 bzw. 24), auch nach „noch einmal“.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-plus-schriftlich / m5-verteilen, im
// Container <div class="fpm-lehrkraft">, damit simfakten.js die Zeile
// ueberspringen kann – Bauplan V3). Eigene Zeile UNTER den Heftknoepfen,
// davor klein „Für die Lehrkraft:“, Reihenfolge wie im Bauplan:
//   „Pause“ ↔ „weiter“ (_m5vAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links im Bild (Stelle wie in m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m5vTempo()): ein Drittel so schnell.
//   „Halt nach 4 Seiten: aus“ ↔ „… an“ (_m5vHaltSchalter()): Tareks Stelle.
//     Der Ablauf haelt von selbst an, sobald 4 Seiten voll sind und BEVOR die
//     5. Seite erscheint: Die uebrigen Karten im Feld sind bernsteinfarben
//     eingerahmt, oben rechts steht das Schild „Nach 4 Seiten: / noch 7
//     Karten“, die Hinweiszeile sagt „Halt: Nach 4 Seiten sind noch 7 Karten
//     übrig.“ (bei 23 : 4; 21 : 4 → 5, 22 : 4 → 6, 24 : 4 → 8). Dann ist Pause;
//     „weiter“ fuellt die 5. Seite.
//   Nur das wechselnde Wort steht in einem eigenen <span> (_m5v-tempo-an,
//   _m5v-halt-an), damit die Aufschrift nicht als Statuszeile in den
//   Faktendump geraet.
// Hinweiszeile _m5v-lehrkraft (in der Pause „lmp-status off“, sonst „on“)
// nennt immer die Einstellung, so aendert JEDER Lehrkraft-Knopf eine Zeile
// (simfakten.js legt ihn sonst einmal um und laesst ihn umgelegt stehen):
//   sonst  „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal, Halt nach 4 Seiten: aus.“
//   Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. Tempo: …“
//   Halt   „Halt: Nach 4 Seiten sind noch 7 Karten übrig.“
// So ist es gebaut:
//   * EIN Zeitfaktor (_m5vZeitfaktor: 0 in der Pause, 1/3 langsam, 1 normal)
//     an der einen Stelle, an der dt in _m5vUpdate hineingeht. Ohne Zeit kein
//     Schritt im Ablauf (`dt > 0`). Voreinstellung: Faktor 1.
//   * Der Halt ist ein EREIGNIS im Ablauf (Zeitpunkt _m5vHaltZeit wird
//     ueberschritten), keine Zeitmessung.
//   * In der Pause bewegt „+ 1 Karte“ nichts: Steht eine Bewegung, entfaellt
//     der Druck; steht keine, wird er VORGEMERKT und beginnt mit „weiter“.
//     Das Schild „Pause“ leuchtet dabei kurz auf (in echter Zeit).
//     Eine Sprungmarke, „noch einmal“ und „neu“ heben die Pause auf; Tempo
//     und Halt bleiben stehen (die Lehrkraft stellt sie einmal ein).
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „kleiner“, „Probe“,
// „Startzahl“, die Regel als Satz. Keine Namen, keine Punkte, keine Zeitmessung.
// ════════════════════════════════════════════════════════════════════════
let _m5v = null;
const _m5vSTART = 23, _m5vJE = 4, _m5vMAX = 28;
const _m5vREIHE = ['21', '22', '23', '24'];
const _m5vK = {
  // Karte: Breite, Hoehe
  CW: 14, CH: 18,
  // Kartenfeld (oben, mittig): Mitte der ersten Karte, Abstand, Fuenferluecke, Reihen
  FX: 130, FP: 17, F5: 7, FY: [50, 73, 96],
  // Album: Band, Seiten (linke Kante der ersten, Abstand, oben, Breite, Hoehe),
  // Fach (Rand, Breite, Hoehe, Luecke), Nummernkreis
  BX0: 5, BX1: 353, BY0: 128, BY1: 207,
  PX0: 10, PP: 49, PY0: 131, PW: 44, PH: 52,
  PAD: 4, SW: 16, SH: 20, SG: 4, NY: 195, NR: 8,
  // Ablage „übrig“ (gleiche Faecher wie eine Seite), Klammer darueber
  TX0: 360, KLY: 127, KLH: 7, UEY: 116,
  // Zettel „Kurz geschrieben“, Halt-Schild
  ZX0: 60, ZX1: 360, ZY0: 212, ZY1: 244,
  HX0: 309, HX1: 416, HY0: 46, HY1: 96,
  // Zeiten in s – Aufgabe abspielen
  T_AUF: 0.45, T_FUELL: 0.3, T_POP: 0.2, T_ALT: 0.25,
  T_SEITE: 0.6, T_SEIN: 0.15, T_ABFLUG: 0.08, STAG: 0.07, T_FLUG: 0.3,
  R_EIN: 0.25, R_AB: 0.2, R_STAG: 0.08, R_FLUG: 0.35, R_GLUEH: 0.75, R_GLUEH_D: 0.6,
  R_TAB: 1.4, R_TSTAG: 0.06, R_TFLUG: 0.45, R_ENDE: 2.0, OHNE_REST: 0.1,
  // Zeiten in s – „+ 1 Karte“
  P_AB: 0.2, P_FLUG: 0.45, P_ENDE: 0.7, P_MAB: 0.85, P_MSTAG: 0.07, P_MFLUG: 0.42, P_ENDE4: 1.55,
  T_ZETTEL: 0.4,
  // Farben
  KARTE: '#4338ca', SEITE: '#047857', REST: '#c2410c', TINTE: '#0f172a', GRAU: '#64748b'
};

// ── Ablauf: alles aus der Ablaufzeit ─────────────────────────────────────
function _m5vSeiten(n) { return Math.floor(n / _m5vJE); }
function _m5vRest(n) { return n % _m5vJE; }
// Aufgabe abspielen: Seite i beginnt, Karte m (0 … 4p−1) fliegt los / landet.
function _m5vSeitenStart(i) { return _m5vK.T_AUF + i * _m5vK.T_SEITE; }
function _m5vAb(m) { return _m5vSeitenStart(Math.floor(m / 4)) + _m5vK.T_ABFLUG + (m % 4) * _m5vK.STAG; }
function _m5vLand(m) { return _m5vAb(m) + _m5vK.T_FLUG; }
function _m5vVoll(i) { return _m5vLand(4 * i + 3); }
// Restphase: Umriss erscheint, Restkarte j fliegt hinein, Faecher gluehen, Karte j in die Ablage.
function _m5vRStart(n) { return _m5vK.T_AUF + _m5vSeiten(n) * _m5vK.T_SEITE; }
function _m5vRAb(n, j) { return _m5vRStart(n) + _m5vK.R_AB + j * _m5vK.R_STAG; }
function _m5vRLand(n, j) { return _m5vRAb(n, j) + _m5vK.R_FLUG; }
function _m5vTAb(n, j) { return _m5vRStart(n) + _m5vK.R_TAB + j * _m5vK.R_TSTAG; }
function _m5vTLand(n, j) { return _m5vTAb(n, j) + _m5vK.R_TFLUG; }
function _m5vEnde(n) { return _m5vRStart(n) + (_m5vRest(n) ? _m5vK.R_ENDE : _m5vK.OHNE_REST); }
// Halt nach 4 Seiten: die 4. Seite ist voll (T_AUF + 2,39 s), die 5. noch nicht da (T_AUF + 2,4 s).
function _m5vHaltZeit() { return _m5vSeitenStart(4) - 0.005; }
// „+ 1 Karte“: Karte s (0 … 3) wandert aus der Ablage auf die neue Seite.
function _m5vPAb(s) { return _m5vK.P_MAB + s * _m5vK.P_MSTAG; }
function _m5vPLand(s) { return _m5vPAb(s) + _m5vK.P_MFLUG; }
// Welche Seite bekommt den Lichtring? (-1: keine)
function _m5vAhaSeite(L) {
  if (!L) return -1;
  if (L.art === 'plus') return L.r + 1 === _m5vJE ? L.p : -1;
  return L.n === 23 ? 4 : L.n === 24 ? 5 : -1;
}

// Stand: Karten im Album, volle Seiten, Karten in der Ablage, Karten auf dem Tisch, fertig?
function _m5vStandAus(z) {
  const L = z.lauf;
  if (!L) {
    if (!z.gespielt) return { imAlbum: 0, voll: 0, ablage: 0, feld: z.n, fertig: true };
    return { imAlbum: 4 * z.voll, voll: z.voll, ablage: z.rest, feld: 0, fertig: true };
  }
  const at = L.at;
  if (L.art === 'spiel') {
    const n = L.n, p = _m5vSeiten(n), r = _m5vRest(n);
    let weg = 0, imAlbum = 0, voll = 0, ablage = 0;
    for (let m = 0; m < 4 * p; m++) { if (at >= _m5vAb(m)) weg++; if (at >= _m5vLand(m)) imAlbum++; }
    for (let i = 0; i < p; i++) if (at >= _m5vVoll(i)) voll++;
    for (let j = 0; j < r; j++) { if (at >= _m5vRAb(n, j)) weg++; if (at >= _m5vTLand(n, j)) ablage++; }
    return { imAlbum, voll, ablage, feld: n - weg, fertig: at >= _m5vEnde(n) };
  }
  const vier = L.r + 1 === _m5vJE;
  let imAlbum = 4 * L.p, voll = L.p, ablage = L.r + (at >= _m5vK.P_AB + _m5vK.P_FLUG ? 1 : 0);
  if (vier) {
    for (let s = 0; s < 4; s++) { if (at >= _m5vPAb(s)) ablage--; if (at >= _m5vPLand(s)) imAlbum++; }
    if (at >= _m5vPLand(3)) voll++;
  }
  return { imAlbum, voll, ablage, feld: at < _m5vK.P_AB ? 1 : 0,
           fertig: at >= (vier ? _m5vK.P_ENDE4 : _m5vK.P_ENDE) };
}

function _m5vInit() {
  _m5v = { t: 0, n: _m5vSTART, gespielt: false, voll: 0, rest: 0, lauf: null,
           ein: { von: 0, bis: _m5vSTART, at: 0 },        // beim Oeffnen fallen 23 Karten ins Feld
           alt: null, zettel: 0, zettelAn: false,
           seitePop: [9, 9, 9, 9, 9, 9, 9], ablagePop: 9,
           ahaSeite: -1, ahaGlanz: 0, wackel: 0, grenze: '', blink: 0, vorgemerkt: false,
           pause: false, langsam: false, haltAn: false, halt: null,   // Lehrkraft-Einstellungen
           fx: { teile: [] } };
  _m5v.stand = _m5vStandAus(_m5v);
}
// Was gerade im Album steht, blendet aus; die fehlenden Karten springen zurueck ins Feld.
function _m5vAufraeumen(n) {
  const z = _m5v, st = z.stand;
  z.alt = (st.voll || st.ablage) ? { voll: st.voll, ablage: st.ablage, at: 0 } : null;
  z.ein = { von: Math.min(st.feld, n), bis: n, at: 0 };
  z.n = n; z.zettel = 0; z.zettelAn = false;
  z.ahaGlanz = 0; z.ahaSeite = -1; z.wackel = 0; z.grenze = '';
  z.seitePop = [9, 9, 9, 9, 9, 9, 9]; z.ablagePop = 9;
  z.fx.teile.length = 0;
  z.pause = false; z.halt = null; z.vorgemerkt = false;   // neu laden hebt die Pause auf
}
function _m5vSpielen(n) {
  const z = _m5v;
  _m5vAufraeumen(n);
  z.lauf = { art: 'spiel', n, at: 0, angehalten: false };
  z.stand = _m5vStandAus(z);
}
function _m5vHTML() {
  const marke = k => `<button class="sim-btn" id="_m5v-b-${k}" onclick="_m5vAufgabe('${k}')">${k}&nbsp;:&nbsp;4</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Karten bleiben übrig?</h3>
    <div class="fpm-note" style="margin-top:2px">Auf jede Seite passen 4 Karten. Wähle eine Aufgabe und sieh zu.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5v-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5vREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_m5v-plus" onclick="_m5vPlus()">+&nbsp;1&nbsp;Karte</button>
          <button class="sim-btn" id="_m5v-nochmal" onclick="_m5vNochmal()">noch einmal</button>
          <button class="sim-btn" onclick="_m5vNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft"><div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
          <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
          <button class="sim-btn" id="_m5v-pause" onclick="_m5vAnhalten()">Pause</button>
          <button class="sim-btn" id="_m5v-tempo" onclick="_m5vTempo()">Tempo: <span id="_m5v-tempo-an">normal</span></button>
          <button class="sim-btn" id="_m5v-halt" onclick="_m5vHaltSchalter()">Halt nach 4 Seiten: <span id="_m5v-halt-an">aus</span></button>
        </div></div>
        <div class="lmp-status on" id="_m5v-lehrkraft" style="margin-top:4px"></div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5v-aufgabe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5v-karten" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5v-seiten" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5v-rest" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5v-kurz" style="margin-top:6px"></div>
        <div class="lmp-status off" id="_m5v-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 23 Karten, das Album ist leer</p>
  </div>`;
}
function _m5vSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
function _m5vStatus() {
  if (!_m5v) return;
  const z = _m5v, K = _m5vK, st = z.stand;
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const fertig = z.gespielt && !z.lauf;
  _m5vSetze('_m5v-aufgabe', 'Aufgabe: ' + f(z.n + ' Karten', K.KARTE) + ', 4 auf jede Seite');
  _m5vSetze('_m5v-karten', 'Karten noch nicht im Album: ' + f(z.n - st.imAlbum, K.KARTE));
  _m5vSetze('_m5v-seiten', 'Volle Albumseiten: ' + f(st.voll, K.SEITE));
  _m5vSetze('_m5v-rest', 'Übrige Karten (Rest): ' + (fertig ? f(z.rest, K.REST) : '…'));
  _m5vSetze('_m5v-kurz', 'Kurz geschrieben: ' + (!fertig ? '…'
    : f(z.n, K.KARTE) + ' : 4 = ' + f(z.voll, K.SEITE) + (z.rest ? ' ' + f('Rest ' + z.rest, K.REST) : '')));
  const g = _m5vSetze('_m5v-grenze', z.grenze);
  if (g && g.style) g.style.display = z.grenze ? '' : 'none';
  const aktiv = z.gespielt || !!z.lauf;
  _m5vREIHE.forEach(k => {
    const b = document.getElementById('_m5v-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', aktiv && +k === z.n);
  });
  for (const id of ['_m5v-plus', '_m5v-nochmal']) {
    const b = document.getElementById(id);
    if (b) { b.disabled = !aktiv; if (b.style) b.style.opacity = aktiv ? '' : '0.45'; }
  }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m5vSetze('_m5v-pause', z.pause ? 'weiter' : 'Pause');
  _m5vSetze('_m5v-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m5vSetze('_m5v-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _m5vSetze('_m5v-lehrkraft', _m5vHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m5v-pause', z.pause], ['_m5v-halt', z.haltAn]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m5vHinweis() {
  const z = _m5v;
  if (z.halt) return 'Halt: Nach 4 Seiten sind noch ' + z.halt.uebrig + ' Karten übrig.';
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
                  : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Halt nach 4 Seiten: ' + (z.haltAn ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m5vAufgabe(k) {
  const n = parseInt(k, 10);
  if (!_m5v || _m5vREIHE.indexOf(String(k)) < 0) return;
  _m5vSpielen(n);
  _m5vStatus();
}
function _m5vNochmal() {
  if (!_m5v || !(_m5v.gespielt || _m5v.lauf)) return;
  _m5vSpielen(_m5v.n);
  _m5vStatus();
}
function _m5vNeu() {
  if (!_m5v) return;
  const z = _m5v;
  _m5vAufraeumen(_m5vSTART);
  z.lauf = null; z.gespielt = false; z.voll = 0; z.rest = 0;
  z.stand = _m5vStandAus(z);
  _m5vStatus();
}
// Die laufende Bewegung sofort ankommen lassen (Endstand setzen, ohne Lichtring).
function _m5vAnkommen() {
  const z = _m5v, L = z.lauf;
  if (!L) return;
  if (L.art === 'spiel') { z.voll = _m5vSeiten(L.n); z.rest = _m5vRest(L.n); }
  else { const r = L.r + 1; z.voll = L.p + (r === _m5vJE ? 1 : 0); z.rest = r % _m5vJE; }
  z.gespielt = true; z.lauf = null; z.halt = null;
  z.ein = { von: 0, bis: 0, at: 9 };
  z.stand = _m5vStandAus(z);
  z.zettel = 0; z.zettelAn = true;                  // der Zettel gleitet herein
}
function _m5vPlus() {
  if (!_m5v) return;
  const z = _m5v;
  if (!(z.gespielt || z.lauf)) return;              // erst nach einer Aufgabe
  if (z.pause) {                                    // in der Pause: vormerken oder entfallen lassen
    z.blink = 0.6;
    if (!z.lauf) z.vorgemerkt = true;
    _m5vStatus();
    return;
  }
  if (z.lauf) _m5vAnkommen();
  if (z.n >= _m5vMAX) {
    z.wackel = 0.45; z.grenze = 'Mehr Karten passen nicht ins Album.';
    _m5vStatus();
    return;
  }
  z.grenze = '';
  z.lauf = { art: 'plus', p: z.voll, r: z.rest, at: 0 };
  z.n += 1;
  z.zettel = 0; z.zettelAn = false;
  z.ahaGlanz = 0; z.ahaSeite = -1;
  z.stand = _m5vStandAus(z);
  _m5vStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m5vAnhalten() {
  if (!_m5v) return;
  const z = _m5v;
  if (z.pause) {
    z.pause = false; z.halt = null; z.blink = 0;
    if (z.vorgemerkt) { z.vorgemerkt = false; _m5vPlus(); return; }
  } else z.pause = true;
  _m5vStatus();
}
function _m5vTempo() {
  if (!_m5v) return;
  _m5v.langsam = !_m5v.langsam;
  _m5vStatus();
}
function _m5vHaltSchalter() {
  if (!_m5v) return;
  _m5v.haltAn = !_m5v.haltAn;
  _m5vStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m5vZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5vUpdate(dt) {
  if (!_m5v) return;
  const z = _m5v, K = _m5vK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);             // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m5vZeitfaktor(z);                     // ab hier Sim-Zeit
  z.t += dt;
  z.ein.at += dt;
  if (z.alt) { z.alt.at += dt; if (z.alt.at >= K.T_ALT) z.alt = null; }
  z.wackel = Math.max(0, z.wackel - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.ablagePop += dt;
  for (let i = 0; i < z.seitePop.length; i++) z.seitePop[i] += dt;
  if (z.zettelAn) z.zettel = Math.min(1, z.zettel + dt / K.T_ZETTEL);
  const L = z.lauf;
  if (L && dt > 0) {                                // ohne Zeit kein Schritt im Ablauf
    const vor = L.at;
    L.at += dt;
    if (L.art === 'spiel' && z.haltAn && !L.angehalten && _m5vSeiten(L.n) >= 4 && L.n > 16) {
      const th = _m5vHaltZeit();
      if (vor < th && L.at >= th) {                 // Halt: 4 Seiten voll, die 5. noch nicht da
        L.at = th; L.angehalten = true;
        z.pause = true; z.halt = { uebrig: L.n - 16 };
      }
    }
    const st = _m5vStandAus(z), alt = z.stand;
    let neu = !!z.halt && !alt.halt;
    if (st.voll !== alt.voll || st.imAlbum !== alt.imAlbum || st.feld !== alt.feld) neu = true;
    if (st.ablage !== alt.ablage) { z.ablagePop = 0; neu = true; }
    for (let i = alt.voll; i < st.voll; i++) {
      z.seitePop[i] = 0;
      if (i === _m5vAhaSeite(L)) {                  // Aha: Lichtring um diese Seite
        z.ahaSeite = i; z.ahaGlanz = 2.6;
        _bioFxWelle(z.fx.teile, K.PX0 + i * K.PP + K.PW / 2, K.PY0 + K.PH / 2, '#f59e0b', 52);
      }
    }
    // Im Halt steht die Zeit: Die Nummer der 4. Seite stuende sonst eingefroren klein da.
    if (z.halt) for (let i = 0; i < st.voll; i++) z.seitePop[i] = Math.max(z.seitePop[i], 0.3);
    st.halt = !!z.halt;
    z.stand = st;
    if (st.fertig) { _m5vAnkommen(); neu = true; }
    if (neu) _m5vStatus();
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Orte ────────────────────────────────────────────────────────────────
// Platz q (0 … 27) im Kartenfeld: Reihen zu 10, nach fuenf eine Luecke.
function _m5vFeldPlatz(q) {
  const K = _m5vK, r = Math.floor(q / 10), j = q % 10;
  return { x: K.FX + j * K.FP + (j >= 5 ? K.F5 : 0), y: K.FY[r] };
}
// Fach s (0 … 3, zeilenweise) der Seite i bzw. der Ablage (i = 'ablage').
function _m5vFach(i, s) {
  const K = _m5vK, x0 = i === 'ablage' ? K.TX0 : K.PX0 + i * K.PP;
  return { x: x0 + K.PAD + K.SW / 2 + (s % 2) * (K.SW + K.SG),
           y: K.PY0 + K.PAD + K.SH / 2 + Math.floor(s / 2) * (K.SH + K.SG) };
}
// Flugbahn von a nach b (u = 0 … 1), im Bogen nach oben.
function _m5vBahn(a, b, u, bogen) {
  const e = _bioFxEase.sanft(_bioFxKlemme(u));
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e - bogen * Math.sin(Math.PI * e), k: 1 };
}

// Was gerade zu sehen ist: Seiten, Umriss, Ablage, Karten im Feld, fliegende Karten.
function _m5vSzene() {
  const z = _m5v, K = _m5vK, L = z.lauf, E = _bioFxEase, kl = _bioFxKlemme;
  const S = { seiten: [], umriss: null, ablage: [], feld: 0, flug: [] };
  const voll = i => ({ i, a: 1, voll: true, karten: [0, 1, 2, 3] });
  if (!L) {
    if (!z.gespielt) { S.feld = z.n; return S; }
    for (let i = 0; i < z.voll; i++) S.seiten.push(voll(i));
    if (z.rest) S.umriss = { i: z.voll, a: 1, karten: [], glut: 0, blass: true };
    for (let s = 0; s < z.rest; s++) S.ablage.push(s);
    return S;
  }
  const at = L.at;
  if (L.art === 'spiel') {
    const n = L.n, p = _m5vSeiten(n), r = _m5vRest(n);
    let weg = 0;
    for (let i = 0; i < p; i++) {
      const t0 = _m5vSeitenStart(i);
      if (at < t0) break;
      const seite = { i, a: E.sanft(kl((at - t0) / K.T_SEIN)), voll: at >= _m5vVoll(i), karten: [] };
      for (let s = 0; s < 4; s++) {
        const m = 4 * i + s, ab = _m5vAb(m);
        if (at < ab) continue;
        weg++;
        if (at >= _m5vLand(m)) seite.karten.push(s);
        else S.flug.push(_m5vBahn(_m5vFeldPlatz(n - 1 - m), _m5vFach(i, s), (at - ab) / K.T_FLUG, 16));
      }
      S.seiten.push(seite);
    }
    if (r && at >= _m5vRStart(n)) {
      const u = { i: p, a: E.sanft(kl((at - _m5vRStart(n)) / K.R_EIN)), karten: [], glut: 0,
                  blass: at >= _m5vTLand(n, r - 1) };
      const g = (at - _m5vRStart(n) - K.R_GLUEH) / K.R_GLUEH_D;
      if (g > 0 && g < 1) u.glut = Math.sin(Math.PI * g);
      for (let j = 0; j < r; j++) {
        const ab = _m5vRAb(n, j), land = _m5vRLand(n, j), tab = _m5vTAb(n, j);
        if (at < ab) continue;
        weg++;
        if (at >= _m5vTLand(n, j)) S.ablage.push(j);
        else if (at >= tab) S.flug.push(_m5vBahn(_m5vFach(p, j), _m5vFach('ablage', j), (at - tab) / K.R_TFLUG, 10));
        else if (at >= land) u.karten.push(j);
        else S.flug.push(_m5vBahn(_m5vFeldPlatz(r - 1 - j), _m5vFach(p, j), (at - ab) / K.R_FLUG, 16));
      }
      S.umriss = u;
    }
    S.feld = n - weg;
    return S;
  }
  // „+ 1 Karte“: springt im Feld auf (Platz 0), fliegt in die Ablage; bei 4 wandern sie auf die Seite.
  const p = L.p, r = L.r, vier = r + 1 === _m5vJE, da = at >= K.P_AB + K.P_FLUG;
  for (let i = 0; i < p; i++) S.seiten.push(voll(i));
  const quelle = _m5vFeldPlatz(0);
  if (at < K.P_AB) S.flug.push({ x: quelle.x, y: quelle.y, k: Math.max(0.3, E.federn(kl(at / K.P_AB))) });
  else if (!da) S.flug.push(_m5vBahn(quelle, _m5vFach('ablage', r), (at - K.P_AB) / K.P_FLUG, 22));
  if (vier) {
    const fertig = at >= _m5vPLand(3), karten = [];
    for (let s = 0; s < 4; s++) {
      const ab = _m5vPAb(s);
      if (at >= _m5vPLand(s)) karten.push(s);
      else if (at >= ab) S.flug.push(_m5vBahn(_m5vFach('ablage', s), _m5vFach(p, s), (at - ab) / K.P_MFLUG, 12));
      else if (s < r || da) S.ablage.push(s);
    }
    if (fertig) S.seiten.push({ i: p, a: 1, voll: true, karten });
    else S.umriss = { i: p, a: 1, karten, glut: 0, blass: false };
  } else {
    for (let s = 0; s < r; s++) S.ablage.push(s);
    if (da) S.ablage.push(r);
    S.umriss = { i: p, a: r ? 1 : E.sanft(kl((at - K.P_AB) / K.R_EIN)), karten: [], glut: 0, blass: true };
  }
  return S;
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5vText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m5vK.TINTE;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Eine Karte (Mitte x, y; k = Massstab; a = Deckkraft): Rueckseite, fuer alle gleich.
function _m5vKarte(ctx, x, y, k, a) {
  if (a <= 0.01 || k <= 0.05) return;
  const K = _m5vK, w = K.CW * k, h = K.CH * k, r = 2.5 * k;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.fillStyle = 'rgba(15,23,42,0.18)';
  _bioFxRundRect(ctx, x - w / 2 + 1, y - h / 2 + 1.5, w, h, r); ctx.fill();
  ctx.fillStyle = '#4f46e5'; ctx.strokeStyle = '#312e81'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x - w / 2, y - h / 2, w, h, r); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 0.8;
  _bioFxRundRect(ctx, x - w / 2 + 2 * k, y - h / 2 + 2 * k, w - 4 * k, h - 4 * k, 1.5 * k); ctx.stroke();
  ctx.fillStyle = '#c7d2fe';
  ctx.beginPath();
  ctx.moveTo(x, y - 4.5 * k); ctx.lineTo(x + 3.2 * k, y); ctx.lineTo(x, y + 4.5 * k); ctx.lineTo(x - 3.2 * k, y);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Das leere Album: helles Band mit der Aufschrift „Album“.
function _m5vAlbum(ctx, dx) {
  const K = _m5vK;
  ctx.save();
  ctx.translate(dx, 0);
  ctx.fillStyle = '#e8edf4'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.BX0, K.BY0, K.BX1 - K.BX0, K.BY1 - K.BY0, 10); ctx.fill(); ctx.stroke();
  ctx.restore();
  _m5vText(ctx, 'Album', K.BX0 + 5 + dx, K.BY0 - 6, 12, K.GRAU, 'left', '700');
}
// Seite i: art 'seite' (weiss, gruener Rand) oder 'umriss' (gestrichelt). glut: leere Faecher orange.
function _m5vSeite(ctx, i, a, art, karten, glut, blass) {
  const K = _m5vK, x0 = i === 'ablage' ? K.TX0 : K.PX0 + i * K.PP, y0 = K.PY0;
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a) * (blass ? 0.7 : 1);
  if (art === 'seite') {
    ctx.fillStyle = 'rgba(15,23,42,0.10)';
    _bioFxRundRect(ctx, x0 + 2, y0 + 3, K.PW, K.PH, 5); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = K.SEITE; ctx.lineWidth = 1.8;
    _bioFxRundRect(ctx, x0, y0, K.PW, K.PH, 5); ctx.fill(); ctx.stroke();
  } else if (art === 'umriss') {
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 3]);
    _bioFxRundRect(ctx, x0, y0, K.PW, K.PH, 5); ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
  } else {                                           // Ablage: flacher Kasten
    ctx.fillStyle = '#fff7ed'; ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 1.6;
    _bioFxRundRect(ctx, x0, y0, K.PW, K.PH, 7); ctx.fill(); ctx.stroke();
  }
  for (let s = 0; s < 4; s++) {
    const p = _m5vFach(i, s), fx = p.x - K.SW / 2, fy = p.y - K.SH / 2;
    const drin = karten.indexOf(s) >= 0;
    if (!drin && glut > 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(251,146,60,' + (0.65 * glut).toFixed(3) + ')';
      ctx.strokeStyle = 'rgba(234,88,12,' + (0.9 * glut).toFixed(3) + ')'; ctx.lineWidth = 1.6;
      _bioFxRundRect(ctx, fx, fy, K.SW, K.SH, 3); ctx.fill(); ctx.stroke();
      ctx.restore();
    } else if (!drin) {
      ctx.strokeStyle = art === 'ablage' ? '#fdba74' : '#cbd5e1'; ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      _bioFxRundRect(ctx, fx, fy, K.SW, K.SH, 3); ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  ctx.restore();
  for (const s of karten) {
    const p = _m5vFach(i, s);
    _m5vKarte(ctx, p.x, p.y, 1, Math.min(1, a) * (blass ? 0.7 : 1));
  }
}
// Nummer unter einer vollen Seite (springt beim Vollwerden auf).
function _m5vNummer(ctx, i, a) {
  const z = _m5v, K = _m5vK, x = K.PX0 + i * K.PP + K.PW / 2, y = K.NY;
  const t = z.seitePop[i], k = t < 0.3 ? Math.max(0.3, _bioFxEase.federn(t / 0.3)) : 1;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = K.SEITE;
  ctx.beginPath(); ctx.arc(0, 0, K.NR, 0, Math.PI * 2); ctx.fill();
  _m5vText(ctx, String(i + 1), 0, 4, 11, '#ffffff');
  ctx.restore();
}
// Geschweifte Klammer ueber der Ablage, Spitze nach oben, darueber „übrig“.
function _m5vKlammer(ctx, dx) {
  const K = _m5vK, x0 = K.TX0 + 2 + dx, x1 = K.TX0 + K.PW - 2 + dx, y = K.KLY, h = K.KLH;
  const m = (x0 + x1) / 2, q = h / 2;
  ctx.save();
  ctx.strokeStyle = K.REST; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.quadraticCurveTo(x0, y - q, x0 + q, y - q);
  ctx.lineTo(m - q, y - q);
  ctx.quadraticCurveTo(m, y - q, m, y - h);
  ctx.quadraticCurveTo(m, y - q, m + q, y - q);
  ctx.lineTo(x1 - q, y - q);
  ctx.quadraticCurveTo(x1, y - q, x1, y);
  ctx.stroke();
  ctx.restore();
  const pop = _m5v.ablagePop < 0.3 ? 1 + 0.15 * Math.sin(Math.PI * _m5v.ablagePop / 0.3) : 1;
  ctx.save();
  ctx.translate(m, K.UEY - 4); ctx.scale(pop, pop);
  _m5vText(ctx, 'übrig', 0, 4, 12, K.REST, 'center', '700');
  ctx.restore();
}
// Halt: die uebrigen Karten im Feld einrahmen, oben rechts das Schild.
function _m5vHaltZeichnen(ctx, feld) {
  const z = _m5v, K = _m5vK;
  if (!z.halt) return;
  if (feld > 0) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (let q = 0; q < feld; q++) {
      const p = _m5vFeldPlatz(q);
      x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y);
    }
    ctx.save();
    ctx.fillStyle = 'rgba(252,211,77,0.35)'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.5;
    _bioFxRundRect(ctx, x0 - K.CW / 2 - 5, y0 - K.CH / 2 - 5, x1 - x0 + K.CW + 10, y1 - y0 + K.CH + 10, 7);
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.5;
  _bioFxRundRect(ctx, K.HX0, K.HY0, K.HX1 - K.HX0, K.HY1 - K.HY0, 9); ctx.fill(); ctx.stroke();
  const mx = (K.HX0 + K.HX1) / 2, platz = K.HX1 - K.HX0 - 14;
  // Jede Zeile passt in das Schild: Ist sie zu breit, wird nur sie kleiner (nicht unter 11 px).
  const zeile = (s, y, gr, gew) => {
    ctx.font = gew + ' ' + gr + 'px sans-serif';
    const br = ctx.measureText(s).width;
    if (br > platz) gr = Math.max(11, Math.floor(gr * platz / br));
    _m5vText(ctx, s, mx, y, gr, '#78350f', 'center', gew);
  };
  zeile('Nach 4 Seiten:', K.HY0 + 21, 13, '600');
  zeile('noch ' + z.halt.uebrig + ' Karten', K.HY0 + 40, 14, '700');
  ctx.restore();
}
// Zettel „Kurz geschrieben“ unten – gleitet am Ende herein; Teile in den Farben ihres Bildes.
function _m5vZettel(ctx) {
  const z = _m5v, K = _m5vK, e = _bioFxEase.sanft(z.zettel);
  if (e <= 0.01 || !z.gespielt || z.lauf) return;
  const dy = 6 * (1 - e), x0 = K.ZX0, x1 = K.ZX1, y0 = K.ZY0 + dy, y1 = K.ZY1 + dy;
  ctx.save();
  ctx.globalAlpha = e;
  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  _bioFxRundRect(ctx, x0 + 2, y0 + 2, x1 - x0, y1 - y0, 8); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 8); ctx.fill(); ctx.stroke();
  _m5vText(ctx, 'Kurz geschrieben:', x0 + 10, y0 + 21, 11, K.GRAU, 'left', '600');
  const teile = [[String(z.n), K.KARTE], [':', K.TINTE], ['4', K.TINTE], ['=', K.TINTE], [String(z.voll), K.SEITE]];
  if (z.rest) teile.push(['Rest', K.REST], [String(z.rest), K.REST]);
  const gr = 19;
  ctx.font = '700 ' + gr + 'px sans-serif';
  const br = teile.map(t => ctx.measureText(t[0]).width), luft = gr * 0.3;
  const ges = br.reduce((s, b) => s + b, 0) + luft * (teile.length - 1);
  const links = x0 + 118, rechts = x1 - 10;
  let x = (links + rechts) / 2 - ges / 2;
  teile.forEach((t, i) => { _m5vText(ctx, t[0], x, y0 + 23, gr, t[1], 'left'); x += br[i] + luft; });
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
function _m5vPauseSchild(ctx) {
  const z = _m5v, w = 64, h = 25, x = 8, y = 8;
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
  _m5vText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
function _m5vDraw(ctx, cv) {
  if (!_m5v) return;
  const z = _m5v, K = _m5vK, W = cv.width, H = cv.height, E = _bioFxEase;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const dx = z.wackel > 0 ? Math.sin(z.wackel * 40) * 3 * (z.wackel / 0.45) : 0;
  const S = _m5vSzene();
  _m5vAlbum(ctx, 0);
  _m5vKlammer(ctx, dx);
  // altes Album blendet aus
  if (z.alt) {
    const a = 1 - _bioFxKlemme(z.alt.at / K.T_ALT);
    for (let i = 0; i < z.alt.voll; i++) { _m5vSeite(ctx, i, a, 'seite', [0, 1, 2, 3], 0, false); _m5vNummer(ctx, i, a); }
  }
  // Ablage (immer da) mit ihren Karten
  ctx.save(); ctx.translate(dx, 0);
  _m5vSeite(ctx, 'ablage', 1, 'ablage', S.ablage, 0, false);   // zeichnet auch die Karten darin
  if (z.alt) for (let s = 0; s < z.alt.ablage; s++) {
    const p = _m5vFach('ablage', s);
    _m5vKarte(ctx, p.x, p.y, 1, 1 - _bioFxKlemme(z.alt.at / K.T_ALT));
  }
  ctx.restore();
  // Seiten, Lichtschein der Aha-Seite, Nummern, Umriss
  for (const sd of S.seiten) {
    if (sd.i === z.ahaSeite && z.ahaGlanz > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.8) * (0.55 + 0.45 * Math.sin(z.t * Math.PI * 1.6));
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
      _bioFxRundRect(ctx, K.PX0 + sd.i * K.PP - 4, K.PY0 - 4, K.PW + 8, K.PH + 8, 8); ctx.stroke();
      ctx.restore();
    }
    _m5vSeite(ctx, sd.i, sd.a, 'seite', sd.karten, 0, false);
    if (sd.voll) _m5vNummer(ctx, sd.i, 1);
  }
  if (S.umriss) _m5vSeite(ctx, S.umriss.i, S.umriss.a, 'umriss', S.umriss.karten, S.umriss.glut, S.umriss.blass);
  // Karten im Feld (beim Laden springen die fehlenden federnd zurueck)
  _m5vHaltZeichnen(ctx, S.feld);
  for (let q = 0; q < S.feld; q++) {
    let k = 1;
    if (q >= z.ein.von && q < z.ein.bis) {
      const u = (z.ein.at - (q - z.ein.von) * (K.T_FUELL / Math.max(1, z.ein.bis - z.ein.von))) / K.T_POP;
      if (u <= 0) continue;
      k = u < 1 ? Math.max(0.3, E.federn(u)) : 1;
    }
    const p = _m5vFeldPlatz(q);
    _m5vKarte(ctx, p.x, p.y, k, 1);
  }
  // fliegende Karten zuletzt (ueber allem)
  for (const f of S.flug) _m5vKarte(ctx, f.x, f.y, f.k, 1);
  _m5vZettel(ctx);
  _bioFxDraw(ctx, z.fx.teile);
  if (z.pause) _m5vPauseSchild(ctx);
}
