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
import timings from '../narration/reaktorunfaelle.timings.json';

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
      <div style={{ fontSize: 120 }}>☢️⚠️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Was passiert, wenn ein Reaktor außer Kontrolle gerät?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Reaktorunfälle und ihre Folgen
      </div>
    </AbsoluteFill>
  );
};

const KernschmelzeScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const melt = interpolate(frame, [40, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Kernschmelze" title="Ohne Kühlung überhitzt der Reaktor" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <rect x={420} y={420} width={320} height={300} rx={16} fill="#1e293b" stroke={COLORS.red} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={460 + i * 66} y={450} width={30} height={200 - melt * 90} rx={6} fill={`rgb(${200 + melt * 55},${90 - melt * 60},${60 - melt * 60})`} />
        ))}
        {/* geschmolzenes Material unten */}
        <ellipse cx={580} cy={690} rx={130 * melt} ry={22 * melt} fill="#dc2626" />
        {/* Kühlung ausgefallen */}
        <text x={300} y={420} fontSize={40}>💧</text>
        <text x={300} y={425} fontSize={44} fill={COLORS.red}>🚫</text>
        {/* austretende Strahlung */}
        {melt > 0.4 && [420, 740].map((x, i) => [430, 480, 530].map((y, j) => <circle key={`${i}-${j}`} cx={x + (i === 0 ? -30 : 30)} cy={y} r={5} fill={COLORS.green} opacity={0.6} />))}
      </svg>
      <div style={{ position: 'absolute', left: 900, top: 440, width: 780, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>Fällt die Kühlung aus, wird der Reaktor immer heißer. Die Brennstäbe können schmelzen – das nennt man Kernschmelze. Dabei kann radioaktives Material aus dem Reaktor entweichen.</div>
      </div>
      <Sfx sound="impact" at={40} volume={0.4} />
      <Caption delay={30}>Ein Reaktor muss ständig gekühlt werden. Fällt die Kühlung aus, überhitzt er, die Brennstäbe schmelzen – eine Kernschmelze. Dabei kann radioaktives Material freigesetzt werden.</Caption>
    </AbsoluteFill>
  );
};

const EreignisseScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Zwei große Unfälle" title="Tschernobyl und Fukushima" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        <div style={{ width: 620, padding: '30px 26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.red}` }}>
          <div style={{ fontSize: 70 }}>🏭💥</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>Tschernobyl 1986</div>
          <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>Bei einem Test lief die Reaktion außer Kontrolle. Der Reaktor explodierte und setzte enorme Mengen Radioaktivität frei.</div>
        </div>
        <div style={{ width: 620, padding: '30px 26px', borderRadius: 18, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>
          <div style={{ fontSize: 70 }}>🌊⚛️</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>Fukushima 2011</div>
          <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>Ein Erdbeben und ein Tsunami zerstörten die Kühlung. Es kam zu Kernschmelzen und zur Freisetzung von Radioaktivität.</div>
        </div>
      </div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Zweimal geschah das im Großen. 1986 explodierte der Reaktor in Tschernobyl. 2011 zerstörten Erdbeben und Tsunami die Kühlung im japanischen Fukushima.</Caption>
    </AbsoluteFill>
  );
};

const FolgenScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const items = [
    ['🚧', 'Sperrzone', 'Gebiet unbewohnbar'],
    ['🏃', 'Evakuierung', 'Menschen mussten fliehen'],
    ['⏳', 'Langzeitfolgen', 'noch über Jahrzehnte'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Folgen" title="Langfristig und weiträumig" />
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
      <Caption delay={30}>Die freigesetzte Strahlung verteilt sich weit und bleibt lange. Ganze Gebiete wurden zur Sperrzone, viele Menschen mussten ihre Heimat für immer verlassen.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Reaktorunfälle" footer="Kühlung ist überlebenswichtig für den Reaktor">
      Fällt die Kühlung aus, droht eine Kernschmelze mit
      <br />
      Freisetzung von Radioaktivität. Tschernobyl und
      <br />
      Fukushima zeigten die weitreichenden Folgen.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🛡️', 'Sicherheit', 'mehrfache Schutzhüllen'],
    ['🔁', 'Not-Kühlung', 'redundante Systeme'],
    ['⚖️', 'Debatte', 'Risiko gegen Nutzen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Konsequenzen für die Technik" />
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
      <Caption delay={40}>Solche Unfälle prägen bis heute die Diskussion über die Kernenergie. Ein weiteres Problem bleibt der Müll – dazu gleich mehr.</Caption>
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
  { id: 'kernschmelze', C: KernschmelzeScene, min: 250 },
  { id: 'ereignisse', C: EreignisseScene, min: 250 },
  { id: 'folgen', C: FolgenScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const REAKTORUNFAELLE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Reaktorunfaelle: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={REAKTORUNFAELLE_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/reaktorunfaelle/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
