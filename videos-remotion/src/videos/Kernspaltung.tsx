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
import { Nucleus } from '../nuclear';
import timings from '../narration/kernspaltung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Neutron: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 15 }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <circle cx={x} cy={y} r={r} fill="#e2e8f0" stroke="#0f172a" strokeWidth={2} />
    <text x={x} y={y + 5} fontSize={r} fontWeight="900" fill="#0f172a" textAnchor="middle">n</text>
  </svg>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120 }}>⚛️💥</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie holt man riesige Energie aus einem winzigen Kern?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Kernspaltung
      </div>
    </AbsoluteFill>
  );
};

const SpaltungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const split = frame > 60;
  const nx = split ? 700 : interpolate(frame, [10, 60], [180, 660], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sep = split ? interpolate(frame, [60, 130], [0, 320], { extrapolateRight: 'clamp' }) : 0;
  const flash = split ? interpolate(frame, [60, 90], [1, 0], { extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Spaltung" title="Ein Neutron zerlegt den Urankern" />
      {!split && <Neutron x={nx} y={540} />}
      {flash > 0 && (
        <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
          <circle cx={760} cy={540} r={120 + (1 - flash) * 200} fill={`rgba(251,191,36,${flash * 0.5})`} />
        </svg>
      )}
      {!split ? (
        <Nucleus cx={760} cy={540} protons={12} neutrons={18} r={100} jiggle={frame > 45 ? 6 : 2} frame={frame} />
      ) : (
        <>
          <Nucleus cx={760 - sep} cy={480} protons={6} neutrons={8} r={70} />
          <Nucleus cx={760 + sep} cy={600} protons={6} neutrons={10} r={72} />
          <Neutron x={760 + sep * 0.7} y={380 - sep * 0.3} />
          <Neutron x={760 - sep * 0.7} y={700 + sep * 0.3} />
          <Neutron x={760 + sep} y={540} />
        </>
      )}
      <div style={{ position: 'absolute', left: 1200, top: 460, width: 640, fontSize: 24, fontWeight: 800 }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, marginBottom: 12 }}>Ein langsames Neutron trifft einen Uran-235-Kern. Der Kern wird instabil und zerplatzt.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>Es entstehen zwei kleinere Kerne, zwei bis drei neue Neutronen – und sehr viel Energie.</div>
      </div>
      <Sfx sound="impact" at={60} volume={0.45} />
      <Caption delay={30}>Ein Neutron trifft einen Uran-235-Kern. Der spaltet sich in zwei kleinere Kerne, setzt zwei bis drei neue Neutronen frei – und dabei jede Menge Energie.</Caption>
    </AbsoluteFill>
  );
};

const EnergieScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Woher die Energie kommt" title="Aus einem Hauch von Masse" />
      <div style={{ opacity: f, marginTop: 30, width: 1300 }}>
        <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, fontSize: 32, fontWeight: 900, textAlign: 'center', marginBottom: 18 }}>
          E = m · c²
        </div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 24, fontWeight: 800, color: COLORS.muted }}>
          Nach der Spaltung wiegen die Bruchstücke zusammen ein winziges bisschen weniger als der Ausgangskern. Diese fehlende Masse wird nach Einsteins Formel in sehr viel Energie umgewandelt.
        </div>
      </div>
      <Caption delay={30}>Woher kommt die Energie? Die Bruchstücke wiegen zusammen etwas weniger als vorher. Diese winzige fehlende Masse wird nach Einsteins Formel E gleich m mal c-Quadrat zu enormer Energie.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Wie viel ist das?" title="1 Gramm Uran ≈ 3 Tonnen Kohle" />
      <div style={{ display: 'flex', gap: 60, alignItems: 'center', opacity: f, marginTop: 30 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 120 }}>🪙</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>1 g Uran-235</div>
        </div>
        <div style={{ fontSize: 60, color: COLORS.amber }}>≈</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 120 }}>🪨🪨🪨</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>rund 3 Tonnen Kohle</div>
        </div>
      </div>
      <Sfx sound="pling" at={12} volume={0.4} />
      <Caption delay={30}>Diese Energie ist gewaltig. Die Spaltung von nur einem Gramm Uran liefert ungefähr so viel Energie wie die Verbrennung von drei Tonnen Kohle.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Kernspaltung" footer="fehlende Masse → Energie (E = m·c²)">
      Ein Neutron spaltet einen Uran-235-Kern in zwei
      <br />
      kleinere Kerne, neue Neutronen und viel Energie.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏭', 'Kernkraftwerk', 'Strom aus Spaltung'],
    ['🚢', 'Antrieb', 'U-Boote, Eisbrecher'],
    ['💣', 'Missbrauch', 'Kernwaffen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wo die Spaltung genutzt wird" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Damit man die Energie nutzen kann, muss die Spaltung eine kontrollierte Kettenreaktion auslösen – das schauen wir uns als Nächstes an.</Caption>
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
  { id: 'spaltung', C: SpaltungScene, min: 260 },
  { id: 'energie', C: EnergieScene, min: 240 },
  { id: 'vergleich', C: VergleichScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KERNSPALTUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kernspaltung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KERNSPALTUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kernspaltung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
