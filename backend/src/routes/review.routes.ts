import { Router } from "express";
import { upload } from "../config/multer";
import { ReviewController } from "../controllers/review.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

export const createReviewRouter = (
  controller: ReviewController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  // Public routes
  router.get("/", controller.getReviews.bind(controller));
  router.get("/:id", controller.getReview.bind(controller));
  router.get(
    "/product/:productId",
    controller.getProductReviews.bind(controller)
  );
  router.get("/shop/:shopId", controller.getShopReviews.bind(controller));

  // Protected user routes
  router.post(
    "/",
    authMiddleware.verifyToken,
    upload.array("images", 5),
    controller.createReview.bind(controller)
  );

  router.put(
    "/:id",
    authMiddleware.verifyToken,
    upload.array("images", 5),
    controller.updateReview.bind(controller)
  );

  router.delete(
    "/:id",
    authMiddleware.verifyToken,
    controller.deleteReview.bind(controller)
  );

  return router;
};
