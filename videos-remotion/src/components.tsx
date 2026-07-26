import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, FONT, BRAND } from './theme';

// ── Hintergrund: sanfter Verlauf + feines Raster ───────────────────────
export const Bg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1400px 900px at 50% 12%, ${COLORS.bg1}, ${COLORS.bg0})`,
        fontFamily: FONT,
        color: COLORS.ink,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

// ── Kicker + großer Titel oben ─────────────────────────────────────────
export const SceneTitle: React.FC<{ kicker?: string; title: string }> = ({
  kicker,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  const y = interpolate(s, [0, 1], [-30, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        top: 70,
        left: 90,
        right: 90,
        opacity: s,
        transform: `translateY(${y}px)`,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: COLORS.indigo,
            marginBottom: 8,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
    </div>
  );
};

// ── Untertitel / Sprechertext unten ────────────────────────────────────
export const Caption: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const y = interpolate(s, [0, 1], [40, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 80,
        display: 'flex',
        justifyContent: 'center',
        opacity: s,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          margin: '0 70px',
          padding: '26px 46px',
          borderRadius: 22,
          background: COLORS.panelSolid,
          border: `1px solid ${COLORS.border}`,
          fontSize: 46,
          lineHeight: 1.32,
          fontWeight: 600,
          textAlign: 'center',
          color: color || COLORS.ink,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ── Pfeil (SVG) über die volle Bühne (viewBox 1920x1080) ───────────────
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  opacity?: number;
}> = ({ x1, y1, x2, y2, color = COLORS.amber, width = 10, opacity = 1 }) => {
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const head = 26;
  return (
    <svg
      style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity }}
      viewBox="0 0 1920 1080"
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      <polygon
        points={`0,-${head} ${head * 1.5},0 0,${head}`}
        fill={color}
        transform={`translate(${x2},${y2}) rotate(${ang})`}
      />
    </svg>
  );
};

// ── Kugel (physikalischer Körper) ──────────────────────────────────────
export const Ball: React.FC<{
  x: number;
  y: number;
  r?: number;
  color?: string;
  label?: string;
}> = ({ x, y, r = 46, color = COLORS.amber, label }) => {
  return (
    <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, #fff8, ${color})`,
          boxShadow: `0 12px 30px rgba(0,0,0,0.4)`,
        }}
      />
      {label ? (
        <div
          style={{
            position: 'absolute',
            top: -46,
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

// ── Merksatz-Box (Reveal) ──────────────────────────────────────────────
export const MerksatzBox: React.FC<{
  title?: string;
  children: React.ReactNode;
  footer?: string;
}> = ({ title = 'Merke', children, footer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 180 } });
  const scale = interpolate(s, [0, 1], [0.9, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: s,
          maxWidth: 1400,
          padding: '54px 70px',
          borderRadius: 32,
          background: 'linear-gradient(160deg, rgba(99,102,241,0.22), rgba(255,255,255,0.05))',
          border: `2px solid ${COLORS.indigo}`,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: COLORS.amber,
            marginBottom: 18,
          }}
        >
          ⭐ {title}
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.28 }}>{children}</div>
        {footer ? (
          <div style={{ marginTop: 26, fontSize: 32, fontWeight: 600, color: COLORS.muted }}>
            {footer}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ── LernStar-Logo (Stern + Wortmarke) ──────────────────────────────────
export const StarLogo: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 120, stiffness: 120 } });
  const rot = interpolate(s, [0, 1], [-40, 0]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ transform: `scale(${s}) rotate(${rot}deg)` }}
      >
        <defs>
          <linearGradient id="starg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={COLORS.amber} />
            <stop offset="1" stopColor={COLORS.indigoDeep} />
          </linearGradient>
        </defs>
        <path
          d="M50 4 L61 38 L97 38 L68 60 L79 95 L50 73 L21 95 L32 60 L3 38 L39 38 Z"
          fill="url(#starg)"
          stroke="#fff"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ fontSize: size * 0.62, fontWeight: 900, letterSpacing: 1 }}>{BRAND}</div>
    </div>
  );
};

// kleine Helfer
export const easeInOut = Easing.bezier(0.4, 0, 0.2, 1);
