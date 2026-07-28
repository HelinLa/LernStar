import React from 'react';
import { COLORS } from './theme';

const P = '#ef4444'; // Proton (rot)
const N = '#64748b'; // Neutron (grau)

// Verteilt `protons` möglichst gleichmäßig auf die total Positionen (Bresenham).
const protonMask = (total: number, protons: number) => {
  const mask: boolean[] = [];
  let acc = 0;
  for (let i = 0; i < total; i++) {
    acc += protons;
    if (acc >= total) {
      acc -= total;
      mask.push(true);
    } else mask.push(false);
  }
  return mask;
};

// Atomkern: dicht gepackte Nukleonen (rote Protonen, graue Neutronen).
// Phyllotaxis-Anordnung (deterministisch), optional Zittern (instabil).
export const Nucleus: React.FC<{
  cx: number;
  cy: number;
  protons: number;
  neutrons: number;
  r?: number;
  jiggle?: number;
  frame?: number;
}> = ({ cx, cy, protons, neutrons, r = 70, jiggle = 0, frame = 0 }) => {
  const total = protons + neutrons;
  const mask = protonMask(total, protons);
  const nucleonR = Math.max(7, r / Math.sqrt(total) / 1.15);
  const nodes = Array.from({ length: total }).map((_, i) => {
    const ang = i * 2.399963; // goldener Winkel
    const rad = total <= 1 ? 0 : r * 0.82 * Math.sqrt(i / total);
    const jx = jiggle ? Math.sin((frame + i * 13) / 4) * jiggle : 0;
    const jy = jiggle ? Math.cos((frame + i * 7) / 4) * jiggle : 0;
    return { x: cx + rad * Math.cos(ang) + jx, y: cy + rad * Math.sin(ang) + jy, proton: mask[i] };
  });
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={nucleonR} fill={n.proton ? P : N} stroke="#0f172a" strokeWidth={1.5} />
      ))}
    </svg>
  );
};

// Ganzes Atom: winziger Kern + Elektronenschalen mit umlaufenden Elektronen.
export const Atom: React.FC<{
  cx: number;
  cy: number;
  shells: number[]; // Elektronen pro Schale
  frame?: number;
  rBase?: number;
}> = ({ cx, cy, shells, frame = 0, rBase = 120 }) => {
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {shells.map((count, s) => {
        const rr = rBase + s * 90;
        return (
          <g key={s}>
            <circle cx={cx} cy={cy} r={rr} fill="none" stroke={COLORS.border} strokeWidth={2} />
            {Array.from({ length: count }).map((_, e) => {
              const ang = (frame / 30) * (1.2 - s * 0.3) + (e / count) * Math.PI * 2;
              return <circle key={e} cx={cx + rr * Math.cos(ang)} cy={cy + rr * Math.sin(ang)} r={13} fill={COLORS.sky} stroke="#0f172a" strokeWidth={2} />;
            })}
          </g>
        );
      })}
      {/* Kern (klein) */}
      <circle cx={cx} cy={cy} r={30} fill="url(#nucg)" />
      <defs>
        <radialGradient id="nucg" cx="40%" cy="35%">
          <stop offset="0" stopColor="#fca5a5" />
          <stop offset="1" stopColor="#b91c1c" />
        </radialGradient>
      </defs>
    </svg>
  );
};

// Legende-Chip für ein Teilchen
export const PartChip: React.FC<{ color: string; label: string; sign?: string }> = ({ color, label, sign }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
    <div style={{ width: 34, height: 34, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 20 }}>{sign}</div>
    <div style={{ fontSize: 26, fontWeight: 800 }}>{label}</div>
  </div>
);
