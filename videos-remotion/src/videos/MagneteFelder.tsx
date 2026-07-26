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
import { BarMagnet, FieldLines, CompassNeedle, MaterialChip, useFade } from '../magnet';
import timings from '../narration/magnete-felder.timings.json';

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
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 100, marginBottom: 40 }}>
        {['🧲', '🧭', '🌍'].map((e, i) => (
          <div key={i} style={{ fontSize: 130, transform: `translateY(${Math.sin(frame / 22 + i) * 16}px)` }}>
            {e}
          </div>
        ))}
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Magnete & Magnetfelder
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Zwei Pole, eine Kraft und ein unsichtbares Feld.
      </div>
    </AbsoluteFill>
  );
};

// ── Pole ───────────────────────────────────────────────────────────────
const PoleScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const split = frame > dur * 0.5;
  const lab = useFade(Math.round(dur * 0.5) + 6);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Grundlage" title="Nordpol & Südpol" />
      {!split ? (
        <BarMagnet cx={960} cy={540} w={520} h={130} />
      ) : (
        <>
          <BarMagnet cx={680} cy={540} w={260} h={130} />
          <BarMagnet cx={1240} cy={540} w={260} h={130} />
          <div style={{ position: 'absolute', left: 940, top: 520, fontSize: 60 }}>✂️</div>
        </>
      )}
      <div style={{ position: 'absolute', left: 660, top: 400, fontSize: 30, fontWeight: 800, color: '#3b82f6', opacity: split ? 0 : 1 }}>Südpol (S)</div>
      <div style={{ position: 'absolute', left: 1120, top: 400, fontSize: 30, fontWeight: 800, color: '#ef4444', opacity: split ? 0 : 1 }}>Nordpol (N)</div>
      <Sfx sound="pop" at={Math.round(dur * 0.5) + 2} volume={0.36} />
      <Caption delay={Math.round(dur * 0.5) + 8}>Zerbrichst du einen Magneten, hat jedes Stück wieder N und S.</Caption>
    </AbsoluteFill>
  );
};

// ── Kraft: abstoßen / anziehen ─────────────────────────────────────────
const KraftScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const attract = frame > dur * 0.5;
  const t = attract
    ? interpolate(frame, [dur * 0.5, dur * 0.72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // abstoßen: N–N, Magnete driften auseinander. anziehen: N–S, driften zusammen.
  const off = attract ? interpolate(t, [0, 1], [220, 30]) : interpolate(t, [0, 1], [60, 220]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Regel" title={attract ? 'Ungleiche Pole ziehen sich an' : 'Gleiche Pole stoßen sich ab'} />
      {/* linker Magnet: N rechts immer */}
      <BarMagnet cx={960 - off} cy={520} w={300} h={110} nRight={true} />
      {/* rechter Magnet: bei abstoßen N links (N–N), bei anziehen S links (N–S) */}
      <BarMagnet cx={960 + off} cy={520} w={300} h={110} nRight={attract ? true : false} />
      <div style={{ position: 'absolute', left: 900, top: 360, fontSize: 70 }}>{attract ? '🧲' : '💥'}</div>
      {attract ? (
        <>
          <div style={{ position: 'absolute', left: 700, top: 680, fontSize: 50, color: COLORS.green }}>➡️</div>
          <div style={{ position: 'absolute', left: 1170, top: 680, fontSize: 50, color: COLORS.green }}>⬅️</div>
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', left: 640, top: 680, fontSize: 50, color: COLORS.red }}>⬅️</div>
          <div style={{ position: 'absolute', left: 1230, top: 680, fontSize: 50, color: COLORS.red }}>➡️</div>
        </>
      )}
      <Sfx sound={attract ? 'impact' : 'pop'} at={Math.round(dur * 0.5) + 4} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 8}>{attract ? 'Nord und Süd springen zusammen.' : 'Nord gegen Nord: eine unsichtbare Kraft drückt auseinander.'}</Caption>
    </AbsoluteFill>
  );
};

// ── Feld ───────────────────────────────────────────────────────────────
const FeldScene: React.FC<SceneProps> = () => {
  const p = useFade(14, 40);
  const lab = useFade(60);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Feld" title="Feldlinien: Nord → Süd" />
      <FieldLines cx={960} cy={560} L={190} progress={p} />
      <BarMagnet cx={960} cy={560} w={380} h={100} />
      <div style={{ position: 'absolute', left: 1200, top: 380, fontSize: 26, fontWeight: 800, color: COLORS.sky, opacity: lab }}>außen: N → S</div>
      <div style={{ position: 'absolute', left: 1180, top: 640, fontSize: 26, fontWeight: 800, color: COLORS.amber, opacity: lab }}>nah an den Polen: am stärksten</div>
      <Sfx sound="whoosh" at={14} volume={0.35} />
      <Caption delay={70}>Das unsichtbare Magnetfeld – dargestellt durch Feldlinien.</Caption>
    </AbsoluteFill>
  );
};

// ── Stoffe ─────────────────────────────────────────────────────────────
const StoffeScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Was haftet?" title="Nur Eisen, Nickel, Kobalt" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 22 }}>
        <MaterialChip icon="🔩" name="Eisen" magnetic delay={10} />
        <MaterialChip icon="⚙️" name="Nickel" magnetic delay={24} />
        <MaterialChip icon="🧱" name="Kobalt" magnetic delay={38} />
        <MaterialChip icon="🟠" name="Kupfer" magnetic={false} delay={52} />
        <MaterialChip icon="🥫" name="Alu" magnetic={false} delay={66} />
        <MaterialChip icon="🪵" name="Holz" magnetic={false} delay={80} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption delay={96}>Kupfer und Alu sind Metalle – aber der Magnet lässt sie los.</Caption>
  </AbsoluteFill>
);

// ── Erde ───────────────────────────────────────────────────────────────
const ErdeScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const swing = Math.sin(frame / 18) * 8;
  const settle = interpolate(frame, [0, 60], [40, 0], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="Die Erde ist ein Magnet" />
      <div style={{ position: 'absolute', left: 560, top: 300, fontSize: 340 }}>🌍</div>
      <div style={{ position: 'absolute', left: 690, top: 250, fontSize: 26, fontWeight: 800, color: COLORS.red }}>Norden</div>
      <CompassNeedle x={1300} y={540} size={200} angle={settle + swing} />
      <div style={{ position: 'absolute', left: 1230, top: 660, fontSize: 26, fontWeight: 800, color: COLORS.muted }}>zeigt nach Norden</div>
      <Sfx sound="pling" at={30} volume={0.35} />
      <Caption delay={40}>Eine frei bewegliche Nadel richtet sich am Erdmagnetfeld aus.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Magnetismus" footer="Feldlinien laufen außen von N nach S">
      Jeder Magnet hat N- und S-Pol.
      <br />
      Gleiche Pole stoßen sich ab,
      <br />
      ungleiche ziehen sich an.
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
  { id: 'pole', C: PoleScene, min: 240 },
  { id: 'kraft', C: KraftScene, min: 260 },
  { id: 'feld', C: FeldScene, min: 240 },
  { id: 'stoffe', C: StoffeScene, min: 240 },
  { id: 'erde', C: ErdeScene, min: 210 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MAGNETE_FELDER_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const MagneteFelder: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNETE_FELDER_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/magnete-felder/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
