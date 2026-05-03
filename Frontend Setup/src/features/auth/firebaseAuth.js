import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const authDomainFromEnv =
  import.meta.env.VITE_AUTH_DOMAIN || import.meta.env.VITE_Auth_Domain;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: authDomainFromEnv,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const requiredFirebaseKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];

const missingFirebaseKeys = requiredFirebaseKeys.filter((key) => !firebaseConfig[key]);

if (missingFirebaseKeys.length > 0) {
  throw new Error(`Missing Firebase env vars: ${missingFirebaseKeys.join(", ")}`);
}

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    return {
      idToken,
      firebaseUser: result.user,
    };
  } catch (error) {
    if (error?.code === "auth/unauthorized-domain") {
      const currentDomain =
        typeof window !== "undefined" ? window.location.hostname : "current-domain";
      throw new Error(
        `Google sign-in is not enabled for "${currentDomain}". Add this domain in Firebase Console -> Authentication -> Settings -> Authorized domains.`,
      );
    }

    throw error;
  }
};