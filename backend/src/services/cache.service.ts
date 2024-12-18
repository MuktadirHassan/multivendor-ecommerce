import { Redis } from "@upstash/redis";
import { logger } from "../config/logger";

export class CacheService {
  private redis: Redis;
  private static instance: CacheService;

  private constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL as string,
      token: process.env.UPSTASH_REDIS_TOKEN as string,
    });
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);

      if (!data) {
        return null;
      }

      // Handle case where data is already an object
      if (typeof data === "object") {
        return data as T;
      }

      // Handle string data that needs parsing
      try {
        return JSON.parse(data as string) as T;
      } catch (parseError) {
        // If parsing fails, return the raw data if it matches the expected type
        return data as T;
      }
    } catch (error) {
      logger.error({ error, key }, "Cache get operation failed");
      return null;
    }
  }

  async set(key: string, value: any, ttl: number): Promise<boolean> {
    try {
      const serializedValue =
        typeof value === "string" ? value : JSON.stringify(value);

      await this.redis.set(key, serializedValue, {
        ex: ttl,
      });

      return true;
    } catch (error) {
      logger.error({ error, key }, "Cache set operation failed");
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      logger.error({ error, key }, "Cache delete operation failed");
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<boolean> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error({ error, pattern }, "Cache deletePattern operation failed");
      return false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      logger.error("Redis health check failed");
      return false;
    }
  }
}

// Type-safe cache key enum
export enum CacheKey {
  PRODUCT_SEARCH = "product:search:",
  PRODUCT_DETAILS = "product:details:",
  CATEGORY_LIST = "category:list",
  SHOP_DETAILS = "shop:details:",
  USER_PROFILE = "user:profile:",
}

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;
