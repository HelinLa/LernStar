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
  Easing,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo } from '../components';
import timings from '../narration/schwerelosigkeit.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Bausteine ──────────────────────────────────────────────────────────
// Person: Füße bei (cx, feetY)
const Person: React.FC<{ cx: number; feetY: number }> = ({ cx, feetY }) => (
  <>
    <div style={{ position: 'absolute', left: cx - 19, top: feetY - 118, width: 38, height: 38, borderRadius: '50%', background: COLORS.amber, border: '2px solid #ca8a04' }} />
    <div style={{ position: 'absolute', left: cx - 24, top: feetY - 78, width: 48, height: 74, borderRadius: '20px 20px 12px 12px', background: '#e2e8f0' }} />
  </>
);

// Waage: Plattform-Oberkante bei (cx, topY), Anzeige value (in N)
const Scale: React.FC<{ cx: number; topY: number; value: number }> = ({ cx, topY, value }) => (
  <div style={{ position: 'absolute', left: cx - 95, top: topY, width: 190, height: 74 }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 190, height: 16, borderRadius: 8, background: '#94a3b8' }} />
    <div style={{ position: 'absolute', left: 10, top: 14, width: 170, height: 60, borderRadius: '6px 6px 12px 12px', background: '#475569', border: `2px solid ${COLORS.border}` }} />
    <div
      style={{
        position: 'absolute',
        left: 40,
        top: 28,
        width: 110,
        height: 36,
        borderRadius: 6,
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: value > 1 ? '#4ade80' : '#f87171',
        fontWeight: 800,
        fontSize: 28,
        fontFamily: 'monospace',
      }}
    >
      {Math.round(value)} N
    </div>
  </div>
);

// Vertikaler Kraftpfeil (div-basiert, funktioniert auch in bewegten Containern)
const VArrow: React.FC<{ x: number; y: number; h: number; up?: boolean; color: string; opacity?: number; label?: string; labelLeft?: boolean }> = ({
  x,
  y,
  h,
  up,
  color,
  opacity = 1,
  label,
  labelLeft,
}) => (
  <div style={{ position: 'absolute', left: x, top: up ? y - h : y, height: h, opacity }}>
    <div style={{ position: 'absolute', left: -3, top: up ? 14 : 0, width: 6, height: h - 14, background: color, borderRadius: 3 }} />
    <div
      style={{
        position: 'absolute',
        left: -12,
        top: up ? -2 : h - 16,
        width: 0,
        height: 0,
        borderLeft: '12px solid transparent',
        borderRight: '12px solid transparent',
        ...(up ? { borderBottom: `18px solid ${color}` } : { borderTop: `18px solid ${color}` }),
      }}
    />
    {label ? (
      <div style={{ position: 'absolute', left: labelLeft ? undefined : 18, right: labelLeft ? 18 : undefined, top: h / 2 - 14, color, fontWeight: 700, fontSize: 24, whiteSpace: 'nowrap' }}>{label}</div>
    ) : null}
  </div>
);

const GROUND_Y = 840;
const Ground: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: GROUND_Y, height: 8, background: COLORS.ground }} />
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={106} />
      <div style={{ marginTop: 44, fontSize: 88, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Schwerelosigkeit
      </div>
      <div style={{ marginTop: 22, fontSize: 40, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum fühlt man sich im freien Fall schwerelos, obwohl die Erde weiter zieht?
      </div>
    </AbsoluteFill>
  );
};

// ── Stehen: Waage zeigt volles Gewicht ─────────────────────────────────
const StehenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cx = 960;
  const platformTop = GROUND_Y - 74;
  const value = interpolate(frame, [10, Math.round(dur * 0.25)], [0, 600], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Stehen" title="Die Waage zeigt dein volles Gewicht" />
      <Ground />
      <Scale cx={cx} topY={platformTop} value={value} />
      <Person cx={cx} feetY={platformTop} />
      <VArrow x={cx - 150} y={platformTop - 150} h={140} color={COLORS.red} label="Gewichtskraft" labelLeft />
      <VArrow x={cx + 150} y={platformTop} h={140} up color={COLORS.green} label="Auflagekraft" />
      <Caption>Die Erde zieht dich runter, der Boden drückt gleich stark zurück – die Waage zeigt dein Gewicht.</Caption>
    </AbsoluteFill>
  );
};

// ── Freier Fall: Kabine fällt, Waage zeigt 0 ───────────────────────────
const FallScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cabW = 300;
  const cabH = 380;
  const cabX = 960 - cabW / 2;
  const cabY = interpolate(frame, [0, Math.round(dur * 0.8)], [70, GROUND_Y - cabH - 6], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const value = interpolate(frame, [0, Math.round(dur * 0.22)], [600, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const support = interpolate(frame, [0, Math.round(dur * 0.18)], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const floatUp = interpolate(frame, [Math.round(dur * 0.12), Math.round(dur * 0.6)], [0, 46], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const platformTop = cabH - 84;
  const localCx = cabW / 2;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Freier Fall" title="Alles fällt gemeinsam – die Waage zeigt 0" />
      <Ground />
      {/* Kabine */}
      <div style={{ position: 'absolute', left: cabX, top: cabY, width: cabW, height: cabH, borderRadius: 18, background: 'linear-gradient(180deg, rgba(148,163,184,0.16), rgba(148,163,184,0.06))', border: `3px solid ${COLORS.border}` }}>
        <Scale cx={localCx} topY={platformTop} value={value} />
        <Person cx={localCx} feetY={platformTop} />
        {/* schwebende Objekte */}
        <div style={{ position: 'absolute', left: 40, top: platformTop - 40 - floatUp, width: 26, height: 26, borderRadius: '50%', background: COLORS.sky }} />
        <div style={{ position: 'absolute', left: cabW - 66, top: platformTop - 20 - floatUp * 1.3, width: 22, height: 22, borderRadius: 6, background: COLORS.indigo }} />
        {/* g wirkt weiter (rot, runter) */}
        <VArrow x={localCx} y={70} h={70} color={COLORS.red} label="g wirkt weiter" />
        {/* Auflagekraft verschwindet (grün, blasst aus) */}
        <VArrow x={localCx - 90} y={platformTop} h={70} up color={COLORS.green} opacity={support} />
      </div>
      <Caption color={COLORS.sky}>Niemand drückt mehr auf die Waage – sie zeigt 0 N. Du fühlst dich schwerelos.</Caption>
    </AbsoluteFill>
  );
};

// ── Vergleich: g wirkt immer, nur Auflagekraft verschwindet ────────────
const VergleichScene: React.FC<SceneProps> = () => {
  const leftCx = 560;
  const rightCx = 1360;
  const platformTop = 560;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Unterschied" title="Die Schwerkraft wirkt immer" />
      {/* Panels-Trennlinie */}
      <div style={{ position: 'absolute', left: 960, top: 200, width: 2, height: 520, background: COLORS.border }} />
      {/* Links: Stehen */}
      <div style={{ position: 'absolute', left: leftCx - 120, top: 220, fontSize: 34, fontWeight: 800, width: 240, textAlign: 'center', color: COLORS.green }}>Stehen</div>
      <Scale cx={leftCx} topY={platformTop} value={600} />
      <Person cx={leftCx} feetY={platformTop} />
      <VArrow x={leftCx - 150} y={platformTop - 150} h={130} color={COLORS.red} label="g" labelLeft />
      <VArrow x={leftCx + 150} y={platformTop} h={130} up color={COLORS.green} label="Auflage" />
      {/* Rechts: Freier Fall */}
      <div style={{ position: 'absolute', left: rightCx - 120, top: 220, fontSize: 34, fontWeight: 800, width: 240, textAlign: 'center', color: COLORS.sky }}>Freier Fall</div>
      <Scale cx={rightCx} topY={platformTop} value={0} />
      <Person cx={rightCx} feetY={platformTop} />
      <VArrow x={rightCx - 150} y={platformTop - 150} h={130} color={COLORS.red} label="g" labelLeft />
      <div style={{ position: 'absolute', left: rightCx + 60, top: platformTop - 90, fontSize: 26, fontWeight: 700, color: COLORS.muted }}>keine Auflagekraft</div>
      <Caption>In beiden Fällen zieht die Erde (g). Nur beim Fallen fehlt die Auflagekraft – darum 0 N.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <MerksatzBox title="Schwerelosigkeit" footer="= freier Fall ohne Stützkraft">
      Im freien Fall fehlt die Gegenkraft der Unterlage.
      <br />
      Die Schwerkraft wirkt weiter –
      <br />
      man spürt sie nur nicht mehr.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const InfoCard: React.FC<{ icon: string; title: string; text: string; delay: number }> = ({ icon, title, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 480, padding: '34px 30px', borderRadius: 24, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
      <div style={{ fontSize: 74, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 38, fontWeight: 800, marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 30, fontWeight: 500, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Im Alltag" title="Wo man Schwerelosigkeit erlebt" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 50 }}>
        <InfoCard icon="🎢" title="Freefall-Tower" text="kurzer freier Fall – der Bauch kribbelt" delay={12} />
        <InfoCard icon="✈️" title="Parabelflug" text="das Flugzeug fällt mit – alles schwebt" delay={40} />
      </div>
    </AbsoluteFill>
    <Caption delay={62}>Im Freefall-Tower oder im Parabelflug schwebt für kurze Zeit alles.</Caption>
  </AbsoluteFill>
);

// ── Outro ──────────────────────────────────────────────────────────────
const Outro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={120} />
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: COLORS.muted, opacity: s }}>Physik verstehen – Schritt für Schritt.</div>
    </AbsoluteFill>
  );
};

const SCENES: { id: string; C: React.FC<SceneProps>; min: number }[] = [
  { id: 'intro', C: Intro, min: 110 },
  { id: 'stehen', C: StehenScene, min: 210 },
  { id: 'fall', C: FallScene, min: 210 },
  { id: 'vergleich', C: VergleichScene, min: 210 },
  { id: 'merksatz', C: MerksatzScene, min: 200 },
  { id: 'transfer', C: TransferScene, min: 180 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SCHWERELOSIGKEIT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Schwerelosigkeit: React.FC = () => {
  return (
    <Bg>
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/schwerelosigkeit/${s.id}.wav`)} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
