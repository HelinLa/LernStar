---
title: External Integrations
last_mapped: 2026-05-30
---

# External Integrations

## AI / Chat APIs

### Groq API (Primary KI Chat)
- **URL:** `https://api.groq.com/openai/v1/chat/completions`
- **Auth:** User-supplied API key stored in `localStorage` as `ls_groq_key`
- **UI:** User enters key via 🔑 button in chat panel or KI-Anbieter settings modal
- **Fallback:** Automatic failover to next configured provider if Groq fails
- **Backend:** Also hardcoded in `lernstar_ai/server.py` as `GROQ_KEY` constant (⚠️ security concern)

### OpenAI-Compatible APIs (User-Configurable)
- Any OpenAI-compatible endpoint can be added via the "KI-Anbieter" settings modal
- Stored in `localStorage` as `ls_ai_providers` (JSON array)
- Supports custom name, URL, API key, model name
- Providers are tried in order; failover is automatic

### Ollama (Local LLM)
- Configurable endpoint (default: `http://localhost:11434/v1/chat/completions`)
- No API key required
- Added via the "Ollama hinzufügen" section in KI settings

## Text-to-Speech

### ElevenLabs TTS
- **API URL:** `https://api.elevenlabs.io/v1/text-to-speech/{voiceId}`
- **Voice:** `Fghah4fztZORbiKfIGAs` (Thomas – Deutsch, Narration)
- **Model:** `eleven_multilingual_v2`
- **Auth:** Key `ELEVEN_KEY` hardcoded as constant in `app.js` line ~124 (⚠️ exposed in source)
- **Fallback:** Browser Web Speech API (`speechSynthesis`) used when ElevenLabs fails
- **Cache:** In-memory `Map` caches up to 12 audio URLs per session

### Web Speech API (Browser Built-in)
- Used as fallback when ElevenLabs is unavailable
- Voice selection prefers German male neural/online voices
- Priority: Natural → Neural → Online → Microsoft → Google → any German voice

## CDN Dependencies

### KaTeX (Math Rendering)
- **URL:** `https://cdn.jsdelivr.net/npm/katex@0.16.9/`
- **Purpose:** Renders LaTeX math expressions in chat responses
- **Loading:** Deferred with `onload` callback (`window._katexReady = true`)

### Marked.js (Markdown)
- **URL:** `https://cdn.jsdelivr.net/npm/marked@9/marked.min.js`
- **Purpose:** Parses Markdown in AI chat responses

### Google Fonts
- **URL:** `https://fonts.googleapis.com` + `https://fonts.gstatic.com`
- **Fonts:** Nunito (400–900), Poppins (400–800)
- **Loading:** Standard `<link>` with `preconnect` hints

## Python Backend Integrations (`lernstar_ai/`)

### Groq API (Backend)
- Used in `server.py` for server-side AI exercise generation
- Key hardcoded: `GROQ_KEY = "gsk_..."` (⚠️ committed to repo)
- Calls `https://api.groq.com/openai/v1/chat/completions`

## localStorage Keys (Persistence Layer)

| Key | Type | Purpose |
|-----|------|---------|
| `ls_progress` | JSON object | Quiz progress per exercise ID |
| `ls_userName` | string | Student name from onboarding |
| `ls_learningGoal` | string | `normal` / `zap` / `abitur` |
| `ls_onboardingDone` | `"1"` | Whether onboarding was completed |
| `ls_school_type` | string | Active school form (`grundschule`, `gymnasium`, etc.) |
| `ls_exercises` | JSON array | AI-generated exercises (LernStarAI browser engine) |
| `ls_groq_key` | string | User's Groq API key |
| `ls_ai_providers` | JSON array | Custom AI provider configurations |

## GitHub Pages

- **Source:** `main` branch, root directory
- **Deployment:** Automatic on push — no CI/CD pipeline
- **URL:** Configured via GitHub repository settings
