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

  const h3 = /<h3[^>]*>([\s\S]*?)<\/h3>/.exec(roh);
  if (h3) out.ueberschrift = entkerne(h3[1]);

  // Hinweiskaesten (fpm-note) und Fusszeile (sim-hint)
  for (const m of roh.matchAll(/<div class="fpm-note"[^>]*>([\s\S]*?)<\/div>/g))
    out.hinweise.push(entkerne(m[1]));
  for (const m of roh.matchAll(/<p class="sim-hint"[^>]*>([\s\S]*?)<\/p>/g))
    out.hinweise.push(entkerne(m[1]));

  // Regler: JEDES range-Feld, gleich in welcher Auszeichnung. Die aelteren
  // Simulationen benutzen nicht den fpm-Hausstil - wer nur nach fpm-label sucht,
  // findet bei 24 von 29 Simulationen nichts.
  for (const m of roh.matchAll(/<input[^>]*type="range"[^>]*>/g)) {
    const tag = m[0];
    const g = a => (new RegExp(a + '="([^"]*)"').exec(tag) || [])[1];
    const id = g('id');
    if (!id) continue;
    // Beschriftung: das naechste label davor oder der Text unmittelbar davor
    const vor = roh.slice(Math.max(0, m.index - 260), m.index);
    // Beschriftung: bevorzugt ein <label>, sonst der letzte Klartext davor.
    // Die aelteren Simulationen setzen die Beschriftung ohne label-Element.
    const labs = [...vor.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/g)];
    let besch = labs.length ? entkerne(labs[labs.length - 1][1]) : '';
    if (!besch) {
      // Erst am letzten '>' abschneiden, sonst haengt ein Rest des vorigen Tags
      // vorne dran ("ton> Einfallswinkel ...").
      const ab = vor.lastIndexOf('>');
      const klar = entkerne(ab >= 0 ? vor.slice(ab + 1) : vor).replace(/\s+/g, ' ').trim();
      // Reste von Attributen abschneiden: alles bis zum letzten Anfuehrungszeichen
      // weg, wenn noch ein Attribut im Bruchstueck steckt.
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

  // Knoepfe: jeder Knopf mit onclick, ausser Schliessen und Protokoll-Freischaltung
  for (const m of roh.matchAll(/<button[^>]*onclick="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g)) {
    const auf = entkerne(m[2]);
    if (!auf || auf === '✕' || /Öffnen/.test(auf)) continue;
    if (/closePhysicsSim|_abUnlock/.test(m[1])) continue;
    out.knoepfe.push({ aufschrift: auf, ruft: m[1] });
  }

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
  const _mlReihe = out.knoepfe.find(k => /Messreihe automatisch/i.test(k.aufschrift));
  const _mlLeer  = out.knoepfe.find(k => /Tabelle leeren/i.test(k.aufschrift));
  const _mlAuf   = out.knoepfe.filter(k => /auftragen/i.test(k.aufschrift));
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
