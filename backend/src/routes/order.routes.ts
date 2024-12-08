import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

export const createOrderRouter = (
  controller: OrderController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  // Protected routes - require authentication
  router.use(authMiddleware.verifyToken);

  // User routes
  router.post("/", controller.createOrder.bind(controller));
  router.get("/my-orders", controller.getUserOrders.bind(controller));
  router.get("/:id", controller.getOrder.bind(controller));

  // Seller/Admin routes
  router.get(
    "/shop/:shopId",
    authMiddleware.checkRole([Role.SELLER, Role.ADMIN]),
    controller.getShopOrders.bind(controller)
  );

  router.put(
    "/:id/status",
    authMiddleware.checkRole([Role.SELLER, Role.ADMIN]),
    controller.updateOrderStatus.bind(controller)
  );

  // Admin only routes
  router.get(
    "/date-range",
    authMiddleware.checkRole([Role.ADMIN]),
    controller.getOrdersByDateRange.bind(controller)
  );

  router.put(
    "/:id/payment-status",
    authMiddleware.checkRole([Role.ADMIN]),
    controller.updatePaymentStatus.bind(controller)
  );

  return router;
};
