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
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo, BackgroundMusic, Sfx, Arrow } from '../components';
import timings from '../narration/bewegungsenergie.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Rollende Kugel (mit Spin-Markierung) ───────────────────────────────
const RollBall: React.FC<{ x: number; y: number; r?: number; rot?: number; color?: string }> = ({ x, y, r = 40, rot = 0, color = COLORS.amber }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `rotate(${rot}deg)` }}>
    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff8, ${color})`, boxShadow: '0 10px 26px rgba(0,0,0,0.45)' }} />
    {/* Spin-Punkt, damit man das Rollen sieht */}
    <div style={{ position: 'absolute', left: r - 6, top: 8, width: 12, height: 12, borderRadius: '50%', background: 'rgba(0,0,0,0.35)' }} />
  </div>
);

// ── Kegel (Bowling-Pin) ────────────────────────────────────────────────
const Pin: React.FC<{ x: number; baseY: number; dx?: number; dy?: number; angle?: number; h?: number }> = ({ x, baseY, dx = 0, dy = 0, angle = 0, h = 96 }) => {
  const w = h * 0.42;
  return (
    <div style={{ position: 'absolute', left: x - w / 2 + dx, top: baseY - h + dy, width: w, height: h, transformOrigin: 'bottom center', transform: `rotate(${angle}deg)` }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50% 50% 42% 42% / 62% 62% 38% 38%', background: 'linear-gradient(180deg,#f8fafc,#cbd5e1)', border: '2px solid #94a3b8', boxShadow: '0 6px 14px rgba(0,0,0,0.35)' }} />
      {/* roter Ring */}
      <div style={{ position: 'absolute', top: h * 0.26, left: 0, width: '100%', height: h * 0.1, background: COLORS.red, opacity: 0.85 }} />
    </div>
  );
};

const Ground: React.FC<{ y: number; x?: number; w?: number }> = ({ y, x = 0, w = 1920 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: 6, background: COLORS.ground }} />
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const bx = interpolate(frame % 120, [0, 120], [140, 380]);
  const rot = interpolate(frame % 120, [0, 120], [0, 360]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 500, height: 240, marginBottom: 10 }}>
        {/* Speed-Linien */}
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ position: 'absolute', left: bx - 70 - k * 26, top: 150 + k * 16 - 12, width: 46, height: 5, borderRadius: 3, background: COLORS.sky, opacity: 0.5 - k * 0.12 }} />
        ))}
        <RollBall x={bx} y={150} r={46} rot={rot} />
        <div style={{ position: 'absolute', left: 60, top: 208, width: 380, height: 6, background: COLORS.ground }} />
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die Bewegungsenergie
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum kann ein rollender Ball etwas umwerfen?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: langsame vs. schnelle Kugel ────────────────────────────
const Lane: React.FC<{ y: number; dur: number; big: boolean; label: string; color: string }> = ({ y, dur, big, label, color }) => {
  const frame = useCurrentFrame();
  const rollStart = 14;
  const rollEnd = Math.round(dur * (big ? 0.42 : 0.5));
  const ballStart = 250;
  const pinX = 1300;
  const ballTarget = pinX - 120;
  const bx = interpolate(frame, [rollStart, rollEnd], [ballStart, ballTarget], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: big ? Easing.linear : Easing.linear });
  const rot = interpolate(frame, [rollStart, rollEnd], [0, big ? 900 : 380], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hit = frame >= rollEnd;
  const scatter = interpolate(frame, [rollEnd, rollEnd + 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const s = hit ? scatter : 0;
  const pins = [0, 1, 2, 3];
  return (
    <>
      <Ground y={y} x={140} w={1500} />
      {/* Speed-Linien hinter der Kugel */}
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ position: 'absolute', left: bx - 62 - k * 24, top: y - 40 - 12 + k * 12, width: big ? 50 : 26, height: 5, borderRadius: 3, background: color, opacity: (frame < rollEnd ? 1 : 0) * (0.55 - k * 0.15) }} />
      ))}
      <RollBall x={bx} y={y - 40} r={38} rot={rot} color={big ? COLORS.amber : COLORS.muted} />
      {pins.map((i) => {
        const dir = i - 1.5;
        const fall = big ? s : s * 0.22;
        const angle = big ? dir * 34 * fall : dir * 8 * fall;
        const dx = big ? dir * 55 * fall + fall * 26 : dir * 6 * fall;
        const dy = big ? -Math.sin(fall * Math.PI) * 40 : 0;
        return <Pin key={i} x={pinX + i * 44} baseY={y} dx={dx} dy={dy} angle={angle} h={90} />;
      })}
      {/* Aufprall-Funken */}
      {big && s > 0 && s < 1
        ? [0, 1, 2, 3, 4].map((k) => {
            const ang = -Math.PI + (k / 4) * Math.PI;
            const reach = 70 * s;
            return <div key={k} style={{ position: 'absolute', left: pinX - 20 + Math.cos(ang) * reach - 6, top: y - 60 + Math.sin(ang) * reach * 0.6 - 6, width: 12, height: 12, borderRadius: '50%', background: color, opacity: 1 - s }} />;
          })
        : null}
      <div style={{ position: 'absolute', left: 160, top: y - 140, fontSize: 34, fontWeight: 800, color }}>{label}</div>
    </>
  );
};

const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => (
  <AbsoluteFill>
    <SceneTitle kicker="Beobachten" title="Tempo entscheidet über die Wirkung" />
    <Lane y={480} dur={dur} big={false} label="langsam → kippt kaum" color={COLORS.muted} />
    <Lane y={760} dur={dur} big label="schnell → wirft alles um" color={COLORS.amber} />
    <Sfx sound="impact" at={Math.round(dur * 0.42) + 2} volume={0.5} />
    <Caption>Je schneller die Kugel rollt, desto kräftiger wirft sie die Kegel um.</Caption>
  </AbsoluteFill>
);

// ── Formel: E = ½·m·v² ─────────────────────────────────────────────────
const FormelScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const y = 470;
  const bx = interpolate(frame % 90, [0, 90], [280, 640]);
  const rot = interpolate(frame % 90, [0, 90], [0, 360]);
  const eq = spring({ frame: frame - Math.round(dur * 0.5), fps, config: { damping: 180 } });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zusammenhang" title="Bewegungsenergie = ½ × Masse × Tempo²" />
      <Ground y={y + 60} x={180} w={640} />
      <RollBall x={bx} y={y} r={44} rot={rot} />
      <Arrow x1={bx + 60} y1={y} x2={bx + 200} y2={y} color={COLORS.sky} width={10} />
      <div style={{ position: 'absolute', left: bx + 90, top: y - 60, fontSize: 40, fontWeight: 800, color: COLORS.sky }}>v</div>
      {/* Gleichung */}
      <div style={{ position: 'absolute', left: 940, top: 460, opacity: eq, transform: `translateX(${interpolate(eq, [0, 1], [40, 0])}px)` }}>
        <div style={{ fontSize: 80, fontWeight: 900 }}>
          E = ½ · m · <span style={{ color: COLORS.sky }}>v²</span>
        </div>
        <div style={{ marginTop: 20, fontSize: 34, fontWeight: 600, color: COLORS.muted, maxWidth: 720 }}>
          Das Tempo zählt <b style={{ color: COLORS.sky }}>im Quadrat</b>.
        </div>
      </div>
      <Caption>In der Bewegung steckt Energie – ein halb mal Masse mal Tempo im Quadrat.</Caption>
    </AbsoluteFill>
  );
};

// ── Variieren ──────────────────────────────────────────────────────────
const VarCard: React.FC<{ icon: string; title: string; text: string; color: string; delay: number; strong?: boolean }> = ({ icon, title, text, color, delay, strong }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 520, padding: '34px 28px', borderRadius: 24, background: COLORS.panel, border: `${strong ? 3 : 2}px solid ${color}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [45, 0])}px)`, boxShadow: strong ? `0 0 40px ${color}55` : 'none' }}>
      <div style={{ fontSize: 70, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, color }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 600, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const VariierenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Ausprobieren" title="Wovon hängt die Bewegungsenergie ab?" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 50 }}>
        <VarCard icon="🏋️" title="doppelte Masse" text="→ doppelte Energie" color={COLORS.muted} delay={10} />
        <VarCard icon="🚀" title="doppeltes Tempo" text="→ VIERfache Energie (v²!)" color={COLORS.sky} delay={34} strong />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pling" at={34} volume={0.5} />
    <Caption delay={54}>Die Masse zählt einfach – das Tempo aber im Quadrat.</Caption>
  </AbsoluteFill>
);

// ── Beispiel: v=3 → 9 J, v=6 → 36 J (×4) ───────────────────────────────
const BeispielScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = spring({ frame: frame - 14, fps, config: { damping: 170 } });
  const two = spring({ frame: frame - Math.round(dur * 0.44), fps, config: { damping: 170 } });
  const four = spring({ frame: frame - Math.round(dur * 0.72), fps, config: { damping: 160 } });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Rechnen" title="Doppeltes Tempo – was macht die Energie?" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.muted, opacity: g, marginBottom: 26 }}>
          Kugel: <b style={{ color: COLORS.amber }}>m = 2 kg</b>
        </div>
        <div style={{ display: 'flex', gap: 70, alignItems: 'center' }}>
          <div style={{ opacity: g, textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.sky, marginBottom: 10 }}>v = 3 m/s</div>
            <div style={{ fontSize: 46, fontWeight: 800 }}>½ · 2 · 3²</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: COLORS.green, marginTop: 8 }}>= 9 J</div>
          </div>
          <div style={{ fontSize: 70, opacity: two, color: COLORS.amber }}>→</div>
          <div style={{ opacity: two, textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.sky, marginBottom: 10 }}>v = 6 m/s</div>
            <div style={{ fontSize: 46, fontWeight: 800 }}>½ · 2 · 6²</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: COLORS.green, marginTop: 8 }}>= 36 J</div>
          </div>
        </div>
        <div style={{ marginTop: 44, fontSize: 52, fontWeight: 900, color: COLORS.amber, opacity: four, transform: `scale(${interpolate(four, [0, 1], [0.7, 1])})` }}>
          Tempo ×2 → Energie ×4 !
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={Math.round(dur * 0.72) + 4} volume={0.55} />
      <Caption color={COLORS.sky}>Nur doppeltes Tempo – und schon viermal so viel Energie.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Bewegungsenergie (kinetische Energie)" footer="Einheit: Joule (J)">
      E = ½ · m · v²
      <br />
      Doppeltes Tempo
      <br />
      bedeutet vierfache Energie.
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
    <SceneTitle kicker="Übertragen" title="Bewegungsenergie im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <InfoCard icon="🚗" title="Auto-Aufprall" text="doppeltes Tempo, vierfacher Aufprall" delay={10} />
        <InfoCard icon="🎳" title="Bowling" text="schnelle Kugel räumt alle Kegel ab" delay={34} />
        <InfoCard icon="🔨" title="Hammer" text="treibt den Nagel nur durch Tempo" delay={58} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pop" at={34} volume={0.42} />
    <Sfx sound="pop" at={58} volume={0.42} />
    <Caption delay={72}>Auto, Bowling, Hammer – überall wirkt die Energie der Bewegung.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 260 },
  { id: 'formel', C: FormelScene, min: 250 },
  { id: 'variieren', C: VariierenScene, min: 220 },
  { id: 'beispiel', C: BeispielScene, min: 300 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 220 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BEWEGUNGSENERGIE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Bewegungsenergie: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BEWEGUNGSENERGIE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/bewegungsenergie/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
