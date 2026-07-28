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
import timings from '../narration/kompass-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Wie funktioniert ein Kompass?"
// Motion-Canvas-Animation (Kompass, Magnetnadel, Erdfeld, Anstoßen, Störung);
// Remotion legt Titel/Untertitel/Anna darüber. Segmentgrenzen == durOf → synchron.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/kompass.mp4');

const IDS = ['intro', 'nadel', 'erdfeld', 'anstoss', 'magnetnah', 'fehlvorstellung', 'anwendung', 'outro'] as const;
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
    <SceneTitle kicker="Magnetismus · Klasse 5" title="Wie funktioniert ein Kompass?" />
    <Caption delay={40}>Die Nadel zeigt zuverlässig nach Norden – aber warum?</Caption>
  </AbsoluteFill>
);

const Nadel: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Das Geheimnis" title="Die Nadel ist ein Magnet" />
    <Caption delay={20}>Ein winziger, frei drehbarer Stabmagnet mit Nord- und Südpol.</Caption>
  </AbsoluteFill>
);

const Erdfeld: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={2} />
    <SceneTitle kicker="Die Erde als Magnet" title="Ausrichtung im Erdfeld" />
    <Caption delay={20} color={COLORS.sky}>Die Nadel dreht sich, bis ihr Nordpol nach Norden zeigt.</Caption>
  </AbsoluteFill>
);

const Anstoss: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={3} />
    <SceneTitle kicker="Test" title="Sie pendelt immer zurück" />
    <Caption delay={20} color={COLORS.green}>Das Erdmagnetfeld zieht sie jedes Mal nach Norden.</Caption>
  </AbsoluteFill>
);

const Magnetnah: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={4} />
    <SceneTitle kicker="Stärkeres Feld gewinnt" title="Ein Magnet lenkt die Nadel ab" />
    <Caption delay={20}>Sein Feld ist viel stärker als das der Erde.</Caption>
  </AbsoluteFill>
);

const Fehlvorstellung: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 60;
  return (
    <AbsoluteFill>
      <ClipLayer i={5} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Zeigt ein Kompass immer Norden?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Nein: Eisen, Handy oder Magnet lenken die Nadel ab – erst ohne Störer stimmt es.'
          : 'Man denkt: die Nadel zeigt überall ganz genau Norden …'}
      </Caption>
    </AbsoluteFill>
  );
};

const Anwendung: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Beim Wandern" title="Die Himmelsrichtungen finden" />
    <Caption delay={20} color={COLORS.green}>Norden, Osten, Süden, Westen – so findet man den Weg.</Caption>
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
          Ein Magnet, der sich im Erdfeld nach Norden dreht.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Nadel, Erdfeld, Anstoss, Magnetnah, Fehlvorstellung, Anwendung, Outro];

export const KOMPASS_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const KompassMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KOMPASS_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/kompass-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.3} />
              {id === 'erdfeld' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
