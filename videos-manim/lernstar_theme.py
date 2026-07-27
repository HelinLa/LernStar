"""LernStar-Design für Manim – spiegelt video-pipeline/design-tokens.json.

Sorgt dafür, dass Manim-Mathevideos exakt dieselbe Farbwelt/Format wie die
Remotion- und Motion-Canvas-Videos haben ("aus einem Guss").
"""
from manim import (
    config,
    Text,
    VGroup,
    ManimColor,
    BOLD,
    UL,
    DOWN,
    LEFT,
)

# --- Farben (identisch zu design-tokens.json) ---
COL = {
    "bg0": "#0f172a",
    "bg1": "#1e293b",
    "ink": "#f8fafc",
    "muted": "#cbd5e1",
    "indigo": "#818cf8",
    "indigoDeep": "#6366f1",
    "amber": "#fbbf24",
    "green": "#22c55e",
    "red": "#ef4444",
    "sky": "#38bdf8",
    "ground": "#334155",
    "ice": "#bae6fd",
}

# macOS-vorhandene, saubere Sans (Remotion/MC nutzen system-ui → optisch nah).
FONT = "Helvetica Neue"


def apply_config():
    """Format & Hintergrund auf LernStar-Standard setzen (1920x1080, 30 fps)."""
    config.pixel_width = 1920
    config.pixel_height = 1080
    config.frame_rate = 30
    config.background_color = ManimColor(COL["bg0"])


def kicker(text: str) -> Text:
    return Text(text, font=FONT, weight=BOLD, color=COL["indigo"], font_size=30)


def title(text: str) -> Text:
    return Text(text, font=FONT, weight=BOLD, color=COL["ink"], font_size=54)


def caption(text: str) -> Text:
    return Text(text, font=FONT, weight=BOLD, color=COL["ink"], font_size=34)


def header(kicker_text: str, title_text: str) -> VGroup:
    """Standard-Kopf oben links (Kicker + Titel), wie SceneTitle in Remotion/MC."""
    k = kicker(kicker_text)
    t = title(title_text)
    g = VGroup(k, t).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
    g.to_corner(UL, buff=0.6)
    return g
