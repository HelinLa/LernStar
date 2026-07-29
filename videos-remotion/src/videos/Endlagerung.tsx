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
import timings from '../narration/endlagerung.timings.json';

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
      <div style={{ fontSize: 120 }}>☢️🗑️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wohin mit dem Müll, der noch Tausende Jahre strahlt?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Endlagerung
      </div>
    </AbsoluteFill>
  );
};

const ProblemScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Das Problem" title="Der Abfall strahlt extrem lange" />
      <div style={{ fontSize: 120, opacity: f }}>🛢️☢️</div>
      <div style={{ opacity: f, marginTop: 20, width: 1300 }}>
        <div style={{ padding: '20px 24px', borderRadius: 16, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
          Verbrauchte Brennstäbe enthalten stark radioaktive Stoffe. Manche haben Halbwertszeiten von vielen tausend bis hunderttausend Jahren.
        </div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 24, fontWeight: 800, color: COLORS.muted }}>
          So lange muss der Müll sicher von Mensch und Umwelt getrennt bleiben.
        </div>
      </div>
      <Caption delay={30}>Verbrauchte Brennstäbe sind hochradioaktiv. Manche Stoffe darin strahlen noch Zehntausende bis Hunderttausende Jahre. So lange muss der Müll sicher weggeschlossen werden.</Caption>
    </AbsoluteFill>
  );
};

const EndlagerScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Lösung" title="Tief unter der Erde, in stabilem Gestein" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Oberfläche */}
        <rect x={200} y={330} width={1000} height={70} fill="#3f6212" />
        <text x={250} y={378} fontSize={44}>🌳🏠</text>
        {/* Gesteinsschichten */}
        <rect x={200} y={400} width={1000} height={110} fill="#4b5563" />
        <rect x={200} y={510} width={1000} height={120} fill="#6b7280" />
        {/* stabile Schicht (Salz/Ton) */}
        <rect x={200} y={630} width={1000} height={150} fill="#a16207" />
        <text x={230} y={715} fontSize={22} fontWeight="800" fill="#fde68a">stabile Schicht (Salz / Ton / Granit)</text>
        {/* Schacht */}
        <rect x={680} y={400} width={40} height={230} fill="#1f2937" />
        {/* Behälter im Endlager */}
        {[560, 640, 800, 880].map((x, i) => <rect key={i} x={x} y={690} width={40} height={64} rx={8} fill={COLORS.amber} stroke="#0f172a" strokeWidth={2} />)}
      </svg>
      <div style={{ position: 'absolute', left: 1240, top: 440, width: 620, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>Man sucht ein Endlager tief im Boden, in einer stabilen Gesteinsschicht wie Salz, Ton oder Granit. Sie soll die Strahlung über sehr lange Zeit von der Umwelt abschirmen.</div>
      </div>
      <Caption delay={30}>Die geplante Lösung ist ein Endlager tief unter der Erde, in einer besonders stabilen Gesteinsschicht aus Salz, Ton oder Granit. Sie soll den Müll für sehr lange Zeit einschließen.</Caption>
    </AbsoluteFill>
  );
};

const HerausforderungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Herausforderung" title="Länger als die ganze Menschheitsgeschichte" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30, alignItems: 'center' }}>
        <div style={{ width: 500, padding: '28px 22px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: COLORS.muted }}>Schrift gibt es seit</div>
          <div style={{ fontSize: 46, fontWeight: 900, color: COLORS.sky }}>≈ 5 000 Jahren</div>
        </div>
        <div style={{ fontSize: 50, color: COLORS.amber }}>≪</div>
        <div style={{ width: 500, padding: '28px 22px', borderRadius: 18, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: COLORS.muted }}>sicher lagern für</div>
          <div style={{ fontSize: 46, fontWeight: 900, color: COLORS.red }}>≈ 1 000 000 Jahre</div>
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: 26, fontWeight: 800, color: COLORS.amber, opacity: f, maxWidth: 1300, textAlign: 'center' }}>
        Wie warnt man Menschen in ferner Zukunft, die unsere Sprache längst nicht mehr verstehen?
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Das ist enorm schwierig. Der Müll muss länger sicher bleiben, als es überhaupt Schrift gibt. Wie warnt man Menschen in ferner Zukunft, die unsere Sprache nicht mehr kennen?</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Endlagerung" footer="ungelöste Aufgabe der Kernenergie">
      Hochradioaktiver Müll strahlt sehr lange. Er soll tief
      <br />
      in stabilem Gestein sicher eingeschlossen werden –
      <br />
      für viele tausend Jahre.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔎', 'Standortsuche', 'läuft seit Jahren'],
    ['🛢️', 'Zwischenlager', 'bis dahin oberirdisch'],
    ['🌍', 'Verantwortung', 'für kommende Generationen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Eine Aufgabe für lange Zeit" />
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
      <Caption delay={40}>Bis ein Endlager gefunden ist, bleibt der Müll in Zwischenlagern. Die Verantwortung dafür tragen wir gegenüber vielen künftigen Generationen.</Caption>
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
  { id: 'problem', C: ProblemScene, min: 240 },
  { id: 'endlager', C: EndlagerScene, min: 260 },
  { id: 'herausforderung', C: HerausforderungScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENDLAGERUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Endlagerung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENDLAGERUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/endlagerung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
