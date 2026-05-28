# -*- coding: utf-8 -*-
"""
LernStar Physik-Arbeitsblätter Generator
Passwortschutz: 0123
"""
from fpdf import FPDF
from PyPDF2 import PdfWriter, PdfReader
import io
import os

PASSWORT = "0123"

# Farben
PURPLE   = (124, 58, 237)
BLUE     = (37, 99, 235)
RED      = (220, 38, 38)
GREEN    = (22, 163, 74)
ORANGE   = (234, 88, 12)
TEAL     = (8, 145, 178)
DARKGRAY = (31, 41, 55)
MIDGRAY  = (107, 114, 128)
WHITE    = (255, 255, 255)

def s(text):
    """Ersetzt Zeichen, die nicht in Latin-1 (ISO-8859-1) vorkommen."""
    return (text
        .replace('–', '-').replace('—', '-')
        .replace('→', '->').replace('←', '<-')
        .replace('•', '*').replace('·', '.')
        .replace('Δ', 'D').replace('α', 'alpha')
        .replace('β', 'beta').replace('ω', 'om')
        .replace('π', 'pi').replace('≈', '~')
        .replace('≥', '>=').replace('≤', '<=')
        .replace('√', 'sqrt').replace('×', 'x')
        .replace('÷', '/').replace('²', '^2')
        .replace('³', '^3').replace('μ', 'mu')
    )

def verschluesseln(pdf_obj, passwort):
    """Fügt Passwortschutz zu einem fpdf-Objekt hinzu. Gibt verschlüsselte Bytes zurück."""
    raw = bytes(pdf_obj.output())
    reader = PdfReader(io.BytesIO(raw))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.encrypt(passwort)
    out = io.BytesIO()
    writer.write(out)
    return out.getvalue()


class AB(FPDF):
    def __init__(self, thema, klasse, fach="Physik"):
        super().__init__()
        self.thema  = s(thema)
        self.klasse = klasse
        self.fach   = fach
        self.set_auto_page_break(auto=True, margin=18)
        self.set_margins(18, 18, 18)

    def header(self):
        self.set_fill_color(*PURPLE)
        self.rect(0, 0, 210, 12, 'F')
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 8.5)
        self.set_xy(8, 2)
        self.cell(0, 8, "LernStar  |  %s  |  %s  |  %s" % (self.fach, self.klasse, self.thema))
        self.set_xy(0, 2)
        self.cell(202, 8, "Seite %d" % self.page_no(), align="R")
        self.set_text_color(*DARKGRAY)
        self.ln(16)

    def footer(self):
        self.set_y(-12)
        self.set_draw_color(*PURPLE)
        self.set_line_width(0.4)
        self.line(18, self.get_y(), 192, self.get_y())
        self.set_font("Helvetica", "", 7)
        self.set_text_color(*MIDGRAY)
        self.cell(0, 8, "LernStar - Deine Lernplattform  |  helinla.github.io/LernStar", align="C")

    def sec(self, text, color=PURPLE):
        self.set_fill_color(*color)
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 10)
        self.cell(0, 7, "  " + s(text), ln=1, fill=True)
        self.set_text_color(*DARKGRAY)
        self.ln(1)

    def body(self, text, size=9.5, bold=False):
        self.set_font("Helvetica", "B" if bold else "", size)
        self.multi_cell(0, 5.5, s(text))
        self.ln(1)

    def bullet(self, text):
        self.set_font("Helvetica", "", 9.5)
        self.set_x(22)
        self.multi_cell(0, 5.8, "   >  " + s(text))

    def step(self, num, text):
        self.set_font("Helvetica", "B", 9.5)
        self.set_text_color(*PURPLE)
        self.set_x(22)
        self.cell(7, 6, "%d." % num)
        self.set_font("Helvetica", "", 9.5)
        self.set_text_color(*DARKGRAY)
        self.multi_cell(0, 6, s(text))

    def formula_box(self, lines, color=PURPLE):
        bg = (237, 233, 254)
        if color == BLUE:   bg = (239, 246, 255)
        if color == ORANGE: bg = (255, 247, 237)
        if color == GREEN:  bg = (240, 253, 244)
        if color == TEAL:   bg = (236, 254, 255)
        if color == RED:    bg = (254, 242, 242)
        self.set_fill_color(*bg)
        self.set_draw_color(*color)
        self.set_line_width(0.5)
        self.set_font("Helvetica", "B", 9.5)
        self.set_text_color(*color)
        y0 = self.get_y()
        h = len(lines) * 7 + 4
        self.rect(18, y0, 174, h, 'DF')
        for line in lines:
            self.set_x(22)
            self.cell(0, 7, s(line), ln=1)
        self.ln(3)
        self.set_text_color(*DARKGRAY)
        self.set_draw_color(*DARKGRAY)

    def th(self, cols, widths, color=PURPLE):
        self.set_fill_color(*color)
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 8.5)
        for c, w in zip(cols, widths):
            self.cell(w, 7, s(c), border=1, fill=True, align="C")
        self.ln()
        self.set_text_color(*DARKGRAY)

    def tr(self, n, widths, h=8, prefill=None):
        self.set_font("Helvetica", "", 9)
        self.set_line_width(0.2)
        self.set_draw_color(190, 190, 190)
        rows = prefill if prefill else [None] * n
        for i, row in enumerate(rows):
            self.set_fill_color(248, 248, 255) if i % 2 == 0 else self.set_fill_color(*WHITE)
            if row:
                for j, w in enumerate(widths):
                    val = row[j] if j < len(row) else ""
                    self.cell(w, h, s(val), border=1, fill=(i%2==0), align="C")
            else:
                for w in widths:
                    self.cell(w, h, "", border=1, fill=(i%2==0))
            self.ln()
        self.set_draw_color(*DARKGRAY)
        self.set_line_width(0.2)

    def note(self, text, color=BLUE):
        self.set_fill_color(239, 246, 255)
        self.set_draw_color(*color)
        self.set_line_width(0.5)
        self.set_font("Helvetica", "BI", 8.5)
        self.set_text_color(*color)
        self.multi_cell(0, 5.5, "  Hinweis: " + s(text))
        self.ln(2)
        self.set_text_color(*DARKGRAY)
        self.set_draw_color(*DARKGRAY)

    def q(self, num, text, lines=3):
        self.set_font("Helvetica", "B", 9.5)
        self.cell(0, 6, "Frage %d:  %s" % (num, s(text)), ln=1)
        self.set_draw_color(180, 180, 180)
        self.set_line_width(0.2)
        for _ in range(lines):
            y = self.get_y() + 6
            self.line(22, y, 192, y)
            self.ln(7)
        self.ln(1)

    def title_block(self, title, subtitle, color):
        self.set_fill_color(*color)
        self.rect(18, self.get_y(), 174, 18, 'F')
        self.set_text_color(*WHITE)
        self.set_font("Helvetica", "B", 13)
        self.set_x(22)
        self.cell(0, 10, s(title), ln=1)
        self.set_font("Helvetica", "", 9)
        self.set_x(22)
        self.cell(0, 8, s(subtitle), ln=1)
        self.set_text_color(*DARKGRAY)
        self.ln(4)

    def name_row(self):
        self.set_font("Helvetica", "", 9)
        self.cell(92, 6, "Name: _________________________________", ln=0)
        self.cell(82, 6, "Datum: ______________   Klasse: ______", ln=1)
        self.ln(4)

    def grid(self, w=158, h=65, cols=8, rows=5):
        y0 = self.get_y()
        self.set_fill_color(250, 250, 255)
        self.set_draw_color(*MIDGRAY)
        self.set_line_width(0.15)
        self.rect(18, y0, w, h, 'DF')
        for i in range(1, cols):
            self.line(18+i*(w/cols), y0, 18+i*(w/cols), y0+h)
        for i in range(1, rows):
            self.line(18, y0+i*(h/rows), 18+w, y0+i*(h/rows))
        self.set_y(y0 + h + 2)

    def lines(self, n=4):
        self.set_draw_color(180, 180, 180)
        self.set_line_width(0.2)
        for _ in range(n):
            y = self.get_y() + 7
            self.line(22, y, 192, y)
            self.ln(8)
        self.set_draw_color(*DARKGRAY)


# ============================================================
# AB 1.2 - GLEICHFÖRMIGE BEWEGUNG
# ============================================================
def ab_gleichfoermig():
    pdf = AB("1.2 Gleichförmige Bewegung", "Klasse 11")
    pdf.add_page()
    pdf.title_block(
        "Versuch 1.2: Gleichförmige Bewegung",
        "Simulation: Auto mit konstanter Geschwindigkeit  |  s = v * t", BLUE)
    pdf.name_row()

    pdf.sec("Lernziele")
    pdf.bullet("Du kennst die Merkmale gleichförmiger Bewegung: v = konstant, a = 0.")
    pdf.bullet("Du kannst den Weg s aus Geschwindigkeit v und Zeit t berechnen: s = v * t")
    pdf.bullet("Du erkennst: s-t ist eine Gerade, v-t ist konstant, a-t = Nulllinie.")
    pdf.ln(2)

    pdf.sec("Physikalischer Hintergrund", BLUE)
    pdf.formula_box([
        "s = v * t          (Weg = Geschwindigkeit mal Zeit)",
        "v = s / t          (Geschwindigkeit = Weg durch Zeit)",
        "t = s / v          (Zeit = Weg durch Geschwindigkeit)",
        "a = 0              (keine Beschleunigung - v bleibt konstant)",
    ], BLUE)

    pdf.sec("Versuchsdurchführung")
    pdf.body("Öffne '1.2 Gleichförmige Bewegung' in LernStar (Klasse 11 -> Physik).", bold=True)
    pdf.step(1, "Stelle die Geschwindigkeit v = 10 m/s ein.")
    pdf.step(2, "Starte die Simulation und drücke bei t = 1, 2, 3, 4, 5, 6, 8 s auf 'Messen'.")
    pdf.step(3, "Lies die Werte aus der Simulation ab und trage sie in die Tabelle ein.")
    pdf.step(4, "Berechne v = s / t für jeden Messpunkt und prüfe, ob v konstant bleibt.")
    pdf.step(5, "Wiederhole mit v = 20 m/s und vergleiche beide s-t-Geraden im Diagramm.")
    pdf.ln(2)

    pdf.sec("Messwerterfassung  -  v = 10 m/s", BLUE)
    pdf.th(["Nr.", "t in s", "s gemessen (m)", "s = v*t berechnet (m)", "v = s/t (m/s)"],
           [16, 24, 44, 56, 34])
    pdf.tr(7, [16, 24, 44, 56, 34],
           prefill=[["1","1","","",""],["2","2","","",""],["3","3","","",""],
                    ["4","4","","",""],["5","5","","",""],["6","6","","",""],["7","8","","",""]])
    pdf.ln(3)

    pdf.sec("Messwerterfassung  -  v = 20 m/s", BLUE)
    pdf.th(["Nr.", "t in s", "s gemessen (m)", "s = v*t berechnet (m)", "Doppelt so weit?"],
           [16, 24, 44, 56, 34])
    pdf.tr(7, [16, 24, 44, 56, 34],
           prefill=[["1","1","","",""],["2","2","","",""],["3","3","","",""],
                    ["4","4","","",""],["5","5","","",""],["6","6","","",""],["7","8","","",""]])
    pdf.ln(3)

    pdf.sec("Diagramm - s-t zeichnen")
    pdf.body("Trage die Messpunkte aus beiden Versuchen ein und zeichne die Geraden:")
    pdf.note("Beschrifte Achsen: Waagerecht = t in s (0 bis 8), Senkrecht = s in m (0 bis 160).")
    pdf.grid(w=158, h=70, cols=8, rows=5)
    pdf.ln(3)

    pdf.sec("Auswertung")
    pdf.q(1, "Welche Form hat die s-t-Kurve? Was zeigt das über die Bewegung?")
    pdf.q(2, "Berechne: Wie lange braucht das Auto bei v=10 m/s für 500 m?  t = s/v = _______", lines=2)
    pdf.q(3, "Was ist der Unterschied zwischen s-t (1.2) und s-t bei beschleunigter Bewegung (1.3)?")
    pdf.q(4, "Warum zeigt das a-t-Diagramm eine Nulllinie? Was bedeutet a = 0 physikalisch?")

    pdf.sec("Fazit")
    pdf.lines(4)
    return pdf


# ============================================================
# AB 1.3 - BESCHLEUNIGTE BEWEGUNG
# ============================================================
def ab_beschleunigung():
    pdf = AB("1.3 Beschleunigte Bewegung", "Klasse 11")
    pdf.add_page()
    pdf.title_block(
        "Versuch 1.3: Gleichmäßig beschleunigte Bewegung",
        "Simulation: Auto auf gerader Fahrbahn  |  a = Dv/Dt  |  s = 1/2*a*t^2", PURPLE)
    pdf.name_row()

    pdf.sec("Lernziele")
    pdf.bullet("Du kennst den Unterschied zwischen gleichförmiger und beschleunigter Bewegung.")
    pdf.bullet("Du kannst die Beschleunigung a aus dem v-t-Diagramm bestimmen: Steigung = Dv/Dt = a.")
    pdf.bullet("Du weißt: v-t ist eine Gerade, s-t ist eine Parabel, a-t ist eine Konstante.")
    pdf.ln(2)

    pdf.sec("Physikalischer Hintergrund", PURPLE)
    pdf.body("Bei gleichmäßig beschleunigter Bewegung nimmt die Geschwindigkeit v gleichmäßig zu – die Beschleunigung a ist konstant.")
    pdf.formula_box([
        "v(t) = a * t           (v steigt linear -> Gerade im v-t-Diagramm)",
        "s(t) = 1/2 * a * t^2   (Weg wächst quadratisch -> Parabel im s-t-Diagramm)",
        "a = Dv / Dt            (Beschleunigung = Steigung der v-t-Geraden)",
        "Einheit:  [a] = m/s^2  (Meter pro Sekunde zum Quadrat)",
    ])

    pdf.sec("Versuchsdurchführung")
    pdf.body("Öffne '1.3 Beschleunigte Bewegung' in LernStar (Klasse 11 -> Physik).", bold=True)
    pdf.step(1, "Wähle im Dropdown-Menü die Beschleunigung a = 3 m/s^2 (mittel) aus.")
    pdf.step(2, "Drücke '> Start' und beobachte das Auto auf der Straße sowie alle drei Diagramme.")
    pdf.step(3, "Drücke bei t ~ 1, 2, 4, 6 und 8 s jeweils auf '> Jetzt messen'. Die Punkte erscheinen im v-t-Diagramm und in der Tabelle.")
    pdf.step(4, "Klicke im großen v-t-Diagramm auf zwei Messpunkte. Die Steigung (= a) wird automatisch berechnet und angezeigt.")
    pdf.step(5, "Vergleiche den abgelesenen Wert mit dem eingestellten a. Passen sie überein?")
    pdf.step(6, "Drücke 'Neu starten', wähle a = 5 m/s^2 und wiederhole die Messung (Versuch B).")
    pdf.ln(2)

    pdf.sec("Messwerterfassung  -  Versuch A (a = 3 m/s^2)", PURPLE)
    pdf.th(["Punkt", "t (s)", "v (m/s)", "s (m)", "a (m/s^2)"],
           [22, 28, 36, 36, 52])
    pdf.tr(6, [22, 28, 36, 36, 52],
           prefill=[["1","~1","","","3,0"],["2","~2","","","3,0"],["3","~4","","","3,0"],
                    ["4","~6","","","3,0"],["5","~8","","","3,0"],["6","max","","","3,0"]])
    pdf.ln(3)

    pdf.sec("Messwerterfassung  -  Versuch B (a = 5 m/s^2)", RED)
    pdf.th(["Punkt", "t (s)", "v (m/s)", "s (m)", "a (m/s^2)"],
           [22, 28, 36, 36, 52])
    pdf.tr(5, [22, 28, 36, 36, 52],
           prefill=[["1","~1","","","5,0"],["2","~2","","","5,0"],["3","~4","","","5,0"],
                    ["4","~6","","","5,0"],["5","~8","","","5,0"]])
    pdf.ln(3)

    pdf.sec("Diagramm  -  v-t zeichnen (Versuch A blau, Versuch B rot)")
    pdf.note("Trage deine Messwerte ein und zeichne je eine Ausgleichsgerade. Die Steigung der Geraden ist die Beschleunigung a.")
    pdf.grid(w=158, h=72, cols=8, rows=6)
    pdf.set_font("Helvetica", "", 7.5)
    pdf.set_text_color(*MIDGRAY)
    y = pdf.get_y()
    pdf.set_xy(18, y)
    pdf.cell(158, 5, "t in s  (0 bis 8 s)  ->", align="R")
    pdf.ln(1)
    pdf.set_xy(10, y - 34)
    pdf.cell(6, 5, "v")
    pdf.set_text_color(*DARKGRAY)
    pdf.ln(4)

    pdf.add_page()
    pdf.sec("Auswertung")
    pdf.q(1, "Lies aus dem v-t-Diagramm (Versuch A) die Steigung ab: a = Dv / Dt = _____ / _____ = _______ m/s^2", lines=2)
    pdf.q(2, "Berechne s nach t = 6 s für Versuch A (a = 3 m/s^2):  s = 1/2 * a * t^2 = ________________", lines=2)
    pdf.q(3, "Welche Form hat die s-t-Kurve bei beschleunigter Bewegung? Warum ist das keine Gerade?")
    pdf.q(4, "Vergleiche Versuch A und B: Wie ändert sich v nach 8 s, wenn a von 3 auf 5 m/s^2 steigt?", lines=2)
    pdf.q(5, "Was zeigt das a-t-Diagramm? Warum ist die Linie horizontal (und nicht bei 0 wie bei gleichförmiger Bewegung)?")

    pdf.sec("Fazit")
    pdf.lines(4)
    return pdf


# ============================================================
# AB 1.4 - FREIER FALL
# ============================================================
def ab_freierfall():
    pdf = AB("1.4 Freier Fall", "Klasse 11")
    pdf.add_page()
    pdf.title_block(
        "Versuch 1.4: Freier Fall",
        "Simulation: Fallender Körper  |  g = 9,81 m/s^2  |  s = 1/2*g*t^2", ORANGE)
    pdf.name_row()

    pdf.sec("Lernziele")
    pdf.bullet("Du kennst die Erdbeschleunigung g = 9,81 m/s^2 als konstante Beschleunigung.")
    pdf.bullet("Du kannst Fallstrecke s, Fallgeschwindigkeit v und Fallzeit t berechnen.")
    pdf.bullet("Du erkennst: s-t Parabel, v-t Gerade, a-t Konstante (= g).")
    pdf.ln(2)

    pdf.sec("Physikalischer Hintergrund", ORANGE)
    pdf.body("Im freien Fall wirkt nur die Schwerkraft. Kein Luftwiderstand. g = konstant.")
    pdf.formula_box([
        "a = g = 9,81 m/s^2    (Erdbeschleunigung - konstant)",
        "v(t) = g * t           (Fallgeschwindigkeit - linear steigend)",
        "s(t) = 1/2 * g * t^2   (Fallstrecke - Parabel)",
        "v^2 = 2 * g * s        (Geschwindigkeit aus Weg - ohne Zeit)",
    ], ORANGE)

    pdf.sec("Versuchsdurchführung")
    pdf.body("Öffne '1.4 Freier Fall' in LernStar (Klasse 11 -> Physik).", bold=True)
    pdf.step(1, "Stelle Starthöhe h0 = 20 m ein. Drücke '>  Loslassen'.")
    pdf.step(2, "Lies bei t = 0,5 / 1,0 / 1,5 / 2,0 s die Werte für s und v ab.")
    pdf.step(3, "Berechne s und v mit den Formeln und vergleiche.")
    pdf.step(4, "Wiederhole mit h0 = 45 m. Notiere die Gesamtfallzeit tF und Aufprallgeschwindigkeit.")
    pdf.step(5, "Vergleiche das a-t-Diagramm: Ist a wirklich konstant?")
    pdf.ln(2)

    pdf.sec("Messwerterfassung  -  h0 = 20 m", ORANGE)
    pdf.th(["t (s)", "s gemessen (m)", "s = 1/2*g*t^2 (m)", "v gemessen (m/s)", "v = g*t (m/s)"],
           [20, 36, 44, 38, 36])
    pdf.tr(5, [20, 36, 44, 38, 36],
           prefill=[["0,5","","","",""],["1,0","","","",""],["1,5","","","",""],
                    ["2,0","","","",""],["tF (Aufprall)","","--","","--"]])
    pdf.ln(3)

    pdf.sec("Messwerterfassung  -  Verschiedene Starthöhen")
    pdf.th(["h0 (m)", "tF (Fallzeit, s)", "vF (Aufprall, m/s)", "tF berechnet (s)", "vF berechnet (m/s)"],
           [22, 34, 38, 38, 42])
    pdf.tr(4, [22, 34, 38, 38, 42],
           prefill=[["10","","","",""],["20","","","",""],["45","","","",""],["80","","","",""]])
    pdf.ln(3)

    pdf.sec("Auswertung")
    pdf.q(1, "Berechne tF für h0=45 m:  h0 = 1/2*g*tF^2  =>  tF = sqrt(2*h0/g) = ________", lines=2)
    pdf.q(2, "Berechne vF für h0=45 m:  vF = g * tF = ________  Oder: v = sqrt(2*g*h) = _____", lines=2)
    pdf.q(3, "Hat die Masse des fallenden Körpers Einfluss auf die Fallzeit? Erkläre (Galilei)!")
    pdf.q(4, "Erkläre, warum das a-t-Diagramm eine konstante horizontale Linie zeigt.")
    pdf.q(5, "Ein Ball wird aus 80 m Höhe fallen gelassen. Berechne tF und vF. (Rechenweg!)", lines=3)

    pdf.sec("Fazit")
    pdf.lines(4)
    return pdf


# ============================================================
# AB 1.5 - WURFBEWEGUNG
# ============================================================
def ab_wurfbewegung():
    pdf = AB("1.5 Wurfbewegungen", "Klasse 11")
    pdf.add_page()
    pdf.title_block(
        "Versuch 1.5: Schräger Wurf - Basketballwurf",
        "Simulation: Wurfparabel  |  x = v0*cos(a)*t  |  y = h0 + v0*sin(a)*t - 1/2*g*t^2", TEAL)
    pdf.name_row()

    pdf.sec("Lernziele")
    pdf.bullet("Du verstehst, dass der schräge Wurf eine Überlagerung zweier Bewegungen ist.")
    pdf.bullet("Horizontal: gleichförmig (x = vx * t), Vertikal: gleichmäßig beschleunigt (Freier Fall).")
    pdf.bullet("Du kannst Wurfweite, maximale Höhe und Flugzeit berechnen.")
    pdf.bullet("Du erkennst: der optimale Wurfwinkel für maximale Wurfweite beträgt 45°.")
    pdf.ln(2)

    pdf.sec("Physikalischer Hintergrund", TEAL)
    pdf.body("Die Bewegung wird in eine horizontale (x) und eine vertikale (y) Komponente zerlegt:")
    pdf.formula_box([
        "vx = v0 * cos(alpha)         (horizontale Geschwindigkeit - konstant!)",
        "vy(t) = v0*sin(alpha) - g*t   (vertikale Geschwindigkeit - nimmt ab)",
        "x(t) = vx * t                (horizontaler Weg - gleichförmig)",
        "y(t) = h0 + vy0*t - 1/2*g*t^2 (vertikaler Weg - Parabel)",
        "Flugzeit tF: y(tF) = 0       (Aufprall - quadratische Gleichung lösen)",
        "Wurfweite W = vx * tF        (maximale Reichweite)",
    ], TEAL)
    pdf.ln(2)

    pdf.sec("Versuchsdurchführung")
    pdf.body("Öffne '1.5 Wurfbewegungen' (Basketballwurf) in LernStar (Klasse 11 -> Physik).", bold=True)
    pdf.step(1, "Starteinstellung: v0 = 8 m/s, alpha = 45°, h0 = 1,5 m. Drücke 'Werfen!'.")
    pdf.step(2, "Lies Flugzeit, Wurfweite und max. Höhe ab. Trage die Werte in Tabelle A ein.")
    pdf.step(3, "Variiere den Winkel alpha (20°, 30°, 45°, 60°, 75°) bei v0 = 8 m/s. (Tabelle B)")
    pdf.step(4, "Variiere v0 (4, 6, 8, 10, 12 m/s) bei alpha = 45°. (Tabelle C)")
    pdf.step(5, "Ändere g auf 1,6 m/s^2 (Mond). Wie verändert sich die Wurfweite? (Tabelle D)")
    pdf.ln(2)

    pdf.sec("Tabelle A  -  Basisversuch (v0=8 m/s, alpha=45°, h0=1,5 m)", TEAL)
    pdf.th(["Größe", "Symbol", "Einheit", "Simulationswert", "Formel-Berechnung"],
           [52, 20, 22, 42, 38])
    pdf.tr(0, [52, 20, 22, 42, 38],
           prefill=[
               ["Horizontale Geschw.","vx","m/s","","vx = 8*cos(45) ="],
               ["Vertikale Anfangsgeschw.","vy0","m/s","","vy0 = 8*sin(45) ="],
               ["Flugzeit","tF","s","","--"],
               ["Wurfweite","W","m","","W = vx * tF ="],
               ["Max. Höhe","ymax","m","","--"],
           ])
    pdf.ln(3)

    pdf.sec("Tabelle B  -  Variation Wurfwinkel alpha  (v0=8 m/s, h0=1,5 m)")
    pdf.th(["alpha", "vx (m/s)", "vy0 (m/s)", "Flugzeit tF (s)", "Wurfweite W (m)", "ymax (m)"],
           [22, 28, 28, 34, 34, 28])
    pdf.tr(5, [22, 28, 28, 34, 34, 28],
           prefill=[["20°","","","","",""],["30°","","","","",""],
                    ["45°","","","","",""],["60°","","","","",""],["75°","","","","",""]])
    pdf.ln(2)
    pdf.note("Bei welchem Winkel ist die Wurfweite am größten? Notiere: alpha = _______°")
    pdf.ln(1)

    pdf.sec("Tabelle C  -  Variation Anfangsgeschwindigkeit v0  (alpha=45°, h0=1,5 m)")
    pdf.th(["v0 (m/s)", "vx = vy0 (m/s)", "Flugzeit tF (s)", "Wurfweite W (m)", "W verdoppelt?"],
           [28, 42, 36, 36, 32])
    pdf.tr(5, [28, 42, 36, 36, 32],
           prefill=[["4","","","",""],["6","","","",""],["8","","","",""],
                    ["10","","","",""],["12","","",""," "]])
    pdf.ln(3)

    pdf.add_page()
    pdf.sec("Tabelle D  -  Einfluss der Schwerkraft g  (v0=8 m/s, alpha=45°)", RED)
    pdf.th(["g (m/s^2)", "Himmelskörper", "Wurfweite W (m)", "Flugzeit tF (s)", "W x-fach vs. Erde"],
           [28, 42, 36, 34, 34])
    pdf.tr(0, [28, 42, 36, 34, 34],
           prefill=[
               ["9,81","Erde","","","1,0 (Referenz)"],
               ["1,62","Mond","","",""],
               ["3,72","Mars","","",""],
               ["24,8","Jupiter","","",""],
           ])
    pdf.ln(3)

    pdf.sec("Diagramm  -  Wurfparabel y-x zeichnen (Bahnkurve)")
    pdf.body("Zeichne die Bahn des Balls als y-x-Kurve für alpha = 30°, 45° und 60° (v0 = 8 m/s):")
    pdf.note("Waagerecht: x in m (0 bis 8), Senkrecht: y in m (0 bis 6). Unterschiedliche Farben je Winkel.")
    pdf.grid(w=158, h=75, cols=8, rows=6)
    pdf.ln(3)

    pdf.sec("Auswertung")
    pdf.q(1, "Berechne vx und vy0 für v0=8 m/s, alpha=45°:  vx = v0*cos(45) =       vy0 = v0*sin(45) =", lines=2)
    pdf.q(2, "Warum ist der optimale Wurfwinkel für maximale Wurfweite 45°? Erkläre mit Formeln!")
    pdf.q(3, "Wie verändert sich die Wurfweite, wenn v0 verdoppelt wird? (Tabelle C - Begründung!)")
    pdf.q(4, "Auf dem Mond (g=1,62 m/s^2) fliegt der Ball viel weiter - warum? Berechne das Verhältnis W_Mond / W_Erde!", lines=2)
    pdf.q(5, "Ein Basketballer wirft mit v0=9 m/s, alpha=52°, h0=2,0 m auf einen Korb in 6 m Entfernung. Trifft er? (Rechnung!)", lines=4)

    pdf.sec("Fazit")
    pdf.lines(4)
    return pdf


# ============================================================
# AB 1.6 - KREISBEWEGUNG
# ============================================================
def ab_kreis():
    pdf = AB("1.6 Kreisbewegung", "Klasse 11")
    pdf.add_page()
    pdf.title_block(
        "Versuch 1.6: Kreisbewegung und Zentripetalkraft",
        "Simulation: Das Mega-Karussell  |  Fz = m * om^2 * r", (79, 70, 229))
    pdf.name_row()

    pdf.sec("Lernziele")
    pdf.bullet("Du kannst Winkelgeschwindigkeit om, Bahngeschwindigkeit v und Umlaufzeit T berechnen.")
    pdf.bullet("Du kennst die Formel für die Zentripetalkraft Fz und weißt, worauf sie zeigt.")
    pdf.bullet("Du kannst erklären, was passiert, wenn die Zentripetalkraft wegfällt (Schnur reißt).")
    pdf.ln(2)

    pdf.sec("Physikalischer Hintergrund", (79, 70, 229))
    pdf.formula_box([
        "v = om * r                   (Bahngeschwindigkeit aus Winkelgeschw. und Radius)",
        "T = 2*pi / om                (Umlaufzeit in Sekunden;  pi = 3,14159...)",
        "Fz = m * om^2 * r = m*v^2/r  (Zentripetalkraft - zeigt immer nach innen!)",
        "az = v^2 / r = om^2 * r      (Zentripetalbeschleunigung in m/s^2)",
    ])
    pdf.body("Die Zentripetalkraft wird durch die Schnur aufgebracht. Fällt sie weg, fliegt das Objekt tangential davon!")
    pdf.ln(2)

    pdf.sec("Versuchsdurchführung")
    pdf.body("Öffne '1.6 Kreisbewegung' in LernStar (Klasse 11 -> Physik).", bold=True)
    pdf.step(1, "Starteinstellung: m = 50 kg, r = 2,0 m, om = 2,0 rad/s. Starte die Simulation.")
    pdf.step(2, "Lies v, Fz und T aus der Anzeige ab und trage in Tabelle A ein.")
    pdf.step(3, "Variiere nur r (Werte: 1,0 / 2,0 / 3,5 / 5,0 m) bei gleichem om - notiere Fz. (Tab. B)")
    pdf.step(4, "Variiere nur om (Werte: 1,0 / 2,0 / 3,0 / 4,0 rad/s) bei gleichem r - notiere Fz. (Tab. C)")
    pdf.step(5, "Drücke '>> Schnur reißt!' - beobachte die Richtung der Gondelbewegung!")
    pdf.ln(2)

    pdf.sec("Tabelle A  -  Basisversuch (m=50 kg, r=2 m, om=2 rad/s)", GREEN)
    pdf.th(["Größe", "Symbol", "Einheit", "Simulationswert", "Formel-Berechnung"],
           [52, 20, 22, 42, 38])
    pdf.tr(0, [52, 20, 22, 42, 38],
           prefill=[
               ["Bahngeschwindigkeit","v","m/s","","v = om*r = 2*2 ="],
               ["Zentripetalkraft","Fz","N","","Fz = m*om^2*r ="],
               ["Umlaufzeit","T","s","","T = 2*pi/om ="],
               ["Winkelgeschw.","om","rad/s","2,0 (eingest.)","--"],
           ])
    pdf.ln(3)

    pdf.sec("Tabelle B  -  Variation Radius r  (m=50 kg, om=2 rad/s)")
    pdf.th(["r (m)", "v (m/s)", "Fz (N)", "T (s)", "Fz doppelt wenn r doppelt?"],
           [22, 30, 35, 30, 57])
    pdf.tr(4, [22, 30, 35, 30, 57],
           prefill=[["1,0","","","",""],["2,0","","","",""],["3,5","","","",""],["5,0","","","",""]])
    pdf.ln(3)

    pdf.sec("Tabelle C  -  Variation Winkelgeschwindigkeit om  (m=50 kg, r=2 m)")
    pdf.th(["om (rad/s)", "v (m/s)", "Fz (N)", "T (s)", "Fz 4x wenn om 2x?"],
           [28, 30, 35, 30, 51])
    pdf.tr(4, [28, 30, 35, 30, 51],
           prefill=[["1,0","","","",""],["2,0","","","",""],["3,0","","","",""],["4,0","","","",""]])
    pdf.ln(3)

    pdf.add_page()
    pdf.sec("Auswertung")
    pdf.q(1, "Berechne Fz für m=50 kg, om=2 rad/s, r=2 m mit der Formel. Stimmt es mit Tabelle A?", lines=2)
    pdf.q(2, "Wie verändert sich Fz, wenn r verdoppelt wird (Tabelle B)? Formuliere eine Regel!")
    pdf.q(3, "Wie verändert sich Fz, wenn om verdoppelt wird (Tabelle C)? Quadratisch oder linear?")
    pdf.q(4, "In welche Richtung fliegt die Gondel, wenn die Schnur reißt? Erkläre physikalisch!")
    pdf.q(5, "Auto mit v=20 m/s in Kurve mit r=50 m. Berechne az = v^2/r und Fz für m=1200 kg.", lines=3)

    pdf.sec("Fazit")
    pdf.lines(4)
    return pdf


# ============================================================
# AB 2.3 - NEWTON / RAKETENSTART
# ============================================================
def ab_newton():
    pdf = AB("2.3 Newton F = m * a", "Klasse 11")
    pdf.add_page()
    pdf.title_block(
        "Versuch 2.3: Raketenstart - Newtons 2. Gesetz  F = m * a",
        "Simulation: Rakete zum Mond  |  F_netto = F_Schub - F_Gewicht - F_Luft", RED)
    pdf.name_row()

    pdf.sec("Lernziele")
    pdf.bullet("Du kennst Newtons 2. Gesetz: F_netto = m * a (Kräftebilanz).")
    pdf.bullet("Du kannst erklären, wie Schubkraft, Gewicht und Luftwiderstand zusammenwirken.")
    pdf.bullet("Du kannst die Anfangsbeschleunigung einer Rakete berechnen und Startbedingung prüfen.")
    pdf.ln(2)

    pdf.sec("Physikalischer Hintergrund", RED)
    pdf.formula_box([
        "F_netto = F_Schub - F_Gewicht - F_Luft   (Kräftebilanz)",
        "F_Gewicht = m * g = m * 9,81 N/kg",
        "a = F_netto / m                            (Newtons 2. Gesetz)",
        "Startbedingung:  F_Schub > m * g           => a > 0 => Rakete hebt ab!",
    ], RED)
    pdf.body("Der Luftwiderstand nimmt mit v^2 zu und wirkt der Bewegung entgegen.")
    pdf.ln(2)

    pdf.sec("Versuchsdurchführung")
    pdf.body("Öffne '2.3 Newton' in LernStar (Klasse 11 -> Physik).", bold=True)
    pdf.step(1, "Setze: F_Schub=500 N, m=100 kg, Treibstoff=100%, Luftwiderstand=0. Starte.")
    pdf.step(2, "Berechne theoretisch die Anfangsbeschleunigung a0. Vergleiche mit Simulation.")
    pdf.step(3, "Erhöhe die Masse auf 200 kg - wie ändert sich a0? Schafft die Rakete noch abzuheben?")
    pdf.step(4, "Setze Luftwiderstand = 3 - vergleiche das v-t-Diagramm mit LW=0.")
    pdf.step(5, "Finde die minimale Schubkraft, bei der eine Rakete mit m=100 kg gerade noch abhebt.")
    pdf.ln(2)

    pdf.sec("Messwerterfassung  -  Variation F_Schub (m=100 kg, LW=0)")
    pdf.th(["F_Schub (N)", "F_Gewicht (N)", "F_netto (N)", "a0 (m/s^2)", "Hebt ab? (j/n)"],
           [32, 36, 34, 34, 38])
    pdf.tr(4, [32, 36, 34, 34, 38],
           prefill=[["200","981","","",""],["500","981","","",""],
                    ["1000","981","","",""],["2000","981","","",""]])
    pdf.ln(3)

    pdf.sec("Messwerterfassung  -  Variation Masse m (F=1000 N, LW=0)")
    pdf.th(["m (kg)", "F_Gewicht (N)", "F_netto (N)", "a0 (m/s^2)", "Max. Höhe ca."],
           [26, 36, 34, 34, 44])
    pdf.tr(5, [26, 36, 34, 34, 44],
           prefill=[["20","","","",""],["50","","","",""],["100","","","",""],
                    ["200","","","",""],["500","","","",""]])
    pdf.ln(3)

    pdf.sec("Auswertung")
    pdf.q(1, "Ab welcher minimalen Schubkraft hebt eine Rakete mit m=100 kg ab? Berechne!", lines=2)
    pdf.q(2, "Wie ändert sich a0, wenn die Masse halbiert wird (bei F=1000 N)?")
    pdf.q(3, "Warum nimmt die Beschleunigung zu, wenn der Treibstoff (und damit die Masse) abnimmt?", lines=2)
    pdf.q(4, "Welchen Einfluss hat der Luftwiderstand auf die Maximalgeschwindigkeit? (Diagramm!)")
    pdf.q(5, "Berechne a: F_Schub=1500 N, m=80 kg, v=100 m/s, F_Luft=200 N. Rechenweg zeigen!", lines=3)

    pdf.sec("Fazit")
    pdf.lines(4)
    return pdf


# ============================================================
# AB 3.2 - ENERGIEERHALTUNG / ACHTERBAHN
# ============================================================
def ab_energie():
    pdf = AB("3.2 Energieerhaltung", "Klasse 11")
    pdf.add_page()
    pdf.title_block(
        "Versuch 3.2: Energieerhaltung - Die Achterbahn",
        "Simulation: Wagen auf Bahn  |  E_pot + E_kin = E_ges = konstant", GREEN)
    pdf.name_row()

    pdf.sec("Lernziele")
    pdf.bullet("Du verstehst die Umwandlung von potenzieller Energie E_pot in kinetische E_kin.")
    pdf.bullet("Du kannst E_pot = m*g*h und E_kin = 1/2*m*v^2 berechnen.")
    pdf.bullet("Du erkennst den Energieerhaltungssatz und weißt, was Reibung verändert.")
    pdf.ln(2)

    pdf.sec("Physikalischer Hintergrund", GREEN)
    pdf.formula_box([
        "E_pot = m * g * h          (potenzielle Energie - abhängig von Höhe h)",
        "E_kin = 1/2 * m * v^2      (kinetische Energie - abhängig von v)",
        "E_ges = E_pot + E_kin      (Gesamtenergie - ohne Reibung konstant!)",
        "v_max = sqrt(2 * g * h0)   (max. Geschw. wenn E_pot vollst. in E_kin)",
    ], GREEN)
    pdf.body("Mit Reibung: E_Reibung = mu * m * g * s_ges  (s_ges = zurückgelegte Strecke)")
    pdf.ln(2)

    pdf.sec("Versuchsdurchführung")
    pdf.body("Öffne '3.2 Energieerhaltung' in LernStar (Klasse 11 -> Physik).", bold=True)
    pdf.step(1, "Stelle: Starthöhe h0 = 10 m, Reibung mu = 0, Masse m = 5 kg. Starte.")
    pdf.step(2, "Notiere E_pot, E_kin und E_ges an 5 verschiedenen Positionen (Tabelle A).")
    pdf.step(3, "Berechne v_max (im Tal) und vergleiche mit dem Simulationswert.")
    pdf.step(4, "Erhöhe Reibung auf mu = 0,1 und dann 0,2 - notiere wann der Wagen stoppt (Tab. B).")
    pdf.step(5, "Stelle h0 = 15 m ein. Berechne v_max und vergleiche.")
    pdf.ln(2)

    pdf.sec("Tabelle A  -  Ohne Reibung (mu=0, m=5 kg, h0=10 m)", GREEN)
    pdf.th(["Position", "h (m)", "E_pot (J)", "E_kin (J)", "E_ges (J)", "v (m/s)"],
           [36, 18, 30, 30, 30, 30])
    pdf.tr(0, [36, 18, 30, 30, 30, 30],
           prefill=[
               ["Start (Berg h0=10m)","10,0","","","",""],
               ["1. Tal","0,0","","","",""],
               ["2. Hügel (h~6m)","~6","","","",""],
               ["2. Tal","0,0","","","",""],
               ["Ziel","0,0","","","",""],
           ])
    pdf.ln(3)

    pdf.sec("Tabelle B  -  Einfluss der Reibung (m=5 kg, h0=10 m)")
    pdf.th(["mu", "Stoppt vor Ziel?", "Stopp-Position ca.", "E_ges am Ende (J)", "Energieverlust (J)"],
           [20, 38, 42, 38, 36])
    pdf.tr(4, [20, 38, 42, 38, 36],
           prefill=[["0,0","nein","Ziel","","0"],["0,1","","","",""],
                    ["0,2","","","",""],["0,3","","","",""]])
    pdf.ln(3)

    pdf.sec("Auswertung")
    pdf.q(1, "Berechne v_max (mu=0, h0=10 m):  v = sqrt(2*g*h) = sqrt(2*9,81*10) = _______ m/s", lines=2)
    pdf.q(2, "Ist E_ges ohne Reibung wirklich konstant? Prüfe mit Tabelle A - nenne Zahlenwerte!")
    pdf.q(3, "Was passiert mit der 'verlorenen' Energie bei Reibung? Wohin geht sie?")
    pdf.q(4, "Kann der Wagen (h0=10m) einen zweiten Berg mit h=12 m überqueren? Begründe!", lines=2)
    pdf.q(5, "Berechne E_ges für h0=15 m, m=5 kg: E_ges = m*g*h = 5*9,81*15 = ________ J", lines=2)

    pdf.sec("Fazit")
    pdf.lines(4)
    return pdf


# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    folder = "arbeitsblaetter"
    os.makedirs(folder, exist_ok=True)

    sheets = [
        ("AB_1.2_Gleichfoermige_Bewegung.pdf",   ab_gleichfoermig()),
        ("AB_1.3_Beschleunigte_Bewegung.pdf",    ab_beschleunigung()),
        ("AB_1.4_Freier_Fall.pdf",               ab_freierfall()),
        ("AB_1.5_Wurfbewegungen.pdf",            ab_wurfbewegung()),
        ("AB_1.6_Kreisbewegung.pdf",             ab_kreis()),
        ("AB_2.3_Newton_Raketenstart.pdf",       ab_newton()),
        ("AB_3.2_Energieerhaltung_Achterbahn.pdf", ab_energie()),
    ]

    print("Erstelle Arbeitsblaetter mit Passwortschutz '%s'..." % PASSWORT)
    for filename, pdf in sheets:
        path = os.path.join(folder, filename)
        encrypted = verschluesseln(pdf, PASSWORT)
        with open(path, 'wb') as f:
            f.write(encrypted)
        print("  OK  " + path)

    print("\nFertig! %d Arbeitsblaetter erstellt (Passwort: %s)." % (len(sheets), PASSWORT))
    print("Ordner: " + os.path.abspath(folder))
