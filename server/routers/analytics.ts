import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

/**
 * Analytics and reporting procedures
 */
export const analyticsRouter = router({
  /**
   * Get evaluation statistics
   */
  getEvaluationStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const evaluations = await db.listEvaluations();

      if (!evaluations || evaluations.length === 0) {
        return {
          totalEvaluations: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          byGroup: [],
          bySession: [],
          trend: [],
        };
      }

      // Calculate statistics
      const scores = evaluations.map((e: any) => e.afterMixedInteractions || 0);
      const totalEvaluations = evaluations.length;
      const averageScore = scores.reduce((a: number, b: number) => a + b, 0) / totalEvaluations;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);

      // Group by group
      const byGroup: Record<string, { groupId: number; count: number; averageScore: number }> = {};
      evaluations.forEach((e: any) => {
        if (!byGroup[e.groupId]) {
          byGroup[e.groupId] = { groupId: e.groupId, count: 0, averageScore: 0 };
        }
        byGroup[e.groupId].count += 1;
        byGroup[e.groupId].averageScore += e.afterMixedInteractions || 0;
      });

      Object.keys(byGroup).forEach((key) => {
        byGroup[key].averageScore = byGroup[key].averageScore / byGroup[key].count;
      });

      // Group by session
      const bySession: Record<string, { sessionId: number; count: number; averageScore: number }> = {};
      evaluations.forEach((e: any) => {
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
        trend: evaluations.map((e) => ({
          date: e.createdAt,
          score: e.afterMixedInteractions,
        })),
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch evaluation statistics",
      });
    }
  }),

  /**
   * Get group comparison data
   */
  getGroupComparison: protectedProcedure
    .input(z.object({ groupIds: z.array(z.number()).optional() }))
    .query(async ({ input, ctx }) => {
      try {
        const evaluations = await db.listEvaluations();

        if (!evaluations || evaluations.length === 0) {
          return [];
        }

        const filtered = input.groupIds
          ? evaluations.filter((e) => input.groupIds!.includes(e.groupId))
          : evaluations;

        const comparison: Record<
          string,
          {
            groupId: number;
            totalEvaluations: number;
            averageScore: number;
            participantCount: number;
            scoreDistribution: Record<string, number>;
          }
        > = {};

        filtered.forEach((e) => {
          if (!comparison[e.groupId]) {
            comparison[e.groupId] = {
              groupId: e.groupId,
              totalEvaluations: 0,
              averageScore: 0,
              participantCount: 0,
              scoreDistribution: {},
            };
          }

          comparison[e.groupId].totalEvaluations += 1;
          comparison[e.groupId].averageScore += e.afterMixedInteractions || 0;

          // Count score distribution
          const scoreRange = Math.floor((e.afterMixedInteractions || 0) / 10) * 10;
          const key = `${scoreRange}-${scoreRange + 10}`;
          comparison[e.groupId].scoreDistribution[key] =
            (comparison[e.groupId].scoreDistribution[key] || 0) + 1;
        });

        // Calculate averages
        Object.keys(comparison).forEach((key) => {
          const group = comparison[key];
          group.averageScore = Math.round((group.averageScore / group.totalEvaluations) * 100) / 100;
          group.participantCount = group.totalEvaluations;
        });

        return Object.values(comparison);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch group comparison",
        });
      }
    }),

  /**
   * Get trend analysis
   */
  getTrendAnalysis: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const evaluations = await db.listEvaluations();

        if (!evaluations || evaluations.length === 0) {
          return [];
        }

        const now = new Date();
        const startDate = new Date(now.getTime() - input.days * 24 * 60 * 60 * 1000);

        const filtered = evaluations.filter((e) => new Date(e.createdAt) >= startDate);

        // Group by day
        const trend: Record<string, { date: string; count: number; averageScore: number }> = {};

        filtered.forEach((e) => {
          const date = new Date(e.createdAt).toISOString().split("T")[0];
          if (!trend[date]) {
            trend[date] = { date, count: 0, averageScore: 0 };
          }
          trend[date].count += 1;
          trend[date].averageScore += e.afterMixedInteractions || 0;
        });

        // Calculate averages
        Object.keys(trend).forEach((key) => {
          trend[key].averageScore = Math.round((trend[key].averageScore / trend[key].count) * 100) / 100;
        });

        return Object.values(trend).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch trend analysis",
        });
      }
    }),

  /**
   * Generate summary report
   */
  generateSummaryReport: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stats = await db.getSystemStatistics();
      const evaluations = await db.listEvaluations();

      const scores = evaluations.map((e: any) => e.afterMixedInteractions || 0);
      const averageScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;

      return {
        generatedAt: new Date(),
        period: "All Time",
        summary: {
          totalUsers: stats.totalUsers,
          totalEvaluations: stats.totalEvaluations,
          totalGroups: stats.totalGroups,
          totalSessions: stats.totalSessions,
          averageEvaluationScore: Math.round(averageScore * 100) / 100,
        },
        keyMetrics: {
          evaluationsPerSession: stats.totalSessions > 0 ? Math.round((stats.totalEvaluations / stats.totalSessions) * 100) / 100 : 0,
          evaluationsPerGroup: stats.totalGroups > 0 ? Math.round((stats.totalEvaluations / stats.totalGroups) * 100) / 100 : 0,
          usersPerGroup: stats.totalGroups > 0 ? Math.round((stats.totalUsers / stats.totalGroups) * 100) / 100 : 0,
        },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate summary report",
      });
    }
  }),
});
