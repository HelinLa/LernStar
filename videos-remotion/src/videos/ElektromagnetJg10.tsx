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
import { Coil, FieldLines, useFade } from '../magnet';
import timings from '../narration/elektromagnet-jg10.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Büroklammern, die am rechten Pol hängen (heben sich bei on).
const Clips: React.FC<{ x: number; y: number; on: boolean; n?: number }> = ({ x, y, on, n = 5 }) => {
  const frame = useCurrentFrame();
  const lift = on ? interpolate(frame, [4, 26], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 60;
  return (
    <div style={{ position: 'absolute', left: x, top: y }}>
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: (i - n / 2) * 42,
            top: on ? lift + (i % 2) * 8 : 120,
            fontSize: 46,
            opacity: on ? 1 : 0.85,
            transition: 'none',
          }}
        >
          📎
        </span>
      ))}
    </div>
  );
};

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const on = Math.floor(frame / 22) % 2 === 0;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 420, height: 200 }}>
        <Coil cx={210} cy={100} w={300} h={120} windings={6} on={on} />
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, color: on ? COLORS.amber : COLORS.muted }}>{on ? '⚡ AN' : '○ AUS'}</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 12, fontSize: 54, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Ein Magnet zum An- und Ausschalten
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Der Elektromagnet
      </div>
    </AbsoluteFill>
  );
};

const BeobachtenScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const on = frame > 40 && frame < 150;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Beobachten" title="Strom an – hält. Strom aus – fällt." />
      <Coil cx={720} cy={520} w={340} h={150} windings={7} on={on} />
      <Clips x={900} y={470} on={on} />
      <div style={{ position: 'absolute', left: 1240, top: 470, width: 520, fontSize: 30, fontWeight: 800, color: on ? COLORS.green : COLORS.red }}>
        {on ? '⚡ Strom fließt → Klammern werden gehalten' : '○ kein Strom → Klammern fallen ab'}
      </div>
      <Caption delay={30}>Nur solange Strom fließt, ist die Spule magnetisch. Schaltet man aus, fallen die Klammern sofort.</Caption>
    </AbsoluteFill>
  );
};

const SpuleScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Warum" title="Viele Windungen – die Felder addieren sich" />
      <div style={{ opacity: f }}>
        <FieldLines cx={720} cy={560} L={190} bows={[55, 130, 220]} progress={f} />
      </div>
      <Coil cx={720} cy={560} w={360} h={160} windings={8} on />
      <div style={{ position: 'absolute', left: 470, top: 540, fontSize: 30, fontWeight: 900, color: COLORS.sky }}>S</div>
      <div style={{ position: 'absolute', left: 950, top: 540, fontSize: 30, fontWeight: 900, color: COLORS.red }}>N</div>
      <div style={{ position: 'absolute', left: 1240, top: 430, width: 560, opacity: f }}>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: COLORS.panel, border: `2px solid ${COLORS.amber}`, fontSize: 25, fontWeight: 800, marginBottom: 12 }}>Jede Drahtwindung erzeugt ein kleines Feld.</div>
        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, fontSize: 25, fontWeight: 800 }}>Viele hintereinander → ein starkes Feld wie beim Stabmagneten, mit Nord- und Südpol.</div>
      </div>
      <Caption delay={30}>Wickelt man den Draht zur Spule, addieren sich die vielen kleinen Felder zu einem starken Gesamtfeld.</Caption>
    </AbsoluteFill>
  );
};

const KernScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const withCore = frame > 80;
  const clips = withCore ? 8 : 3;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Ausprobieren" title="Ein Eisenkern verstärkt es enorm" />
      <div style={{ display: 'flex', gap: 90, marginTop: 40, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 360, height: 220 }}>
            <svg width={360} height={220} viewBox="0 0 360 220" style={{ position: 'absolute' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <ellipse key={i} cx={60 + i * 45} cy={110} rx={20} ry={70} fill="none" stroke="#f59e0b" strokeWidth={6} />
              ))}
            </svg>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.muted }}>ohne Kern (Luft)</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.sky }}>{'📎'.repeat(3)}</div>
        </div>
        <div style={{ fontSize: 60 }}>➡️</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 360, height: 220 }}>
            <Coil cx={180} cy={110} w={330} h={150} windings={6} on />
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.green }}>mit Eisenkern</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.green }}>{'📎'.repeat(withCore ? 8 : 3)}</div>
        </div>
      </div>
      <Sfx sound="pop" at={80} volume={0.34} />
      <Caption delay={30}>Ein Eisenkern in der Spule bündelt das Feld – die Tragkraft steigt sprunghaft.</Caption>
    </AbsoluteFill>
  );
};

const PoleScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const rev = frame > 90;
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Steuerbar" title="Strom umpolen – Nord und Süd tauschen" />
      <div style={{ opacity: f }}>
        <FieldLines cx={720} cy={560} L={190} bows={[55, 130, 220]} progress={f} color={rev ? COLORS.amber : COLORS.sky} />
      </div>
      <Coil cx={720} cy={560} w={360} h={160} windings={8} on />
      <div style={{ position: 'absolute', left: 470, top: 540, fontSize: 30, fontWeight: 900, color: rev ? COLORS.red : COLORS.sky }}>{rev ? 'N' : 'S'}</div>
      <div style={{ position: 'absolute', left: 950, top: 540, fontSize: 30, fontWeight: 900, color: rev ? COLORS.sky : COLORS.red }}>{rev ? 'S' : 'N'}</div>
      <div style={{ position: 'absolute', left: 1240, top: 500, width: 540, fontSize: 27, fontWeight: 800, color: rev ? COLORS.amber : COLORS.sky, opacity: f }}>
        {rev ? '⬅️ Strom andersherum → Pole vertauscht' : '➡️ Strom in eine Richtung'}
      </div>
      <Sfx sound="pop" at={90} volume={0.34} />
      <Caption delay={30}>Man kann den Elektromagneten nicht nur an- und ausschalten – auch seine Pole lassen sich umkehren.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Der Elektromagnet" footer="steuerbar: an/aus · stärker · umpolbar">
      Eine Spule mit Strom ist ein Magnet –
      <br />
      aber nur, solange Strom fließt.
      <br />
      Ein Eisenkern macht ihn viel stärker.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🏗️', 'Schrottkran', 'hebt und lässt fallen'],
    ['🔔', 'Klingel & Relais', 'schaltet Kontakte'],
    ['🏥', 'MRT', 'sehr starke Spulen'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Elektromagnete im Alltag" />
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
      <Caption delay={40}>Weil er steuerbar ist, steckt der Elektromagnet in unzähligen Geräten.</Caption>
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
  { id: 'spule', C: SpuleScene, min: 260 },
  { id: 'kern', C: KernScene, min: 250 },
  { id: 'pole', C: PoleScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 210 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ELEKTROMAGNET_JG10_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const ElektromagnetJg10: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ELEKTROMAGNET_JG10_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/elektromagnet-jg10/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
