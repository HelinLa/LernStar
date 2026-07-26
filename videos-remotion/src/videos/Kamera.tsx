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
import { Axis, ConvexLens, LensImage, useFade } from '../lens';
import timings from '../narration/kamera.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CX = 1080;
const AXIS = 560;
const F = 200;

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const flash = frame % 40 < 4;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 200, marginBottom: 20, filter: flash ? 'brightness(1.8)' : 'none' }}>📷</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie funktioniert eine Kamera?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Ein ganzer Moment auf einem winzigen Sensor.
      </div>
    </AbsoluteFill>
  );
};

// ── Aufbau ─────────────────────────────────────────────────────────────
const AufbauScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Aufbau" title="Linse · Blende · Sensor" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 34, opacity: f }}>
          {[['🔵', 'Linse', 'bündelt'], ['⭕', 'Blende', 'regelt Licht'], ['🟩', 'Sensor', 'nimmt auf']].map((c, i) => (
            <div key={i} style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
              <div style={{ fontSize: 74 }}>{c[0]}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>{c[2]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Drei Teile: die Linse, die Blende und der Sensor.</Caption>
    </AbsoluteFill>
  );
};

// ── Bild auf Sensor ────────────────────────────────────────────────────
const BildScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Bild" title="Umgekehrt & verkleinert" />
      <Axis y={AXIS} />
      <ConvexLens cx={CX} cy={AXIS} f={F} />
      <LensImage cx={CX} axisY={AXIS} f={F} g={640} objH={200} progress={p} />
      {/* Sensor */}
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <rect x={CX + 278} y={430} width={16} height={260} fill="#22c55e" opacity={0.7} />
      </svg>
      <div style={{ position: 'absolute', left: CX + 240, top: 700, fontSize: 24, fontWeight: 800, color: COLORS.green }}>Sensor</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.6)}>Ein fernes Motiv wird verkleinert und umgekehrt auf den Sensor abgebildet.</Caption>
    </AbsoluteFill>
  );
};

// ── Scharfstellen ──────────────────────────────────────────────────────
const ScharfScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sharp = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Fokus" title="Abstand Linse–Sensor" />
      <Axis y={AXIS} />
      <ConvexLens cx={CX} cy={AXIS} f={F} />
      <LensImage cx={CX} axisY={AXIS} f={F} g={640} objH={200} progress={1} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <rect x={sharp ? CX + 278 : CX + 200} y={430} width={16} height={260} fill={sharp ? '#22c55e' : '#64748b'} opacity={0.7} />
      </svg>
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 30, fontWeight: 800, color: sharp ? COLORS.green : COLORS.red }}>
        {sharp ? '✅ Sensor im Bildpunkt → scharf' : '❌ falscher Abstand → unscharf'}
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.5)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Stimmt der Abstand, treffen sich die Strahlen genau auf dem Sensor.</Caption>
    </AbsoluteFill>
  );
};

// ── Blende ─────────────────────────────────────────────────────────────
const BlendeScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const big = frame < dur * 0.5;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Helligkeit" title="Die Blende regelt das Licht" />
      <div style={{ display: 'flex', gap: 90, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 200, height: 200, borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: big ? 150 : 50, height: big ? 150 : 50, borderRadius: '50%', background: COLORS.amber }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 12, color: COLORS.amber }}>{big ? 'groß → viel Licht 🌙' : 'klein → wenig Licht ☀️'}</div>
        </div>
        <div style={{ fontSize: 100 }}>👁️</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.muted, maxWidth: 400 }}>genau wie die Pupille im Auge</div>
      </div>
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Großes Loch bei Dunkelheit, kleines Loch bei grellem Licht.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kamera" footer="Abstand stellt scharf, Blende regelt Licht">
      Die Linse bildet einen fernen
      <br />
      Gegenstand umgekehrt & verkleinert
      <br />
      auf dem Sensor ab.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Immer dasselbe Prinzip" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="📱" title="Handykamera" delay={10} />
        <TCard icon="🎥" title="Filmkamera" delay={30} />
        <TCard icon="👁️" title="Auge" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Dein Auge ist im Grunde eine besonders raffinierte Kamera.</Caption>
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
  { id: 'aufbau', C: AufbauScene, min: 240 },
  { id: 'bild', C: BildScene, min: 260 },
  { id: 'scharf', C: ScharfScene, min: 240 },
  { id: 'blende', C: BlendeScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KAMERA_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kamera: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KAMERA_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kamera/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
