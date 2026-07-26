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
import { LightSource, Ray, useFade } from '../optik';
import timings from '../narration/lichtausbreitung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Pappe mit Loch (senkrechte Wand mit Lücke in der Mitte)
const Blende: React.FC<{ x: number; holeY: number; gap?: number; label?: string }> = ({
  x,
  holeY,
  gap = 46,
  label,
}) => (
  <>
    <div style={{ position: 'absolute', left: x, top: 250, width: 20, height: holeY - gap - 250, borderRadius: 6, background: 'linear-gradient(90deg,#a16207,#78350f)' }} />
    <div style={{ position: 'absolute', left: x, top: holeY + gap, width: 20, height: 900 - (holeY + gap), borderRadius: 6, background: 'linear-gradient(90deg,#a16207,#78350f)' }} />
    {label ? (
      <div style={{ position: 'absolute', left: x - 26, top: 906, fontSize: 24, fontWeight: 700, color: COLORS.muted }}>{label}</div>
    ) : null}
  </>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 110, marginBottom: 40 }}>
        {['💡', '➡️', '👁️'].map((e, i) => (
          <div key={i} style={{ fontSize: 130, transform: `translateY(${Math.sin(frame / 22 + i) * 16}px)` }}>
            {e}
          </div>
        ))}
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie breitet sich Licht aus?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Läuft das Licht in Kurven – oder immer schnurgerade?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: Strahlen laufen geradlinig ─────────────────────────────
const lamp0: [number, number] = [330, 540];
const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [12, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const targets: [number, number][] = [
    [1620, 300],
    [1620, 430],
    [1620, 560],
    [1620, 690],
    [1620, 820],
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Licht läuft schnurgerade" />
      <LightSource x={lamp0[0]} y={lamp0[1]} r={60} emoji="🔦" label="Taschenlampe" />
      {targets.map((t, i) => (
        <Ray key={i} x1={lamp0[0] + 30} y1={lamp0[1]} x2={t[0]} y2={t[1]} progress={p} color={COLORS.amber} width={5} opacity={0.85} arrow />
      ))}
      <Sfx sound="whoosh" at={12} volume={0.35} />
      <Caption delay={54}>Jeder Strahl ist eine gerade Linie – nie eine Kurve, nie um die Ecke.</Caption>
    </AbsoluteFill>
  );
};

// ── Modell: Lichtstrahl = gerade Linie mit Pfeil ───────────────────────
const ModellScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lab = useFade(54);
  const bundle = useFade(90);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Modell" title="Der Lichtstrahl" />
      <Ray x1={330} y1={430} x2={1500} y2={430} progress={p} color={COLORS.sky} width={7} arrow opacity={0.95} />
      <div style={{ position: 'absolute', left: 620, top: 350, fontSize: 30, fontWeight: 800, color: COLORS.sky, opacity: lab }}>
        Lichtstrahl = gerade Linie mit Pfeil
      </div>
      {/* Lichtbündel darunter */}
      {[560, 600, 640, 680].map((y, i) => (
        <Ray key={i} x1={330} y1={y} x2={1500} y2={y} progress={bundle} color={COLORS.amber} width={5} opacity={0.7} />
      ))}
      <div style={{ position: 'absolute', left: 620, top: 720, fontSize: 28, fontWeight: 800, color: COLORS.amber, opacity: bundle }}>
        viele Strahlen = Lichtbündel
      </div>
      <Sfx sound="pling" at={54} volume={0.4} />
      <Caption delay={100}>So zeichnen Physiker das Licht: als geraden Strahl mit Richtungspfeil.</Caption>
    </AbsoluteFill>
  );
};

// ── Blende: 3 Löcher – nur auf einer Linie kommt Licht durch ───────────
const BlendeScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // erste Hälfte: alle Löcher auf Linie → Licht durch. Zweite Hälfte: mittlere verschoben → blockiert.
  const shifted = frame > dur * 0.55;
  const holeY = 540;
  const midY = shifted ? 400 : holeY;
  const p = interpolate(frame, [10, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const reached = !shifted;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beweis" title="Drei Löcher auf einer Linie" />
      <LightSource x={220} y={holeY} r={50} emoji="🔦" />
      <Blende x={620} holeY={holeY} label="1" />
      <Blende x={960} holeY={midY} label="2" />
      <Blende x={1300} holeY={holeY} label="3" />
      {/* Strahl bis Blende 1 */}
      <Ray x1={250} y1={holeY} x2={620} y2={holeY} progress={p} color={COLORS.amber} width={5} />
      {/* durch Loch 1 zu Loch 2 */}
      {p > 0.9 ? <Ray x1={630} y1={holeY} x2={960} y2={midY} progress={reached ? 1 : 0.55} color={reached ? COLORS.amber : COLORS.red} width={5} /> : null}
      {/* nur wenn ausgerichtet: weiter durch Loch 2 und 3 bis Schirm */}
      {p > 0.9 && reached ? (
        <>
          <Ray x1={970} y1={holeY} x2={1300} y2={holeY} color={COLORS.amber} width={5} />
          <Ray x1={1310} y1={holeY} x2={1640} y2={holeY} color={COLORS.green} width={5} arrow />
          <div style={{ position: 'absolute', left: 1500, top: holeY - 70, fontSize: 30, fontWeight: 800, color: COLORS.green }}>Licht kommt an ✅</div>
        </>
      ) : null}
      {p > 0.9 && shifted ? (
        <div style={{ position: 'absolute', left: 1000, top: 300, fontSize: 30, fontWeight: 800, color: COLORS.red }}>blockiert – kein Knick möglich ❌</div>
      ) : null}
      <Sfx sound={shifted ? 'impact' : 'pling'} at={Math.round(dur * 0.55) + 2} volume={0.4} />
      <Caption delay={Math.round(dur * 0.55) + 8}>Nur wenn alle Löcher exakt auf einer Geraden liegen, geht das Licht hindurch.</Caption>
    </AbsoluteFill>
  );
};

// ── Tempo: Lichtgeschwindigkeit ────────────────────────────────────────
const TempoScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const big = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const earth = useFade(60);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Wie schnell?" title="Nichts ist schneller" />
      <div style={{ fontSize: 120, fontWeight: 900, color: COLORS.sky, opacity: big, transform: `scale(${interpolate(big, [0, 1], [0.6, 1])})` }}>
        300 000 km/s
      </div>
      <div style={{ marginTop: 24, display: 'flex', gap: 30, alignItems: 'center', opacity: earth }}>
        <div style={{ fontSize: 90, transform: `rotate(${frame * 2}deg)` }}>🌍</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.amber }}>≈ 8× um die Erde – in 1 Sekunde</div>
      </div>
      <Sfx sound="whoosh" at={20} volume={0.4} />
      <Caption delay={70}>In einer Sekunde umrundet Licht die Erde fast achtmal.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Lichtausbreitung" footer="dargestellt als Lichtstrahl mit Pfeil">
      Licht breitet sich
      <br />
      geradlinig aus –
      <br />
      in alle Richtungen.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Gerade Strahlen im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="🔴" title="Laserstrahl" delay={10} />
        <TCard icon="🌤️" title="Sonnenstrahlen" delay={30} />
        <TCard icon="🔦" title="Taschenlampe" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall läuft das Licht in geraden Linien – scharf und geradeaus.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 240 },
  { id: 'modell', C: ModellScene, min: 260 },
  { id: 'blende', C: BlendeScene, min: 280 },
  { id: 'tempo', C: TempoScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LICHTAUSBREITUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Lichtausbreitung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LICHTAUSBREITUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/lichtausbreitung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
