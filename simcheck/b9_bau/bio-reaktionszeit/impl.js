
// ════════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER – br5 „Wie schnell reagierst du?“
// Kennung bio-reaktionszeit, Präfix _n9e.
// Bauplan: arbeitsheft_bio_foe9/einheiten/br5.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   - links oben die Szene, von der Seite: Lina sitzt auf einem Stuhl am Tisch.
//       Lampe:          Auf dem Tisch stehen eine Lampe und ein roter Knopf.
//                       Die Lampe leuchtet auf, danach drückt Lina den Knopf.
//       heißer Topf:    Ein Topf auf einer Kochplatte. Lina berührt den Topf,
//                       die Hand zuckt zurück; erst danach erscheint die
//                       Sprechblase „Heiß!“.
//       Hammer am Knie: Eine Ärztin steht vor dem Tisch und klopft mit dem
//                       Hammer unter Linas Kniescheibe; der Unterschenkel
//                       schnellt nach vorn (das Bein hängt frei, der Stuhl ist hoch).
//   - rechts ein großer Körperumriss von der Seite (dieselbe Blickrichtung wie
//     Lina) mit Gehirn, Rückenmark am Rücken, Nerven in Arm und Bein, Armmuskel
//     und Oberschenkelmuskel - OHNE Beschriftung. Ein gelber Lichtpunkt läuft
//     den Weg der Erregung entlang (Zeitlupe, 25-fach gedehnt). Wo er umdreht
//     und zum Muskel zurückläuft, erscheint ein orangefarbener Ring und bleibt:
//     bei der Lampe im Kopf, bei Topf und Knie am Rücken. Den Rückweg zum Muskel
//     zeichnet eine orange Spur über der gelben.
//       Lampe: Auge, Kopf (Ring; der Punkt kreist dort eine Weile), Rücken
//              hinab bis zur Schulter, Armmuskel.
//       Topf:  Hand, Arm hinauf, Rücken (Ring), Armmuskel. Vom Ring aus kriecht
//              zugleich ein kleinerer Punkt den Rücken hinauf in den Kopf; erst
//              wenn er ankommt (0,15 s, die Hand ist längst weg), leuchtet der
//              Kopf auf, danach (0,16 s) kommt „Heiß!“.
//       Knie:  Knie, Oberschenkel hinauf, unterer Rücken (Ring),
//              Oberschenkelmuskel. Der Kopf bleibt dunkel.
//   - links unten eine Stoppuhr (Zeiger: eine Umdrehung = 1 s) mit der Anzeige
//     „Zeit: 0,20 s“ und drei Zeitbalken (Lampe, Topf, Knie) auf einer Achse
//     0 s … 0,20 s mit Strichen alle 0,05 s. Der Balken wächst mit der Uhr und
//     bleibt danach blass stehen: 0,05 s ist sichtbar ein Viertel von 0,20 s.
//
// BEDIENUNG (wörtlich):
//   „Reiz“: „Lampe“ · „heißer Topf“ · „Hammer am Knie“   _n9eReiz('lampe'|'topf'|'knie')
//   „▶ Start“ (_n9eStart) · „neu“ (_n9eNeu: zurück auf „Lampe“, Balken weg)
//   Sprungmarken „Lampe: Ergebnis“ · „heißer Topf: Ergebnis“ ·
//   „Hammer am Knie: Ergebnis“ (_n9eMarke) - zeigen sofort das Endbild.
//   „▶ Start“ wirkt nicht, solange ein Lauf noch geht (kein Neustart mitten drin).
//
// ABLAUF nach „▶ Start“: 0,8 s Vorlauf (Lampe noch aus / Hand geht zum Topf /
//   Ärztin holt aus), dann der Reiz - ab hier läuft die Stoppuhr. Sie hält an,
//   wenn der Lichtpunkt im Muskel ankommt; genau dann bewegt sich Lina.
//
// STATUSZEILEN (wörtlich; jede länger als 18 Zeichen, sonst fehlt sie im
//   Faktendump von simfakten.js):
//   _n9e-reiz   „Reiz: Lampe – Lina wartet am Knopf. Die Lampe ist aus.“
//               „Reiz: Lampe – Die Lampe leuchtet auf.“
//               „Reiz: Lampe – Lina drückt den Knopf.“
//               „Reiz: heißer Topf – Lina sitzt am Tisch. Der Topf ist heiß.“
//               „Reiz: heißer Topf – Lina greift zum Topf.“
//               „Reiz: heißer Topf – Lina berührt den Topf.“
//               „Reiz: heißer Topf – Die Hand zuckt zurück.“
//               „Reiz: heißer Topf – Die Hand ist schon zurück. Erst jetzt ruft Lina „Heiß!““
//               „Reiz: Hammer am Knie – Lina sitzt. Ihr Bein hängt frei.“
//               „Reiz: Hammer am Knie – Die Ärztin holt mit dem Hammer aus.“
//               „Reiz: Hammer am Knie – Der Hammer klopft unter die Kniescheibe.“
//               „Reiz: Hammer am Knie – Der Unterschenkel schnellt nach vorn.“
//               „Reiz: Hammer am Knie – Der Unterschenkel ist nach vorn geschnellt.“
//               (Endbild: das Bein hängt wieder, der Ausschlag ist vorbei)
//   _n9e-ring   „Noch kein Ring zu sehen.“ · „Der Lichtpunkt läuft – noch kein Ring.“
//               „Ring im Kopf – hier dreht der Lichtpunkt um.“
//               „Ring im Rücken – hier dreht der Lichtpunkt um.“
//   _n9e-zeit   „Stoppuhr · Zeit: 0,00 s“ · „Stoppuhr läuft · Zeit: 0,07 s“
//               „Stoppuhr steht · Zeit: 0,20 s“
//   _n9e-hinweis Bedienhinweis je Phase.
//   Im Bild auf der Stoppuhr: „Zeit: 0,20 s“.
//
// HEFT ↔ BILDSCHIRM (lehrer.tabelle_erwartet):
//   Zeile 1 Lampe           aus dem Gehirn      0,20 s – „Ring im Kopf“,     „Zeit: 0,20 s“
//   Zeile 2 heißer Topf     aus dem Rückenmark  0,10 s – „Ring im Rücken“,   „Zeit: 0,10 s“
//   Zeile 3 Hammer am Knie  aus dem Rückenmark  0,05 s – „Ring im Rücken“,   „Zeit: 0,05 s“
//   Spalte 2 steht NICHT als Wort da: Das Kind schließt vom Ring (Kopf/Rücken)
//   auf Gehirn/Rückenmark (so wie im Beispiel: „dreht die Erregung im Kopf um,
//   der Befehl kommt also aus dem Gehirn“).
//
// MODELLWERTE (Lehrerteil): 0,20 s / 0,10 s / 0,05 s. Der Lichtpunkt läuft
//   bei Lampe und Topf mit gut 1000 Bildpunkten je Modellsekunde, beim Knie
//   etwa doppelt so schnell (dicke, schnelle Nervenfasern, nur eine
//   Umschaltstelle) - so treffen alle drei Wege genau ihre Zeit. Bei der Lampe
//   steckt der Rest der 0,20 s im Kopf (der Punkt kreist dort). Die Meldung in
//   den Kopf beim Topf läuft langsamer (dünne Fasern für Hitze und Schmerz).
//
// AHA (_bioFx, ruhig, ohne Textstreifen): Lichtring beim Umdrehen, Welle am
//   Muskel und an der Hand/am Knopf/am Fuß, wenn der Befehl ankommt; beim Topf
//   steht die Stoppuhr schon, während der kleine Punkt noch zum Kopf kriecht -
//   die Vorhersage „das Gehirn arbeitet nur besonders schnell“ fällt sichtbar.
//   Am Ende jedes Laufs eine Welle am Ende seines Balkens.
//
// NICHT AM BILDSCHIRM: „Reflex“, „Reaktionszeit“, „Rückenmark“, „Gehirn“,
//   „schneller“, „langsamer“; keine Beschriftung am Körperumriss; keine
//   Wertung. Deterministisch bis auf die Funken der Effektbibliothek.
// ════════════════════════════════════════════════════════════════════════
let _n9e = null;
const _N9E_REIZE = ['lampe', 'topf', 'knie'];
const _N9E_NAME = { lampe: 'Lampe', topf: 'heißer Topf', knie: 'Hammer am Knie' };
const _N9E_KURZ = { lampe: 'Lampe', topf: 'Topf', knie: 'Knie' };
const _N9E_ZEIT = { lampe: 0.20, topf: 0.10, knie: 0.05 };      // s vom Reiz bis zur Bewegung
const _N9E_ORT = { lampe: 'Kopf', topf: 'Rücken', knie: 'Rücken' };
const _N9E_FARBE = { lampe: '#d97706', topf: '#dc2626', knie: '#2563eb' };
const _N9E_ZL = 25;              // Zeitlupe: 1 s Modellzeit dauert 25 s
const _N9E_VOR = 0.8;            // s echte Zeit vor dem Reiz
const _N9E_V = 1000;             // Bildpunkte je Modellsekunde: Lichtpunkt bei der Lampe
const _N9E_HIRN_AN = 0.15;       // s: heißer Topf - die Meldung kommt im Kopf an
const _N9E_HEISS = 0.16;         // s: heißer Topf - Sprechblase „Heiß!“
const _N9E_ENDE = { lampe: 0.23, topf: 0.19, knie: 0.08 };      // s: dann ist alles gezeigt
const _N9E_SKALA = 0.20;         // s: ganze Länge der Zeitbalken

// ── Körperumriss (Seitenansicht, Blick nach rechts) ──────────────────────
const _N9E_HIRN = [367, 20];
const _N9E_AUGE = [382, 24];
const _N9E_STRANG = [[364, 29], [361, 44], [357, 64], [354, 86], [355, 110], [358, 134]];
const _N9E_RM_O = [357, 64];     // Rücken, Höhe der Schulter
const _N9E_RM_U = [358, 134];    // unterer Rücken
const _N9E_SCHULTER = [364, 70];
const _N9E_ELLE = [363, 106];
const _N9E_HAND = [388, 114];
const _N9E_ARMMUSKEL = [366, 84];
const _N9E_HUEFTE = [366, 146];
const _N9E_OSCHENKEL = [374, 168];
const _N9E_KNIE_N = [375, 188];
const _N9E_KNIE = [377, 196];
const _N9E_BEINMUSKEL = [373, 158];
const _N9E_WEG = {
  lampe: { ein: [_N9E_AUGE, _N9E_HIRN],
           aus: [_N9E_HIRN, [364, 29], [361, 44], _N9E_RM_O, _N9E_SCHULTER, _N9E_ARMMUSKEL] },
  topf:  { ein: [_N9E_HAND, _N9E_ELLE, _N9E_SCHULTER, _N9E_RM_O],
           aus: [_N9E_RM_O, _N9E_SCHULTER, _N9E_ARMMUSKEL],
           hoch: [_N9E_RM_O, [361, 44], [364, 29], _N9E_HIRN] },
  knie:  { ein: [_N9E_KNIE, _N9E_KNIE_N, _N9E_OSCHENKEL, _N9E_HUEFTE, _N9E_RM_U],
           aus: [_N9E_RM_U, _N9E_HUEFTE, _N9E_BEINMUSKEL] }
};
const _N9E_RING = { lampe: _N9E_HIRN, topf: _N9E_RM_O, knie: _N9E_RM_U };

// ── Szene: Linas Arm in drei Haltungen je Reiz (Ellenbogen, Hand) ────────
const _N9E_SCH = [58, 64];                                   // Linas Schulter
const _N9E_POSE = {
  schweben: [[78, 89], [122, 74]],    // Lampe: Hand über dem Knopf
  druecken: [[78, 91], [122, 79]],    // Lampe: Knopf gedrückt
  schoss:   [[66, 88], [86, 92]],     // Hand auf dem Oberschenkel
  topf:     [[84, 84], [133, 74]],    // Hand am Topf
  weg:      [[70, 82], [84, 58]]      // Hand zurückgezuckt
};
const _N9E_KN = [94, 98];            // Linas Knie in der Szene
const _N9E_HAMMER = { hand: [128, 104], lang: 27.2, treffer: Math.atan2(6, -26.5) };   // Treffer bei (101,5 | 110)

// ── Rechnen auf Streckenzügen ────────────────────────────────────────────
function _n9eLaenge(p) {
  let L = 0;
  for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return L;
}
function _n9eAuf(p, q) {
  const L = _n9eLaenge(p) * _bioFxKlemme(q);
  let s = 0;
  for (let i = 1; i < p.length; i++) {
    const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (s + l >= L) {
      const u = l ? (L - s) / l : 0;
      return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * u, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * u];
    }
    s += l;
  }
  return p[p.length - 1].slice();
}
function _n9eZug(ctx, p, q) {
  q = _bioFxKlemme(q);
  if (q <= 0) return;
  const e = _n9eAuf(p, q), L = _n9eLaenge(p) * q;
  ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
  let s = 0;
  for (let i = 1; i < p.length; i++) {
    const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (s + l >= L) break;
    ctx.lineTo(p[i][0], p[i][1]); s += l;
  }
  ctx.lineTo(e[0], e[1]); ctx.stroke();
}
function _n9eMisch(a, b, u) { return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; }

// Takt je Reiz (Modellzeit in s): R = Ring (Umdrehen), A0 = Beginn des
// Rückwegs zum Muskel, T = Befehl am Muskel = Ende der Stoppuhr.
function _n9eTakt(r) {
  const w = _N9E_WEG[r], le = _n9eLaenge(w.ein), la = _n9eLaenge(w.aus), T = _N9E_ZEIT[r];
  if (r === 'lampe') return { R: le / _N9E_V, A0: T - la / _N9E_V, T };
  const v = (le + la) / T;
  return { R: le / v, A0: le / v, T };
}
// Wo ist der große Lichtpunkt zur Modellzeit tau? (null = im Muskel angekommen)
function _n9ePunkt(r, tau) {
  const k = _n9eTakt(r), w = _N9E_WEG[r];
  if (tau < k.R) return _n9eAuf(w.ein, tau / k.R);
  if (tau < k.A0) {                       // nur Lampe: der Punkt kreist im Kopf
    const d = tau - k.R, rad = Math.min(1, d / 0.01, (k.A0 - tau) / 0.01);
    const wi = d * 2 * Math.PI / 0.03;
    return [_N9E_HIRN[0] + 5 * rad * Math.cos(wi), _N9E_HIRN[1] + 2.5 * rad * Math.sin(wi)];
  }
  if (tau < k.T) return _n9eAuf(w.aus, (tau - k.A0) / (k.T - k.A0));
  return null;
}

// ── Zustand ───────────────────────────────────────────────────────────────
function _n9eInit() {
  _n9e = { reiz: 'lampe', phase: 'bereit', vor: 0, tau: 0, t: 0,
           balken: {}, fx: { teile: [] }, letzt: '' };
}
function _n9eLos() { return _n9e.phase === 'lauf' || _n9e.phase === 'fertig'; }
function _n9eFxLeer() { _n9e.fx = { teile: [] }; }
function _n9eZurueck() {
  _n9eFxLeer();
  _n9e.phase = 'bereit'; _n9e.vor = 0; _n9e.tau = 0;
  _n9eStatus();
}
// Knopfreihe „Reiz“
function _n9eReiz(r) {
  if (!_n9e || !_N9E_NAME[r]) return;
  _n9e.reiz = r;
  _n9eZurueck();
}
function _n9eStart() {
  if (!_n9e || _n9e.phase === 'vor' || _n9e.phase === 'lauf') return;
  _n9eFxLeer();
  _n9e.phase = 'vor'; _n9e.vor = 0; _n9e.tau = 0;
  _n9eStatus();
}
function _n9eNeu() {
  if (!_n9e) return;
  _n9e.reiz = 'lampe'; _n9e.balken = {};
  _n9eZurueck();
}
// Sprungmarke: Reiz wählen und gleich das Endbild zeigen
function _n9eMarke(r) {
  if (!_n9e || !_N9E_NAME[r]) return;
  _n9eFxLeer();
  _n9e.reiz = r; _n9e.phase = 'fertig'; _n9e.vor = _N9E_VOR; _n9e.tau = _N9E_ENDE[r];
  _n9e.balken[r] = true;
  _n9eStatus();
}

function _n9eHTML() {
  const k = (r) => `<button class="sim-btn" data-n9e="${r}" onclick="_n9eReiz('${r}')">${_N9E_NAME[r]}</button>`;
  const m = (r) => `<button class="sim-btn" onclick="_n9eMarke('${r}')">${_N9E_NAME[r]}: Ergebnis</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie schnell reagierst du?</h3>
    <div class="fpm-note" style="margin-top:2px">Links: Lina und der Reiz. Rechts: Linas Körper von der Seite mit den Nerven. Der gelbe Lichtpunkt zeigt, wo die Erregung gerade ist.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9e-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9e-los" onclick="_n9eStart()">▶ Start</button>
          <button class="sim-btn" onclick="_n9eNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Reiz</span>
          <div class="sim-btn-row">${k('lampe')}${k('topf')}${k('knie')}</div>
        </div>
        <div class="lmp-status on" id="_n9e-reiz" style="margin-top:8px"></div>
        <div class="lmp-status on" id="_n9e-ring" style="margin-top:6px"></div>
        <div class="lmp-status on" id="_n9e-zeit" style="margin-top:6px"></div>
        <div class="fpm-note" id="_n9e-hinweis" style="margin-top:8px"></div>
        <div class="fpm-label" style="margin-top:10px">Sprungmarken</div>
        <div class="sim-btn-row" style="margin-top:4px">${m('lampe')}${m('topf')}${m('knie')}</div>
        <div class="fpm-note" style="margin-top:8px">Die Balken unten bleiben stehen. So kannst du die Zeiten vergleichen.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Reiz „Lampe“ &nbsp;|&nbsp; Alles läuft in Zeitlupe. Die Stoppuhr zeigt die echte Zeit.</p>
  </div>`;
}

// ── Anzeige ───────────────────────────────────────────────────────────────
// Angezeigte Zeit in s: auf 0,01 s abgeschnitten, am Ende genau der Modellwert.
function _n9eZeitWert() {
  const z = _n9e;
  if (!_n9eLos()) return 0;
  const T = _N9E_ZEIT[z.reiz];
  if (z.tau >= T - 1e-9) return T;
  return Math.floor(z.tau * 100 + 1e-9) / 100;
}
function _n9eZahl(s) { return s.toFixed(2).replace('.', ','); }
function _n9eZeitText() { return 'Zeit: ' + _n9eZahl(_n9eZeitWert()) + ' s'; }
function _n9eNachT() { return _n9eLos() && _n9e.tau >= _N9E_ZEIT[_n9e.reiz] - 1e-9; }

function _n9eSzeneText() {
  const z = _n9e, r = z.reiz, los = _n9eLos(), nach = _n9eNachT();
  let s;
  if (r === 'lampe') {
    s = !los ? 'Lina wartet am Knopf. Die Lampe ist aus.'
      : !nach ? 'Die Lampe leuchtet auf.' : 'Lina drückt den Knopf.';
  } else if (r === 'topf') {
    s = z.phase === 'bereit' ? 'Lina sitzt am Tisch. Der Topf ist heiß.'
      : z.phase === 'vor' ? 'Lina greift zum Topf.'
      : !nach ? 'Lina berührt den Topf.'
      : z.tau >= _N9E_HEISS - 1e-9 ? 'Die Hand ist schon zurück. Erst jetzt ruft Lina „Heiß!“'
      : 'Die Hand zuckt zurück.';
  } else {
    s = z.phase === 'bereit' ? 'Lina sitzt. Ihr Bein hängt frei.'
      : z.phase === 'vor' ? 'Die Ärztin holt mit dem Hammer aus.'
      : !nach ? 'Der Hammer klopft unter die Kniescheibe.'
      : z.tau < _N9E_ZEIT.knie + 0.03 - 1e-9 ? 'Der Unterschenkel schnellt nach vorn.'
      : 'Der Unterschenkel ist nach vorn geschnellt.';
  }
  return 'Reiz: ' + _N9E_NAME[r] + ' – ' + s;
}
function _n9eRingText() {
  const z = _n9e;
  if (!_n9eLos()) return 'Noch kein Ring zu sehen.';
  if (z.tau < _n9eTakt(z.reiz).R - 1e-9) return 'Der Lichtpunkt läuft – noch kein Ring.';
  return 'Ring im ' + _N9E_ORT[z.reiz] + ' – hier dreht der Lichtpunkt um.';
}
function _n9eUhrText() {
  if (!_n9eLos()) return 'Stoppuhr · ' + _n9eZeitText();
  return (_n9eNachT() ? 'Stoppuhr steht · ' : 'Stoppuhr läuft · ') + _n9eZeitText();
}
function _n9eHinweisText() {
  const p = _n9e.phase;
  if (p === 'bereit') return 'Drücke „▶ Start“. Sieh auf den Ring und auf die Stoppuhr.';
  if (p === 'fertig') return 'Fertig. Der Balken bleibt stehen. Stelle einen anderen Reiz ein.';
  return 'Alles läuft in Zeitlupe. Die Stoppuhr zeigt, wie lange es in echt dauert.';
}
function _n9eZeilen() { return [_n9eSzeneText(), _n9eRingText(), _n9eUhrText(), _n9eHinweisText()]; }

function _n9eStatus() {
  if (!_n9e) return;
  const zz = _n9eZeilen();
  _n9e.letzt = zz.join('|');
  const ids = ['_n9e-reiz', '_n9e-ring', '_n9e-zeit', '_n9e-hinweis'];
  for (let i = 0; i < ids.length; i++) {
    const el = document.getElementById(ids[i]);
    if (el) el.textContent = zz[i];
  }
  try {
    document.querySelectorAll('[data-n9e]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9e') === _n9e.reiz);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9e-los');
  if (los && los.classList) los.classList.toggle('primary', _n9e.phase === 'bereit' || _n9e.phase === 'fertig');
}

// ── Ablauf ────────────────────────────────────────────────────────────────
function _n9eUpdate(dt) {
  if (!_n9e) return;
  const z = _n9e;
  dt = _bioFxDt(dt);
  z.t += dt;
  if (z.phase === 'vor') {
    z.vor += dt;
    if (z.vor >= _N9E_VOR) {
      z.vor = _N9E_VOR; z.phase = 'lauf'; z.tau = 0;
      _n9eAhaReiz();
    }
  } else if (z.phase === 'lauf') {
    const alt = z.tau, ende = _N9E_ENDE[z.reiz];
    z.tau = Math.min(ende, z.tau + dt / _N9E_ZL);
    _n9eKanten(alt, z.tau);
    if (z.tau >= ende) { z.tau = ende; z.phase = 'fertig'; }
  }
  if (_n9eZeilen().join('|') !== z.letzt) _n9eStatus();
  _bioFxAlleUpdate(z.fx, dt);
}

// Bewegung in der Szene nach dem Befehl: 0 … 1 (Modellzeit 0,012 s)
function _n9eBewegung() {
  if (!_n9eLos()) return 0;
  return _bioFxEase.sanft(_bioFxKlemme((_n9e.tau - _N9E_ZEIT[_n9e.reiz]) / 0.012));
}
// Knie: der Unterschenkel schnellt vor und fällt zurück (Winkel in rad)
function _n9eKick() {
  if (_n9e.reiz !== 'knie' || !_n9eLos()) return 0;
  return 0.6 * Math.sin(Math.PI * _bioFxKlemme((_n9e.tau - _N9E_ZEIT.knie) / 0.03));
}
// Linas Arm: [Ellenbogen, Hand]
function _n9eArm() {
  const z = _n9e, r = z.reiz, P = _N9E_POSE;
  const wipp = z.phase === 'bereit' ? 0.8 * Math.sin(z.t * 2.1) : 0;
  let e, h;
  if (r === 'lampe') {
    const u = _n9eBewegung();
    e = _n9eMisch(P.schweben[0], P.druecken[0], u); h = _n9eMisch(P.schweben[1], P.druecken[1], u);
  } else if (r === 'topf') {
    if (z.phase === 'bereit') { e = P.schoss[0]; h = P.schoss[1]; }
    else if (z.phase === 'vor') {
      const u = _bioFxEase.sanft(_bioFxKlemme(z.vor / (_N9E_VOR * 0.9)));
      e = _n9eMisch(P.schoss[0], P.topf[0], u); h = _n9eMisch(P.schoss[1], P.topf[1], u);
    } else {
      const u = _n9eBewegung();
      e = _n9eMisch(P.topf[0], P.weg[0], u); h = _n9eMisch(P.topf[1], P.weg[1], u);
    }
  } else { e = P.schoss[0]; h = P.schoss[1]; }
  return [e, [h[0], h[1] + wipp]];
}
// Winkel des Reflexhammers (rad, Leinwand dreht im Uhrzeigersinn)
function _n9eHammerWinkel() {
  const z = _n9e, a0 = _N9E_HAMMER.treffer;
  if (z.phase === 'bereit') return a0 + 1.4;
  if (z.phase === 'vor') {
    const u = _bioFxKlemme(z.vor / _N9E_VOR);
    if (u < 0.5) return a0 + 1.4 + 0.15 * Math.sin(Math.PI * u / 0.5);
    const v = (u - 0.5) / 0.5;
    return a0 + 1.4 * (1 - v * v);
  }
  return a0 + 0.9 * _bioFxEase.sanft(_bioFxKlemme(z.tau / 0.015));
}

// ── Aha (nur Aufrufe der Bibliothek _bioFx) ─────────────────────────────────
function _n9eAhaReiz() {
  const fx = _n9e.fx.teile, r = _n9e.reiz;
  if (r === 'lampe') {
    _bioFxWelle(fx, 240, 58, 'rgba(250,204,21,0.9)', 28);
    _bioFxWelle(fx, _N9E_AUGE[0], _N9E_AUGE[1], 'rgba(250,204,21,0.9)', 14);
  } else if (r === 'topf') {
    _bioFxWelle(fx, 133, 74, 'rgba(239,68,68,0.85)', 20);
    _bioFxWelle(fx, _N9E_HAND[0], _N9E_HAND[1], 'rgba(239,68,68,0.85)', 14);
  } else {
    _bioFxWelle(fx, 101, 110, 'rgba(250,204,21,0.9)', 18);
    _bioFxWelle(fx, _N9E_KNIE[0], _N9E_KNIE[1], 'rgba(250,204,21,0.9)', 14);
  }
}
function _n9eKanten(a, b) {
  const z = _n9e, r = z.reiz, k = _n9eTakt(r), fx = z.fx.teile;
  const ueber = (x) => a < x && b >= x;
  if (ueber(k.R)) {
    const p = _N9E_RING[r];
    _bioFxWelle(fx, p[0], p[1], 'rgba(249,115,22,0.95)', 22);
  }
  if (ueber(k.T)) {
    const m = r === 'knie' ? [373, 165] : [368, 86];
    _bioFxWelle(fx, m[0], m[1], 'rgba(239,68,68,0.9)', 20);
    const s = r === 'lampe' ? [122, 82] : r === 'topf' ? [130, 72] : [110, 128];
    _bioFxWelle(fx, s[0], s[1], 'rgba(250,204,21,0.9)', 18);
    z.balken[r] = true;
    const y = { lampe: 174, topf: 194, knie: 214 }[r];
    _bioFxWelle(fx, 134 + 164 * _N9E_ZEIT[r] / _N9E_SKALA, y, _N9E_FARBE[r], 16);
  }
  if (r === 'topf' && ueber(_N9E_HIRN_AN)) {
    _bioFxWelle(fx, _N9E_HIRN[0], _N9E_HIRN[1], 'rgba(250,204,21,0.95)', 24);
  }
  if (r === 'topf' && ueber(_N9E_HEISS)) {
    _bioFxWelle(fx, 100, 23, 'rgba(220,38,38,0.8)', 30);
  }
}

// ── Zeichnen ────────────────────────────────────────────────────────────────
function _n9eText(ctx, s, x, y, farbe, font, align) {
  ctx.save();
  ctx.font = font || '700 10px sans-serif';
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = farbe || '#1f2937';
  ctx.fillText(s, x, y);
  ctx.restore();
}
function _n9eLinie(ctx, a, b, farbe, w) {
  ctx.strokeStyle = farbe; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
}
function _n9eLicht(ctx, p, r) {
  ctx.save();
  const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(253,224,71,0.95)'); g.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function _n9eDraw(ctx, cv) {
  if (!_n9e) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  _n9eSzene(ctx);
  _n9eUnten(ctx);
  _n9eKoerper(ctx);
  _bioFxAlleDraw(ctx, _n9e.fx);
}

// ── Szene oben links ─────────────────────────────────────────────────────────
function _n9eSzene(ctx) {
  const z = _n9e, r = z.reiz;
  ctx.save();
  ctx.fillStyle = '#eff6ff'; ctx.strokeStyle = '#dbeafe'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, 6, 6, 310, 144, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e7e5e4'; ctx.fillRect(12, 140, 298, 6);
  ctx.restore();
  // Tisch
  ctx.fillStyle = '#b7834c'; ctx.fillRect(112, 90, 186, 6);
  ctx.fillStyle = '#9a6a39'; ctx.fillRect(116, 96, 5, 44); ctx.fillRect(289, 96, 5, 44);
  if (r === 'lampe') _n9eLampe(ctx);
  if (r === 'topf') _n9eTopf(ctx);
  _n9eLina(ctx);
  if (r === 'knie') _n9eAerztin(ctx);
  _n9eBlase(ctx);
  if (z.phase === 'vor' || z.phase === 'lauf') {
    ctx.save();
    ctx.fillStyle = 'rgba(30,41,59,0.82)';
    _bioFxRundRect(ctx, 248, 12, 60, 16, 8); ctx.fill();
    ctx.restore();
    _n9eText(ctx, 'Zeitlupe', 278, 20.5, '#ffffff', '700 10px sans-serif', 'center');
  }
}

function _n9eLampe(ctx) {
  const z = _n9e, an = _n9eLos(), u = _n9eBewegung();
  // Knopf
  ctx.fillStyle = '#475569'; ctx.fillRect(114, 84, 16, 6);
  ctx.fillStyle = '#ef4444'; ctx.strokeStyle = '#991b1b'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, 117, 80 + 2 * u, 10, 4.5 - 2 * u, 2); ctx.fill(); ctx.stroke();
  // Lampe
  ctx.fillStyle = '#334155'; ctx.fillRect(238, 70, 4, 20);
  ctx.beginPath(); ctx.ellipse(240, 89, 11, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  if (an) {
    _bioFxLeuchten(ctx, 240, 58, 13, z.t, '250,204,21');
    ctx.save();
    ctx.strokeStyle = 'rgba(234,179,8,0.85)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const w = i * Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(240 + 14 * Math.cos(w), 58 + 14 * Math.sin(w));
      ctx.lineTo(240 + 19 * Math.cos(w), 58 + 19 * Math.sin(w));
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.fillStyle = an ? '#fde047' : '#e2e8f0'; ctx.strokeStyle = an ? '#ca8a04' : '#94a3b8'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(240, 58, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Licht von der Lampe zum Auge (nur kurz nach dem Aufleuchten)
  if (z.phase === 'lauf' && z.tau < 0.03) {
    ctx.save();
    ctx.globalAlpha = 1 - z.tau / 0.03;
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(229, 56); ctx.lineTo(67, 39); ctx.stroke();
    ctx.restore();
  }
}

function _n9eTopf(ctx) {
  const t = _n9e.t;
  // Kochplatte
  ctx.fillStyle = '#1f2937'; ctx.fillRect(134, 86, 44, 4);
  ctx.fillStyle = 'rgba(239,68,68,' + (0.6 + 0.2 * Math.sin(t * 2)).toFixed(3) + ')';
  ctx.fillRect(136, 85, 40, 2);
  // Topf mit Griffen
  ctx.fillStyle = '#374151'; ctx.fillRect(131, 63, 7, 4); ctx.fillRect(174, 63, 7, 4);
  ctx.fillStyle = '#9ca3af'; ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1.4;
  ctx.fillRect(138, 60, 36, 26); ctx.strokeRect(138, 60, 36, 26);
  ctx.fillStyle = '#6b7280'; ctx.fillRect(135, 57, 42, 4);
  // Dampf steigt auf
  ctx.save();
  ctx.strokeStyle = 'rgba(148,163,184,0.6)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const x0 = 146 + 10 * i;
    ctx.beginPath();
    for (let k = 0; k <= 10; k++) {
      const y = 53 - 2.2 * k, x = x0 + 3 * Math.sin(k * 0.8 - t * 3 + i * 1.7);
      if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function _n9eLina(ctx) {
  const z = _n9e, t = z.t;
  const atem = 1 + 0.015 * Math.sin(t * 1.7);
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // Stuhl (hoch: das Bein hängt frei)
  ctx.fillStyle = '#92603a';
  ctx.fillRect(30, 56, 4, 84);
  ctx.fillRect(30, 102, 48, 5);
  ctx.fillRect(72, 107, 4, 33);
  // Bein: Oberschenkel, Unterschenkel, Schuh
  const phi = _n9eKick(), K = _N9E_KN;
  const A = [K[0] + 34 * Math.sin(phi), K[1] + 34 * Math.cos(phi)];
  _n9eLinie(ctx, [54, 98], K, '#1e3a8a', 13);
  _n9eLinie(ctx, K, A, '#1e3a8a', 11);
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.ellipse(A[0] + 5 * Math.cos(phi), A[1] - 5 * Math.sin(phi) + 1, 8, 4, -phi, 0, Math.PI * 2); ctx.fill();
  // Rumpf atmet ruhig
  ctx.save();
  ctx.translate(55, 104); ctx.scale(1, atem); ctx.translate(-55, -104);
  ctx.fillStyle = '#14b8a6'; ctx.strokeStyle = '#0f766e'; ctx.lineWidth = 1.2;
  _bioFxRundRect(ctx, 42, 58, 26, 46, 9); ctx.fill(); ctx.stroke();
  ctx.restore();
  // Hals und Kopf
  ctx.fillStyle = '#f2c9a0'; ctx.strokeStyle = '#8a5a3b'; ctx.lineWidth = 1.2;
  ctx.fillRect(52, 49, 9, 11);
  ctx.beginPath(); ctx.arc(57, 40, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#4a2c17';
  ctx.beginPath(); ctx.arc(57, 40, 13.6, Math.PI * 0.62, Math.PI * 1.75); ctx.lineTo(57, 33); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(42, 46, 4.5, 9, 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(64, 39, 1.6, 0, Math.PI * 2); ctx.fill();
  const ruft = z.reiz === 'topf' && _n9eLos() && z.tau >= _N9E_HEISS - 1e-9;
  if (ruft) {
    ctx.fillStyle = '#9f1239';
    ctx.beginPath(); ctx.ellipse(66, 47, 2, 2.6, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    _n9eLinie(ctx, [63, 47], [67, 47], '#9f1239', 1.3);
  }
  // Arm (vorne)
  const [E, Hd] = _n9eArm();
  _n9eLinie(ctx, _N9E_SCH, E, '#0f766e', 10);
  _n9eLinie(ctx, _N9E_SCH, E, '#14b8a6', 8);
  _n9eLinie(ctx, E, Hd, '#8a5a3b', 8);
  _n9eLinie(ctx, E, Hd, '#f2c9a0', 6);
  ctx.fillStyle = '#f2c9a0'; ctx.strokeStyle = '#8a5a3b'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(Hd[0], Hd[1], 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Hitze an der Hand, kurz nach der Berührung
  if (z.reiz === 'topf' && z.phase === 'lauf' && z.tau < 0.02) {
    _bioFxLeuchten(ctx, Hd[0], Hd[1], 7, t, '239,68,68');
  }
  ctx.restore();
}

function _n9eAerztin(ctx) {
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  _n9eLinie(ctx, [178, 120], [178, 138], '#475569', 6);
  _n9eLinie(ctx, [190, 120], [190, 138], '#475569', 6);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
  _bioFxRundRect(ctx, 170, 62, 28, 62, 9); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d6a77a'; ctx.strokeStyle = '#8a5a3b'; ctx.lineWidth = 1.2;
  ctx.fillRect(180, 52, 8, 11);
  ctx.beginPath(); ctx.arc(184, 49, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(184, 49, 11.6, Math.PI * 1.2, Math.PI * 2.4); ctx.lineTo(184, 44); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(177.5, 48, 1.4, 0, Math.PI * 2); ctx.fill();
  // Arm mit Reflexhammer
  const S = [176, 70], E = [154, 94], Hd = _N9E_HAMMER.hand;
  _n9eLinie(ctx, S, E, '#94a3b8', 9); _n9eLinie(ctx, S, E, '#ffffff', 7);
  _n9eLinie(ctx, E, Hd, '#8a5a3b', 7); _n9eLinie(ctx, E, Hd, '#d6a77a', 5);
  const a = _n9eHammerWinkel(), L = _N9E_HAMMER.lang;
  const kopf = [Hd[0] + L * Math.cos(a), Hd[1] + L * Math.sin(a)];
  _n9eLinie(ctx, Hd, kopf, '#78716c', 3);
  ctx.save();
  ctx.translate(kopf[0], kopf[1]); ctx.rotate(a);
  ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, -2.5, -5.5, 5, 11, 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#d6a77a'; ctx.strokeStyle = '#8a5a3b'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(Hd[0], Hd[1], 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// Sprechblase „Heiß!“ (heißer Topf, erst nach der Bewegung)
function _n9eBlase(ctx) {
  const z = _n9e;
  if (z.reiz !== 'topf' || !_n9eLos() || z.tau < _N9E_HEISS - 1e-9) return;
  const k = 1.2 - 0.2 * _bioFxEase.federn(_bioFxKlemme((z.tau - _N9E_HEISS) / 0.012));
  ctx.save();
  ctx.translate(100, 23); ctx.scale(k, k);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(-15, 10); ctx.lineTo(-30, 22); ctx.lineTo(-6, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
  _bioFxRundRect(ctx, -24, -11, 48, 22, 9); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.fillRect(-14, 8, 7, 3);
  ctx.restore();
  ctx.save();
  ctx.translate(100, 23); ctx.scale(k, k);
  _n9eText(ctx, 'Heiß!', 0, 0.5, '#dc2626', '800 13px sans-serif', 'center');
  ctx.restore();
}

// ── Unten links: Stoppuhr und Zeitbalken ────────────────────────────────────
const _N9E_BX0 = 134, _N9E_BX1 = 298;
const _N9E_BY = { lampe: 174, topf: 194, knie: 214 };
function _n9eUnten(ctx) {
  const z = _n9e, t = z.t, r = z.reiz;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, 6, 156, 310, 90, 10); ctx.fill(); ctx.stroke();
  ctx.restore();
  // Stoppuhr: Zeiger, eine Umdrehung = 1 s
  const cx = 49, cy = 186, rr = 18, s = _n9eZeitWert();
  const zeiger = _n9eLos() ? Math.min(z.tau, _N9E_ZEIT[r]) : 0;
  ctx.save();
  ctx.fillStyle = '#334155';
  ctx.fillRect(46, 162, 6, 6); ctx.fillRect(43, 159, 12, 3);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (zeiger > 0) {
    ctx.fillStyle = _N9E_FARBE[r]; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rr - 2.5, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * zeiger); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    const w = -Math.PI / 2 + i * Math.PI / 5;
    ctx.beginPath(); ctx.moveTo(cx + (rr - 6) * Math.cos(w), cy + (rr - 6) * Math.sin(w));
    ctx.lineTo(cx + (rr - 2.5) * Math.cos(w), cy + (rr - 2.5) * Math.sin(w)); ctx.stroke();
  }
  const wz = -Math.PI / 2 + 2 * Math.PI * zeiger;
  _n9eLinie(ctx, [cx, cy], [cx + (rr - 4) * Math.cos(wz), cy + (rr - 4) * Math.sin(wz)], '#0f172a', 2);
  ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(cx, cy, 2.2, 0, Math.PI * 2); ctx.fill();
  // Anzeige
  ctx.fillStyle = '#0f172a';
  _bioFxRundRect(ctx, 10, 211, 78, 22, 5); ctx.fill();
  ctx.restore();
  _n9eText(ctx, _n9eZeitText(), 49, 222.5, '#fef08a', '700 11px sans-serif', 'center');

  // Zeitbalken: Gitter alle 0,05 s
  const x0 = _N9E_BX0, x1 = _N9E_BX1;
  ctx.save();
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  for (let i = 0; i <= 4; i++) {
    const x = x0 + (x1 - x0) * i / 4;
    ctx.beginPath(); ctx.moveTo(x, 164); ctx.lineTo(x, 224); ctx.stroke();
  }
  ctx.restore();
  _n9eLinie(ctx, [x0, 225], [x1, 225], '#475569', 1.5);
  const marken = ['0 s', '0,05 s', '0,10 s', '0,15 s', '0,20 s'];
  for (let i = 0; i <= 4; i++) {
    const x = x0 + (x1 - x0) * i / 4;
    _n9eLinie(ctx, [x, 225], [x, 229], '#475569', 1.2);
    _n9eText(ctx, marken[i], x, 237, '#334155', '600 9px sans-serif', 'center');
  }
  for (const q of _N9E_REIZE) {
    const y = _N9E_BY[q], h = 12;
    _n9eText(ctx, _N9E_KURZ[q], x0 - 6, y, _N9E_FARBE[q], '700 10px sans-serif', 'right');
    ctx.save();
    ctx.fillStyle = '#f1f5f9';
    _bioFxRundRect(ctx, x0, y - h / 2, x1 - x0, h, 4); ctx.fill();
    const live = q === r && _n9eLos();
    const wert = live ? Math.min(z.tau, _N9E_ZEIT[q]) : (z.balken[q] ? _N9E_ZEIT[q] : 0);
    if (wert > 0) {
      const b = (x1 - x0) * wert / _N9E_SKALA;
      ctx.globalAlpha = live ? 1 : 0.45;
      ctx.fillStyle = _N9E_FARBE[q];
      _bioFxRundRect(ctx, x0, y - h / 2, Math.max(b, 4), h, 4); ctx.fill();
      ctx.globalAlpha = 1;
      if (live && !_n9eNachT()) _bioFxLeuchten(ctx, x0 + b, y, 5, t, '250,204,21');
    }
    ctx.restore();
  }
}

// ── Rechts: Körperumriss von der Seite ──────────────────────────────────────
function _n9eMuskel(ctx, x, y, rot, c) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = c > 0 ? 'rgba(239,68,68,' + (0.55 + 0.4 * c).toFixed(3) + ')' : 'rgba(248,113,113,0.5)';
  ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(0, 0, 4.5 + 2 * c, 13 - 2.5 * c, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function _n9eKoerper(ctx) {
  const z = _n9e, r = z.reiz, t = z.t, los = _n9eLos(), tau = z.tau;
  const k = _n9eTakt(r), w = _N9E_WEG[r];
  ctx.save();
  ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, 322, 4, 94, 242, 10); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const haut = '#e2e8f0', rand = '#64748b';
  const glied = (p, d) => {
    for (const [f, b] of [[rand, d + 3], [haut, d]]) {
      ctx.strokeStyle = f; ctx.lineWidth = b;
      ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
      ctx.stroke();
    }
  };
  // Bein und Fuß
  glied([[366, 140], [370, 190], [366, 230]], 14);
  ctx.fillStyle = haut; ctx.strokeStyle = rand; ctx.lineWidth = 1.5;
  _bioFxRundRect(ctx, 357, 229, 32, 10, 5); ctx.fill(); ctx.stroke();
  // Rumpf
  ctx.beginPath();
  ctx.moveTo(356, 56);
  ctx.quadraticCurveTo(342, 70, 346, 100);
  ctx.quadraticCurveTo(348, 125, 350, 144);
  ctx.lineTo(382, 144);
  ctx.quadraticCurveTo(385, 122, 380, 108);
  ctx.quadraticCurveTo(388, 84, 380, 62);
  ctx.quadraticCurveTo(372, 54, 356, 56);
  ctx.closePath();
  ctx.fillStyle = haut; ctx.fill(); ctx.strokeStyle = rand; ctx.lineWidth = 1.5; ctx.stroke();
  // Hals und Kopf (mit Nase)
  _n9eLinie(ctx, [365, 42], [362, 60], rand, 18);
  _n9eLinie(ctx, [365, 42], [362, 60], haut, 15);
  ctx.fillStyle = haut; ctx.strokeStyle = rand; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(372, 27, 19, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(389, 22); ctx.lineTo(395, 31); ctx.lineTo(389, 33); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = haut; ctx.fillRect(387, 23, 3, 9);
  // Arm vor dem Rumpf
  glied([[365, 64], [363, 106], [386, 114]], 11);
  ctx.fillStyle = haut; ctx.strokeStyle = rand; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(390, 115, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Gehirn und Rückenmark
  const hirnAn = los && ((r === 'lampe' && tau >= k.R) || (r === 'topf' && tau >= _N9E_HIRN_AN));
  if (hirnAn) _bioFxLeuchten(ctx, _N9E_HIRN[0], _N9E_HIRN[1], 15, t, '250,204,21');
  ctx.fillStyle = hirnAn ? '#fde047' : '#f9a8d4'; ctx.strokeStyle = '#be185d'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(_N9E_HIRN[0], _N9E_HIRN[1], 13, 9.5, -0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(357, 18); ctx.quadraticCurveTo(362, 12, 367, 18); ctx.quadraticCurveTo(372, 24, 377, 17);
  ctx.stroke();
  for (const [f, b] of [['#be185d', 7], ['#f9a8d4', 5]]) {
    ctx.strokeStyle = f; ctx.lineWidth = b;
    ctx.beginPath(); ctx.moveTo(_N9E_STRANG[0][0], _N9E_STRANG[0][1]);
    for (let i = 1; i < _N9E_STRANG.length; i++) ctx.lineTo(_N9E_STRANG[i][0], _N9E_STRANG[i][1]);
    ctx.stroke();
  }
  // Nerven (blass)
  ctx.strokeStyle = 'rgba(202,138,4,0.55)'; ctx.lineWidth = 1.8;
  _n9eZug(ctx, [_N9E_AUGE, _N9E_HIRN], 1);
  _n9eZug(ctx, [_N9E_RM_O, _N9E_SCHULTER, _N9E_ELLE, _N9E_HAND], 1);
  _n9eZug(ctx, [_N9E_RM_U, _N9E_HUEFTE, _N9E_OSCHENKEL, _N9E_KNIE_N, [370, 226]], 1);
  // Muskeln: Armmuskel vorn am Oberarm, Oberschenkelmuskel vorn am Oberschenkel
  const c = los ? _bioFxKlemme((tau - k.T) / 0.006) : 0;
  _n9eMuskel(ctx, 368, 86, -0.05, r === 'knie' ? 0 : c);
  _n9eMuskel(ctx, 373, 165, -0.08, r === 'knie' ? c : 0);
  // Auge
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(_N9E_AUGE[0], _N9E_AUGE[1], 3.4, 2.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1f2937'; ctx.beginPath(); ctx.arc(_N9E_AUGE[0] + 1.2, _N9E_AUGE[1], 1.2, 0, Math.PI * 2); ctx.fill();

  // Ort des Reizes leuchtet kurz
  if (los && tau < Math.min(k.R, 0.03)) {
    const p = r === 'lampe' ? _N9E_AUGE : r === 'topf' ? [390, 115] : _N9E_KNIE;
    _bioFxLeuchten(ctx, p[0], p[1], r === 'lampe' ? 5 : 7, t, r === 'topf' ? '239,68,68' : '250,204,21');
  }
  // Leuchtende Spur: Hinweg gelb, Rückweg zum Muskel orange darüber
  if (los) {
    ctx.save();
    ctx.globalAlpha = z.phase === 'fertig' ? 0.8 : 1;
    ctx.shadowColor = '#fde047'; ctx.shadowBlur = 8;
    ctx.strokeStyle = '#facc15'; ctx.lineWidth = 3.5;
    _n9eZug(ctx, w.ein, tau / k.R);
    if (r === 'topf' && tau >= k.R) {
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5;
      _n9eZug(ctx, w.hoch, (tau - k.R) / (_N9E_HIRN_AN - k.R));
    }
    if (tau >= k.A0) {
      ctx.shadowColor = '#fb923c';
      ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2.5;
      _n9eZug(ctx, w.aus, (tau - k.A0) / (k.T - k.A0));
    }
    ctx.restore();
  }
  // Ring: hier dreht der Lichtpunkt um
  if (los && tau >= k.R - 1e-12) {
    const p = _N9E_RING[r], rr = r === 'lampe' ? 11 : 9;
    _bioFxLeuchten(ctx, p[0], p[1], rr, t, '249,115,22');
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, Math.PI * 2); ctx.stroke();
  }
  // Lichtpunkte
  if (z.phase === 'lauf') {
    const p = _n9ePunkt(r, tau);
    const imKopf = r === 'lampe' && tau >= k.R && tau < k.A0;
    if (p) _n9eLicht(ctx, p, imKopf ? 6.5 : 9);
    if (r === 'topf' && tau >= k.R && tau < _N9E_HIRN_AN) {
      _n9eLicht(ctx, _n9eAuf(w.hoch, (tau - k.R) / (_N9E_HIRN_AN - k.R)), 6.5);
    }
  }
  ctx.restore();
}
