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
import timings from '../narration/energie.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Objekt-Karte (Emoji + Beschriftung, mit Reveal) ────────────────────
const ObjCard: React.FC<{ icon: string; label: string; sub: string; delay: number; color?: string }> = ({
  icon,
  label,
  sub,
  delay,
  color = COLORS.indigo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div
      style={{
        width: 400,
        padding: '34px 24px',
        borderRadius: 26,
        background: COLORS.panel,
        border: `2px solid ${color}`,
        textAlign: 'center',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
      }}
    >
      <div style={{ fontSize: 96, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 40, fontWeight: 800 }}>{label}</div>
      <div style={{ fontSize: 27, fontWeight: 600, color: COLORS.muted, marginTop: 8, lineHeight: 1.3 }}>{sub}</div>
    </div>
  );
};

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  // drei Emojis, die sanft auf und ab schweben
  const items = ['🪤', '☕', '⚽'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 90, marginBottom: 40 }}>
        {items.map((e, i) => (
          <div key={i} style={{ fontSize: 120, transform: `translateY(${Math.sin(frame / 22 + i) * 16}px)` }}>
            {e}
          </div>
        ))}
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die Energie
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Was haben eine gespannte Feder, ein heißer Tee und ein rollender Ball gemeinsam?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: drei Objekte, alle „bewirken" etwas ────────────────────
const DreiScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Beobachten" title="Jedes kann etwas bewirken" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 44 }}>
        <ObjCard icon="🪤" label="Gespannte Feder" sub="schießt eine Kugel weg" delay={10} color={COLORS.sky} />
        <ObjCard icon="☕" label="Heißer Tee" sub="wärmt deine Hände" delay={34} color={COLORS.red} />
        <ObjCard icon="⚽" label="Rollender Ball" sub="wirft einen Turm um" delay={58} color={COLORS.amber} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pop" at={34} volume={0.42} />
    <Sfx sound="pop" at={58} volume={0.42} />
    <Caption delay={74}>Ganz verschieden – und doch kann jedes von ihnen etwas bewirken.</Caption>
  </AbsoluteFill>
);

// ── Vermuten/Erklären: der Vorrat = Energie ────────────────────────────
const VorratScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rev = spring({ frame: frame - Math.round(dur * 0.34), fps, config: { damping: 180 } });
  const box = spring({ frame: frame - Math.round(dur * 0.55), fps, config: { damping: 160 } });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vermuten" title="In allen steckt ein „Vorrat“" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.muted, opacity: rev }}>
          Fähigkeit, etwas zu bewirken
        </div>
        <div style={{ fontSize: 70, lineHeight: 1, color: COLORS.indigo, opacity: rev, margin: '14px 0' }}>↓</div>
        <div
          style={{
            transform: `scale(${interpolate(box, [0, 1], [0.8, 1])})`,
            opacity: box,
            padding: '30px 70px',
            borderRadius: 28,
            background: 'linear-gradient(160deg, rgba(99,102,241,0.28), rgba(255,255,255,0.05))',
            border: `2px solid ${COLORS.indigo}`,
            fontSize: 80,
            fontWeight: 900,
          }}
        >
          = Energie
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={Math.round(dur * 0.55) + 4} volume={0.5} />
      <Caption>Diesen Vorrat – die Fähigkeit, etwas zu bewirken – nennt man Energie.</Caption>
    </AbsoluteFill>
  );
};

// ── Vergleichen: Energieformen ─────────────────────────────────────────
const FormCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div
      style={{
        width: 300,
        padding: '22px 16px',
        borderRadius: 20,
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        textAlign: 'center',
        opacity: s,
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
      }}
    >
      <div style={{ fontSize: 64, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.15 }}>{title}</div>
    </div>
  );
};

const FormenScene: React.FC<SceneProps> = () => {
  const forms = [
    { icon: '⛰️', title: 'Lage­energie', d: 8 },
    { icon: '🏃', title: 'Bewegungs­energie', d: 24 },
    { icon: '🌀', title: 'Spann­energie', d: 40 },
    { icon: '🔥', title: 'Wärme', d: 56 },
    { icon: '🍎', title: 'chemische Energie', d: 72 },
    { icon: '⚡', title: 'elektrische Energie', d: 88 },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleichen" title="Energie hat viele Formen" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 300px)', gap: 30, justifyContent: 'center' }}>
          {forms.map((f, i) => (
            <FormCard key={i} icon={f.icon} title={f.title} delay={f.d} />
          ))}
        </div>
      </AbsoluteFill>
      {forms.map((f, i) => (
        <Sfx key={i} sound="pop" at={f.d + 2} volume={0.34} />
      ))}
      <Caption delay={104}>Lage, Bewegung, Spannung, Wärme, chemisch, elektrisch – alles ist Energie.</Caption>
    </AbsoluteFill>
  );
};

// ── Erklären: Einheit Joule ────────────────────────────────────────────
const JouleScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j = spring({ frame: frame - 16, fps, config: { damping: 160 } });
  const ex = spring({ frame: frame - Math.round(dur * 0.5), fps, config: { damping: 180 } });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Erklären" title="Gemessen wird in Joule" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            transform: `scale(${interpolate(j, [0, 1], [0.7, 1])})`,
            opacity: j,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: `radial-gradient(circle at 34% 30%, ${COLORS.amber}, ${COLORS.red})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 150,
            fontWeight: 900,
            color: '#1a1206',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          J
        </div>
        <div style={{ marginTop: 26, fontSize: 40, fontWeight: 700, opacity: j }}>1 Joule = die Einheit der Energie</div>
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 26,
            fontSize: 40,
            fontWeight: 700,
            opacity: ex,
            transform: `translateY(${interpolate(ex, [0, 1], [30, 0])}px)`,
          }}
        >
          <span style={{ fontSize: 74 }}>🍫</span>
          <span>ein Riegel Schokolade ≈ 2000 kJ</span>
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={16} volume={0.45} />
      <Caption color={COLORS.sky}>Ganz gleich, welche Form – Energie zählt man immer in Joule (J).</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Energie" footer="Einheit: Joule (J)">
      Energie ist die Fähigkeit,
      <br />
      etwas zu bewirken.
      <br />
      Sie kommt in vielen Formen vor.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const InfoCard: React.FC<{ icon: string; title: string; text: string; delay: number }> = ({ icon, title, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 350, padding: '30px 22px', borderRadius: 24, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
      <div style={{ fontSize: 66, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Gespeicherte Energie im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <InfoCard icon="🔋" title="Batterie" text="chemische Energie" delay={10} />
        <InfoCard icon="🔌" title="Akku" text="lädt und speichert" delay={30} />
        <InfoCard icon="🍎" title="Nahrung" text="Energie für den Körper" delay={50} />
        <InfoCard icon="⛽" title="Benzin" text="treibt den Motor an" delay={70} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.4} />
    <Sfx sound="pop" at={30} volume={0.4} />
    <Sfx sound="pop" at={50} volume={0.4} />
    <Sfx sound="pop" at={70} volume={0.4} />
    <Caption delay={84}>Überall, wo etwas gespeichert ist und später wirken kann, steckt Energie.</Caption>
  </AbsoluteFill>
);

// ── Outro ──────────────────────────────────────────────────────────────
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
  { id: 'intro', C: Intro, min: 130 },
  { id: 'drei', C: DreiScene, min: 230 },
  { id: 'vorrat', C: VorratScene, min: 210 },
  { id: 'formen', C: FormenScene, min: 250 },
  { id: 'joule', C: JouleScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENERGIE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Energie: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENERGIE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/energie/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
