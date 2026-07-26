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
import { BatterySym } from '../circuit';
import { ResistorSym, useFade } from '../electric';
import timings from '../narration/parallel-widerstand.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const LX = 520, RX = 1400, TOP = 320, BOT = 780;
const bx = [820, 1100];

const ParallelR: React.FC<{ dots?: boolean }> = ({ dots = true }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={LX} y1={TOP} x2={RX} y2={TOP} stroke={COLORS.amber} strokeWidth={6} />
        <line x1={LX} y1={BOT} x2={RX} y2={BOT} stroke={COLORS.amber} strokeWidth={6} />
        <line x1={LX} y1={TOP} x2={LX} y2={BOT} stroke={COLORS.amber} strokeWidth={6} />
        {bx.map((x, i) => (
          <React.Fragment key={i}>
            <line x1={x} y1={TOP} x2={x} y2={TOP + 90} stroke={COLORS.amber} strokeWidth={5} />
            <line x1={x} y1={BOT - 90} x2={x} y2={BOT} stroke={COLORS.amber} strokeWidth={5} />
            {dots ? Array.from({ length: 3 }).map((_, k) => { const s = (frame / 40 + k / 3) % 1; return <circle key={`${i}-${k}`} cx={x} cy={TOP + s * (BOT - TOP)} r={5} fill="#fde68a" />; }) : null}
          </React.Fragment>
        ))}
      </svg>
      <BatterySym x={LX} y={(TOP + BOT) / 2} horizontal={false} />
      {bx.map((x, i) => <ResistorSym key={i} x={x} y={(TOP + BOT) / 2} label={`R${i + 1}`} color={i === 0 ? COLORS.sky : COLORS.indigo} />)}
    </>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 130, marginBottom: 20 }}>▭ǁ▭</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 76, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Widerstände parallel
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Nebeneinander statt hintereinander – das Ergebnis überrascht.
      </div>
    </AbsoluteFill>
  );
};

const WegeScene: React.FC<SceneProps> = () => {
  const lab = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Aufbau" title="Eigene Wege, gleiche Spannung" />
      <ParallelR />
      <div style={{ position: 'absolute', left: 560, top: 220, fontSize: 28, fontWeight: 800, color: COLORS.green, opacity: lab }}>gleiche Spannung · Ströme addieren: I = I₁ + I₂</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={30}>An beiden Widerständen liegt dieselbe Spannung – die Ströme addieren sich.</Caption>
    </AbsoluteFill>
  );
};

const KleinerScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Überraschung" title="Gesamtwiderstand wird KLEINER" />
      <ParallelR />
      <div style={{ position: 'absolute', left: 560, top: 830, fontSize: 34, fontWeight: 900, color: COLORS.amber, opacity: f }}>R_ges kleiner als der kleinste Einzelwiderstand!</div>
      <Sfx sound="impact" at={16} volume={0.4} />
      <Caption delay={40}>Mehr Wege für den Strom → mehr Gesamtstrom → kleinerer Gesamtwiderstand.</Caption>
    </AbsoluteFill>
  );
};

const AnalogieScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Eselsbrücke" title="Zwei Türen statt einer" />
      <div style={{ fontSize: 180, opacity: f }}>🚪🚶🚪</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Eine zweite Tür daneben – alle kommen schneller durch. Der Widerstand des Durchgangs sinkt.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Genauso senken parallele Widerstände den Gesamtwiderstand.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Parallelschaltung" footer="R_ges kleiner als kleinster Einzelwiderstand">
      Gleiche Spannung an allen,
      <br />
      Ströme addieren sich (I = I₁ + I₂).
      <br />
      Der Gesamtwiderstand wird kleiner.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Haushalt ist parallel" />
      <div style={{ fontSize: 150, opacity: f }}>🔌💡📺 → 🛡️</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Je mehr Geräte du einschaltest, desto mehr Gesamtstrom – zu viel, und die Sicherung löst aus.
      </div>
      <Sfx sound="impact" at={14} volume={0.34} />
      <Caption delay={40}>Jedes Gerät bekommt die volle Spannung – die Ströme addieren sich.</Caption>
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
  { id: 'wege', C: WegeScene, min: 240 },
  { id: 'kleiner', C: KleinerScene, min: 240 },
  { id: 'analogie', C: AnalogieScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const PARALLEL_WIDERSTAND_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const ParallelWiderstand: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={PARALLEL_WIDERSTAND_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/parallel-widerstand/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
