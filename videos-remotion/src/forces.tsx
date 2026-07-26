import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Kraft-Bausteine (Kl.9 „Kräfte") ─────────────────────────────────────

export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// Kraftpfeil (Vektor): von (x,y) in Richtung angleDeg, Länge ∝ Betrag.
export const ForceArrow: React.FC<{
  x: number;
  y: number;
  angleDeg: number; // 0 = rechts, 90 = unten, -90 = oben
  len: number;
  color?: string;
  label?: string;
  width?: number;
}> = ({ x, y, angleDeg, len, color = COLORS.red, label, width = 8 }) => {
  const rad = (angleDeg * Math.PI) / 180;
  const ex = x + Math.cos(rad) * len;
  const ey = y + Math.sin(rad) * len;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points="0,-14 24,0 0,14" fill={color} transform={`translate(${ex},${ey}) rotate(${angleDeg})`} />
      {label ? <text x={ex + Math.cos(rad) * 30 + 10} y={ey + Math.sin(rad) * 30} fontSize={30} fill={color} fontWeight="bold">{label}</text> : null}
    </svg>
  );
};

// Feder (Wendel), die sich um `stretch` px dehnt. Aufhängung oben.
export const Spring: React.FC<{ x: number; y: number; coils?: number; baseLen?: number; stretch?: number; color?: string }> = ({
  x,
  y,
  coils = 6,
  baseLen = 200,
  stretch = 0,
  color = COLORS.sky,
}) => {
  const len = baseLen + stretch;
  const seg = len / coils;
  const pts: string[] = [`${x},${y}`];
  for (let i = 0; i < coils; i++) {
    pts.push(`${x + 26},${y + seg * (i + 0.25)}`);
    pts.push(`${x - 26},${y + seg * (i + 0.75)}`);
  }
  pts.push(`${x},${y + len}`);
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={x - 60} y1={y} x2={x + 60} y2={y} stroke={COLORS.muted} strokeWidth={8} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={5} />
    </svg>
  );
};

// Skala neben dem Federkraftmesser (Newton-Werte).
export const Scale: React.FC<{ x: number; y: number; h?: number; max?: number; value?: number }> = ({ x, y, h = 300, max = 10, value = 0 }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <line x1={x} y1={y} x2={x} y2={y + h} stroke={COLORS.muted} strokeWidth={3} />
    {Array.from({ length: max + 1 }).map((_, i) => (
      <React.Fragment key={i}>
        <line x1={x} y1={y + (h / max) * i} x2={x + 16} y2={y + (h / max) * i} stroke={COLORS.muted} strokeWidth={2} />
        <text x={x + 24} y={y + (h / max) * i + 8} fontSize={20} fill={COLORS.muted}>{i} N</text>
      </React.Fragment>
    ))}
    <polygon points={`${x - 20},${y + (h / max) * value - 12} ${x - 4},${y + (h / max) * value} ${x - 20},${y + (h / max) * value + 12}`} fill={COLORS.amber} />
  </svg>
);

// Kiste / Last (Gewicht).
export const Crate: React.FC<{ x: number; y: number; s?: number; label?: string }> = ({ x, y, s = 90, label }) => (
  <div style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: 10, background: 'linear-gradient(180deg,#b45309,#78350f)', border: '3px solid #92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fed7aa' }}>
    {label}
  </div>
);
