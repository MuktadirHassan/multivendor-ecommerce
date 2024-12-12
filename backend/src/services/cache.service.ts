import { Redis } from "@upstash/redis";

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
    const data = (await this.redis.get(key)) as string;
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), {
      ex: ttl,
    });
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
