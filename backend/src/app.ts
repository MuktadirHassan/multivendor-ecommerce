import express from "express";
import morgan from "morgan";

import { db } from "./config/database";
import { AddressController } from "./controllers/address.controller";
import { AuthController } from "./controllers/auth.controller";
import { CategoryController } from "./controllers/category.controller";
import { OrderController } from "./controllers/order.controller";
import { ProductController } from "./controllers/product.controller";
import { ReviewController } from "./controllers/review.controller";
import { ShopController } from "./controllers/shop.controller";
import { TrackingController } from "./controllers/tracking.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { AddressRepository } from "./repositories/address.repository";
import { AuthRepository } from "./repositories/auth.repository";
import { CategoryRepository } from "./repositories/category.repository";
import { OrderRepository } from "./repositories/order.repository";
import { ProductRepository } from "./repositories/product.repository";
import { ReviewRepository } from "./repositories/review.repository";
import { ShopRepository } from "./repositories/shop.repository";
import { TrackingRepository } from "./repositories/tracking.repository";
import { UserRepository } from "./repositories/user.repository";
import { createAddressRouter } from "./routes/address.routes";
import { createAuthRouter } from "./routes/auth.routes";
import { createCategoryRouter } from "./routes/category.routes";
import { createOrderRouter } from "./routes/order.routes";
import { createProductRouter } from "./routes/product.routes";
import { createReviewRouter } from "./routes/review.routes";
import { createShopRouter } from "./routes/shop.routes";
import { createTrackingRouter } from "./routes/tracking.routes";
import { AddressService } from "./services/address.service";
import { AuthService } from "./services/auth.service";
import { CategoryService } from "./services/category.service";
import { OrderService } from "./services/order.service";
import { ProductService } from "./services/product.service";
import { ReviewService } from "./services/review.service";
import { ShopService } from "./services/shop.service";
import { TrackingService } from "./services/tracking.service";
import { handleGlobalError } from "./utils/Error";
import { GeminiService } from "./services/gemini.service";
import { SearchService } from "./services/ai-search.service";
import { SearchController } from "./controllers/ai-search.controller";
import { createSearchRouter } from "./routes/ai-search.routes";

const userRepository = new UserRepository(db);
const authRepository = new AuthRepository(db, userRepository);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(authService);

const productRepository = new ProductRepository(db);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const orderRepository = new OrderRepository(db);
const orderService = new OrderService(orderRepository, productRepository);
const orderController = new OrderController(orderService);

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

const addressRepository = new AddressRepository(db);
const addressService = new AddressService(addressRepository);
const addressController = new AddressController(addressService);

const trackingRepository = new TrackingRepository(db);
const trackingService = new TrackingService(trackingRepository);
const trackingController = new TrackingController(trackingService);

const geminiService = new GeminiService(process.env.GEMINI_API_KEY!);
const searchService = new SearchService(
  geminiService,
  productRepository,
  orderRepository
);
const searchController = new SearchController(searchService);

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
app.use("/addresses", createAddressRouter(addressController, authMiddleware));
app.use("/orders", createOrderRouter(orderController, authMiddleware));
app.use("/tracking", createTrackingRouter(trackingController, authMiddleware));
app.use("/search", createSearchRouter(searchController, authMiddleware));

app.use(handleGlobalError);

export default app;
