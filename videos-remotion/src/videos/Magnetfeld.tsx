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
import { BarMagnet, FieldLines, CompassNeedle, useFade } from '../magnet';
import timings from '../narration/magnetfeld.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// deterministische Eisenspäne entlang der Feldlinien (kein Math.random)
const filings = (() => {
  const cx = 960;
  const cy = 560;
  const L = 190;
  const pts: { x: number; y: number; a: number }[] = [];
  const bows = [55, 130, 220, 320];
  bows.forEach((d) => {
    for (let s = 0; s <= 1.0001; s += 0.1) {
      // Punkt auf kubischer Bezier N→S (oben und unten)
      const N = [cx + L, cy];
      const S = [cx - L, cy];
      [-1, 1].forEach((sign) => {
        const c1 = [cx + L, cy + sign * d];
        const c2 = [cx - L, cy + sign * d];
        const mt = 1 - s;
        const x = mt * mt * mt * N[0] + 3 * mt * mt * s * c1[0] + 3 * mt * s * s * c2[0] + s * s * s * S[0];
        const y = mt * mt * mt * N[1] + 3 * mt * mt * s * c1[1] + 3 * mt * s * s * c2[1] + s * s * s * S[1];
        // Tangentenwinkel grob
        const a = sign * (s - 0.5) * 60;
        pts.push({ x, y, a });
      });
    }
  });
  return pts;
})();

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const p = interpolate(frame, [30, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 700, height: 260, marginBottom: 20 }}>
        <FieldLines cx={350} cy={130} L={110} bows={[40, 90, 150]} progress={p} arrows={false} />
        <BarMagnet cx={350} cy={130} w={240} h={70} />
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 82, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie sieht ein Magnetfeld aus?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie macht man etwas Unsichtbares sichtbar?
      </div>
    </AbsoluteFill>
  );
};

// ── Eisenspäne ─────────────────────────────────────────────────────────
const SpaeneScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [20, dur * 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Sichtbar machen" title="Eisenspäne ordnen sich" />
      {filings.map((f, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: f.x - 9,
            top: f.y - 2,
            width: 18,
            height: 4,
            borderRadius: 2,
            background: '#94a3b8',
            transform: `rotate(${f.a}deg)`,
            opacity: reveal * (i / filings.length < reveal ? 1 : 0),
          }}
        />
      ))}
      <BarMagnet cx={960} cy={560} w={380} h={100} />
      <Sfx sound="whoosh" at={20} volume={0.35} />
      <Caption delay={Math.round(dur * 0.55)}>Über dem Magneten ordnen sich die Späne zu geschwungenen Linien.</Caption>
    </AbsoluteFill>
  );
};

// ── Feldlinien N→S ─────────────────────────────────────────────────────
const FeldlinienScene: React.FC<SceneProps> = () => {
  const p = useFade(14, 40);
  const lab = useFade(60);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Feldlinien" title="Immer von Nord nach Süd" />
      <FieldLines cx={960} cy={560} L={190} progress={p} />
      <BarMagnet cx={960} cy={560} w={380} h={100} />
      <div style={{ position: 'absolute', left: 1240, top: 400, fontSize: 28, fontWeight: 800, color: COLORS.red, opacity: lab }}>N</div>
      <div style={{ position: 'absolute', left: 640, top: 400, fontSize: 28, fontWeight: 800, color: '#3b82f6', opacity: lab }}>S</div>
      <div style={{ position: 'absolute', left: 800, top: 250, fontSize: 28, fontWeight: 800, color: COLORS.sky, opacity: lab }}>Pfeile zeigen die Richtung: N → S</div>
      <Sfx sound="pling" at={20} volume={0.4} />
      <Caption delay={70}>Feldlinien zeigen, wohin eine Kompassnadel hier zeigen würde.</Caption>
    </AbsoluteFill>
  );
};

// ── Stärke: Dichte ─────────────────────────────────────────────────────
const StaerkeScene: React.FC<SceneProps> = () => {
  const p = useFade(10, 30);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Wie stark?" title="Dichte Linien = starkes Feld" />
      <FieldLines cx={960} cy={560} L={190} progress={p} />
      <BarMagnet cx={960} cy={560} w={380} h={100} />
      {/* Marker an den Polen (dicht) und außen (weit) */}
      <div style={{ position: 'absolute', left: 1120, top: 500, width: 120, height: 120, borderRadius: '50%', border: `4px solid ${COLORS.amber}` }} />
      <div style={{ position: 'absolute', left: 1130, top: 630, fontSize: 26, fontWeight: 800, color: COLORS.amber }}>stark</div>
      <div style={{ position: 'absolute', left: 900, top: 180, width: 120, height: 120, borderRadius: '50%', border: `4px solid ${COLORS.muted}` }} />
      <div style={{ position: 'absolute', left: 910, top: 150, fontSize: 26, fontWeight: 800, color: COLORS.muted }}>schwächer</div>
      <Sfx sound="pop" at={12} volume={0.34} />
      <Caption delay={30}>Nah an den Polen liegen die Linien eng – dort ist das Feld am stärksten.</Caption>
    </AbsoluteFill>
  );
};

// ── Prüfkompass ────────────────────────────────────────────────────────
const PruefkompassScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [10, dur - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Kompass wandert um den Magneten, Nadel dreht mit Winkel
  const ang = t * Math.PI * 2;
  const cx = 960 + Math.cos(ang) * 320;
  const cy = 560 + Math.sin(ang) * 240;
  const needle = (ang * 180) / Math.PI + 90;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Abtasten" title="Der Prüfkompass folgt dem Feld" />
      <FieldLines cx={960} cy={560} L={190} progress={0.5} arrows={false} />
      <BarMagnet cx={960} cy={560} w={380} h={100} />
      <CompassNeedle x={cx} y={cy} size={110} angle={needle} />
      <Sfx sound="whoosh" at={10} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Die Nadel richtet sich überall entlang der Feldlinien aus.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Magnetfeld" footer="dicht = stark, außen von N nach S">
      Das Magnetfeld ist der Raum
      <br />
      um einen Magneten.
      <br />
      Feldlinien laufen außen N → S.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übertragen" title="Das Feld der Erde" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <div style={{ display: 'flex', gap: 60, alignItems: 'center', opacity: f }}>
          <div style={{ fontSize: 240 }}>🌍</div>
          <div style={{ maxWidth: 640 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.sky }}>🛡️ lenkt Sonnenteilchen ab</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.green, marginTop: 18 }}>🌌 lässt Polarlichter leuchten</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Das Erdmagnetfeld reicht weit ins All und schützt uns.</Caption>
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
  { id: 'spaene', C: SpaeneScene, min: 260 },
  { id: 'feldlinien', C: FeldlinienScene, min: 240 },
  { id: 'staerke', C: StaerkeScene, min: 220 },
  { id: 'pruefkompass', C: PruefkompassScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MAGNETFELD_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Magnetfeld: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNETFELD_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/magnetfeld/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
