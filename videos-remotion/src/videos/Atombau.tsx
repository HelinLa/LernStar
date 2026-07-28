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
import { Atom, Nucleus, PartChip } from '../nuclear';
import timings from '../narration/atombau.timings.json';

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
      <div style={{ fontSize: 120 }}>⚛️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Woraus besteht ein Atom?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Kern und Hülle
      </div>
    </AbsoluteFill>
  );
};

const RutherfordScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const foilX = 960;
  // 6 Alpha-Teilchen; das mittlere (nahe Kern) prallt zurück
  const alphas = [
    { y: 340, hit: false },
    { y: 430, hit: false },
    { y: 520, hit: true },
    { y: 610, hit: false },
    { y: 700, hit: false },
    { y: 250, hit: false },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Rutherford-Versuch" title="Die meisten fliegen einfach durch" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Goldfolie = Reihe kleiner Kerne */}
        {[300, 400, 500, 600, 700].map((y, i) => (
          <circle key={i} cx={foilX} cy={y} r={12} fill={COLORS.amber} />
        ))}
        <text x={foilX} y={790} fontSize={24} fontWeight="800" fill={COLORS.amber} textAnchor="middle">Goldfolie (Atomkerne)</text>
        {alphas.map((a, i) => {
          const start = 60 + i * 8;
          if (a.hit) {
            // fliegt bis zum Kern, prallt dann zurück (feste Zeitachse)
            const toFoil = interpolate(frame, [10, 70], [140, foilX - 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const back = frame > 70 ? interpolate(frame, [70, 130], [foilX - 20, 200], { extrapolateRight: 'clamp' }) : toFoil;
            const by = frame > 70 ? interpolate(frame, [70, 130], [a.y, a.y - 160], { extrapolateRight: 'clamp' }) : a.y;
            return <circle key={i} cx={back} cy={by} r={11} fill={COLORS.green} />;
          }
          const x = interpolate(frame, [start, 130], [140, 1780], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return <circle key={i} cx={x} cy={a.y} r={11} fill={COLORS.green} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: 1200, top: 430, width: 600, fontSize: 25, fontWeight: 800 }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.green}`, marginBottom: 12 }}>Fast alle Teilchen fliegen ungehindert durch → das Atom ist fast leer.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>Nur wenige prallen zurück → in der Mitte sitzt etwas winzig Kleines und sehr Dichtes: der Kern.</div>
      </div>
      <Sfx sound="impact" at={72} volume={0.4} />
      <Caption delay={30}>Ernest Rutherford beschoss eine dünne Goldfolie. Fast alles flog durch – nur wenige Teilchen prallten zurück.</Caption>
    </AbsoluteFill>
  );
};

const ModellScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Modell" title="Winziger Kern, weite Elektronenhülle" />
      <Atom cx={640} cy={560} shells={[2, 6]} frame={frame} rBase={130} />
      <div style={{ position: 'absolute', left: 1180, top: 430, width: 640, opacity: f }}>
        <PartChip color="#b91c1c" label="Kern in der Mitte (fast die ganze Masse)" />
        <PartChip color={COLORS.sky} label="Elektronen in der Hülle (außen)" sign="−" />
        <div style={{ marginTop: 12, padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 24, fontWeight: 800 }}>Zwischen Kern und Hülle ist fast nur leerer Raum.</div>
      </div>
      <Caption delay={30}>Daraus entstand das Modell: ein winziger Kern in der Mitte, umgeben von einer weiten Hülle aus Elektronen.</Caption>
    </AbsoluteFill>
  );
};

const GroesseScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Größenverhältnis" title="Der Kern ist winzig" />
      <div style={{ display: 'flex', gap: 60, alignItems: 'center', opacity: f, marginTop: 30 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 130 }}>🏟️</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>Atom = Stadion</div>
        </div>
        <div style={{ fontSize: 60 }}>➡️</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 130 }}>🫛</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>Kern = Erbse in der Mitte</div>
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 900, color: COLORS.amber, opacity: f }}>Das Atom ist rund 100 000-mal größer als sein Kern.</div>
      <Caption delay={30}>Wäre ein Atom so groß wie ein Fußballstadion, wäre der Kern nur eine Erbse in der Mitte. Der Rest ist leer.</Caption>
    </AbsoluteFill>
  );
};

const BausteineScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Bausteine" title="Protonen, Neutronen, Elektronen" />
      <Nucleus cx={620} cy={560} protons={6} neutrons={6} r={110} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <circle cx={620} cy={560} r={260} fill="none" stroke={COLORS.border} strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5].map((e) => {
          const ang = (frame / 30) + (e / 6) * Math.PI * 2;
          return <circle key={e} cx={620 + 260 * Math.cos(ang)} cy={560 + 260 * Math.sin(ang)} r={13} fill={COLORS.sky} stroke="#0f172a" strokeWidth={2} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 420, width: 640, opacity: f }}>
        <PartChip color="#ef4444" label="Proton – positiv geladen" sign="+" />
        <PartChip color="#64748b" label="Neutron – ohne Ladung" sign="0" />
        <PartChip color={COLORS.sky} label="Elektron – negativ geladen" sign="−" />
        <div style={{ marginTop: 10, fontSize: 23, fontWeight: 700, color: COLORS.muted }}>Protonen und Neutronen sitzen im Kern, die Elektronen in der Hülle.</div>
      </div>
      <Caption delay={30}>Der Kern besteht aus Protonen und Neutronen. Um ihn herum schwirren die viel leichteren Elektronen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Der Atombau" footer="Atom ≈ 100 000-mal größer als der Kern">
      Ein Atom hat einen winzigen, schweren Kern aus
      <br />
      Protonen und Neutronen und eine weite Hülle
      <br />
      aus Elektronen. Dazwischen ist fast nur leerer Raum.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🧪', 'Chemie', 'Hülle bestimmt Reaktionen'],
    ['☢️', 'Radioaktivität', 'kommt aus dem Kern'],
    ['🔬', 'Forschung', 'immer genauere Modelle'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Warum der Aufbau wichtig ist" />
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
      <Caption delay={40}>Die Radioaktivität, um die es jetzt geht, spielt sich tief im Atomkern ab.</Caption>
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
  { id: 'rutherford', C: RutherfordScene, min: 260 },
  { id: 'modell', C: ModellScene, min: 250 },
  { id: 'groesse', C: GroesseScene, min: 240 },
  { id: 'bausteine', C: BausteineScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ATOMBAU_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Atombau: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ATOMBAU_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/atombau/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
