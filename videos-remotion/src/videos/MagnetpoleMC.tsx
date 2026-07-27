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
import timings from '../narration/magnetpole-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Wie wirken Magnetpole aufeinander?"
// Nach dem Didaktik-Standard: Motion-Canvas-Animation (zwei Stabmagnete N=rot/S=blau,
// drehbar, Kraftpfeile, Kraftmesser) zeigt Anziehung (ungleiche Pole) und Abstoßung
// (gleiche Pole), Kraft ↔ Abstand und die berührungslose Wirkung. Remotion legt Titel/
// Untertitel/Anna darüber. Segmentgrenzen == durOf(Szene) → synchron. Neue Datei.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/magnetpole.mp4');

const IDS = ['intro', 'ungleich', 'gleich', 'fehlvorstellung', 'regel', 'abstand', 'kontaktlos', 'outro'] as const;
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
    <SceneTitle kicker="Magnetismus · Klasse 5" title="Wie wirken Magnetpole?" />
    <Caption delay={40}>Zwei Magnete – ziehen sie sich an oder stoßen sie sich ab?</Caption>
  </AbsoluteFill>
);

// ── 2 · Ungleich ──────────────────────────────────────────────────────
const Ungleich: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Nordpol trifft Südpol" title="Ungleiche Pole ziehen sich an" />
    <Caption delay={20} color={COLORS.green}>Sie wandern von selbst aufeinander zu.</Caption>
  </AbsoluteFill>
);

// ── 3 · Gleich ────────────────────────────────────────────────────────
const Gleich: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={2} />
    <SceneTitle kicker="Magnet umgedreht" title="Gleiche Pole stoßen sich ab" />
    <Caption delay={40} color={COLORS.red}>Zwei Nordpole werden auseinandergedrückt.</Caption>
  </AbsoluteFill>
);

// ── 4 · Fehlvorstellung ───────────────────────────────────────────────
const Fehlvorstellung: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 60;
  return (
    <AbsoluteFill>
      <ClipLayer i={3} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Ziehen Magnete immer an?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Nein: gleiche Pole stoßen ab, ungleiche ziehen an – beides gehört dazu.'
          : 'Viele glauben: Magnete ziehen sich immer an …'}
      </Caption>
    </AbsoluteFill>
  );
};

// ── 5 · Regel ─────────────────────────────────────────────────────────
const Regel: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={4} />
    <SceneTitle kicker="Die Regel" title="Gleich stößt ab, ungleich zieht an" />
    <Caption>Es kommt darauf an, welche beiden Pole sich begegnen.</Caption>
  </AbsoluteFill>
);

// ── 6 · Abstand ───────────────────────────────────────────────────────
const Abstand: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={5} />
    <SceneTitle kicker="Kraft und Abstand" title="Näher → größere Kraft" />
    <Caption delay={20}>Je kleiner der Abstand, desto stärker die Kraft – mit Abstand nimmt sie schnell ab.</Caption>
  </AbsoluteFill>
);

// ── 7 · Kontaktlos ────────────────────────────────────────────────────
const Kontaktlos: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Das Besondere" title="Die Kraft wirkt ohne Berührung" />
    <Caption color={COLORS.amber}>Sie geht durch die Luft – der Magnet wirkt über den leeren Raum hinweg.</Caption>
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
          Gleiche Pole ab, ungleiche an – ganz ohne Berührung.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Ungleich, Gleich, Fehlvorstellung, Regel, Abstand, Kontaktlos, Outro];

export const MAGNETPOLE_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const MagnetpoleMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNETPOLE_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/magnetpole-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.35} />
              {id === 'regel' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
