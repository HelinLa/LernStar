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
  Easing,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, StarLogo, BackgroundMusic, Sfx } from '../components';
import timings from '../narration/magnet-problem.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 22;
const durOf = (id: string, min: number) =>
  Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const easeIO = Easing.bezier(0.4, 0, 0.2, 1);

// ── Schrottplatz-Bühne (Kran + Magnet + Objekte) ───────────────────────
const Scrapyard: React.FC<{ lift: number; glow: number; showNo: boolean; arrows: boolean }> = ({
  lift,
  glow,
  showNo,
  arrows,
}) => {
  const frame = useCurrentFrame();
  const mx = 720;
  const my = 360 + Math.sin(frame / 26) * 6; // sanftes Wippen
  const groundY = 830;
  const ironCarY = interpolate(lift, [0, 1], [groundY, 500]);
  const ironBoltY = interpolate(lift, [0, 1], [groundY + 6, 496]);
  const wob = showNo ? Math.sin(frame / 5) * 4 : 0;
  return (
    <>
      {/* Boden */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: groundY + 70, height: 220, background: COLORS.ground, opacity: 0.55 }} />
      {/* Kran-Ausleger */}
      <div style={{ position: 'absolute', left: 150, right: 560, top: 118, height: 26, borderRadius: 8, background: COLORS.amber, boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', left: 150, top: 100, width: 30, height: 62, background: '#b45309', borderRadius: 4 }} />
      {/* Kabel */}
      <div style={{ position: 'absolute', left: mx - 3, top: 144, width: 6, height: my - 144 - 44, background: '#94a3b8' }} />
      {/* Glow unter dem Magneten */}
      <div style={{ position: 'absolute', left: mx, top: my + 46, width: 300, height: 74, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: COLORS.sky, opacity: glow * 0.5, filter: 'blur(20px)' }} />
      {/* Elektromagnet */}
      <div style={{ position: 'absolute', left: mx, top: my, transform: 'translate(-50%,-50%)', width: 250, height: 92, borderRadius: 16, background: 'linear-gradient(#475569,#334155)', border: '4px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}>⚡</div>
      {/* Anziehungspfeile */}
      {arrows && (
        <svg style={{ position: 'absolute', inset: 0 }} width="1920" height="1080" viewBox="0 0 1920 1080">
          <g stroke={COLORS.green} strokeWidth="6" strokeDasharray="12 10" strokeLinecap="round" fill="none" opacity="0.9">
            <path d={`M${mx - 60},${ironBoltY - 60} L ${mx - 50},${my + 70}`} />
            <path d={`M${mx + 40},${ironCarY - 80} L ${mx + 30},${my + 70}`} />
          </g>
        </svg>
      )}
      {/* Eisen / Stahl (magnetisch) */}
      <div style={{ position: 'absolute', left: mx - 60, top: ironBoltY, transform: 'translate(-50%,-50%)', fontSize: 96 }}>🔩</div>
      <div style={{ position: 'absolute', left: mx + 30, top: ironCarY, transform: 'translate(-50%,-50%)', fontSize: 138 }}>🚗</div>
      {/* nicht magnetisch (bleiben liegen) */}
      <div style={{ position: 'absolute', left: 1300 + wob, top: groundY, transform: 'translate(-50%,-50%)', fontSize: 116 }}>🥫</div>
      <div style={{ position: 'absolute', left: 1490 - wob, top: groundY + 4, transform: 'translate(-50%,-50%)', fontSize: 92 }}>🧵</div>
      {showNo && (
        <div style={{ position: 'absolute', left: 1395, top: groundY - 150, transform: 'translate(-50%,-50%)', fontSize: 84 }}>🚫</div>
      )}
    </>
  );
};

// ── Szene 1: Kran fährt heran ──────────────────────────────────────────
const KranScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [24, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ein Problem aus dem Alltag" title="Auf dem Schrottplatz" />
      <Scrapyard lift={0} glow={glow} showNo={false} arrows={false} />
      <Caption>Ein Kran mit einem starken Magneten fährt über den Schrottplatz.</Caption>
    </AbsoluteFill>
  );
};

// ── Szene 2: Eisen & Stahl werden gehoben ──────────────────────────────
const HebenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const lift = interpolate(frame, [12, dur - 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeIO });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachtung" title="Eisen und Stahl fliegen hoch" />
      <Scrapyard lift={lift} glow={1} showNo={false} arrows={lift > 0.05} />
      <Sfx sound="impact" at={0.9} volume={0.3} />
      <Caption>Eisen und Stahl werden nach oben gezogen.</Caption>
    </AbsoluteFill>
  );
};

// ── Szene 3: Alu & Kupfer bleiben liegen ───────────────────────────────
const BleibenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Beobachtung" title="Aber Alu und Kupfer bleiben liegen" />
    <Scrapyard lift={1} glow={1} showNo arrows={false} />
    <Sfx sound="pop" at={1.0} volume={0.3} />
    <Caption>Alu-Dose und Kupferkabel bleiben liegen – die zieht der Magnet nicht an.</Caption>
  </AbsoluteFill>
);

// ── Szene 4: Alltag – Kühlschrank vs. Cola-Dose ────────────────────────
const AlltagScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const b = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  const Panel: React.FC<{ x: number; s: number; emoji: string; sub: string; ok: boolean }> = ({ x, s, emoji, sub, ok }) => (
    <div style={{ position: 'absolute', left: x, top: 320, width: 620, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`, opacity: s, textAlign: 'center' }}>
      <div style={{ fontSize: 180 }}>{emoji}</div>
      <div style={{ marginTop: 6, fontSize: 90 }}>🧲</div>
      <div style={{ marginTop: 10, fontSize: 42, fontWeight: 800, color: ok ? COLORS.green : COLORS.red }}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Auch zu Hause" title="Kühlschrank oder Cola-Dose?" />
      <Panel x={200} s={a} emoji="🧊" sub="hält ✅" ok />
      <Panel x={1100} s={b} emoji="🥤" sub="rutscht ab ✖️" ok={false} />
      <Caption>Am Kühlschrank aus Stahl hält der Magnet – an der Alu-Dose nicht.</Caption>
    </AbsoluteFill>
  );
};

// ── Szene 5: Forscherfrage ─────────────────────────────────────────────
const FrageScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const q = spring({ frame: frame - 34, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, opacity: t, transform: `scale(${interpolate(t, [0, 1], [0.6, 1])})` }}>🔍</div>
      <div style={{ marginTop: 14, fontSize: 40, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.indigo, opacity: t }}>
        Unsere Forscherfrage
      </div>
      <div style={{ marginTop: 18, maxWidth: 1500, textAlign: 'center', fontSize: 78, fontWeight: 900, lineHeight: 1.15, opacity: q, transform: `translateY(${interpolate(q, [0, 1], [40, 0])}px)` }}>
        Welche Stoffe zieht ein Magnet an – und welche nicht?
      </div>
      <div style={{ marginTop: 40, opacity: q }}>
        <StarLogo size={90} />
      </div>
    </AbsoluteFill>
  );
};

const SCENES: { id: string; C: React.FC<SceneProps>; min: number }[] = [
  { id: 'kran', C: KranScene, min: 120 },
  { id: 'heben', C: HebenScene, min: 150 },
  { id: 'bleiben', C: BleibenScene, min: 150 },
  { id: 'alltag', C: AlltagScene, min: 170 },
  { id: 'frage', C: FrageScene, min: 160 },
];

export const MAGNET_PROBLEM_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const MagnetProblem: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNET_PROBLEM_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/magnet-problem/${s.id}.wav`)} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
