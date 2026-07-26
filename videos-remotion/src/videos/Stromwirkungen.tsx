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
import { useFade } from '../circuit';
import timings from '../narration/stromwirkungen.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// zentrale Bauteil-Bühne mit Beschriftung
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>{children}</AbsoluteFill>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 50, marginBottom: 30, fontSize: 100 }}>
        <div>💡</div><div>🔥</div><div>🧲</div><div>⚙️</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wirkungen des Stroms
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Strom siehst du nicht – aber du erkennst ihn an vier Wirkungen.
      </div>
    </AbsoluteFill>
  );
};

// Wirkungs-Szene mit Icon + glühendem Effekt
const WirkungScene: React.FC<SceneProps & { num: string; kicker: string; title: string; icon: string; color: string; note: string; caption: string }> = ({
  num,
  kicker,
  title,
  icon,
  color,
  note,
  caption,
}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 10) * 0.06;
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker={kicker} title={title} />
      <Stage>
        <div style={{ position: 'relative', opacity: f }}>
          <div style={{ position: 'absolute', inset: -80, borderRadius: '50%', background: `radial-gradient(circle, ${color}66, transparent 70%)`, transform: `scale(${pulse})` }} />
          <div style={{ fontSize: 260, transform: `scale(${pulse})` }}>{icon}</div>
        </div>
        <div style={{ marginTop: 20, fontSize: 40, fontWeight: 800, color, opacity: f }}>{note}</div>
      </Stage>
      <div style={{ position: 'absolute', left: 80, top: 120, fontSize: 120, fontWeight: 900, color: `${color}55` }}>{num}</div>
      <Sfx sound="pling" at={12} volume={0.4} />
      <Caption delay={30}>{caption}</Caption>
    </AbsoluteFill>
  );
};

const LichtScene: React.FC<SceneProps> = (p) => (
  <WirkungScene {...p} num="1" kicker="Wirkung 1" title="Licht" icon="💡" color={COLORS.amber} note="Glühdraht leuchtet" caption="Der dünne Draht in der Lampe glüht und leuchtet hell." />
);
const WaermeScene: React.FC<SceneProps> = (p) => (
  <WirkungScene {...p} num="2" kicker="Wirkung 2" title="Wärme" icon="🔥" color={COLORS.red} note="Heizdraht wird heiß" caption="Toaster, Föhn, Heizung – überall steckt die Wärmewirkung." />
);
const MagnetScene: React.FC<SceneProps> = (p) => (
  <WirkungScene {...p} num="3" kicker="Wirkung 3" title="Magnetismus" icon="🧲" color={COLORS.sky} note="Spule wird zum Magneten" caption="Strom durch eine Spule erzeugt Magnetismus – der Elektromagnet." />
);
const BewegungScene: React.FC<SceneProps> = (p) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 10) * 0.06;
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Wirkung 4" title="Bewegung" />
      <Stage>
        <div style={{ position: 'relative', opacity: f }}>
          <div style={{ position: 'absolute', inset: -80, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.green}66, transparent 70%)`, transform: `scale(${pulse})` }} />
          <div style={{ fontSize: 260, transform: `rotate(${frame * 6}deg)` }}>⚙️</div>
        </div>
        <div style={{ marginTop: 20, fontSize: 40, fontWeight: 800, color: COLORS.green, opacity: f }}>Motor dreht sich</div>
      </Stage>
      <div style={{ position: 'absolute', left: 80, top: 120, fontSize: 120, fontWeight: 900, color: `${COLORS.green}55` }}>4</div>
      <Sfx sound="pling" at={12} volume={0.4} />
      <Caption delay={30}>Der Elektromotor treibt Ventilator, Bohrmaschine und E-Auto an.</Caption>
    </AbsoluteFill>
  );
};

// ── Energieumwandlung ──────────────────────────────────────────────────
const EnergieScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Dahinter steckt" title="Energie wird umgewandelt" />
      <div style={{ display: 'flex', gap: 30, alignItems: 'center', opacity: f, fontSize: 34, fontWeight: 800 }}>
        <div style={{ padding: '20px 26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.amber}` }}>⚡ elektrische Energie</div>
        <div style={{ fontSize: 50 }}>➡️</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '10px 16px', borderRadius: 14, background: COLORS.panel }}>💡 Licht</div>
          <div style={{ padding: '10px 16px', borderRadius: 14, background: COLORS.panel }}>🔥 Wärme</div>
          <div style={{ padding: '10px 16px', borderRadius: 14, background: COLORS.panel }}>🧲 Magnet</div>
          <div style={{ padding: '10px 16px', borderRadius: 14, background: COLORS.panel }}>⚙️ Bewegung</div>
        </div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Immer wird elektrische Energie in eine andere Energieform umgewandelt.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Stromwirkungen" footer="dabei wird elektrische Energie umgewandelt">
      Strom hat vier Wirkungen:
      <br />
      Licht, Wärme,
      <br />
      Magnetismus und Bewegung.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Outro ──────────────────────────────────────────────────────────────
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
  { id: 'licht', C: LichtScene, min: 210 },
  { id: 'waerme', C: WaermeScene, min: 210 },
  { id: 'magnet', C: MagnetScene, min: 210 },
  { id: 'bewegung', C: BewegungScene, min: 210 },
  { id: 'energie', C: EnergieScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STROMWIRKUNGEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Stromwirkungen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STROMWIRKUNGEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/stromwirkungen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
