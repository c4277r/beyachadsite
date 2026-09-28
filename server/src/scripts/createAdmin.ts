import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { createUserSchema } from "../utils/validation.js";

async function createAdmin() {
  if (
    process.env.ADMIN_EMAIL === "admin@example.com" ||
    process.env.ADMIN_PASSWORD === "replace-with-a-unique-password-at-least-8-characters"
  ) {
    throw new Error("Replace the sample admin email and password in .env before creating an account.");
  }

  const parsed = createUserSchema.safeParse({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME,
    role: "ADMIN",
  });

  if (!parsed.success) {
    throw new Error(`Invalid admin setup values: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
  }

  const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) {
    throw new Error("A user with this email already exists; refusing to change its role or password.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      name: parsed.data.name,
      role: "ADMIN",
    },
  });

  console.info(`Admin account created for ${parsed.data.email}.`);
}

createAdmin()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Admin account creation failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
