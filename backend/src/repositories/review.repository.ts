import { BaseRepository } from "../types/repository";
import { PrismaClient, Review, Prisma } from "@prisma/client";
import { ReviewFilters } from "../types/filters";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "../utils/appError";

export interface IReviewRepository extends BaseRepository<Review> {
  findByProduct(productId: number): Promise<Review[]>;
  findByShop(shopId: number): Promise<Review[]>;
  findByUser(userId: number): Promise<Review[]>;
  getAverageRating(productId: number): Promise<number>;
  getShopAverageRating(shopId: number): Promise<number>;
  findWithFilters(filters: ReviewFilters): Promise<Review[]>;
}

export class ReviewRepository implements IReviewRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Review | null> {
    try {
      return await this.prisma.review.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findAll(params?: Partial<ReviewFilters>): Promise<Review[]> {
    try {
      const { page = 1, limit = 10, ...filters } = params || {};
      const skip = (page - 1) * limit;

      return await this.prisma.review.findMany({
        where: this.buildWhereClause(filters),
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: this.buildOrderByClause(filters),
        skip,
        take: limit,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    data: Omit<Review, "id" | "createdAt" | "updatedAt">
  ): Promise<Review> {
    try {
      await this.validateReviewData(data);

      const review = await this.prisma.review.create({
        data,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      // Update product and shop ratings
      await Promise.all([
        this.updateProductRating(data.productId),
        this.updateShopRating(data.shopId),
      ]);

      return review;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number, data: Partial<Review>): Promise<Review> {
    try {
      const existingReview = await this.findById(id);
      if (!existingReview) {
        throw new NotFoundError("Review not found");
      }

      if (data.rating) {
        await this.validateRating(data.rating);
      }

      const review = await this.prisma.review.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      // Update ratings if rating was changed
      if (data.rating) {
        await Promise.all([
          this.updateProductRating(review.productId),
          this.updateShopRating(review.shopId),
        ]);
      }

      return review;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const review = await this.findById(id);
      if (!review) {
        throw new NotFoundError("Review not found");
      }

      await this.prisma.review.delete({
        where: { id },
      });

      // Update ratings after deletion
      await Promise.all([
        this.updateProductRating(review.productId),
        this.updateShopRating(review.shopId),
      ]);

      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByProduct(productId: number): Promise<Review[]> {
    try {
      return await this.prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByShop(shopId: number): Promise<Review[]> {
    try {
      return await this.prisma.review.findMany({
        where: { shopId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByUser(userId: number): Promise<Review[]> {
    try {
      return await this.prisma.review.findMany({
        where: { userId },
        include: {
          product: true,
          shop: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findWithFilters(filters: ReviewFilters): Promise<Review[]> {
    try {
      return await this.prisma.review.findMany({
        where: this.buildWhereClause(filters),
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: this.buildOrderByClause(filters),
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAverageRating(productId: number): Promise<number> {
    try {
      const result = await this.prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
      });
      return result._avg.rating || 0;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getShopAverageRating(shopId: number): Promise<number> {
    try {
      const result = await this.prisma.review.aggregate({
        where: { shopId },
        _avg: { rating: true },
      });
      return result._avg.rating || 0;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async validateReviewData(data: Partial<Review>): Promise<void> {
    // Validate rating
    await this.validateRating(data.rating!);

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product) {
      throw new ValidationError("Product not found");
    }

    // Check if shop exists
    const shop = await this.prisma.shop.findUnique({
      where: { id: data.shopId },
    });
    if (!shop) {
      throw new ValidationError("Shop not found");
    }

    // Check if user already reviewed this product
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId: data.userId,
        productId: data.productId,
      },
    });
    if (existingReview) {
      throw new ValidationError("User has already reviewed this product");
    }
  }

  private async validateRating(rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new ValidationError("Rating must be between 1 and 5");
    }
  }

  private async updateProductRating(productId: number): Promise<void> {
    const averageRating = await this.getAverageRating(productId);
    await this.prisma.product.update({
      where: { id: productId },
      data: { rating: averageRating },
    });
  }

  private async updateShopRating(shopId: number): Promise<void> {
    const averageRating = await this.getShopAverageRating(shopId);
    await this.prisma.shop.update({
      where: { id: shopId },
      data: { rating: averageRating },
    });
  }

  private buildWhereClause(
    filters: Partial<ReviewFilters>
  ): Prisma.ReviewWhereInput {
    const where: Prisma.ReviewWhereInput = {};

    if (filters.rating) {
      where.rating = {
        gte: filters.rating,
      };
    }

    return where;
  }

  private buildOrderByClause(
    filters: Partial<ReviewFilters>
  ): Prisma.ReviewOrderByWithRelationInput {
    const { sortBy = "createdAt", sortOrder = "desc" } = filters;
    return { [sortBy]: sortOrder };
  }

  private handleError(error: any): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ValidationError("Duplicate review");
        case "P2003":
          throw new ValidationError("Invalid reference");
        case "P2025":
          throw new NotFoundError("Record not found");
        default:
          throw new DatabaseError(`Database error: ${error.message}`);
      }
    }

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }

    throw new DatabaseError("Internal server error");
  }
}
