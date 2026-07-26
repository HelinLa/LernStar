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
import { RgbCircles, useFade } from '../refraction';
import timings from '../narration/farbmischung-additiv.timings.json';

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
      <div style={{ fontSize: 180, marginBottom: 20 }}>📱🌈</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie entstehen Bildschirm-Farben?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Millionen Farben – aus nur drei Lichtern.
      </div>
    </AbsoluteFill>
  );
};

const RgbScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Baustein" title="Rot · Grün · Blau" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 50, opacity: f }}>
          {[['🔴', 'Rot', '#ff2d2d'], ['🟢', 'Grün', '#2dff2d'], ['🔵', 'Blau', '#2d6bff']].map((c, i) => (
            <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[2]}`, textAlign: 'center' }}>
              <div style={{ fontSize: 84 }}>{c[0]}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Jeder Bildpunkt hat drei Lichter: Rot, Grün und Blau – die Lichtgrundfarben.</Caption>
    </AbsoluteFill>
  );
};

const MischenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  // zeige nacheinander die Zweier-Mischungen
  const phase = Math.floor(interpolate(frame, [10, dur - 10], [0, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const combos: { on: [boolean, boolean, boolean]; label: string; col: string }[] = [
    { on: [true, true, false], label: 'Rot + Grün = Gelb', col: '#facc15' },
    { on: [false, true, true], label: 'Grün + Blau = Cyan', col: '#22d3ee' },
    { on: [true, false, true], label: 'Rot + Blau = Magenta', col: '#e879f9' },
  ];
  const cur = combos[Math.min(2, phase)];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Additive Mischung" title="Licht + Licht" />
      <RgbCircles cx={760} cy={560} r={150} on={cur.on} />
      <div style={{ position: 'absolute', left: 1180, top: 500, fontSize: 40, fontWeight: 900, color: cur.col }}>{cur.label}</div>
      <Sfx sound="pop" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.4)}>Rot+Grün ergibt Gelb, Grün+Blau ergibt Cyan, Rot+Blau ergibt Magenta.</Caption>
    </AbsoluteFill>
  );
};

const WeissScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Alle drei" title="Rot + Grün + Blau = Weiß" />
      <RgbCircles cx={760} cy={560} r={150} on={[true, true, true]} />
      <div style={{ position: 'absolute', left: 1200, top: 480, fontSize: 40, fontWeight: 900, color: '#f8fafc', opacity: f }}>⬜ Weiß</div>
      <div style={{ position: 'absolute', left: 1200, top: 560, fontSize: 26, fontWeight: 700, color: COLORS.muted, opacity: f }}>bei Licht: mehr = heller<br />(anders als beim Malen!)</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Alle drei zusammen mit voller Stärke ergeben Weiß – Licht wird heller, nicht dunkler.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Additive Farbmischung" footer="Bildschirme mischen aus RGB">
      Rot + Grün = Gelb, Grün + Blau = Cyan,
      <br />
      Rot + Blau = Magenta.
      <br />
      Alle drei zusammen = Weiß.
    </MerksatzBox>
  </AbsoluteFill>
);

const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 27, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="RGB überall" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="📺" title="Fernseher" delay={10} />
        <TCard icon="📱" title="Handydisplay" delay={30} />
        <TCard icon="🏟️" title="LED-Wand im Stadion" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Aus nur drei Lichtfarben entsteht die ganze bunte Bilderwelt.</Caption>
  </AbsoluteFill>
);

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
  { id: 'rgb', C: RgbScene, min: 220 },
  { id: 'mischen', C: MischenScene, min: 280 },
  { id: 'weiss', C: WeissScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const FARBMISCHUNG_ADDITIV_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const FarbmischungAdditiv: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={FARBMISCHUNG_ADDITIV_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/farbmischung-additiv/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
