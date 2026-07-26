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
import { LightSource, Ray, Screen, ShadowPatch, useFade } from '../optik';
import timings from '../narration/schatten.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Schatten-Kegel (dunkles Polygon von den Körperkanten zum Schirm)
const ShadowCone: React.FC<{ pts: [number, number][]; opacity?: number }> = ({ pts, opacity = 0.62 }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="#020617" opacity={opacity} />
  </svg>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 110, marginBottom: 40 }}>
        {['🔦', '🧍', '🌑'].map((e, i) => (
          <div key={i} style={{ fontSize: 130, transform: `translateY(${Math.sin(frame / 22 + i) * 16}px)` }}>
            {e}
          </div>
        ))}
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 88, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Schatten
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum hast du einen dunklen Zwilling am Boden – und warum wird es bei einer Sonnenfinsternis dunkel?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: Lampe → Ball → Schatten an der Wand ────────────────────
const lamp0: [number, number] = [280, 380];
const ball0: [number, number] = [860, 560];
const SCREEN_X = 1500;
// Projektion der Ballkanten auf den Schirm (aus Sicht der Lampe)
const projectY = (L: [number, number], edgeY: number, edgeX: number) =>
  L[1] + (edgeY - L[1]) * ((SCREEN_X - L[0]) / (edgeX - L[0]));

const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const shadowIn = useFade(Math.round(dur * 0.32));
  const topEdge = ball0[1] - 72;
  const botEdge = ball0[1] + 72;
  const sTop = projectY(lamp0, topEdge, ball0[0]);
  const sBot = projectY(lamp0, botEdge, ball0[0]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Hinter dem Körper wird es dunkel" />
      <LightSource x={lamp0[0]} y={lamp0[1]} emoji="💡" label="Lampe" />
      {/* Lichtstrahlen: oben/unten am Ball vorbei bis zum Schirm */}
      <Ray x1={lamp0[0] + 20} y1={lamp0[1]} x2={SCREEN_X} y2={260} progress={p} color={COLORS.amber} width={4} opacity={0.7} />
      <Ray x1={lamp0[0] + 20} y1={lamp0[1]} x2={SCREEN_X} y2={950} progress={p} color={COLORS.amber} width={4} opacity={0.7} />
      {/* blockierte Strahlen: nur bis zum Ball */}
      <Ray x1={lamp0[0] + 20} y1={lamp0[1]} x2={ball0[0]} y2={topEdge} progress={p} color={COLORS.amber} width={4} opacity={0.5} />
      <Ray x1={lamp0[0] + 20} y1={lamp0[1]} x2={ball0[0]} y2={botEdge} progress={p} color={COLORS.amber} width={4} opacity={0.5} />
      <Screen x={SCREEN_X} yTop={200} yBot={980} label="Wand" />
      {/* Schattenkegel + dunkle Fläche auf der Wand */}
      {p > 0.9 ? (
        <>
          <ShadowCone pts={[[ball0[0], topEdge], [SCREEN_X, sTop], [SCREEN_X, sBot], [ball0[0], botEdge]]} opacity={0.5 * shadowIn} />
          <ShadowPatch x={SCREEN_X + 11} yTop={sTop} yBot={sBot} w={26} opacity={0.9 * shadowIn} />
        </>
      ) : null}
      <div style={{ position: 'absolute', left: SCREEN_X + 40, top: (sTop + sBot) / 2 - 24, fontSize: 30, fontWeight: 800, color: COLORS.sky, opacity: shadowIn }}>
        Schatten
      </div>
      <div style={{ position: 'absolute', left: ball0[0] - 72, top: ball0[1] - 72, fontSize: 144 }}>⚽</div>
      <Sfx sound="pling" at={Math.round(dur * 0.32) + 3} volume={0.45} />
      <Caption delay={Math.round(dur * 0.32) + 8}>Der Schatten liegt immer auf der Seite, die von der Lampe weg zeigt.</Caption>
    </AbsoluteFill>
  );
};

// ── Zusammenhang: geradlinig + undurchsichtig blockiert ────────────────
const ZusammenhangScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [8, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lab = useFade(52);
  const topEdge = ball0[1] - 72;
  const botEdge = ball0[1] + 72;
  const sTop = projectY(lamp0, topEdge, ball0[0]);
  const sBot = projectY(lamp0, botEdge, ball0[0]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum?" title="Geradliniges Licht wird blockiert" />
      <LightSource x={lamp0[0]} y={lamp0[1]} emoji="💡" />
      <Ray x1={lamp0[0] + 20} y1={lamp0[1]} x2={SCREEN_X} y2={260} progress={p} color={COLORS.green} width={5} opacity={0.85} />
      <Ray x1={lamp0[0] + 20} y1={lamp0[1]} x2={SCREEN_X} y2={950} progress={p} color={COLORS.green} width={5} opacity={0.85} />
      <Ray x1={lamp0[0] + 20} y1={lamp0[1]} x2={ball0[0]} y2={topEdge} progress={p} color={COLORS.red} width={5} opacity={0.85} />
      <Ray x1={lamp0[0] + 20} y1={lamp0[1]} x2={ball0[0]} y2={botEdge} progress={p} color={COLORS.red} width={5} opacity={0.85} />
      <Screen x={SCREEN_X} yTop={200} yBot={980} />
      <ShadowCone pts={[[ball0[0], topEdge], [SCREEN_X, sTop], [SCREEN_X, sBot], [ball0[0], botEdge]]} opacity={0.5} />
      <ShadowPatch x={SCREEN_X + 11} yTop={sTop} yBot={sBot} w={26} opacity={0.9} />
      <div style={{ position: 'absolute', left: ball0[0] - 72, top: ball0[1] - 72, fontSize: 144 }}>⚽</div>
      <div style={{ position: 'absolute', left: 640, top: 300, fontSize: 28, fontWeight: 800, color: COLORS.red, opacity: lab }}>🔴 blockiert</div>
      <div style={{ position: 'absolute', left: 1080, top: 240, fontSize: 28, fontWeight: 800, color: COLORS.green, opacity: lab }}>🟢 läuft weiter</div>
      <Sfx sound="pop" at={10} volume={0.34} />
      <Caption>Der Ball stoppt die roten Strahlen – die grünen laufen daneben weiter.</Caption>
    </AbsoluteFill>
  );
};

// ── Variieren: Lampe hoch → Schatten runter ────────────────────────────
const VariierenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [20, dur - 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lampY = interpolate(move, [0, 1], [560, 250]);
  const L: [number, number] = [280, lampY];
  const topEdge = ball0[1] - 72;
  const botEdge = ball0[1] + 72;
  const sTop = projectY(L, topEdge, ball0[0]);
  const sBot = projectY(L, botEdge, ball0[0]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ausprobieren" title="Lampe hoch → Schatten runter" />
      <LightSource x={L[0]} y={L[1]} emoji="💡" label="Lampe" />
      <Ray x1={L[0] + 20} y1={L[1]} x2={ball0[0]} y2={topEdge} color={COLORS.amber} width={4} opacity={0.6} />
      <Ray x1={L[0] + 20} y1={L[1]} x2={ball0[0]} y2={botEdge} color={COLORS.amber} width={4} opacity={0.6} />
      <Screen x={SCREEN_X} yTop={200} yBot={980} label="Wand" />
      <ShadowCone pts={[[ball0[0], topEdge], [SCREEN_X, sTop], [SCREEN_X, sBot], [ball0[0], botEdge]]} opacity={0.5} />
      <ShadowPatch x={SCREEN_X + 11} yTop={sTop} yBot={sBot} w={26} opacity={0.9} />
      <div style={{ position: 'absolute', left: ball0[0] - 72, top: ball0[1] - 72, fontSize: 144 }}>⚽</div>
      {/* Bewegungspfeile */}
      <div style={{ position: 'absolute', left: L[0] - 4, top: 150, fontSize: 44, color: COLORS.sky }}>⬆</div>
      <div style={{ position: 'absolute', left: SCREEN_X + 44, top: (sTop + sBot) / 2 - 26, fontSize: 44, color: COLORS.sky }}>⬇</div>
      <Caption>Der Schatten liegt der Lampe immer gegenüber. Glas dagegen lässt Licht durch – fast kein Schatten.</Caption>
    </AbsoluteFill>
  );
};

// ── Beispiel: Sonnenfinsternis (Mond wirft Schatten auf Erde) ──────────
const FinsternisScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sun: [number, number] = [230, 400];
  const moon: [number, number] = [880, 470];
  const earth: [number, number] = [1500, 560];
  const lab = useFade(60);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="Sonnenfinsternis" />
      <LightSource x={sun[0]} y={sun[1]} r={78} emoji="☀️" label="Sonne" />
      {/* Strahlen an Mondkanten vorbei, laufen zusammen hinter dem Mond */}
      <Ray x1={sun[0] + 40} y1={sun[1]} x2={moon[0]} y2={moon[1] - 60} progress={p} color={COLORS.amber} width={4} opacity={0.6} />
      <Ray x1={sun[0] + 40} y1={sun[1]} x2={moon[0]} y2={moon[1] + 60} progress={p} color={COLORS.amber} width={4} opacity={0.6} />
      {/* Kernschatten-Kegel Mond → Erde */}
      {p > 0.9 ? (
        <ShadowCone pts={[[moon[0], moon[1] - 58], [moon[0], moon[1] + 58], [earth[0] - 40, earth[1] + 22], [earth[0] - 40, earth[1] - 22]]} opacity={0.6} />
      ) : null}
      <div style={{ position: 'absolute', left: moon[0] - 46, top: moon[1] - 46, fontSize: 92 }}>🌑</div>
      <div style={{ position: 'absolute', left: moon[0] - 30, top: moon[1] + 60, fontSize: 26, fontWeight: 700, color: COLORS.muted }}>Mond</div>
      <div style={{ position: 'absolute', left: earth[0] - 70, top: earth[1] - 70, fontSize: 140 }}>🌍</div>
      <div style={{ position: 'absolute', left: earth[0] - 90, top: earth[1] + 74, fontSize: 28, fontWeight: 800, color: COLORS.sky, opacity: lab }}>
        Kernschatten
      </div>
      <Sfx sound="whoosh" at={12} volume={0.35} />
      <Sfx sound="impact" at={50} volume={0.35} />
      <Caption delay={54}>Der Mond schiebt sich vor die Sonne und wirft seinen Schatten auf die Erde.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Schatten" footer="undurchsichtiger Körper blockiert geradliniges Licht">
      Ein Schatten entsteht hinter einem
      <br />
      undurchsichtigen Körper –
      <br />
      immer der Lichtquelle gegenüber.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Schatten im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🌳" title="unter dem Baum" delay={10} />
        <TCard icon="⛱️" title="Sonnenschirm" delay={28} />
        <TCard icon="🕐" title="Sonnenuhr" delay={46} />
        <TCard icon="🖐️" title="Schattentheater" delay={64} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={80}>Überall, wo ein Körper das Licht blockiert, entsteht ein Schatten.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 240 },
  { id: 'zusammenhang', C: ZusammenhangScene, min: 260 },
  { id: 'variieren', C: VariierenScene, min: 240 },
  { id: 'finsternis', C: FinsternisScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SCHATTEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Schatten: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SCHATTEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/schatten/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
