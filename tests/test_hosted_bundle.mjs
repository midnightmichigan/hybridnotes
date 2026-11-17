// Hosted-bundle smoke checks — verifies the deploy-ready hosted/ copy is
// self-consistent: all referenced files exist, the config script tag is
// present (commented until a real config lands), the example config parses
// as a placeholder, and both JS files load without a Firebase config.
import assert from "node:assert";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const hosted = join(root, "hosted");

for (const f of ["index.html", "app.js", "firebase-ai.js", "firebase-config.example.js"]) {
  assert.ok(existsSync(join(hosted, f)), `hosted/${f} missing`);
}
const html = readFileSync(join(hosted, "index.html"), "utf8");
assert.ok(html.includes('src="app.js"'), "index.html must load app.js");
assert.ok(html.includes("firebase-config.js"), "index.html must reference firebase-config.js");
assert.ok(html.includes("HYBRIDNOTES_FIREBASE_CONFIG"), "index.html must check the config global");
assert.ok(html.includes("createFirebaseBackends"), "index.html must wire Firebase backends");

const example = readFileSync(join(hosted, "firebase-config.example.js"), "utf8");
assert.ok(example.includes("REPLACE_ME"), "example config must stay a placeholder");
assert.ok(!/apiKey:\s*"AIza/.test(example), "example config must not contain a real apiKey");

execFileSync(process.execPath, ["--check", join(hosted, "app.js")]);
execFileSync(process.execPath, ["--check", join(hosted, "firebase-ai.js")]);

console.log("ALL TESTS PASSED (hosted bundle, 8 checks)");
