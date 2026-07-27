import {makeScene2D, Txt, Rect, Circle, Line, Node} from '@motion-canvas/2d';
import {
  createRef,
  createSignal,
  all,
  waitFor,
  easeInOutCubic,
  easeOutCubic,
} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// Beispiel-Lernvideo (Physik): "Was bedeutet Geschwindigkeit? v = s / t"
// Zeigt Motion-Canvas-Stärke: weiche, signal-gesteuerte Animationen mit
// live mitzählenden Werten. LernStar-Farbwelt aus ../theme.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  // --- Referenzen & Signale ---
  const kicker = createRef<Txt>();
  const title = createRef<Txt>();
  const formula = createRef<Txt>();
  const car = createRef<Node>();
  const roadRef = createRef<Line>();

  const s = createSignal(0); // zurückgelegte Strecke in m
  const t = createSignal(0); // vergangene Zeit in s

  const roadLeft = -700;
  const roadRight = 700;
  const roadY = 200;

  // --- Aufbau ---
  view.add(
    <>
      <Txt
        ref={kicker}
        text="PHYSIK · BEWEGUNG"
        fill={COLORS.indigo}
        fontFamily={FONT}
        fontSize={34}
        fontWeight={800}
        letterSpacing={4}
        y={-380}
        opacity={0}
      />
      <Txt
        ref={title}
        text={'Was bedeutet „schnell"?'}
        fill={COLORS.ink}
        fontFamily={FONT}
        fontSize={78}
        fontWeight={900}
        y={-300}
        opacity={0}
      />

      {/* Straße */}
      <Line
        ref={roadRef}
        points={[
          [roadLeft, roadY],
          [roadLeft, roadY],
        ]}
        stroke={COLORS.ground}
        lineWidth={10}
        lineCap="round"
      />

      {/* Auto (fährt auf der Straße) */}
      <Node ref={car} x={roadLeft} y={roadY - 46}>
        <Txt text="🚗" fontSize={80} />
      </Node>

      {/* Live-Anzeigen Strecke & Zeit */}
      <Rect
        x={-360}
        y={-40}
        width={420}
        height={150}
        radius={22}
        fill={COLORS.panel}
        stroke={COLORS.sky}
        lineWidth={3}
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={8}
      >
        <Txt text="Strecke s" fill={COLORS.muted} fontFamily={FONT} fontSize={30} fontWeight={700} />
        <Txt
          text={() => `${s().toFixed(0)} m`}
          fill={COLORS.sky}
          fontFamily={FONT}
          fontSize={62}
          fontWeight={900}
        />
      </Rect>

      <Rect
        x={360}
        y={-40}
        width={420}
        height={150}
        radius={22}
        fill={COLORS.panel}
        stroke={COLORS.amber}
        lineWidth={3}
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={8}
      >
        <Txt text="Zeit t" fill={COLORS.muted} fontFamily={FONT} fontSize={30} fontWeight={700} />
        <Txt
          text={() => `${t().toFixed(1)} s`}
          fill={COLORS.amber}
          fontFamily={FONT}
          fontSize={62}
          fontWeight={900}
        />
      </Rect>

      {/* Formel-Ergebnis */}
      <Txt
        ref={formula}
        text=""
        fill={COLORS.green}
        fontFamily={FONT}
        fontSize={72}
        fontWeight={900}
        y={400}
        opacity={0}
      />
    </>,
  );

  // --- Ablauf ---
  // 1) Titel einblenden
  yield* all(
    kicker().opacity(1, 0.6),
    title().opacity(1, 0.8),
  );
  yield* waitFor(0.3);

  // 2) Straße wächst nach rechts, Auto fährt, s & t zählen mit
  yield* all(
    roadRef().points(
      [
        [roadLeft, roadY],
        [roadRight, roadY],
      ],
      0.6,
      easeOutCubic,
    ),
  );

  yield* all(
    car().x(roadRight, 4, easeInOutCubic),
    s(120, 4, easeInOutCubic),
    t(6, 4, easeInOutCubic),
  );
  yield* waitFor(0.4);

  // 3) Formel v = s / t = 20 m/s erscheint
  formula().text('v = 120 m ÷ 6 s = 20 m/s');
  yield* all(
    formula().opacity(1, 0.6),
    formula().y(360, 0.6, easeOutCubic),
  );
  yield* waitFor(1.2);

  // 4) Merksatz
  yield* all(
    title().text('Geschwindigkeit: v = s / t', 0.6),
    formula().scale(1.06, 0.4).to(1, 0.4),
  );
  yield* waitFor(1.5);
});
