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
import timings from '../narration/stromkreis-mc.timings.json';

// COMPOSITE · Klasse 5 RS Physik — "Wann leuchtet eine Lampe?" (einfacher Stromkreis)
// Nach dem Didaktik-Standard: Motion-Canvas-Animation (umlaufende Elektronen, Schalter,
// Lampe) zeigt, dass die Elektronen-Dichte überall gleich ist (nichts wird "verbraucht")
// und dass beim Öffnen ALLE gleichzeitig stehen bleiben. Remotion legt Titel/Untertitel/
// Anna-Stimme darüber. Segmentgrenzen des Clips == durOf(Szene) → synchron.
// Neue Datei (stromkreis.mp4) – Original stromkreis-lampe.mp4 bleibt bis zur Freigabe.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLIP = staticFile('mc/stromkreis.mp4');

const IDS = ['intro', 'geschlossen', 'elektronen', 'verbrauch', 'energie', 'offen', 'merksatz', 'outro'] as const;
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
    <SceneTitle kicker="Elektrizität · Klasse 5" title="Wann leuchtet eine Lampe?" />
    <Caption delay={40}>Was braucht die Lampe wirklich – reicht ein einziges Kabel?</Caption>
  </AbsoluteFill>
);

// ── 2 · Geschlossener Kreis ──────────────────────────────────────────
const Geschlossen: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={1} />
    <SceneTitle kicker="Der geschlossene Kreis" title="Kreis zu → die Lampe leuchtet" />
    <Caption>Batterie, Leitung, Lampe – erst der geschlossene Stromkreis bringt Licht.</Caption>
  </AbsoluteFill>
);

// ── 3 · Elektronen ───────────────────────────────────────────────────
const Elektronen: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={2} />
    <SceneTitle kicker="Was fließt da?" title="Elektronen wandern im Draht" />
    <Caption delay={30}>Sie laufen alle gleichzeitig los – wie eine Kette, die sich im Kreis dreht.</Caption>
  </AbsoluteFill>
);

// ── 4 · Verbrauch (Fehlvorstellung) ──────────────────────────────────
const Verbrauch: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const wrong = frame < 70;
  return (
    <AbsoluteFill>
      <ClipLayer i={3} />
      <SceneTitle kicker="Achtung: Denkfehler" title="Verbraucht die Lampe Elektronen?" />
      <Caption color={wrong ? COLORS.red : COLORS.green}>
        {wrong
          ? 'Viele denken: dahinter kommen weniger an …'
          : 'Zähl nach – vor und hinter der Lampe fließen gleich viele.'}
      </Caption>
    </AbsoluteFill>
  );
};

// ── 5 · Energie ──────────────────────────────────────────────────────
const Energie: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={4} />
    <SceneTitle kicker="Was wird verbraucht?" title="Energie – nicht der Strom" />
    <Caption>Die Elektronen geben in der Lampe Energie ab und fließen vollständig zur Batterie zurück.</Caption>
  </AbsoluteFill>
);

// ── 6 · Offen ────────────────────────────────────────────────────────
const Offen: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const open = frame >= 72;
  return (
    <AbsoluteFill>
      <ClipLayer i={5} />
      <SceneTitle kicker="Kreis geöffnet" title={open ? 'Alles steht still – Lampe aus' : 'Eine einzige Lücke …'} />
      <Caption color={open ? COLORS.red : COLORS.ink}>
        {open
          ? 'Ohne geschlossenen Kreis fließt nichts – nicht nur an der Lücke.'
          : 'Wir öffnen den Schalter an einer einzigen Stelle.'}
      </Caption>
    </AbsoluteFill>
  );
};

// ── 7 · Merksatz ─────────────────────────────────────────────────────
const Merksatz: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer i={6} />
    <SceneTitle kicker="Merke" title="Nur der geschlossene Kreis leuchtet" />
    <Caption>Die Elektronen werden nicht verbraucht – nur ihre Energie.</Caption>
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
          Ein Kabel reicht nicht – erst der geschlossene Kreis bringt Licht.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const COMPONENTS: React.FC<SceneProps>[] = [Intro, Geschlossen, Elektronen, Verbrauch, Energie, Offen, Merksatz, Outro];

export const STROMKREIS_MC_DURATION = DUR.reduce((a, b) => a + b, 0);

export const StromkreisMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STROMKREIS_MC_DURATION} />
      <Series>
        {IDS.map((id, i) => {
          const C = COMPONENTS[i];
          return (
            <Series.Sequence key={id} durationInFrames={DUR[i]}>
              <C dur={DUR[i]} />
              <Audio src={staticFile(`audio/stromkreis-mc/${id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.35} />
              {id === 'merksatz' ? <Sfx sound="pling" at={2} volume={0.5} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
