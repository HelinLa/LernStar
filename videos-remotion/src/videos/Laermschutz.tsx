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
import { DbMeter, SoundWaves, useFade } from '../sound';
import timings from '../narration/laermschutz.timings.json';

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
        <div>📢</div><div>🙉</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 82, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie schützen wir uns vor Lärm?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Zu lauter Schall kann dein Gehör dauerhaft schädigen.
      </div>
    </AbsoluteFill>
  );
};

// ── Gefahr: ab 85 dB ───────────────────────────────────────────────────
const GefahrScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Gefahr" title="Ab etwa 85 dB wird es kritisch" />
      <DbMeter x={460} y={400} db={105} w={1000} />
      <div style={{ position: 'absolute', left: 460 + 1000 * (85 / 130), top: 360, fontSize: 26, fontWeight: 800, color: COLORS.red }}>↓ 85 dB</div>
      <div style={{ position: 'absolute', left: 460, top: 560, fontSize: 30, fontWeight: 800, color: COLORS.muted, opacity: f }}>🎤 Konzert · 🪚 Kreissäge liegen deutlich darüber</div>
      <Sfx sound="impact" at={10} volume={0.4} />
      <Caption delay={30}>Zu laut UND zu lange – dann leidet das Gehör.</Caption>
    </AbsoluteFill>
  );
};

// ── Abstand ────────────────────────────────────────────────────────────
const AbstandScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [20, dur - 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const personX = interpolate(t, [0, 1], [700, 1500]);
  const db = interpolate(t, [0, 1], [100, 55]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Schutz 1" title="Abstand halten" />
      <div style={{ position: 'absolute', left: 340, top: 440, fontSize: 120 }}>📢</div>
      <SoundWaves x={470} y={500} count={4} />
      <div style={{ position: 'absolute', left: personX, top: 460, fontSize: 110 }}>🧍</div>
      <DbMeter x={600} y={780} db={db} w={720} />
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Je weiter weg, desto leiser kommt der Lärm am Ohr an.</Caption>
    </AbsoluteFill>
  );
};

// ── Gehörschutz ────────────────────────────────────────────────────────
const GehoerschutzScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const on = frame > dur * 0.45;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Schutz 2" title="Gehörschutz aufsetzen" />
      <div style={{ position: 'absolute', left: 820, top: 380, fontSize: 200 }}>{on ? '🧑‍🏭' : '🧍'}</div>
      {on ? <div style={{ position: 'absolute', left: 1010, top: 420, fontSize: 90 }}>🎧</div> : null}
      <DbMeter x={620} y={760} db={on ? 60 : 100} w={680} />
      <div style={{ position: 'absolute', left: 700, top: 300, fontSize: 30, fontWeight: 800, color: on ? COLORS.green : COLORS.red }}>
        {on ? 'gedämpft → sicher ✅' : 'ungeschützt → gefährlich ⚠️'}
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.45)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.45) + 6}>Ohrstöpsel oder Kapseln dämpfen den Schall vor dem Trommelfell.</Caption>
    </AbsoluteFill>
  );
};

// ── Raum dämpfen ───────────────────────────────────────────────────────
const RaumScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Schutz 3" title="Den Raum dämpfen" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 34, opacity: f }}>
          {[['🪟', 'Vorhänge'], ['🧶', 'Teppiche'], ['🧱', 'Schallschutzplatten']].map((c, i) => (
            <div key={i} style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
              <div style={{ fontSize: 74 }}>{c[0]}</div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Weiche Materialien schlucken den Schall – der Nachhall wird kleiner.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Lärmschutz" footer="dein Gehör erholt sich nicht – schütz es rechtzeitig">
      Lärm ab etwa 85 dB schadet.
      <br />
      Schütze dich durch Abstand,
      <br />
      Gehörschutz und weiche Räume.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Gehörschutz im Einsatz" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="👷" title="Bauarbeiter" delay={10} />
        <TCard icon="🎸" title="Musiker" delay={30} />
        <TCard icon="🎚️" title="Tonstudio" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Dein Gehör kann sich nicht erholen – schütze es rechtzeitig.</Caption>
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
  { id: 'gefahr', C: GefahrScene, min: 220 },
  { id: 'abstand', C: AbstandScene, min: 240 },
  { id: 'gehoerschutz', C: GehoerschutzScene, min: 240 },
  { id: 'raum', C: RaumScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LAERMSCHUTZ_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Laermschutz: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LAERMSCHUTZ_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/laermschutz/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
