import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, evaluations, groups, sessions, materials, Evaluation, Group, Session, Material } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

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

/**
 * User Management Functions
 */
export async function createUser(user: InsertUser): Promise<void> {
  if (!user.username || !user.passwordHash) {
    throw new Error("Username and password hash are required");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db.insert(users).values(user);
  } catch (error) {
    console.error("[Database] Failed to create user:", error);
    throw error;
  }
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserLastSignedIn(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update last signed in:", error);
    throw error;
  }
}

/**
 * Group Management Functions
 */
export async function createGroup(group: { name: string; description?: string; createdBy: number }): Promise<Group> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(groups).values(group);
    const groupId = result[0].insertId;
    const created = await db.select().from(groups).where(eq(groups.id, groupId as number)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create group:", error);
    throw error;
  }
}

export async function getGroups() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.select().from(groups);
  } catch (error) {
    console.error("[Database] Failed to get groups:", error);
    throw error;
  }
}

export async function getGroupById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Session Management Functions
 */
export async function createSession(session: { sessionNumber: number; groupId: number; date: Date; facilitator?: string; topic?: string; notes?: string }): Promise<Session> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(sessions).values(session);
    const sessionId = result[0].insertId;
    const created = await db.select().from(sessions).where(eq(sessions.id, sessionId as number)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create session:", error);
    throw error;
  }
}

export async function getSessionsByGroupId(groupId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.select().from(sessions).where(eq(sessions.groupId, groupId));
  } catch (error) {
    console.error("[Database] Failed to get sessions:", error);
    throw error;
  }
}

/**
 * Evaluation Management Functions
 */
export async function createEvaluation(evaluation: { sessionId: number; groupId: number; userId: number; duringParticipation?: string; beforeMixedInteractions?: number; afterMixedInteractions?: number; beforeStereotypes?: string; afterStereotypes?: string; notes?: string }): Promise<Evaluation> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(evaluations).values(evaluation);
    const evalId = result[0].insertId;
    const created = await db.select().from(evaluations).where(eq(evaluations.id, evalId as number)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create evaluation:", error);
    throw error;
  }
}

export async function getEvaluationsByGroupId(groupId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.select().from(evaluations).where(eq(evaluations.groupId, groupId));
  } catch (error) {
    console.error("[Database] Failed to get evaluations:", error);
    throw error;
  }
}

export async function getEvaluationsBySessionId(sessionId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.select().from(evaluations).where(eq(evaluations.sessionId, sessionId));
  } catch (error) {
    console.error("[Database] Failed to get evaluations:", error);
    throw error;
  }
}

export async function updateEvaluation(id: number, data: Partial<Evaluation>): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db.update(evaluations).set(data).where(eq(evaluations.id, id));
  } catch (error) {
    console.error("[Database] Failed to update evaluation:", error);
    throw error;
  }
}

export async function deleteEvaluation(id: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db.delete(evaluations).where(eq(evaluations.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete evaluation:", error);
    throw error;
  }
}

/**
 * Materials Management Functions
 */
export async function createMaterial(material: { title: string; description?: string; category?: string; url?: string; fileKey?: string; createdBy: number }): Promise<Material> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(materials).values(material);
    const matId = result[0].insertId;
    const created = await db.select().from(materials).where(eq(materials.id, matId as number)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create material:", error);
    throw error;
  }
}

export async function getMaterials() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.select().from(materials);
  } catch (error) {
    console.error("[Database] Failed to get materials:", error);
    throw error;
  }
}

export async function getMaterialsByCategory(category: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.select().from(materials).where(eq(materials.category, category));
  } catch (error) {
    console.error("[Database] Failed to get materials:", error);
    throw error;
  }
}
