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
import { useFade } from '../forces';
import timings from '../narration/energiespeicher.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Pumpspeicher: oberer See + unterer See + Rohr. mode 'pump' (laden) oder 'gen' (entladen)
const PumpStorage: React.FC<{ mode: 'pump' | 'gen'; upper: number }> = ({ mode, upper }) => {
  const frame = useCurrentFrame();
  const flow = (frame % 30) / 30;
  return (
    <svg width={900} height={620} viewBox="0 0 900 620" style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* Berg */}
      <polygon points="60,560 450,120 840,560" fill="#22304a" />
      {/* oberer See */}
      <rect x={330} y={150} width={200} height={70} rx={8} fill="none" stroke={COLORS.sky} strokeWidth={3} />
      <rect x={332} y={218 - upper * 66} width={196} height={upper * 66} fill="rgba(56,189,248,0.6)" />
      {/* unterer See */}
      <rect x={220} y={500} width={440} height={80} rx={8} fill="none" stroke={COLORS.sky} strokeWidth={3} />
      <rect x={222} y={502} width={436} height={76} fill="rgba(56,189,248,0.4)" />
      {/* Rohr */}
      <line x1={430} y1={215} x2={300} y2={505} stroke={COLORS.border} strokeWidth={16} strokeLinecap="round" />
      {/* Fluss-Pfeile */}
      {[0, 1, 2, 3].map((i) => {
        const tt = (flow + i * 0.25) % 1;
        const t = mode === 'pump' ? 1 - tt : tt;
        const x = 430 + (300 - 430) * t;
        const y = 215 + (505 - 215) * t;
        return <circle key={i} cx={x} cy={y} r={8} fill={mode === 'pump' ? COLORS.green : COLORS.amber} />;
      })}
      {/* Turbine/Pumpe */}
      <circle cx={300} cy={505} r={26} fill={COLORS.panel} stroke={mode === 'pump' ? COLORS.green : COLORS.amber} strokeWidth={4} />
      <text x={300} y={514} fontSize={28} textAnchor="middle">{mode === 'pump' ? '⚙️' : '🔌'}</text>
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 44 }}>
        <span>🔋</span>
        <span>🏔️</span>
        <span>💧</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 58, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Energie aufheben für später
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Energiespeicher
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Idee" title="Überschuss rein, bei Bedarf raus" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 20 }}>
        <div style={{ width: 340, padding: '26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 58 }}>⚡➕</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>Überschuss laden</div>
        </div>
        <div style={{ fontSize: 60 }}>🔋</div>
        <div style={{ width: 340, padding: '26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 58 }}>⚡➖</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>bei Bedarf abgeben</div>
        </div>
      </div>
      <Caption delay={40}>So verschiebt man Energie in die Zeit, in der sie fehlt.</Caption>
    </AbsoluteFill>
  );
};

const PumpspeicherScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // erste Hälfte: pumpen (laden), zweite Hälfte: erzeugen (entladen)
  const half = dur / 2;
  const mode: 'pump' | 'gen' = frame < half ? 'pump' : 'gen';
  const upper = mode === 'pump' ? interpolate(frame, [0, half], [0.1, 1], { extrapolateRight: 'clamp' }) : interpolate(frame, [half, dur], [1, 0.1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="Das Pumpspeicherwerk" />
      <div style={{ position: 'absolute', left: 120, top: 300 }}>
        <PumpStorage mode={mode} upper={upper} />
      </div>
      <div style={{ position: 'absolute', left: 1080, top: 420, width: 620 }}>
        <div style={{ padding: '20px 26px', borderRadius: 16, background: mode === 'pump' ? 'rgba(34,197,94,0.16)' : COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 27, fontWeight: 800, marginBottom: 18, opacity: mode === 'pump' ? 1 : 0.4 }}>
          🟢 Überschuss: Wasser hochpumpen → Lageenergie
        </div>
        <div style={{ padding: '20px 26px', borderRadius: 16, background: mode === 'gen' ? 'rgba(251,191,36,0.16)' : COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 27, fontWeight: 800, opacity: mode === 'gen' ? 1 : 0.4 }}>
          🟡 Bedarf: Wasser fällt → Turbine → Strom
        </div>
      </div>
      <Caption delay={30}>Wasser hoch bei Überschuss, runter bei Bedarf.</Caption>
    </AbsoluteFill>
  );
};

const ArtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔋', 'Akku', 'chemisch'],
    ['🏔️', 'Pumpspeicher', 'Lageenergie'],
    ['💨', 'Wasserstoff', 'Gas gespeichert'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="Verschiedene Speicher" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.sky, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Alle heben Energie für später auf.</Caption>
    </AbsoluteFill>
  );
};

const VerlusteScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  const grow = interpolate(frame, [10, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Nicht umsonst" title="Speichern kostet Energie" />
      <div style={{ width: 1000, opacity: f, marginTop: 20 }}>
        <div style={{ display: 'flex', height: 60, borderRadius: 14, overflow: 'hidden', border: `2px solid ${COLORS.border}` }}>
          <div style={{ width: `${75 * grow}%`, background: COLORS.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#0f172a' }}>nutzbar ≈ 75 %</div>
          <div style={{ flex: 1, background: COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#0f172a' }}>Verlust</div>
        </div>
      </div>
      <div style={{ marginTop: 24, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>
        Bei jedem Laden und Entladen geht Energie als Wärme verloren.
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Der Speicher-Wirkungsgrad ist kleiner als 100 %.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Energiespeicher" footer="Akku · Pumpspeicher · Wasserstoff">
      Speicher nehmen Überschuss auf
      <br />
      und geben ihn bei Bedarf ab.
      <br />
      Beim Speichern gibt es Verluste.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏠', 'Hausakku'],
    ['🏔️', 'Pumpspeicherwerk'],
    ['🚗', 'E-Auto als Speicher'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Speicher im Alltag" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Speicher machen erneuerbare Energie verlässlich.</Caption>
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
  { id: 'intro', C: Intro, min: 150 },
  { id: 'beobachten', C: BeobachtenScene, min: 230 },
  { id: 'pumpspeicher', C: PumpspeicherScene, min: 320 },
  { id: 'arten', C: ArtenScene, min: 250 },
  { id: 'verluste', C: VerlusteScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENERGIESPEICHER_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Energiespeicher: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENERGIESPEICHER_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/energiespeicher/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
