---
title: Testing
last_mapped: 2026-05-30
---

# Testing

## Summary

**There are no automated tests in this project.**

No test framework, no test files, no CI/CD pipeline. All testing is manual via the browser.

## Manual Testing Approach

### Launch Methods
- `LernStar starten.bat` — opens local `index.html` in default browser
- `LernStar online teilen.bat` — opens GitHub Pages URL
- Direct: open `index.html` in browser

### What Gets Tested Manually
- School form selection and grade navigation
- Subject view (topics list, exercise filter)
- Quiz flow (questions, hints, answers, results)
- KI chat ("Herr Lala") — requires Groq API key
- TTS playback (ElevenLabs or browser Speech API)
- PWA install / offline behavior
- Quiz mini-game (timer, lives, streak)
- Prüfungsmodus (exam prep view)
- Lernanalyse view
- School form switching (Gymnasium → Realschule → Hauptschule)

## No Automated Testing

| Category | Status |
|----------|--------|
| Unit tests | ❌ None |
| Integration tests | ❌ None |
| E2E tests (Playwright/Cypress) | ❌ None |
| CI/CD pipeline | ❌ None |
| Linting (ESLint) | ❌ None |
| Type checking (TypeScript) | ❌ None |
| Visual regression | ❌ None |

## Python Backend Testing (`lernstar_ai/`)

No test files found. The Python Flask backend is tested manually by running the server and using the admin UI at `http://localhost:5000`.

## Implicit Quality Checks

1. **Cache busting versioning** — Manual version increment in `index.html` serves as a deployment checkpoint
2. **Content structure validation** — None automated; content schema is enforced by convention
3. **Browser console** — `console.log` statements throughout `app.js` for voice selection and general diagnostics

## Recommended Testing (Not Yet Implemented)

Given the PWA's structure, these would be highest value:

1. **Playwright/Cypress E2E** — Test navigation flows (home → grade → subject → quiz → result)
2. **Jest unit tests** for `LernStarAI` class (pure functions, localStorage interaction)
3. **Content schema validation script** — verify all `CONTENT` entries have required fields
4. **Lighthouse PWA audit** — verify offline support, manifest, performance scores

## Known Testing Gap: Content Database

`content.js` is ~35,000+ lines with hundreds of exercises. There is no validation that:
- Each exercise has exactly 8 questions
- `correct` indices are within 0–3 range
- `hint` fields don't give direct answers
- Chapter entries (`isChapter: true`) are present before each group
- All `_rs`, `_hs`, `_gts` variants have complete data
