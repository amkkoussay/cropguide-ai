import { and, desc, eq, isNotNull, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  fieldObservations,
  type InsertFieldObservation,
  type InsertUser,
  type OrchardSpecies,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
const PUBLIC_SCAN_USER_OPEN_ID = "cropguide-public-scans";

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPublicScanUserId() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.openId, PUBLIC_SCAN_USER_OPEN_ID)).limit(1);
  if (existing[0]) return existing[0].id;

  await db
    .insert(users)
    .values({ openId: PUBLIC_SCAN_USER_OPEN_ID, name: "CropGuide public scans", loginMethod: "guest", role: "user" })
    .onDuplicateKeyUpdate({ set: { lastSignedIn: new Date() } });

  const created = await db.select({ id: users.id }).from(users).where(eq(users.openId, PUBLIC_SCAN_USER_OPEN_ID)).limit(1);
  if (!created[0]) throw new Error("Unable to prepare the public scan store");
  return created[0].id;
}

export async function createObservation(observation: InsertFieldObservation) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(fieldObservations).values(observation);
  return Number(result[0].insertId);
}

export async function getObservationById(id: number, visitorId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db
    .select()
    .from(fieldObservations)
    .where(and(eq(fieldObservations.id, id), eq(fieldObservations.visitorId, visitorId)))
    .limit(1);
  return result[0];
}

export async function listObservations(input: {
  visitorId: string;
  species?: OrchardSpecies;
  cursor?: number;
  limit: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const filters = [eq(fieldObservations.visitorId, input.visitorId)];
  if (input.species) filters.push(eq(fieldObservations.species, input.species));
  if (input.cursor) filters.push(lt(fieldObservations.id, input.cursor));
  return db
    .select()
    .from(fieldObservations)
    .where(and(...filters))
    .orderBy(desc(fieldObservations.id))
    .limit(input.limit + 1);
}

export async function listObservationMapPoints(visitorId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db
    .select({
      id: fieldObservations.id,
      species: fieldObservations.species,
      latitude: fieldObservations.latitude,
      longitude: fieldObservations.longitude,
      capturedAt: fieldObservations.capturedAt,
      summary: fieldObservations.summary,
    })
    .from(fieldObservations)
    .where(
      and(
        eq(fieldObservations.visitorId, visitorId),
        isNotNull(fieldObservations.latitude),
        isNotNull(fieldObservations.longitude),
      ),
    )
    .orderBy(desc(fieldObservations.id));
}
