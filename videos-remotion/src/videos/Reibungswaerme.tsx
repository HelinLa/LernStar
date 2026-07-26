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
import timings from '../narration/reibungswaerme.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Rollende Kugel (mit Spin-Markierung) ───────────────────────────────
const RollBall: React.FC<{ x: number; y: number; r?: number; rot?: number; color?: string }> = ({ x, y, r = 40, rot = 0, color = COLORS.amber }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `rotate(${rot}deg)` }}>
    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff8, ${color})`, boxShadow: '0 10px 26px rgba(0,0,0,0.45)' }} />
    <div style={{ position: 'absolute', left: r - 6, top: 8, width: 12, height: 12, borderRadius: '50%', background: 'rgba(0,0,0,0.35)' }} />
  </div>
);

// ── Wärme-Wellen (steigende Schlangenlinien) ───────────────────────────
const HeatWaves: React.FC<{ x: number; y: number; intensity?: number; spread?: number }> = ({ x, y, intensity = 1, spread = 60 }) => {
  const frame = useCurrentFrame();
  const n = Math.max(1, Math.round(3 * intensity));
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {Array.from({ length: n }).map((_, i) => {
        const bx = x + (i - (n - 1) / 2) * (spread / Math.max(1, n));
        const phase = frame * 0.18 + i * 1.1;
        const rise = 70 * intensity;
        const pts = Array.from({ length: 7 }).map((__, k) => {
          const ty = y - (k / 6) * rise;
          const tx = bx + Math.sin(phase + k * 0.9) * 9 * intensity;
          return `${tx},${ty}`;
        });
        const op = interpolate((frame + i * 7) % 60, [0, 20, 60], [0.15, 0.7 * intensity, 0.15]);
        return <polyline key={i} points={pts.join(' ')} fill="none" stroke={COLORS.red} strokeWidth={5} strokeLinecap="round" opacity={op} />;
      })}
    </svg>
  );
};

const Ground: React.FC<{ y: number; x?: number; w?: number; rough?: boolean; color?: string }> = ({ y, x = 0, w = 1920, rough = false, color = COLORS.ground }) => (
  <>
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: 6, background: color }} />
    {rough
      ? Array.from({ length: Math.floor(w / 26) }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: x + i * 26, top: y - 5, width: 4, height: 10, background: color, borderRadius: 2 }} />
        ))
      : null}
  </>
);

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const p = interpolate(frame, [10, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const bx = 150 + p * 240;
  const rot = p * 520;
  const stopped = p > 0.9;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 500, height: 240, marginBottom: 10 }}>
        <RollBall x={bx} y={150} r={46} rot={rot} />
        {stopped ? <HeatWaves x={bx} y={196} intensity={0.5} spread={40} /> : null}
        <div style={{ position: 'absolute', left: 60, top: 208, width: 380, height: 6, background: COLORS.ground }} />
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wohin geht die Energie?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wenn ein rollender Ball einfach liegen bleibt …
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: Ball rollt aus und bleibt liegen ───────────────────────
const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const y = 620;
  const rollStart = 16;
  const rollEnd = Math.round(dur * 0.62);
  const p = interpolate(frame, [rollStart, rollEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const bx = 260 + p * 1080;
  const rot = p * 1300;
  const stopped = frame >= rollEnd;
  const q = spring({ frame: frame - rollEnd - 6, fps, config: { damping: 160 } });
  // Speed-Linien werden schwächer, je langsamer der Ball
  const speed = 1 - p;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Der Ball rollt aus – und bleibt liegen" />
      <Ground y={y + 40} x={140} w={1640} />
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ position: 'absolute', left: bx - 62 - k * 24, top: y - 12 + k * 12, width: 40, height: 5, borderRadius: 3, background: COLORS.amber, opacity: speed * (0.6 - k * 0.16) }} />
      ))}
      <RollBall x={bx} y={y} r={40} rot={rot} />
      {stopped ? (
        <>
          <HeatWaves x={bx} y={y + 36} intensity={0.5} spread={46} />
          <div style={{ position: 'absolute', left: bx - 22, top: y - 150, fontSize: 90, fontWeight: 900, color: COLORS.sky, opacity: q, transform: `scale(${interpolate(q, [0, 1], [0.4, 1])})` }}>?</div>
        </>
      ) : null}
      <Sfx sound="impact" at={rollEnd} volume={0.35} />
      <Caption>Eben hatte er Bewegungsenergie – jetzt liegt er still. Wo ist sie hin?</Caption>
    </AbsoluteFill>
  );
};

// ── Umwandlung: Bewegungsenergie → Wärme ───────────────────────────────
const UmwandlungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const y = 560;
  const bx = 460;
  const arr = spring({ frame: frame - Math.round(dur * 0.34), fps, config: { damping: 180 } });
  const warm = spring({ frame: frame - Math.round(dur * 0.5), fps, config: { damping: 180 } });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zusammenhang" title="Reibung wandelt Bewegung in Wärme" />
      {/* Ball auf Boden, Reibungszone */}
      <Ground y={y + 44} x={220} w={520} rough />
      <HeatWaves x={bx} y={y + 40} intensity={0.9} spread={150} />
      <RollBall x={bx} y={y} r={46} rot={frame * 3} />
      <div style={{ position: 'absolute', left: bx - 70, top: y + 66, width: 140, textAlign: 'center', fontSize: 30, fontWeight: 800, color: COLORS.amber }}>Reibung</div>
      {/* Umwandlungs-Diagramm rechts */}
      <div style={{ position: 'absolute', left: 900, top: y - 60, display: 'flex', alignItems: 'center', gap: 30 }}>
        <div style={{ padding: '22px 28px', borderRadius: 20, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 54 }}>🏃</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.amber, marginTop: 4 }}>Bewegungs-<br />energie</div>
        </div>
        <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.muted, opacity: arr }}>→</div>
        <div style={{ padding: '22px 28px', borderRadius: 20, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center', opacity: warm, transform: `scale(${interpolate(warm, [0, 1], [0.7, 1])})` }}>
          <div style={{ fontSize: 54 }}>🔥</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.red, marginTop: 4 }}>Wärme</div>
        </div>
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.5) + 4} volume={0.45} />
      <Caption>Die Energie ist nicht weg – sie wurde in Wärme umgewandelt.</Caption>
    </AbsoluteFill>
  );
};

// ── Variieren: glatt vs. rau ───────────────────────────────────────────
const SurfaceLane: React.FC<{ y: number; dur: number; rough: boolean; label: string; color: string; reach: number }> = ({ y, dur, rough, label, color, reach }) => {
  const frame = useCurrentFrame();
  const rollStart = 16;
  const rollEnd = Math.round(dur * (rough ? 0.42 : 0.62));
  const p = interpolate(frame, [rollStart, rollEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const startX = 220;
  const bx = startX + p * reach;
  const rot = p * (reach / 5);
  const stopped = frame >= rollEnd;
  return (
    <>
      <Ground y={y + 38} x={180} w={1560} rough={rough} color={rough ? COLORS.ground : COLORS.ice} />
      <RollBall x={bx} y={y} r={36} rot={rot} color={COLORS.amber} />
      {stopped ? <HeatWaves x={bx} y={y + 34} intensity={rough ? 1 : 0.35} spread={rough ? 80 : 34} /> : null}
      <div style={{ position: 'absolute', left: 200, top: y - 96, fontSize: 32, fontWeight: 800, color }}>{label}</div>
    </>
  );
};

const VariierenScene: React.FC<SceneProps> = ({ dur }) => (
  <AbsoluteFill>
    <SceneTitle kicker="Ausprobieren" title="Wie stark hängt vom Untergrund ab" />
    <SurfaceLane y={470} dur={dur} rough={false} label="glatt → rollt weit, wenig Wärme" color={COLORS.ice} reach={1180} />
    <SurfaceLane y={760} dur={dur} rough label="rau → stoppt schnell, viel Wärme" color={COLORS.red} reach={520} />
    <Caption>Mehr Reibung heißt: schnelleres Anhalten und mehr Wärme.</Caption>
  </AbsoluteFill>
);

// ── Erhaltung: Energie geht nie verloren ───────────────────────────────
const ErhaltungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const barW = 900;
  const x = (1920 - barW) / 2;
  const y = 520;
  const conv = interpolate(frame, [Math.round(dur * 0.2), Math.round(dur * 0.7)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const warmW = barW * conv;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Erklären" title="Energie geht nie verloren" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: barW, height: 90, borderRadius: 16, overflow: 'hidden', border: `2px solid ${COLORS.border}` }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: barW, height: '100%', background: COLORS.amber }} />
          <div style={{ position: 'absolute', left: barW - warmW, top: 0, width: warmW, height: '100%', background: COLORS.red }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: barW, marginTop: 18, fontSize: 30, fontWeight: 800 }}>
          <span style={{ color: COLORS.amber }}>🏃 Bewegungsenergie</span>
          <span style={{ color: COLORS.red }}>🔥 Wärme</span>
        </div>
        <div style={{ marginTop: 50, fontSize: 44, fontWeight: 900 }}>
          Die <span style={{ color: COLORS.green }}>Gesamtenergie</span> bleibt gleich.
        </div>
      </AbsoluteFill>
      <Caption>Die Energie wechselt nur die Form – von Bewegung zu Wärme.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Energieumwandlung" footer="Energieerhaltung – nichts geht verloren">
      Energie geht nie verloren.
      <br />
      Reibung wandelt Bewegungs-
      <br />
      energie in Wärme um.
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
    <SceneTitle kicker="Übertragen" title="Reibungswärme im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <InfoCard icon="🛑" title="Bremse" text="wird beim Bremsen richtig heiß" delay={10} />
        <InfoCard icon="🙌" title="Hände reiben" text="werden schnell warm" delay={34} />
        <InfoCard icon="🔥" title="Streichholz" text="entzündet sich durch Reibung" delay={58} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.42} />
    <Sfx sound="pop" at={34} volume={0.42} />
    <Sfx sound="pop" at={58} volume={0.42} />
    <Caption delay={72}>Bremse, Hände, Streichholz – überall wird Bewegung zu Wärme.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 240 },
  { id: 'umwandlung', C: UmwandlungScene, min: 280 },
  { id: 'variieren', C: VariierenScene, min: 240 },
  { id: 'erhaltung', C: ErhaltungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 220 },
  { id: 'outro', C: Outro, min: 110 },
];

export const REIBUNGSWAERME_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Reibungswaerme: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={REIBUNGSWAERME_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/reibungswaerme/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
