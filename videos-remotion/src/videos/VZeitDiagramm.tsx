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
import timings from '../narration/v-zeit-diagramm.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const X0 = 560, Y0 = 820, W = 900, H = 520;

// v-t Achsen + Linie aus Punkten [t(0..1), v(0..1)]
const VTGraph: React.FC<{ pts: [number, number][]; color?: string }> = ({ pts, color = COLORS.green }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <line x1={X0} y1={Y0} x2={X0} y2={Y0 - H} stroke={COLORS.muted} strokeWidth={3} />
    <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke={COLORS.muted} strokeWidth={3} />
    <text x={X0 - 90} y={Y0 - H + 6} fontSize={26} fill={COLORS.green} fontWeight="bold">v (Tempo)</text>
    <text x={X0 + W} y={Y0 + 46} fontSize={26} fill={COLORS.amber} fontWeight="bold">t (Zeit)</text>
    <polyline points={pts.map(([t, v]) => `${X0 + t * W},${Y0 - v * H}`).join(' ')} fill="none" stroke={color} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 150, marginBottom: 20 }}>📊</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 74, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Das Geschwindigkeit-Zeit-Diagramm
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Sieht ähnlich aus wie das s-t-Diagramm – sagt aber etwas anderes!
      </div>
    </AbsoluteFill>
  );
};

const AchsenScene: React.FC<SceneProps> = () => {
  const p = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Achsen" title="Senkrecht: die Geschwindigkeit" />
      <VTGraph pts={[[0, 0.5], [1, 0.5]]} />
      <div style={{ position: 'absolute', left: 1150, top: 380, fontSize: 28, fontWeight: 800, color: COLORS.green, opacity: p }}>senkrecht = v (nicht der Weg!)</div>
      <Sfx sound="whoosh" at={16} volume={0.3} />
      <Caption delay={30}>Zeit waagerecht – aber senkrecht steht diesmal die Geschwindigkeit.</Caption>
    </AbsoluteFill>
  );
};

const LinienScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const phase = frame < dur * 0.33 ? 0 : frame < dur * 0.66 ? 1 : 2;
  const data: [number, number][][] = [[[0, 0.5], [1, 0.5]], [[0, 0.2], [1, 0.9]], [[0, 0.9], [1, 0.2]]];
  const labels = ['waagerecht → konstant', 'steigend → beschleunigen', 'fallend → bremsen'];
  const cols = [COLORS.sky, COLORS.green, COLORS.red];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Drei Formen" title={labels[phase]} />
      <VTGraph pts={data[phase]} color={cols[phase]} />
      <Sfx sound="pop" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.4)}>Waagerecht ist konstant, ansteigend ist beschleunigen, fallend ist bremsen.</Caption>
    </AbsoluteFill>
  );
};

const AchtungScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Aufgepasst!" title="Waagerecht ≠ Stillstand" />
      <VTGraph pts={[[0, 0.55], [1, 0.55]]} color={COLORS.sky} />
      <div style={{ position: 'absolute', left: 700, top: 300, fontSize: 30, fontWeight: 800, color: COLORS.red, opacity: f }}>waagerecht im v-t = konstantes Tempo (fährt!)</div>
      <div style={{ position: 'absolute', left: 700, top: 370, fontSize: 26, fontWeight: 700, color: COLORS.muted, opacity: f }}>nur auf der Nulllinie steht der Körper</div>
      <Sfx sound="impact" at={16} volume={0.36} />
      <Caption delay={40}>Achtung: Eine waagerechte Linie im v-t-Diagramm heißt Fahren mit konstantem Tempo – nicht Stillstand.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="v-t-Diagramm" footer="waagerecht = konstantes Tempo, nicht Stillstand">
      Senkrecht steht die Geschwindigkeit.
      <br />
      Waagerecht = konstant, steigend =
      <br />
      beschleunigen, fallend = bremsen.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Jede Fahrsituation lesen" />
      <div style={{ fontSize: 150, opacity: f }}>🚦↗️ · 🛣️→ · 🛑↘️</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Anfahren steigend, Landstraße waagerecht, Bremsen vor der Kurve fallend.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Am Verlauf der Linie erkennst du jede Fahrsituation.</Caption>
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
  { id: 'linien', C: LinienScene, min: 280 },
  { id: 'achtung', C: AchtungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const V_ZEIT_DIAGRAMM_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const VZeitDiagramm: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={V_ZEIT_DIAGRAMM_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/v-zeit-diagramm/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
