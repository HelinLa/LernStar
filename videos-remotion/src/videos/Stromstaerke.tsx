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
import { RectWire, BatterySym, SwitchSym, Bulb } from '../circuit';
import { Meter, useFade } from '../electric';
import timings from '../narration/stromstaerke.timings.json';

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
      <div style={{ fontSize: 170, marginBottom: 20 }}>🔋➡️💡</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was ist der elektrische Strom?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Was fließt da durch die Kabel – und wie viel?
      </div>
    </AbsoluteFill>
  );
};

const BewegteScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Was fließt?" title="Bewegte Ladungen" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on />
    <Bulb x={MX} y={TY} size={110} on />
    <BatterySym x={MX} y={BY} />
    <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.amber }}>winzige Ladungen wandern durch den Draht</div>
    <Sfx sound="whoosh" at={10} volume={0.3} />
    <Caption>Elektrischer Strom besteht aus bewegten Ladungen im Draht.</Caption>
  </AbsoluteFill>
);

const StaerkeScene: React.FC<SceneProps> = () => {
  const f = useFade(20);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Wie viel?" title="Die Stromstärke I" />
      <div style={{ fontSize: 90, fontWeight: 900, opacity: f }}>
        I = <span style={{ fontSize: 44, color: COLORS.amber }}>Ladung pro Sekunde</span>
      </div>
      <div style={{ marginTop: 30, fontSize: 34, fontWeight: 800, color: COLORS.green, opacity: f }}>viele Ladungen/s → große Stromstärke</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={40}>Die Stromstärke I sagt, wie viel Ladung pro Sekunde fließt.</Caption>
    </AbsoluteFill>
  );
};

const AmpereScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Gemessen in Ampere" title="Amperemeter in Reihe" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on gapAtBottom={140} />
    <Bulb x={MX} y={TY} size={100} on />
    <Meter x={MX} y={BY} kind="A" />
    <BatterySym x={LX} y={(TY + BY) / 2} horizontal={false} />
    <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.amber }}>der Strom fließt durch das Gerät → in Reihe</div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption>Einheit Ampere (A) – das Amperemeter wird in Reihe eingebaut.</Caption>
  </AbsoluteFill>
);

const SchalterScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const open = frame > dur * 0.45;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Unterbrochen" title="Schalter auf → I = 0" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on={!open} gapAtBottom={140} />
      <Bulb x={MX} y={TY} size={110} on={!open} />
      <SwitchSym x={MX} y={BY} closed={!open} />
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 32, fontWeight: 800, color: open ? COLORS.red : COLORS.green }}>
        {open ? 'kein Strom → I = 0 A' : 'Strom fließt'}
      </div>
      <Sfx sound="pop" at={Math.round(dur * 0.45)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.45) + 6}>Offener Schalter: keine Ladung fließt, die Stromstärke ist null.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Stromstärke" footer="gemessen mit dem Amperemeter in Reihe">
      Strom besteht aus bewegten Ladungen.
      <br />
      Die Stromstärke I ist die Ladung
      <br />
      pro Sekunde – Einheit Ampere (A).
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Ampere im Alltag" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🔌', 'Ladegerät: z. B. 2 A'], ['🛡️', 'Sicherung schaltet ab']].map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Eine Sicherung schaltet ab, wenn die Stromstärke gefährlich groß wird.</Caption>
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
  { id: 'bewegte', C: BewegteScene, min: 220 },
  { id: 'staerke', C: StaerkeScene, min: 220 },
  { id: 'ampere', C: AmpereScene, min: 240 },
  { id: 'schalter', C: SchalterScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STROMSTAERKE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Stromstaerke: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STROMSTAERKE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/stromstaerke/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
