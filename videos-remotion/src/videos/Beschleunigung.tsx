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
import { useFade } from '../astro';
import timings from '../narration/beschleunigung.timings.json';

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
      <div style={{ display: 'flex', gap: 80, marginBottom: 40, fontSize: 120 }}>
        <div style={{ transform: `translateX(${((frame * frame) / 200) % 60 - 30}px)` }}>🏎️</div>
        <div>🚚</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Beschleunigung: a = Δv / Δt
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie schnell ändert sich das Tempo?
      </div>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Formel" title="Tempoänderung durch Zeit" />
      <div style={{ fontSize: 120, fontWeight: 900, opacity: f }}>
        a = <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', fontSize: 60 }}>
          <span style={{ borderBottom: `5px solid ${COLORS.ink}`, padding: '0 20px', color: COLORS.sky }}>Δv (Tempoänderung)</span>
          <span style={{ padding: '0 20px', color: COLORS.amber }}>Δt (Zeit)</span>
        </span>
      </div>
      <div style={{ marginTop: 30, fontSize: 34, fontWeight: 800, color: COLORS.green, opacity: f }}>Einheit: m/s²</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Beschleunigung ist die Geschwindigkeitsänderung geteilt durch die Zeit.</Caption>
    </AbsoluteFill>
  );
};

const PositivScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const carX = 200 + Math.min(1400, (frame * frame) / 6);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Schneller werden" title="Positive Beschleunigung" />
      <div style={{ position: 'absolute', left: carX, top: 440, fontSize: 90 }}>🏎️💨</div>
      <div style={{ position: 'absolute', left: 300, top: 620, fontSize: 34, fontWeight: 800, color: COLORS.green }}>0 → 10 m/s in 5 s → a = 2 m/s²</div>
      <div style={{ position: 'absolute', left: 300, top: 690, fontSize: 26, fontWeight: 700, color: COLORS.muted }}>jede Sekunde +2 m/s dazu</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Ein Auto von 0 auf 10 m/s in 5 s: a = 2 m/s².</Caption>
    </AbsoluteFill>
  );
};

const NegativScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const speed = Math.max(0, 1 - frame / 60);
  const carX = 1400 - (1 - speed * speed) * 1000;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Langsamer werden" title="Negative Beschleunigung (Bremsen)" />
      <div style={{ position: 'absolute', left: carX, top: 440, fontSize: 90 }}>🚗🛑</div>
      <div style={{ position: 'absolute', left: 300, top: 620, fontSize: 34, fontWeight: 800, color: COLORS.red }}>Δv negativ → a negativ = Verzögerung</div>
      <Sfx sound="impact" at={10} volume={0.34} />
      <Caption delay={Math.round(dur * 0.4)}>Beim Bremsen nimmt v ab – die Beschleunigung ist negativ.</Caption>
    </AbsoluteFill>
  );
};

const StartScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Aus dem Stand" title="Zwei nützliche Formeln" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        <div style={{ padding: '30px 40px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, fontSize: 50, fontWeight: 900 }}>v = a · t</div>
        <div style={{ padding: '30px 40px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 50, fontWeight: 900 }}>s = ½ · a · t²</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>je länger beschleunigt, desto schneller & weiter</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Aus dem Stand wächst v mit a·t und die Strecke mit ½·a·t².</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Beschleunigung" footer="Einheit m/s²">
      a = Δv / Δt (Tempoänderung durch Zeit).
      <br />
      Positiv = schneller werden,
      <br />
      negativ = bremsen.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="0 auf 100 & freier Fall" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🏎️', '0 auf 100 km/h'], ['🍎⬇️', 'freier Fall: ~10 m/s²']].map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Die Schwerkraft beschleunigt jeden Körper gleich stark – mit etwa 10 m/s².</Caption>
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
  { id: 'positiv', C: PositivScene, min: 240 },
  { id: 'negativ', C: NegativScene, min: 220 },
  { id: 'start', C: StartScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BESCHLEUNIGUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Beschleunigung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BESCHLEUNIGUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/beschleunigung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
