# ZenStudy: Student Mental Wellness Tracker

ZenStudy is a privacy-first mental wellness tracker for students preparing for JEE, NEET, UPSC, board exams, and other high-pressure academic milestones. It helps students log moods, identify stress triggers, write CBT-style reflections, review personalized insights, and use quick calming tools such as box breathing, sensory grounding, and a Pomodoro study timer.

Live deployment: https://ankita-crypto.github.io/Ai_challenges/

## Challenge Alignment

- Mood tracking: daily check-ins capture mood, wellness rating, and timestamp.
- Stress trigger tracking: students tag academic and personal stressors such as backlog, mock scores, family expectations, peer comparison, sleep loss, and exam pressure.
- Reflection journal: guided CBT prompts help students reframe automatic negative thoughts.
- Wellness recommendations: exam-specific tips recommend practical coping actions.
- Personalized insights: analytics summarize mood trend, average wellness index, top stress trigger, total records, streak, and completed focus sessions.
- Immediate support tools: CalmBot, box breathing, 5-4-3-2-1 grounding, and study timer directly target exam anxiety and burnout.

## Architecture

```text
src/
  components/        React UI views and reusable wellness tools
  config/            Public Vite environment configuration
  hooks/             Hardened localStorage persistence hook
  types/             Shared domain models for mood, triggers, tabs, tools
  utils/             CBT flow, wellness data, tips, validation, sanitization
  __tests__/         Unit and integration tests
```

Key design choices:

- Static React + Vite deployment for fast loading and low operational risk.
- No backend and no third-party tracking; personal wellness data remains on the user's device.
- Shared TypeScript domain models replace loosely typed `any` state.
- Centralized validation makes mood logs, triggers, exam choices, theme, and counters consistent across the app.
- Error boundary prevents implementation details from leaking to users after runtime failures.

## Security Decisions

ZenStudy is designed around OWASP-style defensive defaults for a client-side app:

- No hardcoded secrets, API keys, tokens, credentials, or remote API calls.
- Public runtime config is limited to `VITE_` variables in `.env.example`.
- User inputs are length-bounded, normalized, validated, and sanitized before persistence.
- Journal and chat text are HTML-escaped before being stored or rendered from history.
- React rendering is used instead of `dangerouslySetInnerHTML`.
- No `eval`, dynamic function construction, or unsafe HTML injection patterns.
- localStorage keys are allowlisted with a strict `zenstudy_` prefix.
- localStorage values are schema-sanitized on read and write.
- Persisted mood logs are capped to avoid storage abuse.
- Malformed localStorage JSON is discarded safely.
- Error handling redacts raw exception details from UI output.
- CSP meta policy restricts scripts, images, forms, frames, objects, and network connections.

Recommended production headers for a hosted version with header control:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Setup

```bash
npm install
npm run dev
```

Optional public environment values:

```bash
cp .env.example .env.local
```

## Quality Checks

```bash
npm test
npm run build
npm run lint
```

Current test coverage focus:

- CBT state machine transitions and wellness tool actions.
- Main navigation and critical user flows.
- Secure localStorage behavior, including malformed data and storage budgets.
- Input sanitization and validation for XSS-like payloads, invalid moods, invalid triggers, and unsafe preferences.

## Deployment

The app is built as a static Vite site and deployed to GitHub Pages from the `gh-pages` branch. The Vite base path is configured as `/Ai_challenges/` so generated assets load correctly from the repository Pages URL.
