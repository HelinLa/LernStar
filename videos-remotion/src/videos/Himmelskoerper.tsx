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
import { Sun, useFade } from '../astro';
import timings from '../narration/himmelskoerper.timings.json';

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
      <div style={{ display: 'flex', gap: 70, marginBottom: 40, fontSize: 120 }}>
        <div>☀️</div><div>🌙</div><div>⭐</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 78, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was leuchtet am Himmel?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Alle sehen hell aus – aber nur ein Teil leuchtet wirklich selbst.
      </div>
    </AbsoluteFill>
  );
};

const SelbstleuchterScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gruppe 1" title="Selbstleuchter" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          {[['☀️', 'Sonne'], ['⭐', 'Sterne = ferne Sonnen']].map((c, i) => (
            <div key={i} style={{ width: 420, padding: '34px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
              <div style={{ fontSize: 100 }}>{c[0]}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.amber, marginTop: 4 }}>erzeugt Licht selbst</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Sonne und Sterne erzeugen ihr Licht selbst – Sterne sind ferne Sonnen.</Caption>
    </AbsoluteFill>
  );
};

const BeleuchtetScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gruppe 2" title="Nur beleuchtet" />
      <Sun x={330} y={300} r={70} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 80 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          {[['🌙', 'Mond'], ['🪐', 'Planeten']].map((c, i) => (
            <div key={i} style={{ width: 420, padding: '34px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
              <div style={{ fontSize: 100 }}>{c[0]}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.sky, marginTop: 4 }}>reflektiert Sonnenlicht</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Mond und Planeten leuchten nicht selbst – wir sehen nur zurückgeworfenes Sonnenlicht.</Caption>
    </AbsoluteFill>
  );
};

const TestScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const off = frame > dur * 0.45;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Test" title={off ? 'Sonne aus …' : 'Schalte die Sonne aus'} />
      <div style={{ display: 'flex', gap: 60, alignItems: 'center', fontSize: 110 }}>
        <div style={{ opacity: off ? 0.15 : 1 }}>☀️</div>
        <div>⭐</div>
        <div style={{ opacity: off ? 0.12 : 1 }}>🌙</div>
        <div style={{ opacity: off ? 0.12 : 1 }}>🪐</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 800, color: off ? COLORS.amber : COLORS.muted }}>
        {off ? '⭐ Sterne leuchten weiter · 🌙🪐 werden dunkel' : ''}
      </div>
      <Sfx sound="pop" at={Math.round(dur * 0.45)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.45) + 6}>Ohne Sonne: Sterne leuchten weiter, Mond und Planeten werden dunkel.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Selbstleuchter?" footer="Sterne sind ferne Sonnen">
      Sonne & Sterne leuchten selbst.
      <br />
      Mond & Planeten leuchten nicht –
      <br />
      wir sehen sie nur beleuchtet.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Abendstern" />
      <div style={{ fontSize: 190, opacity: f }}>🌟🪐</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Die Venus leuchtet hell – aber nur mit geliehenem Sonnenlicht.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der helle „Abendstern" ist gar kein Stern, sondern der beleuchtete Planet Venus.</Caption>
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
  { id: 'selbstleuchter', C: SelbstleuchterScene, min: 240 },
  { id: 'beleuchtet', C: BeleuchtetScene, min: 240 },
  { id: 'test', C: TestScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const HIMMELSKOERPER_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Himmelskoerper: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={HIMMELSKOERPER_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/himmelskoerper/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
