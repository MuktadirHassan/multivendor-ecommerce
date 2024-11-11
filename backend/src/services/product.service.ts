import { Product, Prisma } from "@prisma/client";
import { ProductRepository } from "../repositories/postgres/product.repository";
import {
  ValidationError,
  NotFoundError,
  AuthorizationError,
} from "../utils/appError";
import { ProductFilters } from "../types/filters";
import { uploadImage, deleteImage } from "../utils/imageUpload";
import { generateSKU } from "../utils/productUtils";
import { CacheService } from "./cache.service";
import { EventEmitter } from "../utils/eventEmitter";

interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  sellerId: number;
  shopId: number;
  stock: number;
  images?: Express.Multer.File[];
  discount?: number;
}

interface UpdateProductDTO extends Partial<CreateProductDTO> {
  images?: Express.Multer.File[];
  imagesToDelete?: string[];
}

interface ProductWithRelations extends Product {
  category: any;
  shop: any;
  reviews?: any[];
}

export class ProductService {
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly FEATURED_PRODUCTS_KEY = "featured_products";

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter
  ) {}

  async createProduct(dto: CreateProductDTO): Promise<ProductWithRelations> {
    await this.validateProductData(dto);

    try {
      // Handle image uploads if any
      const imageUrls = dto.images
        ? await Promise.all(dto.images.map((image) => uploadImage(image)))
        : [];

      const productData = {
        ...dto,
        images: imageUrls,
        sku: await generateSKU(dto.name, dto.shopId),
        isActive: true,
        rating: 0,
      };

      const product = await this.productRepository.create(productData);

      // Emit event for logging and other side effects
      this.eventEmitter.emit("product:created", {
        productId: product.id,
        sellerId: dto.sellerId,
        shopId: dto.shopId,
      });

      // Invalidate relevant caches
      await this.invalidateRelatedCaches(product.categoryId);

      return product;
    } catch (error) {
      // Cleanup uploaded images if product creation fails
      if (dto.images) {
        await Promise.all(imageUrls.map((url) => deleteImage(url)));
      }
      throw error;
    }
  }

  async updateProduct(
    id: number,
    dto: UpdateProductDTO,
    sellerId: number
  ): Promise<ProductWithRelations> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }

    if (existingProduct.sellerId !== sellerId) {
      throw new AuthorizationError(
        "You are not authorized to update this product"
      );
    }

    await this.validateProductData(dto, true);

    try {
      // Handle new image uploads
      const newImageUrls = dto.images
        ? await Promise.all(dto.images.map((image) => uploadImage(image)))
        : [];

      // Handle image deletions
      if (dto.imagesToDelete?.length) {
        await Promise.all(dto.imagesToDelete.map((url) => deleteImage(url)));
      }

      // Update images array
      const currentImages = existingProduct.images.filter(
        (url) => !dto.imagesToDelete?.includes(url)
      );

      const updatedData = {
        ...dto,
        images: [...currentImages, ...newImageUrls],
      };

      const product = await this.productRepository.update(id, updatedData);

      // Emit event for logging and other side effects
      this.eventEmitter.emit("product:updated", {
        productId: product.id,
        sellerId,
        updates: Object.keys(dto),
      });

      // Invalidate relevant caches
      await this.invalidateRelatedCaches(product.categoryId);

      return product;
    } catch (error) {
      // Cleanup newly uploaded images if update fails
      if (newImageUrls.length) {
        await Promise.all(newImageUrls.map((url) => deleteImage(url)));
      }
      throw error;
    }
  }

  async getProduct(id: number): Promise<ProductWithRelations> {
    const cacheKey = `product:${id}`;
    const cachedProduct = await this.cacheService.get<ProductWithRelations>(
      cacheKey
    );

    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    await this.cacheService.set(cacheKey, product, this.CACHE_TTL);
    return product;
  }

  async getProducts(filters: ProductFilters): Promise<ProductWithRelations[]> {
    return this.productRepository.findWithFilters(filters);
  }

  async getFeaturedProducts(): Promise<ProductWithRelations[]> {
    const cachedProducts = await this.cacheService.get<ProductWithRelations[]>(
      this.FEATURED_PRODUCTS_KEY
    );

    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await this.productRepository.findFeatured();
    await this.cacheService.set(
      this.FEATURED_PRODUCTS_KEY,
      products,
      this.CACHE_TTL
    );

    return products;
  }

  async deleteProduct(id: number, sellerId: number): Promise<boolean> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.sellerId !== sellerId) {
      throw new AuthorizationError(
        "You are not authorized to delete this product"
      );
    }

    try {
      // Delete product images
      await Promise.all(product.images.map((url) => deleteImage(url)));

      const result = await this.productRepository.delete(id);

      // Emit event for logging and other side effects
      this.eventEmitter.emit("product:deleted", {
        productId: id,
        sellerId,
      });

      // Invalidate relevant caches
      await this.invalidateRelatedCaches(product.categoryId);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateStock(
    id: number,
    quantity: number,
    sellerId: number
  ): Promise<ProductWithRelations> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.sellerId !== sellerId) {
      throw new AuthorizationError(
        "You are not authorized to update this product's stock"
      );
    }

    if (product.stock + quantity < 0) {
      throw new ValidationError("Insufficient stock");
    }

    const updatedProduct = await this.productRepository.updateStock(
      id,
      quantity
    );

    // Emit event for logging and inventory tracking
    this.eventEmitter.emit("product:stock_updated", {
      productId: id,
      sellerId,
      previousStock: product.stock,
      newStock: updatedProduct.stock,
      change: quantity,
    });

    // Invalidate product cache
    await this.cacheService.delete(`product:${id}`);

    return updatedProduct;
  }

  async searchProducts(query: string): Promise<ProductWithRelations[]> {
    if (!query.trim()) {
      throw new ValidationError("Search query cannot be empty");
    }

    const cacheKey = `search:${query.toLowerCase()}`;
    const cachedResults = await this.cacheService.get<ProductWithRelations[]>(
      cacheKey
    );

    if (cachedResults) {
      return cachedResults;
    }

    const products = await this.productRepository.searchProducts(query);
    await this.cacheService.set(cacheKey, products, 1800); // Cache for 30 minutes

    return products;
  }

  async getProductsByCategory(
    categoryId: number,
    filters?: Partial<ProductFilters>
  ): Promise<ProductWithRelations[]> {
    const products = await this.productRepository.findByCategory(categoryId);
    return this.applyFilters(products, filters);
  }

  async getProductsByShop(
    shopId: number,
    filters?: Partial<ProductFilters>
  ): Promise<ProductWithRelations[]> {
    const products = await this.productRepository.findByShop(shopId);
    return this.applyFilters(products, filters);
  }

  private async validateProductData(
    data: Partial<CreateProductDTO>,
    isUpdate = false
  ): Promise<void> {
    const errors: string[] = [];

    if (!isUpdate || data.name !== undefined) {
      if (!data.name || data.name.length < 3) {
        errors.push("Product name must be at least 3 characters long");
      }
    }

    if (!isUpdate || data.price !== undefined) {
      if (data.price !== undefined && data.price <= 0) {
        errors.push("Price must be greater than 0");
      }
    }

    if (!isUpdate || data.stock !== undefined) {
      if (data.stock !== undefined && data.stock < 0) {
        errors.push("Stock cannot be negative");
      }
    }

    if (
      data.discount !== undefined &&
      (data.discount < 0 || data.discount > 100)
    ) {
      errors.push("Discount must be between 0 and 100");
    }

    if (data.images) {
      const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
      const invalidImages = data.images.filter(
        (img) => !validImageTypes.includes(img.mimetype)
      );

      if (invalidImages.length > 0) {
        errors.push("Invalid image format. Supported formats: JPEG, PNG, WEBP");
      }

      if (data.images.some((img) => img.size > 5 * 1024 * 1024)) {
        errors.push("Image size must not exceed 5MB");
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(", "));
    }
  }

  private async invalidateRelatedCaches(categoryId: number): Promise<void> {
    await Promise.all([
      this.cacheService.delete(this.FEATURED_PRODUCTS_KEY),
      this.cacheService.delete(`category:${categoryId}:products`),
      this.cacheService.deletePattern("search:*"),
    ]);
  }

  private applyFilters(
    products: ProductWithRelations[],
    filters?: Partial<ProductFilters>
  ): ProductWithRelations[] {
    if (!filters) return products;

    let filtered = [...products];

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    if (filters.rating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= filters.rating!);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const order = filters.sortOrder === "asc" ? 1 : -1;
        return (a[filters.sortBy!] - b[filters.sortBy!]) * order;
      });
    }

    return filtered;
  }
}
