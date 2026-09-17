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
  const SEITEN = {
    kf3: 'federgesetz',            // Gesamtschule 9 - Federhaerte D aus der Steigung
    st8: 'ohm-kennlinie',          // Gesamtschule 8 - R aus der Steigung, Widerstand verdeckt
    ki3: 'beschleunigung-ef',      // Oberstufe EF - a aus der Steigung der t-v-Geraden
    ki4: 'beschleunigung-ef',      // Oberstufe EF - dieselbe Messreihe, t² -> s
  };

  // ── Was verraet die Antwort? Je Simulation eine Liste.
  //    weg:   wird ausgeblendet (CSS, kommt beim Aufdecken sofort zurueck)
  //    maske: Text wird ersetzt (Original wird gemerkt und beim Aufdecken
  //           zurueckgeschrieben)
  const REGELN = {
    'federgesetz': {
      weg: ['.fed-sim .fpm-grid .fpm-note', '.fed-sim > .sim-hint'],
      maske: [
        { sel: '.fed-sim > .fpm-note',
          re: /\s*Ab zwei Punkten legt die Simulation[^<]*?Federhärte D\./,
          mit: ' Ab zwei Punkten legt die Simulation die Ausgleichsgerade hindurch.' },
        { sel: '#fedStatus',
          re: /\s*·\s*Ausgleichsgerade durch (\d+) Punkte: <b>Steigung D = [^<]*<\/b>/,
          mit: ' · Ausgleichsgerade durch $1 Punkte' },
      ],
      hinweis: 'Miss selbst: mindestens fünf Messpunkte aufnehmen, dann in deiner Tabelle F : s ausrechnen.',
    },
    'ohm-kennlinie': {
      weg: ['.ohg-sim .fpm-grid .fpm-note', '.ohg-sim > .sim-hint'],
      maske: [
        { sel: '#ohgRklein', re: /^10 Ω$/, mit: 'Draht A' },
        { sel: '#ohgRgross', re: /^20 Ω$/, mit: 'Draht B' },
        { sel: '#ohgStatus', re: /\s*·\s*R = U\/I = [\d,.]+ Ω/, mit: '' },
        { sel: '#ohgStatus', re: /\s*Widerstand fest: [\d,.]+ Ω\./, mit: ' Der Draht bleibt derselbe.' },
        { sel: '#ohgTable', re: /<td>R = U\/I<\/td>/, mit: '<td>U : I</td>' },
      ],
      hinweis: 'Miss selbst: fünf Spannungen einstellen, Messpunkte eintragen, dann U : I ausrechnen.',
    },
    'beschleunigung-ef': {
      // Die Beschleunigung steht heute dreifach da: am Regler, in der Statuszeile
      // und in der Auswertung ("erwartet", "Literatur", Abweichung). Genau sie
      // soll aus der Steigung fallen.
      weg: ['.bef-sim > .sim-hint', '#befFit .fpm-note'],
      maske: [
        { sel: '#befALbl', re: /^[\d,]+ m\/s²$/, mit: 'verdeckt' },
        { sel: '#befStatus', re: /\s*bei a = [\d,]+ m\/s²/, mit: '' },
        { sel: '#befFit', re: / · erwartet: [\d,.]+/g, mit: '' },
        { sel: '#befFit', re: /&nbsp;·&nbsp; Literatur: [\d,.]+/g, mit: '' },
        { sel: '#befFit', re: /<span class="fpm-badge [^"]*">Abweichung[^<]*<\/span>/g, mit: '' },
        { sel: '#befFit', re: /a = [\d,]+ m\/s²/g, mit: 'deine Fahrt' },
      ],
      hinweis: 'Miss selbst: mindestens fünf Zeiten stoppen, dann die Steigung der t-v-Geraden bestimmen.',
    },
  };

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
