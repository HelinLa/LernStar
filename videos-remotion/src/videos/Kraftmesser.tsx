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
import { Spring, Scale, Crate, useFade } from '../forces';
import timings from '../narration/kraftmesser.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const SPX = 900, SPY = 250, BASE = 200;

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 150, marginBottom: 20 }}>⚖️🪝</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie misst man eine Kraft?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Eine Kraft ist unsichtbar – der Federkraftmesser macht sie ablesbar.
      </div>
    </AbsoluteFill>
  );
};

const PrinzipScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const load = frame > dur * 0.4;
  const stretch = load ? 160 : 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Prinzip" title="Die Feder dehnt sich" />
      <Spring x={SPX} y={SPY} baseLen={BASE} stretch={stretch} />
      {load ? <Crate x={SPX} y={SPY + BASE + stretch + 50} s={90} label="Last" /> : null}
      <div style={{ position: 'absolute', left: 1100, top: 400, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>{load ? 'Kraft → Feder wird länger' : 'ohne Last: Feder in Ruhe'}</div>
      <Sfx sound="pop" at={Math.round(dur * 0.4)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.4) + 6}>Hängst du eine Kraft an, dehnt sich die Feder – je größer die Kraft, desto länger.</Caption>
    </AbsoluteFill>
  );
};

const SkalaScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ablesen" title="Skala in Newton" />
      <Spring x={SPX} y={SPY} baseLen={BASE} stretch={120} />
      <Crate x={SPX} y={SPY + BASE + 120 + 50} s={80} label="4 N" />
      <div style={{ opacity: f }}>
        <Scale x={1080} y={SPY} h={340} max={10} value={4} />
      </div>
      <div style={{ position: 'absolute', left: 1250, top: 430, fontSize: 34, fontWeight: 900, color: COLORS.amber, opacity: f }}>← Zeiger: 4 N</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Ein Zeiger an der Feder zeigt auf die Skala – hier 4 Newton.</Caption>
    </AbsoluteFill>
  );
};

const AblesenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const val = 2 + Math.abs(Math.sin(frame / 40)) * 6;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Klein & groß" title="Kleine Kraft, große Kraft" />
      <Spring x={SPX} y={SPY} baseLen={BASE} stretch={val * 30} />
      <Crate x={SPX} y={SPY + BASE + val * 30 + 50} s={80} label={`${Math.round(val)} N`} />
      <Scale x={1080} y={SPY} h={340} max={10} value={val} />
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.4)}>Kleine Kraft dehnt wenig, große Kraft dehnt stark – einfach und genau.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Federkraftmesser" footer="je größer die Kraft, desto länger die Feder">
      Die Feder dehnt sich unter der Kraft.
      <br />
      Ein Zeiger zeigt den Wert auf der Skala –
      <br />
      abgelesen in Newton.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Federn überall" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🧳', 'Kofferwaage'], ['⚖️', 'Zeigerwaage']].map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Überall dehnt oder staucht eine Feder und zeigt die Kraft an.</Caption>
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
  { id: 'prinzip', C: PrinzipScene, min: 240 },
  { id: 'skala', C: SkalaScene, min: 220 },
  { id: 'ablesen', C: AblesenScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KRAFTMESSER_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kraftmesser: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KRAFTMESSER_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kraftmesser/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
