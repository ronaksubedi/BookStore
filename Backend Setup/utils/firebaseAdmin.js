import admin from "firebase-admin";
import { createVerify } from "crypto";

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

const FIREBASE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
let firebaseCertsCache = null;
let firebaseCertsCacheAt = 0;
const FIREBASE_CERTS_TTL_MS = 60 * 60 * 1000;

const base64UrlDecodeJson = (segment) => {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
};

const fetchFirebaseCerts = async () => {
  const now = Date.now();
  if (firebaseCertsCache && now - firebaseCertsCacheAt < FIREBASE_CERTS_TTL_MS) {
    return firebaseCertsCache;
  }

  const response = await fetch(FIREBASE_CERTS_URL);
  if (!response.ok) {
    throw new Error("Unable to fetch Firebase public certificates");
  }

  firebaseCertsCache = await response.json();
  firebaseCertsCacheAt = now;
  return firebaseCertsCache;
};

const verifyFirebaseTokenWithoutAdmin = async (idToken) => {
  const [headerSegment, payloadSegment, signatureSegment] = idToken.split(".");

  if (!headerSegment || !payloadSegment || !signatureSegment) {
    throw new Error("Invalid Firebase token format");
  }

  const header = base64UrlDecodeJson(headerSegment);
  const payload = base64UrlDecodeJson(payloadSegment);
  const certs = await fetchFirebaseCerts();
  const certificate = certs?.[header.kid];

  if (!certificate) {
    throw new Error("Unable to verify Firebase token signature");
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${headerSegment}.${payloadSegment}`);
  verifier.end();

  const signature = Buffer.from(signatureSegment.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  if (!verifier.verify(certificate, signature)) {
    throw new Error("Invalid Firebase token signature");
  }

  const tokenProjectId = payload.aud;
  const expectedProjectId = firebaseProjectId || tokenProjectId;
  const expectedIssuer = `https://securetoken.google.com/${expectedProjectId}`;
  const nowInSeconds = Math.floor(Date.now() / 1000);

  if (firebaseProjectId && tokenProjectId !== firebaseProjectId) {
    throw new Error("Invalid Firebase token audience");
  }

  if (payload.iss !== expectedIssuer) {
    throw new Error("Invalid Firebase token issuer");
  }

  if (typeof payload.exp !== "number" || payload.exp <= nowInSeconds) {
    throw new Error("Firebase token has expired");
  }

  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    throw new Error("Invalid Firebase token subject");
  }

  return payload;
};

export const verifyFirebaseIdToken = async (idToken) => {
  if (admin.apps.length) {
    return admin.auth().verifyIdToken(idToken);
  }

  return verifyFirebaseTokenWithoutAdmin(idToken);
};
