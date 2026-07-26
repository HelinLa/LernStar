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
import { Sun, ShadowCone, useFade } from '../astro';
import timings from '../narration/mondfinsternis.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const red = interpolate(Math.sin(frame / 20), [-1, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 190, marginBottom: 20, filter: `sepia(${red}) saturate(${1 + red * 3}) hue-rotate(-20deg)` }}>🌕</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie entsteht eine Mondfinsternis?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum färbt sich der Vollmond tiefrot – der Blutmond?
      </div>
    </AbsoluteFill>
  );
};

// ── Stellung: Erde zwischen Sonne und Mond ─────────────────────────────
const StellungScene: React.FC<SceneProps> = () => {
  const lab = useFade(30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Stellung" title="Erde zwischen Sonne und Mond" />
      <Sun x={250} y={540} r={80} label="Sonne" />
      <div style={{ position: 'absolute', left: 850, top: 460, fontSize: 150 }}>🌍</div>
      <div style={{ position: 'absolute', left: 1560, top: 490, fontSize: 90 }}>🌕</div>
      <div style={{ position: 'absolute', left: 1540, top: 600, fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Mond</div>
      <div style={{ position: 'absolute', left: 780, top: 800, fontSize: 28, fontWeight: 800, color: COLORS.amber, opacity: lab }}>nur bei Vollmond 🌕</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={40}>Bei Vollmond liegen Sonne, Erde und Mond fast auf einer Linie.</Caption>
    </AbsoluteFill>
  );
};

// ── Schatten der Erde auf den Mond ─────────────────────────────────────
const SchattenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const inShadow = frame > dur * 0.4;
  const sun: [number, number] = [230, 540];
  const earth: [number, number] = [820, 540];
  const moon: [number, number] = [1560, 540];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Schatten" title="Erdschatten fällt auf den Mond" />
      <Sun x={sun[0]} y={sun[1]} r={70} />
      <div style={{ position: 'absolute', left: earth[0] - 70, top: earth[1] - 70, fontSize: 150 }}>🌍</div>
      <ShadowCone pts={[[earth[0] + 40, earth[1] - 70], [moon[0], moon[1] - 44], [moon[0], moon[1] + 44], [earth[0] + 40, earth[1] + 70]]} opacity={0.5} />
      <div style={{ position: 'absolute', left: moon[0] - 44, top: moon[1] - 44, fontSize: 88, filter: inShadow ? 'sepia(1) saturate(4) hue-rotate(-20deg) brightness(0.8)' : 'none' }}>🌕</div>
      <div style={{ position: 'absolute', left: moon[0] - 90, top: moon[1] + 70, fontSize: 24, fontWeight: 800, color: COLORS.red }}>{inShadow ? 'im Kernschatten' : 'wandert hinein …'}</div>
      <Sfx sound="impact" at={Math.round(dur * 0.4)} volume={0.36} />
      <Caption delay={Math.round(dur * 0.4) + 6}>Der Mond wandert in den Kernschatten der Erde und verdunkelt sich.</Caption>
    </AbsoluteFill>
  );
};

// ── Blutmond ───────────────────────────────────────────────────────────
const BlutmondScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Blutmond" title="Warum wird er rot?" />
      <div style={{ fontSize: 220, opacity: f, filter: 'sepia(1) saturate(4) hue-rotate(-20deg) brightness(0.85)' }}>🌕</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.red, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Rotes Sonnenlicht wird von der Erdatmosphäre um die Erde gebogen und trifft den Mond.
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Ein wenig rötliches Licht erreicht den Mond – er leuchtet kupferrot.</Caption>
    </AbsoluteFill>
  );
};

// ── Unterschied zu Phasen ──────────────────────────────────────────────
const UnterschiedScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Nicht verwechseln" title="Finsternis ≠ Mondphase" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>🌗</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>Mondphase: nur unser Blickwinkel auf die helle Hälfte</div>
          </div>
          <div style={{ width: 440, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>🌑</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>Finsternis: echter Erdschatten auf dem Mond</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Bei der Finsternis ist wirklich ein Schatten im Spiel – der Erdschatten.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Mondfinsternis" footer="ganz gefahrlos zu beobachten">
      Bei Vollmond steht die Erde zwischen
      <br />
      Sonne und Mond. Der Erdschatten fällt
      <br />
      auf den Mond – er wird oft rötlich.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Outro ──────────────────────────────────────────────────────────────
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
  { id: 'stellung', C: StellungScene, min: 220 },
  { id: 'schatten', C: SchattenScene, min: 240 },
  { id: 'blutmond', C: BlutmondScene, min: 220 },
  { id: 'unterschied', C: UnterschiedScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MONDFINSTERNIS_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Mondfinsternis: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MONDFINSTERNIS_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/mondfinsternis/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
