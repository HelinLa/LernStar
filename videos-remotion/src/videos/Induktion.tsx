import React from 'react';
import {
  AbsoluteFill,
  Series,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo, BackgroundMusic, Sfx } from '../components';
import { BarMagnet, useFade } from '../magnet';
import { Solenoid, Galvanometer } from '../induction';
import timings from '../narration/induktion.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CY = 520;
const COILX = 760;

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120 }}>🧲➡️🌀</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Strom aus Bewegung – ganz ohne Batterie?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die elektromagnetische Induktion
      </div>
    </AbsoluteFill>
  );
};

// Magnet-Position + Geschwindigkeit → Zeigerausschlag (nur Bewegung zählt)
const useInduce = (segments: [number, number, number, number][]) => {
  const frame = useCurrentFrame();
  const posAt = (f: number) => {
    let x = segments[0][2];
    for (const [t0, t1, x0, x1] of segments) {
      if (f >= t1) x = x1;
      else if (f >= t0) return interpolate(f, [t0, t1], [x0, x1]);
    }
    return x;
  };
  const x = posAt(frame);
  const vel = x - posAt(frame - 1);
  const value = interpolate(vel, [-9, 9], [-1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { x, value, vel };
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const { x, value } = useInduce([
    [0, 30, 360, 360],
    [30, 70, 360, 660],
    [70, 200, 660, 660],
  ]);
  const glow = Math.abs(value);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Magnet rein – der Zeiger schlägt aus" />
      <Solenoid cx={COILX} cy={CY} w={300} h={150} turns={7} glow={glow} />
      <BarMagnet cx={x} cy={CY} w={240} h={80} nRight />
      <Galvanometer cx={COILX} cy={CY + 300} value={value} size={190} />
      <div style={{ position: 'absolute', left: 1240, top: 460, width: 520, fontSize: 28, fontWeight: 800, color: glow > 0.15 ? COLORS.green : COLORS.muted }}>
        {glow > 0.15 ? '⚡ Bewegung → Spannung → Zeiger schlägt aus' : '⏸️ Magnet ruht → Zeiger auf 0'}
      </div>
      <Caption delay={30}>Schiebt man den Magneten in die Spule, fließt Strom – der Zeiger schlägt aus. Ganz ohne Batterie.</Caption>
    </AbsoluteFill>
  );
};

const RichtungScene: React.FC<SceneProps> = () => {
  const { x, value } = useInduce([
    [0, 20, 360, 360],
    [20, 55, 360, 660],
    [55, 80, 660, 660],
    [80, 120, 660, 360],
    [120, 200, 360, 360],
  ]);
  const glow = Math.abs(value);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ausprobieren" title="Rein oder raus – der Strom kehrt sich um" />
      <Solenoid cx={COILX} cy={CY} w={300} h={150} turns={7} glow={glow} />
      <BarMagnet cx={x} cy={CY} w={240} h={80} nRight />
      <Galvanometer cx={COILX} cy={CY + 300} value={value} size={190} />
      <div style={{ position: 'absolute', left: 1240, top: 460, width: 520, fontSize: 27, fontWeight: 800, color: value > 0.1 ? COLORS.green : value < -0.1 ? COLORS.red : COLORS.muted }}>
        {value > 0.1 ? '➡️ hineinschieben → Ausschlag nach +' : value < -0.1 ? '⬅️ herausziehen → Ausschlag nach −' : '⏸️ Halt → 0'}
      </div>
      <Caption delay={30}>Zieht man den Magneten wieder heraus, schlägt der Zeiger in die andere Richtung. Die Stromrichtung dreht sich um.</Caption>
    </AbsoluteFill>
  );
};

const AenderungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  // Magnet sitzt still in der Spule → 0; ab Frame 90 ein kurzes Wackeln → Ausschlag
  const wiggle = frame > 90 ? Math.sin((frame - 90) / 3) * 7 : 0;
  const x = 660 + wiggle;
  const value = frame > 90 ? Math.cos((frame - 90) / 3) * 0.7 : 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Kernpunkt" title="Nur die Änderung zählt" />
      <Solenoid cx={COILX} cy={CY} w={300} h={150} turns={7} glow={Math.abs(value)} />
      <BarMagnet cx={x} cy={CY} w={240} h={80} nRight />
      <Galvanometer cx={COILX} cy={CY + 300} value={value} size={190} />
      <div style={{ position: 'absolute', left: 1180, top: 430, width: 600, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Liegt der Magnet still in der Spule, zeigt das Messgerät 0 – obwohl er mitten drin ist.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 24, fontWeight: 800 }}>Erst wenn sich etwas bewegt (ändert), entsteht Spannung.</div>
      </div>
      <Sfx sound="pop" at={90} volume={0.34} />
      <Caption delay={30}>Wichtig: Ein ruhender Magnet erzeugt keinen Strom. Nur wenn sich das Magnetfeld ändert, wird Spannung induziert.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Induktion" footer="schneller bewegen → mehr Spannung">
      Ändert sich das Magnetfeld in einer Spule,
      <br />
      wird eine Spannung induziert – auch ohne Batterie.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🚲', 'Fahrraddynamo', 'Bewegung → Strom'],
    ['🏭', 'Generator', 'Stromerzeugung'],
    ['📱', 'Kabelloses Laden', 'Feld überträgt Energie'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wo Induktion steckt" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Fast unser gesamter Strom entsteht durch Induktion – im Generator. Das schauen wir uns gleich an.</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={120} />
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: COLORS.muted, opacity: s }}>
        Physik verstehen – Schritt für Schritt.
      </div>
    </AbsoluteFill>
  );
};

const SCENES: { id: string; C: React.FC<SceneProps>; min: number }[] = [
  { id: 'intro', C: Intro, min: 150 },
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'richtung', C: RichtungScene, min: 250 },
  { id: 'aenderung', C: AenderungScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const INDUKTION_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Induktion: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={INDUKTION_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/induktion/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
