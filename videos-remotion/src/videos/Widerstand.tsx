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
import { ResistorSym, useFade } from '../electric';
import timings from '../narration/widerstand.timings.json';

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
      <div style={{ fontSize: 150, marginBottom: 20 }}>⚡🛑</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was ist ein Widerstand?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Jedes Bauteil bremst den Strom ein bisschen.
      </div>
    </AbsoluteFill>
  );
};

const BremseScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const big = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Bremse" title="Großer R → kleiner Strom" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on dots={big ? 4 : 14} />
      <Bulb x={MX} y={TY} size={big ? 80 : 120} on />
      <ResistorSym x={MX} y={BY} w={big ? 180 : 90} label={big ? 'großer R' : 'kleiner R'} color={big ? COLORS.red : COLORS.sky} />
      <BatterySym x={LX} y={(TY + BY) / 2} horizontal={false} />
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 30, fontWeight: 800, color: big ? COLORS.red : COLORS.green }}>{big ? 'stark gebremst → dunkel' : 'kaum gebremst → hell'}</div>
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Bei gleicher Spannung: großer Widerstand lässt nur wenig Strom durch.</Caption>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Berechnen" title="R = U / I" />
      <div style={{ fontSize: 130, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.sky }}>R</span> = <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', fontSize: 70 }}>
          <span style={{ borderBottom: `5px solid ${COLORS.ink}`, padding: '0 20px', color: COLORS.green }}>U (Spannung)</span>
          <span style={{ padding: '0 20px', color: COLORS.amber }}>I (Stromstärke)</span>
        </span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Miss U und I – dann kennst du den Widerstand R.</Caption>
    </AbsoluteFill>
  );
};

const OhmScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Einheit" title="Das Ohm (Ω)" />
      <div style={{ fontSize: 80, fontWeight: 900, color: COLORS.sky, opacity: f }}>1 Ω: bei 1 V fließt 1 A</div>
      <div style={{ marginTop: 30, fontSize: 130, fontWeight: 900, color: COLORS.amber, opacity: f }}>Ω</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Ein Ohm heißt: bei einem Volt fließt genau ein Ampere.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Widerstand" footer="großer Widerstand → kleiner Strom">
      Der Widerstand R bremst den Strom.
      <br />
      R = U / I – Einheit Ohm (Ω).
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Glühdraht vs. Kupferkabel" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['💡', 'Glühdraht: großer R → glüht'], ['🔌', 'Kupferkabel: winziger R → leitet']].map((c, i) => (
          <div key={i} style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${i === 0 ? COLORS.red : COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der große Widerstand im Glühdraht macht ihn heiß – Kupfer leitet fast verlustfrei.</Caption>
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
  { id: 'bremse', C: BremseScene, min: 240 },
  { id: 'formel', C: FormelScene, min: 220 },
  { id: 'ohm', C: OhmScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WIDERSTAND_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Widerstand: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WIDERSTAND_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/widerstand/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
