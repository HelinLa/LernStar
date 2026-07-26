import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Gemeinsame Schall-Bausteine (für alle Kl.6-Schall-Videos) ───────────

export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// Sinus-Wellenform. amplitude in px, freq = Anzahl Wellen über die Breite.
export const Waveform: React.FC<{
  x: number;
  y: number; // Mittellinie
  w?: number;
  amplitude?: number;
  freq?: number;
  color?: string;
  width?: number;
  progress?: number; // 0..1 wie weit gezeichnet
  animate?: boolean;
}> = ({ x, y, w = 900, amplitude = 90, freq = 4, color = COLORS.sky, width = 6, progress = 1, animate = true }) => {
  const frame = useCurrentFrame();
  const phase = animate ? frame / 6 : 0;
  const n = Math.round(w * progress);
  const pts: string[] = [];
  for (let i = 0; i <= n; i += 4) {
    const px = x + i;
    const py = y - Math.sin((i / w) * freq * Math.PI * 2 + phase) * amplitude;
    pts.push(`${px},${py}`);
  }
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={COLORS.border} strokeWidth={2} strokeDasharray="6 8" />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Schwingende Saite (Bogen, der hin- und herschwingt). vibrating steuert Ausschlag.
export const String: React.FC<{
  x1: number;
  x2: number;
  y: number;
  vibrating?: boolean;
  amp?: number;
  color?: string;
}> = ({ x1, x2, y, vibrating = true, amp = 40, color = COLORS.amber }) => {
  const frame = useCurrentFrame();
  const a = vibrating ? Math.sin(frame / 3) * amp : 0;
  const midX = (x1 + x2) / 2;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Schwingungs-Geister */}
      {vibrating
        ? [0.4, 0.7].map((o, i) => (
            <path key={i} d={`M ${x1},${y} Q ${midX},${y - a * o} ${x2},${y}`} fill="none" stroke={color} strokeWidth={3} opacity={0.25} />
          ))
        : null}
      <path d={`M ${x1},${y} Q ${midX},${y - a} ${x2},${y}`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
      {/* Halterungen */}
      <circle cx={x1} cy={y} r={12} fill={COLORS.muted} />
      <circle cx={x2} cy={y} r={12} fill={COLORS.muted} />
    </svg>
  );
};

// Teilchenkette: Verdichtungswelle läuft nach rechts (für Schallausbreitung).
export const ParticleChain: React.FC<{
  x: number;
  y: number;
  w?: number;
  rows?: number;
  on?: boolean;
  color?: string;
}> = ({ x, y, w = 1100, rows = 3, on = true, color = COLORS.sky }) => {
  const frame = useCurrentFrame();
  const cols = 26;
  const gap = w / cols;
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Verdichtung: Sinus-Verschiebung, die nach rechts wandert
      const disp = on ? Math.sin((c / cols) * Math.PI * 6 - frame / 4) * (gap * 0.4) : 0;
      dots.push(
        <div
          key={`${r}-${c}`}
          style={{ position: 'absolute', left: x + c * gap + disp, top: y + r * 46, width: 18, height: 18, borderRadius: '50%', background: color, opacity: 0.85 }}
        />
      );
    }
  }
  return <>{dots}</>;
};

// dB-Pegelanzeige (Balken grün→rot).
export const DbMeter: React.FC<{ x: number; y: number; db: number; w?: number }> = ({ x, y, db, w = 700 }) => {
  const frac = Math.max(0, Math.min(1, db / 130));
  const danger = db >= 85;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w }}>
      <div style={{ width: w, height: 46, borderRadius: 12, background: COLORS.panel, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
        <div style={{ width: w * frac, height: '100%', background: 'linear-gradient(90deg,#22c55e,#fbbf24 65%,#ef4444)' }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 34, fontWeight: 900, color: danger ? COLORS.red : COLORS.green }}>{Math.round(db)} dB {danger ? '⚠️' : '✅'}</div>
    </div>
  );
};

// Schall-Wellenbögen, die von einer Quelle ausgehen (konzentrische Bögen).
export const SoundWaves: React.FC<{ x: number; y: number; count?: number; color?: string; dir?: number }> = ({
  x,
  y,
  count = 4,
  color = COLORS.sky,
  dir = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {Array.from({ length: count }).map((_, i) => {
        const r = 40 + ((frame * 3 + i * 60) % (count * 60));
        const op = 1 - r / (count * 60 + 40);
        const start = dir > 0 ? -50 : 130;
        const end = dir > 0 ? 50 : 230;
        const a0 = (start * Math.PI) / 180;
        const a1 = (end * Math.PI) / 180;
        return (
          <path
            key={i}
            d={`M ${x + r * Math.cos(a0)},${y + r * Math.sin(a0)} A ${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${x + r * Math.cos(a1)},${y + r * Math.sin(a1)}`}
            fill="none"
            stroke={color}
            strokeWidth={5}
            opacity={op}
          />
        );
      })}
    </svg>
  );
};
