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
import timings from '../narration/kraft-wirkung.timings.json';

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
      <div style={{ display: 'flex', gap: 70, marginBottom: 40, fontSize: 120 }}>
        <div>💪</div><div>➡️</div><div>📦</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 78, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Woran erkennt man eine Kraft?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Kräfte sind unsichtbar – aber ihre Wirkung nicht.
      </div>
    </AbsoluteFill>
  );
};

const WCard: React.FC<{ num: string; icon: string; title: string; desc: string; kicker: string; caption: string } & SceneProps> = ({ num, icon, title, desc, kicker, caption }) => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker={kicker} title={title} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ opacity: f, textAlign: 'center' }}>
          <div style={{ fontSize: 200 }}>{icon}</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.amber, marginTop: 10 }}>{desc}</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 80, top: 120, fontSize: 120, fontWeight: 900, color: `${COLORS.red}44` }}>{num}</div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>{caption}</Caption>
    </AbsoluteFill>
  );
};

const VerformenScene: React.FC<SceneProps> = (p) => (
  <WCard {...p} num="1" kicker="Wirkung 1" icon="🧽" title="Verformen" desc="Form ändert sich" caption="Eine Kraft kann einen Körper verformen – der Schwamm wird zusammengedrückt." />
);
const BewegenScene: React.FC<SceneProps> = (p) => (
  <WCard {...p} num="2" kicker="Wirkung 2" icon="⚽💨" title="Bewegen / Bremsen" desc="Bewegungszustand ändert sich" caption="Eine Kraft kann einen Körper in Bewegung setzen oder abbremsen." />
);
const RichtungScene: React.FC<SceneProps> = (p) => (
  <WCard {...p} num="3" kicker="Wirkung 3" icon="↩️⚽" title="Richtung ändern" desc="Bewegungsrichtung ändert sich" caption="Eine Kraft kann die Richtung einer Bewegung ändern." />
);

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Kraftwirkung" footer="Kräfte sind unsichtbar – erkennbar an der Wirkung">
      Eine Kraft kann einen Körper verformen,
      <br />
      in Bewegung setzen oder abbremsen
      <br />
      und seine Richtung ändern.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Überall Kräfte" />
      <div style={{ display: 'flex', gap: 34, opacity: f }}>
        {[['🛏️', 'Matratze federt'], ['🚗', 'Auto fährt an'], ['🔄', 'Kurve fahren']].map((c, i) => (
          <div key={i} style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Auch wenn du sie nicht siehst – überall sind Kräfte am Werk.</Caption>
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
  { id: 'verformen', C: VerformenScene, min: 210 },
  { id: 'bewegen', C: BewegenScene, min: 210 },
  { id: 'richtung', C: RichtungScene, min: 210 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KRAFT_WIRKUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const KraftWirkung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KRAFT_WIRKUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kraft-wirkung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
