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
import { useFade } from '../magnet';
import timings from '../narration/c14-methode.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const C14Bar: React.FC<{ x: number; y: number; frac: number }> = ({ x, y, frac }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 420 }}>
    <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.muted, marginBottom: 8 }}>C-14 im Körper</div>
    <div style={{ width: '100%', height: 46, borderRadius: 12, background: COLORS.panel, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ width: `${frac * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.amber})` }} />
    </div>
    <div style={{ fontSize: 24, fontWeight: 900, marginTop: 8, color: COLORS.amber }}>{Math.round(frac * 100)}%</div>
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 110 }}>🧊🏹</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie bestimmt man das Alter von Ötzi?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die C-14-Methode
      </div>
    </AbsoluteFill>
  );
};

const LebendScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const pulse = 0.96 + 0.04 * Math.sin(frame / 8);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Solange es lebt" title="C-14 wird ständig nachgeliefert" />
      <div style={{ position: 'absolute', left: 400, top: 460, fontSize: 160 }}>🌳</div>
      <div style={{ position: 'absolute', left: 200, top: 360, fontSize: 40 }}>🌫️ CO₂</div>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {[0, 1, 2].map((i) => <polygon key={i} points="0,-10 22,0 0,10" fill={COLORS.green} transform={`translate(${360 + i * 30},${430 + i * 30})`} />)}
      </svg>
      <C14Bar x={1160} y={470} frac={pulse} />
      <div style={{ position: 'absolute', left: 1160, top: 610, width: 620, fontSize: 24, fontWeight: 800, color: COLORS.muted, opacity: f }}>
        Pflanzen und Tiere nehmen mit der Nahrung ständig frisches C-14 auf. Der Anteil bleibt dabei konstant.
      </div>
      <Caption delay={30}>Jedes Lebewesen nimmt über die Luft und die Nahrung ständig etwas radioaktives C-14 auf. Solange es lebt, bleibt der Anteil im Körper konstant.</Caption>
    </AbsoluteFill>
  );
};

const TodScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const frac = Math.pow(0.5, interpolate(frame, [30, 150], [0, 2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Nach dem Tod" title="Kein Nachschub – C-14 zerfällt" />
      <div style={{ position: 'absolute', left: 400, top: 470, fontSize: 150, filter: 'grayscale(1)', opacity: 0.7 }}>🪵</div>
      <div style={{ position: 'absolute', left: 250, top: 380, fontSize: 40 }}>🌫️ CO₂ 🚫</div>
      <C14Bar x={1160} y={470} frac={frac} />
      <div style={{ position: 'absolute', left: 1160, top: 610, width: 620, fontSize: 24, fontWeight: 800, color: COLORS.muted, opacity: f }}>
        Ab dem Tod kommt kein neues C-14 mehr dazu. Das vorhandene zerfällt mit einer Halbwertszeit von 5 730 Jahren.
      </div>
      <Sfx sound="pop" at={30} volume={0.3} />
      <Caption delay={30}>Stirbt das Lebewesen, wird kein neues C-14 mehr aufgenommen. Das vorhandene zerfällt langsam weiter – mit einer Halbwertszeit von 5 730 Jahren.</Caption>
    </AbsoluteFill>
  );
};

const MessenScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const rows = [
    ['noch 50 %', '1 Halbwertszeit', '≈ 5 730 Jahre'],
    ['noch 25 %', '2 Halbwertszeiten', '≈ 11 460 Jahre'],
    ['noch 12,5 %', '3 Halbwertszeiten', '≈ 17 190 Jahre'],
  ];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Messen und rechnen" title="Der C-14-Rest verrät das Alter" />
      <div style={{ position: 'absolute', left: 260, top: 340, width: 1400, opacity: f }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20, fontSize: 28, fontWeight: 800 }}>
            <div style={{ width: 260, color: COLORS.amber }}>{r[0]}</div>
            <div style={{ fontSize: 30, color: COLORS.muted }}>→</div>
            <div style={{ width: 360 }}>{r[1]}</div>
            <div style={{ fontSize: 30, color: COLORS.muted }}>→</div>
            <div style={{ color: COLORS.green }}>{r[2]}</div>
          </div>
        ))}
      </div>
      <Caption delay={30}>Man misst, wie viel C-14 noch übrig ist. Sind es noch 50 Prozent, ist eine Halbwertszeit vergangen. Bei 25 Prozent sind es zwei. So rechnet man das Alter aus.</Caption>
    </AbsoluteFill>
  );
};

const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beispiel Ötzi" title="Rund 5 300 Jahre alt" />
      <div style={{ fontSize: 130, opacity: f }}>🧊🏔️</div>
      <div style={{ opacity: f, marginTop: 20, padding: '26px 34px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 30, fontWeight: 800, maxWidth: 1300, textAlign: 'center' }}>
        In Ötzis Gewebe war noch etwa die Hälfte des C-14 vorhanden. Also ist ungefähr eine Halbwertszeit vergangen – er lebte vor rund 5 300 Jahren.
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Bei der Gletschermumie Ötzi fand man noch etwa die Hälfte des C-14. Damit ist rund eine Halbwertszeit vergangen – er lebte vor etwa 5 300 Jahren.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die C-14-Methode" footer="Halbwertszeit von C-14: 5 730 Jahre">
      Lebewesen nehmen ständig C-14 auf. Nach dem Tod
      <br />
      zerfällt es ohne Nachschub. Aus dem Rest berechnet
      <br />
      man, wie lange der Tod her ist.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🦴', 'Archäologie', 'Knochen & Funde datieren'],
    ['🖼️', 'Kunst', 'Fälschungen erkennen'],
    ['🌲', 'Klimaforschung', 'alte Hölzer untersuchen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Datieren mit Radioaktivität" />
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
      <Caption delay={40}>Mit C-14 datiert man bis etwa 50 000 Jahre. Für ältere Funde oder Gestein nutzt man Isotope mit längerer Halbwertszeit.</Caption>
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
  { id: 'lebend', C: LebendScene, min: 250 },
  { id: 'tod', C: TodScene, min: 250 },
  { id: 'messen', C: MessenScene, min: 250 },
  { id: 'beispiel', C: BeispielScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const C14_METHODE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const C14Methode: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={C14_METHODE_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/c14-methode/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
