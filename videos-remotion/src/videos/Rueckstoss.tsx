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
import { Bg, SceneTitle, Caption, Arrow, MerksatzBox, StarLogo, BackgroundMusic, Sfx } from '../components';
import timings from '../narration/rueckstoss.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// deterministische Sterne (kein Math.random → stabil über alle Frames)
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 137.508) % 1920,
  y: (i * 263.1) % 1080,
  r: 1 + (i % 3) * 0.7,
}));
const Stars: React.FC = () => (
  <>
    {STARS.map((s, i) => (
      <div key={i} style={{ position: 'absolute', left: s.x, top: s.y, width: s.r * 2, height: s.r * 2, borderRadius: '50%', background: '#fff', opacity: 0.5 }} />
    ))}
  </>
);

// ── Luftballon (fliegt nach rechts, Öffnung links) ─────────────────────
const Balloon: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${scale})`, transformOrigin: 'left center' }}>
    <div style={{ position: 'absolute', left: 0, top: -55, width: 150, height: 110, borderRadius: '46% 60% 60% 46%', background: 'radial-gradient(circle at 68% 34%, #fca5a5, #ef4444)' }} />
    <div style={{ position: 'absolute', left: -22, top: -12, width: 28, height: 26, background: '#dc2626', borderRadius: '8px 0 0 8px' }} />
  </div>
);

// ── Rakete (zeigt nach oben, Zentrum bei x,y) ──────────────────────────
const Rocket: React.FC<{ x: number; y: number; scale?: number; flame?: number }> = ({ x, y, scale = 1, flame = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${scale})` }}>
    {/* Flamme */}
    {flame > 0 ? (
      <div style={{ position: 'absolute', left: -18, top: 52, width: 36, height: 60 + flame * 40, borderRadius: '0 0 50% 50%', background: 'linear-gradient(180deg,#fbbf24,#ef4444,transparent)', filter: 'blur(1px)' }} />
    ) : null}
    {/* Körper */}
    <div style={{ position: 'absolute', left: -30, top: -70, width: 60, height: 122, borderRadius: '30px 30px 12px 12px', background: 'linear-gradient(180deg,#f8fafc,#94a3b8)', border: '2px solid #cbd5e1' }} />
    {/* Fenster */}
    <div style={{ position: 'absolute', left: -15, top: -40, width: 30, height: 30, borderRadius: '50%', background: '#38bdf8', border: '3px solid #64748b' }} />
    {/* Flossen */}
    <div style={{ position: 'absolute', left: -48, top: 18, width: 24, height: 44, background: '#ef4444', clipPath: 'polygon(100% 0,100% 100%,0 100%)' }} />
    <div style={{ position: 'absolute', left: 24, top: 18, width: 24, height: 44, background: '#ef4444', clipPath: 'polygon(0 0,0 100%,100% 100%)' }} />
  </div>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  const lift = interpolate(frame, [0, 120], [0, -30], { extrapolateRight: 'extend' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `translateY(${lift}px)` }}>
        <Rocket x={0} y={0} scale={1.1} flame={0.6 + Math.sin(frame / 4) * 0.25} />
      </div>
      <div style={{ marginTop: 150 }} />
      <StarLogo size={92} />
      <div style={{ marginTop: 30, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Die Rakete
      </div>
      <div style={{ marginTop: 18, fontSize: 40, fontWeight: 600, color: COLORS.muted, maxWidth: 1300, textAlign: 'center', opacity: sub }}>
        Wie stößt sie sich im Weltall ab, wo doch nichts da ist?
      </div>
    </AbsoluteFill>
  );
};

// ── Luftballon zischt davon ────────────────────────────────────────────
const BallonScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const startX = 300;
  const x = interpolate(frame, [Math.round(dur * 0.16), dur], [startX, 1500], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
  const flying = frame >= Math.round(dur * 0.16);
  const cy = 540;
  // Luft-Puffs strömen nach links aus der Öffnung
  const puffs = [0, 1, 2, 3, 4].map((k) => {
    const p = ((frame - Math.round(dur * 0.16)) * 0.06 + k * 0.2) % 1;
    return { off: p * 160, op: flying ? 1 - p : 0, size: 8 + p * 18 };
  });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Der Luftballon zischt davon" />
      <Balloon x={x} y={cy} />
      {flying
        ? puffs.map((pf, i) => (
            <div key={i} style={{ position: 'absolute', left: x - 30 - pf.off, top: cy - pf.size / 2, width: pf.size, height: pf.size, borderRadius: '50%', background: '#93c5fd', opacity: pf.op * 0.7 }} />
          ))
        : null}
      <Arrow x1={x - 40} y1={cy} x2={x - 220} y2={cy} color={COLORS.sky} opacity={flying ? 1 : 0} />
      <Arrow x1={x + 120} y1={cy} x2={x + 300} y2={cy} color={COLORS.green} opacity={flying ? 1 : 0} />
      <div style={{ position: 'absolute', left: x - 250, top: cy - 60, fontSize: 26, fontWeight: 700, color: COLORS.sky, opacity: flying ? 1 : 0 }}>Luft nach hinten</div>
      <div style={{ position: 'absolute', left: x + 150, top: cy - 60, fontSize: 26, fontWeight: 700, color: COLORS.green, opacity: flying ? 1 : 0 }}>Ballon nach vorn</div>
      <Caption>Die Luft strömt nach hinten aus – und der Ballon fliegt nach vorn.</Caption>
    </AbsoluteFill>
  );
};

// ── actio = reactio ────────────────────────────────────────────────────
const ActioScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cx = 960;
  const cy = 500;
  const a1 = interpolate(frame, [Math.round(dur * 0.15), Math.round(dur * 0.3)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a2 = interpolate(frame, [Math.round(dur * 0.38), Math.round(dur * 0.53)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Grundgesetz" title="actio = reactio" />
      <Balloon x={cx - 70} y={cy} scale={1.1} />
      {/* actio: drückt Luft nach hinten (links, rot) */}
      <Arrow x1={cx - 110} y1={cy} x2={cx - 360} y2={cy} color={COLORS.red} opacity={a1} width={12} />
      {/* reactio: drückt Ballon nach vorn (rechts, grün) */}
      <Arrow x1={cx + 130} y1={cy} x2={cx + 380} y2={cy} color={COLORS.green} opacity={a2} width={12} />
      <div style={{ position: 'absolute', left: cx - 360, top: cy - 66, fontSize: 32, fontWeight: 800, color: COLORS.red, opacity: a1 }}>actio</div>
      <div style={{ position: 'absolute', left: cx + 200, top: cy - 66, fontSize: 32, fontWeight: 800, color: COLORS.green, opacity: a2 }}>reactio</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: cy + 150, textAlign: 'center', fontSize: 30, fontWeight: 700, color: COLORS.amber, opacity: a2 }}>
        gleich groß · entgegengesetzt · keine Luft zum Abstoßen nötig
      </div>
      <Caption>Zu jeder Kraft gehört eine gleich große Gegenkraft in die andere Richtung.</Caption>
    </AbsoluteFill>
  );
};

// ── Rakete im Weltall ──────────────────────────────────────────────────
const RaketeScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cx = 960;
  const launch = Math.round(dur * 0.18);
  const y = interpolate(frame, [launch, dur], [720, 300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
  const on = frame >= launch;
  const flame = on ? 0.6 + Math.sin(frame / 3) * 0.3 : 0;
  return (
    <AbsoluteFill>
      <Stars />
      <SceneTitle kicker="Im Weltall" title="Die Rakete stößt sich selbst ab" />
      <Rocket x={cx} y={y} scale={1.2} flame={flame} />
      {/* Gase nach unten (rot) */}
      <Arrow x1={cx} y1={y + 150} x2={cx} y2={y + 320} color={COLORS.red} opacity={on ? 1 : 0} width={11} />
      {/* Schub nach oben (grün) */}
      <Arrow x1={cx - 260} y1={y} x2={cx - 260} y2={y - 170} color={COLORS.green} opacity={on ? 1 : 0} width={11} />
      <div style={{ position: 'absolute', left: cx + 40, top: y + 210, fontSize: 26, fontWeight: 700, color: COLORS.red, opacity: on ? 1 : 0 }}>Gase nach unten</div>
      <div style={{ position: 'absolute', left: cx - 250, top: y - 150, fontSize: 26, fontWeight: 700, color: COLORS.green, opacity: on ? 1 : 0 }}>Schub nach oben</div>
      <Caption color={COLORS.sky}>Sie stößt Gase nach unten – die Gase stoßen die Rakete nach oben. Ganz ohne Luft.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Rückstoßprinzip" footer="3. Newton'sches Gesetz (actio = reactio)">
      Stößt ein Körper Masse in eine Richtung aus,
      <br />
      wird er selbst in die Gegenrichtung getrieben.
      <br />
      Mehr ausgestoßene Masse → mehr Schub.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const InfoCard: React.FC<{ icon: string; title: string; text: string; delay: number }> = ({ icon, title, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 430, padding: '32px 26px', borderRadius: 24, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
      <div style={{ fontSize: 70, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 500, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Überall Rückstoß" title="Das Gleiche steckt in …" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <InfoCard icon="🎆" title="Silvesterrakete" text="stößt heiße Gase nach unten aus" delay={10} />
        <InfoCard icon="✈️" title="Düsentriebwerk" text="stößt Luft nach hinten – Schub nach vorn" delay={32} />
        <InfoCard icon="🦑" title="Tintenfisch" text="stößt Wasser aus und schießt davon" delay={54} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.45} />
    <Sfx sound="pop" at={32} volume={0.45} />
    <Sfx sound="pop" at={54} volume={0.45} />
    <Caption delay={68}>Silvesterrakete, Düsentriebwerk, Tintenfisch – überall wirkt der Rückstoß.</Caption>
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
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: COLORS.muted, opacity: s }}>Physik verstehen – Schritt für Schritt.</div>
    </AbsoluteFill>
  );
};

const SCENES: { id: string; C: React.FC<SceneProps>; min: number }[] = [
  { id: 'intro', C: Intro, min: 120 },
  { id: 'ballon', C: BallonScene, min: 210 },
  { id: 'actio', C: ActioScene, min: 220 },
  { id: 'rakete', C: RaketeScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 200 },
  { id: 'transfer', C: TransferScene, min: 170 },
  { id: 'outro', C: Outro, min: 110 },
];

export const RUECKSTOSS_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Rueckstoss: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={RUECKSTOSS_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/rueckstoss/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
