import crypto from "crypto";
import ms from "ms";
import { env } from "../../config/env.config.js";
import { Response } from "express";

export const hashRefreshToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const sendCookies = (res: Response, refreshToken: string) => {
  const refreshTokenMaxAge = ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue);

  if (typeof refreshTokenMaxAge !== "number") {
    throw new Error("Invalid refresh token expiry configuration");
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: refreshTokenMaxAge,
  });
};

export const clearCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
