import React from 'react';
import { interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Galvanometer (Messgerät mit Mittelnull) ────────────────────────────
// value in [-1..1]: Zeiger schlägt nach links (−) oder rechts (+) aus.
export const Galvanometer: React.FC<{ cx: number; cy: number; value: number; size?: number; label?: string }> = ({
  cx,
  cy,
  value,
  size = 200,
  label = 'mA',
}) => {
  const v = Math.max(-1, Math.min(1, value));
  const ang = v * 62; // Grad
  const pivotY = cy + size * 0.34;
  const needleLen = size * 0.62;
  const rad = ((ang - 90) * Math.PI) / 180;
  const nx = cx + needleLen * Math.cos(rad);
  const ny = pivotY + needleLen * Math.sin(rad);
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size * 0.86} rx={16} fill={COLORS.panelSolid} stroke={COLORS.border} strokeWidth={3} />
      {/* Skala */}
      {[-60, -30, 0, 30, 60].map((a, i) => {
        const r = ((a - 90) * Math.PI) / 180;
        const r1 = size * 0.5;
        const r2 = size * 0.56;
        return (
          <line
            key={i}
            x1={cx + r1 * Math.cos(r)}
            y1={pivotY + r1 * Math.sin(r)}
            x2={cx + r2 * Math.cos(r)}
            y2={pivotY + r2 * Math.sin(r)}
            stroke={a === 0 ? COLORS.amber : COLORS.muted}
            strokeWidth={a === 0 ? 4 : 2.5}
          />
        );
      })}
      <text x={cx - size * 0.42} y={cy + size * 0.34} fontSize={size * 0.12} fill={COLORS.red} fontWeight="800" textAnchor="middle">−</text>
      <text x={cx + size * 0.42} y={cy + size * 0.34} fontSize={size * 0.12} fill={COLORS.green} fontWeight="800" textAnchor="middle">+</text>
      {/* Zeiger */}
      <line x1={cx} y1={pivotY} x2={nx} y2={ny} stroke={Math.abs(v) > 0.03 ? COLORS.ink : COLORS.muted} strokeWidth={5} strokeLinecap="round" />
      <circle cx={cx} cy={pivotY} r={9} fill={COLORS.ink} />
      <text x={cx} y={cy - size * 0.28} fontSize={size * 0.13} fill={COLORS.muted} fontWeight="800" textAnchor="middle">{label}</text>
    </svg>
  );
};

// ── Spule (Solenoid, hohl) – Magnet kann längs hindurch ────────────────
export const Solenoid: React.FC<{ cx: number; cy: number; w?: number; h?: number; turns?: number; glow?: number }> = ({
  cx,
  cy,
  w = 300,
  h = 150,
  turns = 7,
  glow = 0,
}) => {
  const gap = w / (turns + 1);
  const g = Math.max(0, Math.min(1, glow));
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {Array.from({ length: turns }).map((_, i) => (
        <ellipse
          key={i}
          cx={cx - w / 2 + gap * (i + 1)}
          cy={cy}
          rx={gap * 0.4}
          ry={h / 2}
          fill="none"
          stroke={g > 0.05 ? `rgba(251,191,36,${0.5 + g * 0.5})` : '#b45309'}
          strokeWidth={7}
        />
      ))}
      {/* Anschlussdrähte nach unten */}
      <line x1={cx - w / 2 + gap} y1={cy + h / 2} x2={cx - w / 2 + gap} y2={cy + h / 2 + 90} stroke={COLORS.amber} strokeWidth={5} />
      <line x1={cx + w / 2 - gap} y1={cy + h / 2} x2={cx + w / 2 - gap} y2={cy + h / 2 + 90} stroke={COLORS.amber} strokeWidth={5} />
    </svg>
  );
};

// wandelt eine Geschwindigkeit (px/frame) in einen Zeigerwert um (weiches Clampen)
export const toNeedle = (v: number, scale = 0.09) => interpolate(v, [-14, 14], [-1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * 1 + 0 * scale;
