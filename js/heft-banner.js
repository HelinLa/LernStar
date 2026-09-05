// ============================================================================
//  heft-banner.js  –  verbindet das gedruckte Forscherheft mit den Simulationen
//
//  Der QR-Code einer Heftseite ruft  #experiment=<sim>&heft=<id>  auf. Diese Datei
//  merkt sich das <id>, legt der geoeffneten Simulation die Forscherfrage jener
//  Seite voran und blendet die drei Forschen-Schritte ein. Damit landet ein Kind,
//  das den Code auf Seite 9 scannt, nicht in einer beliebigen Simulation, sondern
//  sieht oben genau die Frage, die vor ihm im Heft steht.
//
//  Braucht js/heft-bruecke.js (erzeugt aus arbeitsheft/content/forscherseiten.json).
//  Muss NACH physics-sim.js und NACH app.js geladen werden.
// ============================================================================
'use strict';

(function () {
  if (typeof HEFT_SEITEN === 'undefined') return;

  let _heftId = null;

  // ── woher kommt das Kind? ─────────────────────────────────────────
  function ausHash() {
    try {
      const h = decodeURIComponent(location.hash || '');
      const m = h.match(/heft=([a-z0-9]+)/i);
      if (m && HEFT_SEITEN[m[1]]) return m[1];
      const s = h.match(/experiment=([a-z0-9_\-]+)/i);
      if (s && HEFT_ZU_SIM[s[1]]) return HEFT_ZU_SIM[s[1]][0];   // Notnagel: erste Seite
    } catch (e) { }
    return null;
  }
  _heftId = ausHash();
  window.addEventListener('hashchange', () => { _heftId = ausHash(); });

  // ── Stil ──────────────────────────────────────────────────────────
  const css = `
  .heft-kopf{background:linear-gradient(180deg,#262c42,#1c2136);color:#f4ecd8;
    border-radius:14px;padding:12px 16px;margin:0 0 12px;border:1px solid #c6a04a}
  .heft-kopf-zeile{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;
    font:600 11px/1.2 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#c6a04a}
  .heft-kopf-seite{background:#c6a04a;color:#1c2136;border-radius:6px;padding:2px 8px;letter-spacing:.06em}
  .heft-kopf-frage{margin:7px 0 0;font:600 17px/1.35 system-ui,sans-serif;color:#fff7e8}
  .heft-kopf-frage b{color:#e8c777}
  .heft-kopf-auftrag{margin:6px 0 0;padding-top:6px;font:400 14px/1.4 system-ui,sans-serif;
    color:#e6dcc6;border-top:1px solid rgba(230,220,198,.28)}
  .heft-kopf-auftrag b{color:#e8c777}
  .heft-schritte{margin:9px 0 0;padding:0;list-style:none;display:none}
  .heft-schritte li{display:flex;gap:9px;align-items:flex-start;margin:5px 0;
    font:400 13.5px/1.45 system-ui,sans-serif;color:#d7ddea}
  .heft-schritte li span{flex:0 0 20px;height:20px;border-radius:50%;background:#c6a04a;color:#1c2136;
    font:700 12px/20px system-ui,sans-serif;text-align:center}
  .heft-mehr{background:none;border:1px solid #4a5470;border-radius:8px;color:#c6a04a;
    font:600 12px system-ui,sans-serif;padding:4px 10px;margin-top:8px;cursor:pointer}
  .heft-mehr:hover{background:#2f3752}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ── Banner bauen ──────────────────────────────────────────────────
  function bannerHTML(d) {
    const teile = d.frage.split(':');
    const op = teile.length > 1 ? teile[0] + ':' : '';
    const rest = teile.length > 1 ? teile.slice(1).join(':').trim() : d.frage;
    const aw = (d.auftrag || '').split(' ');
    const auftrag = d.auftrag
      ? `<p class="heft-kopf-auftrag"><b>${aw[0]}</b> ${aw.slice(1).join(' ')}</p>` : '';
    const schritte = (d.schritte || []).map((s, i) =>
      `<li><span>${i + 1}</span>${s}</li>`).join('');
    return `<div class="heft-kopf">
      <div class="heft-kopf-zeile">
        <span class="heft-kopf-seite">Heft · Seite ${d.seite}</span>
        <span>${d.kapitel} · ${d.name}</span>
      </div>
      <p class="heft-kopf-frage">${op ? '<b>' + op + '</b> ' : ''}${rest}</p>
      ${auftrag}
      ${schritte ? `<ul class="heft-schritte">${schritte}</ul>
      <button class="heft-mehr" type="button">Die Schritte aus dem Heft ▾</button>` : ''}
    </div>`;
  }

  function einsetzen() {
    const box = document.querySelector('#physModal .sim-box');
    if (!box || box.querySelector('.heft-kopf')) return;
    const d = _heftId && HEFT_SEITEN[_heftId];
    if (!d) return;
    const h3 = box.querySelector('.sim-h3');
    const div = document.createElement('div');
    div.innerHTML = bannerHTML(d);
    const el = div.firstElementChild;
    (h3 ? h3.after(el) : box.prepend(el));
    const btn = el.querySelector('.heft-mehr'), ul = el.querySelector('.heft-schritte');
    if (btn && ul) btn.onclick = () => {
      const auf = ul.style.display === 'block';
      ul.style.display = auf ? 'none' : 'block';
      btn.textContent = auf ? 'Die Schritte aus dem Heft ▾' : 'Schritte ausblenden ▴';
    };
  }

  // ── auf das Oeffnen einer Simulation reagieren ────────────────────
  // js/sim-lader.js meldet jedes Oeffnen ueber dieses Ereignis. Damit
  // funktioniert der Kopf auch dann, wenn physics-sim.js erst nachgeladen wird.
  document.addEventListener('physsim:offen', ev => {
    const simId = ev.detail && ev.detail.simId;
    if (!_heftId || (HEFT_SEITEN[_heftId] && HEFT_SEITEN[_heftId].sim !== simId)) {
      const l = HEFT_ZU_SIM[simId];
      _heftId = l && l.length ? l[0] : null;      // aus der App heraus geoeffnet
    }
    // Die Simulationen bauen ihr Markup teils asynchron zusammen
    einsetzen(); setTimeout(einsetzen, 60); setTimeout(einsetzen, 300);
  });
})();
