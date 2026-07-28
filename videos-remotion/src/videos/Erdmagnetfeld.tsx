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
import { CompassNeedle, useFade } from '../magnet';
import timings from '../narration/erdmagnetfeld.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Erde mit innenliegendem Stabmagneten + Feldbögen ───────────────────
// tilt = Neigung der Magnetachse (Grad). Oben liegt der magnetische SÜDpol
// (nahe dem geografischen Nordpol) – deshalb zeigt die Nadel-Nordspitze dorthin.
const Earth: React.FC<{ cx: number; cy: number; R: number; tilt?: number; showField?: number; showMagnet?: boolean }> = ({
  cx,
  cy,
  R,
  tilt = 0,
  showField = 1,
  showMagnet = true,
}) => {
  const arcs = [1.35, 1.7, 2.15];
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <defs>
        <radialGradient id="earthg" cx="38%" cy="34%">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="0.6" stopColor="#2563eb" />
          <stop offset="1" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>
      {/* Feldbögen außen: vom unteren Pol (N) herum zum oberen Pol (S) */}
      <g transform={`rotate(${tilt} ${cx} ${cy})`} opacity={showField}>
        {arcs.map((k, i) => (
          <React.Fragment key={i}>
            <path
              d={`M ${cx} ${cy + R} C ${cx + R * k * 1.3} ${cy + R * k}, ${cx + R * k * 1.3} ${cy - R * k}, ${cx} ${cy - R}`}
              fill="none"
              stroke={COLORS.sky}
              strokeWidth={3}
              opacity={0.75}
            />
            <path
              d={`M ${cx} ${cy + R} C ${cx - R * k * 1.3} ${cy + R * k}, ${cx - R * k * 1.3} ${cy - R * k}, ${cx} ${cy - R}`}
              fill="none"
              stroke={COLORS.sky}
              strokeWidth={3}
              opacity={0.75}
            />
          </React.Fragment>
        ))}
      </g>
      {/* Erdkugel */}
      <circle cx={cx} cy={cy} r={R} fill="url(#earthg)" stroke="#0b1220" strokeWidth={3} />
      {/* Rotationsachse senkrecht (geografisch) */}
      <line x1={cx} y1={cy - R - 60} x2={cx} y2={cy + R + 60} stroke="#94a3b8" strokeWidth={3} strokeDasharray="10 10" />
      {/* innenliegender Stabmagnet (geneigt) */}
      {showMagnet ? (
        <g transform={`rotate(${tilt} ${cx} ${cy})`}>
          <rect x={cx - 34} y={cy - R * 0.82} width={68} height={R * 0.82} fill={COLORS.sky} rx={8} />
          <rect x={cx - 34} y={cy} width={68} height={R * 0.82} fill={COLORS.red} rx={8} />
          <text x={cx} y={cy - R * 0.5} fontSize={40} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">S</text>
          <text x={cx} y={cy + R * 0.5} fontSize={40} fontWeight="900" fill="#fff" textAnchor="middle" dominantBaseline="middle">N</text>
        </g>
      ) : null}
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const wob = Math.sin(frame / 10) * 8;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `rotate(${wob}deg)` }}>
        <CompassNeedle x={0} y={0} size={180} angle={0} />
      </div>
      <div style={{ height: 120 }} />
      <StarLogo size={64} />
      <div style={{ marginTop: 14, fontSize: 58, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum zeigt der Kompass nach Norden?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Erde als riesiger Magnet
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  // Kompass wird angestoßen und pendelt zurück nach Norden (0°)
  const turned = interpolate(frame, [0, 30], [70, 70], { extrapolateRight: 'clamp' });
  const settle = frame < 40 ? turned : 70 * Math.cos((frame - 40) / 10) * Math.exp(-(frame - 40) / 40);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Egal wie gedreht – sie zeigt nach Norden" />
      <div style={{ position: 'absolute', left: 760, top: 560 }}>
        <CompassNeedle x={0} y={0} size={220} angle={settle} />
      </div>
      <div style={{ position: 'absolute', left: 760 - 30, top: 560 - 200, fontSize: 30, fontWeight: 900, color: COLORS.red }}>N</div>
      <div style={{ position: 'absolute', left: 1200, top: 500, width: 500, fontSize: 30, fontWeight: 800, color: COLORS.muted }}>
        {frame > 55 ? '↩️ pendelt zurück – immer dieselbe Richtung' : '👉 angestoßen'}
      </div>
      <Caption delay={30}>Stößt man die Nadel an, pendelt sie zurück und zeigt wieder nach Norden. Etwas richtet sie aus.</Caption>
    </AbsoluteFill>
  );
};

const ModellScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Modell" title="In der Erde steckt ein Magnet" />
      <div style={{ opacity: f }}>
        <Earth cx={720} cy={560} R={300} tilt={0} showField={f} />
      </div>
      <div style={{ position: 'absolute', left: 1240, top: 380, width: 560, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, fontSize: 26, fontWeight: 800, marginBottom: 14 }}>🌍 Die Erde hat ein Magnetfeld</div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.red}`, fontSize: 26, fontWeight: 800, marginBottom: 14 }}>🧲 wie ein Stabmagnet im Inneren</div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, fontSize: 26, fontWeight: 800 }}>➡️ Feldlinien laufen von Pol zu Pol</div>
      </div>
      <Caption delay={30}>Die Erde wirkt wie ein gewaltiger Stabmagnet – ihr Feld reicht weit in den Raum.</Caption>
    </AbsoluteFill>
  );
};

const PoleScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const cx = 720;
  const cy = 560;
  const R = 300;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vorsicht, Denkfehler" title="Magnetischer Pol ≠ geografischer Pol" />
      <Earth cx={cx} cy={cy} R={R} tilt={11} showField={0.35} />
      {/* geografischer Nordpol (oben, Achse) */}
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <circle cx={cx} cy={cy - R} r={9} fill="#e2e8f0" />
        <line x1={cx + Math.sin((11 * Math.PI) / 180) * R} y1={cy - Math.cos((11 * Math.PI) / 180) * R} x2={cx + 150} y2={cy - R - 40} stroke={COLORS.amber} strokeWidth={3} />
      </svg>
      <div style={{ position: 'absolute', left: cx - 200, top: cy - R - 78, fontSize: 24, fontWeight: 800, color: '#e2e8f0', opacity: f }}>geografischer Nordpol</div>
      <div style={{ position: 'absolute', left: cx + 120, top: cy - R - 70, width: 320, fontSize: 24, fontWeight: 800, color: COLORS.amber, opacity: f }}>magnetischer Pol (ca. 11° daneben)</div>
      <div style={{ position: 'absolute', left: 1230, top: 520, width: 580, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, fontSize: 26, fontWeight: 800 }}>
          Nahe dem geografischen Nordpol liegt ein magnetischer SÜDpol – darum wird die rote Nordspitze dorthin gezogen.
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={30}>Der magnetische Pol liegt etwas neben dem geografischen – diese Abweichung heißt Missweisung.</Caption>
    </AbsoluteFill>
  );
};

const StoerScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  // Magnet nähert sich von rechts, Nadel dreht zu ihm
  const near = interpolate(frame, [30, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const needle = interpolate(near, [0, 1], [0, 78]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Ausprobieren" title="Eisen und Magnete stören den Kompass" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 30 }}>
        <CompassNeedle x={0} y={0} size={200} angle={needle} />
        <div style={{ fontSize: 90, opacity: near, transform: `translateX(${(1 - near) * 200}px)` }}>🧲</div>
      </div>
      <div style={{ marginTop: 60, fontSize: 30, fontWeight: 800, color: near > 0.4 ? COLORS.red : COLORS.muted, opacity: f }}>
        {near > 0.4 ? 'Nadel dreht zum nahen Magneten – nicht mehr nach Norden' : 'Kompass zeigt Norden'}
      </div>
      <Caption delay={30}>Ein Magnet oder Eisen in der Nähe ist stärker als das Erdfeld – dann zeigt der Kompass falsch.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Das Erdmagnetfeld" footer="magnetischer Pol ≠ geografischer Pol (Missweisung)">
      Die Erde ist ein riesiger Magnet.
      <br />
      Die Kompassnadel richtet sich in ihrem Feld aus
      <br />
      und zeigt nach Norden.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🧭', 'Wandern', 'Richtung finden'],
    ['✈️', 'Navigation', 'Kurs halten'],
    ['🐦', 'Zugvögel', 'spüren das Feld'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Das Erdfeld im Alltag" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Ohne das Erdmagnetfeld gäbe es keinen Kompass – und die Erde wäre ungeschützt vor Teilchen aus dem All.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'modell', C: ModellScene, min: 250 },
  { id: 'pole', C: PoleScene, min: 260 },
  { id: 'stoer', C: StoerScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ERDMAGNETFELD_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Erdmagnetfeld: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ERDMAGNETFELD_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/erdmagnetfeld/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
