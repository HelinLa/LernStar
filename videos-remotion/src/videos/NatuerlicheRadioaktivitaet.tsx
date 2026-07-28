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
import timings from '../narration/natuerliche-radioaktivitaet.timings.json';

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
      <div style={{ fontSize: 120 }}>☢️❓</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Woher kommt eine Strahlung, die niemand sieht?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die natürliche Radioaktivität
      </div>
    </AbsoluteFill>
  );
};

const BecquerelScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const spot = interpolate(frame, [40, 130], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Entdeckung 1896" title="Uran schwärzt eine Fotoplatte im Dunkeln" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* dunkle Schublade */}
        <rect x={360} y={400} width={620} height={300} rx={14} fill="#0b1220" stroke={COLORS.border} strokeWidth={3} />
        <text x={670} y={370} fontSize={24} fontWeight="800" fill={COLORS.muted} textAnchor="middle">geschlossene, dunkle Schublade</text>
        {/* eingewickelte Fotoplatte */}
        <rect x={430} y={560} width={480} height={90} rx={8} fill="#1e293b" stroke={COLORS.muted} strokeWidth={2} />
        {/* geschwärzter Fleck */}
        <ellipse cx={670} cy={605} rx={110} ry={30} fill={`rgba(15,23,42,${spot})`} />
        <ellipse cx={670} cy={605} rx={110} ry={30} fill="none" stroke={`rgba(0,0,0,${spot})`} strokeWidth={spot * 20} />
        {/* Uransalz oben */}
        <rect x={600} y={470} width={140} height={50} rx={8} fill="#4d7c0f" />
        <text x={670} y={503} fontSize={22} fontWeight="800" fill="#d9f99d" textAnchor="middle">Uransalz</text>
        {/* unsichtbare Strahlung nach unten */}
        {[620, 670, 720].map((x, i) => (
          <line key={i} x1={x} y1={520} x2={x} y2={565} stroke={COLORS.green} strokeWidth={3} strokeDasharray="6 6" opacity={0.5 + Math.sin((frame + i * 8) / 6) * 0.3} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 1060, top: 440, width: 720, fontSize: 24, fontWeight: 800 }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, marginBottom: 12 }}>Henri Becquerel legte Uransalz auf eine lichtdicht verpackte Fotoplatte.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}` }}>Ohne jedes Licht wurde die Platte schwarz. Das Uran sendet also von selbst eine Strahlung aus.</div>
      </div>
      <Caption delay={30}>1896 entdeckte Henri Becquerel: Uransalz schwärzt eine eingewickelte Fotoplatte – ganz ohne Licht. Das Material strahlt von selbst.</Caption>
    </AbsoluteFill>
  );
};

const UnsichtbarScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const senses = ['👁️', '👃', '👅', '✋'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Das Tückische" title="Man kann sie mit keinem Sinn wahrnehmen" />
      <div style={{ display: 'flex', gap: 50, opacity: f, marginTop: 30 }}>
        {senses.map((s, i) => (
          <div key={i} style={{ position: 'relative', width: 180, height: 180, borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 84, filter: 'grayscale(1)', opacity: 0.6 }}>{s}</div>
            <div style={{ position: 'absolute', fontSize: 90, color: COLORS.red }}>🚫</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 34, fontSize: 30, fontWeight: 900, color: COLORS.amber, opacity: f }}>Nur Messgeräte machen sie sichtbar.</div>
      <Caption delay={30}>Radioaktive Strahlung kann man weder sehen noch riechen, schmecken oder fühlen. Nur mit Messgeräten lässt sie sich nachweisen.</Caption>
    </AbsoluteFill>
  );
};

const NatuerlichScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const items = [
    ['🪨', 'Gestein & Boden', 'Uran, Radon-Gas'],
    ['☀️', 'Höhenstrahlung', 'aus dem Weltall'],
    ['🍌', 'Nahrung', 'z. B. Kalium-40'],
    ['🧍', 'Eigener Körper', 'strahlt selbst schwach'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Überall um uns" title="Natürliche Strahlungsquellen" />
      <div style={{ display: 'flex', gap: 30, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 350, padding: '28px 16px', borderRadius: 20, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Diese Strahlung ist ganz natürlich: Sie kommt aus Gestein und Boden, aus dem Weltall, aus unserer Nahrung – und sogar aus unserem eigenen Körper.</Caption>
    </AbsoluteFill>
  );
};

const ImmerDaScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Nicht neu" title="Radioaktivität gab es schon immer" />
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', opacity: f, marginTop: 40, fontSize: 24, fontWeight: 800 }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 70 }}>🌍</div>Erde entsteht</div>
        <div style={{ color: COLORS.muted }}>→</div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 70 }}>🦕</div>Leben</div>
        <div style={{ color: COLORS.muted }}>→</div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 70 }}>🧍</div>Mensch</div>
        <div style={{ color: COLORS.muted }}>→</div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 70 }}>📟</div>1896 entdeckt</div>
      </div>
      <div style={{ marginTop: 34, fontSize: 27, fontWeight: 800, color: COLORS.muted, opacity: f, maxWidth: 1200, textAlign: 'center' }}>
        Die Strahlung war schon lange vor dem Menschen da. Erst 1896 haben wir sie bemerkt – der Mensch hat sie nicht erfunden.
      </div>
      <Caption delay={30}>Wichtig: Der Mensch hat die Radioaktivität nicht erfunden. Sie ist so alt wie die Erde – wir haben sie nur erst 1896 entdeckt.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Natürliche Radioaktivität" footer="unsichtbar – nur mit Messgeräten nachweisbar">
      Manche Stoffe senden von selbst eine unsichtbare
      <br />
      Strahlung aus. Diese natürliche Radioaktivität
      <br />
      ist überall und war schon immer da.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['⛰️', 'Bergregionen', 'mehr Höhenstrahlung'],
    ['🏠', 'Keller', 'Radon kann sich sammeln'],
    ['✈️', 'Flug', 'kurz höhere Strahlung'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wo es mehr oder weniger ist" />
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
      <Caption delay={40}>Die natürliche Strahlung ist meist harmlos gering. Was diese Strahlung genau macht, sehen wir als Nächstes.</Caption>
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
  { id: 'becquerel', C: BecquerelScene, min: 260 },
  { id: 'unsichtbar', C: UnsichtbarScene, min: 240 },
  { id: 'natuerlich', C: NatuerlichScene, min: 250 },
  { id: 'immerda', C: ImmerDaScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const NATUERLICHE_RADIOAKTIVITAET_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const NatuerlicheRadioaktivitaet: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={NATUERLICHE_RADIOAKTIVITAET_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/natuerliche-radioaktivitaet/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
