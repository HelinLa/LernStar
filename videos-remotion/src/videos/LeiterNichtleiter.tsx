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
import { RectWire, BatterySym, Bulb, useFade } from '../circuit';
import timings from '../narration/leiter-nichtleiter.timings.json';

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

const LEITER = [
  { icon: '🟠', name: 'Kupfer' },
  { icon: '🔩', name: 'Eisen' },
  { icon: '🥫', name: 'Alu' },
  { icon: '✏️', name: 'Graphit' },
];
const NICHT = [
  { icon: '🪵', name: 'Holz' },
  { icon: '🧴', name: 'Plastik' },
  { icon: '🪟', name: 'Glas' },
  { icon: '🧤', name: 'Gummi' },
];

// Materialprobe in der Lücke unten
const Probe: React.FC<{ icon: string; leitet: boolean }> = ({ icon, leitet }) => (
  <div style={{ position: 'absolute', left: MX - 45, top: BY - 45, width: 90, height: 90, borderRadius: 12, background: COLORS.panel, border: `3px solid ${leitet ? COLORS.green : COLORS.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50 }}>
    {icon}
  </div>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 50, marginBottom: 30, fontSize: 100 }}>
        <div>🟠</div><div>🪵</div><div>✏️</div><div>🧤</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Welche Stoffe leiten Strom?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Leuchtet die Lampe – oder bleibt sie dunkel?
      </div>
    </AbsoluteFill>
  );
};

// ── Test-Prinzip ───────────────────────────────────────────────────────
const TestScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const leitet = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Prinzip" title="Die Lücke im Stromkreis" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on={leitet} gapAtBottom={110} />
      <Bulb x={MX} y={TY} size={110} on={leitet} />
      <Probe icon="❓" leitet={leitet} />
      <div style={{ position: 'absolute', left: 760, top: 250, fontSize: 30, fontWeight: 800, color: leitet ? COLORS.green : COLORS.muted }}>
        {leitet ? 'leitet → Kreis zu → Lampe an ✅' : 'Material in die Lücke setzen …'}
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.5)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Leitet der Stoff, schließt er den Kreis und die Lampe leuchtet.</Caption>
    </AbsoluteFill>
  );
};

// ── Leiter durchtesten ─────────────────────────────────────────────────
const LeiterScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const idx = Math.min(LEITER.length - 1, Math.floor(interpolate(frame, [15, dur - 15], [0, LEITER.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const cur = LEITER[idx];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gruppe 1" title="Leiter – Lampe leuchtet" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on gapAtBottom={110} />
      <Bulb x={MX} y={TY} size={110} on />
      <Probe icon={cur.icon} leitet />
      <div style={{ position: 'absolute', left: 800, top: 250, fontSize: 34, fontWeight: 800, color: COLORS.green }}>{cur.icon} {cur.name}: leitet ✅</div>
      <Sfx sound="pling" at={2} volume={0.3} />
      <Caption>Kupfer, Eisen, Alu, Graphit – alle leiten den Strom.</Caption>
    </AbsoluteFill>
  );
};

// ── Nichtleiter durchtesten ────────────────────────────────────────────
const NichtleiterScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const idx = Math.min(NICHT.length - 1, Math.floor(interpolate(frame, [15, dur - 15], [0, NICHT.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const cur = NICHT[idx];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gruppe 2" title="Nichtleiter – dunkel" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on={false} gapAtBottom={110} />
      <Bulb x={MX} y={TY} size={110} on={false} />
      <Probe icon={cur.icon} leitet={false} />
      <div style={{ position: 'absolute', left: 800, top: 250, fontSize: 34, fontWeight: 800, color: COLORS.muted }}>{cur.icon} {cur.name}: leitet nicht ✖️</div>
      <Sfx sound="pop" at={2} volume={0.28} />
      <Caption>Holz, Plastik, Glas, Gummi – die Lampe bleibt dunkel.</Caption>
    </AbsoluteFill>
  );
};

// ── Regel ──────────────────────────────────────────────────────────────
const RegelScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Die Regel" title="Leiter & Nichtleiter" />
    <div style={{ position: 'absolute', left: 200, top: 260, fontSize: 34, fontWeight: 800, color: COLORS.green }}>✅ Leiter</div>
    <div style={{ position: 'absolute', left: 1080, top: 260, fontSize: 34, fontWeight: 800, color: COLORS.muted }}>✖️ Nichtleiter (Isolatoren)</div>
    <div style={{ position: 'absolute', left: 180, top: 360, fontSize: 40, fontWeight: 700, lineHeight: 1.6 }}>🟠 Metalle<br />✏️ Graphit</div>
    <div style={{ position: 'absolute', left: 1080, top: 360, fontSize: 40, fontWeight: 700, lineHeight: 1.6 }}>🪵 Holz  🧴 Plastik<br />🪟 Glas  🧤 Gummi</div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption delay={30}>Darum sind Kabel innen aus Kupfer und außen von Kunststoff umhüllt.</Caption>
  </AbsoluteFill>
);

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Leiter & Isolatoren" footer="Kabel: Kupfer innen, Kunststoff außen">
      Metalle und Graphit leiten Strom.
      <br />
      Holz, Plastik, Glas und Gummi
      <br />
      leiten nicht (Isolatoren).
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übertragen" title="Leiter + Isolator = sicheres Kabel" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>🔌</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: COLORS.green }}>Draht innen: Metall (leitet)</div>
          </div>
          <div style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>🧤🔧</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: COLORS.sky }}>Griff außen: Gummi (isoliert)</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der Isolator schützt dich – der Strom fließt nur, wo er soll.</Caption>
    </AbsoluteFill>
  );
};

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
  { id: 'test', C: TestScene, min: 240 },
  { id: 'leiter', C: LeiterScene, min: 240 },
  { id: 'nichtleiter', C: NichtleiterScene, min: 240 },
  { id: 'regel', C: RegelScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LEITER_NICHTLEITER_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const LeiterNichtleiter: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LEITER_NICHTLEITER_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/leiter-nichtleiter/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
