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
import { useFade } from '../astro';
import timings from '../narration/entfernungen.timings.json';

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
      <div style={{ fontSize: 180, marginBottom: 20 }}>🌌📏</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 76, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie weit ist es im Weltall?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Kilometer versagen völlig – man misst mit dem Licht.
      </div>
    </AbsoluteFill>
  );
};

const LichtjahrScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Wichtig!" title="Ein Lichtjahr ist eine STRECKE" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', opacity: f, fontSize: 40, fontWeight: 800 }}>
        <div style={{ padding: '24px 30px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.red}` }}>❌ keine Zeit</div>
        <div style={{ fontSize: 50 }}>→</div>
        <div style={{ padding: '24px 30px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}` }}>✅ Strecke in 1 Jahr</div>
      </div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 700, color: COLORS.amber, opacity: f }}>Licht: 300 000 km/s → unvorstellbar weit</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Ein Lichtjahr ist die Strecke, die das Licht in einem Jahr zurücklegt.</Caption>
    </AbsoluteFill>
  );
};

const BlitzScene: React.FC<SceneProps> = ({ dur }) => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Lichtlaufzeit" title="Wie lange reist das Licht?" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 40, opacity: f }}>
          {[['🌙', 'Mond', '1,3 Sekunden'], ['☀️', 'Sonne', '8 Minuten'], ['⭐', 'nächster Stern', '4 Jahre']].map((c, i) => (
            <div key={i} style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
              <div style={{ fontSize: 74 }}>{c[0]}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.amber, marginTop: 4 }}>{c[2]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="whoosh" at={14} volume={0.3} />
      <Caption delay={40}>Die Sonne siehst du immer so, wie sie vor 8 Minuten war.</Caption>
    </AbsoluteFill>
  );
};

const SterneScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Clou" title="Blick ins All = Blick in die Vergangenheit" />
      <div style={{ fontSize: 180, opacity: f }}>🔭⏳</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Zu fernen Galaxien braucht Licht Millionen Jahre.
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Du siehst die Sterne so, wie sie vor langer Zeit aussahen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Lichtjahr" footer="fernes Licht zeigt die Vergangenheit">
      Entfernungen im Weltall misst man in
      <br />
      Lichtjahren. Ein Lichtjahr ist die Strecke,
      <br />
      die das Licht in einem Jahr zurücklegt.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Licht von erloschenen Sternen" />
      <div style={{ fontSize: 180, opacity: f }}>⭐💀</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.muted, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Manch funkelnder Stern ist in Wirklichkeit längst erloschen.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Sein Licht war nur noch Jahrtausende zu uns unterwegs.</Caption>
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
  { id: 'lichtjahr', C: LichtjahrScene, min: 240 },
  { id: 'blitz', C: BlitzScene, min: 240 },
  { id: 'sterne', C: SterneScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENTFERNUNGEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Entfernungen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENTFERNUNGEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/entfernungen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
