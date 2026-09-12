# -*- coding: utf-8 -*-
"""Konvertiert die Magnetismus-Daten aus build_final in das Buch-Format (FSD/UEBD/ASMT)."""
import json, importlib.util, os
HERE=os.path.dirname(os.path.abspath(__file__))
# build_final als Modul laden (ohne __main__)
spec=importlib.util.spec_from_file_location("bf",os.path.join(HERE,"build_final.py"))
bf=importlib.util.module_from_spec(spec); spec.loader.exec_module(bf)

# Reihenfolge + Buch-Topic-IDs
ORDER=["magnete-felder","magnet-stoffe","magnetpole","magnetfeld","kompass"]
TID={"magnete-felder":"m1","magnet-stoffe":"m2","magnetpole":"m3","magnetfeld":"m4","kompass":"m5"}
NAME={"magnete-felder":"Magnete und magnetische Felder","magnet-stoffe":"Welche Stoffe zieht ein Magnet an?",
 "magnetpole":"Wie wirken Magnetpole aufeinander?","magnetfeld":"Wie sieht ein Magnetfeld aus?","kompass":"Wie funktioniert ein Kompass?"}
# Merksatz-Lösungen (die Lücke) je (pre,suf)
MITLOES={"magnete-felder":["Magnetfeld","Berührung"],"magnet-stoffe":["Kobalt","magnetisch"],
 "magnetpole":["stoßen","ziehen"],"magnetfeld":["Süden","stark"],"kompass":["Magnet","Erdmagnetfeld"]}
# Aufgabe je Thema (offen, mit Musterlösung)
AUFG={
 "magnete-felder":("Erkläre mit dem Wort Magnetfeld, warum ein Magnet wirkt, ohne den Gegenstand zu berühren.",3,
   "Um jeden Magneten liegt ein Magnetfeld. Dieses unsichtbare Feld wirkt auch durch Luft und zieht das Eisen an, ohne es zu berühren."),
 "magnet-stoffe":("Nenne zwei Dinge, die ein Magnet anzieht, und zwei, die er nicht anzieht.",3,
   "Anziehen: Eisennagel und Büroklammer (aus Eisen/Stahl). Nicht anziehen: Aludose und Holzklotz, weil sie nicht magnetisch sind."),
 "magnetpole":("Erkläre, wann sich zwei Magnete anziehen und wann sie sich abstoßen.",3,
   "Ungleiche Pole (Nord und Süd) ziehen sich an. Gleiche Pole (Nord und Nord oder Süd und Süd) stoßen sich ab."),
 "magnetfeld":("Beschreibe mit Worten, wie die Feldlinien um einen Stabmagneten verlaufen.",3,
   "Die Feldlinien gehen außen vom Nordpol zum Südpol. An den Polen liegen sie eng zusammen, dort ist das Feld am stärksten."),
 "kompass":("Erkläre, warum die Kompassnadel nach Norden zeigt. Nutze die Wörter Magnet und Erdmagnetfeld.",3,
   "Die Kompassnadel ist ein kleiner Magnet. Die Erde ist auch ein großer Magnet mit einem Erdmagnetfeld. Darum dreht sich die Nadel und zeigt nach Norden."),
}

fsd=[]; uebd=[]
for tk in ORDER:
    o=next(x for x in bf.FK if x["id"]==tk); cfg=bf.CFG[tk]; kid=bf.KID[tk]; ub=bf.UEB_DATA[tk]
    cols,rows=cfg["tab"]
    mer=[{"pre":p,"post":s,"loesung":l} for (p,s),l in zip(cfg["mit"],MITLOES[tk])]
    af,az,al=AUFG[tk]
    fsd.append({"theme":"magnetismus","id":TID[tk],"name":NAME[tk],
      "problem":kid["problem"],"frage":kid["frage"],"predict":kid["options"],
      "forschen":cfg["f"],"tabCols":list(cols),"tabRows":list(rows),
      "merksatz":mer,"aufgabe":{"frage":af,"zeilen":az,"loesung":al}})
    op=ub["offen"]
    uebd.append({"theme":"magnetismus","id":TID[tk],
      "lueckensaetze":[{"pre":p,"post":s,"loesung":l} for (p,s,l) in ub["lueck"]],
      "richtigfalsch":[{"aussage":a,"stimmt":b} for (a,b) in ub["rf"]],
      "mc":{"frage":ub["mc"][0],"optionen":list(ub["mc"][1]),"richtig":ub["mc"][2]},
      "offen":{"prompt":op[0],"zeilen":op[1],"loesung":op[2]}})

# Assessment
clues=[{"wort":w,"tipp":t} for (w,t) in bf.RAETSEL]
prep={"kannIch":bf.PREP["kannIch"],"tipps":bf.PREP["tipps"],
      "mini":[{"frage":q,"loesung":l} for (q,l) in bf.PREP["mini"]]}
T=bf.TEST
test={"a1":[{"pre":p,"post":s,"loesung":l} for (p,s,l) in T["a1"]],
 "a2":[{"aussage":"Ein Magnet zieht Eisen an.","stimmt":True},
       {"aussage":"Ein Magnet zieht auch Aluminium an.","stimmt":False},
       {"aussage":"Gleiche Pole stoßen sich ab.","stimmt":True},
       {"aussage":"Ungleiche Pole stoßen sich ab.","stimmt":False},
       {"aussage":"Um jeden Magneten liegt ein Magnetfeld.","stimmt":True},
       {"aussage":"Die Kompassnadel zeigt nach Süden.","stimmt":False}],
 "mc":{"frage":T["a5"][0],"optionen":list(T["a5"][1]),"richtig":T["a5"][2]},
 "offen":{"frage":T["a6"][0],"zeilen":T["a6"][1],"loesung":T["a6"][2]},
 "transfer":{"frage":T["a7"][0],"zeilen":T["a7"][1],"loesung":T["a7"][2]}}
asmt={"id":"magnetismus","clues":{"hinweise":clues},"prep":prep,"test":test}

json.dump(fsd,open(os.path.join(HERE,"content","magnet_fs.json"),"w"),ensure_ascii=False,indent=0)
json.dump(uebd,open(os.path.join(HERE,"content","magnet_ueb.json"),"w"),ensure_ascii=False,indent=0)
json.dump(asmt,open(os.path.join(HERE,"content","magnet_asmt.json"),"w"),ensure_ascii=False,indent=0)
print("magnet content geschrieben:",[x["id"] for x in fsd],"| clues",len(clues),"| test a2",len(test["a2"]))
