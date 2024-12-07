import { Router } from "express";
import { upload } from "../config/multer";
import { ProductController } from "../controllers/product.controller";
import { Role } from "@prisma/client";
import { AuthMiddleware } from "../middleware/auth.middleware";

export const productRouter = Router();

export const createRouter = (
  productController: ProductController,
  authMiddleware: AuthMiddleware
) => {
  // Public routes
  productRouter.get("/", productController.getProducts.bind(productController));
  productRouter.get(
    "/search",
    productController.searchProducts.bind(productController)
  );
  productRouter.get(
    "/featured",
    productController.getFeaturedProducts.bind(productController)
  );
  productRouter.get(
    "/category/:categoryId",
    productController.getProductsByCategory.bind(productController)
  );
  productRouter.get(
    "/shop/:shopId",
    productController.getProductsByShop.bind(productController)
  );
  productRouter.get(
    "/:id",
    productController.getProduct.bind(productController)
  );

  // Protected routes
  productRouter.use(authMiddleware.verifyToken);
  productRouter.post(
    "/",
    authMiddleware.checkRole([Role.SELLER, Role.ADMIN]),
    upload.array("images", 5),
    productController.createProduct.bind(productController)
  );
  productRouter.patch(
    "/:id",
    authMiddleware.checkRole([Role.SELLER, Role.ADMIN]),
    upload.array("images", 5),
    productController.updateProduct.bind(productController)
  );
  productRouter.delete(
    "/:id",
    authMiddleware.checkRole([Role.SELLER, Role.ADMIN]),
    productController.deleteProduct.bind(productController)
  );

  return productRouter;
};
