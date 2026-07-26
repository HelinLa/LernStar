import React from 'react';
import {
  AbsoluteFill,
  Series,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo, BackgroundMusic, Sfx } from '../components';
import { useFade } from '../forces';
import timings from '../narration/ortsfaktor.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const BODIES = [
  { icon: '🌍', name: 'Erde', g: '10', G: '600 N', size: 200, color: COLORS.sky },
  { icon: '🌕', name: 'Mond', g: '1,6', G: '96 N', size: 120, color: COLORS.muted },
  { icon: '🪐', name: 'Jupiter', g: '25', G: '1500 N', size: 260, color: COLORS.amber },
];

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 140, marginBottom: 20 }}>🧑‍🚀🌕</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Bin ich auf dem Mond leichter?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Was ändert sich – und was bleibt gleich?
      </div>
    </AbsoluteFill>
  );
};

const MasseScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Bleibt gleich" title="Deine Masse: 60 kg" />
      <div style={{ display: 'flex', gap: 60, alignItems: 'center', opacity: f }}>
        {['🌍', '🌕', '🪐'].map((b, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 120 }}>{b}</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.green }}>60 kg</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={30}>Deine Masse ändert sich nicht – überall genau dieselbe Menge Stoff.</Caption>
    </AbsoluteFill>
  );
};

const OrtsfaktorScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ändert sich" title="Der Ortsfaktor g" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 50, opacity: f, alignItems: 'flex-end' }}>
          {BODIES.map((b, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: b.size * 0.5 }}>{b.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.ink, marginTop: 6 }}>{b.name}</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: b.color }}>g ≈ {b.g}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>N/kg</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Der Ortsfaktor g sagt, wie stark ein Himmelskörper anzieht – Mond klein, Jupiter groß.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="G = m · g" title="60 kg, drei Welten" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 50, opacity: f }}>
          {BODIES.map((b, i) => (
            <div key={i} style={{ width: 360, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${b.color}`, textAlign: 'center' }}>
              <div style={{ fontSize: 90 }}>{b.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{b.name}</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: b.color, marginTop: 10 }}>{b.G}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="impact" at={14} volume={0.3} />
      <Caption delay={40}>Gleiche Masse, ganz unterschiedliche Gewichtskraft: Mond ein Sechstel, Jupiter über das Doppelte.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Ortsfaktor g" footer="Masse bleibt, Gewichtskraft ändert sich">
      Auf dem Mond hast du nicht weniger Masse –
      <br />
      du wirst nur schwächer angezogen.
      <br />
      Kleiner Ortsfaktor g, kleinere Gewichtskraft.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Riesensprünge auf dem Mond" />
      <div style={{ fontSize: 180, opacity: f }}>🦘🌕</div>
      <div style={{ marginTop: 16, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Nur ein Sechstel der Anziehung – aber die Trägheit bleibt: Ein Stoß tut auch dort weh.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Weniger Anziehung heißt hohe Sprünge – die Masse und ihre Trägheit bleiben aber gleich.</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={120} />
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: COLORS.muted, opacity: s }}>
        Physik verstehen – Schritt für Schritt.
      </div>
    </AbsoluteFill>
  );
};

const SCENES: { id: string; C: React.FC<SceneProps>; min: number }[] = [
  { id: 'intro', C: Intro, min: 130 },
  { id: 'masse', C: MasseScene, min: 220 },
  { id: 'ortsfaktor', C: OrtsfaktorScene, min: 240 },
  { id: 'vergleich', C: VergleichScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ORTSFAKTOR_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Ortsfaktor: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ORTSFAKTOR_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/ortsfaktor/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
