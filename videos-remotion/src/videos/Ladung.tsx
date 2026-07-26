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
import { ChargeBall, useFade } from '../electric';
import timings from '../narration/ladung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 180, marginBottom: 20, transform: `rotate(${Math.sin(frame / 20) * 8}deg)` }}>🎈</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was ist elektrische Ladung?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum klebt ein geriebener Ballon an der Wand?
      </div>
    </AbsoluteFill>
  );
};

const ZweiScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Zwei Sorten" title="Positiv und negativ" />
      <div style={{ display: 'flex', gap: 200, opacity: f }}>
        <ChargeBall x={0} y={0} sign="+" label="positiv" />
        <ChargeBall x={0} y={0} sign="−" label="negativ" />
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Es gibt genau zwei Ladungsarten: positive (+) und negative (−).</Caption>
    </AbsoluteFill>
  );
};

const RegelScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const attract = frame > dur * 0.5;
  const t = attract
    ? interpolate(frame, [dur * 0.5, dur * 0.72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const off = attract ? interpolate(t, [0, 1], [260, 90]) : interpolate(t, [0, 1], [110, 260]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Regel" title={attract ? 'Ungleiche ziehen sich an' : 'Gleiche stoßen sich ab'} />
      <ChargeBall x={960 - off} y={540} sign="+" />
      <ChargeBall x={960 + off} y={540} sign={attract ? '−' : '+'} />
      {attract ? (
        <>
          <div style={{ position: 'absolute', left: 720, top: 660, fontSize: 50, color: COLORS.green }}>➡️</div>
          <div style={{ position: 'absolute', left: 1150, top: 660, fontSize: 50, color: COLORS.green }}>⬅️</div>
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', left: 640, top: 660, fontSize: 50, color: COLORS.red }}>⬅️</div>
          <div style={{ position: 'absolute', left: 1230, top: 660, fontSize: 50, color: COLORS.red }}>➡️</div>
        </>
      )}
      <Sfx sound={attract ? 'impact' : 'pop'} at={Math.round(dur * 0.5) + 4} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 8}>{attract ? 'Plus und Minus springen zusammen.' : 'Plus und Plus drücken auseinander.'}</Caption>
    </AbsoluteFill>
  );
};

const ReibungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="So entsteht's" title="Reibungselektrizität" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', opacity: f }}>
        <div style={{ fontSize: 150, transform: `translateX(${Math.sin(frame / 6) * 12}px)` }}>🎈</div>
        <div style={{ fontSize: 60 }}>↔️</div>
        <div style={{ fontSize: 150 }}>🧑‍🦱</div>
      </div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, opacity: f }}>Ballon wird −, Haare bleiben + → Haare stellen sich auf</div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Beim Reiben wandern negative Ladungen – ungleiche Ladungen ziehen sich an.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Elektrische Ladung" footer="durch Reiben: Reibungselektrizität">
      Es gibt positive und negative Ladung.
      <br />
      Gleiche Ladungen stoßen sich ab,
      <br />
      ungleiche ziehen sich an.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Von Knistern bis Blitz" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🧥⚡', 'Pulli knistert'], ['⛈️🌩️', 'Blitz = Ladungsausgleich']].map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="impact" at={14} volume={0.36} />
      <Caption delay={40}>Ein Blitz ist ein gewaltiger Ladungsausgleich zwischen Wolke und Erde.</Caption>
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
  { id: 'zwei', C: ZweiScene, min: 220 },
  { id: 'regel', C: RegelScene, min: 260 },
  { id: 'reibung', C: ReibungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LADUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Ladung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LADUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/ladung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
