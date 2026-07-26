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
import timings from '../narration/energie-entwerten.timings.json';

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
      <div style={{ fontSize: 130, marginBottom: 6 }}>🔋</div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 60, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center', maxWidth: 1500 }}>
        Warum Energie sparen, wenn sie nie verschwindet?
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Erhaltung, Entwertung – und der Vorrat
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔋', 'Akku leer'],
    ['⛽', 'Tank leer'],
    ['🪫', '„verbraucht"'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Die Energie scheint verbraucht" />
      <div style={{ display: 'flex', gap: 44, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Caption delay={40}>Es fühlt sich an, als wäre die Energie einfach weg.</Caption>
    </AbsoluteFill>
  );
};

const WiderspruchScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Erinnerung" title="Energie bleibt erhalten" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: f, marginTop: 20 }}>
        <div style={{ width: 260, padding: '24px', borderRadius: 18, background: COLORS.indigoDeep, textAlign: 'center', fontSize: 28, fontWeight: 900, color: COLORS.ink }}>⚡ Strom im Akku</div>
        <div style={{ fontSize: 50, color: COLORS.muted }}>→</div>
        <div style={{ display: 'flex', gap: 14 }}>
          {['💡 Licht', '🔊 Ton', '🔥 Wärme'].map((x, i) => (
            <div key={i} style={{ padding: '18px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 24, fontWeight: 800 }}>{x}</div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: 32, fontWeight: 800, color: COLORS.green, opacity: f }}>
        Kein einziges Joule ist verschwunden.
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Die Energie hat nur ihre Form gewechselt.</Caption>
    </AbsoluteFill>
  );
};

// Qualitäts-Treppe: hochwertig oben → entwertet unten
const EntwertungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const steps = [
    { l: 'Strom / Benzin', s: 'hochwertig, vielseitig', c: COLORS.green, w: 460 },
    { l: 'Bewegung, Licht', s: 'noch gut nutzbar', c: COLORS.amber, w: 380 },
    { l: 'Wärme im Gerät', s: 'kaum nutzbar', c: '#f97316', w: 300 },
    { l: 'Umgebungswärme', s: 'entwertet – verteilt', c: COLORS.red, w: 220 },
  ];
  const reveal = (i: number) => interpolate(frame, [20 + i * 22, 50 + i * 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Entwertung" title="Von hochwertig zu entwertet" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {steps.map((st, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: reveal(i) }}>
            <div style={{ width: st.w, height: 74, borderRadius: 14, background: st.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#0f172a' }}>{st.l}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, width: 360 }}>{st.s}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 250, top: 320, bottom: 210, width: 8, opacity: f }}>
        <div style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: `26px solid ${COLORS.muted}`, position: 'absolute', bottom: -6, left: -14 }} />
        <div style={{ width: 6, height: '100%', background: COLORS.muted, opacity: 0.5, margin: '0 auto' }} />
      </div>
      <Caption delay={30}>Bei jeder Umwandlung entsteht verteilte, entwertete Wärme.</Caption>
    </AbsoluteFill>
  );
};

const PointeScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Punkt" title="Nicht die Menge – die Nutzbarkeit" />
      <div style={{ display: 'flex', gap: 30, opacity: f, marginTop: 20 }}>
        <div style={{ width: 520, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>♻️</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8, color: COLORS.green }}>Menge bleibt gleich</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>Energieerhaltung</div>
        </div>
        <div style={{ width: 520, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>📉</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8, color: COLORS.red }}>nutzbarer Vorrat sinkt</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>Strom, Benzin sind begrenzt</div>
        </div>
      </div>
      <div style={{ marginTop: 26, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: f }}>
        Sparen = die wertvolle, nutzbare Energie klug einsetzen.
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={44}>Einmal entwertete Wärme bekommen wir nicht zurück.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Warum Energie sparen?" footer="Verbrauch = Entwertung, nicht Vernichtung">
      Energie geht nie verloren,
      <br />
      aber sie wird entwertet.
      <br />
      Wir sparen die nutzbare Energie.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏠', 'Sparen im Haushalt'],
    ['💡', 'effiziente Technik'],
    ['➡️', 'nächstes Kapitel: Energie­versorgung'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Brücke zur Energieversorgung" />
      <div style={{ display: 'flex', gap: 36, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Woher kommt unsere Energie – und wie versorgen wir uns klimafreundlich?</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 210 },
  { id: 'widerspruch', C: WiderspruchScene, min: 240 },
  { id: 'entwertung', C: EntwertungScene, min: 300 },
  { id: 'pointe', C: PointeScene, min: 270 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENERGIE_ENTWERTEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const EnergieEntwerten: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENERGIE_ENTWERTEN_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/energie-entwerten/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
