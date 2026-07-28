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
import { useFade } from '../magnet';
import timings from '../narration/stromnetz.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

type Node = { icon: string; label: string; volt: string; color: string };
const NODES: Node[] = [
  { icon: '🏭', label: 'Kraftwerk', volt: '≈ 25 kV', color: COLORS.amber },
  { icon: '🗼', label: 'Höchstspannung', volt: '380 kV', color: COLORS.green },
  { icon: '🏢', label: 'Umspannwerk', volt: '110 kV', color: COLORS.sky },
  { icon: '🏘️', label: 'Mittelspannung', volt: '20 kV', color: COLORS.sky },
  { icon: '🏠', label: 'Haushalt', volt: '230 V', color: COLORS.amber },
];

const ChainRow: React.FC<{ y?: number; upto?: number }> = ({ y = 520, upto = NODES.length }) => {
  const frame = useCurrentFrame();
  const x0 = 200;
  const x1 = 1720;
  const gap = (x1 - x0) / (NODES.length - 1);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#334155" strokeWidth={12} strokeLinecap="round" />
        <line x1={x0} y1={y} x2={x1} y2={y} stroke={COLORS.indigo} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
        {Array.from({ length: 14 }).map((_, i) => {
          const p = ((frame * 7 + i * ((x1 - x0) / 14)) % (x1 - x0));
          return <circle key={i} cx={x0 + p} cy={y} r={5} fill={COLORS.amber} />;
        })}
        {/* Trafo-Symbole zwischen den Knoten */}
        {NODES.slice(0, -1).map((_, i) => {
          const mx = x0 + gap * i + gap / 2;
          const up = i === 0;
          return (
            <text key={i} x={mx} y={y - 70} fontSize={34} textAnchor="middle" fill={up ? COLORS.green : COLORS.sky}>
              {up ? '⬆' : '⬇'}
            </text>
          );
        })}
      </svg>
      {NODES.map((n, i) => {
        if (i >= upto) return null;
        const x = x0 + gap * i;
        return (
          <div key={i} style={{ position: 'absolute', left: x - 90, top: y - 150, width: 180, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{n.icon}</div>
          </div>
        );
      })}
      {NODES.map((n, i) => {
        if (i >= upto) return null;
        const x = x0 + gap * i;
        return (
          <div key={i} style={{ position: 'absolute', left: x - 100, top: y + 24, width: 200, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{n.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: n.color, marginTop: 4 }}>{n.volt}</div>
          </div>
        );
      })}
    </>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 100 }}>🏭🗼🏠</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie kommt der Strom in die Steckdose?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Das Stromnetz
      </div>
    </AbsoluteFill>
  );
};

const KetteScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const upto = Math.min(NODES.length, 1 + Math.floor(interpolate(frame, [20, 150], [0, NODES.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Reise des Stroms" title="Vom Kraftwerk bis nach Hause" />
      <ChainRow y={540} upto={upto} />
      <Caption delay={30}>Der Strom legt einen langen Weg zurück: vom Kraftwerk über riesige Leitungen und mehrere Umspannwerke bis in dein Zuhause.</Caption>
    </AbsoluteFill>
  );
};

const EbenenScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const steps = [
    { v: '380 kV', t: 'Übertragungsnetz – lange Strecken', c: COLORS.green, w: 0.95 },
    { v: '110 kV', t: 'Regionen und große Industrie', c: COLORS.sky, w: 0.72 },
    { v: '20 kV', t: 'Stadtteile und Betriebe', c: COLORS.sky, w: 0.5 },
    { v: '230 V', t: 'Haushalt – deine Steckdose', c: COLORS.amber, w: 0.3 },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Spannungsebenen" title="Stufe für Stufe heruntertransformiert" />
      <div style={{ position: 'absolute', left: 160, top: 300, width: 1600, opacity: f }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 18 }}>
            <div style={{ width: 200, fontSize: 40, fontWeight: 900, color: s.c, textAlign: 'right' }}>{s.v}</div>
            <div style={{ height: 46, width: `${s.w * 900}px`, borderRadius: 10, background: s.c, opacity: 0.8 }} />
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>{s.t}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={30}>In mehreren Umspannwerken wird die Spannung Stufe für Stufe gesenkt – von 380 000 Volt bis auf die 230 Volt der Steckdose.</Caption>
    </AbsoluteFill>
  );
};

const WarumScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Warum so aufwändig" title="Transport hoch, Nutzung niedrig" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.green, marginBottom: 10 }}>🗼 Für den Transport</div>
          <div style={{ fontSize: 25, fontWeight: 700, color: COLORS.muted }}>Hohe Spannung, kleiner Strom – wenig Verlust auf langen Leitungen.</div>
        </div>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.amber, marginBottom: 10 }}>🏠 Für den Haushalt</div>
          <div style={{ fontSize: 25, fontWeight: 700, color: COLORS.muted }}>Niedrige Spannung – sicher für Menschen und Geräte.</div>
        </div>
      </div>
      <Caption delay={30}>Das Netz vereint beides: Hochspannung, um verlustarm zu transportieren, und niedrige Spannung, damit der Strom zuhause sicher ist.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Das Stromnetz" footer="Generator → Hochspannung → Umspannwerke → 230 V">
      Im Kraftwerk erzeugt, hochtransformiert, verlustarm
      <br />
      transportiert und in Stufen wieder heruntergesetzt –
      <br />
      so kommt der Strom in die Steckdose.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔌', 'Zuverlässig', 'rund um die Uhr Strom'],
    ['☀️', 'Einspeisung', 'auch aus Solar & Wind'],
    ['🔋', 'Zukunft', 'Speicher & smartes Netz'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Eines der größten Bauwerke der Technik" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Das Stromnetz verbindet Kraftwerke, Windräder und Millionen Haushalte – ein riesiges, fein abgestimmtes System.</Caption>
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
  { id: 'kette', C: KetteScene, min: 260 },
  { id: 'ebenen', C: EbenenScene, min: 250 },
  { id: 'warum', C: WarumScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STROMNETZ_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Stromnetz: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STROMNETZ_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/stromnetz/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
