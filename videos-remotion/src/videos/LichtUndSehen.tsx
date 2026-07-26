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
import { LightSource, Ray, RayFan, Eye, useFade } from '../optik';
import timings from '../narration/licht-und-sehen.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const items = ['☀️', '👁️', '🌙'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 110, marginBottom: 40 }}>
        {items.map((e, i) => (
          <div key={i} style={{ fontSize: 130, transform: `translateY(${Math.sin(frame / 22 + i) * 16}px)` }}>
            {e}
          </div>
        ))}
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Licht und Sehen
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum sehen wir im Dunkeln nichts – und warum leuchtet der Mond?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: dunkles Zimmer → Licht an → Apfel sichtbar ─────────────
const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const on = frame > dur * 0.42; // Licht an?
  const lamp: [number, number] = [560, 250];
  const apple: [number, number] = [820, 640];
  const eye: [number, number] = [1440, 600];
  const lit = interpolate(frame - dur * 0.42, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title={on ? 'Licht an – wir sehen den Apfel' : 'Dunkles Zimmer – nichts zu sehen'} />
      {/* Raumboden */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, height: 6, background: COLORS.ground }} />
      {/* Lampe */}
      <LightSource x={lamp[0]} y={lamp[1]} emoji="💡" glow={lit} label={on ? 'Lichtquelle' : ''} />
      {/* Strahlen zum Apfel + vom Apfel zum Auge (nur bei Licht an) */}
      {on ? (
        <>
          <RayFan from={lamp} targets={[[apple[0] - 40, apple[1] - 30], [apple[0] + 40, apple[1] - 30]]} progress={lit} color={COLORS.amber} />
          <Ray x1={apple[0]} y1={apple[1] - 40} x2={eye[0] - 60} y2={eye[1]} progress={lit} color={COLORS.sky} arrow width={5} />
        </>
      ) : null}
      {/* Apfel */}
      <div style={{ position: 'absolute', left: apple[0] - 60, top: apple[1] - 60, fontSize: 120, filter: on ? 'none' : 'grayscale(1) brightness(0.28)', transition: 'none' }}>🍎</div>
      {/* Auge */}
      <Eye x={eye[0]} y={eye[1]} size={120} seeing={on} label={on ? 'sieht' : 'sieht nichts'} />
      <Sfx sound="pling" at={Math.round(dur * 0.42) + 3} volume={0.5} />
      <Caption delay={Math.round(dur * 0.42) + 6}>Ohne Licht sehen wir nichts. Erst das Licht macht den Apfel sichtbar.</Caption>
    </AbsoluteFill>
  );
};

// ── Quellen: Selbstleuchter vs. beleuchtete Körper ─────────────────────
const IconCard: React.FC<{ icon: string; label: string; delay: number; color: string }> = ({ icon, label, delay, color }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 240, padding: '20px 12px', borderRadius: 20, background: COLORS.panel, border: `2px solid ${color}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 30}px)` }}>
      <div style={{ fontSize: 78 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4 }}>{label}</div>
    </div>
  );
};

const QuellenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Zwei Arten" title="Selbstleuchter und beleuchtete Körper" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.amber, marginBottom: 10 }}>senden selbst Licht aus</div>
          <div style={{ display: 'flex', gap: 30 }}>
            <IconCard icon="☀️" label="Sonne" delay={8} color={COLORS.amber} />
            <IconCard icon="💡" label="Lampe" delay={22} color={COLORS.amber} />
            <IconCard icon="🕯️" label="Kerze" delay={36} color={COLORS.amber} />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.sky, marginBottom: 10 }}>werfen Licht nur zurück</div>
          <div style={{ display: 'flex', gap: 30 }}>
            <IconCard icon="📖" label="Buch" delay={54} color={COLORS.sky} />
            <IconCard icon="🍎" label="Apfel" delay={68} color={COLORS.sky} />
            <IconCard icon="🌙" label="Mond" delay={82} color={COLORS.sky} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={8} volume={0.34} />
    <Sfx sound="pop" at={54} volume={0.34} />
    <Caption delay={98}>Lichtquellen leuchten selbst – beleuchtete Körper werfen Licht nur zurück.</Caption>
  </AbsoluteFill>
);

// ── Weg des Lichts: Quelle → Gegenstand → Auge (geradlinig) ────────────
const WegScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const lamp: [number, number] = [280, 340];
  const apple: [number, number] = [960, 560];
  const eye: [number, number] = [1620, 560];
  const p1 = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p2 = interpolate(frame, [44, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const speed = useFade(Math.round(dur * 0.6));
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Weg des Lichts" title="Quelle → Gegenstand → Auge" />
      <LightSource x={lamp[0]} y={lamp[1]} emoji="💡" label="Lichtquelle" />
      <Ray x1={lamp[0] + 30} y1={lamp[1] + 20} x2={apple[0] - 55} y2={apple[1] - 20} progress={p1} color={COLORS.amber} arrow width={6} />
      <div style={{ position: 'absolute', left: apple[0] - 60, top: apple[1] - 60, fontSize: 120 }}>🍎</div>
      <Ray x1={apple[0] + 30} y1={apple[1] - 20} x2={eye[0] - 70} y2={eye[1]} progress={p2} color={COLORS.sky} arrow width={6} />
      <Eye x={eye[0]} y={eye[1]} size={130} label="Auge" />
      <div style={{ position: 'absolute', left: 520, top: 640, fontSize: 30, fontWeight: 700, color: COLORS.amber, opacity: p1 }}>geradlinig ✏️</div>
      <div style={{ position: 'absolute', left: 700, top: 320, fontSize: 34, fontWeight: 800, color: COLORS.green, opacity: speed }}>
        300 000 km/s
      </div>
      <Sfx sound="whoosh" at={12} volume={0.35} />
      <Sfx sound="pling" at={46} volume={0.42} />
      <Caption>Licht läuft geradlinig – erst wenn es ins Auge gelangt, sehen wir.</Caption>
    </AbsoluteFill>
  );
};

// ── Mond: kein Selbstleuchter, reflektiert Sonnenlicht ─────────────────
const MondScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sun: [number, number] = [260, 300];
  const moon: [number, number] = [960, 560];
  const eye: [number, number] = [1620, 560];
  const p1 = interpolate(frame, [12, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p2 = interpolate(frame, [48, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const off = frame > dur * 0.72;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="Warum der Mond „leuchtet“" />
      <LightSource x={sun[0]} y={sun[1]} emoji="☀️" glow={off ? 0.1 : 1} label={off ? 'Sonne aus' : 'Sonne'} />
      {!off ? (
        <>
          <Ray x1={sun[0] + 30} y1={sun[1] + 20} x2={moon[0] - 55} y2={moon[1] - 20} progress={p1} color={COLORS.amber} arrow width={6} />
          <Ray x1={moon[0] + 30} y1={moon[1] - 20} x2={eye[0] - 70} y2={eye[1]} progress={p2} color={COLORS.sky} arrow width={6} />
        </>
      ) : null}
      <div style={{ position: 'absolute', left: moon[0] - 60, top: moon[1] - 60, fontSize: 120, filter: off ? 'brightness(0.3) grayscale(1)' : 'none' }}>🌙</div>
      <Eye x={eye[0]} y={eye[1]} size={130} seeing={!off} label={off ? 'sieht nichts' : 'sieht den Mond'} />
      <Sfx sound="pling" at={50} volume={0.42} />
      {off ? <Sfx sound="impact" at={Math.round(dur * 0.72) + 2} volume={0.4} /> : null}
      <Caption color={off ? COLORS.red : COLORS.ink}>
        {off ? 'Ohne Sonne bliebe der Mond dunkel – er leuchtet nicht selbst.' : 'Sonnenlicht trifft den Mond und wird zu uns zurückgeworfen.'}
      </Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Sehen" footer="Lichtquelle → Gegenstand → Auge">
      Wir sehen einen Gegenstand nur,
      <br />
      wenn Licht von ihm
      <br />
      in unser Auge gelangt.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number; color: string }> = ({ icon, title, delay, color }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 250, padding: '26px 16px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${color}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 72 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{title}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Selbstleuchter oder beleuchtet?" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.amber, marginBottom: 8 }}>Selbstleuchter</div>
          <div style={{ display: 'flex', gap: 26 }}>
            <TCard icon="☀️" title="Sonne" delay={8} color={COLORS.amber} />
            <TCard icon="🔥" title="Feuer" delay={20} color={COLORS.amber} />
            <TCard icon="📱" title="Bildschirm" delay={32} color={COLORS.amber} />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.sky, marginBottom: 8 }}>beleuchtete Körper</div>
          <div style={{ display: 'flex', gap: 26 }}>
            <TCard icon="🌙" title="Mond" delay={48} color={COLORS.sky} />
            <TCard icon="🟩" title="Tafel" delay={60} color={COLORS.sky} />
            <TCard icon="👕" title="Kleidung" delay={72} color={COLORS.sky} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={8} volume={0.32} />
    <Sfx sound="pop" at={48} volume={0.32} />
    <Caption delay={88}>Beleuchtete Körper sehen wir nur, weil sie Licht zurückwerfen.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'quellen', C: QuellenScene, min: 260 },
  { id: 'weg', C: WegScene, min: 260 },
  { id: 'mond', C: MondScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 220 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LICHT_UND_SEHEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const LichtUndSehen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LICHT_UND_SEHEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/licht-und-sehen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
