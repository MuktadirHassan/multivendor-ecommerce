import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { uploadImage } from "../utils/imageUpload";
import { ProductFilters } from "../types/filters";
import { Role } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import { ValidationError } from "../utils/appError";
import sendApiResponse from "../utils/sendApiResponse";

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  getProducts = catchAsync(async (req: Request, res: Response) => {
    const filters = req.query as unknown as ProductFilters;
    const products = await this.productService.findWithFilters(filters);
    sendApiResponse(res, 200, "Products retrieved successfully", products);
  });

  getProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.findById(Number(id));
    sendApiResponse(res, 200, "Product retrieved successfully", product);
  });

  createProduct = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const userId = req.user!.userId;
    const role = req.user!.role;

    if (!files?.length) {
      throw new ValidationError("At least one image is required");
    }

    if (
      !req.body.name ||
      !req.body.price ||
      !req.body.stock ||
      !req.body.categoryId ||
      !req.body.shopId
    ) {
      throw new ValidationError("Missing required fields");
    }

    // Upload images
    const imageUrls = await Promise.all(files.map((file) => uploadImage(file)));

    const productData = {
      ...req.body,
      images: imageUrls,
      sellerId: userId,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      categoryId: Number(req.body.categoryId),
      shopId: Number(req.body.shopId),
    };

    // Verify shop ownership
    if (role !== Role.ADMIN) {
      const shop = await this.productService.verifyShopOwnership(
        productData.shopId,
        userId
      );
      if (!shop) {
        throw new ValidationError(
          "Unauthorized to create product for this shop"
        );
      }
    }

    const product = await this.productService.create(productData);
    sendApiResponse(res, 201, "Product created successfully", product);
  });

  updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];
    const userId = req.user!.userId;
    const role = req.user!.role;

    // Upload new images if provided
    let imageUrls: string[] = [];
    if (files?.length) {
      imageUrls = await Promise.all(files.map((file) => uploadImage(file)));
    }

    const productData = {
      ...req.body,
      ...(imageUrls.length && { images: imageUrls }),
      ...(req.body.price && { price: Number(req.body.price) }),
      ...(req.body.stock && { stock: Number(req.body.stock) }),
      ...(req.body.categoryId && { categoryId: Number(req.body.categoryId) }),
    };

    // Verify product ownership
    if (role !== Role.ADMIN) {
      const canUpdate = await this.productService.verifyProductOwnership(
        Number(id),
        userId
      );
      if (!canUpdate) {
        throw new ValidationError("Unauthorized to update this product");
      }
    }

    const product = await this.productService.update(Number(id), productData);
    sendApiResponse(res, 200, "Product updated successfully", product);
  });

  deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const role = req.user!.role;

    // Verify product ownership
    if (role !== Role.ADMIN) {
      const canDelete = await this.productService.verifyProductOwnership(
        Number(id),
        userId
      );
      if (!canDelete) {
        throw new ValidationError("Unauthorized to delete this product");
      }
    }

    await this.productService.delete(Number(id));
    sendApiResponse(res, 204, "Product deleted successfully");
  });

  searchProducts = catchAsync(async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      throw new ValidationError("Search query is required");
    }
    const products = await this.productService.searchProducts(q);
    sendApiResponse(
      res,
      200,
      "Search results retrieved successfully",
      products
    );
  });

  getFeaturedProducts = catchAsync(async (req: Request, res: Response) => {
    const products = await this.productService.findFeatured();
    sendApiResponse(
      res,
      200,
      "Featured products retrieved successfully",
      products
    );
  });

  getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const products = await this.productService.findByCategory(
      Number(categoryId)
    );
    sendApiResponse(res, 200, "Products retrieved successfully", products);
  });

  getProductsByShop = catchAsync(async (req: Request, res: Response) => {
    const { shopId } = req.params;
    const products = await this.productService.findByShop(Number(shopId));
    sendApiResponse(res, 200, "Products retrieved successfully", products);
  });
}
