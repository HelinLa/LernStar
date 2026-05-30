---
title: Tech Stack
last_mapped: 2026-05-30
---

# Tech Stack

## Languages & Runtime

| Language | Version | Role |
|----------|---------|------|
| HTML5 | — | Single entry point (`index.html`) |
| CSS3 | — | All styling (`style.css`, `quiz-game.css`) |
| JavaScript (ES6+) | — | All app logic — no transpilation, runs directly in browser |
| Python 3 | 3.x | Optional Flask backend (`lernstar_ai/`) — separate, not part of PWA |

**Execution environment:** Browser-only PWA. No Node.js, no build step, no bundler.

## Deployment

- **Host:** GitHub Pages — serves `main` branch automatically
- **Deploy method:** `git push` (via `PUSH_TO_GITHUB.bat` or directly)
- **Local run:** Open `index.html` in browser or use `LernStar starten.bat`

## Progressive Web App (PWA)

| File | Purpose |
|------|---------|
| `manifest.json` | PWA metadata (name, icons, display mode, theme color #7C3AED) |
| `sw.js` | Service Worker — Cache-First strategy, offline support |
| `icon.svg` | App icon (SVG, both `any` and `maskable` purpose) |

**Service Worker cache name:** `lernstar-v3` (hardcoded — bump manually on breaking changes)

**Core assets cached on install:** `index.html`, `style.css`, `app.js`, `content.js`, `manifest.json`, `icon.svg`

## Script Load Order (critical — each depends on previous)

```
content.js → js/ai_engine.js → physics-sim.js → app.js → quiz-game.js
```

All loaded via `<script>` tags in `index.html` with `?v=N` cache-busting query strings.

## Cache Busting (manual — must increment after every file change)

```html
<link rel="stylesheet" href="style.css?v=39" />
<link rel="stylesheet" href="quiz-game.css?v=1" />
<script src="content.js?v=37"></script>
<script src="js/ai_engine.js?v=1"></script>
<script src="physics-sim.js?v=2"></script>
<script src="app.js?v=84"></script>
<script src="quiz-game.js?v=1"></script>
```

## Frontend Dependencies (CDN only — no npm, no package.json)

| Library | Version | Purpose |
|---------|---------|---------|
| KaTeX | 0.16.9 | Math rendering (LaTeX → HTML) via `cdn.jsdelivr.net` |
| Marked.js | 9.x | Markdown → HTML conversion in AI chat |
| Google Fonts | — | Nunito (body) + Poppins (headings) |

Zero build dependencies in the PWA.

## Python Backend (`lernstar_ai/`) — Separate Optional Component

| Package | Purpose |
|---------|---------|
| Flask | HTTP server + Jinja2 templates |
| SQLite (stdlib) | Exercise database (`exercises.db`) |
| urllib.request | Groq API calls (no external HTTP lib) |

Launched via `lernstar_ai/start.bat` at `http://localhost:5000`.
Not connected to the main PWA in production — local development/training tool only.

## Browser APIs Used

| API | Usage |
|-----|-------|
| `speechSynthesis` (Web Speech API) | TTS for "Herr Lala" voice narration, topic explanations |
| `localStorage` | All persistence: progress, name, goal, school type, exercises, API keys |
| Service Worker + Cache API | Offline caching (Cache-First) |
| `new Audio()` | ElevenLabs TTS audio playback |
| SpeechRecognition | Microphone input in chat widget |
| SVG / inline HTML | Physics simulations, topic illustrations |

## Fonts

- **Nunito** (400–900) — body and UI text
- **Poppins** (400–800) — hero headings

Both from Google Fonts CDN with `preconnect` hints for performance.
