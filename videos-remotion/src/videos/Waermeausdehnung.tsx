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
import { ParticleBox, useFade } from '../thermal';
import timings from '../narration/waermeausdehnung.timings.json';

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
      <div style={{ display: 'flex', gap: 80, marginBottom: 40, fontSize: 130 }}>
        <div>🌡️</div><div>🌉</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 78, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Erwärmen: was passiert?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum wird fast alles beim Erwärmen ein bisschen größer?
      </div>
    </AbsoluteFill>
  );
};

// ── Teilchen bewegen sich schneller ────────────────────────────────────
const TeilchenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const heat = interpolate(frame, [10, dur - 20], [0.15, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Blick nach innen" title="Teilchen werden schneller" />
      <ParticleBox x={760} y={320} w={420} h={420} state="liquid" heat={heat} color={COLORS.sky} />
      <div style={{ position: 'absolute', left: 760, top: 770, width: 420, textAlign: 'center', fontSize: 30, fontWeight: 800, color: heat < 0.5 ? COLORS.sky : COLORS.red }}>
        {heat < 0.5 ? 'kalt: ruhig' : 'heiß: heftige Bewegung'}
      </div>
      <div style={{ position: 'absolute', left: 1250, top: 480, fontSize: 44, color: COLORS.amber }}>🔥</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Beim Erwärmen bewegen sich die Teilchen schneller und heftiger.</Caption>
    </AbsoluteFill>
  );
};

// ── Ausdehnen ──────────────────────────────────────────────────────────
const AusdehnenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [20, dur - 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const size = interpolate(grow, [0, 1], [300, 440]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Folge" title="Der Stoff wird größer" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <ParticleBox x={960 - size / 2} y={540 - size / 2} w={size} h={size} state="solid" heat={grow} color={COLORS.indigo} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 700, top: 250, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>mehr Bewegung → mehr Platz → größer</div>
      <Sfx sound="pop" at={Math.round(dur * 0.4)} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Wärmeausdehnung: größer, obwohl kein Teilchen dazukommt.</Caption>
    </AbsoluteFill>
  );
};

// ── Vergleich fest/flüssig/gas ─────────────────────────────────────────
const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Wer am meisten?" title="Gas ≫ Flüssigkeit ≫ Festkörper" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-end', top: 60 }}>
        <div style={{ display: 'flex', gap: 60, alignItems: 'flex-end', opacity: f }}>
          {[['🧱', 'Festkörper', 'wenig', 90, COLORS.muted], ['💧', 'Flüssigkeit', 'mittel', 150, COLORS.sky], ['💨', 'Gas', 'am meisten', 240, COLORS.amber]].map((c, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 70 }}>{c[0] as string}</div>
              <div style={{ width: 200, height: c[3] as number, background: `${c[4]}`, borderRadius: 12, marginTop: 10, opacity: 0.8 }} />
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{c[1] as string}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>{c[2] as string}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Gase dehnen sich am stärksten aus, Festkörper am wenigsten.</Caption>
    </AbsoluteFill>
  );
};

// ── Beispiel Dehnungsfuge ──────────────────────────────────────────────
const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beispiel" title="Dehnungsfugen an der Brücke" />
      <div style={{ opacity: f, textAlign: 'center' }}>
        <div style={{ fontSize: 160 }}>🌉</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}>
          <div style={{ width: 300, height: 40, background: COLORS.muted, borderRadius: 6 }} />
          <div style={{ width: 24, height: 40, background: COLORS.amber, borderRadius: 4 }} />
          <div style={{ width: 300, height: 40, background: COLORS.muted, borderRadius: 6 }} />
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.amber, marginTop: 12 }}>↑ Lücke für die Sommer-Ausdehnung</div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Die kleine Lücke gibt dem Material im Sommer Platz – nichts zerbricht.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Wärmeausdehnung" footer="Gase am stärksten, Festkörper am wenigsten">
      Beim Erwärmen bewegen sich
      <br />
      die Teilchen schneller und
      <br />
      brauchen mehr Platz – der Stoff dehnt sich aus.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Ausdehnung im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🔌" title="Leitungen hängen im Sommer" delay={10} />
        <TCard icon="🫙" title="Deckel im heißen Wasser lösen" delay={30} />
        <TCard icon="🛤️" title="Schienen mit Lücken" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall gibt man dem Material Platz zum Ausdehnen.</Caption>
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
  { id: 'teilchen', C: TeilchenScene, min: 240 },
  { id: 'ausdehnen', C: AusdehnenScene, min: 220 },
  { id: 'vergleich', C: VergleichScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WAERMEAUSDEHNUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Waermeausdehnung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WAERMEAUSDEHNUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/waermeausdehnung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
