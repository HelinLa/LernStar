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
import { Sun, Orbit, useFade } from '../astro';
import timings from '../narration/weltbild.timings.json';

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
      <div style={{ display: 'flex', gap: 60, marginBottom: 40, fontSize: 110 }}>
        <div>🌍</div><div style={{ fontSize: 60 }}>❓</div><div>☀️</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 72, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie änderte sich das Weltbild?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Eine Geschichte mutiger Forscher – und eines Fernrohrs.
      </div>
    </AbsoluteFill>
  );
};

const GeozentrischScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Früher" title="Erde im Mittelpunkt (geozentrisch)" />
      <div style={{ position: 'absolute', left: 900, top: 500, fontSize: 120 }}>🌍</div>
      {[200, 320, 440].map((R, i) => {
        const ang = frame * (2 - i * 0.4);
        const x = 960 + Math.cos((ang * Math.PI) / 180) * R;
        const y = 560 + Math.sin((ang * Math.PI) / 180) * R * 0.6;
        return (
          <React.Fragment key={i}>
            <Orbit cx={960} cy={560} rx={R} ry={R * 0.6} />
            <div style={{ position: 'absolute', left: x - 24, top: y - 24, fontSize: 48 }}>{['🌙', '☀️', '⭐'][i]}</div>
          </React.Fragment>
        );
      })}
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption>Jahrhundertelang glaubte man: Alles kreist um die feststehende Erde.</Caption>
    </AbsoluteFill>
  );
};

const KopernikusScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(20);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Wende" title="Sonne im Mittelpunkt (heliozentrisch)" />
      <Sun x={960} y={560} r={70} />
      {[220, 340, 460].map((R, i) => {
        const ang = frame * (2.4 - i * 0.5);
        const x = 960 + Math.cos((ang * Math.PI) / 180) * R;
        const y = 560 + Math.sin((ang * Math.PI) / 180) * R * 0.6;
        return (
          <React.Fragment key={i}>
            <Orbit cx={960} cy={560} rx={R} ry={R * 0.6} />
            <div style={{ position: 'absolute', left: x - 24, top: y - 24, fontSize: 48 }}>{['🪐', '🌍', '🔴'][i]}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: 'absolute', left: 260, top: 250, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: f }}>Kopernikus: die Erde ist nur ein Planet</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Kopernikus stellte die Sonne ins Zentrum – die Erde ist ein Planet wie die anderen.</Caption>
    </AbsoluteFill>
  );
};

const GalileiScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Beweis" title="Galilei & das Fernrohr" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🔭', 'Galilei blickt zum Himmel'], ['🪐🌑', 'Jupiter hat Monde'], ['🌒', 'Venus hat Phasen']].map((c, i) => (
          <div key={i} style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{c[0]}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Galilei lieferte Beweise, Kepler beschrieb die Bahnen als Ellipsen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Weltbild" footer="Beobachtung schlägt alten Glauben">
      Früher: Erde im Mittelpunkt (geozentrisch).
      <br />
      Kopernikus, Galilei & Kepler zeigten:
      <br />
      Die Sonne steht im Mittelpunkt.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="So arbeitet Wissenschaft" />
      <div style={{ fontSize: 170, opacity: f }}>🔭 → 💡</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Ein einziges gutes Instrument veränderte das ganze Bild vom Kosmos.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Nicht der alte Glaube zählt, sondern die Beobachtung.</Caption>
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
  { id: 'geozentrisch', C: GeozentrischScene, min: 240 },
  { id: 'kopernikus', C: KopernikusScene, min: 260 },
  { id: 'galilei', C: GalileiScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WELTBILD_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Weltbild: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WELTBILD_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/weltbild/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
