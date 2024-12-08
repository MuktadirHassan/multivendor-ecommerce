import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { SearchController } from "../controllers/ai-search.controller";

export const createSearchRouter = (
  controller: SearchController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  router.get("/", controller.search);
  router.get(
    "/recommendations",
    authMiddleware.verifyToken,
    controller.getRecommendations
  );

  return router;
};
