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
import { ParticleBox, Thermometer, useFade } from '../thermal';
import timings from '../narration/aggregatzustaende.timings.json';

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
        <div>🧊</div><div>💧</div><div>💨</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 80, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Die drei Aggregatzustände
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Eis, Wasser, Dampf – derselbe Stoff in drei Zuständen.
      </div>
    </AbsoluteFill>
  );
};

// ── Drei Zustände nebeneinander ────────────────────────────────────────
const DreiScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Blick nach innen" title="Fest · flüssig · gasförmig" />
      <div style={{ position: 'absolute', left: 180, top: 320, opacity: f }}>
        <ParticleBox x={0} y={0} w={320} h={340} state="solid" heat={0.1} color={COLORS.sky} label="fest (Eis)" />
      </div>
      <div style={{ position: 'absolute', left: 800, top: 320, opacity: f }}>
        <ParticleBox x={0} y={0} w={320} h={340} state="liquid" heat={0.5} color={COLORS.sky} label="flüssig" />
      </div>
      <div style={{ position: 'absolute', left: 1420, top: 320, opacity: f }}>
        <ParticleBox x={0} y={0} w={320} h={340} state="gas" heat={1} color={COLORS.amber} label="gasförmig" />
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Fest: dichtes Gitter. Flüssig: beweglich. Gas: frei und schnell.</Caption>
    </AbsoluteFill>
  );
};

// ── Schmelzen / Erstarren ──────────────────────────────────────────────
const SchmelzenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const melted = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übergang bei 0 °C" title="Schmelzen & Erstarren" />
      <ParticleBox x={620} y={330} w={400} h={400} state={melted ? 'liquid' : 'solid'} heat={melted ? 0.5 : 0.1} color={COLORS.sky} />
      <Thermometer x={1300} y={300} h={380} temp={melted ? 20 : -5} min={-20} max={40} />
      <div style={{ position: 'absolute', left: 620, top: 250, fontSize: 30, fontWeight: 800, color: melted ? COLORS.sky : '#3b82f6' }}>
        {melted ? '🧊 → 💧 geschmolzen' : '❄️ festes Eis'}
      </div>
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Bei 0 °C bricht das Gitter auf – Eis schmilzt zu Wasser.</Caption>
    </AbsoluteFill>
  );
};

// ── Verdampfen / Kondensieren ──────────────────────────────────────────
const VerdampfenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const gas = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übergang bei 100 °C" title="Verdampfen & Kondensieren" />
      <ParticleBox x={620} y={330} w={400} h={400} state={gas ? 'gas' : 'liquid'} heat={gas ? 1 : 0.5} color={gas ? COLORS.amber : COLORS.sky} />
      <Thermometer x={1300} y={280} h={400} temp={gas ? 100 : 60} min={0} max={120} />
      <div style={{ position: 'absolute', left: 620, top: 250, fontSize: 30, fontWeight: 800, color: gas ? COLORS.amber : COLORS.sky }}>
        {gas ? '💧 → 💨 verdampft' : '💧 flüssiges Wasser'}
      </div>
      <Sfx sound="whoosh" at={Math.round(dur * 0.5)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Bei 100 °C reißen sich die Teilchen los – Wasser verdampft zu Gas.</Caption>
    </AbsoluteFill>
  );
};

// ── Übergänge Übersicht ────────────────────────────────────────────────
const UebergaengeScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Namen" title="Vier Übergänge" />
      <div style={{ display: 'flex', gap: 30, alignItems: 'center', opacity: f, fontSize: 34, fontWeight: 800 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 90 }}>🧊</div>fest
        </div>
        <div style={{ textAlign: 'center', color: COLORS.muted, fontSize: 22 }}>
          <div style={{ color: COLORS.red }}>Schmelzen →</div>
          <div style={{ color: COLORS.sky }}>← Erstarren</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 90 }}>💧</div>flüssig
        </div>
        <div style={{ textAlign: 'center', color: COLORS.muted, fontSize: 22 }}>
          <div style={{ color: COLORS.red }}>Verdampfen →</div>
          <div style={{ color: COLORS.sky }}>← Kondensieren</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 90 }}>💨</div>gasförmig
        </div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Schmelzen, Erstarren, Verdampfen, Kondensieren – die Temperatur entscheidet.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Aggregatzustände" footer="0 °C schmelzen/erstarren · 100 °C verdampfen/kondensieren">
      Fest, flüssig, gasförmig –
      <br />
      derselbe Stoff, andere
      <br />
      Teilchenordnung.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 380, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Zustandsänderungen im Alltag" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <TCard icon="🪞💨" title="Spiegel beschlägt (kondensiert)" delay={10} />
        <TCard icon="🌧️☀️" title="Pfütze trocknet (verdunstet)" delay={34} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={60}>Der ganze Wasserkreislauf steckt voller Zustandsänderungen.</Caption>
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
  { id: 'drei', C: DreiScene, min: 240 },
  { id: 'schmelzen', C: SchmelzenScene, min: 240 },
  { id: 'verdampfen', C: VerdampfenScene, min: 240 },
  { id: 'uebergaenge', C: UebergaengeScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const AGGREGATZUSTAENDE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Aggregatzustaende: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={AGGREGATZUSTAENDE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/aggregatzustaende/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
