import {makeScene2D, Circle, Line, Rect, Txt, Node} from '@motion-canvas/2d';
import {createSignal, linear, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: NUR Pendel + Energiebalken (kein Titel/Kicker/Caption).
// Text/Sprecher legt Remotion darüber. Layout lässt oben (Titel) und unten (Caption)
// bewusst Platz. Läuft ~46 s kontinuierlich, damit Remotion beliebige Ausschnitte
// per startFrom nutzen kann.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  const PIVOT_X = -300;
  const PIVOT_Y = -190;
  const L = 430;
  const A = 0.72;
  const cosA = Math.cos(A);

  const phase = createSignal(0);
  const theta = () => A * Math.cos(phase());
  const bobX = () => PIVOT_X + L * Math.sin(theta());
  const bobY = () => PIVOT_Y + L * Math.cos(theta());
  const pot = () => Math.min(1, Math.max(0, (1 - Math.cos(theta())) / (1 - cosA)));
  const kin = () => 1 - pot();

  const BAR_TOP = -170;
  const BAR_H = 340;
  const BAR_W = 96;
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
      <Txt y={BAR_BOTTOM + 42} text={label} fill={color} fontFamily={FONT} fontSize={28} fontWeight={800} />
    </Node>
  );

  view.add(
    <>
      <Circle position={[PIVOT_X, PIVOT_Y]} size={22} fill={COLORS.border} stroke={COLORS.muted} lineWidth={3} />
      <Line points={() => [[PIVOT_X, PIVOT_Y], [bobX(), bobY()]]} stroke={COLORS.muted} lineWidth={6} lineCap="round" />
      <Circle position={() => [bobX(), bobY()]} size={96} fill={COLORS.indigo} stroke={COLORS.ink} lineWidth={5} shadowColor={'rgba(0,0,0,0.45)'} shadowBlur={22} shadowOffsetY={8} />

      <Node x={470} y={30}>
        {bar(0, pot, COLORS.sky, 'Lage')}
        {bar(160, kin, COLORS.amber, 'Bewegung')}
        {bar(320, () => 1, COLORS.green, 'Summe')}
      </Node>
    </>,
  );

  // kontinuierliches Schwingen ~46 s (Periode ~4,2 s → ~11 Perioden)
  yield* phase(Math.PI * 2 * 11, 46, linear);
  yield* waitFor(0.2);
});
