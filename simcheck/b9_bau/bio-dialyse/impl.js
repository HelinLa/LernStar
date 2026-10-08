// ═══════════════════════════════════════════════════════════════════════
// BIO 9 FOERDER · BLUTWÄSCHE: WIE OFT IN DER WOCHE?   (Förderheft Bio 9 · bd3)
// Kennung bio-dialyse, Präfix _n9j. Bauplan: arbeitsheft_bio_foe9/einheiten/
// bd3.json, seite.sim_plan.
//
// WAS MAN SIEHT (Leinwand 420 x 250):
//   oben   ein Wochenkalender mit sieben Feldern „Mo“ … „So“. Dialysetage
//          tragen von Anfang an ein kleines Maschinen-Bild (grau und
//          hellblau, NICHT rot – sonst hält man den Dialysetag für einen
//          roten Tag, die Stolperstelle aus dem Lehrerteil).
//          1-mal: Montag · 3-mal: Montag, Mittwoch, Freitag.
//   darunter die Kurve „Harnstoff-Punkte im Blut“, genau unter den Feldern
//          (eine Spalte je Tag), Achse 0 bis 18, beschriftet 0, 2, … 16.
//          Grüner Bereich unter 8, roter Bereich ab 8 (rote Linie, „8“ rot).
//          Das letzte Drittel jeder Spalte ist leicht abgedunkelt: der Abend.
//   an Dialysetagen erscheint am Abend ein Bild (Sprechblase, zeigt auf das
//          Kalenderfeld): Arm, roter Schlauch hinein, liegender Zylinder mit
//          drei roten Röhrchen, außen herum hellblaue Spülflüssigkeit,
//          dunkelroter Schlauch zurück in den Arm, Maschine mit leerem
//          Bildschirm und Pumpenrad. Das Blut fließt (Rad dreht sich), gelbe
//          Punkte kommen mit dem Blut an, treten aus den Röhrchen in die
//          hellblaue Flüssigkeit und werden zur Maschine getragen. Wie viele
//          gelbe Punkte ankommen, richtet sich nach der Kurve: viel Harnstoff,
//          viele Punkte. Das Bild steht nur im oberen Teil der Kurvenfläche;
//          dort ist die Kurve an Dialyseabenden nie (höchstens 6 Punkte).
//
// BEDIENUNG (wörtlich):
//   „Dialyse in der Woche“: „keine“ · „1-mal“ · „3-mal“
//            (Wahlgruppe _n9jWahl('keine'|'ein'|'drei')); Start „keine“.
//   „▶ 1 Woche abspielen“ (_n9jAbspielen) · „neu“ (_n9jNeu → „keine“).
//   Umstellen beendet die laufende Woche und leert Kalender und Kurve.
//   „▶“ während der Woche bewirkt nichts; nach dem Ende spielt es die Woche
//   noch einmal von Montag an.
//
// MODELL (Modellwerte, Lehrerteil): Montag früh 2 Punkte. Jeder Tag: +2
//   Punkte (Spalte 0 … 0,7, gleichmäßig), dann der Abend (0,7 … 1,0): ohne
//   Dialyse bleibt die Kurve stehen, mit Dialyse fällt sie auf 2 Punkte. Am
//   Ende des Tages färbt sich das Feld: rot, wenn die Kurve bei 8 Punkten
//   oder darüber liegt, sonst grün.
//   WERTE (sim_plan, nachgerechnet mit _n9jErgebnis() am GEZEICHNETEN Bild):
//     keine  4, 6, 8, 10, 12, 14, 16  rot Mi–So (5 Tage)   Sonntag 16
//     1-mal  2, 4, 6,  8, 10, 12, 14  rot Do–So (4 Tage)   Sonntag 14
//     3-mal  2, 4, 2,  4,  2,  4,  6  kein Tag rot (0)     Sonntag  6
//
// ZEITPLAN eines Tages (s): Anstieg 0,46 · Abend 0,12 (mit Dialyse 0,90:
//   0,08 Bild erscheint, 0,66 Fallen, 0,16 Ruhe) · Feld färbt sich, 0,10.
//   Woche: keine 4,76 s · 1-mal 5,54 s · 3-mal 7,10 s.
//   Warum so knapp: simfakten.js fährt eine Wahlgruppe mit höchstens acht
//   Knopfdrücken zu je 62 Frames (≈ 7,9 s) und bricht ab, wenn die Anzeige rund
//   0,5 s gleich bleibt. Die Statuszeile ändert sich deshalb spätestens nach
//   0,41 s (Tag, Abend, ganze Punkte), und die längste Woche endet vor 7,9 s.
//   So steht das Ende JEDER Einstellung auch im Dump mit Voreinstellungen.
//
// STATUSZEILE (_n9j-status):
//   vorher   „Dialyse in der Woche: keine“ (bzw. 1-mal, 3-mal)
//   Woche    „Dienstag · Harnstoff-Punkte im Blut: 5“, am Dialyseabend
//            „Montagabend · Dialyse · Harnstoff-Punkte im Blut: 3“
//            (ganze Punkte: beim Anstieg abgerundet, beim Fallen aufgerundet –
//            eine Zahl erscheint erst, wenn die Kurve sie erreicht hat)
//   danach   der Zähler „Harnstoff-Punkte am Sonntag: 16“ (14 / 6)
//   KEIN Zähler für rote Tage – auch nicht im Hinweis, nicht im Bild.
// HINWEIS (_n9j-hinweis):
//   vorher   „Dialyse in der Woche: „keine“. Drücke „▶ 1 Woche abspielen“.“
//   Woche    „Die Woche läuft. Sieh auf die Kurve und auf den Kalender.“
//   danach   „Die Woche mit „keine“ ist zu Ende. Lies den Zähler ab. Zähle die
//            roten Tage im Kalender.“
// IM BILD: „Mo“ … „So“, Achsenzahlen, „Harnstoff-Punkte im Blut“, „Dialyse“
//   und „Arm“ im Bild der Maschine, am Ende der Wert vom Sonntag („16“) in
//   einem Kästchen rechts neben dem Kurvenende (freier Rand x 384 … 420 –
//   über der Kurve lag es bei „3-mal“ auf der roten Linie).
//
// AHA (_bioFx, ohne Text): Jedes Feld bekommt beim Färben einen ruhigen Ring
//   in seiner Farbe. Bei „1-mal“ sieht man, wie die Kurve nach dem Montag
//   wieder in den roten Bereich läuft (Vermutung 1 widerlegt); bei „3-mal“
//   holt jede Dialyse sie zurück, am Ende grüne Funken über dem Kalender.
//   Sonst am Ende ein ruhiger roter Ring am Ende der Kurve.
//
// NICHT AM BILDSCHIRM: „Niere“, „Nieren“, „steigt“, „sinkt“, „Filter“,
//   „Stunden“ (auch nicht als Wortteil) und aus Hilfe 3 „jeden Tag“,
//   „ständig“, „die ganze Zeit“. Kein Name, keine Nadel, keine Person.
//   Deterministisch, ohne Zufall (außer den Funken der Effektbibliothek).
// ═══════════════════════════════════════════════════════════════════════
let _n9j = null;
const _N9J_WAHL = { keine: 'keine', ein: '1-mal', drei: '3-mal' };
const _N9J_DIA = { keine: [], ein: [0], drei: [0, 2, 4] };      // Tage mit Dialyse, 0 = Montag
const _N9J_TAG = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const _N9J_KURZ = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const _N9J_START = 2, _N9J_PRO_TAG = 2, _N9J_NACH = 2, _N9J_ROT = 8, _N9J_VMAX = 18;
// Zeitplan in s
const _N9J_STEIG = 0.46, _N9J_ABEND = 0.12, _N9J_PAUSE = 0.10;
const _N9J_DIAL = 0.90, _N9J_AUF = 0.08, _N9J_FALL = 0.66;
// Bildaufbau
const _N9J_X0 = 34, _N9J_CW = 50, _N9J_X1 = _N9J_X0 + 7 * _N9J_CW;   // 34 … 384; rechts davon
                                                                     // steht am Ende der Wert vom Sonntag
const _N9J_YT = 54, _N9J_YB = 234;                                   // 10 Bildpunkte je Punkt
const _N9J_KY = 4, _N9J_KH = 40;                                     // Kalenderfelder
const _N9J_ANT = 0.7, _N9J_FX = 0.92;          // Tag bis 0,7 der Spalte; Fallen endet bei 0,92
// Bild der Maschine (Sprechblase), eigene Koordinaten 0 … BW / 0 … BH
const _N9J_BW = 186, _N9J_BH = 82, _N9J_BY = 58;
const _N9J_FASER = [27, 33, 39];                // drei Röhrchen im Zylinder
const _N9J_VB = 140, _N9J_VF = 60;             // Blut und Spülflüssigkeit in Bildpunkten je s

function _n9jY(v) { return _N9J_YB - v * (_N9J_YB - _N9J_YT) / _N9J_VMAX; }

// Fahrplan einer Woche: Stützpunkte der Kurve {t, x, v} und je Tag die Zeiten.
function _n9jPlan(w) {
  const dia = _N9J_DIA[w], keys = [], tage = [];
  let t = 0, v = _N9J_START;
  for (let d = 0; d < 7; d++) {
    const x0 = _N9J_X0 + d * _N9J_CW, xa = x0 + _N9J_ANT * _N9J_CW, x1 = x0 + _N9J_CW;
    const tag = { d, t0: t, v0: v, dialyse: dia.indexOf(d) >= 0 };
    keys.push({ t, x: x0, v });
    t += _N9J_STEIG; v += _N9J_PRO_TAG;
    keys.push({ t, x: xa, v });
    tag.tAbend = t; tag.spitze = v;
    if (tag.dialyse) {
      keys.push({ t: t + _N9J_AUF, x: xa + 0.03 * _N9J_CW, v });
      v = _N9J_NACH;
      keys.push({ t: t + _N9J_AUF + _N9J_FALL, x: x0 + _N9J_FX * _N9J_CW, v });
      tag.ta = t + 0.04; tag.tb = t + _N9J_AUF + _N9J_FALL;     // Maschine läuft
      t += _N9J_DIAL;
    } else t += _N9J_ABEND;
    keys.push({ t, x: x1, v });
    tag.tFarbe = t; tag.ende = v; tag.rot = v >= _N9J_ROT;
    t += _N9J_PAUSE;
    keys.push({ t, x: x1, v });                                  // der Stift wartet
    tag.t1 = t;
    tage.push(tag);
  }
  return { keys, tage, dauer: t };
}

function _n9jInit() {
  _n9j = { wahl: 'keine', t: 0 };
  _n9jRuhe();
}
function _n9jRuhe() {
  _n9j.plan = _n9jPlan(_n9j.wahl);
  _n9j.phase = 'bereit'; _n9j.s = 0; _n9j.ev = {}; _n9j.fx = { teile: [] };
  _n9j.letzt = ''; _n9j.gemalt = null;
}

// ── Bedienung ──────────────────────────────────────────
function _n9jWahl(w) {
  if (!_n9j || !_N9J_WAHL[w]) return;
  _n9j.wahl = w;
  _n9jRuhe();
  _n9jStatus();
}
function _n9jAbspielen() {
  if (!_n9j || _n9j.phase === 'lauf') return;
  _n9jRuhe();
  _n9j.phase = 'lauf';
  _n9jStatus();
}
function _n9jNeu() {
  if (!_n9j) return;
  _n9j.wahl = 'keine';
  _n9jRuhe();
  _n9jStatus();
}

// ── Wo steht der Stift? ────────────────────────────────
function _n9jStift(s) {
  const k = _n9j.plan.keys;
  if (s <= k[0].t) return { x: k[0].x, v: k[0].v, i: 0, fallend: false };
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i], b = k[i + 1];
    if (s <= b.t) {
      const u = b.t > a.t ? (s - a.t) / (b.t - a.t) : 1;
      return { x: a.x + (b.x - a.x) * u, v: a.v + (b.v - a.v) * u, i, fallend: b.v < a.v };
    }
  }
  const z = k[k.length - 1];
  return { x: z.x, v: z.v, i: k.length - 1, fallend: false };
}
function _n9jHeute(s) {
  const tage = _n9j.plan.tage;
  for (const g of tage) if (s < g.t1) return g;
  return tage[tage.length - 1];
}

// ── Anzeige ────────────────────────────────────────────
function _n9jZeile() {
  const name = _N9J_WAHL[_n9j.wahl];
  if (_n9j.phase === 'bereit') return 'Dialyse in der Woche: ' + name;
  if (_n9j.phase === 'fertig') return 'Harnstoff-Punkte am Sonntag: ' + _n9j.plan.tage[6].ende;
  const s = _n9j.s, g = _n9jHeute(s), p = _n9jStift(s);
  const n = p.fallend ? Math.ceil(p.v - 1e-9) : Math.floor(p.v + 1e-9);
  const abend = g.dialyse && s >= g.tAbend;
  // „Montagabend“ in einem Wort (Duden), nicht „Montag Abend“
  return _N9J_TAG[g.d] + (abend ? 'abend · Dialyse' : '') + ' · Harnstoff-Punkte im Blut: ' + n;
}
function _n9jHinweis() {
  const name = _N9J_WAHL[_n9j.wahl];
  if (_n9j.phase === 'lauf') return 'Die Woche läuft. Sieh auf die Kurve und auf den Kalender.';
  if (_n9j.phase === 'fertig') return 'Die Woche mit „' + name + '“ ist zu Ende. Lies den Zähler ab. Zähle die roten Tage im Kalender.';
  return 'Dialyse in der Woche: „' + name + '“. Drücke „▶ 1 Woche abspielen“.';
}
function _n9jStatus() {
  if (!_n9j) return;
  const z = _n9jZeile();
  const el = document.getElementById('_n9j-status');
  if (el) { el.textContent = z; el.className = 'lmp-status on'; }
  _n9j.letzt = z;
  const h = document.getElementById('_n9j-hinweis');
  if (h) h.textContent = _n9jHinweis();
  try {
    document.querySelectorAll('[data-n9j]').forEach(b => {
      if (b.classList) b.classList.toggle('primary', b.getAttribute('data-n9j') === _n9j.wahl);
    });
  } catch (e) { /* Knopffarbe ist Beiwerk */ }
  const los = document.getElementById('_n9j-los');
  if (los && los.classList) los.classList.toggle('primary', _n9j.phase !== 'lauf');
}
function _n9jHTML() {
  const k = w => `<button class="sim-btn" data-n9j="${w}" onclick="_n9jWahl('${w}')">${_N9J_WAHL[w]}</button>`;
  return `<div class="sim-box sim-box-wide fpm-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Wie oft in der Woche ist die Dialyse nötig?</h3>
    <div class="fpm-note" style="margin-top:2px">Eine Woche eines Menschen an der Dialyse, im Zeitraffer. Oben der Kalender, darunter die Kurve: So viel Harnstoff ist in seinem Blut.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="_n9j-cv" width="420" height="250" class="phys-anim-cv"></canvas>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="_n9j-los" onclick="_n9jAbspielen()">▶ 1 Woche abspielen</button>
          <button class="sim-btn" onclick="_n9jNeu()">neu</button>
        </div>
      </div>
      <div>
        <div class="phys-ctrl">
          <span class="phys-ctrl-label">Dialyse in der Woche</span>
          <div class="sim-btn-row">${k('keine')}${k('ein')}${k('drei')}</div>
        </div>
        <div class="lmp-status on" id="_n9j-status" style="margin-top:8px"></div>
        <div class="fpm-note" id="_n9j-hinweis" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:10px">Grüner Bereich: wenig Harnstoff im Blut. Roter Bereich (ab 8 Punkten): zu viel Harnstoff im Blut. Dunkler Streifen: Abend. Im Bild der Maschine ist rot das Blut, hellblau die Spülflüssigkeit, und die gelben Punkte sind Harnstoff.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">Start: Dialyse in der Woche „keine“ &nbsp;|&nbsp; Montag früh: 2 Harnstoff-Punkte im Blut</p>
  </div>`;
}

// ── Ablauf ─────────────────────────────────────────────
function _n9jUpdate(dt) {
  if (!_n9j) return;
  dt = _bioFxDt(dt);
  _n9j.t += dt;
  if (_n9j.phase === 'lauf') {
    _n9j.s += dt;
    _n9jEreignisse();
    if (_n9j.s >= _n9j.plan.dauer) {
      _n9j.s = _n9j.plan.dauer;
      _n9j.phase = 'fertig';
      _n9jSchluss();
      _n9jStatus();
    } else if (_n9jZeile() !== _n9j.letzt) _n9jStatus();
  }
  _bioFxAlleUpdate(_n9j.fx, dt);
}
// Ein ruhiger Ring, sobald sich ein Feld färbt – in seiner eigenen Farbe.
function _n9jEreignisse() {
  const s = _n9j.s, ev = _n9j.ev;
  for (const g of _n9j.plan.tage) {
    if (!ev['f' + g.d] && s >= g.tFarbe) {
      ev['f' + g.d] = true;
      const f = _n9jFeld(g.d);
      _bioFxWelle(_n9j.fx.teile, f.x + f.w / 2, f.y + f.h / 2, g.rot ? '#ef4444' : '#22c55e', 22);
    }
  }
}
function _n9jSchluss() {
  const p = _n9j.plan, z = p.keys[p.keys.length - 1], fx = _n9j.fx;
  const rote = p.tage.filter(g => g.rot).length;
  if (rote === 0) {
    for (let d = 0; d < 7; d += 2) {
      const f = _n9jFeld(d);
      _bioFxFunken(fx.teile, f.x + f.w / 2, f.y + f.h / 2, 5, ['#86efac', '#ffffff', '#4ade80', '#bbf7d0']);
    }
    _bioFxWelle(fx.teile, z.x, _n9jY(z.v), '#22c55e', 22);
  } else {
    _bioFxWelle(fx.teile, z.x, _n9jY(z.v), '#ef4444', 22);
  }
}

// ── Zeichnen ───────────────────────────────────────────
function _n9jFeld(d) {
  return { x: _N9J_X0 + d * _N9J_CW + 2, y: _N9J_KY, w: _N9J_CW - 4, h: _N9J_KH };
}
function _n9jKurvenfeld(ctx) {
  const X0 = _N9J_X0, X1 = _N9J_X1, YT = _N9J_YT, YB = _N9J_YB, y8 = _n9jY(_N9J_ROT);
  ctx.fillStyle = '#fee2e2'; ctx.fillRect(X0, YT, X1 - X0, y8 - YT);
  ctx.fillStyle = '#dcfce7'; ctx.fillRect(X0, y8, X1 - X0, YB - y8);
  // Abend: das letzte Drittel jeder Spalte leicht abgedunkelt
  ctx.fillStyle = 'rgba(51,65,85,0.07)';
  for (let d = 0; d < 7; d++) {
    const xa = _N9J_X0 + (d + _N9J_ANT) * _N9J_CW;
    ctx.fillRect(xa, YT, (1 - _N9J_ANT) * _N9J_CW, YB - YT);
  }
  // Gitter alle 2 Punkte, Tagesgrenzen
  ctx.strokeStyle = 'rgba(100,116,139,0.28)'; ctx.lineWidth = 1;
  for (let v = 2; v <= 16; v += 2) {
    if (v === _N9J_ROT) continue;
    ctx.beginPath(); ctx.moveTo(X0, _n9jY(v)); ctx.lineTo(X1, _n9jY(v)); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(100,116,139,0.45)';
  for (let d = 1; d < 7; d++) {
    const x = X0 + d * _N9J_CW;
    ctx.beginPath(); ctx.moveTo(x, YT); ctx.lineTo(x, YB); ctx.stroke();
  }
  // Grenze zum roten Bereich
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(X0, y8); ctx.lineTo(X1, y8); ctx.stroke();
  // Achsen
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(X0, YT); ctx.lineTo(X0, YB); ctx.lineTo(X1, YB); ctx.stroke();
  // Titel unten, rechts vom Startpunkt (dort ist die Kurve nie: sie fällt nie unter 2)
  ctx.textAlign = 'left';
  ctx.font = '700 11px sans-serif'; ctx.fillStyle = '#14532d';
  ctx.fillText('Harnstoff-Punkte im Blut', X0 + 20, YB - 6);
}
// Achsenzahlen NACH der Kurve, damit der Leuchtpunkt am Start die „2“ nicht verdeckt
function _n9jAchsenzahlen(ctx) {
  ctx.textAlign = 'right';
  for (let v = 0; v <= 16; v += 2) {
    ctx.font = v === _N9J_ROT ? '700 11px sans-serif' : '10px sans-serif';
    ctx.fillStyle = v === _N9J_ROT ? '#b91c1c' : '#334155';
    ctx.fillText(String(v), _N9J_X0 - 6, _n9jY(v) + 4);
  }
  ctx.textAlign = 'left';
}
// Kleines Maschinen-Bild im Kalenderfeld: grau und hellblau, ohne Rot.
function _n9jIkon(ctx, cx, cy) {
  ctx.save();
  ctx.fillStyle = '#bae6fd'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, cx - 13, cy - 5, 9, 12, 3); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(cx - 4, cy + 1); ctx.lineTo(cx - 1, cy + 1); ctx.stroke();
  ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  _bioFxRundRect(ctx, cx - 1, cy - 7, 14, 16, 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx + 1.5, cy - 4.5, 9, 5); ctx.strokeRect(cx + 1.5, cy - 4.5, 9, 5);
  ctx.beginPath(); ctx.arc(cx + 6, cy + 4.5, 2, 0, 2 * Math.PI); ctx.stroke();
  ctx.restore();
}
function _n9jKalender(ctx, s) {
  const p = _n9j.plan, lauf = _n9j.phase === 'lauf', heute = lauf ? _n9jHeute(s).d : -1;
  const gemalt = [];
  for (let d = 0; d < 7; d++) {
    const f = _n9jFeld(d), g = p.tage[d];
    // Einblenden in 0,08 s – kürzer als die Pause danach (0,10 s), sonst
    // bliebe der Sonntag am Ende der Woche nur halb gefärbt.
    const a = s < 0 ? 0 : _n9j.phase === 'fertig' ? 1 : _bioFxKlemme((s - g.tFarbe) / 0.08);
    ctx.fillStyle = '#ffffff';
    _bioFxRundRect(ctx, f.x, f.y, f.w, f.h, 6); ctx.fill();
    if (a > 0) {
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = g.rot ? '#f87171' : '#86efac';
      _bioFxRundRect(ctx, f.x, f.y, f.w, f.h, 6); ctx.fill();
      ctx.restore();
    }
    gemalt.push(a >= 1 ? (g.rot ? 'rot' : 'grün') : 'leer');
    ctx.strokeStyle = d === heute ? '#f59e0b' : (a >= 1 ? (g.rot ? '#b91c1c' : '#15803d') : '#94a3b8');
    ctx.lineWidth = d === heute ? 3 : 1.5;
    _bioFxRundRect(ctx, f.x, f.y, f.w, f.h, 6); ctx.stroke();
    ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#0f172a';
    ctx.fillText(_N9J_KURZ[d], f.x + f.w / 2, f.y + 14);
    if (g.dialyse) _n9jIkon(ctx, f.x + f.w / 2, f.y + 29);
  }
  ctx.textAlign = 'left';
  return gemalt;
}
// Lichtpaket an der Spitze der Kurve
function _n9jLicht(ctx, x, y, k) {
  ctx.save();
  const g = ctx.createRadialGradient(x, y, 0, x, y, 13 * k);
  g.addColorStop(0, 'rgba(255,248,196,0.95)');
  g.addColorStop(0.45, 'rgba(253,224,71,0.6)');
  g.addColorStop(1, 'rgba(250,204,21,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 13 * k, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
}
function _n9jKurve(ctx, s) {
  const k = _n9j.plan.keys, t = _n9j.t;
  const p = s < 0 ? { x: k[0].x, v: k[0].v, i: 0 } : _n9jStift(s);
  const pts = [[k[0].x, _n9jY(k[0].v)]];
  for (let i = 1; i <= p.i; i++) pts.push([k[i].x, _n9jY(k[i].v)]);
  pts.push([p.x, _n9jY(p.v)]);
  if (pts.length > 1) {
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const [farbe, breite] of [['rgba(255,255,255,0.85)', 6], ['#1e293b', 3]]) {
      ctx.strokeStyle = farbe; ctx.lineWidth = breite;
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    }
    ctx.restore();
  }
  const x = p.x, y = _n9jY(p.v);
  if (_n9j.phase === 'bereit') _bioFxLeuchten(ctx, x, y, 9, t, '255,216,77');
  else if (_n9j.phase === 'lauf') _n9jLicht(ctx, x, y, 1);
  else _n9jLicht(ctx, x, y, 0.7 + 0.1 * Math.sin(t * 2.4));
  ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  // Wert vom Sonntag am Ende der Woche: rechts neben dem Kurvenende, im
  // freien Rand – dort liegt weder Kurve noch Grenzlinie.
  if (_n9j.phase === 'fertig') {
    const txt = String(_n9j.plan.tage[6].ende);
    ctx.font = '700 12px sans-serif';
    const w = Math.max(22, ctx.measureText(txt).width + 10), bx = _N9J_X1 + 7;
    ctx.fillStyle = 'rgba(255,255,255,0.96)'; _bioFxRundRect(ctx, bx, y - 9, w, 18, 6); ctx.fill();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2; _bioFxRundRect(ctx, bx, y - 9, w, 18, 6); ctx.stroke();
    ctx.fillStyle = '#0f172a'; ctx.textAlign = 'center';
    ctx.fillText(txt, bx + w / 2, y + 4.5);
    ctx.textAlign = 'left';
  }
  return pts;
}

// ── Bild der Maschine ──────────────────────────────────
function _n9jZufall(i, k) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function _n9jWegLaenge(P) {
  let L = 0;
  for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
  return L;
}
function _n9jAufWeg(P, L) {
  if (L < 0) return null;
  for (let i = 1; i < P.length; i++) {
    const dx = P[i][0] - P[i - 1][0], dy = P[i][1] - P[i - 1][1], l = Math.hypot(dx, dy);
    if (L <= l) { const u = l ? L / l : 0; return [P[i - 1][0] + dx * u, P[i - 1][1] + dy * u]; }
    L -= l;
  }
  return null;
}
function _n9jBlutweg(k) {
  const y = _N9J_FASER[k];
  return [[48, 64], [48, 33], [66, 33], [72, y], [122, y], [128, 33], [134, 33], [134, 58], [56, 58], [56, 64]];
}
const _N9J_REIN = [[48, 64], [48, 33], [66, 33]];
const _N9J_ZURUECK = [[128, 33], [134, 33], [134, 58], [56, 58], [56, 64]];
const _N9J_FRISCH = [[142, 18], [116, 18], [116, 22]];
const _N9J_RAUS = [[78, 22], [78, 11], [142, 11]];
// Gelbe Punkte: geboren am Arm, mit dem Blut in ein Röhrchen; die meisten
// treten unterwegs in die Spülflüssigkeit über und werden zur Maschine
// getragen. Wie dicht sie kommen, folgt der Kurve (viel Harnstoff, viele Punkte).
function _n9jTeilchen(g, tau) {
  const out = [], b0 = g.ta - 0.45, n = Math.ceil((g.tb - b0) / 0.025);
  for (let i = 0; i <= n; i++) {
    const b = b0 + i * 0.025;
    if (b > tau) break;
    const v = b <= g.ta ? g.spitze : _n9jStiftWert(b);
    if (_n9jZufall(i, 0) >= v / 7) continue;
    const k = i % 3, weg = _n9jBlutweg(k), L = (tau - b) * _N9J_VB;
    const raus = _n9jZufall(i, 1) < 0.82;
    const ue = 76 + 40 * _n9jZufall(i, 2);
    const lRaus = _n9jWegLaenge(weg.slice(0, 4)) + (ue - 72);
    if (!raus || L < lRaus) {
      const q = _n9jAufWeg(weg, L);
      if (q) out.push(q);
      continue;
    }
    const yk = _N9J_FASER[k], oben = _n9jZufall(i, 3) < 0.5;
    const yz = Math.min(42, Math.max(24, yk + (oben ? -3 : 3)));
    const fl = [[ue, yk], [ue - 2, yz], [80, yz], [78, 22], [78, 11], [142, 11]];
    const q = _n9jAufWeg(fl, (L - lRaus) * _N9J_VF / _N9J_VB);
    if (q) out.push(q);
  }
  return out;
}
function _n9jStiftWert(s) { return _n9jStift(s).v; }
function _n9jRohr(ctx, P, farbe, breite, laeuft, tau, tempo) {
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = farbe; ctx.lineWidth = breite;
  ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]);
  ctx.stroke();
  // Fließen: wandernde helle Striche
  ctx.setLineDash([3, 6]);
  ctx.lineDashOffset = -tau * tempo;
  ctx.strokeStyle = 'rgba(255,255,255,' + (laeuft ? 0.75 : 0.35) + ')'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
// Deckkraft des Bildes an einem Dialysetag
function _n9jBildAlpha(g, s) {
  if (!g.dialyse || s < g.tAbend) return 0;
  const ein = _bioFxEase.raus(_bioFxKlemme((s - g.tAbend) / 0.12));
  const aus = 1 - _bioFxEase.sanft(_bioFxKlemme((s - g.t1 - 0.22) / 0.25));
  return { a: ein * aus, k: 0.78 + 0.22 * ein };
}
function _n9jMaschinenbild(ctx, s) {
  if (s < 0) return;
  for (const g of _n9j.plan.tage) {
    const z = _n9jBildAlpha(g, s);
    if (!z || z.a <= 0.01) continue;
    const BW = _N9J_BW, BH = _N9J_BH;
    const cx = _N9J_X0 + (g.d + 0.5) * _N9J_CW;
    const bx = Math.max(_N9J_X0 + 4, Math.min(_N9J_X1 - 4 - BW, cx - BW / 2)), by = _N9J_BY;
    const tau = Math.max(g.ta, Math.min(g.tb, s)), laeuft = s >= g.ta && s <= g.tb;
    ctx.save();
    ctx.globalAlpha = z.a;
    ctx.translate(bx + BW / 2, by); ctx.scale(z.k, z.k); ctx.translate(-BW / 2, 0);
    // Sprechblase mit Spitze zum Kalenderfeld
    const px = Math.max(14, Math.min(BW - 14, cx - bx));
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, 0, 0, BW, BH, 10); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px - 8, 1); ctx.lineTo(px, -12); ctx.lineTo(px + 8, 1); ctx.closePath();
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(px - 8, 0); ctx.lineTo(px, -12); ctx.lineTo(px + 8, 0); ctx.stroke();
    ctx.font = '700 10px sans-serif'; ctx.fillStyle = '#0f172a'; ctx.textAlign = 'left';
    ctx.fillText('Dialyse', 8, 14);
    // Arm (heller Umriss)
    ctx.fillStyle = '#f5e6d8'; ctx.strokeStyle = '#a8a29e'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(13, 69, 7, 6, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();   // Hand
    ctx.beginPath();                                                                     // Unterarm
    ctx.moveTo(18, 65.5); ctx.lineTo(62, 62);
    ctx.quadraticCurveTo(69, 62, 69, 69); ctx.quadraticCurveTo(69, 76, 62, 76);
    ctx.lineTo(18, 72.5); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#57534e';
    ctx.fillText('Arm', 26, 72);
    // Spülflüssigkeit hin und zurück (hellblau)
    _n9jRohr(ctx, _N9J_FRISCH, '#7dd3fc', 3, laeuft, tau, 30);
    _n9jRohr(ctx, _N9J_RAUS, '#7dd3fc', 3, laeuft, tau, 30);
    // Blut hinein (rot) und zurück (dunkelrot)
    _n9jRohr(ctx, _N9J_REIN, '#dc2626', 3.5, laeuft, tau, 60);
    _n9jRohr(ctx, _N9J_ZURUECK, '#991b1b', 3.5, laeuft, tau, 60);
    // Zylinder: hellblaue Flüssigkeit, drei rote Röhrchen
    ctx.fillStyle = '#dbeafe'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, 66, 22, 62, 22, 10); ctx.fill();
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1;
    for (let j = 0; j < 4; j++) {                       // Flüssigkeit strömt nach links
      const u = 120 - ((tau * 26 + j * 12) % 46);
      ctx.beginPath(); ctx.moveTo(u, 30); ctx.lineTo(u + 5, 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(u - 6, 36); ctx.lineTo(u - 1, 36); ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (const y of _N9J_FASER) { ctx.beginPath(); ctx.moveTo(71, y); ctx.lineTo(123, y); ctx.stroke(); }
    ctx.lineCap = 'butt';
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, 66, 22, 62, 22, 10); ctx.stroke();
    // Maschine mit leerem Bildschirm und Pumpenrad
    ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
    _bioFxRundRect(ctx, 142, 6, 38, 70, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
    ctx.fillRect(147, 24, 28, 16); ctx.strokeRect(147, 24, 28, 16);
    ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(161, 57, 9, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 1.5;
    for (let j = 0; j < 3; j++) {
      const w = tau * 7 + j * 2 * Math.PI / 3;
      ctx.beginPath(); ctx.moveTo(161, 57); ctx.lineTo(161 + 7 * Math.cos(w), 57 + 7 * Math.sin(w)); ctx.stroke();
    }
    // gelbe Punkte (Harnstoff)
    ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#a16207'; ctx.lineWidth = 0.8;
    for (const q of _n9jTeilchen(g, tau)) {
      ctx.beginPath(); ctx.arc(q[0], q[1], 2.2, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }
}

function _n9jDraw(ctx, cv) {
  if (!_n9j) return;
  const W = cv.width, H = cv.height;
  const s = _n9j.phase === 'bereit' ? -1 : _n9j.s;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
  _n9jKurvenfeld(ctx);
  const felder = _n9jKalender(ctx, s);
  const pts = _n9jKurve(ctx, s);
  _n9jAchsenzahlen(ctx);
  _n9jMaschinenbild(ctx, s);
  _bioFxAlleDraw(ctx, _n9j.fx);
  _n9j.gemalt = { felder, pts };
}

// Nur für den Rechentest, nie am Bildschirm: liest aus dem LETZTEN Bild, was
// wirklich gezeichnet wurde – Kurvenwert am Ende jeder Spalte (aus den
// gezeichneten Bildpunkten zurückgerechnet) und Farbe jedes Feldes.
function _n9jErgebnis() {
  const g = _n9j && _n9j.gemalt;
  if (!g) return '';
  const wert = x => {
    let y = null;
    for (const p of g.pts) if (Math.abs(p[0] - x) < 0.01) y = p[1];   // letzter Punkt an dieser Stelle
    return y === null ? '–' : String(Math.round((_N9J_YB - y) * _N9J_VMAX / (_N9J_YB - _N9J_YT) * 100) / 100);
  };
  const teile = [];
  for (let d = 0; d < 7; d++) teile.push(_N9J_KURZ[d] + ' ' + wert(_N9J_X0 + (d + 1) * _N9J_CW) + ' ' + g.felder[d]);
  return teile.join(' | ') + ' || rote Felder: ' + g.felder.filter(f => f === 'rot').length;
}
