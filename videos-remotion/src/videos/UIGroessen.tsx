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
import { Meter, WaterAnalogy, useFade } from '../electric';
import timings from '../narration/u-i-groessen.timings.json';

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
      <div style={{ display: 'flex', gap: 60, marginBottom: 30, fontSize: 120, fontWeight: 900 }}>
        <div style={{ color: COLORS.green }}>U</div><div style={{ color: COLORS.muted }}>&</div><div style={{ color: COLORS.amber }}>I</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Spannung U & Stromstärke I
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Die zwei wichtigsten Größen – nie mehr verwechseln.
      </div>
    </AbsoluteFill>
  );
};

const GroesseCard: React.FC<{ letter: string; name: string; desc: string; unit: string; meter: 'A' | 'V'; anschluss: string; color: string }> = ({ letter, name, desc, unit, meter, anschluss, color }) => (
  <div style={{ width: 560, padding: '40px 30px', borderRadius: 26, background: COLORS.panel, border: `3px solid ${color}`, textAlign: 'center', position: 'relative' }}>
    <div style={{ fontSize: 90, fontWeight: 900, color }}>{letter}</div>
    <div style={{ fontSize: 36, fontWeight: 800, marginTop: 4 }}>{name}</div>
    <div style={{ fontSize: 26, fontWeight: 600, color: COLORS.muted, marginTop: 10 }}>{desc}</div>
    <div style={{ fontSize: 32, fontWeight: 900, color, marginTop: 14 }}>Einheit: {unit}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>Messgerät: {meter === 'A' ? 'Amperemeter' : 'Voltmeter'} ({anschluss})</div>
  </div>
);

const SpannungScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Größe 1" title="Die Spannung U" />
      <div style={{ opacity: f }}>
        <GroesseCard letter="U" name="Spannung" desc="der Antrieb (Druck)" unit="Volt (V)" meter="V" anschluss="parallel" color={COLORS.green} />
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Spannung U ist der Antrieb – Einheit Volt, Voltmeter parallel.</Caption>
    </AbsoluteFill>
  );
};

const StromScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Größe 2" title="Die Stromstärke I" />
      <div style={{ opacity: f }}>
        <GroesseCard letter="I" name="Stromstärke" desc="Ladungsmenge pro Zeit" unit="Ampere (A)" meter="A" anschluss="in Reihe" color={COLORS.amber} />
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Stromstärke I ist die Ladung pro Zeit – Einheit Ampere, Amperemeter in Reihe.</Caption>
    </AbsoluteFill>
  );
};

const AnalogieScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Eselsbrücke" title="Wasser: Druck & Menge" />
      <div style={{ opacity: f }}>
        <WaterAnalogy x={400} y={640} pressure={1} flow={1} />
      </div>
      <div style={{ position: 'absolute', left: 1050, top: 400, fontSize: 32, fontWeight: 800, opacity: f }}>
        <span style={{ color: COLORS.green }}>Druck = Spannung U</span><br />
        <span style={{ color: COLORS.amber }}>Wassermenge = Stromstärke I</span>
      </div>
      <Sfx sound="whoosh" at={16} volume={0.3} />
      <Caption delay={40}>Viel Druck treibt viel Wasser an – viel Spannung treibt viel Strom an.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="U & I" footer="Wasser: Druck = U, Menge = I">
      U = Spannung, Volt, Voltmeter parallel.
      <br />
      I = Stromstärke, Ampere,
      <br />
      Amperemeter in Reihe.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Auf jedem Gerät" />
      <div style={{ fontSize: 170, opacity: f }}>🔌 5V ⎓ 2A</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Volt für die Spannung, Ampere für die Stromstärke – beide Werte stehen drauf.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Wer U und I versteht, versteht die halbe Elektrizitätslehre.</Caption>
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
  { id: 'spannung', C: SpannungScene, min: 220 },
  { id: 'strom', C: StromScene, min: 220 },
  { id: 'analogie', C: AnalogieScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const U_I_GROESSEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const UIGroessen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={U_I_GROESSEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/u-i-groessen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
