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
import timings from '../narration/wirkungsgrad.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Ribbon-Pfad (horizontales Band mit Bezier-Schwung)
function ribbon(x0: number, y0: number, x1: number, y1: number, h: number) {
  const mx = (x0 + x1) / 2;
  return `M ${x0} ${y0 - h} C ${mx} ${y0 - h} ${mx} ${y1 - h} ${x1} ${y1 - h} L ${x1} ${y1 + h} C ${mx} ${y1 + h} ${mx} ${y0 + h} ${x0} ${y0 + h} Z`;
}

// Sankey: zugeführt -> nutzbar (grün) + Verlust (rot)
const Sankey: React.FC<{ eta: number; reveal?: number }> = ({ eta, reveal = 1 }) => {
  const H = 280;
  const cy = 500;
  const inTop = cy - H / 2;
  const xIn = 470;
  const xOut = 1300;
  const hG = (eta * H) / 2;
  const hR = ((1 - eta) * H) / 2;
  const yGin = inTop + (eta * H) / 2;
  const yRin = inTop + eta * H + ((1 - eta) * H) / 2;
  const yGout = 330;
  const yRout = 700;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* zugeführt Block */}
      <rect x={180} y={inTop} width={290} height={H} rx={16} fill={COLORS.indigoDeep} opacity={0.9} />
      <text x={325} y={cy - 12} fontSize={30} fontWeight={900} fill={COLORS.ink} textAnchor="middle">zugeführte</text>
      <text x={325} y={cy + 26} fontSize={30} fontWeight={900} fill={COLORS.ink} textAnchor="middle">Energie</text>
      {/* Ribbons */}
      <g opacity={reveal}>
        <path d={ribbon(xIn, yGin, xOut, yGout, hG)} fill={COLORS.green} opacity={0.85} />
        <path d={ribbon(xIn, yRin, xOut, yRout, hR)} fill={COLORS.red} opacity={0.8} />
      </g>
      {/* Zielboxen */}
      <g opacity={reveal}>
        <rect x={xOut} y={yGout - 70} width={360} height={140} rx={16} fill="rgba(34,197,94,0.18)" stroke={COLORS.green} strokeWidth={3} />
        <text x={xOut + 180} y={yGout - 12} fontSize={30} fontWeight={900} fill={COLORS.green} textAnchor="middle">nutzbar 💡</text>
        <text x={xOut + 180} y={yGout + 30} fontSize={26} fontWeight={700} fill={COLORS.muted} textAnchor="middle">{Math.round(eta * 100)} % Licht</text>
        <rect x={xOut} y={yRout - 70} width={360} height={140} rx={16} fill="rgba(239,68,68,0.16)" stroke={COLORS.red} strokeWidth={3} />
        <text x={xOut + 180} y={yRout - 12} fontSize={30} fontWeight={900} fill={COLORS.red} textAnchor="middle">Verlust 🔥</text>
        <text x={xOut + 180} y={yRout + 30} fontSize={26} fontWeight={700} fill={COLORS.muted} textAnchor="middle">{Math.round((1 - eta) * 100)} % Wärme</text>
      </g>
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const glow = 0.5 + Math.sin(frame / 8) * 0.3;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 150, filter: `drop-shadow(0 0 ${30 * glow}px ${COLORS.amber})` }}>💡</div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 64, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        So viel raus wie rein?
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Wirkungsgrad einer Maschine
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Glühlampe: viel Wärme, wenig Licht" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 20 }}>
        <div style={{ width: 320, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, textAlign: 'center' }}>
          <div style={{ fontSize: 66 }}>🔌</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>elektrische Energie</div>
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.muted }}>→</div>
        <div style={{ width: 300, padding: '24px', borderRadius: 22, background: 'rgba(34,197,94,0.15)', border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>💡</div>
          <div style={{ fontSize: 25, fontWeight: 800, marginTop: 6, color: COLORS.green }}>wenig Licht</div>
        </div>
        <div style={{ width: 320, padding: '24px', borderRadius: 22, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>🔥</div>
          <div style={{ fontSize: 25, fontWeight: 800, marginTop: 6, color: COLORS.red }}>viel Wärme</div>
        </div>
      </div>
      <Caption delay={40}>Nur ein kleiner Teil wird wirklich zu Licht.</Caption>
    </AbsoluteFill>
  );
};

const AufteilungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [20, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Aufteilung" title="Nutzbar + Verlust = zugeführt" />
      <Sankey eta={0.4} reveal={reveal} />
      <Caption delay={30}>Ein Teil wird nutzbar, der Rest geht als Wärme verloren.</Caption>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Formel" title="Der Wirkungsgrad" />
      <div style={{ fontSize: 64, fontWeight: 900, opacity: f, display: 'flex', alignItems: 'center', gap: 20, marginTop: 20 }}>
        <span style={{ color: COLORS.indigo }}>Wirkungsgrad</span>
        <span>=</span>
        <span style={{ display: 'inline-flex', flexDirection: 'column', textAlign: 'center', fontSize: 44 }}>
          <span style={{ color: COLORS.green, borderBottom: `5px solid ${COLORS.ink}`, padding: '0 24px 8px' }}>nutzbare Energie</span>
          <span style={{ color: COLORS.indigo, padding: '8px 24px 0' }}>zugeführte Energie</span>
        </span>
      </div>
      <div style={{ marginTop: 34, fontSize: 34, fontWeight: 800, color: COLORS.muted, opacity: f }}>
        Glühlampe: nur ≈ <span style={{ color: COLORS.red }}>5 %</span> werden zu Licht
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Meist gibt man den Wirkungsgrad in Prozent an.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const devs = [
    { emoji: '💡', name: 'Glühlampe', eta: 5 },
    { emoji: '🔆', name: 'LED', eta: 40 },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="LED schlägt Glühlampe" />
      <div style={{ display: 'flex', gap: 80, opacity: f, marginTop: 20 }}>
        {devs.map((d, i) => (
          <div key={i} style={{ width: 520, padding: '28px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{d.emoji}</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 6 }}>{d.name}</div>
            {/* Balken nutzbar */}
            <div style={{ marginTop: 20, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', border: `2px solid ${COLORS.border}` }}>
              <div style={{ width: `${d.eta}%`, height: '100%', background: COLORS.green }} />
            </div>
            <div style={{ marginTop: 12, fontSize: 30, fontWeight: 900, color: COLORS.green }}>{d.eta} % nutzbar</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Bei gleicher Helligkeit braucht die LED viel weniger Strom.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Wirkungsgrad" footer="η = nutzbare Energie ÷ zugeführte Energie">
      Der Wirkungsgrad sagt,
      <br />
      welcher Anteil der zugeführten
      <br />
      Energie nutzbar wird.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔆', 'LED statt Glühlampe'],
    ['🏍️', 'guter Motor'],
    ['🔌', 'Ladegerät wird warm'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Überall ein Wirkungsgrad" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Ein Teil der Energie geht immer als Wärme verloren.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 220 },
  { id: 'aufteilung', C: AufteilungScene, min: 280 },
  { id: 'formel', C: FormelScene, min: 250 },
  { id: 'vergleich', C: VergleichScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WIRKUNGSGRAD_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Wirkungsgrad: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WIRKUNGSGRAD_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/wirkungsgrad/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
