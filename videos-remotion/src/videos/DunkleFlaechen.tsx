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
import { Sun, Thermometer, useFade } from '../thermal';
import timings from '../narration/dunkle-flaechen.timings.json';

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
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 60, marginBottom: 40, fontSize: 120, alignItems: 'center' }}>
        <div>☀️</div><div>👕</div><div style={{ filter: 'brightness(0.3)' }}>👕</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 76, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum werden dunkle Flächen heißer?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum das schwarze T-Shirt im Sommer zur Falle wird.
      </div>
    </AbsoluteFill>
  );
};

// Fläche + einfallende + reflektierte Strahlen
const Flaeche: React.FC<{ x: number; dark: boolean; p: number; label: string }> = ({ x, dark, p, label }) => (
  <>
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* einfallende Strahlen von oben */}
      {[-40, 0, 40].map((o, i) => (
        <line key={i} x1={x + o - 120} y1={200} x2={x + o} y2={640 - Math.max(0, 640 - (200 + p * 440))} stroke="#fbbf24" strokeWidth={4} opacity={0.8} />
      ))}
      {/* reflektierte Strahlen nur bei hell */}
      {!dark
        ? [-40, 0, 40].map((o, i) => (
            <line key={i} x1={x + o} y1={640} x2={x + o + 120} y2={640 - p * 420} stroke="#fbbf24" strokeWidth={4} opacity={0.7} strokeDasharray="8 6" />
          ))
        : null}
    </svg>
    <div style={{ position: 'absolute', left: x - 110, top: 640, width: 220, height: 60, borderRadius: 8, background: dark ? '#0b1120' : '#e2e8f0', border: `3px solid ${COLORS.border}` }} />
    <div style={{ position: 'absolute', left: x - 110, top: 720, width: 220, textAlign: 'center', fontSize: 26, fontWeight: 800, color: dark ? COLORS.red : COLORS.sky }}>{label}</div>
  </>
);

// ── Dunkel absorbiert ──────────────────────────────────────────────────
const DunkelScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const temp = interpolate(frame, [20, dur - 20], [20, 70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Dunkel" title="Schluckt das Licht" />
      <Sun x={330} y={220} r={70} />
      <Flaeche x={860} dark p={p} label="schwarz" />
      <Thermometer x={1360} y={300} h={380} temp={temp} min={0} max={90} />
      <div style={{ position: 'absolute', left: 700, top: 500, fontSize: 28, fontWeight: 800, color: COLORS.red }}>absorbiert → wird heiß 🔥</div>
      <Sfx sound="whoosh" at={12} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Schwarz schluckt fast das ganze Licht und wandelt es in Wärme um.</Caption>
    </AbsoluteFill>
  );
};

// ── Hell reflektiert ───────────────────────────────────────────────────
const HellScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const temp = interpolate(frame, [20, dur - 20], [20, 34], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Hell" title="Wirft das Licht zurück" />
      <Sun x={330} y={220} r={70} />
      <Flaeche x={860} dark={false} p={p} label="weiß / blank" />
      <Thermometer x={1360} y={300} h={380} temp={temp} min={0} max={90} />
      <div style={{ position: 'absolute', left: 700, top: 470, fontSize: 28, fontWeight: 800, color: COLORS.sky }}>reflektiert → bleibt kühl ❄️</div>
      <Sfx sound="whoosh" at={12} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Hell wirft viel Licht zurück – weniger wird geschluckt, es bleibt kühler.</Caption>
    </AbsoluteFill>
  );
};

// ── Vergleich zwei Bleche ──────────────────────────────────────────────
const VergleichScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tDark = interpolate(frame, [20, dur - 20], [22, 68], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tLight = interpolate(frame, [20, dur - 20], [22, 33], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Direkter Vergleich" title="Schwarz vs. Weiß in der Sonne" />
      <Sun x={960} y={200} r={70} />
      <Thermometer x={620} y={340} h={340} temp={tDark} min={0} max={90} label="schwarz" />
      <div style={{ position: 'absolute', left: 540, top: 300, width: 160, height: 40, borderRadius: 6, background: '#0b1120', border: `2px solid ${COLORS.border}` }} />
      <Thermometer x={1300} y={340} h={340} temp={tLight} min={0} max={90} label="weiß" />
      <div style={{ position: 'absolute', left: 1220, top: 300, width: 160, height: 40, borderRadius: 6, background: '#e2e8f0', border: `2px solid ${COLORS.border}` }} />
      <Sfx sound="pling" at={Math.round(dur * 0.6)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5)}>Gleiche Sonne, gleiche Zeit – das schwarze Blech wird viel wärmer.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Dunkel & Hell" footer="Farbe entscheidet über die Wärme">
      Dunkle Flächen absorbieren viel
      <br />
      und werden warm. Helle & blanke
      <br />
      reflektieren viel und bleiben kühl.
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
    <SceneTitle kicker="Übertragen" title="Farbe clever nutzen" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🏠" title="weiße Häuser im Süden" delay={10} />
        <TCard icon="👕" title="helle Sommerkleidung" delay={30} />
        <TCard icon="🔆" title="schwarzer Sonnenkollektor" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Schwarz, wenn du Wärme einfangen willst – weiß, wenn du kühl bleiben willst.</Caption>
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
  { id: 'dunkel', C: DunkelScene, min: 240 },
  { id: 'hell', C: HellScene, min: 240 },
  { id: 'vergleich', C: VergleichScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const DUNKLE_FLAECHEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const DunkleFlaechen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={DUNKLE_FLAECHEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/dunkle-flaechen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
