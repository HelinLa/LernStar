import React from 'react';
import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import {
  PaperBg,
  PaperTitle,
  PaperCaption,
  PaperMerksatz,
  PaperLogo,
  Avatar,
  useReveal,
  layoutBeats,
  BeatAudio,
  PAPER,
  type BeatInfo,
} from '../paper';
import { LightSource, Ray } from '../optik';
import { BackgroundMusic, Sfx } from '../components';
import timings from '../narration/lichtausbreitung.timings.json';

const T = timings as Record<string, number>;
const BASE = 'lichtausbreitung';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

type SP = { beats: BeatInfo[] };

// Pappe mit Loch (senkrechte Wand mit Lücke) ─ Karo-tauglich
const Blende: React.FC<{ x: number; holeY: number; gap?: number; label?: string }> = ({
  x,
  holeY,
  gap = 46,
  label,
}) => (
  <>
    <div style={{ position: 'absolute', left: x, top: 250, width: 20, height: holeY - gap - 250, borderRadius: 6, background: 'linear-gradient(90deg,#b45309,#7c3b12)' }} />
    <div style={{ position: 'absolute', left: x, top: holeY + gap, width: 20, height: 900 - (holeY + gap), borderRadius: 6, background: 'linear-gradient(90deg,#b45309,#7c3b12)' }} />
    {label ? <div style={{ position: 'absolute', left: x - 4, top: 906, fontSize: 24, fontWeight: 800, color: PAPER.inkSoft }}>{label}</div> : null}
  </>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const title = useReveal(beats[0].start + 4);
  const sub = useReveal(beats[1].start);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 110, marginBottom: 36, opacity: title.op }}>
        {['💡', '➡️', '👁️'].map((e, i) => (
          <div key={i} style={{ fontSize: 128, transform: `translateY(${Math.sin(frame / 22 + i) * 16}px)` }}>{e}</div>
        ))}
      </div>
      <PaperLogo size={78} />
      <div style={{ marginTop: 26, fontSize: 80, fontWeight: 900, color: PAPER.ink, textAlign: 'center', opacity: title.op, transform: `translateY(${title.y}px)` }}>
        Wie breitet sich Licht aus?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: PAPER.inkSoft, maxWidth: 1350, textAlign: 'center', opacity: sub.op, transform: `translateY(${sub.y}px)` }}>
        Läuft das Licht in Kurven – oder immer schnurgerade?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: Strahlen laufen geradlinig ─────────────────────────────
const lampX = 340;
const lampY = 560;
const BeobachtenScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const b1 = beats[1].start;
  const lamp = useReveal(b0);
  const p = interpolate(frame, [b0 + 10, b0 + 48], [0, 1], clamp);
  const targets: [number, number][] = [
    [1540, 320], [1540, 440], [1540, 560], [1540, 680], [1540, 800],
  ];
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Beobachten" title="Licht läuft schnurgerade" />
      <div style={{ opacity: lamp.op }}>
        <LightSource x={lampX} y={lampY} r={58} emoji="🔦" label="Taschenlampe" color={PAPER.amber} />
      </div>
      {targets.map((t, i) => (
        <Ray key={i} x1={lampX + 30} y1={lampY} x2={t[0]} y2={t[1]} progress={p} color={PAPER.amber} width={5} opacity={0.9} arrow />
      ))}
      <Sfx sound="whoosh" at={b0 + 10} volume={0.3} />
      <Sfx sound="pling" at={b1} volume={0.32} />
      <PaperCaption delay={b1}>Jeder Strahl ist eine gerade Linie – nie eine Kurve, nie um die Ecke.</PaperCaption>
    </AbsoluteFill>
  );
};

// ── Modell: Lichtstrahl = gerade Linie mit Pfeil ───────────────────────
const ModellScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const b1 = beats[1].start;
  const p = interpolate(frame, [b0 + 6, b0 + 44], [0, 1], clamp);
  const lab = useReveal(b0 + 26);
  const bundle = interpolate(frame, [b1, b1 + 30], [0, 1], clamp);
  const bl = useReveal(b1 + 14);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Das Modell" title="Der Lichtstrahl" />
      <Ray x1={360} y1={430} x2={1500} y2={430} progress={p} color={PAPER.sky} width={8} arrow opacity={0.95} />
      <div style={{ position: 'absolute', left: 640, top: 352, fontSize: 30, fontWeight: 800, color: PAPER.sky, opacity: lab.op, transform: `translateY(${lab.y}px)` }}>
        Lichtstrahl = gerade Linie mit Pfeil
      </div>
      {[560, 600, 640, 680].map((y, i) => (
        <Ray key={i} x1={360} y1={y} x2={1500} y2={y} progress={bundle} color={PAPER.amber} width={5} opacity={0.7 * bundle} />
      ))}
      <div style={{ position: 'absolute', left: 640, top: 720, fontSize: 28, fontWeight: 800, color: PAPER.amber, opacity: bl.op, transform: `translateY(${bl.y}px)` }}>
        viele Strahlen = Lichtbündel
      </div>
      <Sfx sound="pling" at={b0 + 26} volume={0.35} />
    </AbsoluteFill>
  );
};

// ── Blende: 3 Löcher – nur auf einer Linie kommt Licht durch ───────────
const BlendeScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const b1 = beats[1].start;
  const holeY = 560;
  const shifted = frame >= b1;
  const midY = shifted ? 410 : holeY;
  const p = interpolate(frame, [b0 + 8, b0 + 42], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Beweis" title="Drei Löcher auf einer Linie" />
      <LightSource x={230} y={holeY} r={50} emoji="🔦" color={PAPER.amber} />
      <Blende x={620} holeY={holeY} label="1" />
      <Blende x={960} holeY={midY} label="2" />
      <Blende x={1300} holeY={holeY} label="3" />
      <Ray x1={260} y1={holeY} x2={620} y2={holeY} progress={p} color={PAPER.amber} width={5} />
      {p > 0.9 ? <Ray x1={630} y1={holeY} x2={960} y2={midY} progress={shifted ? 0.5 : 1} color={shifted ? PAPER.red : PAPER.amber} width={5} /> : null}
      {p > 0.9 && !shifted ? (
        <>
          <Ray x1={970} y1={holeY} x2={1300} y2={holeY} color={PAPER.amber} width={5} />
          <Ray x1={1310} y1={holeY} x2={1600} y2={holeY} color={PAPER.green} width={5} arrow />
          <div style={{ position: 'absolute', left: 1420, top: holeY - 74, fontSize: 30, fontWeight: 800, color: PAPER.green }}>Licht kommt an ✅</div>
        </>
      ) : null}
      {shifted ? <div style={{ position: 'absolute', left: 1000, top: 300, fontSize: 30, fontWeight: 800, color: PAPER.red }}>blockiert – kein Knick möglich ❌</div> : null}
      <Sfx sound={shifted ? 'impact' : 'pling'} at={b1} volume={0.4} />
      <PaperCaption delay={b0 + 40}>Nur wenn alle Löcher exakt auf einer Geraden liegen, geht das Licht hindurch.</PaperCaption>
    </AbsoluteFill>
  );
};

// ── Tempo: Lichtgeschwindigkeit ────────────────────────────────────────
const TempoScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b0 = beats[0].start;
  const b1 = beats[1].start;
  const big = spring({ frame: frame - (b0 + 8), fps, config: { damping: 200 } });
  const earth = useReveal(b1);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <PaperTitle kicker="Wie schnell?" title="Nichts ist schneller" />
      <div style={{ fontSize: 118, fontWeight: 900, color: PAPER.sky, opacity: big, transform: `scale(${interpolate(big, [0, 1], [0.6, 1])})` }}>
        300 000 km/s
      </div>
      <div style={{ marginTop: 24, display: 'flex', gap: 30, alignItems: 'center', opacity: earth.op, transform: `translateY(${earth.y}px)` }}>
        <div style={{ fontSize: 88, transform: `rotate(${frame * 2}deg)` }}>🌍</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: PAPER.amber }}>≈ 8× um die Erde – in 1 Sekunde</div>
      </div>
      <Sfx sound="whoosh" at={b0 + 8} volume={0.35} />
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SP> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={6} volume={0.5} />
    <PaperMerksatz title="Lichtausbreitung" footer="dargestellt als Lichtstrahl mit Pfeil">
      Licht breitet sich
      <br />
      geradlinig aus –
      <br />
      in alle Richtungen.
    </PaperMerksatz>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; rev: { op: number; y: number } }> = ({ icon, title, rev }) => (
  <div style={{ width: 320, padding: '30px 18px', borderRadius: 20, background: PAPER.panel, border: `1.5px solid ${PAPER.border}`, boxShadow: `0 12px 30px ${PAPER.shadow}`, textAlign: 'center', opacity: rev.op, transform: `translateY(${rev.y}px)` }}>
    <div style={{ fontSize: 74 }}>{icon}</div>
    <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8, color: PAPER.ink }}>{title}</div>
  </div>
);

const TransferScene: React.FC<SP> = ({ beats }) => {
  const b0 = beats[0].start;
  const b1 = beats[1].start;
  const r0 = useReveal(b0 + 6);
  const r1 = useReveal(b1);
  const r2 = useReveal(b1 + 18);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Übertragen" title="Gerade Strahlen im Alltag" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 40 }}>
          <TCard icon="🔴" title="Laserstrahl" rev={r0} />
          <TCard icon="🌤️" title="Sonnenstrahlen" rev={r1} />
          <TCard icon="🔦" title="Taschenlampe" rev={r2} />
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={b0 + 6} volume={0.32} />
    </AbsoluteFill>
  );
};

// ── Outro ──────────────────────────────────────────────────────────────
const Outro: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <PaperLogo size={116} />
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: PAPER.inkSoft, opacity: s }}>
        Physik verstehen – Schritt für Schritt.
      </div>
    </AbsoluteFill>
  );
};

const SCENES: { key: string; ids: string[]; C: React.FC<SP> }[] = [
  { key: 'intro', ids: ['intro_1', 'intro_2'], C: Intro },
  { key: 'beobachten', ids: ['beobachten_1', 'beobachten_2'], C: BeobachtenScene },
  { key: 'modell', ids: ['modell_1', 'modell_2'], C: ModellScene },
  { key: 'blende', ids: ['blende_1', 'blende_2'], C: BlendeScene },
  { key: 'tempo', ids: ['tempo_1', 'tempo_2'], C: TempoScene },
  { key: 'merksatz', ids: ['merksatz_1'], C: MerksatzScene },
  { key: 'transfer', ids: ['transfer_1', 'transfer_2'], C: TransferScene },
  { key: 'outro', ids: ['outro_1'], C: Outro },
];

const LAID = SCENES.map((s) => ({ ...s, ...layoutBeats(s.ids, T, s.key === 'outro' ? { pad: 30 } : undefined) }));

export const LICHTAUSBREITUNG_DURATION = LAID.reduce((sum, s) => sum + s.total, 0);

export const Lichtausbreitung: React.FC = () => {
  return (
    <PaperBg>
      <BackgroundMusic total={LICHTAUSBREITUNG_DURATION} />
      <Series>
        {LAID.map((s) => (
          <Series.Sequence key={s.key} durationInFrames={s.total}>
            <s.C beats={s.beats} />
            <BeatAudio base={BASE} beats={s.beats} />
          </Series.Sequence>
        ))}
      </Series>
      <Avatar />
    </PaperBg>
  );
};
