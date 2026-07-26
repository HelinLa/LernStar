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
import { ForceArrow, useFade } from '../forces';
import timings from '../narration/kraefte-gleichgewicht.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Lamp: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <line x1={x - 120} y1={y - 220} x2={x + 120} y2={y - 220} stroke={COLORS.muted} strokeWidth={10} />
    <line x1={x} y1={y - 220} x2={x} y2={y - 40} stroke={COLORS.muted} strokeWidth={4} />
    <text x={x - 40} y={y + 40} fontSize={80}>💡</text>
  </svg>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 150, marginBottom: 20 }}>💡🔗</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum fällt die Lampe nicht?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Die Schwerkraft zieht doch ständig an ihr.
      </div>
    </AbsoluteFill>
  );
};

const ZweiScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zwei Kräfte" title="Halten und Ziehen" />
      <div style={{ opacity: f }}>
        <Lamp x={960} y={560} />
        <ForceArrow x={960} y={540} angleDeg={-90} len={190} color={COLORS.green} label="Haltekraft" width={10} />
        <ForceArrow x={960} y={600} angleDeg={90} len={190} color={COLORS.red} label="Gewichtskraft" width={10} />
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Zwei Kräfte wirken: die Gewichtskraft nach unten und die Haltekraft des Seils nach oben.</Caption>
    </AbsoluteFill>
  );
};

const GleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gleich groß" title="Exakt dieselbe Stärke" />
      <div style={{ opacity: f }}>
        <Lamp x={960} y={560} />
        <ForceArrow x={960} y={540} angleDeg={-90} len={230} color={COLORS.green} label="5 N" width={11} />
        <ForceArrow x={960} y={600} angleDeg={90} len={230} color={COLORS.red} label="5 N" width={11} />
      </div>
      <div style={{ position: 'absolute', left: 1200, top: 520, fontSize: 34, fontWeight: 900, color: COLORS.amber, opacity: f }}>gleicher Betrag,<br />entgegengesetzt</div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Solange die Lampe hängt, sind beide Kräfte genau gleich groß – nur entgegengesetzt gerichtet.</Caption>
    </AbsoluteFill>
  );
};

const NullScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Zusammengerechnet" title="Resultierende = 0" />
      <div style={{ opacity: f, textAlign: 'center' }}>
        <div style={{ fontSize: 110, fontWeight: 900, color: COLORS.green }}>5 N − 5 N = 0</div>
        <div style={{ marginTop: 20, fontSize: 36, fontWeight: 800, color: COLORS.amber }}>keine Gesamtkraft → keine Bewegungsänderung</div>
        <div style={{ marginTop: 12, fontSize: 30, fontWeight: 700, color: COLORS.muted }}>die Kräfte sind im Gleichgewicht</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.45} />
      <Caption delay={40}>Zusammen heben sie sich auf – die Resultierende ist null, also bleibt die Lampe in Ruhe.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kräftegleichgewicht" footer="Resultierende null → keine Bewegungsänderung">
      Ein ruhender Körper ist im Kräftegleichgewicht.
      <br />
      Die wirkenden Kräfte heben sich auf,
      <br />
      die Resultierende ist null.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Gleichgewicht überall" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['📖', 'Buch auf dem Tisch'], ['🪂', 'Fallschirm sinkt gleichmäßig']].map((c, i) => (
          <div key={i} style={{ width: 440, padding: '34px', borderRadius: 24, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 100 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="whoosh" at={14} volume={0.34} />
      <Caption delay={40}>Buch auf dem Tisch, Fallschirm im Sinken – überall gleichen sich die Kräfte aus.</Caption>
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
  { id: 'gleich', C: GleichScene, min: 220 },
  { id: 'null', C: NullScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KRAEFTE_GLEICHGEWICHT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const KraefteGleichgewicht: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KRAEFTE_GLEICHGEWICHT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kraefte-gleichgewicht/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
