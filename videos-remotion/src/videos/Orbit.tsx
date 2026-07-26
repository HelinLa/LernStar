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
import timings from '../narration/orbit.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Erdkugel ───────────────────────────────────────────────────────────
const Earth: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <div
    style={{
      position: 'absolute',
      left: cx - r,
      top: cy - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 38% 32%, #7dd3fc, #2563eb 62%, #1e3a8a)',
      boxShadow: '0 0 70px rgba(56,189,248,0.35)',
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'absolute', left: r * 0.5, top: r * 0.75, width: r * 0.6, height: r * 0.42, borderRadius: '50%', background: '#22c55e', opacity: 0.8 }} />
    <div style={{ position: 'absolute', left: r * 1.02, top: r * 0.3, width: r * 0.5, height: r * 0.34, borderRadius: '50%', background: '#16a34a', opacity: 0.75 }} />
    <div style={{ position: 'absolute', left: r * 0.2, top: r * 1.12, width: r * 0.42, height: r * 0.3, borderRadius: '50%', background: '#22c55e', opacity: 0.7 }} />
  </div>
);

// ── ISS / Satellit (Zentrum bei x,y) ───────────────────────────────────
const Iss: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${scale})` }}>
    <div style={{ position: 'absolute', left: -78, top: -15, width: 48, height: 30, background: '#1e3a8a', border: '2px solid #60a5fa' }} />
    <div style={{ position: 'absolute', left: 30, top: -15, width: 48, height: 30, background: '#1e3a8a', border: '2px solid #60a5fa' }} />
    <div style={{ position: 'absolute', left: -18, top: -13, width: 36, height: 26, borderRadius: 6, background: '#e2e8f0', border: '2px solid #94a3b8' }} />
  </div>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  const bob = Math.sin(frame / 18) * 10;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 96, transform: `translateY(${bob}px)`, marginBottom: 6 }}>🧑‍🚀</div>
      <StarLogo size={92} />
      <div style={{ marginTop: 34, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Die Raumstation
      </div>
      <div style={{ marginTop: 20, fontSize: 40, fontWeight: 600, color: COLORS.muted, maxWidth: 1300, textAlign: 'center', opacity: sub }}>
        Warum schweben Astronauten, obwohl sie ständig „fallen"?
      </div>
    </AbsoluteFill>
  );
};

// ── Fehlvorstellung: „Keine Schwerkraft im All?" ───────────────────────
const SchwerkraftScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cross = interpolate(frame, [Math.round(dur * 0.45), Math.round(dur * 0.6)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ex = 960;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Fehlvorstellung" title="Gibt es im All keine Schwerkraft?" />
      <Earth cx={960} cy={1180} r={520} />
      <Iss x={ex} y={430} scale={1.5} />
      {/* Mythos-Text mit Durchstreichung */}
      <div style={{ position: 'absolute', left: ex - 250, top: 250, width: 500, textAlign: 'center', fontSize: 34, fontWeight: 700, color: COLORS.muted }}>
        „keine Schwerkraft"
        <div style={{ position: 'absolute', left: 0, right: 0, top: 24, height: 5, background: COLORS.red, transform: `scaleX(${cross})`, transformOrigin: 'left' }} />
      </div>
      {/* Schwerkraftpfeil runter */}
      <div style={{ position: 'absolute', left: ex - 3, top: 470, width: 6, height: 150, background: COLORS.red, borderRadius: 3 }} />
      <div style={{ position: 'absolute', left: ex - 12, top: 616, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: `18px solid ${COLORS.red}` }} />
      <div style={{ position: 'absolute', left: ex + 26, top: 520, fontSize: 28, fontWeight: 700, color: COLORS.red, width: 320 }}>
        In 400 km Höhe:<br />g ≈ 8,7 m/s² (fast wie am Boden!)
      </div>
      <Caption>Die Erdanziehung wirkt oben fast genauso stark. Es liegt also nicht an „fehlender Schwerkraft".</Caption>
    </AbsoluteFill>
  );
};

// ── Newtons Kanonenkugel ───────────────────────────────────────────────
const KanoneScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cx = 960;
  const cy = 720;
  const r = 270;
  const R = 312; // Umlaufbahn-Radius
  // Kanonenkugel läuft die Umlaufbahn einmal ab (Start oben)
  const ang = -90 + (frame / dur) * 360;
  const rad = (ang * Math.PI) / 180;
  const bx = cx + R * Math.cos(rad);
  const by = cy + R * Math.sin(rad);
  const arcsOn = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const orbitOn = interpolate(frame, [Math.round(dur * 0.28), Math.round(dur * 0.42)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const top = cy - R;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Newtons Idee" title="Die Kanonenkugel, die nie landet" />
      <Earth cx={cx} cy={cy} r={r} />
      {/* Berg + Kanone oben */}
      <div style={{ position: 'absolute', left: cx - 26, top: top + 6, width: 0, height: 0, borderLeft: '26px solid transparent', borderRight: '26px solid transparent', borderBottom: `46px solid #475569` }} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Ghost-Bahnen */}
        <path d={`M ${cx} ${top} Q ${cx + 150} ${top + 30} ${cx + 178} ${cy - 205}`} stroke={COLORS.red} strokeWidth={4} strokeDasharray="10 8" fill="none" opacity={arcsOn} />
        <path d={`M ${cx} ${top} Q ${cx + 300} ${top + 60} ${cx + 268} ${cy - 30}`} stroke={COLORS.amber} strokeWidth={4} strokeDasharray="10 8" fill="none" opacity={arcsOn} />
        {/* Umlaufbahn */}
        <circle cx={cx} cy={cy} r={R} stroke={COLORS.green} strokeWidth={4} fill="none" opacity={orbitOn} />
      </svg>
      {/* Labels */}
      <div style={{ position: 'absolute', left: cx + 150, top: cy - 240, fontSize: 26, fontWeight: 700, color: COLORS.red, opacity: arcsOn }}>zu langsam → fällt</div>
      <div style={{ position: 'absolute', left: cx + 210, top: cy - 20, fontSize: 26, fontWeight: 700, color: COLORS.amber, opacity: arcsOn }}>schneller</div>
      <div style={{ position: 'absolute', left: cx - 360, top: top - 6, fontSize: 26, fontWeight: 800, color: COLORS.green, opacity: orbitOn }}>schnell genug → Umlaufbahn</div>
      {/* Kanonenkugel */}
      <div style={{ position: 'absolute', left: bx - 12, top: by - 12, width: 24, height: 24, borderRadius: '50%', background: '#f8fafc', boxShadow: '0 0 14px #fff', opacity: orbitOn }} />
      <Caption>Zu langsam fällt sie zu Boden. Schnell genug fällt sie immer weiter – und verfehlt die Erde: Umlaufbahn.</Caption>
    </AbsoluteFill>
  );
};

// ── Orbit: ISS im ständigen freien Fall ────────────────────────────────
const OrbitScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cx = 960;
  const cy = 500;
  const r = 190;
  const R = 285;
  const ang = -90 + (frame / dur) * 360;
  const rad = (ang * Math.PI) / 180;
  const ix = cx + R * Math.cos(rad);
  const iy = cy + R * Math.sin(rad);
  // Richtung zum Erdmittelpunkt (Schwerkraft) und tangential (Geschwindigkeit)
  const gx = cx - ix;
  const gy = cy - iy;
  const gl = Math.hypot(gx, gy);
  const gnx = gx / gl;
  const gny = gy / gl;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Umlaufbahn" title="Ständiger freier Fall um die Erde" />
      <Earth cx={cx} cy={cy} r={r} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <circle cx={cx} cy={cy} r={R} stroke={COLORS.border} strokeWidth={3} strokeDasharray="8 10" fill="none" />
        {/* Schwerkraftpfeil zum Zentrum (rot) */}
        <line x1={ix} y1={iy} x2={ix + gnx * 90} y2={iy + gny * 90} stroke={COLORS.red} strokeWidth={6} />
        {/* Geschwindigkeitspfeil tangential (grün) */}
        <line x1={ix} y1={iy} x2={ix - gny * 90} y2={iy + gnx * 90} stroke={COLORS.green} strokeWidth={6} />
      </svg>
      <Iss x={ix} y={iy} scale={1.3} />
      <div style={{ position: 'absolute', left: 90, top: 300, fontSize: 30, fontWeight: 700, color: COLORS.red }}>rot: Schwerkraft (zieht zur Erde)</div>
      <div style={{ position: 'absolute', left: 90, top: 348, fontSize: 30, fontWeight: 700, color: COLORS.green }}>grün: Bahngeschwindigkeit (seitwärts)</div>
      <Caption color={COLORS.sky}>Sie fällt ständig zur Erde – fliegt aber so schnell seitwärts, dass sie vorbeifällt. Alles schwebt.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Umlaufbahn" footer="freier Fall + genug Bahngeschwindigkeit">
      Eine Umlaufbahn ist ein ständiger freier Fall
      <br />
      um die Erde. Die Schwerkraft wirkt weiter –
      <br />
      weil alles gemeinsam fällt, herrscht Schwerelosigkeit.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const InfoCard: React.FC<{ icon: string; title: string; text: string; delay: number }> = ({ icon, title, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 480, padding: '34px 30px', borderRadius: 24, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
      <div style={{ fontSize: 74, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 38, fontWeight: 800, marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 30, fontWeight: 500, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Überall im All" title="Das Gleiche gilt für …" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 50 }}>
        <InfoCard icon="🛰️" title="Satelliten" text="fallen ständig um die Erde – und bleiben oben" delay={12} />
        <InfoCard icon="🌙" title="Der Mond" text="fällt seit Milliarden Jahren um die Erde" delay={40} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={12} volume={0.45} />
    <Sfx sound="pop" at={40} volume={0.45} />
    <Caption delay={62}>Satelliten und sogar der Mond sind im selben ständigen freien Fall.</Caption>
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
  { id: 'schwerkraft', C: SchwerkraftScene, min: 220 },
  { id: 'kanone', C: KanoneScene, min: 240 },
  { id: 'orbit', C: OrbitScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 200 },
  { id: 'transfer', C: TransferScene, min: 170 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ORBIT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Orbit: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ORBIT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/orbit/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
