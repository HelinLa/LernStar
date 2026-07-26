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
import timings from '../narration/ohm-kennlinie.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const X0 = 560, Y0 = 820, W = 900, H = 520;

// U-I-Diagramm mit Achsen. slope = I/U (Steigung), progress 0..1, points = Messpunkte anzeigen
const UIGraph: React.FC<{ slope: number; progress: number; points?: boolean; color?: string }> = ({ slope, progress, points = false, color = COLORS.green }) => {
  const maxU = 10;
  const endU = maxU * progress;
  const px = (u: number) => X0 + (u / maxU) * W;
  const py = (i: number) => Y0 - i * (H / (maxU * 0.5));
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={X0} y1={Y0} x2={X0} y2={Y0 - H} stroke={COLORS.muted} strokeWidth={3} />
      <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke={COLORS.muted} strokeWidth={3} />
      <text x={X0 - 60} y={Y0 - H + 6} fontSize={28} fill={COLORS.amber} fontWeight="bold">I</text>
      <text x={X0 + W} y={Y0 + 46} fontSize={28} fill={COLORS.green} fontWeight="bold">U</text>
      {/* Kennlinie (Gerade durch Ursprung) */}
      <line x1={px(0)} y1={py(0)} x2={px(endU)} y2={py(endU * slope)} stroke={color} strokeWidth={7} />
      {/* Messpunkte */}
      {points ? [2, 4, 6, 8].filter((u) => u <= endU).map((u, k) => <circle key={k} cx={px(u)} cy={py(u * slope)} r={9} fill={COLORS.amber} />) : null}
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 150, marginBottom: 20 }}>📈</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Das Ohmsche Gesetz
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Das wichtigste Gesetz – in einem einzigen Diagramm.
      </div>
    </AbsoluteFill>
  );
};

const ProportionalScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Doppelte Spannung → doppelter Strom" />
      <UIGraph slope={0.4} progress={p} points />
      <div style={{ position: 'absolute', left: 1150, top: 350, fontSize: 30, fontWeight: 800, color: COLORS.green }}>U ↑ → I ↑<br />proportional</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.55)}>Erhöhst du die Spannung schrittweise, steigt die Stromstärke im gleichen Maß.</Caption>
    </AbsoluteFill>
  );
};

const KennlinieScene: React.FC<SceneProps> = () => {
  const f = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Kennlinie" title="Eine Gerade durch den Ursprung" />
      <UIGraph slope={0.4} progress={1} points />
      <div style={{ position: 'absolute', left: 1150, top: 400, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: f }}>alle Punkte auf<br />einer Geraden</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Alle Messpunkte liegen auf einer Geraden durch den Ursprung – die U-I-Kennlinie.</Caption>
    </AbsoluteFill>
  );
};

const KonstantScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Kern" title="U / I bleibt konstant = R" />
      <div style={{ fontSize: 90, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.green }}>U</span> = <span style={{ color: COLORS.sky }}>R</span> · <span style={{ color: COLORS.amber }}>I</span>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>egal welcher Punkt: U ÷ I ergibt immer denselben Widerstand</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Teilst du an jedem Punkt U durch I, kommt immer derselbe Widerstand heraus.</Caption>
    </AbsoluteFill>
  );
};

const SteigungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const steep = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Steigung" title={steep ? 'Steil → kleiner R' : 'Flach → großer R'} />
      <UIGraph slope={steep ? 0.8 : 0.25} progress={1} color={steep ? COLORS.green : COLORS.red} />
      <div style={{ position: 'absolute', left: 1150, top: 400, fontSize: 30, fontWeight: 800, color: steep ? COLORS.green : COLORS.red }}>{steep ? 'viel Strom bei wenig U' : 'wenig Strom trotz viel U'}</div>
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Flache Gerade heißt großer Widerstand, steile Gerade kleiner Widerstand.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Ohmsches Gesetz" footer="gilt bei konstanter Temperatur">
      Bei festem R ist I proportional zu U.
      <br />
      Die U-I-Kennlinie ist eine Gerade
      <br />
      durch den Ursprung: U = R · I.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übertragen" title="Nicht alles ist ohmsch" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <svg style={{ opacity: f }} width={700} height={420} viewBox="0 0 700 420">
          <line x1={60} y1={380} x2={60} y2={20} stroke={COLORS.muted} strokeWidth={3} />
          <line x1={60} y1={380} x2={660} y2={380} stroke={COLORS.muted} strokeWidth={3} />
          <path d="M 60 380 Q 400 300 640 120" fill="none" stroke={COLORS.red} strokeWidth={6} />
        </svg>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 1180, top: 480, fontSize: 30, fontWeight: 800, color: COLORS.red }}>💡 Glühlampe:<br />gekrümmte Kennlinie</div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Bei der Glühlampe krümmt sich die Kennlinie – der heiße Draht ändert seinen Widerstand.</Caption>
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
  { id: 'proportional', C: ProportionalScene, min: 260 },
  { id: 'kennlinie', C: KennlinieScene, min: 240 },
  { id: 'konstant', C: KonstantScene, min: 240 },
  { id: 'steigung', C: SteigungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const OHM_KENNLINIE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const OhmKennlinie: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={OHM_KENNLINIE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/ohm-kennlinie/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
