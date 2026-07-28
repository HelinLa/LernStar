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
import timings from '../narration/gammastrahlung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const GammaWave: React.FC<{ x0: number; y: number; len: number; frame: number; color?: string }> = ({ x0, y, len, frame, color = COLORS.indigo }) => {
  const pts: string[] = [];
  for (let x = 0; x <= len; x += 5) {
    pts.push(`${x0 + x},${y + Math.sin((x - frame * 6) / 14) * 24}`);
  }
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={5} />
      <polygon points="0,-12 22,0 0,12" fill={color} transform={`translate(${x0 + len},${y})`} />
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
      <div style={{ fontSize: 130, fontWeight: 900, color: COLORS.indigo }}>γ</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wieso stoppt selbst Blei die Gammastrahlung kaum?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Energiereiche Strahlung ohne Masse
      </div>
    </AbsoluteFill>
  );
};

const WasIstScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Was ist das?" title="Eine Welle statt eines Teilchens" />
      <Nucleus cx={480} cy={540} protons={8} neutrons={9} r={100} />
      <GammaWave x0={600} y={540} len={640} frame={frame} />
      <div style={{ position: 'absolute', left: 1180, top: 440, width: 660, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, marginBottom: 12 }}>Gammastrahlung ist kein Teilchen, sondern eine energiereiche elektromagnetische Welle – verwandt mit Licht und Röntgenstrahlung.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}` }}>Sie hat keine Masse und keine Ladung, aber sehr viel Energie.</div>
      </div>
      <Caption delay={30}>Gammastrahlung ist kein Teilchen, sondern eine energiereiche elektromagnetische Welle – wie sehr starkes, unsichtbares Licht.</Caption>
    </AbsoluteFill>
  );
};

const KeineAenderungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Was mit dem Kern passiert" title="Das Element bleibt gleich" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 30, fontSize: 30, fontWeight: 900 }}>
        <div style={{ padding: '22px 30px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.red}`, textAlign: 'center' }}>
          Kern<br /><span style={{ fontSize: 23, color: COLORS.muted }}>zu viel Energie</span>
        </div>
        <div style={{ fontSize: 46, color: COLORS.indigo }}>→</div>
        <div style={{ padding: '22px 30px', borderRadius: 16, background: 'rgba(129,140,248,0.16)', border: `2px solid ${COLORS.indigo}`, textAlign: 'center' }}>
          derselbe Kern<br /><span style={{ fontSize: 23, color: COLORS.muted }}>jetzt energieärmer</span>
        </div>
        <div style={{ fontSize: 34, color: COLORS.muted }}>+</div>
        <div style={{ padding: '22px 30px', borderRadius: 16, background: 'rgba(129,140,248,0.16)', border: `2px solid ${COLORS.indigo}`, textAlign: 'center' }}>
          γ<br /><span style={{ fontSize: 23, color: COLORS.muted }}>Energie</span>
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: 26, fontWeight: 800, color: COLORS.muted, opacity: f, maxWidth: 1200, textAlign: 'center' }}>
        Bei Gammastrahlung ändern sich Ordnungszahl und Massenzahl nicht. Der Kern gibt nur überschüssige Energie ab – oft direkt nach einem Alpha- oder Betazerfall.
      </div>
      <Caption delay={30}>Bei Gammastrahlung wird kein Teilchen abgestoßen. Der Kern gibt nur überschüssige Energie ab – Ordnungszahl und Element bleiben gleich.</Caption>
    </AbsoluteFill>
  );
};

const DurchdringungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Durchdringung" title="Erst dickes Blei oder Beton bremst sie" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <text x={260} y={545} fontSize={64}>☢️</text>
        {/* Papier + Alu durchdrungen */}
        <rect x={470} y={450} width={16} height={180} fill="#e2e8f0" opacity={0.5} />
        <text x={478} y={670} fontSize={20} fill={COLORS.muted} textAnchor="middle">Papier</text>
        <rect x={600} y={440} width={30} height={200} fill="#9ca3af" opacity={0.5} />
        <text x={615} y={680} fontSize={20} fill={COLORS.muted} textAnchor="middle">Alu</text>
        {/* dickes Blei */}
        <rect x={820} y={400} width={120} height={280} fill="#334155" stroke={COLORS.border} strokeWidth={2} />
        <text x={880} y={720} fontSize={22} fontWeight="800" fill={COLORS.muted} textAnchor="middle">dickes Blei</text>
      </svg>
      <GammaWave x0={340} y={540} len={560} frame={frame} color={COLORS.indigo} />
      <div style={{ position: 'absolute', left: 1120, top: 460, width: 720, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.indigo}` }}>Weil sie keine Masse und Ladung hat, wird Gammastrahlung kaum aufgehalten. Papier und Alu durchdringt sie mühelos. Erst dickes Blei oder Beton schwächt sie stark ab – ganz stoppen kann man sie fast nie.</div>
      </div>
      <Caption delay={30}>Ohne Masse und Ladung durchdringt Gammastrahlung fast alles. Erst dicke Schichten aus Blei oder Beton schwächen sie deutlich ab.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Gammastrahlung (γ)" footer="Element bleibt gleich – nur Energie wird frei">
      γ ist eine energiereiche elektromagnetische Welle
      <br />
      ohne Masse und Ladung. Sie ist sehr durchdringend –
      <br />
      erst dickes Blei oder Beton bremst sie.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏥', 'Strahlentherapie', 'zerstört Tumorzellen'],
    ['🔬', 'Sterilisation', 'keimfrei machen'],
    ['🧪', 'Materialprüfung', 'in Metall hineinsehen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Gammastrahlung nutzen" />
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
      <Caption delay={40}>Gerade weil sie so durchdringend ist, muss man sich bei Gammastrahlung besonders gut abschirmen.</Caption>
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
  { id: 'wasist', C: WasIstScene, min: 240 },
  { id: 'keineaenderung', C: KeineAenderungScene, min: 250 },
  { id: 'durchdringung', C: DurchdringungScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const GAMMASTRAHLUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Gammastrahlung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={GAMMASTRAHLUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/gammastrahlung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
