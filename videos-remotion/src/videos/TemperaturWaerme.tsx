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
import { Thermometer, ParticleBox, useFade } from '../thermal';
import timings from '../narration/temperatur-waerme.timings.json';

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
        <div>🌡️</div><div>☕</div><div>🛁</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 80, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Temperatur oder Wärme?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Zwei Wörter – aber in der Physik zwei verschiedene Dinge.
      </div>
    </AbsoluteFill>
  );
};

// ── Temperatur = Teilchentempo ─────────────────────────────────────────
const TemperaturScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const heat = interpolate(frame, [10, dur - 20], [0.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const temp = interpolate(heat, [0.1, 1], [5, 90]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Temperatur" title="Wie schnell die Teilchen sind" />
      <ParticleBox x={520} y={340} w={420} h={420} state="liquid" heat={heat} color={COLORS.sky} />
      <Thermometer x={1250} y={300} h={400} temp={temp} label="Temperatur" />
      <div style={{ position: 'absolute', left: 520, top: 790, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>
        {heat < 0.5 ? 'kalt → Teilchen langsam' : 'heiß → Teilchen schnell'}
      </div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Temperatur misst, wie schnell sich die Teilchen bewegen – in Grad Celsius.</Caption>
    </AbsoluteFill>
  );
};

// ── Wärme = Energie · Menge ────────────────────────────────────────────
const WaermeScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Wärme" title="Übertragene Energie" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', opacity: f, fontSize: 40, fontWeight: 800 }}>
        <div style={{ padding: '24px 30px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.red}` }}>🌡️ Temperatur</div>
        <div style={{ fontSize: 60 }}>+</div>
        <div style={{ padding: '24px 30px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>🪣 Menge</div>
        <div style={{ fontSize: 60 }}>=</div>
        <div style={{ padding: '24px 30px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.amber}` }}>🔥 Wärme</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Wärme ist Energie – sie hängt von Temperatur UND Menge ab.</Caption>
    </AbsoluteFill>
  );
};

// ── Vergleich: Tasse vs. Badewanne ─────────────────────────────────────
const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Überraschung" title="Heiß ≠ mehr Wärme" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'flex', gap: 80, opacity: f }}>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 100 }}>☕</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.red, marginTop: 8 }}>90 °C · wenig</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>weniger Wärmeenergie</div>
          </div>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 100 }}>🛁</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.sky, marginTop: 8 }}>40 °C · sehr viel</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.green, marginTop: 6 }}>mehr Wärmeenergie</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="impact" at={14} volume={0.36} />
      <Caption delay={40}>Die kühlere Badewanne enthält wegen der Menge mehr Wärme als die heiße Tasse.</Caption>
    </AbsoluteFill>
  );
};

// ── Wärmefluss ─────────────────────────────────────────────────────────
const FlussScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const mix = interpolate(frame, [20, dur - 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tWarm = interpolate(mix, [0, 1], [80, 45]);
  const tCold = interpolate(mix, [0, 1], [10, 45]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Fluss" title="Wärme läuft von warm nach kalt" />
      <Thermometer x={560} y={300} h={360} temp={tWarm} label="warm" />
      <Thermometer x={1360} y={300} h={360} temp={tCold} label="kalt" />
      <div style={{ position: 'absolute', left: 760, top: 470, width: 400, height: 8, background: 'linear-gradient(90deg,#ef4444,#38bdf8)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', left: 900, top: 400, fontSize: 50, color: COLORS.amber }}>➡️</div>
      <div style={{ position: 'absolute', left: 820, top: 540, fontSize: 26, fontWeight: 800, color: COLORS.muted }}>bis zur Mischtemperatur</div>
      <Sfx sound="whoosh" at={20} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Wärme fließt immer vom Warmen zum Kalten – bis beide gleich warm sind.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Temperatur & Wärme" footer="Wärme fließt von warm nach kalt">
      Temperatur: wie warm (°C).
      <br />
      Wärme: übertragene Energie –
      <br />
      abhängig von Temperatur & Menge.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 380, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Menge macht den Unterschied" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="♨️" title="Wärmflasche – hält lange" delay={10} />
        <TCard icon="🍵" title="Tässchen Tee – kühlt schnell" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Gleich heiß gestartet – die größere Menge wärmt viel länger.</Caption>
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
  { id: 'temperatur', C: TemperaturScene, min: 240 },
  { id: 'waerme', C: WaermeScene, min: 220 },
  { id: 'vergleich', C: VergleichScene, min: 260 },
  { id: 'fluss', C: FlussScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TEMPERATUR_WAERME_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const TemperaturWaerme: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TEMPERATUR_WAERME_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/temperatur-waerme/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
