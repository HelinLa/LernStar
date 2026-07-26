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
import timings from '../narration/wirkungsgrad-verluste.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 50, marginBottom: 6 }}>
        <span>📱</span>
        <span style={{ transform: `translateY(${Math.sin(frame / 9) * 6}px)` }}>💻</span>
        <span>🔌</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 62, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Keine Maschine ist perfekt
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Wohin geht die Energie verloren?
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['📱', 'Handy beim Laden'],
    ['💻', 'Laptop'],
    ['🔌', 'Ladegerät'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Fast alles gibt Abwärme ab" />
      <div style={{ display: 'flex', gap: 44, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.red, marginTop: 6 }}>🔥 wird warm</div>
          </div>
        ))}
      </div>
      <Caption delay={40}>Abwärme ist Energie, die du eigentlich nicht wolltest.</Caption>
    </AbsoluteFill>
  );
};

const VerlusteScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Verluste" title="Wo geht die Energie hin?" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 10 }}>
        <div style={{ width: 300, padding: '26px', borderRadius: 20, background: COLORS.indigoDeep, textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.ink }}>zugeführt</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.ink, marginTop: 4 }}>100 %</div>
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.muted }}>→</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '16px 24px', borderRadius: 16, background: 'rgba(34,197,94,0.16)', border: `2px solid ${COLORS.green}`, fontSize: 27, fontWeight: 800, color: COLORS.green }}>✅ Nutzenergie</div>
          <div style={{ padding: '16px 24px', borderRadius: 16, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, fontSize: 27, fontWeight: 800, color: COLORS.red }}>🔥 Reibungswärme</div>
          <div style={{ padding: '16px 24px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 27, fontWeight: 800, color: COLORS.muted }}>🔊 Geräusch · Abstrahlung</div>
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Der Rest verlässt das Gerät als entwertete Wärme.</Caption>
    </AbsoluteFill>
  );
};

const RechnenScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Rechnen" title="Wirkungsgrad eines Motors" />
      <div style={{ display: 'flex', gap: 30, opacity: f, marginTop: 10 }}>
        <div style={{ width: 300, padding: '22px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.muted }}>zugeführt</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.indigo }}>1000 J</div>
        </div>
        <div style={{ width: 300, padding: '22px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.muted }}>nutzbar</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.green }}>250 J</div>
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: 44, fontWeight: 900, opacity: f }}>
        η = 250 J ÷ 1000 J = 0,25 = <span style={{ color: COLORS.amber }}>25 %</span>
      </div>
      <div style={{ marginTop: 16, fontSize: 30, fontWeight: 700, color: COLORS.red, opacity: f }}>
        → 75 % gehen als Wärme verloren
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={44}>Wirkungsgrad = nutzbar geteilt durch zugeführt.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const devs = [
    { name: 'Glühlampe', eta: 5, e: '💡' },
    { name: 'Auto-Motor', eta: 25, e: '🚗' },
    { name: 'LED', eta: 40, e: '🔆' },
    { name: 'Elektromotor', eta: 90, e: '⚙️' },
  ];
  const grow = interpolate(frame, [10, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleichen" title="Nie 100 % – aber große Unterschiede" />
      <div style={{ position: 'absolute', left: 200, top: 300, right: 200, opacity: f }}>
        {devs.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26 }}>
            <div style={{ width: 320, fontSize: 30, fontWeight: 800, textAlign: 'right' }}>{d.e} {d.name}</div>
            <div style={{ flex: 1, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.07)', border: `2px solid ${COLORS.border}`, overflow: 'hidden' }}>
              <div style={{ width: `${d.eta * grow}%`, height: '100%', background: d.eta >= 80 ? COLORS.green : d.eta >= 30 ? COLORS.amber : COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14 }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#0f172a' }}>{Math.round(d.eta * grow)} %</span>
              </div>
            </div>
          </div>
        ))}
        {/* 100%-Marke */}
        <div style={{ position: 'absolute', right: 0, top: -40, bottom: -10, borderLeft: `3px dashed ${COLORS.muted}` }} />
        <div style={{ position: 'absolute', right: -16, top: -74, fontSize: 24, fontWeight: 800, color: COLORS.muted }}>100 %</div>
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={40}>Ein Rest geht immer als Wärme verloren.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kein Gerät ist perfekt" footer="Wirkungsgrad immer < 100 %">
      Ein Teil der Energie wird
      <br />
      stets in Wärme entwertet.
      <br />
      Darum erreicht nichts 100 %.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const labels = [
    ['A', COLORS.green],
    ['B', '#84cc16'],
    ['C', COLORS.amber],
    ['D', '#f59e0b'],
    ['E', '#f97316'],
    ['F', '#ef4444'],
    ['G', COLORS.red],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Das Energielabel" />
      <div style={{ fontSize: 90, opacity: f }}>🏷️</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: f, marginTop: 20 }}>
        {labels.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 120 + i * 60, height: 40, background: l[1] as string, borderRadius: 8, display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: '#0f172a' }}>{l[0]}</span>
            </div>
            {i === 0 && <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.green }}>sparsam · hoher Wirkungsgrad</span>}
            {i === 6 && <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.red }}>viel Verlust</span>}
          </div>
        ))}
      </div>
      <Caption delay={40}>Von A bis G: wie sparsam ein Gerät mit Energie umgeht.</Caption>
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
  { id: 'verluste', C: VerlusteScene, min: 240 },
  { id: 'rechnen', C: RechnenScene, min: 280 },
  { id: 'vergleich', C: VergleichScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WIRKUNGSGRAD_VERLUSTE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const WirkungsgradVerluste: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WIRKUNGSGRAD_VERLUSTE_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/wirkungsgrad-verluste/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
