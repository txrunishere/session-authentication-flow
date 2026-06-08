import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production"]),
  FRONTEND_URL: z.url(),
  DATABASE_URL: z.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Error parsing environment variables:", result.error.issues);
  process.exit(1);
}

export const env = result.data;
