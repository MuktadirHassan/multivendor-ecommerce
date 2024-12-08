import { Router } from "express";
import { TrackingController } from "../controllers/tracking.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

export const createTrackingRouter = (
  controller: TrackingController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  router.get(
    "/order/:orderId",
    authMiddleware.verifyToken,
    controller.getTrackingByOrder
  );

  router.post(
    "/order/:orderId",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN, Role.SELLER]),
    controller.createTracking
  );

  router.put(
    "/:id",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN, Role.SELLER]),
    controller.updateTracking
  );

  router.patch(
    "/:id/status",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN, Role.SELLER]),
    controller.updateStatus
  );

  router.post(
    "/:id/updates",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN, Role.SELLER]),
    controller.addUpdate
  );

  router.delete(
    "/:id",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN]),
    controller.deleteTracking
  );

  return router;
};
