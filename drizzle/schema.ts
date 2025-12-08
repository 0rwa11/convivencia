import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table with password-based authentication.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: text("passwordHash").notNull(),
  name: text("name"),
  role: mysqlEnum("role", ["user", "admin", "facilitator"]).default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Groups table for organizing participants
 */
export const groups = mysqlTable("groups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Group = typeof groups.$inferSelect;
export type InsertGroup = typeof groups.$inferInsert;

/**
 * Sessions table for tracking program sessions
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionNumber: int("sessionNumber").notNull(),
  groupId: int("groupId").notNull(),
  date: timestamp("date").notNull(),
  facilitator: varchar("facilitator", { length: 255 }),
  topic: text("topic"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Evaluation records table - core data for the program
 */
export const evaluations = mysqlTable("evaluations", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = typeof evaluations.$inferInsert;

/**
 * Materials/Resources table
 */
export const materials = mysqlTable("materials", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  url: text("url"),
  fileKey: text("fileKey"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = typeof materials.$inferInsert;

/**
 * Audit log for tracking changes
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: int("entityId"),
  changes: text("changes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Relations
 */
export const groupsRelations = relations(groups, ({ many }) => ({
  sessions: many(sessions),
  evaluations: many(evaluations),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  group: one(groups, { fields: [sessions.groupId], references: [groups.id] }),
  evaluations: many(evaluations),
}));

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  session: one(sessions, { fields: [evaluations.sessionId], references: [sessions.id] }),
  group: one(groups, { fields: [evaluations.groupId], references: [groups.id] }),
  user: one(users, { fields: [evaluations.userId], references: [users.id] }),
}));
