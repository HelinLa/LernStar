# -*- coding: utf-8 -*-
"""Komplettes Magnetismus-Arbeitsheft (Canva-Stil, alle 5 Forscherkreise) als PDF.
Mehrseitig mit automatischem Seitenumbruch + einfachem HTML-Rich-Text."""
import os, json, math, re, random
import numpy as np
from html.parser import HTMLParser

_EMOJI=re.compile(
 "[\U0001F000-\U0001FAFF\U00002600-\U000026FF\U00002700-\U000027BF"
 "︀-️\U0001F1E6-\U0001F1FF⬀-⯿←-⇿]+")
def strip_emoji(s):
    if not isinstance(s,str): return s
    s = re.sub(r"\s*[←-⇿⟰-⟿⤀-⥿]\s*", " » ", s)  # Pfeile -> »
    return re.sub(r"  +"," ", _EMOJI.sub("", s)).strip()
from PIL import Image, ImageDraw, ImageFont

HERE=os.path.dirname(__file__); IMG=os.path.join(HERE,"img")
S=2; DPI=int(os.environ.get("HEFT_DPI","150")); W,H=1240,1754
ML,MR=96,96; MT,MB=110,86
CREAM="#FAF6EC"; INK="#20293B"; SUB="#6B7488"
WHITE="#FFFFFF"; CARDLINE="#EBE4D4"; SHADOW="#E4E3EE"; NAVY="#20304A"
# Gold + Navy (Design)
GOLD="#B99530"; GOLD_L="#E0C67C"; GOLD_D="#846313"; NAVYBG="#1B2A47"; NAVYD="#2A3A5C"; GOLDBG="#FBF4DE"; GOLDLINE="#E7D8A6"
# gedämpfte, tonale Themen-Akzente
T_TEAL="#2F6E6A"; T_RUST="#B0604A"; T_PLUM="#6E5480"; T_SLATE="#3E5A7A"; T_BRONZE="#8A7340"
TOPIC_COLORS=[T_TEAL,T_RUST,T_PLUM,T_SLATE,T_BRONZE]
# alte Namen auf die neue, gedämpfte Welt umgelenkt (bestehender Code passt weiter)
CORAL=T_RUST; TEAL=T_TEAL; PURPLE=T_PLUM; SKYB=T_SLATE; TEAL_D="#245652"; AMBER=GOLD_D; YELLOW=GOLD_L
MINT="#EAF2F0"; SKY="#EAF0F6"; PEACH="#F6EEE9"; LILAC="#F1EDF3"; AMBERB=GOLDBG

# Illustrationen je Thema: (Dateiname, Breite, Bildunterschrift)
FIG_CONCEPT={
 "magnete-felder":("barmagnet",470,"Ein Stabmagnet hat zwei Pole: Nordpol (rot) und Südpol (blau)."),
 "magnet-stoffe":("attract",510,"Magnete ziehen Eisen an – Holz, Kunststoff und Alu nicht."),
 "magnetpole":("poles",480,"Gleiche Pole stoßen sich ab, verschiedene Pole ziehen sich an."),
 "magnetfeld":("fieldlines",450,"Der unsichtbare Raum um den Magneten wird durch Feldlinien dargestellt."),
 "kompass":("compass",300,"Die Kompassnadel ist selbst ein kleiner Magnet und zeigt nach Norden."),
 "elektromagnet":("electromagnet",530,"Fließt Strom durch die Spule, wird der Eisenkern magnetisch."),
}
# je Thema eine Liste von Alltagsbildern
FIG_ALLTAG={
 "magnete-felder":[("fridge",250,"Kühlschrankmagnete halten Zettel an der Metalltür.")],
 "magnet-stoffe":[("crane",300,"Ein Magnetkran hebt und sortiert Eisenschrott.")],
 "magnetpole":[("closure",300,"Magnetknopf: Nord- und Südpol ziehen sich an und halten die Tasche zu.")],
 "magnetfeld":[("filings",440,"Streust du Eisenspäne auf Papier über einen Magneten, wird das Feld sichtbar.")],
 "kompass":[("hiking",380,"Beim Wandern zeigt der Kompass zuverlässig nach Norden.")],
 "elektromagnet":[("bell",340,"Elektrische Klingel/Türöffner: Bei Stromfluss zieht der Elektromagnet den Anker – ohne Strom lässt er los."),
                  ("maglev",390,"Magnetschwebebahn: starke schaltbare Magnete heben und schieben den Zug.")],
}

# Schritt 6 "Anwenden im Alltag": Bildergalerie (statt Fließtext) je Thema
ANWENDEN={
 "magnete-felder":[("fridge","Kühlschrankmagnet"),("u_fishing","Angelspiel"),("u_letters","Magnetbuchstaben"),
                   ("u_knife","Messerleiste"),("u_board","Magnettafel"),("compass","Kompass")],
 "magnet-stoffe":[("crane","Schrott-Kran"),("fridge","Kühlschranktür (Stahl)"),("u_screwdriver","Schraubendreher")],
 "magnetpole":[("closure","Taschenverschluss"),("u_tiles","Magnet-Bausteine"),("maglev","Magnetschwebebahn")],
 "magnetfeld":[("u_mrt","MRT im Krankenhaus"),("fridge","Kühlschrankmagnet"),("compass","Kompass")],
 "kompass":[("hiking","Wandern"),("u_ship","Seefahrt"),("u_birds","Zugvögel")],
}
# Schritt 5 "Aufgaben": konkrete Arbeitsblatt-Aufgaben (Tabelle, Pole zeichnen, Bild-Frage, Behauptung, Versuch)
TASKS={
 "magnete-felder":[
  {"t":"image","fig":"nailpoles","w":300,"p":"Eine Büroklammer wird an verschiedene Stellen eines Magneten gehalten. An welchen Stellen bleibt sie am besten hängen? Beschreibe deine Beobachtung."},
  {"t":"image","fig":"barmagnet","w":300,"p":"Ein Magnet hat zwei besondere Stellen, die Pole. Schau das Bild an: Wie heißen die beiden Enden, welche Farbe haben sie – und wie kannst du dir merken, welche Farbe zu welchem Ende gehört?"},
  {"t":"claim","name":"Mia","claim":"Ein Magnet wirkt erst, wenn er etwas berührt.","p":"Stimmst du ihr zu? Begründe deine Meinung.","n":2},
 ],
 "magnet-stoffe":[
  {"t":"gallery","p":"Schau dir die Gegenstände an. Schreibe unter jeden, ob der Magnet ihn anzieht – ja oder nein.","items":[
    ("o_nail","Eisennagel"),("o_clip","Büroklammer"),("o_key","Schlüssel"),
    ("o_can","Aludose"),("o_wood","Holzklotz"),("o_glass","Glasmurmel")]},
  {"t":"table","p":"Prüfe die Gegenstände mit einem Magneten und ordne sie in die Tabelle ein.","cols":["Magnetisch (wird angezogen)","Nicht magnetisch"],"rows":5},
  {"t":"image","fig":"coin","w":150,"p":"Eine 1-Cent-Münze hat eine Oberfläche aus Kupfer – und Kupfer ist nicht magnetisch. Trotzdem bleibt die Münze an einem Magneten hängen. Erkläre, wie das sein kann."},
  {"t":"claim","name":"Lukas","claim":"Ein Magnet zieht alle Metalle an.","p":"Stimmst du ihm zu? Begründe deine Meinung.","n":2},
 ],
 "magnetpole":[
  {"t":"draw","p":"Die beiden Magnete sollen sich anziehen. Trage die Pole (N und S) ein und male sie farbig an – Nordpol rot, Südpol blau."},
  {"t":"draw","p":"Jetzt sollen sich die beiden Magnete abstoßen. Trage die Pole ein und male sie wieder farbig an."},
  {"t":"lines","p":"Formuliere eine allgemeine Regel: Wann ziehen sich zwei Magnete an, und wann stoßen sie sich ab?","n":2},
  {"t":"exp","name":"Stefan","claim":"Je größer der Magnet, desto größer ist seine Anziehungskraft.","p":"Beschreibe einen Versuch, mit dem du prüfen kannst, ob das stimmt.","n":4},
 ],
 "magnetfeld":[
  {"t":"drawbox","p":"Zeichne einen Stabmagneten mit Nordpol und Südpol. Trage vier Feldlinien mit Pfeilen ein (außen von N nach S). Zeichne sie an den Polen dicht, weiter weg weiter auseinander.","h":220},
  {"t":"image","fig":"filings","w":300,"p":"Streut man Eisenspäne auf ein Blatt über einem Magneten, ordnen sie sich zu Bögen. Was zeigen diese Bögen – und was zeigen sie nicht?"},
  {"t":"claim","name":"Ein Mitschüler","claim":"Zwischen den Feldlinien ist nichts.","p":"Stimmt das? Begründe deine Antwort mit deiner Beobachtung.","n":2},
 ],
 "kompass":[
  {"t":"lines","p":"Erkläre mit eigenen Worten, warum die Kompassnadel nach Norden zeigt. Nutze die Wörter: kleiner Magnet, Erdmagnetfeld, ausrichten.","n":3},
  {"t":"exp","name":"Lena","claim":"Der Kompass zeigt zur Sonne.","p":"Plane einen Versuch, mit dem du das prüfst. Was würdest du beobachten, wenn Lena sich irrt?","n":3},
 ],
}

# ---- Wiederholung: Wortgitter (eigene Begriffe) ----
WS_WORDS=["MAGNET","NORDPOL","SUEDPOL","EISEN","KOMPASS","POLE","ANZIEHEN",
          "ABSTOSSEN","FELDLINIE","NICKEL","MAGNETFELD","KRAFT"]
# ---- Kreuzworträtsel: waagerechte Antworten, Lösungswort in der Gold-Spalte (senkrecht) ----
CROSSWORD={"loesung":"NORDPOL","col":5,"rows":[
  ("Zieht Eisen an","MAGNET",3),
  ("Zeigt immer nach Norden","KOMPASS",1),
  ("Anziehung und Abstoßung sind eine …","KRAFT",1),
  ("Der drehbare Zeiger im Kompass","NADEL",2),
  ("Die beiden Enden eines Magneten (Mehrzahl)","POLE",0),
  ("Magnetisches Metall neben Eisen und Nickel","KOBALT",1),
  ("Magnetisches Silbermetall","NICKEL",5),
]}
# ---- Bereite dich auf den Test vor: Lernziel-Checkliste + Fachwörter ----
TESTPREP=[
  "Ich kann die beiden Pole eines Magneten benennen (Nordpol, Südpol).",
  "Ich kann sagen, welche Stoffe ein Magnet anzieht – und welche nicht.",
  "Ich kann erklären, warum „Metall“ nicht dasselbe ist wie „magnetisch“.",
  "Ich kann die Polregel anwenden: gleiche Pole stoßen sich ab, ungleiche ziehen sich an.",
  "Ich kann das Magnetfeld mit Feldlinien zeichnen (außen von Nord nach Süd).",
  "Ich kann erklären, dass das Feld auch ohne Berührung wirkt (Fernwirkung).",
  "Ich kann erklären, wie ein Kompass funktioniert und warum er nach Norden zeigt.",
  "Ich kann Magnete an Beispielen aus dem Alltag wiedererkennen.",
]
TESTPREP_WORTE=["Magnet","Nordpol","Südpol","Pol","Magnetfeld","Feldlinie","magnetisch",
                "Eisen · Nickel · Kobalt","Kompass","Erdmagnetfeld","anziehen · abstoßen"]
# ---- Schriftlicher Test (eigene Aufgaben) ----
TEST=[
  {"p":"Ein Magnet hat zwei besondere Stellen. Wie heißen sie? Schreibe beide auf.","pts":2,"lines":1},
  {"p":"Kreuze an: Welche Gegenstände zieht ein Magnet an?","pts":3,"opts":["Eisennagel","Aludose","Büroklammer aus Stahl","Holzstab","Kupferdraht","Schere (Stahl)"]},
  {"p":"Ergänze die Polregel: Gleiche Pole ______ sich ab, ungleiche Pole ______ sich an.","pts":2,"lines":1},
  {"p":"Zeichne einen Stabmagneten mit Nord- und Südpol und trage vier Feldlinien mit Pfeilen ein (außen von N nach S).","pts":3,"drawbox":170},
  {"p":"Erkläre in ein bis zwei Sätzen, warum eine Kompassnadel nach Norden zeigt.","pts":2,"lines":3},
  {"p":"Lisa sagt: „Ein Magnet zieht alle Metalle an.“ Hat sie recht? Begründe.","pts":2,"lines":2},
  {"p":"Nenne zwei Geräte oder Dinge aus dem Alltag, in denen ein Magnet steckt.","pts":2,"lines":2},
]
TEST_PTS=sum(q["pts"] for q in TEST)

def _ws_gen(words,size,seed):
    random.seed(seed); g=[[None]*size for _ in range(size)]
    dirs=[(1,0),(0,1),(1,1),(1,-1)]
    for w in sorted(words,key=len,reverse=True):
        for _ in range(600):
            dx,dy=random.choice(dirs); L=len(w)
            x0=random.randrange(size); y0=random.randrange(size)
            if not(0<=x0+dx*(L-1)<size and 0<=y0+dy*(L-1)<size): continue
            if all(g[y0+dy*i][x0+dx*i] in (None,w[i]) for i in range(L)):
                for i in range(L): g[y0+dy*i][x0+dx*i]=w[i]
                break
    A="ABCDEFGHIKLMNOPRSTUZ"
    for y in range(size):
        for x in range(size):
            if g[y][x] is None: g[y][x]=random.choice(A)
    return g

def PX(pt): return max(1,int(round(pt*DPI/72*S)))
def sc(v): return int(round(v*S))
_fc={}; _FSF="/System/Library/Fonts/Supplemental/"
def _FF(name,pt,idx=0):
    k=(name,pt,idx)
    if k not in _fc: _fc[k]=ImageFont.truetype(_FSF+name,PX(pt),index=idx)
    return _fc[k]
def RND(pt): return _FF("Optima.ttc",pt,1)      # Optima Bold – Überschriften/Labels/Badges
def OPT(pt): return _FF("Optima.ttc",pt,0)      # Optima Regular
def DIDOT(pt): return _FF("Didot.ttc",pt,0)     # große Titel
def COP(pt): return _FF("Copperplate.ttc",pt,0) # Kapitälchen-Eyebrows
def BODY(pt): return _FF("Avenir Next.ttc",pt,7)  # Regular
def BODYB(pt): return _FF("Avenir Next.ttc",pt,2) # Demi Bold

def rrect(d,x0,y0,x1,y1,r,fill=None,outline=None,w=0):
    d.rounded_rectangle([sc(x0),sc(y0),sc(x1),sc(y1)],radius=sc(r),fill=fill,outline=outline,width=(sc(w) if w else 0))
def circle(d,cx,cy,rad,fill=None,outline=None,w=0):
    d.ellipse([sc(cx-rad),sc(cy-rad),sc(cx+rad),sc(cy+rad)],fill=fill,outline=outline,width=(sc(w) if w else 0))
def text(d,x,y,s,font,fill,anchor="la"): d.text((sc(x),sc(y)),strip_emoji(s),font=font,fill=fill,anchor=anchor)
def tw(d,s,font): return d.textlength(s,font=font)/S
def dots(d,spots):
    for (x,y,r,c) in spots: circle(d,x,y,r,fill=c)
def tracked(d,cx,y,s,font,fill,tr,center=True):
    ws=[d.textlength(ch,font=font) for ch in s]; total=sum(ws)+sc(tr)*(len(s)-1)
    x=sc(cx)-total/2 if center else sc(cx)
    for ch,wc in zip(s,ws): d.text((x,sc(y)),ch,font=font,fill=fill); x+=wc+sc(tr)
def ornament(d,cx,y,half,col=None):
    col=col or GOLD
    d.line([sc(cx-half),sc(y),sc(cx-15),sc(y)],fill=col,width=sc(1))
    d.line([sc(cx+15),sc(y),sc(cx+half),sc(y)],fill=col,width=sc(1))
    r=sc(5); d.polygon([(sc(cx),sc(y)-r),(sc(cx)+r,sc(y)),(sc(cx),sc(y)+r),(sc(cx)-r,sc(y))],fill=GOLD_L)
def cover_gradient():
    w,hh=W*S,H*S; y=np.linspace(0,1,hh)[:,None]
    top=np.array([18,28,49.]); mid=np.array([32,47,77.]); bot=np.array([13,21,38.])
    col=np.where(y<0.42, top+(mid-top)*(y/0.42), mid+(bot-mid)*((y-0.42)/0.58))
    img=np.repeat(col[:,None,:],w,axis=1)
    yy,xx=np.mgrid[0:hh,0:w].astype(float); cx,cy=w*0.5,hh*0.34
    r=np.sqrt(((xx-cx)/(w*0.62))**2+((yy-cy)/(hh*0.30))**2)
    glow=np.clip(1-r,0,1)[...,None]*np.array([30,25,12.])
    return Image.fromarray(np.clip(img+glow,0,255).astype('uint8'))
def star(d,cx,cy,r,fill):
    pts=[(sc(cx+(r if i%2==0 else r*0.44)*math.cos(math.pi/2+i*math.pi/5)),
          sc(cy-(r if i%2==0 else r*0.44)*math.sin(math.pi/2+i*math.pi/5))) for i in range(10)]
    d.polygon(pts,fill=fill)
def paste(im,path,x,y,w):
    g=Image.open(path).convert("RGB"); nw=sc(w); nh=int(nw*g.height/g.width)
    im.paste(g.resize((nw,nh),Image.LANCZOS),(sc(x),sc(y))); return nh/S
def paste_rgba(im,path,x,y,w):
    g=Image.open(path).convert("RGBA"); nw=sc(w); nh=int(nw*g.height/g.width)
    gg=g.resize((nw,nh),Image.LANCZOS); im.paste(gg,(sc(x),sc(y)),gg); return nh/S

# ---------- HTML Rich-Text ----------
class _Blocks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.blocks=[]; self.cur=None; self.bold=0
    def _ensure(self):
        if self.cur is None: self.cur={'type':'p','spans':[]}
    def handle_starttag(self,t,a):
        if t=='p': self._flush(); self.cur={'type':'p','spans':[]}
        elif t=='ul': self._flush()
        elif t=='li': self._flush(); self.cur={'type':'li','spans':[]}
        elif t in ('b','strong'): self.bold+=1
        elif t=='br': self._ensure(); self.cur['spans'].append({'text':'\n','bold':self.bold>0})
    def handle_endtag(self,t):
        if t in ('p','li'): self._flush()
        elif t in ('b','strong'): self.bold=max(0,self.bold-1)
    def handle_data(self,d):
        if not d: return
        self._ensure(); self.cur['spans'].append({'text':d,'bold':self.bold>0})
    def _flush(self):
        if self.cur and any(s['text'].strip() for s in self.cur['spans']): self.blocks.append(self.cur)
        self.cur=None
def parse_html(html):
    p=_Blocks(); p.feed(html or ''); p._flush(); return p.blocks
def _wrap(d,spans,maxw,fn,fb):
    words=[]
    for s in spans:
        for i,seg in enumerate(s['text'].split('\n')):
            if i>0: words.append(('\n',False,False))
            for w in seg.split(' '):
                if w=='': continue
                nosp = w[0] in '.,;:!?%)»'
                words.append((w,s['bold'],nosp))
    sp=tw(d,' ',fn); lines=[]; line=[]; lw=0
    for w,b,nosp in words:
        if w=='\n': lines.append(line); line=[]; lw=0; continue
        f=fb if b else fn; ww=tw(d,w,f)
        lead = 0 if (not line or nosp) else sp
        if line and lw+lead+ww>maxw:
            lines.append(line); line=[(w,b,ww,0)]; lw=ww
        else:
            lw=lw+lead+ww; line.append((w,b,ww,lead))
    if line: lines.append(line)
    return lines,sp

# ---------- Buch (Flow) ----------
class Book:
    def __init__(self):
        self.pages=[]; self.cover_pages=0; self.new_page()
    def new_page(self, deco=True):
        im=Image.new("RGB",(W*S,H*S),CREAM); self.im=im; self.d=ImageDraw.Draw(im)
        self.pages.append(im); self.y=MT
        if deco:
            dots(self.d,[(W-64,96,52,"#FBF1D6"),(58,H-96,58,"#FCF0D2")])
    def need(self,h):
        if self.y+h>H-MB: self.new_page()
    def gap(self,h): self.y+=h

    def rich(self,html,size=12,color=INK,maxw=None,lh=None,gap=8,x=None):
        d=self.d; x=ML if x is None else x; maxw=(W-ML-MR) if maxw is None else maxw
        fn=BODY(size); fb=BODYB(size); lh=int(size*DPI/72*1.42); blocks=parse_html(strip_emoji(html))
        for blk in blocks:
            indent=26 if blk['type']=='li' else 0
            lines,sp=_wrap(d,blk['spans'],maxw-indent,fn,fb)
            self.need(len(lines)*lh+gap)
            d=self.d
            if blk['type']=='li':
                circle(d,x+8,self.y+lh*0.45,3.5,fill=color)
            yy=self.y
            for line in lines:
                cx=x+indent
                for (w,b,ww,lead) in line:
                    cx+=lead; text(d,cx,yy,w,(fb if b else fn),color); cx+=ww
                yy+=lh
            self.y=yy+gap

    def _rich_h(self,d,html,size,maxw):
        fn=BODY(size); fb=BODYB(size); lh=int(size*DPI/72*1.42); h=0
        for blk in parse_html(strip_emoji(html)):
            indent=26 if blk['type']=='li' else 0
            lines,_=_wrap(d,blk['spans'],maxw-indent,fn,fb)
            h+=len(lines)*lh+8
        return h

    def topic_header(self,num,name,leitfrage,color):
        self.need(190); d=self.d; y0=self.y
        rom=["I","II","III","IV","V","VI"][num-1]
        tracked(d,ML,y0+6,f"FORSCHERKREIS {rom}",COP(12.5),color,5,center=False)
        fn=DIDOT(31);
        if tw(d,name,fn)>W-ML-MR: fn=DIDOT(26)
        if tw(d,name,fn)>W-ML-MR: fn=DIDOT(22)
        text(d,ML,y0+32,name,fn,INK)
        d.line([sc(ML),sc(y0+98),sc(W-MR),sc(y0+98)],fill=GOLDLINE,width=sc(1.6))
        self.y=y0+114
        self.callout("Unsere Forscherfrage",f"<p>{leitfrage}</p>",color,titlecolor=color,bg="#FFFFFF")
        self.gap(6)

    def step(self,n,title,color):
        self.need(140); d=self.d; y0=self.y
        circle(d,ML+18,y0+18,17,fill=color); text(d,ML+18,y0+20,str(n),RND(15),WHITE,anchor="mm")
        text(d,ML+50,y0+3,title,RND(18),INK)
        d.line([sc(ML),sc(y0+48),sc(W-MR),sc(y0+48)],fill=GOLDLINE,width=sc(1.2))
        self.y=y0+62

    def callout(self,title,html,accent,bg=None,titlecolor=None,size=12):
        d=self.d; bg=bg or "#F7F9FD"; titlecolor=titlecolor or accent
        maxw=W-ML-MR-56
        ch=self._rich_h(d,html,size,maxw)+ (34 if title else 0) +30
        self.need(ch)
        d=self.d
        y0=self.y
        rrect(d,ML,y0,W-MR,y0+ch,16,fill=bg,outline=CARDLINE,w=1.2)
        rrect(d,ML,y0,ML+8,y0+ch,16,fill=accent)  # left accent
        yy=y0+16
        if title:
            text(d,ML+28,yy,title,RND(12.5),titlecolor); yy+=30
        self.y=yy
        self.rich(html,size=size,maxw=maxw,x=ML+28,gap=6)
        self.y=y0+ch+12

    def qr_card(self,qrfile,accent,bg,eyebrow,title,lines):
        if not os.path.exists(os.path.join(IMG,qrfile)): return
        h=196; self.need(h+12); d=self.d
        y0=self.y; rrect(d,ML,y0,W-MR,y0+h,18,fill=bg,outline=accent,w=1.4)
        qs=h-48; rrect(d,ML+24,y0+24,ML+24+qs,y0+24+qs,12,fill=WHITE,outline="#E3E6EF",w=1.2)
        paste(self.im,os.path.join(IMG,qrfile),ML+24+qs*0.07,y0+24+qs*0.07,qs*0.86)
        tx=ML+24+qs+34
        ew=tw(d,eyebrow,RND(10.5))+30; rrect(d,tx,y0+28,tx+ew,y0+60,16,fill=accent); text(d,tx+15,y0+37,eyebrow,RND(10.5),WHITE)
        text(d,tx,y0+78,title,RND(15),INK)
        self.y=y0+112
        self.rich(lines,size=11.5,color=SUB,maxw=(W-MR)-tx-24,x=tx,gap=4)
        self.y=max(self.y,y0+h)+14   # nie in die Kartenunterkante hineinlaufen

    def figure(self,name,w,caption=None,card=True,pad=18):
        path=os.path.join(IMG,f"fig_{name}.png")
        if not os.path.exists(path): return
        g=Image.open(path).convert("RGBA")
        w=min(w,W-ML-MR-2*pad); fh=w*g.height/g.width
        caph=(int(10.5*DPI/72*1.35)+8) if caption else 0
        boxh=fh+(2*pad if card else pad)+caph
        self.need(boxh+16); d=self.d; y0=self.y; cx=W/2
        if card:
            rrect(d,ML,y0,W-MR,y0+boxh,16,fill=WHITE,outline=CARDLINE,w=1.2)
        ix=cx-w/2; iy=y0+pad
        nw,nh=sc(w),sc(fh); gg=g.resize((nw,nh),Image.LANCZOS)
        self.im.paste(gg,(sc(ix),sc(iy)),gg)
        if caption:
            text(d,cx,iy+fh+8,caption,BODY(10.5),SUB,anchor="ma")
        self.y=y0+boxh+16

    def write_lines(self,n=2,label=None,x=None,w=None):
        x=ML if x is None else x; w=(W-ML-MR) if w is None else w
        if label:
            self.need(30); text(self.d,x,self.y,label,BODY(10.5),SUB); self.y+=28
            d=self.d
        for _ in range(n):
            self.need(46)
            d=self.d
            xx=sc(x)
            while xx<sc(x+w):
                self.d.line([xx,sc(self.y+18),xx+sc(6),sc(self.y+18)],fill="#C9C6DA",width=sc(1.6)); xx+=sc(12)
            self.y+=46

    def options(self,opts):
        # Vermutung ankreuzen (Druck: Kästchen)
        d=self.d
        for o in opts:
            maxw=W-ML-MR-70
            oh=self._rich_h(d,f"<p>{o['label']}</p>",12,maxw)+16
            self.need(oh)
            d=self.d
            rrect(d,ML+6,self.y+4,ML+40,self.y+38,8,fill=WHITE,outline="#C6CBDA",w=1.6)
            self.rich(f"<p>{o['label']}</p>",size=12,maxw=maxw,x=ML+58,gap=2)
            self.y+=6

    def aufgaben(self,items,color):
        d=self.d
        for i,a in enumerate(items,1):
            ct=a.get("comp",""); pw=W-ML-MR-60-90
            ph=self._rich_h(d,f"<p>{a['prompt']}</p>",12,pw)
            self.need(max(ph,40)+2*46+16)     # ganzer Block auf eine Seite
            d=self.d
            y0=self.y
            circle(d,ML+18,y0+16,16,fill=color); text(d,ML+18,y0+18,str(i),RND(13),WHITE,anchor="mm")
            twc=tw(d,ct,RND(9))
            rrect(d,W-MR-twc-24,y0+2,W-MR-6,y0+24,6,fill="#EAF2FF"); text(d,W-MR-twc-15,y0+7,ct,RND(9),"#0369A1")
            self.rich(f"<p>{a['prompt']}</p>",size=12,maxw=pw,x=ML+50,gap=4)
            self.write_lines(2,x=ML+50,w=W-ML-MR-50)
            self.gap(6)

    # ---- Arbeitsblatt-Aufgabentypen (konkret, wie echte AB) ----
    def task_head(self,n,prompt,color,size=12):
        x=ML+50; pw=W-MR-x
        ph=self._rich_h(self.d,f"<p>{prompt}</p>",size,pw)
        self.need(max(ph,40)+8); d=self.d; y0=self.y
        circle(d,ML+18,y0+16,16,fill=color); text(d,ML+18,y0+18,str(n),RND(13),WHITE,anchor="mm")
        self.rich(f"<p>{prompt}</p>",size=size,maxw=pw,x=x,gap=4)
        self.y=max(self.y,y0+40)
        return x,pw
    def t_lines(self,n,prompt,color,count=3,bullets=False):
        x,pw=self.task_head(n,prompt,color)
        if bullets:
            for _ in range(count):
                self.need(46); circle(self.d,x+4,self.y+18,3.5,fill=SUB)
                self.write_lines(1,x=x+18,w=W-MR-(x+18))
        else:
            self.write_lines(count,x=x,w=W-MR-x)
        self.gap(12)
    def t_claim(self,n,name,claim,prompt,color,count=2):
        self.t_lines(n,f"<b>{name} behauptet:</b> „{claim}“ {prompt}",color,count=count)
    def t_table(self,n,prompt,color,cols,rows=5):
        self.task_head(n,prompt,color)
        ncol=len(cols); x0=ML; x1=W-MR; th=46; rowh=42; totalh=th+rows*rowh
        self.need(totalh+14); d=self.d; y0=self.y; cw=(x1-x0)/ncol
        rrect(d,x0,y0,x1,y0+th,10,fill="#EEF0FA")
        for i,ct in enumerate(cols):
            text(d,x0+i*cw+cw/2,y0+th/2,ct,RND(11),NAVY,anchor="mm")
        for r in range(rows+1):
            yy=y0+th+r*rowh; d.line([sc(x0),sc(yy),sc(x1),sc(yy)],fill="#D7DBE6",width=sc(1))
        for i in range(ncol+1):
            xx=x0+i*cw; d.line([sc(xx),sc(y0),sc(xx),sc(y0+totalh)],fill="#D7DBE6",width=sc(1))
        rrect(d,x0,y0,x1,y0+totalh,10,outline="#C4C9D6",w=1.6)
        self.y=y0+totalh+14
    def t_draw(self,n,prompt,color):
        self.task_head(n,prompt,color)
        self.figure("magcart",430,card=True)
    def t_drawbox(self,n,prompt,color,h=210):
        self.task_head(n,prompt,color)
        self.need(h+14); d=self.d
        rrect(d,ML+50,self.y,W-MR,self.y+h,12,fill=WHITE,outline="#C4C9D6",w=1.6)
        text(d,ML+64,self.y+12,"Zeichenfläche",RND(9),"#C7CCD8")
        self.y+=h+14
    def t_image(self,n,prompt,color,figname,figw,count=3):
        p=os.path.join(IMG,f"fig_{figname}.png")
        if not os.path.exists(p): return self.t_lines(n,prompt,color,count)
        px=ML+50; pw=W-MR-px-figw-26; d=self.d
        ph=self._rich_h(d,f"<p>{prompt}</p>",12,pw)
        g=Image.open(p).convert("RGBA"); ih=figw*g.height/g.width; top=max(ph,ih)
        self.need(top+count*46+18); d=self.d; y0=self.y
        circle(d,ML+18,y0+16,16,fill=color); text(d,ML+18,y0+18,str(n),RND(13),WHITE,anchor="mm")
        paste_rgba(self.im,p,W-MR-figw,y0,figw)
        self.y=y0; self.rich(f"<p>{prompt}</p>",size=12,maxw=pw,x=px,gap=4)
        self.y=y0+top+8
        self.write_lines(count,x=px,w=W-MR-px)
        self.gap(12)
    def gallery_grid(self,items,ncol=3,writeline=True):
        gp=18; cw=(W-ML-MR-(ncol-1)*gp)/ncol; ch=196 if writeline else 166; iw=104
        rows=math.ceil(len(items)/ncol)
        self.need(rows*(ch+gp)+4); d=self.d; gy=self.y
        for i,(fig,lab) in enumerate(items):
            r,cc=divmod(i,ncol); x0=ML+cc*(cw+gp); y0=gy+r*(ch+gp); d=self.d
            rrect(d,x0,y0,x0+cw,y0+ch,14,fill=WHITE,outline=CARDLINE,w=1.2)
            p=os.path.join(IMG,f"fig_{fig}.png")
            if os.path.exists(p):
                g=Image.open(p).convert("RGBA"); maxw=cw-30; maxh=ch-(92 if writeline else 46)
                iwid=min(iw,maxw); ih=iwid*g.height/g.width
                if ih>maxh: ih=maxh; iwid=ih*g.width/g.height
                paste_rgba(self.im,p,x0+cw/2-iwid/2,y0+12+(maxh-ih)/2,iwid)
            text(d,x0+cw/2,y0+ch-(56 if writeline else 26),lab,RND(11),INK,anchor="ma")
            if writeline:
                d.line([sc(x0+16),sc(y0+ch-24),sc(x0+cw-16),sc(y0+ch-24)],fill="#C9CDDA",width=sc(1))
        self.y=gy+rows*(ch+gp)+8
    def t_gallery(self,n,prompt,color,items,ncol=3):
        self.task_head(n,prompt,color); self.gallery_grid(items,ncol,writeline=True)

    def render_tasks(self,items,color):
        for i,tk in enumerate(items,1):
            t=tk["t"]
            if t=="lines": self.t_lines(i,tk["p"],color,count=tk.get("n",3),bullets=tk.get("bullets",False))
            elif t=="gallery": self.t_gallery(i,tk["p"],color,tk["items"],ncol=tk.get("cols",3))
            elif t=="table": self.t_table(i,tk["p"],color,tk["cols"],rows=tk.get("rows",5))
            elif t=="draw": self.t_draw(i,tk["p"],color)
            elif t=="drawbox": self.t_drawbox(i,tk["p"],color,h=tk.get("h",210))
            elif t=="image": self.t_image(i,tk["p"],color,tk["fig"],tk["w"],count=tk.get("n",3))
            elif t in ("claim","exp"): self.t_claim(i,tk["name"],tk["claim"],tk["p"],color,count=tk.get("n",2))

    # ---- Abschnittskopf (wie Themen-Header, ohne Forscherfrage) ----
    def sec_header(self,eyebrow,title,color):
        self.need(140); d=self.d; y0=self.y
        tracked(d,ML,y0+6,eyebrow,COP(12.5),color,5,center=False)
        fn=DIDOT(31)
        if tw(d,title,fn)>W-ML-MR: fn=DIDOT(26)
        text(d,ML,y0+32,title,fn,INK)
        d.line([sc(ML),sc(y0+98),sc(W-MR),sc(y0+98)],fill=GOLDLINE,width=sc(1.6))
        self.y=y0+116

    def t_wordsearch(self,prompt,words,color,size=12,seed=7):
        self.rich(f"<p>{prompt}</p>",size=12); self.gap(2)
        g=_ws_gen(words,size,seed); cs=52; gx=(W-size*cs)/2
        self.need(size*cs+30); d=self.d; gy=self.y
        for i in range(size+1):
            d.line([sc(gx),sc(gy+i*cs),sc(gx+size*cs),sc(gy+i*cs)],fill=GOLDLINE,width=sc(1))
            d.line([sc(gx+i*cs),sc(gy),sc(gx+i*cs),sc(gy+size*cs)],fill=GOLDLINE,width=sc(1))
        for y in range(size):
            for x in range(size):
                text(d,gx+x*cs+cs/2,gy+y*cs+cs/2,g[y][x],OPT(18),INK,anchor="mm")
        self.y=gy+size*cs+22
        tracked(d,ML,self.y,"SUCHWÖRTER",COP(11),GOLD,3,center=False); self.y+=32
        cols=3; per=math.ceil(len(words)/cols); colw=(W-ML-MR)/cols
        for i,w in enumerate(sorted(words)):
            c,r=divmod(i,per); x=ML+c*colw; yy=self.y+r*38
            circle(d,x+5,yy+8,4.5,outline=GOLD,w=1.4); text(d,x+22,yy,w,BODYB(12.5),INK)
        self.y+=per*38+8

    def t_crossword(self,cw,color):
        self.rich("<p>Trage die Antworten waagerecht ein. Die Buchstaben in der Gold-Spalte ergeben von oben nach unten das <b>Lösungswort</b>.</p>",size=12); self.gap(4)
        rows=cw["rows"]; Hc=cw["col"]; cs=48
        minc=min(Hc-t for (_,_,t) in rows); maxend=max(Hc-t+len(a) for (_,a,t) in rows)
        ncol=maxend-minc; left=(W-ncol*cs)/2; gx=left-minc*cs
        self.need(len(rows)*cs+24); d=self.d; gy=self.y
        for r,(clue,ans,t) in enumerate(rows):
            c0=Hc-t; y0=gy+r*cs
            text(d,gx+c0*cs-24,y0+cs/2,str(r+1),BODYB(13),SUB,anchor="mm")
            for i in range(len(ans)):
                cx=gx+(c0+i)*cs; hl=(c0+i==Hc)
                rrect(d,cx+2,y0+2,cx+cs-2,y0+cs-2,4,fill=(GOLDBG if hl else WHITE),outline=(GOLD if hl else CARDLINE),w=(1.8 if hl else 1.2))
        self.y=gy+len(rows)*cs+20
        tracked(d,ML,self.y,"WAAGERECHT",COP(11),GOLD,3,center=False); self.y+=30
        for r,(clue,ans,t) in enumerate(rows):
            self.need(30); d=self.d
            text(d,ML,self.y,f"{r+1}",BODYB(12),color)
            self.rich(f"<p>{clue}</p>",size=11.5,x=ML+30,maxw=W-ML-MR-30,gap=2)
        self.gap(8); d=self.d
        text(d,ML,self.y+6,"Lösungswort:",BODYB(13),INK)
        bx=ML+180; bs=40
        for i in range(len(cw["loesung"])):
            rrect(d,bx+i*(bs+6),self.y,bx+i*(bs+6)+bs,self.y+bs,5,outline=GOLD,w=1.6)
        self.y+=bs+12

    def testprep(self,color):
        self.rich("<p>Gehe die Liste durch und kreuze ehrlich an, was du schon sicher kannst. Was noch offen ist, schaust du dir vor dem Test nochmal an.</p>",size=12); self.gap(6)
        d=self.d
        tracked(d,ML,self.y,"DAS KANN ICH",COP(11),color,3,center=False); self.y+=30
        for s in TESTPREP:
            self.need(48); d=self.d; y0=self.y
            for k in range(3):  # sicher / fast / üben
                rrect(d,W-MR-40-k*46,y0+2,W-MR-40-k*46+22,y0+24,5,outline="#C6CBDA",w=1.6)
            self.rich(f"<p>{s}</p>",size=12,x=ML,maxw=W-MR-ML-160,gap=2)
            self.y=max(self.y,y0+40)
        self.gap(4); d=self.d
        for lab,k in [("sicher",0),("fast",1),("üben",2)]:
            text(d,W-MR-40-k*46+11,self.y,lab,BODY(8),SUB,anchor="ma")
        self.y+=26
        self.callout("Diese Wörter musst du kennen","<p>"+"  ·  ".join(TESTPREP_WORTE)+"</p>",color,bg=GOLDBG,titlecolor=GOLD_D)
        self.callout("Lern-Tipp","<p>Erkläre einer anderen Person die Polregel und wie ein Kompass funktioniert – wer etwas erklären kann, hat es wirklich verstanden.</p>",TEAL,bg=MINT,titlecolor=TEAL_D)

    def test_question(self,n,q,color):
        px=ML+50; pw=W-MR-px-70
        ph=self._rich_h(self.d,f"<p>{q['p']}</p>",12.5,pw)
        if "opts" in q: extra=math.ceil(len(q["opts"])/2)*42+10
        elif "drawbox" in q: extra=q["drawbox"]+14
        else: extra=q.get("lines",2)*46+8
        self.need(max(ph,40)+extra+18); d=self.d; y0=self.y
        circle(d,ML+18,y0+16,16,fill=color); text(d,ML+18,y0+18,str(n),RND(14),WHITE,anchor="mm")
        pl=f"{q['pts']} P"; pwp=tw(d,pl,COP(9.5))+22
        rrect(d,W-MR-pwp,y0+2,W-MR,y0+26,10,outline=GOLD,w=1.3); tracked(d,W-MR-pwp+11,y0+9,pl,COP(9.5),GOLD_D,1,center=False)
        self.rich(f"<p>{q['p']}</p>",size=12.5,maxw=pw,x=px,gap=4); self.gap(2)
        if "opts" in q:
            colw=(W-MR-px)/2
            for i,o in enumerate(q["opts"]):
                r,c=divmod(i,2); ox=px+c*colw; oy=self.y+r*42
                rrect(d,ox,oy+2,ox+22,oy+24,5,outline="#C6CBDA",w=1.6); text(d,ox+34,oy,o,BODY(12),INK)
            self.y+=math.ceil(len(q["opts"])/2)*42+8
        elif "drawbox" in q:
            hh=q["drawbox"]; rrect(d,px,self.y,W-MR,self.y+hh,10,fill=WHITE,outline="#C4C9D6",w=1.4); self.y+=hh+10
        else:
            self.write_lines(q.get("lines",2),x=px,w=W-MR-px)
        self.gap(10)

    def protocol_table(self):
        MATS=["Eisen-Nagel","Büroklammer (Stahl)","Nickel-Münze","Alu-Dose","Kupfer-Draht","Holz-Stab","Plastik-Stein","Glas-Murmel"]
        d=self.d; x0=ML; inr=W-MR; c2=x0+430; c3=c2+250
        self.need(60+len(MATS)*54+20)
        d=self.d
        rrect(d,x0,self.y,inr,self.y+46,12,fill=TEAL)
        text(d,x0+18,self.y+13,"Material",RND(11.5),WHITE)
        text(d,c2+16,self.y+13,"Meine Vermutung",RND(11.5),WHITE)
        text(d,c3+16,self.y+13,"Beobachtung",RND(11.5),WHITE)
        self.y+=52
        for i,m in enumerate(MATS):
            if i%2==1: rrect(d,x0,self.y,inr,self.y+52,0,fill="#F5FBFA")
            text(d,x0+18,self.y+16,m,BODY(12),INK)
            for cx in (c2+125,c3+110):
                rrect(d,cx-20,self.y+12,cx+20,self.y+48,8,fill=WHITE,outline="#C6D6D2",w=1.5)
            if i>0: d.line([sc(x0),sc(self.y),sc(inr),sc(self.y)],fill="#EDEFF4",width=sc(1))
            self.y+=54
        self.y+=8

    def selbst(self):
        self.need(120); d=self.d
        text(d,ML,self.y,"Wie sicher fühlst du dich? Kreuze an:",RND(13),INK); self.y+=40
        w=(W-ML-MR-24)/3
        for i,t in enumerate(["Ich brauche das nochmal","Fast — eine Übung noch","Ich kann es erklären!"]):
            x0=ML+i*(w+12); rrect(d,x0,self.y,x0+w,self.y+64,14,fill=WHITE,outline="#E2E8F0",w=1.5)
            rrect(d,x0+14,self.y+22,x0+34,self.y+42,5,fill=WHITE,outline="#C6CBDA",w=1.5)
            text(d,x0+44,self.y+16,t,BODY(10.5),INK,)  # kann umbrechen -> ok kurz
        self.y+=80

def band(d,y0,y1,text_lines,fill,fg):
    rrect(d,ML-30,y0,W-ML+30,y1,0,fill=fill)
    yy=(y0+y1)//2 - len(text_lines)*10
    for t in text_lines:
        text(d,W//2,yy,t,RND(10),fg,anchor="mm"); yy+=24

# ================= CONTENT =================
_FK=[os.path.join(HERE,"..","fk-magnet.js"),os.path.join(HERE,"fk-magnet.js"),
     "/Users/lala/Desktop/Claude/LernStar/fk-magnet.js"]
_fkpath=next((p for p in _FK if os.path.exists(p)),_FK[0])
txt=open(_fkpath,encoding="utf-8").read().strip()
CFGS=json.loads(txt[txt.index("=")+1:].rstrip().rstrip(";"))

def toc_entry(bk,numlabel,name,pagestr,color,star_b=False):
    bk.need(52); d=bk.d; y=bk.y
    circle(d,ML+18,y+16,16,fill=color)
    if star_b: star(d,ML+18,y+16,10,WHITE)
    else: text(d,ML+18,y+18,numlabel,RND(13),WHITE,anchor="mm")
    nx=ML+52
    text(d,nx,y+4,name,BODY(13.5),INK)
    nw=tw(d,name,BODY(13.5)); pw=tw(d,pagestr,RND(13)); px=W-MR-pw
    lx=nx+nw+14
    while lx<px-12:
        circle(d,lx,y+17,1.6,fill="#CBCEDA"); lx+=11
    text(d,W-MR,y+3,pagestr,RND(13),color if pagestr!="…" else SUB,anchor="ra")
    bk.y+=48

def render(numbers):
    bk=Book()
    d=bk.d
    # ---- COVER (Parfum-Eleganz: Navy-Verlauf, Gold-Haarlinien, Didot) ----
    bk.im.paste(cover_gradient(),(0,0))
    ov=Image.new("RGBA",bk.im.size,(0,0,0,0)); od=ImageDraw.Draw(ov)
    ccx,ccy=sc(W*0.5),sc(H*0.335)
    for (rx,ry) in [(360,150),(500,225),(660,310),(840,410),(1040,520)]:
        od.ellipse([ccx-sc(rx),ccy-sc(ry),ccx+sc(rx),ccy+sc(ry)],outline=(200,170,95,44),width=sc(1))
    mw,mh=sc(120),sc(34)
    od.rounded_rectangle([ccx-mw,ccy-mh//2,ccx+mw,ccy+mh//2],radius=sc(6),outline=(210,180,110,140),width=sc(2))
    od.line([ccx,ccy-mh//2,ccx,ccy+mh//2],fill=(210,180,110,110),width=sc(2))
    bk.im.paste(Image.alpha_composite(bk.im.convert("RGBA"),ov).convert("RGB"),(0,0))
    d=bk.d
    rrect(d,46,46,W-46,H-46,20,outline=GOLD,w=2)
    rrect(d,55,55,W-55,H-55,15,outline=GOLD_D,w=1)
    tracked(d,W/2,150,"PHYSIK · FORSCHERHEFT",COP(14),"#C8B278",7)
    ornament(d,W/2,202,118)
    tracked(d,W/2,264,"Magnetismus",DIDOT(72),GOLD_L,3)
    tracked(d,W/2,452,"Fünf Forscherkreise",_FF("Optima.ttc",26,2),"#CED6E2",2)
    hp=os.path.join(IMG,"fig_fieldlines.png")
    if os.path.exists(hp):
        hw=548; g=Image.open(hp); ih=int(hw*g.height/g.width); hx=W/2-hw/2; hy=590
        rrect(d,hx-22,hy-22,hx+hw+22,hy+ih+22,12,fill=CREAM,outline=GOLD,w=2)
        paste_rgba(bk.im,hp,hx,hy,hw)
    ornament(d,W/2,H-360,118)
    tracked(d,W/2,H-322,"KLASSE 5 · REALSCHULE NRW",COP(15),GOLD_L,6)
    tracked(d,W/2,H-250,"Forschendes, kompetenzorientiertes Lernen",OPT(15),"#AAB6CC",1)
    tracked(d,W/2,H-214,"nach dem Kernlehrplan Physik NRW",OPT(13),"#8C99B0",1)
    bk.cover_pages=1

    # ---- IMPRESSUM + VORWORT (eigene Seite) ----
    bk.new_page(); bk.y=MT
    text(bk.d,ML,bk.y,"Über dieses Heft",RND(22),NAVY); bk.y+=48
    bk.rich("<p>Dieses Heft führt dich wie eine kleine Forscherin oder einen kleinen Forscher durch <b>fünf Themen</b> rund um den Magnetismus. Statt fertige Antworten zu lesen, stellst du zuerst eine <b>Vermutung</b> auf und prüfst sie dann selbst – im Experiment oder in der Simulation. Denn in den Naturwissenschaften entscheidet das Experiment.</p>"
            "<p><b>So läuft jeder Forscherkreis:</b> Problem &amp; Frage » Was kennst du schon? » Was glaubst du? Probier aus! » Ordnen &amp; Sichern » Üben » Anwenden » Frage geklärt?</p>"
            "<p>Mit deinem Handy kannst du über die <b>QR-Codes</b> das passende Video ansehen oder die Simulation direkt öffnen.</p>", size=12)
    bk.gap(18)
    text(bk.d,ML,bk.y,"Impressum",RND(18),NAVY); bk.y+=40
    bk.rich("<p>© 2026 · [Autorin/Autor oder Verlag]. Alle Rechte vorbehalten. 1. Auflage.</p>"
            "<p>Titel: Magnetismus – 5 Forscherkreise. Ein Arbeitsheft für Klasse 5 (Realschule NRW).</p>"
            "<p>Kontakt: [E-Mail / Website] · ISBN: [falls vorhanden]</p>"
            "<p>Kein Teil dieses Werkes darf ohne schriftliche Genehmigung vervielfältigt werden. Für Unterrichtszwecke innerhalb einer erwerbenden Lerngruppe ist das Kopieren der Arbeitsseiten gestattet.</p>"
            "<p>Konzeption: forschendes Lernen nach Kircher, Girwidz &amp; Häußler; Kompetenzorientierung nach dem Kernlehrplan Physik Realschule NRW. Diagramme und QR-Codes: eigene Darstellungen.</p>", size=10.5, color=SUB)

    # ---- INHALTSVERZEICHNIS (eigene Seite) ----
    bk.new_page(); bk.y=MT
    text(bk.d,ML,bk.y,"Inhalt",RND(26),NAVY); bk.y+=62
    text(bk.d,ML,bk.y,"Fünf Forscherkreise — je eine Leitfrage, ein Experiment, eine Lösung.",BODY(12),SUB); bk.y+=46
    for ti,c in enumerate(CFGS):
        color=TOPIC_COLORS[ti%len(TOPIC_COLORS)]
        nm=c["theme"].split("· ")[-1]
        ps=str(numbers[c["id"]]) if numbers else "…"
        toc_entry(bk,str(ti+1),nm,ps,color)
    bk.gap(6)
    dd=bk.d; ly=bk.y
    dd.line([sc(ML),sc(ly),sc(W-MR),sc(ly)],fill=GOLDLINE,width=sc(1)); bk.y+=12
    for key,nm2,col2 in [("R","Magnet-Rätsel (Wortgitter & Kreuzwort)",GOLD_D),
                         ("V","Bereite dich auf den Test vor",TOPIC_COLORS[3]),
                         ("T","Test: Magnetismus",TOPIC_COLORS[1])]:
        toc_entry(bk,"",nm2,(str(numbers[key]) if numbers else "…"),col2,star_b=True)
    bk.gap(4); ly=bk.y
    dd.line([sc(ML),sc(ly),sc(W-MR),sc(ly)],fill=GOLDLINE,width=sc(1)); bk.y+=12
    aps=str(numbers["A"]) if numbers else "…"
    toc_entry(bk,"A","Für die Lehrkraft – Lösungen & Kompetenzbezug",aps,NAVY)

    # ---- 6 THEMEN ----
    topic_pages={}
    for ti,c in enumerate(CFGS):
        color=TOPIC_COLORS[ti%len(TOPIC_COLORS)]
        bk.new_page(); bk.y=MT
        topic_pages[c["id"]]=len(bk.pages)-1
        bk.topic_header(ti+1,c["theme"].split("· ")[-1],c["leitfrage"],color)
        # 1 Problem
        bk.step(1,"Problem & Frage",color)
        bk.callout("🎯 Ein echtes Problem", c["problem"], color, bg=PEACH if ti%2==0 else MINT, titlecolor=INK)
        _al=FIG_ALLTAG.get(c["id"],[])
        if _al:  # Alltagsszene direkt zum Problem -> Alltag im Vordergrund
            fn,fw,fcap=_al[0]; bk.figure(fn,fw,fcap)
        vidfile=f"qr_video_{c['id']}.png"
        bk.qr_card(vidfile, CORAL, PEACH, "ZUM VIDEO", "Lieber ansehen als lesen?",
                   "<p>Scanne den Code – das passende Video läuft (mit Ton). Ideal, wenn du gerade nicht lesen möchtest.</p>")
        # 2 Vorwissen
        bk.step(2,"Was kennst du schon bereits?",color)
        bk.rich(c["vorwissen"], size=12)
        # 3 Vermuten & Prüfen
        bk.step(3,"Was glaubst du? Probier aus!",color)
        if c.get("integrated"):
            bk.rich("<p><b>Erst vermuten, dann prüfen.</b> Kreuze in der Tabelle an, welche Dinge der Magnet deiner Meinung nach anzieht – und prüfe es danach im Experiment.</p>", size=12)
            bk.protocol_table()
        else:
            bk.callout("🔮 Deine Vermutung", f"<p>{c['predictFrage']}</p><p>{c.get('predictHinweis','')}</p>", TEAL, bg="#F0FBFA", titlecolor=TEAL_D)
            bk.rich("<p>Kreuze deine Vermutung an – prüfe sie dann in der Simulation.</p>", size=11.5, color=SUB)
            bk.options(c.get("predictOptions",[]))
        if c.get("exp"):
            bk.qr_card(f"qr_sim_{c['id']}.png", TEAL, MINT, "ZUR SIMULATION", "Teste es selbst online!",
                       "<p>Scanne den Code – die Simulation öffnet sich sofort. Probiere aus und beobachte genau.</p>")
        bk.write_lines(2,label="Meine Beobachtung / Auswertung:")
        # 4 Sichern
        bk.step(4,"Ordnen & Sichern",color)
        if c["id"] in FIG_CONCEPT:
            fn,fw,fcap=FIG_CONCEPT[c["id"]]; bk.figure(fn,fw,fcap)
        bk.callout("⭐ Merksatz", c["merksatz"], GOLD, bg=GOLDBG, titlecolor=GOLD_D)
        if c.get("fachbegriff"): bk.callout("🔤 Fachbegriff", c["fachbegriff"], SUB, bg="#F1F5F9", titlecolor=INK)
        # 5 Üben – konkrete Arbeitsblatt-Aufgaben
        bk.step(5,"Jetzt bist du dran! – Aufgaben",color)
        bk.render_tasks(TASKS.get(c["id"],[]),color)
        # 6 Anwenden
        bk.step(6,"Anwenden im Alltag",color)
        _ag=ANWENDEN.get(c["id"],[])
        if _ag:
            bk.rich("<p>Magnete stecken überall im Alltag. Schreibe zu jedem Bild, wozu der Magnet dort dient.</p>", size=11.5, color=SUB)
            bk.gallery_grid(_ag,ncol=3,writeline=True)
        else:
            bk.rich(c["anwenden"], size=12)
        # 7 Frage geklärt
        bk.step(7,"Frage geklärt?",color)
        bk.write_lines(2,label="Beantworte die Forscherfrage mit eigenen Worten:")
        bk.callout("💡 Die Lösung – vergleiche mit deiner Antwort", c["loesung"], TEAL_D, bg=MINT, titlecolor=TEAL_D)
        bk.selbst()

    # ---- WIEDERHOLUNG: WORTGITTER + KREUZWORTRÄTSEL ----
    bk.new_page(); bk.y=MT; raetsel_page=len(bk.pages)-1
    bk.sec_header("WIEDERHOLUNG","Magnet-Rätsel",GOLD_D)
    bk.t_wordsearch("Finde die 12 Magnet-Wörter im Gitter – waagerecht, senkrecht und schräg. Male sie farbig an.",WS_WORDS,TOPIC_COLORS[0])
    bk.new_page(); bk.y=MT
    bk.sec_header("WIEDERHOLUNG","Kreuzworträtsel",GOLD_D)
    bk.t_crossword(CROSSWORD,TOPIC_COLORS[2])

    # ---- BEREITE DICH AUF DEN TEST VOR ----
    bk.new_page(); bk.y=MT; testprep_page=len(bk.pages)-1
    bk.sec_header("VOR DEM TEST","Bereite dich auf den Test vor",TOPIC_COLORS[3])
    bk.testprep(TOPIC_COLORS[3])

    # ---- SCHRIFTLICHER TEST ----
    bk.new_page(); bk.y=MT; test_page=len(bk.pages)-1
    d=bk.d; y0=bk.y
    tracked(d,ML,y0+6,"SCHRIFTLICHE ÜBERPRÜFUNG",COP(12.5),TOPIC_COLORS[1],5,center=False)
    text(d,ML,y0+32,"Test: Magnetismus",DIDOT(31),INK)
    text(d,W-MR,y0+44,f"/ {TEST_PTS} Punkte",RND(14),GOLD_D,anchor="ra")
    d.line([sc(ML),sc(y0+98),sc(W-MR),sc(y0+98)],fill=GOLDLINE,width=sc(1.6)); bk.y=y0+112
    for lab,f0,f1 in [("Name:",0,0.52),("Klasse:",0.57,0.74),("Datum:",0.79,1.0)]:
        x=ML+(W-ML-MR)*f0; xe=ML+(W-ML-MR)*f1
        text(d,x,bk.y,lab,BODYB(11),SUB); d.line([sc(x+tw(d,lab,BODYB(11))+10),sc(bk.y+15),sc(xe-6),sc(bk.y+15)],fill="#C9CDDA",width=sc(1))
    bk.y+=42
    for i,q in enumerate(TEST,1):
        bk.test_question(i,q,TOPIC_COLORS[i%len(TOPIC_COLORS)])
    bk.gap(2); text(bk.d,W/2,bk.y,"Viel Erfolg!",_FF("Optima.ttc",17,2),GOLD_D,anchor="mm")

    # ---- LEHRER-ANHANG ----
    bk.new_page(); bk.y=MT
    appendix_page=len(bk.pages)-1
    text(bk.d,ML,bk.y,"Für die Lehrkraft – Lösungen & Kompetenzbezug",RND(19),NAVY); bk.y+=46
    bk.rich("<p>Kernlehrplan Physik Realschule NRW (Heft 3307), Inhaltsfeld 1 „Strom und Magnetismus“, Progressionsstufe 1. Die Zuordnung der Inhaltsfelder zu Jahrgängen trifft die Fachkonferenz; der Kernlehrplan kennt nur zwei Progressionsstufen. Diagnostischer Entwurf – fachlich zu prüfen.</p>", size=10.5, color=SUB)
    bk.gap(8)
    for ti,c in enumerate(CFGS):
        color=TOPIC_COLORS[ti%len(TOPIC_COLORS)]
        bk.need(120)
        circle(bk.d,ML+16,bk.y+16,15,fill=color); text(bk.d,ML+16,bk.y+18,str(ti+1),RND(12),WHITE,anchor="mm")
        text(bk.d,ML+46,bk.y+6,c["theme"].split("· ")[-1],RND(13.5),INK); bk.y+=44
        comps=" · ".join(c.get("competences",[]))
        bk.rich(f"<p><b>KLP-Kompetenzen:</b> {comps} &nbsp;|&nbsp; <b>Primär:</b> {c.get('primaryArea','')} &nbsp;|&nbsp; <b>Modulart:</b> {c.get('moduleType','')}</p>"
                f"<p><b>Typische Fehlvorstellung:</b> {c.get('misconception','')}</p>"
                + (f"<p><b>Fachlicher Hinweis:</b> {c.get('lehrerhinweis','')}</p>" if c.get('lehrerhinweis') else ""),
                size=10.5, color=SUB, x=ML+46, maxw=W-ML-MR-46)
        bk.gap(6)

    # Test-Lösungen (Erwartungshorizont)
    bk.need(150); bk.gap(4)
    text(bk.d,ML,bk.y,"Test „Magnetismus“ – Erwartungshorizont",RND(15),NAVY); bk.y+=34
    SOLS=["Nordpol und Südpol.",
          "Magnetisch: Eisennagel, Büroklammer aus Stahl, Schere (Stahl). Nicht magnetisch: Aludose, Holzstab, Kupferdraht.",
          "Gleiche Pole stoßen sich ab, ungleiche Pole ziehen sich an.",
          "Stabmagnet mit N/S; vier Feldlinien mit Pfeilen außen vom Nordpol zum Südpol, an den Polen dicht, weiter weg weiter auseinander.",
          "Die Nadel ist selbst ein kleiner Magnet und richtet sich im Erdmagnetfeld der Erde aus – darum zeigt sie nach Norden.",
          "Nein. Ein Magnet zieht nur Eisen, Nickel und Kobalt (und Stahl) an – nicht alle Metalle (z. B. nicht Aluminium oder Kupfer).",
          "Zwei sinnvolle Beispiele, z. B. Kühlschrankmagnet, Kopfhörer/Lautsprecher, Kompass, Magnetverschluss, Magnettafel."]
    lg="; ".join(f"{i}. {q['pts']} P" for i,q in enumerate(TEST,1))
    bk.rich(f"<p><b>Punkte je Aufgabe:</b> {lg} &nbsp;|&nbsp; <b>gesamt {TEST_PTS} Punkte.</b></p>", size=10, color=SUB)
    for i,(q,sol) in enumerate(zip(TEST,SOLS),1):
        bk.rich(f"<p><b>{i}.</b> {sol}</p>", size=10.5, color=SUB, x=ML+8, maxw=W-ML-MR-8, gap=3)

    content_start=min(topic_pages.values())
    # ---------- Fußzeilen (Post-Pass) ----------
    for i,im in enumerate(bk.pages):
        if i<content_start: continue
        dd=ImageDraw.Draw(im); yy=H-52
        dd.line([sc(ML),sc(yy),sc(W-MR),sc(yy)],fill=GOLDLINE,width=sc(1))
        tracked(dd,ML,yy+13,"MAGNETISMUS · REALSCHULE NRW · KLASSE 5",COP(8),GOLD_D,2,center=False)
        text(dd,W-MR,yy+12,f"Seite {i-content_start+1}",COP(9),GOLD_D,anchor="ra")

    return bk, topic_pages, raetsel_page, testprep_page, test_page, appendix_page, content_start

# ---------- Zwei-Pass: erst zählen, dann Inhaltsverzeichnis füllen ----------
_,tp,rp,vp,tpg,ap,cs=render(None)
numbers={tid:(idx-cs+1) for tid,idx in tp.items()}
numbers["R"]=rp-cs+1; numbers["V"]=vp-cs+1; numbers["T"]=tpg-cs+1; numbers["A"]=ap-cs+1
bk,_,_,_,_,_,_=render(numbers)

pages=[p.resize((W,H),Image.LANCZOS) for p in bk.pages]
out=os.path.expanduser("~/Desktop/Magnetismus_Arbeitsheft_KOMPLETT.pdf")
pages[0].save(out,"PDF",resolution=DPI,save_all=True,append_images=pages[1:])
_prev=os.path.join(HERE,"preview"); os.makedirs(_prev,exist_ok=True)
for i,p in enumerate(pages,1): p.save(os.path.join(_prev,f"heft_p{i}.png"))
print("SAVED:",out,"| Seiten:",len(pages),"| Seitenzahlen:",numbers)
