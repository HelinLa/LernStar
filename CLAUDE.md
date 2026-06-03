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
<script src="content.js?v=37"></script>
<script src="js/ai_engine.js?v=1"></script>
<script src="physics-sim.js?v=2"></script>
<script src="app.js?v=84"></script>
<script src="quiz-game.js?v=1"></script>
```

## Architecture

All logic runs in the browser. Script load order in `index.html` is critical (each depends on the previous):

```
content.js → js/ai_engine.js → physics-sim.js → app.js → quiz-game.js
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
