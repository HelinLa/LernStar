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
import timings from '../narration/kraft-wirkungen.timings.json';

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
      <div style={{ display: 'flex', gap: 60, marginBottom: 40, fontSize: 110 }}>
        <div>🧱</div><div>🏃</div><div>↩️</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was kann eine Kraft bewirken?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Mehr als nur schieben und ziehen – drei Wirkungen.
      </div>
    </AbsoluteFill>
  );
};

const WScene: React.FC<SceneProps & { kicker: string; title: string; icon: string; color: string; caption: string }> = ({ kicker, title, icon, color, caption }) => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker={kicker} title={title} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ position: 'relative', opacity: f }}>
          <div style={{ position: 'absolute', inset: -70, borderRadius: '50%', background: `radial-gradient(circle, ${color}44, transparent 70%)` }} />
          <div style={{ fontSize: 240 }}>{icon}</div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={12} volume={0.4} />
      <Caption delay={26}>{caption}</Caption>
    </AbsoluteFill>
  );
};

const VerformenScene: React.FC<SceneProps> = (p) => (
  <WScene {...p} kicker="Wirkung 1" title="Verformen" icon="🎈➡️🥞" color={COLORS.sky} caption="Eine Kraft verändert die Form: der Knetball wird platt, die Feder länger." />
);
const TempoScene: React.FC<SceneProps> = (p) => (
  <WScene {...p} kicker="Wirkung 2" title="Tempo ändern" icon="🏎️💨" color={COLORS.green} caption="Eine Kraft macht schneller oder langsamer – Gasgeben oder Bremsen." />
);
const RichtungScene: React.FC<SceneProps> = (p) => (
  <WScene {...p} kicker="Wirkung 3" title="Richtung ändern" icon="🪐🔄" color={COLORS.amber} caption="Eine Kraft lenkt die Bewegung um – ein Planet auf der Kreisbahn." />
);

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kraftwirkungen" footer="oft mehrere gleichzeitig">
      Eine Kraft kann verformen,
      <br />
      das Tempo ändern oder
      <br />
      die Richtung ändern.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Tennisaufschlag" />
      <div style={{ fontSize: 190, opacity: f }}>🎾🏸</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Der Ball wird verformt, beschleunigt UND in eine neue Richtung geschlagen – alle drei zugleich.
      </div>
      <Sfx sound="impact" at={14} volume={0.34} />
      <Caption delay={40}>Eine einzige Krafteinwirkung – drei Wirkungen auf einmal.</Caption>
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
  { id: 'verformen', C: VerformenScene, min: 210 },
  { id: 'tempo', C: TempoScene, min: 210 },
  { id: 'richtung', C: RichtungScene, min: 210 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KRAFT_WIRKUNGEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const KraftWirkungen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KRAFT_WIRKUNGEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kraft-wirkungen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
