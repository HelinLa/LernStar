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

function entkerne(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, ' | ')
    .replace(/<[^>]+>/g, '')
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
      if (k.length > 18) treffer[id] = k.length > 1200 ? k.slice(0, 1200) + ' …' : k;
    }
    return treffer;
  };
  const lies = () => {
    const t = textFelder();
    const ganz = Object.entries(t).map(([id, v]) => id + ': ' + v).join('  ||  ');
    // Auch die GESAMTE Ablesung deckeln: Simulationen mit Messreihen-Tabelle
    // haben Dutzende Textfelder, und 90 Ablesungen ergaeben sonst ein Megabyte.
    return ganz.length > 2500 ? ganz.slice(0, 2500) + ' …' : ganz;
  };

  out.status.push({ einstellung: 'Ausgangszustand', text: lies() });

  // Hoechstens 90 Anzeigen je Simulation - mehr braucht keine Heftseite, und
  // bei Messreihen-Simulationen waeren es sonst mehrere hundert.
  const MAX_ANZEIGEN = 90;
  for (const k of out.knoepfe) {
    if (out.status.length >= MAX_ANZEIGEN) break;
    try {
      vm.runInContext(`(function(){var f=function(){${k.ruft}};f();})()`, H.ctx);
      H.frames(2);
      out.status.push({ einstellung: k.aufschrift, text: lies() });
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
        H.frames(2);
        out.status.push({ einstellung: `${r.beschriftung || r.id} = ${w}`, text: lies() });
      } catch (e) { /* Regler, die erst nach einem Klick erscheinen */ }
    }
  }

  // Alles, was ins Bild geschrieben wurde - dort stehen oft die Messwerte
  out.bildtexte = [...new Set(H.texte)].filter(t => t && t.length < 90);
  return out;
}

if (require.main === module) {
  const datei = process.argv[2];
  const alle = process.argv.slice(3).map(s => {
    try { return fakten(datei, s); }
    catch (e) { return { sim: s, fehler: e.message }; }
  });
  console.log(JSON.stringify(alle, null, 1));
}
module.exports = { fakten };
