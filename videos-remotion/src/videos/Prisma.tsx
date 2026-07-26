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
import { Prism, SPECTRUM, useFade } from '../refraction';
import timings from '../narration/prisma.timings.json';

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
      <div style={{ fontSize: 170, marginBottom: 20 }}>⬜🔺🌈</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was steckt im weißen Licht?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Ein Prisma verrät: Weiß ist gar nicht weiß.
      </div>
    </AbsoluteFill>
  );
};

const PrismaScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [20, dur - 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Weißes Licht durchs Prisma" />
      <Prism cx={860} cy={520} size={190} progress={p} />
      <div style={{ position: 'absolute', left: 340, top: 400, fontSize: 26, fontWeight: 800, color: '#f8fafc' }}>weißes Licht ⬜</div>
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.6)}>Beim Ein- und Austritt wird das Licht gebrochen – und zerfällt in Farben.</Caption>
    </AbsoluteFill>
  );
};

const SpektrumScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const names = ['Rot', 'Orange', 'Gelb', 'Grün', 'Blau', 'Violett'];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Spektrum" title="Rot bis Violett" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 10, opacity: f }}>
          {SPECTRUM.map((c, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: 180, height: 280, background: c, borderRadius: 10 }} />
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{names[i]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Diese Farbfolge – das Spektrum – steckt die ganze Zeit im weißen Licht.</Caption>
    </AbsoluteFill>
  );
};

const WarumScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum trennen sie sich?" title="Verschieden stark gebrochen" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid #ef4444`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>🔴</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: '#ef4444' }}>Rot: am wenigsten gebrochen</div>
          </div>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid #8b5cf6`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>🟣</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: '#8b5cf6' }}>Violett: am stärksten gebrochen</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Weil die Farben unterschiedlich stark abgelenkt werden, laufen sie auseinander.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Prisma & Spektrum" footer="Violett am meisten, Rot am wenigsten gebrochen">
      Ein Prisma zerlegt weißes Licht in
      <br />
      die Spektralfarben Rot bis Violett.
      <br />
      Weiß ist eine Mischung aller Farben.
    </MerksatzBox>
  </AbsoluteFill>
);

const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Aufgefächertes Licht" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🌈" title="Regenbogen" delay={10} />
        <TCard icon="💿" title="Schimmer auf CD" delay={30} />
        <TCard icon="🫧" title="Seifenblase" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall, wo Licht aufgefächert wird, siehst du die Spektralfarben.</Caption>
  </AbsoluteFill>
);

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
  { id: 'prisma', C: PrismaScene, min: 260 },
  { id: 'spektrum', C: SpektrumScene, min: 240 },
  { id: 'warum', C: WarumScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const PRISMA_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Prisma: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={PRISMA_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/prisma/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
