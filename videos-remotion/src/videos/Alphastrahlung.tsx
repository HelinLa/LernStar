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
import { Nucleus } from '../nuclear';
import timings from '../narration/alphastrahlung.timings.json';

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
      <div style={{ fontSize: 130, fontWeight: 900, color: COLORS.amber }}>α</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Was ist Alphastrahlung?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Ein Heliumkern verlässt den Atomkern
      </div>
    </AbsoluteFill>
  );
};

const WasIstScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const emit = frame > 55;
  const ax = emit ? interpolate(frame, [55, 130], [640, 1350], { extrapolateRight: 'clamp' }) : 640;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Was ist das?" title="Zwei Protonen und zwei Neutronen" />
      <Nucleus cx={500} cy={540} protons={emit ? 16 : 18} neutrons={emit ? 22 : 24} r={emit ? 140 : 150} jiggle={emit ? 2 : 6} frame={frame} />
      {emit && <Nucleus cx={ax} cy={540} protons={2} neutrons={2} r={42} />}
      {emit && <div style={{ position: 'absolute', left: ax - 70, top: 440, fontSize: 30, fontWeight: 900, color: COLORS.amber }}>α-Teilchen</div>}
      <div style={{ position: 'absolute', left: 1180, top: 470, width: 660, fontSize: 24, fontWeight: 800 }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>Ein Alphateilchen besteht aus 2 Protonen und 2 Neutronen – das ist genau ein Heliumkern. Es ist positiv geladen und relativ schwer.</div>
      </div>
      <Sfx sound="impact" at={55} volume={0.4} />
      <Caption delay={30}>Bei der Alphastrahlung schleudert ein schwerer Kern ein Paket aus zwei Protonen und zwei Neutronen heraus – einen Heliumkern.</Caption>
    </AbsoluteFill>
  );
};

const ZerfallScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Was mit dem Kern passiert" title="Ordnungszahl −2, Massenzahl −4" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 30, fontSize: 34, fontWeight: 900 }}>
        <div style={{ padding: '20px 26px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
          <div style={{ fontSize: 26, color: COLORS.muted }}>vorher</div>
          Radium-226<br /><span style={{ fontSize: 24, color: COLORS.muted }}>88 Protonen</span>
        </div>
        <div style={{ fontSize: 46, color: COLORS.amber }}>→</div>
        <div style={{ padding: '20px 26px', borderRadius: 16, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
          <div style={{ fontSize: 26, color: COLORS.muted }}>nachher</div>
          Radon-222<br /><span style={{ fontSize: 24, color: COLORS.muted }}>86 Protonen</span>
        </div>
        <div style={{ fontSize: 34, color: COLORS.muted }}>+</div>
        <div style={{ padding: '20px 26px', borderRadius: 16, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          α<br /><span style={{ fontSize: 24, color: COLORS.muted }}>Helium-4</span>
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: 26, fontWeight: 800, color: COLORS.muted, opacity: f }}>Es entsteht ein neues Element – zwei Plätze weiter unten im Periodensystem.</div>
      <Caption delay={30}>Der Kern verliert dabei zwei Protonen und zwei Neutronen. Die Ordnungszahl sinkt um 2, die Massenzahl um 4 – es entsteht ein neues Element.</Caption>
    </AbsoluteFill>
  );
};

const ReichweiteScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const ax = interpolate(frame, [20, 70], [360, 700], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Reichweite" title="Schon ein Blatt Papier stoppt sie" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <text x={300} y={540} fontSize={70}>☢️</text>
        <line x1={360} y1={540} x2={ax} y2={540} stroke={COLORS.amber} strokeWidth={8} />
        <circle cx={ax} cy={540} r={16} fill={COLORS.amber} />
        {/* Papier */}
        <rect x={720} y={420} width={20} height={240} fill="#e2e8f0" />
        <text x={730} y={700} fontSize={24} fontWeight="800" fill={COLORS.muted} textAnchor="middle">Papier</text>
        <text x={860} y={545} fontSize={30} fill={COLORS.red}>🛑 gestoppt</text>
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 460, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}` }}>Weil α-Teilchen groß und geladen sind, kommen sie nur wenige Zentimeter weit in der Luft. Schon ein Blatt Papier oder die Haut hält sie auf.</div>
      </div>
      <Caption delay={30}>Alphateilchen sind groß und schwer. Deshalb haben sie nur eine sehr kurze Reichweite – ein Blatt Papier oder die Haut stoppt sie bereits.</Caption>
    </AbsoluteFill>
  );
};

const GefahrScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Vorsicht, Denkfehler" title="Von außen harmlos – von innen gefährlich" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>✋ Von außen</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Die Haut hält Alphastrahlung ab – von außen ist sie kaum gefährlich.</div>
        </div>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>🫁 Im Körper</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Eingeatmet oder verschluckt wirkt sie direkt in den Zellen – dort ist sie besonders schädlich.</div>
        </div>
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Ein wichtiger Denkfehler: Weil Papier reicht, hält man Alphastrahlung für harmlos. Gelangt der Stoff aber in den Körper, ist sie besonders gefährlich.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Alphastrahlung (α)" footer="Ordnungszahl −2, Massenzahl −4">
      Ein α-Teilchen ist ein Heliumkern (2 Protonen,
      <br />
      2 Neutronen). Kurze Reichweite – Papier stoppt sie,
      <br />
      aber im Körper ist sie sehr schädlich.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🔥', 'Rauchmelder', 'nutzt eine α-Quelle'],
    ['🪨', 'Radon im Keller', 'nicht einatmen'],
    ['🚀', 'Raumsonden', 'α-Zerfall als Wärmequelle'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Alphastrahlung im Alltag" />
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
      <Caption delay={40}>Als Nächstes: die Betastrahlung – sie kommt weiter als Alpha.</Caption>
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
  { id: 'wasist', C: WasIstScene, min: 250 },
  { id: 'zerfall', C: ZerfallScene, min: 250 },
  { id: 'reichweite', C: ReichweiteScene, min: 240 },
  { id: 'gefahr', C: GefahrScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ALPHASTRAHLUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Alphastrahlung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ALPHASTRAHLUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/alphastrahlung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
