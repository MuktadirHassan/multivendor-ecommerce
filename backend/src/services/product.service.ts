import { Product } from "@prisma/client";
import { IProductRepository } from "../repositories/product.repository";
import { NotFoundError, ValidationError } from "../utils/appError";
import { ProductFilters } from "../types/filters";
import { generateSKU } from "../utils/productUtils";
import { EventEmitter } from "../utils/eventEmitter";
import { logger } from "../config/logger";

export class ProductService {
  private productRepository: IProductRepository;
  private eventEmitter: EventEmitter;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
    this.eventEmitter = EventEmitter.getInstance();
  }

  async create(data: Omit<Product, "id">): Promise<Product> {
    const sku = await generateSKU(data.name, data.shopId);
    const product = await this.productRepository.create({
      ...data,
      sku,
    });

    // Emit event for product creation
    this.eventEmitter.emit("product:created", product);
    logger.info({ productId: product.id }, "Product created successfully");

    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const product = await this.findById(id);

    // Handle stock changes
    if (data.stock !== undefined) {
      await this.validateStockUpdate(product, data.stock - product.stock);
    }

    const updatedProduct = await this.productRepository.update(id, data);
    this.eventEmitter.emit("product:updated", updatedProduct);
    logger.info({ productId: id }, "Product updated successfully");

    return updatedProduct;
  }

  async delete(id: number): Promise<boolean> {
    const product = await this.findById(id);
    const result = await this.productRepository.delete(id);

    if (result) {
      this.eventEmitter.emit("product:deleted", product);
      logger.info({ productId: id }, "Product deleted successfully");
    }

    return result;
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  async findWithFilters(filters: ProductFilters): Promise<Product[]> {
    return this.productRepository.findWithFilters(filters);
  }

  async findByShop(shopId: number): Promise<Product[]> {
    return this.productRepository.findByShop(shopId);
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.productRepository.searchProducts(query);
  }

  async findFeatured(): Promise<Product[]> {
    return this.productRepository.findFeatured();
  }

  async updateStock(productId: number, quantity: number): Promise<Product> {
    const product = await this.findById(productId);
    await this.validateStockUpdate(product, quantity);

    const updatedProduct = await this.productRepository.updateStock(
      productId,
      quantity
    );

    // Emit low stock event if threshold reached
    if (updatedProduct.stock <= 5) {
      this.eventEmitter.emit("product:lowStock", {
        productId: productId,
        currentStock: updatedProduct.stock,
      });
    }

    return updatedProduct;
  }

  async verifyProductOwnership(
    productId: number,
    userId: number
  ): Promise<boolean> {
    const product = await this.findById(productId);
    return product.sellerId === userId;
  }

  async verifyShopOwnership(shopId: number, userId: number): Promise<boolean> {
    return this.productRepository.verifyShopOwnership(shopId, userId);
  }

  private async validateStockUpdate(
    product: Product,
    quantityChange: number
  ): Promise<void> {
    const newStock = product.stock + quantityChange;

    if (newStock < 0) {
      throw new ValidationError("Insufficient stock available");
    }

    // Optional: Add maximum stock limit validation
    const MAX_STOCK = 10000;
    if (newStock > MAX_STOCK) {
      throw new ValidationError(`Stock cannot exceed ${MAX_STOCK} units`);
    }
  }

  async updateProductRating(productId: number): Promise<Product> {
    const updatedProduct = await this.productRepository.updateRating(productId);
    this.eventEmitter.emit("product:ratingUpdated", {
      productId: productId,
      newRating: updatedProduct.rating,
    });
    return updatedProduct;
  }
}
