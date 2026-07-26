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
  Easing,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, SceneTitle, Caption, MerksatzBox, StarLogo } from '../components';
import timings from '../narration/traegheitAlltag.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

const GROUND_Y = 780;

const Ground: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: GROUND_Y, height: 8, background: COLORS.ground }} />
);

type SceneProps = { dur: number };

// Auto (Seitenansicht, fährt nach rechts). lean>0 = Kopf nach vorn.
const Car: React.FC<{ x: number; lean: number; brake?: boolean }> = ({ x, lean, brake }) => {
  const bodyW = 470;
  const bodyH = 150;
  const topY = GROUND_Y - bodyH - 40;
  return (
    <div style={{ position: 'absolute', left: x, top: topY, width: bodyW, height: bodyH + 40 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: bodyW, height: bodyH, borderRadius: '46px 70px 26px 26px', background: 'linear-gradient(180deg,#64748b,#475569)', border: `3px solid ${COLORS.border}` }} />
      <div style={{ position: 'absolute', left: bodyW * 0.4, top: 18, width: bodyW * 0.5, height: bodyH * 0.42, borderRadius: 16, background: '#0ea5e9', opacity: 0.35 }} />
      <div style={{ position: 'absolute', left: bodyW * 0.2, top: bodyH * 0.3, width: 22, height: bodyH * 0.55, borderRadius: 8, background: '#334155' }} />
      <div style={{ position: 'absolute', left: bodyW * 0.23 + lean, top: bodyH * 0.24, width: 50, height: 50, borderRadius: '50%', background: COLORS.amber, transform: `rotate(${lean * 0.5}deg)` }} />
      <div style={{ position: 'absolute', left: bodyW * 0.17, top: bodyH - 6, width: 66, height: 66, borderRadius: '50%', background: '#0f172a', border: '5px solid #64748b' }} />
      <div style={{ position: 'absolute', left: bodyW * 0.66, top: bodyH - 6, width: 66, height: 66, borderRadius: '50%', background: '#0f172a', border: '5px solid #64748b' }} />
      {brake ? <div style={{ position: 'absolute', left: -8, top: bodyH * 0.5, width: 16, height: 30, borderRadius: 6, background: COLORS.red, boxShadow: `0 0 26px ${COLORS.red}` }} /> : null}
    </div>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={104} />
      <div style={{ marginTop: 42, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Trägheit im Alltag
      </div>
      <div style={{ marginTop: 22, fontSize: 40, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Warum werde ich beim Anfahren in den Sitz gedrückt und beim Bremsen nach vorn geworfen?
      </div>
    </AbsoluteFill>
  );
};

const AnfahrenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [Math.round(dur * 0.12), Math.round(dur * 0.92)], [180, 1080], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const lean = interpolate(frame, [Math.round(dur * 0.12), Math.round(dur * 0.28), Math.round(dur * 0.9), dur], [0, -40, -40, -12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Anfahren" title="Du wirst in den Sitz gedrückt" />
      <Ground />
      <Car x={x} lean={lean} />
      {frame < Math.round(dur * 0.5) ? (
        <Caption>Das Auto fährt an – dein Körper „will" erst mal in Ruhe bleiben.</Caption>
      ) : (
        <Caption color={COLORS.amber}>Der Sitz nimmt dich mit: Es fühlt sich an, als würdest du nach hinten gedrückt.</Caption>
      )}
    </AbsoluteFill>
  );
};

const BremsenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const brakeStart = Math.round(dur * 0.34);
  const x = interpolate(frame, [0, brakeStart, dur], [140, 940, 1120], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const braking = frame >= brakeStart;
  const lean = interpolate(frame, [brakeStart, brakeStart + 32, dur], [0, 44, 22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Bremsen" title="Du wirst nach vorn geworfen" />
      <Ground />
      <Car x={x} lean={lean} brake={braking} />
      {frame < brakeStart + 26 ? (
        <Caption>Das Auto bremst – dein Körper „will" mit dem alten Tempo weiterfahren.</Caption>
      ) : (
        <Caption color={COLORS.red}>Deshalb wirst du nach vorn geworfen – der Sicherheitsgurt hält dich zurück.</Caption>
      )}
    </AbsoluteFill>
  );
};

const InfoCard: React.FC<{ icon: string; title: string; text: string; delay: number }> = ({ icon, title, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 180 } });
  return (
    <div style={{ width: 460, padding: '34px 30px', borderRadius: 24, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
      <div style={{ fontSize: 72, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 38, fontWeight: 800, marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 30, fontWeight: 500, color: COLORS.muted, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

const SicherheitScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Darum ist es wichtig" title="Trägheit &amp; Sicherheit" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 60 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <InfoCard icon="🔒" title="Sicherheitsgurt" text="hält dich beim Bremsen zurück" delay={12} />
        <InfoCard icon="💺" title="Kopfstütze" text="schützt den Hals beim Auffahrunfall" delay={34} />
        <InfoCard icon="↪️" title="Kurve" text="es zieht dich nach außen" delay={56} />
      </div>
    </AbsoluteFill>
    <Caption delay={70}>Gurt, Kopfstütze und das Ziehen in der Kurve – alles ist Trägheit.</Caption>
  </AbsoluteFill>
);

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <MerksatzBox title="Trägheit im Alltag" footer="Deshalb: immer anschnallen!">
      Dein Körper behält seinen Bewegungszustand bei.
      <br />
      Beim Anfahren bleibst du zurück,
      <br />
      beim Bremsen willst du weiter.
    </MerksatzBox>
  </AbsoluteFill>
);

const Outro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <StarLogo size={120} />
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, color: COLORS.muted, opacity: s }}>Physik verstehen – Schritt für Schritt.</div>
    </AbsoluteFill>
  );
};

const SCENES: { id: string; C: React.FC<SceneProps>; min: number }[] = [
  { id: 'intro', C: Intro, min: 110 },
  { id: 'anfahren', C: AnfahrenScene, min: 210 },
  { id: 'bremsen', C: BremsenScene, min: 210 },
  { id: 'sicherheit', C: SicherheitScene, min: 180 },
  { id: 'merksatz', C: MerksatzScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const TRAEGHEIT_ALLTAG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const TraegheitAlltag: React.FC = () => {
  return (
    <Bg>
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/traegheitAlltag/${s.id}.wav`)} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
