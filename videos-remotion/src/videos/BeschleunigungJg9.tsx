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
import timings from '../narration/beschleunigung-jg9.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const carX = interpolate(frame, [0, 130], [300, 900], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 180, left: carX, fontSize: 90 }}>🏎️💨</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 76, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Immer schneller werden
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Ändert sich das Tempo, wirkt eine Beschleunigung.
      </div>
    </AbsoluteFill>
  );
};

const DefinitionScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Was heißt das?" title="Die Geschwindigkeit ändert sich" />
      <div style={{ display: 'flex', gap: 36, opacity: f }}>
        {[['⏩', 'schneller'], ['⏪', 'langsamer'], ['🔄', 'Richtung']].map((c, i) => (
          <div key={i} style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{c[0]}</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, fontSize: 32, fontWeight: 800, color: COLORS.amber, opacity: f }}>… und dahinter steckt immer eine Kraft.</div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Jede Änderung des Tempos oder der Richtung ist eine Beschleunigung.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  const rows = [
    ['1 s', '3 m/s'],
    ['2 s', '6 m/s'],
    ['3 s', '9 m/s'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Am Tacho" title="In jeder Sekunde +3 m/s" />
      <div style={{ opacity: f, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rows.map((r, i) => {
          const rf = interpolate(frame, [24 + i * 16, 40 + i * 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: rf }}>
              <div style={{ width: 120, fontSize: 34, fontWeight: 800, color: COLORS.amber }}>{r[0]}</div>
              <div style={{ width: 20 + i * 200, height: 34, borderRadius: 8, background: COLORS.sky }} />
              <div style={{ fontSize: 34, fontWeight: 900, color: COLORS.sky }}>{r[1]}</div>
            </div>
          );
        })}
      </div>
      <Sfx sound="pop" at={24} volume={0.3} />
      <Caption delay={40}>Die Geschwindigkeit wächst gleichmäßig – jede Sekunde kommen 3 m/s dazu.</Caption>
    </AbsoluteFill>
  );
};

const DiagrammScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x0 = 560, y0 = 800, w = 820, h = 520;
  const n = 40;
  let path = `M ${x0} ${y0}`;
  for (let i = 1; i <= n * p; i++) {
    const tt = i / n;
    path += ` L ${x0 + w * tt} ${y0 - h * tt * tt}`;
  }
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Im Diagramm" title="Keine Gerade – eine Kurve" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={x0} y1={y0} x2={x0} y2={y0 - h} stroke={COLORS.muted} strokeWidth={3} />
        <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={COLORS.muted} strokeWidth={3} />
        <text x={x0 - 60} y={y0 - h + 10} fontSize={28} fill={COLORS.sky} fontWeight="bold">s</text>
        <text x={x0 + w} y={y0 + 44} fontSize={28} fill={COLORS.amber} fontWeight="bold">t</text>
        <path d={path} fill="none" stroke={COLORS.amber} strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', left: 1050, top: 380, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>immer steiler =<br />immer schneller</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.55)}>Gleiche Zeiten, immer größere Strecken – die Linie wird immer steiler.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Beschleunigung" footer="im s-t-Diagramm eine gekrümmte Kurve">
      Beschleunigung ist jede Änderung
      <br />
      der Geschwindigkeit – schneller, langsamer
      <br />
      oder Richtung. Dafür braucht es eine Kraft.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Spürbar überall" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🚌', 'Bus fährt an'], ['🎢', 'Achterbahn'], ['✈️', 'Start des Flugzeugs']].map((c, i) => (
          <div key={i} style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Immer wenn es dich in den Sitz drückt, wirkt eine Beschleunigung.</Caption>
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
  { id: 'intro', C: Intro, min: 130 },
  { id: 'definition', C: DefinitionScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 240 },
  { id: 'diagramm', C: DiagrammScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BESCHLEUNIGUNG_JG9_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const BeschleunigungJg9: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BESCHLEUNIGUNG_JG9_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/beschleunigung-jg9/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
