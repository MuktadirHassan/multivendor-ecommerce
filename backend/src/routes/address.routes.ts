import { Router } from "express";
import { AddressController } from "../controllers/address.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export const createAddressRouter = (
  controller: AddressController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  // All routes require authentication
  router.use(authMiddleware.verifyToken);

  // Routes
  router.get("/", controller.getAllAddresses.bind(controller));
  router.get("/default", controller.getDefaultAddress.bind(controller));
  router.get("/:id", controller.getAddressById.bind(controller));
  router.post("/", controller.createAddress.bind(controller));
  router.put("/:id", controller.updateAddress.bind(controller));
  router.delete("/:id", controller.deleteAddress.bind(controller));
  router.patch("/:id/default", controller.setDefaultAddress.bind(controller));

  return router;
};
