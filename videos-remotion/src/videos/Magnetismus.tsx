import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { Trail } from '@remotion/motion-blur';
import { evolvePath } from '@remotion/paths';
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
import { BarMagnet, CompassNeedle } from '../magnet';
import { BackgroundMusic, Sfx } from '../components';
import timings from '../narration/magnetismus.timings.json';

const T = timings as Record<string, number>;
const BASE = 'magnetismus';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const TR = 16; // Übergangs-Dauer (Frames)

type SP = { beats: BeatInfo[]; dur: number };

// sanfte Kamerafahrt (Ken Burns)
const useZoom = (dur: number, from = 1, to = 1.05) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, dur], [from, to], clamp);
};

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SP> = ({ beats, dur }) => {
  const frame = useCurrentFrame();
  const z = useZoom(dur, 1.04, 1);
  const title = useReveal(beats[0].start + 4);
  const sub = useReveal(beats[1].start);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${z})` }}>
      <div style={{ display: 'flex', gap: 96, marginBottom: 34, opacity: title.op }}>
        {['🧲', '➡️', '🔩'].map((e, i) => (
          <div key={i} style={{ fontSize: 126, transform: `translateY(${Math.sin(frame / 22 + i) * 15}px)` }}>{e}</div>
        ))}
      </div>
      <PaperLogo size={78} />
      <div style={{ marginTop: 26, fontSize: 80, fontWeight: 900, color: PAPER.ink, textAlign: 'center', opacity: title.op, transform: `translateY(${title.y}px)` }}>
        Was zieht ein Magnet an?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: PAPER.inkSoft, maxWidth: 1300, textAlign: 'center', opacity: sub.op, transform: `translateY(${sub.y}px)` }}>
        Zieht er wirklich <i>alles</i> aus Metall an?
      </div>
    </AbsoluteFill>
  );
};

// ── Materialprobe (helles Papier-Design) ───────────────────────────────
type PState = 'unknown' | 'yes' | 'no';
const Probe: React.FC<{ icon: string; name: string; state: PState; rev: { op: number; y: number }; lift?: number }> = ({ icon, name, state, rev, lift = 0 }) => {
  const border = state === 'yes' ? PAPER.green : state === 'no' ? '#b6c0d4' : PAPER.border;
  return (
    <div style={{ width: 188, padding: '20px 10px', borderRadius: 16, background: PAPER.panel, border: `2.5px solid ${border}`, boxShadow: `0 10px 24px ${PAPER.shadow}`, textAlign: 'center', opacity: rev.op, transform: `translateY(${rev.y - lift}px)` }}>
      <div style={{ fontSize: 56 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2, color: PAPER.ink }}>{name}</div>
      <div style={{ height: 30, marginTop: 6, fontSize: 22, fontWeight: 800, color: state === 'yes' ? PAPER.green : '#95a1b6' }}>
        {state === 'yes' ? '✓ haftet' : state === 'no' ? '– nichts' : ''}
      </div>
    </div>
  );
};

// ── Test: was haftet? ──────────────────────────────────────────────────
const materials = [
  { icon: '🔩', name: 'Eisen', mag: true },
  { icon: '🥫', name: 'Alu', mag: false },
  { icon: '🪙', name: 'Kupfer', mag: false },
  { icon: '🪵', name: 'Holz', mag: false },
  { icon: '🥄', name: 'Plastik', mag: false },
];
const TestScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const b1 = beats[1].start;
  const decided = frame >= b1;
  const pull = interpolate(frame, [b1 + 6, b1 + 30], [0, 64], clamp);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Experiment" title="Was bleibt am Magneten hängen?" />
      <BarMagnet cx={960} cy={330} w={300} h={74} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 130 }}>
        <div style={{ display: 'flex', gap: 26 }}>
          {materials.map((m, i) => (
            <Probe
              key={m.name}
              icon={m.icon}
              name={m.name}
              state={decided ? (m.mag ? 'yes' : 'no') : 'unknown'}
              rev={useReveal(b0 + 8 + i * 9)}
              lift={m.mag ? pull : 0}
            />
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={b0 + 8} volume={0.3} />
      <Sfx sound="pling" at={b1 + 6} volume={0.42} />
      <PaperCaption delay={b1}>Nur <b style={{ color: PAPER.green }}>Eisen</b> haftet – Alu, Kupfer, Holz und Plastik nicht.</PaperCaption>
    </AbsoluteFill>
  );
};

// ── Merksatz 1 ─────────────────────────────────────────────────────────
const Merk1: React.FC<SP> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={6} volume={0.5} />
    <PaperMerksatz title="Magnetische Stoffe" footer="die meisten anderen Metalle nicht">
      Nur <span style={{ color: PAPER.green }}>Eisen</span>, Nickel
      <br />
      und Kobalt sind
      <br />
      magnetisch.
    </PaperMerksatz>
  </AbsoluteFill>
);

// ── Pole ───────────────────────────────────────────────────────────────
const PoleScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const nLab = useReveal(b0 + 18);
  const sLab = useReveal(b0 + 30);
  const glow = 0.5 + 0.5 * Math.sin(frame / 12);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Aufbau" title="Nordpol und Südpol" />
      <BarMagnet cx={960} cy={560} w={620} h={150} />
      {/* Pol-Marker */}
      <div style={{ position: 'absolute', left: 1250, top: 470, fontSize: 34, fontWeight: 800, color: '#ef4444', opacity: nLab.op, transform: `translateY(${nLab.y}px)` }}>Nordpol ↗</div>
      <div style={{ position: 'absolute', left: 470, top: 690, fontSize: 34, fontWeight: 800, color: '#3b82f6', opacity: sLab.op, transform: `translateY(${sLab.y}px)` }}>↙ Südpol</div>
      {/* Kraft an den Enden */}
      <div style={{ position: 'absolute', left: 1245, top: 560, width: 60, height: 60, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, rgba(239,68,68,${0.35 * glow}), transparent 70%)`, opacity: nLab.op }} />
      <div style={{ position: 'absolute', left: 675, top: 560, width: 60, height: 60, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, rgba(59,130,246,${0.35 * glow}), transparent 70%)`, opacity: sLab.op }} />
      <PaperCaption delay={b0 + 4}>Jeder Magnet hat zwei Pole – an den Enden ist die Kraft am stärksten.</PaperCaption>
    </AbsoluteFill>
  );
};

// ── Kraft: selbst-animierter Magnet (für Motion-Blur via Trail) ────────
const MovingMagnet: React.FC<{ side: 'l' | 'r'; b0: number; b1: number }> = ({ side, b0, b1 }) => {
  const frame = useCurrentFrame();
  const cy = 570;
  const repel = frame < b1;
  let cx: number;
  if (repel) {
    const s = interpolate(frame, [b0 + 10, b0 + 40], [0, 170], clamp);
    cx = side === 'l' ? 770 - s : 1150 + s;
  } else {
    const s = interpolate(frame, [b1 + 6, b1 + 34], [0, 1], clamp);
    cx = side === 'l' ? interpolate(s, [0, 1], [600, 838]) : interpolate(s, [0, 1], [1320, 1082]);
  }
  const nRight = side === 'l' ? true : repel ? false : true;
  return <BarMagnet cx={cx} cy={cy} w={300} h={82} nRight={nRight} />;
};

const KraftScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const b1 = beats[1].start;
  const repel = frame < b1;
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Die Kraft" title="Anziehen oder Abstoßen?" />
      <Trail layers={5} lagInFrames={1.3} trailOpacity={0.32}>
        <MovingMagnet side="l" b0={b0} b1={b1} />
      </Trail>
      <Trail layers={5} lagInFrames={1.3} trailOpacity={0.32}>
        <MovingMagnet side="r" b0={b0} b1={b1} />
      </Trail>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 350, textAlign: 'center', fontSize: 40, fontWeight: 800, color: repel ? '#ef4444' : PAPER.green }}>
        {repel ? 'gleiche Pole (N | N) → stoßen sich ab' : 'verschiedene Pole (N | S) → ziehen sich an'}
      </div>
      <Sfx sound={repel ? 'whoosh' : 'impact'} at={repel ? b0 + 12 : b1 + 6} volume={0.4} />
      <PaperCaption delay={b0 + 6}>Gleiche Pole stoßen sich ab – verschiedene Pole ziehen sich an.</PaperCaption>
    </AbsoluteFill>
  );
};

// ── Feld: Feldlinien zeichnen sich (via @remotion/paths) ───────────────
const FieldDraw: React.FC<{ cx: number; cy: number; progress: number }> = ({ cx, cy, progress }) => {
  const L = 175;
  const bows = [46, 112, 200, 305];
  const arc = (d: number, up: boolean) => {
    const s = up ? -1 : 1;
    return `M ${cx + L},${cy} C ${cx + L},${cy + s * d} ${cx - L},${cy + s * d} ${cx - L},${cy}`;
  };
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {bows.flatMap((d, i) =>
        [true, false].map((up, j) => {
          const p = arc(d, up);
          const ev = evolvePath(progress, p);
          return (
            <path key={`${i}-${j}`} d={p} fill="none" stroke={PAPER.blue} strokeWidth={3.5} opacity={0.85} strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} strokeLinecap="round" />
          );
        })
      )}
    </svg>
  );
};
const FeldScene: React.FC<SP> = ({ beats, dur }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const z = useZoom(dur, 1, 1.05);
  const progress = interpolate(frame, [b0 + 12, b0 + 78], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${z})` }}>
      <PaperTitle kicker="Unsichtbar sichtbar" title="Das Magnetfeld" />
      <FieldDraw cx={960} cy={560} progress={progress} />
      <BarMagnet cx={960} cy={560} w={350} h={92} />
      <PaperCaption delay={b0 + 6}>Die Feldlinien laufen in Bögen vom <b style={{ color: '#ef4444' }}>Nordpol</b> zum <b style={{ color: '#3b82f6' }}>Südpol</b>.</PaperCaption>
    </AbsoluteFill>
  );
};

// ── Kompass / Erde ─────────────────────────────────────────────────────
const KompassScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const wobble = Math.sin(frame / 6) * interpolate(frame, [b0 + 10, b0 + 50], [22, 0], clamp);
  const angle = interpolate(frame, [b0 + 8, b0 + 44], [68, 0], clamp) + wobble;
  const earth = useReveal(b0 + 4);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <PaperTitle kicker="Im Alltag" title="Die Erde ist ein Magnet" />
      <div style={{ display: 'flex', gap: 120, alignItems: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 210, transform: `rotate(${frame * 0.4}deg)`, opacity: earth.op }}>🌍</div>
        <div style={{ position: 'relative', width: 260, height: 260, opacity: earth.op }}>
          <div style={{ position: 'absolute', left: '50%', top: -44, transform: 'translateX(-50%)', fontSize: 30, fontWeight: 800, color: '#ef4444' }}>N</div>
          <CompassNeedle x={130} y={130} size={230} angle={angle} />
        </div>
      </div>
      <PaperCaption delay={b0 + 4}>Die Kompassnadel zeigt immer nach Norden – so findest du die Richtung.</PaperCaption>
    </AbsoluteFill>
  );
};

// ── Merksatz 2 ─────────────────────────────────────────────────────────
const Merk2: React.FC<SP> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={6} volume={0.5} />
    <PaperMerksatz title="Magnet – kurz gemerkt" footer="eine unsichtbare Kraft">
      Nord- &amp; Südpol ·
      <br />
      zieht Eisen an ·
      <br />
      gleiche Pole stoßen ab
    </PaperMerksatz>
  </AbsoluteFill>
);

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

const SCENES: { key: string; ids: string[]; C: React.FC<SP>; slide?: boolean }[] = [
  { key: 'intro', ids: ['intro_1', 'intro_2'], C: Intro },
  { key: 'test', ids: ['test_1', 'test_2'], C: TestScene },
  { key: 'merk1', ids: ['merk1_1'], C: Merk1 },
  { key: 'pole', ids: ['pole_1'], C: PoleScene },
  { key: 'kraft', ids: ['kraft_1', 'kraft_2'], C: KraftScene },
  { key: 'feld', ids: ['feld_1'], C: FeldScene },
  { key: 'kompass', ids: ['kompass_1'], C: KompassScene, slide: true },
  { key: 'merk2', ids: ['merk2_1'], C: Merk2 },
  { key: 'outro', ids: ['outro_1'], C: Outro },
];

const LAID = SCENES.map((s) => ({ ...s, ...layoutBeats(s.ids, T, s.key === 'outro' ? { pad: 30 } : undefined) }));

export const MAGNETISMUS_DURATION = LAID.reduce((sum, s) => sum + s.total, 0) - (LAID.length - 1) * TR;

export const Magnetismus: React.FC = () => {
  return (
    <PaperBg>
      <BackgroundMusic total={MAGNETISMUS_DURATION} />
      <TransitionSeries>
        {LAID.flatMap((s, i) => {
          const seq = (
            <TransitionSeries.Sequence key={s.key} durationInFrames={s.total}>
              <s.C beats={s.beats} dur={s.total} />
              <BeatAudio base={BASE} beats={s.beats} />
            </TransitionSeries.Sequence>
          );
          if (i === LAID.length - 1) return [seq];
          const next = LAID[i + 1];
          const trans = (
            <TransitionSeries.Transition
              key={`t-${s.key}`}
              presentation={next.slide ? slide({ direction: 'from-right' }) : fade()}
              timing={linearTiming({ durationInFrames: TR })}
            />
          );
          return [seq, trans];
        })}
      </TransitionSeries>
      <Avatar />
    </PaperBg>
  );
};
