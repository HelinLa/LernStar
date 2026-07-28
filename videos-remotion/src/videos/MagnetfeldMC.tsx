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
import timings from '../narration/magnetfeld-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Wie sieht ein Magnetfeld aus?"
// Motion-Canvas-Animation (Feldlinien + Eisenspäne, Prüfkompass, Feldstärke);
// Remotion legt Titel/Untertitel/Anna darüber. Segmentgrenzen == durOf → synchron.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/magnetfeld.mp4');

const IDS = ['intro', 'feldlinien', 'richtung', 'pruefkompass', 'staerke', 'fehlvorstellung', 'merksatz', 'outro'] as const;
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
    <SceneTitle kicker="Magnetismus · Klasse 5" title="Wie sieht ein Magnetfeld aus?" />
    <Caption delay={40}>Rund um den Magneten wirkt eine unsichtbare Kraft.</Caption>
  </AbsoluteFill>
);

const Feldlinien: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Sichtbar gemacht" title="Feldlinien" />
    <Caption delay={20} color={COLORS.sky}>Eisenspäne ordnen sich in weiten Bögen von Pol zu Pol.</Caption>
  </AbsoluteFill>
);

const Richtung: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={2} />
    <SceneTitle kicker="Richtung" title="Von Nord nach Süd" />
    <Caption delay={20}>Außen zeigen die Feldlinien vom Nordpol zum Südpol.</Caption>
  </AbsoluteFill>
);

const Pruefkompass: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={3} />
    <SceneTitle kicker="Prüfkompass" title="Die Nadel folgt dem Feld" />
    <Caption delay={20} color={COLORS.green}>An jeder Stelle stellt sie sich entlang der Feldlinie ein.</Caption>
  </AbsoluteFill>
);

const Staerke: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={4} />
    <SceneTitle kicker="Stärke" title="Nah am Pol am stärksten" />
    <Caption delay={20} color={COLORS.amber}>Dichte Linien bedeuten ein starkes Feld – weiter weg wird es schwächer.</Caption>
  </AbsoluteFill>
);

const Fehlvorstellung: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 65;
  return (
    <AbsoluteFill>
      <ClipLayer i={5} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Sind Feldlinien echte Fäden?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Nein: auch zwischen den Linien schlägt die Nadel aus – das Feld ist überall.'
          : 'Man denkt: nur genau AUF den Linien gibt es ein Feld …'}
      </Caption>
    </AbsoluteFill>
  );
};

const Merksatz: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Merke" title="Richtung und Stärke ablesen" />
    <Caption>Feld ringsum · außen von N nach S · an den Polen am stärksten.</Caption>
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
          Feldlinien zeigen Richtung und Stärke des Magnetfeldes.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Feldlinien, Richtung, Pruefkompass, Staerke, Fehlvorstellung, Merksatz, Outro];

export const MAGNETFELD_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const MagnetfeldMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNETFELD_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/magnetfeld-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.3} />
              {id === 'merksatz' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
