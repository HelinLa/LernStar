import {makeScene2D, Line, Rect, Txt, Node} from '@motion-canvas/2d';
import {createSignal, all, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip: Wie wirken Magnetpole aufeinander? (Klasse 5 RS).
// NUR Fachanimation (zwei Stabmagnete, Kraftpfeile, Kraftmesser), kein Titel/Untertitel –
// das legt Remotion drüber. Segmentdauern framegenau an die Anna-Audios
// (magnetpole-mc.timings.json → durOf).
//
// Didaktischer Kern: N (rot) und S (blau). Ungleiche Pole (N–S) → anziehen (grüne Pfeile,
// Magnete wandern zueinander). Ein Magnet dreht sich → gleiche Pole (N–N) → abstoßen (rote
// Pfeile, auseinandergedrückt) → entlarvt „ziehen immer an". Kraft wächst bei kleinerem
// Abstand und wirkt BERÜHRUNGSLOS über den Spalt → entlarvt „Berührung nötig".
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  const NCOL = COLORS.red;   // Nordpol rot
  const SCOL = COLORS.sky;   // Südpol blau
  const HALF = 130;          // halbe Magnetlänge
  const H = 92;              // Magnethöhe

  // ── Signale ──────────────────────────────────────────────────────────
  const objOp = createSignal(0);
  const gap = createSignal(340);   // Abstand jedes Magneten von der Mitte
  const rotB = createSignal(0);     // Drehung Magnet B (0=S innen → N–S, 180=N innen → N–N)
  const anzArrOp = createSignal(0);  // grüne Anziehungs-Pfeile
  const absArrOp = createSignal(0);  // rote Abstoßungs-Pfeile
  const anzOp = createSignal(0);     // "ziehen sich an"
  const absOp = createSignal(0);     // "stoßen sich ab"
  const ungleichOp = createSignal(0);
  const gleichOp = createSignal(0);
  const kraftOp = createSignal(0);   // Kraftmesser-Balken
  const regelOp = createSignal(0);
  const gapHiOp = createSignal(0);   // Spalt-Hervorhebung (kein Kontakt)
  const logoOp = createSignal(0);

  // Abgeleitete Größen
  const poleAx = () => -gap() + HALF;     // Innenpol Magnet A (rechtes Ende)
  const poleBx = () => gap() - HALF;      // Innenpol Magnet B (linkes Ende)
  const innerGap = () => 2 * gap() - 2 * HALF;
  const F = () => Math.max(30, Math.min(170, 12000 / Math.max(70, innerGap()))); // Kraft-Betrag → Kraftmesser
  const La = () => Math.min(72, innerGap() * 0.40); // Anziehungs-Pfeil (nach INNEN, ohne Überschuss)
  const Lr = 84;                          // Abstoßungs-Pfeil (nach AUSSEN, feste Länge)
  const AY = -70;                         // Höhe der Kraftpfeile (über den Magneten)

  // Ein Stabmagnet: linke Hälfte S (blau), rechte Hälfte N (rot), Buchstaben aufrecht.
  const Magnet = (cx: () => number, rot: () => number) => (
    <Node position={() => [cx(), 0]} rotation={() => rot()}>
      <Rect x={-HALF / 2} width={HALF} height={H} radius={[18, 0, 0, 18]} fill={SCOL} stroke={COLORS.ink} lineWidth={3} />
      <Rect x={HALF / 2} width={HALF} height={H} radius={[0, 18, 18, 0]} fill={NCOL} stroke={COLORS.ink} lineWidth={3} />
      <Txt x={-HALF / 2} text="S" fill={COLORS.ink} fontFamily={FONT} fontSize={52} fontWeight={900} rotation={() => -rot()} />
      <Txt x={HALF / 2} text="N" fill={COLORS.ink} fontFamily={FONT} fontSize={52} fontWeight={900} rotation={() => -rot()} />
    </Node>
  );

  view.add(
    <Node opacity={() => objOp()}>
      {/* Kraftmesser-Balken (oben) */}
      <Txt position={[-300, -330]} text="Kraft" fill={COLORS.muted} fontFamily={FONT} fontSize={28} fontWeight={800} opacity={() => kraftOp()} />
      <Rect position={[0, -330]} width={404} height={30} radius={15} stroke={COLORS.border} lineWidth={3} fill={COLORS.panelSolid} opacity={() => kraftOp()} />
      <Rect position={() => [-200 + ((F() - 30) / 140 * 400) / 2, -330]} width={() => (F() - 30) / 140 * 400} height={22} radius={11} fill={COLORS.green} opacity={() => kraftOp()} />

      {/* Spalt-Hervorhebung (kein Kontakt) */}
      <Rect position={[0, 0]} width={() => Math.max(8, innerGap())} height={150} radius={12} stroke={COLORS.amber} lineWidth={4} lineDash={[14, 12]} opacity={() => gapHiOp()} />
      <Txt position={[0, 150]} text="kein Kontakt – Kraft wirkt durch die Luft" fill={COLORS.amber} fontFamily={FONT} fontSize={28} fontWeight={800} opacity={() => gapHiOp()} />

      {/* Die zwei Magnete */}
      {Magnet(() => -gap(), () => 0)}
      {Magnet(() => gap(), () => rotB())}

      {/* Grüne Anziehungs-Pfeile (nach INNEN, auf den Spalt zu) */}
      <Line points={() => [[poleAx() + 12, AY], [poleAx() + 12 + La(), AY]]} stroke={COLORS.green} lineWidth={10} endArrow arrowSize={24} opacity={() => anzArrOp()} lineCap="round" />
      <Line points={() => [[poleBx() - 12, AY], [poleBx() - 12 - La(), AY]]} stroke={COLORS.green} lineWidth={10} endArrow arrowSize={24} opacity={() => anzArrOp()} lineCap="round" />

      {/* Rote Abstoßungs-Pfeile (nach AUSSEN, voneinander weg) */}
      <Line points={() => [[poleAx() - 12, AY], [poleAx() - 12 - Lr, AY]]} stroke={COLORS.red} lineWidth={10} endArrow arrowSize={24} opacity={() => absArrOp()} lineCap="round" />
      <Line points={() => [[poleBx() + 12, AY], [poleBx() + 12 + Lr, AY]]} stroke={COLORS.red} lineWidth={10} endArrow arrowSize={24} opacity={() => absArrOp()} lineCap="round" />

      {/* Callouts */}
      <Txt position={[0, -270]} text="ziehen sich an" fill={COLORS.green} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => anzOp()} />
      <Txt position={[0, -270]} text="stoßen sich ab" fill={COLORS.red} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => absOp()} />
      <Txt position={[0, 165]} text="ungleiche Pole (N–S)" fill={COLORS.green} fontFamily={FONT} fontSize={30} fontWeight={800} opacity={() => ungleichOp()} />
      <Txt position={[0, 165]} text="gleiche Pole (N–N)" fill={COLORS.red} fontFamily={FONT} fontSize={30} fontWeight={800} opacity={() => gleichOp()} />

      {/* Regel-Übersicht */}
      <Txt position={[0, -150]} text="ungleiche Pole  →  ziehen sich an" fill={COLORS.green} fontFamily={FONT} fontSize={36} fontWeight={900} opacity={() => regelOp()} />
      <Txt position={[0, 210]} text="gleiche Pole  →  stoßen sich ab" fill={COLORS.red} fontFamily={FONT} fontSize={36} fontWeight={900} opacity={() => regelOp()} />

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 320]} text="★ LernStar" fill={COLORS.indigo} fontFamily={FONT} fontSize={40} fontWeight={900} opacity={() => logoOp()} letterSpacing={3} />
    </Node>,
  );

  // ── 1 · intro (13.5333 s): zwei Magnete weit auseinander ─────────────
  yield* objOp(1, 1.4);
  yield* waitFor(12.1333);

  // ── 2 · ungleich (9.1667 s): N–S → anziehen ─────────────────────────
  yield* all(anzArrOp(1, 0.6), anzOp(1, 0.6), ungleichOp(1, 0.6));
  yield* gap(178, 2.4);
  yield* waitFor(6.1667);

  // ── 3 · gleich (10.7 s): Magnet umdrehen → N–N → abstoßen ────────────
  yield* all(anzArrOp(0, 0.4), anzOp(0, 0.4), ungleichOp(0, 0.4));
  yield* rotB(180, 0.9);
  yield* all(absArrOp(1, 0.5), absOp(1, 0.5), gleichOp(1, 0.5));
  yield* gap(330, 1.6);
  yield* waitFor(7.3);

  // ── 4 · fehlvorstellung (10.8 s): nicht immer anziehen – beides ─────
  yield* waitFor(2.5);
  yield* all(rotB(0, 0.9), absArrOp(0, 0.4), absOp(0, 0.4), gleichOp(0, 0.4));
  yield* all(anzArrOp(1, 0.5), anzOp(1, 0.5), ungleichOp(1, 0.5), gap(180, 1.4));
  yield* waitFor(1.4);
  yield* all(anzArrOp(0, 0.4), anzOp(0, 0.4), ungleichOp(0, 0.4), rotB(180, 0.9), gap(300, 1.2));
  yield* all(absArrOp(1, 0.4), absOp(1, 0.4), gleichOp(1, 0.4));
  yield* waitFor(3.0);

  // ── 5 · regel (10.1333 s): Regel-Übersicht ──────────────────────────
  yield* all(absArrOp(0.3, 0.5), absOp(0, 0.5), gleichOp(0, 0.5));
  yield* regelOp(1, 0.8);
  yield* waitFor(8.8333);

  // ── 6 · abstand (10.9 s): Kraft ↔ Abstand (Kraftmesser) ─────────────
  yield* all(regelOp(0, 0.5), rotB(0, 0.9));
  yield* all(kraftOp(1, 0.6), anzArrOp(1, 0.5), ungleichOp(1, 0.5), absArrOp(0, 0.3));
  yield* gap(165, 1.8);
  yield* waitFor(1.4);
  yield* gap(320, 1.8);
  yield* waitFor(1.4);
  yield* gap(200, 1.4);
  yield* waitFor(1.6);

  // ── 7 · kontaktlos (9.3333 s): Kraft über den Spalt, ohne Berührung ─
  yield* all(gap(230, 1.2), ungleichOp(0, 0.8)); // Pol-Label ausblenden (Platz für Spalt-Text)
  yield* gapHiOp(1, 0.6);
  yield* waitFor(7.5333);

  // ── 8 · outro (7.9667 s) ─────────────────────────────────────────────
  yield* all(kraftOp(0, 0.5), gapHiOp(0, 0.5), anzOp(0, 0.5), ungleichOp(0, 0.5));
  yield* logoOp(1, 0.8);
  yield* waitFor(6.3667);
  yield* waitFor(0.3);
});
