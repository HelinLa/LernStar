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
import timings from '../narration/auge.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const EYE_X = 1200;
const EYE_Y = 540;
const EYE_R = 220;

// Augen-Querschnitt mit Linse, Pupille, Netzhaut + einfallende Strahlen und umgekehrtes Bild.
const EyeDiagram: React.FC<{ pupil?: number; showImage?: boolean; showRays?: boolean; objY?: number; blurry?: boolean }> = ({
  pupil = 60,
  showImage = true,
  showRays = true,
  objY = 380,
  blurry = false,
}) => {
  const lensX = EYE_X - EYE_R + 40;
  const retinaX = EYE_X + EYE_R - 20;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Augapfel */}
      <circle cx={EYE_X} cy={EYE_Y} r={EYE_R} fill="rgba(148,163,184,0.12)" stroke={COLORS.muted} strokeWidth={4} />
      {/* Netzhaut (hintere Innenwand) */}
      <path d={`M ${retinaX},${EYE_Y - 150} A 170 170 0 0 1 ${retinaX},${EYE_Y + 150}`} fill="none" stroke={COLORS.green} strokeWidth={8} opacity={0.7} />
      {/* Linse */}
      <ellipse cx={lensX} cy={EYE_Y} rx={26} ry={110 - (pupil < 40 ? 10 : 0)} fill="rgba(56,189,248,0.3)" stroke={COLORS.sky} strokeWidth={4} />
      {/* Pupille (Blende) */}
      <rect x={lensX - 60} y={EYE_Y - pupil / 2} width={8} height={pupil} fill={COLORS.ink} />
      {/* einfallende Strahlen von Objektspitze (oben) und Fuß */}
      {showRays ? (
        <>
          <line x1={300} y1={objY} x2={lensX} y2={EYE_Y - 30} stroke={COLORS.amber} strokeWidth={3} />
          <line x1={300} y1={objY + 200} x2={lensX} y2={EYE_Y + 30} stroke={COLORS.sky} strokeWidth={3} />
          {/* nach Linse gebündelt auf Netzhaut (gekreuzt → umgekehrt) */}
          <line x1={lensX} y1={EYE_Y - 30} x2={retinaX} y2={EYE_Y + (blurry ? 20 : 70)} stroke={COLORS.amber} strokeWidth={3} opacity={blurry ? 0.5 : 1} />
          <line x1={lensX} y1={EYE_Y + 30} x2={retinaX} y2={EYE_Y - (blurry ? 20 : 70)} stroke={COLORS.sky} strokeWidth={3} opacity={blurry ? 0.5 : 1} />
        </>
      ) : null}
      {/* Objekt (Pfeil hoch) */}
      <line x1={300} y1={objY} x2={300} y2={objY + 200} stroke={COLORS.green} strokeWidth={6} />
      <polygon points={`${300 - 14},${objY + 20} ${300 + 14},${objY + 20} ${300},${objY}`} fill={COLORS.green} />
      {/* umgekehrtes Bild auf Netzhaut */}
      {showImage && !blurry ? (
        <>
          <line x1={retinaX} y1={EYE_Y - 70} x2={retinaX} y2={EYE_Y + 70} stroke={COLORS.red} strokeWidth={6} />
          <polygon points={`${retinaX - 12},${EYE_Y + 50} ${retinaX + 12},${EYE_Y + 50} ${retinaX},${EYE_Y + 70}`} fill={COLORS.red} />
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
      <div style={{ display: 'flex', gap: 60, marginBottom: 30, fontSize: 130 }}>
        <div>👁️</div><div style={{ fontSize: 70 }}>=</div><div>📷</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie funktioniert das Auge?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Dein Auge arbeitet fast genau wie eine Kamera.
      </div>
    </AbsoluteFill>
  );
};

// ── Linse ──────────────────────────────────────────────────────────────
const LinseScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Vorne" title="Die Linse bündelt" />
    <EyeDiagram showImage={false} />
    <div style={{ position: 'absolute', left: 880, top: 360, fontSize: 26, fontWeight: 800, color: COLORS.sky }}>Linse</div>
    <Sfx sound="whoosh" at={12} volume={0.3} />
    <Caption>Die Augenlinse bündelt das Licht – wie die Linse einer Kamera.</Caption>
  </AbsoluteFill>
);

// ── Pupille ────────────────────────────────────────────────────────────
const PupilleScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const dark = frame < dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Blende" title="Die Pupille regelt das Licht" />
      <EyeDiagram pupil={dark ? 110 : 40} showImage={false} />
      <div style={{ position: 'absolute', left: 760, top: 250, fontSize: 30, fontWeight: 800, color: dark ? COLORS.amber : COLORS.sky }}>
        {dark ? '🌙 dunkel → Pupille groß' : '☀️ hell → Pupille klein'}
      </div>
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Die Pupille wirkt wie die Blende – groß bei Dunkelheit, klein bei Helligkeit.</Caption>
    </AbsoluteFill>
  );
};

// ── Netzhaut ───────────────────────────────────────────────────────────
const NetzhautScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Sensor" title="Umgekehrtes Bild auf der Netzhaut" />
      <EyeDiagram showImage={p > 0.8} />
      <div style={{ position: 'absolute', left: 1380, top: 380, fontSize: 26, fontWeight: 800, color: COLORS.green }}>Netzhaut</div>
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.muted }}>das Gehirn dreht das Bild um 🧠</div>
      <Sfx sound="pling" at={Math.round(dur * 0.7)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.6)}>Auf der Netzhaut entsteht ein umgekehrtes Bild – das Gehirn dreht es zurück.</Caption>
    </AbsoluteFill>
  );
};

// ── Akkommodation ──────────────────────────────────────────────────────
const AkkommodationScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const thick = frame % 80 < 40;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Scharfstellen" title="Die Linse verformt sich" />
      <EyeDiagram pupil={60} showImage />
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>
        Muskeln machen die Linse {thick ? 'dicker (Nähe)' : 'dünner (Ferne)'}
      </div>
      <Sfx sound="pop" at={20} volume={0.3} />
      <Caption delay={20}>Statt zu verschieben, verformt das Auge seine Linse – das nennt man Akkommodation.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Das Auge" footer="scharf durch Verformen der Linse">
      Linse bündelt, Pupille ist die Blende,
      <br />
      auf der Netzhaut entsteht ein
      <br />
      umgekehrtes Bild.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Optik hilft dem Auge" />
      <div style={{ fontSize: 180, opacity: f }}>👁️👓</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Weil Auge und Kamera gleich arbeiten, lassen sich Sehfehler mit Linsen korrigieren.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Zum Beispiel mit einer Brille – dazu gleich mehr.</Caption>
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
  { id: 'linse', C: LinseScene, min: 220 },
  { id: 'pupille', C: PupilleScene, min: 240 },
  { id: 'netzhaut', C: NetzhautScene, min: 260 },
  { id: 'akkommodation', C: AkkommodationScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const AUGE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Auge: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={AUGE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/auge/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
