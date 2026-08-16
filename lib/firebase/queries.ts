"use client";

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./client";
import {
  collections,
  type BookingDoc,
  type BookingStatus,
  type CircleDoc,
  type MessageDoc,
  type TeacherDoc,
  type ThreadDoc,
  type UserDoc,
} from "./schema";

/**
 * Every Firestore read and write the app makes.
 *
 * Components subscribe rather than fetch wherever the data can change while
 * you're looking at it — conversations, bookings, circles. That's what makes a
 * circle's price drop on everyone's screen the moment somebody joins, with no
 * polling and no refresh.
 */

/* -------------------------------------------------------------------------- */
/* Teachers                                                                   */
/* -------------------------------------------------------------------------- */

export async function fetchTeachers(): Promise<TeacherDoc[]> {
  const snap = await getDocs(
    query(collection(db(), collections.teachers), where("active", "==", true)),
  );
  return snap.docs.map((d) => d.data() as TeacherDoc);
}

export async function fetchTeacherBySlug(slug: string): Promise<TeacherDoc | null> {
  const snap = await getDocs(
    query(collection(db(), collections.teachers), where("slug", "==", slug), limit(1)),
  );
  return snap.empty ? null : (snap.docs[0].data() as TeacherDoc);
}

export async function fetchTeacher(uid: string): Promise<TeacherDoc | null> {
  const snap = await getDoc(doc(db(), collections.teachers, uid));
  return snap.exists() ? (snap.data() as TeacherDoc) : null;
}

export async function saveTeacherProfile(uid: string, data: Partial<TeacherDoc>) {
  await setDoc(doc(db(), collections.teachers, uid), { ...data, uid }, { merge: true });
  await updateDoc(doc(db(), collections.users, uid), { isTeacher: true });
}

/* -------------------------------------------------------------------------- */
/* Users                                                                      */
/* -------------------------------------------------------------------------- */

export async function updateUser(uid: string, data: Partial<UserDoc>) {
  await updateDoc(doc(db(), collections.users, uid), data);
}

export async function fetchUser(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db(), collections.users, uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

/* -------------------------------------------------------------------------- */
/* Threads and messages                                                       */
/* -------------------------------------------------------------------------- */

export function watchThreads(uid: string, cb: (threads: ThreadDoc[]) => void): Unsubscribe {
  return onSnapshot(
    query(
      collection(db(), collections.threads),
      where("participantIds", "array-contains", uid),
      orderBy("lastActivity", "desc"),
    ),
    (snap) => cb(snap.docs.map((d) => ({ ...(d.data() as ThreadDoc), id: d.id }))),
  );
}

export function watchThread(id: string, cb: (thread: ThreadDoc | null) => void): Unsubscribe {
  return onSnapshot(doc(db(), collections.threads, id), (snap) =>
    cb(snap.exists() ? ({ ...(snap.data() as ThreadDoc), id: snap.id }) : null),
  );
}

export function watchMessages(
  threadId: string,
  cb: (messages: MessageDoc[]) => void,
): Unsubscribe {
  return onSnapshot(
    query(
      collection(db(), collections.threads, threadId, collections.messages),
      orderBy("sentAt", "asc"),
    ),
    (snap) => cb(snap.docs.map((d) => ({ ...(d.data() as MessageDoc), id: d.id }))),
  );
}

/**
 * Find the conversation between a learner and a teacher, or start one.
 * Deterministic id, so two people opening a chat at once can't create two.
 */
export async function ensureThread(params: {
  learnerId: string;
  learnerName: string;
  teacher: TeacherDoc;
  skill: string;
}): Promise<string> {
  const id = `${params.learnerId}__${params.teacher.uid}`;
  const ref = doc(db(), collections.threads, id);
  const existing = await getDoc(ref);
  if (existing.exists()) return id;

  const thread: Omit<ThreadDoc, "lastActivity"> & { lastActivity: unknown } = {
    id,
    participantIds: [params.learnerId, params.teacher.uid],
    learnerId: params.learnerId,
    teacherId: params.teacher.uid,
    learnerName: params.learnerName,
    teacherName: params.teacher.name,
    teacherSlug: params.teacher.slug,
    teacherInitials: params.teacher.initials,
    teacherTone: params.teacher.tone,
    teacherRate: params.teacher.hourlyRate,
    skill: params.skill,
    categorySlug: params.teacher.categories[0] ?? "",
    lastActivity: serverTimestamp(),
    lastPreview: "",
    unread: { [params.learnerId]: 0, [params.teacher.uid]: 0 },
  };
  await setDoc(ref, thread);
  return id;
}

export async function sendMessage(
  threadId: string,
  message: Omit<MessageDoc, "id" | "sentAt">,
  preview: string,
  recipientId: string,
) {
  await addDoc(collection(db(), collections.threads, threadId, collections.messages), {
    ...message,
    sentAt: serverTimestamp(),
  });
  await updateDoc(doc(db(), collections.threads, threadId), {
    lastActivity: serverTimestamp(),
    lastPreview: preview,
    [`unread.${recipientId}`]: increment(1),
  });
}

export async function markThreadRead(threadId: string, uid: string) {
  await updateDoc(doc(db(), collections.threads, threadId), { [`unread.${uid}`]: 0 });
}

/* -------------------------------------------------------------------------- */
/* Bookings                                                                   */
/* -------------------------------------------------------------------------- */

export async function createBooking(
  booking: Omit<BookingDoc, "id" | "createdAt" | "decidedAt" | "status">,
): Promise<string> {
  const ref = await addDoc(collection(db(), collections.bookings), {
    ...booking,
    status: "pending" satisfies BookingStatus,
    createdAt: serverTimestamp(),
    decidedAt: null,
  });
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

/** Only the teacher can confirm or decline; rules enforce it too. */
export async function decideBooking(id: string, status: Exclude<BookingStatus, "pending">) {
  await updateDoc(doc(db(), collections.bookings, id), {
    status,
    decidedAt: serverTimestamp(),
  });
}

export function watchTeacherBookings(
  teacherId: string,
  cb: (bookings: BookingDoc[]) => void,
): Unsubscribe {
  return onSnapshot(
    query(
      collection(db(), collections.bookings),
      where("teacherId", "==", teacherId),
      orderBy("startsAt", "asc"),
    ),
    (snap) => cb(snap.docs.map((d) => ({ ...(d.data() as BookingDoc), id: d.id }))),
  );
}

export function watchLearnerBookings(
  learnerId: string,
  cb: (bookings: BookingDoc[]) => void,
): Unsubscribe {
  return onSnapshot(
    query(
      collection(db(), collections.bookings),
      where("learnerId", "==", learnerId),
      orderBy("startsAt", "asc"),
    ),
    (snap) => cb(snap.docs.map((d) => ({ ...(d.data() as BookingDoc), id: d.id }))),
  );
}

export function watchBooking(id: string, cb: (booking: BookingDoc | null) => void): Unsubscribe {
  return onSnapshot(doc(db(), collections.bookings, id), (snap) =>
    cb(snap.exists() ? ({ ...(snap.data() as BookingDoc), id: snap.id }) : null),
  );
}

/* -------------------------------------------------------------------------- */
/* Circles                                                                    */
/* -------------------------------------------------------------------------- */

export async function createCircle(
  circle: Omit<CircleDoc, "id" | "createdAt">,
): Promise<string> {
  const ref = await addDoc(collection(db(), collections.circles), {
    ...circle,
    createdAt: serverTimestamp(),
  });
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export function watchOpenCircles(cb: (circles: CircleDoc[]) => void): Unsubscribe {
  return onSnapshot(
    query(
      collection(db(), collections.circles),
      where("visibility", "==", "open"),
      orderBy("startsAt", "asc"),
    ),
    (snap) => cb(snap.docs.map((d) => ({ ...(d.data() as CircleDoc), id: d.id }))),
  );
}

export function watchCircle(id: string, cb: (circle: CircleDoc | null) => void): Unsubscribe {
  return onSnapshot(doc(db(), collections.circles, id), (snap) =>
    cb(snap.exists() ? ({ ...(snap.data() as CircleDoc), id: snap.id }) : null),
  );
}

/**
 * Join or leave. Only the membership array changes, which is exactly what the
 * rules allow a non-host to do — and the price everyone sees is derived from
 * that array, so it updates for every open client at once.
 */
export async function joinCircle(id: string, uid: string, name: string) {
  await updateDoc(doc(db(), collections.circles, id), {
    memberIds: arrayUnion(uid),
    [`memberNames.${uid}`]: name,
  });
}

export async function leaveCircle(id: string, uid: string) {
  await updateDoc(doc(db(), collections.circles, id), {
    memberIds: arrayRemove(uid),
  });
}
