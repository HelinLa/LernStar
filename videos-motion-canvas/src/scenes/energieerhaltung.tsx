import {makeScene2D, Circle, Line, Rect, Txt, Node} from '@motion-canvas/2d';
import {
  createRef,
  createSignal,
  all,
  waitFor,
  easeOutCubic,
  linear,
} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// Physik 9 – Energieerhaltung am Pendel (Motion-Canvas-Neubau).
// Zeigt die Stärke von Motion Canvas: echtes, kontinuierlich schwingendes Pendel
// mit signalgesteuerten, live mitlaufenden Energiebalken (Lage ↔ Bewegung, Summe konstant).
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  // --- Pendel-Physik (kontinuierlich über eine Phase-Signal) ---
  const PIVOT_X = -260;
  const PIVOT_Y = -360;
  const L = 470;
  const A = 0.72; // Amplitude (rad)
  const cosA = Math.cos(A);

  const phase = createSignal(0);
  const theta = () => A * Math.cos(phase());
  const bobX = () => PIVOT_X + L * Math.sin(theta());
  const bobY = () => PIVOT_Y + L * Math.cos(theta());
  const pot = () => Math.min(1, Math.max(0, (1 - Math.cos(theta())) / (1 - cosA))); // Lageenergie-Anteil
  const kin = () => 1 - pot();

  // --- Energiebalken ---
  const BAR_TOP = -60;
  const BAR_H = 320;
  const BAR_W = 92;
  const BAR_BOTTOM = BAR_TOP + BAR_H;
  const bar = (x: number, frac: () => number, color: string, label: string) => (
    <Node x={x}>
      <Rect y={BAR_TOP + BAR_H / 2} width={BAR_W} height={BAR_H} radius={14} fill={'rgba(255,255,255,0.06)'} stroke={COLORS.border} lineWidth={2} />
      <Rect
        width={BAR_W - 8}
        height={() => Math.max(0, frac() * (BAR_H - 8))}
        y={() => BAR_BOTTOM - (frac() * (BAR_H - 8)) / 2 - 4}
        radius={9}
        fill={color}
      />
      <Txt y={BAR_BOTTOM + 40} text={label} fill={color} fontFamily={FONT} fontSize={27} fontWeight={800} />
    </Node>
  );

  const kicker = createRef<Txt>();
  const title = createRef<Txt>();
  const caption = createRef<Txt>();
  const barsNode = createRef<Node>();

  view.add(
    <>
      <Txt ref={kicker} text="PHYSIK 9 · ENERGIE" fill={COLORS.indigo} fontFamily={FONT} fontSize={34} fontWeight={800} letterSpacing={4} x={-720} y={-470} offsetX={-1} opacity={0} />
      <Txt ref={title} text="Energieerhaltung am Pendel" fill={COLORS.ink} fontFamily={FONT} fontSize={70} fontWeight={900} x={-720} y={-395} offsetX={-1} opacity={0} />

      {/* Aufhängung */}
      <Circle position={[PIVOT_X, PIVOT_Y]} size={22} fill={COLORS.border} stroke={COLORS.muted} lineWidth={3} />
      {/* Faden (reaktiv) */}
      <Line points={() => [[PIVOT_X, PIVOT_Y], [bobX(), bobY()]]} stroke={COLORS.muted} lineWidth={6} lineCap="round" />
      {/* Pendelkugel (reaktiv) */}
      <Circle position={() => [bobX(), bobY()]} size={94} fill={COLORS.indigo} stroke={COLORS.ink} lineWidth={5} shadowColor={'rgba(0,0,0,0.45)'} shadowBlur={22} shadowOffsetY={8} />

      {/* Energiebalken rechts */}
      <Node ref={barsNode} x={520} y={-40} opacity={0}>
        {bar(0, pot, COLORS.sky, 'Lage')}
        {bar(150, kin, COLORS.amber, 'Bewegung')}
        {bar(300, () => 1, COLORS.green, 'Summe')}
      </Node>

      <Txt ref={caption} text="Lage- und Bewegungsenergie tauschen sich – die Summe bleibt gleich." fill={COLORS.ink} fontFamily={FONT} fontSize={38} fontWeight={800} y={470} opacity={0} width={1500} textAlign="center" textWrap />
    </>,
  );

  // 1) Kopf + Balken einblenden
  yield* all(kicker().opacity(1, 0.5), title().opacity(1, 0.7));
  yield* all(barsNode().opacity(1, 0.6));

  // 2) Pendel schwingt kontinuierlich (mehrere Perioden), Balken laufen live mit
  yield* all(
    phase(Math.PI * 2 * 3.25, 13, linear),
    (function* () {
      yield* waitFor(2.2);
      yield* caption().opacity(1, 0.6);
    })(),
  );

  yield* waitFor(0.6);
});
