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
import timings from '../narration/gravitation.timings.json';

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
  const y = ((frame * 4) % 300);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, marginBottom: 10, transform: `translateY(${y * 0.4}px)` }}>🍎</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum fällt alles nach unten?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Die Gravitation – die Kraft, die das Weltall zusammenhält.
      </div>
    </AbsoluteFill>
  );
};

const AnziehungScene: React.FC<SceneProps> = () => {
  const f = useFade(20);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Grundregel" title="Jede Masse zieht jede an" />
      <div style={{ display: 'flex', gap: 200, alignItems: 'center' }}>
        <div style={{ fontSize: 120 }}>🪨</div>
        <div style={{ fontSize: 60, color: COLORS.amber, opacity: f }}>⟵ ⟶</div>
        <div style={{ fontSize: 180 }}>🌍</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>auch der Stein zieht die Erde – nur unmerklich schwach</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Jede Masse zieht jede andere an – bei kleinen Massen unmerklich schwach.</Caption>
    </AbsoluteFill>
  );
};

const MasseScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Was zählt?" title="Mehr Masse → mehr Anziehung" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end', opacity: f }}>
        {[['🌑', 'Mond', 60], ['🌍', 'Erde', 150], ['🪐', 'Jupiter', 260]].map((c, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: c[2] as number }}>{c[0]}</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Je größer die Masse, desto stärker die Anziehung – die Erde zieht kräftig.</Caption>
    </AbsoluteFill>
  );
};

const PlanetenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // gleicher Stein fällt: Mond langsam, Erde mittel, Jupiter schnell
  const t = (frame % 90) / 90;
  const fall = (g: number) => Math.min(280, 0.5 * g * (t * t) * 900);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleich" title="Derselbe Stein, 3 Welten" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', top: 240 }}>
        <div style={{ display: 'flex', gap: 120 }}>
          {[['🌑 Mond', 1.6, COLORS.sky], ['🌍 Erde', 9.8, COLORS.green], ['🪐 Jupiter', 24, COLORS.red]].map((c, i) => (
            <div key={i} style={{ textAlign: 'center', width: 260, position: 'relative', height: 360 }}>
              <div style={{ position: 'absolute', left: '50%', top: fall(c[1] as number), transform: 'translateX(-50%)', fontSize: 60 }}>🪨</div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 6, background: COLORS.muted }} />
              <div style={{ position: 'absolute', bottom: -40, left: 0, width: '100%', fontSize: 26, fontWeight: 800, color: c[2] as string }}>{c[0]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="impact" at={30} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Auf dem Jupiter fällt der Stein am schnellsten – dort ist die Gravitation am stärksten.</Caption>
    </AbsoluteFill>
  );
};

const OrbitScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ang = frame * 3;
  const cx = 960, cy = 560, R = 300;
  const mx = cx + Math.cos((ang * Math.PI) / 180) * R;
  const my = cy + Math.sin((ang * Math.PI) / 180) * R;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Und der Mond?" title="Ewiges Fallen = Umlaufbahn" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <ellipse cx={cx} cy={cy} rx={R} ry={R} fill="none" stroke={COLORS.border} strokeWidth={3} strokeDasharray="10 12" />
        <line x1={mx} y1={my} x2={cx} y2={cy} stroke={COLORS.red} strokeWidth={3} opacity={0.6} />
      </svg>
      <div style={{ position: 'absolute', left: cx - 70, top: cy - 70, fontSize: 140 }}>🌍</div>
      <div style={{ position: 'absolute', left: mx - 34, top: my - 34, fontSize: 68 }}>🌑</div>
      <div style={{ position: 'absolute', left: 300, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.red }}>Anziehung zum Zentrum</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Der Mond fällt ständig zur Erde – und verfehlt sie immer wieder. Das ist seine Bahn.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Gravitation" footer="hält Planeten auf ihren Bahnen">
      Jede Masse zieht jede andere an.
      <br />
      Je größer die Masse, desto stärker
      <br />
      die Anziehung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Kitt des Kosmos" />
      <div style={{ fontSize: 150, opacity: f }}>🌍🌙 · ☀️🪐 · 🌌</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Mond bei der Erde, Erde bei der Sonne, Sterne in der Galaxie.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Die Gravitation hält das ganze Weltall zusammen.</Caption>
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
  { id: 'anziehung', C: AnziehungScene, min: 240 },
  { id: 'masse', C: MasseScene, min: 220 },
  { id: 'planeten', C: PlanetenScene, min: 260 },
  { id: 'orbit', C: OrbitScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const GRAVITATION_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Gravitation: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={GRAVITATION_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/gravitation/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
