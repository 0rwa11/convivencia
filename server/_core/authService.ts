import type { Request, Response } from "express";
import { getSessionCookie, verifySessionToken, createSessionToken, comparePassword } from "../auth";
import * as db from "../db";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "../../shared/const";

/**
 * Authentication service for password-based authentication
 */
export class AuthService {
  /**
   * Authenticate a request by verifying the session cookie
   */
  async authenticateRequest(req: Request): Promise<User | null> {
    try {
      const token = getSessionCookie(req.headers.cookie);
      if (!token) {
        return null;
      }

      const payload = await verifySessionToken(token);
      if (!payload) {
        return null;
      }

      const user = await db.getUserById(payload.userId);
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
  async login(username: string, password: string, res: Response): Promise<User | null> {
    try {
      const user = await db.getUserByUsername(username);
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

      // Update last signed in
      await db.updateUserLastSignedIn(user.id);

      // Create session token
      const token = await createSessionToken(user.id, user.username);

      // Set session cookie
      const isProduction = process.env.NODE_ENV === "production";
      const sameSite = isProduction ? "strict" : "lax";
      const secure = isProduction;

      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
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
  logout(res: Response): void {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
    });
  }

  /**
   * Create a new user (admin only)
   */
  async createUser(
    username: string,
    password: string,
    name: string,
    email?: string,
    role: "user" | "admin" | "facilitator" = "user"
  ): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await db.getUserByUsername(username);
      if (existingUser) {
        throw new Error("Username already exists");
      }

      const { hashPassword } = await import("../auth");
      const passwordHash = await hashPassword(password);

      await db.createUser({
        username,
        passwordHash,
        name: name || username,
        email: email || null,
        role,
        isActive: true,
      });

      const user = await db.getUserByUsername(username);
      if (!user) {
        throw new Error("Failed to create user");
      }

      return user;
    } catch (error) {
      console.error("[Auth] Failed to create user:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
