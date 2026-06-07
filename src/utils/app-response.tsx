import type { Response } from "express";

type ResponsePayload<T> = {
  message: string,
  success: boolean,
  data?: T
}

export function AppResponse<T>(res: Response, statusCode: number, payload: ResponsePayload<T>) {
  return res.status(statusCode).json(payload)
}