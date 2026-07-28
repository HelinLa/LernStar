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
import { BarMagnet, useFade } from '../magnet';
import { Solenoid } from '../induction';
import timings from '../narration/lenzsche-regel.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CY = 520;
const COILX = 820;

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120 }}>🧲🛑</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Warum bremst der Magnet beim Bewegen?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Lenzsche Regel
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [20, 90], [400, 590], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const moving = frame > 20 && frame < 92;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Es fühlt sich an wie gegen einen Widerstand" />
      <Solenoid cx={COILX} cy={CY} w={300} h={150} turns={7} glow={moving ? 0.8 : 0} />
      <BarMagnet cx={push} cy={CY} w={230} h={78} nRight />
      {/* induzierter Pol an der Spulen-Nahseite: N (stößt den ankommenden N ab) */}
      {moving && <div style={{ position: 'absolute', left: COILX - 190, top: CY - 120, fontSize: 30, fontWeight: 900, color: COLORS.red }}>N</div>}
      {moving && <Arrow x1={push + 130} y1={CY} x2={push + 40} y2={CY} color={COLORS.red} width={10} />}
      <div style={{ position: 'absolute', left: 1240, top: 460, width: 520, fontSize: 27, fontWeight: 800, color: moving ? COLORS.red : COLORS.muted }}>
        {moving ? '🛑 die Spule stößt den Magneten zurück' : 'Magnet in Ruhe'}
      </div>
      <Caption delay={30}>Schiebt man den Magneten zur Spule, spürt man einen Widerstand. Der induzierte Strom wirkt zurück.</Caption>
    </AbsoluteFill>
  );
};

const GegenwirkungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Regel" title="Der Strom wirkt seiner Ursache entgegen" />
      <div style={{ display: 'flex', gap: 60, justifyContent: 'center', marginTop: 210, opacity: f }}>
        <div style={{ width: 620, padding: '26px 26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.red}` }}>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>➡️ Magnet nähert sich</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Die Spule bildet an der Nahseite einen gleichen Pol → sie stößt ab und bremst die Annäherung.</div>
        </div>
        <div style={{ width: 620, padding: '26px 26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}` }}>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>⬅️ Magnet entfernt sich</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Die Spule bildet einen ungleichen Pol → sie zieht an und hält den Magneten fest.</div>
        </div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Lenzsche Regel: Der induzierte Strom wirkt immer der Änderung entgegen, die ihn erzeugt hat.</Caption>
    </AbsoluteFill>
  );
};

const EnergieScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Warum das so sein muss" title="Energie kommt nicht aus dem Nichts" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 30 }}>
        <div style={{ width: 380, padding: '28px 20px', borderRadius: 18, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 70 }}>💪</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>Du leistest Arbeit</div>
          <div style={{ fontSize: 22, color: COLORS.muted, marginTop: 4 }}>gegen den Widerstand</div>
        </div>
        <div style={{ fontSize: 60 }}>➡️</div>
        <div style={{ width: 380, padding: '28px 20px', borderRadius: 18, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 70 }}>⚡</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>elektrische Energie</div>
          <div style={{ fontSize: 22, color: COLORS.muted, marginTop: 4 }}>im Stromkreis</div>
        </div>
      </div>
      <Caption delay={30}>Der Widerstand ist die Energieerhaltung: Deine Arbeit wird in elektrische Energie umgewandelt – nichts entsteht umsonst.</Caption>
    </AbsoluteFill>
  );
};

const KupferrohrScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const magY = interpolate(frame, [10, 160], [280, 760], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ballY = interpolate(frame, [10, 55], [280, 780], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Verblüffend" title="Im Kupferrohr fällt der Magnet langsam" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Kupferrohr */}
        <rect x={620} y={250} width={16} height={560} fill="#b45309" />
        <rect x={760} y={250} width={16} height={560} fill="#b45309" />
        <text x={540} y={240} fontSize={24} fontWeight="800" fill="#f59e0b">Kupferrohr</text>
        {/* Magnet im Rohr */}
        <rect x={636} y={magY - 30} width={124} height={30} fill={COLORS.red} />
        <rect x={636} y={magY} width={124} height={30} fill={COLORS.sky} />
        {/* Wirbelstrom-Ringe */}
        <ellipse cx={698} cy={magY} rx={90} ry={20} fill="none" stroke={COLORS.amber} strokeWidth={3} opacity={0.7} />
        <ellipse cx={698} cy={magY - 50} rx={80} ry={16} fill="none" stroke={COLORS.amber} strokeWidth={2.5} opacity={0.5} />
        {/* Vergleich: normaler Körper fällt frei daneben */}
        <circle cx={1050} cy={ballY} r={30} fill={COLORS.muted} />
        <text x={1000} y={240} fontSize={24} fontWeight="800" fill={COLORS.muted}>freier Fall</text>
      </svg>
      <div style={{ position: 'absolute', left: 1240, top: 470, width: 520, fontSize: 26, fontWeight: 800, color: COLORS.amber }}>
        🌀 Wirbelströme im Kupfer bremsen den Magneten – wie eine berührungslose Bremse.
      </div>
      <Caption delay={30}>Beim Fallen ändert sich das Feld ständig. Die induzierten Wirbelströme wirken entgegen und bremsen den Magneten stark ab.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Lenzsche Regel" footer="eine Folge der Energieerhaltung">
      Der induzierte Strom wirkt immer der Änderung
      <br />
      entgegen, die ihn erzeugt hat.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🚃', 'Wirbelstrombremse', 'berührungslos bremsen'],
    ['🍳', 'Induktionsherd', 'Wirbelströme heizen'],
    ['🔋', 'Rekuperation', 'Bremsen lädt den Akku'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wo die Gegenwirkung nützt" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Die Lenzsche Regel steckt in Bremsen, Kochfeldern und der Energie-Rückgewinnung im E-Auto.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'gegenwirkung', C: GegenwirkungScene, min: 250 },
  { id: 'energie', C: EnergieScene, min: 240 },
  { id: 'kupferrohr', C: KupferrohrScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LENZSCHE_REGEL_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const LenzscheRegel: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LENZSCHE_REGEL_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/lenzsche-regel/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
