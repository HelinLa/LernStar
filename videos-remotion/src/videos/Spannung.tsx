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
import { Meter, WaterAnalogy, useFade } from '../electric';
import timings from '../narration/spannung.timings.json';

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
      <div style={{ fontSize: 170, marginBottom: 20 }}>🔋⚡</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was ist die elektrische Spannung?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Was treibt die Ladungen überhaupt an?
      </div>
    </AbsoluteFill>
  );
};

const AntriebScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Der Antrieb" title="Die Spannung U treibt an" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on />
    <Bulb x={MX} y={TY} size={110} on />
    <BatterySym x={MX} y={BY} label="U = Antrieb (Volt)" />
    <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.green }}>wie eine Pumpe, die die Ladungen drückt</div>
    <Sfx sound="whoosh" at={10} volume={0.3} />
    <Caption>Die Spannung U ist der Antrieb der Quelle – Einheit Volt (V).</Caption>
  </AbsoluteFill>
);

const ZellenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cells = frame < dur * 0.33 ? 1 : frame < dur * 0.66 ? 2 : 3;
  const volt = cells * 1.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Mehr Zellen" title="Mehr Volt → heller" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on />
      <Bulb x={MX} y={TY} size={90 + cells * 20} on />
      <div style={{ position: 'absolute', left: MX - 100, top: BY - 30, display: 'flex', gap: 6 }}>
        {Array.from({ length: cells }).map((_, i) => <div key={i} style={{ width: 40, height: 60, borderRadius: 6, background: COLORS.amber, textAlign: 'center', fontSize: 20, fontWeight: 800, color: '#0b1120', lineHeight: '60px' }}>🔋</div>)}
      </div>
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 40, fontWeight: 900, color: COLORS.amber }}>{cells} Zelle{cells > 1 ? 'n' : ''} = {volt.toFixed(1)} V</div>
      <Sfx sound="pling" at={Math.round(dur * 0.33)} volume={0.35} />
      <Caption delay={Math.round(dur * 0.4)}>Jede Zelle liefert 1,5 V – mehr Zellen, mehr Antrieb, hellere Lampe.</Caption>
    </AbsoluteFill>
  );
};

const VoltmeterScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Gemessen" title="Voltmeter parallel" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on />
    <Bulb x={MX} y={TY} size={100} on />
    <BatterySym x={MX} y={BY} />
    {/* Voltmeter parallel zur Lampe */}
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={MX - 120} y1={TY} x2={MX - 120} y2={TY + 160} stroke={COLORS.green} strokeWidth={4} />
      <line x1={MX + 120} y1={TY} x2={MX + 120} y2={TY + 160} stroke={COLORS.green} strokeWidth={4} />
      <line x1={MX - 120} y1={TY + 160} x2={MX - 74} y2={TY + 160} stroke={COLORS.green} strokeWidth={4} />
      <line x1={MX + 120} y1={TY + 160} x2={MX + 74} y2={TY + 160} stroke={COLORS.green} strokeWidth={4} />
    </svg>
    <Meter x={MX} y={TY + 160} kind="V" />
    <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.green }}>daneben angeschlossen → parallel</div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption>Das Voltmeter wird parallel zum Bauteil angeschlossen.</Caption>
  </AbsoluteFill>
);

const AnalogieScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Eselsbrücke" title="Spannung = Wasserdruck" />
      <div style={{ opacity: f }}>
        <WaterAnalogy x={400} y={640} pressure={1} flow={1} />
      </div>
      <div style={{ position: 'absolute', left: 1050, top: 400, fontSize: 30, fontWeight: 800, color: COLORS.sky, opacity: f }}>
        Druck = Spannung U<br />Wassermenge = Stromstärke I
      </div>
      <Sfx sound="whoosh" at={16} volume={0.3} />
      <Caption delay={40}>Viel Druck treibt viel Wasser an – viel Spannung treibt viel Strom an.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Spannung" footer="gemessen mit dem Voltmeter parallel">
      Die Spannung U ist der Antrieb
      <br />
      der Quelle – Einheit Volt (V).
      <br />
      Mehr Spannung = stärkerer Antrieb.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Volt-Werte im Alltag" />
      <div style={{ display: 'flex', gap: 34, opacity: f }}>
        {[['🔋', '1,5 V', COLORS.green], ['📱', '~4 V', COLORS.sky], ['🔌', '230 V ⚠️', COLORS.red]].map((c, i) => (
          <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[2]}`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{c[0]}</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: c[2] as string, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Je höher die Spannung, desto stärker der Antrieb – und desto größer die Gefahr.</Caption>
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
  { id: 'antrieb', C: AntriebScene, min: 220 },
  { id: 'zellen', C: ZellenScene, min: 260 },
  { id: 'voltmeter', C: VoltmeterScene, min: 220 },
  { id: 'analogie', C: AnalogieScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SPANNUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Spannung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SPANNUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/spannung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
