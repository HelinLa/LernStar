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
import { RectWire, BatterySym, Bulb } from '../circuit';
import { Meter, useFade } from '../electric';
import timings from '../narration/messen.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const LX = 600, RX = 1320, TY = 360, BY = 740, MX = 960;

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 60, marginBottom: 30 }}><Meter x={0} y={0} kind="A" r={70} /><div style={{ width: 40 }} /><Meter x={0} y={0} kind="V" r={70} /></div>
      <StarLogo size={84} />
      <div style={{ marginTop: 40, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie misst man Strom & Spannung?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Zwei Geräte – und jedes wird anders angeschlossen.
      </div>
    </AbsoluteFill>
  );
};

const AmperemeterScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Stromstärke" title="Amperemeter in Reihe" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on gapAtBottom={140} />
    <Bulb x={MX} y={TY} size={100} on />
    <Meter x={MX} y={BY} kind="A" />
    <BatterySym x={LX} y={(TY + BY) / 2} horizontal={false} />
    <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.amber }}>der Strom fließt DURCH das Gerät</div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption>Das Amperemeter wird in Reihe eingebaut – der Strom fließt hindurch.</Caption>
  </AbsoluteFill>
);

const VoltmeterScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Spannung" title="Voltmeter parallel" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on />
    <Bulb x={MX} y={TY} size={100} on />
    <BatterySym x={MX} y={BY} />
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={MX - 120} y1={TY} x2={MX - 120} y2={TY + 160} stroke={COLORS.green} strokeWidth={4} />
      <line x1={MX + 120} y1={TY} x2={MX + 120} y2={TY + 160} stroke={COLORS.green} strokeWidth={4} />
      <line x1={MX - 120} y1={TY + 160} x2={MX - 74} y2={TY + 160} stroke={COLORS.green} strokeWidth={4} />
      <line x1={MX + 120} y1={TY + 160} x2={MX + 74} y2={TY + 160} stroke={COLORS.green} strokeWidth={4} />
    </svg>
    <Meter x={MX} y={TY + 160} kind="V" />
    <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.green }}>daneben, an beide Enden des Bauteils</div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption>Das Voltmeter wird parallel angeschlossen – neben das Bauteil.</Caption>
  </AbsoluteFill>
);

const FehlerScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Nicht vertauschen!" title="Falsch angeschlossen" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.amber }}>Ⓐ parallel</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: COLORS.red }}>fast Kurzschluss → kaputt 💥</div>
          </div>
          <div style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.green }}>Ⓥ in Reihe</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: COLORS.red }}>bremst → fast kein Strom</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="impact" at={14} volume={0.36} />
      <Caption delay={40}>Also: Amperemeter in Reihe, Voltmeter parallel – niemals andersherum.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Messen" footer="niemals vertauschen">
      Amperemeter → Stromstärke → in Reihe.
      <br />
      Voltmeter → Spannung → parallel.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Das Multimeter" />
      <div style={{ fontSize: 180, opacity: f }}>🔧🔢</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Ein Multimeter kann beides – umstellen auf A oder V und richtig anschließen.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Elektriker prüfen damit ständig Spannung und Stromstärke.</Caption>
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
  { id: 'amperemeter', C: AmperemeterScene, min: 240 },
  { id: 'voltmeter', C: VoltmeterScene, min: 240 },
  { id: 'fehler', C: FehlerScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MESSEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Messen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MESSEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/messen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
