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
import timings from '../narration/abschirmung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const X_SRC = 300;
const X_PAPIER = 720;
const X_ALU = 1040;
const X_BLEI = 1380;
const Y_A = 420;
const Y_B = 540;
const Y_G = 660;

const Diagram: React.FC<{ a?: boolean; b?: boolean; g?: boolean; papier?: boolean; alu?: boolean; blei?: boolean }> = ({ a, b, g, papier, alu, blei }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <text x={X_SRC - 60} y={Y_B + 20} fontSize={70}>☢️</text>
    {/* Barrieren */}
    {papier && <><rect x={X_PAPIER} y={340} width={14} height={360} fill="#e2e8f0" /><text x={X_PAPIER + 7} y={730} fontSize={22} fontWeight="800" fill={COLORS.muted} textAnchor="middle">Papier</text></>}
    {alu && <><rect x={X_ALU} y={340} width={34} height={360} fill="#9ca3af" /><text x={X_ALU + 17} y={730} fontSize={22} fontWeight="800" fill={COLORS.muted} textAnchor="middle">Alu (mm)</text></>}
    {blei && <><rect x={X_BLEI} y={330} width={90} height={380} fill="#334155" stroke={COLORS.border} strokeWidth={2} /><text x={X_BLEI + 45} y={735} fontSize={22} fontWeight="800" fill={COLORS.muted} textAnchor="middle">dickes Blei</text></>}
    {/* α: stoppt am Papier */}
    {a && <><line x1={X_SRC} y1={Y_A} x2={X_PAPIER} y2={Y_A} stroke={COLORS.amber} strokeWidth={9} /><text x={X_SRC + 40} y={Y_A - 16} fontSize={26} fontWeight="900" fill={COLORS.amber}>α</text><text x={X_PAPIER + 20} y={Y_A + 8} fontSize={26} fill={COLORS.red}>🛑</text></>}
    {/* β: durch Papier, stoppt an Alu */}
    {b && <><line x1={X_SRC} y1={Y_B} x2={X_ALU} y2={Y_B} stroke={COLORS.sky} strokeWidth={6} /><text x={X_SRC + 40} y={Y_B - 16} fontSize={26} fontWeight="900" fill={COLORS.sky}>β</text><text x={X_ALU + 40} y={Y_B + 8} fontSize={26} fill={COLORS.red}>🛑</text></>}
    {/* γ: durch alles, hinter Blei geschwächt */}
    {g && <><line x1={X_SRC} y1={Y_G} x2={X_BLEI + 90} y2={Y_G} stroke={COLORS.indigo} strokeWidth={5} /><line x1={X_BLEI + 90} y1={Y_G} x2={1720} y2={Y_G} stroke={COLORS.indigo} strokeWidth={2} strokeDasharray="8 8" opacity={0.6} /><text x={X_SRC + 40} y={Y_G - 16} fontSize={26} fontWeight="900" fill={COLORS.indigo}>γ</text><text x={1600} y={Y_G - 14} fontSize={20} fill={COLORS.muted}>stark geschwächt</text></>}
  </svg>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 100, fontWeight: 900 }}><span style={{ color: COLORS.amber }}>α</span> <span style={{ color: COLORS.sky }}>β</span> <span style={{ color: COLORS.indigo }}>γ</span></div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Womit kann ich welche Strahlung aufhalten?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Reichweite und Abschirmung
      </div>
    </AbsoluteFill>
  );
};

const PapierScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Alphastrahlung" title="Ein Blatt Papier genügt" />
      <Diagram a papier />
      <div style={{ position: 'absolute', left: 1180, top: 180, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>α-Teilchen sind groß und geladen – schon ein Blatt Papier (oder die Haut) hält sie vollständig auf.</div>
      </div>
      <Caption delay={30}>Alphastrahlung hat die kürzeste Reichweite. Ein einfaches Blatt Papier reicht aus, um sie komplett zu stoppen.</Caption>
    </AbsoluteFill>
  );
};

const AluScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Betastrahlung" title="Erst Aluminium hält sie auf" />
      <Diagram a b papier alu />
      <div style={{ position: 'absolute', left: 1180, top: 180, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}` }}>β-Strahlung durchdringt Papier locker. Erst einige Millimeter Aluminium stoppen die schnellen Elektronen.</div>
      </div>
      <Caption delay={30}>Betastrahlung fliegt durch das Papier hindurch. Um sie zu stoppen, braucht man einige Millimeter Aluminium.</Caption>
    </AbsoluteFill>
  );
};

const BleiScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gammastrahlung" title="Nur dickes Blei schwächt sie" />
      <Diagram a b g papier alu blei />
      <div style={{ position: 'absolute', left: 1180, top: 180, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(129,140,248,0.16)', border: `2px solid ${COLORS.indigo}` }}>γ-Strahlung durchdringt Papier und Alu mühelos. Selbst dickes Blei oder Beton schwächt sie nur ab – ganz stoppen kann man sie kaum.</div>
      </div>
      <Caption delay={30}>Gammastrahlung durchdringt Papier und Aluminium mühelos. Erst dickes Blei oder Beton kann sie deutlich abschwächen.</Caption>
    </AbsoluteFill>
  );
};

const UebersichtScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const rows = [
    ['α', 'Papier / Haut', COLORS.amber, 0.25],
    ['β', 'einige mm Aluminium', COLORS.sky, 0.55],
    ['γ', 'dickes Blei / Beton', COLORS.indigo, 0.95],
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übersicht" title="Je durchdringender, desto mehr Schutz" />
      <div style={{ position: 'absolute', left: 200, top: 320, width: 1520, opacity: f }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 22 }}>
            <div style={{ width: 80, fontSize: 46, fontWeight: 900, color: r[2] as string, textAlign: 'center' }}>{r[0]}</div>
            <div style={{ height: 46, width: `${(r[3] as number) * 1000}px`, borderRadius: 10, background: r[2] as string, opacity: 0.8 }} />
            <div style={{ fontSize: 26, fontWeight: 800 }}>gestoppt von: {r[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Zusammengefasst: Alpha stoppt Papier, Beta Aluminium, Gamma erst dickes Blei. Je durchdringender die Strahlung, desto mehr Schutz braucht man.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Abschirmung" footer="Reichweite: α < β < γ">
      α stoppt ein Blatt Papier, β einige Millimeter
      <br />
      Aluminium, γ erst dickes Blei oder Beton.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🦺', 'Bleischürze', 'beim Röntgen'],
    ['🧱', 'Betonwände', 'im Kernkraftwerk'],
    ['📦', 'Transportbehälter', 'aus dickem Blei'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Schutz im Alltag" />
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
      <Caption delay={40}>Deshalb trägt man beim Röntgen eine Bleischürze und schützt Reaktoren mit dicken Betonwänden.</Caption>
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
  { id: 'papier', C: PapierScene, min: 240 },
  { id: 'alu', C: AluScene, min: 240 },
  { id: 'blei', C: BleiScene, min: 250 },
  { id: 'uebersicht', C: UebersichtScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ABSCHIRMUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Abschirmung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ABSCHIRMUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/abschirmung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
