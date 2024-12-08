import { Router } from "express";
import { upload } from "../config/multer";
import { CategoryController } from "../controllers/category.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

export const createCategoryRouter = (
  controller: CategoryController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  // Public routes
  router.get("/", controller.getAllCategories.bind(controller));
  router.get("/:id", controller.getCategoryById.bind(controller));
  router.get(
    "/:id/subcategories",
    controller.getSubcategories.bind(controller)
  );

  // Protected admin routes
  router.post(
    "/",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN]),
    upload.single("image"),
    controller.createCategory.bind(controller)
  );

  router.put(
    "/:id",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN]),
    upload.single("image"),
    controller.updateCategory.bind(controller)
  );

  router.delete(
    "/:id",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN]),
    controller.deleteCategory.bind(controller)
  );

  return router;
};
