// ============================================================================
//  sim-lader.js  –  physics-sim.js erst laden, wenn es gebraucht wird
//
//  physics-sim.js ist 3,3 MB gross. Wird sie ueber <script> eingebunden, muss
//  der Browser sie bei JEDEM Start parsen, auch wenn kein Kind eine Simulation
//  oeffnet. Auf einem Schul-Tablet kostet das jedes Mal ein bis zwei Sekunden,
//  bevor die App bedienbar ist.
//
//  Die Datei fuehrt beim Laden nichts aus und wird von aussen nur ueber zwei
//  Funktionen benutzt: openPhysicsSim und openArbeitsblatt. Diese Datei legt
//  fuer beide einen Platzhalter an, der die grosse Datei bei Bedarf nachlaedt
//  und den Aufruf danach weiterreicht. Sobald der Browser Leerlauf hat, wird
//  sie ohnehin im Hintergrund geholt - der erste Klick auf eine Simulation
//  ist dadurch trotzdem sofort da, und offline funktioniert sie weiterhin.
//
//  Muss VOR app.js geladen werden. Die Versionsnummer unten muss zur ?v= in
//  index.html passen, sonst umgeht das Nachladen das Cache-Busting.
// ============================================================================
'use strict';

(function () {
  const QUELLE = 'physics-sim.js?v=125';
  let laeuft = null;

  const melden = simId =>
    document.dispatchEvent(new CustomEvent('physsim:offen', { detail: { simId } }));

  // physics-sim.js ueberschreibt beim Laden unseren Platzhalter mit der echten
  // Funktion. Die huellen wir einmal ein, damit jedes Oeffnen gemeldet wird -
  // auch wenn es spaeter direkt aus app.js kommt.
  function einhuellen() {
    const echt = window.openPhysicsSim;
    if (typeof echt !== 'function' || echt.istPlatzhalter || echt.meldet) return;
    const umhuellt = function (simId) {
      const r = echt.apply(this, arguments);
      melden(simId);
      return r;
    };
    umhuellt.meldet = true;
    window.openPhysicsSim = umhuellt;
  }

  function laden() {
    if (laeuft) return laeuft;
    laeuft = new Promise((fertig, fehler) => {
      const s = document.createElement('script');
      s.src = QUELLE;
      s.onload = () => { einhuellen(); fertig(); };
      s.onerror = () => fehler(new Error('physics-sim.js konnte nicht geladen werden'));
      document.head.appendChild(s);
    });
    return laeuft;
  }
  window.physicsSimLaden = laden;

  // ── Wartezeichen ──────────────────────────────────────────────────
  //  Beim ersten Aufruf ist physics-sim.js unter Umstaenden noch unterwegs
  //  (4,4 MB, Schul-WLAN). Ohne Zeichen passiert nach dem Scan sekundenlang
  //  sichtbar nichts und das Kind haelt die App fuer kaputt.
  function wartezeichen(an) {
    let el = document.getElementById('simLadeHinweis');
    if (!an) { if (el) el.remove(); return; }
    if (el) return;
    el = document.createElement('div');
    el.id = 'simLadeHinweis';
    el.setAttribute('role', 'status');
    el.style.cssText = 'position:fixed;inset:0;z-index:9998;display:flex;align-items:center;' +
      'justify-content:center;background:rgba(28,33,54,.72)';
    el.innerHTML = '<div style="background:#fff;border-radius:16px;padding:22px 28px;' +
      'font:600 16px/1.4 system-ui,sans-serif;color:#1c2136;text-align:center;' +
      'box-shadow:0 10px 40px rgba(0,0,0,.3)">' +
      '<div style="width:34px;height:34px;margin:0 auto 12px;border-radius:50%;' +
      'border:3px solid #e6dcc6;border-top-color:#c6a04a;animation:simLadeDreh .9s linear infinite"></div>' +
      'Die Simulation wird geladen…' +
      '<div style="font:400 13px/1.4 system-ui,sans-serif;color:#5d6478;margin-top:6px">' +
      'Beim ersten Mal dauert das einen Moment.</div></div>';
    const st = document.createElement('style');
    st.textContent = '@keyframes simLadeDreh{to{transform:rotate(360deg)}}';
    el.appendChild(st);
    document.body.appendChild(el);
  }

  // Platzhalter: nimmt den Aufruf an, laedt nach, reicht weiter.
  function platzhalter(name) {
    const meiner = function () {
      const args = arguments;
      wartezeichen(true);
      laden().then(() => {
        wartezeichen(false);
        const echt = window[name];
        if (typeof echt === 'function' && echt !== meiner) echt.apply(null, args);
        else console.warn('sim-lader: ' + name + ' fehlt auch nach dem Nachladen');
      }).catch(e => {
        wartezeichen(false);
        console.error(e);
        alert('Die Simulation konnte nicht geladen werden. Bist du online?');
      });
    };
    meiner.istPlatzhalter = true;
    window[name] = meiner;
  }
  platzhalter('openPhysicsSim');
  platzhalter('openArbeitsblatt');

  // ── Welche Themen ein Protokoll haben ────────────────────────────
  //  app.js entscheidet beim Zeichnen einer Fachseite mit
  //  _physHatArbeitsblatt(exp), ob der Knopf "Protokoll" erscheint. Die
  //  Antwort steht in physics-sim.js - die aber jetzt erst im Leerlauf
  //  nachgeladen wird. Ohne diese Liste waere der Knopf beim ersten
  //  Zeichnen immer weg, weil die Funktion noch nicht existierte.
  //  ERZEUGT aus _physAbDefs. Gegenprobe: python3 simcheck/protokollliste.py
  const PROTOKOLLE = new Set([
    'aggregatzustaende', 'auge', 'beschleunigung-formel-jg9', 'beschleunigung-jg9',
    'beschleunigung-rs', 'bewegung-beschreiben', 'bild-linse', 'brechung', 'brechungswinkel',
    'bremsweg-jg9', 'brille', 'daemmung', 'draht', 'dunkle-flaechen', 'elektrische-energie',
    'elektrische-leistung', 'elektromagnet', 'energiesparen', 'entfernungen',
    'farbmischung-additiv', 'federgesetz', 'freier-fall-jg9', 'geschwindigkeit-rs',
    'gleichfoermig-rs', 'gleichfoermige-bewegung', 'gravitation', 'himmelskoerper',
    'jahreszeiten', 'kamera', 'kern-halbschatten', 'kompass', 'kraefte-addieren',
    'kraefte-gleichgewicht', 'kraft-wirkung', 'kraft-wirkungen', 'kraftmesser', 'kraftpfeil',
    'ladung', 'laermschutz', 'lautstaerke', 'leiter-nichtleiter', 'lichtausbreitung',
    'lochkamera', 'luftwiderstand-jg9', 'lupe', 'magnet-stoffe', 'magnetfeld', 'magnetpole',
    'masse-gewicht', 'messen', 'mondfinsternis', 'mondphasen', 'ohm-kennlinie', 'ohr',
    'ortsfaktor', 'parallel-widerstand', 'parallelschaltung-rs', 'potentiometer', 'prisma',
    'regenbogen', 'reibung-rs', 'reihe-widerstand', 'reihenschaltung-rs',
    's-t-diagramm-deuten', 'sammellinse', 'schallausbreitung', 'schaltplan',
    'schatten-entstehung', 'schatten-groesse', 'schiefe-ebene', 'schwarzes-loch',
    'schwingung', 'sehen', 'sonnenfinsternis', 'spannung', 'spezialteleskop', 'spiegelbild',
    'stromabhaengigkeit', 'stromgefahren', 'stromkosten', 'stromkreis-lampe', 'stromstaerke',
    'stromwirkungen', 'tag-nacht', 'teleskop', 'temperatur-waerme', 'thermometer',
    'ton-entsteht', 'tonhoehe', 'totalreflexion', 'urknall', 'v-begriff', 'v-formel',
    'v-messen', 'v-umrechnung', 'v-zeit-diagramm', 'verkehr-messung', 'verzoegerung-jg9',
    'waermeausdehnung', 'waermeuebertragung', 'wechselwirkung', 'weg-zeit-diagramm',
    'weltall-aufbau', 'weltbild', 'widerstand'
  ]);
  if (typeof window._physHatArbeitsblatt !== 'function') {
    const vorlaeufig = exp => PROTOKOLLE.has(exp);
    vorlaeufig.istPlatzhalter = true;
    window._physHatArbeitsblatt = vorlaeufig;   // physics-sim.js ersetzt sie beim Laden
  }

  // Im Leerlauf vorladen: der erste Klick sitzt dann sofort, und die Datei
  // liegt auch offline im Cache.
  const vorladen = () => laden().catch(() => {});
  if (typeof window.requestIdleCallback === 'function')
    window.requestIdleCallback(vorladen, { timeout: 5000 });
  else setTimeout(vorladen, 3000);
})();
