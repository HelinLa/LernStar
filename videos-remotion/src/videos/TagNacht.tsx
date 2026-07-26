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
import { Sun, useFade } from '../astro';
import timings from '../narration/tag-nacht.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Erde mit Tag-/Nachtseite; Sonne links → rechte Erdhälfte hell? Sonne links heißt linke Hälfte hell.
const EarthDayNight: React.FC<{ x: number; y: number; r: number; spin: number; marker?: number }> = ({ x, y, r, spin, marker }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
    {/* Basis Erde */}
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%,#4ade80,#1d4ed8)', overflow: 'hidden' }}>
      {/* Nachtseite: linke Hälfte dunkel (Sonne steht rechts) */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', background: 'rgba(2,6,23,0.72)' }} />
    </div>
    {/* Standort-Marker rotiert mit */}
    {marker !== undefined ? (
      <div style={{ position: 'absolute', left: r + Math.cos((spin) * Math.PI / 180) * r * 0.86 - 12, top: r + Math.sin((spin) * Math.PI / 180) * r * 0.86 - 12, width: 24, height: 24, fontSize: 24 }}>📍</div>
    ) : null}
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
      <div style={{ display: 'flex', gap: 90, marginBottom: 40, fontSize: 130 }}>
        <div>🌇</div><div style={{ transform: `rotate(${frame * 2}deg)` }}>🌍</div><div>🌃</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie entstehen Tag und Nacht?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wandert wirklich die Sonne – oder dreht sich die Erde?
      </div>
    </AbsoluteFill>
  );
};

// ── Drehung ────────────────────────────────────────────────────────────
const DrehungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const spin = frame * 3;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Wahrheit" title="Die Erde dreht sich" />
      <Sun x={330} y={540} r={90} label="Sonne (steht still)" />
      <EarthDayNight x={1200} y={540} r={210} spin={spin} />
      <div style={{ position: 'absolute', left: 1150, top: 800, fontSize: 30, fontWeight: 800, color: COLORS.sky }}>1 Drehung ≈ 24 Stunden</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption>In etwa 24 Stunden dreht sich die Erde einmal um ihre eigene Achse.</Caption>
    </AbsoluteFill>
  );
};

// ── Tag/Nacht-Seite ────────────────────────────────────────────────────
const TagNachtScene: React.FC<SceneProps> = () => {
  const lab = useFade(30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zwei Seiten" title="Tag- und Nachtseite" />
      <Sun x={300} y={540} r={80} />
      <EarthDayNight x={1150} y={540} r={220} spin={0} />
      <div style={{ position: 'absolute', left: 1230, top: 500, fontSize: 34, fontWeight: 900, color: COLORS.amber, opacity: lab }}>☀️ Tag</div>
      <div style={{ position: 'absolute', left: 980, top: 500, fontSize: 34, fontWeight: 900, color: COLORS.sky, opacity: lab }}>🌙 Nacht</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={40}>Die zur Sonne zeigende Seite hat Tag, die abgewandte Nacht.</Caption>
    </AbsoluteFill>
  );
};

// ── Standort verfolgen ─────────────────────────────────────────────────
const StandortScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const spin = interpolate(frame, [10, dur - 10], [180, 540], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const onDay = Math.cos(spin * Math.PI / 180) > 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Dein Standort" title="Vom Schatten ins Licht" />
      <Sun x={300} y={540} r={80} />
      <EarthDayNight x={1150} y={540} r={220} spin={spin} marker={1} />
      <div style={{ position: 'absolute', left: 900, top: 820, fontSize: 32, fontWeight: 800, color: onDay ? COLORS.amber : COLORS.sky }}>
        📍 du: {onDay ? 'Tag – die Sonne „geht auf"' : 'Nacht'}
      </div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Nicht die Sonne bewegt sich – du drehst dich mit der Erde ins Licht.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Tag & Nacht" footer="nicht die Sonne wandert – die Erde dreht sich">
      Die Erde dreht sich in ca. 24 h
      <br />
      einmal um sich selbst.
      <br />
      Sonnenseite = Tag, abgewandt = Nacht.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Mittag hier, Nacht dort" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        <div style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 90 }}>🇩🇪☀️</div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 10, color: COLORS.amber }}>Deutschland: Mittag</div>
        </div>
        <div style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 90 }}>🇺🇸🌙</div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 10, color: COLORS.sky }}>Amerika: Nacht</div>
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Immer nur eine Hälfte der Erde schaut gerade zur Sonne.</Caption>
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
  { id: 'drehung', C: DrehungScene, min: 220 },
  { id: 'tagnacht', C: TagNachtScene, min: 220 },
  { id: 'standort', C: StandortScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TAG_NACHT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const TagNacht: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TAG_NACHT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/tag-nacht/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
