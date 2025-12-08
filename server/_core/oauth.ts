import type { Express } from "express";

/**
 * OAuth routes are disabled in favor of password-based authentication
 * This file is kept for compatibility but doesn't register any routes
 */
export function registerOAuthRoutes(app: Express) {
  // OAuth routes disabled - using password-based authentication instead
  // See server/_core/authRoutes.ts for authentication endpoints
}
