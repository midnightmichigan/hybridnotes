// Submission-package preflight for #BuildHybridAI / HybridNotes.
// Verifies every artifact the Devpost submission needs is present and
// internally consistent, so the parent/browser submit step is paste-only.
// Run: node tests/test_submission_package.mjs
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const check = (name, ok) => { ok ? pass++ : fail++; console.log(`${ok ? "ok" : "FAIL"} - ${name}`); };

// Required artifacts exist and are non-trivial
for (const f of ["README.md", "LICENSE", "DEVPOST-DRAFT.md", "DEMO-SCRIPT.md",
                 "SUBMISSION-CHECKLIST.md", "hosted/index.html", "hosted/app.js",
                 "hosted/firebase-ai.js", "hosted/firebase-config.example.js"]) {
  check(`${f} present`, existsSync(join(root, f)) && statSync(join(root, f)).size > 0);
}

// Devpost draft carries the fields the form asks for
const draft = readFileSync(join(root, "DEVPOST-DRAFT.md"), "utf8");
for (const field of ["HybridNotes", "Firebase AI Logic", "What it does", "How we built it"]) {
  check(`DEVPOST-DRAFT mentions "${field}"`, draft.includes(field));
}

// Demo script stays inside the video-free gate: screen-recorded, nobody on camera
const demo = readFileSync(join(root, "DEMO-SCRIPT.md"), "utf8").toLowerCase();
check("DEMO-SCRIPT is screen-recorded", demo.includes("screen"));
check("DEMO-SCRIPT keeps nobody on camera", demo.includes("nobody on camera") || demo.includes("no one on camera") || demo.includes("not on camera"));

// Example Firebase config must never carry a real-looking API key
const cfg = readFileSync(join(root, "hosted/firebase-config.example.js"), "utf8");
check("example config has no real apiKey", !/AIza[0-9A-Za-z_-]{20,}/.test(cfg));

// Checklist deadline matches the verified Devpost deadline
const checklist = readFileSync(join(root, "SUBMISSION-CHECKLIST.md"), "utf8");
check("checklist states Nov 30, 2026 deadline", checklist.includes("Nov 30, 2026"));

console.log(fail === 0 ? `ALL TESTS PASSED (submission package, ${pass} checks)` : `${fail} FAILED`);
process.exit(fail === 0 ? 0 : 1);
