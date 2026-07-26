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
import { ForceArrow, useFade } from '../forces';
import timings from '../narration/reibung.timings.json';

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
      <div style={{ fontSize: 150, marginBottom: 20 }}>🛒🛑</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was bremst den Wagen?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Er wird von selbst langsamer – obwohl ihn niemand anhält.
      </div>
    </AbsoluteFill>
  );
};

const ReibungScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Kraft" title="Reibung wirkt entgegen" />
      <div style={{ position: 'absolute', left: 640, top: 500, fontSize: 110, opacity: f }}>📦</div>
      <div style={{ opacity: f }}>
        <ForceArrow x={820} y={560} angleDeg={0} len={260} color={COLORS.sky} label="Bewegung" width={10} />
        <ForceArrow x={780} y={640} angleDeg={180} len={200} color={COLORS.red} label="Reibung" width={10} />
      </div>
      <div style={{ position: 'absolute', left: 400, top: 680, right: 200, height: 8, background: `repeating-linear-gradient(90deg, ${COLORS.muted} 0 14px, transparent 14px 28px)`, opacity: f }} />
      <Sfx sound="whoosh" at={14} volume={0.32} />
      <Caption delay={30}>Zwischen den Flächen wirkt die Reibungskraft immer gegen die Bewegung – sie bremst.</Caption>
    </AbsoluteFill>
  );
};

const UntergrundScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const rows = [
    { s: '🧊', name: 'Eis', reib: 'kleine Reibung', bar: 120, col: COLORS.sky, dist: 'rollt weit' },
    { s: '🪵', name: 'Holz', reib: 'mittlere Reibung', bar: 260, col: COLORS.amber, dist: 'mittel' },
    { s: '🧶', name: 'Teppich', reib: 'große Reibung', bar: 400, col: COLORS.red, dist: 'stoppt schnell' },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Untergrund" title="Eis, Holz, Teppich" />
      <AbsoluteFill style={{ justifyContent: 'center', top: 60 }}>
        <div style={{ opacity: f, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start', paddingLeft: 260 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ fontSize: 60, width: 90 }}>{r.s}</div>
              <div style={{ width: 220, fontSize: 30, fontWeight: 800 }}>{r.name}</div>
              <div style={{ width: r.bar, height: 30, borderRadius: 8, background: r.col }} />
              <div style={{ fontSize: 26, fontWeight: 800, color: r.col }}>{r.dist}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={30}>Auf glattem Eis rollt der Wagen weit, auf rauem Teppich stoppt er schnell – je rauer, desto mehr Reibung.</Caption>
    </AbsoluteFill>
  );
};

const ZweiseitigScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Fluch & Segen" title="Ohne Reibung ginge nichts" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🚶', 'gehen'], ['🛑', 'bremsen'], ['🪢', 'Knoten hält']].map((c, i) => (
          <div key={i} style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Reibung bremst und verschleißt – aber ohne sie könntest du nicht laufen und nicht bremsen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Reibung" footer="ohne Reibung weder gehen noch bremsen">
      Die Reibungskraft wirkt der Bewegung entgegen
      <br />
      und bremst. Je rauer der Untergrund,
      <br />
      desto größer die Reibung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Mal viel, mal wenig" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🏖️', 'Sand streuen', 'mehr Reibung'], ['🛞', 'Reifenprofil', 'mehr Reibung'], ['🛢️', 'Öl schmieren', 'weniger Reibung']].map((c, i) => (
          <div key={i} style={{ width: 340, padding: '28px 16px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 72 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.amber, marginTop: 4 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Mal will man viel Reibung – Sand und Profil – mal wenig: Öl schmiert dort, wo sie stört.</Caption>
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
  { id: 'reibung', C: ReibungScene, min: 240 },
  { id: 'untergrund', C: UntergrundScene, min: 260 },
  { id: 'zweiseitig', C: ZweiseitigScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const REIBUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Reibung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={REIBUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/reibung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
