/* simfakten.js - liest aus, WAS EINE SIMULATION WIRKLICH ANZEIGT.
 *
 * Grundlage fuer die Heftseiten: Eine Seite darf nur verlangen, was am Bildschirm
 * auch dasteht. Ausgegeben wird je Simulation:
 *   - die Ueberschrift
 *   - jeder Regler mit Beschriftung, Bereich und Schrittweite
 *   - jeder Knopf mit seiner Aufschrift
 *   - die Statuszeile im Ausgangszustand und nach jedem Knopfdruck
 *   - alles, was per ctx.fillText ins Bild geschrieben wird
 *   - die Hinweis- und Modellgrenzen-Kaesten
 *
 * Aufruf:  node simfakten.js <physics-sim.js> <simId> [<simId> ...]  > fakten.json
 */
const vm = require('vm');
const { baueContext } = require('./rauchtest.js');

// Nur ECHTE Tags entfernen: '<' gefolgt von einem Buchstaben oder '/'.
// Der frueher benutzte Ausdruck /<[^>]+>/g fraß auch literale Kleiner-Zeichen im
// Text - aus "Haltekraft 4 N < Gewichtskraft 5 N → Gesamtkraft 1 N nach unten.
// Die Lampe sinkt nach <b>unten</b>." wurde stillschweigend "Haltekraft 4 N
// unten." Jede Statuszeile mit < oder > war damit unbrauchbar (gefunden am
// 05.09.2026 beim Bau von Foerderheft 9, Einheit fk8).
function entkerne(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, ' | ')
    // Zellgrenzen MUESSEN ein Trennzeichen hinterlassen. Ohne diese Zeile
    // klebten Tabellenzellen aneinander: Aus "15 | 8 | 1,7487" wurde
    // "81,7487", und heft_gegen_sim.py meldete den richtigen Wert 1,7487 s
    // als "steht nicht am Bildschirm". Betrifft jede Simulation mit
    // Wertetabelle, also alle Messlabore.
    .replace(/<\/t[dh]>\s*<t[dh][^>]*>/gi, ' | ')
    .replace(/<\/tr>\s*<tr[^>]*>/gi, ' | ')
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fakten(datei, simId) {
  const H = baueContext(datei);
  const out = { sim: simId, ueberschrift: '', regler: [], knoepfe: [], hinweise: [],
                status: [], bildtexte: [] };

  vm.runInContext(`var __m = document.createElement('div'); document.body.appendChild(__m);
                   _physSimDefs[${JSON.stringify(simId)}](__m);`, H.ctx);
  H.frames(4);

  // Rohes HTML der Oberflaeche einsammeln
  const roh = vm.runInContext(`__m.innerHTML`, H.ctx);

  // ── Was erst per JS entsteht, steht NICHT in `__m.innerHTML` ────────────
  // Die Mini-DOM haelt jede Auszeichnung an dem Element, dessen `innerHTML`
  // sie gesetzt hat. `_arbRegler()` in `arbeit` liefert ein LEERES
  // <div id="arbRegler"> aus und fuellt es erst danach mit sechs
  // <input type="range"> - der Dump meldete `regler: []`, und eine Heftseite
  // bekaeme damit Reglerstellungen verboten, die es sehr wohl gibt (gefunden
  // 08.09.2026, behoben 15.09.2026). Der TREIBER weiter unten war nie
  // betroffen: `parseIds` traegt auch nachgesetzte Felder samt `oninput` in
  // `H.elemente` ein - gefehlt hat allein das EINSAMMELN.
  // Nachgesetzte Auszeichnung kann sich mit jedem Klick AENDERN: `arbeit` haelt
  // drei Modi ("schieben", "tragen", "heben") und legt je Modus ZWEI andere
  // Regler in dasselbe <div>. Einmaliges Einsammeln sieht nur den Ausgangsmodus.
  // Der Durchgang laeuft deshalb zweimal - vor und nach dem Knopfdurchgang -,
  // und beide Male wird nur ergaenzt, was noch nicht dasteht.
  //
  // GEMESSEN, alte gegen neue Fassung ueber alle 226 Simulationen: 46 aendern
  // sich, dazu kommen 5 Regler (arbeit +4, wellenwanne +1), 88 Knoepfe
  // (sonnenspektrum +25, linienspektren und flammenfaerbung je +19) und
  // 187 Hinweiskaesten bei 44 Simulationen - die Auswertungssaetze des
  // Messlabors ("Ursprungsgerade => s ~ t. Die Steigung dieser Geraden ist die
  // gefahrene Geschwindigkeit"), also genau die Saetze, die eine Heftseite
  // zitiert. **Kein einziger Verlust**: keine Simulation meldet nach der
  // Aenderung weniger als vorher.
  const _hinw = new Set(), _reglerIds = new Set(), _knopf = new Set();
  function einsammeln() {
    const jetzt = vm.runInContext(`__m.innerHTML`, H.ctx);
    const stuecke = [jetzt];
    for (const el of H.elemente.values()) {
      const h = el && el.innerHTML;
      if (h && !jetzt.includes(h)) stuecke.push(h);
    }
    for (const teil of stuecke) {
      // Hinweiskaesten (fpm-note) und Fusszeile (sim-hint)
      for (const m of teil.matchAll(/<div class="fpm-note"[^>]*>([\s\S]*?)<\/div>/g))
        _hinw.add(entkerne(m[1]));
      for (const m of teil.matchAll(/<p class="sim-hint"[^>]*>([\s\S]*?)<\/p>/g))
        _hinw.add(entkerne(m[1]));

      // Regler: JEDES range-Feld, gleich in welcher Auszeichnung. Die aelteren
      // Simulationen benutzen nicht den fpm-Hausstil - wer nur nach fpm-label
      // sucht, findet bei 24 von 29 Simulationen nichts.
      for (const m of teil.matchAll(/<input[^>]*type="range"[^>]*>/g)) {
        const tag = m[0];
        const g = a => (new RegExp(a + '="([^"]*)"').exec(tag) || [])[1];
        const id = g('id');
        if (!id || _reglerIds.has(id)) continue;
        _reglerIds.add(id);
        // Beschriftung: bevorzugt ein <label>, sonst der letzte Klartext davor.
        // Die aelteren Simulationen setzen die Beschriftung ohne label-Element.
        const vor = teil.slice(Math.max(0, m.index - 260), m.index);
        const labs = [...vor.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/g)];
        let besch = labs.length ? entkerne(labs[labs.length - 1][1]) : '';
        if (!besch) {
          // Erst am letzten '>' abschneiden, sonst haengt ein Rest des vorigen
          // Tags vorne dran ("ton> Einfallswinkel ...").
          const ab = vor.lastIndexOf('>');
          const klar = entkerne(ab >= 0 ? vor.slice(ab + 1) : vor).replace(/\s+/g, ' ').trim();
          // Reste von Attributen abschneiden: alles bis zum letzten
          // Anfuehrungszeichen weg, wenn noch ein Attribut im Bruchstueck steckt.
          let roh2 = klar || entkerne(vor);
          if (/="/.test(roh2)) roh2 = roh2.slice(roh2.lastIndexOf('"') + 1);
          besch = roh2.slice(-70).replace(/^[^A-Za-zÄÖÜäöü]*/, '').trim();
        }
        out.regler.push({
          id,
          beschriftung: besch,
          bereich: { min: g('min'), max: g('max'), step: g('step'), start: g('value') },
        });
      }

      // Knoepfe: jeder mit onclick, ausser Schliessen und Protokoll-Freischaltung
      for (const m of teil.matchAll(/<button[^>]*onclick="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g)) {
        const auf = entkerne(m[2]);
        if (!auf || auf === '✕' || /Öffnen/.test(auf)) continue;
        if (/closePhysicsSim|_abUnlock/.test(m[1])) continue;
        const schl = auf + ' ' + m[1];
        if (_knopf.has(schl)) continue;
        _knopf.add(schl);
        out.knoepfe.push({ aufschrift: auf, ruft: m[1] });
      }
    }
  }
  einsammeln();

  const h3 = /<h3[^>]*>([\s\S]*?)<\/h3>/.exec(roh);
  if (h3) out.ueberschrift = entkerne(h3[1]);


  // Ablesbare Textfelder: ALLE Elemente mit id, nicht nur die mit Klasse lmp-status.
  // Manche Simulationen schreiben mit textContent statt innerHTML - beides lesen.
  // ── Deckelung der Ablesungen ─────────────────────────────────────
  // Die Grenzen 1200 / 2500 stammen aus der Sekundarstufe I, wo Statuszeilen
  // kurz sind. Die Oberstufensimulationen fuehren lange Herleitungen im
  // Anzeigefeld: bei den EF-Dumps vom 07.09.2026 standen 97 Statusfelder exakt
  // an der 2500er-Grenze, darunter lichtuhr und myonenzerfall. Wer daraus
  // schliesst, eine Groesse werde "nicht angezeigt", irrt womoeglich - sie
  // stand im abgeschnittenen Teil. Mit --voll wird gar nicht gekuerzt,
  // mit --max=<n> die Grenze gesetzt. Der Standard bleibt unveraendert,
  // damit alte Dumps reproduzierbar bleiben.
  const _voll = process.argv.includes('--voll');
  const _max  = (process.argv.find(a => a.startsWith('--max=')) || '').slice(6);
  // Frames je Bedienschritt. Der Standard 2 stammt aus der Sekundarstufe I, wo
  // die Anzeige sofort nach dem Klick steht. Animierte Simulationen (freier
  // Fall, Stoss, springender Ball) sind nach zwei Frames noch im Startzustand:
  // freierfall belegte damit nur die ersten 0,64 s, impuls meldete p2 = 0.0 und
  // energieerhaltung "noch kein Aufprall" - gefunden am 07.09.2026 beim Bau der
  // Einfuehrungsphase. --frames=n rechnet weiter, --verlauf=k liest danach k
  // weitere Male im selben Abstand ab und macht so den zeitlichen Verlauf
  // sichtbar (Wertetripel s, v, t einer Bewegung).
  const _fr = (process.argv.find(a => a.startsWith('--frames=')) || '').slice(9);
  const _vl = (process.argv.find(a => a.startsWith('--verlauf=')) || '').slice(10);
  const FRAMES  = Number(_fr) > 0 ? Number(_fr) : 2;
  const VERLAUF = Number(_vl) > 0 ? Number(_vl) : 0;
  const MAX_FELD     = _voll ? Infinity : (Number(_max) ? Number(_max) : 1200);
  const MAX_ABLESUNG = _voll ? Infinity : (Number(_max) ? Number(_max) * 2 : 2500);

  const textFelder = () => {
    const ids = [...H.elemente.keys()];
    const treffer = {};
    for (const id of ids) {
      if (/^ab/.test(id)) continue;                 // Protokollfelder ueberspringen
      const t = vm.runInContext(
        `(function(){var e=document.getElementById(${JSON.stringify(id)});
          if(!e) return ''; return e.innerHTML || e.textContent || '';})()`, H.ctx);
      // Gedeckelt: Simulationen mit einer wachsenden Messreihen-Tabelle
      // (transformator-schluessel, generator, geiger-mueller, freileitungen)
      // liefern sonst je Bedienschritt die ganze Tabelle - 7 MB je Simulation.
      const k = entkerne(t);
      if (k.length > 18) treffer[id] = k.length > MAX_FELD ? k.slice(0, MAX_FELD) + ' …' : k;
    }
    return treffer;
  };
  const lies = () => {
    const t = textFelder();
    const ganz = Object.entries(t).map(([id, v]) => id + ': ' + v).join('  ||  ');
    // Auch die GESAMTE Ablesung deckeln: Simulationen mit Messreihen-Tabelle
    // haben Dutzende Textfelder, und 90 Ablesungen ergaeben sonst ein Megabyte.
    return ganz.length > MAX_ABLESUNG ? ganz.slice(0, MAX_ABLESUNG) + ' …' : ganz;
  };

  out.status.push({ einstellung: 'Ausgangszustand', text: lies() });

  // ---- MESSLABOR: eine Auftragung ohne Messwerte wertet nichts aus --------
  // Die Presetknoepfe ("F ueber 1/r² auftragen") rechnen die Ausgleichsgerade
  // aus der Wertetabelle. Im normalen Knopfdurchgang steht vor ihnen aber
  // "Tabelle leeren" - sie treffen also auf eine LEERE Tabelle, und der Dump
  // enthaelt keine einzige Ausgleichsgerade. Ausgerechnet Steigung, R² und die
  // zurueckgerechnete Groesse sind das, was eine Heftseite zitiert; ohne sie
  // meldet heft_gegen_sim.py jede richtige Zahl als "steht nicht am Bildschirm".
  // Reihenfolge: erst leeren, dann die Auftragung waehlen, dann die Messreihe
  // aufnehmen - die automatische Reihe veraendert genau die Groesse, die gerade
  // auf der x-Achse steht.
  // Erkannt wird am HANDLER, nicht an der Aufschrift: Die einen Simulationen
  // beschriften ihre Reiter "F ueber 1/r² auftragen", die anderen schlicht
  // "t → v"; die einen sagen "Messreihe automatisch aufnehmen", die anderen
  // "Lichtschranken-Messfahrt". Der Aufruf dahinter ist dagegen einheitlich.
  // Mit der Aufschrift als Merkmal blieben ausgerechnet die Bewegungs-
  // simulationen ohne eine einzige Ausgleichsgerade im Dump.
  const _mlReihe = out.knoepfe.find(k => /(Reihe|Messen|Demo|Messfahrt)\(\)/i.test(k.ruft));
  const _mlLeer  = out.knoepfe.find(k => /Clear\(\)/.test(k.ruft));   // nicht ClearFn()
  const _mlAuf   = out.knoepfe.filter(k => /SetPreset\(\s*\d+\s*\)/.test(k.ruft));
  const _klick = (k) => vm.runInContext(
    `(function(){var f=function(){${k.ruft}};f();})()`, H.ctx);
  if (_mlReihe && _mlAuf.length) {
    for (const k of _mlAuf) {
      try {
        if (_mlLeer) _klick(_mlLeer);
        _klick(k);
        _klick(_mlReihe);
        H.frames(FRAMES);
        out.status.push({ einstellung: `${k.aufschrift} · mit Messreihe`, text: lies() });
      } catch (e) {
        out.status.push({ einstellung: `${k.aufschrift} · mit Messreihe`,
                          text: 'FEHLER: ' + e.message });
      }
    }
    if (_mlLeer) { try { _klick(_mlLeer); } catch (e) {} }   // sauber weitergeben
  }

  // Hoechstens 90 Anzeigen je Simulation - mehr braucht keine Heftseite, und
  // bei Messreihen-Simulationen waeren es sonst mehrere hundert.
  const MAX_ANZEIGEN = 90;
  for (const k of out.knoepfe) {
    if (out.status.length >= MAX_ANZEIGEN) break;
    try {
      vm.runInContext(`(function(){var f=function(){${k.ruft}};f();})()`, H.ctx);
      H.frames(FRAMES);
      out.status.push({ einstellung: k.aufschrift, text: lies() });
      for (let v = 1; v <= VERLAUF; v++) {
        H.frames(FRAMES);
        out.status.push({ einstellung: `${k.aufschrift} · nach ${(v + 1) * FRAMES} Frames`,
                          text: lies(), bild: H.zeichnung.slice(-40).join(' | ') });
      }
    } catch (e) { out.status.push({ einstellung: k.aufschrift, text: 'FEHLER: ' + e.message }); }
  }

  // ── SCHRITTKNOEPFE: ein Klick ist kein Bereich ──────────────────────────
  // Zwoelf Simulationen stellen ihre Groesse nicht mit einem Regler ein,
  // sondern mit einem Knopfpaar ("◀ weniger Widerstand" / "mehr Widerstand ▶").
  // Der Knopfdurchgang oben drueckt jeden Knopf GENAU EINMAL - der Dump kennt
  // dann nur den Startwert und einen Schritt daneben. Eine Heftseite liest
  // dagegen die ENDEN: `wd6` (Klasse 8) sagt "Ganz links zeigt die Simulation
  // R = 0 Ω und I = 0,90 A", `wd2` liest vier Spannungen bei 20 Ω. Alle diese
  // Werte galten beim ersten Lauf ueber die Sekundarstufe I als "steht nicht
  // am Bildschirm" - ein Fehlalarm des Pruefers, nicht ein Fehler der Seite.
  //
  // Erkannt wird am HANDLER, nicht an der Aufschrift (CLAUDE.md): Ein
  // Schrittpaar sind zwei Knoepfe, deren Aufruf sich nur im VORZEICHEN des
  // Arguments unterscheidet - `_potMove(-1)` und `_potMove(1)`, `_aggStep(-15)`
  // und `_aggStep(15)`. Die Aufschriften sind uneinheitlich: einmal Pfeile,
  // einmal "kaelter"/"waermer", einmal "◀"/"▶".
  const _paare = new Map();          // Handlername -> {ab, auf}
  for (const k of out.knoepfe) {
    const m = /^([A-Za-z_$][\w$]*)\(\s*(-?\d+)\s*\)$/.exec(k.ruft.trim());
    if (!m) continue;
    const n = Number(m[2]);
    if (!n) continue;
    const gegen = `${m[1]}(${-n})`;
    if (!out.knoepfe.some(o => o.ruft.trim() === gegen)) continue;
    const e = _paare.get(m[1]) || {};
    e[n < 0 ? 'ab' : 'auf'] = k;
    _paare.set(m[1], e);
  }
  // Bis zum Anschlag, aber gedeckelt: Gemessen hat der laengste Bereich im
  // Bestand 21 Stufen; 40 Klicks erreichen jedes Ende. Abgebrochen wird, sobald
  // sich die Anzeige NICHT MEHR aendert - dann ist der Anschlag erreicht, und
  // weiterzuklicken schreibt nur dieselbe Zeile noch dreissigmal in den Dump.
  const SCHRITTE = 40;
  for (const [name, e] of _paare) {
    for (const richtung of ['ab', 'auf']) {
      const k = e[richtung];
      if (!k) continue;
      let vorher = lies(), stumpf = 0, gesetzt = 0;
      for (let i = 1; i <= SCHRITTE; i++) {
        try {
          vm.runInContext(`(function(){var f=function(){${k.ruft}};f();})()`, H.ctx);
        } catch (err) { break; }
        H.frames(FRAMES);
        const jetzt = lies();
        if (jetzt === vorher) { if (++stumpf >= 2) break; continue; }
        stumpf = 0; vorher = jetzt;
        out.status.push({ einstellung: `${k.aufschrift} · ${i}. Klick`, text: jetzt });
        if (++gesetzt >= 30) break;          // Notbremse je Richtung
      }
    }
    // Die Gegenrichtung faengt am Anschlag an, den die erste gerade erreicht
    // hat - damit wird der Bereich einmal ganz durchlaufen, nicht zweimal
    // dieselbe Haelfte.
  }

  // ── WAHLGRUPPEN: eine Reihe von Klicks ist kein Gitter ──────────────────
  // `draht` hat drei Gruppen zu je zwei bis drei Knoepfen: Laenge
  // (kurz/lang), Dicke (dick/duenn), Material (Kupfer/Eisen/Konstantan). Der
  // Knopfdurchgang oben drueckt sie der Reihe nach - wenn "Konstantan" kommt,
  // stehen Laenge und Dicke auf dem, was die vorigen Klicks hinterlassen
  // haben, naemlich "lang" und "duenn". Die Heftseite wd3 vergleicht dagegen
  // NUR das Material ("Eisen kommt auf 15 Ω und 0,30 A, Konstantan auf 45 Ω
  // und 0,10 A") und haelt alles andere fest; dieser Zustand kam im Dump nie
  // vor. Wieder ein Fehlalarm des Pruefers.
  //
  // Erkannt am Handler: `F('gruppe','wert')` - gleicher Funktionsname UND
  // gleiches erstes Argument sind eine Gruppe. Gemessen hat das der ganze
  // Bestand nur dreimal (draht 12, geschwindigkeit-rs 9, v-begriff 9
  // Kombinationen), das Gitter laesst sich also VOLLSTAENDIG abfahren.
  const _gruppen = new Map();        // "F|gruppe" -> [Knoepfe]
  for (const k of out.knoepfe) {
    const m = /^([A-Za-z_$][\w$]*)\(\s*'([^']*)'\s*,\s*'([^']*)'\s*\)$/.exec(k.ruft.trim());
    if (!m) continue;
    const s = `${m[1]}|${m[2]}`;
    if (!_gruppen.has(s)) _gruppen.set(s, []);
    _gruppen.get(s).push(k);
  }
  const _achsen = [..._gruppen.values()].filter(v => v.length >= 2);
  const _komb = _achsen.reduce((n, v) => n * v.length, 1);
  if (_achsen.length >= 2 && _komb <= 48) {
    const gesehen = new Set();
    const fahren = (i, weg) => {
      if (i === _achsen.length) {
        try {
          for (const k of weg)
            vm.runInContext(`(function(){var f=function(){${k.ruft}};f();})()`, H.ctx);
          H.frames(FRAMES);
          const txt = lies();
          // Nur NEUE Anzeigen aufschreiben: die Haelfte der Kombinationen
          // liefert dieselbe Zeile, und ein Dump ist kein Protokoll.
          if (!gesehen.has(txt)) {
            gesehen.add(txt);
            out.status.push({ einstellung: weg.map(k => k.aufschrift).join(' + '), text: txt });
          }
        } catch (err) { /* eine unmoegliche Kombination ist kein Fehler */ }
        return;
      }
      for (const k of _achsen[i]) fahren(i + 1, weg.concat([k]));
    };
    fahren(0, []);
  }

  // ── AUSWAHLMENUES: gar nicht bedient ────────────────────────────────────
  // Der Dump kannte bisher nur `<input type="range">` und `<button onclick>`.
  // Ein `<select onchange>` wurde WEDER eingesammelt NOCH betaetigt - und
  // damit blieb alles unsichtbar, was dahinter steht. `sonnensystem` waehlt
  // seinen Planeten so aus: Der Steckbrief zeigt immer nur EINEN, im Dump war
  // es immer die Erde (12.756 km). Die Heftseiten g7 (Klasse 7) und wa6
  // (Gymnasium 7) lesen die Durchmesser von Merkur, Jupiter und Neptun ab -
  // alle vier Zahlen galten als "steht nicht am Bildschirm".
  // Gemessen: fuenf Menues im ganzen Bestand (sonnensystem, doppelspalt,
  // gitter, oszilloskop, zyklotron). Zwei davon haben keine id, das Element
  // ist also nicht ansprechbar - gefahren wird deshalb der HANDLER mit
  // eingesetztem Wert, genau wie beim Regler.
  for (const teil of [roh, ...[...H.elemente.values()].map(e => e && e.innerHTML)]) {
    if (!teil) continue;
    for (const m of teil.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/g)) {
      const oc = /onchange="([^"]*)"/.exec(m[1]);
      if (!oc) continue;
      const code = oc[1].replace(/\bthis\b/g, 'this_');
      const werte = [...m[2].matchAll(/<option[^>]*\bvalue="([^"]*)"[^>]*>([\s\S]*?)<\/option>/g)];
      for (const w of werte) {
        if (out.status.length >= 400) break;      // harte Obergrenze
        try {
          vm.runInContext(
            `(function(){var this_={value:${JSON.stringify(w[1])}};
              var f=function(){${code}};f();})()`, H.ctx);
          H.frames(FRAMES);
          out.status.push({ einstellung: `Auswahl: ${entkerne(w[2]) || w[1]}`, text: lies() });
        } catch (e) { /* ein Menue, das erst nach einem Klick erscheint */ }
      }
    }
  }

  // Zweiter Durchgang: Die Knoepfe koennen die Oberflaeche umgebaut haben.
  // `arbeit` zeigt je Modus ZWEI andere Regler - erst jetzt stehen alle sechs
  // da. Der Treiber unten laeuft danach, also werden auch die neuen abgetastet.
  einsammeln();
  out.hinweise.push(..._hinw);

  for (const r of out.regler) {
    const el = H.elemente.get(r.id);
    const code = el && el._oninput;
    if (!code) continue;
    // Neun Stellen statt nur der beiden Enden: Heftseiten benutzen fast immer
    // Werte aus der MITTE des Bereichs. Wer nur min und max abtastet, haelt jeden
    // davon faelschlich fuer nicht anzeigbar.
    const mn = Number(r.bereich.min), mx = Number(r.bereich.max);
    const st = Number(r.bereich.step) || 1;
    const stellen = [];
    if (isFinite(mn) && isFinite(mx) && mx > mn) {
      for (let k = 0; k <= 8; k++) {
        const roh = mn + (mx - mn) * k / 8;
        const gerastert = mn + Math.round((roh - mn) / st) * st;
        const v = String(Number(gerastert.toFixed(6)));
        if (!stellen.includes(v)) stellen.push(v);
      }
      // Dazu die RUNDEN Werte im Bereich: Heftseiten wählen 100 cm, nicht 95 cm.
      // Ohne sie meldete der Abgleich 23,2 µSv/h als "gibt es nicht", obwohl die
      // Simulation den Wert bei 200 cm sehr wohl anzeigt.
      for (const raster of [1, 2, 5, 10, 25, 50, 100, 250, 500]) {
        if ((mx - mn) / raster > 40) continue;
        for (let v = Math.ceil(mn / raster) * raster; v <= mx; v += raster) {
          const g = mn + Math.round((v - mn) / st) * st;
          const t = String(Number(g.toFixed(6)));
          if (!stellen.includes(t)) stellen.push(t);
        }
      }
    } else {
      stellen.push(r.bereich.min, r.bereich.max);
    }
    for (const w of stellen) {
      if (out.status.length >= MAX_ANZEIGEN) break;
      try {
        vm.runInContext(
          `(function(){var this_=document.getElementById(${JSON.stringify(r.id)});
            this_.value=${JSON.stringify(String(w))};
            var f=function(){${code.replace(/\bthis\b/g, 'this_')}};f();})()`, H.ctx);
        H.frames(FRAMES);
        out.status.push({ einstellung: `${r.beschriftung || r.id} = ${w}`, text: lies() });
        for (let v = 1; v <= VERLAUF; v++) {
          H.frames(FRAMES);
          out.status.push({ einstellung: `${r.beschriftung || r.id} = ${w} · nach ${(v + 1) * FRAMES} Frames`,
                            text: lies(), bild: H.zeichnung.slice(-40).join(' | ') });
        }
      } catch (e) { /* Regler, die erst nach einem Klick erscheinen */ }
    }
  }

  // ── REGLER-ECKEN: einzeln verstellen ist nicht kombinieren ──────────────
  // Die Schleife oben tastet JEDEN Regler ab, aber immer nur EINEN: die
  // uebrigen bleiben dabei stehen, wo der vorige Durchgang sie gelassen hat.
  // Genau das reicht nicht. `leistung-rs` hat drei Regler (Masse 10-100 kg,
  // Hoehe 1-10 m, Zeit 1-20 s), und die Heftseite en13 (Klasse 9) liest
  // "9,81 kW oder 13,34 PS" ab - das ist der Wert an ALLEN DREI Anschlaegen
  // gleichzeitig (100 kg · 9,81 N/kg · 10 m / 1 s). Einzeln verstellt kam der
  // Dump nie ueber 1 PS hinaus, und der Pruefer meldete eine richtige Zahl als
  // "steht nicht am Bildschirm".
  //
  // Gefahren werden die ECKEN des Reglerraums: bei drei Reglern acht
  // Kombinationen, bei vier sechzehn. Ab fuenf Reglern wird nur noch
  // alles-min / alles-max / alles-Mitte gesetzt - 32 Ecken waeren mehr
  // Rechenzeit als Erkenntnis, und die interessanten Faelle sind die
  // Anschlaege.
  const _fahrbar = out.regler
    .map(r => ({ r, el: H.elemente.get(r.id) }))
    .filter(x => x.el && x.el._oninput
                 && isFinite(Number(x.r.bereich.min)) && isFinite(Number(x.r.bereich.max)));
  if (_fahrbar.length >= 2) {
    const raster = (x, anteil) => {
      const mn = Number(x.r.bereich.min), mx = Number(x.r.bereich.max);
      const st = Number(x.r.bereich.step) || 1;
      const g = mn + Math.round(((mx - mn) * anteil) / st) * st;
      return String(Number(g.toFixed(6)));
    };
    const ecken = [];
    if (_fahrbar.length <= 4) {
      for (let maske = 0; maske < (1 << _fahrbar.length); maske++)
        ecken.push(_fahrbar.map((x, i) => raster(x, (maske >> i) & 1 ? 1 : 0)));
      ecken.push(_fahrbar.map(x => raster(x, 0.5)));
    } else {
      for (const anteil of [0, 0.5, 1]) ecken.push(_fahrbar.map(x => raster(x, anteil)));
    }
    for (const ecke of ecken) {
      try {
        // JE REGLER setzen UND SOFORT feuern - nicht erst alle setzen und dann
        // alle feuern. Der naheliegende Weg (alle Werte, dann alle Handler)
        // scheitert an Simulationen, die ihre Regler aus dem eigenen Zustand
        // ZURUECKSCHREIBEN: `_lrsSync()` in `leistung-rs` setzt nach jedem
        // Handler alle drei `r.value = _lrs[k]`. Der erste Handler loeschte
        // damit die beiden noch nicht gefeuerten Werte, und die Ecke
        // "alle drei am Anschlag" kam nie zustande - genau die, die die
        // Heftseite en13 abliest.
        const code = _fahrbar.map((x, i) =>
          `(function(){var this_=document.getElementById(${JSON.stringify(x.r.id)});
             if(!this_) return;
             this_.value=${JSON.stringify(ecke[i])};
             var f=function(){${x.el._oninput.replace(/\bthis\b/g, 'this_')}};f();})();`).join('\n');
        vm.runInContext(`(function(){${code}})()`, H.ctx);
        H.frames(FRAMES);
        out.status.push({
          einstellung: 'Ecke: ' + _fahrbar.map((x, i) =>
            `${(x.r.beschriftung || x.r.id).slice(-24)}=${ecke[i]}`).join(' · '),
          text: lies(),
        });
      } catch (e) { /* eine unmoegliche Ecke ist kein Fehler */ }
    }
  }

  // Alles, was ins Bild geschrieben wurde - dort stehen oft die Messwerte
  out.bildtexte = [...new Set(H.texte)].filter(t => t && t.length < 90);
  return out;
}

if (require.main === module) {
  const datei = process.argv[2];
  // Schalter (--voll, --max=n) sind keine Simulationskennungen.
  const alle = process.argv.slice(3).filter(a => !a.startsWith('--')).map(s => {
    try { return fakten(datei, s); }
    catch (e) { return { sim: s, fehler: e.message }; }
  });
  console.log(JSON.stringify(alle, null, 1));
}
module.exports = { fakten };
