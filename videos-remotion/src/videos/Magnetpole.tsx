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
import { BarMagnet, useFade } from '../magnet';
import timings from '../narration/magnetpole.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const wob = Math.sin(frame / 12) * 20;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ marginBottom: 40, position: 'relative', width: 700, height: 160 }}>
        <BarMagnet cx={280 - wob} cy={80} w={240} h={90} />
        <BarMagnet cx={480 + wob} cy={80} w={240} h={90} nRight={false} />
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 78, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie wirken Magnetpole?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Anziehen oder abstoßen – wovon hängt es ab?
      </div>
    </AbsoluteFill>
  );
};

// ── Gleiche Pole: abstoßen ─────────────────────────────────────────────
const GleichScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // versuche zusammenzudrücken, sie federn zurück
  const push = interpolate(frame % 90, [0, 30, 60, 90], [200, 90, 90, 200]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Versuch 1" title="Gleiche Pole stoßen sich ab" />
      {/* N rechts | N links → N–N in der Mitte */}
      <BarMagnet cx={960 - push} cy={520} w={300} h={110} nRight />
      <BarMagnet cx={960 + push} cy={520} w={300} h={110} nRight={false} />
      <div style={{ position: 'absolute', left: 920, top: 380, fontSize: 70 }}>💥</div>
      <div style={{ position: 'absolute', left: 640, top: 680, fontSize: 50, color: COLORS.red }}>⬅️</div>
      <div style={{ position: 'absolute', left: 1230, top: 680, fontSize: 50, color: COLORS.red }}>➡️</div>
      <div style={{ position: 'absolute', left: 820, top: 300, fontSize: 34, fontWeight: 800, color: COLORS.red }}>N ↔ N</div>
      <Sfx sound="pop" at={30} volume={0.36} />
      <Caption>Nord gegen Nord: eine unsichtbare Kraft drückt sie auseinander.</Caption>
    </AbsoluteFill>
  );
};

// ── Ungleiche Pole: anziehen ───────────────────────────────────────────
const UngleichScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const off = interpolate(t, [0, 1], [220, 32]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Versuch 2" title="Ungleiche Pole ziehen sich an" />
      {/* N rechts | S links → N–S in der Mitte */}
      <BarMagnet cx={960 - off} cy={520} w={300} h={110} nRight />
      <BarMagnet cx={960 + off} cy={520} w={300} h={110} nRight />
      <div style={{ position: 'absolute', left: 920, top: 390, fontSize: 70, opacity: t }}>🧲</div>
      <div style={{ position: 'absolute', left: 700, top: 680, fontSize: 50, color: COLORS.green }}>➡️</div>
      <div style={{ position: 'absolute', left: 1170, top: 680, fontSize: 50, color: COLORS.green }}>⬅️</div>
      <div style={{ position: 'absolute', left: 820, top: 300, fontSize: 34, fontWeight: 800, color: COLORS.green }}>N ↔ S</div>
      <Sfx sound="impact" at={48} volume={0.4} />
      <Caption delay={52}>Nord und Süd springen zusammen – klick.</Caption>
    </AbsoluteFill>
  );
};

// ── Abstand: Kraft vs. Abstand ─────────────────────────────────────────
const AbstandScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [20, dur - 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const gap = interpolate(t, [0, 1], [380, 60]);
  // Kraftbalken wächst, wenn Abstand klein
  const force = interpolate(gap, [60, 380], [1, 0.12]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Wie stark?" title="Nah = stark, fern = schwach" />
      <BarMagnet cx={960 - gap / 2 - 150} cy={470} w={280} h={100} nRight />
      <BarMagnet cx={960 + gap / 2 + 150} cy={470} w={280} h={100} nRight={false} />
      {/* Kraftmesser-Balken */}
      <div style={{ position: 'absolute', left: 460, top: 720, width: 1000, height: 46, borderRadius: 12, background: COLORS.panel, border: `1px solid ${COLORS.border}` }} />
      <div style={{ position: 'absolute', left: 460, top: 720, width: 1000 * force, height: 46, borderRadius: 12, background: `linear-gradient(90deg,#22c55e,#ef4444)` }} />
      <div style={{ position: 'absolute', left: 460, top: 776, fontSize: 28, fontWeight: 800, color: COLORS.amber }}>Kraft: {Math.round(force * 100)} %</div>
      <div style={{ position: 'absolute', left: 1200, top: 776, fontSize: 28, fontWeight: 700, color: COLORS.muted }}>Abstand: {Math.round(gap)} px</div>
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.55)}>Je kleiner der Abstand, desto größer die Kraft.</Caption>
    </AbsoluteFill>
  );
};

// ── Beispiel ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 380, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const BeispielScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Beispiel" title="Anziehen & Abstoßen im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="🚪🧲" title="Schranktür hält (anziehen)" delay={10} />
        <TCard icon="💍🌀" title="Schwebe-Ringe (abstoßen)" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Möbelmagnet zieht an – Schwebe-Ringe stoßen sich ab.</Caption>
  </AbsoluteFill>
);

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Magnetpole" footer="je kleiner der Abstand, desto größer die Kraft">
      Gleiche Pole stoßen sich ab,
      <br />
      ungleiche Pole
      <br />
      ziehen sich an.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Pole bei der Arbeit" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="⚙️" title="Elektromotor" delay={10} />
        <TCard icon="🔊" title="Lautsprecher" delay={30} />
        <TCard icon="🚄" title="Magnetschwebebahn" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall arbeiten Nord- und Südpol gegeneinander.</Caption>
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
  { id: 'gleich', C: GleichScene, min: 240 },
  { id: 'ungleich', C: UngleichScene, min: 240 },
  { id: 'abstand', C: AbstandScene, min: 260 },
  { id: 'beispiel', C: BeispielScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MAGNETPOLE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Magnetpole: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNETPOLE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/magnetpole/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
