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
import { MediaSplit, RefractRay, useFade } from '../refraction';
import timings from '../narration/brechungswinkel.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

const BOUND = 520;

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 170, marginBottom: 20 }}>📐💧</div>
      <StarLogo size={84} />
      <div style={{ marginTop: 20, fontSize: 74, fontWeight: 900, textAlign: 'center', opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)` }}>
        Wovon hängt die Brechung ab?
      </div>
      <div style={{ marginTop: 16, fontSize: 38, fontWeight: 600, color: COLORS.muted, maxWidth: 1350, textAlign: 'center', opacity: sub }}>
        Mal knickt das Licht stark, mal kaum – zwei Dinge entscheiden.
      </div>
    </AbsoluteFill>
  );
};

const LotScene: React.FC<SceneProps> = ({ dur }) => (
  <AbsoluteFill>
    <SceneTitle kicker="Grundlage" title="Zum Lot hin gebrochen" />
    <MediaSplit boundaryY={BOUND} />
    <RefractRay hitX={960} hitY={BOUND} aIn={50} aOut={32} />
    <div style={{ position: 'absolute', left: 1050, top: 300, fontSize: 26, fontWeight: 800, color: COLORS.muted }}>Lot</div>
    <div style={{ position: 'absolute', left: 1020, top: 700, fontSize: 26, fontWeight: 800, color: COLORS.green }}>knickt zur Senkrechten hin</div>
    <Sfx sound="whoosh" at={10} volume={0.3} />
    <Caption>Ins dichtere Wasser wird das Licht zum Lot – der Senkrechten – hin gebrochen.</Caption>
  </AbsoluteFill>
);

const WinkelScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const aIn = interpolate(frame, [15, dur - 20], [15, 65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const aOut = aIn * 0.66; // grob: Brechungswinkel wächst mit
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 1" title="Größerer Einfallswinkel" />
      <MediaSplit boundaryY={BOUND} />
      <RefractRay hitX={960} hitY={BOUND} aIn={aIn} aOut={aOut} />
      <div style={{ position: 'absolute', left: 600, top: 250, fontSize: 30, fontWeight: 800, color: COLORS.amber }}>
        Einfallswinkel {Math.round(aIn)}° → Brechungswinkel {Math.round(aOut)}°
      </div>
      <Sfx sound="pop" at={15} volume={0.3} />
      <Caption delay={Math.round(dur * 0.5)}>Je größer der Einfallswinkel, desto größer der Brechungswinkel. Senkrecht: keine Brechung.</Caption>
    </AbsoluteFill>
  );
};

const StoffScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const glas = frame > dur * 0.5;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Faktor 2" title={glas ? 'Glas bricht stärker' : 'Wasser'} />
      <MediaSplit boundaryY={BOUND} botLabel={glas ? 'Glas' : 'Wasser'} botColor={glas ? 'rgba(129,140,248,0.18)' : 'rgba(56,189,248,0.16)'} />
      <RefractRay hitX={960} hitY={BOUND} aIn={50} aOut={glas ? 27 : 36} />
      <div style={{ position: 'absolute', left: 620, top: 250, fontSize: 30, fontWeight: 800, color: glas ? COLORS.indigo : COLORS.sky }}>
        gleicher Einfallswinkel – {glas ? 'Glas knickt stärker' : 'Wasser knickt weniger'}
      </div>
      <Sfx sound="pling" at={Math.round(dur * 0.5)} volume={0.4} />
      <Caption delay={Math.round(dur * 0.5) + 6}>Je dichter der Stoff, desto stärker die Brechung – Glas mehr als Wasser.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Stärke der Brechung" footer="senkrecht: keine Brechung">
      Größerer Einfallswinkel → größerer
      <br />
      Brechungswinkel. Ins Dichtere: zum Lot hin.
      <br />
      Glas bricht stärker als Wasser.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Brechung gezielt genutzt" />
      <div style={{ display: 'flex', gap: 40, opacity: f }}>
        {[['👓', 'Brillenglas'], ['📷', 'Objektiv'], ['🔺', 'Prisma']].map((c, i) => (
          <div key={i} style={{ width: 300, padding: '30px 18px', borderRadius: 22, background: COLORS.panel, border: `2px solid ${COLORS.sky}`, textAlign: 'center' }}>
            <div style={{ fontSize: 80 }}>{c[0]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{c[1]}</div>
          </div>
        ))}
      </div>
      <Sfx sound="pop" at={14} volume={0.34} />
      <Caption delay={40}>Linsen und Prismen lenken Licht durch gezielte Brechung.</Caption>
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
  { id: 'lot', C: LotScene, min: 220 },
  { id: 'winkel', C: WinkelScene, min: 260 },
  { id: 'stoff', C: StoffScene, min: 260 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const BRECHUNGSWINKEL_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Brechungswinkel: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={BRECHUNGSWINKEL_DURATION} />
      <Series>
        {SCENES.map((s) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={s.id} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/brechungswinkel/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
