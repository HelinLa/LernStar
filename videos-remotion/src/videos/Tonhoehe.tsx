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
import { Waveform, useFade } from '../sound';
import timings from '../narration/tonhoehe.timings.json';

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
      <div style={{ display: 'flex', gap: 90, marginBottom: 40, fontSize: 130 }}>
        <div>🐭</div><div>🐻</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wovon hängt die Tonhöhe ab?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum piepst die Maus hoch und brummt der Bär tief?
      </div>
    </AbsoluteFill>
  );
};

// ── Frequenz ───────────────────────────────────────────────────────────
const FrequenzScene: React.FC<SceneProps> = () => {
  const lab = useFade(30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Welle" title="Die Frequenz zählt" />
      <Waveform x={510} y={520} w={900} amplitude={90} freq={5} color={COLORS.sky} />
      <div style={{ position: 'absolute', left: 620, top: 640, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: lab }}>Frequenz = Schwingungen pro Sekunde (Hz)</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={40}>Die Frequenz sagt, wie oft die Schwingung pro Sekunde hin und her geht.</Caption>
    </AbsoluteFill>
  );
};

// ── Hoch ───────────────────────────────────────────────────────────────
const HochScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Schnell" title="Hohe Frequenz = hoher Ton" />
    <Waveform x={510} y={480} w={900} amplitude={90} freq={10} color={COLORS.red} />
    <div style={{ position: 'absolute', left: 1360, top: 380, fontSize: 120 }}>🐭</div>
    <div style={{ position: 'absolute', left: 1350, top: 540, fontSize: 34, fontWeight: 800, color: COLORS.red }}>hoch ↑</div>
    <Sfx sound="pling" at={10} volume={0.4} />
    <Caption>Schnelle Schwingung: Berge liegen eng – wir hören einen hohen Ton.</Caption>
  </AbsoluteFill>
);

// ── Tief ───────────────────────────────────────────────────────────────
const TiefScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Langsam" title="Niedrige Frequenz = tiefer Ton" />
    <Waveform x={510} y={480} w={900} amplitude={90} freq={2.5} color={COLORS.indigo} />
    <div style={{ position: 'absolute', left: 1360, top: 380, fontSize: 120 }}>🐻</div>
    <div style={{ position: 'absolute', left: 1350, top: 540, fontSize: 34, fontWeight: 800, color: COLORS.indigo }}>tief ↓</div>
    <div style={{ position: 'absolute', left: 620, top: 300, fontSize: 26, fontWeight: 800, color: COLORS.muted }}>Lautstärke bleibt gleich!</div>
    <Sfx sound="pop" at={10} volume={0.3} />
    <Caption>Langsame Schwingung: Berge liegen weit – wir hören einen tiefen Ton.</Caption>
  </AbsoluteFill>
);

// ── Hertz-Bereich ──────────────────────────────────────────────────────
const HertzScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Hörbereich" title="20 Hz bis 20 000 Hz" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ opacity: f, textAlign: 'center' }}>
          <div style={{ width: 1200, height: 50, borderRadius: 25, background: 'linear-gradient(90deg,#818cf8,#38bdf8,#ef4444)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 60, fontSize: 30, fontWeight: 800, color: COLORS.indigo }}>20 Hz (tief)</div>
            <div style={{ position: 'absolute', right: 0, top: 60, fontSize: 30, fontWeight: 800, color: COLORS.red }}>20 000 Hz (hoch)</div>
          </div>
          <div style={{ marginTop: 110, fontSize: 30, fontWeight: 700, color: COLORS.muted }}>🐶 Hunde & 🦇 Fledermäuse hören noch viel höher</div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Der Mensch hört von etwa 20 bis 20 000 Hertz.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Tonhöhe" footer="gemessen in Hertz (Hz)">
      Die Tonhöhe hängt von der Frequenz ab:
      <br />
      hohe Frequenz hoher Ton,
      <br />
      niedrige Frequenz tiefer Ton.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übertragen" title="Hoch & tief bei Instrumenten" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>🎻</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: COLORS.red }}>dünn & kurz → hoch</div>
          </div>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>🎸</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: COLORS.indigo }}>dick & lang → tief</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Und beim Singen spannst du die Stimmbänder für hohe Töne stärker.</Caption>
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
  { id: 'frequenz', C: FrequenzScene, min: 220 },
  { id: 'hoch', C: HochScene, min: 220 },
  { id: 'tief', C: TiefScene, min: 220 },
  { id: 'hertz', C: HertzScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TONHOEHE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Tonhoehe: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TONHOEHE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/tonhoehe/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
