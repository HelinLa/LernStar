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
import { useFade } from '../electric';
import timings from '../narration/v-umrechnung.timings.json';

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
      <div style={{ display: 'flex', gap: 40, marginBottom: 30, fontSize: 60, fontWeight: 900 }}>
        <div style={{ color: COLORS.sky }}>m/s</div><div style={{ color: COLORS.muted }}>⇄</div><div style={{ color: COLORS.green }}>km/h</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        m/s und km/h umrechnen
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Dieselbe Geschwindigkeit – nur andere Zahlen.
      </div>
    </AbsoluteFill>
  );
};

const FaktorScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Schlüssel" title="Die Zahl 3,6" />
      <div style={{ fontSize: 90, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.sky }}>1 m/s</span> = <span style={{ color: COLORS.green }}>3,6 km/h</span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Ein Meter pro Sekunde sind genau 3,6 Kilometer pro Stunde.</Caption>
    </AbsoluteFill>
  );
};

const MalScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Von m/s nach km/h" title="× 3,6" />
      <div style={{ display: 'flex', gap: 30, alignItems: 'center', opacity: f, fontSize: 50, fontWeight: 900 }}>
        <div style={{ color: COLORS.sky }}>10 m/s</div>
        <div style={{ color: COLORS.amber }}>× 3,6 →</div>
        <div style={{ color: COLORS.green }}>36 km/h</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>Zahl wird größer</div>
      <Sfx sound="whoosh" at={16} volume={0.3} />
      <Caption delay={40}>Von Meter pro Sekunde nach Kilometer pro Stunde: mal 3,6.</Caption>
    </AbsoluteFill>
  );
};

const GeteiltScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Von km/h nach m/s" title="÷ 3,6" />
      <div style={{ display: 'flex', gap: 30, alignItems: 'center', opacity: f, fontSize: 50, fontWeight: 900 }}>
        <div style={{ color: COLORS.green }}>72 km/h</div>
        <div style={{ color: COLORS.amber }}>÷ 3,6 →</div>
        <div style={{ color: COLORS.sky }}>20 m/s</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>Zahl wird kleiner</div>
      <Sfx sound="whoosh" at={16} volume={0.3} />
      <Caption delay={40}>Von Kilometer pro Stunde nach Meter pro Sekunde: durch 3,6.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Umrechnen" footer="1 m/s = 3,6 km/h">
      m/s → km/h: mal 3,6.
      <br />
      km/h → m/s: durch 3,6.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Tempo im Alltag" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🏙️', '50 km/h ≈ 14 m/s'], ['⚽', '30 m/s ≈ 108 km/h']].map((c, i) => (
          <div key={i} style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>50 km/h in der Stadt sind knapp 14 Meter pro Sekunde.</Caption>
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
  { id: 'faktor', C: FaktorScene, min: 200 },
  { id: 'mal', C: MalScene, min: 220 },
  { id: 'geteilt', C: GeteiltScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 160 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const V_UMRECHNUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const VUmrechnung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={V_UMRECHNUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/v-umrechnung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
