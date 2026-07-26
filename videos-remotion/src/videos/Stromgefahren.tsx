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
import timings from '../narration/stromgefahren.timings.json';

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
  const flash = frame % 30 < 4;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 170, marginBottom: 20, filter: flash ? 'brightness(2)' : 'none' }}>⚡⚠️</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Gefahren des Stroms & Schutz
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Strom ist nützlich – aber die Steckdose ist lebensgefährlich.
      </div>
    </AbsoluteFill>
  );
};

const GefahrScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Lebensgefahr" title="230 V durch den Körper" />
      <div style={{ fontSize: 200, opacity: f }}>🔌🚫💧</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.red, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Niemals mit Steckdosen, blanken Drähten oder defekten Geräten experimentieren – und Wasser & Strom trennen!
      </div>
      <Sfx sound="impact" at={14} volume={0.4} />
      <Caption delay={40}>Der Strom aus der Steckdose kann Muskeln lähmen und das Herz aus dem Takt bringen.</Caption>
    </AbsoluteFill>
  );
};

const UeberlastScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const n = Math.min(5, Math.floor(interpolate(frame, [10, dur - 20], [1, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const hot = n >= 4;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Gefahr 2" title="Überlastung" />
      <div style={{ display: 'flex', gap: 20, fontSize: 90 }}>
        {Array.from({ length: n }).map((_, i) => <div key={i}>🔌</div>)}
      </div>
      <div style={{ marginTop: 30, fontSize: 34, fontWeight: 900, color: hot ? COLORS.red : COLORS.amber }}>{hot ? '🔥 Leitung wird heiß → Brandgefahr!' : `${n} Geräte → Ströme addieren sich`}</div>
      <Sfx sound="impact" at={Math.round(dur * 0.6)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5)}>Zu viele Geräte an einer Steckdose: die Ströme addieren sich, die Leitung wird heiß.</Caption>
    </AbsoluteFill>
  );
};

const SicherungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tripped = frame > dur * 0.5;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Schutz" title="Sicherung & FI-Schalter" />
      <div style={{ fontSize: 180, opacity: 1 }}>{tripped ? '🛡️✅' : '⚡🔥'}</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: tripped ? COLORS.green : COLORS.red, maxWidth: 1300, textAlign: 'center' }}>
        {tripped ? 'Sicherung unterbricht den Kreis → Schutz vor Brand & Stromschlag' : 'Strom wird zu groß …'}
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.5)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Die Sicherung unterbricht bei zu großem Strom sofort – der FI-Schalter rettet Leben.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Gefahren & Schutz" footer="Reparaturen nur vom Fachmann">
      Hohe Spannung ist lebensgefährlich.
      <br />
      Zu viele Geräte überlasten die Leitung.
      <br />
      Die Sicherung unterbricht bei zu viel Strom.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Sicherheit zuerst" />
      <div style={{ fontSize: 170, opacity: f }}>👷🔧</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Reparaturen an der Hausinstallation nur durch eine Elektrofachkraft. Experimente nur mit Batterie-Kleinspannung.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Niemals an der Steckdose experimentieren – immer nur mit ungefährlicher Kleinspannung.</Caption>
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
  { id: 'gefahr', C: GefahrScene, min: 240 },
  { id: 'ueberlast', C: UeberlastScene, min: 240 },
  { id: 'sicherung', C: SicherungScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STROMGEFAHREN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Stromgefahren: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STROMGEFAHREN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/stromgefahren/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
