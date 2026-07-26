import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Gemeinsame Astronomie-Bausteine (Sonne/Erde/Mond-Videos) ────────────

export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// Sonne: leuchtende Scheibe mit Schein.
export const Sun: React.FC<{ x: number; y: number; r?: number; label?: string }> = ({ x, y, r = 90, label }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
      <div style={{ position: 'absolute', inset: -r * 0.6, borderRadius: '50%', background: 'radial-gradient(circle,#fde68a,transparent 70%)', transform: `scale(${1 + Math.sin(frame / 14) * 0.05})` }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#fff,#f59e0b)', boxShadow: '0 0 60px #f59e0b' }} />
      {label ? <div style={{ position: 'absolute', top: r * 2 + 6, left: '50%', transform: 'translateX(-50%)', fontSize: 26, fontWeight: 800, color: COLORS.amber, whiteSpace: 'nowrap' }}>{label}</div> : null}
    </div>
  );
};

// Halb beleuchtete Kugel (Erde/Mond): die Hälfte zur Sonne ist hell.
// sunAngleDeg: Richtung zur Sonne (0 = rechts, 90 = unten, 180 = links).
export const HalfLitSphere: React.FC<{
  x: number;
  y: number;
  r: number;
  sunAngleDeg: number;
  litColor?: string;
  darkColor?: string;
  label?: string;
}> = ({ x, y, r, sunAngleDeg, litColor = '#cbd5e1', darkColor = '#1e293b', label }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', overflow: 'hidden', transform: `rotate(${sunAngleDeg}deg)`, boxShadow: '0 0 20px rgba(0,0,0,0.4)' }}>
    {/* rechte Hälfte hell (zeigt zur Sonne bei 0°), linke dunkel */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', background: darkColor }} />
    <div style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', background: litColor }} />
    {label ? <div style={{ position: 'absolute', bottom: 6, width: '100%', textAlign: 'center', fontSize: 22, fontWeight: 800, color: COLORS.ink, transform: `rotate(${-sunAngleDeg}deg)` }}>{label}</div> : null}
  </div>
);

// Gestrichelte Umlaufbahn (Ellipse).
export const Orbit: React.FC<{ cx: number; cy: number; rx: number; ry?: number }> = ({ cx, cy, rx, ry }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry ?? rx} fill="none" stroke={COLORS.border} strokeWidth={3} strokeDasharray="10 12" />
  </svg>
);

// Schattenkegel (dunkles Polygon) – für Finsternisse.
export const ShadowCone: React.FC<{ pts: [number, number][]; opacity?: number }> = ({ pts, opacity = 0.55 }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="#020617" opacity={opacity} />
  </svg>
);

// Mondphasen-Reihe (Emoji – eindeutig korrekt).
export const PHASES: { icon: string; name: string }[] = [
  { icon: '🌑', name: 'Neumond' },
  { icon: '🌒', name: 'zunehmend' },
  { icon: '🌓', name: 'Halbmond' },
  { icon: '🌔', name: 'zunehmend' },
  { icon: '🌕', name: 'Vollmond' },
  { icon: '🌖', name: 'abnehmend' },
  { icon: '🌗', name: 'Halbmond' },
  { icon: '🌘', name: 'abnehmend' },
];
