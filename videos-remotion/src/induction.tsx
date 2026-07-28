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

// ── Transformator: Eisenkern-Rahmen + zwei Spulen ──────────────────────
// n1 = Primärwindungen (links, amber), n2 = Sekundär (rechts, sky).
// flow: animierter Feldfluss im Kern (nur wenn Wechselstrom); frame kommt von außen.
export const TransformerCore: React.FC<{
  cx: number;
  cy: number;
  n1?: number;
  n2?: number;
  flow?: boolean;
  frame?: number;
  secLive?: boolean;
}> = ({ cx, cy, n1 = 5, n2 = 5, flow = false, frame = 0, secLive = true }) => {
  const w = 380;
  const h = 320;
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const t = 46; // Kern-Dicke
  const legL = x0 + t / 2;
  const legR = x0 + w - t / 2;
  const coil = (legX: number, count: number, color: string) => {
    const span = h - 130;
    const gap = span / (count + 1);
    return Array.from({ length: count }).map((_, i) => (
      <ellipse key={i} cx={legX} cy={y0 + 65 + gap * (i + 1)} rx={62} ry={gap * 0.42} fill="none" stroke={color} strokeWidth={7} />
    ));
  };
  const dash = -(frame * 6) % 40;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Eisenkern-Rahmen */}
      <rect x={x0} y={y0} width={w} height={h} rx={12} fill="none" stroke="#94a3b8" strokeWidth={t} />
      {/* Feldfluss im Kern (Mittellinie) */}
      {flow && (
        <rect
          x={x0}
          y={y0}
          width={w}
          height={h}
          rx={12}
          fill="none"
          stroke={COLORS.amber}
          strokeWidth={6}
          strokeDasharray="14 26"
          strokeDashoffset={dash}
          opacity={0.8}
        />
      )}
      {coil(legL, n1, COLORS.amber)}
      {coil(legR, n2, secLive ? COLORS.sky : '#475569')}
      <text x={legL} y={y0 - 16} fontSize={24} fontWeight="800" fill={COLORS.amber} textAnchor="middle">Primär · {n1}</text>
      <text x={legR} y={y0 - 16} fontSize={24} fontWeight="800" fill={secLive ? COLORS.sky : COLORS.muted} textAnchor="middle">Sekundär · {n2}</text>
    </svg>
  );
};

// ── Kleine Spannungs-Kurve (Sinus/konstant) über die Zeit ──────────────
export const Wave: React.FC<{ x0: number; y0: number; w: number; h: number; omega: number; amp: number; frame: number; dc?: boolean; color?: string }> = ({
  x0,
  y0,
  w,
  h,
  omega,
  amp,
  frame,
  dc = false,
  color = COLORS.green,
}) => {
  const pxPerFrame = 3;
  const pts: string[] = [];
  for (let px = 0; px <= w; px += 4) {
    const tt = frame - (w - px) / pxPerFrame;
    const y = dc ? y0 - amp * (h / 2) : y0 - amp * (h / 2) * Math.sin(tt * omega);
    pts.push(`${x0 + px},${y}`);
  }
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={COLORS.border} strokeWidth={2} />
      <line x1={x0} y1={y0 - h / 2} x2={x0} y2={y0 + h / 2} stroke={COLORS.border} strokeWidth={2} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={4} />
    </svg>
  );
};
