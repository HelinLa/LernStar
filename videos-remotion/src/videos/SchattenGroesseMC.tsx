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
import timings from '../narration/schatten-groesse-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Wovon hängt die Größe des Schattens ab?"
// Nach dem Didaktik-Standard: Motion-Canvas-Animation (Strahlenfächer, beweglicher Ball +
// Schirm, Schattenkegel + grüne Messklammer) zeigt, dass der Ball IMMER gleich groß bleibt
// und nur die Abstände die Schattengröße bestimmen. Remotion legt Titel/Untertitel/Anna-
// Stimme darüber. Segmentgrenzen des Clips == durOf(Szene) → synchron.
// Neue Datei (schatten-groesse.mp4) – Original bleibt bis zur Freigabe unangetastet.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/schatten-groesse.mp4');

const IDS = ['intro', 'frage', 'nah', 'fern', 'fehlvorstellung', 'schirm', 'merksatz', 'outro'] as const;
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
    <SceneTitle kicker="Licht & Schatten · Klasse 5" title="Wie groß wird der Schatten?" />
    <Caption delay={40}>Mal groß, mal klein – wovon hängt die Größe eigentlich ab?</Caption>
  </AbsoluteFill>
);

// ── 2 · Frage ─────────────────────────────────────────────────────────
const Frage: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Der Ball bleibt gleich" title="Nur die Abstände ändern wir" />
    <Caption>Der Ball behält seine Größe – trotzdem lässt sich der Schatten verändern.</Caption>
  </AbsoluteFill>
);

// ── 3 · Nah ───────────────────────────────────────────────────────────
const Nah: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={2} />
    <SceneTitle kicker="Ball an die Lampe" title="Näher an der Lampe → größer" />
    <Caption delay={20} color={COLORS.green}>Die Strahlen laufen weiter auseinander – der Schatten wird viel größer.</Caption>
  </AbsoluteFill>
);

// ── 4 · Fern ──────────────────────────────────────────────────────────
const Fern: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={3} />
    <SceneTitle kicker="Ball an den Schirm" title="Weiter weg von der Lampe → kleiner" />
    <Caption>Nah am Schirm ist der Schatten fast so groß wie der Ball selbst.</Caption>
  </AbsoluteFill>
);

// ── 5 · Fehlvorstellung ───────────────────────────────────────────────
const Fehlvorstellung: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 140; // ab dem Nah-Schub bleibt die Korrektur stehen
  return (
    <AbsoluteFill>
      <ClipLayer i={4} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Größerer Schatten = größerer Ball?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Der Ball ist unverändert – nur sein Abstand entscheidet.'
          : 'Viele denken: näher an der Lampe müsste kleiner sein …'}
      </Caption>
    </AbsoluteFill>
  );
};

// ── 6 · Schirm ────────────────────────────────────────────────────────
const Schirm: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={5} />
    <SceneTitle kicker="Der zweite Abstand" title="Schirm weiter weg → größer" />
    <Caption delay={20} color={COLORS.green}>Mehr Platz zum Auseinanderlaufen – auch so wächst der Schatten.</Caption>
  </AbsoluteFill>
);

// ── 7 · Merksatz ──────────────────────────────────────────────────────
const Merksatz: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Merke" title="Die Abstände entscheiden" />
    <Caption>Nah an der Lampe und Schirm weit weg → großer Schatten. Nicht die Größe des Körpers.</Caption>
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
          Nicht die Größe – die Abstände machen den Schatten.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Frage, Nah, Fern, Fehlvorstellung, Schirm, Merksatz, Outro];

export const SCHATTEN_GROESSE_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const SchattenGroesseMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SCHATTEN_GROESSE_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/schatten-groesse-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.35} />
              {id === 'merksatz' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
