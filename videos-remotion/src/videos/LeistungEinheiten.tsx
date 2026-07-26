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
import timings from '../narration/leistung-einheiten.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Nameplate: React.FC<{ emoji: string; name: string; power: string; color: string }> = ({ emoji, name, power, color }) => (
  <div style={{ width: 380, padding: '26px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${color}`, textAlign: 'center' }}>
    <div style={{ fontSize: 74 }}>{emoji}</div>
    <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{name}</div>
    <div style={{ marginTop: 10, padding: '8px 0', borderRadius: 10, background: 'rgba(255,255,255,0.06)', fontSize: 30, fontWeight: 900, color }}>{power}</div>
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 44 }}>
        <span>💨</span>
        <span>🚗</span>
        <span>🛠️</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 60, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Was heißt „100 PS" oder „2000 Watt"?
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Einheiten der Leistung
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Leistung steht auf dem Typenschild" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        <Nameplate emoji="💨" name="Föhn" power="2000 W" color={COLORS.amber} />
        <Nameplate emoji="🛠️" name="Bohrmaschine" power="600 W" color={COLORS.sky} />
        <Nameplate emoji="🚗" name="Auto" power="100 PS" color={COLORS.green} />
      </div>
      <Caption delay={40}>Alle Angaben beschreiben dasselbe: die Leistung.</Caption>
    </AbsoluteFill>
  );
};

const BedeutungScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Bedeutung" title="Leistung = Energie pro Sekunde" />
      <div style={{ fontSize: 48, fontWeight: 900, opacity: f, textAlign: 'center', marginTop: 20 }}>
        2000 W = <span style={{ color: COLORS.amber }}>2000 Joule</span> jede Sekunde
      </div>
      <div style={{ marginTop: 30, display: 'flex', gap: 16, opacity: f }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} style={{ width: 90, height: 90, borderRadius: 14, background: COLORS.amber, opacity: 0.4 + i * 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#3a2a00' }}>J</div>
        ))}
        <div style={{ fontSize: 60, color: COLORS.muted, alignSelf: 'center' }}>…</div>
      </div>
      <div style={{ marginTop: 26, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>Je größer die Zahl, desto mehr Energie fließt pro Sekunde.</div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Mehr Watt heißt: kräftiger oder schneller.</Caption>
    </AbsoluteFill>
  );
};

const UmrechnenScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Umrechnen" title="Watt, Kilowatt und PS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, opacity: f, marginTop: 10 }}>
        <div style={{ padding: '18px 40px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, fontSize: 38, fontWeight: 900 }}>1000 W = 1 kW</div>
        <div style={{ padding: '18px 40px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 38, fontWeight: 900 }}>1 PS ≈ 0,74 kW</div>
        <div style={{ padding: '18px 40px', borderRadius: 16, background: 'rgba(251,191,36,0.12)', border: `2px solid ${COLORS.amber}`, fontSize: 38, fontWeight: 900 }}>100 PS ≈ 74 kW = 74 000 W</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={44}>PS ist die alte Einheit „Pferdestärke".</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const grow = interpolate(frame, [10, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const devs = [
    { name: '🛠️ Bohrmaschine', w: 600 },
    { name: '💨 Föhn', w: 2000 },
    { name: '🍳 Herd', w: 2000 },
    { name: '🚗 Auto (100 PS)', w: 74000 },
  ];
  const max = 74000;
  const fmt = (w: number) => (w >= 1000 ? (w / 1000).toLocaleString('de-DE') + ' kW' : w + ' W');
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleichen" title="So verschieden sind die Leistungen" />
      <div style={{ position: 'absolute', left: 200, top: 320, right: 200, opacity: f }}>
        {devs.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
            <div style={{ width: 380, fontSize: 30, fontWeight: 800, textAlign: 'right' }}>{d.name}</div>
            <div style={{ flex: 1, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.07)', border: `2px solid ${COLORS.border}`, overflow: 'hidden' }}>
              <div style={{ width: `${(d.w / max) * 100 * grow}%`, height: '100%', background: d.w >= 50000 ? COLORS.green : COLORS.amber }} />
            </div>
            <div style={{ width: 150, fontSize: 28, fontWeight: 900, color: d.w >= 50000 ? COLORS.green : COLORS.amber }}>{fmt(d.w)}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={40}>Ein Auto bringt ein Vielfaches eines Föhns.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Einheiten der Leistung" footer="1000 W = 1 kW · 1 PS ≈ 0,74 kW">
      Watt, Kilowatt und PS
      <br />
      messen die Leistung –
      <br />
      Energie pro Zeit.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏷️', 'Typenschild'],
    ['🏎️', 'Motorvergleich'],
    ['🔌', 'Sicherung'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Leistungsangaben im Alltag" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Überall verrät die Leistung, wie schnell Energie fließt.</Caption>
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
  { id: 'bedeutung', C: BedeutungScene, min: 240 },
  { id: 'umrechnen', C: UmrechnenScene, min: 250 },
  { id: 'vergleich', C: VergleichScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LEISTUNG_EINHEITEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const LeistungEinheiten: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LEISTUNG_EINHEITEN_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/leistung-einheiten/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
