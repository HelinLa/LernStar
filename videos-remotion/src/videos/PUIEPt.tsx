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
import { useFade } from '../electric';
import timings from '../narration/p-u-i-e-p-t.timings.json';

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
      <div style={{ display: 'flex', gap: 50, marginBottom: 30, fontSize: 70, fontWeight: 900 }}>
        <div style={{ color: COLORS.red }}>P=U·I</div><div style={{ color: COLORS.sky }}>E=P·t</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 80, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Leistung & Energie
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Die zwei Schlüsselformeln – sicher zusammengefasst.
      </div>
    </AbsoluteFill>
  );
};

const LeistungScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Formel 1" title="Leistung P = U · I" />
      <div style={{ fontSize: 130, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.red }}>P</span> = <span style={{ color: COLORS.green }}>U</span> · <span style={{ color: COLORS.amber }}>I</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.muted, opacity: f }}>Einheit Watt (W) · Energie pro Sekunde</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Leistung P ist Spannung mal Stromstärke – Einheit Watt.</Caption>
    </AbsoluteFill>
  );
};

const EnergieScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Formel 2" title="Energie E = P · t" />
      <div style={{ fontSize: 130, fontWeight: 900, opacity: f }}>
        <span style={{ color: COLORS.sky }}>E</span> = <span style={{ color: COLORS.red }}>P</span> · <span style={{ color: COLORS.amber }}>t</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.muted, opacity: f }}>Einheit Wattstunde / kWh · 1 kWh = 1000 Wh</div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Energie E ist Leistung mal Zeit – Einheit Wattstunde oder Kilowattstunde.</Caption>
    </AbsoluteFill>
  );
};

const KetteScene: React.FC<SceneProps> = () => {
  const f = useFade(16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Kette" title="Von U, I bis zur Rechnung" />
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', opacity: f, fontSize: 30, fontWeight: 800 }}>
        <div style={{ padding: '18px 24px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.green}` }}>U · I</div>
        <div style={{ color: COLORS.muted }}>→</div>
        <div style={{ padding: '18px 24px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.red}` }}>P</div>
        <div style={{ color: COLORS.muted }}>·t →</div>
        <div style={{ padding: '18px 24px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>E (kWh)</div>
        <div style={{ color: COLORS.muted }}>·Preis →</div>
        <div style={{ padding: '18px 24px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}` }}>💶 Kosten</div>
      </div>
      <Sfx sound="pling" at={16} volume={0.4} />
      <Caption delay={40}>Von U und I bis zum Betrag auf deiner Stromrechnung – eine Kette.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Leistung & Energie" footer="1 kWh = 1000 Wh">
      Leistung P = U · I (Watt).
      <br />
      Energie E = P · t (Wattstunde).
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Das Handwerkszeug" />
      <div style={{ fontSize: 170, opacity: f }}>🧰⚡</div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: COLORS.amber, maxWidth: 1300, textAlign: 'center', opacity: f }}>
        Mit diesen zwei Formeln berechnest du für jedes Gerät Verbrauch und Kosten.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>P = U·I und E = P·t – das Handwerkszeug der elektrischen Leistung.</Caption>
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
  { id: 'intro', C: Intro, min: 130 },
  { id: 'leistung', C: LeistungScene, min: 220 },
  { id: 'energie', C: EnergieScene, min: 220 },
  { id: 'kette', C: KetteScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const P_U_I_E_P_T_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const PUIEPt: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={P_U_I_E_P_T_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/p-u-i-e-p-t/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
