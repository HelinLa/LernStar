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
import { Axis, ConvexLens, LensImage, useFade } from '../lens';
import timings from '../narration/bild-linse.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CX = 960;
const AXIS = 560;
const F = 260;

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 70, marginBottom: 40, fontSize: 120 }}>
        <div>🔎</div><div>📽️</div><div>📷</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 74, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Vergrößert oder verkleinert?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Dieselbe Linse – der Abstand entscheidet über das Bild.
      </div>
    </AbsoluteFill>
  );
};

// ── Konstruktion (zwei Strahlen) ───────────────────────────────────────
const KonstruktionScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="So geht's" title="Bild mit zwei Strahlen" />
      <Axis y={AXIS} />
      <ConvexLens cx={CX} cy={AXIS} f={F} />
      <LensImage cx={CX} axisY={AXIS} f={F} g={620} objH={170} progress={p} />
      <div style={{ position: 'absolute', left: 340, top: 300, fontSize: 24, fontWeight: 800, color: COLORS.amber }}>🟡 Parallelstrahl → durch F</div>
      <div style={{ position: 'absolute', left: 340, top: 350, fontSize: 24, fontWeight: 800, color: COLORS.sky }}>🔵 Mittelpunktstrahl → gerade</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.6)}>Wo sich die zwei Strahlen treffen, liegt die Spitze des Bildes.</Caption>
    </AbsoluteFill>
  );
};

// ── Fall 1: g > 2f → verkleinert ───────────────────────────────────────
const FernScene: React.FC<SceneProps> = ({ dur }) => {
  const p = useFade(12, 40);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Fall 1: g > 2F" title="Verkleinert & umgekehrt" />
      <Axis y={AXIS} />
      <ConvexLens cx={CX} cy={AXIS} f={F} />
      <LensImage cx={CX} axisY={AXIS} f={F} g={700} objH={180} progress={p} />
      <div style={{ position: 'absolute', left: 1150, top: 640, fontSize: 26, fontWeight: 800, color: COLORS.red }}>reell · verkleinert · umgekehrt → Kamera 📷</div>
      <Sfx sound="pling" at={30} volume={0.4} />
      <Caption delay={44}>Weiter als 2F: ein kleines, umgekehrtes, reelles Bild – wie in der Kamera.</Caption>
    </AbsoluteFill>
  );
};

// ── Fall 2: F < g < 2f → vergrößert ────────────────────────────────────
const NahScene: React.FC<SceneProps> = () => {
  const p = useFade(12, 40);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Fall 2: F < g < 2F" title="Vergrößert & umgekehrt" />
      <Axis y={AXIS} />
      <ConvexLens cx={CX} cy={AXIS} f={F} />
      <LensImage cx={CX} axisY={AXIS} f={F} g={400} objH={150} progress={p} />
      <div style={{ position: 'absolute', left: 1050, top: 780, fontSize: 26, fontWeight: 800, color: COLORS.red }}>reell · vergrößert · umgekehrt → Projektor 📽️</div>
      <Sfx sound="pling" at={30} volume={0.4} />
      <Caption delay={44}>Zwischen F und 2F: ein großes, umgekehrtes, reelles Bild – wie im Projektor.</Caption>
    </AbsoluteFill>
  );
};

// ── Fall 3: g < f → virtuell (Lupe) ────────────────────────────────────
const InnerhalbScene: React.FC<SceneProps> = () => {
  const p = useFade(12, 40);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Fall 3: g < F" title="Vergrößert, aufrecht, virtuell" />
      <Axis y={AXIS} />
      <ConvexLens cx={CX} cy={AXIS} f={F} />
      <LensImage cx={CX} axisY={AXIS} f={F} g={170} objH={130} progress={p} />
      <div style={{ position: 'absolute', left: 300, top: 250, fontSize: 26, fontWeight: 800, color: COLORS.indigo }}>virtuell · vergrößert · aufrecht → Lupe 🔎</div>
      <Sfx sound="pling" at={30} volume={0.4} />
      <Caption delay={44}>Näher als F: die Strahlen treffen sich nicht – rückwärts verlängert entsteht das Lupenbild.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Bild an der Linse" footer="der Abstand g entscheidet">
      Über 2F: verkleinert. Zwischen F und 2F: vergrößert
      <br />
      (beide umgekehrt, reell).
      <br />
      Näher als F: vergrößert, aufrecht, virtuell (Lupe).
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Drei Fälle, drei Geräte" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="📷" title="Kamera (verkleinert)" delay={10} />
        <TCard icon="📽️" title="Projektor (vergrößert)" delay={30} />
        <TCard icon="🔎" title="Lupe (virtuell)" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Dieselbe Sammellinse – nur der Abstand macht den Unterschied.</Caption>
  </AbsoluteFill>
);

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
  { id: 'konstruktion', C: KonstruktionScene, min: 280 },
  { id: 'fern', C: FernScene, min: 260 },
  { id: 'nah', C: NahScene, min: 240 },
  { id: 'innerhalb', C: InnerhalbScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BILD_LINSE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const BildLinse: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BILD_LINSE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/bild-linse/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
