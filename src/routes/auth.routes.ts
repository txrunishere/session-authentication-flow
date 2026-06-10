import { Router } from "express";
import {
  handleLogout,
  handleLogoutAll,
  handleRefreshToken,
  handleUserLogin,
  handleUserMe,
  handleUserRegister,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate-middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();

/**
 * method: POST
 * path: /api/v1/auth/register
 */
router.post("/register", validate(registerSchema), handleUserRegister);

/**
 * method: POST
 * path: /api/v1/auth/login
 */
router.get("/login", validate(loginSchema), handleUserLogin);

/**
 * method: GET
 * path: /api/v1/auth/me
 */
router.get("/me", handleUserMe);

/**
 * method: GET
 * path: "/api/v1/auth/refresh-token"
 */
router.get("/refresh-token", handleRefreshToken);

/**
 * method: POST
 * path: "/api/v1/auth/logout"
 */
router.post("/logout", handleLogout);

/**
 * method: POST
 * path: "/api/v1/auth/logout-all"
 */
router.post("/logout-all", handleLogoutAll);

export default router;
