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
import timings from '../narration/r-u-i.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Formel-Dreieck U / (R · I)
const Triangle: React.FC<{ cover?: 'U' | 'R' | 'I' | null }> = ({ cover = null }) => (
  <svg width={420} height={380} viewBox="0 0 420 380">
    <polygon points="210,20 40,360 380,360" fill="none" stroke={COLORS.muted} strokeWidth={4} />
    <line x1={70} y1={200} x2={350} y2={200} stroke={COLORS.muted} strokeWidth={4} />
    <line x1={210} y1={200} x2={210} y2={360} stroke={COLORS.muted} strokeWidth={4} />
    <text x={210} y={140} fontSize={80} fill={cover === 'U' ? COLORS.red : COLORS.green} textAnchor="middle" fontWeight="bold" opacity={cover === 'U' ? 0.3 : 1}>U</text>
    <text x={120} y={310} fontSize={70} fill={cover === 'R' ? COLORS.red : COLORS.sky} textAnchor="middle" fontWeight="bold" opacity={cover === 'R' ? 0.3 : 1}>R</text>
    <text x={300} y={310} fontSize={70} fill={cover === 'I' ? COLORS.red : COLORS.amber} textAnchor="middle" fontWeight="bold" opacity={cover === 'I' ? 0.3 : 1}>I</text>
  </svg>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 130, fontWeight: 900, marginBottom: 20 }}>R = U/I</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Das Ohmsche Gesetz
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Die wichtigste Formel – sicher anwenden.
      </div>
    </AbsoluteFill>
  );
};

const FormelScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Formel" title="R = U / I" />
      <div style={{ fontSize: 130, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.sky }}>R</span> = <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', fontSize: 70 }}>
          <span style={{ borderBottom: `5px solid ${COLORS.ink}`, padding: '0 20px', color: COLORS.green }}>U</span>
          <span style={{ padding: '0 20px', color: COLORS.amber }}>I</span>
        </span>
      </div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.muted, opacity: f }}>Einheit: Ohm (Ω)</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Widerstand R ist Spannung U geteilt durch Stromstärke I.</Caption>
    </AbsoluteFill>
  );
};

const UmstellenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Umstellen" title="Drei Formen" />
      <div style={{ display: 'flex', gap: 50, opacity: f }}>
        {[['R = U/I', COLORS.sky], ['I = U/R', COLORS.amber], ['U = R·I', COLORS.green]].map((c, i) => (
          <div key={i} style={{ padding: '30px 40px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[1]}`, fontSize: 50, fontWeight: 900, color: c[1] as string }}>{c[0]}</div>
        ))}
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Je nachdem, was du suchst, stellst du die Formel passend um.</Caption>
    </AbsoluteFill>
  );
};

const DreieckScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cover: 'U' | 'R' | 'I' = frame < dur * 0.4 ? 'U' : frame < dur * 0.7 ? 'R' : 'I';
  const result = cover === 'U' ? 'U = R · I' : cover === 'R' ? 'R = U / I' : 'I = U / R';
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Merkhilfe" title="Das Formel-Dreieck" />
      <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
        <Triangle cover={cover} />
        <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.amber }}>{result}</div>
      </div>
      <Sfx sound="pop" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.4)}>Deckst du die gesuchte Größe zu, zeigt dir das Dreieck die Rechnung.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Ohmsches Gesetz" footer="Einheit Ohm (Ω)">
      R = U / I. Umgestellt:
      <br />
      I = U / R und U = R · I.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Der Schlüssel zu jeder Aufgabe" />
      <div style={{ fontSize: 170, opacity: f }}>🔑⚡</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Kennst du zwei der drei Größen, berechnest du die dritte – in jeder Schaltung.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>R = U/I ist der Schlüssel zu fast jeder Aufgabe der Elektrizitätslehre.</Caption>
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
  { id: 'formel', C: FormelScene, min: 220 },
  { id: 'umstellen', C: UmstellenScene, min: 240 },
  { id: 'dreieck', C: DreieckScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const R_U_I_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const RUI: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={R_U_I_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/r-u-i/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
