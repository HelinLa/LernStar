import React from 'react';
import {
  AbsoluteFill,
  Series,
  Audio,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo, BackgroundMusic, Sfx } from '../components';
import { useFade } from '../forces';
import timings from '../narration/energieerhaltung.timings.json';

// COMPOSITE-Version von 9.3.7 Energieerhaltung:
// Die Pendel-Szenen zeigen den Motion-Canvas-Clip (weiche, echte Pendelphysik +
// live Energiebalken) als OffthreadVideo; Remotion legt Titel/Untertitel/Anna-Stimme/
// SFX/Intro/Outro darüber. Narration + Timing identisch zur bestehenden Fassung.
// Nicht-Pendel-Szenen (Vergleich/Regel/Merksatz/Transfer/Outro) unverändert übernommen.

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const AMP = 0.72;
const COS_AMP = Math.cos(AMP);
const potFrac = (theta: number) => Math.max(0, Math.min(1, (1 - Math.cos(theta)) / (1 - COS_AMP)));

const CLIP = staticFile('mc/energieerhaltung-pendel.mp4');

// Frame-Offsets, damit das Pendel über die 3 Szenen KONTINUIERLICH schwingt
const D_INTRO = durOf('intro', 150);
const D_BEOB = durOf('beobachten', 240);
const OFF_INTRO = 0;
const OFF_BEOB = D_INTRO;
const OFF_UMW = D_INTRO + D_BEOB;

const ClipLayer: React.FC<{ from: number }> = ({ from }) => (
  <OffthreadVideo src={CLIP} startFrom={from} muted style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
);

// ---------- Pendel-Szenen: Motion-Canvas-Clip + Text-Overlay ----------
const IntroMC: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill>
      <ClipLayer from={OFF_INTRO} />
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 64 }}>
        <StarLogo size={60} />
        <div style={{ marginTop: 14, fontSize: 64, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center', textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}>
          Verschwindet Energie einfach?
        </div>
        <div style={{ marginTop: 12, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub, textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
          Das Pendel: Lageenergie ↔ Bewegungsenergie
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BeobachtenMC: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer from={OFF_BEOB} />
    <SceneTitle kicker="Beobachten" title="Oben langsam, unten schnell" />
    <Caption delay={30}>Oben steht es kurz fast still, unten saust es durch.</Caption>
  </AbsoluteFill>
);

const UmwandlungMC: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <ClipLayer from={OFF_UMW} />
    <SceneTitle kicker="Umwandlung" title="Höhe wird zu Tempo" />
    <Caption delay={30}>Beim Herabschwingen wird Lageenergie zu Bewegungsenergie.</Caption>
  </AbsoluteFill>
);

// ---------- Nicht-Pendel-Szenen (übernommen, unverändert) ----------
const EnergyMini: React.FC<{ frac: number; color: string; label: string }> = ({ frac, color, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ position: 'relative', width: 60, height: 200, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: `2px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${frac * 100}%`, background: color }} />
    </div>
    <div style={{ marginTop: 10, fontSize: 22, fontWeight: 800, color }}>{label}</div>
  </div>
);

const PunkteScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const cases = [
    { theta: -AMP, label: 'Links oben', sub: 'viel Lageenergie' },
    { theta: 0.001, label: 'Unten', sub: 'viel Bewegungsenergie' },
    { theta: AMP, label: 'Rechts oben', sub: 'viel Lageenergie' },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleichen" title="Drei Stellen im Vergleich" />
      <div style={{ position: 'absolute', top: 300, width: 1920, display: 'flex', justifyContent: 'center', gap: 70, opacity: f }}>
        {cases.map((c, i) => {
          const pot = potFrac(c.theta);
          return (
            <div key={i} style={{ width: 500, padding: '26px 20px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 900 }}>{c.label}</div>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 34 }}>
                <EnergyMini frac={pot} color={COLORS.sky} label="Lage" />
                <EnergyMini frac={1 - pot} color={COLORS.amber} label="Bewegung" />
              </div>
              <div style={{ marginTop: 18, fontSize: 25, fontWeight: 700, color: COLORS.muted }}>{c.sub}</div>
            </div>
          );
        })}
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Wird die eine Form groß, wird die andere klein.</Caption>
    </AbsoluteFill>
  );
};

const StackBar: React.FC<{ pot: number }> = ({ pot }) => {
  const H = 300;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 120, height: H, borderRadius: 14, overflow: 'hidden', border: `2px solid ${COLORS.ink}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: `${(1 - pot) * 100}%`, background: COLORS.amber }} />
        <div style={{ width: '100%', height: `${pot * 100}%`, background: COLORS.sky }} />
      </div>
      <div style={{ marginTop: 12, fontSize: 24, fontWeight: 800, color: COLORS.muted }}>
        <span style={{ color: COLORS.amber }}>Bewegung</span> + <span style={{ color: COLORS.sky }}>Lage</span>
      </div>
    </div>
  );
};

const ErhaltungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(14);
  const theta = AMP * Math.cos((2 * Math.PI * frame) / 108);
  const pot = potFrac(theta);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Regel" title="Die Summe bleibt gleich" />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 26, opacity: f, marginTop: 30 }}>
        <StackBar pot={pot} />
        <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.muted, marginBottom: 120 }}>=</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 120, height: 300, borderRadius: 14, background: COLORS.green, border: `2px solid ${COLORS.ink}` }} />
          <div style={{ marginTop: 12, fontSize: 28, fontWeight: 900, color: COLORS.green }}>immer gleich</div>
        </div>
      </div>
      <div style={{ marginTop: 26, fontSize: 34, fontWeight: 800, color: COLORS.ink, opacity: f }}>
        Lageenergie + Bewegungsenergie = konstant
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Ohne Reibung geht keine Energie verloren – Energieerhaltung.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Energieerhaltung" footer="Lageenergie + Bewegungsenergie = konstant">
      Energie geht nie verloren.
      <br />
      Sie wandelt sich nur um –
      <br />
      beim Pendel: Lage ↔ Bewegung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🛝', 'Schaukel'],
    ['🤸', 'Trampolin'],
    ['🏀', 'Flummi'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Überall Höhe ↔ Tempo" />
      <div style={{ display: 'flex', gap: 44, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 360, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 92 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Höhe wird zu Tempo – und wieder zurück.</Caption>
    </AbsoluteFill>
  );
};

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
  { id: 'intro', C: IntroMC, min: 150 },
  { id: 'beobachten', C: BeobachtenMC, min: 240 },
  { id: 'umwandlung', C: UmwandlungMC, min: 260 },
  { id: 'punkte', C: PunkteScene, min: 240 },
  { id: 'erhaltung', C: ErhaltungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 200 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENERGIEERHALTUNG_MC_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const EnergieerhaltungMC: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENERGIEERHALTUNG_MC_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/energieerhaltung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
