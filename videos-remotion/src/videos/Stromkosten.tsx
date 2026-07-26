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
import { useFade } from '../electric';
import timings from '../narration/stromkosten.timings.json';

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
      <div style={{ fontSize: 150, marginBottom: 20 }}>⚡💶</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Was kostet elektrische Energie?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie entsteht die Stromrechnung?
      </div>
    </AbsoluteFill>
  );
};

const ZaehlerScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const kwh = interpolate(frame, [15, dur - 20], [0, 47], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Stromzähler" title="Misst in Kilowattstunden" />
      <div style={{ width: 500, height: 200, borderRadius: 18, background: '#0f172a', border: `5px solid ${COLORS.sky}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 80, fontWeight: 900, fontFamily: 'monospace', color: COLORS.green }}>{kwh.toFixed(1)} kWh</div>
      </div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Der Stromzähler zählt ununterbrochen die verbrauchten Kilowattstunden.</Caption>
    </AbsoluteFill>
  );
};

const KostenScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Rechnung" title="Energie × Preis" />
      <div style={{ fontSize: 52, fontWeight: 900, opacity: f, textAlign: 'center', lineHeight: 1.6 }}>
        Kosten = <span style={{ color: COLORS.sky }}>kWh</span> · <span style={{ color: COLORS.amber }}>Preis/kWh</span>
        <div style={{ marginTop: 30, fontSize: 44, color: COLORS.green }}>10 kWh · 40 ct = 4,00 €</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Kosten sind verbrauchte Kilowattstunden mal Preis pro Kilowattstunde.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vergleich" title="Sparsam vs. Stromfresser" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>💡</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>LED: wenig kWh → wenige Cent</div>
          </div>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>🔥</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>Heizlüfter: viele kWh → teuer</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Hohe Leistung mal lange Laufzeit macht viele Kilowattstunden – und hohe Kosten.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Stromkosten" footer="Stromzähler misst in kWh">
      Kosten = Energie (kWh) × Preis pro kWh.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Die großen Verbraucher" />
      <div style={{ display: 'flex', gap: 34, opacity: f }}>
        {[['🔥', 'Heizung'], ['🌀', 'Trockner'], ['❄️', 'alter Kühlschrank']].map((c, i) => (
          <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 70 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Diese Geräte verbrauchen viele Kilowattstunden – bei ihnen lohnt sich das Sparen am meisten.</Caption>
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
  { id: 'intro', C: Intro, min: 130 },
  { id: 'zaehler', C: ZaehlerScene, min: 240 },
  { id: 'kosten', C: KostenScene, min: 240 },
  { id: 'vergleich', C: VergleichScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 160 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STROMKOSTEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Stromkosten: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STROMKOSTEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/stromkosten/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
