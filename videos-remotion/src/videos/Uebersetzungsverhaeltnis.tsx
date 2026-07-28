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
import { TransformerCore } from '../induction';
import timings from '../narration/uebersetzungsverhaeltnis.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Tag: React.FC<{ x: number; y: number; top: string; big: string; color: string }> = ({ x, y, top, big, color }) => (
  <div style={{ position: 'absolute', left: x, top: y, textAlign: 'center' }}>
    <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.muted }}>{top}</div>
    <div style={{ fontSize: 46, fontWeight: 900, color }}>{big}</div>
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 100, fontWeight: 900, color: COLORS.amber }}>U₁ / U₂ = N₁ / N₂</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie hängen Windungen und Spannung zusammen?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Das Übersetzungsverhältnis
      </div>
    </AbsoluteFill>
  );
};

const VerhaeltnisScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Regel" title="Spannungen verhalten sich wie Windungszahlen" />
      <TransformerCore cx={560} cy={560} n1={4} n2={8} flow frame={frame} />
      <Tag x={380} y={730} top="Primär" big="200 Wdg." color={COLORS.amber} />
      <Tag x={640} y={730} top="Sekundär" big="400 Wdg." color={COLORS.sky} />
      <div style={{ position: 'absolute', left: 1100, top: 430, width: 700 }}>
        <div style={{ padding: '20px 24px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 34, fontWeight: 900, marginBottom: 16, textAlign: 'center' }}>U₁ / U₂ = N₁ / N₂</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, fontSize: 25, fontWeight: 800 }}>Doppelt so viele Windungen sekundär → doppelte Spannung. Aus 230 V werden 460 V.</div>
      </div>
      <Caption delay={30}>Die beiden Spannungen verhalten sich genau wie die Windungszahlen der beiden Spulen.</Caption>
    </AbsoluteFill>
  );
};

const HochScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Hochtransformieren" title="Mehr Windungen sekundär – höhere Spannung" />
      <TransformerCore cx={560} cy={560} n1={3} n2={9} flow frame={frame} />
      <Tag x={400} y={730} top="Primär" big="230 V" color={COLORS.amber} />
      <Tag x={640} y={730} top="Sekundär" big="690 V" color={COLORS.sky} />
      <div style={{ position: 'absolute', left: 1120, top: 470, width: 660, fontSize: 26, fontWeight: 800, color: COLORS.green }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}` }}>
          🔺 Sekundärspule mit mehr Windungen → die Spannung wird hochgesetzt. Das braucht man für lange Überlandleitungen.
        </div>
      </div>
      <Caption delay={30}>Hat die Sekundärspule mehr Windungen als die Primärspule, wird die Spannung heraufgesetzt – man spricht vom Hochtransformieren.</Caption>
    </AbsoluteFill>
  );
};

const RunterScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Heruntertransformieren" title="Weniger Windungen sekundär – kleinere Spannung" />
      <TransformerCore cx={560} cy={560} n1={9} n2={3} flow frame={frame} />
      <Tag x={400} y={730} top="Primär" big="230 V" color={COLORS.amber} />
      <Tag x={640} y={730} top="Sekundär" big="12 V" color={COLORS.sky} />
      <div style={{ position: 'absolute', left: 1120, top: 470, width: 660, fontSize: 26, fontWeight: 800, color: COLORS.sky }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>
          🔻 Weniger Windungen sekundär → die Spannung wird gesenkt. So bekommt ein Netzteil aus 230 V die kleine Gerätespannung.
        </div>
      </div>
      <Caption delay={30}>Hat die Sekundärspule weniger Windungen, wird die Spannung heruntergesetzt – zum Beispiel von 230 Volt auf ungefährliche 12 Volt.</Caption>
    </AbsoluteFill>
  );
};

const LeistungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Kein Gratis-Trick" title="Was an Spannung steigt, sinkt am Strom" />
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', opacity: f, marginTop: 40 }}>
        <div style={{ width: 340, padding: '26px 20px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.green }}>Spannung ⬆️</div>
          <div style={{ fontSize: 22, color: COLORS.muted, marginTop: 6 }}>hochtransformiert</div>
        </div>
        <div style={{ fontSize: 50 }}>➡️</div>
        <div style={{ width: 340, padding: '26px 20px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.red }}>Stromstärke ⬇️</div>
          <div style={{ fontSize: 22, color: COLORS.muted, marginTop: 6 }}>wird kleiner</div>
        </div>
        <div style={{ fontSize: 50 }}>=</div>
        <div style={{ width: 340, padding: '26px 20px', borderRadius: 18, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.amber }}>Leistung gleich</div>
          <div style={{ fontSize: 24, color: COLORS.muted, marginTop: 6 }}>P = U · I</div>
        </div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Ein Transformator schenkt keine Energie. Steigt die Spannung, sinkt die Stromstärke – die Leistung P = U · I bleibt (fast) gleich.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Das Übersetzungsverhältnis" footer="Leistung bleibt: U hoch → I runter">
      U₁ / U₂ = N₁ / N₂
      <br />
      Mehr Windungen = mehr Spannung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔌', 'Netzteil', '230 V → 5 V'],
    ['🏗️', 'Kraftwerk', '→ Hochspannung'],
    ['🏠', 'Ortsnetz', '→ 230 V zuhause'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Hoch und runter im Stromnetz" />
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
      <Caption delay={40}>Genau so wird Strom im Netz hoch- und wieder heruntertransformiert – warum, klärt der nächste Baustein.</Caption>
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
  { id: 'verhaeltnis', C: VerhaeltnisScene, min: 250 },
  { id: 'hoch', C: HochScene, min: 240 },
  { id: 'runter', C: RunterScene, min: 240 },
  { id: 'leistung', C: LeistungScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const UEBERSETZUNGSVERHAELTNIS_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Uebersetzungsverhaeltnis: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={UEBERSETZUNGSVERHAELTNIS_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/uebersetzungsverhaeltnis/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
