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
import { ForceArrow, useFade } from '../forces';
import timings from '../narration/verzoegerung-jg9.timings.json';

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
  const carX = interpolate(frame, [0, 120], [700, 1050], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 180, left: carX, fontSize: 90 }}>🚗🛑</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 24, fontSize: 74, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Schneller oder langsamer?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Abbremsen heißt: Verzögerung.
      </div>
    </AbsoluteFill>
  );
};

const DefinitionScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zwei Richtungen" title="Beschleunigung vs. Verzögerung" />
      <div style={{ position: 'absolute', left: 340, top: 420, fontSize: 90, opacity: f }}>🚗</div>
      <div style={{ position: 'absolute', left: 1280, top: 420, fontSize: 90, opacity: f }}>🚗</div>
      <div style={{ opacity: f }}>
        <ForceArrow x={470} y={620} angleDeg={0} len={220} color={COLORS.green} width={12} />
        <ForceArrow x={1470} y={620} angleDeg={180} len={220} color={COLORS.red} width={12} />
      </div>
      <div style={{ position: 'absolute', left: 300, top: 700, width: 400, textAlign: 'center', fontSize: 34, fontWeight: 900, color: COLORS.green, opacity: f }}>schneller</div>
      <div style={{ position: 'absolute', left: 300, top: 748, width: 400, textAlign: 'center', fontSize: 26, fontWeight: 700, color: COLORS.muted, opacity: f }}>a in Fahrtrichtung</div>
      <div style={{ position: 'absolute', left: 1160, top: 700, width: 460, textAlign: 'center', fontSize: 34, fontWeight: 900, color: COLORS.red, opacity: f }}>langsamer</div>
      <div style={{ position: 'absolute', left: 1160, top: 748, width: 460, textAlign: 'center', fontSize: 26, fontWeight: 700, color: COLORS.muted, opacity: f }}>Verzögerung · a gegen die Fahrt</div>
      <Sfx sound="whoosh" at={14} volume={0.3} />
      <Caption delay={30}>Zeigt die Beschleunigung gegen die Bewegung, wird der Körper langsamer.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(18);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beispiel" title="Fahrrad bremst" />
      <div style={{ opacity: f, textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.muted }}>8 m/s → 0 in 4 s · · · Δv = −8 m/s</div>
        <div style={{ marginTop: 22, fontSize: 58, fontWeight: 900, color: COLORS.red }}>a = −8 m/s ÷ 4 s = −2 m/s²</div>
      </div>
      <Sfx sound="pling" at={18} volume={0.45} />
      <Caption delay={40}>Das Minuszeichen zeigt: Die Geschwindigkeit nimmt ab – der Körper bremst.</Caption>
    </AbsoluteFill>
  );
};

const KraftScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Warum?" title="Auch Bremsen braucht Kraft" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🖐️', 'Bremskraft'], ['🛞', 'Reibung'], ['🪂', 'Luftwiderstand']].map((c, i) => (
          <div key={i} style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Ohne bremsende Kraft würde der Körper einfach mit gleichem Tempo weiterfahren.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Verzögerung" footer="berechnet mit a = Δv / Δt">
      Schneller werden = Beschleunigung in Fahrtrichtung.
      <br />
      Langsamer werden = Verzögerung,
      <br />
      eine negative Beschleunigung gegen die Bewegung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Sanft zum Stehen" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['🚗', 'Auto-Bremse'], ['🚆', 'Zug im Bahnhof'], ['🪂', 'Fallschirm']].map((c, i) => (
          <div key={i} style={{ width: 360, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Überall dort bremst eine Kraft die Bewegung ab.</Caption>
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
  { id: 'definition', C: DefinitionScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 260 },
  { id: 'kraft', C: KraftScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 200 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const VERZOEGERUNG_JG9_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const VerzoegerungJg9: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={VERZOEGERUNG_JG9_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/verzoegerung-jg9/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
