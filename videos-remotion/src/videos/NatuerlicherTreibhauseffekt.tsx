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
import timings from '../narration/natuerlicher-treibhauseffekt.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Thermometer mit Skala -20..+40, value in °C
const Thermometer: React.FC<{ value: number; color: string }> = ({ value, color }) => {
  const frac = Math.max(0, Math.min(1, (value + 20) / 60));
  return (
    <svg width={120} height={340} viewBox="0 0 120 340">
      <rect x={46} y={14} width={26} height={250} rx={13} fill="rgba(255,255,255,0.08)" stroke={COLORS.border} strokeWidth={2} />
      <rect x={48} y={264 - frac * 246} width={22} height={frac * 246} fill={color} />
      <circle cx={59} cy={292} r={34} fill={color} />
      <text x={100} y={30} fontSize={20} fontWeight={700} fill={COLORS.muted}>+40</text>
      <text x={100} y={150} fontSize={20} fontWeight={700} fill={COLORS.muted}>0</text>
      <text x={100} y={262} fontSize={20} fontWeight={700} fill={COLORS.muted}>-20</text>
    </svg>
  );
};

const CaseCard: React.FC<{ emoji: string; title: string; temp: string; sub: string; color: string; value: number }> = ({ emoji, title, temp, sub, color, value }) => (
  <div style={{ width: 480, padding: '26px 20px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${color}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ fontSize: 60 }}>{emoji}</div>
    <div style={{ fontSize: 26, fontWeight: 900, marginTop: 6 }}>{title}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
      <Thermometer value={value} color={color} />
      <div style={{ fontSize: 40, fontWeight: 900, color }}>{temp}</div>
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>{sub}</div>
  </div>
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
        <span>🧊</span>
        <span>🌡️</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Lebenswichtig – und doch gefährlich
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Natürlicher & verstärkter Treibhauseffekt
      </div>
    </AbsoluteFill>
  );
};

const OhneScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Ohne Atmosphäre" title="Eine eisige Kugel" />
      <div style={{ opacity: f }}>
        <CaseCard emoji="🧊🌍" title="Keine Treibhausgase" temp="≈ −18 °C" sub="Wärme entweicht sofort · kein Leben" color={COLORS.sky} value={-18} />
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Ohne Treibhausgase strahlt die Wärme sofort ins All ab.</Caption>
    </AbsoluteFill>
  );
};

const NatuerlichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Natürlicher Effekt" title="Genau richtig für Leben" />
      <div style={{ opacity: f }}>
        <CaseCard emoji="🌍🌿" title="Natürliche Treibhausgase" temp="≈ +15 °C" sub="hält Wärme · macht die Erde bewohnbar" color={COLORS.green} value={15} />
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Die Atmosphäre hebt die Temperatur auf angenehme +15 °C.</Caption>
    </AbsoluteFill>
  );
};

const VerstaerktScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const val = interpolate(frame, [30, dur - 40], [15, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Verstärkter Effekt" title="Der Mensch heizt nach" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <div style={{ fontSize: 90 }}>🏭🚗</div>
        <div style={{ fontSize: 40, color: COLORS.muted }}>+ CO₂ →</div>
        <CaseCard emoji="🌍🔥" title="Zusätzliches CO₂" temp={`↑ ${Math.round(val)} °C`} sub="mehr Wärme bleibt · Erwärmung" color={COLORS.red} value={val} />
      </div>
      <Sfx sound="whoosh" at={14} volume={0.3} />
      <Caption delay={30}>Zusätzliches CO₂ verstärkt den Effekt – die Erde erwärmt sich.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="Drei Fälle" />
      <div style={{ display: 'flex', gap: 30, opacity: f, transform: 'scale(0.9)' }}>
        <CaseCard emoji="🧊" title="ohne Atmosphäre" temp="−18 °C" sub="eisig" color={COLORS.sky} value={-18} />
        <CaseCard emoji="🌿" title="natürlich" temp="+15 °C" sub="lebensfreundlich" color={COLORS.green} value={15} />
        <CaseCard emoji="🔥" title="verstärkt" temp="↑ immer mehr" sub="gefährlich" color={COLORS.red} value={28} />
      </div>
      <Caption delay={40}>Ein bisschen ist lebenswichtig – zu viel wird gefährlich.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Natürlich vs. verstärkt" footer="+15 °C statt −18 °C · Mensch heizt nach">
      Der natürliche Treibhauseffekt
      <br />
      macht die Erde bewohnbar.
      <br />
      Der Mensch verstärkt ihn mit CO₂.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Von −18 zu +15 – und weiter?" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: f, marginTop: 10 }}>
        <div style={{ padding: '22px 30px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, fontSize: 34, fontWeight: 900, color: COLORS.sky }}>−18 °C</div>
        <div style={{ fontSize: 40, color: COLORS.muted }}>→</div>
        <div style={{ padding: '22px 30px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 34, fontWeight: 900, color: COLORS.green }}>+15 °C</div>
        <div style={{ fontSize: 40, color: COLORS.muted }}>→</div>
        <div style={{ padding: '22px 30px', borderRadius: 16, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, fontSize: 34, fontWeight: 900, color: COLORS.red }}>↑ + X °C</div>
      </div>
      <div style={{ marginTop: 26, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>Jedes zusätzliche Grad bringt das Klima aus dem Gleichgewicht.</div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Natürlich lebenswichtig – zusätzlich gefährlich.</Caption>
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
  { id: 'ohne', C: OhneScene, min: 250 },
  { id: 'natuerlich', C: NatuerlichScene, min: 240 },
  { id: 'verstaerkt', C: VerstaerktScene, min: 260 },
  { id: 'vergleich', C: VergleichScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const NATUERLICHER_TREIBHAUSEFFEKT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const NatuerlicherTreibhauseffekt: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={NATUERLICHER_TREIBHAUSEFFEKT_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/natuerlicher-treibhauseffekt/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
