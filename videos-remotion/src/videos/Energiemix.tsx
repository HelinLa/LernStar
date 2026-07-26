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
import timings from '../narration/energiemix.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

type Seg = { l: string; v: number; c: string; foss?: boolean };
// Mix heute (fossil-lastig) und 2050 (erneuerbar)
const MIX_HEUTE: Seg[] = [
  { l: 'Kohle', v: 28, c: '#64748b', foss: true },
  { l: 'Gas', v: 22, c: '#f97316', foss: true },
  { l: 'Kernkraft', v: 12, c: '#a78bfa' },
  { l: 'Sonne', v: 12, c: COLORS.amber },
  { l: 'Wind', v: 18, c: COLORS.sky },
  { l: 'Wasser', v: 8, c: '#22d3ee' },
];
const MIX_2050: Seg[] = [
  { l: 'Kohle', v: 3, c: '#64748b', foss: true },
  { l: 'Gas', v: 7, c: '#f97316', foss: true },
  { l: 'Kernkraft', v: 0, c: '#a78bfa' },
  { l: 'Sonne', v: 38, c: COLORS.amber },
  { l: 'Wind', v: 40, c: COLORS.sky },
  { l: 'Wasser', v: 12, c: '#22d3ee' },
];

const StackedBar: React.FC<{ mix: Seg[]; width?: number }> = ({ mix, width = 1400 }) => {
  let acc = 0;
  return (
    <div style={{ width, height: 90, borderRadius: 14, overflow: 'hidden', display: 'flex', border: `2px solid ${COLORS.border}` }}>
      {mix.map((s, i) => {
        acc += s.v;
        return (
          <div key={i} style={{ width: `${s.v}%`, background: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#0f172a' }}>
            {s.v >= 8 ? `${s.l} ${s.v}%` : ''}
          </div>
        );
      })}
    </div>
  );
};

const co2Of = (mix: Seg[]) => mix.filter((s) => s.foss).reduce((a, s) => a + s.v, 0);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 30 }}>
        <span>🏙️</span>
        <span>🔌</span>
        <span>🌱</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Deine Stadt in 30 Jahren
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Energiemix der Zukunft
      </div>
    </AbsoluteFill>
  );
};

const MixView: React.FC<{ mix: Seg[]; title: string }> = ({ mix, title }) => (
  <>
    <div style={{ position: 'absolute', left: 260, top: 420, fontSize: 30, fontWeight: 900 }}>{title}</div>
    <div style={{ position: 'absolute', left: 260, top: 470 }}><StackedBar mix={mix} /></div>
    <div style={{ position: 'absolute', left: 260, top: 600, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.muted }}>CO₂-Ausstoß:</div>
      <div style={{ width: 500, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', border: `2px solid ${COLORS.border}` }}>
        <div style={{ width: `${co2Of(mix) * 2}%`, height: '100%', background: co2Of(mix) > 30 ? COLORS.red : COLORS.green }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: co2Of(mix) > 30 ? COLORS.red : COLORS.green }}>{co2Of(mix) > 30 ? 'hoch' : 'niedrig'}</div>
    </div>
  </>
);

const HeuteScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Heute" title="Noch viel Kohle und Gas" />
      <div style={{ opacity: f }}><MixView mix={MIX_HEUTE} title="Strommix heute" /></div>
      <Caption delay={30}>Weil noch viel verbrannt wird, ist der CO₂-Ausstoß hoch.</Caption>
    </AbsoluteFill>
  );
};

const WandelScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [30, dur - 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mix = MIX_HEUTE.map((s, i) => ({ ...s, v: Math.round(s.v + (MIX_2050[i].v - s.v) * p) }));
  const year = Math.round(2025 + p * 25);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Wandel" title="Immer mehr Sonne und Wind" />
      <MixView mix={mix} title={`Strommix ${year}`} />
      <div style={{ position: 'absolute', left: 820, top: 415, fontSize: 30, fontWeight: 900, color: COLORS.green }}>➕ 🔋 Speicher</div>
      <Caption delay={30}>Mit jedem Schritt Richtung erneuerbar sinkt der CO₂-Ausstoß.</Caption>
    </AbsoluteFill>
  );
};

const MixScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Selbst planen" title="Ein guter Mix – zwei Kriterien" />
      <div style={{ opacity: f }}><MixView mix={MIX_2050} title="Strommix 2050" /></div>
      <div style={{ position: 'absolute', left: 260, top: 720, display: 'flex', gap: 24 }}>
        <div style={{ padding: '16px 24px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 26, fontWeight: 800 }}>✅ Bedarf sicher gedeckt?</div>
        <div style={{ padding: '16px 24px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 26, fontWeight: 800 }}>✅ wenig CO₂?</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Ein guter Mix deckt den Bedarf und stößt wenig CO₂ aus.</Caption>
    </AbsoluteFill>
  );
};

const ZielkonfliktScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Aufgabe" title="Zwei Ziele zusammen denken" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, opacity: f, marginTop: 20 }}>
        <div style={{ width: 460, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 66 }}>🔌</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8, color: COLORS.sky }}>Versorgungssicherheit</div>
          <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>immer Strom – auch bei Dunkelflaute</div>
        </div>
        <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.amber }}>+</div>
        <div style={{ width: 460, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 66 }}>🌍</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8, color: COLORS.green }}>Klimaschutz</div>
          <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>möglichst wenig CO₂</div>
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Beides zusammen zu schaffen, ist die große Aufgabe.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Energie der Zukunft" footer="Bedarf sicher decken · wenig CO₂">
      Nachhaltige Versorgung setzt auf
      <br />
      erneuerbare Quellen und Speicher –
      <br />
      sicher und klimafreundlich.
    </MerksatzBox>
  </AbsoluteFill>
);

const AbschlussScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const chapters = ['💪 Kräfte', '🏃 Bewegung', '⚡ Energie', '🏭 Versorgung'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Abschluss" title="Der Kreis von Jahrgang 9" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: f, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {chapters.map((c, i) => (
          <React.Fragment key={i}>
            <div style={{ padding: '18px 26px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, fontSize: 28, fontWeight: 800 }}>{c}</div>
            {i < chapters.length - 1 && <span style={{ fontSize: 34, color: COLORS.muted }}>→</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 28, fontSize: 32, fontWeight: 800, color: COLORS.green, opacity: f }}>Jetzt kannst du bewerten und mitentscheiden. 🎓</div>
      <Sfx sound="pling" at={16} volume={0.45} />
      <Caption delay={40}>Von Kräften bis zur Energie der Zukunft – Jahrgang 9 geschafft.</Caption>
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
  { id: 'heute', C: HeuteScene, min: 240 },
  { id: 'wandel', C: WandelScene, min: 280 },
  { id: 'mix', C: MixScene, min: 260 },
  { id: 'zielkonflikt', C: ZielkonfliktScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'abschluss', C: AbschlussScene, min: 240 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ENERGIEMIX_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Energiemix: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ENERGIEMIX_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/energiemix/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
