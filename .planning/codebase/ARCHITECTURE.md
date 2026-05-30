---
title: Architecture
last_mapped: 2026-05-30
---

# Architecture

## Pattern

**Single-Page Application (SPA) — Pure Browser, No Framework**

All application logic runs in the browser. There is no server, no API routes, no build pipeline. The app is a collection of plain HTML/CSS/JS files served statically from GitHub Pages.

```
Browser
  └── index.html  (single entry point)
       ├── style.css + quiz-game.css        (all styles)
       ├── content.js                       (content database — CONTENT{})
       ├── js/ai_engine.js                  (browser-side AI — LernStarAI class)
       ├── physics-sim.js                   (interactive physics simulations)
       ├── app.js                           (all app logic — state, routing, rendering)
       └── quiz-game.js                     (standalone quiz mini-game)
```

Script load order is critical. Each script depends on globals exposed by the previous one.

## Layers

### 1. Content Layer (`content.js`)
Single giant `const CONTENT = { ... }` object (~35,000+ lines).

Each key is a grade ID: `klasse5`, `klasse5_rs` (Realschule), `klasse8_hs` (Hauptschule), `klasse10_gts` (Gesamtschule).

Structure per entry:
```js
klasseN: {
  id, num, label, emoji, color, light, tagline,
  subjects: [
    {
      id: 'mathe' | 'physik',
      name, icon, desc, color, intro,
      topics: [
        { isChapter: true, name: '📚 Kapitelname' },  // visual separator
        { name, diff: 1|2|3, explanation: '...' },
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

### 2. Application State (`app.js`)
Global `state` object holds all runtime state:
```js
const state = {
  view, gradeId, subjectId, exerciseId,
  quiz: { questions, index, score, answered },
  progress,     // persisted to localStorage as 'ls_progress'
  userName,     // from localStorage 'ls_userName'
  learningGoal, // 'normal' | 'zap' | 'abitur'
  onboardingDone,
  examMode, examDiff, examSubjectId, examSession,
  currentTopicName,
  introTimer, introInterval
};
```

### 3. Routing Layer (`app.js` — `navigate()`)
Single routing function:
```js
navigate(view, gradeId, subjectId, exerciseId)
```

Views: `home`, `grade`, `subject`, `quiz`, `result`, `examprep`, `analyse`

Each view has a corresponding `<section class="view">` in `index.html` and a `renderXxx()` function in `app.js`. Navigation shows/hides sections via `showView()`.

### 4. School Form System (`app.js`)
5 school forms defined in `SCHOOL_TYPES`: `grundschule`, `hauptschule`, `realschule`, `gymnasium`, `gesamtschule`

Content key resolution via `getGradeKey(baseId)`:
- `gesamtschule` → tries `baseId + '_gts'` → falls back to base (Gymnasium content for Kl. 11–13)
- `hauptschule` → tries `baseId + '_hs'` → tries `_rs` → falls back to base
- `realschule` → tries `baseId + '_rs'` → falls back to base
- `gymnasium` / `grundschule` → always base key

Active school type stored in `localStorage` as `ls_school_type`.

### 5. AI Engine (`js/ai_engine.js`)
`LernStarAI` static class — runs entirely in browser:
- Stores user-generated exercises in `localStorage` (`ls_exercises`)
- Tracks learning strength levels (7 tiers from "Noch kein Training" to "Experte")
- Generates multiple-choice exercises from stored patterns
- No network calls — purely local pattern matching

### 6. KI Chat ("Herr Lala") (`app.js`)
Chat widget with floating action button (FAB):
- Sends messages to configured AI provider (Groq primary, others as fallback)
- Supports image upload (vision) and microphone input
- Renders responses via Marked.js (Markdown) + KaTeX (math)
- Lip-sync animation on avatar during TTS playback

### 7. Physics Simulations (`physics-sim.js`)
Interactive SVG/Canvas simulations embedded in subject view for Physik topics.
Topics: Newton'sche Gesetze, Kreisbewegung, Federpendel, etc.

### 8. Quiz Mini-Game (`quiz-game.js`)
Standalone game launched from home banner:
- Fixed question bank (`QUIZ_BANK`) for Mathe & Physik Klasse 5–13
- Timer, lives, streak bonuses, highscore tracking (localStorage)
- Independent of `CONTENT` object

## Data Flow

```
User selects school form
  → activeSchoolType stored in localStorage
  → showGradesForSchoolForm() renders grade cards

User selects grade
  → navigate('grade', gradeId)
  → getGradeKey() resolves correct CONTENT key (with suffix)
  → renderGrade() reads CONTENT[resolvedKey]

User selects subject
  → navigate('subject', gradeId, subjectId)
  → renderSubject() renders topics + exercises from CONTENT

User starts exercise
  → navigate('quiz', gradeId, subjectId, exerciseId)
  → renderQuiz() loads questions, manages quiz state

Quiz complete
  → navigate('result')
  → progress saved to localStorage 'ls_progress'
```

## PWA / Offline

Service Worker (`sw.js`) implements Cache-First strategy:
1. On install: pre-cache 6 core assets
2. On fetch: return cache hit; on miss, fetch + cache; on error, return `index.html`
3. On activate: delete old caches (any key ≠ `lernstar-v3`)

**Note:** Service worker is actively deregistered on page load via inline script in `index.html` to prevent stale cache issues during development.

## Optional Python Backend (`lernstar_ai/`)

Separate Flask server for AI exercise training (not used in production PWA):
```
lernstar_ai/
  server.py      — Flask routes, Groq API calls
  ai_engine.py   — Exercise generation logic
  database.py    — SQLite CRUD (exercises.db)
  model_handler.py — Model inference
  trainer.py     — Training loop
  templates/index.html — Admin UI
```

Communicates with Groq API server-side. SQLite db at `lernstar_ai/exercises.db`.
Accessible at `http://localhost:5000` via `lernstar_ai/start.bat`.
