import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

// ─────────────────────────────────────────────────────────────────────────
// Helles "Schulheft"-Design (Karo-Optik) für hochwertige Erklärvideos.
// Eigenständig neben dem dunklen theme.ts – bricht keine bestehenden Videos.
// ─────────────────────────────────────────────────────────────────────────
export const PAPER = {
  bg: '#fbfbf4',        // warmes Papierweiß
  grid: '#d3ddf0',      // feine Karo-Linien (hellblau)
  gridBold: '#c3d0ea',  // kräftigere Linie
  margin: '#f0a6a6',    // roter Heftrand
  ink: '#26324a',       // Haupt-Text (dunkle Tinte)
  inkSoft: '#5f6f8c',   // gedämpft
  blue: '#2563eb',      // Stift-Blau
  red: '#dc2626',       // Korrektur-Rot
  amber: '#e08a1e',     // Marker-Gelb/Orange
  green: '#16a34a',
  sky: '#0ea5e9',
  accent: '#4f46e5',    // Indigo-Akzent
  marker: 'rgba(251,191,36,0.42)', // Textmarker
  panel: '#ffffff',
  border: '#dde4f1',
  shadow: 'rgba(30,41,59,0.14)',
};

export const FONT =
  'Inter, "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif';

// Wenn dein freigestelltes Foto unter public/avatar/avatar.png liegt:
// HAS_AVATAR_PHOTO auf true setzen. Bis dahin: neutrale Silhouette.
export const HAS_AVATAR_PHOTO = false;
export const AVATAR_FILE = 'avatar/avatar.png';

// ── Karo-Hintergrund + roter Rand + dezente Vignette ───────────────────────
export const PaperBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const S = 48; // Karo-Kantenlänge (px)
  return (
    <AbsoluteFill style={{ background: PAPER.bg, fontFamily: FONT, color: PAPER.ink }}>
      {/* feines Karo */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${PAPER.grid} 1.4px, transparent 1.4px), linear-gradient(90deg, ${PAPER.grid} 1.4px, transparent 1.4px)`,
          backgroundSize: `${S}px ${S}px`,
        }}
      />
      {/* jede 5. Linie etwas kräftiger (5-mm-Optik) */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${PAPER.gridBold} 1.6px, transparent 1.6px), linear-gradient(90deg, ${PAPER.gridBold} 1.6px, transparent 1.6px)`,
          backgroundSize: `${S * 5}px ${S * 5}px`,
          opacity: 0.8,
        }}
      />
      {/* roter Heftrand links */}
      <div style={{ position: 'absolute', left: 150, top: 0, bottom: 0, width: 2.4, background: PAPER.margin, opacity: 0.85 }} />
      {/* weiche Vignette für Tiefe / hochwertigen Look */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 120% at 50% 42%, transparent 60%, rgba(38,50,74,0.06) 100%)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

// ── Avatar: dezenter Begleiter unten rechts (Foto oder Platzhalter) ────────
export const Avatar: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const R = 170;
  return (
    <div
      style={{
        position: 'absolute',
        right: 56,
        bottom: 52,
        width: R,
        height: R,
        opacity: s * opacity,
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
        borderRadius: '50%',
        background: '#eef2fb',
        border: `5px solid ${PAPER.panel}`,
        boxShadow: `0 14px 34px ${PAPER.shadow}`,
        overflow: 'hidden',
      }}
    >
      {HAS_AVATAR_PHOTO ? (
        <Img src={staticFile(AVATAR_FILE)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="avg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c7d2f0" />
              <stop offset="1" stopColor="#aab8de" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#avg)" />
          <circle cx="50" cy="40" r="18" fill="#8595bf" />
          <path d="M18 92 C18 68 82 68 82 92 Z" fill="#8595bf" />
        </svg>
      )}
    </div>
  );
};

// ── Reveal-Helfer: sanftes Einblenden ab Frame `start` (textsynchron) ──────
export const useReveal = (start: number, dur = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, durationInFrames: dur, config: { damping: 200 } });
  return { op: s, y: interpolate(s, [0, 1], [26, 0]), scale: interpolate(s, [0, 1], [0.94, 1]) };
};

// ── Beat-Layout: Szene in Satz-Häppchen mit eigenen Audiodauern ────────────
export type BeatInfo = { id: string; dur: number; start: number };
const FPS = 30;
const TAIL = 16; // ruhiger Nachlauf nach jedem Satz
const GAP = 5;   // kleine Atempause zwischen Sätzen

export function layoutBeats(
  ids: string[],
  T: Record<string, number>,
  opts?: { tail?: number; gap?: number; pad?: number }
): { beats: BeatInfo[]; total: number } {
  const tail = opts?.tail ?? TAIL;
  const gap = opts?.gap ?? GAP;
  let t = 0;
  const beats: BeatInfo[] = [];
  for (const id of ids) {
    const d = Math.max(1, Math.round((T[id] ?? 0) * FPS) + tail);
    beats.push({ id, dur: d, start: t });
    t += d + gap;
  }
  return { beats, total: t + (opts?.pad ?? 18) };
}

// Legt die Beat-Audios exakt an ihre Startframes innerhalb der Szene.
export const BeatAudio: React.FC<{ base: string; beats: BeatInfo[] }> = ({ base, beats }) => (
  <>
    {beats.map((b) => (
      <Sequence key={b.id} from={b.start} durationInFrames={b.dur} layout="none">
        <Audio src={staticFile(`audio/${base}/${b.id}.wav`)} />
      </Sequence>
    ))}
  </>
);

// ── Kicker + Titel oben (dunkle Tinte auf Papier) ──────────────────────────
export const PaperTitle: React.FC<{ kicker?: string; title: string }> = ({ kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div style={{ position: 'absolute', top: 66, left: 200, right: 90, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [-24, 0])}px)` }}>
      {kicker ? (
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: PAPER.accent, marginBottom: 6 }}>
          {kicker}
        </div>
      ) : null}
      <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, color: PAPER.ink }}>
        {title}
        {/* Textmarker-Unterstrich */}
        <div style={{ height: 14, marginTop: -6, width: 'fit-content', minWidth: 120, maxWidth: 720, background: PAPER.marker, borderRadius: 6 }} />
      </div>
    </div>
  );
};

// ── Untertitel / Sprechertext unten (weiße Karte) ──────────────────────────
export const PaperCaption: React.FC<{ children: React.ReactNode; delay?: number; color?: string }> = ({
  children,
  delay = 0,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)` }}>
      <div
        style={{
          maxWidth: 1360,
          margin: '0 90px',
          padding: '24px 44px',
          borderRadius: 20,
          background: PAPER.panel,
          border: `1.5px solid ${PAPER.border}`,
          boxShadow: `0 12px 30px ${PAPER.shadow}`,
          fontSize: 44,
          lineHeight: 1.3,
          fontWeight: 600,
          textAlign: 'center',
          color: color || PAPER.ink,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ── Merksatz als "Sticky Note" ─────────────────────────────────────────────
export const PaperMerksatz: React.FC<{ title?: string; children: React.ReactNode; footer?: string }> = ({
  title = 'Merke',
  children,
  footer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 180 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          transform: `scale(${interpolate(s, [0, 1], [0.9, 1])}) rotate(-1.2deg)`,
          opacity: s,
          maxWidth: 1300,
          padding: '48px 68px',
          borderRadius: 14,
          background: 'linear-gradient(160deg, #fff7d6, #ffefb0)',
          border: '1px solid #f2d98a',
          boxShadow: '0 26px 60px rgba(30,41,59,0.22)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: PAPER.amber, marginBottom: 16 }}>
          ⭐ {title}
        </div>
        <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.26, color: PAPER.ink }}>{children}</div>
        {footer ? <div style={{ marginTop: 22, fontSize: 30, fontWeight: 600, color: PAPER.inkSoft }}>{footer}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ── LernStar-Logo auf hellem Grund ─────────────────────────────────────────
export const PaperLogo: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 120, stiffness: 120 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [-40, 0])}deg)` }}>
        <defs>
          <linearGradient id="pstarg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={PAPER.amber} />
            <stop offset="1" stopColor={PAPER.accent} />
          </linearGradient>
        </defs>
        <path d="M50 4 L61 38 L97 38 L68 60 L79 95 L50 73 L21 95 L32 60 L3 38 L39 38 Z" fill="url(#pstarg)" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
      </svg>
      <div style={{ fontSize: size * 0.6, fontWeight: 900, letterSpacing: 1, color: PAPER.ink }}>LernStar</div>
    </div>
  );
};
