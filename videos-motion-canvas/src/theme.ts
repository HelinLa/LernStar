// Gemeinsame LernStar-Farb- & Schrift-Welt (identisch zur Remotion-theme.ts,
// damit Motion-Canvas- und Remotion-Videos einheitlich aussehen).
export const COLORS = {
  bg0: '#0f172a', // slate-900 (Hintergrund tief)
  bg1: '#1e293b', // slate-800 (Hintergrund hell)
  ink: '#f8fafc', // Text hell
  muted: '#cbd5e1', // Text gedämpft
  indigo: '#818cf8', // Akzent
  indigoDeep: '#6366f1',
  amber: '#fbbf24', // Kraft / Hervorhebung
  green: '#22c55e', // schneller / richtig
  red: '#ef4444', // langsamer / bremsen
  sky: '#38bdf8',
  panel: 'rgba(255,255,255,0.06)',
  panelSolid: 'rgba(15,23,42,0.72)',
  border: 'rgba(255,255,255,0.14)',
  ground: '#334155',
  ice: '#bae6fd',
} as const;

export const FONT =
  'Inter, "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif';

export const BRAND = 'LernStar';
