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
import { Bg, SceneTitle, Caption, Arrow, MerksatzBox, StarLogo, BackgroundMusic, Sfx } from '../components';
import timings from '../narration/hubarbeit.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Person (einfache Figur) ────────────────────────────────────────────
const Person: React.FC<{ x: number; y: number; scale?: number; step?: boolean }> = ({ x, y, scale = 1, step = false }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
    <div style={{ position: 'absolute', left: -20, top: -186, width: 40, height: 40, borderRadius: '50%', background: '#f1c27d', border: '3px solid #c9974e' }} />
    <div style={{ position: 'absolute', left: -16, top: -148, width: 32, height: 88, borderRadius: 14, background: COLORS.indigo }} />
    {/* Arme */}
    <div style={{ position: 'absolute', left: 8, top: -140, width: 54, height: 13, borderRadius: 7, background: '#f1c27d', transform: `rotate(${step ? -34 : -12}deg)`, transformOrigin: 'left center' }} />
    {/* Beine (beim Steigen gespreizt) */}
    <div style={{ position: 'absolute', left: -14, top: -62, width: 14, height: 60, borderRadius: 7, background: '#334155', transform: `rotate(${step ? -26 : -4}deg)`, transformOrigin: 'top center' }} />
    <div style={{ position: 'absolute', left: 2, top: -62, width: 14, height: 60, borderRadius: 7, background: '#334155', transform: `rotate(${step ? 20 : 4}deg)`, transformOrigin: 'top center' }} />
  </div>
);

// ── Treppe (Stufen steigen nach rechts) ────────────────────────────────
const Stairs: React.FC<{ x: number; baseY: number; steps?: number; stepW?: number; stepH?: number }> = ({ x, baseY, steps = 5, stepW = 90, stepH = 62 }) => (
  <>
    {Array.from({ length: steps }).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x + i * stepW,
          top: baseY - (i + 1) * stepH,
          width: (steps - i) * stepW,
          height: stepH,
          background: i % 2 === 0 ? '#3b4a63' : '#334155',
          borderTop: `3px solid ${COLORS.sky}`,
          borderLeft: '2px solid rgba(255,255,255,0.08)',
        }}
      />
    ))}
  </>
);

// Position auf der Treppe (oben-vorn-Kante der Stufe i, 0-basiert)
const stepTop = (x: number, baseY: number, i: number, stepW = 90, stepH = 62) => ({
  px: x + i * stepW + 20,
  py: baseY - (i + 1) * stepH,
});

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const climb = Math.floor((frame / 24) % 4);
  const p = stepTop(150, 300, climb, 80, 48);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 560, height: 320, marginBottom: 10 }}>
        <Stairs x={150} baseY={300} steps={4} stepW={80} stepH={48} />
        <Person x={p.px} y={p.py} scale={0.72} step />
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die Hubarbeit
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1300, textAlign: 'center', opacity: sub }}>
        Warum kostet Treppensteigen mehr Kraft als Geradeausgehen?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: eben gehen vs. Treppe steigen ──────────────────────────
const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const walkX = interpolate(frame, [10, dur], [0, 260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const showRight = frame >= Math.round(dur * 0.42);
  const climbProg = interpolate(frame, [Math.round(dur * 0.46), dur], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const ci = Math.min(4, Math.floor(climbProg));
  const rp = stepTop(1200, 720, ci, 70, 46);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Eben gehen oder hochsteigen?" />
      {/* links: eben gehen (Vollbild-Koordinaten) */}
      <div style={{ position: 'absolute', left: 120, top: 300, width: 640, textAlign: 'center', fontSize: 38, fontWeight: 800, color: COLORS.green }}>😌 Eben gehen</div>
      <div style={{ position: 'absolute', left: 170, top: 660, width: 560, height: 5, background: COLORS.ground }} />
      <Person x={260 + walkX} y={660} scale={0.85} />
      <div style={{ position: 'absolute', left: 120, top: 690, width: 640, textAlign: 'center', fontSize: 28, fontWeight: 700, color: COLORS.muted }}>gleiche Höhe → keine Hubarbeit</div>
      {/* rechts: Treppe steigen */}
      <div style={{ position: 'absolute', left: 1080, top: 300, width: 720, textAlign: 'center', fontSize: 38, fontWeight: 800, color: COLORS.amber, opacity: showRight ? 1 : 0.25 }}>😤 Treppe steigen</div>
      <div style={{ opacity: showRight ? 1 : 0.2 }}>
        <Stairs x={1200} baseY={720} steps={5} stepW={70} stepH={46} />
        <Person x={rp.px} y={rp.py} scale={0.85} step />
      </div>
      <div style={{ position: 'absolute', left: 1080, top: 690, width: 720, textAlign: 'center', fontSize: 28, fontWeight: 700, color: COLORS.muted, opacity: showRight ? 1 : 0.25 }}>jede Stufe hebt dein Gewicht → Hubarbeit</div>
      <Caption>Nur beim Hochsteigen hebst du dein Gewicht nach oben – das ist die Hubarbeit.</Caption>
    </AbsoluteFill>
  );
};

// ── Formel: W = m·g·h ──────────────────────────────────────────────────
const FormelScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const baseY = 820;
  const climbProg = interpolate(frame, [Math.round(dur * 0.1), Math.round(dur * 0.55)], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const ci = Math.min(4, Math.floor(climbProg));
  const p = stepTop(360, baseY, ci, 90, 62);
  const topY = baseY - 5 * 62;
  const eq = spring({ frame: frame - Math.round(dur * 0.5), fps, config: { damping: 180 } });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zusammenhang" title="Hubarbeit = Masse × Ortsfaktor × Höhe" />
      <Stairs x={360} baseY={baseY} steps={5} stepW={90} stepH={62} />
      <Person x={p.px} y={p.py} scale={0.9} step />
      {/* Gewichtskraft nach unten */}
      <Arrow x1={p.px} y1={p.py - 60} x2={p.px} y2={p.py + 40} color={COLORS.red} width={10} />
      <div style={{ position: 'absolute', left: p.px + 16, top: p.py - 30, fontSize: 28, fontWeight: 800, color: COLORS.red }}>F_G</div>
      {/* Höhe h (vertikale Klammer links) */}
      <div style={{ position: 'absolute', left: 300, top: topY, width: 4, height: 5 * 62, background: COLORS.sky }} />
      <div style={{ position: 'absolute', left: 288, top: topY, width: 28, height: 4, background: COLORS.sky }} />
      <div style={{ position: 'absolute', left: 288, top: baseY - 4, width: 28, height: 4, background: COLORS.sky }} />
      <div style={{ position: 'absolute', left: 232, top: topY + 5 * 31 - 24, fontSize: 40, fontWeight: 800, color: COLORS.sky }}>h</div>
      {/* Gleichung */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', opacity: eq, transform: `scale(${interpolate(eq, [0, 1], [0.8, 1])})` }}>
        <span style={{ fontSize: 88, fontWeight: 900 }}>W = m · g · </span>
        <span style={{ fontSize: 88, fontWeight: 900, color: COLORS.sky }}>h</span>
      </div>
      <Caption>Du hebst deine Gewichtskraft um die Höhe h – Masse mal Ortsfaktor mal Höhe.</Caption>
    </AbsoluteFill>
  );
};

// ── Variieren ──────────────────────────────────────────────────────────
const VarCard: React.FC<{ icon: string; title: string; text: string; color: string; delay: number }> = ({ icon, title, text, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 440, padding: '30px 24px', borderRadius: 24, background: COLORS.panel, border: `2px solid ${color}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [45, 0])}px)` }}>
      <div style={{ fontSize: 66, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 8, color }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 600, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const VariierenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Ausprobieren" title="Wovon hängt die Hubarbeit ab?" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <VarCard icon="🏋️" title="mehr Masse" text="schwerer → mehr Hubarbeit" color={COLORS.amber} delay={10} />
        <VarCard icon="🪜" title="mehr Höhe" text="höher hinauf → mehr Hubarbeit" color={COLORS.sky} delay={32} />
        <VarCard icon="↔️" title="waagerechter Weg" text="zählt nicht – nur die Höhe" color={COLORS.green} delay={54} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pop" at={32} volume={0.42} />
    <Sfx sound="pop" at={54} volume={0.42} />
    <Caption delay={70}>Schwerer oder höher = mehr Arbeit. Der waagerechte Weg zählt nicht mit.</Caption>
  </AbsoluteFill>
);

// ── Beispiel: 60 kg · 10 · 3 m = 1800 J ────────────────────────────────
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
          Kind: <b style={{ color: COLORS.amber }}>m = 60 kg</b> &nbsp;·&nbsp; <b>g = 10 N/kg</b> &nbsp;·&nbsp; <b style={{ color: COLORS.sky }}>h = 3 m</b>
        </div>
        <div style={{ fontSize: 68, fontWeight: 900, opacity: g }}>
          W = <span style={{ color: COLORS.amber }}>60</span> · 10 · <span style={{ color: COLORS.sky }}>3</span>
        </div>
        <div style={{ marginTop: 40, fontSize: 84, fontWeight: 900, color: COLORS.green, opacity: res, transform: `scale(${interpolate(res, [0, 1], [0.7, 1])})` }}>
          = 1800 J
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={Math.round(dur * 0.52) + 4} volume={0.5} />
      <Caption color={COLORS.sky}>Masse mal Ortsfaktor mal Höhe – hier 1800 Joule Hubarbeit.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Hubarbeit" footer="Einheit: Joule (J)">
      W = m · g · h
      <br />
      Es zählt nur die überwundene Höhe –
      <br />
      nicht der waagerechte Weg.
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
    <SceneTitle kicker="Übertragen" title="Hubarbeit im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <InfoCard icon="🛗" title="Aufzug" text="hebt Menschen nach oben" delay={10} />
        <InfoCard icon="🥾" title="Bergwandern" text="hebt den Körper viele Höhenmeter" delay={34} />
        <InfoCard icon="📦" title="Lasten heben" text="Kiste ins Regal stellen" delay={58} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pop" at={34} volume={0.42} />
    <Sfx sound="pop" at={58} volume={0.42} />
    <Caption delay={72}>Aufzug, Bergwanderung, Lastenheben – überall wird Hubarbeit verrichtet.</Caption>
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
  { id: 'variieren', C: VariierenScene, min: 230 },
  { id: 'beispiel', C: BeispielScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const HUBARBEIT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Hubarbeit: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={HUBARBEIT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/hubarbeit/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
