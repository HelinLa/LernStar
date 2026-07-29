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
import timings from '../narration/kernkraftwerk.timings.json';

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
      <div style={{ fontSize: 120 }}>🏭⚡</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie wird aus Kernspaltung Strom?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Das Kernkraftwerk
      </div>
    </AbsoluteFill>
  );
};

const ReaktorScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const heat = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Schritt 1" title="Im Reaktor entsteht Wärme" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <rect x={420} y={420} width={340} height={300} rx={16} fill="#1e293b" stroke={COLORS.red} strokeWidth={3} />
        {/* Brennstäbe */}
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={460 + i * 56} y={450} width={28} height={200} rx={6} fill={`rgba(239,68,68,${0.5 + heat * 0.5})`} />)}
        {/* Steuerstäbe halb drin */}
        {[0, 1, 2, 3].map((i) => <rect key={`s${i}`} x={488 + i * 56} y={420} width={16} height={90} rx={4} fill="#475569" />)}
        {/* Wärmewellen */}
        {[500, 600, 700].map((x, i) => <path key={i} d={`M ${x} 410 q 12 -22 0 -44`} fill="none" stroke={COLORS.amber} strokeWidth={3} opacity={0.4 + heat * 0.3} />)}
      </svg>
      <div style={{ position: 'absolute', left: 460, top: 730, fontSize: 24, fontWeight: 800, color: COLORS.red }}>Reaktor (Brennstäbe + Steuerstäbe)</div>
      <div style={{ position: 'absolute', left: 900, top: 440, width: 780, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>Im Reaktor läuft eine kontrollierte Kettenreaktion. Die Kernspaltung erzeugt sehr viel Wärme – das Herzstück des Kraftwerks. Steuerstäbe regeln, wie schnell sie läuft.</div>
      </div>
      <Caption delay={30}>Alles beginnt im Reaktor. Dort läuft die kontrollierte Kettenreaktion und erzeugt durch die Kernspaltung enorme Wärme.</Caption>
    </AbsoluteFill>
  );
};

const DampfScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const spin = frame * 8;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Schritt 2 & 3" title="Dampf treibt Turbine und Generator" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <text x={260} y={560} fontSize={30} fontWeight="800" fill={COLORS.red}>🔥 Wärme</text>
        <path d="M 380 560 H 520" stroke={COLORS.amber} strokeWidth={5} />
        {/* Wasser → Dampf */}
        <rect x={520} y={510} width={130} height={100} rx={10} fill="#334155" stroke={COLORS.border} strokeWidth={2} />
        <text x={585} y={565} fontSize={24} fill={COLORS.sky} textAnchor="middle">💧→💨</text>
        {/* Dampfleitung */}
        <path d="M 650 540 H 820" stroke={COLORS.sky} strokeWidth={5} strokeDasharray="8 6" />
        {/* Turbine */}
        <g transform={`rotate(${spin} 900 560)`}>
          {[0, 60, 120].map((a) => <rect key={a} x={896} y={490} width={8} height={140} rx={3} fill={COLORS.ink} transform={`rotate(${a} 900 560)`} />)}
        </g>
        <circle cx={900} cy={560} r={70} fill="none" stroke={COLORS.muted} strokeWidth={3} />
        <text x={900} y={670} fontSize={22} fill={COLORS.muted} textAnchor="middle">Turbine</text>
        <path d="M 970 560 H 1080" stroke={COLORS.muted} strokeWidth={6} />
        {/* Generator */}
        <rect x={1080} y={510} width={140} height={100} rx={12} fill={COLORS.panelSolid} stroke={COLORS.amber} strokeWidth={3} />
        <text x={1150} y={568} fontSize={30} textAnchor="middle">⚡</text>
        <text x={1150} y={670} fontSize={22} fill={COLORS.amber} textAnchor="middle">Generator</text>
        <path d="M 1220 560 H 1360" stroke={COLORS.amber} strokeWidth={5} />
        <text x={1420} y={570} fontSize={54}>🏠</text>
      </svg>
      <div style={{ position: 'absolute', left: 260, top: 690, width: 1400, textAlign: 'center', fontSize: 24, fontWeight: 800, color: COLORS.amber, opacity: f }}>
        🔥 Wärme → 💨 Dampf → 🌀 Turbine → ⚡ Generator → 🏠 Strom
      </div>
      <Caption delay={30}>Die Wärme verdampft Wasser. Der Dampf strömt auf eine Turbine und dreht sie. Die Turbine treibt den Generator, der daraus durch Induktion Strom erzeugt.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Kern der Sache" title="Wie ein Kohlekraftwerk – nur die Wärmequelle ist anders" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.muted}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>🪨 Kohlekraftwerk</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Wärme durch Verbrennen von Kohle → Dampf → Turbine → Generator.</div>
        </div>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>⚛️ Kernkraftwerk</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Wärme durch Kernspaltung → Dampf → Turbine → Generator.</div>
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: 26, fontWeight: 800, color: COLORS.amber, opacity: f }}>Der Weg zum Strom ist gleich – nur die Wärmequelle unterscheidet sich.</div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Wichtig: Ein Kernkraftwerk erzeugt Strom nicht direkt aus der Spaltung. Es funktioniert wie ein Kohlekraftwerk – nur dass die Wärme aus der Kernspaltung kommt statt aus dem Verbrennen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Das Kernkraftwerk" footer="Kernspaltung → Wärme → Dampf → Turbine → Generator">
      Die Kernspaltung erzeugt Wärme, die Wasser verdampft.
      <br />
      Der Dampf treibt Turbine und Generator –
      <br />
      so entsteht der Strom.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['💨', 'Kühlturm', 'gibt Restwärme ab'],
    ['🛡️', 'Sicherheitshülle', 'dicker Beton'],
    ['🔋', 'Grundlast', 'liefert rund um die Uhr'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Rund um den Reaktor" />
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
      <Caption delay={40}>Ein Kernkraftwerk liefert viel Strom ohne CO₂ – aber was passiert, wenn die Kühlung ausfällt? Das klärt der nächste Schritt.</Caption>
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
  { id: 'reaktor', C: ReaktorScene, min: 250 },
  { id: 'dampf', C: DampfScene, min: 260 },
  { id: 'vergleich', C: VergleichScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KERNKRAFTWERK_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kernkraftwerk: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KERNKRAFTWERK_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kernkraftwerk/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
