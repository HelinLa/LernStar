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
import timings from '../narration/magnete-felder-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Magnete & magnetische Felder" (Kapitel-Auftakt)
// Motion-Canvas-Animation (Stabmagnet, Pole, Feldlinien+Eisenspäne, Zerbrechen,
// Stoffe, Erde/Kompass); Remotion legt Titel/Untertitel/Anna darüber.
// Segmentgrenzen == durOf(Szene) → synchron. Neue Datei.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/magnete-felder.mp4');

const IDS = ['intro', 'pole', 'feld', 'teilen', 'stoffe', 'erde', 'merksatz', 'outro'] as const;
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
    <SceneTitle kicker="Magnetismus · Klasse 5" title="Magnete & ihre Felder" />
    <Caption delay={40}>Ein Metallstück – und ringsum wirkt eine unsichtbare Kraft.</Caption>
  </AbsoluteFill>
);

const Pole: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Zwei Pole" title="Nordpol und Südpol" />
    <Caption delay={20} color={COLORS.green}>Gleiche Pole stoßen sich ab, ungleiche ziehen sich an.</Caption>
  </AbsoluteFill>
);

const Feld: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={2} />
    <SceneTitle kicker="Das Magnetfeld" title="Feldlinien sichtbar machen" />
    <Caption delay={30} color={COLORS.sky}>Eisenspäne ordnen sich – vom Nordpol zum Südpol.</Caption>
  </AbsoluteFill>
);

const Teilen: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 115;
  return (
    <AbsoluteFill>
      <ClipLayer i={3} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Kann man einen Pol abtrennen?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Nein: Jedes Bruchstück ist sofort wieder ein ganzer Magnet mit N und S.'
          : 'Man könnte einen Magneten teilen und so einen einzelnen Pol bekommen …'}
      </Caption>
    </AbsoluteFill>
  );
};

const Stoffe: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const resolved = frame >= 125;
  return (
    <AbsoluteFill>
      <ClipLayer i={4} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Zieht ein Magnet jedes Metall an?" />
      <Caption color={resolved ? COLORS.green : COLORS.red}>
        {resolved
          ? 'Nein: nur Eisen, Nickel und Kobalt – Kupfer und Alu bleiben liegen.'
          : 'Man denkt oft: ein Magnet zieht jedes Metall an …'}
      </Caption>
    </AbsoluteFill>
  );
};

const Erde: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={5} />
    <SceneTitle kicker="Die Erde" title="Ein riesiger Magnet" />
    <Caption delay={30} color={COLORS.amber}>Deshalb zeigt die Kompassnadel immer nach Norden.</Caption>
  </AbsoluteFill>
);

const Merksatz: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Merke" title="Das Wichtigste auf einen Blick" />
    <Caption>N- und S-Pol · gleich stößt ab, ungleich zieht an · Feld ringsum.</Caption>
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
          Jeden Punkt schauen wir uns gleich genauer an.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Pole, Feld, Teilen, Stoffe, Erde, Merksatz, Outro];

export const MAGNETE_FELDER_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const MagneteFelderMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNETE_FELDER_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/magnete-felder-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.32} />
              {id === 'merksatz' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
