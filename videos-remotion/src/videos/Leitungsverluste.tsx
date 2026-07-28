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
import { useFade } from '../magnet';
import timings from '../narration/leitungsverluste.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Lange Leitung mit fließenden Strom-Punkten; erwärmt sich je nach loss (0..1).
const HeatLine: React.FC<{ y?: number; loss: number; dots?: number }> = ({ y = 520, loss, dots = 10 }) => {
  const frame = useCurrentFrame();
  const glow = Math.max(0, Math.min(1, loss));
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Kraftwerk links, Stadt rechts */}
      <text x={200} y={y + 10} fontSize={80} textAnchor="middle">🏭</text>
      <text x={1720} y={y + 10} fontSize={80} textAnchor="middle">🏙️</text>
      {/* Leitung */}
      <line x1={280} y1={y} x2={1640} y2={y} stroke="#334155" strokeWidth={20} strokeLinecap="round" />
      <line x1={280} y1={y} x2={1640} y2={y} stroke={`rgba(239,68,68,${0.15 + glow * 0.85})`} strokeWidth={12} strokeLinecap="round" />
      {/* Strom-Punkte */}
      {Array.from({ length: dots }).map((_, i) => {
        const p = ((frame * 6 + i * (1360 / dots)) % 1360);
        return <circle key={i} cx={280 + p} cy={y} r={7} fill="#fff" />;
      })}
      {/* Wärmewellen */}
      {glow > 0.15 &&
        [420, 700, 980, 1260].map((x, i) => (
          <path key={i} d={`M ${x} ${y - 20} q 12 -26 0 -50 q -12 -24 0 -48`} fill="none" stroke={COLORS.amber} strokeWidth={3} opacity={0.4 + glow * 0.4 + Math.sin((frame + i * 8) / 6) * 0.15} />
        ))}
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
      <div style={{ fontSize: 110 }}>🏭〰️🏙️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum geht auf langen Leitungen Energie verloren?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Leitungsverluste
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const loss = interpolate(frame, [30, 110], [0.1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Die Leitung wird warm" />
      <HeatLine y={540} loss={loss} />
      <div style={{ position: 'absolute', left: 560, top: 620, width: 800, textAlign: 'center', fontSize: 28, fontWeight: 800, color: loss > 0.4 ? COLORS.amber : COLORS.muted }}>
        {loss > 0.4 ? '🔥 ein Teil der Energie wird als Wärme abgegeben' : 'Strom fließt zur Stadt'}
      </div>
      <Caption delay={30}>Fließt Strom durch eine lange Leitung, erwärmt sie sich. Diese Wärme ist verlorene Energie – sie kommt nie in der Stadt an.</Caption>
    </AbsoluteFill>
  );
};

const WarumScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Ursache" title="Jede Leitung hat einen Widerstand" />
      <HeatLine y={470} loss={0.6} />
      <div style={{ position: 'absolute', left: 360, top: 560, width: 1200, textAlign: 'center', opacity: f }}>
        <div style={{ display: 'inline-block', padding: '20px 30px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 40, fontWeight: 900 }}>
          Verlustleistung P = R · I²
        </div>
        <div style={{ marginTop: 18, fontSize: 26, fontWeight: 800, color: COLORS.muted }}>
          R = Widerstand der Leitung · I = Stromstärke. Je länger und dünner das Kabel, desto größer R und desto mehr Verlust.
        </div>
      </div>
      <Caption delay={30}>Der Grund ist der Widerstand der Leitung. An ihm wird Energie in Wärme umgewandelt – nach der Formel P gleich R mal I zum Quadrat.</Caption>
    </AbsoluteFill>
  );
};

const StromScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const doubled = frame > 90;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
      <SceneTitle kicker="Der Knackpunkt" title="Doppelter Strom – vierfacher Verlust" />
      <div style={{ display: 'flex', gap: 120, alignItems: 'flex-end', marginBottom: 210, opacity: f }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 150, height: 120, borderRadius: 14, background: COLORS.panel, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'flex-end', overflow: 'hidden', margin: '0 auto' }}>
            <div style={{ width: '100%', height: '25%', background: COLORS.green }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 14 }}>Strom I</div>
          <div style={{ fontSize: 22, color: COLORS.muted }}>Verlust: 1×</div>
        </div>
        <div style={{ fontSize: 50, marginBottom: 60 }}>➡️</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 150, height: 420, borderRadius: 14, background: COLORS.panel, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'flex-end', overflow: 'hidden', margin: '0 auto' }}>
            <div style={{ width: '100%', height: `${doubled ? 100 : 25}%`, background: COLORS.red }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 14 }}>2 · I</div>
          <div style={{ fontSize: 22, color: COLORS.red, fontWeight: 800 }}>Verlust: {doubled ? '4×' : '…'}</div>
        </div>
      </div>
      <Sfx sound="pop" at={90} volume={0.34} />
      <Caption delay={30}>Weil das I im Quadrat steht, ist der Verlust bei doppeltem Strom nicht doppelt, sondern viermal so groß. Die Stromstärke ist entscheidend.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Leitungsverluste" footer="P = R · I² – die Stromstärke zählt doppelt">
      Am Widerstand der Leitung geht Energie
      <br />
      als Wärme verloren. Viel Strom = viel Verlust.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wie vermeidet man den Verlust?" />
      <div style={{ opacity: f, marginTop: 40, width: 1300, textAlign: 'center' }}>
        <div style={{ fontSize: 70 }}>🔌⚡</div>
        <div style={{ padding: '26px 34px', borderRadius: 18, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 34, fontWeight: 900, marginTop: 20 }}>
          Man muss die Stromstärke klein halten – und genau das schafft man mit hoher Spannung.
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der Trick liegt darin, die Stromstärke gering zu halten. Wie das mit Hochspannung gelingt, zeigt der nächste Schritt.</Caption>
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
  { id: 'intro', C: Intro, min: 150 },
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'warum', C: WarumScene, min: 250 },
  { id: 'strom', C: StromScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LEITUNGSVERLUSTE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Leitungsverluste: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LEITUNGSVERLUSTE_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/leitungsverluste/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
