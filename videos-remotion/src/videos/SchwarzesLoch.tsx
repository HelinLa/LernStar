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
import { useFade } from '../astro';
import timings from '../narration/schwarzes-loch.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const BlackHole: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: x - r * 1.6, top: y - r * 1.6, width: r * 3.2, height: r * 3.2 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from ${frame * 4}deg, #f59e0b, #ef4444, #7c3aed, #f59e0b)`, filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', inset: r * 0.6, borderRadius: '50%', background: '#000', boxShadow: '0 0 40px #000' }} />
    </div>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <BlackHole x={960} y={300} r={90} />
      <StarLogo size={84} />
      <div style={{ marginTop: 30, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was ist ein schwarzes Loch?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Ein Ort, aus dem nicht einmal Licht entkommt.
      </div>
    </AbsoluteFill>
  );
};

const EntstehungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const collapse = interpolate(frame, [20, dur - 20], [1, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Entstehung" title="Ein Riesenstern stürzt zusammen" />
      <div style={{ fontSize: 300 * collapse, transition: 'none' }}>{collapse > 0.3 ? '⭐' : '⚫'}</div>
      <div style={{ position: 'absolute', bottom: 220, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>viel Masse → winziger Raum</div>
      <Sfx sound="impact" at={Math.round(dur * 0.7)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5)}>Am Lebensende bricht ein riesiger Stern zusammen – seine Masse stürzt auf einen winzigen Punkt.</Caption>
    </AbsoluteFill>
  );
};

const AnziehungScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Falle" title="Nicht einmal Licht entkommt" />
      <BlackHole x={960} y={540} r={110} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: f }} viewBox="0 0 1920 1080">
        {[0, 60, 120, 180, 240, 300].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return <line key={i} x1={960 + Math.cos(rad) * 400} y1={540 + Math.sin(rad) * 400} x2={960 + Math.cos(rad) * 200} y2={540 + Math.sin(rad) * 200} stroke={COLORS.amber} strokeWidth={4} opacity={0.7} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: 300, top: 250, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: f }}>💡 selbst Licht wird verschluckt</div>
      <Sfx sound="whoosh" at={16} volume={0.35} />
      <Caption delay={40}>Die Gravitation ist so extrem, dass sogar das Licht hineingezogen wird.</Caption>
    </AbsoluteFill>
  );
};

const HorizontScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Grenze" title="Der Ereignishorizont" />
      <div style={{ position: 'relative' }}>
        <BlackHole x={0} y={0} r={130} />
        <div style={{ position: 'absolute', left: -260, top: -260, width: 520, height: 520, borderRadius: '50%', border: `3px dashed ${COLORS.red}`, opacity: f }} />
      </div>
      <div style={{ marginTop: 320, fontSize: 30, fontWeight: 800, color: COLORS.red, opacity: f }}>ab hier: kein Zurück mehr</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Die Grenze, hinter der nichts mehr herauskommt, heißt Ereignishorizont.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Schwarzes Loch" footer="Grenze = Ereignishorizont">
      Sehr viel Masse auf winzigem Raum.
      <br />
      Die Anziehung ist so stark, dass
      <br />
      nicht einmal Licht entkommt.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Im Herzen der Milchstraße" />
      <BlackHole x={960} y={480} r={90} />
      <div style={{ position: 'absolute', bottom: 240, fontSize: 32, fontWeight: 800, color: COLORS.amber, opacity: f, textAlign: 'center', maxWidth: 1300 }}>
        Sogar im Zentrum unserer Galaxie sitzt ein gewaltiges schwarzes Loch.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>2019 wurde ein schwarzes Loch zum ersten Mal fotografiert.</Caption>
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
  { id: 'entstehung', C: EntstehungScene, min: 240 },
  { id: 'anziehung', C: AnziehungScene, min: 240 },
  { id: 'horizont', C: HorizontScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SCHWARZES_LOCH_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const SchwarzesLoch: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SCHWARZES_LOCH_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/schwarzes-loch/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
