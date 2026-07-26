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
import { Coil, FieldLines, useFade } from '../magnet';
import timings from '../narration/elektromagnet-6.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Batterie-Stromkreis unter der Spule
const Circuit: React.FC<{ on: boolean }> = ({ on }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <polyline points="720,620 720,860 1200,860 1200,620" fill="none" stroke={on ? COLORS.amber : COLORS.muted} strokeWidth={6} />
    <rect x="928" y="836" width="64" height="46" rx="6" fill="#334155" stroke={COLORS.muted} strokeWidth={2} />
    <text x="960" y="868" fontSize="28" fill="#fbbf24" textAnchor="middle" fontWeight="bold">⎓</text>
    {on ? [0, 0.5].map((o, i) => <circle key={i} cx={740 + o * 440} cy={860} r={7} fill="#fde68a" />) : null}
  </svg>
);
const Clips: React.FC<{ count: number }> = ({ count }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ position: 'absolute', left: 900 + (i % 5) * 28 - 56, top: 520 + Math.floor(i / 5) * 32, fontSize: 36 }}>📎</div>
    ))}
  </>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const on = Math.floor(frame / 20) % 2 === 0;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 50, marginBottom: 40, fontSize: 130 }}>
        <div>⚡</div><div style={{ opacity: on ? 1 : 0.3 }}>🧲</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Der Elektromagnet
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Strom erzeugt Magnetismus – und der lässt sich abschalten.
      </div>
    </AbsoluteFill>
  );
};

// ── Spule erzeugt Magnetfeld ───────────────────────────────────────────
const SpuleScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const on = frame > dur * 0.4;
  const p = useFade(Math.round(dur * 0.4) + 4, 24);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Spule" title="Strom erzeugt ein Magnetfeld" />
      {on ? <FieldLines cx={960} cy={470} L={200} bows={[50, 120, 200]} progress={p} /> : null}
      <Coil cx={960} cy={470} w={340} h={150} windings={7} on={on} />
      <Circuit on={on} />
      <div style={{ position: 'absolute', left: 700, top: 300, fontSize: 30, fontWeight: 800, color: on ? COLORS.green : COLORS.muted }}>
        {on ? 'Strom AN → Spule wird zum Magneten 🧲' : 'Strom aus …'}
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.4)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.4) + 8}>Die vielen Windungen bündeln das Magnetfeld – mit Nord- und Südpol.</Caption>
    </AbsoluteFill>
  );
};

// ── Eisenkern verstärkt ────────────────────────────────────────────────
const EisenkernScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const core = frame > dur * 0.45;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Verstärken" title="Mit Eisenkern viel stärker" />
      <FieldLines cx={960} cy={430} L={200} bows={core ? [40, 100, 170, 260] : [60, 140]} progress={0.9} />
      <Coil cx={960} cy={430} w={340} h={150} windings={7} on />
      <Clips count={core ? 9 : 3} />
      <div style={{ position: 'absolute', left: 700, top: 280, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>
        {core ? '+ Eisenkern → starkes Feld → 9 📎' : 'nur Spule → 3 📎'}
      </div>
      <Sfx sound="impact" at={Math.round(dur * 0.45)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.45) + 8}>Der Eisenkern macht das Magnetfeld noch einmal deutlich stärker.</Caption>
    </AbsoluteFill>
  );
};

// ── Stärke steuern ─────────────────────────────────────────────────────
const StaerkeScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Steuerbar" title="Was macht ihn stärker?" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🌀', 'mehr Windungen'], ['⚡', 'mehr Stromstärke'], ['🧲', 'Eisenkern']].map((c, i) => (
          <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
            <div style={{ fontSize: 74 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Mehr Windungen, mehr Strom, Eisenkern – jede Größe verstärkt das Feld.</Caption>
    </AbsoluteFill>
  );
};

// ── Abschaltbar ────────────────────────────────────────────────────────
const AbschaltbarScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const on = frame < dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Vorteil" title="Abschaltbar!" />
      {on ? <FieldLines cx={960} cy={430} L={200} bows={[50, 120, 200]} progress={0.9} /> : null}
      <Coil cx={960} cy={430} w={340} h={150} windings={7} on={on} />
      <Clips count={on ? 8 : 0} />
      {!on ? <div style={{ position: 'absolute', left: 860, top: 620, fontSize: 40 }}>📎📎📎 ⬇️</div> : null}
      <Circuit on={on} />
      <div style={{ position: 'absolute', left: 700, top: 280, fontSize: 32, fontWeight: 800, color: on ? COLORS.green : COLORS.red }}>
        {on ? 'Strom AN → hält' : 'Strom AUS → fällt ab'}
      </div>
      <Sfx sound={on ? 'pling' : 'impact'} at={Math.round(dur * 0.5)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Strom aus – und der Magnetismus verschwindet sofort. Das kann kein Dauermagnet.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Elektromagnet" footer="sein Vorteil: abschaltbar">
      Stromdurchflossene Spule mit
      <br />
      Eisenkern = Elektromagnet.
      <br />
      Mehr Windungen & mehr Strom → stärker.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Elektromagnete überall" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🔔" title="Türklingel" delay={10} />
        <TCard icon="🔊" title="Lautsprecher" delay={30} />
        <TCard icon="🏗️🚗" title="Schrottkran" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall, wo Magnetismus an- und ausschaltbar sein soll.</Caption>
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
  { id: 'spule', C: SpuleScene, min: 260 },
  { id: 'eisenkern', C: EisenkernScene, min: 240 },
  { id: 'staerke', C: StaerkeScene, min: 220 },
  { id: 'abschaltbar', C: AbschaltbarScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ELEKTROMAGNET6_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Elektromagnet6: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ELEKTROMAGNET6_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/elektromagnet-6/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
