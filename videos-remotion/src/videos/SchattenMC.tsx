import React from 'react';
import {
  AbsoluteFill,
  Series,
  Audio,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, StarLogo, BackgroundMusic, Sfx } from '../components';
import timings from '../narration/schatten-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Wie entsteht ein Schatten?"
// Nach dem Didaktik-Standard: Motion-Canvas-Animation (gerader Strahlenfächer, Ball,
// Schirm, reaktiver Schattenkegel) zeigt, dass der Schatten der Bereich HINTER dem Körper
// ist, den kein Strahl erreicht – kein Ding, das der Körper aussendet. Remotion legt Titel/
// Untertitel/Anna-Stimme darüber. Segmentgrenzen des Clips == durOf(Szene) → synchron.
// Neue Datei (schatten.mp4) – Original schatten.mp4 im Zielordner bleibt bis zur Freigabe.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/schatten.mp4');

const IDS = ['intro', 'strahlen', 'schatten', 'fehlvorstellung', 'geradlinig', 'bewegen', 'merksatz', 'outro'] as const;
const DUR = IDS.map((id) => durOf(id, 150));
const OFF: number[] = [];
DUR.reduce((acc, d, i) => {
  OFF[i] = acc;
  return acc + d;
}, 0);

const ClipLayer: React.FC<{ i: number }> = ({ i }) => (
  <OffthreadVideo src={CLIP} startFrom={OFF[i]} muted style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
);

// ── 1 · Intro ─────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={0} />
    <SceneTitle kicker="Licht & Schatten · Klasse 5" title="Wie entsteht ein Schatten?" />
    <Caption delay={40}>Warum wird es hinter einem Körper dunkel – und wo genau?</Caption>
  </AbsoluteFill>
);

// ── 2 · Strahlen ──────────────────────────────────────────────────────
const Strahlen: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Licht läuft geradlinig" title="Gerade Strahlen in alle Richtungen" />
    <Caption>Wo die Strahlen ungestört ankommen, wird der Schirm hell.</Caption>
  </AbsoluteFill>
);

// ── 3 · Schatten ──────────────────────────────────────────────────────
const Schatten: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={2} />
    <SceneTitle kicker="Ein Körper im Weg" title="Der Ball hält die Strahlen auf" />
    <Caption delay={30}>Hinter dem Ball kommt kein Licht an – dieser dunkle Bereich ist der Schatten.</Caption>
  </AbsoluteFill>
);

// ── 4 · Fehlvorstellung ───────────────────────────────────────────────
const Fehlvorstellung: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 125; // ab dem Licht-Aus bleibt die Korrektur stehen
  return (
    <AbsoluteFill>
      <ClipLayer i={3} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Wirft der Ball den Schatten selbst?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Licht aus → Schatten weg. Ein Schatten ist nur fehlendes Licht.'
          : 'Viele denken: der Ball sendet den Schatten aus sich heraus …'}
      </Caption>
    </AbsoluteFill>
  );
};

// ── 5 · Geradlinig ────────────────────────────────────────────────────
const Geradlinig: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={4} />
    <SceneTitle kicker="Warum bleibt es dunkel?" title="Licht biegt nicht um den Ball" />
    <Caption>Licht bewegt sich immer geradeaus – deshalb bleibt es direkt hinter dem Ball dunkel.</Caption>
  </AbsoluteFill>
);

// ── 6 · Bewegen ───────────────────────────────────────────────────────
const Bewegen: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={5} />
    <SceneTitle kicker="Wo liegt der Schatten?" title="Immer der Lampe gegenüber" />
    <Caption delay={20}>Lampe nach oben → Schatten nach unten. Er liegt stets auf der abgewandten Seite.</Caption>
  </AbsoluteFill>
);

// ── 7 · Merksatz ──────────────────────────────────────────────────────
const Merksatz: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Merke" title="Schatten = Bereich ohne Lichtstrahlen" />
    <Caption>Licht verläuft geradlinig, der Körper hält es auf – dahinter bleibt es dunkel.</Caption>
  </AbsoluteFill>
);

// ── 8 · Outro ─────────────────────────────────────────────────────────
const Outro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill>
      <ClipLayer i={7} />
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96 }}>
        <StarLogo size={72} />
        <div
          style={{
            marginTop: 16,
            fontSize: 42,
            fontWeight: 700,
            color: COLORS.ink,
            opacity: s,
            transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
            textAlign: 'center',
            textShadow: '0 3px 18px rgba(0,0,0,0.75)',
          }}
        >
          Kein Licht, das fehlt – das ist der Schatten.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Strahlen, Schatten, Fehlvorstellung, Geradlinig, Bewegen, Merksatz, Outro];

export const SCHATTEN_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const SchattenMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SCHATTEN_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/schatten-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.35} />
              {id === 'merksatz' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
