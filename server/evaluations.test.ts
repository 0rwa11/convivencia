import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Evaluation Procedures", () => {
  describe("Input Validation", () => {
    it("should validate evaluation creation input", () => {
      const evaluationSchema = z.object({
        sessionId: z.number(),
        groupId: z.number(),
        duringParticipation: z.string().optional(),
        beforeMixedInteractions: z.number().optional(),
        afterMixedInteractions: z.number().optional(),
        beforeStereotypes: z.string().optional(),
        afterStereotypes: z.string().optional(),
        notes: z.string().optional(),
      });

      const validData = {
        sessionId: 1,
        groupId: 1,
        duringParticipation: "80%",
        beforeMixedInteractions: 5,
        afterMixedInteractions: 8,
        beforeStereotypes: "high",
        afterStereotypes: "low",
        notes: "Good progress",
      };

      const result = evaluationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should require sessionId and groupId", () => {
      const evaluationSchema = z.object({
        sessionId: z.number(),
        groupId: z.number(),
      });

      const invalidData = {
        sessionId: 1,
        // missing groupId
      };

      const result = evaluationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should validate optional fields", () => {
      const evaluationSchema = z.object({
        sessionId: z.number(),
        groupId: z.number(),
        duringParticipation: z.string().optional(),
        beforeMixedInteractions: z.number().optional(),
      });

      const minimalData = {
        sessionId: 1,
        groupId: 1,
      };

      const result = evaluationSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe("Update Input Validation", () => {
    it("should validate evaluation update input", () => {
      const updateSchema = z.object({
        id: z.number(),
        duringParticipation: z.string().optional(),
        beforeMixedInteractions: z.number().optional(),
        afterMixedInteractions: z.number().optional(),
        beforeStereotypes: z.string().optional(),
        afterStereotypes: z.string().optional(),
        notes: z.string().optional(),
      });

      const validData = {
        id: 1,
        duringParticipation: "85%",
        notes: "Updated notes",
      };

      const result = updateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should require id for update", () => {
      const updateSchema = z.object({
        id: z.number(),
      });

      const invalidData = {
        // missing id
      };

      const result = updateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("Delete Input Validation", () => {
    it("should validate delete input", () => {
      const deleteSchema = z.object({
        id: z.number(),
      });

      const validData = {
        id: 1,
      };

      const result = deleteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should require id for delete", () => {
      const deleteSchema = z.object({
        id: z.number(),
      });

      const invalidData = {
        // missing id
      };

      const result = deleteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
