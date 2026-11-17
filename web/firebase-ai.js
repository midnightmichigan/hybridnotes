// HybridNotes — real Firebase AI Logic backends (#BuildHybridAI).
// Loaded as an ES module by index.html. When window.HYBRIDNOTES_FIREBASE_CONFIG
// is set (a public Firebase web config — not a secret), this initializes
// Firebase + App Check and returns backends backed by Firebase AI Logic in
// hybrid inference mode: on-device (Gemini Nano in Chrome) preferred for the
// on-device backend, cloud model for the cloud backend. When no config is
// present or the SDK cannot load, createFirebaseBackends() throws and app.js
// keeps its local extractive stand-ins, so the demo never hard-fails.
//
// SDK version pinned to the Firebase JS SDK 11.x CDN builds.
const SDK = "https://www.gstatic.com/firebasejs/11.3.1";

export async function createFirebaseBackends(config) {
  if (!config || !config.apiKey || !config.projectId || !config.appId) {
    throw new Error("firebase-config-missing");
  }
  const [{ initializeApp }, aiMod, appCheckMod] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-ai.js`),
    import(`${SDK}/firebase-app-check.js`),
  ]);
  const app = initializeApp(config);
  // App Check is required by the hackathon rules; debug tokens are accepted.
  if (config.appCheckDebugToken) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = config.appCheckDebugToken;
  }
  try {
    appCheckMod.initializeAppCheck(app, {
      provider: new appCheckMod.ReCaptchaV3Provider(config.recaptchaSiteKey || "debug"),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (e) {
    // App Check setup failure must not block inference; surface it for logs.
    console.warn("App Check init skipped:", e && e.name);
  }
  const { getAI, getGenerativeModel, InferenceMode } = aiMod;
  const ai = getAI(app, { backend: new aiMod.GoogleAIBackend() });

  async function run(model, prompt) {
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  const onDeviceModel = getGenerativeModel(ai, {
    model: "gemini-2.0-flash-lite",
    mode: InferenceMode.PREFER_ON_DEVICE,
  });
  const cloudModel = getGenerativeModel(ai, {
    model: "gemini-2.0-flash-lite",
    mode: InferenceMode.ONLY_CLOUD,
  });

  return {
    onDeviceBackend: (prompt) => run(onDeviceModel, prompt),
    cloudBackend: (prompt) => run(cloudModel, prompt),
    mode: "firebase-ai-logic-hybrid",
  };
}

// Node/headless contract check support (no-op in the browser).
export const FIREBASE_AI_MODULE_INFO = {
  sdkBase: SDK,
  inference: "hybrid",
  onDeviceMode: "PREFER_ON_DEVICE",
  cloudMode: "ONLY_CLOUD",
};
