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
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo, BackgroundMusic, Sfx, Arrow } from '../components';
import { useFade } from '../magnet';
import timings from '../narration/drei-finger-regel.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Drei zueinander senkrechte Pfeile (rechte Hand): Daumen=Strom, Zeigefinger=Feld, Mittelfinger=Kraft.
const HandRule: React.FC<{ ox: number; oy: number; flip?: boolean; show?: number }> = ({ ox, oy, flip = false, show = 1 }) => {
  const s = flip ? -1 : 1;
  const a1 = interpolate(show, [0, 0.33], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a2 = interpolate(show, [0.33, 0.66], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a3 = interpolate(show, [0.66, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <>
      {/* Daumen = Strom I (amber, rechts) */}
      <Arrow x1={ox} y1={oy} x2={ox + s * 190} y2={oy} color={COLORS.amber} width={11} opacity={a1} />
      {/* Zeigefinger = Feld B (sky, hoch) */}
      <Arrow x1={ox} y1={oy} x2={ox} y2={oy - 190} color={COLORS.sky} width={11} opacity={a2} />
      {/* Mittelfinger = Kraft F (green, schräg nach vorn/unten-links = aus der Ebene) */}
      <Arrow x1={ox} y1={oy} x2={ox - s * 130} y2={oy + 130} color={COLORS.green} width={11} opacity={a3} />
      <div style={{ position: 'absolute', left: ox + s * 120 - 40, top: oy + 20, fontSize: 24, fontWeight: 900, color: COLORS.amber, opacity: a1 }}>Daumen · Strom I</div>
      <div style={{ position: 'absolute', left: ox - 60, top: oy - 240, fontSize: 24, fontWeight: 900, color: COLORS.sky, opacity: a2 }}>Zeigefinger · Feld B</div>
      <div style={{ position: 'absolute', left: ox - s * 130 - 150, top: oy + 140, fontSize: 24, fontWeight: 900, color: COLORS.green, opacity: a3 }}>Mittelfinger · Kraft F</div>
    </>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 140 }}>🖐️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wohin zeigt die Kraft?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Drei-Finger-Regel der rechten Hand
      </div>
    </AbsoluteFill>
  );
};

const RegelScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const show = interpolate(frame, [15, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Regel" title="Drei Finger – drei Richtungen" />
      <HandRule ox={720} oy={560} show={show} />
      <div style={{ position: 'absolute', left: 1240, top: 470, width: 520, fontSize: 26, fontWeight: 800 }}>
        <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, marginBottom: 10 }}>Daumen → Strom</div>
        <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, marginBottom: 10 }}>Zeigefinger → Magnetfeld</div>
        <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}` }}>Mittelfinger → Kraft</div>
      </div>
      <Caption delay={30}>Spreize die drei Finger der rechten Hand rechtwinklig ab. Jeder Finger steht für eine Richtung.</Caption>
    </AbsoluteFill>
  );
};

const UvwScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const rows = [
    ['U', 'Ursache', 'Strom', COLORS.amber],
    ['V', 'Vermittlung', 'Magnetfeld', COLORS.sky],
    ['W', 'Wirkung', 'Kraft', COLORS.green],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Merkhilfe" title="U – V – W" />
      <div style={{ opacity: f, marginTop: 20 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, marginBottom: 20 }}>
            <div style={{ width: 90, height: 90, borderRadius: 18, background: r[3] as string, color: '#0f172a', fontSize: 48, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r[0]}</div>
            <div style={{ fontSize: 40, fontWeight: 800, width: 340 }}>{r[1]}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.muted }}>= {r[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Merke die Reihenfolge U-V-W: Ursache ist der Strom, Vermittlung das Feld, Wirkung die Kraft.</Caption>
    </AbsoluteFill>
  );
};

const AnwendenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const cx = 640;
  const cy = 540;
  const solved = frame > 70;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Anwenden" title="Erst Strom und Feld – dann die Kraft ablesen" />
      {/* Feld nach oben (B), Strom nach rechts (I) → Kraft nach vorn (aus der Ebene) */}
      <Arrow x1={cx} y1={cy} x2={cx + 200} y2={cy} color={COLORS.amber} width={11} opacity={f} />
      <Arrow x1={cx} y1={cy} x2={cx} y2={cy - 200} color={COLORS.sky} width={11} opacity={f} />
      {solved && <Arrow x1={cx} y1={cy} x2={cx - 130} y2={cy + 130} color={COLORS.green} width={11} />}
      <div style={{ position: 'absolute', left: cx + 210, top: cy - 16, fontSize: 26, fontWeight: 900, color: COLORS.amber, opacity: f }}>Strom I →</div>
      <div style={{ position: 'absolute', left: cx - 30, top: cy - 250, fontSize: 26, fontWeight: 900, color: COLORS.sky, opacity: f }}>Feld B ↑</div>
      {solved && <div style={{ position: 'absolute', left: cx - 300, top: cy + 140, fontSize: 26, fontWeight: 900, color: COLORS.green }}>Kraft F</div>}
      <div style={{ position: 'absolute', left: 1180, top: 470, width: 600, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 25, fontWeight: 800 }}>
          Daumen entlang des Stroms, Zeigefinger entlang des Feldes – der Mittelfinger zeigt dann die Kraft.
        </div>
      </div>
      <Sfx sound="pling" at={70} volume={0.4} />
      <Caption delay={30}>Man richtet Daumen und Zeigefinger nach Strom und Feld aus – der Mittelfinger verrät die Kraftrichtung.</Caption>
    </AbsoluteFill>
  );
};

const UmkehrenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const flip = frame > 85;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gegencheck" title="Strom umkehren – Kraft kippt mit" />
      <HandRule ox={720} oy={560} flip={flip} show={1} />
      <div style={{ position: 'absolute', left: 1240, top: 490, width: 520, fontSize: 27, fontWeight: 800, color: flip ? COLORS.red : COLORS.green, opacity: f }}>
        {flip ? '↩️ Strom andersherum → Kraft zeigt in die Gegenrichtung' : '➡️ Strom in eine Richtung'}
      </div>
      <Sfx sound="pop" at={85} volume={0.34} />
      <Caption delay={30}>Kehrt sich der Strom um, dreht sich auch der Daumen – und der Mittelfinger zeigt in die Gegenrichtung.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Drei-Finger-Regel (rechte Hand)" footer="Strom & Feld einstellen → Kraft ablesen">
      Daumen = Strom, Zeigefinger = Feld,
      <br />
      Mittelfinger = Kraft. U – V – W.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['⚙️', 'Motor', 'Drehrichtung bestimmen'],
    ['🔊', 'Lautsprecher', 'Membranrichtung'],
    ['🧲', 'Leiterschaukel', 'wohin sie schwingt'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wozu man die Regel braucht" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Mit der Drei-Finger-Regel sagst du die Kraftrichtung in jedem Motor voraus.</Caption>
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
  { id: 'regel', C: RegelScene, min: 260 },
  { id: 'uvw', C: UvwScene, min: 230 },
  { id: 'anwenden', C: AnwendenScene, min: 250 },
  { id: 'umkehren', C: UmkehrenScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const DREI_FINGER_REGEL_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const DreiFingerRegel: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={DREI_FINGER_REGEL_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/drei-finger-regel/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
