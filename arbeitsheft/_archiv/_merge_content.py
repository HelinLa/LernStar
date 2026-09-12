# -*- coding: utf-8 -*-
"""Einmalig: Magnetismus-Inhalt in die 3 Haupt-JSONs einschmelzen + Umlaut-Titel fest backen.
Danach braucht build_book keine Sonderfaelle und kein TITLES-Override mehr."""
import json, os, shutil
HERE=os.path.dirname(os.path.abspath(__file__)); C=os.path.join(HERE,"content")
def load(n): return json.load(open(os.path.join(C,n),encoding="utf-8"))
def dump(o,n): json.dump(o,open(os.path.join(C,n),"w"),ensure_ascii=False,indent=0)

# Backup der Originale (falls wir zurueck wollen)
bak=os.path.join(C,"_pre_merge"); os.makedirs(bak,exist_ok=True)
for n in ("forscherseiten.json","uebungen.json","assessment.json"):
    shutil.copy(os.path.join(C,n),os.path.join(bak,n))

TITLES={
 "l1":"Lichtquellen und Lichtausbreitung","l2":"Wie können wir einen Gegenstand sehen?",
 "l3":"Wie entsteht ein Schatten?","l4":"Wovon hängt die Größe des Schattens ab?","l5":"Kern- und Halbschatten",
 "s1":"Stromkreis und Schaltzeichen","s2":"Wann leuchtet eine Lampe?","s3":"Welche Stoffe leiten Strom?",
 "s4":"Reihenschaltung","s5":"Parallelschaltung",
 "w1":"Sind Temperatur und Wärme das Gleiche?","w2":"Wie funktioniert ein Thermometer?",
 "w3":"Was geschieht beim Erwärmen von Stoffen?","w4":"Wie verändern sich Aggregatzustände?","w5":"Wie wird Wärme übertragen?",
 "sc1":"Wie entsteht ein Ton?","sc2":"Wovon hängt die Lautstärke ab?","sc3":"Wovon hängt die Tonhöhe ab?",
 "sc4":"Wie breitet sich Schall aus?","sc5":"Wie funktioniert das Ohr?",
 "h1":"Wie entstehen Tag und Nacht?","h2":"Wie entstehen die Jahreszeiten?",
 "h3":"Warum verändert der Mond sein Aussehen?","h4":"Wie entsteht eine Sonnenfinsternis?","h5":"Wie entsteht eine Mondfinsternis?",
}

# --- Forscherseiten: Magnetismus voranstellen, Titel backen ---
fs=load("forscherseiten.json"); mfs=load("magnet_fs.json")
for o in fs:
    if o["id"] in TITLES: o["name"]=TITLES[o["id"]]
fs_new=mfs+fs
dump(fs_new,"forscherseiten.json")

# --- Uebungen ---
ub=load("uebungen.json"); mub=load("magnet_ueb.json")
dump(mub+ub,"uebungen.json")

# --- Assessment (Liste von Themen-Objekten) + Magnet-Objekt anhaengen ---
asm=load("assessment.json"); masm=load("magnet_asmt.json")
ids={o["id"] for o in asm}
if masm["id"] not in ids: asm=[masm]+asm
dump(asm,"assessment.json")

print("MERGE ok | forscherseiten:",len(fs_new),"| uebungen:",len(mub+ub),"| assessment:",len(asm))
print("ids fs:",[o["id"] for o in fs_new])
