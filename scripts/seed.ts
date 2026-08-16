/**
 * Seed Firestore from the mock data.
 *
 *   npm run seed          # into the running emulator
 *   npm run seed:prod     # into the real project (needs a service account)
 *
 * Safe to run repeatedly: every write is keyed by a stable id, so this
 * upserts rather than duplicating. It does not touch users, threads,
 * bookings or circles — those are created by people using the app.
 */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

import { experts } from "../lib/data/experts";
import { categories } from "../lib/data/categories";
import { gear } from "../lib/data/gear";
import { events } from "../lib/data/events";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "padlr-dev";
const usingEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

if (!getApps().length) {
  if (usingEmulator) {
    initializeApp({ projectId });
  } else {
    const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!path) {
      console.error(
        "Set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON path to seed production.",
      );
      process.exit(1);
    }
    initializeApp({ credential: cert(JSON.parse(readFileSync(path, "utf8"))) });
  }
}

const db = getFirestore();

/** Firestore rejects `undefined`; the mock data has a few optional fields. */
function clean<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as T;
}

async function seed() {
  console.log(`Seeding ${usingEmulator ? "emulator" : projectId}…`);

  let batch = db.batch();
  let queued = 0;

  // Firestore batches cap at 500 writes.
  const write = async (path: string, id: string, data: object) => {
    batch.set(db.collection(path).doc(id), clean(data), { merge: true });
    queued += 1;
    if (queued >= 400) {
      await batch.commit();
      batch = db.batch();
      queued = 0;
    }
  };

  for (const category of categories) {
    await write("categories", category.slug, category);
  }

  for (const item of gear) {
    await write("gear", item.id, item);
  }

  // Seeded teachers get a synthetic uid. A real teacher's document id is their
  // auth uid instead — both are just document ids, so they coexist fine.
  for (const expert of experts) {
    const { reviews, ...teacher } = expert;
    await write("teachers", expert.id, {
      ...teacher,
      uid: expert.id,
      active: true,
      seeded: true,
    });
    for (const review of reviews) {
      await write(`teachers/${expert.id}/reviews`, review.id, {
        ...review,
        authorId: `seed-${review.id}`,
      });
    }
  }

  for (const event of events) {
    await write("events", event.slug, {
      ...event,
      startsAt: Timestamp.fromDate(new Date(event.startsAt)),
      seeded: true,
    });
  }

  if (queued > 0) await batch.commit();

  console.log(
    `Done: ${categories.length} categories, ${gear.length} gear, ` +
      `${experts.length} teachers, ${events.length} events.`,
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
