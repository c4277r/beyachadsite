import "dotenv/config";
import { defineConfig } from "prisma/config";

// MongoDB has no relational migration history, so schema changes are
// applied with `npm run prisma:push` (prisma db push) instead of
// `prisma migrate`. There is intentionally no `migrations` config here.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
