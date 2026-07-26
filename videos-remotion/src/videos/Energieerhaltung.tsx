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
import { useFade } from '../forces';
import timings from '../narration/energieerhaltung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Pendel-Geometrie
const PIVOT = { x: 960, y: 210 };
const LEN = 520;
const AMP = 0.72; // Amplitude in rad (~41°)
const COS_AMP = Math.cos(AMP);

// Position der Kugel bei Winkel theta (0 = ganz unten)
const bobPos = (theta: number) => ({
  x: PIVOT.x + LEN * Math.sin(theta),
  y: PIVOT.y + LEN * Math.cos(theta),
});
// Anteil Lageenergie (0..1) bei Winkel theta
const potFrac = (theta: number) => {
  const p = (1 - Math.cos(theta)) / (1 - COS_AMP);
  return Math.max(0, Math.min(1, p));
};

const Pendulum: React.FC<{ theta: number; showString?: boolean; ghost?: boolean }> = ({
  theta,
  showString = true,
  ghost = false,
}) => {
  const b = bobPos(theta);
  return (
    <>
      {showString && (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <line x1={PIVOT.x} y1={PIVOT.y} x2={b.x} y2={b.y} stroke={COLORS.muted} strokeWidth={5} />
          <circle cx={PIVOT.x} cy={PIVOT.y} r={12} fill={COLORS.border} stroke={COLORS.muted} strokeWidth={3} />
        </svg>
      )}
      <div
        style={{
          position: 'absolute',
          left: b.x - 46,
          top: b.y - 46,
          width: 92,
          height: 92,
          borderRadius: '50%',
          background: ghost
            ? 'rgba(129,140,248,0.28)'
            : `radial-gradient(circle at 35% 30%, ${COLORS.indigo}, ${COLORS.indigoDeep})`,
          border: `4px solid ${ghost ? 'rgba(129,140,248,0.5)' : COLORS.ink}`,
          boxShadow: ghost ? 'none' : '0 8px 26px rgba(0,0,0,0.4)',
        }}
      />
    </>
  );
};

// Zwei Energiebalken (Lage blau, Bewegung amber) + Summenbalken (grün)
const EnergyBars: React.FC<{ pot: number; x?: number; y?: number; compact?: boolean }> = ({
  pot,
  x = 1420,
  y = 360,
  compact = false,
}) => {
  const kin = 1 - pot;
  const H = compact ? 220 : 300;
  const W = compact ? 66 : 84;
  const gap = compact ? 30 : 46;
  const Bar: React.FC<{ frac: number; color: string; label: string; i: number }> = ({ frac, color, label, i }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W }}>
      <div style={{ position: 'relative', width: W, height: H, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `2px solid ${COLORS.border}`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${frac * 100}%`, background: color, transition: 'none' }} />
      </div>
      <div style={{ marginTop: 12, fontSize: compact ? 22 : 26, fontWeight: 800, color, textAlign: 'center', lineHeight: 1.15 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: x, top: y, display: 'flex', gap }}>
      <Bar frac={pot} color={COLORS.sky} label="Lage" i={0} />
      <Bar frac={kin} color={COLORS.amber} label="Bewegung" i={1} />
      <Bar frac={1} color={COLORS.green} label="Summe" i={2} />
    </div>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const theta = AMP * Math.cos((2 * Math.PI * frame) / 90);
  return (
    <AbsoluteFill>
      <Pendulum theta={theta} />
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90 }}>
        <StarLogo size={72} />
        <div style={{ marginTop: 20, fontSize: 72, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
          Verschwindet Energie einfach?
        </div>
        <div style={{ marginTop: 14, fontSize: 38, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
          Das Pendel: Lageenergie ↔ Bewegungsenergie
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const theta = AMP * Math.cos((2 * Math.PI * frame) / 90);
  const atTop = Math.abs(Math.cos((2 * Math.PI * frame) / 90)) > 0.86;
  const atBottom = Math.abs(Math.sin((2 * Math.PI * frame) / 90)) > 0.86;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Oben langsam, unten schnell" />
      <Pendulum theta={theta} />
      {/* Markierungen */}
      <div style={{ position: 'absolute', left: PIVOT.x - 540, top: PIVOT.y + 470, fontSize: 30, fontWeight: 800, color: atTop ? COLORS.sky : COLORS.muted, opacity: f }}>⟳ Umkehrpunkt: fast still</div>
      <div style={{ position: 'absolute', left: PIVOT.x - 110, top: PIVOT.y + LEN + 40, width: 220, textAlign: 'center', fontSize: 30, fontWeight: 800, color: atBottom ? COLORS.amber : COLORS.muted, opacity: f }}>am schnellsten</div>
      <Caption delay={30}>Oben steht es kurz fast still, unten saust es durch.</Caption>
    </AbsoluteFill>
  );
};

const UmwandlungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const theta = AMP * Math.cos((2 * Math.PI * frame) / 108);
  const pot = potFrac(theta);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Umwandlung" title="Höhe wird zu Tempo" />
      <Pendulum theta={theta} />
      <div style={{ opacity: f }}>
        <EnergyBars pot={pot} />
      </div>
      <div style={{ position: 'absolute', left: 1400, top: 720, width: 380, fontSize: 26, fontWeight: 700, color: COLORS.muted, opacity: f }}>
        Die Balken tauschen sich ständig – die grüne Summe bleibt gleich.
      </div>
      <Caption delay={30}>Beim Herabschwingen wird Lageenergie zu Bewegungsenergie.</Caption>
    </AbsoluteFill>
  );
};

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

const EnergyMini: React.FC<{ frac: number; color: string; label: string }> = ({ frac, color, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ position: 'relative', width: 60, height: 200, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: `2px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${frac * 100}%`, background: color }} />
    </div>
    <div style={{ marginTop: 10, fontSize: 22, fontWeight: 800, color }}>{label}</div>
  </div>
);

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

// Gestapelter Balken: Lage (unten, blau) + Bewegung (oben, amber), Gesamthöhe konstant
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
  { id: 'intro', C: Intro, min: 150 },
  { id: 'beobachten', C: BeobachtenScene, min: 240 },
  { id: 'umwandlung', C: UmwandlungScene, min: 260 },
  { id: 'punkte', C: PunkteScene, min: 240 },
  { id: 'erhaltung', C: ErhaltungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 200 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENERGIEERHALTUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Energieerhaltung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENERGIEERHALTUNG_DURATION} />
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
