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
import timings from '../narration/nachhaltigkeit.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Bars: React.FC<{ verbrauch: number; co2: number }> = ({ verbrauch, co2 }) => (
  <div style={{ display: 'flex', gap: 60, alignItems: 'flex-end', height: 300 }}>
    {[{ v: verbrauch, c: COLORS.amber, l: 'Verbrauch' }, { v: co2, c: COLORS.red, l: 'CO₂' }].map((b, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 100, height: 260, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `2px solid ${COLORS.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${b.v * 100}%`, background: b.c }} />
        </div>
        <div style={{ marginTop: 12, fontSize: 24, fontWeight: 800, color: b.c }}>{b.l}</div>
      </div>
    ))}
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 40 }}>
        <span>🏡</span>
        <span>🌱</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Energie nutzen ohne Reue
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Nachhaltige Energieversorgung
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Gleicher Komfort, anderer Verbrauch" />
      <div style={{ display: 'flex', gap: 50, opacity: f, marginTop: 10 }}>
        <div style={{ width: 560, padding: '26px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>🏚️</div>
          <div style={{ fontSize: 27, fontWeight: 900, marginTop: 6 }}>Haushalt A</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.red, marginTop: 8 }}>viel Energie · viel CO₂</div>
        </div>
        <div style={{ width: 560, padding: '26px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>🏡</div>
          <div style={{ fontSize: 27, fontWeight: 900, marginTop: 6 }}>Haushalt B</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.green, marginTop: 8 }}>wenig Energie · wenig CO₂</div>
        </div>
      </div>
      <div style={{ marginTop: 22, fontSize: 28, fontWeight: 800, color: COLORS.muted, opacity: f }}>beide: warm & hell 💡🔥</div>
      <Caption delay={40}>Gleicher Komfort ist mit sehr verschiedenem Verbrauch möglich.</Caption>
    </AbsoluteFill>
  );
};

const MassnahmenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const measures = [['🧱', 'Dämmung'], ['🔆', 'LED'], ['♨️', 'Wärmepumpe'], ['🌿', 'Ökostrom']];
  const active = Math.min(4, Math.floor(interpolate(frame, [30, dur - 60], [0, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const verbrauch = 1 - active * 0.18;
  const co2 = 1 - active * 0.23;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Maßnahmen" title="Zuschalten – Verbrauch sinkt" />
      <div style={{ position: 'absolute', left: 150, top: 380, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {measures.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${i < active ? COLORS.green : COLORS.border}`, opacity: i < active ? 1 : 0.4, width: 420 }}>
            <div style={{ fontSize: 40 }}>{m[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{m[1]}</div>
            <div style={{ marginLeft: 'auto', fontSize: 26 }}>{i < active ? '✅' : '⬜'}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 1150, top: 420 }}>
        <Bars verbrauch={Math.max(0.08, verbrauch)} co2={Math.max(0.04, co2)} />
      </div>
      <Caption delay={30}>Dämmung, LED, Wärmepumpe, Ökostrom – zusammen wirkt es stark.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="Vorher und nachher" />
      <div style={{ display: 'flex', gap: 100, opacity: f, marginTop: 10 }}>
        <div style={{ textAlign: 'center' }}>
          <Bars verbrauch={0.95} co2={0.9} />
          <div style={{ marginTop: 16, fontSize: 28, fontWeight: 900, color: COLORS.red }}>ohne Maßnahmen</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Bars verbrauch={0.3} co2={0.1} />
          <div style={{ marginTop: 16, fontSize: 28, fontWeight: 900, color: COLORS.green }}>mit Maßnahmen</div>
        </div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Weniger Verbrauch, fast kein CO₂ – bei gleichem Komfort.</Caption>
    </AbsoluteFill>
  );
};

const PrinzipScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔌', 'Sparen', 'unnötigen Verbrauch vermeiden', COLORS.sky],
    ['⚙️', 'Effizienz', 'mit weniger mehr erreichen', COLORS.amber],
    ['🌿', 'Regenerativ', 'saubere Quellen nutzen', COLORS.green],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Das Rezept" title="Sparen + Effizienz + Regenerativ" />
      <div style={{ display: 'flex', gap: 30, opacity: f, marginTop: 10 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 440, padding: '30px 20px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[3] as string}`, textAlign: 'center' }}>
            <div style={{ fontSize: 66 }}>{c[0]}</div>
            <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, color: c[3] as string }}>{c[1]}</div>
            <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, fontSize: 30, fontWeight: 800, color: COLORS.green, opacity: f }}>= nachhaltige Energieversorgung</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Drei Bausteine, ein Ziel: die Zukunft nicht belasten.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Nachhaltigkeit" footer="sparen · effizient · regenerativ">
      Energie so nutzen, dass auch
      <br />
      die Zukunft nicht belastet wird:
      <br />
      sparen, effizient sein, regenerativ.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['💡', 'Licht aus'],
    ['🔌', 'kein Standby'],
    ['🏫', 'Haushalt & Schule'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Es fängt bei dir an" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Jede kleine Maßnahme spart Energie und CO₂.</Caption>
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
  { id: 'massnahmen', C: MassnahmenScene, min: 300 },
  { id: 'vergleich', C: VergleichScene, min: 240 },
  { id: 'prinzip', C: PrinzipScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const NACHHALTIGKEIT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Nachhaltigkeit: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={NACHHALTIGKEIT_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/nachhaltigkeit/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
