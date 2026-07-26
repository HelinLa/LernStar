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
import { useFade } from '../electric';
import timings from '../narration/draht.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Wire: React.FC<{ x: number; y: number; len: number; thick: number; color?: string }> = ({ x, y, len, thick, color = '#f59e0b' }) => (
  <div style={{ position: 'absolute', left: x, top: y - thick / 2, width: len, height: thick, borderRadius: thick / 2, background: `linear-gradient(180deg, ${color}, ${color}aa)` }} />
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 150, marginBottom: 20 }}>🧵⚡</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 74, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wovon hängt der Drahtwiderstand ab?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Drei Dinge entscheiden, wie stark ein Draht bremst.
      </div>
    </AbsoluteFill>
  );
};

const LaengeScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 1" title="Länge: lang → großer R" />
      <div style={{ opacity: f }}>
        <Wire x={360} y={440} len={300} thick={40} />
        <div style={{ position: 'absolute', left: 660, top: 425, fontSize: 30, fontWeight: 800, color: COLORS.green }}>kurz → kleiner R</div>
        <Wire x={360} y={640} len={900} thick={40} />
        <div style={{ position: 'absolute', left: 1280, top: 625, fontSize: 30, fontWeight: 800, color: COLORS.red }}>lang → großer R</div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Ein langer Draht bremst mehr – der Strom wird auf der ganzen Strecke gebremst.</Caption>
    </AbsoluteFill>
  );
};

const DickeScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 2" title="Dicke: dünn → großer R" />
      <div style={{ opacity: f }}>
        <Wire x={500} y={440} len={700} thick={14} />
        <div style={{ position: 'absolute', left: 1220, top: 425, fontSize: 30, fontWeight: 800, color: COLORS.red }}>dünn → großer R</div>
        <Wire x={500} y={660} len={700} thick={70} />
        <div style={{ position: 'absolute', left: 1220, top: 640, fontSize: 30, fontWeight: 800, color: COLORS.green }}>dick → kleiner R</div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Ein dicker Draht bietet mehr Platz – wie ein breites Rohr für Wasser.</Caption>
    </AbsoluteFill>
  );
};

const MaterialScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 3" title="Material" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>🟠</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>Kupfer: leitet gut → kleiner R</div>
          </div>
          <div style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>⚙️</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>Konstantan: leitet schlecht → großer R</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Kupfer leitet hervorragend, Konstantan schlecht – deshalb Kabel aus Kupfer, Heizdraht aus Konstantan.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Drahtwiderstand" footer="Kupfer leitet gut, Konstantan schlecht">
      Länger oder dünner → größerer Widerstand.
      <br />
      Außerdem entscheidet das Material.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Kabel vs. Heizdraht" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🔌', 'dickes Kupferkabel: kaum Widerstand'], ['🍞', 'dünner Heizdraht: heizt richtig auf']].map((c, i) => (
          <div key={i} style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${i === 0 ? COLORS.green : COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der Toaster-Heizdraht ist dünn und schlecht leitend – damit er heiß wird.</Caption>
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
  { id: 'laenge', C: LaengeScene, min: 240 },
  { id: 'dicke', C: DickeScene, min: 240 },
  { id: 'material', C: MaterialScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const DRAHT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Draht: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={DRAHT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/draht/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
