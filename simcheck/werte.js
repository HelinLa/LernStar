/* werte.js - oeffnet eine Simulation, stellt sie ein und liest ab, was dasteht. */
const vm = require('vm');
const { baueContext } = require('./rauchtest.js');

const [datei, simId] = process.argv.slice(2, 4);
const schritte = JSON.parse(process.argv[4]);   // [{tue:"...", lies:"..."}]

const H = baueContext(datei);
vm.runInContext(`var __m = document.createElement('div'); document.body.appendChild(__m);
                 _physSimDefs[${JSON.stringify(simId)}](__m);`, H.ctx);
H.frames(3);

for (const s of schritte) {
  if (s.tue) vm.runInContext(s.tue, H.ctx);
  H.frames(2);
  const txt = vm.runInContext(
    `(function(){var e=document.getElementById(${JSON.stringify(s.lies)});
      return e ? (e.innerHTML || e.textContent || '') : '(fehlt)';})()`, H.ctx);
  console.log('── ' + (s.tue || 'Anfangszustand'));
  // Nur ECHTE Tags entfernen: '<' gefolgt von einem Buchstaben oder '/'.
  // Der frueher benutzte Ausdruck /<[^>]+>/g fraß auch literale Kleiner-Zeichen im
  // Text - aus "Haltekraft 4 N < Gewichtskraft 5 N → Gesamtkraft 1 N nach unten.
  // Die Lampe sinkt nach <b>unten</b>." wurde stillschweigend "Haltekraft 4 N
  // unten." Jede Statuszeile mit < oder > war damit unbrauchbar (gefunden am
  // 05.09.2026 beim Bau von Foerderheft 9, Einheit fk8).
  console.log(String(txt).replace(/<br\s*\/?>/g, '\n').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/\n{2,}/g, '\n').trim());
  console.log();
}
