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
import { useFade } from '../refraction';
import timings from '../narration/spiegelbild.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const MIRROR_X = 960;

const MirrorScene: React.FC<{ showRays?: boolean; showVirtual?: boolean; progress?: number }> = ({ showRays, showVirtual, progress = 1 }) => {
  const objX = 620, objY = 540, eyeX = 660, eyeY = 760;
  const hitY = 460; // Reflexionspunkt am Spiegel
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Spiegel */}
      <rect x={MIRROR_X} y={200} width={16} height={680} fill="url(#mg)" />
      <defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e2e8f0" /><stop offset="1" stopColor="#64748b" /></linearGradient></defs>
      {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={MIRROR_X + 16} y1={220 + i * 48} x2={MIRROR_X + 40} y2={200 + i * 48} stroke={COLORS.muted} strokeWidth={2} />)}
      {/* Objekt */}
      <line x1={objX} y1={objY + 80} x2={objX} y2={objY - 80} stroke={COLORS.green} strokeWidth={7} />
      <polygon points={`${objX - 14},${objY - 60} ${objX + 14},${objY - 60} ${objX},${objY - 80}`} fill={COLORS.green} />
      {showRays ? (
        <>
          {/* Strahl Objekt → Spiegel → Auge */}
          <line x1={objX} y1={objY - 80} x2={MIRROR_X} y2={hitY} stroke={COLORS.amber} strokeWidth={4} />
          <line x1={MIRROR_X} y1={hitY} x2={eyeX} y2={eyeY} stroke={COLORS.green} strokeWidth={4} />
          {/* Rückverlängerung ins Virtuelle */}
          {showVirtual ? <line x1={MIRROR_X} y1={hitY} x2={MIRROR_X + (MIRROR_X - objX)} y2={objY - 80} stroke={COLORS.muted} strokeWidth={3} strokeDasharray="8 8" opacity={progress} /> : null}
        </>
      ) : null}
      {/* virtuelles Bild */}
      {showVirtual ? (
        <g opacity={0.6 * progress}>
          <line x1={MIRROR_X + (MIRROR_X - objX)} y1={objY + 80} x2={MIRROR_X + (MIRROR_X - objX)} y2={objY - 80} stroke={COLORS.indigo} strokeWidth={7} strokeDasharray="8 6" />
          <polygon points={`${MIRROR_X + (MIRROR_X - objX) - 14},${objY - 60} ${MIRROR_X + (MIRROR_X - objX) + 14},${objY - 60} ${MIRROR_X + (MIRROR_X - objX)},${objY - 80}`} fill={COLORS.indigo} />
        </g>
      ) : null}
      {/* Auge */}
      <text x={eyeX - 20} y={eyeY + 40} fontSize={50}>👁️</text>
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
      <div style={{ display: 'flex', gap: 20, marginBottom: 30, fontSize: 150 }}>
        <div>🧍</div><div style={{ opacity: 0.5 }}>🪞</div><div style={{ transform: 'scaleX(-1)', opacity: 0.6 }}>🧍</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie entsteht ein Spiegelbild?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Du siehst dich hinter dem Glas – wo doch nichts ist.
      </div>
    </AbsoluteFill>
  );
};

const ReflexionScene: React.FC<SceneProps> = ({ dur }) => (
  <AbsoluteFill>
    <SceneTitle kicker="Das Licht" title="Reflexion ins Auge" />
    <MirrorScene showRays />
    <div style={{ position: 'absolute', left: 300, top: 300, fontSize: 26, fontWeight: 800, color: COLORS.amber }}>Einfallswinkel = Reflexionswinkel</div>
    <Sfx sound="whoosh" at={10} volume={0.3} />
    <Caption>Licht von dir wird am Spiegel reflektiert und trifft in dein Auge.</Caption>
  </AbsoluteFill>
);

const VirtuellScene: React.FC<SceneProps> = ({ dur }) => {
  const p = useFade(20, 30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Trick" title="Das Auge verlängert gerade" />
      <MirrorScene showRays showVirtual progress={p} />
      <div style={{ position: 'absolute', left: 1150, top: 620, fontSize: 26, fontWeight: 800, color: COLORS.indigo }}>virtuelles Bild (da ist nichts!)</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Dein Auge verlängert die Strahlen geradlinig – dort scheint das Bild zu sein.</Caption>
    </AbsoluteFill>
  );
};

const EigenschaftenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Immer gleich" title="Aufrecht · gleich groß · seitenverkehrt" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 30, opacity: f }}>
          {[['⬆️', 'aufrecht'], ['📏', 'gleich groß'], ['↔️', 'seitenverkehrt'], ['🪞', 'gleich weit dahinter']].map((c, i) => (
            <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 64 }}>{c[0]}</div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Das Spiegelbild liegt so weit hinter dem Spiegel wie du davor.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Spiegelbild" footer="nach dem Reflexionsgesetz">
      Am ebenen Spiegel entsteht ein virtuelles,
      <br />
      aufrechtes, seitenverkehrtes Bild –
      <br />
      gleich weit hinter dem Spiegel.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Seitenverkehrt im Alltag" />
      <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.amber, opacity: f }}>🚑 <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>ECNALUBMA</span></div>
      <div style={{ marginTop: 30, fontSize: 34, fontWeight: 800, color: COLORS.muted, opacity: f }}>im Rückspiegel richtig herum lesbar</div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Dein Spiegelbild winkt mit der anderen Hand – links und rechts sind vertauscht.</Caption>
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
  { id: 'reflexion', C: ReflexionScene, min: 240 },
  { id: 'virtuell', C: VirtuellScene, min: 260 },
  { id: 'eigenschaften', C: EigenschaftenScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SPIEGELBILD_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Spiegelbild: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SPIEGELBILD_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/spiegelbild/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
