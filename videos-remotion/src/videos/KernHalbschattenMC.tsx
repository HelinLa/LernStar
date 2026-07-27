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
import timings from '../narration/kern-halbschatten-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Kern- und Halbschatten"
// Nach dem Didaktik-Standard: Motion-Canvas-Animation (wachsende Lichtquelle, Ball, Schirm,
// exakte Umbra/Penumbra-Kegel aus Quellenrand-Tangenten) zeigt, dass erst eine AUSGEDEHNTE
// Quelle einen weichen Halbschatten erzeugt. Remotion legt Titel/Untertitel/Anna darüber.
// Segmentgrenzen des Clips == durOf(Szene) → synchron. Neue Datei (kern-halbschatten.mp4).

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/kern-halbschatten.mp4');

const IDS = ['intro', 'punkt', 'ausdehnen', 'halbschatten', 'fehlvorstellung', 'sonne', 'merksatz', 'outro'] as const;
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
    <SceneTitle kicker="Licht & Schatten · Klasse 5" title="Kern- und Halbschatten" />
    <Caption delay={40}>Warum sind manche Schatten am Rand scharf – und andere weich?</Caption>
  </AbsoluteFill>
);

// ── 2 · Punkt ─────────────────────────────────────────────────────────
const Punkt: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Kleine Lichtquelle" title="Punktquelle → scharfer Kernschatten" />
    <Caption>Dahinter ist es überall gleich dunkel und der Rand ist scharf.</Caption>
  </AbsoluteFill>
);

// ── 3 · Ausdehnen ─────────────────────────────────────────────────────
const Ausdehnen: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={2} />
    <SceneTitle kicker="Quelle wird größer" title="Ausgedehnte Lampe → weicher Rand" />
    <Caption delay={30} color={COLORS.amber}>Rundherum entsteht ein weicher, halbdunkler Saum.</Caption>
  </AbsoluteFill>
);

// ── 4 · Halbschatten ──────────────────────────────────────────────────
const Halbschatten: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={3} />
    <SceneTitle kicker="Zwei Zonen" title="Kernschatten & Halbschatten" />
    <Caption>Kernschatten: gar kein Licht. Halbschatten: nur ein Teil – deshalb heller.</Caption>
  </AbsoluteFill>
);

// ── 5 · Fehlvorstellung ───────────────────────────────────────────────
const Fehlvorstellung: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 40;
  return (
    <AbsoluteFill>
      <ClipLayer i={4} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Halber Schatten? Zweite Lampe?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Vom Halbschatten sieht man einen Teil der Lampe – vom Kernschatten keinen.'
          : 'Halbschatten heißt nicht „halb“ und braucht keine zweite Lampe …'}
      </Caption>
    </AbsoluteFill>
  );
};

// ── 6 · Sonne ─────────────────────────────────────────────────────────
const Sonne: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={5} />
    <SceneTitle kicker="Im Alltag" title="Die Sonne ist eine große Quelle" />
    <Caption>Große Quelle → weiche Ränder. Eine winzige Lampe wirft scharfe Schatten.</Caption>
  </AbsoluteFill>
);

// ── 7 · Merksatz ──────────────────────────────────────────────────────
const Merksatz: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Merke" title="Nur ausgedehnte Quelle → Halbschatten" />
    <Caption>Im Kernschatten kommt kein Licht an, im Halbschatten nur ein Teil.</Caption>
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
          Große Lampe, weicher Rand – kleine Lampe, scharfer Rand.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Punkt, Ausdehnen, Halbschatten, Fehlvorstellung, Sonne, Merksatz, Outro];

export const KERN_HALBSCHATTEN_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const KernHalbschattenMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KERN_HALBSCHATTEN_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/kern-halbschatten-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.35} />
              {id === 'merksatz' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
