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
import { Sun, Orbit, useFade } from '../astro';
import timings from '../narration/jahreszeiten.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Erde mit geneigter Achse (Achse zeigt immer nach rechts-oben).
const TiltedEarth: React.FC<{ x: number; y: number; r: number; steep?: 'sommer' | 'winter' | null }> = ({ x, y, r, steep }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#4ade80,#1d4ed8)' }} />
    {/* Achse, 23.5° geneigt, zeigt immer gleich */}
    <svg viewBox={`0 0 ${r * 2} ${r * 2}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
      <line x1={r - r * 0.4} y1={r * 2 + r * 0.4} x2={r + r * 0.4} y2={-r * 0.4} stroke={COLORS.ink} strokeWidth={4} strokeDasharray="6 6" />
      <text x={r + r * 0.5} y={-r * 0.35} fontSize={22} fill={COLORS.muted} fontWeight="bold">N</text>
    </svg>
  </div>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 60, marginBottom: 40, fontSize: 110 }}>
        <div>🌸</div><div>☀️</div><div>🍂</div><div>❄️</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie entstehen die Jahreszeiten?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Liegt es wirklich am Abstand zur Sonne? Nein!
      </div>
    </AbsoluteFill>
  );
};

// ── Achse ──────────────────────────────────────────────────────────────
const AchseScene: React.FC<SceneProps> = () => {
  const lab = useFade(30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Schlüssel" title="Die geneigte Erdachse" />
      <TiltedEarth x={960} y={560} r={200} />
      <div style={{ position: 'absolute', left: 1240, top: 420, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: lab }}>Achse ≈ 23,5° geneigt</div>
      <div style={{ position: 'absolute', left: 1240, top: 490, fontSize: 26, fontWeight: 700, color: COLORS.muted, opacity: lab }}>zeigt immer gleiche Richtung</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={40}>Die Erdachse ist geneigt und zeigt das ganze Jahr in dieselbe Richtung.</Caption>
    </AbsoluteFill>
  );
};

// ── Sommer ─────────────────────────────────────────────────────────────
const SommerScene: React.FC<SceneProps> = () => {
  const p = useFade(10, 30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Nordhalbkugel" title="Sommer: steiles Licht" />
      <Sun x={300} y={540} r={80} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: p }} viewBox="0 0 1920 1080">
        {[440, 500, 560].map((y, i) => <line key={i} x1={400} y1={y} x2={1000} y2={y - 30} stroke="#fbbf24" strokeWidth={5} />)}
      </svg>
      <TiltedEarth x={1200} y={540} r={190} />
      <div style={{ position: 'absolute', left: 1060, top: 300, fontSize: 30, fontWeight: 800, color: COLORS.red }}>☀️ steil → gebündelt → warm</div>
      <div style={{ position: 'absolute', left: 1080, top: 780, fontSize: 26, fontWeight: 700, color: COLORS.amber }}>lange Tage</div>
      <Sfx sound="pling" at={10} volume={0.4} />
      <Caption>Nordhalbkugel zur Sonne geneigt: Das Licht trifft steil und bündelt sich – warm.</Caption>
    </AbsoluteFill>
  );
};

// ── Winter ─────────────────────────────────────────────────────────────
const WinterScene: React.FC<SceneProps> = () => {
  const p = useFade(10, 30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Nordhalbkugel" title="Winter: flaches Licht" />
      <Sun x={300} y={540} r={80} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: p }} viewBox="0 0 1920 1080">
        {[500, 560, 620].map((y, i) => <line key={i} x1={400} y1={y} x2={1050} y2={y + 90} stroke="#93c5fd" strokeWidth={5} />)}
      </svg>
      <TiltedEarth x={1220} y={560} r={190} />
      <div style={{ position: 'absolute', left: 1040, top: 300, fontSize: 30, fontWeight: 800, color: COLORS.sky }}>❄️ flach → verteilt → kühl</div>
      <div style={{ position: 'absolute', left: 1080, top: 820, fontSize: 26, fontWeight: 700, color: COLORS.muted }}>kurze Tage</div>
      <Sfx sound="pop" at={10} volume={0.3} />
      <Caption>Ein halbes Jahr später weggeneigt: Das Licht trifft flach und verteilt sich – kühl.</Caption>
    </AbsoluteFill>
  );
};

// ── Nicht der Abstand ──────────────────────────────────────────────────
const NichtabstandScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Häufiger Irrtum" title="NICHT der Abstand!" />
      <Sun x={960} y={540} r={90} />
      <Orbit cx={960} cy={540} rx={640} ry={340} />
      <div style={{ position: 'absolute', left: 260, top: 500, fontSize: 70 }}>🌍</div>
      <div style={{ position: 'absolute', left: 1560, top: 500, fontSize: 70 }}>🌍</div>
      <div style={{ position: 'absolute', left: 120, top: 620, fontSize: 26, fontWeight: 800, color: COLORS.amber, opacity: f }}>Nordhalbkugel: Sommer ☀️</div>
      <div style={{ position: 'absolute', left: 1440, top: 620, fontSize: 26, fontWeight: 800, color: COLORS.sky, opacity: f }}>hier: Winter ❄️</div>
      <div style={{ position: 'absolute', left: 700, top: 860, fontSize: 28, fontWeight: 800, color: COLORS.green, opacity: f }}>Südhalbkugel hat's genau umgekehrt – gleicher Abstand!</div>
      <Sfx sound="impact" at={14} volume={0.36} />
      <Caption delay={40}>Wenn bei uns Sommer ist, ist auf der Südhalbkugel Winter – gleicher Abstand.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Jahreszeiten" footer="nicht der Abstand zur Sonne">
      Die geneigte Erdachse macht die
      <br />
      Jahreszeiten: steiles Licht = Sommer,
      <br />
      flaches Licht = Winter.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Weihnachten im Hochsommer" />
      <div style={{ fontSize: 180, opacity: f }}>🎄🏖️🇦🇺</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        In Australien feiert man Weihnachten am Strand.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Nord und Süd haben immer gegensätzliche Jahreszeiten – wegen der Achse.</Caption>
    </AbsoluteFill>
  );
};

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
  { id: 'achse', C: AchseScene, min: 220 },
  { id: 'sommer', C: SommerScene, min: 240 },
  { id: 'winter', C: WinterScene, min: 240 },
  { id: 'nichtabstand', C: NichtabstandScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const JAHRESZEITEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Jahreszeiten: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={JAHRESZEITEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/jahreszeiten/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
