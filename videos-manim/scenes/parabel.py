"""Beispiel-Mathevideo (Manim): Die quadratische Funktion y = x².

Zeigt Manims Stärke: exaktes Koordinatensystem, Funktionsgraph, ValueTracker-
gesteuerter Punkt mit live mitlaufenden Koordinaten. LernStar-Design via
lernstar_theme. Kein LaTeX nötig (Text/Pango + Unicode-Hochzahl ²).

Rendern:  manim -qh scenes/parabel.py Parabel
"""
from manim import (
    Scene, Axes, Text, Dot, ValueTracker, always_redraw,
    Create, Write, FadeIn, DOWN, UP, RIGHT, LEFT, smooth, BOLD,
)
from lernstar_theme import COL, FONT, apply_config, header, caption

apply_config()


class Parabel(Scene):
    def construct(self):
        # Kopf oben links
        head = header("MATHEMATIK · FUNKTIONEN", "Die quadratische Funktion")
        self.play(FadeIn(head, shift=DOWN * 0.3), run_time=0.8)

        # Koordinatensystem
        axes = Axes(
            x_range=[-3.5, 3.5, 1],
            y_range=[0, 9, 2],
            x_length=9,
            y_length=4.8,
            axis_config={"color": COL["muted"], "stroke_width": 3},
            tips=True,
        ).shift(DOWN * 0.5)
        x_lbl = Text("x", font=FONT, color=COL["muted"], font_size=30).next_to(axes.x_axis.get_end(), RIGHT, buff=0.2)
        y_lbl = Text("y", font=FONT, color=COL["muted"], font_size=30).next_to(axes.y_axis.get_end(), UP, buff=0.2)
        self.play(Create(axes), FadeIn(x_lbl, y_lbl), run_time=1.2)

        # Parabel y = x²
        graph = axes.plot(lambda x: x ** 2, x_range=[-3, 3], color=COL["green"], stroke_width=6)
        lbl = Text("y = x²", font=FONT, weight=BOLD, color=COL["green"], font_size=46)
        lbl.next_to(axes.c2p(2.1, 4.4), RIGHT, buff=0.1)
        self.play(Create(graph), run_time=1.6)
        self.play(Write(lbl), run_time=0.6)

        # Punkt läuft entlang der Kurve, Koordinaten zählen mit
        t = ValueTracker(-3)
        dot = always_redraw(
            lambda: Dot(axes.c2p(t.get_value(), t.get_value() ** 2), color=COL["amber"], radius=0.12)
        )
        readout = always_redraw(
            lambda: Text(
                f"({t.get_value():.1f} | {t.get_value() ** 2:.1f})",
                font=FONT, color=COL["amber"], font_size=30,
            ).next_to(dot, UP, buff=0.2)
        )
        self.add(dot, readout)
        self.play(t.animate.set_value(3), run_time=3.5, rate_func=smooth)

        # Merksatz unten
        cap = caption("Jeder x-Wert wird quadriert – das ergibt die Parabel.")
        cap.to_edge(DOWN, buff=0.35)
        self.play(FadeIn(cap, shift=UP * 0.2), run_time=0.6)
        self.wait(1.5)
