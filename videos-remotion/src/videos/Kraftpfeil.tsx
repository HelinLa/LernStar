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
import { ForceArrow, Crate, useFade } from '../forces';
import timings from '../narration/kraftpfeil.timings.json';

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
      <div style={{ fontSize: 150, marginBottom: 20 }}>➡️🧭</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Hat eine Kraft eine Richtung?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie stark – und wohin? Beides gehört zusammen.
      </div>
    </AbsoluteFill>
  );
};

const BeidesScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Zwei Angaben" title="Betrag UND Richtung" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['📏', 'Betrag', 'wie stark? – in Newton', COLORS.red], ['🧭', 'Richtung', 'wohin wirkt sie?', COLORS.sky]].map((c, i) => (
          <div key={i} style={{ width: 420, padding: '36px', borderRadius: 24, background: COLORS.panel, border: `2px solid ${c[3] as string}`, textAlign: 'center' }}>
            <div style={{ fontSize: 100 }}>{c[0]}</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: c[3] as string, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 26, fontSize: 32, fontWeight: 900, color: COLORS.amber, opacity: f }}>beides zusammen = ein Vektor</div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Eine Kraft hat immer beides: einen Betrag in Newton und eine Richtung – das nennt man Vektor.</Caption>
    </AbsoluteFill>
  );
};

const PfeilScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Darstellung" title="Kräfte als Pfeile" />
      <div style={{ opacity: f }}>
        <ForceArrow x={500} y={620} angleDeg={0} len={160} color={COLORS.sky} label="klein" width={9} />
        <ForceArrow x={500} y={780} angleDeg={0} len={420} color={COLORS.red} label="groß" width={11} />
      </div>
      <div style={{ position: 'absolute', left: 500, top: 470, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: f }}>Länge = Betrag · Spitze = Richtung</div>
      <Sfx sound="whoosh" at={16} volume={0.34} />
      <Caption delay={40}>Ein langer Pfeil steht für eine große Kraft – die Pfeilspitze zeigt, wohin sie wirkt.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="6 N – drei Richtungen" title="Gleicher Betrag, andere Wirkung" />
      <div style={{ opacity: f }}>
        <Crate x={960} y={560} s={110} label="📦" />
        <ForceArrow x={960} y={560} angleDeg={-90} len={220} color={COLORS.green} label="hoch" width={9} />
        <ForceArrow x={960} y={560} angleDeg={90} len={220} color={COLORS.red} label="runter" width={9} />
        <ForceArrow x={960} y={560} angleDeg={0} len={260} color={COLORS.sky} label="zur Seite" width={9} />
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Dieselben 6 Newton heben, drücken oder schieben – je nach Richtung ganz andere Wirkung.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kraftpfeil" footer="Kräfte sind Vektoren">
      Zu einer Kraft gehören Betrag (in N) und Richtung.
      <br />
      Man zeichnet sie als Pfeil:
      <br />
      Länge = Betrag, Pfeilrichtung = Wirkrichtung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Warum das wichtig ist" />
      <div style={{ fontSize: 170, opacity: f }}>➕➡️</div>
      <div style={{ marginTop: 16, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Nur mit Betrag UND Richtung kannst du mehrere Kräfte richtig zusammenrechnen.
      </div>
      <Sfx sound="whoosh" at={14} volume={0.34} />
      <Caption delay={40}>Gib bei jeder Kraft immer beides an – das brauchst du gleich beim Zusammenrechnen.</Caption>
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
  { id: 'beides', C: BeidesScene, min: 240 },
  { id: 'pfeil', C: PfeilScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KRAFTPFEIL_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kraftpfeil: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KRAFTPFEIL_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kraftpfeil/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
