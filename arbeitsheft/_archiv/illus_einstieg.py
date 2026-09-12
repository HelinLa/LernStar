# -*- coding: utf-8 -*-
"""Warme, flache Eigen-Illustrationen fuer den Einstieg (copyright-sicher, selbst gezeichnet).
Ein Baukasten aus Objekten -> 30 Szenen -> img/einstieg_<id>.png (Anzeige ~300x180).
Contact-Sheet: python3 illus_einstieg.py sheet   |   Alle bauen: python3 illus_einstieg.py"""
import math, os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE=os.path.dirname(os.path.abspath(__file__)); IMG=os.path.join(HERE,"img"); os.makedirs(IMG,exist_ok=True)
SS=3; W,H=300,180; CW,CH=W*SS,H*SS
def s(v): return int(v*SS)
_FC={}
def _fbold(px):                       # einzige Textschrift hier: N/S auf den Magnetpolen
    if px not in _FC: _FC[px]=ImageFont.truetype(os.path.join(HERE,"fonts","SourceSans3-Bold.ttf"),px)
    return _FC[px]

# ---- Palette ----
CREAM_T=(255,247,232); CREAM_B=(249,232,206)
NIGHT_T=(38,46,86); NIGHT_B=(18,22,50)
GOLD=(196,150,58); GOLDL=(230,201,128); GOLD_MUTE=(150,132,86)
RED=(203,72,60); RED_D=(150,46,40)
BLUE=(58,96,172); BLUE_D=(38,64,126)
METAL=(160,168,186); METAL_D=(112,120,142); METAL_L=(210,215,226)
INK=(44,50,74); SUB=(120,120,132)
DESK=(233,214,178); DESK_E=(212,188,148)
WOOD=(206,168,116); WOOD_D=(168,128,84)
SUN=(245,196,74); SUN_D=(226,150,44)
MOON=(238,235,222); MOON_SH=(198,198,190); MOONRED=(184,78,62)
EBLUE=(74,132,190); EGREEN=(96,164,112); ENIGHT=(34,48,84)
GLASSC=(176,206,224); WATER=(120,178,212); WATER_D=(92,150,186)
ICE=(200,226,238); ICE_D=(150,192,216)
BON=(255,222,120); BOFF=(226,226,216); BGLOW=(255,236,170)
YEL=(242,206,92); YEL_D=(212,168,60)
GREEN=(120,172,110); SKIN=(232,190,150); SKIN_D=(198,150,110)
SHADOW=(60,52,40); WAVE=(96,120,170)

def _round_mask(w,h,r):
    m=Image.new("L",(w,h),0); ImageDraw.Draw(m).rounded_rectangle([0,0,w-1,h-1],radius=r,fill=255); return m
def _vgrad(w,h,top,bot):
    g=Image.new("RGB",(w,h),top); px=g.load()
    for y in range(h):
        t=y/(h-1); c=tuple(int(top[i]+(bot[i]-top[i])*t) for i in range(3))
        for x in range(w): px[x,y]=c
    return g
def card(night=False):
    im=Image.new("RGBA",(CW,CH),(0,0,0,0)); r=s(28); mask=_round_mask(CW,CH,r)
    top,bot=((NIGHT_T,NIGHT_B) if night else (CREAM_T,CREAM_B))
    im.paste(_vgrad(CW,CH,top,bot).convert("RGBA"),(0,0),mask)
    d=ImageDraw.Draw(im)
    d.rounded_rectangle([s(2),s(2),CW-s(2),CH-s(2)],radius=r-s(2),outline=(GOLD_MUTE if night else GOLD),width=s(1.6))
    return im,d,mask
def clip_card(layer,mask): return Image.composite(layer,Image.new("RGBA",(CW,CH),(0,0,0,0)),mask)
def shadow(im,cx,cy,rx,ry,alpha=60,blur=9):
    sh=Image.new("RGBA",(CW,CH),(0,0,0,0)); ImageDraw.Draw(sh).ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=(*SHADOW,alpha))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(s(blur))))
def spark(d,x,y,r,col=GOLDL):
    r=s(r); d.polygon([(x,y-r),(x+r*0.28,y-r*0.28),(x+r,y),(x+r*0.28,y+r*0.28),(x,y+r),(x-r*0.28,y+r*0.28),(x-r,y),(x-r*0.28,y-r*0.28)],fill=(*col,255))
def dashed(d,p0,p1,c,col=GOLD,dash=9,w=2.2):
    pts=[]
    for i in range(61):
        t=i/60; x=(1-t)**2*p0[0]+2*(1-t)*t*c[0]+t*t*p1[0]; y=(1-t)**2*p0[1]+2*(1-t)*t*c[1]+t*t*p1[1]; pts.append((x,y))
    on=True; acc=0
    for i in range(len(pts)-1):
        acc+=math.dist(pts[i],pts[i+1])
        if on: d.line([pts[i],pts[i+1]],fill=(*col,255),width=s(w))
        if acc>s(dash): on=not on; acc=0
def waves(d,cx,cy,r0,n,col,ang0=200,ang1=340,w=2.4,step=16):
    for k in range(n):
        rr=s(r0+k*step); d.arc([cx-rr,cy-rr,cx+rr,cy+rr],ang0,ang1,fill=(*col,255),width=s(w))
def rot(layer,cx,cy,ang): return layer.rotate(ang,center=(cx,cy),resample=Image.BICUBIC)
def L(): return Image.new("RGBA",(CW,CH),(0,0,0,0))

# ---------------- Objekte ----------------
def o_bar_magnet(im,cx,cy,Ln,Th,ang=0,labels=False):
    lay=L(); x0,y0,x1,y1=cx-Ln//2,cy-Th//2,cx+Ln//2,cy+Th//2; r=Th//2
    mask=Image.new("L",(CW,CH),0); ImageDraw.Draw(mask).rounded_rectangle([x0,y0,x1,y1],radius=r,fill=255)
    halves=L(); dh=ImageDraw.Draw(halves); dh.rectangle([x0,y0,cx,y1],fill=(*RED,255)); dh.rectangle([cx,y0,x1,y1],fill=(*BLUE,255))
    lay=Image.composite(halves,lay,mask); d=ImageDraw.Draw(lay)
    gl=L(); ImageDraw.Draw(gl).rounded_rectangle([x0+s(8),y0+s(6),x1-s(8),y0+Th//3],radius=r,fill=(255,255,255,70))
    lay.alpha_composite(clip_card(gl,mask))
    d.line([(cx,y0+s(2)),(cx,y1-s(2))],fill=(255,255,255,120),width=s(1.4))
    rr=L(); ImageDraw.Draw(rr).rounded_rectangle([x0,y0,x1,y1],radius=r,outline=(30,34,54,90),width=s(1.4)); lay.alpha_composite(rr)
    if labels:                        # rote Haelfte = Nord, blaue = Sued (wie h.magnet im Diagrammteil).
        d=ImageDraw.Draw(lay); f=_fbold(int(Th*0.52))
        d.text((cx-Ln//4,cy),"N",font=f,fill=(*CREAM_T,255),anchor="mm")
        d.text((cx+Ln//4,cy),"S",font=f,fill=(*CREAM_T,255),anchor="mm")
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_horseshoe(im,cx,cy,sc,ang=0):
    lay=L(); d=ImageDraw.Draw(lay); w=s(20*sc); R=s(34*sc)
    # U-Bogen
    d.arc([cx-R,cy-R,cx+R,cy+R],20,340,fill=(120,120,130,255),width=w)  # base ring hidden
    # linker (rot) + rechter (blau) Schenkel
    d.line([(cx-R+w//2,cy),(cx-R+w//2,cy+s(46*sc))],fill=(*RED,255),width=w)
    d.line([(cx+R-w//2,cy),(cx+R-w//2,cy+s(46*sc))],fill=(*BLUE,255),width=w)
    d.arc([cx-R,cy-R,cx+R,cy+R],180,360,fill=(120,120,130,255),width=w)
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_paperclip(im,cx,cy,sc,ang=0,col=METAL):
    # Die Drahtstaerke muss mitskalieren. Fest auf s(6.2) verschmolz die Klammer
    # bei kleinen sc zu einer grauen Kapsel - die Buegel waren duenner als der Strich.
    lay=L(); d=ImageDraw.Draw(lay); w=max(s(2.0),s(6.2*sc))
    d.rounded_rectangle([cx-s(14*sc),cy-s(30*sc),cx+s(14*sc),cy+s(30*sc)],radius=s(14*sc),outline=(*col,255),width=w)
    d.rounded_rectangle([cx-s(7*sc),cy-s(30*sc),cx+s(7*sc),cy+s(20*sc)],radius=s(7*sc),outline=(*col,255),width=w)
    d.line([(cx-s(9*sc),cy-s(22*sc)),(cx-s(9*sc),cy-s(6*sc))],fill=(255,255,255,150),width=s(2))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_rod(im,cx,cy,ln,th,col,col_d,ang=0,grain=False):
    """Stab in einem beliebigen Werkstoff: Holzstab, Bleistiftmine, Kupferdraht ...
       EIN Bauteil, mehrere Farben - statt fuer jeden Stoff eine eigene Zeichnung."""
    lay=L(); d=ImageDraw.Draw(lay)
    d.rounded_rectangle([cx-ln//2,cy-th//2,cx+ln//2,cy+th//2],radius=th//2,
                        fill=(*col,255),outline=(*col_d,255),width=s(1.3))
    d.line([(cx-ln//2+th,cy-th//5),(cx+ln//2-th,cy-th//5)],fill=(255,255,255,90),width=s(1.6))
    if grain:
        for f in (-0.22,0.16):
            d.line([(cx+int(ln*f)-th//2,cy-th//4),(cx+int(ln*f)+th//2,cy+th//4)],fill=(*col_d,140),width=s(1.2))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_foil(im,cx,cy,sc=1.0):
    """Zusammengeknuellte Alufolie."""
    d=ImageDraw.Draw(im); u=lambda v:s(v*sc)
    d.polygon([(cx-u(20),cy+u(3)),(cx-u(13),cy-u(11)),(cx-u(2),cy-u(4)),(cx+u(7),cy-u(13)),
               (cx+u(20),cy-u(1)),(cx+u(13),cy+u(11)),(cx-u(5),cy+u(13))],
              fill=(*METAL_L,255),outline=(*METAL_D,255),width=s(1.4))
    d.line([(cx-u(10),cy-u(6)),(cx-u(2),cy+u(6))],fill=(*METAL_D,150),width=s(1.3))
    d.line([(cx+u(6),cy-u(8)),(cx+u(9),cy+u(6))],fill=(*METAL_D,150),width=s(1.3))
    d.line([(cx-u(15),cy-u(1)),(cx-u(7),cy-u(9))],fill=(255,255,255,170),width=s(1.6))
def o_ruler(im,cx,cy,ln,th,ang=0):
    """Plastiklineal."""
    lay=L(); d=ImageDraw.Draw(lay)
    d.rounded_rectangle([cx-ln//2,cy-th//2,cx+ln//2,cy+th//2],radius=s(3),
                        fill=(176,212,204,255),outline=(112,160,152,255),width=s(1.3))
    for k in range(1,6):
        xx=cx-ln//2+k*ln//6
        d.line([(xx,cy-th//2),(xx,cy-th//2+(th//2 if k%2 else th//3))],fill=(92,138,130,255),width=s(1.2))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_eraser(im,cx,cy,w,h,ang=0):
    """Radiergummi."""
    lay=L(); d=ImageDraw.Draw(lay)
    d.rounded_rectangle([cx-w//2,cy-h//2,cx+w//2,cy+h//2],radius=s(4),
                        fill=(226,150,144,255),outline=(182,104,98,255),width=s(1.3))
    d.rounded_rectangle([cx-w//2,cy-h//2,cx+w//2,cy-h//8],radius=s(4),fill=(244,232,222,255))
    d.line([(cx-w//2,cy-h//8),(cx+w//2,cy-h//8)],fill=(182,104,98,180),width=s(1.2))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_clipcable(im,cx,cy,ln,col,ang=0):
    """Kabel mit Krokodilklemme an beiden Enden. Die Klemme wird im Heft im Text
       zugesagt, war aber bisher nirgends gezeichnet."""
    lay=L(); d=ImageDraw.Draw(lay); h=s(9)
    pts=[(cx-ln//2+int(ln*t/12), cy+int(h*math.sin(math.pi*t/12))) for t in range(13)]
    d.line(pts,fill=(*col,255),width=s(4.5),joint="curve")
    for sgn in (-1,1):                                   # Klemmen
        x=cx+sgn*ln//2
        d.polygon([(x+sgn*s(11),cy-s(5)),(x-sgn*s(2),cy-s(6)),(x-sgn*s(2),cy+s(6)),(x+sgn*s(11),cy+s(5))],
                  fill=(*METAL,255),outline=(*METAL_D,255),width=s(1.2))
        d.line([(x+sgn*s(11),cy-s(1)),(x-sgn*s(1),cy-s(1))],fill=(*METAL_D,200),width=s(1.2))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_steelball(im,cx,cy,r):
    """Stahlkugel aus einem Radlager."""
    d=ImageDraw.Draw(im)
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=(*METAL,255),outline=(*METAL_D,255),width=s(1.2))
    d.ellipse([cx-r*0.6,cy-r*0.65,cx-r*0.05,cy-r*0.1],fill=(255,255,255,160))
def o_stickmagnet(im,cx,cy,ln,ang=0):
    """Angelmagnet am Stiel - das Werkzeug, das in jeder Werkstatt an der Wand haengt."""
    lay=L(); d=ImageDraw.Draw(lay)
    d.rounded_rectangle([cx-ln//2,cy-s(4),cx+ln//2-s(14),cy+s(4)],radius=s(4),
                        fill=(*WOOD,255),outline=(*WOOD_D,255),width=s(1.3))
    d.line([(cx-ln//2+s(6),cy-s(1.5)),(cx+ln//2-s(22),cy-s(1.5))],fill=(255,255,255,100),width=s(1.6))
    d.rounded_rectangle([cx+ln//2-s(20),cy-s(10),cx+ln//2,cy+s(10)],radius=s(3),
                        fill=(*METAL_D,255),outline=(*INK,255),width=s(1.4))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_tape(im,cx,cy,w,h,col,ang=0):
    """Kreppbandstreifen zum Markieren."""
    lay=L(); d=ImageDraw.Draw(lay)
    d.rectangle([cx-w//2,cy-h//2,cx+w//2,cy+h//2],fill=(*col,240))
    d.line([(cx-w//2,cy-h//2),(cx+w//2,cy-h//2)],fill=(255,255,255,110),width=s(1.2))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_rim(im,cx,cy,r):
    """Fahrradfelge von der Seite. Beide Felgen sehen absichtlich gleich aus."""
    d=ImageDraw.Draw(im)
    d.ellipse([cx-r,cy-r,cx+r,cy+r],outline=(*METAL,255),width=s(8))
    d.ellipse([cx-r,cy-r,cx+r,cy+r],outline=(*METAL_D,255),width=s(1.4))
    rr=r-s(8)
    d.ellipse([cx-rr,cy-rr,cx+rr,cy+rr],outline=(*METAL_D,170),width=s(1.3))
    d.arc([cx-r+s(3),cy-r+s(3),cx+r-s(3),cy-r+s(20)],200,340,fill=(255,255,255,150),width=s(2))
def o_leiste(im,x0,y0,w,h,n=3,fehlt=None,band=0):
    """Holzleiste mit n Nuten und gleichen, blanken Stabmagneten.
       fehlt=k laesst eine Nut leer (als sichtbare Vertiefung, nicht als Loch).
       band>0 haengt unten ein Stueck Holz an, auf das Markierungen geklebt werden.
       Gibt (Mittelpunkte der Plaetze, y des Bandes, Segmentbreite) zurueck."""
    d=ImageDraw.Draw(im); H=h+band
    d.rounded_rectangle([x0,y0,x0+w,y0+H],radius=s(4),fill=(*WOOD,255),outline=(*WOOD_D,255),width=s(2))
    seg=(w-s(16))//n; mitten=[]
    for k in range(n):
        a=x0+s(8)+k*seg; mitten.append(a+seg//2)
        d.rounded_rectangle([a+s(3),y0+s(7),a+seg-s(3),y0+h-s(7)],radius=s(3),   # die Nut
                            fill=(*WOOD_D,190),outline=(*WOOD_D,255),width=s(1.2))
        if k==fehlt: continue
        d.rounded_rectangle([a+s(6),y0+s(10),a+seg-s(6),y0+h-s(10)],radius=s(2),
                            fill=(*METAL,255),outline=(*METAL_D,255),width=s(1.3))
        d.line([(a+s(10),y0+s(14)),(a+seg-s(10),y0+s(14))],fill=(255,255,255,110),width=s(1.6))
    return mitten, y0+h+band//2, seg
def o_zange(im,cx,cy,sc=1.0,ang=0):
    """Wasserpumpenzange: zwei Griffe, Gelenk, gezahntes Maul."""
    lay=L(); d=ImageDraw.Draw(lay); u=lambda v:s(v*sc)
    gx=cx+u(2)                                            # Gelenk
    for sg in (-1,1):                                     # Griffe nach links
        d.line([(cx-u(38),cy+sg*u(13)),(cx-u(12),cy+sg*u(6)),(gx,cy)],
               fill=(*METAL_D,255),width=u(8),joint="curve")
    for sg in (-1,1):                                     # Maul nach rechts
        d.line([(gx,cy),(cx+u(16),cy+sg*u(9)),(cx+u(30),cy+sg*u(5))],
               fill=(*METAL_D,255),width=u(7),joint="curve")
    for k in range(3):                                    # Zaehne
        d.line([(cx+u(18+k*5),cy-u(5)),(cx+u(18+k*5),cy+u(5))],fill=(*METAL_L,220),width=u(1.6))
    d.ellipse([gx-u(6),cy-u(6),gx+u(6),cy+u(6)],fill=(*METAL,255),outline=(*INK,255),width=u(1.4))
    d.ellipse([gx-u(2),cy-u(2),gx+u(2),cy+u(2)],fill=(*INK,255))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_nail(im,cx,cy,ln,ang=0):
    lay=L(); d=ImageDraw.Draw(lay); w=s(7)
    d.line([(cx,cy-ln//2),(cx,cy+ln//2)],fill=(*METAL,255),width=w)
    d.line([(cx,cy-ln//2),(cx,cy+ln//2)],fill=(255,255,255,110),width=s(2))
    d.ellipse([cx-s(11),cy-ln//2-s(6),cx+s(11),cy-ln//2+s(6)],fill=(*METAL_D,255))
    d.polygon([(cx-w//2,cy+ln//2),(cx+w//2,cy+ln//2),(cx,cy+ln//2+s(9))],fill=(*METAL_D,255))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_can(im,cx,cy,w,h,col=METAL):
    d=ImageDraw.Draw(im)
    d.rounded_rectangle([cx-w//2,cy-h//2,cx+w//2,cy+h//2],radius=s(7),fill=(*col,255),outline=(*METAL_D,255),width=s(1.6))
    d.ellipse([cx-w//2,cy-h//2-s(5),cx+w//2,cy-h//2+s(8)],fill=(*METAL_L,255),outline=(*METAL_D,255),width=s(1.4))
    d.line([(cx-w//2+s(7),cy-h//4),(cx-w//2+s(7),cy+h//4)],fill=(255,255,255,120),width=s(3))
    d.line([(cx-w//2,cy-s(2)),(cx+w//2,cy-s(2))],fill=(*METAL_D,120),width=s(1.2))
def o_ring(im,cx,cy,rx,ry,col,face=None):
    d=ImageDraw.Draw(im); face=face or col
    d.ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=(*col,255),outline=(30,34,54,120),width=s(1.4))
    d.ellipse([cx-rx*0.42,cy-ry*0.42,cx+rx*0.42,cy+ry*0.42],fill=(*CREAM_B,255),outline=(30,34,54,90),width=s(1.2))
def o_pencil(im,x,y0,y1):
    d=ImageDraw.Draw(im); w=s(13)
    d.line([(x,y0+s(16)),(x,y1)],fill=(*YEL,255),width=w)
    d.line([(x-s(3),y0+s(16)),(x-s(3),y1)],fill=(255,255,255,90),width=s(3))
    d.polygon([(x-w//2,y0+s(16)),(x+w//2,y0+s(16)),(x,y0)],fill=(*SKIN,255))
    d.polygon([(x-s(3),y0+s(8)),(x+s(3),y0+s(8)),(x,y0)],fill=(*INK,255))
def o_compass(im,cx,cy,r,nadel=0):
    d=ImageDraw.Draw(im)
    d.ellipse([cx-r-s(6),cy-r-s(6),cx+r+s(6),cy+r+s(6)],fill=(*METAL,255),outline=(*METAL_D,255),width=s(2))
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=(252,248,236,255),outline=(*METAL_D,255),width=s(1.6))
    for a in range(0,360,45):
        dx,dy=math.cos(math.radians(a)),math.sin(math.radians(a))
        d.line([(cx+dx*r*0.82,cy+dy*r*0.82),(cx+dx*r*0.96,cy+dy*r*0.96)],fill=(*SUB,255),width=s(1.4))
    d.text  # noop guard
    # Nadel - drehbar, damit eine gestoerte Nadel darstellbar ist
    nl=L(); nd=ImageDraw.Draw(nl)
    nd.polygon([(cx,cy-r*0.72),(cx+s(6),cy),(cx-s(6),cy)],fill=(*RED,255))
    nd.polygon([(cx,cy+r*0.72),(cx+s(6),cy),(cx-s(6),cy)],fill=(*METAL_L,255))
    if nadel: nl=rot(nl,cx,cy,nadel)
    im.alpha_composite(nl); d=ImageDraw.Draw(im)
    d.ellipse([cx-s(5),cy-s(5),cx+s(5),cy+s(5)],fill=(*INK,255))
def o_bulb(im,cx,cy,r,on=True):
    d=ImageDraw.Draw(im)
    if on: shadow(im,cx,cy,int(r*1.7),int(r*1.7),alpha=0)  # keep
    if on:
        gl=L(); ImageDraw.Draw(gl).ellipse([cx-r*2,cy-r*2,cx+r*2,cy+r*2],fill=(*BGLOW,90)); im.alpha_composite(gl.filter(ImageFilter.GaussianBlur(s(7))))
        d=ImageDraw.Draw(im)
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=((*BON,255) if on else (*BOFF,255)),outline=(*YEL_D,255),width=s(1.6))
    d.arc([cx-r*0.5,cy-r*0.2,cx+r*0.5,cy+r*0.7],200,340,fill=(*YEL_D,255),width=s(2))  # filament
    d.rounded_rectangle([cx-s(7),cy+r-s(2),cx+s(7),cy+r+s(12)],radius=s(3),fill=(*METAL,255),outline=(*METAL_D,255),width=s(1))
    if on:
        for a in range(0,360,45):
            dx,dy=math.cos(math.radians(a)),math.sin(math.radians(a)); rr=r
            d.line([(cx+dx*(rr+s(6)),cy+dy*(rr+s(6))),(cx+dx*(rr+s(14)),cy+dy*(rr+s(14)))],fill=(*SUN,255),width=s(2.2))
def o_battery(im,cx,cy,w,h):
    d=ImageDraw.Draw(im)
    d.rounded_rectangle([cx-w//2,cy-h//2,cx+w//2,cy+h//2],radius=s(4),fill=(90,100,120,255),outline=(*INK,255),width=s(1.4))
    d.rectangle([cx+w//2,cy-h//5,cx+w//2+s(6),cy+h//5],fill=(*INK,255))
    d.text  # noop
def o_switch(im,cx,cy,closed=True):
    d=ImageDraw.Draw(im)
    d.ellipse([cx-s(4),cy-s(4),cx+s(4),cy+s(4)],fill=(*INK,255))
    d.ellipse([cx+s(34)-s(4),cy-s(4),cx+s(34)+s(4),cy+s(4)],fill=(*INK,255))
    end=(cx+s(34),cy) if closed else (cx+s(30),cy-s(16))
    d.line([(cx,cy),end],fill=(*INK,255),width=s(3.4))
def o_thermometer(im,cx,cy,ln,frac=0.6):
    d=ImageDraw.Draw(im); w=s(16)
    d.rounded_rectangle([cx-w//2,cy-ln//2,cx+w//2,cy+ln//2],radius=w//2,fill=(248,248,244,255),outline=(*METAL_D,255),width=s(1.6))
    d.ellipse([cx-s(15),cy+ln//2-s(6),cx+s(15),cy+ln//2+s(22)],fill=(*RED,255),outline=(*RED_D,255),width=s(1.4))
    top=cy+ln//2-s(6); bot=cy-ln//2+int(ln*(1-frac))
    d.rounded_rectangle([cx-s(4),bot,cx+s(4),top],radius=s(4),fill=(*RED,255))
    for i in range(6):
        yy=cy-ln//2+s(10)+i*(ln-s(20))//5; d.line([(cx+w//2,yy),(cx+w//2+s(7),yy)],fill=(*SUB,255),width=s(1.2))
    d.line([(cx-s(4),cy-ln//2+s(8)),(cx-s(4),top)],fill=(255,255,255,120),width=s(2))
def o_glass(im,cx,cy,w,h,level=0.5):
    d=ImageDraw.Draw(im)
    wy=cy+h//2-int(h*level)
    d.rounded_rectangle([cx-w//2,wy,cx+w//2,cy+h//2],radius=s(6),fill=(*WATER,220))
    d.rounded_rectangle([cx-w//2,cy-h//2,cx+w//2,cy+h//2],radius=s(8),outline=(*WATER_D,255),width=s(2.4))
    d.ellipse([cx-w//2,wy-s(4),cx+w//2,wy+s(4)],outline=(*WATER_D,180),width=s(1.4))
    d.line([(cx-w//2+s(6),cy-h//2+s(8)),(cx-w//2+s(6),cy+h//2-s(8))],fill=(255,255,255,120),width=s(3))
def o_cup(im,cx,cy,w,h,col=(238,238,232)):
    d=ImageDraw.Draw(im)
    d.rounded_rectangle([cx-w//2,cy-h//2,cx+w//2,cy+h//2],radius=s(8),fill=(*col,255),outline=(*METAL_D,255),width=s(1.6))
    d.arc([cx+w//2-s(6),cy-h//4,cx+w//2+s(26),cy+h//4],290,70,fill=(*METAL_D,255),width=s(5))
    d.ellipse([cx-w//2,cy-h//2-s(5),cx+w//2,cy-h//2+s(8)],fill=(250,250,246,255),outline=(*METAL_D,255),width=s(1.4))
def o_ice(im,cx,cy,sz):
    d=ImageDraw.Draw(im)
    d.rounded_rectangle([cx-sz,cy-sz,cx+sz,cy+sz],radius=s(6),fill=(*ICE,255),outline=(*ICE_D,255),width=s(1.6))
    d.line([(cx-sz+s(6),cy-sz+s(6)),(cx-s(2),cy-s(2))],fill=(255,255,255,180),width=s(3))
    d.line([(cx+s(4),cy-sz+s(8)),(cx+sz-s(6),cy+s(2))],fill=(255,255,255,120),width=s(2))
def o_sun(im,cx,cy,r,rays=True):
    d=ImageDraw.Draw(im)
    if rays:
        for a in range(0,360,30):
            dx,dy=math.cos(math.radians(a)),math.sin(math.radians(a))
            d.line([(cx+dx*(r+s(6)),cy+dy*(r+s(6))),(cx+dx*(r+s(18)),cy+dy*(r+s(18)))],fill=(*SUN,255),width=s(3))
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=(*SUN,255),outline=(*SUN_D,255),width=s(2))
    d.ellipse([cx-r*0.5,cy-r*0.6,cx-r*0.1,cy-r*0.2],fill=(255,236,170,150))
def o_moon(im,cx,cy,r,red=False,crescent=False):
    d=ImageDraw.Draw(im); base=MOONRED if red else MOON
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=(*base,255),outline=(*(RED_D if red else MOON_SH),255),width=s(1.6))
    for (ox,oy,cr) in [(-r*0.3,-r*0.2,r*0.22),(r*0.35,r*0.15,r*0.16),(r*0.05,r*0.45,r*0.12)]:
        d.ellipse([cx+ox-cr,cy+oy-cr,cx+ox+cr,cy+oy+cr],fill=(*((150,60,50) if red else MOON_SH),150))
    if crescent:
        d.ellipse([cx-r+r*0.7,cy-r,cx+r+r*0.7,cy+r],fill=(0,0,0,0))
def o_earth(im,cx,cy,r,daynight=False):
    d=ImageDraw.Draw(im)
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=(*EBLUE,255),outline=(*BLUE_D,255),width=s(1.6))
    d.ellipse([cx-r*0.5,cy-r*0.6,cx-r*0.05,cy-r*0.1],fill=(*EGREEN,255))
    d.ellipse([cx+r*0.1,cy+r*0.05,cx+r*0.6,cy+r*0.55],fill=(*EGREEN,255))
    if daynight:
        ov=L(); ImageDraw.Draw(ov).pieslice([cx-r,cy-r,cx+r,cy+r],-90,90,fill=(*ENIGHT,150)); im.alpha_composite(clip_card(ov,_round_mask(CW,CH,s(28))) if False else ov)
def o_star(d,x,y,r=3,col=(240,236,200)): spark(d,x,y,r,col)
def scatter_stars(im,n=14):
    d=ImageDraw.Draw(im); import_random=[(0.12,0.18),(0.22,0.4),(0.35,0.15),(0.5,0.28),(0.7,0.16),(0.82,0.36),(0.9,0.2),(0.15,0.6),(0.6,0.5),(0.78,0.6),(0.4,0.58),(0.88,0.5),(0.28,0.7),(0.66,0.72)]
    for i,(fx,fy) in enumerate(import_random[:n]):
        r=2.4 if i%3 else 3.6; o_star(d,int(CW*fx),int(CH*fy),r)
def o_heatwaves(d,x,y,h,col=RED):
    for k in range(3):
        xx=x+k*s(12); pts=[(xx,y-i*h/12+ (s(4) if (i//2)%2 else -s(4))) for i in range(13)]
        d.line([(xx,y),(xx,y-h)],fill=(*col,120),width=s(2))
def o_notes(d,x,y,col=INK):
    for (ox,oy) in [(0,0),(s(26),-s(10))]:
        d.ellipse([x+ox-s(6),y+oy-s(5),x+ox+s(6),y+oy+s(5)],fill=(*col,255))
        d.line([(x+ox+s(6),y+oy),(x+ox+s(6),y+oy-s(22))],fill=(*col,255),width=s(2.4))
    d.line([(x+s(6),y-s(22)),(x+s(26)+s(6),y-s(32))],fill=(*col,255),width=s(2.4))
def o_flashlight(im,cx,cy,ang=0,reach=120):
    # reach = wie weit der Lichtkegel traegt. Wo eine Wand im Bild steht, muss er sie
    # auch erreichen - sonst endet das Licht frei in der Luft.
    lay=L(); d=ImageDraw.Draw(lay)
    d.rounded_rectangle([cx-s(30),cy-s(9),cx+s(6),cy+s(9)],radius=s(4),fill=(*INK,255))
    d.polygon([(cx+s(6),cy-s(11)),(cx+s(6),cy+s(11)),(cx+s(16),cy+s(14)),(cx+s(16),cy-s(14))],fill=(*METAL,255))
    beam=L(); ImageDraw.Draw(beam).polygon([(cx+s(16),cy-s(10)),(cx+s(16),cy+s(10)),(cx+s(reach),cy+s(52)),(cx+s(reach),cy-s(52))],fill=(*BGLOW,90))
    lay.alpha_composite(beam.filter(ImageFilter.GaussianBlur(s(3))))
    if ang: lay=rot(lay,cx,cy,ang)
    im.alpha_composite(lay)
def o_hand(im,cx,cy,col=SKIN,sc=1.0):
    d=ImageDraw.Draw(im)
    d.rounded_rectangle([cx-s(20*sc),cy-s(14*sc),cx+s(18*sc),cy+s(20*sc)],radius=s(10*sc),fill=(*col,255))
    for i in range(4):
        fx=cx-s(14*sc)+i*s(11*sc); d.rounded_rectangle([fx-s(5*sc),cy-s(30*sc),fx+s(5*sc),cy-s(6*sc)],radius=s(5*sc),fill=(*col,255))
    d.rounded_rectangle([cx-s(28*sc),cy-s(6*sc),cx-s(10*sc),cy+s(8*sc)],radius=s(6*sc),fill=(*col,255))
def o_teddy(im,cx,cy,sc,col=(150,110,70)):
    d=ImageDraw.Draw(im)
    d.ellipse([cx-s(24*sc),cy-s(8*sc),cx+s(24*sc),cy+s(40*sc)],fill=(*col,255))            # Koerper
    d.ellipse([cx-s(20*sc),cy-s(44*sc),cx+s(20*sc),cy-s(6*sc)],fill=(*col,255))             # Kopf
    d.ellipse([cx-s(24*sc),cy-s(48*sc),cx-s(8*sc),cy-s(32*sc)],fill=(*col,255))             # Ohr
    d.ellipse([cx+s(8*sc),cy-s(48*sc),cx+s(24*sc),cy-s(32*sc)],fill=(*col,255))
    d.ellipse([cx-s(9*sc),cy-s(30*sc),cx-s(3*sc),cy-s(24*sc)],fill=(*INK,255))              # Augen
    d.ellipse([cx+s(3*sc),cy-s(30*sc),cx+s(9*sc),cy-s(24*sc)],fill=(*INK,255))
    d.ellipse([cx-s(4*sc),cy-s(22*sc),cx+s(4*sc),cy-s(15*sc)],fill=(90,60,40,255))          # Schnauze

# ---------------- Szenen ----------------
def base(night=False):
    im,d,mask=card(night)
    if not night:
        dsk=L(); dd=ImageDraw.Draw(dsk); dd.rounded_rectangle([0,CH-s(40),CW,CH+s(40)],radius=s(18),fill=(*DESK,255)); dd.line([(0,CH-s(40)),(CW,CH-s(40))],fill=(*DESK_E,255),width=s(2))
        im.alpha_composite(clip_card(dsk,mask))
    return im,mask
def fin(im,name):
    im.resize((W,H),Image.LANCZOS).save(os.path.join(IMG,f"einstieg_{name}.png")); return name

def m1(_=0):
    # Neun Kugeln im Spalt. Sichtbar ist das PROBLEM: Kugeln in einem Spalt, in den
    # kein Finger passt. R9 - nicht gezeigt werden darf alles, was die Fernwirkung
    # vorfuehrt: keine Kugel am Magneten, keine Sprunglinien, keine Feldringe.
    im,mask=base()
    lay=L(); d=ImageDraw.Draw(lay)
    d.rectangle([0,0,CW,int(CH*0.28)],fill=(214,206,190,255))            # Wand
    d.rectangle([0,int(CH*0.28),CW,int(CH*0.38)],fill=(44,42,52,255))     # der Spalt
    d.rectangle([0,int(CH*0.38),CW,CH],fill=(*WOOD,255))                  # Werkbankplatte
    d.line([(0,int(CH*0.38)),(CW,int(CH*0.38))],fill=(*WOOD_D,255),width=s(2))
    for yy in (0.50,0.62,0.74):
        d.line([(0,int(CH*yy)),(CW,int(CH*yy))],fill=(*WOOD_D,80),width=s(1.4))
    im.alpha_composite(clip_card(lay,mask))
    for bx in (int(CW*0.30),int(CW*0.44),int(CW*0.57)):                   # drei Kugeln IM Spalt
        o_steelball(im,bx,int(CH*0.335),s(9))
    d=ImageDraw.Draw(im)                                                  # Schmirgelpapier
    sx,sy=int(CW*0.56),int(CH*0.54)
    d.polygon([(sx-s(52),sy-s(26)),(sx+s(54),sy-s(31)),(sx+s(50),sy+s(28)),(sx-s(56),sy+s(24))],
              fill=(190,182,168,255),outline=(150,142,128,255),width=s(1.4))
    for fx,fy in ((-34,-10),(-12,8),(10,-14),(28,10),(-24,14),(36,-4),(0,-2),(20,20)):
        d.ellipse([sx+s(fx)-s(1.4),sy+s(fy)-s(1.4),sx+s(fx)+s(1.4),sy+s(fy)+s(1.4)],fill=(120,112,100,220))
    for bx,by in ((0.14,0.52),(0.22,0.66),(0.86,0.58),(0.78,0.72)):       # Kugeln auf der Bank
        o_steelball(im,int(CW*bx),int(CH*by),s(9))
    o_stickmagnet(im,int(CW*0.30),int(CH*0.76),s(76),ang=-7)              # liegt da, greift nichts
    return fin(im,"m1")

def m2(_=0):
    # Die glaenzende Felge. Beide Felgen absichtlich identisch gezeichnet; die
    # Pruefkoerper liegen UNSORTIERT durcheinander (R9: keine zwei Gruppen, keine
    # Haken, keine Materialbeschriftung).
    im,_m=base()
    o_rim(im,int(CW*0.27),int(CH*0.34),s(39))
    o_rim(im,int(CW*0.62),int(CH*0.34),s(39))
    o_nail(im,int(CW*0.13),int(CH*0.70),s(40),ang=64)
    o_can(im,int(CW*0.30),int(CH*0.72),s(26),s(34))
    o_paperclip(im,int(CW*0.44),int(CH*0.72),0.5,ang=74)
    o_rod(im,int(CW*0.58),int(CH*0.73),s(38),s(15),WOOD,WOOD_D,ang=-9,grain=True)
    o_stickmagnet(im,int(CW*0.82),int(CH*0.70),s(72),ang=13)
    return fin(im,"m2")

def m3(_=0):
    # Der stoerrische dritte Magnet. Alle drei Magnete durchgehend gleich silbern,
    # keine N/S-Beschriftung, keine Farbe an den Enden, keine Pfeile oder Federn (R9).
    im,_m=base()
    mitten,_by,seg=o_leiste(im,int(CW*0.16),int(CH*0.24),int(CW*0.68),int(CH*0.24),n=3,fehlt=2)
    fx=mitten[2]                                                           # unter der leeren Nut
    shadow(im,fx,int(CH*0.80),s(40),s(9),60)
    o_rod(im,fx,int(CH*0.76),s(62),s(22),METAL,METAL_D,ang=15)             # der dritte, am Boden
    return fin(im,"m3")

def m4(_=0):
    # Die Zange, die immer wieder faellt. Noahs Kreppband markiert nur, WO sie haelt -
    # keine Feldlinien, keine Halos, keine Pfeile an den Magnetenden (R9).
    im,_m=base()
    x0,y0=int(CW*0.13),int(CH*0.15); w,h=int(CW*0.74),int(CH*0.17)
    mitten,ty,seg=o_leiste(im,x0,y0,w,h,n=3,band=int(CH*0.09))
    for m in mitten:                                           # Noahs Kreppband auf der Leiste
        o_tape(im,m-seg//2+s(11),ty,s(13),s(14),(228,190,70))  # gelb: haelt (ueber den Enden)
        o_tape(im,m+seg//2-s(11),ty,s(13),s(14),(228,190,70))
        o_tape(im,m,ty,s(13),s(14),(198,84,68))                # rot: faellt (ueber der Mitte)
    shadow(im,int(CW*0.32),int(CH*0.79),s(40),s(9),55)
    o_zange(im,int(CW*0.32),int(CH*0.74),0.95,ang=9)
    d=ImageDraw.Draw(im)                                        # Teileschale, haelt nichts
    px,py=int(CW*0.74),int(CH*0.70)
    d.polygon([(px-s(34),py-s(12)),(px+s(34),py-s(12)),(px+s(27),py+s(13)),(px-s(27),py+s(13))],
              fill=(198,200,208,255),outline=(*METAL_D,255),width=s(1.5))
    d.line([(px-s(9),py+s(4)),(px+s(7),py+s(4))],fill=(*METAL_D,255),width=s(4))
    return fin(im,"m4")

def m5(_=0):
    # Die verwirrte Nadel. Links unter der Leiste zeigt sie hinauf, rechts ohne Leiste
    # ganz woanders hin. R9: kein Globus, keine Feldlinien, keine Windrose, keine
    # Himmelsrichtungen - nur der Widerspruch selbst.
    im,mask=base()
    lay=L(); d=ImageDraw.Draw(lay)
    d.rectangle([int(CW*0.52),0,CW,CH],fill=(232,236,228,255))       # draussen, anderer Grund
    d.line([(int(CW*0.52),0),(int(CW*0.52),CH)],fill=(*SUB,120),width=s(1.6))
    im.alpha_composite(clip_card(lay,mask))
    o_leiste(im,int(CW*0.05),int(CH*0.13),int(CW*0.40),int(CH*0.16),n=3)
    o_compass(im,int(CW*0.25),int(CH*0.60),s(40),nadel=0)             # zeigt zur Leiste
    o_compass(im,int(CW*0.76),int(CH*0.55),s(40),nadel=-118)          # draussen: ganz anders
    return fin(im,"m5")

def l1(_=0):
    im,mask=base(night=True); scatter_stars(im,12)
    o_moon(im,int(CW*0.72),int(CH*0.34),s(40))
    # Laterne
    d=ImageDraw.Draw(im); lx=int(CW*0.24)
    d.line([(lx,int(CH*0.42)),(lx,CH-s(30))],fill=(70,74,96,255),width=s(6))
    o_bulb(im,lx,int(CH*0.4),s(18),True)
    return fin(im,"l1")
def l2(_=0):
    im,mask=base(night=True)
    o_teddy(im,int(CW*0.5),int(CH*0.6),1.15,col=(70,60,80))   # kaum sichtbar (dunkel)
    dk=L(); ImageDraw.Draw(dk).rounded_rectangle([0,0,CW,CH],radius=s(28),fill=(10,12,30,120)); im.alpha_composite(clip_card(dk,mask))
    d=ImageDraw.Draw(im); o_star(d,int(CW*0.2),int(CH*0.24),3,(200,200,210))
    return fin(im,"l2")
def l3(_=0):
    # Merksatz der Seite: "Ein undurchsichtiger Gegenstand haelt das Licht auf.
    # Dahinter entsteht der Schatten." Vorher endete der Lichtkegel 140 px vor der
    # Wand, hinter der Hand war es durchgehend hell, und der Schatten klebte ohne
    # Zusammenhang an der Wand. Jetzt liegt alles auf einer Achse:
    # Lampe -> Hand -> Schattenkeil -> Schatten an der Wand. Der Schatten ist
    # groesser als die Hand, weil er von der Lampe aus aufgefaechert wird.
    im,mask=base()
    ly=int(CH*0.46)
    d=ImageDraw.Draw(im); d.rectangle([int(CW*0.66),s(20),CW-s(12),CH-s(14)],fill=(238,230,210,255))
    o_flashlight(im,int(CW*0.13),ly,0,reach=166)
    keil=L(); ImageDraw.Draw(keil).polygon(
        [(int(CW*0.545),int(CH*0.343)),(int(CW*0.742),int(CH*0.246)),
         (int(CW*0.742),int(CH*0.607)),(int(CW*0.545),int(CH*0.537))],fill=(70,66,86,150))
    im.alpha_composite(clip_card(keil,mask))
    sh=L(); o_hand(sh,int(CW*0.82),ly,(70,66,86),1.3); im.alpha_composite(clip_card(sh,mask))
    o_hand(im,int(CW*0.50),ly,SKIN,0.7)          # die Hand zuletzt, also vor ihrem Schatten
    return fin(im,"l3")
def l4(_=0):
    im,mask=base()
    o_bulb(im,int(CW*0.16),int(CH*0.4),s(15),True)
    d=ImageDraw.Draw(im); d.rectangle([int(CW*0.8),s(18),CW-s(14),CH-s(14)],fill=(238,230,210,255))
    o_hand(im,int(CW*0.4),int(CH*0.48),SKIN,0.85)
    sh=L(); o_hand(sh,int(CW*0.9),int(CH*0.5),(70,66,86),1.7); im.alpha_composite(clip_card(sh,mask))
    return fin(im,"l4")
def l5(_=0):
    im,mask=base()
    o_bulb(im,int(CW*0.24),int(CH*0.24),s(12),True); o_bulb(im,int(CW*0.4),int(CH*0.22),s(12),True)
    o_cup(im,int(CW*0.42),int(CH*0.56),s(56),s(70))
    # Schatten: Kern dunkel + Halbschatten grau
    d=ImageDraw.Draw(im)
    d.polygon([(int(CW*0.5),CH-s(44)),(int(CW*0.86),CH-s(44)),(int(CW*0.78),CH-s(26)),(int(CW*0.56),CH-s(26))],fill=(140,140,150,150))
    d.polygon([(int(CW*0.55),CH-s(44)),(int(CW*0.74),CH-s(44)),(int(CW*0.7),CH-s(28)),(int(CW*0.6),CH-s(28))],fill=(60,60,74,220))
    return fin(im,"l5")

def s1(_=0):
    im,_m=base(); d=ImageDraw.Draw(im)
    d.rounded_rectangle([int(CW*0.16),int(CH*0.18),int(CW*0.84),int(CH*0.8)],radius=s(10),fill=(252,250,242,255),outline=(*SUB,255),width=s(1.6))
    # winzige Schaltzeichen
    cx0=int(CW*0.28)
    d.line([(cx0,int(CH*0.36)),(cx0+s(60),int(CH*0.36))],fill=(*INK,255),width=s(2))
    d.ellipse([cx0+s(60),int(CH*0.36)-s(10),cx0+s(80),int(CH*0.36)+s(10)],outline=(*INK,255),width=s(2))  # Lampe
    # Lampe = Kreis mit KREUZ (der Fliesstext der Seite sagt woertlich "ein Kreis mit
    # einem Kreuz", und die Legende darunter zeigt es so). Vorher nur eine Diagonale.
    d.line([(cx0+s(63),int(CH*0.36)-s(7)),(cx0+s(77),int(CH*0.36)+s(7))],fill=(*INK,255),width=s(2))
    d.line([(cx0+s(63),int(CH*0.36)+s(7)),(cx0+s(77),int(CH*0.36)-s(7))],fill=(*INK,255),width=s(2))
    d.line([(cx0,int(CH*0.56)),(cx0+s(24),int(CH*0.56))],fill=(*INK,255),width=s(2))    # Batterie
    # lange Platte duenn = Plus, kurze Platte dick = Minus. Die Strichstaerken waren
    # vertauscht, das Zeichen stand also verkehrt herum neben der eigenen Legende.
    d.line([(cx0+s(30),int(CH*0.5)),(cx0+s(30),int(CH*0.62))],fill=(*INK,255),width=s(2))
    d.line([(cx0+s(40),int(CH*0.53)),(cx0+s(40),int(CH*0.59))],fill=(*INK,255),width=s(4))
    d.arc([cx0+s(80),int(CH*0.5),cx0+s(120),int(CH*0.62)],200,340,fill=(*INK,255),width=s(2))
    d.text  # guard
    spark(d,int(CW*0.8),int(CH*0.26),6)
    return fin(im,"s1")
def s2(_=0):
    # "Alles dran - und trotzdem dunkel": das Laempchen bleibt aus, weil eine
    # Klemme neben dem Batteriepol liegt statt daran. Die Luecke ist das Motiv.
    im,_m=base()
    lx,ly,r=int(CW*0.36),int(CH*0.38),s(22)
    o_bulb(im,lx,ly,r,False)
    o_battery(im,int(CW*0.72),int(CH*0.72),s(48),s(24))
    d=ImageDraw.Draw(im); col=(*INK,190)
    d.line([(lx,ly+r+s(12)),(lx,int(CH*0.72)),(int(CW*0.52),int(CH*0.72))],fill=col,width=s(2))
    d.line([(int(CW*0.59),int(CH*0.79)),(int(CW*0.63),int(CH*0.745))],fill=col,width=s(2))
    d.ellipse([int(CW*0.59)-s(4),int(CH*0.79)-s(4),int(CW*0.59)+s(4),int(CH*0.79)+s(4)],fill=(*RED,255))
    return fin(im,"s2")
def s3(_=0):
    # Die Elemente liegen EINZELN da - Bauteile oben, die Gegenstaende vom Tisch
    # unten. Bewusst kein fertig aufgebauter Kreis: die Kinder sollen selbst
    # herausfinden, wie man damit prueft. Ihr Vorwissen aus s2 reicht dafuer
    # (Batterie, Laempchen, Kabel, offener und geschlossener Kreis).
    im,_m=base()
    ry1,ry2=int(CH*0.30),int(CH*0.70)
    o_battery(im,int(CW*0.15),ry1,s(44),s(25))
    o_bulb(im,int(CW*0.38),ry1,s(16),False)
    o_clipcable(im,int(CW*0.62),ry1,s(46),RED_D)
    o_clipcable(im,int(CW*0.86),ry1,s(46),(150,124,50))
    o_paperclip(im,int(CW*0.10),ry2,0.62,ang=90)                    # Bueroklammer
    o_foil(im,int(CW*0.26),ry2,0.95)                                # Alufolie
    o_rod(im,int(CW*0.42),ry2,s(36),s(7),(78,80,90),(44,46,56))     # Bleistiftmine
    o_rod(im,int(CW*0.58),ry2,s(38),s(13),WOOD,WOOD_D,grain=True)   # Holzstab
    o_ruler(im,int(CW*0.74),ry2,s(40),s(12))                        # Plastiklineal
    o_eraser(im,int(CW*0.90),ry2,s(28),s(18))                       # Radiergummi
    return fin(im,"s3")
def s6(_=0):
    # "Jedes Mal die Klemme abziehen?": der selbst gebaute Schalter - Holzbrettchen,
    # zwei Reisszwecken, eine Bueroklammer, daneben Batterie und dunkles Laempchen.
    im,_m=base()
    d=ImageDraw.Draw(im)
    bx0,by0=int(CW*0.34),int(CH*0.52); bw,bh=int(CW*0.34),int(CH*0.20)
    d.rounded_rectangle([bx0,by0,bx0+bw,by0+bh],radius=s(5),fill=(*WOOD,255),outline=(*WOOD_D,255),width=s(2))
    # Zweckenabstand so, dass eine Bueroklammer in glaubwuerdiger Groesse ihn
    # ueberbruecken kann (104 px bei einer Klammerlaenge von 112).
    p1=(bx0+int(bw*0.33),by0+bh//2); p2=(bx0+int(bw*0.67),by0+bh//2)
    # Die Klammer sitzt auf der LINKEN Zwecke und ist weggedreht: der Schalter ist
    # offen, das Laempchen bleibt dunkel. Sie ist lang genug, um die zweite Zwecke
    # zu erreichen - vorher war sie mit 79 px nur halb so lang wie der Abstand von
    # 159 px, der Schalter haette sich so gar nicht schliessen lassen.
    o_paperclip(im,p1[0]+s(15),p1[1]-s(11),0.62,ang=125)
    d=ImageDraw.Draw(im)
    for p in (p1,p2):
        d.ellipse([p[0]-s(6),p[1]-s(6),p[0]+s(6),p[1]+s(6)],fill=(*METAL,255),outline=(*METAL_D,255),width=s(2))
    col=(70,78,100,255)
    d.line([(int(CW*0.14),int(CH*0.40)),(int(CW*0.14),p1[1]),(p1[0],p1[1])],fill=col,width=s(3))
    d.line([(p2[0],p2[1]),(int(CW*0.88),p2[1]),(int(CW*0.88),int(CH*0.34))],fill=col,width=s(3))
    # Rueckleitung Batterie -> Laempchen, oberhalb des Brettchens herumgefuehrt. Vorher
    # endete dieses Kabelstueck bei 0.32CW frei in der Luft - eine zweite, ungewollte
    # Luecke neben dem Schalter, der als einzige Unterbrechung gemeint ist.
    d.line([(int(CW*0.14),int(CH*0.28)),(int(CW*0.14),int(CH*0.13)),
            (int(CW*0.88),int(CH*0.13)),(int(CW*0.88),int(CH*0.28)-s(15))],fill=col,width=s(3))
    o_battery(im,int(CW*0.14),int(CH*0.34),s(46),s(26))
    o_bulb(im,int(CW*0.88),int(CH*0.28),s(15),False)
    return fin(im,"s6")
def s4(_=0):
    # "Mehr Licht - und dann gar keins": drei Laempchen hintereinander, alle aus,
    # weil sich das mittlere aus der Fassung geloest hat. Die Lichterkette ist
    # inzwischen der Transfer der Seite, nicht mehr der Einstieg.
    im,_m=base()
    d=ImageDraw.Draw(im); y=int(CH*0.46); col=(70,74,96,255)
    xs=[int(CW*0.28),int(CW*0.5),int(CW*0.72)]
    d.line([(int(CW*0.13),y),(xs[1]-s(28),y)],fill=col,width=s(3))
    d.line([(xs[1]+s(28),y),(CW-int(CW*0.13),y)],fill=col,width=s(3))
    for i,x in enumerate(xs):
        o_bulb(im,x,(y-s(15) if i==1 else y),s(15),False)
    d=ImageDraw.Draw(im)
    for dx in (-s(28),s(28)):
        d.ellipse([xs[1]+dx-s(4),y-s(4),xs[1]+dx+s(4),y+s(4)],fill=(*RED,255))
    return fin(im,"s4")
def s5(_=0):
    # "Deins aus, meins an": zwei Laempchen, jedes mit eigenem Schalter - eines
    # brennt, das andere ist aus. Die alte Lichterkette gehoert zu s4, nicht hierher.
    im,_m=base()
    for fx,on in ((0.34,True),(0.66,False)):
        x=int(CW*fx)
        o_bulb(im,x,int(CH*0.38),s(20),on)
        o_switch(im,x-s(17),int(CH*0.74),on)
    return fin(im,"s5")

def w1(_=0):
    im,_m=base(); cx,cy=int(CW*0.44),int(CH*0.58)
    shadow(im,cx,int(CH*0.74),s(58),s(13),50)
    o_cup(im,cx,cy,s(80),s(72),col=(230,226,220))          # heiße Tasse
    d=ImageDraw.Draw(im)
    for k in range(3):                                     # Dampf
        xx=cx-s(20)+k*s(20)
        d.line([(xx,cy-s(42)),(xx+s(7),cy-s(60)),(xx-s(5),cy-s(80))],fill=(206,202,202,170),width=s(2))
    d.line([(cx+s(4),cy+s(8)),(cx+s(42),cy-s(50))],fill=(*METAL,255),width=s(8))   # Metalllöffel steht schräg
    d.ellipse([cx-s(8),cy,cx+s(12),cy+s(22)],fill=(*METAL_L,255),outline=(*METAL_D,255),width=s(1.4))
    for k in range(2):                                     # Wärme fließt ins Metall (rote Pfeile)
        ax=cx+s(14)+k*s(12); ay=cy-s(8)-k*s(12)
        d.line([(ax,ay),(ax+s(7),ay-s(15))],fill=(*RED,210),width=s(2))
        d.line([(ax+s(7),ay-s(15)),(ax+s(1),ay-s(10))],fill=(*RED,210),width=s(2))
        d.line([(ax+s(7),ay-s(15)),(ax+s(10),ay-s(9))],fill=(*RED,210),width=s(2))
    return fin(im,"w1")
def w2(_=0):
    im,_m=base(); o_thermometer(im,int(CW*0.5),int(CH*0.44),s(150),0.62)
    d=ImageDraw.Draw(im)
    d.line([(int(CW*0.62),int(CH*0.4)),(int(CW*0.62),int(CH*0.28))],fill=(*RED,200),width=s(2)); d.polygon([(int(CW*0.62),int(CH*0.26)),(int(CW*0.62)-s(5),int(CH*0.32)),(int(CW*0.62)+s(5),int(CH*0.32))],fill=(*RED,220))
    return fin(im,"w2")
def w3(_=0):
    im,_m=base()
    o_cup(im,int(CW*0.46),int(CH*0.56),s(64),s(74),col=(226,224,220))
    d=ImageDraw.Draw(im)
    d.rounded_rectangle([int(CW*0.46)-s(36),int(CH*0.56)-s(42),int(CW*0.46)+s(36),int(CH*0.56)-s(32)],radius=s(4),fill=(*METAL,255),outline=(*METAL_D,255),width=s(1.4))  # Deckel
    for k in range(3):
        xx=int(CW*0.46)-s(18)+k*s(18)
        d.line([(xx,int(CH*0.56)-s(46)),(xx+s(6),int(CH*0.56)-s(66)),(xx-s(4),int(CH*0.56)-s(84))],fill=(200,200,205,180),width=s(2))
    return fin(im,"w3")
def w4(_=0):
    im,_m=base()
    o_glass(im,int(CW*0.36),int(CH*0.5),s(60),s(84),0.85)
    d=ImageDraw.Draw(im); d.line([(int(CW*0.5),int(CH*0.5)),(int(CW*0.6),int(CH*0.5))],fill=(*SUB,255),width=s(2))
    o_ice(im,int(CW*0.72),int(CH*0.52),s(30))
    spark(d,int(CW*0.72),int(CH*0.36),6)
    return fin(im,"w4")
def w5(_=0):
    im,_m=base()
    o_cup(im,int(CW*0.4),int(CH*0.62),s(72),s(64),col=(210,120,80))   # Suppe/Tasse
    d=ImageDraw.Draw(im)
    d.line([(int(CW*0.42),int(CH*0.6)),(int(CW*0.66),int(CH*0.3))],fill=(*METAL,255),width=s(8))   # Loeffelstiel
    d.ellipse([int(CW*0.4),int(CH*0.58),int(CW*0.5),int(CH*0.68)],fill=(*METAL_L,255),outline=(*METAL_D,255),width=s(1.4))
    for k in range(3): d.line([(int(CW*0.66)+k*s(10),int(CH*0.3)),(int(CW*0.66)+k*s(10)-s(6),int(CH*0.2))],fill=(*RED,150),width=s(2))
    return fin(im,"w5")

def sc1(_=0):
    im,_m=base(); d=ImageDraw.Draw(im); cx,cy=int(CW*0.44),int(CH*0.56)
    d.rounded_rectangle([cx-s(52),cy-s(18),cx+s(52),cy+s(36)],radius=s(8),fill=(*METAL,255),outline=(*METAL_D,255),width=s(1.6))  # Dose
    d.line([(cx-s(46),cy-s(6),),(cx-s(46),cy+s(30))],fill=(255,255,255,110),width=s(3))
    d.ellipse([cx-s(52),cy-s(32),cx+s(52),cy-s(4)],fill=(118,124,140,255),outline=(*METAL_D,255),width=s(1.6))  # offene Oberseite
    d.ellipse([cx-s(43),cy-s(28),cx+s(43),cy-s(8)],fill=(88,94,110,255))                                        # Innenschatten
    for off,al in [(-s(6),80),(0,230),(s(6),80)]:                                                               # schwingendes Gummiband (Ghosting)
        d.line([(cx-s(52),cy-s(18)+off),(cx+s(52),cy-s(18)+off)],fill=(60,54,48,al),width=s(3))
    waves(d,cx,cy-s(18),34,2,WAVE,ang0=205,ang1=335)
    spark(d,cx+s(64),cy-s(24),6)
    return fin(im,"sc1")
def sc2(_=0):
    im,_m=base()
    # Trommel
    d=ImageDraw.Draw(im); cx,cy=int(CW*0.36),int(CH*0.56)
    d.rounded_rectangle([cx-s(46),cy-s(20),cx+s(46),cy+s(28)],radius=s(8),fill=(*RED,255),outline=(*RED_D,255),width=s(1.6))
    d.ellipse([cx-s(46),cy-s(32),cx+s(46),cy-s(8)],fill=(248,244,236,255),outline=(*RED_D,255),width=s(1.6))
    o_moon  # guard
    waves(ImageDraw.Draw(im),int(CW*0.5),cy-s(16),40,3,WAVE)
    return fin(im,"sc2")
def sc3(_=0):
    im,_m=base()
    o_glass(im,int(CW*0.34),int(CH*0.54),s(48),s(80),0.75)
    o_glass(im,int(CW*0.6),int(CH*0.56),s(48),s(76),0.3)
    d=ImageDraw.Draw(im); o_notes(d,int(CW*0.3),int(CH*0.28)); o_notes(d,int(CW*0.68),int(CH*0.34))
    return fin(im,"sc3")
def sc4(_=0):
    im,_m=base()
    # Tisch + Ohr
    d=ImageDraw.Draw(im)
    d.rounded_rectangle([int(CW*0.14),int(CH*0.5),int(CW*0.86),int(CH*0.62)],radius=s(6),fill=(*WOOD,255),outline=(*WOOD_D,255),width=s(1.6))
    # Ohr
    ex,ey=int(CW*0.36),int(CH*0.42)
    d.ellipse([ex-s(18),ey-s(22),ex+s(18),ey+s(22)],fill=(*SKIN,255),outline=(*SKIN_D,255),width=s(1.4))
    d.arc([ex-s(9),ey-s(12),ex+s(11),ey+s(10)],20,300,fill=(*SKIN_D,255),width=s(2.4))
    # Klopfen rechts, Wellen durch Holz
    d.ellipse([int(CW*0.72)-s(6),int(CH*0.46)-s(6),int(CW*0.72)+s(6),int(CH*0.46)+s(6)],fill=(*INK,255))
    for k in range(3):
        rr=s(16+k*14); d.arc([int(CW*0.72)-rr,int(CH*0.56)-rr//2,int(CW*0.72)+rr,int(CH*0.56)+rr//2],150,210,fill=WAVE+(200,),width=s(2))
    return fin(im,"sc4")
def sc5(_=0):
    im,_m=base()
    d=ImageDraw.Draw(im); cx,cy=int(CW*0.42),int(CH*0.5)
    d.rounded_rectangle([cx-s(50),cy-s(4),cx+s(50),cy+s(30)],radius=s(8),fill=(*RED,255),outline=(*RED_D,255),width=s(1.4))
    d.ellipse([cx-s(50),cy-s(16),cx+s(50),cy+s(8)],fill=(248,244,236,255),outline=(*RED_D,255),width=s(1.6))
    # huepfende Salzkoerner
    for (fx,fy) in [(-0.7,-0.5),(-0.3,-0.7),(0.2,-0.6),(0.6,-0.45),(0.0,-0.9),(-0.5,-0.85)]:
        d.ellipse([cx+int(fx*s(40))-s(3),cy-s(14)+int(fy*s(20))-s(3),cx+int(fx*s(40))+s(3),cy-s(14)+int(fy*s(20))+s(3)],fill=(250,250,250,255),outline=(*SUB,180))
    waves(d,int(CW*0.78),cy,26,3,WAVE,ang0=120,ang1=240)
    return fin(im,"sc5")

def h1(_=0):
    im,mask=base(night=True); scatter_stars(im,8)
    o_sun(im,int(CW*0.16),int(CH*0.3),s(26))
    o_earth(im,int(CW*0.62),int(CH*0.5),s(52),daynight=True)
    return fin(im,"h1")
def h2(_=0):
    im,mask=base()
    d=ImageDraw.Draw(im); d.line([(int(CW*0.5),s(20)),(int(CW*0.5),CH-s(20))],fill=(*SUB,120),width=s(1.4))
    # Winter links (Schnee), Sommer rechts (Sonne)
    for (fx,fy) in [(0.16,0.3),(0.28,0.5),(0.2,0.7),(0.34,0.36)]:
        spark(d,int(CW*fx),int(CH*fy),5,(210,224,236))
    o_sun(im,int(CW*0.76),int(CH*0.32),s(26))
    d=ImageDraw.Draw(im)
    for k in range(3): d.line([(int(CW*0.66)+k*s(20),int(CH*0.72)),(int(CW*0.7)+k*s(20),int(CH*0.66))],fill=(*GREEN,255),width=s(3))
    return fin(im,"h2")
def h3(_=0):
    # Zunehmender Mond, passend zum Text ("duenne Sichel ... halb ... ganz rund"):
    # auf der Nordhalbkugel liegt die beleuchtete Seite RECHTS. Der Nachtschatten
    # wird deshalb nach LINKS versetzt (frueher nach rechts - das ergab die Formen
    # des ABNEHMENDEN Mondes) und auf die Mondscheibe geclippt, damit er nicht
    # ueber den Rand hinaus in die Nachbarscheibe laeuft.
    im,mask=base(night=True); scatter_stars(im,8)
    r=s(24); cy=int(CH*0.46)
    for fx,off in ((0.2,s(9)),(0.4,s(24)),(0.6,s(38)),(0.8,None)):
        cx=int(CW*fx); o_moon(im,cx,cy,r)
        if off is None: continue           # Vollmond: kein Schatten
        scheibe=Image.new("L",(CW,CH),0)   # Maske = genau die Mondscheibe
        ImageDraw.Draw(scheibe).ellipse([cx-r,cy-r,cx+r,cy+r],fill=255)
        ov=L(); ImageDraw.Draw(ov).ellipse([cx-r-off,cy-r,cx+r-off,cy+r],fill=(*NIGHT_B,235))
        im.alpha_composite(Image.composite(ov,L(),scheibe))
    return fin(im,"h3")
def h4(_=0):
    im,mask=base(night=True); scatter_stars(im,10)
    cx,cy=int(CW*0.54),int(CH*0.44)
    # Korona
    gl=L(); ImageDraw.Draw(gl).ellipse([cx-s(58),cy-s(58),cx+s(58),cy+s(58)],fill=(*SUN,120)); im.alpha_composite(gl.filter(ImageFilter.GaussianBlur(s(8))))
    o_sun(im,cx,cy,s(40))
    d=ImageDraw.Draw(im); d.ellipse([cx-s(34),cy-s(34),cx+s(34),cy+s(34)],fill=(20,22,40,255))   # Mond davor
    return fin(im,"h4")
def h5(_=0):
    # Merksatz: "Die Erde wirft ihren Schatten auf den Mond." Dafuer muessen Sonne,
    # Erde und Mond auf EINER Linie stehen - vorher lag die Sonne 170 px darueber,
    # der Erdschatten haette den Mond verfehlt. Und der Mond war genauso gross wie
    # die Erde gezeichnet; ein gleich grosser Koerper passt in keinen Erdschatten.
    im,mask=base(night=True); scatter_stars(im,12)
    ey=int(CH*0.5); sx=int(CW*0.10); ex,er=int(CW*0.42),s(30); mx,mr=int(CW*0.80),s(12)
    sh=L(); ImageDraw.Draw(sh).polygon(
        [(ex+er-s(4),ey-er),(CW-s(10),ey-s(15)),
         (CW-s(10),ey+s(15)),(ex+er-s(4),ey+er)],fill=(10,12,32,225))   # Kernschatten der Erde
    im.alpha_composite(clip_card(sh,mask))
    d=ImageDraw.Draw(im)
    for dy in (-s(16),0,s(16)):                                          # Sonnenlicht auf die Erde
        d.line([(sx+s(24),ey+dy),(ex-er,ey+dy)],fill=(*SUN,170),width=s(1.6))
    o_sun(im,sx,ey,s(20))
    o_earth(im,ex,ey,er)
    o_moon(im,mx,ey,mr,red=True)                                         # liegt im Kernschatten
    return fin(im,"h5")

SCENES={"m1":m1,"m2":m2,"m3":m3,"m4":m4,"m5":m5,"l1":l1,"l2":l2,"l3":l3,"l4":l4,"l5":l5,
 "s1":s1,"s2":s2,"s3":s3,"s4":s4,"s5":s5,"s6":s6,"w1":w1,"w2":w2,"w3":w3,"w4":w4,"w5":w5,
 "sc1":sc1,"sc2":sc2,"sc3":sc3,"sc4":sc4,"sc5":sc5,"h1":h1,"h2":h2,"h3":h3,"h4":h4,"h5":h5}

def build_all():
    # Themen, fuer die es eine SVG-Fassung unter svg/einstieg_<tid>.svg gibt, werden
    # hier UEBERSPRUNGEN - sonst wuerde die alte, flache PIL-Zeichnung das hochwertige
    # SVG-Rendering ueberschreiben. Diese Bilder baut  node render_einstieg.js.
    SVGDIR=os.path.join(HERE,"svg")
    hat_svg=lambda k: os.path.exists(os.path.join(SVGDIR,f"einstieg_{k}.svg"))
    n=0; uebersprungen=[]
    for k,fn in SCENES.items():
        if hat_svg(k): uebersprungen.append(k); continue
        fn(); n+=1
    print("gebaut:",n,"Bilder ->",IMG)
    if uebersprungen:
        print("uebersprungen (SVG-Fassung vorhanden):"," ".join(uebersprungen),
              "-> node render_einstieg.js")
def contact():
    build_all()
    cols,rows=5,6; pad=10; cw,ch=W+pad,H+pad
    sheet=Image.new("RGB",(cols*cw+pad,rows*ch+pad),(245,240,228))
    ids=list(SCENES.keys())
    for i,k in enumerate(ids):
        r,c=divmod(i,cols); im=Image.open(os.path.join(IMG,f"einstieg_{k}.png"))
        sheet.paste(im,(pad+c*cw,pad+r*ch))
        ImageDraw.Draw(sheet).text((pad+c*cw+4,pad+r*ch+2),k,fill=(80,70,50))
    sheet.save("/tmp/einstieg_sheet.png"); print("contact sheet -> /tmp/einstieg_sheet.png")

if __name__=="__main__":
    if len(sys.argv)>1 and sys.argv[1]=="sheet": contact()
    else: build_all()
