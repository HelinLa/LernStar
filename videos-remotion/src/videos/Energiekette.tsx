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
import timings from '../narration/energiekette.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Kette aus Stationen mit animiertem Energiefluss
const Chain: React.FC<{ stations: { e: string; l: string }[]; y?: number; active?: number; flow?: boolean }> = ({ stations, y = 500, active, flow = true }) => {
  const frame = useCurrentFrame();
  const n = stations.length;
  const x0 = 220;
  const x1 = 1700;
  const gap = (x1 - x0) / (n - 1);
  return (
    <AbsoluteFill>
      {/* Verbinder mit fließenden Punkten */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {stations.slice(0, -1).map((_, i) => {
          const sx = x0 + i * gap + 70;
          const ex = x0 + (i + 1) * gap - 70;
          return <line key={i} x1={sx} y1={y} x2={ex} y2={y} stroke={COLORS.border} strokeWidth={6} />;
        })}
        {flow && stations.slice(0, -1).map((_, i) => {
          const sx = x0 + i * gap + 70;
          const ex = x0 + (i + 1) * gap - 70;
          const t = ((frame * 0.02 + i * 0.25) % 1);
          const px = sx + (ex - sx) * t;
          return <circle key={`d${i}`} cx={px} cy={y} r={9} fill={COLORS.amber} />;
        })}
      </svg>
      {stations.map((s, i) => {
        const cx = x0 + i * gap;
        const on = active === undefined || i <= active;
        return (
          <div key={i} style={{ position: 'absolute', left: cx - 90, top: y - 90, width: 180, textAlign: 'center', opacity: on ? 1 : 0.3 }}>
            <div style={{ width: 140, height: 140, margin: '0 auto', borderRadius: 24, background: COLORS.panel, border: `3px solid ${on ? COLORS.amber : COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 74 }}>{s.e}</div>
            <div style={{ marginTop: 12, fontSize: 24, fontWeight: 800 }}>{s.l}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const KETTE = [
  { e: '⛏️', l: 'Quelle' },
  { e: '🏭', l: 'Kraftwerk' },
  { e: '🗼', l: 'Stromnetz' },
  { e: '🔌', l: 'Steckdose' },
  { e: '💡', l: 'Lampe' },
];

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const on = frame % 60 < 40;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 140, filter: on ? `drop-shadow(0 0 30px ${COLORS.amber})` : 'none', opacity: on ? 1 : 0.5 }}>💡</div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 62, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Woher kommt der Strom?
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Weg der Energie bis zur Steckdose
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Die Steckdose ist nicht der Anfang" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 20 }}>
        <div style={{ fontSize: 120 }}>🔌</div>
        <div style={{ fontSize: 60, color: COLORS.muted }}>←</div>
        <div style={{ fontSize: 80, opacity: 0.5 }}>❓</div>
      </div>
      <div style={{ marginTop: 24, fontSize: 32, fontWeight: 700, color: COLORS.muted, opacity: f, maxWidth: 1200, textAlign: 'center' }}>
        Hinter der Steckdose steckt ein langer Weg, den die Energie zurücklegt.
      </div>
      <Caption delay={40}>Woher kommt der Strom, bevor er bei dir ankommt?</Caption>
    </AbsoluteFill>
  );
};

const KetteScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const active = Math.min(4, Math.floor(interpolate(frame, [30, dur - 60], [0, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Energiekette" title="Quelle → Kraftwerk → Netz → Steckdose" />
      <Chain stations={KETTE} y={540} active={active} />
      <Caption delay={30}>Die Energie legt einen langen Weg zurück.</Caption>
    </AbsoluteFill>
  );
};

const UmwandlungScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Wichtig" title="Umgewandelt, nicht erzeugt" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: f, marginTop: 20 }}>
        <div style={{ width: 300, padding: '24px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>⛏️</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>Energie der Quelle</div>
        </div>
        <div style={{ fontSize: 46, color: COLORS.muted }}>→</div>
        <div style={{ width: 300, padding: '24px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>⚡</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>elektrische Energie</div>
        </div>
        <div style={{ fontSize: 46, color: COLORS.muted }}>→</div>
        <div style={{ width: 300, padding: '24px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>💡</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>Licht</div>
        </div>
      </div>
      <div style={{ marginTop: 28, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: f }}>
        Ein Kraftwerk erzeugt keine Energie aus dem Nichts.
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Energie wird umgewandelt und transportiert.</Caption>
    </AbsoluteFill>
  );
};

const QuellenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const quellen = ['⛏️ Kohle', '💨 Wind', '☀️ Sonne', '💧 Wasser'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="Verschiedener Anfang, gleiche Kette" />
      <div style={{ display: 'flex', gap: 16, opacity: f, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 900 }}>
        {quellen.map((q, i) => (
          <div key={i} style={{ padding: '16px 24px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 26, fontWeight: 800 }}>{q}</div>
        ))}
      </div>
      <div style={{ fontSize: 46, color: COLORS.muted, margin: '18px 0' }}>↓</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: f, fontSize: 28, fontWeight: 800 }}>
        <span style={{ padding: '14px 22px', borderRadius: 12, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>🏭 Kraftwerk</span>
        <span style={{ color: COLORS.muted }}>→</span>
        <span style={{ padding: '14px 22px', borderRadius: 12, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>🗼 Netz</span>
        <span style={{ color: COLORS.muted }}>→</span>
        <span style={{ padding: '14px 22px', borderRadius: 12, background: COLORS.panel, border: `2px solid ${COLORS.green}` }}>🔌 Steckdose</span>
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Nur die Energiequelle am Anfang unterscheidet sich.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Energiekette" footer="Quelle → Kraftwerk → Netz → Steckdose">
      Strom entsteht nicht in der Steckdose.
      <br />
      Energie wird umgewandelt und
      <br />
      transportiert, nicht erzeugt.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔌', 'Steckdose'],
    ['⚡', 'Stromausfall = Kette unterbrochen'],
    ['🏭', 'weiter Weg zum Kraftwerk'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Weg wird sichtbar" />
      <div style={{ display: 'flex', gap: 36, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Hinter jeder Steckdose beginnt ein weiter Weg.</Caption>
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
  { id: 'umwandlung', C: UmwandlungScene, min: 260 },
  { id: 'quellen', C: QuellenScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENERGIEKETTE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Energiekette: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENERGIEKETTE_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/energiekette/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
