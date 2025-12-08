/**
 * SDK Server - Disabled for password-based authentication
 * This file is kept for compatibility but the OAuth functionality is disabled
 * See server/_core/authService.ts for the new authentication implementation
 */

export const sdk = {
  // Placeholder methods for compatibility
  authenticateRequest: async () => null,
  exchangeCodeForToken: async () => ({}),
  getUserInfo: async () => ({}),
  createSessionToken: async () => "",
};
