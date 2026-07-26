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
import timings from '../narration/teleskop.timings.json';

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
      <div style={{ display: 'flex', gap: 60, marginBottom: 40, fontSize: 120 }}>
        <div>🔭</div><div>🌕</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 78, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie holt ein Teleskop den Himmel heran?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Aus einer kleinen Scheibe werden plötzlich Krater und Gebirge.
      </div>
    </AbsoluteFill>
  );
};

const VergroessernScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [20, dur - 20], [1, 3.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Aufgabe 1" title="Vergrößern" />
      <div style={{ fontSize: 160, transform: `scale(${zoom})` }}>🌕</div>
      <div style={{ position: 'absolute', bottom: 220, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>mehr Einzelheiten: Krater & Gebirge</div>
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Mit Linsen oder Spiegeln vergrößert das Teleskop das Bild.</Caption>
    </AbsoluteFill>
  );
};

const SammelnScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const big = frame > dur * 0.5;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Aufgabe 2" title="Licht sammeln" />
      <div style={{ display: 'flex', gap: 120, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 90 }}>👁️</div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: `4px solid ${COLORS.muted}`, margin: '10px auto' }} />
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.muted }}>Auge: winzig</div>
          <div style={{ fontSize: 30 }}>⭐</div>
        </div>
        <div style={{ fontSize: 60 }}>vs</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 90 }}>🔭</div>
          <div style={{ width: 140, height: 140, borderRadius: '50%', border: `5px solid ${COLORS.amber}`, margin: '10px auto', background: 'radial-gradient(circle, rgba(251,191,36,0.3), transparent)' }} />
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.amber }}>große Öffnung: viel Licht</div>
          <div style={{ fontSize: 30 }}>⭐⭐⭐✨</div>
        </div>
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.5)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Die große Öffnung sammelt viel Licht – auch schwache Objekte werden sichtbar.</Caption>
    </AbsoluteFill>
  );
};

const GroesserScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Regel" title="Je größer, desto besser" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end', opacity: f }}>
        {[80, 150, 240].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ width: s, height: s, borderRadius: '50%', border: `5px solid ${COLORS.sky}`, background: 'radial-gradient(circle, rgba(56,189,248,0.25), transparent)' }} />
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10, color: COLORS.sky }}>{['klein', 'mittel', 'groß'][i]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Ein größerer Spiegel sammelt mehr Licht und zeigt fernere, schwächere Sterne.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Teleskop" footer="je größer die Öffnung, desto besser">
      Ein Teleskop vergrößert das Bild
      <br />
      und sammelt mit großer Öffnung viel
      <br />
      Licht – ferne, schwache Objekte sichtbar.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Vom Garten bis ins All" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        {[['🔭', 'Fernrohr'], ['🏔️🔭', 'Bergobservatorium'], ['🛰️', 'Weltraumteleskop']].map((c, i) => (
          <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Alle sammeln Licht und vergrößern – um tiefer ins Weltall zu blicken.</Caption>
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
  { id: 'vergroessern', C: VergroessernScene, min: 240 },
  { id: 'sammeln', C: SammelnScene, min: 260 },
  { id: 'groesser', C: GroesserScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TELESKOP_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Teleskop: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TELESKOP_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/teleskop/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
