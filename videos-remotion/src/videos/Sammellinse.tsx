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
import { Axis, ConvexLens, useFade } from '../lens';
import timings from '../narration/sammellinse.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CX = 1000;
const AXIS = 560;

// Parallele Strahlen von links, die sich im Brennpunkt bündeln.
const ParallelToFocus: React.FC<{ f: number; progress: number; heat?: boolean }> = ({ f, progress, heat }) => {
  const ys = [AXIS - 150, AXIS - 75, AXIS, AXIS + 75, AXIS + 150];
  const Fx = CX + f;
  const pIn = Math.min(1, progress * 2);
  const pOut = Math.max(0, progress * 2 - 1);
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {ys.map((y, i) => (
        <React.Fragment key={i}>
          <line x1={200} y1={y} x2={200 + (CX - 200) * pIn} y2={y} stroke={COLORS.amber} strokeWidth={4} opacity={0.9} />
          {pOut > 0 ? <line x1={CX} y1={y} x2={CX + (Fx - CX) * pOut} y2={y + (AXIS - y) * pOut} stroke={COLORS.amber} strokeWidth={4} opacity={0.9} /> : null}
        </React.Fragment>
      ))}
      {pOut > 0.9 ? <circle cx={Fx} cy={AXIS} r={heat ? 18 : 10} fill={heat ? '#ef4444' : COLORS.amber} opacity={0.9}>{heat ? <animate attributeName="r" values="14;22;14" dur="0.6s" repeatCount="indefinite" /> : null}</circle> : null}
    </svg>
  );
};

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 70, marginBottom: 40, fontSize: 130 }}>
        <div>🔎</div><div>☀️</div><div>🔥</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 76, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie bündelt eine Sammellinse Licht?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum kann eine Lupe in der Sonne Papier entzünden?
      </div>
    </AbsoluteFill>
  );
};

// ── Bündeln ────────────────────────────────────────────────────────────
const BuendelnScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [12, dur - 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Paralleles Licht → ein Punkt" />
      <Axis y={AXIS} />
      <ParallelToFocus f={340} progress={p} />
      <ConvexLens cx={CX} cy={AXIS} f={340} showF={false} />
      <div style={{ position: 'absolute', left: 250, top: 340, fontSize: 26, fontWeight: 800, color: COLORS.amber }}>paralleles Sonnenlicht ☀️</div>
      <Sfx sound="whoosh" at={12} volume={0.3} />
      <Caption delay={Math.round(dur * 0.6)}>Die Linse lenkt alle parallelen Strahlen zu einem einzigen Punkt zusammen.</Caption>
    </AbsoluteFill>
  );
};

// ── Brennpunkt ─────────────────────────────────────────────────────────
const BrennpunktScene: React.FC<SceneProps> = () => {
  const p = useFade(10, 30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Punkt" title="Brennpunkt F & Brennweite f" />
      <Axis y={AXIS} />
      <ParallelToFocus f={340} progress={1} />
      <ConvexLens cx={CX} cy={AXIS} f={340} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: p }} viewBox="0 0 1920 1080">
        <line x1={CX} y1={680} x2={CX + 340} y2={680} stroke={COLORS.sky} strokeWidth={3} />
        <text x={CX + 130} y={715} fontSize={28} fill={COLORS.sky} fontWeight="bold">Brennweite f</text>
      </svg>
      <div style={{ position: 'absolute', left: CX + 300, top: 470, fontSize: 30, fontWeight: 900, color: COLORS.amber, opacity: p }}>F</div>
      <Sfx sound="pling" at={12} volume={0.4} />
      <Caption delay={30}>Der Bündelpunkt heißt Brennpunkt F, der Abstand dorthin ist die Brennweite.</Caption>
    </AbsoluteFill>
  );
};

// ── Brennweite: stark/flach ────────────────────────────────────────────
const BrennweiteScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const thick = frame < dur * 0.5;
  const f = thick ? 220 : 420;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Wie stark?" title={thick ? 'Dick → kurze Brennweite' : 'Flach → lange Brennweite'} />
      <Axis y={AXIS} />
      <ParallelToFocus f={f} progress={1} />
      <ConvexLens cx={CX} cy={AXIS} f={f} />
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Eine dick gewölbte Linse bündelt stark und hat eine kurze Brennweite.</Caption>
    </AbsoluteFill>
  );
};

// ── Hitze im Brennpunkt ────────────────────────────────────────────────
const HitzeScene: React.FC<SceneProps> = () => {
  const p = useFade(10, 30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Darum brennt's" title="Alle Energie auf einen Fleck" />
      <Axis y={AXIS} />
      <ParallelToFocus f={340} progress={1} heat />
      <ConvexLens cx={CX} cy={AXIS} f={340} showF={false} />
      <div style={{ position: 'absolute', left: CX + 300, top: 440, fontSize: 70, opacity: p }}>🔥</div>
      <div style={{ position: 'absolute', left: CX + 260, top: 640, fontSize: 26, fontWeight: 800, color: COLORS.red, opacity: p }}>hellster & heißester Punkt</div>
      <Sfx sound="impact" at={12} volume={0.36} />
      <Caption delay={30}>Die ganze Lichtenergie sammelt sich auf einem winzigen Fleck – das entzündet Papier.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Sammellinse" footer="im Brennpunkt am hellsten & heißesten">
      Eine Sammellinse bündelt paralleles
      <br />
      Licht im Brennpunkt F. Der Abstand
      <br />
      Linse–F ist die Brennweite.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Sammellinsen überall" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 30 }}>
        <TCard icon="🔎" title="Lupe" delay={10} />
        <TCard icon="📷" title="Kamera" delay={28} />
        <TCard icon="🔭" title="Fernglas" delay={46} />
        <TCard icon="👁️" title="Auge" delay={64} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={80}>Überall, wo Licht gebündelt wird – sogar in deinem Auge.</Caption>
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
  { id: 'buendeln', C: BuendelnScene, min: 260 },
  { id: 'brennpunkt', C: BrennpunktScene, min: 240 },
  { id: 'brennweite', C: BrennweiteScene, min: 240 },
  { id: 'hitze', C: HitzeScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SAMMELLINSE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Sammellinse: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SAMMELLINSE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/sammellinse/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
