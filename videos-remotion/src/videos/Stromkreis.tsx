import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import {
  PaperBg,
  PaperTitle,
  PaperCaption,
  PaperMerksatz,
  PaperLogo,
  Avatar,
  useReveal,
  layoutBeats,
  BeatAudio,
  PAPER,
  type BeatInfo,
} from '../paper';
import { PaperWire, PaperLamp, PaperBattery, PaperSwitch } from '../papercircuit';
import { BackgroundMusic, Sfx } from '../components';
import timings from '../narration/stromkreis.timings.json';

const T = timings as Record<string, number>;
const BASE = 'stromkreis';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const TR = 16;

type SP = { beats: BeatInfo[]; dur: number };

// Haupt-Stromkreis (Rechteck-Loop). Batterie unten Mitte = Quelle.
const LX = 560, RX = 1360, TY = 360, BY = 760;
const L_ONE: [number, number] = [960, TY];
const L2A: [number, number] = [790, TY];
const L2B: [number, number] = [1130, TY];

const CircuitFrame: React.FC<{ on?: boolean; count?: number; children?: React.ReactNode; quelle?: boolean }> = ({
  on = true, count = 15, children, quelle = true,
}) => (
  <>
    <PaperWire LX={LX} RX={RX} TY={TY} BY={BY} on={on} count={count} gapBottom={132} />
    <PaperBattery x={960} y={BY} label={quelle ? 'Quelle (Batterie)' : undefined} />
    {children}
  </>
);

// ── kleine Bausteine ────────────────────────────────────────────────────
// Mini-Stromkreis (eigene lokale Koordinaten) für Vergleich/Denkblase.
const onLoc = (s: number, w: number, h: number): [number, number] => {
  const per = 2 * (w + h);
  let d = (((s % 1) + 1) % 1) * per;
  if (d < w) return [d, 0];
  d -= w; if (d < h) return [w, d];
  d -= h; if (d < w) return [w - d, h];
  d -= w; return [0, h - d];
};
const MiniCircuit: React.FC<{ x: number; y: number; brightness?: number; on?: boolean; consume?: boolean }> = ({
  x, y, brightness = 1, on = true, consume = false,
}) => {
  const frame = useCurrentFrame();
  const W = 300, H = 176;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: W, height: H }}>
      <svg viewBox={`-20 -20 ${W + 40} ${H + 60}`} style={{ width: W + 40, height: H + 60, overflow: 'visible' }}>
        <rect x={0} y={0} width={W} height={H} rx={10} fill="none" stroke={PAPER.ink} strokeWidth={5} />
        {/* Batterie unten Mitte */}
        <line x1={W / 2 - 16} y1={H} x2={W / 2 - 16} y2={H + 22} stroke={PAPER.ink} strokeWidth={5} />
        <line x1={W / 2 + 16} y1={H} x2={W / 2 + 16} y2={H + 10} stroke={PAPER.ink} strokeWidth={9} />
        {/* Elektronen */}
        {on
          ? Array.from({ length: 10 }).map((_, i) => {
              const s = (frame / 60 + i / 10) % 1;
              const [px, py] = onLoc(s, W, H);
              // Verbrauch: nach der Lampe (obere Kante rechts der Mitte) ausblenden
              const afterLamp = consume && py === 0 && px > W / 2;
              return afterLamp ? null : <circle key={i} cx={px} cy={py} r={6} fill="#2563eb" />;
            })
          : null}
      </svg>
      {/* Lampe oben Mitte */}
      <div style={{ position: 'absolute', left: W / 2 - 40, top: -40 }}>
        <PaperLamp x={40} y={40} r={38} brightness={brightness} />
      </div>
      {consume ? (
        <div style={{ position: 'absolute', left: W - 30, top: 6, fontSize: 22, fontWeight: 900, color: '#dc2626' }}>✕ leer?</div>
      ) : null}
    </div>
  );
};

const ChoiceCard: React.FC<{ label: string; sub: string; rev: { op: number; y: number }; hot?: boolean }> = ({ label, sub, rev, hot }) => (
  <div style={{ width: 232, padding: '16px 10px', borderRadius: 16, background: PAPER.panel, border: `2.5px solid ${hot ? PAPER.amber : PAPER.border}`, boxShadow: `0 10px 24px ${PAPER.shadow}`, textAlign: 'center', opacity: rev.op, transform: `translateY(${rev.y}px)` }}>
    <div style={{ fontSize: 27, fontWeight: 900, color: PAPER.ink }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 600, color: PAPER.inkSoft, marginTop: 4 }}>{sub}</div>
  </div>
);

// Fahrradkette: umlaufende „Kette" (Dash-Offset) + zwei Zahnräder + Glühstellen.
const Fahrradkette: React.FC<{ glow?: boolean }> = ({ glow = false }) => {
  const frame = useCurrentFrame();
  const CLx = 700, CRx = 1220, CY = 545, R = 160;
  const topY = CY - R, botY = CY + R;
  const off = -(frame * 2.4) % 32;
  const cog = (cx: number) => (
    <g>
      <circle cx={cx} cy={CY} r={R * 0.5} fill="none" stroke={PAPER.ink} strokeWidth={7} />
      <circle cx={cx} cy={CY} r={R * 0.14} fill={PAPER.ink} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2 + frame * 0.02;
        const r1 = R * 0.5, r2 = R * 0.62;
        return <line key={i} x1={cx + Math.cos(a) * r1} y1={CY + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={CY + Math.sin(a) * r2} stroke={PAPER.ink} strokeWidth={6} strokeLinecap="round" />;
      })}
    </g>
  );
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* Kette als Stadion-Pfad mit laufenden Gliedern */}
      <path d={`M ${CLx},${topY} L ${CRx},${topY} A ${R} ${R} 0 0 1 ${CRx},${botY} L ${CLx},${botY} A ${R} ${R} 0 0 1 ${CLx},${topY} Z`}
        fill="none" stroke="#94a3b8" strokeWidth={20} />
      <path d={`M ${CLx},${topY} L ${CRx},${topY} A ${R} ${R} 0 0 1 ${CRx},${botY} L ${CLx},${botY} A ${R} ${R} 0 0 1 ${CLx},${topY} Z`}
        fill="none" stroke={PAPER.ink} strokeWidth={12} strokeDasharray="16 16" strokeDashoffset={off} strokeLinecap="butt" />
      {cog(CLx)}
      {cog(CRx)}
      {glow ? [CLx + (CRx - CLx) * 0.34, CLx + (CRx - CLx) * 0.66].map((gx, i) => (
        <g key={i}>
          <circle cx={gx} cy={topY} r={34} fill="rgba(251,191,36,0.85)" />
          <circle cx={gx} cy={topY} r={54} fill="rgba(251,191,36,0.28)" />
        </g>
      )) : null}
    </svg>
  );
};

// ── Szenen ──────────────────────────────────────────────────────────────
const Intro: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const t = useReveal(beats[0].start + 4);
  const sub = useReveal(beats[0].start + 22);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 90, marginBottom: 30, opacity: t.op }}>
        {['🔌', '💡', '❓'].map((e, i) => (
          <div key={i} style={{ fontSize: 120, transform: `translateY(${Math.sin(frame / 22 + i) * 14}px)` }}>{e}</div>
        ))}
      </div>
      <PaperLogo size={76} />
      <div style={{ marginTop: 24, fontSize: 78, fontWeight: 900, color: PAPER.ink, textAlign: 'center', opacity: t.op, transform: `translateY(${t.y}px)` }}>
        Wird der Strom verbraucht?
      </div>
      <div style={{ marginTop: 14, fontSize: 37, fontWeight: 600, color: PAPER.inkSoft, textAlign: 'center', opacity: sub.op }}>
        Die Lampe leuchtet – aber was passiert im Kabel?
      </div>
    </AbsoluteFill>
  );
};

const AlltagScene: React.FC<SP> = ({ beats }) => {
  const b0 = beats[0].start;
  const c = useReveal(b0);
  const lab = useReveal(b0 + 26);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Der Stromkreis" title="Ein geschlossener Kreis" />
      <div style={{ opacity: c.op }}>
        <CircuitFrame on count={15}><PaperLamp x={L_ONE[0]} y={L_ONE[1]} r={50} brightness={1} label="Verbraucher" /></CircuitFrame>
      </div>
      <div style={{ position: 'absolute', left: LX - 150, top: BY - 20, fontSize: 26, fontWeight: 800, color: PAPER.inkSoft, opacity: lab.op }}>▲ Quelle</div>
      <Sfx sound="pling" at={b0 + 2} volume={0.35} />
      <PaperCaption delay={b0 + 6}>Nur im <b>geschlossenen</b> Kreis fließt Strom – von der Quelle zum Verbraucher und zurück.</PaperCaption>
    </AbsoluteFill>
  );
};

const FehlvorstellungScene: React.FC<SP> = ({ beats }) => {
  const b0 = beats[0].start;
  const blase = useReveal(b0 + 8);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Ein häufiger Denkfehler" title={'„Der Strom wird aufgebraucht"'} />
      <div style={{ opacity: 0.28 }}>
        <CircuitFrame on={false} count={0}><PaperLamp x={L_ONE[0]} y={L_ONE[1]} r={50} brightness={0.5} /></CircuitFrame>
      </div>
      {/* Denkblase */}
      <div style={{ position: 'absolute', left: 560, top: 300, width: 820, opacity: blase.op, transform: `translateY(${blase.y}px)` }}>
        <div style={{ background: PAPER.panel, border: `2px dashed ${PAPER.inkSoft}`, borderRadius: 28, padding: '26px 30px 30px', boxShadow: `0 16px 40px ${PAPER.shadow}` }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#dc2626', marginBottom: 8 }}>Denkfehler 💭</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 700, color: PAPER.ink }}>
            <span style={{ fontSize: 46 }}>🔋</span>
            <span style={{ color: '#2563eb' }}>→●●●→</span>
            <span style={{ fontSize: 46 }}>💡</span>
            <span style={{ color: '#94a3b8' }}>→ ⌀ →</span>
            <span style={{ color: '#dc2626', fontWeight: 800 }}>nichts mehr</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 24, color: PAPER.inkSoft }}>„In der Lampe verschwindet der Strom – wie Wasser im Glas."</div>
        </div>
        <div style={{ position: 'absolute', left: 90, bottom: -34, display: 'flex', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: PAPER.panel, border: `2px dashed ${PAPER.inkSoft}` }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: PAPER.panel, border: `2px dashed ${PAPER.inkSoft}`, marginTop: 16 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SP> = ({ beats }) => {
  const b0 = beats[0].start;
  const a = useReveal(b0 + 6);
  const b = useReveal(b0 + 22);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Bei EINER Lampe" title="Man sieht keinen Unterschied" />
      <div style={{ position: 'absolute', left: 300, top: 420, opacity: a.op, transform: `translateY(${a.y}px)` }}>
        <MiniCircuit x={0} y={0} brightness={1} on consume />
        <div style={{ position: 'absolute', top: 250, width: 300, textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#dc2626' }}>Idee A: „Verbrauch"</div>
      </div>
      <div style={{ position: 'absolute', left: 1080, top: 420, opacity: b.op, transform: `translateY(${b.y}px)` }}>
        <MiniCircuit x={0} y={0} brightness={1} on />
        <div style={{ position: 'absolute', top: 250, width: 300, textAlign: 'center', fontSize: 28, fontWeight: 800, color: PAPER.green }}>Idee B: bleibt erhalten</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontSize: 120, fontWeight: 900, color: PAPER.inkSoft, opacity: b.op }}>?</div>
      <PaperCaption delay={b0 + 4}>Beide Ideen sagen dasselbe voraus. Wir brauchen einen besseren Test.</PaperCaption>
    </AbsoluteFill>
  );
};

const ExperimentScene: React.FC<SP> = ({ beats }) => {
  const b0 = beats[0].start;
  const c = useReveal(b0);
  const r0 = useReveal(b0 + 30), r1 = useReveal(b0 + 44), r2 = useReveal(b0 + 58);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Der bessere Test" title="Zwei Lampen in Reihe" />
      <div style={{ opacity: c.op }}>
        <CircuitFrame on={false} count={0} quelle={false}>
          <PaperLamp x={L2A[0]} y={L2A[1]} r={46} brightness={0} label="①" />
          <PaperLamp x={L2B[0]} y={L2B[1]} r={46} brightness={0} label="②" />
          <PaperSwitch x={960} y={TY} closed={false} />
        </CircuitFrame>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 448, textAlign: 'center', fontSize: 30, fontWeight: 800, color: PAPER.accent, opacity: r0.op }}>
        Rate zuerst – bevor du es ausprobierst!
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 505, display: 'flex', justifyContent: 'center', gap: 20 }}>
        <ChoiceCard label="① heller" sub="vorne mehr" rev={r0} />
        <ChoiceCard label="gleich hell" sub="beide gleich" rev={r1} />
        <ChoiceCard label="② heller" sub="hinten mehr" rev={r2} />
      </div>
    </AbsoluteFill>
  );
};

const VorhersageScene: React.FC<SP> = ({ beats }) => {
  const b0 = beats[0].start;
  const pred = useReveal(b0 + 8);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Vermutung: Verbrauch" title="Erste heller, zweite schwächer?" />
      <CircuitFrame on count={9}>
        <PaperLamp x={L2A[0]} y={L2A[1]} r={48} brightness={0.95} label="① hell" />
        <PaperLamp x={L2B[0]} y={L2B[1]} r={48} brightness={0.22} label="② schwach" />
      </CircuitFrame>
      <div style={{ position: 'absolute', left: 620, top: 200, fontSize: 30, fontWeight: 800, color: '#dc2626', opacity: pred.op }}>
        wenn Strom verbraucht würde → weniger für ②
      </div>
      <PaperCaption delay={b0 + 6} color="#b91c1c">So <b>sagt es die Verbrauchs-Idee voraus</b>. Stimmt das wirklich?</PaperCaption>
    </AbsoluteFill>
  );
};

const AufloesungScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const b1 = beats[1].start;
  const bright = interpolate(frame, [b0 + 6, b0 + 30], [0, 0.6], clamp);
  const tag = useReveal(b0 + 20);
  const anno = useReveal(b1 + 6);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Wir schließen den Kreis" title="Beide leuchten gleich hell!" />
      <CircuitFrame on count={15}>
        <PaperLamp x={L2A[0]} y={L2A[1]} r={48} brightness={bright} label="①" />
        <PaperLamp x={L2B[0]} y={L2B[1]} r={48} brightness={bright} label="②" />
        <PaperSwitch x={960} y={TY} closed />
      </CircuitFrame>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 205, textAlign: 'center', fontSize: 32, fontWeight: 900, color: PAPER.green, opacity: tag.op }}>
        ✓ gleich hell – die Verbrauchs-Idee stimmt nicht
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 258, textAlign: 'center', fontSize: 27, fontWeight: 800, color: '#2563eb', opacity: anno.op }}>
        überall gleich viele Elektronen – nichts geht verloren
      </div>
      <Sfx sound="impact" at={b0 + 6} volume={0.4} />
      {frame < b1
        ? <PaperCaption delay={b0 + 6}>Beide Lampen sind <b>gleich hell</b> – die zweite bekommt genauso viel.</PaperCaption>
        : <PaperCaption delay={b1}>Zwischen den Lampen geht <b>nichts</b> verloren – der Strom bleibt erhalten.</PaperCaption>}
    </AbsoluteFill>
  );
};

const ModellScene: React.FC<SP> = ({ beats }) => {
  const frame = useCurrentFrame();
  const b0 = beats[0].start;
  const b1 = beats[1].start;
  const glow = frame >= b1;
  const lab = useReveal(b1 + 6);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Ein Bild dafür" title="Wie eine Fahrradkette" />
      <Fahrradkette glow={glow} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontSize: 28, fontWeight: 800, color: PAPER.inkSoft }}>
        die ganze Kette läuft überall gleich schnell
      </div>
      {glow ? (
        <div style={{ position: 'absolute', left: 800, top: 300, fontSize: 25, fontWeight: 800, color: PAPER.amber, opacity: lab.op }}>💡 hier wird Energie zu Licht</div>
      ) : null}
      {frame < b1
        ? <PaperCaption delay={b0 + 6}>Du trittst – die ganze Kette bewegt sich gleich. Vorne verschwindet <b>keine</b> Kette.</PaperCaption>
        : <PaperCaption delay={b1}>An den Lampen entsteht Licht – die Kette bleibt <b>vollständig</b>.</PaperCaption>}
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SP> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={6} volume={0.5} />
    <PaperMerksatz title="Stromkreis" footer="der Verbraucher nutzt die Energie – nicht den Strom">
      Der Strom fließt im Kreis
      <br />
      und wird <span style={{ color: PAPER.green }}>nicht verbraucht</span>.
      <br />
      Er kommt zur Quelle zurück.
    </PaperMerksatz>
  </AbsoluteFill>
);

const TCard: React.FC<{ icon: string; title: string; rev: { op: number; y: number } }> = ({ icon, title, rev }) => (
  <div style={{ width: 320, padding: '28px 16px', borderRadius: 20, background: PAPER.panel, border: `1.5px solid ${PAPER.border}`, boxShadow: `0 12px 30px ${PAPER.shadow}`, textAlign: 'center', opacity: rev.op, transform: `translateY(${rev.y}px)` }}>
    <div style={{ fontSize: 70 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6, color: PAPER.ink }}>{title}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: PAPER.green, marginTop: 4 }}>⭕ Kreis geschlossen</div>
  </div>
);
const TransferScene: React.FC<SP> = ({ beats }) => {
  const b0 = beats[0].start;
  const r0 = useReveal(b0 + 6), r1 = useReveal(b0 + 22), r2 = useReveal(b0 + 38);
  return (
    <AbsoluteFill>
      <PaperTitle kicker="Überall im Alltag" title="Ist der Kreis geschlossen?" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 40 }}>
          <TCard icon="🔦" title="Taschenlampe" rev={r0} />
          <TCard icon="🚲" title="Fahrradlicht" rev={r1} />
          <TCard icon="🔔" title="Klingel" rev={r2} />
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={b0 + 6} volume={0.32} />
      <PaperCaption delay={b0 + 6}>Der Strom kommt <b>immer</b> wieder zur Quelle zurück.</PaperCaption>
    </AbsoluteFill>
  );
};

const Outro: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <PaperLogo size={112} />
      <div style={{ marginTop: 32, fontSize: 42, fontWeight: 800, color: PAPER.ink, opacity: s, textAlign: 'center' }}>
        Erst die Vorhersage – dann der Test.
      </div>
      <div style={{ marginTop: 10, fontSize: 34, fontWeight: 600, color: PAPER.inkSoft, opacity: s }}>
        Physik verstehen – Schritt für Schritt.
      </div>
    </AbsoluteFill>
  );
};

const SCENES: { key: string; ids: string[]; C: React.FC<SP>; slide?: boolean }[] = [
  { key: 'intro', ids: ['intro_1'], C: Intro },
  { key: 'alltag', ids: ['alltag_1'], C: AlltagScene },
  { key: 'fehl', ids: ['fehlvorstellung_1'], C: FehlvorstellungScene },
  { key: 'vergleich', ids: ['fehlvorstellung_2'], C: VergleichScene },
  { key: 'experiment', ids: ['experiment_1'], C: ExperimentScene, slide: true },
  { key: 'vorhersage', ids: ['experiment_2'], C: VorhersageScene },
  { key: 'aufloesung', ids: ['aufloesung_1', 'aufloesung_2'], C: AufloesungScene },
  { key: 'modell', ids: ['modell_1', 'modell_2'], C: ModellScene, slide: true },
  { key: 'merksatz', ids: ['merksatz_1'], C: MerksatzScene },
  { key: 'transfer', ids: ['transfer_1'], C: TransferScene },
  { key: 'outro', ids: ['outro_1'], C: Outro },
];

const LAID = SCENES.map((s) => ({ ...s, ...layoutBeats(s.ids, T, s.key === 'outro' ? { pad: 30 } : undefined) }));

export const STROMKREIS_DURATION = LAID.reduce((sum, s) => sum + s.total, 0) - (LAID.length - 1) * TR;

export const Stromkreis: React.FC = () => {
  return (
    <PaperBg>
      <BackgroundMusic total={STROMKREIS_DURATION} />
      <TransitionSeries>
        {LAID.flatMap((s, i) => {
          const seq = (
            <TransitionSeries.Sequence key={s.key} durationInFrames={s.total}>
              <s.C beats={s.beats} dur={s.total} />
              <BeatAudio base={BASE} beats={s.beats} />
            </TransitionSeries.Sequence>
          );
          if (i === LAID.length - 1) return [seq];
          const next = LAID[i + 1];
          return [seq, (
            <TransitionSeries.Transition key={`t-${s.key}`} presentation={next.slide ? slide({ direction: 'from-right' }) : fade()} timing={linearTiming({ durationInFrames: TR })} />
          )];
        })}
      </TransitionSeries>
      <Avatar />
    </PaperBg>
  );
};
