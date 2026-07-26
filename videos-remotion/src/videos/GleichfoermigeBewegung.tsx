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
import timings from '../narration/gleichfoermige-bewegung.timings.json';

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
  const roboX = interpolate(frame % 130, [0, 130], [400, 1400]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 180, left: roboX, fontSize: 90 }}>🤖</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 74, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die gleichförmige Bewegung
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Immer gleich schnell – wie mit Tempomat.
      </div>
    </AbsoluteFill>
  );
};

const DefinitionScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Was heißt das?" title="Geschwindigkeit bleibt konstant" />
      <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.green, opacity: f }}>v = konstant</div>
      <div style={{ marginTop: 24, fontSize: 36, fontWeight: 800, color: COLORS.ink, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Gleiche Strecken in gleichen Zeiten – in jeder Sekunde kommt dasselbe Wegstück dazu.
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Nicht schneller, nicht langsamer: Das Tempo ändert sich nicht.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [20, dur - 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x0 = 340, span = 1200;
  const robo = x0 + span * p;
  const marks = [0, 0.33, 0.66, 1];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="Jede Sekunde 2 Meter" />
      <div style={{ position: 'absolute', left: robo - 30, top: 500, fontSize: 70 }}>🤖</div>
      <div style={{ position: 'absolute', left: x0, top: 600, width: span, height: 4, background: COLORS.muted }} />
      {marks.map((m, i) => (
        <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: x0 + span * m - 2, top: 588, width: 4, height: 28, background: COLORS.muted }} />
          <div style={{ position: 'absolute', left: x0 + span * m - 30, top: 636, width: 60, textAlign: 'center', fontSize: 24, fontWeight: 800, color: COLORS.amber }}>{i} s</div>
          <div style={{ position: 'absolute', left: x0 + span * m - 30, top: 552, width: 60, textAlign: 'center', fontSize: 24, fontWeight: 800, color: COLORS.sky }}>{i * 2} m</div>
        </React.Fragment>
      ))}
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Nach 1 s bei 2 m, nach 2 s bei 4 m, nach 3 s bei 6 m – immer der gleiche Zuwachs.</Caption>
    </AbsoluteFill>
  );
};

const DiagrammScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x0 = 520, y0 = 800, w = 860, h = 520;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Im Diagramm" title="Eine Gerade" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={x0} y1={y0} x2={x0} y2={y0 - h} stroke={COLORS.muted} strokeWidth={3} />
        <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={COLORS.muted} strokeWidth={3} />
        <text x={x0 - 60} y={y0 - h + 10} fontSize={28} fill={COLORS.sky} fontWeight="bold">s</text>
        <text x={x0 + w} y={y0 + 44} fontSize={28} fill={COLORS.amber} fontWeight="bold">t</text>
        <line x1={x0} y1={y0} x2={x0 + w * p} y2={y0 - h * p} stroke={COLORS.green} strokeWidth={8} />
      </svg>
      <div style={{ position: 'absolute', left: 1050, top: 380, fontSize: 30, fontWeight: 800, color: COLORS.green }}>Gerade = gleichförmig<br />steiler = schneller<br />Steigung = v</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.55)}>Die Messpunkte liegen auf einer Geraden – ihre Steigung ist die Geschwindigkeit.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Gleichförmige Bewegung" footer="Steigung der Geraden = Geschwindigkeit">
      Die Geschwindigkeit ist konstant.
      <br />
      Gleiche Strecken in gleichen Zeiten.
      <br />
      Im s-t-Diagramm eine Gerade.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Gleichmäßig unterwegs" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🚆', 'Zug mit Tempomat'], ['🛗', 'Rolltreppe'], ['📦', 'Förderband']].map((c, i) => (
          <div key={i} style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Zug, Rolltreppe, Förderband – überall bewegt sich etwas mit gleichbleibendem Tempo.</Caption>
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
  { id: 'definition', C: DefinitionScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 260 },
  { id: 'diagramm', C: DiagrammScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const GLEICHFOERMIGE_BEWEGUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const GleichfoermigeBewegung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={GLEICHFOERMIGE_BEWEGUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/gleichfoermige-bewegung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
