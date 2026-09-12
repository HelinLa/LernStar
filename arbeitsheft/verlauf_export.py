# -*- coding: utf-8 -*-
"""Erzeugt aus dem Rohprotokoll einen lesbaren Gesprächsverlauf mit
Inhaltsverzeichnis. Neu ausführen, wenn der Verlauf aktualisiert werden soll:
    python3 verlauf.py
"""
import json, io, os, re, datetime

Q = "/Users/lala/.claude/projects/-Users-lala/d2ec281f-8bf0-4474-af80-7a8a92a29439.jsonl"
ZIEL = os.path.expanduser("~/Desktop/FELO_Chatverlauf.md")

def text_von(c):
    """Text eines Beitrags. Eingefuegte Bilder kann eine Textdatei nicht
    enthalten - sie werden deshalb ausdruecklich vermerkt, damit beim
    spaeteren Lesen nicht der Eindruck entsteht, dort haette nichts gestanden."""
    if isinstance(c, str): return c
    if not isinstance(c, list): return ""
    st = []
    for b in c:
        if not isinstance(b, dict): continue
        if b.get("type") == "text": st.append(b.get("text", ""))
        elif b.get("type") == "image": st.append("*[hier war ein Bildschirmfoto eingefügt]*")
    return "\n".join(st)

def werkzeuge(c):
    if not isinstance(c, list): return []
    w = []
    for b in c:
        if isinstance(b, dict) and b.get("type") == "tool_use":
            e = b.get("input", {}) or {}
            bes = e.get("description") or e.get("file_path") or e.get("skill") or ""
            w.append("%s: %s" % (b.get("name", "?"), str(bes)[:80]))
    return w

def _schritte(k):
    return "<sub>*%d %s*</sub>\n" % (k, "Arbeitsschritt" if k == 1 else "Arbeitsschritte")

def anker(n, t):
    kurz = re.sub(r"[^a-z0-9äöüß ]", "", t.lower().split("\n")[0])[:48].strip()
    return "%d-%s" % (n, re.sub(r"\s+", "-", kurz)) if kurz else str(n)

eintraege = []          # (nummer, text, anker)
zeilen = []
puffer = []
letzte = None
n = 0

with io.open(Q, encoding="utf-8") as f:
    for roh in f:
        try: d = json.loads(roh)
        except Exception: continue
        if d.get("type") not in ("user", "assistant"): continue
        m = d.get("message")
        if not isinstance(m, dict): continue
        c = m.get("content")
        t = text_von(c).strip()

        if m.get("role") == "user":
            if not t or t.startswith("<") or "system-reminder" in t[:200]: continue
            if puffer:
                zeilen.append(_schritte(len(puffer))); puffer = []
            n += 1
            a = anker(n, t)
            eintraege.append((n, t.split("\n")[0][:95], a))
            zeilen.append('\n---\n\n<a id="%s"></a>\n\n## %d. Abdullah\n\n> %s\n'
                          % (a, n, t.replace("\n", "\n> ")))
            letzte = "user"
        else:
            puffer += werkzeuge(c)
            if t:
                if puffer:
                    zeilen.append(_schritte(len(puffer))); puffer = []
                zeilen.append("\n### Claude\n\n%s\n" % t)
            letzte = "assistant"
if puffer:
    zeilen.append(_schritte(len(puffer)))

toc = "\n".join("%d. [%s](#%s)" % (nr, txt.replace("|", "\\|"), a) for nr, txt, a in eintraege)
kopf = """# FELO · Gesprächsverlauf

Vollständiger Verlauf der Arbeit an den FELO-Physikheften (Realschule NRW),
Stand %s.

Enthalten sind **alle %d Nachrichten von Abdullah** und **alle Antworten** in
ihrer Reihenfolge. Die Werkzeugaufrufe dazwischen — Dateien lesen, Simulationen
prüfen, Hefte bauen — sind zu je einer Zeile zusammengefasst („%s Arbeitsschritte"),
sonst wäre der Verlauf nicht lesbar.

Nicht enthalten sind Bilder: ein von Abdullah eingefügtes Bildschirmfoto ist als\nHinweis vermerkt, die von Claude gelesenen Seitenbilder sind weggelassen.\n\nDas Rohprotokoll mit allem, auch den eingebetteten Seitenbildern, liegt unter
`~/.claude/projects/-Users-lala/d2ec281f-8bf0-4474-af80-7a8a92a29439.jsonl`
(240 MB). Neu erzeugen lässt sich diese Datei mit `verlauf.py` aus dem Scratchpad.

---

## Inhalt

%s

""" % (datetime.date.today().strftime("%d.%m.%Y"), n, "n", toc)

io.open(ZIEL, "w", encoding="utf-8").write(kopf + "".join(zeilen))
print("geschrieben: %s" % ZIEL)
print("  %d Nachrichten von Abdullah · %.0f KB" % (n, os.path.getsize(ZIEL)/1024))
