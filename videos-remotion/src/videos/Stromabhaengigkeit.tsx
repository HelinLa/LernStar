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
import timings from '../narration/stromabhaengigkeit.timings.json';

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
      <div style={{ fontSize: 150, marginBottom: 20 }}>⚡ vs 🛑</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wovon hängt die Stromstärke ab?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Zwei Größen – Antrieb und Bremse – entscheiden.
      </div>
    </AbsoluteFill>
  );
};

const SpannungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const more = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Größe 1: Antrieb" title="Mehr Spannung → mehr Strom" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on dots={more ? 18 : 8} />
      <Bulb x={MX} y={TY} size={more ? 130 : 90} on />
      <BatterySym x={MX} y={BY} label={more ? 'viel U' : 'wenig U'} />
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 32, fontWeight: 800, color: COLORS.green }}>{more ? 'U ↑ → I ↑' : 'wenig Antrieb'}</div>
      <Sfx sound="pling" at={Math.round(dur * 0.5)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Mehr Spannung heißt mehr Antrieb – also mehr Stromstärke.</Caption>
    </AbsoluteFill>
  );
};

const WiderstandScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const big = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Größe 2: Bremse" title="Mehr Widerstand → weniger Strom" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on dots={big ? 4 : 14} />
      <Bulb x={MX} y={TY} size={big ? 80 : 120} on />
      <ResistorSym x={MX} y={BY} w={big ? 180 : 100} label={big ? 'großer R' : 'kleiner R'} color={big ? COLORS.red : COLORS.sky} />
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 32, fontWeight: 800, color: big ? COLORS.red : COLORS.green }}>{big ? 'R ↑ → I ↓' : 'kaum gebremst'}</div>
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Mehr Widerstand bremst den Strom – also weniger Stromstärke.</Caption>
    </AbsoluteFill>
  );
};

const ZusammenScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beides zusammen" title="Vorschau: das Ohmsche Gesetz" />
      <div style={{ fontSize: 110, fontWeight: 900, opacity: f }}>
        I = <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', fontSize: 60 }}>
          <span style={{ borderBottom: `5px solid ${COLORS.ink}`, padding: '0 20px', color: COLORS.green }}>U (Antrieb)</span>
          <span style={{ padding: '0 20px', color: COLORS.red }}>R (Bremse)</span>
        </span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Viel Strom fließt bei hoher Spannung und kleinem Widerstand: I = U ÷ R.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Stromstärke hängt ab von …" footer="Vorbereitung: Ohmsches Gesetz I = U/R">
      Mehr Spannung → mehr Strom.
      <br />
      Mehr Widerstand → weniger Strom.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Dünner Draht & Dimmer" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🧵', 'dünner Draht: großer R → wenig Strom'], ['🎛️', 'Dimmer regelt über den Widerstand']].map((c, i) => (
          <div key={i} style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{c[0]}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Mit einem Dimmer stellst du über den Widerstand die Helligkeit ein.</Caption>
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
  { id: 'spannung', C: SpannungScene, min: 240 },
  { id: 'widerstand', C: WiderstandScene, min: 240 },
  { id: 'zusammen', C: ZusammenScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STROMABHAENGIGKEIT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Stromabhaengigkeit: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STROMABHAENGIGKEIT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/stromabhaengigkeit/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
