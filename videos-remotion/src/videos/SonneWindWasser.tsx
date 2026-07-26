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
import timings from '../narration/sonne-wind-wasser.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Turbine: React.FC<{ cx: number; cy: number; r: number; speed: number; blades?: number }> = ({ cx, cy, r, speed, blades = 3 }) => {
  const frame = useCurrentFrame();
  const a = frame * speed;
  return (
    <g transform={`rotate(${a} ${cx} ${cy})`}>
      {Array.from({ length: blades }, (_, i) => (
        <rect key={i} x={cx - 5} y={cy - r} width={10} height={r} rx={5} fill={COLORS.sky} transform={`rotate(${(360 / blades) * i} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={12} fill={COLORS.ink} />
    </g>
  );
};

// Kette: Quelle-Icon → (Generator?) → Strom
const PrincipleScene: React.FC<{ kicker: string; title: string; source: string; sourceLabel: string; steps: string[]; caption: string; accent: string; visual: React.ReactNode }> = ({ kicker, title, source, sourceLabel, steps, caption, accent, visual }) => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker={kicker} title={title} />
      <div style={{ position: 'absolute', left: 160, top: 400, width: 520, height: 380 }}>{visual}</div>
      <div style={{ position: 'absolute', left: 760, top: 420, display: 'flex', flexDirection: 'column', gap: 16, opacity: f }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ padding: '16px 24px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${i === steps.length - 1 ? COLORS.amber : accent}`, fontSize: 28, fontWeight: 800, minWidth: 340 }}>{s}</div>
            {i < steps.length - 1 && <div style={{ fontSize: 34, color: COLORS.muted }}>↓</div>}
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={30}>{caption}</Caption>
    </AbsoluteFill>
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
        <span>🔆</span>
        <span>🌬️</span>
        <span>🏞️</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 58, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Sonne, Wind & Wasser nutzen
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Drei Anlagen, drei Wirkprinzipien
      </div>
    </AbsoluteFill>
  );
};

const PhotovoltaikScene: React.FC<SceneProps> = () => (
  <PrincipleScene
    kicker="Photovoltaik"
    title="Licht direkt in Strom"
    source="🔆"
    sourceLabel="Sonne"
    accent={COLORS.amber}
    steps={['☀️ Sonnenlicht', '🔆 Solarzelle', '⚡ Strom (direkt!)']}
    caption="Ohne bewegliche Teile – je stärker das Licht, desto mehr Strom."
    visual={
      <svg width={520} height={380} viewBox="0 0 520 380">
        <circle cx={130} cy={90} r={50} fill={COLORS.amber} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line key={a} x1={130 + Math.cos((a * Math.PI) / 180) * 60} y1={90 + Math.sin((a * Math.PI) / 180) * 60} x2={130 + Math.cos((a * Math.PI) / 180) * 78} y2={90 + Math.sin((a * Math.PI) / 180) * 78} stroke={COLORS.amber} strokeWidth={5} />
        ))}
        {[0, 1, 2].map((i) => <line key={i} x1={180 - i * 10} y1={150} x2={280} y2={250} stroke={COLORS.amber} strokeWidth={3} strokeDasharray="8 6" />)}
        <rect x={230} y={250} width={230} height={110} rx={8} fill="#1e3a5f" stroke={COLORS.sky} strokeWidth={3} transform="skewX(-12)" />
        {Array.from({ length: 4 }, (_, i) => <line key={i} x1={250 + i * 55} y1={250} x2={230 + i * 55} y2={360} stroke={COLORS.sky} strokeWidth={2} />)}
      </svg>
    }
  />
);

const WindkraftScene: React.FC<SceneProps> = () => (
  <PrincipleScene
    kicker="Windkraft"
    title="Wind dreht den Generator"
    source="🌬️"
    sourceLabel="Wind"
    accent={COLORS.sky}
    steps={['💨 Wind', '🌀 Flügel drehen', '🔌 Generator', '⚡ Strom']}
    caption="Je kräftiger der Wind, desto mehr Strom."
    visual={
      <svg width={520} height={380} viewBox="0 0 520 380">
        <rect x={244} y={150} width={14} height={210} fill={COLORS.muted} />
        <Turbine cx={251} cy={150} r={110} speed={7} />
        <text x={90} y={110} fontSize={40}>💨</text>
      </svg>
    }
  />
);

const WasserkraftScene: React.FC<SceneProps> = () => (
  <PrincipleScene
    kicker="Wasserkraft"
    title="Fallendes Wasser treibt an"
    source="🏞️"
    sourceLabel="Wasser"
    accent={COLORS.sky}
    steps={['💧 Wasser fällt', '⚙️ Turbine', '🔌 Generator', '⚡ Strom']}
    caption="Je größer die Fallhöhe, desto mehr Strom."
    visual={
      <svg width={520} height={380} viewBox="0 0 520 380">
        <rect x={40} y={40} width={150} height={200} rx={6} fill="#1e3a5f" stroke={COLORS.sky} strokeWidth={2} />
        <path d="M 190 90 Q 260 120 300 240" stroke={COLORS.sky} strokeWidth={20} fill="none" opacity={0.7} />
        <Turbine cx={340} cy={280} r={70} speed={9} blades={6} />
      </svg>
    }
  />
);

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="Zwei Wege zum Strom" />
      <div style={{ display: 'flex', gap: 50, opacity: f, marginTop: 20 }}>
        <div style={{ width: 560, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>🔆</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8, color: COLORS.amber }}>Photovoltaik</div>
          <div style={{ marginTop: 14, fontSize: 26, fontWeight: 800 }}>Licht → <span style={{ color: COLORS.green }}>Strom (direkt)</span></div>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>kein Generator nötig</div>
        </div>
        <div style={{ width: 560, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>🌬️🏞️</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8, color: COLORS.sky }}>Wind & Wasser</div>
          <div style={{ marginTop: 14, fontSize: 26, fontWeight: 800 }}>Bewegung → Generator → <span style={{ color: COLORS.green }}>Strom</span></div>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>erst Drehung, dann Strom</div>
        </div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Zwei Wege, ein Ziel: sauberer Strom.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Sonne, Wind & Wasser" footer="Licht direkt · Wind/Wasser über Generator">
      Photovoltaik: Licht direkt zu Strom.
      <br />
      Wind & Wasser: erst Drehbewegung,
      <br />
      dann Generator → Strom.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏜️', 'Solar: sonnige Orte'],
    ['🌬️', 'Wind: windige Küsten'],
    ['⛰️', 'Wasser: starkes Gefälle'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der richtige Standort zählt" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der richtige Standort entscheidet über den Ertrag.</Caption>
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
  { id: 'photovoltaik', C: PhotovoltaikScene, min: 240 },
  { id: 'windkraft', C: WindkraftScene, min: 240 },
  { id: 'wasserkraft', C: WasserkraftScene, min: 240 },
  { id: 'vergleich', C: VergleichScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SONNE_WIND_WASSER_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const SonneWindWasser: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SONNE_WIND_WASSER_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/sonne-wind-wasser/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
