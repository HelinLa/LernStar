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
import { useFade } from '../forces';
import timings from '../narration/regenerative-energie.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Windrad mit drehenden Flügeln
const WindTurbine: React.FC<{ x: number; y: number; s?: number; speed?: number }> = ({ x, y, s = 1, speed = 5 }) => {
  const frame = useCurrentFrame();
  const a = frame * speed;
  return (
    <svg width={220 * s} height={300 * s} viewBox="0 0 220 300" style={{ position: 'absolute', left: x, top: y }}>
      <rect x={104} y={110} width={12} height={180} fill={COLORS.muted} />
      <g transform={`rotate(${a} 110 110)`}>
        {[0, 120, 240].map((r) => (
          <rect key={r} x={106} y={30} width={8} height={82} rx={4} fill={COLORS.ink} transform={`rotate(${r} 110 110)`} />
        ))}
      </g>
      <circle cx={110} cy={110} r={12} fill={COLORS.sky} />
    </svg>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120, display: 'flex', gap: 44 }}>
        <span>☀️</span>
        <span>💨</span>
        <span>💧</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 60, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Strom ohne Verbrennen
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Regenerative Energien
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Strom aus Sonne, Wind und Wasser" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 20 }}>
        {[['☀️', 'Sonne → 🔆', 'Solarzelle'], ['💨', 'Wind → 🌀', 'Windrad'], ['💧', 'Wasser → ⚙️', 'Wasserrad']].map((c, i) => (
          <div key={i} style={{ width: 400, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 10 }}>{c[2]}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.amber, marginTop: 6 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Caption delay={40}>Überall entsteht Strom – ohne Feuer, ohne Abgase.</Caption>
    </AbsoluteFill>
  );
};

const PrinzipScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Das Prinzip" title="Energie frei Haus – kein CO₂" />
      <WindTurbine x={1360} y={360} s={1.2} speed={6} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, opacity: f, marginTop: 10, marginLeft: -300 }}>
        {[['☀️', 'Die Sonne strahlt'], ['💨', 'Der Wind weht'], ['💧', 'Das Wasser fließt']].map((c, i) => (
          <div key={i} style={{ padding: '18px 26px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.green}`, fontSize: 28, fontWeight: 800, width: 520 }}>{c[0]} {c[1]}</div>
        ))}
        <div style={{ padding: '18px 26px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 28, fontWeight: 900, color: COLORS.green, width: 520 }}>🚫🔥 kein Verbrennen → kein CO₂</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Wir müssen nichts verbrennen, um diese Energie zu nutzen.</Caption>
    </AbsoluteFill>
  );
};

const AusprobierenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const on = (frame % 160) > 55;
  const windSpeed = on ? 8 : 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ausprobieren" title="Quelle an – Strom da" />
      <div style={{ position: 'absolute', left: 300, top: 380, textAlign: 'center', width: 400 }}>
        <div style={{ fontSize: 120 }}>{on ? '☀️' : '☁️'}</div>
        <div style={{ marginTop: 10, fontSize: 30, fontWeight: 900, color: on ? COLORS.amber : COLORS.muted }}>{on ? 'Sonne scheint' : 'kein Licht'}</div>
        <div style={{ marginTop: 14, width: 300, height: 30, margin: '14px auto 0', borderRadius: 15, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ width: on ? '90%' : '0%', height: '100%', background: COLORS.green }} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.green, marginTop: 8 }}>Solar-Ertrag</div>
      </div>
      <WindTurbine x={1150} y={360} s={1.5} speed={windSpeed} />
      <div style={{ position: 'absolute', left: 1180, top: 730, width: 400, textAlign: 'center', fontSize: 30, fontWeight: 900, color: on ? COLORS.sky : COLORS.muted }}>{on ? '💨 Wind → dreht schnell' : '· kein Wind → steht'}</div>
      <Caption delay={30}>Ohne Quelle kein Strom – mit Quelle fließt er.</Caption>
    </AbsoluteFill>
  );
};

const RegenerativScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vergleichen" title="Verbraucht oder erneuerbar?" />
      <div style={{ display: 'flex', gap: 50, opacity: f, marginTop: 20 }}>
        <div style={{ width: 540, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 62 }}>⚫🛢️</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, color: COLORS.red }}>Fossil</div>
          <div style={{ fontSize: 25, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>wird verbraucht – irgendwann weg</div>
        </div>
        <div style={{ width: 540, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.green}`, textAlign: 'center' }}>
          <div style={{ fontSize: 62 }}>☀️💨💧</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, color: COLORS.green }}>Regenerativ</div>
          <div style={{ fontSize: 25, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>erneuert sich immer wieder</div>
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Morgen scheint die Sonne erneut, der Wind weht weiter.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Regenerative Energien" footer="Sonne · Wind · Wasser – ohne CO₂">
      Sonne, Wind und Wasser
      <br />
      erneuern sich laufend und
      <br />
      erzeugen Strom ohne Verbrennung.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏠', 'Solardach'],
    ['🌬️', 'Windpark'],
    ['🏞️', 'Wasserkraftwerk'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Erneuerbare in der Landschaft" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Überall Energie, die immer wieder nachkommt.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 240 },
  { id: 'prinzip', C: PrinzipScene, min: 240 },
  { id: 'ausprobieren', C: AusprobierenScene, min: 260 },
  { id: 'regenerativ', C: RegenerativScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const REGENERATIVE_ENERGIE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const RegenerativeEnergie: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={REGENERATIVE_ENERGIE_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/regenerative-energie/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
