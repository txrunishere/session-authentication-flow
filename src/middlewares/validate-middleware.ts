import { NextFunction, Request, Response } from "express";
import z from "zod";
import { AppError } from "../utils/app-error.js";

export const validate = (schema: z.ZodType<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsedData = schema.safeParse(req.body);

    if (!parsedData.success) {
      const errors = parsedData.error.issues.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }));

      throw new AppError(
        errors.map((e) => `${e.field}: ${e.message}`).join(", "),
        400,
      );
    }

    req.body = parsedData.data;
    next();
  };
};
