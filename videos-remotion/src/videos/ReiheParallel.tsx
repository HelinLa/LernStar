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
import { LampSym, BatterySym, useFade } from '../circuit';
import timings from '../narration/reihe-parallel.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Reihen-Schaltbild
const SeriesDiagram: React.FC<{ on: boolean; broken?: number | null }> = ({ on, broken = null }) => {
  const frame = useCurrentFrame();
  const LX = 560, RX = 1360, TY = 380, BY = 720;
  const xs = [LX + 220, LX + 420, LX + 620];
  const live = on && broken === null;
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <polyline points={`${LX},${BY} ${LX},${TY} ${RX},${TY} ${RX},${BY} ${LX},${BY}`} fill="none" stroke={live ? COLORS.amber : COLORS.muted} strokeWidth={6} strokeLinejoin="round" />
        {live ? Array.from({ length: 8 }).map((_, i) => {
          const s = (frame / 55 + i / 8) % 1; const per = 2 * (RX - LX) + 2 * (BY - TY);
          let d = s * per; const w = RX - LX, h = BY - TY; let x = LX, y = BY;
          if (d < h) { x = LX; y = BY - d; } else if (d < h + w) { x = LX + (d - h); y = TY; } else if (d < 2 * h + w) { x = RX; y = TY + (d - h - w); } else { x = RX - (d - 2 * h - w); y = BY; }
          return <circle key={i} cx={x} cy={y} r={6} fill="#fde68a" />;
        }) : null}
      </svg>
      {xs.map((x, i) => (
        <React.Fragment key={i}>
          <LampSym x={x} y={TY} r={36} on={live} />
          {broken === i ? <div style={{ position: 'absolute', left: x - 20, top: TY - 100, fontSize: 50 }}>🔧</div> : null}
        </React.Fragment>
      ))}
      <BatterySym x={(LX + RX) / 2} y={BY} />
    </>
  );
};

// Parallel-Schaltbild
const ParallelDiagram: React.FC<{ states: boolean[] }> = ({ states }) => {
  const frame = useCurrentFrame();
  const LX = 560, RX = 1360, TOP = 320, BOT = 780; const bx = [760, 960, 1160]; const anyOn = states.some(Boolean);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={LX} y1={TOP} x2={RX} y2={TOP} stroke={anyOn ? COLORS.amber : COLORS.muted} strokeWidth={6} />
        <line x1={LX} y1={BOT} x2={RX} y2={BOT} stroke={anyOn ? COLORS.amber : COLORS.muted} strokeWidth={6} />
        <line x1={LX} y1={TOP} x2={LX} y2={BOT} stroke={anyOn ? COLORS.amber : COLORS.muted} strokeWidth={6} />
        {bx.map((x, i) => <line key={i} x1={x} y1={TOP} x2={x} y2={BOT} stroke={states[i] ? COLORS.amber : COLORS.muted} strokeWidth={5} />)}
        {bx.map((x, i) => states[i] ? Array.from({ length: 3 }).map((_, k) => { const s = (frame / 45 + k / 3) % 1; return <circle key={`${i}-${k}`} cx={x} cy={TOP + s * (BOT - TOP)} r={5} fill="#fde68a" />; }) : null)}
      </svg>
      <BatterySym x={LX} y={(TOP + BOT) / 2} horizontal={false} />
      {bx.map((x, i) => <LampSym key={i} x={x} y={(TOP + BOT) / 2} r={34} on={states[i]} />)}
    </>
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
      <div style={{ display: 'flex', gap: 90, marginBottom: 40, fontSize: 120 }}>
        <div>💡➖💡</div><div>💡𝄁💡</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Reihe oder parallel?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Zwei Arten zu schalten – mit ganz unterschiedlichem Verhalten.
      </div>
    </AbsoluteFill>
  );
};

// ── Reihe ──────────────────────────────────────────────────────────────
const ReiheScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Reihenschaltung" title="Ein Weg, gleicher Strom" />
    <SeriesDiagram on />
    <div style={{ position: 'absolute', left: 600, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.sky }}>gleicher Strom I · Spannungen addieren sich</div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption>Alle Bauteile hintereinander: derselbe Strom fließt durch jedes.</Caption>
  </AbsoluteFill>
);

// ── Reihe fällt aus ────────────────────────────────────────────────────
const ReiheAusScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const broken = frame > dur * 0.4 ? 1 : null;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Nachteil" title="Eine raus → alle aus" />
      <SeriesDiagram on broken={broken} />
      <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 30, fontWeight: 800, color: broken !== null ? COLORS.red : COLORS.green }}>
        {broken !== null ? '❌ Stromweg unterbrochen – alle dunkel' : 'alle leuchten'}
      </div>
      <Sfx sound="impact" at={Math.round(dur * 0.4)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.4) + 8}>Ein defektes Bauteil unterbricht den einzigen Weg – alles geht aus.</Caption>
    </AbsoluteFill>
  );
};

// ── Parallel ───────────────────────────────────────────────────────────
const ParallelScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Parallelschaltung" title="Eigene Wege, gleiche Spannung" />
    <ParallelDiagram states={[true, true, true]} />
    <div style={{ position: 'absolute', left: 600, top: 230, fontSize: 28, fontWeight: 800, color: COLORS.sky }}>gleiche Spannung U · Ströme addieren sich</div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption>Jedes Bauteil in seinem eigenen Zweig – an jedem liegt dieselbe Spannung.</Caption>
  </AbsoluteFill>
);

// ── Parallel fällt aus ─────────────────────────────────────────────────
const ParallelAusScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const off = frame > dur * 0.4;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Vorteil" title="Eine raus → Rest läuft weiter" />
      <ParallelDiagram states={[true, !off, true]} />
      <div style={{ position: 'absolute', left: 600, top: 230, fontSize: 30, fontWeight: 800, color: COLORS.green }}>
        {off ? '✅ nur ein Zweig aus – der Rest leuchtet' : 'alle leuchten'}
      </div>
      <Sfx sound="pop" at={Math.round(dur * 0.4)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.4) + 8}>Jeder Zweig hat seinen eigenen Weg – die anderen leuchten ungestört weiter.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Reihe vs. Parallel" footer="Haushalt ist immer parallel geschaltet">
      Reihe: gleicher Strom, Spannungen addieren,
      <br />
      eine aus → alle aus.
      <br />
      Parallel: gleiche Spannung, Rest läuft weiter.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Warum der Haushalt parallel ist" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🔌', 'Steckdosen'], ['💡', 'Lampen'], ['📺', 'Geräte']].map((c, i) => (
          <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>So lässt sich jedes Gerät einzeln schalten – ohne die anderen zu stören.</Caption>
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
  { id: 'reihe', C: ReiheScene, min: 220 },
  { id: 'reiheaus', C: ReiheAusScene, min: 240 },
  { id: 'parallel', C: ParallelScene, min: 220 },
  { id: 'parallelaus', C: ParallelAusScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const REIHE_PARALLEL_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const ReiheParallel: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={REIHE_PARALLEL_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/reihe-parallel/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
