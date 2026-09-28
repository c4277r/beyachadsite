import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler.js";

// =====================================================
// JWT Auth Middleware
// =====================================================
// Protects admin-only routes. Expects "Authorization: Bearer <token>".
// Tokens are issued by POST /api/auth/login (see authController.ts).

export interface AuthPayload {
  sub: string; // user id
  role: "ADMIN" | "EDITOR";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Fail loudly on boot/first use rather than silently signing with an
    // empty/guessable secret.
    throw new Error("JWT_SECRET is not configured");
  }
  if (process.env.NODE_ENV === "production" && secret.length < 64) {
    throw new Error("Production JWT_SECRET must contain at least 64 characters");
  }
  return secret;
}

export function signAuthToken(payload: AuthPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "12h" });
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "נדרשת התחברות"));
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, getJwtSecret()) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    next(new ApiError(401, "התחברות לא תקינה או שפגה תוקפה"));
  }
};

export const requireRole = (...roles: Array<"ADMIN" | "EDITOR">) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "נדרשת התחברות"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "אין הרשאה לפעולה זו"));
    }
    next();
  };
};
