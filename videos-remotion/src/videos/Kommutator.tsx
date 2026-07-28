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
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo, BackgroundMusic, Sfx, Arrow } from '../components';
import { useFade } from '../magnet';
import timings from '../narration/kommutator.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const OX = 700;
const OY = 560;
const RR = 155;

// mode 'fixed': ⊗ klebt an Leiter A → Kräfte kippen die Spule nur hin und her.
// mode 'comm': der obere Leiter ist immer ⊗ (Strom wird umgepolt) → Dauerdrehung.
const CommRig: React.FC<{ angleDeg: number; mode: 'fixed' | 'comm' }> = ({ angleDeg, mode }) => {
  const a = (angleDeg * Math.PI) / 180;
  const Ax = OX + RR * Math.cos(a);
  const Ay = OY + RR * Math.sin(a);
  const Bx = OX - RR * Math.cos(a);
  const By = OY - RR * Math.sin(a);
  // Welcher Leiter ist ⊗ (Strom in die Ebene)?
  let aInto: boolean;
  if (mode === 'fixed') aInto = true; // immer A
  else aInto = Ay < By; // der obere Leiter ist ⊗
  const bInto = !aInto;
  const dot = (x: number, y: number, into: boolean) => (
    <>
      <circle cx={x} cy={y} r={25} fill={COLORS.panelSolid} stroke={COLORS.amber} strokeWidth={4} />
      {into ? (
        <>
          <line x1={x - 12} y1={y - 12} x2={x + 12} y2={y + 12} stroke={COLORS.amber} strokeWidth={4} />
          <line x1={x + 12} y1={y - 12} x2={x - 12} y2={y + 12} stroke={COLORS.amber} strokeWidth={4} />
        </>
      ) : (
        <circle cx={x} cy={y} r={7} fill={COLORS.amber} />
      )}
    </>
  );
  // Kraft auf ⊗-Leiter = nach oben, auf ⊙-Leiter = nach unten
  const fA = aInto ? -1 : 1; // -1 = hoch
  const fB = bInto ? -1 : 1;
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <rect x={OX - 400} y={OY - 200} width={80} height={400} rx={10} fill={COLORS.red} />
        <rect x={OX + 320} y={OY - 200} width={80} height={400} rx={10} fill={COLORS.sky} />
        <text x={OX - 360} y={OY} fontSize={48} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">N</text>
        <text x={OX + 360} y={OY} fontSize={48} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">S</text>
        {[-120, -60, 0, 60, 120].map((dy, i) => (
          <line key={i} x1={OX - 310} y1={OY + dy} x2={OX + 310} y2={OY + dy} stroke={COLORS.sky} strokeWidth={2} opacity={0.32} />
        ))}
        <line x1={Ax} y1={Ay} x2={Bx} y2={By} stroke="#f59e0b" strokeWidth={14} strokeLinecap="round" />
        <circle cx={OX} cy={OY} r={12} fill={COLORS.ink} stroke={COLORS.muted} strokeWidth={2} />
        {dot(Ax, Ay, aInto)}
        {dot(Bx, By, bInto)}
      </svg>
      <Arrow x1={Ax} y1={Ay + fA * 6} x2={Ax} y2={Ay + fA * 105} color={COLORS.green} width={9} />
      <Arrow x1={Bx} y1={By + fB * 6} x2={Bx} y2={By + fB * 105} color={COLORS.green} width={9} />
    </>
  );
};

// Split-Ring-Diagramm (Kommutator + Bürsten)
const SplitRing: React.FC<{ flip: boolean }> = ({ flip }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    {/* zwei Halbringe */}
    <path d="M 700 470 A 90 90 0 0 1 700 650" fill="none" stroke={flip ? COLORS.sky : COLORS.amber} strokeWidth={26} />
    <path d="M 700 470 A 90 90 0 0 0 700 650" fill="none" stroke={flip ? COLORS.amber : COLORS.sky} strokeWidth={26} />
    <circle cx={700} cy={560} r={10} fill={COLORS.ink} />
    {/* Bürsten */}
    <rect x={560} y={548} width={44} height={24} rx={5} fill={COLORS.muted} />
    <rect x={796} y={548} width={44} height={24} rx={5} fill={COLORS.muted} />
    <line x1={520} y1={560} x2={560} y2={560} stroke={COLORS.amber} strokeWidth={5} />
    <line x1={840} y1={560} x2={880} y2={560} stroke={COLORS.sky} strokeWidth={5} />
    <text x={470} y={566} fontSize={26} fontWeight="800" fill={COLORS.amber} textAnchor="end">+</text>
    <text x={930} y={566} fontSize={26} fontWeight="800" fill={COLORS.sky} textAnchor="start">−</text>
  </svg>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 130, transform: `rotate(${frame * 6}deg)` }}>🔄</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum dreht der Motor immer weiter?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Kommutator (Polwender)
      </div>
    </AbsoluteFill>
  );
};

const ProblemScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const angle = 55 * Math.sin(frame / 11);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Problem" title="Ohne Trick wackelt die Spule nur" />
      <CommRig angleDeg={angle} mode="fixed" />
      <div style={{ position: 'absolute', left: 1180, top: 460, width: 600, fontSize: 25, fontWeight: 800, color: COLORS.red }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>
          Fließt der Strom immer gleich, drücken die Kräfte nach der Senkrechten zurück. Die Spule pendelt nur hin und her.
        </div>
      </div>
      <Caption delay={30}>Bliebe die Stromrichtung fest, würde die Spule an der Senkrechten zurückgedrückt – sie wackelt nur.</Caption>
    </AbsoluteFill>
  );
};

const KommutatorScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const flip = Math.floor(frame / 30) % 2 === 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Lösung" title="Ein geteilter Ring polt den Strom um" />
      <SplitRing flip={flip} />
      <div style={{ position: 'absolute', left: 1120, top: 420, width: 660, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Am Ende der Spule sitzt ein geteilter Ring, der Kommutator. Zwei Schleifkontakte (Bürsten) liefern den Strom.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, fontSize: 24, fontWeight: 800 }}>Bei jeder halben Umdrehung wechseln die Kontakte – der Strom in der Spule kehrt sich um.</div>
      </div>
      <Sfx sound="pop" at={30} volume={0.3} />
      <Caption delay={30}>Der geteilte Ring dreht sich mit. Jede halbe Umdrehung wechseln die Kontakte und polen den Strom um.</Caption>
    </AbsoluteFill>
  );
};

const LoesungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const angle = frame * 3.2;
  const cross = Math.abs(((angle % 180) + 180) % 180 - 0) < 6 || Math.abs(((angle % 180) + 180) % 180 - 180) < 6;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Der Strom kippt – die Drehung läuft weiter" />
      <CommRig angleDeg={angle} mode="comm" />
      <div style={{ position: 'absolute', left: 1220, top: 500, width: 540, fontSize: 27, fontWeight: 800, color: COLORS.green }}>
        🔄 Die Kraft treibt immer in dieselbe Drehrichtung – der Motor läuft rund.
      </div>
      {cross && <div style={{ position: 'absolute', left: OX - 60, top: OY - 220, fontSize: 30, fontWeight: 900, color: COLORS.amber }}>⚡ umgepolt</div>}
      <Caption delay={30}>Weil der Strom im richtigen Moment umklappt, treibt die Kraft die Spule immer weiter – der Motor dreht sich rund.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Der Kommutator" footer="polt den Strom jede halbe Umdrehung um">
      Ein geteilter Ring kehrt die Stromrichtung
      <br />
      im richtigen Moment um. So dreht sich
      <br />
      der Motor gleichmäßig weiter.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔩', 'Akkuschrauber', 'Gleichstrommotor'],
    ['🚂', 'Modelleisenbahn', 'Motor mit Kommutator'],
    ['🪀', 'Spielzeugmotor', 'einfachster Aufbau'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Gleichstrommotor" />
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
      <Caption delay={40}>Der Kommutator macht aus der ruckelnden Spule einen rund laufenden Gleichstrommotor.</Caption>
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
  { id: 'problem', C: ProblemScene, min: 250 },
  { id: 'kommutator', C: KommutatorScene, min: 270 },
  { id: 'loesung', C: LoesungScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KOMMUTATOR_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kommutator: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KOMMUTATOR_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kommutator/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
