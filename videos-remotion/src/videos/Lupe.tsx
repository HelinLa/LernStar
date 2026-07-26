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
import timings from '../narration/lupe.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CX = 1040;
const AXIS = 560;
const F = 300;

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const z = 1 + Math.sin(frame / 20) * 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 200, marginBottom: 20, transform: `scale(${z})` }}>🔎</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie funktioniert eine Lupe?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie macht eine Linse die Buchstaben größer als sie sind?
      </div>
    </AbsoluteFill>
  );
};

// ── Ist eine Sammellinse ───────────────────────────────────────────────
const IstLinseScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Was ist das?" title="Eine Lupe = Sammellinse" />
      <div style={{ display: 'flex', gap: 60, alignItems: 'center', opacity: f }}>
        <div style={{ fontSize: 180 }}>🔎</div>
        <div style={{ fontSize: 70 }}>=</div>
        <div style={{ fontSize: 140 }}>🔵</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 32, fontWeight: 700, color: COLORS.amber, opacity: f }}>
        Trick: Gegenstand NÄHER als die Brennweite halten
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Eine Lupe ist eine Sammellinse mit kurzer Brennweite.</Caption>
    </AbsoluteFill>
  );
};

// ── Virtuelles Bild (Konstruktion) ─────────────────────────────────────
const VirtuellScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum größer?" title="Das virtuelle Lupenbild" />
      <Axis y={AXIS} />
      <ConvexLens cx={CX} cy={AXIS} f={F} />
      <LensImage cx={CX} axisY={AXIS} f={F} g={180} objH={120} progress={p} />
      <div style={{ position: 'absolute', left: 250, top: 250, fontSize: 26, fontWeight: 800, color: COLORS.indigo }}>👁️ Auge sieht großes, aufrechtes Bild</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.6)}>Innerhalb der Brennweite entsteht ein vergrößertes, aufrechtes, virtuelles Bild.</Caption>
    </AbsoluteFill>
  );
};

// ── Näher = größer ─────────────────────────────────────────────────────
const NaeherScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const g = interpolate(frame, [15, dur - 20], [110, 260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const over = g > F;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Abstand" title={over ? 'Über F → Bild kippt' : 'Näher an F → größer'} />
      <Axis y={AXIS} />
      <ConvexLens cx={CX} cy={AXIS} f={F} />
      <LensImage cx={CX} axisY={AXIS} f={F} g={g} objH={110} progress={1} />
      <Sfx sound="pop" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Je näher an der Brennweite, desto größer – über F hinaus kippt das Bild.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Lupe" footer="innerhalb der Brennweite">
      Eine Lupe ist eine Sammellinse.
      <br />
      Nah am Gegenstand entsteht ein
      <br />
      vergrößertes, aufrechtes, virtuelles Bild.
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
    <SceneTitle kicker="Übertragen" title="Lupenprinzip überall" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🔬" title="Mikroskop" delay={10} />
        <TCard icon="🔭" title="Fernglas" delay={30} />
        <TCard icon="⌚" title="Uhrmacher-Lupe" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall, wo Kleines oder Fernes größer erscheinen soll.</Caption>
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
  { id: 'istlinse', C: IstLinseScene, min: 220 },
  { id: 'virtuell', C: VirtuellScene, min: 280 },
  { id: 'naeher', C: NaeherScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LUPE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Lupe: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LUPE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/lupe/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
