# -*- coding: utf-8 -*-
"""Prüfer der FELO-Mikrohilfen (PROFIL.md) — Mathematik 8, Gleichungen.

Hausregel dieses Projekts: Ein Prüfer, der schweigt, weil er nichts sieht, ist
schlimmer als keiner. Der Lauf beginnt deshalb IMMER mit einem Selbsttest —
zwei bekannt gute Hilfen (müssen ohne Befund durchgehen) und eine Reihe
absichtlich kaputter Proben (jede MUSS genau ihren Fehler auslösen), dazu
eigene Proben für die Nachrechnung von aufgaben.json. Fällt eine durch,
urteilt der Prüfer über nichts und endet mit Exitcode 2.

Dazu eine Prüfung gegen die eigene Blindheit: pruefe() zählt die ausgeführten
Prüfungen mit. Ein Prüfer, der ein fehlendes Feld still überspringt, meldet
„in Ordnung" und hat nichts angesehen — genau das ist in diesem Projekt
zweimal passiert. Der Selbsttest verlangt deshalb eine Mindestzahl.

Aufruf: python3 pruefe_mikrohilfe.py           → Selbsttest + alle Hilfen
        python3 pruefe_mikrohilfe.py gl02      → Selbsttest + nur diese
"""
import copy, json, os, re, sys
from fractions import Fraction

HERE = os.path.dirname(os.path.abspath(__file__))

# ── Die Zahlen des Profils (§2.2). Jede mit Begründung in PROFIL.md. ──────
TEMPO      = 2.0    # gesprochene Wörter je Sekunde (Fördertempo)
BUDGET     = 60     # 30 s × 2,0 — die 30-Sekunden-Regel in Wörtern
WARNUNG    = 55     # 55 Wörter + 3 s Standzeit = 30,5 s, schon über der Regel
SATZ_MAX   = 12     # 12 Wörter = 6 s = ein Fünftel der Hilfe in EINEM Satz
STANDZEIT  = 3.0    # Sekunden, die der Endzustand stehen bleibt (§5.3)
CLIP_MAX   = 30.0   # Sekunden gesamt
H1_MAX     = 12     # Hilfe 1 ist ein Denkanstoß, kein Satzgefüge
H3_MAX     = 30     # Hilfe 3 zeigt EINEN Schritt an einer anderen Aufgabe
VORW_MAX   = 14     # Vorwissen-Sätze: Maß des Förderprofils (8–14 Wörter)
FEHLER_MAX = 25     # faengt_fehler_auf ist eine Notiz, kein Absatz

# Mindestzahl ausgeführter Prüfungen — Schutz gegen den stillen Prüfer.
# GEMESSEN an den beiden Maßstab-Hilfen: gl02 = 330, gl08 = 322 Prüfungen.
# Die Zahl schwankt mit dem Inhalt (jede Mathe-Fundstelle, jeder Satz und
# jedes Falschergebnis zieht eigene Prüfungen nach sich), deshalb ist die
# Schwelle bewusst weich gesetzt: 30 je Teil + 40. Für sechs Teile sind das
# 220 von gemessenen 330 — eine Hilfe ohne Teil D (art „handgriff“) schlägt
# nicht fälschlich an, ein ausgefallener Prüfblock dagegen sofort.
def min_pruefungen(n_teile):
    return 30 * n_teile + 40

TEILE_ALLE = ["A", "B", "C", "D", "E", "F"]
ARTEN      = ("rechenschritt", "fehler", "handgriff")
TYPEN      = ("gleichung", "term")      # was der Prüfer nachrechnen KANN

RUECKNAHME = ("Jetzt bist du wieder dran.",
              "Jetzt probierst du es selbst.",
              "Jetzt machst du weiter.")

# Konkrete Verben (PROFIL §7). Ein Satz, der mit einem davon beginnt, ist ein
# Arbeitsschritt — und je Hilfe ist genau EINER erlaubt.
OPERATOREN = ("Rechne", "Suche", "Markiere", "Lege", "Zeichne", "Miss",
              "Schreibe", "Setze", "Zähle", "Teile", "Kreise", "Lies",
              "Trage", "Prüfe", "Ordne", "Vergleiche", "Klammere", "Kürze",
              "Nimm", "Schau", "Probiere", "Ergänze", "Streiche")

# ── Verbotene Wörter (§7.1). Die falsche Vorstellung ist das Ziel der Liste. ──
VERBOTEN = [
    (r"äquivalenzumformung", "Fachwort, das für den Schritt nichts leistet"),
    (r"umstell",            "„Term umstellen“ nährt das Hinüberschieben"),
    # Wortanfang, nicht Teilstring: das lose Muster schlug am 11.09.2026 auf
    # „Darüber erscheint eine Waage“ an (Bildbeschreibung gl10) und hätte auch
    # „worüber“ getroffen — ein Wort, das in PROFIL.md §5.4 selbst steht.
    # Fehlalarme sind gefährlich, weil die übliche Reaktion darauf ist, die
    # Regel aufzuweichen. „rüberbringen“, „hinüberschieben“, „kommt rüber“
    # und „drüber“ bleiben gefangen (siehe Proben im Selbsttest).
    (r"\b(?:rüber|hinüber|drüber)", "„rüberbringen“ — die Zahl wandert nicht"),
    (r"streich",            "nichts verschwindet; im Bild heißt es „rotes Kreuz“"),
    (r"wander",             "Bewegungsbild statt beidseitiger Rechnung"),
    (r"auf die andere seite", "Seitenwechsel ohne Rechnung"),
    (r"vorzeichenwechsel|vorzeichen wechsel", "Merkregel statt Herleitung"),
    (r"koeffizient|isolier|substitu|\bterm", "Fachwort, hier nicht gebraucht"),
    (r"klick",              "FELO-Hausregel"),
]
THEMA = r"so löst du|alles über|grundlagen|thema"   # nur in `frage` verboten

DEZIMALPUNKT = re.compile(r"\d\.\d{1,2}(?!\d)")
NEG      = re.compile(r"\bnicht\b|\bkein|\bnie\b|\bfalsch|\?", re.I)
BILDMARK = re.compile(r"rotes kreuz|fragezeichen|rot markiert", re.I)


# ── Wortzählung: gesprochene Wörter, nicht Tastatur-Tokens (§2.1) ────────
SYMBOL = {"+": 1, "-": 1, "−": 1, "–": 1, "·": 1, "*": 1, "×": 1,
          ":": 2, "/": 2, "=": 2, "²": 1, "³": 1, "√": 2, "%": 1,
          "<": 3, ">": 3}
_RAND = ".,;!?\"„“»«()…'"          # OHNE Doppelpunkt — der ist zweideutig
# „Buchstabe“ heißt hier: alphanumerisch, aber keine Ziffer. ²³ müssen
# ausdrücklich ausgeschlossen werden: Python zählt sie zu \w und NICHT zu \d,
# sonst verschluckt „a²“ das Quadrat und zählt als EIN Wort statt zwei
# (gemessen: „a² + b² = c²“ ergab 6 statt 9).
_BUCH = r"[^\W\d_²³]"
_TEIL = re.compile(rf"\d+(?:,\d+)?|{_BUCH}+|[+\-−–·*×:/=²³√%<>]")

def woerter(text):
    """Zahl der gesprochenen Wörter. „3x + 5 = 20“ sind SIEBEN, nicht fünf.

    Der Doppelpunkt ist zweideutig: „Wir prüfen:“ spricht man nicht,
    „15 : 3“ heißt „geteilt durch“ (zwei Wörter). Verbindliche Regel der
    Reihe: Division wird MIT Leerzeichen geschrieben (`15 : 3`); nur ein
    allein stehender Doppelpunkt gilt als Rechenzeichen.
    """
    if not text:
        return 0
    # Bindestrich im Wort wird nicht gesprochen: „Minus-Zeichen“ = ein Wort
    text = re.sub(rf"(?<={_BUCH})[-−–](?={_BUCH})", "", text)
    n = 0
    for tok in text.split():
        if tok in (":", "/"):                 # allein stehend = Rechenzeichen
            n += SYMBOL[tok]
            continue
        # Ein ANGEHÄNGTER Doppelpunkt ist Satzzeichen und wird nicht gesprochen
        # („Wir prüfen:“, „Schritt 2:“). Division steht nach der Schreibregel
        # IMMER mit Leerzeichen und ist oben schon abgeholt. Die frühere
        # Bedingung `if re.search(_BUCH, tok)` strippte nur bei Tokens MIT
        # Buchstaben — „Schritt 2:“ und „Teile durch 3: 15 : 3 = 5.“ zählten
        # dadurch je zwei Wörter zu viel (letzteres 12 statt der in PROFIL
        # §2.1 ausgerechneten 10).
        t = tok.rstrip(":")
        t = t.strip(_RAND)
        if not t:
            continue
        for m in _TEIL.finditer(t):
            s = m.group()
            if re.fullmatch(r"\d+,\d+", s):    n += 3     # „zwei Komma fünf“
            elif s.isdigit():                  n += 1     # dt. Zahlwort = 1 Wort
            elif re.fullmatch(rf"{_BUCH}+", s): n += 1
            else:                              n += SYMBOL.get(s, 1)
    return n


# Der Wortzähler ist die tragende Zahl des ganzen Standards — er bekommt
# seinen eigenen Selbsttest. Die Sollwerte sind von Hand ausgesprochen und
# gezählt. Zwei Zeilen hier sind echte gefundene Fehler (Doppelpunkt als
# Rechenzeichen, ²): ohne diese Tafel wären sie wieder hereingekommen.
ZAEHLER_PROBEN = [
    ("Du hast jetzt 3x + 5 = 20.", 10),   # drei x plus fünf ist gleich zwanzig
    ("Wir wollen die +5 wegbekommen.", 6),
    ("Rechne auf beiden Seiten −5.", 6),
    ("Minus 5 hebt die plus 5 auf.", 7),
    ("Jetzt muss dort 3x = 15 stehen.", 9),
    ("Jetzt bist du wieder dran.", 5),
    ("Wir prüfen: Sind 3x + 2 zusammen 5x?", 10),
    ("Nur 3x hat ein x.", 6),
    ("x = 5", 4),                          # x ist gleich fünf
    ("Der Wert ist 2,5 Meter.", 7),        # zwei Komma fünf
    ("a² + b² = c²", 9),                   # a Quadrat plus b Quadrat ist gleich c Quadrat
    ("15 : 3 = 5", 7),                     # fünfzehn geteilt durch drei ist gleich fünf
    ("Teile 15 : 3 und du bekommst 5.", 9),
    # Gegenrichtung zum allein stehenden Doppelpunkt: der ANGEHÄNGTE nach einer
    # ZIFFER. Beides sind echte gefundene Fehler (11.09.2026) — die alte
    # Fassung sprach den Doppelpunkt nur bei Tokens mit Buchstaben nicht mit
    # und zählte hier je zwei Wörter zu viel. Die erste Zeile ist der in
    # PROFIL §2.1 selbst ausgerechnete Satz: dort stehen 10, gemessen 12.
    ("Teile durch 3: 15 : 3 = 5.", 10),
    ("Schritt 2: Rechne minus 5.", 5),
    ("Das sind 2 · 4 Kästchen.", 6),
    ("√9 = 3", 6),                         # Wurzel aus neun ist gleich drei
    ("Minus-Zeichen beachten.", 2),
    ("", 0),
]

def selbsttest_zaehler():
    f = []
    for text, soll in ZAEHLER_PROBEN:
        ist = woerter(text)
        if ist != soll:
            f.append(f"Wortzähler: „{text}“ ergibt {ist}, von Hand gezählt {soll}")
    # Gegenprobe: die Tafel muss einen falschen Sollwert auch merken
    if woerter("Jetzt bist du wieder dran.") == 4:
        f.append("Wortzähler-Gegenprobe: 5 Wörter wurden als 4 akzeptiert")
    return f


def saetze(text):
    return [s.strip() for s in re.findall(r"[^.!?]+[.!?]*", text or "") if s.strip()]


# ── Mathematik im Text finden ────────────────────────────────────────────
_ATOM = r"(?:\d+(?:,\d+)?\s*[a-zA-Z]?|[a-zA-Z])"
_OPZ  = r"\s*[+\-−–·*×:/=]\s*"
MATHE = re.compile(rf"(?<!\w)(?:[+\-−–]\s*)?{_ATOM}(?:{_OPZ}(?:[+\-−–]\s*)?{_ATOM})*(?!\w)")

def norm(s):
    s = (s or "").replace("−", "-").replace("–", "-").replace("·", "*").replace("×", "*")
    return re.sub(r"\s+", "", s).lower()

def rohmathe(text):
    """Alle Mathe-Fundstellen — Grundlage der Bild-Gleichheitsprüfung (§5.1)."""
    return [m.group() for m in MATHE.finditer(text or "")]

def _ist_term(s):
    r = re.sub(r"^\s*[+\-−–]\s*", "", s)          # führendes Vorzeichen weg
    return bool(re.search(r"[+\-−–·*×:/=]", r) or re.search(r"[a-zA-Z]", r))

def terme(text):
    """Fundstellen, die einen ZUSTAND behaupten (Operator oder Variable drin).
    „−5“ ist keiner: das ist eine Rechenanweisung, kein Zustand."""
    return [m for m in rohmathe(text) if _ist_term(m)]

def zahlen(text):
    return re.findall(r"\d+", text or "")


# ── Linearer Ausdruck: (a, b) für a·var + b ──────────────────────────────
def _lin(seite, var, gegeben=None):
    """`gegeben` ist die Brücke zum Einsetzverfahren (seit 11.09.2026).

    Der Startzustand von a10 ist „x + y = 10“ — die Zeile, die WIRKLICH auf
    dem Blatt steht, mit ZWEI Buchstaben. Ohne ein Feld für die schon bekannte
    Zahl brach `_lin` hier mit „unbekannter Buchstabe x“ ab und riss den
    ganzen Lauf mit (Exitcode 2). Die Ausweichlösung wäre gewesen, den
    Startzustand als „4 + y = 10“ zu hinterlegen — dann wäre das Einsetzen
    schon passiert, bevor die Hilfe anfängt, und der EINE Arbeitsschritt von
    gl11 hätte keinen Ort. Ein gegebener Buchstabe rechnet wie seine Zahl.
    """
    s = norm(seite)
    if not s:
        raise ValueError("leere Seite")
    teile, akt = [], ""
    for i, c in enumerate(s):
        if c in "+-" and i > 0 and s[i-1] not in "*(":
            teile.append(akt); akt = c
        else:
            akt += c
    teile.append(akt)
    a = Fraction(0); b = Fraction(0)
    for t in teile:
        if not t:
            raise ValueError("leerer Summand")
        vz = Fraction(-1) if t[0] == "-" else Fraction(1)
        t = t.lstrip("+-")
        # Der Doppelpunkt gehört dazu: „x = 15 : 3“ ist der Zustand, in dem das
        # Blatt nach dem Teilen steht, und die EINZIGE Kontrollzeile, die eine
        # Teil-Hilfe (gl04) schreiben kann, ohne die Lösung auszusprechen
        # (§4). Ohne Division im Nachrechner war dieser Schritt als
        # Grundwahrheit nicht darstellbar — `_lin` brach mit „unlesbarer
        # Summand“ ab und riss den ganzen Lauf mit (Exitcode 2).
        if not re.fullmatch(r"(?:\d+(?:,\d+)?|[a-zäöüß]|[*:/])+", t):
            raise ValueError(f"unlesbarer Summand „{t}“")
        zahl = Fraction(1); k = 0; teilen = False
        for m in re.finditer(r"\d+(?:,\d+)?|[a-zäöüß]|[*:/]", t):
            g = m.group()
            if g == "*":
                continue
            if g in (":", "/"):
                teilen = True
                continue
            if re.fullmatch(r"\d+(?:,\d+)?", g):
                z = Fraction(g.replace(",", "."))
                if teilen:
                    if z == 0:
                        raise ValueError("Division durch null")
                    zahl /= z
                else:
                    zahl *= z
            elif g == var.lower():
                if teilen:
                    raise ValueError("Division durch die Variable — nicht linear")
                k += 1
            elif gegeben and g in gegeben:
                z = Fraction(str(gegeben[g]).replace(",", "."))
                if teilen:
                    if z == 0:
                        raise ValueError("Division durch null")
                    zahl /= z
                else:
                    zahl *= z
            else:
                raise ValueError(f"unbekannter Buchstabe „{g}“")
            teilen = False
        if k == 0:   b += vz * zahl
        elif k == 1: a += vz * zahl
        else:        raise ValueError("nicht linear")
    return a, b

def loesung_von(gleichung, var, gegeben=None):
    if gleichung.count("=") != 1:
        raise ValueError("genau ein Gleichheitszeichen erwartet")
    li, re_ = gleichung.split("=")
    al, bl = _lin(li, var, gegeben); ar, br = _lin(re_, var, gegeben)
    if al == ar:
        raise ValueError("keine eindeutige Lösung")
    return (br - bl) / (al - ar)

def wert_von(ausdruck, var, x, gegeben=None):
    a, b = _lin(ausdruck, var, gegeben)
    return a * Fraction(x) + b


# ── Grundwahrheit: aufgaben.json selbst nachrechnen (§6.1) ───────────────
def pruefe_aufgaben(daten):
    f = []
    blaetter = daten.get("blaetter", {})
    gesehen, plaetze = set(), set()
    for a in daten.get("aufgaben", []):
        k = a.get("kennung", "?")
        for feld in ("kennung", "blatt", "nummer", "aufgabe", "typ",
                     "variable", "schritte", "loesung"):
            if feld not in a:
                f.append(f"{k}: Feld {feld} fehlt")
        if "falsch" not in a:
            f.append(f"{k}: Feld falsch fehlt (leere Liste ist erlaubt, Weglassen nicht)")
        if not re.fullmatch(r"a\d\d", k):
            f.append(f"{k}: Kennung muss a + zwei Ziffern sein")
        if k in gesehen:
            f.append(f"{k}: Kennung doppelt")
        gesehen.add(k)
        if a.get("blatt") not in blaetter:
            f.append(f"{k}: Blatt „{a.get('blatt')}“ steht nicht in blaetter")
        platz = (a.get("blatt"), str(a.get("nummer")))
        if platz in plaetze:
            f.append(f"{k}: Platz {platz[0]} Nr. {platz[1]} ist doppelt belegt")
        plaetze.add(platz)

        typ, var = a.get("typ"), a.get("variable", "x")
        schritte = a.get("schritte") or []
        if typ not in TYPEN:
            f.append(f"{k}: typ „{typ}“ wird nicht nachgerechnet — für diesen Typ "
                     f"ist keine Prüfregel geschrieben [OFFEN für Abdullah]")
            continue
        if not schritte:
            f.append(f"{k}: schritte ist leer"); continue
        if not re.fullmatch(r"[a-zA-Z]", str(var)):
            f.append(f"{k}: variable „{var}“ ist kein einzelner Buchstabe"); continue

        # `gegeben` wird nachgeprüft, nicht geglaubt — es geht in JEDE
        # Nachrechnung dieser Aufgabe ein. Ein Tippfehler darin würde die
        # ganze Grundwahrheit verschieben, ohne dass irgendwo etwas rot wird.
        gegeben = a.get("gegeben")
        if gegeben is not None:
            if not isinstance(gegeben, dict) or not gegeben:
                f.append(f"{k}: gegeben muss ein gefülltes Wörterbuch "
                         f"Buchstabe → Zahl sein"); continue
            schlecht = False
            for b_, w_ in gegeben.items():
                if not re.fullmatch(r"[a-zA-Z]", str(b_)):
                    f.append(f"{k}: gegeben „{b_}“ ist kein einzelner Buchstabe")
                    schlecht = True
                elif str(b_).lower() == str(var).lower():
                    f.append(f"{k}: gegeben nennt die Variable „{b_}“ selbst — "
                             f"dann wäre nichts mehr zu berechnen")
                    schlecht = True
                if not re.fullmatch(r"[+\-−–]?\d+(?:,\d+)?", str(w_)):
                    f.append(f"{k}: gegeben {b_} = „{w_}“ ist keine Zahl")
                    schlecht = True
            if schlecht:
                continue
            gegeben = {str(b_).lower(): w_ for b_, w_ in gegeben.items()}

        try:
            if typ == "gleichung":
                loes = [loesung_von(s, var, gegeben) for s in schritte]
                if len(set(loes)) != 1:
                    f.append(f"{k}: schritte haben verschiedene Lösungen "
                             f"{[str(x) for x in loes]} — eine Umformung ist falsch")
                if not re.fullmatch(rf"{var}\s*=\s*[+\-−–]?\d+", schritte[-1].strip()):
                    f.append(f"{k}: letzter Schritt „{schritte[-1]}“ hat nicht die Form "
                             f"{var} = Zahl")
                if norm(a.get("loesung")) != norm(schritte[-1]):
                    f.append(f"{k}: loesung „{a.get('loesung')}“ ist nicht der letzte Schritt")
                for w in a.get("falsch", []):
                    if "=" not in w:
                        f.append(f"{k}: falsch-Eintrag „{w}“ ist keine Gleichung")
                    elif loesung_von(w, var, gegeben) == loes[0]:
                        f.append(f"{k}: falsch-Eintrag „{w}“ ist nicht falsch — "
                                 f"gleiche Lösung wie die Aufgabe")
            else:                                    # term
                for x in (2, 3):
                    werte = [wert_von(s, var, x, gegeben) for s in schritte]
                    if len(set(werte)) != 1:
                        f.append(f"{k}: schritte sind bei {var} = {x} nicht gleichwertig "
                                 f"{[str(w) for w in werte]}")
                if norm(a.get("loesung")) != norm(schritte[-1]):
                    f.append(f"{k}: loesung „{a.get('loesung')}“ ist nicht der letzte Schritt")
                for w in a.get("falsch", []):
                    if "=" in w:
                        f.append(f"{k}: falsch-Eintrag „{w}“ darf keine Gleichung sein")
                    elif all(wert_von(w, var, x, gegeben)
                             == wert_von(schritte[-1], var, x, gegeben)
                             for x in (2, 3)):
                        f.append(f"{k}: falsch-Eintrag „{w}“ ist nicht falsch — "
                                 f"gleicher Wert wie „{schritte[-1]}“")
        except ValueError as e:
            f.append(f"{k}: nicht nachrechenbar ({e})")
    return f


def aufgaben_index(daten):
    return {a["kennung"]: a for a in daten.get("aufgaben", []) if "kennung" in a}


# ── Prüfung einer Hilfe ──────────────────────────────────────────────────
class Lauf:
    """Sammelt Befunde UND zählt die ausgeführten Prüfungen mit."""
    def __init__(self):
        self.befunde, self.n = [], 0
    def ok(self, bedingung, meldung):
        self.n += 1
        if not bedingung:
            self.befunde.append(meldung)
        return bool(bedingung)


FELDER = ("kennung", "frage", "art", "aufgabe", "vorwissen", "hilfe1", "skript",
          "woerter_gesamt", "sekunden_sprache", "sekunden_gesamt", "bild",
          "hilfe3", "faengt_fehler_auf")


def pruefe(h, index):
    p = Lauf()
    for feld in FELDER:
        p.ok(feld in h and h[feld] not in (None, "", [], {}),
             f"Feld {feld} fehlt oder ist leer")

    art = h.get("art")
    p.ok(art in ARTEN, f"art muss eines von {ARTEN} sein, nicht „{art}“")
    teile = [t for t in TEILE_ALLE if not (t == "D" and art == "handgriff")]

    # ── Aufgabenbindung ──────────────────────────────────────────────
    aufg = index.get(h.get("aufgabe"))
    p.ok(aufg is not None,
         f"Aufgabenkennung „{h.get('aufgabe')}“ steht nicht in aufgaben.json")
    schritte = [norm(s) for s in (aufg or {}).get("schritte", [])]
    falsch   = [norm(s) for s in (aufg or {}).get("falsch", [])]
    a_zahlen = set()
    for s in (aufg or {}).get("schritte", []) + (aufg or {}).get("falsch", []):
        a_zahlen |= set(zahlen(s))
    loes = norm((aufg or {}).get("loesung"))

    def teil_von(n, liste):
        """Teilterm-Zulassung — aber NUR für Teilterme (§6.2).

        „3x“ darf man nennen, ohne die ganze Zeile aufzusagen; es steht als
        Zeichenkette in „3x + 5 = 20“. Eine ganze GLEICHUNG ist dagegen eine
        Behauptung über den Zustand des Blattes und muss exakt stimmen:
        „x = 12“ steht ebenfalls als Zeichenkette in „4x = 12“, sagt aber
        etwas völlig anderes — und Falsches. Gefunden mit einer Kaputt-Probe
        an gl05/gl06: „Dann steht dort x = 12.“ (Aufgabe a23, Lösung x = 3)
        und „schreibt x + 2 = 22“ liefen beide still durch. Ein Prüfer, der
        schweigt, ist schlimmer als keiner.
        """
        if "=" in n:
            return False
        return any(n in s for s in liste)

    def bekannt(t):
        """Für beschreibende Felder: exakter Schritt, Teil eines Schritts
        oder gelistetes Falschergebnis."""
        n = norm(t)
        return n in schritte or n in falsch or teil_von(n, schritte)

    def pruefe_falsch(text, wo, marker=NEG):
        """Ein Falschergebnis darf nur markiert dastehen (§6.2, §5.4)."""
        for satz in saetze(text):
            for t in terme(satz):
                if norm(t) in falsch:
                    p.ok(bool(marker.search(satz)),
                         f"{wo}: „{t}“ ist ein Falschergebnis und steht ohne "
                         f"Verneinung bzw. Markierung: „{satz}“")

    # ── Frage des Schülers (§7.2) ────────────────────────────────────
    frage = h.get("frage", "")
    p.ok(frage.rstrip().endswith("?"), "frage muss eine Frage sein (endet mit ?)")
    p.ok(woerter(frage) <= SATZ_MAX,
         f"frage hat {woerter(frage)} Wörter (höchstens {SATZ_MAX})")
    p.ok(not re.search(THEMA, frage, re.I),
         f"frage benennt ein Thema statt einen Schritt: „{frage}“")
    pruefe_falsch(frage, "frage")

    # ── Vorwissen ────────────────────────────────────────────────────
    vw = h.get("vorwissen") or []
    p.ok(2 <= len(vw) <= 4, f"Vorwissen: {len(vw)} Sätze (erlaubt 2–4)")
    for s in vw:
        p.ok(woerter(s) <= VORW_MAX,
             f"Vorwissen-Satz zu lang ({woerter(s)} Wörter): „{s[:44]}…“")
        p.ok(s.rstrip().endswith("."), f"Vorwissen-Satz ohne Punkt: „{s[:44]}…“")

    # ── Hilfe 1 (§4) ─────────────────────────────────────────────────
    h1 = h.get("hilfe1", "")
    p.ok(h1.rstrip().endswith("?"), "Hilfe 1 muss eine Frage sein (endet mit ?)")
    p.ok(len(saetze(h1)) == 1, f"Hilfe 1 muss EIN Satz sein ({len(saetze(h1))} gefunden)")
    p.ok(woerter(h1) <= H1_MAX,
         f"Hilfe 1 hat {woerter(h1)} Wörter (höchstens {H1_MAX})")
    for s in schritte[1:]:
        p.ok(s not in norm(h1),
             f"Hilfe 1 nennt einen späteren Zustand der Aufgabe („{s}“) — "
             f"Hilfe 1 gibt KEINE Lösung")
    if schritte:
        for t in terme(h1):
            p.ok(norm(t) in schritte[0] or norm(t) in falsch,
                 f"Hilfe 1 nennt „{t}“ — steht nicht im Startzustand der Aufgabe")
    pruefe_falsch(h1, "Hilfe 1")

    # ── Skript: die sechs Teile ──────────────────────────────────────
    sk = h.get("skript") or {}
    for t in teile:
        if not p.ok(t in sk and isinstance(sk[t], dict),
                    f"Teil {t} fehlt" + (" — bei art „%s“ ist das Warum PFLICHT" % art
                                         if t == "D" else "")):
            continue
        p.ok(bool(sk[t].get("text")), f"Teil {t}: text ist leer")
        gez = woerter(sk[t].get("text", ""))
        p.ok(sk[t].get("woerter") == gez,
             f"Teil {t}: woerter {sk[t].get('woerter')} eingetragen, "
             f"nachgerechnet {gez}")
    if art == "handgriff":
        p.ok("D" not in sk, "art „handgriff“: Teil D entfällt (§3.1)")

    txt = {t: sk.get(t, {}).get("text", "") for t in teile}
    ganz = " ".join(txt.values())

    ges = sum(woerter(v) for v in txt.values())
    p.ok(ges <= BUDGET,
         f"Wortbudget: {ges} gesprochene Wörter (Obergrenze {BUDGET} = 30 s × {TEMPO})")
    p.ok(h.get("woerter_gesamt") == ges,
         f"woerter_gesamt {h.get('woerter_gesamt')} eingetragen, nachgerechnet {ges}")
    p.ok(abs((h.get("sekunden_sprache") or 0) - ges / TEMPO) < 0.06,
         f"sekunden_sprache muss {ges / TEMPO:.1f} sein")
    p.ok(abs((h.get("sekunden_gesamt") or 0) - (ges / TEMPO + STANDZEIT)) < 0.06,
         f"sekunden_gesamt muss {ges / TEMPO + STANDZEIT:.1f} sein "
         f"(Sprache + {STANDZEIT:.0f} s Standzeit)")
    p.ok((h.get("sekunden_gesamt") or 0) <= CLIP_MAX,
         f"Clip länger als {CLIP_MAX:.0f} s — Hilfe teilen, Regel nicht aufweichen")

    for t, s in txt.items():
        for satz in saetze(s):
            p.ok(woerter(satz) <= SATZ_MAX,
                 f"Teil {t}: Satz zu lang ({woerter(satz)} Wörter): „{satz}“")

    p.ok(ganz.count("?") <= 1,
         f"{ganz.count('?')} Fragezeichen im Skript — mehr als eine Frage heißt: "
         f"Hilfe teilen (Geodreieck-Erfahrung)")
    imp = [(t, satz) for t, s in txt.items() for satz in saetze(s)
           if satz.split()[0].rstrip(",:.") in OPERATOREN]
    p.ok(len(imp) == 1,
         f"{len(imp)} Imperativsätze — genau EIN Arbeitsschritt je Hilfe: "
         f"{[s for _, s in imp]}")
    # ... und er gehört in Teil C (§2.2/§3): C ist die HANDLUNG. Bis zum
    # 11.09.2026 zählte der Prüfer die Befehle nur. Wer den Befehl nach B schob
    # und C zum Aussagesatz machte, fuhr grün durch — die Hilfe begründete dann,
    # was der Schüler schon getan hatte, und die feste Reihenfolge A B C D E F
    # war nur noch Papier. Gemessen an gl11 (Befehl in B): 0 Befunde.
    p.ok(all(t == "C" for t, _ in imp),
         f"Der EINE Arbeitsschritt steht in Teil {sorted({t for t, _ in imp})}, "
         f"nicht in Teil C — C ist die HANDLUNG (§2.2/§3)")

    # ── Teil A: Startzustand · Teil E: Kontrolle ─────────────────────
    # Ein blanker BUCHSTABE der Aufgabe ist KEINE Zustandsbehauptung: „nicht
    # das x“ sagt, was nicht markiert sein darf, „für x steht die 4“ zeigt auf
    # einen Buchstaben. Ohne diese Ausnahme schlug der Prüfer bei „Jetzt ist
    # nur die −9 markiert, nicht das x.“ falsch an (gemessen an gl01) und
    # zwang die Kontrollzeile, den Gegenfall zu verschweigen.
    #
    # Sie galt zuerst nur für Teil E und nur für die gesuchte Variable. Beides
    # war zu eng, gefunden 11.09.2026 beim Bau von gl11: Teil A sagt dort „Für
    # x steht die 4.“ — und x ist bei a10 gar nicht die gesuchte Variable
    # (die ist y), sondern der schon bekannte Buchstabe aus `gegeben`. Teil A
    # beschreibt den Zustand des Blattes genauso wie Teil E; was für den einen
    # gilt, gilt für den anderen. Ein Buchstabe, der NICHT zur Aufgabe gehört,
    # bleibt ein Befund — sonst wäre die Ausnahme ein Loch (Proben in beide
    # Richtungen im Selbsttest).
    buchstaben = {norm((aufg or {}).get("variable", ""))}
    buchstaben |= {norm(b) for b in ((aufg or {}).get("gegeben") or {})}
    buchstaben.discard("")

    def blanker_buchstabe(t):
        return norm(t) in buchstaben

    if schritte:
        p.ok(schritte[0] in norm(txt.get("A", "")),
             f"Teil A nennt nicht den Startzustand der Aufgabe "
             f"(„{(aufg or {}).get('schritte', [''])[0]}“)")
        for t in terme(txt.get("A", "")):
            if blanker_buchstabe(t):
                continue
            p.ok(norm(t) in schritte or norm(t) in falsch,
                 f"Teil A: „{t}“ ist kein Schritt der Aufgabe {h.get('aufgabe')}")
        e_terme = [t for t in terme(txt.get("E", "")) if not blanker_buchstabe(t)]
        p.ok(bool(rohmathe(txt.get("E", ""))),
             "Teil E nennt keine Zahl — „richtig gemacht“ ist keine Kontrolle")
        for t in e_terme:
            n = norm(t)
            if n in schritte:
                if len(schritte) > 1:
                    p.ok(schritte.index(n) >= 1,
                         f"Teil E nennt den Startzustand „{t}“ — der Schritt hat "
                         f"nichts bewegt")
            else:
                p.ok(n in falsch,
                     f"Teil E: „{t}“ ist kein Schritt der Aufgabe "
                     f"{h.get('aufgabe')} und steht nicht in falsch")
        # ── Der spätere Zustand — und warum er NICHT immer gefordert wird
        # (§3.2, entschieden 11.09.2026). Die alte Fassung verlangte ihn bei
        # JEDER Aufgabe mit mehr als einem Schritt. Bei einer Aufgabe mit
        # genau ZWEI Schritten ist der spätere Zustand aber die Lösung — und
        # die darf nach §4 in keinem Text stehen. Die Regel widersprach sich
        # selbst; betroffen sind gl01/a06, gl03/a02 und gl10/a20.
        #
        # Durchgesetzt wurde sie ohnehin nie: Sie hing an der Schleife
        # darüber und sprach nur an, wenn E zufällig einen ganzen Schritt
        # nennt. Eine Kontrollzeile aus nackten Zahlen („Links steht dann 15.
        # Rechts steht auch 15.“) lief an ihr vorbei — gemessen an gl02: 0
        # Befunde, obwohl a03 drei Schritte hat. Ein Prüfer, der schweigt,
        # ist schlimmer als keiner.
        #
        # Jetzt gilt sie nach der LÄNGE der Aufgabe, und zwar positiv:
        #   ≥ 3 Schritte → E MUSS einen Zwischenzustand nennen (es gibt einen,
        #                  der nicht die Lösung ist).
        #   = 2 Schritte → E nennt einen Markierschritt oder Teilzustand. Ein
        #                  ganzer Schritt ist dort in beide Richtungen schon
        #                  verboten: schritte[0] von der Schleife oben
        #                  („der Schritt hat nichts bewegt“), schritte[1] =
        #                  die Lösung von der Prüfung unten (§4).
        #   = 1 Schritt  → nichts zu fordern (Term, der schon fertig ist).
        zwischen = [s for s in schritte[1:] if s != loes]
        if len(schritte) >= 3:
            p.ok(any(s in norm(txt.get("E", "")) for s in zwischen),
                 f"Teil E nennt keinen Zwischenzustand der Aufgabe "
                 f"{h.get('aufgabe')} — bei drei und mehr Schritten ist er die "
                 f"Kontrolle und muss wörtlich dastehen (erwartet einer von "
                 f"{[s for s in (aufg or {}).get('schritte', [])[1:-1]]}, §3.2)")
        # Zahlenebene. A und E stehen hier MIT B/C/D, obwohl sie oben schon auf
        # Termebene geprüft sind — das war eine Lücke, gefunden 11.09.2026 an
        # gl10: `terme()` lässt eine nackte Zahl absichtlich fallen („−5“ ist
        # eine Rechenanweisung, kein Zustand). Eine Kontrollzeile wie „Links
        # steht dann 19. Rechts steht auch 19.“ nennt deshalb GAR keinen Term,
        # die Schleife darüber lief leer, und die Zeile war an keine Aufgabe
        # gebunden: 19 durch 18 ersetzt → 0 Befunde. Genau der Fall, den der
        # Auftraggeber ausdrücklich abgefangen haben wollte. Die alte
        # Kaputt-Probe traf ihn nicht, weil sie mit „3x = 16“ einen TERM
        # einsetzte und nur den Termpfad prüfte.
        for teil in ("A", "B", "C", "D", "E"):
            for z in zahlen(txt.get(teil, "")):
                p.ok(z in a_zahlen,
                     f"Teil {teil}: die Zahl {z} kommt in der Aufgabe "
                     f"{h.get('aufgabe')} nicht vor")
        if len(schritte) > 1 and loes:
            for name, s in list(txt.items()) + [("frage", frage), ("hilfe1", h1)] \
                          + [(f"vorwissen[{i}]", v) for i, v in enumerate(vw)]:
                p.ok(loes not in norm(s),
                     f"{name} spricht die Lösung „{(aufg or {}).get('loesung')}“ aus — "
                     f"die eigene Aufgabe wird NICHT fertig gelöst")
            # Das BILD zählt mit (gefunden 11.09.2026 beim Gegenlesen von gl04).
            # Der Sprecher sagte „Rechts steht jetzt die 5.“ und blieb damit im
            # Buchstaben der Regel — aber bild.E und bild.F zeigten „x = 5“, den
            # Endzustand drei Sekunden lang groß. Der Schüler schreibt ab, was er
            # SIEHT; die Prüfung sah nur, was gesprochen wird. Verglichen wird auf
            # Fundstellen, nicht auf Zeichenketten: die Zahl 5 im Bild ist etwas
            # anderes als die Zeile „x = 5“ (Gegenprobe im Selbsttest).
            bild_h = h.get("bild") or {}
            for t in teile:
                b0 = bild_h.get(t) or {}
                b0_terme = {norm(x) for x in
                            terme(str(b0.get("sichtbar", "")) + " " +
                                  str(b0.get("hervorgehoben", "")))}
                p.ok(loes not in b0_terme,
                     f"bild.{t} zeigt die Lösung „{(aufg or {}).get('loesung')}“ — "
                     f"der Schüler schreibt ab, was er sieht (§4)")
    for t in teile:
        pruefe_falsch(txt.get(t, ""), f"Teil {t}")
    if art == "fehler":
        p.ok(bool(NEG.search(txt.get("E", ""))),
             "art „fehler“: Teil E muss die Verneinung enthalten — sonst bleibt "
             "die Fehlvorstellung unwidersprochen stehen")

    # ── Teil F: Rücknahme (§3.3) ─────────────────────────────────────
    p.ok(txt.get("F", "").strip().endswith(RUECKNAHME),
         f"Teil F endet nicht mit der Rücknahme an den Schüler {RUECKNAHME}")

    # ── Bild (§5) ────────────────────────────────────────────────────
    bild = h.get("bild") or {}
    p.ok(set(bild) == set(teile),
         f"bild hat die Teile {sorted(bild)}, das Skript {teile}")
    for t in teile:
        b = bild.get(t)
        if not p.ok(isinstance(b, dict), f"bild.{t} fehlt"):
            continue
        p.ok(bool(b.get("sichtbar")), f"bild.{t}: sichtbar ist leer")
        p.ok(bool(b.get("hervorgehoben")), f"bild.{t}: hervorgehoben ist leer")
        bn = norm(b.get("sichtbar", "") + " " + b.get("hervorgehoben", ""))
        for m in rohmathe(txt.get(t, "")):
            p.ok(norm(m) in bn,
                 f"bild.{t}: „{m}“ wird gesprochen, kommt im Bild nicht vor — "
                 f"Sprechertext und Bild müssen EXAKT zusammenpassen")
        # Falschergebnis im Bild: auf Fundstellen vergleichen, NICHT auf
        # Zeichenketten. „x + 2 = 22“ (Falschergebnis von a07) steckt als
        # Zeichenkette in der richtig gezeichneten Zeile „5x + 2 = 22“ — der
        # Zeichenkettenvergleich verlangte deshalb in bild.A, B und C von gl06
        # ein rotes Kreuz über der richtigen Aufgabe. Drei Fehlalarme aus drei
        # Bildern; eine Positivliste ist selbst eine Fehlerquelle.
        b_terme = {norm(x) for x in terme(str(b.get("sichtbar", "")) + " " +
                                          str(b.get("hervorgehoben", "")))}
        for w in falsch:
            if w in b_terme:
                p.ok(bool(BILDMARK.search(b.get("sichtbar", ""))),
                     f"bild.{t}: Falschergebnis „{w}“ steht unmarkiert — "
                     f"„rotes Kreuz“ oder „Fragezeichen“ fehlt")
    p.ok("sekunden" in norm(bild.get("F", {}).get("sichtbar", "")),
         f"bild.F weist keine Standzeit aus (mindestens {STANDZEIT:.0f} Sekunden, §5.3)")

    # ── Hilfe 3 (§4) ─────────────────────────────────────────────────
    h3 = h.get("hilfe3") or {}
    p.ok(bool(h3.get("text")) and bool(h3.get("kontrolle")),
         "Hilfe 3 braucht text und kontrolle")
    a3 = index.get(h3.get("aufgabe"))
    p.ok(a3 is not None,
         f"Hilfe 3: Aufgabe „{h3.get('aufgabe')}“ steht nicht in aufgaben.json")
    p.ok(h3.get("aufgabe") != h.get("aufgabe"),
         "Hilfe 3 muss eine ANDERE Aufgabe zeigen als die Hilfe selbst")
    p.ok(woerter(h3.get("text", "")) + woerter(h3.get("kontrolle", "")) <= H3_MAX,
         f"Hilfe 3 hat {woerter(h3.get('text',''))+woerter(h3.get('kontrolle',''))} "
         f"Wörter (höchstens {H3_MAX})")
    if a3:
        s3 = [norm(s) for s in a3.get("schritte", [])]
        f3 = [norm(s) for s in a3.get("falsch", [])]
        z3 = set()
        for s in a3.get("schritte", []) + a3.get("falsch", []):
            z3 |= set(zahlen(s))
        for feld in ("text", "kontrolle"):
            for t in terme(h3.get(feld, "")):
                n = norm(t)
                p.ok(n in s3 or n in f3 or teil_von(n, s3),
                     f"Hilfe 3 ({feld}): „{t}“ gehört nicht zur Aufgabe "
                     f"{h3.get('aufgabe')}")
            for z in zahlen(h3.get(feld, "")):
                p.ok(z in z3,
                     f"Hilfe 3 ({feld}): Zahl {z} kommt in Aufgabe "
                     f"{h3.get('aufgabe')} nicht vor")
            for satz in saetze(h3.get(feld, "")):
                for t in terme(satz):
                    if norm(t) in f3:
                        p.ok(bool(NEG.search(satz)),
                             f"Hilfe 3 ({feld}): Falschergebnis „{t}“ ohne "
                             f"Verneinung: „{satz}“")
        p.ok(bool(terme(h3.get("kontrolle", ""))),
             "Hilfe 3: kontrolle nennt kein Zwischenergebnis")
        if len(s3) > 1:
            p.ok(norm(a3.get("loesung")) not in norm(h3.get("text", "") + " " +
                                                     h3.get("kontrolle", "")),
                 f"Hilfe 3 löst die Aufgabe {h3.get('aufgabe')} fertig "
                 f"(„{a3.get('loesung')}“) — sie zeigt nur den einen Schritt")

    # ── Typischer Fehler ─────────────────────────────────────────────
    ff = h.get("faengt_fehler_auf", "")
    p.ok(woerter(ff) <= FEHLER_MAX,
         f"faengt_fehler_auf hat {woerter(ff)} Wörter (höchstens {FEHLER_MAX})")
    p.ok(bool(rohmathe(ff)),
         "faengt_fehler_auf nennt keine Zahl und keinen Term — zu unkonkret")
    if aufg:
        for t in terme(ff):
            p.ok(bekannt(t),
                 f"faengt_fehler_auf nennt „{t}“ — weder Schritt noch in falsch "
                 f"der Aufgabe {h.get('aufgabe')} gelistet")

    # ── Sprache: Verbote und Dezimalkomma ────────────────────────────
    schueler = [("frage", frage), ("hilfe1", h1),
                ("hilfe3.text", h3.get("text", "")),
                ("hilfe3.kontrolle", h3.get("kontrolle", ""))]
    schueler += [(f"Teil {t}", txt.get(t, "")) for t in teile]
    schueler += [(f"vorwissen[{i}]", v) for i, v in enumerate(vw)]
    for t in teile:
        b = bild.get(t) or {}
        schueler.append((f"bild.{t}", str(b.get("sichtbar", "")) + " " +
                                      str(b.get("hervorgehoben", ""))))
    for wo, s in schueler:
        for muster, grund in VERBOTEN:
            p.ok(not re.search(muster, s, re.I),
                 f"{wo}: verbotenes Muster „{muster}“ — {grund}: „{s[:56]}…“")
    for wo, s in schueler + [("faengt_fehler_auf", ff)]:
        m = DEZIMALPUNKT.search(s)
        p.ok(m is None,
             f"{wo}: Dezimalpunkt statt Komma („{m.group() if m else ''}“)")

    # ── Kennung ──────────────────────────────────────────────────────
    p.ok(bool(re.fullmatch(r"gl\d\d", h.get("kennung", ""))),
         f"Kennung „{h.get('kennung')}“ muss gl + zwei Ziffern sein")
    return p.befunde, p.n


# ── Selbsttest ───────────────────────────────────────────────────────────
def _neu_rechnen(h):
    ges = 0
    for d in h["skript"].values():
        d["woerter"] = woerter(d["text"]); ges += d["woerter"]
    h["woerter_gesamt"] = ges
    h["sekunden_sprache"] = round(ges / TEMPO, 2)
    h["sekunden_gesamt"] = round(ges / TEMPO + STANDZEIT, 2)


def selbsttest(gute, daten):
    fehler, n_proben = [], 0
    index = aufgaben_index(daten)

    # 0a) Der Wortzähler trägt das ganze Budget — er kommt zuerst dran
    fehler += selbsttest_zaehler()

    # 0b) Grundwahrheit muss sauber sein, sonst ist alles andere sinnlos
    bef = pruefe_aufgaben(daten)
    if bef:
        fehler.append(f"aufgaben.json fiel durch: {bef}")

    for name, g in gute.items():
        b, n = pruefe(g, index)
        if b:
            fehler.append(f"GUTE Hilfe {name} fiel durch: {b}")
        grenze = min_pruefungen(len(g.get("skript") or {}))
        if n < grenze:
            fehler.append(f"GUTE Hilfe {name}: nur {n} Prüfungen ausgeführt "
                          f"(mindestens {grenze}) — ein Prüfblock ist still "
                          f"ausgefallen")

    def kaputt(basis, pfad, wert, muss, rechnen=False):
        nonlocal n_proben
        n_proben += 1
        k = copy.deepcopy(gute[basis])
        ziel = k
        for s in pfad[:-1]:
            ziel = ziel[s]
        if wert is None:
            ziel.pop(pfad[-1], None)
        else:
            ziel[pfad[-1]] = wert
        if rechnen:
            _neu_rechnen(k)
        b, _ = pruefe(k, index)
        if not any(muss in x for x in b):
            fehler.append(f"Kaputt-Probe {basis}{list(pfad)} → erwartete Meldung "
                          f"„{muss}“ kam nicht. Befunde: {b}")

    def heil(basis, pfad, wert, darf_nicht, rechnen=False):
        """Gegenprobe zu einer Kaputt-Probe: eine ÄNDERUNG, die erlaubt ist,
        darf die Meldung NICHT auslösen. Ohne diese Richtung wäre eine zu
        scharfe Prüfung nicht von einer richtigen zu unterscheiden."""
        nonlocal n_proben
        n_proben += 1
        k = copy.deepcopy(gute[basis])
        ziel = k
        for s in pfad[:-1]:
            ziel = ziel[s]
        ziel[pfad[-1]] = wert
        if rechnen:
            _neu_rechnen(k)
        b, _ = pruefe(k, index)
        if any(darf_nicht in x for x in b):
            fehler.append(f"Gegenprobe {basis}{list(pfad)} → Fehlalarm "
                          f"„{darf_nicht}“ bei erlaubtem Inhalt. Befunde: {b}")

    def kaputt_a(pfad, wert, muss):
        nonlocal n_proben
        n_proben += 1
        d = copy.deepcopy(daten)
        ziel = d
        for s in pfad[:-1]:
            ziel = ziel[s]
        if wert is None:
            ziel.pop(pfad[-1], None)
        else:
            ziel[pfad[-1]] = wert
        b = pruefe_aufgaben(d)
        if not any(muss in x for x in b):
            fehler.append(f"Kaputt-Probe aufgaben{list(pfad)} → erwartete Meldung "
                          f"„{muss}“ kam nicht. Befunde: {b}")

    def heil_a(pfad, wert, darf_nicht, basis="gl02"):
        """Gegenprobe auf der Grundwahrheit: eine erlaubte Ergänzung von
        aufgaben.json darf an einer unveränderten guten Hilfe keinen
        Fehlalarm auslösen."""
        nonlocal n_proben
        n_proben += 1
        d = copy.deepcopy(daten)
        ziel = d
        for s in pfad[:-1]:
            ziel = ziel[s]
        ziel[pfad[-1]] = wert
        b_a = pruefe_aufgaben(d)
        if b_a:
            fehler.append(f"Gegenprobe aufgaben{list(pfad)}: die PROBE selbst ist "
                          f"kaputt, nicht der Prüfer. {b_a}")
        b, _ = pruefe(gute[basis], aufgaben_index(d))
        if any(darf_nicht in x for x in b):
            fehler.append(f"Gegenprobe aufgaben{list(pfad)} → Fehlalarm "
                          f"„{darf_nicht}“ bei erlaubtem Inhalt. Befunde: {b}")

    # ── die vier vom Auftraggeber ausdrücklich verlangten Proben ─────
    kaputt("gl02", ("skript", "D", "text"),
           "Minus 5 hebt die plus 5 auf. Das ist wichtig. Das merkst du dir gut. "
           "Wir machen das immer so. Auf beiden Seiten gleich. Das ist die Regel hier.",
           "Wortbudget", rechnen=True)                        # zu lang
    kaputt("gl02", ("skript", "E"), None, "Teil E fehlt")     # ohne Kontrolle
    kaputt("gl02", ("aufgabe",), "a99", "steht nicht in aufgaben.json")
    kaputt("gl02", ("skript", "E", "text"), "Jetzt muss dort 3x = 16 stehen.",
           "ist kein Schritt der Aufgabe", rechnen=True)       # Kontrollzahl falsch
    # Dieselbe Forderung, aber OHNE Term — die Lücke von gl10 (11.09.2026).
    # Die Probe darüber prüfte nur den Termpfad; eine Kontrollzeile aus nackten
    # Zahlen lief an jeder Aufgabenbindung vorbei.
    kaputt("gl02", ("skript", "E", "text"), "Links steht dann 16. Rechts auch 16.",
           "die Zahl 16 kommt in der Aufgabe", rechnen=True)
    # Diese Gegenprobe zielt NUR auf die Zahlenbindung. Derselbe Satz löst seit
    # 11.09.2026 zu Recht den Zwischenzustand-Befund aus (a03 hat drei
    # Schritte) — `heil` prüft eine benannte Meldung, nicht Befundfreiheit.
    heil("gl02", ("skript", "E", "text"), "Links steht dann 15. Rechts auch 15.",
         "kommt in der Aufgabe", rechnen=True)

    # ── Teil E und die Länge der Aufgabe (§3.2, entschieden 11.09.2026) ──
    # Kaputt: drei Schritte, aber die Kontrollzeile nennt nur nackte Zahlen.
    # Genau dieser Satz lief vorher mit NULL Befunden durch.
    kaputt("gl02", ("skript", "E", "text"), "Links steht dann 15. Rechts steht auch 15.",
           "nennt keinen Zwischenzustand", rechnen=True)
    # Gegenprobe 1: derselbe Bau, aber der Zwischenzustand steht da.
    heil("gl02", ("skript", "E", "text"), "Dort steht jetzt 3x = 15.",
         "nennt keinen Zwischenzustand", rechnen=True)
    # Gegenprobe 2 — die eigentliche Entscheidung: schrumpft a03 auf ZWEI
    # Schritte, darf die Forderung NICHT mehr gelten. Ohne diese Richtung wäre
    # die Regel nur wieder der alte Selbstwiderspruch, diesmal durchgesetzt:
    # gl01, gl03 und gl10 müssten dann ihre Lösung aussprechen (§4).
    heil_a(("aufgaben", 2, "schritte"), ["3x + 5 = 20", "x = 5"],
           "nennt keinen Zwischenzustand")
    # Die blanke Variable in Teil E (Ausnahme oben, gefunden 11.09.2026 an gl01).
    # Beide Richtungen: „nicht das x“ darf NICHT anschlagen — ein anderer
    # Buchstabe muss es weiter. Ohne die Gegenprobe wäre die Ausnahme ein
    # Loch, ohne die Kaputt-Probe eine Behauptung.
    heil("gl02", ("skript", "E", "text"), "Dort steht 3x = 15, nicht das x allein.",
         "ist kein Schritt der Aufgabe", rechnen=True)
    kaputt("gl02", ("skript", "E", "text"), "Jetzt muss dort 3x = 15 stehen, nicht y.",
           "ist kein Schritt der Aufgabe", rechnen=True)
    # Dieselbe Ausnahme in Teil A (erweitert 11.09.2026 für gl11). Ein
    # Buchstabe der Aufgabe darf blank dastehen, ein fremder nicht.
    heil("gl02", ("skript", "A", "text"), "Du hast jetzt 3x + 5 = 20. Gemeint ist das x.",
         "ist kein Schritt der Aufgabe", rechnen=True)
    kaputt("gl02", ("skript", "A", "text"), "Du hast jetzt 3x + 5 = 20. Gemeint ist das z.",
           "ist kein Schritt der Aufgabe", rechnen=True)

    # ── Aufbau ──────────────────────────────────────────────────────
    kaputt("gl02", ("skript", "D"), None, "PFLICHT")
    kaputt("gl02", ("art",), "video", "art muss")
    kaputt("gl02", ("skript", "F", "text"), "Jetzt machst du bitte weiter.",
           "Rücknahme", rechnen=True)
    kaputt("gl02", ("skript", "A", "woerter"), 8, "eingetragen")
    kaputt("gl02", ("skript", "A", "text"),
           "Du hast hier in dieser Aufgabe jetzt ganz genau die Gleichung "
           "3x + 5 = 20 dastehen.", "Satz zu lang", rechnen=True)
    kaputt("gl02", ("skript", "B", "text"), "Wir wollen die +5 weg? Oder nicht?",
           "Fragezeichen im Skript", rechnen=True)
    kaputt("gl02", ("skript", "D", "text"), "Rechne genau. Schreibe es auf.",
           "Imperativsätze", rechnen=True)

    # ── Sprache ─────────────────────────────────────────────────────
    kaputt("gl02", ("skript", "C", "text"), "Rechne eine Äquivalenzumformung.",
           "äquivalenzumformung", rechnen=True)
    kaputt("gl02", ("skript", "C", "text"), "Rechne die 5 auf die andere Seite.",
           "auf die andere seite", rechnen=True)
    kaputt("gl02", ("bild", "C", "sichtbar"),
           "Die 5 wandert nach rechts und wird minus.", "wander")
    kaputt("gl02", ("skript", "C", "text"), "Rechne die 5 rüber.",
           "rüber", rechnen=True)
    heil("gl02", ("bild", "C", "sichtbar"),
         "Unter der linken Seite erscheint −5. Darüber bleibt 3x + 5 = 20 stehen. "
         "Unter der rechten Seite erscheint −5.", "rüber")
    kaputt("gl02", ("vorwissen",),
           ["Er kann im Kopf 20.5 rechnen.", "Er weiß, was x ist."], "Dezimalpunkt")
    kaputt("gl02", ("frage",), "So löst du Gleichungen?", "Thema statt einen Schritt")

    # ── Hilfestufen ─────────────────────────────────────────────────
    kaputt("gl02", ("hilfe1",), "Steht dort nicht schon 3x = 15?",
           "späteren Zustand")
    kaputt("gl02", ("hilfe1",), "Neben dem 3x steht eine 5.", "muss eine Frage sein")
    kaputt("gl02", ("hilfe3", "aufgabe"), "a03", "ANDERE Aufgabe")
    kaputt("gl02", ("skript", "E", "text"), "Jetzt muss dort x = 5 stehen.",
           "spricht die Lösung", rechnen=True)
    # Dieselbe Forderung fürs BILD (die Lücke von gl04, 11.09.2026): gesprochen
    # wurde eine nackte Zahl, gezeigt der Endzustand. Beide Richtungen — eine
    # blanke 5 im Bild ist NICHT die Lösung „x = 5“, sonst wäre die Prüfung
    # eine neue Fehlalarm-Quelle.
    kaputt("gl02", ("bild", "E"),
           {"sichtbar": "Die alte Zeile wird blass. Darunter steht groß x = 5.",
            "hervorgehoben": "die neue Zeile x = 5"}, "zeigt die Lösung")
    heil("gl02", ("bild", "E"),
         {"sichtbar": "Die alte Zeile wird blass. Darunter steht groß 3x = 15. "
                      "Die 5 ist noch nicht ausgerechnet.",
          "hervorgehoben": "die neue Zeile 3x = 15"}, "zeigt die Lösung")
    # Die Teilstring-Lücke (gefunden 11.09.2026 beim Gegenlesen von gl05/gl06).
    # Eine ganze Gleichung lief durch, wenn sie zufällig in einem echten
    # Schritt steckt: „x = 24“ in „4x = 24“, „x = 15“ in „3x = 15“. Beide
    # Fassungen meldete der Prüfer STILL — und eine Kontrollzeile „x = 24“
    # wäre als fertiges Video schlicht falsch (a11 hat die Lösung x = 6).
    kaputt("gl02", ("hilfe3", "kontrolle"), "Dann steht dort x = 24.",
           "gehört nicht zur Aufgabe")
    kaputt("gl02", ("faengt_fehler_auf",), "Der Schüler schreibt x = 15 hin.",
           "weder Schritt noch in falsch")
    # Gegenprobe: ein echter TEILterm ohne Gleichheitszeichen bleibt erlaubt,
    # sonst wäre die Schärfung nur eine neue Fehlalarm-Quelle.
    heil("gl02", ("faengt_fehler_auf",), "Der Schüler rechnet die 5 nur beim 3x weg.",
         "weder Schritt noch in falsch")

    # ── Bild ────────────────────────────────────────────────────────
    # Achtung: hier muss der GANZE Teil ersetzt werden. Die erste Fassung dieser
    # Probe tauschte nur `sichtbar` — in `hervorgehoben` stand die −5 weiter, und
    # die Probe fiel zu Recht NICHT durch. Der Selbsttest hat seine eigene Probe
    # entlarvt, nicht den Prüfer. Geprüft wird sichtbar UND hervorgehoben, denn
    # was hervorgehoben ist, ist im Bild zu sehen.
    kaputt("gl02", ("bild", "C"),
           {"sichtbar": "Unter beiden Seiten passiert etwas.",
            "hervorgehoben": "die beiden Seiten"}, "kommt im Bild nicht vor")
    kaputt("gl02", ("bild", "F", "sichtbar"), "3x = 15 steht allein im Bild.",
           "Standzeit")
    kaputt("gl02", ("bild", "D"), None, "bild.D fehlt")
    kaputt("gl02", ("bild", "C", "hervorgehoben"), "", "hervorgehoben ist leer")

    # ── der schweigende Prüfer: fehlende und leere Felder ───────────
    kaputt("gl02", ("faengt_fehler_auf",), None, "Feld faengt_fehler_auf fehlt")
    kaputt("gl02", ("hilfe1",), "", "Feld hilfe1 fehlt oder ist leer")

    # ── Fehlerhilfe (gl08) ──────────────────────────────────────────
    kaputt("gl08", ("skript", "E", "text"), "Also bleibt 3x + 2 stehen.",
           "muss die Verneinung enthalten", rechnen=True)
    kaputt("gl08", ("skript", "B", "text"), "Wir prüfen: 3x + 2 sind zusammen 5x.",
           "ohne Verneinung", rechnen=True)
    kaputt("gl08", ("bild", "E", "sichtbar"),
           "3x + 2 steht groß mit grünem Haken. Das 5x steht darunter.",
           "unmarkiert")
    # Gegenprobe zur Bildmarkierung (gefunden 11.09.2026 an gl06): Der
    # Vergleich lief über Zeichenketten. „x = 15“ als Falschergebnis von a03
    # steckt in der RICHTIG gezeichneten Zeile „3x = 15“ — der Prüfer verlangte
    # dann ein rotes Kreuz über der richtigen Rechnung. Bei gl06 waren es drei
    # Fehlalarme aus drei Bildern (a07 mit „x + 2 = 22“ gegen „5x + 2 = 22“).
    heil_a(("aufgaben", 2, "falsch"), ["3x = 20", "x = 15"], "unmarkiert")

    # ── Grundwahrheit aufgaben.json ─────────────────────────────────
    kaputt_a(("aufgaben", 2, "schritte"), ["3x + 5 = 20", "3x = 16", "x = 5"],
             "verschiedene Lösungen")
    kaputt_a(("aufgaben", 2, "loesung"), "x = 6", "ist nicht der letzte Schritt")
    kaputt_a(("aufgaben", 7, "falsch"), ["3x + 2"], "ist nicht falsch")
    kaputt_a(("aufgaben", 2, "typ"), "handgriff", "wird nicht nachgerechnet")
    kaputt_a(("aufgaben", 2, "kennung"), "a01", "Kennung doppelt")
    kaputt_a(("aufgaben", 2, "blatt"), "GL-9", "steht nicht in blaetter")
    kaputt_a(("aufgaben", 2, "schritte"), ["3x + 5 = 20", "3x = 15"],
             "nicht die Form")
    # Division als Zwischenzustand (a05/a22, gebraucht von gl04). Beide
    # Richtungen, und die Aufgabe wird über die Kennung gesucht statt über
    # ihren Platz in der Liste — die Nummern verschieben sich, sobald jemand
    # eine Aufgabe einfügt, und eine Probe am falschen Eintrag prüft nichts.
    i_div = next((i for i, a in enumerate(daten["aufgaben"])
                  if a.get("kennung") == "a05"), None)
    if i_div is None:
        fehler.append("Probe zur Division: Aufgabe a05 steht nicht in aufgaben.json")
    else:
        heil_a(("aufgaben", i_div, "schritte"),
               ["3x = 15", "x = 15 : 3", "x = 5"], "unlesbarer Summand")
        kaputt_a(("aufgaben", i_div, "schritte"),
                 ["3x = 15", "x = 15 : 4", "x = 5"], "verschiedene Lösungen")
        kaputt_a(("aufgaben", i_div, "schritte"),
                 ["3x = 15", "x = 15 : 0", "x = 5"], "Division durch null")

    # Die Brücke zum Einsetzverfahren (a10, gebraucht von gl11). `gegeben`
    # geht in JEDE Nachrechnung dieser Aufgabe ein — ein Tippfehler darin
    # verschöbe die ganze Grundwahrheit lautlos. Vier Richtungen.
    i_ein = next((i for i, a in enumerate(daten["aufgaben"])
                  if a.get("kennung") == "a10"), None)
    if i_ein is None:
        fehler.append("Probe zum Einsetzen: Aufgabe a10 steht nicht in aufgaben.json")
    else:
        # heil: der Startzustand DARF zwei Buchstaben tragen, wenn gegeben da ist
        heil_a(("aufgaben", i_ein, "schritte"),
               ["x + y = 10", "4 + y = 10", "y = 6"], "unbekannter Buchstabe")
        # kaputt: ohne gegeben ist dieselbe Zeile nicht nachrechenbar
        kaputt_a(("aufgaben", i_ein, "gegeben"), None, "unbekannter Buchstabe")
        # kaputt: eine falsche bekannte Zahl verschiebt die Lösung — genau der
        # stille Fehler, gegen den das Feld nachgerechnet wird
        kaputt_a(("aufgaben", i_ein, "gegeben"), {"x": 5}, "verschiedene Lösungen")
        # kaputt: gegeben darf nicht die gesuchte Variable nennen
        kaputt_a(("aufgaben", i_ein, "gegeben"), {"y": 6}, "nennt die Variable")
        # kaputt: gegeben muss eine ZAHL tragen, keinen weiteren Buchstaben
        kaputt_a(("aufgaben", i_ein, "gegeben"), {"x": "z"}, "ist keine Zahl")

    # ── Die Tafel in PROFIL §9 (Spalte „fängt allein auf“, 11.09.2026) ──
    # Die Tafel liest sonst von der Platte; für die Proben wird sie als Text
    # gestellt, damit beide Richtungen an EINEM bekannten Fall hängen.
    tafel_hilfen = {"gl02": (gute["gl02"], "gl02-plus-weg.json"),
                    "gl08": (gute["gl08"], "gl08-nicht-5x.json")}

    def _tafel(m2, m8):
        return (f"| gl02 | {gute['gl02']['frage']} | {gute['gl02']['art']} | "
                f"{gute['gl02']['aufgabe']} | {m2} |\n"
                f"| gl08 | {gute['gl08']['frage']} | {gute['gl08']['art']} | "
                f"{gute['gl08']['aufgabe']} | {m8} |\n")

    # ── Der EINE Arbeitsschritt gehört in Teil C (§2.2/§3, 11.09.2026) ──
    # Kaputt: Befehl nach B geschoben, C zum Aussagesatz gemacht. Genau das
    # lief vorher mit NULL Befunden durch.
    n_proben += 1
    k_imp = copy.deepcopy(gute["gl02"])
    k_imp["skript"]["B"]["text"] = "Rechne auf beiden Seiten −5."
    k_imp["skript"]["C"]["text"] = "Wir wollen die +5 wegbekommen."
    k_imp["bild"]["B"], k_imp["bild"]["C"] = k_imp["bild"]["C"], k_imp["bild"]["B"]
    _neu_rechnen(k_imp)
    b_imp, _ = pruefe(k_imp, index)
    if not any("nicht in Teil C" in x for x in b_imp):
        fehler.append(f"Kaputt-Probe: der Arbeitsschritt stand in Teil B und wurde "
                      f"NICHT gemeldet. Befunde: {b_imp}")
    # Gegenprobe: ein gewöhnlicher Aussagesatz in Teil B, der ein Operatorwort
    # enthält, ist KEIN Befehl. Ohne diese Richtung wäre ein zu grober Sucher
    # („Operator irgendwo im Satz“) von einem richtigen nicht zu unterscheiden.
    heil("gl02", ("skript", "B", "text"), "Wir rechnen die +5 weg.",
         "nicht in Teil C", rechnen=True)

    # ── Der Fehler zwischen den Dateien: `faengt_fehler_auf` (§9.1) ──
    # Die Tafelspalte allein reicht nicht — sie ist Dokumentation. Beide
    # Richtungen an dem Fall, der 11.09.2026 wirklich vorlag.
    def _paar(t2, t8):
        a = copy.deepcopy(gute["gl02"]); a["faengt_fehler_auf"] = t2
        c = copy.deepcopy(gute["gl08"]); c["faengt_fehler_auf"] = t8
        return {"gl02": (a, "gl02-plus-weg.json"), "gl08": (c, "gl08-nicht-5x.json")}

    MELD_F = "beanspruchen beide denselben Fehler"
    n_proben += 1
    b = fehler_vergleich(_paar("Der Schüler rechnet die −5 nur links und schreibt 3x = 20.",
                               "Der Schüler rechnet die −6 nur links und schreibt x = 14."))
    if not any(MELD_F in x for x in b):
        fehler.append(f"Kaputt-Probe faengt_fehler_auf: derselbe Satz mit anderen "
                      f"Zahlen wurde NICHT als derselbe Fehler erkannt. Befunde: {b}")
    n_proben += 1
    b = fehler_vergleich(_paar(gute["gl02"]["faengt_fehler_auf"],
                               gute["gl08"]["faengt_fehler_auf"]))
    if any(MELD_F in x for x in b):
        fehler.append(f"Gegenprobe faengt_fehler_auf: Fehlalarm bei zwei "
                      f"VERSCHIEDENEN Fehlern. Befunde: {b}")

    MELDUNG = "beanspruchen"
    n_proben += 1
    b = tafel_vergleich(tafel_zeilen(_tafel("rechnet nur links", "rechnet nur links")),
                        tafel_hilfen)
    if not any(MELDUNG in x for x in b):
        fehler.append(f"Kaputt-Probe Tafel: zwei Hilfen mit demselben Fehler "
                      f"wurden NICHT gemeldet. Befunde: {b}")
    n_proben += 1
    b = tafel_vergleich(tafel_zeilen(_tafel("Zahl weg ohne Gegenzahl",
                                            "Ungleiches zusammengefasst")),
                        tafel_hilfen)
    if any(MELDUNG in x for x in b):
        fehler.append(f"Gegenprobe Tafel: Fehlalarm bei zwei VERSCHIEDENEN "
                      f"Fehlern. Befunde: {b}")
    n_proben += 1
    b = tafel_vergleich(tafel_zeilen(_tafel("", "Ungleiches zusammengefasst")),
                        tafel_hilfen)
    if not any("ist leer" in x for x in b):
        fehler.append(f"Kaputt-Probe Tafel: die leere Spalte „fängt allein auf“ "
                      f"wurde NICHT gemeldet. Befunde: {b}")
    return fehler, n_proben


# ── Hauptlauf ────────────────────────────────────────────────────────────
def lade_hilfen():
    """Liest alle Hilfen und meldet, was ein Wörterbuch still verschluckt hätte:
    doppelte Kennungen, Dateinamen, die nicht zur Kennung passen, und zwei
    Hilfen auf derselben Aufgabe."""
    ordner = os.path.join(HERE, "hilfen")
    hilfen, befunde, gesehen, belegt = {}, [], {}, {}
    for fn in sorted(os.listdir(ordner)):
        if not fn.endswith(".json"):
            continue
        h = json.load(open(os.path.join(ordner, fn), encoding="utf-8"))
        k = h.get("kennung", "")
        if k in gesehen:
            befunde.append(f"Kennung {k} steht in {gesehen[k]} UND in {fn} — "
                           f"eine der beiden Hilfen wäre unbemerkt verschwunden")
        gesehen[k] = fn
        if not fn.startswith(k + "-"):
            befunde.append(f"{fn}: Dateiname beginnt nicht mit der Kennung „{k}“")
        a = h.get("aufgabe")
        if a in belegt:
            befunde.append(f"Aufgabe {a} wird von {belegt[a]} UND von {k} benutzt — "
                           f"jede Hilfe zeigt auf genau EINE eigene Aufgabe")
        belegt[a] = k + " (haupt)"
        # Auch Hilfe 3 braucht eine eigene Aufgabe. Ohne diese Pruefung lagen
        # gl02 und gl03 beide mit ihrer Hilfe 3 auf a11 - und der Pruefer
        # meldete gruen, weil er nur die Haupt-Bindung ansah. Wer beide Hilfen
        # bekommt, sieht zweimal dasselbe Beispiel.
        h3 = (h.get("hilfe3") or {}).get("aufgabe")
        if h3:
            if h3 in belegt:
                befunde.append(f"Aufgabe {h3} wird von {belegt[h3]} UND von "
                               f"{k} (hilfe3) benutzt — auch Hilfe 3 braucht "
                               f"eine Aufgabe, die sonst niemand benutzt")
            belegt[h3] = k + " (hilfe3)"
        hilfen[k or fn] = (h, fn)
    return hilfen, befunde


def tafel_zeilen(text):
    """Die Zeilen der Tafel aus PROFIL.md §9 lesen: (kennung, frage, art,
    aufgabe, faengt_allein_auf). Die letzte Spalte darf fehlen (dann "")."""
    zeilen = []
    for z in text.splitlines():
        m = re.match(r"\s*\|\s*\**\s*(gl\d\d)\s*\**\s*\|(.*)\|\s*$", z)
        if m:
            teile = [t.strip().strip("*").strip() for t in m.group(2).split("|")]
            if len(teile) >= 3:
                zeilen.append((m.group(1), teile[0], teile[1], teile[2],
                               teile[3] if len(teile) >= 4 else ""))
    return zeilen


def tafel_vergleich(zeilen, hilfen):
    """Tafel gegen die gebauten Dateien halten.

    Sie war beim ersten Durchgang in SECHS von zehn Zeilen falsch: Die Reihe
    wurde umgeplant, die Tabelle blieb der alte Plan. Wer als naechster eine
    Hilfe schreibt, liest dort ein Soll, das nicht gilt. Eine handgepflegte
    Tabelle driftet - deshalb bewacht sie der Pruefer.

    Die vierte Spalte „faengt allein auf" ist am 11.09.2026 dazugekommen. Sie
    loest einen Befund, den KEIN Pruefer bisher sehen konnte: gl02 und gl03
    beanspruchten beide den Fehler „rechnet nur links" (gl09 ebenso). Wer nach
    der Hilfe fuer diesen Fehler suchte, bekam zwei Antworten. Der Fehler
    steckt nicht in einer einzelnen Datei, sondern ZWISCHEN den Dateien - eine
    Planungsfrage, die sich nur an der ganzen Reihe zeigt.

    **Was der Pruefer hier kann und was nicht.** Er sieht, dass zwei Zeilen
    DENSELBEN Text tragen. Er sieht NICHT, dass zwei verschieden formulierte
    Zeilen dasselbe meinen - das bleibt eine Entscheidung des Autors. Die
    Spalte macht sie nur sichtbar und vergleichbar, statt sie in elf
    Fliesstexten zu verstecken. Diese Grenze steht auch in PROFIL 9.
    """
    f = []
    if not zeilen:
        return ["PROFIL.md §9: keine Tafel gefunden - wurde sie umbenannt?"]
    inTafel = {k for k, *_ in zeilen}
    for k in sorted(set(hilfen) - inTafel):
        f.append(f"PROFIL.md §9: {k} fehlt in der Tafel")
    beansprucht = {}
    for k, frage, art, aufg, fehler in zeilen:
        if k not in hilfen:
            f.append(f"PROFIL.md §9: {k} steht in der Tafel, aber es gibt keine Datei")
            continue
        h = hilfen[k][0]
        if frage != h.get("frage", ""):
            f.append(f"PROFIL.md §9 {k}: Tafel sagt „{frage}“, die Datei sagt "
                     f"„{h.get('frage')}“")
        if art != h.get("art", ""):
            f.append(f"PROFIL.md §9 {k}: Tafel sagt Art „{art}“, die Datei „{h.get('art')}“")
        if aufg != h.get("aufgabe", ""):
            f.append(f"PROFIL.md §9 {k}: Tafel sagt Aufgabe „{aufg}“, die Datei "
                     f"„{h.get('aufgabe')}“")
        if not fehler:
            f.append(f"PROFIL.md §9 {k}: die Spalte „fängt allein auf“ ist leer — "
                     f"ohne sie kann niemand sehen, ob zwei Hilfen denselben "
                     f"Fehler beanspruchen")
            continue
        marke = re.sub(r"\s+", " ", fehler).strip().lower()
        if marke in beansprucht:
            f.append(f"PROFIL.md §9: {beansprucht[marke]} und {k} beanspruchen "
                     f"beide den Fehler „{fehler}“ — jeder Fehler gehört GENAU "
                     f"einer Hilfe; sonst bekommt der Suchende zwei Antworten")
        beansprucht[marke] = k
    return f


def fehler_marke(text):
    """Die Behauptung eines `faengt_fehler_auf` OHNE ihre Zahlen und Terme.

    Zwei Hilfen, die denselben Fehler beanspruchen, tun das fast nie mit
    denselben Zahlen — jede spricht ja über ihre eigene Aufgabe. Der
    historische Fall unterschied sich in GENAU einem Zeichen: gl02 sagte
    „rechnet die −5 nur links“, gl03 „rechnet die −6 nur links“. Ein
    Vergleich auf Zeichenketten sieht das nicht, ein Vergleich ohne die
    Mathematik schon.
    """
    s = MATHE.sub(" ", text or "")
    s = re.sub(r"[^\wäöüßÄÖÜ ]+", " ", s.lower())
    return " ".join(s.split())


def fehler_vergleich(hilfen):
    """`faengt_fehler_auf` über ALLE Dateien hinweg — der Fehler zwischen den
    Dateien, nicht in einer (§9.1).

    Die Spalte „fängt allein auf“ in PROFIL §9 ist Dokumentation und wird von
    Hand gepflegt. Sie allein zu bewachen reicht nicht: Setzt jemand die FELDER
    von gl02 und gl09 auf ihre alten Texte zurück und lässt die Tafel stehen,
    fährt der Prüfer wieder grün (gemessen 11.09.2026: 0 Befunde). Geprüft wird
    deshalb auch die Quelle, aus der die Tafel abgeschrieben ist.

    Grenze, dieselbe wie bei der Tafel: Er sieht gleiche BEHAUPTUNGEN, nicht
    gleiche Bedeutung. „zieht 2x nur rechts ab“ und „rechnet die −6 nur links“
    meinen dasselbe und bleiben für ihn verschieden — das bleibt eine
    Entscheidung des Autors (Prüffrage in §9.1).
    """
    f, gesehen = [], {}
    for k in sorted(hilfen):
        h = hilfen[k]
        if isinstance(h, tuple):
            h = h[0]
        m = fehler_marke(h.get("faengt_fehler_auf", ""))
        if not m:                       # leeres Feld meldet pruefe() selbst
            continue
        if m in gesehen:
            f.append(f"{gesehen[m]} und {k} beanspruchen beide denselben Fehler "
                     f"(„{h.get('faengt_fehler_auf')}“ — bis auf die Zahlen "
                     f"derselbe Satz); jeder Fehler gehört GENAU einer Hilfe "
                     f"(§9.1), sonst bekommt der Suchende zwei Antworten")
        gesehen[m] = k
    return f


def tafel_pruefen(hilfen):
    pfad = os.path.join(HERE, "PROFIL.md")
    if not os.path.exists(pfad):
        return ["PROFIL.md fehlt - der Standard ist die Grundlage, nicht Beiwerk"]
    return tafel_vergleich(tafel_zeilen(open(pfad, encoding="utf-8").read()), hilfen)


if __name__ == "__main__":
    daten = json.load(open(os.path.join(HERE, "aufgaben.json"), encoding="utf-8"))
    hilfen, sammelbefunde = lade_hilfen()
    gute = {k: hilfen[k][0] for k in ("gl02", "gl08") if k in hilfen}
    if len(gute) != 2:
        print("Die beiden Maßstab-Hilfen gl02 und gl08 fehlen — ohne sie kein "
              "Selbsttest und kein Urteil.")
        sys.exit(2)

    st, n_proben = selbsttest(gute, daten)
    if st:
        print("SELBSTTEST NICHT BESTANDEN — der Prüfer darf nicht urteilen:")
        for z in st:
            print(" ✗", z)
        sys.exit(2)
    # Genau sagen, was gelaufen ist: eine Gegenprobe ist KEINE kaputte Probe.
    # „64 absichtlich kaputte“ wäre in einem Werkzeug, dessen Hausregel das
    # Schweigen verbietet, die falsche Zahl an der sichtbarsten Stelle.
    print(f"Selbsttest bestanden: Wortzähler gegen {len(ZAEHLER_PROBEN)} von Hand "
          f"gezählte Sätze, 2 gute Hilfen, {n_proben} Proben (absichtlich kaputte "
          f"mit je eigener Meldung + Gegenproben, bei denen sie ausbleiben muss).")
    print(f"aufgaben.json nachgerechnet: {len(daten['aufgaben'])} Aufgaben, "
          f"alle Schritte, Lösungen und Falschergebnisse geprüft.\n")

    # Der Fehlervergleich laeuft IMMER: lade_hilfen() liest ohnehin alle
    # Dateien, und ein Fehler zwischen zwei Dateien verschwindet nicht,
    # wenn man nur eine davon aufruft.
    sammelbefunde += fehler_vergleich(hilfen)

    # Die Tafel nur beim vollen Lauf pruefen - bei einem Lauf ueber zwei
    # Kennungen fehlen die anderen acht zu Recht.
    if not sys.argv[1:]:
        sammelbefunde += tafel_pruefen(hilfen)

    index = aufgaben_index(daten)
    ids = sys.argv[1:] or sorted(hilfen)
    gesamt = len(sammelbefunde)
    for b in sammelbefunde:
        print("  ✗", b)
    for kid in ids:
        if kid not in hilfen:
            print(f"── {kid} ──\n  ✗ keine Datei mit dieser Kennung"); gesamt += 1
            continue
        h, fn = hilfen[kid]
        bef, n = pruefe(h, index)
        w = h.get("woerter_gesamt", 0)
        marke = "  ⚠ Warnschwelle" if WARNUNG <= w <= BUDGET else ""
        print(f"── {kid}  ({fn})  {w} Wörter · {w/TEMPO:.1f} s Sprache · "
              f"{w/TEMPO+STANDZEIT:.1f} s Clip · {n} Prüfungen{marke}")
        for t in TEILE_ALLE:
            d = (h.get("skript") or {}).get(t)
            if d:
                print(f"     {t} {woerter(d['text']):>3}  {d['text']}")
        for b in bef:
            print("  ✗", b)
        gesamt += len(bef)

    print(f"\nBEFUNDE GESAMT: {gesamt}")
    sys.exit(1 if gesamt else 0)
