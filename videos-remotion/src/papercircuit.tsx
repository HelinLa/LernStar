import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { PAPER } from './paper';

// ── Helle Stromkreis-Bausteine (Karo-Design) für Kl.5-Stromkreis-Videos ──
// Eigenständig neben dem dunklen circuit.tsx – bricht keine Bestandsvideos.
// SVG arbeitet auf der vollen Bühne (viewBox 0 0 1920 1080).

const INK = PAPER.ink;       // Draht-Tinte
const ELEC = '#2563eb';      // Elektron (blau)

// Umfangs-Punkt (Uhrzeigersinn: oben→ rechts↓ unten← links↑), s in [0,1).
const onRect = (s: number, LX: number, RX: number, TY: number, BY: number): [number, number] => {
  const w = RX - LX, h = BY - TY, per = 2 * (w + h);
  let d = (((s % 1) + 1) % 1) * per;
  if (d < w) return [LX + d, TY];
  d -= w;
  if (d < h) return [RX, TY + d];
  d -= h;
  if (d < w) return [RX - d, BY];
  d -= w;
  return [LX, BY - d];
};

// Rechteckiger Draht mit gleichmäßig umlaufenden Elektronen (widerlegt "Verbrauch").
export const PaperWire: React.FC<{
  LX: number; RX: number; TY: number; BY: number;
  on?: boolean; count?: number; speed?: number;
  gapBottom?: number; // Lücke unten Mitte (für Batterie)
  color?: string;
}> = ({ LX, RX, TY, BY, on = true, count = 16, speed = 1, gapBottom = 0, color = INK }) => {
  const frame = useCurrentFrame();
  const midX = (LX + RX) / 2;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <polyline points={`${LX},${BY} ${LX},${TY} ${RX},${TY} ${RX},${BY}`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      {gapBottom > 0 ? (
        <>
          <line x1={LX} y1={BY} x2={midX - gapBottom / 2} y2={BY} stroke={color} strokeWidth={7} strokeLinecap="round" />
          <line x1={midX + gapBottom / 2} y1={BY} x2={RX} y2={BY} stroke={color} strokeWidth={7} strokeLinecap="round" />
        </>
      ) : (
        <line x1={LX} y1={BY} x2={RX} y2={BY} stroke={color} strokeWidth={7} strokeLinecap="round" />
      )}
      {on
        ? Array.from({ length: count }).map((_, i) => {
            const s = (frame / (70 / speed) + i / count) % 1;
            const [x, y] = onRect(s, LX, RX, TY, BY);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={9} fill={ELEC} />
                <circle cx={x} cy={y} r={9} fill="none" stroke="#fff" strokeWidth={1.5} />
                <text x={x} y={y + 4} fontSize={12} fill="#fff" textAnchor="middle" fontWeight="900">−</text>
              </g>
            );
          })
        : null}
    </svg>
  );
};

// Lampe als Schaltzeichen ⊗ mit HELLIGKEIT 0..1 (Kern der Zwei-Lampen-Diagnose).
export const PaperLamp: React.FC<{ x: number; y: number; r?: number; brightness?: number; label?: string }> = ({
  x, y, r = 50, brightness = 1, label,
}) => {
  const b = Math.max(0, Math.min(1, brightness));
  const fill = b <= 0.02 ? '#e8ecf5' : `rgba(251, 191, 36, ${0.35 + 0.65 * b})`;
  return (
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
      {b > 0.02 ? (
        <div style={{ position: 'absolute', inset: -r * (0.5 + b), borderRadius: '50%', background: `radial-gradient(circle, rgba(251,191,36,${0.55 * b}) 0%, transparent 70%)` }} />
      ) : null}
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <circle cx={50} cy={50} r={44} fill={fill} stroke={PAPER.ink} strokeWidth={5} />
        <line x1={20} y1={20} x2={80} y2={80} stroke={PAPER.ink} strokeWidth={5} />
        <line x1={80} y1={20} x2={20} y2={80} stroke={PAPER.ink} strokeWidth={5} />
      </svg>
      {label ? (
        <div style={{ position: 'absolute', top: r * 2 + 6, left: '50%', transform: 'translateX(-50%)', fontSize: 24, fontWeight: 800, color: PAPER.inkSoft, whiteSpace: 'nowrap' }}>{label}</div>
      ) : null}
    </div>
  );
};

// "Echte" Glühlampe (Bild-Ebene) mit Helligkeit 0..1.
export const PaperBulb: React.FC<{ x: number; y: number; size?: number; brightness?: number; label?: string }> = ({
  x, y, size = 130, brightness = 1, label,
}) => {
  const b = Math.max(0, Math.min(1, brightness));
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, textAlign: 'center' }}>
      {b > 0.02 ? <div style={{ position: 'absolute', left: '50%', top: size / 2, width: size * (1 + b), height: size * (1 + b), transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, rgba(251,191,36,${0.6 * b}), transparent 70%)` }} /> : null}
      <div style={{ position: 'relative', fontSize: size, lineHeight: 1, filter: b > 0.02 ? `brightness(${0.7 + 0.6 * b})` : 'grayscale(1) brightness(0.85)' }}>💡</div>
      {label ? <div style={{ fontSize: 24, fontWeight: 800, color: PAPER.inkSoft, marginTop: 2 }}>{label}</div> : null}
    </div>
  );
};

// Batterie/Quelle als Schaltzeichen (langer + / kurzer − Strich).
export const PaperBattery: React.FC<{ x: number; y: number; label?: string }> = ({ x, y, label }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <line x1={x - 26} y1={y - 46} x2={x - 26} y2={y + 46} stroke={PAPER.ink} strokeWidth={7} />
    <line x1={x + 26} y1={y - 24} x2={x + 26} y2={y + 24} stroke={PAPER.ink} strokeWidth={13} />
    <text x={x - 44} y={y - 56} fontSize={34} fill="#dc2626" fontWeight="bold">+</text>
    <text x={x + 30} y={y - 56} fontSize={38} fill="#2563eb" fontWeight="bold">–</text>
    {label ? <text x={x} y={y + 84} fontSize={26} fill={PAPER.inkSoft} textAnchor="middle" fontWeight="bold">{label}</text> : null}
  </svg>
);

// Schalter (offen/geschlossen).
export const PaperSwitch: React.FC<{ x: number; y: number; closed?: boolean; label?: string }> = ({ x, y, closed = true, label }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
    <circle cx={x - 40} cy={y} r={7} fill={PAPER.ink} />
    <circle cx={x + 40} cy={y} r={7} fill={PAPER.ink} />
    {closed ? (
      <line x1={x - 40} y1={y} x2={x + 40} y2={y} stroke={PAPER.green} strokeWidth={7} strokeLinecap="round" />
    ) : (
      <line x1={x - 40} y1={y} x2={x + 34} y2={y - 42} stroke="#dc2626" strokeWidth={7} strokeLinecap="round" />
    )}
    {label ? <text x={x} y={y + 60} fontSize={24} fill={PAPER.inkSoft} textAnchor="middle" fontWeight="bold">{label}</text> : null}
  </svg>
);
