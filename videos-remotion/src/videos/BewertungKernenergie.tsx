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
import timings from '../narration/bewertung-kernenergie.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Card: React.FC<{ icon: string; title: string; sub: string; color: string; delay: number }> = ({ icon, title, sub, color, delay }) => {
  const frame = useCurrentFrame();
  const f = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ width: 400, padding: '24px 20px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${color}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 20}px)` }}>
      <div style={{ fontSize: 64 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 900, marginTop: 6 }}>{title}</div>
      <div style={{ fontSize: 21, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{sub}</div>
    </div>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120 }}>⚖️☢️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 58, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Kernenergie: Segen oder Gefahr?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Chancen und Risiken abwägen
      </div>
    </AbsoluteFill>
  );
};

const ChancenScene: React.FC<SceneProps> = () => {
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Chancen" title="Was für die Kernenergie spricht" />
      <div style={{ position: 'absolute', top: 340, left: 0, right: 0, display: 'flex', gap: 34, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1720, margin: '0 auto' }}>
        <Card icon="🌍" title="Kaum CO₂" sub="schützt das Klima" color={COLORS.green} delay={14} />
        <Card icon="⚡" title="Viel Energie" sub="aus wenig Brennstoff" color={COLORS.green} delay={26} />
        <Card icon="🔋" title="Zuverlässig" sub="Grundlast rund um die Uhr" color={COLORS.green} delay={38} />
        <Card icon="🌫️" title="Kein Feinstaub" sub="anders als Kohle" color={COLORS.green} delay={50} />
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={30}>Für die Kernenergie spricht: Sie erzeugt kaum CO₂ und schützt so das Klima, liefert aus wenig Brennstoff sehr viel Energie, arbeitet zuverlässig rund um die Uhr und macht keinen Feinstaub.</Caption>
    </AbsoluteFill>
  );
};

const RisikenScene: React.FC<SceneProps> = () => {
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Risiken" title="Was dagegen spricht" />
      <div style={{ position: 'absolute', top: 340, left: 0, right: 0, display: 'flex', gap: 34, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1720, margin: '0 auto' }}>
        <Card icon="⚠️" title="Unfallgefahr" sub="Tschernobyl, Fukushima" color={COLORS.red} delay={14} />
        <Card icon="☢️" title="Radioaktiver Müll" sub="Endlager ungelöst" color={COLORS.red} delay={26} />
        <Card icon="⛏️" title="Uran ist begrenzt" sub="und muss abgebaut werden" color={COLORS.red} delay={38} />
        <Card icon="💰" title="Hohe Kosten" sub="Bau, Sicherheit, Rückbau" color={COLORS.red} delay={50} />
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={30}>Dagegen sprechen: die Gefahr schwerer Unfälle, der radioaktive Müll ohne sicheres Endlager, das begrenzte und abzubauende Uran sowie die hohen Kosten für Bau, Sicherheit und Rückbau.</Caption>
    </AbsoluteFill>
  );
};

const AbwaegenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const tilt = Math.sin(frame / 22) * 5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Abwägen" title="Es gibt keine einfache Antwort" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={960} y1={420} x2={960} y2={640} stroke={COLORS.muted} strokeWidth={8} />
        <polygon points="920,640 1000,640 960,720" fill={COLORS.muted} />
        <g transform={`rotate(${tilt} 960 420)`}>
          <line x1={640} y1={420} x2={1280} y2={420} stroke={COLORS.ink} strokeWidth={8} strokeLinecap="round" />
          {/* linke Schale */}
          <line x1={640} y1={420} x2={640} y2={500} stroke={COLORS.muted} strokeWidth={3} />
          <path d="M 560 500 A 80 40 0 0 0 720 500 Z" fill="rgba(34,197,94,0.2)" stroke={COLORS.green} strokeWidth={3} />
          <text x={640} y={490} fontSize={30} textAnchor="middle">🌍⚡</text>
          {/* rechte Schale */}
          <line x1={1280} y1={420} x2={1280} y2={500} stroke={COLORS.muted} strokeWidth={3} />
          <path d="M 1200 500 A 80 40 0 0 0 1360 500 Z" fill="rgba(239,68,68,0.2)" stroke={COLORS.red} strokeWidth={3} />
          <text x={1280} y={490} fontSize={30} textAnchor="middle">⚠️☢️</text>
        </g>
        <text x={640} y={600} fontSize={26} fontWeight="800" fill={COLORS.green} textAnchor="middle">Chancen</text>
        <text x={1280} y={600} fontSize={26} fontWeight="800" fill={COLORS.red} textAnchor="middle">Risiken</text>
      </svg>
      <Caption delay={30}>Legt man Chancen und Risiken auf eine Waage, gibt es keinen klaren Sieger. Wie schwer jede Seite wiegt, hängt davon ab, was einem wichtig ist – deshalb entscheiden Länder ganz unterschiedlich.</Caption>
    </AbsoluteFill>
  );
};

const VerantwortungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const items = [
    ['📚', 'Fakten kennen', 'wie funktioniert es wirklich?'],
    ['⚖️', 'Werte abwägen', 'Klima, Sicherheit, Kosten'],
    ['🌱', 'Zukunft mitdenken', 'auch für kommende Generationen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Verantwortung" title="Eine Entscheidung mit Weitblick" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 460, padding: '30px 20px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Caption delay={30}>Eine gute Bewertung braucht dreierlei: die Fakten kennen, die Werte ehrlich abwägen und an die Zukunft denken – denn die Entscheidung wirkt auf kommende Generationen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kernenergie bewerten" footer="informieren · abwägen · begründen">
      Kernenergie hat große Chancen und große Risiken.
      <br />
      Ob sie Segen oder Gefahr ist, ist keine reine Physik-,
      <br />
      sondern eine Wertefrage – bilde dir dein eigenes Urteil.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔎', 'Informieren', 'Quellen prüfen'],
    ['🗣️', 'Argumente hören', 'auch die Gegenseite'],
    ['✍️', 'Position begründen', 'mit Fakten'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="So bildest du dir eine Meinung" />
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
      <Caption delay={40}>Diese Fähigkeit, Chancen und Risiken sachlich abzuwägen, brauchst du bei vielen großen Fragen – nicht nur bei der Kernenergie.</Caption>
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
  { id: 'chancen', C: ChancenScene, min: 250 },
  { id: 'risiken', C: RisikenScene, min: 250 },
  { id: 'abwaegen', C: AbwaegenScene, min: 250 },
  { id: 'verantwortung', C: VerantwortungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BEWERTUNG_KERNENERGIE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const BewertungKernenergie: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BEWERTUNG_KERNENERGIE_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/bewertung-kernenergie/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
