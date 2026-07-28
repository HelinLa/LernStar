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
import { Wave } from '../induction';
import timings from '../narration/gleich-wechselstrom.timings.json';

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
      <div style={{ fontSize: 110, display: 'flex', gap: 24 }}>
        <span>🔋</span>
        <span style={{ fontSize: 70 }}>vs.</span>
        <span>🔌</span>
      </div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Gleichstrom oder Wechselstrom?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Wann braucht man was?
      </div>
    </AbsoluteFill>
  );
};

const GleichScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Gleichstrom (DC)" title="Immer gleich – für die Elektronik" />
      <Wave x0={140} y0={500} w={640} h={200} omega={0} amp={0.65} frame={frame} dc color={COLORS.amber} />
      <div style={{ position: 'absolute', left: 140, top: 620, fontSize: 25, fontWeight: 800, color: COLORS.muted, opacity: f }}>fließt immer in dieselbe Richtung</div>
      <div style={{ position: 'absolute', left: 980, top: 420, width: 780, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 25, fontWeight: 800, marginBottom: 12 }}>Batterie und Akku liefern Gleichstrom.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, fontSize: 25, fontWeight: 800 }}>📱 Handy, 💡 LED und alle Elektronik brauchen konstante Gleichspannung.</div>
      </div>
      <Caption delay={30}>Gleichstrom fließt immer in dieselbe Richtung. Batterien liefern ihn, und fast alle elektronischen Geräte brauchen ihn.</Caption>
    </AbsoluteFill>
  );
};

const WechselScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Wechselstrom (AC)" title="Wechselnd – fürs Stromnetz" />
      <Wave x0={140} y0={500} w={640} h={240} omega={0.13} amp={0.9} frame={frame} color={COLORS.green} />
      <div style={{ position: 'absolute', left: 140, top: 640, fontSize: 25, fontWeight: 800, color: COLORS.muted, opacity: f }}>wechselt ständig die Richtung</div>
      <div style={{ position: 'absolute', left: 980, top: 420, width: 780, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 25, fontWeight: 800, marginBottom: 12 }}>Generatoren liefern Wechselstrom.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 25, fontWeight: 800 }}>🔀 Sein Vorteil: Er lässt sich mit dem Transformator leicht umwandeln – perfekt für lange Leitungen.</div>
      </div>
      <Caption delay={30}>Wechselstrom kommt aus dem Netz. Sein großer Vorteil: Man kann seine Spannung mit einem Transformator leicht ändern.</Caption>
    </AbsoluteFill>
  );
};

const NetzteilScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Netzteil" title="Vom Netz-Wechselstrom zum Gleichstrom" />
      <Wave x0={160} y0={500} w={360} h={200} omega={0.16} amp={0.9} frame={frame} color={COLORS.green} />
      <div style={{ position: 'absolute', left: 200, top: 610, fontSize: 24, fontWeight: 800, color: COLORS.green, opacity: f }}>Wechselstrom</div>
      <div style={{ position: 'absolute', left: 700, top: 460, width: 240, height: 130, borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: f }}>
        <div style={{ fontSize: 54 }}>🔌</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Netzteil</div>
      </div>
      <div style={{ position: 'absolute', left: 560, top: 505, fontSize: 50 }}>➡️</div>
      <div style={{ position: 'absolute', left: 960, top: 505, fontSize: 50 }}>➡️</div>
      <Wave x0={1060} y0={500} w={360} h={140} omega={0} amp={0.55} frame={frame} dc color={COLORS.amber} />
      <div style={{ position: 'absolute', left: 1120, top: 610, fontSize: 24, fontWeight: 800, color: COLORS.amber, opacity: f }}>Gleichstrom</div>
      <div style={{ position: 'absolute', left: 1470, top: 470, fontSize: 90, opacity: f }}>📱</div>
      <Caption delay={30}>Ein Ladegerät oder Netzteil wandelt den Wechselstrom aus der Steckdose in Gleichstrom für Handy und Laptop um.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Gleich- und Wechselstrom" footer="Netzteil wandelt Wechsel- in Gleichstrom um">
      Gleichstrom (Batterie) für Elektronik,
      <br />
      Wechselstrom (Netz) zum leichten Umwandeln.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔋', 'Gleichstrom', 'Handy, LED, USB, Auto'],
    ['🔌', 'Wechselstrom', 'Steckdose, Stromnetz'],
    ['⚡', 'Umwandeln', 'Netzteil & Wechselrichter'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Beide gehören zusammen" />
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
      <Caption delay={40}>Solaranlagen liefern übrigens Gleichstrom – ein Wechselrichter macht daraus netztauglichen Wechselstrom.</Caption>
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
  { id: 'gleich', C: GleichScene, min: 250 },
  { id: 'wechsel', C: WechselScene, min: 250 },
  { id: 'netzteil', C: NetzteilScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const GLEICH_WECHSELSTROM_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const GleichWechselstrom: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={GLEICH_WECHSELSTROM_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/gleich-wechselstrom/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
