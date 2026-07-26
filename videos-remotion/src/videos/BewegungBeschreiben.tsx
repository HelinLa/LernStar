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
import timings from '../narration/bewegung-beschreiben.timings.json';

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
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 130, marginBottom: 20, transform: `translateX(${Math.sin(frame / 14) * 30}px)` }}>🚗💨</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 76, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie beschreibt man Bewegung?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Du brauchst nur zwei Größen: Weg und Zeit.
      </div>
    </AbsoluteFill>
  );
};

const BezugScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  const trainX = interpolate(frame % 120, [0, 120], [500, 1300]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Anfang" title="Alles braucht einen Bezugspunkt" />
      <div style={{ position: 'absolute', left: 300, top: 640, fontSize: 60, opacity: f }}>🚉</div>
      <div style={{ position: 'absolute', left: trainX, top: 560, fontSize: 90 }}>🚆</div>
      <div style={{ position: 'absolute', left: 300, top: 560, right: 200, height: 4, background: COLORS.muted, opacity: f }} />
      <Sfx sound="whoosh" at={14} volume={0.3} />
      <Caption delay={30}>Ein Körper bewegt sich immer nur in Bezug auf einen festen Punkt – hier den Bahnsteig.</Caption>
    </AbsoluteFill>
  );
};

const WegZeitScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die zwei Größen" title="Weg s und Zeit t" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        <div style={{ width: 420, padding: '34px 20px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 80 }}>📏</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: COLORS.sky, marginTop: 8 }}>Weg s</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>in Metern (m)</div>
        </div>
        <div style={{ width: 420, padding: '34px 20px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 80 }}>⏱️</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: COLORS.amber, marginTop: 8 }}>Zeit t</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>in Sekunden (s)</div>
        </div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Der Weg sagt, wie weit – die Zeit sagt, wann. Zusammen beschreiben sie die Bewegung.</Caption>
    </AbsoluteFill>
  );
};

const TabelleScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  const rows = [
    ['0 s', '0 m'],
    ['1 s', '2 m'],
    ['2 s', '4 m'],
    ['3 s', '6 m'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Aufschreiben" title="Die Weg-Zeit-Tabelle" />
      <div style={{ opacity: f, borderRadius: 18, overflow: 'hidden', border: `2px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', fontSize: 38, fontWeight: 900 }}>
          <div style={{ width: 240, padding: '16px 0', textAlign: 'center', background: COLORS.amber, color: '#1e293b' }}>Zeit t</div>
          <div style={{ width: 240, padding: '16px 0', textAlign: 'center', background: COLORS.sky, color: '#1e293b' }}>Weg s</div>
        </div>
        {rows.map((r, i) => {
          const rf = interpolate(frame, [30 + i * 14, 46 + i * 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{ display: 'flex', fontSize: 36, fontWeight: 800, opacity: rf, background: i % 2 ? COLORS.panel : 'transparent' }}>
              <div style={{ width: 240, padding: '14px 0', textAlign: 'center', color: COLORS.amber }}>{r[0]}</div>
              <div style={{ width: 240, padding: '14px 0', textAlign: 'center', color: COLORS.sky }}>{r[1]}</div>
            </div>
          );
        })}
      </div>
      <Sfx sound="pop" at={30} volume={0.3} />
      <Caption delay={40}>Zu jeder Zeit gehört ein Weg – so wird die Bewegung Schritt für Schritt sichtbar.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Bewegung beschreiben" footer="ein Körper bewegt sich, wenn sich sein Ort ändert">
      Jede Bewegung beschreibst du mit Weg und Zeit,
      <br />
      bezogen auf einen Bezugspunkt.
      <br />
      Weg s in Metern, Zeit t in Sekunden.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Weg & Zeit überall" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🧭', 'Navi'], ['⌚', 'Fitness-Uhr'], ['🚆', 'Fahrplan']].map((c, i) => (
          <div key={i} style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Navi, Fitness-Uhr, Fahrplan – alle messen und rechnen mit Weg und Zeit.</Caption>
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
  { id: 'bezug', C: BezugScene, min: 240 },
  { id: 'weg', C: WegZeitScene, min: 260 },
  { id: 'zeit', C: WegZeitScene, min: 240 },
  { id: 'tabelle', C: TabelleScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BEWEGUNG_BESCHREIBEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const BewegungBeschreiben: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BEWEGUNG_BESCHREIBEN_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/bewegung-beschreiben/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
