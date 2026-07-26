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
import { useFade } from '../thermal';
import timings from '../narration/daemmung.timings.json';

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
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 70, marginBottom: 40, fontSize: 120 }}>
        <div>☕</div><div>🧥</div><div>🏠</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 80, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Welches Material dämmt am besten?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Ein faires Experiment: heißes Wasser lange warm halten.
      </div>
    </AbsoluteFill>
  );
};

// ── Aufbau ─────────────────────────────────────────────────────────────
const AufbauScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [['🥤', 'ohne'], ['🧻', 'Papier'], ['🥫', 'Alufolie'], ['☁️', 'Watte'], ['🧊', 'Styropor']];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Aufbau" title="Gleich viel heißes Wasser" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 30, opacity: f }}>
          {items.map((c, i) => (
            <div key={i} style={{ width: 200, padding: '24px 12px', borderRadius: 18, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 70 }}>{c[0]}</div>
              <div style={{ fontSize: 40 }}>♨️</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{c[1]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Gleiche Becher, gleiches heißes Wasser – nur die Hülle unterscheidet sich.</Caption>
    </AbsoluteFill>
  );
};

// ── Abkühlkurven ───────────────────────────────────────────────────────
const KurvenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [20, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // drei Kurven: nackt (steil), Watte (mittel), Styropor (flach)
  const x0 = 500, y0 = 300, w = 1000, h = 480;
  const curve = (drop: number) => {
    const pts = [];
    for (let i = 0; i <= 20 * p; i++) {
      const s = i / 20;
      const x = x0 + s * w;
      const y = y0 + (1 - Math.exp(-drop * s)) * h;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Messung" title="Abkühlkurven nach 10 Minuten" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={x0} y1={y0} x2={x0} y2={y0 + h} stroke={COLORS.muted} strokeWidth={3} />
        <line x1={x0} y1={y0 + h} x2={x0 + w} y2={y0 + h} stroke={COLORS.muted} strokeWidth={3} />
        <polyline points={curve(3.2)} fill="none" stroke={COLORS.red} strokeWidth={6} />
        <polyline points={curve(1.6)} fill="none" stroke={COLORS.amber} strokeWidth={6} />
        <polyline points={curve(0.7)} fill="none" stroke={COLORS.green} strokeWidth={6} />
      </svg>
      <div style={{ position: 'absolute', left: 1520, top: 320, fontSize: 26, fontWeight: 800, color: COLORS.green }}>🧊 Styropor (flach)</div>
      <div style={{ position: 'absolute', left: 1520, top: 470, fontSize: 26, fontWeight: 800, color: COLORS.amber }}>☁️ Watte</div>
      <div style={{ position: 'absolute', left: 1520, top: 640, fontSize: 26, fontWeight: 800, color: COLORS.red }}>🥤 ohne (steil)</div>
      <div style={{ position: 'absolute', left: 430, top: 280, fontSize: 22, color: COLORS.muted }}>°C</div>
      <div style={{ position: 'absolute', left: 1480, top: 800, fontSize: 22, color: COLORS.muted }}>Zeit →</div>
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.55)}>Steile Kurve = schnell kalt. Flache Kurve = bleibt lange warm.</Caption>
    </AbsoluteFill>
  );
};

// ── Sieger Styropor ────────────────────────────────────────────────────
const SiegerScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Sieger" title="Styropor gewinnt" />
      <div style={{ fontSize: 200, opacity: f }}>🧊🏆</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.green, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Viele winzige Lufteinschlüsse – und Luft leitet Wärme sehr schlecht.
      </div>
      <Sfx sound="pling" at={14} volume={0.45} />
      <Caption delay={40}>In den Luftbläschen sitzt die Wärme fest – deshalb kühlt es am langsamsten.</Caption>
    </AbsoluteFill>
  );
};

// ── Warum: ruhende Luft ────────────────────────────────────────────────
const WarumScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Geheimnis" title="Eingeschlossene Luft" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 40, opacity: f }}>
          {[['☁️', 'Watte'], ['🧊', 'Styropor'], ['🐾', 'Tierfell']].map((c, i) => (
            <div key={i} style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
              <div style={{ fontSize: 80 }}>{c[0]}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 4 }}>voller ruhender Luft</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Wo die Luft nicht strömen kann, kann sie kaum Wärme wegtragen.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Dämmung" footer="Styropor & Watte halten am längsten warm">
      Gute Dämmstoffe schließen
      <br />
      viel ruhende Luft ein.
      <br />
      Ihre Abkühlkurve fällt am flachsten.
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
    <SceneTitle kicker="Übertragen" title="Dämmung im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🧥" title="Daunenjacke" delay={10} />
        <TCard icon="🏠" title="Hausdämmung" delay={30} />
        <TCard icon="🍵" title="Thermoskanne" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall hält eingeschlossene Luft die Wärme dort, wo sie hin soll.</Caption>
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
  { id: 'aufbau', C: AufbauScene, min: 240 },
  { id: 'kurven', C: KurvenScene, min: 260 },
  { id: 'sieger', C: SiegerScene, min: 220 },
  { id: 'warum', C: WarumScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const DAEMMUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Daemmung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={DAEMMUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/daemmung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
