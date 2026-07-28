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
import timings from '../narration/lorentzkraft.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Polflächen N (links) und S (rechts), waagerechtes Feld dazwischen (→).
const PoleField: React.FC<{ cx: number; cy: number; swap?: boolean; lines?: boolean }> = ({ cx, cy, swap = false, lines = true }) => {
  const left = swap ? COLORS.sky : COLORS.red;
  const right = swap ? COLORS.red : COLORS.sky;
  const leftL = swap ? 'S' : 'N';
  const rightL = swap ? 'N' : 'S';
  const arrowDir = swap ? -1 : 1;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <rect x={cx - 430} y={cy - 190} width={90} height={380} rx={10} fill={left} />
      <rect x={cx + 340} y={cy - 190} width={90} height={380} rx={10} fill={right} />
      <text x={cx - 385} y={cy} fontSize={54} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">{leftL}</text>
      <text x={cx + 385} y={cy} fontSize={54} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">{rightL}</text>
      {lines &&
        [-120, -60, 0, 60, 120].map((dy, i) => (
          <g key={i}>
            <line x1={cx - 330} y1={cy + dy} x2={cx + 330} y2={cy + dy} stroke={COLORS.sky} strokeWidth={2.5} opacity={0.5} />
            <polygon points="0,-7 14,0 0,7" fill={COLORS.sky} opacity={0.6} transform={`translate(${cx + arrowDir * 60},${cy + dy}) rotate(${arrowDir > 0 ? 0 : 180})`} />
          </g>
        ))}
    </svg>
  );
};

// Draht im Querschnitt: ⊗ = Strom in die Ebene, ⊙ = aus der Ebene.
const WireDot: React.FC<{ x: number; y: number; into: boolean }> = ({ x, y, into }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <circle cx={x} cy={y} r={30} fill={COLORS.panelSolid} stroke={COLORS.amber} strokeWidth={5} />
    {into ? (
      <>
        <line x1={x - 15} y1={y - 15} x2={x + 15} y2={y + 15} stroke={COLORS.amber} strokeWidth={5} />
        <line x1={x + 15} y1={y - 15} x2={x - 15} y2={y + 15} stroke={COLORS.amber} strokeWidth={5} />
      </>
    ) : (
      <circle cx={x} cy={y} r={8} fill={COLORS.amber} />
    )}
  </svg>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 110 }}>🧲➡️🔌</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum bewegt sich ein Draht im Magnetfeld?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Kraft auf einen stromdurchflossenen Leiter
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const on = frame > 50;
  const wy = on ? interpolate(frame, [50, 90], [560, 430], { extrapolateRight: 'clamp' }) : 560;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Strom an – der Draht springt zur Seite" />
      <PoleField cx={720} cy={560} />
      <WireDot x={720} y={wy} into />
      {on && <Arrow x1={720} y1={wy + 10} x2={720} y2={wy - 90} color={COLORS.green} width={10} />}
      <div style={{ position: 'absolute', left: 1240, top: 470, width: 520, fontSize: 30, fontWeight: 800, color: on ? COLORS.green : COLORS.muted }}>
        {on ? '⬆️ eine Kraft schiebt den Draht aus dem Feld' : '○ Draht liegt ruhig im Feld'}
      </div>
      <Caption delay={30}>Liegt ein Draht im Magnetfeld und fließt Strom, wirkt plötzlich eine Kraft – der Draht wird zur Seite geschoben.</Caption>
    </AbsoluteFill>
  );
};

const UrsacheScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const cx = 720;
  const cy = 560;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Ursache" title="Zwei Felder überlagern sich" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: f }} viewBox="0 0 1920 1080">
        {/* dichteres Feld unten, dünneres oben → Draht wird nach oben gedrückt */}
        {[-140, -95].map((dy, i) => (
          <line key={`u${i}`} x1={cx - 300} y1={cy + dy} x2={cx + 300} y2={cy + dy} stroke={COLORS.sky} strokeWidth={2.5} opacity={0.4} />
        ))}
        {[40, 70, 100, 130, 160].map((dy, i) => (
          <line key={`d${i}`} x1={cx - 300} y1={cy + dy} x2={cx + 300} y2={cy + dy} stroke={COLORS.sky} strokeWidth={3.5} opacity={0.85} />
        ))}
        <circle cx={cx} cy={cy} r={26} fill={COLORS.panelSolid} stroke={COLORS.amber} strokeWidth={5} />
        <line x1={cx - 13} y1={cy - 13} x2={cx + 13} y2={cy + 13} stroke={COLORS.amber} strokeWidth={5} />
        <line x1={cx + 13} y1={cy - 13} x2={cx - 13} y2={cy + 13} stroke={COLORS.amber} strokeWidth={5} />
      </svg>
      <Arrow x1={cx} y1={cy - 30} x2={cx} y2={cy - 150} color={COLORS.green} width={10} opacity={f} />
      <div style={{ position: 'absolute', left: 1180, top: 420, width: 600, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Das Magnetfeld und das ringförmige Feld des Drahtes überlagern sich.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 24, fontWeight: 800 }}>Auf einer Seite verstärken sie sich (dicht), auf der anderen schwächen sie sich (dünn). Der Draht wird zur dünnen Seite gedrückt.</div>
      </div>
      <Caption delay={30}>Das Feld ist auf einer Seite dichter. Wie bei einem Katapult wird der Draht zur schwächeren Seite geschoben.</Caption>
    </AbsoluteFill>
  );
};

const RichtungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const reversed = frame > 95;
  const wy = 560;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ausprobieren" title="Strom oder Pole umkehren – Kraft dreht sich um" />
      <PoleField cx={720} cy={wy} />
      <WireDot x={720} y={wy} into={!reversed} />
      <Arrow x1={720} y1={reversed ? wy - 10 : wy + 10} x2={720} y2={reversed ? wy + 120 : wy - 120} color={COLORS.green} width={10} opacity={f} />
      <div style={{ position: 'absolute', left: 1240, top: 470, width: 520, fontSize: 27, fontWeight: 800, color: reversed ? COLORS.red : COLORS.green, opacity: f }}>
        {reversed ? '⬇️ Strom andersherum (⊙) → Kraft nach unten' : '⬆️ Strom in die Ebene (⊗) → Kraft nach oben'}
      </div>
      <Sfx sound="pop" at={95} volume={0.34} />
      <Caption delay={30}>Kehrt man die Stromrichtung um, kehrt sich die Kraft um. Genauso, wenn man Nord- und Südpol vertauscht.</Caption>
    </AbsoluteFill>
  );
};

const BedingungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const cx = 720;
  const cy = 560;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vorsicht" title="Kein Feld quer zum Strom – keine Kraft" />
      <PoleField cx={cx} cy={cy} />
      {/* Draht längs des Feldes (waagerecht, parallel zu den Feldlinien) */}
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: f }} viewBox="0 0 1920 1080">
        <line x1={cx - 300} y1={cy} x2={cx + 300} y2={cy} stroke={COLORS.amber} strokeWidth={12} strokeLinecap="round" />
        <text x={cx + 40} y={cy - 30} fontSize={70} fill={COLORS.red}>🚫</text>
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 470, width: 600, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, fontSize: 25, fontWeight: 800 }}>
          Liegt der Draht parallel zum Feld, wirkt keine Kraft. Die Kraft steht immer senkrecht auf Strom und Feld.
        </div>
      </div>
      <Caption delay={30}>Wichtig: Der Draht muss das Feld kreuzen. Läuft der Strom parallel zu den Feldlinien, passiert nichts.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Lorentzkraft" footer="Strom umkehren oder Pole tauschen → Kraft kehrt sich um">
      Auf einen stromdurchflossenen Draht im Magnetfeld
      <br />
      wirkt eine Kraft – senkrecht zu Strom und Feld.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['⚙️', 'Elektromotor', 'Kraft → Drehbewegung'],
    ['🔊', 'Lautsprecher', 'Kraft bewegt die Membran'],
    ['📟', 'Messgeräte', 'Zeiger wird ausgelenkt'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wo die Kraft genutzt wird" />
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
      <Caption delay={40}>Diese Kraft ist der Motor hinter dem Elektromotor – im nächsten Schritt wird daraus eine Drehung.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'ursache', C: UrsacheScene, min: 260 },
  { id: 'richtung', C: RichtungScene, min: 250 },
  { id: 'bedingung', C: BedingungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LORENTZKRAFT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Lorentzkraft: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LORENTZKRAFT_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/lorentzkraft/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
