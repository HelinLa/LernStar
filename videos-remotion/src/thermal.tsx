import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Gemeinsame Wärme-Bausteine (für alle Kl.6-Temperatur/Wärme-Videos) ──

export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// Thermometer: Kugel unten, steigende rote Säule, Skala. temp in °C (0..100 Standard).
export const Thermometer: React.FC<{
  x: number;
  y: number; // Oberkante des Rohrs
  h?: number;
  temp: number;
  min?: number;
  max?: number;
  label?: string;
}> = ({ x, y, h = 460, temp, min = 0, max = 100, label }) => {
  const bulbR = 46;
  const tubeW = 34;
  const frac = Math.max(0, Math.min(1, (temp - min) / (max - min)));
  const colH = frac * h;
  return (
    <div style={{ position: 'absolute', left: x - bulbR, top: y }}>
      {/* Rohr */}
      <div style={{ position: 'absolute', left: bulbR - tubeW / 2, top: 0, width: tubeW, height: h, borderRadius: tubeW / 2, background: '#e2e8f0', border: '3px solid #94a3b8' }} />
      {/* rote Säule */}
      <div style={{ position: 'absolute', left: bulbR - tubeW / 2 + 4, top: h - colH, width: tubeW - 8, height: colH + bulbR, background: 'linear-gradient(180deg,#f87171,#dc2626)', borderRadius: 8 }} />
      {/* Kugel */}
      <div style={{ position: 'absolute', left: 0, top: h - bulbR, width: bulbR * 2, height: bulbR * 2, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #f87171, #dc2626)', border: '3px solid #94a3b8' }} />
      {/* Skalenstriche */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: bulbR + tubeW / 2 + 4, top: (h / 5) * i - 2, fontSize: 20, fontWeight: 700, color: COLORS.muted }}>
          {Math.round(max - ((max - min) / 5) * i)}°
        </div>
      ))}
      {/* Anzeige */}
      <div style={{ position: 'absolute', left: -bulbR - 20, top: h + bulbR * 2 + 10, width: bulbR * 2 + 40, textAlign: 'center', fontSize: 40, fontWeight: 900, color: COLORS.red }}>
        {Math.round(temp)} °C
      </div>
      {label ? (
        <div style={{ position: 'absolute', left: -bulbR - 20, top: h + bulbR * 2 + 58, width: bulbR * 2 + 40, textAlign: 'center', fontSize: 24, fontWeight: 700, color: COLORS.muted }}>{label}</div>
      ) : null}
    </div>
  );
};

// Teilchenbox: Anordnung fest/flüssig/gas, Bewegung skaliert mit temp (0..1).
export const ParticleBox: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  state?: 'solid' | 'liquid' | 'gas';
  heat?: number; // 0..1 Bewegungsintensität
  color?: string;
  label?: string;
}> = ({ x, y, w = 380, h = 380, state = 'solid', heat = 0.4, color = COLORS.sky, label }) => {
  const frame = useCurrentFrame();
  let particles: { bx: number; by: number }[] = [];
  if (state === 'solid') {
    const cols = 6;
    for (let r = 0; r < 6; r++) for (let c = 0; c < cols; c++) particles.push({ bx: (c + 0.5) / cols, by: (r + 0.5) / 6 });
  } else if (state === 'liquid') {
    const n = 28;
    for (let i = 0; i < n; i++) particles.push({ bx: ((i * 37) % 100) / 100 * 0.9 + 0.05, by: (Math.floor(i / 6) + 0.5) / 5 * 0.6 + 0.38 });
  } else {
    const n = 12;
    for (let i = 0; i < n; i++) particles.push({ bx: ((i * 53) % 100) / 100 * 0.9 + 0.05, by: ((i * 71) % 100) / 100 * 0.9 + 0.05 });
  }
  const amp = (state === 'gas' ? 40 : state === 'liquid' ? 16 : 7) * (0.4 + heat);
  const speed = 0.15 + heat * 0.4;
  const r = state === 'gas' ? 15 : 17;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 16, border: `3px solid ${COLORS.border}`, background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
      {particles.map((p, i) => {
        const dx = Math.sin(frame * speed + i * 1.7) * amp;
        const dy = Math.cos(frame * speed + i * 2.3) * amp;
        return (
          <div key={i} style={{ position: 'absolute', left: p.bx * w - r + dx, top: p.by * h - r + dy, width: r * 2, height: r * 2, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
        );
      })}
      {label ? (
        <div style={{ position: 'absolute', bottom: 8, left: 0, width: '100%', textAlign: 'center', fontSize: 24, fontWeight: 800, color: COLORS.ink }}>{label}</div>
      ) : null}
    </div>
  );
};

// Aufsteigende Wärmewellen (rote Schlangenlinien).
export const HeatWaves: React.FC<{ x: number; y: number; w?: number; count?: number; opacity?: number }> = ({
  x,
  y,
  w = 160,
  count = 3,
  opacity = 0.8,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: 'absolute', left: x - w / 2, top: y - 160, width: w, height: 180, opacity }} viewBox={`0 0 ${w} 180`}>
      {Array.from({ length: count }).map((_, i) => {
        const off = (i - (count - 1) / 2) * (w / (count + 1));
        const pts = Array.from({ length: 10 }).map((_, k) => {
          const yy = 170 - k * 18;
          const xx = w / 2 + off + Math.sin(k / 1.5 + frame / 10 + i) * 12;
          return `${xx},${yy}`;
        }).join(' ');
        return <polyline key={i} points={pts} fill="none" stroke="#f87171" strokeWidth={4} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// Sonne mit Strahlen (für Strahlung / dunkle Flächen).
export const Sun: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 70 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
      <div style={{ position: 'absolute', inset: -r * 0.5, borderRadius: '50%', background: 'radial-gradient(circle,#fef08a,transparent 70%)', transform: `scale(${1 + Math.sin(frame / 12) * 0.06})` }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#fff,#fbbf24)', boxShadow: '0 0 50px #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: r * 1.1 }}>☀️</div>
    </div>
  );
};
