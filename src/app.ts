import express from "express";
import morgan from "morgan";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.config.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/health-check", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

app.use(globalErrorHandler);

export default app;
