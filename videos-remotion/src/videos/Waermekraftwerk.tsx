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
import { useFade } from '../forces';
import timings from '../narration/waermekraftwerk.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Prozess-Diagramm: Wärme -> Dampf -> Turbine -> Generator -> Strom
const PlantDiagram: React.FC<{ fuel?: string; spin?: number }> = ({ fuel = '🔥', spin = 6 }) => {
  const frame = useCurrentFrame();
  const turb = frame * spin;
  const Stage: React.FC<{ x: number; label: string; sub: string; color: string; children?: React.ReactNode }> = ({ x, label, sub, color, children }) => (
    <div style={{ position: 'absolute', left: x, top: 380, width: 250, textAlign: 'center' }}>
      <div style={{ width: 180, height: 180, margin: '0 auto', borderRadius: 20, background: COLORS.panel, border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>{children}</div>
      <div style={{ marginTop: 12, fontSize: 26, fontWeight: 900, color }}>{label}</div>
      <div style={{ marginTop: 2, fontSize: 21, fontWeight: 700, color: COLORS.muted }}>{sub}</div>
    </div>
  );
  const arrow = (x: number) => (
    <div style={{ position: 'absolute', left: x, top: 455, fontSize: 46, color: COLORS.muted }}>→</div>
  );
  return (
    <AbsoluteFill>
      <Stage x={110} label="Kessel" sub="Wärme → Dampf" color={COLORS.red}>
        <div style={{ fontSize: 70 }}>{fuel}</div>
        <div style={{ position: 'absolute', top: -6, fontSize: 30 }}>💨</div>
      </Stage>
      {arrow(320)}
      <Stage x={430} label="Turbine" sub="Dampf dreht" color={COLORS.sky}>
        <svg width={150} height={150} viewBox="0 0 150 150">
          <g transform={`rotate(${turb} 75 75)`}>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <rect key={a} x={71} y={20} width={8} height={55} rx={4} fill={COLORS.sky} transform={`rotate(${a} 75 75)`} />
            ))}
          </g>
          <circle cx={75} cy={75} r={12} fill={COLORS.ink} />
        </svg>
      </Stage>
      {arrow(640)}
      <Stage x={750} label="Generator" sub="Bewegung → Strom" color={COLORS.indigo}>
        <svg width={150} height={150} viewBox="0 0 150 150">
          <rect x={40} y={45} width={70} height={60} rx={8} fill="none" stroke={COLORS.indigo} strokeWidth={4} />
          <g transform={`rotate(${turb} 75 75)`}>
            <rect x={68} y={50} width={14} height={25} fill={COLORS.red} />
            <rect x={68} y={75} width={14} height={25} fill={COLORS.sky} />
          </g>
        </svg>
      </Stage>
      {arrow(1060)}
      <Stage x={1170} label="Strom" sub="ins Netz" color={COLORS.amber}>
        <div style={{ fontSize: 70 }}>⚡</div>
      </Stage>
      {arrow(1480)}
      <Stage x={1560} label="Haushalt" sub="Licht & Geräte" color={COLORS.green}>
        <div style={{ fontSize: 70 }}>🏠</div>
      </Stage>
    </AbsoluteFill>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 40 }}>
        <span>🏭</span>
        <span>⛽</span>
        <span>☢️</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 60, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Ein Prinzip für viele Kraftwerke
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Wärme → Dampf → Turbine → Strom
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Innen fast immer gleich" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🏭', 'Kohle'], ['⛽', 'Gas'], ['☢️', 'Kernkraft']].map((c, i) => (
          <div key={i} style={{ width: 380, padding: '28px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.sky, marginTop: 8 }}>Kessel · Turbine · Generator</div>
          </div>
        ))}
      </div>
      <Caption delay={40}>Egal welcher Brennstoff – dieselben Bauteile.</Caption>
    </AbsoluteFill>
  );
};

const KetteScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Der Ablauf" title="Wärme → Dampf → Turbine → Generator → Strom" />
    <PlantDiagram fuel="🔥" spin={7} />
    <Caption delay={30}>Wärme wird zu Bewegung, Bewegung zu Strom.</Caption>
  </AbsoluteFill>
);

const BrennstoffScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Ausprobieren" title="Nur die Wärmequelle ändert sich" />
      <div style={{ display: 'flex', gap: 16, opacity: f, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100 }}>
        {[['⚫', 'Kohle'], ['🔥', 'Gas'], ['🌱', 'Biomasse'], ['☢️', 'Kernspaltung']].map((c, i) => (
          <div key={i} style={{ padding: '16px 26px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.red}`, fontSize: 26, fontWeight: 800 }}>{c[0]} {c[1]}</div>
        ))}
      </div>
      <div style={{ fontSize: 44, color: COLORS.muted, margin: '18px 0' }}>↓</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: f, fontSize: 27, fontWeight: 800 }}>
        <span style={{ padding: '14px 22px', borderRadius: 12, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>💨 Dampf</span>
        <span style={{ color: COLORS.muted }}>→</span>
        <span style={{ padding: '14px 22px', borderRadius: 12, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>⚙️ Turbine</span>
        <span style={{ color: COLORS.muted }}>→</span>
        <span style={{ padding: '14px 22px', borderRadius: 12, background: COLORS.panel, border: `2px solid ${COLORS.indigo}` }}>🔌 Generator</span>
        <span style={{ color: COLORS.muted }}>→</span>
        <span style={{ padding: '14px 22px', borderRadius: 12, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>⚡ Strom</span>
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Ab dem heißen Dampf ist die Kette immer gleich.</Caption>
    </AbsoluteFill>
  );
};

const WirkungsgradScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  const grow = interpolate(frame, [10, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Nicht perfekt" title="Viel Abwärme über die Kühltürme" />
      <div style={{ fontSize: 130, opacity: f }}>🏭💨</div>
      <div style={{ marginTop: 10, width: 900, opacity: f }}>
        <div style={{ display: 'flex', height: 56, borderRadius: 14, overflow: 'hidden', border: `2px solid ${COLORS.border}` }}>
          <div style={{ width: `${40 * grow}%`, background: COLORS.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Strom 40 %</div>
          <div style={{ flex: 1, background: COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Abwärme 60 %</div>
        </div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Wirkungsgrad rund 40 % – der Rest geht als Wärme verloren.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Das Wärmekraftwerk" footer="Wärme → Dampf → Turbine → Generator → Strom">
      Wärme erhitzt Wasser zu Dampf,
      <br />
      der Dampf treibt die Turbine,
      <br />
      die Turbine dreht den Generator.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['⚫', 'Kohle'],
    ['🔥', 'Gas'],
    ['🌱', 'Biomasse'],
    ['☢️', 'Kernkraft'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Gleiches Prinzip, andere Wärmequelle" />
      <div style={{ display: 'flex', gap: 30, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 330, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Alle liefern Wärme – der Rest der Kette ist gleich.</Caption>
    </AbsoluteFill>
  );
};

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
  { id: 'intro', C: Intro, min: 150 },
  { id: 'beobachten', C: BeobachtenScene, min: 220 },
  { id: 'kette', C: KetteScene, min: 300 },
  { id: 'brennstoff', C: BrennstoffScene, min: 250 },
  { id: 'wirkungsgrad', C: WirkungsgradScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WAERMEKRAFTWERK_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Waermekraftwerk: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WAERMEKRAFTWERK_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/waermekraftwerk/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
