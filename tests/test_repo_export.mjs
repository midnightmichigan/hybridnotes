// Repo-export preflight: the staged public-repo tree must be complete,
// clean (no caches, no real secrets), and parseable — so the parent/browser
// push step is a pure upload with nothing left to fix.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const exp = join(root, 'repo-export');
let fails = 0;
const ok = (cond, label) => {
  console.log(`${cond ? 'ok' : 'FAIL'} - ${label}`);
  if (!cond) fails++;
};

const required = [
  'README.md', 'LICENSE',
  'src/hybrid_router.py',
  'web/index.html', 'web/app.js', 'web/firebase-ai.js',
  'hosted/index.html', 'hosted/app.js', 'hosted/firebase-ai.js',
  'hosted/firebase-config.example.js',
  'tests/test_flow.py',
];
for (const f of required) ok(existsSync(join(exp, f)), `export has ${f}`);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const files = walk(exp);
ok(!files.some((f) => f.includes('__pycache__') || f.endsWith('.pyc')), 'export has no __pycache__/.pyc');
ok(readFileSync(join(exp, 'LICENSE'), 'utf8').includes('MIT'), 'export LICENSE is MIT');

const secretHit = files.some((f) => {
  const t = readFileSync(f, 'utf8');
  return /apiKey\s*:\s*["'][A-Za-z0-9_-]{20,}["']/.test(t) && !t.includes('YOUR_');
});
ok(!secretHit, 'export carries no real apiKey');

for (const f of files.filter((f) => extname(f) === '.js' || extname(f) === '.mjs')) {
  try { execFileSync('node', ['--check', f]); ok(true, `parses: ${f.slice(exp.length + 1)}`); }
  catch { ok(false, `parses: ${f.slice(exp.length + 1)}`); }
}

console.log(fails === 0 ? `\nALL TESTS PASSED (repo export, ${files.length} files)` : `\n${fails} FAILED`);
process.exit(fails ? 1 : 0);
