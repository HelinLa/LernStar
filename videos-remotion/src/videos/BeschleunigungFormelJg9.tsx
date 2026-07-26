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
import { useFade } from '../forces';
import timings from '../narration/beschleunigung-formel-jg9.timings.json';

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
      <div style={{ fontSize: 130, marginBottom: 20 }}>🏎️📈</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 74, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Beschleunigung in Zahlen
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie stark ändert sich das Tempo pro Sekunde?
      </div>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Formel" title="a = Δv / Δt" />
      <div style={{ fontSize: 120, fontWeight: 900, opacity: f }}>
        a = <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', fontSize: 62 }}>
          <span style={{ borderBottom: `5px solid ${COLORS.ink}`, padding: '0 20px', color: COLORS.sky }}>Δv (Tempoänderung)</span>
          <span style={{ padding: '0 20px', color: COLORS.amber }}>Δt (Zeit)</span>
        </span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Δv ist der Unterschied zwischen End- und Anfangsgeschwindigkeit.</Caption>
    </AbsoluteFill>
  );
};

const EinheitScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Einheit" title="Meter pro Sekunde zum Quadrat" />
      <div style={{ fontSize: 84, fontWeight: 900, color: COLORS.green, opacity: f }}>m/s²</div>
      <div style={{ marginTop: 24, fontSize: 34, fontWeight: 800, color: COLORS.ink, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        3 m/s² heißt: In jeder Sekunde kommen 3 m/s an Geschwindigkeit dazu.
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Die Einheit sagt, wie viel Tempo pro Sekunde hinzukommt.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(18);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beispiel" title="0 auf 20 m/s in 5 s" />
      <div style={{ opacity: f, textAlign: 'center' }}>
        <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.muted }}>Δv = 20 m/s · · · Δt = 5 s</div>
        <div style={{ marginTop: 22, fontSize: 60, fontWeight: 900, color: COLORS.amber }}>a = 20 m/s ÷ 5 s = 4 m/s²</div>
      </div>
      <Sfx sound="pling" at={18} volume={0.45} />
      <Caption delay={40}>20 Meter pro Sekunde geteilt durch 5 Sekunden ergibt 4 Meter pro Sekunde zum Quadrat.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Beschleunigung berechnen" footer="sagt, wie viel Tempo pro Sekunde dazukommt">
      a = Δv / Δt
      <br />
      (Geschwindigkeitsänderung durch Zeit).
      <br />
      Einheit: Meter pro Sekunde zum Quadrat.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Von 0 auf 100" />
      <div style={{ fontSize: 150, opacity: f }}>🏎️ · ⏱️</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        „Von null auf hundert in wenigen Sekunden" – je kleiner die Zeit, desto größer die Beschleunigung.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Genau das geben Autohersteller als Beschleunigung an.</Caption>
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
  { id: 'formel', C: FormelScene, min: 240 },
  { id: 'einheit', C: EinheitScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BESCHLEUNIGUNG_FORMEL_JG9_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const BeschleunigungFormelJg9: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BESCHLEUNIGUNG_FORMEL_JG9_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/beschleunigung-formel-jg9/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
