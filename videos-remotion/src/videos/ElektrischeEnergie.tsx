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
import { useFade } from '../electric';
import timings from '../narration/elektrische-energie.timings.json';

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
      <div style={{ fontSize: 150, marginBottom: 20 }}>🔋⏱️</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Elektrische Energie: E = P · t
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie viel Energie verbraucht ein Gerät insgesamt?
      </div>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Formel" title="Leistung × Zeit" />
      <div style={{ fontSize: 140, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.sky }}>E</span> = <span style={{ color: COLORS.red }}>P</span> · <span style={{ color: COLORS.amber }}>t</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 700, color: COLORS.muted, opacity: f }}>hohe Leistung + lange Zeit = viel Energie</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Die verbrauchte Energie ist Leistung mal Zeit.</Caption>
    </AbsoluteFill>
  );
};

const EinheitScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Einheit" title="Kilowattstunde (kWh)" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', opacity: f, fontSize: 44, fontWeight: 900 }}>
        <div style={{ padding: '26px 34px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>1 kWh</div>
        <div style={{ fontSize: 40, color: COLORS.amber }}>=</div>
        <div style={{ padding: '26px 34px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}` }}>1000 Wh</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>Energie eines 1000-W-Geräts in 1 Stunde</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Eine Kilowattstunde sind tausend Wattstunden.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Rechnen" title="Wasserkocher: 2 kW · 0,5 h" />
      <div style={{ fontSize: 56, fontWeight: 900, opacity: f, textAlign: 'center', lineHeight: 1.6 }}>
        <span style={{ color: COLORS.red }}>2 kW</span> · <span style={{ color: COLORS.amber }}>0,5 h</span> = <span style={{ color: COLORS.sky }}>1 kWh</span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>2 Kilowatt mal eine halbe Stunde ergibt 1 Kilowattstunde.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Elektrische Energie" footer="1 kWh = 1000 Wh">
      E = P · t – Leistung mal Zeit.
      <br />
      Einheit: Wattstunde bzw. Kilowattstunde.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Dauerläufer gewinnt" />
      <div style={{ fontSize: 170, opacity: f }}>❄️🔌</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Ein Kühlschrank läuft rund um die Uhr – und verbraucht am Ende oft mehr als ein starkes Gerät, das nur kurz an ist.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Kleine Leistung, aber lange Zeit – das summiert sich.</Caption>
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
  { id: 'beispiel', C: BeispielScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ELEKTRISCHE_ENERGIE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const ElektrischeEnergie: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ELEKTRISCHE_ENERGIE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/elektrische-energie/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
