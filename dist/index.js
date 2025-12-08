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
import { eq } from "drizzle-orm";
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
    await db.insert(users).values(user);
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
import { z as z2 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";

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

// server/routers.ts
var appRouter = router({
  system: systemRouter,
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
      z2.object({
        username: z2.string().min(1, "Username is required"),
        password: z2.string().min(1, "Password is required")
      })
    ).mutation(async ({ input, ctx }) => {
      const user = await authService.login(input.username, input.password, ctx.res);
      if (!user) {
        throw new TRPCError3({
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
      z2.object({
        username: z2.string().min(3, "Username must be at least 3 characters"),
        password: z2.string().min(6, "Password must be at least 6 characters"),
        name: z2.string().optional(),
        email: z2.string().email().optional(),
        role: z2.enum(["user", "admin", "facilitator"]).default("user")
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError3({
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
        throw new TRPCError3({
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
      z2.object({
        sessionId: z2.number(),
        groupId: z2.number(),
        duringParticipation: z2.string().optional(),
        beforeMixedInteractions: z2.number().optional(),
        afterMixedInteractions: z2.number().optional(),
        beforeStereotypes: z2.string().optional(),
        afterStereotypes: z2.string().optional(),
        notes: z2.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError3({ code: "UNAUTHORIZED" });
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
    listByGroup: protectedProcedure.input(z2.object({ groupId: z2.number() })).query(async ({ input }) => {
      return getEvaluationsByGroupId(input.groupId);
    }),
    /**
     * Get evaluations by session
     */
    listBySession: protectedProcedure.input(z2.object({ sessionId: z2.number() })).query(async ({ input }) => {
      return getEvaluationsBySessionId(input.sessionId);
    }),
    /**
     * Update an evaluation
     */
    update: protectedProcedure.input(
      z2.object({
        id: z2.number(),
        duringParticipation: z2.string().optional(),
        beforeMixedInteractions: z2.number().optional(),
        afterMixedInteractions: z2.number().optional(),
        beforeStereotypes: z2.string().optional(),
        afterStereotypes: z2.string().optional(),
        notes: z2.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError3({ code: "UNAUTHORIZED" });
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
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError3({ code: "UNAUTHORIZED" });
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
      z2.object({
        name: z2.string().min(1, "Group name is required"),
        description: z2.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError3({ code: "UNAUTHORIZED" });
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
    getById: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
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
      z2.object({
        sessionNumber: z2.number(),
        groupId: z2.number(),
        date: z2.date(),
        facilitator: z2.string().optional(),
        topic: z2.string().optional(),
        notes: z2.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError3({ code: "UNAUTHORIZED" });
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
    listByGroup: protectedProcedure.input(z2.object({ groupId: z2.number() })).query(async ({ input }) => {
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
      z2.object({
        title: z2.string().min(1, "Title is required"),
        description: z2.string().optional(),
        category: z2.string().optional(),
        url: z2.string().optional(),
        fileKey: z2.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError3({ code: "UNAUTHORIZED" });
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
    listByCategory: publicProcedure.input(z2.object({ category: z2.string() })).query(async ({ input }) => {
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
