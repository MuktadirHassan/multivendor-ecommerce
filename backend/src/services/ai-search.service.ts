import { PrismaClient } from "@prisma/client";
import { GeminiService } from "./gemini.service";
import { CacheService } from "./cache.service";
import { ProductRepository } from "../repositories/product.repository";
import { logger } from "../config/logger";
import { OrderRepository } from "../repositories/order.repository";
import { ProductFilters } from "../types/filters";

export class SearchService {
  private cache: CacheService;

  constructor(
    private readonly gemini: GeminiService,
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository
  ) {
    this.cache = CacheService.getInstance();
  }

  async searchProducts(query: string, filters?: ProductFilters) {
    const cacheKey = `search:${query}:${JSON.stringify(filters)}`;

    // Check cache first
    const cachedResults = await this.cache.get(cacheKey);
    if (cachedResults) {
      logger.info("Search results returned from cache");
      return cachedResults;
    }

    // Get base products based on filters
    const products = await this.productRepository.findWithFilters(
      filters || {}
    );

    // Perform semantic search
    const results = await this.gemini.searchProducts(query, products);

    // Cache results for 1 hour
    await this.cache.set(cacheKey, results, 3600);

    return results;
  }

  async getRecommendations(userId: number) {
    const cacheKey = `recommendations:${userId}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Get user's order history
    const orders = await this.orderRepository.findByUser(userId);
    const allProducts = await this.productRepository.findAll();

    const recommendations = await this.gemini.generateRecommendations(
      userId,
      orders,
      allProducts
    );

    await this.cache.set(cacheKey, recommendations, 7200); // Cache for 2 hours

    return recommendations;
  }
}
