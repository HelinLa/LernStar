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
import timings from '../narration/kern-halbschatten.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const BALL_X = 900;
const BALL_Y = 540;
const R = 72;
const SCREEN_X = 1520;

const ShadowCone: React.FC<{ pts: [number, number][]; opacity?: number; color?: string }> = ({ pts, opacity = 0.5, color = '#020617' }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={color} opacity={opacity} />
  </svg>
);

const projectY = (L: [number, number], edgeY: number) =>
  L[1] + (edgeY - L[1]) * ((SCREEN_X - L[0]) / (BALL_X - L[0]));

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 80, marginBottom: 40 }}>
        <div style={{ width: 150, height: 150, borderRadius: 16, background: '#020617', boxShadow: '0 0 0 4px #334155' }} />
        <div style={{ width: 150, height: 150, borderRadius: 16, background: 'radial-gradient(circle,#020617 40%,#475569 100%)', filter: 'blur(3px)' }} />
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Kern- und Halbschatten
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Scharfe Kante oder weicher Rand – warum?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: Punktlampe (scharf) → große Lampe (weich) ──────────────
const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const big = frame > dur * 0.5;
  const top = BALL_Y - R;
  const bot = BALL_Y + R;
  if (!big) {
    const L: [number, number] = [250, BALL_Y];
    const sTop = projectY(L, top);
    const sBot = projectY(L, bot);
    return (
      <AbsoluteFill>
        <SceneTitle kicker="Beobachten" title="Kleine Lampe → scharfer Schatten" />
        <LightSource x={L[0]} y={L[1]} r={34} emoji="•" label="Punktlampe" />
        <ShadowCone pts={[[BALL_X, top], [SCREEN_X, sTop], [SCREEN_X, sBot], [BALL_X, bot]]} opacity={0.5} />
        <ShadowPatch x={SCREEN_X + 11} yTop={sTop} yBot={sBot} w={26} opacity={0.92} />
        <Screen x={SCREEN_X} yTop={160} yBot={980} label="Wand" />
        <div style={{ position: 'absolute', left: BALL_X - R, top: BALL_Y - R, fontSize: R * 2 }}>⚽</div>
        <div style={{ position: 'absolute', left: SCREEN_X + 44, top: (sTop + sBot) / 2 - 20, fontSize: 28, fontWeight: 800, color: COLORS.sky }}>scharfe Kante</div>
        <Caption>Eine punktförmige Lampe wirft einen Schatten mit klarer Grenze.</Caption>
      </AbsoluteFill>
    );
  }
  // große Lampe: Kernschatten + Halbschatten
  const Ltop: [number, number] = [250, BALL_Y - 90];
  const Lbot: [number, number] = [250, BALL_Y + 90];
  const kTop = projectY(Lbot, top); // Kernschatten enger
  const kBot = projectY(Ltop, bot);
  const hTop = projectY(Ltop, top); // Halbschatten weiter
  const hBot = projectY(Lbot, bot);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Große Lampe → weicher Rand" />
      <div style={{ position: 'absolute', left: 200, top: BALL_Y - 130, width: 90, height: 260, borderRadius: 45, background: 'radial-gradient(circle,#fff,#fbbf24)', boxShadow: '0 0 60px #fbbf24' }} />
      <div style={{ position: 'absolute', left: 200, top: BALL_Y + 140, fontSize: 26, fontWeight: 700, color: COLORS.muted }}>große Lampe</div>
      <ShadowCone pts={[[BALL_X, top], [SCREEN_X, hTop], [SCREEN_X, hBot], [BALL_X, bot]]} opacity={0.3} />
      <ShadowCone pts={[[BALL_X, top], [SCREEN_X, kTop], [SCREEN_X, kBot], [BALL_X, bot]]} opacity={0.55} />
      <Screen x={SCREEN_X} yTop={160} yBot={980} label="Wand" />
      <div style={{ position: 'absolute', left: BALL_X - R, top: BALL_Y - R, fontSize: R * 2 }}>⚽</div>
      <div style={{ position: 'absolute', left: SCREEN_X + 44, top: (kTop + kBot) / 2 - 40, fontSize: 26, fontWeight: 800, color: COLORS.red }}>Kernschatten</div>
      <div style={{ position: 'absolute', left: SCREEN_X + 44, top: hBot - 30, fontSize: 26, fontWeight: 800, color: COLORS.sky }}>Halbschatten</div>
      <Sfx sound="pop" at={Math.round(dur * 0.5) + 2} volume={0.36} />
      <Caption delay={Math.round(dur * 0.5) + 8}>Jetzt hat der Schatten außen einen weichen grauen Saum.</Caption>
    </AbsoluteFill>
  );
};

// ── Zusammenhang: viele Leuchtpunkte → Kern + Halbschatten ─────────────
const ZusammenhangScene: React.FC<SceneProps> = () => {
  const top = BALL_Y - R;
  const bot = BALL_Y + R;
  const Ltop: [number, number] = [250, BALL_Y - 90];
  const Lbot: [number, number] = [250, BALL_Y + 90];
  const kTop = projectY(Lbot, top);
  const kBot = projectY(Ltop, bot);
  const hTop = projectY(Ltop, top);
  const hBot = projectY(Lbot, bot);
  const p = useFade(20);
  const lab = useFade(60);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum?" title="Viele Leuchtpunkte" />
      {/* drei Leuchtpunkte oben/mitte/unten */}
      {[Ltop, [250, BALL_Y] as [number, number], Lbot].map((L, i) => (
        <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: L[0] - 14, top: L[1] - 14, width: 28, height: 28, borderRadius: '50%', background: '#fff', boxShadow: '0 0 24px #fbbf24' }} />
          <Ray x1={L[0]} y1={L[1]} x2={SCREEN_X} y2={projectY(L, top)} progress={p} color={COLORS.amber} width={2} opacity={0.4} />
          <Ray x1={L[0]} y1={L[1]} x2={SCREEN_X} y2={projectY(L, bot)} progress={p} color={COLORS.amber} width={2} opacity={0.4} />
        </React.Fragment>
      ))}
      <ShadowCone pts={[[BALL_X, top], [SCREEN_X, hTop], [SCREEN_X, hBot], [BALL_X, bot]]} opacity={0.3} />
      <ShadowCone pts={[[BALL_X, top], [SCREEN_X, kTop], [SCREEN_X, kBot], [BALL_X, bot]]} opacity={0.55} />
      <Screen x={SCREEN_X} yTop={160} yBot={980} />
      <div style={{ position: 'absolute', left: BALL_X - R, top: BALL_Y - R, fontSize: R * 2 }}>⚽</div>
      <div style={{ position: 'absolute', left: 1000, top: 250, fontSize: 26, fontWeight: 800, color: COLORS.red, opacity: lab }}>Kernschatten: kein Punkt erreicht ihn</div>
      <div style={{ position: 'absolute', left: 1000, top: 820, fontSize: 26, fontWeight: 800, color: COLORS.sky, opacity: lab }}>Halbschatten: nur ein Teil erreicht ihn</div>
      <Caption delay={70}>Kernschatten heißt: gar kein Licht. Halbschatten: Licht von einigen Punkten.</Caption>
    </AbsoluteFill>
  );
};

// ── Variieren: zwei Lampen → zwei Schatten, Überlappung dunkel ─────────
const VariierenScene: React.FC<SceneProps> = () => {
  const top = BALL_Y - R;
  const bot = BALL_Y + R;
  const L1: [number, number] = [250, 340];
  const L2: [number, number] = [250, 740];
  const p = useFade(16);
  const s1Top = projectY(L1, top);
  const s1Bot = projectY(L1, bot);
  const s2Top = projectY(L2, top);
  const s2Bot = projectY(L2, bot);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ausprobieren" title="Zwei Lampen, zwei Schatten" />
      <LightSource x={L1[0]} y={L1[1]} r={40} emoji="💡" label="Lampe 1" />
      <LightSource x={L2[0]} y={L2[1]} r={40} emoji="💡" label="Lampe 2" />
      <Ray x1={L1[0] + 20} y1={L1[1]} x2={SCREEN_X} y2={s1Top} progress={p} color={COLORS.amber} width={3} opacity={0.4} />
      <Ray x1={L2[0] + 20} y1={L2[1]} x2={SCREEN_X} y2={s2Bot} progress={p} color={COLORS.amber} width={3} opacity={0.4} />
      {/* Schatten 1 + Schatten 2 (halbdunkel) + Überlappung (voll dunkel) */}
      <ShadowCone pts={[[BALL_X, top], [SCREEN_X, s1Top], [SCREEN_X, s1Bot], [BALL_X, bot]]} opacity={0.3} />
      <ShadowCone pts={[[BALL_X, top], [SCREEN_X, s2Top], [SCREEN_X, s2Bot], [BALL_X, bot]]} opacity={0.3} />
      <ShadowPatch x={SCREEN_X + 11} yTop={Math.max(s1Top, s2Top)} yBot={Math.min(s1Bot, s2Bot)} w={26} opacity={0.92} />
      <Screen x={SCREEN_X} yTop={160} yBot={980} />
      <div style={{ position: 'absolute', left: BALL_X - R, top: BALL_Y - R, fontSize: R * 2 }}>⚽</div>
      <div style={{ position: 'absolute', left: SCREEN_X + 44, top: (Math.max(s1Top, s2Top) + Math.min(s1Bot, s2Bot)) / 2 - 20, fontSize: 26, fontWeight: 800, color: COLORS.red }}>Überlappung = dunkelster Fleck</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={60}>Wo sich beide Schatten überlappen, blockieren beide Lampen – dort ist es am dunkelsten.</Caption>
    </AbsoluteFill>
  );
};

// ── Beispiel: Mondfinsternis ───────────────────────────────────────────
const BeispielScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sun: [number, number] = [230, 400];
  const earth: [number, number] = [820, 500];
  const moon: [number, number] = [1500, 560];
  const lab = useFade(60);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="Mondfinsternis" />
      <LightSource x={sun[0]} y={sun[1]} r={78} emoji="☀️" label="Sonne" />
      <Ray x1={sun[0] + 40} y1={sun[1]} x2={earth[0]} y2={earth[1] - 70} progress={p} color={COLORS.amber} width={4} opacity={0.5} />
      <Ray x1={sun[0] + 40} y1={sun[1]} x2={earth[0]} y2={earth[1] + 70} progress={p} color={COLORS.amber} width={4} opacity={0.5} />
      <div style={{ position: 'absolute', left: earth[0] - 70, top: earth[1] - 70, fontSize: 140 }}>🌍</div>
      {p > 0.9 ? (
        <ShadowCone pts={[[earth[0] + 30, earth[1] - 60], [moon[0], moon[1] - 40], [moon[0], moon[1] + 40], [earth[0] + 30, earth[1] + 60]]} opacity={0.55} />
      ) : null}
      <div style={{ position: 'absolute', left: moon[0] - 46, top: moon[1] - 46, fontSize: 92, filter: p > 0.9 ? 'sepia(1) saturate(4) hue-rotate(-20deg) brightness(0.8)' : 'none' }}>🌕</div>
      <div style={{ position: 'absolute', left: moon[0] - 80, top: moon[1] + 60, fontSize: 26, fontWeight: 800, color: COLORS.red, opacity: lab }}>im Kernschatten: kupferrot</div>
      <Sfx sound="whoosh" at={12} volume={0.35} />
      <Caption delay={54}>Die Erde wirft ihren Schatten auf den Mond – im Kernschatten wird er rot.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kern & Halbschatten" footer="ausgedehnte Lichtquelle erzeugt beide">
      Kernschatten: gar kein Licht – tiefschwarz.
      <br />
      Halbschatten: Licht von einem Teil
      <br />
      der Quelle – nur halb dunkel.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 29, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="☀️" title="Sonne: scharf innen, weich am Rand" delay={10} />
        <TCard icon="🏟️" title="Flutlicht: mehrere Schatten" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Große Lichtquellen erzeugen weiche Ränder und mehrfache Schatten.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 300 },
  { id: 'zusammenhang', C: ZusammenhangScene, min: 260 },
  { id: 'variieren', C: VariierenScene, min: 260 },
  { id: 'beispiel', C: BeispielScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KERN_HALBSCHATTEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const KernHalbschatten: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KERN_HALBSCHATTEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kern-halbschatten/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
