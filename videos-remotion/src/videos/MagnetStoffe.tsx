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
import { BarMagnet, MaterialChip, useFade } from '../magnet';
import timings from '../narration/magnet-stoffe.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const MATS = [
  { icon: '🔩', name: 'Eisen', m: true },
  { icon: '🔧', name: 'Stahl', m: true },
  { icon: '⚙️', name: 'Nickel', m: true },
  { icon: '🟠', name: 'Kupfer', m: false },
  { icon: '🥫', name: 'Alu', m: false },
  { icon: '🪵', name: 'Holz', m: false },
  { icon: '🧴', name: 'Plastik', m: false },
  { icon: '🪟', name: 'Glas', m: false },
];

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 60, marginBottom: 30, alignItems: 'center' }}>
        <div style={{ fontSize: 150, transform: `translateX(${Math.sin(frame / 18) * 12}px)` }}>🧲</div>
        <div style={{ fontSize: 90 }}>❓</div>
        <div style={{ fontSize: 80 }}>🔩🥫🪵</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 76, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Welche Stoffe zieht ein Magnet an?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Hält ein Magnet wirklich jedes Metall?
      </div>
    </AbsoluteFill>
  );
};

// ── Beobachten: Magnet testet Materialien ──────────────────────────────
const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // durchlaufe Materialien: ein Testobjekt springt (magnetisch) oder nicht
  const idx = Math.min(MATS.length - 1, Math.floor(interpolate(frame, [20, dur - 20], [0, MATS.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const cur = MATS[idx];
  const local = frame - (20 + idx * ((dur - 40) / MATS.length));
  const jump = cur.m ? interpolate(local, [0, 16], [0, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Test" title="Der Magnet-Check" />
      <BarMagnet cx={520} cy={540} w={280} h={110} nRight />
      {/* Testobjekt rechts vom Magneten */}
      <div style={{ position: 'absolute', left: 900 - jump, top: 480, fontSize: 120, transition: 'none' }}>{cur.icon}</div>
      <div style={{ position: 'absolute', left: 880, top: 640, fontSize: 34, fontWeight: 800, color: cur.m ? COLORS.green : COLORS.muted }}>
        {cur.name}: {cur.m ? 'wird angezogen ✅' : 'bleibt liegen ✖️'}
      </div>
      <Sfx sound={cur.m ? 'impact' : 'pop'} at={2} volume={0.3} />
      <Caption>Manche springen sofort an den Magneten – andere nicht.</Caption>
    </AbsoluteFill>
  );
};

// ── Sortieren: zwei Gruppen ────────────────────────────────────────────
const SortierenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Sortieren" title="Zwei Gruppen" />
    <div style={{ position: 'absolute', left: 200, top: 250, fontSize: 34, fontWeight: 800, color: COLORS.green }}>🧲 magnetisch</div>
    <div style={{ position: 'absolute', left: 1080, top: 250, fontSize: 34, fontWeight: 800, color: COLORS.muted }}>✖️ nicht magnetisch</div>
    <div style={{ position: 'absolute', left: 160, top: 340, display: 'flex', gap: 18, flexWrap: 'wrap', width: 720 }}>
      {MATS.filter((m) => m.m).map((m, i) => (
        <MaterialChip key={m.name} icon={m.icon} name={m.name} magnetic delay={10 + i * 14} />
      ))}
    </div>
    <div style={{ position: 'absolute', left: 1040, top: 340, display: 'flex', gap: 18, flexWrap: 'wrap', width: 760 }}>
      {MATS.filter((m) => !m.m).map((m, i) => (
        <MaterialChip key={m.name} icon={m.icon} name={m.name} magnetic={false} delay={60 + i * 14} />
      ))}
    </div>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption delay={130}>Überraschung: Kupfer und Alu sind Metalle – aber nicht magnetisch.</Caption>
  </AbsoluteFill>
);

// ── Regel ──────────────────────────────────────────────────────────────
const RegelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Regel" title="Nur drei Metalle" />
      <div style={{ display: 'flex', gap: 40, opacity: f, transform: `scale(${interpolate(f, [0, 1], [0.8, 1])})` }}>
        {[['🔩', 'Eisen'], ['⚙️', 'Nickel'], ['🧱', 'Kobalt']].map(([ic, nm], i) => (
          <div key={i} style={{ width: 280, padding: '34px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>{ic}</div>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>{nm}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 30, fontSize: 34, fontWeight: 700, color: COLORS.amber, opacity: f }}>+ Stahl (enthält Eisen)</div>
      <Sfx sound="pling" at={16} volume={0.45} />
      <Caption delay={40}>Eisen, Nickel, Kobalt – und Stahl. Sonst nichts.</Caption>
    </AbsoluteFill>
  );
};

// ── Beispiel: Recycling / Dose ─────────────────────────────────────────
const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beispiel" title="Woraus ist das?" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>🥫🧲</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10, color: COLORS.green }}>bleibt hängen → Eisen/Stahl</div>
          </div>
          <div style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.muted}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>🥫⬇️</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10, color: COLORS.muted }}>fällt ab → Aluminium</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Mit dem Magnet-Test trennst du Eisen vom Rest – genau wie im Recycling.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Magnetische Stoffe" footer="viele Metalle sind NICHT magnetisch">
      Magnetisch sind nur
      <br />
      Eisen, Nickel und Kobalt –
      <br />
      und Stahl.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 29, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Magnet im Einsatz" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="🧲🚗" title="Schrottplatz-Kran" delay={10} />
        <TCard icon="🧲📋" title="Kühlschrank-Magnet" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Der Kran hebt nur Eisen – die Aludose bleibt liegen.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 300 },
  { id: 'sortieren', C: SortierenScene, min: 280 },
  { id: 'regel', C: RegelScene, min: 220 },
  { id: 'beispiel', C: BeispielScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MAGNET_STOFFE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const MagnetStoffe: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNET_STOFFE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/magnet-stoffe/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
