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
import timings from '../narration/spezialteleskop.timings.json';

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
      <div style={{ display: 'flex', gap: 50, marginBottom: 40, fontSize: 110 }}>
        <div>📡</div><div>🌡️</div><div>☢️</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 74, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Unsichtbares Licht sehen?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Unsere Augen sehen nur einen winzigen Teil aller Strahlung.
      </div>
    </AbsoluteFill>
  );
};

const StrahlScene: React.FC<SceneProps & { kicker: string; title: string; icon: string; color: string; note: string; caption: string }> = ({ kicker, title, icon, color, note, caption }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 10) * 0.06;
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker={kicker} title={title} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ position: 'relative', opacity: f }}>
          <div style={{ position: 'absolute', inset: -80, borderRadius: '50%', background: `radial-gradient(circle, ${color}55, transparent 70%)`, transform: `scale(${pulse})` }} />
          <div style={{ fontSize: 230 }}>{icon}</div>
        </div>
        <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color, opacity: f }}>{note}</div>
      </AbsoluteFill>
      <Sfx sound="pling" at={12} volume={0.4} />
      <Caption delay={30}>{caption}</Caption>
    </AbsoluteFill>
  );
};

const InfrarotScene: React.FC<SceneProps> = (p) => (
  <StrahlScene {...p} kicker="Unsichtbar 1" title="Infrarot (Wärme)" icon="🌡️🌫️" color="#ef4444" note="warmer Staub · Sternentstehung" caption="Infrarotteleskope zeigen warmen Staub und blicken durch Staubwolken hindurch." />
);
const RadioScene: React.FC<SceneProps> = (p) => (
  <StrahlScene {...p} kicker="Unsichtbar 2" title="Radiowellen" icon="📡" color="#38bdf8" note="kalte Gaswolken · ferne Galaxien" caption="Riesige Radioschüsseln empfangen das Funkeln kalter Gaswolken und ferner Galaxien." />
);
const RoentgenScene: React.FC<SceneProps> = (p) => (
  <StrahlScene {...p} kicker="Unsichtbar 3" title="Röntgenstrahlung" icon="☢️💥" color="#a855f7" note="heiße, energiereiche Orte" caption="Röntgenteleskope im All zeigen explodierende Sterne und die Umgebung schwarzer Löcher." />
);

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Spezialteleskope" footer="jede Strahlung zeigt etwas anderes">
      Infrarot zeigt warmen Staub, Radiowellen
      <br />
      zeigen kalte Gaswolken, Röntgenstrahlung
      <br />
      zeigt heiße, energiereiche Orte.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Das ganze Bild" />
      <div style={{ fontSize: 150, opacity: f }}>👁️ + 🌡️ + 📡 + ☢️</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Erst alle Strahlungsarten zusammen ergeben ein vollständiges Bild des Weltalls.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Jede Strahlungsart erzählt einen anderen Teil der Geschichte.</Caption>
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
  { id: 'infrarot', C: InfrarotScene, min: 210 },
  { id: 'radio', C: RadioScene, min: 210 },
  { id: 'roentgen', C: RoentgenScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SPEZIALTELESKOP_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Spezialteleskop: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SPEZIALTELESKOP_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/spezialteleskop/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
