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
import { useFade } from '../astro';
import timings from '../narration/hebelgesetz.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Wippe/Hebel um Drehpunkt (fx,fy), Balken mit Neigung angle. Last links, Kraft rechts.
const Lever: React.FC<{ fx: number; fy: number; angle: number; l1: number; l2: number; f1: number; f2: number }> = ({ fx, fy, angle, l1, l2, f1, f2 }) => {
  const rad = (angle * Math.PI) / 180;
  const ax = fx - Math.cos(rad) * l1, ay = fy - Math.sin(rad) * l1; // Last-Ende (links)
  const bx = fx + Math.cos(rad) * l2, by = fy + Math.sin(rad) * l2; // Kraft-Ende (rechts)
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Drehpunkt (Dreieck) */}
      <polygon points={`${fx - 40},${fy + 90} ${fx + 40},${fy + 90} ${fx},${fy}`} fill={COLORS.muted} />
      {/* Balken */}
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={COLORS.ink} strokeWidth={14} strokeLinecap="round" />
      {/* Last links (Gewicht) */}
      <rect x={ax - 40} y={ay - 80} width={80} height={80} rx={8} fill={COLORS.sky} />
      <text x={ax} y={ay - 30} fontSize={30} fill="#0b1120" textAnchor="middle" fontWeight="bold">{f1}</text>
      {/* Kraft rechts (Gewicht) */}
      <rect x={bx - 32} y={by - 64} width={64} height={64} rx={8} fill={COLORS.amber} />
      <text x={bx} y={by - 22} fontSize={26} fill="#0b1120" textAnchor="middle" fontWeight="bold">{f2}</text>
      {/* Hebelarme */}
      <line x1={ax} y1={ay + 30} x2={fx} y2={fy + 30} stroke={COLORS.sky} strokeWidth={3} />
      <line x1={fx} y1={fy + 30} x2={bx} y2={by + 30} stroke={COLORS.amber} strokeWidth={3} />
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 150, marginBottom: 20 }}>🪨➖</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Das Hebelgesetz
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie hebst du mit einer Stange einen tonnenschweren Felsen?
      </div>
    </AbsoluteFill>
  );
};

const GesetzScene: React.FC<SceneProps> = () => {
  const f = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Gesetz" title="Kraft × Kraftarm = Last × Lastarm" />
      <Lever fx={960} fy={560} angle={0} l1={200} l2={320} f1="Last" f2="Kraft" />
      <div style={{ position: 'absolute', left: 600, top: 720, fontSize: 50, fontWeight: 900, color: COLORS.amber, opacity: f }}>F₁ · l₁ = F₂ · l₂</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Ein Hebel dreht sich um den Drehpunkt – Kraft mal Kraftarm gleich Last mal Lastarm.</Caption>
    </AbsoluteFill>
  );
};

const HebelarmScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const long = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Trick" title={long ? 'Langer Kraftarm → wenig Kraft' : 'Kurzer Arm → viel Kraft'} />
      <Lever fx={780} fy={560} angle={0} l1={120} l2={long ? 560 : 200} f1="500" f2={long ? '100' : '300'} />
      <div style={{ position: 'absolute', left: 500, top: 760, fontSize: 30, fontWeight: 800, color: long ? COLORS.green : COLORS.red }}>
        {long ? '✅ langer Hebel spart Kraft (Brechstange)' : 'kurzer Hebel: viel Kraft nötig'}
      </div>
      <Sfx sound="whoosh" at={Math.round(dur * 0.5)} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Ein langer Kraftarm gleicht eine kleine Kraft aus – so hebt die Brechstange Tonnen.</Caption>
    </AbsoluteFill>
  );
};

const ArtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zwei Arten" title="Ein- & zweiseitiger Hebel" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>🛝</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>zweiseitig – Wippe (Kraft & Last gegenüber)</div>
          </div>
          <div style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>🥜</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>einseitig – Nussknacker (auf derselben Seite)</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Zweiseitig: Kraft und Last auf gegenüberliegenden Seiten. Einseitig: auf derselben.</Caption>
    </AbsoluteFill>
  );
};

const GleichgewichtScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bal = Math.sin(frame / 20) * 4 * Math.max(0, 1 - frame / 80);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="Die Wippe im Gleichgewicht" />
      <Lever fx={960} fy={560} angle={bal} l1={160} l2={360} f1="🧑" f2="🧒" />
      <div style={{ position: 'absolute', left: 500, top: 740, fontSize: 30, fontWeight: 800, color: COLORS.green }}>schwer & nah = leicht & weit</div>
      <Sfx sound="pling" at={70} volume={0.35} />
      <Caption delay={Math.round(dur * 0.4)}>Schweres Kind nah am Drehpunkt, leichtes weit außen – und die Wippe ist im Gleichgewicht.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Hebelgesetz" footer="ein langer Kraftarm spart Kraft">
      Kraft × Kraftarm = Last × Lastarm.
      <br />
      F₁ · l₁ = F₂ · l₂
    </MerksatzBox>
  </AbsoluteFill>
);

const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 30}px)` }}>
      <div style={{ fontSize: 70 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Hebel in Werkzeugen" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 30 }}>
        <TCard icon="✂️" title="Schere" delay={10} />
        <TCard icon="🗜️" title="Zange" delay={26} />
        <TCard icon="🔧" title="Brechstange" delay={42} />
        <TCard icon="🛒" title="Schubkarre" delay={58} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={74}>Überall verwandelt ein Hebel eine kleine Kraft in eine große Wirkung.</Caption>
  </AbsoluteFill>
);

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
  { id: 'gesetz', C: GesetzScene, min: 260 },
  { id: 'hebelarm', C: HebelarmScene, min: 240 },
  { id: 'arten', C: ArtenScene, min: 220 },
  { id: 'gleichgewicht', C: GleichgewichtScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const HEBELGESETZ_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Hebelgesetz: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={HEBELGESETZ_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/hebelgesetz/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
