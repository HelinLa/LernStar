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
import { MediaSplit, RefractRay, useFade } from '../refraction';
import timings from '../narration/totalreflexion.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const BOUND = 540;

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 180, marginBottom: 20 }}>💡🔌</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie funktioniert ein Lichtleiter?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Licht kilometerweit durch eine haarfeine Glasfaser – fast verlustfrei.
      </div>
    </AbsoluteFill>
  );
};

// Licht im Glas (unten) trifft von unten auf die Grenzfläche; Winkel steuert Austritt/Reflexion.
const GlasRay: React.FC<{ aIn: number; total: boolean }> = ({ aIn, total }) => {
  const hitX = 960, L = 360;
  const rIn = (aIn * Math.PI) / 180;
  const fromX = hitX - Math.sin(rIn) * L, fromY = BOUND + Math.cos(rIn) * L;
  // Austritt (vom Lot weg, flacher): aOut > aIn
  const aOut = Math.min(89, aIn * 1.5);
  const rOut = (aOut * Math.PI) / 180;
  const outX = hitX + Math.sin(rOut) * L, outY = BOUND - Math.cos(rOut) * L;
  const refX = hitX + Math.sin(rIn) * L, refY = BOUND + Math.cos(rIn) * L;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={hitX} y1={BOUND - L} x2={hitX} y2={BOUND + L} stroke={COLORS.muted} strokeWidth={2} strokeDasharray="8 8" />
      {/* Strahl im Glas hoch zur Grenze */}
      <line x1={fromX} y1={fromY} x2={hitX} y2={BOUND} stroke={COLORS.amber} strokeWidth={5} />
      {!total ? (
        <>
          {/* austretender Strahl (schwächer) */}
          <line x1={hitX} y1={BOUND} x2={outX} y2={outY} stroke={COLORS.green} strokeWidth={4} opacity={0.85} />
          {/* teilreflektiert */}
          <line x1={hitX} y1={BOUND} x2={refX} y2={refY} stroke={COLORS.red} strokeWidth={3} opacity={0.5} />
        </>
      ) : (
        <line x1={hitX} y1={BOUND} x2={refX} y2={refY} stroke={COLORS.red} strokeWidth={6} />
      )}
      <text x={hitX - 100} y={BOUND + 60} fontSize={26} fill={COLORS.amber} fontWeight="bold">{Math.round(aIn)}°</text>
    </svg>
  );
};

const AustrittScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const aIn = interpolate(frame, [15, dur - 20], [25, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Normal" title="Licht tritt aus dem Glas aus" />
      <MediaSplit boundaryY={BOUND} topLabel="Luft" botLabel="Glas" botColor="rgba(148,163,184,0.14)" />
      <GlasRay aIn={aIn} total={false} />
      <div style={{ position: 'absolute', left: 1080, top: 300, fontSize: 26, fontWeight: 800, color: COLORS.green }}>tritt aus (vom Lot weg)</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Je schräger das Licht auftrifft, desto flacher tritt es aus – ein Teil wird reflektiert.</Caption>
    </AbsoluteFill>
  );
};

const GrenzwinkelScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const total = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ab dem Grenzwinkel" title="Totalreflexion" />
      <MediaSplit boundaryY={BOUND} topLabel="Luft" botLabel="Glas" botColor="rgba(148,163,184,0.14)" />
      <GlasRay aIn={total ? 60 : 42} total={total} />
      <div style={{ position: 'absolute', left: 620, top: 250, fontSize: 30, fontWeight: 800, color: total ? COLORS.red : COLORS.amber }}>
        {total ? '❌ kein Austritt → alles reflektiert' : 'Winkel wird größer …'}
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.5)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Ab dem Grenzwinkel tritt gar kein Licht mehr aus – es wird vollständig zurückgeworfen.</Caption>
    </AbsoluteFill>
  );
};

const LichtleiterScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const yTop = 460, yBot = 620;
  const seg = 200;
  const pts: string[] = [];
  for (let x = 200; x <= 1720; x += seg) {
    const up = ((x - 200) / seg) % 2 === 0;
    pts.push(`${x},${up ? yBot : yTop}`);
  }
  const dotProg = (frame % 60) / 60;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Lichtleiter" title="Zickzack durch die Glasfaser" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Faser */}
        <rect x={180} y={yTop - 40} width={1560} height={yBot - yTop + 80} rx={40} fill="rgba(56,189,248,0.10)" stroke={COLORS.sky} strokeWidth={4} />
        {/* Zickzack-Lichtweg */}
        <polyline points={pts.join(' ')} fill="none" stroke={COLORS.amber} strokeWidth={5} />
        {/* laufender Lichtpunkt */}
        {(() => {
          const total = 1720 - 200; const x = 200 + dotProg * total;
          const up = (Math.floor((x - 200) / seg)) % 2 === 0;
          const localT = ((x - 200) % seg) / seg;
          const y = up ? yBot + (yTop - yBot) * localT : yTop + (yBot - yTop) * localT;
          return <circle cx={x} cy={y} r={12} fill="#fde68a" />;
        })()}
        <text x={1560} y={yTop - 60} fontSize={26} fill={COLORS.red} fontWeight="bold">immer Totalreflexion</text>
      </svg>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Das Licht trifft immer so schräg auf, dass es total reflektiert – es bleibt gefangen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Totalreflexion" footer="so bleibt Licht im Lichtleiter gefangen">
      Trifft Licht im Glas ab dem Grenzwinkel
      <br />
      sehr schräg auf die Grenzfläche,
      <br />
      wird es vollständig zurückgeworfen.
    </MerksatzBox>
  </AbsoluteFill>
);

const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Totalreflexion in Technik & Medizin" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="🌐" title="Glasfaser-Internet" delay={10} />
        <TCard icon="🩺" title="Endoskop (Arzt)" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Auf der Totalreflexion beruht das ganze schnelle Internet.</Caption>
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
  { id: 'austritt', C: AustrittScene, min: 240 },
  { id: 'grenzwinkel', C: GrenzwinkelScene, min: 240 },
  { id: 'lichtleiter', C: LichtleiterScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TOTALREFLEXION_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Totalreflexion: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TOTALREFLEXION_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/totalreflexion/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
