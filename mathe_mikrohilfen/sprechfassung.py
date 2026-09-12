# -*- coding: utf-8 -*-
"""Macht aus dem geschriebenen Skript die SPRECHFASSUNG.

Im Skript steht „3x + 5 = 20“, weil das Kind es so auf dem Blatt sieht. Eine
Stimme darf das nicht buchstabieren - sie muss „drei x plus fünf gleich
zwanzig“ sagen. Genau diese sieben Wörter zählt der Prüfer auch; die
Sprechfassung ist also die Probe aufs Exempel für das Wortbudget.

    python3 sprechfassung.py            # alle Hilfen, Wortzahl gegengerechnet
    python3 sprechfassung.py gl02       # nur eine, mit Text

Wird auch von messen_dauer.py benutzt, das die ECHTE Sprechdauer misst,
statt sie mit 2,0 Wörtern je Sekunde zu schätzen.
"""
import json, os, re, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))

# Zahlwörter bis 100 - darüber hinaus kommt in diesen Aufgaben nichts vor,
# und eine unvollständige Tabelle, die still falsch spricht, wäre schlimmer
# als eine, die laut abbricht.
_EINER = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben",
          "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn",
          "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"]
_ZEHNER = {2: "zwanzig", 3: "dreißig", 4: "vierzig", 5: "fünfzig", 6: "sechzig",
           7: "siebzig", 8: "achtzig", 9: "neunzig"}


def zahlwort(n):
    n = int(n)
    if n < 20:
        return _EINER[n]
    if n <= 99:
        z, e = divmod(n, 10)
        if e == 0:
            return _ZEHNER[z]
        return ("ein" if e == 1 else _EINER[e]) + "und" + _ZEHNER[z]
    if n == 100:
        return "hundert"
    raise ValueError(f"Zahlwort für {n} fehlt - Tabelle erweitern, "
                     f"nicht raten lassen")


ZEICHEN = {"+": "plus", "−": "minus", "-": "minus", "=": "gleich",
           "·": "mal", "*": "mal", ":": "geteilt durch", "≠": "ist nicht"}


def sprich(text):
    """Geschriebenes Skript -> Sprechfassung."""
    aus = []
    for tok in text.split():
        # Satzzeichen am Ende festhalten und wieder anhängen
        schwanz = ""
        while tok and tok[-1] in ".,;:!?„“\"":
            # ein ALLEIN stehender Doppelpunkt ist das Rechenzeichen, kein Satzzeichen
            if tok == ":":
                break
            schwanz = tok[-1] + schwanz
            tok = tok[:-1]
        if not tok:
            aus.append(schwanz); continue
        if tok in ZEICHEN:
            aus.append(ZEICHEN[tok] + schwanz); continue
        # 3x -> drei x · 12y -> zwölf y
        m = re.fullmatch(r"(\d+)([a-zA-Z])", tok)
        if m:
            aus.append(f"{zahlwort(m.group(1))} {m.group(2)}{schwanz}"); continue
        # reine Zahl, auch mit Dezimalkomma
        if re.fullmatch(r"\d+", tok):
            aus.append(zahlwort(tok) + schwanz); continue
        m = re.fullmatch(r"(\d+),(\d+)", tok)
        if m:
            nach = " ".join(zahlwort(z) for z in m.group(2))
            aus.append(f"{zahlwort(m.group(1))} Komma {nach}{schwanz}"); continue
        # Vorzeichen direkt am Wort: −5, +5
        m = re.fullmatch(r"([+−-])(\d+)", tok)
        if m:
            aus.append(f"{ZEICHEN[m.group(1)]} {zahlwort(m.group(2))}{schwanz}"); continue
        m = re.fullmatch(r"([+−-])(\d+)([a-zA-Z])", tok)
        if m:
            aus.append(f"{ZEICHEN[m.group(1)]} {zahlwort(m.group(2))} "
                       f"{m.group(3)}{schwanz}"); continue
        aus.append(tok + schwanz)
    return " ".join(aus)


def hilfe_sprechfassung(h):
    """Die sechs Teile einer Hilfe als Sprechfassung, in Reihenfolge."""
    return [(t, sprich(h["skript"][t]["text"]))
            for t in "ABCDEF" if t in (h.get("skript") or {})]


if __name__ == "__main__":
    wahl = sys.argv[1:]
    fehler = 0
    for p in sorted(glob.glob(os.path.join(HERE, "hilfen", "*.json"))):
        h = json.load(open(p, encoding="utf-8"))
        if wahl and h["kennung"] not in wahl:
            continue
        teile = hilfe_sprechfassung(h)
        ges = sum(len(t.split()) for _, t in teile)
        soll = h["woerter_gesamt"]
        # Das Wortmodell des Pruefers zaehlt das Gleichheitszeichen als ZWEI
        # Woerter ("ist gleich"), gesprochen wird EINES ("gleich"). Das ist
        # Absicht und ein Sicherheitsabstand: Das Modell zaehlt lieber zu hoch
        # als zu niedrig. Es ist deshalb KEIN Fehler - frueher meldete dieses
        # Skript in 10 von 11 Hilfen rot, und ein Pruefer, der immer rot
        # meldet, wird nicht mehr gelesen.
        # Die Wahrheit ueber die Dauer steht ohnehin woanders: in den
        # gemessenen Zeitmarken des Audios (messen_dauer.py).
        marke = "" if ges == soll else f"   (Modell zaehlt {soll} — {soll-ges} mehr)"
        if ges > soll:
            marke = f"   ZU HOCH: gesprochen {ges}, Modell nur {soll}"
            fehler += 1
        print(f"{h['kennung']}  {ges:3} gesprochene Wörter{marke}")
        if wahl:
            for t, s in teile:
                print(f"    {t}  {s}")
    if fehler:
        print(f"\n{fehler} Hilfe(n) sprechen MEHR Wörter, als das Modell zählt — "
              f"dort ist der Sicherheitsabstand aufgebraucht.")
        sys.exit(1)
    print("\nAlle Hilfen sprechen höchstens so viele Wörter, wie das Modell "
          "zählt — der Sicherheitsabstand hält.")
