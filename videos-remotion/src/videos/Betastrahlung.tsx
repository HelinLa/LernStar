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
import timings from '../narration/betastrahlung.timings.json';

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
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 130, fontWeight: 900, color: COLORS.sky }}>β</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum ist Betastrahlung durchdringender?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Ein schnelles Elektron aus dem Kern
      </div>
    </AbsoluteFill>
  );
};

const WasIstScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const emit = frame > 60;
  const ex = emit ? interpolate(frame, [60, 130], [640, 1420], { extrapolateRight: 'clamp' }) : 640;
  const ey = emit ? interpolate(frame, [60, 130], [540, 300], { extrapolateRight: 'clamp' }) : 540;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Was passiert im Kern" title="Ein Neutron wird zum Proton" />
      <Nucleus cx={520} cy={540} protons={emit ? 7 : 6} neutrons={emit ? 7 : 8} r={120} jiggle={emit ? 1 : 4} frame={frame} />
      {emit && (
        <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
          <circle cx={ex} cy={ey} r={14} fill={COLORS.sky} stroke="#0f172a" strokeWidth={2} />
          <text x={ex} y={ey + 5} fontSize={18} fontWeight="900" fill="#fff" textAnchor="middle">−</text>
        </svg>
      )}
      {emit && <div style={{ position: 'absolute', left: ex - 90, top: ey - 60, fontSize: 26, fontWeight: 900, color: COLORS.sky }}>β-Teilchen</div>}
      <div style={{ position: 'absolute', left: 1120, top: 430, width: 700, fontSize: 23, fontWeight: 800 }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, marginBottom: 12 }}>Im Kern wandelt sich ein Neutron um: n⁰ → p⁺ + e⁻</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}` }}>Das dabei entstehende Elektron rast mit hoher Geschwindigkeit aus dem Kern heraus – das ist die Betastrahlung.</div>
      </div>
      <Sfx sound="impact" at={60} volume={0.4} />
      <Caption delay={30}>Im Kern verwandelt sich ein Neutron in ein Proton und ein Elektron. Dieses Elektron schießt mit hohem Tempo heraus – das ist die Betastrahlung.</Caption>
    </AbsoluteFill>
  );
};

const ZerfallScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Was mit dem Kern passiert" title="Ordnungszahl +1, Massenzahl gleich" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 30, fontSize: 30, fontWeight: 900 }}>
        <div style={{ padding: '20px 26px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
          <div style={{ fontSize: 26, color: COLORS.muted }}>vorher</div>
          C-14<br /><span style={{ fontSize: 23, color: COLORS.muted }}>6 Protonen</span>
        </div>
        <div style={{ fontSize: 46, color: COLORS.sky }}>→</div>
        <div style={{ padding: '20px 26px', borderRadius: 16, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 26, color: COLORS.muted }}>nachher</div>
          N-14<br /><span style={{ fontSize: 23, color: COLORS.muted }}>7 Protonen</span>
        </div>
        <div style={{ fontSize: 34, color: COLORS.muted }}>+</div>
        <div style={{ padding: '20px 26px', borderRadius: 16, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          β<br /><span style={{ fontSize: 23, color: COLORS.muted }}>Elektron</span>
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: 26, fontWeight: 800, color: COLORS.muted, opacity: f, maxWidth: 1200, textAlign: 'center' }}>
        Ein Neutron wurde zum Proton – die Ordnungszahl steigt um 1, die Massenzahl bleibt gleich. Aus Kohlenstoff wird Stickstoff.
      </div>
      <Caption delay={30}>Weil aus einem Neutron ein Proton wird, steigt die Ordnungszahl um 1, die Massenzahl bleibt gleich. Aus C-14 wird zum Beispiel Stickstoff-14.</Caption>
    </AbsoluteFill>
  );
};

const ReichweiteScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const ax = interpolate(frame, [20, 70], [360, 900], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Reichweite" title="Durch Papier – aber Alu stoppt sie" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <text x={300} y={540} fontSize={70}>☢️</text>
        <line x1={360} y1={540} x2={ax} y2={540} stroke={COLORS.sky} strokeWidth={6} />
        <circle cx={ax} cy={540} r={13} fill={COLORS.sky} />
        {/* Papier (durchdrungen) */}
        <rect x={560} y={440} width={16} height={200} fill="#e2e8f0" opacity={0.6} />
        <text x={568} y={680} fontSize={22} fontWeight="800" fill={COLORS.muted} textAnchor="middle">Papier</text>
        {/* Alu (stoppt) */}
        <rect x={900} y={420} width={40} height={240} fill="#9ca3af" />
        <text x={920} y={700} fontSize={22} fontWeight="800" fill={COLORS.muted} textAnchor="middle">Alu</text>
        <text x={1000} y={545} fontSize={30} fill={COLORS.red}>🛑</text>
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 460, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}` }}>β-Teilchen sind viel leichter und schneller als α-Teilchen. Sie kommen weiter, durchdringen Papier – aber ein paar Millimeter Aluminium stoppen sie.</div>
      </div>
      <Caption delay={30}>Das Elektron ist viel leichter als ein Alphateilchen. Deshalb kommt Betastrahlung weiter: Sie durchdringt Papier, wird aber von Aluminium gestoppt.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Betastrahlung (β)" footer="Ordnungszahl +1, Massenzahl gleich">
      Ein Neutron wird zu Proton und Elektron.
      <br />
      Das schnelle Elektron ist die β-Strahlung –
      <br />
      sie durchdringt Papier, Alu stoppt sie.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['📏', 'Dickenmessung', 'in der Industrie'],
    ['🏥', 'Medizin', 'Diagnose & Therapie'],
    ['🌳', 'C-14-Methode', 'nutzt β-Zerfall'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Betastrahlung im Einsatz" />
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
      <Caption delay={40}>Als Nächstes: die Gammastrahlung – die durchdringendste von allen.</Caption>
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
  { id: 'wasist', C: WasIstScene, min: 250 },
  { id: 'zerfall', C: ZerfallScene, min: 250 },
  { id: 'reichweite', C: ReichweiteScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BETASTRAHLUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Betastrahlung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BETASTRAHLUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/betastrahlung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
