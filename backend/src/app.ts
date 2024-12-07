import express from "express";
import morgan from "morgan";

import { handleGlobalError } from "./utils/Error";
import { PrismaClient } from "@prisma/client";
import { AuthRepository } from "./repositories/auth.repository";
import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { createAuthRouter } from "./routes/auth.routes";
import { createProductRouter } from "./routes/product.routes";
import { ProductController } from "./controllers/product.controller";
import { ProductRepository } from "./repositories/product.repository";
import { ProductService } from "./services/product.service";
import { db } from "./config/database";
import { ShopRepository } from "./repositories/shop.repository";
import { ShopService } from "./services/shop.service";
import { ShopController } from "./controllers/shop.controller";
import { createShopRouter } from "./routes/shop.routes";

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

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/auth", createAuthRouter(authController, authMiddleware));
app.use("/products", createProductRouter(productController, authMiddleware));
app.use("/shops", createShopRouter(shopController, authMiddleware));

app.use(handleGlobalError);

export default app;
