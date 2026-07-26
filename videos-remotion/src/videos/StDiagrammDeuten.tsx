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
import timings from '../narration/s-t-diagramm-deuten.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const X0 = 620, Y0 = 800, W = 760, H = 520;

const Axes: React.FC = () => (
  <>
    <line x1={X0} y1={Y0} x2={X0} y2={Y0 - H} stroke={COLORS.muted} strokeWidth={3} />
    <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke={COLORS.muted} strokeWidth={3} />
    <text x={X0 - 60} y={Y0 - H + 10} fontSize={30} fill={COLORS.sky} fontWeight="bold">s</text>
    <text x={X0 + W + 6} y={Y0 + 44} fontSize={30} fill={COLORS.amber} fontWeight="bold">t</text>
  </>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 130, marginBottom: 20 }}>📈</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 72, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Das s-t-Diagramm deuten
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Die Form der Linie verrät, was der Körper tut.
      </div>
    </AbsoluteFill>
  );
};

const AchsenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Achsen" title="Zeit nach rechts, Weg nach oben" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: f }} viewBox="0 0 1920 1080">
        <Axes />
        <text x={X0 - 120} y={Y0 - H / 2} fontSize={26} fill={COLORS.sky}>Weg</text>
        <text x={X0 + W / 2 - 40} y={Y0 + 80} fontSize={26} fill={COLORS.amber}>Zeit</text>
      </svg>
      <Sfx sound="whoosh" at={14} volume={0.3} />
      <Caption delay={30}>Jeder Punkt sagt dir: Zu dieser Zeit war der Körper genau hier.</Caption>
    </AbsoluteFill>
  );
};

const LineScene: React.FC<{ dur: number; kicker: string; title: string; color: string; d: (p: number) => string; note: string; cap: string; sfxAt: number }> = ({ dur, kicker, title, color, d, note, cap, sfxAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker={kicker} title={title} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <Axes />
        <path d={d(p)} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', left: 1440, top: 420, width: 380, fontSize: 32, fontWeight: 900, color }}>{note}</div>
      <Sfx sound="pop" at={sfxAt} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>{cap}</Caption>
    </AbsoluteFill>
  );
};

const WaagerechtScene: React.FC<SceneProps> = ({ dur }) => (
  <LineScene dur={dur} kicker="Fall 1" title="Waagerechte Linie" color={COLORS.red}
    d={(p) => `M ${X0} ${Y0 - H * 0.55} L ${X0 + W * p} ${Y0 - H * 0.55}`}
    note="Stillstand — der Körper steht" cap="Waagerecht bedeutet: Der Weg ändert sich nicht – der Körper steht still." sfxAt={15} />
);

const GeradeScene: React.FC<SceneProps> = ({ dur }) => (
  <LineScene dur={dur} kicker="Fall 2" title="Ansteigende Gerade" color={COLORS.green}
    d={(p) => `M ${X0} ${Y0} L ${X0 + W * p} ${Y0 - H * p}`}
    note="gleichförmig — je steiler, desto schneller" cap="Eine ansteigende Gerade heißt gleichförmig. Je steiler, desto schneller." sfxAt={15} />
);

const KurveScene: React.FC<SceneProps> = ({ dur }) => (
  <LineScene dur={dur} kicker="Fall 3" title="Nach oben gekrümmte Kurve" color={COLORS.amber}
    d={(p) => {
      const n = 40;
      let path = `M ${X0} ${Y0}`;
      for (let i = 1; i <= n * p; i++) {
        const tt = i / n;
        path += ` L ${X0 + W * tt} ${Y0 - H * tt * tt}`;
      }
      return path;
    }}
    note="beschleunigt — immer schneller" cap="Wird die Linie immer steiler, beschleunigt der Körper – er wird immer schneller." sfxAt={15} />
);

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="s-t-Diagramm lesen" footer="die Form der Linie verrät die Bewegung">
      Waagerecht = Stillstand.
      <br />
      Gerade = gleichförmig (steiler = schneller).
      <br />
      Gekrümmte Kurve = beschleunigt.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Ein Blick genügt" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🚦', 'Verkehrsforschung'], ['🏃', 'Trainer & Sport'], ['🔬', 'Physik-Experiment']].map((c, i) => (
          <div key={i} style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Wer die Kurve liest, sieht sofort, was gerade passiert.</Caption>
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
  { id: 'achsen', C: AchsenScene, min: 220 },
  { id: 'waagerecht', C: WaagerechtScene, min: 220 },
  { id: 'gerade', C: GeradeScene, min: 240 },
  { id: 'kurve', C: KurveScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ST_DIAGRAMM_DEUTEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const StDiagrammDeuten: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ST_DIAGRAMM_DEUTEN_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/s-t-diagramm-deuten/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
