import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../drizzle/schema";
import { ENV } from "./_core/env";

const SALT_ROUNDS = 10;
const JWT_EXPIRY = "7d";
const COOKIE_NAME = "session";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT session token
 */
export async function createSessionToken(userId: number, username: string): Promise<string> {
  const secret = new TextEncoder().encode(ENV.jwtSecret);
  
  const token = await new SignJWT({
    userId,
    username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRY)
    .sign(secret);

  return token;
}

/**
 * Verify a JWT session token
 */
export async function verifySessionToken(token: string): Promise<{ userId: number; username: string } | null> {
  try {
    const secret = new TextEncoder().encode(ENV.jwtSecret);
    const verified = await jwtVerify(token, secret);
    
    return {
      userId: verified.payload.userId as number,
      username: verified.payload.username as string,
    };
  } catch (error) {
    console.error("[Auth] Failed to verify session token:", error);
    return null;
  }
}

/**
 * Extract session token from cookies
 */
export function getSessionCookie(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${COOKIE_NAME}=`)) {
      return cookie.substring(COOKIE_NAME.length + 1);
    }
  }
  return null;
}

/**
 * Create a session cookie header
 */
export function createSessionCookieHeader(token: string, secure: boolean = true): string {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? "Strict" : "Lax";
  
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=${sameSite}${secure ? "; Secure" : ""}; Max-Age=${7 * 24 * 60 * 60}`;
}

/**
 * Create a logout cookie header (empty cookie)
 */
export function createLogoutCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0`;
}
