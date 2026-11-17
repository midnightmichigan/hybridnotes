// Copy to firebase-config.js in THIS hosted folder and fill in the PUBLIC
// Firebase web config for the project's own Firebase project (these values
// are not secrets — Firebase web config is designed to ship in the page;
// access is governed by App Check + Firebase rules).
// Then uncomment the <script src="firebase-config.js"> line in index.html.
// With no config file, the demo runs on the local fallback backends and the
// routing decision is still fully visible.
window.HYBRIDNOTES_FIREBASE_CONFIG = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  appId: "REPLACE_ME"
};
