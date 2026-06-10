import { Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { AppResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/auth/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/auth/jwt.js";
import {
  clearCookie,
  hashRefreshToken,
  sendCookies,
} from "../utils/auth/auth.helper.js";
import { Session } from "../models/session.model.js";

const handleUserRegister = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new AppError("User already exists!", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const refreshToken = signRefreshToken({
    userId: user._id,
  });

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Session.create({
    user: user._id,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    refreshTokenHash: refreshTokenHash,
  });

  const accessToken = signAccessToken({
    userId: user._id,
    sessionId: session._id,
  });

  sendCookies(res, refreshToken);

  return AppResponse(res, 200, {
    message: "User register successfully!",
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
    },
  });
});

const handleUserLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.verified) {
    throw new AppError("Email not verified", 401);
  }

  const isPasswordValid = await comparePassword(user.password, password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const refreshToken = signRefreshToken({
    userId: user._id,
  });

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Session.create({
    user: user._id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    refreshTokenHash,
  });

  const accessToken = signAccessToken({
    userId: user._id,
    sessionId: session._id,
  });

  sendCookies(res, refreshToken);

  return AppResponse(res, 200, {
    message: "Logged in successfully",
    success: true,
    data: {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
    },
  });
});

const handleUserMe = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Token not found", 401);
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return AppResponse(res, 200, {
    message: "User fetched successfully",
    success: true,
    data: {
      user,
    },
  });
});

const handleRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    throw new AppError("Refresh token not found", 401);
  }

  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Session.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (session.user !== user._id) {
    throw new AppError("Invalid session", 401);
  }

  const accessToken = signAccessToken({
    userId: decoded.userId,
    sessionId: session._id,
  });

  const newRefreshToken = signRefreshToken({
    userId: decoded.userId,
  });

  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  sendCookies(res, newRefreshToken);

  return AppResponse(res, 200, {
    message: "Access token refreshed successfully",
    success: true,
    data: {
      accessToken,
    },
  });
});

const handleLogout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    throw new AppError("Refresh token not found", 401);
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Session.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    throw new AppError("Invalid refresh token", 401);
  }

  session.revoked = true;
  await session.save();

  clearCookie(res);

  return AppResponse(res, 200, {
    message: "User logged out successfully",
    success: true,
  });
});

const handleLogoutAll = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    throw new AppError("Refresh token not found", 401);
  }

  const decoded = verifyRefreshToken(refreshToken);

  await Session.updateMany(
    {
      user: decoded.userId,
      revoked: false,
    },
    {
      revoked: true,
    },
  );

  clearCookie(res);

  return AppResponse(res, 200, {
    message: "User logged out successfully from all sessions",
    success: true,
  });
});

export {
  handleUserRegister,
  handleUserLogin,
  handleUserMe,
  handleRefreshToken,
  handleLogout,
  handleLogoutAll,
};
