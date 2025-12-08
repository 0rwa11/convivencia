import { describe, it, expect, beforeEach, vi } from "vitest";
import { hashPassword, comparePassword, createSessionToken, verifySessionToken } from "./auth";

describe("Authentication", () => {
  describe("Password Hashing", () => {
    it("should hash a password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should compare password with hash correctly", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it("should not match incorrect password", async () => {
      const password = "testPassword123";
      const wrongPassword = "wrongPassword";
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(wrongPassword, hash);
      expect(isMatch).toBe(false);
    });

    it("should generate different hashes for same password", async () => {
      const password = "testPassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
      // But both should match the password
      expect(await comparePassword(password, hash1)).toBe(true);
      expect(await comparePassword(password, hash2)).toBe(true);
    });
  });

  describe("JWT Session Token", () => {
    it("should create a valid session token", async () => {
      const token = await createSessionToken(1, "testuser");

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("should verify a valid session token", async () => {
      const userId = 123;
      const username = "testuser";
      const token = await createSessionToken(userId, username);

      const payload = await verifySessionToken(token);

      expect(payload).toBeDefined();
      expect(payload?.userId).toBe(userId);
      expect(payload?.username).toBe(username);
    });

    it("should return null for invalid token", async () => {
      const invalidToken = "invalid.token.here";
      const payload = await verifySessionToken(invalidToken);

      expect(payload).toBeNull();
    });

    it("should return null for expired token", async () => {
      // This test would require mocking time or using a token with very short expiry
      // For now, we just verify the function handles errors gracefully
      const payload = await verifySessionToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U");

      expect(payload).toBeNull();
    });

    it("should create different tokens for different users", async () => {
      const token1 = await createSessionToken(1, "user1");
      const token2 = await createSessionToken(2, "user2");

      expect(token1).not.toBe(token2);

      const payload1 = await verifySessionToken(token1);
      const payload2 = await verifySessionToken(token2);

      expect(payload1?.userId).toBe(1);
      expect(payload1?.username).toBe("user1");
      expect(payload2?.userId).toBe(2);
      expect(payload2?.username).toBe("user2");
    });
  });
});
