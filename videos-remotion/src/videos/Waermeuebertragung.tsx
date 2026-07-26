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
import { HeatWaves, Sun, useFade } from '../thermal';
import timings from '../narration/waermeuebertragung.timings.json';

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
      <div style={{ display: 'flex', gap: 80, marginBottom: 40, fontSize: 120 }}>
        <div>🥄</div><div>🔥</div><div>☀️</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 82, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie wird Wärme übertragen?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Drei ganz verschiedene Wege von warm nach kalt.
      </div>
    </AbsoluteFill>
  );
};

// ── Leitung ────────────────────────────────────────────────────────────
const LeitungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const flow = interpolate(frame, [20, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Weg 1" title="Wärmeleitung – durch Kontakt" />
      {/* Löffel im Tee: Wärme kriecht am Stiel hoch */}
      <div style={{ position: 'absolute', left: 500, top: 620, fontSize: 120 }}>☕</div>
      <div style={{ position: 'absolute', left: 640, top: 320, width: 40, height: 380, borderRadius: 12, background: `linear-gradient(180deg, #ef4444 ${flow * 100}%, #94a3b8 ${flow * 100}%)` }} />
      <div style={{ position: 'absolute', left: 600, top: 260, fontSize: 60 }}>🥄</div>
      <div style={{ position: 'absolute', left: 760, top: 400, fontSize: 44, color: COLORS.red }}>⬆️</div>
      <div style={{ position: 'absolute', left: 830, top: 390, fontSize: 30, fontWeight: 800, color: COLORS.red }}>Wärme kriecht den Metalllöffel hoch</div>
      <div style={{ position: 'absolute', left: 830, top: 470, fontSize: 26, fontWeight: 700, color: COLORS.muted }}>Metalle leiten besonders gut</div>
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Bei Berührung wandert die Wärme durch direkten Kontakt weiter.</Caption>
    </AbsoluteFill>
  );
};

// ── Strömung ───────────────────────────────────────────────────────────
const StroemungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Weg 2" title="Wärmeströmung – aufsteigende Luft" />
      {/* Heizung unten, Pfeile kreisen */}
      <div style={{ position: 'absolute', left: 820, top: 780, fontSize: 90 }}>🔥</div>
      {[0, 1, 2, 3].map((i) => {
        const y = 760 - ((frame * 3 + i * 60) % 480);
        return <div key={i} style={{ position: 'absolute', left: 880 + Math.sin((760 - y) / 60) * 40, top: y, fontSize: 40, color: COLORS.red }}>🔴</div>;
      })}
      <div style={{ position: 'absolute', left: 1120, top: 350, fontSize: 44, color: COLORS.red }}>⬆️ warm steigt</div>
      <div style={{ position: 'absolute', left: 1120, top: 620, fontSize: 40, color: COLORS.sky }}>⬇️ kühl sinkt</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption>Warme Luft ist leichter und steigt – so entsteht ein Wärme-Kreislauf.</Caption>
    </AbsoluteFill>
  );
};

// ── Strahlung ──────────────────────────────────────────────────────────
const StrahlungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Weg 3" title="Wärmestrahlung – ohne Materie" />
      <Sun x={330} y={520} r={90} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {[440, 500, 560, 620].map((y, i) => (
          <line key={i} x1={430} y1={520} x2={430 + (1120 - 430) * p} y2={y} stroke="#fbbf24" strokeWidth={5} opacity={0.8} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 440, fontSize: 150 }}>🧍</div>
      <div style={{ position: 'absolute', left: 700, top: 300, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>durchquert sogar das leere Weltall</div>
      <Sfx sound="whoosh" at={12} volume={0.3} />
      <Caption delay={56}>So kommt die Wärme der Sonne zu uns – ganz ohne Materie dazwischen.</Caption>
    </AbsoluteFill>
  );
};

// ── Übersicht ──────────────────────────────────────────────────────────
const UebersichtScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Alle drei" title="Leitung · Strömung · Strahlung" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 40, opacity: f }}>
          {[['🥄', 'Leitung', 'durch Kontakt', COLORS.red], ['♨️', 'Strömung', 'aufsteigende Luft', COLORS.amber], ['☀️', 'Strahlung', 'ohne Materie', COLORS.sky]].map((c, i) => (
            <div key={i} style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[3]}`, textAlign: 'center' }}>
              <div style={{ fontSize: 74 }}>{c[0]}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 4 }}>{c[2]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Oft wirken sogar mehrere Wege gleichzeitig.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Wärmeübertragung" footer="immer von warm nach kalt">
      Drei Wege: Wärmeleitung (Kontakt),
      <br />
      Wärmeströmung (aufsteigende Stoffe)
      <br />
      und Wärmestrahlung (ohne Materie).
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Alle drei im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🍳" title="Topf leitet" delay={10} />
        <TCard icon="🔥" title="Heizung strömt" delay={30} />
        <TCard icon="☀️" title="Sonne strahlt" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>In deinem Alltag arbeiten alle drei Wärmewege zusammen.</Caption>
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
  { id: 'leitung', C: LeitungScene, min: 240 },
  { id: 'stroemung', C: StroemungScene, min: 240 },
  { id: 'strahlung', C: StrahlungScene, min: 240 },
  { id: 'uebersicht', C: UebersichtScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WAERMEUEBERTRAGUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Waermeuebertragung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WAERMEUEBERTRAGUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/waermeuebertragung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
