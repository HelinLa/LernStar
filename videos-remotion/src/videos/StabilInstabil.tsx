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
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo, BackgroundMusic, Sfx, Arrow } from '../components';
import { useFade } from '../magnet';
import { Nucleus } from '../nuclear';
import timings from '../narration/stabil-instabil.timings.json';

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
      <Nucleus cx={960} cy={320} protons={7} neutrons={9} r={80} jiggle={5} frame={frame} />
      <div style={{ height: 120 }} />
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum zerfallen manche Kerne von selbst?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Stabile und instabile Atomkerne
      </div>
    </AbsoluteFill>
  );
};

const KraefteScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zwei Kräfte" title="Abstoßung gegen Zusammenhalt" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <circle cx={560} cy={540} r={54} fill="#ef4444" stroke="#0f172a" strokeWidth={2} />
        <circle cx={760} cy={540} r={54} fill="#ef4444" stroke="#0f172a" strokeWidth={2} />
        <text x={560} y={552} fontSize={40} fontWeight="900" fill="#fff" textAnchor="middle">+</text>
        <text x={760} y={552} fontSize={40} fontWeight="900" fill="#fff" textAnchor="middle">+</text>
      </svg>
      {/* elektrische Abstoßung (rot, auseinander) */}
      <Arrow x1={620} y1={440} x2={480} y2={440} color={COLORS.red} width={8} opacity={f} />
      <Arrow x1={700} y1={440} x2={840} y2={440} color={COLORS.red} width={8} opacity={f} />
      {/* Kernkraft (grün, zusammen) */}
      <Arrow x1={600} y1={640} x2={700} y2={640} color={COLORS.green} width={8} opacity={f} />
      <Arrow x1={720} y1={640} x2={620} y2={640} color={COLORS.green} width={8} opacity={f} />
      <div style={{ position: 'absolute', left: 1080, top: 420, width: 700, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Alle Protonen sind positiv → sie stoßen sich elektrisch ab.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 24, fontWeight: 800 }}>Die starke Kernkraft hält sie zusammen – aber nur auf sehr kurze Entfernung.</div>
      </div>
      <Caption delay={30}>Im Kern kämpfen zwei Kräfte: Die Protonen stoßen sich ab, doch die starke Kernkraft hält alles zusammen.</Caption>
    </AbsoluteFill>
  );
};

const GleichgewichtScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Stabil" title="Ein ausgewogener Kern bleibt ruhig" />
      <Nucleus cx={640} cy={540} protons={6} neutrons={6} r={110} />
      <div style={{ position: 'absolute', left: 1120, top: 440, width: 680, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 25, fontWeight: 800 }}>
          Stimmt das Verhältnis von Protonen und Neutronen, ist die Kernkraft stark genug. Der Kern ist stabil und bleibt für immer, wie er ist.
        </div>
      </div>
      <Caption delay={30}>Bei kleinen Kernen mit einem passenden Verhältnis von Protonen und Neutronen gewinnt der Zusammenhalt. Sie sind stabil.</Caption>
    </AbsoluteFill>
  );
};

const InstabilScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Instabil" title="Zu groß oder unausgewogen – es wackelt" />
      <Nucleus cx={640} cy={540} protons={12} neutrons={16} r={150} jiggle={7} frame={frame} />
      <div style={{ position: 'absolute', left: 1160, top: 440, width: 640, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, fontSize: 24, fontWeight: 800 }}>
          Ist der Kern sehr groß oder das Verhältnis unausgewogen, reicht die kurze Kernkraft nicht mehr aus. Der Kern gerät ins Wanken.
        </div>
      </div>
      <Caption delay={30}>Wird der Kern zu groß oder das Verhältnis unpassend, ist er instabil. Er ist gewissermaßen überladen und gerät ins Wanken.</Caption>
    </AbsoluteFill>
  );
};

const ZerfallScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const emit = frame > 70;
  const ax = emit ? interpolate(frame, [70, 140], [760, 1500], { extrapolateRight: 'clamp' }) : 760;
  const ay = emit ? interpolate(frame, [70, 140], [500, 340], { extrapolateRight: 'clamp' }) : 500;
  const jig = emit ? 2 : 8;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Zerfall" title="Der Kern stößt Strahlung ab" />
      <Nucleus cx={560} cy={540} protons={emit ? 10 : 12} neutrons={emit ? 14 : 16} r={emit ? 130 : 150} jiggle={jig} frame={frame} />
      {emit && <Nucleus cx={ax} cy={ay} protons={2} neutrons={2} r={40} />}
      {emit && <div style={{ position: 'absolute', left: ax - 60, top: ay - 90, fontSize: 26, fontWeight: 900, color: COLORS.amber }}>abgestrahlt</div>}
      <div style={{ position: 'absolute', left: 1180, top: 470, width: 640, fontSize: 24, fontWeight: 800, color: emit ? COLORS.green : COLORS.muted }}>
        {emit ? '✅ Danach ist der Kern kleiner und stabiler.' : '⏳ der Kern sucht einen stabileren Zustand …'}
      </div>
      <Sfx sound="impact" at={70} volume={0.4} />
      <Caption delay={30}>Um stabiler zu werden, stößt ein instabiler Kern von selbst ein Teilchen oder Energie ab. Genau das ist radioaktive Strahlung.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Stabil und instabil" footer="Zerfall = Weg zu einem stabileren Kern">
      Stimmt das Verhältnis von Protonen und Neutronen,
      <br />
      ist ein Kern stabil. Instabile Kerne zerfallen von
      <br />
      selbst und senden dabei Strahlung aus.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🪨', 'Uran', 'sehr großer, instabiler Kern'],
    ['🌳', 'C-14', 'zerfällt langsam'],
    ['💎', 'C-12 / Eisen', 'stabil, zerfällt nie'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Stabil oder radioaktiv" />
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
      <Caption delay={40}>Instabile Kerne sind die Quelle der Radioaktivität – die wir als Nächstes sichtbar machen.</Caption>
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
  { id: 'kraefte', C: KraefteScene, min: 250 },
  { id: 'gleichgewicht', C: GleichgewichtScene, min: 240 },
  { id: 'instabil', C: InstabilScene, min: 240 },
  { id: 'zerfall', C: ZerfallScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STABIL_INSTABIL_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const StabilInstabil: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STABIL_INSTABIL_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/stabil-instabil/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
