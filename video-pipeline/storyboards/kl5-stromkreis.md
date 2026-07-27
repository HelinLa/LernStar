# Storyboard · Klasse 5 RS Physik — „Wann leuchtet eine Lampe?" (einfacher Stromkreis)

Neuer Composite (Motion Canvas + Remotion/Anna), Neubau als **neue Datei** für die
bestehende `stromkreis-lampe.mp4` (Original bleibt bis zur Freigabe unangetastet).

THEMA / KLASSE: Einfacher Stromkreis, geschlossener Kreis, Elektronenfluss / Kl. 5 RS
KERNFRAGE: Wann leuchtet eine Lampe – und was fließt da eigentlich im Draht?

FEHLVORSTELLUNGEN:
  - **Verbrauchsvorstellung:** „Die Lampe verbraucht Strom – hinter der Lampe kommen
    weniger Elektronen an." (die häufigste Fehlvorstellung zum Stromkreis)
  - **Einpol-/Ein-Kabel-Vorstellung:** „Ein Kabel von der Batterie reicht, der Strom
    kommt aus einem Pol."
  - **Stau-Vorstellung:** „Öffnet man den Kreis, stauen sich die Elektronen vor der Lücke,
    dahinter fließt es noch kurz weiter."

KORREKTUR-IDEE (sichtbare Animation):
  Elektronen als gleichmäßig verteilte, umlaufende Punkte-Kette. (1) Dichte ist überall
  gleich – vor UND hinter der Lampe fließen sichtbar gleich viele (Zähl-Callout) → entlarvt
  „verbraucht". (2) Die Lampe leuchtet, während die Elektronen unverändert durchlaufen und
  zur Batterie zurückkehren → „Energie wird verbraucht, nicht der Strom". (3) Öffnet der
  Schalter, stehen ALLE Punkte gleichzeitig still (kein Stau) → „geschlossener Kreis nötig".

WERKZEUG(E): Motion Canvas (umlaufende Elektronen, Schalter, Lampe) + Remotion (Titel/
  Untertitel/Anna/SFX). Composite-Standard.

SZENEN:
  # | Was passiert SICHTBAR (Bewegung)                                  | Fokus-Lenkung           | Kernaussage                          | Gate
  1 | Stromkreis erscheint, unbestromt (Schalter offen, Lampe dunkel)   | ruhiges Einblenden       | Was braucht die Lampe zum Leuchten?  | ✓
  2 | Schalter schließt → Elektronen laufen los → Lampe leuchtet         | grüner Schließen-Puls    | Nur geschlossener Kreis leuchtet      | ✓ Einpol-Vorstellung
  3 | Nahblick: gleichmäßige Elektronen-Kette dreht sich im Kreis        | Punkte-Kette, Pfeilsinn  | Elektronen bewegen sich im Draht     | ✓
  4 | Zähl-Callout vor/hinter Lampe – gleich viele (falsch: weniger) x   | zwei Zähler, Vergleich   | Gleich viele – nichts verschwindet   | ✓ Verbrauchsvorstellung
  5 | Lampe glüht warm; Elektronen laufen unverändert zur Batterie zurück| Energie-Glow an Lampe    | Energie wird verbraucht, nicht Strom | ✓
  6 | Schalter öffnet → ALLE Elektronen stoppen gleichzeitig, Lampe aus  | Lücke rot, alles steht   | Lücke → nichts fließt → dunkel       | ✓ Stau-Vorstellung
  7 | Kreis wieder zu, ruhiger Umlauf; Merksatz                          | Lampe hell, Kette ruhig  | Geschlossen leuchtet; Strom bleibt   | ✓
  8 | Aufhellen, Sternlogo                                               | Ausblenden               | Ein Kabel reicht nicht               | ✓

FORMEL(N): keine (Klasse 5).

SPRECHERTEXT: `videos-remotion/src/narration/stromkreis-mc.json` — an die Animationsbeats
  angepasst (zuletzt geschrieben).
