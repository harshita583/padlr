"use client";

import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase, client side.
 *
 * The app talks to Firestore straight from the browser, so `firestore.rules`
 * is the access control — there's no server tier to check anything. That also
 * means these config values are not secrets: they identify the project, they
 * don't authorise anything. Committing them is expected.
 *
 * Set NEXT_PUBLIC_FIREBASE_EMULATOR=true to point at the local emulator suite
 * instead of the real project.
 */

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const useEmulator = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true";

/** True when there's enough config to talk to Firebase at all. */
export const firebaseConfigured = Boolean(config.projectId);

let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

function app() {
  if (!firebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Copy .env.local.example to .env.local and fill it in.",
    );
  }
  return getApps().length ? getApp() : initializeApp(config);
}

export function auth(): Auth {
  if (cachedAuth) return cachedAuth;
  cachedAuth = getAuth(app());
  if (useEmulator) {
    // `disableWarnings` keeps the emulator banner out of the console; the
    // connection itself is idempotent, so hot reloads are safe.
    connectAuthEmulator(cachedAuth, "http://127.0.0.1:9099", { disableWarnings: true });
  }
  return cachedAuth;
}

export function db(): Firestore {
  if (cachedDb) return cachedDb;
  cachedDb = getFirestore(app());
  if (useEmulator) {
    connectFirestoreEmulator(cachedDb, "127.0.0.1", 8080);
  }
  return cachedDb;
}
