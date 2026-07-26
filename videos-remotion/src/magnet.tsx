import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// Sanftes „Einblenden" per Frame-Fenster – Helfer für Szenen.
export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// ── Gemeinsame Magnetismus-Bausteine (für alle Kl.5-Magnet-Videos) ──────
// SVG-Elemente arbeiten auf der vollen Bühne (viewBox 0 0 1920 1080).

const RED = '#ef4444';
const BLUE = '#3b82f6';

// Stabmagnet: rote N-Hälfte, blaue S-Hälfte. Horizontal oder per angle gedreht.
// N standardmäßig rechts. poles() liefert die Weltkoordinaten der Polenden.
export const BarMagnet: React.FC<{
  cx: number;
  cy: number;
  w?: number;
  h?: number;
  angle?: number; // Grad, im Uhrzeigersinn
  nRight?: boolean; // N rechts (Standard) oder links
  labels?: boolean;
}> = ({ cx, cy, w = 360, h = 96, angle = 0, nRight = true, labels = true }) => {
  const nColor = RED;
  const sColor = BLUE;
  const left = nRight ? sColor : nColor;
  const right = nRight ? nColor : sColor;
  const leftLabel = nRight ? 'S' : 'N';
  const rightLabel = nRight ? 'N' : 'S';
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        transform: `rotate(${angle}deg)`,
        display: 'flex',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 12px 34px rgba(0,0,0,0.45)',
      }}
    >
      <div style={{ flex: 1, background: `linear-gradient(180deg, ${left}, ${left}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: h * 0.5, fontWeight: 900 }}>
        {labels ? leftLabel : ''}
      </div>
      <div style={{ flex: 1, background: `linear-gradient(180deg, ${right}, ${right}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: h * 0.5, fontWeight: 900 }}>
        {labels ? rightLabel : ''}
      </div>
    </div>
  );
};

// Feldlinien um einen horizontalen Stabmagneten (N rechts): Bögen N→S,
// oben und unten gespiegelt, mit Pfeilspitze am Scheitel (zeigt Richtung N→S).
export const FieldLines: React.FC<{
  cx: number;
  cy: number;
  L?: number; // Polabstand vom Zentrum
  bows?: number[]; // Auswölbungen
  progress?: number; // 0..1 Einblenden
  color?: string;
  arrows?: boolean;
}> = ({ cx, cy, L = 180, bows = [55, 130, 220, 320], progress = 1, color = COLORS.sky, arrows = true }) => {
  const N: [number, number] = [cx + L, cy];
  const S: [number, number] = [cx - L, cy];
  const line = (d: number, up: boolean) => {
    const sign = up ? -1 : 1;
    const c1 = `${N[0]},${cy + sign * d}`;
    const c2 = `${S[0]},${cy + sign * d}`;
    return `M ${N[0]},${N[1]} C ${c1} ${c2} ${S[0]},${S[1]}`;
  };
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: progress }} viewBox="0 0 1920 1080">
      {bows.map((d, i) => (
        <React.Fragment key={i}>
          <path d={line(d, true)} fill="none" stroke={color} strokeWidth={3} opacity={0.8} />
          <path d={line(d, false)} fill="none" stroke={color} strokeWidth={3} opacity={0.8} />
          {arrows ? (
            <>
              {/* Scheitel oben: Tangente zeigt nach links (N→S) */}
              <polygon points="0,-9 -16,0 0,9" fill={color} transform={`translate(${cx},${cy - d * 0.75}) rotate(0)`} />
              <polygon points="0,-9 -16,0 0,9" fill={color} transform={`translate(${cx},${cy + d * 0.75})`} />
            </>
          ) : null}
        </React.Fragment>
      ))}
      {/* Achse außen (gerade Linie durch die Pole hinaus) */}
      <line x1={N[0]} y1={cy} x2={N[0] + 220} y2={cy} stroke={color} strokeWidth={3} opacity={0.5} />
      <line x1={S[0]} y1={cy} x2={S[0] - 220} y2={cy} stroke={color} strokeWidth={3} opacity={0.5} />
    </svg>
  );
};

// Kompassnadel: dreht sich zu `angle` (Grad, 0 = zeigt nach oben/Norden).
// Rote Spitze = Nordsuchend.
export const CompassNeedle: React.FC<{
  x: number;
  y: number;
  size?: number;
  angle?: number; // Grad, im Uhrzeigersinn, 0 = oben
  ring?: boolean;
}> = ({ x, y, size = 120, angle = 0, ring = true }) => (
  <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size }}>
    {ring ? (
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${COLORS.muted}`, background: 'rgba(15,23,42,0.7)' }} />
    ) : null}
    <div style={{ position: 'absolute', inset: 0, transform: `rotate(${angle}deg)` }}>
      {/* Nordhälfte (rot) */}
      <div style={{ position: 'absolute', left: '50%', top: size * 0.12, width: 0, height: 0, transform: 'translateX(-50%)', borderLeft: `${size * 0.09}px solid transparent`, borderRight: `${size * 0.09}px solid transparent`, borderBottom: `${size * 0.38}px solid ${RED}` }} />
      {/* Südhälfte (weiß) */}
      <div style={{ position: 'absolute', left: '50%', bottom: size * 0.12, width: 0, height: 0, transform: 'translateX(-50%)', borderLeft: `${size * 0.09}px solid transparent`, borderRight: `${size * 0.09}px solid transparent`, borderTop: `${size * 0.38}px solid #e2e8f0` }} />
    </div>
    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, borderRadius: '50%', background: COLORS.ink, transform: 'translate(-50%,-50%)' }} />
  </div>
);

// Materialprobe: Karte mit Emoji + Name, grün (magnetisch) / grau (nicht).
export const MaterialChip: React.FC<{
  icon: string;
  name: string;
  magnetic?: boolean | null;
  delay?: number;
}> = ({ icon, name, magnetic = null, delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const border = magnetic === null ? COLORS.border : magnetic ? COLORS.green : COLORS.muted;
  return (
    <div style={{ width: 150, padding: '16px 8px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 20}px)` }}>
      <div style={{ fontSize: 46 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{name}</div>
      {magnetic !== null ? (
        <div style={{ fontSize: 24, marginTop: 4 }}>{magnetic ? '🧲✅' : '✖️'}</div>
      ) : null}
    </div>
  );
};

// Spule mit Eisenkern (Elektromagnet). windings steuert Anzahl der Wicklungen.
export const Coil: React.FC<{
  cx: number;
  cy: number;
  w?: number;
  h?: number;
  windings?: number;
  on?: boolean;
}> = ({ cx, cy, w = 300, h = 120, windings = 6, on = true }) => {
  const turns = Array.from({ length: windings });
  const gap = w / (windings + 1);
  return (
    <div style={{ position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h }}>
      {/* Eisenkern */}
      <div style={{ position: 'absolute', left: 0, top: h * 0.32, width: '100%', height: h * 0.36, background: on ? 'linear-gradient(90deg,#94a3b8,#cbd5e1)' : '#64748b', borderRadius: 8, boxShadow: on ? '0 0 30px rgba(56,189,248,0.6)' : 'none' }} />
      {/* Wicklungen */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox={`0 0 ${w} ${h}`}>
        {turns.map((_, i) => (
          <ellipse key={i} cx={gap * (i + 1)} cy={h / 2} rx={gap * 0.42} ry={h * 0.46} fill="none" stroke={on ? '#f59e0b' : '#b45309'} strokeWidth={7} />
        ))}
      </svg>
    </div>
  );
};
