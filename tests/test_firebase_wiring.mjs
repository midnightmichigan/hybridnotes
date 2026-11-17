// Headless contract checks for web/firebase-ai.js — no network, no Firebase
// project needed: verifies the module loads, exports the hybrid contract, and
// refuses cleanly (throws firebase-config-missing) when no config is given,
// which is exactly the signal app.js uses to keep its local fallback backends.
import assert from "node:assert";
import { createFirebaseBackends, FIREBASE_AI_MODULE_INFO } from "../web/firebase-ai.js";

assert.equal(FIREBASE_AI_MODULE_INFO.inference, "hybrid");
assert.equal(FIREBASE_AI_MODULE_INFO.onDeviceMode, "PREFER_ON_DEVICE");
assert.equal(FIREBASE_AI_MODULE_INFO.cloudMode, "ONLY_CLOUD");
assert.ok(FIREBASE_AI_MODULE_INFO.sdkBase.includes("firebasejs"));

await assert.rejects(() => createFirebaseBackends(null), /firebase-config-missing/);
await assert.rejects(() => createFirebaseBackends({}), /firebase-config-missing/);
await assert.rejects(
  () => createFirebaseBackends({ apiKey: "x" }),
  /firebase-config-missing/
);

console.log("ALL TESTS PASSED (5 checks)");
