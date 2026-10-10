
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 6 FOERDER – mt1 „Nur vier Möglichkeiten?“ (Kennung m6-teiler,
// Praefix _k6a). Bauplan: arbeitsheft_mathe_foe6/KAPITEL1_PROFIL.md,
// Abschnitt „m6-teiler (mt1)“ (Regeln N1–N3, Lehrkraft-Zeile).
// Ueberschrift = Frage der Einheit: „Bei welchen Reihen bleibt kein Plättchen übrig?“
//
// Was man sieht – ein heller Tisch mit Karo (Kaestchen 15 px). Bild und
// Zeichen sind durch die FARBE verbunden, in Bild, Zettel und Statuszeilen
// gleich: Plaettchen je Reihe BLAU, volle Reihen GRUEN, Rest ORANGE.
//   VORRAT (links oben, Schale mit der Aufschrift „Vorrat“): die Plaettchen
//     (blau) in Zehnerreihen mit Fuenferluecke. Sie verlassen die Schale von
//     hinten, so bleibt die Struktur lesbar.
//   LEGEFELD (rechts, Aufschrift „Legefeld“): Reihen untereinander, nach je
//     5 Plaettchen eine Luecke (ein Kaestchen), nach je 5 Reihen eine Luecke.
//     Ueber der ersten Reihe eine blaue Klammer mit „8 je Reihe“. Eine
//     unvollstaendige letzte Reihe liegt ORANGE, ihre leeren Plaetze sind
//     orange gestrichelt umrandet. Bis 14 je Reihe und 11 Reihen liegt jedes
//     Plaettchen in einem Kaestchen; groessere Felder werden kleiner gezeichnet.
//   ZETTEL (links unten, erst wenn alles liegt): „Kurz geschrieben“, darunter
//     „24 : 8 = 3“ und – nur ohne Rest – „3 · 8 = 24“; mit Rest
//     „24 : 10 = 2 Rest 4“ (8 blau, 3 gruen, Rest orange).
//
// Bewegung (jede Handlung bewegt sich; Zahlen wechseln erst, wenn das Bild
// angekommen ist – nur „Volle Reihen“ zaehlt beim Abspielen mit):
//   Sprungmarke  Das Legefeld leert sich: die Plaettchen gleiten in die Schale
//                zurueck (0,35 s; liegt nichts, nur 0,12 s). Dann fliegen sie
//                einzeln im Bogen aus dem Vorrat (eins alle 0,08 s, Flug 0,3 s)
//                und legen Reihe fuer Reihe von oben. Jede volle Reihe leuchtet
//                gruen auf (0,7 s), wenn ihr letztes Plaettchen landet. Liegt
//                alles, wird eine unvollstaendige Reihe orange, ihre Plaettchen
//                leuchten (1,4 s), der Zettel gleitet herein.
//                Gemessen (Frames zu 16 ms): 24 Plaettchen vom Start aus nach
//                2,26 s (142 Frames), nach einer anderen Sprungmarke 2,49 s
//                (156 Frames). simfakten.js mit --frames=25 --verlauf=4 liest
//                im ersten Durchgang bis 125 Frames (da zaehlen die vollen
//                Reihen noch); die Endwerte stehen im Durchgang „… 2.“ (der
//                zweite Druck laesst auslaufen).
//   „± 1 je Reihe“  alle Plaettchen ruecken gleichzeitig (gestaffelt) an ihre
//                neuen Plaetze (0,73 s bei 24), dann leuchten die vollen Reihen.
//                Liegt noch nichts, legt „+ 1 je Reihe“ wie eine Sprungmarke,
//                mit 1 je Reihe und allen Plaettchen der Schale.
//   „+ 1 Plaettchen“ ein Plaettchen springt in der Schale auf und fliegt an
//                den naechsten Platz (0,65 s); liegt noch nichts, kommt es nur
//                in die Schale. „− 1 Plaettchen“: das zuletzt gelegte fliegt in
//                die Schale zurueck und verschwindet (0,45 s).
//   „drehen“     (nur ohne Rest) das Rechteck dreht sich um eine Vierteldrehung
//                im Uhrzeigersinn (0,8 s): aus 3 Reihen zu je 8 werden 8 Reihen
//                zu je 3. Mit Rest wackelt das Bild und bleibt liegen,
//                _k6a-grenze sagt „Drehen geht nur ohne übrige Plättchen.“
//   „neu“        sofort der Start, die Plaettchen blenden in der Schale ein.
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst sie sofort ankommen
// (ohne Lichtring); dann geschieht das Neue. Jede Knopffolge ergibt so
// dieselben Zahlen. Jede Sprungmarke stellt ihren Zustand selbst her
// (24 Plaettchen, ihre Zahl je Reihe), gleich, was vorher gedrueckt wurde.
//
// Knoepfe (Bauplan, woertlich):
//   Reihe 1, Sprungmarken = Zeilen der Heft-Tabelle (_k6aMarke(6) …):
//     „6 je Reihe“ · „8 je Reihe“ · „10 je Reihe“ · „12 je Reihe“
//   Reihe 2: „− 1 je Reihe“ · „+ 1 je Reihe“ (_k6aJe(-1|1), 1 bis Zahl der
//     Plaettchen) · „− 1 Plättchen“ · „+ 1 Plättchen“ (_k6aZahl(-1|1), 1–36) ·
//     „drehen“ (_k6aDrehen()) · „neu“ (_k6aNeu())
//   „− 1 je Reihe“ und „drehen“ sind blass, solange nichts gelegt ist.
//   „+ 1 je Reihe“ legt dann den ganzen Vorrat mit 1 je Reihe (wie eine
//   Sprungmarke, aber mit der Zahl der Plaettchen, die gerade da ist): So
//   kann ein Kind von 1 an hochzaehlen – und 36 Plaettchen legen, die es
//   vorher mit „+ 1 Plättchen“ in die Schale getan hat (der Zusatz der
//   Lehrkraft). Ohne das liessen sich Plaettchen, die vor dem Legen
//   dazukommen, nie legen: jede Sprungmarke stellt 24 her.
//   Hervorgehoben ist die Sprungmarke, deren Feld gerade daliegt (24 Plaettchen).
//
// Statuszeilen (woertlich, jede mit mehr als 18 Zeichen):
//   _k6a-zahl    „Plättchen zusammen: 24“
//   _k6a-reihe   „Plättchen je Reihe: 8“ (Start „Plättchen je Reihe: noch nicht gewählt“)
//   _k6a-voll    „Volle Reihen auf dem Tisch: 3“ (zaehlt beim Abspielen mit, Start 0)
//   _k6a-rest    „Übrige Plättchen (Rest): 0“ (vorher und waehrend jeder Bewegung „…“)
//   _k6a-kurz    „Kurz geschrieben: 24 : 8 = 3“ bzw. „Kurz geschrieben: 24 : 10 = 2 Rest 4“
//                (vorher „…“)
//   _k6a-mal     nur ohne Rest „Als Malaufgabe: 3 · 8 = 24“, sonst ausgeblendet und leer
//   _k6a-grenze  nur an der Grenze, bis zur naechsten Handlung:
//                „Mehr Plättchen passen nicht auf den Tisch.“ (über 36)
//                „Weniger als 1 je Reihe geht nicht.“
//                „Drehen geht nur ohne übrige Plättchen.“
//                ZUSAETZLICH zum Bauplan (er nennt nur den Bereich):
//                „Mehr als 24 je Reihe geht nicht.“ (die Zahl ist die der
//                Plaettchen) und „Weniger als 1 Plättchen geht nicht.“ – gleich
//                gebaut wie die beiden Zeilen des Bauplans, damit jede Grenze
//                etwas sagt und nicht nur wackelt.
// Rechnungen stehen in <span style="white-space:nowrap">, damit
// „24 : 10 = 2 Rest 4“ in der schmalen Anzeige nicht umbricht.
//
// Werte (jede Sprungmarke nachgerechnet mit simcheck/werte.js, ausgelaufen):
//   6 je Reihe  → 4 volle Reihen, Rest 0, „24 : 6 = 4“,  „4 · 6 = 24“
//   8 je Reihe  → 3, Rest 0, „24 : 8 = 3“,  „3 · 8 = 24“
//   10 je Reihe → 2, Rest 4, „24 : 10 = 2 Rest 4“ (keine Malaufgabe)
//   12 je Reihe → 2, Rest 0, „24 : 12 = 2“, „2 · 12 = 24“
//   frei: 5 je Reihe → 4, Rest 4 · 7 → 3, Rest 3 · 24 → 1, Rest 0 · 1 → 24, Rest 0
//   „drehen“ nach 8 je Reihe → Plättchen je Reihe 3, volle Reihen 8,
//     „24 : 3 = 8“, „8 · 3 = 24“.
//   Grenzen der Zahl je Reihe: 1 bis Zahl der Plaettchen. „− 1 Plättchen“ bei
//   gleich vielen je Reihe wie Plaettchen nimmt die Zahl je Reihe mit (aus
//   1 Reihe zu 24 wird 1 Reihe zu 23) – sonst laege eine Reihe auf dem Tisch,
//   die laenger ist als alle Plaettchen zusammen.
// Start: 24 Plaettchen in der Schale, nichts gelegt („Start: 24 Plättchen,
// noch nicht gelegt“).
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen):
//   „8 je Reihe“ – die 3. Reihe schliesst genau mit dem letzten Plaettchen:
//     goldener Lichtring um das Rechteck und ein goldener Rahmen darum
//     (1,8 s; Gold, nicht Orange – Orange heisst hier immer Rest). Die 8
//     fehlt in Tareks Liste. Gilt fuer jedes Legen von 24 Plaettchen zu je 8,
//     das von selbst zu Ende laeuft (auch ueber „± 1 je Reihe“).
//   „10 je Reihe“ – die 4 uebrigen Plaettchen leuchten orange (1,4 s). Das
//     Leuchten gehoert zu JEDEM Rest, damit Orange immer dasselbe heisst.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-punktefeld, Container
// <div class="fpm-lehrkraft">; simfakten.js ueberspringt die Knoepfe dort).
// Eigene Zeile unter den Heftknoepfen, davor klein „Für die Lehrkraft:“:
//   „Pause“ ↔ „weiter“ (_k6aAnhalten()): friert jede Bewegung ein; Schild
//     „Pause“ oben links im Bild (Stelle und Aussehen wie in m5-punktefeld).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_k6aTempo()): ein Drittel so schnell.
//   „Zahlen verdecken: aus“ ↔ „… an“ (_k6aVerdecken()): verdeckt „Volle Reihen“,
//     „Übrige Plättchen“, „Kurz geschrieben“ und „Als Malaufgabe“ (dort steht
//     dann „verdeckt“ – „Als Malaufgabe“ auch mit Rest, sonst verriete das
//     Fehlen der Zeile den Rest), im Bild eine graue Karte mit „?“ statt der
//     Rechnung. Plaettchen, Klammer und „Plättchen je Reihe“ bleiben: zum
//     Vermuten an der Tafel.
//   Hinweiszeile _k6a-lehrkraft (im Container; in der Pause „lmp-status off“):
//     sonst    „Für die Lehrkraft: „Pause“ hält alles an. „Zahlen verdecken“ lässt erst vermuten.“
//     verdeckt „Zahlen verdeckt. Erst vermuten lassen, dann wieder aufdecken.“
//     Pause    „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
//   EIN Zeitfaktor (_k6aZeitfaktor: 0 Pause, 1/3 langsam, 1 normal) an der
//   einen Stelle, an der dt in _k6aUpdate geht. In der Pause bewegt kein Knopf
//   etwas: „± 1 …“ und „drehen“ werden VORGEMERKT, wenn nichts unterwegs ist
//   (es beginnt mit „weiter“), und ENTFALLEN, wenn eine Bewegung steht; das
//   Schild leuchtet dabei kurz auf (in echter Zeit). Sprungmarke und „neu“
//   heben die Pause auf; Tempo und Verdecken bleiben stehen.
//   Voreinstellung: Pause aus, Tempo normal, Verdecken aus.
//
// Abweichungen vom Bauplan (mit Grund):
//   * Zettel und Klammer im Bild sind dazugekommen. Der Bauplan beschreibt nur
//     Vorrat und Legefeld; ohne Zeichen im Bild staenden Bild und Rechnung auf
//     dem Handy weit auseinander (die Anzeige rutscht unter die Leinwand).
//     MATHE_PROFIL § 10.2 verlangt zwei Darstellungen, verbunden.
//   * Die zwei zusaetzlichen Grenzzeilen (siehe oben).
//   * „− 1 Plättchen“ nimmt die Zahl je Reihe mit, wenn sie sonst groesser
//     als die Zahl der Plaettchen waere (siehe Werte).
//   * „+ 1 je Reihe“ legt, solange nichts liegt, den Vorrat mit 1 je Reihe
//     (siehe Knoepfe); der Bauplan sagt nicht, was der Knopf vor dem ersten
//     Legen tut.
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Teiler“, „teilbar“,
// „Teilerpaar“, die Regel als Satz (kein „8 ist ein Teiler von 24“), eine
// Liste der Reihenlaengen ohne Rest. Keine Namen, keine Punkte, keine
// Zeitmessung, kein „falsch“. Deterministisch, ohne Zufall: jede Zahl im Bild
// und in der Anzeige kommt aus z.n (Plaettchen) und z.je (je Reihe).
// ════════════════════════════════════════════════════════════════════════
let _k6a = null;
const _k6aMARKEN = [6, 8, 10, 12];                 // Sprungmarken = Zeilen der Heft-Tabelle
const _k6aSTART = 24, _k6aMAX = 36;
const _k6aK = {
  KA: 15, KX0: 6, KY0: 6,                          // Karo: Kaestchen, Ursprung des Rasters
  PX0: 4, PX1: 416, PY0: 4, PY1: 246,              // Tisch (Papier)
  TX0: 12, TY0: 36, TF: 11, TPAD: 4, TR: 4.2,      // Schale: Ecke, Fach, Rand, Radius
  LX0: 156, LX1: 408, LY0: 51, LY1: 240,           // Legefeld (LX0, LY0 auf dem Karo)
  RP: 0.36,                                        // Radius eines Plaettchens = RP · Kaestchen
  KOPF: 27,                                        // Grundlinie der Aufschriften
  ZX0: 12, ZX1: 141, ZY0: 176, ZY1: 238,           // Zettel
  T_LEER: 0.35, T_LEER0: 0.12, T_JE: 0.08, T_FLUG: 0.3,
  T_UM: 0.45, T_UMSTAG: 0.012, T_DREH: 0.8, T_POP: 0.25, T_PFLUG: 0.4,
  T_WEG: 0.45, T_VORRAT: 0.3, T_NEU: 0.35, T_GLANZ: 0.7, T_REST: 1.4,
  T_AHA: 1.8, T_ZETTEL: 0.35, T_KLAMMER: 0.3, LANGSAM: 1 / 3,
  F_PUNKT: '#3b82f6', F_PRAND: '#1d4ed8', F_BLAU: '#1d4ed8',
  F_REST: '#f97316', F_RRAND: '#c2410c', F_ORANGE: '#c2410c',
  F_GRUEN: '#047857', F_TEXT: '#111827', F_GRAU: '#475569', F_KARO: '#d4e3f1'
};

// ── Orte ────────────────────────────────────────────────────────────────
// Fach m (0 … 35) der Schale: Zehnerreihen, nach dem 5. ein Fach frei.
function _k6aFach(m) {
  const K = _k6aK, c = m % 10, r = Math.floor(m / 10);
  return [K.TX0 + K.TPAD + (c + (c >= 5 ? 1 : 0)) * K.TF + K.TF / 2,
          K.TY0 + K.TPAD + r * K.TF + K.TF / 2];
}
// Lage von n Plaettchen zu je „je“: Kaestchengroesse s, Ecke, Masse.
function _k6aLage(n, je) {
  const K = _k6aK, R = Math.ceil(n / je);
  const wU = je + Math.floor((je - 1) / 5), hU = R + Math.floor((R - 1) / 5);
  const s = Math.min(K.KA, (K.LX1 - K.LX0) / wU, (K.LY1 - K.LY0) / hU);
  let x0 = K.LX0 + (K.LX1 - K.LX0 - wU * s) / 2;   // waagerecht mittig …
  if (s === K.KA) x0 = K.LX0 + Math.floor((K.LX1 - K.LX0 - wU * s) / 2 / K.KA) * K.KA;   // … auf dem Karo
  return { n, je, R, F: Math.floor(n / je), r: n % je, s, x0, y0: K.LY0, w: wU * s, h: hU * s };
}
// Mitte des Platzes k (Lesereihenfolge) – auch fuer die leeren Plaetze der letzten Reihe.
function _k6aOrt(L, k) {
  const i = Math.floor(k / L.je), j = k % L.je;
  return [L.x0 + (j + Math.floor(j / 5)) * L.s + L.s / 2,
          L.y0 + (i + Math.floor(i / 5)) * L.s + L.s / 2];
}
function _k6aRadius(s) { return s * _k6aK.RP; }
// Klammer ueber der ersten Reihe: linke und rechte Kante
function _k6aKante(L) {
  const a = _k6aOrt(L, 0), b = _k6aOrt(L, L.je - 1);
  return [a[0] - L.s / 2 + 1, b[0] + L.s / 2 - 1];
}
// Sprungmarke: Plaettchen k fliegt los / landet
function _k6aAb(L, k) { return L.leer + k * _k6aK.T_JE; }
function _k6aAn(L, k) { return _k6aAb(L, k) + _k6aK.T_FLUG; }

function _k6aInit() {
  _k6a = { t: 0, n: _k6aSTART, je: null, gelegt: false, lauf: null,
           glanz: new Array(_k6aMAX).fill(0), restGlanz: 0, ahaGlanz: 0,
           wackel: 0, grenze: '', ein: _k6aK.T_NEU, klammerEin: 1, zettel: 0, zettelAn: false,
           pause: false, langsam: false, verdeckt: false, blink: 0, vormerk: null,   // Lehrkraft
           fx: { teile: [] }, schluessel: '' };
}
function _k6aHTML() {
  const marke = je => `<button class="sim-btn" id="_k6a-b-${je}" onclick="_k6aMarke(${je})">${je} je Reihe</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Bei welchen Reihen bleibt kein Plättchen übrig?</h3>
    <div class="fpm-note" style="margin-top:2px">Alle Reihen sollen gleich lang sein. Wähle die Zahl je Reihe.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_k6a-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_k6aMARKEN.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn" id="_k6a-je-ab" onclick="_k6aJe(-1)">−&nbsp;1 je Reihe</button>
          <button class="sim-btn" id="_k6a-je-auf" onclick="_k6aJe(1)">+&nbsp;1 je Reihe</button>
          <button class="sim-btn" onclick="_k6aZahl(-1)">−&nbsp;1 Plättchen</button>
          <button class="sim-btn" onclick="_k6aZahl(1)">+&nbsp;1 Plättchen</button>
          <button class="sim-btn" id="_k6a-drehen" onclick="_k6aDrehen()">drehen</button>
          <button class="sim-btn" onclick="_k6aNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_k6a-pause" onclick="_k6aAnhalten()">Pause</button>
            <button class="sim-btn" id="_k6a-tempo" onclick="_k6aTempo()">Tempo: <span id="_k6a-tempo-an">normal</span></button>
            <button class="sim-btn" id="_k6a-verdeckt" onclick="_k6aVerdecken()">Zahlen verdecken: <span id="_k6a-verdeckt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_k6a-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_k6a-zahl" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6a-reihe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6a-voll" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6a-rest" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6a-kurz" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_k6a-mal" style="margin-top:6px;display:none"></div>
        <div class="lmp-status off" id="_k6a-grenze" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 24 Plättchen, noch nicht gelegt</p>
  </div>`;
}
function _k6aSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Was die Anzeige gerade sagt: Plaettchen, je Reihe, volle Reihen, Rest, liegt alles?
function _k6aStand() {
  const z = _k6a, L = z.lauf;
  if (L && L.art === 'bau') return { n: L.n, je: L.je, voll: Math.floor(L.liegt / L.je), r: 0, fertig: false };
  if (!z.gelegt) return { n: z.n, je: null, voll: 0, r: 0, fertig: false };
  return { n: z.n, je: z.je, voll: Math.floor(z.n / z.je), r: z.n % z.je, fertig: !L };
}
function _k6aStatus() {
  if (!_k6a) return;
  const z = _k6a, K = _k6aK, st = _k6aStand();
  const f = (s, farbe) => '<b style="color:' + farbe + '">' + s + '</b>';
  const nb = s => '<span style="white-space:nowrap">' + s + '</span>';
  _k6aSetze('_k6a-zahl', 'Plättchen zusammen: ' + st.n);
  _k6aSetze('_k6a-reihe', 'Plättchen je Reihe: ' + (st.je ? f(st.je, K.F_BLAU) : 'noch nicht gewählt'));
  _k6aSetze('_k6a-voll', 'Volle Reihen auf dem Tisch: ' + (z.verdeckt ? 'verdeckt' : f(st.voll, K.F_GRUEN)));
  _k6aSetze('_k6a-rest', 'Übrige Plättchen (Rest): ' +
            (z.verdeckt ? 'verdeckt' : st.fertig ? f(st.r, K.F_ORANGE) : '…'));
  _k6aSetze('_k6a-kurz', 'Kurz geschrieben: ' + (z.verdeckt ? 'verdeckt' : !st.fertig ? '…'
    : nb(st.n + ' : ' + f(st.je, K.F_BLAU) + ' = ' + f(st.voll, K.F_GRUEN) +
         (st.r ? ' ' + f('Rest ' + st.r, K.F_ORANGE) : ''))));
  // Als Malaufgabe nur ohne Rest; verdeckt auch mit Rest (das Fehlen verriete ihn)
  const mal = !st.fertig ? '' : z.verdeckt ? 'Als Malaufgabe: verdeckt'
    : st.r ? '' : 'Als Malaufgabe: ' + nb(f(st.voll, K.F_GRUEN) + ' · ' + f(st.je, K.F_BLAU) + ' = ' + st.n);
  const m = _k6aSetze('_k6a-mal', mal);
  if (m && m.style) m.style.display = mal ? '' : 'none';
  const g = _k6aSetze('_k6a-grenze', z.grenze);
  if (g && g.style) g.style.display = z.grenze ? '' : 'none';
  // Sprungmarke hervorheben, deren Feld gerade daliegt oder gelegt wird
  const L = z.lauf, ziel = L && L.art === 'bau' ? L.je : z.gelegt && z.n === _k6aSTART ? z.je : null;
  for (const je of _k6aMARKEN) {
    const b = document.getElementById('_k6a-b-' + je);
    if (b && b.classList) b.classList.toggle('primary', je === ziel);
  }
  // „− 1 je Reihe“ und „drehen“ erst, wenn etwas gelegt ist
  for (const id of ['_k6a-je-ab', '_k6a-drehen']) {
    const b = document.getElementById(id);
    if (b) { b.disabled = !z.gelegt; if (b.style) b.style.opacity = z.gelegt ? '' : '0.45'; }
  }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _k6aSetze('_k6a-pause', z.pause ? 'weiter' : 'Pause');
  _k6aSetze('_k6a-tempo-an', z.langsam ? 'langsam' : 'normal');
  _k6aSetze('_k6a-verdeckt-an', z.verdeckt ? 'an' : 'aus');
  const hz = _k6aSetze('_k6a-lehrkraft',
    z.pause ? 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.'
    : z.verdeckt ? 'Zahlen verdeckt. Erst vermuten lassen, dann wieder aufdecken.'
    : 'Für die Lehrkraft: „Pause“ hält alles an. „Zahlen verdecken“ lässt erst vermuten.');
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_k6a-pause', z.pause], ['_k6a-verdeckt', z.verdeckt]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
}

// ── Bedienung ───────────────────────────────────────────────────────────
// Vor jeder neuen Handlung: Leuchten, Grenze und Zettel weg.
function _k6aAufraeumen() {
  const z = _k6a;
  z.grenze = ''; z.wackel = 0; z.zettelAn = false; z.zettel = 0;
  z.restGlanz = 0; z.ahaGlanz = 0; z.glanz.fill(0); z.fx.teile.length = 0;
}
// Sprungmarke: 24 Plaettchen zu je „je“ neu legen. Hebt die Pause auf.
function _k6aMarke(je) {
  if (!_k6a || _k6aMARKEN.indexOf(je) < 0) return;
  const z = _k6a;
  _k6aFertig();
  z.pause = false; z.vormerk = null; z.blink = 0;
  _k6aLegen(_k6aSTART, je);
}
// n Plaettchen zu je „je“ neu legen: erst leert sich das Legefeld, dann fliegen sie einzeln.
function _k6aLegen(n, je) {
  const z = _k6a;
  _k6aAufraeumen();
  const alt = { n: z.n, je: z.je, gelegt: z.gelegt };
  z.n = n; z.je = je; z.gelegt = true;
  z.lauf = { art: 'bau', at: 0, n, je, liegt: 0, alt,
             leer: alt.gelegt || alt.n !== n ? _k6aK.T_LEER : _k6aK.T_LEER0,
             B: _k6aLage(n, je), A: alt.gelegt ? _k6aLage(alt.n, alt.je) : null };
  _k6aStatus();
}
// „neu“: sofort der Start. Hebt die Pause auf.
function _k6aNeu() {
  if (!_k6a) return;
  const z = _k6a;
  z.lauf = null; z.pause = false; z.vormerk = null; z.blink = 0;
  _k6aAufraeumen();
  z.n = _k6aSTART; z.je = null; z.gelegt = false; z.ein = _k6aK.T_NEU; z.klammerEin = 1;
  _k6aStatus();
}
// Waehrend der Pause: vormerken, wenn nichts unterwegs ist; sonst entfaellt der Druck.
function _k6aInDerPause(tat) {
  const z = _k6a;
  z.blink = 0.6;
  if (!z.lauf) z.vormerk = tat;
}
function _k6aGrenze(text) {
  const z = _k6a;
  z.wackel = 0.45; z.grenze = text;
  _k6aStatus();
}
// „− 1 je Reihe“ / „+ 1 je Reihe“: alle Plaettchen ruecken um.
function _k6aJe(d) {
  if (!_k6a || (d !== 1 && d !== -1)) return;
  const z = _k6a, K = _k6aK;
  if (!z.gelegt && d < 0) return;                   // „− 1 je Reihe“ ist blass, solange nichts gelegt ist
  if (z.pause) { _k6aInDerPause(() => _k6aJe(d)); return; }
  _k6aFertig();
  z.grenze = '';
  if (!z.gelegt) { _k6aLegen(z.n, 1); return; }     // noch nichts gelegt: mit 1 je Reihe anfangen
  if (d < 0 && z.je <= 1) { _k6aGrenze('Weniger als 1 je Reihe geht nicht.'); return; }
  if (d > 0 && z.je >= z.n) { _k6aGrenze('Mehr als ' + z.n + ' je Reihe geht nicht.'); return; }
  _k6aAufraeumen();
  z.lauf = { art: 'um', at: 0, A: _k6aLage(z.n, z.je), B: _k6aLage(z.n, z.je + d), neu: z.je + d,
             dauer: (z.n - 1) * K.T_UMSTAG + K.T_UM };
  _k6aStatus();
}
// „− 1 Plättchen“ / „+ 1 Plättchen“
function _k6aZahl(d) {
  if (!_k6a || (d !== 1 && d !== -1)) return;
  const z = _k6a, K = _k6aK;
  if (z.pause) { _k6aInDerPause(() => _k6aZahl(d)); return; }
  _k6aFertig();
  z.grenze = '';
  if (d > 0 && z.n >= _k6aMAX) { _k6aGrenze('Mehr Plättchen passen nicht auf den Tisch.'); return; }
  if (d < 0 && z.n <= 1) { _k6aGrenze('Weniger als 1 Plättchen geht nicht.'); return; }
  _k6aAufraeumen();
  const art = d > 0 ? 'plus' : 'minus';
  if (z.gelegt) {
    const nNeu = z.n + d;
    z.lauf = { art, at: 0, A: _k6aLage(z.n, z.je), B: _k6aLage(nNeu, Math.min(z.je, nNeu)),
               dauer: d > 0 ? K.T_POP + K.T_PFLUG : K.T_WEG };
  } else z.lauf = { art, at: 0, vorrat: true, dauer: K.T_VORRAT };
  _k6aStatus();
}
// „drehen“: nur ohne Rest – das Rechteck dreht sich um eine Vierteldrehung.
function _k6aDrehen() {
  if (!_k6a) return;
  const z = _k6a, K = _k6aK;
  if (!z.gelegt) return;                            // blass, solange nichts gelegt ist
  if (z.pause) { _k6aInDerPause(() => _k6aDrehen()); return; }
  _k6aFertig();
  z.grenze = '';
  if (z.n % z.je) { _k6aGrenze('Drehen geht nur ohne übrige Plättchen.'); return; }
  _k6aAufraeumen();
  const R = z.n / z.je;
  z.lauf = { art: 'dreh', at: 0, A: _k6aLage(z.n, z.je), B: _k6aLage(z.n, R), neu: R, dauer: K.T_DREH };
  _k6aStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _k6aAnhalten() {
  if (!_k6a) return;
  const z = _k6a;
  if (z.pause) {
    z.pause = false; z.blink = 0;
    const v = z.vormerk;
    z.vormerk = null;
    if (v && !z.lauf) { v(); return; }
  } else z.pause = true;
  _k6aStatus();
}
function _k6aTempo() {
  if (!_k6a) return;
  _k6a.langsam = !_k6a.langsam;
  _k6aStatus();
}
function _k6aVerdecken() {
  if (!_k6a) return;
  _k6a.verdeckt = !_k6a.verdeckt;
  _k6aStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _k6aZeitfaktor(z) { return z.pause ? 0 : z.langsam ? _k6aK.LANGSAM : 1; }

// Die laufende Bewegung ankommen lassen: erst jetzt aendern sich die Zahlen.
// von selbst (natuerlich): mit Leuchten und Lichtring; abgebrochen: ohne.
function _k6aAnkommen(natuerlich) {
  const z = _k6a, K = _k6aK, L = z.lauf;
  if (!L) return;
  z.lauf = null;
  if (L.art === 'um' || L.art === 'dreh') z.je = L.neu;
  else if (L.art === 'plus') z.n += 1;
  else if (L.art === 'minus') { z.n -= 1; if (z.gelegt) z.je = Math.min(z.je, z.n); }
  if (L.art === 'dreh') z.klammerEin = 0;          // die Klammer kommt nach der Drehung
  if (z.gelegt) {
    z.zettelAn = true; z.zettel = 0;
    const lage = _k6aLage(z.n, z.je);
    if (natuerlich) {
      if (L.art === 'um' || L.art === 'dreh') for (let i = 0; i < lage.F; i++) z.glanz[i] = K.T_GLANZ;
      if (L.art === 'plus' && lage.r === 0) z.glanz[lage.F - 1] = K.T_GLANZ;   // eine Reihe ist voll geworden
      if (lage.r) z.restGlanz = K.T_REST;
      if ((L.art === 'bau' || L.art === 'um') && z.n === 24 && z.je === 8) {
        // Aha: die 3. Reihe schliesst genau mit dem letzten Plaettchen
        z.ahaGlanz = K.T_AHA;
        const a = _k6aOrt(lage, 0), b = _k6aOrt(lage, lage.n - 1);
        // Ring bis knapp ueber die Ecken, aber nie ueber die Oberkante der Leinwand
        const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
        _bioFxWelle(z.fx.teile, cx, cy, '#eab308',
                    Math.min(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2 + 12, cy - 4));
      }
    }
  }
  _k6aStatus();
}
function _k6aFertig() { if (_k6a && _k6a.lauf) _k6aAnkommen(false); }

// ── Bewegung ────────────────────────────────────────────────────────────
function _k6aUpdate(dt) {
  if (!_k6a) return;
  const z = _k6a, K = _k6aK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);             // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _k6aZeitfaktor(z);                     // ab hier Sim-Zeit: 0 Pause, 1/3 langsam, 1 normal
  z.t += dt;
  for (let i = 0; i < z.glanz.length; i++) z.glanz[i] = Math.max(0, z.glanz[i] - dt);
  z.restGlanz = Math.max(0, z.restGlanz - dt);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  z.ein = Math.max(0, z.ein - dt);
  z.klammerEin = Math.min(1, z.klammerEin + dt / K.T_KLAMMER);
  if (z.zettelAn) z.zettel = Math.min(1, z.zettel + dt / K.T_ZETTEL);
  const L = z.lauf;
  if (L && dt > 0) {                                // ohne Zeit kein Schritt im Ablauf
    L.at += dt;
    if (L.art === 'bau') {
      let liegt = L.liegt;
      while (liegt < L.n && L.at >= _k6aAn(L, liegt)) {
        liegt++;
        if (liegt % L.je === 0) z.glanz[liegt / L.je - 1] = K.T_GLANZ;   // eine Reihe ist voll
      }
      if (liegt !== L.liegt) {
        L.liegt = liegt;
        if (liegt >= L.n) _k6aAnkommen(true); else _k6aStatus();
      }
    } else if (L.at >= L.dauer) _k6aAnkommen(true);
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Was gerade zu sehen ist ─────────────────────────────────────────────
// steine: {x, y, r, o (Anteil Orange), a (Deckkraft), s (Massstab), flieg}
// leer:   gestrichelte leere Plaetze {x, y, r, a}
// lage:   das ruhende Feld (fuer Leuchtbaender, Rahmen, Restleuchten)
// klammer: {l, r, je, a}
function _k6aSzene() {
  const z = _k6a, K = _k6aK, L = z.lauf, E = _bioFxEase, kl = _bioFxKlemme;
  const S = { steine: [], leer: [], lage: null, klammer: null };
  const lerp = (a, b, u) => a + (b - a) * u;
  const stein = (x, y, r, o, a, s, flieg) =>
    S.steine.push({ x, y, r, o: o || 0, a: a === undefined ? 1 : a, s: s === undefined ? 1 : s, flieg: !!flieg });
  const leere = (A, a, B, u) => {
    for (let k = A.n; k < A.R * A.je; k++) {
      const p = _k6aOrt(A, k), q = B ? _k6aOrt(B, k) : p, uu = B ? u : 0;
      S.leer.push({ x: lerp(p[0], q[0], uu), y: lerp(p[1], q[1], uu),
                    r: _k6aRadius(B ? lerp(A.s, B.s, uu) : A.s), a });
    }
  };
  const klammer = (A, B, u, je, a) => {
    const ka = _k6aKante(A), kb = B ? _k6aKante(B) : ka, uu = B ? u : 0;
    S.klammer = { l: lerp(ka[0], kb[0], uu), r: lerp(ka[1], kb[1], uu), je, a };
  };
  const istRest = (A, k) => k >= A.F * A.je;
  const vorrat = (n, a) => { for (let m = 0; m < n; m++) { const p = _k6aFach(m); stein(p[0], p[1], K.TR, 0, a); } };

  if (!L) {
    if (!z.gelegt) { vorrat(z.n, z.ein > 0 ? 1 - z.ein / K.T_NEU : 1); return S; }
    const A = _k6aLage(z.n, z.je);
    for (let k = 0; k < A.n; k++) { const p = _k6aOrt(A, k); stein(p[0], p[1], _k6aRadius(A.s), istRest(A, k) ? 1 : 0); }
    leere(A, 1);
    S.lage = A;
    klammer(A, null, 0, z.je, E.sanft(z.klammerEin));
    return S;
  }
  const at = L.at;
  if (L.art === 'bau') {
    const B = L.B, n = L.n;
    if (at < L.leer) {
      // Das Legefeld leert sich: alles gleitet in die Schale (Fach von hinten).
      const u = E.sanft(kl(at / L.leer)), alt = L.alt;
      if (alt.gelegt) {
        const A = L.A;
        for (let k = 0; k < A.n; k++) {
          const m = A.n - 1 - k, p = _k6aOrt(A, k), q = _k6aFach(m);
          stein(lerp(p[0], q[0], u), lerp(p[1], q[1], u) - 14 * Math.sin(Math.PI * u),
                lerp(_k6aRadius(A.s), K.TR, u), istRest(A, k) ? 1 - u : 0, m >= n ? 1 - u : 1, 1, true);
        }
        leere(A, 1 - u);
        klammer(A, null, 0, alt.je, 1 - u);
      } else for (let m = 0; m < alt.n; m++) { const p = _k6aFach(m); stein(p[0], p[1], K.TR, 0, m >= n ? 1 - u : 1); }
      for (let m = alt.n; m < n; m++) { const p = _k6aFach(m); stein(p[0], p[1], K.TR, 0, 1, u); }   // fehlende springen auf
      return S;
    }
    S.lage = B;
    klammer(B, null, 0, L.je, E.sanft(kl((at - L.leer) / 0.25)));
    for (let k = 0; k < n; k++) {
      const ab = _k6aAb(L, k), an = _k6aAn(L, k), m = n - 1 - k;
      if (at < ab) { const p = _k6aFach(m); stein(p[0], p[1], K.TR, 0, 1); }
      else if (at < an) {
        const u = E.sanft(kl((at - ab) / K.T_FLUG)), p = _k6aFach(m), q = _k6aOrt(B, k);
        const hub = 12 + Math.abs(q[0] - p[0]) * 0.06;  // flacher Bogen: bleibt unter den Aufschriften
        stein(lerp(p[0], q[0], u), lerp(p[1], q[1], u) - hub * Math.sin(Math.PI * u),
              lerp(K.TR, _k6aRadius(B.s), u), 0, 1, 1, true);
      } else {
        const p = _k6aOrt(B, k), d = at - an;       // kleiner Hopser beim Landen
        stein(p[0], p[1], _k6aRadius(B.s), 0, 1, d < 0.18 ? 1 + 0.22 * Math.sin(Math.PI * d / 0.18) : 1);
      }
    }
    return S;
  }
  if (L.vorrat) {                                   // nichts gelegt: nur die Schale aendert sich
    const u = kl(at / L.dauer);
    if (L.art === 'plus') {
      vorrat(z.n, 1);
      const p = _k6aFach(z.n);
      stein(p[0], p[1], K.TR, 0, 1, Math.max(0, E.federn(u)));
    } else {
      vorrat(z.n - 1, 1);
      const p = _k6aFach(z.n - 1);
      stein(p[0], p[1], K.TR, 0, 1 - u, 1 - E.sanft(u));
    }
    return S;
  }
  const A = L.A, B = L.B;
  if (L.art === 'um') {
    // alle ruecken an ihre neuen Plaetze, gestaffelt
    for (let k = 0; k < A.n; k++) {
      const u = E.sanft(kl((at - k * K.T_UMSTAG) / K.T_UM)), p = _k6aOrt(A, k), q = _k6aOrt(B, k);
      stein(lerp(p[0], q[0], u), lerp(p[1], q[1], u), _k6aRadius(lerp(A.s, B.s, u)), istRest(A, k) ? 1 - u : 0);
    }
    leere(A, 1 - kl(at / 0.2));
    klammer(A, B, E.sanft(kl(at / L.dauer)), A.je, 1);
    return S;
  }
  if (L.art === 'plus') {
    // springt in der Schale auf, fliegt an den naechsten Platz; die anderen ruecken mit
    const u = E.sanft(kl((at - K.T_POP) / K.T_PFLUG));
    for (let k = 0; k < A.n; k++) {
      const p = _k6aOrt(A, k), q = _k6aOrt(B, k);
      stein(lerp(p[0], q[0], u), lerp(p[1], q[1], u), _k6aRadius(lerp(A.s, B.s, u)), istRest(A, k) ? 1 : 0);
    }
    for (let k = A.n; k < A.R * A.je; k++) {         // auch der Platz, auf dem es landet
      const p = _k6aOrt(A, k), q = _k6aOrt(B, k);
      S.leer.push({ x: lerp(p[0], q[0], u), y: lerp(p[1], q[1], u), r: _k6aRadius(lerp(A.s, B.s, u)), a: 1 });
    }
    const f = _k6aFach(0), q = _k6aOrt(B, A.n);
    if (at < K.T_POP) stein(f[0], f[1], K.TR, 0, 1, Math.max(0, E.federn(kl(at / K.T_POP))), true);
    else stein(lerp(f[0], q[0], u), lerp(f[1], q[1], u) - (12 + Math.abs(q[0] - f[0]) * 0.06) * Math.sin(Math.PI * u),
               lerp(K.TR, _k6aRadius(B.s), u), 0, 1, 1, true);
    klammer(A, B, u, A.je, 1);
    return S;
  }
  if (L.art === 'minus') {
    // das zuletzt gelegte fliegt in die Schale und verschwindet; die anderen ruecken mit
    const u = E.sanft(kl(at / K.T_WEG));
    for (let k = 0; k < A.n - 1; k++) {
      const p = _k6aOrt(A, k), q = _k6aOrt(B, k);
      stein(lerp(p[0], q[0], u), lerp(p[1], q[1], u), _k6aRadius(lerp(A.s, B.s, u)), istRest(A, k) ? 1 : 0);
    }
    leere(A, 1 - kl(at / 0.15));
    const p = _k6aOrt(A, A.n - 1), f = _k6aFach(0), weg = kl((at / K.T_WEG - 0.6) / 0.4);
    stein(lerp(p[0], f[0], u), lerp(p[1], f[1], u) - (12 + Math.abs(p[0] - f[0]) * 0.06) * Math.sin(Math.PI * u),
          lerp(_k6aRadius(A.s), K.TR, u), istRest(A, A.n - 1) ? 1 - u : 0, 1, 1 - weg, true);
    klammer(A, B, u, A.je, 1);
    return S;
  }
  // „drehen“: Vierteldrehung im Uhrzeigersinn um die Mitte, die dabei an ihren neuen Ort wandert
  const u = kl(at / K.T_DREH), e = E.sanft(u), th = Math.PI / 2 * e, R = A.R, C = A.je;
  const cA = [A.x0 + A.w / 2, A.y0 + A.h / 2], cB = [B.x0 + B.w / 2, B.y0 + B.h / 2];
  const cx = lerp(cA[0], cB[0], e), cy = lerp(cA[1], cB[1], e), sk = lerp(1, B.s / A.s, e);
  const w = E.sanft(kl((u - 0.55) / 0.45)), cos = Math.cos(th), sin = Math.sin(th);
  for (let k = 0; k < A.n; k++) {
    const i = Math.floor(k / C), j = k % C, p = _k6aOrt(A, k), q = _k6aOrt(B, j * R + (R - 1 - i));
    const dx = (p[0] - cA[0]) * sk, dy = (p[1] - cA[1]) * sk;
    stein(lerp(cx + dx * cos - dy * sin, q[0], w), lerp(cy + dx * sin + dy * cos, q[1], w),
          _k6aRadius(lerp(A.s, B.s, e)), 0);
  }
  klammer(A, null, 0, A.je, 1 - kl(u / 0.2));
  return S;
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _k6aPapier(ctx) {
  const K = _k6aK;
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, K.PX0 + 2, K.PY0 + 3, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.fill();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  for (let x = K.KX0; x < K.PX1 - 1; x += K.KA) {
    ctx.beginPath(); ctx.moveTo(x, K.PY0 + 1); ctx.lineTo(x, K.PY1 - 1); ctx.stroke();
  }
  for (let y = K.KY0; y < K.PY1 - 1; y += K.KA) {
    ctx.beginPath(); ctx.moveTo(K.PX0 + 1, y); ctx.lineTo(K.PX1 - 1, y); ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.PX0, K.PY0, K.PX1 - K.PX0, K.PY1 - K.PY0, 6); ctx.stroke();
  ctx.restore();
}
// Aufschrift mit weissem Grund (liegt sonst auf den Karolinien)
function _k6aAufschrift(ctx, s, x, y, gr, farbe, ausr) {
  ctx.save();
  ctx.font = '700 ' + gr + 'px sans-serif';
  const w = ctx.measureText(s).width, x0 = ausr === 'center' ? x - w / 2 : x;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillRect(x0 - 3, y - gr * 0.85, w + 6, gr * 1.1);
  ctx.fillStyle = farbe; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x0, y);
  ctx.restore();
}
// Die Schale „Vorrat“ (leere Faecher ganz blass) und die Aufschrift „Legefeld“
function _k6aSchale(ctx, wk) {
  const K = _k6aK, z = _k6a;
  const x1 = K.TX0 + 2 * K.TPAD + 11 * K.TF, y1 = K.TY0 + 2 * K.TPAD + 4 * K.TF;
  ctx.save();
  ctx.translate(z.gelegt ? 0 : wk, 0);
  ctx.fillStyle = 'rgba(15,23,42,0.07)';
  _bioFxRundRect(ctx, K.TX0 + 1.5, K.TY0 + 2.5, x1 - K.TX0, y1 - K.TY0, 7); ctx.fill();
  ctx.fillStyle = '#eef2f7'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, K.TX0, K.TY0, x1 - K.TX0, y1 - K.TY0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#dbe3ed';                        // blasse Faecher: wo die Plaettchen herkommen
  const L = z.lauf, n = L && L.art === 'bau' ? Math.max(L.n, L.alt.n) : L && L.art === 'plus' ? z.n + 1 : z.n;
  for (let m = 0; m < n; m++) {
    const p = _k6aFach(m);
    ctx.beginPath(); ctx.arc(p[0], p[1], 1.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  _k6aAufschrift(ctx, 'Vorrat', K.TX0 + 2, K.KOPF, 12, K.F_GRAU, 'left');
  _k6aAufschrift(ctx, 'Legefeld', K.LX0, K.KOPF, 12, K.F_GRAU, 'left');
}
// Ein Plaettchen: r = Radius, o = Anteil Orange (Rest), a = Deckkraft
function _k6aStein(ctx, x, y, r, o, a) {
  const K = _k6aK;
  if (a <= 0.01 || r <= 0.3) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, a);
  ctx.lineWidth = r > 3 ? 1.2 : 0.8;
  ctx.fillStyle = K.F_PUNKT; ctx.strokeStyle = K.F_PRAND;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (o > 0.01) {
    ctx.globalAlpha = Math.min(1, a) * Math.min(1, o);
    ctx.fillStyle = K.F_REST; ctx.strokeStyle = K.F_RRAND;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = Math.min(1, a);
  }
  if (r > 3) {                                      // Lichtpunkt: sieht aus wie ein Plaettchen
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// Leuchtbaender (volle Reihen), Rahmen (Aha), leere Plaetze, Restleuchten
function _k6aFeldUnten(ctx, S, wk) {
  const z = _k6a, K = _k6aK, A = S.lage;
  ctx.save();
  ctx.translate(wk, 0);
  if (A) {
    const s = A.s;
    for (let i = 0; i < A.F; i++) {
      if (!(z.glanz[i] > 0)) continue;
      const p = _k6aOrt(A, i * A.je), q = _k6aOrt(A, i * A.je + A.je - 1);
      ctx.globalAlpha = Math.min(1, z.glanz[i] / K.T_GLANZ);
      ctx.fillStyle = 'rgba(16,185,129,0.28)'; ctx.strokeStyle = 'rgba(4,120,87,0.85)'; ctx.lineWidth = 1.5;
      _bioFxRundRect(ctx, p[0] - s / 2 + 0.5, p[1] - s / 2 + 0.5, q[0] - p[0] + s - 1, s - 1, Math.min(6, s / 2));
      ctx.fill(); ctx.stroke();
    }
    if (z.ahaGlanz > 0 && A.F > 0) {                // Aha: goldener Rahmen um das ganze Rechteck
      const p = _k6aOrt(A, 0), q = _k6aOrt(A, A.F * A.je - 1), r = _k6aRadius(s) + 3;
      ctx.globalAlpha = Math.min(1, z.ahaGlanz / 0.6);
      ctx.fillStyle = 'rgba(250,204,21,0.16)'; ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 2.5;
      _bioFxRundRect(ctx, p[0] - r, p[1] - r, q[0] - p[0] + 2 * r, q[1] - p[1] + 2 * r, 6);
      ctx.fill(); ctx.stroke();
    }
    if (z.restGlanz > 0 && A.r) {                   // die uebrigen Plaettchen leuchten orange
      const puls = 0.55 + 0.45 * Math.sin(z.t * 9);
      ctx.globalAlpha = Math.min(1, z.restGlanz / 0.5) * puls;
      ctx.fillStyle = 'rgba(251,146,60,0.5)';
      for (let k = A.F * A.je; k < A.n; k++) {
        const p = _k6aOrt(A, k);
        ctx.beginPath(); ctx.arc(p[0], p[1], _k6aRadius(s) * 1.9, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = K.F_RRAND; ctx.lineWidth = 1.2;
  ctx.setLineDash([2.5, 2]);
  for (const e of S.leer) {
    if (e.a <= 0.01) continue;
    ctx.globalAlpha = Math.min(1, e.a);
    ctx.beginPath(); ctx.arc(e.x, e.y, Math.max(1, e.r), 0, Math.PI * 2); ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();
}
// Klammer ueber der ersten Reihe mit „8 je Reihe“ (blau wie die Zahl je Reihe)
function _k6aKlammer(ctx, S, wk) {
  const K = _k6aK, k = S.klammer;
  if (!k || !(k.a > 0.01)) return;
  const y = K.LY0 - 3, l = k.l + wk, r = k.r + wk, m = (l + r) / 2;
  const h = 5;
  ctx.save();
  ctx.globalAlpha = Math.min(1, k.a);
  ctx.strokeStyle = K.F_BLAU; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (r - l >= 4 * h) {                             // geschweifte Klammer
    ctx.moveTo(l, y);
    ctx.quadraticCurveTo(l, y - h, l + h, y - h);
    ctx.lineTo(m - h, y - h);
    ctx.quadraticCurveTo(m, y - h, m, y - 2 * h);
    ctx.quadraticCurveTo(m, y - h, m + h, y - h);
    ctx.lineTo(r - h, y - h);
    ctx.quadraticCurveTo(r, y - h, r, y);
  } else {                                          // ganz schmale Reihe: eckige Klammer mit Strich
    ctx.moveTo(l, y); ctx.lineTo(l, y - h); ctx.lineTo(r, y - h); ctx.lineTo(r, y);
    ctx.moveTo(m, y - h); ctx.lineTo(m, y - 2 * h);
  }
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = Math.min(1, k.a);
  _k6aAufschrift(ctx, k.je + ' je Reihe', m, y - 2 * h - 4, 12, K.F_BLAU, 'center');
  ctx.restore();
}
// Teile einer Rechnung mittig setzen; zu breit -> kleiner (nie unter 11 px)
function _k6aZeile(ctx, teile, xm, y, gr0, platz) {
  let gr = gr0, br = [], luft = 0, ges = 0;
  const messen = () => {
    ctx.font = '700 ' + gr + 'px sans-serif';
    br = teile.map(t => ctx.measureText(t.s).width);
    luft = gr * 0.3;
    ges = br.reduce((a, b) => a + b, 0) + luft * (teile.length - 1);
  };
  messen();
  if (ges > platz) { gr = Math.max(11, Math.floor(gr * platz / ges)); messen(); }
  let x = xm - ges / 2;
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  teile.forEach((t, i) => { ctx.fillStyle = t.f; ctx.fillText(t.s, x, y); x += br[i] + luft; });
}
// Zettel „Kurz geschrieben“ (links unten), gleitet herein, wenn alles liegt
function _k6aZettel(ctx) {
  const z = _k6a, K = _k6aK;
  if (!z.gelegt || z.lauf || !(z.zettel > 0)) return;
  const e = _bioFxEase.raus(z.zettel), dy = (1 - e) * 6;   // gleitet von unten herein, bleibt auf dem Tisch
  const n = z.n, je = z.je, F = Math.floor(n / je), r = n % je;
  const x0 = K.ZX0, x1 = K.ZX1, y0 = K.ZY0 + dy, y1 = K.ZY1 + dy, xm = (x0 + x1) / 2;
  ctx.save();
  ctx.globalAlpha = Math.min(1, z.zettel * 1.5);
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, x0 + 1.5, y0 + 2.5, x1 - x0, y1 - y0, 6); ctx.fill();
  ctx.fillStyle = '#fffdf5'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = K.F_GRAU; ctx.font = '700 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Kurz geschrieben', xm, y0 + 15);
  if (z.verdeckt) {                                 // graue Karte mit „?“, gleich gross mit und ohne Rest
    ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, x0 + 14, y0 + 21, x1 - x0 - 28, y1 - y0 - 27, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#475569'; ctx.font = '700 22px sans-serif';
    ctx.fillText('?', xm, y0 + 21 + (y1 - y0 - 27) / 2 + 8);
  } else {
    const T = K.F_TEXT, B = K.F_BLAU, G = K.F_GRUEN, O = K.F_ORANGE;
    const geteilt = [{ s: String(n), f: T }, { s: ':', f: T }, { s: String(je), f: B }, { s: '=', f: T },
                     { s: String(F), f: G }];
    if (r) geteilt.push({ s: 'Rest ' + r, f: O });
    _k6aZeile(ctx, geteilt, xm, y0 + (r ? 44 : 36), 16, x1 - x0 - 12);
    if (!r) _k6aZeile(ctx, [{ s: String(F), f: G }, { s: '·', f: T }, { s: String(je), f: B },
                            { s: '=', f: T }, { s: String(n), f: T }], xm, y0 + 56, 16, x1 - x0 - 12);
  }
  ctx.restore();
}
function _k6aDraw(ctx, cv) {
  if (!_k6a) return;
  const z = _k6a, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _k6aPapier(ctx);
  const wk = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0;
  _k6aSchale(ctx, wk);
  const S = _k6aSzene();
  _bioFxDraw(ctx, z.fx.teile);                      // Lichtring hinter den Plaettchen
  _k6aFeldUnten(ctx, S, z.gelegt ? wk : 0);
  const fw = z.gelegt ? wk : 0, vw = z.gelegt ? 0 : wk;
  // erst die liegenden, dann die Klammer, zuletzt die fliegenden (die liegen oben)
  const zeichne = f => {
    for (const p of S.steine) {
      if (p.flieg !== f) continue;
      const imFeld = p.x > _k6aK.LX0 - 8;
      _k6aStein(ctx, p.x + (imFeld ? fw : vw), p.y, p.r * p.s, p.o, p.a);
    }
  };
  zeichne(false);
  _k6aKlammer(ctx, S, fw);
  zeichne(true);
  _k6aZettel(ctx);
  if (z.pause) _k6aPauseSchild(ctx);
}
// Schild „Pause“ oben links – gleiche Stelle, Groesse und Farbe wie in
// m5-punktefeld, damit die Lehrkraft es ueberall am selben Ort findet.
// Leuchtet kurz auf, wenn waehrend der Pause ein Knopf gedrueckt wird.
function _k6aPauseSchild(ctx) {
  const z = _k6a, w = 64, h = 25, x = 8, y = 8;     // endet ueber der Schale (y = 36)
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
