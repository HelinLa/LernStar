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
import timings from '../narration/zerfallsgleichung.timings.json';

const T = timings as Record<string, number>;
const FPS = 30;
const TAIL = 20;
const durOf = (id: string, min: number) => Math.max(min, Math.round((T[id] ?? 0) * FPS) + TAIL);

type SceneProps = { dur: number };

// Nuklid-Schreibweise: Massenzahl oben, Ordnungszahl unten, Symbol.
const Nuclide: React.FC<{ a: string; z: string; sym: string; color?: string; big?: boolean }> = ({ a, z, sym, color = COLORS.ink, big }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
      <div style={{ fontSize: big ? 34 : 26, fontWeight: 900, color: COLORS.amber }}>{a}</div>
      <div style={{ fontSize: big ? 34 : 26, fontWeight: 900, color: COLORS.sky }}>{z}</div>
    </div>
    <div style={{ fontSize: big ? 64 : 48, fontWeight: 900, color }}>{sym}</div>
  </div>
);

const Intro: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 110 }}>⚛️➡️⚛️</div>
      <StarLogo size={62} />
      <div style={{ marginTop: 14, fontSize: 56, fontWeight: 900, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`, textAlign: 'center' }}>
        Was wird aus einem Kern nach dem Zerfall?
      </div>
      <div style={{ marginTop: 12, fontSize: 34, fontWeight: 600, color: COLORS.muted, opacity: sub }}>
        Zerfallsgleichungen
      </div>
    </AbsoluteFill>
  );
};

const RegelScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Die Regel" title="Nichts geht verloren" />
      <div style={{ opacity: f, marginTop: 30, width: 1300 }}>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(251,191,36,0.14)', border: `2px solid ${COLORS.amber}`, fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
          Die Summe der <span style={{ color: COLORS.amber }}>Massenzahlen (oben)</span> ist links und rechts gleich.
        </div>
        <div style={{ padding: '18px 22px', borderRadius: 14, background: 'rgba(56,189,248,0.14)', border: `2px solid ${COLORS.sky}`, fontSize: 26, fontWeight: 800 }}>
          Die Summe der <span style={{ color: COLORS.sky }}>Ordnungszahlen (unten)</span> ist links und rechts gleich.
        </div>
      </div>
      <Caption delay={30}>Für jede Zerfallsgleichung gilt: Oben die Massenzahlen und unten die Ordnungszahlen müssen auf beiden Seiten in der Summe gleich sein.</Caption>
    </AbsoluteFill>
  );
};

const AlphaGleichungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Alphazerfall" title="Ordnungszahl −2, Massenzahl −4" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 40 }}>
        <Nuclide a="226" z="88" sym="Ra" big />
        <div style={{ fontSize: 46, color: COLORS.amber }}>→</div>
        <Nuclide a="222" z="86" sym="Rn" color={COLORS.green} big />
        <div style={{ fontSize: 40 }}>+</div>
        <Nuclide a="4" z="2" sym="He" color={COLORS.amber} big />
      </div>
      <div style={{ marginTop: 40, display: 'flex', gap: 40, opacity: f, fontSize: 24, fontWeight: 800 }}>
        <div style={{ padding: '12px 18px', borderRadius: 10, background: COLORS.panel, border: `2px solid ${COLORS.amber}` }}>oben: 226 = 222 + 4 ✓</div>
        <div style={{ padding: '12px 18px', borderRadius: 10, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>unten: 88 = 86 + 2 ✓</div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Beim Alphazerfall von Radium-226 entsteht Radon-222 plus ein Heliumkern. Prüfe: Oben 226 gleich 222 plus 4, unten 88 gleich 86 plus 2.</Caption>
    </AbsoluteFill>
  );
};

const BetaGleichungScene: React.FC<SceneProps> = () => {
  const f = useFade(12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Betazerfall" title="Ordnungszahl +1, Massenzahl gleich" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: f, marginTop: 40 }}>
        <Nuclide a="14" z="6" sym="C" big />
        <div style={{ fontSize: 46, color: COLORS.sky }}>→</div>
        <Nuclide a="14" z="7" sym="N" color={COLORS.green} big />
        <div style={{ fontSize: 40 }}>+</div>
        <Nuclide a="0" z="−1" sym="e" color={COLORS.sky} big />
      </div>
      <div style={{ marginTop: 40, display: 'flex', gap: 40, opacity: f, fontSize: 24, fontWeight: 800 }}>
        <div style={{ padding: '12px 18px', borderRadius: 10, background: COLORS.panel, border: `2px solid ${COLORS.amber}` }}>oben: 14 = 14 + 0 ✓</div>
        <div style={{ padding: '12px 18px', borderRadius: 10, background: COLORS.panel, border: `2px solid ${COLORS.sky}` }}>unten: 6 = 7 + (−1) ✓</div>
      </div>
      <Sfx sound="pling" at={14} volume={0.4} />
      <Caption delay={30}>Beim Betazerfall von Kohlenstoff-14 entsteht Stickstoff-14 plus ein Elektron. Das Elektron trägt die Ladung minus eins – so bleibt unten alles im Gleichgewicht.</Caption>
    </AbsoluteFill>
  );
};

const ReiheScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const f = useFade(12);
  const chain = [
    ['238', '92', 'U', 'α'],
    ['234', '90', 'Th', 'β'],
    ['234', '91', 'Pa', 'β'],
    ['234', '92', 'U', 'α'],
    ['…', '', '', ''],
    ['206', '82', 'Pb', ''],
  ];
  const upto = Math.min(chain.length, 1 + Math.floor(interpolate(frame, [20, 140], [0, chain.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  return (
    <AbsoluteFill>
      <SceneTitle kicker="Die Zerfallsreihe" title="Bis ein stabiler Kern entsteht" />
      <div style={{ position: 'absolute', left: 100, top: 470, right: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: f, flexWrap: 'wrap' }}>
        {chain.map((c, i) => {
          if (i >= upto) return null;
          return (
            <React.Fragment key={i}>
              {c[2] ? <Nuclide a={c[0]} z={c[1]} sym={c[2]} color={i === chain.length - 1 ? COLORS.green : COLORS.ink} /> : <div style={{ fontSize: 40, color: COLORS.muted }}>{c[0]}</div>}
              {i < upto - 1 && c[3] && <div style={{ fontSize: 22, fontWeight: 900, color: c[3] === 'α' ? COLORS.amber : COLORS.sky }}>—{c[3]}→</div>}
              {i < upto - 1 && !c[3] && i !== chain.length - 1 && <div style={{ fontSize: 22, color: COLORS.muted }}>→</div>}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontSize: 26, fontWeight: 800, color: COLORS.green, opacity: f }}>
        Endpunkt: stabiles Blei-206 – hier hört der Zerfall auf.
      </div>
      <Sfx sound="pop" at={20} volume={0.3} />
      <Caption delay={30}>Oft ist ein Kern auch nach dem Zerfall noch instabil. Dann zerfällt er weiter – Schritt für Schritt, bis ein stabiler Kern wie Blei-206 entsteht.</Caption>
    </AbsoluteFill>
  );
};

const MerksatzScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Sfx sound="pling" at={8} volume={0.55} />
    <MerksatzBox title="Zerfallsgleichungen" footer="Massen- und Ordnungszahl bleiben in Summe erhalten">
      Beim Zerfall wird aus einem Kern ein neues Element.
      <br />
      Massenzahl und Ordnungszahl bleiben in der Summe
      <br />
      gleich – oft folgt eine ganze Zerfallsreihe.
    </MerksatzBox>
  </AbsoluteFill>
);

const TransferScene: React.FC<SceneProps> = () => {
  const f = useFade(14);
  const items = [
    ['🪨', 'Uran → Blei', 'natürliche Reihe'],
    ['🌡️', 'Radon', 'Zwischenprodukt'],
    ['🧭', 'Datierung', 'aus dem Verhältnis'],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <SceneTitle kicker="Übertragen" title="Zerfallsreihen in der Natur" />
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
      <Caption delay={40}>Wie schnell so ein Zerfall abläuft, verrät die Halbwertszeit – das schauen wir uns als Nächstes an.</Caption>
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
  { id: 'regel', C: RegelScene, min: 240 },
  { id: 'alpha', C: AlphaGleichungScene, min: 250 },
  { id: 'beta', C: BetaGleichungScene, min: 250 },
  { id: 'reihe', C: ReiheScene, min: 250 },
  { id: 'merksatz', C: MerksatzScene, min: 180 },
  { id: 'transfer', C: TransferScene, min: 200 },
  { id: 'outro', C: Outro, min: 110 },
];

export const ZERFALLSGLEICHUNG_DURATION = SCENES.reduce((sum, s) => sum + durOf(s.id, s.min), 0);

export const Zerfallsgleichung: React.FC = () => {
  return (
    <Bg>
      <BackgroundMusic total={ZERFALLSGLEICHUNG_DURATION} />
      <Series>
        {SCENES.map((s, i) => {
          const d = durOf(s.id, s.min);
          return (
            <Series.Sequence key={i} durationInFrames={d}>
              <s.C dur={d} />
              <Audio src={staticFile(`audio/zerfallsgleichung/${s.id}.wav`)} />
              <Sfx sound="whoosh" at={1} volume={0.4} />
            </Series.Sequence>
          );
        })}
      </Series>
    </Bg>
  );
};
