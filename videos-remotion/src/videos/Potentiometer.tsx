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
import { RectWire, BatterySym, Bulb } from '../circuit';
import { useFade } from '../electric';
import timings from '../narration/potentiometer.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const LX = 600, RX = 1320, TY = 360, BY = 740, MX = 960;

// Potentiometer: Widerstandsbalken + Schieber. pos 0..1 → Widerstandsstrecke
const Poti: React.FC<{ pos: number }> = ({ pos }) => {
  const bx = MX - 150, bw = 300;
  const sliderX = bx + pos * bw;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <rect x={bx} y={BY - 20} width={bw} height={40} rx={8} fill="#0f172a" stroke={COLORS.sky} strokeWidth={4} />
      {/* aktive (genutzte) Widerstandsstrecke rot */}
      <rect x={bx} y={BY - 20} width={pos * bw} height={40} rx={8} fill={COLORS.red} opacity={0.5} />
      {/* Schieber */}
      <line x1={sliderX} y1={BY - 60} x2={sliderX} y2={BY - 20} stroke={COLORS.amber} strokeWidth={6} />
      <polygon points={`${sliderX - 16},${BY - 70} ${sliderX + 16},${BY - 70} ${sliderX},${BY - 46}`} fill={COLORS.amber} />
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 150, marginBottom: 20 }}>🎛️</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Das Potentiometer
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Ein Widerstand, den du stufenlos verstellen kannst.
      </div>
    </AbsoluteFill>
  );
};

const SchieberScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pos = 0.5 + Math.sin(frame / 25) * 0.4;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Aufbau" title="Schieber verstellt den Widerstand" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on gapAtBottom={340} />
      <Bulb x={MX} y={TY} size={100} on />
      <Poti pos={pos} />
      <BatterySym x={LX} y={(TY + BY) / 2} horizontal={false} />
      <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.sky }}>Schieber ändert die Länge der Widerstandsstrecke</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption>Mit dem Schieber stellst du den Widerstand stufenlos ein.</Caption>
    </AbsoluteFill>
  );
};

const HellScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Kurze Strecke" title="Kleiner R → hell" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on dots={16} gapAtBottom={340} />
    <Bulb x={MX} y={TY} size={140} on />
    <Poti pos={0.1} />
    <BatterySym x={LX} y={(TY + BY) / 2} horizontal={false} />
    <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 32, fontWeight: 800, color: COLORS.green }}>kleiner R → viel Strom → hell 💡</div>
    <Sfx sound="pling" at={10} volume={0.4} />
    <Caption>Kurze Widerstandsstrecke: kleiner Widerstand, viel Strom, helle Lampe.</Caption>
  </AbsoluteFill>
);

const DunkelScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Lange Strecke" title="Großer R → dunkel" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on dots={4} gapAtBottom={340} />
    <Bulb x={MX} y={TY} size={80} on />
    <Poti pos={0.9} />
    <BatterySym x={LX} y={(TY + BY) / 2} horizontal={false} />
    <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 32, fontWeight: 800, color: COLORS.red }}>großer R → wenig Strom → dunkel</div>
    <Sfx sound="pop" at={10} volume={0.3} />
    <Caption>Lange Widerstandsstrecke: großer Widerstand, wenig Strom, dunkle Lampe.</Caption>
  </AbsoluteFill>
);

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Potentiometer" footer="stufenlos einstellbarer Widerstand">
      Kleiner Widerstand → viel Strom → hell.
      <br />
      Großer Widerstand → wenig Strom → dunkel.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Dimmer & Lautstärkeregler" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['💡🎛️', 'Dimmer'], ['🔊🎚️', 'Lautstärkeregler']].map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Überall, wo du etwas stufenlos einstellst, steckt oft ein Potentiometer.</Caption>
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
  { id: 'intro', C: Intro, min: 130 },
  { id: 'schieber', C: SchieberScene, min: 220 },
  { id: 'hell', C: HellScene, min: 220 },
  { id: 'dunkel', C: DunkelScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const POTENTIOMETER_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Potentiometer: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={POTENTIOMETER_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/potentiometer/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
