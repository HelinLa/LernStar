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
  Easing,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, Arrow, Ball, MerksatzBox, StarLogo, BackgroundMusic, Sfx } from '../components';
import timings from '../narration/traegheit.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20; // Frames Nachlauf nach dem Sprechen
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

const GROUND_Y = 760;

const Ground: React.FC<{ ice?: boolean }> = ({ ice }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: GROUND_Y,
      height: 8,
      background: ice ? COLORS.ice : COLORS.ground,
      boxShadow: ice ? `0 0 40px ${COLORS.ice}55` : 'none',
    }}
  />
);

type SceneProps = { dur: number };

// ── Szene 1: Intro ─────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleS = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const subS = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={110} />
      <div
        style={{
          marginTop: 44,
          fontSize: 96,
          fontWeight: 900,
          opacity: titleS,
          transform: `translateY(${interpolate(titleS, [0, 1], [40, 0])}px)`,
        }}
      >
        Trägheit
      </div>
      <div
        style={{
          marginTop: 22,
          fontSize: 42,
          fontWeight: 600,
          color: COLORS.muted,
          maxWidth: 1300,
          textAlign: 'center',
          opacity: subS,
        }}
      >
        Warum bewegt sich nichts von allein schneller – wer oder was steckt dahinter?
      </div>
    </AbsoluteFill>
  );
};

// ── Szene 2: Ruhe bleibt Ruhe (bis eine Kraft wirkt) ───────────────────
const RuheScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pushStart = Math.round(dur * 0.46);
  const push = frame >= pushStart;
  const x = interpolate(frame, [pushStart, dur - 8], [560, 1360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const arrowOpacity = interpolate(
    frame,
    [pushStart - 20, pushStart, pushStart + 28, pushStart + 52],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zustand 1 · Ruhe" title="Ein ruhender Körper bleibt in Ruhe" />
      <Ground />
      <Ball x={push ? x : 560} y={GROUND_Y - 46} color={COLORS.amber} />
      <Arrow x1={380} y1={GROUND_Y - 46} x2={500} y2={GROUND_Y - 46} color={COLORS.green} opacity={arrowOpacity} />
      <Sfx sound="impact" at={pushStart} volume={0.5} />
      {frame < pushStart ? (
        <Caption>Von allein passiert nichts – die Kugel bleibt einfach liegen.</Caption>
      ) : (
        <Caption color={COLORS.green}>… erst eine Kraft (ein Schubs) setzt sie in Bewegung.</Caption>
      )}
    </AbsoluteFill>
  );
};

// ── Szene 3: Bewegung bleibt Bewegung (ohne Kraft) ─────────────────────
const BewegungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, dur], [-120, 2040], { easing: Easing.linear });
  const marks = [420, 700, 980, 1260, 1540];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zustand 2 · Bewegung" title="Ein bewegter Körper bleibt in Bewegung" />
      <Ground ice />
      {marks.map((mx, i) => (
        <div
          key={i}
          style={{ position: 'absolute', left: mx, top: GROUND_Y - 22, width: 4, height: 22, background: COLORS.sky, opacity: 0.5 }}
        />
      ))}
      <Ball x={x} y={GROUND_Y - 40} r={40} color={COLORS.sky} label="🧊 Puck" />
      {frame < Math.round(dur * 0.5) ? (
        <Caption>Auf glattem Eis gleitet der Puck weiter – gleich schnell und geradeaus.</Caption>
      ) : (
        <Caption color={COLORS.sky}>Solange keine Kraft wirkt (keine Reibung), ändert sich sein Tempo nicht.</Caption>
      )}
    </AbsoluteFill>
  );
};

// ── Szene 4: Nur eine Kraft ändert Tempo oder Richtung ─────────────────
const KraftScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cx = 960;
  const cy = GROUND_Y - 60;
  const app = (a: number, b: number) =>
    interpolate(frame, [Math.round(dur * a), Math.round(dur * b)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a1 = app(0.12, 0.22);
  const a2 = app(0.34, 0.44);
  const a3 = app(0.56, 0.66);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Ursache" title="Nur eine Kraft ändert die Bewegung" />
      <Ball x={cx} y={cy} r={52} color={COLORS.amber} />
      <Arrow x1={cx + 60} y1={cy} x2={cx + 260} y2={cy} color={COLORS.green} opacity={a1} />
      <Arrow x1={cx - 60} y1={cy} x2={cx - 260} y2={cy} color={COLORS.red} opacity={a2} />
      <Arrow x1={cx} y1={cy - 60} x2={cx} y2={cy - 240} color={COLORS.indigo} opacity={a3} />
      <div style={{ position: 'absolute', left: cx + 130, top: cy - 40, fontSize: 30, fontWeight: 700, color: COLORS.green, opacity: a1 }}>schneller</div>
      <div style={{ position: 'absolute', left: cx - 290, top: cy - 40, fontSize: 30, fontWeight: 700, color: COLORS.red, opacity: a2 }}>langsamer</div>
      <div style={{ position: 'absolute', left: cx + 20, top: cy - 250, fontSize: 30, fontWeight: 700, color: COLORS.indigo, opacity: a3 }}>andere Richtung</div>
      <Sfx sound="pop" at={Math.round(dur * 0.12)} volume={0.45} />
      <Sfx sound="pop" at={Math.round(dur * 0.34)} volume={0.45} />
      <Sfx sound="pop" at={Math.round(dur * 0.56)} volume={0.45} />
      <Caption>Schneller, langsamer oder abbiegen – für jede Änderung braucht es eine Kraft.</Caption>
    </AbsoluteFill>
  );
};

// ── Szene 5: Alltag – Bus bremst, Fahrgast ruckelt nach vorn ───────────
const BusScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const brakeStart = Math.round(dur * 0.42);
  const busX = interpolate(frame, [0, brakeStart, dur], [-200, 700, 900], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const lean = interpolate(frame, [brakeStart, brakeStart + 30, dur], [0, 46, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const busW = 520;
  const busH = 220;
  const busY = GROUND_Y - busH - 8;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Im Alltag" title="Warum ruckelt man beim Bremsen nach vorn?" />
      <Ground />
      <div style={{ position: 'absolute', left: busX, top: busY, width: busW, height: busH, borderRadius: 28, background: 'linear-gradient(180deg, #475569, #334155)', border: `3px solid ${COLORS.border}` }}>
        <div style={{ position: 'absolute', top: 26, left: 34, right: 34, height: 78, borderRadius: 12, background: '#0ea5e9', opacity: 0.35 }} />
        <div style={{ position: 'absolute', bottom: 22, left: 150 + lean, width: 52, height: 52, borderRadius: '50%', background: COLORS.amber, transform: `rotate(${lean * 0.5}deg)` }} />
        <div style={{ position: 'absolute', bottom: -26, left: 90, width: 56, height: 56, borderRadius: '50%', background: '#0f172a', border: '4px solid #64748b' }} />
        <div style={{ position: 'absolute', bottom: -26, right: 90, width: 56, height: 56, borderRadius: '50%', background: '#0f172a', border: '4px solid #64748b' }} />
      </div>
      <Sfx sound="impact" at={brakeStart} volume={0.5} />
      {frame < brakeStart + 24 ? (
        <Caption>Der Bus bremst plötzlich ab …</Caption>
      ) : (
        <Caption color={COLORS.amber}>… dein Körper „will" sich weiterbewegen und ruckt nach vorn. Das ist Trägheit.</Caption>
      )}
    </AbsoluteFill>
  );
};

// ── Szene 6: Merksatz ──────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Trägheitsprinzip" footer="1. Newton'sches Gesetz">
      Ohne wirkende Kraft ändert ein Körper seinen
      <br />
      Bewegungszustand nicht – er bleibt in Ruhe
      <br />
      oder bewegt sich gleichförmig weiter.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Szene 7: Outro ─────────────────────────────────────────────────────
const Outro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={120} />
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: COLORS.muted, opacity: s }}>Physik verstehen – Schritt für Schritt.</div>
    </AbsoluteFill>
  );
};

// ── Szenenliste (id = Audio-Datei + Timing) ────────────────────────────
const SCENES: { id: string; C: React.FC<SceneProps>; min: number }[] = [
  { id: 'intro', C: Intro, min: 90 },
  { id: 'ruhe', C: RuheScene, min: 210 },
  { id: 'bewegung', C: BewegungScene, min: 210 },
  { id: 'kraft', C: KraftScene, min: 210 },
  { id: 'bus', C: BusScene, min: 210 },
  { id: 'merksatz', C: MerksatzScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TRAEGHEIT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Traegheit: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TRAEGHEIT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/traegheit/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
