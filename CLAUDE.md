# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LernStar NRW** – a browser-only Progressive Web App (PWA) for school students in NRW (North Rhine-Westphalia, Germany). No build tools, no frameworks, no server. All files are plain HTML/CSS/JS, deployed via GitHub Pages. The AI tutor persona is called **"Herr Lala"**.

## How to Run

Open `index.html` directly in a browser, or use the `.bat` files:
- `LernStar starten.bat` — opens the local version
- `LernStar online teilen.bat` — opens the GitHub Pages URL

To deploy: run `PUSH_TO_GITHUB.bat` (or `git push`). GitHub Pages serves `main` branch automatically.

## Cache Busting

Every JS and CSS file uses a `?v=N` query string in `index.html`. **Always increment the version number** after changing any of these files:

```html
<link rel="stylesheet" href="style.css?v=39" />
<script src="content.js?v=192"></script>
<script src="js/ai_engine.js?v=1"></script>
<script src="js/sim-lader.js?v=1"></script>
<script src="app.js?v=141"></script>
<script src="js/heft-bruecke.js?v=1"></script>
<script src="js/heft-banner.js?v=2"></script>
<script src="quiz-game.js?v=1"></script>
```

**`physics-sim.js` wird NICHT mehr per `<script>` eingebunden.** Die Datei ist 3,3 MB
gross und muesste sonst bei jedem Start geparst werden. `js/sim-lader.js` legt
Platzhalter fuer `openPhysicsSim` und `openArbeitsblatt` an, laedt die Datei beim
ersten Aufruf nach und holt sie ausserdem im Leerlauf vor — der erste Klick sitzt
also trotzdem sofort, und offline bleibt sie im Cache.

**Achtung bei neuen Versionen:** Die `?v=`-Nummer von `physics-sim.js` steht in
`js/sim-lader.js` (Konstante `QUELLE`), nicht in `index.html`. Wer sie dort vergisst,
umgeht das Cache-Busting fuer die groesste Datei des Projekts.

**Service Worker caveat:** `sw.js` serves `index.html` **network-first** — cache-first there would pin an old `index.html` with stale `?v=` numbers, silently defeating all cache busting. Everything else stays cache-first (safe, because `?v=N` makes each version a new URL). Bump `CACHE` in `sw.js` whenever you change that file.

## Architecture

All logic runs in the browser. Script load order in `index.html` is critical (each depends on the previous):

```
gs-content.js → content.js → fk-magnet.js → js/ai_engine.js → js/sim-lader.js
 → app.js → js/heft-bruecke.js → js/heft-banner.js → quiz-game.js

physics-sim.js haengt nicht in dieser Kette: js/sim-lader.js holt sie bei Bedarf nach.
js/heft-bruecke.js und js/heft-banner.js verbinden das gedruckte Forscherheft mit den
Simulationen (QR-Link #experiment=<sim>&heft=<seite>); heft-bruecke.js wird aus den
forscherseiten.json aller drei Hefte erzeugt (python3 arbeitsheft/bruecke_alle.py).
```

### content.js — Content Database

A single giant `const CONTENT = { ... }` object. Each key is a grade ID (e.g. `klasse5`, `klasse5_rs`, `klasse8_hs`, `klasse10_gts`). Structure per entry:

```js
klasseN_xx: {
  id, num, label, emoji, color: [gradient1, gradient2], light, tagline,
  subjects: [
    {
      id: 'mathe'|'physik',
      name, icon, desc, color, intro,
      topics: [
        { isChapter: true, name: '📚 Kapitelname' },  // visual chapter separator
        { name: 'Thema', diff: 1|2|3, explanation: '...' },
        ...
      ],
      exercises: [
        { id, type, diff, title, desc, questions: [
          { q, hint, options: [...4], correct: 0-3, explanation }
        ]}
      ]
    }
  ]
}
```

**Key rules for content:**
- **NO Deutsch subject for Klasse 5 and above** (only Grundschule Klasse 1–4 has Deutsch)
- Every `topics` array must have `{ isChapter: true, name: '...' }` entries before each chapter group
- `hint` fields must NEVER give direct answers — only learning strategy hints
- Every exercise has exactly 8 questions (standard) with 4 answer options each

### app.js — Application Logic

Global state object `state` holds current view, gradeId, subjectId, quiz state, user progress, personalization.

**School form system:**

`SCHOOL_TYPES` defines 5 forms: `grundschule`, `hauptschule`, `realschule`, `gymnasium`, `gesamtschule`.

`GRADE_GRADIENTS` maps grade keys (including suffixed variants `_rs`, `_hs`, `_gts`) to CSS gradient strings.

`activeSchoolType` (persisted in `localStorage`) drives content selection.

`getGradeKey(baseId)` resolves the correct `CONTENT` key based on `activeSchoolType`:
- `gesamtschule` → tries `baseId + '_gts'`, falls back to base (= Gymnasium content for Kl. 11–13)
- `hauptschule` → tries `baseId + '_hs'`, then `_rs`, then base
- `realschule` → tries `baseId + '_rs'`, then base
- `gymnasium` / `grundschule` → always base key

**Grade key suffixes by school form:**
| Schulform | Suffix | Klassen |
|-----------|--------|---------|
| Realschule | `_rs` | 5–10 |
| Hauptschule | `_hs` | 5–9 |
| Gesamtschule | `_gts` | 5–10 (11–13 = Gymnasium base) |

**data-grade attribute** — must strip ALL suffixes for CSS compatibility:
```js
state.gradeId.replace('klasse','').replace('_rs','').replace('_hs','').replace('_gts','')
```

**Navigation:** `navigate(view, gradeId, subjectId, exerciseId)` is the single routing function. Views: `home`, `grade`, `subject`, `quiz`, `result`, `examprep`, `analyse`.

### js/ai_engine.js — Browser-side AI

`LernStarAI` class — stores user-generated exercises in `localStorage` under key `ls_exercises`. Tracks learning strength levels and generates multiple-choice exercises from stored patterns.

### Physics Simulations

`physics-sim.js` provides interactive simulations (Newton, Kreisbewegung, etc.) embedded inside the subject view for Physik topics.

### KI Chat ("Herr Lala")

The chat widget uses the **Groq API** (primary), with fallback to any OpenAI-compatible API configured by the user. KI provider settings are stored in `localStorage`. ElevenLabs TTS (`ELEVEN_KEY` constant in `app.js`) adds voice narration.

### Quiz Game

`quiz-game.js` + `quiz-game.css` — standalone mini-game with timer, lives, streak bonuses, and highscore. Launched from the home banner.

## Adding New School Form Content

1. Add `klasseN_xx` entries to `CONTENT` in `content.js` with the correct suffix
2. Add `GRADE_GRADIENTS` entries for the new keys in `app.js`
3. Add the school form to `SCHOOL_TYPES` in `app.js` if it's a new form
4. Update `getGradeKey()` in `app.js` if new fallback logic is needed
5. Add the school form button to `index.html` with `.sf-card-xx` class
6. Add `.sf-card-xx` color styles to `style.css`
7. Bump all version numbers in `index.html`

## Arbeitshefte – Reihe FELO (`arbeitsheft/` = Klasse 5/6, `arbeitsheft7/`, `arbeitsheft8/`, `arbeitsheft9/`, `arbeitsheft10/`)

Die Reihe heisst **FELO** (Forschen · Eigeninitiative · Lernen · Organisieren); die Baende
heissen FELO PHYSIK 5/6, 7, 8, 9 und 10, Schulform REALSCHULE NRW steht auf jedem Cover. Die QR-Adresse
bleibt `https://helinla.github.io/LernStar/` – dorthin zeigen alle gedruckten Codes.
Kennungen: Kl.5/6 `m l s w sc h` · Kl.7 `o f g t` · Kl.8 `sp wd lt bg` · Kl.9 `kr bw en kw` · Kl.10 `mo ge ak ke`.

**QR-Codes werden gegengelesen – bei fuenf Vergroesserungen.** `make_qr.py` erzeugt jeden
Code, schickt ihn durch dieselben zwei Verkleinerungen wie die Seite und entziffert ihn danach
mit OpenCV bei 3-, 4-, 5-, 6- und 8-facher Vergroesserung (`arbeitsheft/qr_lesbar.py`). Nur wenn
ALLE fuenf denselben Text liefern, gilt der Code als sicher; sonst wird er mit einer anderen
Maske neu gesetzt, bei gleicher Groesse und Fehlerkorrektur. Ein einzelner Lesedurchgang genuegt
nicht: `mo10` las sich bei 4x, 6x und 8x tadellos, bei 10x gar nicht. Der Pruefbereich ist
gemessen – bei 12x versagt JEDER Code, bei 10x 62 %; das ist eine Eigenart des Decoders, keine
Schwaeche der Codes. Unter diesem Maszstab brauchten **93 von 174 Codes** eine andere Maske.

Alle vier Hefte teilen sich EINEN Satzmotor: `arbeitsheft/build_final.py` (Seitenraster, Schriften,
Zeichenhilfen), `arbeitsheft/textschicht.py` (unsichtbare, durchsuchbare Textebene ueber den
Seitenbildern). Die `build_book.py` der Klassen 7, 8 und 9 importieren ihn ueber `sys.path`,
kopieren ihn nicht. `build_final.py` wird nie geaendert – Klasse 5/6 ist gedruckt.
Klassenspezifisch ist allein `plan.py` je Heft: Kapitel, Themen, Videos, Simulationen.

**Falle 1 – `HERE` wird vom Stern-Import ueberschrieben.** `build_final.py` definiert selbst ein
`HERE` (Ordner von Klasse 5). Wer in einem anderen Heft `HERE` VOR `from build_final import *`
setzt, verliert es wieder und schreibt seine Dateien in den falschen Ordner. `HERE` muss immer
DANACH gesetzt werden.

**Falle 2 – Heft-Kennungen sind klassenuebergreifend eindeutig.** Der QR-Link traegt
`#experiment=<simId>&heft=<topicId>`, und `js/heft-banner.js` sucht `topicId` in
`js/heft-bruecke.js` ohne zu wissen, aus welchem Heft sie stammt. Klasse 5 belegt `m`, `l`, `s`,
`w`, `sc`, `h`; Klasse 7 nutzt deshalb `o`, `f`, `g`, `t`. Eine doppelte Kennung blendet in der
Simulation die Forscherfrage des falschen Hefts ein.

**Seitenzahlen werden GEMESSEN, nicht gerechnet.** `export_bruecke.py` hat die Seitenlogik
frueher nachgebaut und geriet aus dem Tritt, als je Kapitel eine Weiterdenken-Seite dazukam –
124 von 173 Seitenzahlen in der App waren falsch, bei Klasse 9 teils um 30 Seiten. Gemessen
wird mit **`python3 simcheck/seitenzahlen.py <heftordner>`**: Der Durchgang liest die QR-Codes
aus `build/book_p*.png` (Ausschnitt x = 1050…1176, y = 53…179) und schreibt
`<heft>/build/seiten.json`; `export_bruecke.py` zieht diese Datei dem Zaehler vor.

> **Falle:** Fehlt `seiten.json`, faellt `export_bruecke.py` STILL auf den gerechneten Zaehler
> zurueck – ohne Warnung. Nach jedem `build_book.py` also `simcheck/seitenzahlen.py` laufen
> lassen, BEVOR die Bruecke gebaut wird. Das Werkzeug ist geeicht: Es reproduziert alle 39
> bekannten Seitenzahlen von Klasse 10 exakt.

**Bruecke neu erzeugen** nach jeder Inhaltsaenderung: `python3 arbeitsheft/bruecke_alle.py`
(schreibt `js/heft-bruecke.js` aus ALLEN Heften – fuenf Realschule, vier Gesamtschule,
fuenf Gymnasium, ein Foerderheft),
danach die `?v=`-Nummer in `index.html` hochzaehlen. Baende ohne `content/forscherseiten.json`
werden uebersprungen, nicht als Fehler behandelt.

Jeder Bruecken-Eintrag traegt neben `klasse` auch **`schulform`**: Klasse 7 gibt es zweimal,
als Realschul- und als Gesamtschulheft. Ohne die Schulform koennte die App die beiden nicht
auseinanderhalten. **Nicht** `arbeitsheft/export_bruecke.py` allein
aufrufen: das schreibt dieselbe Datei mit nur den Seiten von Klasse 5/6 und loescht die
anderen Hefte daraus.

**Falle 3 – `sys.path.insert` holt das falsche `build_book`.** Jedes Heft hat ein Modul
dieses Namens. Wer in `make_qr.py` einen anderen Heftordner vorne in `sys.path` schiebt,
laesst alle Hefte das `build_book` von Klasse 5/6 importieren und schreibt die QR-Codes
aller Klassen in denselben Ordner. Gemeinsame Hilfsmodule deshalb ueber
`importlib.util.spec_from_file_location` laden, nicht ueber `sys.path`.

## Arbeitshefte – Reihe FELO Gesamtschule (`arbeitsheft_gts7/`, `_gts8/`, `_gts9/`, `_gts10/`)

Zweite Reihe derselben Marke, Schulform **GESAMTSCHULE NRW** auf dem Cover. Grundlage ist der
Kernlehrplan Naturwissenschaften fuer die Gesamtschule (Heft 3108, 2. Auflage 2013), Abschnitt D
"Fachunterricht Physik". Die Inhaltsfelder sind anders geschnitten und anders nummeriert als in
der Realschule – deshalb liegt die Zuordnung in `arbeitsheft/lehrplan_gts.py`, getrennt von
`lehrplan.py`. **An der Realschulreihe wird nichts geaendert; sie ist gedruckt.**

Kennungen: Kl.7 `oi ew` · Kl.8 `st be` · Kl.9 `kf el` · Kl.10 `ev rk`.
Alle gegen die vergebenen Kennungen der Realschulreihe geprueft und kollisionsfrei.

**Eine Datei fuer alle vier Baende.** Anders als in der Realschulreihe sind `build_book.py`,
`bilder.py`, `bildauftraege.py`, `make_qr.py`, `export_bruecke.py` und `uebernehmen.py` in allen
vier Ordnern IDENTISCH. Klasse, Schulform, Kapiteltitel, Betreff und Dateinamen zieht
`build_book.py` aus `plan.py` (`KLASSE`, `SCHULFORM`, `ALLE_KAPITEL`). Beim naechsten Band also
nur `plan.py` schreiben und die Skripte kopieren – nichts von Hand anpassen.

**G/E-Differenzierung ab Jahrgang 9** (APO-SI). Themen, die nur der E-Kurs bearbeitet, tragen im
Bauplan `"kurs": "E"`; `uebernehmen.py` reicht das durch und `topic_page()` setzt ein Abzeichen
"E-KURS" in die Kopfzeile. In den Jahrgaengen 7 und 8 wird klassenweise unterrichtet (`KURSE = False`).

**Themennamen tragen echte Umlaute.** Sie werden GEDRUCKT (Trennseite, Lesezeichen,
Uebungsseite). In `plan.py` gilt die ASCII-Konvention deshalb nur fuer Kommentare und Docstrings,
NICHT fuer `RAHMEN`, `titel`, `vorhaben`, `inhaltsfeld` und `name` – dort stehen ä, ö, ü, ß.
Beim Anlegen der vier Baende waren 75 Stellen betroffen ("Oberflaeche" statt "Oberfläche").

## Arbeitshefte – Reihe FELO Foerderheft (`arbeitsheft_foe7/`)

Dritte Reihe derselben Marke: **FÖRDERHEFT**, Schulform GESAMTSCHULE NRW. Gleiche
fachliche Ziele wie `arbeitsheft_gts7`, leichterer Lernweg (A2–B1, Foerderbedarf Lernen,
DaZ). Hausstil steht in `FOERDER_PROFIL.md`, die Herleitung in `SEITENPLAN.md`
(am 04.09.2026 freigegeben). Kennungen: `fo` (Optik) · `fw` (Weltall).

**Andere Inhaltsdateien als die Regelhefte.** Statt forscherseiten/uebungen/assessment/
transfer gibt es `content/foerderseiten.json` und `content/loesungen_lehrer.json`
(je 25 Eintraege) plus `content/foerdertests.json` (2 Tests à 13 Punkte).
`arbeitsheft/bruecke_alle.py` kennt beide Saetze (`NOETIG_REGEL` / `NOETIG_FOERDER`).

**Arbeitsstand liegt einheitenweise.** `einheiten/<id>.json` enthaelt je
`{"seite": …, "lehrer": …}`; `zusammenfuehren.py` baut daraus die beiden
content-Dateien in der Reihenfolge von `plan.py`. So ueberlebt ein langer Lauf
einen Abbruch ([[lange-laeufe-ruhezustand]]).

**Werte kommen aus `fakten/<sim>.json`** – simfakten-Dumps aller 25 Simulationen.
Nie aus dem Kopf schreiben, was am Bildschirm steht.

**Rendervertrag ist eng** (`build_pilot.py` setzt Seite A / B / Lehrerseite):
genau 3 Tabellenspalten, 2–5 Zeilen mit vollstaendig gefuellter Beispielzeile,
GENAU 2 Merksatz-Luecken, Aufgaben exakt erkennen–einsetzen–erklaeren, 3 Hilfestufen
(H3 mit `___`), 3 Selbstcheck-Aussagen. `pruefe_profil.py` prueft das plus die
Sprachregeln – und besteht vorher einen **Selbsttest** (1 gute + 10 absichtlich
kaputte Proben), sonst urteilt er nicht.

**Seite A und Seite B tragen denselben QR-Code.** `simcheck/seitenzahlen.py` nimmt
deshalb den **ersten** Treffer (= Seite A, wo das Thema anfaengt). Fuer die
Regelhefte aendert das nichts, dort kommt jede Kennung genau einmal vor; die
Eichung an Klasse 10 (39 Seitenzahlen) reproduziert unveraendert.

Ablauf: `python3 make_qr.py` → `python3 build_book.py` (setzt Heft **und**
Lehrerband) → `python3 ../simcheck/seitenzahlen.py arbeitsheft_foe7` →
`python3 ../arbeitsheft/bruecke_alle.py` → `?v=` in `index.html` hochzaehlen.
Ergebnis: 59 Schuelerseiten + 29 Seiten Lehrerband.

## Datenblaetter (Seiten ohne Simulation)

Themen ohne Simulation tragen im Inhalt ein Feld **`daten`** mit `spalten`, `zeilen`,
optional `quelle` und `merke`. `build_book.datenblatt()` setzt daraus die gedruckte
Tabelle rechts neben den Arbeitsschritten; Abschnitt 3 heisst dann "AUSWERTEN &
BEURTEILEN" statt "FORSCHEN AM BILDSCHIRM", und der QR-Code entfaellt.

> **Fehlt `daten`, verweist die Seite ins Leere.** Die Arbeitsschritte sagen "Lies im
> Datenblatt ..." – gedruckt wird dann aber keine Tabelle. Bei den fuenf Datenblatt-Themen
> von FELO 10 Gesamtschule war das zunaechst so.

**Zellen werden UMGEBROCHEN, nicht verkleinert** (Stand 01.09.2026). Vorher schrumpfte
`_fitfont` nur bis 9 pt und liess den Text danach in die Nachbarspalte laufen. Bei drei
Spalten (400 pt breit, Anteile 0,36/0,34/0,30) passen einzeilig nur **24, 22 und 19
Zeichen** – gemessen, nicht geschaetzt. Betroffen waren **28 Zellen in Heft 10** und
**8 in Heft 9** der Realschulreihe; auf Seite 121 stand gedruckt
"liefert Strom unabhaengig vom WetterUran muss eingefuehrt werden".

Ein Wort ohne Leerzeichen laesst sich nicht umbrechen ("Gas-und-Dampf-Kraftwerk").
Dafuer gibt es ein Sicherheitsnetz: passt eine Zeile auch umgebrochen nicht, wird NUR
diese Zelle verkleinert (11,5 → 8,5 pt). Besser ist trotzdem, im Text zu trennen.

Ein hoeheres Datenblatt kann dazu fuehren, dass Abschnitt 4 und 5 auf eine **zweite
Seite** rutschen (`sichern_aufgaben_seite`). Das ist so gewollt – lieber eine zweite
Seite als weniger Schreiblinien. Dadurch wuchs Heft 9 von 255 auf 257, Heft 10 von 179
auf 186 und FELO 10 Gesamtschule von 121 auf 126 Seiten.

## simcheck/ – Pruefwerkzeuge

Sieben Werkzeuge, alle an bekannten Faellen geeicht. Ausfuehrlich in `simcheck/README.md`.

| Werkzeug | Zweck |
|---|---|
| `rauchtest.js` | Simulation in einer Mini-DOM oeffnen, jedes Bedienelement betaetigen, Bild gegen Bild vergleichen |
| `simfakten.js` | auslesen, WAS eine Simulation wirklich anzeigt – Grundlage jeder Heftseite |
| `werte.js` | eine Simulation einstellen und eine bestimmte Anzeige ausgeben (Rechentest) |
| `einbaupruefung.py` | neue Simulationsdatei vor dem Einbau pruefen (Namens- und DOM-Kollisionen) |
| `einbau.py` | Registry-Eintrag und Implementierung in `physics-sim.js` einsetzen |
| `heft_gegen_sim.py` | prueft, ob eine Heftseite nur Werte verlangt, die am Bildschirm stehen |
| `seitenzahlen.py` | liest die Seitenzahlen aus den gesetzten Seiten (siehe oben) |

Dazu `arbeitsheft/formregeln.py` – die Formregeln der Forscherseiten, geeicht an den 162
abgenommenen Seiten der Realschulreihe (0 Fehlalarme). `seiten_nachbereiten.py` streut ausserdem
die Antwortpositionen: Beim Schreiben steht die richtige Vermutung immer an Stelle 2, danach
wird je Kapitel gleichmaessig verteilt.

**Drei Zustaende, nicht zwei.** Der Rauchtest unterscheidet *animiert* (das Bild laeuft von
selbst), *reagiert* (es aendert sich auf Bedienung) und *tot* (auch nach Betaetigen aller
Bedienelemente aendert sich nichts). Nur "tot" ist ein Mangel: Die meisten Simulationen dieses
Projekts sind **Messgeraete, keine Filme**, und stehen zu Recht still, bis man etwas verstellt.
Von den 132 in Heften benutzten Simulationen sind 67 animiert, 58 reagieren, **0 sind tot**.

**Werkzeuge haben eigene Fehler.** Beim Bau am 31.08.2026 hatte jedes einzelne mindestens einen –
zehn insgesamt, darunter ein Vergleich unterschiedlich langer Frame-Listen (jede stehende
Simulation galt als lebendig) und eine Handler-Liste, die WAEHREND der Schleife wuchs
(Endlosschleife, sechs Simulationen sprengten den Speicher). Kein Pruefer darf urteilen, bevor er
an einer laufenden, einer stehenden und einer abstuerzenden Probe bestanden hat.

## Ablauf beim Bau eines Hefts

```
cd <heftordner>
python3 uebernehmen.py <seiten.json>          # Formregeln + Reihenfolge
python3 make_qr.py                            # QR-Codes, bei 5 Vergroesserungen gegengelesen
python3 build_book.py                         # Satz -> build/*.pdf und build/book_p*.png
cd .. && python3 simcheck/seitenzahlen.py <heftordner>   # NICHT vergessen
python3 arbeitsheft/bruecke_alle.py           # js/heft-bruecke.js aus allen neun Heften
```
Danach die `?v=`-Nummer von `js/heft-bruecke.js` in `index.html` hochzaehlen.

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `ls_progress` | Quiz progress per exercise |
| `ls_userName` | Onboarding: student name |
| `ls_learningGoal` | `normal` / `zap` / `abitur` |
| `ls_onboardingDone` | Whether onboarding was completed |
| `ls_school_type` | Active school form |
| `ls_exercises` | AI-generated exercises (LernStarAI) |
| `ls_groq_key` | User's Groq API key |
| `ls_ai_providers` | Custom AI provider configs |

## Gymnasialreihe (G9) — seit 02.09.2026

- Kernlehrplan: Heft 3411 (2019), abgelegt in `kernlehrplan/` (PDF, Volltext,
  Auswertung). Codes **UF1–UF4, E1–E7, K1–K4, B1–B4** — anders als Realschule
  (B4 existiert nur hier); je Kompetenz zwei amtliche Formulierungen
  (Erprobungsstufe / Sek I). Anforderungsbereiche stehen NICHT im KLP.
- Fünf Bände: `arbeitsheft_gym56` `_gym7` `_gym8` `_gym9` `_gym10`
  (Infrastruktur aus `arbeitsheft_gts7` abgeleitet, `plan.py` je Band).
  Gemeinsames Lehrplanmodul: `arbeitsheft/lehrplan_gym.py`.
- Kennungen: wm sm sl li · op wa · me da · la wi ep · kp eg.
- KLASSE von gym56 ist der String "5/6" — Dateinamen ersetzen `/` durch `_`,
  Bilderordner durch `-`; `formregeln.pruefe_seite(..., klasse=5)` und
  `seiten_nachbereiten.py --klasse=5` beim 5/6-Band nicht vergessen.
- Rahmen 5/6: Lina & Aras, Forscher-AG bei Herrn Weber.
- **Figurenkanon der Gym-Bildaufträge** (verbindlich, wortgleich in Prompts):
  Lina (11): schulterlanges dunkelbraunes Haar, kleine blaue Haarspange,
  senfgelber Pullover, Jeans. Aras (11): kurze schwarze Locken, grünes
  Sweatshirt, graue Hose. Mira (13): kastanienbrauner Zopf, dunkelrote
  Strickjacke über weißem T-Shirt, Jeans. Jonas (13): glattes dunkelblondes
  Haar, blaues Kapuzensweatshirt, schwarze Jeans, KEINE Brille.
  Ela (14): dunkelbraune Haare im hohen Dutt, olivgrüne Bomberjacke über
  schwarzem Shirt, Jeans. Tom (14): kurze braune Haare, kariertes Flanellhemd
  über grauem Shirt, Cargohose.
  Sina (15): schwarze Haare in zwei Zöpfen, bordeauxroter Kapuzenpulli, dunkle
  Jeans. David (15): hellbraunes welliges Haar, olivgrünes Langarmshirt, beige
  Chinohose.
  Aylin (16): dunkelbraunes Haar zum seitlichen Zopf, senfgelber Cardigan über
  weißer Bluse, dunkelblaue Jeans. Leon (16): kurzes schwarzes Haar, marineblaues
  Poloshirt, graue Jeans.
  Bei weiteren Bänden Figuren ebenso einmal kanonisch festlegen,
  BEVOR die Bildaufträge geschrieben werden.

- **Kapitel-Trennseite (Navy):** Die Themenkästen zeigen NUR den Seitentitel,
  mittig. Die frühere graue Fachthema-Zeile darunter (`FSD[tid]["name"]` in
  DF((150,164,196))) war auf dem dunkelblauen Grund schlecht lesbar und wurde
  am 04.09.2026 auf Abdullahs Wunsch aus allen 14 `build_book.py` entfernt.
  Nicht wieder einbauen.
