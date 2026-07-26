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
import { useFade } from '../optik';
import timings from '../narration/reflexion.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Spiegel + Normale + einfallender/reflektierter Strahl bei Winkel a (Grad zur Normalen)
const MirrorDiagram: React.FC<{ a: number; progressIn?: number; progressOut?: number; showAngles?: boolean }> = ({ a, progressIn = 1, progressOut = 1, showAngles = true }) => {
  const hitX = 960, hitY = 640; // Auftreffpunkt auf Spiegel
  const L = 460;
  const rad = (a * Math.PI) / 180;
  // Normale zeigt nach oben. Einfallender Strahl kommt von oben-links, reflektierter geht oben-rechts.
  const inX = hitX - Math.sin(rad) * L, inY = hitY - Math.cos(rad) * L;
  const outX = hitX + Math.sin(rad) * L, outY = hitY - Math.cos(rad) * L;
  const ix = hitX + (inX - hitX) * progressIn, iy = hitY + (inY - hitY) * progressIn;
  const ox = hitX + (outX - hitX) * progressOut, oy = hitY + (outY - hitY) * progressOut;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Spiegel */}
      <rect x={hitX - 420} y={hitY} width={840} height={22} fill="url(#mir)" />
      <defs><linearGradient id="mir" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2e8f0" /><stop offset="1" stopColor="#64748b" /></linearGradient></defs>
      {/* Schraffur unter dem Spiegel */}
      {Array.from({ length: 17 }).map((_, i) => <line key={i} x1={hitX - 400 + i * 50} y1={hitY + 22} x2={hitX - 430 + i * 50} y2={hitY + 52} stroke={COLORS.muted} strokeWidth={2} />)}
      {/* Normale (senkrecht) */}
      <line x1={hitX} y1={hitY} x2={hitX} y2={hitY - 480} stroke={COLORS.muted} strokeWidth={3} strokeDasharray="10 8" />
      <text x={hitX + 10} y={hitY - 450} fontSize={26} fill={COLORS.muted} fontWeight="bold">Normale</text>
      {/* einfallender Strahl */}
      <line x1={inX} y1={inY} x2={ix} y2={iy} stroke={COLORS.amber} strokeWidth={6} strokeLinecap="round" />
      {/* reflektierter Strahl */}
      {progressOut > 0 ? <line x1={hitX} y1={hitY} x2={ox} y2={oy} stroke={COLORS.green} strokeWidth={6} strokeLinecap="round" /> : null}
      {/* Winkelbögen */}
      {showAngles ? (
        <>
          <path d={`M ${hitX} ${hitY - 120} A 120 120 0 0 0 ${hitX - Math.sin(rad) * 120} ${hitY - Math.cos(rad) * 120}`} fill="none" stroke={COLORS.amber} strokeWidth={3} />
          <path d={`M ${hitX + Math.sin(rad) * 120} ${hitY - Math.cos(rad) * 120} A 120 120 0 0 0 ${hitX} ${hitY - 120}`} fill="none" stroke={COLORS.green} strokeWidth={3} />
          <text x={hitX - Math.sin(rad / 2) * 160 - 20} y={hitY - Math.cos(rad / 2) * 160} fontSize={30} fill={COLORS.amber} fontWeight="bold">{Math.round(a)}°</text>
          <text x={hitX + Math.sin(rad / 2) * 160} y={hitY - Math.cos(rad / 2) * 160} fontSize={30} fill={COLORS.green} fontWeight="bold">{Math.round(a)}°</text>
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
      <div style={{ fontSize: 190, marginBottom: 20 }}>🪞</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Reflexion am ebenen Spiegel
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Was macht das Licht – und warum ist dein Spiegelbild seitenverkehrt?
      </div>
    </AbsoluteFill>
  );
};

// ── Gesetz ─────────────────────────────────────────────────────────────
const GesetzScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pin = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pout = interpolate(frame, [42, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Gesetz" title="Einfallswinkel = Reflexionswinkel" />
      <MirrorDiagram a={40} progressIn={pin} progressOut={pout} />
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Sfx sound="pling" at={44} volume={0.4} />
      <Caption delay={78}>Beide Winkel misst man zur Normalen – der Senkrechten auf dem Spiegel.</Caption>
    </AbsoluteFill>
  );
};

// ── Messen: verschiedene Winkel ────────────────────────────────────────
const MessenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = 30 + Math.abs(Math.sin(frame / 40)) * 35;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Immer gleich" title="Rein wie raus" />
      <MirrorDiagram a={a} />
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 32, fontWeight: 800, color: COLORS.sky }}>{Math.round(a)}° rein → {Math.round(a)}° raus</div>
      <Sfx sound="pop" at={10} volume={0.3} />
      <Caption>Egal wie steil oder flach: der Strahl geht im gleichen Winkel wieder weg.</Caption>
    </AbsoluteFill>
  );
};

// ── Virtuelles Bild ────────────────────────────────────────────────────
const BildScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Spiegelbild" title="Virtuell & gleich weit dahinter" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <rect x={940} y={280} width={20} height={520} fill="url(#mir2)" />
        <defs><linearGradient id="mir2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e2e8f0" /><stop offset="1" stopColor="#64748b" /></linearGradient></defs>
        <line x1={700} y1={540} x2={1200} y2={540} stroke={COLORS.border} strokeWidth={2} strokeDasharray="8 8" opacity={f} />
      </svg>
      <div style={{ position: 'absolute', left: 640, top: 460, fontSize: 130 }}>🧍</div>
      <div style={{ position: 'absolute', left: 1130, top: 460, fontSize: 130, transform: 'scaleX(-1)', opacity: 0.6 }}>🧍</div>
      <div style={{ position: 'absolute', left: 600, top: 640, fontSize: 26, fontWeight: 800, color: COLORS.amber, opacity: f }}>du (real)</div>
      <div style={{ position: 'absolute', left: 1120, top: 640, fontSize: 26, fontWeight: 800, color: COLORS.muted, opacity: f }}>Bild (virtuell)</div>
      <div style={{ position: 'absolute', left: 760, top: 800, fontSize: 26, fontWeight: 700, color: COLORS.sky, opacity: f }}>gleicher Abstand ↔ gleiche Größe · aufrecht</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Das Bild liegt so weit hinter dem Spiegel, wie du davor stehst.</Caption>
    </AbsoluteFill>
  );
};

// ── Seitenverkehrt ─────────────────────────────────────────────────────
const SeitenverkehrtScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Aha!" title="Seitenverkehrt" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', opacity: f }}>
        <div style={{ fontSize: 140 }}>🙋‍♂️</div>
        <div style={{ width: 12, height: 220, background: 'linear-gradient(90deg,#e2e8f0,#64748b)', borderRadius: 6 }} />
        <div style={{ fontSize: 140, transform: 'scaleX(-1)' }}>🙋‍♂️</div>
      </div>
      <div style={{ marginTop: 24, fontSize: 60, fontWeight: 900, color: COLORS.amber, opacity: f }}>🚑 <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>NOTARZT</span></div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Rechte Hand hoch – das Bild hebt scheinbar die linke. Darum steht „Notarzt" gespiegelt.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Reflexion" footer="ebener Spiegel: aufrecht, seitenverkehrt, virtuell">
      Einfallswinkel = Reflexionswinkel
      <br />
      (zur Normalen). Das Spiegelbild liegt
      <br />
      gleich weit hinter dem Spiegel.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Spiegel im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🪞" title="Badspiegel" delay={10} />
        <TCard icon="🚗" title="Rückspiegel" delay={30} />
        <TCard icon="🔭" title="Periskop (U-Boot)" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall wird Licht nach demselben Gesetz zurückgeworfen.</Caption>
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
  { id: 'gesetz', C: GesetzScene, min: 260 },
  { id: 'messen', C: MessenScene, min: 240 },
  { id: 'bild', C: BildScene, min: 240 },
  { id: 'seitenverkehrt', C: SeitenverkehrtScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const REFLEXION_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Reflexion: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={REFLEXION_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/reflexion/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
