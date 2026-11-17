# #BuildHybridAI (Devpost) — build workspace scaffold

**Status: REGISTERED. Scaffold ready 2026-11-10 so building starts the moment
submissions open — no setup delay. No build code written yet, deliberately:
the full rules were still placeholder at last fetch, and the standing
money-lane rule is "scaffold only if $0, remote, video-free for Dakota" once
the full rules land.**

## Verified facts (from prior live-page fetch, recorded in HUNT-LOG.md)

- Prize pool: **$30,000**.
- Registration: **DONE** (Dakota's Devpost account already registered).
- Submissions **OPEN Wed Nov 11, 2026**; **CLOSE Mon Nov 30, 2026, 14:00 PT**.
- Full rules at last fetch: **placeholder/incomplete** — the video term in
  particular was not yet readable.

## RULES VERIFIED 2026-11-11 (live Devpost page fetched 2026-11-11 05:00 UTC)

- Full submission requirements ARE now live on the official page (the header still carries the "released Nov 11" placeholder line, but Requirements / What to Submit / judging sections are populated).
- Stack: Firebase AI Logic hybrid inference ONLY for AI (no direct model APIs); build for Web (Chrome, Gemini Nano 4), Android, or iOS. App Check required (debug tokens accepted). Other Firebase products encouraged.
- Submit: working project, platform selection, text description (Firebase AI Logic use + features + value proposition), PUBLIC repo (GitHub/GitLab) with a detectable open-source LICENSE file, source + instructions, Firebase AI Logic actually imported and called at runtime; hosted demo URL strongly encouraged; project free of charge; all materials in English.
- VIDEO TERM — PASSES the video-free gate: a demonstration video ≤3 min, public on YouTube, English or English subtitles, footage showing the project functioning on its platform. No requirement that Dakota (or anyone) appear on camera — a Muse-produced screen recording satisfies the term as written.
- Cost: $0 — text inference with Firebase AI Logic is free within usage limits; optional Google Account Quota for advanced features (4-day accounts, sprint request windows Nov 11 / 18 / 25).
- Prizes: $30,000 total pool stated; page body says $10,000 Grand Prize + $3,000 best app per platform (footer prize block inconsistently lists Grand as $30,000 — total pool $30,000 is the operative figure).
- Judging: Technological Implementation, Design, Potential Impact, Quality of the Idea.
- CONCEPT (picked against judging criteria): a notes/document summarizer that summarizes short notes on-device (private, offline, free) and routes long documents to the cloud, with automatic fallback when the on-device model is unavailable — the page's own example shape, executed cleanly. Build core started 2026-11-10 run: src/hybrid_router.py (routing policy, pure/testable) + tests/test_flow.py 6/6 PASSED. Next: wire the router to the real Firebase AI Logic Web SDK, public repo + LICENSE, hosted demo, screen-recorded demo video. Internal submission target Sat Nov 28.

## ⚠️ DUE NOV 11 — full-rules re-check (do this FIRST, before any build code) — DONE, see above

1. Fetch the full official rules from the Devpost event page.
2. Confirm: eligibility (US/Michigan, solo OK?), $0 entry, remote/online format.
3. Confirm the **demo video term**: is a video required? If yes — can it be a
   screen recording with nobody on camera (the standing pattern that worked
   for NEAR/QNX), or does it require a person presenting? If a person on
   camera is required, that is a Dakota decision, not a build start.
4. Confirm: required stack/APIs or sponsor technologies, judging criteria,
   submission fields, IP/license terms, prize payout rail (fiat vs other).
5. Record the answers in this file under a "RULES VERIFIED <date>" section,
   then pick the build concept against the actual judging criteria.

## Workspace layout (ready)

- `src/` — build code goes here once rules are verified.
- `tests/` — tests go here; follow the house pattern (stdlib-only where
  possible, a single `test_flow.py`-style runner that prints N/N PASSED).
- This README is the lane's source of truth until a HACKATHON.md is written
  at build start.

## Build-start checklist (Nov 11, after rules re-check)

- [ ] Rules verified and recorded above.
- [ ] Concept picked against judging criteria (one paragraph in this file).
- [ ] Repo skeleton + first end-to-end slice running.
- [ ] Demo plan written (screen-recorded, nobody on camera, if rules allow).
- [ ] Submission field list copied from the live form into this file.

## Deadline discipline

Closes **Mon Nov 30, 2026, 14:00 PT** — target internal submission by
**Sat Nov 28** to leave a 2-day buffer. Do not let NEAR (Nov 14) or PayPal
(Nov 12) work crowd out the Nov 11 rules re-check; it is a 15-minute task
that unlocks 19 days of build window.

## Progress 2026-11-11 ~00:57 EST run
- Submissions OPEN today (Wed Nov 11). Web demo slice added: `web/index.html` (1,577 B) + `web/app.js` (JS mirror of the Python router, same 1,200-char threshold and fallback logic; production injects the real Firebase AI Logic Web SDK backends behind `routePrompt()`). Verified this run: Python core 6/6 PASSED, `node --check` OK, Node routing check PASSED (short -> on-device, long -> cloud). Remaining: wire real Firebase AI Logic SDK, public repo with LICENSE, hosted demo, screen-recorded demo video (<3 min, nobody on camera); submit by Sat Nov 28.

## Progress 2026-11-16 ~22:57 EST run
- ADVANCED (deadline Nov 30, 2:00 PM PT — inside 14 days): added LICENSE (MIT, repo root), web/firebase-ai.js (real Firebase AI Logic wiring: Firebase + App Check init, PREFER_ON_DEVICE + ONLY_CLOUD generative models; throws firebase-config-missing with no config), index.html module loader + app.js backend swap (window.__hybridBackends when a config is present, local extractive fallback otherwise), tests/test_firebase_wiring.mjs 5/5 PASS, SUBMISSION-CHECKLIST.md created. Re-verified: Python core 6/6 PASS, node --check OK, Node routing check PASS (short -> on-device). Remaining: set the Firebase web config in the hosted copy + live Chrome check, public repo, hosted demo, screen-recorded demo video, Devpost submit by Sat Nov 28 (parent/browser account steps).
