import { Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { AppResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const handleUserRegister = asyncHandler(
  async (req: Request, res: Response) => {},
);

export { handleUserRegister };
