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
import timings from '../narration/elektromagnet-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Der Elektromagnet – wie stark ist er?"
// Motion-Canvas-Animation (Spule+Kern, Stromkreis, Feld an/aus, Tragkraft, Windungen/Strom/Kern);
// Remotion legt Titel/Untertitel/Anna darüber. Segmentgrenzen == durOf → synchron.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/elektromagnet.mp4');

const IDS = ['intro', 'stromfeld', 'abschalten', 'windungen', 'strom', 'eisenkern', 'anwendung', 'outro'] as const;
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
    <SceneTitle kicker="Magnetismus · Klasse 5" title="Der Elektromagnet – wie stark ist er?" />
    <Caption delay={40}>Ein Magnet, den man ein- und ausschalten kann.</Caption>
  </AbsoluteFill>
);

const Stromfeld: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Strom an" title="Die Spule wird zum Magneten" />
    <Caption delay={20} color={COLORS.green}>Fließt Strom, entsteht ein Magnetfeld – Klammern werden gehalten.</Caption>
  </AbsoluteFill>
);

const Abschalten: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 45;
  return (
    <AbsoluteFill>
      <ClipLayer i={2} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Ist er immer magnetisch?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Nein: ohne Strom kein Feld – die Klammern fallen sofort ab.'
          : 'Man denkt: ein Elektromagnet ist immer ein Magnet …'}
      </Caption>
    </AbsoluteFill>
  );
};

const Windungen: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={3} />
    <SceneTitle kicker="Stärke 1" title="Mehr Windungen → stärker" />
    <Caption delay={20}>Mehr Draht um den Kern hält mehr Büroklammern.</Caption>
  </AbsoluteFill>
);

const Strom: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={4} />
    <SceneTitle kicker="Stärke 2" title="Mehr Strom → stärker" />
    <Caption delay={20}>Höhere Stromstärke bedeutet mehr Kraft.</Caption>
  </AbsoluteFill>
);

const Eisenkern: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={5} />
    <SceneTitle kicker="Stärke 3" title="Der Eisenkern verstärkt" />
    <Caption delay={20} color={COLORS.amber}>Ohne Kern schwach – mit Kern springt die Tragkraft nach oben.</Caption>
  </AbsoluteFill>
);

const Anwendung: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Im Alltag" title="Weil man ihn abschalten kann" />
    <Caption delay={20} color={COLORS.green}>Schrott-Kran, Türklingel und Lautsprecher nutzen genau das.</Caption>
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
          Nur mit Strom – stärker mit Windungen, Strom und Eisenkern.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Stromfeld, Abschalten, Windungen, Strom, Eisenkern, Anwendung, Outro];

export const ELEKTROMAGNET_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const ElektromagnetMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ELEKTROMAGNET_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/elektromagnet-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.3} />
              {id === 'stromfeld' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
