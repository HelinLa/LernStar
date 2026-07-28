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
import { Coil, useFade } from '../magnet';
import timings from '../narration/elektromagnet-staerke.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Gauge: React.FC<{ x: number; y: number; value: number; label: string }> = ({ x, y, value, label }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 440 }}>
    <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.muted, marginBottom: 10 }}>{label}</div>
    <div style={{ width: '100%', height: 46, borderRadius: 12, background: COLORS.panel, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, value * 100)}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.amber}, ${COLORS.red})` }} />
    </div>
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 360, height: 180 }}>
        <Coil cx={180} cy={90} w={300} h={130} windings={7} on />
      </div>
      <div style={{ fontSize: 70 }}>💪📎📎📎</div>
      <StarLogo size={60} />
      <div style={{ marginTop: 12, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Was macht einen Elektromagneten stärker?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Drei Stellschrauben
      </div>
    </AbsoluteFill>
  );
};

const WindungenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const w = Math.floor(interpolate(frame, [20, 150], [3, 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const val = interpolate(w, [3, 10], [0.28, 0.8]);
  const clips = Math.round(interpolate(w, [3, 10], [2, 7]));
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 1" title="Mehr Windungen – mehr Kraft" />
      <Coil cx={640} cy={520} w={380} h={170} windings={w} on />
      <div style={{ position: 'absolute', left: 470, top: 620, fontSize: 30, fontWeight: 900, color: COLORS.amber }}>{w} Windungen</div>
      <Gauge x={1180} y={430} value={val} label="Tragkraft" />
      <div style={{ position: 'absolute', left: 1180, top: 520, fontSize: 46 }}>{'📎'.repeat(clips)}</div>
      <Caption delay={30}>Wickelt man mehr Windungen um den Kern, wird das Feld stärker – der Magnet hält mehr Klammern.</Caption>
    </AbsoluteFill>
  );
};

const StromScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const I = 0.4 + 0.4 * (0.5 + 0.5 * Math.sin((frame - 20) / 30));
  const clips = Math.round(interpolate(I, [0.4, 0.8], [2, 7]));
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 2" title="Mehr Stromstärke – mehr Kraft" />
      <Coil cx={640} cy={520} w={380} h={170} windings={7} on />
      <Gauge x={1180} y={420} value={I} label="Stromstärke I" />
      <Gauge x={1180} y={520} value={I} label="Tragkraft" />
      <div style={{ position: 'absolute', left: 1180, top: 610, fontSize: 46 }}>{'📎'.repeat(clips)}</div>
      <Caption delay={30}>Dreht man die Stromstärke hoch, steigt die Tragkraft ebenfalls: Kraft wächst mit Windungszahl mal Stromstärke.</Caption>
    </AbsoluteFill>
  );
};

const KernScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const withCore = frame > 75;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 3" title="Ein Eisenkern bündelt das Feld" />
      <Coil cx={640} cy={520} w={380} h={170} windings={7} on />
      <div style={{ position: 'absolute', left: 500, top: 615, fontSize: 27, fontWeight: 800, color: withCore ? COLORS.green : COLORS.muted }}>
        {withCore ? 'Eisenkern eingeschoben' : 'nur Luft im Inneren'}
      </div>
      <Gauge x={1180} y={470} value={withCore ? 0.92 : 0.3} label="Tragkraft" />
      <div style={{ position: 'absolute', left: 1180, top: 560, fontSize: 46 }}>{'📎'.repeat(withCore ? 9 : 3)}</div>
      <Sfx sound="pop" at={75} volume={0.34} />
      <Caption delay={30}>Ein weicher Eisenkern verstärkt das Feld am stärksten – oft um ein Vielfaches.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const bars = [
    { l: 'mehr Windungen', v: 0.6, c: COLORS.amber },
    { l: 'mehr Strom', v: 0.6, c: COLORS.sky },
    { l: 'Eisenkern', v: 0.92, c: COLORS.green },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
      <SceneTitle kicker="Vergleichen" title="Drei Wege zu mehr Tragkraft" />
      <div style={{ display: 'flex', gap: 90, alignItems: 'flex-end', marginBottom: 200, opacity: f }}>
        {bars.map((b, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ width: 150, height: 420, borderRadius: 14, background: COLORS.panel, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: `${b.v * 100}%`, background: b.c }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 14 }}>{b.l}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Alle drei erhöhen die Kraft. Am meisten bringt meist der Eisenkern.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Stärke des Elektromagneten" footer="Tragkraft wächst mit Windungszahl · Stromstärke">
      Stärker wird ein Elektromagnet durch:
      <br />
      mehr Windungen, mehr Strom und einen Eisenkern.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏗️', 'Schrottkran', 'viele Windungen, viel Strom'],
    ['🏥', 'MRT', 'riesige, gekühlte Spulen'],
    ['🚄', 'Magnetschwebebahn', 'starke Elektromagnete'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wo starke Elektromagnete gebraucht werden" />
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
      <Caption delay={40}>Je nach Aufgabe kombiniert man alle drei Faktoren zu genau der richtigen Stärke.</Caption>
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
  { id: 'windungen', C: WindungenScene, min: 250 },
  { id: 'strom', C: StromScene, min: 250 },
  { id: 'kern', C: KernScene, min: 240 },
  { id: 'vergleich', C: VergleichScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ELEKTROMAGNET_STAERKE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const ElektromagnetStaerke: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ELEKTROMAGNET_STAERKE_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/elektromagnet-staerke/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
