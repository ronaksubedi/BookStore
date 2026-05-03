import admin from "firebase-admin";

const parseServiceAccountJson = (rawValue) => {
  if (!rawValue) return null;

  try {
    const decoded = rawValue.trim().replace(/^"+|"+$/g, "");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const getEnv = (...keys) => keys.map((key) => process.env[key]).find(Boolean);

const serviceAccountFromJson = parseServiceAccountJson(
  getEnv(
    "FIREBASE_SERVICE_ACCOUNT_JSON",
    "FIREBASE_SERVICE_ACCOUNT",
    "GOOGLE_APPLICATION_CREDENTIALS_JSON",
    "GOOGLE_SERVICE_ACCOUNT_JSON",
  ),
);

const firebaseProjectId =
  serviceAccountFromJson?.project_id ||
  getEnv("FIREBASE_PROJECT_ID", "FIREBASE_PROJECTID", "GOOGLE_CLOUD_PROJECT");

const firebaseClientEmail =
  serviceAccountFromJson?.client_email ||
  getEnv("FIREBASE_CLIENT_EMAIL", "FIREBASE_CLIENTEMAIL");

const firebasePrivateKeyRaw =
  serviceAccountFromJson?.private_key ||
  getEnv("FIREBASE_PRIVATE_KEY") ||
  (getEnv("FIREBASE_PRIVATE_KEY_BASE64", "FIREBASE_PRIVATEKEY_BASE64")
    ? Buffer.from(getEnv("FIREBASE_PRIVATE_KEY_BASE64", "FIREBASE_PRIVATEKEY_BASE64"), "base64").toString("utf8")
    : "") ||
  getEnv("FIREBASE_PRIVATEKEY");

const firebasePrivateKey = firebasePrivateKeyRaw
  .trim()
  .replace(/^"+|"+$/g, "")
  .replace(/,+$/, "")
  .replace(/\\n/g, "\n");

if (!admin.apps.length && firebaseProjectId && firebaseClientEmail && firebasePrivateKey) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseProjectId,
      clientEmail: firebaseClientEmail,
      privateKey: firebasePrivateKey,
    }),
  });
}

export const verifyFirebaseIdToken = async (idToken) => {
  if (!admin.apps.length) {
    throw new Error(
      "Firebase Admin is not configured. Check your Firebase service account env vars (project id, client email, private key, or service account JSON).",
    );
  }

  return admin.auth().verifyIdToken(idToken);
};