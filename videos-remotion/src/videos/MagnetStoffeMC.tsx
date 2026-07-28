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
import timings from '../narration/magnet-stoffe-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Welche Stoffe zieht ein Magnet an?"
// Motion-Canvas-Animation (Prüfmagnet, Materialkarten, Sortieren, Magnetkran);
// Remotion legt Titel/Untertitel/Anna darüber. Segmentgrenzen == durOf → synchron.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/magnet-stoffe.mp4');

const IDS = ['intro', 'eisen', 'fehlvorstellung', 'sortieren', 'nurdrei', 'regel', 'anwendung', 'outro'] as const;
const DUR = IDS.map((id) => durOf(id, 150));
const OFF: number[] = [];
DUR.reduce((acc, d, i) => {
  OFF[i] = acc;
  return acc + d;
}, 0);

const ClipLayer: React.FC<{ i: number }> = ({ i }) => (
  <OffthreadVideo src={CLIP} startFrom={OFF[i]} muted style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
);

const Intro: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={0} />
    <SceneTitle kicker="Magnetismus · Klasse 5" title="Welche Stoffe zieht ein Magnet an?" />
    <Caption delay={40}>Sieben Materialien liegen bereit – wir testen jedes einzeln.</Caption>
  </AbsoluteFill>
);

const Eisen: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Test 1" title="Eisen wird angezogen" />
    <Caption delay={20} color={COLORS.green}>Nagel und Stahl springen sofort an den Magneten.</Caption>
  </AbsoluteFill>
);

const Fehlvorstellung: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 60;
  return (
    <AbsoluteFill>
      <ClipLayer i={2} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Zieht ein Magnet jedes Metall an?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Nein: Kupfer und Alu sind Metalle – und bleiben trotzdem liegen.'
          : 'Man denkt oft: ein Magnet zieht alle Metalle an …'}
      </Caption>
    </AbsoluteFill>
  );
};

const Sortieren: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={3} />
    <SceneTitle kicker="Sortieren" title="Zwei Gruppen" />
    <Caption delay={20}>Links alles Magnetische, rechts der ganze Rest.</Caption>
  </AbsoluteFill>
);

const Nurdrei: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={4} />
    <SceneTitle kicker="Die magnetischen Stoffe" title="Eisen, Nickel, Kobalt" />
    <Caption delay={20} color={COLORS.green}>Nur diese drei – und Stahl, weil er aus Eisen besteht.</Caption>
  </AbsoluteFill>
);

const Regel: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={5} />
    <SceneTitle kicker="Die Regel" title="Nicht jedes Metall ist magnetisch" />
    <Caption>Nur Eisen, Nickel und Kobalt – Kupfer und Aluminium nicht.</Caption>
  </AbsoluteFill>
);

const Anwendung: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Im Alltag" title="Der Magnetkran am Schrottplatz" />
    <Caption delay={20} color={COLORS.amber}>Er hebt nur den Eisenschrott heraus – der Rest bleibt liegen.</Caption>
  </AbsoluteFill>
);

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
          Nur Eisen, Nickel und Kobalt – nicht jedes Metall.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Eisen, Fehlvorstellung, Sortieren, Nurdrei, Regel, Anwendung, Outro];

export const MAGNET_STOFFE_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const MagnetStoffeMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNET_STOFFE_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/magnet-stoffe-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.3} />
              {id === 'nurdrei' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
