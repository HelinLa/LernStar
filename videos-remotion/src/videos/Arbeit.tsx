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
import timings from '../narration/arbeit.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const GROUND_Y = 800;

// ── Kiste (Holzoptik) ──────────────────────────────────────────────────
const Crate: React.FC<{ x: number; y: number; size?: number }> = ({ x, y, size = 150 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size,
      width: size,
      height: size,
      borderRadius: 10,
      background: 'linear-gradient(160deg,#b98a4e,#8a5a2b)',
      border: '5px solid #6b4423',
      boxShadow: '0 14px 30px rgba(0,0,0,0.4)',
    }}
  >
    <div style={{ position: 'absolute', inset: 10, border: '4px solid rgba(107,68,35,0.7)', borderRadius: 4 }} />
    <div style={{ position: 'absolute', left: '10%', top: '50%', width: '80%', height: 4, background: 'rgba(107,68,35,0.7)' }} />
  </div>
);

// ── Person (einfache Figur, Blickrichtung nach rechts) ─────────────────
const Person: React.FC<{ x: number; y: number; push?: boolean; lift?: boolean }> = ({ x, y, push = false, lift = false }) => {
  // y = Fußpunkt (Boden). Figur ~200 hoch.
  const armY = lift ? y - 210 : y - 150;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0 }}>
      {/* Kopf */}
      <div style={{ position: 'absolute', left: -22, top: -200, width: 44, height: 44, borderRadius: '50%', background: '#f1c27d', border: '3px solid #c9974e' }} />
      {/* Körper */}
      <div style={{ position: 'absolute', left: -18, top: -158, width: 36, height: 96, borderRadius: 16, background: COLORS.indigo }} />
      {/* Arm nach vorn (schieben/heben) */}
      <div style={{ position: 'absolute', left: 6, top: armY - y, width: 70, height: 15, borderRadius: 8, background: '#f1c27d', transform: `rotate(${lift ? -20 : push ? 6 : 0}deg)`, transformOrigin: 'left center' }} />
      {/* Beine */}
      <div style={{ position: 'absolute', left: -16, top: -64, width: 15, height: 66, borderRadius: 8, background: '#334155', transform: `rotate(${push ? -14 : 0}deg)`, transformOrigin: 'top center' }} />
      <div style={{ position: 'absolute', left: 4, top: -64, width: 15, height: 66, borderRadius: 8, background: '#334155', transform: `rotate(${push ? 8 : 0}deg)`, transformOrigin: 'top center' }} />
    </div>
  );
};

const Ground: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: GROUND_Y, height: 6, background: COLORS.ground }} />
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const push = 20 + Math.sin(frame / 12) * 12;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 700, height: 300, marginBottom: 30 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 268, height: 5, background: COLORS.ground }} />
        <Person x={230 + push} y={268} push />
        <Crate x={360 + push} y={268} size={120} />
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die Arbeit
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1300, textAlign: 'center', opacity: sub }}>
        Wann leiste ich wirklich Arbeit – und wann nicht?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: Halten (keine Arbeit) vs. Schieben (Arbeit) ────────────
const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const showRight = frame >= Math.round(dur * 0.5);
  // rechte Kiste wird geschoben
  const pushX = interpolate(frame, [Math.round(dur * 0.55), dur], [0, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Halten oder bewegen?" />
      {/* linke Hälfte: Halten */}
      <div style={{ position: 'absolute', left: 120, top: 300, width: 720, height: 560 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 500, height: 5, background: COLORS.ground }} />
        <Person x={230} y={500} lift />
        <Crate x={310} y={310} size={110} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', textAlign: 'center', fontSize: 40, fontWeight: 800, color: COLORS.red }}>❌ Nur halten</div>
        <div style={{ position: 'absolute', left: 0, top: 540, width: '100%', textAlign: 'center', fontSize: 30, fontWeight: 700, color: COLORS.muted }}>Weg = 0 → keine Arbeit</div>
      </div>
      {/* rechte Hälfte: Schieben */}
      <div style={{ position: 'absolute', left: 1080, top: 300, width: 720, height: 560, opacity: showRight ? 1 : 0.15 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 500, height: 5, background: COLORS.ground }} />
        <Person x={130 + pushX} y={500} push />
        <Crate x={260 + pushX} y={500} size={110} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', textAlign: 'center', fontSize: 40, fontWeight: 800, color: COLORS.green }}>✅ Schieben</div>
        <div style={{ position: 'absolute', left: 0, top: 540, width: '100%', textAlign: 'center', fontSize: 30, fontWeight: 700, color: COLORS.muted }}>Kraft bewegt Weg → Arbeit</div>
      </div>
      <Caption>Nur festhalten ist keine Arbeit. Erst das Bewegen zählt in der Physik.</Caption>
    </AbsoluteFill>
  );
};

// ── Formel: W = F · s ──────────────────────────────────────────────────
const FormelScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startPush = Math.round(dur * 0.12);
  const pushX = interpolate(frame, [startPush, Math.round(dur * 0.6)], [0, 340], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const moving = frame >= startPush;
  const eq = spring({ frame: frame - Math.round(dur * 0.5), fps, config: { damping: 180 } });
  const px = 380 + pushX;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zusammenhang" title="Arbeit = Kraft × Weg" />
      <Ground />
      <Person x={px - 130} y={GROUND_Y} push />
      <Crate x={px} y={GROUND_Y} size={140} />
      {/* Kraftpfeil F */}
      <Arrow x1={px - 90} y1={GROUND_Y - 70} x2={px + 40} y2={GROUND_Y - 70} color={COLORS.amber} width={12} opacity={moving ? 1 : 0} />
      <div style={{ position: 'absolute', left: px - 70, top: GROUND_Y - 120, fontSize: 34, fontWeight: 800, color: COLORS.amber, opacity: moving ? 1 : 0 }}>F</div>
      {/* Wegstrecke s */}
      <div style={{ position: 'absolute', left: 380, top: GROUND_Y + 24, width: pushX, height: 4, background: COLORS.sky }} />
      <div style={{ position: 'absolute', left: 380, top: GROUND_Y + 14, width: 4, height: 24, background: COLORS.sky }} />
      <div style={{ position: 'absolute', left: 380 + pushX, top: GROUND_Y + 14, width: 4, height: 24, background: COLORS.sky }} />
      <div style={{ position: 'absolute', left: 380 + pushX / 2 - 20, top: GROUND_Y + 40, fontSize: 34, fontWeight: 800, color: COLORS.sky }}>s</div>
      {/* Gleichung */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', opacity: eq, transform: `scale(${interpolate(eq, [0, 1], [0.8, 1])})` }}>
        <span style={{ fontSize: 96, fontWeight: 900 }}>W = </span>
        <span style={{ fontSize: 96, fontWeight: 900, color: COLORS.amber }}>F</span>
        <span style={{ fontSize: 96, fontWeight: 900 }}> · </span>
        <span style={{ fontSize: 96, fontWeight: 900, color: COLORS.sky }}>s</span>
      </div>
      <Caption>Eine Kraft bewegt den Körper ein Stück – Kraft mal Weg ergibt die Arbeit.</Caption>
    </AbsoluteFill>
  );
};

// ── Variieren: was macht die Arbeit größer/null ───────────────────────
const VarCard: React.FC<{ icon: string; title: string; text: string; color: string; delay: number }> = ({ icon, title, text, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 430, padding: '30px 24px', borderRadius: 24, background: COLORS.panel, border: `2px solid ${color}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [45, 0])}px)` }}>
      <div style={{ fontSize: 66, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 8, color }}>{title}</div>
      <div style={{ fontSize: 27, fontWeight: 600, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const VariierenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Ausprobieren" title="Wovon hängt die Arbeit ab?" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <VarCard icon="💪" title="mehr Kraft" text="größere Kraft F → mehr Arbeit" color={COLORS.amber} delay={10} />
        <VarCard icon="📏" title="mehr Weg" text="längerer Weg s → mehr Arbeit" color={COLORS.sky} delay={32} />
        <VarCard icon="🛑" title="kein Weg" text="s = 0 → Arbeit = 0 (nur halten)" color={COLORS.red} delay={54} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pop" at={32} volume={0.42} />
    <Sfx sound="pop" at={54} volume={0.42} />
    <Caption delay={70}>Mehr Kraft oder mehr Weg = mehr Arbeit. Ohne Weg gibt es keine Arbeit.</Caption>
  </AbsoluteFill>
);

// ── Joule: Einheit + Rechenbeispiel ────────────────────────────────────
const JouleScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = spring({ frame: frame - 16, fps, config: { damping: 170 } });
  const ex = spring({ frame: frame - Math.round(dur * 0.48), fps, config: { damping: 180 } });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Erklären" title="Arbeit misst man in Joule" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 60, fontWeight: 900, opacity: u, transform: `translateY(${interpolate(u, [0, 1], [30, 0])}px)` }}>
          1 Joule = 1 Newton · 1 Meter
        </div>
        <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: u }}>
          1 J = 1 N · 1 m
        </div>
        <div
          style={{
            marginTop: 60,
            padding: '28px 54px',
            borderRadius: 24,
            background: 'linear-gradient(160deg, rgba(56,189,248,0.2), rgba(255,255,255,0.05))',
            border: `2px solid ${COLORS.sky}`,
            fontSize: 48,
            fontWeight: 800,
            opacity: ex,
            transform: `scale(${interpolate(ex, [0, 1], [0.85, 1])})`,
          }}
        >
          <span style={{ color: COLORS.amber }}>10 N</span> · <span style={{ color: COLORS.sky }}>2 m</span> = <span style={{ color: COLORS.green }}>20 J</span>
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={Math.round(dur * 0.48) + 4} volume={0.5} />
      <Caption color={COLORS.sky}>Kraft in Newton mal Weg in Metern ergibt die Arbeit in Joule.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Mechanische Arbeit" footer="Einheit: Joule (J) = N · m">
      W = F · s
      <br />
      Arbeit entsteht nur, wenn sich der Körper
      <br />
      in Richtung der Kraft bewegt.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const InfoCard: React.FC<{ icon: string; title: string; text: string; ok: boolean; delay: number }> = ({ icon, title, text, ok, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  const col = ok ? COLORS.green : COLORS.red;
  return (
    <div style={{ width: 390, padding: '30px 24px', borderRadius: 24, background: COLORS.panel, border: `2px solid ${col}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
      <div style={{ fontSize: 66, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 600, color: col, lineHeight: 1.3 }}>{ok ? '✅ ' : '❌ '}{text}</div>
    </div>
  );
};

const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Arbeit oder keine Arbeit?" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <InfoCard icon="🏋️" title="Kiste heben" text="Arbeit (Weg nach oben)" ok delay={10} />
        <InfoCard icon="➡️" title="Kiste schieben" text="Arbeit (Weg vorwärts)" ok delay={34} />
        <InfoCard icon="🧍" title="Kiste halten" text="keine Arbeit (Weg = 0)" ok={false} delay={58} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pop" at={34} volume={0.42} />
    <Sfx sound="pop" at={58} volume={0.42} />
    <Caption delay={72}>Heben und schieben sind Arbeit – reines Halten ist keine.</Caption>
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
  { id: 'formel', C: FormelScene, min: 240 },
  { id: 'variieren', C: VariierenScene, min: 230 },
  { id: 'joule', C: JouleScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ARBEIT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Arbeit: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ARBEIT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/arbeit/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
