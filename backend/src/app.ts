import express from "express";
import morgan from "morgan";

import { db } from "./config/database";
import { AuthController } from "./controllers/auth.controller";
import { CategoryController } from "./controllers/category.controller";
import { ProductController } from "./controllers/product.controller";
import { ReviewController } from "./controllers/review.controller";
import { ShopController } from "./controllers/shop.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { AuthRepository } from "./repositories/auth.repository";
import { CategoryRepository } from "./repositories/category.repository";
import { ProductRepository } from "./repositories/product.repository";
import { ReviewRepository } from "./repositories/review.repository";
import { ShopRepository } from "./repositories/shop.repository";
import { UserRepository } from "./repositories/user.repository";
import { createAuthRouter } from "./routes/auth.routes";
import { createCategoryRouter } from "./routes/category.routes";
import { createProductRouter } from "./routes/product.routes";
import { createReviewRouter } from "./routes/review.routes";
import { createShopRouter } from "./routes/shop.routes";
import { AuthService } from "./services/auth.service";
import { CategoryService } from "./services/category.service";
import { ProductService } from "./services/product.service";
import { ReviewService } from "./services/review.service";
import { ShopService } from "./services/shop.service";
import { handleGlobalError } from "./utils/Error";

const userRepository = new UserRepository(db);
const authRepository = new AuthRepository(db, userRepository);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(authService);

const productRepository = new ProductRepository(db);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const shopRepository = new ShopRepository(db);
const shopService = new ShopService(shopRepository, userRepository);
const shopController = new ShopController(shopService);

const categoryRepository = new CategoryRepository(db);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const reviewRepository = new ReviewRepository(db);
const reviewService = new ReviewService(
  reviewRepository,
  productRepository,
  shopRepository
);
const reviewController = new ReviewController(reviewService);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/auth", createAuthRouter(authController, authMiddleware));
app.use("/products", createProductRouter(productController, authMiddleware));
app.use("/shops", createShopRouter(shopController, authMiddleware));
app.use(
  "/categories",
  createCategoryRouter(categoryController, authMiddleware)
);
app.use("/reviews", createReviewRouter(reviewController, authMiddleware));

app.use(handleGlobalError);

export default app;
