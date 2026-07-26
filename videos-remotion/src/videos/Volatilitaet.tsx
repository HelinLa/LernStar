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
import timings from '../narration/volatilitaet.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Tagesverlauf: Solar-Erzeugung (Glocke) und Bedarf (relativ gleichmäßig, Abendspitze)
const solarAt = (h: number) => Math.max(0, Math.sin(((h - 6) / 12) * Math.PI));
const demandAt = (h: number) => 0.45 + 0.22 * Math.exp(-((h - 19) ** 2) / 8) + 0.1 * Math.exp(-((h - 8) ** 2) / 6);

// Chart-Geometrie
const CX = 360, CW = 1200, CY = 760, CH = 420;
const px = (h: number) => CX + (h / 24) * CW;
const py = (v: number) => CY - v * CH;

const DayChart: React.FC<{ showSolar?: boolean; showDemand?: boolean; marks?: boolean; reveal?: number }> = ({ showSolar = true, showDemand = true, marks = false, reveal = 1 }) => {
  const N = 48;
  const solarPts = Array.from({ length: N + 1 }, (_, i) => { const h = (i / N) * 24; return `${px(h).toFixed(1)},${py(solarAt(h)).toFixed(1)}`; });
  const demandPts = Array.from({ length: N + 1 }, (_, i) => { const h = (i / N) * 24; return `${px(h).toFixed(1)},${py(demandAt(h)).toFixed(1)}`; });
  const clip = px(reveal * 24);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <clipPath id="rev"><rect x={0} y={0} width={clip} height={1080} /></clipPath>
      </defs>
      {/* Achsen */}
      <line x1={CX} y1={CY} x2={CX + CW} y2={CY} stroke={COLORS.border} strokeWidth={3} />
      <line x1={CX} y1={CY} x2={CX} y2={CY - CH - 20} stroke={COLORS.border} strokeWidth={3} />
      {[0, 6, 12, 18, 24].map((h) => (
        <text key={h} x={px(h)} y={CY + 40} fontSize={24} fontWeight={700} fill={COLORS.muted} textAnchor="middle">{h}:00</text>
      ))}
      <text x={CX - 20} y={CY - CH} fontSize={24} fontWeight={800} fill={COLORS.muted} textAnchor="end">Leistung</text>
      <g clipPath="url(#rev)">
        {showSolar && <>
          <polygon points={`${px(0)},${CY} ${solarPts.join(' ')} ${px(24)},${CY}`} fill="rgba(251,191,36,0.18)" />
          <polyline points={solarPts.join(' ')} fill="none" stroke={COLORS.amber} strokeWidth={6} />
        </>}
        {showDemand && <polyline points={demandPts.join(' ')} fill="none" stroke={COLORS.ink} strokeWidth={5} strokeDasharray="12 8" />}
      </g>
      {showSolar && <text x={px(12)} y={py(solarAt(12)) - 20} fontSize={26} fontWeight={800} fill={COLORS.amber} textAnchor="middle">☀️ Solar</text>}
      {showDemand && <text x={px(21.5)} y={py(demandAt(21.5)) - 16} fontSize={26} fontWeight={800} fill={COLORS.ink}>Bedarf</text>}
      {marks && <>
        <text x={px(12)} y={py(0.98)} fontSize={28} fontWeight={900} fill={COLORS.green} textAnchor="middle">Überschuss ↑</text>
        <text x={px(2.5)} y={py(0.62)} fontSize={26} fontWeight={900} fill={COLORS.red} textAnchor="middle">Lücke</text>
        <text x={px(23)} y={py(0.62)} fontSize={26} fontWeight={900} fill={COLORS.red} textAnchor="middle">Lücke</text>
      </>}
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
      <div style={{ fontSize: 110, display: 'flex', gap: 20 }}>
        <span>🌬️</span><span>🌬️</span><span>🌬️</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 58, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Reichen viele Windräder?
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Warum Erzeugung schwankt
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Mal viel, mal fast nichts" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 20 }}>
        {[['🌙', 'Nachts', 'keine Sonne', COLORS.red], ['😶‍🌫️', 'Windstille', 'Windrad steht', COLORS.red], ['☀️', 'Sonniger Mittag', 'viel Strom', COLORS.green]].map((c, i) => (
          <div key={i} style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[3] as string}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: c[3] as string, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Caption delay={40}>Die Erzeugung schwankt ständig.</Caption>
    </AbsoluteFill>
  );
};

const DiagrammScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [20, dur - 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ein Tag" title="Erzeugung und Bedarf passen nicht zusammen" />
      <DayChart reveal={reveal} />
      <Caption delay={30}>Solar mittags hoch, nachts null – der Bedarf bleibt.</Caption>
    </AbsoluteFill>
  );
};

const LueckeScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Die Folge" title="Überschuss und Lücke" />
    <DayChart marks />
    <Caption delay={30}>Der Strom kommt oft zur falschen Zeit.</Caption>
  </AbsoluteFill>
);

const AusgleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Lösung" title="Ausgleich durch Speicher" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: f, marginTop: 20 }}>
        <div style={{ width: 340, padding: '26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 58 }}>☀️➕</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>Überschuss speichern</div>
        </div>
        <div style={{ fontSize: 46, color: COLORS.muted }}>🔋</div>
        <div style={{ width: 340, padding: '26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 58 }}>🌙➖</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>bei Lücke abgeben</div>
        </div>
      </div>
      <div style={{ marginTop: 28, fontSize: 30, fontWeight: 800, color: COLORS.green, opacity: f }}>
        Aus schwankender Erzeugung wird verlässliche Versorgung.
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Viele Windräder allein reichen nicht – man braucht Ausgleich.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Schwankende Erzeugung" footer="Ausgleich & Speicher nötig">
      Sonne und Wind liefern mal viel,
      <br />
      mal wenig. Erzeugung und Bedarf
      <br />
      passen zeitlich nicht zusammen.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔆', 'Mittags-Solarspitze', 'zeitweise zu viel'],
    ['🌑', 'Dunkelflaute', 'wenig Wind & Sonne'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Spitze und Flaute" />
      <div style={{ display: 'flex', gap: 50, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 500, padding: '32px 22px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 10 }}>{c[1]}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Zu viel oder zu wenig – selten genau richtig.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 230 },
  { id: 'diagramm', C: DiagrammScene, min: 280 },
  { id: 'luecke', C: LueckeScene, min: 250 },
  { id: 'ausgleich', C: AusgleichScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const VOLATILITAET_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Volatilitaet: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={VOLATILITAET_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/volatilitaet/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
