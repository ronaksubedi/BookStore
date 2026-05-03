import admin from "firebase-admin";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebasePrivateKeyRaw =
  process.env.FIREBASE_PRIVATE_KEY ||
  (process.env.FIREBASE_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8")
    : "");

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
      "Firebase Admin is not configured. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }

  return admin.auth().verifyIdToken(idToken);
};