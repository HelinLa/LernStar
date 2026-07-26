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
import timings from '../narration/v-begriff.timings.json';

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
      <div style={{ display: 'flex', gap: 100, marginBottom: 40, fontSize: 120 }}>
        <div style={{ transform: `translateX(${Math.sin(frame / 20) * 15}px)` }}>🐌</div>
        <div style={{ transform: `translateX(${Math.sin(frame / 6) * 40}px)` }}>🏎️</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was bedeutet Geschwindigkeit?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Was heißt „schnell" in der Physik ganz genau?
      </div>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = (frame % 90) / 90;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Gleiche Zeit, mehr Strecke" />
      <div style={{ position: 'absolute', left: 200 + p * 500, top: 400, fontSize: 80 }}>🚗</div>
      <div style={{ position: 'absolute', left: 200 + p * 1100, top: 600, fontSize: 80 }}>🏎️💨</div>
      <div style={{ position: 'absolute', left: 200, top: 500, width: 1300, height: 3, background: COLORS.border }} />
      <div style={{ position: 'absolute', left: 200, top: 720, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>nach 1 s: das schnellere ist weiter vorne</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Schneller heißt: in der gleichen Zeit eine größere Strecke zurücklegen.</Caption>
    </AbsoluteFill>
  );
};

const ZweiScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Was zählt?" title="Strecke und Zeit" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', opacity: f, fontSize: 40, fontWeight: 800 }}>
        <div style={{ padding: '24px 30px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>📏 Strecke s</div>
        <div style={{ fontSize: 50 }}>&</div>
        <div style={{ padding: '24px 30px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.amber}` }}>⏱️ Zeit t</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>viel Strecke in wenig Zeit = schnell</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Zwei Dinge bestimmen die Geschwindigkeit: die Strecke und die Zeit.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Geschwindigkeit" footer="viel Strecke in wenig Zeit = schnell">
      Die Geschwindigkeit sagt, wie schnell
      <br />
      sich etwas bewegt: mehr Strecke in
      <br />
      gleicher Zeit = schneller.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wer ist am schnellsten?" />
      <div style={{ fontSize: 180, opacity: f }}>🏃⏱️🏁</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Beim Wettrennen ist der am schnellsten, der für dieselbe Strecke die kürzeste Zeit braucht.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Ein Sprinter ist über 100 Meter viel schneller als ein Spaziergänger.</Caption>
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
  { id: 'vergleich', C: VergleichScene, min: 240 },
  { id: 'zwei', C: ZweiScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const V_BEGRIFF_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const VBegriff: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={V_BEGRIFF_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/v-begriff/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
