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
import timings from '../narration/strahlenbelastung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Bar: React.FC<{ label: string; sub: string; frac: number; color: string }> = ({ label, sub, frac, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
    <div style={{ width: 300, fontSize: 25, fontWeight: 800, textAlign: 'right' }}>{label}</div>
    <div style={{ width: 720, height: 40, borderRadius: 10, background: COLORS.panel, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ width: `${frac * 100}%`, height: '100%', background: color }} />
    </div>
    <div style={{ fontSize: 23, fontWeight: 800, color: COLORS.muted }}>{sub}</div>
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120 }}>📟🌍</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie viel Strahlung steckt in meinem Alltag?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Strahlenbelastung und Dosis
      </div>
    </AbsoluteFill>
  );
};

const DosisScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Einheit" title="Die Dosis misst man in Sievert" />
      <div style={{ opacity: f, marginTop: 30, width: 1300 }}>
        <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, fontSize: 30, fontWeight: 900, textAlign: 'center', marginBottom: 18 }}>
          Dosis in Millisievert (mSv) – ein Maß für die Wirkung auf den Körper
        </div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 24, fontWeight: 800, color: COLORS.muted }}>
          Nicht nur die Menge der Strahlung zählt, sondern auch, wie schädlich sie im Gewebe wirkt. Beides steckt in der Dosis.
        </div>
      </div>
      <Caption delay={30}>Wie stark eine Strahlung auf den Körper wirkt, gibt man als Dosis an, gemessen in Millisievert. Sie berücksichtigt Menge und Schädlichkeit zugleich.</Caption>
    </AbsoluteFill>
  );
};

const QuellenScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Woher sie kommt" title="Die natürliche Belastung pro Jahr" />
      <div style={{ position: 'absolute', left: 120, top: 330, width: 1500, opacity: f }}>
        <Bar label="🪨 Radon (Atemluft)" sub="≈ 1,1 mSv" frac={0.55} color={COLORS.red} />
        <Bar label="🏥 Medizin (Ø)" sub="≈ 1,9 mSv" frac={0.95} color={COLORS.amber} />
        <Bar label="🪨 Boden & Baustoffe" sub="≈ 0,4 mSv" frac={0.2} color={COLORS.sky} />
        <Bar label="☀️ Höhenstrahlung" sub="≈ 0,3 mSv" frac={0.15} color={COLORS.sky} />
        <Bar label="🍌 Nahrung" sub="≈ 0,3 mSv" frac={0.15} color={COLORS.green} />
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Die Strahlung kommt aus vielen Quellen: am meisten aus dem Radon der Atemluft und aus der Medizin, dazu Boden, Höhenstrahlung und Nahrung.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zum Vergleich" title="Von der Banane bis zum CT" />
      <div style={{ position: 'absolute', left: 120, top: 340, width: 1500, opacity: f }}>
        <Bar label="🍌 eine Banane" sub="0,0001 mSv" frac={0.01} color={COLORS.green} />
        <Bar label="✈️ Flug (Fernstrecke)" sub="≈ 0,05 mSv" frac={0.08} color={COLORS.sky} />
        <Bar label="🦷 Röntgen (Zahn)" sub="≈ 0,01 mSv" frac={0.03} color={COLORS.sky} />
        <Bar label="🩻 Röntgen (Lunge)" sub="≈ 0,1 mSv" frac={0.15} color={COLORS.amber} />
        <Bar label="🧠 CT (Kopf)" sub="≈ 2 mSv" frac={0.85} color={COLORS.red} />
      </div>
      <Caption delay={30}>Eine Banane liefert winzige Mengen, ein Flug etwas mehr, eine Röntgenaufnahme eine kleine Dosis. Ein CT liegt deutlich höher – wird aber nur bei Bedarf gemacht.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Strahlenbelastung" footer="natürliche Belastung: ca. 2–4 mSv pro Jahr">
      Die Dosis misst man in Millisievert. Wir sind ständig
      <br />
      einer kleinen, natürlichen Strahlung ausgesetzt –
      <br />
      gefährlich wird erst eine hohe Dosis.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['⛰️', 'Wohnort', 'Berge, Radon im Keller'],
    ['✈️', 'Reisen', 'Flüge, Höhe'],
    ['🩺', 'Untersuchungen', 'nur wenn nötig'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Was die eigene Dosis beeinflusst" />
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
      <Caption delay={40}>Die kleine natürliche Belastung ist normal und unbedenklich. Man versucht nur, unnötige Dosis zu vermeiden.</Caption>
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
  { id: 'dosis', C: DosisScene, min: 240 },
  { id: 'quellen', C: QuellenScene, min: 250 },
  { id: 'vergleich', C: VergleichScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STRAHLENBELASTUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Strahlenbelastung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STRAHLENBELASTUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/strahlenbelastung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
