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
import { Spring, useFade } from '../forces';
import timings from '../narration/federgesetz.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const X0 = 620, Y0 = 800, W = 820, H = 500;

const FDGraph: React.FC<{ progress: number; points?: boolean; bend?: boolean }> = ({ progress, points, bend }) => {
  const maxF = 6;
  const endF = maxF * progress;
  const px = (fN: number) => X0 + (fN / maxF) * W;
  const py = (dl: number) => Y0 - dl * (H / maxF);
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={X0} y1={Y0} x2={X0} y2={Y0 - H} stroke={COLORS.muted} strokeWidth={3} />
      <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke={COLORS.muted} strokeWidth={3} />
      <text x={X0 - 130} y={Y0 - H + 6} fontSize={26} fill={COLORS.sky} fontWeight="bold">Dehnung</text>
      <text x={X0 + W} y={Y0 + 46} fontSize={26} fill={COLORS.red} fontWeight="bold">Kraft F</text>
      <line x1={px(0)} y1={py(0)} x2={px(endF)} y2={py(endF)} stroke={COLORS.green} strokeWidth={7} />
      {bend ? <path d={`M ${px(maxF)} ${py(maxF)} Q ${px(maxF + 1.2)} ${py(maxF + 0.6)} ${px(maxF + 2)} ${py(maxF + 0.7)}`} fill="none" stroke={COLORS.red} strokeWidth={6} strokeDasharray="8 6" /> : null}
      {points ? [1, 2, 3, 4, 5].filter((f) => f <= endF).map((f, k) => <circle key={k} cx={px(f)} cy={py(f)} r={9} fill={COLORS.amber} />) : null}
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
      <div style={{ fontSize: 130, marginBottom: 20 }}>🪀📏</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 76, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum dehnt sich die Feder gleichmäßig?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Dahinter steckt das Hookesche Gesetz.
      </div>
    </AbsoluteFill>
  );
};

const MessenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const n = Math.min(3, Math.floor(interpolate(frame, [15, dur - 15], [1, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Gleicher Zuwachs pro Newton" />
      <Spring x={700} y={230} baseLen={160} stretch={n * 90} />
      <div style={{ position: 'absolute', left: 640, top: 230 + 160 + n * 90 + 30, fontSize: 30, fontWeight: 900, color: COLORS.red }}>{n} N</div>
      <div style={{ position: 'absolute', left: 1050, top: 400, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>1 N → +Δ · 2 N → +2Δ · 3 N → +3Δ</div>
      <Sfx sound="pop" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Doppelte Kraft dehnt die Feder um das Doppelte – immer derselbe Zuwachs pro Newton.</Caption>
    </AbsoluteFill>
  );
};

const GeradeScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Kennlinie" title="Eine Gerade durch den Ursprung" />
      <FDGraph progress={p} points />
      <div style={{ position: 'absolute', left: 1250, top: 350, fontSize: 30, fontWeight: 800, color: COLORS.green }}>Dehnung ∝ Kraft</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={Math.round(dur * 0.55)}>Die Messpunkte liegen auf einer Geraden – die Dehnung ist proportional zur Kraft.</Caption>
    </AbsoluteFill>
  );
};

const GrenzeScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Achtung" title="Nur bis zur Grenze" />
      <FDGraph progress={1} bend />
      <div style={{ position: 'absolute', left: 1250, top: 300, fontSize: 28, fontWeight: 800, color: COLORS.red, opacity: f }}>überdehnt → bleibend verformt</div>
      <Sfx sound="impact" at={16} volume={0.34} />
      <Caption delay={40}>Überdehnst du die Feder zu stark, federt sie nicht mehr zurück – die Gerade endet.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Hookesches Gesetz" footer="gilt bis zur Elastizitätsgrenze">
      Die Dehnung ist proportional zur Kraft –
      <br />
      doppelte Kraft, doppelte Dehnung.
      <br />
      Im Diagramm eine Gerade durch den Ursprung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Federn nach Hooke" />
      <div style={{ display: 'flex', gap: 34, opacity: f }}>
        {[['🚗', 'Autofederung'], ['🖊️', 'Kugelschreiber'], ['🤸', 'Trampolin']].map((c, i) => (
          <div key={i} style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Diese Gleichmäßigkeit macht die Feder zum perfekten Messwerkzeug.</Caption>
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
  { id: 'messen', C: MessenScene, min: 240 },
  { id: 'gerade', C: GeradeScene, min: 240 },
  { id: 'grenze', C: GrenzeScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const FEDERGESETZ_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Federgesetz: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={FEDERGESETZ_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/federgesetz/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
