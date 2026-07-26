import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Brechung / Prisma / Farbmischung (Kl.7 „Spiegel, Brechung & Farben") ─

export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

export const SPECTRUM = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'];

// Zwei Medien (oben/unten) mit Grenzfläche bei y=boundaryY.
export const MediaSplit: React.FC<{ boundaryY: number; topLabel?: string; botLabel?: string; botColor?: string }> = ({
  boundaryY,
  topLabel = 'Luft',
  botLabel = 'Wasser',
  botColor = 'rgba(56,189,248,0.16)',
}) => (
  <>
    <div style={{ position: 'absolute', left: 0, top: boundaryY, width: '100%', height: 1080 - boundaryY, background: botColor }} />
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={120} y1={boundaryY} x2={1800} y2={boundaryY} stroke={COLORS.sky} strokeWidth={3} />
    </svg>
    <div style={{ position: 'absolute', left: 150, top: boundaryY - 50, fontSize: 26, fontWeight: 800, color: COLORS.muted }}>{topLabel}</div>
    <div style={{ position: 'absolute', left: 150, top: boundaryY + 16, fontSize: 26, fontWeight: 800, color: COLORS.sky }}>{botLabel}</div>
  </>
);

// Gebrochener Strahl: einfallend (Winkel aIn zum Lot) → gebrochen (Winkel aOut zum Lot).
// hitX/hitY = Auftreffpunkt auf der Grenzfläche. Lot ist senkrecht.
export const RefractRay: React.FC<{
  hitX: number;
  hitY: number;
  aIn: number; // Grad zum Lot (einfallend, von oben-links)
  aOut: number; // Grad zum Lot (gebrochen, nach unten)
  L?: number;
  showNormal?: boolean;
  reflect?: number; // 0..1 Anteil reflektierter Strahl (optional)
  labels?: boolean;
}> = ({ hitX, hitY, aIn, aOut, L = 380, showNormal = true, reflect = 0, labels = true }) => {
  const rIn = (aIn * Math.PI) / 180;
  const rOut = (aOut * Math.PI) / 180;
  const inX = hitX - Math.sin(rIn) * L, inY = hitY - Math.cos(rIn) * L;
  const outX = hitX + Math.sin(rOut) * L, outY = hitY + Math.cos(rOut) * L;
  const refX = hitX + Math.sin(rIn) * L, refY = hitY - Math.cos(rIn) * L;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {showNormal ? <line x1={hitX} y1={hitY - L} x2={hitX} y2={hitY + L} stroke={COLORS.muted} strokeWidth={2} strokeDasharray="8 8" /> : null}
      {/* einfallender Strahl */}
      <line x1={inX} y1={inY} x2={hitX} y2={hitY} stroke={COLORS.amber} strokeWidth={5} />
      <polygon points="0,-10 16,0 0,10" fill={COLORS.amber} transform={`translate(${(inX + hitX) / 2},${(inY + hitY) / 2}) rotate(${(Math.atan2(hitY - inY, hitX - inX) * 180) / Math.PI})`} />
      {/* gebrochener Strahl */}
      <line x1={hitX} y1={hitY} x2={outX} y2={outY} stroke={COLORS.green} strokeWidth={5} />
      {/* reflektierter Anteil */}
      {reflect > 0 ? <line x1={hitX} y1={hitY} x2={refX} y2={refY} stroke={COLORS.red} strokeWidth={4} opacity={reflect} /> : null}
      {labels ? (
        <>
          <text x={hitX - 90} y={hitY - 40} fontSize={24} fill={COLORS.amber} fontWeight="bold">{Math.round(aIn)}°</text>
          <text x={hitX + 40} y={hitY + 60} fontSize={24} fill={COLORS.green} fontWeight="bold">{Math.round(aOut)}°</text>
        </>
      ) : null}
    </svg>
  );
};

// Prisma (Dreieck) mit weißem Eingangsstrahl und aufgefächertem Spektrum.
export const Prism: React.FC<{ cx: number; cy: number; size?: number; progress?: number }> = ({ cx, cy, size = 200, progress = 1 }) => {
  const top: [number, number] = [cx, cy - size];
  const bl: [number, number] = [cx - size * 0.9, cy + size];
  const br: [number, number] = [cx + size * 0.9, cy + size];
  const hit: [number, number] = [cx - size * 0.45, cy];
  const exit: [number, number] = [cx + size * 0.45, cy + size * 0.2];
  const spread = 90;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* weißer Eingangsstrahl */}
      <line x1={hit[0] - 320} y1={hit[1] - 60} x2={hit[0]} y2={hit[1]} stroke="#f8fafc" strokeWidth={6} />
      {/* Prisma */}
      <polygon points={`${top[0]},${top[1]} ${bl[0]},${bl[1]} ${br[0]},${br[1]}`} fill="rgba(148,163,184,0.15)" stroke={COLORS.sky} strokeWidth={4} />
      {/* Spektrum-Fächer beim Austritt */}
      {SPECTRUM.map((c, i) => {
        const ang = 18 + (i / (SPECTRUM.length - 1)) * (spread - 18);
        const rad = (ang * Math.PI) / 180;
        const ex = exit[0] + Math.cos(rad) * 520 * progress;
        const ey = exit[1] + Math.sin(rad) * 520 * progress;
        return <line key={i} x1={exit[0]} y1={exit[1]} x2={ex} y2={ey} stroke={c} strokeWidth={6} opacity={0.95} />;
      })}
    </svg>
  );
};

// Additive RGB-Kreise (Farbmischung) – HTML-Divs mit mixBlendMode:'screen'
// (zuverlässig im Chromium-Compositor, anders als SVG-Gruppen-Blend).
export const RgbCircles: React.FC<{ cx: number; cy: number; r?: number; on?: [boolean, boolean, boolean] }> = ({ cx, cy, r = 150, on = [true, true, true] }) => {
  const d = r * 0.82;
  const circles: { x: number; y: number; c: string; vis: boolean }[] = [
    { x: cx, y: cy - d * 0.72, c: '#ff0000', vis: on[0] }, // Rot oben
    { x: cx - d * 0.72, y: cy + d * 0.5, c: '#00ff00', vis: on[1] }, // Grün unten links
    { x: cx + d * 0.72, y: cy + d * 0.5, c: '#0000ff', vis: on[2] }, // Blau unten rechts
  ];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', isolation: 'isolate' }}>
      {circles.map((c, i) =>
        c.vis ? (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.x - r,
              top: c.y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: c.c,
              mixBlendMode: 'screen',
            }}
          />
        ) : null
      )}
    </div>
  );
};
