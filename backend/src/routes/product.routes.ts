import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth";
import multer from "multer";

const router = Router();
const productController = new ProductController();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  authenticate,
  upload.array("images", 5),
  productController.createProduct
);

router.put(
  "/:id",
  authenticate,
  upload.array("images", 5),
  productController.updateProduct
);

router.get("/:id", productController.getProduct);
router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.delete("/:id", authenticate, productController.deleteProduct);
router.patch("/:id/stock", authenticate, productController.updateStock);

export default router;
