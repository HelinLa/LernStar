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
import { Sun, Orbit, HalfLitSphere, PHASES, useFade } from '../astro';
import timings from '../narration/mondphasen.timings.json';

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
  const idx = Math.floor(frame / 12) % PHASES.length;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 200, marginBottom: 20 }}>{PHASES[idx].icon}</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum verändert der Mond sein Aussehen?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Mal Sichel, mal Scheibe – verändert sich der Mond wirklich?
      </div>
    </AbsoluteFill>
  );
};

// ── Leuchtet nicht selbst ──────────────────────────────────────────────
const LeuchtetScene: React.FC<SceneProps> = () => {
  const lab = useFade(30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Grundlage" title="Der Mond leuchtet nicht selbst" />
      <Sun x={300} y={540} r={90} label="Sonne" />
      <HalfLitSphere x={1200} y={540} r={160} sunAngleDeg={0} litColor="#e2e8f0" darkColor="#1e293b" />
      <div style={{ position: 'absolute', left: 1300, top: 400, fontSize: 28, fontWeight: 800, color: COLORS.amber, opacity: lab }}>helle Hälfte ☀️</div>
      <div style={{ position: 'absolute', left: 980, top: 400, fontSize: 28, fontWeight: 800, color: COLORS.muted, opacity: lab }}>dunkle Hälfte 🌑</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={40}>Die Sonne beleuchtet immer genau eine Hälfte des Mondes.</Caption>
    </AbsoluteFill>
  );
};

// ── Umlauf um die Erde ─────────────────────────────────────────────────
const UmlaufScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ang = interpolate(frame, [10, dur - 10], [0, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cx = 1150, cy = 540, R = 300;
  const mx = cx + Math.cos((ang * Math.PI) / 180) * R;
  const my = cy + Math.sin((ang * Math.PI) / 180) * R;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Umlauf" title="Der Mond kreist um die Erde" />
      <Sun x={230} y={540} r={70} />
      <Orbit cx={cx} cy={cy} rx={R} />
      <div style={{ position: 'absolute', left: cx - 60, top: cy - 60, fontSize: 120 }}>🌍</div>
      {/* Mond immer zur Sonne (links) beleuchtet → sunAngle 180 */}
      <HalfLitSphere x={mx} y={my} r={54} sunAngleDeg={180} litColor="#e2e8f0" darkColor="#1e293b" />
      <div style={{ position: 'absolute', left: cx - 90, top: cy + 340, fontSize: 26, fontWeight: 800, color: COLORS.sky }}>Umlauf ≈ 1 Monat</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Beim Umlauf sehen wir aus wechselnden Richtungen auf seine helle Hälfte.</Caption>
    </AbsoluteFill>
  );
};

// ── Phasen ─────────────────────────────────────────────────────────────
const PhasenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Phasen" title="Von Neumond bis Vollmond" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 18, opacity: f, flexWrap: 'wrap', width: 1600, justifyContent: 'center' }}>
          {PHASES.map((p, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 90 }}>{p.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.muted, marginTop: 4 }}>{p.name}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Neumond: dunkle Seite zu uns. Vollmond: ganze helle Hälfte zu uns.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Mondphasen" footer="der Mond ändert sich nicht – nur unser Blick">
      Die Sonne beleuchtet immer eine
      <br />
      Hälfte des Mondes. Beim Umlauf sehen
      <br />
      wir unterschiedlich viel davon.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übertragen" title="Zu- oder abnehmend?" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>🌒</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>rechts hell → zunehmend</div>
          </div>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>🌘</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>links hell → abnehmend</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>An der hellen Seite erkennst du, wo der Mond in seinem Umlauf steht.</Caption>
    </AbsoluteFill>
  );
};

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
  { id: 'leuchtet', C: LeuchtetScene, min: 220 },
  { id: 'umlauf', C: UmlaufScene, min: 260 },
  { id: 'phasen', C: PhasenScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MONDPHASEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Mondphasen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MONDPHASEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/mondphasen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
