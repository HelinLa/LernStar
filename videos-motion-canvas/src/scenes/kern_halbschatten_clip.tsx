import {makeScene2D, Circle, Line, Rect, Txt, Node} from '@motion-canvas/2d';
import {createSignal, all, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: Kern- und Halbschatten (Klasse 5 RS).
// NUR Fachanimation (wachsende Lichtquelle, Ball, Schirm, Umbra/Penumbra-Kegel), kein
// Titel/Untertitel – das legt Remotion drüber. Segmentdauern framegenau an die Anna-Audios
// (kern-halbschatten-mc.timings.json → durOf).
//
// Didaktischer Kern (EIN Steuersignal = Quellenhöhe srcHalf): Punktquelle → nur scharfer
// Kernschatten. Wächst die Quelle, entsteht rundum ein weicher Halbschatten. Geometrie
// physikalisch exakt: für die beiden Quellenränder (oben/unten) werden die Tangenten an den
// Ball berechnet; Umbra = von KEINEM Quellpunkt erreicht, Penumbra = von einem TEIL erreicht.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  // ── Geometrie (MC: +y = nach unten) ──────────────────────────────────
  const SRC_X = -720;
  const CY = 20;                 // Höhe von Quellenmitte & Ballmitte
  const BALL: [number, number] = [80, CY];
  const R = 80;
  const SCREEN_X = 640;
  const srcHalf = createSignal(3); // halbe Höhe der Lichtquelle: 3=Punkt … 95=Röhre

  // Tangenten-Trefferpunkte eines Quellpunkts S auf dem Schirm (Schatten-Intervall von S).
  const srcHits = (S: [number, number]) => {
    const dx = S[0] - BALL[0];
    const dy = S[1] - BALL[1];
    const d = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx);
    const phi = Math.acos(Math.min(1, R / d));
    const mk = (ang: number) => {
      const T: [number, number] = [BALL[0] + R * Math.cos(ang), BALL[1] + R * Math.sin(ang)];
      const t = (SCREEN_X - S[0]) / (T[0] - S[0]);
      return {y: S[1] + t * (T[1] - S[1]), T, S};
    };
    const h1 = mk(a + phi);
    const h2 = mk(a - phi);
    return h1.y <= h2.y ? [h1, h2] : [h2, h1]; // [oben, unten] nach Schirm-y
  };

  // Vier Zonengrenzen aus den beiden Quellenrändern.
  const zones = () => {
    const h = srcHalf();
    const [stT, stB] = srcHits([SRC_X, CY - h]); // obere Quelle
    const [sbT, sbB] = srcHits([SRC_X, CY + h]); // untere Quelle
    const penTop = stT.y <= sbT.y ? stT : sbT;   // äußerster oberer Rand
    const umbTop = stT.y >= sbT.y ? stT : sbT;    // Kernschatten oben
    const umbBot = stB.y <= sbB.y ? stB : sbB;    // Kernschatten unten
    const penBot = stB.y >= sbB.y ? stB : sbB;    // äußerster unterer Rand
    return {penTop, umbTop, umbBot, penBot};
  };
  const P = (x: number, y: number): [number, number] => [x, y];
  const umbraPoly = (): [number, number][] => {
    const z = zones();
    return [z.umbTop.T, P(SCREEN_X, z.umbTop.y), P(SCREEN_X, z.umbBot.y), z.umbBot.T];
  };
  const penUpperPoly = (): [number, number][] => {
    const z = zones();
    return [z.penTop.T, P(SCREEN_X, z.penTop.y), P(SCREEN_X, z.umbTop.y), z.umbTop.T];
  };
  const penLowerPoly = (): [number, number][] => {
    const z = zones();
    return [z.umbBot.T, P(SCREEN_X, z.umbBot.y), P(SCREEN_X, z.penBot.y), z.penBot.T];
  };
  const umbMid = (): [number, number] => { const z = zones(); return [SCREEN_X - 180, (z.umbTop.y + z.umbBot.y) / 2]; };
  const halbAnchor = (): [number, number] => { const z = zones(); return [SCREEN_X - 205, z.penTop.y - 16]; };
  const ppen = (): [number, number] => { const z = zones(); return [SCREEN_X, (z.penTop.y + z.umbTop.y) / 2]; };
  const pumb = (): [number, number] => { const z = zones(); return [SCREEN_X, (z.umbTop.y + z.umbBot.y) / 2]; };

  // Strahlenfächer vom Quellenzentrum (illustriert "Licht zum Schirm").
  const NRAYS = 13;
  const rayYs = Array.from({length: NRAYS}, (_, i) => -360 + 720 * (i / (NRAYS - 1)));

  // ── Signale ──────────────────────────────────────────────────────────
  const objOp = createSignal(0);
  const glow = createSignal(0);
  const rayOp = createSignal(0);
  const rayGrow = createSignal(0);
  const shadowOp = createSignal(0);
  const boundaryOp = createSignal(0);  // 4 Randstrahlen (Tangenten der Quellenränder)
  const teilOp = createSignal(0);      // "Teil der Lampe sichtbar" (grün) + "keine" (rot)
  const kernLabelOp = createSignal(0);
  const halbLabelOp = createSignal(0);
  const sunOp = createSignal(0);
  const logoOp = createSignal(0);

  view.add(
    <Node>
      {/* Schirm (hell = beleuchtet) */}
      <Rect position={[SCREEN_X + 16, 0]} width={20} height={820} radius={6} fill={COLORS.muted} opacity={() => objOp()} />
      <Txt position={[SCREEN_X + 16, -448]} text="Schirm" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} opacity={() => objOp()} />

      {/* Strahlenfächer (aus der Quellenmitte) */}
      {rayYs.map((y, i) => (
        <Line points={() => [[SRC_X, CY], [SCREEN_X, y]]} stroke={COLORS.amber} lineWidth={3} end={() => rayGrow()} opacity={() => 0.45 * rayOp()} lineCap="round" />
      ))}

      {/* Halbschatten (grau) + Kernschatten (dunkel) – Kegel & Schirmband in einem */}
      <Line points={() => penUpperPoly()} closed fill={COLORS.bg1} opacity={() => 0.82 * shadowOp()} />
      <Line points={() => penLowerPoly()} closed fill={COLORS.bg1} opacity={() => 0.82 * shadowOp()} />
      <Line points={() => umbraPoly()} closed fill={COLORS.bg0} opacity={() => 0.95 * shadowOp()} />

      {/* Randstrahlen (Tangenten der Quellenränder an den Ball) */}
      <Line points={() => { const z = zones(); return [z.penTop.S, z.penTop.T, [SCREEN_X, z.penTop.y]]; }} stroke={COLORS.amber} lineWidth={3} lineDash={[12, 10]} opacity={() => boundaryOp()} lineCap="round" />
      <Line points={() => { const z = zones(); return [z.penBot.S, z.penBot.T, [SCREEN_X, z.penBot.y]]; }} stroke={COLORS.amber} lineWidth={3} lineDash={[12, 10]} opacity={() => boundaryOp()} lineCap="round" />
      <Line points={() => { const z = zones(); return [z.umbTop.S, z.umbTop.T, [SCREEN_X, z.umbTop.y]]; }} stroke={COLORS.amber} lineWidth={3} opacity={() => boundaryOp()} lineCap="round" />
      <Line points={() => { const z = zones(); return [z.umbBot.S, z.umbBot.T, [SCREEN_X, z.umbBot.y]]; }} stroke={COLORS.amber} lineWidth={3} opacity={() => boundaryOp()} lineCap="round" />

      {/* "Teil der Lampe sichtbar": vom Halbschatten-Punkt zur oberen Quelle + Ballkante */}
      <Line points={() => [ppen(), [SRC_X, CY - srcHalf()]]} stroke={COLORS.green} lineWidth={4} opacity={() => teilOp()} lineCap="round" />
      <Line points={() => [ppen(), [BALL[0], BALL[1] - R]]} stroke={COLORS.green} lineWidth={4} lineDash={[10, 8]} opacity={() => teilOp()} lineCap="round" />
      <Txt position={[-330, -250]} text="Teil der Lampe sichtbar" fill={COLORS.green} fontFamily={FONT} fontSize={30} fontWeight={800} opacity={() => teilOp()} />
      <Txt position={() => pumb()} text="✗" fill={COLORS.red} fontFamily={FONT} fontSize={54} fontWeight={900} opacity={() => teilOp()} offsetX={1.6} />
      <Txt position={[SCREEN_X - 250, 250]} text="Kernschatten: keine Lampe sichtbar" fill={COLORS.red} fontFamily={FONT} fontSize={26} fontWeight={800} opacity={() => teilOp()} />

      {/* Ball (undurchsichtig) */}
      <Circle position={BALL} size={2 * R} fill={COLORS.indigoDeep} stroke={COLORS.ink} lineWidth={5} opacity={() => objOp()} />
      <Txt position={[BALL[0], BALL[1] + R + 34]} text="Ball" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} opacity={() => objOp()} />

      {/* Lichtquelle (wächst von Punkt zu Röhre) */}
      <Rect position={[SRC_X, CY]} width={30} height={() => 2 * srcHalf() + 26} radius={16} fill={COLORS.amber} opacity={() => 0.30 * glow()} scale={2.1} />
      <Rect position={[SRC_X, CY]} width={30} height={() => 2 * srcHalf() + 26} radius={16} fill={COLORS.amber} stroke={COLORS.ink} lineWidth={3} opacity={() => objOp()} />
      <Txt position={[SRC_X, CY]} text="☀️" fontSize={() => 40 + srcHalf() * 0.7} opacity={() => sunOp()} />
      <Txt position={() => [SRC_X, CY + srcHalf() + 60]} text="Lichtquelle" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} opacity={() => objOp()} />

      {/* Zonen-Labels */}
      <Txt position={() => umbMid()} text="Kernschatten" fill={COLORS.ink} fontFamily={FONT} fontSize={30} fontWeight={900} opacity={() => kernLabelOp()} />
      <Txt position={() => halbAnchor()} text="Halbschatten" fill={COLORS.amber} fontFamily={FONT} fontSize={28} fontWeight={900} opacity={() => halbLabelOp()} />

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 430]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />
    </Node>,
  );

  // ── 1 · intro (9.0333 s): Punktquelle, scharfer Schatten ─────────────
  yield* all(objOp(1, 1.2), glow(1, 1.2));
  yield* rayOp(1, 0.4);
  yield* rayGrow(1, 1.0);
  yield* shadowOp(1, 0.8);
  yield* waitFor(5.6333);

  // ── 2 · punkt (10.5667 s): scharfer Kernschatten benannt ─────────────
  yield* kernLabelOp(1, 0.6);
  yield* waitFor(9.9667);

  // ── 3 · ausdehnen (10.8667 s): Quelle wächst → Halbschatten ──────────
  yield* srcHalf(95, 3.2);
  yield* halbLabelOp(1, 0.6);
  yield* waitFor(7.0667);

  // ── 4 · halbschatten (11.0333 s): Randstrahlen zeigen die Zonen ──────
  yield* boundaryOp(1, 0.8);
  yield* waitFor(3.0);
  yield* boundaryOp(0.35, 0.8);
  yield* waitFor(6.4333);

  // ── 5 · fehlvorstellung (12.1667 s): Teil der Lampe sichtbar ─────────
  yield* teilOp(1, 0.8);
  yield* waitFor(4.0);
  yield* teilOp(0, 0.8);
  yield* waitFor(6.5667);

  // ── 6 · sonne (8.9 s): klein→scharf, groß→weich (Sonne) ──────────────
  yield* all(srcHalf(6, 1.6), boundaryOp(0, 0.4));
  yield* waitFor(1.6);
  yield* all(srcHalf(95, 2.0), sunOp(1, 1.0));
  yield* waitFor(3.7);

  // ── 7 · merksatz (8.8 s): ruhig, beide Zonen ─────────────────────────
  yield* sunOp(0, 0.6);
  yield* waitFor(1.0);
  yield* all(kernLabelOp(1, 0.4), halbLabelOp(1, 0.4));
  yield* waitFor(6.8);

  // ── 8 · outro (6.9667 s) ─────────────────────────────────────────────
  yield* all(glow(1, 0.6), rayGrow(1, 0.6));
  yield* logoOp(1, 0.8);
  yield* waitFor(5.2667);
  yield* waitFor(0.3);
});
