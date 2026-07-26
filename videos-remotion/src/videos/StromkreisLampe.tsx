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
import { RectWire, BatterySym, SwitchSym, Bulb, useFade } from '../circuit';
import timings from '../narration/stromkreis-lampe.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const LX = 620;
const RX = 1300;
const TY = 340;
const BY = 760;
const MX = (LX + RX) / 2;

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const on = Math.floor(frame / 18) % 2 === 0;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 200, marginBottom: 20, opacity: on ? 1 : 0.4 }}>💡</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 88, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wann leuchtet eine Lampe?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum reicht schon eine kleine Lücke, damit es dunkel bleibt?
      </div>
    </AbsoluteFill>
  );
};

// ── Geschlossen ────────────────────────────────────────────────────────
const GeschlossenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Ausgangslage" title="Geschlossener Kreis – Lampe leuchtet" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on />
    <Bulb x={MX} y={TY} size={120} on />
    <BatterySym x={MX} y={BY} />
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption>Alles verbunden – der Strom fließt im Ring, die Lampe leuchtet hell.</Caption>
  </AbsoluteFill>
);

// ── Schalter auf/zu ────────────────────────────────────────────────────
const SchalterScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // zu → auf → zu
  const closed = !(frame > dur * 0.33 && frame < dur * 0.7);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Test 1" title="Schalter öffnen" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on={closed} gapAtBottom={140} />
      <Bulb x={MX} y={TY} size={120} on={closed} />
      <SwitchSym x={MX} y={BY} closed={closed} />
      <div style={{ position: 'absolute', left: 780, top: 250, fontSize: 32, fontWeight: 800, color: closed ? COLORS.green : COLORS.red }}>
        {closed ? '✅ geschlossen → leuchtet' : '❌ offen → dunkel'}
      </div>
      <Sfx sound="pop" at={Math.round(dur * 0.33)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.33) + 6}>Offen: kein Strom fließt – die Lampe geht aus.</Caption>
    </AbsoluteFill>
  );
};

// ── Kabel-Unterbrechung ────────────────────────────────────────────────
const UnterbrechungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cut = frame > dur * 0.4;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Test 2" title="Kabel an anderer Stelle trennen" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on={!cut} />
      <Bulb x={MX} y={TY} size={120} on={!cut} />
      <BatterySym x={MX} y={BY} />
      {cut ? (
        <>
          <div style={{ position: 'absolute', left: RX - 18, top: (TY + BY) / 2 - 30, fontSize: 60 }}>✂️</div>
          <div style={{ position: 'absolute', left: RX + 30, top: (TY + BY) / 2 - 10, fontSize: 30, fontWeight: 800, color: COLORS.red }}>Unterbrechung!</div>
        </>
      ) : null}
      <Sfx sound="impact" at={Math.round(dur * 0.4)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.4) + 8}>Egal wo: eine einzige Unterbrechung stoppt den ganzen Strom.</Caption>
    </AbsoluteFill>
  );
};

// ── Sicherheit ─────────────────────────────────────────────────────────
const SicherScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Sicherheit" title="Nur ungefährliche Batterie" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>🔋</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10, color: COLORS.green }}>Batterie – ungefährlich</div>
          </div>
          <div style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>🔌⚠️</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10, color: COLORS.red }}>Steckdose – lebensgefährlich!</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Experimente nur mit kleiner Batterie-Spannung – niemals an der Steckdose!</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Geschlossener Kreis" footer="eine Lücke reicht – überall">
      Eine Lampe leuchtet nur
      <br />
      im geschlossenen Stromkreis.
      <br />
      Jede Unterbrechung stoppt sie.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Wenn das Licht ausgeht" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="🔌✂️" title="Kabelbruch / Stecker raus" delay={10} />
        <TCard icon="💡🔘" title="Schalter – mit Absicht" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Kabelbruch oder Schalter – beide unterbrechen den Kreis.</Caption>
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
  { id: 'geschlossen', C: GeschlossenScene, min: 220 },
  { id: 'schalter', C: SchalterScene, min: 260 },
  { id: 'unterbrechung', C: UnterbrechungScene, min: 240 },
  { id: 'sicher', C: SicherScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STROMKREIS_LAMPE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const StromkreisLampe: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STROMKREIS_LAMPE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/stromkreis-lampe/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
