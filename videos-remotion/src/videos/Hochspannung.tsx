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
import timings from '../narration/hochspannung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Line: React.FC<{ y: number; hot: boolean; dots: number; speed: number }> = ({ y, hot, dots, speed }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={340} y1={y} x2={1500} y2={y} stroke="#334155" strokeWidth={18} strokeLinecap="round" />
      <line x1={340} y1={y} x2={1500} y2={y} stroke={hot ? 'rgba(239,68,68,0.9)' : 'rgba(34,197,94,0.85)'} strokeWidth={11} strokeLinecap="round" />
      {Array.from({ length: dots }).map((_, i) => {
        const p = ((frame * speed + i * (1160 / dots)) % 1160);
        return <circle key={i} cx={340 + p} cy={y} r={6} fill="#fff" />;
      })}
      {hot &&
        [560, 840, 1120].map((x, i) => (
          <path key={i} d={`M ${x} ${y - 16} q 10 -22 0 -44`} fill="none" stroke={COLORS.amber} strokeWidth={3} opacity={0.5 + Math.sin((frame + i * 8) / 6) * 0.2} />
        ))}
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 110 }}>🗼⚡</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum transportiert man Strom mit Hochspannung?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Mehrere 100 000 Volt auf der Überlandleitung
      </div>
    </AbsoluteFill>
  );
};

const TrickScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Trick" title="Gleiche Leistung: P = U · I" />
      <div style={{ display: 'flex', gap: 30, alignItems: 'center', opacity: f, marginTop: 40 }}>
        <div style={{ width: 360, padding: '26px 20px', borderRadius: 18, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.green }}>Spannung U ⬆️</div>
          <div style={{ fontSize: 22, color: COLORS.muted, marginTop: 6 }}>hochtransformiert</div>
        </div>
        <div style={{ fontSize: 46 }}>➡️</div>
        <div style={{ width: 360, padding: '26px 20px', borderRadius: 18, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.sky }}>Stromstärke I ⬇️</div>
          <div style={{ fontSize: 22, color: COLORS.muted, marginTop: 6 }}>wird klein</div>
        </div>
        <div style={{ fontSize: 46 }}>=</div>
        <div style={{ width: 360, padding: '26px 20px', borderRadius: 18, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.amber }}>gleiche Leistung</div>
          <div style={{ fontSize: 22, color: COLORS.muted, marginTop: 6 }}>gleich viel Energie</div>
        </div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Ein Transformator setzt die Spannung hoch. Weil P gleich U mal I ist, sinkt bei gleicher Leistung die Stromstärke – und genau die verursacht die Verluste.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleich" title="Wenig Strom heißt wenig Verlust" />
      <div style={{ position: 'absolute', left: 120, top: 340, fontSize: 27, fontWeight: 900, color: COLORS.red, opacity: f }}>Niederspannung: 230 V → viel Strom</div>
      <Line y={430} hot dots={14} speed={9} />
      <div style={{ position: 'absolute', left: 1520, top: 405, fontSize: 26, fontWeight: 800, color: COLORS.red }}>🔥 heiß</div>
      <div style={{ position: 'absolute', left: 120, top: 620, fontSize: 27, fontWeight: 900, color: COLORS.green, opacity: f }}>Hochspannung: 380 000 V → wenig Strom</div>
      <Line y={710} hot={false} dots={4} speed={9} />
      <div style={{ position: 'absolute', left: 1520, top: 685, fontSize: 26, fontWeight: 800, color: COLORS.green }}>❄️ kühl</div>
      <Caption delay={30}>Bei niedriger Spannung braucht man viel Strom – die Leitung wird heiß. Bei Hochspannung genügt wenig Strom, und fast nichts geht verloren.</Caption>
    </AbsoluteFill>
  );
};

const RueckScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Und zuhause?" title="Vor der Steckdose wieder heruntersetzen" />
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', opacity: f, marginTop: 40, fontSize: 24, fontWeight: 800 }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 70 }}>🏭</div>Kraftwerk</div>
        <div style={{ color: COLORS.green }}>⬆️ Hochtrafo</div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 70 }}>🗼</div>380 kV</div>
        <div style={{ color: COLORS.sky }}>⬇️ Umspannwerk</div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 70 }}>🏠</div>230 V</div>
      </div>
      <div style={{ marginTop: 40, fontSize: 26, fontWeight: 800, color: COLORS.muted, opacity: f, maxWidth: 1200, textAlign: 'center' }}>
        Hochspannung ist praktisch für den Transport, aber gefährlich im Haushalt. Deshalb wird sie vorher wieder auf 230 Volt gesenkt.
      </div>
      <Caption delay={30}>So hohe Spannung darf nicht in die Steckdose. Kurz vor dem Haushalt transformiert man sie wieder auf sichere 230 Volt herunter.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Hochspannung" footer="hoch transportieren, vor dem Haushalt herunter">
      Hohe Spannung bedeutet kleine Stromstärke –
      <br />
      und kleine Stromstärke bedeutet wenig Verlust.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🗼', 'Höchstspannung', '220–380 kV'],
    ['🏗️', 'Umspannwerk', 'transformiert herunter'],
    ['🔌', 'Haushalt', '230 V'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Deshalb die großen Masten" />
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
      <Caption delay={40}>Die riesigen Überlandmasten führen genau deshalb Hochspannung – um Strom verlustarm über weite Strecken zu bringen.</Caption>
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
  { id: 'trick', C: TrickScene, min: 250 },
  { id: 'vergleich', C: VergleichScene, min: 260 },
  { id: 'rueck', C: RueckScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const HOCHSPANNUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Hochspannung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={HOCHSPANNUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/hochspannung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
