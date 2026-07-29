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
import { Nucleus } from '../nuclear';
import timings from '../narration/kernfusion.timings.json';

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
      <div style={{ fontSize: 130, transform: `scale(${1 + Math.sin(frame / 10) * 0.05})` }}>☀️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Woher nimmt die Sonne ihre Energie?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Die Kernfusion
      </div>
    </AbsoluteFill>
  );
};

const SonneScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="In der Sonne" title="Wasserstoff verschmilzt zu Helium" />
      <div style={{ position: 'absolute', left: 420, top: 440, fontSize: 260, filter: 'drop-shadow(0 0 60px rgba(251,191,36,0.6))' }}>☀️</div>
      <div style={{ position: 'absolute', left: 1120, top: 440, width: 720, fontSize: 24, fontWeight: 800, opacity: f }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, marginBottom: 12 }}>Im Inneren der Sonne herrschen Millionen Grad und ein riesiger Druck.</div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}` }}>Dort werden Wasserstoffkerne zu Heliumkernen zusammengepresst – und dabei wird gewaltig viel Energie frei. Das ist die Kernfusion.</div>
      </div>
      <Caption delay={30}>Die Sonne bezieht ihre Energie aus der Kernfusion. In ihrem Inneren, bei Millionen Grad, verschmelzen Wasserstoffkerne zu Helium und setzen dabei riesige Energie frei.</Caption>
    </AbsoluteFill>
  );
};

const PrinzipScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const fused = frame > 65;
  const app = fused ? 0 : interpolate(frame, [10, 60], [340, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flash = fused ? interpolate(frame, [65, 95], [1, 0], { extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Das Prinzip" title="Zwei leichte Kerne werden eins" />
      {flash > 0 && (
        <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1920 1080">
          <circle cx={640} cy={540} r={80 + (1 - flash) * 180} fill={`rgba(251,191,36,${flash * 0.5})`} />
        </svg>
      )}
      {!fused ? (
        <>
          <Nucleus cx={640 - app} cy={540} protons={1} neutrons={1} r={48} />
          <Nucleus cx={640 + app} cy={540} protons={1} neutrons={2} r={52} />
        </>
      ) : (
        <>
          <Nucleus cx={620} cy={540} protons={2} neutrons={2} r={64} />
          <circle cx={900} cy={440} r={15} fill="#e2e8f0" />
        </>
      )}
      <div style={{ position: 'absolute', left: 1140, top: 460, width: 700, fontSize: 24, fontWeight: 800 }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.border}`, marginBottom: 12 }}>Zwei leichte Wasserstoffkerne (Deuterium + Tritium) werden zusammengepresst.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>Sie verschmelzen zu einem Heliumkern, dazu ein Neutron – und sehr viel Energie.</div>
      </div>
      <Sfx sound="impact" at={65} volume={0.4} />
      <Caption delay={30}>Bei der Fusion presst man zwei leichte Kerne zusammen, zum Beispiel zwei Wasserstoffsorten. Sie verschmelzen zu einem Heliumkern und setzen dabei Energie frei.</Caption>
    </AbsoluteFill>
  );
};

const VergleichScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Der Unterschied" title="Fusion und Spaltung sind Gegenteile" />
      <div style={{ display: 'flex', gap: 40, opacity: f, marginTop: 30 }}>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>☀️ Fusion</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Leichte Kerne werden zusammengefügt. Brennstoff: Wasserstoff aus Wasser – nahezu unbegrenzt.</div>
        </div>
        <div style={{ width: 560, padding: '30px 26px', borderRadius: 18, background: 'rgba(239,68,68,0.14)', border: `2px solid ${COLORS.red}` }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>⚛️ Spaltung</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.muted }}>Schwere Kerne werden zerteilt. Brennstoff: Uran – begrenzt, langlebiger Müll.</div>
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: 26, fontWeight: 800, color: COLORS.green, opacity: f }}>Fusion erzeugt kaum langlebigen radioaktiven Abfall.</div>
      <Sfx sound="pop" at={12} volume={0.3} />
      <Caption delay={30}>Fusion und Spaltung sind Gegenteile: Bei der Fusion fügt man leichte Kerne zusammen, bei der Spaltung zerteilt man schwere. Die Fusion hätte kaum langlebigen Müll.</Caption>
    </AbsoluteFill>
  );
};

const ErdeScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Auf der Erde" title="Extrem schwer nachzubauen" />
      <div style={{ fontSize: 120, opacity: f }}>🔬🌀</div>
      <div style={{ opacity: f, marginTop: 20, width: 1300 }}>
        <div style={{ padding: '20px 24px', borderRadius: 16, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, fontSize: 25, fontWeight: 800, marginBottom: 14 }}>
          Man muss das Gas auf über 100 Millionen Grad erhitzen. Kein Material hält das aus – deshalb hält ein starkes Magnetfeld das heiße Plasma berührungslos in der Schwebe.
        </div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(34,197,94,0.14)', border: `2px solid ${COLORS.green}`, fontSize: 24, fontWeight: 800 }}>
          Forschungsanlagen wie ITER arbeiten daran, die Fusion zur sauberen Energiequelle der Zukunft zu machen.
        </div>
      </div>
      <Caption delay={30}>Auf der Erde ist das extrem schwierig. Man braucht über hundert Millionen Grad. Ein starkes Magnetfeld hält das heiße Plasma in der Schwebe. Anlagen wie ITER erforschen das.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Die Kernfusion" footer="Antrieb der Sonne – auf der Erde noch Forschung">
      Bei der Fusion verschmelzen leichte Kerne zu einem
      <br />
      schwereren und setzen viel Energie frei –
      <br />
      wie im Inneren der Sonne.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['⭐', 'Sterne', 'leuchten durch Fusion'],
    ['🔋', 'Hoffnung', 'saubere Zukunftsenergie'],
    ['🧪', 'Forschung', 'ITER & Co.'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Energie der Sterne" />
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
      <Caption delay={40}>Alle Sterne leuchten durch Kernfusion. Gelingt sie auf der Erde, könnte sie einmal fast unbegrenzt saubere Energie liefern.</Caption>
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
  { id: 'sonne', C: SonneScene, min: 240 },
  { id: 'prinzip', C: PrinzipScene, min: 260 },
  { id: 'vergleich', C: VergleichScene, min: 250 },
  { id: 'erde', C: ErdeScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const KERNFUSION_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Kernfusion: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={KERNFUSION_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/kernfusion/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
