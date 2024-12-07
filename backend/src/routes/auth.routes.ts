import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

export const createAuthRouter = (
  authController: AuthController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  router.post("/register", authController.register.bind(authController));
  router.post("/login", authController.login.bind(authController));
  router.get(
    "/me",
    authMiddleware.verifyToken,
    authController.getCurrentUser.bind(authController)
  );

  // Example of role-based route
  router.get(
    "/admin",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN]),
    (req, res) => res.json({ message: "Admin access granted" })
  );

  return router;
};
