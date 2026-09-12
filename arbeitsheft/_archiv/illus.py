# -*- coding: utf-8 -*-
"""Magnetismus-Illustrationen — supersampled PIL line/flat art, transparent PNG."""
import os, math
from PIL import Image, ImageDraw, ImageFont
import numpy as np

HERE=os.path.dirname(__file__); IMG=os.path.join(HERE,"img"); os.makedirs(IMG,exist_ok=True)
SS=4  # supersampling

# ---- palette ----
NRED="#E23B44"; NRED_D="#B32831"
SBLU="#2F6BE0"; SBLU_D="#1E4CAB"
INK="#26303B"; SUB="#6B7482"; LINE="#3A424E"
STEEL="#9AA6B4"; STEEL_D="#5A6675"; GOLD="#F2B23A"; COP="#D98A3D"
TEAL="#17A398"; CORAL="#F26D6D"; GREEN="#3FA34D"; WOOD="#C79A5B"
YEL="#FFD34E"; SKY="#BFE6F2"; GREY="#C9CFD8"; WHITE="#FFFFFF"

def _font(path,px):
    for p in ["/System/Library/Fonts/Supplemental/"+path,
              "/Library/Fonts/"+path, path]:
        if os.path.exists(p):
            return ImageFont.truetype(p,px)
    return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf",px)
def RND(px): return _font("Arial Rounded Bold.ttf",int(px*SS))
def BLD(px): return _font("Arial Bold.ttf",int(px*SS))

class C:
    """Canvas: logical size (w,h); draw in logical coords, auto *SS."""
    def __init__(self,w,h):
        self.w,self.h=w,h
        self.im=Image.new("RGBA",(w*SS,h*SS),(0,0,0,0))
        self.d=ImageDraw.Draw(self.im)
    def out(self):
        return self.im.resize((self.w,self.h),Image.LANCZOS)
    def s(self,v): return v*SS
    # primitives (logical coords)
    def line(self,pts,fill,w=2,joint="curve"):
        self.d.line([(x*SS,y*SS) for x,y in pts],fill=fill,width=int(w*SS),joint=joint)
    def poly(self,pts,fill=None,outline=None,w=2):
        self.d.polygon([(x*SS,y*SS) for x,y in pts],fill=fill,outline=outline,width=int(w*SS))
    def rrect(self,x0,y0,x1,y1,r,fill=None,outline=None,w=2):
        self.d.rounded_rectangle([x0*SS,y0*SS,x1*SS,y1*SS],radius=r*SS,fill=fill,outline=outline,width=int(w*SS))
    def rect(self,x0,y0,x1,y1,fill=None,outline=None,w=2):
        self.d.rectangle([x0*SS,y0*SS,x1*SS,y1*SS],fill=fill,outline=outline,width=int(w*SS))
    def circ(self,cx,cy,r,fill=None,outline=None,w=2):
        self.d.ellipse([(cx-r)*SS,(cy-r)*SS,(cx+r)*SS,(cy+r)*SS],fill=fill,outline=outline,width=int(w*SS))
    def ell(self,x0,y0,x1,y1,fill=None,outline=None,w=2):
        self.d.ellipse([x0*SS,y0*SS,x1*SS,y1*SS],fill=fill,outline=outline,width=int(w*SS))
    def arc(self,x0,y0,x1,y1,a0,a1,fill,w=2):
        self.d.arc([x0*SS,y0*SS,x1*SS,y1*SS],a0,a1,fill=fill,width=int(w*SS))
    def text(self,x,y,s,font,fill,anchor="la"):
        self.d.text((x*SS,y*SS),s,font=font,fill=fill,anchor=anchor)
    def bez(self,P,fill,w=2,n=64):
        P=np.array(P,float); t=np.linspace(0,1,n)[:,None]
        pts=((1-t)**3)*P[0]+3*((1-t)**2)*t*P[1]+3*(1-t)*(t**2)*P[2]+(t**3)*P[3]
        self.line([tuple(p) for p in pts],fill,w)
        return pts
    def arrow(self,p0,p1,fill,w=3,head=9):
        self.line([p0,p1],fill,w)
        ang=math.atan2(p1[1]-p0[1],p1[0]-p0[0])
        for da in (math.radians(150),-math.radians(150)):
            self.line([p1,(p1[0]+head*math.cos(ang+da),p1[1]+head*math.sin(ang+da))],fill,w)
    def arrowhead(self,x,y,ang,fill,size=9):
        for da in (math.radians(150),-math.radians(150)):
            self.line([(x,y),(x+size*math.cos(ang+da),y+size*math.sin(ang+da))],fill,int(3))

# ================= FIGURES =================
def fig_barmagnet():
    """Stabmagnet: N (rot) | S (blau), mit Beschriftung."""
    c=C(560,240)
    cy=120; x0,x1=70,490; h=88
    # body halves
    c.rrect(x0,cy-h/2,(x0+x1)/2+2,cy+h/2,8,fill=NRED)
    c.rrect((x0+x1)/2-2,cy-h/2,x1,cy+h/2,8,fill=SBLU)
    c.rrect(x0,cy-h/2,x1,cy+h/2,8,outline=INK,w=3)
    c.line([((x0+x1)/2,cy-h/2),((x0+x1)/2,cy+h/2)],INK,3)
    # shine
    c.rrect(x0+14,cy-h/2+10,x1-14,cy-h/2+22,6,fill=(255,255,255,70))
    c.text((x0+(x0+x1)/2)/2,cy,"N",RND(46),WHITE,anchor="mm")
    c.text(((x0+x1)/2+x1)/2,cy,"S",RND(46),WHITE,anchor="mm")
    c.text(x0+52,cy+h/2+30,"Nordpol",BLD(17),NRED_D,anchor="mm")
    c.text(x1-52,cy+h/2+30,"Südpol",BLD(17),SBLU_D,anchor="mm")
    return c.out()

def fig_poles():
    """Anziehung (N-S) und Abstoßung (N-N) mit Kräftepfeilen."""
    c=C(560,340); h=58; L=118
    def mag(cx,cy,left,right,lc,rc):
        x0,x1=cx-L/2,cx+L/2
        c.rrect(x0,cy-h/2,cx,cy+h/2,6,fill=lc)
        c.rrect(cx,cy-h/2,x1,cy+h/2,6,fill=rc)
        c.rrect(x0,cy-h/2,x1,cy+h/2,6,outline=INK,w=3)
        c.line([(cx,cy-h/2),(cx,cy+h/2)],INK,2)
        c.text((x0+cx)/2,cy,left,RND(26),WHITE,anchor="mm")
        c.text((cx+x1)/2,cy,right,RND(26),WHITE,anchor="mm")
    # Row 1: attraction  ...S][N .. gap .. S][N...
    y=92
    mag(150,y,"S","N",SBLU,NRED); mag(410,y,"S","N",SBLU,NRED)
    c.arrow((222,y),(262,y),GREEN,4,12); c.arrow((338,y),(298,y),GREEN,4,12)
    c.text(280,y-56,"ziehen sich an",RND(19),GREEN,anchor="mm")
    # Row 2: repulsion  ...N][S .. N][S...  -> like poles face: right end N, left end N
    y=250
    mag(150,y,"S","N",SBLU,NRED); mag(410,y,"N","S",NRED,SBLU)
    c.arrow((262,y),(222,y),CORAL,4,12); c.arrow((298,y),(338,y),CORAL,4,12)
    c.text(280,y-56,"stoßen sich ab",RND(19),CORAL,anchor="mm")
    return c.out()

def fig_fieldlines():
    """Feldlinien um Stabmagnet, N->S, mit Pfeilen (Eisenfeilspäne-Muster)."""
    c=C(560,400); cx,cy=280,205; L=150; h=64
    # field loops (draw before magnet so magnet sits on top of pole ends)
    for i,(spread,lift) in enumerate([(1.0,26),(1.28,74),(1.62,126),(2.0,182)]):
        ex=L*spread
        for sgn in (-1,1):  # top & bottom
            P=[(cx-L+18,cy),(cx-ex,cy-sgn*lift),(cx+ex,cy-sgn*lift),(cx+L-18,cy)]
            pts=c.bez(P,STEEL_D,2,80)
            # arrowhead near apex, direction N(left)->S(right) i.e. increasing x
            k=len(pts)//2; a=math.atan2(pts[k+1][1]-pts[k-1][1],pts[k+1][0]-pts[k-1][0])
            c.arrowhead(pts[k][0],pts[k][1],a,STEEL_D,10)
    # axis line through
    c.arrow((cx-L-46,cy),(cx-L-6,cy),STEEL_D,2,9)
    c.arrow((cx+L+6,cy),(cx+L+46,cy),STEEL_D,2,9)
    # magnet
    c.rrect(cx-L,cy-h/2,cx,cy+h/2,7,fill=NRED)
    c.rrect(cx,cy-h/2,cx+L,cy+h/2,7,fill=SBLU)
    c.rrect(cx-L,cy-h/2,cx+L,cy+h/2,7,outline=INK,w=3)
    c.text(cx-L/2,cy,"N",RND(34),WHITE,anchor="mm")
    c.text(cx+L/2,cy,"S",RND(34),WHITE,anchor="mm")
    return c.out()

def fig_compass():
    """Kompass: Rose, rote Nadel nach N."""
    c=C(320,320); cx,cy=160,160; R=132
    c.circ(cx,cy,R,fill=WHITE,outline=STEEL_D,w=5)
    c.circ(cx,cy,R-12,outline=GREY,w=2)
    # ticks + cardinals
    for k in range(0,360,15):
        a=math.radians(k-90); r0=R-12; r1=R-(24 if k%90==0 else 18)
        c.line([(cx+r0*math.cos(a),cy+r0*math.sin(a)),(cx+r1*math.cos(a),cy+r1*math.sin(a))],STEEL_D,2 if k%90 else 3)
    for lab,dx,dy in [("N",0,-1),("O",1,0),("S",0,1),("W",-1,0)]:
        c.text(cx+dx*(R-40),cy+dy*(R-40),lab,RND(24 if lab=="N" else 20),
               NRED_D if lab=="N" else INK,anchor="mm")
    # needle
    c.poly([(cx,cy-R+42),(cx-16,cy),(cx+16,cy)],fill=NRED,outline=NRED_D,w=1)
    c.poly([(cx,cy+R-42),(cx-16,cy),(cx+16,cy)],fill=WHITE,outline=STEEL_D,w=2)
    c.circ(cx,cy,11,fill=STEEL_D,outline=INK,w=2)
    c.circ(cx,cy,4,fill=WHITE)
    return c.out()

def fig_attract():
    """Magnet zieht Eisen an (Nagel, Büroklammer) – Holz/Alu/Kunststoff nicht."""
    c=C(560,300)
    # horseshoe-ish bar magnet on left, pulling
    mx,my=120,150; h=70; L=120
    c.rrect(mx-L,my-h/2,mx-L/2,my+h/2,6,fill=NRED)
    c.rrect(mx-L/2,my-h/2,mx,my+h/2,6,fill=SBLU)
    c.rrect(mx-L,my-h/2,mx,my+h/2,6,outline=INK,w=3)
    c.text(mx-3*L/4,my,"N",RND(26),WHITE,anchor="mm")
    c.text(mx-L/4,my,"S",RND(26),WHITE,anchor="mm")
    # attracted (arrows toward magnet) — nail, paperclip
    c.text(300,52,"wird angezogen",RND(15),GREEN,anchor="mm")
    # nail
    nx,ny=250,110; c.poly([(nx,ny-9),(nx,ny+9),(nx+70,ny+4),(nx+70,ny-4)],fill=STEEL,outline=STEEL_D,w=2)
    c.poly([(nx-14,ny-13),(nx,ny-9),(nx,ny+9),(nx-14,ny+13)],fill=STEEL_D)
    c.arrow((nx-30,ny),(nx-58,ny),GREEN,3,10)
    c.text(nx+40,ny+26,"Eisennagel",BLD(12),GREEN,anchor="mm")
    # paperclip
    px,py=250,190
    c.rrect(px,py-13,px+58,py+13,13,outline=STEEL_D,w=4)
    c.rrect(px+9,py-7,px+50,py+7,7,outline=STEEL_D,w=4)
    c.arrow((px-16,py),(px-44,py),GREEN,3,10)
    c.text(px+30,py+30,"Büroklammer",BLD(12),GREEN,anchor="mm")
    # NOT attracted column
    c.line([(430,40),(430,270)],GREY,2)
    c.text(495,52,"bleibt liegen",RND(15),SUB,anchor="mm")
    # wood block
    c.rrect(455,92,520,126,4,fill=WOOD,outline="#9A7638",w=2); c.text(487,142,"Holz",BLD(12),SUB,anchor="mm")
    # alu can
    c.rrect(462,168,512,214,6,fill="#DfE4EA",outline=STEEL_D,w=2); c.text(487,230,"Alu",BLD(12),SUB,anchor="mm")
    return c.out()

def fig_electromagnet():
    """Elektromagnet: Eisenkern + Spule + Batterie, zieht Büroklammern."""
    c=C(600,340)
    c.text(300,44,"Strom an  »  Magnet an",RND(17),TEAL,anchor="mm")
    coreY=150; cx0,cx1=170,410
    # iron core (nail)
    c.rrect(cx0,coreY-15,cx1,coreY+15,8,fill=STEEL,outline=STEEL_D,w=3)
    # coil loops (copper) over core
    n=9; step=(cx1-cx0-36)/n
    for i in range(n+1):
        xx=cx0+18+i*step
        c.arc(xx-14,coreY-40,xx+14,coreY+40,-70,250,COP,5)
    # wires down to battery
    c.line([(cx0+18,coreY-34),(96,coreY-34),(96,246)],COP,5)
    c.line([(cx1-18,coreY-34),(486,coreY-34),(486,246)],COP,5)
    # battery
    by=262; c.rrect(150,by-8,486,by+40,8,fill="#FFF4D6",outline=GOLD,w=3)
    c.line([(250,by+3),(250,by+29)],INK,5); c.line([(272,by-3),(272,by+35)],INK,2)
    c.line([(364,by+3),(364,by+29)],INK,2); c.line([(386,by-3),(386,by+35)],INK,5)
    c.text(318,by+16,"Batterie",BLD(14),COP,anchor="mm")
    c.text(258,by-4,"+",BLD(16),INK,anchor="mm"); c.text(378,by-4,"–",BLD(16),INK,anchor="mm")
    # attracted paperclips at right pole tip
    for dy in (-16,4,24):
        px=cx1+18
        c.rrect(px,coreY+dy-6,px+30,coreY+dy+6,6,outline=STEEL_D,w=3)
    c.arrow((cx1+64,coreY),(cx1+34,coreY),GREEN,3,10)
    c.text(cx1+50,coreY-46,"zieht Büroklammern an",BLD(12),GREEN,anchor="mm")
    # labels with leaders
    c.line([(210,coreY+15),(210,coreY+40)],SUB,2); c.text(210,coreY+52,"Spule (Draht)",BLD(12),COP,anchor="mm")
    c.line([(cx0+8,coreY+15),(cx0+8,coreY+70)],SUB,2); c.text(cx0+8,coreY+82,"Eisenkern",BLD(12),STEEL_D,anchor="mm")
    return c.out()

# ---- everyday ----
def fig_fridge():
    """Kühlschrank mit bunten Magneten, hält einen Zettel."""
    c=C(300,348)
    c.rrect(60,30,240,340,20,fill="#EDF1F5",outline=STEEL_D,w=4)
    c.line([(60,150),(240,150)],STEEL_D,3)  # door split
    c.rrect(210,70,224,130,6,fill=STEEL_D)  # handle upper
    c.rrect(210,175,224,300,6,fill=STEEL_D) # handle lower
    # note held by magnet
    c.poly([(96,200),(180,205),(176,285),(92,280)],fill=WHITE,outline=GREY,w=2)
    for yy in (222,242,262): c.line([(108,yy),(164,yy+2)],GREY,2)
    # colorful magnets
    for (mx,my,col) in [(120,196,CORAL),(158,200,TEAL),(96,110,GOLD),(150,120,SBLU)]:
        c.circ(mx,my,13,fill=col,outline=WHITE,w=3)
    return c.out()

def fig_crane():
    """Schrottplatz: Elektromagnet-Kran hebt Metallschrott."""
    c=C(360,338)
    # jib
    c.line([(40,40),(300,40)],STEEL_D,7); c.line([(40,40),(40,300)],STEEL_D,7)
    c.poly([(40,40),(120,40),(40,110)],fill="#D7DEE6",outline=STEEL_D,w=3)
    # cable + magnet disk
    mx=250; c.line([(mx,40),(mx,150)],INK,3)
    c.rrect(mx-56,150,mx+56,186,10,fill=STEEL_D,outline=INK,w=3)  # magnet body
    c.rrect(mx-56,182,mx+56,196,4,fill=NRED)  # active face
    c.text(mx,168,"ELEKTRO-MAGNET",RND(9),WHITE,anchor="mm")
    # scrap being lifted (grey chunks)
    for (sx,sy,w0,h0) in [(mx-34,206,30,20),(mx+2,210,34,16),(mx-10,224,26,18),(mx+22,226,20,14)]:
        c.rrect(sx,sy,sx+w0,sy+h0,4,fill=STEEL,outline=STEEL_D,w=2)
    # scrap pile on ground
    c.line([(30,320),(330,320)],SUB,3)
    for (sx,sy,w0,h0) in [(70,300,40,20),(110,306,30,14),(150,298,34,22),(300,304,28,16)]:
        c.rrect(sx,sy,sx+w0,sy+h0,4,fill=GREY,outline=STEEL_D,w=2)
    return c.out()

def fig_maglev():
    """Magnetschwebebahn schwebt über Schiene."""
    c=C(440,214)
    # track / guideway
    c.rrect(20,170,420,198,6,fill="#D7DEE6",outline=STEEL_D,w=3)
    for x in range(44,416,38): c.line([(x,198),(x,210)],STEEL_D,3)
    # train body (one clean rounded shape; right end more rounded = nose)
    c.d.rounded_rectangle([50*SS,74*SS,400*SS,152*SS],radius=38*SS,
                          fill=TEAL,outline="#0E766D",width=4*SS,corners=(True,True,True,True))
    # window band
    for wx in (104,172,240,308):
        c.rrect(wx-24,96,wx+24,128,8,fill=SKY,outline=WHITE,w=3)
    c.circ(370,113,15,fill=SKY,outline=WHITE,w=3)  # nose window
    c.rrect(60,146,388,151,0,fill="#0E766D")  # skirt
    c.text(225,60,"schwebt",RND(15),CORAL,anchor="mm")
    # levitation gap arrows (train pushed up off track)
    for gx in (120,225,330):
        c.arrow((gx,168),(gx,158),CORAL,3,8)
    return c.out()

def fig_closure():
    """Magnetknopf einer Tasche: verschiedene Pole ziehen sich an -> Tasche hält zu."""
    c=C(380,300)
    # bag body
    c.poly([(96,150),(284,150),(266,264),(114,264)],fill=WOOD,outline="#9A7638",w=3)
    # handle
    c.arc(150,70,230,190,180,360,"#9A7638",7)
    # flap (open, tilted up)
    c.poly([(96,150),(284,150),(300,96),(120,84)],fill="#B9863F",outline="#9A7638",w=3)
    # magnet on flap underside + plate on body, about to meet -> "klick"
    c.circ(190,150,15,fill=SBLU,outline=INK,w=2); c.text(190,150,"S",RND(15),WHITE,anchor="mm")
    c.circ(190,120,15,fill=NRED,outline=INK,w=2); c.text(190,120,"N",RND(15),WHITE,anchor="mm")
    c.arrow((190,132),(190,140),GREEN,3,8)
    for a in (-40,0,40):
        aa=math.radians(a-90); c.line([(190+18*math.cos(aa),135+18*math.sin(aa)),
              (190+30*math.cos(aa),135+30*math.sin(aa))],GOLD,2)
    c.text(190,58,"klick!",RND(15),GREEN,anchor="mm")
    return c.out()

def fig_filings():
    """Eisenfeilspäne über Stabmagnet: kleine Spänchen ordnen sich entlang der Feldlinien."""
    import random as _r; _r.seed(7)
    c=C(480,312); cx,cy=240,158; L=118; h=44
    c.rrect(28,34,452,290,14,fill=WHITE,outline="#E3E6EF",w=3)  # paper
    # faint magnet under paper
    c.rrect(cx-L,cy-h/2,cx,cy+h/2,6,fill="#F3C6C9"); c.rrect(cx,cy-h/2,cx+L,cy+h/2,6,fill="#C9D6F2")
    c.rrect(cx-L,cy-h/2,cx+L,cy+h/2,6,outline="#B9C0CC",w=2)
    c.text(cx-L/2,cy,"N",RND(20),"#D98A90",anchor="mm"); c.text(cx+L/2,cy,"S",RND(20),"#93A6D4",anchor="mm")
    def onpaper(x,y): return 40<x<440 and 44<y<280
    def onmag(x,y): return cx-L-2<x<cx+L+2 and cy-h/2-3<y<cy+h/2+3
    for spread,lift in [(0.86,10),(1.05,34),(1.28,64),(1.56,98),(1.9,134),(2.25,170)]:
        ex=L*spread
        for sgn in (-1,1):
            P=[(cx-L+12,cy),(cx-ex,cy-sgn*lift),(cx+ex,cy-sgn*lift),(cx+L-12,cy)]
            t=np.linspace(0.02,0.98,34)[:,None]; Pn=np.array(P,float)
            pts=((1-t)**3)*Pn[0]+3*((1-t)**2)*t*Pn[1]+3*(1-t)*(t**2)*Pn[2]+(t**3)*Pn[3]
            for j in range(len(pts)):
                jn=min(j+1,len(pts)-1); jp=max(j-1,0)
                ang=math.atan2(pts[jn][1]-pts[jp][1],pts[jn][0]-pts[jp][0])
                nx,ny=-math.sin(ang),math.cos(ang)          # Normale -> Späne quer streuen
                for _ in range(2):
                    off=_r.uniform(-7,7)
                    x=pts[j][0]+nx*off+_r.uniform(-2,2); y=pts[j][1]+ny*off+_r.uniform(-2,2)
                    if onmag(x,y) or not onpaper(x,y): continue
                    a=ang+_r.uniform(-0.28,0.28); ln=_r.uniform(2.6,4.2)
                    c.line([(x-ln*math.cos(a),y-ln*math.sin(a)),(x+ln*math.cos(a),y+ln*math.sin(a))],STEEL_D,2)
    return c.out()

def fig_hiking():
    """Wandern mit Kompass: Karte + Kompass + Berge."""
    c=C(440,300)
    # mountains
    c.poly([(40,210),(150,90),(250,210)],fill="#BFD4C6",outline="#8FB0A0",w=2)
    c.poly([(150,90),(180,120),(160,120)],fill=WHITE)  # snow cap
    c.poly([(190,210),(300,120),(400,210)],fill="#A9C6BA",outline="#8FB0A0",w=2)
    c.line([(30,214),(410,214)],"#8FB0A0",3)
    # trail
    c.line([(70,300),(150,250),(210,258),(300,220)],COP,4)
    # folded map
    c.poly([(150,300),(360,300),(340,196),(170,196)],fill="#FBF6E9",outline="#D9CBA6",w=3)
    c.line([(220,300),(232,196)],"#D9CBA6",2); c.line([(288,300),(292,196)],"#D9CBA6",2)
    for yy in (232,252,272): c.line([(186,yy),(320,yy)],"#D9CBA6",1)
    # compass on map
    ccx,ccy,R=250,250,44
    c.circ(ccx,ccy,R,fill=WHITE,outline=STEEL_D,w=4)
    for lab,dx,dy in [("N",0,-1),("S",0,1)]:
        c.text(ccx+dx*(R-14),ccy+dy*(R-14),lab,RND(12),NRED_D if lab=="N" else INK,anchor="mm")
    c.poly([(ccx,ccy-R+14),(ccx-7,ccy),(ccx+7,ccy)],fill=NRED)
    c.poly([(ccx,ccy+R-14),(ccx-7,ccy),(ccx+7,ccy)],fill=WHITE,outline=STEEL_D,w=1)
    c.circ(ccx,ccy,5,fill=STEEL_D)
    c.text(220,292,"",BLD(1),SUB)
    return c.out()

def fig_bell():
    """Elektrische Klingel: Elektromagnet zieht den Klöppel an die Glocke."""
    c=C(440,320)
    # bell dome
    c.arc(150,40,290,180,180,360,INK,5); c.line([(150,110),(290,110)],INK,5)
    c.circ(220,110,7,fill=INK)  # bell mount
    c.arc(190,120,250,150,0,180,STEEL_D,3)  # rim
    # electromagnet (two coils on core) lower left
    coreY=250
    c.rrect(120,coreY-14,210,coreY+14,7,fill=STEEL,outline=STEEL_D,w=3)
    for xx in (140,175):
        for k in range(4): c.arc(xx-2+k*9-14,coreY-30,xx-2+k*9+4,coreY+30,-70,250,COP,4)
    # armature + clapper arm to bell
    c.line([(210,coreY),(300,150)],STEEL_D,5)
    c.circ(300,150,12,fill=STEEL_D,outline=INK,w=2)  # clapper ball near bell rim
    c.arrow((250,coreY-18),(232,coreY-6),GREEN,3,9)
    # button + battery + wires
    c.rrect(60,250,96,286,8,fill=CORAL,outline="#B84A4A",w=3); c.text(78,268,"",BLD(1),WHITE)
    c.text(78,304,"Taster",BLD(11),SUB,anchor="mm")
    by=290; c.rrect(150,by-6,360,by+22,6,fill="#FFF4D6",outline=GOLD,w=3)
    c.line([(210,by),(210,by+16)],INK,4); c.line([(226,by-2),(226,by+18)],INK,2)
    c.text(280,by+8,"Batterie",BLD(11),COP,anchor="mm")
    c.line([(96,268),(120,268)],COP,3); c.line([(210,coreY+10),(210,by-6)],COP,3)
    return c.out()

# ---- Icons für Zuordnungsseite (Magnete im Alltag) ----
def _icon(draw_fn,label):
    c=C(180,180); draw_fn(c); return c.out()
def ic_speaker():
    def f(c):
        c.rrect(46,40,134,140,12,fill="#2E3742",outline=INK,w=3)
        c.circ(90,90,34,fill="#4A5563",outline=INK,w=3); c.circ(90,90,14,fill=STEEL,outline=INK,w=2)
        for r in (48,60,72): c.arc(90-r,90-r,90+r,90+r,-40,40,SUB,3)
    return _icon(f,"Lautsprecher")
def ic_headphones():
    def f(c):
        c.arc(40,44,140,150,180,360,INK,7)
        c.rrect(38,92,66,140,12,fill=CORAL,outline=INK,w=3)
        c.rrect(114,92,142,140,12,fill=CORAL,outline=INK,w=3)
    return _icon(f,"Kopfhörer")
def ic_phone():
    def f(c):
        c.rrect(60,30,120,150,14,fill="#2E3742",outline=INK,w=3)
        c.rrect(66,44,114,132,4,fill=SKY)
        c.circ(90,40,3,fill=STEEL); c.rrect(80,136,100,142,3,fill=STEEL_D)
    return _icon(f,"Handy")
def ic_motor():
    def f(c):
        c.rrect(50,60,120,130,10,fill=TEAL,outline="#0E766D",w=3)
        c.ell(108,60,150,130,fill="#0E766D",outline=INK,w=3)
        c.line([(150,95),(168,95)],INK,5)  # shaft
        c.text(85,95,"M",RND(26),WHITE,anchor="mm")
    return _icon(f,"Elektromotor")
def ic_doorbell():
    def f(c):
        c.rrect(58,40,122,150,12,fill="#EDF1F5",outline=STEEL_D,w=3)
        c.circ(90,84,20,fill=CORAL,outline="#B84A4A",w=3)
        c.arc(74,110,106,132,180,360,SUB,3); c.circ(90,124,4,fill=SUB)
    return _icon(f,"Türklingel")
def ic_card():
    def f(c):
        c.rrect(40,58,140,132,10,fill=SBLU,outline=SBLU_D,w=3)
        c.rect(40,72,140,92,fill=INK)  # magnetic stripe
        c.rrect(56,104,78,124,4,fill=GOLD,outline="#B8862B",w=2)  # chip
    return _icon(f,"EC-Karte")

def fig_coin():
    """1-Cent-Münze (Kupferoberfläche) für die Münz-Aufgabe."""
    c=C(180,180); cx,cy=90,90
    c.circ(cx,cy,70,fill="#B9752F",outline="#8A551F",w=4)
    c.circ(cx,cy,58,fill="#D2924A",outline="#A96B2C",w=3)
    c.arc(cx-40,cy-42,cx+4,cy+2,150,250,(255,255,255,120),4)  # dezenter Glanz oben links
    c.text(cx,cy-6,"1",RND(46),"#6E421A",anchor="mm")
    c.text(cx,cy+32,"CENT",RND(12),"#6E421A",anchor="mm")
    return c.out()

def fig_nailpoles():
    """Stabmagnet: Büroklammern kleben an den Enden (Polen), in der Mitte fällt eine ab."""
    c=C(560,250); cy=112; x0,x1=150,410; h=60; mid=(x0+x1)/2
    c.rrect(x0,cy-h/2,mid,cy+h/2,7,fill=NRED); c.rrect(mid,cy-h/2,x1,cy+h/2,7,fill=SBLU)
    c.rrect(x0,cy-h/2,x1,cy+h/2,7,outline=INK,w=3)
    c.text((x0+mid)/2,cy,"N",RND(26),WHITE,anchor="mm"); c.text((mid+x1)/2,cy,"S",RND(26),WHITE,anchor="mm")
    # Klammern kleben an beiden Polen (waagerecht gestapelt)
    for dy in (-17,0,17):
        c.rrect(x0-44,cy+dy-6,x0-4,cy+dy+6,6,outline=STEEL_D,w=3)
        c.rrect(x1+4,cy+dy-6,x1+44,cy+dy+6,6,outline=STEEL_D,w=3)
    # Mitte: eine Klammer fällt ab
    c.arrow((mid,cy+h/2+8),(mid,cy+h/2+30),SUB,3,9)
    c.rrect(mid-20,cy+h/2+34,mid+20,cy+h/2+48,6,outline=STEEL_D,w=3)
    c.text(x0-24,cy-46,"hält",BLD(12),GREEN,anchor="mm"); c.text(x1+24,cy-46,"hält",BLD(12),GREEN,anchor="mm")
    c.text(mid+52,cy+h/2+42,"fällt ab",BLD(12),SUB,anchor="lm")
    return c.out()

def fig_magcart():
    """Zwei LEERE Magnet-Wagen (zum Selbst-Einzeichnen der Pole) – Umrisse."""
    c=C(470,150)
    def cart(cx):
        w0=160; y0=34; y1=84
        c.rrect(cx-w0/2,y0,cx+w0/2,y1,7,outline=INK,w=4)
        c.line([(cx,y0),(cx,y1)],INK,4)
        c.circ(cx-w0/2+24,y1+18,13,fill=WHITE,outline=INK,w=4)
        c.circ(cx+w0/2-24,y1+18,13,fill=WHITE,outline=INK,w=4)
    cart(122); cart(348)
    return c.out()

PURPLE="#7C6CF0"; PINK="#F06CA8"
# ---------- Alltags-Anwendungen (kindnah, für Galerie) ----------
def u_fishing():
    """Magnet-Angelspiel."""
    c=C(180,170)
    c.rrect(14,120,166,156,12,fill=SKY,outline="#9CC7DA",w=2)
    for wx in (44,90,136): c.arc(wx-12,116,wx+12,130,190,350,"#9CC7DA",2)
    c.ell(64,116,120,148,fill=CORAL,outline="#C24E4E",w=3); c.poly([(64,132),(44,118),(44,146)],fill=CORAL,outline="#C24E4E",w=2)
    c.circ(104,126,3,fill=INK); c.circ(96,110,6,outline=STEEL_D,w=3)
    c.line([(150,18),(96,92)],WOOD,5); c.line([(96,92),(96,104)],INK,2)
    c.rrect(87,98,105,110,3,fill=NRED,outline=INK,w=2)
    return c.out()
def u_letters():
    """Magnetbuchstaben auf einer Fläche."""
    c=C(180,170)
    c.line([(14,140),(166,140)],GREY,3)
    for i,(ch,col) in enumerate([("A",CORAL),("B",TEAL),("C",GOLD)]):
        x=34+i*46
        c.rrect(x,74,x+38,138,8,fill=col,outline=WHITE,w=3)
        c.text(x+19,104,ch,RND(28),WHITE,anchor="mm")
    return c.out()
def u_knife():
    """Magnetische Messerleiste an der Wand."""
    c=C(180,170)
    c.rrect(30,40,150,58,5,fill=STEEL,outline=STEEL_D,w=3)  # Leiste
    for kx in (58,90,122):
        c.rrect(kx-5,58,kx+5,118,3,fill="#C9CFD8",outline=STEEL_D,w=2)   # Klinge
        c.rrect(kx-7,116,kx+7,140,4,fill=WOOD,outline="#9A7638",w=2)     # Griff
    return c.out()
def u_screwdriver():
    """Schraubendreher hält eine Schraube (magnetische Spitze)."""
    c=C(180,170)
    c.rrect(40,40,64,120,10,fill=CORAL,outline="#C24E4E",w=3)  # Griff
    c.rect(62,68,120,92,fill=STEEL,outline=STEEL_D,w=2)        # Schaft
    c.poly([(120,68),(140,74),(140,86),(120,92)],fill=STEEL_D) # Spitze
    c.rrect(140,72,158,88,3,fill="#C9CFD8",outline=STEEL_D,w=2)  # Schraube
    c.line([(158,74),(158,86)],STEEL_D,2)
    return c.out()
def u_tiles():
    """Magnetische Bauplättchen."""
    c=C(180,170)
    c.poly([(90,44),(126,104),(54,104)],outline=CORAL,w=6)
    c.rrect(52,104,128,150,6,outline=TEAL,w=6)
    c.rrect(96,66,140,110,6,outline=PURPLE,w=6)
    return c.out()
def u_board():
    """Magnettafel mit Zettel und runden Magneten."""
    c=C(180,170)
    c.rrect(20,26,160,140,10,fill="#EDF1F5",outline=STEEL_D,w=4)
    c.poly([(64,50),(120,54),(116,110),(60,106)],fill=WHITE,outline=GREY,w=2)
    for yy in (68,84,100): c.line([(74,yy),(108,yy+1)],GREY,2)
    for (mx,my,col) in [(52,44,CORAL),(128,60,TEAL),(60,120,GOLD)]:
        c.circ(mx,my,11,fill=col,outline=WHITE,w=3)
    return c.out()
def u_badge():
    """Namensschild mit Magnetclip."""
    c=C(180,150)
    c.rrect(30,44,150,110,8,fill=WHITE,outline=STEEL_D,w=3)
    c.rrect(30,44,150,64,8,fill=TEAL)
    c.text(90,54,"NAME",RND(12),WHITE,anchor="mm")
    c.line([(44,84),(136,84)],GREY,2); c.line([(44,96),(120,96)],GREY,2)
    c.rrect(70,108,110,120,4,fill=STEEL_D)  # Magnetclip
    return c.out()

# ---------- Objekt-Icons (Materialien für „zieht der Magnet an?") ----------
def o_nail():
    c=C(150,150)
    c.ell(55,30,95,46,fill=STEEL,outline=STEEL_D,w=3)
    c.rect(68,42,82,112,fill=STEEL,outline=STEEL_D,w=2)
    c.poly([(68,112),(82,112),(75,130)],fill=STEEL_D)
    return c.out()
def o_clip():
    c=C(150,150)
    c.rrect(50,38,100,120,26,outline=STEEL_D,w=6)
    c.rrect(62,52,88,106,14,outline=STEEL_D,w=6)
    return c.out()
def o_key():
    c=C(150,150)
    c.circ(52,64,20,fill=GOLD,outline="#B8862B",w=3); c.circ(52,64,8,fill=WHITE)
    c.rrect(70,58,122,70,3,fill=GOLD,outline="#B8862B",w=2)
    c.rect(98,70,106,84,fill=GOLD); c.rect(112,70,120,80,fill=GOLD)
    return c.out()
def o_can():
    c=C(150,150)
    c.rrect(54,34,96,118,9,fill="#DCE1E7",outline=STEEL_D,w=3)
    c.ell(54,27,96,43,fill="#EDF1F5",outline=STEEL_D,w=2)
    c.rrect(66,52,84,98,4,fill=CORAL,outline="#C24E4E",w=2)
    return c.out()
def o_wood():
    c=C(150,150)
    c.rrect(34,54,116,98,8,fill=WOOD,outline="#9A7638",w=3)
    for yy in (66,78,90): c.line([(46,yy),(104,yy)],"#9A7638",2)
    return c.out()
def o_glass():
    c=C(150,150)
    c.circ(75,76,40,fill="#D6EEF5",outline="#9CC7DA",w=3)
    c.arc(52,52,92,92,150,235,WHITE,5)
    return c.out()
# ---------- weitere Alltagsszenen ----------
def u_mrt():
    c=C(210,170)
    c.rrect(28,26,168,148,18,fill="#E3E8EF",outline=STEEL_D,w=4)
    c.circ(98,86,42,fill="#2E3742",outline=INK,w=3); c.circ(98,86,29,fill="#4A5563")
    c.rrect(78,120,196,138,6,fill=WHITE,outline=STEEL_D,w=3)
    c.rrect(150,116,186,140,6,fill=SKY,outline=STEEL_D,w=2)
    return c.out()
def u_ship():
    c=C(210,180)
    c.rrect(16,140,194,162,10,fill=SKY,outline="#9CC7DA",w=2)
    for wx in (54,110,166): c.arc(wx-12,138,wx+12,152,190,350,"#9CC7DA",2)
    c.poly([(52,112),(158,112),(140,142),(70,142)],fill=WOOD,outline="#9A7638",w=3)
    c.line([(105,112),(105,36)],INK,4)
    c.poly([(108,42),(108,106),(156,106)],fill=CORAL,outline="#C24E4E",w=2)
    c.poly([(102,50),(102,104),(62,104)],fill=WHITE,outline=GREY,w=2)
    return c.out()
def u_birds():
    c=C(210,150)
    c.circ(176,34,15,fill=GOLD)
    def b(x,y,s=15):
        c.line([(x-s,y+s*0.55),(x,y)],INK,3); c.line([(x,y),(x+s,y+s*0.55)],INK,3)
    for (x,y) in [(100,44),(70,62),(130,62),(44,80),(156,80)]: b(x,y)
    return c.out()

FIGS={
 "barmagnet":fig_barmagnet,"poles":fig_poles,"fieldlines":fig_fieldlines,
 "coin":fig_coin,"nailpoles":fig_nailpoles,"magcart":fig_magcart,
 "u_fishing":u_fishing,"u_letters":u_letters,"u_knife":u_knife,"u_screwdriver":u_screwdriver,
 "u_tiles":u_tiles,"u_board":u_board,"u_badge":u_badge,
 "o_nail":o_nail,"o_clip":o_clip,"o_key":o_key,"o_can":o_can,"o_wood":o_wood,"o_glass":o_glass,
 "u_mrt":u_mrt,"u_ship":u_ship,"u_birds":u_birds,
 "compass":fig_compass,"attract":fig_attract,"electromagnet":fig_electromagnet,
 "fridge":fig_fridge,"crane":fig_crane,"maglev":fig_maglev,
 "closure":fig_closure,"filings":fig_filings,"hiking":fig_hiking,"bell":fig_bell,
 "ic_speaker":ic_speaker,"ic_headphones":ic_headphones,"ic_phone":ic_phone,
 "ic_motor":ic_motor,"ic_doorbell":ic_doorbell,"ic_card":ic_card,
}

if __name__=="__main__":
    import sys
    made={}
    for name,fn in FIGS.items():
        im=fn(); im.save(os.path.join(IMG,f"fig_{name}.png")); made[name]=im
        print("fig_%s.png %dx%d"%(name,im.width,im.height))
    # contact sheet
    cols=3; pad=16; cw=600; ch=380
    rows=(len(made)+cols-1)//cols
    sheet=Image.new("RGB",(cols*cw+pad,(rows)*ch+pad),"#FFFDF7")
    dd=ImageDraw.Draw(sheet); f=_font("Arial Bold.ttf",int(15))
    for i,(name,im) in enumerate(made.items()):
        r,cc=divmod(i,cols); x=pad+cc*cw; y=pad+r*ch
        im2=im.copy(); im2.thumbnail((cw-pad,ch-pad-24))
        sheet.paste(im2,(x,y+24),im2); dd.text((x,y),name,font=f,fill="#26303B")
    sheet.save(os.path.join(HERE,"fig_sheet.png")); print("SHEET fig_sheet.png")
