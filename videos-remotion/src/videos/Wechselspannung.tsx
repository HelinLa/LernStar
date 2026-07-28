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
import { useFade } from '../magnet';
import { Wave } from '../induction';
import timings from '../narration/wechselspannung.timings.json';

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
      <div style={{ fontSize: 120 }}>🔌🔁</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum wechselt der Strom ständig die Richtung?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Wechselspannung aus der Steckdose
      </div>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleich" title="Batterie gleich, Steckdose wechselnd" />
      <div style={{ position: 'absolute', left: 120, top: 300, fontSize: 30, fontWeight: 900, color: COLORS.amber, opacity: f }}>🔋 Gleichspannung (Batterie)</div>
      <Wave x0={120} y0={430} w={620} h={180} omega={0} amp={0.7} frame={frame} dc color={COLORS.amber} />
      <div style={{ position: 'absolute', left: 120, top: 560, fontSize: 24, fontWeight: 700, color: COLORS.muted, opacity: f }}>immer gleich hoch, eine Richtung</div>
      <div style={{ position: 'absolute', left: 1050, top: 300, fontSize: 30, fontWeight: 900, color: COLORS.green, opacity: f }}>🔌 Wechselspannung (Steckdose)</div>
      <Wave x0={1050} y0={430} w={620} h={220} omega={0.12} amp={0.9} frame={frame} color={COLORS.green} />
      <div style={{ position: 'absolute', left: 1050, top: 560, fontSize: 24, fontWeight: 700, color: COLORS.muted, opacity: f }}>steigt, fällt, kehrt sich um</div>
      <Caption delay={30}>Eine Batterie liefert eine gleichbleibende Spannung. Die Steckdose liefert eine Spannung, die ständig steigt, fällt und die Richtung wechselt.</Caption>
    </AbsoluteFill>
  );
};

const ElektronenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const shift = Math.sin(frame / 10) * 44;
  const dots = Array.from({ length: 9 });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vorsicht, Denkfehler" title="Die Elektronen wandern nicht davon" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={360} y1={520} x2={1560} y2={520} stroke={COLORS.border} strokeWidth={22} strokeLinecap="round" />
        <line x1={360} y1={520} x2={1560} y2={520} stroke="#334155" strokeWidth={14} strokeLinecap="round" />
        {dots.map((_, i) => (
          <circle key={i} cx={470 + i * 135 + shift} cy={520} r={15} fill={COLORS.sky} />
        ))}
        {/* Richtungspfeil wechselt */}
        <polygon points="0,-14 30,0 0,14" fill={COLORS.green} transform={`translate(960,450) rotate(${shift > 0 ? 0 : 180})`} />
      </svg>
      <div style={{ position: 'absolute', left: 1250, top: 640, width: 560, fontSize: 26, fontWeight: 800, color: COLORS.green, opacity: f }}>
        Sie zittern nur vor und zurück – im Takt der Wechselspannung.
      </div>
      <Caption delay={30}>Bei Wechselstrom fließen die Elektronen nicht in eine Richtung davon. Sie schwingen nur hin und her.</Caption>
    </AbsoluteFill>
  );
};

const FrequenzScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Frequenz" title="50-mal pro Sekunde" />
      <Wave x0={160} y0={520} w={1100} h={260} omega={0.34} amp={0.9} frame={frame} color={COLORS.green} />
      <div style={{ position: 'absolute', left: 1360, top: 420, width: 460, opacity: f }}>
        <div style={{ fontSize: 90, fontWeight: 900, color: COLORS.amber }}>50 Hz</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.muted, marginTop: 8 }}>50 volle Schwingungen in jeder Sekunde. So schnell, dass die Lampe ruhig leuchtet.</div>
      </div>
      <Caption delay={30}>In Europa wechselt die Spannung 50-mal pro Sekunde – das nennt man eine Frequenz von 50 Hertz.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Wechselspannung" footer="Europa: 230 Volt, 50 Hertz">
      Wechselspannung ändert ständig ihre Höhe und Richtung.
      <br />
      Die Elektronen schwingen nur hin und her.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏭', 'Generator', 'liefert Wechselspannung'],
    ['🔌', 'Steckdose', '230 V, 50 Hz'],
    ['🔀', 'Transformator', 'nur mit Wechselstrom'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Warum überhaupt Wechselstrom?" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der große Vorteil: Nur Wechselspannung lässt sich mit einem Transformator einfach hoch- und runterwandeln.</Caption>
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
  { id: 'vergleich', C: VergleichScene, min: 250 },
  { id: 'elektronen', C: ElektronenScene, min: 250 },
  { id: 'frequenz', C: FrequenzScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WECHSELSPANNUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Wechselspannung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WECHSELSPANNUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/wechselspannung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
