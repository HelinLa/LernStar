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
import timings from '../narration/energieentwertung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Deterministische Streu-Punkte (kein Math.random)
const DOTS = Array.from({ length: 26 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const r = 20 + (i % 7) * 26;
  return { dx: Math.cos(a) * r, dy: Math.sin(a) * r * 0.7, ph: (i % 5) / 5 };
});

const HeatWaves: React.FC<{ x: number; y: number; scale?: number; opacity?: number }> = ({ x, y, scale = 1, opacity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={300 * scale} height={200 * scale} viewBox="0 0 300 200" style={{ position: 'absolute', left: x, top: y, opacity }}>
      {[0, 1, 2].map((k) => {
        const off = (frame * 2 + k * 24) % 60;
        const pts = Array.from({ length: 7 }, (_, i) => {
          const px = 40 + i * 36;
          const py = 160 - off - Math.sin((i + frame / 8)) * 12;
          return `${px},${py}`;
        }).join(' ');
        return <polyline key={k} points={pts} fill="none" stroke={COLORS.red} strokeWidth={4} opacity={0.5 - k * 0.12} />;
      })}
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 130, display: 'flex', gap: 60, marginBottom: 10 }}>
        <span style={{ transform: `scale(${1 + Math.sin(frame / 10) * 0.05})`, display: 'inline-block' }}>🛑</span>
        <span>🔩</span>
        <span>🙌</span>
      </div>
      <StarLogo size={72} />
      <div style={{ marginTop: 20, fontSize: 66, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum wird alles warm?
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Reibung, Wärme und Energieentwertung
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const items = [
    ['🛑', 'Bremse', 'wird heiß'],
    ['🔩', 'Bohrer', 'glüht fast'],
    ['🙌', 'Hände', 'werden warm'],
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Überall entsteht Wärme" />
      <div style={{ position: 'absolute', top: 360, width: 1920, display: 'flex', justifyContent: 'center', gap: 60, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ position: 'relative', width: 420, padding: '34px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <HeatWaves x={60} y={-70} scale={1} opacity={0.9} />
            <div style={{ fontSize: 90 }}>{c[0]}</div>
            <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.red, marginTop: 4 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Wo Reibung wirkt, wird es warm.</Caption>
    </AbsoluteFill>
  );
};

const ZusammenhangScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Zusammenhang" title="Reibung wandelt in Wärme um" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, opacity: f, marginTop: 20 }}>
        <div style={{ width: 360, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 72 }}>🏃</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, color: COLORS.amber }}>Bewegungs­energie</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, color: COLORS.muted }}>→</div>
        <div style={{ width: 360, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 72 }}>🔥</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, color: COLORS.red }}>Wärme</div>
        </div>
      </div>
      <Sfx sound="whoosh" at={14} volume={0.3} />
      <Caption delay={40}>Die Energie geht nicht verloren – sie ändert die Form.</Caption>
    </AbsoluteFill>
  );
};

const EntwertungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const p = interpolate(frame, [30, dur - 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cx = 560, cy = 470;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Entwertung" title="Gebündelt wird zu verteilt" />
      {/* Links: hochwertige gebündelte Energie (schrumpft) */}
      <div style={{ position: 'absolute', left: cx - 90, top: cy - 90, width: 180, height: 180, borderRadius: 20, background: COLORS.amber, opacity: (1 - p) * 0.95, boxShadow: `0 0 ${40 * (1 - p)}px ${COLORS.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, color: '#3a2a00', textAlign: 'center' }}>
        geordnete Bewegung
      </div>
      {/* Rechts: entwertete verteilte Wärme (Punkte streuen auseinander) */}
      {DOTS.map((d, i) => {
        const spread = p;
        const tx = cx + 520 + d.dx * spread * 2.4;
        const ty = cy + d.dy * spread * 2.4;
        const tw = 6 + (i % 4) * 3;
        return <div key={i} style={{ position: 'absolute', left: tx, top: ty, width: tw, height: tw, borderRadius: '50%', background: COLORS.red, opacity: 0.3 + spread * 0.6 }} />;
      })}
      <div style={{ position: 'absolute', left: cx + 400, top: cy - 130, fontSize: 40, opacity: p }}>🔥</div>
      <div style={{ position: 'absolute', left: cx + 160, top: cy - 8, fontSize: 56, fontWeight: 900, color: COLORS.muted }}>→</div>
      {/* Balken nutzbar vs entwertet */}
      <div style={{ position: 'absolute', left: 1300, top: 300, display: 'flex', gap: 40, opacity: f }}>
        <BarLbl frac={1 - p} color={COLORS.sky} label="nutzbar" />
        <BarLbl frac={p} color={COLORS.red} label="entwertet" />
      </div>
      <Caption delay={30}>Die Wärme verteilt sich – die Menge bleibt, die Nutzbarkeit sinkt.</Caption>
    </AbsoluteFill>
  );
};

const BarLbl: React.FC<{ frac: number; color: string; label: string }> = ({ frac, color, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ position: 'relative', width: 76, height: 260, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `2px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${frac * 100}%`, background: color }} />
    </div>
    <div style={{ marginTop: 12, fontSize: 25, fontWeight: 800, color }}>{label}</div>
  </div>
);

const ErklaerenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Erklären" title="Energie wird entwertet" />
      <div style={{ display: 'flex', gap: 30, opacity: f, marginTop: 20 }}>
        {[
          ['✅', 'Menge bleibt', 'Energie ist erhalten', COLORS.green],
          ['📉', 'Wert sinkt', 'kaum noch nutzbar', COLORS.red],
        ].map((c, i) => (
          <div key={i} style={{ width: 500, padding: '34px 24px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[3] as string}`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{c[0]}</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 10, color: c[3] as string }}>{c[1]}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Nicht vernichtet – nur in eine wenig nutzbare Form übergegangen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Energieentwertung" footer="Menge bleibt – Nutzbarkeit sinkt">
      Reibung wandelt Bewegung in Wärme.
      <br />
      Die verteilte Wärme ist entwertet –
      <br />
      kaum noch nutzbar.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🛑', 'Bremse wird heiß'],
    ['🔥', 'Streichholz'],
    ['🛢️', 'Schmieröl senkt Reibung'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Reibung im Alltag" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 88 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Mal nutzt man die Wärme, mal will man sie vermeiden.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 230 },
  { id: 'zusammenhang', C: ZusammenhangScene, min: 210 },
  { id: 'entwertung', C: EntwertungScene, min: 300 },
  { id: 'erklaeren', C: ErklaerenScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 200 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENERGIEENTWERTUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Energieentwertung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENERGIEENTWERTUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/energieentwertung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
