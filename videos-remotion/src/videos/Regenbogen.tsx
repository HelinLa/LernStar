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
import { SPECTRUM, useFade } from '../refraction';
import timings from '../narration/regenbogen.timings.json';

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
      <div style={{ fontSize: 190, marginBottom: 20 }}>🌦️🌈</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie entsteht ein Regenbogen?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Sonne nach dem Regen – und ein Farbbogen spannt sich auf.
      </div>
    </AbsoluteFill>
  );
};

const TropfenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Baustein" title="Jeder Tropfen ein Mini-Prisma" />
      <div style={{ fontSize: 220, opacity: f }}>💧🔺</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.sky, opacity: f }}>Millionen Regentropfen in der Luft</div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Jeder winzige Regentropfen wirkt wie ein kleines Prisma.</Caption>
    </AbsoluteFill>
  );
};

// Weg des Lichts im Tropfen: Eintritt (Brechung), Rückwand (Reflexion), Austritt (Brechung+Zerlegung).
const WegScene: React.FC<SceneProps> = ({ dur }) => {
  const p = useFade(15, 40);
  const cx = 1050, cy = 500, r = 200;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Im Tropfen" title="Brechen · reflektieren · zerlegen" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <circle cx={cx} cy={cy} r={r} fill="rgba(56,189,248,0.12)" stroke={COLORS.sky} strokeWidth={4} />
        {/* Eintritt oben links (weiß) */}
        <line x1={cx - 420} y1={cy - 180} x2={cx - r * 0.7} y2={cy - r * 0.7} stroke="#f8fafc" strokeWidth={6} />
        {/* im Tropfen zur Rückwand */}
        <line x1={cx - r * 0.7} y1={cy - r * 0.7} x2={cx + r * 0.8} y2={cy + r * 0.4} stroke="#fde68a" strokeWidth={5} opacity={p} />
        {/* Reflexion Rückwand → Austritt unten */}
        {SPECTRUM.map((c, i) => (
          <line key={i} x1={cx + r * 0.8} y1={cy + r * 0.4} x2={cx - 360 - i * 20} y2={cy + 260 + i * 18} stroke={c} strokeWidth={5} opacity={p} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: cx - 480, top: cy - 240, fontSize: 24, fontWeight: 800, color: '#f8fafc' }}>1. Brechung</div>
      <div style={{ position: 'absolute', left: cx + 180, top: cy + 120, fontSize: 24, fontWeight: 800, color: COLORS.red }}>2. Reflexion</div>
      <div style={{ position: 'absolute', left: cx - 560, top: cy + 300, fontSize: 24, fontWeight: 800, color: COLORS.amber }}>3. Austritt (zerlegt)</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.55)}>Brechung beim Eintritt, Reflexion an der Rückwand, Zerlegung beim Austritt.</Caption>
    </AbsoluteFill>
  );
};

const BogenScene: React.FC<SceneProps> = ({ dur }) => {
  const p = interpolate(useCurrentFrame(), [10, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cx = 960, cy = 1000;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der ganze Bogen" title="Rot außen, Violett innen" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {SPECTRUM.map((c, i) => {
          const rr = 620 - i * 34;
          return <path key={i} d={`M ${cx - rr},${cy} A ${rr} ${rr} 0 0 1 ${cx + rr},${cy}`} fill="none" stroke={c} strokeWidth={26} opacity={0.9 * p} strokeDasharray={`${Math.PI * rr * p} 100000`} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: 200, top: 760, fontSize: 90 }}>🧍</div>
      <div style={{ position: 'absolute', left: 150, top: 620, fontSize: 24, fontWeight: 800, color: COLORS.amber }}>☀️ Sonne im Rücken</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5)}>Unzählige Tropfen zusammen bilden den Bogen – die Sonne steht in deinem Rücken.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Regenbogen" footer="Sonne im Rücken, Regen vor dir">
      Im Tropfen wird Licht gebrochen, an der
      <br />
      Rückwand reflektiert und zerlegt.
      <br />
      Viele Tropfen bilden den Bogen.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Selbst gemacht" />
      <div style={{ fontSize: 190, opacity: f }}>🚿🌈</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.sky, opacity: f }}>Gartenschlauch gegen die Sonne sprühen</div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Sprüh mit dem Schlauch gegen die Sonne – schon hast du deinen eigenen Regenbogen.</Caption>
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
  { id: 'tropfen', C: TropfenScene, min: 200 },
  { id: 'weg', C: WegScene, min: 280 },
  { id: 'bogen', C: BogenScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const REGENBOGEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Regenbogen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={REGENBOGEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/regenbogen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
