import admin from "firebase-admin";
import { createVerify } from "crypto";

const FIREBASE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const firebaseProjectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.FIREBASE_PROJECTID ||
  process.env.GOOGLE_CLOUD_PROJECT;

const firebaseClientEmail =
  process.env.FIREBASE_CLIENT_EMAIL ||
  process.env.FIREBASE_CLIENTEMAIL;

const firebasePrivateKeyRaw =
  process.env.FIREBASE_PRIVATE_KEY ||
  process.env.FIREBASE_PRIVATEKEY ||
  process.env.FIREBASE_PRIVATE_KEY_BASE64 ||
  process.env.FIREBASE_PRIVATEKEY_BASE64 ||
  "";

const firebasePrivateKey = (() => {
  if (!firebasePrivateKeyRaw) return "";

  if (process.env.FIREBASE_PRIVATE_KEY_BASE64 || process.env.FIREBASE_PRIVATEKEY_BASE64) {
    try {
      return Buffer.from(firebasePrivateKeyRaw, "base64").toString("utf8").trim().replace(/\\n/g, "\n");
    } catch {
      return "";
    }
  }

  return firebasePrivateKeyRaw
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/,+$/, "")
    .replace(/\\n/g, "\n");
})();

const serviceAccountJsonRaw =
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
  process.env.FIREBASE_SERVICE_ACCOUNT ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ||
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
  "";

const parseServiceAccountJson = (rawValue) => {
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue.trim().replace(/^"+|"+$/g, ""));
  } catch {
    return null;
  }
};

const serviceAccountFromJson = parseServiceAccountJson(serviceAccountJsonRaw);
const resolvedProjectId = serviceAccountFromJson?.project_id || firebaseProjectId;
const resolvedClientEmail = serviceAccountFromJson?.client_email || firebaseClientEmail;
const resolvedPrivateKey = serviceAccountFromJson?.private_key || firebasePrivateKey;

if (!admin.apps.length && resolvedProjectId && resolvedClientEmail && resolvedPrivateKey) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: resolvedProjectId,
      clientEmail: resolvedClientEmail,
      privateKey: resolvedPrivateKey,
    }),
  });
}

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
  if (!resolvedProjectId) {
    throw new Error("Firebase Admin is not configured");
  }

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
  const isValid = verifier.verify(certificate, signature);

  if (!isValid) {
    throw new Error("Invalid Firebase token signature");
  }

  const expectedIssuer = `https://securetoken.google.com/${resolvedProjectId}`;
  const nowInSeconds = Math.floor(Date.now() / 1000);

  if (payload.aud !== resolvedProjectId || payload.iss !== expectedIssuer) {
    throw new Error("Invalid Firebase token audience or issuer");
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
