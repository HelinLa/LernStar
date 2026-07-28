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
import { useFade } from '../magnet';
import timings from '../narration/strahlenschutz.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120 }}>🛡️☢️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie schütze ich mich am wirksamsten?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die drei Regeln des Strahlenschutzes
      </div>
    </AbsoluteFill>
  );
};

const ZeitScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const dose = interpolate(frame, [20, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Regel 1: Zeit" title="Kurz bleiben – wenig Dosis" />
      <div style={{ position: 'absolute', left: 460, top: 470, fontSize: 150, transform: `rotate(${frame * 3}deg)` }}>🕐</div>
      <div style={{ position: 'absolute', left: 1100, top: 470, width: 460, opacity: f }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.muted, marginBottom: 8 }}>gesammelte Dosis</div>
        <div style={{ width: '100%', height: 44, borderRadius: 12, background: COLORS.panel, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <div style={{ width: `${dose * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.red})` }} />
        </div>
        <div style={{ marginTop: 14, fontSize: 24, fontWeight: 800 }}>Je länger man bleibt, desto mehr Dosis sammelt sich an.</div>
      </div>
      <Caption delay={30}>Erste Regel: die Aufenthaltszeit. Die Dosis summiert sich mit der Zeit. Wer sich nur kurz in der Nähe einer Quelle aufhält, bekommt weniger ab.</Caption>
    </AbsoluteFill>
  );
};

const AbstandScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const cx = 420;
  const cy = 560;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Regel 2: Abstand" title="Doppelter Abstand – ein Viertel" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <text x={cx - 40} y={cy + 20} fontSize={64}>☢️</text>
        {[120, 200, 280, 360, 440].map((r, i) => <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.amber} strokeWidth={2} opacity={0.4} />)}
        {/* Person nah */}
        <text x={cx + 190} y={cy + 30} fontSize={70}>🧍</text>
        <text x={cx + 160} y={cy + 120} fontSize={24} fontWeight="800" fill={COLORS.red}>nah = viel</text>
        {/* Person fern */}
        <text x={cx + 560} y={cy + 30} fontSize={70}>🧍</text>
        <text x={cx + 520} y={cy + 120} fontSize={24} fontWeight="800" fill={COLORS.green}>fern = wenig</text>
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 460, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>Mit dem Abstand verteilt sich die Strahlung auf eine immer größere Fläche. Verdoppelt man den Abstand, sinkt die Belastung sogar auf ein Viertel. Abstand hilft am meisten.</div>
      </div>
      <Caption delay={30}>Zweite Regel: der Abstand. Weiter weg verteilt sich die Strahlung auf eine größere Fläche. Verdoppelt man den Abstand, sinkt die Dosis auf ein Viertel.</Caption>
    </AbsoluteFill>
  );
};

const AbschirmungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Regel 3: Abschirmung" title="Das richtige Material dazwischen" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <text x={320} y={560} fontSize={64}>☢️</text>
        {[520, 560, 600].map((y, i) => <line key={i} x1={400} y1={y} x2={720} y2={y} stroke={COLORS.indigo} strokeWidth={4} strokeDasharray="8 6" />)}
        <rect x={720} y={430} width={110} height={260} fill="#334155" stroke={COLORS.border} strokeWidth={2} />
        <text x={775} y={720} fontSize={24} fontWeight="800" fill={COLORS.muted} textAnchor="middle">Blei / Beton</text>
        <text x={880} y={565} fontSize={40} fill={COLORS.green}>🧍 geschützt</text>
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 460, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.indigo}` }}>Eine passende Abschirmung hält die Strahlung ab: Papier gegen Alpha, Alu gegen Beta, dickes Blei oder Beton gegen Gamma.</div>
      </div>
      <Caption delay={30}>Dritte Regel: die Abschirmung. Das richtige Material zwischen Quelle und Körper hält die Strahlung ab – gegen Gammastrahlung zum Beispiel dickes Blei oder Beton.</Caption>
    </AbsoluteFill>
  );
};

const ZusammenScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const items = [
    ['⏱️', 'Zeit', 'kurz halten'],
    ['📏', 'Abstand', 'groß halten'],
    ['🧱', 'Abschirmung', 'Material dazwischen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Zusammengefasst" title="Zeit – Abstand – Abschirmung" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '34px 18px', borderRadius: 22, background: 'rgba(34,197,94,0.12)', border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 90 }}>{c[0]}</div>
            <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 30, fontSize: 26, fontWeight: 800, color: COLORS.amber, opacity: f }}>Und: strahlende Stoffe niemals einatmen oder verschlucken.</div>
      <Sfx sound="pling" at={12} volume={0.4} />
      <Caption delay={30}>Die drei Regeln zusammen: wenig Zeit, viel Abstand, gute Abschirmung. Und ganz wichtig: strahlende Stoffe niemals in den Körper gelangen lassen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Strahlenschutz" footer="+ strahlende Stoffe nicht in den Körper lassen">
      Wenig Zeit, großer Abstand, gute Abschirmung –
      <br />
      diese drei Regeln senken die Strahlendosis.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🦺', 'Beruf', 'Röntgen, Kraftwerk'],
    ['🚨', 'Notfall', 'Abstand halten, warnen'],
    ['🏠', 'Zuhause', 'Keller gegen Radon lüften'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Schutz im echten Leben" />
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
      <Caption delay={40}>Mit diesen einfachen Regeln lässt sich Strahlung sicher handhaben. Als Nächstes: die gewaltige Energie aus dem Atomkern.</Caption>
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
  { id: 'zeit', C: ZeitScene, min: 240 },
  { id: 'abstand', C: AbstandScene, min: 250 },
  { id: 'abschirmung', C: AbschirmungScene, min: 240 },
  { id: 'zusammen', C: ZusammenScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STRAHLENSCHUTZ_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Strahlenschutz: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STRAHLENSCHUTZ_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/strahlenschutz/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
