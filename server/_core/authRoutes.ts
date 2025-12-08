import type { Express, Request, Response } from "express";
import { authService } from "./authService";

export function registerAuthRoutes(app: Express) {
  /**
   * POST /api/auth/login
   * Login with username and password
   */
  app.post("/api/auth/login", async (req: Request, res: Response) => {
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
          role: user.role,
        },
      });
    } catch (error) {
      console.error("[Auth] Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  /**
   * POST /api/auth/logout
   * Logout the current user
   */
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    try {
      authService.logout(res);
      res.json({ success: true });
    } catch (error) {
      console.error("[Auth] Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  /**
   * GET /api/auth/me
   * Get current user info
   */
  app.get("/api/auth/me", async (req: Request, res: Response) => {
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
        role: user.role,
      });
    } catch (error) {
      console.error("[Auth] Get user error:", error);
      res.status(500).json({ error: "Failed to get user info" });
    }
  });
}
