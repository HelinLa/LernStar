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
import timings from '../narration/strahlung-nachweisen.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const CLICKS = [22, 34, 41, 58, 66, 79, 92, 99, 110, 118, 131, 138, 149, 160, 168, 177];

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 120 }}>📟🔊</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Wie macht man unsichtbare Strahlung sichtbar?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Geigerzähler und Nebelkammer
      </div>
    </AbsoluteFill>
  );
};

const GeigerScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const count = CLICKS.filter((c) => c <= frame).length;
  const near = CLICKS.some((c) => frame >= c && frame < c + 5);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Geigerzähler" title="Jedes Teilchen macht Klick" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Zählrohr */}
        <rect x={360} y={500} width={260} height={90} rx={45} fill={near ? 'rgba(251,191,36,0.5)' : COLORS.panelSolid} stroke={COLORS.amber} strokeWidth={4} />
        <text x={490} y={556} fontSize={26} fontWeight="800" fill={COLORS.ink} textAnchor="middle">Zählrohr</text>
        {/* einfallende Strahlung */}
        {near && <line x1={180} y1={480} x2={380} y2={520} stroke={COLORS.green} strokeWidth={5} strokeDasharray="10 8" />}
        {/* Gerät/Display */}
        <rect x={720} y={460} width={340} height={170} rx={16} fill="#0b1220" stroke={COLORS.border} strokeWidth={3} />
      </svg>
      <div style={{ position: 'absolute', left: 745, top: 480, width: 300, textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.muted }}>Impulse</div>
        <div style={{ fontSize: 74, fontWeight: 900, color: COLORS.green, fontVariantNumeric: 'tabular-nums' }}>{count}</div>
      </div>
      {near && <div style={{ position: 'absolute', left: 640, top: 400, fontSize: 40, fontWeight: 900, color: COLORS.amber }}>🔊 Klick!</div>}
      <div style={{ position: 'absolute', left: 1120, top: 470, width: 700, fontSize: 24, fontWeight: 800 }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, marginBottom: 12 }}>Trifft ein Teilchen das Gaszählrohr, ionisiert es das Gas – ein kurzer Stromstoß entsteht und man hört ein Klick.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}` }}>Mehr Strahlung = mehr Klicks pro Sekunde. Diese Zählrate misst die Aktivität (in Becquerel).</div>
      </div>
      <Caption delay={30}>Ein Teilchen ionisiert das Gas im Zählrohr, und es macht Klick. Je mehr Strahlung, desto mehr Klicks pro Sekunde.</Caption>
    </AbsoluteFill>
  );
};

const NebelkammerScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const grow = interpolate(frame, [20, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Nebelkammer" title="Teilchen hinterlassen Spuren" />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        <rect x={280} y={360} width={780} height={420} rx={16} fill="#0b1220" stroke={COLORS.border} strokeWidth={3} />
        {/* Alpha: dick, kurz, gerade */}
        <line x1={420} y1={470} x2={420 + 180 * grow} y2={480} stroke="#fff" strokeWidth={10} opacity={0.9} strokeLinecap="round" />
        <text x={430} y={455} fontSize={22} fontWeight="800" fill={COLORS.amber}>α: dick & kurz</text>
        {/* Beta: dünn, lang, leicht gekrümmt */}
        <path d={`M 420 620 q ${300 * grow} -60 ${520 * grow} 30`} fill="none" stroke="#e2e8f0" strokeWidth={3} opacity={0.85} />
        <text x={430} y={690} fontSize={22} fontWeight="800" fill={COLORS.sky}>β: dünn & lang</text>
      </svg>
      <div style={{ position: 'absolute', left: 1120, top: 470, width: 700, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}` }}>
          In der Nebelkammer ziehen die Teilchen feine Nebelspuren. An Länge und Dicke erkennt man die Strahlungsart: Alphaspuren sind dick und kurz, Betaspuren dünn und lang.
        </div>
      </div>
      <Sfx sound="pop" at={20} volume={0.3} />
      <Caption delay={30}>In einer Nebelkammer hinterlässt jedes Teilchen eine feine Nebelspur. So sieht man die Strahlung sogar direkt.</Caption>
    </AbsoluteFill>
  );
};

const WeitereScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  const items = [
    ['📛', 'Filmplakette', 'Dosis am Menschen messen'],
    ['📟', 'Dosimeter', 'zeigt die gesammelte Dosis'],
    ['🛰️', 'Detektoren', 'in Technik und Forschung'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Weitere Nachweise" title="Strahlung dauerhaft überwachen" />
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
      <Caption delay={30}>Menschen, die mit Strahlung arbeiten, tragen eine Filmplakette oder ein Dosimeter, das ihre gesammelte Dosis misst.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Strahlung nachweisen" footer="Zählrate = Aktivität (in Becquerel)">
      Man nutzt die Ionisation: Der Geigerzähler klickt
      <br />
      bei jedem Teilchen, die Nebelkammer zeigt Spuren.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['⛏️', 'Rohstoffsuche', 'Erz aufspüren'],
    ['🚨', 'Sicherheit', 'Strahlenquellen finden'],
    ['🏭', 'Kraftwerk', 'ständige Überwachung'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Wo man Strahlung misst" />
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
      <Caption delay={40}>Weil man Strahlung messen kann, lässt sie sich überwachen und sicher handhaben. Als Nächstes: die drei Strahlungsarten.</Caption>
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
  { id: 'geiger', C: GeigerScene, min: 260 },
  { id: 'nebelkammer', C: NebelkammerScene, min: 250 },
  { id: 'weitere', C: WeitereScene, min: 230 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STRAHLUNG_NACHWEISEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const StrahlungNachweisen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STRAHLUNG_NACHWEISEN_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/strahlung-nachweisen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
