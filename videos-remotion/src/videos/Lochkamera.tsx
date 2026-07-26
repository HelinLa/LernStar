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
import { useFade } from '../lens';
import timings from '../narration/lochkamera.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const HOLE_X = 1000;
const HOLE_Y = 540;
const SCREEN_X = 1440;

// Lochkamera: Gegenstand links (Pfeil hoch), Loch, Strahlen kreuzen sich, umgekehrtes Bild rechts.
const PinholeSetup: React.FC<{ objX: number; objH: number; progress: number; camLen?: number }> = ({ objX, objH, progress, camLen = SCREEN_X - HOLE_X }) => {
  const screenX = HOLE_X + camLen;
  const objTop = HOLE_Y - objH;
  const objBot = HOLE_Y + 20;
  // Strahl von Spitze (oben) durch Loch → unten auf Schirm
  const topRayEndY = HOLE_Y + (HOLE_Y - objTop) * (camLen / (HOLE_X - objX));
  const botRayEndY = HOLE_Y - (objBot - HOLE_Y) * (camLen / (HOLE_X - objX));
  const p = Math.min(1, progress);
  const ex1 = HOLE_X + (screenX - HOLE_X) * p, ey1 = HOLE_Y + (topRayEndY - HOLE_Y) * p;
  const ex2 = HOLE_X + (screenX - HOLE_X) * p, ey2 = HOLE_Y + (botRayEndY - HOLE_Y) * p;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Gegenstand (Pfeil hoch, gelb) */}
      <line x1={objX} y1={HOLE_Y + 20} x2={objX} y2={objTop} stroke={COLORS.green} strokeWidth={7} />
      <polygon points={`${objX - 16},${objTop + 22} ${objX + 16},${objTop + 22} ${objX},${objTop}`} fill={COLORS.green} />
      {/* Kamera-Wand mit Loch */}
      <line x1={HOLE_X} y1={200} x2={HOLE_X} y2={HOLE_Y - 12} stroke="#78350f" strokeWidth={12} />
      <line x1={HOLE_X} y1={HOLE_Y + 12} x2={HOLE_X} y2={880} stroke="#78350f" strokeWidth={12} />
      {/* Strahlen: Spitze→durch Loch→unten, Fuß→durch Loch→oben */}
      <line x1={objX} y1={objTop} x2={ex1} y2={ey1} stroke={COLORS.amber} strokeWidth={3} opacity={0.9} />
      <line x1={objX} y1={objBot} x2={ex2} y2={ey2} stroke={COLORS.sky} strokeWidth={3} opacity={0.9} />
      {/* Schirm */}
      <rect x={screenX} y={220} width={16} height={640} fill="#94a3b8" />
      {/* umgekehrtes Bild */}
      {p > 0.95 ? (
        <>
          <line x1={screenX} y1={HOLE_Y} x2={screenX} y2={topRayEndY} stroke={COLORS.red} strokeWidth={7} />
          <polygon points={`${screenX - 14},${topRayEndY - 20} ${screenX + 14},${topRayEndY - 20} ${screenX},${topRayEndY}`} fill={COLORS.red} />
        </>
      ) : null}
    </svg>
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
      <div style={{ fontSize: 180, marginBottom: 20 }}>📦🕳️</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie macht ein Loch ein Bild?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Ohne eine einzige Linse – nur mit einem winzigen Loch.
      </div>
    </AbsoluteFill>
  );
};

// ── Aufbau ─────────────────────────────────────────────────────────────
const AufbauScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [20, dur - 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Aufbau" title="Dunkle Schachtel mit Loch" />
      <PinholeSetup objX={420} objH={200} progress={p} />
      <div style={{ position: 'absolute', left: 1470, top: 560, fontSize: 26, fontWeight: 800, color: COLORS.red }}>Bild steht auf dem Kopf</div>
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.6)}>Hinten erscheint ein Bild – und zwar umgekehrt.</Caption>
    </AbsoluteFill>
  );
};

// ── Warum umgekehrt ────────────────────────────────────────────────────
const WarumScene: React.FC<SceneProps> = () => {
  const lab = useFade(40);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum?" title="Die Strahlen kreuzen sich" />
      <PinholeSetup objX={420} objH={200} progress={1} />
      <div style={{ position: 'absolute', left: HOLE_X - 60, top: 300, fontSize: 40 }}>✝️</div>
      <div style={{ position: 'absolute', left: 560, top: 300, fontSize: 24, fontWeight: 800, color: COLORS.amber, opacity: lab }}>oben → unten</div>
      <div style={{ position: 'absolute', left: 560, top: 720, fontSize: 24, fontWeight: 800, color: COLORS.sky, opacity: lab }}>unten → oben</div>
      <Sfx sound="pling" at={10} volume={0.4} />
      <Caption delay={50}>Licht läuft geradlinig und kreuzt sich im Loch – deshalb steht das Bild auf dem Kopf.</Caption>
    </AbsoluteFill>
  );
};

// ── Größe: längere Kamera ──────────────────────────────────────────────
const GroesseScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const camLen = interpolate(frame, [20, dur - 30], [280, 620], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Bildgröße" title="Länger → größer" />
      <PinholeSetup objX={420} objH={200} progress={1} camLen={camLen} />
      <div style={{ position: 'absolute', left: 300, top: 250, fontSize: 30, fontWeight: 800, color: COLORS.sky }}>B / G = b / g</div>
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Je länger die Kamera, desto größer das Bild – B durch G gleich b durch g.</Caption>
    </AbsoluteFill>
  );
};

// ── Loch: scharf vs. hell ──────────────────────────────────────────────
const LochScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Lochgröße" title="Scharf ODER hell" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>· </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.green }}>kleines Loch</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>scharf, aber dunkel</div>
          </div>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>⚫</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.amber }}>großes Loch</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>hell, aber unscharf</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Man braucht einen Mittelweg zwischen Schärfe und Helligkeit.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Lochkamera" footer="kleines Loch: scharf, aber dunkel">
      Ein umgekehrtes Bild entsteht,
      <br />
      weil Licht geradlinig läuft und die
      <br />
      Strahlen sich im Loch kreuzen.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Uralt und überall" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 80 }}>🎨</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>Camera Obscura (Künstler)</div>
        </div>
        <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 80 }}>🌳☀️</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>Sonnenbilder unterm Baum</div>
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Die Lücken im Blätterdach wirken wie viele kleine Lochkameras.</Caption>
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
  { id: 'aufbau', C: AufbauScene, min: 260 },
  { id: 'warum', C: WarumScene, min: 260 },
  { id: 'groesse', C: GroesseScene, min: 240 },
  { id: 'loch', C: LochScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LOCHKAMERA_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Lochkamera: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LOCHKAMERA_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/lochkamera/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
