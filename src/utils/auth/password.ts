import bcrypt from "bcrypt";
import { env } from "../../config/env.config.js";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, env.SALT_ROUNDS);
};

export const comparePassword = async (encrypted: string, password: string) => {
  return await bcrypt.compare(password, encrypted);
};
