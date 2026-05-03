import admin from "firebase-admin";

const firebaseProjectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.FIREBASE_PROJECTID ||
  process.env.GOOGLE_CLOUD_PROJECT;

const firebaseClientEmail =
  process.env.FIREBASE_CLIENT_EMAIL ||
  process.env.FIREBASE_CLIENTEMAIL;

const firebasePrivateKey =
  process.env.FIREBASE_PRIVATE_KEY ||
  process.env.FIREBASE_PRIVATEKEY ||
  "";

if (!admin.apps.length && firebaseProjectId && firebaseClientEmail && firebasePrivateKey) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseProjectId,
      clientEmail: firebaseClientEmail,
      privateKey: firebasePrivateKey.trim().replace(/\\n/g, "\n"),
    }),
  });
}
const verifyFirebaseTokenWithoutAdmin = async (idToken) => {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);

  if (!response.ok) {
    throw new Error("Invalid Firebase token");
  }

  const payload = await response.json();

  if (!payload?.email) {
    throw new Error("Invalid Firebase token");
  }

  return payload;
};

export const verifyFirebaseIdToken = async (idToken) => {
  if (admin.apps.length) {
    return admin.auth().verifyIdToken(idToken);
  }

  return verifyFirebaseTokenWithoutAdmin(idToken);
};
