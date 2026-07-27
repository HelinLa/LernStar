# Verbindlicher Didaktik-Standard für ALLE Physikvideos

> **Leitsatz:** „Was erklärt wird, muss gleichzeitig sichtbar werden."
>
> Physik wird **nicht über Sprache**, sondern über **sichtbare Vorgänge** erklärt.
> Die Animation ist der **wichtigste Bestandteil** des Videos, kein Dekor.
> Ziel jedes Videos ist nicht nur Erklärung, sondern das **sichtbare Korrigieren
> typischer Fehlvorstellungen**.

Gilt ab 2026-07-27 für jedes neue Physikvideo. Ergänzt (überstimmt bei Konflikt)
den allgemeinen Produktions-Leitfaden `README.md`.

## Produktionsreihenfolge (verbindlich, genau in dieser Reihenfolge)

1. **Thema analysieren** – welcher Vorgang, welche Größen?
2. **Fehlvorstellungen identifizieren** – typische Schülervorstellungen zum Thema sammeln.
3. **Korrektur-Animation wählen** – welche sichtbare Bewegung entlarvt/korrigiert die Fehlvorstellung am besten?
4. **Storyboard** erstellen (Vorlage unten).
5. **Animationen entwickeln.**
6. **Erst danach Sprechertext** – der Text richtet sich nach den Animationen, nie umgekehrt.

## Szenenprinzip (jede Szene)

- Sprecher erklärt einen Sachverhalt – **gleichzeitig** erscheint die passende Animation.
- **Pfeile, Farben, Markierungen, Bewegung** lenken den Blick auf das Wesentliche.
- **Unwichtiges wird ausgeblendet.**
- Die Animation **verändert sich synchron** mit der Erklärung.
- **Bewegung in jeder Szene.** Keine statischen Bilder, keine langen Texteinblendungen, kein Foliencharakter.

## Animationsregeln (konkret umsetzen)

- **Kräfte** bewegen Objekte sichtbar (Kraftpfeil erscheint → Objekt bewegt/verformt sich).
- **Lichtstrahlen** breiten sich sichtbar aus (Strahl wächst vom Sender zum Ziel).
- **Elektronen/Ladungen/Teilchen** bewegen sich sichtbar (fließende Punkte).
- **Magnetfelder/Felder** entstehen und verändern sich sichtbar (Feldlinien bauen sich auf).
- **Energieflüsse** werden animiert (fließende Ströme, wandernde Balken).
- **Schwingungen** schwingen, **Wellen** laufen wirklich durchs Bild.
- **Diagramme** entstehen Schritt für Schritt (Punkt für Punkt, Kurve wächst mit).
- **Formeln** werden **aus der Animation entwickelt** (Größen aus dem Bild → daraus die Formel), nicht bloß eingeblendet.

## Werkzeugwahl nach Bewegungsart

| Vorgang | Werkzeug |
|---|---|
| kontinuierliche Bewegung, Kräfte, Strahlen, Felder, Schaltungen, Messgeräte | **Motion Canvas** |
| Funktionen, Graphen, Vektoren, Geometrie, Herleitungen, entstehende Diagramme | **Manim** |
| 3D-Raum: Motor/Generator, Sonnensystem, Moleküle, räumliche Felder | **Blender** |
| Vertonung, Untertitel, Fokus-Overlays, Übergänge, Endrender, Zusammensetzen | **Remotion** (Composite über die Fachanimation) |

Standard ist der **Composite-Weg**: Fachanimation (MC/Manim/Blender) + Remotion legt
Anna-Stimme, Untertitel und Fokus-Markierungen darüber (Referenz: 9.3.7 Energieerhaltung).

## Selbstprüfung je Szene – GATE (alle 4 müssen JA sein, sonst Szene überarbeiten)

1. Ist **jeder erklärte Begriff sichtbar** animiert?
2. Gibt es **zu jeder wichtigen Aussage** eine Animation?
3. **Verhindert/korrigiert** die Szene eine typische Fehlvorstellung?
4. Ist die **Animation einfacher zu verstehen als die Sprache**?

Praxistest: Würde ein Schüler nach wenigen Sekunden sagen
**„Jetzt verstehe ich endlich, was dort passiert."**? Wenn nein → überarbeiten.

## Qualität

Ruhig, hochwertig, modern, didaktisch sinnvoll. **Nicht möglichst viele Effekte** –
genau die Animationen, die das Verständnis verbessern. Ziel: Vorgänge werden nicht nur
gehört, sondern **gesehen, verstanden und dauerhaft behalten**.

---

## Storyboard-Vorlage (vor jedem Physikvideo ausfüllen)

```
THEMA / KLASSE:
KERNFRAGE (Forscherfrage):

FEHLVORSTELLUNGEN (typische Schülervorstellungen):
  - …
  - …
KORREKTUR-IDEE (welche sichtbare Animation entlarvt die Fehlvorstellung):
  - …

WERKZEUG(E):

SZENEN (je Zeile eine Szene):
  # | Was passiert SICHTBAR (Bewegung) | Fokus-Lenkung (Pfeil/Farbe/Markierung) | Kernaussage | Gate 1-4 ok?
  1 | …                                | …                                      | …           | ✓/✗
  2 | …                                | …                                      | …           | ✓/✗

FORMEL(N) – falls: aus welcher Animation wird sie entwickelt?

SPRECHERTEXT (ZULETZT, an die fertigen Animationen angepasst):
  intro: …
  …
```
