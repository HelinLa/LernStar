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
import { useFade } from '../astro';
import timings from '../narration/geschwindigkeit.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 80, marginBottom: 40, fontSize: 120 }}>
        <div style={{ transform: `translateX(${Math.sin(frame / 15) * 20}px)` }}>🚴</div>
        <div style={{ transform: `translateX(${Math.sin(frame / 8) * 30}px)` }}>🚗</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Geschwindigkeit: v = s / t
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wer ist schneller – und wie misst man das genau?
      </div>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Formel" title="Strecke geteilt durch Zeit" />
      <div style={{ fontSize: 130, fontWeight: 900, opacity: f }}>
        v = <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', fontSize: 70 }}>
          <span style={{ borderBottom: `5px solid ${COLORS.ink}`, padding: '0 20px', color: COLORS.sky }}>s (Strecke)</span>
          <span style={{ padding: '0 20px', color: COLORS.amber }}>t (Zeit)</span>
        </span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Große Strecke in kurzer Zeit heißt: schnell.</Caption>
    </AbsoluteFill>
  );
};

const EinheitScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Einheiten" title="m/s und km/h" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', opacity: f, fontSize: 44, fontWeight: 800 }}>
        <div style={{ padding: '26px 34px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>1 m/s</div>
        <div style={{ fontSize: 40, color: COLORS.amber }}>× 3,6 →</div>
        <div style={{ padding: '26px 34px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}` }}>3,6 km/h</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Von Meter pro Sekunde auf Kilometer pro Stunde: mal 3,6.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const carX = interpolate(frame % 100, [0, 100], [300, 1500]);
  const f = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="100 m in 5 s" />
      <div style={{ position: 'absolute', left: carX, top: 400, fontSize: 90 }}>🚗</div>
      <div style={{ position: 'absolute', left: 300, top: 560, width: 1200, height: 4, background: COLORS.muted }} />
      <div style={{ position: 'absolute', left: 800, top: 600, fontSize: 28, fontWeight: 800, color: COLORS.sky }}>100 m</div>
      <div style={{ position: 'absolute', left: 400, top: 720, fontSize: 44, fontWeight: 900, color: COLORS.amber, opacity: f }}>
        v = 100 m ÷ 5 s = 20 m/s = 72 km/h
      </div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={40}>100 Meter durch 5 Sekunden ergibt 20 m/s – das sind 72 km/h.</Caption>
    </AbsoluteFill>
  );
};

const DiagrammScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x0 = 500, y0 = 780, w = 900, h = 480;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Darstellen" title="Das s-t-Diagramm" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={x0} y1={y0} x2={x0} y2={y0 - h} stroke={COLORS.muted} strokeWidth={3} />
        <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={COLORS.muted} strokeWidth={3} />
        <text x={x0 - 60} y={y0 - h + 10} fontSize={26} fill={COLORS.sky} fontWeight="bold">s</text>
        <text x={x0 + w} y={y0 + 40} fontSize={26} fill={COLORS.amber} fontWeight="bold">t</text>
        <line x1={x0} y1={y0} x2={x0 + w * p} y2={y0 - h * p} stroke={COLORS.green} strokeWidth={7} />
      </svg>
      <div style={{ position: 'absolute', left: 1050, top: 400, fontSize: 30, fontWeight: 800, color: COLORS.green }}>steiler = schneller<br />Steigung = Geschwindigkeit</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.55)}>Bei gleichbleibendem Tempo eine Gerade – die Steigung ist die Geschwindigkeit.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Geschwindigkeit" footer="1 m/s = 3,6 km/h">
      v = s / t (Strecke durch Zeit).
      <br />
      Einheit: Meter pro Sekunde
      <br />
      oder Kilometer pro Stunde.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Tacho & Stoppuhr" />
      <div style={{ fontSize: 150, opacity: f }}>🚗 · ⏱️ · 🏃</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Der Tacho zeigt v direkt – beim Sport misst die Stoppuhr die Zeit für eine feste Strecke.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Überall steckt v = s ÷ t dahinter.</Caption>
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
  { id: 'intro', C: Intro, min: 130 },
  { id: 'formel', C: FormelScene, min: 220 },
  { id: 'einheit', C: EinheitScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 240 },
  { id: 'diagramm', C: DiagrammScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const GESCHWINDIGKEIT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Geschwindigkeit: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={GESCHWINDIGKEIT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/geschwindigkeit/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
