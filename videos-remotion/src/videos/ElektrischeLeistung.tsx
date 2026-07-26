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
import timings from '../narration/elektrische-leistung.timings.json';

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
      <div style={{ display: 'flex', gap: 60, marginBottom: 30, fontSize: 110 }}>
        <div>💡</div><div>🫖</div><div>🔌</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Elektrische Leistung: P = U · I
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Was bedeutet die Watt-Zahl auf jedem Gerät?
      </div>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Formel" title="Spannung × Stromstärke" />
      <div style={{ fontSize: 140, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.red }}>P</span> = <span style={{ color: COLORS.green }}>U</span> · <span style={{ color: COLORS.amber }}>I</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.muted, opacity: f }}>Einheit: Watt (W) · Energie pro Sekunde</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Die Leistung P ist Spannung U mal Stromstärke I – Einheit Watt.</Caption>
    </AbsoluteFill>
  );
};

const SteigtScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 20], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Mehr U · mehr I → viel mehr P" />
      <div style={{ fontSize: 200 + p * 120, filter: `brightness(${0.6 + p})` }}>💡</div>
      <div style={{ position: 'absolute', bottom: 230, fontSize: 34, fontWeight: 900, color: COLORS.amber }}>P = {Math.round(p * 60)} W</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Mehr Spannung mal mehr Strom bedeutet viel mehr Leistung – hellere Lampe.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Rechnen" title="230 V · 2 A" />
      <div style={{ fontSize: 60, fontWeight: 900, opacity: f, textAlign: 'center', lineHeight: 1.6 }}>
        <span style={{ color: COLORS.green }}>230 V</span> · <span style={{ color: COLORS.amber }}>2 A</span> = <span style={{ color: COLORS.red }}>460 W</span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>230 Volt mal 2 Ampere ergibt 460 Watt – so viel Energie pro Sekunde.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Elektrische Leistung" footer="Energie pro Sekunde">
      P = U · I – Spannung mal Stromstärke.
      <br />
      Einheit: Watt (W).
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übertragen" title="Watt-Zahlen im Alltag" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 34, opacity: f }}>
          {[['💡', 'LED', '5 W', COLORS.green], ['📺', 'Fernseher', '100 W', COLORS.sky], ['🫖', 'Wasserkocher', '2000 W', COLORS.red]].map((c, i) => (
            <div key={i} style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[3]}`, textAlign: 'center' }}>
              <div style={{ fontSize: 74 }}>{c[0]}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: c[3] as string, marginTop: 4 }}>{c[2]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Hohe Wattzahl heißt: viel Energie pro Sekunde.</Caption>
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
  { id: 'steigt', C: SteigtScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ELEKTRISCHE_LEISTUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const ElektrischeLeistung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ELEKTRISCHE_LEISTUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/elektrische-leistung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
