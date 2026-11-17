# Devpost submission draft — #BuildHybridAI / HybridNotes
Deadline: Mon Nov 30, 2026, 2:00 PM PT — internal target Sat Nov 28. Pool: $30,000.
Status: paste-ready copy; links are parent/browser account steps (public repo, hosted demo, Firebase config, demo video).

## Project name
HybridNotes

## Tagline
Short notes summarized on-device, long documents in the cloud — one app, automatic hybrid routing with Firebase AI Logic.

## What it does
HybridNotes takes a note or document and summarizes it with the right model for its size:
- Short notes stay on-device (PREFER_ON_DEVICE) — fast, private, works offline.
- Long documents route to the cloud model (ONLY_CLOUD) for higher-quality summaries.
- If the preferred backend is unavailable, routing falls back automatically to the other backend, then to a local extractive summary, so the user always gets a result.

## How we built it
- Routing core in Python (src/hybrid_router.py) with a tested JS mirror for the web demo (web/app.js).
- Real Firebase AI Logic wiring (web/firebase-ai.js): initializes Firebase + App Check, builds an on-device-preferring model and a cloud-only model; with no Firebase config present it throws firebase-config-missing and the demo transparently falls back to local backends — the same code path a hosted copy uses once window.HYBRIDNOTES_FIREBASE_CONFIG is set.
- Tests: router 6/6 PASS; Firebase wiring contract tests 5/5 PASS.

## Firebase AI Logic use (required Devpost field)
Hybrid inference via Firebase AI Logic: on-device model for short inputs, cloud model for long inputs, App Check initialized before model calls. See web/firebase-ai.js.

## Links (fill at submission)
- Public repo: TBD (parent/browser step)
- Hosted demo: TBD (parent/browser step)
- Demo video (screen-recorded, ≤3 min, nobody on camera): TBD
