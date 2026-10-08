
// ════════════════════════════════════════════════════════════════════════
// MATHEMATIK 5 FOERDER – mm3 „Wie rechnet man 23 · 4?“
// (Kennung m5-malkreuz, Praefix _m5t)
// Bauplan: arbeitsheft_mathe_foe5/KAPITEL4_PROFIL.md, Abschnitt m5-malkreuz.
// Ueberschrift = Frage der Einheit: „Was ergibt 23 · 4 wirklich?“
//
// Was man sieht – zwei Darstellungen, durch die FARBE verbunden (Zehner blau,
// Einer orange, in Bild, Malkreuz, Kurzform und Statuszeilen gleich):
//   PUNKTEFELD (oben), Titel „4 Reihen zu je 23“: vier Reihen. In jeder Reihe
//     liegen die Zehner auf hellblauen Zehnerstreifen (je 10 Punkte, nach dem
//     5. Punkt eine kleine Luecke), die Einer als orange Punkte. Zerlegt trennt
//     ein gestrichelter Schnitt Zehner- und Einerteil, beide ruecken etwas
//     auseinander. Der Schnitt steht in allen drei Aufgaben an DERSELBEN
//     Stelle: Die Einer (immer 3 Punkte je Reihe) bleiben rechts liegen, die
//     Zehnerstreifen wachsen nach links (1, 2, 3 Streifen je Reihe). So sieht
//     man die Musterserie 13 · 4 / 23 · 4 / 33 · 4 schon am Bild.
//   MALKREUZ (unten links) mit der Ueberschrift „Malkreuz“: Kopfzeile
//     „· | 20 | 3“, Zeile „4 | 80 | 12“ – die Zelle des Zehnerteils blau, die
//     des Einerteils orange. Ein dicker Strich trennt Kopfzeile und erste
//     Spalte ab (das „Kreuz“).
//   Darunter nach „zusammenzählen“ die Rechnung „80 + 12 = 92“ – 80 blau genau
//     unter seiner Zelle, 12 orange unter seiner, „+“ unter dem Strich
//     dazwischen, „= 92“ rechts daneben. Nach „nebeneinander schreiben“ steht
//     eine Zeile tiefer „812“ (8 blau, 12 orange) unter dem Strich zwischen den
//     Zellen, klein daneben „nebeneinander“.
//   KURZFORM (unten rechts, nur nach „schriftlich zeigen“): ein Stueck
//     Karopapier mit „23 · 4“ in der Schreibweise des Hefts (build_pilot.py,
//     _malgeteilt_zeichnen): Spalte 0 frei, die Ziffern von 23, „·“, „4“; ein
//     Strich darunter; Zeile 1 fuer die kleine gemerkte Ziffer, Zeile 2 das
//     Ergebnis, rechtsbuendig unter der 4.
//
// Knoepfe (Bauplan, woertlich):
//   Sprungmarken = Zeilen der Heft-Tabelle (_m5tAufgabe('13') usw.):
//     „13 · 4“ · „23 · 4“ · „33 · 4“ – bauen das Feld Reihe fuer Reihe auf
//     (0,12 s Versatz, je 0,3 s), dann faellt der Schnitt (0,25 s), die Teile
//     ruecken auseinander, und die Zellen des Malkreuzes fuellen sich
//     nacheinander: Kopfzeile, dann 80 (der Zehnerteil leuchtet blau auf),
//     dann 12 (der Einerteil leuchtet orange auf). Fertig nach 1,45 s.
//   „zusammenzählen“ (_m5tZusammen()): Schnitt verblasst, die Teile gleiten
//     wieder zusammen (0,55 s); aus den Zellen fallen 80 und 12 senkrecht unter
//     das Malkreuz, „+“ erscheint, dann „= 92“ (federnd); das ganze Feld
//     leuchtet kurz. Fertig nach 0,85 s. Ein zweites Druecken laesst nur die 92
//     wackeln.
//   „schriftlich zeigen“ (_m5tSchriftlich()): neben dem Malkreuz erscheint die
//     Kurzform „23 · 4“ (0,3 s). EINER: „3“ und „4“ werden gelb hinterlegt,
//     die 12 fliegt aus der Zelle des Einerteils ins Ergebnis (bis 0,9 s) und
//     ZERFAELLT sichtbar: Die „1“ steigt klein in die Merkzeile ueber der
//     Zehnerspalte und wird dabei blau (sie ist jetzt 1 Zehner), die „2“ bleibt
//     orange im Einerkaestchen (bis 1,25 s). ZEHNER: „2“ und „4“ hinterlegt,
//     eine blasse „8“ erscheint im Zehnerkaestchen, die gemerkte „1“ gleitet
//     hinein, daraus wird federnd „9“ (bis 1,72 s). Fertig nach 1,8 s.
//     Die gemerkte 1 bleibt klein stehen wie im Heft.
//   „nebeneinander schreiben“ (_m5tNeben()): Gegenprobe zur Rechnung aus dem
//     Problem des Hefts. Aus der Zelle 80 faellt eine Kopie und SCHRUMPFT im
//     Fall auf „8“ (die 0 verblasst), aus der Zelle 12 faellt „12“; beide
//     ruecken unter dem Malkreuz aneinander: „812“. Dann leuchtet das ganze
//     Feld – dort liegen weiter 92 Punkte. Fertig nach 1,25 s. Steht die
//     Rechnung „80 + 12 = 92“ schon da, tritt sie waehrend des Fallens kurz
//     auf 30 % zurueck, damit sich die Zahlen nicht uebereinander lesen.
//     (Der Bauplan nennt den Knopf „Tareks Weg“. Eine Simulation traegt keine
//     Figurennamen – MATHE_PROFIL § 10 Regel 11, und der Bauplan selbst sagt
//     unter „Die sechs Simulationen – Allgemein“: „keine Namen“. Kapitel 2 hat
//     denselben Knopf in m5-rechenstrich ebenso nach der Handlung benannt:
//     „nebeneinander schreiben“. Kein Heftschritt von mm3 nennt den Knopf.
//     Wer den Namen doch will: _m5tKNOPF_NEBEN und _m5tNebenZeile aendern.)
//   „neu“ (_m5tNeu()): wieder der Start 13 · 4, zerlegt (blendet in 0,35 s ein).
// Wer waehrend einer Bewegung einen Knopf drueckt, laesst die laufende
// Bewegung sofort ankommen; dann geschieht das Neue. Eine Sprungmarke bricht
// alles ab und baut neu auf. Jede Knopffolge endet so in denselben Zahlen.
//
// Statuszeilen (woertlich; jede, deren Wert das Heft verlangt, hat mehr als
// 18 Zeichen, sonst fehlt sie im Faktendump). Sie folgen dem Bild: Eine Zahl
// steht erst in der Anzeige, wenn sie im Bild angekommen ist.
//   _m5t-aufgabe     „Malaufgabe: 23 · 4 (4 Reihen zu je 23)“
//   _m5t-teile       „Teile im Malkreuz: 80 und 12“ (waehrend des Aufbaus
//                    „Teile im Malkreuz: …“)
//   _m5t-ergebnis    „Ergebnis der Aufgabe: …“, nach „zusammenzählen“
//                    „Ergebnis der Aufgabe: 92“
//   _m5t-punkte      „Punkte im ganzen Feld: …“, nach „zusammenzählen“ oder
//                    „nebeneinander schreiben“ „Punkte im ganzen Feld: 92“
//   _m5t-schriftlich (nur nach „schriftlich zeigen“, sonst leer und versteckt)
//                    erst „Einer: 3 · 4 = …“, dann
//                    „Einer: 3 · 4 = 12, schreibe 2, merke 1“, am Ende
//                    „Zehner: 2 · 4 = 8, 8 + 1 = 9, schreibe 9“
//   _m5t-tarek       (nur nach „nebeneinander schreiben“, sonst leer und
//                    versteckt) „8 und 12 nebeneinander geschrieben: 812“
//                    (Bauplan: „Tareks Weg: 8 und 12 nebeneinander: 812“ –
//                    ohne den Namen, siehe oben; die Kennung bleibt.)
//   _m5t-lehrkraft   Hinweis fuer die Lehrkraft (siehe unten)
//
// Werte (jede Zahl aus _m5tWerte(), nachgerechnet mit simcheck/werte.js):
//   13 · 4 → Kopf 10 | 3 → Teile 40 und 12 → 52 ·
//            „Einer: 3 · 4 = 12, schreibe 2, merke 1“ /
//            „Zehner: 1 · 4 = 4, 4 + 1 = 5, schreibe 5“ · nebeneinander 412
//   23 · 4 → Kopf 20 | 3 → Teile 80 und 12 → 92 ·
//            „Einer: 3 · 4 = 12, schreibe 2, merke 1“ /
//            „Zehner: 2 · 4 = 8, 8 + 1 = 9, schreibe 9“ · nebeneinander 812
//   33 · 4 → Kopf 30 | 3 → Teile 120 und 12 → 132 ·
//            „Einer: 3 · 4 = 12, schreibe 2, merke 1“ /
//            „Zehner: 3 · 4 = 12, 12 + 1 = 13, schreibe 13“ · nebeneinander 1 212
//   (Tausendertrenner U+00A0. Bei 33 · 4 wird die 13 als Ganzes geschrieben,
//   wie der Bauplan es sagt – keine zweite Merkziffer.)
// Start: 13 · 4, zerlegt, Teile sichtbar, noch nicht zusammengezaehlt.
//
// Aha (_bioFxWelle, ruhig, OHNE Textstreifen): bei „23 · 4“, wenn der Schnitt
// gefallen ist – ein blauer Lichtring breitet sich ueber den 8 Zehnerstreifen
// aus, und ein pulsierender Rahmen liegt 2,6 s um sie (das sind 80, nicht 8).
// Das widerlegt „812“ und „20“: Die 2 in 23 sind 2 Streifen je Reihe. Bei
// jedem Druck auf „23 · 4“.
//
// FUER DIE LEHRKRAFT (Bauart wie m5-plus-schriftlich / m5-minus-schriftlich,
// in <div class="fpm-lehrkraft">, damit simfakten.js die Zeile ueberspringen
// kann – Bauplan V3). Eigene Zeile UNTER den Heftknoepfen, davor klein
// „Für die Lehrkraft:“, Reihenfolge wie im Bauplan:
//   „Pause“ ↔ „weiter“ (_m5tAnhalten()): friert JEDE Bewegung sofort ein;
//     „weiter“ macht genau dort weiter. Schild „Pause“ oben links im Bild
//     (Stelle und Aussehen wie in m5-plus-schriftlich).
//   „Tempo: normal“ ↔ „Tempo: langsam“ (_m5tTempo()): ein Drittel so schnell.
//   „Halt beim Merken: aus“ ↔ „… an“ (_m5tHaltSchalter()): haelt bei
//     „schriftlich zeigen“ von selbst an, sobald die 12 im Ergebnis liegt und
//     BEVOR sie zerfaellt. Die 12 ist bernsteinfarben eingerahmt, unten rechts
//     steht das Schild „12 Einer = 1 Zehner und 2 Einer“ (zweizeilig, nach dem
//     „=“ umbrochen); dann ist Pause.
//   Nur das wechselnde Wort steht in einem eigenen <span> (_m5t-tempo-an,
//   _m5t-halt-an), wie in den Bausaetzen von Kapitel 2.
// Hinweiszeile _m5t-lehrkraft (in der Pause „lmp-status off“, sonst „on“):
//   sonst  „Für die Lehrkraft: „Pause“ hält alles an. „Halt beim Merken“ stoppt von selbst.“
//   Pause  „Angehalten. Erkläre, was gerade passiert. Dann „weiter“.“
//   Halt   „Halt: 12 Einer sind 1 Zehner und 2 Einer. Die 1 wird gemerkt.“
// So ist es gebaut:
//   * EIN Zeitfaktor (_m5tZeitfaktor: 0 in der Pause, 1/3 langsam, 1 normal)
//     an der einen Stelle, an der dt in _m5tUpdate hineingeht. Ohne Zeit kein
//     Schritt im Ablauf (`dt > 0`). Voreinstellung: Faktor 1, alles wie ohne.
//   * Der Halt ist ein EREIGNIS im Ablauf (Zeitpunkt K_HALT von
//     „schriftlich zeigen“ wird ueberschritten), keine Zeitmessung.
//   * Waehrend der Pause bewegt KEIN Knopf etwas: Steht eine Bewegung, entfaellt
//     der Druck (er liesse sie sofort ankommen und uebersprange genau das, was
//     man zeigen will). Steht keine, wird er VORGEMERKT und beginnt mit
//     „weiter“. Das Schild „Pause“ leuchtet dabei kurz auf (in echter Zeit).
//     Eine Sprungmarke und „neu“ heben die Pause auf; „Tempo“ und „Halt“
//     bleiben stehen (die Lehrkraft stellt sie einmal fuer die Stunde ein).
//
// Nicht am Bildschirm (sim_plan.nicht_am_bildschirm): „Summe“ – und keine
// Regel als Satz (kein „die Teile werden addiert“). „Malkreuz“ und „merke“
// sind erlaubt. Keine Namen, keine Punkte als Belohnung, keine Zeit, kein
// „falsch“. Deterministisch, ohne Zufall: jede Zahl im Bild und in den
// Statuszeilen kommt aus _m5tWerte().
// ════════════════════════════════════════════════════════════════════════
let _m5t = null;
const _m5tAUFGABEN = { '13': 13, '23': 23, '33': 33 };
const _m5tREIHE = ['13', '23', '33'];
const _m5tSTART = '13';
const _m5tM = 4;                                   // zweiter Faktor = Zahl der Reihen
const _m5tKNOPF_NEBEN = 'nebeneinander schreiben';
const _m5tK = {
  // Punktefeld
  CUT: 318, NAH: 4, SPREIZ: 9,                     // Schnitt; halber Abstand zusammen / zusaetzlich zerlegt
  ST_W: 70, ST_H: 12, ST_GAP: 5,                   // Zehnerstreifen
  P_RAND: 4.2, P_PITCH: 6.2, P_FUENF: 3.2, P_R: 2.3,
  E_R: 3.6, E_PITCH: 9.2,                          // Einerpunkte
  RY0: 26, RP: 17, TITEL_Y: 17, CUT_Y0: 21, CUT_Y1: 94,
  // Malkreuz: Spalten- und Zeilenkanten
  MX: [14, 46, 110, 160], MY: [120, 152, 184], M_TITEL_Y: 113,
  GL_Y: 214, NB_Y: 241,                            // Grundlinie Rechnung / nebeneinander
  // Kurzform (Karo wie im Heft: Spalte 0 frei, dann Ziffern, „·“, Faktor)
  KX: 248, KY: 112, KB: 26,
  // Schild beim Halt
  SX0: 244, SX1: 414, SY0: 206, SY1: 246,
  // Zeiten in s – Aufbau einer Sprungmarke
  A_ROW0: 0.05, A_ROW_STEP: 0.12, A_ROW: 0.3, A_CUT0: 0.75, A_CUT: 0.25,
  A_SP0: 0.9, A_SP: 0.2, A_AHA: 1.0, A_KOPF0: 1.0, A_ZZ0: 1.1, A_ZE0: 1.25,
  A_ZELLE: 0.18, A_END: 1.45,
  // zusammenzählen
  Z_GLEIT: 0.55, Z_FLUG0: 0.1, Z_FLUG1: 0.55, Z_ERG0: 0.55, Z_END: 0.85,
  // schriftlich zeigen
  K_SCHREIB: 0.3, K_FLUG0: 0.45, K_HALT: 0.9, K_TEIL1: 1.25, K_Z0: 1.35, K_Z1: 1.5,
  K_MERK1: 1.72, K_END: 1.8,
  // nebeneinander schreiben
  T_FLUG: 0.6, T_RUECK: 0.9, T_END: 1.25,
  // Farben
  Z: { streif: '#dbeafe', rand: '#3b82f6', punkt: '#1d4ed8', text: '#1d4ed8', zelle: '#dbeafe' },
  E: { punkt: '#fb923c', rand: '#c2410c', text: '#c2410c', zelle: '#ffedd5' },
  F_DUNKEL: '#1f2937', F_GRAU: '#64748b', F_TITEL: '#334155', F_KARO: '#d4e3f1',
  F_LINIE: '#94a3b8', F_KREUZ: '#334155'
};

// 1234 -> "1 234" mit geschuetztem Leerzeichen
function _m5tFmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
// ALLE Zahlen einer Aufgabe n · 4 aus EINER Rechnung.
function _m5tWerte(n) {
  const m = _m5tM, k = Math.floor(n / 10), e = n % 10;
  const eP = e * m, merk = Math.floor(eP / 10), eZiffer = eP % 10;
  const zP = k * m, zF = zP + merk;
  return {
    n, k, e, kopfZ: k * 10, teilZ: k * 10 * m, teilE: eP, erg: n * m,
    eP, merk, eZiffer, zP, zF,
    neben: Number(String(zP) + String(eP))          // die Zehnerziffer mal 4, daneben der Einer-Teil
  };
}

function _m5tInit() {
  _m5t = { t: 0, fx: [], haltAn: false, langsam: false, stand: '' };   // Lehrkraft-Einstellungen
  _m5tLaden(_m5tSTART, false);
  _m5t.einblend = 1;
}
// Eine Aufgabe laden. aufbauen = true: das Feld baut sich auf (Sprungmarke);
// false: sofort der fertige, zerlegte Zustand (Start, „neu“).
function _m5tLaden(key, aufbauen) {
  const z = _m5t;
  z.key = key; z.n = _m5tAUFGABEN[key]; z.w = _m5tWerte(z.n);
  z.gebaut = !aufbauen; z.zus = false; z.kurz = false; z.neben = false;
  z.job = aufbauen ? { art: 'aufbau', t: 0, angehalten: false } : null;
  z.einblend = aufbauen ? 1 : 0;
  z.aha = false; z.ahaGlanz = 0; z.glanz = 0; z.leuchtZ = 0; z.leuchtE = 0; z.wackel = 0;
  z.fx.length = 0;
  z.pause = false; z.halt = false; z.blink = 0; z.vormerken = null;   // neu laden hebt die Pause auf
}
function _m5tHTML() {
  const marke = k => `<button class="sim-btn" id="_m5t-b-${k}" onclick="_m5tAufgabe('${k}')">${k}&nbsp;·&nbsp;${_m5tM}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Was ergibt 23&nbsp;·&nbsp;4 wirklich?</h3>
    <div class="fpm-note" style="margin-top:2px">Jeder blaue Streifen hat 10 Punkte. „zusammenzählen“ legt die Teile wieder zusammen.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5t-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5tREIHE.map(marke).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_m5t-zus" onclick="_m5tZusammen()">zusammenzählen</button>
          <button class="sim-btn" id="_m5t-kurz" onclick="_m5tSchriftlich()">schriftlich zeigen</button>
          <button class="sim-btn" id="_m5t-neben" onclick="_m5tNeben()">${_m5tKNOPF_NEBEN}</button>
          <button class="sim-btn" onclick="_m5tNeu()">neu</button>
        </div>
        <div class="fpm-lehrkraft">
          <div class="sim-btn-row" style="margin-top:8px;align-items:center;border-top:1px dashed #cbd5e1;padding-top:8px">
            <span style="font-size:.72rem;font-weight:700;color:#64748b">Für die Lehrkraft:</span>
            <button class="sim-btn" id="_m5t-pause" onclick="_m5tAnhalten()">Pause</button>
            <button class="sim-btn" id="_m5t-tempo" onclick="_m5tTempo()">Tempo: <span id="_m5t-tempo-an">normal</span></button>
            <button class="sim-btn" id="_m5t-halt" onclick="_m5tHaltSchalter()">Halt beim Merken: <span id="_m5t-halt-an">aus</span></button>
          </div>
          <div class="lmp-status on" id="_m5t-lehrkraft" style="margin-top:4px"></div>
        </div>
      </div>
      <div>
        <div class="fpm-label">Anzeige</div>
        <div class="lmp-status on" id="_m5t-aufgabe" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5t-teile" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5t-ergebnis" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5t-punkte" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_m5t-schriftlich" style="margin-top:6px;display:none"></div>
        <div class="lmp-status on" id="_m5t-tarek" style="margin-top:6px;display:none"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: 13&nbsp;·&nbsp;4, zerlegt</p>
  </div>`;
}
function _m5tSetze(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
  return e;
}
// Zeile setzen und nur zeigen, wenn sie etwas sagt.
function _m5tZeige(id, html) {
  const e = _m5tSetze(id, html);
  if (e && e.style) e.style.display = html ? '' : 'none';
}
// Was die Anzeige gerade sagen darf – sie folgt dem Bild, nicht dem Knopf.
function _m5tLage(z) {
  const K = _m5tK, J = z.job, a = J ? J.art : '', t = J ? J.t : 0;
  let kurz = 0;                                     // 0 nichts · 1 Einer laeuft · 2 Einer fertig · 3 Zehner fertig
  if (z.kurz) kurz = 3;
  else if (a === 'kurz') kurz = t >= K.K_MERK1 ? 3 : t >= K.K_TEIL1 ? 2 : 1;
  return {
    teile: z.gebaut || (a === 'aufbau' && t >= K.A_ZE0 + K.A_ZELLE),
    zus: z.zus || (a === 'zus' && t >= K.Z_ERG0 + 0.1),
    neben: z.neben || (a === 'neben' && t >= K.T_RUECK),
    kurz
  };
}
function _m5tStand(z) {
  const L = _m5tLage(z);
  return [z.key, L.teile, L.zus, L.neben, L.kurz, z.pause, z.halt, z.haltAn, z.langsam,
          z.job ? z.job.art : ''].join('|');
}
function _m5tNebenZeile(w) {
  return w.zP + ' und ' + w.teilE + ' nebeneinander geschrieben: ' + _m5tFmt(w.neben);
}
function _m5tStatus() {
  if (!_m5t) return;
  const z = _m5t, K = _m5tK, w = z.w, L = _m5tLage(z);
  const blau = s => '<b style="color:' + K.Z.text + '">' + s + '</b>';
  const orange = s => '<b style="color:' + K.E.text + '">' + s + '</b>';
  _m5tSetze('_m5t-aufgabe', 'Malaufgabe: ' + w.n + ' · ' + _m5tM + ' (' + _m5tM + ' Reihen zu je ' + w.n + ')');
  _m5tSetze('_m5t-teile', 'Teile im Malkreuz: ' +
            (L.teile ? blau(_m5tFmt(w.teilZ)) + ' und ' + orange(_m5tFmt(w.teilE)) : '…'));
  _m5tSetze('_m5t-ergebnis', 'Ergebnis der Aufgabe: ' + (L.zus ? _m5tFmt(w.erg) : '…'));
  _m5tSetze('_m5t-punkte', 'Punkte im ganzen Feld: ' + (L.zus || L.neben ? _m5tFmt(w.erg) : '…'));
  const einer = 'Einer: ' + w.e + ' · ' + _m5tM + ' = ';
  const sz = L.kurz === 0 ? ''
    : L.kurz === 1 ? einer + '…'
    : L.kurz === 2 ? einer + w.eP + ', schreibe ' + w.eZiffer + ', merke ' + w.merk
    : 'Zehner: ' + w.k + ' · ' + _m5tM + ' = ' + w.zP + ', ' + w.zP + ' + ' + w.merk + ' = ' + w.zF +
      ', schreibe ' + w.zF;
  _m5tZeige('_m5t-schriftlich', sz);
  _m5tZeige('_m5t-tarek', L.neben ? _m5tNebenZeile(w) : '');
  _m5tREIHE.forEach(k => {
    const b = document.getElementById('_m5t-b-' + k);
    if (b && b.classList) b.classList.toggle('primary', k === z.key);
  });
  const bz = document.getElementById('_m5t-zus');
  if (bz) {
    bz.disabled = L.zus;
    if (bz.style) bz.style.opacity = L.zus ? '0.45' : '';
  }
  // Fuer die Lehrkraft: Aufschriften, Hinweiszeile (in der Pause bernsteinfarben)
  _m5tSetze('_m5t-pause', z.pause ? 'weiter' : 'Pause');
  _m5tSetze('_m5t-tempo-an', z.langsam ? 'langsam' : 'normal');
  _m5tSetze('_m5t-halt-an', z.haltAn ? 'an' : 'aus');
  const hz = _m5tSetze('_m5t-lehrkraft', _m5tHinweis());
  if (hz) hz.className = 'lmp-status ' + (z.pause ? 'off' : 'on');
  for (const [id, an] of [['_m5t-pause', z.pause], ['_m5t-halt', z.haltAn], ['_m5t-tempo', z.langsam]]) {
    try { document.getElementById(id).classList.toggle('primary', an); } catch (e) { /* Mini-DOM */ }
  }
  z.stand = _m5tStand(z);
}
function _m5tHinweis() {
  const z = _m5t, w = z.w;
  if (z.halt) return 'Halt: ' + w.eP + ' Einer sind ' + w.merk + ' Zehner und ' + w.eZiffer +
                     ' Einer. Die ' + w.merk + ' wird gemerkt.';
  if (z.pause) return 'Angehalten. Erkläre, was gerade passiert. Dann „weiter“.';
  return 'Für die Lehrkraft: „Pause“ hält alles an. „Halt beim Merken“ stoppt von selbst.';
}

// ── Bedienung ───────────────────────────────────────────────────────────
function _m5tAufgabe(key) {
  if (!_m5t || !_m5tAUFGABEN[key]) return;
  _m5tLaden(key, true);
  _m5tStatus();
}
function _m5tNeu() {
  if (!_m5t) return;
  _m5tLaden(_m5tSTART, false);
  _m5tStatus();
}
function _m5tZusammen() { _m5tTat('zus'); }
function _m5tSchriftlich() { _m5tTat('kurz'); }
function _m5tNeben() { _m5tTat('neben'); }
function _m5tTat(art) {
  if (!_m5t) return;
  const z = _m5t;
  if (z.pause) {                                   // in der Pause: vormerken oder entfallen (siehe Kopf)
    z.blink = 0.6;
    if (!z.job) z.vormerken = art;
    _m5tStatus();
    return;
  }
  if (z.job) _m5tAbschluss();                      // laufende Bewegung sofort ankommen lassen
  _m5tLos(art);
  _m5tStatus();
}
function _m5tLos(art) {
  const z = _m5t;
  if (art === 'zus' && z.zus) { z.wackel = 0.45; return; }
  if (art === 'zus') z.zus = false;
  if (art === 'kurz') z.kurz = false;
  if (art === 'neben') z.neben = false;
  z.job = { art, t: 0, angehalten: false };
}
// Die laufende Bewegung ist am Ziel (oder wird sofort dorthin gesetzt).
function _m5tAbschluss() {
  const z = _m5t, J = z.job;
  if (!J) return;
  if (J.art === 'aufbau') z.gebaut = true;
  else if (J.art === 'zus') z.zus = true;
  else if (J.art === 'kurz') z.kurz = true;
  else if (J.art === 'neben') z.neben = true;
  z.job = null;
  _m5tStatus();
}
// ── Fuer die Lehrkraft ──────────────────────────────────────────────────
function _m5tAnhalten() {
  if (!_m5t) return;
  const z = _m5t;
  if (z.pause) {
    z.pause = false; z.halt = false; z.blink = 0;
    const v = z.vormerken;
    z.vormerken = null;
    if (v && !z.job) _m5tLos(v);
  } else z.pause = true;
  _m5tStatus();
}
function _m5tTempo() {
  if (!_m5t) return;
  _m5t.langsam = !_m5t.langsam;
  _m5tStatus();
}
function _m5tHaltSchalter() {
  if (!_m5t) return;
  _m5t.haltAn = !_m5t.haltAn;
  _m5tStatus();
}
// DER Zeitfaktor: 0 in der Pause, ein Drittel bei „Tempo: langsam“, sonst 1.
function _m5tZeitfaktor(z) { return z.pause ? 0 : z.langsam ? 1 / 3 : 1; }

// ── Lage im Bild ────────────────────────────────────────────────────────
// Kanten des Zehner- und Einerteils bei Spreizung s (0 zusammen, 1 zerlegt).
function _m5tGeo(z, s) {
  const K = _m5tK, w = z.w;
  const halb = K.NAH + K.SPREIZ * s;
  const breitZ = w.k * K.ST_W + (w.k - 1) * K.ST_GAP;
  const breitE = w.e ? (w.e - 1) * K.E_PITCH + 2 * K.E_R + 1 + (w.e > 5 ? 3 : 0) : 0;
  const zr = K.CUT - halb, el = K.CUT + halb;
  return { zl: zr - breitZ, zr, el, er: el + breitE,
           y0: K.RY0, y1: K.RY0 + (_m5tM - 1) * K.RP + K.ST_H };
}
// Mitte einer Zelle im Malkreuz (Spalte c, Zeile r).
function _m5tMitte(c, r) {
  const X = _m5tK.MX, Y = _m5tK.MY;
  return [(X[c] + X[c + 1]) / 2, (Y[r] + Y[r + 1]) / 2];
}

// ── Bewegung ────────────────────────────────────────────────────────────
function _m5tUpdate(dt) {
  if (!_m5t) return;
  const z = _m5t, K = _m5tK;
  const roh = _bioFxDt(dt);
  z.blink = Math.max(0, z.blink - roh);            // Schild „Pause“ leuchtet in echter Zeit
  dt = roh * _m5tZeitfaktor(z);                    // ab hier Sim-Zeit: 0 Pause, 1/3 langsam, 1 normal
  z.t += dt;
  z.einblend = Math.min(1, z.einblend + dt / 0.35);
  z.ahaGlanz = Math.max(0, z.ahaGlanz - dt);
  z.glanz = Math.max(0, z.glanz - dt);
  z.leuchtZ = Math.max(0, z.leuchtZ - dt);
  z.leuchtE = Math.max(0, z.leuchtE - dt);
  z.wackel = Math.max(0, z.wackel - dt);
  const J = z.job;
  if (J && dt > 0) {                               // ohne Zeit kein Schritt im Ablauf
    const vor = J.t;
    J.t += dt;
    const ueber = s => vor < s && J.t >= s;
    if (J.art === 'aufbau') {
      if (ueber(K.A_ZZ0)) z.leuchtZ = 0.7;
      if (ueber(K.A_ZE0)) z.leuchtE = 0.7;
      if (ueber(K.A_AHA) && z.key === '23' && !z.aha) {
        // Aha: der Schnitt ist gefallen – um die 8 Zehnerstreifen laeuft ein Lichtring
        z.aha = true; z.ahaGlanz = 2.6;
        const g = _m5tGeo(z, 0.5);
        _bioFxWelle(z.fx, (g.zl + g.zr) / 2, (g.y0 + g.y1) / 2, '#60a5fa', 75);
      }
      if (J.t >= K.A_END) _m5tAbschluss();
    } else if (J.art === 'zus') {
      if (ueber(K.Z_ERG0)) z.glanz = 1.4;
      if (J.t >= K.Z_END) _m5tAbschluss();
    } else if (J.art === 'kurz') {
      if (z.haltAn && !J.angehalten && ueber(K.K_HALT)) {
        // HALT beim Merken: die 12 liegt im Ergebnis, noch nicht zerfallen
        J.t = K.K_HALT; J.angehalten = true;
        z.pause = true; z.halt = true;
      } else if (J.t >= K.K_END) _m5tAbschluss();
    } else if (J.art === 'neben') {
      if (ueber(K.T_RUECK)) z.glanz = 1.4;
      if (J.t >= K.T_END) _m5tAbschluss();
    }
  }
  _bioFxUpdate(z.fx, dt);
  if (_m5tStand(z) !== z.stand) _m5tStatus();
}

// ── Zeichnen ────────────────────────────────────────────────────────────
function _m5tMisch(h1, h2, u) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const a = p(h1), b = p(h2);
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * u)).join(',') + ')';
}
function _m5tText(ctx, s, x, y, groesse, farbe, ausr, gew) {
  ctx.fillStyle = farbe || _m5tK.F_DUNKEL;
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
// Zahl um ihre Mitte (x, ym), mit Deckkraft a und Federn (pop: s seit Erscheinen).
function _m5tZahl(ctx, s, x, ym, groesse, farbe, a, pop) {
  if (!(a > 0.01)) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  const k = pop !== undefined && pop >= 0 && pop < 0.35 ? Math.max(0.3, _bioFxEase.federn(pop / 0.35)) : 1;
  ctx.translate(x, ym);
  ctx.scale(k, k);
  _m5tText(ctx, s, 0, groesse * 0.36, groesse, farbe);
  ctx.restore();
}
function _m5tBreite(ctx, s, groesse, gew) {
  ctx.font = (gew || '700') + ' ' + groesse + 'px sans-serif';
  return ctx.measureText(s).width;
}
// Was gerade wie weit zu sehen ist – alles aus der Zeit des laufenden Ablaufs.
function _m5tSicht(z) {
  const K = _m5tK, kl = _bioFxKlemme, E = _bioFxEase.sanft;
  const J = z.job, art = J ? J.art : '', t = J ? J.t : 0, auf = art === 'aufbau';
  const S = {};
  S.reihe = [];
  for (let r = 0; r < _m5tM; r++)
    S.reihe.push(auf ? E(kl((t - K.A_ROW0 - r * K.A_ROW_STEP) / K.A_ROW)) : 1);
  if (auf) {
    S.schnitt = kl((t - K.A_CUT0) / K.A_CUT); S.schnittA = 1;
    S.spreiz = E(kl((t - K.A_SP0) / K.A_SP));
  } else if (art === 'zus') {
    const u = E(kl(t / K.Z_GLEIT));
    S.schnitt = 1; S.schnittA = 1 - u; S.spreiz = 1 - u;
  } else if (z.zus) {
    S.schnitt = 0; S.schnittA = 0; S.spreiz = 0;
  } else {
    S.schnitt = 1; S.schnittA = 1; S.spreiz = 1;
  }
  S.kopf = auf ? kl((t - K.A_KOPF0) / 0.15) : 1;
  S.zz = auf ? kl((t - K.A_ZZ0) / K.A_ZELLE) : 1;
  S.ze = auf ? kl((t - K.A_ZE0) / K.A_ZELLE) : 1;
  S.popKopf = auf ? t - K.A_KOPF0 : 9;
  S.popZZ = auf ? t - K.A_ZZ0 : 9;
  S.popZE = auf ? t - K.A_ZE0 : 9;
  S.tZus = z.zus ? 99 : art === 'zus' ? t : null;
  S.tKurz = z.kurz ? 99 : art === 'kurz' ? t : null;
  S.tNeben = z.neben ? 99 : art === 'neben' ? t : null;
  return S;
}
function _m5tStreifen(ctx, x, y) {
  const K = _m5tK, F = K.Z;
  ctx.fillStyle = F.streif; ctx.strokeStyle = F.rand; ctx.lineWidth = 1.1;
  _bioFxRundRect(ctx, x, y, K.ST_W, K.ST_H, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = F.punkt;
  for (let i = 0; i < 10; i++) {
    const cx = x + K.P_RAND + K.P_R + i * K.P_PITCH + (i >= 5 ? K.P_FUENF : 0);
    ctx.beginPath(); ctx.arc(cx, y + K.ST_H / 2, K.P_R, 0, Math.PI * 2); ctx.fill();
  }
}
// Ein ruhig leuchtender Rahmen um einen Teil des Feldes.
function _m5tRahmen(ctx, x0, y0, x1, y1, fuell, rand, a, breite) {
  if (a <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.fillStyle = fuell; ctx.strokeStyle = rand; ctx.lineWidth = breite || 2.5;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function _m5tFeld(ctx, z, S) {
  const K = _m5tK, w = z.w, g = _m5tGeo(z, S.spreiz), g1 = _m5tGeo(z, 1);
  // Titel ueber dem Feld, buendig mit dem zerlegten Feld (steht still, waehrend es gleitet)
  ctx.save(); ctx.globalAlpha *= S.reihe[0];
  _m5tText(ctx, _m5tM + ' Reihen zu je ' + w.n, g1.zl, K.TITEL_Y, 13, K.F_TITEL, 'left');
  ctx.restore();
  // Leuchten hinter den Teilen: beim Fuellen der Zellen, beim Aha, am Ende
  const puls = 0.6 + 0.4 * Math.sin(z.t * 5);
  _m5tRahmen(ctx, g.zl - 5, g.y0 - 4, g.zr + 5, g.y1 + 4, 'rgba(59,130,246,0.14)', K.Z.rand, z.leuchtZ / 0.7);
  _m5tRahmen(ctx, g.el - 5, g.y0 - 4, g.er + 5, g.y1 + 4, 'rgba(251,146,60,0.16)', K.E.rand, z.leuchtE / 0.7);
  if (z.ahaGlanz > 0)
    _m5tRahmen(ctx, g.zl - 5, g.y0 - 4, g.zr + 5, g.y1 + 4, 'rgba(96,165,250,0.18)', '#60a5fa',
               Math.min(1, z.ahaGlanz / 0.8) * puls, 3);
  if (z.glanz > 0)
    _m5tRahmen(ctx, g.zl - 7, g.y0 - 5, g.er + 7, g.y1 + 5, 'rgba(253,230,138,0.22)', '#f59e0b',
               Math.min(1, z.glanz / 0.6) * puls, 3);
  // Reihen
  for (let r = 0; r < _m5tM; r++) {
    const a = S.reihe[r];
    if (a <= 0.01) continue;
    const dx = -(1 - a) * 26, y = K.RY0 + r * K.RP;
    ctx.save(); ctx.globalAlpha *= a;
    for (let j = 0; j < w.k; j++) _m5tStreifen(ctx, g.zl + j * (K.ST_W + K.ST_GAP) + dx, y);
    ctx.fillStyle = K.E.punkt; ctx.strokeStyle = K.E.rand; ctx.lineWidth = 1;
    for (let i = 0; i < w.e; i++) {
      const cx = g.el + K.E_R + 0.5 + i * K.E_PITCH + (i >= 5 ? 3 : 0) + dx;
      ctx.beginPath(); ctx.arc(cx, y + K.ST_H / 2, K.E_R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }
  // Schnitt: faellt von oben nach unten, verblasst beim Zusammenzaehlen
  if (S.schnittA > 0.01 && S.schnitt > 0) {
    ctx.save();
    ctx.globalAlpha *= S.schnittA;
    ctx.strokeStyle = K.F_GRAU; ctx.lineWidth = 1.8;
    if (ctx.setLineDash) ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(K.CUT, K.CUT_Y0);
    ctx.lineTo(K.CUT, K.CUT_Y0 + (K.CUT_Y1 - K.CUT_Y0) * S.schnitt); ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
    ctx.restore();
  }
}
function _m5tKreuz(ctx, z, S) {
  const K = _m5tK, X = K.MX, Y = K.MY, w = z.w;
  _m5tText(ctx, 'Malkreuz', X[0], K.M_TITEL_Y, 13, K.F_TITEL, 'left');
  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,0.07)';
  _bioFxRundRect(ctx, X[0] + 2, Y[0] + 3, X[3] - X[0], Y[2] - Y[0], 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, X[0], Y[0], X[3] - X[0], Y[2] - Y[0], 6); ctx.fill();
  ctx.fillStyle = '#f1f5f9'; ctx.fillRect(X[0] + 1, Y[0] + 1, X[3] - X[0] - 2, Y[1] - Y[0] - 1);
  const ga = ctx.globalAlpha;                        // Einblenden nach „neu“ bleibt erhalten
  ctx.globalAlpha = ga * S.zz; ctx.fillStyle = K.Z.zelle; ctx.fillRect(X[1], Y[1], X[2] - X[1], Y[2] - Y[1] - 1);
  ctx.globalAlpha = ga * S.ze; ctx.fillStyle = K.E.zelle; ctx.fillRect(X[2], Y[1], X[3] - X[2] - 1, Y[2] - Y[1] - 1);
  ctx.globalAlpha = ga;
  ctx.strokeStyle = K.F_LINIE; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, X[0], Y[0], X[3] - X[0], Y[2] - Y[0], 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X[2], Y[0]); ctx.lineTo(X[2], Y[2]); ctx.stroke();
  ctx.strokeStyle = K.F_KREUZ; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(X[1], Y[0] + 3); ctx.lineTo(X[1], Y[2] - 3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X[0] + 3, Y[1]); ctx.lineTo(X[3] - 3, Y[1]); ctx.stroke();
  ctx.restore();
  const m = _m5tMitte;
  _m5tZahl(ctx, '·', m(0, 0)[0], m(0, 0)[1], 19, K.F_DUNKEL, S.kopf);
  _m5tZahl(ctx, String(_m5tM), m(0, 1)[0], m(0, 1)[1], 19, K.F_DUNKEL, S.kopf);
  _m5tZahl(ctx, _m5tFmt(w.kopfZ), m(1, 0)[0], m(1, 0)[1], 17, K.Z.text, S.kopf, S.popKopf);
  _m5tZahl(ctx, String(w.e), m(2, 0)[0], m(2, 0)[1], 17, K.E.text, S.kopf, S.popKopf);
  _m5tZahl(ctx, _m5tFmt(w.teilZ), m(1, 1)[0], m(1, 1)[1], 19, K.Z.text, S.zz, S.popZZ);
  _m5tZahl(ctx, _m5tFmt(w.teilE), m(2, 1)[0], m(2, 1)[1], 19, K.E.text, S.ze, S.popZE);
}
// „80 + 12 = 92“ unter dem Malkreuz, die Teile genau unter IHRER Zelle: Sie fallen
// senkrecht aus der Zelle herunter, „+“ steht unter dem Strich zwischen den Zellen.
function _m5tGleichung(ctx, z, S) {
  const t = S.tZus;
  if (t === null) return;
  const K = _m5tK, w = z.w, kl = _bioFxKlemme, E = _bioFxEase.sanft, gr = 19;
  const ym = K.GL_Y - gr * 0.36;
  const u = E(kl((t - K.Z_FLUG0) / (K.Z_FLUG1 - K.Z_FLUG0)));
  ctx.save();
  // Fallen gerade 8 und 12 fuer „nebeneinander“ durch diese Zeile, tritt sie kurz zurueck.
  if (S.tNeben !== null && S.tNeben < K.T_FLUG)
    ctx.globalAlpha *= 1 - 0.7 * Math.sin(Math.PI * kl(S.tNeben / K.T_FLUG));
  if (t >= K.Z_FLUG0) {
    for (const [c, s, f] of [[1, _m5tFmt(w.teilZ), K.Z.text], [2, _m5tFmt(w.teilE), K.E.text]]) {
      const [x0, y0] = _m5tMitte(c, 1);
      _m5tZahl(ctx, s, x0, y0 + (ym - y0) * u, gr, f, 1);
    }
  }
  _m5tZahl(ctx, '+', K.MX[2], ym, gr, K.F_DUNKEL, kl((t - 0.4) / 0.15));
  const bG = _m5tBreite(ctx, '=', gr), xg = K.MX[3] + 6 + bG / 2;
  const sErg = _m5tFmt(w.erg), bErg = _m5tBreite(ctx, sErg, gr);
  const wk = z.wackel > 0 ? Math.sin(z.wackel * 50) * 3 * (z.wackel / 0.45) : 0;
  _m5tZahl(ctx, '=', xg, ym, gr, K.F_DUNKEL, kl((t - K.Z_ERG0) / 0.1));
  _m5tZahl(ctx, sErg, xg + bG / 2 + 7 + bErg / 2 + wk, ym, gr, K.F_DUNKEL,
           kl((t - K.Z_ERG0 - 0.05) / 0.1), t - K.Z_ERG0 - 0.05);
  ctx.restore();
}
// „812“ unter der Rechnung: Aus beiden Zellen faellt eine Kopie senkrecht herunter,
// die 80 schrumpft dabei auf 8 (die 0 verblasst), dann ruecken 8 und 12 unter dem
// Strich zwischen den Zellen aneinander. Rechts daneben klein „nebeneinander“.
function _m5tNebenZeichnen(ctx, z, S) {
  const t = S.tNeben;
  if (t === null) return;
  const K = _m5tK, w = z.w, kl = _bioFxKlemme, E = _bioFxEase.sanft, gr = 19;
  const ym = K.NB_Y - gr * 0.36, xm = K.MX[2];
  const sZ = String(w.zP), sE = String(w.teilE), sN = _m5tFmt(w.neben);
  const bZ = _m5tBreite(ctx, sZ, gr), bE = _m5tBreite(ctx, sE, gr), bN = _m5tBreite(ctx, '0', gr);
  const bF = _m5tBreite(ctx, sN, gr);
  // klein daneben, was da gemacht wurde (erscheint, wenn die Zahl steht)
  ctx.save(); ctx.globalAlpha *= kl((t - K.T_RUECK + 0.1) / 0.25);
  _m5tText(ctx, 'nebeneinander', xm + Math.max(bF, bZ + bE) / 2 + 12, K.NB_Y - 2, 12, K.F_GRAU, 'left', '600');
  ctx.restore();
  if (t >= K.T_RUECK) {
    // fertig: die Zahl, wie sie nebeneinander steht (Tausendertrenner wie im Heft)
    let x = xm - bF / 2, ziffer = 0;
    for (const ch of sN) {
      const b = _m5tBreite(ctx, ch, gr);
      if (ch !== ' ') {
        _m5tText(ctx, ch, x, K.NB_Y, gr, ziffer < sZ.length ? K.Z.text : K.E.text, 'left');
        ziffer++;
      }
      x += b;
    }
    return;
  }
  const u = E(kl(t / K.T_FLUG)), v = E(kl((t - K.T_FLUG) / (K.T_RUECK - K.T_FLUG)));
  const links = xm - (bZ + bE) / 2;                  // Ziel: beide Stuecke aneinander
  // Zehnerteil: faellt aus seiner Zelle, die letzte Ziffer (die 0) verblasst und schrumpft
  const nullA = 1 - kl((t - 0.1) / 0.3);
  const [zx0, zy0] = _m5tMitte(1, 1);
  const gx = zx0 + (links + bZ / 2 - zx0) * v, gy = zy0 + (ym - zy0) * u;
  const xZ = gx - (bN * nullA) / 2;
  _m5tZahl(ctx, sZ, xZ, gy, gr, K.Z.text, 1);
  if (nullA > 0.01)
    _m5tZahl(ctx, '0', xZ + bZ / 2 + bN * nullA / 2, gy, gr * (0.5 + 0.5 * nullA), K.Z.text, nullA);
  // Einerteil: faellt aus seiner Zelle und rueckt dann heran
  const [ex0, ey0] = _m5tMitte(2, 1);
  _m5tZahl(ctx, sE, ex0 + (links + bZ + bE / 2 - ex0) * v, ey0 + (ym - ey0) * u, gr, K.E.text, 1);
}
// Kurzform „23 · 4“ auf Karo, Schreibweise wie im Heft.
function _m5tKurz(ctx, z, S) {
  const t = S.tKurz;
  if (t === null) return;
  const K = _m5tK, w = z.w, kb = K.KB, X0 = K.KX, Y0 = K.KY, kl = _bioFxKlemme, E = _bioFxEase.sanft;
  const sa = String(w.n), la = sa.length, R = la + 2;          // Spalten: 0 frei, 1..la, „·“, Faktor
  const cx = c => X0 + (c + 0.5) * kb, cy = r => Y0 + (r + 0.5) * kb;
  const GR = 18, GM = 12;
  // Papier
  ctx.save();
  ctx.globalAlpha *= kl(t / 0.15);
  const px0 = X0 - 8, px1 = X0 + (R + 1) * kb + 8, py0 = Y0 - 8, py1 = Y0 + 3 * kb + 8;
  ctx.fillStyle = 'rgba(15,23,42,0.08)';
  _bioFxRundRect(ctx, px0 + 2, py0 + 3, px1 - px0, py1 - py0, 6); ctx.fill();
  ctx.fillStyle = '#ffffff';
  _bioFxRundRect(ctx, px0, py0, px1 - px0, py1 - py0, 6); ctx.fill();
  ctx.strokeStyle = K.F_KARO; ctx.lineWidth = 1;
  for (let i = 0; i <= R + 1; i++) {
    ctx.beginPath(); ctx.moveTo(X0 + i * kb, py0 + 1); ctx.lineTo(X0 + i * kb, py1 - 1); ctx.stroke();
  }
  for (let j = 0; j <= 3; j++) {
    ctx.beginPath(); ctx.moveTo(px0 + 1, Y0 + j * kb); ctx.lineTo(px1 - 1, Y0 + j * kb); ctx.stroke();
  }
  ctx.strokeStyle = K.F_LINIE; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, px0, py0, px1 - px0, py1 - py0, 6); ctx.stroke();
  ctx.restore();
  // gelb hinterlegt: die Ziffern, die gerade malgenommen werden
  const hl = (c, a) => {
    if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = 'rgba(254,240,138,0.75)'; ctx.strokeStyle = '#eab308'; ctx.lineWidth = 1.8;
    _bioFxRundRect(ctx, X0 + c * kb + 2, Y0 + 2, kb - 4, kb - 4, 5); ctx.fill(); ctx.stroke();
    ctx.restore();
  };
  const aE = kl((t - K.K_SCHREIB) / 0.12) * (1 - kl((t - K.K_TEIL1) / 0.1));
  const aZ = kl((t - K.K_TEIL1) / 0.12) * (1 - kl((t - K.K_MERK1) / 0.1));
  hl(la, aE); hl(R, Math.max(aE, aZ)); hl(la - 1, aZ);
  // Halt: die angekommene Zahl einrahmen (hinter den Ziffern)
  if (z.halt) {
    const n = String(w.eP).length;
    ctx.save();
    ctx.fillStyle = 'rgba(252,211,77,0.38)'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.5;
    _bioFxRundRect(ctx, X0 + (R - n + 1) * kb + 1, Y0 + 2 * kb + 1, n * kb - 2, kb - 2, 6); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // Aufgabe: Zehnerziffer blau, Einerziffer orange, dann „·“ und der Faktor
  for (let i = 0; i < la; i++)
    _m5tZahl(ctx, sa[i], cx(1 + i), cy(0), GR, i === la - 1 ? K.E.text : K.Z.text, kl((t - 0.08 - i * 0.05) / 0.12));
  _m5tZahl(ctx, '·', cx(la + 1), cy(0), GR, K.F_DUNKEL, kl((t - 0.18) / 0.12));
  _m5tZahl(ctx, String(_m5tM), cx(R), cy(0), GR, K.F_DUNKEL, kl((t - 0.22) / 0.12));
  // Strich unter der Aufgabe, zieht sich von rechts nach links
  const us = kl((t - 0.2) / 0.1);
  if (us > 0) {
    const xr = X0 + (R + 1) * kb - 3, xl = X0 + kb + 3;
    ctx.save(); ctx.strokeStyle = K.F_DUNKEL; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(xr, Y0 + kb); ctx.lineTo(xr - (xr - xl) * us, Y0 + kb); ctx.stroke();
    ctx.restore();
  }
  // EINER: die 12 fliegt aus der Zelle ins Ergebnis und zerfaellt in Merkziffer und Einer
  if (t >= K.K_FLUG0) {
    const sE = String(w.eP), nE = sE.length;
    const u = E(kl((t - K.K_FLUG0) / (K.K_HALT - K.K_FLUG0)));
    const v = E(kl((t - K.K_HALT) / (K.K_TEIL1 - K.K_HALT)));
    const [qx, qy] = _m5tMitte(2, 1);
    for (let j = 0; j < nE; j++) {
      const col = R - (nE - 1 - j);
      const x0 = qx + (j - (nE - 1) / 2) * 11, x1 = cx(col), y1 = cy(2);
      let x = x0 + (x1 - x0) * u, y = qy + (y1 - qy) * u - 28 * Math.sin(Math.PI * u);
      let gr = 19 + (GR - 19) * u, farbe = K.E.text;
      if (j < nE - 1) {                              // die Zehnerziffer der 12 wird gemerkt
        y += (cy(1) - cy(2)) * v; gr += (GM - GR) * v; farbe = _m5tMisch(K.E.text, K.Z.text, v);
      }
      _m5tZahl(ctx, sE[j], x, y, gr, farbe, 1);
    }
  }
  // ZEHNER: blasse 8, die gemerkte 1 gleitet hinein, daraus wird 9
  if (t >= K.K_Z0) {
    const sP = String(w.zP), sF = String(w.zF);
    if (t < K.K_MERK1) {
      const a = 0.55 * kl((t - K.K_Z0) / (K.K_Z1 - K.K_Z0));
      for (let j = 0; j < sP.length; j++)
        _m5tZahl(ctx, sP[j], cx(R - 1 - (sP.length - 1 - j)), cy(2), GR, K.Z.text, a);
      if (t >= K.K_Z1) {
        const m = E(kl((t - K.K_Z1) / (K.K_MERK1 - K.K_Z1)));
        _m5tZahl(ctx, String(w.merk), cx(R - 1), cy(1) + (cy(2) - cy(1)) * m, GM + (GR - GM) * m,
                 K.Z.text, 1 - 0.5 * m);
      }
    } else {
      for (let j = 0; j < sF.length; j++)
        _m5tZahl(ctx, sF[j], cx(R - 1 - (sF.length - 1 - j)), cy(2), GR, K.Z.text, 1, t - K.K_MERK1);
    }
  }
}
function _m5tDraw(ctx, cv) {
  if (!_m5t) return;
  const z = _m5t, W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const S = _m5tSicht(z);
  ctx.save();
  ctx.globalAlpha = z.einblend;
  _m5tFeld(ctx, z, S);
  _m5tKreuz(ctx, z, S);
  _m5tGleichung(ctx, z, S);
  _m5tNebenZeichnen(ctx, z, S);
  _m5tKurz(ctx, z, S);
  ctx.restore();
  _bioFxDraw(ctx, z.fx);
  if (z.halt) _m5tHaltSchild(ctx, z);
  if (z.pause) _m5tPauseSchild(ctx);
}
// Halt: Schild unten rechts, unter der Kurzform, zweizeilig
// („12 Einer =“ / „1 Zehner und 2 Einer“) – einzeilig waere es breiter als der Platz.
function _m5tHaltSchild(ctx, z) {
  const K = _m5tK, w = z.w;
  const zeilen = [w.eP + ' Einer =', w.merk + ' Zehner und ' + w.eZiffer + ' Einer'];
  const x0 = K.SX0, x1 = K.SX1, y0 = K.SY0, y1 = K.SY1;
  ctx.save();
  ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.5;
  _bioFxRundRect(ctx, x0, y0, x1 - x0, y1 - y0, 9); ctx.fill(); ctx.stroke();
  let gr = 15;
  const br = Math.max(...zeilen.map(s => _m5tBreite(ctx, s, gr))), platz = x1 - x0 - 16;
  if (br > platz) gr = Math.max(11, Math.floor(gr * platz / br));
  const ym = (y0 + y1) / 2, ab = gr * 0.62;
  _m5tText(ctx, zeilen[0], (x0 + x1) / 2, ym - ab + gr * 0.36, gr, '#78350f');
  _m5tText(ctx, zeilen[1], (x0 + x1) / 2, ym + ab + gr * 0.36, gr, '#78350f');
  ctx.restore();
}
// Schild „Pause“ oben links – Stelle, Groesse und Farbe wie in m5-plus-schriftlich.
// Leuchtet kurz auf, wenn waehrend der Pause ein Knopf gedrueckt wird.
function _m5tPauseSchild(ctx) {
  const z = _m5t, w = 64, h = 25, x = 8, y = 8;      // endet vor dem breitesten Feld (33 · 4 beginnt bei x = 85)
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
  _m5tText(ctx, 'Pause', x + 20, y + 17.5, 13, '#ffffff', 'left', '700');
  ctx.restore();
}
