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
import timings from '../narration/medizin-strahlung.timings.json';

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
      <div style={{ fontSize: 120 }}>🏥☢️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie hilft Strahlung in der Medizin?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Diagnose, Therapie und mehr
      </div>
    </AbsoluteFill>
  );
};

const DiagnostikScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const glow = 0.4 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Diagnose" title="Ein Marker zeigt, was im Körper passiert" />
      <div style={{ position: 'absolute', left: 380, top: 420, fontSize: 200 }}>🧍</div>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <circle cx={470} cy={560} r={40} fill={`rgba(34,197,94,${0.4 + glow})`} />
        {[0, 45, 90, 135].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return <line key={i} x1={470} y1={560} x2={470 + 90 * Math.cos(rad)} y2={560 + 90 * Math.sin(rad)} stroke={COLORS.green} strokeWidth={3} opacity={glow} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: 900, top: 440, width: 300, height: 220, borderRadius: 14, background: '#0b1220', border: `2px solid ${COLORS.sky}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.green}, transparent)`, opacity: 0.6 + glow * 0.4 }} />
      </div>
      <div style={{ position: 'absolute', left: 940, top: 680, fontSize: 22, fontWeight: 800, color: COLORS.sky }}>Gammakamera</div>
      <div style={{ position: 'absolute', left: 1280, top: 440, width: 540, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.green}` }}>Man spritzt einen schwach strahlenden Marker. Er sammelt sich im Organ und sendet Gammastrahlung aus, die eine Kamera von außen als Bild aufnimmt.</div>
      </div>
      <Caption delay={30}>Für die Diagnose spritzt man einen schwach radioaktiven Marker. Er reichert sich im Organ an, und eine Gammakamera macht seine Strahlung als Bild sichtbar.</Caption>
    </AbsoluteFill>
  );
};

const TherapieScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const cx = 620;
  const cy = 560;
  const on = frame > 30;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Therapie" title="Gezielte Strahlung zerstört Tumorzellen" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <ellipse cx={cx} cy={cy} rx={220} ry={260} fill="rgba(56,189,248,0.06)" stroke={COLORS.sky} strokeWidth={3} />
        {/* Tumor */}
        <circle cx={cx} cy={cy} r={34} fill={on ? `rgba(239,68,68,${1 - interpolate(frame, [60, 160], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` : COLORS.red} />
        {/* Strahlen aus mehreren Richtungen */}
        {on && [200, 260, 320, 20, 80, 140].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return <line key={i} x1={cx + 360 * Math.cos(rad)} y1={cy + 360 * Math.sin(rad)} x2={cx} y2={cy} stroke={COLORS.amber} strokeWidth={4} opacity={0.7} strokeDasharray="8 6" />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 440, width: 640, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, marginBottom: 12 }}>Ein starker Strahl trifft den Tumor aus vielen Richtungen. Nur im Kreuzungspunkt ist die Dosis hoch genug, um die kranken Zellen zu zerstören.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}` }}>Das gesunde Gewebe drumherum wird dabei geschont.</div>
      </div>
      <Sfx sound="pop" at={30} volume={0.3} />
      <Caption delay={30}>Bei der Strahlentherapie richtet man einen starken Strahl aus vielen Richtungen genau auf den Tumor. Nur dort ist die Dosis hoch – das gesunde Gewebe wird geschont.</Caption>
    </AbsoluteFill>
  );
};

const SterilisationScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const items = [
    ['🩹', 'Sterilisieren', 'Instrumente keimfrei machen'],
    ['🧪', 'Verlaufskontrolle', 'Stoffwechsel verfolgen'],
    ['🦴', 'Knochendichte', 'mit schwacher Strahlung'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Und mehr" title="Strahlung als Werkzeug" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Mit Gammastrahlung macht man auch Operationsbesteck keimfrei, und mit schwach strahlenden Stoffen verfolgt man Vorgänge im Körper.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Strahlung in der Medizin" footer="in der Therapie gezielt, in der Diagnose schwach dosiert">
      Strahlung hilft in der Medizin doppelt: Zur Diagnose
      <br />
      macht ein Marker Vorgänge sichtbar, zur Therapie
      <br />
      zerstört gezielte Strahlung Tumorzellen.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🧠', 'PET / Szintigrafie', 'Organe sichtbar machen'],
    ['🎯', 'Strahlentherapie', 'gegen Krebs'],
    ['💊', 'Nuklearmedizin', 'eigenes Fachgebiet'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Ein ganzes medizinisches Fachgebiet" />
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
      <Caption delay={40}>Richtig eingesetzt rettet Strahlung Leben – die Dosis wird dabei genau kontrolliert.</Caption>
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
  { id: 'diagnostik', C: DiagnostikScene, min: 260 },
  { id: 'therapie', C: TherapieScene, min: 260 },
  { id: 'sterilisation', C: SterilisationScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MEDIZIN_STRAHLUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const MedizinStrahlung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MEDIZIN_STRAHLUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/medizin-strahlung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
