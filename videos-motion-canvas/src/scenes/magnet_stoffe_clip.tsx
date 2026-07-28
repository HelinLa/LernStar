import {makeScene2D, Line, Rect, Txt, Node} from '@motion-canvas/2d';
import {createSignal, all, waitFor, Vector2} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: Welche Stoffe zieht ein Magnet an? (Klasse 5 RS).
// NUR Fachanimation (Prüfmagnet, Materialkarten, Sortieren, Schrottplatz-Kran).
// Kern-Fehlvorstellung: „ein Magnet zieht jedes Metall an" → Kupfer/Alu bleiben liegen;
// magnetisch sind nur Eisen, Nickel, Kobalt (und Stahl). Titel/Untertitel via Remotion.
// Segmentdauern an magnet-stoffe-mc.timings.json (Eva/Piper) → durOf (TAIL=20;
// siehe scripts/print-durations.mjs). Nur die Halte-waitFor sind getaktet.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);
  const ink = COLORS.ink;

  // Materialkarten – Startpositionen (zwei Reihen)
  const nagelPos = createSignal(new Vector2(-360, 130));
  const klammerPos = createSignal(new Vector2(-240, 240));
  const kupferPos = createSignal(new Vector2(-120, 130));
  const aluPos = createSignal(new Vector2(0, 240));
  const holzPos = createSignal(new Vector2(120, 130));
  const plastikPos = createSignal(new Vector2(240, 240));
  const glasPos = createSignal(new Vector2(360, 130));
  const itemsOp = createSignal(0);

  const magOp = createSignal(0);
  const magPos = createSignal(new Vector2(0, -320));

  const ironBadgeOp = createSignal(0); // ✓ auf Eisen/Stahl
  const cuBadgeOp = createSignal(0);   // ✗ auf Kupfer
  const alBadgeOp = createSignal(0);   // ✗ auf Alu

  const colHdrOp = createSignal(0);
  const leftFrameOp = createSignal(0);
  const chipsOp = createSignal(0);
  const arrowsOp = createSignal(0);

  const craneOp = createSignal(0);
  const craneY = createSignal(-360);
  const liftBadgeOp = createSignal(0);

  const logoOp = createSignal(0);

  // Prüfmagnet (horizontal, S|N)
  const HALF = 120, H = 78;
  const Pruefmagnet = () => (
    <Node position={() => magPos()} opacity={() => magOp()}>
      <Rect x={-HALF / 2} width={HALF} height={H} radius={[14, 0, 0, 14]} fill={COLORS.sky} stroke={ink} lineWidth={3} />
      <Rect x={HALF / 2} width={HALF} height={H} radius={[0, 14, 14, 0]} fill={COLORS.red} stroke={ink} lineWidth={3} />
      <Txt x={-HALF / 2} text="S" fill={ink} fontFamily={FONT} fontSize={38} fontWeight={900} />
      <Txt x={HALF / 2} text="N" fill={ink} fontFamily={FONT} fontSize={38} fontWeight={900} />
    </Node>
  );

  const Card = (pos: () => Vector2, label: string, fill: string, badge?: {op: () => number; sym: string; col: string}) => (
    <Node position={() => pos()} opacity={() => itemsOp()}>
      <Rect width={150} height={66} radius={12} fill={fill} stroke={ink} lineWidth={3} />
      <Txt text={label} fill={ink} fontFamily={FONT} fontSize={26} fontWeight={800} />
      {badge ? <Txt position={[94, -42]} text={badge.sym} fill={badge.col} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => badge.op()} /> : null}
    </Node>
  );

  view.add(
    <Node>
      {/* Spalten-Überschriften */}
      <Txt position={[-380, -250]} text="magnetisch" fill={COLORS.green} fontFamily={FONT} fontSize={32} fontWeight={900} opacity={() => colHdrOp()} />
      <Txt position={[280, -250]} text="nicht magnetisch" fill={COLORS.muted} fontFamily={FONT} fontSize={32} fontWeight={900} opacity={() => colHdrOp()} />
      <Rect position={[-380, -50]} width={230} height={250} radius={16} stroke={COLORS.green} lineWidth={4} lineDash={[12, 8]} opacity={() => leftFrameOp()} />

      {/* Chips: nur diese drei sind magnetisch */}
      <Node opacity={() => chipsOp()}>
        {['Eisen', 'Nickel', 'Kobalt'].map((t, i) => (
          <Node position={[-380, 175 + i * 66]}>
            <Rect width={160} height={52} radius={26} fill={COLORS.green} stroke={ink} lineWidth={2} />
            <Txt text={t} fill={COLORS.bg0} fontFamily={FONT} fontSize={26} fontWeight={900} />
          </Node>
        ))}
        <Txt position={[-380, 175 + 3 * 66]} text="(+ Stahl)" fill={COLORS.muted} fontFamily={FONT} fontSize={24} fontWeight={700} />
      </Node>

      {/* Regel-Pfeile */}
      <Line points={[[-120, -250], [-330, -120]]} stroke={COLORS.green} lineWidth={7} endArrow arrowSize={20} opacity={() => arrowsOp()} lineCap="round" />
      <Line points={[[120, -250], [250, -120]]} stroke={COLORS.red} lineWidth={7} endArrow arrowSize={20} opacity={() => arrowsOp()} lineCap="round" />

      {/* Materialkarten */}
      {Card(() => nagelPos(), 'Eisen', COLORS.ground, {op: () => ironBadgeOp(), sym: '✓', col: COLORS.green})}
      {Card(() => klammerPos(), 'Stahl', '#475569', {op: () => ironBadgeOp(), sym: '✓', col: COLORS.green})}
      {Card(() => kupferPos(), 'Kupfer', '#b45309', {op: () => cuBadgeOp(), sym: '✗', col: COLORS.muted})}
      {Card(() => aluPos(), 'Alu', '#64748b', {op: () => alBadgeOp(), sym: '✗', col: COLORS.muted})}
      {Card(() => holzPos(), 'Holz', '#92400e')}
      {Card(() => plastikPos(), 'Plastik', '#0d9488')}
      {Card(() => glasPos(), 'Glas', '#0369a1')}

      {/* Prüfmagnet */}
      <Pruefmagnet />

      {/* Schrottplatz-Kran */}
      <Node opacity={() => craneOp()}>
        <Line points={() => [[0, -560], [0, craneY() - 34]]} stroke={COLORS.border} lineWidth={5} />
        <Rect position={() => [0, craneY()]} width={230} height={58} radius={12} fill={COLORS.amber} stroke={ink} lineWidth={3} />
        <Txt position={() => [0, craneY()]} text="Magnetkran" fill={COLORS.bg0} fontFamily={FONT} fontSize={26} fontWeight={900} />
        <Txt position={[300, -220]} text="Eisen ✓" fill={COLORS.green} fontFamily={FONT} fontSize={30} fontWeight={900} opacity={() => liftBadgeOp()} />
      </Node>

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 0]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={48} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />
    </Node>,
  );

  // ── 1 · intro (DUR_s 13.9333) ────────────────────────────────────────
  yield* all(itemsOp(1, 1.0), magOp(1, 1.0));
  yield* waitFor(12.9333);

  // ── 2 · eisen (DUR_s 11.3667): Nagel & Stahl springen an den Magneten ─
  yield* magPos([0, -150], 1.1);
  yield* all(nagelPos([-70, -60], 0.7), klammerPos([70, -60], 0.7), ironBadgeOp(1, 0.5));
  yield* waitFor(2.6);
  yield* all(magPos([0, -320], 1.0), nagelPos([-360, 130], 0.9), klammerPos([-240, 240], 0.9), ironBadgeOp(0, 0.4));
  yield* waitFor(5.9667);

  // ── 3 · fehlvorstellung (DUR_s 14.5333): Kupfer & Alu bleiben liegen ─
  yield* magPos([-120, 10], 1.1);
  yield* cuBadgeOp(1, 0.5);
  yield* waitFor(1.8);
  yield* magPos([0, 120], 1.1);
  yield* alBadgeOp(1, 0.5);
  yield* waitFor(1.8);
  yield* magPos([0, -320], 1.0);
  yield* waitFor(6.7333);

  // ── 4 · sortieren (DUR_s 14.4333) ────────────────────────────────────
  yield* all(cuBadgeOp(0, 0.4), alBadgeOp(0, 0.4));
  yield* colHdrOp(1, 0.6);
  yield* all(nagelPos([-380, -110], 1.2), klammerPos([-380, 10], 1.2));
  yield* all(kupferPos([180, -140], 1.2), aluPos([380, -140], 1.2), holzPos([180, -10], 1.2), plastikPos([380, -10], 1.2), glasPos([180, 120], 1.2));
  yield* waitFor(11.0333);

  // ── 5 · nurdrei (DUR_s 14.4): Eisen, Nickel, Kobalt ─────────────────
  yield* leftFrameOp(1, 0.6);
  yield* chipsOp(1, 0.8);
  yield* waitFor(13.0);

  // ── 6 · regel (DUR_s 11.5667) ────────────────────────────────────────
  yield* magPos([0, -300], 0.9);
  yield* arrowsOp(1, 0.6);
  yield* waitFor(10.0667);

  // ── 7 · anwendung (DUR_s 13.2): Magnetkran hebt nur Eisen heraus ─────
  yield* all(colHdrOp(0, 0.4), leftFrameOp(0, 0.4), chipsOp(0, 0.4), arrowsOp(0, 0.4), magOp(0, 0.4));
  yield* all(craneOp(1, 0.5), craneY(-140, 1.0));
  yield* all(nagelPos([-60, -40], 0.9), klammerPos([60, -40], 0.9));
  yield* liftBadgeOp(1, 0.4);
  yield* all(craneY(-330, 1.2), nagelPos([-60, -230], 1.2), klammerPos([60, -230], 1.2));
  yield* waitFor(9.3);

  // ── 8 · outro (DUR_s 8.0667) ─────────────────────────────────────────
  yield* all(itemsOp(0, 0.5), craneOp(0, 0.5), liftBadgeOp(0, 0.5));
  yield* logoOp(1, 0.8);
  yield* waitFor(6.7667);
});
