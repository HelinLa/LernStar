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
import timings from '../narration/weg-zeit-diagramm.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const X0 = 560, Y0 = 820, W = 900, H = 520;

// s-t-Achsen + Polylinie aus Segmenten [{dt, ds}]
const STGraph: React.FC<{ segs: { dt: number; ds: number }[]; progress: number; labelY?: string }> = ({ segs, progress, labelY = 's (Weg)' }) => {
  const totalT = segs.reduce((a, s) => a + s.dt, 0);
  const totalS = segs.reduce((a, s) => a + s.ds, 0);
  const pts: [number, number][] = [[X0, Y0]];
  let ct = 0, cs = 0;
  segs.forEach((s) => { ct += s.dt; cs += s.ds; pts.push([X0 + (ct / totalT) * W, Y0 - (cs / totalS) * H]); });
  const nShow = 1 + progress * (pts.length - 1);
  const drawn: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    if (i <= Math.floor(nShow)) drawn.push(pts[i]);
    else { const f = nShow - Math.floor(nShow); const a = pts[i - 1], b = pts[i]; drawn.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); break; }
  }
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={X0} y1={Y0} x2={X0} y2={Y0 - H} stroke={COLORS.muted} strokeWidth={3} />
      <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke={COLORS.muted} strokeWidth={3} />
      <text x={X0 - 90} y={Y0 - H + 6} fontSize={26} fill={COLORS.sky} fontWeight="bold">{labelY}</text>
      <text x={X0 + W} y={Y0 + 46} fontSize={26} fill={COLORS.amber} fontWeight="bold">t (Zeit)</text>
      <polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke={COLORS.green} strokeWidth={7} strokeLinejoin="round" />
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
      <div style={{ marginTop: 20, fontSize: 76, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Das Weg-Zeit-Diagramm
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Eine ganze Bewegung auf einen Blick – das s-t-Diagramm.
      </div>
    </AbsoluteFill>
  );
};

const AchsenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Achsen" title="Zeit waagerecht, Weg senkrecht" />
      <STGraph segs={[{ dt: 1, ds: 1 }]} progress={p} />
      <div style={{ position: 'absolute', left: 1150, top: 400, fontSize: 28, fontWeight: 800, color: COLORS.muted }}>jeder Punkt: „zu dieser Zeit an dieser Stelle"</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Zeit t auf der x-Achse, zurückgelegter Weg s auf der y-Achse.</Caption>
    </AbsoluteFill>
  );
};

const SteilScene: React.FC<SceneProps> = () => {
  const p = useFade(20, 40);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Regel" title="Steil = schnell, flach = langsam" />
      <STGraph segs={[{ dt: 0.5, ds: 0.7 }, { dt: 0.5, ds: 0.15 }]} progress={1} />
      <div style={{ position: 'absolute', left: 760, top: 380, fontSize: 26, fontWeight: 800, color: COLORS.green, opacity: p }}>steil → schnell</div>
      <div style={{ position: 'absolute', left: 1180, top: 460, fontSize: 26, fontWeight: 800, color: COLORS.amber, opacity: p }}>flach → langsam</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={40}>Steile Linie heißt schnell, flache Linie langsam – die Steigung ist die Geschwindigkeit.</Caption>
    </AbsoluteFill>
  );
};

const WaagerechtScene: React.FC<SceneProps> = () => {
  const p = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Sonderfall" title="Waagerecht = Stillstand" />
      <STGraph segs={[{ dt: 0.4, ds: 0.6 }, { dt: 0.3, ds: 0.001 }, { dt: 0.3, ds: 0.4 }]} progress={1} />
      <div style={{ position: 'absolute', left: 950, top: 340, fontSize: 28, fontWeight: 800, color: COLORS.red, opacity: p }}>🛑 Weg ändert sich nicht → steht still</div>
      <Sfx sound="pop" at={16} volume={0.34} />
      <Caption delay={30}>Eine waagerechte Linie bedeutet: Der Weg ändert sich nicht – der Körper steht.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Weg-Zeit-Diagramm" footer="Steigung = Geschwindigkeit">
      Zeit waagerecht, Weg senkrecht.
      <br />
      Steil = schnell, flach = langsam,
      <br />
      waagerecht = Stillstand.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Eine ganze Autofahrt" />
      <div style={{ fontSize: 150, opacity: f }}>🚗 📈</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Erst steil beim Anfahren, dann gleichmäßig auf der Autobahn, dann waagerecht an der roten Ampel.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Das Diagramm beschreibt jede Phase der Fahrt.</Caption>
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
  { id: 'achsen', C: AchsenScene, min: 240 },
  { id: 'steil', C: SteilScene, min: 240 },
  { id: 'waagerecht', C: WaagerechtScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WEG_ZEIT_DIAGRAMM_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const WegZeitDiagramm: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WEG_ZEIT_DIAGRAMM_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/weg-zeit-diagramm/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
