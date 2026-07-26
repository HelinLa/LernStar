import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Elektrik-Bausteine (Kl.8: Spannung, Strom, Widerstand, Leistung) ────

export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// Ladungskugel (+ rot / − blau) mit Schein.
export const ChargeBall: React.FC<{ x: number; y: number; r?: number; sign: '+' | '−'; label?: string }> = ({ x, y, r = 60, sign, label }) => {
  const col = sign === '+' ? '#ef4444' : '#3b82f6';
  return (
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
      <div style={{ position: 'absolute', inset: -r * 0.4, borderRadius: '50%', background: `radial-gradient(circle, ${col}77, transparent 70%)` }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${col})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: r * 1.2, fontWeight: 900, color: '#fff' }}>
        {sign}
      </div>
      {label ? <div style={{ position: 'absolute', top: r * 2 + 6, left: '50%', transform: 'translateX(-50%)', fontSize: 24, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</div> : null}
    </div>
  );
};

// Messgerät-Symbol: Kreis mit Buchstabe (A = Amperemeter, V = Voltmeter).
export const Meter: React.FC<{ x: number; y: number; kind: 'A' | 'V'; r?: number; active?: boolean }> = ({ x, y, kind, r = 54, active = true }) => {
  const col = kind === 'A' ? COLORS.amber : COLORS.green;
  return (
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#0f172a', border: `5px solid ${active ? col : COLORS.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: r * 1.05, fontWeight: 900, color: active ? col : COLORS.muted }}>
      {kind}
    </div>
  );
};

// Widerstand-Schaltzeichen (Rechteck) im Draht.
export const ResistorSym: React.FC<{ x: number; y: number; w?: number; label?: string; color?: string }> = ({ x, y, w = 120, label, color = COLORS.sky }) => (
  <>
    <div style={{ position: 'absolute', left: x - w / 2, top: y - 26, width: w, height: 52, borderRadius: 6, background: '#0f172a', border: `4px solid ${color}` }} />
    {label ? <div style={{ position: 'absolute', left: x - w / 2, top: y + 34, width: w, textAlign: 'center', fontSize: 24, fontWeight: 800, color }}>{label}</div> : null}
  </>
);

// Wasser-Analogie: Tank (Druck=Spannung) + Rohr mit Fluss (Menge=Strom).
export const WaterAnalogy: React.FC<{ x: number; y: number; pressure?: number; flow?: number }> = ({ x, y, pressure = 1, flow = 1 }) => {
  const frame = useCurrentFrame();
  const tankH = 120 + pressure * 120;
  return (
    <div style={{ position: 'absolute', left: x, top: y }}>
      {/* Tank */}
      <div style={{ position: 'absolute', left: 0, top: -tankH, width: 130, height: tankH, borderRadius: '10px 10px 0 0', border: `4px solid ${COLORS.sky}`, background: `linear-gradient(180deg, transparent, rgba(56,189,248,0.35))` }} />
      <div style={{ position: 'absolute', left: 4, top: -tankH + 6, width: 122, textAlign: 'center', fontSize: 22, fontWeight: 800, color: COLORS.sky }}>Druck</div>
      {/* Rohr */}
      <div style={{ position: 'absolute', left: 130, top: -30, width: 400, height: 44, background: 'rgba(56,189,248,0.18)', borderTop: `4px solid ${COLORS.sky}`, borderBottom: `4px solid ${COLORS.sky}` }} />
      {/* Fluss-Tropfen */}
      {Array.from({ length: 6 }).map((_, i) => {
        const p = ((frame * (0.4 + flow * 0.5) + i * 8) % 400);
        return <div key={i} style={{ position: 'absolute', left: 130 + p, top: -14, width: 14, height: 14, borderRadius: '50%', background: COLORS.sky }} />;
      })}
    </div>
  );
};
