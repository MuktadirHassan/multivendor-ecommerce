import { Request, Response } from "express";
import { ShopService } from "../services/shop.service";
import { Role } from "@prisma/client";
import { AuthorizationError, ValidationError } from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import sendApiResponse from "../utils/sendApiResponse";

interface ShopQueryParams {
  verified?: string;
  rating?: string;
  page?: string;
  limit?: string;
}

export class ShopController {
  constructor(private shopService: ShopService) {}

  createShop = catchAsync(async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name?.trim()) {
      throw new ValidationError("Shop name is required");
    }
    if (!description?.trim()) {
      throw new ValidationError("Shop description is required");
    }
    if (name.length < 3 || name.length > 100) {
      throw new ValidationError(
        "Shop name must be between 3 and 100 characters"
      );
    }
    if (description.length > 1000) {
      throw new ValidationError("Description cannot exceed 1000 characters");
    }

    const shop = await this.shopService.createShop({
      name: name.trim(),
      description: description.trim(),
      sellerId: req.user!.userId,
      // @ts-ignore
      logo: req.files?.logo?.[0],
      // @ts-ignore
      banner: req.files?.banner?.[0],
    });

    sendApiResponse(res, 201, "Shop created successfully", shop);
  });

  updateShop = catchAsync(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const shopId = parseInt(req.params.id as string);

    if (isNaN(shopId)) {
      throw new ValidationError("Invalid shop ID");
    }

    if (name && (name.length < 3 || name.length > 100)) {
      throw new ValidationError(
        "Shop name must be between 3 and 100 characters"
      );
    }
    if (description && description.length > 1000) {
      throw new ValidationError("Description cannot exceed 1000 characters");
    }

    const updateData = {
      ...(name && { name: name.trim() }),
      ...(description && { description: description.trim() }),
      // @ts-ignore
      logo: req.files?.logo?.[0],
      // @ts-ignore
      banner: req.files?.banner?.[0],
    };

    const shop = await this.shopService.updateShop(
      shopId,
      req.user!.userId,
      updateData
    );

    sendApiResponse(res, 200, "Shop updated successfully", shop);
  });

  verifyShop = catchAsync(async (req: Request, res: Response) => {
    const shopId = parseInt(req.params.id as string);

    if (isNaN(shopId)) {
      throw new ValidationError("Invalid shop ID");
    }

    if (req.user!.role !== Role.ADMIN) {
      throw new AuthorizationError("Only admins can verify shops");
    }

    const shop = await this.shopService.verifyShop(shopId, req.user!.userId);
    sendApiResponse(res, 200, "Shop verified successfully", shop);
  });

  deleteShop = catchAsync(async (req: Request, res: Response) => {
    const shopId = parseInt(req.params.id as string);

    if (isNaN(shopId)) {
      throw new ValidationError("Invalid shop ID");
    }

    await this.shopService.deleteShop(shopId, req.user!.userId);
    sendApiResponse(res, 204, "Shop deleted successfully");
  });

  getShop = catchAsync(async (req: Request, res: Response) => {
    const shopId = parseInt(req.params.id as string);

    if (isNaN(shopId)) {
      throw new ValidationError("Invalid shop ID");
    }

    const shop = await this.shopService.getShop(shopId);
    sendApiResponse(res, 200, "Shop retrieved successfully", shop);
  });

  getShops = catchAsync(
    async (req: Request<{}, {}, {}, ShopQueryParams>, res: Response) => {
      const { verified, rating, page, limit } = req.query;

      const filters = {
        isVerified: verified === "true",
        rating: rating ? this.validateRating(rating) : undefined,
        page: page ? this.validatePagination(page, "page") : undefined,
        limit: limit ? this.validatePagination(limit, "limit") : undefined,
      };

      const shops = await this.shopService.getShops(filters);
      sendApiResponse(res, 200, "Shops retrieved successfully", shops);
    }
  );

  getTopShops = catchAsync(
    async (req: Request<{}, {}, {}, { limit?: string }>, res: Response) => {
      const { limit } = req.query;
      const parsedLimit = limit
        ? this.validatePagination(limit, "limit", 50)
        : 10;

      const shops = await this.shopService.getTopShops(parsedLimit);
      sendApiResponse(res, 200, "Top shops retrieved successfully", shops);
    }
  );

  private validateRating(rating: string): number {
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      throw new ValidationError("Rating must be a number between 0 and 5");
    }
    return parsedRating;
  }

  private validatePagination(
    value: string,
    field: string,
    max: number = 100
  ): number {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue) || parsedValue < 1) {
      throw new ValidationError(`Invalid ${field}: must be a positive number`);
    }
    if (parsedValue > max) {
      throw new ValidationError(`${field} cannot exceed ${max}`);
    }
    return parsedValue;
  }
}
