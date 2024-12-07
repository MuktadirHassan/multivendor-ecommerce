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

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma, userRepository);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(authService);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/auth", createAuthRouter(authController, authMiddleware));

app.use(handleGlobalError);

export default app;
