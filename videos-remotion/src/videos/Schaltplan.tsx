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
import { RectWire, LampSym, BatterySym, SwitchSym, Bulb, useFade } from '../circuit';
import timings from '../narration/schaltplan.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// kleiner Rahmen für Real- bzw. Planansicht
const box = { LX: 640, RX: 1280, TY: 380, BY: 740 };
const MX = (box.LX + box.RX) / 2;

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 50, marginBottom: 30, fontSize: 120, alignItems: 'center' }}>
        <div>🔦</div><div style={{ fontSize: 70 }}>➡️</div><div>📐</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie zeichnet man einen Stromkreis?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Vom bunten Bild zum klaren Schaltplan.
      </div>
    </AbsoluteFill>
  );
};

// ── Realaufbau ─────────────────────────────────────────────────────────
const RealScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Ansicht 1" title="Der echte Aufbau" />
    <RectWire LX={box.LX} RX={box.RX} TY={box.TY} BY={box.BY} on gapAtBottom={120} />
    <Bulb x={MX} y={box.TY} size={110} on />
    <div style={{ position: 'absolute', left: box.LX - 40, top: (box.TY + box.BY) / 2 - 40, fontSize: 70 }}>🔋</div>
    <div style={{ position: 'absolute', left: MX - 35, top: box.BY - 45, fontSize: 70 }}>🔘</div>
    <div style={{ position: 'absolute', left: 760, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.muted }}>bunt & räumlich – schwer zu zeichnen</div>
    <Sfx sound="pop" at={12} volume={0.34} />
    <Caption>Batterie, Kabel, Schalter, Glühlampe – aber unübersichtlich.</Caption>
  </AbsoluteFill>
);

// ── Umwandeln ──────────────────────────────────────────────────────────
const WandelnScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const morph = interpolate(frame, [20, dur * 0.55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const showSym = morph > 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Umwandeln" title="Bauteil → Schaltzeichen" />
      <RectWire LX={box.LX} RX={box.RX} TY={box.TY} BY={box.BY} on gapAtBottom={120} />
      {/* Lampe */}
      {showSym ? <LampSym x={MX} y={box.TY} on /> : <Bulb x={MX} y={box.TY} size={110} on />}
      {/* Batterie */}
      {showSym ? <BatterySym x={box.LX} y={(box.TY + box.BY) / 2} horizontal={false} /> : <div style={{ position: 'absolute', left: box.LX - 40, top: (box.TY + box.BY) / 2 - 40, fontSize: 70 }}>🔋</div>}
      {/* Schalter */}
      {showSym ? <SwitchSym x={MX} y={box.BY} closed /> : <div style={{ position: 'absolute', left: MX - 35, top: box.BY - 45, fontSize: 70 }}>🔘</div>}
      <div style={{ position: 'absolute', left: 720, top: 250, fontSize: 30, fontWeight: 800, color: showSym ? COLORS.green : COLORS.amber }}>
        {showSym ? '→ jetzt als Schaltzeichen' : 'jedes Teil bekommt ein Zeichen …'}
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.5)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.55)}>Batterie → Striche, Lampe → Kreis mit Kreuz, Schalter → Hebel.</Caption>
    </AbsoluteFill>
  );
};

// ── Fertiger Plan ──────────────────────────────────────────────────────
const PlanScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const closed = frame % 120 < 80;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ansicht 2" title="Der fertige Schaltplan" />
      <RectWire LX={box.LX} RX={box.RX} TY={box.TY} BY={box.BY} on={closed} gapAtBottom={120} />
      <LampSym x={MX} y={box.TY} on={closed} />
      <BatterySym x={box.LX} y={(box.TY + box.BY) / 2} horizontal={false} />
      <SwitchSym x={MX} y={box.BY} closed={closed} />
      <div style={{ position: 'absolute', left: 740, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.sky }}>einfach · eindeutig · schnell gezeichnet</div>
      <Sfx sound="pop" at={40} volume={0.3} />
      <Caption delay={30}>Schalter betätigen – der Plan reagiert wie der echte Stromkreis.</Caption>
    </AbsoluteFill>
  );
};

// ── Zuordnen ───────────────────────────────────────────────────────────
const SymCard: React.FC<{ children: React.ReactNode; name: string; delay: number }> = ({ children, name, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 260, height: 210, borderRadius: 20, background: COLORS.panel, border: `1px solid ${COLORS.border}`, position: 'relative', opacity: f, transform: `translateY(${(1 - f) * 26}px)` }}>
      {children}
      <div style={{ position: 'absolute', bottom: 14, left: 0, width: '100%', textAlign: 'center', fontSize: 24, fontWeight: 800 }}>{name}</div>
    </div>
  );
};
const ZuordnenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Merk dir" title="Die vier Zeichen" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 28 }}>
        <SymCard name="Batterie" delay={10}><BatterySym x={130} y={90} /></SymCard>
        <SymCard name="Lampe" delay={26}><LampSym x={130} y={90} on={false} /></SymCard>
        <SymCard name="Schalter" delay={42}><SwitchSym x={130} y={90} closed={false} /></SymCard>
        <SymCard name="Leitung" delay={58}>
          <svg viewBox="0 0 260 210" style={{ width: '100%', height: '100%' }}><line x1={50} y1={90} x2={210} y2={90} stroke={COLORS.ink} strokeWidth={6} /></svg>
        </SymCard>
      </div>
    </AbsoluteFill>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption delay={76}>Diese vier Zeichen brauchst du für fast jeden Schaltplan.</Caption>
  </AbsoluteFill>
);

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Schaltplan" footer="gleiche Schaltung, klare Zeichen">
      Ein Schaltplan zeigt denselben
      <br />
      Stromkreis mit einheitlichen
      <br />
      Schaltzeichen – klar & eindeutig.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 380, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Pläne in der Praxis" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="🏠⚡" title="Elektriker verdrahtet Wohnung" delay={10} />
        <TCard icon="🔧🔌" title="Bastelanleitung Elektronik" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Nach solchen Plänen wird gebaut – vom Bastelset bis zum Haus.</Caption>
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
  { id: 'real', C: RealScene, min: 220 },
  { id: 'wandeln', C: WandelnScene, min: 260 },
  { id: 'plan', C: PlanScene, min: 240 },
  { id: 'zuordnen', C: ZuordnenScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SCHALTPLAN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Schaltplan: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SCHALTPLAN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/schaltplan/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
