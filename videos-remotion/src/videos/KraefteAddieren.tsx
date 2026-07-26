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
import { ForceArrow, useFade } from '../forces';
import timings from '../narration/kraefte-addieren.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 150, marginBottom: 20 }}>➡️➡️</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Zwei Kräfte gleichzeitig?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie fasst man mehrere Kräfte zu einer zusammen?
      </div>
    </AbsoluteFill>
  );
};

const ResultierendeScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Begriff" title="Die Resultierende" />
      <div style={{ opacity: f, textAlign: 'center', padding: '40px 70px', borderRadius: 26, background: COLORS.panel, border: `2px solid ${COLORS.green}` }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: COLORS.green }}>eine einzige Gesamtkraft</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.muted, marginTop: 12 }}>ersetzt alle Einzelkräfte –</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.muted }}>und bewirkt genau dasselbe.</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Mehrere Kräfte fasst man zur Resultierenden zusammen – sie wirkt wie alle zusammen.</Caption>
    </AbsoluteFill>
  );
};

const GleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gleiche Richtung" title="Beträge addieren" />
      <div style={{ opacity: f }}>
        <ForceArrow x={500} y={520} angleDeg={0} len={180} color={COLORS.sky} label="100 N" width={10} />
        <ForceArrow x={680} y={520} angleDeg={0} len={180} color={COLORS.sky} label="100 N" width={10} />
        <ForceArrow x={500} y={720} angleDeg={0} len={360} color={COLORS.green} label="200 N gesamt" width={13} />
      </div>
      <div style={{ position: 'absolute', left: 500, top: 620, fontSize: 40, fontWeight: 900, color: COLORS.amber, opacity: f }}>100 N + 100 N = 200 N</div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Zeigen zwei Kräfte in dieselbe Richtung, addieren sich ihre Beträge – hier 200 Newton.</Caption>
    </AbsoluteFill>
  );
};

const EntgegenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gegenrichtung" title="Beträge subtrahieren" />
      <div style={{ opacity: f }}>
        <ForceArrow x={960} y={520} angleDeg={180} len={200} color={COLORS.red} label="100 N" width={10} />
        <ForceArrow x={960} y={520} angleDeg={0} len={240} color={COLORS.sky} label="120 N" width={10} />
        <ForceArrow x={960} y={720} angleDeg={0} len={80} color={COLORS.green} label="20 N →" width={13} />
      </div>
      <div style={{ position: 'absolute', left: 700, top: 620, fontSize: 40, fontWeight: 900, color: COLORS.amber, opacity: f }}>120 N − 100 N = 20 N (zur stärkeren Seite)</div>
      <Sfx sound="impact" at={14} volume={0.3} />
      <Caption delay={40}>Zeigen sie gegeneinander, ziehst du ab – beim Tauziehen gewinnt die stärkere Seite mit 20 Newton.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kräfte addieren" footer="die Resultierende zeigt zur stärkeren Seite">
      Mehrere Kräfte fasst man zur Resultierenden zusammen.
      <br />
      Gleiche Richtung: Beträge addieren.
      <br />
      Gegenrichtung: Beträge subtrahieren.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Resultierende im Alltag" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🪢', 'Tauziehen'], ['⛵', 'Segelboot']].map((c, i) => (
          <div key={i} style={{ width: 440, padding: '34px', borderRadius: 24, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 100 }}>{c[0]}</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="whoosh" at={14} volume={0.34} />
      <Caption delay={40}>Die Resultierende entscheidet, wohin sich das Seil bewegt – oder das Segelboot fährt.</Caption>
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
  { id: 'resultierende', C: ResultierendeScene, min: 220 },
  { id: 'gleich', C: GleichScene, min: 240 },
  { id: 'entgegen', C: EntgegenScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KRAEFTE_ADDIEREN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const KraefteAddieren: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KRAEFTE_ADDIEREN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kraefte-addieren/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
