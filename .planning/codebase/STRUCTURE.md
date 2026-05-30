---
title: Directory Structure
last_mapped: 2026-05-30
---

# Directory Structure

## Root Directory (`C:\Users\helin\Desktop\mdcg\`)

```
mdcg/
├── index.html              # Single entry point — all views, modals, chat widget
├── app.js                  # All application logic (~1400+ lines)
├── content.js              # Content database — CONTENT{} object (~35,000+ lines)
├── style.css               # All PWA styles
├── quiz-game.js            # Standalone quiz mini-game
├── quiz-game.css           # Quiz game styles
├── physics-sim.js          # Interactive physics simulations
├── sw.js                   # Service Worker (Cache-First, offline support)
├── manifest.json           # PWA manifest
├── icon.svg                # App icon (SVG)
├── avatar.png              # "Herr Lala" avatar image for video section
├── admin.html              # Admin panel (separate from main PWA)
├── setup.html              # Setup/configuration page
├── CLAUDE.md               # Claude Code project instructions
│
├── js/
│   └── ai_engine.js        # Browser-side AI engine (LernStarAI class)
│
├── data/                   # JSON exercise files (loaded separately)
│   ├── mathe5_zaehlen_darstellen.json
│   ├── mathe5_zahlen_ordnen.json
│   ├── mathe5_grosse_zahlen_runden.json
│   ├── mathe5_grundrechenarten.json
│   ├── mathe5_rechnen_mit_geld.json
│   ├── mathe5_laengenangaben.json
│   ├── mathe5_gewichtsangaben.json
│   ├── mathe5_zeitangaben.json
│   ├── mathe5_symmetrie.json
│   ├── mathe5_rechnen.json
│   ├── mathe5_flaechen.json
│   └── mathe5_koerper.json
│
├── lernstar_ai/            # Optional Python Flask backend (local training tool)
│   ├── server.py           # Flask app with routes + Groq API calls
│   ├── ai_engine.py        # Exercise generation AI
│   ├── database.py         # SQLite CRUD layer
│   ├── model_handler.py    # Model inference handler
│   ├── trainer.py          # Training loop
│   ├── exercises.db        # SQLite database (binary, committed to repo)
│   ├── requirements.txt    # Python dependencies
│   ├── start.bat           # Launch Flask server (Windows)
│   ├── install.bat         # Install dependencies (Windows)
│   └── templates/
│       └── index.html      # Admin UI template (Jinja2)
│
├── lernplattform/          # ⚠️ Older/alternative version of the app
│   ├── index.html
│   ├── app.js
│   ├── content.js
│   ├── style.css
│   ├── sw.js
│   ├── manifest.json
│   ├── admin.html
│   ├── avatar.json
│   ├── icon.svg
│   ├── js/
│   │   ├── app.js
│   │   ├── ai_engine.js
│   │   └── content.js
│   ├── css/
│   │   └── style.css
│   └── data/               # Same exercise JSON files as root data/
│
├── .planning/              # GSD planning directory
│   └── codebase/           # This codebase map
│
├── .claude/
│   └── settings.local.json # Claude Code local settings
│
├── GitHub                  # (file, not directory — possibly a notes file)
├── GITHUB_LOGIN.bat        # GitHub authentication helper
├── PUSH_TO_GITHUB.bat      # Git push automation
├── LernStar starten.bat    # Opens local index.html in browser
└── LernStar online teilen.bat  # Opens GitHub Pages URL
```

## Key File Locations

| What | Where |
|------|-------|
| App entry point | `index.html` |
| All app logic | `app.js` |
| All content/curriculum | `content.js` |
| Global state | `app.js` — `const state = { ... }` (line ~6) |
| School form definitions | `app.js` — `SCHOOL_TYPES` (line ~379) |
| Grade gradients | `app.js` — `GRADE_GRADIENTS` (line ~341) |
| Grade key resolution | `app.js` — `getGradeKey()` (line ~458) |
| Navigation router | `app.js` — `navigate()` (line ~1195) |
| AI class | `js/ai_engine.js` — `class LernStarAI` (static methods) |
| ElevenLabs key | `app.js` — `const ELEVEN_KEY = '...'` (line ~124) |
| Service worker | `sw.js` |
| Quiz game questions | `quiz-game.js` — `const QUIZ_BANK = { ... }` |
| Python server routes | `lernstar_ai/server.py` |
| Python AI engine | `lernstar_ai/ai_engine.py` |

## Naming Conventions

### Content Keys
```
klasse{N}           — Gymnasium/Grundschule base (e.g. klasse5, klasse10)
klasse{N}_rs        — Realschule variant (klasse5_rs through klasse10_rs)
klasse{N}_hs        — Hauptschule variant (klasse5_hs through klasse9_hs)
klasse{N}_gts       — Gesamtschule variant (klasse5_gts through klasse10_gts)
```

### CSS Custom Properties
```css
data-grade="5"      /* set on <body> — drives CSS gradient variables */
--sc                /* subject card color, set per card */
```

### localStorage Keys
All prefixed with `ls_`: `ls_progress`, `ls_userName`, `ls_school_type`, `ls_exercises`, etc.

### Function Naming in `app.js`
- `render*()` — builds and injects HTML for a view
- `navigate()` — single routing function
- `showView()` — shows/hides `<section class="view">` elements
- `_private*()` — underscore prefix for internal helpers (e.g. `_pickMaleVoice`, `_mathToSpoken`)
- `ob*()` — onboarding functions (e.g. `obSetName`, `obSetGoal`)

## Duplicate Code Warning

`lernplattform/` contains an older or parallel version of the app with its own `app.js`, `content.js`, `js/ai_engine.js`, `css/style.css`, `data/`. The root directory contains the active production version. The `lernplattform/` directory appears to be served by the Python Flask backend as a separate route (`/lernstar`).
