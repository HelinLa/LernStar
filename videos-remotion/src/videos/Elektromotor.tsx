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
import timings from '../narration/elektromotor.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const OX = 700;
const OY = 560;
const RR = 160;

// Motor-Aufbau: Polflächen N (links) / S (rechts), waagerechtes Feld,
// drehbare Leiterschleife (zwei Leiter A=⊗ / B=⊙) + Kraftpfeile.
const MotorRig: React.FC<{ angleDeg: number; forces?: boolean; deadpoint?: boolean }> = ({ angleDeg, forces = true, deadpoint = false }) => {
  const a = (angleDeg * Math.PI) / 180;
  const Ax = OX + RR * Math.cos(a);
  const Ay = OY + RR * Math.sin(a);
  const Bx = OX - RR * Math.cos(a);
  const By = OY - RR * Math.sin(a);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Polflächen */}
        <rect x={OX - 400} y={OY - 200} width={80} height={400} rx={10} fill={COLORS.red} />
        <rect x={OX + 320} y={OY - 200} width={80} height={400} rx={10} fill={COLORS.sky} />
        <text x={OX - 360} y={OY} fontSize={50} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">N</text>
        <text x={OX + 360} y={OY} fontSize={50} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">S</text>
        {/* Feldlinien → */}
        {[-130, -65, 0, 65, 130].map((dy, i) => (
          <line key={i} x1={OX - 310} y1={OY + dy} x2={OX + 310} y2={OY + dy} stroke={COLORS.sky} strokeWidth={2} opacity={0.35} />
        ))}
        {/* Spulen-Bar A–B */}
        <line x1={Ax} y1={Ay} x2={Bx} y2={By} stroke="#f59e0b" strokeWidth={14} strokeLinecap="round" />
        {/* Achse */}
        <circle cx={OX} cy={OY} r={13} fill={COLORS.ink} stroke={COLORS.muted} strokeWidth={2} />
        {/* Leiter A = ⊗ (Strom in die Ebene) */}
        <circle cx={Ax} cy={Ay} r={26} fill={COLORS.panelSolid} stroke={COLORS.amber} strokeWidth={4} />
        <line x1={Ax - 13} y1={Ay - 13} x2={Ax + 13} y2={Ay + 13} stroke={COLORS.amber} strokeWidth={4} />
        <line x1={Ax + 13} y1={Ay - 13} x2={Ax - 13} y2={Ay + 13} stroke={COLORS.amber} strokeWidth={4} />
        {/* Leiter B = ⊙ (Strom aus der Ebene) */}
        <circle cx={Bx} cy={By} r={26} fill={COLORS.panelSolid} stroke={COLORS.amber} strokeWidth={4} />
        <circle cx={Bx} cy={By} r={7} fill={COLORS.amber} />
      </svg>
      {/* Kraftpfeile: A nach oben, B nach unten (bei fester Stromrichtung) */}
      {forces && (
        <>
          <Arrow x1={Ax} y1={Ay - 6} x2={Ax} y2={Ay - 110} color={deadpoint ? COLORS.red : COLORS.green} width={9} />
          <Arrow x1={Bx} y1={By + 6} x2={Bx} y2={By + 110} color={deadpoint ? COLORS.red : COLORS.green} width={9} />
        </>
      )}
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
      <div style={{ fontSize: 130, transform: `rotate(${frame * 5}deg)` }}>⚙️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie wird aus Kraft eine Drehbewegung?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Elektromotor
      </div>
    </AbsoluteFill>
  );
};

const AufbauScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Aufbau" title="Eine Spule zwischen zwei Polen" />
      <MotorRig angleDeg={0} forces={false} />
      <div style={{ position: 'absolute', left: 1180, top: 440, width: 600, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.red}`, fontSize: 25, fontWeight: 800, marginBottom: 12 }}>🧲 Ein Magnet liefert das Feld (N nach S).</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, fontSize: 25, fontWeight: 800 }}>⚡ Eine drehbare Spule wird vom Strom durchflossen.</div>
      </div>
      <Caption delay={30}>Im Motor liegt eine drehbare Spule im Magnetfeld. Durch sie fließt Strom.</Caption>
    </AbsoluteFill>
  );
};

const KraefteScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Idee" title="Zwei Kräfte in Gegenrichtung" />
      <MotorRig angleDeg={0} forces />
      <div style={{ position: 'absolute', left: 1180, top: 430, width: 600, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Auf beide Seiten der Spule wirkt die Lorentzkraft – aber in entgegengesetzte Richtung.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 24, fontWeight: 800 }}>Eine Seite hoch, die andere runter: Das dreht die Spule. Man nennt es Drehmoment.</div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Weil der Strom in den beiden Seiten entgegengesetzt fließt, zeigen die Kräfte in Gegenrichtung – das dreht die Spule.</Caption>
    </AbsoluteFill>
  );
};

const DrehungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [10, 150], [-10, 70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Die Spule dreht sich" />
      <MotorRig angleDeg={angle} forces />
      <div style={{ position: 'absolute', left: 1240, top: 500, width: 520, fontSize: 28, fontWeight: 800, color: COLORS.green }}>
        🔄 Das Kräftepaar dreht die Spule um die Achse.
      </div>
      <Caption delay={30}>Das Kräftepaar dreht die Spule um ihre Achse – aus der Kraft ist eine Drehbewegung geworden.</Caption>
    </AbsoluteFill>
  );
};

const TotpunktScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ein Problem" title="Senkrecht bleibt die Spule stehen" />
      <MotorRig angleDeg={90} forces deadpoint />
      <div style={{ position: 'absolute', left: 1180, top: 450, width: 600, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, fontSize: 25, fontWeight: 800 }}>
          Steht die Spule senkrecht, ziehen die Kräfte nur noch am Bügel – sie drehen nicht weiter. Der Motor bliebe hier hängen.
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={30}>An einer Stelle wirken die Kräfte längs der Spule und drehen nicht mehr weiter. Wie löst man das? Das klärt der nächste Schritt.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Der Elektromotor" footer="elektrische Energie → Bewegungsenergie">
      Auf die beiden Seiten der Spule wirken
      <br />
      entgegengesetzte Kräfte – dieses Drehmoment
      <br />
      dreht die Spule im Magnetfeld.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🚗', 'Elektroauto', 'Antrieb'],
    ['🌀', 'Ventilator', 'dreht die Flügel'],
    ['🔧', 'Bohrmaschine', 'dreht den Bohrer'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Motoren überall" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Jeder Elektromotor wandelt elektrische Energie in Drehbewegung um.</Caption>
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
  { id: 'aufbau', C: AufbauScene, min: 250 },
  { id: 'kraefte', C: KraefteScene, min: 260 },
  { id: 'drehung', C: DrehungScene, min: 240 },
  { id: 'totpunkt', C: TotpunktScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ELEKTROMOTOR_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Elektromotor: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ELEKTROMOTOR_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/elektromotor/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
