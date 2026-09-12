
// ═══════════════════════════════════════════════════════
// SPANNENERGIE – E = ½ · D · s² ALS FLÄCHE UNTER DER F-s-GERADEN
// Gymnasiale Oberstufe (EF) · Kernlehrplan: "Energie (Lage-, Bewegungs- und
// Spannenergie)".
//
// Die vorhandene Simulation 'federgesetz' zeigt nur das Kraftgesetz F = D · s.
// Hier kommt der Energieteil dazu, und zwar über den Weg, der ihn begründet:
// Die Kraft wächst beim Spannen von 0 auf F. Die verrichtete Arbeit ist deshalb
// nicht F · s, sondern die FLÄCHE unter der F-s-Geraden – ein Dreieck mit der
// Grundseite s und der Höhe F = D · s, also ½ · D · s².
// Daraus folgt der Kern der Seite: doppelte Auslenkung = doppelte Kraft, aber
// vierfache Energie. Im Bild ist das die Zerlegung des großen Dreiecks in vier
// gleiche kleine.
// Der Knopf "Loslassen" schließt die Bilanz: E_Spann wird vollständig zu
// E_Kin = ½ · m · v² eines Wagens mit 0,50 kg, also v = √(2E/m). Die Anschub-
// bewegung ist die echte Viertelschwingung x(t) = s · cos(ωt) mit ω = √(D/m).
//
// GRUNDREGEL DIESER DATEI: Wo ein Rechenweg dasteht, muss das Ergebnis aus den
// ANGEZEIGTEN Zahlen folgen, nicht aus den internen. Deshalb wird überall erst
// formatiert und dann aus dem formatierten Wert weitergerechnet (_speZahl auf
// den fertigen String). Sonst rechnet jemand die Zeile nach, bekommt etwas
// anderes heraus und hält sich für dumm.
// ═══════════════════════════════════════════════════════
let _spe = null;
const _SPE_M = 0.5;            // Wagenmasse in kg (fest)
const _SPE_SMAX = 30;          // größte Auslenkung in cm
const _SPE_SMIN = 0;
const _SPE_DMAX = 60;          // größte Federkonstante in N/m
const _SPE_DMIN = 5;
const _SPE_ROWMAX = 24;        // so viele Zeilen fasst die Wertetabelle
const _SPE_X0 = 132;           // x des entspannten Federendes (Pixel)
const _SPE_WBREIT = 32;        // Wagenlänge in Pixeln
const _SPE_RAILX = 420;        // rechtes Ende der Bahn (Pixel)
const _SPE_XEND = _SPE_RAILX - _SPE_WBREIT;  // so weit darf der Wagen fahren
const _SPE_PXPMS = 90;         // Bahnmaßstab: 1 m/s ≙ 90 Pixel je Sekunde
const _SPE_STAUCH = 72;        // Pixel je 30 cm Auslenkung

function _speInit() {
  _spe = {
    D: 20, s: 10,              // Startwerte: 20 N/m und 10 cm
    t: 0,                      // läuft immer weiter – treibt die Aufbaumarke
    phase: 'gespannt',         // gespannt | schub | rollt | fertig
    pt: 0, wagenX: _SPE_X0,
    hinweis: '',
    rows: [], nextId: 1,
  };
}

// ── Physik ─────────────────────────────────────────────
function _speKraft(D, sCm) { return D * (sCm / 100); }                       // N
function _speEnergie(D, sCm) { return 0.5 * D * (sCm / 100) * (sCm / 100); } // J
function _speTempo(E) { return Math.sqrt(2 * E / _SPE_M); }                  // m/s
function _speOmega(D) { return Math.sqrt(D / _SPE_M); }                      // 1/s
function _speSchubdauer(D) { return (Math.PI / 2) / _speOmega(D); }          // s (Viertelschwingung)

/* Aus einer angezeigten Zahl wieder eine Zahl machen. Jeder Rechenweg dieser
   Simulation setzt hier an: gerechnet wird mit dem, was dasteht. */
function _speZahl(txt) { return parseFloat(String(txt).replace(',', '.')); }

/* Gerundet wird nach der SCHULREGEL, also auf der Dezimalzahl - nicht auf ihrer
   Binärnäherung. 0,5 · 0,09 m · 0,45 N sind genau 0,02025 J, als double aber
   0,020249999999999997; toFixed(4) macht daraus 0,0202, wer von Hand rundet
   schreibt 0,0203. Jede Energie hier ist ein Vielfaches von 0,00025 J, der
   kleinste Abstand zu einer Rundungsgrenze also 0,00005 - die Anhebung um
   1e-9 trifft damit genau die Gleichstände und sonst nichts. */
function _speFmt(x, nk) { return _fpmNum(x > 0 ? x + 1e-9 : x, nk); }

/* Energien reichen von 0,00025 J bis 2,7 J – eine feste Stellenzahl wäre für
   das eine Ende zu grob und für das andere zu genau. */
function _speNkJ(E) {
  return !(E > 0) ? 3 : (E >= 1 ? 2 : (E >= 0.1 ? 3 : (E >= 0.01 ? 4 : 5)));
}
function _speJ(E) {
  if (!(E > 0)) return '0,000';
  return _speFmt(E, _speNkJ(E));
}
/* Zwei Energien, die im selben Satz stehen und um den Faktor 4 auseinander
   liegen, bekommen dieselbe Stellenzahl – und zwar so viele Stellen, dass
   4 · E₁ auch als ANGEZEIGTE Zahl genau E₂ ergibt. Mit je eigener Stellenzahl
   stand hier "0,281 J auf 1,13 J, also auf das Vierfache", und 0,281 · 4 ist
   1,124. Bei 5 Stellen ist jede Energie dieser Simulation exakt (E = D·s²/20000
   mit ganzem s und D als Vielfachem von 5), die Schleife endet also immer. */
function _speNkPaar(E1, E2) {
  let nk = Math.max(_speNkJ(E1), _speNkJ(E2));
  while (nk < 5 && _speFmt(4 * _speZahl(_speFmt(E1, nk)), nk) !== _speFmt(E2, nk)) nk++;
  return nk;
}
/* Das v der Statuszeile folgt aus der ANGEZEIGTEN Energie: wer
   √(2 · 1,15 J / 0,50 kg) nachrechnet, bekommt 2,14 m/s und nicht 2,15. */
function _speTempoAus(D, sCm) { return _speTempo(_speZahl(_speJ(_speEnergie(D, sCm)))); }
/* Die mJ-Klammer rechnet die ANGEZEIGTE Joule-Zahl um, nicht die interne: sonst
   steht "0,0902 J (= 90,3 mJ)" da, und 0,0902 · 1000 sind 90,2. */
function _speMJ(E) {
  const m = _speZahl(_speJ(E)) * 1000;
  return _fpmNum(m, m >= 100 ? 0 : (m >= 10 ? 1 : 2));
}
function _speCm(x) { return _fpmNum(x, Math.abs(x - Math.round(x)) < 1e-9 ? 0 : 1); }

/* Das Paar für die Verdopplungszeile. Beide Werte müssen ganzzahlig und damit
   mit dem Regler einstellbar bleiben – sonst nennt die Statuszeile eine
   Auslenkung, die die Heftseite nachher nicht einstellen kann. Oberhalb von
   15 cm wird deshalb von der halben Auslenkung aus gerechnet. */
function _spePaar() {
  if (2 * _spe.s <= _SPE_SMAX) return { s1: _spe.s, s2: 2 * _spe.s, art: 'direkt' };
  const s1 = Math.floor(_spe.s / 2);
  return { s1: s1, s2: 2 * s1, art: 2 * s1 === _spe.s ? 'halb' : 'nah' };
}

// ── Bedienung ──────────────────────────────────────────
function _speSetD(v) {
  if (!_spe) return;
  let d = Math.round((+v || 0) / 5) * 5;
  if (!isFinite(d)) d = 20;
  _spe.D = Math.max(_SPE_DMIN, Math.min(_SPE_DMAX, d));
  const el = document.getElementById('speDLbl');
  if (el) el.innerHTML = _fpmNum(_spe.D, 0) + ' N/m';
  _speSpannen();
}
function _speSetS(v) {
  if (!_spe) return;
  let s = Math.round(+v || 0);
  if (!isFinite(s)) s = 10;
  _spe.s = Math.max(_SPE_SMIN, Math.min(_SPE_SMAX, s));
  const el = document.getElementById('speSLbl');
  if (el) el.innerHTML = _fpmNum(_spe.s, 0) + ' cm';
  _speSpannen();
}
/* Jede Reglerbewegung spannt die Feder neu – ein rollender Wagen gehört zu
   einer Einstellung, die es dann nicht mehr gibt. */
function _speSpannen() {
  if (!_spe) return;
  _spe.phase = 'gespannt'; _spe.pt = 0; _spe.wagenX = _SPE_X0; _spe.hinweis = '';
  _speStatus();
}
function _speLoslassen() {
  if (!_spe) return;
  const E = _speEnergie(_spe.D, _spe.s);
  if (!(E > 0)) {
    _spe.phase = 'gespannt'; _spe.wagenX = _SPE_X0;
    _spe.hinweis = 'Zum Loslassen brauchst du eine Auslenkung: stelle s größer als 0 cm ein.';
    _speStatus(); return;
  }
  _spe.phase = 'schub'; _spe.pt = 0; _spe.wagenX = _SPE_X0; _spe.hinweis = '';
  _speStatus();
}
function _speMesspunkt() {
  if (!_spe) return;
  const D = _spe.D, s = _spe.s;
  if (_spe.rows.some(r => r.D === D && r.s === s)) {
    _spe.hinweis = 'Dieser Messpunkt steht schon in der Tabelle (D = ' + _fpmNum(D, 0) + ' N/m, s = ' + _fpmNum(s, 0) + ' cm).';
  } else if (_spe.rows.length >= _SPE_ROWMAX) {
    _spe.hinweis = 'Die Tabelle fasst ' + _SPE_ROWMAX + ' Zeilen. Leere sie, um weiterzumessen.';
  } else {
    _spe.rows.push({ id: _spe.nextId++, D: D, s: s, F: _speKraft(D, s), E: _speEnergie(D, s) });
    _spe.rows.sort((a, b) => a.D - b.D || a.s - b.s);
    _spe.hinweis = '';
  }
  _speRenderTabelle();
  _speStatus();
}
function _speDelRow(id) {
  if (!_spe) return;
  _spe.rows = _spe.rows.filter(r => r.id !== id);
  _speRenderTabelle(); _speStatus();
}
function _speTabelleLeeren() {
  if (!_spe) return;
  if (_spe.rows.length && !confirm('Alle ' + _spe.rows.length + ' Messwerte löschen?')) return;
  _spe.rows = []; _spe.hinweis = '';
  _speRenderTabelle(); _speStatus();
}

// ── Wertetabelle und ihre Auswertung ───────────────────
/* Eine Spalte, eine Stellenzahl: die feinste Zeile gibt sie für alle vor.
   Wechselnde Nachkommastellen in derselben Spalte sind in einer Messreihe nicht
   ablesbar - und diese Tabelle soll ins Heft abgeschrieben werden. Die
   Auswertung darunter rechnet mit denselben Stellen, damit beide Stellen
   dieselbe Zahl zeigen. */
function _speNk() {
  let nk = 2;
  for (const r of _spe.rows) {
    const n = !(r.E > 0) ? 2 : _speNkJ(r.E);
    if (n > nk) nk = n;
  }
  /* Steht ein Verdopplungspaar in der Tabelle, muss die Spalte so fein sein,
     dass die Auswertung darunter ("das 4,0-fache") mit den GEDRUCKTEN Zeilen
     aufgeht – sonst ergibt 4 · 0,281 J nicht die 1,125 J der Nachbarzeile. */
  const p = _speFindePaar();
  if (p) nk = Math.max(nk, _speNkPaar(p.a.E, p.b.E));
  return nk;
}
function _speRenderTabelle() {
  if (!_spe) return;
  const tb = document.getElementById('speTbody');
  const leer = document.getElementById('speEmpty');
  if (leer) leer.style.display = _spe.rows.length ? 'none' : 'block';
  if (tb) {
    const nk = _speNk();
    tb.innerHTML = _spe.rows.map((r, i) =>
      `<tr><td>${i + 1}</td><td>${_fpmNum(r.D, 0)}</td><td>${_fpmNum(r.s, 0)}</td>
         <td>${_fpmNum(r.F, 2)}</td><td><b>${_speFmt(r.E, nk)}</b></td>
         <td class="fpm-del" onclick="_speDelRow(${r.id})" title="löschen">✕</td></tr>`).join('');
  }
  const a = document.getElementById('speAusw');
  if (a) a.innerHTML = _speAuswertungHTML();
}

/* Sucht in der Messreihe zwei Zeilen mit gleichem D, bei denen die zweite
   Auslenkung die doppelte der ersten ist. Genau dieses Paar beweist E ~ s². */
function _speFindePaar() {
  const r = _spe.rows;
  for (let i = 0; i < r.length; i++) {
    for (let j = 0; j < r.length; j++) {
      if (i === j) continue;
      if (r[i].D === r[j].D && r[i].s > 0 && Math.abs(r[j].s - 2 * r[i].s) < 1e-9) {
        return { a: r[i], b: r[j], ia: i + 1, ib: j + 1 };
      }
    }
  }
  return null;
}
function _speAuswertungHTML() {
  if (!_spe) return '';
  if (!_spe.rows.length) {
    return 'Noch keine Messwerte. Stelle D und s ein und übernimm den Punkt in die Tabelle. '
         + 'Für den Nachweis E ~ s² brauchst du zu <b>einer</b> Federkonstante mindestens zwei Auslenkungen, '
         + 'von denen eine die doppelte der anderen ist – zum Beispiel 10 cm und 20 cm.';
  }
  const p = _speFindePaar();
  if (p) {
    const qF = p.b.F / p.a.F, qE = p.b.E / p.a.E, nk = _speNk();
    return `<b>Auswertung der Messreihe:</b> Zeile ${p.ia} und Zeile ${p.ib} gehören zur selben Feder `
      + `(D = ${_fpmNum(p.a.D, 0)} N/m), die Auslenkung ist verdoppelt: ${_fpmNum(p.a.s, 0)} cm → ${_fpmNum(p.b.s, 0)} cm.<br>`
      + `Kraft: ${_fpmNum(p.a.F, 2)} N → ${_fpmNum(p.b.F, 2)} N, also das <b>${_fpmNum(qF, 1)}-fache</b>.<br>`
      + `Energie: ${_speFmt(p.a.E, nk)} J → ${_speFmt(p.b.E, nk)} J, also das <b>${_fpmNum(qE, 1)}-fache</b>.<br>`
      + `Das ist der Beleg: F ~ s, aber E ~ s².`;
  }
  const r = _spe.rows;
  const kand = r.find(x => x.s > 0 && 2 * x.s <= _SPE_SMAX) || null;
  if (kand) {
    return `<b>Auswertung:</b> ${r.length} Messwert${r.length === 1 ? '' : 'e'} in der Tabelle. `
      + `Für den Nachweis E ~ s² fehlt noch ein Partner: nimm bei D = ${_fpmNum(kand.D, 0)} N/m auch `
      + `<b>s = ${_fpmNum(2 * kand.s, 0)} cm</b> auf – die doppelte Auslenkung zu Zeile mit ${_fpmNum(kand.s, 0)} cm.`;
  }
  return `<b>Auswertung:</b> ${r.length} Messwerte in der Tabelle. Nimm zu einer Federkonstante zwei `
    + `Auslenkungen auf, von denen eine die doppelte der anderen ist (höchstens ${_SPE_SMAX} cm).`;
}

// ── Statuszeile: die wichtigste Ausgabe dieser Simulation ──
function _speStatus() {
  const el = document.getElementById('speStatus');
  if (!el || !_spe) return;
  const D = _spe.D, sCm = _spe.s, sM = sCm / 100;
  const F = _speKraft(D, sCm), E = _speEnergie(D, sCm), v = _speTempoAus(D, sCm);
  const p = _spePaar();
  const F1 = _speKraft(D, p.s1), F2 = _speKraft(D, p.s2);
  const E1 = _speEnergie(D, p.s1), E2 = _speEnergie(D, p.s2);
  const nkP = _speNkPaar(E1, E2);

  let t = `<b>Federkonstante D = ${_fpmNum(D, 0)} N/m</b> &nbsp;·&nbsp; <b>Auslenkung s = ${_fpmNum(sCm, 0)} cm = ${_fpmNum(sM, 2)} m</b><br><br>`;

  t += `<b>Kraft</b> F = D · s = ${_fpmNum(D, 0)} N/m · ${_fpmNum(sM, 2)} m = <b>${_fpmNum(F, 2)} N</b><br>`;
  t += `<b>Spannenergie</b> E = ½ · D · s² = 0,5 · ${_fpmNum(D, 0)} N/m · (${_fpmNum(sM, 2)} m)² = <b>${_speJ(E)} J</b>`;
  t += (E > 0 && E < 0.1) ? ` &nbsp;(= ${_speMJ(E)} mJ)<br><br>` : `<br><br>`;

  t += `<b>E ist die Fläche</b> unter der F-s-Geraden: ein Dreieck mit der Grundseite s = ${_fpmNum(sM, 2)} m `
     + `und der Höhe F = ${_fpmNum(F, 2)} N.<br>`
     + `½ · Grundseite · Höhe = 0,5 · ${_fpmNum(sM, 2)} m · ${_fpmNum(F, 2)} N = <b>${_speJ(E)} J</b> – dieselbe Zahl. `
     + `(1 N · 1 m = 1 J)<br><br>`;

  if (sCm === 0) {
    t += `<b>Doppelte Auslenkung:</b> Bei s = 0 cm ist die Feder entspannt – F = 0 N und E = 0 J. `
       + `Stelle eine Auslenkung ein, dann steht hier der Vergleich mit der doppelten.<br><br>`;
  } else {
    t += `<b>Doppelte Auslenkung:</b> von s₁ = ${_speCm(p.s1)} cm auf s₂ = ${_speCm(p.s2)} cm. `
       + `Die Kraft wächst von ${_fpmNum(F1, 2)} N auf ${_fpmNum(F2, 2)} N, also auf das <b>Doppelte</b>. `
       + `Die Energie wächst von ${_speFmt(E1, nkP)} J auf ${_speFmt(E2, nkP)} J, also auf das <b>Vierfache</b>. `
       + `Grund: In E = ½ · D · s² steht s im Quadrat.`;
    if (p.art === 'halb') {
      t += ` <i>(Gerechnet ab der halben Auslenkung, weil 2 · ${_fpmNum(sCm, 0)} cm über den Regler hinausginge.)</i>`;
    } else if (p.art === 'nah') {
      t += ` <i>(Zwei einstellbare Werte neben deiner Auslenkung, weil 2 · ${_fpmNum(sCm, 0)} cm über den Regler hinausginge.)</i>`;
    }
    // Sonst stünde oben "2,03 J" und hier "2,02500 J" - derselbe Wert, aber wer
    // das nicht erklärt bekommt, sucht den Fehler bei sich.
    if (nkP > Math.max(_speNkJ(E1), _speNkJ(E2))) {
      t += ` <i>(Beide Energien mit ${_fpmNum(nkP, 0)} Nachkommastellen, damit das Vierfache genau aufgeht.)</i>`;
    }
    t += `<br><br>`;
  }

  t += `<b>Loslassen</b> – Wagen mit m = ${_fpmNum(_SPE_M, 2)} kg: Die Spannenergie wird vollständig zu Bewegungsenergie.<br>`
     + `E<sub>Spann</sub> = E<sub>Kin</sub> &nbsp;⇒&nbsp; ${_speJ(E)} J = ½ · m · v²<br>`
     // Der Radikand ist die ANGEZEIGTE Energie, also muss auch das Ergebnis aus
     // ihr folgen (_speTempoAus). Mit dem exakten E stand bei D = 40 N/m und
     // s = 24 cm "√(2 · 1,15 J / 0,50 kg) = 2,15 m/s" - nachgerechnet 2,14.
     + `v = √(2 · E / m) = √(2 · ${_speJ(E)} J / ${_fpmNum(_SPE_M, 2)} kg) = <b>${_fpmNum(v, 2)} m/s</b><br>`;
  // Die Gegenprobe wird mit dem ABGELESENEN, also gerundeten v gerechnet - sonst
  // steht hier eine Zahl, die beim Nachrechnen auf dem Heft nicht herauskommt.
  const vR = _speZahl(_fpmNum(v, 2)), EG = 0.5 * _SPE_M * vR * vR;
  t += `Gegenprobe mit diesem v: ½ · m · v² = 0,5 · ${_fpmNum(_SPE_M, 2)} kg · (${_fpmNum(vR, 2)} m/s)² = ${_speJ(EG)} J`;
  t += _speJ(EG) === _speJ(E) ? `<br><br>` : ` ≈ ${_speJ(E)} J (der Unterschied kommt nur vom Runden von v)<br><br>`;

  // Bei s = 0 cm ist nichts gespannt - sonst stünde hier "Feder gespannt" neben
  // dem Absatz darüber, der die Feder gerade entspannt genannt hat.
  if (!(E > 0)) {
    t += `Zustand: <b>Feder entspannt</b> – ohne Auslenkung ist keine Energie gespeichert.`;
  } else if (_spe.phase === 'gespannt') {
    t += `Zustand: <b>Feder gespannt</b> – die ganze Energie steckt in der Feder.`;
  } else if (_spe.phase === 'schub') {
    t += `Zustand: <b>Feder entspannt sich</b> – E<sub>Spann</sub> geht in E<sub>Kin</sub> über, die Summe bleibt ${_speJ(E)} J.`;
  } else if (_spe.phase === 'rollt') {
    t += `Zustand: <b>Wagen rollt</b> mit v = ${_fpmNum(v, 2)} m/s. Feder entspannt: E<sub>Spann</sub> = 0 J, E<sub>Kin</sub> = ${_speJ(E)} J.`;
  } else {
    t += `Zustand: <b>Wagen am Bahnende</b>, immer noch v = ${_fpmNum(v, 2)} m/s (reibungsfrei gerechnet). E<sub>Kin</sub> = ${_speJ(E)} J.`;
  }
  if (_spe.hinweis) t += `<br><i>${_spe.hinweis}</i>`;

  el.innerHTML = t;
  el.className = 'lmp-status';
}

// ── Ablauf ─────────────────────────────────────────────
function _speUpdate(dt) {
  if (!_spe) return;
  _spe.t += dt;                       // treibt die Aufbaumarke im Diagramm
  if (_spe.phase === 'schub') {
    _spe.pt += dt;
    if (_spe.pt >= _speSchubdauer(_spe.D)) {
      _spe.pt = 0; _spe.phase = 'rollt'; _spe.wagenX = _SPE_X0; _speStatus();
    }
  } else if (_spe.phase === 'rollt') {
    // Der Wagen rollt mit dem v, das die Statuszeile ausweist - der Fuß des
    // Bildes nennt den Maßstab, also muss die Fahrt zu der Zahl passen.
    _spe.wagenX += _speTempoAus(_spe.D, _spe.s) * _SPE_PXPMS * dt;
    if (_spe.wagenX >= _SPE_XEND) {
      _spe.wagenX = _SPE_XEND; _spe.phase = 'fertig'; _speStatus();
    }
  }
}

// ── Bild ───────────────────────────────────────────────
function _speDraw(ctx, cv) {
  if (!_spe) return;
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

  const D = _spe.D, sCm = _spe.s;
  const F = _speKraft(D, sCm), E = _speEnergie(D, sCm), v = _speTempoAus(D, sCm);
  const Fende = _speKraft(D, _SPE_SMAX);       // Kraft am rechten Achsenende
  const oxL = 52, oxR = W - 16, oyT = 40, oyB = 196;
  const px = c => oxL + (c / _SPE_SMAX) * (oxR - oxL);
  const py = f => oyB - (f / Fende) * (oyB - oyT);

  // Überschrift des Diagramms
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#1e293b'; ctx.font = '700 12px sans-serif';
  ctx.fillText('F-s-Diagramm   F = D · s   mit D = ' + _fpmNum(D, 0) + ' N/m', 14, 16);
  ctx.fillStyle = '#7c3aed'; ctx.font = '700 12px sans-serif';
  ctx.fillText('Fläche unter der Geraden = Spannenergie E = ' + _speJ(E) + ' J', 14, 31);

  // Gitter und Achsen
  ctx.strokeStyle = 'rgba(148,163,184,0.35)'; ctx.lineWidth = 1;
  ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  for (let c = 0; c <= _SPE_SMAX; c += 5) {
    ctx.beginPath(); ctx.moveTo(px(c), oyT); ctx.lineTo(px(c), oyB); ctx.stroke();
    ctx.fillText(String(c), px(c), oyB + 13);
  }
  ctx.textAlign = 'right';
  const dF = Fende / 6;
  for (let i = 0; i <= 6; i++) {
    const f = i * dF;
    ctx.beginPath(); ctx.moveTo(oxL, py(f)); ctx.lineTo(oxR, py(f)); ctx.stroke();
    ctx.fillText(_fpmNum(f, dF < 1 ? 2 : 1), oxL - 5, py(f) + 3);
  }
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(oxL, oyT - 4); ctx.lineTo(oxL, oyB); ctx.lineTo(oxR, oyB); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif';
  // Rechts ans Achsenende, nicht in die Mitte: mittig stieß die Beschriftung
  // in die Überschrift des unteren Streifens (Grundlinie 221 gegen 224).
  ctx.textAlign = 'right'; ctx.fillText('s in cm', oxR, oyB + 25);
  ctx.textAlign = 'center';
  ctx.save(); ctx.translate(13, (oyT + oyB) / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('F in N', 0, 0); ctx.restore();

  // Das große Dreieck bei doppelter Auslenkung, zerlegt in vier gleiche kleine.
  // Genau diese Zerlegung ist der Grund für den Faktor 4.
  // Gezeichnet wird das Paar aus _spePaar() – also DAS Paar, über das die
  // Statuszeile spricht. Vorher stand dort ab 16 cm ein Vergleich, zu dem im
  // Bild kein Dreieck gehörte (192 von 372 Einstellungen).
  const pD = _spePaar();
  if (sCm > 0) {
    const s1 = pD.s1, s2 = pD.s2, F1 = _speKraft(D, s1), F2 = _speKraft(D, s2);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(219,39,119,0.9)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(s2), py(0));
    ctx.lineTo(px(s2), py(F2)); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = 'rgba(219,39,119,0.45)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px(s1), py(0)); ctx.lineTo(px(s1), py(F1));
    ctx.moveTo(px(s1), py(F1)); ctx.lineTo(px(s2), py(F1));
    ctx.moveTo(px(s1), py(0)); ctx.lineTo(px(s2), py(F1));
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#db2777'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('4 · E₁', px(s2 * 0.80), py(F2 * 0.30));
    // Liegt das kleine Dreieck nicht auf der eingestellten Auslenkung, braucht
    // es einen eigenen Namen – sonst meint "E" im Bild zwei verschiedene Werte.
    if (s1 !== sCm) ctx.fillText('E₁', px(s1 * 0.55), py(F1 * 0.30));
  }

  // Die Fläche selbst: hell das ganze Dreieck, kräftig der Teil, der beim
  // Spannen schon zusammengekommen ist. Die Aufbaumarke läuft mit der Zeit.
  const zyk = 2.6;
  const u = Math.min(1, (_spe.t % zyk) / (zyk * 0.78));
  if (sCm > 0) {
    ctx.fillStyle = 'rgba(124,58,237,0.18)';
    ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(sCm), py(0));
    ctx.lineTo(px(sCm), py(F)); ctx.closePath(); ctx.fill();
    const su = u * sCm, fu = _speKraft(D, su);
    ctx.fillStyle = 'rgba(124,58,237,0.42)';
    ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(su), py(0));
    ctx.lineTo(px(su), py(fu)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(px(su), py(0)); ctx.lineTo(px(su), py(fu)); ctx.stroke();
  }

  // die Gerade F = D · s
  ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(_SPE_SMAX), py(Fende)); ctx.stroke();

  // Beschriftung der Fläche und der eingestellte Punkt
  if (sCm > 0) {
    ctx.fillStyle = '#5b21b6'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'center';
    if (px(sCm) - oxL > 78 && oyB - py(F) > 26) {
      ctx.fillText('E = ' + _speJ(E) + ' J', px(sCm * 0.5), py(F * 0.28));
    }
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(px(sCm), py(0)); ctx.lineTo(px(sCm), py(F));
    ctx.lineTo(oxL, py(F)); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.fillStyle = '#1d4ed8';
  ctx.beginPath(); ctx.arc(px(sCm), py(F), 4.5, 0, 2 * Math.PI); ctx.fill();
  ctx.font = '700 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('F = ' + _fpmNum(F, 2) + ' N', Math.min(px(sCm) + 7, oxR - 62), Math.max(py(F) - 6, oyT + 9));

  // ── unterer Streifen: Feder, Wagen, Energiebilanz ────
  const rail = 306;
  ctx.fillStyle = '#1e293b'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Loslassen: E_Spann wird zu E_Kin   (Wagen m = ' + _fpmNum(_SPE_M, 2) + ' kg)', 14, 233);

  // aktuelle Aufteilung der Energie
  let xcm = sCm, eSpann = E, eKin = 0;
  if (_spe.phase === 'schub') {
    xcm = sCm * Math.cos(_speOmega(D) * _spe.pt);
    if (xcm < 0) xcm = 0;
    eSpann = _speEnergie(D, xcm); eKin = E - eSpann;
  } else if (_spe.phase === 'rollt' || _spe.phase === 'fertig') {
    xcm = 0; eSpann = 0; eKin = E;
  }
  const balken = (y, name, wert, farbe) => {
    const bx = 92, bw = 150;
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(name, 14, y + 9);
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(bx, y, bw, 11);
    ctx.fillStyle = farbe;
    ctx.fillRect(bx, y, E > 0 ? bw * Math.max(0, Math.min(1, wert / E)) : 0, 11);
    ctx.fillStyle = '#334155'; ctx.font = '700 10px sans-serif';
    ctx.fillText(_speJ(wert) + ' J', bx + bw + 8, y + 9);
  };
  // Die Balken sitzen unter der Überschrift (Unterlänge des "p" reicht bis 236).
  balken(241, 'E_Spann', eSpann, '#7c3aed');
  balken(259, 'E_Kin', eKin, '#16a34a');

  // Bahn, Wand, Feder, Wagen
  ctx.fillStyle = '#cbd5e1'; ctx.fillRect(26, rail, _SPE_RAILX - 26, 6);
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(26, rail - 46, 8, 46);
  let wx;
  if (_spe.phase === 'rollt' || _spe.phase === 'fertig') wx = _spe.wagenX;
  else wx = _SPE_X0 - (xcm / _SPE_SMAX) * _SPE_STAUCH;
  // Feder als Zickzack von der Wand bis zum Wagen (bzw. bis zur Ruhelage)
  const federEnde = Math.min(wx, _SPE_X0);
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
  ctx.moveTo(34, rail - 12);
  for (let i = 0; i <= 16; i++) {
    const fx = 34 + (federEnde - 34) * (i / 16);
    ctx.lineTo(fx, rail - 12 + (i % 2 === 0 ? -8 : 8));
  }
  ctx.lineTo(federEnde, rail - 12); ctx.stroke();
  // Wagen
  ctx.fillStyle = (_spe.phase === 'rollt' || _spe.phase === 'schub') ? '#16a34a' : '#475569';
  ctx.fillRect(wx, rail - 22, _SPE_WBREIT, 16);
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(wx + 8, rail, 4, 0, 2 * Math.PI);
  ctx.arc(wx + 24, rail, 4, 0, 2 * Math.PI); ctx.fill();
  // Geschwindigkeitspfeil und Beschriftung. Der Pfeil braucht eine Spitze: ein
  // grüner Strich vorn am Wagen liest sich sonst als Kraft in Fahrtrichtung –
  // genau die Fehlvorstellung, die das Heft abbauen soll.
  const vJetzt = (_spe.phase === 'rollt' || _spe.phase === 'fertig') ? v
               : (_spe.phase === 'schub' ? Math.sqrt(Math.max(0, 2 * eKin / _SPE_M)) : 0);
  if (vJetzt > 0) {
    const ax = wx + _SPE_WBREIT, ay = rail - 14;
    const aend = Math.min(ax + 8 + vJetzt * 22, W - 8);
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(aend - 6, ay); ctx.stroke();
    ctx.fillStyle = '#16a34a';
    ctx.beginPath(); ctx.moveTo(aend, ay);
    ctx.lineTo(aend - 8, ay - 5); ctx.lineTo(aend - 8, ay + 5);
    ctx.closePath(); ctx.fill();
  }
  // Die Zahl steht neben dem E_Kin-Balken, wohin sie gehört - und nicht mehr
  // links unten: dort lag sie bei großen Auslenkungen auf dem Wagen (der steht
  // bei s = 30 cm ab x = 60, die Beschriftung reichte bis x = 90).
  ctx.fillStyle = '#16a34a'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('v = ' + _fpmNum(vJetzt, 2) + ' m/s', 300, 268);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif';
  ctx.fillText('Auslenkung s = ' + _fpmNum(sCm, 0) + ' cm  ·  Bahn reibungsfrei  ·  1 m/s ≙ ' + _SPE_PXPMS + ' Pixel je Sekunde', 14, 330);
}

// ── Oberfläche ─────────────────────────────────────────
function _speHTML() {
  return `<div class="sim-box sim-box-wide fpm-sim spe-sim">
    <button class="sim-x" onclick="closePhysicsSim()">✕</button>
    <h3 class="sim-h3">Spannenergie – warum E = ½ · D · s² und nicht F · s</h3>
    <div class="fpm-note" style="margin-top:2px">Beim Spannen wächst die Kraft von 0 auf F. Die gespeicherte Energie ist deshalb nicht F · s, sondern die <b>Fläche unter der F-s-Geraden</b>: ein Dreieck. Verstelle D und s und verfolge, wie sich Kraft und Fläche unterschiedlich schnell ändern.</div>
    <div class="fpm-grid">
      <div>
        <canvas id="speAnim" width="440" height="340" class="phys-anim-cv"></canvas>
        <div class="phys-ctrl" style="margin-top:8px">
          <span class="phys-ctrl-label">Federkonstante D: <b id="speDLbl">20 N/m</b></span>
          <input type="range" id="speD" min="5" max="60" step="5" value="20"
            oninput="_speSetD(this.value)" style="width:100%;accent-color:#7c3aed">
        </div>
        <div class="phys-ctrl" style="margin-top:6px">
          <span class="phys-ctrl-label">Auslenkung s: <b id="speSLbl">10 cm</b></span>
          <input type="range" id="speS" min="0" max="30" step="1" value="10"
            oninput="_speSetS(this.value)" style="width:100%;accent-color:#7c3aed">
        </div>
        <div class="sim-btn-row" style="margin-top:6px">
          <button class="sim-btn primary" id="speBLos" onclick="_speLoslassen()">Loslassen</button>
          <button class="sim-btn" id="speBMess" onclick="_speMesspunkt()">Messpunkt übernehmen</button>
          <button class="sim-btn" id="speBLeer" onclick="_speTabelleLeeren()">Tabelle leeren</button>
        </div>
      </div>
      <div>
        <div class="fpm-label">Kraft, Fläche, Energie</div>
        <div class="lmp-status" id="speStatus" style="margin-top:6px"></div>
        <div class="fpm-label" style="margin-top:12px">Messreihe</div>
        <div class="fpm-tablewrap">
          <table class="sim-table">
            <thead><tr><th>Nr.</th><th>D (N/m)</th><th>s (cm)</th><th>F (N)</th><th>E (J)</th><th></th></tr></thead>
            <tbody id="speTbody"></tbody>
          </table>
          <div class="fpm-empty" id="speEmpty">Noch keine Messwerte.<br>D und s einstellen, dann „Messpunkt übernehmen“.</div>
        </div>
        <div class="fpm-note" id="speAusw" style="margin-top:8px"></div>
        <div class="fpm-note" style="margin-top:8px"><b>Modellgrenzen:</b> Die Feder gilt als ideal (F = D · s über den ganzen Bereich, keine Verformung, keine eigene Masse), die Bahn als reibungsfrei. Deshalb wird die Spannenergie <b>vollständig</b> zu Bewegungsenergie und der Wagen wird nicht langsamer. In der echten Fahrbahn gehen einige Prozent an Reibung und an die mitschwingende Federmasse verloren.</div>
      </div>
    </div>
    <p class="sim-hint" style="text-align:center;margin:6px 0 0">
      <b>F = D · s</b> (Gerade) &nbsp;·&nbsp; <b>E = ½ · D · s²</b> (Dreiecksfläche darunter) &nbsp;·&nbsp; doppeltes s: doppelte Kraft, vierfache Energie
    </p>
  </div>`;
}
