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
import timings from '../narration/generator.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Generator: drehender Magnet in einer Spule + Glühbirne, Helligkeit ~ speed
const GeneratorUnit: React.FC<{ cx: number; cy: number; speed: number; bright: number }> = ({ cx, cy, speed, bright }) => {
  const frame = useCurrentFrame();
  const ang = frame * speed;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* Spule (Rechteck mit Wicklungen) */}
      <rect x={cx - 150} y={cy - 130} width={300} height={260} rx={18} fill="none" stroke={COLORS.border} strokeWidth={4} />
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse key={i} cx={cx} cy={cy - 100 + i * 33} rx={158} ry={16} fill="none" stroke={COLORS.indigo} strokeWidth={5} opacity={0.7} />
      ))}
      {/* drehender Magnet (rot N / blau S) */}
      <g transform={`rotate(${ang} ${cx} ${cy})`}>
        <rect x={cx - 22} y={cy - 90} width={44} height={90} fill={COLORS.red} />
        <rect x={cx - 22} y={cy} width={44} height={90} fill={COLORS.sky} />
        <text x={cx} y={cy - 45} fontSize={30} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">N</text>
        <text x={cx} y={cy + 48} fontSize={30} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">S</text>
      </g>
      <circle cx={cx} cy={cy} r={14} fill={COLORS.ink} />
      {/* Leitungen zur Lampe rechts */}
      <path d={`M ${cx + 150} ${cy - 40} H ${cx + 360}`} stroke={COLORS.amber} strokeWidth={5} fill="none" />
      <path d={`M ${cx + 150} ${cy + 40} H ${cx + 360}`} stroke={COLORS.amber} strokeWidth={5} fill="none" />
      {/* Glühbirne */}
      <circle cx={cx + 360} cy={cy} r={54} fill={`rgba(251,191,36,${0.15 + bright * 0.85})`} stroke={COLORS.amber} strokeWidth={4} />
      {bright > 0.05 && <circle cx={cx + 360} cy={cy} r={54 + bright * 40} fill="none" stroke={COLORS.amber} strokeWidth={2} opacity={bright * 0.5} />}
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
      <div style={{ fontSize: 130, display: 'flex', gap: 30, alignItems: 'center' }}>
        <span style={{ display: 'inline-block', transform: `rotate(${frame * 4}deg)` }}>🚲</span>
        <span>💡</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 62, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Aus Bewegung wird Strom
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Generator (Dynamo)
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  // Rad steht 0-40, dann dreht schneller
  const spinning = frame > 45;
  const speed = spinning ? interpolate(frame, [45, 160], [1, 8], { extrapolateRight: 'clamp' }) : 0;
  const bright = spinning ? interpolate(frame, [45, 160], [0.1, 1], { extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Dreht sich das Rad, leuchtet die Lampe" />
      <GeneratorUnit cx={760} cy={560} speed={speed} bright={bright} />
      <div style={{ position: 'absolute', left: 1360, top: 480, width: 400, fontSize: 30, fontWeight: 800, color: spinning ? COLORS.green : COLORS.muted }}>
        {spinning ? '🔆 leuchtet – je schneller, desto heller' : '🌑 Rad steht → dunkel'}
      </div>
      <Caption delay={30}>Steht das Rad, bleibt es dunkel – dreht es sich, wird es hell.</Caption>
    </AbsoluteFill>
  );
};

const PrinzipScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Prinzip" title="Magnet dreht sich an Spule vorbei" />
      <GeneratorUnit cx={640} cy={560} speed={5} bright={0.8} />
      <div style={{ position: 'absolute', left: 1180, top: 420, width: 560, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.red}`, fontSize: 26, fontWeight: 800, marginBottom: 14 }}>🧲 Magnet dreht sich</div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, fontSize: 26, fontWeight: 800, marginBottom: 14 }}>🌀 in der Draht-Spule</div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, fontSize: 26, fontWeight: 800 }}>⚡ es entsteht Strom</div>
      </div>
      <div style={{ position: 'absolute', bottom: 150, width: 1920, textAlign: 'center', fontSize: 28, fontWeight: 800, color: COLORS.green, opacity: f }}>
        Bewegungsenergie → elektrische Energie
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
    </AbsoluteFill>
  );
};

const AusprobierenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Ausprobieren" title="Schneller drehen – mehr Strom" />
      <div style={{ display: 'flex', gap: 80, opacity: f, marginTop: 40 }}>
        {[
          { l: 'langsam', s: 1.2, b: 0.18, c: COLORS.red },
          { l: 'schnell', s: 7, b: 1, c: COLORS.green },
        ].map((d, i) => (
          <div key={i} style={{ width: 460, height: 360, position: 'relative', borderRadius: 22, background: COLORS.panel, border: `2px solid ${d.c}` }}>
            <MiniGen s={d.s} b={d.b} />
            <div style={{ position: 'absolute', bottom: 18, width: '100%', textAlign: 'center', fontSize: 30, fontWeight: 900, color: d.c }}>{d.l}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Von der Drehgeschwindigkeit hängt der Strom ab.</Caption>
    </AbsoluteFill>
  );
};

const MiniGen: React.FC<{ s: number; b: number }> = ({ s, b }) => {
  const frame = useCurrentFrame();
  const ang = frame * s;
  return (
    <svg width={460} height={320} viewBox="0 0 460 320" style={{ position: 'absolute', top: 10, left: 0 }}>
      <rect x={70} y={90} width={160} height={150} rx={12} fill="none" stroke={COLORS.border} strokeWidth={3} />
      {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={150} cy={110 + i * 30} rx={82} ry={9} fill="none" stroke={COLORS.indigo} strokeWidth={3} opacity={0.7} />)}
      <g transform={`rotate(${ang} 150 165)`}>
        <rect x={138} y={115} width={24} height={50} fill={COLORS.red} />
        <rect x={138} y={165} width={24} height={50} fill={COLORS.sky} />
      </g>
      <path d="M 230 145 H 330" stroke={COLORS.amber} strokeWidth={4} />
      <path d="M 230 185 H 330" stroke={COLORS.amber} strokeWidth={4} />
      <circle cx={360} cy={165} r={38} fill={`rgba(251,191,36,${0.15 + b * 0.85})`} stroke={COLORS.amber} strokeWidth={3} />
    </svg>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🚲', 'Fahrrad-Dynamo', 'Treten dreht'],
    ['💨', 'Windrad', 'Wind dreht'],
    ['🏭', 'Kraftwerk', 'Dampf-Turbine dreht'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="Überall ein Generator" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Ob klein oder groß – der Generator wandelt Drehung in Strom.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Der Generator" footer="Bewegungsenergie → elektrische Energie">
      Ein Magnet dreht sich an einer
      <br />
      Spule vorbei – so entsteht Strom.
      <br />
      Schneller drehen = mehr Strom.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🚲', 'Fahrraddynamo'],
    ['💨', 'Windrad'],
    ['🏭', 'Kraftwerksturbine'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Generatoren im Alltag" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Fast jedes Kraftwerk hat am Ende einen großen Generator.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'prinzip', C: PrinzipScene, min: 260 },
  { id: 'ausprobieren', C: AusprobierenScene, min: 240 },
  { id: 'vergleich', C: VergleichScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const GENERATOR_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Generator: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={GENERATOR_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/generator/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
