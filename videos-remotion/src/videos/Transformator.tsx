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
import { TransformerCore, Wave } from '../induction';
import timings from '../narration/transformator.timings.json';

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
      <div style={{ fontSize: 120 }}>🔀</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Spannung ändern – ohne Energie zu verschwenden?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Transformator
      </div>
    </AbsoluteFill>
  );
};

const AufbauScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Aufbau" title="Zwei Spulen auf einem Eisenkern" />
      <TransformerCore cx={620} cy={560} n1={5} n2={5} flow={false} />
      <div style={{ position: 'absolute', left: 1100, top: 430, width: 680, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Zwei getrennte Spulen sitzen auf demselben Eisenkern.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 24, fontWeight: 800 }}>Wichtig: Sie berühren sich elektrisch nicht. Verbunden sind sie nur durch das Magnetfeld im Kern.</div>
      </div>
      <Caption delay={30}>Ein Transformator hat zwei Spulen auf einem gemeinsamen Eisenkern. Elektrisch sind sie getrennt.</Caption>
    </AbsoluteFill>
  );
};

const PrinzipScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Prinzip" title="Wechselfeld überträgt die Energie" />
      <TransformerCore cx={560} cy={560} n1={5} n2={5} flow frame={frame} />
      <Wave x0={1080} y0={470} w={280} h={140} omega={0.14} amp={0.85} frame={frame} color={COLORS.amber} />
      <div style={{ position: 'absolute', left: 1080, top: 560, fontSize: 22, fontWeight: 800, color: COLORS.amber }}>Primär: Wechselstrom</div>
      <div style={{ position: 'absolute', left: 1080, top: 610, width: 700, fontSize: 24, fontWeight: 800, color: COLORS.sky }}>
        ⚡ ändert ständig das Feld im Kern → induziert in der Sekundärspule eine Spannung.
      </div>
      <Wave x0={1420} y0={470} w={280} h={140} omega={0.14} amp={0.7} frame={frame} color={COLORS.sky} />
      <div style={{ position: 'absolute', left: 1440, top: 560, fontSize: 22, fontWeight: 800, color: COLORS.sky }}>Sekundär: Spannung</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={30}>Der Wechselstrom in der Primärspule erzeugt im Eisenkern ein ständig wechselndes Feld. Das induziert in der Sekundärspule eine Spannung.</Caption>
    </AbsoluteFill>
  );
};

const NurWechselScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const ac = frame > 95;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vorsicht, Denkfehler" title="Mit Gleichstrom bleibt es dunkel" />
      <TransformerCore cx={620} cy={560} n1={5} n2={5} flow={ac} frame={frame} secLive={ac} />
      <div style={{ position: 'absolute', left: 1100, top: 440, width: 680, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: ac ? 'rgba(34,197,94,0.14)' : 'rgba(239,68,68,0.14)', border: `2px solid ${ac ? COLORS.green : COLORS.red}`, fontSize: 25, fontWeight: 800 }}>
          {ac ? '🔌 Wechselstrom → Feld ändert sich → Sekundärspule liefert Spannung.' : '🔋 Gleichstrom → Feld bleibt konstant → keine Änderung → keine Spannung.'}
        </div>
      </div>
      <Sfx sound="pop" at={95} volume={0.34} />
      <Caption delay={30}>Ein Transformator funktioniert nur mit Wechselstrom. Gleichstrom liefert ein konstantes Feld – und ohne Änderung wird nichts induziert.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Der Transformator" footer="funktioniert nur mit Wechselstrom">
      Wechselstrom in der Primärspule erzeugt ein Wechselfeld
      <br />
      im Eisenkern – das induziert in der Sekundärspule Spannung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔌', 'Netzteil', 'senkt auf kleine Spannung'],
    ['🏗️', 'Umspannwerk', 'im Stromnetz'],
    ['🎛️', 'Klingeltrafo', 'z. B. 8 Volt'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Transformatoren überall" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Wie viel er die Spannung ändert, hängt von den Windungszahlen ab – das schauen wir uns als Nächstes an.</Caption>
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
  { id: 'aufbau', C: AufbauScene, min: 250 },
  { id: 'prinzip', C: PrinzipScene, min: 260 },
  { id: 'nurwechsel', C: NurWechselScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TRANSFORMATOR_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Transformator: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TRANSFORMATOR_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/transformator/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
