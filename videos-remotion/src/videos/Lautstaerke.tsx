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
import { Waveform, DbMeter, useFade } from '../sound';
import timings from '../narration/lautstaerke.timings.json';

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
        <div>🤫</div><div>🔊</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wovon hängt die Lautstärke ab?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Flüstern oder Konzert – was macht den Unterschied?
      </div>
    </AbsoluteFill>
  );
};

// ── Amplitude ──────────────────────────────────────────────────────────
const AmplitudeScene: React.FC<SceneProps> = () => {
  const lab = useFade(30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Welle" title="Die Amplitude zählt" />
      <Waveform x={510} y={520} w={900} amplitude={120} freq={4} color={COLORS.sky} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <line x1={640} y1={520} x2={640} y2={400} stroke={COLORS.amber} strokeWidth={4} opacity={lab} />
        <line x1={620} y1={400} x2={660} y2={400} stroke={COLORS.amber} strokeWidth={4} opacity={lab} />
      </svg>
      <div style={{ position: 'absolute', left: 680, top: 380, fontSize: 30, fontWeight: 800, color: COLORS.amber, opacity: lab }}>Amplitude = Höhe der Welle</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={40}>Wie hoch die Welle ausschlägt, nennt man Amplitude.</Caption>
    </AbsoluteFill>
  );
};

// ── Laut ───────────────────────────────────────────────────────────────
const LautScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Kräftig" title="Große Amplitude = laut" />
    <Waveform x={510} y={480} w={900} amplitude={150} freq={4} color={COLORS.red} />
    <DbMeter x={640} y={760} db={95} w={640} />
    <div style={{ position: 'absolute', left: 1360, top: 440, fontSize: 100 }}>🔊</div>
    <Sfx sound="impact" at={10} volume={0.4} />
    <Caption>Kräftig angeschlagen: große Amplitude, hohe Welle – der Ton ist laut.</Caption>
  </AbsoluteFill>
);

// ── Leise ──────────────────────────────────────────────────────────────
const LeiseScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Sanft" title="Kleine Amplitude = leise" />
    <Waveform x={510} y={480} w={900} amplitude={40} freq={4} color={COLORS.green} />
    <DbMeter x={640} y={760} db={35} w={640} />
    <div style={{ position: 'absolute', left: 1360, top: 440, fontSize: 100 }}>🤫</div>
    <div style={{ position: 'absolute', left: 640, top: 300, fontSize: 26, fontWeight: 800, color: COLORS.muted }}>Tonhöhe bleibt gleich!</div>
    <Sfx sound="pop" at={10} volume={0.28} />
    <Caption>Sanft gezupft: kleine Amplitude, flache Welle – der Ton ist leise.</Caption>
  </AbsoluteFill>
);

// ── Dezibel ────────────────────────────────────────────────────────────
const DezibelScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gemessen in" title="Dezibel (dB)" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 34, opacity: f }}>
          {[['🤫', 'Flüstern', '30 dB', COLORS.green], ['🗣️', 'Gespräch', '60 dB', COLORS.sky], ['🚧', 'Presslufthammer', '100+ dB', COLORS.red]].map((c, i) => (
            <div key={i} style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[3]}`, textAlign: 'center' }}>
              <div style={{ fontSize: 74 }}>{c[0]}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: c[3] as string, marginTop: 4 }}>{c[2]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Die Lautstärke misst man in Dezibel – von leise bis gefährlich laut.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Lautstärke" footer="gemessen in Dezibel (dB)">
      Die Lautstärke hängt von der
      <br />
      Amplitude ab: große Amplitude
      <br />
      laut, kleine Amplitude leise.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Lautstärkeregler" />
      <div style={{ fontSize: 180, opacity: f }}>🔊🎚️</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Lauter drehen = größere Amplitude. Die Melodie bleibt gleich.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Am Regler drehen: Der Lautsprecher schwingt mit größerer Amplitude.</Caption>
    </AbsoluteFill>
  );
};

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
  { id: 'amplitude', C: AmplitudeScene, min: 220 },
  { id: 'laut', C: LautScene, min: 220 },
  { id: 'leise', C: LeiseScene, min: 220 },
  { id: 'dezibel', C: DezibelScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const LAUTSTAERKE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Lautstaerke: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={LAUTSTAERKE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/lautstaerke/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
