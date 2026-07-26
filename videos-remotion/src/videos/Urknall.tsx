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
import timings from '../narration/urknall.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// deterministische Galaxien-Positionen (kein Math.random)
const GAL = Array.from({ length: 16 }, (_, i) => ({
  a: (i * 137) % 360,
  d: 0.3 + ((i * 53) % 100) / 100 * 0.7,
}));

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 170, marginBottom: 20 }}>💥🌌</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie ist das Weltall entstanden?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Die beste Erklärung der Wissenschaft: der Urknall.
      </div>
    </AbsoluteFill>
  );
};

const UrknallScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const exp = interpolate(frame, [20, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vor 13,8 Mrd. Jahren" title="Heiß, dicht – dann Ausdehnung" />
      <div style={{ position: 'relative', width: 800, height: 500 }}>
        {GAL.map((g, i) => {
          const rad = (g.a * Math.PI) / 180;
          const R = exp * g.d * 380;
          return <div key={i} style={{ position: 'absolute', left: 400 + Math.cos(rad) * R - 20, top: 250 + Math.sin(rad) * R * 0.6 - 20, fontSize: 40, opacity: 0.4 + exp * 0.6 }}>🌌</div>;
        })}
        <div style={{ position: 'absolute', left: 380, top: 230, fontSize: 60, filter: `brightness(${2 - exp})` }}>💥</div>
      </div>
      <Sfx sound="impact" at={20} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5)}>Alles war heiß und dicht vereint – dann begann die Ausdehnung, die bis heute anhält.</Caption>
    </AbsoluteFill>
  );
};

const BeweisScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Beweis" title="Galaxien fliehen voneinander" />
      <div style={{ display: 'flex', gap: 30, alignItems: 'center', opacity: f, fontSize: 50 }}>
        <div>🌌 ⟵</div><div style={{ fontSize: 30, color: COLORS.muted }}>· · ·</div><div>⟶ 🌌</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 32, fontWeight: 800, color: COLORS.amber, opacity: f, textAlign: 'center', maxWidth: 1200 }}>
        Fast alle Galaxien entfernen sich → das Weltall wird größer → rückwärts: ein Punkt.
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Weil sich alle Galaxien voneinander entfernen, war früher alles an einem Punkt.</Caption>
    </AbsoluteFill>
  );
};

const BallonScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const size = interpolate(frame, [15, dur - 20], [180, 420], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Das Bild dazu" title="Der Luftballon" />
      <div style={{ position: 'relative', width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #f472b6, #be185d)' }}>
        {GAL.slice(0, 8).map((g, i) => {
          const rad = (g.a * Math.PI) / 180;
          return <div key={i} style={{ position: 'absolute', left: size / 2 + Math.cos(rad) * size * 0.42 - 12, top: size / 2 + Math.sin(rad) * size * 0.42 - 12, fontSize: 24 }}>⚫</div>;
        })}
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 700, color: COLORS.muted, maxWidth: 1200, textAlign: 'center' }}>der Raum selbst wird größer – kein Punkt ist der Mittelpunkt</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Wie Punkte auf einem Ballon: Bläst man ihn auf, entfernen sich alle voneinander.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Urknall" footer="Beweis: Galaxien entfernen sich">
      Das Weltall begann vor ca. 13,8 Mrd.
      <br />
      Jahren heiß und dicht – und dehnt
      <br />
      sich seitdem aus.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Sternenstaub" />
      <div style={{ fontSize: 150, opacity: f }}>💥 → ⚛️ → ⭐ → 🌍 → 🧍</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Die Bausteine in deinem Körper wurden einst im Inneren von Sternen geschmiedet.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Aus dem heißen Anfang entstanden Atome, Sterne, Planeten – und Leben.</Caption>
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
  { id: 'urknall', C: UrknallScene, min: 260 },
  { id: 'beweis', C: BeweisScene, min: 240 },
  { id: 'ballon', C: BallonScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const URKNALL_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Urknall: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={URKNALL_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/urknall/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
