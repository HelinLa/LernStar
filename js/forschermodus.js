// ============================================================================
//  forschermodus.js  –  erst messen, dann die Formel sehen
//
//  Abdullah am 17.09.2026: "mir fehlt der Charakter, Simulation und
//  Gesetzmaessigkeiten herleiten aus den Simulationen, davon lebt auch die
//  Physik". Gemessen ueber alle 475 Forscherseiten der Regelhefte: KEINE
//  einzige laesst ein Gesetz aus eigenen Messwerten gewinnen. Bei 146 Seiten
//  liegt es daran, dass die Simulation die Antwort schon zeigt - als
//  Formelzeile, Theoriekasten, Fit-Hinweis oder als Zahl am Regler.
//
//  Diese Datei blendet genau diese Stellen aus - aber NUR fuer die Heftseiten,
//  die dafuer umgeschrieben wurden. Der QR-Code traegt die Seitenkennung
//  (#experiment=<sim>&heft=<id>), also entscheidet die SEITE ueber den Modus,
//  nicht die Simulation. Jede gedruckte Seite, die hier nicht steht, sieht
//  ihre Simulation unveraendert - das ist Pflicht, denn 569 gedruckte Codes
//  zeigen auf dieselben Simulationen und zitieren deren Anzeigen woertlich.
//
//  Nach dem Messen holt ein Knopf die Erklaerung zurueck ("Auswertung zeigen").
//  Verborgen wird also nichts fuer immer, nur bis das Kind seine eigene
//  Auswertung hat.
//
//  Muss NACH js/heft-bruecke.js geladen werden.
// ============================================================================
'use strict';

(function () {

  // ── Welche Heftseite arbeitet im Forschermodus, und mit welcher Simulation?
  //    Beide Angaben muessen stimmen: Wer denselben QR-Code aus einem anderen
  //    Heft scannt, landet in derselben Simulation und soll sie normal sehen.
  // Seiten und Regeln stehen seit dem 17.09.2026 in js/forschermodus-regeln.js
  // (ERZEUGT aus den Heftdaten, nicht von Hand aendern). Fehlt die Datei, bleibt
  // der Forschermodus einfach aus - jede Heftseite sieht dann ihre Simulation
  // unveraendert, und das ist der sichere Zustand.
  const SEITEN = (typeof FELO_FORSCHEN_SEITEN !== 'undefined') ? FELO_FORSCHEN_SEITEN : {};
  const REGELN = (typeof FELO_FORSCHEN_REGELN !== 'undefined') ? FELO_FORSCHEN_REGELN : {};

  // ── Zustand ───────────────────────────────────────────────────────
  let aktiv = null;       // simId, solange der Modus laeuft
  let beobachter = null;
  const originale = new Map();   // Element -> urspruengliches innerHTML

  function heftId() {
    try {
      const m = decodeURIComponent(location.hash || '').match(/heft=([a-z0-9]+)/i);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }

  function stil() {
    if (document.getElementById('forschermodus-stil')) return;
    const st = document.createElement('style');
    st.id = 'forschermodus-stil';
    st.textContent = `
      .fm-verdeckt{display:none !important}
      .fm-leiste{display:flex;gap:10px;align-items:center;flex-wrap:wrap;
        background:#12351f;border:1px solid #2f7d4f;border-radius:10px;
        padding:8px 12px;margin:0 0 10px;
        font:600 13px/1.4 system-ui,sans-serif;color:#d7f5e3}
      .fm-leiste b{color:#7ee2a8}
      .fm-leiste button{background:#2f7d4f;border:0;border-radius:8px;color:#fff;
        font:600 12px system-ui,sans-serif;padding:6px 12px;cursor:pointer;margin-left:auto}
      .fm-leiste button:hover{background:#3b9c62}`;
    document.head.appendChild(st);
  }

  function modal() { return document.getElementById('physModal'); }
  function box() { const m = modal(); return m ? m.querySelector('.sim-box') : null; }

  function anwenden() {
    const r = REGELN[aktiv]; const b = box();
    if (!r || !b) return;
    (r.weg || []).forEach(sel => {
      b.querySelectorAll(sel).forEach(el => el.classList.add('fm-verdeckt'));
    });
    (r.maske || []).forEach(m => {
      b.querySelectorAll(m.sel).forEach(el => {
        const alt = el.innerHTML;
        if (!m.re.test(alt)) return;
        if (!originale.has(el)) originale.set(el, alt);
        el.innerHTML = alt.replace(m.re, m.mit);
      });
    });
  }

  function leiste() {
    const b = box(); if (!b || b.querySelector('.fm-leiste')) return;
    const r = REGELN[aktiv];
    const d = document.createElement('div');
    d.className = 'fm-leiste';
    d.innerHTML = '<span>🔬 <b>Forschermodus</b> – ' + (r.hinweis || 'Erst messen, dann auswerten.') +
      '</span><button type="button">Auswertung zeigen</button>';
    d.querySelector('button').addEventListener('click', aufdecken);
    const h = b.querySelector('.sim-h3');
    if (h && h.nextSibling) b.insertBefore(d, h.nextSibling); else b.insertBefore(d, b.firstChild);
  }

  function aufdecken() {
    const b = box();
    if (b) {
      b.querySelectorAll('.fm-verdeckt').forEach(el => el.classList.remove('fm-verdeckt'));
      const l = b.querySelector('.fm-leiste'); if (l) l.remove();
    }
    originale.forEach((html, el) => { if (el.isConnected) el.innerHTML = html; });
    originale.clear();
    aus();
  }

  function an(simId) {
    aktiv = simId;
    window.FELO_FORSCHEN = simId;       // liest physics-sim.js fuer Texte IM BILD
    stil(); leiste(); anwenden();
    const m = modal();
    if (m && !beobachter) {
      beobachter = new MutationObserver(() => { if (aktiv) { anwenden(); leiste(); } });
      beobachter.observe(m, { childList: true, subtree: true, characterData: true });
    }
  }

  function aus() {
    aktiv = null;
    window.FELO_FORSCHEN = null;
    if (beobachter) { beobachter.disconnect(); beobachter = null; }
  }

  // ── Einhaengen: sim-lader meldet jedes Oeffnen ─────────────────────
  document.addEventListener('physsim:offen', e => {
    const simId = e && e.detail && e.detail.simId;
    const id = heftId();
    aus();
    if (!simId || !id) return;
    if (SEITEN[id] !== simId || !REGELN[simId]) return;
    // Die Simulation baut ihr HTML erst nach diesem Ereignis fertig auf.
    setTimeout(() => an(simId), 0);
  });

  document.addEventListener('physsim:zu', aus);
  window.addEventListener('hashchange', aus);

  // Fuer Werkzeuge und Tests
  window.FELO_FORSCHERMODUS = { SEITEN, REGELN, an, aus, aufdecken, aktiv: () => aktiv };
})();
