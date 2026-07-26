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
  Easing,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo, BackgroundMusic, Sfx } from '../components';
import timings from '../narration/lageenergie.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Stein (grauer Körper) ──────────────────────────────────────────────
const Stone: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 42 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '52% 48% 55% 45%',
      background: 'radial-gradient(circle at 34% 30%, #cbd5e1, #64748b)',
      border: '2px solid #475569',
      boxShadow: '0 10px 26px rgba(0,0,0,0.45)',
    }}
  />
);

// ── Pfahl (wird bei Aufprall in den Boden getrieben) ───────────────────
const Stake: React.FC<{ x: number; topY: number; groundY: number }> = ({ x, topY, groundY }) => (
  <div style={{ position: 'absolute', left: x - 12, top: topY, width: 24, height: groundY - topY, background: 'linear-gradient(180deg,#a16207,#713f12)', borderRadius: 4 }} />
);

// ── Höhenmarkierung (gestrichelt) + h-Label ────────────────────────────
const HeightMark: React.FC<{ x: number; topY: number; groundY: number; label?: string; color?: string }> = ({ x, topY, groundY, label = 'h', color = COLORS.sky }) => (
  <>
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <line x1={x} y1={topY} x2={x} y2={groundY} stroke={color} strokeWidth={3} strokeDasharray="8 8" />
      <line x1={x - 16} y1={topY} x2={x + 16} y2={topY} stroke={color} strokeWidth={3} />
      <line x1={x - 16} y1={groundY} x2={x + 16} y2={groundY} stroke={color} strokeWidth={3} />
    </svg>
    <div style={{ position: 'absolute', left: x - 46, top: (topY + groundY) / 2 - 24, fontSize: 40, fontWeight: 800, color }}>{label}</div>
  </>
);

const Ground: React.FC<{ y: number; x?: number; w?: number }> = ({ y, x = 0, w = 1920 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: 6, background: COLORS.ground }} />
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const bob = Math.sin(frame / 22) * 10;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 500, height: 300, marginBottom: 10 }}>
        <div style={{ position: 'absolute', left: 250, top: 60 + bob }}>
          <Stone x={0} y={0} r={54} />
        </div>
        {/* Höhen-Hinweis: gestrichelte Linie vom Stein zum Boden */}
        <div style={{ position: 'absolute', left: 170, top: 120, width: 0, height: 138, borderLeft: `3px dashed ${COLORS.sky}`, opacity: 0.7 }} />
        <div style={{ position: 'absolute', left: 128, top: 175, fontSize: 34, fontWeight: 800, color: COLORS.sky }}>h</div>
        <div style={{ position: 'absolute', left: 60, top: 258, width: 380, height: 6, background: COLORS.ground }} />
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die Lageenergie
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wo steckt Energie in einem Gegenstand, der ganz oben liegt?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: niedrig (kleine Wirkung) vs. hoch (große Wirkung) ──────
const FallColumn: React.FC<{ cx: number; startY: number; groundY: number; dur: number; big: boolean; label: string; color: string }> = ({ cx, startY, groundY, dur, big, label, color }) => {
  const frame = useCurrentFrame();
  const dropStart = Math.round(dur * 0.3);
  const dropEnd = Math.round(dur * 0.62);
  const stakeDrive = big ? 52 : 22; // hoher Stein treibt Pfahl tiefer
  const r = 40;
  const stakeUp = 70; // Pfahl ragt zunächst 70 px aus dem Boden
  const targetY = groundY - stakeUp + stakeDrive - r; // Stein sitzt auf getriebenem Pfahl
  const y = interpolate(frame, [dropStart, dropEnd], [startY, targetY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
  const landed = frame >= dropEnd;
  const burst = interpolate(frame, [dropEnd, dropEnd + 14, dropEnd + 40], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const stakeTop = groundY - stakeUp + (landed ? stakeDrive : 0);
  return (
    <>
      <HeightMark x={cx - 150} topY={startY} groundY={groundY} color={color} />
      <Stone x={cx} y={y} r={r} />
      {/* Pfahl (ragt aus dem Boden, wird beim Aufprall eingetrieben) */}
      <Stake x={cx} topY={stakeTop} groundY={groundY} />
      {/* Aufprall-Funken */}
      {burst > 0
        ? [0, 1, 2, 3, 4, 5].map((k) => {
            const ang = -Math.PI + (k / 5) * Math.PI;
            const reach = (big ? 80 : 40) * burst;
            return (
              <div key={k} style={{ position: 'absolute', left: cx + Math.cos(ang) * reach - 6, top: stakeTop + Math.sin(ang) * reach * 0.6 - 6, width: 13, height: 13, borderRadius: '50%', background: color, opacity: burst }} />
            );
          })
        : null}
      <div style={{ position: 'absolute', left: cx - 170, top: startY - 70, width: 340, textAlign: 'center', fontSize: 34, fontWeight: 800, color }}>{label}</div>
    </>
  );
};

const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const groundY = 820;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Höhe speichert Energie" />
      <Ground y={groundY} x={120} w={720} />
      <Ground y={groundY} x={1080} w={720} />
      <FallColumn cx={480} startY={430} groundY={groundY} dur={dur} big={false} label="niedrig → kleine Wirkung" color={COLORS.muted} />
      <FallColumn cx={1440} startY={250} groundY={groundY} dur={dur} big label="hoch → große Wirkung" color={COLORS.amber} />
      <Sfx sound="impact" at={Math.round(dur * 0.62)} volume={0.5} />
      <Caption>Je höher der Stein lag, desto kräftiger treibt er den Pfahl beim Aufprall.</Caption>
    </AbsoluteFill>
  );
};

// ── Formel: E = m·g·h ──────────────────────────────────────────────────
const FormelScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const groundY = 860;
  const topY = 470;
  const cx = 520;
  const bob = Math.sin(frame / 20) * 6;
  const eq = spring({ frame: frame - Math.round(dur * 0.5), fps, config: { damping: 180 } });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zusammenhang" title="Lageenergie = Masse × Ortsfaktor × Höhe" />
      <Ground y={groundY} x={200} w={620} />
      <Stone x={cx} y={topY + bob} r={48} />
      <HeightMark x={cx - 220} topY={topY} groundY={groundY} />
      {/* Gleichung */}
      <div style={{ position: 'absolute', left: 900, top: 470, opacity: eq, transform: `translateX(${interpolate(eq, [0, 1], [40, 0])}px)` }}>
        <div style={{ fontSize: 80, fontWeight: 900 }}>
          E = m · g · <span style={{ color: COLORS.sky }}>h</span>
        </div>
        <div style={{ marginTop: 20, fontSize: 34, fontWeight: 600, color: COLORS.muted, maxWidth: 720 }}>
          = die Hubarbeit, die vorher hineingesteckt wurde
        </div>
      </div>
      <Caption>Die Höhe speichert Energie – Masse mal Ortsfaktor mal Höhe.</Caption>
    </AbsoluteFill>
  );
};

// ── Variieren ──────────────────────────────────────────────────────────
const VarCard: React.FC<{ icon: string; title: string; text: string; color: string; delay: number }> = ({ icon, title, text, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 470, padding: '32px 26px', borderRadius: 24, background: COLORS.panel, border: `2px solid ${color}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [45, 0])}px)` }}>
      <div style={{ fontSize: 70, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, color }}>{title}</div>
      <div style={{ fontSize: 27, fontWeight: 600, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const VariierenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Ausprobieren" title="Wovon hängt die Lageenergie ab?" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 50 }}>
        <VarCard icon="🪜" title="mehr Höhe" text="höher gelegen → mehr Lageenergie" color={COLORS.sky} delay={10} />
        <VarCard icon="🏋️" title="mehr Masse" text="schwerer → mehr Lageenergie" color={COLORS.amber} delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pop" at={34} volume={0.42} />
    <Caption delay={54}>Höher oder schwerer bedeutet mehr gespeicherte Lageenergie.</Caption>
  </AbsoluteFill>
);

// ── Beispiel: 2 kg · 10 · 5 = 100 J ────────────────────────────────────
const BeispielScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = spring({ frame: frame - 14, fps, config: { damping: 170 } });
  const res = spring({ frame: frame - Math.round(dur * 0.52), fps, config: { damping: 170 } });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Rechnen" title="Ein Beispiel zum Mitrechnen" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.muted, opacity: g, marginBottom: 30 }}>
          Stein: <b style={{ color: COLORS.amber }}>m = 2 kg</b> &nbsp;·&nbsp; <b>g = 10 N/kg</b> &nbsp;·&nbsp; <b style={{ color: COLORS.sky }}>h = 5 m</b>
        </div>
        <div style={{ fontSize: 68, fontWeight: 900, opacity: g }}>
          E = <span style={{ color: COLORS.amber }}>2</span> · 10 · <span style={{ color: COLORS.sky }}>5</span>
        </div>
        <div style={{ marginTop: 40, fontSize: 84, fontWeight: 900, color: COLORS.green, opacity: res, transform: `scale(${interpolate(res, [0, 1], [0.7, 1])})` }}>
          = 100 J
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={Math.round(dur * 0.52) + 4} volume={0.5} />
      <Caption color={COLORS.sky}>Masse mal Ortsfaktor mal Höhe – hier 100 Joule Lageenergie.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Lageenergie (potenzielle Energie)" footer="Einheit: Joule (J)">
      E = m · g · h
      <br />
      Energie, die ein Körper
      <br />
      durch seine Höhe besitzt.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const InfoCard: React.FC<{ icon: string; title: string; text: string; delay: number }> = ({ icon, title, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 400, padding: '30px 24px', borderRadius: 24, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
      <div style={{ fontSize: 68, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Lageenergie im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <InfoCard icon="🏞️" title="Stausee" text="Wasser weit oben treibt Turbinen" delay={10} />
        <InfoCard icon="🎿" title="Skispringer" text="am Start hoch = viel Energie" delay={34} />
        <InfoCard icon="💧" title="Wasserturm" text="hoch gelegener Wasservorrat" delay={58} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pop" at={34} volume={0.42} />
    <Sfx sound="pop" at={58} volume={0.42} />
    <Caption delay={72}>Stausee, Skisprung, Wasserturm – überall speichert die Höhe Energie.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'formel', C: FormelScene, min: 250 },
  { id: 'variieren', C: VariierenScene, min: 210 },
  { id: 'beispiel', C: BeispielScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LAGEENERGIE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Lageenergie: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LAGEENERGIE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/lageenergie/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
