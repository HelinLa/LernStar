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
import timings from '../narration/fossile-energie.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// deterministische Rauch-/CO2-Partikel
const PUFFS = Array.from({ length: 10 }, (_, i) => ({ dx: (i % 5) * 40 - 80, spd: 1 + (i % 3) * 0.4, ph: (i * 37) % 100 }));

const Smoke: React.FC<{ x: number; y: number; label?: string }> = ({ x, y, label }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: x, top: y }}>
      {PUFFS.map((p, i) => {
        const t = ((frame * p.spd + p.ph) % 200) / 200;
        return (
          <div key={i} style={{ position: 'absolute', left: p.dx + Math.sin(t * 6) * 20, top: -t * 300, fontSize: 40, opacity: (1 - t) * 0.8 }}>💨</div>
        );
      })}
      {label && <div style={{ position: 'absolute', left: -40, top: -330, fontSize: 30, fontWeight: 900, color: COLORS.muted, width: 200, textAlign: 'center' }}>{label}</div>}
    </div>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 44 }}>
        <span>⚫</span>
        <span>🛢️</span>
        <span>🔥</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 60, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Verbrannt – und dann?
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Fossile Energieträger und CO₂
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const shrink = interpolate(frame, [30, dur - 40], [1, 0.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Der Brennstoff wird verbraucht" />
      <div style={{ position: 'absolute', left: 760, top: 620 }}>
        <Smoke x={200} y={0} />
        {/* Kohlehaufen schrumpft */}
        <div style={{ fontSize: 200 * shrink + 40, transition: 'none' }}>🪨</div>
        <div style={{ fontSize: 120, marginTop: -40 }}>🔥</div>
      </div>
      <div style={{ position: 'absolute', left: 1200, top: 460, width: 500, fontSize: 30, fontWeight: 700, color: COLORS.muted }}>
        Übrig bleiben nur Asche und Abgase.
      </div>
      <Caption delay={30}>Der Kohlehaufen wird kleiner, bis er verschwunden ist.</Caption>
    </AbsoluteFill>
  );
};

const EndlichScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const rest = interpolate(frame, [30, dur - 40], [100, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Endlich" title="Der Vorrat wächst nicht nach" />
      <div style={{ width: 900, opacity: f, marginTop: 30 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.muted, marginBottom: 10 }}>Vorrat an Kohle, Öl & Gas</div>
        <div style={{ height: 80, borderRadius: 16, background: 'rgba(255,255,255,0.07)', border: `2px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <div style={{ width: `${rest}%`, height: '100%', background: rest > 30 ? COLORS.amber : COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 20, fontSize: 30, fontWeight: 900, color: '#3a2a00' }}>{Math.round(rest)} %</div>
        </div>
      </div>
      <div style={{ marginTop: 26, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f, maxWidth: 1100, textAlign: 'center' }}>
        In Millionen Jahren entstanden – je mehr wir nutzen, desto weniger bleibt.
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={40}>Irgendwann ist der Vorrat erschöpft.</Caption>
    </AbsoluteFill>
  );
};

const Co2Scene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Abgas" title="Beim Verbrennen entsteht CO₂" />
      <Smoke x={960} y={430} label="CO₂ steigt auf" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, opacity: f }}>
        <div style={{ padding: '20px 28px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 30, fontWeight: 900 }}>Kohlenstoff (Brennstoff)</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: COLORS.muted }}>+</div>
        <div style={{ padding: '20px 28px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, fontSize: 30, fontWeight: 900 }}>Sauerstoff (Luft)</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: COLORS.muted }}>→</div>
        <div style={{ padding: '20px 28px', borderRadius: 16, background: 'rgba(239,68,68,0.16)', border: `2px solid ${COLORS.red}`, fontSize: 32, fontWeight: 900, color: COLORS.red }}>CO₂</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Das CO₂ steigt in die Atmosphäre – mit Folgen fürs Klima.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="Fossil oder regenerativ?" />
      <div style={{ display: 'flex', gap: 50, opacity: f, marginTop: 20 }}>
        <div style={{ width: 540, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 66 }}>⚫🛢️</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, color: COLORS.red }}>Fossil</div>
          <div style={{ fontSize: 25, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>endlich · setzt CO₂ frei</div>
        </div>
        <div style={{ width: 540, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 66 }}>☀️💨</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, color: COLORS.green }}>Regenerativ</div>
          <div style={{ fontSize: 25, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>erneuert sich · kaum CO₂</div>
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Darum der Umstieg auf erneuerbare Energien.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Fossile Energieträger" footer="begrenzt · beim Verbrennen entsteht CO₂">
      Kohle, Öl und Gas sind begrenzt
      <br />
      und wachsen nicht nach.
      <br />
      Beim Verbrennen entsteht CO₂.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🛢️', 'Öl- & Gasreserven'],
    ['⛽', 'Benzinverbrauch'],
    ['👣', 'CO₂-Bilanz'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Fossile Energie im Alltag" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Fossile Vorräte sind begrenzt – und ihr CO₂ zählt.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 240 },
  { id: 'endlich', C: EndlichScene, min: 260 },
  { id: 'co2', C: Co2Scene, min: 250 },
  { id: 'vergleich', C: VergleichScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const FOSSILE_ENERGIE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const FossileEnergie: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={FOSSILE_ENERGIE_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/fossile-energie/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
