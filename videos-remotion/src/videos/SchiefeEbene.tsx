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
import timings from '../narration/schiefe-ebene.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Rampe: Basis bei (bx,by), Länge run nach rechts, Höhe rise nach oben. Optional Ball bei progress.
const Ramp: React.FC<{ bx: number; by: number; run: number; rise: number; label?: string; progress?: number; force?: string; color?: string }> = ({ bx, by, run, rise, label, progress = 0, force, color = COLORS.sky }) => {
  const topX = bx + run, topY = by - rise;
  const px = bx + (topX - bx) * progress;
  const py = by + (topY - by) * progress;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <polygon points={`${bx},${by} ${topX},${by} ${topX},${topY}`} fill={`${color}33`} stroke={color} strokeWidth={4} />
      <line x1={topX} y1={by} x2={topX} y2={topY} stroke={COLORS.muted} strokeWidth={2} strokeDasharray="6 6" />
      <text x={topX + 14} y={(by + topY) / 2} fontSize={26} fill={COLORS.muted}>Höhe</text>
      <circle cx={px} cy={py - 18} r={22} fill={COLORS.amber} />
      {force ? <text x={bx + 20} y={by + 46} fontSize={30} fill={color} fontWeight="bold">{force}</text> : null}
      {label ? <text x={bx + run / 2 - 40} y={by + 46} fontSize={28} fill={COLORS.ink} fontWeight="bold">{label}</text> : null}
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
      <div style={{ fontSize: 150, marginBottom: 20 }}>🪨📐</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum ist die Rampe leichter?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Über eine Rampe rollt der Stein mühelos hoch.
      </div>
    </AbsoluteFill>
  );
};

const KraftwandlerScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [20, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Kraftwandler" title="Kraft sparen, Weg verlängern" />
      <Ramp bx={560} by={780} run={800} rise={340} progress={p} force="weniger Kraft" color={COLORS.green} />
      <Sfx sound="whoosh" at={20} volume={0.32} />
      <Caption delay={Math.round(dur * 0.45)}>Die schiefe Ebene verringert die nötige Kraft – dafür wird der Weg länger.</Caption>
    </AbsoluteFill>
  );
};

const FlachScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleich" title="Steil oder flach?" />
      <div style={{ opacity: f }}>
        <Ramp bx={220} by={640} run={320} rise={300} color={COLORS.red} />
        <Ramp bx={960} by={640} run={780} rise={180} color={COLORS.green} />
      </div>
      <div style={{ position: 'absolute', left: 220, top: 300, width: 320, textAlign: 'center', fontSize: 30, fontWeight: 900, color: COLORS.red, opacity: f }}>steil</div>
      <div style={{ position: 'absolute', left: 960, top: 380, width: 780, textAlign: 'center', fontSize: 30, fontWeight: 900, color: COLORS.green, opacity: f }}>flach</div>
      <div style={{ position: 'absolute', left: 180, top: 690, width: 420, textAlign: 'center', fontSize: 26, fontWeight: 800, color: COLORS.red, opacity: f }}>viel Kraft · kurzer Weg</div>
      <div style={{ position: 'absolute', left: 960, top: 690, width: 780, textAlign: 'center', fontSize: 26, fontWeight: 800, color: COLORS.green, opacity: f }}>wenig Kraft · langer Weg</div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={30}>Je flacher die Rampe, desto weniger Kraft brauchst du – dafür einen längeren Weg.</Caption>
    </AbsoluteFill>
  );
};

const ArbeitScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Bleibt gleich" title="Arbeit = Kraft · Weg" />
      <div style={{ opacity: f, textAlign: 'center' }}>
        <div style={{ fontSize: 90, fontWeight: 900, color: COLORS.amber }}>W = F · s</div>
        <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.green }}>viel Kraft · kurz = wenig Kraft · lang</div>
        <div style={{ marginTop: 12, fontSize: 30, fontWeight: 700, color: COLORS.muted }}>die Rampe schenkt dir keine Energie</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.45} />
      <Caption delay={40}>Kraft mal Weg bleibt immer gleich – die Rampe verteilt die Anstrengung nur auf einen längeren Weg.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Schiefe Ebene" footer="die Arbeit bleibt gleich">
      Die schiefe Ebene ist ein Kraftwandler.
      <br />
      Je flacher die Rampe, desto weniger Kraft –
      <br />
      dafür einen längeren Weg.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Rampen überall" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['♿', 'Rollstuhlrampe'], ['🏔️', 'Serpentinen'], ['🛢️', 'Fass verladen']].map((c, i) => (
          <div key={i} style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Rollstuhlrampen, Bergserpentinen, Verladerampen – alle sparen Kraft durch einen längeren Weg.</Caption>
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
  { id: 'kraftwandler', C: KraftwandlerScene, min: 240 },
  { id: 'flach', C: FlachScene, min: 260 },
  { id: 'arbeit', C: ArbeitScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SCHIEFE_EBENE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const SchiefeEbene: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SCHIEFE_EBENE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/schiefe-ebene/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
