# -*- coding: utf-8 -*-
"""Prueft, ob eine Heftseite nur verlangt, was ihre Simulation wirklich anzeigt.

    python3 simcheck/heft_gegen_sim.py <forscherseiten.json> <fakten.json> <plan.py>

Jede Zahl MIT EINHEIT, die in forschen, tabRows oder beobachtung steht, muss in
den Anzeigen, Bildtexten, Knopfaufschriften oder Reglerbereichen der zugehoerigen
Simulation vorkommen. Ein Wert, der im Heft steht und am Bildschirm fehlt, kostet
im Unterricht eine ganze Stunde.

Geeicht an den 47 abgenommenen Seiten von Klasse 10.
"""
import json, re, sys, importlib.util, collections

# Zahl mit Einheit: 3,5 cm | 40 °C | 1800 Zaehne | 26 000 Lichtjahre | 5 %
ZAHL = re.compile(r'(\d[\d\u00a0\u202f]*(?:\.\d{3})*(?:,\d+)?)(?!\.)\s*([°%]|[A-Za-zµΩ][A-Za-zäöüß/²³·]*)')

# Woerter, nach denen eine Zahl KEINE Messgroesse ist - sonst meldet der Pruefer
# jede Aufzaehlung ("3 Geraete", "zwei Schritte") als fehlenden Messwert.
# Positivliste statt Sperrliste: Nur wenn das Wort hinter der Zahl WIRKLICH eine
# Einheit ist, handelt es sich um einen Messwert. Sonst meldet der Pruefer jede
# Prosa-Zahl ("Radium-226 sind", "1,57 Neutronen je Proton", "104 statt 96").
EINHEITEN = {
    # Laenge, Flaeche, Volumen
    'm', 'cm', 'mm', 'km', 'nm', 'µm', 'dm', 'm²', 'cm²', 'mm²', 'm³', 'cm³', 'dm³', 'l', 'ml',
    # Zeit
    's', 'ms', 'min', 'h', 'a', 'Jahre', 'Jahren', 'Sekunden', 'Minuten', 'Stunden', 'Tage', 'Tagen',
    # Masse, Kraft, Druck
    'kg', 'g', 'mg', 't', 'N', 'kN', 'mN', 'µN', 'Pa', 'kPa', 'MPa', 'bar', 'mbar',
    # Energie, Leistung
    'J', 'kJ', 'MJ', 'Wh', 'kWh', 'W', 'kW', 'MW', 'GW', 'eV', 'keV', 'MeV', 'PS',
    # Elektrik, Magnetismus
    'V', 'mV', 'kV', 'MV', 'A', 'mA', 'kA', 'µA', 'Ω', 'kΩ', 'C', 'nC', 'µC', 'T', 'mT', 'µT',
    'Hz', 'kHz', 'MHz', 'F', 'µF', 'Wb',
    # Temperatur, Winkel, Anteil
    '°C', 'K', '°', '%',
    # Geschwindigkeit, Drehzahl
    'km/h', 'm/s', 'cm/s', 'mm/s', 'km/s', 'U/min', 'N/kg', 'kg/m³', 'g/cm³', 'm/s²',
    # Strahlung
    'Sv', 'mSv', 'µSv', 'Sv/h', 'mSv/h', 'µSv/h', 'Bq', 'kBq', 'Gy', 'mGy', 'u',
    # Astronomie
    'AE', 'pc', 'Parsec', 'Lichtjahre', 'Lichtjahren', 'Lj',
    # gezaehlte Groessen, die die Simulationen wirklich anzeigen
    'Impulse', 'Ionenpaare', 'Zähne', 'Windungen', 'Bildpunkte', 'Umdrehungen',
    'Büroklammern', 'Bogensekunden', 'Nanosekunden',
    # Oberstufe (Einfuehrungsphase). Ohne diese Zeile ueberspringt der Pruefer
    # jeden Impuls-, Winkel- und Drehwert STILLSCHWEIGEND und meldet trotzdem
    # "0 Werte ohne Entsprechung" - gefunden am 08.09.2026, als ein Gegenleser
    # testweise "p1 = 4444,5 kg·m/s" auf eine Seite schrieb und gruenes Licht bekam.
    'rad', 'rad/s', 'rad/s²', 'kg·m/s', 'N·s', 'N·m', 'N/m', 'N·m²/kg²',
    'm³/s²', 'J/kg', 'px', 'Pixel', 'Grad', 'Umläufe', 'Messwerte',
}

def wert(s):
    """Deutsche Zahl -> float. Punkt ist Tausendertrenner, Komma das Dezimalzeichen.
    Ein Zeichenvergleich reicht nicht: Die Seite schreibt 0,40 T, die Simulation
    0,4 T - dieselbe Groesse, und ein Textvergleich meldet sie faelschlich als
    fehlend. Verglichen wird deshalb der ZAHLENWERT."""
    t = s
    for leer in (' ', '\u00a0', '\u202f', '\u2009', '.'):
        t = t.replace(leer, '')
    t = t.replace(',', '.')
    try:
        return float(t)
    except ValueError:
        return None

def zahlen(text):
    raus = []
    for m in ZAHL.finditer(text or ''):
        z, e = m.group(1), m.group(2)
        if e not in EINHEITEN:
            continue
        v = wert(z)
        if v is not None:
            raus.append((v, e, m.group(0).strip()))
    return raus

def faktentext(f):
    teile = [f.get('ueberschrift', '')]
    teile += [r.get('beschriftung', '') + ' ' + ' '.join(
                 str(r['bereich'][k]) for k in ('min', 'max', 'step', 'start')
                 if r.get('bereich', {}).get(k) is not None)
              for r in f.get('regler', [])]
    teile += [k['aufschrift'] for k in f.get('knoepfe', [])]
    teile += [s['text'] for s in f.get('status', [])]
    teile += f.get('bildtexte', [])
    teile += f.get('hinweise', [])
    return ' '.join(teile)

def zwischenwerte(f):
    """Alle Zahlen, die die Simulation irgendwo zeigt - normalisiert."""
    t = faktentext(f)
    roh = set()
    for m in re.finditer(r'\d[\d\u00a0\u202f]*(?:\.\d{3})*(?:,\d+)?', t):
        v = wert(m.group(0))
        if v is not None:
            roh.add(v)
    # Simulationen schreiben teils DEZIMALPUNKT ("F_R=14.7N"), die Heftseite
    # nach Hausregel immer Komma ("14,7 N"). Die Regex oben liest den Punkt nur
    # als Tausendertrenner und macht aus 14.7 die Zahl 14 - der Prueferver misst
    # dann den belegten Wert als unbelegt. Gefunden am 08.09.2026 an ki12
    # (reibung), wo sechs richtige Werte als Fehler gemeldet wurden.
    # Punktzahlen sind mehrdeutig, deshalb kommen BEIDE Lesarten in die Menge:
    # zu streng waere hier schlimmer als zu grosszuegig - das Werkzeug soll
    # Erfundenes finden, nicht Schreibweisen bemaengeln.
    for m in re.finditer(r'\d+\.\d+', t):
        try:
            roh.add(round(float(m.group(0)), 6))          # englisch: 14.7 -> 14,7
        except ValueError:
            pass
    # Reglerbereiche: jeder ganzzahlige Schritt gilt als einstellbar
    for r in f.get('regler', []):
        b = r.get('bereich') or {}
        try:
            mn, mx, st = float(b['min']), float(b['max']), float(b.get('step') or 1)
        except (TypeError, ValueError, KeyError):
            continue
        if st <= 0 or (mx - mn) / st > 4000:
            continue
        x = mn
        while x <= mx + 1e-9:
            roh.add(round(x, 6))
            x += st
    return roh

def pruefe(seiten, fakten, sim_von):
    treffer = []
    for s in seiten:
        f = fakten.get(sim_von.get(s['id']))
        if not f:
            continue
        gezeigt = zwischenwerte(f)
        text = ' '.join(s.get('forschen', []) + s.get('tabRows', []) + [s.get('beobachtung', '')])
        for v, e, roh in zahlen(text):
            # gedeckt, wenn die Simulation denselben Wert zeigt - auf die Stellen
            # gerundet, mit denen er auf der Seite steht
            def gedeckt(v):
                for g in gezeigt:
                    if round(g, 6) == round(v, 6):
                        return True
                    # kleine ganzzahlige Vielfache: "nach 2 Halbwertszeiten sind
                    # 11 460 Jahre vergangen" - die Sim zeigt nur die 5730
                    if g > 0:
                        q = v / g
                        if 2 <= q <= 20 and abs(q - round(q)) < 1e-6:
                            return True
                return False
            if not gedeckt(v):
                treffer.append((s['id'], sim_von[s['id']], roh))
    return treffer

def selbsttest():
    """Ohne bestandenen Selbsttest darf das Werkzeug nicht urteilen.

    Der Anlass: Das Werkzeug meldete fuer eine Seite mit der frei erfundenen
    Zahl "p1 = 4444,5 kg·m/s" weiterhin "0 Werte ohne Entsprechung" - weil die
    Einheit nicht in EINHEITEN stand und der Wert deshalb gar nicht geprueft
    wurde. Ein Pruefer, der schweigt, weil er nichts sieht, ist schlimmer als
    keiner.
    """
    f = []
    fakten = {"probe": [{"sim": "probe",
                         "status": [{"einstellung": "Start",
                                     "text": "v = 4,00 m/s · p = 12,5 kg·m/s · omega = 9,4248 rad/s "
                                             "· F_R=14.7N · s=1.28m"}],
                         "bildtexte": ["s = 1,50 m"], "regler": [], "knoepfe": []}]}
    sim_von = {"t1": "probe"}

    def lauf(text):
        return pruefe([{"id": "t1", "forschen": [text], "tabRows": [], "beobachtung": ""}],
                      {k: v[0] for k, v in fakten.items()}, sim_von)

    # 1. GUTE Probe: alle drei Werte stehen so am Bildschirm - kein Befund.
    t = lauf("Lies v = 4,00 m/s, p = 12,5 kg·m/s und omega = 9,4248 rad/s ab.")
    if t:
        f.append(f"Gute Probe meldete {len(t)} Befunde: {t}")

    # 1b. Die Simulation schreibt Punkt, die Seite Komma - das ist KEIN Befund.
    t = lauf("Die Reibungskraft betraegt 14,7 N, der Weg 1,28 m.")
    if t:
        f.append(f"Punkt-gegen-Komma meldete faelschlich: {t}")

    # 2. KAPUTTE Proben: jede erfundene Zahl MUSS auffallen.
    for text, was in (("Lies p = 4444,5 kg·m/s ab.", "erfundener Impuls"),
                      ("Lies omega = 99,9 rad/s ab.", "erfundene Winkelgeschwindigkeit"),
                      ("Lies v = 4,44 m/s ab.", "erfundene Geschwindigkeit"),
                      ("Der Radius betraegt 777 px.", "erfundene Pixelzahl")):
        if not lauf(text):
            f.append(f"Kaputte Probe ({was}) blieb unbemerkt: {text}")
    return f


def main():
    _f = selbsttest()
    if _f:
        print('SELBSTTEST NICHT BESTANDEN - der Pruefer darf nicht urteilen:')
        for _z in _f: print('  x', _z)
        sys.exit(2)
    seiten = json.load(open(sys.argv[1], encoding='utf-8'))
    if isinstance(seiten, dict):
        seiten = seiten.get('seiten', [])
    fakten = {x['sim']: x for x in json.load(open(sys.argv[2], encoding='utf-8'))}
    spec = importlib.util.spec_from_file_location('plan_hgs', sys.argv[3])
    plan = importlib.util.module_from_spec(spec); spec.loader.exec_module(plan)
    kap = getattr(plan, 'ALLE_KAPITEL', None) or getattr(plan, 'KAPITEL', [])
    sim_von = {th['id']: th.get('sim') for k in kap for th in k['themen']}

    tr = pruefe(seiten, fakten, sim_von)
    print(f'{len(seiten)} Seiten geprueft · {len(tr)} Werte ohne Entsprechung am Bildschirm')
    nach = collections.defaultdict(list)
    for tid, sim, roh in tr:
        nach[(tid, sim)].append(roh)
    for (tid, sim), werte in sorted(nach.items()):
        print(f'   {tid:6s} [{sim}]  {", ".join(werte)}')
    sys.exit(1 if tr else 0)

if __name__ == '__main__':
    main()
