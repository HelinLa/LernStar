
// ════════════════════════════════════════════════════════════════════════
// MATHE 5 FOERDER – mz4 „Wie liest man große Zahlen?“
// (Kennung m5-grosse-zahlen, Praefix _m5d; Bauplan
// arbeitsheft_mathe_foe5/KAPITEL1_PROFIL.md, Abschnitt „m5-grosse-zahlen“)
//
// WAS MAN SIEHT (Leinwand 420 x 250, von oben nach unten):
//   - ein gelbes Ortsschild mit dem gewaehlten Ort,
//   - darunter die Einwohnerzahl gross (34 px), anfangs OHNE Luecken
//     („18000000“),
//   - darunter eine lange Stellenwerttafel in vier Gruppen
//     Milliarden | Millionen | Tausender | Einer, jede mit den Spalten H Z E.
//     Jede Ziffer steht in ihrer Spalte, jede Gruppe hat ihre ruhige Farbe
//     (Einer bernstein, Tausender gruen, Millionen blau, Milliarden violett),
//   - ganz unten ein Lautsprecher und die Schreiblinie, auf der das Zahlwort
//     waechst.
// Bild und Zahl sind VERBUNDEN: Nach „Gruppen bilden“ traegt jede Ziffer der
// grossen Zahl die Farbe ihrer Gruppe in der Tafel, ueber jeder Gruppe steht
// ein Bogen mit ihrem Namen, und beim Vorlesen leuchtet dieselbe Gruppe in
// Zahl UND Tafel gleichzeitig; das neue Stueck des Zahlworts wird in ihrer
// Farbe unterstrichen.
//
// KNOEPFE (Bauplan, woertlich):
//   Reihe 1, Wahlgruppe _m5dOrt('…'): „Dortmund“ · „Nordrhein-Westfalen“ ·
//            „Deutschland“ · „Erde“
//   Reihe 2: „Gruppen bilden“ · „vorlesen“ · „neu“
// Start: Dortmund, Zahl ohne Luecken (Satz unter der Leinwand:
// „Start: Dortmund, Zahl ohne Lücken“).
//
// ABLAUF (jede Handlung bewegt sich, deterministisch, ohne Zufall):
//   Ort waehlen     Das Schild gleitet von oben herein (0,35 s), die Ziffern
//                   fallen von den Einern her nacheinander in Zahl und Tafel
//                   (0,7 s). Die Zahl steht ohne Luecken da.
//   Gruppen bilden  Je Gruppe ein Schritt zu 0,5 s, angefangen bei den Einern:
//                   ueber der Gruppe waechst ein Bogen mit ihrem Namen, ihre
//                   Ziffern nehmen die Farbe der Tafel an, und alle Ziffern
//                   LINKS davon ruecken um eine Luecke weiter. Der Einer-Block
//                   bleibt stehen. Am Ende ein ruhiger Lichtring an der Gruppe
//                   ganz links (Aha, OHNE Textstreifen). Ein zweites Druecken
//                   zeigt nur noch einmal den Lichtring.
//   vorlesen        Bildet zuerst die Gruppen, falls sie noch fehlen. Dann
//                   leuchten die BELEGTEN Gruppen von links nach rechts, je
//                   1,0 s: erst erscheint das Zahlwort ihrer Ziffern
//                   („dreiundachtzig“), nach 0,5 s der Name der Gruppe
//                   („ Millionen“). Gruppen aus 000 werden nicht gesprochen.
//                   Der Lautsprecher sendet dabei Schallboegen.
//   neu             zurueck zum Start.
//
// STATUSZEILEN (woertlich; das Heft mz4 zitiert sie):
//   _m5d-ort     „Einwohner von Nordrhein-Westfalen (rund)“
//                (Erde: „Einwohner der Erde (rund)“)
//   _m5d-zahl    vorher „Zahl ohne Lücken: 18000000“,
//                nach „Gruppen bilden“ „Zahl mit Lücken: 18 000 000“
//                (Tausendertrenner U+00A0)
//   _m5d-gruppe  „Linke Gruppe: Millionen“ – erst nach „Gruppen bilden“,
//                vorher leer und ausgeblendet
//   _m5d-wort    „So spricht man sie: …“, nach „vorlesen“
//                „So spricht man sie: achtzehn Millionen“
//
//   ABWEICHUNG vom Bauplan (03.10.2026): Der Bauplan nennt „Zahl: 18000000“ /
//   „Zahl: 18 000 000“. simcheck/simfakten.js nimmt aber nur Textfelder mit
//   MEHR als 18 Zeichen in den Faktendump auf („Zahl: 600 000“ hat 13,
//   „Zahl: 83 000 000“ hat 16). Drei der vier Werte, die die Heftspalte
//   „Zahl mit Lücken“ verlangt, haetten im Dump gefehlt – gegen MATHE_PROFIL
//   § 10.12. „Zahl mit Lücken: …“ ist lang genug UND traegt woertlich den
//   Kopf der Heftspalte.
//
// WERTE (gerundete Modellwerte; die Lehrkraft-Werte stehen im Lehrerteil:
// Dortmund rund 590 000, NRW rund 18,1 Mio., Deutschland rund 83,5 Mio.,
// Erde rund 8,1 Mrd.):
//   Dortmund             600 000         Tausender   sechshunderttausend
//   Nordrhein-Westfalen  18 000 000      Millionen   achtzehn Millionen
//   Deutschland          83 000 000      Millionen   dreiundachtzig Millionen
//   Erde                 8 000 000 000   Milliarden  acht Milliarden
//
// AHA: beim Abschluss von „Gruppen bilden“ ein Lichtring (_bioFxWelle) am
// Namen der Gruppe ganz links – dort steht, wie die Zahl heisst. Kein
// Textstreifen, der die Antwort vorsagt.
//
// NICHT AM BILDSCHIRM (sim_plan.nicht_am_bildschirm, Merksatzwoerter):
// „drei“ (als Wort – es steckt nur im Zahlwort „dreiundachtzig“),
// „Dreiergruppe“, „rechts“. Keine Regel, kein „Merke“, kein „falsch“, keine
// Punkte, keine Zeit, keine Namen.
// ════════════════════════════════════════════════════════════════════════
let _m5d = null;
const _m5dORTE = {
  dortmund:    { name: 'Dortmund',            zahl: 600000,     ort: 'Einwohner von Dortmund (rund)' },
  nrw:         { name: 'Nordrhein-Westfalen', zahl: 18000000,   ort: 'Einwohner von Nordrhein-Westfalen (rund)' },
  deutschland: { name: 'Deutschland',         zahl: 83000000,   ort: 'Einwohner von Deutschland (rund)' },
  erde:        { name: 'Erde',                zahl: 8000000000, ort: 'Einwohner der Erde (rund)' }
};
const _m5dREIHE = ['dortmund', 'nrw', 'deutschland', 'erde'];
// Gruppen, Index g = 0 sind die Einer. farbe: [Grund, Rand, dunkel]
const _m5dGRUPPE = [
  { name: 'Einer',      farbe: ['#fef3c7', '#f59e0b', '#92400e'] },
  { name: 'Tausender',  farbe: ['#dcfce7', '#22c55e', '#166534'] },
  { name: 'Millionen',  farbe: ['#e0f2fe', '#38bdf8', '#075985'] },
  { name: 'Milliarden', farbe: ['#f3e8ff', '#a78bfa', '#5b21b6'] }
];
const _m5dK = {
  MX: 210,                 // Mitte der grossen Zahl, wenn alle Luecken offen sind
  ZY: 108,                 // Grundlinie der grossen Zahl
  ZF: 34,                  // Schriftgrad der grossen Zahl
  DW: 23,                  // Abstand zweier Ziffern
  LUECKE: 24,              // eine Luecke zwischen zwei Gruppen
  BY0: 76, BY1: 66,        // Bogen: Hoehe der Enden, Hoehe des Scheitels
  BL: 54,                  // Mitte der Bogenbeschriftung
  TX0: 10, TX1: 410, TG: 6,                     // Tafel: links, rechts, Gruppenabstand
  TY0: 120, TY1: 138, TY2: 154, TY3: 188,       // Tafel: oben, Kopf, H Z E, unten
  WX: 72, WY: 228,         // Zahlwort: Anfang, Grundlinie
  SCHRITT: 0.5,            // s je Gruppe beim Gruppenbilden
  LESEN: 1.0,              // s je belegter Gruppe beim Vorlesen
  EIN: 0.7                 // s fuer das Hereinfallen der Ziffern
};

// ── Zahlwoerter (deutsch, bis 999 Milliarden) ───────────────────────────
const _m5dEINS = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const _m5dZEHN = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn',
                  'siebzehn', 'achtzehn', 'neunzehn'];
const _m5dZEHNER = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig',
                    'achtzig', 'neunzig'];
// 1 … 999. ein = true gibt die Form vor „tausend“ („eintausend“, nicht „einstausend“).
function _m5dBis999(v, ein) {
  const h = Math.floor(v / 100), r = v % 100, z = Math.floor(r / 10), e = r % 10;
  let s = h ? _m5dEINS[h] + 'hundert' : '';
  if (r >= 10 && r < 20) s += _m5dZEHN[r - 10];
  else if (z && e) s += _m5dEINS[e] + 'und' + _m5dZEHNER[z];
  else if (z) s += _m5dZEHNER[z];
  else if (e) s += (e === 1 && !ein) ? 'eins' : _m5dEINS[e];
  return s;
}
// Wert der Gruppe g (0 = Einer) einer Ziffernfolge
function _m5dWertGruppe(s, g) {
  const n = s.length, b = n - 3 * g, a = Math.max(0, b - 3);
  return b > 0 ? parseInt(s.slice(a, b), 10) : 0;
}
// Die belegten Gruppen von links nach rechts, je mit dem Zahlwort ihrer
// Ziffern (zw) und dem Wort fuer die Gruppe (gw).
function _m5dTeile(zahl) {
  const s = String(zahl), G = Math.ceil(s.length / 3), teile = [];
  for (let g = G - 1; g >= 0; g--) {
    const v = _m5dWertGruppe(s, g);
    if (!v) continue;
    let zw, gw;
    if (g === 0)      { zw = _m5dBis999(v, false); gw = ''; }
    else if (g === 1) { zw = _m5dBis999(v, true);  gw = 'tausend'; }
    else {
      zw = v === 1 ? 'eine' : _m5dBis999(v, true);
      gw = g === 2 ? (v === 1 ? ' Million' : ' Millionen') : (v === 1 ? ' Milliarde' : ' Milliarden');
    }
    teile.push({ g, zw, gw });
  }
  // Nach „Millionen“ und „Milliarden“ folgt ein Leerzeichen, nach „tausend“ nicht.
  for (let i = 1; i < teile.length; i++) if (teile[i - 1].g >= 2) teile[i].zw = ' ' + teile[i].zw;
  return teile;
}
function _m5dWort(zahl) {
  const t = _m5dTeile(zahl);
  return t.length ? t.map(x => x.zw + x.gw).join('') : 'null';
}
function _m5dMitLuecken(zahl) { return String(zahl).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

// ── Hilfen ───────────────────────────────────────────────────────────────
function _m5dKlemme(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
function _m5dSanft(u) { u = _m5dKlemme(u); return u * u * (3 - 2 * u); }
function _m5dMisch(a, b, u) {
  const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const x = p(a), y = p(b);
  return 'rgb(' + x.map((v, i) => Math.round(v + (y[i] - v) * _m5dKlemme(u))).join(',') + ')';
}
function _m5dGeteilt(z) { return z.phase === 'gruppen' || z.phase === 'lesen' || z.phase === 'gelesen'; }

// Lage aller Ziffern der grossen Zahl. Der rechte Rand steht fest: so bleibt
// der Einer-Block stehen, und alles links davon rueckt auseinander.
function _m5dLage(z) {
  const K = _m5dK, s = String(_m5dORTE[z.ort].zahl), n = s.length, G = Math.ceil(n / 3);
  const rechts = K.MX + (n * K.DW + (G - 1) * K.LUECKE) / 2;
  const off = [0, 0, 0, 0];
  for (let g = 1; g < 4; g++) off[g] = off[g - 1] + (z.auf[g - 1] || 0) * K.LUECKE;
  const ziffern = [];
  for (let i = 0; i < n; i++) {
    const p = n - 1 - i, g = Math.floor(p / 3);
    ziffern.push({ x: rechts - (p + 1) * K.DW - off[g], ch: s[i], p, g });
  }
  const spanne = [];
  for (let g = 0; g < G; g++) {
    const pmax = Math.min(3 * g + 2, n - 1);
    spanne.push([rechts - (pmax + 1) * K.DW - off[g], rechts - 3 * g * K.DW - off[g]]);
  }
  return { s, n, G, ziffern, spanne };
}

// ── Zustand ──────────────────────────────────────────────────────────────
function _m5dInit() {
  _m5d = { ort: 'dortmund', t: 0,
           phase: 'ohne',            // ohne · teilen · gruppen · lesen · gelesen
           schritt: 0, st: 0,        // Animationsschritt und Zeit darin
           auf: [0, 0, 0],           // Oeffnung der Luecken (Grenze Einer|Tausender, …)
           bogen: [0, 0, 0, 0],      // Bogen ueber Gruppe g (0 … 1)
           nachLesen: false,         // „vorlesen“ wartet auf die Gruppen
           lesen: [], li: 0, zwDa: false, gwDa: false,
           gezeigt: '', neuAb: 0,    // Zahlwort bis jetzt, Anfang des neuen Stuecks
           aktiv: -1, aktivName: false,
           ein: 0, schild: 0,
           fx: { teile: [] } };
}
function _m5dHTML() {
  const k = a => `<button class="sim-btn${a === 'dortmund' ? ' primary' : ''}" id="_m5d-b-${a}" onclick="_m5dOrt('${a}')">${_m5dORTE[a].name}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie spricht man die Zahl 83 000 000?</h3>
    <div class="fpm-note" style="margin-top:2px">Wähle einen Ort. Seine Einwohnerzahl steht zuerst ohne Lücken da. Jede Farbe gehört zu einer Gruppe der Stellenwerttafel.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_m5d-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          ${_m5dREIHE.map(k).join('\n          ')}
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_m5d-gruppen" onclick="_m5dGruppen()">Gruppen bilden</button>
          <button class="sim-btn" id="_m5d-lesen" onclick="_m5dVorlesen()">vorlesen</button>
          <button class="sim-btn" onclick="_m5dNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Ort</div>
        <div class="lmp-status on" id="_m5d-ort" style="margin-top:4px"></div>
        <div class="fpm-label" style="margin-top:10px">Die Zahl</div>
        <div class="lmp-status on" id="_m5d-zahl" style="margin-top:4px"></div>
        <div class="lmp-status on" id="_m5d-gruppe" style="margin-top:6px;display:none"></div>
        <div class="fpm-label" style="margin-top:10px">Zahlwort</div>
        <div class="lmp-status on" id="_m5d-wort" style="margin-top:4px"></div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Dortmund, Zahl ohne Lücken</p>
  </div>`;
}
function _m5dStatus() {
  if (!_m5d) return;
  const z = _m5d, d = _m5dORTE[z.ort], geteilt = _m5dGeteilt(z);
  const G = Math.ceil(String(d.zahl).length / 3);
  const setze = (id, txt) => { const e = document.getElementById(id); if (e) e.textContent = txt; return e; };
  setze('_m5d-ort', d.ort);
  setze('_m5d-zahl', geteilt ? 'Zahl mit Lücken: ' + _m5dMitLuecken(d.zahl)
                             : 'Zahl ohne Lücken: ' + String(d.zahl));
  const gr = setze('_m5d-gruppe', geteilt ? 'Linke Gruppe: ' + _m5dGRUPPE[G - 1].name : '');
  if (gr) gr.style.display = geteilt ? '' : 'none';
  setze('_m5d-wort', 'So spricht man sie: ' + (z.phase === 'gelesen' ? _m5dWort(d.zahl) : '…'));
  for (const a of _m5dREIHE) {
    const b = document.getElementById('_m5d-b-' + a);
    if (b && b.classList) b.classList.toggle('primary', a === z.ort);
  }
  // Der Knopf fuer den naechsten sinnvollen Schritt ist hervorgehoben.
  const bg = document.getElementById('_m5d-gruppen'), bl = document.getElementById('_m5d-lesen');
  if (bg && bg.classList) bg.classList.toggle('primary', z.phase === 'ohne' || z.phase === 'teilen');
  if (bl && bl.classList) bl.classList.toggle('primary', !(z.phase === 'ohne' || z.phase === 'teilen'));
}

// ── Bedienung ────────────────────────────────────────────────────────────
function _m5dOrt(a) {
  if (!_m5d || !_m5dORTE[a]) return;
  _m5dInit();
  _m5d.ort = a;
  _m5dStatus();
}
function _m5dNeu() {
  if (!_m5d) return;
  _m5dInit();
  _m5dStatus();
}
function _m5dGruppen() {
  if (!_m5d) return;
  const z = _m5d;
  if (z.phase === 'ohne') { z.phase = 'teilen'; z.schritt = 0; z.st = 0; _m5dStatus(); return; }
  // Schon geteilt: nur noch einmal auf die Gruppe ganz links zeigen.
  if (z.phase === 'gruppen' || z.phase === 'gelesen') _m5dRing();
}
function _m5dVorlesen() {
  if (!_m5d) return;
  const z = _m5d;
  if (z.phase === 'ohne') { z.nachLesen = true; _m5dGruppen(); return; }
  if (z.phase === 'teilen') { z.nachLesen = true; return; }
  if (z.phase === 'lesen') return;
  _m5dLos();                                   // geteilt oder schon gelesen: (noch einmal) vorlesen
}
function _m5dLos() {
  const z = _m5d;
  z.phase = 'lesen'; z.lesen = _m5dTeile(_m5dORTE[z.ort].zahl);
  z.li = 0; z.st = 0; z.zwDa = false; z.gwDa = false;
  z.gezeigt = ''; z.neuAb = 0; z.aktiv = -1; z.aktivName = false;
  _m5dStatus();
}
function _m5dRing() {
  const z = _m5d, L = _m5dLage(z), sp = L.spanne[L.G - 1];
  _bioFxWelle(z.fx.teile, (sp[0] + sp[1]) / 2, _m5dK.BL + 2, '#fcd34d', 40);
}

// ── Ablauf ───────────────────────────────────────────────────────────────
function _m5dUpdate(dt) {
  if (!_m5d) return;
  dt = _bioFxDt(dt);
  const z = _m5d, K = _m5dK;
  const G = Math.ceil(String(_m5dORTE[z.ort].zahl).length / 3);
  z.t += dt;
  z.ein = Math.min(1, z.ein + dt / K.EIN);
  z.schild = Math.min(1, z.schild + dt / 0.35);
  if (z.phase === 'teilen') {
    z.st += dt;
    const k = z.schritt, u = _m5dKlemme(z.st / K.SCHRITT);
    z.bogen[k] = u;
    if (k < G - 1) z.auf[k] = _m5dSanft(u);
    if (u >= 1) {
      z.schritt++; z.st = 0;
      if (z.schritt >= G) {
        z.phase = 'gruppen';
        _m5dRing();
        if (z.nachLesen) { z.nachLesen = false; _m5dLos(); }
        else _m5dStatus();
      }
    }
  } else if (z.phase === 'lesen') {
    const teil = z.lesen[z.li];
    if (!teil) {
      z.phase = 'gelesen'; z.aktiv = -1; z.aktivName = false; _m5dStatus();
    } else {
      if (!z.zwDa) {                           // Ziffern der Gruppe sprechen
        z.zwDa = true; z.aktiv = teil.g; z.aktivName = false;
        z.neuAb = z.gezeigt.length; z.gezeigt += teil.zw;
      }
      z.st += dt;
      if (!z.gwDa && z.st >= K.LESEN / 2) {   // dann den Namen der Gruppe
        z.gwDa = true; z.aktivName = true;
        if (teil.gw) { z.neuAb = z.gezeigt.length; z.gezeigt += teil.gw; }
      }
      if (z.st >= K.LESEN) {
        z.li++; z.st = 0; z.zwDa = false; z.gwDa = false;
        if (z.li >= z.lesen.length) { z.phase = 'gelesen'; z.aktiv = -1; z.aktivName = false; _m5dStatus(); }
      }
    }
  }
  _bioFxUpdate(z.fx.teile, dt);
}

// ── Zeichnen ─────────────────────────────────────────────────────────────
function _m5dText(ctx, s, x, y, groesse, farbe, ausr, grund) {
  ctx.font = '700 ' + groesse + 'px sans-serif';
  ctx.fillStyle = farbe || '#1f2937';
  ctx.textAlign = ausr || 'center';
  ctx.textBaseline = grund || 'alphabetic';
  ctx.fillText(s, x, y);
}
function _m5dSchild(ctx) {
  const z = _m5d, d = _m5dORTE[z.ort];
  const e = _m5dSanft(z.schild);
  ctx.font = '700 16px sans-serif';
  const w = ctx.measureText(d.name).width + 44, h = 28;
  const x = 210 - w / 2, y = 6 - (1 - e) * 34;
  ctx.save();
  ctx.globalAlpha = _m5dKlemme(z.schild * 1.6);
  ctx.fillStyle = '#fde68a';
  _bioFxRundRect(ctx, x, y, w, h, 5); ctx.fill();
  ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 2;
  _bioFxRundRect(ctx, x, y, w, h, 5); ctx.stroke();
  ctx.lineWidth = 1;
  _bioFxRundRect(ctx, x + 4, y + 4, w - 8, h - 8, 3); ctx.stroke();
  _m5dText(ctx, d.name, 210, y + h / 2 + 1, 16, '#111827', 'center', 'middle');
  ctx.restore();
}
// Wie weit ist Ziffer p hereingefallen? (0 … 1, Einer zuerst)
function _m5dFall(z, p) { return _m5dSanft((z.ein * _m5dK.EIN - p * 0.04) / 0.3); }

function _m5dZahl(ctx) {
  const z = _m5d, K = _m5dK, L = _m5dLage(z);
  // Leuchten hinter der Gruppe, die gerade gesprochen wird
  if (z.aktiv >= 0 && L.spanne[z.aktiv]) {
    const sp = L.spanne[z.aktiv], F = _m5dGRUPPE[z.aktiv].farbe;
    const puls = 0.55 + 0.25 * Math.sin(z.t * Math.PI * 2 * 0.8);
    ctx.save();
    ctx.globalAlpha = puls;
    ctx.fillStyle = F[0];
    _bioFxRundRect(ctx, sp[0] - 5, K.ZY - 30, sp[1] - sp[0] + 10, 38, 8); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = F[1]; ctx.lineWidth = 2;
    _bioFxRundRect(ctx, sp[0] - 5, K.ZY - 30, sp[1] - sp[0] + 10, 38, 8); ctx.stroke();
    ctx.restore();
  }
  // Boegen mit dem Namen der Gruppe
  for (let g = 0; g < L.G; g++) {
    const b = z.bogen[g];
    if (!(b > 0)) continue;
    const F = _m5dGRUPPE[g].farbe, sp = L.spanne[g];
    // Mindestbreite 34 px: ueber einer einzelnen Ziffer saehe der Bogen sonst wie ein Haken aus.
    const xm = (sp[0] + sp[1]) / 2, hb = Math.max(17, (sp[1] - sp[0]) / 2 - 3);
    const xr = xm + hb, xl = xm - hb, cy = 2 * K.BY1 - K.BY0;
    ctx.save();
    ctx.strokeStyle = F[2]; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xr, K.BY0 + 4);
    ctx.lineTo(xr, K.BY0);
    const n = 16;
    for (let i = 1; i <= n; i++) {
      const t = b * i / n, u = 1 - t;
      ctx.lineTo(u * u * xr + 2 * u * t * xm + t * t * xl, u * u * K.BY0 + 2 * u * t * cy + t * t * K.BY0);
    }
    if (b >= 1) ctx.lineTo(xl, K.BY0 + 4);
    ctx.stroke();
    const a = _m5dKlemme((b - 0.35) / 0.65);
    if (a > 0) {
      ctx.globalAlpha = a;
      if (z.aktiv === g && z.aktivName) {
        ctx.font = '700 12px sans-serif';
        const lw = ctx.measureText(_m5dGRUPPE[g].name).width + 12;
        ctx.fillStyle = F[0];
        _bioFxRundRect(ctx, xm - lw / 2, K.BL - 9, lw, 18, 9); ctx.fill();
        ctx.strokeStyle = F[1]; ctx.lineWidth = 1.5;
        _bioFxRundRect(ctx, xm - lw / 2, K.BL - 9, lw, 18, 9); ctx.stroke();
      }
      _m5dText(ctx, _m5dGRUPPE[g].name, xm, K.BL + 1, 12, F[2], 'center', 'middle');
    }
    ctx.restore();
  }
  // Die Ziffern
  for (const q of L.ziffern) {
    const f = _m5dFall(z, q.p);
    if (f <= 0) continue;
    const farbe = _m5dMisch('#1f2937', _m5dGRUPPE[q.g].farbe[2], z.bogen[q.g]);
    ctx.save();
    ctx.globalAlpha = f;
    _m5dText(ctx, q.ch, q.x + K.DW / 2, K.ZY - (1 - f) * 18, K.ZF, farbe, 'center', 'alphabetic');
    ctx.restore();
  }
}

function _m5dTafel(ctx) {
  const z = _m5d, K = _m5dK, s = String(_m5dORTE[z.ort].zahl), n = s.length;
  const CW = (K.TX1 - K.TX0 - 3 * K.TG) / 12;
  for (let gi = 0; gi < 4; gi++) {
    const g = 3 - gi, F = _m5dGRUPPE[g].farbe;
    const x0 = K.TX0 + gi * (3 * CW + K.TG), x1 = x0 + 3 * CW;
    const an = z.aktiv === g;
    ctx.save();
    ctx.fillStyle = F[0];
    _bioFxRundRect(ctx, x0, K.TY0, x1 - x0, K.TY3 - K.TY0, 6); ctx.fill();
    if (an) {
      ctx.globalAlpha = 0.35 + 0.25 * Math.sin(z.t * Math.PI * 2 * 0.8);
      ctx.fillStyle = '#ffffff';
      _bioFxRundRect(ctx, x0, K.TY2, x1 - x0, K.TY3 - K.TY2, 6); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = an ? F[2] : F[1]; ctx.lineWidth = an ? 2.5 : 1.2;
    _bioFxRundRect(ctx, x0, K.TY0, x1 - x0, K.TY3 - K.TY0, 6); ctx.stroke();
    // Kopf: Name der Gruppe, darunter H Z E
    _m5dText(ctx, _m5dGRUPPE[g].name, (x0 + x1) / 2, (K.TY0 + K.TY1) / 2 + 1, 12, F[2], 'center', 'middle');
    ctx.strokeStyle = F[1]; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, K.TY1); ctx.lineTo(x1, K.TY1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0, K.TY2); ctx.lineTo(x1, K.TY2); ctx.stroke();
    for (let j = 1; j < 3; j++) {
      ctx.beginPath(); ctx.moveTo(x0 + j * CW, K.TY1); ctx.lineTo(x0 + j * CW, K.TY3); ctx.stroke();
    }
    for (let j = 0; j < 3; j++) {
      const xc = x0 + (j + 0.5) * CW;
      _m5dText(ctx, ['H', 'Z', 'E'][j], xc, (K.TY1 + K.TY2) / 2 + 1, 12, F[2], 'center', 'middle');
      const p = g * 3 + (2 - j);
      if (p >= n) continue;                    // fuehrende Stellen bleiben leer
      const f = _m5dFall(z, p);
      if (f <= 0) continue;
      ctx.globalAlpha = f;
      _m5dText(ctx, s[n - 1 - p], xc, K.TY3 - 9 - (1 - f) * 6, 20, '#1f2937', 'center', 'alphabetic');
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
}

function _m5dWortZeile(ctx) {
  const z = _m5d, K = _m5dK, liest = z.phase === 'lesen';
  // Lautsprecher
  const lx = 30, ly = K.WY - 7;
  ctx.save();
  ctx.fillStyle = liest ? '#334155' : '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(lx, ly - 5); ctx.lineTo(lx + 7, ly - 5); ctx.lineTo(lx + 15, ly - 12);
  ctx.lineTo(lx + 15, ly + 12); ctx.lineTo(lx + 7, ly + 5); ctx.lineTo(lx, ly + 5);
  ctx.closePath(); ctx.fill();
  if (liest) {
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) {
      const u = (z.t * 1.4 + i * 0.5) % 1;
      ctx.globalAlpha = 1 - u;
      ctx.beginPath(); ctx.arc(lx + 16, ly, 5 + 9 * u, -0.9, 0.9); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // Schreiblinie
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(K.WX, K.WY + 8); ctx.lineTo(392, K.WY + 8); ctx.stroke();
  // Das Zahlwort, so weit es schon gesprochen ist
  if (z.gezeigt) {
    _m5dText(ctx, z.gezeigt, K.WX, K.WY, 20, '#1f2937', 'left', 'alphabetic');
    if (liest && z.aktiv >= 0) {
      ctx.font = '700 20px sans-serif';
      // Unterstrichen wird nur das neue Stueck, ohne sein Leerzeichen davor.
      const vorn = z.gezeigt.slice(0, z.neuAb) + (z.gezeigt[z.neuAb] === ' ' ? ' ' : '');
      const a = z.neuAb ? ctx.measureText(vorn).width : 0;
      const b = ctx.measureText(z.gezeigt).width;
      ctx.strokeStyle = _m5dGRUPPE[z.aktiv].farbe[1]; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(K.WX + a, K.WY + 6); ctx.lineTo(K.WX + b, K.WY + 6); ctx.stroke();
    }
  }
  ctx.restore();
}

function _m5dDraw(ctx, cv) {
  if (!_m5d) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f8fafc'); bg.addColorStop(1, '#eef2f7');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  _m5dSchild(ctx);
  _m5dZahl(ctx);
  _m5dTafel(ctx);
  _m5dWortZeile(ctx);
  _bioFxDraw(ctx, _m5d.fx.teile);
}
