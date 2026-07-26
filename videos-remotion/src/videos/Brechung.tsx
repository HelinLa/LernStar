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
import { MediaSplit, RefractRay, useFade } from '../refraction';
import timings from '../narration/brechung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const BOUND = 520;

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 190, marginBottom: 20 }}>🥤🥢</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 74, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Warum erscheint alles im Wasser verschoben?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Der Strohhalm im Glas sieht plötzlich geknickt aus.
      </div>
    </AbsoluteFill>
  );
};

const BrechungScene: React.FC<SceneProps> = ({ dur }) => {
  const p = useFade(15, 30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Licht wird an der Grenze gebrochen" />
      <MediaSplit boundaryY={BOUND} />
      <RefractRay hitX={960} hitY={BOUND} aIn={45} aOut={30} />
      <div style={{ position: 'absolute', left: 1080, top: 380, fontSize: 26, fontWeight: 800, color: COLORS.muted, opacity: p }}>Lot (Senkrechte)</div>
      <Sfx sound="whoosh" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>An der Grenze Luft–Wasser ändert das Licht seine Richtung – es wird gebrochen.</Caption>
    </AbsoluteFill>
  );
};

const AugeScene: React.FC<SceneProps> = ({ dur }) => {
  const p = useFade(20, 30);
  const fishX = 1100, fishTrue = 780, fishApp = 660;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Trick" title="Das Auge verlängert gerade" />
      <MediaSplit boundaryY={BOUND} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* echter Strahl vom Fisch, gebrochen an der Oberfläche zum Auge */}
        <line x1={fishX} y1={fishTrue} x2={860} y2={BOUND} stroke={COLORS.green} strokeWidth={4} />
        <line x1={860} y1={BOUND} x2={500} y2={340} stroke={COLORS.green} strokeWidth={4} />
        {/* Rückverlängerung → scheinbarer Fisch */}
        <line x1={860} y1={BOUND} x2={fishX} y2={fishApp} stroke={COLORS.muted} strokeWidth={3} strokeDasharray="8 8" opacity={p} />
      </svg>
      <div style={{ position: 'absolute', left: fishX - 30, top: fishTrue - 30, fontSize: 60 }}>🐟</div>
      <div style={{ position: 'absolute', left: fishX - 30, top: fishApp - 30, fontSize: 60, opacity: 0.45 }}>🐟</div>
      <div style={{ position: 'absolute', left: 440, top: 300, fontSize: 50 }}>👁️</div>
      <div style={{ position: 'absolute', left: fishX + 40, top: fishTrue - 10, fontSize: 24, fontWeight: 800, color: COLORS.green }}>wahr</div>
      <div style={{ position: 'absolute', left: fishX + 40, top: fishApp - 10, fontSize: 24, fontWeight: 800, color: COLORS.muted }}>scheinbar</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Das Auge verlängert den Strahl gerade – der Fisch scheint höher zu sein.</Caption>
    </AbsoluteFill>
  );
};

const HoeherScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Täuschung" title="Wasser wirkt flacher" />
      <div style={{ fontSize: 200, opacity: f }}>🏊⚠️</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.red, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Klares Wasser sieht flacher aus, als es ist – nie ahnungslos hineinspringen!
      </div>
      <Sfx sound="impact" at={14} volume={0.34} />
      <Caption delay={40}>Deshalb greifst du beim Fischen daneben und unterschätzt die Tiefe.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Brechung" footer="darum wirkt Wasser flacher, als es ist">
      An der Grenze Luft–Wasser wird Licht
      <br />
      gebrochen. Das Auge verlängert gerade –
      <br />
      der Gegenstand erscheint höher.
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
    <SceneTitle kicker="Übertragen" title="Brechung verrät das Wasser" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🥤🥢" title="geknickter Strohhalm" delay={10} />
        <TCard icon="🥄" title="gebrochener Löffel" delay={30} />
        <TCard icon="🦵" title="kürzere Beine im Becken" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall täuscht die Brechung dein Auge.</Caption>
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
  { id: 'brechung', C: BrechungScene, min: 240 },
  { id: 'auge', C: AugeScene, min: 260 },
  { id: 'hoeher', C: HoeherScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BRECHUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Brechung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BRECHUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/brechung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
