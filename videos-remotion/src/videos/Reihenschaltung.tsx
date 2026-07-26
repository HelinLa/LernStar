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
import timings from '../narration/reihenschaltung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const LX = 520;
const RX = 1400;
const TY = 380;
const BY = 760;

// Reihen-Stromkreis: n Lampen entlang der oberen Leitung, alle in einem Weg.
const SeriesCircuit: React.FC<{ n: number; on: boolean; brightness?: number }> = ({ n, on, brightness = 1 }) => {
  const frame = useCurrentFrame();
  const xs = Array.from({ length: n }, (_, i) => LX + ((RX - LX) * (i + 1)) / (n + 1));
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <polyline points={`${LX},${BY} ${LX},${TY} ${RX},${TY} ${RX},${BY} ${LX},${BY}`} fill="none" stroke={on ? COLORS.amber : COLORS.muted} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        {on
          ? Array.from({ length: 10 }).map((_, i) => {
              const s = (frame / 60 + i / 10) % 1;
              const per = 2 * (RX - LX) + 2 * (BY - TY);
              let d = s * per;
              const w = RX - LX;
              const h = BY - TY;
              let x = LX;
              let y = BY;
              if (d < h) { x = LX; y = BY - d; }
              else if (d < h + w) { x = LX + (d - h); y = TY; }
              else if (d < 2 * h + w) { x = RX; y = TY + (d - h - w); }
              else { x = RX - (d - 2 * h - w); y = BY; }
              return <circle key={i} cx={x} cy={y} r={6} fill="#fde68a" />;
            })
          : null}
      </svg>
      {xs.map((x, i) => (
        <div key={i} style={{ opacity: on ? 0.4 + 0.6 * brightness : 1 }}>
          <LampSym x={x} y={TY} r={40} on={on} label={`L${i + 1}`} />
        </div>
      ))}
      <BatterySym x={(LX + RX) / 2} y={BY} />
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
      <div style={{ display: 'flex', gap: 30, marginBottom: 30, fontSize: 110 }}>
        <div>💡</div><div>💡</div><div>💡</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 88, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die Reihenschaltung
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Mehrere Lampen in einem einzigen Stromweg.
      </div>
    </AbsoluteFill>
  );
};

// ── Aufbau ─────────────────────────────────────────────────────────────
const AufbauScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Aufbau" title="Alle in einem Draht" />
    <SeriesCircuit n={3} on brightness={0.6} />
    <div style={{ position: 'absolute', left: 600, top: 250, fontSize: 30, fontWeight: 800, color: COLORS.sky }}>ein einziger Stromweg → durch jede Lampe</div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption>Der Strom hat nur einen Weg und muss durch alle Lampen nacheinander.</Caption>
  </AbsoluteFill>
);

// ── Mehr Lampen = dunkler ──────────────────────────────────────────────
const HellerScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const n = frame < dur * 0.33 ? 1 : frame < dur * 0.66 ? 2 : 3;
  const brightness = 1 / n;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Mehr Lampen → schwächer" />
      <SeriesCircuit n={n} on brightness={brightness} />
      <div style={{ position: 'absolute', left: 640, top: 250, fontSize: 34, fontWeight: 800, color: COLORS.amber }}>{n} Lampe{n > 1 ? 'n' : ''} → Helligkeit {Math.round(brightness * 100)} %</div>
      <Sfx sound="pop" at={Math.round(dur * 0.33)} volume={0.3} />
      <Sfx sound="pop" at={Math.round(dur * 0.66)} volume={0.3} />
      <Caption delay={Math.round(dur * 0.4)}>Je mehr Lampen in Reihe, desto dunkler leuchtet jede einzelne.</Caption>
    </AbsoluteFill>
  );
};

// ── Eine raus → alle aus ───────────────────────────────────────────────
const UnterbruchScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const removed = frame > dur * 0.42;
  const xs = Array.from({ length: 3 }, (_, i) => LX + ((RX - LX) * (i + 1)) / 4);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Haken" title="Eine raus → alle aus" />
      <SeriesCircuit n={3} on={!removed} brightness={0.6} />
      {removed ? (
        <>
          <div style={{ position: 'absolute', left: xs[1] - 30, top: TY - 110, fontSize: 60 }}>🔧</div>
          <div style={{ position: 'absolute', left: xs[1] - 60, top: TY - 150, fontSize: 26, fontWeight: 800, color: COLORS.red }}>herausgedreht</div>
        </>
      ) : null}
      <Sfx sound="impact" at={Math.round(dur * 0.42)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.42) + 8}>Eine kaputte Lampe unterbricht den einzigen Weg – alle gehen aus.</Caption>
    </AbsoluteFill>
  );
};

// ── Beispiel: Lichterkette ─────────────────────────────────────────────
const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beispiel" title="Die alte Lichterkette" />
      <div style={{ fontSize: 120, opacity: f }}>🎄❌💡💡💡</div>
      <div style={{ marginTop: 30, fontSize: 34, fontWeight: 700, color: COLORS.muted, opacity: f, maxWidth: 1200, textAlign: 'center' }}>
        Ein Lämpchen defekt – die ganze Kette bleibt dunkel.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Und dann heißt es: das kaputte Lämpchen suchen.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Reihenschaltung" footer="ein Weg für alle Lampen">
      Alle Lampen liegen in einem Weg.
      <br />
      Mehr Lampen → schwächer.
      <br />
      Eine fällt aus → alle aus.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übertragen" title="Wann nimmt man Reihe?" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.muted}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>💡🔗💡</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: COLORS.muted }}>selten für Beleuchtung</div>
          </div>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>🔘➡️</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: COLORS.green }}>ein Schalter für alles</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Praktisch, wenn ein einziger Schalter alles gemeinsam steuern soll.</Caption>
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
  { id: 'aufbau', C: AufbauScene, min: 220 },
  { id: 'heller', C: HellerScene, min: 300 },
  { id: 'unterbruch', C: UnterbruchScene, min: 260 },
  { id: 'beispiel', C: BeispielScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const REIHENSCHALTUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Reihenschaltung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={REIHENSCHALTUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/reihenschaltung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
