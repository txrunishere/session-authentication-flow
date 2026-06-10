import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(8).max(72),
  })
  .required();

export const loginSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8).max(72),
  })
  .required();
