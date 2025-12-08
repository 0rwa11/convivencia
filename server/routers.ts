import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { authService } from "./_core/authService";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { dataManagementRouter } from "./routers/dataManagement";
import * as db from "./db";

export const appRouter = router({
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
    login: publicProcedure
      .input(
        z.object({
          username: z.string().min(1, "Username is required"),
          password: z.string().min(1, "Password is required"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await authService.login(input.username, input.password, ctx.res);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
          },
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
    createUser: protectedProcedure
      .input(
        z.object({
          username: z.string().min(3, "Username must be at least 3 characters"),
          password: z.string().min(6, "Password must be at least 6 characters"),
          name: z.string().optional(),
          email: z.string().email().optional(),
          role: z.enum(["user", "admin", "facilitator"]).default("user"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Only admin users can create new users
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only administrators can create users",
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
              role: user.role,
            },
          };
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : "Failed to create user",
          });
        }
      }),
  }),

  /**
   * Evaluation procedures
   */
  evaluations: router({
    /**
     * Create a new evaluation
     */
    create: protectedProcedure
      .input(
        z.object({
          sessionId: z.number(),
          groupId: z.number(),
          duringParticipation: z.string().optional(),
          beforeMixedInteractions: z.number().optional(),
          afterMixedInteractions: z.number().optional(),
          beforeStereotypes: z.string().optional(),
          afterStereotypes: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const evaluation = await db.createEvaluation({
          sessionId: input.sessionId,
          groupId: input.groupId,
          userId: ctx.user.id,
          duringParticipation: input.duringParticipation,
          beforeMixedInteractions: input.beforeMixedInteractions,
          afterMixedInteractions: input.afterMixedInteractions,
          beforeStereotypes: input.beforeStereotypes,
          afterStereotypes: input.afterStereotypes,
          notes: input.notes,
        });

        return evaluation;
      }),

    /**
     * Get evaluations by group
     */
    listByGroup: protectedProcedure
      .input(z.object({ groupId: z.number() }))
      .query(async ({ input }) => {
        return db.getEvaluationsByGroupId(input.groupId);
      }),

    /**
     * Get evaluations by session
     */
    listBySession: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        return db.getEvaluationsBySessionId(input.sessionId);
      }),

    /**
     * Update an evaluation
     */
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          duringParticipation: z.string().optional(),
          beforeMixedInteractions: z.number().optional(),
          afterMixedInteractions: z.number().optional(),
          beforeStereotypes: z.string().optional(),
          afterStereotypes: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        await db.updateEvaluation(input.id, {
          duringParticipation: input.duringParticipation,
          beforeMixedInteractions: input.beforeMixedInteractions,
          afterMixedInteractions: input.afterMixedInteractions,
          beforeStereotypes: input.beforeStereotypes,
          afterStereotypes: input.afterStereotypes,
          notes: input.notes,
        });

        return { success: true };
      }),

    /**
     * Delete an evaluation
     */
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        await db.deleteEvaluation(input.id);
        return { success: true };
      }),
  }),

  /**
   * Group procedures
   */
  groups: router({
    /**
     * Create a new group
     */
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Group name is required"),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const group = await db.createGroup({
          name: input.name,
          description: input.description,
          createdBy: ctx.user.id,
        });

        return group;
      }),

    /**
     * Get all groups
     */
    list: protectedProcedure.query(async () => {
      return db.getGroups();
    }),

    /**
     * Get a group by ID
     */
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getGroupById(input.id);
      }),
  }),

  /**
   * Session procedures
   */
  sessions: router({
    /**
     * Create a new session
     */
    create: protectedProcedure
      .input(
        z.object({
          sessionNumber: z.number(),
          groupId: z.number(),
          date: z.date(),
          facilitator: z.string().optional(),
          topic: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const session = await db.createSession({
          sessionNumber: input.sessionNumber,
          groupId: input.groupId,
          date: input.date,
          facilitator: input.facilitator,
          topic: input.topic,
          notes: input.notes,
        });

        return session;
      }),

    /**
     * Get sessions by group
     */
    listByGroup: protectedProcedure
      .input(z.object({ groupId: z.number() }))
      .query(async ({ input }) => {
        return db.getSessionsByGroupId(input.groupId);
      }),
  }),

  /**
   * Materials procedures
   */
  materials: router({
    /**
     * Create a new material
     */
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title is required"),
          description: z.string().optional(),
          category: z.string().optional(),
          url: z.string().optional(),
          fileKey: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const material = await db.createMaterial({
          title: input.title,
          description: input.description,
          category: input.category,
          url: input.url,
          fileKey: input.fileKey,
          createdBy: ctx.user.id,
        });

        return material;
      }),

    /**
     * Get all materials
     */
    list: publicProcedure.query(async () => {
      return db.getMaterials();
    }),

    /**
     * Get materials by category
     */
    listByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return db.getMaterialsByCategory(input.category);
      }),
  }),
});

export type AppRouter = typeof appRouter;
