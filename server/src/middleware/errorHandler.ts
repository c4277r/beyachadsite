import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

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

/** Turns a ZodError into a small, safe-to-expose {field, message}[] list. */
function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || undefined,
    message: issue.message,
  }));
}

// =====================================================
// Validation Middleware
// =====================================================
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ApiError(400, "נתונים לא תקינים", formatZodError(result.error)));
    }
    req.body = result.data;
    next();
  };
};

// =====================================================
// Global Error Handler
// =====================================================
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Full error (with stack trace) is only ever logged server-side, never
  // sent to the client, so internal details (DB errors, stack traces,
  // provider responses, etc.) never leak to public callers.
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      // `details` is only ever populated with pre-sanitized data (e.g.
      // formatZodError output), never raw driver/provider errors.
      details: err.details,
    });
  }

  res.status(500).json({
    success: false,
    message: "שגיאה בשרת, אנא נסה שוב מאוחר יותר",
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
