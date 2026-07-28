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
import timings from '../narration/magnetfeld-jg10.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Magnet steht horizontal, N rechts. Zentrum der Bühne. ──────────────
const MCX = 760;
const MCY = 560;

// Analytisches Dipolfeld (Moment längs +x, N rechts). Liefert Richtung +
// Betrag an einer Stelle relativ zum Magnetzentrum. Screen-Koordinaten
// (y nach unten). Nah am Magneten geклemmt, damit es nicht explodiert.
const dipole = (px: number, py: number) => {
  const dx = px - MCX;
  const dy = py - MCY;
  const r2 = Math.max(dx * dx + dy * dy, 60 * 60);
  const r = Math.sqrt(r2);
  const r5 = r2 * r2 * r;
  const bx = (3 * dx * dx - r2) / r5;
  const by = (3 * dx * dy) / r5;
  const mag = Math.sqrt(bx * bx + by * by);
  return { bx, by, mag };
};

// Umrechnung Feldvektor → Nadelwinkel (0 = oben, im Uhrzeigersinn).
const needleDeg = (bx: number, by: number) => (Math.atan2(bx, -by) * 180) / Math.PI;

// Eisenspäne: kurze Striche entlang der Feldrichtung an Rasterpunkten.
const IronFilings: React.FC<{ progress: number }> = ({ progress }) => {
  const seg: React.ReactNode[] = [];
  let idx = 0;
  for (let x = 240; x <= 1300; x += 62) {
    for (let y = 250; y <= 900; y += 60) {
      const dx = x - MCX;
      const dy = y - MCY;
      // innerhalb des Magneten und ganz nah aussparen
      if (Math.abs(dx) < 210 && Math.abs(dy) < 66) continue;
      const r = Math.hypot(dx, dy);
      if (r < 120) continue;
      const { bx, by, mag } = dipole(x, y);
      const ux = bx / mag;
      const uy = by / mag;
      const len = 12 + Math.min(16, mag * 4.5e6); // dichter/kürzer weit weg
      // gestaffeltes Einblenden von den Polen nach außen
      const appear = interpolate(progress, [Math.min(0.85, r / 1400), Math.min(1, r / 1400 + 0.25)], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      if (appear <= 0.01) continue;
      seg.push(
        <line
          key={idx++}
          x1={x - ux * len}
          y1={y - uy * len}
          x2={x + ux * len}
          y2={y + uy * len}
          stroke="#e2e8f0"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={appear * 0.9}
        />
      );
    }
  }
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
      {seg}
    </svg>
  );
};

// ── Szenen ─────────────────────────────────────────────────────────────

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 620, height: 300 }}>
        <FieldLines cx={310} cy={150} L={150} bows={[40, 95, 165]} progress={0.3 + pulse * 0.5} />
        <div style={{ position: 'absolute', left: 310 - 130, top: 150 - 34 }}>
          <BarMagnet cx={130} cy={34} w={260} h={68} />
        </div>
      </div>
      <StarLogo size={64} />
      <div style={{ marginTop: 14, fontSize: 60, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Das unsichtbare Feld
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Was ist rund um einen Magneten los?
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  // Späne rieseln ab Frame 40 herein und ordnen sich
  const prog = interpolate(frame, [40, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Eisenspäne machen es sichtbar" />
      <IronFilings progress={prog} />
      <BarMagnet cx={MCX} cy={MCY} w={420} h={104} />
      <div style={{ position: 'absolute', left: 1360, top: 470, width: 420, fontSize: 30, fontWeight: 800, color: prog > 0.5 ? COLORS.sky : COLORS.muted }}>
        {prog > 0.5 ? '🔎 Bögen von Pol zu Pol – überall im Raum' : '🧲 blanker Magnet auf Papier'}
      </div>
      <Caption delay={30}>Streut man Eisenspäne, ordnen sie sich in Bögen: Der Raum um den Magneten ist erfüllt.</Caption>
    </AbsoluteFill>
  );
};

const RichtungScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  // Prüfkompass wandert auf einem Bogen um den Magneten
  const th = interpolate(frame, [20, 190], [-55, 235], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const R = 330;
  const rad = (th * Math.PI) / 180;
  const px = MCX + R * Math.cos(rad);
  const py = MCY + R * Math.sin(rad) * 0.62;
  const { bx, by } = dipole(px, py);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Richtung" title="Überall zeigt die Nadel eine Richtung" />
      <div style={{ opacity: f }}>
        <FieldLines cx={MCX} cy={MCY} L={210} bows={[60, 140, 240, 350]} progress={f} />
      </div>
      <BarMagnet cx={MCX} cy={MCY} w={420} h={104} />
      <CompassNeedle x={px} y={py} size={104} angle={needleDeg(bx, by)} />
      <div style={{ position: 'absolute', left: 1360, top: 430, width: 440, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, fontSize: 27, fontWeight: 800 }}>
          Die rote Spitze dreht sich mit – außen immer von N nach S.
        </div>
      </div>
      <Caption delay={30}>Ein Prüfkompass zeigt an jeder Stelle die Feldrichtung – das Feld ist überall, nicht nur am Magneten.</Caption>
    </AbsoluteFill>
  );
};

const StaerkeScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  // Sonde pendelt vom Pol (nah) nach außen (fern)
  const t = 0.5 + 0.5 * Math.sin((frame - 20) / 34);
  const px = MCX + 250 + t * 640;
  const py = MCY;
  const { mag } = dipole(px, py);
  const magPol = dipole(MCX + 250, MCY).mag;
  const strength = Math.min(1, mag / magPol);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Stärke" title="Dicht = stark, weit = schwach" />
      <div style={{ opacity: f }}>
        <FieldLines cx={MCX} cy={MCY} L={210} bows={[60, 140, 240, 350]} progress={f} />
      </div>
      <BarMagnet cx={MCX} cy={MCY} w={420} h={104} />
      {/* Sonde */}
      <div style={{ position: 'absolute', left: px - 20, top: py - 20, width: 40, height: 40, borderRadius: '50%', background: COLORS.amber, boxShadow: `0 0 ${10 + strength * 40}px rgba(251,191,36,${0.4 + strength * 0.6})`, border: '3px solid #fff' }} />
      {/* Stärke-Balken */}
      <div style={{ position: 'absolute', left: 1360, top: 430, width: 440, opacity: f }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.muted, marginBottom: 10 }}>Feldstärke an der Sonde</div>
        <div style={{ width: '100%', height: 44, borderRadius: 12, background: COLORS.panel, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <div style={{ width: `${strength * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.amber}, ${COLORS.red})` }} />
        </div>
        <div style={{ fontSize: 25, fontWeight: 800, marginTop: 12, color: strength > 0.55 ? COLORS.red : COLORS.sky }}>
          {strength > 0.55 ? 'nah am Pol → stark' : 'weit weg → schwach'}
        </div>
      </div>
      <Caption delay={30}>Wo die Feldlinien dicht liegen, ist das Feld stark – an den Polen am stärksten.</Caption>
    </AbsoluteFill>
  );
};

const ModellScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const strike = interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // kleine Nadel GENAU zwischen zwei Linien
  const px = MCX + 40;
  const py = MCY - 300;
  const { bx, by } = dipole(px, py);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Vorsicht, Denkfehler" title="Auch zwischen den Linien ist Feld" />
      <div style={{ opacity: f }}>
        <FieldLines cx={MCX} cy={MCY} L={210} bows={[120, 300]} progress={f} arrows={false} />
      </div>
      <BarMagnet cx={MCX} cy={MCY} w={420} h={104} />
      {/* Lupe/Nadel zwischen den Linien */}
      <div style={{ position: 'absolute', left: px - 70, top: py - 70, width: 140, height: 140, borderRadius: '50%', border: `4px solid ${COLORS.green}`, background: 'rgba(34,197,94,0.10)' }} />
      <CompassNeedle x={px} y={py} size={84} angle={needleDeg(bx, by)} ring={false} />
      <div style={{ position: 'absolute', left: 1240, top: 300, width: 560, opacity: f }}>
        <div style={{ position: 'relative', padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.red}`, fontSize: 27, fontWeight: 800, marginBottom: 16 }}>
          Feldlinien sind echte Fäden
          <div style={{ position: 'absolute', left: 14, right: 14, top: '52%', height: 5, background: COLORS.red, transform: `scaleX(${strike})`, transformOrigin: 'left', borderRadius: 3 }} />
        </div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 27, fontWeight: 800 }}>
          ✅ nur eine Zeichenhilfe – die Nadel lenkt auch dazwischen aus
        </div>
      </div>
      <Sfx sound="pop" at={70} volume={0.35} />
      <Caption delay={30}>Die Linien sind gezeichnet – das Feld selbst füllt den ganzen Raum lückenlos.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Das Magnetfeld" footer="Richtung: außen von N nach S · dicht = stark">
      Um jeden Magneten liegt ein Magnetfeld.
      <br />
      Feldlinien zeigen seine Richtung und Stärke.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🧭', 'Kompass', 'zeigt die Feldrichtung'],
    ['⚙️', 'Motor & Generator', 'nutzen das Feld gleich'],
    ['🏥', 'MRT', 'starkes Feld im Körper'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Das Feld ist der Werkzeugkasten" />
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
      <Caption delay={40}>Motoren, Generatoren und Transformatoren bauen alle auf diesem Feld auf.</Caption>
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
  { id: 'beobachten', C: BeobachtenScene, min: 260 },
  { id: 'richtung', C: RichtungScene, min: 260 },
  { id: 'staerke', C: StaerkeScene, min: 250 },
  { id: 'modell', C: ModellScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const MAGNETFELD_JG10_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const MagnetfeldJg10: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={MAGNETFELD_JG10_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/magnetfeld-jg10/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
