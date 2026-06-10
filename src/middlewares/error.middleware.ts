import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.config.js";

export const globalErrorHandler = (
  err: Error & {
    isOperational: boolean;
    status: string;
    statusCode: number;
  },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error = { ...err };

  error.message = err.message;
  error.status = err.status || "error";
  error.statusCode = err.statusCode || 500;

  if (env.NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: err.stack,
      error,
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
