---
title: Code Conventions
last_mapped: 2026-05-30
---

# Code Conventions

## Language & Style

**Vanilla JavaScript, ES6+ — no framework, no TypeScript, no linting config.**

- `const` / `let` — no `var`
- Arrow functions for callbacks and helpers
- Template literals for HTML generation
- Destructuring where natural (`const { view, gradeId } = state`)
- No semicolons are NOT enforced — semicolons ARE present throughout

## Global State Pattern

All runtime state lives in a single `const state = { ... }` object in `app.js`.
Direct mutation is the norm: `state.view = 'grade'`, `state.gradeId = id`.
No Redux, no reactive framework.

```js
// Pattern: mutate state then call navigate/render
state.gradeId = id;
navigate('grade', id);
```

## Rendering Pattern

Views are pre-rendered as `<section class="view hidden">` in `index.html`.
JavaScript shows/hides them via `showView(id)` and populates with `innerHTML`.

```js
// Typical render function
function renderGrade() {
  showView('viewGrade');
  const grade = CONTENT[state.gradeId];
  const hero = document.getElementById('gradeHeroArea');
  hero.innerHTML = `<h1>${grade.emoji} ${grade.label}</h1>`;
  // ... more innerHTML manipulation
}
```

## Content Data Pattern

Content is a large static JS object, not JSON files (except for `data/*.json`).
Content entries use consistent shape with `isChapter` sentinel objects mixed into `topics` arrays:

```js
topics: [
  { isChapter: true, name: '📚 Kapitelname' },  // chapter separator — no diff/explanation
  { name: 'Thema', diff: 1, explanation: '...' },
]
```

Filtering: `topics.filter(t => !t.isChapter)` to get real topics.

## Naming

| Pattern | Convention |
|---------|-----------|
| Functions | `camelCase` — `renderSubject()`, `getGradeKey()` |
| Private helpers | `_camelCase` — `_pickMaleVoice()`, `_mathToSpoken()` |
| Onboarding functions | `ob` prefix — `obSetName()`, `obSetGoal()` |
| Constants | `UPPER_SNAKE_CASE` — `SCHOOL_TYPES`, `GRADE_GRADIENTS`, `ELEVEN_KEY` |
| State properties | `camelCase` — `state.gradeId`, `state.learningGoal` |
| DOM IDs | `camelCase` — `viewHome`, `gradeHeroArea`, `chatMessages` |
| CSS classes | `kebab-case` — `.sf-card`, `.quiz-container`, `.chat-bubble-bot` |
| Content keys | `klasseN` + optional suffix — `klasse5`, `klasse7_rs`, `klasse9_hs` |
| localStorage keys | `ls_` prefix — `ls_progress`, `ls_groq_key` |

## CSS Conventions

- CSS custom properties for theming: `--sc` (subject color), grade-specific vars via `data-grade`
- BEM-like naming without strict enforcement: `.chat-panel`, `.chat-panel-header`, `.chat-panel-close`
- Utility suffixes: `.hidden` (display:none), `.active` (active state)
- Emoji in class names for school form types: `.sf-card-gs`, `.sf-card-hs`, `.sf-card-gym`

## Comment Style

Section headers use `=== ... ===` style:
```js
/* ============================================================
   SECTION NAME
   ============================================================ */
```

Subsections use `──` dashes:
```js
// ── SUBSECTION ────────────────────────────────────────────
```

Inline comments are descriptive but sparse. German comments appear in content-related code.

## Error Handling

Minimal defensive coding — mostly `try/catch` around localStorage operations:
```js
static getAll() {
  try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); }
  catch { return []; }
}
```

API failures fall through to `console.warn()` with graceful degradation (ElevenLabs → Web Speech API).
No global error boundary. No user-facing error messages for most failures.

## Async Patterns

- `async/await` for API calls (ElevenLabs, Groq chat)
- `.then().catch()` chaining for audio playback
- `Promise.all` not used — requests are sequential within chat
- No loading state management beyond button text changes (`btn.textContent = '⏳ Lade…'`)

## Class Usage

Only `LernStarAI` in `js/ai_engine.js` uses class syntax (static methods only — no instances used externally):
```js
class LernStarAI {
  static KEY = 'ls_exercises';
  static getAll() { ... }
  static save(ex) { ... }
  static generateMC(subject, grade, topic, difficulty) { ... }
}
```

Everything else in `app.js` and `quiz-game.js` is procedural/functional.

## HTML Generation

All dynamic HTML is generated via template literals and `innerHTML` assignment.
No DOM-diff, no virtual DOM. Each `render*()` call rebuilds its section from scratch.

```js
card.innerHTML = `
  <div class="subject-icon">${sub.icon}</div>
  <div class="subject-name">${sub.name}</div>
  <div class="subject-desc">${sub.desc}</div>`;
```

**XSS risk:** User-input is limited (only `ls_userName` and chat input). Chat input goes to AI API, not injected into DOM directly. Exercise content comes from static `CONTENT` object.
