import {makeScene2D, Line, Rect, Txt, Node, Circle} from '@motion-canvas/2d';
import {createSignal, all, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: Magnete & magnetische Felder (Klasse 5 RS, Kapitel-Auftakt).
// NUR Fachanimation (Stabmagnet, Pole, Feldlinien mit Eisenspänen, Zerbrechen,
// Stoffe, Erde/Kompass) – Titel/Untertitel legt Remotion drüber.
// Segmentdauern framegenau an magnete-felder-mc.timings.json (Eva/Piper) → durOf
// (TAIL=20; siehe scripts/print-durations.mjs). Nur die Halte-waitFor sind getaktet.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  const NCOL = COLORS.red;   // Nordpol rot
  const SCOL = COLORS.sky;   // Südpol blau
  const ink = COLORS.ink;
  const HALF = 130;          // halbe Magnetlänge
  const H = 92;              // Magnethöhe
  const AY = -84;

  // ── Signale ──────────────────────────────────────────────────────────
  const magOp = createSignal(0);
  const magX = createSignal(0);
  const magY = createSignal(0);
  const magRot = createSignal(0);
  const poleHiOp = createSignal(0);

  const mag2Op = createSignal(0);
  const mag2X = createSignal(640);
  const mag2Rot = createSignal(0);
  const attractArrOp = createSignal(0);
  const repelArrOp = createSignal(0);

  const fieldOp = createSignal(0);
  const filOp = createSignal(0);

  const cutOp = createSignal(0);
  const splitOp = createSignal(0);
  const splitSep = createSignal(66);
  const newFlashOp = createSignal(0);

  const stoffOp = createSignal(0);
  const ironX = createSignal(380);
  const ironY = createSignal(-150);
  const ironCheckOp = createSignal(0);
  const cuAlDashOp = createSignal(0);

  const earthOp = createSignal(0);
  const needleRot = createSignal(55);

  const logoOp = createSignal(0);

  // Ein Stabmagnet (Helper): links S (blau), rechts N (rot), Buchstaben aufrecht.
  const Magnet = (cx: () => number, rot: () => number, op: () => number, half = HALF) => (
    <Node position={() => [cx(), 0]} rotation={() => rot()} opacity={() => op()}>
      <Rect x={-half / 2} width={half} height={H} radius={[16, 0, 0, 16]} fill={SCOL} stroke={ink} lineWidth={3} />
      <Rect x={half / 2} width={half} height={H} radius={[0, 16, 16, 0]} fill={NCOL} stroke={ink} lineWidth={3} />
      <Txt x={-half / 2} text="S" fill={ink} fontFamily={FONT} fontSize={half > 100 ? 52 : 40} fontWeight={900} rotation={() => -rot()} />
      <Txt x={half / 2} text="N" fill={ink} fontFamily={FONT} fontSize={half > 100 ? 52 : 40} fontWeight={900} rotation={() => -rot()} />
    </Node>
  );

  // ── Feldlinien (Dipol-Schleifen N→S, oben & unten) ───────────────────
  const loop = (ay: number, sign: number) => {
    const ax = HALF + 22 + ay * 0.55;
    const pts: [number, number][] = [];
    const M = 46;
    for (let i = 0; i <= M; i++) {
      const t = (Math.PI * i) / M;
      pts.push([ax * Math.cos(t), sign * ay * Math.sin(t)]);
    }
    return (
      <Line points={pts} stroke={COLORS.sky} lineWidth={3} lineCap="round" endArrow arrowSize={11}
            opacity={() => fieldOp()} end={() => fieldOp()} />
    );
  };
  const fieldLines = [
    loop(20, -1), loop(72, -1), loop(140, -1), loop(210, -1),
    loop(20, 1), loop(72, 1), loop(140, 1), loop(210, 1),
  ];

  // ── Eisenspäne: kurze Striche, entlang des Dipolfeldes ausgerichtet ──
  const filings: any[] = [];
  for (let gx = -430; gx <= 430; gx += 86) {
    for (let gy = -240; gy <= 240; gy += 80) {
      if (Math.abs(gx) < HALF + 26 && Math.abs(gy) < H / 2 + 26) continue;
      const r = Math.hypot(gx, gy);
      if (r < 60) continue;
      const bx = (3 * gx * gx) / (r * r) - 1;
      const by = (3 * gx * gy) / (r * r);
      const ang = (Math.atan2(by, bx) * 180) / Math.PI;
      filings.push(
        <Rect position={[gx, gy]} width={20} height={4} radius={2} fill={COLORS.muted} rotation={ang} opacity={() => filOp()} />,
      );
    }
  }

  view.add(
    <Node>
      {/* Feldlinien + Eisenspäne */}
      {fieldLines}
      {filings}

      {/* Hero-Magnet mit Pol-Ringen */}
      <Node position={() => [magX(), magY()]} rotation={() => magRot()} opacity={() => magOp()}>
        <Rect x={-HALF / 2} width={HALF} height={H} radius={[16, 0, 0, 16]} fill={SCOL} stroke={ink} lineWidth={3} />
        <Rect x={HALF / 2} width={HALF} height={H} radius={[0, 16, 16, 0]} fill={NCOL} stroke={ink} lineWidth={3} />
        <Txt x={-HALF / 2} text="S" fill={ink} fontFamily={FONT} fontSize={52} fontWeight={900} />
        <Txt x={HALF / 2} text="N" fill={ink} fontFamily={FONT} fontSize={52} fontWeight={900} />
        <Circle position={[-HALF / 2, 0]} size={96} stroke={SCOL} lineWidth={5} opacity={() => poleHiOp()} />
        <Circle position={[HALF / 2, 0]} size={96} stroke={NCOL} lineWidth={5} opacity={() => poleHiOp()} />
      </Node>

      {/* Zweiter Magnet (Pol-Szene) */}
      {Magnet(() => mag2X(), () => mag2Rot(), () => mag2Op())}

      {/* Pol-Kraftpfeile */}
      <Line points={() => [[150, AY], [200, AY]]} stroke={COLORS.green} lineWidth={9} endArrow arrowSize={22} opacity={() => attractArrOp()} lineCap="round" />
      <Line points={() => [[mag2X() - 150, AY], [mag2X() - 200, AY]]} stroke={COLORS.green} lineWidth={9} endArrow arrowSize={22} opacity={() => attractArrOp()} lineCap="round" />
      <Line points={() => [[110, AY], [56, AY]]} stroke={COLORS.red} lineWidth={9} endArrow arrowSize={22} opacity={() => repelArrOp()} lineCap="round" />
      <Line points={() => [[mag2X() - 110, AY], [mag2X() - 56, AY]]} stroke={COLORS.red} lineWidth={9} endArrow arrowSize={22} opacity={() => repelArrOp()} lineCap="round" />

      {/* Zerbrechen: Schnittlinie + zwei Halbmagnete */}
      <Line points={[[0, -H / 2 - 26], [0, H / 2 + 26]]} stroke={COLORS.amber} lineWidth={4} lineDash={[12, 10]} opacity={() => cutOp()} />
      <Node opacity={() => splitOp()}>
        {Magnet(() => -splitSep(), () => 0, () => 1, 132)}
        {Magnet(() => splitSep(), () => 0, () => 1, 132)}
        {/* Aufleuchten der NEU entstandenen Innenpole (N links | S rechts) */}
        <Circle position={() => [-splitSep() + 33, 0]} size={70} stroke={NCOL} lineWidth={6} opacity={() => newFlashOp()} />
        <Circle position={() => [splitSep() - 33, 0]} size={70} stroke={SCOL} lineWidth={6} opacity={() => newFlashOp()} />
      </Node>

      {/* Stoffe: drei Materialkarten rechts */}
      <Node opacity={() => stoffOp()}>
        {/* Eisen (fliegt zum Magneten) */}
        <Node position={() => [ironX(), ironY()]}>
          <Rect width={150} height={78} radius={12} fill={COLORS.ground} stroke={ink} lineWidth={3} />
          <Txt text="Eisen" fill={ink} fontFamily={FONT} fontSize={30} fontWeight={800} />
          <Txt position={[86, -2]} text="✓" fill={COLORS.green} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => ironCheckOp()} />
        </Node>
        {/* Kupfer (bleibt) */}
        <Node position={[380, 10]}>
          <Rect width={150} height={78} radius={12} fill={'#b45309'} stroke={ink} lineWidth={3} />
          <Txt text="Kupfer" fill={ink} fontFamily={FONT} fontSize={30} fontWeight={800} />
          <Txt position={[100, -2]} text="✗" fill={COLORS.muted} fontFamily={FONT} fontSize={34} fontWeight={900} opacity={() => cuAlDashOp()} />
        </Node>
        {/* Aluminium (bleibt) */}
        <Node position={[380, 170]}>
          <Rect width={150} height={78} radius={12} fill={'#64748b'} stroke={ink} lineWidth={3} />
          <Txt text="Alu" fill={ink} fontFamily={FONT} fontSize={30} fontWeight={800} />
          <Txt position={[100, -2]} text="✗" fill={COLORS.muted} fontFamily={FONT} fontSize={34} fontWeight={900} opacity={() => cuAlDashOp()} />
        </Node>
      </Node>

      {/* Erde als großer Magnet + Kompass */}
      <Node opacity={() => earthOp()}>
        <Circle size={360} fill={'#1e3a8a'} stroke={COLORS.sky} lineWidth={4} position={[-120, 0]} />
        <Circle size={120} fill={'#166534'} position={[-160, -40]} />
        <Circle size={90} fill={'#166534'} position={[-70, 60]} />
        {/* Magnetachse der Erde */}
        <Line points={[[-120, -150], [-120, 150]]} stroke={ink} lineWidth={3} lineDash={[8, 8]} opacity={0.7} />
        <Txt position={[-120, -172]} text="N" fill={NCOL} fontFamily={FONT} fontSize={30} fontWeight={900} />
        <Txt position={[-120, 172]} text="S" fill={SCOL} fontFamily={FONT} fontSize={30} fontWeight={900} />
        {/* Kompass rechts */}
        <Circle size={150} fill={COLORS.panelSolid} stroke={COLORS.border} lineWidth={4} position={[300, 0]} />
        <Txt position={[300, -92]} text="N" fill={COLORS.muted} fontFamily={FONT} fontSize={26} fontWeight={800} />
        <Node position={[300, 0]} rotation={() => needleRot()}>
          <Line points={[[0, -56], [12, 0], [-12, 0]]} closed fill={NCOL} />
          <Line points={[[0, 56], [12, 0], [-12, 0]]} closed fill={COLORS.muted} />
          <Circle size={12} fill={ink} />
        </Node>
      </Node>

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 250]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={44} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />
    </Node>,
  );

  // ── 1 · intro (DUR_s 12.2667) ────────────────────────────────────────
  yield* magOp(1, 1.4);
  yield* waitFor(10.8667);

  // ── 2 · pole (DUR_s 13.5) ────────────────────────────────────────────
  yield* poleHiOp(1, 0.6);
  yield* mag2Op(1, 0.5);
  yield* all(mag2X(300, 1.6), attractArrOp(1, 0.5));
  yield* waitFor(1.6);
  yield* all(mag2Rot(180, 0.9), attractArrOp(0, 0.3));
  yield* all(repelArrOp(1, 0.5), mag2X(560, 1.4));
  yield* waitFor(1.6);
  yield* all(mag2Op(0, 0.5), repelArrOp(0, 0.4), poleHiOp(0, 0.4));
  yield* waitFor(4.8);

  // ── 3 · feld (DUR_s 15.8667) ─────────────────────────────────────────
  yield* fieldOp(1, 1.6);
  yield* filOp(1, 1.4);
  yield* waitFor(12.8667);

  // ── 4 · teilen (DUR_s 17.2) ──────────────────────────────────────────
  yield* all(fieldOp(0, 0.6), filOp(0, 0.6));
  yield* cutOp(1, 0.5);
  yield* waitFor(1.4);
  yield* all(magOp(0, 0.5), splitOp(1, 0.5), cutOp(0, 0.4));
  yield* all(splitSep(161, 1.8), newFlashOp(1, 0.6));
  yield* newFlashOp(0.3, 0.6);
  yield* newFlashOp(1, 0.5);
  yield* newFlashOp(0.3, 0.5);
  yield* waitFor(10.8);

  // ── 5 · stoffe (DUR_s 14.9667) ───────────────────────────────────────
  yield* all(splitOp(0, 0.5), magOp(1, 0.5), magX(-430, 0.9));
  yield* stoffOp(1, 0.6);
  yield* waitFor(1.4);
  yield* all(ironX(-300, 1.5), ironY(0, 1.5));
  yield* ironCheckOp(1, 0.4);
  yield* waitFor(1.4);
  yield* cuAlDashOp(1, 0.5);
  yield* waitFor(8.2667);

  // ── 6 · erde (DUR_s 13.6667) ─────────────────────────────────────────
  yield* all(stoffOp(0, 0.6), magOp(0, 0.6), cuAlDashOp(0, 0.4), ironCheckOp(0, 0.4));
  yield* earthOp(1, 1.2);
  yield* waitFor(1.2);
  yield* needleRot(-14, 1.2);
  yield* needleRot(7, 0.9);
  yield* needleRot(0, 0.7);
  yield* waitFor(7.8667);

  // ── 7 · merksatz (DUR_s 15.4) ────────────────────────────────────────
  yield* earthOp(0, 0.6);
  yield* all(magOp(1, 0.6), fieldOp(1, 1.2), magX(0, 0.4));
  yield* filOp(1, 1.0);
  yield* magY(-12, 2.0);
  yield* magY(0, 2.0);
  yield* magY(-12, 2.0);
  yield* magY(0, 2.0);
  yield* waitFor(4.6);

  // ── 8 · outro (DUR_s 7.7) ────────────────────────────────────────────
  yield* all(magOp(0, 0.5), fieldOp(0, 0.5), filOp(0, 0.5));
  yield* logoOp(1, 0.8);
  yield* waitFor(6.4);
});
