import {makeScene2D, Circle, Line, Rect, Txt, Node} from '@motion-canvas/2d';
import {createSignal, all, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: Wovon hängt die Größe des Schattens ab? (Klasse 5 RS).
// NUR Fachanimation (Strahlenfächer, beweglicher Ball + Schirm, Schattenkegel + grüne
// Messklammer), kein Titel/Untertitel – das legt Remotion drüber. Segmentdauern framegenau
// an die Eva-Audios (Piper, schatten-groesse-mc.timings.json → durOf; siehe
// scripts/print-durations.mjs).
//
// Didaktischer Kern: Der Ball bleibt IMMER gleich groß. Verändert werden nur die Abstände.
// (1) Ball nah an die Lampe → Tangentenstrahlen laufen weit auseinander → Schatten wächst.
// (2) Ball nah an den Schirm → Schatten ≈ Ball. (3) Schirm weiter weg → Schatten wächst.
// → Nicht die Größe des Körpers entscheidet, sondern die Abstände.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  // ── Geometrie (MC: +y = nach unten) ──────────────────────────────────
  const LAMP: [number, number] = [-780, 20];
  const R = 80;
  const ballX = createSignal(-40);   // Ball wandert zwischen Lampe und Schirm
  const screenX = createSignal(600); // Schirm kann weggeschoben werden
  const ballPos = (): [number, number] => [ballX(), LAMP[1]];

  // Tangenten Lampe→Ball, bis zum (beweglichen) Schirm verlängert → Schattenränder.
  const edges = (bx: number, sx: number) => {
    const dx = LAMP[0] - bx;
    const dy = 0;
    const d = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx);
    const phi = Math.acos(Math.min(1, R / d));
    const T1: [number, number] = [bx + R * Math.cos(a + phi), LAMP[1] + R * Math.sin(a + phi)];
    const T2: [number, number] = [bx + R * Math.cos(a - phi), LAMP[1] + R * Math.sin(a - phi)];
    const ext = (T: [number, number]): [number, number] => {
      const t = (sx - LAMP[0]) / (T[0] - LAMP[0]);
      return [sx, LAMP[1] + t * (T[1] - LAMP[1])];
    };
    return {T1, T2, E1: ext(T1), E2: ext(T2)};
  };
  const shadowPoly = (): [number, number][] => {
    const {T1, E1, E2, T2} = edges(ballX(), screenX());
    return [T1, E1, E2, T2];
  };
  const bandMid = (): [number, number] => {
    const {E1, E2} = edges(ballX(), screenX());
    return [(E1[0] + E2[0]) / 2 - 150, (E1[1] + E2[1]) / 2];
  };
  const brkTop = (): [number, number] => [screenX() + 46, edges(ballX(), screenX()).E1[1]];
  const brkBot = (): [number, number] => [screenX() + 46, edges(ballX(), screenX()).E2[1]];

  // Strahlenfächer: feste Ziel-y auf dem (beweglichen) Schirm, Ursprung = Lampe.
  const NRAYS = 13;
  const rayYs = Array.from({length: NRAYS}, (_, i) => -360 + 720 * (i / (NRAYS - 1)));

  // ── Signale ──────────────────────────────────────────────────────────
  const objOp = createSignal(0);
  const lampGlow = createSignal(0);
  const rayOp = createSignal(0);
  const rayGrow = createSignal(0);
  const shadowOp = createSignal(0);   // Kegel + Band + Messklammer
  const labelOp = createSignal(0);    // "Schatten"-Label
  const biggerOp = createSignal(0);   // grün "→ größer"
  const smallerOp = createSignal(0);  // amber "→ kleiner"
  const logoOp = createSignal(0);

  view.add(
    <Node>
      {/* Schirm (hell, beweglich) */}
      <Rect position={() => [screenX() + 16, 0]} width={20} height={820} radius={6} fill={COLORS.muted} opacity={() => objOp()} />
      <Txt position={() => [screenX() + 16, -448]} text="Schirm" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} opacity={() => objOp()} />

      {/* Strahlenfächer (geradlinig) */}
      {rayYs.map((y, i) => (
        <Line
          points={() => [LAMP, [screenX(), y]]}
          stroke={COLORS.amber}
          lineWidth={3}
          end={() => rayGrow()}
          opacity={() => 0.5 * rayOp()}
          lineCap="round"
        />
      ))}

      {/* Schattenkegel (dunkel) */}
      <Line points={() => shadowPoly()} closed fill={COLORS.bg0} opacity={() => 0.92 * shadowOp()} />

      {/* Mess-Klammer des Schattens (grün, beidseitige Pfeile) */}
      <Line points={() => [brkTop(), brkBot()]} stroke={COLORS.green} lineWidth={6} startArrow endArrow arrowSize={16} opacity={() => shadowOp()} lineCap="round" />

      {/* Ball (undurchsichtig, GLEICH groß, beweglich) */}
      <Circle position={() => ballPos()} size={2 * R} fill={COLORS.indigoDeep} stroke={COLORS.ink} lineWidth={5} opacity={() => objOp()} />
      <Txt position={() => [ballX(), LAMP[1] + R + 34]} text="Ball" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} opacity={() => objOp()} />

      {/* Lampe (Punktlichtquelle) */}
      <Circle position={LAMP} size={200} fill={COLORS.amber} opacity={() => 0.28 * lampGlow()} />
      <Txt position={LAMP} text="💡" fontSize={110} opacity={() => objOp()} />
      <Txt position={[LAMP[0], LAMP[1] + 96]} text="Lampe" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} opacity={() => objOp()} />

      {/* "Schatten"-Label folgt dem dunklen Band */}
      <Txt position={() => bandMid()} text="Schatten" fill={COLORS.green} fontFamily={FONT} fontSize={38} fontWeight={900} opacity={() => labelOp()} />

      {/* größer / kleiner Callouts (oben) */}
      <Txt position={[140, -300]} text="→ Schatten größer" fill={COLORS.green} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => biggerOp()} />
      <Txt position={[140, -300]} text="→ Schatten kleiner" fill={COLORS.amber} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => smallerOp()} />

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 430]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />
    </Node>,
  );

  // ── 1 · intro (DUR_s 11.3): alles + gemessener Schatten blenden ein ──
  yield* all(objOp(1, 1.2), lampGlow(1, 1.2));
  yield* rayOp(1, 0.4);
  yield* rayGrow(1, 1.0);
  yield* shadowOp(1, 0.8);
  yield* labelOp(1, 0.5);
  yield* waitFor(7.4);

  // ── 2 · frage (DUR_s 9.4667): Ball gleich, Schatten messbar ──────────
  yield* waitFor(2.2);
  yield* labelOp(0.5, 0.4);
  yield* labelOp(1, 0.4);
  yield* waitFor(6.4667);

  // ── 3 · nah (DUR_s 9.9667): Ball an die Lampe → Schatten wächst ─────
  yield* all(ballX(-460, 2.6), biggerOp(1, 1.0));
  yield* waitFor(2.4);
  yield* biggerOp(0, 0.6);
  yield* waitFor(4.3667);

  // ── 4 · fern (DUR_s 11.3333): Ball an den Schirm → Schatten ≈ Ball ──
  yield* all(ballX(330, 3.0), smallerOp(1, 1.0));
  yield* waitFor(2.2);
  yield* smallerOp(0, 0.6);
  yield* waitFor(5.5333);

  // ── 5 · fehlvorstellung (DUR_s 13.9333): Ball nie verändert, nur Abstand
  yield* ballX(-40, 1.6);
  yield* waitFor(3.0);
  yield* all(ballX(-440, 2.4), biggerOp(1, 0.8));
  yield* biggerOp(0, 0.6);
  yield* ballX(-40, 2.2);
  yield* waitFor(4.1333);

  // ── 6 · schirm (DUR_s 10.5333): Schirm weiter weg → Schatten wächst ─
  yield* all(screenX(860, 3.2), biggerOp(1, 1.0));
  yield* waitFor(2.2);
  yield* biggerOp(0, 0.6);
  yield* screenX(600, 1.6);
  yield* waitFor(2.9333);

  // ── 7 · merksatz (DUR_s 11.0): beide Abstände → sehr groß, dann ruhig ─
  yield* waitFor(1.0);
  yield* all(ballX(-440, 2.0), screenX(820, 2.0), biggerOp(1, 1.0));
  yield* waitFor(2.6);
  yield* biggerOp(0, 0.6);
  yield* all(ballX(-40, 1.6), screenX(600, 1.6));
  yield* waitFor(3.2);

  // ── 8 · outro (DUR_s 7.2) ────────────────────────────────────────────
  yield* all(rayGrow(1, 0.6), lampGlow(1, 0.6));
  yield* logoOp(1, 0.8);
  yield* waitFor(5.5);
  yield* waitFor(0.3);
});
