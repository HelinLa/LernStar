# -*- coding: utf-8 -*-
"""Macht aus den Mikrohilfen die Daten der Videowerkstatt.

Aus einer Hilfe wird dreierlei:

  1. die SPRECHFASSUNG   -> videos-remotion/src/narration/mh-<kennung>.json
     ([{id,text}], id = A…F). Aus ihr baut `npm run audio` die WAV-Dateien und
     die GEMESSENEN Zeitmarken mh-<kennung>.timings.json.
  2. die SZENE           -> videos-remotion/src/mikrohilfen/<kennung>.json
     (Sprechertext + Bausteinliste je Teil, siehe PROFIL.md §12)
  3. die Registrierung   -> videos-remotion/src/mikrohilfen/daten.ts
     (eine Schleife in Root.tsx macht daraus die Compositions)

Von Hand abgetippte Sprechertexte driften: Wer im Skript ein Wort ändert und
das Video nicht neu erzeugt, hat ein Video, das etwas anderes sagt als die
abgenommene Hilfe. Deshalb gibt es keinen zweiten Ort, an dem der Text steht.

    python3 narration_bauen.py                # alle Hilfen mit Feld "szene"
    python3 narration_bauen.py gl02           # nur diese
    python3 narration_bauen.py --ohne-audio   # nur Daten, kein `say`

Ohne gemessene Zeitmarken wird eine Hilfe NICHT registriert (und in Root.tsx
also nicht gebaut) - die Bildlängen kommen aus der Messung, nicht aus einer
Schätzung.
"""
import json, os, re, subprocess, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from sprechfassung import hilfe_sprechfassung  # noqa: E402

VIDEOS = os.path.join(os.path.dirname(HERE), "videos-remotion")
NARR = os.path.join(VIDEOS, "src", "narration")
ZIEL = os.path.join(VIDEOS, "src", "mikrohilfen")

# Sprechtempo der Mikrohilfen. Die Systemstimme „Anna" rastet: 110 bis 150
# Wörter je Minute liefern GEMESSEN dieselbe Datei (gl02: 15,18 s), erst
# darüber wird sie schneller (178 -> 13,80 s). 140 liegt in der Raste und ist
# damit das ruhige Ende des Bandes - die Physikreihe fährt 178, die
# Mikrohilfen sprechen zu einem Schüler, der gerade nicht weiterkommt.
SAY_RATE = os.environ.get("SAY_RATE", "140")

# ── Die Bildsprache (PROFIL.md §12) ────────────────────────────────────────
# Leitfeld -> erlaubte Zusatzfelder
BAUSTEINE = {
    "zeile":       set(),
    "zielzeile":   set(),
    "kasten":      set(),          # gegebene Zahl im grauen Kasten
    "ring":        {"farbe"},
    "markiere":    {"farbe"},
    "gross":       set(),
    "buendel":     set(),          # [{"unter": …, "inhalt": …}, …]
    "pfeile":      set(),          # {"blass": …, "kraeftig": …}
    "unterBeide":  set(),
    "unterLinks":  set(),
    "unterRechts": set(),
    "hebeAuf":     {"wird"},
    "ersetze":     set(),          # {"was": …, "durch": …, "farbe": …}
    "neueZeile":   {"hervor"},
    "nurNoch":     set(),
    "kreuz":       set(),
    "frage":       set(),
    "haken":       set(),
    "waage":       set(),          # {"links":…, "rechts":…, "kippt":…}
    "notiz":       set(),
    "halte":       set(),
    "zusammen":    set(),          # [Baustein, …] - EIN Vorgang fürs Auge
    "gegenprobe":  set(),          # [Baustein, …] - und danach wieder weg
}
FARBEN = {"rot", "gelb", "blau", "gruen"}
# Was das Auge in diesem Teil NEU ansehen soll. Höchstens eines je Teil (§5.2).
HERVOR = {"zeile", "zielzeile", "kasten", "ring", "markiere", "gross",
          "buendel", "pfeile", "unterBeide", "unterLinks", "unterRechts",
          "hebeAuf", "ersetze", "neueZeile", "kreuz", "frage", "haken",
          "waage", "zusammen", "gegenprobe"}
# Bausteine, die eine Liste von Bausteinen tragen
BUENDEL = ("zusammen", "gegenprobe")
# Bausteine, die Zeilen auf die Tafel bringen
ZEILEN = {"zeile", "neueZeile", "zielzeile", "kasten"}


def norm(s):
    """Vergleichsform: ohne Leerzeichen, jeder Strich ist ein Minus."""
    return re.sub(r"\s+", "", str(s)).replace("-", "−").replace("–", "−")


# Felder, die KEIN sichtbarer Text sind, sondern Anweisung an den Setzer.
# „kippt": "rechts" stünde sonst als Wort in der Bildbeschreibung verlangt.
STUMM = {"farbe", "halte", "kippt"}


def _texte(baustein):
    """Alle Zeichenketten eines Bausteins, die im Bild zu sehen sind."""
    aus = []
    for k, v in baustein.items():
        if k in STUMM:
            continue
        if isinstance(v, str):
            aus.append(v)
        elif isinstance(v, list):
            for x in v:
                if isinstance(x, str):
                    aus.append(x)
                elif isinstance(x, dict):
                    aus += _texte(x)          # buendel-Eintrag, zusammen-Kind
        elif isinstance(v, dict):
            aus += _texte(v)                  # ersetze, waage, pfeile
    return [t for t in aus if str(t).strip()]


def pruefe_szene(h):
    """Befunde an der Szene. Leere Liste heißt: die Szene trägt.

    Die Prosa in `bild` ist die Vorlage - sie wurde Teil für Teil gegen den
    gesprochenen Satz gelesen. Die Szene ist die Übersetzung. Weicht sie ab,
    ist das ein Befund, kein Stilfrage.
    """
    b = []
    szene, skript, bild = h.get("szene") or {}, h["skript"], h["bild"]
    if sorted(szene) != sorted(skript):
        b.append(f"szene hat die Teile {sorted(szene)}, das Skript "
                 f"{sorted(skript)}")
        return b
    tafel = []            # Zeilentexte in der Reihenfolge ihres Auftretens

    def baustein(teil, wo, st, prosa, tief=0):
        """Prüft EINEN Baustein. Gibt zurück, ob er eine Hervorhebung ist."""
        if not isinstance(st, dict):
            b.append(f"{teil}[{wo}]: kein Baustein (Objekt erwartet)")
            return False
        leit = [k for k in st if k in BAUSTEINE]
        if len(leit) != 1:
            b.append(f"{teil}[{wo}]: genau EIN Leitfeld erwartet, "
                     f"gefunden {sorted(st)}")
            return False
        name = leit[0]
        fremd = set(st) - {name} - BAUSTEINE[name]
        if fremd:
            b.append(f"{teil}[{wo}] {name}: unbekanntes Feld {sorted(fremd)}")
        if "farbe" in st and st["farbe"] not in FARBEN:
            b.append("%s[%s] %s: Farbe „%s“ ist nicht erlaubt (%s)"
                     % (teil, wo, name, st["farbe"], sorted(FARBEN)))
        if name in BUENDEL:
            # Ein Bündel ist EIN Vorgang fürs Auge (§12.4). Es bündelt
            # Bausteine, nicht Bündel - sonst ließe sich „je Teil eine
            # Hervorhebung" durch Schachteln beliebig aushebeln.
            if tief:
                b.append(f"{teil}[{wo}] {name}: nicht in einem Bündel")
                return True
            if not isinstance(st[name], list) or len(st[name]) < 2:
                b.append(f"{teil}[{wo}] {name}: mindestens zwei Bausteine")
                return True
            for j, kind in enumerate(st[name]):
                baustein(teil, f"{wo}.{j}", kind, prosa, tief + 1)
            return True
        if name == "hebeAuf" and (not isinstance(st[name], list)
                                  or len(st[name]) != 2):
            b.append(f"{teil}[{wo}] hebeAuf: genau zwei Terme erwartet")
        if name == "ersetze" and not {"was", "durch"} <= set(st[name]):
            b.append(f"{teil}[{wo}] ersetze: braucht „was“ und „durch“")
        if name == "buendel":
            if not isinstance(st[name], list) or not st[name]:
                b.append(f"{teil}[{wo}] buendel: gefüllte Liste erwartet")
            else:
                for e in st[name]:
                    if not isinstance(e, dict) or "unter" not in e:
                        b.append(f"{teil}[{wo}] buendel: jeder Eintrag "
                                 f"braucht „unter“")
        if name == "pfeile" and not (isinstance(st[name], dict) and st[name]
                                     and set(st[name]) <= {"blass", "kraeftig"}):
            b.append(f"{teil}[{wo}] pfeile: „blass“ und/oder „kraeftig“")
        if name == "waage":
            kippt = (st[name] or {}).get("kippt")
            if kippt is not None and kippt not in ("links", "rechts", "keine"):
                b.append(f"{teil}[{wo}] waage: kippt ist links, rechts oder "
                         f"keine - nicht „{kippt}“")
        if name == "halte" and not (isinstance(st[name], (int, float))
                                    and st[name] >= 3):
            b.append(f"{teil}[{wo}] halte: mindestens 3 Sekunden (§5.3)")
        if name in ZEILEN:
            tafel.append(st[name])
        if name == "nurNoch" and not any(norm(st[name]) in norm(z)
                                         for z in tafel):
            b.append("%s[%s] nurNoch „%s“: diese Zeile steht gar nicht "
                     "auf der Tafel" % (teil, wo, st[name]))
        # Szene gegen Prosa: jeder sichtbare Text muss in der
        # gegengelesenen Bildbeschreibung dieses Teils vorkommen.
        for t in _texte(st):
            if norm(t) not in prosa:
                b.append("%s[%s] %s: „%s“ steht nicht in der "
                         "Bildbeschreibung von %s" % (teil, wo, name, t, teil))
        return name in HERVOR

    for teil in sorted(szene):
        liste = szene[teil]
        if not isinstance(liste, list) or not liste:
            b.append(f"{teil}: szene ist keine gefüllte Liste")
            continue
        prosa = norm(bild[teil]["sichtbar"] + " " + bild[teil]["hervorgehoben"])
        hervor = sum(baustein(teil, i, st, prosa) for i, st in enumerate(liste))
        if hervor > 1:
            b.append(f"{teil}: {hervor} Hervorhebungen - je Teil genau eine "
                     f"(§5.2). Gehören sie zu EINEM Vorgang, bündelt sie "
                     f"„zusammen“.")

    def enthaelt(liste, feld):
        for st in liste or []:
            if not isinstance(st, dict):
                continue
            if feld in st:
                return True
            for kind in BUENDEL:
                if isinstance(st.get(kind), list) and enthaelt(st[kind], feld):
                    return True
        return False

    if not enthaelt(szene.get("F"), "halte"):
        b.append("F: ohne halte - der Endzustand muss stehen bleiben (§5.3)")
    erst = (szene.get("A") or [{}])[0]
    if not ("zeile" in erst or ("zusammen" in erst and isinstance(
            erst["zusammen"], list) and erst["zusammen"]
            and "zeile" in erst["zusammen"][0])):
        b.append("A: fängt nicht mit einer zeile an - das Bild ist dort leer")
    return b


def schreibe(pfad, inhalt):
    os.makedirs(os.path.dirname(pfad), exist_ok=True)
    alt = open(pfad, encoding="utf-8").read() if os.path.exists(pfad) else None
    if alt == inhalt:
        return False
    open(pfad, "w", encoding="utf-8").write(inhalt)
    return True


def baue(h, mit_audio=True):
    k = h["kennung"]
    base = f"mh-{k}"
    teile = hilfe_sprechfassung(h)          # [(A, "drei x plus fünf …"), …]

    # 1. Sprechfassung
    narr = [{"id": t, "text": s} for t, s in teile]
    schreibe(os.path.join(NARR, f"{base}.json"),
             json.dumps(narr, ensure_ascii=False, indent=2) + "\n")

    # 2. Audio + gemessene Zeitmarken
    if mit_audio:
        subprocess.run(["node", "scripts/gen-audio.mjs", base], cwd=VIDEOS,
                       check=True, env={**os.environ, "SAY_RATE": SAY_RATE})

    # 3. Szene
    daten = {
        "kennung": k,
        "frage": h["frage"],
        "aufgabe": h["aufgabe"],
        "teile": [{"id": t, "text": h["skript"][t]["text"],
                   "szene": h["szene"][t]} for t in sorted(h["szene"])],
    }
    schreibe(os.path.join(ZIEL, f"{k}.json"),
             json.dumps(daten, ensure_ascii=False, indent=2) + "\n")
    return os.path.exists(os.path.join(NARR, f"{base}.timings.json"))


def daten_ts(kennungen):
    z = ["// ERZEUGT von mathe_mikrohilfen/narration_bauen.py - nicht von Hand",
         "// ändern. Sprechertext, Szene und Zeitmarken stehen in den Hilfen;",
         "// wer hier tippt, baut eine zweite Wahrheit.", ""]
    for k in kennungen:
        z.append(f"import {k} from './{k}.json';")
        z.append(f"import {k}Zeit from '../narration/mh-{k}.timings.json';")
    z += ["",
          "export type Baustein = Record<string, unknown>;",
          "export type Teil = { id: string; text: string; szene: Baustein[] };",
          "export type Hilfe = {",
          "  kennung: string;",
          "  frage: string;",
          "  aufgabe: string;",
          "  teile: Teil[];",
          "  zeiten: Record<string, number>;",
          "};", "",
          "export const MIKROHILFEN: Record<string, Hilfe> = {"]
    for k in kennungen:
        z.append(f"  {k}: {{ ...{k}, zeiten: {k}Zeit as Record<string, number> }},")
    z += ["};", ""]
    return "\n".join(z)


if __name__ == "__main__":
    args = sys.argv[1:]
    mit_audio = "--ohne-audio" not in args
    wahl = [a for a in args if not a.startswith("--")]

    hilfen = [json.load(open(p, encoding="utf-8"))
              for p in sorted(glob.glob(os.path.join(HERE, "hilfen", "*.json")))]
    hilfen = [h for h in hilfen if h.get("szene")
              and (not wahl or h["kennung"] in wahl)]
    if not hilfen:
        sys.exit("Keine Hilfe mit Feld \u201eszene\u201c gefunden.")

    fehler, fertig = 0, []
    for h in hilfen:
        b = pruefe_szene(h)
        for zeile in b:
            print(f"  BEFUND {h['kennung']}  {zeile}")
        if b:
            fehler += len(b)
            continue
        gemessen = baue(h, mit_audio)
        if gemessen:
            fertig.append(h["kennung"])
            print(f"✓ {h['kennung']}: Sprechfassung, Szene, Zeitmarken")
        else:
            print(f"! {h['kennung']}: keine Zeitmarken - nicht registriert "
                  f"(erst `npm run audio -- mh-{h['kennung']}`)")

    if fertig:
        # Registrierung immer über ALLE Hilfen, die fertige Daten haben -
        # sonst wirft ein Lauf mit einem Argument die anderen aus Root.tsx.
        alle = sorted({os.path.basename(p)[:-5]
                       for p in glob.glob(os.path.join(ZIEL, "*.json"))}
                      & {os.path.basename(p)[3:-13]
                         for p in glob.glob(os.path.join(NARR,
                                                         "mh-*.timings.json"))})
        if schreibe(os.path.join(ZIEL, "daten.ts"), daten_ts(alle)):
            print(f"✓ daten.ts: {len(alle)} Hilfe(n) registriert "
                  f"({', '.join(alle)})")
    if fehler:
        print(f"\n{fehler} Befund(e) - nichts gerendert.")
        sys.exit(1)
