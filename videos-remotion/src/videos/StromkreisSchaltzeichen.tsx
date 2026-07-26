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
import { RectWire, LampSym, BatterySym, SwitchSym, Bulb, useFade } from '../circuit';
import timings from '../narration/stromkreis-schaltzeichen.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const LX = 620;
const RX = 1300;
const TY = 340;
const BY = 760;

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const on = Math.floor(frame / 22) % 2 === 0;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 90, marginBottom: 40, fontSize: 130 }}>
        <div>🔋</div>
        <div>🔌</div>
        <div style={{ opacity: on ? 1 : 0.35 }}>💡</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Der einfache Stromkreis
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Was muss zusammenkommen, damit die Lampe leuchtet?
      </div>
    </AbsoluteFill>
  );
};

// ── Teile ──────────────────────────────────────────────────────────────
const TeileScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Die Bausteine" title="Quelle · Leiter · Verbraucher" />
    <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on={false} />
    <Bulb x={(LX + RX) / 2} y={TY} size={110} on={false} />
    <BatterySym x={(LX + RX) / 2} y={BY} label="Energiequelle" />
    <div style={{ position: 'absolute', left: RX + 30, top: (TY + BY) / 2 - 20, fontSize: 26, fontWeight: 800, color: COLORS.sky }}>Leiter (Kabel)</div>
    <div style={{ position: 'absolute', left: (LX + RX) / 2 - 70, top: TY - 130, fontSize: 26, fontWeight: 800, color: COLORS.amber }}>Verbraucher</div>
    <Sfx sound="pop" at={12} volume={0.34} />
    <Caption>Batterie, Kabel und Lampe – erst zusammen ergeben sie einen Stromkreis.</Caption>
  </AbsoluteFill>
);

// ── Geschlossen ────────────────────────────────────────────────────────
const GeschlossenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const on = frame > 30;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Ring" title="Nur geschlossen fließt Strom" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on={on} />
      <Bulb x={(LX + RX) / 2} y={TY} size={110} on={on} />
      <BatterySym x={(LX + RX) / 2} y={BY} />
      <Sfx sound="pling" at={30} volume={0.4} />
      <Caption delay={36}>Der Strom fließt im Ring von der Batterie durch die Lampe und zurück.</Caption>
    </AbsoluteFill>
  );
};

// ── Schalter ───────────────────────────────────────────────────────────
const SchalterScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const closed = frame < dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Steuern" title="Der Schalter unterbricht" />
      <RectWire LX={LX} RX={RX} TY={TY} BY={BY} on={closed} gapAtBottom={140} />
      <Bulb x={(LX + RX) / 2} y={TY} size={110} on={closed} />
      <SwitchSym x={(LX + RX) / 2} y={BY} closed={closed} label={closed ? 'geschlossen' : 'offen'} />
      <div style={{ position: 'absolute', left: 760, top: 250, fontSize: 32, fontWeight: 800, color: closed ? COLORS.green : COLORS.red }}>
        {closed ? 'Schalter zu → Lampe leuchtet' : 'Schalter auf → Lampe aus'}
      </div>
      <Sfx sound="pop" at={Math.round(dur * 0.5)} volume={0.34} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Schalter auf heißt: Kreis unterbrochen – die Lampe geht aus.</Caption>
    </AbsoluteFill>
  );
};

// ── Schaltzeichen ──────────────────────────────────────────────────────
const SymCard: React.FC<{ children: React.ReactNode; name: string; delay: number }> = ({ children, name, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 340, height: 240, borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, position: 'relative', opacity: f, transform: `translateY(${(1 - f) * 30}px)` }}>
      {children}
      <div style={{ position: 'absolute', bottom: 16, left: 0, width: '100%', textAlign: 'center', fontSize: 28, fontWeight: 800 }}>{name}</div>
    </div>
  );
};
const SchaltzeichenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Kurzschrift" title="Die Schaltzeichen" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <SymCard name="Batterie" delay={10}>
          <BatterySym x={170} y={100} />
        </SymCard>
        <SymCard name="Lampe" delay={30}>
          <LampSym x={170} y={100} on={false} />
        </SymCard>
        <SymCard name="Schalter" delay={50}>
          <SwitchSym x={170} y={100} closed={false} />
        </SymCard>
      </div>
    </AbsoluteFill>
    <Sfx sound="pling" at={12} volume={0.4} />
    <Caption delay={66}>Einheitliche Zeichen – so versteht jeder deinen Stromkreis.</Caption>
  </AbsoluteFill>
);

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Stromkreis" footer="nur im geschlossenen Kreis fließt Strom">
      Ein Stromkreis braucht Quelle,
      <br />
      Leiter und Verbraucher –
      <br />
      und muss geschlossen sein.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TCard: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const f = useFade(delay);
  return (
    <div style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `1px solid ${COLORS.border}`, textAlign: 'center', opacity: f, transform: `translateY(${(1 - f) * 34}px)` }}>
      <div style={{ fontSize: 74 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{title}</div>
    </div>
  );
};
const TransferScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Übertragen" title="Stromkreise um dich herum" />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
      <div style={{ display: 'flex', gap: 34 }}>
        <TCard icon="🔦" title="Taschenlampe" delay={10} />
        <TCard icon="🚲" title="Fahrradlicht" delay={30} />
        <TCard icon="💡" title="Lichtschalter" delay={50} />
      </div>
    </AbsoluteFill>
    <Sfx sound="pop" at={10} volume={0.36} />
    <Caption delay={66}>Überall derselbe Ring: Quelle, Leiter, Verbraucher, geschlossen.</Caption>
  </AbsoluteFill>
);

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
  { id: 'teile', C: TeileScene, min: 240 },
  { id: 'geschlossen', C: GeschlossenScene, min: 240 },
  { id: 'schalter', C: SchalterScene, min: 260 },
  { id: 'schaltzeichen', C: SchaltzeichenScene, min: 240 },
  { id: 'merksatz', C: MerksatzScene, min: 170 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const STROMKREIS_SCHALTZEICHEN_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const StromkreisSchaltzeichen: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={STROMKREIS_SCHALTZEICHEN_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/stromkreis-schaltzeichen/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
