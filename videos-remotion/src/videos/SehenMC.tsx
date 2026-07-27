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
import timings from '../narration/sehen-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Wie können wir einen Gegenstand sehen?"
// Nach dem verbindlichen Didaktik-Standard neu gebaut: Die Motion-Canvas-Animation
// (Strahlengang) zeigt zuerst das FALSCHE Sehstrahl-Modell und kehrt dann die
// Pfeilrichtung sichtbar um (Licht → Auge). Remotion legt Titel/Untertitel/Anna-Stimme
// darüber. Segmentgrenzen des Clips == durOf(Szene) → alles läuft synchron.
// Neue Datei (sehen.mp4) – Original gegenstand-sehen.mp4 bleibt unangetastet.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/sehen.mp4');

const IDS = ['intro', 'fehlvorstellung', 'umkehr', 'modell', 'selbstleuchter', 'experiment', 'merksatz', 'outro'] as const;
const DUR = IDS.map((id) => durOf(id, 150));
const OFF: number[] = [];
DUR.reduce((acc, d, i) => {
  OFF[i] = acc;
  return acc + d;
}, 0);

// Video-Ebene: zeigt den passenden Ausschnitt des kontinuierlichen MC-Clips
const ClipLayer: React.FC<{ i: number }> = ({ i }) => (
  <OffthreadVideo src={CLIP} startFrom={OFF[i]} muted style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
);

// ── 1 · Intro ─────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={0} />
    <SceneTitle kicker="Optik · Klasse 5" title="Wie können wir etwas sehen?" />
    <Caption delay={40}>Wie kommt das Bild eines Gegenstands in dein Auge?</Caption>
  </AbsoluteFill>
);

// ── 2 · Fehlvorstellung ──────────────────────────────────────────────
const Fehlvorstellung: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Achtung: Denkfehler" title="Sendet das Auge Strahlen aus?" />
    <Caption color={COLORS.red}>Falsch – im Dunkeln bleibt der Apfel unsichtbar. Blicke allein zeigen nichts.</Caption>
  </AbsoluteFill>
);

// ── 3 · Umkehr (Kern-Korrektur) ──────────────────────────────────────
const Umkehr: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={2} />
    <SceneTitle kicker="Die Umkehr" title="Licht kommt ins Auge – nicht heraus" />
    <Caption>Licht läuft: Lampe → Apfel → Auge. Erst dann entsteht ein Bild.</Caption>
  </AbsoluteFill>
);

// ── 4 · Modell ───────────────────────────────────────────────────────
const Modell: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={3} />
    <SceneTitle kicker="Das Modell" title="Sender → Gegenstand → Empfänger" />
    <Caption delay={30}>Drei müssen zusammenspielen: Lichtquelle, Gegenstand, Auge.</Caption>
  </AbsoluteFill>
);

// ── 5 · Selbstleuchter ───────────────────────────────────────────────
const Selbstleuchter: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={4} />
    <SceneTitle kicker="Sonderfall" title="Selbstleuchter: Sender = Gegenstand" />
    <Caption>Sonne, Feuer, Bildschirm senden ihr Licht selbst – direkt ins Auge.</Caption>
  </AbsoluteFill>
);

// ── 6 · Experiment (Licht AN/AUS) ────────────────────────────────────
const Experiment: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const dark = frame >= 50 && frame < 104; // Fenster deckt sich mit der Verdunkelung im Clip
  const kicker = dark ? 'Licht AUS' : frame < 48 ? 'Ausprobieren' : 'Licht AN';
  const title = dark ? 'Apfel verschwindet' : frame < 48 ? 'Der Apfel leuchtet nicht selbst' : 'Sofort wieder sichtbar';
  return (
    <AbsoluteFill>
      <ClipLayer i={5} />
      <SceneTitle kicker={kicker} title={title} />
      <Caption color={dark ? COLORS.red : COLORS.ink}>
        {dark
          ? 'Ohne Licht schickt der Apfel nichts ins Auge – du siehst ihn nicht.'
          : 'Ein beleuchteter Körper leuchtet nur, weil er Licht zurückwirft.'}
      </Caption>
    </AbsoluteFill>
  );
};

// ── 7 · Merksatz ─────────────────────────────────────────────────────
const Merksatz: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Merke" title="Sehen heißt Licht empfangen" />
    <Caption>Wir sehen einen Gegenstand nur, wenn Licht von ihm ins Auge gelangt – niemals umgekehrt.</Caption>
  </AbsoluteFill>
);

// ── 8 · Outro ────────────────────────────────────────────────────────
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
          Augen auf reicht nicht – erst Licht im Auge lässt uns sehen.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Fehlvorstellung, Umkehr, Modell, Selbstleuchter, Experiment, Merksatz, Outro];

export const SEHEN_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const SehenMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SEHEN_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/sehen-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.35} />
              {id === 'merksatz' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
