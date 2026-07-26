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
import { SoundWaves, useFade } from '../sound';
import timings from '../narration/ohr.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Weg des Schalls als nummerierte Stationen; active hebt eine hervor.
const STATIONS = [
  { icon: '👂', name: 'Ohrmuschel', note: 'sammelt' },
  { icon: '〰️', name: 'Gehörgang', note: 'leitet' },
  { icon: '🥁', name: 'Trommelfell', note: 'schwingt' },
  { icon: '🦴', name: 'Gehörknöchelchen', note: 'übertragen' },
  { icon: '🐚', name: 'Schnecke', note: 'wandelt um' },
  { icon: '🧠', name: 'Gehirn', note: 'hört' },
];
const StationRow: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ position: 'absolute', left: 0, top: 420, width: '100%', display: 'flex', justifyContent: 'center', gap: 14 }}>
    {STATIONS.map((s, i) => (
      <React.Fragment key={i}>
        <div style={{ width: 200, padding: '16px 8px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${i === active ? COLORS.amber : COLORS.border}`, textAlign: 'center', transform: i === active ? 'scale(1.06)' : 'scale(1)', opacity: i <= active ? 1 : 0.4 }}>
          <div style={{ fontSize: 46 }}>{s.icon}</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{s.name}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.muted }}>{s.note}</div>
        </div>
        {i < STATIONS.length - 1 ? <div style={{ alignSelf: 'center', fontSize: 30, color: i < active ? COLORS.amber : COLORS.border }}>→</div> : null}
      </React.Fragment>
    ))}
  </div>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 200, marginBottom: 20 }}>👂</div>
      <SoundWaves x={760} y={300} count={3} />
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie funktioniert das Ohr?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie wird aus schwingender Luft ein Klang?
      </div>
    </AbsoluteFill>
  );
};

const StationScene: React.FC<SceneProps & { active: number; kicker: string; title: string; caption: string }> = ({ active, kicker, title, caption }) => (
  <AbsoluteFill>
    <SceneTitle kicker={kicker} title={title} />
    <StationRow active={active} />
    <Sfx sound="pop" at={8} volume={0.3} />
    <Caption delay={16}>{caption}</Caption>
  </AbsoluteFill>
);

const SammelnScene: React.FC<SceneProps> = (p) => (
  <StationScene {...p} active={1} kicker="Station 1–2" title="Sammeln & Leiten" caption="Die Ohrmuschel fängt den Schall wie ein Trichter und leitet ihn in den Gehörgang." />
);
const TrommelfellScene: React.FC<SceneProps> = (p) => (
  <StationScene {...p} active={2} kicker="Station 3" title="Das Trommelfell schwingt" caption="Die Schallwellen bringen die dünne, gespannte Haut zum Schwingen – im Takt des Tons." />
);
const KnoechelchenScene: React.FC<SceneProps> = (p) => (
  <StationScene {...p} active={3} kicker="Station 4" title="Die Gehörknöchelchen" caption="Hammer, Amboss und Steigbügel nehmen die Schwingung auf und verstärken sie." />
);
const SchneckeScene: React.FC<SceneProps> = (p) => (
  <StationScene {...p} active={5} kicker="Station 5–6" title="Schnecke → Gehirn" caption="Die Schnecke wandelt die Schwingung in Nervensignale um – der Hörnerv meldet sie ans Gehirn." />
);

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Das Ohr" footer="erst im Gehirn entsteht der Klang">
      Ohrmuschel sammelt, Gehörgang leitet,
      <br />
      Trommelfell schwingt, Knöchelchen übertragen,
      <br />
      Schnecke wandelt um, Hörnerv meldet.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Empfindlich – schütz es!" />
      <div style={{ fontSize: 180, opacity: f }}>🥁⚠️</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.red, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Sehr lauter Schall kann das Trommelfell verletzen.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Deshalb solltest du dein Gehör vor großer Lautstärke schützen.</Caption>
    </AbsoluteFill>
  );
};

// ── Outro ──────────────────────────────────────────────────────────────
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
  { id: 'sammeln', C: SammelnScene, min: 220 },
  { id: 'trommelfell', C: TrommelfellScene, min: 220 },
  { id: 'knoechelchen', C: KnoechelchenScene, min: 240 },
  { id: 'schnecke', C: SchneckeScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const OHR_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Ohr: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={OHR_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/ohr/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
