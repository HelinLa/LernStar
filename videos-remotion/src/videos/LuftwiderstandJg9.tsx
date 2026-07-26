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
import timings from '../narration/luftwiderstand-jg9.timings.json';

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
      <div style={{ fontSize: 120, marginBottom: 20, transform: `rotate(${Math.sin(frame / 12) * 12}deg)` }}>🪶</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 68, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum schwebt die Feder?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Liegt es am Gewicht – oder an der Luft?
      </div>
    </AbsoluteFill>
  );
};

const LuftScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Kraft" title="Luftwiderstand bremst" />
      <div style={{ position: 'absolute', left: 900, top: 420, fontSize: 90, opacity: f }}>📦</div>
      <div style={{ opacity: f }}>
        <ForceArrow x={960} y={640} angleDeg={90} len={200} color={COLORS.sky} label="Fallen" width={10} />
        <ForceArrow x={960} y={400} angleDeg={-90} len={180} color={COLORS.red} label="Luftwiderstand" width={10} />
      </div>
      <Sfx sound="whoosh" at={14} volume={0.3} />
      <Caption delay={30}>Beim Fallen muss der Körper die Luft wegschieben – sie bremst ihn, immer gegen die Bewegung.</Caption>
    </AbsoluteFill>
  );
};

const FederScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stoneY = interpolate(frame, [20, dur - 30], [200, 720], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const featherY = interpolate(frame, [20, dur - 30], [200, 420], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Vergleich" title="Feder gegen Stein" />
      <div style={{ position: 'absolute', left: 640, top: featherY, fontSize: 74, transform: `translateX(${Math.sin(frame / 8) * 24}px)` }}>🪶</div>
      <div style={{ position: 'absolute', left: 1120, top: stoneY, fontSize: 74 }}>🪨</div>
      <div style={{ position: 'absolute', left: 560, top: 800, fontSize: 26, fontWeight: 800, color: COLORS.red }}>große Fläche → stark gebremst</div>
      <div style={{ position: 'absolute', left: 1040, top: 800, fontSize: 26, fontWeight: 800, color: COLORS.green }}>klein & schwer → fällt schnell</div>
      <div style={{ position: 'absolute', left: 300, top: 860, right: 300, height: 6, background: COLORS.muted }} />
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Die Feder hat viel Fläche und wenig Gewicht – die Luft bremst sie stark.</Caption>
    </AbsoluteFill>
  );
};

const VakuumScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [30, dur - 30], [200, 720], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Beweis" title="Im Vakuum – ohne Luft" />
      <div style={{ position: 'absolute', left: 700, top: y, fontSize: 74 }}>🪶</div>
      <div style={{ position: 'absolute', left: 1120, top: y, fontSize: 74 }}>🪨</div>
      <div style={{ position: 'absolute', left: 300, top: 820, right: 300, height: 6, background: COLORS.muted }} />
      <div style={{ position: 'absolute', left: 0, top: 300, width: 1920, textAlign: 'center', fontSize: 34, fontWeight: 900, color: COLORS.green }}>gleich schnell – gemeinsam am Boden</div>
      <Sfx sound="pling" at={30} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5)}>Nimmt man die Luft weg, fallen beide gleich schnell – es lag nie am Gewicht.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Luftwiderstand" footer="ohne Luft fallen alle Körper gleich schnell">
      Der Luftwiderstand bremst jeden fallenden Körper
      <br />
      und wirkt gegen die Bewegung. Er ist größer
      <br />
      bei großer Fläche und hohem Tempo.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Mal viel, mal wenig" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🪂', 'Fallschirm', 'viel Widerstand'], ['🏎️', 'Rennwagen', 'windschnittig'], ['🚴', 'Radprofi', 'geduckt']].map((c, i) => (
          <div key={i} style={{ width: 360, padding: '28px 16px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 74 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.amber, marginTop: 4 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der Fallschirm nutzt viel Widerstand – der Rennwagen möglichst wenig.</Caption>
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
  { id: 'luft', C: LuftScene, min: 240 },
  { id: 'feder', C: FederScene, min: 260 },
  { id: 'vakuum', C: VakuumScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LUFTWIDERSTAND_JG9_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const LuftwiderstandJg9: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LUFTWIDERSTAND_JG9_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/luftwiderstand-jg9/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
