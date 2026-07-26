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
import timings from '../narration/bremsweg-jg9.timings.json';

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
      <div style={{ fontSize: 130, marginBottom: 20 }}>🚗🛑</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 70, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum ist der Anhalteweg so lang?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Reaktionsweg + Bremsweg = Anhalteweg.
      </div>
    </AbsoluteFill>
  );
};

const ReaktionScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Teil 1" title="Der Reaktionsweg" />
      <div style={{ position: 'absolute', left: 300, top: 460, fontSize: 80, opacity: f }}>🚗</div>
      <div style={{ position: 'absolute', left: 300, top: 600, width: 480, height: 40, borderRadius: 8, background: COLORS.amber, opacity: f }} />
      <div style={{ position: 'absolute', left: 300, top: 660, width: 480, textAlign: 'center', fontSize: 30, fontWeight: 900, color: COLORS.amber, opacity: f }}>≈ 15 m bei 50 km/h</div>
      <div style={{ position: 'absolute', left: 300, top: 380, width: 700, fontSize: 30, fontWeight: 800, color: COLORS.ink, opacity: f }}>1 Sekunde erkennen → Fuß auf die Bremse</div>
      <Sfx sound="whoosh" at={14} volume={0.3} />
      <Caption delay={30}>In der einen Sekunde bis zum Bremsen fährt das Auto ungebremst weiter.</Caption>
    </AbsoluteFill>
  );
};

const BremsScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Teil 2" title="Der Bremsweg wächst im Quadrat" />
      <div style={{ fontSize: 66, fontWeight: 900, color: COLORS.red, opacity: f }}>doppeltes Tempo → 4× Bremsweg</div>
      <div style={{ marginTop: 24, fontSize: 34, fontWeight: 800, color: COLORS.muted, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Der Bremsweg hängt vom Quadrat der Geschwindigkeit ab – nicht einfach vom Tempo.
      </div>
      <Sfx sound="impact" at={14} volume={0.35} />
      <Caption delay={40}>Verdoppelst du die Geschwindigkeit, wird der Bremsweg viermal so lang.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  const w50 = interpolate(frame, [20, 50], [0, 250], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const w100 = interpolate(frame, [40, 90], [0, 1000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleich" title="50 gegen 100 km/h" />
      <div style={{ position: 'absolute', left: 200, top: 460, opacity: f }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.green }}>50 km/h</div>
        <div style={{ marginTop: 10, width: w50, height: 46, borderRadius: 8, background: COLORS.green }} />
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 800, color: COLORS.green }}>≈ 25 m</div>
      </div>
      <div style={{ position: 'absolute', left: 200, top: 640, opacity: f }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.red }}>100 km/h</div>
        <div style={{ marginTop: 10, width: w100, height: 46, borderRadius: 8, background: COLORS.red }} />
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 800, color: COLORS.red }}>≈ 100 m — viermal so viel!</div>
      </div>
      <Sfx sound="impact" at={40} volume={0.35} />
      <Caption delay={40}>Nicht das Doppelte, sondern das Vierfache – deshalb ist Tempo so gefährlich.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Anhalteweg" footer="doppeltes Tempo = vierfacher Bremsweg">
      Anhalteweg = Reaktionsweg + Bremsweg.
      <br />
      Der Reaktionsweg wächst mit dem Tempo,
      <br />
      der Bremsweg mit dem Quadrat der Geschwindigkeit.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Sicherheit im Verkehr" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🏫', 'Tempo 30 vor Schulen'], ['📏', 'Abstand halten'], ['🚸', 'halbe Tacho-Zahl']].map((c, i) => (
          <div key={i} style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Deshalb gibt es Tempolimits – und die Faustregel für den Abstand.</Caption>
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
  { id: 'reaktion', C: ReaktionScene, min: 240 },
  { id: 'brems', C: BremsScene, min: 240 },
  { id: 'vergleich', C: VergleichScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 200 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BREMSWEG_JG9_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const BremswegJg9: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BREMSWEG_JG9_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/bremsweg-jg9/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
