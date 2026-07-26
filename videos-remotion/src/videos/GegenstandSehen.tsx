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
import { LightSource, Ray, Eye, useFade } from '../optik';
import timings from '../narration/gegenstand-sehen.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Rollen-Etikett über einem Element ("SENDER" usw.)
const RoleTag: React.FC<{ x: number; y: number; text: string; color: string; delay: number }> = ({ x, y, text, color, delay }) => {
  const f = useFade(delay);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 140,
        top: y,
        width: 280,
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 800,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color,
        opacity: f,
        transform: `translateY(${(1 - f) * -14}px)`,
      }}
    >
      {text}
    </div>
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
      <div style={{ fontSize: 190, transform: `scale(${interpolate(t, [0, 1], [0.7, 1])})` }}>👁️</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie können wir<br />etwas sehen?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1250, textAlign: 'center', opacity: sub }}>
        Reicht es, einfach die Augen aufzumachen?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: Augen auf im Dunkeln → trotzdem nichts ─────────────────
const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const eyeIn = useFade(14);
  const q = useFade(50);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Augen auf – und trotzdem dunkel" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 220, opacity: eyeIn, filter: 'grayscale(0.4) brightness(0.8)' }}>👁️</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.muted, marginTop: 10, opacity: eyeIn }}>
          weit geöffnet – im dunklen Keller
        </div>
        <div style={{ fontSize: 90, fontWeight: 900, color: COLORS.red, marginTop: 20, opacity: q }}>
          sieht nichts
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={52} volume={0.4} />
      <Caption delay={64}>Das Auge allein macht kein Bild – es braucht Licht, das hineinfällt.</Caption>
    </AbsoluteFill>
  );
};

// ── Modell: Sender → Gegenstand → Empfänger ────────────────────────────
const sender: [number, number] = [340, 520];
const gegenstand: [number, number] = [960, 560];
const empfaenger: [number, number] = [1600, 540];

const ModellScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const p1 = interpolate(frame, [16, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p2 = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Modell" title="Sender → Gegenstand → Empfänger" />
      <RoleTag x={sender[0]} y={340} text="Sender" color={COLORS.amber} delay={8} />
      <RoleTag x={gegenstand[0]} y={340} text="Gegenstand" color={COLORS.indigo} delay={22} />
      <RoleTag x={empfaenger[0]} y={330} text="Empfänger" color={COLORS.sky} delay={36} />
      <LightSource x={sender[0]} y={sender[1]} emoji="💡" label="Lichtquelle" />
      <Ray x1={sender[0] + 30} y1={sender[1]} x2={gegenstand[0] - 55} y2={gegenstand[1] - 20} progress={p1} color={COLORS.amber} arrow width={6} />
      <div style={{ position: 'absolute', left: gegenstand[0] - 60, top: gegenstand[1] - 60, fontSize: 120 }}>🍎</div>
      <Ray x1={gegenstand[0] + 30} y1={gegenstand[1] - 20} x2={empfaenger[0] - 75} y2={empfaenger[1]} progress={p2} color={COLORS.sky} arrow width={6} />
      <Eye x={empfaenger[0]} y={empfaenger[1]} size={130} label="Auge" />
      <Sfx sound="pop" at={18} volume={0.34} />
      <Sfx sound="pling" at={52} volume={0.42} />
      <Caption>Erst wenn Licht vom Gegenstand ins Auge gelangt, entsteht ein Bild.</Caption>
    </AbsoluteFill>
  );
};

// ── Selbstleuchter: Sender = Gegenstand ────────────────────────────────
const SelbstleuchterScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [16, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lamp: [number, number] = [560, 540];
  const eye: [number, number] = [1500, 540];
  const lab = useFade(56);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Sonderfall" title="Selbstleuchter: Sender = Gegenstand" />
      <RoleTag x={lamp[0]} y={330} text="Sender + Gegenstand" color={COLORS.amber} delay={8} />
      <RoleTag x={eye[0]} y={330} text="Empfänger" color={COLORS.sky} delay={20} />
      <LightSource x={lamp[0]} y={lamp[1]} r={64} emoji="💡" label="Lampe" />
      <Ray x1={lamp[0] + 40} y1={lamp[1]} x2={eye[0] - 75} y2={eye[1]} progress={p} color={COLORS.amber} arrow width={7} />
      <Eye x={eye[0]} y={eye[1]} size={130} label="Auge" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 780, textAlign: 'center', fontSize: 34, fontWeight: 700, color: COLORS.muted, opacity: lab }}>
        ☀️ Sonne · 🔥 Feuer · 📱 Bildschirm – auch im Dunkeln sichtbar
      </div>
      <Sfx sound="pling" at={18} volume={0.42} />
      <Caption>Die Lampe schickt ihr Licht direkt ins Auge – sie ist Sender und Gegenstand zugleich.</Caption>
    </AbsoluteFill>
  );
};

// ── Experiment: Licht an/aus mit beleuchtetem Körper ───────────────────
const ExperimentScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const lamp: [number, number] = [560, 250];
  const apple: [number, number] = [860, 600];
  const eye: [number, number] = [1500, 580];
  const on = frame < dur * 0.5; // erst an, dann aus
  const lit = on
    ? interpolate(frame, [10, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(frame - dur * 0.5, [0, 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ausprobieren" title={on ? 'Licht AN – Apfel sichtbar' : 'Licht AUS – Apfel verschwindet'} />
      {/* Schalter-Anzeige */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 300,
          padding: '16px 28px',
          borderRadius: 18,
          border: `2px solid ${on ? COLORS.green : COLORS.red}`,
          background: COLORS.panel,
          fontSize: 40,
          fontWeight: 800,
          color: on ? COLORS.green : COLORS.red,
        }}
      >
        {on ? '🔆 Licht: AN' : '🌑 Licht: AUS'}
      </div>
      <div style={{ opacity: 0.28 + 0.72 * lit, filter: lit < 0.3 ? 'grayscale(0.9) brightness(0.5)' : 'none' }}>
        <LightSource x={lamp[0]} y={lamp[1]} emoji="💡" glow={lit} />
      </div>
      {lit > 0.05 ? (
        <>
          <Ray x1={lamp[0]} y1={lamp[1] + 20} x2={apple[0] - 40} y2={apple[1] - 40} progress={lit} color={COLORS.amber} width={5} />
          <Ray x1={apple[0] + 20} y1={apple[1] - 30} x2={eye[0] - 75} y2={eye[1]} progress={lit} color={COLORS.sky} width={5} arrow />
        </>
      ) : null}
      <div style={{ position: 'absolute', left: apple[0] - 60, top: apple[1] - 60, fontSize: 120, filter: lit > 0.3 ? 'none' : 'brightness(0.22) grayscale(1)' }}>🍎</div>
      {!on ? (
        <div style={{ position: 'absolute', left: apple[0] - 110, top: apple[1] + 74, width: 220, textAlign: 'center', fontSize: 26, fontWeight: 700, color: COLORS.muted }}>
          ist noch da – nur unsichtbar
        </div>
      ) : null}
      <Eye x={eye[0]} y={eye[1]} size={120} seeing={on} label={on ? 'sieht Apfel' : 'sieht nichts'} />
      <Sfx sound={on ? 'pling' : 'impact'} at={Math.round(dur * 0.5) + 2} volume={0.4} />
      <Caption color={on ? COLORS.ink : COLORS.red}>
        {on ? 'Der Apfel wirft Licht zurück – so gelangt es in dein Auge.' : 'Ohne Licht schickt der Apfel nichts ins Auge – er verschwindet für dich.'}
      </Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Sehen heißt Licht empfangen" footer="Sender · Gegenstand · Empfänger">
      Wir sehen einen Gegenstand nur,
      <br />
      wenn Licht von ihm
      <br />
      in unser Auge gelangt.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; text: string; delay: number }> = ({ icon, title, text, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 360, padding: '30px 20px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 72 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: COLORS.muted, marginTop: 6, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Das Auge – ein Lichtempfänger" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🎬" title="Kino" text="Licht von der Leinwand" delay={10} />
        <TCard icon="🕳️" title="Dunkler Keller" text="kein Licht – nichts zu sehen" delay={30} />
        <TCard icon="📸" title="Kamera" text="braucht nachts einen Blitz" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={68}>Wie eine Kamera fängt dein Auge Licht ein – ohne Licht kein Bild.</Caption>
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
  { id: 'selbstleuchter', C: SelbstleuchterScene, min: 250 },
  { id: 'experiment', C: ExperimentScene, min: 280 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 220 },
  { id: 'outro', C: Outro, min: 110 },
];

export const GEGENSTAND_SEHEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const GegenstandSehen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={GEGENSTAND_SEHEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/gegenstand-sehen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
