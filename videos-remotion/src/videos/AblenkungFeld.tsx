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
import timings from '../narration/ablenkung-feld.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Feld zwischen Platten: + oben, − unten. Drei Strahlen von links.
const FieldDiagram: React.FC<{ show: { a?: boolean; b?: boolean; g?: boolean }; reveal?: number }> = ({ show, reveal = 1 }) => {
  const sx = 300;
  const sy = 540;
  const px = 1660;
  // Endpunkte
  const aEnd = `${px},${sy + 150}`; // α positiv → zur − Platte (unten)
  const bEnd = `${px},${sy - 260}`; // β negativ → zur + Platte (oben), stärker
  const gEnd = `${px},${sy}`; // γ neutral → gerade
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {/* Platten */}
      <rect x={560} y={230} width={900} height={16} fill={COLORS.red} />
      <text x={520} y={244} fontSize={40} fontWeight="900" fill={COLORS.red} textAnchor="end">+</text>
      <rect x={560} y={840} width={900} height={16} fill={COLORS.sky} />
      <text x={520} y={858} fontSize={40} fontWeight="900" fill={COLORS.sky} textAnchor="end">−</text>
      {/* Quelle */}
      <text x={sx - 60} y={sy + 20} fontSize={64}>☢️</text>
      {/* γ gerade */}
      {show.g && <><path d={`M ${sx} ${sy} L ${gEnd}`} fill="none" stroke={COLORS.indigo} strokeWidth={5} strokeDasharray={reveal < 1 ? '2000' : '0'} /><text x={px - 40} y={sy - 14} fontSize={26} fontWeight="900" fill={COLORS.indigo}>γ</text></>}
      {/* α leicht nach unten */}
      {show.a && <><path d={`M ${sx} ${sy} Q 900 ${sy + 20} ${aEnd}`} fill="none" stroke={COLORS.amber} strokeWidth={7} /><text x={px - 40} y={sy + 190} fontSize={26} fontWeight="900" fill={COLORS.amber}>α</text></>}
      {/* β stark nach oben */}
      {show.b && <><path d={`M ${sx} ${sy} Q 900 ${sy - 60} ${bEnd}`} fill="none" stroke={COLORS.sky} strokeWidth={5} /><text x={px - 40} y={sy - 270} fontSize={26} fontWeight="900" fill={COLORS.sky}>β</text></>}
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 100 }}>🧲</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie unterscheidet man die drei Strahlungsarten?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Ablenkung im elektrischen Feld
      </div>
    </AbsoluteFill>
  );
};

const AufbauScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Aufbau" title="Alle drei fliegen durch ein Feld" />
      <FieldDiagram show={{ g: true }} />
      <div style={{ position: 'absolute', left: 1180, top: 300, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}` }}>Man schickt die Strahlung zwischen zwei geladene Platten. Eine ist positiv (+), eine negativ (−). Dazwischen wirkt eine Kraft auf geladene Teilchen.</div>
      </div>
      <Caption delay={30}>Man lässt die Strahlung zwischen zwei elektrisch geladenen Platten hindurchfliegen. Auf geladene Teilchen wirkt dort eine Kraft.</Caption>
    </AbsoluteFill>
  );
};

const AblenkungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Sie fliegen in drei Richtungen" />
      <FieldDiagram show={{ a: true, b: true, g: true }} />
      <Sfx sound="pop" at={14} volume={0.3} />
      <div style={{ position: 'absolute', left: 60, top: 900, width: 1800, textAlign: 'center', fontSize: 25, fontWeight: 800, color: COLORS.muted, opacity: f }}>
        <span style={{ color: COLORS.amber }}>α positiv → leicht zur − Platte</span> · <span style={{ color: COLORS.sky }}>β negativ → stark zur + Platte</span> · <span style={{ color: COLORS.indigo }}>γ neutral → geradeaus</span>
      </div>
      <Caption delay={30}>Und die Strahlung teilt sich auf: Alpha wird zur einen Seite abgelenkt, Beta stärker zur anderen, und Gamma fliegt geradeaus weiter.</Caption>
    </AbsoluteFill>
  );
};

const UnterscheidenScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const rows = [
    ['α', 'positiv geladen', 'leicht abgelenkt (schwer)', COLORS.amber],
    ['β', 'negativ geladen', 'stark abgelenkt (leicht)', COLORS.sky],
    ['γ', 'keine Ladung', 'gar nicht abgelenkt', COLORS.indigo],
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Erklärung" title="Ladung und Masse verraten die Art" />
      <div style={{ position: 'absolute', left: 220, top: 320, width: 1480, opacity: f }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
            <div style={{ width: 80, fontSize: 46, fontWeight: 900, color: r[3] as string, textAlign: 'center' }}>{r[0]}</div>
            <div style={{ width: 380, fontSize: 26, fontWeight: 800 }}>{r[1]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.muted }}>→ {r[2]}</div>
          </div>
        ))}
      </div>
      <Caption delay={30}>Das erklärt alles: Positive Alphateilchen und negative Betateilchen werden entgegengesetzt abgelenkt. Beta stärker, weil es viel leichter ist. Gamma hat keine Ladung und fliegt gerade.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Ablenkung im Feld" footer="so trennt man α, β und γ">
      Im Feld wird α (positiv) leicht, β (negativ) stark
      <br />
      in die Gegenrichtung abgelenkt. γ (ungeladen)
      <br />
      fliegt geradeaus.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔬', 'Analyse', 'Strahlungsart bestimmen'],
    ['🧲', 'Magnetfeld', 'lenkt genauso ab'],
    ['📊', 'Forschung', 'Teilchen sortieren'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Strahlung erkennen und trennen" />
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
      <Caption delay={40}>Damit sind die drei Strahlungsarten komplett. Als Nächstes geht es um Zerfall und Zeit.</Caption>
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
  { id: 'aufbau', C: AufbauScene, min: 240 },
  { id: 'ablenkung', C: AblenkungScene, min: 250 },
  { id: 'unterscheiden', C: UnterscheidenScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ABLENKUNG_FELD_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const AblenkungFeld: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ABLENKUNG_FELD_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/ablenkung-feld/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
