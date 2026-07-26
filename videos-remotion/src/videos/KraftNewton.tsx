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
import timings from '../narration/kraft-newton.timings.json';

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
      <div style={{ fontSize: 150, marginBottom: 20 }}>💪📦</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Kraft: F = m · a
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Newtons Schlüsselgesetz: Masse, Beschleunigung, Kraft.
      </div>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="2. Newtonsches Gesetz" title="Kraft = Masse × Beschleunigung" />
      <div style={{ fontSize: 150, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.red }}>F</span> = <span style={{ color: COLORS.sky }}>m</span> · <span style={{ color: COLORS.amber }}>a</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>mehr Masse oder mehr Beschleunigung → mehr Kraft nötig</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Kraft gleich Masse mal Beschleunigung.</Caption>
    </AbsoluteFill>
  );
};

const NewtonScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Einheit" title="Das Newton (N)" />
      <div style={{ opacity: f, textAlign: 'center' }}>
        <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.green }}>1 N = 1 kg · m/s²</div>
        <div style={{ marginTop: 30, fontSize: 34, fontWeight: 700, color: COLORS.muted, maxWidth: 1200 }}>
          die Kraft, die 1 kg mit 1 m/s² beschleunigt
        </div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Ein Newton beschleunigt ein Kilogramm mit einem Meter pro Sekunde zum Quadrat.</Caption>
    </AbsoluteFill>
  );
};

const GewichtScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Wichtiger Fall" title="Die Gewichtskraft G = m · g" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', opacity: f }}>
        <div style={{ fontSize: 100 }}>📦</div>
        <svg width={80} height={180}><line x1={40} y1={10} x2={40} y2={150} stroke={COLORS.red} strokeWidth={8} /><polygon points="24,140 56,140 40,170" fill={COLORS.red} /></svg>
        <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.red }}>G = m · g</div>
      </div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, opacity: f }}>g ≈ 10 m/s² → 1 kg wiegt ~10 N</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Die Gewichtskraft zieht jeden Körper zur Erde: 1 kg wiegt rund 10 Newton.</Caption>
    </AbsoluteFill>
  );
};

const ArtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Kraftarten" title="Immer Betrag & Richtung (Vektor)" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 34, opacity: f }}>
          {[['🛑', 'Reibung'], ['🌀', 'Federkraft'], ['⬆️', 'Normalkraft']].map((c, i) => (
            <div key={i} style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 70 }}>{c[0]}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Kräfte sind Vektoren – man zeichnet sie als Pfeile mit Richtung.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kraft" footer="Gewichtskraft G = m · g (g ≈ 10 m/s²)">
      F = m · a (Masse mal Beschleunigung).
      <br />
      Einheit: 1 Newton = 1 kg · m/s².
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Vom Einkaufswagen zur Rakete" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🛒', 'voll = mehr Kraft nötig'], ['🚀', 'große Masse → riesige Kraft']].map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Dieselbe Formel erklärt beides: mehr Masse braucht mehr Kraft.</Caption>
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
  { id: 'formel', C: FormelScene, min: 220 },
  { id: 'newton', C: NewtonScene, min: 220 },
  { id: 'gewicht', C: GewichtScene, min: 240 },
  { id: 'arten', C: ArtenScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KRAFT_NEWTON_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const KraftNewton: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KRAFT_NEWTON_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kraft-newton/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
