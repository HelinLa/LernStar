# -*- coding: utf-8 -*-
"""Nachbereitung frisch geschriebener Forscherseiten.

    python3 simcheck/seiten_nachbereiten.py <seiten.json> <plan.py> [<fakten.json>]

Drei Schritte:
 1. ANTWORTPOSITIONEN STREUEN. Beim Schreiben steht die richtige Vermutung immer
    an Stelle 2 - sonst muesste jede schreibende Instanz sich selbst mischen und
    das Ergebnis waere zufaellig schief. Hier wird je Kapitel gleichmaessig
    verteilt: abwechselnd Stelle 1 und Stelle 2, ohne lange Serien.
 2. FORMREGELN pruefen (arbeitsheft/formregeln.py).
 3. Ergebnis schreiben.

Der Abgleich gegen die Simulationen laeuft getrennt: simcheck/heft_gegen_sim.py
"""
import json, os, sys, importlib.util, collections

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)


def lade(pfad, name):
    spec = importlib.util.spec_from_file_location(name, pfad)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def streuen(seiten, kapitel_von):
    """Verteilt die richtige Vermutung gleichmaessig auf beide Stellen."""
    getauscht = 0
    nach = collections.defaultdict(list)
    for s in seiten:
        nach[kapitel_von.get(s['id'], '?')].append(s)
    for kap, gruppe in nach.items():
        for i, s in enumerate(gruppe):
            # Muster 0,1,1,0 wiederholt: haelftig verteilt, keine langen Serien
            ziel = [0, 1, 1, 0][i % 4]
            if s.get('predictOk') != ziel:
                s['predict'] = [s['predict'][1], s['predict'][0]]
                s['predictOk'] = ziel
                getauscht += 1
    return getauscht


KLASSE = None   # None = Regel ab Klasse 7 (42-59 Woerter); 5 = Erprobungsstufe (34-52)

def main():
    global KLASSE
    for a in list(sys.argv[1:]):
        if a.startswith('--klasse='):
            KLASSE = int(a.split('=')[1]); sys.argv.remove(a)
    quelle, planpfad = sys.argv[1], sys.argv[2]
    seiten = json.load(open(quelle, encoding='utf-8'))
    if isinstance(seiten, dict):
        seiten = seiten.get('seiten', seiten.get('korrigiert', []))
    plan = lade(planpfad, 'plan_nb')
    formregeln = lade(os.path.join(WURZEL, 'arbeitsheft', 'formregeln.py'), 'formregeln_nb')

    soll = [th['id'] for th in plan.THEMEN]
    da = {s['id'] for s in seiten}
    fehlt = [i for i in soll if i not in da]
    zuviel = [i for i in da if i not in soll]
    if fehlt:
        print(f'!! Es fehlen {len(fehlt)} Seiten: {fehlt}')
    if zuviel:
        print(f'!! Unbekannte Kennungen: {zuviel}')

    seiten = sorted((s for s in seiten if s['id'] in soll), key=lambda s: soll.index(s['id']))
    n = streuen(seiten, plan.KAPITEL_VON)
    print(f'{len(seiten)} Seiten · {n} Vermutungspaare getauscht')

    verteilung = collections.Counter((plan.KAPITEL_VON.get(s['id']), s['predictOk']) for s in seiten)
    for kap in sorted({k for k, _ in verteilung}):
        a, b = verteilung[(kap, 0)], verteilung[(kap, 1)]
        print(f'   {kap}: richtige Vermutung {a}x an Stelle 1, {b}x an Stelle 2')

    fehler = []
    for s in seiten:
        fehler += [f"{t[0]}: [{t[1]}] {t[2]}" for t in formregeln.pruefe_seite(s, klasse=KLASSE)]
    fehler += [f"{t[0]}: [{t[1]}] {t[2]}" for t in
               formregeln.pruefe_verteilung(seiten, plan.KAPITEL_VON)]
    print(f'{len(fehler)} Beanstandungen der Formregeln')
    for f in fehler:
        print('   ', f)

    json.dump(seiten, open(quelle, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('geschrieben:', quelle)
    sys.exit(1 if (fehler or fehlt or zuviel) else 0)


if __name__ == '__main__':
    main()
