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
import { useFade } from '../electric';
import timings from '../narration/energiesparen.timings.json';

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
      <div style={{ fontSize: 150, marginBottom: 20 }}>💡🌱💶</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Energie sparen im Haushalt
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Drei einfache Tricks – und du sparst viel Geld und CO₂.
      </div>
    </AbsoluteFill>
  );
};

const TrickCard: React.FC<{ num: string; icon: string; title: string; desc: string; kicker: string; caption: string } & SceneProps> = ({ num, icon, title, desc, kicker, caption }) => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker={kicker} title={title} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ opacity: f, textAlign: 'center' }}>
          <div style={{ fontSize: 200 }}>{icon}</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.green, marginTop: 10, maxWidth: 1200 }}>{desc}</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 80, top: 120, fontSize: 120, fontWeight: 900, color: `${COLORS.green}44` }}>{num}</div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>{caption}</Caption>
    </AbsoluteFill>
  );
};

const GeraeteScene: React.FC<SceneProps> = (p) => (
  <TrickCard {...p} num="1" kicker="Trick 1" icon="💡→🔆" title="Sparsame Geräte" desc="LED statt Glühlampe: ~1/10 der Energie" caption="Eine LED braucht für dieselbe Helligkeit nur etwa ein Zehntel der Energie." />
);
const StandbyScene: React.FC<SceneProps> = (p) => (
  <TrickCard {...p} num="2" kicker="Trick 2" icon="🔴→⚫" title="Aus statt Standby" desc="das rote Lämpchen kostet das ganze Jahr Strom" caption="Ganz ausschalten statt Standby – über das Jahr summiert sich das gewaltig." />
);
const LaufzeitScene: React.FC<SceneProps> = (p) => (
  <TrickCard {...p} num="3" kicker="Trick 3" icon="⏱️" title="Kürzere Laufzeiten" desc="Licht aus beim Rausgehen, Kocher nur halb voll" caption="Weniger Zeit bei gleicher Leistung heißt weniger verbrauchte Energie." />
);

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Energie sparen" footer="weniger Leistung oder weniger Zeit = weniger Energie">
      Sparsame Geräte (LED),
      <br />
      ausschalten statt Standby,
      <br />
      kürzere Laufzeiten.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Rechne selbst nach" />
      <div style={{ fontSize: 170, opacity: f }}>💡×10 → 💶</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.green, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Zehn Glühlampen gegen LEDs getauscht – das spart im Jahr viele Kilowattstunden und Euro.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Die Formel E = P·t zeigt dir sofort, wie viel du sparst.</Caption>
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
  { id: 'geraete', C: GeraeteScene, min: 220 },
  { id: 'standby', C: StandbyScene, min: 220 },
  { id: 'laufzeit', C: LaufzeitScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENERGIESPAREN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Energiesparen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENERGIESPAREN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/energiesparen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
