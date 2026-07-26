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
import timings from '../narration/treibhauseffekt.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// CO2-Moleküle in der Atmosphäre (deterministisch)
const CO2 = Array.from({ length: 14 }, (_, i) => ({ x: 200 + ((i * 127) % 1500), y: 220 + ((i * 53) % 130) }));

// Treibhaus-Diagramm: Sonnenstrahlen rein (gelb), Wärmestrahlung raus (rot, teils zurück)
const GreenhouseDiagram: React.FC<{ co2: number; w?: number }> = ({ co2, w = 1920 }) => {
  const frame = useCurrentFrame();
  const nCO2 = Math.round(co2 * CO2.length);
  const escape = 1 - co2 * 0.7; // Anteil Wärme, die entweicht
  return (
    <svg width={1920} height={620} viewBox="0 0 1920 620" style={{ position: 'absolute', left: 0, top: 300 }}>
      {/* Atmosphären-Band */}
      <rect x={80} y={190} width={1760} height={170} fill="rgba(56,189,248,0.06)" stroke="rgba(56,189,248,0.2)" strokeWidth={2} />
      <text x={110} y={225} fontSize={22} fontWeight={700} fill={COLORS.muted}>Atmosphäre</text>
      {/* Erde */}
      <rect x={80} y={470} width={1760} height={140} rx={10} fill="#2b5e34" />
      <text x={960} y={560} fontSize={30} fontWeight={800} fill={COLORS.ink} textAnchor="middle">🌍 Erde</text>
      {/* Sonne */}
      <circle cx={230} cy={70} r={54} fill={COLORS.amber} />
      {/* Sonnenstrahlen rein (gelb, gehen durch) */}
      {[0, 1, 2].map((i) => {
        const x0 = 280 + i * 40;
        return <line key={i} x1={x0} y1={110} x2={x0 + 260} y2={470} stroke={COLORS.amber} strokeWidth={5} markerEnd="url(#ay)" />;
      })}
      {/* Wärmestrahlung raus (rot) – teils entweicht, teils zurück */}
      {[0, 1, 2, 3].map((i) => {
        const x0 = 900 + i * 150;
        const esc = i / 4 < escape;
        return esc ? (
          <line key={i} x1={x0} y1={470} x2={x0 + 40} y2={120} stroke={COLORS.red} strokeWidth={5} opacity={0.9} />
        ) : (
          <g key={i}>
            <line x1={x0} y1={470} x2={x0 + 20} y2={300} stroke={COLORS.red} strokeWidth={5} />
            <line x1={x0 + 20} y1={300} x2={x0 - 10} y2={470} stroke={COLORS.red} strokeWidth={5} strokeDasharray="8 6" />
          </g>
        );
      })}
      {/* CO2-Moleküle */}
      {CO2.slice(0, nCO2).map((c, i) => (
        <g key={i} transform={`translate(${c.x}, ${c.y})`}>
          <circle r={16} fill="rgba(239,68,68,0.8)" />
          <text y={7} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle">CO₂</text>
        </g>
      ))}
      <defs>
        <marker id="ay" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={COLORS.amber} /></marker>
      </defs>
    </svg>
  );
};

const Thermo: React.FC<{ level: number; x: number; y: number }> = ({ level, x, y }) => (
  <svg width={90} height={280} viewBox="0 0 90 280" style={{ position: 'absolute', left: x, top: y }}>
    <rect x={34} y={10} width={22} height={210} rx={11} fill="rgba(255,255,255,0.1)" stroke={COLORS.border} strokeWidth={2} />
    <rect x={36} y={220 - level * 200} width={18} height={level * 200} fill={level > 0.6 ? COLORS.red : COLORS.amber} />
    <circle cx={45} cy={245} r={28} fill={level > 0.6 ? COLORS.red : COLORS.amber} />
  </svg>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 40 }}>
        <span>🌍</span>
        <span>🌡️</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 58, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie CO₂ das Klima verändert
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Treibhauseffekt
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Sonne wärmt – Erde strahlt ab" />
      <div style={{ opacity: f }}><GreenhouseDiagram co2={0} /></div>
      <Caption delay={30}>Im Gleichgewicht bleibt es angenehm warm.</Caption>
    </AbsoluteFill>
  );
};

const MechanismusScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Mechanismus" title="Licht rein – Wärme bleibt drin" />
      <div style={{ opacity: f }}><GreenhouseDiagram co2={0.6} /></div>
      <Caption delay={30}>CO₂ lässt Sonnenlicht durch, hält Wärme zurück – wie im Gewächshaus.</Caption>
    </AbsoluteFill>
  );
};

const AusprobierenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const co2 = interpolate(frame, [30, dur - 40], [0.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ausprobieren" title="Mehr CO₂ – mehr Wärme bleibt" />
      <GreenhouseDiagram co2={co2} />
      <Thermo level={0.2 + co2 * 0.7} x={1720} y={330} />
      <Caption delay={30}>Weniger Wärme entweicht – die Erde wird wärmer.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="Wenig oder viel Treibhausgas?" />
      <div style={{ display: 'flex', gap: 60, opacity: f, marginTop: 20 }}>
        <div style={{ width: 540, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>🌍❄️</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8, color: COLORS.sky }}>wenig CO₂</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>viel Wärme entweicht → kühl</div>
        </div>
        <div style={{ width: 540, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>🌍🔥</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8, color: COLORS.red }}>viel CO₂</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>Wärme bleibt → wärmer</div>
        </div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Mehr CO₂ bedeutet eine wärmere Erde.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Der Treibhauseffekt" footer="mehr CO₂ → wärmere Erde">
      Treibhausgase lassen Sonnenlicht durch,
      <br />
      halten aber die Wärmestrahlung
      <br />
      der Erde zurück.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🚗', 'Autoabgase'],
    ['🔥', 'Heizung'],
    ['👣', 'CO₂-Fußabdruck'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Woher das CO₂ kommt" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Jedes bisschen CO₂ zählt.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 240 },
  { id: 'mechanismus', C: MechanismusScene, min: 300 },
  { id: 'ausprobieren', C: AusprobierenScene, min: 260 },
  { id: 'vergleich', C: VergleichScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TREIBHAUSEFFEKT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Treibhauseffekt: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TREIBHAUSEFFEKT_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/treibhauseffekt/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
