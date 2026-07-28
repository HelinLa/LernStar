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
import { BarMagnet, useFade } from '../magnet';
import { Solenoid, Galvanometer } from '../induction';
import timings from '../narration/induktionsspannung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CY = 520;
const COILX = 800;

const Bar: React.FC<{ x: number; y: number; value: number; label: string }> = ({ x, y, value, label }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 440 }}>
    <div style={{ fontSize: 25, fontWeight: 800, color: COLORS.muted, marginBottom: 8 }}>{label}</div>
    <div style={{ width: '100%', height: 42, borderRadius: 12, background: COLORS.panel, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, Math.abs(value) * 100)}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.amber}, ${COLORS.green})` }} />
    </div>
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120 }}>🧲🌀📈</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wovon hängt die induzierte Spannung ab?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Drei Einflussgrößen
      </div>
    </AbsoluteFill>
  );
};

const GeschwScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const fast = frame > 85;
  const w = fast ? 6.5 : 15;
  const xAt = (f: number) => 640 + 95 * Math.sin(f / w);
  const x = xAt(frame);
  const value = (x - xAt(frame - 1)) * 0.14;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 1" title="Schneller bewegen – mehr Spannung" />
      <Solenoid cx={COILX} cy={CY} w={300} h={150} turns={7} glow={Math.abs(value)} />
      <BarMagnet cx={x} cy={CY} w={230} h={78} nRight />
      <Galvanometer cx={COILX} cy={CY + 300} value={value} size={185} />
      <Bar x={1240} y={470} value={Math.abs(value)} label={fast ? 'schnell → großer Ausschlag' : 'langsam → kleiner Ausschlag'} />
      <Caption delay={30}>Bewegt man den Magneten schneller, ändert sich das Feld rascher – die induzierte Spannung wird größer.</Caption>
    </AbsoluteFill>
  );
};

const WindungenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const many = frame > 85;
  const turns = many ? 12 : 4;
  const xAt = (f: number) => 640 + 95 * Math.sin(f / 10);
  const x = xAt(frame);
  const value = (x - xAt(frame - 1)) * 0.11 * (many ? 2 : 0.7);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 2" title="Mehr Windungen – mehr Spannung" />
      <Solenoid cx={COILX} cy={CY} w={320} h={150} turns={turns} glow={Math.abs(value)} />
      <BarMagnet cx={x} cy={CY} w={230} h={78} nRight />
      <Galvanometer cx={COILX} cy={CY + 300} value={value} size={185} />
      <Bar x={1240} y={470} value={Math.abs(value)} label={`${turns} Windungen`} />
      <Sfx sound="pop" at={85} volume={0.3} />
      <Caption delay={30}>Bei gleicher Bewegung erzeugt eine Spule mit mehr Windungen eine höhere Spannung.</Caption>
    </AbsoluteFill>
  );
};

const StaerkeScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const strong = frame > 85;
  const xAt = (f: number) => 640 + 95 * Math.sin(f / 10);
  const x = xAt(frame);
  const value = (x - xAt(frame - 1)) * 0.11 * (strong ? 1.9 : 0.7);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 3" title="Stärkerer Magnet – mehr Spannung" />
      <Solenoid cx={COILX} cy={CY} w={300} h={150} turns={7} glow={Math.abs(value)} />
      <BarMagnet cx={x} cy={CY} w={strong ? 260 : 190} h={strong ? 92 : 66} nRight />
      <Galvanometer cx={COILX} cy={CY + 300} value={value} size={185} />
      <Bar x={1240} y={470} value={Math.abs(value)} label={strong ? 'starker Magnet' : 'schwacher Magnet'} />
      <Sfx sound="pop" at={85} volume={0.3} />
      <Caption delay={30}>Ein stärkerer Magnet liefert ein kräftigeres Feld – auch das erhöht die induzierte Spannung.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Höhe der Induktionsspannung" footer="je schneller die Änderung, desto mehr Spannung">
      Die induzierte Spannung ist umso größer,
      <br />
      je schneller die Bewegung, je mehr Windungen
      <br />
      und je stärker der Magnet.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🚲', 'Dynamo', 'schneller treten → heller'],
    ['🎸', 'E-Gitarre', 'Tonabnehmer-Spulen'],
    ['🏭', 'Generator', 'viele Windungen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Mehr Spannung erzeugen" />
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
      <Caption delay={40}>Deshalb hat ein Fahrraddynamo eine Spule mit vielen Windungen und einen starken Magneten.</Caption>
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
  { id: 'geschw', C: GeschwScene, min: 250 },
  { id: 'windungen', C: WindungenScene, min: 240 },
  { id: 'staerke', C: StaerkeScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const INDUKTIONSSPANNUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Induktionsspannung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={INDUKTIONSSPANNUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/induktionsspannung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
