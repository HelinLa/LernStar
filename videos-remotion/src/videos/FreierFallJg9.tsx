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
import timings from '../narration/freier-fall-jg9.timings.json';

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
      <div style={{ fontSize: 120, marginBottom: 20 }}>🪨🪶</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 70, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Fällt Schweres schneller?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Der freie Fall – und was dabei wirklich zählt.
      </div>
    </AbsoluteFill>
  );
};

const IdeeScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [20, dur - 30], [180, 720], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Idee" title="Alle fallen gleich schnell" />
      <div style={{ position: 'absolute', left: 700, top: y, fontSize: 80 }}>🪨</div>
      <div style={{ position: 'absolute', left: 1080, top: y, fontSize: 80 }}>⚽</div>
      <div style={{ position: 'absolute', left: 300, top: 820, right: 300, height: 6, background: COLORS.muted }} />
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Schwerer wird stärker angezogen, ist aber auch träger – beides gleicht sich genau aus.</Caption>
    </AbsoluteFill>
  );
};

const GScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Fallbeschleunigung" title="g ≈ 9,8 m/s²" />
      <div style={{ fontSize: 100, fontWeight: 900, color: COLORS.green, opacity: f }}>g ≈ 9,8 m/s²</div>
      <div style={{ marginTop: 24, fontSize: 34, fontWeight: 800, color: COLORS.ink, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        In jeder Sekunde wird der fallende Körper um etwa 10 m/s schneller.
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Die Erde beschleunigt alle Körper gleich stark – ganz egal, wie schwer.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  const rows = [
    ['nach 1 s', '≈ 10 m/s'],
    ['nach 2 s', '≈ 20 m/s'],
    ['nach 3 s', '≈ 30 m/s'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beispiel" title="Jede Sekunde +10 m/s" />
      <div style={{ opacity: f, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rows.map((r, i) => {
          const rf = interpolate(frame, [24 + i * 16, 40 + i * 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: rf }}>
              <div style={{ width: 200, fontSize: 32, fontWeight: 800, color: COLORS.amber }}>{r[0]}</div>
              <div style={{ width: 60 + i * 200, height: 34, borderRadius: 8, background: COLORS.green }} />
              <div style={{ fontSize: 34, fontWeight: 900, color: COLORS.green }}>{r[1]}</div>
            </div>
          );
        })}
      </div>
      <Sfx sound="pop" at={24} volume={0.3} />
      <Caption delay={40}>Die Geschwindigkeit wächst gleichmäßig – der freie Fall ist eine beschleunigte Bewegung.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Freier Fall" footer="g ≈ 9,8 m/s²">
      Im freien Fall wirkt nur die Schwerkraft.
      <br />
      Alle Körper fallen gleich schnell,
      <br />
      unabhängig von ihrer Masse.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Beweis & Alltag" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🌙', 'Feder & Hammer auf dem Mond'], ['🤸', 'Bungee-Sprung'], ['🎈', 'Fallturm im Park']].map((c, i) => (
          <div key={i} style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{c[0]}</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Ohne Luft landen Feder und Hammer gemeinsam – das haben Astronauten gezeigt.</Caption>
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
  { id: 'idee', C: IdeeScene, min: 260 },
  { id: 'g', C: GScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const FREIER_FALL_JG9_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const FreierFallJg9: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={FREIER_FALL_JG9_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/freier-fall-jg9/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
