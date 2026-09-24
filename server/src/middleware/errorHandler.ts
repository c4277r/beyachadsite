import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// =====================================================
// Custom Error Class
// =====================================================
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// =====================================================
// Validation Middleware
// =====================================================
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      next(new ApiError(400, "נתונים לא תקינים", error));
    }
  };
};

// =====================================================
// Global Error Handler
// =====================================================
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[ERROR]", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  res.status(500).json({
    success: false,
    message: "שגיאה בשרת",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

// =====================================================
// Async Route Wrapper (catches async errors)
// =====================================================
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
