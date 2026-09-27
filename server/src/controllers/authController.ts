import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { LoginInput } from "../utils/validation.js";
import { ApiError, asyncHandler } from "../middleware/errorHandler.js";
import { signAuthToken } from "../middleware/auth.js";

// =====================================================
// Admin Login
// =====================================================
// Public endpoint - rate limited (see routes/authRoutes.ts).
// Returns a JWT to be sent as "Authorization: Bearer <token>" on
// admin-only requests.

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginInput = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  // Use one generic message for both "no such user" and "wrong password"
  // so the response doesn't reveal which emails are registered.
  const invalidCredentialsError = new ApiError(401, "אימייל או סיסמה שגויים");

  if (!user || !user.isActive) {
    throw invalidCredentialsError;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw invalidCredentialsError;
  }

  const token = signAuthToken({ sub: user.id, role: user.role });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
  });
});
