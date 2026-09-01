# -*- coding: utf-8 -*-
"""Haelt die Protokoll-Liste in js/sim-lader.js mit physics-sim.js gleich.

    python3 simcheck/protokollliste.py            # nur pruefen
    python3 simcheck/protokollliste.py --richten   # Liste neu schreiben

WARUM ES SIE GIBT: app.js zeichnet den Knopf "Protokoll" nur, wenn
_physHatArbeitsblatt(exp) wahr ist. Diese Funktion lebt in physics-sim.js, die
seit dem Umbau erst im Leerlauf nachgeladen wird - beim ersten Zeichnen einer
Fachseite war sie deshalb immer weg. js/sim-lader.js traegt die Kennungen jetzt
selbst. Damit die Liste nicht veraltet, sobald jemand ein Protokoll ergaenzt,
vergleicht dieser Durchgang sie mit der Quelle.
"""
import json, os, re, subprocess, sys, tempfile

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)


def aus_physics_sim():
    """Die Schluessel von _physAbDefs - ausgewertet, nicht per Muster geraten."""
    js = r'''
const fs=require("fs"), vm=require("vm");
const noop=()=>{};
const el=()=>({style:{},classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},
 appendChild:noop,append:noop,prepend:noop,setAttribute:noop,getAttribute:()=>null,
 addEventListener:noop,removeEventListener:noop,querySelector:()=>null,querySelectorAll:()=>[],
 getContext:()=>null,innerHTML:"",textContent:"",after:noop,firstElementChild:null,remove:noop,dataset:{}});
const doc={createElement:el,getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],
 addEventListener:noop,removeEventListener:noop,head:el(),body:el(),documentElement:el(),
 dispatchEvent:noop,createTextNode:()=>el()};
const ctx={console:{log:noop,warn:noop,error:noop},document:doc,navigator:{userAgent:"node"},
 location:{hash:"",href:""},setTimeout,clearTimeout,setInterval,clearInterval,
 requestAnimationFrame:noop,cancelAnimationFrame:noop,CustomEvent:function(){},Event:function(){},
 localStorage:{getItem:()=>null,setItem:noop},matchMedia:()=>({matches:false,addEventListener:noop}),
 devicePixelRatio:1,Image:function(){},requestIdleCallback:noop,alert:noop,fetch:()=>Promise.reject()};
ctx.window=ctx; ctx.self=ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[2],"utf8")+"\n;globalThis.__ab=_physAbDefs;",ctx);
process.stdout.write(JSON.stringify(Object.keys(ctx.__ab).sort()));
'''
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(js); pfad = f.name
    try:
        r = subprocess.run(['node', pfad, os.path.join(WURZEL, 'physics-sim.js')],
                           capture_output=True, text=True, timeout=180)
        if r.returncode:
            raise SystemExit('physics-sim.js liess sich nicht auswerten:\n' + r.stderr[-600:])
        return json.loads(r.stdout)
    finally:
        os.unlink(pfad)


def aus_lader():
    s = open(os.path.join(WURZEL, 'js', 'sim-lader.js'), encoding='utf-8').read()
    m = re.search(r'const PROTOKOLLE = new Set\(\[(.*?)\]\);', s, re.S)
    if not m:
        raise SystemExit('In js/sim-lader.js steht keine PROTOKOLLE-Liste.')
    return sorted(re.findall(r"'([^']+)'", m.group(1)))


def schreiben(keys):
    p = os.path.join(WURZEL, 'js', 'sim-lader.js')
    s = open(p, encoding='utf-8').read()
    zeilen, zeile = [], '    '
    for k in keys:
        st = f"'{k}',"
        if len(zeile) + len(st) > 94:
            zeilen.append(zeile.rstrip()); zeile = '    '
        zeile += st + ' '
    if zeile.strip():
        zeilen.append(zeile.rstrip().rstrip(','))
    neu = 'const PROTOKOLLE = new Set([\n' + '\n'.join(zeilen) + '\n  ]);'
    s = re.sub(r'const PROTOKOLLE = new Set\(\[.*?\]\);', neu, s, flags=re.S)
    open(p, 'w', encoding='utf-8').write(s)


def main():
    quelle, liste = aus_physics_sim(), aus_lader()
    fehlt = [k for k in quelle if k not in liste]
    zuviel = [k for k in liste if k not in quelle]
    if not fehlt and not zuviel:
        print(f'js/sim-lader.js stimmt mit physics-sim.js ueberein ({len(quelle)} Protokolle)')
        return 0
    print(f'ABWEICHUNG: {len(fehlt)} fehlen in js/sim-lader.js, {len(zuviel)} stehen zu viel drin')
    for k in fehlt[:20]:  print('   fehlt: ', k)
    for k in zuviel[:20]: print('   zuviel:', k)
    if '--richten' in sys.argv:
        schreiben(quelle)
        print('js/sim-lader.js neu geschrieben. Danach ?v= in index.html hochzaehlen.')
        return 0
    print('Mit --richten neu schreiben lassen.')
    return 1


if __name__ == '__main__':
    sys.exit(main())
