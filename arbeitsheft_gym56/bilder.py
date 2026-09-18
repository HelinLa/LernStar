# -*- coding: utf-8 -*-
"""Nimmt deine eigenen Bilder aus  bilder/  und macht Heftbilder daraus.

    bilder/m1.png   ->   img/einstieg_m1.png

Was dabei passiert: Das Bild wird auf 900 x 540 gebracht (beschnitten, damit
keine Balken entstehen), bekommt die runden Ecken und den goldenen Rahmen der anderen
Seiten und wird als PNG abgelegt. Dadurch sieht ein selbst erzeugtes Bild aus wie die
gezeichneten - sonst faellt der Stilbruch beim Blaettern sofort auf.

Dateiname = die Themen-Kennung. Alles nach einem Leerzeichen, Bindestrich oder
Unterstrich wird ignoriert, "s3 der riss im kabel.png" ist also auch in Ordnung.
Erlaubt sind png, jpg, jpeg, webp, tif.

Ein Bild in bilder/ hat IMMER Vorrang vor der gezeichneten Fassung aus szenen/.

    python3 bilder.py          einlesen und berichten
    python3 build_book.py      liest ebenfalls ein und setzt danach das Heft
"""
import os, json, re, sys
from PIL import Image, ImageDraw

# Gleiche Mechanik wie in Klasse 5, nur andere Ordner: HERE zeigt auf arbeitsheft7,
# damit content/, img/ und bilder/ dieses Hefts gemeint sind.
HERE   = os.path.dirname(os.path.abspath(__file__))
QUELLE = os.path.join(HERE, "bilder")
ZIEL   = os.path.join(HERE, "img")
BREIT, HOCH = 900, 540
RADIUS, RAND, RANDBREIT = 84, 6, 5
GOLD  = (196, 150, 58)
CREME = (255, 247, 232)
ENDUNGEN = (".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff")

# Ordner auf dem Schreibtisch, aus denen automatisch geholt wird.
# Klassenzahl aus plan.py, damit diese Datei in allen vier Gesamtschulheften
# dieselbe bleibt. Geladen wird ueber importlib und den EIGENEN Ordner, nicht
# ueber sys.path: build_book.py importiert dieses Modul, und ein Eingriff in
# sys.path liesse ein anderes Heft spaeter das falsche plan/build_book erwischen
# (CLAUDE.md, Falle 3).
import importlib.util as _ilu
_pspec = _ilu.spec_from_file_location(
    "plan_bilder", os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.py"))
_plan = _ilu.module_from_spec(_pspec); _pspec.loader.exec_module(_plan)
_KL = str(_plan.KLASSE).replace('/', '-')
SCHREIBTISCH = [f"FeLabs-Bilder Gymnasium {_KL}",
                f"Bilder für FeLabs Gymnasium {_KL}",
                f"Bilder fuer FeLabs Gymnasium {_KL}"]


def _finder_namen(ordner):
    """Dateinamen im Schreibtisch-Ordner erfragen.

    macOS verweigert diesem Prozess das AUFLISTEN des Schreibtischs (Operation not
    permitted), erlaubt aber das Lesen einer Datei mit bekanntem Namen. Der Finder
    darf auflisten - also fragen wir ihn und lesen danach selbst.
    """
    import subprocess
    o = ordner.replace('"', '\\"')
    skript = ('set AppleScript\'s text item delimiters to linefeed\n'
              'tell application "Finder"\n'
              f'  set l to name of every file of folder "{o}" of (path to desktop folder)\n'
              'end tell\n'
              'return l as text')
    try:
        r = subprocess.run(["osascript", "-e", skript], capture_output=True, text=True, timeout=25)
    except Exception:
        return None
    if r.returncode != 0:
        return None
    return [n.strip() for n in r.stdout.splitlines() if n.strip()]


def _alias_ziel(ordner, name):
    """Pfad hinter einer macOS-Verknuepfung. Wer eine Datei mit gedrueckter Wahltaste
    zieht, legt statt einer Kopie ein Alias an - 760 Bytes, die nur zeigen, wo das
    Bild wirklich liegt. Der Finder kann es aufloesen."""
    import subprocess
    o = ordner.replace('"', '\\"'); n = name.replace('"', '\\"')
    skript = ('tell application "Finder"\n'
              f'  set f to file "{n}" of folder "{o}" of (path to desktop folder)\n'
              '  return POSIX path of ((original item of f) as alias)\n'
              'end tell')
    try:
        r = subprocess.run(["osascript", "-e", skript], capture_output=True, text=True, timeout=25)
    except Exception:
        return None
    ziel = r.stdout.strip()
    return ziel if r.returncode == 0 and ziel else None


def holen(still=False):
    """Neue oder geaenderte Bilder vom Schreibtisch nach bilder/ kopieren."""
    import shutil
    geholt = []
    for ordner in SCHREIBTISCH:
        namen = _finder_namen(ordner)
        if not namen:
            continue
        quelle = os.path.join(os.path.expanduser("~/Desktop"), ordner)
        for n in namen:
            if not n.lower().endswith(ENDUNGEN):
                continue
            src = os.path.join(quelle, n)
            dst = os.path.join(QUELLE, n)
            try:
                neu = open(src, "rb").read()
            except Exception as e:
                if not still: print(f"   ! {n} – {type(e).__name__}")
                continue
            if neu[:8] == b"book\x00\x00\x00\x00":          # macOS-Verknuepfung statt Bild
                ziel = _alias_ziel(ordner, n)
                if not ziel:
                    if not still: print(f"   ! {n} – Verknüpfung, Ziel nicht auffindbar")
                    continue
                try:
                    neu = open(ziel, "rb").read()
                    if not still: print(f"   ↪ {n} ist eine Verknüpfung auf {ziel}")
                except Exception as e:
                    if not still: print(f"   ! {n} – Verknüpfung zeigt ins Leere ({type(e).__name__})")
                    continue
            if os.path.exists(dst) and open(dst, "rb").read() == neu:
                continue
            os.makedirs(QUELLE, exist_ok=True)
            open(dst, "wb").write(neu)
            geholt.append(n)
            if not still: print(f"   ↓ vom Schreibtisch: {n}")
    return geholt

def _norm(s):
    # macOS legt Dateinamen zerlegt ab (NFD): "ö" ist dort "o" + Trema. Ohne das
    # Zusammenziehen wuerde daraus "konnen" statt "koennen", und der Dateiname
    # "Wie können wir einen Gegenstand sehen?.png" faende sein Thema nicht.
    import unicodedata
    s = unicodedata.normalize("NFC", s).lower()
    for a, b in (("ä","ae"),("ö","oe"),("ü","ue"),("ß","ss")): s = s.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "", s)


def _norm2(s):
    """Zweite Schreibweise ohne Umlaut-Ersatz: Beim Herunterladen wird aus
    "Pfütze" gern "Pfutze". Dann passt weder ue noch ü - wohl aber u."""
    import unicodedata
    s = unicodedata.normalize("NFD", s).lower()
    s = "".join(c for c in s if not unicodedata.combining(c))     # ü -> u
    return re.sub(r"[^a-z0-9]+", "", s.replace("ß", "ss"))

def _themen():
    """Kennung -> normalisierte Namen, damit auch Dateinamen wie
    'Welche Stoffe leiten Strom?.png' oder 'Der Riss im Kabel.jpg' erkannt werden."""
    import json
    q = os.path.join(HERE, "content", "forscherseiten.json")
    try:
        d = json.load(open(q, encoding="utf-8"))
    except Exception:
        return {}
    tab = {}
    for o in d:
        for feld in ("name", "titel"):
            if o.get(feld):
                tab[_norm(o[feld])] = o["id"]
                tab[_norm2(o[feld])] = o["id"]
    # Ueberschriften, die nur im Layout stehen und nicht in der JSON
    for satz, tid in (("So zeichnet man einen Stromkreis", "s1"),
                      ("Schaltzeichen", "s1")):
        tab[_norm(satz)] = tid
    return tab

_TAB = None

def _zuordnung(dateiname):
    """Feste Zuordnung Dateiname -> Thema aus bilder/_zuordnung.json.
    Fuer Bilder, deren Name auf das eine Thema zeigt, deren Inhalt aber zum anderen passt."""
    try:
        import json
        tab = json.load(open(os.path.join(QUELLE, "_zuordnung.json"), encoding="utf-8"))
        return tab.get(dateiname)
    except Exception:
        return None


def _kennung(dateiname):
    global _TAB
    fest = _zuordnung(dateiname)
    if fest: return fest
    stamm = os.path.splitext(dateiname)[0].strip()
    # Kennung am Dateianfang - die Kennungen kommen aus dem Bauplan DIESES Hefts,
    # nicht aus einer festen Liste. Vorher stand hier ein Muster nur fuer Klasse 5/6
    # (m1-5, l1-5, s1-6 ...), damit hiess "oi3 Der Lichtfleck.png" fuer die
    # Gesamtschulhefte nichts - obwohl der Arbeitsstand genau diese Schreibweise
    # verlangt. Laengste Kennung zuerst, sonst schluckt "el1" das "el11".
    for tid in sorted({th["id"] for k in _plan.ALLE_KAPITEL for th in k["themen"]},
                      key=len, reverse=True):
        if re.match(r"^" + re.escape(tid) + r"\b", stamm.lower()):
            return tid
    if _TAB is None: _TAB = _themen()
    for n in (_norm(stamm), _norm2(stamm)):
        if n in _TAB: return _TAB[n]
    # auch Teiltreffer: "s3 welche stoffe leiten strom" oder "kapitel welche stoffe..."
    for n in (_norm(stamm), _norm2(stamm)):
        for name, tid in _TAB.items():
            if len(name) > 12 and name in n: return tid
    return None

def _schnitt(dateiname, tid=None):
    """Welcher Teil bleibt, wenn das Bild nicht 5:3 ist.

    Erst schaut es in bilder/_schnitt.json (dort steht z.B. {"s3": "unten"}),
    dann in den Dateinamen. So muss der Dateiname auf dem Schreibtisch nichts
    ueber den Bildausschnitt wissen.
    """
    lage = {"oben": 0.0, "unten": 1.0, "mitte": 0.5}
    if tid:
        try:
            import json
            tab = json.load(open(os.path.join(QUELLE, "_schnitt.json"), encoding="utf-8"))
            if tid in tab:
                w = tab[tid]
                if isinstance(w, dict): return float(w.get("lage", 0.5))
                if isinstance(w, (int, float)): return max(0.0, min(1.0, float(w)))
                return lage.get(str(w).lower(), 0.5)
        except Exception:
            pass
    n = _norm(dateiname)
    for wort, wert in lage.items():
        if wort in n: return wert
    return 0.5

def _ausschnitt(tid):
    """Optionaler Bildausschnitt aus bilder/_schnitt.json, als Bruchteile [x0,y0,x1,y1].
    Damit laesst sich aus einem Bild mit mehreren Feldern eines herausnehmen, ohne
    dass die Datei neu erzeugt werden muss."""
    if not tid: return None
    try:
        import json
        tab = json.load(open(os.path.join(QUELLE, "_schnitt.json"), encoding="utf-8"))
        w = tab.get(tid)
        if isinstance(w, dict) and "box" in w and len(w["box"]) == 4:
            return [float(x) for x in w["box"]]
    except Exception:
        pass
    return None


def _karte(im, lage=0.5, box=None):
    """auf 900x540 beschneiden, runde Ecken, goldener Rahmen.
    lage: 0 = oberen Teil behalten, 1 = unteren, 0.5 = mittig"""
    im = im.convert("RGBA")
    # deckend machen, falls durchsichtig
    grund = Image.new("RGBA", im.size, CREME + (255,))
    im = Image.alpha_composite(grund, im)
    if box:
        x0, y0, x1, y1 = box
        im = im.crop((round(x0*im.width), round(y0*im.height),
                      round(x1*im.width), round(y1*im.height)))
    # mittig fuellen statt einpassen: keine Balken, dafuer beschnitten
    f = max(BREIT / im.width, HOCH / im.height)
    neu = im.resize((max(1, round(im.width * f)), max(1, round(im.height * f))), Image.LANCZOS)
    links = round((neu.width - BREIT) * 0.5)
    oben  = round((neu.height - HOCH) * lage)
    neu = neu.crop((links, oben, links + BREIT, oben + HOCH))
    # runde Ecken
    maske = Image.new("L", (BREIT, HOCH), 0)
    ImageDraw.Draw(maske).rounded_rectangle([0, 0, BREIT - 1, HOCH - 1], RADIUS, fill=255)
    karte = Image.new("RGBA", (BREIT, HOCH), (0, 0, 0, 0))
    karte.paste(neu, (0, 0), maske)
    # goldener Rahmen wie bei den gezeichneten Seiten
    d = ImageDraw.Draw(karte)
    d.rounded_rectangle([RAND, RAND, BREIT - 1 - RAND, HOCH - 1 - RAND],
                        RADIUS - RAND, outline=GOLD + (255,), width=RANDBREIT)
    return karte, (im.width, im.height), f

ABGELEHNT = os.path.join(HERE, "bilder", "_abgelehnt.json")

def _abgelehnt():
    """Bilder, die fachlich nicht zum Text passen, an ihrer Pruefsumme gemerkt.

    Ohne das holt der naechste Bau dieselbe falsche Datei wieder vom Schreibtisch
    und ueberschreibt den Platzhalter. Gemerkt wird die Pruefsumme, nicht der
    Dateiname: Legt jemand unter demselben Namen ein NEUES Bild ab, aendert sich
    die Pruefsumme, und es wird ganz normal uebernommen - ohne Handgriff."""
    try:
        return json.load(open(ABGELEHNT, encoding="utf-8"))
    except Exception:
        return {}

def _pruefsumme(pfad):
    import hashlib
    h = hashlib.sha1()
    with open(pfad, "rb") as f:
        for stueck in iter(lambda: f.read(65536), b""):
            h.update(stueck)
    return h.hexdigest()

def _titel():
    """Kennung -> Seitentitel, fuer die Beschriftung der Platzhalter."""
    try:
        d = json.load(open(os.path.join(HERE, "content", "forscherseiten.json"), encoding="utf-8"))
        return {o["id"]: (o.get("titel") or o.get("name") or o["id"]) for o in d}
    except Exception:
        return {}

def ablehnen(tid, pfad):
    """Das aktuelle Bild eines Themas als unpassend vormerken."""
    liste = _abgelehnt()
    liste.setdefault(tid, [])
    s = _pruefsumme(pfad)
    if s not in liste[tid]:
        liste[tid].append(s)
    os.makedirs(os.path.dirname(ABGELEHNT), exist_ok=True)
    json.dump(liste, open(ABGELEHNT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return s

def einlesen(still=False, vom_schreibtisch=True):
    if vom_schreibtisch:
        try: holen(still)
        except Exception as e:
            if not still: print("   Schreibtisch übersprungen:", e)
    if not os.path.isdir(QUELLE):
        return {}
    genommen = {}; offen = []
    for f in sorted(os.listdir(QUELLE)):
        if f.startswith(".") or not f.lower().endswith(ENDUNGEN):
            continue
        tid = _kennung(f)
        if not tid:
            if not still: print(f"   ? {f} – keine Themen-Kennung am Anfang, übersprungen")
            continue
        quelle = os.path.join(QUELLE, f)
        if _pruefsumme(quelle) in _abgelehnt().get(tid, []):
            if not still: print(f"   – {tid:4s} ← {f} passt nicht zum Text, Platzhalter bleibt")
            offen.append(tid)
            continue
        try:
            karte, orig, faktor = _karte(Image.open(quelle), _schnitt(f, tid), _ausschnitt(tid))
        except Exception as e:
            print(f"   ! {f} – {e}")
            continue
        karte.save(os.path.join(ZIEL, f"einstieg_{tid}.png"))
        genommen[tid] = f
        if not still:
            hinweis = "" if abs(orig[0]/orig[1] - BREIT/HOCH) < 0.04 else \
                      f"  (aus {orig[0]}x{orig[1]} beschnitten)"
            print(f"   ✓ {tid:4s} ← {f}{hinweis}")
    # Platzhalter fuer JEDES Thema ohne eigenes Bild - nicht nur fuer die, deren
    # Datei abgelehnt wurde. Sonst bleibt eine alte Karte liegen und traegt nach
    # einer Titelaenderung noch den alten Seitentitel.
    titel = _titel()
    offen = [t for t in titel if t not in genommen] or [t for t in offen if t not in genommen]
    if offen:
        platzhalter(offen, titel)
    return genommen

def platzhalter(tids, titel=None):
    """Karte mit Rahmen und Hinweis, solange fuer ein Thema noch kein Bild da ist.
    Verhindert, dass ein Text ueber ein Bild geraet, das nicht mehr dazu passt."""
    from PIL import ImageFont
    schrift = None
    for pfad in ("fonts/Avenir.ttc", "/System/Library/Fonts/Supplemental/Futura.ttc",
                 "/System/Library/Fonts/Helvetica.ttc"):
        try:
            schrift = ImageFont.truetype(os.path.join(HERE, pfad) if not pfad.startswith("/") else pfad, 30)
            break
        except Exception:
            continue
    for tid in tids:
        k = Image.new("RGBA", (BREIT, HOCH), CREME + (255,))
        d = ImageDraw.Draw(k)
        # dezentes Karo, damit die Karte nicht wie ein Fehler aussieht
        for x in range(0, BREIT, 45): d.line([(x, 0), (x, HOCH)], fill=(240, 230, 208, 255))
        for y in range(0, HOCH, 45): d.line([(0, y), (BREIT, y)], fill=(240, 230, 208, 255))
        d.rounded_rectangle([170, 176, 730, 364], 22, outline=(214, 196, 158, 255), width=4)
        d.line([(170, 176), (730, 364)], fill=(238, 228, 206, 255), width=4)
        d.line([(730, 176), (170, 364)], fill=(238, 228, 206, 255), width=4)
        text = f"Bild {tid} folgt"
        if titel and tid in titel: text += f" · {titel[tid]}"
        if schrift:
            b = d.textbbox((0, 0), text, font=schrift)
            d.rectangle([BREIT/2-(b[2]-b[0])/2-16, 252, BREIT/2+(b[2]-b[0])/2+16, 292], fill=CREME + (255,))
            d.text((BREIT/2, 270), text, font=schrift, fill=(150, 132, 96, 255), anchor="mm")
        maske = Image.new("L", (BREIT, HOCH), 0)
        ImageDraw.Draw(maske).rounded_rectangle([0, 0, BREIT-1, HOCH-1], RADIUS, fill=255)
        karte = Image.new("RGBA", (BREIT, HOCH), (0, 0, 0, 0)); karte.paste(k, (0, 0), maske)
        ImageDraw.Draw(karte).rounded_rectangle([RAND, RAND, BREIT-1-RAND, HOCH-1-RAND],
                                                RADIUS-RAND, outline=GOLD + (255,), width=RANDBREIT)
        karte.save(os.path.join(ZIEL, f"einstieg_{tid}.png"))
    return list(tids)

if __name__ == "__main__":
    print(f"Schreibtisch-Ordner: {', '.join(SCHREIBTISCH)}")
    print(f"Lese aus {QUELLE}")
    g = einlesen()
    print(f"\n{len(g)} eigene Bilder übernommen." if g else "\nKeine Bilder gefunden.")
    if g:
        print("Diese Themen kommen jetzt aus bilder/ statt aus szenen/:", " ".join(sorted(g)))
    print("Danach:  python3 build_book.py")
