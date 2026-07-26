import React from 'react';
import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS } from '../theme';
import {
  Bg,
  SceneTitle,
  Caption,
  Arrow,
  Ball,
  MerksatzBox,
  StarLogo,
} from '../components';

// Bühne ist 1920x1080. Bodenlinie einheitlich bei y = 760.
const GROUND_Y = 760;

const Ground: React.FC<{ ice?: boolean }> = ({ ice }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: GROUND_Y,
      height: 8,
      background: ice ? COLORS.ice : COLORS.ground,
      boxShadow: ice ? `0 0 40px ${COLORS.ice}55` : 'none',
    }}
  />
);

// ── Szene 1: Intro ─────────────────────────────────────────────────────
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleS = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const subS = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={110} />
      <div
        style={{
          marginTop: 44,
          fontSize: 96,
          fontWeight: 900,
          opacity: titleS,
          transform: `translateY(${interpolate(titleS, [0, 1], [40, 0])}px)`,
        }}
      >
        Trägheit
      </div>
      <div
        style={{
          marginTop: 22,
          fontSize: 42,
          fontWeight: 600,
          color: COLORS.muted,
          maxWidth: 1300,
          textAlign: 'center',
          opacity: subS,
        }}
      >
        Warum bewegt sich nichts von allein schneller – wer oder was steckt dahinter?
      </div>
    </AbsoluteFill>
  );
};

// ── Szene 2: Ruhe bleibt Ruhe (bis eine Kraft wirkt) ───────────────────
const RuheScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Kugel liegt still bis f=130, dann angeschoben nach rechts
  const push = frame >= 130;
  const x = interpolate(frame, [130, 240], [560, 1360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const arrowOpacity = interpolate(frame, [110, 130, 160, 185], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zustand 1 · Ruhe" title="Ein ruhender Körper bleibt in Ruhe" />
      <Ground />
      <Ball x={push ? x : 560} y={GROUND_Y - 46} color={COLORS.amber} />
      <Arrow x1={380} y1={GROUND_Y - 46} x2={500} y2={GROUND_Y - 46} color={COLORS.green} opacity={arrowOpacity} />
      {frame < 128 ? (
        <Caption>Von allein passiert nichts – die Kugel bleibt einfach liegen.</Caption>
      ) : (
        <Caption color={COLORS.green}>… erst eine Kraft (ein Schubs) setzt sie in Bewegung.</Caption>
      )}
    </AbsoluteFill>
  );
};

// ── Szene 3: Bewegung bleibt Bewegung (ohne Kraft) ─────────────────────
const BewegungScene: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 230], [-120, 2040], { easing: Easing.linear });
  // Gleichabständige Sekundenmarken zur Andeutung konstanter Geschwindigkeit
  const marks = [420, 700, 980, 1260, 1540];
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Zustand 2 · Bewegung" title="Ein bewegter Körper bleibt in Bewegung" />
      <Ground ice />
      {marks.map((mx, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: mx,
            top: GROUND_Y - 22,
            width: 4,
            height: 22,
            background: COLORS.sky,
            opacity: 0.5,
          }}
        />
      ))}
      <Ball x={x} y={GROUND_Y - 40} r={40} color={COLORS.sky} label="🧊 Puck" />
      {frame < 130 ? (
        <Caption>Auf glattem Eis gleitet der Puck weiter – gleich schnell und geradeaus.</Caption>
      ) : (
        <Caption color={COLORS.sky}>
          Solange keine Kraft wirkt (keine Reibung), ändert sich sein Tempo nicht.
        </Caption>
      )}
    </AbsoluteFill>
  );
};

// ── Szene 4: Nur eine Kraft ändert Tempo oder Richtung ─────────────────
const KraftScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = 960;
  const cy = GROUND_Y - 60;
  const a1 = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a2 = interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a3 = interpolate(frame, [120, 145], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Ursache" title="Nur eine Kraft ändert die Bewegung" />
      <Ball x={cx} y={cy} r={52} color={COLORS.amber} />
      {/* schneller (grün, nach rechts) */}
      <Arrow x1={cx + 60} y1={cy} x2={cx + 260} y2={cy} color={COLORS.green} opacity={a1} />
      {/* langsamer (rot, nach links) */}
      <Arrow x1={cx - 60} y1={cy} x2={cx - 260} y2={cy} color={COLORS.red} opacity={a2} />
      {/* Richtung (indigo, nach oben) */}
      <Arrow x1={cx} y1={cy - 60} x2={cx} y2={cy - 240} color={COLORS.indigo} opacity={a3} />
      <div style={{ position: 'absolute', left: cx + 130, top: cy - 40, fontSize: 30, fontWeight: 700, color: COLORS.green, opacity: a1 }}>
        schneller
      </div>
      <div style={{ position: 'absolute', left: cx - 290, top: cy - 40, fontSize: 30, fontWeight: 700, color: COLORS.red, opacity: a2 }}>
        langsamer
      </div>
      <div style={{ position: 'absolute', left: cx + 20, top: cy - 250, fontSize: 30, fontWeight: 700, color: COLORS.indigo, opacity: a3 }}>
        andere Richtung
      </div>
      <Caption>Schneller, langsamer oder abbiegen – für jede Änderung braucht es eine Kraft.</Caption>
    </AbsoluteFill>
  );
};

// ── Szene 5: Alltag – Bus bremst, Fahrgast ruckelt nach vorn ───────────
const BusScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Bus bremst: bewegt sich rein, verzögert ab f=90
  const busX = interpolate(frame, [0, 90, 170], [-200, 700, 900], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  // Fahrgast (relativ zum Bus): ruckt beim Bremsen nach vorn
  const lean = interpolate(frame, [90, 120, 170], [0, 46, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const busW = 520;
  const busH = 220;
  const busY = GROUND_Y - busH - 8;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Im Alltag" title="Warum ruckelt man beim Bremsen nach vorn?" />
      <Ground />
      <div
        style={{
          position: 'absolute',
          left: busX,
          top: busY,
          width: busW,
          height: busH,
          borderRadius: 28,
          background: 'linear-gradient(180deg, #475569, #334155)',
          border: `3px solid ${COLORS.border}`,
        }}
      >
        {/* Fenster */}
        <div style={{ position: 'absolute', top: 26, left: 34, right: 34, height: 78, borderRadius: 12, background: '#0ea5e9', opacity: 0.35 }} />
        {/* Fahrgast */}
        <div
          style={{
            position: 'absolute',
            bottom: 22,
            left: 150 + lean,
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: COLORS.amber,
            transform: `rotate(${lean * 0.5}deg)`,
          }}
        />
        {/* Räder */}
        <div style={{ position: 'absolute', bottom: -26, left: 90, width: 56, height: 56, borderRadius: '50%', background: '#0f172a', border: '4px solid #64748b' }} />
        <div style={{ position: 'absolute', bottom: -26, right: 90, width: 56, height: 56, borderRadius: '50%', background: '#0f172a', border: '4px solid #64748b' }} />
      </div>
      {frame < 120 ? (
        <Caption>Der Bus bremst plötzlich ab …</Caption>
      ) : (
        <Caption color={COLORS.amber}>
          … dein Körper „will" sich weiterbewegen und ruckt nach vorn. Das ist Trägheit.
        </Caption>
      )}
    </AbsoluteFill>
  );
};

// ── Szene 6: Merksatz ──────────────────────────────────────────────────
const MerksatzScene: React.FC = () => (
  <AbsoluteFill>
    <MerksatzBox
      title="Trägheitsprinzip"
      footer="1. Newton'sches Gesetz"
    >
      Ohne wirkende Kraft ändert ein Körper seinen
      <br />
      Bewegungszustand nicht – er bleibt in Ruhe
      <br />
      oder bewegt sich gleichförmig weiter.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Szene 7: Outro ─────────────────────────────────────────────────────
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={120} />
      <div
        style={{
          marginTop: 40,
          fontSize: 44,
          fontWeight: 700,
          color: COLORS.muted,
          opacity: s,
        }}
      >
        Physik verstehen – Schritt für Schritt.
      </div>
    </AbsoluteFill>
  );
};

// ── Gesamtkomposition ──────────────────────────────────────────────────
export const Traegheit: React.FC = () => {
  return (
    <Bg>
      <Series>
        <Series.Sequence durationInFrames={90}>
          <Intro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={250}>
          <RuheScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={240}>
          <BewegungScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={240}>
          <KraftScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={240}>
          <BusScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={240}>
          <MerksatzScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <Outro />
        </Series.Sequence>
      </Series>
    </Bg>
  );
};

// Gesamtlänge in Frames (Summe oben) – auch in Root.tsx verwendet
export const TRAEGHEIT_DURATION = 90 + 250 + 240 + 240 + 240 + 240 + 120; // = 1420
