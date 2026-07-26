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
import { RectWire, BatterySym } from '../circuit';
import { ResistorSym, useFade } from '../electric';
import timings from '../narration/reihe-widerstand.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const LX = 560, RX = 1360, TY = 360, BY = 740;

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 130, marginBottom: 20 }}>▭➖▭</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Widerstände in Reihe
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Zwei Bremsen hintereinander – was ergibt der Gesamtwiderstand?
      </div>
    </AbsoluteFill>
  );
};

const AddierenScene: React.FC<SceneProps> = () => {
  const f = useFade(30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Regel" title="Widerstände addieren sich" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on />
      <ResistorSym x={820} y={TY} label="R₁" color={COLORS.sky} />
      <ResistorSym x={1100} y={TY} label="R₂" color={COLORS.indigo} />
      <BatterySym x={(LX + RX) / 2} y={BY} />
      <div style={{ position: 'absolute', left: 640, top: 780, fontSize: 46, fontWeight: 900, color: COLORS.amber, opacity: f }}>R_ges = R₁ + R₂</div>
      <Sfx sound="pling" at={30} volume={0.4} />
      <Caption delay={40}>In Reihe addieren sich die Widerstände zum Gesamtwiderstand.</Caption>
    </AbsoluteFill>
  );
};

const StromScene: React.FC<SceneProps> = () => {
  const lab = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Strom" title="Überall gleich groß" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on dots={12} />
      <ResistorSym x={820} y={TY} label="R₁" color={COLORS.sky} />
      <ResistorSym x={1100} y={TY} label="R₂" color={COLORS.indigo} />
      <BatterySym x={(LX + RX) / 2} y={BY} />
      <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 30, fontWeight: 800, color: COLORS.green, opacity: lab }}>ein Weg → gleiche Stromstärke I überall</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={30}>Es gibt nur einen Weg – durch beide Widerstände fließt derselbe Strom.</Caption>
    </AbsoluteFill>
  );
};

const SpannungScene: React.FC<SceneProps> = () => {
  const lab = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Spannung" title="Teilt sich auf" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on />
      <ResistorSym x={820} y={TY} label="U₁" color={COLORS.sky} />
      <ResistorSym x={1100} y={TY} label="U₂" color={COLORS.indigo} />
      <BatterySym x={(LX + RX) / 2} y={BY} label="U_ges" />
      <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: lab }}>U₁ + U₂ = U_ges · am größeren R fällt mehr ab</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Die Teilspannungen addieren sich zur Gesamtspannung – am größeren R fällt mehr ab.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Reihenschaltung" footer="R_ges = R₁ + R₂">
      Widerstände in Reihe addieren sich.
      <br />
      Strom überall gleich,
      <br />
      Teilspannungen addieren sich.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Vorwiderstand" />
      <div style={{ fontSize: 170, opacity: f }}>🔴➖💡</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Ein Widerstand in Reihe begrenzt den Strom – so schützt man eine empfindliche LED.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der Vorwiderstand begrenzt den Strom gezielt.</Caption>
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
  { id: 'addieren', C: AddierenScene, min: 240 },
  { id: 'strom', C: StromScene, min: 220 },
  { id: 'spannung', C: SpannungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const REIHE_WIDERSTAND_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const ReiheWiderstand: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={REIHE_WIDERSTAND_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/reihe-widerstand/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
