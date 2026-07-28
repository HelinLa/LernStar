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
import { CompassNeedle, useFade } from '../magnet';
import timings from '../narration/oersted.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Waagerechter Draht mit Batterie/Schalter, fließende Strom-Punkte wenn on.
const WireAndCompass: React.FC<{ on: boolean; reversed?: boolean; needle: number; cx?: number; cy?: number }> = ({
  on,
  reversed = false,
  needle,
  cx = 720,
  cy = 470,
}) => {
  const frame = useCurrentFrame();
  const dir = reversed ? -1 : 1;
  const dots = Array.from({ length: 12 });
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
        {/* Draht */}
        <line x1={cx - 380} y1={cy} x2={cx + 380} y2={cy} stroke={COLORS.border} strokeWidth={10} strokeLinecap="round" />
        <line x1={cx - 380} y1={cy} x2={cx + 380} y2={cy} stroke={on ? COLORS.amber : '#475569'} strokeWidth={5} strokeLinecap="round" />
        {/* Strom-Punkte */}
        {on &&
          dots.map((_, i) => {
            const p = ((frame * 3 * dir + i * 63) % 760 + 760) % 760;
            return <circle key={i} cx={cx - 380 + p} cy={cy} r={6} fill="#fff" />;
          })}
        {/* Batterie + Schalter links */}
        <rect x={cx - 470} y={cy - 34} width={70} height={68} rx={8} fill={COLORS.panelSolid} stroke={COLORS.border} strokeWidth={2} />
        <text x={cx - 435} y={cy + 6} fontSize={30} fontWeight="900" fill={on ? COLORS.amber : COLORS.muted} textAnchor="middle">{on ? '⚡' : '○'}</text>
        {/* Richtungspfeil */}
        {on && (
          <polygon
            points={`0,-12 26,0 0,12`}
            fill={COLORS.amber}
            transform={`translate(${cx + (reversed ? -300 : 300)},${cy - 34}) rotate(${reversed ? 180 : 0})`}
          />
        )}
      </svg>
      {/* Kompass unter dem Draht */}
      <div style={{ position: 'absolute', left: cx, top: cy + 150 }}>
        <CompassNeedle x={0} y={0} size={170} angle={needle} />
      </div>
    </>
  );
};

// Querschnitt: Draht von vorn (⊗ = Strom in die Ebene) mit konzentrischen Feldringen.
const WireCross: React.FC<{ cx: number; cy: number; into?: boolean; progress?: number }> = ({ cx, cy, into = true, progress = 1 }) => {
  const rings = [55, 100, 150];
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {rings.map((r, i) => {
        const app = interpolate(progress, [i * 0.2, i * 0.2 + 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        // Pfeilspitze auf dem Ring (oben): into-page → im Uhrzeigersinn
        const a = (frame / 30) * 20;
        const dir = into ? 1 : -1;
        return (
          <g key={i} opacity={app * 0.85}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.sky} strokeWidth={3} />
            <polygon points="0,-8 16,0 0,8" fill={COLORS.sky} transform={`translate(${cx + dir * r},${cy}) rotate(${into ? 90 : -90})`} />
            <polygon points="0,-8 16,0 0,8" fill={COLORS.sky} transform={`translate(${cx - dir * r},${cy}) rotate(${into ? -90 : 90})`} />
          </g>
        );
      })}
      {/* Draht-Querschnitt */}
      <circle cx={cx} cy={cy} r={26} fill={COLORS.panelSolid} stroke={COLORS.amber} strokeWidth={4} />
      {into ? (
        <>
          <line x1={cx - 13} y1={cy - 13} x2={cx + 13} y2={cy + 13} stroke={COLORS.amber} strokeWidth={4} />
          <line x1={cx + 13} y1={cy - 13} x2={cx - 13} y2={cy + 13} stroke={COLORS.amber} strokeWidth={4} />
        </>
      ) : (
        <circle cx={cx} cy={cy} r={7} fill={COLORS.amber} />
      )}
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
      <div style={{ fontSize: 120, display: 'flex', gap: 24, alignItems: 'center' }}>
        <span>🔌</span>
        <span style={{ fontSize: 80 }}>➡️</span>
        <span>🧭</span>
      </div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Kann Strom eine Kompassnadel bewegen?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Versuch von Oersted, 1820
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const on = frame > 55;
  const needle = on ? interpolate(frame, [55, 95], [0, 80], { extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Strom an – die Nadel springt zur Seite" />
      <WireAndCompass on={on} needle={needle} />
      <div style={{ position: 'absolute', left: 1240, top: 470, width: 520, fontSize: 30, fontWeight: 800, color: on ? COLORS.green : COLORS.muted }}>
        {on ? '⚡ Strom fließt → Nadel dreht sich quer zum Draht' : '○ Schalter offen → Nadel zeigt Norden'}
      </div>
      <Caption delay={30}>Ohne Strom zeigt die Nadel nach Norden. Schließt man den Stromkreis, dreht sie sich sofort zur Seite.</Caption>
    </AbsoluteFill>
  );
};

const FeldScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Ursache" title="Um jeden stromdurchflossenen Draht liegt ein Feld" />
      <WireCross cx={720} cy={560} into progress={f} />
      <div style={{ position: 'absolute', left: 1200, top: 420, width: 600, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 26, fontWeight: 800, marginBottom: 14 }}>⚡ Strom fließt durch den Draht (⊗ = in die Ebene)</div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, fontSize: 26, fontWeight: 800 }}>🔵 das Magnetfeld bildet Kreise um den Draht</div>
      </div>
      <Caption delay={30}>Der Strom selbst erzeugt ein Magnetfeld – es verläuft in Kreisen rund um den Draht.</Caption>
    </AbsoluteFill>
  );
};

const RichtungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const reversed = frame > 90;
  const needle = reversed ? -80 : 80;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Ausprobieren" title="Strom umpolen – Feld dreht sich um" />
      <WireAndCompass on reversed={reversed} needle={needle} cy={470} />
      <div style={{ position: 'absolute', left: 1240, top: 470, width: 520, fontSize: 28, fontWeight: 800, color: reversed ? COLORS.red : COLORS.green, opacity: f }}>
        {reversed ? '⬅️ Strom andersherum → Nadel kippt zur anderen Seite' : '➡️ Strom in eine Richtung'}
      </div>
      <Sfx sound="pop" at={90} volume={0.34} />
      <Caption delay={30}>Kehrt man die Stromrichtung um, dreht sich auch die Feldrichtung – die Nadel kippt zur anderen Seite.</Caption>
    </AbsoluteFill>
  );
};

const StaerkeScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const I = 0.5 + 0.5 * Math.sin((frame - 20) / 30);
  const needle = interpolate(I, [0, 1], [20, 85]);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Stärke" title="Mehr Strom – stärkere Auslenkung" />
      <WireAndCompass on needle={needle} cy={470} />
      <div style={{ position: 'absolute', left: 1240, top: 460, width: 520, opacity: f }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.muted, marginBottom: 10 }}>Stromstärke</div>
        <div style={{ width: '100%', height: 40, borderRadius: 12, background: COLORS.panel, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <div style={{ width: `${I * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.amber}, ${COLORS.red})` }} />
        </div>
        <div style={{ fontSize: 25, fontWeight: 800, marginTop: 12, color: I > 0.5 ? COLORS.red : COLORS.sky }}>
          {I > 0.5 ? 'viel Strom → starkes Feld' : 'wenig Strom → schwaches Feld'}
        </div>
      </div>
      <Caption delay={30}>Je größer die Stromstärke, desto stärker das Magnetfeld und desto weiter dreht die Nadel.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Elektromagnetismus" footer="Stromrichtung umkehren → Feldrichtung kehrt sich um">
      Jeder elektrische Strom erzeugt ein Magnetfeld.
      <br />
      Es bildet Kreise um den Draht.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🧲', 'Elektromagnet', 'Draht zur Spule wickeln'],
    ['⚙️', 'Elektromotor', 'Feld übt Kraft aus'],
    ['🔊', 'Lautsprecher', 'Strom bewegt die Membran'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Die Grundlage der Elektrotechnik" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        {items.map((c, i) => (
          <div key={i} style={{ width: 420, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>{c[0]}</div>
            <div style={{ fontSize: 27, fontWeight: 900, marginTop: 8 }}>{c[1]}</div>
            <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.muted, marginTop: 6 }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Oersteds Entdeckung ist der Start: Strom und Magnetismus gehören zusammen.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 250 },
  { id: 'feld', C: FeldScene, min: 250 },
  { id: 'richtung', C: RichtungScene, min: 250 },
  { id: 'staerke', C: StaerkeScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const OERSTED_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Oersted: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={OERSTED_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/oersted/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
