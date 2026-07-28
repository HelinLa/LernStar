import {makeScene2D, Line, Rect, Txt, Node, Circle} from '@motion-canvas/2d';
import {createSignal, all, waitFor, linear} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: Der Elektromagnet – wie stark ist er? (Klasse 5 RS).
// NUR Fachanimation (Spule um Eisenkern, Stromkreis mit Schalter + fließendem Strom,
// Feldlinien an/aus, Büroklammer-Kette = Tragkraft, Windungen/Strom/Kern verändern die Stärke).
// Kern-Fehlvorstellung: Elektromagnet ist NICHT immer magnetisch – nur mit Strom.
// durOf (TAIL=20): intro 451 · stromfeld 407 · abschalten 466 · windungen 314 · strom 308 · eisenkern 337 · anwendung 348 · outro 299.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);
  const ink = COLORS.ink;
  const COP = '#b45309'; // Kupfer

  const apparatusOp = createSignal(0);
  const fieldOp = createSignal(0);
  const flow = createSignal(0);
  const onOp = createSignal(0); // Strom fließt (Elektronen sichtbar)
  const switchAngle = createSignal(-34); // -34 = offen, 0 = geschlossen
  const wind = createSignal(6);
  const stromPct = createSignal(55);
  const lift = createSignal(0);           // Zahl gehaltener Büroklammern (0..9)
  const windExtraOp = createSignal(0);
  const coreX = createSignal(0);
  const loadOp = createSignal(0);
  const loadY = createSignal(70);
  const appLabelOp = createSignal(0);
  const logoOp = createSignal(0);

  // Feldlinien der Spule (wirkt wie Stabmagnet, Pole an den Enden ±170)
  const CH = 170;
  const loop = (ay: number, sign: number) => {
    const ax = CH + 22 + ay * 0.55;
    const pts: [number, number][] = [];
    const M = 44;
    for (let i = 0; i <= M; i++) {
      const t = (Math.PI * i) / M;
      pts.push([ax * Math.cos(t), sign * ay * Math.sin(t)]);
    }
    return <Line points={pts} stroke={COLORS.sky} lineWidth={3} lineCap="round" endArrow arrowSize={11} opacity={() => fieldOp()} end={() => fieldOp()} />;
  };

  view.add(
    <Node opacity={() => apparatusOp()}>
      {/* Feldlinien */}
      {loop(48, -1)}{loop(130, -1)}
      {loop(48, 1)}{loop(130, 1)}

      {/* Eisenkern */}
      <Node position={() => [coreX(), 0]}>
        <Rect width={360} height={56} radius={8} fill={'#94a3b8'} stroke={ink} lineWidth={3} />
        <Txt text="Eisenkern" fill={COLORS.bg0} fontFamily={FONT} fontSize={26} fontWeight={800} />
      </Node>

      {/* Wicklungen (Basis 7) */}
      {[-140, -70, 0, 70, 140].map((wx) => (
        <Circle position={[wx, 0]} width={46} height={104} stroke={COP} lineWidth={7} />
      ))}
      {/* Zusätzliche Wicklungen (Szene „windungen") */}
      <Node opacity={() => windExtraOp()}>
        {[-105, 105].map((wx) => (
          <Circle position={[wx, 0]} width={46} height={104} stroke={COP} lineWidth={7} />
        ))}
      </Node>

      {/* Stromkreis: Leitungen + Batterie + Schalter, mit fließenden Strichen */}
      <Line points={[[-170, 60], [-170, 210], [-70, 210]]} stroke={COLORS.amber} lineWidth={6} lineCap="round" />
      <Line points={[[10, 210], [70, 210]]} stroke={COLORS.amber} lineWidth={6} lineCap="round" />
      <Line points={[[122, 210], [170, 210], [170, 60]]} stroke={COLORS.amber} lineWidth={6} lineCap="round" />
      {/* Elektronen (Stromfluss, nur wenn Schalter geschlossen) */}
      {Array.from({length: 5}).map((_, i) => (
        <Circle position={() => [-170 + (((flow() * 0.008 + i / 5) % 1)) * 340, 210]} size={14} fill={COLORS.sky} opacity={() => onOp()} />
      ))}
      {/* Batterie */}
      <Line points={[[-52, 190], [-52, 230]]} stroke={ink} lineWidth={6} />
      <Line points={[[-30, 200], [-30, 220]]} stroke={ink} lineWidth={12} />
      <Txt position={[-70, 176]} text="+" fill={ink} fontFamily={FONT} fontSize={30} fontWeight={900} />
      {/* Schalter */}
      <Circle position={[70, 210]} size={12} fill={ink} />
      <Circle position={[122, 210]} size={12} fill={ink} />
      <Node position={[70, 210]} rotation={() => switchAngle()}>
        <Line points={[[0, 0], [56, 0]]} stroke={ink} lineWidth={6} lineCap="round" />
      </Node>

      {/* Büroklammer-Kette (Tragkraft) am rechten Pol */}
      {Array.from({length: 9}).map((_, i) => (
        <Rect position={[180, 60 + i * 34]} width={24} height={40} radius={11} stroke={COLORS.muted} lineWidth={5} opacity={() => Math.max(0, Math.min(1, lift() - i))} />
      ))}

      {/* Last (Anwendung) */}
      <Node position={() => [180, loadY()]} opacity={() => loadOp()}>
        <Rect width={120} height={80} radius={10} fill={COLORS.ground} stroke={ink} lineWidth={3} />
        <Txt text="Last" fill={ink} fontFamily={FONT} fontSize={26} fontWeight={800} />
      </Node>

      {/* Anzeigen als Balken (statische Labels – keine pro-Frame-Textneuberechnung) */}
      <Txt position={[-500, -392]} text="Windungen" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={800} />
      <Rect position={[-448, -358]} width={260} height={20} radius={10} stroke={COLORS.border} lineWidth={2} />
      <Rect position={() => [-578 + (Math.max(0.05, (wind() - 2) / 11) * 260) / 2, -358]} width={() => Math.max(0.05, (wind() - 2) / 11) * 260} height={16} radius={8} fill={COP} />
      <Txt position={[-520, -322]} text="Strom" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={800} />
      <Rect position={[-448, -288]} width={260} height={20} radius={10} stroke={COLORS.border} lineWidth={2} />
      <Rect position={() => [-578 + ((stromPct() / 100) * 260) / 2, -288]} width={() => (stromPct() / 100) * 260} height={16} radius={8} fill={COLORS.amber} />
      <Txt position={[490, -392]} text="Tragkraft" fill={COLORS.green} fontFamily={FONT} fontSize={26} fontWeight={900} />
      <Rect position={[490, -358]} width={260} height={20} radius={10} stroke={COLORS.border} lineWidth={2} />
      <Rect position={() => [360 + ((lift() / 9) * 260) / 2, -358]} width={() => (lift() / 9) * 260} height={16} radius={8} fill={COLORS.green} />

      {/* Anwendungen-Label */}
      <Txt position={[0, 330]} text="Kran · Türklingel · Lautsprecher" fill={COLORS.indigo} fontFamily={FONT} fontSize={32} fontWeight={800} opacity={() => appLabelOp()} />
    </Node>,
  );

  view.add(
    <Txt position={[0, 250]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={44} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />,
  );

  // ── 1 · intro (15.0333 s): Aufbau, Schalter offen, kein Feld ─────────
  yield* apparatusOp(1, 1.3);
  yield* waitFor(13.7333);

  // ── 2 · stromfeld (13.5667 s): Schalter zu → Strom → Feld → Klammern ─
  yield* all(switchAngle(0, 0.6), onOp(1, 0.6));
  yield* all(fieldOp(1, 1.0), lift(6, 1.4), flow(30, 1.4, linear));
  yield* flow(330, 11.5667, linear);

  // ── 3 · abschalten (15.5333 s): Schalter auf → Feld weg → fallen ────
  yield* all(switchAngle(-34, 0.6), onOp(0, 0.5));
  yield* all(fieldOp(0, 0.7), lift(0, 0.9));
  yield* waitFor(14.0333);

  // ── 4 · windungen (10.4667 s): mehr Windungen → mehr Klammern ───────
  yield* all(switchAngle(0, 0.5), onOp(1, 0.5));
  yield* all(fieldOp(1, 0.6), lift(4, 0.8), flow(flow() + 30, 0.8, linear));
  yield* all(windExtraOp(1, 0.8), wind(11, 0.8), lift(7, 0.8));
  yield* flow(flow() + 260, 8.3667, linear);

  // ── 5 · strom (10.2667 s): mehr Strom → mehr Klammern ───────────────
  yield* all(stromPct(100, 1.0), lift(9, 1.0), flow(flow() + 40, 1.0, linear));
  yield* flow(flow() + 280, 9.2667, linear);

  // ── 6 · eisenkern (11.2333 s): ohne Kern schwach, mit Kern stark ────
  yield* all(coreX(-560, 1.0), lift(3, 1.0), fieldOp(0.32, 1.0));
  yield* flow(flow() + 50, 1.6, linear);
  yield* all(coreX(0, 1.1), lift(9, 1.1), fieldOp(1, 1.1));
  yield* flow(flow() + 230, 7.5333, linear);

  // ── 7 · anwendung (11.6 s): abschaltbar → Last halten & fallen lassen ─
  yield* all(lift(0, 0.5), loadOp(1, 0.6), loadY(70, 0.9));
  yield* waitFor(2.0);
  yield* all(switchAngle(-34, 0.5), onOp(0, 0.4), fieldOp(0, 0.5), loadY(380, 1.0));
  yield* waitFor(1.4);
  yield* all(switchAngle(0, 0.5), onOp(1, 0.5));
  yield* all(fieldOp(1, 0.5), loadOp(0, 0.5), appLabelOp(1, 0.7));
  yield* waitFor(5.1);

  // ── 8 · outro (9.9667 s) ─────────────────────────────────────────────
  yield* all(apparatusOp(0, 0.6), fieldOp(0, 0.5));
  yield* logoOp(1, 0.8);
  yield* waitFor(8.5667);
});
