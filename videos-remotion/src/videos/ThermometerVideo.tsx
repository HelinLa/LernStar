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
import { Thermometer, useFade } from '../thermal';
import timings from '../narration/thermometer.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const temp = 30 + Math.sin(frame / 20) * 25;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Thermometer x={960} y={140} h={300} temp={temp} />
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie funktioniert ein Thermometer?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Keine Elektronik, keine Batterie – und trotzdem genau.
      </div>
    </AbsoluteFill>
  );
};

// ── Ausdehnung ─────────────────────────────────────────────────────────
const AusdehnungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const temp = interpolate(frame, [15, dur - 20], [10, 85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Prinzip" title="Flüssigkeit dehnt sich aus" />
      <Thermometer x={760} y={260} h={440} temp={temp} />
      <div style={{ position: 'absolute', left: 1020, top: 380, fontSize: 44, color: COLORS.red }}>⬆️</div>
      <div style={{ position: 'absolute', left: 1080, top: 360, fontSize: 32, fontWeight: 800, color: COLORS.red }}>wärmer → Säule steigt</div>
      <div style={{ position: 'absolute', left: 1080, top: 520, fontSize: 32, fontWeight: 800, color: COLORS.sky }}>kälter → Säule sinkt</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Wird es wärmer, dehnt sich die Flüssigkeit aus und steigt in der Röhre.</Caption>
    </AbsoluteFill>
  );
};

// ── Ablesen ────────────────────────────────────────────────────────────
const AblesenScene: React.FC<SceneProps> = () => {
  const lab = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ablesen" title="An der Skala" />
      <Thermometer x={760} y={260} h={440} temp={42} />
      <div style={{ position: 'absolute', left: 1000, top: 480, fontSize: 40, fontWeight: 900, color: COLORS.amber, opacity: lab }}>← hier endet die Säule</div>
      <div style={{ position: 'absolute', left: 1000, top: 560, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: lab }}>= abgelesene Temperatur</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Wo die Flüssigkeit endet, liest du die Temperatur ab.</Caption>
    </AbsoluteFill>
  );
};

// ── Fixpunkte ──────────────────────────────────────────────────────────
const FixpunkteScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Geeicht" title="Zwei feste Punkte" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'flex', gap: 80, opacity: f }}>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 100 }}>🧊💧</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.sky, marginTop: 8 }}>0 °C</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.muted }}>Eiswasser</div>
          </div>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 100 }}>♨️💧</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.red, marginTop: 8 }}>100 °C</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.muted }}>kochendes Wasser</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Dazwischen wird die Skala in gleiche Schritte geteilt.</Caption>
    </AbsoluteFill>
  );
};

// ── Proben ─────────────────────────────────────────────────────────────
const ProbenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const probes = [
    { icon: '🧊', name: 'Eiswasser', temp: 2 },
    { icon: '🛁', name: 'Badewasser', temp: 38 },
    { icon: '🍲', name: 'Suppe', temp: 75 },
  ];
  const idx = Math.min(2, Math.floor(interpolate(frame, [15, dur - 15], [0, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const cur = probes[idx];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="In der Praxis" title="Jede Probe misst sich selbst" />
      <Thermometer x={760} y={260} h={440} temp={cur.temp} />
      <div style={{ position: 'absolute', left: 1080, top: 420, fontSize: 130 }}>{cur.icon}</div>
      <div style={{ position: 'absolute', left: 1060, top: 580, fontSize: 34, fontWeight: 800, color: COLORS.amber }}>{cur.name}</div>
      <Sfx sound="pop" at={2} volume={0.3} />
      <Caption>Dasselbe Gerät misst Eiswasser, Badewasser oder heiße Suppe.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Thermometer" footer="geeicht bei 0 °C und 100 °C">
      Die Flüssigkeit dehnt sich beim
      <br />
      Erwärmen aus und steigt.
      <br />
      An der Skala liest man ab.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Thermometer überall" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🤒" title="Fieberthermometer" delay={10} />
        <TCard icon="🍰" title="Backofen" delay={30} />
        <TCard icon="🪟" title="Außenthermometer" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Immer dehnt sich ein Stoff mit der Wärme aus.</Caption>
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
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: COLORS.muted, opacity: s }}>
        Physik verstehen – Schritt für Schritt.
      </div>
    </AbsoluteFill>
  );
};

const SCENES: { id: string; C: React.FC<SceneProps>; min: number }[] = [
  { id: 'intro', C: Intro, min: 130 },
  { id: 'ausdehnung', C: AusdehnungScene, min: 240 },
  { id: 'ablesen', C: AblesenScene, min: 220 },
  { id: 'fixpunkte', C: FixpunkteScene, min: 240 },
  { id: 'proben', C: ProbenScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const THERMOMETER_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const ThermometerVideo: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={THERMOMETER_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/thermometer/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
