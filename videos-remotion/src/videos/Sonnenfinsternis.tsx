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
import { Sun, ShadowCone, useFade } from '../astro';
import timings from '../narration/sonnenfinsternis.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 190, marginBottom: 20 }}>🌒</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie entsteht eine Sonnenfinsternis?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum wird es mitten am Tag für kurze Zeit dunkel?
      </div>
    </AbsoluteFill>
  );
};

// ── Stellung: Mond zwischen Sonne und Erde ─────────────────────────────
const StellungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const align = interpolate(frame, [10, dur * 0.5], [180, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const moonY = 380 + align;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Stellung" title="Mond zwischen Sonne und Erde" />
      <Sun x={250} y={540} r={80} label="Sonne" />
      <div style={{ position: 'absolute', left: 880, top: moonY - 40, fontSize: 80 }}>🌑</div>
      <div style={{ position: 'absolute', left: 890, top: moonY + 40, fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Mond</div>
      <div style={{ position: 'absolute', left: 1480, top: 460, fontSize: 150 }}>🌍</div>
      <div style={{ position: 'absolute', left: 780, top: 800, fontSize: 28, fontWeight: 800, color: COLORS.amber }}>nur bei Neumond 🌑</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Bei Neumond schiebt sich der Mond genau vor die Sonne.</Caption>
    </AbsoluteFill>
  );
};

// ── Schatten auf die Erde ──────────────────────────────────────────────
const SchattenScene: React.FC<SceneProps> = () => {
  const p = useFade(10, 30);
  const sun: [number, number] = [250, 540];
  const moon: [number, number] = [900, 540];
  const earth: [number, number] = [1520, 540];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Schatten" title="Kernschatten & Halbschatten" />
      <Sun x={sun[0]} y={sun[1]} r={80} />
      <div style={{ position: 'absolute', left: moon[0] - 40, top: moon[1] - 40, fontSize: 80 }}>🌑</div>
      {/* Kernschatten-Kegel Mond → Erde */}
      <ShadowCone pts={[[moon[0], moon[1] - 44], [moon[0], moon[1] + 44], [earth[0] - 60, earth[1] + 20], [earth[0] - 60, earth[1] - 20]]} opacity={0.6 * p} />
      <div style={{ position: 'absolute', left: earth[0] - 70, top: earth[1] - 70, fontSize: 150 }}>🌍</div>
      <div style={{ position: 'absolute', left: earth[0] - 110, top: earth[1] + 80, fontSize: 24, fontWeight: 800, color: COLORS.red, opacity: p }}>Kernschatten: Sonne ganz verdeckt</div>
      <Sfx sound="impact" at={20} volume={0.36} />
      <Caption delay={30}>Im Kernschatten ist die Sonne ganz verdeckt – totale Finsternis.</Caption>
    </AbsoluteFill>
  );
};

// ── Warum selten ───────────────────────────────────────────────────────
const SeltenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum selten?" title="Die Mondbahn ist geneigt" />
      <Sun x={250} y={540} r={70} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: f }} viewBox="0 0 1920 1080">
        <line x1={340} y1={540} x2={1520} y2={540} stroke={COLORS.border} strokeWidth={3} strokeDasharray="8 8" />
      </svg>
      <div style={{ position: 'absolute', left: 900, top: 400, fontSize: 70 }}>🌑</div>
      <div style={{ position: 'absolute', left: 1480, top: 470, fontSize: 130 }}>🌍</div>
      <div style={{ position: 'absolute', left: 820, top: 320, fontSize: 26, fontWeight: 800, color: COLORS.sky, opacity: f }}>meist zieht der Mond drüber oder drunter vorbei</div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Nur wenn alles perfekt auf einer Linie liegt, trifft der Schatten die Erde.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Sonnenfinsternis" footer="passiert nur selten – geneigte Mondbahn">
      Bei Neumond steht der Mond zwischen
      <br />
      Sonne und Erde und wirft seinen
      <br />
      Schatten auf die Erde.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer (Warnung) ─────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Wichtig" title="Nie ungeschützt hinschauen!" />
      <div style={{ fontSize: 180, opacity: f }}>😎🚫☀️</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.red, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Nur mit spezieller Sonnenfinsternis-Brille beobachten.
      </div>
      <Sfx sound="impact" at={14} volume={0.34} />
      <Caption delay={40}>Direktes Sonnenlicht kann die Augen dauerhaft schädigen.</Caption>
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
  { id: 'stellung', C: StellungScene, min: 240 },
  { id: 'schatten', C: SchattenScene, min: 240 },
  { id: 'selten', C: SeltenScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SONNENFINSTERNIS_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Sonnenfinsternis: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SONNENFINSTERNIS_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/sonnenfinsternis/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
