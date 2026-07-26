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
import { BarMagnet, CompassNeedle, useFade } from '../magnet';
import timings from '../narration/kompass.timings.json';

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
  const wob = Math.sin(frame / 14) * 20 * Math.max(0, 1 - frame / 90);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <CompassNeedle x={960} y={300} size={200} angle={wob} />
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie funktioniert ein Kompass?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum zeigt die Nadel immer nach Norden?
      </div>
    </AbsoluteFill>
  );
};

// ── Nadel = kleiner Magnet ─────────────────────────────────────────────
const NadelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Das Geheimnis" title="Die Nadel ist ein Magnet" />
      <div style={{ display: 'flex', gap: 90, alignItems: 'center', opacity: f }}>
        <CompassNeedle x={0} y={0} size={220} angle={0} ring={false} />
        <div style={{ fontSize: 70 }}>=</div>
        <div style={{ position: 'relative', width: 260, height: 120 }}>
          <BarMagnet cx={130} cy={60} w={220} h={80} angle={-90} />
        </div>
      </div>
      <div style={{ marginTop: 40, fontSize: 32, fontWeight: 700, color: COLORS.muted, opacity: f }}>
        drehbar gelagert · fast reibungsfrei
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Ein kleiner, frei drehbarer Stabmagnet – mit Nord- und Südpol.</Caption>
    </AbsoluteFill>
  );
};

// ── Erde richtet Nadel aus ─────────────────────────────────────────────
const ErdeScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // Nadel angestoßen → pendelt gedämpft zurück nach Norden (0°)
  const kick = 70 * Math.cos(frame / 8) * Math.exp(-frame / 60);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum Norden?" title="Ausgerichtet am Erdfeld" />
      <div style={{ position: 'absolute', left: 440, top: 300, fontSize: 340 }}>🌍</div>
      <div style={{ position: 'absolute', left: 560, top: 250, fontSize: 26, fontWeight: 800, color: COLORS.red }}>magnetischer Norden</div>
      <CompassNeedle x={1320} y={540} size={220} angle={kick} />
      <div style={{ position: 'absolute', left: 1240, top: 690, fontSize: 26, fontWeight: 700, color: COLORS.muted }}>pendelt zurück nach Norden</div>
      <Sfx sound="whoosh" at={4} volume={0.3} />
      <Sfx sound="pling" at={70} volume={0.35} />
      <Caption delay={Math.round(dur * 0.5)}>Stößt du die Nadel an, kehrt sie von selbst nach Norden zurück.</Caption>
    </AbsoluteFill>
  );
};

// ── Störung durch Magnet/Eisen ─────────────────────────────────────────
const StoerungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [20, dur - 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Magnet nähert sich von rechts, Nadel dreht sich zu ihm (nach rechts = +90°)
  const magX = interpolate(t, [0, 1], [1750, 1250]);
  const needle = interpolate(t, [0.2, 1], [0, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Achtung" title="Magnet in der Nähe stört" />
      <CompassNeedle x={860} y={540} size={220} angle={needle} />
      <BarMagnet cx={magX} cy={540} w={260} h={100} nRight={false} />
      <div style={{ position: 'absolute', left: 760, top: 730, fontSize: 30, fontWeight: 800, color: COLORS.red }}>Nadel folgt dem stärkeren Feld ➡️</div>
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.55)}>Ein Magnet oder Eisen zieht die Nadel weg – der Kompass zeigt falsch.</Caption>
    </AbsoluteFill>
  );
};

// ── Beispiel ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 400, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const BeispielScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Beispiel" title="Orientierung finden" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="🧭🗺️" title="Wandern mit Karte & Kompass" delay={10} />
        <TCard icon="⛵" title="Schiff: Eisen fernhalten" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Mit Kompass und Karte findest du zuverlässig die Himmelsrichtung.</Caption>
  </AbsoluteFill>
);

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kompass" footer="Eisen & Magnete in der Nähe stören">
      Die Nadel ist ein drehbarer Magnet.
      <br />
      Sie richtet sich am Erdfeld aus
      <br />
      und zeigt nach Norden.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Kompass heute" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="📱" title="Handy-Kompass zum Navigieren" delay={10} />
        <TCard icon="🕊️" title="Zugvögel mit Magnetsinn" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Sogar Zugvögel finden mit einem Magnetsinn ihren Weg.</Caption>
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
  { id: 'nadel', C: NadelScene, min: 240 },
  { id: 'erde', C: ErdeScene, min: 260 },
  { id: 'stoerung', C: StoerungScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 210 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KOMPASS_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kompass: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KOMPASS_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kompass/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
