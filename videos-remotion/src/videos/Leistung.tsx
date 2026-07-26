import React from 'react';
import {
  AbsoluteFill,
  Series,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo, BackgroundMusic, Sfx } from '../components';
import { useFade } from '../forces';
import timings from '../narration/leistung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Treppe + kletternde Figur. p 0..1 von unten links nach oben rechts.
const StairClimb: React.FC<{ x: number; y: number; w: number; h: number; p: number; color: string; label: string; sub: string }> = ({ x, y, w, h, p, color, label, sub }) => {
  const steps = 5;
  const stepW = w / steps;
  const stepH = h / steps;
  // Figur-Position auf der Treppen-Diagonale
  const px = x + p * w;
  const py = y + h - p * h;
  return (
    <div style={{ position: 'absolute', left: x - 30, top: y - 80, width: w + 120, height: h + 160 }}>
      <svg width={w + 120} height={h + 160} style={{ position: 'absolute', left: 0, top: 0 }}>
        {/* Stufen */}
        {Array.from({ length: steps }, (_, i) => {
          const sx = 30 + i * stepW;
          const sy = 80 + h - (i + 1) * stepH;
          return <rect key={i} x={sx} y={sy} width={stepW} height={(i + 1) * stepH} fill={COLORS.panel} stroke={COLORS.border} strokeWidth={2} />;
        })}
        {/* Kiste + Figur */}
        <g transform={`translate(${30 + (px - x)}, ${80 + (py - y)})`}>
          <rect x={-26} y={-72} width={52} height={44} rx={6} fill={COLORS.amber} stroke={COLORS.ink} strokeWidth={2} />
          <text x={0} y={-2} fontSize={44} textAnchor="middle">🧑</text>
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 30, top: h + 100, width: w, textAlign: 'center', fontSize: 28, fontWeight: 900, color }}>{label}</div>
      <div style={{ position: 'absolute', left: 30, top: h + 138, width: w, textAlign: 'center', fontSize: 24, fontWeight: 700, color: COLORS.muted }}>{sub}</div>
    </div>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 40 }}>
        <span>🏃</span>
        <span>📦</span>
        <span>🚶</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 62, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Gleiche Arbeit – warum anstrengender?
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Leistung: P = W / t
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // schnell: p erreicht 1 in 3s (90 F); langsam: in 6s (180 F); danach halten
  const pFast = Math.min(1, (frame % 200) / 90);
  const pSlow = Math.min(1, (frame % 200) / 180);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Gleiche Kiste, gleiche Höhe" />
      <StairClimb x={280} y={320} w={420} h={360} p={pFast} color={COLORS.red} label="schnell" sub="rennt" />
      <StairClimb x={1160} y={320} w={420} h={360} p={pSlow} color={COLORS.green} label="langsam" sub="geht" />
      <div style={{ position: 'absolute', top: 250, width: 1920, textAlign: 'center', fontSize: 30, fontWeight: 800, color: COLORS.amber }}>
        gleiche Arbeit W = Kraft · Höhe
      </div>
      <Caption delay={30}>Die verrichtete Arbeit ist bei beiden gleich groß.</Caption>
    </AbsoluteFill>
  );
};

const ZeitScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Unterschied" title="Es ist die Zeit" />
      <div style={{ display: 'flex', gap: 60, opacity: f, marginTop: 20 }}>
        {[
          { e: '🏃', t: '3 s', c: COLORS.red, l: 'schnell' },
          { e: '🚶', t: '6 s', c: COLORS.green, l: 'langsam' },
        ].map((d, i) => (
          <div key={i} style={{ width: 480, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${d.c}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{d.e}</div>
            <div style={{ fontSize: 30, fontWeight: 900, marginTop: 6 }}>{d.l}</div>
            <div style={{ marginTop: 14, fontSize: 26, fontWeight: 700, color: COLORS.muted }}>gleiche Arbeit in</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: d.c }}>⏱️ {d.t}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Nicht die Arbeit ist größer – sondern die Arbeit pro Zeit.</Caption>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Formel" title="Leistung = Arbeit pro Zeit" />
      <div style={{ fontSize: 90, fontWeight: 900, opacity: f, display: 'flex', alignItems: 'center', gap: 20 }}>
        P =
        <span style={{ display: 'inline-flex', flexDirection: 'column', textAlign: 'center', fontSize: 54 }}>
          <span style={{ color: COLORS.amber, borderBottom: `5px solid ${COLORS.ink}`, padding: '0 26px 8px' }}>W (Arbeit)</span>
          <span style={{ color: COLORS.sky, padding: '8px 26px 0' }}>t (Zeit)</span>
        </span>
      </div>
      <div style={{ marginTop: 30, display: 'flex', gap: 40, opacity: f }}>
        <div style={{ padding: '16px 26px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.red}`, fontSize: 30, fontWeight: 800 }}>600 J ÷ 3 s = <span style={{ color: COLORS.red }}>200 W</span></div>
        <div style={{ padding: '16px 26px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 30, fontWeight: 800 }}>600 J ÷ 6 s = <span style={{ color: COLORS.green }}>100 W</span></div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={44}>Gleiche Arbeit, halbe Zeit – doppelte Leistung.</Caption>
    </AbsoluteFill>
  );
};

const EinheitScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Einheit" title="Watt = Joule pro Sekunde" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 10 }}>
        <div style={{ padding: '26px 40px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, fontSize: 40, fontWeight: 900 }}>1 W = 1 J/s</div>
        <div style={{ fontSize: 44, color: COLORS.muted }}>·</div>
        <div style={{ padding: '26px 40px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 40, fontWeight: 900 }}>1 kW = 1000 W</div>
      </div>
      <div style={{ marginTop: 26, fontSize: 30, fontWeight: 700, color: COLORS.muted, opacity: f }}>Je mehr Watt, desto schneller wird Energie umgesetzt.</div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Große Leistungen misst man in Kilowatt.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Leistung" footer="P = W ÷ t · Einheit: Watt (W)">
      Leistung ist Arbeit pro Zeit.
      <br />
      Gleiche Arbeit in kürzerer Zeit
      <br />
      bedeutet größere Leistung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏃', 'Treppe rennen'],
    ['🏎️', 'Motorleistung'],
    ['💪', 'Sport'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Leistung im Alltag" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Die Leistung sagt, wie schnell Energie umgesetzt wird.</Caption>
    </AbsoluteFill>
  );
};

const Outro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={120} />
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: COLORS.muted, opacity: s }}>
        Physik verstehen – Schritt für Schritt.
      </div>
    </AbsoluteFill>
  );
};

const SCENES: { id: string; C: React.FC<SceneProps>; min: number }[] = [
  { id: 'intro', C: Intro, min: 150 },
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'zeit', C: ZeitScene, min: 230 },
  { id: 'formel', C: FormelScene, min: 280 },
  { id: 'einheit', C: EinheitScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LEISTUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Leistung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LEISTUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/leistung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
