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
import timings from '../narration/achterbahn.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// --- Bahn-Geometrie ---
const X0 = 200;
const X1 = 1720;
const BASE = 880; // Boden-Linie
const HMAX = 360;

// Höhe über Boden bei Parameter u in [0,1] (skaliert mit peak: Faktor der Starthöhe)
const heightU = (u: number, peak = 1) =>
  HMAX * peak * (1 - u) * (0.55 + 0.45 * Math.cos(u * 2 * Math.PI * 1.5));
const trackX = (u: number) => X0 + (X1 - X0) * u;
const trackY = (u: number, peak = 1) => BASE - heightU(u, peak);

// Geschwindigkeit ~ sqrt(Höhenverlust) → langsam oben, schnell unten
const speedU = (u: number, peak = 1) =>
  Math.sqrt(Math.max(0.05, (heightU(0, peak) - heightU(u, peak)) / HMAX));

// Vorab: Zeit-Tabelle t(u) durch Aufsummieren von du/v (deterministisch, kein Random)
function buildTimeTable(peak = 1, N = 260) {
  const us: number[] = [];
  const ts: number[] = [];
  let t = 0;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    us.push(u);
    ts.push(t);
    const v = speedU(u, peak);
    t += 1 / N / v;
  }
  return { us, ts, total: t };
}
const TABLE = buildTimeTable(1);
const TABLE_LOW = buildTimeTable(0.6);

// u zum Zeitpunkt frame (eine Fahrt über die scene-Dauer)
function uAt(frame: number, total: number, table = TABLE, ridePortion = 0.9) {
  const target = (Math.min(1, frame / (total * ridePortion))) * table.total;
  // lineare Suche in ts
  let i = 0;
  while (i < table.ts.length - 1 && table.ts[i + 1] < target) i++;
  const t0 = table.ts[i], t1 = table.ts[i + 1] ?? t0;
  const f = t1 > t0 ? (target - t0) / (t1 - t0) : 0;
  return table.us[i] + (table.us[i + 1] - table.us[i]) * f;
}

// Bahn als Polyline-Punkte
function trackPoints(peak = 1, N = 120) {
  let d = `M ${trackX(0)} ${trackY(0, peak)}`;
  for (let i = 1; i <= N; i++) {
    const u = i / N;
    d += ` L ${trackX(u).toFixed(1)} ${trackY(u, peak).toFixed(1)}`;
  }
  return d;
}

const Track: React.FC<{ peak?: number; color?: string }> = ({ peak = 1, color = COLORS.border }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
    {/* Stützen */}
    {Array.from({ length: 13 }, (_, i) => {
      const u = i / 12;
      return <line key={i} x1={trackX(u)} y1={trackY(u, peak)} x2={trackX(u)} y2={BASE + 20} stroke="rgba(255,255,255,0.08)" strokeWidth={4} />;
    })}
    <line x1={X0 - 40} y1={BASE + 20} x2={X1 + 40} y2={BASE + 20} stroke={COLORS.ground} strokeWidth={6} />
    <path d={trackPoints(peak)} fill="none" stroke={color} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
    <path d={trackPoints(peak)} fill="none" stroke={COLORS.indigo} strokeWidth={3} strokeLinejoin="round" opacity={0.5} />
  </svg>
);

const Cart: React.FC<{ u: number; peak?: number }> = ({ u, peak = 1 }) => {
  const x = trackX(u);
  const y = trackY(u, peak);
  // Neigung aus Nachbarpunkten
  const du = 0.01;
  const dx = trackX(Math.min(1, u + du)) - trackX(Math.max(0, u - du));
  const dy = trackY(Math.min(1, u + du), peak) - trackY(Math.max(0, u - du), peak);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div style={{ position: 'absolute', left: x - 46, top: y - 66, transform: `rotate(${ang}deg)`, transformOrigin: '50% 80%', fontSize: 74 }}>
      🎢
    </div>
  );
};

const EnergyMini: React.FC<{ frac: number; color: string; label: string }> = ({ frac, color, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ position: 'relative', width: 56, height: 190, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: `2px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: `${frac * 100}%`, background: color }} />
    </div>
    <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800, color }}>{label}</div>
  </div>
);

const Intro: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const u = uAt(frame, dur);
  return (
    <AbsoluteFill>
      <Track />
      <Cart u={u} />
      <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 70 }}>
        <StarLogo size={64} />
        <div style={{ marginTop: 16, fontSize: 66, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
          Oben langsam, unten schnell
        </div>
        <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: t }}>
          Achterbahn: Höhe wird zu Tempo
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const u = uAt(frame, dur);
  const v = speedU(u);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Wo ist der Wagen am schnellsten?" />
      <Track />
      <Cart u={u} />
      {/* Tempo-Anzeige */}
      <div style={{ position: 'absolute', left: 120, top: 250, width: 260, padding: '18px 20px', borderRadius: 16, background: COLORS.panelSolid, border: `2px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Tempo</div>
        <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ width: `${v * 100}%`, height: '100%', background: COLORS.amber }} />
        </div>
      </div>
      <Caption delay={30}>Am höchsten Punkt langsam, im Tal am schnellsten.</Caption>
    </AbsoluteFill>
  );
};

const UmwandlungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const u = uAt(frame, dur);
  const pot = heightU(u) / heightU(0); // 1 oben, 0 unten
  const kin = 1 - pot;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Umwandlung" title="Lageenergie ↔ Bewegungsenergie" />
      <Track />
      <Cart u={u} />
      <div style={{ position: 'absolute', left: 120, top: 250, display: 'flex', gap: 26, opacity: f }}>
        <EnergyMini frac={pot} color={COLORS.sky} label="Lage" />
        <EnergyMini frac={kin} color={COLORS.amber} label="Bewegung" />
        <EnergyMini frac={1} color={COLORS.green} label="Summe" />
      </div>
      <Caption delay={30}>Bergab wird Lageenergie zu Bewegungsenergie – bergauf zurück.</Caption>
    </AbsoluteFill>
  );
};

const StarthoeheScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ausprobieren" title="Höherer Start – mehr Tempo im Tal" />
      <div style={{ position: 'absolute', top: 300, width: 1920, display: 'flex', justifyContent: 'center', gap: 80, opacity: f }}>
        {[
          { peak: 1, label: 'Hoher Start', v: 'schnell im Tal', c: COLORS.green },
          { peak: 0.6, label: 'Niedriger Start', v: 'langsamer im Tal', c: COLORS.amber },
        ].map((s, i) => (
          <div key={i} style={{ width: 640, padding: '24px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <svg width={600} height={300} viewBox="180 480 1560 440" style={{ width: '100%' }}>
              <path d={trackPoints(s.peak)} fill="none" stroke={COLORS.indigo} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={trackX(0)} cy={trackY(0, s.peak)} r={22} fill={s.c} stroke={COLORS.ink} strokeWidth={4} />
            </svg>
            <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>{s.label}</div>
            <div style={{ fontSize: 25, fontWeight: 700, color: s.c, marginTop: 6 }}>{s.v}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.3} />
      <Caption delay={40}>Der erste Berg ist immer der höchste – dort holt sich der Wagen die Energie.</Caption>
    </AbsoluteFill>
  );
};

const ErhaltungScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Regel" title="Nie höher als der Start" />
      <div style={{ opacity: f, marginTop: 20 }}>
        <svg width={1200} height={420} viewBox="200 480 1520 420">
          <path d={trackPoints(1)} fill="none" stroke={COLORS.indigo} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
          <line x1={X0} y1={trackY(0)} x2={X1} y2={trackY(0)} stroke={COLORS.red} strokeWidth={4} strokeDasharray="14 12" />
          <circle cx={trackX(0)} cy={trackY(0)} r={22} fill={COLORS.green} stroke={COLORS.ink} strokeWidth={4} />
        </svg>
      </div>
      <div style={{ marginTop: 10, fontSize: 34, fontWeight: 800, color: COLORS.ink, opacity: f }}>
        Lageenergie + Bewegungsenergie = <span style={{ color: COLORS.green }}>konstant</span>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Die Summe bleibt gleich – kein Berg wird höher als der Start.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Achterbahn & Energie" footer="Summe aus Lage + Bewegung bleibt gleich">
      Höhe wird in Tempo umgewandelt.
      <br />
      Oben: viel Lageenergie, wenig Tempo.
      <br />
      Unten: wenig Höhe, viel Bewegungsenergie.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🎢', 'Achterbahn'],
    ['⛷️', 'Skisprung'],
    ['🛹', 'Halfpipe'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Überall Höhe ↔ Tempo" />
      <div style={{ display: 'flex', gap: 44, opacity: f }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 360, padding: '32px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 92 }}>{c[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Höhe wird zu Tempo und Tempo wieder zu Höhe.</Caption>
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
  { id: 'umwandlung', C: UmwandlungScene, min: 260 },
  { id: 'starthoehe', C: StarthoeheScene, min: 240 },
  { id: 'erhaltung', C: ErhaltungScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 200 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ACHTERBAHN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Achterbahn: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ACHTERBAHN_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/achterbahn/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
