# -*- coding: utf-8 -*-
"""Baut neue Simulationen in physics-sim.js ein.

    python3 einbau.py <registry.txt> <impl1.js> [impl2.js ...]

Der Registry-Eintrag wird VOR die schliessende Klammer von _physSimDefs gesetzt -
die wird durch Klammerzaehlung gefunden, nicht durch Suche nach '};': das erste
'};' nach dem Objektanfang gehoert einem verschachtelten Objekt.
Die Implementierungen kommen ans Dateiende.
"""
import re, sys, shutil, os

ZIEL = 'physics-sim.js'

def registry_ende(s):
    m = re.search(r'const\s+_physSimDefs\s*=\s*\{', s)
    if not m: sys.exit('_physSimDefs nicht gefunden')
    i, t, n = m.end(), 1, len(s)
    while i < n and t > 0:
        c = s[i]
        if c in '"\'`':
            q = c; i += 1
            while i < n:
                if s[i] == '\\': i += 2; continue
                if s[i] == q: break
                i += 1
            i += 1; continue
        if c == '/' and s[i+1:i+2] == '/': i = s.find('\n', i); i = n if i < 0 else i; continue
        if c == '/' and s[i+1:i+2] == '*': j = s.find('*/', i+2); i = n if j < 0 else j+2; continue
        if c in '{[(': t += 1
        elif c in '}])': t -= 1
        i += 1
    return s.rfind('\n', 0, s.rfind('}', 0, i))

def main():
    reg, impls = sys.argv[1], sys.argv[2:]
    s = open(ZIEL, encoding='utf-8').read()
    shutil.copy(ZIEL, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'physics-sim.vorher.js'))
    e = registry_ende(s)
    s = s[:e] + '\n' + open(reg, encoding='utf-8').read().rstrip('\n') + s[e:]
    for f in impls:
        s += open(f, encoding='utf-8').read()
    open(ZIEL, 'w', encoding='utf-8').write(s)
    print(f'eingebaut: {len(impls)} Implementierungen, {s.count(chr(10))+1} Zeilen')

if __name__ == '__main__':
    main()
