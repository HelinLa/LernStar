// EINE Komponente für ALLE Mikrohilfen der Reihe FELO Mathematik 8.
//
// Die elf Hilfen tun dasselbe: eine Gleichung Schritt für Schritt verändern.
// Sie unterscheiden sich in den DATEN, nicht im Aussehen - deshalb gibt es
// hier keine elf Dateien, sondern einen Interpreter für die Bildsprache aus
// mathe_mikrohilfen/PROFIL.md §12.
//
// Daten:      src/mikrohilfen/<kennung>.json   (aus der Hilfe erzeugt)
// Zeitmarken: src/narration/mh-<kennung>.timings.json  (GEMESSEN, aus dem Audio)
// Erzeugt von mathe_mikrohilfen/narration_bauen.py - nichts davon abtippen.
import React from 'react';
import {
  Series,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS } from '../theme';
import { Bg, Caption } from '../components';
import { MIKROHILFEN, Hilfe, Teil } from '../mikrohilfen/daten';

const FPS = 30;
const TAIL = 30; // 1 s Nachlauf je Teil: Zeit, das Bild anzusehen
const MIN = 75; // kein Teil kürzer als 2,5 s
const BLASS = 0.34; // alte Zeilen werden blass, nicht gelöscht (§5.2)

// Die Bildlängen kommen aus den GEMESSENEN Zeitmarken, nicht aus Frames,
// die jemand geschätzt hat.
const durOf = (sek: number, halte: number) =>
  Math.max(MIN, Math.round(sek * FPS) + TAIL) + Math.round(halte * FPS);

// `halte` steckt auch in einem `zusammen`-Bündel - sonst verlöre ein Teil F,
// das seine Bausteine bündelt, still seine Standzeit.
const halteVon = (t: Teil): number => {
  const summe = (liste: Record<string, unknown>[]): number =>
    liste.reduce((s, b) => {
      if (typeof b.halte === 'number') return s + b.halte;
      if (Array.isArray(b.zusammen))
        return s + summe(b.zusammen as Record<string, unknown>[]);
      return s;
    }, 0);
  return summe(t.szene as Record<string, unknown>[]);
};

const teilDauer = (h: Hilfe, i: number) =>
  durOf(h.zeiten[h.teile[i].id] ?? 0, halteVon(h.teile[i]));

export const mikrohilfeDauer = (kennung: string) =>
  MIKROHILFEN[kennung].teile.reduce(
    (s, _t, i) => s + teilDauer(MIKROHILFEN[kennung], i),
    0
  );

// Vier Farben, mehr nicht (PROFIL.md §12).
const FARBE: Record<string, string> = {
  rot: COLORS.red,
  gelb: COLORS.amber,
  blau: COLORS.sky,
  gruen: COLORS.green,
};

// ── Termsuche ──────────────────────────────────────────────────────────
// „+5" muss auch in „3x + 5" gefunden werden: Leerzeichen zählen nicht, und
// jeder Strich ist ein Minus. Sonst schriebe der Autor die Szene nach den
// Launen des Setzers statt nach der Bildbeschreibung.
const normZ = (c: string) => ('-–—−'.includes(c) ? '−' : c);

function finde(text: string, teil: string): [string, string, string] | null {
  const ziel = Array.from(teil)
    .filter((c) => !/\s/.test(c))
    .map(normZ)
    .join('');
  if (!ziel) return null;
  let n = '';
  const pos: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (/\s/.test(text[i])) continue;
    n += normZ(text[i]);
    pos.push(i);
  }
  const p = n.indexOf(ziel);
  if (p < 0) return null;
  const a = pos[p];
  const b = pos[p + ziel.length - 1] + 1;
  return [text.slice(0, a), text.slice(a, b), text.slice(b)];
}

const gleich = (a: string, b: string) =>
  Array.from(a).filter((c) => !/\s/.test(c)).map(normZ).join('') ===
  Array.from(b).filter((c) => !/\s/.test(c)).map(normZ).join('');

// ── Die Tafel als Zustand ──────────────────────────────────────────────
type DekoArt = 'ring' | 'mark' | 'gruen' | 'box' | 'pfeil' | 'gross';
type Deko = {
  art: DekoArt;
  teil: string;
  farbe: string;
  seit: number;
  inhalt?: string; // box: was im Kästchen steht („" = leer)
  stark?: boolean; // pfeil: kräftig statt blass
  nur?: boolean; // nur im eigenen Teil zu sehen (Zeigegeste, kein Zustand)
};
type Urteil = { art: 'kreuz' | 'frage' | 'haken'; seit: number };
type Halb = 'links' | 'rechts';

type Gl = {
  k: 'gl';
  id: number;
  seit: number;
  blass: boolean;
  links: string;
  rechts: string | null;
  dekos: Deko[];
  urteil?: Urteil;
  box?: boolean; // grauer Kasten: eine gegebene Zahl, kein Rechenschritt
};
type Op = {
  k: 'op';
  id: number;
  seit: number;
  blass: boolean;
  text: string;
  seiten: Halb[];
  gruen?: Halb;
};
type Null0 = { k: 'null'; id: number; seit: number; blass: boolean; seite: Halb; text: string };
type Ziel = {
  k: 'ziel';
  id: number;
  seit: number;
  blass: boolean;
  links: string;
  rechts: string | null;
  dekos: Deko[];
};
type Waage = { k: 'waage'; id: number; seit: number; blass: boolean; links: string; rechts: string; kippt: string };
type Notiz = { k: 'notiz'; id: number; seit: number; blass: boolean; text: string };
type Reihe = Gl | Op | Null0 | Ziel | Waage | Notiz;

const teilen = (s: string): [string, string | null] => {
  const i = s.indexOf('=');
  return i < 0 ? [s.trim(), null] : [s.slice(0, i).trim(), s.slice(i + 1).trim()];
};
const ganzeZeile = (r: Gl | Ziel) => (r.rechts === null ? r.links : `${r.links} = ${r.rechts}`);

/** Faltet die Bausteine der Teile 0…bis zu dem, was in Teil `bis` zu sehen ist. */
function tafel(teile: Teil[], bis: number): Reihe[] {
  let reihen: Reihe[] = [];
  let id = 0;
  // Die offene Rechenzeile: „was ich GERADE auf beiden Seiten tue". Es gibt
  // höchstens eine; ein neues `unter…` löst sie ab, solange `hebeAuf` oder
  // `neueZeile` sie nicht festgeschrieben haben. Ohne diese Regel stapelte
  // gl03 drei −6-Zeilen übereinander (C richtig, D Gegenprobe, E wieder richtig).
  let offeneOp: Op | null = null;

  const aktiv = () =>
    [...reihen].reverse().find((r) => r.k === 'gl' && !(r as Gl).box) as Gl | undefined;
  const letzteOp = () => [...reihen].reverse().find((r) => r.k === 'op') as Op | undefined;

  /** Die Zeile, auf die eine Hervorhebung gehört: die unterste, die den Term
   *  enthält - und dabei die erste, die diese Hervorhebung noch NICHT trägt.
   *  Dadurch landen „je ein gelber Ring" auf zwei Zeilen (gl11 D) statt
   *  zweimal auf derselben. */
  const zielZeile = (t: string, art: DekoArt) => {
    const kand = [...reihen]
      .reverse()
      .filter((r) => (r.k === 'gl' || r.k === 'ziel') && finde(ganzeZeile(r as Gl | Ziel), t)) as (
      | Gl
      | Ziel
    )[];
    return kand.find((r) => !r.dekos.some((d) => d.art === art && gleich(d.teil, t))) ?? kand[0];
  };
  const trefferZeile = (t: string) =>
    [...reihen].reverse().find((r) => (r.k === 'gl' || r.k === 'ziel') && finde(ganzeZeile(r), t)) as
      | Gl
      | Ziel
      | undefined;

  /** Zweimal dasselbe in EINEM Teil meint zwei Stellen (gl10 E: „beide 19
   *  werden grün"). Dasselbe in einem SPÄTEREN Teil meint dieselbe
   *  Hervorhebung, neu betont - gl01 wiederholt den roten Ring in C, D und E,
   *  und drei Ringe übereinander wären derselbe Ring, nur ohne Aufleuchten. */
  const setzeDeko = (r: Gl | Ziel, d: Deko, einmalig = true) => {
    if (einmalig) {
      const alt = r.dekos.find(
        (e) =>
          e.art === d.art && gleich(e.teil, d.teil) && e.farbe === d.farbe && e.seit < d.seit
      );
      if (alt) {
        alt.seit = d.seit;
        return;
      }
    }
    r.dekos.push(d);
  };

  const anwenden = (st: Record<string, any>, i: number, jetzt: boolean) => {
    if ('zusammen' in st) {
      // Ein Vorgang, den das Auge als EINEN liest (§12.4). Für das Bild ist
      // das Bündel nichts: es wird schlicht ausgepackt.
      for (const u of st.zusammen as Record<string, any>[]) anwenden(u, i, jetzt);
      return;
    }
    if ('gegenprobe' in st) {
      // „Was passiert, wenn du es FALSCH machst?" - und danach ist es weg.
      // Eine Gegenprobe ist ein Vorführstück, kein Zustand der Tafel: Am
      // Standbild von gl03 stand das widerlegte x = 14 sonst noch in E und F,
      // also ausgerechnet in den drei Sekunden, die der Schüler abschreibt.
      if (!jetzt) return;
      for (const u of st.gegenprobe as Record<string, any>[]) anwenden(u, i, jetzt);
      return;
    }
    if ('zeile' in st) {
      const [l, r] = teilen(String(st.zeile));
      reihen.push({ k: 'gl', id: id++, seit: i, blass: false, links: l, rechts: r, dekos: [] });
    } else if ('kasten' in st) {
      reihen.push({
        k: 'gl',
        id: id++,
        seit: i,
        blass: false,
        links: String(st.kasten),
        rechts: null,
        dekos: [],
        box: true,
      });
    } else if ('zielzeile' in st) {
      const [l, r] = teilen(String(st.zielzeile));
      reihen.push({ k: 'ziel', id: id++, seit: i, blass: true, links: l, rechts: r, dekos: [] });
    } else if ('ring' in st) {
      const z = zielZeile(String(st.ring), 'ring');
      if (z)
        setzeDeko(z, {
          art: 'ring',
          teil: String(st.ring),
          farbe: FARBE[st.farbe ?? 'rot'],
          seit: i,
        });
    } else if ('markiere' in st) {
      const z = zielZeile(String(st.markiere), 'mark');
      if (z)
        setzeDeko(z, {
          art: 'mark',
          teil: String(st.markiere),
          farbe: FARBE[st.farbe ?? 'blau'],
          seit: i,
        });
    } else if ('gross' in st) {
      const z = zielZeile(String(st.gross), 'gross');
      if (z) setzeDeko(z, { art: 'gross', teil: String(st.gross), farbe: COLORS.ink, seit: i });
    } else if ('buendel' in st) {
      // Unter jedem genannten Term ein Kästchen. Gleiche Kästchen sagen:
      // hier steckt dasselbe drin (gl07 D), ein leeres: hier steckt nichts
      // dergleichen (gl08 D).
      // Ein Bündel gehört auf EINE Zeile - die unterste, die den Term trägt.
      // Welches der beiden x das zweite Kästchen bekommt, entscheidet die
      // Zerlegung der Zeile, nicht die Zeilensuche.
      for (const e of st.buendel as { unter: string; inhalt?: string }[]) {
        const z = trefferZeile(String(e.unter));
        if (z)
          setzeDeko(
            z,
            {
              art: 'box',
              teil: String(e.unter),
              farbe: COLORS.sky,
              seit: i,
              inhalt: String(e.inhalt ?? ''),
            },
            false
          );
      }
    } else if ('pfeile' in st) {
      // Die WAHL zwischen zwei Stellen (gl06 B): ein blasser und ein
      // kräftiger Pfeil von unten. Zeigegeste, kein Zustand - sie stehen nur
      // in ihrem eigenen Teil.
      const p = st.pfeile as { blass?: string; kraeftig?: string };
      for (const [feld, stark] of [
        ['blass', false],
        ['kraeftig', true],
      ] as [keyof typeof p, boolean][]) {
        const t = p[feld];
        if (!t) continue;
        const z = trefferZeile(String(t));
        if (z)
          setzeDeko(
            z,
            { art: 'pfeil', teil: String(t), farbe: COLORS.amber, seit: i, stark, nur: true },
            false
          );
      }
    } else if ('unterBeide' in st || 'unterLinks' in st || 'unterRechts' in st) {
      const text = String(st.unterBeide ?? st.unterLinks ?? st.unterRechts);
      const seiten: Halb[] =
        'unterBeide' in st ? ['links', 'rechts'] : 'unterLinks' in st ? ['links'] : ['rechts'];
      if (offeneOp) reihen = reihen.filter((r) => r !== offeneOp);
      const op: Op = { k: 'op', id: id++, seit: i, blass: false, text, seiten };
      reihen.push(op);
      offeneOp = op;
    } else if ('hebeAuf' in st) {
      const paar = st.hebeAuf as string[];
      const z = aktiv();
      const op = letzteOp();
      if (z) {
        const seite: Halb = finde(z.links, paar[0]) ? 'links' : 'rechts';
        // Der Ring aus dem Teil davor muss weichen: das Paar soll als EIN
        // grünes Paar zu lesen sein, nicht als rot plus grün (§12.4).
        //
        // Verglichen wird auf ÜBERSCHNEIDUNG, nicht auf Gleichheit. `gl04`
        // ringt in B die „3" ein und hebt in D das „3x" auf: bei Gleichheit
        // blieb der rote Ring liegen - und weil er das „3x" schon in „3" und
        // „x" zerlegt hatte, fand das Grün seinen Term nicht mehr und fiel
        // STILL aus. Im fertigen Video stand rot neben grün, und die
        // Hervorhebung, die die Bildbeschreibung verlangt, fehlte ganz.
        z.dekos = z.dekos.filter(
          (d) => !finde(paar[0], d.teil) && !finde(d.teil, paar[0])
        );
        z.dekos.push({ art: 'gruen', teil: paar[0], farbe: COLORS.green, seit: i });
        if (op) op.gruen = seite;
        reihen.push({ k: 'null', id: id++, seit: i, blass: false, seite, text: String(st.wird ?? '0') });
      }
      offeneOp = null;
    } else if ('ersetze' in st) {
      const { was, durch } = st.ersetze as { was: string; durch: string; farbe?: string };
      const z = zielZeile(String(was), 'mark');
      if (z && z.k === 'gl') {
        const l = finde(z.links, was);
        if (l) z.links = l[0] + durch + l[2];
        else {
          const r = z.rechts ? finde(z.rechts, was) : null;
          if (r) z.rechts = r[0] + durch + r[2];
        }
        // Hervorhebungen, deren Term es nach dem Tausch nicht mehr gibt,
        // würden sonst stumm verschwinden - und der Autor sähe nie, dass sie
        // weg sind. Sie werden hier bewusst abgeräumt.
        z.dekos = z.dekos.filter((d) => finde(ganzeZeile(z), d.teil));
        setzeDeko(z, {
          art: 'mark',
          teil: String(durch),
          farbe: FARBE[(st.ersetze as any).farbe ?? 'gelb'],
          seit: i,
        });
      }
    } else if ('neueZeile' in st) {
      reihen.forEach((r) => (r.blass = true));
      const [l, r] = teilen(String(st.neueZeile));
      const neu: Gl = { k: 'gl', id: id++, seit: i, blass: false, links: l, rechts: r, dekos: [] };
      if (st.hervor)
        neu.dekos.push({ art: 'ring', teil: String(st.hervor), farbe: FARBE.gelb, seit: i });
      reihen.push(neu);
      offeneOp = null;
    } else if ('nurNoch' in st) {
      // „steht allein im Bild": GENAU eine Zeile bleibt - die unterste, die
      // den Term trägt. Das Gerüst darunter (Kästchen, Pfeile) geht mit ab,
      // die Bewertung der Zeile bleibt.
      const t = String(st.nurNoch);
      const bleibt = [...reihen]
        .reverse()
        .find((r) => (r.k === 'gl' || r.k === 'ziel') && finde(ganzeZeile(r), t)) as
        | Gl
        | Ziel
        | undefined;
      reihen = bleibt ? [bleibt] : [];
      if (bleibt) {
        bleibt.blass = false;
        bleibt.dekos = bleibt.dekos.filter((d) => d.art !== 'box' && d.art !== 'pfeil');
      }
      offeneOp = null;
    } else if ('kreuz' in st || 'frage' in st || 'haken' in st) {
      const art = ('kreuz' in st ? 'kreuz' : 'frage' in st ? 'frage' : 'haken') as Urteil['art'];
      const ziel = trefferZeile(String(st[art])) ?? aktiv();
      if (ziel && ziel.k === 'gl') ziel.urteil = { art, seit: i };
    } else if ('waage' in st) {
      // Die Waage ist EIN Gerät auf der Tafel. Wer sie noch einmal setzt,
      // verstellt sie - er stellt keine zweite daneben. Nicht genannte
      // Felder bleiben, wie sie waren; `kippt` fehlt = gerade (§12.2).
      const w = st.waage as { links?: string; rechts?: string; kippt?: string };
      const da = reihen.find((r) => r.k === 'waage') as Waage | undefined;
      if (da) {
        if (w.links !== undefined) da.links = w.links;
        if (w.rechts !== undefined) da.rechts = w.rechts;
        da.kippt = w.kippt ?? 'keine';
        da.seit = i;
        da.blass = false;
      } else {
        reihen.push({
          k: 'waage',
          id: id++,
          seit: i,
          blass: false,
          links: w.links ?? '',
          rechts: w.rechts ?? '',
          kippt: w.kippt ?? 'keine',
        });
      }
    } else if ('notiz' in st) {
      reihen.push({ k: 'notiz', id: id++, seit: i, blass: false, text: String(st.notiz) });
    }
    // `halte` ist reine Zeit und ändert am Bild nichts.
  };

  for (let i = 0; i <= bis; i++)
    for (const st of teile[i].szene as Record<string, any>[])
      anwenden(st, i, i === bis);
  return reihen;
}

// ── Zeichnen ───────────────────────────────────────────────────────────
const GROSS = 104; // Hauptzeile - das Video läuft am Beamer
const KLEIN = 72; // Rechenzeile darunter
const HOCH = 570; // Platz zwischen Kopf und Untertitel (1080 − 250 − 260)
const HAENGT = 124; // Platz, den Kästchen und Pfeile unter einer Zeile brauchen

const haengend = (d: Deko[]) => d.some((x) => x.art === 'box' || x.art === 'pfeil');

/** Geschätzte Bauhöhe der Tafel - ohne DOM, damit sie in jedem Frame
 *  DIESELBE ist. Sie entscheidet, ob die Tafel verkleinert werden muss:
 *  lieber etwas kleiner als unter der Kante abgeschnitten. */
function bauhoehe(reihen: Reihe[]): number {
  let h = 0;
  for (const r of reihen) {
    if (r.k === 'gl') h += (r.box ? KLEIN : GROSS) * 1.24 + (haengend(r.dekos) ? HAENGT : 0);
    else if (r.k === 'ziel') h += (GROSS - 18) * 1.24;
    else if (r.k === 'op') h += KLEIN * 1.3;
    else if (r.k === 'null') h += (GROSS - 16) * 1.24;
    else if (r.k === 'waage') h += 250;
    else h += 56;
  }
  return h + Math.max(0, reihen.length - 1) * 22;
}

const Zeichen: React.FC<{ art: Urteil['art']; s: number }> = ({ art, s }) => {
  const farbe = art === 'kreuz' ? COLORS.red : art === 'haken' ? COLORS.green : COLORS.amber;
  if (art === 'frage')
    return (
      <span style={{ marginLeft: 34, color: farbe, fontWeight: 900, opacity: s, fontSize: GROSS }}>?</span>
    );
  return (
    <svg width={86} height={86} viewBox="0 0 100 100" style={{ marginLeft: 30, marginBottom: -14, opacity: s, transform: `scale(${0.6 + 0.4 * s})` }}>
      {art === 'kreuz' ? (
        <>
          <line x1={18} y1={18} x2={82} y2={82} stroke={farbe} strokeWidth={14} strokeLinecap="round" />
          <line x1={82} y1={18} x2={18} y2={82} stroke={farbe} strokeWidth={14} strokeLinecap="round" />
        </>
      ) : (
        <polyline
          points="16,54 40,80 86,20"
          fill="none"
          stroke={farbe}
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

type Seg = { text: string; dekos: Deko[] };

/** Zerlegt eine Seite in Stücke, von denen jedes seine Hervorhebungen kennt.
 *  Ein Stück kann MEHRERE tragen (in gl08 D hängt unter dem gelb geringten
 *  3x zusätzlich ein Kästchen); und eine zweite gleichartige Hervorhebung
 *  sucht sich das NÄCHSTE Vorkommen, statt sich auf das erste zu legen
 *  (gl07 D: unter jedem der beiden x ein Kästchen). */
function segmente(text: string, dekos: Deko[]): Seg[] {
  let segs: Seg[] = [{ text, dekos: [] }];
  for (const d of dekos) {
    const raus: Seg[] = [];
    let fertig = false;
    for (const s of segs) {
      if (fertig || s.dekos.some((e) => e.art === d.art && gleich(e.teil, d.teil))) {
        raus.push(s);
        continue;
      }
      const t = finde(s.text, d.teil);
      if (!t) {
        raus.push(s);
        continue;
      }
      if (t[0]) raus.push({ text: t[0], dekos: s.dekos });
      raus.push({ text: t[1], dekos: [...s.dekos, d] });
      if (t[2]) raus.push({ text: t[2], dekos: s.dekos });
      fertig = true;
    }
    segs = raus;
  }
  return segs;
}

const Kaestchen: React.FC<{ d: Deko; auf: number }> = ({ d, auf }) => (
  <span
    style={{
      position: 'absolute',
      top: '108%',
      left: '50%',
      transform: `translateX(-50%) scale(${auf})`,
      width: 92,
      height: 92,
      borderRadius: 16,
      border: `6px solid ${COLORS.sky}`,
      background: 'rgba(56,189,248,0.10)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 58,
      fontWeight: 800,
      color: COLORS.sky,
      opacity: auf,
    }}
  >
    {d.inhalt}
  </span>
);

const Pfeil: React.FC<{ d: Deko; auf: number }> = ({ d, auf }) => (
  <svg
    width={64}
    height={96}
    viewBox="0 0 64 96"
    style={{
      position: 'absolute',
      top: '104%',
      left: '50%',
      transform: `translateX(-50%) translateY(${(1 - auf) * 20}px)`,
      opacity: (d.stark ? 1 : 0.3) * auf,
    }}
  >
    <line x1={32} y1={92} x2={32} y2={26} stroke={d.farbe} strokeWidth={d.stark ? 12 : 8} strokeLinecap="round" />
    <polyline
      points="10,42 32,14 54,42"
      fill="none"
      stroke={d.farbe}
      strokeWidth={d.stark ? 12 : 8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Seite: React.FC<{ text: string; dekos: Deko[]; teil: number; size: number }> = ({
  text,
  dekos,
  teil,
  size,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Eine Markierung, die die GANZE Seite umfasst („ein gelbes Feld mit
  // 3x + 2x"), wird als Feld um die Zeile gelegt - nicht als Stück in ihr.
  // Sonst zerschnitte jede spätere Hervorhebung das Feld in drei Kästen mit
  // sichtbaren Nähten.
  const voll = dekos.find((d) => d.art === 'mark' && gleich(d.teil, text));
  const rest = dekos.filter((d) => d !== voll).filter((d) => !d.nur || d.seit === teil);
  const auf = (d: Deko) => (d.seit === teil ? spring({ frame, fps, config: { damping: 200 } }) : 1);

  const kern = (
    // wordSpacing: der Ring braucht Luft. Ohne den weiteren Wortabstand
    // schneidet er in das 3x und in das Gleichheitszeichen.
    <span
      style={{
        whiteSpace: 'pre',
        fontSize: size,
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
        wordSpacing: '0.22em',
      }}
    >
      {segmente(text, rest).map((s, i) => {
        if (!s.dekos.length) return <span key={i}>{s.text}</span>;
        const gr = s.dekos.some((d) => d.art === 'gross');
        const gn = s.dekos.some((d) => d.art === 'gruen');
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              color: gn ? COLORS.green : undefined,
              fontSize: gr ? '1.3em' : undefined,
              fontWeight: gr ? 900 : undefined,
            }}
          >
            {s.dekos.map((d, j) => {
              const a = auf(d);
              if (d.art === 'box') return <Kaestchen key={j} d={d} auf={a} />;
              if (d.art === 'pfeil') return <Pfeil key={j} d={d} auf={a} />;
              if (d.art === 'gruen' || d.art === 'gross') return null;
              return (
                <span
                  key={j}
                  style={{
                    position: 'absolute',
                    inset: d.art === 'mark' ? '-10px -18px' : '-14px -24px',
                    borderRadius: d.art === 'mark' ? 20 : 999,
                    border: d.art === 'mark' ? 'none' : `8px solid ${d.farbe}`,
                    background: d.art === 'mark' ? `${d.farbe}33` : 'transparent',
                    opacity: a,
                    transform: `scale(${interpolate(a, [0, 1], [1.35, 1])})`,
                  }}
                />
              );
            })}
            {s.text}
          </span>
        );
      })}
    </span>
  );

  if (!voll) return kern;
  const a = auf(voll);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          position: 'absolute',
          inset: '-16px -28px',
          borderRadius: 22,
          background: `${voll.farbe}2e`,
          border: `4px solid ${voll.farbe}80`,
          opacity: a,
          transform: `scale(${interpolate(a, [0, 1], [1.2, 1])})`,
        }}
      />
      {kern}
    </span>
  );
};

const WaageBild: React.FC<{ r: Waage }> = ({ r }) => {
  const neig = r.kippt === 'links' ? -11 : r.kippt === 'rechts' ? 11 : 0;
  return (
    <svg width={760} height={250} viewBox="0 0 760 250">
      <g transform={`rotate(${neig} 380 70)`}>
        <line x1={70} y1={70} x2={690} y2={70} stroke={COLORS.ink} strokeWidth={12} strokeLinecap="round" />
        <rect x={90} y={78} width={240} height={74} rx={12} fill={COLORS.panel} stroke={COLORS.border} strokeWidth={3} />
        <rect x={430} y={78} width={240} height={74} rx={12} fill={COLORS.panel} stroke={COLORS.border} strokeWidth={3} />
        <text x={210} y={130} textAnchor="middle" fill={COLORS.ink} fontSize={50} fontWeight={800}>
          {r.links}
        </text>
        <text x={550} y={130} textAnchor="middle" fill={COLORS.ink} fontSize={50} fontWeight={800}>
          {r.rechts}
        </text>
      </g>
      <polygon points="380,74 330,218 430,218" fill={COLORS.indigoDeep} />
      <rect x={280} y={218} width={200} height={14} rx={7} fill={COLORS.ground} />
    </svg>
  );
};

const Tafel: React.FC<{ reihen: Reihe[]; vorher: Reihe[]; teil: number }> = ({ reihen, vorher, teil }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const deck = (r: Reihe) => {
    const alt = vorher.find((v) => v.id === r.id);
    if (alt && !alt.blass && r.blass)
      return interpolate(frame, [0, 14], [1, BLASS], { extrapolateRight: 'clamp' });
    if (r.seit === teil) return spring({ frame, fps, config: { damping: 200 } });
    return r.blass ? BLASS : 1;
  };
  const hoch = (r: Reihe) =>
    r.seit === teil ? interpolate(spring({ frame, fps, config: { damping: 200 } }), [0, 1], [26, 0]) : 0;

  const zelle = (r: Reihe, inhalt: React.ReactNode, wo: 'end' | 'start' | 'center', key: string) => (
    <div
      key={key}
      style={{
        justifySelf: wo,
        opacity: deck(r),
        transform: `translateY(${hoch(r)}px)`,
        color: r.blass ? COLORS.muted : COLORS.ink,
      }}
    >
      {inhalt}
    </div>
  );

  // Die Tafel darf nicht unter die Kante laufen (der teuerste Fehler der
  // Heftreihe, auf Video übertragen). Passt sie nicht, wird sie als GANZES
  // kleiner - nie abgeschnitten.
  const skala = Math.min(1, HOCH / Math.max(1, bauhoehe(reihen)));

  // Kein AbsoluteFill: das setzt height:100% und macht damit `bottom`
  // wirkungslos - die Tafel stand 250 px zu tief, halb unter der Caption.
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 250,
        bottom: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          columnGap: 40,
          rowGap: 22,
          alignItems: 'center',
          transform: `scale(${skala})`,
        }}
      >
        {reihen.map((r) => {
          if (r.k === 'gl' || r.k === 'ziel') {
            const dekos = r.dekos;
            const size = r.k === 'gl' ? (r.box ? KLEIN : GROSS) : GROSS - 18;
            const stil: React.CSSProperties = r.k === 'ziel' ? { opacity: 0.75 } : {};
            const raum = haengend(dekos) ? HAENGT : 0;
            const kastenStil: React.CSSProperties =
              r.k === 'gl' && r.box
                ? {
                    background: COLORS.panel,
                    border: `3px solid ${COLORS.border}`,
                    borderRadius: 18,
                    padding: '10px 34px',
                  }
                : {};
            if (r.rechts === null)
              return (
                <React.Fragment key={r.id}>
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      justifySelf: 'center',
                      opacity: deck(r),
                      transform: `translateY(${hoch(r)}px)`,
                      color: r.blass ? COLORS.muted : COLORS.ink,
                      paddingBottom: raum,
                      ...stil,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', ...kastenStil }}>
                      <Seite text={r.links} dekos={dekos} teil={teil} size={size} />
                      {r.k === 'gl' && r.urteil ? (
                        <Zeichen art={r.urteil.art} s={r.urteil.seit === teil ? spring({ frame, fps, config: { damping: 200 } }) : 1} />
                      ) : null}
                    </span>
                  </div>
                </React.Fragment>
              );
            return (
              <React.Fragment key={r.id}>
                {zelle(
                  r,
                  <span style={{ display: 'inline-block', paddingBottom: raum }}>
                    <Seite text={r.links} dekos={dekos} teil={teil} size={size} />
                  </span>,
                  'end',
                  `${r.id}l`
                )}
                {zelle(
                  r,
                  <span style={{ fontSize: size, fontWeight: 800, opacity: r.k === 'ziel' ? 0.75 : 1, paddingBottom: raum, display: 'inline-block' }}>=</span>,
                  'center',
                  `${r.id}m`
                )}
                {zelle(
                  r,
                  <span style={{ display: 'inline-flex', alignItems: 'center', paddingBottom: raum }}>
                    <Seite text={r.rechts ?? ''} dekos={dekos} teil={teil} size={size} />
                    {r.k === 'gl' && r.urteil ? (
                      <Zeichen art={r.urteil.art} s={r.urteil.seit === teil ? spring({ frame, fps, config: { damping: 200 } }) : 1} />
                    ) : null}
                  </span>,
                  'start',
                  `${r.id}r`
                )}
              </React.Fragment>
            );
          }
          if (r.k === 'op') {
            const farb = (s: Halb) => (r.gruen === s ? COLORS.green : COLORS.ink);
            const t = (s: Halb) =>
              r.seiten.includes(s) ? (
                <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'pre', fontSize: KLEIN, fontWeight: 800, color: r.blass ? COLORS.muted : farb(s) }}>
                  {r.gruen === s ? (
                    <span
                      style={{
                        position: 'absolute',
                        inset: '-12px -22px',
                        borderRadius: 999,
                        border: `8px solid ${COLORS.green}`,
                        opacity: deck(r),
                      }}
                    />
                  ) : null}
                  {r.text}
                </span>
              ) : null;
            return (
              <React.Fragment key={r.id}>
                {zelle(r, t('links'), 'end', `${r.id}l`)}
                <div key={`${r.id}m`} />
                {zelle(r, t('rechts'), 'start', `${r.id}r`)}
              </React.Fragment>
            );
          }
          if (r.k === 'null') {
            const z = (
              <span style={{ fontSize: GROSS - 16, fontWeight: 900, color: COLORS.green }}>{r.text}</span>
            );
            return (
              <React.Fragment key={r.id}>
                {r.seite === 'links' ? zelle(r, z, 'end', `${r.id}l`) : <div key={`${r.id}l`} />}
                <div key={`${r.id}m`} />
                {r.seite === 'rechts' ? zelle(r, z, 'start', `${r.id}r`) : <div key={`${r.id}r`} />}
              </React.Fragment>
            );
          }
          if (r.k === 'waage')
            return (
              <div
                key={r.id}
                style={{ gridColumn: '1 / -1', justifySelf: 'center', opacity: deck(r), transform: `translateY(${hoch(r)}px)` }}
              >
                <WaageBild r={r} />
              </div>
            );
          return (
            <div
              key={r.id}
              style={{
                gridColumn: '1 / -1',
                justifySelf: 'center',
                opacity: deck(r),
                transform: `translateY(${hoch(r)}px)`,
                fontSize: 40,
                fontWeight: 700,
                color: COLORS.muted,
                marginTop: 10,
              }}
            >
              {r.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Kopf: React.FC<{ h: Hilfe }> = ({ h }) => (
  <div style={{ position: 'absolute', top: 58, left: 96, right: 96 }}>
    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: COLORS.indigo }}>
      Mikrohilfe {h.kennung} · FELO Mathematik 8
    </div>
    <div style={{ fontSize: 44, fontWeight: 700, color: COLORS.muted, marginTop: 8 }}>„{h.frage}“</div>
  </div>
);

export const Mikrohilfe: React.FC<{ kennung: string }> = ({ kennung }) => {
  const h = MIKROHILFEN[kennung];
  const zustaende = React.useMemo(() => h.teile.map((_t, i) => tafel(h.teile, i)), [h]);
  return (
    <Bg>
      <Kopf h={h} />
      <Series>
        {h.teile.map((t, i) => (
          <Series.Sequence key={t.id} durationInFrames={teilDauer(h, i)}>
            <Tafel reihen={zustaende[i]} vorher={i > 0 ? zustaende[i - 1] : []} teil={i} />
            <Caption>{t.text}</Caption>
            <Audio src={staticFile(`audio/mh-${h.kennung}/${t.id}.wav`)} />
          </Series.Sequence>
        ))}
      </Series>
    </Bg>
  );
};
