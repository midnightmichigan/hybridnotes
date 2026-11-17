// HybridNotes web demo — JS mirror of src/hybrid_router.py.
// Routing policy (identical thresholds/logic to the Python core):
// short prompts try on-device first; long prompts go to cloud;
// any on-device failure or unavailability falls back to cloud.
const ON_DEVICE_MAX_CHARS = 1200;

function extractiveSummary(text) {
  const sentences = text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, 3).map((s) => "- " + s.trim()).join("\n") || "- (empty input)";
}

// Demo backends: local stand-ins. When index.html's module loader has
// installed real Firebase AI Logic backends on window.__hybridBackends
// (web/firebase-ai.js), those are used instead — same router, real models.
async function onDeviceBackend(prompt) {
  if (typeof window !== "undefined" && window.__hybridBackends) return window.__hybridBackends.onDeviceBackend(prompt);
  return extractiveSummary(prompt);
}
async function cloudBackend(prompt) {
  if (typeof window !== "undefined" && window.__hybridBackends) return window.__hybridBackends.cloudBackend(prompt);
  return extractiveSummary(prompt);
}

async function routePrompt(prompt, onDeviceAvailable = true) {
  const attempts = [];
  if (!onDeviceAvailable) {
    attempts.push("on-device:skipped-unavailable");
  } else if (prompt.length > ON_DEVICE_MAX_CHARS) {
    attempts.push("on-device:skipped-too-long");
  } else {
    try {
      const text = await onDeviceBackend(prompt);
      attempts.push("on-device:ok");
      return { text, route: "on-device", reason: "short prompt served on-device", attempts };
    } catch (e) {
      attempts.push("on-device:failed:" + e.name);
    }
  }
  const text = await cloudBackend(prompt);
  attempts.push("cloud:ok");
  return { text, route: "cloud", reason: "cloud fallback after on-device unavailable/too-long/failed", attempts };
}

if (typeof document !== "undefined") document.getElementById("go").addEventListener("click", async () => {
  const input = document.getElementById("input").value;
  const prompt = "Summarize the following in at most three short bullet points, keeping names, dates and numbers exact:\n\n" + input;
  const result = await routePrompt(prompt);
  document.getElementById("route").textContent =
    "Route: " + result.route + " (" + result.reason + ") [" + result.attempts.join(", ") + "]";
  document.getElementById("out").textContent = result.text;
});

// Exported for a future headless check; harmless in the browser.
if (typeof module !== "undefined") module.exports = { routePrompt, ON_DEVICE_MAX_CHARS };
