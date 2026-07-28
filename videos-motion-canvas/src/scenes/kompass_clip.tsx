import {makeScene2D, Line, Rect, Txt, Node, Circle} from '@motion-canvas/2d';
import {createSignal, all, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: Wie funktioniert ein Kompass? (Klasse 5 RS).
// NUR Fachanimation (Kompass mit drehbarer Magnetnadel, Erdmagnetfeld-Pfeile,
// Anstoßen/Zurückpendeln, Störung durch nahen Magneten/Handy). Titel via Remotion.
// Kern: Nadel = kleiner Magnet, richtet sich im Erdfeld nach Norden; Eisen/Magnet stört.
// durOf an kompass-mc.timings.json (Eva/Piper), TAIL=20; siehe scripts/print-durations.mjs.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);
  const ink = COLORS.ink;
  const NCOL = COLORS.red, SCOL = COLORS.sky;

  const compassOp = createSignal(0);
  const needleRot = createSignal(0);
  const needleScale = createSignal(1);
  const needleHiOp = createSignal(0);
  const fieldOp = createSignal(0);
  const magOp2 = createSignal(0);
  const magX2 = createSignal(700);
  const magY2 = createSignal(0);
  const phoneOp = createSignal(0);
  const phoneX = createSignal(-560);
  const refNorthOp = createSignal(0);
  const goalOp = createSignal(0);
  const routeArrOp = createSignal(0);
  const logoOp = createSignal(0);

  // Bar-Magnet (Störer)
  const HALF = 120, H = 78;
  const Magnet2 = () => (
    <Node position={() => [magX2(), magY2()]} opacity={() => magOp2()}>
      <Rect x={-HALF / 2} width={HALF} height={H} radius={[14, 0, 0, 14]} fill={SCOL} stroke={ink} lineWidth={3} />
      <Rect x={HALF / 2} width={HALF} height={H} radius={[0, 14, 14, 0]} fill={NCOL} stroke={ink} lineWidth={3} />
      <Txt x={-HALF / 2} text="S" fill={ink} fontFamily={FONT} fontSize={36} fontWeight={900} />
      <Txt x={HALF / 2} text="N" fill={ink} fontFamily={FONT} fontSize={36} fontWeight={900} />
    </Node>
  );

  // Erdmagnetfeld: schwache Aufwärtspfeile (Richtung Norden)
  const earthArrows: any[] = [];
  for (const gx of [-430, -300, 300, 430]) {
    earthArrows.push(
      <Line points={[[gx, 300], [gx, -300]]} stroke={COLORS.sky} lineWidth={3} endArrow arrowSize={13} opacity={() => fieldOp() * 0.5} lineDash={[3, 10]} />,
    );
  }

  view.add(
    <Node>
      {earthArrows}
      <Txt position={[0, -430]} text="Erdmagnetfeld → Norden" fill={COLORS.sky} fontFamily={FONT} fontSize={28} fontWeight={800} opacity={() => fieldOp() * 0.85} />

      {/* Referenz „echt Norden" (Störungsszene) */}
      <Line points={[[0, -150], [0, -330]]} stroke={COLORS.amber} lineWidth={4} lineDash={[12, 9]} endArrow arrowSize={16} opacity={() => refNorthOp()} />
      <Txt position={[70, -320]} text="echt N" fill={COLORS.amber} fontFamily={FONT} fontSize={24} fontWeight={800} opacity={() => refNorthOp()} />

      {/* Ziel-Flagge (Anwendung) */}
      <Node position={[360, -250]} opacity={() => goalOp()}>
        <Line points={[[0, 40], [0, -40]]} stroke={ink} lineWidth={4} />
        <Line points={[[0, -40], [46, -26], [0, -12]]} closed fill={COLORS.green} />
        <Txt position={[0, 64]} text="Ziel" fill={COLORS.ink} fontFamily={FONT} fontSize={26} fontWeight={800} />
      </Node>
      <Line points={[[70, -40], [300, -210]]} stroke={COLORS.green} lineWidth={7} endArrow arrowSize={20} opacity={() => routeArrOp()} lineCap="round" />

      {/* Kompass */}
      <Node position={[0, 0]} opacity={() => compassOp()}>
        <Circle size={230} fill={COLORS.panelSolid} stroke={COLORS.border} lineWidth={5} />
        <Txt position={[0, -92]} text="N" fill={COLORS.muted} fontFamily={FONT} fontSize={30} fontWeight={900} />
        <Txt position={[92, 0]} text="O" fill={COLORS.muted} fontFamily={FONT} fontSize={30} fontWeight={800} />
        <Txt position={[0, 92]} text="S" fill={COLORS.muted} fontFamily={FONT} fontSize={30} fontWeight={800} />
        <Txt position={[-92, 0]} text="W" fill={COLORS.muted} fontFamily={FONT} fontSize={30} fontWeight={800} />
        <Node rotation={() => needleRot()} scale={() => needleScale()}>
          <Line points={[[0, 0], [0, -70]]} stroke={NCOL} lineWidth={12} endArrow arrowSize={20} lineCap="round" />
          <Line points={[[0, 0], [0, 70]]} stroke={SCOL} lineWidth={12} lineCap="round" />
          <Txt position={[0, -88]} text="N" fill={NCOL} fontFamily={FONT} fontSize={26} fontWeight={900} rotation={() => -needleRot()} opacity={() => needleHiOp()} />
          <Txt position={[0, 88]} text="S" fill={SCOL} fontFamily={FONT} fontSize={26} fontWeight={900} rotation={() => -needleRot()} opacity={() => needleHiOp()} />
        </Node>
        <Circle size={14} fill={ink} />
      </Node>

      {/* Störer Handy */}
      <Node position={() => [phoneX(), 0]} opacity={() => phoneOp()}>
        <Rect width={92} height={150} radius={16} fill={'#0f172a'} stroke={COLORS.muted} lineWidth={3} />
        <Rect width={70} height={110} radius={8} fill={'#1e293b'} />
        <Txt position={[0, 96]} text="Handy" fill={COLORS.muted} fontFamily={FONT} fontSize={24} fontWeight={800} />
      </Node>

      <Magnet2 />

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 250]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={44} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />
    </Node>,
  );

  // ── 1 · intro (DUR_s 12.2333) ────────────────────────────────────────
  yield* compassOp(1, 1.2);
  yield* waitFor(11.0333);

  // ── 2 · nadel (DUR_s 12.9): die Nadel ist ein kleiner Magnet ─────────
  yield* needleScale(1.28, 0.8);
  yield* all(needleHiOp(1, 0.6), needleScale(1, 0.8));
  yield* waitFor(11.3);

  // ── 3 · erdfeld (DUR_s 14.5667): richtet sich im Erdfeld nach Norden ─
  yield* needleRot(36, 0.7);
  yield* fieldOp(1, 1.1);
  yield* needleRot(0, 1.5);
  yield* waitFor(11.2667);

  // ── 4 · anstoss (DUR_s 11.4667): anstoßen → pendelt zurück nach Norden
  yield* needleRot(72, 0.4);
  yield* needleRot(-42, 0.7);
  yield* needleRot(26, 0.6);
  yield* needleRot(-15, 0.5);
  yield* needleRot(0, 0.5);
  yield* waitFor(8.7667);

  // ── 5 · magnetnah (DUR_s 12.1): starker Magnet zieht Nadel weg ──────
  yield* magOp2(1, 0.5);
  yield* all(magX2(340, 1.4), needleRot(90, 1.4));
  yield* waitFor(1.6);
  yield* all(magY2(-150, 1.2), needleRot(66, 1.2));
  yield* waitFor(7.4);

  // ── 6 · fehlvorstellung (DUR_s 18.6333): Eisen/Handy stört → falsch ─
  yield* all(magOp2(0, 0.5), magX2(700, 0.8), magY2(0, 0.4), needleRot(0, 1.0));
  yield* waitFor(1.0);
  yield* all(phoneOp(1, 0.5), phoneX(-300, 1.2), needleRot(-36, 1.2));
  yield* refNorthOp(1, 0.5);
  yield* waitFor(2.6);
  yield* all(phoneOp(0, 0.6), phoneX(-560, 1.0), needleRot(0, 1.2), refNorthOp(0, 0.6));
  yield* waitFor(11.1333);

  // ── 7 · anwendung (DUR_s 12.2333): Himmelsrichtungen → Ziel finden ──
  yield* goalOp(1, 0.6);
  yield* routeArrOp(1, 0.6);
  yield* waitFor(11.0333);

  // ── 8 · outro (DUR_s 8.2667) ─────────────────────────────────────────
  yield* all(compassOp(0, 0.5), goalOp(0, 0.5), routeArrOp(0, 0.5), fieldOp(0, 0.5));
  yield* logoOp(1, 0.8);
  yield* waitFor(6.9667);
});
