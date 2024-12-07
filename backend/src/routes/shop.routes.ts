import { Router } from "express";
import { ShopController } from "../controllers/shop.controller";
import { Role } from "@prisma/client";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { upload } from "../config/multer";

export const createShopRouter = (
  shopController: ShopController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  router.post(
    "/",
    authMiddleware.verifyToken,
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ]),
    shopController.createShop.bind(shopController)
  );

  router.put(
    "/:id",
    authMiddleware.verifyToken,
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ]),
    shopController.updateShop.bind(shopController)
  );

  router.post(
    "/:id/verify",
    authMiddleware.verifyToken,
    authMiddleware.checkRole([Role.ADMIN]),
    shopController.verifyShop.bind(shopController)
  );

  router.delete(
    "/:id",
    authMiddleware.verifyToken,
    shopController.deleteShop.bind(shopController)
  );

  router.get("/:id", shopController.getShop);
  router.get("/", shopController.getShops);
  router.get("/top", shopController.getTopShops.bind(shopController));

  return router;
};
