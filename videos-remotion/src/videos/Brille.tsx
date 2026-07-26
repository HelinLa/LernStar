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
import { useFade } from '../lens';
import timings from '../narration/brille.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const EYE_X = 1150;
const EYE_Y = 540;
const EYE_R = 210;

// Auge mit Bildpunkt: focus = wo sich die Strahlen treffen (x). retinaX = Netzhaut.
const EyeFocus: React.FC<{ focusX: number; glasses?: 'konkav' | 'konvex' | null }> = ({ focusX, glasses = null }) => {
  const lensX = EYE_X - EYE_R + 40;
  const retinaX = EYE_X + EYE_R - 20;
  const glassX = 640;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      <circle cx={EYE_X} cy={EYE_Y} r={EYE_R} fill="rgba(148,163,184,0.12)" stroke={COLORS.muted} strokeWidth={4} />
      {/* Netzhaut */}
      <path d={`M ${retinaX},${EYE_Y - 140} A 160 160 0 0 1 ${retinaX},${EYE_Y + 140}`} fill="none" stroke={COLORS.green} strokeWidth={8} opacity={0.8} />
      {/* Augenlinse */}
      <ellipse cx={lensX} cy={EYE_Y} rx={24} ry={100} fill="rgba(56,189,248,0.3)" stroke={COLORS.sky} strokeWidth={4} />
      {/* Brille */}
      {glasses === 'konkav' ? (
        <path d={`M ${glassX - 24},${EYE_Y - 120} L ${glassX + 24},${EYE_Y - 120} Q ${glassX - 4},${EYE_Y} ${glassX + 24},${EYE_Y + 120} L ${glassX - 24},${EYE_Y + 120} Q ${glassX + 4},${EYE_Y} ${glassX - 24},${EYE_Y - 120} Z`} fill="rgba(129,140,248,0.25)" stroke={COLORS.indigo} strokeWidth={4} />
      ) : null}
      {glasses === 'konvex' ? (
        <path d={`M ${glassX},${EYE_Y - 120} Q ${glassX + 34},${EYE_Y} ${glassX},${EYE_Y + 120} Q ${glassX - 34},${EYE_Y} ${glassX},${EYE_Y - 120} Z`} fill="rgba(251,191,36,0.22)" stroke={COLORS.amber} strokeWidth={4} />
      ) : null}
      {/* zwei Strahlen, die sich in focusX treffen */}
      <line x1={200} y1={EYE_Y - 90} x2={lensX} y2={EYE_Y - 60} stroke={COLORS.amber} strokeWidth={3} />
      <line x1={200} y1={EYE_Y + 90} x2={lensX} y2={EYE_Y + 60} stroke={COLORS.sky} strokeWidth={3} />
      <line x1={lensX} y1={EYE_Y - 60} x2={focusX} y2={EYE_Y} stroke={COLORS.amber} strokeWidth={3} />
      <line x1={lensX} y1={EYE_Y + 60} x2={focusX} y2={EYE_Y} stroke={COLORS.sky} strokeWidth={3} />
      {/* Bildpunkt */}
      <circle cx={focusX} cy={EYE_Y} r={10} fill={Math.abs(focusX - retinaX) < 14 ? COLORS.green : COLORS.red} />
    </svg>
  );
};

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 190, marginBottom: 20 }}>👓</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie korrigiert eine Brille?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wenn das Bild nicht genau auf der Netzhaut landet.
      </div>
    </AbsoluteFill>
  );
};

// ── Kurzsichtig ────────────────────────────────────────────────────────
const KurzsichtigScene: React.FC<SceneProps> = () => {
  const lab = useFade(30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Sehfehler 1" title="Kurzsichtig: Bild zu früh" />
      <EyeFocus focusX={EYE_X + 40} />
      <div style={{ position: 'absolute', left: 900, top: 320, fontSize: 26, fontWeight: 800, color: COLORS.red, opacity: lab }}>Bild VOR der Netzhaut → Ferne unscharf</div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={40}>Bei Kurzsichtigkeit ist der Augapfel zu lang – das Bild liegt vor der Netzhaut.</Caption>
    </AbsoluteFill>
  );
};

// ── Zerstreuungslinse korrigiert ───────────────────────────────────────
const ZerstreuungScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const on = frame > dur * 0.4;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Korrektur" title="Zerstreuungslinse" />
      <EyeFocus focusX={on ? EYE_X + EYE_R - 20 : EYE_X + 40} glasses={on ? 'konkav' : null} />
      <div style={{ position: 'absolute', left: 560, top: 320, fontSize: 26, fontWeight: 800, color: COLORS.indigo }}>{on ? 'Konkavlinse spreizt → Bild nach hinten' : ''}</div>
      <div style={{ position: 'absolute', left: 800, top: 250, fontSize: 30, fontWeight: 800, color: on ? COLORS.green : COLORS.red }}>{on ? '✅ Bild jetzt auf der Netzhaut' : 'ohne Brille: unscharf'}</div>
      <Sfx sound="pling" at={Math.round(dur * 0.4)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.4) + 6}>Eine Zerstreuungslinse spreizt die Strahlen – das Bild rückt auf die Netzhaut.</Caption>
    </AbsoluteFill>
  );
};

// ── Weitsichtig + Sammellinse ──────────────────────────────────────────
const WeitsichtigScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const on = frame > dur * 0.45;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Sehfehler 2" title="Weitsichtig: Sammellinse hilft" />
      <EyeFocus focusX={on ? EYE_X + EYE_R - 20 : EYE_X + EYE_R + 90} glasses={on ? 'konvex' : null} />
      <div style={{ position: 'absolute', left: 900, top: 320, fontSize: 26, fontWeight: 800, color: on ? COLORS.green : COLORS.red }}>{on ? '✅ Sammellinse holt das Bild nach vorne' : 'Bild HINTER der Netzhaut'}</div>
      <Sfx sound="pling" at={Math.round(dur * 0.45)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.45) + 6}>Beim Weitsichtigen liegt das Bild hinter der Netzhaut – eine Sammellinse bündelt stärker.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Brille" footer="die passende Linse rückt das Bild auf die Netzhaut">
      Kurzsichtig: Bild vor der Netzhaut →
      <br />
      Zerstreuungslinse. Weitsichtig: Bild
      <br />
      hinter der Netzhaut → Sammellinse.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Auch als Kontaktlinse" />
      <div style={{ display: 'flex', gap: 60, opacity: f }}>
        <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, textAlign: 'center' }}>
          <div style={{ fontSize: 80 }}>👓</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>Brille & Kontaktlinse</div>
        </div>
        <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
          <div style={{ fontSize: 80 }}>🔎</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>Linse verrät den Sehfehler</div>
        </div>
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>An der Linsenform erkennst du, ob jemand kurz- oder weitsichtig ist.</Caption>
    </AbsoluteFill>
  );
};

// ── Outro ──────────────────────────────────────────────────────────────
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
  { id: 'intro', C: Intro, min: 130 },
  { id: 'kurzsichtig', C: KurzsichtigScene, min: 220 },
  { id: 'zerstreuung', C: ZerstreuungScene, min: 260 },
  { id: 'weitsichtig', C: WeitsichtigScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 190 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BRILLE_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Brille: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BRILLE_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/brille/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
