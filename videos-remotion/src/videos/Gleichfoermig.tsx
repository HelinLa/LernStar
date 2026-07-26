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
import timings from '../narration/gleichfoermig.timings.json';

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
  const x = (frame * 6) % 1400;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 200, left: 200 + x, fontSize: 90 }}>🚗</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die gleichförmige Bewegung
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Die einfachste Bewegung – mit konstanter Geschwindigkeit.
      </div>
    </AbsoluteFill>
  );
};

const KonstantScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = 200 + ((frame * 8) % 1300);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Kern" title="Geschwindigkeit bleibt gleich" />
      <div style={{ position: 'absolute', left: x, top: 480, fontSize: 80 }}>🚗</div>
      <div style={{ position: 'absolute', left: 200, top: 580, width: 1300, height: 3, background: COLORS.border }} />
      <div style={{ position: 'absolute', left: 640, top: 700, fontSize: 34, fontWeight: 900, color: COLORS.green }}>v = konstant · weder schneller noch langsamer</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption>Bei der gleichförmigen Bewegung bleibt die Geschwindigkeit die ganze Zeit gleich.</Caption>
    </AbsoluteFill>
  );
};

const StreckenScene: React.FC<SceneProps> = () => {
  const f = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Woran erkennt man's?" title="Gleiche Zeiten, gleiche Strecken" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: f }} viewBox="0 0 1920 1080">
        <line x1={200} y1={560} x2={1720} y2={560} stroke={COLORS.border} strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((i) => (
          <React.Fragment key={i}>
            <line x1={280 + i * 300} y1={540} x2={280 + i * 300} y2={580} stroke={COLORS.amber} strokeWidth={4} />
            <text x={280 + i * 300 - 10} y={620} fontSize={26} fill={COLORS.amber} fontWeight="bold">{i}s</text>
          </React.Fragment>
        ))}
        <text x={880} y={490} fontSize={30} fill={COLORS.green} fontWeight="bold" textAnchor="middle">alle Abstände gleich groß</text>
      </svg>
      <div style={{ position: 'absolute', left: 250, top: 480, fontSize: 60 }}>🚗</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>In gleichen Zeitabschnitten legt der Körper immer gleich große Strecken zurück.</Caption>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Formel" title="s = v · t" />
      <div style={{ fontSize: 130, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.sky }}>s</span> = <span style={{ color: COLORS.green }}>v</span> · <span style={{ color: COLORS.amber }}>t</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>doppelte Zeit → doppelte Strecke</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Weil v konstant ist, gilt: Strecke gleich Geschwindigkeit mal Zeit.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Gleichförmige Bewegung" footer="s = v · t">
      Die Geschwindigkeit ist konstant.
      <br />
      In gleichen Zeiten werden gleiche
      <br />
      Strecken zurückgelegt.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Tempomat & Lichtstrahl" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🚗', 'Auto mit Tempomat'], ['💡', 'Licht im Weltall']].map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Licht bewegt sich immer gleichförmig – mit konstanter Geschwindigkeit.</Caption>
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
  { id: 'konstant', C: KonstantScene, min: 220 },
  { id: 'strecken', C: StreckenScene, min: 240 },
  { id: 'formel', C: FormelScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const GLEICHFOERMIG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Gleichfoermig: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={GLEICHFOERMIG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/gleichfoermig/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
