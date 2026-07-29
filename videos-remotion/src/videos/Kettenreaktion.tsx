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
import timings from '../narration/kettenreaktion.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const Node: React.FC<{ x: number; y: number; on: boolean }> = ({ x, y, on }) => (
  <>
    <circle cx={x} cy={y} r={22} fill={on ? COLORS.red : '#334155'} stroke="#0f172a" strokeWidth={2} opacity={on ? 1 : 0.4} />
    {on && <circle cx={x} cy={y} r={30} fill="none" stroke={COLORS.amber} strokeWidth={2} opacity={0.5} />}
  </>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120 }}>⚛️➿</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie verhindert man, dass es außer Kontrolle gerät?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Kettenreaktion
      </div>
    </AbsoluteFill>
  );
};

const KetteScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const level = Math.min(3, Math.floor(interpolate(frame, [20, 150], [0, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const cols = [1, 2, 4, 8];
  const xs = [300, 640, 980, 1360];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Kettenreaktion" title="Aus einer Spaltung werden viele" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {cols.map((n, c) => {
          const step = 640 / (n + 1);
          return Array.from({ length: n }).map((_, i) => {
            const y = 260 + step * (i + 1);
            const on = c <= level;
            const px = xs[c];
            // Verbindungen zur nächsten Ebene
            const lines = c < 3 && c < level ? [0, 1].map((k) => {
              const nStep = 640 / (cols[c + 1] + 1);
              const ny = 260 + nStep * (i * 2 + k + 1);
              return <line key={k} x1={px + 22} y1={y} x2={xs[c + 1] - 22} y2={ny} stroke="#e2e8f0" strokeWidth={2} opacity={0.5} />;
            }) : null;
            return (
              <React.Fragment key={`${c}-${i}`}>
                {lines}
                <Node x={px} y={y} on={on} />
              </React.Fragment>
            );
          });
        })}
      </svg>
      <div style={{ position: 'absolute', left: 60, top: 900, width: 1800, textAlign: 'center', fontSize: 26, fontWeight: 800, color: COLORS.amber }}>
        1 → 2 → 4 → 8 → … die Zahl der Spaltungen verdoppelt sich immer wieder.
      </div>
      <Sfx sound="pop" at={20} volume={0.3} />
      <Caption delay={30}>Bei jeder Spaltung entstehen neue Neutronen. Treffen die wieder Kerne, spalten die sich auch. So löst eine Spaltung immer mehr aus – eine Kettenreaktion.</Caption>
    </AbsoluteFill>
  );
};

const UnkontrolliertScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const boom = frame > 90;
  const grow = interpolate(frame, [20, 90], [1, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Ungebremst" title="Alles auf einmal – eine Explosion" />
      {!boom ? (
        <div style={{ fontSize: 120 * Math.min(grow, 5), transition: 'none' }}>⚛️</div>
      ) : (
        <div style={{ fontSize: 300 }}>💥</div>
      )}
      <div style={{ position: 'absolute', top: 260, left: 260, width: 1400, textAlign: 'center', fontSize: 27, fontWeight: 800, color: boom ? COLORS.red : COLORS.amber }}>
        {boom ? 'Jedes Neutron löst neue Spaltungen aus → die Reaktion läuft in Sekundenbruchteilen aus dem Ruder.' : 'Ungebremst verdoppelt sich alles rasend schnell …'}
      </div>
      <Sfx sound="impact" at={90} volume={0.5} />
      <Caption delay={30}>Bleibt die Kettenreaktion ungebremst, verdoppelt sie sich blitzschnell. In einem Reaktor wäre das eine Katastrophe – in einer Atombombe ist genau das das Ziel.</Caption>
    </AbsoluteFill>
  );
};

const SteuernScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Kontrolle" title="Steuerstäbe schlucken die Extra-Neutronen" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* eine Kette, die geradlinig weiterläuft */}
        {[320, 560, 800, 1040].map((x, i) => <Node key={i} x={x} y={540} on />)}
        {[320, 560, 800].map((x, i) => <line key={i} x1={x + 22} y1={540} x2={x + 218} y2={540} stroke="#e2e8f0" strokeWidth={2} opacity={0.6} />)}
        {/* absorbierte Neutronen nach oben/unten → Steuerstäbe */}
        {[440, 680, 920].map((x, i) => (
          <React.Fragment key={i}>
            <rect x={x - 14} y={300} width={28} height={130} rx={6} fill="#475569" />
            <rect x={x - 14} y={650} width={28} height={130} rx={6} fill="#475569" />
            <line x1={x} y1={540} x2={x} y2={430} stroke={COLORS.muted} strokeWidth={2} strokeDasharray="6 6" />
            <line x1={x} y1={540} x2={x} y2={650} stroke={COLORS.muted} strokeWidth={2} strokeDasharray="6 6" />
            <text x={x} y={290} fontSize={20} fill={COLORS.muted} textAnchor="middle">⊗</text>
          </React.Fragment>
        ))}
        <text x={440} y={250} fontSize={24} fontWeight="800" fill={COLORS.sky} textAnchor="middle">Steuerstäbe</text>
      </svg>
      <div style={{ position: 'absolute', left: 1200, top: 460, width: 640, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, marginBottom: 12 }}>Steuerstäbe (z. B. aus Bor) fangen die überzähligen Neutronen ab.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}` }}>Von jeder Spaltung löst nur noch ein Neutron die nächste aus. Die Reaktion läuft ruhig und gleichmäßig weiter.</div>
      </div>
      <Caption delay={30}>Im Reaktor sorgen Steuerstäbe für Ordnung. Sie fangen überzählige Neutronen ab, sodass von jeder Spaltung genau eine neue folgt. So bleibt die Kettenreaktion kontrolliert.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Kettenreaktion" footer="Reaktor: 1 Spaltung → genau 1 neue">
      Neutronen aus einer Spaltung lösen weitere aus.
      <br />
      Steuerstäbe fangen die überzähligen ab –
      <br />
      so bleibt die Reaktion kontrolliert.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🎛️', 'Steuerstäbe', 'rein = langsamer'],
    ['💧', 'Moderator', 'bremst Neutronen ab'],
    ['🛑', 'Notabschaltung', 'Stäbe ganz hinein'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="So regelt man einen Reaktor" />
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
      <Caption delay={40}>Schiebt man die Steuerstäbe ganz hinein, stoppt die Reaktion. Wie daraus Strom wird, sehen wir als Nächstes.</Caption>
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
  { id: 'kette', C: KetteScene, min: 260 },
  { id: 'unkontrolliert', C: UnkontrolliertScene, min: 240 },
  { id: 'steuern', C: SteuernScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KETTENREAKTION_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kettenreaktion: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KETTENREAKTION_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kettenreaktion/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
