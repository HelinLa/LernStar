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
import { ParticleChain, SoundWaves, useFade } from '../sound';
import timings from '../narration/schallausbreitung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// ── Intro ──────────────────────────────────────────────────────────────
const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 80, marginBottom: 40, fontSize: 120 }}>
        <div>🔊</div><div>💨</div><div>👂</div>
      </div>
      <StarLogo size={84} />
      <div style={{ marginTop: 26, fontSize: 84, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wie breitet sich Schall aus?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Wie reist der Ton von der Quelle bis zu deinem Ohr?
      </div>
    </AbsoluteFill>
  );
};

// ── Teilchen geben weiter ──────────────────────────────────────────────
const TeilchenScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <SceneTitle kicker="Der Weg" title="Teilchen geben die Schwingung weiter" />
    <div style={{ position: 'absolute', left: 320, top: 500, fontSize: 90 }}>🔊</div>
    <SoundWaves x={430} y={545} count={3} />
    <ParticleChain x={480} y={480} w={1080} rows={3} on color={COLORS.sky} />
    <div style={{ position: 'absolute', left: 1560, top: 500, fontSize: 90 }}>👂</div>
    <Sfx sound="whoosh" at={10} volume={0.3} />
    <Caption>Ein Teilchen stößt das nächste an – so wandert die Schwingung als Welle weiter.</Caption>
  </AbsoluteFill>
);

// ── Medien-Vergleich ───────────────────────────────────────────────────
const MedienScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Wie schnell?" title="Luft < Wasser < Metall" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 34, opacity: f }}>
          {[['💨', 'Luft', '≈ 340 m/s', COLORS.sky], ['💧', 'Wasser', '≈ 1500 m/s', COLORS.indigo], ['🔩', 'Metall', '≈ 5000 m/s', COLORS.amber]].map((c, i) => (
            <div key={i} style={{ width: 340, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${c[3]}`, textAlign: 'center' }}>
              <div style={{ fontSize: 74 }}>{c[0]}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: c[3] as string, marginTop: 4 }}>{c[2]}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={40}>Je enger die Teilchen sitzen, desto schneller ist der Schall.</Caption>
    </AbsoluteFill>
  );
};

// ── Vakuum: kein Schall ────────────────────────────────────────────────
const VakuumScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const evac = frame > dur * 0.4;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Der Gegentest" title="Vakuum: absolute Stille" />
      <div style={{ position: 'absolute', left: 760, top: 340, width: 400, height: 400, borderRadius: 24, border: `4px solid ${COLORS.border}`, background: 'rgba(2,6,23,0.6)' }} />
      <div style={{ position: 'absolute', left: 860, top: 470, fontSize: 120 }}>🔔</div>
      {!evac ? <ParticleChain x={790} y={400} w={340} rows={3} on={false} color={COLORS.muted} /> : null}
      {evac ? <div style={{ position: 'absolute', left: 820, top: 640, fontSize: 34, fontWeight: 800, color: COLORS.red }}>keine Teilchen → 🔇</div> : (
        <div style={{ position: 'absolute', left: 820, top: 640, fontSize: 30, fontWeight: 800, color: COLORS.muted }}>Luft wird abgepumpt …</div>
      )}
      <Sfx sound="pop" at={Math.round(dur * 0.4)} volume={0.3} />
      <Caption delay={Math.round(dur * 0.4) + 6}>Ohne Teilchen kann sich keine Schwingung ausbreiten – im All ist es still.</Caption>
    </AbsoluteFill>
  );
};

// ── Beispiel: Ohr am Tisch ─────────────────────────────────────────────
const BeispielScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Selbst testen" title="Ohr an den Tisch" />
      <div style={{ fontSize: 180, opacity: f }}>👂🪵✊</div>
      <div style={{ marginTop: 20, fontSize: 34, fontWeight: 800, color: COLORS.amber, maxWidth: 1200, textAlign: 'center', opacity: f }}>
        Leises Klopfen klingt durch das Holz überraschend laut.
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Der Schall reist durch festes Holz schneller und klarer als durch Luft.</Caption>
    </AbsoluteFill>
  );
};

// ── Merksatz ───────────────────────────────────────────────────────────
const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Schallausbreitung" footer="im Vakuum gibt es keinen Schall">
      Schall braucht Teilchen.
      <br />
      In Flüssigkeiten und Festkörpern
      <br />
      ist er schneller als in Luft.
    </MerksatzBox>
  </AbsoluteFill>
);

// ── Transfer ───────────────────────────────────────────────────────────
const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Übertragen" title="Schall durch feste Stoffe" />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 40 }}>
        <div style={{ display: 'flex', gap: 60, opacity: f }}>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.indigo}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>🐋</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>Wale hören sich km-weit im Wasser</div>
          </div>
          <div style={{ width: 420, padding: '30px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, textAlign: 'center' }}>
            <div style={{ fontSize: 84 }}>🐎</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>Ohr auf die Erde: ferne Pferde</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Feste Stoffe und Flüssigkeiten leiten den Schall besonders gut.</Caption>
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
  { id: 'teilchen', C: TeilchenScene, min: 240 },
  { id: 'medien', C: MedienScene, min: 240 },
  { id: 'vakuum', C: VakuumScene, min: 240 },
  { id: 'beispiel', C: BeispielScene, min: 220 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const SCHALLAUSBREITUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Schallausbreitung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={SCHALLAUSBREITUNG_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/schallausbreitung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
