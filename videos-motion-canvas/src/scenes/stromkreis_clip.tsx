import {makeScene2D, Circle, Line, Rect, Txt, Node} from '@motion-canvas/2d';
import {createSignal, all, waitFor, linear} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: einfacher Stromkreis mit umlaufenden Elektronen (Kl. 5).
// Nur Fachanimation, kein Titel/Untertitel (das legt Remotion drüber). Segmentdauern
// framegenau an die Eva-Audios (Piper, stromkreis-mc.timings.json → durOf,
// siehe scripts/print-durations.mjs) angepasst. Füller sind hier run()-Aufrufe.
//
// Didaktischer Kern: Elektronen laufen als GLEICHMÄSSIGE Kette im geschlossenen Kreis
// (Dichte überall gleich → "nichts wird verbraucht"). Öffnet der Schalter, stehen ALLE
// gleichzeitig still (kein Stau) → geschlossener Kreis nötig.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  // ── Rechteck-Loop (im Uhrzeigersinn, Start oben links) ───────────────
  const TL: [number, number] = [-560, -230];
  const TR: [number, number] = [560, -230];
  const BR: [number, number] = [560, 250];
  const BL: [number, number] = [-560, 250];
  // Perimeter-Parametrisierung t∈[0,1): oben .35 | rechts .15 | unten .35 | links .15
  const posAt = (tt: number): [number, number] => {
    let t = ((tt % 1) + 1) % 1;
    if (t < 0.35) { const u = t / 0.35; return [TL[0] + u * (TR[0] - TL[0]), TL[1]]; }
    if (t < 0.5)  { const u = (t - 0.35) / 0.15; return [TR[0], TR[1] + u * (BR[1] - TR[1])]; }
    if (t < 0.85) { const u = (t - 0.5) / 0.35; return [BR[0] + u * (BL[0] - BR[0]), BR[1]]; }
    const u = (t - 0.85) / 0.15; return [BL[0], BL[1] + u * (TL[1] - BL[1])];
  };

  // ── Signale ──────────────────────────────────────────────────────────
  const objOp = createSignal(0);       // Einblenden
  const flow = createSignal(0);        // Umlauf-Phase (in "Runden")
  const lampOn = createSignal(0);      // Lampenhelligkeit 0..1
  const switchOpen = createSignal(1);  // 1 = offen, 0 = geschlossen (Start: offen)
  const arrowsOp = createSignal(0);    // Flussrichtungs-Pfeile
  const countOp = createSignal(0);     // grüne "gleich viele"-Callouts
  const wrongOp = createSignal(0);     // rote "verbraucht?"-Fehlvorstellung
  const energyOp = createSignal(0);    // "Energie wird abgegeben"
  const gapOp = createSignal(0);       // rote Lücke am offenen Schalter
  const logoOp = createSignal(0);

  const N = 20;                        // Anzahl Elektronen
  const RATE = 0.22;                   // Runden pro Sekunde
  let fv = 0;                          // JS-Spiegel der Flow-Phase (für Zieltweens)

  // Schalter: Drehpunkt rechter Kontakt, Hebel 120 lang nach links
  const SW_P: [number, number] = [60, 250];
  const SW_LEN = 120;
  const leverEnd = (): [number, number] => {
    const th = switchOpen() * 35 * Math.PI / 180;
    return [SW_P[0] - SW_LEN * Math.cos(th), SW_P[1] - SW_LEN * Math.sin(th)];
  };

  view.add(
    <Node opacity={() => objOp()}>
      {/* ── Leitungen (Draht) ── */}
      <Line points={[TL, TR]} stroke={COLORS.muted} lineWidth={7} lineCap="round" />        {/* oben */}
      <Line points={[TR, BR]} stroke={COLORS.muted} lineWidth={7} lineCap="round" />        {/* rechts */}
      <Line points={[BR, [60, 250]]} stroke={COLORS.muted} lineWidth={7} lineCap="round" /> {/* unten rechts bis Schalter */}
      <Line points={[[-60, 250], BL]} stroke={COLORS.muted} lineWidth={7} lineCap="round" />{/* unten links ab Schalter */}
      <Line points={[BL, TL]} stroke={COLORS.muted} lineWidth={7} lineCap="round" />        {/* links */}

      {/* ── Flussrichtungs-Pfeile (im Uhrzeigersinn) ── */}
      <Line points={[[-260, -230], [-140, -230]]} stroke={COLORS.sky} lineWidth={5} endArrow arrowSize={16} opacity={() => arrowsOp()} />
      <Line points={[[560, -30], [560, 90]]} stroke={COLORS.sky} lineWidth={5} endArrow arrowSize={16} opacity={() => arrowsOp()} />
      <Line points={[[-260, 250], [-380, 250]]} stroke={COLORS.sky} lineWidth={5} endArrow arrowSize={16} opacity={() => arrowsOp()} />
      <Line points={[[-560, 90], [-560, -30]]} stroke={COLORS.sky} lineWidth={5} endArrow arrowSize={16} opacity={() => arrowsOp()} />

      {/* ── Elektronen ── */}
      {Array.from({length: N}, (_, i) => (
        <Circle
          size={22}
          position={() => posAt(flow() + i / N)}
          fill={COLORS.sky}
          stroke={COLORS.bg0}
          lineWidth={2}
        />
      ))}

      {/* ── Batterie (links) ── */}
      <Rect position={[-560, 10]} width={54} height={128} radius={10} fill={COLORS.panelSolid} stroke={COLORS.ink} lineWidth={4} />
      <Txt position={[-560, -34]} text="+" fill={COLORS.ink} fontFamily={FONT} fontSize={40} fontWeight={900} />
      <Txt position={[-560, 52]} text="–" fill={COLORS.ink} fontFamily={FONT} fontSize={40} fontWeight={900} />
      <Txt position={[-680, 10]} text="Batterie" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} />

      {/* ── Lampe (oben Mitte) ── */}
      <Circle position={[0, -230]} size={() => 150 + 40 * lampOn()} fill={COLORS.amber} opacity={() => 0.28 * lampOn()} />
      <Txt position={[0, -230]} text="💡" fontSize={120} opacity={() => 0.32 + 0.68 * lampOn()} />
      <Txt position={[220, -305]} text="Lampe" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} />

      {/* ── Schalter (unten Mitte) ── */}
      <Circle position={[-60, 250]} size={16} fill={COLORS.ink} />
      <Circle position={SW_P} size={16} fill={COLORS.ink} />
      <Line points={() => [SW_P, leverEnd()]} stroke={COLORS.ink} lineWidth={8} lineCap="round" />
      <Circle position={[0, 250]} size={38} stroke={COLORS.red} lineWidth={5} opacity={() => gapOp()} />
      <Txt position={[0, 185]} text="Schalter" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} />

      {/* ── Callouts ── */}
      <Txt position={[-250, -150]} text="vor der Lampe" fill={COLORS.green} fontFamily={FONT} fontSize={26} fontWeight={800} opacity={() => countOp()} />
      <Txt position={[250, -150]} text="nach der Lampe" fill={COLORS.green} fontFamily={FONT} fontSize={26} fontWeight={800} opacity={() => countOp()} />
      <Txt position={[0, -110]} text="✓ gleich viele" fill={COLORS.green} fontFamily={FONT} fontSize={34} fontWeight={900} opacity={() => countOp()} />
      <Txt position={[0, -110]} text="weniger? ✗" fill={COLORS.red} fontFamily={FONT} fontSize={34} fontWeight={900} opacity={() => wrongOp()} />
      <Txt position={[0, 20]} text="In der Lampe: Energie wird abgegeben → Licht & Wärme" fill={COLORS.amber} fontFamily={FONT} fontSize={28} fontWeight={800} opacity={() => energyOp()} />

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 70]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />
    </Node>,
  );

  // Hilfsfunktion: Fluss um `secs` weiterlaufen lassen (kontinuierlich)
  function* run(secs: number, ...extra: any[]) {
    fv += secs * RATE;
    yield* all(flow(fv, secs, linear), ...extra);
  }

  // ── 1 · intro (DUR_s 9.6): Kreis offen, Lampe aus, nichts fließt ─────
  yield* objOp(1, 1.4);
  yield* waitFor(8.2);

  // ── 2 · geschlossen (DUR_s 12.4): Schalter zu → Fluss startet, Lampe an
  yield* switchOpen(0, 0.8);
  yield* run(11.6, lampOn(1, 0.6));

  // ── 3 · elektronen (DUR_s 11.0): Kette dreht sich, Pfeile ───────────
  yield* run(11.0, arrowsOp(1, 0.8));

  // ── 4 · verbrauch (DUR_s 12.1333): Fehlvorstellung → gleich viele ───
  yield* run(0.6, wrongOp(1, 0.6));
  yield* run(1.6);
  yield* run(0.5, wrongOp(0, 0.5));
  yield* run(0.6, countOp(1, 0.6));
  yield* run(8.8333);

  // ── 5 · energie (DUR_s 10.8): Energie wird abgegeben, Elektronen zurück
  yield* run(0.8, energyOp(1, 0.8));
  yield* run(10.0);

  // ── 6 · offen (DUR_s 12.7667): Schalter auf → ALLE stehen sofort still
  yield* run(2.0);
  yield* all(switchOpen(1, 0.5), lampOn(0, 0.4), gapOp(1, 0.4)); // Fluss friert ein (kein run!)
  yield* all(countOp(0, 0.5), energyOp(0, 0.5), arrowsOp(0.25, 0.5));
  yield* waitFor(9.7667);

  // ── 7 · merksatz (DUR_s 10.0333): wieder geschlossen, ruhiger Umlauf ─
  yield* all(switchOpen(0, 0.6), gapOp(0, 0.6), lampOn(1, 0.5), arrowsOp(1, 0.5));
  yield* run(9.4333);

  // ── 8 · outro (DUR_s 7.7333) ────────────────────────────────────────
  yield* run(0.8, lampOn(1, 0.8));
  yield* run(0.8, logoOp(1, 0.8));
  yield* run(5.8333);
  yield* waitFor(0.3);
});
