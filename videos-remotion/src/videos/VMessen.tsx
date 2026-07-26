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
import timings from '../narration/v-messen.timings.json';

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
      <div style={{ display: 'flex', gap: 70, marginBottom: 40, fontSize: 120 }}>
        <div>📏</div><div>⏱️</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie misst man Geschwindigkeit?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Du brauchst zwei Messwerte – und zwei Werkzeuge.
      </div>
    </AbsoluteFill>
  );
};

const StreckeScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Messwert 1" title="Die Strecke – mit dem Maßband" />
      <div style={{ position: 'absolute', left: 300, top: 500, width: 1300, height: 8, background: 'repeating-linear-gradient(90deg,#fbbf24 0 40px,#0b1120 40px 44px)', opacity: f }} />
      <div style={{ position: 'absolute', left: 300, top: 430, fontSize: 60, opacity: f }}>🚗</div>
      <div style={{ position: 'absolute', left: 800, top: 560, fontSize: 34, fontWeight: 900, color: COLORS.amber, opacity: f }}>Messstrecke s = 10 m</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Du legst eine feste Messstrecke fest – zum Beispiel 10 Meter.</Caption>
    </AbsoluteFill>
  );
};

const ZeitScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sec = ((frame / 30) % 4).toFixed(2);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Messwert 2" title="Die Zeit – mit Stoppuhr / Lichtschranke" />
      <div style={{ fontSize: 120, fontWeight: 900, fontFamily: 'monospace', color: COLORS.green }}>⏱️ {sec} s</div>
      <div style={{ marginTop: 20, fontSize: 30, fontWeight: 700, color: COLORS.muted }}>Lichtschranke: startet & stoppt automatisch</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.4)}>Die Zeit stoppst du mit der Uhr – noch genauer mit einer Lichtschranke.</Caption>
    </AbsoluteFill>
  );
};

const RechnenScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Ausrechnen" title="10 m in 2 s" />
      <div style={{ fontSize: 56, fontWeight: 900, opacity: f, textAlign: 'center', lineHeight: 1.6 }}>
        v = <span style={{ color: COLORS.sky }}>10 m</span> ÷ <span style={{ color: COLORS.amber }}>2 s</span> = <span style={{ color: COLORS.green }}>5 m/s</span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Strecke durch Zeit: 10 Meter durch 2 Sekunden ergibt 5 m/s.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Geschwindigkeit messen" footer="dann v = s / t berechnen">
      Strecke s mit dem Maßband,
      <br />
      Zeit t mit Stoppuhr oder Lichtschranke.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der 100-Meter-Lauf" />
      <div style={{ fontSize: 180, opacity: f }}>🏃💨⏱️</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Feste Strecke, gestoppte Zeit – die Lichtschranke misst auf die Hundertstelsekunde genau.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Genauso misst man beim Sport die Geschwindigkeit.</Caption>
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
  { id: 'strecke', C: StreckeScene, min: 220 },
  { id: 'zeit', C: ZeitScene, min: 220 },
  { id: 'rechnen', C: RechnenScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const V_MESSEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const VMessen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={V_MESSEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/v-messen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
