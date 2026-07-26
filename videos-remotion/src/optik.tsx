import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './theme';

// ── Gemeinsame Optik-Bausteine (für alle Licht/Schatten-Videos) ─────────
// Alle SVG-Elemente arbeiten auf der vollen Bühne (viewBox 0 0 1920 1080)
// und werden direkt auf eine AbsoluteFill gelegt – nicht in Offset-Wrapper.

// Lichtquelle: leuchtende Kugel mit weichem Schein (Emoji optional).
export const LightSource: React.FC<{
  x: number;
  y: number;
  r?: number;
  color?: string;
  emoji?: string;
  label?: string;
  glow?: number; // 0..1 Intensität
}> = ({ x, y, r = 54, color = COLORS.amber, emoji = '💡', label, glow = 1 }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 10) * 0.05 * glow;
  return (
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
      <div
        style={{
          position: 'absolute',
          inset: -r * 1.4,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}${Math.round(90 * glow)
            .toString(16)
            .padStart(2, '0')} 0%, transparent 70%)`,
          transform: `scale(${pulse})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: r * 1.3,
          background: `radial-gradient(circle at 35% 30%, #fff, ${color})`,
          boxShadow: `0 0 ${40 * glow}px ${color}`,
        }}
      >
        {emoji}
      </div>
      {label ? (
        <div
          style={{
            position: 'absolute',
            top: r * 2 + 8,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 28,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

// Lichtstrahl: gerade Linie, die von `progress` (0..1) heraus „wächst".
// Optional gestrichelt und mit Pfeilspitze.
export const Ray: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress?: number; // 0..1 wie weit der Strahl gezeichnet ist
  color?: string;
  width?: number;
  arrow?: boolean;
  opacity?: number;
}> = ({ x1, y1, x2, y2, progress = 1, color = COLORS.amber, width = 5, arrow = false, opacity = 0.9 }) => {
  const ex = x1 + (x2 - x1) * progress;
  const ey = y1 + (y2 - y1) * progress;
  const ang = (Math.atan2(ey - y1, ex - x1) * 180) / Math.PI;
  return (
    <svg
      style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity }}
      viewBox="0 0 1920 1080"
    >
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {arrow && progress > 0.05 ? (
        <polygon points="0,-13 20,0 0,13" fill={color} transform={`translate(${ex},${ey}) rotate(${ang})`} />
      ) : null}
    </svg>
  );
};

// Ein Fächer aus Strahlen von einem Punkt zu mehreren Zielen.
export const RayFan: React.FC<{
  from: [number, number];
  targets: [number, number][];
  progress?: number;
  color?: string;
  width?: number;
  opacity?: number;
}> = ({ from, targets, progress = 1, color = COLORS.amber, width = 4, opacity = 0.85 }) => (
  <>
    {targets.map((t, i) => (
      <Ray key={i} x1={from[0]} y1={from[1]} x2={t[0]} y2={t[1]} progress={progress} color={color} width={width} opacity={opacity} />
    ))}
  </>
);

// Auge (Empfänger). `open` steuert Pupille/Lider grob über Emoji-Wahl.
export const Eye: React.FC<{ x: number; y: number; size?: number; label?: string; seeing?: boolean }> = ({
  x,
  y,
  size = 120,
  label,
  seeing = true,
}) => (
  <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, textAlign: 'center' }}>
    <div style={{ fontSize: size, lineHeight: 1, filter: seeing ? 'none' : 'grayscale(1) opacity(0.5)' }}>👁️</div>
    {label ? (
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6, color: seeing ? COLORS.ink : COLORS.muted }}>
        {label}
      </div>
    ) : null}
  </div>
);

// Undurchsichtiger Körper (wirft Schatten). Rechteck oder Emoji.
export const Body: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  color?: string;
  emoji?: string;
  label?: string;
}> = ({ x, y, w = 70, h = 200, color = COLORS.indigo, emoji, label }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h }}>
    {emoji ? (
      <div style={{ fontSize: Math.min(w, h) * 0.9, textAlign: 'center', lineHeight: `${h}px` }}>{emoji}</div>
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
          background: color,
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        }}
      />
    )}
    {label ? (
      <div
        style={{
          position: 'absolute',
          top: h + 8,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 26,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    ) : null}
  </div>
);

// Projektionsschirm (senkrechte Wand rechts).
export const Screen: React.FC<{ x: number; yTop?: number; yBot?: number; label?: string }> = ({
  x,
  yTop = 240,
  yBot = 900,
  label,
}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: x,
        top: yTop,
        width: 22,
        height: yBot - yTop,
        borderRadius: 8,
        background: 'linear-gradient(90deg,#e2e8f0,#94a3b8)',
        boxShadow: '0 0 24px rgba(0,0,0,0.4)',
      }}
    />
    {label ? (
      <div style={{ position: 'absolute', left: x - 40, top: yBot + 8, fontSize: 26, fontWeight: 700, color: COLORS.muted }}>
        {label}
      </div>
    ) : null}
  </>
);

// Schattenfläche auf dem Schirm (weicher Verlauf für Halbschatten).
export const ShadowPatch: React.FC<{
  x: number;
  yTop: number;
  yBot: number;
  w?: number;
  soft?: number; // 0 = scharf, >0 = Halbschattenrand in px
  opacity?: number;
}> = ({ x, yTop, yBot, w = 22, soft = 0, opacity = 0.8 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: yTop,
      width: w,
      height: yBot - yTop,
      background: '#0b1120',
      opacity,
      filter: soft > 0 ? `blur(${soft}px)` : 'none',
      borderRadius: 4,
    }}
  />
);

// Sanftes „Einblenden" per Frame-Fenster – Helfer für Szenen.
export const useFade = (delay: number, len = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};
