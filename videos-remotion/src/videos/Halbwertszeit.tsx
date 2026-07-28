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
import timings from '../narration/halbwertszeit.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Raster aus 16 Kernen; `active` davon strahlen noch (rot), Rest zerfallen (grau).
const Grid: React.FC<{ x: number; y: number; active: number; op?: number }> = ({ x, y, active, op = 1 }) => {
  const dots = [];
  for (let i = 0; i < 16; i++) {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const on = i < active;
    dots.push(<circle key={i} cx={x + c * 46} cy={y + r * 46} r={17} fill={on ? COLORS.red : '#334155'} opacity={on ? 1 : 0.5} />);
  }
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: op }} viewBox="0 0 1920 1080">
      {dots}
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
      <div style={{ fontSize: 110 }}>⏳</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 52, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center', maxWidth: 1500 }}>
        Warum kann man einen Zerfall nie genau vorhersagen – und trotzdem berechnen?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Halbwertszeit
      </div>
    </AbsoluteFill>
  );
};

const EinzelnScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Zufall" title="Ein einzelner Kern ist unvorhersehbar" />
      <div style={{ display: 'flex', gap: 50, opacity: f, marginTop: 30 }}>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>🍿 Ein Kern</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Wann er zerfällt, ist reiner Zufall – vielleicht gleich, vielleicht in tausend Jahren. Niemand kann es vorhersagen.</div>
        </div>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>🍿🍿🍿 Viele Kerne</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Wie beim Popcorn: Man weiß nicht, welches Korn wann aufplatzt – aber wie lange es dauert, bis die Hälfte fertig ist, schon.</div>
        </div>
      </div>
      <Caption delay={30}>Ob ein einzelner Kern gleich oder erst in tausend Jahren zerfällt, ist reiner Zufall. Aber bei sehr vielen Kernen wird der Zufall berechenbar.</Caption>
    </AbsoluteFill>
  );
};

const HalbierenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const step = Math.min(3, Math.floor(interpolate(frame, [20, 150], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const counts = [16, 8, 4, 2];
  const labels = ['Start', 'nach 1 T', 'nach 2 T', 'nach 3 T'];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Halbieren" title="Nach jeder Halbwertszeit bleibt die Hälfte" />
      {[0, 1, 2, 3].map((s) => (
        <Grid key={s} x={175 + s * 430} y={360} active={counts[s]} op={s <= step ? 1 : 0.18} />
      ))}
      {[0, 1, 2, 3].map((s) => (
        <div key={s} style={{ position: 'absolute', left: 175 + s * 430 - 46, top: 590, width: 250, textAlign: 'center', opacity: s <= step ? 1 : 0.18 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: s === 0 ? COLORS.ink : COLORS.amber }}>{labels[s]}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.muted }}>{counts[s]} übrig</div>
        </div>
      ))}
      <Sfx sound="pop" at={20} volume={0.3} />
      <Caption delay={30}>Nach einer Halbwertszeit ist die Hälfte der Kerne zerfallen. Nach der zweiten wieder die Hälfte davon – also ein Viertel. Nach der dritten ein Achtel.</Caption>
    </AbsoluteFill>
  );
};

const KurveScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const x0 = 260;
  const y0 = 760;
  const w = 1100;
  const h = 420;
  const prog = interpolate(frame, [15, 110], [0, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pts: string[] = [];
  for (let tt = 0; tt <= Math.min(prog, 3); tt += 0.05) {
    const px = x0 + (tt / 3) * w;
    const py = y0 - Math.pow(0.5, tt) * h;
    pts.push(`${px},${py}`);
  }
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Kurve" title="Immer die Hälfte – nie ganz null" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: f }} viewBox="0 0 1920 1080">
        <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={COLORS.border} strokeWidth={2} />
        <line x1={x0} y1={y0} x2={x0} y2={y0 - h - 20} stroke={COLORS.border} strokeWidth={2} />
        {[1, 2, 3].map((k) => (
          <g key={k}>
            <line x1={x0 + (k / 3) * w} y1={y0} x2={x0 + (k / 3) * w} y2={y0 - Math.pow(0.5, k) * h} stroke={COLORS.muted} strokeWidth={1.5} strokeDasharray="6 6" />
            <line x1={x0} y1={y0 - Math.pow(0.5, k) * h} x2={x0 + (k / 3) * w} y2={y0 - Math.pow(0.5, k) * h} stroke={COLORS.muted} strokeWidth={1.5} strokeDasharray="6 6" />
            <text x={x0 + (k / 3) * w} y={y0 + 34} fontSize={22} fill={COLORS.amber} textAnchor="middle" fontWeight="800">{k}·T</text>
            <text x={x0 - 16} y={y0 - Math.pow(0.5, k) * h + 8} fontSize={22} fill={COLORS.sky} textAnchor="end" fontWeight="800">{k === 1 ? '50%' : k === 2 ? '25%' : '12,5%'}</text>
          </g>
        ))}
        <text x={x0 - 16} y={y0 - h + 8} fontSize={22} fill={COLORS.ink} textAnchor="end" fontWeight="800">100%</text>
        <polyline points={pts.join(' ')} fill="none" stroke={COLORS.red} strokeWidth={5} />
      </svg>
      <Caption delay={30}>Trägt man die Anzahl über die Zeit auf, entsteht eine fallende Kurve. Sie halbiert sich immer wieder und nähert sich der Null, erreicht sie aber nie ganz.</Caption>
    </AbsoluteFill>
  );
};

const RechnenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const step = Math.min(3, Math.floor(interpolate(frame, [20, 150], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const items = [
    ['Start', '800'],
    ['nach 4 Tagen', '400'],
    ['nach 8 Tagen', '200'],
    ['nach 12 Tagen', '100'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Rechnen" title="Beispiel: T = 4 Tage, 800 Kerne" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 40 }}>
        {items.map((c, i) => (
          <React.Fragment key={i}>
            <div style={{ width: 240, padding: '22px 14px', borderRadius: 16, background: i <= step ? COLORS.panel : 'transparent', border: `2px solid ${i <= step ? COLORS.amber : COLORS.border}`, textAlign: 'center', opacity: i <= step ? 1 : 0.3 }}>
              <div style={{ fontSize: 46, fontWeight: 900, color: COLORS.amber }}>{c[1]}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.muted }}>{c[0]}</div>
            </div>
            {i < 3 && <div style={{ fontSize: 28, color: COLORS.sky, opacity: i < step ? 1 : 0.2 }}>÷2</div>}
          </React.Fragment>
        ))}
      </div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={30}>Ein Beispiel: 800 Kerne, Halbwertszeit 4 Tage. Nach 4 Tagen sind es 400, nach 8 Tagen 200, nach 12 Tagen 100. Zwölf Tage sind genau drei Halbwertszeiten.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Halbwertszeit" footer="jede Halbwertszeit → die Hälfte bleibt übrig">
      Nach einer Halbwertszeit ist die Hälfte der Kerne
      <br />
      zerfallen. Der einzelne Kern ist Zufall, die Menge
      <br />
      folgt einer festen Regel.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🌳', 'C-14', '5 730 Jahre'],
    ['🏥', 'Technetium-99m', '6 Stunden'],
    ['☢️', 'Uran-238', '4,5 Mrd. Jahre'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Jeder Stoff hat seine eigene" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.amber, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Die Halbwertszeit reicht von Sekundenbruchteilen bis zu Milliarden Jahren – und genau das nutzt die Altersbestimmung.</Caption>
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
  { id: 'einzeln', C: EinzelnScene, min: 250 },
  { id: 'halbieren', C: HalbierenScene, min: 250 },
  { id: 'kurve', C: KurveScene, min: 240 },
  { id: 'rechnen', C: RechnenScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const HALBWERTSZEIT_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Halbwertszeit: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={HALBWERTSZEIT_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/halbwertszeit/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
