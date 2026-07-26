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
import { Sun, Orbit, useFade } from '../astro';
import timings from '../narration/weltall-aufbau.timings.json';

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
      <div style={{ display: 'flex', gap: 50, marginBottom: 40, fontSize: 100 }}>
        <div>🪐</div><div>⭐</div><div>🌌</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie ist das Weltall aufgebaut?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Unvorstellbar groß – aber klar geordnet in Stufen.
      </div>
    </AbsoluteFill>
  );
};

const SonnensystemScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Stufe 1" title="Das Sonnensystem" />
      <Sun x={960} y={560} r={70} />
      {[200, 300, 400].map((R, i) => {
        const ang = frame * (3 - i * 0.7);
        const x = 960 + Math.cos((ang * Math.PI) / 180) * R;
        const y = 560 + Math.sin((ang * Math.PI) / 180) * R * 0.6;
        return (
          <React.Fragment key={i}>
            <Orbit cx={960} cy={560} rx={R} ry={R * 0.6} />
            <div style={{ position: 'absolute', left: x - 22, top: y - 22, fontSize: 44 }}>{['🪐', '🌍', '🔴'][i]}</div>
          </React.Fragment>
        );
      })}
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>In der Mitte die Sonne, ein Stern – um sie kreisen die Planeten mit der Erde.</Caption>
    </AbsoluteFill>
  );
};

const GalaxieScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Stufe 2 – rauszoomen" title="Die Galaxie (Milchstraße)" />
      <div style={{ fontSize: 340, opacity: f, transform: `rotate(${frame * 0.6}deg)` }}>🌌</div>
      <div style={{ position: 'absolute', bottom: 200, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: f }}>Milliarden Sterne – unsere Sonne ist nur einer</div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Milliarden Sterne bilden eine Galaxie – unsere heißt Milchstraße.</Caption>
    </AbsoluteFill>
  );
};

const UniversumScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Stufe 3 – noch weiter" title="Das Universum" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 30, opacity: f }}>
        {Array.from({ length: 15 }).map((_, i) => <div key={i} style={{ fontSize: 70 }}>🌌</div>)}
      </div>
      <div style={{ marginTop: 20, fontSize: 30, fontWeight: 800, color: COLORS.sky, opacity: f }}>Milliarden Galaxien = das Universum</div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Milliarden Galaxien zusammen bilden das Universum.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Aufbau des Weltalls" footer="gestuft: klein bis unvorstellbar groß">
      Planeten → Stern (Sonnensystem) →
      <br />
      Milliarden Sterne (Galaxie) →
      <br />
      Milliarden Galaxien (Universum).
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Dein Platz im Kosmos" />
      <div style={{ fontSize: 60, fontWeight: 800, color: COLORS.amber, opacity: f, textAlign: 'center', lineHeight: 1.5 }}>
        🧍 → 🌍 → ☀️ → 🌌 → ✨
      </div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 700, color: COLORS.muted, opacity: f }}>ein winziger Punkt in einem riesigen Ganzen</div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Du lebst auf einem Planeten, der einen Stern in einer von unzähligen Galaxien umkreist.</Caption>
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
  { id: 'sonnensystem', C: SonnensystemScene, min: 240 },
  { id: 'galaxie', C: GalaxieScene, min: 220 },
  { id: 'universum', C: UniversumScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WELTALL_AUFBAU_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const WeltallAufbau: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WELTALL_AUFBAU_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/weltall-aufbau/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
