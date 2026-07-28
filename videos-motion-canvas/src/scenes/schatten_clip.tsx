import {makeScene2D, Circle, Line, Rect, Txt, Node} from '@motion-canvas/2d';
import {createSignal, all, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: Wie entsteht ein Schatten? (Klasse 5 RS).
// NUR Fachanimation (Strahlenfächer, Ball, Schirm, Schattenkegel), kein Titel/Untertitel –
// das legt Remotion drüber. Segmentdauern framegenau an die Eva-Audios (Piper,
// schatten-mc.timings.json → durOf; siehe scripts/print-durations.mjs), Clip läuft
// über alle 8 Szenen KONTINUIERLICH und synchron.
//
// Didaktischer Kern: Licht läuft GERADLINIG. Ein undurchsichtiger Ball hält die Strahlen
// auf → dahinter ein dunkler Kegel = Schatten (reaktiv aus den Tangenten an den Ball).
// (1) Licht AUS → Schatten verschwindet ganz → Schatten ist FEHLENDES Licht, kein Ding.
// (2) Gekrümmter Strahl-Versuch wird rot durchgestrichen → Licht biegt nicht um den Ball.
// (3) Lampe bewegt sich → Kegel schwenkt gegenüber → Schatten immer der Lampe gegenüber.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  // ── Geometrie (MC: +y = nach unten) ──────────────────────────────────
  const LAMP_X = -760;
  const SCREEN_X = 680;
  const BALL: [number, number] = [40, 60];
  const R = 95;
  const lampY = createSignal(-20);
  const lampPos = (): [number, number] => [LAMP_X, lampY()];

  // Tangenten von der Punktlampe an den Ball → Schattenkegel-Ränder, bis zum Schirm verlängert.
  const tangents = (ly: number) => {
    const dx = LAMP_X - BALL[0];
    const dy = ly - BALL[1];
    const d = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx);
    const phi = Math.acos(Math.min(1, R / d));
    const T1: [number, number] = [BALL[0] + R * Math.cos(a + phi), BALL[1] + R * Math.sin(a + phi)];
    const T2: [number, number] = [BALL[0] + R * Math.cos(a - phi), BALL[1] + R * Math.sin(a - phi)];
    const ext = (T: [number, number]): [number, number] => {
      const t = (SCREEN_X - LAMP_X) / (T[0] - LAMP_X);
      return [SCREEN_X, ly + t * (T[1] - ly)];
    };
    return {T1, T2, E1: ext(T1), E2: ext(T2)};
  };
  const shadowPoly = (ly: number): [number, number][] => {
    const {T1, E1, E2, T2} = tangents(ly);
    return [T1, E1, E2, T2];
  };
  const bandMid = (ly: number): [number, number] => {
    const {E1, E2} = tangents(ly);
    return [(E1[0] + E2[0]) / 2 - 150, (E1[1] + E2[1]) / 2];
  };

  // Strahlenfächer: feste Zielpunkte auf dem Schirm, Ursprung = (bewegliche) Lampe.
  const NRAYS = 13;
  const rayTargets: [number, number][] = Array.from({length: NRAYS}, (_, i) => [
    SCREEN_X,
    -360 + 720 * (i / (NRAYS - 1)),
  ]);

  // ── Signale ──────────────────────────────────────────────────────────
  const objOp = createSignal(0);    // Lampe + Schirm einblenden
  const lampGlow = createSignal(0); // Leuchten der Lampe
  const rayOp = createSignal(0);    // Strahlenfächer sichtbar
  const rayGrow = createSignal(0);  // Strahlen wachsen zum Schirm (end 0..1)
  const lightOn = createSignal(1);  // Master-Licht (Strahlen & Kegel) – 1 = an
  const ballOp = createSignal(0);   // Ball erscheint (Szene 3)
  const shadowOp = createSignal(0); // Schattenkegel sichtbar
  const labelOp = createSignal(0);  // "Schatten"-Label
  const bendOp = createSignal(0);   // gekrümmter Falsch-Strahl + ✗
  const logoOp = createSignal(0);

  view.add(
    <Node>
      {/* Schirm / Wand (hell) */}
      <Rect position={[SCREEN_X + 16, 0]} width={20} height={820} radius={6} fill={COLORS.muted} opacity={() => objOp()} />
      <Txt position={[SCREEN_X + 16, -448]} text="Schirm" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} opacity={() => objOp()} />

      {/* Strahlenfächer (geradlinig, amber) */}
      {rayTargets.map((tgt, i) => (
        <Line
          points={() => [lampPos(), tgt]}
          stroke={COLORS.amber}
          lineWidth={3}
          end={() => rayGrow()}
          opacity={() => 0.5 * rayOp() * lightOn()}
          lineCap="round"
        />
      ))}

      {/* Gekrümmter Falsch-Strahl (biegt um den Ball) + Kreuz */}
      <Line
        points={[[LAMP_X + 40, -20], [-260, -190], [60, -120], [330, 40], [540, 150]]}
        stroke={COLORS.red}
        lineWidth={5}
        lineDash={[14, 12]}
        endArrow
        arrowSize={18}
        opacity={() => bendOp()}
        lineCap="round"
      />
      <Txt position={[90, -195]} text="✗" fill={COLORS.red} fontFamily={FONT} fontSize={74} fontWeight={900} opacity={() => bendOp()} />

      {/* Schattenkegel (dunkel) – überdeckt Strahlen & Schirm hinter dem Ball */}
      <Line points={() => shadowPoly(lampY())} closed fill={COLORS.bg0} opacity={() => 0.92 * shadowOp() * lightOn()} />

      {/* Ball (undurchsichtiger Körper) */}
      <Circle position={BALL} size={2 * R} fill={COLORS.indigoDeep} stroke={COLORS.ink} lineWidth={5} opacity={() => ballOp()} />
      <Txt position={[BALL[0], BALL[1] + R + 34]} text="Ball" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} opacity={() => ballOp()} />

      {/* Lampe (Punktlichtquelle) */}
      <Circle position={() => lampPos()} size={200} fill={COLORS.amber} opacity={() => 0.28 * lampGlow()} />
      <Txt position={() => lampPos()} text="💡" fontSize={120} opacity={() => objOp()} />
      <Txt position={() => [LAMP_X, lampY() + 96]} text="Lampe" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={700} opacity={() => objOp()} />

      {/* "Schatten"-Label folgt dem dunklen Band am Schirm */}
      <Txt position={() => bandMid(lampY())} text="Schatten" fill={COLORS.red} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => labelOp()} />

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 430]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />
    </Node>,
  );

  // ── 1 · intro (DUR_s 13.2333): Lampe + Schirm blenden ein ────────────
  yield* all(objOp(1, 1.4), lampGlow(1, 1.4));
  yield* waitFor(11.8333);

  // ── 2 · strahlen (DUR_s 10.3333): gerader Strahlenfächer zum Schirm ──
  yield* rayOp(1, 0.5);
  yield* rayGrow(1, 1.3);
  yield* waitFor(8.5333);

  // ── 3 · schatten (DUR_s 12.8667): Ball in den Weg → Kegel + Label ────
  yield* ballOp(1, 0.8);
  yield* waitFor(0.4);
  yield* shadowOp(1, 1.0);
  yield* labelOp(1, 0.6);
  yield* waitFor(10.0667);

  // ── 4 · fehlvorstellung (DUR_s 16.1333): Licht AUS → Schatten weg → AN
  yield* waitFor(3.5);
  yield* all(lightOn(0, 0.9), lampGlow(0.12, 0.9), labelOp(0, 0.6)); // Licht AUS – Schatten verschwindet
  yield* waitFor(3.2);
  yield* all(lightOn(1, 0.9), lampGlow(1, 0.9), labelOp(1, 0.6));    // Licht AN
  yield* waitFor(7.6333);

  // ── 5 · geradlinig (DUR_s 12.8): gekrümmter Strahl → rotes ✗ ─────────
  yield* bendOp(1, 0.8);
  yield* waitFor(3.0);
  yield* bendOp(0, 0.8);
  yield* waitFor(8.2);

  // ── 6 · bewegen (DUR_s 13.6667): Lampe wandert → Kegel schwenkt gegenüber
  yield* lampY(-320, 2.2);  // Lampe hoch → Schatten runter
  yield* waitFor(2.0);
  yield* lampY(140, 2.2);   // Lampe runter → Schatten hoch
  yield* waitFor(2.0);
  yield* lampY(-20, 1.4);   // zurück zur Mitte
  yield* waitFor(3.8667);

  // ── 7 · merksatz (DUR_s 12.7333): ruhiges Standbild, kurzer Label-Blink
  yield* waitFor(2.0);
  yield* labelOp(0.4, 0.5);
  yield* labelOp(1, 0.5);
  yield* waitFor(9.7333);

  // ── 8 · outro (DUR_s 7.2667) ─────────────────────────────────────────
  yield* all(rayGrow(1, 0.6), lampGlow(1, 0.6));
  yield* logoOp(1, 0.8);
  yield* waitFor(5.5667);
  yield* waitFor(0.3);
});
