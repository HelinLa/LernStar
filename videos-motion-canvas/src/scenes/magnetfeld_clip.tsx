import {makeScene2D, Line, Rect, Txt, Node, Circle} from '@motion-canvas/2d';
import {createSignal, all, waitFor, Vector2} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: Wie sieht ein Magnetfeld aus? (Klasse 5 RS).
// NUR Fachanimation (Stabmagnet, Feldlinien + Eisenspäne, laufender Richtungsmarker,
// beweglicher Prüfkompass – Nadel steht IMMER tangential zum Dipolfeld –, Feldstärke-Gauge).
// Kern-Fehlvorstellung: Feldlinien sind keine Fäden; auch ZWISCHEN ihnen ist das Feld da.
// Titel/Untertitel via Remotion. durOf an magnetfeld-mc.timings.json (Eva/Piper),
// TAIL=20; siehe scripts/print-durations.mjs. Nur die Halte-waitFor sind getaktet.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);
  const ink = COLORS.ink;
  const NCOL = COLORS.red, SCOL = COLORS.sky;
  const HALF = 130, H = 92;

  const magOp = createSignal(0);
  const magY = createSignal(0);
  const fieldOp = createSignal(0);
  const filOp = createSignal(0);
  const markerOp = createSignal(0);
  const markerT = createSignal(0);
  const compassOp = createSignal(0);
  const compassPos = createSignal(new Vector2(300, -140));
  const gaugeOp = createSignal(0);
  const betweenRingOp = createSignal(0);
  const logoOp = createSignal(0);

  // Dipolfeld (m entlang +x): Richtung & (qualitative) Stärke an einem Punkt.
  const fieldAngle = (p: Vector2) => {
    const x = p.x, y = p.y;
    const r2 = Math.max(1, x * x + y * y);
    const bx = (3 * x * x) / r2 - 1;
    const by = (3 * x * y) / r2;
    return (Math.atan2(by, bx) * 180) / Math.PI;
  };
  const strengthFrac = () => {
    const p = compassPos();
    const dP = Math.min(Math.hypot(p.x - HALF, p.y), Math.hypot(p.x + HALF, p.y));
    return Math.max(0.06, Math.min(1, Math.pow(150 / Math.max(42, dP), 1.5)));
  };

  // Feldlinien (Dipol-Schleifen N→S, oben & unten, mit Richtungspfeil am S-Ende)
  const loop = (ay: number, sign: number) => {
    const ax = HALF + 22 + ay * 0.55;
    const pts: [number, number][] = [];
    const M = 46;
    for (let i = 0; i <= M; i++) {
      const t = (Math.PI * i) / M;
      pts.push([ax * Math.cos(t), sign * ay * Math.sin(t)]);
    }
    return <Line points={pts} stroke={SCOL} lineWidth={3} lineCap="round" endArrow arrowSize={12}
                 opacity={() => fieldOp()} end={() => fieldOp()} />;
  };
  const fieldLines = [
    loop(20, -1), loop(72, -1), loop(140, -1), loop(210, -1),
    loop(20, 1), loop(72, 1), loop(140, 1), loop(210, 1),
  ];

  // Eisenspäne entlang des Feldes
  const filings: any[] = [];
  for (let gx = -430; gx <= 430; gx += 86) {
    for (let gy = -240; gy <= 240; gy += 80) {
      if (Math.abs(gx) < HALF + 26 && Math.abs(gy) < H / 2 + 26) continue;
      const r = Math.hypot(gx, gy);
      if (r < 60) continue;
      const bx = (3 * gx * gx) / (r * r) - 1;
      const by = (3 * gx * gy) / (r * r);
      const ang = (Math.atan2(by, bx) * 180) / Math.PI;
      filings.push(<Rect position={[gx, gy]} width={20} height={4} radius={2} fill={COLORS.muted} rotation={ang} opacity={() => filOp()} />);
    }
  }

  // Richtungsmarker läuft entlang der oberen Linie (ay=140) von N nach S
  const MAX = HALF + 22 + 140 * 0.55; // = 229
  const markerX = () => MAX * Math.cos(Math.PI * markerT());
  const markerY = () => -140 * Math.sin(Math.PI * markerT());

  view.add(
    <Node>
      {fieldLines}
      {filings}

      {/* Hero-Magnet */}
      <Node position={() => [0, magY()]} opacity={() => magOp()}>
        <Rect x={-HALF / 2} width={HALF} height={H} radius={[16, 0, 0, 16]} fill={SCOL} stroke={ink} lineWidth={3} />
        <Rect x={HALF / 2} width={HALF} height={H} radius={[0, 16, 16, 0]} fill={NCOL} stroke={ink} lineWidth={3} />
        <Txt x={-HALF / 2} text="S" fill={ink} fontFamily={FONT} fontSize={52} fontWeight={900} />
        <Txt x={HALF / 2} text="N" fill={ink} fontFamily={FONT} fontSize={52} fontWeight={900} />
      </Node>

      {/* Richtungsmarker */}
      <Circle position={() => [markerX(), markerY()]} size={22} fill={COLORS.green} stroke={ink} lineWidth={2} opacity={() => markerOp()} />

      {/* Prüfkompass – Nadel tangential zum Feld */}
      <Node position={() => compassPos()} opacity={() => compassOp()}>
        <Circle size={116} fill={COLORS.panelSolid} stroke={COLORS.border} lineWidth={4} />
        <Circle size={116} stroke={COLORS.amber} lineWidth={4} lineDash={[10, 8]} opacity={() => betweenRingOp()} />
        <Node rotation={() => fieldAngle(compassPos())}>
          <Line points={[[0, 0], [48, 0]]} stroke={NCOL} lineWidth={10} endArrow arrowSize={16} lineCap="round" />
          <Line points={[[0, 0], [-48, 0]]} stroke={SCOL} lineWidth={10} lineCap="round" />
        </Node>
        <Circle size={12} fill={ink} />
      </Node>

      {/* Feldstärke-Gauge (oben rechts) */}
      <Node position={[560, -382]} opacity={() => gaugeOp()}>
        <Txt position={[0, -32]} text="Feldstärke" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={800} />
        <Rect width={300} height={26} radius={13} stroke={COLORS.border} lineWidth={3} fill={COLORS.panelSolid} />
        <Rect position={() => [-150 + (strengthFrac() * 300) / 2, 0]} width={() => strengthFrac() * 300} height={20} radius={10} fill={COLORS.amber} />
      </Node>

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 250]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={44} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />
    </Node>,
  );

  // ── 1 · intro (DUR_s 13.9333) ────────────────────────────────────────
  yield* magOp(1, 1.3);
  yield* waitFor(12.6333);

  // ── 2 · feldlinien (DUR_s 13.0) ──────────────────────────────────────
  yield* fieldOp(1, 1.7);
  yield* filOp(1, 1.4);
  yield* waitFor(9.9);

  // ── 3 · richtung (DUR_s 13.0667): Marker läuft N→S ───────────────────
  yield* markerOp(1, 0.4);
  yield* markerT(1, 2.3);
  yield* markerT(0, 0.01);
  yield* markerT(1, 2.3);
  yield* waitFor(8.0567);

  // ── 4 · pruefkompass (DUR_s 12.8333): Nadel folgt überall dem Feld ───
  yield* all(compassOp(1, 0.5), markerOp(0, 0.4));
  yield* all(compassPos([250, -140], 1.3), gaugeOp(1, 0.5));
  yield* compassPos([-30, -250], 1.4);
  yield* compassPos([-260, 130], 1.4);
  yield* compassPos([70, 250], 1.3);
  yield* waitFor(6.9333);

  // ── 5 · staerke (DUR_s 14.6667): nah am Pol stark, weit weg schwach ──
  yield* compassPos([HALF + 74, 0], 1.4);
  yield* waitFor(1.7);
  yield* compassPos([430, 0], 1.5);
  yield* waitFor(1.7);
  yield* compassPos([-HALF - 74, 0], 1.5);
  yield* waitFor(1.4);
  yield* waitFor(5.4667);

  // ── 6 · fehlvorstellung (DUR_s 18.6667): auch ZWISCHEN den Linien ist Feld
  yield* compassPos([0, -178], 1.4);
  yield* betweenRingOp(1, 0.5);
  yield* waitFor(2.6);
  yield* compassPos([44, -190], 1.1);
  yield* compassPos([-44, -166], 1.1);
  yield* compassPos([0, -178], 1.1);
  yield* waitFor(10.8667);

  // ── 7 · merksatz (DUR_s 14.0) ────────────────────────────────────────
  yield* all(compassOp(0, 0.6), gaugeOp(0, 0.6), betweenRingOp(0, 0.6));
  yield* magY(-12, 2.0);
  yield* magY(0, 2.0);
  yield* magY(-12, 2.0);
  yield* magY(0, 2.0);
  yield* waitFor(5.4);

  // ── 8 · outro (DUR_s 8.3) ────────────────────────────────────────────
  yield* all(fieldOp(0, 0.5), filOp(0, 0.5), magOp(0, 0.5));
  yield* logoOp(1, 0.8);
  yield* waitFor(7.0);
});
