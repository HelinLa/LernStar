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
import timings from '../narration/wetter-klima.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Deterministische Jahres-Temperaturabweichung: Trend + Zappeln
const NYEARS = 60; // 1960..2020
const trendAt = (i: number) => -0.4 + (i / NYEARS) * 1.6; // steigt
const noiseAt = (i: number) => 0.35 * Math.sin(i * 2.3) + 0.22 * Math.cos(i * 5.1) + 0.15 * Math.sin(i * 1.1 + 2);
const tempAt = (i: number) => trendAt(i) + noiseAt(i);

const CX = 320, CW = 1300, CY = 720, CH = 420;
const px = (i: number) => CX + (i / NYEARS) * CW;
const py = (v: number) => CY - CH / 2 - v * (CH / 3);

const ClimateChart: React.FC<{ showNoise?: boolean; showTrend?: boolean; reveal?: number }> = ({ showNoise = true, showTrend = false, reveal = 1 }) => {
  const nShow = Math.round(reveal * NYEARS);
  const noisePts = Array.from({ length: nShow + 1 }, (_, i) => `${px(i).toFixed(1)},${py(tempAt(i)).toFixed(1)}`);
  const trendPts = Array.from({ length: nShow + 1 }, (_, i) => `${px(i).toFixed(1)},${py(trendAt(i)).toFixed(1)}`);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* Nulllinie */}
      <line x1={CX} y1={py(0)} x2={CX + CW} y2={py(0)} stroke={COLORS.border} strokeWidth={2} strokeDasharray="6 8" />
      {/* Achsen */}
      <line x1={CX} y1={CY - CH} x2={CX} y2={CY} stroke={COLORS.border} strokeWidth={3} />
      <line x1={CX} y1={CY} x2={CX + CW} y2={CY} stroke={COLORS.border} strokeWidth={3} />
      {[1960, 1980, 2000, 2020].map((yr, k) => (
        <text key={yr} x={px((k * 20))} y={CY + 40} fontSize={24} fontWeight={700} fill={COLORS.muted} textAnchor="middle">{yr}</text>
      ))}
      <text x={CX - 20} y={py(1.2)} fontSize={22} fontWeight={800} fill={COLORS.muted} textAnchor="end">wärmer</text>
      <text x={CX - 20} y={py(-0.6)} fontSize={22} fontWeight={800} fill={COLORS.muted} textAnchor="end">kälter</text>
      {showNoise && <polyline points={noisePts.join(' ')} fill="none" stroke={COLORS.sky} strokeWidth={3} opacity={0.85} />}
      {showTrend && <polyline points={trendPts.join(' ')} fill="none" stroke={COLORS.red} strokeWidth={8} strokeLinecap="round" />}
      {showNoise && <text x={px(nShow) + 10} y={py(tempAt(nShow))} fontSize={24} fontWeight={800} fill={COLORS.sky}>Wetter</text>}
      {showTrend && <text x={px(NYEARS) - 10} y={py(trendAt(NYEARS)) - 20} fontSize={26} fontWeight={900} fill={COLORS.red} textAnchor="end">Klimatrend ↑</text>}
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
      <div style={{ fontSize: 120, display: 'flex', gap: 40 }}>
        <span>🌦️</span>
        <span>📈</span>
      </div>
      <StarLogo size={70} />
      <div style={{ marginTop: 18, fontSize: 58, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Ändert sich das Klima wirklich?
      </div>
      <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Wetter oder Klima?
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Beobachten" title="Ein Tag sagt wenig aus" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 20 }}>
        {[['❄️', 'kalter Tag'], ['☀️', 'heißer Tag'], ['🌧️', 'Regensommer']].map((c, i) => (
          <div key={i} style={{ width: 380, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 26, fontSize: 30, fontWeight: 800, color: COLORS.sky, opacity: f }}>= Wetter · schwankt ständig</div>
      <Caption delay={40}>Aus einem kalten Tag folgt nichts über das Klima.</Caption>
    </AbsoluteFill>
  );
};

const UnterschiedScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Unterschied" title="Wetter ≠ Klima" />
      <div style={{ display: 'flex', gap: 50, opacity: f, marginTop: 20 }}>
        <div style={{ width: 540, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>🌦️</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, color: COLORS.sky }}>Wetter</div>
          <div style={{ fontSize: 25, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>jetzt / heute · kurzfristig · wechselhaft</div>
        </div>
        <div style={{ width: 540, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>📊</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, color: COLORS.red }}>Klima</div>
          <div style={{ fontSize: 25, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>über ~30 Jahre gemittelt</div>
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Erst über viele Jahre erkennt man den Trend.</Caption>
    </AbsoluteFill>
  );
};

const DiagrammScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [20, dur - 60], [0.05, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const showTrend = frame > (dur * 0.55);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Über Jahrzehnte" title="Zappeln + steigende Mittellinie" />
      <ClimateChart reveal={reveal} showTrend={showTrend} />
      <Caption delay={30}>Die Kurve zappelt – die Mittellinie zeigt nach oben.</Caption>
    </AbsoluteFill>
  );
};

const TrendScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Der Trend" title="Schwankung vs. Erwärmung" />
    <ClimateChart showTrend reveal={1} />
    <div style={{ position: 'absolute', left: 320, top: 250, fontSize: 26, fontWeight: 800, color: COLORS.sky }}>🔵 kurzfristig = Wetter</div>
    <div style={{ position: 'absolute', left: 320, top: 300, fontSize: 26, fontWeight: 800, color: COLORS.red }}>🔴 langfristig = Klima (steigt)</div>
    <Caption delay={30}>Einzelne kalte Jahre ändern den Trend nicht.</Caption>
  </AbsoluteFill>
);

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Wetter oder Klima?" footer="Trend über Jahrzehnte zeigt Erwärmung">
      Wetter ist kurzfristig und schwankt.
      <br />
      Klima ist das über lange Zeit
      <br />
      gemittelte Wetter.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏔️', 'Gletscher schmelzen'],
    ['🥵', 'mehr Hitzesommer'],
    ['📈', 'Klimadiagramme steigen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Zeichen des Klimawandels" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 400, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Über Jahrzehnte zeigt alles in dieselbe Richtung.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 230 },
  { id: 'unterschied', C: UnterschiedScene, min: 250 },
  { id: 'diagramm', C: DiagrammScene, min: 300 },
  { id: 'trend', C: TrendScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const WETTER_KLIMA_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const WetterKlima: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={WETTER_KLIMA_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/wetter-klima/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
