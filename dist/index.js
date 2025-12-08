var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      jwtSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/auth.ts
var auth_exports = {};
__export(auth_exports, {
  comparePassword: () => comparePassword,
  createLogoutCookieHeader: () => createLogoutCookieHeader,
  createSessionCookieHeader: () => createSessionCookieHeader,
  createSessionToken: () => createSessionToken,
  getSessionCookie: () => getSessionCookie,
  hashPassword: () => hashPassword,
  verifySessionToken: () => verifySessionToken
});
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
async function createSessionToken(userId, username) {
  const secret = new TextEncoder().encode(ENV.jwtSecret);
  const token = await new SignJWT({
    userId,
    username
  }).setProtectedHeader({ alg: "HS256" }).setExpirationTime(JWT_EXPIRY).sign(secret);
  return token;
}
async function verifySessionToken(token) {
  try {
    const secret = new TextEncoder().encode(ENV.jwtSecret);
    const verified = await jwtVerify(token, secret);
    return {
      userId: verified.payload.userId,
      username: verified.payload.username
    };
  } catch (error) {
    console.error("[Auth] Failed to verify session token:", error);
    return null;
  }
}
function getSessionCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${COOKIE_NAME}=`)) {
      return cookie.substring(COOKIE_NAME.length + 1);
    }
  }
  return null;
}
function createSessionCookieHeader(token, secure = true) {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? "Strict" : "Lax";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=${sameSite}${secure ? "; Secure" : ""}; Max-Age=${7 * 24 * 60 * 60}`;
}
function createLogoutCookieHeader() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0`;
}
var SALT_ROUNDS, JWT_EXPIRY, COOKIE_NAME;
var init_auth = __esm({
  "server/auth.ts"() {
    "use strict";
    init_env();
    SALT_ROUNDS = 10;
    JWT_EXPIRY = "7d";
    COOKIE_NAME = "session";
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/oauth.ts
function registerOAuthRoutes(app) {
}

// server/_core/authService.ts
init_auth();

// server/db.ts
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: text("passwordHash").notNull(),
  name: text("name"),
  role: mysqlEnum("role", ["user", "admin", "facilitator"]).default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn")
});
var groups = mysqlTable("groups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionNumber: int("sessionNumber").notNull(),
  groupId: int("groupId").notNull(),
  date: timestamp("date").notNull(),
  facilitator: varchar("facilitator", { length: 255 }),
  topic: text("topic"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var evaluations = mysqlTable("evaluations", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  groupId: int("groupId").notNull(),
  userId: int("userId").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  duringParticipation: varchar("duringParticipation", { length: 50 }),
  beforeMixedInteractions: int("beforeMixedInteractions").default(0),
  afterMixedInteractions: int("afterMixedInteractions").default(0),
  beforeStereotypes: varchar("beforeStereotypes", { length: 50 }),
  afterStereotypes: varchar("afterStereotypes", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var materials = mysqlTable("materials", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  url: text("url"),
  fileKey: text("fileKey"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: int("entityId"),
  changes: text("changes"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var groupsRelations = relations(groups, ({ many }) => ({
  sessions: many(sessions),
  evaluations: many(evaluations)
}));
var sessionsRelations = relations(sessions, ({ one, many }) => ({
  group: one(groups, { fields: [sessions.groupId], references: [groups.id] }),
  evaluations: many(evaluations)
}));
var evaluationsRelations = relations(evaluations, ({ one }) => ({
  session: one(sessions, { fields: [evaluations.sessionId], references: [sessions.id] }),
  group: one(groups, { fields: [evaluations.groupId], references: [groups.id] }),
  user: one(users, { fields: [evaluations.userId], references: [users.id] })
}));

// server/db.ts
var _db = null;
async function getDb() {
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
async function createUser(user) {
  if (!user.username || !user.passwordHash) {
    throw new Error("Username and password hash are required");
  }
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    const result = await db.insert(users).values(user);
    const userId = result[0].insertId;
    const created = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create user:", error);
    throw error;
  }
}
async function getUserByUsername(username) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserById(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateUserLastSignedIn(userId) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    await db.update(users).set({ lastSignedIn: /* @__PURE__ */ new Date() }).where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update last signed in:", error);
    throw error;
  }
}
async function getAllUsers() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("[Database] Failed to get all users:", error);
    throw error;
  }
}
async function updateUser(id, updates) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    await db.update(users).set(updates).where(eq(users.id, id));
    return await getUserById(id);
  } catch (error) {
    console.error("[Database] Failed to update user:", error);
    throw error;
  }
}
async function deleteUser(id) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    await db.delete(users).where(eq(users.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete user:", error);
    throw error;
  }
}
async function getAuditLogs(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit).offset(offset);
  } catch (error) {
    console.error("[Database] Failed to get audit logs:", error);
    throw error;
  }
}
async function getSystemStatistics() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    const allUsers = await db.select().from(users);
    const allEvaluations = await db.select().from(evaluations);
    const allGroups = await db.select().from(groups);
    const allSessions = await db.select().from(sessions);
    return {
      totalUsers: allUsers.length,
      totalEvaluations: allEvaluations.length,
      totalGroups: allGroups.length,
      totalSessions: allSessions.length
    };
  } catch (error) {
    console.error("[Database] Failed to get statistics:", error);
    throw error;
  }
}
async function createGroup(group) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    const result = await db.insert(groups).values(group);
    const groupId = result[0].insertId;
    const created = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create group:", error);
    throw error;
  }
}
async function getGroups() {
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
async function getGroupById(id) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createSession(session) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    const result = await db.insert(sessions).values(session);
    const sessionId = result[0].insertId;
    const created = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create session:", error);
    throw error;
  }
}
async function getSessionsByGroupId(groupId) {
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
async function createEvaluation(evaluation) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    const result = await db.insert(evaluations).values(evaluation);
    const evalId = result[0].insertId;
    const created = await db.select().from(evaluations).where(eq(evaluations.id, evalId)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create evaluation:", error);
    throw error;
  }
}
async function getEvaluationsByGroupId(groupId) {
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
async function getEvaluationsBySessionId(sessionId) {
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
async function listEvaluations() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    return await db.select().from(evaluations);
  } catch (error) {
    console.error("[Database] Failed to list evaluations:", error);
    throw error;
  }
}
async function updateEvaluation(id, data) {
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
async function deleteEvaluation(id) {
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
async function createMaterial(material) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    const result = await db.insert(materials).values(material);
    const matId = result[0].insertId;
    const created = await db.select().from(materials).where(eq(materials.id, matId)).limit(1);
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create material:", error);
    throw error;
  }
}
async function getMaterials() {
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
async function getMaterialsByCategory(category) {
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

// shared/const.ts
var COOKIE_NAME2 = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/authService.ts
var AuthService = class {
  /**
   * Authenticate a request by verifying the session cookie
   */
  async authenticateRequest(req) {
    try {
      const token = getSessionCookie(req.headers.cookie);
      if (!token) {
        return null;
      }
      const payload = await verifySessionToken(token);
      if (!payload) {
        return null;
      }
      const user = await getUserById(payload.userId);
      if (!user || !user.isActive) {
        return null;
      }
      return user;
    } catch (error) {
      console.error("[Auth] Failed to authenticate request:", error);
      return null;
    }
  }
  /**
   * Login a user with username and password
   */
  async login(username, password, res) {
    try {
      const user = await getUserByUsername(username);
      if (!user) {
        return null;
      }
      if (!user.isActive) {
        throw new Error("User account is inactive");
      }
      const isPasswordValid = await comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        return null;
      }
      await updateUserLastSignedIn(user.id);
      const token = await createSessionToken(user.id, user.username);
      const isProduction = process.env.NODE_ENV === "production";
      const sameSite = isProduction ? "strict" : "lax";
      const secure = isProduction;
      res.cookie(COOKIE_NAME2, token, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 7 * 24 * 60 * 60 * 1e3,
        // 7 days
        path: "/"
      });
      return user;
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      return null;
    }
  }
  /**
   * Logout a user
   */
  logout(res) {
    res.clearCookie(COOKIE_NAME2, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/"
    });
  }
  /**
   * Create a new user (admin only)
   */
  async createUser(username, password, name, email, role = "user") {
    try {
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        throw new Error("Username already exists");
      }
      const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
      const passwordHash = await hashPassword2(password);
      await createUser({
        username,
        passwordHash,
        name: name || username,
        email: email || null,
        role,
        isActive: true
      });
      const user = await getUserByUsername(username);
      if (!user) {
        throw new Error("Failed to create user");
      }
      return user;
    } catch (error) {
      console.error("[Auth] Failed to create user:", error);
      throw error;
    }
  }
};
var authService = new AuthService();

// server/_core/authRoutes.ts
function registerAuthRoutes(app) {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }
      const user = await authService.login(username, password, res);
      if (!user) {
        res.status(401).json({ error: "Invalid username or password" });
        return;
      }
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("[Auth] Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app.post("/api/auth/logout", (req, res) => {
    try {
      authService.logout(res);
      res.json({ success: true });
    } catch (error) {
      console.error("[Auth] Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });
  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await authService.authenticateRequest(req);
      if (!user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }
      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error("[Auth] Get user error:", error);
      res.status(500).json({ error: "Failed to get user info" });
    }
  });
}

// server/routers.ts
import { z as z5 } from "zod";
import { TRPCError as TRPCError6 } from "@trpc/server";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/admin.ts
import { z as z2 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";
init_auth();
var adminRouter = router({
  /**
   * List all users (admin only)
   */
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    try {
      return await getAllUsers();
    } catch (error) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users"
      });
    }
  }),
  /**
   * Get user by ID (admin only)
   */
  getUser: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    try {
      return await getUserById(input.id);
    } catch (error) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user"
      });
    }
  }),
  /**
   * Create a new user (admin only)
   */
  createUser: protectedProcedure.input(
    z2.object({
      username: z2.string().min(3, "Username must be at least 3 characters"),
      password: z2.string().min(6, "Password must be at least 6 characters"),
      name: z2.string().optional(),
      email: z2.string().email().optional(),
      role: z2.enum(["admin", "facilitator", "user"]).default("user")
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    try {
      const existingUser = await getUserByUsername(input.username);
      if (existingUser) {
        throw new TRPCError3({
          code: "BAD_REQUEST",
          message: "Username already exists"
        });
      }
      const passwordHash = await hashPassword(input.password);
      const user = await createUser({
        username: input.username,
        passwordHash,
        name: input.name,
        email: input.email,
        role: input.role,
        isActive: true
      });
      return user;
    } catch (error) {
      if (error.code) throw error;
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user"
      });
    }
  }),
  /**
   * Update user (admin only)
   */
  updateUser: protectedProcedure.input(
    z2.object({
      id: z2.number(),
      name: z2.string().optional(),
      email: z2.string().email().optional(),
      role: z2.enum(["admin", "facilitator", "user"]).optional(),
      isActive: z2.boolean().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    try {
      return await updateUser(input.id, {
        name: input.name,
        email: input.email,
        role: input.role,
        isActive: input.isActive
      });
    } catch (error) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update user"
      });
    }
  }),
  /**
   * Reset user password (admin only)
   */
  resetPassword: protectedProcedure.input(
    z2.object({
      userId: z2.number(),
      newPassword: z2.string().min(6, "Password must be at least 6 characters")
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    try {
      const passwordHash = await hashPassword(input.newPassword);
      await updateUser(input.userId, { passwordHash });
      return { success: true };
    } catch (error) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to reset password"
      });
    }
  }),
  /**
   * Delete user (admin only)
   */
  deleteUser: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    try {
      if (input.id === ctx.user?.id) {
        throw new TRPCError3({
          code: "BAD_REQUEST",
          message: "Cannot delete your own account"
        });
      }
      await deleteUser(input.id);
      return { success: true };
    } catch (error) {
      if (error.code) throw error;
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete user"
      });
    }
  }),
  /**
   * Get audit logs (admin only)
   */
  getAuditLogs: protectedProcedure.input(
    z2.object({
      limit: z2.number().default(100),
      offset: z2.number().default(0)
    })
  ).query(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    try {
      return await getAuditLogs(input.limit, input.offset);
    } catch (error) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch audit logs"
      });
    }
  }),
  /**
   * Get system statistics (admin only)
   */
  getStatistics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    try {
      const stats = await getSystemStatistics();
      return stats;
    } catch (error) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch statistics"
      });
    }
  })
});

// server/routers/analytics.ts
import { z as z3 } from "zod";
import { TRPCError as TRPCError4 } from "@trpc/server";
var analyticsRouter = router({
  /**
   * Get evaluation statistics
   */
  getEvaluationStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const evaluations2 = await listEvaluations();
      if (!evaluations2 || evaluations2.length === 0) {
        return {
          totalEvaluations: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          byGroup: [],
          bySession: [],
          trend: []
        };
      }
      const scores = evaluations2.map((e) => e.afterMixedInteractions || 0);
      const totalEvaluations = evaluations2.length;
      const averageScore = scores.reduce((a, b) => a + b, 0) / totalEvaluations;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);
      const byGroup = {};
      evaluations2.forEach((e) => {
        if (!byGroup[e.groupId]) {
          byGroup[e.groupId] = { groupId: e.groupId, count: 0, averageScore: 0 };
        }
        byGroup[e.groupId].count += 1;
        byGroup[e.groupId].averageScore += e.afterMixedInteractions || 0;
      });
      Object.keys(byGroup).forEach((key) => {
        byGroup[key].averageScore = byGroup[key].averageScore / byGroup[key].count;
      });
      const bySession = {};
      evaluations2.forEach((e) => {
        if (!bySession[e.sessionId]) {
          bySession[e.sessionId] = { sessionId: e.sessionId, count: 0, averageScore: 0 };
        }
        bySession[e.sessionId].count += 1;
        bySession[e.sessionId].averageScore += e.afterMixedInteractions || 0;
      });
      Object.keys(bySession).forEach((key) => {
        bySession[key].averageScore = bySession[key].averageScore / bySession[key].count;
      });
      return {
        totalEvaluations,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore,
        lowestScore,
        byGroup: Object.values(byGroup),
        bySession: Object.values(bySession),
        trend: evaluations2.map((e) => ({
          date: e.createdAt,
          score: e.afterMixedInteractions
        }))
      };
    } catch (error) {
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch evaluation statistics"
      });
    }
  }),
  /**
   * Get group comparison data
   */
  getGroupComparison: protectedProcedure.input(z3.object({ groupIds: z3.array(z3.number()).optional() })).query(async ({ input, ctx }) => {
    try {
      const evaluations2 = await listEvaluations();
      if (!evaluations2 || evaluations2.length === 0) {
        return [];
      }
      const filtered = input.groupIds ? evaluations2.filter((e) => input.groupIds.includes(e.groupId)) : evaluations2;
      const comparison = {};
      filtered.forEach((e) => {
        if (!comparison[e.groupId]) {
          comparison[e.groupId] = {
            groupId: e.groupId,
            totalEvaluations: 0,
            averageScore: 0,
            participantCount: 0,
            scoreDistribution: {}
          };
        }
        comparison[e.groupId].totalEvaluations += 1;
        comparison[e.groupId].averageScore += e.afterMixedInteractions || 0;
        const scoreRange = Math.floor((e.afterMixedInteractions || 0) / 10) * 10;
        const key = `${scoreRange}-${scoreRange + 10}`;
        comparison[e.groupId].scoreDistribution[key] = (comparison[e.groupId].scoreDistribution[key] || 0) + 1;
      });
      Object.keys(comparison).forEach((key) => {
        const group = comparison[key];
        group.averageScore = Math.round(group.averageScore / group.totalEvaluations * 100) / 100;
        group.participantCount = group.totalEvaluations;
      });
      return Object.values(comparison);
    } catch (error) {
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch group comparison"
      });
    }
  }),
  /**
   * Get trend analysis
   */
  getTrendAnalysis: protectedProcedure.input(
    z3.object({
      days: z3.number().default(30)
    })
  ).query(async ({ input, ctx }) => {
    try {
      const evaluations2 = await listEvaluations();
      if (!evaluations2 || evaluations2.length === 0) {
        return [];
      }
      const now = /* @__PURE__ */ new Date();
      const startDate = new Date(now.getTime() - input.days * 24 * 60 * 60 * 1e3);
      const filtered = evaluations2.filter((e) => new Date(e.createdAt) >= startDate);
      const trend = {};
      filtered.forEach((e) => {
        const date = new Date(e.createdAt).toISOString().split("T")[0];
        if (!trend[date]) {
          trend[date] = { date, count: 0, averageScore: 0 };
        }
        trend[date].count += 1;
        trend[date].averageScore += e.afterMixedInteractions || 0;
      });
      Object.keys(trend).forEach((key) => {
        trend[key].averageScore = Math.round(trend[key].averageScore / trend[key].count * 100) / 100;
      });
      return Object.values(trend).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch trend analysis"
      });
    }
  }),
  /**
   * Generate summary report
   */
  generateSummaryReport: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stats = await getSystemStatistics();
      const evaluations2 = await listEvaluations();
      const scores = evaluations2.map((e) => e.afterMixedInteractions || 0);
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return {
        generatedAt: /* @__PURE__ */ new Date(),
        period: "All Time",
        summary: {
          totalUsers: stats.totalUsers,
          totalEvaluations: stats.totalEvaluations,
          totalGroups: stats.totalGroups,
          totalSessions: stats.totalSessions,
          averageEvaluationScore: Math.round(averageScore * 100) / 100
        },
        keyMetrics: {
          evaluationsPerSession: stats.totalSessions > 0 ? Math.round(stats.totalEvaluations / stats.totalSessions * 100) / 100 : 0,
          evaluationsPerGroup: stats.totalGroups > 0 ? Math.round(stats.totalEvaluations / stats.totalGroups * 100) / 100 : 0,
          usersPerGroup: stats.totalGroups > 0 ? Math.round(stats.totalUsers / stats.totalGroups * 100) / 100 : 0
        }
      };
    } catch (error) {
      throw new TRPCError4({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate summary report"
      });
    }
  })
});

// server/routers/dataManagement.ts
import { z as z4 } from "zod";
import { TRPCError as TRPCError5 } from "@trpc/server";
var dataManagementRouter = router({
  /**
   * Export all evaluations as JSON
   */
  exportEvaluationsJSON: protectedProcedure.query(async ({ ctx }) => {
    try {
      const evaluations2 = await listEvaluations();
      const groups2 = await getGroups();
      const sessions2 = await getSessionsByGroupId(groups2[0]?.id || 0);
      return {
        exportedAt: /* @__PURE__ */ new Date(),
        exportedBy: ctx.user?.username,
        data: {
          evaluations: evaluations2,
          groups: groups2,
          sessions: sessions2
        }
      };
    } catch (error) {
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export evaluations"
      });
    }
  }),
  /**
   * Export evaluations as CSV
   */
  exportEvaluationsCSV: protectedProcedure.query(async ({ ctx }) => {
    try {
      const evaluations2 = await listEvaluations();
      const headers = [
        "ID",
        "Session ID",
        "Group ID",
        "User ID",
        "Date",
        "During Participation",
        "Before Mixed Interactions",
        "After Mixed Interactions",
        "Before Stereotypes",
        "After Stereotypes",
        "Notes",
        "Created At"
      ];
      const rows = evaluations2.map((e) => [
        e.id,
        e.sessionId,
        e.groupId,
        e.userId,
        e.date,
        e.duringParticipation,
        e.beforeMixedInteractions,
        e.afterMixedInteractions,
        e.beforeStereotypes,
        e.afterStereotypes,
        e.notes,
        e.createdAt
      ]);
      const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
      return {
        csv,
        filename: `evaluations-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`
      };
    } catch (error) {
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export evaluations as CSV"
      });
    }
  }),
  /**
   * Import evaluations from JSON
   */
  importEvaluationsJSON: protectedProcedure.input(
    z4.object({
      data: z4.object({
        evaluations: z4.array(
          z4.object({
            sessionId: z4.number(),
            groupId: z4.number(),
            userId: z4.number(),
            duringParticipation: z4.string().optional(),
            beforeMixedInteractions: z4.number().optional(),
            afterMixedInteractions: z4.number().optional(),
            beforeStereotypes: z4.string().optional(),
            afterStereotypes: z4.string().optional(),
            notes: z4.string().optional()
          })
        )
      })
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can import data"
        });
      }
      let importedCount = 0;
      const errors = [];
      for (const evalData of input.data.evaluations) {
        try {
          await createEvaluation({
            sessionId: evalData.sessionId,
            groupId: evalData.groupId,
            userId: evalData.userId,
            duringParticipation: evalData.duringParticipation,
            beforeMixedInteractions: evalData.beforeMixedInteractions,
            afterMixedInteractions: evalData.afterMixedInteractions,
            beforeStereotypes: evalData.beforeStereotypes,
            afterStereotypes: evalData.afterStereotypes,
            notes: evalData.notes
          });
          importedCount++;
        } catch (error) {
          errors.push(`Failed to import evaluation: ${error.message}`);
        }
      }
      return {
        success: true,
        importedCount,
        errors,
        totalAttempted: input.data.evaluations.length
      };
    } catch (error) {
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to import evaluations"
      });
    }
  }),
  /**
   * Backup all data
   */
  backupAllData: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can backup data"
        });
      }
      const users2 = await getAllUsers();
      const groups2 = await getGroups();
      const evaluations2 = await listEvaluations();
      const auditLogs2 = await getAuditLogs(1e3, 0);
      return {
        backupDate: /* @__PURE__ */ new Date(),
        backupBy: ctx.user?.username,
        data: {
          users: users2.map((u) => ({
            id: u.id,
            username: u.username,
            name: u.name,
            email: u.email,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt
          })),
          groups: groups2,
          evaluations: evaluations2,
          auditLogs: auditLogs2
        },
        statistics: {
          totalUsers: users2.length,
          totalGroups: groups2.length,
          totalEvaluations: evaluations2.length,
          totalAuditLogs: auditLogs2.length
        }
      };
    } catch (error) {
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to backup data"
      });
    }
  }),
  /**
   * Restore data from backup
   */
  restoreFromBackup: protectedProcedure.input(
    z4.object({
      backupData: z4.any()
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError5({
          code: "FORBIDDEN",
          message: "Only admins can restore data"
        });
      }
      let restoredCount = 0;
      const errors = [];
      if (input.backupData.data?.groups) {
        for (const group of input.backupData.data.groups) {
          try {
            await createGroup({
              name: group.name,
              description: group.description,
              createdBy: ctx.user?.id || 1
            });
            restoredCount++;
          } catch (error) {
            errors.push(`Failed to restore group: ${error.message}`);
          }
        }
      }
      if (input.backupData.data?.evaluations) {
        for (const evaluation of input.backupData.data.evaluations) {
          try {
            await createEvaluation({
              sessionId: evaluation.sessionId,
              groupId: evaluation.groupId,
              userId: evaluation.userId,
              duringParticipation: evaluation.duringParticipation,
              beforeMixedInteractions: evaluation.beforeMixedInteractions,
              afterMixedInteractions: evaluation.afterMixedInteractions,
              beforeStereotypes: evaluation.beforeStereotypes,
              afterStereotypes: evaluation.afterStereotypes,
              notes: evaluation.notes
            });
            restoredCount++;
          } catch (error) {
            errors.push(`Failed to restore evaluation: ${error.message}`);
          }
        }
      }
      return {
        success: true,
        restoredCount,
        errors,
        message: `Successfully restored ${restoredCount} items from backup`
      };
    } catch (error) {
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to restore from backup"
      });
    }
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  admin: adminRouter,
  analytics: analyticsRouter,
  dataManagement: dataManagementRouter,
  /**
   * Authentication procedures
   */
  auth: router({
    /**
     * Get current user info
     */
    me: publicProcedure.query(({ ctx }) => ctx.user),
    /**
     * Login with username and password
     */
    login: publicProcedure.input(
      z5.object({
        username: z5.string().min(1, "Username is required"),
        password: z5.string().min(1, "Password is required")
      })
    ).mutation(async ({ input, ctx }) => {
      const user = await authService.login(input.username, input.password, ctx.res);
      if (!user) {
        throw new TRPCError6({
          code: "UNAUTHORIZED",
          message: "Invalid username or password"
        });
      }
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    }),
    /**
     * Logout
     */
    logout: publicProcedure.mutation(({ ctx }) => {
      authService.logout(ctx.res);
      return { success: true };
    }),
    /**
     * Create a new user (admin only)
     */
    createUser: protectedProcedure.input(
      z5.object({
        username: z5.string().min(3, "Username must be at least 3 characters"),
        password: z5.string().min(6, "Password must be at least 6 characters"),
        name: z5.string().optional(),
        email: z5.string().email().optional(),
        role: z5.enum(["user", "admin", "facilitator"]).default("user")
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError6({
          code: "FORBIDDEN",
          message: "Only administrators can create users"
        });
      }
      try {
        const user = await authService.createUser(
          input.username,
          input.password,
          input.name || input.username,
          input.email,
          input.role
        );
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role
          }
        };
      } catch (error) {
        throw new TRPCError6({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Failed to create user"
        });
      }
    })
  }),
  /**
   * Evaluation procedures
   */
  evaluations: router({
    /**
     * Create a new evaluation
     */
    create: protectedProcedure.input(
      z5.object({
        sessionId: z5.number(),
        groupId: z5.number(),
        duringParticipation: z5.string().optional(),
        beforeMixedInteractions: z5.number().optional(),
        afterMixedInteractions: z5.number().optional(),
        beforeStereotypes: z5.string().optional(),
        afterStereotypes: z5.string().optional(),
        notes: z5.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError6({ code: "UNAUTHORIZED" });
      }
      const evaluation = await createEvaluation({
        sessionId: input.sessionId,
        groupId: input.groupId,
        userId: ctx.user.id,
        duringParticipation: input.duringParticipation,
        beforeMixedInteractions: input.beforeMixedInteractions,
        afterMixedInteractions: input.afterMixedInteractions,
        beforeStereotypes: input.beforeStereotypes,
        afterStereotypes: input.afterStereotypes,
        notes: input.notes
      });
      return evaluation;
    }),
    /**
     * Get evaluations by group
     */
    listByGroup: protectedProcedure.input(z5.object({ groupId: z5.number() })).query(async ({ input }) => {
      return getEvaluationsByGroupId(input.groupId);
    }),
    /**
     * Get evaluations by session
     */
    listBySession: protectedProcedure.input(z5.object({ sessionId: z5.number() })).query(async ({ input }) => {
      return getEvaluationsBySessionId(input.sessionId);
    }),
    /**
     * Update an evaluation
     */
    update: protectedProcedure.input(
      z5.object({
        id: z5.number(),
        duringParticipation: z5.string().optional(),
        beforeMixedInteractions: z5.number().optional(),
        afterMixedInteractions: z5.number().optional(),
        beforeStereotypes: z5.string().optional(),
        afterStereotypes: z5.string().optional(),
        notes: z5.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError6({ code: "UNAUTHORIZED" });
      }
      await updateEvaluation(input.id, {
        duringParticipation: input.duringParticipation,
        beforeMixedInteractions: input.beforeMixedInteractions,
        afterMixedInteractions: input.afterMixedInteractions,
        beforeStereotypes: input.beforeStereotypes,
        afterStereotypes: input.afterStereotypes,
        notes: input.notes
      });
      return { success: true };
    }),
    /**
     * Delete an evaluation
     */
    delete: protectedProcedure.input(z5.object({ id: z5.number() })).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError6({ code: "UNAUTHORIZED" });
      }
      await deleteEvaluation(input.id);
      return { success: true };
    })
  }),
  /**
   * Group procedures
   */
  groups: router({
    /**
     * Create a new group
     */
    create: protectedProcedure.input(
      z5.object({
        name: z5.string().min(1, "Group name is required"),
        description: z5.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError6({ code: "UNAUTHORIZED" });
      }
      const group = await createGroup({
        name: input.name,
        description: input.description,
        createdBy: ctx.user.id
      });
      return group;
    }),
    /**
     * Get all groups
     */
    list: protectedProcedure.query(async () => {
      return getGroups();
    }),
    /**
     * Get a group by ID
     */
    getById: protectedProcedure.input(z5.object({ id: z5.number() })).query(async ({ input }) => {
      return getGroupById(input.id);
    })
  }),
  /**
   * Session procedures
   */
  sessions: router({
    /**
     * Create a new session
     */
    create: protectedProcedure.input(
      z5.object({
        sessionNumber: z5.number(),
        groupId: z5.number(),
        date: z5.date(),
        facilitator: z5.string().optional(),
        topic: z5.string().optional(),
        notes: z5.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError6({ code: "UNAUTHORIZED" });
      }
      const session = await createSession({
        sessionNumber: input.sessionNumber,
        groupId: input.groupId,
        date: input.date,
        facilitator: input.facilitator,
        topic: input.topic,
        notes: input.notes
      });
      return session;
    }),
    /**
     * Get sessions by group
     */
    listByGroup: protectedProcedure.input(z5.object({ groupId: z5.number() })).query(async ({ input }) => {
      return getSessionsByGroupId(input.groupId);
    })
  }),
  /**
   * Materials procedures
   */
  materials: router({
    /**
     * Create a new material
     */
    create: protectedProcedure.input(
      z5.object({
        title: z5.string().min(1, "Title is required"),
        description: z5.string().optional(),
        category: z5.string().optional(),
        url: z5.string().optional(),
        fileKey: z5.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError6({ code: "UNAUTHORIZED" });
      }
      const material = await createMaterial({
        title: input.title,
        description: input.description,
        category: input.category,
        url: input.url,
        fileKey: input.fileKey,
        createdBy: ctx.user.id
      });
      return material;
    }),
    /**
     * Get all materials
     */
    list: publicProcedure.query(async () => {
      return getMaterials();
    }),
    /**
     * Get materials by category
     */
    listByCategory: publicProcedure.input(z5.object({ category: z5.string() })).query(async ({ input }) => {
      return getMaterialsByCategory(input.category);
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await authService.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  registerAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
