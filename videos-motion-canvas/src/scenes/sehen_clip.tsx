import {makeScene2D, Circle, Line, Rect, Txt, Node} from '@motion-canvas/2d';
import {createSignal, all, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../theme';

// "Sauberer" Composite-Clip zum Sehvorgang (Klasse 5). NUR Fachanimation
// (Strahlengang Lampe→Apfel→Auge), kein Titel/Untertitel — das legt Remotion drüber.
// Segmentdauern framegenau an die Eva-Audios (Piper) angepasst (sehen-mc.timings.json →
// durOf; siehe scripts/print-durations.mjs), Clip läuft KONTINUIERLICH und synchron.
//
// Didaktischer Kern: erst das FALSCHE Sehstrahl-Modell (grüne Strahlen aus dem Auge,
// Apfel bleibt unsichtbar), dann die UMKEHR der Pfeilrichtung (Licht kommt von außen
// ins Auge). Die Umkehr IST die Korrektur der Fehlvorstellung.
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg0);

  // ── Positionen (MC: +y = nach unten) ─────────────────────────────────
  const LAMP: [number, number] = [-620, -150];
  const APPLE: [number, number] = [30, 120];
  const EYE: [number, number] = [620, 120];

  // ── Signale ──────────────────────────────────────────────────────────
  const objOp = createSignal(0);        // Einblenden Apfel/Auge (Intro)
  const appleLit = createSignal(0);     // Apfel-Helligkeit 0..1
  const eyeRay = createSignal(0);       // FALSCHE Strahlen Auge→Apfel (end 0..1)
  const eyeRayOp = createSignal(0);
  const crossOp = createSignal(0);      // "kein Bild"-Markierung
  const lampOp = createSignal(0);       // Lampe sichtbar
  const lampGlow = createSignal(0);     // Leuchten der Lampe
  const outRay = createSignal(0);       // Lampe→Apfel (amber)
  const inRay = createSignal(0);        // Apfel→Auge (sky)
  const directRay = createSignal(0);    // Lampe→Auge direkt (Selbstleuchter)
  const seeing = createSignal(0);       // grüner "sieht"-Ring am Auge
  const roleS = createSignal(0);        // Rollen-Etikett Sender
  const roleO = createSignal(0);        // Gegenstand
  const roleE = createSignal(0);        // Empfänger
  const selfOp = createSignal(0);       // Selbstleuchter-Emojis
  const inPulse = createSignal(0);      // Puls des Apfel→Auge-Strahls (Merksatz)
  const logoOp = createSignal(0);

  // Apfel-Farbe hell↔dunkel: heller Apfel überblendet den dunklen
  const appleDark = 0.16;
  const appleShow = () => objOp() * (appleDark + (1 - appleDark) * appleLit());

  view.add(
    <>
      {/* Lampe */}
      <Circle position={LAMP} size={220} fill={COLORS.amber} opacity={() => 0.30 * lampGlow()} filters={[]} />
      <Txt position={LAMP} text="💡" fontSize={140} opacity={() => lampOp()} />
      {/* Selbstleuchter-Beispiele */}
      <Txt position={[-830, -230]} text="☀️" fontSize={46} opacity={() => selfOp()} />
      <Txt position={[-830, -120]} text="🔥" fontSize={46} opacity={() => selfOp()} />
      <Txt position={[-830, -10]} text="📺" fontSize={46} opacity={() => selfOp()} />

      {/* Apfel (Helligkeit über opacity) */}
      <Txt position={APPLE} text="🍎" fontSize={150} opacity={() => appleShow()} />

      {/* Auge */}
      <Circle position={EYE} size={() => 210} stroke={COLORS.green} lineWidth={9} opacity={() => seeing()} />
      <Txt position={EYE} text="👁️" fontSize={150} opacity={() => objOp()} />

      {/* FALSCHE Strahlen: Auge → Apfel (rot, gestrichelt, nach außen) */}
      <Line points={[EYE, [APPLE[0], APPLE[1] - 40]]} stroke={COLORS.red} lineWidth={6} lineDash={[16, 14]} endArrow arrowSize={18} end={() => eyeRay()} opacity={() => eyeRayOp()} lineCap="round" />
      <Line points={[EYE, APPLE]} stroke={COLORS.red} lineWidth={6} lineDash={[16, 14]} endArrow arrowSize={18} end={() => eyeRay()} opacity={() => eyeRayOp()} lineCap="round" />
      <Line points={[EYE, [APPLE[0], APPLE[1] + 40]]} stroke={COLORS.red} lineWidth={6} lineDash={[16, 14]} endArrow arrowSize={18} end={() => eyeRay()} opacity={() => eyeRayOp()} lineCap="round" />
      <Txt position={[325, 20]} text="✗ kein Bild" fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.red} opacity={() => crossOp()} />

      {/* RICHTIG: Lampe → Apfel → Auge */}
      <Line points={[LAMP, APPLE]} stroke={COLORS.amber} lineWidth={8} endArrow arrowSize={22} end={() => outRay()} opacity={() => outRay() > 0 ? 1 : 0} lineCap="round" />
      <Line
        points={[APPLE, EYE]}
        stroke={COLORS.sky}
        lineWidth={() => 8 + 8 * inPulse()}
        endArrow
        arrowSize={() => 22 + 8 * inPulse()}
        end={() => inRay()}
        opacity={() => inRay() > 0 ? 1 : 0}
        lineCap="round"
        shadowColor={COLORS.sky}
        shadowBlur={() => 18 * inPulse()}
      />
      {/* Selbstleuchter: Lampe direkt ins Auge */}
      <Line points={[LAMP, EYE]} stroke={COLORS.amber} lineWidth={8} endArrow arrowSize={22} end={() => directRay()} opacity={() => directRay() > 0 ? 1 : 0} lineCap="round" />

      {/* Rollen-Etiketten */}
      <Txt position={[LAMP[0], -270]} text="SENDER" fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.amber} opacity={() => roleS()} letterSpacing={2} />
      <Txt position={[APPLE[0], -10]} text="GEGENSTAND" fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.indigo} opacity={() => roleO()} letterSpacing={2} />
      <Txt position={[EYE[0], -10]} text="EMPFÄNGER" fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.sky} opacity={() => roleE()} letterSpacing={2} />

      {/* Sternlogo (Outro) */}
      <Txt position={[0, 330]} text="★ LernStar" fontFamily={FONT} fontSize={40} fontWeight={900} fill={COLORS.indigo} opacity={() => logoOp()} letterSpacing={3} />
    </>,
  );

  // ── Segment 1 · intro (DUR_s 8.2333) ─────────────────────────────────
  yield* all(objOp(1, 1.4), appleLit(0, 0.01));
  yield* waitFor(6.8333);

  // ── Segment 2 · fehlvorstellung (DUR_s 12.4): falsche Sehstrahlen ────
  yield* eyeRayOp(1, 0.4);
  yield* eyeRay(1, 1.4);
  yield* crossOp(1, 0.6);
  yield* eyeRay(0.82, 0.5);
  yield* eyeRay(1, 0.5);
  yield* waitFor(9.0);

  // ── Segment 3 · umkehr (DUR_s 11.8667): Pfeilrichtung dreht sich um ──
  yield* all(eyeRay(0, 1.0), eyeRayOp(0, 1.0), crossOp(0, 0.8), lampOp(1, 1.0), lampGlow(1, 1.0));
  yield* outRay(1, 1.1);
  yield* appleLit(1, 1.0);
  yield* inRay(1, 1.1);
  yield* seeing(1, 0.6);
  yield* waitFor(7.0667);

  // ── Segment 4 · modell (DUR_s 11.3): Sender/Gegenstand/Empfänger ─────
  yield* roleS(1, 0.7);
  yield* roleO(1, 0.7);
  yield* roleE(1, 0.7);
  yield* waitFor(9.2);

  // ── Segment 5 · selbstleuchter (DUR_s 11.4667): Lampe direkt ins Auge ─
  yield* selfOp(1, 0.8);
  yield* directRay(1, 1.2);
  yield* directRay(0.85, 0.5);
  yield* directRay(1, 0.5);
  yield* waitFor(8.4667);

  // ── Segment 6 · experiment (DUR_s 13.0333): Licht AUS → Apfel weg → AN
  yield* all(directRay(0, 0.8), selfOp(0, 0.8));
  yield* all(appleLit(0, 0.9), inRay(0, 0.9), outRay(0, 0.9), lampGlow(0, 0.9), lampOp(0.16, 0.9), seeing(0, 0.9)); // Licht AUS – alles dunkel
  yield* waitFor(1.6);
  yield* all(outRay(1, 0.9), appleLit(1, 0.9), inRay(1, 0.9), lampGlow(1, 0.9), lampOp(1, 0.9), seeing(1, 0.9)); // Licht AN
  yield* waitFor(8.8333);

  // ── Segment 7 · merksatz (DUR_s 9.4333): Apfel→Auge betont ──────────
  yield* waitFor(0.8); // volle Kette sichtbar lassen, nur den Apfel→Auge-Strahl betonen
  yield* inPulse(1, 0.5);
  yield* inPulse(0, 0.5);
  yield* inPulse(1, 0.5);
  yield* inPulse(0, 0.5);
  yield* inPulse(1, 0.5);
  yield* inPulse(0, 0.5);
  yield* waitFor(5.6333);

  // ── Segment 8 · outro (DUR_s 7.5333) ────────────────────────────────
  yield* all(outRay(1, 0.8), lampGlow(1, 0.8), appleLit(1, 0.8));
  yield* logoOp(1, 0.8);
  yield* waitFor(5.6333);

  yield* waitFor(0.3);
});
