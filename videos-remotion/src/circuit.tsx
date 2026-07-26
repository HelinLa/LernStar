import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Gemeinsame Stromkreis-Bausteine (für alle Kl.5-Stromkreis-Videos) ───
// SVG-Elemente arbeiten auf der vollen Bühne (viewBox 0 0 1920 1080).

export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// Punkt auf dem Rechteck-Umfang (im Uhrzeigersinn ab oben-links), s in [0,1).
const pointOnRect = (s: number, LX: number, RX: number, TY: number, BY: number): [number, number] => {
  const w = RX - LX;
  const h = BY - TY;
  const per = 2 * (w + h);
  let d = ((s % 1) + 1) % 1 * per;
  if (d < w) return [LX + d, TY]; // oben →
  d -= w;
  if (d < h) return [RX, TY + d]; // rechts ↓
  d -= h;
  if (d < w) return [RX - d, BY]; // unten ←
  d -= w;
  return [LX, BY - d]; // links ↑
};

// Rechteckiger Stromkreis-Draht mit fließenden Strom-Punkten (wenn on).
export const RectWire: React.FC<{
  LX: number;
  RX: number;
  TY: number;
  BY: number;
  on?: boolean;
  color?: string;
  dots?: number;
  gapAtBottom?: number; // Lücke in der Mitte unten (für Material/Schalter), Breite px
}> = ({ LX, RX, TY, BY, on = true, color, dots = 12, gapAtBottom = 0 }) => {
  const frame = useCurrentFrame();
  const c = color ?? (on ? COLORS.amber : COLORS.muted);
  const midX = (LX + RX) / 2;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Rahmen */}
      <polyline points={`${LX},${BY} ${LX},${TY} ${RX},${TY} ${RX},${BY}`} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      {gapAtBottom > 0 ? (
        <>
          <line x1={LX} y1={BY} x2={midX - gapAtBottom / 2} y2={BY} stroke={c} strokeWidth={7} strokeLinecap="round" />
          <line x1={midX + gapAtBottom / 2} y1={BY} x2={RX} y2={BY} stroke={c} strokeWidth={7} strokeLinecap="round" />
        </>
      ) : (
        <line x1={LX} y1={BY} x2={RX} y2={BY} stroke={c} strokeWidth={7} strokeLinecap="round" />
      )}
      {/* Strom-Punkte */}
      {on
        ? Array.from({ length: dots }).map((_, i) => {
            const s = (frame / 60 + i / dots) % 1;
            const [x, y] = pointOnRect(s, LX, RX, TY, BY);
            return <circle key={i} cx={x} cy={y} r={7} fill="#fde68a" />;
          })
        : null}
    </svg>
  );
};

// Lampe als Schaltzeichen ⊗ – leuchtet gelb, wenn on.
export const LampSym: React.FC<{ x: number; y: number; r?: number; on?: boolean; label?: string }> = ({
  x,
  y,
  r = 46,
  on = true,
  label,
}) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
    {on ? (
      <div style={{ position: 'absolute', inset: -r * 0.9, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.amber}bb 0%, transparent 70%)` }} />
    ) : null}
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <circle cx={50} cy={50} r={44} fill={on ? '#fde68a' : '#1e293b'} stroke={on ? COLORS.amber : COLORS.muted} strokeWidth={5} />
      <line x1={20} y1={20} x2={80} y2={80} stroke={on ? '#b45309' : COLORS.muted} strokeWidth={5} />
      <line x1={80} y1={20} x2={20} y2={80} stroke={on ? '#b45309' : COLORS.muted} strokeWidth={5} />
    </svg>
    {label ? (
      <div style={{ position: 'absolute', top: r * 2 + 6, left: '50%', transform: 'translateX(-50%)', fontSize: 24, fontWeight: 700, color: COLORS.muted, whiteSpace: 'nowrap' }}>{label}</div>
    ) : null}
  </div>
);

// Batterie-Schaltzeichen (langer + kurzer Strich) mit Beschriftung.
export const BatterySym: React.FC<{ x: number; y: number; horizontal?: boolean; label?: string }> = ({
  x,
  y,
  horizontal = true,
  label,
}) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    {horizontal ? (
      <>
        <line x1={x - 30} y1={y - 44} x2={x - 30} y2={y + 44} stroke={COLORS.ink} strokeWidth={7} />
        <line x1={x + 30} y1={y - 22} x2={x + 30} y2={y + 22} stroke={COLORS.ink} strokeWidth={12} />
        <text x={x - 46} y={y - 56} fontSize={30} fill={COLORS.amber} fontWeight="bold">+</text>
        <text x={x + 22} y={y - 56} fontSize={34} fill={COLORS.muted} fontWeight="bold">–</text>
      </>
    ) : (
      <>
        <line x1={x - 44} y1={y - 30} x2={x + 44} y2={y - 30} stroke={COLORS.ink} strokeWidth={7} />
        <line x1={x - 22} y1={y + 30} x2={x + 22} y2={y + 30} stroke={COLORS.ink} strokeWidth={12} />
      </>
    )}
    {label ? <text x={x} y={y + 78} fontSize={26} fill={COLORS.muted} textAnchor="middle" fontWeight="bold">{label}</text> : null}
  </svg>
);

// Schalter-Schaltzeichen – Hebel offen/geschlossen.
export const SwitchSym: React.FC<{ x: number; y: number; closed?: boolean; label?: string }> = ({
  x,
  y,
  closed = true,
  label,
}) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <circle cx={x - 40} cy={y} r={7} fill={COLORS.ink} />
    <circle cx={x + 40} cy={y} r={7} fill={COLORS.ink} />
    {closed ? (
      <line x1={x - 40} y1={y} x2={x + 40} y2={y} stroke={COLORS.green} strokeWidth={7} strokeLinecap="round" />
    ) : (
      <line x1={x - 40} y1={y} x2={x + 34} y2={y - 42} stroke={COLORS.red} strokeWidth={7} strokeLinecap="round" />
    )}
    {label ? <text x={x} y={y + 60} fontSize={26} fill={COLORS.muted} textAnchor="middle" fontWeight="bold">{label}</text> : null}
  </svg>
);

// „Echte" Glühlampe (Bild-Ansicht) – Emoji, glüht wenn on.
export const Bulb: React.FC<{ x: number; y: number; size?: number; on?: boolean }> = ({ x, y, size = 120, on = true }) => (
  <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, textAlign: 'center' }}>
    {on ? <div style={{ position: 'absolute', inset: -size * 0.4, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.amber}aa, transparent 70%)` }} /> : null}
    <div style={{ fontSize: size, lineHeight: 1, filter: on ? 'none' : 'grayscale(1) brightness(0.6)' }}>💡</div>
  </div>
);
