import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/postgres/product.repository";
import { CacheService } from "../services/cache.service";
import { EventEmitter } from "../utils/eventEmitter";
import {
  ValidationError,
  NotFoundError,
  AuthorizationError,
} from "../utils/appError";
import { ProductFilters } from "../types/filters";
import { db } from "../config/database";
import { GeminiService } from "../services/gemini.service";

export class ProductController {
  private readonly productService: ProductService;
  private readonly geminiService: GeminiService;
  constructor() {
    const productRepository = new ProductRepository(db);
    const cacheService = CacheService.getInstance();
    const eventEmitter = EventEmitter.getInstance();
    this.productService = new ProductService(
      productRepository,
      cacheService,
      eventEmitter
    );
    this.geminiService = new GeminiService(process.env.GEMINI_API_KEY!);
  }

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = req.user.id; // Assuming user is attached by auth middleware
      const files = req.files as Express.Multer.File[];

      const product = await this.productService.createProduct({
        ...req.body,
        sellerId,
        images: files,
      });

      res.status(201).json(product);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = req.user.id;
      const productId = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];

      const product = await this.productService.updateProduct(
        productId,
        {
          ...req.body,
          images: files,
        },
        sellerId
      );

      res.json(product);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productId = parseInt(req.params.id);
      const product = await this.productService.getProduct(productId);
      res.json(product);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = this.parseFilters(req.query);
      const products = await this.productService.getProducts(filters);
      res.json(products);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        throw new ValidationError("Search query is required");
      }

      const products = await this.productService.searchProducts(query);
      res.json(products);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  searchProductsAi = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        throw new ValidationError("Search query is required");
      }

      // Get all products with their categories
      const products = await this.productService.getProducts({});

      const productsAi = await this.geminiService.searchProducts(
        query,
        products
      );
      res.json(productsAi);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = req.user.id;
      const productId = parseInt(req.params.id);

      await this.productService.deleteProduct(productId, sellerId);
      res.status(204).end();
    } catch (error) {
      this.handleError(error, res);
    }
  };

  updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = req.user.id;
      const productId = parseInt(req.params.id);
      const { quantity } = req.body;

      if (typeof quantity !== "number") {
        throw new ValidationError("Quantity must be a number");
      }

      const product = await this.productService.updateStock(
        productId,
        quantity,
        sellerId
      );

      res.json(product);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private parseFilters(query: any): ProductFilters {
    const filters: ProductFilters = {};

    if (query.minPrice) filters.minPrice = parseFloat(query.minPrice);
    if (query.maxPrice) filters.maxPrice = parseFloat(query.maxPrice);
    if (query.categoryId) filters.categoryId = parseInt(query.categoryId);
    if (query.shopId) filters.shopId = parseInt(query.shopId);
    if (query.inStock) filters.inStock = query.inStock === "true";
    if (query.rating) filters.rating = parseFloat(query.rating);
    if (query.sortBy) filters.sortBy = query.sortBy as ProductFilters["sortBy"];
    if (query.sortOrder) filters.sortOrder = query.sortOrder as "asc" | "desc";
    if (query.page) filters.page = parseInt(query.page);
    if (query.limit) filters.limit = parseInt(query.limit);

    return filters;
  }

  private handleError(error: any, res: Response): void {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof AuthorizationError) {
      res.status(403).json({ error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
