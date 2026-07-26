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
import { LampSym, BatterySym, SwitchSym, useFade } from '../circuit';
import timings from '../narration/parallelschaltung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const LX = 480;
const RX = 1440;
const TOP = 300; // obere Sammelschiene
const BOT = 820; // untere Sammelschiene
const BRANCH_X = [720, 960, 1200]; // drei Zweige
const LAMP_Y = 480;
const SW_Y = 660;

// Parallel-Stromkreis: drei Zweige, jeder mit Lampe + Schalter.
const ParallelCircuit: React.FC<{ states: boolean[] }> = ({ states }) => {
  const frame = useCurrentFrame();
  const anyOn = states.some(Boolean);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Sammelschienen */}
        <line x1={LX} y1={TOP} x2={RX} y2={TOP} stroke={anyOn ? COLORS.amber : COLORS.muted} strokeWidth={7} strokeLinecap="round" />
        <line x1={LX} y1={BOT} x2={RX} y2={BOT} stroke={anyOn ? COLORS.amber : COLORS.muted} strokeWidth={7} strokeLinecap="round" />
        {/* Batterie-Anschluss links */}
        <line x1={LX} y1={TOP} x2={LX} y2={BOT} stroke={anyOn ? COLORS.amber : COLORS.muted} strokeWidth={7} />
        {/* Zweige */}
        {BRANCH_X.map((x, i) => (
          <React.Fragment key={i}>
            <line x1={x} y1={TOP} x2={x} y2={BOT} stroke={states[i] ? COLORS.amber : COLORS.muted} strokeWidth={6} />
          </React.Fragment>
        ))}
        {/* Strom-Punkte in aktiven Zweigen */}
        {BRANCH_X.map((x, i) =>
          states[i]
            ? Array.from({ length: 4 }).map((_, k) => {
                const s = (frame / 45 + k / 4) % 1;
                const y = TOP + s * (BOT - TOP);
                return <circle key={`${i}-${k}`} cx={x} cy={y} r={5} fill="#fde68a" />;
              })
            : null
        )}
      </svg>
      <BatterySym x={LX} y={(TOP + BOT) / 2} horizontal={false} label="Batterie" />
      {BRANCH_X.map((x, i) => (
        <React.Fragment key={i}>
          <LampSym x={x} y={LAMP_Y} r={38} on={states[i]} label={`L${i + 1}`} />
          <SwitchSym x={x} y={SW_Y} closed={states[i]} />
        </React.Fragment>
      ))}
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
      <div style={{ display: 'flex', gap: 50, marginBottom: 30, fontSize: 110 }}>
        <div>💡</div><div>💡</div><div>💡</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 88, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die Parallelschaltung
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Jede Lampe bekommt ihren eigenen Weg.
      </div>
    </AbsoluteFill>
  );
};

// ── Aufbau ─────────────────────────────────────────────────────────────
const AufbauScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Aufbau" title="Eigener Zweig pro Lampe" />
    <ParallelCircuit states={[true, true, true]} />
    <div style={{ position: 'absolute', left: 560, top: 200, fontSize: 28, fontWeight: 800, color: COLORS.sky }}>jeder Zweig: eigene Lampe + eigener Schalter</div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption>Für jede Lampe zweigt ein eigener Stromweg ab.</Caption>
  </AbsoluteFill>
);

// ── Unabhängig schalten ────────────────────────────────────────────────
const UnabhaengigScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // mittlere Lampe wird ausgeschaltet, andere bleiben an
  const midOff = frame > dur * 0.4;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Vorteil" title="Jede einzeln schaltbar" />
      <ParallelCircuit states={[true, !midOff, true]} />
      {midOff ? (
        <div style={{ position: 'absolute', left: BRANCH_X[1] - 90, top: 200, fontSize: 26, fontWeight: 800, color: COLORS.red }}>L2 aus – Rest leuchtet weiter</div>
      ) : null}
      <Sfx sound="pop" at={Math.round(dur * 0.4)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.4) + 8}>Schaltest du eine aus, leuchten die anderen ungestört weiter.</Caption>
    </AbsoluteFill>
  );
};

// ── Volle Helligkeit ───────────────────────────────────────────────────
const HelligkeitScene: React.FC<SceneProps> = () => {
  const lab = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Und hell?" title="Jede mit voller Helligkeit" />
      <ParallelCircuit states={[true, true, true]} />
      <div style={{ position: 'absolute', left: 560, top: 200, fontSize: 30, fontWeight: 800, color: COLORS.green, opacity: lab }}>
        volle Spannung an jeder Lampe → 100 % Helligkeit
      </div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Kein Abdunkeln wie in der Reihe – jede Lampe bekommt die volle Spannung.</Caption>
    </AbsoluteFill>
  );
};

// ── Haushalt ───────────────────────────────────────────────────────────
const HaushaltScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beispiel" title="Dein Zuhause ist parallel" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['💡', 'Küche AN'], ['📺', 'TV AN'], ['🔌', 'Steckdose']].map(([ic, nm], i) => (
          <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{ic}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{nm}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Licht an, ohne dass der Fernseher ausgeht – dank Parallelschaltung.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Parallelschaltung" footer="darum ist der Haushalt parallel verdrahtet">
      Jede Lampe hat einen eigenen Weg.
      <br />
      Alle leuchten voll hell
      <br />
      und lassen sich einzeln schalten.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Überall im Haus" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🔌" title="Steckdosen" delay={10} />
        <TCard icon="💡" title="Deckenlampen" delay={30} />
        <TCard icon="🍳" title="Küchengeräte" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Jedes Gerät arbeitet für sich – unabhängig von den anderen.</Caption>
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
  { id: 'aufbau', C: AufbauScene, min: 220 },
  { id: 'unabhaengig', C: UnabhaengigScene, min: 260 },
  { id: 'helligkeit', C: HelligkeitScene, min: 240 },
  { id: 'haushalt', C: HaushaltScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const PARALLELSCHALTUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Parallelschaltung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={PARALLELSCHALTUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/parallelschaltung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
