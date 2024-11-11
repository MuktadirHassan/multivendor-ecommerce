import { Review } from "@prisma/client";
import { BaseRepository } from "../types/repository";
import { ReviewFilters } from "../types/filters";

export interface IReviewRepository extends BaseRepository<Review> {
  findByProduct(productId: number): Promise<Review[]>;
  findByShop(shopId: number): Promise<Review[]>;
  findByUser(userId: number): Promise<Review[]>;
  getAverageRating(productId: number): Promise<number>;
  getShopAverageRating(shopId: number): Promise<number>;
  findWithFilters(filters: ReviewFilters): Promise<Review[]>;
}
