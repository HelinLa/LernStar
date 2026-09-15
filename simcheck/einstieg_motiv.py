# -*- coding: utf-8 -*-
"""Prueft, ob der EINSTIEG einer Heftseite zu dem passt, was die Simulation ZEIGT.

    python3 simcheck/einstieg_motiv.py [<heftordner> ...]   # ohne Angabe: alle 19
    python3 simcheck/einstieg_motiv.py --selbsttest

Abdullah, 15.09.2026: *"wenn wir von laufen im einstieg reden, dann auch in die
Simulation ein läufer reinpacken, dann passt das alles auch schön zusammen."*
Der Anlass war ki1 in der Einfuehrungsphase: Der Einstieg erzaehlt vom
Lauftreff, am Bildschirm fuhr ein Wagen. Eine Klasse hat es beim Test gemeldet,
nicht ein Pruefer.

WAS GEPRUEFT WIRD - und was NICHT
=================================
Nicht "passt die Stimmung", sondern: **Nennt der Bildschirm einen Gegenstand,
der dem Einstieg widerspricht?** Drei Faelle, und nur der erste ist ein Mangel:

  ANSEHEN      Der Bildschirm nennt einen Gegenstand (Auto, Wagen, Rad, Kugel),
               der Einstieg einen ANDEREN - und die Arbeitsschritte der Seite
               nennen den des Einstiegs NICHT. Das ist eine VORLAGE ZUM
               ANSEHEN, kein Mangel: Ein Mensch entscheidet, ob das Ding des
               Einstiegs die Geschichte TRAEGT ("der Wagen faehrt" gegen
               Tobias' Skateboard - dann stimmt es nicht) oder nur darin
               vorkommt ("die Kisten hinten rutschen gegen die Rueckwand",
               waehrend es um den Bremsweg des Transporters geht - dann ist
               alles richtig). Gemessen sind es 12 von 573 Seiten; beim
               Durchsehen war EINE davon wirklich schief.
  STUMM        Der Bildschirm nennt gar keinen Gegenstand (er zeichnet einen
               Koerper, ohne ihn zu benennen). Das ist KEIN Mangel: Ein
               abstrakter Koerper passt zu jeder Geschichte. Die Haelfte des
               Bestands arbeitet so, und das ist gut.
  EINIG        Gegenstand des Einstiegs kommt am Bildschirm vor - oder die
               Arbeitsschritte nennen den des Bildschirms, dann sind Seite und
               Simulation einig und der Einstieg erzaehlt nur die Vorgeschichte.

WARUM SO ENG: Ein erster Anlauf verglich MOTIVE ("laufen", "kiste", "lampe")
zwischen Einstieg und Bildschirmtext und meldete **129 von 365 Seiten**. Beim
Nachsehen war das grosse Mehrheit Beiwerk: Der Einstieg von `ki16` erwaehnt
Laufen, geht aber um den Stoss zweier Kugeln - und genau die zeigt die
Simulation. Wer daraufhin die Kugeln durch Laeufer ersetzt, macht eine richtige
Seite kaputt. Gemeldet wird deshalb nur der WIDERSPRUCH.

DIE RICHTUNG DER BERICHTIGUNG steht nicht in diesem Werkzeug, sie folgt aus
einer Messung: **Nennen die Arbeitsschritte den Gegenstand, muss der Bildschirm
ihn zeigen** - dann ist der Einstieg das schiefe Stueck (er kostet drei Saetze).
Nennt ihn keine Seite, ist die Figur am Bildschirm frei und richtet sich nach
den Einstiegen, die auf sie zeigen (`js/heft-bruecke.js` sagt, wer das ist).
"""
import importlib.util as ilu, json, os, re, sys, collections

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)

_sp = ilu.spec_from_file_location("hgs", os.path.join(HIER, "heft_gegen_sim.py"))
hgs = ilu.module_from_spec(_sp); _sp.loader.exec_module(hgs)
_sp2 = ilu.spec_from_file_location("fz", os.path.join(HIER, "fakten_ziehen.py"))
fz = ilu.module_from_spec(_sp2); _sp2.loader.exec_module(fz)

# Gegenstaende, die eine Geschichte TRAGEN koennen. Absichtlich kurz: Es geht um
# das Ding, das sich bewegt oder leuchtet, nicht um jedes Substantiv. Jede Zeile
# ist eine Gruppe - "Rad" und "Fahrrad" sind dasselbe Ding, "Wagen" und "Auto"
# auch (die Simulationen benutzen beide Woerter fuer dieselbe gezeichnete Kiste
# auf Raedern).
GRUPPEN = {
    "fahrzeug":   ["auto", "wagen", "pkw", "lkw", "kleinwagen", "taxi"],
    "rad":        ["fahrrad", "rad", "velo", "radfahr"],
    "rollbrett":  ["skateboard", "roller", "rollbrett", "inliner"],
    # "bahn" ALLEIN gehoert NICHT dazu: In der Physik ist eine Bahn die
    # Strecke, nicht die Eisenbahn - "Die Bahn ist zu Ende", "Kreisbahn",
    # "Umlaufbahn", "Planetenbahn", "Lichtschranken an der Bahn". Gemessen hat
    # genau dieses Wort nach der Berichtigung von `beschleunigung-ef` einen
    # neuen Widerspruch erfunden.
    "schiene":    ["zug", "eisenbahn", "s-bahn", "u-bahn", "straßenbahn",
                   "waggon", "lok", "gleis"],
    "mensch":     ["läufer", "läuferin", "sportler", "sportlerin", "person",
                   "kind", "junge", "mädchen", "sprinter"],
    "kugel":      ["kugel", "murmel", "billardkugel"],
    "ball":       ["ball", "fußball", "basketball", "tennisball"],
    "kasten":     ["kiste", "karton", "klotz", "paket", "koffer", "sack"],
    "lampe":      ["glühlampe", "glühbirne", "led-lampe", "leuchte"],
    "boot":       ["boot", "schiff", "floß"],
}
# Wer im Einstieg LAEUFT, traegt das Motiv "mensch" - auch ohne das Wort
# "Laeufer". ABER: "laeuft" allein genuegt nicht. Gemessen ueber alle 19 Baende
# kommen die Woerter laeuf/lauf/renn/sprint **74-mal** in den Einstiegen vor,
# und nur NEUN Stellen sind ein laufender Mensch. Der Rest:
#   "der Strahl laeuft gerade hindurch"      (Licht)
#   "der Motor laeuft mit dem Akku"          (Motor)
#   "eine Waschmaschine laeuft"              (Geraet)
#   "das Wasser laeuft nur traege heraus"    (Wasser)
#   "im Leitstand laeuft eine Kurve"         (Anzeige)
#   "eine Anlage, die Holz verbrennt"        ("renn" in "verbrennt"!)
#   "viel Brennstoff", "ein Brennstab"       (dasselbe)
#   "fuer einen Umlauf genau einen Tag"      ("lauf" in "Umlauf")
# Deshalb zaehlt eine Taetigkeit nur, wenn eine PERSON in der Naehe steht -
# oder wenn das Wort selbst eine Person nennt (Laeufer, Sprinterin).
TAETIGKEIT = {
    "mensch":   [r"läuf", r"lauf", r"renn", r"sprint", r"jogg", r"zu fuß", r"schritt"],
    "rad":      [r"fährt? (mit dem )?rad", r"radel", r"tritt in die pedale", r"fahrrad"],
    "fahrzeug": [r"fährt mit dem auto", r"gibt gas", r"bremst das auto"],
}
# Die Figuren der vier Reihen, dazu die Personalpronomen. Der Kanon steht in
# CLAUDE.md ("Figurenkanon der Gym-Bildauftraege") und in den plan.py der Reihen.
# Die Figuren werden mit WORTGRENZEN gesucht, und Personalpronomen zaehlen
# NICHT. Zwei gemessene Gruende:
#   "Nebenan im Waschraum laeuft eine Waschmaschine" - in "nebenan" steckt
#   "ben", und ohne Wortgrenze wurde daraus Ben.
#   "Solange der Strahl von vorn kommt, laeuft er schnurgerade hindurch" - das
#   "er" ist der Strahl. Ein Pronomen sagt nicht, WER laeuft.
# Die Einstiege nennen ihre Leute immer beim Namen, das genuegt also.
PERSON = (r"\b(mira|tobias|ben|mia|emma|nour|jannis|lina|aras|jonas|ela|tom|"
          r"sina|david|aylin|leon|noah|hannah|felix|lea|paul|zoe|amir|sarah)\b")
# Wortlaut, der die Person SELBST nennt - dann braucht es keine Naehe.
MENSCH_WORT = re.compile(r"(?<![a-zäöüß])(läufer|läuferin|sportler|sportlerin|"
                         r"sprinter|schwimmer|lauftreff|laufschritt|laufschuh)")


# FEHLFREUNDE. Die Wortanfang-Regel allein macht aus "automatisch" ein Auto und
# aus "Radiergummi" ein Fahrrad. Gemessen ueber die Einstiege aller 19 Baende -
# nicht geraten - kommen genau diese vor; jedes andere Wort, das mit einem
# Stamm anfaengt, ist wirklich das Ding ("Autobahn", "Laufschritt", "Kisten",
# "Laeufer", "Kistenwagen").
FEHLFREUND = re.compile(
    r"(?<![a-zäöüß])("
    r"automatisch\w*|automat\w*|autor\w*|autark\w*|"
    r"radio\w*|radier\w*|radium|radius|radikal\w*|"
    r"zugleich|zugesehen|zugespitzt|zugspitze|"
    r"ballon\w*|ballett\w*|"
    r"kugelschreiber\w*|"
    r"personal\w*|"
    r"kindergarten\w*|kindisch\w*|"
    # "renn" steckt in "brennt", "verbrennen", "Brennstoff", "Brennstab" -
    # gemessen die haeufigste Fehlquelle von allen (19 der 74 Stellen).
    r"brenn\w*|verbrenn\w*|abbrenn\w*|"
    # und "lauf" in Ablauf, Umlauf, Verlauf, fortlaufend, Schlaufe
    r"ablauf\w*|abläuf\w*|umlauf\w*|umläuf\w*|verlauf\w*|verläuf\w*|"
    r"fortlauf\w*|schlaufe\w*|durchlauf\w*|einlauf\w*|auslauf\w*|"
    r"weiterläuf\w*|weiterlauf\w*|davonläuf\w*|davonlauf\w*|"
    # "rad" steckt in "Radon" und "radioaktiv" - der halbe Kapitel-10-Wortschatz.
    r"radon\w*|radioakt\w*|radiolog\w*|"
    # und "Zug" heisst am Bildschirm oft ZUGKRAFT, nicht Eisenbahn:
    # "unter Zug eingespannt", "Zugkraft", "zugfest".
    r"zugkraft\w*|zugfest\w*|unter zug|zugstab\w*|zugversuch\w*"
    r")")


def _worte(text):
    # Die Fehlfreunde vorher ausstreichen, nicht hinterher ausnehmen -
    # sonst muesste jede Regel sie einzeln kennen.
    return FEHLFREUND.sub(" ", " ".join(hgs._flach(text)).lower())


def gruppen(text):
    """Welche Gegenstands-Gruppen nennt dieser Text?"""
    t = _worte(text)
    raus = set()
    for g, woerter in GRUPPEN.items():
        for w in woerter:
            # Am WORTANFANG, sonst macht "automatisch" ein Auto und "Verrad"
            # ein Fahrrad. Zusammensetzungen bleiben erwuenscht ("Laufschuh").
            if re.search(r"(?<![a-zäöüß])" + re.escape(w), t):
                raus.add(g); break
    if MENSCH_WORT.search(t):
        raus.add("mensch")
    for g, muster in TAETIGKEIT.items():
        for m in muster:
            for treffer in re.finditer(r"(?<![a-zäöüß])" + m, t):
                # PERSON in der Naehe? 45 Zeichen links oder rechts - das ist
                # etwa ein Satzglied. Ohne diese Bedingung macht "der Motor
                # laeuft" einen Laeufer.
                a = max(0, treffer.start() - 45)
                if re.search(PERSON, t[a:treffer.end() + 45]):
                    raus.add(g); break
            else:
                continue
            break
    return raus


def schirmtext(f):
    """Was NENNT die Simulation? Bildtexte und Aufschriften zuerst - das sieht
    ein Kind -, dazu die ersten Statuszeilen und die Ueberschrift."""
    return " ".join(f.get("bildtexte", [])
                    + [k["aufschrift"] for k in f.get("knoepfe", [])]
                    + [r.get("beschriftung", "") for r in f.get("regler", [])]
                    + [x["text"] or "" for x in f.get("status", [])[:30]]
                    + [f.get("ueberschrift", "")])


def pruefe(seiten, fakten, sim_von):
    """(ansehen, stumm, einig) - je Liste von (tid, sim, einstieg, schirm).

    Der erste Eimer ist eine Vorlage zum Ansehen, kein Mangelbericht: Ob das
    Ding des Einstiegs die Geschichte TRAEGT oder nur darin vorkommt, kann kein
    Wortvergleich entscheiden."""
    widerspruch, stumm, einig = [], [], []
    for s in seiten:
        sim = sim_von.get(s["id"])
        f = fakten.get(sim)
        if not f:
            continue
        ein = gruppen(s.get("problem"))
        if not ein:
            continue
        schirm = gruppen(schirmtext(f))
        schritte = gruppen([s.get("forschen"), s.get("beobachtung"), s.get("tabRows")])
        eintrag = (s["id"], sim, sorted(ein), sorted(schirm))
        if not schirm:
            stumm.append(eintrag)
        elif ein & schirm or schirm & schritte:
            einig.append(eintrag)
        else:
            widerspruch.append(eintrag)
    return widerspruch, stumm, einig


def selbsttest():
    """Ohne bestandenen Selbsttest darf das Werkzeug nicht urteilen.

    Neun Proben, jede mit ihrer Gegenprobe: gute Faelle, die NICHT auffallen
    duerfen, und die gemessenen Fehlfreunde, die es nicht sein duerfen - dazu
    die neun Stellen im Bestand, die wirklich ein laufender Mensch sind."""
    f = []
    fk = {"lauf": {"sim": "lauf", "bildtexte": ["Läuferin", "Tacho v"],
                   "knoepfe": [], "regler": [], "status": [], "ueberschrift": ""},
          "wagen": {"sim": "wagen", "bildtexte": ["der Wagen fährt", "Tacho v"],
                    "knoepfe": [], "regler": [], "status": [], "ueberschrift": ""},
          "stumm": {"sim": "stumm", "bildtexte": ["v in m/s", "t in s"],
                    "knoepfe": [], "regler": [], "status": [], "ueberschrift": ""}}

    def lauf(problem, sim, forschen=()):
        return pruefe([{"id": "t1", "problem": problem, "forschen": list(forschen),
                        "beobachtung": "", "tabRows": []}], fk, {"t1": sim})

    # 1. Einstieg laeuft, Bildschirm zeigt eine Laeuferin - einig.
    w, st, ei = lauf("Mira und Tobias vergleichen nach dem Lauftreff ihre App.", "lauf")
    if w or st or not ei:
        f.append(f"Laufen gegen Laeuferin nicht als einig erkannt: {w} {st} {ei}")

    # 2. DIE KAPUTTE PROBE dazu: Einstieg laeuft, Bildschirm fuehrt einen Wagen.
    #    Genau der Fall, den die Klasse gemeldet hat. MUSS auffallen.
    w, st, ei = lauf("Mira und Tobias vergleichen nach dem Lauftreff ihre App.", "wagen")
    if not w:
        f.append("Lauftreff gegen 'der Wagen fährt' blieb unbemerkt")

    # 3. Nennt die SEITE den Wagen, sind Seite und Simulation einig - der
    #    Einstieg erzaehlt dann nur die Vorgeschichte. Kein Mangel.
    w, st, ei = lauf("Mira und Tobias vergleichen nach dem Lauftreff ihre App.", "wagen",
                     ["Lass den Wagen fahren und stoppe fünfmal."])
    if w:
        f.append(f"Seite nennt den Wagen selbst, wurde aber gemeldet: {w}")

    # 4. Ein Bildschirm, der KEINEN Gegenstand nennt, passt zu jeder Geschichte.
    w, st, ei = lauf("Mira und Tobias vergleichen nach dem Lauftreff ihre App.", "stumm")
    if w or not st:
        f.append(f"Stummer Bildschirm falsch einsortiert: {w} {st}")

    # 5. Ein Einstieg OHNE Gegenstand wird gar nicht beurteilt.
    w, st, ei = lauf("Wie schnell ist schnell? Darüber streiten die beiden.", "wagen")
    if w or st or ei:
        f.append(f"Einstieg ohne Gegenstand haette nicht beurteilt werden duerfen: {w} {st} {ei}")

    # 6. GEGENPROBE zur Wortanfang-Regel: "automatisch" ist kein Auto.
    if "fahrzeug" in gruppen("Wer leiser singt, singt automatisch auch tiefer."):
        f.append("'automatisch' wurde als Fahrzeug gelesen")

    # 7. Und die andere Richtung: Zusammensetzungen MUESSEN zaehlen, sonst
    #    findet die Regel den Laufschuh nicht.
    if "mensch" not in gruppen("Tobias schnürt die Laufschuhe."):
        f.append("'Laufschuhe' wurde nicht als Mensch-Motiv erkannt")

    # 8. GEMESSENE FEHLFREUNDE, alle aus den Einstiegen der 19 Baende. Keiner
    #    davon ist ein laufender Mensch, und jeder hat den ersten Anlauf des
    #    Pruefers in die Irre gefuehrt.
    for satz in ("Der Motor läuft mit dem Akku, mit der kleinen Batterie nicht.",
                 "Nebenan im Waschraum läuft eine Waschmaschine.",
                 "Solange der Strahl von vorn kommt, läuft er schnurgerade hindurch.",
                 "Das Wasser läuft nur träge heraus.",
                 "Im Leitstand läuft eine Kurve über den Bildschirm.",
                 "Eine Anlage, die Holz verbrennt, hat viel Brennstoff.",
                 "Ihr Satellit braucht für einen Umlauf genau einen Tag."):
        if "mensch" in gruppen(satz):
            f.append(f"Fehlfreund als laufender Mensch gelesen: {satz[:40]}...")

    # 8b. Dieselbe Sorte bei den GEGENSTAENDEN, auch gemessen: "Radon" und
    #     "radioaktiv" sind kein Fahrrad, und "unter Zug eingespannt" ist keine
    #     Eisenbahn. Beide hatten je einen Widerspruch erfunden (kp7, ge7).
    for satz, g in (("Im Gestein steckt Radon, ein radioaktives Gas.", "rad"),
                    ("Der Draht ist unter Zug eingespannt.", "schiene"),
                    ("Die Zugkraft beträgt 20 N.", "schiene"),
                    ("Die Bahn ist zu Ende – die Fahrt beginnt erneut.", "schiene"),
                    ("Der Planet läuft auf einer Kreisbahn.", "schiene")):
        if g in gruppen(satz):
            f.append(f"Fehlfreund '{g}' gelesen in: {satz[:40]}...")

    # 9. Und die Gegenprobe: die NEUN Stellen, die wirklich ein Mensch sind,
    #    muessen erkannt werden - sonst waere die Person-Naehe zu eng.
    for satz in ("Mira und Tobias vergleichen nach dem Lauftreff ihre Lauf-App.",
                 "Auf dem Planetenweg laufen Mira und Tobias von der Sonne bis Neptun.",
                 "Ela trägt die Kiste zum dritten Stock im Laufschritt.",
                 "Näher kommt Ben ihm nicht, so weit er auch läuft.",
                 "Bei der Kostümprobe läuft Ela in Absatzschuhen über den Hof.",
                 "Ein Schwimmer stößt sich vom Beckenrand ab, ein Läufer vom Boden."):
        if "mensch" not in gruppen(satz):
            f.append(f"Laufender Mensch nicht erkannt: {satz[:40]}...")
    return f


def main():
    fehler = selbsttest()
    if fehler:
        print("SELBSTTEST NICHT BESTANDEN - der Pruefer darf nicht urteilen:")
        for z in fehler: print("  x", z)
        return 2
    if "--selbsttest" in sys.argv:
        print("Selbsttest bestanden (7 Proben).")
        return 0

    ziele = [a for a in sys.argv[1:] if not a.startswith("--")] or fz.BAENDER
    ges = collections.Counter()
    alle_w = []
    for b in ziele:
        q = os.path.join(WURZEL, b, "content", "forscherseiten.json")
        if not os.path.exists(q):
            q = os.path.join(WURZEL, b, "content", "foerderseiten.json")
        if not os.path.exists(q):
            continue
        seiten = json.load(open(q, encoding="utf-8"))
        if isinstance(seiten, dict): seiten = seiten.get("seiten", [])
        sv = fz.sim_von(b)
        fakten = {}
        for s in set(sv.values()):
            p = os.path.join(HIER, "fakten", s + ".json")
            if os.path.exists(p):
                fakten[s] = json.load(open(p, encoding="utf-8"))[0]
        w, st, ei = pruefe(seiten, fakten, sv)
        ges["widerspruch"] += len(w); ges["stumm"] += len(st); ges["einig"] += len(ei)
        for tid, sim, e, sch in w:
            alle_w.append((b, tid, sim, e, sch))
    print(f"{sum(ges.values())} Seiten mit einem Gegenstand im Einstieg: "
          f"{ges['einig']} einig · {ges['stumm']} stummer Bildschirm · "
          f"{ges['widerspruch']} ANSEHEN")
    for b, tid, sim, e, sch in alle_w:
        print(f"   {b:20s} {tid:6s} [{sim:22s}] Einstieg: {'/'.join(e):16s} "
              f"Bildschirm: {'/'.join(sch)}")
    return 1 if alle_w else 0


if __name__ == "__main__":
    sys.exit(main())
