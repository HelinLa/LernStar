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
import timings from '../narration/elektromagnet-anwendungen.timings.json';

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
      <div style={{ fontSize: 100, display: 'flex', gap: 30 }}>
        <span>🏗️</span>
        <span>🔔</span>
        <span>🔊</span>
      </div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wo stecken schaltbare Magnete im Alltag?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Elektromagnet bei der Arbeit
      </div>
    </AbsoluteFill>
  );
};

const KranScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  // Zyklus: heben (on) → tragen → aus → fallen
  const on = frame < 130;
  const carY = on ? interpolate(frame, [30, 80], [780, 470], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : interpolate(frame, [130, 175], [470, 800], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Schrottplatz" title="Der Kran, der Autos hebt und fallen lässt" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Kranarm */}
        <line x1={720} y1={200} x2={720} y2={380} stroke={COLORS.muted} strokeWidth={8} />
        {/* Elektromagnet-Scheibe */}
        <rect x={640} y={380} width={160} height={60} rx={10} fill={on ? '#f59e0b' : '#64748b'} stroke={COLORS.border} strokeWidth={3} />
        {on && <circle cx={720} cy={410} r={110} fill="none" stroke={COLORS.amber} strokeWidth={3} opacity={0.35} />}
      </svg>
      <div style={{ position: 'absolute', left: 660, top: carY, fontSize: 90 }}>🚗</div>
      <div style={{ position: 'absolute', left: 1180, top: 440, width: 580 }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: on ? 'rgba(34,197,94,0.14)' : 'rgba(239,68,68,0.14)', border: `2px solid ${on ? COLORS.green : COLORS.red}`, fontSize: 28, fontWeight: 800 }}>
          {on ? '⚡ Strom AN → Magnet hält das Auto' : '○ Strom AUS → Auto fällt sofort'}
        </div>
      </div>
      <Caption delay={30}>Ein normaler Magnet würde das Auto nie mehr loslassen. Der Elektromagnet lässt sich per Schalter ausschalten.</Caption>
    </AbsoluteFill>
  );
};

const RelaisScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const on = frame > 55;
  const armY = on ? interpolate(frame, [55, 80], [0, 22], { extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Relais" title="Ein kleiner Strom schaltet einen großen" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Steuerkreis links */}
        <text x={330} y={430} fontSize={26} fontWeight="800" fill={COLORS.sky}>Steuerkreis (schwach)</text>
        <rect x={300} y={450} width={120} height={90} rx={8} fill="none" stroke={on ? COLORS.amber : COLORS.muted} strokeWidth={5} />
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={i} x1={310 + i * 27} y1={450} x2={310 + i * 27} y2={540} stroke={on ? '#f59e0b' : '#64748b'} strokeWidth={4} />
        ))}
        {/* Anker (Hebel) */}
        <g transform={`translate(0 ${armY})`}>
          <rect x={430} y={470} width={130} height={16} rx={6} fill={COLORS.ink} />
          <circle cx={560} cy={478} r={10} fill={on ? COLORS.green : COLORS.red} />
        </g>
        {/* Lastkreis rechts */}
        <text x={640} y={430} fontSize={26} fontWeight="800" fill={COLORS.amber}>Lastkreis (stark)</text>
        <line x1={560} y1={478} x2={560} y2={560} stroke={COLORS.muted} strokeWidth={5} />
        <line x1={560} y1={560} x2={760} y2={560} stroke={COLORS.muted} strokeWidth={5} />
        <circle cx={820} cy={560} r={48} fill={`rgba(251,191,36,${on ? 0.9 : 0.12})`} stroke={COLORS.amber} strokeWidth={4} />
        <line x1={560} y1={478} x2={560} y2={470} stroke={on ? COLORS.green : COLORS.red} strokeWidth={5} />
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 460, width: 580, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, fontSize: 25, fontWeight: 800, marginBottom: 12 }}>Ein schwacher Strom macht den Elektromagneten an.</div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, fontSize: 25, fontWeight: 800 }}>Er zieht den Hebel an und schließt den starken Lastkreis – die Lampe leuchtet.</div>
      </div>
      <Sfx sound="pop" at={56} volume={0.34} />
      <Caption delay={30}>Im Relais schaltet ein kleiner Steuerstrom über den Elektromagneten einen viel größeren Stromkreis.</Caption>
    </AbsoluteFill>
  );
};

const KlingelScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const ringing = frame > 40;
  const hit = ringing ? Math.sin(frame / 3.2) : -1;
  const hammerX = interpolate(hit, [-1, 1], [0, 70]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Klingel" title="Der Magnet, der sich selbst aus- und anschaltet" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Elektromagnet */}
        <rect x={440} y={480} width={120} height={90} rx={10} fill="#f59e0b" stroke={COLORS.border} strokeWidth={3} />
        <text x={500} y={535} fontSize={30} textAnchor="middle" fill="#fff" fontWeight="900">🧲</text>
        {/* Hammerstange + Klöppel */}
        <line x1={560} y1={525} x2={640 + hammerX} y2={525} stroke={COLORS.ink} strokeWidth={10} />
        <circle cx={655 + hammerX} cy={525} r={22} fill={COLORS.muted} />
        {/* Glocke */}
        <text x={770} y={545} fontSize={90}>🔔</text>
        {ringing && hammerX > 55 && <circle cx={790} cy={520} r={70} fill="none" stroke={COLORS.amber} strokeWidth={3} opacity={0.5} />}
        {/* Kontakt-Feder */}
        <line x1={500} y1={480} x2={500} y2={420} stroke={hammerX > 35 ? COLORS.red : COLORS.green} strokeWidth={6} />
        <circle cx={500} cy={420} r={9} fill={hammerX > 35 ? COLORS.red : COLORS.green} />
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 440, width: 580, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 24, fontWeight: 800, marginBottom: 10 }}>1. Magnet an → Klöppel schlägt gegen die Glocke.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.red}`, fontSize: 24, fontWeight: 800, marginBottom: 10 }}>2. Dabei öffnet sich der Kontakt → Magnet aus.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 24, fontWeight: 800 }}>3. Feder zieht zurück → Kontakt zu → von vorn. Es rasselt.</div>
      </div>
      <Caption delay={30}>Der Klöppel unterbricht beim Anschlagen selbst den Strom – dadurch schwingt er ständig hin und her.</Caption>
    </AbsoluteFill>
  );
};

const LautsprecherScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const x = Math.sin(frame / 4) * 16;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Lautsprecher" title="Wechselstrom lässt die Membran zittern" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Dauermagnet */}
        <rect x={430} y={480} width={70} height={120} rx={8} fill={COLORS.sky} />
        <text x={465} y={550} fontSize={26} textAnchor="middle" fill="#fff" fontWeight="900">🧲</text>
        {/* Spule + Membran (bewegt) */}
        <g transform={`translate(${x} 0)`}>
          <rect x={520} y={500} width={70} height={80} rx={6} fill="none" stroke="#f59e0b" strokeWidth={6} />
          <path d={`M 590 470 L 720 430 L 720 650 L 590 610 Z`} fill={COLORS.panelSolid} stroke={COLORS.border} strokeWidth={3} />
        </g>
        {/* Schallwellen */}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${760 + i * 60} 470 Q ${790 + i * 60} 540 ${760 + i * 60} 610`} fill="none" stroke={COLORS.amber} strokeWidth={4} opacity={0.6 - i * 0.15} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 480, width: 580, opacity: f, fontSize: 26, fontWeight: 800 }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>
          Der wechselnde Strom in der Spule stößt sie am Dauermagneten vor und zurück – die Membran erzeugt Schall.
        </div>
      </div>
      <Caption delay={30}>Auch im Lautsprecher steckt ein Elektromagnet: Er wandelt Strom in Bewegung und damit in Töne um.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Elektromagnet im Alltag" footer="an/aus · steuerbar · umpolbar">
      Weil man ihn schalten kann, steckt der Elektromagnet
      <br />
      in Kran, Relais, Klingel und Lautsprecher.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🚪', 'Türöffner', 'Summer entriegelt'],
    ['💽', 'Festplatte', 'bewegt den Schreibkopf'],
    ['🚗', 'Anlasser', 'Magnetschalter startet'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Noch mehr versteckte Elektromagnete" />
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
      <Caption delay={40}>Überall, wo etwas per Strom bewegt oder geschaltet wird, hilft ein Elektromagnet.</Caption>
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
  { id: 'kran', C: KranScene, min: 260 },
  { id: 'relais', C: RelaisScene, min: 260 },
  { id: 'klingel', C: KlingelScene, min: 270 },
  { id: 'lautsprecher', C: LautsprecherScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ELEKTROMAGNET_ANWENDUNGEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const ElektromagnetAnwendungen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ELEKTROMAGNET_ANWENDUNGEN_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/elektromagnet-anwendungen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
