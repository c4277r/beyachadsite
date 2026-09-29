import { ApiError } from "../middleware/errorHandler.js";

export const ADMIN_PAGE_SIZE = 20;

export function parsePage(value: unknown): number {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    throw new ApiError(400, "מספר עמוד לא תקין");
  }

  const page = Number(value);
  if (!Number.isSafeInteger(page)) {
    throw new ApiError(400, "מספר עמוד לא תקין");
  }

  return page;
}