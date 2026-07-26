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
import { LightSource, Ray, Screen, ShadowPatch, useFade } from '../optik';
import timings from '../narration/schatten-groesse.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const LAMP: [number, number] = [250, 540];
const SCREEN_X = 1560;
const R = 70; // Ballradius
const projectY = (edgeY: number, ballX: number) =>
  LAMP[1] + (edgeY - LAMP[1]) * ((SCREEN_X - LAMP[0]) / (ballX - LAMP[0]));

const ShadowCone: React.FC<{ pts: [number, number][]; opacity?: number }> = ({ pts, opacity = 0.5 }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="#020617" opacity={opacity} />
  </svg>
);

// Ball + Schattenwurf für gegebene Ball-x-Position
const BallShadow: React.FC<{ ballX: number; showRays?: boolean }> = ({ ballX, showRays = true }) => {
  const top = 540 - R;
  const bot = 540 + R;
  const sTop = projectY(top, ballX);
  const sBot = projectY(bot, ballX);
  return (
    <>
      {showRays ? (
        <>
          <Ray x1={LAMP[0] + 24} y1={LAMP[1]} x2={SCREEN_X} y2={sTop} color={COLORS.amber} width={4} opacity={0.55} />
          <Ray x1={LAMP[0] + 24} y1={LAMP[1]} x2={SCREEN_X} y2={sBot} color={COLORS.amber} width={4} opacity={0.55} />
        </>
      ) : null}
      <ShadowCone pts={[[ballX, top], [SCREEN_X, sTop], [SCREEN_X, sBot], [ballX, bot]]} opacity={0.45} />
      <ShadowPatch x={SCREEN_X + 11} yTop={sTop} yBot={sBot} w={26} opacity={0.9} />
      <div style={{ position: 'absolute', left: ballX - R, top: 540 - R, fontSize: R * 2 }}>⚽</div>
    </>
  );
};

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 90, marginBottom: 40, alignItems: 'flex-end' }}>
        <div style={{ fontSize: 90, transform: `translateY(${Math.sin(frame / 22) * 12}px)` }}>🧍</div>
        <div style={{ fontSize: 150, transform: `translateY(${Math.sin(frame / 22 + 1) * 12}px)` }}>🧍</div>
        <div style={{ fontSize: 60, transform: `translateY(${Math.sin(frame / 22 + 2) * 12}px)` }}>🧍</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 76, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie groß wird ein Schatten?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Mal winzig, mal riesig – wovon hängt das ab?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: Ball wandert von Lampe weg → Schatten schrumpft ────────
const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [30, dur - 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ballX = interpolate(move, [0, 1], [560, 1150]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Gleicher Ball, anderer Schatten" />
      <LightSource x={LAMP[0]} y={LAMP[1]} r={54} emoji="💡" label="Lampe" />
      <BallShadow ballX={ballX} />
      <Screen x={SCREEN_X} yTop={160} yBot={980} label="Wand" />
      <div style={{ position: 'absolute', left: ballX - 30, top: 700, fontSize: 44, color: COLORS.sky }}>➡️</div>
      <Sfx sound="whoosh" at={30} volume={0.3} />
      <Caption delay={Math.round(dur * 0.55)}>Weg von der Lampe – näher an die Wand: der Schatten wird kleiner.</Caption>
    </AbsoluteFill>
  );
};

// ── Zusammenhang: Strahlen fächern nah stark auf ───────────────────────
const ZusammenhangScene: React.FC<SceneProps> = () => {
  const lab = useFade(50);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum?" title="Strahlen fächern auf" />
      <LightSource x={LAMP[0]} y={LAMP[1]} r={54} emoji="💡" />
      {/* Fächer aus vielen Strahlen */}
      {[200, 320, 440, 560, 680, 800, 900].map((y, i) => (
        <Ray key={i} x1={LAMP[0] + 24} y1={LAMP[1]} x2={SCREEN_X} y2={y} color={COLORS.amber} width={3} opacity={0.5} />
      ))}
      <Screen x={SCREEN_X} yTop={160} yBot={980} />
      <div style={{ position: 'absolute', left: 520, top: 240, fontSize: 28, fontWeight: 800, color: COLORS.sky, opacity: lab }}>
        nah: Strahlen laufen stark auseinander → großer Schatten
      </div>
      <div style={{ position: 'absolute', left: 1120, top: 800, fontSize: 28, fontWeight: 800, color: COLORS.green, opacity: lab }}>
        weit weg: fast parallel → kleiner Schatten
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={60}>Neben der Lampe deckt der Körper einen breiten Strahlenbereich ab.</Caption>
    </AbsoluteFill>
  );
};

// ── Variieren: drei Faktoren ───────────────────────────────────────────
const FCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 380, padding: '28px 20px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 30}px)` }}>
      <div style={{ fontSize: 66 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{title}</div>
    </div>
  );
};
const VariierenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Was zählt?" title="Drei Größen entscheiden" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <FCard icon="↔️💡" title="Abstand zur Lampe" delay={10} />
        <FCard icon="↔️🧱" title="Abstand zur Wand" delay={30} />
        <FCard icon="📏" title="Größe des Körpers" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption delay={66}>Näher an der Lampe oder größerer Körper → größerer Schatten.</Caption>
  </AbsoluteFill>
);

// ── Beispiel: Sonne mittags vs abends ──────────────────────────────────
const BeispielScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [20, dur - 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Sonne wandert von hoch (mittags) nach flach (abends)
  const sunX = interpolate(t, [0, 1], [960, 300]);
  const sunY = interpolate(t, [0, 1], [180, 460]);
  const person: [number, number] = [1050, 760];
  // Schattenlänge auf Boden (y=820)
  const groundY = 820;
  const shadowEndX = person[0] + (person[0] - sunX) * ((groundY - person[1]) / (person[1] - sunY)) * -1;
  const sx = interpolate(t, [0, 1], [person[0] + 120, 1750]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="Dein Schatten: mittags kurz, abends lang" />
      <LightSource x={sunX} y={sunY} r={70} emoji="☀️" />
      <div style={{ position: 'absolute', left: 0, top: groundY, width: '100%', height: 6, background: COLORS.muted, opacity: 0.4 }} />
      {/* Schatten als dunkle Ellipse am Boden */}
      <div style={{ position: 'absolute', left: person[0], top: groundY - 20, width: sx - person[0], height: 40, background: '#020617', opacity: 0.55, borderRadius: 20, transformOrigin: 'left center' }} />
      <div style={{ position: 'absolute', left: person[0] - 40, top: person[1] - 90, fontSize: 130 }}>🧍</div>
      <div style={{ position: 'absolute', left: 120, top: 300, fontSize: 34, fontWeight: 800, color: COLORS.amber }}>
        {t < 0.5 ? '☀️ Sonne hoch → kurzer Schatten' : '🌇 Sonne flach → langer Schatten'}
      </div>
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Flache Sonne heißt: das Licht streift dich – der Schatten wird lang gezogen.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Schattengröße" footer="Abstand + Körpergröße bestimmen den Schatten">
      Je näher an der Lampe
      <br />
      und je größer der Körper,
      <br />
      desto größer der Schatten.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Groß gemacht" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="🖐️" title="Handschatten an der Wand" delay={10} />
        <TCard icon="📽️" title="Diaprojektor" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Dicht an der Lampe wird alles riesengroß projiziert.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 260 },
  { id: 'zusammenhang', C: ZusammenhangScene, min: 240 },
  { id: 'variieren', C: VariierenScene, min: 210 },
  { id: 'beispiel', C: BeispielScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SCHATTEN_GROESSE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const SchattenGroesse: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SCHATTEN_GROESSE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/schatten-groesse/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
