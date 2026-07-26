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
import { useFade } from '../forces';
import timings from '../narration/masse-gewicht.timings.json';

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
      <div style={{ fontSize: 130, marginBottom: 20 }}>⚖️🆚🪝</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Schwer = viel Masse?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        In der Physik sind das zwei verschiedene Dinge.
      </div>
    </AbsoluteFill>
  );
};

const DefCard: React.FC<SceneProps & { kicker: string; title: string; icon: string; unit: string; tool: string; note: string; color: string; caption: string }> = ({ kicker, title, icon, unit, tool, note, color, caption }) => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker={kicker} title={title} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ opacity: f, textAlign: 'center', padding: '40px 60px', borderRadius: 26, background: COLORS.panel, border: `2px solid ${color}` }}>
          <div style={{ fontSize: 150 }}>{icon}</div>
          <div style={{ fontSize: 42, fontWeight: 900, color, marginTop: 10 }}>Einheit: {unit}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>gemessen mit: {tool}</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.amber, marginTop: 14 }}>{note}</div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>{caption}</Caption>
    </AbsoluteFill>
  );
};

const MasseScene: React.FC<SceneProps> = (p) => (
  <DefCard {...p} kicker="Begriff 1" title="Die Masse" icon="🧱" unit="Kilogramm (kg)" tool="Waage" note="überall gleich – Erde, Mond, All" color={COLORS.sky} caption="Die Masse ist die Stoffmenge – überall gleich, gemessen in Kilogramm." />
);
const GewichtScene: React.FC<SceneProps> = (p) => (
  <DefCard {...p} kicker="Begriff 2" title="Die Gewichtskraft" icon="🪝" unit="Newton (N)" tool="Kraftmesser" note="je nach Himmelskörper verschieden" color={COLORS.red} caption="Die Gewichtskraft ist die Anziehung – gemessen in Newton, nicht überall gleich." />
);

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Zusammenhang" title="G = m · g" />
      <div style={{ opacity: f, textAlign: 'center' }}>
        <div style={{ fontSize: 120, fontWeight: 900, color: COLORS.green }}>G = m · g</div>
        <div style={{ marginTop: 20, fontSize: 34, fontWeight: 700, color: COLORS.muted }}>Gewichtskraft = Masse × Ortsfaktor</div>
        <div style={{ marginTop: 24, fontSize: 40, fontWeight: 900, color: COLORS.amber }}>Erde: g ≈ 10 N/kg</div>
        <div style={{ marginTop: 10, fontSize: 32, fontWeight: 800, color: COLORS.sky }}>1 kg → rund 10 N</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.45} />
      <Caption delay={40}>Gewichtskraft ist Masse mal Ortsfaktor – auf der Erde rund 10 Newton pro Kilogramm.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Masse & Gewichtskraft" footer="G = m · g">
      Masse: Stoffmenge in kg, überall gleich, Waage.
      <br />
      Gewichtskraft: Anziehung in N, Kraftmesser.
      <br />
      Sie hängen zusammen über G = m · g.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Überall im Universum" />
      <div style={{ fontSize: 170, opacity: f }}>🌍🌕🪐</div>
      <div style={{ marginTop: 16, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Deine Masse bleibt gleich – aber wie schwer du dich anfühlst, hängt vom Himmelskörper ab.
      </div>
      <Sfx sound="whoosh" at={14} volume={0.34} />
      <Caption delay={40}>Masse bleibt – die Gewichtskraft ändert sich mit dem Ort.</Caption>
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
  { id: 'masse', C: MasseScene, min: 240 },
  { id: 'gewicht', C: GewichtScene, min: 240 },
  { id: 'formel', C: FormelScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MASSE_GEWICHT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const MasseGewicht: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MASSE_GEWICHT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/masse-gewicht/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
