---
title: Technical Concerns
last_mapped: 2026-05-30
---

# Technical Concerns

## 🔴 Critical — Security

### 1. ElevenLabs API Key Hardcoded in Source
- **File:** `app.js` line ~124
- **Code:** `const ELEVEN_KEY = 'e24b6be67594419d8f50afdfb195995a';`
- **Risk:** Key is fully exposed in public GitHub repo. Anyone can abuse the TTS quota.
- **Fix:** Move to user-supplied key (same UX as Groq key) or use a backend proxy.

### 2. Groq API Key Hardcoded in Python Server
- **File:** `lernstar_ai/server.py` line 12
- **Code:** `GROQ_KEY = "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"`
- **Risk:** Key committed to git history. Even if removed, it remains in git log.
- **Fix:** Use environment variable (`os.environ.get('GROQ_KEY')`). Rotate the key immediately.

### 3. SQLite Database Committed to Repo
- **File:** `lernstar_ai/exercises.db` (binary file in git)
- **Risk:** Database may contain user-generated content or sensitive training data.
- **Fix:** Add `exercises.db` to `.gitignore`. Initialize empty DB on first run.

## 🟠 High — Maintainability

### 4. `content.js` is a Monolithic File
- Estimated size: 35,000–50,000+ lines
- Contains all curriculum for 5 school forms × 13 grades × multiple subjects
- **Risk:** Extremely slow to edit, hard to review diffs, version control noise.
- **Fix:** Split into per-grade or per-school-form JSON files loaded on demand. The `data/` directory pattern already exists but is only used for Klasse 5 JSON files.

### 5. `app.js` is a Monolithic File (~1,400+ lines)
- Contains: state management, routing, all render functions, TTS logic, ElevenLabs integration, speech synthesis, chat logic, exam prep, analysis view, onboarding.
- **Risk:** Changes in one area can accidentally break another. Hard to navigate.
- **Fix:** Split into modules (no build tools needed — use ES modules `<script type="module">`).

### 6. Manual Cache-Busting Version Numbers
- **Pattern:** `?v=N` query strings on all script/style `<link>` and `<script>` tags
- **Risk:** Forgetting to bump a version after a change leads to stale caches for users.
- **Fix:** Automate via a build step, or use content hashes. Alternatively, use Service Worker to handle cache invalidation instead of query strings.

### 7. Service Worker Deregistered on Every Page Load
- **File:** `index.html` (inline script at bottom)
- **Code:** `navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));`
- **Impact:** The PWA effectively has no Service Worker in production. Offline support is non-functional.
- **Reason:** Likely added to avoid stale cache during development, but left in production.

## 🟡 Medium — Architecture

### 8. `lernplattform/` Duplicate Directory
- Contains a nearly identical copy of the entire app (app.js, content.js, style.css, etc.)
- **Risk:** Changes made to root files may not be reflected in `lernplattform/` and vice versa.
- **Clarify:** Is this the Flask-served version? If so, it needs to stay in sync with root. If not, it should be deleted.

### 9. No ES Modules — All Globals
- Every variable/function in every script is a global
- `CONTENT`, `state`, `SCHOOL_TYPES`, `GRADE_GRADIENTS`, `LernStarAI`, `QUIZ_BANK` are all globals
- **Risk:** Name collision risk, hard to understand scope, pollutes `window`
- **Fix:** Migrate to `<script type="module">` (no build tools needed)

### 10. Python Backend Not Integrated with PWA
- `lernstar_ai/` generates exercises server-side but the PWA uses `LernStarAI` (browser-side)
- The two AI systems are separate and don't share data
- **Risk:** Confusion about which AI system is "the real one". Duplicated effort.
- **Clarify:** Is `lernstar_ai/` actively used? If yes, document the sync mechanism. If not, mark as archived.

### 11. `data/*.json` Files Not Used by Main App
- JSON exercise files exist in `data/` directory but `app.js` reads from the monolithic `CONTENT` object
- `lernplattform/` may load these files, but the main PWA does not
- **Risk:** Maintaining two parallel content formats

## 🟢 Low — Code Quality

### 12. `console.log` Statements in Production
- `app.js` contains `console.log('[LernStar] Verfügbare Stimmen: ...')` and similar
- Not a bug, but adds noise in production devtools

### 13. No `.gitignore` for Common Files
- `exercises.db` (binary SQLite) is tracked in git
- `__pycache__/` is tracked in git (`lernstar_ai/__pycache__/`)
- **Fix:** Add proper `.gitignore` entries

### 14. `lernstar_ai/__pycache__/` Committed
- Python bytecode compiled cache tracked in git
- Should be in `.gitignore`

### 15. localStorage Has No Size Protection
- All exercises, progress, and user data stored in localStorage (typically 5–10MB limit)
- `LernStarAI.save()` adds exercises without checking storage quota
- **Risk:** `QuotaExceededError` silently fails on some browsers once limit hit
- **Fix:** Wrap `localStorage.setItem` calls in try/catch with size check

### 16. Audio Cache Has a Fixed Limit of 12 Entries
- `_audioCache` in `app.js` caps at 12 audio URLs with LRU eviction
- URLs are `URL.createObjectURL()` blobs — revoked on eviction, but `createObjectURL` accumulates until then
- Minor memory concern on long sessions
