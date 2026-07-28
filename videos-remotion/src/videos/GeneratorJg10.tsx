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
import timings from '../narration/generator-jg10.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const OX = 620;
const OY = 560;
const RR = 150;

const GenRig: React.FC<{ angleDeg: number }> = ({ angleDeg }) => {
  const a = (angleDeg * Math.PI) / 180;
  const Ax = OX + RR * Math.cos(a);
  const Ay = OY + RR * Math.sin(a);
  const Bx = OX - RR * Math.cos(a);
  const By = OY - RR * Math.sin(a);
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <rect x={OX - 380} y={OY - 200} width={80} height={400} rx={10} fill={COLORS.red} />
      <rect x={OX + 300} y={OY - 200} width={80} height={400} rx={10} fill={COLORS.sky} />
      <text x={OX - 340} y={OY} fontSize={48} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">N</text>
      <text x={OX + 340} y={OY} fontSize={48} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">S</text>
      {[-130, -65, 0, 65, 130].map((dy, i) => (
        <line key={i} x1={OX - 290} y1={OY + dy} x2={OX + 290} y2={OY + dy} stroke={COLORS.sky} strokeWidth={2} opacity={0.3} />
      ))}
      <line x1={Ax} y1={Ay} x2={Bx} y2={By} stroke="#f59e0b" strokeWidth={14} strokeLinecap="round" />
      <circle cx={Ax} cy={Ay} r={20} fill="none" stroke="#f59e0b" strokeWidth={7} />
      <circle cx={Bx} cy={By} r={20} fill="none" stroke="#f59e0b" strokeWidth={7} />
      <circle cx={OX} cy={OY} r={12} fill={COLORS.ink} stroke={COLORS.muted} strokeWidth={2} />
    </svg>
  );
};

// Scrollende Sinuskurve (Wechselspannung)
const SineTrace: React.FC<{ x0: number; y0: number; w: number; h: number; omega: number; amp: number; color?: string }> = ({ x0, y0, w, h, omega, amp, color = COLORS.green }) => {
  const frame = useCurrentFrame();
  const pxPerFrame = 3;
  const pts: string[] = [];
  for (let px = 0; px <= w; px += 4) {
    const t = frame - (w - px) / pxPerFrame;
    const y = y0 - amp * (h / 2) * Math.sin(t * omega);
    pts.push(`${x0 + px},${y}`);
  }
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={COLORS.border} strokeWidth={2} />
      <line x1={x0} y1={y0 - h / 2} x2={x0} y2={y0 + h / 2} stroke={COLORS.border} strokeWidth={2} />
      <text x={x0 - 16} y={y0 - h / 2 + 8} fontSize={22} fill={COLORS.green} textAnchor="end">+U</text>
      <text x={x0 - 16} y={y0 + h / 2} fontSize={22} fill={COLORS.red} textAnchor="end">−U</text>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={4} />
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
      <div style={{ fontSize: 130, transform: `rotate(${frame * 6}deg)` }}>🌀</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie erzeugt ein Kraftwerk ständig Strom?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Generator
      </div>
    </AbsoluteFill>
  );
};

const PrinzipScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const angle = frame * 3;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Prinzip" title="Die Umkehrung des Motors" />
      <GenRig angleDeg={angle} />
      <div style={{ position: 'absolute', left: 1120, top: 420, width: 660, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Beim Motor: Strom rein → Drehung. Beim Generator dreht man die Spule → Strom kommt heraus.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 24, fontWeight: 800 }}>Die drehende Spule ändert ständig das Feld durch sich – dadurch wird eine Spannung induziert.</div>
      </div>
      <Caption delay={30}>Ein Generator ist ein umgekehrter Motor: Man dreht die Spule im Magnetfeld – und es entsteht Strom.</Caption>
    </AbsoluteFill>
  );
};

const WechselScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const angle = frame * 3;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Die Spannung wechselt ständig" />
      <GenRig angleDeg={angle} />
      <SineTrace x0={1120} y0={560} w={620} h={300} omega={0.105} amp={0.9} />
      <div style={{ position: 'absolute', left: 1120, top: 730, width: 640, fontSize: 25, fontWeight: 800, color: COLORS.muted }}>
        Bei jeder halben Umdrehung kehrt sich die Spannung um → eine Sinuskurve. Das ist Wechselspannung.
      </div>
      <Caption delay={30}>Mit jeder halben Umdrehung kippt die Spannung von Plus nach Minus – es entsteht eine wechselnde Spannung.</Caption>
    </AbsoluteFill>
  );
};

const SchleifringeScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Abgriff" title="Schleifringe – der Strom wechselt" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* zwei durchgehende Ringe */}
        <circle cx={640} cy={520} r={70} fill="none" stroke={COLORS.amber} strokeWidth={22} />
        <circle cx={640} cy={640} r={70} fill="none" stroke={COLORS.sky} strokeWidth={22} />
        <rect x={500} y={508} width={40} height={24} rx={5} fill={COLORS.muted} />
        <rect x={500} y={628} width={40} height={24} rx={5} fill={COLORS.muted} />
      </svg>
      <div style={{ position: 'absolute', left: 1080, top: 430, width: 700, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Der Generator nutzt zwei durchgehende Schleifringe. Die Spannung bleibt eine Wechselspannung.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 23, fontWeight: 800 }}>Zum Vergleich: Ein geteilter Ring (Kommutator) würde daraus pulsierenden Gleichstrom machen – wie beim Motor.</div>
      </div>
      <Caption delay={30}>Durchgehende Schleifringe greifen die Spannung ab, ohne sie umzupolen – so liefert der Generator Wechselstrom.</Caption>
    </AbsoluteFill>
  );
};

const EinflussScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const fast = frame > 90;
  const angle = frame * (fast ? 7 : 3);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Einfluss" title="Schneller drehen – mehr Spannung, höhere Frequenz" />
      <GenRig angleDeg={angle} />
      <SineTrace x0={1120} y0={560} w={620} h={320} omega={fast ? 0.24 : 0.105} amp={fast ? 1 : 0.5} />
      <div style={{ position: 'absolute', left: 1120, top: 740, width: 640, fontSize: 26, fontWeight: 800, color: fast ? COLORS.green : COLORS.muted }}>
        {fast ? '🔺 schneller → höhere Spannung und mehr Schwingungen' : 'langsam → kleine Spannung'}
      </div>
      <Sfx sound="pop" at={90} volume={0.3} />
      <Caption delay={30}>Dreht man schneller, wird die Spannung größer und wechselt öfter. Kraftwerke halten dafür genau 50 Hertz.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Der Generator" footer="Bewegungsenergie → elektrische Energie (Wechselspannung)">
      Dreht sich eine Spule im Magnetfeld,
      <br />
      wird laufend eine Wechselspannung induziert.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏭', 'Kraftwerk', 'Turbine dreht Generator'],
    ['💨', 'Windrad', 'Wind dreht Generator'],
    ['🚲', 'Fahrraddynamo', 'kleiner Generator'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Fast aller Strom kommt von Generatoren" />
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
      <Caption delay={40}>Egal ob Kohle, Wind oder Wasser – am Ende dreht immer etwas einen Generator.</Caption>
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
  { id: 'prinzip', C: PrinzipScene, min: 250 },
  { id: 'wechsel', C: WechselScene, min: 250 },
  { id: 'schleifringe', C: SchleifringeScene, min: 250 },
  { id: 'einfluss', C: EinflussScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const GENERATOR_JG10_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const GeneratorJg10: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={GENERATOR_JG10_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/generator-jg10/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
