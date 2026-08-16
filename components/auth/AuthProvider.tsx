"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "@/lib/firebase/client";
import { collections, type UserDoc } from "@/lib/firebase/schema";

interface AuthState {
  /** Firebase user, or null when signed out. */
  user: User | null;
  /** Our own profile document. Null until it loads or if signed out. */
  profile: UserDoc | null;
  /** False until the first auth callback — don't render decisions before this. */
  ready: boolean;
  configured: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [ready, setReady] = useState(!firebaseConfigured);

  useEffect(() => {
    if (!firebaseConfigured) return;
    return onAuthStateChanged(auth(), (next) => {
      setUser(next);
      setReady(true);
      if (!next) setProfile(null);
    });
  }, []);

  // Live-subscribe to the profile so badges and stats update everywhere at
  // once — the header, the profile page and any open conversation.
  useEffect(() => {
    if (!firebaseConfigured || !user) return;
    return onSnapshot(doc(db(), collections.users, user.uid), (snap) => {
      setProfile(snap.exists() ? (snap.data() as UserDoc) : null);
    });
  }, [user]);

  const signIn = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth(), provider);
    const { uid, displayName, email, photoURL } = credential.user;
    const ref = doc(db(), collections.users, uid);
    const existing = await getDoc(ref);

    if (!existing.exists()) {
      // Seed a profile from what Google gave us. Everything else is filled in
      // by the join flow; we only ever show "First L." publicly.
      const parts = (displayName ?? "").trim().split(/\s+/).filter(Boolean);
      const firstName = parts[0] ?? "";
      const lastInitial = (parts[1]?.[0] ?? "").toUpperCase();
      await setDoc(ref, {
        uid,
        firstName,
        lastInitial,
        displayName: lastInitial ? `${firstName} ${lastInitial}.` : firstName || "Someone",
        email: email ?? "",
        photoURL: photoURL ?? null,
        neighbourhood: "",
        bio: "",
        learning: "",
        idVerified: false,
        isTeacher: false,
        stats: { lessons: 0, categories: [], groupLessons: 0 },
        createdAt: serverTimestamp(),
      });
      return;
    }

    // Returning user: refresh only what Google owns, leave their edits alone.
    await setDoc(ref, { email: email ?? "", photoURL: photoURL ?? null }, { merge: true });
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(auth());
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, profile, ready, configured: firebaseConfigured, signIn, signOut }),
    [user, profile, ready, signIn, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
