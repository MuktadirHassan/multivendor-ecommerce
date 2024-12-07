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
import { createRouter } from "./routes/product.routes";
import { ProductController } from "./controllers/product.controller";
import { ProductRepository } from "./repositories/product.repository";
import { ProductService } from "./services/product.service";
import { db } from "./config/database";

const userRepository = new UserRepository(db);
const authRepository = new AuthRepository(db, userRepository);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(authService);

const productRepository = new ProductRepository(db);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/auth", createAuthRouter(authController, authMiddleware));
app.use("/products", createRouter(productController, authMiddleware));

app.use(handleGlobalError);

export default app;
