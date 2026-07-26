import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Gemeinsame Linsen-/Optik-Bausteine (Kl.7 „Wie wir sehen") ───────────
// Alle SVG-Elemente arbeiten auf der vollen Bühne (viewBox 0 0 1920 1080).

export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// Optische Achse (waagerecht, gestrichelt).
export const Axis: React.FC<{ y: number; x1?: number; x2?: number }> = ({ y, x1 = 120, x2 = 1800 }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={COLORS.muted} strokeWidth={2} strokeDasharray="8 10" />
  </svg>
);

// Sammellinse (bikonvex) mit Brennpunkten F.
export const ConvexLens: React.FC<{ cx: number; cy: number; h?: number; f?: number; showF?: boolean }> = ({ cx, cy, h = 360, f = 300, showF = true }) => {
  const w = 60;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <path d={`M ${cx},${cy - h / 2} Q ${cx + w},${cy} ${cx},${cy + h / 2} Q ${cx - w},${cy} ${cx},${cy - h / 2} Z`} fill="rgba(56,189,248,0.22)" stroke={COLORS.sky} strokeWidth={4} />
      {showF ? (
        <>
          <circle cx={cx - f} cy={cy} r={7} fill={COLORS.amber} />
          <circle cx={cx + f} cy={cy} r={7} fill={COLORS.amber} />
          <text x={cx - f - 8} y={cy + 40} fontSize={26} fill={COLORS.amber} fontWeight="bold">F</text>
          <text x={cx + f - 8} y={cy + 40} fontSize={26} fill={COLORS.amber} fontWeight="bold">F</text>
        </>
      ) : null}
    </svg>
  );
};

// Zerstreuungslinse (bikonkav).
export const ConcaveLens: React.FC<{ cx: number; cy: number; h?: number }> = ({ cx, cy, h = 340 }) => {
  const w = 34;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <path d={`M ${cx - w},${cy - h / 2} L ${cx + w},${cy - h / 2} Q ${cx - 6},${cy} ${cx + w},${cy + h / 2} L ${cx - w},${cy + h / 2} Q ${cx + 6},${cy} ${cx - w},${cy - h / 2} Z`} fill="rgba(129,140,248,0.22)" stroke={COLORS.indigo} strokeWidth={4} />
    </svg>
  );
};

// Pfeil als Gegenstand/Bild (nach oben = aufrecht, negativ h = umgekehrt).
export const OArrow: React.FC<{ x: number; baseY: number; h: number; color?: string; label?: string; dashed?: boolean }> = ({ x, baseY, h, color = COLORS.green, label, dashed }) => {
  const topY = baseY - h;
  const dir = h >= 0 ? 1 : -1;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={x} y1={baseY} x2={x} y2={topY} stroke={color} strokeWidth={6} strokeDasharray={dashed ? '8 6' : undefined} />
      <polygon points={`${x - 14},${topY + dir * 20} ${x + 14},${topY + dir * 20} ${x},${topY}`} fill={color} opacity={dashed ? 0.7 : 1} />
      {label ? <text x={x + 16} y={topY + dir * 10} fontSize={24} fill={color} fontWeight="bold">{label}</text> : null}
    </svg>
  );
};

// Vollständige Bildkonstruktion an einer Sammellinse.
// f = Brennweite (px), g = Gegenstandsweite (px, >0), objH = Gegenstandshöhe (px).
// Zeichnet 2 Konstruktionsstrahlen + Bild (reell oder virtuell).
export const LensImage: React.FC<{
  cx: number;
  axisY: number;
  f: number;
  g: number;
  objH?: number;
  progress?: number;
  showObject?: boolean;
}> = ({ cx, axisY, f, g, objH = 180, progress = 1, showObject = true }) => {
  const objX = cx - g;
  const objTop = axisY - objH;
  const Fright = cx + f;
  const Fleft = cx - f;
  const virtual = g < f;
  // Linsengleichung: 1/f = 1/b + 1/g  → b = f*g/(g-f)
  const b = (f * g) / (g - f); // g<f → b negativ (virtuell, links)
  const imgX = cx + b;
  const B = -objH * b / g; // Bildhöhe signiert
  const imgTop = axisY - B;
  // Strahl 1 (parallel → durch F rechts). Richtung nach dem Objektiv:
  const dir1x = Fright - cx, dir1y = axisY - objTop;
  const end1 = 1800;
  const t1 = (end1 - cx) / dir1x;
  const r1ex = end1, r1ey = objTop + dir1y * t1;
  // Strahl 2 (Mittelpunktstrahl, gerade durch cx,axisY).
  const dir2x = cx - objX, dir2y = axisY - objTop;
  const t2 = (end1 - objX) / dir2x;
  const r2ex = end1, r2ey = objTop + dir2y * t2;
  const pIn = Math.min(1, progress * 2);
  const pOut = Math.max(0, Math.min(1, progress * 2 - 1));
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Objekt */}
      {showObject ? (
        <>
          <line x1={objX} y1={axisY} x2={objX} y2={objTop} stroke={COLORS.green} strokeWidth={6} />
          <polygon points={`${objX - 14},${objTop + 20} ${objX + 14},${objTop + 20} ${objX},${objTop}`} fill={COLORS.green} />
        </>
      ) : null}
      {/* Strahl 1: Objektspitze → parallel bis Linse */}
      <line x1={objX} y1={objTop} x2={cx} y2={objTop} stroke={COLORS.amber} strokeWidth={4} opacity={0.9 * pIn} />
      {/* Strahl 1 nach Linse: durch Fright */}
      <line x1={cx} y1={objTop} x2={cx + (r1ex - cx) * pOut} y2={objTop + (r1ey - objTop) * pOut} stroke={COLORS.amber} strokeWidth={4} opacity={0.9} />
      {/* Strahl 2: Mittelpunktstrahl gerade */}
      <line x1={objX} y1={objTop} x2={objX + (r2ex - objX) * Math.max(pIn, pOut)} y2={objTop + (r2ey - objTop) * Math.max(pIn, pOut)} stroke={COLORS.sky} strokeWidth={4} opacity={0.9} />
      {/* virtuelle Rückverlängerungen (gestrichelt) bei g<f */}
      {virtual && pOut > 0.5 ? (
        <>
          <line x1={cx} y1={objTop} x2={imgX} y2={imgTop} stroke={COLORS.amber} strokeWidth={3} strokeDasharray="8 6" opacity={0.6} />
          <line x1={cx} y1={axisY} x2={imgX} y2={imgTop} stroke={COLORS.sky} strokeWidth={3} strokeDasharray="8 6" opacity={0.6} />
        </>
      ) : null}
      {/* Bild */}
      {pOut > 0.6 ? (
        <>
          <line x1={imgX} y1={axisY} x2={imgX} y2={imgTop} stroke={virtual ? COLORS.indigo : COLORS.red} strokeWidth={6} strokeDasharray={virtual ? '8 6' : undefined} />
          <polygon points={`${imgX - 14},${imgTop + (B >= 0 ? 20 : -20)} ${imgX + 14},${imgTop + (B >= 0 ? 20 : -20)} ${imgX},${imgTop}`} fill={virtual ? COLORS.indigo : COLORS.red} opacity={virtual ? 0.8 : 1} />
        </>
      ) : null}
    </svg>
  );
};
