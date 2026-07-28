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
import { Nucleus, PartChip } from '../nuclear';
import timings from '../narration/kernaufbau.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Label: React.FC<{ x: number; y: number; text: string; sub: string; color?: string }> = ({ x, y, text, sub, color = COLORS.ink }) => (
  <div style={{ position: 'absolute', left: x - 130, top: y, width: 260, textAlign: 'center' }}>
    <div style={{ fontSize: 30, fontWeight: 900, color }}>{text}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted }}>{sub}</div>
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Nucleus cx={960} cy={330} protons={6} neutrons={6} r={90} />
      <div style={{ height: 120 }} />
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum gibt es vom selben Element verschiedene Sorten?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Protonen, Neutronen und Isotope
      </div>
    </AbsoluteFill>
  );
};

const ProtonenScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Protonenzahl" title="Sie bestimmt das Element" />
      <Nucleus cx={440} cy={520} protons={1} neutrons={0} r={45} />
      <Nucleus cx={960} cy={520} protons={2} neutrons={2} r={60} />
      <Nucleus cx={1480} cy={520} protons={3} neutrons={4} r={72} />
      <Label x={440} y={620} text="1 Proton" sub="Wasserstoff (H)" color={COLORS.amber} />
      <Label x={960} y={640} text="2 Protonen" sub="Helium (He)" color={COLORS.amber} />
      <Label x={1480} y={660} text="3 Protonen" sub="Lithium (Li)" color={COLORS.amber} />
      <div style={{ position: 'absolute', left: 260, top: 300, width: 1400, textAlign: 'center', opacity: f, fontSize: 26, fontWeight: 800, color: COLORS.muted }}>
        Die Anzahl der Protonen heißt Ordnungszahl. Sie legt eindeutig fest, um welches Element es sich handelt.
      </div>
      <Caption delay={30}>Die Zahl der Protonen im Kern nennt man Ordnungszahl. Sie allein bestimmt das Element: 1 ist Wasserstoff, 2 ist Helium, 3 ist Lithium.</Caption>
    </AbsoluteFill>
  );
};

const MassenzahlScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Massenzahl" title="Protonen plus Neutronen" />
      <Nucleus cx={640} cy={540} protons={6} neutrons={6} r={130} />
      <div style={{ position: 'absolute', left: 1120, top: 400, width: 680, opacity: f }}>
        <PartChip color="#ef4444" label="6 Protonen" sign="+" />
        <PartChip color="#64748b" label="6 Neutronen" sign="0" />
        <div style={{ marginTop: 14, padding: '18px 22px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, fontSize: 30, fontWeight: 900 }}>
          Massenzahl = 6 + 6 = 12
        </div>
        <div style={{ marginTop: 12, fontSize: 23, fontWeight: 700, color: COLORS.muted }}>Fast die ganze Masse steckt im Kern – die Elektronen sind viel leichter.</div>
      </div>
      <Caption delay={30}>Zählt man Protonen und Neutronen zusammen, erhält man die Massenzahl. Dieser Kohlenstoffkern hat 6 plus 6, also die Massenzahl 12.</Caption>
    </AbsoluteFill>
  );
};

const IsotopeScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Isotope" title="Gleiche Protonen, andere Neutronen" />
      <Nucleus cx={560} cy={540} protons={6} neutrons={6} r={100} />
      <Nucleus cx={1240} cy={540} protons={6} neutrons={8} r={112} />
      <Label x={560} y={680} text="C-12" sub="6 Protonen · 6 Neutronen" color={COLORS.green} />
      <Label x={1240} y={700} text="C-14" sub="6 Protonen · 8 Neutronen" color={COLORS.sky} />
      <div style={{ position: 'absolute', left: 300, top: 300, width: 1320, textAlign: 'center', opacity: f, fontSize: 25, fontWeight: 800, color: COLORS.muted }}>
        Beide sind Kohlenstoff (6 Protonen) – aber mit verschieden vielen Neutronen. Solche Varianten heißen Isotope.
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={30}>Ändert man nur die Neutronenzahl, bleibt es dasselbe Element. Diese Varianten nennt man Isotope – zum Beispiel C-12 und C-14.</Caption>
    </AbsoluteFill>
  );
};

const SchreibweiseScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Schreibweise" title="So notiert man ein Isotop" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: f, marginTop: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: COLORS.amber }}>14</div>
          <div style={{ fontSize: 64, fontWeight: 900, color: COLORS.sky }}>6</div>
        </div>
        <div style={{ fontSize: 150, fontWeight: 900 }}>C</div>
      </div>
      <div style={{ display: 'flex', gap: 30, marginTop: 30, opacity: f }}>
        <div style={{ padding: '14px 20px', borderRadius: 12, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 24, fontWeight: 800 }}>14 = Massenzahl (oben)</div>
        <div style={{ padding: '14px 20px', borderRadius: 12, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, fontSize: 24, fontWeight: 800 }}>6 = Ordnungszahl (unten)</div>
      </div>
      <Caption delay={30}>Man schreibt oben die Massenzahl und unten die Ordnungszahl vor das Elementsymbol. Aus der Differenz ergibt sich die Neutronenzahl.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kernaufbau & Isotope" footer="Neutronenzahl = Massenzahl − Ordnungszahl">
      Die Protonenzahl (Ordnungszahl) bestimmt das Element.
      <br />
      Isotope haben gleich viele Protonen,
      <br />
      aber verschieden viele Neutronen.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🌳', 'C-14', 'Altersbestimmung'],
    ['🏥', 'Iod-131', 'Medizin'],
    ['☢️', 'Uran-235', 'Kernspaltung'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Isotope mit besonderen Aufgaben" />
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
      <Caption delay={40}>Manche Isotope sind stabil, andere zerfallen und senden Strahlung aus – warum, klärt der nächste Schritt.</Caption>
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
  { id: 'protonen', C: ProtonenScene, min: 250 },
  { id: 'massenzahl', C: MassenzahlScene, min: 240 },
  { id: 'isotope', C: IsotopeScene, min: 250 },
  { id: 'schreibweise', C: SchreibweiseScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KERNAUFBAU_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kernaufbau: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KERNAUFBAU_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kernaufbau/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
