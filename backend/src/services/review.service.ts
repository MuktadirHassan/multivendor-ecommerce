import { Review } from "@prisma/client";
import { ReviewRepository } from "../repositories/review.repository";
import { ProductRepository } from "../repositories/product.repository";
import { ShopRepository } from "../repositories/shop.repository";
import { NotFoundError, ValidationError } from "../utils/appError";
import { ReviewFilters } from "../types/filters";

export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productRepository: ProductRepository,
    private readonly shopRepository: ShopRepository
  ) {}

  async createReview(userId: number, data: Partial<Review>): Promise<Review> {
    const product = await this.productRepository.findById(data.productId!);
    if (!product) throw new NotFoundError("Product not found");

    const shop = await this.shopRepository.findById(product.shopId);
    if (!shop) throw new NotFoundError("Shop not found");

    return this.reviewRepository.create({
      ...data,
      productId: product.id,
      images: data.images || [],
      rating: data.rating || 0,
      comment: data.comment || "",
      userId,
      shopId: shop.id,
    });
  }

  async updateReview(
    userId: number,
    reviewId: number,
    data: Partial<Review>
  ): Promise<Review> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundError("Review not found");
    if (review.userId !== userId) throw new ValidationError("Unauthorized");

    return this.reviewRepository.update(reviewId, data);
  }

  async deleteReview(userId: number, reviewId: number): Promise<boolean> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundError("Review not found");
    if (review.userId !== userId) throw new ValidationError("Unauthorized");

    return this.reviewRepository.delete(reviewId);
  }

  async getReview(reviewId: number): Promise<Review> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundError("Review not found");
    return review;
  }

  async getReviews(filters: ReviewFilters): Promise<Review[]> {
    return this.reviewRepository.findAll(filters);
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError("Product not found");
    return this.reviewRepository.findByProduct(productId);
  }

  async getShopReviews(shopId: number): Promise<Review[]> {
    const shop = await this.shopRepository.findById(shopId);
    if (!shop) throw new NotFoundError("Shop not found");
    return this.reviewRepository.findByShop(shopId);
  }
}
