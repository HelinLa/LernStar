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
import timings from '../narration/motor-optimieren.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Kleiner drehender Motor: Polflächen + rotierende Spule mit Speed `spin`.
const MiniMotor: React.FC<{ cx: number; cy: number; spin: number; windings?: number; bigPoles?: boolean }> = ({ cx, cy, spin, windings = 1, bigPoles = false }) => {
  const frame = useCurrentFrame();
  const a = frame * spin;
  const pw = bigPoles ? 100 : 70;
  const ph = bigPoles ? 300 : 230;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect x={cx - 250} y={cy - ph / 2} width={pw} height={ph} rx={10} fill={COLORS.red} />
      <rect x={cx + 250 - pw} y={cy - ph / 2} width={pw} height={ph} rx={10} fill={COLORS.sky} />
      <text x={cx - 250 + pw / 2} y={cy} fontSize={40} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">N</text>
      <text x={cx + 250 - pw / 2} y={cy} fontSize={40} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">S</text>
      <g transform={`rotate(${a} ${cx} ${cy})`}>
        {Array.from({ length: windings }).map((_, i) => (
          <rect key={i} x={cx - 150 + i * 6} y={cy - 60 - i * 4} width={300 - i * 12} height={120 + i * 8} rx={12} fill="none" stroke="#f59e0b" strokeWidth={7} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={12} fill={COLORS.ink} stroke={COLORS.muted} strokeWidth={2} />
    </svg>
  );
};

const Gauge: React.FC<{ x: number; y: number; value: number; label: string; color?: string }> = ({ x, y, value, label, color = COLORS.green }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 440 }}>
    <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.muted, marginBottom: 8 }}>{label}</div>
    <div style={{ width: '100%', height: 40, borderRadius: 12, background: COLORS.panel, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, value * 100)}%`, height: '100%', background: color }} />
    </div>
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 130, transform: `rotate(${frame * 9}deg)` }}>⚙️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Was macht einen Motor kräftiger?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Vier Stellschrauben
      </div>
    </AbsoluteFill>
  );
};

const StromScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const I = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin((frame - 20) / 34));
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 1" title="Mehr Strom – schneller" />
      <MiniMotor cx={620} cy={560} spin={2 + I * 12} windings={1} />
      <Gauge x={1180} y={430} value={I} label="Stromstärke I" color={COLORS.amber} />
      <Gauge x={1180} y={520} value={I} label="Drehzahl" />
      <Caption delay={30}>Dreht man die Stromstärke hoch, wirken größere Kräfte – der Motor dreht schneller und kräftiger.</Caption>
    </AbsoluteFill>
  );
};

const WindungenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const w = Math.round(interpolate(frame, [20, 150], [1, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const val = interpolate(w, [1, 5], [0.3, 0.85]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 2" title="Mehr Windungen – mehr Kraft" />
      <MiniMotor cx={620} cy={560} spin={6} windings={w} />
      <div style={{ position: 'absolute', left: 480, top: 700, fontSize: 28, fontWeight: 900, color: COLORS.amber }}>{w} Windungen</div>
      <Gauge x={1180} y={470} value={val} label="Drehmoment" />
      <Caption delay={30}>Jede zusätzliche Windung erhöht die Kraft auf die Spule. Mehr Windungen bedeuten mehr Drehmoment.</Caption>
    </AbsoluteFill>
  );
};

const FeldScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const strong = frame > 80;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 3" title="Stärkeres Magnetfeld – mehr Kraft" />
      <MiniMotor cx={620} cy={560} spin={strong ? 12 : 5} windings={2} bigPoles={strong} />
      <div style={{ position: 'absolute', left: 470, top: 730, fontSize: 26, fontWeight: 800, color: strong ? COLORS.green : COLORS.muted }}>
        {strong ? 'starker Magnet' : 'schwacher Magnet'}
      </div>
      <Gauge x={1180} y={470} value={strong ? 0.9 : 0.4} label="Drehmoment" />
      <Sfx sound="pop" at={80} volume={0.34} />
      <Caption delay={30}>Ein stärkerer Magnet liefert ein dichteres Feld – dadurch werden die Kräfte auf die Spule größer.</Caption>
    </AbsoluteFill>
  );
};

const AnkerScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 4" title="Eisenkern und mehrere Spulen" />
      <MiniMotor cx={620} cy={560} spin={13} windings={3} bigPoles />
      <div style={{ position: 'absolute', left: 1160, top: 420, width: 620, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Ein Eisenkern (Anker) im Inneren bündelt das Feld und verstärkt die Kräfte.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 24, fontWeight: 800 }}>Mehrere Spulen versetzt angeordnet sorgen für einen ruhigen, kräftigen Lauf ohne Totpunkt.</div>
      </div>
      <Caption delay={30}>Echte Motoren haben einen Eisenkern und mehrere Spulen – das macht sie stark und lässt sie gleichmäßig laufen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Motor stärker machen" footer="Strom · Windungen · Magnetfeld · Eisenkern">
      Ein Motor wird kräftiger durch mehr Strom,
      <br />
      mehr Windungen, ein stärkeres Feld
      <br />
      und einen Eisenkern.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🚗', 'E-Auto', 'starke, kompakte Motoren'],
    ['🚄', 'Zug', 'sehr große Leistung'],
    ['🛗', 'Aufzug', 'viel Drehmoment'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Vom Spielzeug bis zum E-Auto" />
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
      <Caption delay={40}>Je nach Aufgabe kombinieren Ingenieure diese Faktoren zur passenden Leistung.</Caption>
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
  { id: 'strom', C: StromScene, min: 240 },
  { id: 'windungen', C: WindungenScene, min: 240 },
  { id: 'feld', C: FeldScene, min: 240 },
  { id: 'anker', C: AnkerScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MOTOR_OPTIMIEREN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const MotorOptimieren: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MOTOR_OPTIMIEREN_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/motor-optimieren/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
