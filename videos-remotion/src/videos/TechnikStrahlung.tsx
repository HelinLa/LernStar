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
import timings from '../narration/technik-strahlung.timings.json';

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
      <div style={{ fontSize: 120 }}>🏭☢️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wo nutzt die Technik radioaktive Strahlung?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Prüfen, messen, warnen
      </div>
    </AbsoluteFill>
  );
};

const MaterialScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Materialprüfung" title="In Metall hineinschauen" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <text x={340} y={420} fontSize={30} fontWeight="800" fill={COLORS.indigo} textAnchor="middle">γ-Quelle</text>
        <text x={340} y={470} fontSize={54}>☢️</text>
        {[520, 560, 600].map((y, i) => <line key={i} x1={400} y1={y} x2={720} y2={y} stroke={COLORS.indigo} strokeWidth={3} strokeDasharray="8 6" />)}
        {/* Werkstück mit Schweißnaht + Riss */}
        <rect x={720} y={480} width={200} height={150} rx={8} fill="#475569" />
        <line x1={820} y1={480} x2={820} y2={630} stroke="#0f172a" strokeWidth={4} />
        <line x1={815} y1={520} x2={825} y2={580} stroke={COLORS.red} strokeWidth={4} />
        {/* Detektor/Film */}
        <rect x={960} y={470} width={26} height={180} rx={6} fill="#0b1220" stroke={COLORS.border} strokeWidth={2} />
        <rect x={962} y={545} width={22} height={30} fill={COLORS.red} opacity={0.8} />
        <text x={973} y={690} fontSize={22} fill={COLORS.muted} textAnchor="middle">Film</text>
      </svg>
      <div style={{ position: 'absolute', left: 1120, top: 460, width: 700, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.indigo}` }}>Gammastrahlung durchdringt das Metall. An einem Riss oder Lufteinschluss kommt mehr Strahlung durch – auf dem Film wird der Fehler sichtbar. So prüft man Schweißnähte, ohne etwas zu zerstören.</div>
      </div>
      <Caption delay={30}>Gammastrahlung durchleuchtet Metall wie eine Röntgenaufnahme. An einem versteckten Riss kommt mehr Strahlung durch – so findet man Fehler in Schweißnähten.</Caption>
    </AbsoluteFill>
  );
};

const DickeScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const shift = (frame * 4) % 80;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Dickenmessung" title="Folien auf genaue Dicke regeln" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <text x={640} y={430} fontSize={44}>☢️</text>
        <text x={700} y={420} fontSize={24} fontWeight="800" fill={COLORS.sky}>β-Quelle</text>
        {[600, 640, 680].map((x, i) => <line key={i} x1={x} y1={480} x2={x} y2={560} stroke={COLORS.sky} strokeWidth={3} strokeDasharray="7 6" />)}
        {/* laufende Folie */}
        <rect x={300} y={560} width={760} height={30} fill="#94a3b8" />
        {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={300 + ((i * 80 + shift) % 760)} y1={560} x2={300 + ((i * 80 + shift) % 760)} y2={590} stroke="#64748b" strokeWidth={2} />)}
        <text x={340} y={545} fontSize={22} fill={COLORS.muted}>Folie →</text>
        {/* Detektor unten */}
        <rect x={610} y={610} width={120} height={40} rx={8} fill="#0b1220" stroke={COLORS.border} strokeWidth={2} />
        <text x={670} y={700} fontSize={22} fill={COLORS.muted} textAnchor="middle">Detektor</text>
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 460, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}` }}>Je dicker die Folie, desto weniger Betastrahlung kommt unten an. Aus dem Messwert regelt die Maschine automatisch die Dicke nach – ohne die Folie zu berühren.</div>
      </div>
      <Caption delay={30}>Bei der Herstellung von Folien misst Betastrahlung berührungslos die Dicke: Je dicker das Material, desto weniger Strahlung kommt durch. Die Maschine regelt sofort nach.</Caption>
    </AbsoluteFill>
  );
};

const RauchmelderScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const smoke = frame > 90;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Rauchmelder" title="Alphastrahlung bemerkt den Rauch" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <rect x={420} y={430} width={420} height={240} rx={16} fill={COLORS.panelSolid} stroke={COLORS.border} strokeWidth={3} />
        <text x={470} y={470} fontSize={30}>☢️</text>
        <text x={520} y={465} fontSize={20} fontWeight="800" fill={COLORS.amber}>α</text>
        {/* Ionen / Strom */}
        {!smoke && Array.from({ length: 6 }).map((_, i) => {
          const p = ((frame * 4 + i * 60) % 320);
          return <circle key={i} cx={490 + p} cy={560} r={7} fill={COLORS.sky} />;
        })}
        {smoke && Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={520 + i * 34} cy={540 + (i % 3) * 20} r={16} fill="rgba(148,163,184,0.5)" />)}
        <text x={630} y={640} fontSize={22} fontWeight="800" fill={smoke ? COLORS.red : COLORS.green} textAnchor="middle">{smoke ? 'Strom sinkt → Alarm' : 'Strom fließt (kein Alarm)'}</text>
      </svg>
      {smoke && <div style={{ position: 'absolute', left: 900, top: 440, fontSize: 90 }}>🔔</div>}
      <div style={{ position: 'absolute', left: 1120, top: 460, width: 700, fontSize: 24, fontWeight: 800 }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${smoke ? COLORS.red : COLORS.amber}` }}>Im Melder ionisiert eine winzige Alphaquelle die Luft, es fließt ein kleiner Strom. Dringt Rauch ein, bremst er die Ionen – der Strom sinkt und der Alarm geht los.</div>
      </div>
      <Sfx sound="impact" at={90} volume={0.35} />
      <Caption delay={30}>Ältere Rauchmelder nutzen eine winzige Alphaquelle. Sie hält einen kleinen Strom aufrecht. Kommt Rauch dazwischen, sinkt der Strom – und der Alarm ertönt.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Strahlung in der Technik" footer="jede Strahlungsart für ihre Aufgabe">
      Gammastrahlung prüft Material, Betastrahlung misst
      <br />
      Dicken, Alphastrahlung steckt im Rauchmelder –
      <br />
      je nach Reichweite die passende Strahlung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🍓', 'Lebensmittel', 'länger haltbar machen'],
    ['🌱', 'Landwirtschaft', 'Pflanzen erforschen'],
    ['🛢️', 'Füllstand', 'in Tanks messen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Noch mehr Anwendungen" />
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
      <Caption delay={40}>Überall wird die Strahlung genau dosiert und sicher abgeschirmt eingesetzt.</Caption>
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
  { id: 'material', C: MaterialScene, min: 250 },
  { id: 'dicke', C: DickeScene, min: 250 },
  { id: 'rauchmelder', C: RauchmelderScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TECHNIK_STRAHLUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const TechnikStrahlung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TECHNIK_STRAHLUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/technik-strahlung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
