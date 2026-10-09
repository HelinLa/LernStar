
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – md2 „Was zeigt das Säulendiagramm?“ (Kennung m5-saeulen,
// Praefix _m6s). Bauplan: arbeitsheft_mathe_foe5/KAPITEL8_PROFIL.md, Abschnitt
// m5-saeulen (Einheit md2; Regeln N1–N3, Lehrkraft-Zeile V3).
// Ueberschrift = Frage der Einheit: „Wie viele Kinder gehen zu Fuß?“
//
// Was man sieht: ein Blatt Karopapier (Kaestchen 12 px), darauf ein
// Saeulendiagramm. Links die Achse mit Pfeil nach oben, Zahlen an jeder
// zweiten Kaestchenlinie; unten vier Saeulenplaetze „zu Fuß“, „Rad“, „Bus“,
// „Auto“ (Symbol + Wort). Beschriftet wie ein Diagramm im Heft (Abdullah,
// 09.10.2026: „Säulendiagramme richtig beschriften“): links neben der
// Pfeilspitze der Achsentitel „Anzahl der Kinder“ (er wandert mit der Spitze,
// wenn die Einteilung wechselt), am Ende der waagerechten Achse „Schulweg“,
// rechts oben die Ueberschrift „Umfrage zum Schulweg“ (ueber der Legende).
// Daten (fest, 44 Kinder): zu Fuß 12 · Rad 8 · Bus 16 ·
// Auto 8. Jede Saeule ist 1 Kaestchen breit; die Kaestchenlinien laufen durch
// die Saeule, so ist jedes Kaestchen zaehlbar. Die gewaehlte Saeule ist blau
// (hellblau = noch nicht gezaehlt, kraeftig blau = gezaehlt), die anderen
// grau; unter der gewaehlten Saeule ist das Wort blau unterstrichen.
// Rechts oben die Legende: EIN Kaestchen (vergroessert, blau) mit so vielen
// weissen Kinderfiguren (schematisch, ohne Gesicht), wie die Einteilung sagt,
// darunter „1 Kästchen“ / „= 2 Kinder“. Dieselben Figuren erscheinen beim
// Zaehlen in den Kaestchen der blauen Saeule – Legende, Saeule und die blauen
// Zahlen der Anzeige sind durch die Farbe verbunden.
//
// Bewegung (jede Sprungmarke spielt ihre Tabellenzeile SELBST ab, N1; jede
// Zahl im Bild und in der Anzeige ist eine Funktion der Ablaufzeit L.t –
// keine Zufallszahl; die Statuszeilen folgen dem Bild):
//   Sprungmarke   0,35 s: gezaehlte Figuren blenden aus, die Legende wechselt
//                 (alte Figuren schrumpfen, neue springen ein); war eine andere
//                 Saeule blau, wandert die Farbe zu „zu Fuß“ zurueck (0,6 s).
//                 0,9 s: ALLE Saeulen wachsen oder schrumpfen gleichzeitig auf
//                 die neue Hoehe; die Zahlen der Achse gleiten mit zu ihren
//                 neuen Linien (die „12“ faehrt auf der Spitze von „zu Fuß“
//                 mit), Zahlen, die wegfallen, blenden aus. Gleiche Einteilung:
//                 keine Hoehenaenderung.
//                 Dann zaehlt die blaue Saeule von unten: Kaestchen fuer
//                 Kaestchen bekommt einen Lichtrahmen und wird kraeftig blau,
//                 seine Figuren springen nacheinander hinein (0,25 s je Kind),
//                 dann zeigt ein Schild rechts neben dem Kaestchen die
//                 Zaehlzahl (2, 4, 6 …). Es ist EIN Schild, das mit dem
//                 Zaehlen nach oben gleitet (0,15 s) – zwei Zahlen ueberdecken
//                 sich nie; die letzte steht 1,1 s und blendet dann aus.
//                 Je Kind gleich lang: 12 Kinder dauern bei jeder Einteilung
//                 3 s. Am Ende eine gestrichelte Ablese-Linie von der
//                 Saeulenspitze zur Achse; steht dort eine Zahl, wird sie blau.
//   „Säule wählen“  die blaue Farbe und die Unterstreichung wandern zur
//                 naechsten Saeule (zu Fuß → Rad → Bus → Auto → zu Fuß, 0,6 s),
//                 dann wird diese Saeule gezaehlt wie oben.
//   „nur Kästchen zählen“ (Gegenprobe, gewaehlte Saeule, jetzige Einteilung)
//                 Figuren blenden aus (0,3 s); die Kaestchen werden OHNE Figuren
//                 gezaehlt, orange (1, 2, … 6; 0,4 s je Kaestchen); dann
//                 springen alle Figuren hinein, ueber der Saeule stehen zwei
//                 Schilder: orange „6 Kästchen“, darueber blau „12 Kinder“
//                 (bleiben bis zur naechsten Handlung; reicht der Platz ueber
//                 der Saeule nicht – Bus bei 1 : 1 –, stehen sie rechts daneben;
//                 nie ueber der Achse, nie ueber dem Papierrand).
//   „neu“         sofort der Start; die Saeulen wachsen aus der Grundlinie
//                 (0,6 s, wie beim Oeffnen).
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort ankommen
// (_m6sFertig); dann geschieht das Neue. Jede Knopffolge ergibt so dieselben
// Zahlen. Dauer ab Start: „1 Kästchen = 2 Kinder“ 4,35 s bis „Kinder: 12“,
// danach 1,5 s Ausklang (die letzte Zaehlzahl blendet aus).
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_m6sMarke(1|2|4)):
//     „1 Kästchen = 1 Kind“ · „1 Kästchen = 2 Kinder“ · „1 Kästchen = 4 Kinder“
//     Der Knopf der Einteilung, die gilt (oder gerade eingestellt wird), ist
//     hervorgehoben.
//   Reihe 2: „Säule wählen“ (_m6sWaehlen()) · „nur Kästchen zählen“
//     (_m6sNurKaestchen()) · „neu“ (_m6sNeu())
//
// Statuszeilen (woertlich, jede mit mehr als 18 Zeichen):
//   _m6s-einteilung „Einteilung: 1 Kästchen = 2 Kinder“ (wechselt beim Druecken)
//   _m6s-saeule     „Gewählte Säule: zu Fuß, 6 Kästchen hoch“ (wechselt, wenn
//                   Farbe bzw. Hoehe angekommen sind)
//   _m6s-zaehlen    „Zählweg in der Säule: 2, 4, 6, 8, 10, 12“ (waechst mit;
//                   vorher „Zählweg in der Säule: …“)
//   _m6s-kinder     „Kinder in dieser Säule: 12“ (vorher „Kinder in dieser Säule: …“)
//   _m6s-alle       „Alle Kinder im Diagramm: 44“ (Summe aus Hoehe · Einteilung
//                   aller vier Saeulen – bleibt bei jeder Einteilung 44)
//   _m6s-nur        nur nach „nur Kästchen zählen“: „Nur Kästchen gezählt: 6,
//                   Kinder: 12“ (waehrenddessen „Nur Kästchen gezählt: 4,
//                   Kinder: …“), sonst ausgeblendet
//
// Werte (Kaestchen je Saeule; nachgerechnet mit simcheck/werte.js):
//   1 : 1 → zu Fuß 12 · Rad 8 · Bus 16 · Auto 8, Zaehlweg 1, 2, … 12,
//           Achse 0, 2, 4 … 16
//   1 : 2 → 6 · 4 · 8 · 4, Zaehlweg 2, 4, … 12, Achse 0, 4, 8, 12, 16
//   1 : 4 → 3 · 2 · 4 · 2, Zaehlweg 4, 8, 12, Achse 0, 8, 16
//   Kinder zu Fuß immer 12, Rad 8, Bus 16, Auto 8, alle immer 44.
//   Gegenprobe bei 1 : 2, zu Fuß: „Nur Kästchen gezählt: 6, Kinder: 12“.
// Start: Einteilung 1 Kästchen = 1 Kind, Saeulen stehen, noch nicht gezaehlt
// („Start: Säulendiagramm, 1 Kästchen = 1 Kind“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): „1 Kästchen = 2 Kinder“ – die
// Saeule ist auf die Haelfte geschrumpft, und der Zaehlweg kommt trotzdem bei 12
// an: Lichtring um die Saeule, bernsteinfarbener Rahmen 1,4 s. Widerlegt „6“.
//
// FUER DIE LEHRKRAFT (Container <div class="fpm-lehrkraft">, V3; eigene Zeile
// unter den Heftknoepfen, davor klein „Für die Lehrkraft:“):
//   „Pause“ ↔ „weiter“ (_m6sAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ unten links (oben links steht der Achsentitel „Anzahl der Kinder“).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m6sTempo()): ein Drittel so schnell.
//   „Zahlen verdecken: aus“ ↔ „… an“ (_m6sVerdecken()): die Zahlen an der
//     Achse werden graue Karten mit „?“ – fuer das Gespraech „Was fehlt
//     jetzt?“ (Bruecke zu md6). ABWEICHUNG vom Bauplan: dort heisst der
//     Schalter „Hochachse verdecken“; „Hochachse“ steht aber unter „Nicht am
//     Bildschirm“ und ist das Lueckenwort des Merksatzes. Name wie in mm1.
//   Nur das wechselnde Wort steht in einem eigenen <span>. Die Hinweiszeile
//   _m6s-lehrkraft nennt immer die Einstellungen (wie m5-rest), in der Pause
//   bernsteinfarben („lmp-status off“):
//     sonst    „Für die Lehrkraft: „Pause“ hält alles an. Tempo: normal, Zahlen verdecken: aus.“
//     verdeckt „Zahlen an der Achse verdeckt. Frage: Was fehlt jetzt? Tempo: …, Zahlen verdecken: an.“
//     Pause    „Angehalten. Erkläre, was gerade passiert. Dann „weiter“. Tempo: …“
//   EIN Zeitfaktor (_m6sZeitfaktor: 0 Pause, 1/3 langsam, 1 normal) an der
//   einen Stelle, an der dt in _m6sUpdate hineingeht. In der Pause bewegen
//   „Säule wählen“ und „nur Kästchen zählen“ nichts: Steht eine Bewegung,
//   entfaellt der Druck; steht keine, wird er VORGEMERKT und beginnt mit
//   „weiter“ (das Schild „Pause“ leuchtet kurz auf). Eine Sprungmarke und
//   „neu“ heben die Pause auf; Tempo und Verdecken bleiben stehen.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Hochachse“, die Regel
// als Satz (kein „Die Zahlen an der Achse zeigen …“). „Säulendiagramm“ und
// „Einteilung“ sind erlaubt. Keine Namen, keine Punkte, keine Zeit, kein „falsch“.
//
// Fuer simfakten.js: Eine Sprungmarke braucht bis zu 4,35 s (272 Frames), „Säule
// wählen“ bis Bus bei 1 : 1 4,7 s. Gemessen 09.10.2026: Mit den Schaltern aus
// fakten_ziehen.py (--voll --frames=25 --verlauf=4) stehen alle Tabellenwerte im
// Dump – die Endwerte in dem Durchgang, der jeden Knopf ein zweites Mal drueckt
// und bis zur Ruhe laeuft. Mit der
// Voreinstellung (2 Frames) fehlen Zaehlweg und Kinderzahl. NICHT im Dump steht
// „Nur Kästchen gezählt: 6, Kinder: 12“: Der Treiber drueckt die Gegenprobe erst
// bei 1 : 4 und „Rad“ („… 2, Kinder: 8“). Die Kombination ist mit dem
// Rechentest nachgefahren (Heft gegen Simulation, wie werte.js).
// ════════════════════════════════════════════════════════════════════════
let _m6s = null;
const _m6sNAMEN = ['zu Fuß', 'Rad', 'Bus', 'Auto'];
const _m6sDATEN = [12, 8, 16, 8];                 // Kinder je Saeule, zusammen 44
const _m6sREIHE = [1, 2, 4];                      // Sprungmarken: Kinder je Kaestchen
const _m6sK = {
  KA: 12,                          // Kaestchen (px)
  AX: 112, Y0: 222,                // Achsenkreuz: Hochachse x, Grundlinie y (x 112 statt 96:
                                   // links neben der Pfeilspitze steht der Achsentitel)
  SP: [2, 6, 10, 14],              // linke Kante jeder Saeule, Kaestchen ab der Achse
  RA: 17, MAXW: 16,                // Laenge der waagerechten Achse (Kaestchen), groesster Wert
  PX0: 4, PX1: 416, PY0: 4, PY1: 246,   // Papier
  LX: 344, LY: 24, LW: 36,         // Legende: Kaestchen (vergroessert)
  // Zeiten in s
  T_WAHL0: 0.35, T_WANDER: 0.6, T_SKALA: 0.9, T_ATEM: 0.1, T_KIND: 0.25,
  T_NUR0: 0.3, T_NURK: 0.4, T_NURPAUSE: 0.3, T_NURFIG: 0.45,
  T_NACH: 1.5, T_EIN: 0.6, T_AHA: 1.4, T_LEG: 0.4, LANGSAM: 1 / 3,
  // Farben
  F_BLAU: '#3b82f6', F_BLAU_D: '#1d4ed8', F_HELL: '#93c5fd', F_GRAU: '#cbd5e1',
  F_GRAU_R: '#94a3b8', F_TEXT: '#1e293b', F_ACHSE: '#334155', F_KARO: '#d4e3f1',
  F_ORANGE: '#ea580c', F_ORANGE_H: '#fdba74', F_BERN: '#f59e0b', F_WORT: '#475569'
};

// ── Rechnungen (eine Quelle fuer Bild und Anzeige) ──────────────────────
function _m6sKinderWort(n) { return n === 1 ? '1 Kind' : n + ' Kinder'; }
function _m6sEinteilung(e) { return '1 Kästchen = ' + _m6sKinderWort(e); }
function _m6sHoehe(c, e) { return _m6sDATEN[c] / e; }               // Kaestchen
function _m6sAchsWerte(e) {                                          // Zahl an jeder 2. Linie
  const out = [];
  for (let v = 0; v <= _m6sK.MAXW; v += 2 * e) out.push(v);
  return out;
}
function _m6sLinks(c) { const K = _m6sK; return K.AX + K.SP[c] * K.KA; }
function _m6sMitte(c) { return _m6sLinks(c) + _m6sK.KA / 2; }
// Ablauf einer Zaehlung (Sprungmarke, Saeule waehlen): Kaestchen i beginnt bei
// _m6sKastenZeit, seine Figur j springt 0,04 s nach ihrem Takt, die Zaehlzahl
// steht, wenn die letzte Figur gelandet ist.
function _m6sKastenZeit(L, i) { return L.Tc + i * L.e1 * _m6sK.T_KIND; }
function _m6sFigurZeit(L, i, j) { return _m6sKastenZeit(L, i) + j * _m6sK.T_KIND + 0.04; }
function _m6sZahlZeit(L, i) { return _m6sKastenZeit(L, i) + (L.e1 - 1) * _m6sK.T_KIND + 0.16; }
// Gegenprobe: Kaestchen i wird bei _m6sNurZeit orange gezaehlt
function _m6sNurZeit(L, i) { return L.Tc + i * _m6sK.T_NURK; }
function _m6sNurZahlZeit(L, i) { return _m6sNurZeit(L, i) + 0.15; }

// Was gerade gilt – daraus entstehen ALLE Statuszeilen.
function _m6sStand() {
  const z = _m6s, L = z.lauf;
  if (!L) {
    const h = _m6sHoehe(z.sel, z.e);
    return { e: z.e, eZiel: z.e, sel: z.sel, h, k: z.fertig ? h : 0,
             kinder: z.fertig ? _m6sDATEN[z.sel] : null, nur: z.nurZeile };
  }
  const t = L.t;
  if (L.art === 'nur') {
    let nk = 0;
    for (let i = 0; i < L.h; i++) if (t >= _m6sNurZahlZeit(L, i)) nk = i + 1;
    const fig = t >= L.tF;
    return { e: L.e1, eZiel: L.e1, sel: L.sel1, h: L.h, k: fig ? L.h : 0, kinder: fig ? L.n : null,
             nur: 'Nur Kästchen gezählt: ' + (nk || '…') + ', Kinder: ' + (fig ? L.n : '…') };
  }
  const e = t >= L.T0 + L.T1 ? L.e1 : L.e0, sel = t >= L.T0 ? L.sel1 : L.sel0;
  let k = 0;
  for (let i = 0; i < L.h; i++) if (t >= _m6sZahlZeit(L, i)) k = i + 1;
  return { e, eZiel: L.e1, sel, h: _m6sHoehe(sel, e), k, kinder: t >= L.tEnd ? L.n : null, nur: '' };
}

function _m6sInit() {
  _m6s = { e: 1, sel: 0, fertig: false, nurZeile: '', nurTags: false, lauf: null,
           fx: { teile: [] }, ein: _m6sK.T_EIN, ahaGlanz: 0, ahaSaeule: 0, sig: '',
           pause: false, langsam: false, verdeckt: false, blink: 0, vormerk: null };   // Lehrkraft
}
function _m6sHTML() {
  const marke = e => `<button class="sim-btn" id="_m6s-b-${e}" onclick="_m6sMarke(${e})">1&nbsp;Kästchen&nbsp;=&nbsp;${e}&nbsp;${e === 1 ? 'Kind' : 'Kinder'}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie viele Kinder gehen zu Fuß?</h3>
    <div class="fpm-note" style="margin-top:2px">Die blaue Säule ist „zu Fuß“. Sieh, wie viele Kinder in einem Kästchen stehen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m6s-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m6sREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" onclick="_m6sWaehlen()">Säule wählen</button>
          <button class="sim-btn" onclick="_m6sNurKaestchen()">nur Kästchen zählen</button>
          <button class="sim-btn" onclick="_m6sNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m6s-pause" onclick="_m6sAnhalten()">Pause</button>
            <button class="sim-btn" id="_m6s-tempo" onclick="_m6sTempo()">Tempo: <span id="_m6s-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m6s-verdeckt" onclick="_m6sVerdecken()">Zahlen verdecken: <span id="_m6s-verdeckt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m6s-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m6s-einteilung" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6s-saeule" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6s-zaehlen" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6s-kinder" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6s-alle" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m6s-nur" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Säulendiagramm, 1 Kästchen = 1 Kind</p>
  </div>`;
}
function _m6sSetze(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
  return el;
}
function _m6sSignatur(st) { return [st.e, st.eZiel, st.sel, st.k, st.kinder, st.nur].join('|'); }
function _m6sStatus() {
  if (!_m6s) return;
  const z = _m6s, K = _m6sK, st = _m6sStand();
  z.sig = _m6sSignatur(st);
  const blau = s => '<b style="color:' + K.F_BLAU_D + '">' + s + '</b>';
  const orange = s => '<b style="color:' + K.F_ORANGE + '">' + s + '</b>';
  _m6sSetze('_m6s-einteilung', 'Einteilung: 1 Kästchen = ' + blau(_m6sKinderWort(st.eZiel)));
  _m6sSetze('_m6s-saeule', 'Gewählte Säule: ' + blau(_m6sNAMEN[st.sel]) + ', ' + blau(st.h) + ' Kästchen hoch');
  const weg = [];
  for (let i = 1; i <= st.k; i++) weg.push(i * st.eZiel);
  _m6sSetze('_m6s-zaehlen', 'Zählweg in der Säule: ' + (weg.length ? blau(weg.join(', ')) : '…'));
  _m6sSetze('_m6s-kinder', 'Kinder in dieser Säule: ' + (st.kinder === null ? '…' : blau(st.kinder)));
  let alle = 0;                                        // Hoehe · Einteilung, alle vier Saeulen
  for (let c = 0; c < 4; c++) alle += _m6sHoehe(c, st.e) * st.e;
  _m6sSetze('_m6s-alle', 'Alle Kinder im Diagramm: ' + alle);
  const nz = _m6sSetze('_m6s-nur', st.nur ? st.nur.replace(/: (\d+|…),/, (m, a) => ': ' + orange(a) + ',') : '');
  if (nz && nz.style) nz.style.display = st.nur ? '' : 'none';
  for (const e of _m6sREIHE) {
    const b = document.getElementById('_m6s-b-' + e);
    if (b && b.classList) b.classList.toggle('primary', e === st.eZiel);
  }
  // Fuer die Lehrkraft: Aufschriften und Hinweiszeile (in der Pause bernsteinfarben)
  _m6sSetze('_m6s-pause', z.pause ? 'weiter' : 'Pause');
  _m6sSetze('_m6s-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m6sSetze('_m6s-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _m6sSetze('_m6s-lehrkraft', _m6sHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m6s-pause', z.pause], ['_m6s-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}
function _m6sHinweis() {
  const z = _m6s;
  return (z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
          : z.verdeckt ? 'Zahlen an der Achse verdeckt. Frage: Was fehlt jetzt?'
          : 'Für die Lehrkraft: „Pause“ hält alles an.') +
         ' Tempo: ' + (z.langsam ? 'langsam' : 'normal') +
         ', Zahlen verdecken: ' + (z.verdeckt ? 'an' : 'aus') + '.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Einen Ablauf beginnen: art 'marke' | 'waehlen' | 'nur'
function _m6sStarte(art, e1, sel1) {
  const z = _m6s, K = _m6sK;
  const L = { art, t: 0, e0: z.e, e1, sel0: z.sel, sel1, alt: z.fertig };
  L.h = _m6sHoehe(sel1, e1); L.n = _m6sDATEN[sel1];
  if (art === 'nur') {
    L.T0 = K.T_NUR0; L.T1 = 0; L.Tc = L.T0;
    L.tF = L.Tc + L.h * K.T_NURK + K.T_NURPAUSE;     // Figuren springen hinein
    L.tEnd = L.tF + K.T_NURFIG;
  } else {
    L.T0 = sel1 !== z.sel ? K.T_WANDER : K.T_WAHL0;
    L.T1 = e1 !== z.e ? K.T_SKALA : 0;
    L.Tc = L.T0 + L.T1 + K.T_ATEM;
    L.tEnd = L.Tc + L.n * K.T_KIND;
  }
  L.ende = L.tEnd + K.T_NACH;
  z.ein = 0;                                          // ein Knopf laesst auch das Aufwachsen ankommen
  z.fertig = false; z.nurZeile = ''; z.nurTags = false; z.ahaGlanz = 0;
  z.lauf = L;
  _m6sStatus();
}
// Sprungmarke: Einteilung umstellen, „zu Fuß“ waehlen und zaehlen. Hebt die Pause auf.
function _m6sMarke(e) {
  if (!_m6s || _m6sREIHE.indexOf(e) < 0) return;
  const z = _m6s;
  _m6sFertig();
  z.pause = false; z.vormerk = null; z.blink = 0;
  _m6sStarte('marke', e, 0);
}
// Waehrend der Pause: vormerken, wenn nichts unterwegs ist; sonst entfaellt der Druck.
function _m6sInDerPause(tat) {
  const z = _m6s;
  z.blink = 0.6;
  if (!z.lauf) z.vormerk = tat;
}
function _m6sWaehlen() {
  if (!_m6s) return;
  const z = _m6s;
  if (z.pause) { _m6sInDerPause(() => _m6sWaehlen()); return; }
  _m6sFertig();
  _m6sStarte('waehlen', z.e, (z.sel + 1) % 4);
}
function _m6sNurKaestchen() {
  if (!_m6s) return;
  const z = _m6s;
  if (z.pause) { _m6sInDerPause(() => _m6sNurKaestchen()); return; }
  _m6sFertig();
  _m6sStarte('nur', z.e, z.sel);
}
// „neu“: sofort der Start. Hebt die Pause auf.
function _m6sNeu() {
  if (!_m6s) return;
  const z = _m6s;
  z.lauf = null; z.pause = false; z.vormerk = null; z.blink = 0;
  z.e = 1; z.sel = 0; z.fertig = false; z.nurZeile = ''; z.nurTags = false;
  z.ein = _m6sK.T_EIN; z.ahaGlanz = 0; z.fx.teile.length = 0;
  _m6sStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m6sAnhalten() {
  if (!_m6s) return;
  const z = _m6s;
  if (z.pause) {
    z.pause = false; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v && !z.lauf) v();
  } else z.pause = true;
  _m6sStatus();
}
function _m6sTempo() {
  if (!_m6s) return;
  _m6s.langsam = !_m6s.langsam;
  _m6sStatus();
}
function _m6sVerdecken() {
  if (!_m6s) return;
  _m6s.verdeckt = !_m6s.verdeckt;
  _m6sStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m6sZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _m6sK.LANGSAM : 1; }

// Die laufende Bewegung ankommen lassen.
function _m6sLanden() {
  const z = _m6s, L = z.lauf;
  if (!L) return;
  z.lauf = null;
  z.e = L.e1; z.sel = L.sel1; z.fertig = true;
  if (L.art === 'nur') { z.nurZeile = 'Nur Kästchen gezählt: ' + L.h + ', Kinder: ' + L.n; z.nurTags = true; }
  _m6sStatus();
}
function _m6sFertig() { if (_m6s && _m6s.lauf) _m6sLanden(); }
// Zaehlung angekommen (nur im natuerlichen Ablauf, nicht beim Abbrechen)
function _m6sAngekommen(L) {
  const z = _m6s, K = _m6sK;
  if (L.art === 'marke' && L.e1 === 2 && L.sel1 === 0) {
    // Aha: halb so hoch, trotzdem 12 Kinder
    z.ahaGlanz = K.T_AHA; z.ahaSaeule = 0;
    _bioFxWelle(z.fx.teile, _m6sMitte(0), K.Y0 - L.h * K.KA / 2, K.F_BERN, 70);
  }
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m6sUpdate(dt) {
  if (!_m6s) return;
  const z = _m6s;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);               // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m6sZeitfaktor(z);                       // ab hier Sim-Zeit
  z.ein = Math.max(0, z.ein - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  const L = z.lauf;
  if (L && dt > 0) {                                  // ohne Zeit kein Schritt im Ablauf
    const vor = L.t;
    L.t += dt;
    if (vor < L.tEnd && L.t >= L.tEnd) _m6sAngekommen(L);
    if (L.t >= L.ende) _m6sLanden();
  }
  _bioFxUpdate(z.fx.teile, dt);
  if (_m6sSignatur(_m6sStand()) !== z.sig) _m6sStatus();
}

// ── Bild: was steht wo? ─────────────────────────────────────────────────
function _m6sBild() {
  const z = _m6s, K = _m6sK, L = z.lauf, E = _bioFxEase, kl = _bioFxKlemme;
  const B = { ein: z.ein > 0 ? E.raus(1 - z.ein / K.T_EIN) : 1 };
  if (!L) { B.eVon = B.eZu = z.e; B.u = 1; B.selVon = B.selZu = z.sel; B.w = 1; }
  else {
    B.eVon = L.e0; B.eZu = L.e1; B.selVon = L.sel0; B.selZu = L.sel1;
    B.u = L.T1 > 0 ? E.sanft(kl((L.t - L.T0) / L.T1)) : 1;      // Hoehen und Achsenzahlen
    B.w = L.sel0 !== L.sel1 ? E.sanft(kl(L.t / L.T0)) : 1;      // Farbe wandert
  }
  B.s = 1 / B.eVon + (1 / B.eZu - 1 / B.eVon) * B.u;            // Kaestchen je Kind
  B.blau = [0, 0, 0, 0];
  B.blau[B.selVon] += 1 - B.w; B.blau[B.selZu] += B.w;
  return B;
}
// Ein Kaestchen der Saeule c: blaue Fuellung, orange Toenung (Gegenprobe),
// Aufleuchten, Figuren (je Figur Deckkraft a und Groesse g).
function _m6sKasten(c, i, B) {
  const z = _m6s, K = _m6sK, L = z.lauf, kl = _bioFxKlemme, E = _bioFxEase;
  const r = { voll: 0, orange: 0, glut: 0, e: B.eZu, figs: [] };
  const alle = (a, g) => { for (let j = 0; j < r.e; j++) r.figs.push({ a, g }); };
  if (!L) {
    if (z.fertig && c === z.sel) { r.voll = 1; alle(1, 1); }
    return r;
  }
  const t = L.t, ausDauer = L.art === 'nur' ? L.T0 : 0.6 * L.T0;
  if (L.alt && c === L.sel0 && t < ausDauer) {          // alte Figuren blenden aus
    const a = 1 - kl(t / ausDauer);
    r.e = L.e0; r.voll = a; alle(a, 0.6 + 0.4 * a);
    return r;
  }
  if (c !== L.sel1 || i >= L.h) return r;
  if (L.art === 'nur') {
    const a0 = _m6sNurZeit(L, i);
    if (t >= a0) { r.orange = kl((t - a0) / 0.12); r.glut = 1 - kl((t - a0) / 0.35); }
    const tf = L.tF + i * 0.03;
    r.voll = kl((t - tf) / 0.2);
    if (r.voll > 0) r.orange *= 1 - r.voll;
    for (let j = 0; j < r.e; j++) {
      const p = kl((t - tf - j * 0.02) / 0.18);
      r.figs.push({ a: p, g: Math.max(0, E.federn(p)) });
    }
    return r;
  }
  const a0 = _m6sKastenZeit(L, i);
  if (t >= a0) { r.voll = kl((t - a0) / 0.12); r.glut = 1 - kl((t - a0) / (L.e1 * K.T_KIND + 0.2)); }
  for (let j = 0; j < r.e; j++) {
    const p = kl((t - _m6sFigurZeit(L, i, j)) / 0.15);
    r.figs.push({ a: p, g: Math.max(0, E.federn(p)) });
  }
  return r;
}
// Ablese-Linie: welche Saeule, welcher Wert, wie deutlich?
function _m6sAblese(B) {
  const z = _m6s, L = z.lauf, kl = _bioFxKlemme;
  if (!L) return z.fertig ? { c: z.sel, a: 1 } : null;
  const t = L.t, ausDauer = L.art === 'nur' ? L.T0 : 0.6 * L.T0;
  if (L.alt && t < ausDauer) return { c: L.sel0, a: 1 - kl(t / ausDauer) };
  if (L.art === 'nur') return t >= L.tF + 0.3 ? { c: L.sel1, a: kl((t - L.tF - 0.3) / 0.4) } : null;
  return t >= L.tEnd ? { c: L.sel1, a: kl((t - L.tEnd) / 0.4) } : null;
}
// Die Zaehlzahl rechts neben der Saeule (blau beim Zaehlen, orange bei der
// Gegenprobe): EIN Schild, das mit dem Zaehlen Kaestchen fuer Kaestchen nach
// oben gleitet (0,15 s) und dabei die neue Zahl zeigt – so ueberdecken sich
// nie zwei Zahlen. Die letzte bleibt kurz stehen und blendet dann aus.
function _m6sZahl() {
  const z = _m6s, K = _m6sK, L = z.lauf, kl = _bioFxKlemme, E = _bioFxEase;
  if (!L) return null;
  const t = L.t, nur = L.art === 'nur';
  const tz = i => (nur ? _m6sNurZahlZeit(L, i) : _m6sZahlZeit(L, i));
  let k = 0;
  for (let i = 0; i < L.h; i++) if (t >= tz(i)) k = i + 1;
  if (!k) return null;
  const i = k - 1, alter = t - tz(i);
  const pos = i > 0 ? i - 1 + E.sanft(kl(alter / 0.15)) : i;
  // das erste Schild blendet ein, danach steht es; das letzte blendet aus
  const ein = i === 0 ? kl(alter / 0.12) : 1;
  const aus = k < L.h ? 1
            : nur ? 1 - kl((alter - 0.25) / 0.2)                         // Schild „… Kästchen“ uebernimmt
            : 1 - kl((t - (L.ende - 0.4)) / 0.4);
  const a = ein * aus;
  if (a <= 0.01) return null;
  return { c: L.sel1, pos, s: String(nur ? k : k * L.e1), f: nur ? K.F_ORANGE : K.F_BLAU_D,
           a, g: Math.max(0.6, E.federn(kl(alter / 0.18))) };
}
// Schilder nach der Gegenprobe: orange „6 Kästchen“, darueber blau „12 Kinder“
function _m6sSchilder() {
  const z = _m6s, L = z.lauf, kl = _bioFxKlemme;
  if (!L) return z.nurTags ? { c: z.sel, h: _m6sHoehe(z.sel, z.e), n: _m6sDATEN[z.sel], ao: 1, ab: 1 } : null;
  if (L.art !== 'nur') return null;
  const tl = _m6sNurZahlZeit(L, L.h - 1);
  if (L.t < tl + 0.25) return null;
  return { c: L.sel1, h: L.h, n: L.n, ao: kl((L.t - tl - 0.25) / 0.2), ab: kl((L.t - L.tF - 0.3) / 0.2) };
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m6sPapier(ctx) {
  const K = _m6sK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  let x0 = K.AX, y0 = K.Y0;                           // Raster am Achsenkreuz ausgerichtet
  while (x0 - K.KA > K.PX0 + 1) x0 -= K.KA;
  while (y0 - K.KA > K.PY0 + 1) y0 -= K.KA;
  for (let x = x0; x < K.PX1 - 1; x += K.KA) {
    ctx.beginPath(); ctx.moveTo(x, K.PY0 + 1); ctx.lineTo(x, K.PY1 - 1); ctx.stroke();
  }
  for (let y = y0; y < K.PY1 - 1; y += K.KA) {
    ctx.beginPath(); ctx.moveTo(K.PX0 + 1, y); ctx.lineTo(K.PX1 - 1, y); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.stroke();
  ctx.restore();
}
// Schematische Kinderfigur ohne Gesicht: Kopf und Rumpf. (x|y) Mitte, g Hoehe in px.
function _m6sFigur(ctx, x, y, g, a, farbe) {
  if (a <= 0.01 || g <= 0.5) return;
  const bw = g * 0.27, top = y - g * 0.02, unten = y + g * 0.44;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = farbe;
  ctx.beginPath(); ctx.arc(x, y - g * 0.25, g * 0.17, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - bw, unten); ctx.lineTo(x - bw, top + bw * 0.8);
  ctx.quadraticCurveTo(x - bw, top, x, top);
  ctx.quadraticCurveTo(x + bw, top, x + bw, top + bw * 0.8);
  ctx.lineTo(x + bw, unten); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// Figuren in einem Kaestchen (links oben x|y, Kantenlaenge S): 1 · 2 nebeneinander · 2 × 2
const _m6sPLAETZE = { 1: [[0.5, 0.5]], 2: [[0.28, 0.5], [0.72, 0.5]],
                      4: [[0.28, 0.27], [0.72, 0.27], [0.28, 0.73], [0.72, 0.73]] };
const _m6sGROESSE = { 1: 0.82, 2: 0.7, 4: 0.47 };
function _m6sFiguren(ctx, x, y, S, e, figs) {
  const pl = _m6sPLAETZE[e], gr = _m6sGROESSE[e] * S;
  for (let j = 0; j < e && j < figs.length; j++)
    _m6sFigur(ctx, x + pl[j][0] * S, y + pl[j][1] * S, gr * figs[j].g, figs[j].a, '#ffffff');
}
// Kleine Symbole unter den Saeulen (Mitte x|y, etwa 12 × 10 px)
function _m6sSymbol(ctx, c, x, y, f) {
  ctx.save();
  ctx.fillStyle = f; ctx.strokeStyle = f; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (c === 0) {                                      // Fussabdruecke
    for (const [dx, dy] of [[-2.6, 0.8], [2.6, -1.4]]) {
      ctx.beginPath(); ctx.ellipse(x + dx, y + dy - 0.8, 1.8, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + dx, y + dy + 3, 1.3, 0, Math.PI * 2); ctx.fill();
    }
  } else if (c === 1) {                               // Fahrrad
    for (const dx of [-3.7, 3.7]) { ctx.beginPath(); ctx.arc(x + dx, y + 2, 2.8, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath();
    ctx.moveTo(x - 3.7, y + 2); ctx.lineTo(x - 0.9, y - 1.8); ctx.lineTo(x + 2.6, y - 1.8); ctx.lineTo(x + 3.7, y + 2);
    ctx.moveTo(x - 3.7, y + 2); ctx.lineTo(x, y + 2); ctx.lineTo(x + 2.6, y - 1.8);
    ctx.moveTo(x - 0.9, y - 1.8); ctx.lineTo(x, y + 2);
    ctx.moveTo(x - 2.2, y - 3.4); ctx.lineTo(x - 0.2, y - 3.4);
    ctx.moveTo(x + 2.6, y - 1.8); ctx.lineTo(x + 2.2, y - 4); ctx.lineTo(x + 3.8, y - 4);
    ctx.stroke();
  } else if (c === 2) {                               // Bus
    _bioFxRundRect(ctx, x - 6.5, y - 4.5, 13, 8.5, 1.8); ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (const dx of [-5, -1.5, 2]) ctx.fillRect(x + dx, y - 3.2, 2.8, 2.8);
    for (const dx of [-3.6, 3.6]) {
      ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x + dx, y + 4, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.8; ctx.stroke();
    }
  } else {                                            // Auto
    ctx.beginPath();
    ctx.moveTo(x - 6.5, y + 2.6); ctx.lineTo(x - 6.5, y - 0.2); ctx.lineTo(x - 3.8, y - 0.8);
    ctx.lineTo(x - 2.2, y - 3.8); ctx.lineTo(x + 2.4, y - 3.8); ctx.lineTo(x + 4.2, y - 0.8);
    ctx.lineTo(x + 6.5, y - 0.2); ctx.lineTo(x + 6.5, y + 2.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(x - 1.7, y - 3); ctx.lineTo(x + 2, y - 3); ctx.lineTo(x + 3.1, y - 1); ctx.lineTo(x - 2.7, y - 1); ctx.closePath(); ctx.fill();
    for (const dx of [-3.4, 3.4]) {
      ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x + dx, y + 3, 1.7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.8; ctx.stroke();
    }
  }
  ctx.restore();
}
// Graue Karte mit „?“ (Zahlen verdecken)
function _m6sKarte(ctx, xr, y) {
  const w = 17, h = 13, x = xr - w;
  ctx.save();
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x, y - h / 2, w, h, 3); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '700 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('?', x + w / 2, y + 4);
  ctx.restore();
}
function _m6sAchsen(ctx, B, ab) {
  const z = _m6s, K = _m6sK;
  const oben = K.Y0 - (K.MAXW * B.s + 1.3) * K.KA;
  ctx.save();
  ctx.strokeStyle = K.F_ACHSE; ctx.fillStyle = K.F_ACHSE; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(K.AX, K.Y0); ctx.lineTo(K.AX + K.RA * K.KA, K.Y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(K.AX, K.Y0); ctx.lineTo(K.AX, oben); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(K.AX, oben - 7); ctx.lineTo(K.AX - 4.5, oben + 1); ctx.lineTo(K.AX + 4.5, oben + 1);
  ctx.closePath(); ctx.fill();
  // Zahlen: alte und neue Einteilung; was wegfaellt, blendet aus, was dazukommt, ein
  const von = _m6sAchsWerte(B.eVon), zu = _m6sAchsWerte(B.eZu);
  const alle = von.concat(zu.filter(v => von.indexOf(v) < 0)).sort((a, b) => a - b);
  const wert = ab ? _m6sDATEN[ab.c] : null;
  ctx.lineWidth = 1.3; ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
  for (const v of alle) {
    const a = (von.indexOf(v) >= 0 ? 1 - B.u : 0) + (zu.indexOf(v) >= 0 ? B.u : 0);
    if (a <= 0.02) continue;
    const y = K.Y0 - v * B.s * K.KA;
    ctx.globalAlpha = Math.min(1, a);
    ctx.strokeStyle = K.F_ACHSE;
    ctx.beginPath(); ctx.moveTo(K.AX - 4, y); ctx.lineTo(K.AX, y); ctx.stroke();
    if (z.verdeckt) { _m6sKarte(ctx, K.AX - 6, y); continue; }
    const hell = v === wert && ab ? ab.a : 0;             // Zahl an der Ablese-Linie wird blau
    ctx.font = '700 11px sans-serif';
    ctx.fillStyle = hell > 0.5 ? K.F_BLAU_D : K.F_ACHSE;
    ctx.fillText(String(v), K.AX - 7, y + 4);
  }
  // Achsentitel: „Anzahl der Kinder“ links neben der Pfeilspitze (wandert mit
  // ihr; wird kleiner, falls eine breite Schrift ihn sonst ueber den Papierrand
  // schoebe), „Schulweg“ am Ende der waagerechten Achse.
  const titel = 'Anzahl der Kinder', platz = K.AX - 9 - K.PX0 - 3;
  ctx.globalAlpha = 1; ctx.fillStyle = K.F_TEXT;
  ctx.font = '700 11px sans-serif';
  const tb = ctx.measureText(titel).width;
  if (tb > platz) ctx.font = '700 ' + (11 * platz / tb).toFixed(1) + 'px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(titel, K.AX - 9, oben + 1);
  ctx.font = '700 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Schulweg', K.AX + K.RA * K.KA + 6, K.Y0 + 4);
  ctx.restore();
}
function _m6sAbleseLinie(ctx, B, ab) {
  const K = _m6sK;
  if (!ab || ab.a <= 0.01) return;
  const y = K.Y0 - _m6sDATEN[ab.c] * B.s * K.KA * B.ein;
  ctx.save();
  ctx.globalAlpha = ab.a * 0.9;
  ctx.strokeStyle = K.F_BLAU_D; ctx.lineWidth = 1.3; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(_m6sLinks(ab.c), y); ctx.lineTo(K.AX, y); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
function _m6sSaeulen(ctx, B) {
  const z = _m6s, K = _m6sK;
  for (let c = 0; c < 4; c++) {
    const h = _m6sDATEN[c] * B.s * B.ein;
    if (h <= 0.01) continue;
    const x = _m6sLinks(c), y = K.Y0 - h * K.KA, b = B.blau[c], blau = b > 0.5;
    ctx.save();
    ctx.fillStyle = K.F_GRAU; ctx.fillRect(x, y, K.KA, h * K.KA);
    if (b > 0.01) { ctx.globalAlpha = b; ctx.fillStyle = K.F_HELL; ctx.fillRect(x, y, K.KA, h * K.KA); ctx.globalAlpha = 1; }
    const voll = Math.floor(h + 1e-6), boxen = [];
    for (let i = 0; i < voll; i++) boxen.push(_m6sKasten(c, i, B));
    boxen.forEach((r, i) => {
      const yb = K.Y0 - (i + 1) * K.KA;
      // gezaehlt ohne Figuren: deckend hellorange (38 % Orange ueber dem Hellblau der
      // Saeule ergab ein trübes Mauve – die Farbverbindung zu den orangen Zahlen fehlte)
      if (r.orange > 0.01) { ctx.globalAlpha = r.orange; ctx.fillStyle = K.F_ORANGE_H; ctx.fillRect(x, yb, K.KA, K.KA); }
      if (r.voll > 0.01) { ctx.globalAlpha = r.voll; ctx.fillStyle = K.F_BLAU; ctx.fillRect(x, yb, K.KA, K.KA); }
      ctx.globalAlpha = 1;
    });
    // Kaestchenlinien in der Saeule – so ist jedes Kaestchen zaehlbar
    ctx.strokeStyle = blau ? 'rgba(30,64,175,0.55)' : K.F_GRAU_R; ctx.lineWidth = 1;
    for (let k = 1; k < h - 0.05; k++) {
      const yl = K.Y0 - k * K.KA;
      ctx.beginPath(); ctx.moveTo(x, yl); ctx.lineTo(x + K.KA, yl); ctx.stroke();
    }
    ctx.strokeStyle = blau ? K.F_BLAU_D : K.F_GRAU_R; ctx.lineWidth = 1.3;
    ctx.strokeRect(x, y, K.KA, h * K.KA);
    // Aufleuchten und Figuren
    boxen.forEach((r, i) => {
      const yb = K.Y0 - (i + 1) * K.KA;
      if (r.glut > 0.01) {                           // Aufleuchten: nur ein Rahmen, die Farbe bleibt klar
        ctx.globalAlpha = r.glut;
        ctx.strokeStyle = 'rgba(252,211,77,0.6)'; ctx.lineWidth = 4;
        ctx.strokeRect(x - 2.5, yb - 1.5, K.KA + 5, K.KA + 3);
        ctx.strokeStyle = r.orange > 0.01 ? K.F_ORANGE : '#d97706'; ctx.lineWidth = 1.8;
        ctx.strokeRect(x - 2.5, yb - 1.5, K.KA + 5, K.KA + 3);
        ctx.globalAlpha = 1;
      }
      if (r.figs.length) _m6sFiguren(ctx, x, yb, K.KA, r.e, r.figs);
    });
    // Aha: ruhiger Rahmen um die Saeule
    if (z.ahaGlanz > 0 && c === z.ahaSaeule) {
      ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.5);
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.5;
      _bioFxRundRect(ctx, x - 4, y - 4, K.KA + 8, h * K.KA + 5, 4); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
}
function _m6sBeschriftung(ctx, B) {
  const K = _m6sK, z = _m6s, L = z.lauf;
  const breite = [];
  ctx.save();
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  for (let c = 0; c < 4; c++) {
    const blau = B.blau[c] > 0.5, f = blau ? K.F_BLAU_D : K.F_WORT;
    ctx.font = (blau ? '700 ' : '600 ') + '11px sans-serif';
    const w = ctx.measureText(_m6sNAMEN[c]).width, ges = 16 + w, x0 = _m6sMitte(c) - ges / 2;
    breite[c] = ges;
    _m6sSymbol(ctx, c, x0 + 6.5, K.Y0 + 10.5, f);
    ctx.fillStyle = f;
    ctx.fillText(_m6sNAMEN[c], x0 + 16, K.Y0 + 15);
  }
  // Unterstreichung unter der gewaehlten Saeule; wandert mit der Farbe
  const xm = _m6sMitte(B.selVon) + (_m6sMitte(B.selZu) - _m6sMitte(B.selVon)) * B.w;
  const br = breite[B.selVon] + (breite[B.selZu] - breite[B.selVon]) * B.w;
  ctx.fillStyle = K.F_BLAU_D;
  _bioFxRundRect(ctx, xm - br / 2, K.Y0 + 18.5, br, 2.5, 1.2); ctx.fill();
  ctx.restore();
}
function _m6sLegende(ctx, B) {
  const z = _m6s, K = _m6sK, L = z.lauf, kl = _bioFxKlemme, E = _bioFxEase;
  const x = K.LX, y = K.LY, S = K.LW;
  const wechsel = L && L.art === 'marke' && L.e0 !== L.e1 && L.t < K.T_LEG;
  ctx.save();
  if (wechsel) {                                      // Lichtrand um die Legende
    ctx.globalAlpha = 1 - kl(L.t / K.T_LEG);
    ctx.strokeStyle = K.F_BERN; ctx.lineWidth = 3;
    _bioFxRundRect(ctx, x - 5, y - 5, S + 10, S + 10, 6); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // Ueberschrift des Diagramms rechts oben ueber der Legende, in einer Zeile
  // mit dem Achsentitel (wie die Diagramme im Heft)
  ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
  ctx.font = '700 13px sans-serif'; ctx.fillStyle = K.F_TEXT;
  ctx.fillText('Umfrage zum Schulweg', K.PX1 - 6, 16);
  ctx.fillStyle = K.F_BLAU; ctx.strokeStyle = K.F_BLAU_D; ctx.lineWidth = 1.5;
  ctx.fillRect(x, y, S, S); ctx.strokeRect(x, y, S, S);
  if (wechsel) {
    const u = L.t / K.T_LEG, aAlt = 1 - kl(u / 0.4), pNeu = kl((u - 0.3) / 0.7);
    const alt = [], neu = [];
    for (let j = 0; j < L.e0; j++) alt.push({ a: aAlt, g: 0.5 + 0.5 * aAlt });
    for (let j = 0; j < L.e1; j++) neu.push({ a: pNeu, g: Math.max(0, E.federn(pNeu)) });
    _m6sFiguren(ctx, x, y, S, L.e0, alt);
    _m6sFiguren(ctx, x, y, S, L.e1, neu);
  } else {
    const figs = [];
    for (let j = 0; j < B.eZu; j++) figs.push({ a: 1, g: 1 });
    _m6sFiguren(ctx, x, y, S, B.eZu, figs);
  }
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.font = '700 12px sans-serif';
  ctx.fillStyle = K.F_TEXT;
  ctx.fillText('1 Kästchen', x + S / 2, y + S + 17);
  ctx.fillStyle = K.F_BLAU_D;
  ctx.fillText('= ' + _m6sKinderWort(B.eZu), x + S / 2, y + S + 33);
  ctx.restore();
}
// Schild mit weissem Grund: Text t, Anker (x|y = Mitte der Hoehe), ausr 'left' | 'center'
function _m6sSchild(ctx, t, x, y, f, a, g, ausr) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.font = '700 11px sans-serif';
  const K = _m6sK, w = ctx.measureText(t).width + 8, h = 15;
  // nie ueber die Achse (links) und nie ueber den Papierrand (rechts)
  const xl = Math.max(K.AX + 4, Math.min(K.PX1 - 4 - w, ausr === 'center' ? x - w / 2 : x));
  ctx.translate(xl + w / 2, y); ctx.scale(g, g);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = f; ctx.lineWidth = 1.3;
  _bioFxRundRect(ctx, -w / 2, -h / 2, w, h, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = f; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(t, 0, 4);
  ctx.restore();
}
function _m6sZahlenZeichnen(ctx) {
  const K = _m6sK, n = _m6sZahl();
  if (n) _m6sSchild(ctx, n.s, _m6sLinks(n.c) + K.KA + 4, K.Y0 - (n.pos + 0.5) * K.KA, n.f, n.a, n.g, 'left');
  const sch = _m6sSchilder();
  if (!sch) return;
  const top = K.Y0 - sch.h * K.KA;
  const oben = top - 2 * 17 - 4 > K.PY0 + 2;          // Platz ueber der Saeule?
  const xo = oben ? _m6sMitte(sch.c) : _m6sLinks(sch.c) + K.KA + 4, au = oben ? 'center' : 'left';
  // „… Kinder“ steht immer OBEN, „… Kästchen“ darunter – ueber der Saeule wie daneben
  const y1 = oben ? top - 11 : top + 25, y2 = oben ? top - 28 : top + 8;
  _m6sSchild(ctx, sch.h + ' Kästchen', xo, y1, K.F_ORANGE, sch.ao, 1, au);
  _m6sSchild(ctx, _m6sKinderWort(sch.n), xo, y2, K.F_BLAU_D, sch.ab, 1, au);
}
function _m6sDraw(ctx, cv) {
  if (!_m6s) return;
  const z = _m6s, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m6sPapier(ctx);
  const B = _m6sBild(), ab = _m6sAblese(B);
  _m6sAbleseLinie(ctx, B, ab);
  _bioFxDraw(ctx, z.fx.teile);                        // Lichtring hinter den Saeulen
  _m6sSaeulen(ctx, B);
  _m6sAchsen(ctx, B, ab);
  _m6sBeschriftung(ctx, B);
  _m6sLegende(ctx, B);
  _m6sZahlenZeichnen(ctx);
  if (z.pause) _m6sPauseSchild(ctx);
}
// Schild „Pause“ unten links – Groesse und Farbe wie in m5-plus-schriftlich,
// aber unten: oben links steht der Achsentitel „Anzahl der Kinder“. Endet vor
// den Achsenzahlen (ab x = 92).
function _m6sPauseSchild(ctx) {
  const z = _m6s, w = 64, h = 25, x = 8, y = _m6sK.PY1 - 33;
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
  ctx.font = '700 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Pause', x + 20, y + 17.5);
  ctx.restore();
}
