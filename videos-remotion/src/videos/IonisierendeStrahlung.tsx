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
import timings from '../narration/ionisierende-strahlung.timings.json';

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
      <div style={{ fontSize: 120 }}>☢️➡️⚛️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Was macht diese Strahlung so besonders?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Ionisierende Strahlung
      </div>
    </AbsoluteFill>
  );
};

const IonisationScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const hit = frame > 60;
  const cx = 700;
  const cy = 540;
  // einfallende Strahlung
  const rayX = interpolate(frame, [10, 60], [200, cx - 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Elektron auf Schale (vor Treffer) bzw. weggeschleudert
  const eAng = frame / 20;
  const ex = hit ? interpolate(frame, [60, 130], [cx + 150, cx + 620], { extrapolateRight: 'clamp' }) : cx + 150 * Math.cos(eAng);
  const ey = hit ? interpolate(frame, [60, 130], [cy, cy - 220], { extrapolateRight: 'clamp' }) : cy + 150 * Math.sin(eAng);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Ionisation" title="Sie schlägt Elektronen aus Atomen heraus" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Schale */}
        <circle cx={cx} cy={cy} r={150} fill="none" stroke={COLORS.border} strokeWidth={2} />
        {/* Kern */}
        <circle cx={cx} cy={cy} r={40} fill="url(#ion)" />
        <text x={cx} y={cy + 8} fontSize={30} fontWeight="900" fill="#fff" textAnchor="middle">{hit ? '+' : ''}</text>
        <defs>
          <radialGradient id="ion" cx="40%" cy="35%"><stop offset="0" stopColor="#fca5a5" /><stop offset="1" stopColor="#b91c1c" /></radialGradient>
        </defs>
        {/* einfallende Strahlung */}
        {!hit && <line x1={200} y1={cy} x2={rayX} y2={cy} stroke={COLORS.green} strokeWidth={5} strokeDasharray="10 8" />}
        {!hit && <polygon points="0,-12 22,0 0,12" fill={COLORS.green} transform={`translate(${rayX},${cy})`} />}
        {/* Elektron */}
        <circle cx={ex} cy={ey} r={15} fill={COLORS.sky} stroke="#0f172a" strokeWidth={2} />
        <text x={ex} y={ey + 5} fontSize={20} fontWeight="900" fill="#fff" textAnchor="middle">−</text>
      </svg>
      <div style={{ position: 'absolute', left: 1160, top: 440, width: 660, fontSize: 24, fontWeight: 800 }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.green}`, marginBottom: 12 }}>Die Strahlung trägt so viel Energie, dass sie ein Elektron aus dem Atom herausschlägt.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>Zurück bleibt ein geladenes Atom – ein Ion. Deshalb heißt sie ionisierende Strahlung.</div>
      </div>
      <Sfx sound="impact" at={60} volume={0.4} />
      <Caption delay={30}>Das Besondere: Die Strahlung hat so viel Energie, dass sie Elektronen aus Atomen herausschlägt. Übrig bleibt ein geladenes Ion.</Caption>
    </AbsoluteFill>
  );
};

const ZellenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const broken = frame > 75;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum gefährlich" title="In Zellen kann sie das Erbgut schädigen" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Zelle */}
        <ellipse cx={640} cy={560} rx={300} ry={230} fill="rgba(56,189,248,0.06)" stroke={COLORS.sky} strokeWidth={3} />
        {/* DNA-Doppelhelix (vereinfacht) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const y = 400 + i * 45;
          const off = Math.sin(i / 1.3) * 40;
          const brk = broken && i === 4;
          return <line key={i} x1={640 - 40 + off} y1={y} x2={640 + 40 + off} y2={y} stroke={brk ? COLORS.red : COLORS.green} strokeWidth={6} opacity={brk ? 1 : 0.85} />;
        })}
        <path d="M 600 400 C 700 480 580 560 680 640 C 600 700 700 740 620 760" fill="none" stroke={COLORS.green} strokeWidth={4} opacity={0.5} />
        <path d="M 680 400 C 580 480 700 560 600 640 C 680 700 580 740 660 760" fill="none" stroke={COLORS.green} strokeWidth={4} opacity={0.5} />
        {/* Strahl */}
        {broken && <line x1={200} y1={560} x2={600} y2={585} stroke={COLORS.red} strokeWidth={5} strokeDasharray="10 8" />}
      </svg>
      <div style={{ position: 'absolute', left: 1080, top: 460, width: 720, fontSize: 25, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>
          Trifft die Strahlung lebende Zellen, kann sie wichtige Moleküle und sogar das Erbgut (die DNA) beschädigen. Das kann Zellen krank machen.
        </div>
      </div>
      <Sfx sound="impact" at={75} volume={0.35} />
      <Caption delay={30}>Genau das macht sie gefährlich: In lebenden Zellen kann sie Moleküle und das Erbgut beschädigen und so Zellen schädigen.</Caption>
    </AbsoluteFill>
  );
};

const MengeScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Auf die Menge kommt es an" title="Wenig ist normal, viel ist gefährlich" />
      <div style={{ opacity: f, marginTop: 40, width: 1400 }}>
        <div style={{ height: 60, borderRadius: 30, background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.amber}, ${COLORS.red})` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 24, fontWeight: 800 }}>
          <div style={{ color: COLORS.green, width: 360 }}>natürliche Strahlung, Banane, Flug – unbedenklich</div>
          <div style={{ color: COLORS.amber, width: 360, textAlign: 'center' }}>Röntgen, Belastung im Beruf – begrenzt</div>
          <div style={{ color: COLORS.red, width: 360, textAlign: 'right' }}>hohe Dosis, Unfall – gefährlich</div>
        </div>
      </div>
      <Caption delay={30}>Entscheidend ist die Menge. Die kleine natürliche Strahlung ist unbedenklich – erst eine hohe Dosis wird wirklich gefährlich.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Ionisierende Strahlung" footer="die Dosis entscheidet über die Gefahr">
      Sie hat so viel Energie, dass sie Elektronen aus
      <br />
      Atomen schlägt (Ionisation). In Zellen kann sie
      <br />
      das Erbgut schädigen.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['📟', 'Nachweis', 'Ionisation lässt sich messen'],
    ['🏥', 'Therapie', 'gezielt Tumorzellen zerstören'],
    ['🛡️', 'Schutz', 'Abstand und Abschirmung'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Gefahr und Nutzen zugleich" />
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
      <Caption delay={40}>Weil sie ionisiert, kann man sie messen und in der Medizin nutzen – aber man muss sich schützen.</Caption>
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
  { id: 'ionisation', C: IonisationScene, min: 260 },
  { id: 'zellen', C: ZellenScene, min: 250 },
  { id: 'menge', C: MengeScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const IONISIERENDE_STRAHLUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const IonisierendeStrahlung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={IONISIERENDE_STRAHLUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/ionisierende-strahlung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
