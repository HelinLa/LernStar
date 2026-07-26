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
import { String as VString, SoundWaves, Waveform, useFade } from '../sound';
import timings from '../narration/ton-entsteht.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 90, marginBottom: 40, fontSize: 130 }}>
        <div>🎸</div><div>🗣️</div><div>🔊</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie entsteht ein Ton?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Jeder Klang hat denselben Ursprung – und den kannst du fühlen.
      </div>
    </AbsoluteFill>
  );
};

// ── Schwingen ──────────────────────────────────────────────────────────
const SchwingenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Beobachten" title="Die Saite schwingt" />
    <VString x1={460} x2={1460} y={540} vibrating amp={60} />
    <SoundWaves x={960} y={540} count={4} />
    <div style={{ position: 'absolute', left: 720, top: 700, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>Schwingung = Ton</div>
    <Sfx sound="pling" at={10} volume={0.4} />
    <Caption>Schlägst du die Saite an, schwingt sie sichtbar hin und her – das ist der Ton.</Caption>
  </AbsoluteFill>
);

// ── Stoppen ────────────────────────────────────────────────────────────
const StoppenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const held = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Beweis" title="Festhalten → Stille" />
      <VString x1={460} x2={1460} y={540} vibrating={!held} amp={60} />
      {held ? <div style={{ position: 'absolute', left: 900, top: 470, fontSize: 90 }}>✋</div> : <SoundWaves x={960} y={540} count={4} />}
      <div style={{ position: 'absolute', left: 720, top: 700, fontSize: 32, fontWeight: 800, color: held ? COLORS.red : COLORS.amber }}>
        {held ? 'Finger drauf → Ton weg 🔇' : 'schwingt → klingt 🔊'}
      </div>
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Keine Schwingung, kein Ton – beide gehören untrennbar zusammen.</Caption>
    </AbsoluteFill>
  );
};

// ── Quellen ────────────────────────────────────────────────────────────
const QuellenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Schallquellen" title="Alle schwingen" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 34, opacity: f }}>
          {[['🎸', 'Saite'], ['🎵', 'Stimmgabel'], ['🔊', 'Lautsprecher'], ['🗣️', 'Stimmbänder']].map((c, i) => (
            <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 74 }}>{c[0]}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Saite, Stimmgabel, Lautsprecher, Stimmbänder – alle schwingen.</Caption>
    </AbsoluteFill>
  );
};

// ── Fühlen ─────────────────────────────────────────────────────────────
const FuehlenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const buzz = Math.sin(frame / 2) * 4;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Selbst spüren" title="Hand an den Hals" />
      <div style={{ fontSize: 220, transform: `translateX(${buzz}px)` }}>🧑‍🦱✋</div>
      <SoundWaves x={1180} y={480} count={3} />
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber }}>summen → Vibration fühlen</div>
      <Sfx sound="pling" at={10} volume={0.35} />
      <Caption delay={30}>Leg die Hand an den Hals und summe – du fühlst die Stimmbänder vibrieren.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Ton entsteht" footer="stoppt die Schwingung, stoppt der Ton">
      Ein Ton entsteht durch einen
      <br />
      schwingenden Gegenstand –
      <br />
      die Schallquelle.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 320, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Überall Schwingungen" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🥁" title="Trommelfell" delay={10} />
        <TCard icon="🎶" title="Flöte (Luftsäule)" delay={30} />
        <TCard icon="🎹" title="Klaviersaite" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall steckt eine Schwingung hinter dem Klang.</Caption>
  </AbsoluteFill>
);

// ── Outro ──────────────────────────────────────────────────────────────
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
  { id: 'schwingen', C: SchwingenScene, min: 220 },
  { id: 'stoppen', C: StoppenScene, min: 240 },
  { id: 'quellen', C: QuellenScene, min: 220 },
  { id: 'fuehlen', C: FuehlenScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TON_ENTSTEHT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const TonEntsteht: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={TON_ENTSTEHT_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/ton-entsteht/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
