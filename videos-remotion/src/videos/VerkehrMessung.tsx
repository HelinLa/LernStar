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
import timings from '../narration/verkehr-messung.timings.json';

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
  const flash = frame % 40 < 4;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 170, marginBottom: 20, filter: flash ? 'brightness(2.2)' : 'none' }}>📷🚗</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 74, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Blitzer im Straßenverkehr
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie misst ein Blitzer, wie schnell ein Auto fährt?
      </div>
    </AbsoluteFill>
  );
};

const BlitzerScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const carX = 200 + ((frame * 12) % 1200);
  const near = carX > 800 && carX < 1000;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Methode 1" title="Radar / Laser am Punkt" />
      <div style={{ position: 'absolute', left: 900, top: 320, fontSize: 100 }}>📷</div>
      <div style={{ position: 'absolute', left: carX, top: 500, fontSize: 80 }}>🚗{near ? '💥' : ''}</div>
      <div style={{ position: 'absolute', left: 200, top: 600, width: 1300, height: 4, background: COLORS.border }} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {near ? [0, 1, 2].map((i) => <line key={i} x1={960} y1={420} x2={carX + 40} y2={540} stroke={COLORS.amber} strokeWidth={3} opacity={0.7 - i * 0.2} />) : null}
      </svg>
      <div style={{ position: 'absolute', left: 640, top: 720, fontSize: 28, fontWeight: 800, color: COLORS.amber }}>Wellen werden zurückgeworfen → Tempo berechnet</div>
      <Sfx sound="impact" at={near ? 2 : 60} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Der Blitzer sendet Radar- oder Laserwellen aus und berechnet aus dem Echo die Geschwindigkeit.</Caption>
    </AbsoluteFill>
  );
};

const AbschnittScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const carX = 300 + ((frame * 9) % 1300);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Methode 2" title="Abschnittskontrolle" />
      <div style={{ position: 'absolute', left: 300, top: 320, fontSize: 70 }}>📷</div>
      <div style={{ position: 'absolute', left: 1500, top: 320, fontSize: 70 }}>📷</div>
      <div style={{ position: 'absolute', left: carX, top: 480, fontSize: 70 }}>🚗</div>
      <div style={{ position: 'absolute', left: 300, top: 580, width: 1270, height: 4, background: COLORS.border }} />
      <div style={{ position: 'absolute', left: 700, top: 640, fontSize: 28, fontWeight: 800, color: COLORS.sky }}>bekannte Strecke s · gemessene Zeit t</div>
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Zwei Kameras messen die Zeit über eine bekannte Strecke – das ergibt die Durchschnittsgeschwindigkeit.</Caption>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Dahinter steckt" title="v = s / t" />
      <div style={{ fontSize: 120, fontWeight: 900, opacity: f }}>
        v = <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', fontSize: 64 }}>
          <span style={{ borderBottom: `5px solid ${COLORS.ink}`, padding: '0 20px', color: COLORS.sky }}>s (bekannt)</span>
          <span style={{ padding: '0 20px', color: COLORS.amber }}>t (gemessen)</span>
        </span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Bei der Abschnittskontrolle steckt genau unsere Formel dahinter: v = s ÷ t.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Tempo-Messung" footer="Abschnittskontrolle: v = s / t">
      Radar/Laser misst am Punkt.
      <br />
      Die Abschnittskontrolle misst die Zeit
      <br />
      über eine bekannte Strecke.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Kurz bremsen bringt nichts" />
      <div style={{ fontSize: 170, opacity: f }}>🚗🛑❓</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Bei der Abschnittskontrolle zählt der Durchschnitt über die ganze Strecke – kurzes Bremsen hilft nicht.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Wer sich ans Tempolimit hält, hat nichts zu befürchten.</Caption>
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
  { id: 'blitzer', C: BlitzerScene, min: 260 },
  { id: 'abschnitt', C: AbschnittScene, min: 240 },
  { id: 'formel', C: FormelScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const VERKEHR_MESSUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const VerkehrMessung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={VERKEHR_MESSUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/verkehr-messung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
