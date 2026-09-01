# -*- coding: utf-8 -*-
"""Prueft eine neue Simulationsdatei, BEVOR sie in physics-sim.js wandert.

    python3 einbaupruefung.py <pfx> <datei.js> [<pfx> <datei.js> ...]

Geprueft wird:
  1. Kollidiert ein Bezeichner der obersten Ebene mit einem schon vorhandenen?
     (genau daran ist _par gescheitert: die Parallelschaltung hatte den Namen schon)
  2. Kollidiert ein DOM-Name (id="...") mit einem in physics-sim.js benutzten?
  3. Sind alle Pflichtfunktionen da?
  4. Haengt im Zeichnen wirklich etwas von der Zeit ab?
  5. Kommt "klicke" vor?
"""
import re, sys, os

ZIEL = 'physics-sim.js'
PFLICHT = ['Init', 'Update', 'Status', 'Draw', 'HTML']


def bezeichner(src):
    """Namen der obersten Ebene: let/const/var/function am Zeilenanfang."""
    return set(re.findall(r'^(?:let|const|var|function)\s+([A-Za-z_$][\w$]*)', src, re.M))


def dom_namen(src):
    return set(re.findall(r'id="([^"${}]+)"', src))


def _funktionsrumpf(src, name):
    """Rumpf einer Funktion durch Klammerzaehlung - unabhaengig von Zeilenumbruechen."""
    m = re.search(r'function\s+' + re.escape(name) + r'\s*\([^)]*\)\s*\{', src)
    if not m:
        return None
    i, t, n = m.end(), 1, len(src)
    while i < n and t > 0:
        c = src[i]
        if c in '"\'`':
            q = c; i += 1
            while i < n:
                if src[i] == '\\': i += 2; continue
                if src[i] == q: break
                i += 1
        elif c == '{': t += 1
        elif c == '}': t -= 1
        i += 1
    return src[m.end():i - 1]


def pruefe(pfx, datei, ziel_src, ziel_ids):
    src = open(datei, encoding='utf-8').read()
    name = os.path.basename(datei)
    f, h = [], []

    ziel_bez = bezeichner(ziel_src)
    for b in sorted(bezeichner(src)):
        if b in ziel_bez:
            f.append(f'Bezeichner „{b}“ ist in physics-sim.js schon vergeben')

    for d in sorted(dom_namen(src)):
        if d in ziel_ids:
            f.append(f'DOM-Name „{d}“ wird in physics-sim.js schon benutzt')

    for teil in PFLICHT:
        if f'function {pfx}{teil}(' not in src:
            f.append(f'Funktion {pfx}{teil}() fehlt')

    # Rumpf der Zeichenfunktion ueber Klammerzaehlung holen. Eine Regex auf '\n}'
    # findet einzeilige Funktionen NICHT und meldet den Stillstand dann nie.
    rumpf = _funktionsrumpf(src, pfx + 'Draw')
    upd = _funktionsrumpf(src, pfx + 'Update')
    if rumpf is None:
        f.append(f'Rumpf von {pfx}Draw() nicht gefunden')
    elif upd is None:
        f.append(f'Rumpf von {pfx}Update() nicht gefunden')
    else:
        # Welche Zustandsgroessen veraendert Update? Taucht eine davon im Zeichnen
        # auf, bewegt sich etwas. Nur nach ".t" zu suchen ist zu eng - die
        # Bewegung kann auch in .hub, .phi oder .stufe stecken.
        bewegt = set(re.findall(r'\.(\w+)\s*(?:\+=|-=|\*=|=[^=])', upd))
        bewegt |= set(re.findall(r'\b(\w+)\s*(?:\+=|-=)', upd))
        benutzt = {g for g in bewegt if re.search(r'[.\b]' + re.escape(g) + r'\b', rumpf)}
        if not benutzt and not re.search(r'\.t\b|_t\b|[Zz]eit', rumpf):
            # NUR ein Hinweis: Wird die Zeit in einer HILFSFUNKTION gelesen, die
            # Draw aufruft, sieht eine statische Pruefung das nicht. Entschieden
            # wird Regel R1 vom laufenden Rauchtest (Bild gegen Bild).
            h.append('Regel R1 statisch nicht belegt – der Rauchtest muss es zeigen '
                     f'(Update aendert {sorted(bewegt) or "nichts"})')

    if re.search(r'\bklick', src, re.I):
        f.append('das Wort „klicke“ kommt vor')

    # Praefix konsequent benutzt?
    fremd = {b for b in bezeichner(src) if not b.startswith(pfx) and not b.startswith(pfx.upper())}
    if fremd:
        f.append(f'Bezeichner ohne das Praefix {pfx}: {sorted(fremd)}')

    return name, f, h


def main():
    ziel_src = open(ZIEL, encoding='utf-8').read()
    ziel_ids = set(re.findall(r'id="([^"${}]+)"', ziel_src))
    paare = list(zip(sys.argv[1::2], sys.argv[2::2]))
    schlecht = 0
    for pfx, datei in paare:
        if not os.path.exists(datei):
            print(f'  ?  {datei} – noch nicht da'); continue
        name, f, h = pruefe(pfx, datei, ziel_src, ziel_ids)
        if f:
            schlecht += 1
            print(f'  ✗  {name}')
            for x in f: print(f'        {x}')
        else:
            print(f'  ✓  {name} – einbaufertig')
        for x in h: print(f'        · {x}')
    sys.exit(1 if schlecht else 0)


if __name__ == '__main__':
    main()
