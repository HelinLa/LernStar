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
import timings from '../narration/wechselwirkung.timings.json';

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
      <div style={{ fontSize: 150, marginBottom: 20 }}>🖐️🧱</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum drückt die Wand zurück?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Kraft und Gegenkraft – ein Grundgesetz der Physik.
      </div>
    </AbsoluteFill>
  );
};

const PaarScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Das Prinzip" title="actio = reactio" />
      <div style={{ opacity: f, textAlign: 'center', padding: '40px 70px', borderRadius: 26, background: COLORS.panel, border: `2px solid ${COLORS.amber}` }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.amber }}>Kräfte treten immer paarweise auf</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.muted, marginTop: 14 }}>gleich groß · entgegengesetzt · an zwei Körpern</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Übt ein Körper eine Kraft aus, wirkt gleichzeitig eine gleich große zurück – actio gleich reactio.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Hand gegen Wand" title="50 N hin, 50 N zurück" />
      <div style={{ position: 'absolute', left: 1180, top: 380, width: 60, height: 340, background: 'linear-gradient(90deg,#475569,#334155)', borderRadius: 6, opacity: f }} />
      <div style={{ position: 'absolute', left: 640, top: 500, fontSize: 100, opacity: f }}>🖐️</div>
      <div style={{ opacity: f }}>
        <ForceArrow x={820} y={560} angleDeg={0} len={300} color={COLORS.sky} label="actio 50 N" width={11} />
        <ForceArrow x={1160} y={620} angleDeg={180} len={300} color={COLORS.red} label="reactio 50 N" width={11} />
      </div>
      <Sfx sound="impact" at={14} volume={0.32} />
      <Caption delay={40}>Drückst du mit 50 Newton, drückt die Wand mit genau 50 Newton zurück – an zwei verschiedenen Körpern.</Caption>
    </AbsoluteFill>
  );
};

const RueckstossScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Rückstoß" title="Luftballon & Rakete" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ fontSize: 200, opacity: f }}>🎈🚀</div>
      </AbsoluteFill>
      <div style={{ opacity: f }}>
        <ForceArrow x={900} y={760} angleDeg={180} len={200} color={COLORS.sky} label="Luft nach hinten" width={9} />
        <ForceArrow x={1020} y={760} angleDeg={0} len={200} color={COLORS.green} label="Schub nach vorne" width={9} />
      </div>
      <Sfx sound="whoosh" at={14} volume={0.34} />
      <Caption delay={40}>Der Ballon drückt Luft nach hinten – die Luft drückt ihn nach vorne. Genauso fliegt eine Rakete.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Wechselwirkung" footer="beide wirken an verschiedenen Körpern">
      Kräfte treten immer paarweise auf.
      <br />
      Zu jeder Kraft gibt es eine gleich große
      <br />
      Gegenkraft entgegengesetzt – actio = reactio.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Rückstoß im Alltag" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🚣', 'Sprung vom Boot'], ['🏊', 'Schwimmen']].map((c, i) => (
          <div key={i} style={{ width: 440, padding: '34px', borderRadius: 24, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 100 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Springst du vom Boot, weicht das Boot zurück. Beim Schwimmen drückst du Wasser weg – es schiebt dich vor.</Caption>
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
  { id: 'paar', C: PaarScene, min: 220 },
  { id: 'beispiel', C: BeispielScene, min: 240 },
  { id: 'rueckstoss', C: RueckstossScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WECHSELWIRKUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Wechselwirkung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WECHSELWIRKUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/wechselwirkung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
