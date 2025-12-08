import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

type User = NonNullable<any>;

/**
 * Data management procedures for import/export
 */
export const dataManagementRouter = router({
  /**
   * Export all evaluations as JSON
   */
  exportEvaluationsJSON: protectedProcedure.query(async ({ ctx }) => {
    try {
      const evaluations = await db.listEvaluations();
      const groups = await db.getGroups();
      const sessions = await db.getSessionsByGroupId(groups[0]?.id || 0);

      return {
        exportedAt: new Date(),
        exportedBy: ctx.user?.username,
        data: {
          evaluations,
          groups,
          sessions,
        },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export evaluations",
      });
    }
  }),

  /**
   * Export evaluations as CSV
   */
  exportEvaluationsCSV: protectedProcedure.query(async ({ ctx }) => {
    try {
      const evaluations = await db.listEvaluations();

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
        "Created At",
      ];

      const rows = evaluations.map((e: any) => [
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
        e.createdAt,
      ]);

      const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

      return {
        csv,
        filename: `evaluations-${new Date().toISOString().split("T")[0]}.csv`,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export evaluations as CSV",
      });
    }
  }),

  /**
   * Import evaluations from JSON
   */
  importEvaluationsJSON: protectedProcedure
    .input(
      z.object({
        data: z.object({
          evaluations: z.array(
            z.object({
              sessionId: z.number(),
              groupId: z.number(),
              userId: z.number(),
              duringParticipation: z.string().optional(),
              beforeMixedInteractions: z.number().optional(),
              afterMixedInteractions: z.number().optional(),
              beforeStereotypes: z.string().optional(),
              afterStereotypes: z.string().optional(),
              notes: z.string().optional(),
            })
          ),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can import data",
          });
        }

        let importedCount = 0;
        const errors: string[] = [];

        for (const evalData of input.data.evaluations) {
          try {
            await db.createEvaluation({
              sessionId: evalData.sessionId,
              groupId: evalData.groupId,
              userId: evalData.userId,
              duringParticipation: evalData.duringParticipation,
              beforeMixedInteractions: evalData.beforeMixedInteractions,
              afterMixedInteractions: evalData.afterMixedInteractions,
              beforeStereotypes: evalData.beforeStereotypes,
              afterStereotypes: evalData.afterStereotypes,
              notes: evalData.notes,
            });
            importedCount++;
          } catch (error: any) {
            errors.push(`Failed to import evaluation: ${error.message}`);
          }
        }

        return {
          success: true,
          importedCount,
          errors,
          totalAttempted: input.data.evaluations.length,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to import evaluations",
        });
      }
    }),

  /**
   * Backup all data
   */
  backupAllData: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    try {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can backup data",
        });
      }

      const users = await db.getAllUsers();
      const groups = await db.getGroups();
      const evaluations = await db.listEvaluations();
      const auditLogs = await db.getAuditLogs(1000, 0);

      return {
        backupDate: new Date(),
        backupBy: ctx.user?.username,
        data: {
          users: users.map((u: any) => ({
            id: u.id,
            username: u.username,
            name: u.name,
            email: u.email,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt,
          })),
          groups,
          evaluations,
          auditLogs,
        },
        statistics: {
          totalUsers: users.length,
          totalGroups: groups.length,
          totalEvaluations: evaluations.length,
          totalAuditLogs: auditLogs.length,
        },
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to backup data",
      });
    }
  }),

  /**
   * Restore data from backup
   */
  restoreFromBackup: protectedProcedure
    .input(
      z.object({
        backupData: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can restore data",
          });
        }

        let restoredCount = 0;
        const errors: string[] = [];

        // Restore groups
        if (input.backupData.data?.groups) {
          for (const group of input.backupData.data.groups) {
            try {
              await db.createGroup({
                name: group.name,
                description: group.description,
                createdBy: ctx.user?.id || 1,
              });
              restoredCount++;
            } catch (error: any) {
              errors.push(`Failed to restore group: ${error.message}`);
            }
          }
        }

        // Restore evaluations
        if (input.backupData.data?.evaluations) {
          for (const evaluation of input.backupData.data.evaluations) {
            try {
              await db.createEvaluation({
                sessionId: evaluation.sessionId,
                groupId: evaluation.groupId,
                userId: evaluation.userId,
                duringParticipation: evaluation.duringParticipation,
                beforeMixedInteractions: evaluation.beforeMixedInteractions,
                afterMixedInteractions: evaluation.afterMixedInteractions,
                beforeStereotypes: evaluation.beforeStereotypes,
                afterStereotypes: evaluation.afterStereotypes,
                notes: evaluation.notes,
              });
              restoredCount++;
            } catch (error: any) {
              errors.push(`Failed to restore evaluation: ${error.message}`);
            }
          }
        }

        return {
          success: true,
          restoredCount,
          errors,
          message: `Successfully restored ${restoredCount} items from backup`,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to restore from backup",
        });
      }
    }),
});
